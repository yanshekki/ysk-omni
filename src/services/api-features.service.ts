import { prisma } from '../config/database';
import { SETTING_KEYS } from '../config/constants';
import { ExceptionFactory } from '../exceptions/exception.factory';
import {
  API_FEATURE_PRESETS,
  DEFAULT_API_FEATURES,
  type ApiFeatureKey,
  type ApiFeatures,
} from '../interfaces/api-features.type';

const TTL_MS = 2_000;

function mergeFeatures(raw: unknown): ApiFeatures {
  const base = { ...DEFAULT_API_FEATURES };
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;
  for (const key of Object.keys(base) as ApiFeatureKey[]) {
    if (typeof o[key] === 'boolean') {
      base[key] = o[key] as boolean;
    }
  }
  return base;
}

export class ApiFeaturesService {
  private cache: ApiFeatures = { ...DEFAULT_API_FEATURES };
  private loadedAt = 0;

  async load(): Promise<ApiFeatures> {
    try {
      const row = await prisma.setting.findUnique({
        where: { key: SETTING_KEYS.API_FEATURES },
      });
      if (row?.value) {
        try {
          this.cache = mergeFeatures(JSON.parse(row.value));
        } catch {
          this.cache = { ...DEFAULT_API_FEATURES };
        }
      } else {
        this.cache = { ...DEFAULT_API_FEATURES };
      }
    } catch {
      this.cache = { ...DEFAULT_API_FEATURES };
    }
    this.loadedAt = Date.now();
    return this.cache;
  }

  async get(): Promise<ApiFeatures> {
    if (Date.now() - this.loadedAt > TTL_MS) {
      return this.load();
    }
    return this.cache;
  }

  getSync(): ApiFeatures {
    return this.cache;
  }

  async update(partial: Partial<ApiFeatures>): Promise<ApiFeatures> {
    const next = mergeFeatures({ ...(await this.get()), ...partial });
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.API_FEATURES },
      create: {
        key: SETTING_KEYS.API_FEATURES,
        value: JSON.stringify(next),
      },
      update: { value: JSON.stringify(next) },
    });
    this.cache = next;
    this.loadedAt = Date.now();
    return next;
  }

  async applyPreset(name: 'open' | 'locked' | 'dev'): Promise<ApiFeatures> {
    const preset = API_FEATURE_PRESETS[name];
    if (!preset) {
      throw ExceptionFactory.validation(`Unknown preset: ${name}`);
    }
    return this.update({ ...DEFAULT_API_FEATURES, ...preset });
  }

  /** Throw 403 if protocol/capability is disabled. */
  async assertEnabled(
    key: ApiFeatureKey,
    message?: string,
  ): Promise<ApiFeatures> {
    const f = await this.get();
    if (!f[key]) {
      throw ExceptionFactory.forbidden(
        message ||
          `API feature "${key}" is disabled by admin (Admin → API features or gctoac api features)`,
      );
    }
    return f;
  }

  async assertAnyProtocol(
    which: 'openaiChat' | 'openaiResponses' | 'anthropicMessages',
  ): Promise<ApiFeatures> {
    return this.assertEnabled(
      which,
      `${which} endpoint is disabled. Enable it in Admin → API features.`,
    );
  }
}

export const apiFeaturesService = new ApiFeaturesService();
