/**
 * Optional live Grok smoke — only runs when GROK_LIVE=1 and `grok` is on PATH.
 * Default CI skips this (uses mocked protocol tests instead).
 */
import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';

const live = process.env.GROK_LIVE === '1';

describe.runIf(live)('live Grok e2e (GROK_LIVE=1)', () => {
  it(
    'grok CLI responds to a one-shot prompt',
    () => {
      let version = '';
      try {
        version = execSync('grok --version', { encoding: 'utf8' }).trim();
      } catch {
        expect.fail('grok not available');
      }
      expect(version.length).toBeGreaterThan(0);

      // Minimal headless call; keep short timeout
      const out = execSync(
        'grok -p "Reply with exactly the word pong and nothing else" --output-format json --always-approve',
        {
          encoding: 'utf8',
          timeout: 120_000,
          env: process.env,
        },
      );
      expect(out.toLowerCase()).toMatch(/pong|text|result/i);
    },
    180_000,
  );
});
