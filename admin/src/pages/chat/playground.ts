/**
 * Chat playground — ported from public/admin/app.js (A2).
 * Layer: pages/chat (uses services via deps.adminApi).
 * @ts-nocheck
 */
// @ts-nocheck
import {
  t,
  tf,
  getLocale,
  escapeHtml,
  fmtTime,
  fmtBytes,
  showError,
  uiConfirm,
  openAppModal,
  closeAppModal,
  shell,
  bindShell,
  adminApi,
  getToken,
  getMe,
  getKeys,
  setKeys,
  getModels,
  setModels,
  getPage,
  appRoot,
  CHAT_ALLOWED_EXTENSIONS,
  CHAT_FILE_ACCEPT,
  formatChatMarkdown,
  copyTextToClipboard,
} from './deps';

// Compatibility shims for legacy code shape
const state = {
  get key() { return getToken(); },
  get me() { return getMe(); },
  get keys() { return getKeys(); },
  set keys(v) { setKeys(v); },
  get models() { return getModels(); },
  set models(v) { setModels(v); },
  get page() { return getPage(); },
};

async function api(path, options = {}) {
  return adminApi(path, options);
}

async function loadModels(refresh = false) {
  try {
    const res = await api(`/models${refresh ? '?refresh=1' : ''}`);
    const raw = res.data?.models || res.models || [];
    // Normalize to string ids for <select>
    state.models = (raw || []).map((m) =>
      typeof m === 'string' ? m : m?.id || m?.name || String(m),
    );
    return res.data || res;
  } catch {
    state.models = [];
    return { models: [], source: 'fallback', defaultModel: '' };
  }
}

async function loadKeys() {
  try {
    const res = await api('/keys?all=1');
    state.keys = res.data || [];
  } catch {
    state.keys = [];
  }
}

let _ctx = null;

/** In-thread messages (UI + save) — was above chatPendingDocs in app.js */
let chatMessages = [];
/** AbortController for active stream */
let chatAbort = null;

let chatPendingDocs = [];
/** True while LLM compress is in flight */
let chatCompressing = false;
/** How many older messages are folded (render window) */
let chatRenderSkip = 0;
/** @type {Map<string, string>} */
const chatMdCache = new Map();

/** UI prefs preserved across re-renders */
const chatUi = {
  /** selected API key id; empty = signed-in admin key */
  keyId: '',
  model: '',
  reasoning: true,
  /** optional system prompt (sent every turn, not stored in chat history bubbles) */
  systemPrompt: '',
  systemOpen: false,
};

/**
 * Context policy for API turns — does NOT rewrite chatMessages.
 * @type {{ mode: 'full'|'summary'|'recent', recentN: number, summary: string, summaryAt: string|null, summarySourceCount: number }}
 */
const chatContext = {
  mode: 'full',
  recentN: 6,
  summary: '',
  summaryAt: null,
  summarySourceCount: 0,
};

const CHAT_COMPRESS_MIN_MSGS = 3;
const CHAT_RENDER_WINDOW = 40;
const CHAT_RENDER_STEP = 20;
const CHAT_CONTENT_COLLAPSE = 2200;

/** Persisted multi-turn conversation session (playground) */
const chatSession = {
  conversationId: null,
  historyPage: 0,
  historyLimit: 20,
  historyQ: '',
  historyTotal: 0,
  historyItems: [],
  historyLoading: false,
  historyOpenMobile: false,
  saving: false,
  saveQueued: false,
  /** conversation id currently editing title inline */
  renamingId: null,
};
/** @type {ReturnType<typeof setTimeout> | null} */
let chatHistorySearchTimer = null;

const CHAT_MAX_DOCS = 10;

/** UUID v1–v8 (loose) — match backend z.string().uuid() */
const DOC_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function chatFileExt(name) {
  const base = String(name || '').split(/[/\\]/).pop() || '';
  const i = base.lastIndexOf('.');
  if (i < 0) return '';
  return base.slice(i).toLowerCase();
}

function isChatAllowedFilename(name) {
  return CHAT_ALLOWED_EXTENSIONS.has(chatFileExt(name));
}

function chatFormatsShort() {
  return t('chat.formatsHint');
}

function resetChatContext() {
  chatContext.mode = 'full';
  chatContext.recentN = 6;
  chatContext.summary = '';
  chatContext.summaryAt = null;
  chatContext.summarySourceCount = 0;
  chatRenderSkip = 0;
  chatMdCache.clear();
}

function conversationDisplayTitle(item) {
  const title = (item?.title || '').trim();
  if (title) return title;
  const preview = (item?.preview || '').trim();
  if (preview) return preview;
  return t('chat.untitled');
}

function messagesForSave() {
  return chatMessages
    .filter((m) => !m.streaming)
    .map((m) => {
      /** @type {{ role: string, content: string, reasoning?: string, docs?: {id:string,name:string}[], error?: boolean }} */
      const out = {
        role: m.role,
        content: m.content || '',
      };
      if (m.reasoning) out.reasoning = m.reasoning;
      if (m.docs && m.docs.length) out.docs = m.docs;
      if (m.error) out.error = true;
      return out;
    });
}

function contextPayloadForSave() {
  return {
    contextMode: chatContext.mode,
    contextRecentN: chatContext.recentN,
    summaryText: chatContext.summary || '',
    summaryAt: chatContext.summaryAt,
    summarySourceCount: chatContext.summarySourceCount || 0,
  };
}

function applyContextFromApi(data) {
  if (!data) return;
  chatContext.mode =
    data.contextMode === 'summary' || data.contextMode === 'recent'
      ? data.contextMode
      : 'full';
  chatContext.recentN = Math.min(
    40,
    Math.max(2, Number(data.contextRecentN) || 6),
  );
  chatContext.summary = (data.summaryText || '').trim();
  chatContext.summaryAt = data.summaryAt || null;
  chatContext.summarySourceCount = Number(data.summarySourceCount) || 0;
  if (chatContext.mode === 'summary' && !chatContext.summary) {
    chatContext.mode = 'full';
  }
}

function chatMessageChars(msgs) {
  return msgs.reduce(
    (n, m) => n + (m.content || '').length + (m.reasoning || '').length,
    0,
  );
}

function chatCompressEligible() {
  const ready = chatMessages.filter((m) => !m.streaming);
  if (ready.length < 2) return false;
  if (ready.length >= CHAT_COMPRESS_MIN_MSGS) return true;
  return chatMessageChars(ready) >= 800;
}

/**
 * Build messages array for playground API based on context policy.
 * Full history stays in chatMessages / UI.
 */
function buildApiMessages() {
  const systemBase = (chatUi.systemPrompt || '').trim();
  const ready = chatMessages.filter((m) => !m.streaming);
  const n = Math.min(
    40,
    Math.max(2, Number(chatContext.recentN) || 6),
  );

  /** @type {{ role: string, content: string }[]} */
  let slice = ready.map((m) => ({
    role: m.role,
    content: m.content || '',
  }));

  let system = systemBase;

  if (chatContext.mode === 'summary' && chatContext.summary) {
    const summaryBlock =
      (getLocale() === 'zh-Hant'
        ? '【先前對話摘要 — 僅供延續語境，完整記錄仍在用戶介面】\n'
        : '[Prior conversation summary — full history remains in the UI]\n') +
      chatContext.summary;
    system = system
      ? `${system}\n\n${summaryBlock}`
      : summaryBlock;
    // Prefer messages after summary was made; else last N
    const after = ready.slice(chatContext.summarySourceCount || 0);
    const tailSrc = after.length ? after : ready.slice(-n);
    slice = tailSrc.slice(-n).map((m) => ({
      role: m.role,
      content: m.content || '',
    }));
  } else if (chatContext.mode === 'recent') {
    slice = ready.slice(-n).map((m) => ({
      role: m.role,
      content: m.content || '',
    }));
  }

  /** @type {{ role: string, content: string }[]} */
  const api = slice.map((m) => ({ role: m.role, content: m.content }));
  if (system) api.unshift({ role: 'system', content: system });
  return api;
}

function contextModeLabel() {
  if (chatContext.mode === 'summary' && chatContext.summary) {
    return tf('chat.ctxModeSummaryLabel', { n: chatContext.recentN });
  }
  if (chatContext.mode === 'recent') {
    return tf('chat.ctxModeRecentLabel', { n: chatContext.recentN });
  }
  return t('chat.ctxModeFullLabel');
}

function updateChatCompressButton() {
  const btn = document.getElementById('chat-compress');
  if (!btn) return;
  const streaming = chatMessages.some((m) => m.streaming);
  const busy = Boolean(chatAbort) || chatCompressing || streaming;
  const ok = chatCompressEligible();
  btn.disabled = busy || !ok;
  btn.textContent = chatCompressing ? t('chat.compressing') : t('chat.compress');
  btn.title = !ok ? t('chat.compressNeedMore') : t('chat.compress');
  paintContextBanner();
  syncContextControls();
}

function syncContextControls() {
  const modeEl = document.getElementById('chat-ctx-mode');
  const nEl = document.getElementById('chat-ctx-n');
  if (modeEl) {
    const m =
      chatContext.mode === 'summary' && !chatContext.summary
        ? 'full'
        : chatContext.mode;
    modeEl.value = m;
    // disable summary option if no summary
    const optSum = modeEl.querySelector('option[value="summary"]');
    if (optSum) optSum.disabled = !chatContext.summary;
  }
  if (nEl) {
    nEl.value = String(chatContext.recentN);
    nEl.disabled = chatContext.mode === 'full';
  }
}

function paintContextBanner() {
  const host = document.getElementById('chat-compress-banner');
  if (!host) return;
  const hasSummary = Boolean(chatContext.summary);
  const longThread =
    chatMessages.filter((m) => !m.streaming).length > 40 ||
    chatMessageChars(chatMessages) > 60000;

  if (!hasSummary && chatContext.mode === 'full' && !longThread) {
    host.hidden = true;
    host.innerHTML = '';
    return;
  }

  host.hidden = false;
  const preview = hasSummary
    ? chatContext.summary.length > 160
      ? `${chatContext.summary.slice(0, 159)}…`
      : chatContext.summary
    : '';
  const warn = longThread
    ? `<p class="chat-compress-warn">${escapeHtml(t('chat.ctxLongHint'))}</p>`
    : '';

  host.innerHTML = `
    <div class="chat-compress-banner-inner">
      <div class="chat-compress-banner-text">
        <strong>${escapeHtml(t('chat.ctxPolicyTitle'))}</strong>
        <span class="muted">${escapeHtml(contextModeLabel())}</span>
        <p class="chat-compress-remark">${escapeHtml(t('chat.ctxRemark'))}</p>
        ${preview ? `<p class="chat-compress-preview">${escapeHtml(preview)}</p>` : ''}
        ${warn}
      </div>
      <div class="chat-compress-banner-actions">
        ${
          hasSummary
            ? `<button type="button" class="btn secondary sm" id="chat-summary-view">${escapeHtml(t('chat.compressView'))}</button>`
            : ''
        }
      </div>
    </div>`;
  document.getElementById('chat-summary-view')?.addEventListener('click', () => {
    openSummaryPopup();
  });
}

async function openSummaryPopup() {
  if (!chatContext.summary) {
    showError(t('chat.compressNeedSummary'));
    return;
  }
  const when = chatContext.summaryAt
    ? fmtTime(chatContext.summaryAt)
    : '—';
  const bodyHtml = formatChatMarkdown(chatContext.summary);
  openAppModal({
    title: t('chat.compressResultTitle'),
    subtitle: escapeHtml(
      tf('chat.summaryMeta', { when, n: chatContext.summarySourceCount }),
    ),
    size: 'lg',
    bodyHtml: `<div class="chat-content md">${bodyHtml}</div>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="ui-dialog-copy">${escapeHtml(t('chat.copy'))}</button>
      <button type="button" class="btn sm" id="ui-dialog-ok">${escapeHtml(t('common.ok'))}</button>`,
  });
  document.getElementById('ui-dialog-ok')?.addEventListener('click', () => {
    closeAppModal();
  });
  document
    .getElementById('ui-dialog-copy')
    ?.addEventListener('click', async () => {
      const ok = await copyTextToClipboard(chatContext.summary);
      const b = document.getElementById('ui-dialog-copy');
      if (ok && b) {
        b.textContent = t('chat.copied');
        setTimeout(() => {
          if (b.isConnected) b.textContent = t('chat.copy');
        }, 1500);
      }
    });
}

function buildCompressTranscript(msgs) {
  return msgs
    .map((m) => {
      const role = m.role || 'user';
      let body = (m.content || '').trim();
      if (m.docs && m.docs.length) {
        const names = m.docs.map((d) => d.name).join(', ');
        body = body
          ? `${body}\n[attachments: ${names}]`
          : `[attachments: ${names}]`;
      }
      if (body.length > 5000) body = `${body.slice(0, 4999)}…`;
      return `${role}: ${body}`;
    })
    .join('\n\n');
}

function compressSystemPrompt() {
  if (getLocale() === 'zh-Hant') {
    return [
      '你是對話摘要助手。只輸出精簡摘要，不要使用任何工具、不要上網、不要反問。',
      '若已有舊摘要，請合併更新為一份。',
      '請用繁體中文（或對齊原對話語言）條列：',
      '1) 主題與目標 2) 已確定事實／決定 3) 未完成事項 4) 用戶偏好或約束',
      '控制在約 600–1000 字。不要大段複製原文。只輸出摘要正文。',
    ].join('\n');
  }
  return [
    'You are a conversation summary assistant. Output only a concise summary.',
    'Merge any prior summary into one updated summary. No tools, no browsing, no questions.',
    'Cover: (1) topics/goals (2) facts/decisions (3) open items (4) preferences.',
    'Keep under ~600–1000 words. Summary body only.',
  ].join('\n');
}

/**
 * Generate summary for context policy — never mutates chatMessages.
 */
async function compressChatHistory() {
  if (chatCompressing || chatAbort || chatMessages.some((m) => m.streaming)) {
    showError(t('chat.compressBusy'));
    return;
  }
  const ready = chatMessages.filter((m) => !m.streaming);
  if (!chatCompressEligible()) {
    showError(t('chat.compressNeedMore'));
    return;
  }
  if (
    !(await uiConfirm({
      title: t('chat.compress'),
      message: t('chat.compressConfirm'),
      variant: 'confirm',
      confirmText: t('chat.compress'),
    }))
  )
    return;

  const auth = playgroundAuthKey();
  if (!auth) {
    showError(t('chat.needKey'));
    return;
  }

  captureChatUi();
  chatCompressing = true;
  updateChatCompressButton();
  const sendBtn = document.getElementById('chat-send');
  if (sendBtn) sendBtn.disabled = true;
  const st = document.getElementById('chat-stream-status');
  if (st) {
    st.hidden = false;
    st.textContent = t('chat.compressing');
  }

  try {
    // Include previous summary in input so re-compress merges
    let transcript = buildCompressTranscript(ready);
    if (chatContext.summary) {
      transcript =
        (getLocale() === 'zh-Hant'
          ? `先前摘要：\n${chatContext.summary}\n\n完整對話：\n`
          : `Prior summary:\n${chatContext.summary}\n\nFull conversation:\n`) +
        transcript;
    }

    const model =
      document.getElementById('chat-model')?.value ||
      chatUi.model ||
      'grok-4.6';
    const asKeyId = playgroundKeyId();
    const body = {
      model,
      stream: false,
      include_reasoning: false,
      messages: [
        { role: 'system', content: compressSystemPrompt() },
        {
          role: 'user',
          content:
            (getLocale() === 'zh-Hant'
              ? '請為以下對話產生摘要（僅供之後回合作為語境，不會刪除用戶介面中的記錄）：\n\n'
              : 'Summarize the following conversation (for later context only; UI history is kept):\n\n') +
            transcript,
        },
      ],
    };
    const realKeyId = playgroundRealApiKeyId();
    if (realKeyId) body.apiKeyId = realKeyId;

    const res = await fetch('/admin/api/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      let msg = errText;
      try {
        const j = JSON.parse(errText);
        msg = j.error?.message || errText;
      } catch {
        /* */
      }
      throw new Error(msg || t('chat.compressFail'));
    }
    const json = await res.json();
    let summary =
      json?.choices?.[0]?.message?.content ||
      json?.choices?.[0]?.delta?.content ||
      '';
    if (typeof summary !== 'string') summary = String(summary || '');
    summary = summary
      .trim()
      .replace(/^【對話摘要】\s*/u, '')
      .replace(/^\[Conversation summary\]\s*/i, '');
    if (!summary) throw new Error(t('chat.compressFail'));

    chatContext.summary = summary;
    chatContext.summaryAt = new Date().toISOString();
    chatContext.summarySourceCount = ready.length;
    chatContext.mode = 'summary';
    // history untouched
    paintContextBanner();
    syncContextControls();
    showError('');
    if (st) {
      st.hidden = false;
      st.textContent = t('chat.compressOk');
      setTimeout(() => {
        const s2 = document.getElementById('chat-stream-status');
        if (s2 && s2.textContent === t('chat.compressOk')) {
          s2.hidden = true;
          s2.textContent = '';
        }
      }, 2800);
    }
    await saveConversation().catch(() => {});
    await openSummaryPopup();
  } catch (e) {
    showError(e.message || t('chat.compressFail'));
  } finally {
    chatCompressing = false;
    updateChatCompressButton();
    if (sendBtn) sendBtn.disabled = false;
    if (st && st.textContent === t('chat.compressing')) {
      st.hidden = true;
      st.textContent = '';
    }
  }
}

function setChatHistoryMobileOpen(open) {
  chatSession.historyOpenMobile = Boolean(open);
  document.body.classList.toggle('chat-history-open', chatSession.historyOpenMobile);
}

function closeChatHistoryMobile() {
  setChatHistoryMobileOpen(false);
}

async function loadConversationList() {
  if (!state.key) return;
  chatSession.historyLoading = true;
  paintChatHistoryList();
  try {
    const offset = chatSession.historyPage * chatSession.historyLimit;
    const params = new URLSearchParams({
      limit: String(chatSession.historyLimit),
      offset: String(offset),
    });
    if (chatSession.historyQ.trim()) {
      params.set('q', chatSession.historyQ.trim());
    }
    const res = await api(`/conversations?${params}`);
    chatSession.historyItems = res.data || [];
    chatSession.historyTotal = res.total ?? 0;
  } catch (e) {
    chatSession.historyItems = [];
    chatSession.historyTotal = 0;
    // soft fail — rail stays usable
    console.warn(e);
  } finally {
    chatSession.historyLoading = false;
    paintChatHistoryList();
  }
}

function paintChatHistoryList() {
  const list = document.getElementById('chat-history-list');
  const pager = document.getElementById('chat-history-pager');
  if (!list) return;

  if (chatSession.historyLoading && !chatSession.historyItems.length) {
    list.innerHTML = `<li class="chat-history-empty">${escapeHtml(t('common.loading'))}</li>`;
  } else if (!chatSession.historyItems.length) {
    list.innerHTML = `<li class="chat-history-empty">${escapeHtml(t('chat.historyEmpty'))}</li>`;
  } else {
    list.innerHTML = chatSession.historyItems
      .map((item) => {
        const active =
          chatSession.conversationId === item.id ? ' is-active' : '';
        const title = conversationDisplayTitle(item);
        const preview =
          item.title && item.preview && item.preview !== item.title
            ? item.preview
            : item.model || tf('chat.msgs', { n: item.messageCount || 0 });
        const isRenaming = chatSession.renamingId === item.id;
        // Prefill with what the user currently sees (custom title or preview/untitled)
        const editValue = title;
        const bodyInner = isRenaming
          ? `<input type="text" class="chat-history-title-input" data-title-input="${escapeHtml(item.id)}" value="${escapeHtml(editValue)}" maxlength="120" placeholder="${escapeHtml(t('chat.renamePh'))}" aria-label="${escapeHtml(t('chat.renamePh'))}" />
            <span class="preview">${escapeHtml(preview || '—')}</span>
            <span class="meta"><span>${escapeHtml(fmtTime(item.updatedAt))}</span></span>`
          : `<span class="title" data-title-label="${escapeHtml(item.id)}" title="${escapeHtml(t('chat.rename'))}">${escapeHtml(title)}</span>
            <span class="preview">${escapeHtml(preview || '—')}</span>
            <span class="meta"><span>${escapeHtml(fmtTime(item.updatedAt))}</span></span>`;
        // Never put <input> inside <button> — invalid HTML
        const main = isRenaming
          ? `<div class="chat-history-item${active} is-editing" data-conv-body="${escapeHtml(item.id)}">${bodyInner}</div>`
          : `<div class="chat-history-item${active}" data-open-conv="${escapeHtml(item.id)}" role="button" tabindex="0" title="${escapeHtml(title)}">${bodyInner}</div>`;
        return `
        <li class="chat-history-row${active}${isRenaming ? ' is-renaming' : ''}" data-conv-row="${escapeHtml(item.id)}">
          ${main}
          <div class="chat-history-item-actions">
            <button type="button" class="icon-action" data-rename-conv="${escapeHtml(item.id)}" title="${escapeHtml(t('chat.rename'))}" aria-label="${escapeHtml(t('chat.rename'))}">✎</button>
            <button type="button" class="icon-action danger" data-del-conv="${escapeHtml(item.id)}" title="${escapeHtml(t('chat.deleteConversation'))}" aria-label="${escapeHtml(t('chat.deleteConversation'))}">×</button>
          </div>
        </li>`;
      })
      .join('');
  }

  if (pager) {
    const limit = chatSession.historyLimit;
    const totalPages = Math.max(1, Math.ceil(chatSession.historyTotal / limit) || 1);
    const page = Math.min(chatSession.historyPage + 1, totalPages);
    const pageLabel = tf('chat.historyPage', { n: page, total: totalPages });
    const canPrev = chatSession.historyPage > 0;
    const canNext =
      (chatSession.historyPage + 1) * limit < chatSession.historyTotal;
    pager.innerHTML = `
      <button type="button" class="btn secondary sm" id="chat-hist-prev" ${canPrev ? '' : 'disabled'}>${escapeHtml(t('chat.historyPrev'))}</button>
      <span>${escapeHtml(pageLabel)}</span>
      <button type="button" class="btn secondary sm" id="chat-hist-next" ${canNext ? '' : 'disabled'}>${escapeHtml(t('chat.historyNext'))}</button>
    `;
    const prev = document.getElementById('chat-hist-prev');
    const next = document.getElementById('chat-hist-next');
    if (prev) {
      prev.onclick = () => {
        if (chatSession.historyPage > 0) {
          chatSession.historyPage -= 1;
          loadConversationList();
        }
      };
    }
    if (next) {
      next.onclick = () => {
        if ((chatSession.historyPage + 1) * limit < chatSession.historyTotal) {
          chatSession.historyPage += 1;
          loadConversationList();
        }
      };
    }
  }

  // Single-click open (delayed) vs double-click rename — avoid open wiping the row mid-dblclick
  list.querySelectorAll('[data-open-conv]').forEach((el) => {
    const id = el.getAttribute('data-open-conv');
    if (!id) return;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let openTimer = null;
    const clearOpen = () => {
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
    };
    el.addEventListener('click', (e) => {
      if (chatSession.renamingId) return;
      // ignore clicks that originated on action buttons (they stopPropagation too)
      if (e.target instanceof Element && e.target.closest('.chat-history-item-actions')) {
        return;
      }
      clearOpen();
      openTimer = setTimeout(() => {
        openTimer = null;
        if (chatSession.renamingId) return;
        openConversation(id);
      }, 280);
    });
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearOpen();
      startInlineRename(id);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!chatSession.renamingId) openConversation(id);
      }
    });
  });
  // Title label: also start rename on dblclick (same as row)
  list.querySelectorAll('[data-title-label]').forEach((el) => {
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-title-label');
      if (id) startInlineRename(id);
    });
  });
  list.querySelectorAll('[data-rename-conv]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-rename-conv');
      if (id) startInlineRename(id);
    });
  });
  list.querySelectorAll('[data-del-conv]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-del-conv');
      if (id) deleteConversation(id);
    });
  });

  // Focus title input if we just entered rename mode
  if (chatSession.renamingId) {
    const rid = String(chatSession.renamingId).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const input = list.querySelector(`[data-title-input="${rid}"]`);
    if (input instanceof HTMLInputElement) {
      bindTitleInput(input, chatSession.renamingId);
      // rAF so layout is ready before select()
      requestAnimationFrame(() => {
        if (!input.isConnected) return;
        input.focus();
        input.select();
      });
    }
  }
}

/**
 * Begin inline title edit at the history list title position (no window.prompt).
 * @param {string} id
 */
function startInlineRename(id) {
  if (!id) return;
  // Cancel any other rename
  if (chatSession.renamingId && chatSession.renamingId !== id) {
    chatSession.renamingId = null;
  }
  chatSession.renamingId = id;
  paintChatHistoryList();
}

/**
 * @param {HTMLInputElement} input
 * @param {string} id
 */
function bindTitleInput(input, id) {
  let finished = false;
  const finish = async (save) => {
    if (finished) return;
    finished = true;
    const raw = input.value;
    chatSession.renamingId = null;
    if (!save) {
      paintChatHistoryList();
      return;
    }
    const title = String(raw ?? '')
      .trim()
      .slice(0, 120);
    const item = chatSession.historyItems.find((x) => x.id === id);
    const prevStored = item ? (item.title || '').trim() : '';
    // Skip only when unchanged vs stored custom title
    // (if stored empty, saving the displayed text pins it as custom title)
    if (title === prevStored) {
      paintChatHistoryList();
      return;
    }
    // Optimistic UI
    if (item) item.title = title;
    paintChatHistoryList();
    try {
      await api(`/conversations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
      await loadConversationList();
    } catch (e) {
      showError(e.message || t('chat.saveFail'));
      await loadConversationList();
    }
  };

  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      finish(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finish(false);
    }
  });
  input.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  input.addEventListener('mousedown', (e) => e.stopPropagation());
  input.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  input.addEventListener('blur', () => {
    setTimeout(() => finish(true), 0);
  });
}

async function renameConversation(id) {
  // Back-compat alias
  startInlineRename(id);
}

async function openConversation(id) {
  if (!id || chatAbort) {
    if (chatAbort) chatAbort.abort();
  }
  try {
    showError('');
    const res = await api(`/conversations/${id}`);
    const data = res.data || res;
    chatSession.conversationId = data.id;
    chatRenderSkip = 0;
    chatMdCache.clear();
    chatMessages = (data.messages || [])
      .filter((m) => !m.compressed)
      .map((m) => ({
        role: m.role,
        content: m.content || '',
        reasoning: m.reasoning || undefined,
        docs: m.docs,
        error: m.error,
      }));
    chatPendingDocs = [];
    chatUi.systemPrompt = data.systemPrompt || '';
    applyContextFromApi(data);
    if (data.model) chatUi.model = data.model;
    if (data.apiKeyId) {
      chatUi.keyId = data.apiKeyId;
    }
    // sync form controls if present
    const sysEl = document.getElementById('chat-system');
    if (sysEl) sysEl.value = chatUi.systemPrompt;
    const wrap = document.getElementById('chat-system-wrap');
    if (wrap) wrap.hidden = !chatUi.systemPrompt.trim() && !chatUi.systemOpen;
    const modelEl = document.getElementById('chat-model');
    if (modelEl && data.model) modelEl.value = data.model;
    const keyEl = document.getElementById('chat-key-select');
    if (keyEl && data.apiKeyId) {
      const has = [...keyEl.options].some((o) => o.value === data.apiKeyId);
      if (has) {
        keyEl.value = data.apiKeyId;
        chatUi.keyId = data.apiKeyId;
      }
    }
    renderChatBubbles();
    renderChatPending();
    paintChatHistoryList();
    paintContextBanner();
    syncContextControls();
    closeChatHistoryMobile();
  } catch (e) {
    showError(e.message || t('chat.loadFail'));
  }
}

/** Real API key UUID only — never send OTP session synthetic ids to validators. */
function playgroundRealApiKeyId() {
  const id = playgroundKeyId();
  if (!id) return null;
  if (String(id).startsWith('admin-session:')) return null;
  // basic uuid shape
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    return null;
  }
  return id;
}

async function saveConversation() {
  const messages = messagesForSave();
  if (!messages.length && !chatContext.summary) return;
  if (chatSession.saving) {
    chatSession.saveQueued = true;
    return;
  }
  chatSession.saving = true;
  chatSession.saveQueued = false;
  captureChatUi();
  const body = {
    messages,
    model: chatUi.model || null,
    systemPrompt: chatUi.systemPrompt || '',
    apiKeyId: playgroundRealApiKeyId(),
    ...contextPayloadForSave(),
  };
  try {
    if (chatSession.conversationId) {
      await api(`/conversations/${chatSession.conversationId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    } else {
      if (!messages.length) return;
      const res = await api('/conversations', {
        method: 'POST',
        body: JSON.stringify({ ...body, title: '' }),
      });
      const data = res.data || res;
      chatSession.conversationId = data.id;
    }
    await loadConversationList();
  } catch (e) {
    console.warn(e);
    // non-blocking — keep chat usable
  } finally {
    chatSession.saving = false;
    if (chatSession.saveQueued) {
      chatSession.saveQueued = false;
      saveConversation().catch(() => {});
    }
  }
}

async function deleteConversation(id) {
  if (
    !(await uiConfirm({
      title: t('chat.deleteConversation'),
      message: t('chat.deleteConfirm'),
      variant: 'danger',
      confirmText: t('chat.deleteConversation'),
    }))
  )
    return;
  try {
    await api(`/conversations/${id}`, { method: 'DELETE' });
    if (chatSession.conversationId === id) {
      chatSession.conversationId = null;
      chatMessages = [];
      chatPendingDocs = [];
      resetChatContext();
      renderChatBubbles();
      renderChatPending();
      paintContextBanner();
      syncContextControls();
    }
    // if page emptied, go back a page
    if (
      chatSession.historyItems.length <= 1 &&
      chatSession.historyPage > 0
    ) {
      chatSession.historyPage -= 1;
    }
    await loadConversationList();
  } catch (e) {
    showError(e.message || t('common.requestFailed'));
  }
}

function resetChatThread(keepSystem = true) {
  if (chatAbort) chatAbort.abort();
  chatMessages = [];
  chatPendingDocs = [];
  chatSession.conversationId = null;
  resetChatContext();
  if (!keepSystem) {
    chatUi.systemPrompt = '';
    chatUi.systemOpen = false;
  }
  renderChatBubbles();
  renderChatPending();
  paintChatHistoryList();
  paintContextBanner();
  syncContextControls();
}

/** Signed-in admin bearer (always used for Admin API). */
function playgroundAuthKey() {
  return state.key;
}

/** Selected key id for acting as (session me.id when empty). */
function playgroundKeyId() {
  const el = document.getElementById('chat-key-select');
  const v = el?.value || chatUi.keyId || '';
  if (v && v !== 'session') return v;
  return state.me?.id || '';
}

function captureChatUi() {
  const keyEl = document.getElementById('chat-key-select');
  const modelEl = document.getElementById('chat-model');
  const reasonEl = document.getElementById('chat-reasoning');
  const sysEl = document.getElementById('chat-system');
  if (keyEl) chatUi.keyId = keyEl.value === 'session' ? '' : keyEl.value;
  if (modelEl) chatUi.model = modelEl.value;
  if (reasonEl) chatUi.reasoning = reasonEl.checked;
  if (sysEl) chatUi.systemPrompt = sysEl.value;
}

function renderChatPending() {
  const wrap = document.getElementById('chat-pending');
  if (!wrap) return;
  if (!chatPendingDocs.length) {
    wrap.innerHTML = '';
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  wrap.innerHTML = chatPendingDocs
    .map(
      (d, i) => `
      <div class="chat-pending-item" title="${escapeHtml(d.name)}">
        <span class="name">${escapeHtml(d.name)}</span>
        <span class="muted">${fmtBytes(d.size)}</span>
        <button type="button" class="rm" data-rm-doc="${i}" aria-label="${escapeHtml(t('chat.removeFile'))}">×</button>
      </div>`,
    )
    .join('');
  wrap.querySelectorAll('[data-rm-doc]').forEach((btn) => {
    btn.onclick = () => {
      const idx = Number(btn.getAttribute('data-rm-doc'));
      chatPendingDocs.splice(idx, 1);
      renderChatPending();
    };
  });
}

function mdCacheKey(idx, content) {
  return `${idx}:${(content || '').length}:${(content || '').slice(0, 40)}`;
}

function renderChatBubbles() {
  const box = document.getElementById('chat-messages');
  if (!box) return;
  const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
  const streaming = chatMessages.some((m) => m.streaming);

  // Live status under composer
  const st = document.getElementById('chat-stream-status');
  if (st) {
    st.hidden = !streaming;
    st.textContent = streaming ? t('chat.streaming') : '';
  }

  if (!chatMessages.length) {
    box.innerHTML = `
      <div class="chat-empty">
        <strong>${escapeHtml(t('chat.emptyTitle'))}</strong>
        <p>${escapeHtml(t('chat.emptyHint'))}</p>
      </div>`;
    updateChatCompressButton();
    return;
  }

  // Render window: only last N + skip (load more expands)
  const total = chatMessages.length;
  const maxSkip = Math.max(0, total - CHAT_RENDER_WINDOW);
  if (chatRenderSkip > maxSkip) chatRenderSkip = maxSkip;
  const start = chatRenderSkip;
  const visible = chatMessages.slice(start);
  const hiddenCount = start;

  const foldBar =
    hiddenCount > 0
      ? `<div class="chat-load-older">
          <button type="button" class="btn secondary sm" id="chat-load-older">${escapeHtml(tf('chat.loadOlder', { n: hiddenCount }))}</button>
        </div>`
      : '';

  box.innerHTML =
    foldBar +
    visible
      .map((m, visIdx) => {
        const idx = start + visIdx;
        const role = m.role === 'user' ? 'user' : 'assistant';
        const roleLabel =
          m.role === 'user' ? t('chat.you') : t('chat.assistant');
        const docs =
          m.docs && m.docs.length
            ? `<div class="chat-attach-list">${m.docs
                .map(
                  (d) =>
                    `<span class="chat-attach-chip" title="${escapeHtml(d.name)}"><span>📎 ${escapeHtml(d.name)}</span></span>`,
                )
                .join('')}</div>`
            : '';
        const showReasoningBlock = Boolean(m.reasoning);
        const reasoning = showReasoningBlock
          ? `<details class="chat-reasoning" ${m.streaming || !m.content ? 'open' : ''}>
            <summary>${escapeHtml(t('chat.reasoning'))}${m.streaming && !m.content ? ` · ${escapeHtml(t('chat.streaming'))}` : ''}</summary>
            <pre>${escapeHtml(m.reasoning)}</pre>
          </details>`
          : '';
        let bodyText = m.content || '';
        if (!bodyText && m.streaming) {
          bodyText = m.reasoning ? '' : '…';
        }
        const errCls = m.error ? ' error' : '';
        const streamCls = m.streaming ? ' is-streaming' : '';
        // Streaming: plain text only (fast). Done assistant: MD with cache.
        const useMd =
          role === 'assistant' && !m.streaming && Boolean(bodyText);
        let bodyHtml;
        if (useMd) {
          const ck = mdCacheKey(idx, bodyText);
          if (chatMdCache.has(ck)) {
            bodyHtml = chatMdCache.get(ck);
          } else {
            bodyHtml = formatChatMarkdown(bodyText);
            chatMdCache.set(ck, bodyHtml);
            if (chatMdCache.size > 200) {
              const first = chatMdCache.keys().next().value;
              chatMdCache.delete(first);
            }
          }
        } else {
          bodyHtml = escapeHtml(bodyText);
        }
        const long =
          !m.streaming && bodyText.length > CHAT_CONTENT_COLLAPSE;
        const contentCls = `${useMd ? 'chat-content md' : 'chat-content'}${long ? ' is-collapsible' : ''}`;
        const moreBtn = long
          ? `<button type="button" class="btn ghost sm chat-expand-btn" data-expand="${idx}">${escapeHtml(t('chat.showMore'))}</button>`
          : '';
        const copyBtn =
          bodyText
            ? `<button type="button" class="chat-copy-btn" data-copy-msg="${idx}" title="${escapeHtml(t('chat.copy'))}">${escapeHtml(t('chat.copy'))}</button>`
            : '';
        return `<div class="chat-bubble ${role}${errCls}${streamCls}" data-msg-idx="${idx}">
        <div class="chat-bubble-head">
          <div class="chat-role">${escapeHtml(roleLabel)}${m.streaming ? ` <span class="chat-live">${escapeHtml(t('chat.streaming'))}</span>` : ''}</div>
          ${copyBtn}
        </div>
        ${docs}
        ${reasoning}
        <div class="${contentCls}" data-content-idx="${idx}">${bodyHtml}${m.streaming ? '<span class="chat-cursor">▍</span>' : ''}</div>
        ${moreBtn}
      </div>`;
      })
      .join('');

  if (nearBottom || streaming) {
    box.scrollTop = box.scrollHeight;
  }
  updateChatCompressButton();

  document.getElementById('chat-load-older')?.addEventListener('click', () => {
    const prevH = box.scrollHeight;
    chatRenderSkip = Math.max(0, chatRenderSkip - CHAT_RENDER_STEP);
    renderChatBubbles();
    const box2 = document.getElementById('chat-messages');
    if (box2) box2.scrollTop = box2.scrollHeight - prevH;
  });

  box.querySelectorAll('[data-expand]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = box.querySelector(
        `[data-content-idx="${btn.getAttribute('data-expand')}"]`,
      );
      if (el) {
        el.classList.toggle('is-expanded');
        btn.textContent = el.classList.contains('is-expanded')
          ? t('chat.showLess')
          : t('chat.showMore');
      }
    });
  });

  box.querySelectorAll('[data-copy-msg]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const i = Number(btn.getAttribute('data-copy-msg'));
      const msg = chatMessages[i];
      if (!msg?.content) return;
      const ok = await copyTextToClipboard(msg.content);
      if (ok) {
        const prev = btn.textContent;
        btn.textContent = t('chat.copied');
        btn.classList.add('is-copied');
        setTimeout(() => {
          if (btn.isConnected) {
            btn.textContent = prev || t('chat.copy');
            btn.classList.remove('is-copied');
          }
        }, 1600);
      } else {
        showError(t('chat.copyFail'));
      }
    });
  });
}

/** Parse one SSE buffer chunk into { events, rest } */
function parseSseBuffer(buffer) {
  // Normalize CRLF
  const normalized = buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const parts = normalized.split('\n');
  const rest = parts.pop() || '';
  const events = [];
  for (const line of parts) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(':')) continue; // comment / keepalive
    if (!trimmed.startsWith('data:')) continue;
    const data = trimmed.slice(5).trim();
    if (!data) continue;
    events.push(data);
  }
  return { events, rest };
}

function applyStreamDelta(assistant, json) {
  if (!json || typeof json !== 'object') return false;
  // Error payload from our server mid-stream
  if (json.error) {
    const msg = json.error.message || json.error.code || t('common.requestFailed');
    assistant.error = true;
    assistant.content = (assistant.content || '') + `\n✗ ${msg}`;
    return true;
  }
  const delta = json.choices?.[0]?.delta || {};
  let changed = false;
  if (delta.reasoning_content) {
    assistant.reasoning = (assistant.reasoning || '') + delta.reasoning_content;
    changed = true;
  }
  if (delta.thought && !delta.reasoning_content) {
    // avoid double-append when both aliases sent
    assistant.reasoning = (assistant.reasoning || '') + delta.thought;
    changed = true;
  } else if (delta.thought && delta.reasoning_content && delta.thought !== delta.reasoning_content) {
    assistant.reasoning = (assistant.reasoning || '') + delta.thought;
    changed = true;
  }
  if (typeof delta.content === 'string' && delta.content.length) {
    assistant.content = (assistant.content || '') + delta.content;
    changed = true;
  }
  // Non-stream style full message (fallback)
  const msg = json.choices?.[0]?.message;
  if (msg) {
    if (msg.content && !assistant.content) {
      assistant.content = msg.content;
      changed = true;
    }
    if (msg.reasoning_content && !assistant.reasoning) {
      assistant.reasoning = msg.reasoning_content;
      changed = true;
    }
  }
  return changed;
}

/**
 * Upload one file with progress via XHR (fetch has no upload progress).
 * @param {File} file
 * @param {(p: { loaded: number, total: number, percent: number }) => void} [onProgress]
 */
function uploadChatFile(file, onProgress) {
  const auth = playgroundAuthKey();
  if (!auth) return Promise.reject(new Error(t('chat.needKey')));

  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const asId = playgroundRealApiKeyId();
    if (asId) fd.append('apiKeyId', asId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/api/documents');
    xhr.setRequestHeader('Authorization', `Bearer ${auth}`);

    xhr.upload.onprogress = (ev) => {
      if (!onProgress) return;
      if (ev.lengthComputable && ev.total > 0) {
        const percent = Math.min(100, Math.round((ev.loaded / ev.total) * 100));
        onProgress({ loaded: ev.loaded, total: ev.total, percent });
      } else {
        onProgress({ loaded: ev.loaded || 0, total: 0, percent: -1 });
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = null;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        const msg =
          data?.error?.message ||
          data?.message ||
          xhr.responseText ||
          xhr.statusText;
        reject(new Error(msg || t('chat.uploadFail')));
        return;
      }
      const doc = data?.data || data;
      const id = doc?.id;
      if (!id || typeof id !== 'string') {
        reject(new Error(t('chat.uploadFail')));
        return;
      }
      resolve({
        id,
        name: doc.originalName || doc.filename || file.name,
        mime: doc.mimeType || file.type || '',
        size: doc.sizeBytes ?? doc.size ?? file.size ?? 0,
      });
    };
    xhr.onerror = () => reject(new Error(t('chat.uploadFail')));
    xhr.onabort = () => reject(new Error(t('chat.uploadFail')));
    xhr.send(fd);
  });
}

function setChatUploadProgress(opts) {
  const wrap = document.getElementById('chat-upload-progress');
  if (!wrap) return;
  const { visible, fileName, fileIndex, fileTotal, percent, indeterminate } =
    opts;
  if (!visible) {
    wrap.hidden = true;
    wrap.setAttribute('aria-hidden', 'true');
    return;
  }
  wrap.hidden = false;
  wrap.setAttribute('aria-hidden', 'false');
  const label = document.getElementById('chat-upload-label');
  const bar = document.getElementById('chat-upload-bar');
  const pctEl = document.getElementById('chat-upload-pct');
  const name = fileName || '';
  const idx = fileIndex || 1;
  const tot = fileTotal || 1;
  if (label) {
    label.textContent =
      tot > 1
        ? tf('chat.uploadProgressMulti', { name, i: idx, n: tot })
        : tf('chat.uploadProgress', { name });
  }
  const ind = Boolean(indeterminate) || percent < 0;
  if (bar) {
    bar.classList.toggle('is-indeterminate', ind);
    if (!ind) {
      bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    } else {
      bar.style.width = '40%';
    }
  }
  if (pctEl) {
    pctEl.textContent = ind
      ? t('chat.uploading')
      : tf('common.percent', { n: Math.max(0, Math.min(100, percent)) });
  }
}

/**
 * Add already-uploaded documents to the pending chips (no re-upload).
 * @param {Array<{ id: string, name?: string, originalName?: string, mime?: string, mimeType?: string, size?: number, sizeBytes?: number }>} docs
 */
function addChatExistingDocs(docs) {
  const list = Array.isArray(docs) ? docs : [];
  if (!list.length) return { added: 0, skipped: 0 };
  let added = 0;
  let skipped = 0;
  const pendingIds = new Set(chatPendingDocs.map((d) => d.id));
  for (const raw of list) {
    if (chatPendingDocs.length >= CHAT_MAX_DOCS) {
      skipped += list.length - added - skipped;
      break;
    }
    const id = raw?.id;
    const name = raw?.name || raw?.originalName || '';
    if (!id || !DOC_ID_RE.test(String(id))) {
      skipped += 1;
      continue;
    }
    if (!isChatAllowedFilename(name)) {
      skipped += 1;
      continue;
    }
    if (pendingIds.has(id)) {
      skipped += 1;
      continue;
    }
    chatPendingDocs.push({
      id,
      name: name || id,
      mime: raw.mime || raw.mimeType || '',
      size: raw.size ?? raw.sizeBytes ?? 0,
    });
    pendingIds.add(id);
    added += 1;
  }
  renderChatPending();
  return { added, skipped };
}

async function openChatLibraryPicker() {
  if (!playgroundAuthKey()) {
    showError(t('chat.needKey'));
    return;
  }
  // Library list filters by real key only (session → omit = all admin-visible docs)
  const asKeyId = playgroundRealApiKeyId();
  const room = Math.max(0, CHAT_MAX_DOCS - chatPendingDocs.length);
  if (room <= 0) {
    showError(t('chat.tooManyFiles'));
    return;
  }

  /** @type {Map<string, any>} */
  const selected = new Map();
  let loadSeq = 0;

  openAppModal({
    title: t('chat.libraryTitle'),
    subtitle: escapeHtml(t('chat.librarySubtitle')),
    size: 'md',
    bodyHtml: `
      <div class="chat-lib">
        <div class="chat-lib-toolbar">
          <input type="search" id="chat-lib-q" class="chat-lib-search" placeholder="${escapeHtml(t('chat.librarySearch'))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="chat-lib-count">${escapeHtml(tf('chat.librarySelected', { n: 0 }))}</span>
        </div>
        <div class="muted chat-lib-formats">${escapeHtml(t('chat.formatsLabel'))}: ${escapeHtml(chatFormatsShort())}</div>
        <div id="chat-lib-list" class="chat-lib-list" role="listbox" aria-multiselectable="true">
          <div class="muted chat-lib-status">${escapeHtml(t('common.loading') || '…')}</div>
        </div>
      </div>`,
    footerHtml: `
      <button type="button" class="btn secondary sm" id="chat-lib-cancel">${escapeHtml(t('common.cancel'))}</button>
      <button type="button" class="btn sm" id="chat-lib-add" disabled>${escapeHtml(t('chat.libraryAdd'))}</button>`,
  });

  const listEl = document.getElementById('chat-lib-list');
  const qEl = document.getElementById('chat-lib-q');
  const countEl = document.getElementById('chat-lib-count');
  const addBtn = document.getElementById('chat-lib-add');
  document.getElementById('chat-lib-cancel')?.addEventListener('click', () => closeAppModal());

  const paintCount = () => {
    if (countEl) countEl.textContent = tf('chat.librarySelected', { n: selected.size });
    if (addBtn) {
      addBtn.disabled = selected.size === 0;
      addBtn.textContent =
        selected.size > 0
          ? `${t('chat.libraryAdd')} (${selected.size})`
          : t('chat.libraryAdd');
    }
  };

  const renderRows = (items) => {
    if (!listEl) return;
    const pendingIds = new Set(chatPendingDocs.map((d) => d.id));
    const allowed = (items || []).filter((d) => isChatAllowedFilename(d.originalName));
    if (!allowed.length) {
      listEl.innerHTML = `<div class="data-empty chat-lib-empty"><strong>${escapeHtml(t('chat.libraryEmpty'))}</strong></div>`;
      return;
    }
    listEl.innerHTML = allowed
      .map((d) => {
        const already = pendingIds.has(d.id);
        const checked = selected.has(d.id);
        const disabled = already && !checked;
        return `
          <label class="chat-lib-row ${already ? 'is-already' : ''} ${checked ? 'is-selected' : ''}" data-id="${escapeHtml(d.id)}">
            <input type="checkbox" data-lib-id="${escapeHtml(d.id)}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${escapeHtml(d.originalName)}">${escapeHtml(d.originalName)}</span>
              <span class="muted">${escapeHtml(d.mimeType || '')} · ${fmtBytes(d.sizeBytes || 0)}${
                already ? ` · ${escapeHtml(t('chat.libraryAlready'))}` : ''
              }</span>
            </span>
          </label>`;
      })
      .join('');

    listEl.querySelectorAll('input[data-lib-id]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const id = inp.getAttribute('data-lib-id');
        const row = allowed.find((x) => x.id === id);
        if (!row) return;
        if (inp.checked) {
          if (selected.size >= room && !selected.has(id)) {
            inp.checked = false;
            showError(t('chat.tooManyFiles'));
            return;
          }
          selected.set(id, row);
        } else {
          selected.delete(id);
        }
        const lab = inp.closest('.chat-lib-row');
        if (lab) lab.classList.toggle('is-selected', inp.checked);
        paintCount();
      });
    });
  };

  const load = async () => {
    const seq = ++loadSeq;
    if (listEl) {
      listEl.innerHTML = `<div class="muted chat-lib-status">${escapeHtml(t('common.loading') || '…')}</div>`;
    }
    try {
      const params = new URLSearchParams({
        limit: '50',
        offset: '0',
      });
      if (asKeyId) params.set('apiKeyId', asKeyId);
      const q = (qEl?.value || '').trim();
      if (q) params.set('q', q);
      const res = await api(`/documents?${params}`);
      if (seq !== loadSeq) return;
      renderRows(res.data || []);
    } catch (e) {
      if (seq !== loadSeq) return;
      if (listEl) {
        listEl.innerHTML = `<div class="error-box">${escapeHtml(e.message || t('chat.libraryLoadFail'))}</div>`;
      }
    }
  };

  let searchTimer = null;
  qEl?.addEventListener('input', () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => load(), 280);
  });

  addBtn?.addEventListener('click', () => {
    const docs = [...selected.values()];
    const { added } = addChatExistingDocs(
      docs.map((d) => ({
        id: d.id,
        name: d.originalName,
        mime: d.mimeType,
        size: d.sizeBytes,
      })),
    );
    closeAppModal();
    if (added > 0) showError('');
  });

  paintCount();
  await load();
  qEl?.focus();
}

async function addChatFiles(fileList) {
  const rawFiles = [...(fileList || [])];
  if (!rawFiles.length) return;
  if (!playgroundAuthKey()) {
    showError(t('chat.needKey'));
    return;
  }

  const rejected = rawFiles.filter((f) => !isChatAllowedFilename(f.name));
  const files = rawFiles.filter((f) => isChatAllowedFilename(f.name));
  if (rejected.length) {
    showError(
      tf('chat.formatsReject', {
        name: rejected.map((f) => f.name).join(', '),
        formats: chatFormatsShort(),
      }),
    );
    if (!files.length) return;
  }

  if (chatPendingDocs.length + files.length > CHAT_MAX_DOCS) {
    showError(t('chat.tooManyFiles'));
    return;
  }
  const attachBtn = document.getElementById('chat-attach');
  const sendBtn = document.getElementById('chat-send');
  if (attachBtn) {
    attachBtn.disabled = true;
    attachBtn.textContent = t('chat.uploading');
  }
  if (sendBtn) sendBtn.disabled = true;

  const total = files.length;
  try {
    let i = 0;
    for (const file of files) {
      if (chatPendingDocs.length >= CHAT_MAX_DOCS) break;
      i += 1;
      setChatUploadProgress({
        visible: true,
        fileName: file.name,
        fileIndex: i,
        fileTotal: total,
        percent: 0,
        indeterminate: false,
      });
      const doc = await uploadChatFile(file, ({ percent }) => {
        setChatUploadProgress({
          visible: true,
          fileName: file.name,
          fileIndex: i,
          fileTotal: total,
          percent: percent < 0 ? 0 : percent,
          indeterminate: percent < 0,
        });
      });
      // brief 100% flash
      setChatUploadProgress({
        visible: true,
        fileName: file.name,
        fileIndex: i,
        fileTotal: total,
        percent: 100,
        indeterminate: false,
      });
      // avoid duplicate id if same file re-uploaded in session chips
      if (!chatPendingDocs.some((d) => d.id === doc.id)) {
        chatPendingDocs.push(doc);
      }
      renderChatPending();
    }
    if (!rejected.length) showError('');
  } catch (e) {
    showError(e.message || t('chat.uploadFail'));
  } finally {
    setChatUploadProgress({ visible: false });
    if (attachBtn) {
      attachBtn.disabled = false;
      attachBtn.textContent = t('chat.attach');
    }
    if (sendBtn) sendBtn.disabled = false;
  }
}

function chatKeySelectOptions() {
  const meId = state.me?.id || '';
  const meLabel = state.me
    ? `${t('chat.useSessionKey')} · ${state.me.name || ''} (${state.me.keyPrefix || ''}…)`
    : t('chat.useSessionKey');
  const selected = chatUi.keyId || 'session';
  const keys = (state.keys || []).filter((k) => k.isActive !== false);
  const opts = [
    `<option value="session" ${selected === 'session' || selected === meId || !selected ? 'selected' : ''}>${escapeHtml(meLabel)}</option>`,
  ];
  for (const k of keys) {
    if (meId && k.id === meId) continue;
    const label = `${k.name || 'key'} · ${k.keyPrefix || ''}… · ${k.role || ''}/${k.mode || ''}`;
    opts.push(
      `<option value="${escapeHtml(k.id)}" ${selected === k.id ? 'selected' : ''}>${escapeHtml(label)}</option>`,
    );
  }
  return opts.join('');
}

async function renderChatPlaygroundImpl() {
  await Promise.all([loadModels(false), loadKeys()]);
  const models = state.models || [];
  if (!chatUi.model && models.length) chatUi.model = models[0];
  const modelOpts = models
    .map(
      (m) =>
        `<option value="${escapeHtml(m)}" ${chatUi.model === m ? 'selected' : ''}>${escapeHtml(m)}</option>`,
    )
    .join('');

  // leaving chat page closes mobile drawer class
  setChatHistoryMobileOpen(false);

  appRoot().innerHTML = shell(`
    <div class="chat-page" id="chat-page">
      <div class="chat-drop-overlay" id="chat-drop-overlay" hidden aria-hidden="true">
        <div class="chat-drop-overlay-card">
          <div class="chat-drop-overlay-icon" aria-hidden="true">📎</div>
          <strong>${escapeHtml(t('chat.dropTitle'))}</strong>
          <span class="muted">${escapeHtml(t('chat.dropHint'))}</span>
        </div>
      </div>
      <div class="topbar">
        <h2>${escapeHtml(t('chat.title'))}</h2>
        <div class="toolbar">
          <button type="button" class="btn secondary sm" id="chat-history-toggle">${escapeHtml(t('chat.historyOpen'))}</button>
          <button type="button" class="btn secondary sm" id="chat-compress" title="${escapeHtml(t('chat.compress'))}">${escapeHtml(t('chat.compress'))}</button>
          <button type="button" class="btn secondary sm" id="chat-new">${escapeHtml(t('chat.new'))}</button>
        </div>
      </div>
      <div class="chat-body">
        <div class="chat-history-backdrop" id="chat-history-backdrop"></div>
        <div class="chat-shell">
          <div class="chat-toolbar">
            <label>${escapeHtml(t('chat.keySelect'))}
              <select id="chat-key-select">${chatKeySelectOptions()}</select>
            </label>
            <label>${escapeHtml(t('chats.model'))}
              <select id="chat-model">${modelOpts || `<option value="grok-4.6">grok-4.6</option>`}</select>
            </label>
            <label class="check-inline" for="chat-reasoning">
              <input type="checkbox" id="chat-reasoning" ${chatUi.reasoning !== false ? 'checked' : ''} />
              ${escapeHtml(t('chat.includeReasoning'))}
            </label>
            <label class="chat-ctx-label">${escapeHtml(t('chat.ctxMode'))}
              <select id="chat-ctx-mode">
                <option value="full">${escapeHtml(t('chat.ctxModeFull'))}</option>
                <option value="summary">${escapeHtml(t('chat.ctxModeSummary'))}</option>
                <option value="recent">${escapeHtml(t('chat.ctxModeRecent'))}</option>
              </select>
            </label>
            <label class="chat-ctx-label chat-ctx-n-label">${escapeHtml(t('chat.ctxRecentN'))}
              <input type="number" id="chat-ctx-n" min="2" max="40" value="${chatContext.recentN}" />
            </label>
            <button type="button" class="btn ghost sm" id="chat-system-toggle" title="${escapeHtml(t('chat.systemHint'))}">
              ${escapeHtml(t('chat.systemPrompt'))}${chatUi.systemPrompt ? ' ·' : ''}
            </button>
          </div>
          <div class="chat-system-wrap" id="chat-system-wrap" ${chatUi.systemOpen || chatUi.systemPrompt ? '' : 'hidden'}>
            <label class="chat-system-label" for="chat-system">${escapeHtml(t('chat.systemPrompt'))}
              <span class="hint">${escapeHtml(t('chat.systemHint'))}</span>
            </label>
            <textarea id="chat-system" rows="3" placeholder="${escapeHtml(t('chat.systemPlaceholder'))}">${escapeHtml(chatUi.systemPrompt || '')}</textarea>
          </div>
          <div id="chat-compress-banner" class="chat-compress-banner" hidden></div>
          <div id="chat-messages" class="chat-messages"></div>
          <div class="chat-composer" id="chat-composer">
            <div id="chat-pending" class="chat-pending" hidden></div>
            <div id="chat-upload-progress" class="chat-upload-progress" hidden aria-hidden="true">
              <div class="chat-upload-meta">
                <span id="chat-upload-label" class="chat-upload-label"></span>
                <span id="chat-upload-pct" class="chat-upload-pct"></span>
              </div>
              <div class="chat-upload-track" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <div id="chat-upload-bar" class="chat-upload-bar"></div>
              </div>
            </div>
            <div id="chat-stream-status" class="chat-stream-status" hidden></div>
            <textarea id="chat-input" rows="2" placeholder="${escapeHtml(t('chat.placeholder'))}"></textarea>
            <div class="chat-composer-actions">
              <div class="chat-composer-left">
                <input type="file" id="chat-file" class="chat-file-input" multiple accept="${escapeHtml(CHAT_FILE_ACCEPT)}" />
                <button type="button" class="btn secondary sm" id="chat-attach" title="${escapeHtml(t('chat.attachHint'))}">${escapeHtml(t('chat.attach'))}</button>
                <button type="button" class="btn secondary sm" id="chat-attach-lib" title="${escapeHtml(t('chat.libraryTitle'))}">${escapeHtml(t('chat.attachLibrary'))}</button>
                <span class="chat-formats-hint" title="${escapeHtml(chatFormatsShort())}">
                  <span class="chat-formats-label">${escapeHtml(t('chat.formatsLabel'))}</span>
                  <span class="muted">${escapeHtml(chatFormatsShort())}</span>
                </span>
              </div>
              <div class="chat-composer-right">
                <button type="button" class="btn secondary sm" id="chat-stop" disabled>${escapeHtml(t('chat.stop'))}</button>
                <button type="button" class="btn sm" id="chat-send">${escapeHtml(t('chat.send'))}</button>
              </div>
            </div>
          </div>
        </div>
        <aside class="chat-history-rail" id="chat-history-rail" aria-label="${escapeHtml(t('chat.history'))}">
          <div class="chat-history-head">
            <div class="chat-history-head-row">
              <h3>${escapeHtml(t('chat.history'))}</h3>
              <button type="button" class="btn ghost sm" id="chat-history-close-mobile" aria-label="${escapeHtml(t('chat.historyClose'))}">×</button>
            </div>
            <input type="search" id="chat-history-search" class="chat-history-search" placeholder="${escapeHtml(t('chat.historySearch'))}" value="${escapeHtml(chatSession.historyQ)}" />
          </div>
          <ul class="chat-history-list" id="chat-history-list"></ul>
          <div class="chat-history-pager" id="chat-history-pager"></div>
        </aside>
      </div>
    </div>
  `);
  bindShell(_ctx?.rerender || (() => {}));
  renderChatBubbles();
  renderChatPending();
  paintChatHistoryList();
  updateChatCompressButton();
  paintContextBanner();
  syncContextControls();
  loadConversationList().catch(() => {});

  document.getElementById('chat-key-select').onchange = () => captureChatUi();
  const ctxMode = document.getElementById('chat-ctx-mode');
  const ctxN = document.getElementById('chat-ctx-n');
  if (ctxMode) {
    ctxMode.onchange = () => {
      const v = ctxMode.value;
      if (v === 'summary' && !chatContext.summary) {
        showError(t('chat.compressNeedSummary'));
        ctxMode.value = chatContext.mode === 'recent' ? 'recent' : 'full';
        return;
      }
      chatContext.mode = v === 'summary' || v === 'recent' ? v : 'full';
      paintContextBanner();
      syncContextControls();
      saveConversation().catch(() => {});
    };
  }
  if (ctxN) {
    ctxN.onchange = () => {
      chatContext.recentN = Math.min(
        40,
        Math.max(2, Number(ctxN.value) || 6),
      );
      paintContextBanner();
      saveConversation().catch(() => {});
    };
  }
  document.getElementById('chat-model').onchange = () => captureChatUi();
  document.getElementById('chat-reasoning').onchange = () => captureChatUi();
  document.getElementById('chat-system').oninput = () => captureChatUi();
  document.getElementById('chat-system-toggle').onclick = () => {
    captureChatUi();
    chatUi.systemOpen = !chatUi.systemOpen;
    const wrap = document.getElementById('chat-system-wrap');
    if (wrap) wrap.hidden = !chatUi.systemOpen && !chatUi.systemPrompt.trim();
    if (chatUi.systemOpen) document.getElementById('chat-system')?.focus();
  };

  document.getElementById('chat-new').onclick = () => {
    resetChatThread(true);
  };
  document.getElementById('chat-compress').onclick = () => {
    compressChatHistory().catch(() => {});
  };
  document.getElementById('chat-stop').onclick = () => {
    if (chatAbort) chatAbort.abort();
  };
  document.getElementById('chat-send').onclick = () => sendChatMessage();
  document.getElementById('chat-attach').onclick = () => {
    document.getElementById('chat-file')?.click();
  };
  document.getElementById('chat-attach-lib')?.addEventListener('click', () => {
    openChatLibraryPicker().catch((e) => showError(e.message || t('chat.libraryLoadFail')));
  });
  document.getElementById('chat-file').onchange = (e) => {
    const input = e.target;
    addChatFiles(input.files).finally(() => {
      input.value = '';
    });
  };

  const histToggle = document.getElementById('chat-history-toggle');
  const histBackdrop = document.getElementById('chat-history-backdrop');
  const histClose = document.getElementById('chat-history-close-mobile');
  if (histToggle) {
    histToggle.onclick = () => {
      setChatHistoryMobileOpen(!chatSession.historyOpenMobile);
    };
  }
  if (histBackdrop) {
    histBackdrop.onclick = () => closeChatHistoryMobile();
  }
  if (histClose) {
    histClose.onclick = () => closeChatHistoryMobile();
  }
  const searchEl = document.getElementById('chat-history-search');
  if (searchEl) {
    searchEl.oninput = () => {
      chatSession.historyQ = searchEl.value;
      if (chatHistorySearchTimer) clearTimeout(chatHistorySearchTimer);
      chatHistorySearchTimer = setTimeout(() => {
        chatSession.historyPage = 0;
        loadConversationList();
      }, 280);
    };
  }

  // Full-page drag & drop: drop files anywhere on the chat page
  bindChatPageFileDrop();

  document.getElementById('chat-input').onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };
}

/**
 * Allow dragging files from the OS into the chat page (whole surface).
 * Prevents the browser from navigating to the dropped file.
 */
function bindChatPageFileDrop() {
  const page = document.getElementById('chat-page');
  const overlay = document.getElementById('chat-drop-overlay');
  const composer = document.getElementById('chat-composer');
  if (!page) return;

  let dragDepth = 0;

  const hasFiles = (e) => {
    const types = e.dataTransfer?.types;
    if (!types) return false;
    // DOMStringList or array
    if (typeof types.includes === 'function') return types.includes('Files');
    return [...types].includes('Files');
  };

  const showOverlay = (on) => {
    page.classList.toggle('is-file-drag', on);
    if (composer) composer.classList.toggle('is-dragover', on);
    if (overlay) {
      overlay.hidden = !on;
      overlay.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  };

  const onDragEnter = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth += 1;
    showOverlay(true);
  };

  const onDragOver = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    showOverlay(true);
  };

  const onDragLeave = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) showOverlay(false);
  };

  const onDrop = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = 0;
    showOverlay(false);
    const files = e.dataTransfer?.files;
    if (files?.length) {
      addChatFiles(files).catch((err) =>
        showError(err.message || t('chat.uploadFail')),
      );
    }
  };

  page.addEventListener('dragenter', onDragEnter);
  page.addEventListener('dragover', onDragOver);
  page.addEventListener('dragleave', onDragLeave);
  page.addEventListener('drop', onDrop);

  // Block browser default open-file navigation while on chat page
  const winDragOver = (e) => {
    if (state.page !== 'chat') return;
    if (hasFiles(e)) e.preventDefault();
  };
  const winDrop = (e) => {
    if (state.page !== 'chat') return;
    if (hasFiles(e)) e.preventDefault();
  };
  window.addEventListener('dragover', winDragOver);
  window.addEventListener('drop', winDrop);

  // Stash removers on page node for cleanup on next render (node is discarded)
  page._chatDropCleanup = () => {
    window.removeEventListener('dragover', winDragOver);
    window.removeEventListener('drop', winDrop);
  };
}

/**
 * Collect document IDs for Grok: current pending chips + every prior message
 * that still carries `docs` so multi-turn keeps attachments in context.
 * @returns {string[]}
 */
function collectDocumentIdsForSend(pending) {
  const seen = new Set();
  const ids = [];
  const push = (id) => {
    if (!id || typeof id !== 'string') return;
    const t = id.trim();
    if (!DOC_ID_RE.test(t) || seen.has(t)) return;
    seen.add(t);
    ids.push(t);
  };
  for (const d of pending || []) push(d?.id);
  for (const m of chatMessages) {
    if (!m?.docs?.length) continue;
    for (const d of m.docs) push(d?.id);
  }
  return ids;
}

async function sendChatMessage() {
  captureChatUi();
  const input = document.getElementById('chat-input');
  let text = input?.value.trim() || '';
  const pending = [...chatPendingDocs];

  if (!text && !pending.length) {
    showError(t('chat.needContent'));
    return;
  }
  const auth = playgroundAuthKey();
  if (!auth) {
    showError(t('chat.needKey'));
    return;
  }
  if (!text && pending.length) {
    text = t('chat.fileOnlyPrompt');
  }

  // Reject pending chips that never got a server id (broken upload response)
  const badPending = pending.filter((d) => !d?.id || !DOC_ID_RE.test(String(d.id)));
  if (badPending.length) {
    showError(t('chat.uploadFail'));
    return;
  }

  const model =
    document.getElementById('chat-model')?.value || chatUi.model || 'grok-4.6';
  const includeReasoning =
    document.getElementById('chat-reasoning')?.checked !== false;
  const asKeyId = playgroundKeyId();

  // Pending for this user bubble only; API gets pending + history docs
  const docMeta = pending.map((d) => ({ id: d.id, name: d.name }));
  const docIds = collectDocumentIdsForSend(pending);

  chatMessages.push({
    role: 'user',
    content: text,
    docs: docMeta.length ? docMeta : undefined,
  });
  if (input) input.value = '';
  chatPendingDocs = [];
  renderChatPending();

  const assistant = {
    role: 'assistant',
    content: '',
    reasoning: '',
    streaming: true,
  };
  chatMessages.push(assistant);
  // Keep viewport on newest messages for long threads
  const maxSkip = Math.max(0, chatMessages.length - CHAT_RENDER_WINDOW);
  chatRenderSkip = maxSkip;
  renderChatBubbles();

  // Context policy: full | summary+recent N | recent N (history UI unchanged)
  const apiMessages = buildApiMessages();

  const sendBtn = document.getElementById('chat-send');
  const stopBtn = document.getElementById('chat-stop');
  const attachBtn = document.getElementById('chat-attach');
  const libBtn = document.getElementById('chat-attach-lib');
  if (sendBtn) sendBtn.disabled = true;
  if (attachBtn) attachBtn.disabled = true;
  if (libBtn) libBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;

  chatAbort = new AbortController();
  try {
    const body = {
      model,
      stream: true,
      include_reasoning: includeReasoning,
      messages: apiMessages,
    };
    // Always pass document_ids when any attachment is in the thread
    if (docIds.length) body.document_ids = docIds;
    // Only send real key UUID — session actor is already on the Bearer token
    const realKeyId = playgroundRealApiKeyId();
    if (realKeyId) body.apiKeyId = realKeyId;

    // Admin playground proxy — select key by id (no raw secret)
    const res = await fetch('/admin/api/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: chatAbort.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = errText;
      try {
        const j = JSON.parse(errText);
        msg = j.error?.message || errText;
      } catch {
        /* */
      }
      throw new Error(msg || res.statusText);
    }

    // Prefer real streaming via ReadableStream
    if (res.body && typeof res.body.getReader === 'function') {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let lastPaint = 0;
      const paint = (force = false) => {
        const now = performance.now();
        if (force || now - lastPaint > 40) {
          lastPaint = now;
          renderChatBubbles();
        }
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = parseSseBuffer(buffer);
        buffer = rest;
        let changed = false;
        for (const data of events) {
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            if (applyStreamDelta(assistant, json)) changed = true;
          } catch {
            /* skip incomplete / non-json */
          }
        }
        if (changed) paint(false);
      }
      // flush trailing buffer (no final newline)
      if (buffer.trim()) {
        const { events } = parseSseBuffer(buffer + '\n');
        for (const data of events) {
          if (data === '[DONE]') continue;
          try {
            applyStreamDelta(assistant, JSON.parse(data));
          } catch {
            /* ignore */
          }
        }
      }
      paint(true);
    } else {
      // Fallback: no stream body (some proxies) — read full text as SSE
      const text = await res.text();
      const { events } = parseSseBuffer(text + '\n');
      for (const data of events) {
        if (data === '[DONE]') continue;
        try {
          applyStreamDelta(assistant, JSON.parse(data));
        } catch {
          /* try non-SSE JSON completion */
          try {
            const full = JSON.parse(text);
            applyStreamDelta(assistant, full);
          } catch {
            /* ignore */
          }
        }
      }
      renderChatBubbles();
    }

    if (!assistant.content && !assistant.reasoning) {
      assistant.content = t('chat.emptyReply');
    }
    showError('');
  } catch (e) {
    if (e.name === 'AbortError') {
      assistant.content =
        (assistant.content || '') + `\n[${t('chat.stopped')}]`;
    } else {
      assistant.error = true;
      assistant.content =
        (assistant.content || '') + `\n✗ ${e.message || e}`;
      showError(e.message || String(e));
    }
  } finally {
    assistant.streaming = false;
    chatAbort = null;
    renderChatBubbles();
    updateChatCompressButton();
    if (sendBtn) sendBtn.disabled = false;
    if (attachBtn) attachBtn.disabled = false;
    if (libBtn) libBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    // Persist thread (non-blocking on failure)
    saveConversation().catch(() => {});
  }
}



export async function renderChatPlayground(ctx) {
  _ctx = ctx || null;
  await renderChatPlaygroundImpl();
}
