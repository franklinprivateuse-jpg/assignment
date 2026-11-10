import styles from './Gallery.module.css';
import layout from '../page.module.css';
import galleryImage from '../../assets/gallery.png';

/** A gallery photo with descriptive alt text */
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

/** Gallery photos from projects, events, and activities */
const GALLERY_ITEMS: GalleryImage[] = [
  {
    id: 1,
    src: galleryImage,
    alt: 'Screenshot of the portfolio website built with React and TypeScript',
    caption: 'Portfolio Website',
  },
  {
    id: 2,
    src: galleryImage,
    alt: 'Project source code and architecture diagrams from the portfolio',
    caption: 'Project Work',
  },
  {
    id: 3,
    src: galleryImage,
    alt: 'Development environment showing the portfolio running locally',
    caption: 'Development',
  },
  {
    id: 4,
    src: galleryImage,
    alt: 'Responsive design preview of the portfolio on different screen sizes',
    caption: 'Responsive Design',
  },
  {
    id: 5,
    src: galleryImage,
    alt: 'Dark mode theme of the portfolio website',
    caption: 'Dark Mode',
  },
  {
    id: 6,
    src: galleryImage,
    alt: 'Code quality tools used in the portfolio: ESLint and TypeScript',
    caption: 'Code Quality',
  },
];

/** Gallery page — photo highlights from projects and events */
const Gallery: React.FC = () => {
  return (
    <div className={layout.container}>
      <h1 className={layout.title}>Photo Gallery</h1>
      <p className={layout.subtitle}>
        Highlights from projects, events, and activities
      </p>
      <div className={styles.galleryGrid}>
        {GALLERY_ITEMS.map((item) => (
          <figure key={item.id} className={styles.galleryItem}>
            <img
              src={item.src}
              alt={item.alt}
              className={styles.galleryImage}
              loading="lazy"
            />
            <figcaption className={styles.galleryCaption}>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default Gallery;