import { FileJson } from 'lucide-react';
import { WSTG_CATEGORIES, getTitle } from '../data/wstg';
import { useStore } from '../state/store';
import { computeProgress } from '../utils/progress';
import { EMPTY_TEST_STATES, EMPTY_SCAN_RESULTS } from '../types';
import { useLanguage, useT } from '../i18n/useT';
import type { AppView } from '../App';

export function Sidebar({
  activeView,
  activeId,
  onSelectView,
  onSelect,
}: {
  activeView: AppView;
  activeId: string;
  onSelectView: (view: AppView) => void;
  onSelect: (id: string) => void;
}) {
  const t = useT();
  const testStates = useStore((s) => s.currentProject?.testStates ?? EMPTY_TEST_STATES);
  const scanResults = useStore((s) => s.currentProject?.scanResults ?? EMPTY_SCAN_RESULTS);
  const language = useLanguage();
  const findingsCount = scanResults.reduce((sum, b) => sum + b.findings.length, 0);

  return (
    <nav className="sidebar">
      <button
        type="button"
        className={`sidebar-cat-btn sidebar-scan-btn ${activeView === 'scan-import' ? 'active' : ''}`}
        onClick={() => onSelectView('scan-import')}
      >
        <span className="sidebar-cat-title">
          <FileJson size={14} /> {t('scanImport.tabTitle')}
        </span>
        {findingsCount > 0 && <span className="sidebar-cat-count mono">{findingsCount}</span>}
      </button>
      <div className="sidebar-divider" />
      {WSTG_CATEGORIES.map((cat) => {
        const ids = cat.tests.map((t) => t.id);
        const progress = computeProgress(testStates, ids);
        const active = activeView === 'checklist' && cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            className={`sidebar-cat-btn ${active ? 'active' : ''}`}
            onClick={() => {
              onSelectView('checklist');
              onSelect(cat.id);
            }}
          >
            <span className="sidebar-cat-code mono">{cat.code}</span>
            <span className="sidebar-cat-title">{getTitle(cat, language)}</span>
            <span className="sidebar-cat-progress">
              <span className="sidebar-cat-track">
                <span
                  className="sidebar-cat-fill"
                  style={{ width: `${progress.percent}%` }}
                />
              </span>
              <span className="sidebar-cat-count mono">
                {progress.testedCount}/{progress.total}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
