import type { AdminMe } from '../state';

export type LoginResponse = {
  object?: string;
  data?: { token: string; expiresAt?: string };
};

export type MeResponse = {
  object?: string;
  data: AdminMe;
};
