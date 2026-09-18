import styles from './Gallery.module.css';
import layout from '../page.module.css';

interface GalleryImage {
  id: number;
  label: string;
}

const GALLERY_ITEMS: GalleryImage[] = [
  { id: 1, label: 'Project Screenshot 1' },
  { id: 2, label: 'Project Screenshot 2' },
  { id: 3, label: 'Team Event' },
  { id: 4, label: 'Hackathon' },
  { id: 5, label: 'Conference' },
  { id: 6, label: 'Workshop' },
];

const Gallery: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Photo Gallery</h1>
      <p className={layout.subtitle}>
        Highlights from projects, events, and activities
      </p>
      <div className={styles.galleryGrid}>
        {GALLERY_ITEMS.map((item) => (
          <div key={item.id} className={styles.galleryItem}>
            <span className={styles.galleryLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;