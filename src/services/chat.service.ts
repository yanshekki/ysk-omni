import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Response } from 'express';
import { prisma } from '../config/database';
import {
  AUDIT_ACTIONS,
  CHAT_STATUS,
  MAX_DOCUMENT_CONTEXT_CHARS,
  MAX_TOTAL_PROMPT_CHARS,
} from '../config/constants';
import type { CreateChatCompletionDto } from '../dto/chat.dto';
import type { ChatContext } from '../interfaces/chat-context.interface';
import type { GrokCollectedOutput } from '../interfaces/grok-collected-output.interface';
import type { GrokRunOptions } from '../interfaces/grok-run-options.interface';
import type { GrokResponseMeta } from '../interfaces/grok-response-meta.interface';
import type { OpenAiChatCompletion } from '../interfaces/open-ai-chat-completion.interface';
import type { ResolvedPolicy } from '../interfaces/resolved-policy.interface';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { HttpException } from '../exceptions/http.exception';
import {
  createChatCompletionId,
  createId,
  createMessageId,
  createResponseId,
} from '../utils/id';
import { rmSafe, ensureDir } from '../utils/fs-safe';
import { toBytes } from '../utils/prisma-bytes';
import {
  mapFinishChunk,
  mapGrokToChatCompletion,
  mapReasoningDeltaChunk,
  mapRoleChunk,
  mapTextDeltaChunk,
} from '../utils/openai-mapper';
import {
  initSse,
  writeSseData,
  writeSseDone,
  writeSseEvent,
} from '../utils/stream';
import { logger } from '../utils/logger';
import { auditService } from './audit.service';
import { documentService } from './document.service';
import { encryptionService } from './encryption.service';
import { grokCliService } from './grok-cli.service';
import { grokSessionMapService } from './grok-session-map.service';
import { policyService } from './policy.service';
import { settingsService } from './settings.service';
import { chatQueueService } from './queue/chat-queue.service';
import { jobWaiterRegistry } from './queue/job-waiter';
import { queuePolicyService } from './queue/queue-policy.service';
import type { StreamWireFormat } from '../interfaces/chat-job-payload.interface';
import type { ExecuteCompletionOptions } from '../interfaces/execute-completion-options.interface';
import type { GrokToolCall, GrokUsage } from '../interfaces/grok-collected-output.interface';
import { mapAnthropicStopReason } from '../utils/anthropic-mapper';
import { apiFeaturesService } from './api-features.service';
import {
  buildGrokRequestFromChatDto,
  estimateCompletionTokens,
} from './grok-request-builder.service';
import { messageHasImageParts } from '../utils/message-content';
import { inlineRemoteImageUrls } from '../utils/vision-remote';

function policyToRunOpts(
  policy: ResolvedPolicy,
  base: {
    prompt: string;
    model: string;
    stream: boolean;
    sessionId?: string;
    apiKeyId: string;
    toolsAllowlist?: string | null;
    toolsDenylist?: string | null;
    promptJson?: string;
    jsonSchema?: string;
    extra?: Partial<GrokRunOptions>;
  },
): GrokRunOptions {
  return {
    ...(base.extra || {}),
    prompt: base.prompt,
    model: base.model,
    stream: base.stream,
    sessionId: base.sessionId,
    promptJson: base.promptJson,
    jsonSchema: base.jsonSchema,
    toolsAllowlist: base.toolsAllowlist ?? policy.toolsAllowlist,
    toolsDenylist: base.toolsDenylist ?? policy.toolsDenylist,
    // Policy always wins — client extra must not override jail / approve.
    cwd: policy.cwd,
    timeoutMs: policy.timeoutMs,
    alwaysApprove: policy.alwaysApprove,
    maxTurns: policy.maxTurns,
  };
}

export class ChatService {
  /**
   * Public entry: enqueue when queue enabled, else run immediately.
   */
  async createCompletion(
    dto: CreateChatCompletionDto,
    ctx: ChatContext,
    res?: Response,
    options?: ExecuteCompletionOptions,
  ): Promise<OpenAiChatCompletion | void> {
    if (options?.fromQueue) {
      return this.executeCompletion(dto, ctx, res, options);
    }

    const qPolicy = await queuePolicyService.get();
    if (qPolicy.enabled) {
      return this.createCompletionQueued(
        dto,
        ctx,
        res,
        options?.source || 'v1',
        options?.idempotencyKey,
        options,
      );
    }
    return this.executeCompletion(dto, ctx, res, options);
  }

  /** Enqueue + wait (stream holds SSE until worker finishes). */
  private async createCompletionQueued(
    dto: CreateChatCompletionDto,
    ctx: ChatContext,
    res?: Response,
    source: 'v1' | 'playground' = 'v1',
    idempotencyKey?: string,
    options?: ExecuteCompletionOptions,
  ): Promise<OpenAiChatCompletion | void> {
    const stream = Boolean(dto.stream);
    const wireFormat = options?.wireFormat || 'openai';
    const suppressQueue =
      options?.suppressQueueEvents || wireFormat !== 'openai';
    const enq = await chatQueueService.enqueue({
      dto,
      ctx,
      source,
      idempotencyKey,
      wireFormat,
    });
    const { jobId, position, policy } = enq;
    if (enq.alreadyDone) {
      // Idempotent replay: do not re-run. Stream clients get a terminal queue event.
      if (stream && res) {
        if (!res.headersSent) initSse(res);
        if (!suppressQueue) {
          writeSseData(res, {
            object: 'gog.queue',
            status: 'succeeded',
            job_id: jobId,
            result_chat_request_id: enq.resultChatRequestId ?? null,
            message: 'Idempotent replay: job already completed',
          });
          writeSseDone(res);
        } else {
          // Protocol-native clients cannot consume gog.queue — fail clearly
          writeSseEvent(res, 'error', {
            type: 'error',
            error: {
              type: 'invalid_request_error',
              message:
                'Idempotent request already completed; omit Idempotency-Key to start a new job',
            },
          });
        }
        res.end();
        return;
      }
      throw ExceptionFactory.validation(
        'Idempotent request already completed; omit Idempotency-Key to start a new job',
      );
    }

    const ee = jobWaiterRegistry.register(jobId, res);
    if (stream) {
      if (!res) throw ExceptionFactory.internal('Streaming requires Response');
      if (!res.headersSent) {
        initSse(res);
      }
      if (!suppressQueue) {
        writeSseData(res, {
          object: 'gog.queue',
          status: 'queued',
          job_id: jobId,
          position,
          message: `Queued (position ${position})`,
        });
        ee.on('queue', (ev: { position: number }) => {
          if (!res.writableEnded) {
            writeSseData(res, {
              object: 'gog.queue',
              status: 'queued',
              job_id: jobId,
              position: ev.position,
            });
          }
        });
      }
    }

    // Position updates while waiting
    const posTimer = setInterval(() => {
      void chatQueueService.estimatePosition(jobId).then((p) => {
        if (p > 0) jobWaiterRegistry.emitQueue(jobId, p);
      });
    }, 2000);

    const maxWait = policy.maxWaitMs;
    try {
      const result = await new Promise<OpenAiChatCompletion | void>(
        (resolve, reject) => {
          const timer = setTimeout(() => {
            reject(ExceptionFactory.queueTimeout());
          }, maxWait);

          const onAbort = () => {
            void chatQueueService.requestCancel(jobId);
          };
          res?.on('close', onAbort);

          ee.once('done', (ev: { result?: OpenAiChatCompletion }) => {
            clearTimeout(timer);
            res?.off('close', onAbort);
            resolve(ev.result);
          });
          ee.once('error', (ev: { error: Error }) => {
            clearTimeout(timer);
            res?.off('close', onAbort);
            reject(ev.error);
          });
        },
      );
      return result;
    } catch (err) {
      if (stream && res && !res.writableEnded) {
        const message = err instanceof Error ? err.message : 'Queue error';
        writeSseData(res, {
          error: {
            message,
            type: 'server_error',
            code:
              err instanceof HttpException ? err.code : 'queue_error',
          },
        });
        writeSseDone(res);
        res.end();
      }
      throw err;
    } finally {
      clearInterval(posTimer);
      jobWaiterRegistry.cleanup(jobId);
    }
  }

  /**
   * Run Grok completion (worker or direct). Does not enqueue.
   */
  async executeCompletion(
    dto: CreateChatCompletionDto,
    ctx: ChatContext,
    res?: Response,
    options?: ExecuteCompletionOptions,
  ): Promise<OpenAiChatCompletion | void> {
    const settings = await settingsService.getAll();
    const features = await apiFeaturesService.get();
    const model = dto.model || settings.defaultModel;
    const stream = Boolean(dto.stream);
    // OTP sessions use synthetic ids — ChatRequest.apiKeyId requires a real key row
    const { toPersistentApiKeyId } = await import('../utils/api-key-id');
    const ownerApiKeyId = await toPersistentApiKeyId(ctx.apiKey.id);
    const includeReasoning = dto.include_reasoning !== false;
    const policy = await policyService.resolve(ctx.apiKey, dto.cwd);

    // Feature gates + Grok flag mapping (tools, vision, schema, effort, …)
    const hasRemoteImages = dto.messages.some((m) =>
      messageHasImageParts(m.content),
    );
    if (hasRemoteImages && features.vision) {
      dto.messages = await inlineRemoteImageUrls(dto.messages);
    }
    const builtReq = buildGrokRequestFromChatDto(dto, policy, features);

    const documentIds = [
      ...new Set((dto.document_ids ?? []).filter((id) => typeof id === 'string' && id)),
    ];

    // Materialize under policy.cwd/attachments so tools use relative paths only
    // (avoids absolute host paths in the prompt). Cleaned up after the request.
    const requestSlug = (ctx.requestId || createId()).replace(/[^a-zA-Z0-9_-]/g, '');
    const attachRel = path.join('attachments', requestSlug);
    const visionFiles = builtReq.visionFiles ?? [];
    const attachDir =
      documentIds.length > 0 || visionFiles.length > 0
        ? path.join(policy.cwd, attachRel)
        : '';

    let docContext = '';
    let materializedCount = 0;

    try {
      if (documentIds.length > 0) {
        await ensureDir(attachDir);
        // Use persistent owner id (same mapping as upload) so OTP session
        // synthetic ids can still attach documents they just uploaded.
        const built = await documentService.buildContextFromDocuments(
          ownerApiKeyId,
          documentIds,
          MAX_DOCUMENT_CONTEXT_CHARS,
          {
            materializeDir: attachDir,
            pathPrefix: attachRel,
          },
        );
        docContext = built.context;
        materializedCount = built.files.length;
        logger.info(
          {
            requestId: ctx.requestId,
            apiKeyId: ctx.apiKey.id,
            documentCount: documentIds.length,
            materializedCount,
            contextChars: docContext.length,
            attachDir: attachRel,
          },
          'Document context prepared for Grok CLI',
        );
      }

      if (visionFiles.length > 0) {
        await ensureDir(attachDir);
        for (const file of visionFiles) {
          await fs.writeFile(path.join(attachDir, file.filename), file.bytes, {
            mode: 0o600,
          });
        }
      }

      let prompt = builtReq.prompt;
      if (docContext) {
        prompt =
          `The user has attached the following documents for this request. ` +
          `Use their contents (and on-disk paths when tools allow) when answering.\n\n${docContext}\n\n` +
          prompt;
      }
      if (visionFiles.length > 0 && !builtReq.promptJson) {
        const listed = visionFiles
          .map((f) => `${attachRel}/${f.filename}`)
          .join(', ');
        prompt =
          `The user attached image file(s) at: ${listed}. Read those files when answering.\n\n` +
          prompt;
      }
      if (prompt.length > MAX_TOTAL_PROMPT_CHARS) {
        throw ExceptionFactory.validation(
          `Total prompt exceeds ${MAX_TOTAL_PROMPT_CHARS} characters`,
        );
      }

      const extra: Partial<GrokRunOptions> = { ...builtReq.extra };
      // Never pass raw client resume / OS-global --continue (cross-tenant).
      extra.continueSession = false;
      const sessionHint =
        dto.session_id?.trim() || extra.resumeSessionId || '';
      extra.resumeSessionId = undefined;
      extra.sessionId = extra.sessionId;
      extra.forkSession = Boolean(extra.forkSession && sessionHint);
      if (sessionHint) {
        const binding = await grokSessionMapService.resolve(
          ctx.apiKey.id,
          sessionHint,
        );
        if (binding.mode === 'resume') {
          extra.resumeSessionId = binding.grokSessionId;
          extra.sessionId = undefined;
        } else {
          extra.sessionId = binding.grokSessionId;
        }
      }

      const runBase = {
        prompt,
        model,
        stream: true as boolean,
        sessionId: extra.sessionId,
        apiKeyId: ctx.apiKey.id,
        toolsAllowlist: builtReq.toolsAllowlist,
        toolsDenylist: builtReq.toolsDenylist,
        promptJson: builtReq.promptJson,
        jsonSchema: builtReq.jsonSchema,
        extra,
      };

      // Queue worker already limits concurrency; direct mode still uses in-process slots
      const fromQueue = Boolean(options?.fromQueue);
      if (!fromQueue && !grokCliService.tryAcquire()) {
        throw ExceptionFactory.concurrencyLimit();
      }
      if (fromQueue) {
        // Soft acquire so stats still reflect load (best-effort)
        grokCliService.tryAcquire();
      }

      const chatRequestDbId = createId();
      const completionId = createChatCompletionId();
      const promptEnc = encryptionService.encrypt(prompt);
      const started = Date.now();

      await prisma.chatRequest.create({
        data: {
          id: chatRequestDbId,
          requestId: ctx.requestId,
          apiKeyId: ownerApiKeyId,
          model,
          stream,
          status: CHAT_STATUS.PENDING,
          promptCiphertext: toBytes(promptEnc.ciphertext),
          promptIv: toBytes(promptEnc.iv),
          promptTag: toBytes(promptEnc.tag),
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          policyMode: policy.mode,
          documents: {
            create: documentIds.map((documentId) => ({ documentId })),
          },
        },
      });

      try {
        // Stream only when we still have a live HTTP Response (client connected).
        // Queue workers often lose `res` after client disconnect, process restart,
        // or multi-instance reclaim — never DLQ those; complete offline instead.
        const canStreamToClient = Boolean(
          stream && res && !res.writableEnded && !res.destroyed,
        );
        if (stream && !canStreamToClient) {
          if (!options?.fromQueue && !res) {
            throw ExceptionFactory.internal('Streaming requires Response');
          }
          logger.warn(
            {
              requestId: ctx.requestId,
              jobId: options?.jobId,
              fromQueue: Boolean(options?.fromQueue),
              hasRes: Boolean(res),
              writableEnded: res?.writableEnded,
              destroyed: res?.destroyed,
            },
            'Stream completion without live Response — collecting offline',
          );
        }

        if (canStreamToClient && res) {
          await this.runStream({
            dto,
            ctx,
            res,
            model,
            policy,
            prompt,
            completionId,
            chatRequestDbId,
            started,
            includeReasoning,
            skipRoleChunk: Boolean(options?.sseAlreadyInit),
            jobId: options?.jobId,
            wireFormat: options?.wireFormat || 'openai',
            suppressQueueEvents: Boolean(options?.suppressQueueEvents),
            runOpts: policyToRunOpts(policy, runBase),
            usageEstimate: features.usageEstimate,
            estimatedPromptTokens: builtReq.estimatedPromptTokens,
          });
          return;
        }

        const collected = await this.collectFromGrokStream(
          policyToRunOpts(policy, runBase),
        );
        await this.rememberGrokSession(
          ctx.apiKey.id,
          dto.session_id,
          collected.sessionId,
        );

        const auditPayload = this.buildAuditPayload(collected, includeReasoning);
        const responseEnc = encryptionService.encrypt(auditPayload);
        const durationMs = Date.now() - started;

        await prisma.chatRequest.update({
          where: { id: chatRequestDbId },
          data: {
            status: CHAT_STATUS.SUCCESS,
            durationMs,
            grokSessionId: collected.sessionId ?? null,
            responseCiphertext: toBytes(responseEnc.ciphertext),
            responseIv: toBytes(responseEnc.iv),
            responseTag: toBytes(responseEnc.tag),
          },
        });

        await auditService.log({
          apiKeyId: ctx.apiKey.id,
          action: AUDIT_ACTIONS.CHAT_CREATE,
          resource: 'chat_request',
          resourceId: chatRequestDbId,
          meta: {
            requestId: ctx.requestId,
            model,
            stream: false,
            durationMs,
            documentCount: documentIds.length,
            includeReasoning,
            hasReasoning: collected.reasoning.length > 0,
            policyMode: policy.mode,
          },
          ip: ctx.ip,
        });

        const { usageToOpenAi, grokUsageToMetaCost } = await import(
          '../utils/grok-event-parse'
        );
        let usage = usageToOpenAi(collected.usage);
        let usageEstimated = false;
        if (
          !collected.usage &&
          features.usageEstimate
        ) {
          const outTok = estimateCompletionTokens(collected.text);
          usage = {
            prompt_tokens: builtReq.estimatedPromptTokens,
            completion_tokens: outTok,
            total_tokens: builtReq.estimatedPromptTokens + outTok,
          };
          usageEstimated = true;
        }
        const completion = mapGrokToChatCompletion(
          model,
          {
            text: collected.text,
            stopReason: collected.stopReason,
            sessionId: collected.sessionId,
            requestId: collected.requestId,
          },
          {
            completionId,
            reasoningContent: collected.reasoning || null,
            includeReasoning,
            usage,
            toolCalls: collected.toolCalls,
            grok: {
              sessionId: collected.sessionId,
              stopReason: collected.stopReason,
              requestId: collected.requestId,
              numTurns: collected.numTurns,
              cost: grokUsageToMetaCost(collected.usage),
            },
          },
        );
        if (usageEstimated) {
          (completion as { usage_estimated?: boolean }).usage_estimated = true;
        }
        return completion;
      } catch (err) {
        await this.markFailed(chatRequestDbId, started, err);
        throw err;
      } finally {
        grokCliService.release();
      }
    } finally {
      if (attachDir) {
        await rmSafe(attachDir);
      }
    }
  }

  private async rememberGrokSession(
    apiKeyId: string,
    clientSessionId: string | undefined,
    grokSessionId: string | undefined,
  ): Promise<void> {
    if (!clientSessionId?.trim() || !grokSessionId) return;
    try {
      await grokSessionMapService.remember(
        apiKeyId,
        clientSessionId,
        grokSessionId,
      );
    } catch (err) {
      logger.warn({ err, apiKeyId }, 'Failed to persist Grok session alias');
    }
  }

  private async collectFromGrokStream(
    options: GrokRunOptions,
  ): Promise<GrokCollectedOutput> {
    const textParts: string[] = [];
    const reasoningParts: string[] = [];
    const toolCalls: GrokToolCall[] = [];
    let sessionId: string | undefined;
    let stopReason: string | undefined;
    let requestId: string | undefined;
    let usage: GrokUsage | undefined;
    let numTurns: number | undefined;

    const { parseGrokUsage, parseGrokToolCallEvent } = await import(
      '../utils/grok-event-parse'
    );

    for await (const event of grokCliService.stream({ ...options, stream: true })) {
      if (event.type === 'thought' && typeof event.data === 'string') {
        reasoningParts.push(event.data);
      } else if (event.type === 'text' && typeof event.data === 'string') {
        textParts.push(event.data);
      } else if (event.type === 'end') {
        if (typeof event.stopReason === 'string') stopReason = event.stopReason;
        if (typeof event.sessionId === 'string') sessionId = event.sessionId;
        if (typeof event.requestId === 'string') requestId = event.requestId;
        if (event.usage) usage = parseGrokUsage(event.usage);
        if (typeof event.num_turns === 'number') numTurns = event.num_turns;
      } else {
        toolCalls.push(...parseGrokToolCallEvent(event));
      }
    }

    return {
      text: textParts.join(''),
      reasoning: reasoningParts.join(''),
      sessionId,
      stopReason,
      requestId,
      usage,
      numTurns,
      toolCalls: toolCalls.length ? toolCalls : undefined,
    };
  }

  private buildAuditPayload(
    collected: GrokCollectedOutput,
    includeReasoning: boolean,
  ): string {
    if (!includeReasoning || !collected.reasoning) {
      return collected.text;
    }
    return JSON.stringify({
      content: collected.text,
      reasoning_content: collected.reasoning,
    });
  }

  private async runStream(args: {
    dto: CreateChatCompletionDto;
    ctx: ChatContext;
    res: Response;
    model: string;
    policy: ResolvedPolicy;
    prompt: string;
    completionId: string;
    chatRequestDbId: string;
    started: number;
    includeReasoning: boolean;
    skipRoleChunk?: boolean;
    jobId?: string;
    wireFormat?: StreamWireFormat;
    suppressQueueEvents?: boolean;
    runOpts?: GrokRunOptions;
    usageEstimate?: boolean;
    estimatedPromptTokens?: number;
  }): Promise<void> {
    const {
      dto,
      ctx,
      res,
      model,
      policy,
      prompt,
      completionId,
      chatRequestDbId,
      started,
      includeReasoning,
      skipRoleChunk,
      jobId,
      wireFormat = 'openai',
      suppressQueueEvents = false,
      runOpts,
    } = args;
    const created = Math.floor(Date.now() / 1000);
    const textParts: string[] = [];
    const reasoningParts: string[] = [];
    const toolCalls: GrokToolCall[] = [];
    let grokSessionId: string | undefined;
    let stopReason: string | undefined;
    let grokRequestId: string | undefined;
    let streamUsage: GrokUsage | undefined;
    let clientClosed = false;

    const msgId = createMessageId();
    const respId = createResponseId();
    const outputItemId = `msg_${createId().replace(/-/g, '').slice(0, 20)}`;
    const {
      parseGrokUsage,
      parseGrokToolCallEvent,
      usageToOpenAi,
      grokUsageToMetaCost,
    } = await import('../utils/grok-event-parse');

    res.on('close', () => {
      clientClosed = true;
      if (jobId) void chatQueueService.requestCancel(jobId);
    });

    if (!res.headersSent) {
      initSse(res);
    }

    if (wireFormat === 'openai') {
      if (!skipRoleChunk) {
        writeSseData(res, mapRoleChunk(model, completionId, created));
      } else {
        writeSseData(res, mapRoleChunk(model, completionId, created));
        if (!suppressQueueEvents) {
          writeSseData(res, {
            object: 'gog.queue',
            status: 'running',
            job_id: jobId,
          });
        }
      }
    } else if (wireFormat === 'anthropic') {
      writeSseEvent(res, 'message_start', {
        type: 'message_start',
        message: {
          id: msgId,
          type: 'message',
          role: 'assistant',
          content: [],
          model,
          stop_reason: null,
          stop_sequence: null,
          usage: { input_tokens: 0, output_tokens: 0 },
        },
      });
      writeSseEvent(res, 'content_block_start', {
        type: 'content_block_start',
        index: 0,
        content_block: { type: 'text', text: '' },
      });
    } else if (wireFormat === 'responses') {
      writeSseEvent(res, 'response.created', {
        type: 'response.created',
        response: {
          id: respId,
          object: 'response',
          created_at: created,
          status: 'in_progress',
          model,
          output: [],
        },
      });
      writeSseEvent(res, 'response.output_item.added', {
        type: 'response.output_item.added',
        output_index: 0,
        item: {
          type: 'message',
          id: outputItemId,
          status: 'in_progress',
          role: 'assistant',
          content: [],
        },
      });
      writeSseEvent(res, 'response.content_part.added', {
        type: 'response.content_part.added',
        output_index: 0,
        content_index: 0,
        part: { type: 'output_text', text: '', annotations: [] },
      });
    }

    const streamOpts: GrokRunOptions =
      runOpts ||
      policyToRunOpts(policy, {
        prompt,
        model,
        stream: true,
        sessionId: dto.session_id,
        apiKeyId: ctx.apiKey.id,
      });

    try {
      for await (const event of grokCliService.stream(streamOpts)) {
        if (clientClosed) break;

        if (event.type === 'thought' && typeof event.data === 'string') {
          reasoningParts.push(event.data);
          if (includeReasoning && wireFormat === 'openai') {
            writeSseData(
              res,
              mapReasoningDeltaChunk(model, event.data, completionId, created, true),
            );
          }
        } else if (event.type === 'text' && typeof event.data === 'string') {
          textParts.push(event.data);
          if (wireFormat === 'openai') {
            writeSseData(
              res,
              mapTextDeltaChunk(model, event.data, completionId, created),
            );
          } else if (wireFormat === 'anthropic') {
            writeSseEvent(res, 'content_block_delta', {
              type: 'content_block_delta',
              index: 0,
              delta: { type: 'text_delta', text: event.data },
            });
          } else if (wireFormat === 'responses') {
            writeSseEvent(res, 'response.output_text.delta', {
              type: 'response.output_text.delta',
              output_index: 0,
              content_index: 0,
              delta: event.data,
            });
          }
        } else if (event.type === 'end') {
          if (typeof event.stopReason === 'string') stopReason = event.stopReason;
          if (typeof event.sessionId === 'string') grokSessionId = event.sessionId;
          if (typeof event.requestId === 'string') grokRequestId = event.requestId;
          if (event.usage) streamUsage = parseGrokUsage(event.usage);
        } else {
          const evType = String(event.type || '');
          if (
            wireFormat === 'openai' &&
            (evType === 'tool_call' ||
              evType === 'tool_call_update' ||
              evType === 'plan')
          ) {
            const rec = event as Record<string, unknown>;
            writeSseData(res, {
              id: completionId,
              object: 'chat.completion.chunk',
              created,
              model,
              choices: [{ index: 0, delta: {}, finish_reason: null }],
              grok_event: {
                type: evType,
                toolCallId:
                  typeof rec.toolCallId === 'string'
                    ? rec.toolCallId
                    : undefined,
                toolName:
                  typeof rec.toolName === 'string' ? rec.toolName : undefined,
                status: typeof rec.status === 'string' ? rec.status : undefined,
                kind: typeof rec.kind === 'string' ? rec.kind : undefined,
                title: typeof rec.title === 'string' ? rec.title : undefined,
                rawInput: rec.rawInput,
                entries: rec.entries,
              },
            });
          }
          const tcs = parseGrokToolCallEvent(event);
          if (tcs.length && wireFormat === 'openai') {
            for (let i = 0; i < tcs.length; i++) {
              const tc = tcs[i]!;
              toolCalls.push(tc);
              writeSseData(res, {
                id: completionId,
                object: 'chat.completion.chunk',
                created,
                model,
                choices: [
                  {
                    index: 0,
                    delta: {
                      tool_calls: [
                        {
                          index: toolCalls.length - 1,
                          id: tc.id,
                          type: 'function',
                          function: {
                            name: tc.function.name,
                            arguments: tc.function.arguments,
                          },
                        },
                      ],
                    },
                    finish_reason: null,
                  },
                ],
              });
            }
          } else {
            toolCalls.push(...tcs);
          }
        }
      }

      if (!clientClosed) {
        if (wireFormat === 'openai') {
          const grokMeta: GrokResponseMeta = {
            sessionId: grokSessionId,
            stopReason,
            requestId: grokRequestId,
            cost: grokUsageToMetaCost(streamUsage),
          };
          const finishChunk = mapFinishChunk(
            model,
            completionId,
            created,
            toolCalls.length && !textParts.join('').trim()
              ? 'tool_calls'
              : stopReason,
            grokMeta,
          );
          if (streamUsage || args.usageEstimate) {
            finishChunk.usage = streamUsage
              ? usageToOpenAi(streamUsage)
              : {
                  prompt_tokens: args.estimatedPromptTokens || 0,
                  completion_tokens: estimateCompletionTokens(
                    textParts.join(''),
                  ),
                  total_tokens:
                    (args.estimatedPromptTokens || 0) +
                    estimateCompletionTokens(textParts.join('')),
                };
          }
          writeSseData(res, finishChunk);
          writeSseDone(res);
        } else if (wireFormat === 'anthropic') {
          writeSseEvent(res, 'content_block_stop', {
            type: 'content_block_stop',
            index: 0,
          });
          // Emit tool_use content blocks when Grok surfaced tool calls
          let blockIndex = 1;
          for (const tc of toolCalls) {
            let input: Record<string, unknown> = {};
            try {
              input = JSON.parse(tc.function.arguments || '{}') as Record<
                string,
                unknown
              >;
            } catch {
              input = { raw: tc.function.arguments };
            }
            writeSseEvent(res, 'content_block_start', {
              type: 'content_block_start',
              index: blockIndex,
              content_block: {
                type: 'tool_use',
                id: tc.id,
                name: tc.function.name,
                input: {},
              },
            });
            writeSseEvent(res, 'content_block_delta', {
              type: 'content_block_delta',
              index: blockIndex,
              delta: {
                type: 'input_json_delta',
                partial_json: tc.function.arguments || '{}',
              },
            });
            writeSseEvent(res, 'content_block_stop', {
              type: 'content_block_stop',
              index: blockIndex,
            });
            void input;
            blockIndex += 1;
          }
          const anthropicStop =
            toolCalls.length && !textParts.join('').trim()
              ? 'tool_use'
              : mapAnthropicStopReason(stopReason);
          writeSseEvent(res, 'message_delta', {
            type: 'message_delta',
            delta: {
              stop_reason: anthropicStop,
              stop_sequence: null,
            },
            usage: {
              output_tokens: estimateCompletionTokens(textParts.join('')),
            },
          });
          writeSseEvent(res, 'message_stop', { type: 'message_stop' });
        } else if (wireFormat === 'responses') {
          const fullText = textParts.join('');
          writeSseEvent(res, 'response.output_text.done', {
            type: 'response.output_text.done',
            output_index: 0,
            content_index: 0,
            text: fullText,
          });
          writeSseEvent(res, 'response.content_part.done', {
            type: 'response.content_part.done',
            output_index: 0,
            content_index: 0,
            part: { type: 'output_text', text: fullText, annotations: [] },
          });
          writeSseEvent(res, 'response.output_item.done', {
            type: 'response.output_item.done',
            output_index: 0,
            item: {
              type: 'message',
              id: outputItemId,
              status: 'completed',
              role: 'assistant',
              content: [
                { type: 'output_text', text: fullText, annotations: [] },
              ],
            },
          });
          writeSseEvent(res, 'response.completed', {
            type: 'response.completed',
            response: {
              id: respId,
              object: 'response',
              created_at: created,
              status: 'completed',
              model,
              output: [
                {
                  type: 'message',
                  id: outputItemId,
                  status: 'completed',
                  role: 'assistant',
                  content: [
                    { type: 'output_text', text: fullText, annotations: [] },
                  ],
                },
              ],
              usage: {
                input_tokens: 0,
                output_tokens: 0,
                total_tokens: 0,
              },
            },
          });
        }
        res.end();
      }

      const collected: GrokCollectedOutput = {
        text: textParts.join(''),
        reasoning: reasoningParts.join(''),
        sessionId: grokSessionId,
        stopReason,
        requestId: grokRequestId,
      };
      await this.rememberGrokSession(ctx.apiKey.id, dto.session_id, grokSessionId);
      const auditPayload = this.buildAuditPayload(collected, includeReasoning);
      const responseEnc = encryptionService.encrypt(auditPayload);
      const durationMs = Date.now() - started;

      await prisma.chatRequest.update({
        where: { id: chatRequestDbId },
        data: {
          status: clientClosed ? CHAT_STATUS.CANCELLED : CHAT_STATUS.SUCCESS,
          durationMs,
          grokSessionId: grokSessionId ?? null,
          responseCiphertext: toBytes(responseEnc.ciphertext),
          responseIv: toBytes(responseEnc.iv),
          responseTag: toBytes(responseEnc.tag),
          errorMessage: clientClosed ? 'Client disconnected' : null,
        },
      });

      await auditService.log({
        apiKeyId: ctx.apiKey.id,
        action: AUDIT_ACTIONS.CHAT_CREATE,
        resource: 'chat_request',
        resourceId: chatRequestDbId,
        meta: {
          requestId: ctx.requestId,
          model,
          stream: true,
          durationMs,
          documentCount: (dto.document_ids ?? []).length,
          includeReasoning,
          hasReasoning: reasoningParts.length > 0,
          policyMode: policy.mode,
          cancelled: clientClosed,
        },
        ip: ctx.ip,
      });
    } catch (err) {
      if (!clientClosed && !res.writableEnded) {
        const message = err instanceof Error ? err.message : 'Stream error';
        writeSseData(res, {
          error: {
            message,
            type: 'server_error',
            code: err instanceof HttpException ? err.code : 'internal_error',
          },
        });
        writeSseDone(res);
        res.end();
      }
      throw err;
    }
  }

  private async markFailed(
    chatRequestDbId: string,
    started: number,
    err: unknown,
  ): Promise<void> {
    const durationMs = Date.now() - started;
    const message = err instanceof Error ? err.message : 'Unknown error';
    const isTimeout = err instanceof HttpException && err.code === 'grok_timeout';

    try {
      await prisma.chatRequest.update({
        where: { id: chatRequestDbId },
        data: {
          status: isTimeout ? CHAT_STATUS.TIMEOUT : CHAT_STATUS.ERROR,
          durationMs,
          errorMessage: message.slice(0, 4000),
        },
      });
    } catch (updateErr) {
      logger.error({ updateErr }, 'Failed to mark chat request as failed');
    }
  }
}

export const chatService = new ChatService();
