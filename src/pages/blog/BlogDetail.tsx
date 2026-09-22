import { useParams, Link } from 'react-router-dom';
import styles from './BlogDetail.module.css';
import layout from '../page.module.css';

const POST_CONTENT: Record<string, { title: string; date: string; content: string }> = {
  '1': {
    title: 'What is the Relationship Between React and JavaScript?',
    date: '2025-09-01',
    content: `React is a JavaScript library — it is not a separate language, it is JavaScript.

## What React Does

- **Components**: Break UI into reusable pieces.
- **Declarative**: You say what the UI looks like, React updates the DOM.
- **State**: \`useState\` tracks data that changes.
- **Virtual DOM**: React only updates what changed, making it fast.

## Why Learn JavaScript First

Hooks are closures. Lists are array methods. Bugs are JavaScript bugs. Without JS basics, React will feel confusing.

## TL;DR

React = JavaScript + a smarter way to write UI. Learn JS first.`,
  },
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = id ? POST_CONTENT[id] : undefined;

  return (
    <div className={layout.container}>
      <Link to="/blog" className={styles.backLink}>← Back to Blog</Link>
      <h1 className={layout.title}>{post?.title ?? 'Post Not Found'}</h1>
      <p className={styles.postDate}>{post?.date}</p>
      {post && <div className={styles.postContent}>{post.content}</div>}
    </div>
  );
};

export default BlogDetail;