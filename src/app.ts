import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import routes from './routes';
import adminRoutes from './routes/admin.routes';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import {
  globalRateLimiter,
  ipBlockMiddleware,
} from './middlewares/rate-limit.middleware';
import {
  applyExpressTrustProxy,
  clientIpMiddleware,
} from './middlewares/client-ip.middleware';
import { connectionTrackerMiddleware } from './middlewares/connection-tracker.middleware';
import { errorMiddleware, notFoundHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import { ipBlacklistService } from './services/ip-blacklist.service';
import { settingsService } from './services/settings.service';
import {
  expressTrustProxySetting,
  setProxyIpConfig,
} from './utils/client-ip';
import './interfaces/express.interface';

/** Bust browser cache when any production admin SPA asset changes */
function adminAssetVersion(adminDir: string): string {
  try {
    // Production still serves full app.js via boot.js until TS migration is complete.
    const files = [
      'boot.js',
      'app.js',
      'i18n.js',
      'styles.css',
      'index.html',
      'allowed-extensions.js',
    ];
    let max = 0;
    for (const f of files) {
      try {
        const st = fs.statSync(path.join(adminDir, f));
        max = Math.max(max, st.mtimeMs);
      } catch {
        /* ignore */
      }
    }
    return String(Math.floor(max) || Date.now());
  } catch {
    return String(Date.now());
  }
}

function renderAdminIndex(adminDir: string): string {
  const raw = fs.readFileSync(path.join(adminDir, 'index.html'), 'utf8');
  const v = adminAssetVersion(adminDir);
  // Only replace the explicit token — never regex-match app.js paths
  // (that would corrupt template literals like `/admin/app.js?v=${V}`).
  return raw.replaceAll('__ADMIN_ASSET_V__', v);
}

async function isAdminPanelOpen(): Promise<boolean> {
  if (!env.ADMIN_PANEL_ENABLED) return false;
  try {
    const s = await settingsService.getAll();
    return s.adminPanelEnabled;
  } catch {
    // DB down: fall back to env only
    return env.ADMIN_PANEL_ENABLED;
  }
}

export function createApp() {
  // Seed proxy IP config from env; bootstrap + policy load override with DB policy
  setProxyIpConfig({
    trustHops: env.trustProxyHops,
    source: env.PROXY_IP_SOURCE,
  });

  // Prefer already-loaded state from bootstrap; still safe if called early (tests)
  void ipBlacklistService.ensureLoaded().catch(() => undefined);

  const app = express();

  // Initial trust-proxy from env (policy rebuild updates hops at runtime)
  app.set('trust proxy', expressTrustProxySetting(env.trustProxyHops));

  void import('./services/ddos-policy.service')
    .then(({ ddosPolicyService }) => {
      ddosPolicyService.onRebuild(() => applyExpressTrustProxy(app));
      // load() is idempotent; bootstrap usually already loaded
      return ddosPolicyService.load();
    })
    .then(() => applyExpressTrustProxy(app))
    .catch(() => undefined);

  app.disable('x-powered-by');

  app.use(
    helmet({
      // Admin SPA: same-origin JS + Google Fonts. No inline scripts (boot.js loads app.js).
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'style-src-elem': [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:', 'blob:'],
          // Media library lightbox uses blob: object URLs for <video>/<audio>
          'media-src': ["'self'", 'blob:'],
          // PDF preview iframe also uses blob:
          'frame-src': ["'self'", 'blob:'],
          'connect-src': ["'self'"],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'frame-ancestors': ["'none'"],
          'form-action': ["'self'"],
        },
      },
    }),
  );
  app.use(cors(corsOptions));
  app.use(requestIdMiddleware);
  app.use(clientIpMiddleware);
  app.use(connectionTrackerMiddleware);
  app.use(ipBlockMiddleware);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as express.Request).requestId,
      customProps: (req) => ({
        requestId: (req as express.Request).requestId,
      }),
      autoLogging: {
        ignore: (req) =>
          req.url === '/health' ||
          req.url === '/ready' ||
          (req.url?.startsWith('/admin') && !req.url.startsWith('/admin/api')),
      },
    }),
  );
  app.use(express.json({ limit: env.BODY_LIMIT }));
  app.use(express.urlencoded({ extended: false, limit: env.BODY_LIMIT }));
  app.use(globalRateLimiter);

  // Admin JSON API (self-gates with ensureAdminPanel)
  app.use('/admin/api', adminRoutes);

  const adminDir = path.join(process.cwd(), 'public', 'admin');
  const disabledPage = path.join(adminDir, 'disabled.html');

  // Gate SPA when panel is off — only serve disabled page (+ logo for branding)
  app.use('/admin', async (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    const open = await isAdminPanelOpen();
    if (open) {
      next();
      return;
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    // Allow logo for disabled page
    if (req.path === '/assets/logo.svg') {
      res.sendFile(path.join(adminDir, 'assets', 'logo.svg'), (err) => {
        if (err) next();
      });
      return;
    }
    res.status(503).sendFile(disabledPage, (err) => {
      if (err) {
        res
          .status(503)
          .type('html')
          .send(
            '<!doctype html><meta charset="utf-8"><title>Admin off</title><body style="font-family:system-ui;padding:2rem"><h1>Admin panel disabled</h1><p>Run: <code>gctoac admin on</code></p></body>',
          );
      }
    });
  });

  // Admin SPA static files (only reached when panel open)
  // no-store for JS/CSS/HTML so i18n updates always reach the browser
  app.use(
    '/admin',
    express.static(adminDir, {
      index: false, // always use dynamic index below
      etag: false,
      lastModified: false,
      maxAge: 0,
      setHeaders(res, filePath) {
        if (/\.(js|css|html|svg)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
        }
      },
    }),
  );
  app.get(['/admin', '/admin/', '/admin/index.html'], async (_req, res, next) => {
    try {
      const open = await isAdminPanelOpen();
      if (!open) {
        res.setHeader('Cache-Control', 'no-store');
        res.status(503).sendFile(disabledPage, (err) => {
          if (err) next();
        });
        return;
      }
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.type('html').send(renderAdminIndex(adminDir));
    } catch (e) {
      next(e);
    }
  });
  app.get(['/admin/*'], async (req, res, next) => {
    if (req.path.startsWith('/admin/api') || req.path.startsWith('/api')) {
      next();
      return;
    }
    // SPA fallback only for non-file routes
    if (path.extname(req.path)) {
      next();
      return;
    }
    try {
      const open = await isAdminPanelOpen();
      if (!open) {
        res.setHeader('Cache-Control', 'no-store');
        res.status(503).sendFile(disabledPage, (err) => {
          if (err) next();
        });
        return;
      }
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.type('html').send(renderAdminIndex(adminDir));
    } catch (e) {
      next(e);
    }
  });

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorMiddleware);

  return app;
}
