-- AlterTable
ALTER TABLE "chat_requests" ADD COLUMN "policyMode" TEXT;

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_api_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'client',
    "mode" TEXT NOT NULL DEFAULT 'safe',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rateLimit" INTEGER NOT NULL DEFAULT 60,
    "maxTurns" INTEGER,
    "timeoutMs" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME
);
INSERT INTO "new_api_keys" ("createdAt", "id", "isActive", "keyHash", "keyPrefix", "lastUsedAt", "name", "rateLimit", "role") SELECT "createdAt", "id", "isActive", "keyHash", "keyPrefix", "lastUsedAt", "name", "rateLimit", "role" FROM "api_keys";
DROP TABLE "api_keys";
ALTER TABLE "new_api_keys" RENAME TO "api_keys";
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");
CREATE INDEX "api_keys_keyPrefix_idx" ON "api_keys"("keyPrefix");
CREATE INDEX "api_keys_isActive_idx" ON "api_keys"("isActive");
CREATE INDEX "api_keys_mode_idx" ON "api_keys"("mode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
