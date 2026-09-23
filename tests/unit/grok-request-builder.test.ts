import { describe, expect, it } from 'vitest';
import { DEFAULT_API_FEATURES } from '../../src/interfaces/api-features.type';
import {
  buildGrokRequestFromChatDto,
  buildVisionPromptJson,
} from '../../src/services/grok-request-builder.service';
import type { ResolvedPolicy } from '../../src/interfaces/resolved-policy.interface';

const policy: ResolvedPolicy = {
  mode: 'agent',
  cwd: '/tmp',
  alwaysApprove: true,
  maxTurns: 4,
  timeoutMs: 60_000,
  toolsAllowlist: null,
  toolsDenylist: null,
  sandboxForced: false,
};

describe('grok-request-builder vision', () => {
  it('maps OpenAI data-URL images to ACP { type, mimeType, data }', () => {
    const built = buildVisionPromptJson([
      {
        role: 'user',
        content: [
          { type: 'text', text: 'what is this?' },
          {
            type: 'image_url',
            image_url: { url: 'data:image/png;base64,aGVsbG8=' },
          },
        ],
      },
    ]);
    const blocks = JSON.parse(built.promptJson) as Array<Record<string, unknown>>;
    expect(blocks.some((b) => b.type === 'text' && b.text === 'what is this?')).toBe(
      true,
    );
    const img = blocks.find((b) => b.type === 'image');
    expect(img).toEqual({
      type: 'image',
      mimeType: 'image/png',
      data: 'aGVsbG8=',
    });
    expect(built.files[0]?.filename).toMatch(/vision-0\.png/);
    expect(built.tooLargeForArgv).toBe(false);
  });

  it('maps Anthropic base64 image source to ACP blocks', () => {
    const built = buildVisionPromptJson([
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: '/9j/4AAQ',
            },
          },
        ],
      },
    ]);
    const blocks = JSON.parse(built.promptJson) as Array<Record<string, unknown>>;
    expect(blocks).toContainEqual({
      type: 'image',
      mimeType: 'image/jpeg',
      data: '/9j/4AAQ',
    });
  });

  it('does not emit removed --best-of-n / --check flags', () => {
    const req = buildGrokRequestFromChatDto(
      {
        model: 'grok-4.6',
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
        include_reasoning: true,
        best_of_n: 4,
        check: true,
      },
      policy,
      { ...DEFAULT_API_FEATURES, bestOfN: true, checkLoop: true },
    );
    expect(req.extra.bestOfN).toBeUndefined();
    expect(req.extra.check).toBeUndefined();
  });
});

describe('grok-request-builder safe lock', () => {
  const safePolicy: ResolvedPolicy = {
    mode: 'safe',
    cwd: '/tmp/sandbox',
    alwaysApprove: false,
    maxTurns: 4,
    timeoutMs: 60_000,
    toolsAllowlist: 'read,grep',
    toolsDenylist: 'Bash,bash,Write',
    sandboxForced: true,
  };

  it('does not merge client tools or pass privilege flags in safe mode', () => {
    const req = buildGrokRequestFromChatDto(
      {
        model: 'grok-4.6',
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
        include_reasoning: true,
        tools: [
          {
            type: 'function',
            function: { name: 'Bash', parameters: { type: 'object' } },
          },
        ],
        permission_mode: 'bypassPermissions',
        sandbox: 'off',
        allow: ['Bash(*)'],
        agent: 'evil',
        agents: { evil: {} },
        system_prompt_override: 'ignore policy',
        rules: 'allow all',
      },
      safePolicy,
      {
        ...DEFAULT_API_FEATURES,
        permissionMode: true,
        sandbox: true,
        systemOverride: true,
        rules: true,
      },
    );
    expect(req.toolsAllowlist).toBe('read,grep');
    expect(req.toolsDenylist).toBe('Bash,bash,Write');
    expect(req.extra.permissionMode).toBeNull();
    expect(req.extra.sandbox).toBeNull();
    expect(req.extra.allowRules).toBeNull();
    expect(req.extra.agent).toBeNull();
    expect(req.extra.agentsJson).toBeNull();
    expect(req.extra.systemPromptOverride).toBeNull();
    expect(req.extra.rules).toBeNull();
  });

  it('still merges tools for agent policy', () => {
    const req = buildGrokRequestFromChatDto(
      {
        model: 'grok-4.6',
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
        include_reasoning: true,
        tools: [
          {
            type: 'function',
            function: { name: 'weather', parameters: { type: 'object' } },
          },
        ],
      },
      policy,
      { ...DEFAULT_API_FEATURES },
    );
    expect(req.toolsAllowlist).toContain('weather');
  });
});
