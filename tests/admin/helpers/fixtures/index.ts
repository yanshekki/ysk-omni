import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

export function loadFixture<T = unknown>(name: string): T {
  const file = name.endsWith('.json') ? name : `${name}.json`;
  const raw = readFileSync(path.join(dir, file), 'utf8');
  return JSON.parse(raw) as T;
}

export const fixtures = {
  chatsList: () => loadFixture('chats.list'),
  keysList: () => loadFixture('keys.list'),
  documentsList: () => loadFixture('documents.list'),
  mediaAssets: () => loadFixture('media.assets'),
  mediaJobs: () => loadFixture('media.jobs'),
  stats: () => loadFixture('stats.dashboard'),
  usage: () => loadFixture('usage.summary'),
  apiFeatures: () => loadFixture('api-features.get'),
  authLogin: () => loadFixture('auth.login'),
  me: () => loadFixture('me'),
  models: () => loadFixture('models.catalog'),
  settings: () => loadFixture('settings.get'),
  audit: () => loadFixture('audit.list'),
  system: () => loadFixture('system.get'),
  ddos: () => loadFixture('ddos.stats'),
  queue: () => loadFixture('queue.stats'),
  pm2: () => loadFixture('pm2.status'),
};
