import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { describe, expect, it } from 'vitest';
import {
  INSTALL_STEPS,
  hostOs,
  installArgv,
} from '../../src/services/runtimes/runtime-catalog';
import {
  runInstall,
  type InstallEvent,
  type InstallSpawn,
} from '../../src/services/runtimes/runtime-install';

const ALLOWED = new Set([
  'brew',
  'python3',
  'python',
  'pip3',
  'pip',
  'winget',
  'docker',
]);

function fakeSpawn(code = 0, output = 'ok\n'): InstallSpawn {
  return () => {
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    const child = new EventEmitter() as EventEmitter & {
      stdout: PassThrough;
      stderr: PassThrough;
      kill: () => boolean;
    };
    child.stdout = stdout;
    child.stderr = stderr;
    child.kill = () => true;
    queueMicrotask(() => {
      stdout.write(output);
      stdout.end();
      stderr.end();
      child.emit('close', code);
    });
    return child;
  };
}

describe('runtime one-click install', () => {
  it('install argv heads are allowlisted package managers', () => {
    for (const [id, byOs] of Object.entries(INSTALL_STEPS)) {
      for (const [os, steps] of Object.entries(byOs)) {
        for (const argv of steps || []) {
          expect(ALLOWED.has(argv[0] || ''), `${id}/${os}`).toBe(true);
          expect(argv.length).toBeGreaterThan(1);
        }
      }
    }
  });

  it('host OS has a llama.cpp or ffmpeg plan when brew/winget applies', () => {
    const os = hostOs();
    const llama = installArgv('llamacpp', os);
    const ffmpeg = installArgv('ffmpeg', os);
    if (os === 'darwin' || os === 'linux' || os === 'win32') {
      expect(ffmpeg.length + llama.length).toBeGreaterThan(0);
    }
  });

  it('ComfyUI is manual (no spawned argv)', () => {
    expect(installArgv('comfy', 'darwin')).toEqual([]);
    expect(installArgv('comfy', 'linux')).toEqual([]);
    expect(installArgv('vllm', 'darwin')).toEqual([]);
  });

  it('runInstall streams step/log/done with a fake spawn', async () => {
    const events: InstallEvent[] = [];
    const result = await runInstall('ffmpeg', (e) => events.push(e), {
      spawn: fakeSpawn(0, 'ffmpeg bottled\n'),
    });
    expect(result.ok).toBe(true);
    expect(events.some((e) => e.type === 'start')).toBe(true);
    expect(events.some((e) => e.type === 'step')).toBe(true);
    expect(events.some((e) => e.type === 'log' && e.line.includes('ffmpeg'))).toBe(
      true,
    );
    expect(events.some((e) => e.type === 'done' && e.code === 0)).toBe(true);
  });

  it('runInstall reports missing plan without spawning', async () => {
    const events: InstallEvent[] = [];
    const result = await runInstall('comfy', (e) => events.push(e), {
      spawn: fakeSpawn(0),
    });
    expect(result.ok).toBe(false);
    expect(events.some((e) => e.type === 'error')).toBe(true);
  });
});
