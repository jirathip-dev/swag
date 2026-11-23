// Renders sheet.html?s=<name> (one scheme: swag today, start values, proposal, and every gate check) and index.html.
const BASE = ['--bg', '--card', '--line', '--edge', '--fg', '--mute', '--l', '--link', '--g', '--a', '--r', '--p', '--c'];
const esc = s => String(s).replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
const fails = rows => rows.filter(r => r.got < r.min).length;
const vars = s => BASE.map(k => `--s-${k.slice(2)}:${s.tokens[k]}`).join(';');

function preview(s) {
  const t = s.tokens;
  return `<div class="pv" style="${vars(s)}">
    <div class="row"><span class="btn">Active tab</span><span style="color:${t['--link']}">a link</span><span style="color:${t['--l']}">accent</span></div>
    <div class="card"><div>Text on the card</div><div style="color:${t['--mute']}">Muted note, 2 min ago</div>
      <div class="row" style="margin-top:6px"><span class="pill" style="color:${t['--g']}">passed</span><span class="pill" style="color:${t['--a']}">waiting</span><span class="pill" style="color:${t['--r']}">failed</span></div></div>
    <div class="needs"><div><b style="color:${t['--r']}">Needs you</b> · body text</div><div style="color:${t['--mute']}">muted on the needs-you card</div></div>
    <div class="row"><span class="grp" style="color:${t['--r']};background:color-mix(in srgb, ${t['--r']} 12%, ${t['--bg']})">RED GROUP</span>
      <span class="grp" style="color:${t['--a']};background:color-mix(in srgb, ${t['--a']} 12%, ${t['--bg']})">AMBER GROUP</span>
      <span style="color:${t['--fk-p']}">purple</span><span style="color:${t['--fk-c']}">cyan</span></div>
  </div>`;
}

function swatches(s, changed = {}, ref) {
  return `<ul class="sw">${BASE.map(k => {
    const v = s.tokens[k], c = changed[k];
    const diff = !c && ref && ref.tokens[k] !== v;
    return `<li class="${c ? 'changed' : ''}"><i style="background:${v}"></i><span><b>${k}</b><span class="hex">${v}${c ? ` <s>${c.was}</s>` : ''}${diff ? ' ≠ start' : ''}</span></span></li>`;
  }).join('')}</ul>`;
}

function column(title, note, s, changed, ref) {
  return `<section class="col"><h3>${title} <small>${note}</small></h3>${preview(s)}${swatches(s, changed, ref)}</section>`;
}

function table(cols) {
  const head = cols.map(c => `<th style="text-align:right">${c.title}</th>`).join('');
  const body = cols[0].rows.map((r, i) => {
    const cells = cols.map((c, j) => {
      const x = c.rows[i], bad = x.got < x.min, fixed = c.after && !bad && cols[j - 1].rows[i].got < x.min;
      return `<td class="n ${bad ? 'bad' : ''} ${fixed ? 'fixed' : ''}">${bad ? '✗ ' : ''}${x.got.toFixed(2)}</td>`;
    }).join('');
    return `<tr><td>${esc(r.what)}</td>${cells}<td class="n">${r.min}</td></tr>`;
  }).join('');
  const foot = cols.map(c => { const f = fails(c.rows); return `<td class="n ${f ? 'bad' : 'ok'}">${f ? `${f} miss` : 'pass'}</td>`; }).join('');
  return `<table><thead><tr><th>Gate check</th>${head}<th style="text-align:right">min</th></tr></thead><tbody>${body}<tr><th>Result</th>${foot}<th></th></tr></tbody></table>`;
}

function changesTable(changes) {
  if (!changes.length) return '<p class="sub">No token changes.</p>';
  return `<table><thead><tr><th>Token</th><th>Start</th><th>Proposed</th><th class="wide">From</th><th>Why</th></tr></thead><tbody>${changes.map(c =>
    `<tr><td><code>${c.token}</code></td><td><span class="hex">${c.was}</span></td><td><b class="hex">${c.now}</b></td><td class="wide">${esc(c.from)}${c.nudged ? `, stepped to the nearest passing (ΔE ${c.shift.toFixed(1)} from ${c.src})` : ''}</td><td>${esc(c.why)}</td></tr>`).join('')}</tbody></table>`;
}

export function sheet(d, name) {
  const t = [...d.themes, ...d.others].find(x => x.name === name);
  if (!t) return `<main><h1>No scheme ${esc(name)}</h1></main>`;
  const changed = Object.fromEntries(t.changes.map(c => [c.token, c]));
  if (t.kind === 'other') {
    return `<main><h1>${esc(t.today.scheme.label)} <span class="badge ${t.ok ? 'ok' : 'bad'}">${t.ok ? 'passes the gate · no change' : 'misses'}</span></h1>
      <p class="sub"><code>schemes/${t.today.file}</code> · ${t.today.scheme['color-scheme']} · blocks gate at <code>${d.blocks.slice(0, 7)}</code></p>
      <div class="cols" style="--n:2">${column('swag today', t.today.file, t.today.scheme)}<section class="col"><h3>Gate</h3>${table([{ title: 'today', rows: t.today.rows }])}</section></div></main>`;
  }
  const cols = [], tcols = [];
  if (t.today) { cols.push(column('swag today', `schemes/${t.today.file}`, t.today.scheme)); tcols.push({ title: 'swag today', rows: t.today.rows }); }
  cols.push(column('Start values', 'the consumer\'s palette', t.start.scheme));
  cols.push(column('Proposed', `${t.changes.length} token${t.changes.length === 1 ? '' : 's'} changed`, t.after.scheme, changed));
  tcols.push({ title: 'start', rows: t.start.rows }, { title: 'proposed', rows: t.after.rows, after: true });
  const rename = name === 'gruvbox-dark' ? ' · replaces <code>gruvbox.json</code>' : '';
  return `<main><h1>${esc(t.after.scheme.label)} <span class="badge bad">${fails(t.start.rows)} misses</span> → <span class="badge ok">passes</span></h1>
    <p class="sub"><code>schemes/${name}.json</code>${rename} · ${t.after.scheme['color-scheme']} · blocks gate at <code>${d.blocks.slice(0, 7)}</code> · changed tokens are outlined, the start hex struck</p>
    <div class="cols" style="--n:${cols.length}">${cols.join('')}</div>
    <h2>What changes</h2>${changesTable(t.changes)}
    <h2>Every gate check, before and after</h2>${table(tcols)}</main>`;
}

const strip = s => `<div class="strip">${BASE.map(k => `<i style="background:${s.tokens[k]}" title="${k}"></i>`).join('')}</div>`;
export function index(d) {
  const theme = d.themes.map(t => `<tr><td><a href="sheet.html?s=${t.name}"><b>${t.name}</b></a>${t.today ? `<br><small class="sub">swag today: ${t.today.file} (${fails(t.today.rows) ? 'misses' : 'passes'})</small>` : ''}</td>
    <td>${strip(t.start.scheme)}</td><td>${strip(t.after.scheme)}</td><td class="n bad">${fails(t.start.rows)}</td><td class="n ok">${fails(t.after.rows) || 'pass'}</td>
    <td class="wide">${t.changes.map(c => `<code>${c.token}</code>`).join(' ')}</td></tr>`).join('');
  const other = d.others.map(t => {
    const low = t.today.rows.filter(r => r.min !== 20).reduce((a, r) => (r.got / r.min < a.got / a.min ? r : a));
    const lowde = t.today.rows.filter(r => r.min === 20).reduce((a, r) => (r.got < a.got ? r : a));
    return `<tr><td><a href="sheet.html?s=${t.name}"><b>${t.name}</b></a></td><td>${strip(t.today.scheme)}</td><td class="n ok">${t.ok ? 'pass' : 'miss'}</td><td class="n">${esc(low.what)} ${low.got.toFixed(2)}</td><td class="n wide">${esc(lowde.what)} ${lowde.got.toFixed(2)}</td></tr>`;
  }).join('');
  return `<main><h1>Theme schemes: 17 palettes through the blocks gate</h1>
    <p class="sub">Issue #11 · blocks gate at <code>${d.blocks.slice(0, 7)}</code> (the rev swag pins) · each proposal changes only tokens that miss, toward the theme's own palette</p>
    <h2>The 17 themes</h2><table><thead><tr><th>Scheme</th><th>Start</th><th>Proposed</th><th style="text-align:right">misses</th><th style="text-align:right">after</th><th class="wide">Changed tokens</th></tr></thead><tbody>${theme}</tbody></table>
    <h2>swag's other schemes: no change needed</h2><table><thead><tr><th>Scheme</th><th>Today</th><th style="text-align:right">gate</th><th style="text-align:right">tightest contrast</th><th style="text-align:right" class="wide">tightest ΔE</th></tr></thead><tbody>${other}</tbody></table></main>`;
}

export async function boot(which) {
  const d = await (await fetch('data.json')).json(), q = new URLSearchParams(location.search).get('s');
  document.body.innerHTML = which === 'index' ? index(d) : sheet(d, q);
  document.title = which === 'index' ? 'Theme schemes' : `${q} · theme schemes`;
  document.body.dataset.ready = '1';
}
