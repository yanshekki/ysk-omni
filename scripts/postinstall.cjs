/**
 * Lightweight postinstall — delegates to prepare (idempotent).
 * Kept separate so npm lifecycle is clear.
 */
require('./prepare.cjs');
