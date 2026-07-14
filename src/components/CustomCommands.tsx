import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { CustomCommand } from '../types';
import { CommandBlock } from './CommandBlock';
import { useT } from '../i18n/useT';
import { applyTarget, TARGET_PLACEHOLDER } from '../utils/target';

export function CustomCommands({
  commands,
  target,
  onAdd,
  onRemove,
}: {
  commands: CustomCommand[];
  target: string;
  onAdd: (label: string, command: string) => void;
  onRemove: (id: string) => void;
}) {
  const t = useT();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [command, setCommand] = useState('');

  function submit() {
    if (!command.trim()) return;
    onAdd(label.trim(), command.trim());
    setLabel('');
    setCommand('');
    setAdding(false);
  }

  return (
    <div>
      {commands.map((c) => (
        <div key={c.id} style={{ marginBottom: 6 }}>
          {c.label && <div className="command-label">{c.label}</div>}
          <CommandBlock text={applyTarget(c.command, target)} onRemove={() => onRemove(c.id)} />
        </div>
      ))}
      {!adding ? (
        <button type="button" className="add-link-btn" onClick={() => setAdding(true)}>
          <Plus size={13} /> {t('customCommand.add')}
        </button>
      ) : (
        <div className="add-command-form">
          <input
            type="text"
            autoComplete="off"
            placeholder={t('customCommand.labelPlaceholder')}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <textarea
            autoFocus
            placeholder={t('customCommand.commandPlaceholder', { target: target.trim() || TARGET_PLACEHOLDER })}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
              if (e.key === 'Escape') setAdding(false);
            }}
          />
          <div className="add-command-actions">
            <button type="button" className="btn-secondary" onClick={submit}>
              {t('common.save')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
