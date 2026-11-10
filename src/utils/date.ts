/** Format an ISO date string (e.g. "2025-09-01") as a readable date (e.g. "1 September 2025") */
export function formatReadableDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}