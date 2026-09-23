-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'image',
    "mime" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "originalName" TEXT,
    "source" TEXT NOT NULL DEFAULT 'generation',
    "provider" TEXT NOT NULL DEFAULT 'grok-tools',
    "metaJson" TEXT,
    "prompt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "media_assets_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "media_assets_apiKeyId_createdAt_idx" ON "media_assets"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "media_assets_kind_createdAt_idx" ON "media_assets"("kind", "createdAt");
