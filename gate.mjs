// The theme gate CI runs (`node gate.mjs`; exit 1 on a fail): every scheme passes the board's contrast gate, and every
// sprite a legacy-board theme names is drawn in its own sprites.svg (farm, the fallback, names the whole contract).
import { readFileSync, readdirSync } from 'node:fs';
import { gate } from './design/garden/gate.mjs';

const read = p => readFileSync(new URL(p, import.meta.url), 'utf8');
const fails = [];
const schemes = readdirSync(new URL('schemes/', import.meta.url)).filter(f => f.endsWith('.json'));
for (const f of schemes)
  for (const [what, v, min] of gate(JSON.parse(read(`schemes/${f}`))))
    if (v < min) fails.push(`schemes/${f}: ${what} ${v.toFixed(2)} (min ${min})`);

const ACTS = ['impl', 'fix', 'rev', 'update', 'idle', 'done', 'blocked'];
const strs = o => Object.values(o ?? {}).filter(v => typeof v === 'string');
for (const t of readdirSync(new URL('legacy-board/', import.meta.url))) {
  const j = JSON.parse(read(`legacy-board/${t}/theme.json`)), svg = read(`legacy-board/${t}/sprites.svg`);
  if (t === 'farm') for (const a of ACTS) for (const k of ['actions', 'row_sprites'])
    if (typeof j[k]?.[a] !== 'string') fails.push(`legacy-board/farm: no ${k}.${a}`);
  const ids = [...strs(j.actions), ...strs(j.poses), ...strs(j.row_sprites), ...strs(j.rail), ...strs(j.load_scene?.minis),
    ...[j.loading, j.load_scene?.fan].filter(v => typeof v === 'string'),
    ...Object.values(j.moments ?? {}).map(m => m?.sprite).filter(Boolean),
    ...strs(j.stages).flatMap(s => (j.species ?? []).flatMap(p => [`${s}-${p.id}`, `${s}-${p.id}-row`]))];
  for (const id of new Set(ids)) if (!svg.includes(`id="${id}"`)) fails.push(`legacy-board/${t}: no sprite ${id}`);
  for (const s of typeof j.scheme === 'string' ? [j.scheme] : strs(j.scheme))
    if (!schemes.includes(`${s}.json`)) fails.push(`legacy-board/${t}: no scheme ${s}`);
}
console.log(fails.length ? fails.join('\n') : `ok: ${schemes.length} schemes, ${readdirSync(new URL('legacy-board/', import.meta.url)).length} themes`);
process.exit(fails.length ? 1 : 0);
