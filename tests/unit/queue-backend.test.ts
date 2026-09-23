import { describe, expect, it } from 'vitest';
import {
  createQueueBackend,
  resetQueueBackendForTests,
} from '../../src/services/queue/queue-backend.factory';
import { parseQueueBackendKind } from '../../src/services/queue/queue-backend.interface';
import { chatQueueService } from '../../src/services/queue/chat-queue.service';

describe('queue backend', () => {
  it('parseQueueBackendKind defaults and normalizes', () => {
    expect(parseQueueBackendKind(undefined)).toBe('sqlite');
    expect(parseQueueBackendKind('')).toBe('sqlite');
    expect(parseQueueBackendKind('SQLITE')).toBe('sqlite');
    expect(parseQueueBackendKind('redis')).toBe('redis');
    expect(parseQueueBackendKind('kafka')).toBe('kafka');
    expect(parseQueueBackendKind('mystery')).toBe('sqlite');
  });

  it('createQueueBackend(sqlite) returns ChatQueueService', () => {
    resetQueueBackendForTests();
    const b = createQueueBackend('sqlite');
    expect(b.kind).toBe('sqlite');
    expect(b).toBe(chatQueueService);
    expect(typeof b.workerId).toBe('string');
  });

  it('createQueueBackend(redis|kafka) throws until implemented', () => {
    expect(() => createQueueBackend('redis')).toThrow(/not implemented/i);
    expect(() => createQueueBackend('kafka')).toThrow(/not implemented/i);
  });
});
