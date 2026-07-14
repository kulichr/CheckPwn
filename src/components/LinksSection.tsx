import { useState } from 'react';
import { Play, Link2, X as XIcon, Plus, Trash2 } from 'lucide-react';
import type { LinkItem } from '../types';
import { getYoutubeThumbnail, hostnameOf } from '../utils/links';
import { useT } from '../i18n/useT';

function LinkChip({ link, onRemove }: { link: LinkItem; onRemove: () => void }) {
  const t = useT();
  const thumb = link.type === 'youtube' ? getYoutubeThumbnail(link.url) : null;

  return (
    <a
      className="link-chip"
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      title={link.url}
    >
      {thumb ? (
        <img className="thumb" src={thumb} alt="" loading="lazy" />
      ) : (
        <span className="platform-icon">
          {link.type === 'x' ? <XIcon size={26} /> : <Link2 size={26} />}
        </span>
      )}
      <span className="link-info">
        <span className="link-title">{link.title || hostnameOf(link.url)}</span>
        <span className="link-host">
          {link.type === 'youtube' && <Play size={10} style={{ marginRight: 3, verticalAlign: -1 }} />}
          {hostnameOf(link.url)}
        </span>
      </span>
      <button
        type="button"
        className="link-remove-btn"
        title={t('link.remove')}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash2 size={12} />
      </button>
    </a>
  );
}

export function LinksSection({
  links,
  onAdd,
  onRemove,
}: {
  links: LinkItem[];
  onAdd: (url: string, title?: string) => void;
  onRemove: (id: string) => void;
}) {
  const t = useT();
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);

  function submit() {
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      return;
    }
    onAdd(trimmed);
    setUrl('');
    setAdding(false);
  }

  return (
    <div>
      <div className="link-chip-row">
        {links.map((l) => (
          <LinkChip key={l.id} link={l} onRemove={() => onRemove(l.id)} />
        ))}
        {!adding && (
          <button type="button" className="add-link-btn" onClick={() => setAdding(true)}>
            <Plus size={13} /> {t('link.add')}
          </button>
        )}
      </div>
      {adding && (
        <div className="add-link-form">
          <input
            autoFocus
            type="url"
            autoComplete="off"
            placeholder={t('link.urlPlaceholder')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              if (e.key === 'Escape') setAdding(false);
            }}
          />
          <button type="button" className="btn-secondary" onClick={submit}>
            {t('common.add')}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>
            {t('common.cancel')}
          </button>
        </div>
      )}
    </div>
  );
}
