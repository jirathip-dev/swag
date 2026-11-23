// `node build.mjs`: writes data.json (every scheme's gate numbers: swag today, start values, proposed) for the sheets,
// and proposed/<name>.json, the scheme files impl copies into schemes/ once approved. Exit 1 if any proposal misses.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { gate } from './gate.mjs';
import { START } from './start.mjs';
import { solve } from './solve.mjs';

const dir = new URL('../../../schemes/', import.meta.url), out = new URL('proposed/', import.meta.url);
const file = n => JSON.parse(readFileSync(new URL(`${n}.json`, dir), 'utf8'));
const TODAY = { dracula: 'dracula', 'github-dark': 'github-dark', 'gruvbox-dark': 'gruvbox', nord: 'nord', 'solarized-dark': 'solarized-dark' };
const rows = s => gate(s).map(([what, got, min]) => ({ what, got: Math.round(got * 100) / 100, min }));
mkdirSync(out, { recursive: true });
const themes = Object.keys(START).map(name => {
  const { scheme, changes, misses } = solve(name);
  writeFileSync(new URL(`${name}.json`, out), JSON.stringify(scheme, null, 2) + '\n');
  const today = TODAY[name] && { file: `${TODAY[name]}.json`, scheme: file(TODAY[name]), rows: rows(file(TODAY[name])) };
  return { name, kind: 'theme', today, start: { scheme: START[name], rows: rows(START[name]) }, after: { scheme, rows: rows(scheme) }, changes, ok: !misses.length };
});
const taken = new Set(Object.values(TODAY));
const others = readdirSync(dir).map(f => f.replace('.json', '')).filter(n => !taken.has(n)).sort().map(name => {
  const s = file(name), r = rows(s);
  return { name, kind: 'other', today: { file: `${name}.json`, scheme: s, rows: r }, changes: [], ok: r.every(x => x.got >= x.min) };
});
writeFileSync(new URL('data.json', import.meta.url), JSON.stringify({ blocks: 'd0882093e32c6d752910c459efa04a2a6beb5c3a', themes, others }, null, 1) + '\n');
const bad = [...themes, ...others].filter(t => !t.ok).map(t => t.name);
console.log(`${themes.length} themes, ${others.length} other schemes; misses: ${bad.join(', ') || 'none'}`);
process.exit(bad.length ? 1 : 0);
