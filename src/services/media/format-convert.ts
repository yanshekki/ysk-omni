import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const IMAGE_FORMATS = ['png', 'jpeg', 'webp'] as const;
export const AUDIO_FORMATS = ['wav', 'mp3', 'opus', 'flac', 'aac'] as const;
export const VIDEO_FORMATS = ['mp4', 'webm', 'mov'] as const;
export const TRANSCRIPT_FORMATS = ['txt', 'json', 'srt', 'vtt'] as const;

export type ImageFormat = (typeof IMAGE_FORMATS)[number];
export type AudioFormat = (typeof AUDIO_FORMATS)[number];
export type VideoFormat = (typeof VIDEO_FORMATS)[number];
export type TranscriptFormat = (typeof TRANSCRIPT_FORMATS)[number];

const IMAGE_MIME: Record<ImageFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};
const AUDIO_MIME: Record<AudioFormat, string> = {
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
  opus: 'audio/ogg',
  flac: 'audio/flac',
  aac: 'audio/aac',
};
const VIDEO_MIME: Record<VideoFormat, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
};
const TRANSCRIPT_MIME: Record<TranscriptFormat, string> = {
  txt: 'text/plain',
  json: 'application/json',
  srt: 'application/x-subrip',
  vtt: 'text/vtt',
};

export function normalizeImageFormat(raw?: string): ImageFormat {
  const v = String(raw || '').toLowerCase().replace('jpg', 'jpeg');
  return (IMAGE_FORMATS as readonly string[]).includes(v) ? (v as ImageFormat) : 'png';
}
export function normalizeAudioFormat(raw?: string): AudioFormat {
  const v = String(raw || '').toLowerCase();
  if (v === 'mpeg') return 'mp3';
  return (AUDIO_FORMATS as readonly string[]).includes(v) ? (v as AudioFormat) : 'wav';
}
export function normalizeVideoFormat(raw?: string): VideoFormat {
  const v = String(raw || '').toLowerCase();
  return (VIDEO_FORMATS as readonly string[]).includes(v) ? (v as VideoFormat) : 'mp4';
}
export function normalizeTranscriptFormat(raw?: string): TranscriptFormat {
  const v = String(raw || '').toLowerCase();
  return (TRANSCRIPT_FORMATS as readonly string[]).includes(v)
    ? (v as TranscriptFormat)
    : 'txt';
}

export function mimeForImage(fmt: ImageFormat): string {
  return IMAGE_MIME[fmt];
}
export function mimeForAudio(fmt: AudioFormat): string {
  return AUDIO_MIME[fmt];
}
export function mimeForVideo(fmt: VideoFormat): string {
  return VIDEO_MIME[fmt];
}
export function mimeForTranscript(fmt: TranscriptFormat): string {
  return TRANSCRIPT_MIME[fmt];
}

function ffmpegBin(): string {
  return process.env.FFMPEG_PATH?.trim() || 'ffmpeg';
}

function runFfmpeg(args: string[]): void {
  const r = spawnSync(ffmpegBin(), args, {
    encoding: 'utf8',
    timeout: 120_000,
  });
  if (r.status !== 0) {
    throw new Error((r.stderr || r.stdout || 'ffmpeg failed').slice(-400));
  }
}

function withTempPair(
  inExt: string,
  outExt: string,
  input: Buffer,
  argsFor: (src: string, dest: string) => string[],
): Buffer {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ysk-fmt-'));
  const src = path.join(dir, `in${inExt}`);
  const dest = path.join(dir, `out${outExt}`);
  try {
    fs.writeFileSync(src, input);
    runFfmpeg(argsFor(src, dest));
    return fs.readFileSync(dest);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function sniffInExt(buf: Buffer, fallback: string): string {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return '.png';
  }
  if (buf.length >= 3 && buf.subarray(0, 3).toString('ascii') === 'GIF') return '.gif';
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) return '.jpg';
  if (buf.length >= 12 && buf.subarray(4, 8).toString('ascii') === 'ftyp') return '.mp4';
  if (buf.length >= 4 && buf.subarray(0, 4).toString('ascii') === 'RIFF') {
    const kind = buf.subarray(8, 12).toString('ascii');
    if (kind === 'WAVE') return '.wav';
    if (kind === 'WEBP') return '.webp';
  }
  return fallback;
}

export function convertImage(buf: Buffer, format?: string): { bytes: Buffer; mime: string; format: ImageFormat } {
  const fmt = normalizeImageFormat(format);
  const mime = mimeForImage(fmt);
  if (fmt === 'png' && sniffInExt(buf, '.png') === '.png') {
    return { bytes: buf, mime, format: fmt };
  }
  const outExt = fmt === 'jpeg' ? '.jpg' : `.${fmt}`;
  const bytes = withTempPair(sniffInExt(buf, '.png'), outExt, buf, (src, dest) => [
    '-y',
    '-i',
    src,
    ...(fmt === 'jpeg' ? ['-q:v', '3'] : []),
    dest,
  ]);
  return { bytes, mime, format: fmt };
}

export function convertAudio(buf: Buffer, format?: string): { bytes: Buffer; mime: string; format: AudioFormat } {
  const fmt = normalizeAudioFormat(format);
  const mime = mimeForAudio(fmt);
  if (fmt === 'wav' && sniffInExt(buf, '.wav') === '.wav') {
    return { bytes: buf, mime, format: fmt };
  }
  const codec: Record<AudioFormat, string[]> = {
    wav: ['-c:a', 'pcm_s16le'],
    mp3: ['-c:a', 'libmp3lame', '-q:a', '4'],
    opus: ['-c:a', 'libopus', '-b:a', '48k'],
    flac: ['-c:a', 'flac'],
    aac: ['-c:a', 'aac', '-b:a', '96k'],
  };
  const bytes = withTempPair(sniffInExt(buf, '.wav'), `.${fmt}`, buf, (src, dest) => [
    '-y',
    '-i',
    src,
    ...codec[fmt],
    dest,
  ]);
  return { bytes, mime, format: fmt };
}

export function convertVideo(buf: Buffer, format?: string): { bytes: Buffer; mime: string; format: VideoFormat } {
  const fmt = normalizeVideoFormat(format);
  const mime = mimeForVideo(fmt);
  if (fmt === 'mp4' && sniffInExt(buf, '.mp4') === '.mp4') {
    return { bytes: buf, mime, format: fmt };
  }
  const extra: Record<VideoFormat, string[]> = {
    mp4: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
    webm: ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '35'],
    mov: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-f', 'mov'],
  };
  const bytes = withTempPair(sniffInExt(buf, '.mp4'), `.${fmt}`, buf, (src, dest) => [
    '-y',
    '-i',
    src,
    ...extra[fmt],
    dest,
  ]);
  return { bytes, mime, format: fmt };
}

function srtStamp(sec: number): string {
  const ms = Math.max(0, Math.round(sec * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(milli, 3)}`;
}

function vttStamp(sec: number): string {
  return srtStamp(sec).replace(',', '.');
}

export function formatTranscript(
  text: string,
  format?: string,
  durationSec = 2,
): { bytes: Buffer; mime: string; format: TranscriptFormat } {
  const fmt = normalizeTranscriptFormat(format);
  const body = text.trim() || ' ';
  const end = Math.max(0.5, durationSec);
  let out = body;
  if (fmt === 'json') out = JSON.stringify({ text: body });
  else if (fmt === 'srt') {
    out = `1\n${srtStamp(0)} --> ${srtStamp(end)}\n${body}\n`;
  } else if (fmt === 'vtt') {
    out = `WEBVTT\n\n${vttStamp(0)} --> ${vttStamp(end)}\n${body}\n`;
  }
  return {
    bytes: Buffer.from(out, 'utf8'),
    mime: mimeForTranscript(fmt),
    format: fmt,
  };
}
