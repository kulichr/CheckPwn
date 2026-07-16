import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { api } from '../api/client';
import type {
  Project,
  ProjectSummary,
  TestState,
  LinkItem,
  CustomCommand,
  TestStatus,
  ScanTool,
  ScanImportBatch,
} from '../types';
import { detectLinkType } from '../utils/links';
import { ALL_TESTS } from '../data/wstg';
import type { Language } from '../i18n/translations';
import { parseNucleiJson, parseNmapJson } from '../utils/scanImport';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type Theme = 'light' | 'dark';

interface AppState {
  projects: ProjectSummary[];
  currentProject: Project | null;
  loading: boolean;
  saveStatus: SaveStatus;
  theme: Theme;
  language: Language;
  filterStatus: TestStatus | 'all';
  searchQuery: string;

  init(): Promise<void>;
  loadProjects(): Promise<void>;
  selectProject(id: string): Promise<void>;
  createProject(name: string, target: string): Promise<void>;
  updateProjectMeta(patch: { name?: string; target?: string }): void;
  deleteProject(id: string): Promise<void>;

  setTestStatus(testId: string, status: TestStatus): void;
  setTestNotes(testId: string, notes: string): void;
  addCommand(testId: string, label: string, command: string): void;
  removeCommand(testId: string, commandId: string): void;
  hideDefaultTool(testId: string, toolIndex: number): void;
  restoreDefaultTools(testId: string): void;
  addLink(testId: string, url: string, title?: string): void;
  removeLink(testId: string, linkId: string): void;

  importScanResults(tool: ScanTool, file: File): Promise<ScanImportBatch>;
  removeScanBatch(batchId: string): void;

  setTheme(theme: Theme): void;
  setLanguage(language: Language): void;
  setFilterStatus(status: TestStatus | 'all'): void;
  setSearchQuery(q: string): void;

  exportProject(): void;
  importProject(file: File): Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let initPromise: Promise<void> | null = null;

function scheduleSave(get: () => AppState, set: (partial: Partial<AppState>) => void) {
  if (saveTimer) clearTimeout(saveTimer);
  set({ saveStatus: 'saving' });
  saveTimer = setTimeout(async () => {
    const project = get().currentProject;
    if (!project) return;
    try {
      const saved = await api.save(project);
      set({ currentProject: saved, saveStatus: 'saved' });
      const summaries = get().projects.map((p) =>
        p.id === saved.id ? { ...p, name: saved.name, target: saved.target, updatedAt: saved.updatedAt } : p
      );
      set({ projects: summaries });
    } catch {
      set({ saveStatus: 'error' });
    }
  }, 600);
}

function normalizeTestState(state?: Partial<TestState>): TestState {
  return {
    status: state?.status ?? 'not-tested',
    notes: state?.notes ?? '',
    commands: state?.commands ?? [],
    links: state?.links ?? [],
    hiddenTools: state?.hiddenTools ?? [],
  };
}

function ensureTestState(project: Project, testId: string): TestState {
  return normalizeTestState(project.testStates[testId]);
}

function normalizeProject(project: Project): Project {
  return { ...project, scanResults: project.scanResults ?? [] };
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('wstg-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('wstg-lang');
  if (stored === 'en' || stored === 'cs') return stored;
  return 'en';
}

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  saveStatus: 'idle',
  theme: getInitialTheme(),
  language: getInitialLanguage(),
  filterStatus: 'all',
  searchQuery: '',

  async init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      document.documentElement.dataset.theme = get().theme;
      document.documentElement.lang = get().language;
      await get().loadProjects();
      const { projects, currentProject } = get();
      if (!currentProject && projects.length > 0) {
        const lastId = localStorage.getItem('wstg-last-project');
        const target = (lastId && projects.find((p) => p.id === lastId)) || projects[0];
        await get().selectProject(target.id);
      }
    })();
    return initPromise;
  },

  async loadProjects() {
    set({ loading: true });
    try {
      const projects = await api.list();
      set({ projects, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  async selectProject(id) {
    set({ loading: true });
    try {
      const project = normalizeProject(await api.get(id));
      set({ currentProject: project, loading: false, saveStatus: 'idle' });
      localStorage.setItem('wstg-last-project', id);
    } catch {
      set({ loading: false });
    }
  },

  async createProject(name, target) {
    const project = normalizeProject(await api.create(name, target));
    set({ projects: [{ ...project }, ...get().projects], currentProject: project, saveStatus: 'idle' });
    localStorage.setItem('wstg-last-project', project.id);
  },

  updateProjectMeta(patch) {
    const current = get().currentProject;
    if (!current) return;
    const updated = { ...current, ...patch };
    set({ currentProject: updated });
    scheduleSave(get, set);
  },

  async deleteProject(id) {
    await api.remove(id);
    const projects = get().projects.filter((p) => p.id !== id);
    set({ projects });
    if (get().currentProject?.id === id) {
      if (projects.length > 0) {
        await get().selectProject(projects[0].id);
      } else {
        set({ currentProject: null });
      }
    }
  },

  setTestStatus(testId, status) {
    const current = get().currentProject;
    if (!current) return;
    const testStates = {
      ...current.testStates,
      [testId]: { ...ensureTestState(current, testId), status },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  setTestNotes(testId, notes) {
    const current = get().currentProject;
    if (!current) return;
    const testStates = {
      ...current.testStates,
      [testId]: { ...ensureTestState(current, testId), notes },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  addCommand(testId, label, command) {
    const current = get().currentProject;
    if (!current) return;
    const state = ensureTestState(current, testId);
    const newCommand: CustomCommand = { id: nanoid(8), label, command };
    const testStates = {
      ...current.testStates,
      [testId]: { ...state, commands: [...state.commands, newCommand] },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  removeCommand(testId, commandId) {
    const current = get().currentProject;
    if (!current) return;
    const state = ensureTestState(current, testId);
    const testStates = {
      ...current.testStates,
      [testId]: { ...state, commands: state.commands.filter((c) => c.id !== commandId) },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  hideDefaultTool(testId, toolIndex) {
    const current = get().currentProject;
    if (!current) return;
    const state = ensureTestState(current, testId);
    if (state.hiddenTools.includes(toolIndex)) return;
    const testStates = {
      ...current.testStates,
      [testId]: { ...state, hiddenTools: [...state.hiddenTools, toolIndex] },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  restoreDefaultTools(testId) {
    const current = get().currentProject;
    if (!current) return;
    const state = ensureTestState(current, testId);
    const testStates = {
      ...current.testStates,
      [testId]: { ...state, hiddenTools: [] },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  addLink(testId, url, title) {
    const current = get().currentProject;
    if (!current) return;
    const state = ensureTestState(current, testId);
    const newLink: LinkItem = { id: nanoid(8), url, title, type: detectLinkType(url) };
    const testStates = {
      ...current.testStates,
      [testId]: { ...state, links: [...state.links, newLink] },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  removeLink(testId, linkId) {
    const current = get().currentProject;
    if (!current) return;
    const state = ensureTestState(current, testId);
    const testStates = {
      ...current.testStates,
      [testId]: { ...state, links: state.links.filter((l) => l.id !== linkId) },
    };
    set({ currentProject: { ...current, testStates } });
    scheduleSave(get, set);
  },

  async importScanResults(tool, file) {
    const current = get().currentProject;
    if (!current) throw new Error('no-project');
    const text = await file.text();
    const findings = tool === 'nuclei' ? parseNucleiJson(text) : parseNmapJson(text);
    if (findings.length === 0) {
      throw new Error('no-findings');
    }
    const batch: ScanImportBatch = {
      id: nanoid(8),
      tool,
      fileName: file.name,
      importedAt: new Date().toISOString(),
      findings,
    };
    const scanResults = [batch, ...current.scanResults];
    set({ currentProject: { ...current, scanResults } });
    scheduleSave(get, set);
    return batch;
  },

  removeScanBatch(batchId) {
    const current = get().currentProject;
    if (!current) return;
    const scanResults = current.scanResults.filter((b) => b.id !== batchId);
    set({ currentProject: { ...current, scanResults } });
    scheduleSave(get, set);
  },

  setTheme(theme) {
    localStorage.setItem('wstg-theme', theme);
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },

  setLanguage(language) {
    localStorage.setItem('wstg-lang', language);
    document.documentElement.lang = language;
    set({ language });
  },

  setFilterStatus(status) {
    set({ filterStatus: status });
  },

  setSearchQuery(q) {
    set({ searchQuery: q });
  },

  exportProject() {
    const project = get().currentProject;
    if (!project) return;
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = project.name.replace(/[^a-z0-9_-]+/gi, '_').toLowerCase();
    a.href = url;
    a.download = `checkpwn-${safeName || 'checklist'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  async importProject(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const known = new Set(ALL_TESTS.map((t) => t.id));
    const testStates: Record<string, TestState> = {};
    for (const [id, state] of Object.entries<Partial<TestState>>(parsed.testStates || {})) {
      if (known.has(id)) testStates[id] = normalizeTestState(state);
    }
    const fallbackName = get().language === 'cs' ? 'Importovaný pentest' : 'Imported pentest';
    const project = normalizeProject(
      await api.import({
        name: parsed.name || fallbackName,
        target: parsed.target || '',
        createdAt: parsed.createdAt,
        testStates,
        scanResults: Array.isArray(parsed.scanResults) ? parsed.scanResults : [],
      })
    );
    set({ projects: [{ ...project }, ...get().projects], currentProject: project, saveStatus: 'idle' });
    localStorage.setItem('wstg-last-project', project.id);
  },
}));
