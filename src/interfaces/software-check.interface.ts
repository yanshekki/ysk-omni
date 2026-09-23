import type { SoftwareId } from './software-id.type';
import type { SoftwareLevel } from './software-level.type';

export interface SoftwareCheck {
  id: SoftwareId;
  name: string;
  level: SoftwareLevel;
  requiredVersion?: string;
  installed: boolean;
  version: string | null;
  path: string | null;
  ok: boolean;
  detail?: string;
}
