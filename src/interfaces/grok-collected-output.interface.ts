/** Token usage from Grok CLI end event (when present). */
export type GrokUsage = {
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

export type GrokToolCall = {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
};

/** Aggregated stream/non-stream output used when auditing chat results. */
export interface GrokCollectedOutput {
  text: string;
  reasoning: string;
  sessionId?: string;
  stopReason?: string;
  requestId?: string;
  usage?: GrokUsage;
  numTurns?: number;
  toolCalls?: GrokToolCall[];
}
