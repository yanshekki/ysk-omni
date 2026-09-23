#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { cmdSetup } from './commands/setup';
import { cmdStart } from './commands/start';
import { cmdStop } from './commands/stop';
import { cmdRestart } from './commands/restart';
import { cmdStatus } from './commands/status';
import { cmdMigrate } from './commands/migrate';
import { cmdSeed } from './commands/seed';
import { cmdDoctor } from './commands/doctor';
import { cmdOpen } from './commands/open';
import { cmdVersion } from './commands/version';
import { cmdUpdate } from './commands/update';
import {
  cmdKeyCreate,
  cmdKeyList,
  cmdKeyRevoke,
  cmdKeyShow,
  cmdKeyUpdate,
  cmdKeyActivate,
} from './commands/key';
import {
  cmdAdminOff,
  cmdAdminOn,
  cmdAdminStatus,
} from './commands/admin-panel';
import { cmdAdminOtp } from './commands/admin-otp';
import {
  cmdAdminSessionsList,
  cmdAdminSessionsRevoke,
} from './commands/admin-sessions';
import { cmdLogsClear, cmdLogsShow } from './commands/logs';
import {
  cmdSettingsGet,
  cmdSettingsSet,
  cmdSettingsPreset,
} from './commands/settings';
import {
  cmdQueueStats,
  cmdQueuePolicyGet,
  cmdQueuePolicySet,
  cmdQueuePolicyPreset,
  cmdQueuePause,
  cmdQueueResume,
  cmdQueueDrain,
  cmdQueueUndrain,
  cmdQueueJobs,
  cmdQueueJob,
  cmdQueueCancel,
  cmdQueueRequeue,
  cmdQueuePriority,
  cmdQueuePurgeDead,
} from './commands/queue';
import {
  cmdDdosSummary,
  cmdDdosPolicyGet,
  cmdDdosPolicySet,
  cmdDdosPolicyPreset,
  cmdDdosPolicyReset,
  cmdDdosBan,
  cmdDdosUnban,
  cmdDdosBlacklist,
} from './commands/ddos';
import { cmdDocsList, cmdDocsShow, cmdDocsDelete } from './commands/docs';
import { cmdChatsList, cmdChatsShow } from './commands/chats';
import {
  cmdConversationsList,
  cmdConversationsDelete,
} from './commands/conversations';
import { cmdAuditList } from './commands/audit';
import { cmdStats } from './commands/stats';
import { cmdModels } from './commands/models';
import {
  cmdGrokInspect,
  cmdGrokSessionsList,
  cmdGrokSessionsDelete,
} from './commands/grok-env';
import {
  cmdApiFeaturesGet,
  cmdApiFeaturesSet,
  cmdApiFeaturesPreset,
} from './commands/api-features';
import { DEFAULT_PORT } from './lib/paths';

function readPkgVersion(): string {
  try {
    const pkgPath = path.join(__dirname, '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version?: string };
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const program = new Command();

program
  .name('gctoac')
  .description(
    'Grok CLI → OpenAI-compatible gateway controller (alias: gcoa)',
  )
  .option('--home <path>', 'Data home directory (default: ~/.gctoac or project root)')
  .option('--port <n>', `HTTP port (default ${DEFAULT_PORT})`, (v) => Number(v))
  .option('--json', 'Machine-readable JSON output where supported')
  .version(readPkgVersion(), '-V, --version');

function globalOpts() {
  const g = program.opts() as { home?: string; port?: number; json?: boolean };
  return {
    home: g.home,
    port: g.port,
    forceHome: Boolean(g.home),
    json: Boolean(g.json),
  };
}

program
  .command('setup')
  .description('Create data dirs, .env, migrate DB, seed admin key')
  .action(async () => {
    await cmdSetup(globalOpts());
  });

program
  .command('start')
  .description(
    `Start gateway (default port ${DEFAULT_PORT}). Use --pm2 to run under PM2.`,
  )
  .option('-f, --foreground', 'Run in foreground')
  .option('--pm2', 'Start under PM2 (process manager)')
  .action(async (opts: { foreground?: boolean; pm2?: boolean }) => {
    await cmdStart({
      ...globalOpts(),
      foreground: opts.foreground,
      pm2: opts.pm2,
    });
  });

program
  .command('stop')
  .description('Stop background gateway')
  .action(async () => {
    await cmdStop(globalOpts());
  });

program
  .command('restart')
  .description('Restart gateway')
  .option('-f, --foreground', 'Run in foreground')
  .option('--pm2', 'Restart under PM2')
  .action(async (opts: { foreground?: boolean; pm2?: boolean }) => {
    await cmdRestart({
      ...globalOpts(),
      foreground: opts.foreground,
      pm2: opts.pm2,
    });
  });

program
  .command('status')
  .description('Show process + health status')
  .action(async () => {
    await cmdStatus(globalOpts());
  });

program
  .command('migrate')
  .description('Run prisma migrate deploy')
  .action(async () => {
    await cmdMigrate(globalOpts());
  });

program
  .command('seed')
  .description('Seed bootstrap admin API key (if missing)')
  .action(async () => {
    await cmdSeed(globalOpts());
  });

const keyCmd = program
  .command('key')
  .description('Manage API keys (create prints plaintext once)')
  .action(async () => {
    // Bare `gctoac key` still creates admin (compat) — prefer `key create`
    const { warn } = await import('./lib/print');
    warn(
      'Bare `gctoac key` creates a new admin key. Prefer: gctoac key create [-r admin|client]',
    );
    await cmdKeyCreate({ ...globalOpts(), role: 'admin' });
  });

keyCmd
  .command('create')
  .description('Create API key and print plaintext once (default: admin)')
  .option('-n, --name <name>', 'Key name')
  .option(
    '-r, --role <role>',
    'admin | client (alias: user → client)',
    'admin',
  )
  .option(
    '-m, --mode <mode>',
    'safe | agent (client keys; admin is always agent)',
    'safe',
  )
  .option('--rate-limit <n>', 'Per-key rate limit', (v) => Number(v))
  .action(
    async (opts: {
      name?: string;
      role?: string;
      mode?: string;
      rateLimit?: number;
    }) => {
      await cmdKeyCreate({
        ...globalOpts(),
        name: opts.name,
        role: opts.role,
        mode: opts.mode,
        rateLimit: opts.rateLimit,
      });
    },
  );

keyCmd
  .command('list')
  .description('List API keys (prefix only; plaintext not stored)')
  .action(async () => {
    await cmdKeyList(globalOpts());
  });

keyCmd
  .command('revoke')
  .description('Revoke (deactivate) an API key by id')
  .argument('<id>', 'API key id')
  .action(async (id: string) => {
    await cmdKeyRevoke({ ...globalOpts(), id });
  });

keyCmd
  .command('activate')
  .description('Re-activate a revoked API key')
  .argument('<id>', 'API key id')
  .action(async (id: string) => {
    await cmdKeyActivate({ ...globalOpts(), id });
  });

keyCmd
  .command('show')
  .description('Show public fields for an API key')
  .argument('<id>', 'API key id')
  .action(async (id: string) => {
    await cmdKeyShow({ ...globalOpts(), id });
  });

keyCmd
  .command('update')
  .description('Update API key fields (name, role, mode, rate, active)')
  .argument('<id>', 'API key id')
  .option('-n, --name <name>', 'Key name')
  .option('-r, --role <role>', 'admin | client')
  .option('-m, --mode <mode>', 'safe | agent')
  .option('--rate-limit <n>', 'Per-key rate limit', (v) => Number(v))
  .option('--active <on|off>', 'Active flag')
  .action(
    async (
      id: string,
      opts: {
        name?: string;
        role?: string;
        mode?: string;
        rateLimit?: number;
        active?: string;
      },
    ) => {
      await cmdKeyUpdate({
        ...globalOpts(),
        id,
        name: opts.name,
        role: opts.role,
        mode: opts.mode,
        rateLimit: opts.rateLimit,
        active: opts.active,
      });
    },
  );

keyCmd
  .command('admin')
  .description('Create a new admin API key (same as: gctoac key create)')
  .option('-n, --name <name>', 'Key name')
  .action(async (opts: { name?: string }) => {
    await cmdKeyCreate({ ...globalOpts(), role: 'admin', name: opts.name });
  });

const adminCmd = program
  .command('admin')
  .description('Enable/disable Admin panel (CLI is the only way to turn it back on)')
  .action(async () => {
    await cmdAdminStatus(globalOpts());
  });

adminCmd
  .command('status')
  .description('Show Admin panel on/off status')
  .action(async () => {
    await cmdAdminStatus(globalOpts());
  });

adminCmd
  .command('on')
  .description('Enable Admin panel (settings DB)')
  .action(async () => {
    await cmdAdminOn(globalOpts());
  });

adminCmd
  .command('off')
  .description('Disable Admin panel (settings DB); re-enable with: gctoac admin on')
  .action(async () => {
    await cmdAdminOff(globalOpts());
  });

adminCmd
  .command('otp')
  .alias('login-code')
  .description(
    'Generate a one-time Admin panel login code (5 min, single use). Required for every SPA login.',
  )
  .action(async () => {
    await cmdAdminOtp(globalOpts());
  });

const adminSessionsCmd = adminCmd
  .command('sessions')
  .description('List active OTP Admin sessions')
  .action(async () => {
    await cmdAdminSessionsList(globalOpts());
  });

adminSessionsCmd
  .command('list')
  .description('List active OTP Admin sessions')
  .action(async () => {
    await cmdAdminSessionsList(globalOpts());
  });

adminSessionsCmd
  .command('revoke')
  .description('Revoke session by id prefix, or: all | all-expired')
  .argument('<id>', 'Session id / prefix / all / all-expired')
  .action(async (id: string) => {
    await cmdAdminSessionsRevoke({ ...globalOpts(), id });
  });

// ——— Settings (Safety) ———
const settingsCmd = program
  .command('settings')
  .description('Safety / gateway settings (global safe, tools, model)')
  .action(async () => {
    await cmdSettingsGet(globalOpts());
  });

settingsCmd
  .command('get')
  .description('Show current settings')
  .action(async () => {
    await cmdSettingsGet(globalOpts());
  });

settingsCmd
  .command('set')
  .description('Update safety settings')
  .option('--global-safe <on|off>', 'Force global safe mode')
  .option('--tools <none|readonly>', 'Safe tools mode')
  .option('--max-turns <n>', 'Safe max turns', (v) => Number(v))
  .option('--timeout-ms <n>', 'Safe timeout ms', (v) => Number(v))
  .option('--default-model <name>', 'Default model id')
  .action(
    async (opts: {
      globalSafe?: string;
      tools?: string;
      maxTurns?: number;
      timeoutMs?: number;
      defaultModel?: string;
    }) => {
      await cmdSettingsSet({ ...globalOpts(), ...opts });
    },
  );

settingsCmd
  .command('preset')
  .description('Apply safety preset: local|prod|code|read|chat|long')
  .argument('<name>', 'Preset name')
  .action(async (name: string) => {
    await cmdSettingsPreset({ ...globalOpts(), name });
  });

// ——— Chat queue ———
const queueCmd = program
  .command('queue')
  .description('Chat work queue control (policy, jobs, pause/drain)')
  .action(async () => {
    await cmdQueueStats(globalOpts());
  });

queueCmd
  .command('stats')
  .description('Queue depth and job counts by status')
  .action(async () => {
    await cmdQueueStats(globalOpts());
  });

const queuePolicyCmd = queueCmd
  .command('policy')
  .description('Queue policy get/set/preset')
  .action(async () => {
    await cmdQueuePolicyGet(globalOpts());
  });

queuePolicyCmd
  .command('get')
  .description('Show queue policy')
  .action(async () => {
    await cmdQueuePolicyGet(globalOpts());
  });

queuePolicyCmd
  .command('set')
  .description('Update queue policy fields')
  .option('--enabled <on|off>')
  .option('--paused <on|off>')
  .option('--drain-mode <on|off>')
  .option('--global-concurrency <n>', '', (v: string) => Number(v))
  .option('--per-key-concurrency <n>', '', (v: string) => Number(v))
  .option('--max-queue-depth <n>', '', (v: string) => Number(v))
  .option('--max-queue-depth-per-key <n>', '', (v: string) => Number(v))
  .option('--default-priority <n>', '', (v: string) => Number(v))
  .option('--playground-priority <n>', '', (v: string) => Number(v))
  .option('--lease-ms <n>', '', (v: string) => Number(v))
  .option('--max-wait-ms <n>', '', (v: string) => Number(v))
  .option('--max-attempts <n>', '', (v: string) => Number(v))
  .option('--fairness <fifo_global|weighted_round_robin>')
  .action(async (opts: Record<string, unknown>) => {
    await cmdQueuePolicySet({
      ...globalOpts(),
      ...opts,
      globalConcurrency: opts.globalConcurrency,
      perKeyConcurrency: opts.perKeyConcurrency,
      maxQueueDepth: opts.maxQueueDepth,
      maxQueueDepthPerKey: opts.maxQueueDepthPerKey,
      defaultPriority: opts.defaultPriority,
      playgroundPriority: opts.playgroundPriority,
      leaseMs: opts.leaseMs,
      maxWaitMs: opts.maxWaitMs,
      maxAttempts: opts.maxAttempts,
      drainMode: opts.drainMode,
    });
  });

queuePolicyCmd
  .command('preset')
  .description('Apply queue preset: relaxed|balanced|strict')
  .argument('<name>', 'Preset name')
  .action(async (name: string) => {
    await cmdQueuePolicyPreset({ ...globalOpts(), name });
  });

queueCmd.command('pause').description('Pause worker claiming').action(async () => {
  await cmdQueuePause(globalOpts());
});
queueCmd.command('resume').description('Resume worker claiming').action(async () => {
  await cmdQueueResume(globalOpts());
});
queueCmd.command('drain').description('Reject new enqueues').action(async () => {
  await cmdQueueDrain(globalOpts());
});
queueCmd.command('undrain').description('Allow new enqueues').action(async () => {
  await cmdQueueUndrain(globalOpts());
});

queueCmd
  .command('jobs')
  .description('List jobs')
  .option('--status <status>', 'Filter status')
  .option('--limit <n>', 'Limit', (v) => Number(v))
  .option('--offset <n>', 'Offset', (v) => Number(v))
  .action(async (opts: { status?: string; limit?: number; offset?: number }) => {
    await cmdQueueJobs({ ...globalOpts(), ...opts });
  });

queueCmd
  .command('job')
  .description('Show one job by id')
  .argument('<id>', 'Job id')
  .action(async (id: string) => {
    await cmdQueueJob({ ...globalOpts(), id });
  });

queueCmd
  .command('cancel')
  .description('Cancel a queued/running job')
  .argument('<id>', 'Job id')
  .action(async (id: string) => {
    await cmdQueueCancel({ ...globalOpts(), id });
  });

queueCmd
  .command('requeue')
  .description('Requeue a failed/dead/cancelled job')
  .argument('<id>', 'Job id')
  .action(async (id: string) => {
    await cmdQueueRequeue({ ...globalOpts(), id });
  });

queueCmd
  .command('priority')
  .description('Set priority on a queued job (lower = sooner)')
  .argument('<id>', 'Job id')
  .argument('<priority>', '0–1000', (v) => Number(v))
  .action(async (id: string, priority: number) => {
    await cmdQueuePriority({ ...globalOpts(), id, priority });
  });

queueCmd
  .command('purge-dead')
  .description('Delete dead/failed/cancelled jobs')
  .option('-y, --yes', 'Confirm purge')
  .action(async (opts: { yes?: boolean }) => {
    await cmdQueuePurgeDead({ ...globalOpts(), yes: opts.yes });
  });

// ——— DDoS ———
const ddosCmd = program
  .command('ddos')
  .description('DDoS policy and IP blacklist')
  .action(async () => {
    await cmdDdosSummary(globalOpts());
  });

const ddosPolicyCmd = ddosCmd
  .command('policy')
  .description('DDoS policy get/set/preset/reset')
  .action(async () => {
    await cmdDdosPolicyGet(globalOpts());
  });

ddosPolicyCmd
  .command('get')
  .description('Show DDoS policy')
  .action(async () => {
    await cmdDdosPolicyGet(globalOpts());
  });

ddosPolicyCmd
  .command('set')
  .description('Update DDoS policy fields')
  .option('--auto-ban <on|off>')
  .option('--rate-limit-max <n>', '', (v: string) => Number(v))
  .option('--rate-limit-ip-max <n>', '', (v: string) => Number(v))
  .option('--chat-burst-max <n>', '', (v: string) => Number(v))
  .option('--failed-auth-threshold <n>', '', (v: string) => Number(v))
  .option('--rate-hit-threshold <n>', '', (v: string) => Number(v))
  .option('--max-concurrent-per-ip <n>', '', (v: string) => Number(v))
  .option('--velocity-max-requests <n>', '', (v: string) => Number(v))
  .option('--proxy-trust-hops <n>', '', (v: string) => Number(v))
  .option('--proxy-ip-source <src>', 'auto|cloudflare|nginx|x-forwarded-for|socket')
  .action(async (opts: Record<string, unknown>) => {
    await cmdDdosPolicySet({
      ...globalOpts(),
      autoBan: opts.autoBan,
      rateLimitMax: opts.rateLimitMax,
      rateLimitIpMax: opts.rateLimitIpMax,
      chatBurstMax: opts.chatBurstMax,
      failedAuthThreshold: opts.failedAuthThreshold,
      rateHitThreshold: opts.rateHitThreshold,
      maxConcurrentPerIp: opts.maxConcurrentPerIp,
      velocityMaxRequests: opts.velocityMaxRequests,
      proxyTrustHops: opts.proxyTrustHops,
      proxyIpSource: opts.proxyIpSource,
    });
  });

ddosPolicyCmd
  .command('preset')
  .description('Apply DDoS preset: relaxed|balanced|strict')
  .argument('<name>', 'Preset name')
  .action(async (name: string) => {
    await cmdDdosPolicyPreset({ ...globalOpts(), name });
  });

ddosPolicyCmd
  .command('reset')
  .description('Reset DDoS policy to env defaults')
  .action(async () => {
    await cmdDdosPolicyReset(globalOpts());
  });

ddosCmd
  .command('ban')
  .description('Ban an IP')
  .argument('<ip>', 'IP address')
  .option('--ttl <seconds>', 'TTL seconds (omit = permanent)', (v) => Number(v))
  .option('--reason <text>', 'Ban reason')
  .action(async (ip: string, opts: { ttl?: number; reason?: string }) => {
    await cmdDdosBan({ ...globalOpts(), ip, ttl: opts.ttl, reason: opts.reason });
  });

ddosCmd
  .command('unban')
  .description('Remove IP from blacklist')
  .argument('<ip>', 'IP address')
  .action(async (ip: string) => {
    await cmdDdosUnban({ ...globalOpts(), ip });
  });

ddosCmd
  .command('blacklist')
  .description('List active blacklist entries')
  .action(async () => {
    await cmdDdosBlacklist(globalOpts());
  });

// ——— Documents / chats / conversations / audit ———
const docsCmd = program
  .command('docs')
  .description('Manage stored documents')
  .action(async () => {
    await cmdDocsList(globalOpts());
  });

docsCmd
  .command('list')
  .option('--limit <n>', '', (v: string) => Number(v))
  .option('--offset <n>', '', (v: string) => Number(v))
  .action(async (opts: { limit?: number; offset?: number }) => {
    await cmdDocsList({ ...globalOpts(), ...opts });
  });

docsCmd
  .command('show')
  .argument('<id>', 'Document id')
  .action(async (id: string) => {
    await cmdDocsShow({ ...globalOpts(), id });
  });

docsCmd
  .command('delete')
  .argument('<id>', 'Document id')
  .option('-y, --yes', 'Confirm delete')
  .action(async (id: string, opts: { yes?: boolean }) => {
    await cmdDocsDelete({ ...globalOpts(), id, yes: opts.yes });
  });

const chatsCmd = program
  .command('chats')
  .description('List API chat requests (audit log of completions)')
  .action(async () => {
    await cmdChatsList(globalOpts());
  });

chatsCmd
  .command('list')
  .option('--status <status>')
  .option('--limit <n>', '', (v: string) => Number(v))
  .option('--offset <n>', '', (v: string) => Number(v))
  .action(async (opts: { status?: string; limit?: number; offset?: number }) => {
    await cmdChatsList({ ...globalOpts(), ...opts });
  });

chatsCmd
  .command('show')
  .argument('<id>', 'Chat id or requestId')
  .action(async (id: string) => {
    await cmdChatsShow({ ...globalOpts(), id });
  });

const convCmd = program
  .command('conversations')
  .alias('conv')
  .description('Playground multi-turn conversation threads')
  .action(async () => {
    await cmdConversationsList(globalOpts());
  });

convCmd
  .command('list')
  .option('--limit <n>', '', (v: string) => Number(v))
  .option('--offset <n>', '', (v: string) => Number(v))
  .action(async (opts: { limit?: number; offset?: number }) => {
    await cmdConversationsList({ ...globalOpts(), ...opts });
  });

convCmd
  .command('delete')
  .argument('<id>', 'Conversation id')
  .option('-y, --yes', 'Confirm delete')
  .action(async (id: string, opts: { yes?: boolean }) => {
    await cmdConversationsDelete({ ...globalOpts(), id, yes: opts.yes });
  });

const auditCmd = program
  .command('audit')
  .description('Audit log viewer')
  .action(async () => {
    await cmdAuditList(globalOpts());
  });

auditCmd
  .command('list')
  .option('--action <action>', 'Filter by action')
  .option('--limit <n>', '', (v: string) => Number(v))
  .option('--offset <n>', '', (v: string) => Number(v))
  .action(async (opts: { action?: string; limit?: number; offset?: number }) => {
    await cmdAuditList({ ...globalOpts(), ...opts });
  });

program
  .command('stats')
  .description('Dashboard-style summary from local DB')
  .action(async () => {
    await cmdStats(globalOpts());
  });

program
  .command('models')
  .description('List Grok CLI models')
  .option('--refresh', 'Bypass cache')
  .action(async (opts: { refresh?: boolean }) => {
    await cmdModels({ ...globalOpts(), refresh: opts.refresh });
  });

const grokEnvCmd = program
  .command('grok')
  .description('Local Grok Build environment (inspect / sessions)');

grokEnvCmd
  .command('inspect')
  .description('Read-only grok inspect snapshot')
  .action(async () => {
    await cmdGrokInspect(globalOpts());
  });

const grokSessionsCmd = grokEnvCmd
  .command('sessions')
  .description('List local Grok CLI sessions')
  .option('-q, --q <text>', 'Search title / summary / id')
  .option('--cwd <path>', 'Filter by working directory')
  .option('--limit <n>', 'Max rows', (v: string) => Number(v))
  .action(async (opts: { q?: string; cwd?: string; limit?: number }) => {
    await cmdGrokSessionsList({ ...globalOpts(), ...opts });
  });

grokSessionsCmd
  .command('list')
  .description('List local Grok CLI sessions')
  .option('-q, --q <text>', 'Search title / summary / id')
  .option('--cwd <path>', 'Filter by working directory')
  .option('--limit <n>', 'Max rows', (v: string) => Number(v))
  .action(async (opts: { q?: string; cwd?: string; limit?: number }) => {
    await cmdGrokSessionsList({ ...globalOpts(), ...opts });
  });

grokSessionsCmd
  .command('delete')
  .description('Permanently delete a Grok CLI session')
  .argument('<id>', 'Session UUID')
  .option('--yes', 'Confirm delete')
  .action(async (id: string, opts: { yes?: boolean }) => {
    await cmdGrokSessionsDelete({ ...globalOpts(), id, yes: opts.yes });
  });

// ——— API features / Grok capability gates ———
const apiCmd = program
  .command('api')
  .description('API protocol & Grok capability feature flags');

const apiFeaturesCmd = apiCmd
  .command('features')
  .description('Show or change API feature flags (Admin parity)')
  .action(async () => {
    await cmdApiFeaturesGet(globalOpts());
  });

apiFeaturesCmd
  .command('get')
  .description('Show current API feature flags')
  .action(async () => {
    await cmdApiFeaturesGet(globalOpts());
  });

apiFeaturesCmd
  .command('set')
  .description('Set feature flags (on/off)')
  .option('--openai-chat <on|off>')
  .option('--openai-responses <on|off>')
  .option('--anthropic-messages <on|off>')
  .option('--tools <on|off>')
  .option('--structured-output <on|off>')
  .option('--vision <on|off>')
  .option('--reasoning-effort <on|off>')
  .option('--web-search <on|off>')
  .option('--subagents <on|off>')
  .option('--plan-mode <on|off>')
  .option('--memory <on|off>')
  .option('--session-resume <on|off>')
  .option('--best-of-n <on|off>')
  .option('--check-loop <on|off>')
  .option('--system-override <on|off>')
  .option('--rules <on|off>')
  .option('--permission-mode <on|off>')
  .option('--sandbox <on|off>')
  .option('--usage-estimate <on|off>')
  .option('--assistants-emulation <on|off>')
  .option('--strict-sampling <on|off>')
  .option('--force-disable-tools-in-safe <on|off>')
  .option('--images-api <on|off>')
  .option('--audio-api <on|off>')
  .option('--video-api <on|off>')
  .option('--files-openai-alias <on|off>')
  .action(async (opts: Record<string, string | undefined>) => {
    await cmdApiFeaturesSet({
      ...globalOpts(),
      openaiChat: opts.openaiChat,
      openaiResponses: opts.openaiResponses,
      anthropicMessages: opts.anthropicMessages,
      tools: opts.tools,
      structuredOutput: opts.structuredOutput,
      vision: opts.vision,
      reasoningEffort: opts.reasoningEffort,
      webSearch: opts.webSearch,
      subagents: opts.subagents,
      planMode: opts.planMode,
      memory: opts.memory,
      sessionResume: opts.sessionResume,
      bestOfN: opts.bestOfN,
      checkLoop: opts.checkLoop,
      systemOverride: opts.systemOverride,
      rules: opts.rules,
      permissionMode: opts.permissionMode,
      sandbox: opts.sandbox,
      usageEstimate: opts.usageEstimate,
      assistantsEmulation: opts.assistantsEmulation,
      strictSampling: opts.strictSampling,
      forceDisableToolsInSafe: opts.forceDisableToolsInSafe,
      imagesApi: opts.imagesApi,
      audioApi: opts.audioApi,
      videoApi: opts.videoApi,
      filesOpenAiAlias: opts.filesOpenAiAlias,
    });
  });

apiFeaturesCmd
  .command('preset')
  .description('Apply preset: open | locked | dev')
  .argument('<name>', 'Preset name')
  .action(async (name: string) => {
    await cmdApiFeaturesPreset({ ...globalOpts(), name });
  });

program
  .command('doctor')
  .description(
    'Check Node, Grok CLI, env (proxy/port), build, runner (gctoac/PM2), conflicts',
  )
  .action(async () => {
    await cmdDoctor(globalOpts());
  });

program
  .command('open')
  .description('Print API / Admin URLs')
  .option('--admin', 'Print admin URL only')
  .action(async (opts: { admin?: boolean }) => {
    await cmdOpen({ ...globalOpts(), admin: opts.admin });
  });

const logsCmd = program
  .command('logs')
  .description('Show or clear gateway log files (pm2 + gctoac)')
  .option('-n, --lines <n>', 'Tail lines (default 40)', (v) => Number(v))
  .action(async (opts: { lines?: number }) => {
    await cmdLogsShow({ ...globalOpts(), lines: opts.lines });
  });

logsCmd
  .command('clear')
  .description('Truncate pm2-error/out and gctoac log files')
  .action(async () => {
    await cmdLogsClear(globalOpts());
  });

logsCmd
  .command('show')
  .description('Print tail of log files')
  .option('-n, --lines <n>', 'Tail lines (default 40)', (v) => Number(v))
  .action(async (opts: { lines?: number }) => {
    await cmdLogsShow({ ...globalOpts(), lines: opts.lines });
  });

program
  .command('version')
  .description('Show package version')
  .action(() => {
    cmdVersion();
  });

program
  .command('update')
  .description('Self-update this package (npm / git / GitHub)')
  .option('--check', 'Only check for updates')
  .option('--no-restart', 'Do not restart gateway after update')
  .option(
    '--channel <name>',
    'Force channel: auto | git | npm-global | npm-local',
    'auto',
  )
  .action(
    async (opts: {
      check?: boolean;
      restart?: boolean;
      channel?: 'auto' | 'git' | 'npm-global' | 'npm-local';
    }) => {
      await cmdUpdate({
        ...globalOpts(),
        check: opts.check,
        restart: opts.restart,
        channel: opts.channel,
      });
    },
  );

program
  .parseAsync(process.argv)
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .then(() => {
    // Commands that use undici/fetch must hard-exit themselves (e.g. update).
    // If still alive and no open handles intended, allow natural exit.
  });
