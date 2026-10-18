// Сборка тестового урока «Заголовки и текст: монитор турнира».
//   node tools/zagolovki/zagolovki.build.mjs → lessons/test/09-zagolovki-monitor.jsx
// Подставляет в zagolovki.src.jsx фигуру монитора (monitor.figures.mjs), CSS кита
// anatomy и раскраску корпуса, затем собирает файл общим скриптом навыка
// (sobrat.mjs: канон дословно, помощники и CSS урока 2, свой CSS zg-own.css).

import { readFileSync, writeFileSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../anatomy/kit/iso-kit.mjs';
import { monitorModel } from './monitor.figures.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => readFileSync(here(p), 'utf8');
let src = read('./zagolovki.src.jsx');
const put = (mark, text) => {
  if (src.indexOf(mark) < 0) throw new Error('нет метки ' + mark);
  src = src.split(mark).join(text);
};
const tpl = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// Раскраска корпуса: у каждой группы data-paint свой цвет; грани светлее и
// темнее его, рёбра на тёмном — светлее (как у робота Pixel).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const lum = (h) => { const [r, g, b] = hex(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const PAINT = { shell: '#2C313C', neck: '#3A404D', base: '#353B47' };
const paintCss = Object.entries(PAINT).map(([name, c]) => {
  const dark = lum(c) < 0.3;
  const edge = (t) => (dark ? mix(c, '#ffffff', t) : mix(c, '#000000', t));
  const v = {
    paper: c, top: mix(c, '#ffffff', 0.18), 'shade-3': mix(c, '#ffffff', 0.08), 'shade-2': c,
    'shade-1': mix(c, '#000000', 0.12), 'shade-0': mix(c, '#000000', 0.24),
    hi: edge(0.5), mid: edge(0.3), lo: edge(0.22), faint: edge(0.12), dot: edge(0.55)
  };
  return '.zg-mon [data-paint="' + name + '"] { ' + Object.entries(v).map(([kk, vv]) => '--anatomy-' + kk + ': ' + vv + ';').join(' ') + ' }';
}).join('\n');

put('/*@MONITOR@*/', 'const MON = ' + JSON.stringify(monitorModel()) + ';');
put('/*@ISO_CSS@*/', tpl(k.ISO_CSS.trim()) + '\n' + paintCss);

// sobrat.mjs ищет /*@FILE:…@*/ рядом с исходником — временная папка с копией CSS.
const tmp = mkdtempSync(join(here('./'), '.build-'));
try {
  const tmpSrc = join(tmp, 'zagolovki.src.jsx');
  writeFileSync(tmpSrc, src);
  copyFileSync(here('./zg-own.css'), join(tmp, 'zg-own.css'));
  const dest = here('../../lessons/test/09-zagolovki-monitor.jsx');
  execFileSync('node', [here('../../.claude/skills/novyy-urok/scripts/sobrat.mjs'), tmpSrc, dest], { stdio: 'inherit' });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
