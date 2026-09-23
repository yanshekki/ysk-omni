import type { RenderCtx } from '../router';
import { renderChatPlayground } from './chat/playground';

/** Full chat playground (stream, history, docs, compress) — ported from app.js */
export async function renderChatPage(ctx: RenderCtx): Promise<void> {
  await renderChatPlayground(ctx);
}
