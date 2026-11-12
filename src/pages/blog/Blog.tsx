import { useState } from 'react';
import styles from './Blog.module.css';
import layout from '../page.module.css';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { formatReadableDate } from '../../utils/date';

/**
 * Blog page — the public article list with keyword search.
 *
 * Data flow:
 *   usePosts hook → GET /api/v1/posts (list view, no content field)
 *   → client-side keyword filter on title and excerpt
 *   → renders one card per matching post with date, title link, and excerpt.
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

  // Search keyword — filters posts by title and excerpt (case-insensitive)
  const [keyword, setKeyword] = useState('');

  // Filter posts locally — the dataset is small so client-side filtering
  // gives instant results without extra API calls
  const filteredPosts = keyword.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(keyword.toLowerCase())
      )
    : posts;

  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Blog</h1>
      <p className={layout.subtitle}>Articles and thoughts on software development</p>

      {/* Search box — filters the post list by keyword as the user types */}
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Search posts by title or content..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        aria-label="Search posts"
      />

      {/* Loading state — shown while the API request is in flight */}
      {loading && <p className={styles.statusMessage}>Loading posts...</p>}

      {/* Error state — shown if the backend is down or returns a non-2xx status */}
      {error && <p className={styles.statusMessage}>{error}</p>}

      {/* Empty state — no posts at all, or no matches for the current keyword */}
      {!loading && !error && filteredPosts.length === 0 && (
        <p className={styles.statusMessage}>
          {keyword.trim() ? 'No posts match your search.' : 'No posts yet. Check back soon!'}
        </p>
      )}

      {/* Post list — one card per matching article; the excerpt gives a preview
          so visitors can scan titles without opening each post */}
      <div className={styles.postList}>
        {filteredPosts.map((post) => (
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