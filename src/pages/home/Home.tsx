import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import styles from './Home.module.css';
import layout from '../page.module.css';
import { useGsapFadeIn } from '../../hooks/useGsapFadeIn';

/** A feature card linking to a portfolio section */
interface Feature {
  title: string;
  description: string;
  link: string;
}

/** Feature cards displayed on the home page */
const FEATURES: Feature[] = [
  { title: 'About Me', description: 'Learn about my background and interests.', link: '/about' },
  { title: 'Education', description: 'My academic journey and qualifications.', link: '/education' },
  { title: 'Knowledge', description: 'Professional skills and expertise.', link: '/knowledge' },
  { title: 'Gallery', description: 'Photo gallery of projects and events.', link: '/gallery' },
  { title: 'Videos', description: 'Video showcases and presentations.', link: '/videos' },
  { title: 'Blog', description: 'Articles and thoughts on technology.', link: '/blog' },
  { title: 'Messaging', description: 'Send me a message and get an auto-reply.', link: '/messaging' },
  { title: 'README', description: 'Project overview and documentation.', link: '/readme' },
];

/** Home page — hero section and feature cards with GSAP entrance animations */
const Home: React.FC = () => {
  // Hero section — fade-in + slide-up on mount
  const heroRef = useGsapFadeIn<HTMLElement>();

  // Feature cards — staggered fade-in, each card animates in sequence
  const featuresRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!featuresRef.current) return;
    const cards = featuresRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className={layout.container}>
      <section ref={heroRef} className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to My Portfolio</h1>
        <p className={styles.heroSubtitle}>
          Hi, I am Kewei — a software engineering student at the University of Limerick, passionate about building modern web applications.
        </p>
        <Link to="/about" className={styles.ctaButton}>
          Learn More About Me
        </Link>
      </section>

      <section ref={featuresRef} className={styles.features}>
        {FEATURES.map((feature) => (
          <Link key={feature.link} to={feature.link} className={styles.featureLink}>
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