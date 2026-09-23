import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import path from 'node:path';
import os from 'node:os';
import { loadCuratedPacks, findCuratedPack } from '../../catalog/curated';
import {
  loadRegistry,
  findEntry,
  makeEntryId,
  upsertEntry,
  type RegistryEntry,
} from '../../services/hf/registry';
import { parseHfSpec } from '../../services/hf/spec';
import { pullModel } from '../../services/hf/client';
import { vramScheduler } from '../../services/vram-scheduler';
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
      loaded: snap.loaded,
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
    const result = await pullModel(model, path.join(home, 'models'));
    const spec = parseHfSpec(model);
    const curated = findCuratedPack(spec.repoId);
    const quant = spec.quant || 'Q4_K_M';
    const entry: RegistryEntry = {
      id: makeEntryId(spec.repoId, quant),
      repoId: spec.repoId,
      filename: result.file || '',
      path: result.path || '',
      quant,
      modality: curated?.modality || 'text',
      runtime: curated?.runtime || (result.path ? 'llamacpp' : 'vllm'),
      vramMb: curated?.vramMb || 0,
      pulledAt: new Date().toISOString(),
      sha256: '',
    };
    upsertEntry(entry, path.join(home, 'registry.json'));
    res.status(200).json({ result, entry });
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
    const plan = vramScheduler.load({ id, vramMb, exclusive });
    if (!plan.accept) {
      throw ExceptionFactory.validation(
        `model ${id} needs ${vramMb} MB and does not fit (budget ${vramScheduler.budgetMb} MB)`,
      );
    }
    res.status(200).json({ ok: true, plan, ...vramScheduler.snapshot() });
  }),

  unloadModel: asyncHandler(async (req: Request, res: Response) => {
    const id = String((req.body as { id?: string })?.id || req.params.id || '').trim();
    if (!id) throw ExceptionFactory.validation('id is required');
    const removed = vramScheduler.unload(id);
    res.status(200).json({ ok: removed, ...vramScheduler.snapshot() });
  }),
};
