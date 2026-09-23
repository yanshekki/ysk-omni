/**
 * Shared helpers for OpenAI / Anthropic style message content
 * (string | content-part array) and multi-turn prompt building.
 */

export function flattenMessageContent(
  content: string | Array<Record<string, unknown>> | null | undefined,
): string {
  if (content == null) return '';
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return String(content);
  return content
    .map((p) => {
      if (!p || typeof p !== 'object') return '';
      if (typeof p.text === 'string') return p.text;
      if (p.type === 'text' && typeof p.text === 'string') return p.text;
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

export function messageHasImageParts(
  content: string | Array<Record<string, unknown>> | null | undefined,
): boolean {
  if (!Array.isArray(content)) return false;
  return content.some((p) => {
    if (!p || typeof p !== 'object') return false;
    const t = p.type;
    return (
      t === 'image_url' ||
      t === 'input_image' ||
      t === 'image' ||
      'image_url' in p
    );
  });
}

/**
 * Build a text prompt from role/content messages.
 * Multi-turn: role + content; tool_calls / tool results included for context.
 */
export function messagesToPrompt(
  messages: Array<{
    role: string;
    content: string | null;
    reasoning_content?: string | null;
    tool_call_id?: string;
    tool_calls?: Array<{
      id?: string;
      function?: { name?: string; arguments?: string };
    }>;
  }>,
): string {
  if (messages.length === 1 && !messages[0]?.tool_calls?.length) {
    return messages[0]?.content ?? '';
  }
  return messages
    .map((m) => {
      if (m.role === 'tool') {
        const id = m.tool_call_id ? ` id=${m.tool_call_id}` : '';
        return `tool_result${id}: ${m.content ?? ''}`;
      }
      if (m.tool_calls?.length) {
        const tc = m.tool_calls
          .map(
            (t) =>
              `${t.function?.name || 'tool'}(${t.function?.arguments || ''})`,
          )
          .join('; ');
        const base = m.content?.trim() ? `${m.role}: ${m.content}\n` : '';
        return `${base}${m.role}_tool_calls: ${tc}`;
      }
      return `${m.role}: ${m.content ?? ''}`;
    })
    .join('\n');
}
