export type TestStatus = 'not-tested' | 'in-progress' | 'pass' | 'fail' | 'na';

export type LinkType = 'youtube' | 'x' | 'other';

export interface LinkItem {
  id: string;
  url: string;
  title?: string;
  type: LinkType;
}

export interface CustomCommand {
  id: string;
  label: string;
  command: string;
}

export interface TestState {
  status: TestStatus;
  notes: string;
  commands: CustomCommand[];
  links: LinkItem[];
  hiddenTools: number[];
}

export type ScanTool = 'nuclei' | 'nmap';

export interface ScanFinding {
  id: string;
  host: string;
  port?: string;
  protocol?: string;
  name: string;
  severity?: string;
  detail?: string;
}

export interface ScanImportBatch {
  id: string;
  tool: ScanTool;
  fileName: string;
  importedAt: string;
  findings: ScanFinding[];
}

export interface Project {
  id: string;
  name: string;
  target: string;
  createdAt: string;
  updatedAt: string;
  testStates: Record<string, TestState>;
  scanResults: ScanImportBatch[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  target: string;
  createdAt: string;
  updatedAt: string;
}

export const EMPTY_TEST_STATE: TestState = {
  status: 'not-tested',
  notes: '',
  commands: [],
  links: [],
  hiddenTools: [],
};

export const EMPTY_TEST_STATES: Record<string, TestState> = {};

export const EMPTY_SCAN_RESULTS: ScanImportBatch[] = [];
