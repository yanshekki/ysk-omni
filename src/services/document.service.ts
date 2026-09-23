import { execFile } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { prisma } from '../config/database';
import {
  AUDIT_ACTIONS,
  ROLES,
  STORAGE_TYPES,
  isImageMime,
  isTextualMime,
} from '../config/constants';
import { env } from '../config/env';
import type { DocumentPublicEntity } from '../entities/document-public.entity';
import type { DocumentContextResult } from '../interfaces/document-context-result.interface';
import type { MaterializedDocument } from '../interfaces/materialized-document.interface';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { createId } from '../utils/id';
import { logger } from '../utils/logger';
import { assertSafeUpload } from '../utils/file-sniff';
import {
  ensureRelativeStoragePath,
  sanitizeFilename,
} from '../utils/path-safe';
import { auditService } from './audit.service';
import { toPrismaBytes } from '../utils/prisma-bytes';
import {
  isSyntheticApiKeyId,
  toPersistentApiKeyId,
} from '../utils/api-key-id';
import { encryptionService } from './encryption.service';

const execFileAsync = promisify(execFile);


export class DocumentService {
  async ensureStorageDir(): Promise<void> {
    await fs.mkdir(env.storageDir, { recursive: true });
  }

  async upload(input: {
    apiKeyId: string;
    originalName: string;
    mimeType: string;
    buffer: Buffer;
    ip?: string;
  }): Promise<DocumentPublicEntity> {
    if (input.buffer.length > env.UPLOAD_MAX_BYTES) {
      throw ExceptionFactory.documentTooLarge(env.UPLOAD_MAX_BYTES);
    }

    // OTP admin sessions use synthetic ids — map to a real api_keys row for FK
    const apiKeyId = await toPersistentApiKeyId(input.apiKeyId);

    const { originalName, mimeType: mime } = assertSafeUpload({
      originalName: input.originalName,
      mimeType: input.mimeType,
      buffer: input.buffer,
    });

    const checksumSha256 = createHash('sha256').update(input.buffer).digest('hex');
    const encrypted = encryptionService.encrypt(input.buffer);
    const id = createId();
    const useFilesystem = input.buffer.length > env.DOCUMENT_DB_MAX_BYTES;

    let storagePath: string | null = null;
    // any: Prisma Bytes vs Node Buffer typing (TS 5.x ArrayBufferLike mismatch)
    let contentCiphertext: any = null;
    let contentIv: any = null;
    let contentTag: any = null;
    let storageType: string = STORAGE_TYPES.DB;

    if (useFilesystem) {
      await this.ensureStorageDir();
      const rel = ensureRelativeStoragePath(id);
      const fullPath = path.join(env.storageDir, `${rel}.enc`);
      // Store iv + tag + ciphertext together
      const packed = Buffer.concat([
        Buffer.from([encrypted.iv.length]),
        encrypted.iv,
        Buffer.from([encrypted.tag.length]),
        encrypted.tag,
        encrypted.ciphertext,
      ]);
      await fs.writeFile(fullPath, packed, { mode: 0o600 });
      storagePath = `${rel}.enc`;
      storageType = STORAGE_TYPES.FILESYSTEM;
    } else {
      contentCiphertext = toPrismaBytes(encrypted.ciphertext);
      contentIv = toPrismaBytes(encrypted.iv);
      contentTag = toPrismaBytes(encrypted.tag);
    }

    const created = await prisma.document.create({
      data: {
        id,
        apiKeyId,
        originalName,
        mimeType: mime,
        sizeBytes: input.buffer.length,
        storageType,
        contentCiphertext,
        contentIv,
        contentTag,
        storagePath,
        checksumSha256,
      },
    });

    await auditService.log({
      apiKeyId,
      action: AUDIT_ACTIONS.DOCUMENT_UPLOAD,
      resource: 'document',
      resourceId: created.id,
      meta: {
        originalName,
        mimeType: mime,
        sizeBytes: input.buffer.length,
        storageType,
      },
      ip: input.ip,
    });

    return this.toPublic(created);
  }

  /**
   * Resolve ownership id for Document.apiKeyId (required FK).
   * OTP sessions use synthetic ids — map to a real admin/key row so upload
   * and later getOwned/chat attachment paths agree.
   */
  private async ownerId(apiKeyId: string): Promise<string> {
    return toPersistentApiKeyId(apiKeyId);
  }

  async list(
    apiKeyId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ items: DocumentPublicEntity[]; total: number }> {
    const owner = await this.ownerId(apiKeyId);
    const where = { apiKeyId: owner, deletedAt: null };
    const [rows, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.document.count({ where }),
    ]);
    return { items: rows.map((r) => this.toPublic(r)), total };
  }

  async getOwned(apiKeyId: string, documentId: string) {
    const owner = await this.ownerId(apiKeyId);
    let doc = await prisma.document.findFirst({
      where: { id: documentId, apiKeyId: owner, deletedAt: null },
    });
    if (doc) return doc;

    // Admin keys (and OTP sessions mapped to an admin key) may read any
    // non-deleted document — matches Admin panel document list/download.
    // Client keys stay ownership-scoped for multi-tenant isolation.
    const actorKey = await prisma.apiKey.findUnique({
      where: { id: owner },
      select: { role: true },
    });
    const isAdmin =
      isSyntheticApiKeyId(apiKeyId) ||
      String(actorKey?.role || '').toLowerCase() === ROLES.ADMIN;
    if (isAdmin) {
      doc = await prisma.document.findFirst({
        where: { id: documentId, deletedAt: null },
      });
      if (doc) return doc;
    }

    throw ExceptionFactory.notFound('Document');
  }

  async getPublic(apiKeyId: string, documentId: string): Promise<DocumentPublicEntity> {
    const doc = await this.getOwned(apiKeyId, documentId);
    return this.toPublic(doc);
  }

  async readDecryptedContent(apiKeyId: string, documentId: string): Promise<Buffer> {
    const doc = await this.getOwned(apiKeyId, documentId);

    if (doc.storageType === STORAGE_TYPES.FILESYSTEM && doc.storagePath) {
      const fullPath = path.join(env.storageDir, path.basename(doc.storagePath));
      const packed = await fs.readFile(fullPath);
      let offset = 0;
      const ivLen = packed[offset++]!;
      const iv = packed.subarray(offset, offset + ivLen);
      offset += ivLen;
      const tagLen = packed[offset++]!;
      const tag = packed.subarray(offset, offset + tagLen);
      offset += tagLen;
      const ciphertext = packed.subarray(offset);
      return encryptionService.decrypt({ ciphertext, iv, tag });
    }

    if (!doc.contentCiphertext || !doc.contentIv || !doc.contentTag) {
      throw ExceptionFactory.internal('Document ciphertext missing');
    }

    return encryptionService.decrypt({
      ciphertext: Buffer.from(doc.contentCiphertext),
      iv: Buffer.from(doc.contentIv),
      tag: Buffer.from(doc.contentTag),
    });
  }

  async softDelete(apiKeyId: string, documentId: string, ip?: string): Promise<void> {
    const doc = await this.getOwned(apiKeyId, documentId);

    await prisma.document.update({
      where: { id: doc.id },
      data: { deletedAt: new Date() },
    });

    if (doc.storageType === STORAGE_TYPES.FILESYSTEM && doc.storagePath) {
      const fullPath = path.join(env.storageDir, path.basename(doc.storagePath));
      await fs.unlink(fullPath).catch(() => undefined);
    }

    await auditService.log({
      apiKeyId,
      action: AUDIT_ACTIONS.DOCUMENT_DELETE,
      resource: 'document',
      resourceId: documentId,
      meta: { originalName: doc.originalName },
      ip,
    });
  }

  /**
   * Decrypt owned documents into `targetDir` so Grok CLI (safe sandbox tools)
   * can `read_file` / open them by absolute path.
   */
  async materializeDocuments(
    apiKeyId: string,
    documentIds: string[],
    targetDir: string,
  ): Promise<MaterializedDocument[]> {
    if (documentIds.length === 0) return [];
    await fs.mkdir(targetDir, { recursive: true });

    const usedNames = new Set<string>();
    const out: MaterializedDocument[] = [];

    for (const id of documentIds) {
      const doc = await this.getOwned(apiKeyId, id);
      const buf = await this.readDecryptedContent(apiKeyId, id);
      let safeName = sanitizeFilename(doc.originalName);
      if (usedNames.has(safeName)) {
        const ext = path.extname(safeName);
        const stem = path.basename(safeName, ext);
        safeName = `${stem}-${id.slice(0, 8)}${ext}`;
      }
      usedNames.add(safeName);
      const fullPath = path.join(targetDir, safeName);
      await fs.writeFile(fullPath, buf, { mode: 0o600 });
      out.push({
        id: doc.id,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        sizeBytes: doc.sizeBytes,
        path: fullPath,
      });
    }

    return out;
  }

  /**
   * Build prompt context from documents. Optionally materialize files into
   * `materializeDir`. Prefer `pathPrefix` (relative to Grok cwd) in the prompt
   * so tools never need absolute host paths.
   */
  async buildContextFromDocuments(
    apiKeyId: string,
    documentIds: string[],
    maxChars: number,
    options?: { materializeDir?: string; pathPrefix?: string },
  ): Promise<DocumentContextResult> {
    if (documentIds.length === 0) return { context: '', files: [] };

    const files = options?.materializeDir
      ? await this.materializeDocuments(apiKeyId, documentIds, options.materializeDir)
      : [];
    const prefix = (options?.pathPrefix || '').replace(/\\/g, '/').replace(/\/+$/, '');
    const displayPath = (f: MaterializedDocument) => {
      if (prefix) {
        const base = path.basename(f.path);
        return `${prefix}/${base}`.replace(/\/+/g, '/');
      }
      // Fallback: basename only (never leak full host path when prefix missing)
      return path.basename(f.path);
    };
    const pathById = new Map(files.map((f) => [f.id, displayPath(f)]));

    const parts: string[] = [];
    let used = 0;

    if (files.length > 0) {
      const list = files
        .map(
          (f) =>
            `- ${f.originalName} (${f.mimeType}, ${f.sizeBytes} bytes) → ${displayPath(f)}`,
        )
        .join('\n');
      const intro =
        `Attached files are written under the working directory for tools ` +
        `(read_file / list_dir). Use these paths relative to cwd:\n${list}\n\n`;
      parts.push(intro);
      used += intro.length;
    }

    for (const id of documentIds) {
      const doc = await this.getOwned(apiKeyId, id);
      const remaining = maxChars - used;
      if (remaining <= 0) break;

      const relPath = pathById.get(id);
      const pathLine = relPath ? `path: ${relPath}\n` : '';
      const header = `--- Document: ${doc.originalName} (${doc.id}) ---\n${pathLine}`;

      let bodyText: string;

      if (isImageMime(doc.mimeType)) {
        bodyText =
          `[image attachment: name=${doc.originalName}, mime=${doc.mimeType}, ` +
          `size=${doc.sizeBytes} bytes, document_id=${doc.id}, sha256=${doc.checksumSha256}` +
          (relPath ? `, file=${relPath}` : '') +
          `]\n` +
          `Note: image bytes are not inlined into the prompt; open the file path if vision/file tools are available.\n`;
      } else {
        const buf = await this.readDecryptedContent(apiKeyId, id);
        bodyText = await this.bufferToContextText(doc, buf);
      }

      const body =
        header.length + bodyText.length > remaining
          ? bodyText.slice(0, Math.max(0, remaining - header.length)) +
            '\n...[truncated]'
          : bodyText;

      const chunk = header + body + '\n';
      parts.push(chunk);
      used += chunk.length;
    }

    return { context: parts.join('\n'), files };
  }

  /** Convert file bytes to prompt-safe text (PDF extract, textual decode, or placeholder). */
  private async bufferToContextText(
    doc: { originalName: string; mimeType: string; sizeBytes: number; checksumSha256: string },
    buf: Buffer,
  ): Promise<string> {
    const mime = (doc.mimeType || '').toLowerCase();
    const ext = path.extname(doc.originalName).toLowerCase();

    if (mime === 'application/pdf' || ext === '.pdf') {
      const extracted = await this.extractPdfText(buf);
      if (extracted && extracted.trim()) {
        return extracted;
      }
      return (
        `[pdf file: ${doc.originalName}, ${doc.sizeBytes} bytes, sha256=${doc.checksumSha256}; ` +
        `text extraction unavailable — use the on-disk path with tools if present]`
      );
    }

    if (isTextualMime(mime) || !buf.includes(0)) {
      const text = buf.toString('utf8');
      if (!text.includes('\u0000')) {
        return text;
      }
    }

    return `[binary file: ${doc.originalName}, ${doc.sizeBytes} bytes, sha256=${doc.checksumSha256}]`;
  }

  /** Best-effort PDF text via poppler `pdftotext` when installed. */
  private async extractPdfText(buf: Buffer): Promise<string | null> {
    const tmpIn = path.join(os.tmpdir(), `gctoac-pdf-${randomUUID()}.pdf`);
    try {
      await fs.writeFile(tmpIn, buf, { mode: 0o600 });
      const { stdout } = await execFileAsync(
        'pdftotext',
        ['-layout', '-enc', 'UTF-8', '-nopgbrk', tmpIn, '-'],
        {
          maxBuffer: 12 * 1024 * 1024,
          timeout: 45_000,
        },
      );
      const text = String(stdout || '').replace(/\u0000/g, '').trim();
      return text || null;
    } catch (err) {
      logger.debug(
        { err: err instanceof Error ? err.message : String(err) },
        'pdftotext extraction failed',
      );
      return null;
    } finally {
      await fs.unlink(tmpIn).catch(() => undefined);
    }
  }

  private toPublic(doc: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    checksumSha256: string;
    createdAt: Date;
  }): DocumentPublicEntity {
    return {
      id: doc.id,
      originalName: doc.originalName,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      checksumSha256: doc.checksumSha256,
      createdAt: doc.createdAt,
    };
  }
}

export const documentService = new DocumentService();
