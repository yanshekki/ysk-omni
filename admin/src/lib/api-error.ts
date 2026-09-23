/**
 * Map OpenAI-style API error envelope → localized Admin message.
 * Shared by modular http client and (eventually) full SPA.
 */

export type TranslateFn = (path: string) => string;
export type HasTranslateFn = (path: string) => boolean;

export type ApiErrorEnvelope = {
  error?: {
    message?: string;
    code?: string;
    details?: {
      feature?: string;
      flag?: string;
      reason?: string;
      [k: string]: unknown;
    };
  };
  message?: string;
};

export function fingerprintFeature(msg: string): string {
  const m = String(msg || '');
  if (/videoApi/i.test(m) || /Video API is disabled/i.test(m)) return 'videoApi';
  if (/imagesApi/i.test(m) || /Images API is disabled/i.test(m)) return 'imagesApi';
  if (/audioApi/i.test(m) || /Audio API is disabled/i.test(m)) return 'audioApi';
  if (/filesOpenAiAlias/i.test(m) || /Files API alias/i.test(m))
    return 'filesOpenAiAlias';
  if (
    /Tools are disabled/i.test(m) ||
    (/\btools\b/i.test(m) && /disabled/i.test(m) && /image/i.test(m))
  ) {
    return 'tools';
  }
  return '';
}

/**
 * @param data parsed JSON body
 * @param statusText HTTP statusText fallback
 * @param t i18n t()
 * @param hasT returns true when key exists
 */
export function formatApiError(
  data: unknown,
  statusText: string | undefined,
  t: TranslateFn,
  hasT: HasTranslateFn,
): string {
  const root = (data && typeof data === 'object' ? data : {}) as ApiErrorEnvelope;
  const err =
    root.error && typeof root.error === 'object'
      ? root.error
      : (root as { message?: string; code?: string; details?: ApiErrorEnvelope['error'] extends infer E ? E : never });
  const code = typeof err.code === 'string' ? err.code : '';
  const details =
    err.details && typeof err.details === 'object' ? err.details : {};
  const feature =
    typeof details.feature === 'string'
      ? details.feature
      : typeof details.flag === 'string'
        ? details.flag
        : '';
  const reason = typeof details.reason === 'string' ? details.reason : '';
  const rawMsg = String(
    err.message || root.message || statusText || '',
  );

  if (
    feature &&
    (code === 'feature_disabled' ||
      code === 'media_not_supported' ||
      code === 'forbidden')
  ) {
    const key = `errors.feature.${feature}`;
    if (hasT(key)) return t(key);
  }
  if (code === 'feature_disabled') {
    const fp = fingerprintFeature(rawMsg);
    if (fp && hasT(`errors.feature.${fp}`)) return t(`errors.feature.${fp}`);
    if (hasT('errors.feature_disabled')) return t('errors.feature_disabled');
  }

  if (reason && hasT(`errors.media.${reason}`)) {
    return t(`errors.media.${reason}`);
  }
  if (code === 'media_generation_failed' && reason && hasT(`errors.media.${reason}`)) {
    return t(`errors.media.${reason}`);
  }
  if (code === 'media_forbidden' && hasT('errors.media_forbidden')) {
    return t('errors.media_forbidden');
  }

  // Legacy English bodies often use media_not_supported without details.feature
  const fpEarly = fingerprintFeature(rawMsg);
  if (fpEarly && hasT(`errors.feature.${fpEarly}`)) {
    return t(`errors.feature.${fpEarly}`);
  }

  if (code) {
    const key = `errors.${code}`;
    if (hasT(key)) return t(key);
  }

  const fp = fingerprintFeature(rawMsg);
  if (fp && hasT(`errors.feature.${fp}`)) return t(`errors.feature.${fp}`);
  if (/agent-mode|agent mode|Safe keys cannot/i.test(rawMsg)) {
    if (hasT('errors.media.agent_or_admin_required')) {
      return t('errors.media.agent_or_admin_required');
    }
  }
  if (/no image file was found/i.test(rawMsg) && hasT('errors.media.no_image_in_sandbox')) {
    return t('errors.media.no_image_in_sandbox');
  }
  if (/no video file was found/i.test(rawMsg) && hasT('errors.media.no_video_in_sandbox')) {
    return t('errors.media.no_video_in_sandbox');
  }
  if (/does not support image edits/i.test(rawMsg) && hasT('errors.media.provider_no_edit')) {
    return t('errors.media.provider_no_edit');
  }
  if (
    /Provide an image file|sourceAssetId|sourceDocumentId/i.test(rawMsg) &&
    hasT('errors.media.source_required')
  ) {
    return t('errors.media.source_required');
  }
  if (/must be an image/i.test(rawMsg) && hasT('errors.media.source_must_be_image')) {
    return t('errors.media.source_must_be_image');
  }

  return rawMsg || t('common.requestFailed');
}

/** ErrorCodes that must have errors.<code> i18n (mirror backend). */
export const EXPECTED_ERROR_CODES = [
  'unauthorized',
  'forbidden',
  'not_found',
  'validation_error',
  'rate_limit_exceeded',
  'concurrency_limit_exceeded',
  'internal_error',
  'grok_error',
  'grok_timeout',
  'grok_not_available',
  'document_too_large',
  'document_type_not_allowed',
  'invalid_cwd',
  'service_unavailable',
  'queue_full',
  'queue_draining',
  'queue_wait_timeout',
  'queue_cancelled',
  'media_not_supported',
  'media_provider_unavailable',
  'media_generation_failed',
  'media_forbidden',
  'feature_disabled',
] as const;

export const EXPECTED_FEATURE_FLAGS = [
  'imagesApi',
  'videoApi',
  'audioApi',
  'tools',
  'filesOpenAiAlias',
] as const;
