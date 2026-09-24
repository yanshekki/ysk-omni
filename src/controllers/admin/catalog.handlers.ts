import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import path from 'node:path';
import { omniHome } from '../../config/omni-home';
import { loadCuratedPacks } from '../../catalog/curated';
import { loadRegistry, findEntry } from '../../services/hf/registry';
import { deleteLocalModel } from '../../services/hf/delete-local';
import { pullModel } from '../../services/hf/client';
import { recordPullIfOk } from '../../services/hf/record-pull';
import { vramScheduler } from '../../services/vram-scheduler';
import { engineManager } from '../../services/runtimes/engine-manager';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { ECHO_MODEL_ID } from '../../services/runtimes/echo';
import {
  loadPopularCache,
  searchHub,
  syncPopularGguf,
} from '../../services/hf/hub-search';

export const adminCatalogHandlers = {
  catalog: asyncHandler(async (_req: Request, res: Response) => {
    const packs = loadCuratedPacks();
    const local = loadRegistry().models;
    const snap = vramScheduler.snapshot();
    const popular = loadPopularCache();
    res.status(200).json({
      packs,
      local,
      echo: ECHO_MODEL_ID,
      loaded: engineManager.list(),
      usedMb: snap.usedMb,
      budgetMb: snap.budgetMb,
      popular: popular?.hits || [],
      popularSyncedAt: popular?.syncedAt || null,
    });
  }),

  sync: asyncHandler(async (_req: Request, res: Response) => {
    try {
      const cache = await syncPopularGguf();
      res.status(200).json({
        ok: true,
        count: cache.hits.length,
        syncedAt: cache.syncedAt,
        hits: cache.hits,
        source: cache.source,
      });
    } catch (err) {
      res.status(502).json({
        error: {
          code: 'hub_unavailable',
          message:
            err instanceof Error ? err.message : 'Hugging Face Hub sync failed',
        },
      });
    }
  }),

  hub: asyncHandler(async (req: Request, res: Response) => {
    const q = String(req.query.q || '').trim();
    const modality = String(req.query.modality || '').trim();
    const cursor = String(req.query.cursor || '').trim();
    const limit = Number(req.query.limit);
    try {
      const data = await searchHub({ q, modality, cursor, limit });
      res.status(200).json(data);
    } catch (err) {
      res.status(502).json({
        error: {
          code: 'hub_unavailable',
          message:
            err instanceof Error ? err.message : 'Hugging Face Hub search failed',
        },
      });
    }
  }),

  pull: asyncHandler(async (req: Request, res: Response) => {
    const model = String((req.body as { model?: string })?.model || '').trim();
    if (!model) throw ExceptionFactory.validation('model is required');
    const home = omniHome();
    res.status(200);
    res.setHeader('Content-Type', 'application/x-ndjson');
    const destDir = path.join(home, 'models');
    const write = (obj: unknown) => {
      res.write(`${JSON.stringify(obj)}\n`);
    };
    const result = await pullModel(model, destDir, (p) => write(p));
    const entry = recordPullIfOk(model, result, path.join(home, 'registry.json'));
    write({ status: result.status, entry, reason: result.reason });
    res.end();
  }),

  loadModel: asyncHandler(async (req: Request, res: Response) => {
    const id = String((req.body as { id?: string })?.id || '').trim();
    if (!id) throw ExceptionFactory.validation('id is required');
    const exclusive = Boolean((req.body as { exclusive?: boolean })?.exclusive);
    const entry = findEntry(id);
    const vramMb =
      Number((req.body as { vramMb?: number })?.vramMb) ||
      entry?.vramMb ||
      (id === ECHO_MODEL_ID ? 0 : 4096);
    if (exclusive) await engineManager.unloadAll();
    if (id === ECHO_MODEL_ID) {
      const plan = vramScheduler.load({ id, vramMb: 0, exclusive });
      res.status(200).json({ ok: true, plan, ...vramScheduler.snapshot(), loaded: engineManager.list() });
      return;
    }
    if (!entry) {
      throw ExceptionFactory.notFound('Model');
    }
    const patched = { ...entry, vramMb: vramMb || entry.vramMb };
    const isGguf = Boolean(entry.path?.toLowerCase().endsWith('.gguf'));
    const eng =
      isGguf || entry.runtime === 'llamacpp'
        ? await engineManager.loadGguf(patched)
        : await engineManager.loadVllm(patched);
    res.status(200).json({
      ok: true,
      engine: { id: eng.id, port: eng.port, kind: eng.kind },
      ...vramScheduler.snapshot(),
      loaded: engineManager.list(),
    });
  }),

  removeLocal: asyncHandler(async (req: Request, res: Response) => {
    const id = String((req.body as { id?: string })?.id || '').trim();
    if (!id) throw ExceptionFactory.validation('id is required');
    try {
      const out = await deleteLocalModel(id);
      res.status(200).json({
        ok: true,
        ...out,
        ...vramScheduler.snapshot(),
        loaded: engineManager.list(),
        local: loadRegistry().models,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.startsWith('not found')) throw ExceptionFactory.notFound('Model');
      throw err;
    }
  }),

  unloadModel: asyncHandler(async (req: Request, res: Response) => {
    const id = String((req.body as { id?: string })?.id || req.params.id || '').trim();
    if (!id) throw ExceptionFactory.validation('id is required');
    const removed = await engineManager.unload(id);
    res.status(200).json({
      ok: removed,
      ...vramScheduler.snapshot(),
      loaded: engineManager.list(),
    });
  }),
};
