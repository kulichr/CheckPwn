import type { TestState, TestStatus } from '../types';

export interface ProgressStats {
  total: number;
  notTested: number;
  inProgress: number;
  pass: number;
  fail: number;
  na: number;
  testedCount: number;
  percent: number;
}

export function computeProgress(
  testStates: Record<string, TestState>,
  testIds: string[]
): ProgressStats {
  const stats: ProgressStats = {
    total: testIds.length,
    notTested: 0,
    inProgress: 0,
    pass: 0,
    fail: 0,
    na: 0,
    testedCount: 0,
    percent: 0,
  };
  for (const id of testIds) {
    const status: TestStatus = testStates[id]?.status ?? 'not-tested';
    switch (status) {
      case 'in-progress':
        stats.inProgress++;
        break;
      case 'pass':
        stats.pass++;
        break;
      case 'fail':
        stats.fail++;
        break;
      case 'na':
        stats.na++;
        break;
      default:
        stats.notTested++;
    }
  }
  stats.testedCount = stats.total - stats.notTested;
  stats.percent = stats.total === 0 ? 0 : Math.round((stats.testedCount / stats.total) * 100);
  return stats;
}
