/**
 * Returns true when an ISO date string is within the last `days` days
 * (default 14). Used to drive the "NEW" badge on brand and product cards.
 * Items without an addedAt date never count as new.
 */
export function isRecent(addedAt: string | undefined | null, days = 14): boolean {
  if (!addedAt) return false;
  const ts = Date.parse(addedAt);
  if (Number.isNaN(ts)) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return ts >= cutoff;
}