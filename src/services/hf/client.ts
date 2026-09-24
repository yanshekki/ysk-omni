import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { parseHfSpec, pickPullFiles, listQuants } from './spec';

export type HubFile = { path: string; size?: number };

function hfHeaders(): Record<string, string> {
  const token = process.env.HF_TOKEN?.trim();
  const h: Record<string, string> = { 'User-Agent': 'ysk-omni' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function getJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: hfHeaders() }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c as Buffer));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if ((res.statusCode || 0) >= 400) {
          reject(new Error(`HF ${res.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
  });
}

export function encodeRepoId(repoId: string): string {
  return repoId
    .split('/')
    .map((p) => encodeURIComponent(p))
    .join('/');
}

export async function listHubFiles(repoId: string): Promise<HubFile[]> {
  const treeUrl = `https://huggingface.co/api/models/${encodeRepoId(repoId)}/tree/main?recursive=1`;
  try {
    const data = await getJson(treeUrl);
    if (Array.isArray(data)) {
      return data
        .filter((n) => n && typeof n === 'object' && (n as { type?: string }).type === 'file')
        .map((n) => {
          const o = n as { path?: string; size?: number };
          return { path: String(o.path || ''), size: o.size };
        })
        .filter((f) => f.path);
    }
  } catch {
    /* fallback */
  }
  const infoUrl = `https://huggingface.co/api/models/${encodeRepoId(repoId)}`;
  const info = (await getJson(infoUrl)) as { siblings?: Array<{ rfilename?: string; size?: number }> };
  return (info.siblings || [])
    .map((s) => ({ path: String(s.rfilename || ''), size: s.size }))
    .filter((f) => f.path);
}

export async function listRepoQuants(specRaw: string): Promise<string[]> {
  const spec = parseHfSpec(specRaw);
  const files = await listHubFiles(spec.repoId);
  return listQuants(files);
}

export type PullProgress = {
  status: 'starting' | 'downloading' | 'done' | 'skipped' | 'error';
  model: string;
  file?: string;
  bytes?: number;
  total?: number;
  path?: string;
  reason?: string;
};

export async function pullModel(
  specRaw: string,
  destDir: string,
  onProgress?: (p: PullProgress) => void,
): Promise<PullProgress> {
  const spec = parseHfSpec(specRaw);
  const emit = (p: PullProgress) => onProgress?.(p);
  emit({ status: 'starting', model: specRaw });
  let files: HubFile[];
  try {
    files = await listHubFiles(spec.repoId);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    const skipped: PullProgress = {
      status: 'skipped',
      model: specRaw,
      reason: `Hugging Face list failed: ${reason}`,
    };
    emit(skipped);
    return skipped;
  }
  const picked = pickPullFiles(files, spec.quant);
  if (!picked.length) {
    const skipped: PullProgress = {
      status: 'skipped',
      model: specRaw,
      reason: 'no GGUF, whisper, or diffusion weights in repo',
    };
    emit(skipped);
    return skipped;
  }
  const snapshot = picked.length > 1 || !picked[0].path.toLowerCase().endsWith('.gguf');
  const destRoot = snapshot
    ? path.join(destDir, spec.repoId.replace(/\//g, '__'))
    : destDir;
  fs.mkdirSync(destRoot, { recursive: true });
  let lastDest = destRoot;
  let downloaded = 0;
  const totalAll = picked.reduce((s, f) => s + (f.size || 0), 0) || undefined;
  for (const file of picked) {
    const url = `https://huggingface.co/${encodeRepoId(spec.repoId)}/resolve/main/${file.path
      .split('/')
      .map((p) => encodeURIComponent(p))
      .join('/')}`;
    const dest = snapshot
      ? path.join(destRoot, file.path)
      : path.join(destRoot, path.basename(file.path));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      await downloadResume(url, dest, (bytes, total) => {
        emit({
          status: 'downloading',
          model: specRaw,
          file: file.path,
          bytes: downloaded + bytes,
          total: totalAll || total,
        });
      });
      downloaded += fs.existsSync(dest) ? fs.statSync(dest).size : 0;
      lastDest = dest;
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      const skipped: PullProgress = {
        status: 'skipped',
        model: specRaw,
        file: file.path,
        reason: `download failed: ${reason}`,
      };
      emit(skipped);
      return skipped;
    }
  }
  const donePath = snapshot ? destRoot : lastDest;
  const done: PullProgress = {
    status: 'done',
    model: specRaw,
    file: picked[0].path,
    path: donePath,
  };
  emit(done);
  return done;
}

function downloadResume(
  url: string,
  dest: string,
  onBytes: (bytes: number, total?: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
    const headers = hfHeaders();
    if (existing > 0) headers.Range = `bytes=${existing}-`;
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        downloadResume(next, dest, onBytes).then(resolve, reject);
        return;
      }
      if ((res.statusCode || 0) >= 400) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const totalHeader = res.headers['content-length'];
      const extra = totalHeader ? Number(totalHeader) : undefined;
      const total = extra != null ? extra + (res.statusCode === 206 ? existing : 0) : undefined;
      const flags = res.statusCode === 206 ? 'a' : 'w';
      const out = fs.createWriteStream(dest, { flags });
      let bytes = res.statusCode === 206 ? existing : 0;
      res.on('data', (c: Buffer) => {
        bytes += c.length;
        onBytes(bytes, total);
      });
      res.pipe(out);
      out.on('finish', () => resolve());
      out.on('error', reject);
    });
    req.on('error', reject);
  });
}
