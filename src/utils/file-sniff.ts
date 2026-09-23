import path from 'node:path';
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  ALLOWED_UPLOAD_MIME_TYPES,
  EXT_MIME_MAP,
} from '../config/constants';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { sanitizeFilename } from './path-safe';

const TEXT_EXTS = new Set([
  '.txt',
  '.md',
  '.markdown',
  '.csv',
  '.json',
  '.xml',
  '.html',
  '.htm',
  '.js',
  '.ts',
  '.tsx',
  '.jsx',
  '.py',
  '.java',
  '.go',
  '.rs',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
  '.css',
  '.yml',
  '.yaml',
  '.toml',
  '.ini',
  '.env',
  '.sh',
  '.sql',
  '.log',
]);

function startsWith(buf: Buffer, sig: number[] | string): boolean {
  if (typeof sig === 'string') {
    const s = Buffer.from(sig, 'utf8');
    if (buf.length < s.length) return false;
    return buf.subarray(0, s.length).equals(s);
  }
  if (buf.length < sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (buf[i] !== sig[i]) return false;
  }
  return true;
}

/** Block obvious binaries (ELF/PE/Mach-O). Shebang only rejected for non-.sh. */
export function isDangerousExecutable(buf: Buffer, ext?: string): boolean {
  if (buf.length < 4) return false;
  // ELF
  if (startsWith(buf, [0x7f, 0x45, 0x4c, 0x46])) return true;
  // PE / DOS MZ
  if (startsWith(buf, [0x4d, 0x5a])) return true;
  // Mach-O (32/64 fat)
  if (
    startsWith(buf, [0xfe, 0xed, 0xfa, 0xce]) ||
    startsWith(buf, [0xfe, 0xed, 0xfa, 0xcf]) ||
    startsWith(buf, [0xce, 0xfa, 0xed, 0xfe]) ||
    startsWith(buf, [0xcf, 0xfa, 0xed, 0xfe]) ||
    startsWith(buf, [0xca, 0xfe, 0xba, 0xbe])
  ) {
    return true;
  }
  // Shebang: allow only for .sh text scripts
  if (startsWith(buf, '#!/') && ext !== '.sh') {
    return true;
  }
  return false;
}

function looksLikeText(buf: Buffer): boolean {
  const sample = buf.subarray(0, Math.min(8192, buf.length));
  if (sample.includes(0)) return false;
  // Allow high UTF-8; reject too many control chars (except tab/lf/cr)
  let ctrl = 0;
  for (const b of sample) {
    if (b < 9 || (b > 13 && b < 32)) ctrl += 1;
  }
  return ctrl / Math.max(1, sample.length) < 0.02;
}

function magicMatchesExt(ext: string, buf: Buffer): boolean {
  switch (ext) {
    case '.pdf':
      return startsWith(buf, '%PDF');
    case '.png':
      return startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case '.jpg':
    case '.jpeg':
      return startsWith(buf, [0xff, 0xd8, 0xff]);
    case '.gif':
      return startsWith(buf, 'GIF87a') || startsWith(buf, 'GIF89a');
    case '.webp':
      return (
        buf.length >= 12 &&
        startsWith(buf, 'RIFF') &&
        buf.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    default:
      if (TEXT_EXTS.has(ext)) return looksLikeText(buf);
      // Unknown binary types we allow only with exact map — default require non-empty
      return buf.length > 0;
  }
}

/**
 * Strict upload gate: filename, ext+mime allowlist, ext↔mime map,
 * magic bytes, executable signatures.
 */
export function assertSafeUpload(opts: {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
}): { originalName: string; mimeType: string; ext: string } {
  if (!opts.buffer || opts.buffer.length === 0) {
    throw ExceptionFactory.validation('Empty file is not allowed');
  }

  const originalName = sanitizeFilename(opts.originalName);
  if (!originalName || originalName.length > 255) {
    throw ExceptionFactory.validation('Invalid filename');
  }
  if (originalName.includes('..') || /[/\0]/.test(originalName)) {
    throw ExceptionFactory.validation('Invalid filename');
  }

  const ext = path.extname(originalName).toLowerCase();
  if (!ext || !ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
    throw ExceptionFactory.documentTypeNotAllowed(
      `Extension "${ext || '(none)'}" is not allowed`,
    );
  }

  const mime = (opts.mimeType || '').toLowerCase().split(';')[0]!.trim();
  if (!mime || !ALLOWED_UPLOAD_MIME_TYPES.has(mime)) {
    throw ExceptionFactory.documentTypeNotAllowed(
      `MIME type "${mime || '(none)'}" is not allowed`,
    );
  }

  const allowedMimes = EXT_MIME_MAP[ext];
  if (!allowedMimes || !allowedMimes.has(mime)) {
    throw ExceptionFactory.documentTypeNotAllowed(
      `MIME "${mime}" does not match extension "${ext}"`,
    );
  }

  if (isDangerousExecutable(opts.buffer, ext)) {
    throw ExceptionFactory.documentTypeNotAllowed(
      'Executable or binary program content is not allowed',
    );
  }

  if (!magicMatchesExt(ext, opts.buffer)) {
    throw ExceptionFactory.documentTypeNotAllowed(
      `File content does not match declared type "${ext}" / "${mime}"`,
    );
  }

  return { originalName, mimeType: mime, ext };
}
