import { endpoints } from '../config/endpoints';
import { apiGet, apiPost, apiSend } from '../lib/http';
import type { LoginResponse, MeResponse } from '../types/api/auth';
import type { AdminMe } from '../types/state';
import { getState, patchState, setToken } from '../state/store';

export const authService = {
  async loginWithOtp(code: string): Promise<string> {
    const res = await apiSend<LoginResponse>(endpoints.auth.login, {
      method: 'POST',
      body: { code },
      noAuth: true,
    });
    const token = res?.data?.token;
    if (!token) throw new Error('No token in login response');
    setToken(token);
    return token;
  },

  async me(): Promise<AdminMe> {
    const res = await apiGet<MeResponse>(endpoints.me);
    patchState({ me: res.data });
    return res.data;
  },

  async ensureMe(): Promise<AdminMe | null> {
    if (!getState().key) return null;
    if (getState().me) return getState().me;
    return this.me();
  },

  logoutSession(): Promise<unknown> {
    return apiPost(endpoints.auth.logout, {});
  },
};
