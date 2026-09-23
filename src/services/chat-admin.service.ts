import type { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AUDIT_ACTIONS } from '../config/constants';
import { ExceptionFactory } from '../exceptions/exception.factory';
import type { ChatListQuery } from '../interfaces/chat-list-query.interface';
import { resolveScalarOrderBy } from '../utils/list-sort';
import { encryptionService } from './encryption.service';
import { auditService } from './audit.service';

const CHAT_SORT_FIELDS = [
  'createdAt',
  'status',
  'model',
  'durationMs',
] as const;


function decryptField(
  ciphertext: Buffer | Uint8Array | null | undefined,
  iv: Buffer | Uint8Array | null | undefined,
  tag: Buffer | Uint8Array | null | undefined,
): string | null {
  if (!ciphertext || !iv || !tag) return null;
  try {
    return encryptionService.decryptToString({
      ciphertext: Buffer.from(ciphertext),
      iv: Buffer.from(iv),
      tag: Buffer.from(tag),
    });
  } catch {
    return '[decrypt_failed]';
  }
}

export function parseStoredResponse(raw: string | null): {
  content: string | null;
  reasoning_content: string | null;
  raw: string | null;
} {
  if (raw == null) {
    return { content: null, reasoning_content: null, raw: null };
  }
  try {
    const parsed = JSON.parse(raw) as {
      content?: string;
      reasoning_content?: string;
    };
    if (
      parsed &&
      typeof parsed === 'object' &&
      ('content' in parsed || 'reasoning_content' in parsed)
    ) {
      return {
        content: parsed.content ?? '',
        reasoning_content: parsed.reasoning_content ?? null,
        raw,
      };
    }
  } catch {
    /* plain text */
  }
  return { content: raw, reasoning_content: null, raw };
}

function parseBool(v: boolean | string | undefined): boolean | undefined {
  if (v === undefined || v === '') return undefined;
  if (typeof v === 'boolean') return v;
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return undefined;
}

export class ChatAdminService {
  async list(query: ChatListQuery) {
    const limit = Math.min(query.limit ?? 50, 200);
    const offset = query.offset ?? 0;

    const where: Prisma.ChatRequestWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.apiKeyId) where.apiKeyId = query.apiKeyId;
    if (query.model) where.model = query.model;
    if (query.policyMode) where.policyMode = query.policyMode;

    const createdAt: Prisma.DateTimeFilter = {};
    if (query.from) {
      const d = new Date(query.from);
      if (!Number.isNaN(d.getTime())) createdAt.gte = d;
    }
    if (query.to) {
      const d = new Date(query.to);
      if (!Number.isNaN(d.getTime())) createdAt.lte = d;
    }
    if (Object.keys(createdAt).length > 0) {
      where.createdAt = createdAt;
    }

    const hasDocs = parseBool(query.hasDocuments);
    if (hasDocs === true) {
      where.documents = { some: {} };
    } else if (hasDocs === false) {
      where.documents = { none: {} };
    }

    const q = query.q?.trim();
    if (q) {
      where.OR = [
        { requestId: { contains: q } },
        { model: { contains: q } },
        { errorMessage: { contains: q } },
        { apiKey: { name: { contains: q } } },
        { apiKey: { keyPrefix: { contains: q } } },
      ];
    }

    const orderBy = resolveScalarOrderBy(
      query.sortBy,
      query.sortDir,
      CHAT_SORT_FIELDS,
      'createdAt',
    ) as Prisma.ChatRequestOrderByWithRelationInput;

    const [rows, total] = await Promise.all([
      prisma.chatRequest.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          apiKey: { select: { id: true, name: true, keyPrefix: true, mode: true } },
          documents: {
            include: {
              document: {
                select: {
                  id: true,
                  originalName: true,
                  mimeType: true,
                  sizeBytes: true,
                },
              },
            },
          },
          _count: { select: { documents: true } },
        },
      }),
      prisma.chatRequest.count({ where }),
    ]);

    const items = rows.map((r) => {
      const prompt = decryptField(r.promptCiphertext, r.promptIv, r.promptTag) ?? '';
      const responseRaw = decryptField(
        r.responseCiphertext,
        r.responseIv,
        r.responseTag,
      );
      const parsed = parseStoredResponse(responseRaw);
      const docs = r.documents.map((d) => d.document);
      return {
        id: r.id,
        requestId: r.requestId,
        model: r.model,
        stream: r.stream,
        status: r.status,
        durationMs: r.durationMs,
        policyMode: r.policyMode,
        errorMessage: r.errorMessage,
        ip: r.ip,
        createdAt: r.createdAt,
        apiKey: r.apiKey,
        promptPreview: prompt.slice(0, 200),
        contentPreview: (parsed.content ?? '').slice(0, 200),
        hasReasoning: Boolean(parsed.reasoning_content),
        documentCount: r._count.documents,
        documents: docs,
      };
    });

    return { items, total, limit, offset };
  }

  async getDetail(id: string, actorApiKeyId: string, ip?: string) {
    const r = await prisma.chatRequest.findUnique({
      where: { id },
      include: {
        apiKey: {
          select: { id: true, name: true, keyPrefix: true, mode: true, role: true },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
              },
            },
          },
        },
      },
    });
    if (!r) {
      throw ExceptionFactory.notFound('Chat request');
    }

    const prompt = decryptField(r.promptCiphertext, r.promptIv, r.promptTag) ?? '';
    const responseRaw = decryptField(
      r.responseCiphertext,
      r.responseIv,
      r.responseTag,
    );
    const parsed = parseStoredResponse(responseRaw);

    await auditService.log({
      apiKeyId: actorApiKeyId,
      action: AUDIT_ACTIONS.CHAT_ADMIN_VIEW,
      resource: 'chat_request',
      resourceId: id,
      meta: { requestId: r.requestId },
      ip,
    });

    return {
      id: r.id,
      requestId: r.requestId,
      model: r.model,
      stream: r.stream,
      status: r.status,
      durationMs: r.durationMs,
      grokSessionId: r.grokSessionId,
      policyMode: r.policyMode,
      errorMessage: r.errorMessage,
      ip: r.ip,
      userAgent: r.userAgent,
      createdAt: r.createdAt,
      apiKey: r.apiKey,
      documents: r.documents.map((d) => d.document),
      prompt,
      response: {
        content: parsed.content,
        reasoning_content: parsed.reasoning_content,
        raw: parsed.raw,
      },
    };
  }
}

export const chatAdminService = new ChatAdminService();
