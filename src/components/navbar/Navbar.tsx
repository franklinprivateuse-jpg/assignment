import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
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
  { to: '/readme', label: 'Project' },
];

/** Top navigation bar with brand logo, page links, theme toggle and mobile menu */
const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu when a link is clicked
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <NavLink to="/" className={styles.brand}>
          Kewei
        </NavLink>
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={styles.menuIcon} />
        </button>
      </div>
      <ul
        className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}
      >
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
              onClick={handleLinkClick}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </nav>
  );
};

export default Navbar;