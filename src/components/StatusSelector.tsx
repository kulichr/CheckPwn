import type { TestStatus } from '../types';
import { Check, X, Minus, Circle, Loader } from 'lucide-react';
import { useT } from '../i18n/useT';
import type { TranslationKey } from '../i18n/translations';

const STATUS_ORDER: TestStatus[] = ['not-tested', 'in-progress', 'pass', 'fail', 'na'];

const STATUS_META: Record<TestStatus, { key: TranslationKey; icon: React.ReactNode; varName: string }> = {
  'not-tested': { key: 'status.notTested', icon: <Circle size={13} />, varName: '--status-not-tested' },
  'in-progress': { key: 'status.inProgress', icon: <Loader size={13} />, varName: '--status-in-progress' },
  pass: { key: 'status.pass', icon: <Check size={14} />, varName: '--status-pass' },
  fail: { key: 'status.fail', icon: <X size={14} />, varName: '--status-fail' },
  na: { key: 'status.na', icon: <Minus size={13} />, varName: '--status-na' },
};

export function statusColor(status: TestStatus): string {
  return `var(${STATUS_META[status].varName})`;
}

export function StatusSelector({
  value,
  onChange,
}: {
  value: TestStatus;
  onChange: (status: TestStatus) => void;
}) {
  const t = useT();

  return (
    <div className="status-selector" role="radiogroup" aria-label={t('status.ariaLabel')}>
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            className="status-dot-btn"
            role="radio"
            aria-checked={active}
            title={t(meta.key)}
            data-active={active}
            style={active ? { background: `var(${meta.varName})`, borderColor: `var(${meta.varName})` } : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onChange(status);
            }}
          >
            {meta.icon}
          </button>
        );
      })}
    </div>
  );
}
