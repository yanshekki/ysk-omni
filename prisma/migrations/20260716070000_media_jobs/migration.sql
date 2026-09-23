CREATE TABLE "media_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'video',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "prompt" TEXT,
    "model" TEXT,
    "inputJson" TEXT,
    "resultAssetId" TEXT,
    "errorMessage" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME
);
CREATE INDEX "media_jobs_apiKeyId_createdAt_idx" ON "media_jobs"("apiKeyId", "createdAt");
CREATE INDEX "media_jobs_status_createdAt_idx" ON "media_jobs"("status", "createdAt");
