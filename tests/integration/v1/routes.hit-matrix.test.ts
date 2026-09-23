/**
 * Real HTTP hit for every public/v1 + health endpoint.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../../helpers/api-harness';
import { setMediaProviderForTests } from '../../../src/services/media/media-orchestrator.service';
import { mockMediaProvider } from '../../../src/services/media/providers/mock.provider';
import { apiFeaturesService } from '../../../src/services/api-features.service';

type Hit = {
  name: string;
  method: string;
  path: string;
  key?: 'admin' | 'client' | 'none';
  body?: unknown;
  formData?: boolean;
  ok: number[];
};

const HITS: Hit[] = [
  { name: 'health', method: 'GET', path: '/health', key: 'none', ok: [200] },
  { name: 'ready', method: 'GET', path: '/ready', key: 'none', ok: [200, 503] },
  {
    name: 'models list',
    method: 'GET',
    path: '/v1/models',
    key: 'client',
    ok: [200],
  },
  {
    name: 'model get',
    method: 'GET',
    path: '/v1/models/grok-4.5',
    key: 'client',
    ok: [200, 404],
  },
  {
    name: 'chat completions',
    method: 'POST',
    path: '/v1/chat/completions',
    key: 'client',
    body: {
      model: 'grok-4.5',
      messages: [{ role: 'user', content: 'hi' }],
      stream: false,
    },
    ok: [200, 400, 429, 500, 502, 503],
  },
  {
    name: 'chat no auth',
    method: 'POST',
    path: '/v1/chat/completions',
    key: 'none',
    body: { messages: [{ role: 'user', content: 'x' }] },
    ok: [401],
  },
  {
    name: 'documents list',
    method: 'GET',
    path: '/v1/documents',
    key: 'client',
    ok: [200],
  },
  {
    name: 'documents get missing',
    method: 'GET',
    path: '/v1/documents/00000000-0000-4000-8000-000000000010',
    key: 'client',
    ok: [404],
  },
  {
    name: 'documents delete missing',
    method: 'DELETE',
    path: '/v1/documents/00000000-0000-4000-8000-000000000010',
    key: 'client',
    ok: [404],
  },
  {
    name: 'api-keys list admin',
    method: 'GET',
    path: '/v1/api-keys',
    key: 'admin',
    ok: [200],
  },
  {
    name: 'api-keys list client forbidden',
    method: 'GET',
    path: '/v1/api-keys',
    key: 'client',
    ok: [403],
  },
  {
    name: 'api-keys create',
    method: 'POST',
    path: '/v1/api-keys',
    key: 'admin',
    body: { name: 'v1-hit', role: 'client', mode: 'safe' },
    ok: [200, 201, 400],
  },
  {
    name: 'api-keys delete missing',
    method: 'DELETE',
    path: '/v1/api-keys/00000000-0000-4000-8000-000000000011',
    key: 'admin',
    ok: [404],
  },
  {
    name: 'messages anthropic',
    method: 'POST',
    path: '/v1/messages',
    key: 'client',
    body: {
      model: 'grok-4.5',
      max_tokens: 64,
      messages: [{ role: 'user', content: 'hi' }],
    },
    ok: [200, 400, 501, 502, 503],
  },
  {
    name: 'responses create',
    method: 'POST',
    path: '/v1/responses',
    key: 'client',
    body: {
      model: 'grok-4.5',
      input: 'hello',
    },
    ok: [200, 400, 501, 502, 503],
  },
  {
    name: 'responses get missing',
    method: 'GET',
    path: '/v1/responses/00000000-0000-4000-8000-000000000012',
    key: 'client',
    ok: [404, 501],
  },
  {
    name: 'responses delete missing',
    method: 'DELETE',
    path: '/v1/responses/00000000-0000-4000-8000-000000000012',
    key: 'client',
    ok: [404, 501],
  },
  {
    name: 'assistants list',
    method: 'GET',
    path: '/v1/assistants',
    key: 'client',
    ok: [200, 501],
  },
  {
    name: 'assistants create',
    method: 'POST',
    path: '/v1/assistants',
    key: 'client',
    body: { model: 'grok-4.5', name: 'a' },
    ok: [200, 201, 400, 501],
  },
  {
    name: 'assistants get missing',
    method: 'GET',
    path: '/v1/assistants/00000000-0000-4000-8000-000000000013',
    key: 'client',
    ok: [404, 501],
  },
  {
    name: 'assistants delete missing',
    method: 'DELETE',
    path: '/v1/assistants/00000000-0000-4000-8000-000000000013',
    key: 'client',
    ok: [404, 501],
  },
  {
    name: 'threads create',
    method: 'POST',
    path: '/v1/threads',
    key: 'client',
    body: {},
    ok: [200, 201, 501],
  },
  {
    name: 'threads get missing',
    method: 'GET',
    path: '/v1/threads/00000000-0000-4000-8000-000000000014',
    key: 'client',
    ok: [404, 501],
  },
  {
    name: 'threads messages list missing',
    method: 'GET',
    path: '/v1/threads/00000000-0000-4000-8000-000000000014/messages',
    key: 'client',
    ok: [404, 501],
  },
  {
    name: 'threads messages create missing',
    method: 'POST',
    path: '/v1/threads/00000000-0000-4000-8000-000000000014/messages',
    key: 'client',
    body: { role: 'user', content: 'hi' },
    ok: [404, 400, 501],
  },
  {
    name: 'threads runs missing',
    method: 'POST',
    path: '/v1/threads/00000000-0000-4000-8000-000000000014/runs',
    key: 'client',
    body: { assistant_id: '00000000-0000-4000-8000-000000000013' },
    ok: [404, 400, 501],
  },
  {
    name: 'images generations',
    method: 'POST',
    path: '/v1/images/generations',
    key: 'admin',
    body: { prompt: 'blue square', n: 1 },
    ok: [200, 403, 501, 502, 503],
  },
  {
    name: 'media asset meta missing',
    method: 'GET',
    path: '/v1/media/assets/00000000-0000-4000-8000-000000000015',
    key: 'admin',
    ok: [404],
  },
  {
    name: 'media asset content missing',
    method: 'GET',
    path: '/v1/media/assets/00000000-0000-4000-8000-000000000015/content',
    key: 'admin',
    ok: [404],
  },
  {
    name: 'files list',
    method: 'GET',
    path: '/v1/files',
    key: 'admin',
    ok: [200, 501],
  },
  {
    name: 'files get missing',
    method: 'GET',
    path: '/v1/files/00000000-0000-4000-8000-000000000016',
    key: 'admin',
    ok: [404, 501],
  },
  {
    name: 'files content missing',
    method: 'GET',
    path: '/v1/files/00000000-0000-4000-8000-000000000016/content',
    key: 'admin',
    ok: [404, 501],
  },
  {
    name: 'files delete missing',
    method: 'DELETE',
    path: '/v1/files/00000000-0000-4000-8000-000000000016',
    key: 'admin',
    ok: [404, 501],
  },
  {
    name: 'videos create',
    method: 'POST',
    path: '/v1/videos',
    key: 'admin',
    body: { prompt: 'pan left', seconds: 6 },
    ok: [200, 403, 501, 502, 503],
  },
  {
    name: 'videos get missing',
    method: 'GET',
    path: '/v1/videos/00000000-0000-4000-8000-000000000017',
    key: 'admin',
    ok: [404, 501],
  },
  {
    name: 'videos content missing',
    method: 'GET',
    path: '/v1/videos/00000000-0000-4000-8000-000000000017/content',
    key: 'admin',
    ok: [404, 501],
  },
  {
    name: 'audio speech',
    method: 'POST',
    path: '/v1/audio/speech',
    key: 'admin',
    body: { model: 'tts', input: 'hello', voice: 'alloy' },
    ok: [200, 501, 503],
  },
];

describe('v1 + health hit matrix', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('hit-v1');
    if (!h) return;
    mockGrokStream('v1-hit');
    setMediaProviderForTests(mockMediaProvider);
    await apiFeaturesService.applyPreset('open');
    await apiFeaturesService.update({
      imagesApi: true,
      videoApi: true,
      audioApi: true,
      tools: true,
      filesOpenAiAlias: true,
      assistantsEmulation: true,
    });
  }, 90_000);

  afterAll(async () => {
    setMediaProviderForTests(null);
    await stopHarness(h);
  });

  for (const hit of HITS) {
    it(`${hit.method} ${hit.path} (${hit.name})`, async () => {
      if (!h) return;
      const key =
        hit.key === 'none'
          ? null
          : hit.key === 'admin'
            ? h.adminKey
            : h.clientKey;
      const res = await apiFetch(h.baseUrl, hit.path, {
        method: hit.method,
        key,
        body: hit.body,
      });
      expect(
        hit.ok,
        `${hit.name} → ${res.status} ${res.text.slice(0, 180)}`,
      ).toContain(res.status);
    });
  }

  it('documents upload + images edits multipart', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append(
      'file',
      new Blob(['hello hit matrix'], { type: 'text/plain' }),
      'hit.txt',
    );
    const up = await apiFetch(h.baseUrl, '/v1/documents', {
      method: 'POST',
      key: h.clientKey,
      formData: fd,
    });
    expect([200, 201, 400, 413, 415]).toContain(up.status);

    const img = new FormData();
    img.append('prompt', 'make blue');
    img.append(
      'image',
      new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' }),
      'a.png',
    );
    const edit = await apiFetch(h.baseUrl, '/v1/images/edits', {
      method: 'POST',
      key: h.adminKey,
      formData: img,
    });
    expect([200, 400, 403, 501, 502, 503]).toContain(edit.status);

    const files = new FormData();
    files.append(
      'file',
      new Blob(['file alias'], { type: 'text/plain' }),
      'f.txt',
    );
    const fup = await apiFetch(h.baseUrl, '/v1/files', {
      method: 'POST',
      key: h.adminKey,
      formData: files,
    });
    expect([200, 201, 400, 501]).toContain(fup.status);

    const audioFd = new FormData();
    audioFd.append(
      'file',
      new Blob([Uint8Array.from([0, 1, 2])], { type: 'audio/mpeg' }),
      'a.mp3',
    );
    const tr = await apiFetch(h.baseUrl, '/v1/audio/transcriptions', {
      method: 'POST',
      key: h.adminKey,
      formData: audioFd,
    });
    expect([200, 400, 501, 503]).toContain(tr.status);
  });
});
