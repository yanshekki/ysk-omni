export interface OpenAiChatCompletionChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string | null;
    /** DeepSeek-compatible chain-of-thought */
    reasoning_content?: string | null;
    /**
     * Grok alias of reasoning_content (same text).
     * Kept for Grok-oriented clients; mainstream clients use reasoning_content.
     */
    thought?: string | null;
    tool_calls?: Array<{
      id: string;
      type: 'function';
      function: { name: string; arguments: string };
    }>;
  };
  finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls' | null;
  logprobs: null;
}
