import ReactMarkdown from 'react-markdown';
// A concise intro file lives next to this component (not the repo README,
// which contains developer-only changelogs too long for a portfolio page).
import introContent from './intro.md?raw';
import styles from './Readme.module.css';
import layout from '../page.module.css';

/** Intro page — renders a concise project overview (intro.md),
 *  not the full repository README which is too long for visitors */
const Readme: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>About This Project</h1>
      <div className={styles.readmeContent}>
        <ReactMarkdown>{introContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Readme;