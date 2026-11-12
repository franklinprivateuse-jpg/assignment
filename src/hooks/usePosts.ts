import { useState, useEffect } from 'react';
import type { BlogPost } from '../pages/blog/types';
import { isBackendDown, BACKEND_DOWN_MSG, API_BASE } from '../utils/backend';

/**
 * Custom hook for the blog post list.
 * Fetches GET /api/v1/posts from the backend (list view, no content field).
 * Follows the same pattern as useChat: loading/error states + cancelled guard.
 */
export function usePosts(): {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
} {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    console.info('[blog] Fetching post list...');
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/posts`);
        // fetch does NOT throw on 4xx/5xx, so check res.ok manually
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogPost[] = await res.json();
        console.info(`[blog] Loaded ${data.length} post(s)`);
        if (!cancelled) setPosts(data);
      } catch (err) {
        // Distinguish "backend not running" (network error) from HTTP errors
        if (!cancelled)
          setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not load blog posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    // Avoid setting state after the component unmounts
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}