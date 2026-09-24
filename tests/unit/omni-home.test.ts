import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { omniHome } from '../../src/config/omni-home';

describe('omniHome', () => {
  const prev = process.env.OMNI_HOME;

  afterEach(() => {
    if (prev === undefined) delete process.env.OMNI_HOME;
    else process.env.OMNI_HOME = prev;
  });

  it('uses OMNI_HOME when set', () => {
    process.env.OMNI_HOME = '/tmp/ysk-omni-home-test';
    expect(omniHome()).toBe(path.resolve('/tmp/ysk-omni-home-test'));
  });

  it('falls back to ~/.ysk-omni', () => {
    delete process.env.OMNI_HOME;
    expect(omniHome()).toBe(path.join(os.homedir(), '.ysk-omni'));
  });
});
