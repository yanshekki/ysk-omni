import { describe, expect, it } from 'vitest';
import { GrokCliService } from '../../src/services/grok-cli.service';

describe('GrokCliService parsers', () => {
  const service = new GrokCliService();

  it('buildArgs includes required flags for short -p prompt', () => {
    const args = service.buildArgs({
      prompt: 'hello',
      model: 'grok-4.5',
      cwd: '/tmp/ws',
      stream: true,
      sessionId: '8f3c2e10-9c4a-5d6b-8e1f-2a7b6c5d4e3f',
      alwaysApprove: true,
      maxTurns: 3,
      toolsDenylist: 'web_search',
    });
    expect(args).toContain('-p');
    expect(args).toContain('hello');
    expect(args).toContain('-m');
    expect(args).toContain('grok-4.5');
    expect(args).toContain('--output-format');
    expect(args).toContain('streaming-json');
    expect(args).toContain('-s');
    expect(args).toContain('8f3c2e10-9c4a-5d6b-8e1f-2a7b6c5d4e3f');
    expect(args).toContain('--always-approve');
    expect(args).toContain('--no-auto-update');
    expect(args).toContain('--no-ask-user');
    expect(args).not.toContain('--best-of-n');
    expect(args).not.toContain('--check');
    expect(args).toContain('--max-turns');
    expect(args).toContain('3');
    expect(args).toContain('--disallowed-tools');
    expect(args).toContain('web_search');
  });

  it('buildArgs uses --prompt-file when promptFile set', () => {
    const args = service.buildArgs({
      prompt: 'ignored-when-file',
      promptFile: '/tmp/prompt.txt',
      model: 'm',
      cwd: '/tmp',
      stream: false,
      alwaysApprove: false,
    });
    expect(args).toContain('--prompt-file');
    expect(args).toContain('/tmp/prompt.txt');
    expect(args).not.toContain('-p');
    expect(args).not.toContain('--always-approve');
  });

  it('buildArgs omits always-approve when disabled by policy', () => {
    const args = service.buildArgs({
      prompt: 'x',
      model: 'm',
      cwd: '/tmp',
      stream: false,
      alwaysApprove: false,
    });
    expect(args).not.toContain('--always-approve');
  });

  it('buildArgs omits -s when sessionId is not a UUID', () => {
    const args = service.buildArgs({
      prompt: 'hello',
      model: 'm',
      cwd: '/tmp',
      stream: false,
      sessionId: 'gog_not_a_uuid',
      alwaysApprove: false,
    });
    expect(args).not.toContain('-s');
    expect(args).not.toContain('gog_not_a_uuid');
  });

  it('buildArgs uses --resume instead of -s when resumeSessionId is set', () => {
    const args = service.buildArgs({
      prompt: 'again',
      model: 'grok-4.6',
      cwd: '/tmp',
      stream: false,
      resumeSessionId: '8f3c2e10-9c4a-5d6b-8e1f-2a7b6c5d4e3f',
      alwaysApprove: false,
    });
    expect(args).toContain('--resume');
    expect(args).toContain('8f3c2e10-9c4a-5d6b-8e1f-2a7b6c5d4e3f');
    expect(args).not.toContain('-s');
    expect(args).toContain('-p');
  });

  it('buildArgs does not pass -s together with --resume unless forking', () => {
    const args = service.buildArgs({
      prompt: 'x',
      model: 'm',
      cwd: '/tmp',
      stream: false,
      sessionId: '8f3c2e10-9c4a-5d6b-8e1f-2a7b6c5d4e3f',
      resumeSessionId: '8f3c2e10-9c4a-5d6b-8e1f-2a7b6c5d4e3f',
      alwaysApprove: false,
    });
    expect(args).toContain('--resume');
    expect(args).not.toContain('-s');
  });

  it('parseJsonResult parses last JSON object', () => {
    const raw = 'noise\n{"text":"ok","stopReason":"EndTurn","sessionId":"s1"}\n';
    expect(service.parseJsonResult(raw)).toEqual({
      text: 'ok',
      stopReason: 'EndTurn',
      sessionId: 's1',
    });
  });

  it('parseJsonResult falls back to plain text', () => {
    expect(service.parseJsonResult('just text')).toEqual({ text: 'just text' });
  });

  it('parseModelsOutput extracts model ids', () => {
    const stdout = `
You are logged in.

Default model: grok-4.5

Available models:
  * grok-4.5 (default)
  - grok-composer-2.5-fast
`;
    expect(service.parseModelsOutput(stdout)).toEqual([
      'grok-4.5',
      'grok-composer-2.5-fast',
    ]);
  });

  it('tracks concurrency acquire/release', () => {
    expect(service.tryAcquire()).toBe(true);
    expect(service.tryAcquire()).toBe(true);
    expect(service.tryAcquire()).toBe(false); // max 2 in test setup
    service.release();
    expect(service.tryAcquire()).toBe(true);
    service.release();
    service.release();
    service.release();
  });
});
