// Робот Bob — объёмная модель для тестового урока «Структура документа: робот Bob»
// (навык anatomy). Робот показывает три слоя любого сайта:
//   детали (HTML)  — сама модель: серые солиды, как чертёж (вид anatomy по умолчанию);
//   вид (CSS)      — раскраска: класс rb-css на корне фигуры красит группы data-paint;
//   движение (JS)  — анимация: класс rb-js — машет правой рукой, моргает, мигает антенна,
//                    на экране мигает курсор.
// Без класса rb-html (слой «детали» выключен) робот исчезает — остаётся подставка.
//
// Разметка для урока (как в модели документа):
//   data-t      текст, который урок подставляет (экран: scr1, scr2; табличка: plate);
//   data-hit    нажимаемая часть (screen); data-sel — подсветка;
//   data-paint  цвет слоя «вид»; rb-arm-r, rb-eye, rb-ant, rb-caret — анимации слоя «движение».

import * as k from '../anatomy/kit/iso-kit.mjs';

const r4 = (v) => Math.round(v * 10000) / 10000;
const f1 = (v) => Math.round(v * 10) / 10;

// bust — крупный план: камера ближе, в кадре корпус с экраном и голова
// (ноги и подставка уходят за край). Нужен там, где читают экран Bob.
export function robotModel({ bust = false } = {}) {
  const WIDTH = 420, HEIGHT = bust ? 340 : 470;
  const AZ = 56, EL = 30;

  const PLINTH = { x: -62, y: -46, w: 124, d: 92, r: 9 };
  const TORSO = { x: -30, y: -18, w: 60, d: 36, r: 6 };
  const HEAD = { x: -25, y: -17, w: 50, d: 34, r: 8 };
  const Z = { base0: -12, base1: 0, foot1: 8, leg1: 44, hip1: 52, torso1: 112, neck1: 118, head1: 152, ant1: 166, ball1: 173 };

  const P = k.fitProjection([
    ...(bust ? [] : k.boxCorners(PLINTH, Z.base0, Z.base1)),
    ...k.boxCorners({ x: -50, y: -20, w: 100, d: 40 }, bust ? 50 : 40, Z.torso1),
    ...k.boxCorners(HEAD, Z.neck1, Z.head1),
    [0, -2, Z.ball1 + 4], [62, 0, 130]
  ], WIDTH, HEIGHT, { pad: bust ? 10 : 14, azimuth: AZ, elevation: EL });

  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const slab = (plan, z, h, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
  const cyl = (cx, cy, r, z, h, steps = 28) => k.cylinder(cx, cy, r, z, h, P, steps);
  const paint = (name, svg, extra = '') => `<g data-paint="${name}"${extra}>${svg}</g>`;
  // Текст на передней грани (y = const, смотрит на зрителя), по центру (x, z).
  const faceText = (x, y, z, text, size, { key, cls, anchor = 'middle', fit } = {}) =>
    k.faceTextSvg(k.sideMatrix([x, y], z, P, 'left'), text, { size, tone: 'hi', anchor })
      .replace('<text ', `<text dy="${(size * 0.34).toFixed(2)}"${key ? ` data-t="${key}"` : ''}${fit ? ` data-fit="${fit}"` : ''}${cls ? ` data-cls="${cls}"` : ''} `);
  const origin = (p) => { const [x, y] = at(p); return `transform-origin:${f1(x)}px ${f1(y)}px`; };

  const out = [];

  const base = [];
  // ── Подставка с табличкой «ROBOT BOB» ────────────────────────────────
  base.push(`<path class="iso-halo" d="${k.haloOf(PLINTH, Z.base0, 12, P)}"/>`);
  base.push(paint('base', S(slab(PLINTH, Z.base0, 12, 8, 1.4), { tone: 'lo', inner: L(k.sideSeam(PLINTH, Z.base0 + 5, P, 8), { tone: 'faint' }) })));
  base.push(paint('base2', S(slab(k.insetPlan(PLINTH, 8), Z.base1, 3, 6, 0.6), { tone: 'mid' })));
  base.push(k.dotsSvg(k.corners(PLINTH, 7).map(([x, y]) => at([x, y, Z.base1])), { size: 0.9, tone: 'mid' }));
  const plate = { x: -30, y: PLINTH.y + PLINTH.d, w: 60, d: 1, r: 0.6 };
  base.push(`<g data-sel="plate">${paint('plate', S(slab(plate, Z.base0 + 2.5, 7.5, 2, 0.3), { tone: 'hi', crease: 'none' }))}</g>`);
  base.push(faceText(0, plate.y + plate.d, Z.base0 + 6.2, 'ROBOT BOB', 4.6, { key: 'plate', cls: 'plate', fit: 52 }));

  // ── Ноги: ступни, голени, колени ───────────────────────────────────────
  const leg = (cx) => {
    const g = [];
    g.push(paint('limb', S(slab({ x: cx - 11, y: -14, w: 22, d: 32, r: 5 }, Z.base1 + 3, Z.foot1 - 3, 5, 0.8), { tone: 'mid' })));
    g.push(paint('limb2', S(cyl(cx, 0, 5.5, Z.foot1, Z.leg1 - Z.foot1), { tone: 'mid' })));
    g.push(paint('frame', S(cyl(cx, 0, 7.6, 24, 6), { tone: 'hi' })));
    return g.join('');
  };
  out.push(leg(-15));
  out.push(leg(15));
  out.push(paint('limb', S(slab({ x: -26, y: -13, w: 52, d: 26, r: 6 }, Z.leg1, Z.hip1 - Z.leg1, 5, 0.8), { tone: 'mid' })));

  // ── Рука (лево — дальняя, право — ближняя; правая машет) ───────────────
  const arm = (side) => {
    const x0 = side < 0 ? -42 : 32;
    const g = [];
    g.push(paint('frame', S(cyl(x0 + 5, 0, 6.2, 100, 8), { tone: 'hi' })));                       // плечо
    g.push(paint('limb', S(slab({ x: x0, y: -6, w: 10, d: 12, r: 3 }, 72, 28, 4, 0.5), { tone: 'mid' })));  // рука
    g.push(paint('frame', S(cyl(x0 + 5, 0, 5.4, 70, 4), { tone: 'hi' })));                        // локоть-манжета
    g.push(paint('hand', S(slab({ x: x0 - 1, y: -7, w: 12, d: 14, r: 5 }, 58, 12, 5, 0.8), { tone: 'mid' })));  // варежка
    const cls = side < 0 ? 'rb-arm-l' : 'rb-arm-r';
    return `<g class="${cls}" style="${origin([x0 + 5, 0, 104])}">${g.join('')}</g>`;
  };
  out.push(arm(-1));

  // ── Корпус: свитер, швы, вентиляция, экран с игрой, кнопки ─────────────
  const torso = [];
  torso.push(paint('shell', S(slab(TORSO, Z.hip1, Z.torso1 - Z.hip1, 6, 1.4), { tone: 'mid', inner: L(k.sideSeam(TORSO, Z.hip1 + 8, P, 6), { tone: 'faint' }) })));
  // вентиляция на правой грани
  for (let i = 0; i < 4; i += 1) {
    const zz = 90 + i * 4;
    torso.push(L(k.segment([TORSO.x + TORSO.w, -9, zz], [TORSO.x + TORSO.w, 9, zz], P), { tone: 'lo' }));
  }
  out.push(torso.join(''));
  // рамка экрана (выступает вперёд) и сам экран — нажимаемая часть
  const frame = { x: -25, y: TORSO.y + TORSO.d, w: 50, d: 2.2, r: 2.4 };
  const scr = { x: -21.5, y: frame.y + frame.d, w: 43, d: 0.8, r: 1.6 };
  const screen = [];
  screen.push(paint('frame', S(slab(frame, 66, 40, 3, 0.4), { tone: 'hi' })));
  screen.push(`<g class="rb-screen">${paint('screen', S(slab(scr, 69.5, 33, 3, 0.2), { tone: 'mid', crease: 'none' }))}</g>`);
  const fy = scr.y + scr.d;
  screen.push(faceText(0, fy, 96, '', 5.2, { key: 'scr1', cls: 'scr1', fit: 38 }));
  screen.push(faceText(0, fy, 86.5, '', 3.8, { key: 'scr2', cls: 'scr2', fit: 38 }));
  // «кнопки ответов» игры на экране и мигающий курсор
  screen.push(`<g class="rb-ans">${paint('ans1', S(slab({ x: -17, y: fy, w: 15, d: 0.4, r: 1 }, 73, 6, 2, 0), { tone: 'lo', crease: 'none' }))}${paint('ans2', S(slab({ x: 2, y: fy, w: 15, d: 0.4, r: 1 }, 73, 6, 2, 0), { tone: 'lo', crease: 'none' }))}</g>`);
  screen.push(faceText(-9.5, fy + 0.4, 76, 'A', 3.4, { cls: 'ans' }));
  screen.push(faceText(9.5, fy + 0.4, 76, 'B', 3.4, { cls: 'ans' }));
  screen.push(`<g class="rb-caret">${L(k.segment([16.5, fy, 84.5], [16.5, fy, 89], P), { tone: 'hi' })}</g>`);
  out.push(`<g data-hit="screen" data-sel="screen">${screen.join('')}</g>`);
  // кнопки под экраном
  [[-14, 'btn1'], [-4, 'btn2'], [6, 'btn3']].forEach(([x, name]) => {
    out.push(paint(name, S(slab({ x, y: TORSO.y + TORSO.d, w: 7, d: 2, r: 1.4 }, 56.5, 5.5, 3, 0.3), { tone: 'hi' })));
  });

  out.push(arm(1));

  // ── Шея, голова: уши, лицо, глаза, рот, антенна ────────────────────────
  out.push(paint('frame', S(cyl(0, 0, 7.5, Z.torso1, Z.neck1 - Z.torso1), { tone: 'hi' })));
  out.push(paint('frame', S(slab({ x: HEAD.x - 3, y: -7, w: 3, d: 14, r: 1.4 }, 126, 14, 3, 0.4), { tone: 'hi' })));   // левое ухо
  out.push(paint('head', S(slab(HEAD, Z.neck1, Z.head1 - Z.neck1, 7, 1.6), { tone: 'mid' })));
  const face = { x: -20, y: HEAD.y + HEAD.d, w: 40, d: 1.6, r: 3.5 };
  out.push(paint('face', S(slab(face, 123, 24, 4, 0.4), { tone: 'hi' })));
  const ey = face.y + face.d;
  [[-12, 'l'], [5, 'r']].forEach(([x, s]) => {
    const e = { x, y: ey, w: 7, d: 1, r: 2.4 };
    out.push(`<g class="rb-eye rb-eye-${s}" style="${origin([x + 3.5, ey, 137])}">${paint('eye', S(slab(e, 133, 8, 4, 0.2), { tone: 'hi', crease: 'none' }))}</g>`);
  });
  out.push(paint('mouth', L(k.segment([-6, ey, 128.5], [6, ey, 128.5], P), { tone: 'hi' })));
  out.push(paint('frame', S(slab({ x: HEAD.x + HEAD.w, y: -7, w: 3, d: 14, r: 1.4 }, 126, 14, 3, 0.4), { tone: 'hi' })));   // правое ухо
  out.push(paint('frame', S(cyl(0, -2, 1.5, Z.head1, Z.ant1 - Z.head1, 16), { tone: 'hi' })));
  out.push(`<g class="rb-ant">${paint('ant', S(cyl(0, -2, 3.4, Z.ant1, Z.ball1 - Z.ant1, 20), { tone: 'hi' }))}</g>`);

  // Всё, кроме подставки, — в группе rb-body: прячется, когда слой «детали» выключен.
  const svg = k.figureSvg({
    width: WIDTH, height: HEIGHT, className: 'fg-robot' + (bust ? ' fg-bust' : ''),
    label: 'Робот Bob на подставке: корпус с экраном, руки, ноги, голова с антенной.',
    body: base.join('') + `<g class="rb-body">${out.join('')}</g>`,
  });
  return { svg, ar: r4(WIDTH / HEIGHT), axes: {}, open: {} };
}
