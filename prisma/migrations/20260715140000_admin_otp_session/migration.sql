-- CreateTable
CREATE TABLE "admin_otps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdIp" TEXT
);

-- CreateIndex
CREATE INDEX "admin_otps_expiresAt_idx" ON "admin_otps"("expiresAt");

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME,
    "ip" TEXT,
    "userAgent" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_sessions_tokenHash_key" ON "admin_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "admin_sessions_expiresAt_idx" ON "admin_sessions"("expiresAt");
