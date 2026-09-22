import styles from './About.module.css';
import layout from '../page.module.css';

/** About page — personal introduction and interests */
const About: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>About Me</h1>

      <div className={styles.profileSection}>
        <div className={styles.profileInfo}>
          <p>
            I am <span className={styles.highlight}>Kewei</span>, a Software Engineering student at the
            University of Limerick. I have been working in the software industry for
            <span className={styles.highlight}> seven years</span>, with experience at
            Fortune 500 companies <span className={styles.highlight}>JD.com</span> and{' '}
            <span className={styles.highlight}>Longfor.com</span>, as well as the Singapore-based
            company <span className={styles.highlight}>Advance.ai</span>.
          </p>
          <p>
            I primarily work on <span className={styles.highlight}>backend development</span>,
            with extensive experience in building scalable and robust server-side systems.
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
          <div className={layout.card}>Requirements Engineering</div>
        </div>
      </section>
    </div>
  );
};

export default About;