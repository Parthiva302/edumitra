// EduMitra Theme Management (Light / Dark Mode)

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'edumitra_theme';

type ThemeListener = (theme: ThemeMode) => void;
const listeners: Set<ThemeListener> = new Set();

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e);
  }
  return 'light';
}

export function applyTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error('Error saving theme to localStorage:', e);
  }
  listeners.forEach(cb => cb(theme));
}

export function toggleTheme(): ThemeMode {
  const current = getInitialTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function subscribeTheme(listener: ThemeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Automatically apply theme on initial script load
if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());
}
