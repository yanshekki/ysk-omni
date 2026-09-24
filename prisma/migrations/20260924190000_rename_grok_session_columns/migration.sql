-- Rename leftover Grok CLI session columns/tables to engine session names.
ALTER TABLE "chat_requests" RENAME COLUMN "grokSessionId" TO "engineSessionId";
ALTER TABLE "assistant_threads" RENAME COLUMN "grokSessionId" TO "engineSessionId";
ALTER TABLE "grok_session_aliases" RENAME TO "engine_session_aliases";
ALTER TABLE "engine_session_aliases" RENAME COLUMN "grokSessionId" TO "engineSessionId";
