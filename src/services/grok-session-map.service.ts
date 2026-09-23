import { prisma } from '../config/database';
import { createId } from '../utils/id';
import {
  isUuid,
  resolveGrokSessionBinding,
  type ResolvedGrokSession,
} from '../utils/grok-session';

/**
 * Persist client `session_id` → Grok CLI UUID so we create once (`-s`)
 * and resume after (`--resume`). Tenant-scoped by API key id.
 */
export class GrokSessionMapService {
  async resolve(
    apiKeyId: string,
    clientSessionId: string,
  ): Promise<ResolvedGrokSession> {
    const raw = clientSessionId.trim().slice(0, 128);
    if (!raw) {
      return resolveGrokSessionBinding({
        apiKeyId,
        clientSessionId: raw,
      });
    }

    const byClient = await prisma.grokSessionAlias.findUnique({
      where: {
        apiKeyId_clientSessionId: { apiKeyId, clientSessionId: raw },
      },
    });

    let knownByGrokId: string | null = null;
    if (isUuid(raw)) {
      const byGrok = await prisma.grokSessionAlias.findFirst({
        where: { apiKeyId, grokSessionId: raw },
      });
      knownByGrokId = byGrok?.grokSessionId ?? null;
    }

    return resolveGrokSessionBinding({
      apiKeyId,
      clientSessionId: raw,
      knownGrokSessionId: byClient?.grokSessionId ?? null,
      knownByGrokId,
    });
  }

  async remember(
    apiKeyId: string,
    clientSessionId: string,
    grokSessionId: string,
  ): Promise<void> {
    const raw = clientSessionId.trim().slice(0, 128);
    if (!raw || !isUuid(grokSessionId)) return;
    await prisma.grokSessionAlias.upsert({
      where: {
        apiKeyId_clientSessionId: { apiKeyId, clientSessionId: raw },
      },
      create: {
        id: createId(),
        apiKeyId,
        clientSessionId: raw,
        grokSessionId,
      },
      update: { grokSessionId },
    });
  }
}

export const grokSessionMapService = new GrokSessionMapService();
