import { defineConfig } from 'vitest/config';

/**
 * Admin tests use two projects:
 * - admin-node: L1 pure + L2 services (node env + browser shim)
 * - admin-dom:  L3 page render (happy-dom)
 * Server unit/integration stay on default node project.
 */
export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
    // One fork for the whole run — avoids tinypool worker recycle
    // ERR_MODULE_NOT_FOUND after prisma generate / long integration files.
    pool: 'forks',
    maxWorkers: 1,
    poolOptions: {
      forks: { singleFork: true },
    },
    hookTimeout: 90_000,
    testTimeout: 60_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts', 'admin/src/**/*.ts'],
      exclude: [
        'src/server.ts',
        'src/app.ts',
        'admin/src/pages/chat/playground.ts',
        'admin/src/i18n/messages.ts',
      ],
    },
    projects: [
      {
        test: {
          name: 'server',
          environment: 'node',
          setupFiles: ['./tests/setup.ts'],
          include: [
            'tests/unit/**/*.test.ts',
            'tests/integration/**/*.test.ts',
          ],
          exclude: ['tests/admin/**'],
          fileParallelism: false,
          hookTimeout: 90_000,
          testTimeout: 60_000,
        },
      },
      {
        test: {
          name: 'admin-node',
          environment: 'node',
          setupFiles: ['./tests/setup.ts'],
          include: [
            'tests/admin/unit/l1/**/*.test.ts',
            'tests/admin/unit/l2/**/*.test.ts',
            'tests/admin/contract/**/*.test.ts',
          ],
          fileParallelism: false,
          testTimeout: 30_000,
        },
      },
      {
        test: {
          name: 'admin-dom',
          environment: 'happy-dom',
          setupFiles: ['./tests/setup.ts'],
          include: ['tests/admin/unit/l3/**/*.test.ts'],
          fileParallelism: false,
          testTimeout: 30_000,
        },
      },
    ],
  },
});
