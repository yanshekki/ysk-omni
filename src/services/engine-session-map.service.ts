import { prisma } from '../config/database';
import { createId } from '../utils/id';
import {
  isUuid,
  resolveEngineSessionBinding,
  type ResolvedEngineSession,
} from '../utils/engine-session';

/**
 * Persist client `session_id` → local engine UUID so we create once (`-s`)
 * and resume after (`--resume`). Tenant-scoped by API key id.
 */
export class EngineSessionMapService {
  async resolve(
    apiKeyId: string,
    clientSessionId: string,
  ): Promise<ResolvedEngineSession> {
    const raw = clientSessionId.trim().slice(0, 128);
    if (!raw) {
      return resolveEngineSessionBinding({
        apiKeyId,
        clientSessionId: raw,
      });
    }

    const byClient = await prisma.engineSessionAlias.findUnique({
      where: {
        apiKeyId_clientSessionId: { apiKeyId, clientSessionId: raw },
      },
    });

    let knownByEngineId: string | null = null;
    if (isUuid(raw)) {
      const byEngine = await prisma.engineSessionAlias.findFirst({
        where: { apiKeyId, engineSessionId: raw },
      });
      knownByEngineId = byEngine?.engineSessionId ?? null;
    }

    return resolveEngineSessionBinding({
      apiKeyId,
      clientSessionId: raw,
      knownEngineSessionId: byClient?.engineSessionId ?? null,
      knownByEngineId,
    });
  }

  async remember(
    apiKeyId: string,
    clientSessionId: string,
    engineSessionId: string,
  ): Promise<void> {
    const raw = clientSessionId.trim().slice(0, 128);
    if (!raw || !isUuid(engineSessionId)) return;
    await prisma.engineSessionAlias.upsert({
      where: {
        apiKeyId_clientSessionId: { apiKeyId, clientSessionId: raw },
      },
      create: {
        id: createId(),
        apiKeyId,
        clientSessionId: raw,
        engineSessionId,
      },
      update: { engineSessionId },
    });
  }
}

export const engineSessionMapService = new EngineSessionMapService();
