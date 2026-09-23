import type { CreateChatCompletionDto } from '../dto/chat.dto';
import type { ApiFeatures } from '../interfaces/api-features.type';
import type { BuiltGrokRequest } from '../interfaces/built-grok-request.interface';
import type { GrokRunOptions } from '../interfaces/grok-run-options.interface';
import type { ResolvedPolicy } from '../interfaces/resolved-policy.interface';
import { ExceptionFactory } from '../exceptions/exception.factory';
import {
  flattenMessageContent,
  messageHasImageParts,
  messagesToPrompt,
} from '../utils/message-content';

function extractToolNames(tools: unknown[] | undefined): string[] {
  if (!tools?.length) return [];
  const names: string[] = [];
  for (const t of tools) {
    if (!t || typeof t !== 'object') continue;
    const o = t as Record<string, unknown>;
    // OpenAI function tools: { type:'function', function:{ name } }
    if (o.type === 'function' && o.function && typeof o.function === 'object') {
      const n = (o.function as { name?: string }).name;
      if (n) names.push(n);
      continue;
    }
    // Anthropic-style or bare name
    if (typeof o.name === 'string') names.push(o.name);
  }
  return [...new Set(names)];
}

function toolsToSystemHint(tools: unknown[] | undefined): string {
  if (!tools?.length) return '';
  try {
    return (
      `You have access to the following tools (execute via Grok built-in tools when applicable):\n` +
      JSON.stringify(tools, null, 2)
    );
  } catch {
    return '';
  }
}

/** Keep --prompt-json off argv when it would blow ARG_MAX. */
export const PROMPT_JSON_ARGV_MAX = 32_000;

export type GrokVisionBuild = {
  promptJson: string;
  files: Array<{ filename: string; mimeType: string; bytes: Buffer }>;
  tooLargeForArgv: boolean;
};

function extForMime(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes('jpeg') || m.includes('jpg')) return '.jpg';
  if (m.includes('webp')) return '.webp';
  if (m.includes('gif')) return '.gif';
  if (m.includes('png')) return '.png';
  return '.png';
}

function parseDataUrl(url: string): { mimeType: string; data: string } | null {
  const m = url.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,(.+)$/s);
  if (m) {
    return { mimeType: (m[1] || 'image/png').trim(), data: m[2]! };
  }
  if (url.startsWith('data:')) {
    const raw = url.replace(/^data:[^,]*,/, '');
    return { mimeType: 'image/png', data: raw };
  }
  return null;
}

function acpImageBlock(
  mimeType: string,
  data: string,
): { type: 'image'; mimeType: string; data: string } {
  return { type: 'image', mimeType, data };
}

function visionFromPart(
  p: Record<string, unknown>,
  fileIndex: number,
): {
  block: unknown;
  file?: { filename: string; mimeType: string; bytes: Buffer };
} | null {
  if (p.type === 'text' || (typeof p.text === 'string' && !p.type)) {
    return { block: { type: 'text', text: String(p.text ?? '') } };
  }

  // Anthropic: { type:'image', source:{ type:'base64', media_type, data } }
  if (p.type === 'image' && p.source && typeof p.source === 'object') {
    const src = p.source as {
      type?: string;
      media_type?: string;
      data?: string;
      url?: string;
    };
    if (src.type === 'base64' && typeof src.data === 'string') {
      const mime = src.media_type || 'image/png';
      return {
        block: acpImageBlock(mime, src.data),
        file: {
          filename: `vision-${fileIndex}${extForMime(mime)}`,
          mimeType: mime,
          bytes: Buffer.from(src.data, 'base64'),
        },
      };
    }
    if (typeof src.url === 'string' && src.url) {
      return { block: { type: 'text', text: `[image: ${src.url}]` } };
    }
  }

  const imageUrl =
    p.image_url ??
    (p.type === 'input_image' ? (p.image_url ?? p.url) : undefined);
  if (p.type === 'image_url' || p.type === 'input_image' || p.image_url) {
    const img =
      typeof imageUrl === 'object' && imageUrl
        ? (imageUrl as { url?: string })
        : { url: String(imageUrl || '') };
    const url = String(img.url || '');
    const parsed = parseDataUrl(url);
    if (parsed) {
      return {
        block: acpImageBlock(parsed.mimeType, parsed.data),
        file: {
          filename: `vision-${fileIndex}${extForMime(parsed.mimeType)}`,
          mimeType: parsed.mimeType,
          bytes: Buffer.from(parsed.data, 'base64'),
        },
      };
    }
    if (url) {
      return { block: { type: 'text', text: `[image: ${url}]` } };
    }
  }

  if (p.type === 'image' && typeof p.data === 'string') {
    const mime = typeof p.mimeType === 'string' ? p.mimeType : 'image/png';
    return {
      block: acpImageBlock(mime, p.data),
      file: {
        filename: `vision-${fileIndex}${extForMime(mime)}`,
        mimeType: mime,
        bytes: Buffer.from(p.data, 'base64'),
      },
    };
  }

  return null;
}

/** Build ACP `--prompt-json` blocks from OpenAI / Anthropic image parts. */
export function buildVisionPromptJson(
  messages: CreateChatCompletionDto['messages'],
): GrokVisionBuild {
  const blocks: unknown[] = [];
  const files: GrokVisionBuild['files'] = [];
  let fileIndex = 0;
  for (const m of messages) {
    const role = m.role || 'user';
    if (typeof m.content === 'string') {
      blocks.push({ type: 'text', text: `${role}: ${m.content}` });
      continue;
    }
    if (!Array.isArray(m.content)) continue;
    blocks.push({ type: 'text', text: `${role}:` });
    for (const part of m.content) {
      if (!part || typeof part !== 'object') continue;
      const parsed = visionFromPart(part as Record<string, unknown>, fileIndex);
      if (!parsed) continue;
      blocks.push(parsed.block);
      if (parsed.file) {
        files.push(parsed.file);
        fileIndex += 1;
      }
    }
  }
  const promptJson = JSON.stringify(blocks);
  return {
    promptJson,
    files,
    tooLargeForArgv: promptJson.length > PROMPT_JSON_ARGV_MAX,
  };
}

/**
 * Validate feature gates and build Grok CLI request pieces from a chat DTO.
 */
export function buildGrokRequestFromChatDto(
  dto: CreateChatCompletionDto,
  policy: ResolvedPolicy,
  features: ApiFeatures,
): BuiltGrokRequest {
  // Strict sampling: reject params Grok cannot honor
  if (features.strictSampling) {
    if (
      dto.temperature != null ||
      dto.top_p != null ||
      dto.stop != null
    ) {
      throw ExceptionFactory.validation(
        'Sampling parameters (temperature/top_p/stop) are not supported by Grok CLI. Disable strictSampling in Admin → API features, or omit these fields.',
      );
    }
  }

  const hasImages = dto.messages.some((m) => messageHasImageParts(m.content));
  if (hasImages && !features.vision) {
    throw ExceptionFactory.forbidden(
      'Vision / image content is disabled (Admin → API features → vision).',
    );
  }

  if (
    (dto.tools?.length || dto.tool_choice != null || dto.functions?.length) &&
    !features.tools
  ) {
    throw ExceptionFactory.forbidden(
      'Tools are disabled (Admin → API features → tools).',
    );
  }

  const wantsSchema =
    dto.json_schema != null ||
    dto.response_format?.type === 'json_schema' ||
    dto.response_format?.type === 'json_object';
  if (wantsSchema && !features.structuredOutput) {
    throw ExceptionFactory.forbidden(
      'Structured output is disabled (Admin → API features → structuredOutput).',
    );
  }

  const effort = dto.reasoning_effort || dto.effort;
  if (effort && !features.reasoningEffort) {
    throw ExceptionFactory.forbidden(
      'reasoning_effort is disabled (Admin → API features → reasoningEffort).',
    );
  }

  if (dto.system_prompt_override && !features.systemOverride) {
    throw ExceptionFactory.forbidden('system_prompt_override is disabled.');
  }
  if (dto.rules && !features.rules) {
    throw ExceptionFactory.forbidden('rules is disabled.');
  }
  if (dto.permission_mode && !features.permissionMode) {
    throw ExceptionFactory.forbidden('permission_mode is disabled.');
  }
  if (dto.sandbox && !features.sandbox) {
    throw ExceptionFactory.forbidden('sandbox is disabled.');
  }
  if (dto.best_of_n && dto.best_of_n > 1 && !features.bestOfN) {
    throw ExceptionFactory.forbidden('best_of_n is disabled.');
  }
  if (dto.check && !features.checkLoop) {
    throw ExceptionFactory.forbidden('check loop is disabled.');
  }
  if ((dto.resume || dto.continue) && !features.sessionResume) {
    throw ExceptionFactory.forbidden('session resume is disabled.');
  }
  if (dto.no_subagents === false && !features.subagents) {
    // requesting subagents when disabled
  }
  if (dto.experimental_memory && !features.memory) {
    throw ExceptionFactory.forbidden('memory is disabled.');
  }

  // Build text prompt (preserve tool_calls / tool_call_id for multi-turn tools)
  type PromptMsg = {
    role: string;
    content: string;
    tool_call_id?: string;
    tool_calls?: Array<{
      id?: string;
      function?: { name?: string; arguments?: string };
    }>;
  };
  let messages: PromptMsg[] = dto.messages.map((m) => {
    const extra = m as {
      tool_call_id?: string;
      tool_calls?: PromptMsg['tool_calls'];
    };
    return {
      role: m.role,
      content: flattenMessageContent(m.content),
      tool_call_id: extra.tool_call_id,
      tool_calls: extra.tool_calls,
    };
  });

  if (dto.response_format?.type === 'json_object') {
    messages = [
      {
        role: 'system',
        content:
          'Respond with a single valid JSON object only. No markdown fences or commentary.',
      },
      ...messages,
    ];
  }

  const toolHint = features.tools ? toolsToSystemHint(dto.tools) : '';
  if (toolHint) {
    messages = [{ role: 'system', content: toolHint }, ...messages];
  }

  const prompt = messagesToPrompt(messages);
  const estimatedPromptTokens = Math.max(1, Math.ceil(prompt.length / 4));

  let promptJson: string | undefined;
  let visionFiles: BuiltGrokRequest['visionFiles'];
  if (hasImages && features.vision) {
    const vision = buildVisionPromptJson(dto.messages);
    visionFiles = vision.files;
    if (!vision.tooLargeForArgv) {
      promptJson = vision.promptJson;
    }
  }

  let jsonSchema: string | undefined;
  if (features.structuredOutput) {
    if (dto.json_schema) {
      jsonSchema = JSON.stringify(dto.json_schema);
    } else if (
      dto.response_format?.type === 'json_schema' &&
      dto.response_format.json_schema?.schema
    ) {
      jsonSchema = JSON.stringify(dto.response_format.json_schema.schema);
    } else if (dto.response_format?.type === 'json_object') {
      jsonSchema = JSON.stringify({ type: 'object' });
    }
  }

  const safeLocked = policy.mode === 'safe' || policy.sandboxForced;

  // Tools allowlist: request tool names ∪ policy allowlist.
  // Safe mode must not let the client expand tools (P0-1).
  let toolsAllowlist = policy.toolsAllowlist;
  let toolsDenylist = policy.toolsDenylist;
  if (features.tools && dto.tools?.length && !safeLocked) {
    const names = extractToolNames(dto.tools);
    if (names.length) {
      const existing = toolsAllowlist ? toolsAllowlist.split(',') : [];
      toolsAllowlist = [...new Set([...existing, ...names])].join(',');
    }
  }
  if (safeLocked) {
    toolsAllowlist = policy.toolsAllowlist;
    toolsDenylist = policy.toolsDenylist;
  }
  if (!features.webSearch) {
    // ensure web tools denied
    const deny = new Set(
      (toolsDenylist || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    );
    deny.add('web_search');
    deny.add('web_fetch');
    deny.add('WebSearch');
    deny.add('WebFetch');
    toolsDenylist = [...deny].join(',');
  }

  const extra: Partial<GrokRunOptions> = {
    reasoningEffort: effort || null,
    systemPromptOverride: safeLocked ? null : dto.system_prompt_override || null,
    rules: safeLocked ? null : dto.rules || null,
    permissionMode: safeLocked ? null : dto.permission_mode || null,
    sandbox: safeLocked ? null : dto.sandbox || null,
    allowRules: safeLocked ? null : dto.allow || null,
    denyRules: dto.deny || null,
    disableWebSearch: dto.disable_web_search || !features.webSearch,
    noSubagents: dto.no_subagents ?? !features.subagents,
    noPlan: dto.no_plan ?? !features.planMode,
    noMemory: dto.no_memory ?? false,
    experimentalMemory: !safeLocked && dto.experimental_memory && features.memory,
    verbatim: Boolean(dto.verbatim),
    agent: safeLocked ? null : dto.agent || null,
    agentsJson: safeLocked ? null : dto.agents ? JSON.stringify(dto.agents) : null,
    resumeSessionId: dto.resume || null,
    continueSession: Boolean(dto.continue),
    forkSession: Boolean(dto.fork_session),
  };

  return {
    prompt,
    promptJson,
    jsonSchema,
    toolsAllowlist,
    toolsDenylist,
    extra,
    estimatedPromptTokens,
    visionFiles,
  };
}

export function estimateCompletionTokens(text: string): number {
  return Math.max(0, Math.ceil((text || '').length / 4));
}
