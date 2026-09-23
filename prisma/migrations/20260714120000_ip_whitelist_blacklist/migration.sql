-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN "ipWhitelist" TEXT;

-- CreateTable
CREATE TABLE "ip_blacklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "reason" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ip_blacklist_ip_key" ON "ip_blacklist"("ip");

-- CreateIndex
CREATE INDEX "ip_blacklist_expiresAt_idx" ON "ip_blacklist"("expiresAt");
