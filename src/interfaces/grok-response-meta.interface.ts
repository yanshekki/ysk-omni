/** Grok-native metadata (extension; ignored by standard OpenAI clients) */
export interface GrokResponseMeta {
  sessionId?: string;
  stopReason?: string;
  requestId?: string;
  numTurns?: number;
  cost?: {
    total_cost_usd?: number;
    total_cost_usd_ticks?: number;
    cost_is_partial?: boolean;
    usage_is_incomplete?: boolean;
  };
}
