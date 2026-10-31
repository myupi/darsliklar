// ─────────────────────────────────────────────────────────────────────────────
// ОБЛИК «KODI PLAYGROUND» (тестовый урок 17, 30.10.2026) — по стилистике образца
// заказчика (kodi-html-code.zip): тёплый белый фон, мягкие карточки с «нажимной»
// тенью, Nunito, палитра коралл / голубой / жёлтый / мятный / розовый. Персонаж урока —
// своя героиня в манере референсов заказчика (31.10.2026; голова — head, тело — body).
//   · Sheet — без бумаги: тёплый фон экрана, вещи стоят прямо на нём;
//   · PaperMan — своя героиня в манере референсов заказчика (31.10.2026): голова (head), из
//     которой выпрыгивает капсула с названием (title), кофта и мятный комбинезон (body), руки,
//     штанины и кеды. Части и метки — те же, что ждут экраны;
//   · градиенты человечка, капсулы и руки-показа — один раз на страницу (P17Defs в листе).
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
        {/* Градиенты героини: кожа, волосы, кофта, комбинезон; румянец; свет над открытой головой. */}
        <linearGradient id="p17k-skin" x2=".25" y2="1"><stop offset="0" stopColor="#F2C29C" /><stop offset="1" stopColor="#D9976E" /></linearGradient>
        <linearGradient id="p17k-hair" x2=".25" y2="1"><stop offset="0" stopColor="#7A4630" /><stop offset="1" stopColor="#4A2618" /></linearGradient>
        <linearGradient id="p17k-shirt" x2=".25" y2="1"><stop offset="0" stopColor="#FF9F8E" /><stop offset="1" stopColor="#F06F5A" /></linearGradient>
        <linearGradient id="p17k-over" x2=".25" y2="1"><stop offset="0" stopColor="#8EE0C0" /><stop offset="1" stopColor="#4FB08E" /></linearGradient>
        <radialGradient id="p17kCheek"><stop offset="0" stopColor="#FF6F7D" stopOpacity=".55" /><stop offset="1" stopColor="#FF6F7D" stopOpacity="0" /></radialGradient>
        <radialGradient id="p17kGlow"><stop offset="0" stopColor="#FFF6C8" stopOpacity=".95" /><stop offset=".55" stopColor="#FFE496" stopOpacity=".55" /><stop offset="1" stopColor="#FFE496" stopOpacity="0" /></radialGradient>
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

// ── ГЕРОИНЯ УРОКА — СВОЙ ПЕРСОНАЖ В МАНЕРЕ РЕФЕРЕНСОВ (заказчик, 31.10.2026: «придумай своего
// персонажа, не берём оттуда»; манера наборов «по мотивам Michel Verdu»: заливка + тонкий
// тёмно-коричневый контур, мягкая светотень градиентом, большие живые глаза). Девочка-верстальщица:
// два пучка-«шишки» с коралловыми резинками, чёлка, веснушки; кофта в
// коралловую полоску, мятный комбинезон (цвет зоны body) с кармашком </> на нагруднике, жёлтые кеды.
// Нарисована в единицах набора (земля y=400); каждая часть урока — своё окно поля 200 × 290 (y от 120),
// поэтому части сходятся точно, а экраны находят их по меткам.
// Голова «открывается» — над ней свет, искорки и выпрыгивает капсула с названием.
// Машет (wave) — правая рука поднята и машет ладошкой, лицо радуется; иначе руки опущены.
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

// Приёмы манеры референсов: контур, сужающаяся конечность, глаз, рот, кед, кисти.
const P17K = { ink: '#3B2A26', sw: 2.2 };
const kInk = (w = P17K.sw) => ({ stroke: P17K.ink, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const kG = (k) => 'url(#p17k-' + k + ')';
function kLimb(x1, y1, x2, y2, w1, w2 = w1) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L, r1 = w1 / 2, r2 = w2 / 2;
  const f = (p) => p.map((v) => +v.toFixed(1)).join(' ');
  const a = [x1 + nx * r1, y1 + ny * r1], b = [x2 + nx * r2, y2 + ny * r2], c = [x2 - nx * r2, y2 - ny * r2], d = [x1 - nx * r1, y1 - ny * r1];
  return 'M' + f(a) + ' L' + f(b) + ' A' + r2 + ' ' + r2 + ' 0 0 0 ' + f(c) + ' L' + f(d) + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + f(a) + 'Z';
}
// Конечность с изгибом одной формой: общий контур, потом заливка, потом тень.
function KLimb({ p, w, fill, shade }) {
  const segs = p.slice(1).map((q, i) => [p[i], q, w[i], w[i + 1]]);
  return (
    <g>
      {segs.map(([a, b, wa, wb], i) => <path key={'o' + i} d={kLimb(a[0], a[1], b[0], b[1], wa + P17K.sw * 2, wb + P17K.sw * 2)} fill={P17K.ink} />)}
      {segs.map(([a, b, wa, wb], i) => <path key={'f' + i} d={kLimb(a[0], a[1], b[0], b[1], wa, wb)} fill={fill} />)}
      {shade ? <g opacity=".35">{segs.map(([a, b, wa, wb], i) => <path key={'s' + i} d={kLimb(a[0] + wa * 0.2, a[1], b[0] + wb * 0.2, b[1], wa * 0.5, wb * 0.5)} fill={shade} />)}</g> : null}
    </g>
  );
}
// Глаз набора: белок, радужка, зрачок, блики, верхнее веко ровной дугой.
function KEye({ x, y, rx = 9, iris = '#4A2A1A', look = [0, 0], cid }) {
  const ry = rx * 1.18, ir = rx * 0.72, ix = x + look[0] * (rx - ir * 0.7), iy = y + look[1] * (ry - ir * 0.7), id = 'p17ke-' + cid;
  return (
    <g className="p17k-blink">
      <clipPath id={id}><ellipse cx={x} cy={y} rx={rx} ry={ry} /></clipPath>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" />
      <g clipPath={'url(#' + id + ')'}>
        <circle cx={ix} cy={iy} r={ir} fill={iris} />
        <circle cx={ix} cy={iy} r={ir * 0.74} fill="none" stroke="#000" strokeOpacity=".18" strokeWidth={ir * 0.22} />
        <circle cx={ix} cy={iy} r={ir * 0.48} fill="#1B1210" />
        <circle cx={ix - ir * 0.36} cy={iy - ir * 0.4} r={ir * 0.32} fill="#fff" />
        <circle cx={ix + ir * 0.38} cy={iy + ir * 0.36} r={ir * 0.14} fill="#fff" opacity=".85" />
        <ellipse cx={x} cy={y - ry * 0.62} rx={rx} ry={ry * 0.45} fill="#000" opacity=".08" />
      </g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" {...kInk(1.5)} />
      <path d={'M' + (x - rx * 1.04) + ' ' + (y - ry * 0.12) + ' Q' + (x - rx * 0.75) + ' ' + (y - ry * 1.12) + ' ' + x + ' ' + (y - ry * 1.06) + ' Q' + (x + rx * 0.75) + ' ' + (y - ry * 1.12) + ' ' + (x + rx * 1.04) + ' ' + (y - ry * 0.12)} fill="none" {...kInk(P17K.sw * 1.45)} />
    </g>
  );
}
// Радостный глаз — дуга «^».
const KJoy = ({ x, y, rx = 9 }) => <path d={'M' + (x - rx) + ' ' + (y + 3) + ' Q' + x + ' ' + (y - rx * 1.2) + ' ' + (x + rx) + ' ' + (y + 3)} fill="none" {...kInk(P17K.sw * 1.6)} />;
// Открытая улыбка с зубами и языком (grin набора).
function KGrin({ x, y, w = 16 }) {
  const h = w * 0.55;
  return (
    <g>
      <path d={'M' + (x - w / 2) + ' ' + y + ' Q' + x + ' ' + (y + 3) + ' ' + (x + w / 2) + ' ' + y + ' Q' + (x + w * 0.3) + ' ' + (y + h) + ' ' + x + ' ' + (y + h) + ' Q' + (x - w * 0.3) + ' ' + (y + h) + ' ' + (x - w / 2) + ' ' + y + 'Z'} fill="#5A1E22" {...kInk()} />
      <path d={'M' + (x - w * 0.36) + ' ' + (y + 1.6) + ' Q' + x + ' ' + (y + 4) + ' ' + (x + w * 0.36) + ' ' + (y + 1.6) + ' L' + (x + w * 0.3) + ' ' + (y + h * 0.32) + ' Q' + x + ' ' + (y + h * 0.4) + ' ' + (x - w * 0.3) + ' ' + (y + h * 0.32) + 'Z'} fill="#fff" />
      <ellipse cx={x + w * 0.05} cy={y + h * 0.78} rx={w * 0.22} ry={h * 0.2} fill="#E26A6A" />
    </g>
  );
}
// Высокий кед: пятка в x, носок в x+dir·L.
function KHiTop({ x, y = 400, dir = 1, L = 40, H = 30, body }) {
  return (
    <g transform={'translate(' + x + ' ' + y + ') scale(' + dir + ' 1)'}>
      <path d={'M1 -5 Q-3 ' + -H + ' 6 ' + (-H - 2) + ' H' + L * 0.4 + ' Q' + L * 0.47 + ' ' + -H + ' ' + L * 0.46 + ' ' + -H * 0.62 + ' Q' + L * 0.72 + ' ' + -H * 0.52 + ' ' + (L - 2) + ' -13 Q' + (L + 3) + ' -9 ' + L + ' -5Z'} fill={body} {...kInk()} />
      <path d={'M' + L * 0.62 + ' -6 Q' + L * 0.62 + ' ' + -H * 0.45 + ' ' + (L - 2) + ' -13 Q' + (L + 3) + ' -9 ' + L + ' -5Z'} fill="#F4EEE2" {...kInk(1.6)} />
      <path d={'M-2 -8 H' + (L + 2) + ' Q' + (L + 5) + ' -1 ' + (L - 1) + ' 0 H1 Q-4 -1 -2 -8Z'} fill="#F4EEE2" {...kInk()} />
      <path d={'M' + L * 0.36 + ' ' + -H * 0.84 + ' l' + L * 0.14 + ' ' + H * 0.07 + ' M' + L * 0.4 + ' ' + -H * 0.64 + ' l' + L * 0.14 + ' ' + H * 0.07 + ' M' + L * 0.47 + ' ' + -H * 0.44 + ' l' + L * 0.13 + ' ' + H * 0.07} stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}
// Опущенная расслабленная кисть: (x,y) — запястье, dir — куда смотрит большой палец.
const KDownHand = ({ x, y, dir = 1 }) => (
  <g transform={'translate(' + x + ' ' + y + ') scale(' + dir + ' 1)'}>
    <path d="M-6 -2 Q-8 10 -3 15 Q3 19 7 12 Q9 4 6 -3Z" fill={kG('skin')} {...kInk(1.8)} />
    <path d="M6 1 q5 3 2 9" fill={kG('skin')} {...kInk(1.5)} />
    <path d="M-4 10 q4 2 7 0" fill="none" {...kInk(1)} />
  </g>
);
// Раскрытая ладошка (машет): (x,y) — запястье, пальцы вверх.
const KPalm = ({ x, y }) => (
  <g>
    <path d={'M' + (x - 8) + ' ' + y + ' Q' + (x - 11) + ' ' + (y - 14) + ' ' + (x - 9) + ' ' + (y - 24) + ' Q' + (x - 7) + ' ' + (y - 29) + ' ' + (x - 4) + ' ' + (y - 25) + ' L' + (x - 3) + ' ' + (y - 30) + ' Q' + (x) + ' ' + (y - 34) + ' ' + (x + 3) + ' ' + (y - 29) + ' L' + (x + 4) + ' ' + (y - 27) + ' Q' + (x + 7) + ' ' + (y - 31) + ' ' + (x + 9) + ' ' + (y - 25) + ' L' + (x + 9) + ' ' + (y - 21) + ' Q' + (x + 13) + ' ' + (y - 22) + ' ' + (x + 12) + ' ' + (y - 15) + ' Q' + (x + 10) + ' ' + (y - 4) + ' ' + (x + 6) + ' ' + y + 'Z'} fill={kG('skin')} {...kInk(1.8)} />
    <path d={'M' + (x - 8) + ' ' + (y - 12) + ' Q' + (x - 16) + ' ' + (y - 14) + ' ' + (x - 15) + ' ' + (y - 20) + ' Q' + (x - 12) + ' ' + (y - 22) + ' ' + (x - 8) + ' ' + (y - 17)} fill={kG('skin')} {...kInk(1.6)} />
    <path d={'M' + (x - 3) + ' ' + (y - 24) + ' v8 M' + (x + 4) + ' ' + (y - 23) + ' v7'} fill="none" {...kInk(1)} />
  </g>
);
// Капсула с надписью — название страницы (из открытой головы).
function P17Capsule({ text }) {
  const t = String(text || '');
  const fs = t.length > 9 ? 17 : t.length > 6 ? 21 : 26;
  return (
    <g className="p17-capsule" transform="rotate(-8 191 133)">
      <rect x="139" y="88" width="103" height="77" rx="28" fill="url(#p17gPink)" stroke={P17K.ink} strokeWidth="2.6" />
      <path d="M157 101q29-9 59-2" fill="none" stroke="#ffe2ee" strokeWidth="5" strokeLinecap="round" opacity=".8" />
      <text x="190.5" y="128" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize={fs} fontWeight="900" fill="#74284c"
        textLength={t.length > 9 ? 92 : undefined} lengthAdjust="spacingAndGlyphs">{t}</text>
    </g>
  );
}
// Искорка-звёздочка.
const KSpark = ({ x, y, r = 7, c = '#F2B33D', d = 0 }) => (
  <path className="p17k-spark" style={{ animationDelay: d + 's' }} fill={c} {...kInk(1.2)}
    d={'M' + x + ' ' + (y - r) + ' Q' + (x + r * 0.2) + ' ' + (y - r * 0.2) + ' ' + (x + r) + ' ' + y + ' Q' + (x + r * 0.2) + ' ' + (y + r * 0.2) + ' ' + x + ' ' + (y + r) + ' Q' + (x - r * 0.2) + ' ' + (y + r * 0.2) + ' ' + (x - r) + ' ' + y + ' Q' + (x - r * 0.2) + ' ' + (y - r * 0.2) + ' ' + x + ' ' + (y - r) + 'Z'} />
);

function P17Head({ open, name, happy }) {
  return (
    <P17Art b={P17B.head}>
      {open ? (
        <g>
          <ellipse cx="100" cy="148" rx="54" ry="26" fill="url(#p17kGlow)" className="p17k-glow" />
          <KSpark x={56} y={150} r={7} /><KSpark x={146} y={150} r={5.5} c="#6FA8E8" d={0.5} />
        </g>
      ) : null}
      {/* волосы сзади — каре вокруг лица */}
      <path d="M63 216 Q58 172 100 166 Q142 172 137 216 Q139 238 128 247 L72 247 Q61 238 63 216Z" fill={kG('hair')} {...kInk()} />
      {/* два пучка-«шишки» с коралловыми резинками */}
      <circle cx={71} cy={168} r={14} fill={kG('hair')} {...kInk()} />
      <circle cx={129} cy={168} r={14} fill={kG('hair')} {...kInk()} />
      <path d="M64 162 q6 -6 13 -3 M122 159 q7 -3 13 3" fill="none" stroke="#9A5A3E" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx={79} cy={180} rx={6} ry={4} fill="#FF7A62" {...kInk(1.4)} transform="rotate(-35 79 180)" />
      <ellipse cx={121} cy={180} rx={6} ry={4} fill="#FF7A62" {...kInk(1.4)} transform="rotate(35 121 180)" />
      {/* лицо */}
      <path d="M70 207 Q70 177 100 175 Q130 177 130 207 Q132 231 118 242 Q100 252 82 242 Q68 231 70 207Z" fill={kG('skin')} {...kInk()} />
      <path d="M118 184 Q131 198 127 222 Q123 236 112 242 Q124 214 118 184Z" fill="#A0402A" opacity=".1" />
      {/* чёлка волной */}
      <path d="M69 208 Q65 176 100 170 Q135 176 131 208 Q126 193 113 190 Q108 199 97 193 Q86 197 80 192 Q73 198 69 208Z" fill={kG('hair')} {...kInk()} />
      <path d="M80 182 q10 -7 22 -6 M108 179 q8 1 13 6" fill="none" stroke="#9A5A3E" strokeWidth="2" strokeLinecap="round" />
      {happy ? <><KJoy x={88} y={210} rx={8.5} /><KJoy x={112} y={210} rx={8.5} /></>
        : <><KEye cid="l" x={88} y={210} rx={9.2} iris="#3F7A4A" look={[0.1, 0.15]} /><KEye cid="r" x={112} y={210} rx={9.2} iris="#3F7A4A" look={[0.1, 0.15]} /></>}
      <path d="M81 199 q7 -4 14 -1 M105 198 q7 -3 14 1" fill="none" {...kInk(2.4)} />
      {/* веснушки, нос, улыбка */}
      <g fill="#C97A5E"><circle cx={79} cy={222} r={1.1} /><circle cx={83} cy={225} r={1.1} /><circle cx={77} cy={226} r={1} /><circle cx={121} cy={221} r={1.1} /><circle cx={117} cy={224} r={1.1} /><circle cx={123} cy={225} r={1} /></g>
      <path d="M98 219 q-2 5 2 6 q4 0 4 -3" fill="none" {...kInk(1.5)} />
      {happy ? <KGrin x={100} y={230} w={19} />
        : <path d="M91 230 Q100 238 109 230" fill="none" {...kInk(2.2)} />}
      <circle cx={78} cy={228} r={6.5} fill="url(#p17kCheek)" /><circle cx={122} cy={227} r={6.5} fill="url(#p17kCheek)" />
      {open && name ? <g className="p17k-cap"><g transform="translate(100 134) scale(.6) translate(-190.5 -126.5)"><P17Capsule text={name} /></g></g> : null}
    </P17Art>
  );
}
// Кофта в коралловую полоску (полоски — внутри формы).
const P17_SHIRT = 'M72 250 Q100 241 128 250 Q136 280 132 306 H68 Q64 280 72 250Z';
function P17Body({ bits }) {
  return (
    <P17Art b={P17B.body}>
      <path d="M94 232 h12 v20 q-6 4 -12 0z" fill={kG('skin')} {...kInk()} />
      <clipPath id="p17cShirt"><path d={P17_SHIRT} /></clipPath>
      <path d={P17_SHIRT} fill={kG('shirt')} />
      <g clipPath="url(#p17cShirt)" stroke="#FFE6DF" strokeWidth="3.4">
        {[256, 266, 276, 286, 296].map((y) => <path key={y} d={'M60 ' + y + ' H140'} />)}
      </g>
      <path d={P17_SHIRT} fill="none" {...kInk()} />
      <path d="M90 247 Q100 256 110 247" fill="#FFF3EE" {...kInk(1.6)} />
      {/* комбинезон: нагрудник, лямки с пуговицами, пояс */}
      <path d="M81 268 H119 L122 306 H78Z" fill={kG('over')} {...kInk()} />
      <path d="M77 252 Q80 260 83 270 L89 270 Q86 258 83 250Z M123 252 Q120 260 117 270 L111 270 Q114 258 117 250Z" fill={kG('over')} {...kInk(1.6)} />
      <circle cx={86} cy={271} r={2.6} fill="#FFD563" {...kInk(1.2)} /><circle cx={114} cy={271} r={2.6} fill="#FFD563" {...kInk(1.2)} />
      <path d="M67 300 H133 Q135 307 133 314 H67 Q65 307 67 300Z" fill="#4FB08E" {...kInk()} />
      <path d="M110 270 Q120 272 121 300 L116 300 Q116 280 110 270Z" fill="#2E8C6E" opacity=".25" />
      {bits ? (
        // Принт на нагруднике — страница: строки текста, картинка, кнопка (то, что видно в окне).
        <g className="p17-bits">
          <rect x="85" y="275" width="30" height="22" rx="4" fill="#FBFBF6" {...kInk(1.4)} />
          <rect x="88" y="279" width="10" height="2.6" rx="1.3" fill="#B9C2CF" /><rect x="88" y="283" width="7" height="2.6" rx="1.3" fill="#B9C2CF" />
          <rect x="101" y="278" width="11" height="9" rx="1.6" fill="#E3F4F5" /><path d="M101 285.5 q3 -3 5.5 -1.5 q2.5 -2.4 5.5 0 v1.6h-11z" fill="#83D2AB" />
          <rect x="89" y="290" width="22" height="4" rx="2" fill="#FF6957" />
        </g>
      ) : (
        <g>
          <rect x="88" y="277" width="24" height="17" rx="4" fill="#A9EAD2" {...kInk(1.4)} />
          <text x="100" y="289" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="8.5" fontWeight="800" fill="#1F6E55">{'</>'}</text>
        </g>
      )}
    </P17Art>
  );
}
// Рукав кофты: коралловый, с белой манжетой.
const P17Sleeve = ({ p }) => <KLimb p={p} w={[20, 18, 16]} fill="#FF8D7D" shade="#D9573F" />;
function P17Arm({ r, wave }) {
  if (!r) {
    return (
      <P17Art b={P17B.armL}>
        <P17Sleeve p={[[76, 258], [62, 286], [64, 310]]} />
        <path d={kLimb(64, 305, 64, 313, 18, 17)} fill="#FFF3EE" {...kInk(1.6)} />
        <KDownHand x={64} y={315} dir={-1} />
        <path d="M78 250 Q64 255 62 274 Q72 280 84 272 Q86 259 82 250Z" fill={kG('shirt')} {...kInk()} />
      </P17Art>
    );
  }
  return (
    <P17Art b={P17B.armR}>
      {wave ? (
        // Поднятая рука: плечо → локоть, предплечье и ладошка машут на локте.
        <g className="p17k-raise" style={{ transformOrigin: '124px 256px' }}>
          <KLimb p={[[124, 258], [152, 256]]} w={[20, 18]} fill="#FF8D7D" shade="#D9573F" />
          <g className="p17k-wave" style={{ transformOrigin: '152px 256px' }}>
            <KLimb p={[[152, 256], [166, 230]]} w={[18, 16]} fill="#FF8D7D" shade="#D9573F" />
            <path d={kLimb(165, 232, 168, 224, 17, 16)} fill="#FFF3EE" {...kInk(1.6)} />
            <KPalm x={169} y={224} />
          </g>
          <path d="M122 250 Q136 252 139 266 Q129 272 117 266 Q115 256 118 250Z" fill={kG('shirt')} {...kInk()} />
        </g>
      ) : (
        <g>
          <P17Sleeve p={[[124, 258], [138, 286], [136, 310]]} />
          <path d={kLimb(136, 305, 136, 313, 18, 17)} fill="#FFF3EE" {...kInk(1.6)} />
          <KDownHand x={136} y={315} dir={1} />
          <path d="M122 250 Q136 255 138 274 Q128 280 116 272 Q114 259 118 250Z" fill={kG('shirt')} {...kInk()} />
        </g>
      )}
    </P17Art>
  );
}
// Штанина комбинезона с подвёрнутым краем и жёлтый кед.
function P17Leg({ r }) {
  const x0 = r ? 112 : 88, x1 = r ? 118 : 84, x2 = r ? 119 : 85;
  return (
    <P17Art b={r ? P17B.legR : P17B.legL}>
      <KLimb p={[[x0, 302], [x1, 336], [x2, 360]]} w={[27, 24, 22]} fill={r ? '#66C4A2' : '#6CCBA8'} shade="#2E8C6E" />
      <rect x={x2 - 13} y={351} width={26} height={12} rx={4} fill="#A9EAD2" {...kInk(1.8)} />
      <path d={'M' + (x2 - 10) + ' 357 h20'} stroke="#6CCBA8" strokeWidth="1.4" />
      <KHiTop x={r ? 111 : 93} dir={r ? 1 : -1} body="#FFD563" />
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
    <div className={'kz-man p17-man' + (spot && hl ? ' is-spot' : '')}>
      {has('legL') ? <Cut c={NONE} cls="p17-part p17-leg" seed={41} {...at(P17B.legL)} {...A('rise', 0.1)}><P17Leg /></Cut> : null}
      {has('legR') ? <Cut c={NONE} cls="p17-part p17-leg is-r" seed={42} {...at(P17B.legR)} {...A('rise', 0.2)}><P17Leg r /></Cut> : null}
      {has('armL') ? <Cut c={NONE} cls="p17-part p17-arm" seed={43} {...at(P17B.armL)} {...A('left', 0)}><P17Arm /></Cut> : null}
      {has('armR') ? <Cut c={NONE} cls="p17-part p17-arm is-r" seed={44} {...at(P17B.armR)} {...A('right', 0.08)}><P17Arm r wave={wave} /></Cut> : null}
      {has('body') ? (
        <Cut c={NONE} cls="p17-part p17-body" seed={45} {...at(P17B.body)} {...A('drop', 0)} hl={hl === 'body'} hlc="#3E9C80"
          onClick={onBody} label="body"><P17Body bits={bits} /></Cut>
      ) : null}
      {showTitle ? (
        // Капсула с названием (экран 6): крупно над головой, чтобы легко нажать; она летит на вкладку.
        <Cut c={NONE} cls="p17-part kz-man-title p17-title" seed={46} {...at(P17B.title)} anim="pop" onClick={onTitle} label="title">
          <P17Art b={P17B.title}>
            <g transform="translate(100 134) scale(1.18) translate(-190.5 -126.5)"><P17Capsule text={titleText} /></g>
          </P17Art>
        </Cut>
      ) : null}
      {/* Облачко с названием части (заказчик, 31.10.2026: «тело нигде не просвечивать, а везде облачко
          с текстом») — сбоку от головы или тела, хвостиком к ней; подсветки частей нет. На экране 1
          (plain) теги ещё не знакомы — в облачке простое слово, как у Коди: «bosh» / «tana». */}
      {hl === 'head' || hl === 'body' ? (
        <span key={hl} className={'p17-call is-' + hl} aria-hidden="true"
          style={{ left: (hl === 'head' ? 137 : 134) / P17_W * 100 + '%', top: ((hl === 'head' ? 196 : 272) - P17_Y0) / P17_H * 100 + '%' }}>
          {plain ? pick(P17_PLAIN[hl]) : <><i>{'<'}</i>{hl}<i>{'>'}</i></>}
        </span>
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

// Экран 1, браузер → человечек: куда летят куски браузера — настоящие контуры частей (доли от окна части).
const P17_MORPH = {
  head: [5 / 88, 16 / 112, 78 / 88, 90 / 112], body: [4 / 76, 8 / 86, 68 / 76, 73 / 86],
  armL: [4 / 44, 4 / 90, 36 / 44, 78 / 90], armR: [4 / 44, 4 / 90, 36 / 44, 78 / 90],
  legL: [3 / 52, 4 / 106, 44 / 52, 100 / 106], legR: [5 / 54, 4 / 106, 48 / 54, 100 / 106]
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
  return { x: x + (w * (69 - 56)) / 88, y: y + (h * (115 - 140)) / 112, w: (w * 62) / 88, h: (h * 46) / 112, r: -8 };
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
