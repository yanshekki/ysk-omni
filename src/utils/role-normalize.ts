/**
 * Pure role / mode normalization (no DB). Used by API services + CLI.
 */
import { KEY_MODES, ROLES } from '../config/constants';
import type { ApiKeyMode, ApiKeyRole } from '../interfaces';

/**
 * Normalize legacy / CLI role aliases to canonical ApiKeyRole.
 * Historically CLI wrote `user` while API uses `client`.
 */
export function normalizeApiKeyRole(
  role: string | null | undefined,
): ApiKeyRole {
  const r = String(role || '')
    .trim()
    .toLowerCase();
  if (r === 'admin') return ROLES.ADMIN;
  // user is legacy alias for client
  return ROLES.CLIENT;
}

/** Resolve key mode; admin keys are always agent. */
export function normalizeApiKeyMode(
  role: ApiKeyRole | string,
  mode?: string | null,
): ApiKeyMode {
  const r = normalizeApiKeyRole(role);
  if (r === ROLES.ADMIN) return KEY_MODES.AGENT;
  return mode === KEY_MODES.AGENT ? KEY_MODES.AGENT : KEY_MODES.SAFE;
}
