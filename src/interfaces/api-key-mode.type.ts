/**
 * Execution policy mode for an API key.
 * Single source of truth — re-exported as KeyMode from config/constants for legacy imports.
 */
export type ApiKeyMode = 'safe' | 'agent';

/** @deprecated Prefer ApiKeyMode — alias for historical KeyMode name */
export type KeyMode = ApiKeyMode;
