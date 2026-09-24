import fs from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';

describe('admin catalog + Hub search', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('cathub');
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('GET /admin/ and /admin/index.html replace the asset token', async () => {
    if (!h) return;
    for (const path of ['/admin/', '/admin/index.html'] as const) {
      const res = await fetch(`${h.baseUrl}${path}`);
      expect(res.status, path).toBe(200);
      const html = await res.text();
      expect(html, path).not.toContain('__ADMIN_ASSET_V__');
      expect(html, path).toMatch(/\/admin\/boot\.js\?v=[0-9]+/);
    }
  });

  it('GET /admin/api/runtimes lists engines by host OS', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/admin/api/runtimes', {
      key: h.adminKey,
    });
    expect(res.status).toBe(200);
    const body = res.json as {
      host?: { os?: string };
      items?: Array<{ id: string; install?: Record<string, string> }>;
    };
    expect(['darwin', 'linux', 'win32']).toContain(body.host?.os);
    expect((body.items || []).some((i) => i.id === 'llamacpp')).toBe(true);
    expect((body.items || [])[0]?.install?.linux).toBeTruthy();
    expect(body.items?.some((i) => i.id === 'llamacpp' && 'installable' in i)).toBe(
      true,
    );
  });

  it('POST /admin/api/runtimes/install validates id', async () => {
    if (!h) return;
    const missing = await apiFetch(h.baseUrl, '/admin/api/runtimes/install', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect(missing.status).toBe(400);
    const unknown = await apiFetch(h.baseUrl, '/admin/api/runtimes/install', {
      method: 'POST',
      key: h.adminKey,
      body: { id: 'not-a-runtime' },
    });
    expect(unknown.status).toBe(400);
    const manual = await apiFetch(h.baseUrl, '/admin/api/runtimes/install', {
      method: 'POST',
      key: h.adminKey,
      body: { id: 'comfy' },
    });
    expect(manual.status).toBe(400);
  });

  it('POST /admin/api/runtimes/uninstall validates id', async () => {
    if (!h) return;
    const missing = await apiFetch(h.baseUrl, '/admin/api/runtimes/uninstall', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect(missing.status).toBe(400);
    const manual = await apiFetch(h.baseUrl, '/admin/api/runtimes/uninstall', {
      method: 'POST',
      key: h.adminKey,
      body: { id: 'comfy' },
    });
    expect(manual.status).toBe(400);
  });

  it('GET /admin/api/catalog returns curated packs', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/admin/api/catalog', {
      key: h.adminKey,
    });
    expect(res.status).toBe(200);
    const body = res.json as { packs?: Array<{ id: string }> };
    expect(Array.isArray(body.packs)).toBe(true);
    expect(body.packs?.some((p) => p.id.includes('Qwen'))).toBe(true);
  });

  it('GET /admin/api/catalog/hub searches Hugging Face REST', async () => {
    if (!h) return;
    const res = await apiFetch(
      h.baseUrl,
      '/admin/api/catalog/hub?q=qwen2.5&modality=text&limit=3',
      { key: h.adminKey },
    );
    expect([200, 502]).toContain(res.status);
    if (res.status !== 200) return;
    const body = res.json as { hits?: Array<{ id: string }>; source?: string };
    expect(body.source).toContain('huggingface.co/api/models');
    expect(Array.isArray(body.hits)).toBe(true);
  });

  it('POST load/unload validate id', async () => {
    if (!h) return;
    const load = await apiFetch(h.baseUrl, '/admin/api/models/load', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect(load.status).toBe(400);
    const unload = await apiFetch(h.baseUrl, '/admin/api/models/unload', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect(unload.status).toBe(400);
  });

  it('POST /admin/api/catalog/sync lists top GGUF without downloading weights', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/admin/api/catalog/sync', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect([200, 502]).toContain(res.status);
    if (res.status !== 200) return;
    const body = res.json as { hits?: Array<{ id: string }>; count?: number };
    expect(Array.isArray(body.hits)).toBe(true);
    expect((body.hits || []).length).toBeGreaterThan(0);
    expect((body.hits || []).length).toBeLessThanOrEqual(50);
    const listed = await apiFetch(h.baseUrl, '/admin/api/catalog', {
      key: h.adminKey,
    });
    const cat = listed.json as { popular?: Array<{ id: string }> };
    expect((cat.popular || []).length).toBe((body.hits || []).length);
    const home = process.env.OMNI_HOME || '';
    const modelsDir = home ? `${home}/models` : '';
    if (modelsDir && fs.existsSync(modelsDir)) {
      const ggufs = fs.readdirSync(modelsDir).filter((f) => f.endsWith('.gguf'));
      expect(ggufs).toEqual([]);
    }
  });

  it('POST /admin/api/catalog/rm requires id', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/admin/api/catalog/rm', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect(res.status).toBe(400);
  });

  it('POST /admin/api/catalog/pull requires model', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/admin/api/catalog/pull', {
      method: 'POST',
      key: h.adminKey,
      body: {},
    });
    expect(res.status).toBe(400);
  });
});
