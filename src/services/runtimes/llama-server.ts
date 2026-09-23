import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import { findEntry } from '../hf/registry';
import type { OpenAiChatCompletion } from '../../interfaces/open-ai-chat-completion.interface';

export function llamaServerBin(): string | null {
  const override = process.env.OMNI_LLAMA_SERVER?.trim();
  if (override && fs.existsSync(override)) return override;
  const r = spawnSync('which', ['llama-server'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}

async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  let last = '';
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
      last = `HTTP ${res.status}`;
    } catch (err) {
      last = err instanceof Error ? err.message : String(err);
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(`llama-server did not become ready: ${last}`);
}

function pickPort(): number {
  return 19000 + Math.floor(Math.random() * 1000);
}

export async function chatLlamaServer(opts: {
  modelPath: string;
  messages: Array<{ role?: string; content?: unknown }>;
  model: string;
}): Promise<OpenAiChatCompletion | null> {
  const bin = llamaServerBin();
  if (!bin) return null;
  const port = pickPort();
  const child: ChildProcess = spawn(
    bin,
    ['-m', opts.modelPath, '--host', '127.0.0.1', '--port', String(port)],
    { stdio: 'ignore' },
  );
  try {
    await waitForHttp(`http://127.0.0.1:${port}/health`, 8_000);
    const res = await fetch(`http://127.0.0.1:${port}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as OpenAiChatCompletion;
    if (!body || body.object !== 'chat.completion') return null;
    return body;
  } finally {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }
}

/**
 * Pulled GGUF + llama-server on PATH → OpenAI chat JSON.
 * Returns null when the binary or weights are missing.
 */
export async function tryLlamaChat(
  model: string,
  messages: Array<{ role?: string; content?: unknown }>,
): Promise<OpenAiChatCompletion | null> {
  const bin = llamaServerBin();
  if (!bin) return null;
  const entry = findEntry(model);
  if (!entry?.path || !fs.existsSync(entry.path)) return null;
  return chatLlamaServer({
    modelPath: entry.path,
    messages,
    model,
  });
}
