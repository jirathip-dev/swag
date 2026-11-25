// `node shoot.mjs <chrome-headless-shell> [only]`: index and one sheet per scheme, each at 1440 and 390 (DPR 2), into png/.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { serve, chrome } from './cdp.mjs';

const bin = process.argv[2] || 'chrome-headless-shell', only = process.argv[3];
const d = JSON.parse(readFileSync(new URL('data.json', import.meta.url), 'utf8'));
const here = new URL('.', import.meta.url).pathname, out = new URL('png/', import.meta.url);
mkdirSync(out, { recursive: true });
const pages = [['index.html', 'index'], ...[...d.themes, ...d.others].map(t => [`sheet.html?s=${t.name}`, t.name])];
const shots = pages.flatMap(([p, n]) => [[p, `${n}-1440.png`, 1440, 900, 1], [p, `${n}-390.png`, 390, 844, 2]]).filter(s => !only || s[1].includes(only));
const srv = await serve(here), c = chrome(bin);
try {
  for (const [page, file, W, H, dpr] of shots) {
    const p = await c.open(`${srv.base}/${page}`, W, H, dpr, { ready: 'document.body.dataset.ready === "1"' });
    const sideways = await p.ev('document.documentElement.scrollWidth > innerWidth');
    writeFileSync(new URL(file, out), await p.full());
    await p.done();
    console.log('wrote', file, sideways ? '(SIDEWAYS SCROLL)' : '');
  }
} finally { c.kill(); srv.close(); }
if (c.errors.length) { console.error(c.errors.join('\n')); process.exit(1); }
