import styles from './Blog.module.css';
import layout from '../page.module.css';

interface BlogPost {
  id: number;
  date: string;
  title: string;
  excerpt: string;
}

const POSTS: BlogPost[] = [
  {
    id: 1,
    date: '2025-09-01',
    title: 'Getting Started with React and TypeScript',
    excerpt: 'A beginner-friendly guide to setting up a React project with TypeScript and Vite.',
  },
  {
    id: 2,
    date: '2025-08-15',
    title: 'CSS Modules vs Global CSS',
    excerpt: 'Why CSS Modules help prevent style conflicts and improve maintainability in large projects.',
  },
  {
    id: 3,
    date: '2025-07-20',
    title: 'Custom Hooks in React',
    excerpt: 'How to extract business logic into reusable custom hooks for cleaner component code.',
  },
];

const Blog: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Blog</h1>
      <p className={layout.subtitle}>Articles and thoughts on software development</p>
      <div className={styles.postList}>
        {POSTS.map((post) => (
          <article key={post.id} className={styles.postCard}>
            <div className={styles.postDate}>{post.date}</div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;