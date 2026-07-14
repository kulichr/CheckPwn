import type { Project, ProjectSummary } from '../types';

const BASE = '/api/projects';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  list: (): Promise<ProjectSummary[]> => fetch(BASE).then((r) => handle(r)),

  get: (id: string): Promise<Project> => fetch(`${BASE}/${id}`).then((r) => handle(r)),

  create: (name: string, target: string): Promise<Project> =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, target, testStates: {} }),
    }).then((r) => handle(r)),

  save: (project: Project): Promise<Project> =>
    fetch(`${BASE}/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    }).then((r) => handle(r)),

  remove: (id: string): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => handle(r)),

  import: (project: Partial<Project>): Promise<Project> =>
    fetch(`${BASE}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    }).then((r) => handle(r)),
};
