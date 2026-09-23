import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { chatQueueService } from './chat-queue.service';
import type {
  ChatQueueBackend,
  QueueBackendKind,
} from './queue-backend.interface';
import { parseQueueBackendKind } from './queue-backend.interface';

/**
 * Resolve the active queue backend.
 * Only `sqlite` is implemented today (ChatJob + in-process worker).
 * `redis` / `kafka` are extension points for multi-node scale-out.
 */
export function createQueueBackend(
  kind: QueueBackendKind = parseQueueBackendKind(env.QUEUE_BACKEND),
): ChatQueueBackend {
  switch (kind) {
    case 'sqlite':
      return chatQueueService;
    case 'redis':
    case 'kafka':
      throw new Error(
        `QUEUE_BACKEND=${kind} is not implemented yet. Use QUEUE_BACKEND=sqlite (default durable SQLite ChatJob queue).`,
      );
    default: {
      const _exhaustive: never = kind;
      throw new Error(`Unknown QUEUE_BACKEND: ${String(_exhaustive)}`);
    }
  }
}

let cached: ChatQueueBackend | null = null;

/** Singleton used by HTTP + worker paths. */
export function getQueueBackend(): ChatQueueBackend {
  if (!cached) {
    cached = createQueueBackend();
    logger.info({ kind: cached.kind }, 'Chat queue backend ready');
  }
  return cached;
}

/** Test helper: reset factory cache. */
export function resetQueueBackendForTests(): void {
  cached = null;
}
