import { WSTG_CATEGORIES, getTitle } from '../data/wstg';
import { useStore } from '../state/store';
import { computeProgress } from '../utils/progress';
import { EMPTY_TEST_STATES } from '../types';
import { useLanguage } from '../i18n/useT';

export function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const testStates = useStore((s) => s.currentProject?.testStates ?? EMPTY_TEST_STATES);
  const language = useLanguage();

  return (
    <nav className="sidebar">
      {WSTG_CATEGORIES.map((cat) => {
        const ids = cat.tests.map((t) => t.id);
        const progress = computeProgress(testStates, ids);
        const active = cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            className={`sidebar-cat-btn ${active ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
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
