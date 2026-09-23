import type { NextFunction, Request, Response } from 'express';
import {
  expressTrustProxySetting,
  getClientIp,
  getProxyIpConfig,
} from '../utils/client-ip';

/**
 * Resolve real client IP (nginx / Cloudflare aware) onto req.clientIp.
 * Must run after Express trust-proxy is configured.
 */
export function clientIpMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.clientIp = getClientIp(req);
  next();
}

/** Apply current proxy hops to an Express app (also on policy rebuild). */
export function applyExpressTrustProxy(app: {
  set: (k: string, v: unknown) => void;
}): void {
  const { trustHops } = getProxyIpConfig();
  app.set('trust proxy', expressTrustProxySetting(trustHops));
}
