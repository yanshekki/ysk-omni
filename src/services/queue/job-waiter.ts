import { EventEmitter } from 'node:events';
import type { Response } from 'express';
import type { OpenAiChatCompletion } from '../../interfaces';

export type JobWaiterEvents = {
  queue: { position: number; jobId: string };
  started: { jobId: string };
  done: { jobId: string; result?: OpenAiChatCompletion };
  error: { jobId: string; error: Error };
};

type WaiterEntry = {
  res?: Response;
  ee: EventEmitter;
  createdAt: number;
};

/**
 * Bridges HTTP request handlers with the background chat worker.
 * Stream: worker writes to attached Response.
 * Non-stream: worker emits `done` with completion JSON.
 */
export class JobWaiterRegistry {
  private entries = new Map<string, WaiterEntry>();

  register(jobId: string, res?: Response): EventEmitter {
    const existing = this.entries.get(jobId);
    if (existing) {
      if (res) existing.res = res;
      return existing.ee;
    }
    const ee = new EventEmitter();
    ee.setMaxListeners(20);
    this.entries.set(jobId, { res, ee, createdAt: Date.now() });
    return ee;
  }

  attachResponse(jobId: string, res: Response): void {
    const e = this.entries.get(jobId);
    if (e) e.res = res;
    else this.register(jobId, res);
  }

  getResponse(jobId: string): Response | undefined {
    const res = this.entries.get(jobId)?.res;
    if (!res) return undefined;
    // Client gone — treat as no live stream target (avoid worker DLQ)
    if (res.writableEnded || res.destroyed) {
      return undefined;
    }
    return res;
  }

  emitQueue(jobId: string, position: number): void {
    this.entries.get(jobId)?.ee.emit('queue', { position, jobId });
  }

  emitStarted(jobId: string): void {
    this.entries.get(jobId)?.ee.emit('started', { jobId });
  }

  emitDone(jobId: string, result?: OpenAiChatCompletion): void {
    this.entries.get(jobId)?.ee.emit('done', { jobId, result });
    this.cleanup(jobId);
  }

  emitError(jobId: string, error: Error): void {
    this.entries.get(jobId)?.ee.emit('error', { jobId, error });
    this.cleanup(jobId);
  }

  cleanup(jobId: string): void {
    const e = this.entries.get(jobId);
    if (e) {
      e.ee.removeAllListeners();
      this.entries.delete(jobId);
    }
  }

  /** Drop stale waiters (client gone without finish). */
  purgeOlderThan(ms: number): number {
    const now = Date.now();
    let n = 0;
    for (const [id, e] of this.entries) {
      if (now - e.createdAt > ms) {
        this.cleanup(id);
        n += 1;
      }
    }
    return n;
  }
}

export const jobWaiterRegistry = new JobWaiterRegistry();
