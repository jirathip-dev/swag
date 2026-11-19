import { copyFileSync, writeFileSync } from 'node:fs';
import { ACTIONS, MOMENTS, ROWS, LEVELS, draw, fine, clearing, signLayer } from './art.mjs';

const here = new URL('.', import.meta.url), out = new URL('../../packs/bush/', here);
const sym = (id, vb, body, fit = '') => `<symbol id="${id}" viewBox="${vb}"${fit} shape-rendering="crispEdges">${body}</symbol>`;
const rows = { edit: 'bound', read: 'peer', run: 'run', idle: 'sleep', done: 'laugh', needs: 'needs', merged: 'merged', fail: 'fail' };
const lanes = {
  loading: ACTIONS.bound, empty: ACTIONS.sleep, 'scene-edit': ACTIONS.bound, 'scene-idle': ACTIONS.sleep, 'scene-done': ACTIONS.laugh,
  'scene-needs': MOMENTS.screech, 'scene-merged': MOMENTS.clear, 'scene-fail': MOMENTS.swoop,
};
const RECT = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="([^"]+)"(?: opacity="([\d.]+)")?\/>/y;
function paths(svg) {
  let out = '', at = 0, batch = [];
  const flush = () => {
    const by = new Map();
    for (const r of batch) by.set(r.paint, (by.get(r.paint) || '') + `M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}z`);
    for (const [paint, d] of by) out += `<path ${paint} d="${d}"/>`;
    batch = [];
  };
  while (at < svg.length) {
    RECT.lastIndex = at;
    const m = RECT.exec(svg);
    if (!m) { flush(); const next = svg.indexOf('<', at + 1); const end = next < 0 ? svg.length : next; out += svg.slice(at, end); at = end; continue; }
    const [x, y, w, h] = m.slice(1, 5).map(Number);
    if (batch.some(b => x < b.x + b.w && b.x < x + w && y < b.y + b.h && b.y < y + h)) flush();
    batch.push({ x, y, w, h, paint: `fill="${m[5]}"${m[6] ? ` opacity="${m[6]}"` : ''}` });
    at = RECT.lastIndex;
  }
  flush();
  return out;
}

let sprites = '<svg xmlns="http://www.w3.org/2000/svg"><!-- cooee#22: written by docs/design/bush/pack.mjs from art.mjs; do not edit. -->';
sprites += '<style>.f2{display:none}</style>';
for (const [s, r] of Object.entries(rows)) sprites += sym(`s-${s}`, '0 0 16 16', draw(ROWS[r], 1));
for (const [s, fn] of Object.entries(lanes)) sprites += sym(`s-${s}`, '0 0 132 100', fine(fn()));
for (const l of LEVELS) sprites += sym(`s-sign-${l}`, '0 0 392 188', signLayer(l), ' preserveAspectRatio="xMidYMax slice"');
sprites += '</svg>\n';

const bare = clearing(4, true).replaceAll('var(--fk)', 'var(--fk,#58a6ff)');
const open = bare.indexOf('>') + 1;
const scene = bare.slice(0, open).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ') +
  '<style>.sky-night{display:none}#night:target~#clearing .sky-day{display:none}#night:target~#clearing .sky-night{display:inline}</style>' +
  `<g id="night"/><g id="clearing">${bare.slice(open, -'</svg>'.length)}</g></svg>\n`;

const theme = {
  label: 'bush',
  scheme: { dark: 'bush-dark', light: 'bush-light' },
  sprites: true,
  moments: true,
  scene: ['night', 'clearing'],
  load_scene: { kind: 'sign' },
  words: {
    working: 'on the move', needs: 'screech', done: 'home and hosed', fail: 'swooped', idle: 'having a kip',
    merged: 'over the fence', loading: 'bounding…', 'empty-threads': 'nobody about',
  },
};

writeFileSync(new URL('sprites.svg', out), paths(sprites));
writeFileSync(new URL('scene.svg', out), scene);
writeFileSync(new URL('theme.json', out), JSON.stringify(theme, null, 2) + '\n');
for (const n of ['bush-light', 'bush-dark']) copyFileSync(new URL(`schemes/${n}.json`, here), new URL(`../../schemes/${n}.json`, here));
copyFileSync(new URL('icon/icon-192.png', here), new URL('icon.png', out));
