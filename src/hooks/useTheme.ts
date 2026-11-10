import { useState, useCallback, useEffect } from 'react';

/** Available theme modes */
type Theme = 'light' | 'dark';

/** localStorage key for persisting the theme choice */
const STORAGE_KEY = 'portfolio-theme';

/** Read the initial theme: stored choice first, then system preference */
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage unavailable — fall through to system preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Custom hook for light/dark theme management.
 * Persists the user's choice to localStorage and applies it
 * via the data-theme attribute on the <html> element.
 */
export function useTheme(): {
  theme: Theme;
  toggleTheme: () => void;
} {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply the theme attribute and persist the choice
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable — theme still applies for this session
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}