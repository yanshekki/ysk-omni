import { flattenMessageContent } from '../../utils/message-content';
import { mapEngineToChatCompletion, mapTextDeltaChunk, mapRoleChunk, mapFinishChunk } from '../../utils/openai-mapper';
import type { OpenAiChatCompletion } from '../../interfaces/open-ai-chat-completion.interface';
import type { OpenAiChatCompletionChunk } from '../../interfaces/open-ai-chat-completion-chunk.interface';
import { createChatCompletionId } from '../../utils/id';

export const ECHO_MODEL_ID = 'echo';

export function isEchoModel(model: string | undefined | null): boolean {
  const m = (model || '').trim().toLowerCase();
  return m === ECHO_MODEL_ID || m === 'echo:latest' || m.startsWith('echo:');
}

export function echoReplyFromMessages(
  messages: Array<{ role?: string; content?: unknown }>,
): string {
  const users = messages.filter((m) => m.role === 'user');
  const last = users[users.length - 1] || messages[messages.length - 1];
  const text = flattenMessageContent(
    (last?.content as string | Array<Record<string, unknown>> | null) ?? '',
  ).trim();
  const body = text || 'ok';
  return `Echo: ${body}`;
}

export function echoCompletion(
  model: string,
  messages: Array<{ role?: string; content?: unknown }>,
): OpenAiChatCompletion {
  const text = echoReplyFromMessages(messages);
  return mapEngineToChatCompletion(model || ECHO_MODEL_ID, { text }, {
    includeReasoning: false,
  });
}

export function echoChunks(
  model: string,
  messages: Array<{ role?: string; content?: unknown }>,
): OpenAiChatCompletionChunk[] {
  const text = echoReplyFromMessages(messages);
  const id = createChatCompletionId();
  const created = Math.floor(Date.now() / 1000);
  const m = model || ECHO_MODEL_ID;
  return [
    mapRoleChunk(m, id, created),
    mapTextDeltaChunk(m, text, id, created),
    mapFinishChunk(m, id, created, 'stop'),
  ];
}
