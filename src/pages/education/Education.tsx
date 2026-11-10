import styles from './Education.module.css';
import layout from '../page.module.css';

/** A single education history entry */
interface EducationEntry {
  id: number;
  date: string;
  school: string;
  detail: string;
}

/** A single work experience entry */
interface ExperienceEntry {
  id: number;
  date: string;
  company: string;
  role: string;
}

/** Education history displayed in timeline order */
const EDUCATION_LIST: EducationEntry[] = [
  {
    id: 1,
    date: '2026 – Present',
    school: 'University of Limerick',
    detail: 'MSc in Software Engineering',
  },
];

/** Work experience displayed in timeline order */
const EXPERIENCE_LIST: ExperienceEntry[] = [
  {
    id: 1,
    date: '2025 – 2026',
    company: 'JD.com',
    role: 'Java Developer',
  },
  {
    id: 2,
    date: '2023 – 2025',
    company: 'Advance.ai',
    role: 'Backend Developer',
  },
  {
    id: 3,
    date: '2019 – 2023',
    company: 'Longfor.com',
    role: 'Software Engineer',
  },
];

/** Education page — academic timeline and work experience */
const Education: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Education</h1>
      <div className={styles.timeline}>
        {EDUCATION_LIST.map((entry) => (
          <div key={entry.id} className={styles.timelineItem}>
            <div className={styles.timelineDate}>{entry.date}</div>
            <h3 className={styles.timelineSchool}>{entry.school}</h3>
            <p className={styles.timelineDetail}>{entry.detail}</p>
          </div>
        ))}
      </div>

      <section className={layout.section}>
        <h2 className={layout.subtitle}>Work Experience</h2>
        <div className={styles.timeline}>
          {EXPERIENCE_LIST.map((entry) => (
            <div key={entry.id} className={styles.timelineItem}>
              <div className={styles.timelineDate}>{entry.date}</div>
              <h3 className={styles.timelineSchool}>{entry.company}</h3>
              <p className={styles.timelineDetail}>{entry.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Education;