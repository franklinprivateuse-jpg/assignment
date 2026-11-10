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
            I am <strong className={styles.bold}>Kewei</strong>, a Software Engineering student at the
            University of Limerick. I have been working in the software industry for
            <strong className={styles.bold}> seven years</strong>, with experience at
            Fortune 500 companies{' '}
            <a href="https://www.jd.com" target="_blank" rel="noopener noreferrer">JD.com</a> and{' '}
            <a href="https://www.longfor.com" target="_blank" rel="noopener noreferrer">Longfor.com</a>, as well as the Singapore-based
            company <a href="https://www.advance.ai" target="_blank" rel="noopener noreferrer">Advance.ai</a>.
          </p>
          <p>
            I primarily work on <strong className={styles.bold}>backend development</strong>,
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