import styles from './About.module.css';
import layout from '../page.module.css';

const About: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>About Me</h1>

      <div className={styles.profileSection}>
        <div className={styles.profileInfo}>
          <p>
            I am <span className={styles.highlight}>Kewei</span>, a Software Engineering student at the
            University of Limerick. I am passionate about modern web development,
            software architecture, and building user-friendly applications.
          </p>
          <p>
            My interests span across front-end and back-end technologies,
            with a focus on <span className={styles.highlight}>React</span>,{' '}
            <span className={styles.highlight}>TypeScript</span>, and{' '}
            <span className={styles.highlight}>Node.js</span>.
          </p>
          <p>
            I believe in writing clean, maintainable code and continuously
            learning new technologies to solve real-world problems.
          </p>
        </div>
      </div>

      <section className={layout.section}>
        <h2 className={layout.subtitle}>Interests</h2>
        <div className={layout.cardGrid}>
          <div className={layout.card}>Web Development</div>
          <div className={layout.card}>Software Architecture</div>
          <div className={layout.card}>Open Source</div>
        </div>
      </section>
    </div>
  );
};

export default About;