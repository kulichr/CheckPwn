import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useStore } from '../state/store';
import { useT } from '../i18n/useT';

export function ImportExportBar() {
  const t = useT();
  const exportProject = useStore((s) => s.exportProject);
  const importProject = useStore((s) => s.importProject);
  const hasProject = useStore((s) => !!s.currentProject);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="import-export-bar">
      <button type="button" className="icon-btn" title={t('export.title')} disabled={!hasProject} onClick={exportProject}>
        <Download size={15} />
      </button>
      <button type="button" className="icon-btn" title={t('import.title')} onClick={() => inputRef.current?.click()}>
        <Upload size={15} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await importProject(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
