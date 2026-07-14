import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, Trash2, Pencil, Check, FolderOpen } from 'lucide-react';
import { useStore } from '../state/store';
import { useT } from '../i18n/useT';
import { TARGET_PLACEHOLDER } from '../utils/target';

export function ProjectSwitcher() {
  const t = useT();
  const projects = useStore((s) => s.projects);
  const currentProject = useStore((s) => s.currentProject);
  const selectProject = useStore((s) => s.selectProject);
  const createProject = useStore((s) => s.createProject);
  const deleteProject = useStore((s) => s.deleteProject);
  const updateProjectMeta = useStore((s) => s.updateProjectMeta);
  const loadProjects = useStore((s) => s.loadProjects);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [targetDraft, setTargetDraft] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setRenaming(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function startRename() {
    setNameDraft(currentProject?.name ?? '');
    setTargetDraft(currentProject?.target ?? '');
    setRenaming(true);
    setCreating(false);
  }

  function submitRename() {
    if (!nameDraft.trim()) return;
    updateProjectMeta({ name: nameDraft.trim(), target: targetDraft.trim() });
    setRenaming(false);
  }

  async function submitCreate() {
    if (!newName.trim()) return;
    await createProject(newName.trim(), newTarget.trim());
    setNewName('');
    setNewTarget('');
    setCreating(false);
    setOpen(false);
  }

  return (
    <div className="project-switcher" ref={ref}>
      <button
        type="button"
        className="project-switcher-btn"
        onClick={() => {
          if (!open) loadProjects();
          setOpen((o) => !o);
        }}
      >
        <FolderOpen size={15} />
        <span className="project-name">{currentProject?.name || t('project.none')}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="project-dropdown">
          {renaming ? (
            <div className="project-form">
              <input
                autoFocus
                autoComplete="off"
                placeholder={t('project.namePlaceholder')}
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <input
                autoComplete="off"
                placeholder={t('project.targetPlaceholder')}
                value={targetDraft}
                onChange={(e) => setTargetDraft(e.target.value)}
              />
              <div className="project-form-hint">{t('project.targetHint', { target: TARGET_PLACEHOLDER })}</div>
              <div className="project-form-actions">
                <button type="button" className="btn-secondary" onClick={submitRename}>
                  <Check size={13} /> {t('common.save')}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setRenaming(false)}>
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            currentProject && (
              <button type="button" className="project-dropdown-action" onClick={startRename}>
                <Pencil size={13} /> {t('project.rename')}
              </button>
            )
          )}

          <div className="project-dropdown-divider" />

          <div className="project-list">
            {projects.map((p) => (
              <div key={p.id} className={`project-list-item ${p.id === currentProject?.id ? 'active' : ''}`}>
                <button
                  type="button"
                  className="project-list-select"
                  onClick={() => {
                    selectProject(p.id);
                    setOpen(false);
                  }}
                >
                  <span className="project-list-name">{p.name}</span>
                  {p.target && <span className="project-list-target mono">{p.target}</span>}
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  title={t('project.delete')}
                  onClick={() => {
                    if (confirm(t('project.deleteConfirm', { name: p.name }))) {
                      deleteProject(p.id);
                    }
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {projects.length === 0 && <div className="project-list-empty">{t('project.empty')}</div>}
          </div>

          <div className="project-dropdown-divider" />

          {creating ? (
            <div className="project-form">
              <input
                autoFocus
                autoComplete="off"
                placeholder={t('project.newNamePlaceholder')}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCreate()}
              />
              <input
                autoComplete="off"
                placeholder={t('project.targetPlaceholder')}
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCreate()}
              />
              <div className="project-form-hint">{t('project.targetHint', { target: TARGET_PLACEHOLDER })}</div>
              <div className="project-form-actions">
                <button type="button" className="btn-secondary" onClick={submitCreate}>
                  {t('common.create')}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setCreating(false)}>
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="project-dropdown-action accent" onClick={() => setCreating(true)}>
              <Plus size={13} /> {t('project.new')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
