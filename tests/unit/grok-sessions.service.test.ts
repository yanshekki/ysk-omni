import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GrokSessionsService,
  parseSessionSummary,
} from '../../src/services/grok-sessions.service';

describe('grok-sessions.service', () => {
  it('parses summary.json fields', () => {
    const row = parseSessionSummary(
      {
        info: { id: '019f8954-28dc-7bf1-a6ff-6e7aa23374af', cwd: '/tmp/app' },
        generated_title: 'Fix login',
        session_summary: 'Auth bug',
        current_model_id: 'grok-4.6',
        last_active_at: '2026-08-13T00:00:00Z',
        created_at: '2026-08-12T00:00:00Z',
        num_chat_messages: 4,
        agent_name: 'grok-build',
      },
      '019f8954-28dc-7bf1-a6ff-6e7aa23374af',
    );
    expect(row?.title).toBe('Fix login');
    expect(row?.cwd).toBe('/tmp/app');
    expect(row?.messageCount).toBe(4);
  });

  it('lists sessions from GROK_HOME/sessions', async () => {
    const home = mkdtempSync(path.join(os.tmpdir(), 'gctoac-gsess-'));
    const id = '019f8954-28dc-7bf1-a6ff-6e7aa23374af';
    const dir = path.join(home, 'sessions', encodeURIComponent('/tmp/app'), id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      path.join(dir, 'summary.json'),
      JSON.stringify({
        info: { id, cwd: '/tmp/app' },
        generated_title: 'Hello',
        session_summary: 'Hello world',
        last_active_at: '2026-08-13T12:00:00Z',
        num_chat_messages: 2,
      }),
    );
    const svc = new GrokSessionsService();
    const all = await svc.list({ grokHome: home });
    expect(all.total).toBe(1);
    expect(all.data[0]?.id).toBe(id);

    const filtered = await svc.list({ grokHome: home, q: 'hello' });
    expect(filtered.total).toBe(1);
    const miss = await svc.list({ grokHome: home, q: 'nope' });
    expect(miss.total).toBe(0);
    const cwdMiss = await svc.list({ grokHome: home, cwd: '/other' });
    expect(cwdMiss.total).toBe(0);
  });
});
