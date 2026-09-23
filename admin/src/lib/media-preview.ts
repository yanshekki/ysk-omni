/**
 * Browser-previewable media kinds for Admin Media library.
 */
export type MediaPreviewKind = 'image' | 'video' | 'audio' | 'pdf' | 'text';

export function mediaPreviewKind(
  mime?: string | null,
  filename = '',
): MediaPreviewKind | null {
  const m = String(mime || '')
    .toLowerCase()
    .trim();
  const name = String(filename || '').toLowerCase();
  const ext = (name.match(/\.([a-z0-9]+)$/) || [])[1] || '';

  if (
    m.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif', 'ico'].includes(
      ext,
    )
  ) {
    return 'image';
  }
  if (
    m.startsWith('video/') ||
    ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v'].includes(ext)
  ) {
    return 'video';
  }
  if (
    m.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus'].includes(ext)
  ) {
    return 'audio';
  }
  if (m === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (
    m.startsWith('text/') ||
    m === 'application/json' ||
    m === 'application/xml' ||
    m === 'application/javascript' ||
    ['txt', 'md', 'csv', 'json', 'xml', 'html', 'htm', 'css', 'js', 'log'].includes(
      ext,
    )
  ) {
    return 'text';
  }
  return null;
}

export function isBrowserPreviewable(
  mime?: string | null,
  filename = '',
): boolean {
  return mediaPreviewKind(mime, filename) != null;
}

/** Build inner HTML for lightbox stage (src must be a blob: URL). */
export function mediaPreviewStageHtml(
  kind: MediaPreviewKind,
  url: string,
  filename: string,
  escapeHtml: (s: string) => string,
  loadingLabel: string,
): string {
  if (kind === 'image') {
    return `<img class="media-lb-media media-lb-img" src="${url}" alt="${escapeHtml(filename)}" />`;
  }
  if (kind === 'video') {
    return `<video class="media-lb-media media-lb-video" src="${url}" controls playsinline preload="metadata"></video>`;
  }
  if (kind === 'audio') {
    return `<div class="media-lb-audio-wrap"><div class="media-lb-audio-icon" aria-hidden="true">♪</div><audio class="media-lb-media media-lb-audio" src="${url}" controls preload="metadata"></audio></div>`;
  }
  if (kind === 'pdf') {
    return `<iframe class="media-lb-media media-lb-pdf" src="${url}#toolbar=1" title="${escapeHtml(filename)}"></iframe>`;
  }
  return `<div class="media-lb-text-loading muted">${escapeHtml(loadingLabel)}</div>`;
}
