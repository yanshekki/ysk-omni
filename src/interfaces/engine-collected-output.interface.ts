/** Token usage from local engine end event (when present). */
export type EngineUsage = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  reasoning_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  usage_is_incomplete?: boolean;
  cost_is_partial?: boolean;
  total_cost_usd?: number;
  total_cost_usd_ticks?: number;
};

export type EngineToolCall = {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
};

/** Aggregated stream/non-stream output used when auditing chat results. */
export interface EngineCollectedOutput {
  text: string;
  reasoning: string;
  sessionId?: string;
  stopReason?: string;
  requestId?: string;
  usage?: EngineUsage;
  numTurns?: number;
  toolCalls?: EngineToolCall[];
}
