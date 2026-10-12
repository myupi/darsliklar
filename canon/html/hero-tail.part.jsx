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

// ЖИЗНЬ ЛИЦА — собственный слой Коди поверх системы движения канона.
// Классы состояний (eyes-*, loop-*, is-talking, no-blink) ставит RobotSVG,
// поэтому слой знает, что сейчас чувствует герой, не спрашивая экран.
// Все циклы медленнее 3 Гц; пауза урока и «меньше движения» их останавливают.
const KODI_CSS = `
.kodi .kodi-gaze { animation: kodiGaze 7.2s cubic-bezier(.3,0,.2,1) infinite; }
@keyframes kodiGaze {
  0%, 34% { transform: translate(0, 0); }
  37%, 52% { transform: translate(-5px, 1px); }
  55%, 70% { transform: translate(4px, -1px); }
  73%, 100% { transform: translate(0, 0); }
}
.kodi.loop-sag .kodi-gaze, .kodi.loop-lean .kodi-gaze { animation: none; }
.kodi .kodi-blink { transform-origin: 50% 50%; animation: kodiBlink 5.4s linear infinite; }
@keyframes kodiBlink {
  0%, 94% { transform: scaleY(1); }
  95.6% { transform: scaleY(.08); }
  97.4%, 100% { transform: scaleY(1); }
}
.kodi.no-blink .kodi-blink { animation: none; }

.kodi .kodi-m { opacity: 0; transition: opacity .2s ease; }
.kodi .kodi-m-smile { opacity: 1; }
.kodi.eyes-arc .kodi-m-smile, .kodi.eyes-star .kodi-m-smile, .kodi.eyes-ring .kodi-m-smile,
.kodi.loop-sag .kodi-m-smile, .kodi.loop-ponder .kodi-m-smile { opacity: 0; }
.kodi.eyes-arc .kodi-m-open, .kodi.eyes-star .kodi-m-open { opacity: 1; }
.kodi.eyes-ring .kodi-m-o { opacity: 1; }
.kodi.loop-sag .kodi-m-flat { opacity: 1; }
.kodi.loop-ponder .kodi-m-side { opacity: 1; }
.kodi .kodi-mouth { transform-origin: 50% 35%; filter: drop-shadow(0 0 3px var(--accent)); }
.kodi.is-talking .kodi-mouth { animation: kodiTalk .48s ease-in-out infinite; }
@keyframes kodiTalk {
  0%, 100% { transform: scale(1, 1); }
  25% { transform: scale(.93, 1.55); }
  50% { transform: scale(1.04, .82); }
  75% { transform: scale(.97, 1.3); }
}

.kodi .kodi-ear { opacity: .22; transition: opacity .3s ease; }
.kodi.is-talking .kodi-ear { animation: kodiEar .9s ease-in-out infinite; }
@keyframes kodiEar { 0%, 100% { opacity: .3; } 50% { opacity: .95; } }

.kodi .kodi-glare { animation: kodiGlare 6.8s ease-in-out infinite; }
@keyframes kodiGlare {
  0%, 68% { transform: translateX(-80px); }
  88%, 100% { transform: translateX(200px); }
}

.speaker-av .kodi { transition: transform .22s cubic-bezier(.34,1.56,.64,1); }
.speaker-av:active .kodi { transform: scale(.93, .9); }

@media (prefers-reduced-motion: reduce) {
  .kodi .kodi-gaze, .kodi .kodi-blink, .kodi .kodi-glare,
  .kodi.is-talking .kodi-mouth, .kodi.is-talking .kodi-ear { animation: none !important; }
  .kodi .kodi-glare { display: none; }
}
`;

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
//
// Внутри рисунка нет атрибутов transform у групп и фигур с масштабом или
// отражением: канон ставит узлам героя transform-box: fill-box, и такие
// трансформации считались бы от края фигуры. Поэтому правая рука нарисована
// прямыми координатами, а не зеркалом левой.
// ─────────────────────────────────────────────────────────────────────────────
function RobotSVG({ pose = 'explain', className, talking }) {
  const key = POSE_SET[pose] ? pose : 'explain';
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': KODI_GLOW[S.accent] || S.accent };
  Object.keys(S.pose).forEach((k) => { vars['--' + k] = S.pose[k] + (POSE_UNIT[k] || ''); });

  const cls = ['bot', 'kodi', 'eyes-' + S.eyes, S.loop];
  if (S.noBlink) cls.push('no-blink');
  if (talking) cls.push('is-talking');
  if (className) cls.push(className);

  const u = (id) => `url(#${uid}${id})`;
  const Spark = ({ x, y, s, d }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="spark" style={d ? { animationDelay: d + 'ms' } : undefined}
        fill="var(--accent)"
        d="M0 -25 C3 -8 8 -3 25 0 C8 3 3 8 0 25 C-3 8 -8 3 -25 0 C-8 -3 -3 -8 0 -25 Z" />
    </g>
  );

  // Рука: рукав с вязаной манжетой и варежка с большим пальцем к телу.
  const ARM = {
    l: { sleeve: 'M150 210 C137 211 127 220 122 236 L112 276 C110 285 123 291 129 283 L144 246 Z',
      shade: 'M150 210 C137 211 127 220 122 236 L114 268',
      cuff: 'M111 274 L131 282', hand: [117, 295], thumb: [129, 289], shine: [111, 288] },
    r: { sleeve: 'M270 210 C283 211 293 220 298 236 L308 276 C310 285 297 291 291 283 L276 246 Z',
      shade: 'M270 210 C283 211 293 220 298 236 L306 268',
      cuff: 'M309 274 L289 282', hand: [303, 295], thumb: [291, 289], shine: [297, 288] }
  };
  const Arm = ({ side }) => {
    const a = ARM[side];
    return (
      <>
        <path d={a.sleeve} fill={u('w')} />
        <path d={a.shade} fill="none" stroke={BOT.sweaterDk} strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <path d={a.cuff} fill="none" stroke={BOT.sweaterDk} strokeWidth="10" strokeLinecap="round" />
        <path d={a.cuff} fill="none" stroke={u('rib')} strokeWidth="10" strokeLinecap="round" />
        <ellipse cx={a.thumb[0]} cy={a.thumb[1]} rx="5.5" ry="7.5" fill={u('k')} />
        <ellipse cx={a.hand[0]} cy={a.hand[1]} rx="14" ry="16" fill={u('k')} />
        <ellipse cx={a.shine[0]} cy={a.shine[1]} rx="4.5" ry="6" fill="#fff" opacity=".6" />
      </>
    );
  };

  // Рот: все формы на месте, видна одна — её выбирает KODI_CSS по состоянию.
  const MOUTH = (
    <g className="kodi-mouth">
      <path className="kodi-m kodi-m-smile" d="M192 144 Q210 158 228 144" fill="none"
        stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
      <path className="kodi-m kodi-m-open" d="M190 139 Q210 170 230 139 Q210 146 190 139 Z" fill="var(--accent)" />
      <ellipse className="kodi-m kodi-m-o" cx="210" cy="149" rx="7" ry="8.5" fill="none"
        stroke="var(--accent)" strokeWidth="5" />
      <path className="kodi-m kodi-m-flat" d="M197 152 Q210 147 223 152" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-side" d="M195 150 Q213 155 226 144" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );

  return (
    <svg className={cls.join(' ')} style={vars} viewBox="20 -70 380 520"
      aria-hidden="true" focusable="false">
      <style>{KODI_CSS}</style>
      <defs>
        {/* голова: матовый винил — основа, блик сверху слева, тень снизу справа */}
        <linearGradient id={uid + 'h'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF9F4" />
          <stop offset="50%" stopColor={BOT.head} />
          <stop offset="100%" stopColor={BOT.headMid} />
        </linearGradient>
        <radialGradient id={uid + 'hl'} cx="30%" cy="18%" r="45%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={uid + 'hs'} cx="78%" cy="96%" r="70%">
          <stop offset="0%" stopColor={BOT.headDk} stopOpacity=".95" />
          <stop offset="100%" stopColor={BOT.headDk} stopOpacity="0" />
        </radialGradient>
        {/* медь: светлый верх, тёмный пояс, отражение внизу — так читается металл */}
        <linearGradient id={uid + 'c'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.rimLt} />
          <stop offset="38%" stopColor={BOT.rim} />
          <stop offset="72%" stopColor={BOT.rimDk} />
          <stop offset="100%" stopColor={BOT.rim} />
        </linearGradient>
        {/* стекло экрана: светлее в центре, к краям уходит в черноту */}
        <radialGradient id={uid + 's'} cx="210" cy="118" r="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={BOT.visorMid} />
          <stop offset="100%" stopColor={BOT.visor} />
        </radialGradient>
        <pattern id={uid + 'px'} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 0 H4 M0 0 V4" stroke="#000" strokeWidth="1" opacity=".5" />
        </pattern>
        {/* свитер: объём от края к центру и вязаная резинка */}
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.sweaterLt} />
          <stop offset="100%" stopColor={BOT.sweaterDk} />
        </linearGradient>
        <linearGradient id={uid + 'ws'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity=".28" />
          <stop offset="22%" stopColor="#000" stopOpacity="0" />
          <stop offset="78%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".32" />
        </linearGradient>
        <pattern id={uid + 'rib'} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M3 0 V6" stroke={BOT.sweaterLt} strokeWidth="1.6" opacity=".7" />
        </pattern>
        {/* кремовые руки и ноги: скругление светом слева */}
        <linearGradient id={uid + 'k'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBF9F4" />
          <stop offset="60%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        <linearGradient id={uid + 'l'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F8F5EE" />
          <stop offset="55%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        <radialGradient id={uid + 'sh'}>
          <stop offset="0%" stopColor={BOT.shadow} stopOpacity="1" />
          <stop offset="100%" stopColor={BOT.shadow} stopOpacity="0" />
        </radialGradient>
        <clipPath id={uid + 'v'}><rect x="128" y="71" width="164" height="108" rx="32" /></clipPath>
        <clipPath id={uid + 'hc'}><rect x="104" y="22" width="212" height="192" rx="76" /></clipPath>
      </defs>

      {/* Мягкая контактная тень: размытый край вместо плоского овала. */}
      <ellipse className="bot-shadow" cx="210" cy="404" rx="96" ry="17" fill={u('sh')} />

      <g className="bot-float">
        <g className="bot-pose-body">
          <g className="bot-beat-body">

            {/* ноги: стопа — продолжение ноги, чуть шире и с носком вперёд */}
            <rect x="167" y="286" width="34" height="86" rx="16" fill={u('l')} />
            <rect x="219" y="286" width="34" height="86" rx="16" fill={u('l')} />
            <path d="M163 372 C163 360 170 354 184 354 C198 354 206 362 207 372 C207 384 198 390 184 390
                     C170 390 163 384 163 372 Z" fill={u('l')} />
            <path d="M213 372 C214 362 222 354 236 354 C250 354 257 360 257 372 C257 384 250 390 236 390
                     C222 390 213 384 213 372 Z" fill={u('l')} />
            <path d="M166 382 Q184 392 204 382" fill="none" stroke={BOT.headDk} strokeWidth="3" strokeLinecap="round" />
            <path d="M216 382 Q236 392 254 382" fill="none" stroke={BOT.headDk} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="177" cy="363" rx="7" ry="4" fill="#fff" opacity=".45" />
            <ellipse cx="229" cy="363" rx="7" ry="4" fill="#fff" opacity=".45" />

            {/* свитер */}
            <path d="M150 206 C150 199 160 194 172 194 H248 C260 194 270 199 270 206 L278 288
                     C279 299 271 306 260 306 H160 C149 306 141 299 142 288 Z" fill={u('w')} />
            <path d="M150 206 C150 199 160 194 172 194 H248 C260 194 270 199 270 206 L278 288
                     C279 299 271 306 260 306 H160 C149 306 141 299 142 288 Z" fill={u('ws')} />
            <rect x="145" y="292" width="130" height="14" rx="6" fill={BOT.sweaterDk} />
            <rect x="145" y="292" width="130" height="14" rx="6" fill={u('rib')} />
            <ellipse cx="210" cy="203" rx="56" ry="13" fill="#0B1222" opacity=".45" />
            <text x="210" y="240" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="19" fill="#F4F1EA" letterSpacing=".5">JUNIOR IT</text>
            <rect x="166" y="248" width="88" height="20" rx="3" fill={BOT.label} />
            <rect x="166" y="248" width="88" height="7" rx="3" fill="#fff" opacity=".14" />
            <text x="210" y="263" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="13" fill="#fff" letterSpacing="1">AKADEMIYA</text>

            {/* голова */}
            <g className="bot-pose-head">
              <g className="bot-beat-head">
                {/* «наушники»: медные чашки, внутри кольцо-индикатор речи */}
                <rect x="84" y="96" width="34" height="64" rx="17" fill={u('c')} />
                <rect x="90" y="104" width="22" height="48" rx="11" fill={BOT.rimDk} opacity=".55" />
                <rect className="kodi-ear" x="94" y="108" width="14" height="40" rx="7" fill="none"
                  stroke="var(--accent)" strokeWidth="3" />
                <path d="M92 108 Q96 99 104 99" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".45" />
                <rect x="302" y="96" width="34" height="64" rx="17" fill={u('c')} />
                <rect x="308" y="104" width="22" height="48" rx="11" fill={BOT.rimDk} opacity=".55" />
                <rect className="kodi-ear" x="312" y="108" width="14" height="40" rx="7" fill="none"
                  stroke="var(--accent)" strokeWidth="3" />
                <path d="M310 108 Q314 99 322 99" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".45" />

                <rect x="104" y="22" width="212" height="192" rx="76" fill={u('h')} />
                <g clipPath={u('hc')}>
                  <rect x="104" y="22" width="212" height="192" fill={u('hs')} />
                  <rect x="104" y="22" width="212" height="192" fill={u('hl')} />
                </g>
                <rect x="104" y="22" width="212" height="192" rx="76" fill="none"
                  stroke={BOT.edge} strokeWidth="1.4" opacity=".5" />

                {/* медная рамка с бликом по верхней кромке */}
                <rect x="119" y="62" width="182" height="126" rx="40" fill={u('c')} />
                <path d="M146 65 Q210 58 274 65" fill="none" stroke="#FFE2C6" strokeWidth="3"
                  strokeLinecap="round" opacity=".55" />

                {/* экран-лицо */}
                <rect x="128" y="71" width="164" height="108" rx="32" fill={u('s')} />
                <g clipPath={u('v')}>
                  <ellipse className="bot-blush" cx="152" cy="152" rx="15" ry="7" fill={BOT.blush} />
                  <ellipse className="bot-blush" cx="268" cy="152" rx="15" ry="7" fill={BOT.blush} />
                  <g className="bot-pose-eyes">
                    <g className="kodi-gaze">
                      <g className="kodi-blink">
                        <rect className="bot-glow" x="164" y="96" width="32" height="32" rx="11" fill="var(--accent)" />
                        <rect className="bot-glow" x="224" y="96" width="32" height="32" rx="11" fill="var(--accent)" />
                        {/* пиксельные глаза — скруглённые квадраты, как на листе */}
                        <rect className="pupil" x="167" y="99" width="26" height="26" rx="9" fill="var(--accent)" />
                        <rect className="pupil" x="227" y="99" width="26" height="26" rx="9" fill="var(--accent)" />
                        {/* кольца — удивление */}
                        <circle className="ring" cx="180" cy="112" r="11" fill="none"
                          stroke="var(--accent)" strokeWidth="6" />
                        <circle className="ring" cx="240" cy="112" r="11" fill="none"
                          stroke="var(--accent)" strokeWidth="6" />
                        {/* звёзды — восторг */}
                        <path className="star" transform="translate(180 112)" fill="var(--accent)"
                          d="M0 -19 C2.4 -6.4 6.4 -2.4 19 0 C6.4 2.4 2.4 6.4 0 19 C-2.4 6.4 -6.4 2.4 -19 0 C-6.4 -2.4 -2.4 -6.4 0 -19 Z" />
                        <path className="star" transform="translate(240 112)" fill="var(--accent)"
                          d="M0 -19 C2.4 -6.4 6.4 -2.4 19 0 C6.4 2.4 2.4 6.4 0 19 C-2.4 6.4 -6.4 2.4 -19 0 C-6.4 -2.4 -2.4 -6.4 0 -19 Z" />
                        {/* дуги — улыбка глазами */}
                        <path className="arc" d="M166 118 Q180 100 194 118" fill="none"
                          stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                        <path className="arc" d="M226 118 Q240 100 254 118" fill="none"
                          stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                      </g>
                    </g>
                  </g>
                  {MOUTH}
                  {/* веки — того же стекла, что экран: в покое их не видно */}
                  <rect className="bot-lid bot-lid-l" x="130" y="3" width="82" height="92" fill={u('s')} />
                  <rect className="bot-lid bot-lid-r" x="208" y="3" width="82" height="92" fill={u('s')} />
                  {/* пиксельная сетка дисплея и стекло с бликами */}
                  <rect x="128" y="71" width="164" height="108" fill={u('px')} />
                  <path d="M138 80 Q150 74 178 74 L150 120 Q136 112 138 80 Z" fill="#fff" opacity=".07" />
                  <rect x="142" y="79" width="26" height="6" rx="3" fill="#fff" opacity=".22" />
                  <g className="kodi-glare">
                    <path d="M150 60 L176 60 L146 200 L120 200 Z" fill="#fff" opacity=".1" />
                  </g>
                </g>
                <rect x="128" y="71" width="164" height="108" rx="32" fill="none"
                  stroke="#000" strokeWidth="3" opacity=".35" />
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

