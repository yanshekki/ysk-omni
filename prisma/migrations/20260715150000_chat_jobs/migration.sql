-- CreateTable
CREATE TABLE "chat_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'v1',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "leaseOwner" TEXT,
    "leaseUntil" DATETIME,
    "notBefore" DATETIME,
    "queuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "cancelRequested" BOOLEAN NOT NULL DEFAULT false,
    "model" TEXT,
    "stream" BOOLEAN NOT NULL DEFAULT true,
    "payloadCiphertext" BLOB NOT NULL,
    "payloadIv" BLOB NOT NULL,
    "payloadTag" BLOB NOT NULL,
    "resultChatRequestId" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "idempotencyKey" TEXT
);

CREATE INDEX "chat_jobs_status_priority_queuedAt_idx" ON "chat_jobs"("status", "priority", "queuedAt");
CREATE INDEX "chat_jobs_apiKeyId_status_queuedAt_idx" ON "chat_jobs"("apiKeyId", "status", "queuedAt");
CREATE INDEX "chat_jobs_leaseUntil_idx" ON "chat_jobs"("leaseUntil");
CREATE INDEX "chat_jobs_requestId_idx" ON "chat_jobs"("requestId");
CREATE UNIQUE INDEX "chat_jobs_idempotencyKey_key" ON "chat_jobs"("idempotencyKey");
