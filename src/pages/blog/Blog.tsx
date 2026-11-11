import styles from './Blog.module.css';
import layout from '../page.module.css';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { formatReadableDate } from '../../utils/date';

/**
 * Blog page — the public article list.
 *
 * Data flow:
 *   usePosts hook → GET /api/v1/posts (list view, no content field)
 *   → renders one card per post with date, title link, and excerpt.
 *
 * The list endpoint returns posts ordered newest-first (id DESC);
 * each card links to /blog/:id where the full article is rendered
 * by the BlogDetail page.
 */
const Blog: React.FC = () => {
  // posts: list of PostVO from the API (id, date, title, excerpt — no content)
  // loading: true while the fetch is in flight
  // error: message string if the fetch failed, otherwise null
  const { posts, loading, error } = usePosts();

  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Blog</h1>
      <p className={layout.subtitle}>Articles and thoughts on software development</p>

      {/* Loading state — shown while the API request is in flight */}
      {loading && <p className={styles.statusMessage}>Loading posts...</p>}

      {/* Error state — shown if the backend is down or returns a non-2xx status */}
      {error && <p className={styles.statusMessage}>{error}</p>}

      {/* Empty state — the request succeeded but the database has no posts yet */}
      {!loading && !error && posts.length === 0 && (
        <p className={styles.statusMessage}>No posts yet. Check back soon!</p>
      )}

      {/* Post list — one card per article; the excerpt gives a preview
          so visitors can scan titles without opening each post */}
      <div className={styles.postList}>
        {posts.map((post) => (
          <article key={post.id} className={styles.postCard}>
            {/* Post date — formatted for readability (e.g. "Sep 1, 2025") */}
            <div className={styles.postDate}>{formatReadableDate(post.date)}</div>
            {/* Title as a link — navigates to the detail page where the
                full Markdown content is fetched and rendered */}
            <Link to={`/blog/${post.id}`} className={styles.postTitleLink}>
              <h3 className={styles.postTitle}>{post.title}</h3>
            </Link>
            {/* Excerpt — short summary from the API; the full content is
                only loaded on the detail page to keep this list light */}
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;