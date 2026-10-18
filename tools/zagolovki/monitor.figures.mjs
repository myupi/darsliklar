// Монитор — объёмная фигура тестового урока «Заголовки и текст» (навык anatomy;
// заказчик, 18.10.2026: «монитор, и внутри — всё, что урок показывает»).
//
// Корпус рисуется при сборке (кит anatomy): подставка с площадкой, шея с
// шарниром, тонкий корпус экрана с задней крышкой, рамка, «подбородок» с
// табличкой и индикатором питания, глазок камеры, кнопки снизу справа.
// ЭКРАН — не картинка. В его плоскость урок кладёт настоящий мини-браузер
// (HTML поверх SVG): фигура отдаёт три точки экрана в координатах рисунка
// (screen: tl, tr, bl), урок считает 2D-матрицу и разворачивает HTML-слой по
// плоскости экрана. Так страница на мониторе живая и чёткая, и это работает
// везде, где работает CSS transform (без foreignObject).
//
// Разметка для урока:
//   data-part="glass"  — тёмное стекло (видно, пока экран выключен);
//   data-part="led"    — индикатор питания (класс is-on — горит);
//   data-hit="monitor" — нажатие на корпус;
//   data-paint="base | neck | shell" — группы для раскраски (как у робота Pixel).
// full — рамка всего рисунка без пустых полей; crop — рамка без подставки (корпус и верх шеи): на тесных экранах урок
// показывает монитор крупнее, подставляя её в viewBox.

import * as k from '../anatomy/kit/iso-kit.mjs';

const r2 = (v) => Math.round(v * 100) / 100;
const r4 = (v) => Math.round(v * 10000) / 10000;

export function monitorModel() {
  const WIDTH = 520, HEIGHT = 420;
  const AZ = 72, EL = 15;                      // почти анфас: экран читается, но объём виден

  // ── Мир (z вверх). Лицевая плоскость экрана — y = 0, смотрит на зрителя. ──
  const PANEL = { x0: -108, x1: 108, z0: 46, z1: 190 };      // корпус экрана
  const SCREEN = { x0: -101, x1: 101, z0: 58.5, z1: 183 };   // стекло (≈ 16:10)
  const PANEL_D = 5;                                         // толщина корпуса
  const BACK = { x: -64, y: -PANEL_D - 9, w: 128, d: 9, r: 4 }; // задняя крышка с электроникой
  const BASE = { x: -46, y: -34, w: 92, d: 46, r: 16 };
  const NECK = { x: -10, y: -24, w: 20, d: 9, r: 3 };

  const P = k.fitProjection([
    ...k.boxCorners(BASE, -2, 4),
    ...k.boxCorners({ x: PANEL.x0, y: -PANEL_D, w: PANEL.x1 - PANEL.x0, d: PANEL_D }, PANEL.z0, PANEL.z1),
    ...k.boxCorners(BACK, 70, 168),
  ], WIDTH, HEIGHT, { pad: 10, azimuth: AZ, elevation: EL });

  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (pts, style) => k.dotsSvg(pts, style);
  const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
  const box = (x0, x1, y0, y1, r = 0.4) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });
  const quad = (x0, x1, z0, z1, y) => k.pathOf([at([x0, y, z0]), at([x1, y, z0]), at([x1, y, z1]), at([x0, y, z1])], true);
  const faceText = (x, y, z, text, size, tone = 'mid') =>
    k.faceTextSvg(k.sideMatrix([x, y], z, P, 'left'), text, { size, tone, anchor: 'middle' })
      .replace('<text ', `<text dy="${r2(size * 0.34)}" `);

  const out = [];
  const group = (paint, from) => { const g = out.splice(from); out.push(`<g data-paint="${paint}">${g.join('')}</g>`); };

  // ── Подставка: площадка со скосом, резиновый обод, отверстие для кабеля ──
  out.push(`<path class="iso-halo" d="${k.haloOf(BASE, -2, 6, P)}"/>`);
  out.push(S(slab(k.insetPlan(BASE, -1.2), -2, 2, 12, 0.6), { tone: 'lo' }));
  out.push(S(slab(BASE, 0, 4, 12, 1.4), { tone: 'mid', inner: L(k.sideSeam(BASE, 1.6, P, 12), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 6), 4, P, 12), { tone: 'faint' }));
  const hole = { x: -6, y: BASE.y + 7, w: 12, d: 6, r: 3 };
  out.push(`<path class="mon-hole" d="${k.planOutline(hole, 4, P, 8)}"/>`);
  out.push(L(k.planOutline(hole, 4, P, 8), { tone: 'lo' }));
  group('base', 1);
  const neckAt = out.length;

  // ── Шея с шарниром ────────────────────────────────────────────────────────
  out.push(S(slab(k.insetPlan(NECK, -3), 4, 2.4, 6, 0.6), { tone: 'mid' }));             // накладка
  out.push(S(slab(NECK, 6.4, 70, 6, 0.8), { tone: 'mid',
    inner: L(k.segment([NECK.x + NECK.w, NECK.y + 2, 14], [NECK.x + NECK.w, NECK.y + 2, 70], P), { tone: 'faint' }) }));
  // Кабель-канал на шее — тёмная прорезь.
  out.push(`<path class="mon-slot" d="${quad(-3, 3, 20, 44, NECK.y + NECK.d + 0.01)}"/>`);
  // Шарнир: ось вдоль x.
  out.push(S(slab(box(-15, 15, -20, -11, 3), 72, 12, 6, 1), { tone: 'mid' }));
  out.push(D([at([-12.5, -11, 78]), at([12.5, -11, 78])], { size: 0.5, tone: 'lo' }));
  group('neck', neckAt);
  const shellAt = out.length;

  // ── Задняя крышка (видна сбоку) ───────────────────────────────────────────
  out.push(S(slab(BACK, 70, 98, 6, 2), { tone: 'mid', inner: L(k.sideSeam(BACK, 120, P, 6), { tone: 'faint' }) }));
  // Вентиляционные прорези на задней крышке справа.
  out.push(L([0, 1, 2, 3, 4].map((i) => k.segment([BACK.x + BACK.w, BACK.y + 2, 100 + i * 5], [BACK.x + BACK.w, BACK.y + BACK.d - 2, 100 + i * 5], P)).join(''), { tone: 'lo' }));

  // ── Корпус экрана ─────────────────────────────────────────────────────────
  const panelPlan = box(PANEL.x0, PANEL.x1, -PANEL_D, 0, 4);
  out.push(`<g data-hit="monitor">${S(slab(panelPlan, PANEL.z0, PANEL.z1 - PANEL.z0, 6, 1.2), { tone: 'mid' })}</g>`);
  group('shell', shellAt);
  // Рамка: внутренний скос вокруг стекла.
  out.push(`<path class="mon-bezel" d="${quad(SCREEN.x0 - 1.6, SCREEN.x1 + 1.6, SCREEN.z0 - 1.6, SCREEN.z1 + 1.6, 0.01)}"/>`);
  // Стекло (тёмное, пока экран выключен).
  out.push(`<g data-part="glass"><path class="mon-glass" d="${quad(SCREEN.x0, SCREEN.x1, SCREEN.z0, SCREEN.z1, 0.02)}"/>`
    + `<path class="mon-glare" d="${k.pathOf([at([SCREEN.x0 + 20, 0.03, SCREEN.z1]), at([SCREEN.x0 + 70, 0.03, SCREEN.z1]), at([SCREEN.x0 + 10, 0.03, SCREEN.z0]), at([SCREEN.x0, 0.03, SCREEN.z0]), at([SCREEN.x0, 0.03, SCREEN.z0 + 22])], true)}"/></g>`);
  out.push(L(quad(SCREEN.x0, SCREEN.x1, SCREEN.z0, SCREEN.z1, 0.02), { tone: 'lo' }));
  // Глазок камеры в верхней рамке.
  out.push(`<circle class="mon-cam" cx="${r2(at([0, 0.02, 186.6])[0])}" cy="${r2(at([0, 0.02, 186.6])[1])}" r="1.5"/>`);
  out.push(D([at([0, 0.02, 186.6])], { size: 0.35, tone: 'lo' }));
  // «Подбородок»: табличка и индикатор питания.
  out.push(faceText(0, 0.02, 51.8, 'JUNIOR IT', 4.2, 'lo'));
  const ledAt = at([92, 0.02, 51.8]);
  out.push(`<g data-part="led"><circle class="mon-led" cx="${r2(ledAt[0])}" cy="${r2(ledAt[1])}" r="1.6"/></g>`);
  // Кнопки на нижней грани справа.
  for (const x of [70, 77, 84]) out.push(S(slab(box(x, x + 4, -3.6, -1.4, 0.6), PANEL.z0 - 1.6, 1.6, 2), { tone: 'lo', crease: 'none' }));

  const svg = k.figureSvg({
    width: WIDTH, height: HEIGHT, className: 'fg-monitor',
    label: 'Монитор на подставке. На экране — браузер со страницей.',
    body: out,
  });

  // Рамка без подставки: корпус, задняя крышка и шея до середины.
  const cropPts = [
    ...k.boxCorners({ x: PANEL.x0, y: -PANEL_D, w: PANEL.x1 - PANEL.x0, d: PANEL_D }, PANEL.z0 - 2, PANEL.z1),
    ...k.boxCorners(BACK, 70, 168), ...k.boxCorners(NECK, 30, 46),
  ].map(at);
  const xs = cropPts.map((q) => q[0]), ys = cropPts.map((q) => q[1]);
  const cx0 = Math.min(...xs) - 4, cy0 = Math.min(...ys) - 4;
  const crop = [cx0, cy0, Math.max(...xs) + 4 - cx0, Math.max(...ys) + 4 - cy0].map(r2);
  // Рамка всего рисунка без пустых полей (подставка с тенью, корпус, крышка).
  const allPts = [
    ...k.boxCorners(k.insetPlan(BASE, -3), -2, 6),
    ...k.boxCorners({ x: PANEL.x0, y: -PANEL_D, w: PANEL.x1 - PANEL.x0, d: PANEL_D }, PANEL.z0, PANEL.z1),
    ...k.boxCorners(BACK, 70, 168),
  ].map(at);
  const ax = allPts.map((q) => q[0]), ay = allPts.map((q) => q[1]);
  const fx0 = Math.min(...ax) - 6, fy0 = Math.min(...ay) - 6;
  const full = [fx0, fy0, Math.max(...ax) + 6 - fx0, Math.max(...ay) + 6 - fy0].map(r2);

  const tl = at([SCREEN.x0, 0, SCREEN.z1]), tr = at([SCREEN.x1, 0, SCREEN.z1]), bl = at([SCREEN.x0, 0, SCREEN.z0]);
  return {
    svg, w: WIDTH, h: HEIGHT, ar: r4(WIDTH / HEIGHT), crop, full,
    screen: { tl: tl.map(r2), tr: tr.map(r2), bl: bl.map(r2), aspect: r4((SCREEN.x1 - SCREEN.x0) / (SCREEN.z1 - SCREEN.z0)) },
  };
}
