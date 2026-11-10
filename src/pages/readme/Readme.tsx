import ReactMarkdown from 'react-markdown';
// The README.md file is imported as a raw string and rendered as HTML,
// so the page always shows the same content as the repository README.
import readmeContent from '../../../README.md?raw';
import styles from './Readme.module.css';
import layout from '../page.module.css';

/** README page — renders the repository's README.md directly */
const Readme: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>README</h1>
      <div className={styles.readmeContent}>
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Readme;