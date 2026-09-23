import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createId } from '../../../utils/id';
import { isUuid } from '../../../utils/grok-session';
import { logger } from '../../../utils/logger';
import { ExceptionFactory } from '../../../exceptions/exception.factory';
import { env } from '../../../config/env';
import { grokCliService } from '../../grok-cli.service';
import { resolveGrokHome } from '../../grok-sessions.service';
import type {
  ImageEditRequest,
  ImageGenRequest,
  MediaArtifact,
  MediaProvider,
} from './media-provider.interface';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.mkv']);
const IMAGE_OUTPUT_BASENAMES = [
  'output.png',
  'output.jpg',
  'output.webp',
  'output.jpeg',
] as const;
const VIDEO_OUTPUT_BASENAMES = ['output.mp4'] as const;
const IGNORED_MEDIA_BASENAMES = new Set([
  'input.png',
  'mask.png',
  'frame.png',
]);

const GENERATE_HARD_RULES = [
  'HARD RULES (override everything in Prompt below):',
  '- The first tool call MUST be image_gen.',
  '- Save the result as output.png in the sandbox root (current working directory). Do not write only under refs/ and do not leave the file only in session images/.',
  '- Forbidden: web_search, web_fetch, browsing Wikipedia, curl, wget, or downloading reference photos.',
  '- There are NO attached stills and NO workspace references. Even if Prompt says to check the workspace or lock to attached stills, treat as no refs.',
  '- Do not start an image_edit loop unless output.png already exists.',
  '- Do not only describe the image.',
].join('\n');

const NO_WEB_RULE =
  'Do not use web_search, web_fetch, Wikipedia, curl, or wget.';

function mimeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.mp4':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.mov':
      return 'video/quicktime';
    default:
      return 'image/png';
  }
}

/**
 * Generate / edit images via Grok CLI (Imagine skill + tools).
 * Execution limits come from policyService (same as chat): maxTurns, timeout, tools, alwaysApprove.
 */
export class GrokToolsMediaProvider implements MediaProvider {
  readonly id = 'grok-tools';

  async editImage(req: ImageEditRequest): Promise<MediaArtifact[]> {
    const runId = createId();
    const sandbox = path.join(env.storageDir, 'media-runs', runId);
    await fs.mkdir(sandbox, { recursive: true });
    const srcName = 'input.png';
    await fs.writeFile(path.join(sandbox, srcName), req.imageBytes);
    if (req.maskBytes) {
      await fs.writeFile(path.join(sandbox, 'mask.png'), req.maskBytes);
    }
    const aspectHint = req.aspectRatio
      ? ` If multi-image edit needs a canvas, use aspect_ratio="${req.aspectRatio}".`
      : ' Preserve the source image aspect ratio unless the instruction requires otherwise.';
    const prompt =
      `${NO_WEB_RULE}\n` +
      `Edit the image ./${srcName} according to the instruction and save the result as output.png in the current working directory.\n` +
      `Use the image_edit tool with the source file path.${aspectHint}\n` +
      `Instruction: ${req.prompt}\n` +
      `You must produce a real image file on disk (output.png).`;
    return this.runGrokCollectImages({
      ...req,
      prompt,
      sandbox,
      toolsAllowlist: 'image_edit',
    });
  }

  async generateImage(req: ImageGenRequest): Promise<MediaArtifact[]> {
    const runId = createId();
    const sandbox = path.join(env.storageDir, 'media-runs', runId);
    await fs.mkdir(sandbox, { recursive: true });
    const aspect =
      req.aspectRatio ||
      req.size ||
      '1:1';
    const prompt =
      `${GENERATE_HARD_RULES}\n\n` +
      `Prompt: ${req.prompt}\n` +
      `Use the image_gen tool with aspect_ratio="${aspect}" (Grok Imagine).\n` +
      `You must produce a real image file on disk (output.png).`;
    return this.runGrokCollectImages({
      ...req,
      prompt,
      sandbox,
      toolsAllowlist: 'image_gen',
    });
  }

  /**
   * Grok image_to_video: animate a source frame (duration 1–15s).
   */
  async generateVideoFromImage(req: {
    prompt: string;
    imageBytes: Buffer;
    apiKeyId: string;
    model?: string;
    seconds?: number;
    aspectRatio?: string;
    timeoutMs?: number;
    maxTurns?: number | null;
    alwaysApprove?: boolean;
    permissionMode?: string | null;
  }): Promise<MediaArtifact[]> {
    const runId = createId();
    const sandbox = path.join(env.storageDir, 'media-runs', runId);
    await fs.mkdir(sandbox, { recursive: true });
    const srcName = 'frame.png';
    await fs.writeFile(path.join(sandbox, srcName), req.imageBytes);
    const raw = Number(req.seconds);
    const seconds =
      Number.isFinite(raw) && raw >= 1 && raw <= 15 ? Math.round(raw) : 6;
    const prompt =
      `Animate the image ./${srcName} into a short video and save it as output.mp4 in the current working directory.\n` +
      `Use the image_to_video tool with duration=${seconds} (Grok supports 1–15 seconds).\n` +
      `Motion / camera instruction: ${req.prompt}\n` +
      `You must produce a real video file on disk (output.mp4).`;
    return this.runGrokCollectMedia({
      prompt,
      sandbox,
      model: req.model,
      timeoutMs: req.timeoutMs,
      maxTurns: req.maxTurns,
      alwaysApprove: req.alwaysApprove,
      permissionMode: req.permissionMode,
      collect: 'video',
      n: 1,
    });
  }

  /**
   * Grok reference_to_video: one or more stills + optional preset voices.
   */
  async generateVideoFromReferences(req: {
    prompt: string;
    images: Buffer[];
    voices?: string[];
    apiKeyId: string;
    model?: string;
    seconds?: number;
    aspectRatio?: string;
    timeoutMs?: number;
    maxTurns?: number | null;
    alwaysApprove?: boolean;
    permissionMode?: string | null;
  }): Promise<MediaArtifact[]> {
    const runId = createId();
    const sandbox = path.join(env.storageDir, 'media-runs', runId);
    await fs.mkdir(sandbox, { recursive: true });
    const names: string[] = [];
    for (let i = 0; i < Math.min(req.images.length, 7); i += 1) {
      const name = `ref-${i}.png`;
      await fs.writeFile(path.join(sandbox, name), req.images[i]!);
      names.push(name);
    }
    const raw = Number(req.seconds);
    const seconds =
      Number.isFinite(raw) && raw >= 1 && raw <= 15 ? Math.round(raw) : 6;
    const aspect = req.aspectRatio ? ` aspect_ratio=${req.aspectRatio}` : '';
    const voiceLine = req.voices?.length
      ? `Speak with preset voices in order: ${req.voices.join(', ')} (reference as AUDIO_0…).\n`
      : '';
    const refs = names.map((n, i) => `<IMAGE_${i}>=./${n}`).join(', ');
    const prompt =
      `Create a short video and save it as output.mp4 in the current working directory.\n` +
      `Use the reference_to_video tool with duration=${seconds}${aspect}.\n` +
      `Reference images: ${refs}.\n` +
      voiceLine +
      `Direction: ${req.prompt}\n` +
      `You must produce a real video file on disk (output.mp4).`;
    return this.runGrokCollectMedia({
      prompt,
      sandbox,
      model: req.model,
      timeoutMs: req.timeoutMs,
      maxTurns: req.maxTurns,
      alwaysApprove: req.alwaysApprove,
      permissionMode: req.permissionMode,
      collect: 'video',
      n: 1,
    });
  }

  private async runGrokCollectImages(
    req: ImageGenRequest & { prompt: string; sandbox: string },
  ): Promise<MediaArtifact[]> {
    return this.runGrokCollectMedia({
      ...req,
      collect: 'image',
      n: req.n ?? 1,
    });
  }

  private async runGrokCollectMedia(
    req: {
      prompt: string;
      sandbox: string;
      model?: string;
      timeoutMs?: number;
      maxTurns?: number | null;
      alwaysApprove?: boolean;
      permissionMode?: string | null;
      toolsAllowlist?: string | null;
      toolsDenylist?: string | null;
      collect: 'image' | 'video';
      n?: number;
    },
  ): Promise<MediaArtifact[]> {
    const { sandbox, prompt } = req;
    const listFn = req.collect === 'video' ? listVideoFiles : listImageFiles;
    const before = await listFn(sandbox);

    const timeoutMs = req.timeoutMs ?? env.GROK_TIMEOUT_MS;
    const maxTurns =
      req.maxTurns != null && req.maxTurns > 0 ? req.maxTurns : null;
    const alwaysApprove =
      req.alwaysApprove !== undefined
        ? req.alwaysApprove
        : env.GROK_ALWAYS_APPROVE;
    const permissionMode =
      req.permissionMode ??
      (alwaysApprove ? 'bypassPermissions' : null);
    let sessionId: string | undefined;
    const want = Math.min(req.n ?? 1, 4);

    const harvest = async (): Promise<string[]> => {
      await copyNewestSessionMediaToSandbox({
        sandbox,
        sessionId,
        collect: req.collect,
        overwrite: false,
      });
      const after = await listFn(sandbox);
      const sessionFiles = await listRunSessionMedia({
        sandbox,
        sessionId,
        collect: req.collect,
      });
      for (const f of sessionFiles) after.add(f);
      return selectCollectedMedia({
        sandbox,
        before,
        after,
        collect: req.collect,
        n: want,
      });
    };

    try {
      const available = await grokCliService.isAvailable();
      if (!available) {
        throw ExceptionFactory.mediaProviderUnavailable(
          'Grok CLI is not available for media generation',
        );
      }

      logger.info(
        {
          model: req.model || env.GROK_DEFAULT_MODEL,
          timeoutMs,
          maxTurns,
          alwaysApprove,
          permissionMode,
          toolsAllowlist: req.toolsAllowlist ?? null,
          collect: req.collect,
          sandbox,
        },
        'Media gen: spawning Grok with policy-aligned options',
      );

      let lastPoll = 0;
      for await (const ev of grokCliService.stream({
        prompt,
        model: req.model || env.GROK_DEFAULT_MODEL,
        cwd: sandbox,
        stream: true,
        timeoutMs,
        alwaysApprove,
        maxTurns,
        toolsAllowlist: req.toolsAllowlist ?? null,
        toolsDenylist: req.toolsDenylist ?? null,
        permissionMode,
        noSubagents: true,
      })) {
        const rec = ev as Record<string, unknown>;
        const sid = eventSessionId(rec);
        if (sid) sessionId = sid;
        const toolOk = isSuccessfulMediaToolEvent(rec);
        const now = Date.now();
        // Poll session images/ even if streaming-json is not tool_completed.
        // Breaking here abandons the generator → streamAttempt finally SIGTERM
        // so the agent cannot burn maxTurns on failed use_tool copies.
        if (toolOk || now - lastPoll >= 400) {
          lastPoll = now;
          const dest = await copyNewestSessionMediaToSandbox({
            sandbox,
            sessionId,
            collect: req.collect,
            overwrite: toolOk,
          });
          if (dest && want <= 1) break;
        }
      }
    } catch (err) {
      const recovered = await harvest();
      if (recovered.length) {
        logger.warn(
          {
            err,
            sandbox,
            collect: req.collect,
            recovered: recovered.length,
          },
          'Media gen: Grok exited with an error but artifacts were recovered',
        );
        return this.toArtifacts(recovered, {
          sandbox,
          prompt,
          timeoutMs,
          maxTurns,
          alwaysApprove,
          collect: req.collect,
          n: want,
        });
      }
      logger.warn({ err, sandbox, collect: req.collect }, 'Grok media gen failed');
      if (err && typeof err === 'object' && 'statusCode' in err) throw err;
      throw ExceptionFactory.mediaGenerationFailed(
        err instanceof Error ? err.message : 'Grok media generation failed',
      );
    }

    const candidates = await harvest();

    if (!candidates.length) {
      throw ExceptionFactory.mediaGenerationFailed(
        req.collect === 'video'
          ? 'Grok finished but no video file was found in the sandbox or this run\'s session.'
          : 'Grok finished but no image file was found in the sandbox or this run\'s session images/.',
        {
          reason:
            req.collect === 'video' ? 'no_video_in_sandbox' : 'no_image_in_sandbox',
        },
      );
    }

    return this.toArtifacts(candidates, {
      sandbox,
      prompt,
      timeoutMs,
      maxTurns,
      alwaysApprove,
      collect: req.collect,
      n: want,
    });
  }

  private async toArtifacts(
    files: string[],
    meta: {
      sandbox: string;
      prompt: string;
      timeoutMs: number;
      maxTurns: number | null;
      alwaysApprove: boolean;
      collect: 'image' | 'video';
      n: number;
    },
  ): Promise<MediaArtifact[]> {
    const artifacts: MediaArtifact[] = [];
    for (const file of files.slice(0, meta.n)) {
      const bytes = await fs.readFile(file);
      const ext = path.extname(file);
      artifacts.push({
        bytes,
        mime: mimeFromExt(ext),
        originalName: path.basename(file),
        source: {
          provider: this.id,
          rawMeta: {
            sandbox: meta.sandbox,
            file,
            prompt: meta.prompt,
            timeoutMs: meta.timeoutMs,
            maxTurns: meta.maxTurns,
            alwaysApprove: meta.alwaysApprove,
            collect: meta.collect,
          },
        },
      });
    }

    if (process.env.MEDIA_KEEP_RUNS !== '1') {
      void fs.rm(meta.sandbox, { recursive: true, force: true }).catch(() => undefined);
    }

    return artifacts;
  }
}

async function listImageFiles(dir: string): Promise<Set<string>> {
  return listMediaFiles(dir, IMAGE_EXTS);
}

async function listVideoFiles(dir: string): Promise<Set<string>> {
  return listMediaFiles(dir, VIDEO_EXTS);
}

export function isIgnoredMediaName(name: string): boolean {
  const base = path.basename(name);
  const lower = base.toLowerCase();
  if (IGNORED_MEDIA_BASENAMES.has(lower)) return true;
  return /^ref-.*\.png$/i.test(base);
}

const MEDIA_TOOL_NAMES = new Set([
  'image_gen',
  'image_edit',
  'image_to_video',
  'reference_to_video',
]);

export function eventSessionId(ev: Record<string, unknown>): string | null {
  const data =
    ev.data && typeof ev.data === 'object'
      ? (ev.data as Record<string, unknown>)
      : {};
  for (const v of [ev.sessionId, ev.session_id, data.sessionId, data.session_id]) {
    if (typeof v === 'string' && isUuid(v)) return v;
  }
  return null;
}

export function isSuccessfulMediaToolEvent(ev: Record<string, unknown>): boolean {
  const data =
    ev.data && typeof ev.data === 'object'
      ? (ev.data as Record<string, unknown>)
      : {};
  const t = String(ev.type || '').toLowerCase();
  const name = String(
    ev.tool_name || ev.toolName || data.tool_name || data.toolName || data.name || '',
  ).toLowerCase();
  const outcome = String(
    ev.outcome || ev.status || data.outcome || data.status || '',
  ).toLowerCase();
  if (!MEDIA_TOOL_NAMES.has(name)) return false;
  if (t !== 'tool_completed' && t !== 'tool_result') return false;
  return (
    outcome === 'success' ||
    outcome === 'ok' ||
    outcome === 'completed' ||
    outcome === ''
  );
}

/** ~/.grok/sessions/<encodeURIComponent(realpath(sandbox))> */
export function grokSessionGroupDir(sandboxAbs: string, grokHome?: string): string {
  const home = grokHome || resolveGrokHome();
  return path.join(home, 'sessions', encodeURIComponent(path.resolve(sandboxAbs)));
}

export async function findRunSessionDir(
  sandboxAbs: string,
  sessionId?: string | null,
  grokHome?: string,
): Promise<string | null> {
  const home = grokHome || resolveGrokHome();
  const sessionsRoot = path.join(home, 'sessions');
  let sessionsReal: string;
  try {
    sessionsReal = await fs.realpath(sessionsRoot);
  } catch {
    return null;
  }
  const group = grokSessionGroupDir(sandboxAbs, home);
  const pickIfSafe = async (dir: string): Promise<string | null> => {
    try {
      const real = await fs.realpath(dir);
      if (
        real === sessionsReal ||
        !real.startsWith(sessionsReal + path.sep)
      ) {
        return null;
      }
      return real;
    } catch {
      return null;
    }
  };
  if (sessionId && isUuid(sessionId)) {
    const hit = await pickIfSafe(path.join(group, sessionId));
    if (hit) return hit;
  }
  let names: string[] = [];
  try {
    names = await fs.readdir(group);
  } catch {
    return null;
  }
  const uuids = names.filter((n) => isUuid(n));
  if (!uuids.length) return null;
  const ranked = await rankByMtimeNewest(
    uuids.map((id) => path.join(group, id)),
  );
  for (const dir of ranked) {
    const hit = await pickIfSafe(dir);
    if (hit) return hit;
  }
  return null;
}

export async function listRunSessionMedia(opts: {
  sandbox: string;
  sessionId?: string | null;
  collect: 'image' | 'video';
  grokHome?: string;
}): Promise<Set<string>> {
  const out = new Set<string>();
  const sessionDir = await findRunSessionDir(
    opts.sandbox,
    opts.sessionId,
    opts.grokHome,
  );
  if (!sessionDir) return out;
  const exts = opts.collect === 'video' ? VIDEO_EXTS : IMAGE_EXTS;
  const subdirs =
    opts.collect === 'video' ? ['videos', 'images'] : ['images'];
  for (const sub of subdirs) {
    const listed = await listMediaFiles(path.join(sessionDir, sub), exts);
    for (const f of listed) {
      try {
        const real = await fs.realpath(f);
        if (real === sessionDir || real.startsWith(sessionDir + path.sep)) {
          out.add(real);
        }
      } catch {
        /* skip unreadable / dangling */
      }
    }
  }
  return out;
}

export async function copyNewestSessionMediaToSandbox(opts: {
  sandbox: string;
  sessionId?: string | null;
  collect: 'image' | 'video';
  grokHome?: string;
  overwrite?: boolean;
}): Promise<string | null> {
  if (!opts.overwrite) {
    const existing = await preferredSandboxOutput(opts.sandbox, opts.collect);
    if (existing) return existing;
  }
  const files = [...(await listRunSessionMedia(opts))];
  if (!files.length) return null;
  const newest = (await rankByMtimeNewest(files))[0];
  if (!newest) return null;
  const ext = path.extname(newest).toLowerCase();
  const destName =
    opts.collect === 'video'
      ? 'output.mp4'
      : ext === '.jpg' || ext === '.jpeg'
        ? 'output.jpg'
        : ext === '.webp'
          ? 'output.webp'
          : 'output.png';
  const dest = path.join(opts.sandbox, destName);
  try {
    await fs.copyFile(newest, dest);
    const others =
      opts.collect === 'video' ? VIDEO_OUTPUT_BASENAMES : IMAGE_OUTPUT_BASENAMES;
    for (const name of others) {
      if (name === destName) continue;
      await fs.unlink(path.join(opts.sandbox, name)).catch(() => undefined);
    }
    logger.info(
      { src: newest, dest, collect: opts.collect },
      'Media gen: copied session artifact into sandbox',
    );
    return dest;
  } catch (err) {
    logger.warn(
      { err, src: newest, dest },
      'Media gen: failed to copy session artifact',
    );
    return newest;
  }
}

async function preferredSandboxOutput(
  sandbox: string,
  collect: 'image' | 'video',
): Promise<string | null> {
  const after = await listMediaFiles(
    sandbox,
    collect === 'video' ? VIDEO_EXTS : IMAGE_EXTS,
  );
  let sandboxReal: string;
  try {
    sandboxReal = await fs.realpath(sandbox);
  } catch {
    sandboxReal = path.resolve(sandbox);
  }
  const names = collect === 'video' ? VIDEO_OUTPUT_BASENAMES : IMAGE_OUTPUT_BASENAMES;
  for (const name of names) {
    const hit = rootOutputPath(sandboxReal, after, name);
    if (hit) return hit;
  }
  return null;
}

function isInsideSandbox(sandboxReal: string, candidateReal: string): boolean {
  return (
    candidateReal === sandboxReal ||
    candidateReal.startsWith(sandboxReal + path.sep)
  );
}

async function resolveInsideSandbox(
  sandboxReal: string,
  candidate: string,
): Promise<string | null> {
  try {
    const real = await fs.realpath(candidate);
    return isInsideSandbox(sandboxReal, real) ? real : null;
  } catch {
    const abs = path.resolve(candidate);
    return isInsideSandbox(sandboxReal, abs) ? abs : null;
  }
}

/** Recursive sandbox scan. Never follows links out of `dir` (not ~/.grok/sessions). */
export async function listMediaFiles(
  dir: string,
  exts: Set<string>,
): Promise<Set<string>> {
  const out = new Set<string>();
  let root: string;
  try {
    root = await fs.realpath(dir);
  } catch {
    return out;
  }

  const walk = async (current: string): Promise<void> => {
    const contained = await resolveInsideSandbox(root, current);
    if (!contained) return;
    let entries;
    try {
      entries = await fs.readdir(contained, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(contained, e.name);
      const next = await resolveInsideSandbox(root, full);
      if (!next) continue;
      try {
        const st = await fs.stat(next);
        if (st.isDirectory()) {
          await walk(next);
          continue;
        }
        if (!st.isFile()) continue;
      } catch {
        continue;
      }
      if (isIgnoredMediaName(e.name)) continue;
      const ext = path.extname(e.name).toLowerCase();
      if (!exts.has(ext)) continue;
      out.add(next);
    }
  };

  await walk(root);
  return out;
}

async function rankByMtimeNewest(files: string[]): Promise<string[]> {
  const scored = await Promise.all(
    files.map(async (file) => {
      try {
        const st = await fs.stat(file);
        return { file, mtime: st.mtimeMs };
      } catch {
        return { file, mtime: 0 };
      }
    }),
  );
  scored.sort((a, b) => b.mtime - a.mtime);
  return scored.map((s) => s.file);
}

function rootOutputPath(
  sandboxReal: string,
  after: Set<string>,
  name: string,
): string | null {
  const want = path.join(sandboxReal, name);
  for (const file of after) {
    if (path.resolve(file) === want) return file;
  }
  return null;
}

/** Prefer root output.*, then files new this run, then newest mtime in sandbox. */
export async function selectCollectedMedia(opts: {
  sandbox: string;
  before: Set<string>;
  after: Set<string>;
  collect: 'image' | 'video';
  n?: number;
}): Promise<string[]> {
  const n = Math.min(Math.max(opts.n ?? 1, 1), 4);
  let sandboxReal: string;
  try {
    sandboxReal = await fs.realpath(opts.sandbox);
  } catch {
    sandboxReal = path.resolve(opts.sandbox);
  }

  const preferred: string[] = [];
  const outputNames =
    opts.collect === 'video' ? VIDEO_OUTPUT_BASENAMES : IMAGE_OUTPUT_BASENAMES;
  for (const name of outputNames) {
    const hit = rootOutputPath(sandboxReal, opts.after, name);
    if (hit) preferred.push(hit);
  }

  const afterList = [...opts.after];
  const newFiles = afterList.filter((f) => !opts.before.has(f));
  const fillPool = newFiles.length ? newFiles : afterList;
  const ranked = await rankByMtimeNewest(
    fillPool.filter((f) => !preferred.includes(f)),
  );

  const out: string[] = [];
  for (const file of [...preferred, ...ranked]) {
    if (out.length >= n) break;
    if (!out.includes(file)) out.push(file);
  }
  return out;
}

export const grokToolsMediaProvider = new GrokToolsMediaProvider();
