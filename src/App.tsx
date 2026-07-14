import { useEffect, useState } from 'react';
import { ShieldHalf } from 'lucide-react';
import './App.css';
import { useStore } from './state/store';
import { WSTG_CATEGORIES } from './data/wstg';
import { Sidebar } from './components/Sidebar';
import { MainPanel } from './components/MainPanel';
import { ProgressBar } from './components/ProgressBar';
import { ProjectSwitcher } from './components/ProjectSwitcher';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { ImportExportBar } from './components/ImportExportBar';
import { SaveIndicator } from './components/SaveIndicator';
import { useT } from './i18n/useT';

function App() {
  const t = useT();
  const init = useStore((s) => s.init);
  const loading = useStore((s) => s.loading);
  const currentProject = useStore((s) => s.currentProject);
  const [activeCategoryId, setActiveCategoryId] = useState(WSTG_CATEGORIES[0].id);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <div className="brand">
            <ShieldHalf size={20} />
            <span>CheckPwn</span>
          </div>
          <ProjectSwitcher />
          <SaveIndicator />
          <div className="topbar-spacer" />
          <ImportExportBar />
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <ProgressBar />
      </header>

      <div className="body-layout">
        <Sidebar activeId={activeCategoryId} onSelect={setActiveCategoryId} />
        {loading && !currentProject ? (
          <div className="main-panel">
            <div className="empty-state">{t('app.loading')}</div>
          </div>
        ) : (
          <MainPanel activeCategoryId={activeCategoryId} />
        )}
      </div>
    </div>
  );
}

export default App;
