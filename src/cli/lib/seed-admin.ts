import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import {
  apiKeyPrefix,
  createApiKeySecret,
  hashApiKey,
} from '../../utils/api-key-crypto';

export interface SeedAdminResult {
  created: boolean;
  id: string;
  name: string;
  keyPrefix: string;
  /** Plaintext only when a new key was created */
  rawKey?: string;
}

/**
 * Seed bootstrap admin API key using PrismaClient directly (no tsx / npx).
 */
export async function seedAdmin(options?: {
  databaseUrl?: string;
  bootstrapKey?: string;
  port?: string | number;
}): Promise<SeedAdminResult> {
  const databaseUrl = options?.databaseUrl || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for seed');
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const existingAdmin = await prisma.apiKey.findFirst({
      where: { role: 'admin', isActive: true },
    });

    if (existingAdmin) {
      await prisma.apiKey.update({
        where: { id: existingAdmin.id },
        data: { mode: 'agent' },
      });
      const port = String(options?.port ?? process.env.PORT ?? '3847');
      console.log('Admin API key already exists:');
      console.log(`  id:     ${existingAdmin.id}`);
      console.log(`  name:   ${existingAdmin.name}`);
      console.log(`  prefix: ${existingAdmin.keyPrefix}`);
      console.log('  mode:   agent (ensured)');
      console.log(`Admin panel: http://127.0.0.1:${port}/admin/`);
      console.log('Plaintext key is not recoverable.');
      console.log('Create a new admin key (printed once): gctoac key create');
      return {
        created: false,
        id: existingAdmin.id,
        name: existingAdmin.name,
        keyPrefix: existingAdmin.keyPrefix,
      };
    }

    const rawKey =
      options?.bootstrapKey?.trim() ||
      process.env.ADMIN_BOOTSTRAP_KEY?.trim() ||
      createApiKeySecret();
    const keyHash = hashApiKey(rawKey);
    const prefix = apiKeyPrefix(rawKey);

    const created = await prisma.apiKey.create({
      data: {
        id: randomUUID(),
        name: 'bootstrap-admin',
        keyPrefix: prefix,
        keyHash,
        role: 'admin',
        mode: 'agent',
        rateLimit: 120,
      },
    });

    const port = String(options?.port ?? process.env.PORT ?? '3847');
    console.log(
      'Created bootstrap admin API key (store it securely — shown once):',
    );
    console.log(`  id:   ${created.id}`);
    console.log(`  key:  ${rawKey}`);
    console.log('');
    console.log(`Admin panel: http://127.0.0.1:${port}/admin/`);
    console.log('CLI: gctoac start | gctoac status | gctoac open');
    console.log('API example:');
    console.log(
      `  curl -s http://127.0.0.1:${port}/admin/api/me -H "Authorization: Bearer ${rawKey}"`,
    );

    return {
      created: true,
      id: created.id,
      name: created.name,
      keyPrefix: created.keyPrefix,
      rawKey,
    };
  } finally {
    await prisma.$disconnect();
  }
}
