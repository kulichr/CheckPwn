import { useStore } from '../state/store';
import { ALL_TESTS, TOTAL_TEST_COUNT } from '../data/wstg';
import { computeProgress } from '../utils/progress';
import { EMPTY_TEST_STATES } from '../types';

export function ProgressBar() {
  const testStates = useStore((s) => s.currentProject?.testStates ?? EMPTY_TEST_STATES);
  const stats = computeProgress(testStates, ALL_TESTS.map((t) => t.id));

  const seg = (count: number) => (TOTAL_TEST_COUNT === 0 ? 0 : (count / TOTAL_TEST_COUNT) * 100);

  return (
    <div className="progress-bar-wrap">
      <div className="progress-track">
        {stats.pass > 0 && (
          <div className="progress-seg" style={{ width: `${seg(stats.pass)}%`, background: 'var(--status-pass)' }} />
        )}
        {stats.fail > 0 && (
          <div className="progress-seg" style={{ width: `${seg(stats.fail)}%`, background: 'var(--status-fail)' }} />
        )}
        {stats.na > 0 && (
          <div className="progress-seg" style={{ width: `${seg(stats.na)}%`, background: 'var(--status-na)' }} />
        )}
        {stats.inProgress > 0 && (
          <div
            className="progress-seg"
            style={{ width: `${seg(stats.inProgress)}%`, background: 'var(--status-in-progress)' }}
          />
        )}
      </div>
      <span className="progress-label mono">
        {stats.testedCount}/{stats.total} ({stats.percent}%)
      </span>
    </div>
  );
}
