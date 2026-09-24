import { describe, expect, it } from 'vitest';
import { ErrorCodes } from '../../src/exceptions/error-codes';
import { HttpException } from '../../src/exceptions/http.exception';
import {
  assertModelAllowed,
  filterAllowedModels,
  isModelAllowed,
  parseModelList,
  serializeModelList,
} from '../../src/utils/model-allowlist';

describe('model-allowlist', () => {
  it('parses JSON, csv, and lines; drops invalid ids', () => {
    expect(parseModelList('["echo","piper/lessac-high"]')).toEqual([
      'echo',
      'piper/lessac-high',
    ]);
    expect(parseModelList('echo,Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K')).toEqual([
      'echo',
      'Qwen/Qwen2.5-0.5B-Instruct-GGUF:Q2_K',
    ]);
    expect(parseModelList('echo\nnot a model')).toEqual(['echo']);
    expect(parseModelList([])).toEqual([]);
    expect(parseModelList(null)).toEqual([]);
  });

  it('serializes empty as null', () => {
    expect(serializeModelList([])).toBeNull();
    expect(serializeModelList(['echo'])).toBe(JSON.stringify(['echo']));
  });

  it('empty list allows every model', () => {
    expect(isModelAllowed({ allowedModels: [] }, 'echo')).toBe(true);
    expect(isModelAllowed({ allowedModels: null }, 'anything')).toBe(true);
    expect(isModelAllowed({}, 'echo')).toBe(true);
  });

  it('non-empty list requires exact id', () => {
    const key = { allowedModels: ['echo', 'piper/lessac-high'] };
    expect(isModelAllowed(key, 'echo')).toBe(true);
    expect(isModelAllowed(key, 'piper/lessac-high')).toBe(true);
    expect(isModelAllowed(key, 'tts-1')).toBe(false);
    expect(isModelAllowed(key, '')).toBe(false);
    expect(isModelAllowed(key, undefined)).toBe(false);
  });

  it('assertModelAllowed throws 403 model_not_allowed', () => {
    try {
      assertModelAllowed({ allowedModels: ['echo'] }, 'other');
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      const http = err as HttpException;
      expect(http.statusCode).toBe(403);
      expect(http.code).toBe(ErrorCodes.MODEL_NOT_ALLOWED);
    }
  });

  it('filters GET /v1/models intersection', () => {
    const ids = ['loaded-a', 'echo'];
    expect(filterAllowedModels(ids, [])).toEqual(ids);
    expect(filterAllowedModels(ids, ['echo'])).toEqual(['echo']);
    expect(filterAllowedModels(ids, ['missing'])).toEqual([]);
  });
});
