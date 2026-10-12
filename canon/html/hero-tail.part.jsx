// Героя зовут Коди (заказчик, 12.10.2026). Имя звучит в первом уроке курса,
// на экране оно не подписывается.
const BOT_NAME = { uz: 'Kodi', ru: 'Коди', en: 'Kodi' };

// Свечение лица Коди. Состояния системы движения несут свои акценты
// (BOT_CALM, BOT_GLAD …); у Коди экран светится по-своему, поэтому акцент
// состояния переводится в цвет его дисплея.
const KODI_GLOW = {
  [BOT_CALM]: '#3FE0CF',   // спокойно — бирюзовый, как на листе заказчика
  [BOT_GLAD]: '#FFD24A',   // радость — жёлтый
  [BOT_WOW]:  '#7FEFFF',   // «ого» — светло-голубой
  [BOT_DIM]:  '#7E8A99'    // грусть, выключен — серый
};

// Градиенты и обтравка объявляются внутри каждого экземпляра, поэтому им нужны
// разные имена: на экране бывает два героя сразу (маленький в шапке и крупный
// на прощании), и одинаковые id склеили бы их.
let _botUid = 0;

// ─────────────────────────────────────────────────────────────────────────────
// КОДИ. Имя компонента RobotSVG оставлено каноническим: его зовут
// PersonaBubble, прощание и типовые экраны, и замена героя не трогает их код.
//
// Рамка та же, что у робота Курса 0 (viewBox 20 -70 380 520): её поля посчитаны
// по крайним точкам движения, и Коди укладывается в те же габариты.
// Рот нарисован с классом bot-seam: канон заставляет этот узел пульсировать,
// пока герой говорит, — у Коди это и есть «говорящий» рот.
// ─────────────────────────────────────────────────────────────────────────────
function RobotSVG({ pose = 'explain', className, talking }) {
  const key = POSE_SET[pose] ? pose : 'explain';
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': KODI_GLOW[S.accent] || S.accent };
  Object.keys(S.pose).forEach((k) => { vars['--' + k] = S.pose[k] + (POSE_UNIT[k] || ''); });

  const cls = ['bot', 'eyes-' + S.eyes, S.loop];
  if (S.noBlink) cls.push('no-blink');
  if (talking) cls.push('is-talking');
  if (className) cls.push(className);

  const Spark = ({ x, y, s, d }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="spark" style={d ? { animationDelay: d + 'ms' } : undefined}
        fill="var(--accent)"
        d="M0 -25 C3 -8 8 -3 25 0 C8 3 3 8 0 25 C-3 8 -8 3 -25 0 C-8 -3 -3 -8 0 -25 Z" />
    </g>
  );
  // Рука: рукав свитера и кремовая варежка. Правая нарисована прямыми
  // координатами, а не отражением через transform: канон ставит группам
  // героя transform-box: fill-box, и отражение считалось бы от края руки —
  // она уезжала бы в сторону.
  const ARM = {
    l: { sleeve: 'M150 214 C136 214 126 222 121 238 L110 280 C107 292 126 298 131 287 L146 246 Z',
      edge: 'M150 214 C136 214 126 222 121 238', hand: [118, 296], shine: [113, 290] },
    r: { sleeve: 'M270 214 C284 214 294 222 299 238 L310 280 C313 292 294 298 289 287 L274 246 Z',
      edge: 'M270 214 C284 214 294 222 299 238', hand: [302, 296], shine: [297, 290] }
  };
  const Arm = ({ side }) => {
    const a = ARM[side];
    return (
      <>
        <path d={a.sleeve} fill={`url(#${uid}w)`} />
        <path d={a.edge} fill="none" stroke={BOT.sweaterDk} strokeWidth="2" opacity=".6" />
        <ellipse cx={a.hand[0]} cy={a.hand[1]} rx="15" ry="17" fill={`url(#${uid}h)`} />
        <ellipse cx={a.shine[0]} cy={a.shine[1]} rx="5" ry="6" fill="#fff" opacity=".55" />
      </>
    );
  };

  return (
    <svg className={cls.join(' ')} style={vars} viewBox="20 -70 380 520"
      aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={uid + 'h'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF9F4" />
          <stop offset="55%" stopColor={BOT.head} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        <linearGradient id={uid + 'c'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BOT.rimLt} />
          <stop offset="55%" stopColor={BOT.rim} />
          <stop offset="100%" stopColor={BOT.rimDk} />
        </linearGradient>
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2C3B60" />
          <stop offset="100%" stopColor={BOT.sweaterDk} />
        </linearGradient>
        <linearGradient id={uid + 'l'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        {/* «Пиксели» дисплея: тонкая сетка поверх свечения. */}
        <pattern id={uid + 'p'} width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 0 H5 M0 0 V5" stroke={BOT.visor} strokeWidth="1.2" opacity=".55" />
        </pattern>
        <clipPath id={uid + 'v'}><rect x="133" y="76" width="154" height="98" rx="28" /></clipPath>
      </defs>

      {/* Контактная тень дышит навстречу парению: без неё герой висит без веса. */}
      <ellipse className="bot-shadow" cx="210" cy="410" rx="84" ry="14" fill="#4A5568" />

      <g className="bot-float">
        <g className="bot-pose-body">
          <g className="bot-beat-body">

            {/* ноги */}
            <rect x="163" y="290" width="38" height="98" rx="17" fill={`url(#${uid}l)`} />
            <rect x="219" y="290" width="38" height="98" rx="17" fill={`url(#${uid}l)`} />
            <ellipse cx="180" cy="390" rx="25" ry="11" fill={BOT.headDk} />
            <ellipse cx="240" cy="390" rx="25" ry="11" fill={BOT.headDk} />

            {/* свитер */}
            <path d="M156 204 C156 199 165 195 176 195 H244 C255 195 264 199 264 204 L274 290
                     C275 301 268 308 257 308 H163 C152 308 145 301 146 290 Z" fill={`url(#${uid}w)`} />
            <path d="M150 300 H270" stroke={BOT.sweaterDk} strokeWidth="5" strokeLinecap="round" opacity=".7" />
            <text x="210" y="240" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="19" fill="#F4F1EA" letterSpacing=".5">JUNIOR IT</text>
            <rect x="166" y="248" width="88" height="20" rx="3" fill={BOT.label} />
            <text x="210" y="263" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="13" fill="#fff" letterSpacing="1">AKADEMIYA</text>

            {/* голова */}
            <g className="bot-pose-head">
              <g className="bot-beat-head">
                {/* «наушники» по бокам */}
                <g>
                  <rect x="88" y="98" width="30" height="56" rx="15" fill={`url(#${uid}c)`} />
                  <rect x="94" y="108" width="18" height="36" rx="9" fill={BOT.rimDk} opacity=".55" />
                  <rect x="302" y="98" width="30" height="56" rx="15" fill={`url(#${uid}c)`} />
                  <rect x="308" y="108" width="18" height="36" rx="9" fill={BOT.rimDk} opacity=".55" />
                </g>
                <rect x="104" y="24" width="212" height="188" rx="74" fill={`url(#${uid}h)`} />
                <rect x="104" y="24" width="212" height="188" rx="74" fill="none"
                  stroke={BOT.edge} strokeWidth="1.4" opacity=".55" />
                <ellipse cx="160" cy="48" rx="34" ry="12" fill="#fff" opacity=".8" />

                {/* медная рамка и экран-лицо */}
                <rect x="124" y="67" width="172" height="116" rx="36" fill={`url(#${uid}c)`} />
                <rect x="133" y="76" width="154" height="98" rx="28" fill={BOT.visor} />
                <g clipPath={`url(#${uid}v)`}>
                  <ellipse className="bot-blush" cx="152" cy="150" rx="15" ry="7" fill={BOT.blush} />
                  <ellipse className="bot-blush" cx="268" cy="150" rx="15" ry="7" fill={BOT.blush} />
                  <g className="bot-pose-eyes">
                    <ellipse className="bot-glow" cx="182" cy="116" rx="17" ry="17" fill="var(--accent)" />
                    <ellipse className="bot-glow" cx="238" cy="116" rx="17" ry="17" fill="var(--accent)" />
                    <ellipse className="pupil" cx="182" cy="116" rx="13" ry="13" fill="var(--accent)" />
                    <ellipse className="pupil" cx="238" cy="116" rx="13" ry="13" fill="var(--accent)" />
                    {/* кольца — удивление */}
                    <circle className="ring" cx="182" cy="116" r="12" fill="none"
                      stroke="var(--accent)" strokeWidth="6" />
                    <circle className="ring" cx="238" cy="116" r="12" fill="none"
                      stroke="var(--accent)" strokeWidth="6" />
                    {/* звёзды — восторг */}
                    <path className="star" transform="translate(182 116)" fill="var(--accent)"
                      d="M0 -19 C2.4 -6.4 6.4 -2.4 19 0 C6.4 2.4 2.4 6.4 0 19 C-2.4 6.4 -6.4 2.4 -19 0 C-6.4 -2.4 -2.4 -6.4 0 -19 Z" />
                    <path className="star" transform="translate(238 116)" fill="var(--accent)"
                      d="M0 -19 C2.4 -6.4 6.4 -2.4 19 0 C6.4 2.4 2.4 6.4 0 19 C-2.4 6.4 -6.4 2.4 -19 0 C-6.4 -2.4 -2.4 -6.4 0 -19 Z" />
                    {/* дуги — улыбка глазами */}
                    <path className="arc" d="M168 122 Q182 104 196 122" fill="none"
                      stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                    <path className="arc" d="M224 122 Q238 104 252 122" fill="none"
                      stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                  </g>
                  {/* рот: светится и пульсирует, пока Коди говорит */}
                  <path className="bot-seam" d="M190 146 Q210 162 230 146" fill="none"
                    stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
                  <path className="bot-seam bot-glow" d="M190 146 Q210 162 230 146" fill="none"
                    stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
                  <rect x="133" y="76" width="154" height="98" fill={`url(#${uid}p)`} />
                  {/* веки: наклон внешних углов и есть выражение */}
                  <rect className="bot-lid bot-lid-l" x="135" y="11" width="80" height="88" fill={BOT.visor} />
                  <rect className="bot-lid bot-lid-r" x="205" y="11" width="80" height="88" fill={BOT.visor} />
                  {/* моргание раз в 5.4 с — 0.18 Гц, втрое ниже порога WCAG */}
                  <rect className="bot-blink" x="133" y="76" width="154" height="66" fill={BOT.visor} />
                </g>
                <path d="M150 80 Q170 74 196 76" fill="none" stroke="#fff" strokeWidth="4"
                  strokeLinecap="round" opacity=".18" />
              </g>
            </g>

            {/* Искры восторга со сдвигом 140 мс. */}
            <g>
              <Spark x={84} y={70} s={0.5} />
              <Spark x={338} y={50} s={0.42} d={140} />
              <Spark x={110} y={4} s={0.34} d={280} />
              <Spark x={330} y={196} s={0.3} d={420} />
              <Spark x={80} y={214} s={0.38} d={560} />
            </g>

            {/* Руки отстают от тела на 90 мс — это и читается как живое. */}
            <g className="bot-pose-arm-l"><g className="bot-beat-arm-l"><Arm side="l" /></g></g>
            <g className="bot-pose-arm-r"><g className="bot-beat-arm-r"><Arm side="r" /></g></g>

          </g>
        </g>
      </g>
    </svg>
  );
}

