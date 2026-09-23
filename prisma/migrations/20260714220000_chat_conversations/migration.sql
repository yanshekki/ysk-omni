-- CreateTable
CREATE TABLE "chat_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "apiKeyId" TEXT,
    "model" TEXT,
    "systemPrompt" TEXT NOT NULL DEFAULT '',
    "messagesCiphertext" BLOB NOT NULL,
    "messagesIv" BLOB NOT NULL,
    "messagesTag" BLOB NOT NULL,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "preview" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chat_conversations_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "chat_conversations_updatedAt_idx" ON "chat_conversations"("updatedAt");

-- CreateIndex
CREATE INDEX "chat_conversations_apiKeyId_updatedAt_idx" ON "chat_conversations"("apiKeyId", "updatedAt");
