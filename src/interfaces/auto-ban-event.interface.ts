import type { BanSource } from '../config/constants';

export interface AutoBanEvent {
  id: string;
  ip: string;
  reason: string;
  source: BanSource;
  durationMs: number;
  escalated: boolean;
  at: number;
}
