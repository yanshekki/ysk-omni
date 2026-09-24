import type { EngineJsonResult } from './engine-json-result.interface';

export interface EngineRunResult {
  text: string;
  stopReason?: string;
  sessionId?: string;
  raw: EngineJsonResult;
}
