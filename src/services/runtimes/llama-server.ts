import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import type { OpenAiChatCompletion } from '../../interfaces/open-ai-chat-completion.interface';

export function llamaServerBin(): string | null {
  const override = process.env.OMNI_LLAMA_SERVER?.trim();
  if (override && fs.existsSync(override)) return override;
  const r = spawnSync('which', ['llama-server'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}

export function healthTimeoutMs(filePath: string): number {
  try {
    const mb = fs.statSync(filePath).size / (1024 * 1024);
    return Math.min(180_000, Math.max(15_000, 15_000 + mb * 150));
  } catch {
    return 30_000;
  }
}

export async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
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

export type SpawnedLlama = {
  child: ChildProcess;
  port: number;
};

export async function spawnLlamaServer(modelPath: string): Promise<SpawnedLlama> {
  const bin = llamaServerBin();
  if (!bin) {
    throw new Error('llama-server is not on PATH');
  }
  const port = pickPort();
  const child: ChildProcess = spawn(
    bin,
    ['-m', modelPath, '--host', '127.0.0.1', '--port', String(port)],
    { stdio: 'ignore' },
  );
  try {
    await waitForHttp(`http://127.0.0.1:${port}/health`, healthTimeoutMs(modelPath));
    return { child, port };
  } catch (err) {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
    throw err;
  }
}

export async function proxyLlamaJson(
  port: number,
  opts: {
    model: string;
    messages: Array<{ role?: string; content?: unknown }>;
  },
): Promise<OpenAiChatCompletion> {
  const res = await fetch(`http://127.0.0.1:${port}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: false,
    }),
  });
  if (!res.ok) {
    throw new Error(`llama-server chat HTTP ${res.status}`);
  }
  const body = (await res.json()) as OpenAiChatCompletion;
  if (!body || body.object !== 'chat.completion') {
    throw new Error('llama-server returned a non-chat completion');
  }
  return body;
}

export async function proxyLlamaStream(
  port: number,
  opts: {
    model: string;
    messages: Array<{ role?: string; content?: unknown }>;
  },
): Promise<Response> {
  const res = await fetch(`http://127.0.0.1:${port}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`llama-server stream HTTP ${res.status}`);
  }
  return res;
}

/** @deprecated one-shot spawn used by older tests; prefer EngineManager */
export async function chatLlamaServer(opts: {
  modelPath: string;
  messages: Array<{ role?: string; content?: unknown }>;
  model: string;
}): Promise<OpenAiChatCompletion | null> {
  if (!llamaServerBin()) return null;
  const spawned = await spawnLlamaServer(opts.modelPath);
  try {
    return await proxyLlamaJson(spawned.port, {
      model: opts.model,
      messages: opts.messages,
    });
  } finally {
    try {
      spawned.child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }
}
