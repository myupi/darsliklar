// ─────────────────────────────────────────────────────────────────────────────
// ОБЛИК «KODI PLAYGROUND» (тестовый урок 17, 30.10.2026) — по стилистике образца
// заказчика (kodi-html-code.zip): тёплый белый фон, мягкие карточки с «нажимной»
// тенью, Nunito, палитра коралл / голубой / жёлтый / мятный / розовый, плюшевые
// персонажи, у которых мех — тысячи коротких векторных штрихов, глаза-эллипсы с
// бликами. Персонаж урока свой (голова — head, тело — body), нарисован по тем же
// приёмам.
//   · Sheet — без бумаги: тёплый фон экрана, вещи стоят прямо на нём;
//   · PaperMan — плюшевый человечек: жёлтая голова-«кастрюлька» с крышкой (head),
//     под крышкой — розовая капсула с названием (title), мятное тело (body), мятные
//     ручки с белыми варежками и ножки. Части и метки — те же, что ждут экраны;
//   · градиенты — один раз на страницу (P17Defs в листе).
// ─────────────────────────────────────────────────────────────────────────────
let _p17Scr = 0;   // номер экрана — ставит StageB при отрисовке (см. build.mjs)
// Экран 8 (body), строка на листе после показа: коротко, полную фразу Коди говорит голосом.
const P17_S9_DONE = L3('Oynadagi hamma narsa body ichida turadi.', 'Всё, что видно в окне, живёт внутри body.', 'Everything in the window lives inside body.');
const p17Tone = () => ({});

// МЕХ — короткие кривые внутри скруглённого прямоугольника (и по его неровному краю).
// Тот же приём, что в образце; результат кэшируется.
const _p17Fur = new Map();
function p17Rand(seed) {
  let v = seed >>> 0;
  return () => { v = (Math.imul(1664525, v) + 1013904223) >>> 0; return v / 4294967296; };
}
function p17Fur(x, y, w, h, r, seed, colors, count) {
  const key = [x, y, w, h, r, seed, count, colors.join()].join(':');
  if (_p17Fur.has(key)) return _p17Fur.get(key);
  const rand = p17Rand(seed);
  const layers = ['', '', ''];
  for (let n = 0; n < count; n += 1) {
    const px = x + rand() * w, py = y + rand() * h;
    const qx = Math.abs(px - x - w / 2) - (w / 2 - r), qy = Math.abs(py - y - h / 2) - (h / 2 - r);
    const dist = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
    if (dist > 1.4) continue;
    const a = Math.atan2((py - y - h * 0.35) / h, (px - x - w / 2) / w) + (rand() - 0.5) * 1.5;
    const len = 1.5 + rand() * 4.4;
    const dx = Math.cos(a) * len, dy = Math.sin(a) * len;
    layers[n % 3] += 'M' + px.toFixed(1) + ' ' + py.toFixed(1) + 'q' + (dx * 0.7 + 0.8).toFixed(1) + ' ' + (dy * 0.4 - 0.6).toFixed(1) + ' ' + dx.toFixed(1) + ' ' + dy.toFixed(1);
  }
  const out = layers.map((d, i) => ({ d, c: colors[i], w: i === 2 ? 0.7 : 0.85, o: i === 2 ? 0.65 : 0.43 }));
  _p17Fur.set(key, out);
  return out;
}
const P17FurPaths = ({ fur }) => fur.map((f, i) => <path key={i} d={f.d} fill="none" stroke={f.c} strokeWidth={f.w} strokeLinecap="round" opacity={f.o} />);
const P17_YEL = ['#ffe991', '#e8ad22', '#fff1b1'];

function P17Defs() {
  return (
    <svg className="p17-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="p17gEye" cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#fff" /><stop offset=".7" stopColor="#f8fbff" /><stop offset="1" stopColor="#b7c8d7" /></radialGradient>
        <radialGradient id="p17gPupil" cx="25%" cy="20%"><stop offset="0" stopColor="#424353" /><stop offset=".45" stopColor="#141926" /><stop offset="1" stopColor="#070c16" /></radialGradient>
        <radialGradient id="p17gYellow" cx="30%" cy="18%" r="85%"><stop offset="0" stopColor="#ffeb91" /><stop offset=".5" stopColor="#ffd257" /><stop offset=".85" stopColor="#edb334" /><stop offset="1" stopColor="#dca02b" /></radialGradient>
        <radialGradient id="p17gMint" cx="30%" cy="15%" r="100%"><stop offset="0" stopColor="#d5ffe8" /><stop offset=".32" stopColor="#91e4bf" /><stop offset=".7" stopColor="#58ba97" /><stop offset="1" stopColor="#338c78" /></radialGradient>
        <linearGradient id="p17gLimb" x2="1" y2=".3"><stop offset="0" stopColor="#95e9c3" /><stop offset=".6" stopColor="#58ba97" /><stop offset="1" stopColor="#3b947d" /></linearGradient>
        <radialGradient id="p17gMitten" cx="30%" cy="25%"><stop offset="0" stopColor="#fffef7" /><stop offset=".6" stopColor="#f5f1e5" /><stop offset="1" stopColor="#c8d3c9" /></radialGradient>
        <linearGradient id="p17gPink" x2=".3" y2="1"><stop offset="0" stopColor="#ffd2e9" /><stop offset=".4" stopColor="#f7a3cb" /><stop offset="1" stopColor="#d95996" /></linearGradient>
        <linearGradient id="p17gInside" x2="0" y2="1"><stop offset="0" stopColor="#b47422" /><stop offset="1" stopColor="#e5a83d" /></linearGradient>
      </defs>
    </svg>
  );
}

function Sheet({ children, cls }) {
  return (
    <div className={'kz-sheet p17-sheet' + (cls ? ' ' + cls : '')}>
      <P17Defs />
      <div className="kz-sheet-body">{children}</div>
    </div>
  );
}

// ── ПЛЮШЕВЫЙ ЧЕЛОВЕЧЕК ───────────────────────────────────────────────────────
// Рисунок — в поле 390 × 465; каждая часть — своя вырезка с SVG, у которой viewBox —
// её же кусок этого поля, поэтому части сходятся точно. Порядок частей (экран 1
// летит в них кусками страницы, экраны 6 и 8 ищут [aria-label]): ноги, руки, тело,
// капсула с названием, голова.
const P17_W = 390, P17_H = 465;
const p17Box = (x0, y0, x1, y1) => ({
  x: (x0 / P17_W) * 100, y: (y0 / P17_H) * 100, w: ((x1 - x0) / P17_W) * 100, h: ((y1 - y0) / P17_H) * 100,
  vb: x0 + ' ' + y0 + ' ' + (x1 - x0) + ' ' + (y1 - y0)
});
const P17B = {
  legL: p17Box(100, 365, 185, 450), legR: p17Box(200, 365, 285, 450),
  armL: p17Box(25, 228, 130, 336), armR: p17Box(260, 228, 365, 336),
  body: p17Box(100, 250, 280, 400), title: p17Box(70, -40, 320, 130), head: p17Box(66, 0, 309, 292)
};
const P17Art = ({ b, children }) => (
  <svg className="p17-art" viewBox={b.vb} preserveAspectRatio="none" aria-hidden="true">{children}</svg>
);
const P17Eyes = () => (
  <g className="p17-eyes" transform="translate(185 207) scale(1.13)">
    <g className="p17-blink">
      <ellipse cx="-20" cy="0" rx="19" ry="25" fill="url(#p17gEye)" stroke="#fff" strokeWidth="1.5" />
      <ellipse cx="20" cy="0" rx="19" ry="25" fill="url(#p17gEye)" stroke="#fff" strokeWidth="1.5" />
      <g className="p17-look">
        <ellipse cx="-17" cy="2" rx="11.5" ry="17" fill="url(#p17gPupil)" /><ellipse cx="23" cy="2" rx="11.5" ry="17" fill="url(#p17gPupil)" />
        <ellipse cx="-20" cy="-5" rx="4.8" ry="6.2" fill="#fff" /><ellipse cx="20" cy="-5" rx="4.8" ry="6.2" fill="#fff" />
        <circle cx="-12" cy="9" r="2" fill="#b1d4ed" opacity=".7" /><circle cx="28" cy="9" r="2" fill="#b1d4ed" opacity=".7" />
      </g>
    </g>
  </g>
);
// Розовая капсула с надписью — под крышкой головы (название страницы).
function P17Capsule({ text }) {
  const t = String(text || '');
  const fs = t.length > 9 ? 17 : t.length > 6 ? 21 : 26;
  return (
    <g className="p17-capsule" transform="rotate(-8 191 133)">
      <rect x="139" y="88" width="103" height="77" rx="28" fill="url(#p17gPink)" stroke="#e981b3" strokeWidth="1.5" />
      <path d="M157 101q29-9 59-2" fill="none" stroke="#ffe2ee" strokeWidth="5" strokeLinecap="round" opacity=".8" />
      <text x="190.5" y="128" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize={fs} fontWeight="900" fill="#74284c"
        textLength={t.length > 9 ? 92 : undefined} lengthAdjust="spacingAndGlyphs">{t}</text>
    </g>
  );
}
function P17Head({ open, name }) {
  const head = p17Fur(83, 137, 207, 145, 68, 83, P17_YEL, 3100);
  const cap = p17Fur(87, 59, 200, 64, 31, 56, ['#ffe991', '#edbc36', '#fff1b1'], 1600);
  return (
    <P17Art b={P17B.head}>
      {/* Обод и тёмное «нутро» — только у открытой головы: у закрытой их не видно. */}
      {open ? <ellipse cx="186" cy="152" rx="101" ry="44" fill="url(#p17gYellow)" /> : null}
      {open ? <ellipse cx="187" cy="147" rx="88" ry="32" fill="url(#p17gInside)" /> : null}
      {open && name ? <P17Capsule text={name} /> : null}
      <g className={'p17-lid' + (open ? ' is-open' : '')}>
        <g transform="rotate(-18 185 92)">
          <rect x="87" y="59" width="200" height="64" rx="31" fill="url(#p17gYellow)" />
          <P17FurPaths fur={cap} />
          <path d="M106 105q82-12 164 0" stroke="#bc8430" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".5" />
        </g>
      </g>
      <rect x="83" y="137" width="207" height="145" rx="68" fill="url(#p17gYellow)" />
      <P17FurPaths fur={head} />
      <path d="M118 164q16-12 32-6m66 0q16-6 30 7" fill="none" stroke="#d89d28" strokeWidth="6" strokeLinecap="round" />
      <P17Eyes />
      <ellipse cx="119" cy="236" rx="13" ry="7" fill="#f9b878" opacity=".55" /><ellipse cx="254" cy="236" rx="13" ry="7" fill="#f9b878" opacity=".55" />
      <g className="p17-mouth"><path d="M173 241q14 9 27-2q0 22-14 22q-12-1-13-20" fill="#634120" /><path d="M180 257q6-9 13-1q-6 5-13 1" fill="#f0947a" /></g>
    </P17Art>
  );
}
function P17Body({ bits }) {
  return (
    <P17Art b={P17B.body}>
      <path d="M117 263q70-18 143 0q17 55 5 108q-7 23-30 23h-91q-29 0-34-26q-9-52 7-105Z" fill="url(#p17gMint)" stroke="#67bda2" strokeWidth="1.5" />
      <path d="M124 284q11-9 26-8" fill="none" stroke="#e3fff0" strokeWidth="9" strokeLinecap="round" opacity=".65" />
      <path d="M251 292q10 43 2 65" fill="none" stroke="#d1ffe5" strokeWidth="3" strokeLinecap="round" opacity=".35" />
      {bits ? (
        <g className="p17-bits">
          {/* Нашивки: строки текста, картинка, кнопка — то, что видно на странице. */}
          <rect x="132" y="300" width="56" height="9" rx="4.5" fill="#fff" opacity=".95" />
          <rect x="132" y="316" width="44" height="7" rx="3.5" fill="#fff" opacity=".85" />
          <rect x="132" y="330" width="34" height="7" rx="3.5" fill="#fff" opacity=".85" />
          <rect x="198" y="296" width="52" height="40" rx="9" fill="#e8f6f7" stroke="#fff" strokeWidth="2.5" />
          <path d="M200 334q12-16 26-6q10-10 22 0v4q0 2-2 2h-44Z" fill="#83d2ab" />
          <circle cx="238" cy="306" r="5" fill="#ffdb70" />
          <rect x="198" y="348" width="52" height="15" rx="7.5" fill="#ff6957" />
        </g>
      ) : null}
    </P17Art>
  );
}
function P17Arm({ r }) {
  return (
    <P17Art b={r ? P17B.armR : P17B.armL}>
      {r ? (
        <>
          <path d="M263 313q36-4 48-36" stroke="url(#p17gLimb)" strokeWidth="31" strokeLinecap="round" fill="none" />
          <g transform="rotate(28 315 271)"><ellipse cx="315" cy="271" rx="21" ry="28" fill="url(#p17gMitten)" /><ellipse cx="300" cy="273" rx="10" ry="15" fill="url(#p17gMitten)" /></g>
        </>
      ) : (
        <>
          <path d="M112 313q-39-1-50-35" stroke="url(#p17gLimb)" strokeWidth="31" strokeLinecap="round" fill="none" />
          <g transform="rotate(-28 58 271)"><ellipse cx="58" cy="271" rx="21" ry="28" fill="url(#p17gMitten)" /><ellipse cx="74" cy="273" rx="10" ry="15" fill="url(#p17gMitten)" /></g>
        </>
      )}
    </P17Art>
  );
}
function P17Leg({ r }) {
  return (
    <P17Art b={r ? P17B.legR : P17B.legL}>
      {r ? (
        <>
          <path d="M236 377v37" stroke="url(#p17gLimb)" strokeWidth="45" strokeLinecap="round" />
          <path d="M219 409q18-16 43 0l11 18q2 13-15 14h-39q-18-1-16-13Z" fill="url(#p17gMint)" />
        </>
      ) : (
        <>
          <path d="M144 377v37" stroke="url(#p17gLimb)" strokeWidth="45" strokeLinecap="round" />
          <path d="M115 409q18-16 45 0l10 18q2 13-15 14h-39q-18-1-16-13Z" fill="url(#p17gMint)" />
        </>
      )}
    </P17Art>
  );
}

function PaperMan({ build = 7, out, headOpen, hl, spot, bits, nameIn, onHead, onBody, onTitle, titleText, titleGone, anim = true, wave }) {
  const has = (k) => MAN_PARTS.indexOf(k) < build;
  const A = (a, d) => (out ? { anim: 'out', dl: d * 0.07 } : anim ? { anim: a, dl: d } : {});
  const NONE = 'transparent';
  const at = (b) => ({ x: b.x, y: b.y, w: b.w, h: b.h });
  const showTitle = titleText && !titleGone;
  return (
    <div className={'kz-man p17-man' + (spot && hl ? ' is-spot' : '')}>
      {has('legL') ? <Cut c={NONE} cls="p17-part p17-leg" seed={41} {...at(P17B.legL)} {...A('rise', 0.1)}><P17Leg /></Cut> : null}
      {has('legR') ? <Cut c={NONE} cls="p17-part p17-leg is-r" seed={42} {...at(P17B.legR)} {...A('rise', 0.2)}><P17Leg r /></Cut> : null}
      {has('armL') ? <Cut c={NONE} cls={'p17-part p17-arm' + (wave ? ' kz-wave-l' : '')} seed={43} {...at(P17B.armL)} {...A('left', 0)}><P17Arm /></Cut> : null}
      {has('armR') ? <Cut c={NONE} cls={'p17-part p17-arm is-r' + (wave ? ' kz-wave-r' : '')} seed={44} {...at(P17B.armR)} {...A('right', 0.08)}><P17Arm r /></Cut> : null}
      {has('body') ? (
        <Cut c={NONE} cls="p17-part p17-body" seed={45} {...at(P17B.body)} {...A('drop', 0)} hl={hl === 'body'} hlc="#58ba97"
          onClick={onBody} label="body"><P17Body bits={bits} /></Cut>
      ) : null}
      {showTitle ? (
        // Капсула с названием (экран 6): торчит из открытой головы; её можно нажать — она летит на вкладку.
        <Cut c={NONE} cls="p17-part kz-man-title p17-title" seed={46} {...at(P17B.title)} anim="pop" onClick={onTitle} label="title">
          <P17Art b={P17B.title}>
            {/* Над открытой головой — вдвое крупнее, чтобы капсулу было видно и легко нажать. */}
            <g transform="translate(195 50) scale(1.85) translate(-190.5 -126.5)"><P17Capsule text={titleText} /></g>
          </P17Art>
        </Cut>
      ) : null}
      {has('head') ? (
        <Cut c={NONE} cls="p17-part p17-head" seed={47} {...at(P17B.head)} {...A('drop', 0.18)} hl={hl === 'head'} hlc="#f0b52a"
          onClick={onHead} label="head">
          <P17Head open={!!headOpen || !!nameIn || !!showTitle} name={nameIn} />
        </Cut>
      ) : null}
    </div>
  );
}

// Экран 1, браузер → человечек: куда летят куски браузера — настоящие контуры частей
// (доли от вырезки части в поле 390 × 465), а не их прямоугольники с запасом под крышку и мех.
const P17_MORPH = {
  head: [17 / 243, 137 / 292, 207 / 243, 145 / 292], body: [8 / 180, 8 / 150, 164 / 180, 136 / 150],
  armL: [9 / 105, 15 / 108, 52 / 105, 56 / 108], armR: [31 / 105, 15 / 108, 52 / 105, 56 / 108], leg: [2 / 85, 0, 72 / 85, 76 / 85]
};
function p17MorphBox(el, b) {
  const c = el.classList;
  const f = c.contains('p17-head') ? P17_MORPH.head : c.contains('p17-body') ? P17_MORPH.body
    : c.contains('p17-arm') ? (c.contains('is-r') ? P17_MORPH.armR : P17_MORPH.armL) : c.contains('p17-leg') ? P17_MORPH.leg : null;
  if (!f) return b;
  return { x: b.x + b.w * f[0], y: b.y + b.h * f[1], w: b.w * f[2], h: b.h * f[3], r: 0 };
}
// Вкладка с названием влетает розовой капсулой — туда, где капсула покажется под крышкой головы.
function p17NameBox(headEl, o) {
  const x = o.x + headEl.offsetLeft, y = o.y + headEl.offsetTop, w = headEl.offsetWidth, h = headEl.offsetHeight;
  return { x: x + (w * (139 - 66)) / 243, y: y + (h * 88) / 292, w: (w * 103) / 243, h: (h * 77) / 292, r: -8 };
}

// Полёт капсулы с названием на вкладку (экран 6): подскок, дуга, по пути уменьшается до размера
// вкладки и тает, только когда прилетела (было: прямо, ступеньками stop-motion, тут же гасла).
function kzFly(el, to, ms) {
  if (!el || !to) return false;
  const d = ms || 780;
  const a = el.getBoundingClientRect(), b = to.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const k = Math.max(0.25, Math.min(b.width / a.width, b.height / a.height, 1.2));
  const lift = Math.min(90, Math.abs(dy) * 0.35 + 40);
  const T = (x, y) => x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
  el.style.zIndex = '60';
  el.style.animation = 'none';
  el.animate([
    { translate: T(0, 0), scale: '1', opacity: 1 },
    { translate: T(0, -14), scale: '1.15', opacity: 1, offset: 0.18 },
    { translate: T(dx * 0.5, dy * 0.5 - lift), scale: String(((1 + k) / 2).toFixed(3)), opacity: 1, offset: 0.55 },
    { translate: T(dx, dy), scale: String(k.toFixed(3)), opacity: 1, offset: 0.9 },
    { translate: T(dx, dy), scale: String((k * 0.9).toFixed(3)), opacity: 0 }
  ], { duration: d, easing: 'cubic-bezier(.45, 0, .35, 1)', fill: 'forwards' });
  return true;
}
