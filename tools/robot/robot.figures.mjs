// Робот Pixel — объёмная модель для тестового урока «Структура документа: робот Pixel»
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
import * as lt from '../anatomy/kit/lathe.mjs';

const r4 = (v) => Math.round(v * 10000) / 10000;
const f1 = (v) => Math.round(v * 10) / 10;

// bust — крупный план: камера ближе, Pixel в кадре целиком — от ступней с
// табличкой до антенны (заказчик, 17.10.2026: «ноги не видны»), за край
// уходят только боковые края подставки. Нужен там, где читают экран Pixel.
// Взмах правой руки (заказчик, 21.10.2026: «рука странно работает» — рука была
// одной жёсткой палкой и качалась целиком от плеча). Теперь рука как у человека:
// плечо — локоть — предплечье с варежкой. Поза = [плечо, локоть]: плечо — угол от
// «рука висит» наружу и вверх; локоть — насколько предплечье согнуто дальше (0 —
// прямая рука). Взмах: плечо поднимается чуть выше горизонтали, предплечье встаёт
// вверх и машет от локтя туда-сюда, плечо держит. Кадры сменяются ступенькой —
// робот машет чуть «механически», это к месту, но кадров больше, чем раньше.
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const ARM_POSE = (() => {
  const poses = [[0, 0]];
  // подъём: 7 кадров, плечо 0 → 100, локоть 0 → 70 (предплечье встаёт вверх)
  for (let i = 1; i <= 7; i += 1) { const e = ease(i / 7); poses.push([100 * e, 70 * e]); }
  // взмах от локтя: предплечье от 148° до 192° (абсолютно), плечо 100°
  [52, 62, 74, 86, 94, 86, 74, 62].forEach((b) => poses.push([100, b]));
  return poses;
})();
const ARM_SEQ = (() => {
  const seq = [[0, 1500]];
  for (let i = 1; i <= 7; i += 1) seq.push([i, 55]);   // подъём ≈ 0,4 с
  for (let r = 0; r < 3; r += 1) {                       // три взмаха ≈ 0,5 с каждый
    for (let f = 8; f <= 15; f += 1) seq.push([f, 62]);
  }
  seq.push([7, 70]);
  for (let i = 6; i >= 1; i -= 1) seq.push([i, 60]);    // опускание
  return seq;
})();
// CSS кадров: без слоя «движение» виден только кадр 0 (рука опущена).
export function armCss(sel = '.fig-robot') {
  const total = ARM_SEQ.reduce((n, [, ms]) => n + ms, 0);
  const pct = (ms) => +((ms / total) * 100).toFixed(3);
  const out = [`${sel} .rb-af { visibility: hidden; }`, `${sel} .rb-af-0 { visibility: visible; }`];
  ARM_POSE.forEach((_, f) => {
    const kf = [];
    let t = 0, prev = null;
    ARM_SEQ.forEach(([g, ms]) => { const on = g === f; if (on !== prev) kf.push(`${pct(t)}% { visibility: ${on ? 'visible' : 'hidden'}; }`); prev = on; t += ms; });
    kf.push(`100% { visibility: ${prev ? 'visible' : 'hidden'}; }`);
    out.push(`@keyframes rbAf${f} { ${kf.join(' ')} }`);
    out.push(`${sel}.rb-js .rb-af-${f} { animation: rbAf${f} ${total}ms step-end infinite; }`);
  });
  return out.join('\n');
}

export function robotModel({ bust = false } = {}) {
  const WIDTH = 420, HEIGHT = bust ? 430 : 470;
  const AZ = 56, EL = 30;

  const PLINTH = { x: -62, y: -46, w: 124, d: 92, r: 9 };
  const TORSO = { x: -30, y: -18, w: 60, d: 36, r: 6 };
  const HEAD = { x: -25, y: -17, w: 50, d: 34, r: 8 };
  const Z = { base0: -12, base1: 0, foot1: 8, leg1: 44, hip1: 52, torso1: 112, neck1: 118, head1: 152, ant1: 166, ball1: 173 };

  const P = k.fitProjection([
    ...(bust
      ? [...k.boxCorners({ x: -28, y: -16, w: 56, d: 36 }, Z.base0, Z.foot1),           // ступни на подставке
        ...k.boxCorners({ x: -32, y: PLINTH.y + PLINTH.d - 2, w: 64, d: 3 }, Z.base0, Z.base1)]  // табличка
      : k.boxCorners(PLINTH, Z.base0, Z.base1)),
    ...k.boxCorners({ x: -50, y: -20, w: 100, d: 40 }, 40, Z.torso1),
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
  // ── Подставка с табличкой «ROBOT PIXEL» ────────────────────────────────
  base.push(`<path class="iso-halo" d="${k.haloOf(PLINTH, Z.base0, 12, P)}"/>`);
  base.push(paint('base', S(slab(PLINTH, Z.base0, 12, 8, 1.4), { tone: 'lo', inner: L(k.sideSeam(PLINTH, Z.base0 + 5, P, 8), { tone: 'faint' }) })));
  base.push(paint('base2', S(slab(k.insetPlan(PLINTH, 8), Z.base1, 3, 6, 0.6), { tone: 'mid' })));
  base.push(k.dotsSvg(k.corners(PLINTH, 7).map(([x, y]) => at([x, y, Z.base1])), { size: 0.9, tone: 'mid' }));
  const plate = { x: -30, y: PLINTH.y + PLINTH.d, w: 60, d: 1, r: 0.6 };
  base.push(`<g data-sel="plate">${paint('plate', S(slab(plate, Z.base0 + 2.5, 7.5, 2, 0.3), { tone: 'hi', crease: 'none' }))}</g>`);
  base.push(faceText(0, plate.y + plate.d, Z.base0 + 6.2, 'ROBOT PIXEL', 4.6, { key: 'plate', cls: 'plate', fit: 52 }));

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

  // ── Руки (лево — дальняя, право — ближняя; правая машет) ───────────────
  // Рука вращается в объёме, в плоскости груди (x–z) вокруг шарнира-втулки на
  // плече, ось втулки — спереди назад (y). Раньше правая рука поворачивалась
  // CSS-поворотом картинки: в изометрии это не поворот в объёме — рука торчала
  // вбок горизонтально, грани ложились неправильно (заказчик, 17.10.2026:
  // «странно машет»). Теперь каждый кадр взмаха посчитан здесь же, теми же
  // деталями: плечо — призма, манжета — диск, варежка — призма; слой «движение»
  // только переключает кадры (ARM_SEQ, armCss).
  const rrect = (w, d, r, n = 5) => {
    const pts = [];
    [[w / 2 - r, d / 2 - r, 0], [-w / 2 + r, d / 2 - r, 90], [-w / 2 + r, -d / 2 + r, 180], [w / 2 - r, -d / 2 + r, 270]].forEach(([cx, cy, a0]) => {
      for (let i = 0; i <= n; i += 1) { const a = ((a0 + (90 * i) / n) * Math.PI) / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    });
    return pts;
  };
  const V = lt.viewOf(P);
  const SHOULDER_Z = 104;
  const UPPER = 21;   // плечо: от втулки до локтя
  // Плоскость взмаха чуть развёрнута назад (−y): при этом ракурсе рука уходит вбок
  // и видна целиком; развёрнутая вперёд, она шла на зрителя и укорачивалась.
  const PHI = (-20 * Math.PI) / 180;
  // pose = [плечо, локоть], градусы. Левая (дальняя) рука висит прямо в плоскости x–z.
  const armAt = (x0, pose, side = 1) => {
    const [sDeg, bDeg] = pose;
    const phi = side > 0 ? PHI : 0;
    const u = [side * Math.cos(phi), Math.sin(phi), 0];       // «наружу» в плоскости взмаха
    const n = [-Math.sin(phi) * side, Math.cos(phi), 0];      // нормаль плоскости (ось шарниров)
    const dir = (deg) => { const t = (deg * Math.PI) / 180; return [u[0] * Math.sin(t), u[1] * Math.sin(t), -Math.cos(t)]; };
    const perp = (deg) => { const t = (deg * Math.PI) / 180; return [u[0] * Math.cos(t), u[1] * Math.cos(t), Math.sin(t)]; };
    const o = [x0 + 5, 0, SHOULDER_Z];
    const a1 = dir(sDeg), F1 = lt.frameOf(o, a1, perp(sDeg), n);
    const el = [o[0] + a1[0] * UPPER, o[1] + a1[1] * UPPER, o[2] + a1[2] * UPPER];
    const a2 = dir(sDeg + bDeg), F2 = lt.frameOf(el, a2, perp(sDeg + bDeg), n);
    const at1 = (sm) => [o[0] + a1[0] * sm, o[1] + a1[1] * sm, o[2] + a1[2] * sm];
    const at2 = (sm) => [el[0] + a2[0] * sm, el[1] + a2[1] * sm, el[2] + a2[2] * sm];
    const parts = [
      { at: at1(12), svg: paint('limb', S(lt.prismOf(F1, rrect(10, 12, 3), 4, UPPER + 1, P), { tone: 'mid' })) },          // плечо
      { at: el, d: 0.6, svg: paint('frame', S(lt.disc(0, 11, 4.6, lt.frameAlong([el[0] - n[0] * 5.5, el[1] - n[1] * 5.5, el[2]], n), P), { tone: 'hi' })) },  // локоть
      { at: at2(7), svg: paint('limb', S(lt.prismOf(F2, rrect(9, 11, 3), 0, 12, P), { tone: 'mid' })) },                   // предплечье
      { at: at2(12.5), svg: paint('frame', S(lt.disc(10.5, 14, 5.2, F2, P), { tone: 'hi' })) },                             // манжета
      { at: at2(20), svg: paint('hand', S(lt.prismOf(F2, rrect(12, 14, 5), 14, 26, P), { tone: 'mid' })) }                 // варежка
    ];
    // Дальнее — раньше (по глубине центров); локоть — поверх своего сочленения.
    parts.sort((p, q) => (lt.dot3(p.at, V) + (p.d || 0)) - (lt.dot3(q.at, V) + (q.d || 0)));
    return parts.map((x) => x.svg).join('');
  };
  // Втулка плеча — диск с осью по нормали плоскости руки; рисуется поверх корня руки.
  const hub = (x0, side) => {
    const phi = side > 0 ? PHI : 0;
    const n = [-Math.sin(phi) * side, Math.cos(phi), 0];
    return paint('frame', S(lt.disc(0, 14, 6.6, lt.frameAlong([x0 + 5 - n[0] * 7, -7 * n[1], SHOULDER_Z], n), P), { tone: 'hi' }));
  };
  const arm = (side) => {
    if (side < 0) return `<g class="rb-arm-l">${armAt(-42, [0, 0], -1)}${hub(-42, -1)}</g>`;
    const frames = ARM_POSE.map((pose, i) => `<g class="rb-af rb-af-${i}">${armAt(32, pose, 1)}</g>`).join('');
    return `<g class="rb-arm-r">${frames}${hub(32, 1)}</g>`;
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
    label: 'Робот Pixel на подставке: корпус с экраном, руки, ноги, голова с антенной.',
    body: base.join('') + `<g class="rb-body">${out.join('')}</g>`,
  });
  return { svg, ar: r4(WIDTH / HEIGHT), axes: {}, open: {} };
}
