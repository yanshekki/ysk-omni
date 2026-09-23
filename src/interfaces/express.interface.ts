import type { AuthenticatedApiKey } from './authenticated-api-key.interface';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      apiKey?: AuthenticatedApiKey;
      /** Resolved client IP (proxy-aware). Prefer over req.ip for bans / limits. */
      clientIp?: string;
    }
  }
}

export {};
