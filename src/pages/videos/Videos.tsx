import styles from './Videos.module.css';
import layout from '../page.module.css';

interface VideoItem {
  id: number;
  title: string;
  description: string;
}

const VIDEO_LIST: VideoItem[] = [
  { id: 1, title: 'Project Demo', description: 'A walkthrough of my latest project.' },
  { id: 2, title: 'Tech Talk', description: 'Presentation on modern React patterns.' },
  { id: 3, title: 'Tutorial', description: 'Getting started with TypeScript.' },
];

const Videos: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Video Gallery</h1>
      <p className={layout.subtitle}>
        Presentations, demos, and tutorials
      </p>
      <div className={styles.videoGrid}>
        {VIDEO_LIST.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            <div className={styles.videoPlaceholder}>&#9654;</div>
            <div className={styles.videoInfo}>
              <h3 className={styles.videoTitle}>{video.title}</h3>
              <p className={styles.videoDesc}>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;