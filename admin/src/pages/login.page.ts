import { appRoot, escapeHtml } from '../lib/dom';
import { t, langSwitchHtml, setLocale } from '../i18n';
import { authService } from '../services/auth.service';
import {
  getState,
  onErr,
  setPage,
  setToken,
  showError,
  patchState,
} from '../state/store';
import { poweredByFooter } from '../components/shell';

export async function renderLoginPage(): Promise<void> {
  const st = getState();
  const cmd = 'gctoac admin otp';
  appRoot().innerHTML = `
    <div class="login-wrap">
      <div class="login-stage">
        <div class="login-card">
          <div class="login-brand">
            <img src="/admin/assets/logo.svg" alt="YSK" width="48" height="48" />
            <h1 class="brand-title">${escapeHtml(t('loginTitle'))}</h1>
          </div>
          ${langSwitchHtml()}
          <div id="flash-error" class="error-box" ${st.error ? '' : 'hidden'}>${escapeHtml(st.error)}</div>
          <label for="login-key">${escapeHtml(t('loginOtpLabel'))}</label>
          <input id="login-key" type="text" inputmode="text" autocomplete="one-time-code" placeholder="ABCD-EFGH" autofocus spellcheck="false" />
          <button class="btn" id="btn-login">${escapeHtml(t('loginBtn'))}</button>
        </div>
        <p class="login-cmd-hint">${escapeHtml(t('loginOtpHint'))}</p>
        <div class="login-cmd">
          <code id="login-cmd-text">${escapeHtml(cmd)}</code>
          <button type="button" class="btn-copy" id="btn-copy-cmd">${escapeHtml(t('loginCopy'))}</button>
        </div>
        <p class="login-cmd-hint">${escapeHtml(t('loginOtpExpiry'))}</p>
      </div>
      ${poweredByFooter()}
    </div>
  `;

  document.querySelectorAll('[data-lang]').forEach((b) => {
    (b as HTMLElement).onclick = () => {
      const lang = (b as HTMLElement).dataset.lang;
      if (lang === 'en' || lang === 'zh-Hant') {
        setLocale(lang);
        renderLoginPage().catch(onErr);
      }
    };
  });

  document.getElementById('btn-copy-cmd')!.onclick = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      const btn = document.getElementById('btn-copy-cmd')!;
      btn.textContent = t('loginCopied');
      setTimeout(() => {
        btn.textContent = t('loginCopy');
      }, 1500);
    } catch {
      /* ignore */
    }
  };

  document.getElementById('btn-login')!.onclick = async () => {
    const code = (
      document.getElementById('login-key') as HTMLInputElement
    ).value.trim();
    if (!code) return showError(t('needOtp'));
    try {
      await authService.loginWithOtp(code);
      await authService.ensureMe();
      patchState({ error: '' });
      setPage('dashboard');
    } catch (e) {
      setToken('');
      showError(e instanceof Error ? e.message : t('loginOtpFail'));
    }
  };

  (
    document.getElementById('login-key') as HTMLInputElement
  ).onkeydown = (e) => {
    if (e.key === 'Enter') document.getElementById('btn-login')!.click();
  };
}
