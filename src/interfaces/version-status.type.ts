/** How local package version compares to registry / channel */
export type VersionStatus =
  | 'update_available'
  | 'up_to_date'
  | 'ahead'
  | 'unknown';
