import type { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { ExceptionFactory } from '../exceptions/exception.factory';
import type {
  ConversationListQueryDto,
  ConversationMessage,
  CreateConversationDto,
  UpdateConversationDto,
} from '../dto/conversation.dto';
import { toBytes } from '../utils/prisma-bytes';
import {
  isSyntheticApiKeyId,
  toPersistentApiKeyId,
} from '../utils/api-key-id';
import { encryptionService } from './encryption.service';

const PREVIEW_MAX = 80;
const MESSAGES_VERSION = 1;

function truncatePreview(text: string, max = PREVIEW_MAX): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}

function firstUserPreview(messages: ConversationMessage[]): string {
  const user = messages.find((m) => m.role === 'user' && m.content?.trim());
  return user ? truncatePreview(user.content) : '';
}

function encryptMessages(messages: ConversationMessage[]) {
  const payload = JSON.stringify({ version: MESSAGES_VERSION, messages });
  return encryptionService.encrypt(payload);
}

function decryptMessages(
  ciphertext: Buffer | Uint8Array,
  iv: Buffer | Uint8Array,
  tag: Buffer | Uint8Array,
): ConversationMessage[] {
  try {
    const raw = encryptionService.decryptToString({
      ciphertext: Buffer.from(ciphertext),
      iv: Buffer.from(iv),
      tag: Buffer.from(tag),
    });
    const parsed = JSON.parse(raw) as {
      version?: number;
      messages?: ConversationMessage[];
    };
    if (!Array.isArray(parsed.messages)) return [];
    return parsed.messages.map((m) => ({
      role: String(m.role || 'user'),
      content: typeof m.content === 'string' ? m.content : '',
      reasoning: typeof m.reasoning === 'string' ? m.reasoning : undefined,
      docs: Array.isArray(m.docs) ? m.docs : undefined,
      error: m.error === true ? true : undefined,
      compressed: m.compressed === true ? true : undefined,
    }));
  } catch {
    throw ExceptionFactory.internal('Failed to decrypt conversation messages');
  }
}

function listItem(row: {
  id: string;
  title: string;
  preview: string;
  model: string | null;
  messageCount: number;
  apiKeyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    model: row.model,
    messageCount: row.messageCount,
    apiKeyId: row.apiKeyId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function normalizeContextMode(raw: string | null | undefined): 'full' | 'summary' | 'recent' {
  if (raw === 'summary' || raw === 'recent') return raw;
  return 'full';
}

export class ConversationService {
  async list(query: ConversationListQueryDto) {
    const limit = Math.min(query.limit ?? 20, 50);
    const offset = query.offset ?? 0;
    const where: Prisma.ChatConversationWhereInput = {};

    if (query.apiKeyId) where.apiKeyId = query.apiKeyId;

    const q = query.q?.trim();
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { preview: { contains: q } },
        { model: { contains: q } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.chatConversation.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          preview: true,
          model: true,
          messageCount: true,
          apiKeyId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.chatConversation.count({ where }),
    ]);

    return {
      data: rows.map(listItem),
      total,
      limit,
      offset,
    };
  }

  async getById(id: string) {
    const row = await prisma.chatConversation.findUnique({ where: { id } });
    if (!row) throw ExceptionFactory.notFound('Conversation');

    let messages = decryptMessages(
      row.messagesCiphertext,
      row.messagesIv,
      row.messagesTag,
    );

    // Legacy: extract compressed bubbles into summary if needed
    let summaryText = row.summaryText || '';
    let summaryAt = row.summaryAt;
    let summarySourceCount = row.summarySourceCount ?? 0;
    const legacyCompressed = messages.filter((m) => m.compressed);
    if (!summaryText && legacyCompressed.length) {
      summaryText = legacyCompressed
        .map((m) =>
          (m.content || '')
            .replace(/^【對話摘要】\s*/u, '')
            .replace(/^\[Conversation summary\]\s*/i, '')
            .trim(),
        )
        .filter(Boolean)
        .join('\n\n');
      summaryAt = summaryAt ?? row.updatedAt;
      summarySourceCount = summarySourceCount || messages.length;
    }
    // Drop legacy compressed bubbles from display history
    messages = messages.filter((m) => !m.compressed);

    return {
      id: row.id,
      title: row.title,
      preview: row.preview,
      model: row.model,
      systemPrompt: row.systemPrompt,
      apiKeyId: row.apiKeyId,
      messageCount: messages.length,
      messages,
      contextMode: normalizeContextMode(row.contextMode),
      contextRecentN: row.contextRecentN ?? 6,
      summaryText,
      summaryAt: summaryAt ? summaryAt.toISOString() : null,
      summarySourceCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async create(dto: CreateConversationDto) {
    const messages = (dto.messages ?? []).filter((m) => !m.compressed);
    const enc = encryptMessages(messages);
    const preview = firstUserPreview(messages);

    // Nullable FK — never store OTP session synthetic ids
    let apiKeyId: string | null = null;
    if (dto.apiKeyId && !isSyntheticApiKeyId(dto.apiKeyId)) {
      apiKeyId = dto.apiKeyId;
    } else if (dto.apiKeyId && isSyntheticApiKeyId(dto.apiKeyId)) {
      try {
        apiKeyId = await toPersistentApiKeyId(dto.apiKeyId);
      } catch {
        apiKeyId = null;
      }
    }

    const row = await prisma.chatConversation.create({
      data: {
        title: (dto.title ?? '').trim(),
        model: dto.model ?? null,
        systemPrompt: dto.systemPrompt ?? '',
        apiKeyId,
        messagesCiphertext: toBytes(enc.ciphertext),
        messagesIv: toBytes(enc.iv),
        messagesTag: toBytes(enc.tag),
        messageCount: messages.length,
        preview,
        contextMode: dto.contextMode ?? 'full',
        contextRecentN: dto.contextRecentN ?? 6,
        summaryText: dto.summaryText ?? '',
        summaryAt: dto.summaryAt ? new Date(dto.summaryAt) : null,
        summarySourceCount: dto.summarySourceCount ?? 0,
      },
    });

    return this.getById(row.id);
  }

  async update(id: string, dto: UpdateConversationDto) {
    const existing = await prisma.chatConversation.findUnique({ where: { id } });
    if (!existing) throw ExceptionFactory.notFound('Conversation');

    const data: Prisma.ChatConversationUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }
    if (dto.model !== undefined) {
      data.model = dto.model;
    }
    if (dto.systemPrompt !== undefined) {
      data.systemPrompt = dto.systemPrompt;
    }
    if (dto.apiKeyId !== undefined) {
      if (!dto.apiKeyId || isSyntheticApiKeyId(dto.apiKeyId)) {
        try {
          const id = dto.apiKeyId
            ? await toPersistentApiKeyId(dto.apiKeyId)
            : null;
          data.apiKey = id ? { connect: { id } } : { disconnect: true };
        } catch {
          data.apiKey = { disconnect: true };
        }
      } else {
        data.apiKey = { connect: { id: dto.apiKeyId } };
      }
    }
    if (dto.messages !== undefined) {
      const cleaned = dto.messages.filter((m) => !m.compressed);
      const enc = encryptMessages(cleaned);
      data.messagesCiphertext = toBytes(enc.ciphertext);
      data.messagesIv = toBytes(enc.iv);
      data.messagesTag = toBytes(enc.tag);
      data.messageCount = cleaned.length;
      data.preview = firstUserPreview(cleaned);
    }
    if (dto.contextMode !== undefined) {
      data.contextMode = dto.contextMode;
    }
    if (dto.contextRecentN !== undefined) {
      data.contextRecentN = dto.contextRecentN;
    }
    if (dto.summaryText !== undefined) {
      data.summaryText = dto.summaryText;
    }
    if (dto.summaryAt !== undefined) {
      data.summaryAt = dto.summaryAt ? new Date(dto.summaryAt) : null;
    }
    if (dto.summarySourceCount !== undefined) {
      data.summarySourceCount = dto.summarySourceCount;
    }

    await prisma.chatConversation.update({ where: { id }, data });
    return this.getById(id);
  }

  async remove(id: string) {
    const existing = await prisma.chatConversation.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw ExceptionFactory.notFound('Conversation');
    await prisma.chatConversation.delete({ where: { id } });
    return { id };
  }
}

export const conversationService = new ConversationService();
