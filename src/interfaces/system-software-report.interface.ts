import type { SoftwareCheck } from './software-check.interface';

export interface SystemSoftwareReport {
  allRequiredOk: boolean;
  checks: SoftwareCheck[];
}
