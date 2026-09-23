import { createApp } from './app';
import { env } from './config/env';
import { disconnectDatabase, prisma } from './config/database';
import { documentService } from './services/document.service';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  await documentService.ensureStorageDir();

  // Fail fast if DB is unreachable
  await prisma.$connect();
  logger.info('Database connected');

  // Normalize legacy CLI roles (user → client) before serving traffic
  const { backfillApiKeyRoles } = await import('./services/role-normalize.service');
  await backfillApiKeyRoles();

  // Load bans + DDoS policy before accepting traffic (no race on first request)
  const { ipBlacklistService } = await import('./services/ip-blacklist.service');
  const { ddosPolicyService } = await import('./services/ddos-policy.service');
  await Promise.all([
    ipBlacklistService.ensureLoaded(),
    ddosPolicyService.load(),
  ]);
  logger.info('IP blacklist and DDoS policy loaded');

  const { queuePolicyService } = await import('./services/queue/queue-policy.service');
  const { chatWorkerService } = await import('./services/queue/chat-worker.service');
  const { getQueueBackend } = await import('./services/queue/queue-backend.factory');
  // Fail fast if QUEUE_BACKEND is redis/kafka (not implemented)
  getQueueBackend();
  await queuePolicyService.load();
  chatWorkerService.start();

  const app = createApp();
  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(
      { host: env.HOST, port: env.PORT, env: env.NODE_ENV },
      'Grok OpenAI-compatible gateway listening',
    );
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.fatal(
        {
          port: env.PORT,
          hint: 'Port busy — another gctoac/pm2 instance may be running. Try: gctoac stop && pm2 delete grok-openai-gateway',
        },
        `listen EADDRINUSE on port ${env.PORT}`,
      );
    } else {
      logger.fatal({ err }, 'HTTP server error');
    }
    process.exit(1);
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down');
    try {
      const { chatWorkerService } = await import(
        './services/queue/chat-worker.service'
      );
      chatWorkerService.stop();
    } catch {
      /* ignore */
    }
    server.close(async () => {
      try {
        await disconnectDatabase();
        logger.info('Shutdown complete');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during shutdown');
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 15_000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
