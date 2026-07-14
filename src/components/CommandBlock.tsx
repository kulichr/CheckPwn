import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { useT } from '../i18n/useT';

export function CommandBlock({
  text,
  onRemove,
  removeTitle,
}: {
  text: string;
  onRemove?: () => void;
  removeTitle?: string;
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="command-line">
      <code>{text}</code>
      <button type="button" className="icon-btn" onClick={handleCopy} title={t('command.copy')}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      {onRemove && (
        <button type="button" className="icon-btn" onClick={onRemove} title={removeTitle ?? t('command.delete')}>
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
