// Фигура тестового урока «HTML: загляни внутрь страницы» — ШКАФ ДОКУМЕНТА
// (навык anatomy; заказчик, 17.10.2026: «поставим шкафчик из пробы 01»).
// Основа — проба lessons/test/01-anatomy-shkaf.jsx (shkaf.build.mjs): корпус —
// html, верхний ящик — head, нижний большой — body. Интерфейс тот же, что у
// коробки (zaglyani.figures.mjs), поэтому урок меняет только фигуру:
//   html   — корпус шкафа на подставке: дно, боковины, задняя стенка, крышка
//            с гравировкой <html>; правая боковина — часть case-near;
//   html-close — лицевая рамка вокруг ящиков с табличкой </html>: без неё
//            корпус не закрыт;
//   head   — верхний ящик: у задней стенки разделитель с ярлыком <head>, перед
//            ним карточка title; передняя панель с ярлыком </head> — head-close;
//   body   — нижний ящик: разделитель <body>, лист страницы (два ряда текста);
//            передняя панель </body> — body-close; «чужая» карточка
//            title-stray — для этапа «Помоги Коди»;
//   lid    — подъёмная дверца-фасад с табличкой index.html: закрытый документ;
//   slots  — пунктир пустых проёмов (этап «Собери документ»).
// Оба ящика по умолчанию выдвинуты лесенкой (body дальше head), чтобы сверху
// было видно, что лежит в каждом. В пробе открывался один ящик — в уроке на
// нескольких этапах нужны и название, и текст страницы сразу.
//
// Разметка для урока (как у коробки): data-t — текст; data-part — часть
// (data-state = ghost | off); data-sel — подсветка; data-hit — нажатие;
// data-move — сдвиг по оси (axes); data-shake — качнуть; data-tag — цвет тега.
// Оси: ящики — вперёд (к зрителю), дверца и карточки — вверх.
//
// НАСТРОЙКИ под урок (заказчик, 17.10.2026: «шкафчик подстраивается под
// контент урока»). Без настроек — шкаф урока 02, байт в байт.
//   doctype — табличка <!DOCTYPE html> стоит на крышке шкафа: первая строка
//             документа, над html (урок 07; заказчик, 17.10.2026). Гравировки
//             <html> на крышке тогда нет — там табличка.
//   tagsFront — порядок ярлыков как у кода сверху вниз (урок 07; заказчик,
//             17.10.2026): на передней панели ящика — открывающий тег <head>,
//             внутри у задней стенки — закрывающий </head>; таблички <html> и
//             </html> — на боковине сверху и снизу (спереди внизу их закрыли бы
//             выдвинутые ящики), между ящиками ничего нет.
//   covers  — ящики в покое задвинуты; ключи head-cover / body-cover выдвигают
//             их (0 — задвинут, open.cover — выдвинут). Так урок 07 «открывает
//             отделение»: вместо снятой крышки — выдвинутый ящик.

import * as k from './kit/iso-kit.mjs';

const r4 = (v) => Math.round(v * 10000) / 10000;

export function cabinetModel({ doctype = false, covers = false, tagsFront = false } = {}) {
  const WIDTH = 560, HEIGHT = 500;
  const AZ = 58, EL = 40;                      // чуть выше пробы (36°): видно, что лежит в обоих ящиках

  // ── Мир (z вверх, единица ≈ 1 px) ─────────────────────────────────────
  const BASE = { x: -93, y: -49, w: 186, d: 96, r: 6 };
  const BASE_H = 8, FOOT_H = 5;
  const CASE = { x: -84, y: -40, w: 168, d: 76 };
  const YF = CASE.y + CASE.d;                  // лицевая плоскость корпуса
  const SIDE = 4, BACK = 3, DECK = 6;
  const TOP_Z = 108, TOP_H = 5;
  const TOP = { x: -87, y: -43, w: 174, d: YF + 43, r: 3 };   // спереди заподлицо с рамкой
  const OPEN = { x0: -76, x1: 76 };
  const DR = {
    head: { z0: 74, z1: 102, pull: 30, divider: 1 },     // выдвинут меньше…
    body: { z0: 8, z1: 68, pull: 64, divider: 31 },      // …нижний — дальше: разделитель и лист — перед верхним ящиком
  };
  const DEPTH = 66;
  const PULL_SEL = 14;                         // выбранный ящик выдвигается ещё
  const LID_UP = 38, DROP = 70;               // дверца поднимается и тает, не улетая за кадр
  const DT_PLAN = { x: -34, y: -10, w: 68, d: 2, r: 0.6 };      // табличка <!DOCTYPE html> на крышке (doctype)

  const P = k.fitProjection([
    ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
    ...k.boxCorners(TOP, TOP_Z, TOP_Z + TOP_H),
    ...['head', 'body'].flatMap((n) => {
      const d = DR[n], y1 = YF + d.pull + PULL_SEL;
      return [[OPEN.x0, y1, d.z0], [OPEN.x1, y1, d.z0], [OPEN.x0, y1, d.z1 + 8], [OPEN.x1, y1, d.z1 + 8]];
    }),
    ...(doctype ? k.boxCorners(DT_PLAN, TOP_Z + TOP_H, TOP_Z + TOP_H + 17) : []),
  ], WIDTH, HEIGHT, { pad: 8, azimuth: AZ, elevation: EL });

  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (pts, style) => k.dotsSvg(pts, style);
  const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
  const box = (x0, x1, y0, y1, r = 0.4) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });
  const faceQuad = (x0, x1, z0, z1, y) => k.pathOf([at([x0, y, z0]), at([x1, y, z0]), at([x1, y, z1]), at([x0, y, z1])], true);
  const onTopPath = (plan, z, steps = 3) => k.onTop(k.ringOf(plan, steps), z, P, true);
  // Текст на вертикальной грани y = const (смотрит на зрителя), по центру (x, z).
  const faceText = (x, y, z, text, size, { key, tag, anchor = 'middle', tone = 'hi', fit, sans } = {}) =>
    k.faceTextSvg(k.sideMatrix([x, y], z, P, 'left'), text, { size, tone, anchor })
      .replace('<text ', `<text dy="${(size * 0.34).toFixed(2)}"${key ? ` data-t="${key}"` : ''}${tag ? ` data-tag="${tag}"` : ''}`
        + `${sans ? ' data-font="sans"' : ''}${fit ? ` data-fit="${fit}"` : ''} `);
  const topText = (x, y, z, text, size, { tag, along = 'x', tone = 'hi' } = {}) =>
    k.faceTextSvg(k.topMatrix([x, y], z, P, along), text, { size, tone, anchor: 'middle' })
      .replace('<text ', `<text dy="${(size * 0.34).toFixed(2)}"${tag ? ` data-tag="${tag}"` : ''} `);
  // Выпуклость произвольного набора экранных точек — для отсечки ящика.
  const hull = (points) => {
    const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [];
    for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    const up = [];
    for (const p of pts.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return [...lo.slice(0, -1), ...up.slice(0, -1)];
  };
  // Табличка с надписью на лицевой грани: подложка, две точки-винта, текст.
  const plateFace = (x, y, z, w, h, text, size, { tag, key } = {}) => [
    S(slab(box(x - w / 2, x + w / 2, y, y + 0.6, 0.3), z - h / 2, h, 2), { tone: 'hi', crease: 'none' }),
    D([at([x - w / 2 + 1.6, y + 0.6, z]), at([x + w / 2 - 1.6, y + 0.6, z])], { size: 0.42, tone: 'lo' }),
    faceText(x, y + 0.6, z, text, size, { tag, key }),
  ].join('');

  const out = [];
  const defs = [];

  // ── Подставка на ножках, табличка index.html ──────────────────────────
  const base = [];
  base.push(`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`);
  const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [x, y] of byDepth(k.corners(BASE, 14))) {
    base.push(S(k.cylinder(x, y, 6.6, -BASE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    base.push(S(k.cylinder(x, y, 5.2, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  base.push(S(slab(BASE, -BASE_H, BASE_H, 8, 1.4), { tone: 'lo', inner: L(k.sideSeam(BASE, -BASE_H + 3, P, 8), { tone: 'faint' }) }));
  base.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(BASE, 8);
  base.push(L(screws.map(([x, y]) => k.ring(x, y, 2.1, 0, P, 16)).join(''), { tone: 'lo' }));
  base.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  out.push(base.join(''));

  // ── Корпус html: дно, левая боковина, задняя стенка, крышка ───────────
  const caseG = [];
  caseG.push(S(slab(box(CASE.x, CASE.x + CASE.w, CASE.y, YF, 1), 0, DECK, 3, 0.5), { tone: 'mid' }));
  caseG.push(S(slab(box(CASE.x + SIDE, CASE.x + CASE.w - SIDE, CASE.y, CASE.y + BACK), DECK, TOP_Z - DECK, 2), { tone: 'mid' }));
  caseG.push(S(slab(box(CASE.x, CASE.x + SIDE, CASE.y, YF, 0.6), DECK, TOP_Z - DECK, 2, 0.3), { tone: 'mid' }));
  // Тёмная глубина проёмов: за ящиком видно нутро корпуса.
  for (const n of ['body', 'head']) caseG.push(`<path class="fg-void" d="${faceQuad(OPEN.x0, OPEN.x1, DR[n].z0, DR[n].z1, YF - 3)}"/>`);
  caseG.push(S(slab(TOP, TOP_Z, TOP_H, 4, 1.2), { tone: 'mid', inner: L(k.sideSeam(TOP, TOP_Z + 1.8, P, 4), { tone: 'faint' }) }));
  caseG.push(`<path class="fg-tint" data-tag="html" d="${onTopPath(k.insetPlan(TOP, 6), TOP_Z + TOP_H, 4)}"/>`);
  caseG.push(L(onTopPath(k.insetPlan(TOP, 6), TOP_Z + TOP_H, 4), { tone: 'lo' }));
  if (!doctype) {
    caseG.push(topText(0, -8, TOP_Z + TOP_H, '<html>', 11, { tag: 'html' }));
    caseG.push(L([0, 1, 2].map((i) => k.lineOnTop([-26, 6 + i * 4.2], [[26, 14, 20][i], 6 + i * 4.2], TOP_Z + TOP_H, P)).join(''), { tone: 'faint', free: true }));
  }
  out.push(`<g data-part="case" data-hit="html" data-sel="html" data-tag="html">${caseG.join('')}</g>`);

  // Правая боковина — ближняя к зрителю (этап сборки показывает её отдельно).
  const nearG = [];
  nearG.push(S(slab(box(CASE.x + CASE.w - SIDE, CASE.x + CASE.w, CASE.y, YF, 0.6), DECK, TOP_Z - DECK, 2, 0.3), { tone: 'mid',
    inner: L(k.segment([CASE.x + CASE.w, CASE.y + 6, DECK + 4], [CASE.x + CASE.w, YF - 6, DECK + 4], P), { tone: 'faint' }) }));
  // Вентиляционные прорези на боковине (при tagsFront — ниже: сверху табличка <html>).
  const ventZ = tagsFront ? 52 : 84;
  nearG.push(L([0, 1, 2, 3].map((i) => k.segment([CASE.x + CASE.w, -14, ventZ + i * 4.4], [CASE.x + CASE.w, 14, ventZ + i * 4.4], P)).join(''), { tone: 'lo' }));
  // Табличка на боковине: текст по грани x = const, читается от переднего края к заднему.
  const sidePlate = (z, text) => {
    const PX = CASE.x + CASE.w;
    return [
      S(slab(box(PX, PX + 0.6, -18, 30, 0.3), z - 4, 8, 2), { tone: 'hi', crease: 'none' }),
      D([at([PX + 0.6, 27.6, z]), at([PX + 0.6, -15.6, z])], { size: 0.42, tone: 'lo' }),
      k.faceTextSvg(k.sideMatrix([PX + 0.6, 6], z, P, 'right'), text, { size: 5.2, tone: 'hi', anchor: 'middle' })
        .replace('<text ', '<text dy="1.77" data-tag="html" '),
    ].join('');
  };
  if (tagsFront) nearG.push(`<g data-sel="html" data-tag="html">${sidePlate(TOP_Z - 9, '<html>')}</g>`);
  out.push(`<g data-part="case-near" data-hit="html" data-sel="html" data-tag="html">${nearG.join('')}</g>`);

  // ── Лицевая рамка (закрывающая граница html) и табличка </html> ───────
  const frameG = [];
  const FY0 = YF - 3;
  const rail = (z0, z1) => S(slab(box(CASE.x + SIDE, CASE.x + CASE.w - SIDE, FY0, YF, 0.4), z0, z1 - z0, 2, 0.3), { tone: 'mid' });
  frameG.push(rail(0, DR.body.z0));
  frameG.push(rail(DR.body.z1, DR.head.z0));
  frameG.push(rail(DR.head.z1, TOP_Z));
  for (const [x0, x1] of [[CASE.x + SIDE, OPEN.x0], [OPEN.x1, CASE.x + CASE.w - SIDE]]) {
    frameG.push(S(slab(box(x0, x1, FY0, YF, 0.3), DR.body.z0, DR.head.z1 - DR.body.z0, 2), { tone: 'mid' }));
  }
  // Притвор проёмов — тонкая линия по краю.
  for (const n of ['body', 'head']) frameG.push(L(faceQuad(OPEN.x0, OPEN.x1, DR[n].z0, DR[n].z1, YF), { tone: 'lo' }));
  if (tagsFront) frameG.push(`<g data-sel="html" data-tag="html">${sidePlate(DECK + 6, '</html>')}</g>`);
  else frameG.push(`<g data-sel="html" data-tag="html">${plateFace(0, YF, (DR.body.z1 + DR.head.z0) / 2, 34, 5.4, '</html>', 4.2, { tag: 'html' })}</g>`);
  out.push(`<g data-part="html-close" data-hit="html" data-sel="html-close" data-tag="html">${frameG.join('')}</g>`);

  // Пустые проёмы для этапа «Собери документ».
  out.push(`<g data-part="slots">${['body', 'head'].map((n) =>
    `<path class="fg-slot" data-slot="${n}" d="${faceQuad(OPEN.x0 + 2, OPEN.x1 - 2, DR[n].z0 + 2, DR[n].z1 - 2, YF + 0.2)}"/>`).join('')}</g>`);

  // ── Ящик ──────────────────────────────────────────────────────────────
  // Три слоя в порядке рисования: задний (стенки, дно, разделитель с ярлыком
  // открывающего тега) — отсечён по проёму; карточки — без отсечки, они всегда
  // перед корпусом; передний (правая стенка, панель с ярлыком закрывающего
  // тега) — тоже по проёму. Все три слоя двигаются вместе (data-move = имя).
  const drawer = (name, contents) => {
    const d = DR[name];
    const W = 2;
    const bx0 = OPEN.x0 + 2, bx1 = OPEN.x1 - 2;
    const by0 = YF - 3 - DEPTH + d.pull, by1 = YF - 3 + d.pull;   // положение в покое: выдвинут на pull
    const bz0 = d.z0 + 1, bz1 = d.z1 - 4;
    const floor = bz0 + 1.5;
    // Отсечка: видно только то, что перед лицевой плоскостью, в границах проёма.
    const R = [[OPEN.x0, d.z0], [OPEN.x1, d.z0], [OPEN.x1, d.z1], [OPEN.x0, d.z1]];
    const clip = hull(R.flatMap(([x, z]) => [at([x, YF, z]), at([x, YF + 260, z])]));
    defs.push(`<clipPath id="fg-clip-${name}"><path d="${k.pathOf(clip, true)}"/></clipPath>`);

    const back = [];
    back.push(S(slab(box(bx0, bx1, by0, by0 + W), bz0, bz1 - bz0, 2), { tone: 'mid', crease: 'lo' }));
    back.push(S(slab(box(bx0, bx0 + W, by0, by1), bz0, bz1 - bz0, 2), { tone: 'mid', crease: 'lo' }));
    back.push(S(slab(box(bx0, bx1, by0, by1), bz0, 1.5, 2), { tone: 'mid', crease: 'lo' }));
    back.push(`<path class="fg-tint" data-tag="${name}" d="${onTopPath(box(bx0 + W, bx1 - W, by0 + W, by1, 0), floor, 2)}"/>`);
    // Направляющие на внутренней стороне левой стенки.
    back.push(L(k.segment([bx0 + W, YF, bz0 + (bz1 - bz0) * 0.55], [bx0 + W, by1 - 2, bz0 + (bz1 - bz0) * 0.55], P), { tone: 'faint' }));
    // Разделитель у задней части видимого ящика: ярлык открывающего тега.
    const dy = YF + d.divider;
    back.push(S(slab(box(bx0 + W, bx1 - W, dy, dy + 1), floor, bz1 - floor - 2, 2), { tone: 'mid', crease: 'none' }));
    const tabX = bx0 + 20;
    back.push(`<g data-sel="${name}" data-tag="${name}">${S(slab(box(tabX - 15, tabX + 15, dy + 1, dy + 1.8, 0.3), bz1 - 10, 8.6, 2), { tone: 'hi', crease: 'none' })}</g>`);
    back.push(faceText(tabX, dy + 1.8, bz1 - 5.7, tagsFront ? `</${name}>` : `<${name}>`, tagsFront ? 4.4 : 5, { tag: name }));

    const front = [];
    front.push(S(slab(box(bx1 - W, bx1, by0, by1), bz0, bz1 - bz0, 2), { tone: 'mid', crease: 'lo' }));
    // Внешняя направляющая на правой стенке — видна, когда ящик выдвинут.
    front.push(S(slab(box(bx1, bx1 + 1, YF, by1 - 1, 0.2), bz0 + (bz1 - bz0) * 0.4, 2.4, 2), { tone: 'lo', crease: 'none' }));
    // Передняя панель — закрывающая граница: ярлык </имя>, ручка, держатель.
    const panel = box(OPEN.x0 + 0.8, OPEN.x1 - 0.8, by1, by1 + 3, 0.8);
    const pz0 = d.z0 + 0.8, ph = d.z1 - d.z0 - 1.6;
    const pf = by1 + 3;
    const close = [];
    close.push(`<g data-sel="${name}-close" data-tag="${name}">${S(slab(panel, pz0, ph, 2, 0.5), { tone: 'hi', crease: 'lo' })}</g>`);
    close.push(L(faceQuad(panel.x + 3, panel.x + panel.w - 3, pz0 + 3, pz0 + ph - 3, pf), { tone: 'faint' }));
    const lz = d.z1 - (name === 'head' ? 9 : 13);
    close.push(L(faceQuad(-19, 19, lz - 4.6, lz + 4.6, pf), { tone: 'lo' }));
    close.push(plateFace(0, pf, lz, 36, 8, tagsFront ? `<${name}>` : `</${name}>`, name === 'head' ? 4.8 : 5.4, { tag: name }));
    const mz = name === 'head' ? d.z0 + 7 : d.z0 + (d.z1 - d.z0) * 0.42;
    for (const x of [-17, 14]) close.push(S(slab(box(x, x + 3, pf, pf + 4, 0.6), mz - 1.5, 3, 2), { tone: 'mid', crease: 'none' }));
    close.push(S(slab(box(-20, 20, pf + 3.2, pf + 5.6, 1.1), mz - 1.3, 2.6, 3, 0.3), { tone: 'mid' }));
    front.push(`<g data-part="${name}-close" data-hit="${name}" data-sel="${name}-close" data-tag="${name}">${close.join('')}</g>`);

    // covers: геометрия посчитана выдвинутой, а в покое сдвинута назад на pull —
    // ключ name-cover возвращает её вперёд.
    const shut = covers ? k.axisVector(P, [0, -d.pull, 0]).map((v) => v.toFixed(2)).join(' ') : null;
    const layer = (inner) => (covers
      ? `<g data-move="${name}"><g data-move="${name}-cover"><g transform="translate(${shut})">${inner}</g></g></g>`
      : `<g data-move="${name}">${inner}</g>`);
    const g = [
      `<g clip-path="url(#fg-clip-${name})">${layer(back.join(''))}</g>`,
      layer(contents({ bx0: bx0 + W, bx1: bx1 - W, floor, top: bz1, pull: d.pull })),
      `<g clip-path="url(#fg-clip-${name})">${layer(front.join(''))}</g>`,
    ];
    return `<g data-part="${name}" data-hit="${name}" data-shake="${name}" data-sel="${name}" data-tag="${name}">${g.join('')}</g>`;
  };

  // Карточка, стоящая в ящике: грань смотрит на зрителя, сверху подпись тега.
  const card = (part, sel, tag, plan, z, h, keyText, label, lines) => {
    const g = [];
    g.push(`<g data-sel="${sel}" data-tag="${tag}">${S(slab(plan, z, h, 2, 0.3), { tone: 'hi', crease: 'lo' })}</g>`);
    const face = plan.y + plan.d;
    const cx = plan.x + plan.w / 2;
    if (label) g.push(faceText(plan.x + 3, face, z + h - 3.6, label, 3.8, { tag, anchor: 'start' }));
    const fit = (plan.w - 8).toFixed(1);
    if (lines === 1) g.push(faceText(cx, face, z + h - 10.5, '', 6.2, { key: keyText, sans: true, fit }));
    else {
      g.push(faceText(cx, face, z + h - 5.8, '', 5.6, { key: keyText + '1', sans: true, fit }));
      g.push(faceText(cx, face, z + h - 12.2, '', 5.6, { key: keyText + '2', sans: true, fit }));
    }
    return `<g data-part="${part}" data-hit="${sel}"><g data-move="${part}">${g.join('')}</g></g>`;
  };

  // head: карточка title — в выдвинутой части ящика, перед разделителем.
  const headContents = (b) => {
    const y = YF + 6;
    return card('title-card', 'title', 'title', box(-30, 42, y, y + 2, 0.6), b.floor, 22, 'title', 'title', 1);
  };
  // body: лист страницы и «чужая» карточка title (этап «Помоги Коди»).
  const bodyContents = (b) => [
    card('page-card', 'page', 'body', box(-36, 68, YF + 35, YF + 37, 0.6), b.floor, 57, 'page', '', 2),
    card('title-stray', 'title', 'title', box(-14, 52, YF + 46, YF + 48, 0.6), b.floor, 58, 'title', 'title', 1),
  ].join('');

  if (doctype) {
    // <!DOCTYPE html> — отдельная табличка на крышке: первая строка документа.
    const dt = DT_PLAN, z0 = TOP_Z + TOP_H;
    const dtG = [];
    dtG.push(S(slab(box(dt.x - 3, dt.x + dt.w + 3, dt.y - 4, dt.y + 5, 1.6), z0, 2, 3, 0.4), { tone: 'lo' }));
    dtG.push(D([at([dt.x - 1, dt.y + 3.4, z0 + 2]), at([dt.x + dt.w + 1, dt.y + 3.4, z0 + 2])], { size: 0.45, tone: 'lo' }));
    dtG.push(`<g data-sel="doctype">${S(slab(dt, z0 + 2, 14, 2, 0.4), { tone: 'hi', crease: 'lo' })}</g>`);
    dtG.push(faceText(dt.x + dt.w / 2, dt.y + dt.d, z0 + 9, '<!DOCTYPE html>', 5.2, { fit: (dt.w - 6).toFixed(1) }));
    out.push(`<g data-part="doctype" data-hit="doctype" data-sel="doctype" data-tag="doctype">${dtG.join('')}</g>`);
  }
  out.push(drawer('body', bodyContents));
  out.push(drawer('head', headContents));

  // ── Дверца-фасад: закрытый документ ───────────────────────────────────
  const lid = [];
  const LY = YF;
  lid.push(`<path class="iso-halo fg-lid-halo" d="${k.haloOf(box(CASE.x + 1, CASE.x + CASE.w - 1, LY, LY + 3, 1), 1, 1, P)}"/>`);
  lid.push(S(slab(box(CASE.x + 1, CASE.x + CASE.w - 1, LY, LY + 3, 1), 1, TOP_Z - 2, 2, 0.8), { tone: 'mid' }));
  lid.push(L(faceQuad(CASE.x + 7, CASE.x + CASE.w - 7, 7, TOP_Z - 7, LY + 3), { tone: 'faint' }));
  lid.push(plateFace(0, LY + 3, 70, 50, 10, 'index.html', 5.6));
  lid.push(S(k.cylinder(0, LY + 5, 3.2, 40, 2.2, P, 24), { tone: 'mid' }));   // кнопка-защёлка
  out.push(`<g data-part="lid" data-hit="lid"><g data-move="lid">${lid.join('')}</g></g>`);

  const svg = k.figureSvg({
    width: WIDTH, height: HEIGHT, className: 'fg-doc fg-cab',
    label: 'Модель HTML-документа — шкаф: корпус html, верхний ящик head с карточкой title, нижний ящик body с листом страницы.',
    body: [`<defs>${defs.join('')}</defs>`, ...out],
  });

  const up = k.axisVector(P, [0, 0, 1]).map(r4);
  const fwd = k.axisVector(P, [0, 1, 0]).map(r4);
  return {
    svg, ar: r4(WIDTH / HEIGHT),
    axes: Object.assign({ lid: up, head: fwd, body: fwd, 'title-card': up, 'title-stray': up, 'page-card': up },
      covers ? { 'head-cover': k.axisVector(P, [0, DR.head.pull, 0]).map(r4), 'body-cover': k.axisVector(P, [0, DR.body.pull, 0]).map(r4) } : {}),
    open: Object.assign({ lid: LID_UP, drop: DROP, pull: PULL_SEL }, covers ? { cover: 1 } : {}),
  };
}
