import styles from './Knowledge.module.css';
import layout from '../page.module.css';

/** A skill category grouping related technologies */
interface SkillCategory {
  category: string;
  skills: string[];
}

/** Professional skills organized by category */
const SKILL_DATA: SkillCategory[] = [
  { category: 'Backend', skills: ['Java', 'Spring Boot', 'Node.js', 'Python'] },
  { category: 'Tools', skills: ['Git', 'Docker', 'VS Code', 'Linux'] },
  { category: 'Databases', skills: ['MySQL', 'Oracle', 'ClickHouse'] },
];

/** Knowledge page — professional skills and technology stack */
const Knowledge: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Professional Knowledge</h1>
      <p className={layout.subtitle}>
        Technologies and tools I work with
      </p>
      {SKILL_DATA.map((group) => (
        <div key={group.category} className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>{group.category}</h3>
          <div className={styles.skillList}>
            {group.skills.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Knowledge;