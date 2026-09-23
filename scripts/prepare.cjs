/**
 * Runs on npm install (local dev + published package).
 * - Chmod CLI bin when dist/ is present (npm pack includes dist/)
 * - In a git checkout without dist/, rebuild if TypeScript is available
 * - Generate Prisma client for this platform
 * Uses execFile only (no shell spawn).
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const cliJs = path.join(root, 'dist', 'cli', 'index.js');

function log(msg) {
  console.log(`[gctoac] ${msg}`);
}
function warn(msg) {
  console.warn(`[gctoac] ${msg}`);
}

function which(cmd) {
  const paths = (process.env.PATH || '').split(path.delimiter);
  const exts =
    process.platform === 'win32' ? ['.cmd', '.exe', '.bat', ''] : [''];
  for (const dir of paths) {
    for (const ext of exts) {
      const p = path.join(dir, cmd + ext);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function run(bin, args) {
  execFileSync(bin, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
}

// 1) dist/ comes from npm pack (prepublishOnly build) or local `npm run build`
if (fs.existsSync(cliJs)) {
  try {
    fs.chmodSync(cliJs, 0o755);
  } catch {
    /* ignore */
  }
  log('dist/ OK');
} else {
  const tsc = path.join(root, 'node_modules', 'typescript', 'lib', 'tsc.js');
  if (fs.existsSync(tsc)) {
    log('dist/ missing — building TypeScript…');
    try {
      run(process.execPath, [tsc, '-p', 'tsconfig.json']);
      try {
        fs.chmodSync(cliJs, 0o755);
      } catch {
        /* ignore */
      }
      log('dist/ built');
    } catch (e) {
      warn(`build failed: ${e instanceof Error ? e.message : e}`);
    }
  } else {
    warn(
      'dist/ missing — install from npm (`npm install -g grok-cli-to-openai-compatible`) or run `npm run build` in a full checkout',
    );
  }
}

// 2) Prisma client for current platform
const schema = path.join(root, 'prisma', 'schema.prisma');
if (fs.existsSync(schema)) {
  log('Generating Prisma client for this platform…');
  try {
    const localPrisma = path.join(root, 'node_modules', 'prisma', 'build', 'index.js');
    if (fs.existsSync(localPrisma)) {
      run(process.execPath, [localPrisma, 'generate']);
      log('Prisma client ready');
    } else {
      const npmBin = which('npm');
      if (npmBin) {
        run(npmBin, [
          'exec',
          '--yes',
          '--package=prisma@6.5.0',
          '--',
          'prisma',
          'generate',
        ]);
        log('Prisma client ready');
      } else {
        warn('prisma CLI not found — skip generate (run: npm install)');
      }
    }
  } catch (e) {
    warn(`prisma generate failed: ${e instanceof Error ? e.message : e}`);
    warn('You can retry: npx prisma@6.5.0 generate');
  }
}
