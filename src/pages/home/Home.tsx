import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import layout from '../page.module.css';

interface Feature {
  title: string;
  description: string;
  link: string;
}

const FEATURES: Feature[] = [
  { title: 'About Me', description: 'Learn about my background and interests.', link: '/about' },
  { title: 'Education', description: 'My academic journey and qualifications.', link: '/education' },
  { title: 'Knowledge', description: 'Professional skills and expertise.', link: '/knowledge' },
  { title: 'Gallery', description: 'Photo gallery of projects and events.', link: '/gallery' },
  { title: 'Videos', description: 'Video showcases and presentations.', link: '/videos' },
  { title: 'Blog', description: 'Articles and thoughts on technology.', link: '/blog' },
];

const Home: React.FC = () => {
  return (
    <div className={layout.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to My Portfolio</h1>
        <p className={styles.heroSubtitle}>
          Hi, I am Kewei — a software engineering student passionate about building modern web applications.
        </p>
        <Link to="/about" className={styles.ctaButton}>
          Learn More About Me
        </Link>
      </section>

      <section className={styles.features}>
        {FEATURES.map((feature) => (
          <Link key={feature.link} to={feature.link} style={{ textDecoration: 'none' }}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Home;