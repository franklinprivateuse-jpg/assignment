/**
 * BlogDetail page — renders a single blog post fetched from the backend API.
 *
 * Route: /blog/:id — the :id param is extracted via useParams and passed
 * to the usePost hook, which calls GET /api/v1/posts/{id} (detail view,
 * includes the full content field that the list view omits).
 *
 * Rendering conditions:
 *   loading → "Loading post..." placeholder
 *   error   → error message (backend down or non-2xx response)
 *   !post   → "Post Not Found" heading (404 from the API or bad id)
 *   post    → title + date + Markdown-rendered content
 *
 * The back link returns to /blog without a refetch because the Blog page
 * remounts and its usePosts hook fetches a fresh list.
 */
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { usePost } from '../../hooks/usePost';
import styles from './BlogDetail.module.css';
import layout from '../page.module.css';
import { formatReadableDate } from '../../utils/date';

const BlogDetail: React.FC = () => {
  // Extract the :id route param — undefined if the route matched without it
  const { id } = useParams<{ id: string }>();
  // post: PostDetailVO from the API (includes content), or null if not found
  // loading: starts true when id exists (avoids flashing "Not Found" prematurely)
  // error: message string if the fetch failed
  const { post, loading, error } = usePost(id);

  return (
    <div className={layout.container}>
      {/* Back navigation — returns to the article list */}
      <Link to="/blog" className={styles.backLink}>← Back to Blog</Link>

      {/* Loading state — shown while the detail fetch is in flight */}
      {loading && <p className={styles.statusMessage}>Loading post...</p>}

      {/* Error state — backend unreachable or returned a server error */}
      {error && <p className={styles.statusMessage}>{error}</p>}

      {/* Not-found state — the API returned 404, meaning no post exists
          with this id (deleted or an invalid URL typed manually) */}
      {!loading && !error && !post && (
        <h1 className={layout.title}>Post Not Found</h1>
      )}

      {/* Post found — render the full article */}
      {post && (
        <>
          {/* Header: title and formatted date (e.g. "Sep 1, 2025") */}
          <h1 className={layout.title}>{post.title}</h1>
          <p className={styles.postDate}>{formatReadableDate(post.date)}</p>
          {/* Markdown content — rendered by react-markdown; the guard
              handles the edge case where content is empty or missing.
              The detail endpoint always returns content, but the optional
              check keeps the type system happy (content?: string) */}
          {post.content && (
            <div className={styles.postContent}>
              <Markdown>{post.content}</Markdown>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDetail;