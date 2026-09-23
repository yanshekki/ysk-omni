import { beforeEach, describe, expect, it } from 'vitest';
import { installBrowserShim } from '../../helpers/browser-shim';
import {
  EXPECTED_ERROR_CODES,
  EXPECTED_FEATURE_FLAGS,
  fingerprintFeature,
  formatApiError,
} from '../../../../admin/src/lib/api-error';
import { hasT, setLocale, t } from '../../../../admin/src/i18n';

installBrowserShim();

describe('formatApiError + fingerprintFeature', () => {
  beforeEach(() => {
    setLocale('en');
  });

  it('maps feature_disabled + details.feature videoApi', () => {
    const msg = formatApiError(
      {
        error: {
          code: 'feature_disabled',
          message: 'Feature is disabled: videoApi',
          details: { feature: 'videoApi' },
        },
      },
      'Not Implemented',
      t,
      hasT,
    );
    expect(msg.toLowerCase()).toContain('video');
    expect(msg).not.toBe('errors.feature.videoApi');
  });

  it('maps legacy English videoApi message when details missing', () => {
    const msg = formatApiError(
      {
        error: {
          code: 'media_not_supported',
          message: 'Video API is disabled (Admin → API features → videoApi)',
        },
      },
      '',
      t,
      hasT,
    );
    expect(msg).toBe(t('errors.feature.videoApi'));
  });

  it('localizes zh-Hant feature videoApi', () => {
    setLocale('zh-Hant');
    const msg = formatApiError(
      {
        error: {
          code: 'feature_disabled',
          details: { feature: 'videoApi' },
          message: 'x',
        },
      },
      '',
      t,
      hasT,
    );
    expect(msg).toContain('停用');
    expect(msg).toContain('Videos API');
  });

  it('maps media_forbidden and reason codes', () => {
    setLocale('en');
    expect(
      formatApiError(
        {
          error: {
            code: 'media_forbidden',
            message: 'nope',
            details: { reason: 'agent_or_admin_required' },
          },
        },
        '',
        t,
        hasT,
      ),
    ).toBe(t('errors.media.agent_or_admin_required'));
  });

  it('fingerprintFeature detects flags', () => {
    expect(fingerprintFeature('Video API is disabled')).toBe('videoApi');
    expect(fingerprintFeature('Images API is disabled')).toBe('imagesApi');
    expect(fingerprintFeature('Tools are disabled; image gen')).toBe('tools');
  });
});

describe('errors i18n registry completeness', () => {
  it('every expected error code has en + zh keys', () => {
    for (const code of EXPECTED_ERROR_CODES) {
      setLocale('en');
      expect(hasT(`errors.${code}`), `en errors.${code}`).toBe(true);
      setLocale('zh-Hant');
      expect(hasT(`errors.${code}`), `zh errors.${code}`).toBe(true);
    }
  });

  it('every expected feature flag has en + zh keys', () => {
    for (const f of EXPECTED_FEATURE_FLAGS) {
      setLocale('en');
      expect(hasT(`errors.feature.${f}`), `en feature.${f}`).toBe(true);
      setLocale('zh-Hant');
      expect(hasT(`errors.feature.${f}`), `zh feature.${f}`).toBe(true);
    }
  });
});
