/**
 * Shared helpers for backend API error handling.
 *
 * fetch() only throws a TypeError when the request never reaches the
 * server (network failure, server down, CORS blocked). HTTP errors
 * (4xx/5xx) do NOT throw — they are handled separately via res.ok.
 */

/**
 * Detect whether a fetch failure means the backend is unreachable.
 *
 * Three real-world cases:
 *  1. TypeError        — true network failure (server down, CORS blocked)
 *  2. HTTP 500         — Vite dev proxy returns 500 when the backend
 *                        refuses the connection (ECONNREFUSED)
 *  3. HTTP 404         — on GitHub Pages there is no /api route, so the
 *                        static host returns 404 for every API call
 */
export function isBackendDown(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  // HTTP 502: Vite dev proxy returns 502 when backend refuses connection
  // HTTP 404: GitHub Pages has no /api route, returns 404 for every API call
  if (err instanceof Error && /HTTP (404|502)/.test(err.message)) return true;
  return false;
}
    
/** Friendly message shown when the backend cannot be reached at all */
export const BACKEND_DOWN_MSG =
  'Backend service is not running yet. Please try again later.';