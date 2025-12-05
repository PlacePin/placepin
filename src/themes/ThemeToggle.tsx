
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme_color');
    return saved || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme_color', next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.toggleButton} ${theme === 'dark' ? styles.dark : styles.light}`}
      aria-label="Toggle theme"
    >
      <div className={`${styles.iconCircle} ${theme === 'dark' ? styles.iconCircleDark : styles.iconCircleLight}`}>
        {theme === 'light' ? (
          <Sun className={styles.icon} />
        ) : (
          <Moon className={styles.icon} />
        )}
      </div>
      <span className={styles.label}>
        {theme === 'light' ? 'LIGHT MODE' : 'DARK MODE'}
      </span>
    </button>
  );
}