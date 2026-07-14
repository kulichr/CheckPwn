import { Sun, Moon } from 'lucide-react';
import { useStore } from '../state/store';
import { useT } from '../i18n/useT';

export function ThemeToggle() {
  const t = useT();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
