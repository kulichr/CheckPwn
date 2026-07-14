import { Search } from 'lucide-react';
import { WSTG_CATEGORIES, ALL_TESTS, getTitle } from '../data/wstg';
import { useStore } from '../state/store';
import { TestCard } from './TestCard';
import { EMPTY_TEST_STATES, type TestStatus } from '../types';
import { useT, useLanguage } from '../i18n/useT';
import type { TranslationKey } from '../i18n/translations';

const FILTERS: { value: TestStatus | 'all'; key: TranslationKey }[] = [
  { value: 'all', key: 'filter.all' },
  { value: 'not-tested', key: 'status.notTested' },
  { value: 'in-progress', key: 'status.inProgress' },
  { value: 'pass', key: 'status.pass' },
  { value: 'fail', key: 'status.fail' },
  { value: 'na', key: 'status.na' },
];

export function MainPanel({ activeCategoryId }: { activeCategoryId: string }) {
  const t = useT();
  const language = useLanguage();
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const filterStatus = useStore((s) => s.filterStatus);
  const setFilterStatus = useStore((s) => s.setFilterStatus);
  const testStates = useStore((s) => s.currentProject?.testStates ?? EMPTY_TEST_STATES);
  const currentProject = useStore((s) => s.currentProject);

  if (!currentProject) {
    return (
      <div className="main-panel">
        <div className="empty-state">{t('app.selectOrCreate')}</div>
      </div>
    );
  }

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const matches = (id: string, title: string) => {
    const statusOk = filterStatus === 'all' || (testStates[id]?.status ?? 'not-tested') === filterStatus;
    if (!statusOk) return false;
    if (!isSearching) return true;
    return id.toLowerCase().includes(query) || title.toLowerCase().includes(query);
  };

  const category = WSTG_CATEGORIES.find((c) => c.id === activeCategoryId);

  return (
    <div className="main-panel">
      <div className="main-toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`filter-chip ${filterStatus === f.value ? 'active' : ''}`}
              onClick={() => setFilterStatus(f.value)}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </div>

      {isSearching ? (
        <div className="category-section">
          <h2 className="category-heading">{t('search.results')}</h2>
          {ALL_TESTS.filter((test) => matches(test.id, getTitle(test, language))).map((test) => (
            <TestCard key={test.id} test={test} defaultOpen />
          ))}
        </div>
      ) : (
        category && (
          <div className="category-section">
            <h2 className="category-heading">
              <span className="mono">{category.code}</span> {getTitle(category, language)}
            </h2>
            {category.tests.filter((test) => matches(test.id, getTitle(test, language))).map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
