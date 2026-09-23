import { prisma } from '../config/database';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { createId } from '../utils/id';
import { toPersistentApiKeyId } from '../utils/api-key-id';
import { chatService } from './chat.service';
import type { AuthenticatedApiKey } from '../interfaces';
import { apiFeaturesService } from './api-features.service';

function publicAssistant(row: {
  id: string;
  name: string;
  model: string | null;
  instructions: string;
  toolsJson: string;
  metadataJson: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  let tools: unknown[] = [];
  try {
    tools = JSON.parse(row.toolsJson || '[]') as unknown[];
  } catch {
    tools = [];
  }
  let metadata: Record<string, string> | null = null;
  try {
    metadata = row.metadataJson
      ? (JSON.parse(row.metadataJson) as Record<string, string>)
      : null;
  } catch {
    metadata = null;
  }
  return {
    id: row.id,
    object: 'assistant' as const,
    created_at: Math.floor(row.createdAt.getTime() / 1000),
    name: row.name || null,
    description: null,
    model: row.model || 'grok-4.6',
    instructions: row.instructions || null,
    tools,
    metadata,
  };
}

export class AssistantsService {
  private async owner(apiKeyId: string) {
    return toPersistentApiKeyId(apiKeyId);
  }

  private async assertEnabled() {
    await apiFeaturesService.assertEnabled(
      'assistantsEmulation',
      'Assistants-lite is disabled. Enable Admin → API features → assistantsEmulation.',
    );
  }

  async createAssistant(
    apiKeyId: string,
    body: {
      name?: string;
      model?: string;
      instructions?: string;
      tools?: unknown[];
      metadata?: Record<string, string>;
    },
  ) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const row = await prisma.assistant.create({
      data: {
        id: createId(),
        apiKeyId: owner,
        name: body.name || '',
        model: body.model || null,
        instructions: body.instructions || '',
        toolsJson: JSON.stringify(body.tools || []),
        metadataJson: body.metadata ? JSON.stringify(body.metadata) : null,
      },
    });
    return publicAssistant(row);
  }

  async getAssistant(apiKeyId: string, id: string) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const row = await prisma.assistant.findFirst({
      where: { id, apiKeyId: owner },
    });
    if (!row) throw ExceptionFactory.notFound('Assistant');
    return publicAssistant(row);
  }

  async listAssistants(apiKeyId: string, limit = 20) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const rows = await prisma.assistant.findMany({
      where: { apiKeyId: owner },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });
    return {
      object: 'list' as const,
      data: rows.map(publicAssistant),
      first_id: rows[0]?.id ?? null,
      last_id: rows[rows.length - 1]?.id ?? null,
      has_more: false,
    };
  }

  async deleteAssistant(apiKeyId: string, id: string) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const r = await prisma.assistant.deleteMany({
      where: { id, apiKeyId: owner },
    });
    if (r.count === 0) throw ExceptionFactory.notFound('Assistant');
    return { id, object: 'assistant.deleted' as const, deleted: true };
  }

  async createThread(
    apiKeyId: string,
    body?: {
      assistant_id?: string;
      messages?: Array<{ role: string; content: string }>;
      metadata?: Record<string, string>;
    },
  ) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const id = createId();
    const thread = await prisma.assistantThread.create({
      data: {
        id,
        apiKeyId: owner,
        assistantId: body?.assistant_id || null,
        metadataJson: body?.metadata ? JSON.stringify(body.metadata) : null,
      },
    });
    if (body?.messages?.length) {
      for (const m of body.messages) {
        await prisma.assistantMessage.create({
          data: {
            id: createId(),
            threadId: thread.id,
            role: m.role,
            content: m.content,
          },
        });
      }
    }
    return {
      id: thread.id,
      object: 'thread' as const,
      created_at: Math.floor(thread.createdAt.getTime() / 1000),
      metadata: body?.metadata || null,
    };
  }

  async getThread(apiKeyId: string, id: string) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const row = await prisma.assistantThread.findFirst({
      where: { id, apiKeyId: owner },
    });
    if (!row) throw ExceptionFactory.notFound('Thread');
    let metadata = null;
    try {
      metadata = row.metadataJson ? JSON.parse(row.metadataJson) : null;
    } catch {
      metadata = null;
    }
    return {
      id: row.id,
      object: 'thread' as const,
      created_at: Math.floor(row.createdAt.getTime() / 1000),
      metadata,
    };
  }

  async addMessage(
    apiKeyId: string,
    threadId: string,
    body: { role: string; content: string },
  ) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const thread = await prisma.assistantThread.findFirst({
      where: { id: threadId, apiKeyId: owner },
    });
    if (!thread) throw ExceptionFactory.notFound('Thread');
    const msg = await prisma.assistantMessage.create({
      data: {
        id: createId(),
        threadId,
        role: body.role || 'user',
        content: body.content || '',
      },
    });
    return {
      id: msg.id,
      object: 'thread.message' as const,
      created_at: Math.floor(msg.createdAt.getTime() / 1000),
      thread_id: threadId,
      role: msg.role,
      content: [
        { type: 'text', text: { value: msg.content, annotations: [] } },
      ],
    };
  }

  async listMessages(apiKeyId: string, threadId: string, limit = 50) {
    await this.assertEnabled();
    const owner = await this.owner(apiKeyId);
    const thread = await prisma.assistantThread.findFirst({
      where: { id: threadId, apiKeyId: owner },
    });
    if (!thread) throw ExceptionFactory.notFound('Thread');
    const rows = await prisma.assistantMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
      take: Math.min(limit, 200),
    });
    return {
      object: 'list' as const,
      data: rows.map((m) => ({
        id: m.id,
        object: 'thread.message' as const,
        created_at: Math.floor(m.createdAt.getTime() / 1000),
        thread_id: threadId,
        role: m.role,
        content: [
          { type: 'text', text: { value: m.content, annotations: [] } },
        ],
      })),
      first_id: rows[0]?.id ?? null,
      last_id: rows[rows.length - 1]?.id ?? null,
      has_more: false,
    };
  }

  /**
   * Create + execute a run synchronously (Assistants-lite).
   * Maps thread messages → chat completion via Grok.
   */
  async createAndRun(
    apiKey: AuthenticatedApiKey,
    threadId: string,
    body: { assistant_id?: string; model?: string; instructions?: string },
    requestId: string,
    ip?: string,
  ) {
    await this.assertEnabled();
    const owner = await this.owner(apiKey.id);
    const thread = await prisma.assistantThread.findFirst({
      where: { id: threadId, apiKeyId: owner },
    });
    if (!thread) throw ExceptionFactory.notFound('Thread');

    let assistant = null as Awaited<
      ReturnType<typeof prisma.assistant.findFirst>
    >;
    const assistantId = body.assistant_id || thread.assistantId;
    if (assistantId) {
      assistant = await prisma.assistant.findFirst({
        where: { id: assistantId, apiKeyId: owner },
      });
    }

    const msgs = await prisma.assistantMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });

    const instructions =
      body.instructions || assistant?.instructions || '';
    const model = body.model || assistant?.model || undefined;

    const chatMessages: Array<{ role: string; content: string }> = [];
    if (instructions.trim()) {
      chatMessages.push({ role: 'system', content: instructions });
    }
    for (const m of msgs) {
      chatMessages.push({ role: m.role, content: m.content });
    }
    if (!chatMessages.some((m) => m.role === 'user')) {
      throw ExceptionFactory.validation('Thread has no user messages to run');
    }

    const runId = createId();
    await prisma.assistantRun.create({
      data: {
        id: runId,
        threadId,
        assistantId: assistantId || null,
        status: 'in_progress',
        model: model || null,
      },
    });

    try {
      let tools: unknown[] | undefined;
      try {
        tools = assistant?.toolsJson
          ? (JSON.parse(assistant.toolsJson) as unknown[])
          : undefined;
      } catch {
        tools = undefined;
      }

      const result = await chatService.createCompletion(
        {
          model,
          messages: chatMessages,
          stream: false,
          include_reasoning: true,
          session_id: thread.grokSessionId || undefined,
          tools: tools?.length ? tools : undefined,
        },
        {
          apiKey,
          requestId,
          ip,
        },
        undefined,
        { source: 'v1' },
      );

      const text =
        result && 'choices' in result
          ? result.choices?.[0]?.message?.content || ''
          : '';
      const sessionId =
        result && 'grok' in result
          ? (result as { grok?: { sessionId?: string } }).grok?.sessionId
          : undefined;

      await prisma.assistantMessage.create({
        data: {
          id: createId(),
          threadId,
          role: 'assistant',
          content: text,
        },
      });

      if (sessionId) {
        await prisma.assistantThread.update({
          where: { id: threadId },
          data: { grokSessionId: sessionId },
        });
      }

      await prisma.assistantRun.update({
        where: { id: runId },
        data: {
          status: 'completed',
          resultJson: JSON.stringify(result || {}),
          completedAt: new Date(),
        },
      });

      return {
        id: runId,
        object: 'thread.run' as const,
        created_at: Math.floor(Date.now() / 1000),
        thread_id: threadId,
        assistant_id: assistantId || null,
        status: 'completed',
        model: model || null,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await prisma.assistantRun.update({
        where: { id: runId },
        data: {
          status: 'failed',
          errorMessage: message.slice(0, 2000),
          completedAt: new Date(),
        },
      });
      throw err;
    }
  }
}

export const assistantsService = new AssistantsService();
