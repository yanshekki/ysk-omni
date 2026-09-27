import pkg from '../../../package.json';

export const APP_VERSION: string = String(
  (pkg as { version?: string }).version || '',
);
