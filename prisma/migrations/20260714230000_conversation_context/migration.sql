-- AlterTable
ALTER TABLE "chat_conversations" ADD COLUMN "contextMode" TEXT NOT NULL DEFAULT 'full';
ALTER TABLE "chat_conversations" ADD COLUMN "contextRecentN" INTEGER NOT NULL DEFAULT 6;
ALTER TABLE "chat_conversations" ADD COLUMN "summaryText" TEXT NOT NULL DEFAULT '';
ALTER TABLE "chat_conversations" ADD COLUMN "summaryAt" DATETIME;
ALTER TABLE "chat_conversations" ADD COLUMN "summarySourceCount" INTEGER NOT NULL DEFAULT 0;
