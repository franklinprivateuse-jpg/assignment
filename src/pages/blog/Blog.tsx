import styles from './Blog.module.css';
import layout from '../page.module.css';
import { Link } from 'react-router-dom';
import { POSTS } from '../../data/posts';
import { formatReadableDate } from '../../utils/date';

/** Blog page — lists articles and thoughts on software development */
const Blog: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Blog</h1>
      <p className={layout.subtitle}>Articles and thoughts on software development</p>
      <div className={styles.postList}>
        {POSTS.map((post) => (
          <article key={post.id} className={styles.postCard}>
            <div className={styles.postDate}>{formatReadableDate(post.date)}</div>
            <Link to={`/blog/${post.id}`} className={styles.postTitleLink}>
              <h3 className={styles.postTitle}>{post.title}</h3>
            </Link>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;