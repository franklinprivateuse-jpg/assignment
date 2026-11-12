import { useState, useEffect } from 'react';
import type { BlogPost } from '../pages/blog/types';
import { isBackendDown, BACKEND_DOWN_MSG } from '../utils/backend';

/**
 * Custom hook for a single blog post detail.
 * Fetches GET /api/v1/posts/{id} from the backend (detail view, with content).
 * Re-fetches when the id changes (navigating between posts).
 */
export function usePost(id: string | undefined): {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
} {
  const [post, setPost] = useState<BlogPost | null>(null);
  // Initial loading: true when there is an id to fetch, false otherwise.
  // This avoids a synchronous setState in the effect body (ESLint set-state-in-effect).
  const [loading, setLoading] = useState(() => !!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: no id in the URL — nothing to fetch
    if (!id) return;
    let cancelled = false;
    console.info(`[blog] Fetching post ${id}...`);
    (async () => {
      // Reset state inside the async IIFE so no synchronous setState
      // happens in the effect body (re-fetch when id changes)
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/posts/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogPost = await res.json();
        console.info(`[blog] Loaded post ${id}: ${data.title}`);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) {
          setPost(null);
          // Distinguish "backend not running" (network error) from HTTP errors
          setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not load this post.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { post, loading, error };
}