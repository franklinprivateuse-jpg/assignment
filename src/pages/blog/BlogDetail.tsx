/**
 * BlogDetail page — renders a single blog post from the shared POSTS data.
 * Looks up the post by the :id route parameter and renders its Markdown content.
 */
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import styles from './BlogDetail.module.css';
import layout from '../page.module.css';
import { POSTS } from '../../data/posts';
import { formatReadableDate } from '../../utils/date';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = POSTS.find((p) => p.id === Number(id));

  return (
    <div className={layout.container}>
      <Link to="/blog" className={styles.backLink}>← Back to Blog</Link>
      <h1 className={layout.title}>{post?.title ?? 'Post Not Found'}</h1>
      {post && <p className={styles.postDate}>{formatReadableDate(post.date)}</p>}
      {post?.content && (
        <div className={styles.postContent}>
          <Markdown>{post.content}</Markdown>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;