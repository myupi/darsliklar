// Пробная фигура навыка anatomy: HTML-документ как шкаф с ящиками.
//   корпус шкафа — <html> (весь документ);
//   верхний узкий ящик — <head>: карточки «о странице», видна из них только
//     карточка title — её текст стоит на вкладке браузера на шкафу;
//   нижний большой ящик — <body>: папки с содержимым, оно видно на странице.
// Сборка: node tools/anatomy/shkaf.build.mjs → lessons/test/01-anatomy-shkaf.jsx
// Кит (tools/anatomy/kit/iso-kit.mjs) — из навыка anatomy, лицензия MIT.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from './kit/iso-kit.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '../../lessons/test/01-anatomy-shkaf.jsx');

const WIDTH = 520;
const HEIGHT = 540;
const AZ = 58;
const EL = 36;                                    // чуть выше обычных 30°: видно, что лежит в ящике

// ── Мир (z вверх, единица ≈ 1 px) ────────────────────────────────
const BASE = { x: -86, y: -52, w: 172, d: 124, r: 6 };
const BASE_H = 9;
const FOOT_H = 5;
const CASE = { x: -60, y: -40, w: 120, d: 76, r: 2 };
const CASE_H = 132;
const YF = CASE.y + CASE.d;                      // лицевая плоскость корпуса
const TOP = { x: -63, y: -43, w: 126, d: 82, r: 3 };
const TOP_H = 5;
const TOP_Z = CASE_H + TOP_H;
const DEPTH = 64;                                 // глубина ящика
const DRAWERS = {
  body: { x0: -52, x1: 52, z0: 8, z1: 80, open: 48 },
  head: { x0: -52, x1: 52, z0: 88, z1: 116, open: 54 },
};
// Браузер на шкафу
const FRAME = { x: -46, y: -19, w: 92, d: 5, r: 1.5 };
const FRAME_Z0 = 146;
const FRAME_Z1 = 206;
const SCREEN_Y = FRAME.y + FRAME.d;

const P = k.fitProjection(
  [
    ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
    ...k.boxCorners(TOP, CASE_H, TOP_Z),
    ...k.boxCorners(FRAME, FRAME_Z0, FRAME_Z1),
    [-52, YF + 48 + 6, 8], [52, YF + 48 + 6, 80], [-52, YF + 54 + 6, 88],
  ],
  WIDTH, HEIGHT, { pad: 22, azimuth: AZ, elevation: EL },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const tagText = (svg, key) => svg.replace('<text ', `<text data-t="${key}" `);
// Квадрат в вертикальной плоскости y = const (лицевая грань): x0..x1, z0..z1.
const faceQuad = (x0, x1, z0, z1, y) => k.pathOf([at([x0, y, z0]), at([x1, y, z0]), at([x1, y, z1]), at([x0, y, z1])], true);

function hull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of pts.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

// ── Основание на ножках ─────────────────────────────────────────
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BASE, 16))) {
    out.push(S(k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(slab(BASE, -BASE_H, BASE_H, 8, 1.4), { tone: 'mid', inner: L(k.sideSeam(BASE, -BASE_H + 3, P, 8), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(BASE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Табличка с именем файла — справа от корпуса, вдоль y.
  const plate = { x: 66, y: -6, w: 13, d: 46, r: 1.2 };
  out.push(S(slab(plate, 0, 0.8, 3), { tone: 'lo', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(plate, 1.6), 0.8, P, 3), { tone: 'faint' }));
  out.push(D([at([plate.x + 6.5, plate.y + 3, 0.8]), at([plate.x + 6.5, plate.y + plate.d - 3, 0.8])], { size: 0.45 }));
  out.push(k.faceTextSvg(k.topMatrix([plate.x + 8.4, plate.y + plate.d / 2], 0.8, P, 'y'), 'index.html', { size: 4.6, tone: 'mid', anchor: 'middle' }));
  return out.join('');
}

// ── Корпус: <html> ──────────────────────────────────────────────
function caseBody() {
  const out = [];
  out.push(`<g data-sel="html">${S(slab(CASE, 0, CASE_H, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(CASE, 4, P, 3), { tone: 'faint' }) })}</g>`);
  // Проёмы ящиков: тёмная глубина + нижний порожек.
  for (const d of Object.values(DRAWERS)) {
    out.push(`<path class="ash-void" d="${faceQuad(d.x0, d.x1, d.z0, d.z1, YF)}"/>`);
    out.push(L(faceQuad(d.x0, d.x1, d.z0, d.z1, YF), { tone: 'lo' }));
  }
  // Табличка <html> на верхней планке.
  const plate = { x: -21, y: YF, w: 42, d: 0.8, r: 0.4 };
  out.push(`<g data-sel="html">${S(slab(plate, 120.5, 9.5, 2), { tone: 'hi', crease: 'none' })}</g>`);
  out.push(D([at([-18.5, YF + 0.8, 125.5]), at([18.5, YF + 0.8, 125.5])], { size: 0.45 }));
  out.push(k.faceTextSvg(k.sideMatrix([0, YF + 0.8], 125.5, P, 'left'), '<html>', { size: 5.4, tone: 'hi', anchor: 'middle' }).replace('<text ', '<text dy="1.9" '));
  // Крышка.
  out.push(S(slab(TOP, CASE_H, TOP_H, 4, 1.2), { tone: 'mid', inner: L(k.sideSeam(TOP, CASE_H + 1.6, P, 4), { tone: 'faint' }) }));
  return out.join('');
}

// ── Ящик ────────────────────────────────────────────────────────
function drawer(name, d, contents) {
  const W = 2;                                   // стенка
  const bx0 = d.x0 + 3, bx1 = d.x1 - 3;
  const by0 = YF - 3 - DEPTH, by1 = YF - 3;
  const bz0 = d.z0 + 1, bz1 = d.z1 - 6;
  const out = [];
  out.push(S(slab({ x: bx0, y: by0, w: bx1 - bx0, d: W, r: 0.4 }, bz0, bz1 - bz0, 2), { tone: 'mid', crease: 'lo' }));
  out.push(S(slab({ x: bx0, y: by0, w: W, d: by1 - by0, r: 0.4 }, bz0, bz1 - bz0, 2), { tone: 'mid', crease: 'lo' }));
  out.push(S(slab({ x: bx0, y: by0, w: bx1 - bx0, d: by1 - by0, r: 0.4 }, bz0, 1.5, 2), { tone: 'mid', crease: 'lo' }));
  out.push(contents({ bx0: bx0 + W, bx1: bx1 - W, by0: by0 + W, by1, floor: bz0 + 1.5, top: bz1 }));
  out.push(S(slab({ x: bx1 - W, y: by0, w: W, d: by1 - by0, r: 0.4 }, bz0, bz1 - bz0, 2), { tone: 'mid', crease: 'lo' }));
  // Лицевая панель.
  const panel = { x: d.x0 + 0.8, y: YF - 3, w: d.x1 - d.x0 - 1.6, d: 3, r: 0.8 };
  const pz0 = d.z0 + 0.8, ph = d.z1 - d.z0 - 1.6;
  out.push(`<g data-sel="${name}">${S(slab(panel, pz0, ph, 2, 0.5), { tone: 'hi', crease: 'lo' })}</g>`);
  out.push(L(faceQuad(panel.x + 3, panel.x + panel.w - 3, pz0 + 3, pz0 + ph - 3, YF), { tone: 'faint' }));
  // Ручка: две стойки и планка.
  const mz = d.z0 + (d.z1 - d.z0) * (name === 'head' ? 0.36 : 0.42);
  for (const x of [-16, 13]) out.push(S(slab({ x, y: YF, w: 3, d: 4, r: 0.6 }, mz - 1.5, 3, 2), { tone: 'mid', crease: 'none' }));
  out.push(S(slab({ x: -19, y: YF + 3.2, w: 38, d: 2.4, r: 1.1 }, mz - 1.3, 2.6, 3, 0.3), { tone: 'mid' }));
  // Держатель этикетки с тегом.
  const lz = name === 'head' ? d.z1 - 9.5 : d.z1 - 16;
  const lh = name === 'head' ? 7 : 9;
  out.push(L(faceQuad(-17, 17, lz - 0.8, lz + lh + 0.8, YF), { tone: 'lo' }));
  out.push(S(slab({ x: -16, y: YF, w: 32, d: 0.6, r: 0.3 }, lz, lh, 2), { tone: 'lo', crease: 'none' }));
  out.push(D([at([-15, YF + 0.6, lz + lh / 2]), at([15, YF + 0.6, lz + lh / 2])], { size: 0.4, tone: 'lo' }));
  out.push(tagText(k.faceTextSvg(k.sideMatrix([0, YF + 0.6], lz + lh / 2, P, 'left'), `<${name}>`, { size: lh * 0.62, tone: 'hi', anchor: 'middle' }), name).replace('<text ', `<text dy="${(lh * 0.22).toFixed(2)}" `));
  // Отсечка: видна только часть ящика перед лицевой плоскостью корпуса.
  const R = [[d.x0, d.z0], [d.x1, d.z0], [d.x1, d.z1], [d.x0, d.z1]];
  const clip = hull(R.flatMap(([x, z]) => [at([x, YF, z]), at([x, YF + d.open + 30, z])]));
  return `<clipPath id="ash-clip-${name}"><path d="${k.pathOf(clip, true)}"/></clipPath>`
    + `<g clip-path="url(#ash-clip-${name})"><g data-drawer="${name}">${out.join('')}</g></g>`;
}

// Содержимое head: стойка с карточкой title и две лежачие карточки (meta).
function headContents(b) {
  const out = [];
  const hold = { x: -34, y: -12, w: 26, d: 7, r: 1 };
  out.push(S(slab(hold, b.floor, 3.5, 3, 0.4), { tone: 'mid' }));
  out.push(L(k.lineOnTop([hold.x + 2, hold.y + 3.5], [hold.x + hold.w - 2, hold.y + 3.5], b.floor + 3.5, P), { tone: 'lo' }));
  const card = { x: -32, y: -9.1, w: 22, d: 1.2, r: 0.3 };
  out.push(`<g data-sel="title">${S(slab(card, b.floor + 2, 15, 2), { tone: 'hi', crease: 'lo' })}</g>`);
  out.push(k.faceTextSvg(k.sideMatrix([-21, card.y + card.d], b.floor + 12.5, P, 'left'), 'title', { size: 4.4, tone: 'hi', anchor: 'middle' }));
  out.push(L(k.segment([-28, card.y + card.d, b.floor + 7.6], [-14, card.y + card.d, b.floor + 7.6], P), { tone: 'lo', free: true }));
  for (const [i, y] of [[0, -13], [1, -2]]) {
    const c = { x: 4 + i * 4, y, w: 30, d: 9, r: 0.6 };
    out.push(S(slab(c, b.floor + i * 0.8, 0.8, 2), { tone: 'mid', crease: 'none' }));
    out.push(L([0, 1, 2].map((r) => k.lineOnTop([c.x + 3, c.y + 2.5 + r * 2.2], [c.x + 3 + [20, 14, 17][r], c.y + 2.5 + r * 2.2], b.floor + i * 0.8 + 0.8, P)).join(''), { tone: 'lo', free: true }));
  }
  return out.join('');
}

// Содержимое body: подвесные папки с вкладками h1 / p / p / img.
function bodyContents(b) {
  const out = [];
  const tabs = [['h1', -34], ['p', -8], ['p', 14], ['img', -24]];
  [-8, 0, 8, 16].forEach((y, i) => {
    const f = { x: b.bx0 + 1, y, w: b.bx1 - b.bx0 - 2, d: 1, r: 0.3 };
    out.push(S(slab(f, b.floor, b.top - b.floor, 2), { tone: 'mid', crease: 'lo' }));
    const [label, tx] = tabs[i];
    out.push(`<g data-sel="body-tab">${S(slab({ x: tx, y, w: 16, d: 1, r: 0.3 }, b.top, 5.5, 2), { tone: 'hi', crease: 'lo' })}</g>`);
    out.push(k.faceTextSvg(k.sideMatrix([tx + 8, y + 1], b.top + 2.75, P, 'left'), label, { size: 4, tone: 'hi', anchor: 'middle' }).replace('<text ', '<text dy="1.4" '));
  });
  return out.join('');
}

// ── Браузер на шкафу ────────────────────────────────────────────
function browser() {
  const out = [];
  const foot = { x: -40, y: -27, w: 80, d: 20, r: 3 };
  out.push(S(slab(foot, TOP_Z, 3, 4, 0.6), { tone: 'mid' }));
  out.push(D([at([-36, -23, TOP_Z + 3]), at([36, -23, TOP_Z + 3])], { size: 0.45 }));
  for (const x of [-30, 30]) {
    out.push(S(k.cylinder(x, -16.5, 3.4, TOP_Z + 3, 1.4, P, 20), { tone: 'lo' }));
    out.push(S(k.cylinder(x, -16.5, 2.2, TOP_Z + 4.4, FRAME_Z0 - TOP_Z - 4.4, P, 20), { tone: 'mid', crease: 'none' }));
  }
  out.push(S(slab(FRAME, FRAME_Z0, FRAME_Z1 - FRAME_Z0, 3, 0.6), { tone: 'mid' }));
  // Экран — в плоскости лицевой грани рамки: u вправо (= x + 46), v вниз (= 206 − z).
  const m = k.sideMatrix([FRAME.x, SCREEN_Y], FRAME_Z1, P, 'left');
  out.push(`<g transform="${m}" class="ash-screen">
<rect x="3" y="3" width="86" height="54" rx="2" class="ash-scr"/>
<rect x="3" y="3" width="86" height="11" rx="2" class="ash-strip"/>
<rect x="6" y="5.4" width="51" height="8.6" rx="1.6" class="ash-tab" data-glow="head"/>
<rect x="8.6" y="8" width="3.4" height="3.4" rx=".8" class="ash-fav"/>
<text x="14" y="11.4" class="ash-tab-t" data-t="title">Мой первый сайт</text>
<path d="M53 8.4l2.4 2.4M55.4 8.4L53 10.8" class="ash-x"/>
<rect x="6" y="16" width="80" height="4.4" rx="2.2" class="ash-url"/>
<rect x="5" y="22.6" width="82" height="32.4" rx="1.4" class="ash-page" data-glow="body"/>
<text x="9" y="31" class="ash-page-t" data-t="hello">Привет! Это моя страница.</text>
<path d="M9 37h52M9 41.4h44M9 45.8h48" class="ash-rule"/>
</g>`);
  return out.join('');
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: 'HTML-документ как шкаф: корпус — тег html, верхний ящик — head с карточкой title, нижний ящик — body с папками. На шкафу стоит браузер: на вкладке — текст карточки title, на странице — содержимое body.',
  body: [
    base(),
    caseBody(),
    browser(),
    drawer('body', DRAWERS.body, bodyContents),
    drawer('head', DRAWERS.head, headContents),
  ],
});

const AY = k.axisVector(P, [0, 1, 0]);

// Свои токены поверх светлой темы кита: акцент — цвет курса HTML.
const EXTRA_CSS = `
.ash .iso[data-theme="light"], .ash.iso[data-theme="light"] { --anatomy-lit: #FF4F28; --anatomy-lit-top: #FFF4F0; --anatomy-lit-shade: #FFEEE8; }
.ash-void { fill: #3a3a3e; opacity: .55; }
.ash-scr { fill: var(--anatomy-face); stroke: var(--anatomy-mid); stroke-width: .5; vector-effect: non-scaling-stroke; }
.ash-strip { fill: var(--anatomy-shade-1); }
.ash-tab { fill: var(--anatomy-face); stroke: var(--anatomy-lo); stroke-width: .5; vector-effect: non-scaling-stroke; transition: stroke .3s, fill .3s; }
.ash-fav { fill: #FF4F28; }
.ash-tab-t { font: 600 3.7px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; fill: var(--anatomy-hi); }
.ash-x { stroke: var(--anatomy-mid); stroke-width: .5; vector-effect: non-scaling-stroke; fill: none; stroke-linecap: round; }
.ash-url { fill: var(--anatomy-shade-2); }
.ash-page { fill: transparent; stroke: transparent; stroke-width: 1.2; vector-effect: non-scaling-stroke; transition: stroke .3s, fill .3s; }
.ash-page-t { font: 4.4px Georgia, "Times New Roman", serif; fill: var(--anatomy-hi); }
.ash-rule { stroke: var(--anatomy-lo); stroke-width: .6; vector-effect: non-scaling-stroke; stroke-linecap: round; }
.ash-screen [data-glow].is-on { stroke: #FF4F28; stroke-width: 1.4; fill: #FFF4F0; }
`;

const jsx = `// Тестовый урок: пробная фигура навыка anatomy — HTML-документ как шкаф.
// Файл собран скриптом tools/anatomy/shkaf.build.mjs — правится скрипт, а не
// этот файл (геометрия посчитана при сборке). Кит фигур — навык anatomy, MIT.
import React, { useEffect, useRef, useState } from 'react';

export const META = { id: 'test-anatomy-shkaf', title: 'Пробная фигура: документ как шкаф' };

const SVG = ${JSON.stringify(svg)};
const ISO_CSS = ${JSON.stringify(k.ISO_CSS)};
const EXTRA_CSS = ${JSON.stringify(EXTRA_CSS)};
const AY = ${JSON.stringify(AY.map((v) => Math.round(v * 10000) / 10000))};
const OPEN = { head: ${DRAWERS.head.open}, body: ${DRAWERS.body.open} };

const T = {
  uz: {
    h: 'HTML-hujjat — bu shkaf', lead: 'Tortmani bosing: nima ichida turibdi va brauzerda nima ko‘rinadi?',
    hint: 'Tortmani bosing', fig: 'Rasm 1', ttl: 'Hujjat tuzilishi',
    title: 'Mening saytim', hello: 'Salom! Bu mening sahifam.',
    say: {
      html: '<html> — butun shkaf: unda ikki tortma bor',
      head: '<head> — sahifa haqida. Yorliqda: «Mening saytim»',
      body: '<body> — sahifada ko‘rinadigan hamma narsa',
    },
    cap: 'Yuqori tortma head — sahifa haqidagi kartochkalar. Ulardan faqat title ko‘rinadi: u brauzer yorlig‘ida turadi. Pastki katta tortma body — undagi hamma narsa sahifada ko‘rinadi.',
    done: 'Tayyor',
  },
  ru: {
    h: 'HTML-документ — это шкаф', lead: 'Нажми на ящик: что лежит внутри и что видно в браузере?',
    hint: 'Нажми на ящик', fig: 'Рис. 1', ttl: 'Строение документа',
    title: 'Мой первый сайт', hello: 'Привет! Это моя страница.',
    say: {
      html: '<html> — весь шкаф: в нём два ящика',
      head: '<head> — о странице. На вкладке: «Мой первый сайт»',
      body: '<body> — всё, что видно на странице',
    },
    cap: 'Верхний ящик head — карточки о странице. Из них видна только title: она стоит на вкладке браузера. Нижний большой ящик body — всё, что в нём лежит, видно на странице.',
    done: 'Готово',
  },
  en: {
    h: 'An HTML document is a cabinet', lead: 'Tap a drawer: what is inside, and what shows in the browser?',
    hint: 'Tap a drawer', fig: 'Fig. 1', ttl: 'Document structure',
    title: 'My first site', hello: 'Hello! This is my page.',
    say: {
      html: '<html> — the whole cabinet: it holds two drawers',
      head: '<head> — about the page. On the tab: “My first site”',
      body: '<body> — everything you see on the page',
    },
    cap: 'The top drawer, head, holds cards about the page. Only title shows: it sits on the browser tab. The big bottom drawer, body: everything in it shows on the page.',
    done: 'Done',
  },
};
const ORDER = ['html', 'head', 'body'];

export default function AnatomyShkaf({ lang = 'ru', onFinished }) {
  const t = T[lang] || T.ru;
  const stageRef = useRef(null);
  const selRef = useRef('html');
  const tourRef = useRef(true);
  const kickRef = useRef(() => {});
  const [sel, setSel] = useState('html');
  const finished = useRef(false);

  const choose = (name) => {
    tourRef.current = false;
    selRef.current = name;
    setSel(name);
    kickRef.current();
  };

  useEffect(() => {
    const root = stageRef.current;
    const svg = root.querySelector('svg');
    svg.querySelectorAll('[data-t]').forEach((n) => { const key = n.getAttribute('data-t'); if (t[key]) n.textContent = t[key]; });
    const drawers = { head: svg.querySelector('[data-drawer="head"]'), body: svg.querySelector('[data-drawer="body"]') };
    const pos = { head: 0, body: 0 };
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, clock = 0, idle = 0, shown = '';

    const paint = () => {
      for (const n of ['head', 'body']) drawers[n].setAttribute('transform', 'translate(' + (AY[0] * pos[n]).toFixed(2) + ' ' + (AY[1] * pos[n]).toFixed(2) + ')');
      const s = selRef.current;
      if (s !== shown) {
        shown = s;
        svg.querySelectorAll('[data-sel]').forEach((g) => {
          const key = g.getAttribute('data-sel');
          const on = key === s || (s === 'head' && key === 'title') || (s === 'body' && key === 'body-tab');
          const solid = g.querySelector('.iso-solid');
          if (on) solid.setAttribute('data-lit', ''); else solid.removeAttribute('data-lit');
        });
        svg.querySelectorAll('[data-glow]').forEach((r) => r.classList.toggle('is-on', r.getAttribute('data-glow') === s));
      }
    };
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      if (tourRef.current) {
        clock += dt;
        const next = ORDER[Math.floor(clock / 3.2) % ORDER.length];
        if (next !== selRef.current) { selRef.current = next; setSel(next); }
      }
      let moving = false;
      for (const n of ['head', 'body']) {
        const want = selRef.current === n ? OPEN[n] : 0;
        pos[n] = still.matches ? want : pos[n] + (want - pos[n]) * (1 - Math.exp(-dt / 0.22));
        if (Math.abs(want - pos[n]) < 0.05) pos[n] = want; else moving = true;
      }
      paint();
      frame = tourRef.current || moving ? requestAnimationFrame(tick) : 0;
    };
    const run = () => { if (!frame) { last = 0; frame = requestAnimationFrame(tick); } };
    kickRef.current = () => {
      clearTimeout(idle);
      idle = setTimeout(() => { tourRef.current = !still.matches; clock = ORDER.indexOf(selRef.current) * 3.2; run(); }, 6000);
      run();
    };
    const onClick = (e) => {
      const g = e.target.closest('[data-drawer]');
      if (g) choose(g.getAttribute('data-drawer'));
      else if (e.target.closest('[data-sel="html"]')) choose('html');
    };
    svg.addEventListener('click', onClick);
    if (still.matches) tourRef.current = false;
    paint();
    run();
    return () => { cancelAnimationFrame(frame); clearTimeout(idle); svg.removeEventListener('click', onClick); };
  }, [lang]);

  const finish = () => { if (finished.current) return; finished.current = true; onFinished && onFinished({ lesson: META.id, completed: true }); };

  return (
    <div className="ash iso" data-theme="light">
      <style>{ISO_CSS + EXTRA_CSS + LAYOUT_CSS}</style>
      <div className="ash-wrap">
        <h1 className="ash-h">{t.h}</h1>
        <p className="ash-lead">{t.lead}</p>
        <figure className="iso-figure">
          <div className="iso-plate">
            <div className="iso-plate-corners" aria-hidden="true">
              <span className="iso-plate-corner" data-corner="fig">{t.fig}</span>
              <span className="iso-plate-corner" data-corner="title">{t.ttl}</span>
              <span className="iso-plate-corner" data-corner="hint">{t.hint}</span>
            </div>
            <div ref={stageRef} className="iso-stage" dangerouslySetInnerHTML={{ __html: SVG }} />
          </div>
          <div className="ash-tags" role="group">
            {ORDER.map((n) => (
              <button key={n} type="button" className={'ash-tag' + (sel === n ? ' is-on' : '')} onClick={() => choose(n)}>{'<' + n + '>'}</button>
            ))}
          </div>
          <p className="ash-say" aria-live="polite">{t.say[sel]}</p>
          <figcaption className="iso-legend"><span className="iso-caption">{t.cap}</span></figcaption>
        </figure>
        <button type="button" className="ash-done" onClick={finish}>{t.done}</button>
      </div>
    </div>
  );
}

const LAYOUT_CSS = \`
.ash { min-height: 100%; background: var(--anatomy-page); color: var(--anatomy-text); font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
.ash *, .ash *::before, .ash *::after { box-sizing: border-box; }
.ash-wrap { width: min(560px, 100% - 32px); margin: 0 auto; padding: 20px 0 28px; }
.ash-h { margin: 0 0 4px; font-size: 22px; line-height: 1.2; color: var(--anatomy-strong); }
.ash-lead { margin: 0; color: var(--anatomy-text); }
.ash .iso-figure { margin: 14px 0 12px; }
.ash .iso-plate { padding: 40px 12px 36px; border-radius: 14px; box-shadow: 0 0 0 1px var(--anatomy-faint); }
.ash .iso-plate-corners { inset: 14px 16px; }
.ash .iso-stage svg { max-height: 62vh; }
.ash .iso-stage [data-drawer], .ash .iso-stage [data-sel="html"] { cursor: pointer; }
.ash-tags { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
.ash-tag { min-height: 44px; padding: 8px 16px; border: 0; border-radius: 12px; background: var(--anatomy-card); color: var(--anatomy-strong);
  font: 600 16px var(--anatomy-mono); box-shadow: 0 0 0 1px var(--anatomy-faint); cursor: pointer; transition: background .2s, color .2s, box-shadow .2s; }
.ash-tag.is-on { background: #FF4F28; color: #fff; box-shadow: none; }
.ash-say { min-height: 3em; margin: 10px 0 0; text-align: center; color: var(--anatomy-strong); font-weight: 600; }
.ash .iso-legend { margin-top: 4px; }
.ash-done { display: block; width: 100%; min-height: 50px; margin-top: 6px; border: 0; border-radius: 14px; background: #FF4F28; color: #fff; font: 700 17px ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
\`;
`;

writeFileSync(OUT, jsx);
console.log('wrote', OUT, Math.round(jsx.length / 1024) + ' KB');
