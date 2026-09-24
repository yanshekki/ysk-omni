export type HfSpec = {
  repoId: string;
  quant?: string;
};

const HOST_PREFIXES = [
  'https://huggingface.co/',
  'http://huggingface.co/',
  'https://hf.co/',
  'http://hf.co/',
  'hf.co/',
  'huggingface.co/',
];

const QUANT_RE = /^(Q\d+_K_[MSL]|Q\d+_0|Q\d+_1|IQ\d+_XS|IQ\d+_XXS|F16|F32|BF16)$/i;

export function parseHfSpec(raw: string): HfSpec {
  let input = raw.trim();
  if (!input) {
    throw new Error('empty Hugging Face spec');
  }
  for (const p of HOST_PREFIXES) {
    if (input.toLowerCase().startsWith(p.toLowerCase())) {
      input = input.slice(p.length);
      break;
    }
  }
  input = input.replace(/^\/+/, '').replace(/\/+$/, '');

  let quant: string | undefined;
  const colon = input.lastIndexOf(':');
  if (colon > 0) {
    const maybeQuant = input.slice(colon + 1).trim();
    if (QUANT_RE.test(maybeQuant) || /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(maybeQuant)) {
      if (maybeQuant.includes('/')) {
        /* repo path, not quant */
      } else {
        quant = maybeQuant;
        input = input.slice(0, colon);
      }
    }
  }

  const parts = input.split('/').filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`invalid Hugging Face spec: ${raw}`);
  }
  const repoId = `${parts[0]}/${parts[1]}`;
  return quant ? { repoId, quant } : { repoId };
}

export function isGgufName(filename: string): boolean {
  return filename.toLowerCase().endsWith('.gguf');
}

/** Extract a quant tag from a GGUF filename, if present. */
export function quantFromFilename(filename: string): string | undefined {
  const base = filename.split('/').pop() || filename;
  const m = base.match(/\.(Q\d+_K_[MSL]|Q\d+_0|Q\d+_1|IQ\d+_XS|F16|F32|BF16)\.gguf$/i);
  if (m?.[1]) return m[1].toUpperCase();
  const m2 = base.match(/[-_.](Q\d+_K_[MSL]|Q\d+_0|F16|F32)\.gguf$/i);
  return m2?.[1]?.toUpperCase();
}

/**
 * Prefer an explicit quant, else Q4_K_M, else the first GGUF.
 */
export function pickGgufFile(
  files: Array<{ path: string }>,
  requestedQuant?: string,
): { path: string; quant?: string } | null {
  const ggufs = files.filter((f) => isGgufName(f.path));
  if (!ggufs.length) return null;
  const wanted = requestedQuant?.toUpperCase();
  if (wanted) {
    const hit = ggufs.find((f) => {
      const q = quantFromFilename(f.path);
      return q === wanted || f.path.toUpperCase().includes(wanted);
    });
    if (hit) return { path: hit.path, quant: quantFromFilename(hit.path) || wanted };
  }
  const q4 = ggufs.find((f) => (quantFromFilename(f.path) || '') === 'Q4_K_M');
  if (q4) return { path: q4.path, quant: 'Q4_K_M' };
  const first = ggufs[0]!;
  return { path: first.path, quant: quantFromFilename(first.path) };
}

const SKIP_PULL_NAME =
  /(^|\/)(README(\.[a-z]+)?|LICENSE.*|\.gitattributes)$/i;
const SKIP_PULL_EXT = /\.(h5|msgpack|ot|pkl|png|jpg|jpeg|gif|webp|md)$/i;
const MAX_PULL_FILE_BYTES = 900 * 1024 * 1024;

/** GGUF first; else snapshot weights for whisper / diffusion repos. */
export function pickPullFiles(
  files: Array<{ path: string; size?: number }>,
  requestedQuant?: string,
): Array<{ path: string; size?: number }> {
  const gguf = pickGgufFile(files, requestedQuant);
  if (gguf) {
    const meta = files.find((f) => f.path === gguf.path);
    return [{ path: gguf.path, size: meta?.size }];
  }
  return files.filter((f) => {
    if (!f.path || f.path.endsWith('/')) return false;
    if (SKIP_PULL_NAME.test(f.path) || SKIP_PULL_EXT.test(f.path)) return false;
    if ((f.size || 0) > MAX_PULL_FILE_BYTES) return false;
    return (
      /\.(bin|safetensors|json|txt|model)$/i.test(f.path) ||
      /model_index\.json$/i.test(f.path)
    );
  });
}

export function inferRuntimeFromFilenames(
  repoId: string,
  names: string[],
): { runtime: 'llamacpp' | 'vllm' | 'diffusion' | 'whisper'; modality: 'text' | 'image' | 'stt' | 'tts' | 'video' } {
  const n = names.map((x) => x.replace(/\\/g, '/').toLowerCase());
  if (n.some((x) => x.endsWith('.gguf'))) {
    return { runtime: 'llamacpp', modality: 'text' };
  }
  if (n.some((x) => x.endsWith('model_index.json') || x.includes('/unet/'))) {
    return { runtime: 'diffusion', modality: 'image' };
  }
  if (
    n.some((x) => /ggml-.*\.bin$/.test(x) || x.endsWith('model.bin')) &&
    n.some((x) => /vocab|tokenizer|config\.json|ggml/.test(x))
  ) {
    return { runtime: 'whisper', modality: 'stt' };
  }
  const id = repoId.toLowerCase();
  if (id.includes('whisper')) return { runtime: 'whisper', modality: 'stt' };
  if (id.includes('stable-diffusion') || id.includes('tiny-sd') || id.includes('flux')) {
    return { runtime: 'diffusion', modality: 'image' };
  }
  return { runtime: 'vllm', modality: 'text' };
}

export function listQuants(files: Array<{ path: string }>): string[] {
  const out: string[] = [];
  for (const f of files) {
    if (!isGgufName(f.path)) continue;
    const q = quantFromFilename(f.path);
    if (q && !out.includes(q)) out.push(q);
  }
  return out;
}
