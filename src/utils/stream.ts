import type { Response } from 'express';

function tryFlush(res: Response): void {
  // compression middleware / some proxies expose flush
  const anyRes = res as Response & { flush?: () => void };
  if (typeof anyRes.flush === 'function') {
    try {
      anyRes.flush();
    } catch {
      /* ignore */
    }
  }
}

export function initSse(res: Response): void {
  // Disable request socket timeout so long Grok streams are not cut
  try {
    reqSocketSetTimeout(res, 0);
  } catch {
    /* ignore */
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // nginx: disable response buffering
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }
  // Immediate padding comment helps some proxies flush the first bytes
  res.write(': ok\n\n');
  tryFlush(res);
}

function reqSocketSetTimeout(res: Response, ms: number): void {
  const sock = res.socket;
  if (sock && typeof sock.setTimeout === 'function') {
    sock.setTimeout(ms);
  }
  // Also clear idle timeout on the request if present
  const req = (res as Response & { req?: { setTimeout?: (n: number) => void } }).req;
  if (req && typeof req.setTimeout === 'function') {
    req.setTimeout(ms);
  }
}

export function writeSseData(res: Response, data: unknown): void {
  if (res.writableEnded) return;
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  tryFlush(res);
}

/** Named SSE event (Anthropic / Responses style). */
export function writeSseEvent(
  res: Response,
  event: string,
  data: unknown,
): void {
  if (res.writableEnded) return;
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  tryFlush(res);
}

export function writeSseDone(res: Response): void {
  if (res.writableEnded) return;
  res.write('data: [DONE]\n\n');
  tryFlush(res);
}
