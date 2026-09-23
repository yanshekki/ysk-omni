import type { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (env.corsOrigins.includes('*')) {
      if (env.isProd) {
        callback(new Error('CORS origin * is not allowed in production'));
        return;
      }
      callback(null, true);
      return;
    }
    if (env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 600,
};
