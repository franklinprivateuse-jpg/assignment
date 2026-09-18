import styles from './Education.module.css';
import layout from '../page.module.css';

interface EducationEntry {
  date: string;
  school: string;
  detail: string;
}

const EDUCATION_LIST: EducationEntry[] = [
  {
    date: '2024 – Present',
    school: 'University of Limerick',
    detail: 'MSc in Software Engineering',
  },
  {
    date: '2019 – 2023',
    school: 'Previous University',
    detail: 'BSc in Computer Science',
  },
];

const Education: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Education</h1>
      <div className={styles.timeline}>
        {EDUCATION_LIST.map((entry) => (
          <div key={entry.date} className={styles.timelineItem}>
            <div className={styles.timelineDate}>{entry.date}</div>
            <h3 className={styles.timelineSchool}>{entry.school}</h3>
            <p className={styles.timelineDetail}>{entry.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;