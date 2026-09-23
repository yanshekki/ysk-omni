export type LoadedModel = {
  id: string;
  vramMb: number;
  lastUsedAt: number;
  exclusive?: boolean;
};

export type LoadRequest = {
  id: string;
  vramMb: number;
  exclusive?: boolean;
};

export type FitPlan = {
  unload: string[];
  accept: boolean;
  usedMb: number;
};

export function usedVram(loaded: LoadedModel[]): number {
  return loaded.reduce((sum, m) => sum + Math.max(0, m.vramMb), 0);
}

/**
 * Decide which loaded models to unload so `next` fits in `budgetMb`.
 * Video / exclusive jobs unload every other model first.
 * LRU among remaining models when still over budget.
 */
export function planFit(
  loaded: LoadedModel[],
  next: LoadRequest,
  budgetMb: number,
): FitPlan {
  const others = loaded.filter((m) => m.id !== next.id);
  let keep = next.exclusive ? [] : [...others];
  const unload: string[] = next.exclusive ? others.map((m) => m.id) : [];

  const need = Math.max(0, next.vramMb);
  const sortLru = () =>
    keep.sort((a, b) => a.lastUsedAt - b.lastUsedAt);

  sortLru();
  while (usedVram(keep) + need > budgetMb && keep.length) {
    const victim = keep.shift()!;
    unload.push(victim.id);
  }
  const usedMb = usedVram(keep) + need;
  return {
    unload,
    accept: usedMb <= budgetMb,
    usedMb,
  };
}

const DEFAULT_BUDGET = 24_000;

export class VramScheduler {
  private loaded: LoadedModel[] = [];
  budgetMb: number;

  constructor(budgetMb = Number(process.env.OMNI_VRAM_MB) || DEFAULT_BUDGET) {
    this.budgetMb = budgetMb;
  }

  snapshot(): { loaded: LoadedModel[]; usedMb: number; budgetMb: number } {
    return {
      loaded: [...this.loaded],
      usedMb: usedVram(this.loaded),
      budgetMb: this.budgetMb,
    };
  }

  touch(id: string): void {
    const hit = this.loaded.find((m) => m.id === id);
    if (hit) hit.lastUsedAt = Date.now();
  }

  unload(id: string): boolean {
    const before = this.loaded.length;
    this.loaded = this.loaded.filter((m) => m.id !== id);
    return this.loaded.length !== before;
  }

  load(next: LoadRequest): FitPlan {
    const plan = planFit(this.loaded, next, this.budgetMb);
    if (!plan.accept) return plan;
    for (const id of plan.unload) this.unload(id);
    const existing = this.loaded.find((m) => m.id === next.id);
    if (existing) {
      existing.lastUsedAt = Date.now();
      existing.vramMb = next.vramMb;
      existing.exclusive = next.exclusive;
    } else {
      this.loaded.push({
        id: next.id,
        vramMb: next.vramMb,
        lastUsedAt: Date.now(),
        exclusive: next.exclusive,
      });
    }
    return { ...plan, usedMb: usedVram(this.loaded) };
  }
}

export const vramScheduler = new VramScheduler();
