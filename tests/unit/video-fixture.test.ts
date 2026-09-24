import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { videoFixtureBytes } from '../../src/services/media/media-jobs.service';

describe('video fixture mp4', () => {
  it('is an ISO-BMFF H.264 file with the product marker', () => {
    const bytes = videoFixtureBytes();
    expect(bytes.length).toBeGreaterThan(1000);
    expect(bytes.subarray(4, 8).toString('ascii')).toBe('ftyp');
    expect(bytes.includes(Buffer.from('isom'))).toBe(true);
    expect(bytes.includes(Buffer.from('moov'))).toBe(true);
    expect(bytes.includes(Buffer.from('mdat'))).toBe(true);
    expect(bytes.includes(Buffer.from('avc1'))).toBe(true);
    expect(bytes.includes(Buffer.from('ysk-omni-video-fixture'))).toBe(true);
  });

  it('ffprobe reads duration when ffmpeg is installed', () => {
    const probe = spawnSync('ffprobe', ['-version'], { encoding: 'utf8' });
    if (probe.status !== 0) return;
    const tmp = path.join(os.tmpdir(), `ysk-omni-fixture-${process.pid}.mp4`);
    fs.writeFileSync(tmp, videoFixtureBytes());
    try {
      const out = spawnSync(
        'ffprobe',
        [
          '-v',
          'error',
          '-show_entries',
          'format=duration,format_name',
          '-of',
          'json',
          tmp,
        ],
        { encoding: 'utf8' },
      );
      expect(out.status).toBe(0);
      const parsed = JSON.parse(out.stdout) as {
        format?: { duration?: string; format_name?: string };
      };
      expect(parsed.format?.format_name).toMatch(/mp4/);
      expect(Number(parsed.format?.duration)).toBeGreaterThan(0);
    } finally {
      fs.rmSync(tmp, { force: true });
    }
  });
});
