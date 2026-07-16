import { nanoid } from 'nanoid';
import type { ScanFinding } from '../types';

// Parsers below work against loosely-typed, tool-provided JSON of varying shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/** Reads an XML-converted attribute regardless of converter style (`@_x`, `$.x`, or bare `x`). */
function attr(obj: Any, name: string): string | undefined {
  if (obj == null) return undefined;
  return obj[`@_${name}`] ?? obj.$?.[name] ?? obj[name];
}

function pick(obj: Any, ...keys: string[]): Any {
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key];
  }
  return undefined;
}

function tryParseJsonOrJsonl(text: string): Any[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    const items: Any[] = [];
    for (const line of trimmed.split('\n')) {
      const l = line.trim();
      if (!l) continue;
      items.push(JSON.parse(l));
    }
    return items;
  }
}

/** Parses Nuclei `-json`/`-jsonl` output: either a JSON array or newline-delimited JSON objects. */
export function parseNucleiJson(text: string): ScanFinding[] {
  const items = tryParseJsonOrJsonl(text);
  return items.map((item, i) => {
    const info = item.info ?? {};
    const host = item.host ?? item.ip ?? '';
    const extracted: string[] | undefined = Array.isArray(item['extracted-results'])
      ? item['extracted-results']
      : undefined;

    // Prefer the actual matched value (extracted-results) over the template's static
    // boilerplate description, which is identical for every hit of that template.
    const detailParts: string[] = [];
    if (extracted?.length) detailParts.push(extracted.join(', '));
    if (item['matched-at']) detailParts.push(item['matched-at']);
    if (!extracted?.length && info.description) detailParts.push(String(info.description).trim());

    return {
      id: nanoid(8),
      host: String(host),
      port: item.port !== undefined ? String(item.port) : undefined,
      protocol: item.scheme,
      name: info.name || item['template-id'] || `finding-${i + 1}`,
      severity: info.severity || 'unknown',
      detail: detailParts.join(' — ') || undefined,
    };
  });
}

function buildPortFinding(host: string, port: string, protocol: string, svc: Any): ScanFinding {
  const svcName: string | undefined = svc?.name;
  const product: string | undefined = svc?.product;
  const version: string | undefined = svc?.version;
  const extrainfo: string | undefined = svc?.extrainfo;
  return {
    id: nanoid(8),
    host,
    port,
    protocol,
    name: `${svcName || 'service'}${product ? ` — ${product}` : ''}`,
    severity: svc?.state,
    detail: [product, version, extrainfo].filter(Boolean).join(' ') || undefined,
  };
}

/** python-nmap `PortScanner.scan()` shape: `{ scan: { "<host>": { tcp: { "<port>": {...} } } } }`. */
function parsePythonNmapScan(scan: Record<string, Any>): ScanFinding[] {
  const findings: ScanFinding[] = [];
  for (const [host, data] of Object.entries<Any>(scan)) {
    const hostnames = asArray(data?.hostnames)
      .map((hn: Any) => hn?.name)
      .filter(Boolean);
    const displayHost = hostnames.length ? `${host} (${hostnames.join(', ')})` : host;
    for (const protocol of ['tcp', 'udp']) {
      const ports = data?.[protocol];
      if (!ports) continue;
      for (const [port, svc] of Object.entries<Any>(ports)) {
        findings.push(buildPortFinding(displayHost, String(port), protocol, svc));
      }
    }
  }
  return findings;
}

/** `nmaprun` shape produced by converting `nmap -oX` output to JSON (fast-xml-parser / xml2js style). */
function parseNmaprunHosts(hosts: Any[]): ScanFinding[] {
  const findings: ScanFinding[] = [];
  for (const h of hosts) {
    const addresses = asArray(h.address).filter((a: Any) => attr(a, 'addrtype') !== 'mac');
    const ip = attr(addresses[0], 'addr') || 'unknown';
    const hostnames = asArray(h.hostnames?.hostname)
      .map((hn: Any) => attr(hn, 'name'))
      .filter(Boolean);
    const displayHost = hostnames.length ? `${ip} (${hostnames.join(', ')})` : ip;

    for (const p of asArray(h.ports?.port)) {
      const state = attr(p.state, 'state');
      const service = p.service ?? {};
      const svcName = attr(service, 'name');
      const product = attr(service, 'product');
      const version = attr(service, 'version');
      const extrainfo = attr(service, 'extrainfo');
      findings.push({
        id: nanoid(8),
        host: displayHost,
        port: attr(p, 'portid'),
        protocol: attr(p, 'protocol'),
        name: `${svcName || 'service'}${product ? ` — ${product}` : ''}`,
        severity: state,
        detail: [product, version, extrainfo].filter(Boolean).join(' ') || undefined,
      });
    }
  }
  return findings;
}

/** Flat array-of-hosts shape (e.g. nmap-formatter), tolerant of PascalCase or lowercase keys. */
function parseFlatHostArray(hosts: Any[]): ScanFinding[] {
  const findings: ScanFinding[] = [];
  for (const h of hosts) {
    const addr = pick(h, 'Address', 'address', 'ip', 'host');
    const ip = typeof addr === 'string' ? addr : (pick(addr, 'Addr', 'addr') ?? 'unknown');
    for (const p of asArray(pick(h, 'Ports', 'ports'))) {
      const stateRaw = pick(p, 'State', 'state');
      const state = typeof stateRaw === 'string' ? stateRaw : pick(stateRaw, 'State', 'state');
      const service = pick(p, 'Service', 'service') ?? {};
      const svcName = pick(service, 'Name', 'name');
      const product = pick(service, 'Product', 'product');
      const version = pick(service, 'Version', 'version');
      findings.push({
        id: nanoid(8),
        host: String(ip),
        port: String(pick(p, 'PortId', 'Port', 'portid', 'port') ?? ''),
        protocol: pick(p, 'Protocol', 'protocol'),
        name: `${svcName || 'service'}${product ? ` — ${product}` : ''}`,
        severity: state,
        detail: [product, version].filter(Boolean).join(' ') || undefined,
      });
    }
  }
  return findings;
}

/**
 * Parses Nmap JSON in one of three common shapes: python-nmap's `scan` dict,
 * an `nmaprun`-wrapped XML→JSON conversion, or a flat array of host objects.
 * Nmap has no native JSON output, so all of these come from a conversion step upstream.
 */
export function parseNmapJson(text: string): ScanFinding[] {
  const parsed = JSON.parse(text.trim());

  if (parsed && typeof parsed === 'object' && parsed.scan && typeof parsed.scan === 'object' && !Array.isArray(parsed.scan)) {
    return parsePythonNmapScan(parsed.scan);
  }
  if (parsed && parsed.nmaprun) {
    return parseNmaprunHosts(asArray(parsed.nmaprun.host));
  }
  if (parsed && parsed.host && (parsed.ports || parsed.address)) {
    return parseNmaprunHosts(asArray(parsed.host));
  }
  if (Array.isArray(parsed)) {
    return parseFlatHostArray(parsed);
  }

  throw new Error('unrecognized-nmap-format');
}
