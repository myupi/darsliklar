// ─────────────────────────────────────────────────────────────────────────────
// ОБЛИК «РЕДАКТОР» (тестовый урок 28, 02.11.2026). Заказчик: «попробуй урок в стиле, который
// предложил: герой экрана — код и его результат; код как в настоящем редакторе; оболочка
// игровая, рабочая область строгая; не по-детски; структура урока не меняется».
// Экраны, механики и тексты — урока 1 курса (tools/problemitas17/build.mjs --gen-only);
// здесь — то, что рисует облик:
//   · Sheet — рабочий стол среды разработки: светлое поле в точечной сетке;
//   · PaperMan — свой герой: подросток-верстальщик в плоской линейной графике (худи цвета
//     body, очки, наушники на шее), без «плюшевости»; части и метки — те же, что ждут экраны;
//     голова «открывается» — над ней появляется вкладка браузера с названием (title);
//   · облачко с названием части — как подсказка инспектора DevTools;
//   · kzFly — полёт вкладки-названия прямой дугой, без пружинки.
// Имена p17* оставлены: их ждут экраны урока 1 (правки сборки урока 1).
// ─────────────────────────────────────────────────────────────────────────────
let _p17Scr = 0;   // номер экрана — ставит StageB при отрисовке
// Экран 8 (body), строка задания после показа: коротко, полную фразу Коди говорит голосом.
const P17_S9_DONE = L3('Oynadagi hamma narsa body ichida turadi.', 'Всё, что видно в окне, живёт внутри body.', 'Everything in the window lives inside body.');
const p17Tone = () => ({});

function Sheet({ children, cls }) {
  return (
    <div className={'kz-sheet p17-sheet r28-desk' + (cls ? ' ' + cls : '')}>
      <div className="kz-sheet-body">{children}</div>
    </div>
  );
}

// ── ГЕРОЙ. Поле 200 × 290 (y от 120, земля y = 400) — как у героини урока 1, поэтому раскладка
// экранов и полёты на экране 1 сходятся. Плоская заливка, ровный тёмный контур 2 px.
const P17_W = 200, P17_Y0 = 120, P17_H = 290;
const p17Box = (x0, y0, x1, y1) => ({
  x0, y0, x: (x0 / P17_W) * 100, y: ((y0 - P17_Y0) / P17_H) * 100, w: ((x1 - x0) / P17_W) * 100, h: ((y1 - y0) / P17_H) * 100,
  vb: x0 + ' ' + y0 + ' ' + (x1 - x0) + ' ' + (y1 - y0)
});
const P17B = {
  legL: p17Box(50, 296, 102, 402), legR: p17Box(98, 296, 152, 402),
  armL: p17Box(46, 244, 90, 334), armR: p17Box(110, 244, 154, 334),
  body: p17Box(62, 232, 138, 318), title: p17Box(36, 84, 164, 180), head: p17Box(56, 140, 144, 252)
};
const P17Art = ({ b, children }) => (
  <svg className="p17-art" viewBox={b.vb} preserveAspectRatio="none" aria-hidden="true">{children}</svg>
);

const R28 = { ink: '#1E293B', sw: 2, skin: '#F1C29E', skinD: '#DFA47D', hair: '#1F2430', hood: '#14A391', hoodD: '#0E8473',
  jeans: '#344157', jeansD: '#28334A', html: '#E44D26' };
const rInk = (w = R28.sw) => ({ stroke: R28.ink, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
// Конечность — толстая линия с контуром: сначала тёмная, сверху цветная.
function RLimb({ d, w, c }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={R28.ink} strokeWidth={w + R28.sw * 2} />
      <path d={d} stroke={c} strokeWidth={w} />
    </g>
  );
}

// Вкладка браузера с названием страницы — так title и выглядит в браузере.
function R28Tab({ x, y, w, h, text, fs }) {
  const t = String(text || '');
  const tw = w - h * 1.05;
  return (
    <g className="r28-tabchip">
      <rect x={x} y={y} width={w} height={h} rx={h * 0.3} fill="#FFFFFF" {...rInk(1.6)} />
      <circle cx={x + h * 0.48} cy={y + h / 2} r={h * 0.17} fill={R28.html} />
      <text x={x + h * 0.82} y={y + h * 0.66} fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif" fontSize={fs} fontWeight="700" fill={R28.ink}
        textLength={t.length * fs * 0.56 > tw ? tw : undefined} lengthAdjust="spacingAndGlyphs">{t}</text>
    </g>
  );
}

function P17Head({ open, name, happy }) {
  return (
    <P17Art b={P17B.head}>
      {open ? (
        // Голова открыта: над ней — короткие штрихи «отсюда» (сведения о странице).
        <g className="r28-open" stroke={R28.ink} strokeWidth="2" strokeLinecap="round">
          <path d="M100 146 v-8 M80 152 l-5 -6 M120 152 l5 -6" />
        </g>
      ) : null}
      {/* уши */}
      <circle cx={70} cy={208} r={7} fill={R28.skin} {...rInk()} />
      <circle cx={130} cy={208} r={7} fill={R28.skin} {...rInk()} />
      {/* лицо */}
      <path d="M72 200 Q72 170 100 168 Q128 170 128 200 Q129 228 114 240 Q100 248 86 240 Q71 228 72 200Z" fill={R28.skin} {...rInk()} />
      <path d="M118 182 Q129 200 125 222 Q121 234 112 240 Q122 212 118 182Z" fill={R28.skinD} opacity=".55" />
      {/* волосы: короткая стрижка с вихром */}
      <path d="M70 200 Q63 162 96 156 Q104 146 112 152 Q134 160 131 198 Q127 182 116 179 Q108 187 99 181 Q90 188 82 181 Q75 188 70 200Z" fill={R28.hair} {...rInk()} />
      {/* очки */}
      <g fill="#FFFFFF" fillOpacity=".35" {...rInk(1.8)}>
        <circle cx={88} cy={206} r={9.5} /><circle cx={112} cy={206} r={9.5} />
      </g>
      <path d="M97.5 205 h5 M78.5 204 L71 201 M121.5 204 L129 201" fill="none" {...rInk(1.8)} />
      {happy
        ? <path d="M83 208 q5 -6 10 0 M107 208 q5 -6 10 0" fill="none" {...rInk(2.2)} />
        : <g fill={R28.ink}><circle cx={88} cy={207} r={2.6} /><circle cx={112} cy={207} r={2.6} /></g>}
      <path d="M80 192 q7 -3 14 -1 M106 191 q7 -2 14 1" fill="none" {...rInk(2.2)} />
      <path d="M100 212 q-3 6 1 7" fill="none" {...rInk(1.6)} />
      {happy
        ? <path d="M91 225 Q100 228 109 225 Q107 235 100 235 Q93 235 91 225Z" fill="#6B2730" {...rInk(1.8)} />
        : <path d="M93 226 q7 5 14 0" fill="none" {...rInk(2)} />}
      {open && name ? <R28Tab x={64} y={116} w={72} h={22} text={name} fs={10.5} /> : null}
    </P17Art>
  );
}

// Худи цвета body: капюшон за шеей, шнурки, карман-кенгуру; на груди — значок </> или, если
// тело «собрано из страницы» (bits), маленькая страница: строки, картинка, кнопка.
const R28_HOODIE = 'M70 252 Q100 242 130 252 Q137 282 133 312 H67 Q63 282 70 252Z';
function P17Body({ bits }) {
  return (
    <P17Art b={P17B.body}>
      <path d="M93 234 h14 v16 h-14z" fill={R28.skin} {...rInk()} />
      <path d="M77 249 Q100 266 123 249 Q119 240 100 240 Q81 240 77 249Z" fill={R28.hoodD} {...rInk()} />
      <path d={R28_HOODIE} fill={R28.hood} {...rInk()} />
      <path d="M68 302 H132 V313 H68Z" fill={R28.hoodD} {...rInk(1.6)} />
      <path d="M78 288 H122 L125 302 H75Z" fill={R28.hoodD} {...rInk(1.6)} />
      <path d="M94 253 v15 M106 253 v15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {bits ? (
        <g className="p17-bits">
          <rect x="84" y="262" width="32" height="23" rx="3" fill="#FFFFFF" {...rInk(1.4)} />
          <rect x="87" y="266" width="11" height="2.4" rx="1.2" fill="#94A3B8" /><rect x="87" y="270" width="8" height="2.4" rx="1.2" fill="#94A3B8" />
          <rect x="101" y="265" width="12" height="9" rx="1.5" fill="#FFEDE5" /><path d="M101 272.5 q3 -3 6 -1.5 q3 -2.4 6 0 v1.5h-12z" fill="#FB923C" />
          <rect x="88" y="278" width="24" height="4" rx="2" fill={R28.html} />
        </g>
      ) : (
        <text x="100" y="279" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fontSize="11" fontWeight="800" fill="#FFFFFF">{'</>'}</text>
      )}
      {/* наушники на шее */}
      <path d="M82 246 Q100 258 118 246" fill="none" stroke={R28.ink} strokeWidth="3" strokeLinecap="round" />
      <rect x="76" y="242" width="9" height="12" rx="3" fill="#334155" {...rInk(1.4)} />
      <rect x="115" y="242" width="9" height="12" rx="3" fill="#334155" {...rInk(1.4)} />
    </P17Art>
  );
}

function P17Arm({ r, wave }) {
  if (!r) {
    return (
      <P17Art b={P17B.armL}>
        <RLimb d="M77 258 L67 284 L64 304" w={17} c={R28.hood} />
        <path d="M58 302 h12 v6 h-12z" fill={R28.hoodD} {...rInk(1.6)} />
        <ellipse cx={64} cy={316} rx={6.5} ry={7.5} fill={R28.skin} {...rInk(1.8)} />
      </P17Art>
    );
  }
  return (
    <P17Art b={P17B.armR}>
      {wave ? (
        <g className="p17k-raise" style={{ transformOrigin: '123px 258px' }}>
          <RLimb d="M123 258 L146 252" w={17} c={R28.hood} />
          <g className="r28-wave" style={{ transformOrigin: '146px 252px' }}>
            <RLimb d="M146 252 L152 230" w={16} c={R28.hood} />
            <ellipse cx={153} cy={221} rx={6.5} ry={8} fill={R28.skin} {...rInk(1.8)} />
          </g>
        </g>
      ) : (
        <g>
          <RLimb d="M123 258 L133 284 L136 304" w={17} c={R28.hood} />
          <path d="M130 302 h12 v6 h-12z" fill={R28.hoodD} {...rInk(1.6)} />
          <ellipse cx={136} cy={316} rx={6.5} ry={7.5} fill={R28.skin} {...rInk(1.8)} />
        </g>
      )}
    </P17Art>
  );
}

// Джинсы и белые кеды с полоской цвета html.
function P17Leg({ r }) {
  const x0 = r ? 111 : 89, x1 = r ? 116 : 84;
  const dir = r ? 1 : -1;
  return (
    <P17Art b={r ? P17B.legR : P17B.legL}>
      <RLimb d={'M' + x0 + ' 304 L' + x1 + ' 376'} w={22} c={R28.jeans} />
      <g transform={'translate(' + (r ? 106 : 94) + ' 398) scale(' + dir + ' 1)'}>
        <path d="M0 -2 Q-2 -19 9 -21 H19 Q25 -15 34 -13 Q44 -11 44 -4 V0 H0Z" fill="#FFFFFF" {...rInk()} />
        <path d="M14 -16 q6 6 14 3" fill="none" stroke={R28.html} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M-2 -4 H46 V2 H-2Z" fill="#E2E8F0" {...rInk(1.6)} />
      </g>
    </P17Art>
  );
}

// Простые слова для облачка на экране 1 (теги head и body там ещё не знакомы).
const P17_PLAIN = { head: L3('Bosh', 'Голова', 'Head'), body: L3('Tana', 'Тело', 'Body') };
function PaperMan({ build = 7, out, headOpen, hl, spot, bits, nameIn, onHead, onBody, onTitle, titleText, titleGone, anim = true, wave, plain }) {
  const pick = usePick();
  const has = (k) => MAN_PARTS.indexOf(k) < build;
  const A = (a, d) => (out ? { anim: 'out', dl: d * 0.07 } : anim ? { anim: a, dl: d } : {});
  const NONE = 'transparent';
  const at = (b) => ({ x: b.x, y: b.y, w: b.w, h: b.h });
  const showTitle = titleText && !titleGone;
  return (
    <div className={'kz-man p17-man r28-man' + (spot && hl ? ' is-spot' : '')}>
      {has('legL') ? <Cut c={NONE} cls="p17-part p17-leg" seed={41} {...at(P17B.legL)} {...A('rise', 0.1)}><P17Leg /></Cut> : null}
      {has('legR') ? <Cut c={NONE} cls="p17-part p17-leg is-r" seed={42} {...at(P17B.legR)} {...A('rise', 0.2)}><P17Leg r /></Cut> : null}
      {has('armL') ? <Cut c={NONE} cls="p17-part p17-arm" seed={43} {...at(P17B.armL)} {...A('left', 0)}><P17Arm /></Cut> : null}
      {has('armR') ? <Cut c={NONE} cls="p17-part p17-arm is-r" seed={44} {...at(P17B.armR)} {...A('right', 0.08)}><P17Arm r wave={wave} /></Cut> : null}
      {has('body') ? (
        <Cut c={NONE} cls="p17-part p17-body" seed={45} {...at(P17B.body)} {...A('drop', 0)} hl={hl === 'body'} hlc={R28.hood}
          onClick={onBody} label="body"><P17Body bits={bits} /></Cut>
      ) : null}
      {showTitle ? (
        // Название (экран 6): крупная вкладка над головой — её нажимают, она летит на вкладку браузера.
        <Cut c={NONE} cls="p17-part kz-man-title p17-title" seed={46} {...at(P17B.title)} anim="pop" onClick={onTitle} label="title">
          <P17Art b={P17B.title}><R28Tab x={44} y={112} w={112} h={34} text={titleText} fs={16} /></P17Art>
        </Cut>
      ) : null}
      {/* Название части — подсказкой, как в инспекторе DevTools: тёмная плашка с тегом; на экране 1
          (plain) теги ещё не знакомы — простое слово. Части не подсвечиваются. */}
      {hl === 'head' || hl === 'body' ? (
        <span key={hl} className={'p17-call r28-tip is-' + hl} aria-hidden="true"
          style={{ left: (hl === 'head' ? 137 : 134) / P17_W * 100 + '%', top: ((hl === 'head' ? 196 : 272) - P17_Y0) / P17_H * 100 + '%' }}>
          {plain ? pick(P17_PLAIN[hl]) : <><i>{'<'}</i><b>{hl}</b><i>{'>'}</i></>}
        </span>
      ) : null}
      {has('head') ? (
        <Cut c={NONE} cls="p17-part p17-head" seed={47} {...at(P17B.head)} {...A('drop', 0.18)} hl={hl === 'head'} hlc="#7C5CFA"
          onClick={onHead} label="head">
          <P17Head open={!!headOpen || !!nameIn || !!showTitle} name={nameIn} happy={!!wave} />
        </Cut>
      ) : null}
    </div>
  );
}

// Экран 1, браузер → герой: куда летят куски браузера — контуры частей (доли от окна части).
const P17_MORPH = {
  head: [6 / 88, 12 / 112, 76 / 88, 94 / 112], body: [1 / 76, 4 / 86, 74 / 76, 78 / 86],
  armL: [7 / 44, 3 / 90, 34 / 44, 78 / 90], armR: [3 / 44, 3 / 90, 34 / 44, 78 / 90],
  legL: [10 / 52, 4 / 106, 40 / 52, 102 / 106], legR: [2 / 54, 4 / 106, 40 / 54, 102 / 106]
};
function p17MorphBox(el, b) {
  const c = el.classList, r = c.contains('is-r');
  const f = c.contains('p17-head') ? P17_MORPH.head : c.contains('p17-body') ? P17_MORPH.body
    : c.contains('p17-arm') ? (r ? P17_MORPH.armR : P17_MORPH.armL) : c.contains('p17-leg') ? (r ? P17_MORPH.legR : P17_MORPH.legL) : null;
  if (!f) return b;
  return { x: b.x + b.w * f[0], y: b.y + b.h * f[1], w: b.w * f[2], h: b.h * f[3], r: 0 };
}
// Вкладка с названием влетает туда, где вкладка покажется над открытой головой.
function p17NameBox(headEl, o) {
  const x = o.x + headEl.offsetLeft, y = o.y + headEl.offsetTop, w = headEl.offsetWidth, h = headEl.offsetHeight;
  return { x: x + (w * (64 - 56)) / 88, y: y + (h * (116 - 140)) / 112, w: (w * 72) / 88, h: (h * 22) / 112, r: 0 };
}

// Полёт вкладки-названия на вкладку браузера (экран 6): ровная дуга, по пути уменьшается
// до размера вкладки и гаснет, когда прилетела.
function kzFly(el, to, ms) {
  if (!el || !to) return false;
  const d = ms || 620;
  const a = el.getBoundingClientRect(), b = to.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const k = Math.max(0.25, Math.min(b.width / a.width, b.height / a.height, 1.2));
  const lift = Math.min(60, Math.abs(dy) * 0.25 + 24);
  const T = (x, y) => x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
  el.style.zIndex = '60';
  el.style.animation = 'none';
  el.animate([
    { translate: T(0, 0), scale: '1', opacity: 1 },
    { translate: T(dx * 0.5, dy * 0.5 - lift), scale: String(((1 + k) / 2).toFixed(3)), opacity: 1, offset: 0.5 },
    { translate: T(dx, dy), scale: String(k.toFixed(3)), opacity: 1, offset: 0.88 },
    { translate: T(dx, dy), scale: String(k.toFixed(3)), opacity: 0 }
  ], { duration: d, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
  return true;
}
