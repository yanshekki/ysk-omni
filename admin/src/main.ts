/**
 * Admin SPA entry — boot order mirrors backend request pipeline:
 * state → auth ensure → route → page render
 */
import { appRoot, escapeHtml } from './lib/dom';
import { authService } from './services/auth.service';
import {
  getState,
  onErr,
  readHashPage,
  setPage,
  writeHash,
  patchState,
  subscribe,
} from './state/store';
import { bindShell, shell } from './components/shell';
import { renderPage } from './router';

let rendering = false;
let queued = false;

export async function render(): Promise<void> {
  if (rendering) {
    queued = true;
    return;
  }
  rendering = true;
  const ctx = { rerender: () => void render().catch(onErr) };
  try {
    do {
      queued = false;
      const st = getState();
      if (!st.key) {
        await renderPage('login', ctx);
        continue;
      }
      try {
        await authService.ensureMe();
      } catch (e) {
        onErr(e);
        continue;
      }
      const page = st.page === 'login' ? 'dashboard' : st.page;
      await renderPage(page, ctx);
    } while (queued);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    appRoot().innerHTML = shell(
      `<div class="error-box">${escapeHtml(msg)}</div>`,
    );
    bindShell(ctx.rerender);
  } finally {
    rendering = false;
    if (queued) {
      queued = false;
      void render().catch(onErr);
    }
  }
}

export function startAdminApp(): void {
  // Hash routing: refresh keeps page
  const fromHash = readHashPage();
  if (fromHash && fromHash !== 'login') {
    patchState({ page: fromHash });
  } else if (getState().key) {
    writeHash(getState().page);
  }

  window.addEventListener('hashchange', () => {
    const p = readHashPage();
    if (p && p !== getState().page) {
      setPage(p);
    }
  });

  // setPage / logout notify → re-render
  subscribe(() => {
    void render().catch(onErr);
  });

  void render().catch(onErr);
}
