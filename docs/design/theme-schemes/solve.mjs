// Applies palette.mjs's picks to the start values: each pick is a colour from the theme's own palette; when it still
// misses, it moves to the nearest colour (least ΔE2000 from the pick) on an OKLCH grid of lightness and hue steps,
// chroma kept, at which no check naming the token misses.
import { gate, de } from './gate.mjs';
import { START } from './start.mjs';
import { PICKS } from './palette.mjs';

const MIRROR = { '--l': '--fk-l', '--p': '--fk-p', '--c': '--fk-c', '--g': '--fk-g', '--a': '--fk-a' };
const lin = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const gam = c => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const toHex = rgb => '#' + rgb.map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
function oklch(h) {
  const n = parseInt(h.slice(1, 7), 16), [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map(lin);
  const [l, m, s] = [[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566], [0.0883024619, 0.2817188376, 0.6299787005]]
    .map(([x, y, z]) => Math.cbrt(x * r + y * g + z * b));
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}
function fromOklch([L, C, H]) {
  for (let c = C; c >= 0; c -= 0.002) {
    const A = c * Math.cos(H), B = c * Math.sin(H);
    const [l, m, s] = [L + 0.3963377774 * A + 0.2158037573 * B, L - 0.1055613458 * A - 0.0638541728 * B, L - 0.0894841775 * A - 1.291485548 * B].map(v => v ** 3);
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    if (rgb.every(v => v >= -1e-4 && v <= 1 + 1e-4)) return toHex(rgb.map(gam));
  }
  return toHex([L, L, L].map(v => gam(Math.max(0, Math.min(1, v ** 3)))));
}
const hex = h => { const n = parseInt(h.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const set = (s, k, v) => { s.tokens[k] = v; if (MIRROR[k]) s.tokens[MIRROR[k]] = v; };
const names = k => [k, MIRROR[k]].filter(Boolean);
const missesOf = (s, k) => gate(s).filter(([w, v, m]) => v < m && names(k).some(n => new RegExp(`(^|[ ↔])${n}( |$)`).test(w)));

export function solve(name) {
  const s = structuredClone(START[name]), changes = [];
  for (const [k, pick] of Object.entries(PICKS[name] || {})) {
    const [src, from, why] = pick, was = s.tokens[k];
    set(s, k, src);
    let v = src;
    if (missesOf(s, k).length) {
      const [L0, C, H] = oklch(src), seen = new Set(), rgb = hex(src);
      let best = null;
      for (let dh = -30; dh <= 30; dh += 1) for (let dl = -0.4; dl <= 0.4; dl += 0.0025) {
        const c = fromOklch([L0 + dl, C, H + dh * Math.PI / 180]);
        if (seen.has(c)) continue;
        seen.add(c);
        const d = de(rgb, hex(c));
        if (best && d >= best[0]) continue;
        set(s, k, c);
        if (!missesOf(s, k).length) best = [d, c];
      }
      set(s, k, v = best ? best[1] : src);
    }
    if (k === '--bg') s.tokens['--scrim'] = `${v}99`;
    changes.push({ token: k, was, src, from, now: v, nudged: v !== src, shift: de(hex(src), hex(v)), why });
  }
  return { scheme: s, changes, misses: gate(s).filter(r => r[1] < r[2]) };
}

if (typeof process !== "undefined" && import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0;
  for (const n of Object.keys(START)) {
    const { changes, misses } = solve(n);
    console.log(`${misses.length ? 'FAIL' : 'PASS'} ${n}`);
    for (const c of changes) console.log(`   ${c.token} ${c.was} -> ${c.now}${c.nudged ? ` (from ${c.src} ${c.from}, ΔE ${c.shift.toFixed(1)})` : ` (${c.from})`}`);
    for (const [w, v, m] of misses) console.log(`   ✗ ${w} ${v.toFixed(2)} < ${m}`);
    bad += misses.length > 0;
  }
  process.exit(bad ? 1 : 0);
}
