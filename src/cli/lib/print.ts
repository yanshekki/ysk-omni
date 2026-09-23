export function info(msg: string): void {
  console.log(msg);
}

export function ok(msg: string): void {
  console.log(`✓ ${msg}`);
}

export function warn(msg: string): void {
  console.warn(`⚠ ${msg}`);
}

export function fail(msg: string): void {
  console.error(`✗ ${msg}`);
}

export function baseUrls(port: number, host = '127.0.0.1'): { api: string; admin: string; health: string } {
  const h = host === '0.0.0.0' ? '127.0.0.1' : host;
  return {
    api: `http://${h}:${port}/v1`,
    admin: `http://${h}:${port}/admin/`,
    health: `http://${h}:${port}/health`,
  };
}
