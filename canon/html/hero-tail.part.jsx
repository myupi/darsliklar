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

/* ОПОРА НА НОГИ. Система движения канона наклоняет корпус целиком, вокруг
   нижней точки фигуры: робот Курса 0 парит, и крен в 24° («любопытство»)
   читается у него как наклон. Коди стоит на ногах — тот же крен валит его
   набок вместе с ногами, будто он падает. Поэтому у Коди наклон позы
   (--bodyRot) берёт только верх — свитер, голову и руки — и идёт от пояса,
   а ноги стоят. Сдвиги и сжатия позы (прыжок, оседание) по-прежнему двигают
   героя целиком. Крен смягчён: от пояса тот же угол выглядел бы поклоном. */
.bot.kodi .bot-pose-body {
  transform: translate(var(--bodyX), var(--bodyY)) scale(var(--bodySX), var(--bodySY)); }
.bot.kodi .kodi-torso { transform-box: view-box; transform-origin: 210px 300px;
  transform: rotate(calc(var(--bodyRot) * .55));
  transition: transform var(--dur) var(--ease); }

/* ПЛЕЧО — ТОЧКА ВРАЩЕНИЯ РУКИ. Канон задаёт её процентами рамки фигуры
   (50% 7%). У группы такта, вложенной в уже повёрнутую руку, браузер считает
   эти проценты не от плеча: в «привет» рука махала вокруг кисти, а плечо
   ездило. Поэтому у Коди точка вращения обеих групп руки — центр плечевого
   шарнира в координатах рисунка. */
.bot.kodi .bot-pose-arm-l, .bot.kodi .bot-beat-arm-l { transform-box: view-box; transform-origin: 143px 226px; }
.bot.kodi .bot-pose-arm-r, .bot.kodi .bot-beat-arm-r { transform-box: view-box; transform-origin: 277px 226px; }
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
// ПРОПОРЦИИ (v2). Рост от макушки до подошвы 366: голова со шлемом 186 (половина
// роста), шея 10, свитер 96, ноги с кедами 90. Ширина шлема 212 (уши внутри
// силуэта), плеч 148.
// Ось симметрии x = 210; пояс (ось наклона торса) y = 300.
//
// Внутри рисунка нет атрибутов transform у групп и фигур с масштабом или
// отражением: канон ставит узлам героя transform-box: fill-box, и такие
// трансформации считались бы от края фигуры. Поэтому правая рука и правая нога
// не зеркалятся атрибутом, а получают отражённые координаты (mirror ниже).
//
// РУКА — ТРУБА ОТ ПЛЕЧА. Канон вращает руку вокруг точки 50% 7% её рамки, то
// есть вокруг верха. Поэтому рука нарисована строго вертикально, плечевой
// шарнир — круг наверху: при любом повороте (до ±158° в позах) рукав остаётся
// рукавом, а шарнир — на плече.
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

  // Рука: шарнир, рукав-труба с вязаной манжетой, варежка с большим пальцем к телу.
  const ARM_L = {
    cap: [143, 226, 16],
    sleeve: 'M128 227 C128 219 135 212 143 212 C151 212 158 219 158 227 L158 274 C158 282 151 288 143 288 C135 288 128 282 128 274 Z',
    shade: 'M153 217 C157 221 158 226 158 232 L158 272 C158 278 155 283 150 286',
    cuff: { x: 127, y: 270, w: 32, h: 13 },
    hand: [143, 301, 17, 19],
    thumb: [157, 294, 7, 9],
    seam: 'M131 292 Q143 298 155 292',
    shine: [136, 295, 5, 7]
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
        <rect x={a.cuff.x} y={a.cuff.y} width={a.cuff.w} height={a.cuff.h} rx="6.5" fill={BOT.sweaterDk} />
        <rect x={a.cuff.x} y={a.cuff.y} width={a.cuff.w} height={a.cuff.h} rx="6.5" fill={u('rib')} />
        <ellipse cx={a.thumb[0]} cy={a.thumb[1]} rx={a.thumb[2]} ry={a.thumb[3]} fill={u('k')} />
        <ellipse cx={a.hand[0]} cy={a.hand[1]} rx={a.hand[2]} ry={a.hand[3]} fill={u('k')} />
        <path d={a.seam} fill="none" stroke={BOT.headDk} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
        <ellipse cx={a.shine[0]} cy={a.shine[1]} rx={a.shine[2]} ry={a.shine[3]} fill="#fff" opacity=".55" />
      </>
    );
  };

  // Нога: кремовая голень и кед с кремовой подошвой и бликом на носке.
  const LEG_L = {
    shin: { x: 168, y: 298, w: 34, h: 62 },
    shoe: 'M160 382 L160 372 C160 357 169 350 185 350 C202 350 211 358 211 372 L211 382 Z',
    sole: { x: 160, y: 378, w: 51, h: 12 },
    lace: 'M166 364 Q185 357 206 364',
    toe: [178, 361, 7, 4]
  };
  const LEG_R = {
    shin: { x: mx(LEG_L.shin.x) - LEG_L.shin.w, y: LEG_L.shin.y, w: LEG_L.shin.w, h: LEG_L.shin.h },
    shoe: mirrorPath(LEG_L.shoe),
    sole: { x: mx(LEG_L.sole.x) - LEG_L.sole.w, y: LEG_L.sole.y, w: LEG_L.sole.w, h: LEG_L.sole.h },
    lace: mirrorPath(LEG_L.lace),
    toe: [mx(LEG_L.toe[0]), LEG_L.toe[1], LEG_L.toe[2], LEG_L.toe[3]]
  };
  const Leg = ({ side }) => {
    const g = side === 'l' ? LEG_L : LEG_R;
    return (
      <>
        <rect x={g.shin.x} y={g.shin.y} width={g.shin.w} height={g.shin.h} rx="15" fill={u('l')} />
        <rect x={g.sole.x} y={g.sole.y} width={g.sole.w} height={g.sole.h} rx="6" fill={BOT.sole} />
        <rect x={g.sole.x} y={g.sole.y} width={g.sole.w} height={g.sole.h} rx="6" fill="none"
          stroke={BOT.headDk} strokeWidth="1.5" opacity=".6" />
        <path d={g.shoe} fill={u('sh2')} />
        <path d={g.lace} fill="none" stroke={BOT.sole} strokeWidth="2.5" strokeLinecap="round" opacity=".55" />
        <ellipse cx={g.toe[0]} cy={g.toe[1]} rx={g.toe[2]} ry={g.toe[3]} fill="#fff" opacity=".28" />
      </>
    );
  };

  // Рот: все формы на месте, видна одна — её выбирает KODI_CSS по состоянию.
  const MOUTH = (
    <g className="kodi-mouth">
      <path className="kodi-m kodi-m-smile" d="M191 143 Q210 160 229 143" fill="none"
        stroke="var(--accent)" strokeWidth="6.5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-open" d="M189 139 Q210 172 231 139 Q210 147 189 139 Z" fill="var(--accent)" />
      <ellipse className="kodi-m kodi-m-o" cx="210" cy="150" rx="7.5" ry="9" fill="none"
        stroke="var(--accent)" strokeWidth="5" />
      <path className="kodi-m kodi-m-flat" d="M197 152 Q210 147 223 152" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-side" d="M195 151 Q213 157 226 144" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );

  // УХО — медная вставка в боку шлема, а не наушник (заказчик, 15.10.2026:
  // дужка и круглые чашки делали Коди роботом в наушниках). Вставка лежит в
  // обтравке шлема, поэтому её внешний край идёт ровно по силуэту и ухо не
  // выпирает. Внутри — тёмная прорезь и полоска-индикатор речи.
  // x — левый край вставки; side — с какой стороны свет.
  const Ear = ({ x, side }) => (
    <>
      <rect x={x} y="94" width="22" height="60" rx="11" fill={u('c')} />
      <rect x={x + 6} y="102" width="10" height="44" rx="5" fill={u('cup')} />
      <rect className="kodi-ear" x={x + 8} y="106" width="6" height="36" rx="3" fill="none"
        stroke="var(--accent)" strokeWidth="2.5" />
      <path d={side === 'l' ? `M${x + 16} 99 Q${x + 19} 104 ${x + 19} 112` : `M${x + 6} 99 Q${x + 3} 104 ${x + 3} 112`}
        fill="none" stroke="#FFE2C6" strokeWidth="2" strokeLinecap="round" opacity=".6" />
    </>
  );

  return (
    <svg className={cls.join(' ')} style={vars} viewBox="20 -70 380 520"
      aria-hidden="true" focusable="false">
      <style>{KODI_CSS}</style>
      <defs>
        {/* голова: матовый винил — основа, блик сверху слева, тень снизу справа */}
        <linearGradient id={uid + 'h'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCFAF6" />
          <stop offset="55%" stopColor={BOT.head} />
          <stop offset="100%" stopColor={BOT.headMid} />
        </linearGradient>
        <radialGradient id={uid + 'hl'} cx="30%" cy="16%" r="46%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={uid + 'hs'} cx="76%" cy="98%" r="72%">
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
        <radialGradient id={uid + 's'} cx="210" cy="118" r="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={BOT.visorMid} />
          <stop offset="100%" stopColor={BOT.visor} />
        </radialGradient>
        {/* строки дисплея: тонкие горизонтальные линии */}
        <pattern id={uid + 'px'} width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 0.5 H3" stroke="#000" strokeWidth="1" opacity=".42" />
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
        {/* прорезь уха: тёплая тёмная медь с бликом, а не чёрная дыра */}
        <radialGradient id={uid + 'cup'} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#6B4328" />
          <stop offset="100%" stopColor="#2E1C11" />
        </radialGradient>
        <radialGradient id={uid + 'sh'}>
          <stop offset="0%" stopColor={BOT.shadow} stopOpacity="1" />
          <stop offset="100%" stopColor={BOT.shadow} stopOpacity="0" />
        </radialGradient>
        <clipPath id={uid + 'v'}><rect x="133" y="70" width="154" height="110" rx="32" /></clipPath>
        <clipPath id={uid + 'hc'}><rect x="104" y="24" width="212" height="186" rx="80" /></clipPath>
      </defs>

      {/* Мягкая контактная тень: размытый край вместо плоского овала. */}
      <ellipse className="bot-shadow" cx="210" cy="404" rx="94" ry="16" fill={u('sh')} />

      <g className="bot-float">
        <g className="bot-pose-body">
          <g className="bot-beat-body">

            {/* ноги стоят; наклон позы берёт только торс */}
            <Leg side="l" />
            <Leg side="r" />

            {/* Всё, что выше ног, наклоняется от пояса (см. «ОПОРА НА НОГИ» в KODI_CSS). */}
            <g className="kodi-torso">

            {/* шея — графитовый цилиндр между шлемом и воротом */}
            <rect x="190" y="198" width="40" height="28" rx="9" fill={BOT.neck} />
            <path d="M197 204 L197 220" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".16" />

            {/* свитер: мягкие плечи, лёгкое сужение к поясу, вязаный подол и ворот */}
            <path d="M136 234 C136 222 148 214 162 214 L258 214 C272 214 284 222 284 234 L286 292
                     C287 303 278 310 266 310 L154 310 C142 310 133 303 134 292 Z" fill={u('w')} />
            <path d="M136 234 C136 222 148 214 162 214 L258 214 C272 214 284 222 284 234 L286 292
                     C287 303 278 310 266 310 L154 310 C142 310 133 303 134 292 Z" fill={u('ws')} />
            <rect x="150" y="296" width="120" height="14" rx="7" fill={BOT.sweaterDk} />
            <rect x="150" y="296" width="120" height="14" rx="7" fill={u('rib')} />
            <rect x="174" y="218" width="72" height="16" rx="8" fill={BOT.sweaterDk} />
            <rect x="174" y="218" width="72" height="16" rx="8" fill={u('rib')} />
            <text x="210" y="256" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="18" fill="#F4F1EA" letterSpacing=".5">JUNIOR IT</text>
            <rect x="168" y="263" width="84" height="19" rx="4" fill={BOT.label} />
            <rect x="168" y="263" width="84" height="7" rx="4" fill="#fff" opacity=".14" />
            <text x="210" y="277" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="12.5" fill="#fff" letterSpacing="1">AKADEMIYA</text>

            {/* голова */}
            <g className="bot-pose-head">
              <g className="bot-beat-head">
                {/* шлем */}
                <rect x="104" y="24" width="212" height="186" rx="80" fill={u('h')} />
                <g clipPath={u('hc')}>
                  <rect x="104" y="24" width="212" height="186" fill={u('hs')} />
                  <rect x="104" y="24" width="212" height="186" fill={u('hl')} />
                  {/* уши — вставки в боках шлема, край по силуэту */}
                  <Ear x={100} side="l" />
                  <Ear x={298} side="r" />
                </g>
                <rect x="104" y="24" width="212" height="186" rx="80" fill="none"
                  stroke={BOT.edge} strokeWidth="1.4" opacity=".55" />

                {/* медная рамка экрана: фаска внутри, блик по верхней кромке */}
                <rect x="124" y="60" width="172" height="130" rx="42" fill={u('c')} />
                <rect x="130" y="66" width="160" height="118" rx="37" fill="none"
                  stroke={BOT.rimDk} strokeWidth="2" opacity=".55" />
                <path d="M148 63 Q210 56 272 63" fill="none" stroke="#FFE2C6" strokeWidth="3"
                  strokeLinecap="round" opacity=".6" />

                {/* экран-лицо */}
                <rect x="133" y="70" width="154" height="110" rx="32" fill={u('s')} />
                <g clipPath={u('v')}>
                  <ellipse className="bot-blush" cx="155" cy="151" rx="14" ry="7" fill={BOT.blush} />
                  <ellipse className="bot-blush" cx="265" cy="151" rx="14" ry="7" fill={BOT.blush} />
                  <g className="bot-pose-eyes">
                    <g className="kodi-gaze">
                      <g className="kodi-blink">
                        <rect className="bot-glow" x="162" y="94" width="36" height="36" rx="12" fill="var(--accent)" />
                        <rect className="bot-glow" x="222" y="94" width="36" height="36" rx="12" fill="var(--accent)" />
                        {/* пиксельные глаза — скруглённые квадраты с бликом стекла */}
                        <rect className="pupil" x="166" y="98" width="28" height="28" rx="9" fill="var(--accent)" />
                        <rect className="pupil" x="226" y="98" width="28" height="28" rx="9" fill="var(--accent)" />
                        <rect className="pupil" x="170" y="102" width="8" height="8" rx="3" fill="#fff" opacity=".55" />
                        <rect className="pupil" x="230" y="102" width="8" height="8" rx="3" fill="#fff" opacity=".55" />
                        {/* кольца — удивление */}
                        <circle className="ring" cx="180" cy="112" r="12" fill="none"
                          stroke="var(--accent)" strokeWidth="6" />
                        <circle className="ring" cx="240" cy="112" r="12" fill="none"
                          stroke="var(--accent)" strokeWidth="6" />
                        {/* звёзды — восторг */}
                        <path className="star" transform="translate(180 112)" fill="var(--accent)"
                          d="M0 -19 C2.4 -6.4 6.4 -2.4 19 0 C6.4 2.4 2.4 6.4 0 19 C-2.4 6.4 -6.4 2.4 -19 0 C-6.4 -2.4 -2.4 -6.4 0 -19 Z" />
                        <path className="star" transform="translate(240 112)" fill="var(--accent)"
                          d="M0 -19 C2.4 -6.4 6.4 -2.4 19 0 C6.4 2.4 2.4 6.4 0 19 C-2.4 6.4 -6.4 2.4 -19 0 C-6.4 -2.4 -2.4 -6.4 0 -19 Z" />
                        {/* дуги — улыбка глазами */}
                        <path className="arc" d="M165 119 Q180 100 195 119" fill="none"
                          stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                        <path className="arc" d="M225 119 Q240 100 255 119" fill="none"
                          stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                      </g>
                    </g>
                  </g>
                  {MOUTH}
                  {/* веки — того же стекла, что экран: в покое их не видно */}
                  <rect className="bot-lid bot-lid-l" x="132" y="2" width="80" height="93" fill={u('s')} />
                  <rect className="bot-lid bot-lid-r" x="208" y="2" width="80" height="93" fill={u('s')} />
                  {/* строки дисплея и стекло: отражение сверху, блик, пробегающее сияние */}
                  <rect x="133" y="70" width="154" height="110" fill={u('px')} />
                  <path d="M142 80 Q156 72 188 72 L158 124 Q140 114 142 80 Z" fill="#fff" opacity=".07" />
                  <ellipse cx="210" cy="72" rx="70" ry="9" fill="#fff" opacity=".06" />
                  <rect x="146" y="78" width="26" height="6" rx="3" fill="#fff" opacity=".22" />
                  <g className="kodi-glare">
                    <path d="M150 60 L176 60 L146 200 L120 200 Z" fill="#fff" opacity=".1" />
                  </g>
                </g>
                <rect x="133" y="70" width="154" height="110" rx="32" fill="none"
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
      </g>
    </svg>
  );
}
