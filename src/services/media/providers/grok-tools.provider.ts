import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isUuid } from '../../../utils/grok-session';
import { logger } from '../../../utils/logger';
import { ExceptionFactory } from '../../../exceptions/exception.factory';
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

/**
 * Generate / edit images via Grok CLI (Imagine skill + tools).
 * Execution limits come from policyService (same as chat): maxTurns, timeout, tools, alwaysApprove.
 */
export class GrokToolsMediaProvider implements MediaProvider {
  readonly id = 'grok-tools';

  async editImage(_req: ImageEditRequest): Promise<MediaArtifact[]> {
    throw ExceptionFactory.engineUnconfigured('image runtime not attached');
  }

  async generateImage(_req: ImageGenRequest): Promise<MediaArtifact[]> {
    throw ExceptionFactory.engineUnconfigured('image runtime not attached');
  }

  async generateVideoFromImage(_req: {
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
    throw ExceptionFactory.engineUnconfigured('video runtime not attached');
  }

  async generateVideoFromReferences(_req: {
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
    throw ExceptionFactory.engineUnconfigured('video runtime not attached');
  }
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
