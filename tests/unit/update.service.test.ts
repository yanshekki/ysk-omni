import { describe, expect, it } from 'vitest';
import { updateService } from '../../src/services/update.service';

describe('UpdateService', () => {
  it('reports current version info shape', async () => {
    const info = await updateService.getVersionInfo();
    expect(info.current).toMatch(/^\d+\.\d+\.\d+/);
    expect(info.packageRoot.length).toBeGreaterThan(0);
    expect(['git', 'npm-global', 'npm-local', 'unknown']).toContain(info.channel);
    expect(typeof info.updateAvailable).toBe('boolean');
    expect(['update_available', 'up_to_date', 'ahead', 'unknown']).toContain(
      info.versionStatus,
    );
  });

  it('isUpdating is false by default', () => {
    expect(updateService.isUpdating()).toBe(false);
  });
});

describe('update migrate-on-error wiring', () => {
  it('Admin one-click script always runs migrate after update', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const src = readFileSync(
      join(process.cwd(), 'src/services/update.service.ts'),
      'utf8',
    );
    expect(src).toMatch(/update\$\{homeFlag\} \|\| true/);
    expect(src).toMatch(/migrate\$\{homeFlag\} \|\| true/);
    expect(src.indexOf('update${homeFlag} || true')).toBeLessThan(
      src.indexOf('migrate${homeFlag} || true'),
    );
    expect(src.indexOf('migrate${homeFlag} || true')).toBeLessThan(
      src.indexOf('restart${homeFlag}'),
    );
  });

  it('git-channel update installs devDependencies so tsc can compile', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const src = readFileSync(
      join(process.cwd(), 'src/services/update.service.ts'),
      'utf8',
    );
    expect(src).toContain('GCTOAC_UPDATE_DEV');
    expect(src).toContain('npm install --omit=dev');
  });
});
