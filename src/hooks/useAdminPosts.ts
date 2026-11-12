import { useState, useEffect, useCallback } from 'react';
import type { BlogPost } from '../pages/blog/types';
import { isBackendDown, BACKEND_DOWN_MSG } from '../utils/backend';

/** Form data for creating or updating a blog post */
export interface PostFormData {
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

/**
 * Custom hook for admin blog post management.
 * Performs CRUD via the backend API with the X-Admin-Token header.
 * The token comes from the Admin page; this hook assumes it is valid.
 */
export function useAdminPosts(token: string) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumping this counter re-triggers the list fetch (manual refresh)
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch the post list whenever refresh is requested.
  // Inline async IIFE + cancelled guard: every setState call sits AFTER
  // the await, so nothing runs synchronously in the effect body
  // (required by the react-hooks/set-state-in-effect lint rule).
  useEffect(() => {
    let cancelled = false;
    console.info('[admin-blog] Fetching post list...');
    (async () => {
      try {
        const res = await fetch('/api/v1/posts', {
          headers: { 'X-Admin-Token': token },
        });
        if (cancelled) return;
        if (res.status === 401) {
          console.warn('[admin-blog] Invalid admin token (401)');
          setError('Invalid admin token.');
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogPost[] = await res.json();
        console.info(`[admin-blog] Loaded ${data.length} post(s)`);
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error('[admin-blog] Failed to load posts');
        if (!cancelled)
          setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not load posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, refreshKey]);

  /** Create a new post via POST; returns true on success */
  const createPost = useCallback(
    async (data: PostFormData): Promise<boolean> => {
      console.info('[admin-blog] Creating post...');
      try {
        const res = await fetch('/api/v1/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.info('[admin-blog] Post created');
        setRefreshKey((k) => k + 1);
        return true;
      } catch (err) {
        console.error('[admin-blog] Failed to create post');
        setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not create post.');
        return false;
      }
    },
    [token],
  );

  /** Update an existing post via PUT; returns true on success */
  const updatePost = useCallback(
    async (id: number, data: PostFormData): Promise<boolean> => {
      console.info(`[admin-blog] Updating post ${id}...`);
      try {
        const res = await fetch(`/api/v1/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.info(`[admin-blog] Post ${id} updated`);
        setRefreshKey((k) => k + 1);
        return true;
      } catch (err) {
        console.error(`[admin-blog] Failed to update post ${id}`);
        setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not update post.');
        return false;
      }
    },
    [token],
  );

  /** Delete a post via DELETE; returns true on success */
  const deletePost = useCallback(
    async (id: number): Promise<boolean> => {
      console.info(`[admin-blog] Deleting post ${id}...`);
      try {
        const res = await fetch(`/api/v1/posts/${id}`, {
          method: 'DELETE',
          headers: { 'X-Admin-Token': token },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.info(`[admin-blog] Post ${id} deleted`);
        setRefreshKey((k) => k + 1);
        return true;
      } catch (err) {
        console.error(`[admin-blog] Failed to delete post ${id}`);
        setError(isBackendDown(err) ? BACKEND_DOWN_MSG : 'Could not delete post.');
        return false;
      }
    },
    [token],
  );

  return { posts, loading, error, createPost, updatePost, deletePost };
}