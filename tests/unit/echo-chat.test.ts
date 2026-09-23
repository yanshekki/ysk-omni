import { describe, expect, it } from 'vitest';
import {
  echoCompletion,
  echoReplyFromMessages,
  isEchoModel,
} from '../../src/services/runtimes/echo';

describe('echo chat', () => {
  it('isEchoModel matches echo ids', () => {
    expect(isEchoModel('echo')).toBe(true);
    expect(isEchoModel('echo:latest')).toBe(true);
    expect(isEchoModel('llama')).toBe(false);
  });

  it('returns OpenAI chat JSON with non-empty content', () => {
    const completion = echoCompletion('echo', [
      { role: 'user', content: 'hello world' },
    ]);
    expect(completion.object).toBe('chat.completion');
    expect(completion.model).toBe('echo');
    const content = completion.choices[0]?.message?.content;
    expect(typeof content).toBe('string');
    expect(content && content.length).toBeGreaterThan(0);
    expect(content).toContain('hello world');
    expect(echoReplyFromMessages([{ role: 'user', content: 'hello world' }])).toContain(
      'hello world',
    );
  });
});
