import type { Request, Response } from 'express';
import { adminOtpLoginSchema } from '../../dto/admin-auth.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { adminAuthService, isSessionToken } from '../../services/admin-auth.service';
import { requestIp } from '../../utils/client-ip';
import {
  clearFailedAuth,
  recordFailedAuth,
} from '../../middlewares/rate-limit.middleware';

function extractBearer(req: Request): string | null {
  const header = req.header('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(/\s+/);
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;
  return token.trim();
}

/** Public + authenticated admin auth endpoints */
export const adminAuthHandlers = {
  /** POST /auth/login — exchange OTP for session token */
  login: asyncHandler(async (req: Request, res: Response) => {
    const parsed = adminOtpLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ExceptionFactory.validation('Login code is required');
    }
    try {
      const result = await adminAuthService.loginWithOtp(parsed.data.code, {
        ip: requestIp(req),
        userAgent: req.header('user-agent') ?? undefined,
      });
      clearFailedAuth(req);
      res.json({
        object: 'admin.session',
        data: {
          token: result.token,
          expiresAt: result.expiresAt.toISOString(),
          tokenType: 'Bearer',
        },
      });
    } catch (err) {
      recordFailedAuth(req);
      throw err;
    }
  }),

  /** POST /auth/logout — revoke current session */
  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = extractBearer(req);
    if (token && isSessionToken(token)) {
      await adminAuthService.logout(token, requestIp(req));
    }
    res.json({ object: 'admin.session.deleted', data: { ok: true } });
  }),
};
