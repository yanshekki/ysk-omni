import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const streamMock = vi.fn();
const isAvailableMock = vi.fn(async () => true);

vi.mock('../../src/services/grok-cli.service', () => ({
  grokCliService: {
    isAvailable: (...args: unknown[]) => isAvailableMock(...args),
    stream: (...args: unknown[]) => streamMock(...args),
  },
}));

import {
  copyNewestSessionMediaToSandbox,
  eventSessionId,
  findRunSessionDir,
  grokSessionGroupDir,
  grokToolsMediaProvider,
  isSuccessfulMediaToolEvent,
  listMediaFiles,
  listRunSessionMedia,
  selectCollectedMedia,
} from '../../src/services/media/providers/grok-tools.provider';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

function emptyStream() {
  return (async function* () {
    /* no events */
  })();
}

describe('GrokToolsMediaProvider generate/edit policy', () => {
  beforeEach(() => {
    isAvailableMock.mockReset();
    isAvailableMock.mockResolvedValue(true);
    streamMock.mockReset();
    streamMock.mockImplementation(() => emptyStream());
  });

  afterEach(async () => {
    /* sandboxes are deleted unless MEDIA_KEEP_RUNS=1 */
  });

  it('generateImage puts hard rules before Prompt and forbids web_fetch/Wikipedia', async () => {
    streamMock.mockImplementation(async function* (opts: { cwd: string }) {
      await fs.writeFile(path.join(opts.cwd, 'output.png'), Buffer.from('png'));
    });

    await grokToolsMediaProvider.generateImage({
      prompt: "I'll check the workspace and lock to attached stills",
      apiKeyId: 'k1',
      n: 1,
    });

    const opts = streamMock.mock.calls[0]![0] as {
      prompt: string;
      toolsAllowlist?: string | null;
    };
    const hardEnd = opts.prompt.indexOf('Prompt:');
    expect(hardEnd).toBeGreaterThan(0);
    const hard = opts.prompt.slice(0, hardEnd);
    expect(hard).toMatch(/first tool call MUST be image_gen/i);
    expect(hard).toContain('web_fetch');
    expect(hard).toContain('Wikipedia');
    expect(hard).toContain('output.png');
    expect(opts.prompt.indexOf("I'll check the workspace")).toBeGreaterThan(
      hardEnd,
    );
    expect(opts.toolsAllowlist).toBe('image_gen');
  });

  it('generateImage stream options lock toolsAllowlist to image_gen', async () => {
    streamMock.mockImplementation(async function* (opts: { cwd: string }) {
      await fs.writeFile(path.join(opts.cwd, 'output.png'), Buffer.from('png'));
    });
    await grokToolsMediaProvider.generateImage({
      prompt: 'a red square',
      apiKeyId: 'k1',
    });
    expect(streamMock.mock.calls[0]![0]).toMatchObject({
      toolsAllowlist: 'image_gen',
    });
  });

  it('editImage uses image_edit + input.png and toolsAllowlist image_edit', async () => {
    streamMock.mockImplementation(async function* (opts: { cwd: string }) {
      await fs.writeFile(path.join(opts.cwd, 'output.png'), Buffer.from('out'));
    });
    await grokToolsMediaProvider.editImage({
      prompt: 'make it blue',
      apiKeyId: 'k1',
      imageBytes: Buffer.from('in'),
    });
    const opts = streamMock.mock.calls[0]![0] as {
      prompt: string;
      toolsAllowlist?: string | null;
    };
    expect(opts.toolsAllowlist).toBe('image_edit');
    expect(opts.prompt).toContain('image_edit');
    expect(opts.prompt).toContain('input.png');
    expect(opts.prompt).not.toMatch(/first tool call MUST be image_gen/i);
  });

  it('video path does not pass image_gen allowlist', async () => {
    streamMock.mockImplementation(async function* (opts: { cwd: string }) {
      await fs.writeFile(path.join(opts.cwd, 'output.mp4'), Buffer.from('mp4'));
    });
    await grokToolsMediaProvider.generateVideoFromImage({
      prompt: 'gentle pan',
      apiKeyId: 'k1',
      imageBytes: Buffer.from('frame'),
    });
    const opts = streamMock.mock.calls[0]![0] as {
      toolsAllowlist?: string | null;
      prompt: string;
    };
    expect(opts.toolsAllowlist ?? null).toBeNull();
    expect(opts.prompt).toContain('image_to_video');
    expect(opts.prompt).not.toContain('first tool call MUST be image_gen');
  });
});

describe('listMediaFiles / selectCollectedMedia', () => {
  let sandbox = '';

  beforeEach(async () => {
    sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'gctoac-media-'));
  });

  afterEach(async () => {
    await fs.rm(sandbox, { recursive: true, force: true });
  });

  it('recurses into refs/try3.jpg', async () => {
    await fs.mkdir(path.join(sandbox, 'refs'), { recursive: true });
    await fs.writeFile(path.join(sandbox, 'refs', 'try3.jpg'), Buffer.from('j'));
    const found = await listMediaFiles(sandbox, IMAGE_EXTS);
    expect([...found].some((f) => f.endsWith(`${path.sep}refs${path.sep}try3.jpg`))).toBe(
      true,
    );
  });

  it('prefers root output.png over refs/try5.jpg', async () => {
    await fs.mkdir(path.join(sandbox, 'refs'), { recursive: true });
    await fs.writeFile(path.join(sandbox, 'refs', 'try5.jpg'), Buffer.from('r'));
    await fs.writeFile(path.join(sandbox, 'output.png'), Buffer.from('o'));
    const after = await listMediaFiles(sandbox, IMAGE_EXTS);
    const picked = await selectCollectedMedia({
      sandbox,
      before: new Set(),
      after,
      collect: 'image',
      n: 1,
    });
    expect(picked).toHaveLength(1);
    expect(path.basename(picked[0]!)).toBe('output.png');
  });

  it('returns subdirectory image when output.png is missing (no throw)', async () => {
    await fs.mkdir(path.join(sandbox, 'refs'), { recursive: true });
    await fs.writeFile(path.join(sandbox, 'refs', 'try3.jpg'), Buffer.from('j'));
    const after = await listMediaFiles(sandbox, IMAGE_EXTS);
    const picked = await selectCollectedMedia({
      sandbox,
      before: new Set(),
      after,
      collect: 'image',
      n: 1,
    });
    expect(picked).toHaveLength(1);
    expect(picked[0]).toMatch(/try3\.jpg$/);
  });

  it('ignores input.png / mask.png / frame.png / ref-*.png', async () => {
    await fs.writeFile(path.join(sandbox, 'input.png'), Buffer.from('i'));
    await fs.writeFile(path.join(sandbox, 'mask.png'), Buffer.from('m'));
    await fs.writeFile(path.join(sandbox, 'frame.png'), Buffer.from('f'));
    await fs.writeFile(path.join(sandbox, 'ref-0.png'), Buffer.from('r'));
    const found = await listMediaFiles(sandbox, IMAGE_EXTS);
    expect(found.size).toBe(0);
  });

  it('generateImage delivers refs/try3.jpg when that is the only image', async () => {
    isAvailableMock.mockResolvedValue(true);
    streamMock.mockImplementation(async function* (opts: { cwd: string }) {
      await fs.mkdir(path.join(opts.cwd, 'refs'), { recursive: true });
      await fs.writeFile(
        path.join(opts.cwd, 'refs', 'try3.jpg'),
        Buffer.from('jpg'),
      );
    });
    const arts = await grokToolsMediaProvider.generateImage({
      prompt: 'character sheet',
      apiKeyId: 'k1',
      n: 1,
    });
    expect(arts).toHaveLength(1);
    expect(arts[0]!.originalName).toBe('try3.jpg');
    expect(arts[0]!.mime).toBe('image/jpeg');
  });

  it('does not follow a symlink out of the sandbox', async () => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'gctoac-out-'));
    try {
      await fs.writeFile(path.join(outside, 'secret.jpg'), Buffer.from('s'));
      await fs.symlink(outside, path.join(sandbox, 'leak'), 'dir');
      const found = await listMediaFiles(sandbox, IMAGE_EXTS);
      expect([...found].join(' ')).not.toContain('secret.jpg');
    } finally {
      await fs.rm(outside, { recursive: true, force: true });
    }
  });
});

const SESSION_ID = '019ffbd0-6dca-7c13-8eb2-c79f4afb3617';

async function writeSessionImage(
  grokHome: string,
  sandboxAbs: string,
  sessionId: string,
  name: string,
  bytes: Buffer,
): Promise<string> {
  const dest = path.join(
    grokSessionGroupDir(sandboxAbs, grokHome),
    sessionId,
    'images',
    name,
  );
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, bytes);
  return dest;
}

describe('session image harvest (image_gen writes ~/.grok/sessions/…/images/)', () => {
  let sandbox = '';
  let grokHome = '';

  beforeEach(async () => {
    sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'gctoac-media-'));
    grokHome = await fs.mkdtemp(path.join(os.tmpdir(), 'gctoac-grokhome-'));
    isAvailableMock.mockReset();
    isAvailableMock.mockResolvedValue(true);
    streamMock.mockReset();
    streamMock.mockImplementation(() => emptyStream());
  });

  afterEach(async () => {
    await fs.rm(sandbox, { recursive: true, force: true });
    await fs.rm(grokHome, { recursive: true, force: true });
  });

  it('eventSessionId / isSuccessfulMediaToolEvent parse grok CLI events', () => {
    expect(
      eventSessionId({ type: 'turn_started', session_id: SESSION_ID }),
    ).toBe(SESSION_ID);
    expect(
      eventSessionId({ type: 'end', sessionId: SESSION_ID }),
    ).toBe(SESSION_ID);
    expect(
      isSuccessfulMediaToolEvent({
        type: 'tool_completed',
        tool_name: 'image_gen',
        outcome: 'success',
      }),
    ).toBe(true);
    expect(
      isSuccessfulMediaToolEvent({
        type: 'tool_completed',
        tool_name: 'use_tool',
        outcome: 'error',
      }),
    ).toBe(false);
  });

  it('finds only this cwd session, not a sibling sandbox session', async () => {
    const other = await fs.mkdtemp(path.join(os.tmpdir(), 'gctoac-other-'));
    try {
      await writeSessionImage(
        grokHome,
        other,
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '1.jpg',
        Buffer.from('other'),
      );
      await writeSessionImage(
        grokHome,
        sandbox,
        SESSION_ID,
        '1.jpg',
        Buffer.from('mine'),
      );
      const dir = await findRunSessionDir(sandbox, SESSION_ID, grokHome);
      expect(dir).toBeTruthy();
      expect(dir).toContain(SESSION_ID);
      const files = await listRunSessionMedia({
        sandbox,
        sessionId: SESSION_ID,
        collect: 'image',
        grokHome,
      });
      expect([...files].every((f) => f.endsWith(`${path.sep}1.jpg`))).toBe(true);
      expect([...files].join(' ')).not.toContain('other');
      const bytes = await fs.readFile([...files][0]!);
      expect(bytes.toString()).toBe('mine');
    } finally {
      await fs.rm(other, { recursive: true, force: true });
    }
  });

  it('selectCollectedMedia prefers sandbox output.png over session images/2.jpg', async () => {
    const sessionFile = await writeSessionImage(
      grokHome,
      sandbox,
      SESSION_ID,
      '2.jpg',
      Buffer.from('session-newer'),
    );
    await fs.writeFile(path.join(sandbox, 'output.png'), Buffer.from('sandbox-out'));
    const after = new Set<string>([
      ...(await listMediaFiles(sandbox, IMAGE_EXTS)),
      sessionFile,
    ]);
    const picked = await selectCollectedMedia({
      sandbox,
      before: new Set(),
      after,
      collect: 'image',
      n: 1,
    });
    expect(picked).toHaveLength(1);
    expect(path.basename(picked[0]!)).toBe('output.png');
    expect((await fs.readFile(picked[0]!)).toString()).toBe('sandbox-out');
  });

  it('copyNewestSessionMediaToSandbox does not overwrite existing output.png', async () => {
    await writeSessionImage(
      grokHome,
      sandbox,
      SESSION_ID,
      '2.jpg',
      Buffer.from('session-2'),
    );
    await fs.writeFile(path.join(sandbox, 'output.png'), Buffer.from('keep-me'));
    const dest = await copyNewestSessionMediaToSandbox({
      sandbox,
      sessionId: SESSION_ID,
      collect: 'image',
      grokHome,
      overwrite: false,
    });
    expect(dest && path.basename(dest)).toBe('output.png');
    expect((await fs.readFile(path.join(sandbox, 'output.png'))).toString()).toBe(
      'keep-me',
    );
  });

  it('copyNewestSessionMediaToSandbox writes output.jpg from session images/1.jpg', async () => {
    await writeSessionImage(
      grokHome,
      sandbox,
      SESSION_ID,
      '1.jpg',
      Buffer.from('jpg-bytes'),
    );
    const dest = await copyNewestSessionMediaToSandbox({
      sandbox,
      sessionId: SESSION_ID,
      collect: 'image',
      grokHome,
      overwrite: false,
    });
    expect(dest && path.basename(dest)).toBe('output.jpg');
    expect((await fs.readFile(path.join(sandbox, 'output.jpg'))).toString()).toBe(
      'jpg-bytes',
    );
  });

  it('generateImage returns session images/1.jpg when sandbox root is empty', async () => {
    const prevHome = process.env.GROK_HOME;
    process.env.GROK_HOME = grokHome;
    try {
      streamMock.mockImplementation(async function* (opts: { cwd: string }) {
        await writeSessionImage(
          grokHome,
          opts.cwd,
          SESSION_ID,
          '1.jpg',
          Buffer.from('from-session'),
        );
        yield { type: 'turn_started', session_id: SESSION_ID };
        yield {
          type: 'tool_completed',
          tool_name: 'image_gen',
          outcome: 'success',
        };
      });
      const arts = await grokToolsMediaProvider.generateImage({
        prompt: 'character sheet',
        apiKeyId: 'k1',
        n: 1,
      });
      expect(arts).toHaveLength(1);
      expect(arts[0]!.bytes.toString()).toBe('from-session');
      expect(arts[0]!.mime).toBe('image/jpeg');
    } finally {
      if (prevHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = prevHome;
    }
  });

  it('generateImage prefers sandbox output.png when session images/2.jpg also exists', async () => {
    const prevHome = process.env.GROK_HOME;
    process.env.GROK_HOME = grokHome;
    try {
      streamMock.mockImplementation(async function* (opts: { cwd: string }) {
        await fs.writeFile(path.join(opts.cwd, 'output.png'), Buffer.from('root-out'));
        await writeSessionImage(
          grokHome,
          opts.cwd,
          SESSION_ID,
          '2.jpg',
          Buffer.from('session-2'),
        );
      });
      const arts = await grokToolsMediaProvider.generateImage({
        prompt: 'character sheet',
        apiKeyId: 'k1',
        n: 1,
      });
      expect(arts).toHaveLength(1);
      expect(arts[0]!.originalName).toBe('output.png');
      expect(arts[0]!.bytes.toString()).toBe('root-out');
    } finally {
      if (prevHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = prevHome;
    }
  });

  it('generateImage throws no_image_in_sandbox only when nothing exists', async () => {
    const prevHome = process.env.GROK_HOME;
    process.env.GROK_HOME = grokHome;
    try {
      streamMock.mockImplementation(() => emptyStream());
      await expect(
        grokToolsMediaProvider.generateImage({
          prompt: 'nothing',
          apiKeyId: 'k1',
        }),
      ).rejects.toMatchObject({
        statusCode: 502,
        details: { reason: 'no_image_in_sandbox' },
      });
    } finally {
      if (prevHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = prevHome;
    }
  });

  it('generateImage returns session images/1.jpg after CLI exit 1 (maxTurns burn)', async () => {
    const prevHome = process.env.GROK_HOME;
    process.env.GROK_HOME = grokHome;
    try {
      streamMock.mockImplementation(async function* (opts: { cwd: string }) {
        await writeSessionImage(
          grokHome,
          opts.cwd,
          SESSION_ID,
          '1.jpg',
          Buffer.from('exit1-still-ok'),
        );
        yield { type: 'text', data: 'trying to copy output.png' };
        const err = new Error('Grok CLI exited with code 1') as Error & {
          statusCode: number;
          code: string;
          details: { stderr: string };
        };
        err.statusCode = 502;
        err.code = 'grok_error';
        err.details = { stderr: '' };
        throw err;
      });
      const arts = await grokToolsMediaProvider.generateImage({
        prompt: 'character sheet',
        apiKeyId: 'k1',
        n: 1,
        maxTurns: 40,
      });
      expect(arts).toHaveLength(1);
      expect(arts[0]!.bytes.toString()).toBe('exit1-still-ok');
      expect(arts[0]!.mime).toBe('image/jpeg');
    } finally {
      if (prevHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = prevHome;
    }
  });

  it('generateImage still 502 when CLI exit 1 and no image exists anywhere', async () => {
    const prevHome = process.env.GROK_HOME;
    process.env.GROK_HOME = grokHome;
    try {
      streamMock.mockImplementation(async function* () {
        const err = new Error('Grok CLI exited with code 1') as Error & {
          statusCode: number;
          code: string;
        };
        err.statusCode = 502;
        err.code = 'grok_error';
        throw err;
      });
      await expect(
        grokToolsMediaProvider.generateImage({
          prompt: 'nothing',
          apiKeyId: 'k1',
          maxTurns: 40,
        }),
      ).rejects.toMatchObject({
        statusCode: 502,
        code: 'grok_error',
      });
    } finally {
      if (prevHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = prevHome;
    }
  });

  it('does not harvest a different media-run session under ~/.grok/sessions', async () => {
    const prevHome = process.env.GROK_HOME;
    process.env.GROK_HOME = grokHome;
    const otherSandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'gctoac-other-'));
    try {
      await writeSessionImage(
        grokHome,
        otherSandbox,
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '1.jpg',
        Buffer.from('not-this-run'),
      );
      streamMock.mockImplementation(() => emptyStream());
      await expect(
        grokToolsMediaProvider.generateImage({
          prompt: 'nothing',
          apiKeyId: 'k1',
        }),
      ).rejects.toMatchObject({
        statusCode: 502,
        details: { reason: 'no_image_in_sandbox' },
      });
    } finally {
      await fs.rm(otherSandbox, { recursive: true, force: true });
      if (prevHome === undefined) delete process.env.GROK_HOME;
      else process.env.GROK_HOME = prevHome;
    }
  });
});
