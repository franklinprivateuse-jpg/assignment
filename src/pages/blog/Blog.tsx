import styles from './Blog.module.css';
import layout from '../page.module.css';
import { Link } from 'react-router-dom';
import type { BlogPost } from './types';

/** Static blog post data */
const POSTS: BlogPost[] = [
  {
    id: 1,
    date: '2025-09-01',
    title: 'What is the Relationship Between React and JavaScript?',
    excerpt: 'Understanding how React relates to JavaScript and why you need to master JavaScript before learning React.',
  },
];

/** Blog page — lists articles and thoughts on software development */
const Blog: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Blog</h1>
      <p className={layout.subtitle}>Articles and thoughts on software development</p>
      <div className={styles.postList}>
        {POSTS.map((post) => (
          <article key={post.id} className={styles.postCard}>
            <div className={styles.postDate}>{post.date}</div>
            {post.id === 1 ? (
              <Link to={`/blog/${post.id}`} className={styles.postTitleLink}>
                <h3 className={styles.postTitle}>{post.title}</h3>
              </Link>
            ) : (
              <h3 className={styles.postTitle}>{post.title}</h3>
            )}
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;