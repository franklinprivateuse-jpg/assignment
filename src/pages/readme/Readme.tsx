import styles from './Readme.module.css';
import layout from '../page.module.css';

const Readme: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>README</h1>
      <div className={styles.readmeContent}>
        <h2>Kewei Portfolio</h2>
        <p>
          A digital portfolio built with React, TypeScript, and Vite.
          This project showcases my background, skills, and projects
          as a Software Engineering student.
        </p>

        <h2>Tech Stack</h2>
        <ul>
          <li>React 19 + TypeScript</li>
          <li>Vite for build tooling</li>
          <li>React Router DOM for client-side routing</li>
          <li>CSS Modules for scoped styling</li>
        </ul>

        <h2>Project Structure</h2>
        <ul>
          <li><code>src/app/</code> — Global config (routes)</li>
          <li><code>src/pages/</code> — Page components</li>
          <li><code>src/components/</code> — Shared UI components</li>
          <li><code>src/hooks/</code> — Custom hooks</li>
          <li><code>src/assets/</code> — Static assets</li>
        </ul>

        <h2>Getting Started</h2>
        <p>
          Run <code>npm install</code> to install dependencies,
          then <code>npm run dev</code> to start the development server.
        </p>

        <h2>Coding Standards</h2>
        <p>
          This project follows the conventions defined in{' '}
          <code>requirements/coding-standards.md</code>, including CSS Modules,
          centralized theme variables, and custom hooks for business logic.
        </p>
      </div>
    </div>
  );
};

export default Readme;