// Сборка тестового урока «Заголовки и текст: турнир Пикселя» (вариант 10).
//   node tools/zagolovki-turnir/turnir.build.mjs
// Пишет РОВНО один файл — lessons/test/10-zagolovki-i-tekst-turnir-pixel.jsx.
// Всё остальное только читается: канон курса, помощники и CSS урока 2 (через
// скрипт навыка sobrat.mjs), фигура робота Пикселя (tools/robot/robot.figures.mjs),
// кит anatomy. Временный исходник собирается в системной временной папке.
// Если файл назначения уже есть и это не этот урок — сборка останавливается.

import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import * as k from '../anatomy/kit/iso-kit.mjs';
import { robotModel, armCss } from '../robot/robot.figures.mjs';

const LESSON_ID = 'test-html-zagolovki-turnir-pixel';
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => readFileSync(here(p), 'utf8');
const dest = here('../../lessons/test/10-zagolovki-i-tekst-turnir-pixel.jsx');
if (existsSync(dest) && readFileSync(dest, 'utf8').indexOf(LESSON_ID) < 0) {
  throw new Error('Файл назначения занят другим уроком: ' + dest);
}

let src = read('./turnir.src.jsx');
const put = (mark, text) => {
  if (src.indexOf(mark) < 0) throw new Error('нет метки ' + mark);
  src = src.split(mark).join(text);
};
const tpl = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// Раскраска Пикселя — та же, что в уроке 07 (robot.build.mjs): у группы data-paint
// свой цвет, грани светлее и темнее, рёбра темнее (на тёмных деталях — светлее).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const lum = (h) => { const [r, g, b] = hex(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const PAINT = {
  base: '#24345E', base2: '#2F4473', plate: '#F4EBD9', limb: '#8C98AD', limb2: '#A9B3C4', frame: '#C9824A',
  shell: '#FF7A45', head: '#F4EBD9', hand: '#F4EBD9', face: '#1E2B4A', eye: '#5EEAD4', mouth: '#5EEAD4',
  screen: '#10213F', ans1: '#FFB703', ans2: '#4CC9F0', btn1: '#4CC9F0', btn2: '#FFD166', btn3: '#B388FF', ant: '#FFB703'
};
const paintCss = Object.entries(PAINT).map(([name, c]) => {
  const dark = lum(c) < 0.3;
  const edge = (t) => (dark ? mix(c, '#ffffff', t) : mix(c, '#000000', t));
  const v = {
    paper: c, top: mix(c, '#ffffff', 0.3), 'shade-3': mix(c, '#ffffff', 0.12), 'shade-2': c,
    'shade-1': mix(c, '#000000', 0.1), 'shade-0': mix(c, '#000000', 0.2),
    hi: name === 'mouth' ? c : edge(0.55), mid: edge(0.38), lo: edge(0.26), faint: edge(0.16), dot: edge(0.6)
  };
  return '.fig-robot.rb-css [data-paint="' + name + '"] { ' + Object.entries(v).map(([kk, vv]) => '--anatomy-' + kk + ': ' + vv + ';').join(' ') + ' }';
}).join('\n');

const pix = robotModel({ bust: true });
put('/*@PIXEL@*/', 'const PIX = ' + JSON.stringify({ svg: pix.svg, ar: pix.ar }) + ';');
put('/*@ISO_CSS@*/', tpl(k.ISO_CSS.trim()) + '\n' + paintCss + '\n' + armCss());
put('/*@OWN_CSS@*/', read('./tr-own.css').trim());

const tmp = mkdtempSync(join(tmpdir(), 'turnir-'));
try {
  const tmpSrc = join(tmp, 'turnir.src.jsx');
  writeFileSync(tmpSrc, src);
  execFileSync('node', [here('../../.claude/skills/novyy-urok/scripts/sobrat.mjs'), tmpSrc, dest], { stdio: 'inherit' });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
