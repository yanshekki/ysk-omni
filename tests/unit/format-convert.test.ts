import { describe, expect, it } from 'vitest';
import {
  convertAudio,
  convertImage,
  convertVideo,
  formatTranscript,
  normalizeAudioFormat,
  normalizeImageFormat,
  normalizeVideoFormat,
} from '../../src/services/media/format-convert';
import { VIDEO_FIXTURE_BYTES } from '../../src/services/media/media-jobs.service';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('format-convert', () => {
  it('normalizes aliases', () => {
    expect(normalizeImageFormat('jpg')).toBe('jpeg');
    expect(normalizeAudioFormat('mpeg')).toBe('mp3');
    expect(normalizeVideoFormat('webm')).toBe('webm');
  });

  it('formats transcripts', () => {
    const srt = formatTranscript('hello', 'srt', 1);
    expect(srt.format).toBe('srt');
    expect(srt.bytes.toString('utf8')).toContain('hello');
    const vtt = formatTranscript('hello', 'vtt', 1);
    expect(vtt.bytes.toString('utf8')).toMatch(/^WEBVTT/);
    const json = formatTranscript('hello', 'json');
    expect(JSON.parse(json.bytes.toString('utf8')).text).toBe('hello');
  });

  it('converts png to jpeg via ffmpeg', () => {
    const out = convertImage(PNG, 'jpeg');
    expect(out.format).toBe('jpeg');
    expect(out.bytes[0]).toBe(0xff);
    expect(out.bytes[1]).toBe(0xd8);
  });

  it('converts fixture mp4 to webm via ffmpeg', () => {
    const out = convertVideo(VIDEO_FIXTURE_BYTES, 'webm');
    expect(out.format).toBe('webm');
    expect(out.bytes.length).toBeGreaterThan(32);
  });
});
