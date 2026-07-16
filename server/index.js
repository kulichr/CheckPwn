import express from 'express';
import cors from 'cors';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const PORT = process.env.API_PORT || 4174;

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function projectPath(id) {
  const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
  return path.join(DATA_DIR, `${safeId}.json`);
}

async function readProject(id) {
  const filePath = projectPath(id);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeProject(project) {
  const filePath = projectPath(project.id);
  await fs.writeFile(filePath, JSON.stringify(project, null, 2), 'utf-8');
}

async function listProjectFiles() {
  await ensureDataDir();
  const files = await fs.readdir(DATA_DIR);
  return files.filter((f) => f.endsWith('.json'));
}

app.get('/api/projects', async (_req, res) => {
  try {
    const files = await listProjectFiles();
    const projects = await Promise.all(
      files.map(async (f) => {
        const raw = await fs.readFile(path.join(DATA_DIR, f), 'utf-8');
        const p = JSON.parse(raw);
        return {
          id: p.id,
          name: p.name,
          target: p.target || '',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
      })
    );
    projects.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await readProject(req.params.id);
    res.json(project);
  } catch {
    res.status(404).json({ error: 'not_found' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    await ensureDataDir();
    const now = new Date().toISOString();
    const id = randomUUID();
    const project = {
      id,
      name: req.body.name || 'Nový pentest',
      target: req.body.target || '',
      createdAt: now,
      updatedAt: now,
      testStates: req.body.testStates || {},
      scanResults: req.body.scanResults || [],
    };
    await writeProject(project);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const existing = await readProject(req.params.id).catch(() => null);
    const now = new Date().toISOString();
    const project = {
      id: req.params.id,
      name: req.body.name ?? existing?.name ?? 'Pentest',
      target: req.body.target ?? existing?.target ?? '',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      testStates: req.body.testStates ?? existing?.testStates ?? {},
      scanResults: req.body.scanResults ?? existing?.scanResults ?? [],
    };
    await writeProject(project);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await fs.unlink(projectPath(req.params.id));
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'not_found' });
  }
});

app.post('/api/projects/import', async (req, res) => {
  try {
    await ensureDataDir();
    const incoming = req.body;
    const now = new Date().toISOString();
    const id = randomUUID();
    const project = {
      id,
      name: incoming.name || 'Importovaný pentest',
      target: incoming.target || '',
      createdAt: incoming.createdAt || now,
      updatedAt: now,
      testStates: incoming.testStates || {},
      scanResults: incoming.scanResults || [],
    };
    await writeProject(project);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`[checkpwn] API server listening on http://localhost:${PORT}`);
});
