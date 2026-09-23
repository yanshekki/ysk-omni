import { describe, expect, it } from 'vitest';
import {
  isBrowserPreviewable,
  mediaPreviewKind,
} from '../../../../admin/src/lib/media-preview';

describe('mediaPreviewKind', () => {
  it('detects images', () => {
    expect(mediaPreviewKind('image/png')).toBe('image');
    expect(mediaPreviewKind('', 'photo.jpg')).toBe('image');
  });

  it('detects mp4 / webm video', () => {
    expect(mediaPreviewKind('video/mp4')).toBe('video');
    expect(mediaPreviewKind('video/webm', 'clip.webm')).toBe('video');
    expect(mediaPreviewKind('', 'out.mp4')).toBe('video');
  });

  it('detects audio and pdf and text', () => {
    expect(mediaPreviewKind('audio/mpeg', 'a.mp3')).toBe('audio');
    expect(mediaPreviewKind('application/pdf')).toBe('pdf');
    expect(mediaPreviewKind('text/plain', 'n.txt')).toBe('text');
    expect(mediaPreviewKind('application/json')).toBe('text');
  });

  it('rejects unknown binaries', () => {
    expect(mediaPreviewKind('application/octet-stream', 'x.bin')).toBeNull();
    expect(isBrowserPreviewable('application/zip', 'a.zip')).toBe(false);
  });
});
