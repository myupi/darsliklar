// Героя зовут Коди (заказчик, 12.10.2026). Имя звучит в первом уроке курса,
// на экране оно не подписывается.
const BOT_NAME = { uz: 'Kodi', ru: 'Коди', en: 'Kodi' };

// Свечение лица Коди. Состояния системы движения несут свои акценты
// (BOT_CALM, BOT_GLAD …); у Коди экран светится по-своему, поэтому акцент
// состояния переводится в цвет его дисплея.
const KODI_GLOW = {
  [BOT_CALM]: '#58F4F2',   // спокойно — яркая бирюза, как на листе лица заказчика
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

/* ОПОРА НА НОГИ. Система движения канона наклоняет корпус целиком, вокруг
   нижней точки фигуры: робот Курса 0 парит, и крен в 24° («любопытство»)
   читается у него как наклон. Коди стоит на ногах — тот же крен валит его
   набок вместе с ногами, будто он падает. Поэтому у Коди наклон позы
   (--bodyRot) берёт только верх — свитер, голову и руки — и идёт от пояса,
   а ноги стоят. Сдвиги и сжатия позы (прыжок, оседание) по-прежнему двигают
   героя целиком. Крен смягчён: от пояса тот же угол выглядел бы поклоном. */
.bot.kodi .bot-pose-body {
  transform: translate(var(--bodyX), var(--bodyY)) scale(var(--bodySX), var(--bodySY)); }
.bot.kodi .kodi-torso { transform-box: view-box; transform-origin: 210px 288px;
  transform: rotate(calc(var(--bodyRot) * .55));
  transition: transform var(--dur) var(--ease); }

/* ПЛЕЧО — ТОЧКА ВРАЩЕНИЯ РУКИ. Канон задаёт её процентами рамки фигуры
   (50% 7%). У группы такта, вложенной в уже повёрнутую руку, браузер считает
   эти проценты не от плеча: в «привет» рука махала вокруг кисти, а плечо
   ездило. Поэтому у Коди точка вращения обеих групп руки — центр плечевого
   шарнира в координатах рисунка. */
.bot.kodi .bot-pose-arm-l, .bot.kodi .bot-beat-arm-l { transform-box: view-box; transform-origin: 127px 222px; }
.bot.kodi .bot-pose-arm-r, .bot.kodi .bot-beat-arm-r { transform-box: view-box; transform-origin: 293px 222px; }
/* Сдвиги рук в позах канона (armLX/armRX до 44 px) подбирались под
   прежнюю точку вращения и уводили плечо на грудь — в «point» рука росла из
   середины свитера. У Коди рука вращается ровно вокруг плеча, поэтому из позы
   берётся только поворот: кисти и так приходят куда нужно (к подбородку в
   «думаю», вместе под лицом в «улыбке», крест-накрест в «смущении»). */
.bot.kodi .bot-pose-arm-l { transform: rotate(var(--armLR)); }
.bot.kodi .bot-pose-arm-r { transform: rotate(var(--armRR)); }

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
// ПРОПОРЦИИ (v3, по референсам заказчика 15.10.2026: модельный лист и
// «разобранный» Коди, размеры сняты с картинок по пикселям). Рост от макушки до
// подошвы 366: шлем 204 × 153 (~42% роста, широкий и приземистый), шея, свитер
// 98 (подол y 284), ноги-столбики 51 с зазором 12, кеды 74 × 37. Медная рамка экрана — почти во весь шлем. Уши — вставки вровень
// с силуэтом (на референсе они торчат, это отмечено там же как ошибка).
// Ось симметрии x = 210; пояс (ось наклона торса) y = 288; плечевые шарниры
// (127, 222) и (293, 222) — точки вращения рук в KODI_CSS.
//
// Внутри рисунка нет атрибутов transform у групп и фигур с масштабом или
// отражением: канон ставит узлам героя transform-box: fill-box, и такие
// трансформации считались бы от края фигуры. Поэтому правая рука и правая нога
// не зеркалятся атрибутом, а получают отражённые координаты (mirror ниже).
//
// РУКА — ТРУБА ОТ ПЛЕЧА. Рука нарисована строго вертикально, плечевой шарнир —
// круг наверху: при любом повороте (до ±158° в позах) рукав остаётся рукавом.
// ─────────────────────────────────────────────────────────────────────────────

// Углы рук, которые у Коди отличаются от общей системы поз: на референсах
// «объясняю правило» и «ого!» руки разведены заметно шире.
const LID_LIFT = 12;
const KODI_POSE = {
  rule: { armLR: 46, armRR: -46 },
  wonder: { armLR: 52, armRR: -52 }
};

function RobotSVG({ pose = 'explain', className, talking }) {
  const key = POSE_SET[pose] ? pose : 'explain';
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  const P = Object.assign({}, S.pose, KODI_POSE[key] || {});
  // Веки Коди висят на 12 выше глаз, чтобы их край не срезал свечение глаз в
  // покое; опущенное веко проходит на те же 12 дальше — выражение не меняется.
  if (P.lidY > 0) P.lidY += LID_LIFT;
  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': KODI_GLOW[S.accent] || S.accent };
  Object.keys(P).forEach((k) => { vars['--' + k] = P[k] + (POSE_UNIT[k] || ''); });

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

  // Отражение через ось x = 210: правая половина — те же фигуры, что левая.
  const MX = 420;
  const mx = (x) => +(MX - x).toFixed(2);
  const mirrorPath = (d) => {
    let cmd = '';
    let i = 0;
    return d.replace(/[A-Za-z]|-?\d*\.?\d+/g, (t) => {
      if (/[A-Za-z]/.test(t)) { cmd = t.toUpperCase(); i = 0; return t; }
      const flip = cmd === 'H' || (cmd !== 'V' && i % 2 === 0);
      i += 1;
      return flip ? String(mx(parseFloat(t))) : t;
    });
  };

  // Рука: шарнир, рукав-труба с вязаной манжетой, крупная варежка с большим
  // пальцем к телу.
  const ARM_L = {
    cap: [127, 222, 17],
    sleeve: 'M110 222 C110 212 118 205 127 205 C136 205 144 212 144 222 L144 274 C144 282 136 287 127 287 C118 287 110 282 110 274 Z',
    shade: 'M138 210 C142 214 144 218 144 224 L144 272 C144 278 141 283 136 285',
    cuff: { x: 108, y: 268, w: 38, h: 15 },
    hand: [127, 298, 21, 23],
    thumb: [146, 290, 8, 11],
    seam: 'M111 292 Q125 300 139 293',
    shine: [118, 291, 6, 8]
  };
  const ARM_R = {
    cap: [mx(ARM_L.cap[0]), ARM_L.cap[1], ARM_L.cap[2]],
    sleeve: mirrorPath(ARM_L.sleeve),
    shade: mirrorPath(ARM_L.shade),
    cuff: { x: mx(ARM_L.cuff.x) - ARM_L.cuff.w, y: ARM_L.cuff.y, w: ARM_L.cuff.w, h: ARM_L.cuff.h },
    hand: [mx(ARM_L.hand[0]), ARM_L.hand[1], ARM_L.hand[2], ARM_L.hand[3]],
    thumb: [mx(ARM_L.thumb[0]), ARM_L.thumb[1], ARM_L.thumb[2], ARM_L.thumb[3]],
    seam: mirrorPath(ARM_L.seam),
    shine: [mx(ARM_L.shine[0]), ARM_L.shine[1], ARM_L.shine[2], ARM_L.shine[3]]
  };
  const Arm = ({ side }) => {
    const a = side === 'l' ? ARM_L : ARM_R;
    return (
      <>
        <circle cx={a.cap[0]} cy={a.cap[1]} r={a.cap[2]} fill={u('w')} />
        <path d={a.sleeve} fill={u('w')} />
        <path d={a.sleeve} fill={u('sl')} />
        <path d={a.shade} fill="none" stroke={BOT.sweaterDk} strokeWidth="3" strokeLinecap="round" opacity=".5" />
        <rect x={a.cuff.x} y={a.cuff.y} width={a.cuff.w} height={a.cuff.h} rx="7" fill={BOT.sweaterDk} />
        <rect x={a.cuff.x} y={a.cuff.y} width={a.cuff.w} height={a.cuff.h} rx="7" fill={u('rib')} />
        <ellipse cx={a.thumb[0]} cy={a.thumb[1]} rx={a.thumb[2]} ry={a.thumb[3]} fill={u('k')} />
        <ellipse cx={a.hand[0]} cy={a.hand[1]} rx={a.hand[2]} ry={a.hand[3]} fill={u('k')} />
        <path d={a.seam} fill="none" stroke={BOT.headDk} strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
        <ellipse cx={a.shine[0]} cy={a.shine[1]} rx={a.shine[2]} ry={a.shine[3]} fill="#fff" opacity=".55" />
      </>
    );
  };

  // Нога: толстая кремовая голень-столбик и массивный кед: синий верх,
  // кремовая подошва, две полоски шнуровки, блик на носке.
  const LEG_L = {
    shin: { x: 152, y: 276, w: 51, h: 86 },
    shoe: 'M136 384 C134 366 147 350 169 350 C191 350 207 364 206 384 Z',
    sole: { x: 133, y: 380, w: 74, h: 11 },
    lace1: 'M152 361 Q169 356 188 361',
    lace2: 'M147 369 Q169 363 194 369',
    toe: [150, 374, 7, 4]
  };
  const LEG_R = {
    shin: { x: mx(LEG_L.shin.x) - LEG_L.shin.w, y: LEG_L.shin.y, w: LEG_L.shin.w, h: LEG_L.shin.h },
    shoe: mirrorPath(LEG_L.shoe),
    sole: { x: mx(LEG_L.sole.x) - LEG_L.sole.w, y: LEG_L.sole.y, w: LEG_L.sole.w, h: LEG_L.sole.h },
    lace1: mirrorPath(LEG_L.lace1),
    lace2: mirrorPath(LEG_L.lace2),
    toe: [mx(LEG_L.toe[0]), LEG_L.toe[1], LEG_L.toe[2], LEG_L.toe[3]]
  };
  const Leg = ({ side }) => {
    const g = side === 'l' ? LEG_L : LEG_R;
    return (
      <>
        <rect x={g.shin.x} y={g.shin.y} width={g.shin.w} height={g.shin.h} rx="20" fill={u('l')} />
        <rect x={g.sole.x} y={g.sole.y} width={g.sole.w} height={g.sole.h} rx="7" fill={BOT.sole} />
        <rect x={g.sole.x} y={g.sole.y} width={g.sole.w} height={g.sole.h} rx="7" fill="none"
          stroke={BOT.headDk} strokeWidth="1.5" opacity=".6" />
        <path d={g.shoe} fill={u('sh2')} />
        <path d={g.lace1} fill="none" stroke={BOT.sole} strokeWidth="3" strokeLinecap="round" />
        <path d={g.lace2} fill="none" stroke={BOT.sole} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx={g.toe[0]} cy={g.toe[1]} rx={g.toe[2]} ry={g.toe[3]} fill="#fff" opacity=".22" />
      </>
    );
  };

  // Рот: все формы на месте, видна одна — её выбирает KODI_CSS по состоянию.
  // Формы — по листу лица: тонкая дуга, полукруг радости, «о», ровная черта,
  // кривая усмешка.
  const MOUTH = (
    <g className="kodi-mouth">
      <path className="kodi-m kodi-m-smile" d="M183 128 Q210 147 237 128" fill="none"
        stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-open" d="M190 127 L230 127 Q230 151 210 151 Q190 151 190 127 Z" fill="var(--accent)" />
      <ellipse className="kodi-m kodi-m-o" cx="210" cy="139" rx="6.5" ry="8" fill="none"
        stroke="var(--accent)" strokeWidth="4.5" />
      <path className="kodi-m kodi-m-flat" d="M196 139 L224 139" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-side" d="M195 141 Q214 143 227 130" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );

  // УХО — медная вставка в боку шлема, а не наушник. Вставка лежит в обтравке
  // шлема: внешний край идёт ровно по силуэту, ухо не выпирает. Внутри — тёмная
  // прорезь и полоска-индикатор речи.
  const Ear = ({ x, side }) => (
    <>
      <rect x={x} y="78" width="16" height="62" rx="8" fill={u('c')} />
      <rect x={x + (side === 'l' ? 7.5 : 3.5)} y="88" width="5" height="42" rx="2.5" fill={u('cup')} />
      <rect className="kodi-ear" x={x + (side === 'l' ? 8.5 : 4.5)} y="92" width="3" height="34" rx="1.5" fill="none"
        stroke="var(--accent)" strokeWidth="2.5" />
    </>
  );

  return (
    <svg className={cls.join(' ')} style={vars} viewBox="20 -70 380 520"
      aria-hidden="true" focusable="false">
      <style>{KODI_CSS}</style>
      <defs>
        {/* шлем: матовый винил — основа, блик сверху слева, тень снизу справа */}
        <linearGradient id={uid + 'h'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCFAF6" />
          <stop offset="55%" stopColor={BOT.head} />
          <stop offset="100%" stopColor={BOT.headMid} />
        </linearGradient>
        <radialGradient id={uid + 'hl'} cx="28%" cy="14%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={uid + 'hs'} cx="78%" cy="100%" r="75%">
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
        <radialGradient id={uid + 's'} cx="210" cy="104" r="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={BOT.visorMid} />
          <stop offset="100%" stopColor={BOT.visor} />
        </radialGradient>
        {/* строки дисплея: тонкие, чтобы не гасить яркость глаз */}
        <pattern id={uid + 'px'} width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 0.5 H3" stroke="#000" strokeWidth=".7" opacity=".2" />
        </pattern>
        {/* свитер: объём сверху вниз, цилиндр рукава слева направо, вязаная резинка */}
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.sweaterLt} />
          <stop offset="100%" stopColor={BOT.sweaterDk} />
        </linearGradient>
        <linearGradient id={uid + 'ws'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity=".3" />
          <stop offset="20%" stopColor="#000" stopOpacity="0" />
          <stop offset="78%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".34" />
        </linearGradient>
        <linearGradient id={uid + 'sl'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity=".14" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <pattern id={uid + 'rib'} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M3 0 V6" stroke={BOT.sweaterLt} strokeWidth="1.6" opacity=".7" />
        </pattern>
        {/* кремовые варежки и голени: скругление светом слева */}
        <linearGradient id={uid + 'k'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCFAF6" />
          <stop offset="60%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        <linearGradient id={uid + 'l'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F9F6F0" />
          <stop offset="55%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        {/* кеды: свет сверху, тень к подошве */}
        <linearGradient id={uid + 'sh2'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.shoe} />
          <stop offset="100%" stopColor={BOT.shoeDk} />
        </linearGradient>
        {/* прорезь уха: тёплая тёмная медь, а не чёрная дыра */}
        <radialGradient id={uid + 'cup'} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#6B4328" />
          <stop offset="100%" stopColor="#2E1C11" />
        </radialGradient>
        <radialGradient id={uid + 'sh'}>
          <stop offset="0%" stopColor={BOT.shadow} stopOpacity="1" />
          <stop offset="100%" stopColor={BOT.shadow} stopOpacity="0" />
        </radialGradient>
        <clipPath id={uid + 'v'}><rect x="132" y="53" width="156" height="107" rx="27" /></clipPath>
        <clipPath id={uid + 'hc'}><rect x="108" y="24" width="204" height="153" rx="62" /></clipPath>
      </defs>

      {/* Мягкая контактная тень: размытый край вместо плоского овала. */}
      <ellipse className="bot-shadow" cx="210" cy="403" rx="100" ry="15" fill={u('sh')} />

      <g className="bot-float">
        <g className="bot-pose-body">
          <g className="bot-beat-body">

            {/* ноги стоят; наклон позы берёт только торс */}
            <Leg side="l" />
            <Leg side="r" />

            {/* Всё, что выше ног, наклоняется от пояса (см. «ОПОРА НА НОГИ» в KODI_CSS). */}
            <g className="kodi-torso">

            {/* свитер: округлые плечи от ворота к рукавам — рукав растёт из плеча, а не
                торчит сбоку. Шеи нет (заказчик, 15.10.2026): верх свитера и ворот уходят
                под шлем, голова стоит прямо на вороте и при наклоне не даёт просвета. */}
            <path d="M112 240 C112 204 158 170 210 170 C262 170 308 204 308 240 C308 250 291 254 284 262 L284 272
                     C284 280 278 284 269 284 L151 284 C142 284 136 280 136 272 L136 262 C129 254 112 250 112 240 Z" fill={u('w')} />
            <path d="M112 240 C112 204 158 170 210 170 C262 170 308 204 308 240 C308 250 291 254 284 262 L284 272
                     C284 280 278 284 269 284 L151 284 C142 284 136 280 136 272 L136 262 C129 254 112 250 112 240 Z" fill={u('ws')} />
            <rect x="137" y="271" width="146" height="13" rx="6.5" fill={BOT.sweaterDk} />
            <rect x="137" y="271" width="146" height="13" rx="6.5" fill={u('rib')} />
            <rect x="176" y="170" width="68" height="16" rx="8" fill={BOT.sweaterDk} />
            <rect x="176" y="170" width="68" height="16" rx="8" fill={u('rib')} />
            <text x="210" y="234" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="17" fill="#F4F1EA" letterSpacing=".5">JUNIOR IT</text>
            <rect x="166" y="240" width="88" height="18" rx="3" fill={BOT.label} />
            <rect x="166" y="240" width="88" height="6" rx="3" fill="#fff" opacity=".14" />
            <text x="210" y="253.5" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="12" fill="#fff" letterSpacing="1">AKADEMIYA</text>

            {/* голова */}
            <g className="bot-pose-head">
              <g className="bot-beat-head">
                {/* шлем — широкий и приземистый */}
                <rect x="108" y="24" width="204" height="153" rx="62" fill={u('h')} />
                <g clipPath={u('hc')}>
                  <rect x="108" y="24" width="204" height="153" fill={u('hs')} />
                  <rect x="108" y="24" width="204" height="153" fill={u('hl')} />
                  {/* уши — вставки в боках шлема, край по силуэту */}
                  <Ear x={104} side="l" />
                  <Ear x={300} side="r" />
                </g>
                <rect x="108" y="24" width="204" height="153" rx="62" fill="none"
                  stroke={BOT.edge} strokeWidth="1.4" opacity=".55" />

                {/* медная рамка экрана — почти во весь шлем; фаска и блик по кромке */}
                <rect x="123" y="44" width="174" height="125" rx="35" fill={u('c')} />
                <rect x="127.5" y="48.5" width="165" height="116" rx="31" fill="none"
                  stroke={BOT.rimDk} strokeWidth="2" opacity=".55" />
                <path d="M150 45 Q210 38 270 45" fill="none" stroke="#FFE2C6" strokeWidth="3"
                  strokeLinecap="round" opacity=".6" />

                {/* экран-лицо */}
                <rect x="132" y="53" width="156" height="107" rx="27" fill={u('s')} />
                <g clipPath={u('v')}>
                  <ellipse className="bot-blush" cx="152" cy="140" rx="12" ry="6" fill={BOT.blush} />
                  <ellipse className="bot-blush" cx="268" cy="140" rx="12" ry="6" fill={BOT.blush} />
                  <g className="bot-pose-eyes">
                    <g className="kodi-gaze">
                      <g className="kodi-blink">
                        <circle className="bot-glow" cx="172" cy="104" r="17" fill="var(--accent)" />
                        <circle className="bot-glow" cx="248" cy="104" r="17" fill="var(--accent)" />
                        {/* глаза — круглые светящиеся точки, как на листе лица */}
                        <circle className="pupil" cx="172" cy="104" r="12.5" fill="var(--accent)" />
                        <circle className="pupil" cx="248" cy="104" r="12.5" fill="var(--accent)" />
                        {/* кольца — удивление */}
                        <circle className="ring" cx="172" cy="104" r="11" fill="none"
                          stroke="var(--accent)" strokeWidth="4.5" />
                        <circle className="ring" cx="248" cy="104" r="11" fill="none"
                          stroke="var(--accent)" strokeWidth="4.5" />
                        {/* звёзды — восторг: пятиконечные, как на листе лица */}
                        <path className="star" fill="var(--accent)"
                          strokeLinejoin="round" stroke="var(--accent)" strokeWidth="2" d="M172.0 90.5 L175.6 100.0 L185.8 100.5 L177.9 106.9 L180.5 116.7 L172.0 111.2 L163.5 116.7 L166.1 106.9 L158.2 100.5 L168.4 100.0 Z" />
                        <path className="star" fill="var(--accent)"
                          strokeLinejoin="round" stroke="var(--accent)" strokeWidth="2" d="M248.0 90.5 L251.6 100.0 L261.8 100.5 L253.9 106.9 L256.5 116.7 L248.0 111.2 L239.5 116.7 L242.1 106.9 L234.2 100.5 L244.4 100.0 Z" />
                        {/* дуги — улыбка глазами */}
                        <path className="arc" d="M160 110 Q172 94 184 110" fill="none"
                          stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
                        <path className="arc" d="M236 110 Q248 94 260 110" fill="none"
                          stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
                      </g>
                    </g>
                  </g>
                  {MOUTH}
                  {/* веки — того же стекла, что экран: в покое их не видно */}
                  <rect className="bot-lid bot-lid-l" x="132" y="-12" width="80" height="90" fill={u('s')} />
                  <rect className="bot-lid bot-lid-r" x="208" y="-12" width="80" height="90" fill={u('s')} />
                  {/* пиксели дисплея и стекло: отражение сверху, блик, пробегающее сияние */}
                  <rect x="132" y="53" width="156" height="107" fill={u('px')} />
                  <path d="M140 62 Q154 54 188 54 L156 104 Q138 96 140 62 Z" fill="#fff" opacity=".07" />
                  <ellipse cx="210" cy="54" rx="66" ry="8" fill="#fff" opacity=".06" />
                  <rect x="143" y="58" width="26" height="5" rx="2.5" fill="#fff" opacity=".2" />
                  <g className="kodi-glare">
                    <path d="M150 40 L176 40 L146 180 L120 180 Z" fill="#fff" opacity=".1" />
                  </g>
                </g>
                <rect x="132" y="53" width="156" height="107" rx="27" fill="none"
                  stroke="#000" strokeWidth="3" opacity=".35" />
              </g>
            </g>

            {/* Искры восторга со сдвигом 140 мс. */}
            <g>
              <Spark x={84} y={60} s={0.5} />
              <Spark x={338} y={40} s={0.42} d={140} />
              <Spark x={112} y={0} s={0.34} d={280} />
              <Spark x={334} y={186} s={0.3} d={420} />
              <Spark x={82} y={200} s={0.38} d={560} />
            </g>

            {/* Руки отстают от тела на 90 мс — это и читается как живое. */}
            <g className="bot-pose-arm-l"><g className="bot-beat-arm-l"><Arm side="l" /></g></g>
            <g className="bot-pose-arm-r"><g className="bot-beat-arm-r"><Arm side="r" /></g></g>

            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
