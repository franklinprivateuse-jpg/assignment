/**
 * Shared helpers for backend API error handling.
 *
 * fetch() only throws a TypeError when the request never reaches the
 * server (network failure, server down, CORS blocked). HTTP errors
 * (4xx/5xx) do NOT throw — they are handled separately via res.ok.
 */

/** Detect whether a fetch failure means the backend is unreachable
 *  (network error / server not started) rather than an HTTP error. */
export function isBackendDown(err: unknown): boolean {
  return err instanceof TypeError;
}
    
/** Friendly message shown when the backend cannot be reached at all */
export const BACKEND_DOWN_MSG =
  'Backend service is not running yet. Please try again later.';