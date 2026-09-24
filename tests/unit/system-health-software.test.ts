import { describe, expect, it } from 'vitest';
import { systemHealthService } from '../../src/services/system-health.service';

describe('system software report', () => {
  it('lists llama-server and ffmpeg, not Grok CLI', async () => {
    const report = await systemHealthService.getSoftwareReport();
    const ids = report.checks.map((c) => c.id);
    expect(ids).toContain('llama-server');
    expect(ids).toContain('ffmpeg');
    expect(ids).not.toContain('grok');
    expect(
      report.checks.some((c) => /grok/i.test(c.name || '')),
    ).toBe(false);
  });
});
