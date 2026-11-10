import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import layout from '../page.module.css';

/** NotFound page — displayed when the URL does not match any route */
const NotFound: React.FC = () => {
  return (
    <div className={layout.container}>
      <div className={styles.notFound}>
        <h1 className={styles.errorCode}>404</h1>
        <p className={styles.message}>Page Not Found</p>
        <p className={styles.detail}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className={styles.homeLink}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;