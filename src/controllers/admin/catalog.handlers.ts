import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import path from 'node:path';
import os from 'node:os';
import { loadCuratedPacks } from '../../catalog/curated';
import { loadRegistry, findEntry } from '../../services/hf/registry';
import { pullModel } from '../../services/hf/client';
import { recordPullIfOk } from '../../services/hf/record-pull';
import { vramScheduler } from '../../services/vram-scheduler';
import { engineManager } from '../../services/runtimes/engine-manager';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { ECHO_MODEL_ID } from '../../services/runtimes/echo';

export const adminCatalogHandlers = {
  catalog: asyncHandler(async (_req: Request, res: Response) => {
    const packs = loadCuratedPacks();
    const local = loadRegistry().models;
    const snap = vramScheduler.snapshot();
    res.status(200).json({
      packs,
      local,
      echo: ECHO_MODEL_ID,
      loaded: engineManager.list(),
      usedMb: snap.usedMb,
      budgetMb: snap.budgetMb,
    });
  }),

  pull: asyncHandler(async (req: Request, res: Response) => {
    const model = String((req.body as { model?: string })?.model || '').trim();
    if (!model) throw ExceptionFactory.validation('model is required');
    const home = process.env.OMNI_HOME?.trim()
      ? path.resolve(process.env.OMNI_HOME.trim())
      : path.join(os.homedir(), '.ysk-omni');
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
