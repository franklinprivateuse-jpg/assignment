import styles from './Videos.module.css';
import layout from '../page.module.css';

/** A video entry with title, description, and YouTube ID */
interface VideoItem {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
}

/** Static list of video entries */
const VIDEO_LIST: VideoItem[] = [
  { id: 1, title: 'Learning Software Engineering During the Era of AI', description: 'A talk on how AI is shaping software engineering education and practice.', youtubeId: 'w4rG5GY9IlA' },
];

/** Videos page — showcases presentations, demos, and tutorials */
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
            <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allowFullScreen
            className={styles.videoEmbed}
          />
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