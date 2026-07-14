import { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { getTitle, getSummary, getTools, type WstgTest } from '../data/wstg';
import type { TestState } from '../types';
import { EMPTY_TEST_STATE } from '../types';
import { useStore } from '../state/store';
import { StatusSelector, statusColor } from './StatusSelector';
import { CommandBlock } from './CommandBlock';
import { CustomCommands } from './CustomCommands';
import { LinksSection } from './LinksSection';
import { useT, useLanguage } from '../i18n/useT';
import { applyTarget } from '../utils/target';

export function TestCard({ test, defaultOpen }: { test: WstgTest; defaultOpen?: boolean }) {
  const t = useT();
  const language = useLanguage();
  const [open, setOpen] = useState(!!defaultOpen);
  const state: TestState = useStore(
    (s) => s.currentProject?.testStates[test.id] ?? EMPTY_TEST_STATE
  );
  const target = useStore((s) => s.currentProject?.target ?? '');
  const setTestStatus = useStore((s) => s.setTestStatus);
  const setTestNotes = useStore((s) => s.setTestNotes);
  const addCommand = useStore((s) => s.addCommand);
  const removeCommand = useStore((s) => s.removeCommand);
  const hideDefaultTool = useStore((s) => s.hideDefaultTool);
  const restoreDefaultTools = useStore((s) => s.restoreDefaultTools);
  const addLink = useStore((s) => s.addLink);
  const removeLink = useStore((s) => s.removeLink);

  const tools = getTools(test, language);
  const hiddenTools = state.hiddenTools ?? [];

  return (
    <div className="test-card" style={{ borderLeftColor: statusColor(state.status) }}>
      <div className="test-card-header" onClick={() => setOpen((o) => !o)}>
        <ChevronDown size={16} className={`chevron ${open ? 'open' : ''}`} />
        <span className="test-id-badge mono">{test.id}</span>
        <span className="test-title">{getTitle(test, language)}</span>
        <StatusSelector value={state.status} onChange={(status) => setTestStatus(test.id, status)} />
      </div>
      {open && (
        <div className="test-card-body">
          <p className="test-summary">{getSummary(test, language)}</p>

          <div className="section-block">
            <div className="section-label">{t('section.tools')}</div>
            {tools.map((tool, i) =>
              hiddenTools.includes(i) ? null : (
                <CommandBlock
                  key={i}
                  text={applyTarget(tool, target)}
                  onRemove={() => hideDefaultTool(test.id, i)}
                  removeTitle={t('command.removeDefault')}
                />
              )
            )}
            {hiddenTools.length > 0 && (
              <button
                type="button"
                className="restore-tools-btn"
                onClick={() => restoreDefaultTools(test.id)}
              >
                <RotateCcw size={11} /> {t('tools.restoreHidden', { n: hiddenTools.length })}
              </button>
            )}
          </div>

          <div className="section-block">
            <div className="section-label">{t('section.customCommands')}</div>
            <CustomCommands
              commands={state.commands}
              target={target}
              onAdd={(label, command) => addCommand(test.id, label, command)}
              onRemove={(id) => removeCommand(test.id, id)}
            />
          </div>

          <div className="section-block">
            <div className="section-label">{t('section.notes')}</div>
            <textarea
              className="notes-area"
              placeholder={t('notes.placeholder')}
              value={state.notes}
              onChange={(e) => setTestNotes(test.id, e.target.value)}
              rows={3}
            />
          </div>

          <div className="section-block">
            <div className="section-label">{t('section.links')}</div>
            <LinksSection
              links={state.links}
              onAdd={(url, title) => addLink(test.id, url, title)}
              onRemove={(id) => removeLink(test.id, id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
