import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('auto-migrate on update / start / error', () => {
  it('update CLI runs migrate after success and after catch', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/cli/commands/update.ts'),
      'utf8',
    );
    expect(src).toContain('tryAutoMigrate');
    expect(src).toContain('Update errored; still running gctoac migrate');
    expect(src).toContain('Final DB migrate');
  });

  it('start CLI applies pending migrations before bind', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/cli/commands/start.ts'),
      'utf8',
    );
    expect(src).toContain('tryAutoMigrate');
    expect(src).toContain('gctoac migrate');
  });
});
