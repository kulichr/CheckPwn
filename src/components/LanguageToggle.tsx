import { useStore } from '../state/store';

export function LanguageToggle() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  return (
    <div className="language-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={language === 'cs' ? 'active' : ''}
        onClick={() => setLanguage('cs')}
      >
        CS
      </button>
    </div>
  );
}
