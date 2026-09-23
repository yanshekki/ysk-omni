/** OpenAI Responses API object (text subset we implement) */
export interface OpenAiResponseOutputText {
  type: 'output_text';
  text: string;
  annotations: unknown[];
}

export interface OpenAiResponseOutputMessage {
  type: 'message';
  id: string;
  status: 'completed' | 'in_progress';
  role: 'assistant';
  content: OpenAiResponseOutputText[];
}

export interface OpenAiResponse {
  id: string;
  object: 'response';
  created_at: number;
  status: 'completed' | 'in_progress' | 'failed';
  error: null | { message: string; code?: string };
  incomplete_details: null;
  model: string;
  output: OpenAiResponseOutputMessage[];
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}
