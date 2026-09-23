-- CreateTable
CREATE TABLE "stored_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "model" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "bodyCiphertext" BLOB NOT NULL,
    "bodyIv" BLOB NOT NULL,
    "bodyTag" BLOB NOT NULL,
    "previousId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "assistants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "model" TEXT,
    "instructions" TEXT NOT NULL DEFAULT '',
    "toolsJson" TEXT NOT NULL DEFAULT '[]',
    "metadataJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "assistant_threads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "assistantId" TEXT,
    "metadataJson" TEXT,
    "grokSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "assistant_threads_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "assistants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assistant_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assistant_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "assistant_threads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assistant_runs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "assistantId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "model" TEXT,
    "resultJson" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "assistant_runs_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "assistant_threads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "stored_responses_apiKeyId_createdAt_idx" ON "stored_responses"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "stored_responses_previousId_idx" ON "stored_responses"("previousId");

-- CreateIndex
CREATE INDEX "assistants_apiKeyId_createdAt_idx" ON "assistants"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "assistant_threads_apiKeyId_updatedAt_idx" ON "assistant_threads"("apiKeyId", "updatedAt");

-- CreateIndex
CREATE INDEX "assistant_messages_threadId_createdAt_idx" ON "assistant_messages"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "assistant_runs_threadId_createdAt_idx" ON "assistant_runs"("threadId", "createdAt");
