// Фигура тестового урока «HTML: загляни внутрь страницы» (навык anatomy):
// учебная модель HTML-документа — открываемая коробка с вложенными отделениями.
//   html  — внешняя коробка с крышкой (крышка снимается — документ «открыт»);
//   head  — левое отделение: сведения о странице; в нём карточка title;
//   body  — правое отделение: то, что видно на странице; в нём лист страницы.
// Передняя стенка каждого отделения — его закрывающая граница (закрывающий
// тег): без неё отделение не закрыто. Никаких механизмов и декора — только
// вложенность частей.
//
// Разметка, на которую опирается урок (см. Fig в zaglyani.src.jsx):
//   data-t      текст, который урок подставляет;
//   data-part   часть: урок ставит data-state = ghost | off;
//   data-sel    подсветка (data-lit на солидах + класс is-lit на группе);
//   data-hit    нажимаемая часть; data-move — сдвиг по оси; data-shake — качнуть;
//   data-tag    цвет тега для надписей и подсветки.

import * as k from './kit/iso-kit.mjs';

const r4 = (v) => Math.round(v * 10000) / 10000;

export function docModel() {
  const WIDTH = 560, HEIGHT = 420;
  const AZ = 58, EL = 34;

  const PLINTH = { x: -106, y: -52, w: 212, d: 104, r: 10 };
  const CASE = { x: -100, y: -46, w: 200, d: 92, r: 8 };
  const RIM_H = 12, WALL = 4, FLOOR = 4;
  const TRAY_H = 18;
  const TRAYS = {
    head: { x: -92, y: -38, w: 76, d: 76, r: 5 },
    body: { x: -10, y: -38, w: 102, d: 76, r: 5 },
  };
  const LID_Z0 = RIM_H, LID_H = 22;          // закрытая крышка укрывает всё
  const LID_UP = 70;                         // насколько крышка поднимается
  const DROP = 34;                           // отделения и карточки «опускаются» на место

  const P = k.fitProjection([
    ...k.boxCorners(PLINTH, -8, 0),
    ...k.boxCorners(CASE, 0, LID_Z0 + LID_H + 6),
    [TRAYS.body.x + 10, TRAYS.body.y, 48], [TRAYS.head.x + 10, TRAYS.head.y, 46],
  ], WIDTH, HEIGHT, { pad: 16, azimuth: AZ, elevation: EL });

  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
  const onTopPath = (plan, z, steps = 3) => k.onTop(k.ringOf(plan, steps), z, P, true);
  // Текст на вертикальной грани y = const (смотрит на зрителя), по центру (x, z).
  const faceText = (x, y, z, text, size, { key, tag, cls, anchor = 'middle' } = {}) =>
    k.faceTextSvg(k.sideMatrix([x, y], z, P, 'left'), text, { size, tone: 'hi', anchor })
      .replace('<text ', `<text dy="${(size * 0.34).toFixed(2)}"${key ? ` data-t="${key}"` : ''}${tag ? ` data-tag="${tag}"` : ''}${cls ? ` class-extra="${cls}"` : ''} `);
  const topText = (x, y, z, text, size, { key, tag, along = 'x' } = {}) =>
    k.faceTextSvg(k.topMatrix([x, y], z, P, along), text, { size, tone: 'hi', anchor: 'middle' })
      .replace('<text ', `<text dy="${(size * 0.34).toFixed(2)}"${key ? ` data-t="${key}"` : ''}${tag ? ` data-tag="${tag}"` : ''} `);

  const out = [];

  // ── Подставка ─────────────────────────────────────────────────────────
  out.push(`<path class="iso-halo" d="${k.haloOf(PLINTH, -8, 8, P)}"/>`);
  out.push(S(slab(PLINTH, -8, 8, 8, 1.2), { tone: 'lo', inner: L(k.sideSeam(PLINTH, -4, P, 8), { tone: 'faint' }) }));

  // ── Коробка html: дно и дальние стенки ────────────────────────────────
  const caseG = [];
  caseG.push(S(slab(CASE, 0, FLOOR, 6, 0.8), { tone: 'mid' }));
  caseG.push(`<path class="fg-tint" data-tag="html" d="${onTopPath(k.insetPlan(CASE, WALL), FLOOR, 6)}"/>`);
  caseG.push(S(slab({ x: CASE.x, y: CASE.y, w: CASE.w, d: WALL, r: 2 }, FLOOR, RIM_H - FLOOR, 2, 0.4), { tone: 'mid' }));
  caseG.push(S(slab({ x: CASE.x, y: CASE.y, w: WALL, d: CASE.d, r: 2 }, FLOOR, RIM_H - FLOOR, 2, 0.4), { tone: 'mid' }));
  out.push(`<g data-part="case" data-hit="html" data-sel="html" data-tag="html">${caseG.join('')}</g>`);

  // Места для отделений (этап «Собери документ»): пунктир на дне коробки.
  out.push(`<g data-part="slots">${Object.entries(TRAYS).map(([n, t]) =>
    `<path class="fg-slot" data-slot="${n}" d="${onTopPath(t, FLOOR + 0.1, 5)}"/>`).join('')}</g>`);

  // ── Отделение (лоток) ─────────────────────────────────────────────────
  const tray = (name, t, contents) => {
    const g = [];
    const z0 = FLOOR, z1 = FLOOR + TRAY_H, W = 2.4;
    g.push(`<path class="iso-halo fg-tray-halo" d="${k.haloOf(t, z0, 1, P)}"/>`);
    g.push(S(slab(t, z0, 1.6, 5, 0.4), { tone: 'mid' }));                                   // дно
    g.push(`<path class="fg-tint" data-tag="${name}" d="${onTopPath(k.insetPlan(t, W), z0 + 1.6, 4)}"/>`);
    g.push(S(slab({ x: t.x, y: t.y, w: t.w, d: W, r: 1 }, z0, TRAY_H, 2, 0.4), { tone: 'mid' }));   // задняя
    g.push(S(slab({ x: t.x, y: t.y, w: W, d: t.d, r: 1 }, z0, TRAY_H, 2, 0.4), { tone: 'mid' }));   // левая
    // Ярлык-закладка с именем тега на задней стенке.
    g.push(`<g data-sel="${name}" data-tag="${name}">${S(slab({ x: t.x + 6, y: t.y, w: 34, d: 1.4, r: 0.6 }, z1, 12, 2), { tone: 'hi', crease: 'none' })}</g>`);
    g.push(faceText(t.x + 23, t.y + 1.4, z1 + 7.2, `<${name}>`, 5.4, { tag: name }));
    g.push(contents(t, z0 + 1.6));
    g.push(S(slab({ x: t.x + t.w - W, y: t.y, w: W, d: t.d, r: 1 }, z0, TRAY_H, 2, 0.4), { tone: 'mid' })); // правая
    // Передняя стенка — закрывающая граница отделения.
    g.push(`<g data-part="${name}-close" data-sel="${name}-close" data-tag="${name}">${S(slab({ x: t.x, y: t.y + t.d - W, w: t.w, d: W, r: 1 }, z0, TRAY_H, 2, 0.4), { tone: 'hi', crease: 'lo' })}</g>`);
    return `<g data-part="${name}" data-hit="${name}" data-shake="${name}" data-sel="${name}" data-tag="${name}"><g data-move="${name}">${g.join('')}</g></g>`;
  };

  // Карточка, стоящая в отделении: грань смотрит на зрителя.
  const card = (part, sel, tag, plan, z, h, keyText, label, lines) => {
    const g = [];
    g.push(`<g data-sel="${sel}" data-tag="${tag}">${S(slab(plan, z, h, 2, 0.3), { tone: 'hi', crease: 'lo' })}</g>`);
    const face = plan.y + plan.d;
    const cx = plan.x + plan.w / 2;
    // Подпись тега в левом верхнем углу карточки.
    g.push(faceText(plan.x + 3, face, z + h - 4.5, label, 4, { tag, anchor: 'start' }));
    const fit = (plan.w - 8).toFixed(1);
    const sans = (t) => t.replace('<text ', `<text data-font="sans" data-fit="${fit}" `);
    if (lines === 1) g.push(sans(faceText(cx, face, z + h * 0.6, '', 6.4, { key: keyText })));
    else {
      g.push(sans(faceText(cx, face, z + h * 0.68, '', 5.8, { key: keyText + '1' })));
      g.push(sans(faceText(cx, face, z + h * 0.46, '', 5.8, { key: keyText + '2' })));
    }
    return `<g data-part="${part}" data-hit="${sel}"><g data-move="${part}">${g.join('')}</g></g>`;
  };

  const headContents = (t, z) => card('title-card', 'title', 'title', { x: t.x + 7, y: t.y + 16, w: t.w - 14, d: 2, r: 0.6 }, z, 31, 'title', 'title', 1);
  const bodyContents = (t, z) => [
    card('page-card', 'page', 'body', { x: t.x + 7, y: t.y + 16, w: t.w - 14, d: 2, r: 0.6 }, z, 33, 'page', '', 2),
    // Карточка title, попавшая не туда (этап «Помоги Коди»): стоит перед листом.
    card('title-stray', 'title', 'title', { x: t.x + 16, y: t.y + 44, w: t.w - 32, d: 2, r: 0.6 }, z, 26, 'title', 'title', 1),
  ].join('');

  out.push(tray('head', TRAYS.head, headContents));
  out.push(tray('body', TRAYS.body, bodyContents));

  // ── Ближние стенки коробки: правая и передняя (передняя — закрывающая) ──
  const nearG = [];
  nearG.push(S(slab({ x: CASE.x + CASE.w - WALL, y: CASE.y, w: WALL, d: CASE.d, r: 2 }, FLOOR, RIM_H - FLOOR, 2, 0.4), { tone: 'mid' }));
  out.push(`<g data-part="case-near" data-hit="html">${nearG.join('')}</g>`);
  out.push(`<g data-part="html-close" data-hit="html" data-sel="html-close" data-tag="html">${S(slab({ x: CASE.x, y: CASE.y + CASE.d - WALL, w: CASE.w, d: WALL, r: 2 }, FLOOR, RIM_H - FLOOR, 2, 0.5), { tone: 'mid' })}`
    + `<g data-sel="html" data-tag="html">${S(slab({ x: CASE.x + 10, y: CASE.y + CASE.d, w: 40, d: 0.8, r: 0.4 }, FLOOR + 0.5, 8.6, 2), { tone: 'hi', crease: 'none' })}</g>`
    + faceText(CASE.x + 30, CASE.y + CASE.d + 0.8, FLOOR + 4.8, '<html>', 5.6, { tag: 'html' })
    + `</g>`);

  // ── Крышка ────────────────────────────────────────────────────────────
  const lid = [];
  lid.push(`<path class="iso-halo fg-lid-halo" d="${k.haloOf(CASE, LID_Z0, 1, P)}"/>`);
  lid.push(S(slab(k.insetPlan(CASE, -1), LID_Z0, LID_H, 6, 1.4), { tone: 'mid', inner: L(k.sideSeam(k.insetPlan(CASE, -1), LID_Z0 + 4, P, 6), { tone: 'faint' }) }));
  lid.push(L(onTopPath(k.insetPlan(CASE, 8), LID_Z0 + LID_H, 6), { tone: 'lo' }));
  lid.push(topText(0, 0, LID_Z0 + LID_H, '<html>', 16, { tag: 'html' }));
  lid.push(topText(0, 18, LID_Z0 + LID_H, 'index.html', 6, {}));
  out.push(`<g data-part="lid" data-hit="lid"><g data-move="lid">${lid.join('')}</g></g>`);

  const svg = k.figureSvg({
    width: WIDTH, height: HEIGHT, className: 'fg-doc',
    label: 'Модель HTML-документа: коробка html, внутри два отделения — head с карточкой title и body с листом страницы.',
    body: out,
  }).replace(/ class-extra="[^"]*"/g, '');

  const up = k.axisVector(P, [0, 0, 1]).map(r4);
  return {
    svg, ar: r4(WIDTH / HEIGHT),
    axes: { lid: up, head: up, body: up, 'title-card': up, 'title-stray': up, 'page-card': up },
    open: { lid: LID_UP, drop: DROP },
  };
}
