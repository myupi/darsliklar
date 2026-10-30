// ─────────────────────────────────────────────────────────────────────────────
// ОБЛИК «KODI PLAYGROUND» (тестовый урок 17, 30.10.2026) — по стилистике образца
// заказчика (kodi-html-code.zip): тёплый белый фон, мягкие карточки с «нажимной»
// тенью, Nunito, палитра коралл / голубой / жёлтый / мятный / розовый. Персонаж урока —
// человечек-школьник по образцу заказчика (mascot.html, 30.10.2026; голова — head, тело — body).
//   · Sheet — без бумаги: тёплый фон экрана, вещи стоят прямо на нём;
//   · PaperMan — человечек-школьник по образцу заказчика (mascot.html): голова (head),
//     из которой выпрыгивает капсула с названием (title), синий свитшот (body),
//     руки, брюки и кеды. Части и метки — те же, что ждут экраны;
//   · градиенты капсулы и руки-показа — один раз на страницу (P17Defs в листе).
// ─────────────────────────────────────────────────────────────────────────────
let _p17Scr = 0;   // номер экрана — ставит StageB при отрисовке (см. build.mjs)
// Экран 8 (body), строка на листе после показа: коротко, полную фразу Коди говорит голосом.
const P17_S9_DONE = L3('Oynadagi hamma narsa body ichida turadi.', 'Всё, что видно в окне, живёт внутри body.', 'Everything in the window lives inside body.');
const p17Tone = () => ({});

function P17Defs() {
  return (
    <svg className="p17-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="p17gMitten" cx="30%" cy="25%"><stop offset="0" stopColor="#fffef7" /><stop offset=".6" stopColor="#f5f1e5" /><stop offset="1" stopColor="#c8d3c9" /></radialGradient>
        <linearGradient id="p17gPink" x2=".3" y2="1"><stop offset="0" stopColor="#ffd2e9" /><stop offset=".4" stopColor="#f7a3cb" /><stop offset="1" stopColor="#d95996" /></linearGradient>
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

// ── ЧЕЛОВЕЧЕК-ШКОЛЬНИК (заказчик, 30.10.2026: «вот тут есть человечек — берём его вместо
// нашего», файл mascot.html) ────────────────────────────────────────────────────────────
// Рисунок образца — HTML + CSS в поле 400 × 530 px — перенесён как есть (классы m-… в p17.css).
// Части урока — голова (волосы, уши, лицо), тело (свитшот, шея, брюки сверху), руки, ноги с
// кедами — каждая показывает своё окно этого поля: .p17m — всё поле, сдвинутое на начало части
// и уменьшенное до размера человечка (--k = ширина человечка / 400). Так части сходятся точно
// при любом размере, а экраны находят их по тем же меткам (head, body, title).
// Голова «открывается» — над ней загорается свет с искорками и выпрыгивает капсула с названием
// (волосы-крышку пробовали — заказчик: «максимально кринжово»).
// Машет правой рукой (wave) — поднятая рука образца; иначе обе руки опущены, правая — зеркало левой.
// Поле человечка — 400 × 570: рисунок образца (400 × 530) стоит внизу, сверху запас 40 px —
// под приподнятые волосы и капсулу с названием, чтобы они не наезжали на строку задания.
const P17_W = 400, P17_OY = 40, P17_H = 530 + P17_OY;
const p17Box = (x0, y0, x1, y1) => ({
  x0, y0, x: (x0 / P17_W) * 100, y: ((y0 + P17_OY) / P17_H) * 100, w: ((x1 - x0) / P17_W) * 100, h: ((y1 - y0) / P17_H) * 100,
  vb: x0 + ' ' + y0 + ' ' + (x1 - x0) + ' ' + (y1 - y0)
});
const P17B = {
  legL: p17Box(85, 340, 200, 525), legR: p17Box(205, 340, 310, 525),
  armL: p17Box(95, 195, 165, 395), armR: p17Box(244, 195, 314, 395),
  body: p17Box(130, 160, 280, 385), title: p17Box(80, -95, 330, 95), head: p17Box(95, -65, 300, 200)
};
const P17Art = ({ b, children }) => (
  <svg className="p17-art" viewBox={b.vb} preserveAspectRatio="none" aria-hidden="true">{children}</svg>
);
// Окно поля образца для одной части.
const P17M = ({ b, mood, children }) => (
  <div className="p17m" data-mood={mood} style={{ left: 'calc(var(--k, .5) * ' + -b.x0 + 'px)', top: 'calc(var(--k, .5) * ' + -b.y0 + 'px)' }}>{children}</div>
);
// Розовая капсула с надписью — название страницы (из открытой головы).
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
function P17Head({ open, name, happy }) {
  return (
    <P17M b={P17B.head} mood={happy ? 'happy' : 'hello'}>
      <div className="m-hair-back" /><div className="m-ear m-left" /><div className="m-ear m-right" />
      <div className="m-face">
        <div className="m-brow m-left" /><div className="m-brow m-right" /><div className="m-eye m-left" /><div className="m-eye m-right" />
        <div className="m-nose" /><div className="m-mouth" />
      </div>
      {/* Голова «открыта» — над ней свет и искорки, название выпрыгивает из головы (волосы на месте). */}
      {open ? <><div className="m-glow" /><i className="m-spark m-s1">✦</i><i className="m-spark m-s2">✦</i></> : null}
      <div className={'p17-lid' + (open ? ' is-open' : '')}><div className="m-tuft" /><div className="m-hair" /><div className="m-hair-shine" /></div>
      {open && name ? <svg className="m-cap" viewBox="139 88 103 77"><P17Capsule text={name} /></svg> : null}
    </P17M>
  );
}
function P17Body({ bits }) {
  return (
    <P17M b={P17B.body}>
      <div className="m-hips" />
      <div className="m-torso">
        <div className="m-collar" />
        {bits ? (
          // Принт на груди — страница: строки текста, картинка, кнопка (то, что видно в окне).
          <svg className="m-print p17-bits" viewBox="0 0 74 54" aria-hidden="true">
            <rect x="1" y="1" width="72" height="52" rx="10" fill="#f6f6fb" stroke="#e8e9db" strokeWidth="2" />
            <rect x="8" y="9" width="24" height="5" rx="2.5" fill="#c3cbd8" /><rect x="8" y="18" width="19" height="5" rx="2.5" fill="#c3cbd8" />
            <rect x="8" y="27" width="14" height="5" rx="2.5" fill="#c3cbd8" />
            <rect x="40" y="8" width="26" height="22" rx="4" fill="#e3f4f5" /><path d="M40 27q7-8 13-4q6-5 13 0v3H40Z" fill="#83d2ab" />
            <circle cx="60" cy="14" r="3.2" fill="#ffd257" /><rect x="10" y="38" width="54" height="8" rx="4" fill="#ff6957" />
          </svg>
        ) : <div className="m-badge" />}
        <div className="m-seam" /><div className="m-hem" />
      </div>
      <div className="m-neck" />
    </P17M>
  );
}
const P17HandL = () => <div className="m-hand m-left"><i className="m-finger" /><i className="m-finger" /><i className="m-finger" /><i className="m-finger" /></div>;
function P17Arm({ r, wave }) {
  if (!r) return <P17M b={P17B.armL}><div className="m-sleeve m-left" /><div className="m-cuff m-left" /><P17HandL /></P17M>;
  return (
    <P17M b={P17B.armR}>
      {wave ? (
        <div className="m-wave-arm">
          <div className="m-sleeve m-right" /><div className="m-forearm m-right" /><div className="m-cuff m-right" />
          <div className="m-hand m-right"><i className="m-finger" /><i className="m-finger" /><i className="m-finger" /><i className="m-finger" /><i className="m-thumb" /><i className="m-palm-line" /></div>
        </div>
      ) : <div className="m-mirror"><div className="m-sleeve m-left" /><div className="m-cuff m-left" /><P17HandL /></div>}
    </P17M>
  );
}
function P17Leg({ r }) {
  const side = r ? ' m-right' : ' m-left';
  return <P17M b={r ? P17B.legR : P17B.legL}><div className={'m-sock' + side} /><div className={'m-leg' + side} /><div className={'m-shoe' + side} /></P17M>;
}

function PaperMan({ build = 7, out, headOpen, hl, spot, bits, nameIn, onHead, onBody, onTitle, titleText, titleGone, anim = true, wave }) {
  const has = (k) => MAN_PARTS.indexOf(k) < build;
  const A = (a, d) => (out ? { anim: 'out', dl: d * 0.07 } : anim ? { anim: a, dl: d } : {});
  const NONE = 'transparent';
  const at = (b) => ({ x: b.x, y: b.y, w: b.w, h: b.h });
  const showTitle = titleText && !titleGone;
  // Масштаб поля образца: ширина человечка / 400 (части рисуются в пикселях образца).
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const set = () => { if (el.offsetWidth) el.style.setProperty('--k', String(el.offsetWidth / P17_W)); };
    set();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={'kz-man p17-man' + (spot && hl ? ' is-spot' : '')}>
      {has('legL') ? <Cut c={NONE} cls="p17-part p17-leg" seed={41} {...at(P17B.legL)} {...A('rise', 0.1)}><P17Leg /></Cut> : null}
      {has('legR') ? <Cut c={NONE} cls="p17-part p17-leg is-r" seed={42} {...at(P17B.legR)} {...A('rise', 0.2)}><P17Leg r /></Cut> : null}
      {has('armL') ? <Cut c={NONE} cls="p17-part p17-arm" seed={43} {...at(P17B.armL)} {...A('left', 0)}><P17Arm /></Cut> : null}
      {has('armR') ? <Cut c={NONE} cls="p17-part p17-arm is-r" seed={44} {...at(P17B.armR)} {...A('right', 0.08)}><P17Arm r wave={wave} /></Cut> : null}
      {has('body') ? (
        <Cut c={NONE} cls="p17-part p17-body" seed={45} {...at(P17B.body)} {...A('drop', 0)} hl={hl === 'body'} hlc="#637cd1"
          onClick={onBody} label="body"><P17Body bits={bits} /></Cut>
      ) : null}
      {showTitle ? (
        // Капсула с названием (экран 6): торчит из открытой головы; её можно нажать — она летит на вкладку.
        <Cut c={NONE} cls="p17-part kz-man-title p17-title" seed={46} {...at(P17B.title)} anim="pop" onClick={onTitle} label="title">
          <P17Art b={P17B.title}>
            {/* Над открытой головой — крупно, чтобы капсулу было видно и легко нажать пальцем. */}
            <g transform="translate(205 0) scale(2.3) translate(-190.5 -126.5)"><P17Capsule text={titleText} /></g>
          </P17Art>
        </Cut>
      ) : null}
      {has('head') ? (
        <Cut c={NONE} cls="p17-part p17-head" seed={47} {...at(P17B.head)} {...A('drop', 0.18)} hl={hl === 'head'} hlc="#f0b52a"
          onClick={onHead} label="head">
          <P17Head open={!!headOpen || !!nameIn || !!showTitle} name={nameIn} happy={!!wave} />
        </Cut>
      ) : null}
    </div>
  );
}

// Экран 1, браузер → человечек: куда летят куски браузера — настоящие контуры частей
// (доли от окна части в поле 400 × 530), а не их прямоугольники с запасом под волосы и взмах.
const P17_MORPH = {
  head: [40 / 205, 83 / 265, 143 / 205, 165 / 265], body: [6 / 150, 28 / 225, 137 / 150, 159 / 225],
  armL: [10 / 70, 6 / 200, 52 / 70, 191 / 200], armR: [8 / 70, 6 / 200, 52 / 70, 191 / 200],
  legL: [6 / 115, 14 / 185, 100 / 115, 167 / 185], legR: [5 / 105, 14 / 185, 94 / 105, 167 / 185]
};
function p17MorphBox(el, b) {
  const c = el.classList, r = c.contains('is-r');
  const f = c.contains('p17-head') ? P17_MORPH.head : c.contains('p17-body') ? P17_MORPH.body
    : c.contains('p17-arm') ? (r ? P17_MORPH.armR : P17_MORPH.armL) : c.contains('p17-leg') ? (r ? P17_MORPH.legR : P17_MORPH.legL) : null;
  if (!f) return b;
  return { x: b.x + b.w * f[0], y: b.y + b.h * f[1], w: b.w * f[2], h: b.h * f[3], r: 0 };
}
// Вкладка с названием влетает розовой капсулой — туда, где капсула покажется над открытой головой.
function p17NameBox(headEl, o) {
  const x = o.x + headEl.offsetLeft, y = o.y + headEl.offsetTop, w = headEl.offsetWidth, h = headEl.offsetHeight;
  return { x: x + (w * (154 - 95)) / 205, y: y + (h * (-34 + 65)) / 265, w: (w * 103) / 205, h: (h * 77) / 265, r: -8 };
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
