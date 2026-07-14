import { Check, Loader, AlertCircle } from 'lucide-react';
import { useStore } from '../state/store';
import { useT } from '../i18n/useT';

export function SaveIndicator() {
  const t = useT();
  const status = useStore((s) => s.saveStatus);

  if (status === 'idle') return null;

  const map = {
    saving: { icon: <Loader size={12} className="spin" />, label: t('save.saving') },
    saved: { icon: <Check size={12} />, label: t('save.saved') },
    error: { icon: <AlertCircle size={12} />, label: t('save.error') },
  } as const;

  const m = map[status];

  return (
    <span className={`save-indicator ${status}`}>
      {m.icon}
      {m.label}
    </span>
  );
}
