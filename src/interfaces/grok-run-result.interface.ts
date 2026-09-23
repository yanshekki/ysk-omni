import type { GrokJsonResult } from './grok-json-result.interface';

export interface GrokRunResult {
  text: string;
  stopReason?: string;
  sessionId?: string;
  raw: GrokJsonResult;
}
