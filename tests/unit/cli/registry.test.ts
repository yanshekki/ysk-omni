/**
 * CLI command registry — every expected leaf must be discoverable via help.
 */
import { describe, expect, it } from 'vitest';
import {
  CLI_BIN,
  CLI_EXPECTED_LEAVES,
  CLI_EXPECTED_TOP_LEVEL,
  cliBuilt,
  parseHelpCommandNames,
  runCliHelp,
} from '../../helpers/cli-registry';

const built = cliBuilt();

describe.skipIf(!built)('cli command registry', () => {
  it('top-level help lists all expected commands', () => {
    const out = runCliHelp(['--help']);
    for (const cmd of CLI_EXPECTED_TOP_LEVEL) {
      expect(out, `missing top-level: ${cmd}`).toContain(cmd);
    }
  });

  it('every leaf path has a working help entry', () => {
    const failures: string[] = [];
    for (const leaf of CLI_EXPECTED_LEAVES) {
      const parts = leaf.split(' ');
      try {
        // Prefer `help a b` ; fall back to `a b --help` if needed
        let out = '';
        try {
          out = runCliHelp(['help', ...parts]);
        } catch {
          out = runCliHelp([...parts, '--help']);
        }
        if (out.trim().length < 10) {
          failures.push(`${leaf}: empty help`);
        }
      } catch (e) {
        failures.push(
          `${leaf}: ${e instanceof Error ? e.message.slice(0, 120) : String(e)}`,
        );
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('parses top-level command names from help', () => {
    const names = parseHelpCommandNames(runCliHelp(['--help']));
    expect(names).toContain('start');
    expect(names).toContain('queue');
    expect(names).toContain('key');
  });
});

describe('cli binary presence', () => {
  it('documents that registry needs dist/cli (build first in CI)', () => {
    if (!built) {
      // Soft skip path: still assert path constant is stable
      expect(CLI_BIN).toContain('dist/cli');
    } else {
      expect(built).toBe(true);
    }
  });
});
