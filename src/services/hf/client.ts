import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { parseHfSpec, pickGgufFile, listQuants } from './spec';

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
  const picked = pickGgufFile(files, spec.quant);
  if (!picked) {
    const skipped: PullProgress = {
      status: 'skipped',
      model: specRaw,
      reason: 'no GGUF file in repo (safetensors ids are recorded without download)',
    };
    emit(skipped);
    return skipped;
  }
  const url = `https://huggingface.co/${encodeRepoId(spec.repoId)}/resolve/main/${picked.path.split('/').map((p) => encodeURIComponent(p)).join('/')}`;
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, path.basename(picked.path));
  try {
    await downloadResume(url, dest, (bytes, total) => {
      emit({
        status: 'downloading',
        model: specRaw,
        file: picked.path,
        bytes,
        total,
      });
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    const skipped: PullProgress = {
      status: 'skipped',
      model: specRaw,
      file: picked.path,
      reason: `download failed: ${reason}`,
    };
    emit(skipped);
    return skipped;
  }
  const done: PullProgress = {
    status: 'done',
    model: specRaw,
    file: picked.path,
    path: dest,
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
        downloadResume(res.headers.location, dest, onBytes).then(resolve, reject);
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
