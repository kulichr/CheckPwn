import { useRef, useState } from 'react';
import { ChevronDown, FileJson, Trash2, Upload } from 'lucide-react';
import { useStore } from '../state/store';
import { useT } from '../i18n/useT';
import type { ScanImportBatch, ScanTool } from '../types';
import { EMPTY_SCAN_RESULTS } from '../types';

function severityClass(severity?: string): string {
  const s = (severity || '').toLowerCase();
  if (['critical', 'high'].includes(s)) return 'fail';
  if (['medium', 'in-progress', 'filtered'].includes(s)) return 'in-progress';
  if (['open', 'pass', 'low'].includes(s)) return 'pass';
  if (['closed', 'na'].includes(s)) return 'na';
  return 'not-tested';
}

function ScannerUploadCard({ tool }: { tool: ScanTool }) {
  const t = useT();
  const importScanResults = useStore((s) => s.importScanResults);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const batch = await importScanResults(tool, file);
      setSuccess(t('scanImport.success', { n: batch.findings.length, file: file.name }));
    } catch (err) {
      if (err instanceof Error && err.message === 'no-findings') {
        setError(t('scanImport.errorNoFindings'));
      } else {
        setError(t('scanImport.errorParse', { error: err instanceof Error ? err.message : String(err) }));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`scan-upload-card ${dragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void handleFile(file);
      }}
    >
      <div className="scan-upload-title">
        {tool === 'nuclei' ? t('scanImport.nucleiTitle') : t('scanImport.nmapTitle')}
      </div>
      <div className="scan-upload-hint">{tool === 'nuclei' ? t('scanImport.nucleiHint') : t('scanImport.nmapHint')}</div>
      <button type="button" className="btn-ghost scan-upload-btn" disabled={busy} onClick={() => inputRef.current?.click()}>
        <Upload size={13} /> {busy ? t('scanImport.importing') : t('scanImport.uploadBtn')}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json,.jsonl"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleFile(file);
          e.target.value = '';
        }}
      />
      {error && <div className="scan-upload-message error">{error}</div>}
      {success && <div className="scan-upload-message success">{success}</div>}
    </div>
  );
}

function ScanBatchCard({ batch }: { batch: ScanImportBatch }) {
  const t = useT();
  const removeScanBatch = useStore((s) => s.removeScanBatch);
  const [open, setOpen] = useState(true);

  return (
    <div className="test-card">
      <div className="test-card-header" onClick={() => setOpen((o) => !o)}>
        <ChevronDown size={16} className={`chevron ${open ? 'open' : ''}`} />
        <span className="test-id-badge mono">{batch.tool}</span>
        <span className="test-title">{batch.fileName}</span>
        <span className="scan-batch-count mono">{t('scanImport.findingsCount', { n: batch.findings.length })}</span>
        <button
          type="button"
          className="icon-btn"
          title={t('scanImport.remove')}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(t('scanImport.removeConfirm', { n: batch.findings.length }))) {
              removeScanBatch(batch.id);
            }
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {open && (
        <div className="test-card-body">
          <div className="scan-table-wrap">
            <table className="scan-table">
              <thead>
                <tr>
                  <th>{t('scanImport.col.severity')}</th>
                  <th>{t('scanImport.col.host')}</th>
                  {batch.tool === 'nmap' && <th>{t('scanImport.col.port')}</th>}
                  <th>{t('scanImport.col.name')}</th>
                  <th>{t('scanImport.col.detail')}</th>
                </tr>
              </thead>
              <tbody>
                {batch.findings.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span className={`scan-severity-badge status-${severityClass(f.severity)}`}>
                        {f.severity || '—'}
                      </span>
                    </td>
                    <td className="mono">{f.host || '—'}</td>
                    {batch.tool === 'nmap' && (
                      <td className="mono">{[f.protocol, f.port].filter(Boolean).join('/') || '—'}</td>
                    )}
                    <td>{f.name}</td>
                    <td className="scan-detail-cell">{f.detail || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function ScanImportPanel() {
  const t = useT();
  const currentProject = useStore((s) => s.currentProject);
  const scanResults = useStore((s) => s.currentProject?.scanResults ?? EMPTY_SCAN_RESULTS);

  if (!currentProject) {
    return (
      <div className="main-panel">
        <div className="empty-state">{t('app.selectOrCreate')}</div>
      </div>
    );
  }

  return (
    <div className="main-panel">
      <div className="category-section">
        <h2 className="category-heading">
          <FileJson size={16} /> {t('scanImport.heading')}
        </h2>
        <p className="test-summary">{t('scanImport.intro')}</p>

        <div className="scan-upload-row">
          <ScannerUploadCard tool="nuclei" />
          <ScannerUploadCard tool="nmap" />
        </div>

        {scanResults.length === 0 ? (
          <div className="empty-state">{t('scanImport.empty')}</div>
        ) : (
          scanResults.map((batch) => <ScanBatchCard key={batch.id} batch={batch} />)
        )}
      </div>
    </div>
  );
}
