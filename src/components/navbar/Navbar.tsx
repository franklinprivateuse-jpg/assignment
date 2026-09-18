import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

/** Navigation link configuration */
interface NavItem {
  to: string;
  label: string;
}

/** All navigation links displayed in the navbar */
const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/education', label: 'Education' },
  { to: '/knowledge', label: 'Knowledge' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/blog', label: 'Blog' },
  { to: '/messaging', label: 'Messaging' },
  { to: '/readme', label: 'README' },
];

/** Top navigation bar with brand logo and page links */
const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        Kewei
      </NavLink>
      <ul className={styles.navLinks}>
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              // Apply active style when the current route matches
              className={({ isActive }) =>
                isActive ? styles.navLinkActive : styles.navLink
              }
              // Exact match for the home route to prevent false positives
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;