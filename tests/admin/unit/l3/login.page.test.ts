/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { renderLoginPage } from '../../helpers/render-harness';
import { fixtures } from '../../helpers/fixtures';
import { allFetchUrls } from '../../helpers/mock-fetch';

installBrowserShim();

describe('L3 login.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('submits OTP to POST /auth/login', async () => {
    const { app, fetchMock } = await renderLoginPage({
      routes: [
        {
          match: '/admin/api/auth/login',
          method: 'POST',
          body: fixtures.authLogin(),
        },
        { match: '/admin/api/me', body: fixtures.me() },
      ],
    });
    const input = app.querySelector('#login-key') as HTMLInputElement;
    const btn = app.querySelector('#btn-login') as HTMLButtonElement;
    expect(input && btn).toBeTruthy();
    input.value = 'ABCD-EFGH';
    btn.click();
    // allow async handler
    await new Promise((r) => setTimeout(r, 80));
    const urls = allFetchUrls(fetchMock);
    expect(
      urls.some((u) => u.includes('/auth/login')),
      `urls=${urls.join(',')}`,
    ).toBe(true);
  });
});
