-- CreateTable
CREATE TABLE "grok_session_aliases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKeyId" TEXT NOT NULL,
    "clientSessionId" TEXT NOT NULL,
    "grokSessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "grok_session_aliases_apiKeyId_clientSessionId_key" ON "grok_session_aliases"("apiKeyId", "clientSessionId");

-- CreateIndex
CREATE INDEX "grok_session_aliases_apiKeyId_grokSessionId_idx" ON "grok_session_aliases"("apiKeyId", "grokSessionId");
