export type GrokStreamEvent =
  | { type: 'text'; data: string }
  | { type: 'thought'; data: string }
  | {
      type: 'end';
      stopReason?: string;
      sessionId?: string;
      requestId?: string;
      usage?: unknown;
      num_turns?: number;
      [key: string]: unknown;
    }
  | { type: string; data?: unknown; [key: string]: unknown };
