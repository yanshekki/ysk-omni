-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'client',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rateLimit" INTEGER NOT NULL DEFAULT 60,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME
);

-- CreateTable
CREATE TABLE "chat_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "stream" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL,
    "durationMs" INTEGER,
    "grokSessionId" TEXT,
    "promptCiphertext" BLOB NOT NULL,
    "promptIv" BLOB NOT NULL,
    "promptTag" BLOB NOT NULL,
    "responseCiphertext" BLOB,
    "responseIv" BLOB,
    "responseTag" BLOB,
    "errorMessage" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_requests_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageType" TEXT NOT NULL,
    "contentCiphertext" BLOB,
    "contentIv" BLOB,
    "contentTag" BLOB,
    "storagePath" TEXT,
    "checksumSha256" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "documents_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_request_documents" (
    "chatRequestId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    PRIMARY KEY ("chatRequestId", "documentId"),
    CONSTRAINT "chat_request_documents_chatRequestId_fkey" FOREIGN KEY ("chatRequestId") REFERENCES "chat_requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_request_documents_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "metaJson" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "api_keys_keyPrefix_idx" ON "api_keys"("keyPrefix");

-- CreateIndex
CREATE INDEX "api_keys_isActive_idx" ON "api_keys"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "chat_requests_requestId_key" ON "chat_requests"("requestId");

-- CreateIndex
CREATE INDEX "chat_requests_apiKeyId_createdAt_idx" ON "chat_requests"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "chat_requests_status_idx" ON "chat_requests"("status");

-- CreateIndex
CREATE INDEX "documents_apiKeyId_createdAt_idx" ON "documents"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "documents_deletedAt_idx" ON "documents"("deletedAt");

-- CreateIndex
CREATE INDEX "audit_logs_apiKeyId_createdAt_idx" ON "audit_logs"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");
