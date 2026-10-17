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

// ─────────────────────────────────────────────────────────────────────────────
// КОДИ v4 — ТОЛЬКО ГОЛОВА В КРУГЕ (заказчик, 17.10.2026)
//
// «Пусть у Коди остаётся только голова, все эмоции показывает лицо. Голову —
// внутрь кружка, а вокруг кружка, пока он говорит, — волны, как у Алисы и
// Siri, всегда хаотичные. Больше места — контенту, а не роботу».
//   · тела, рук и ног больше нет: строка героя в уроке стала ниже вдвое;
//   · эмоция — только лицо: глаза (точки, дуги, звёзды, кольца), веки, рот,
//     румянец и цвет свечения экрана берутся из той же системы поз канона;
//     голова в круге не качается и не прыгает;
//   · кружок — белый (заказчик, 17.10.2026: «фон головы — белый»); голова
//     занимает 90%;
//   · волны голоса — три полупрозрачных оранжевых контура за кружком, цвет
//     интерфейса курса (заказчик: «волны — оранжевые, как основной цвет»). Пока
//     звучит голос, их форма, размах и вращение меняются случайно, «по
//     слогам» (KodiWaves); замолчал — волны прячутся за кружок;
//   · не стоит без дела (заказчик: «не как АФК»): если ученик ничего не
//     делает, а Коди молчит, лицо само меняет выражение — улыбается,
//     задумывается, оглядывается, удивляется, а потом задрёмывает (useKodiMood).
//     Голоса при этом нет.
// ─────────────────────────────────────────────────────────────────────────────

// ЖИЗНЬ ЛИЦА — собственный слой Коди поверх системы поз канона.
// Классы состояний (eyes-*, loop-*, is-talking, no-blink) ставит RobotSVG,
// поэтому слой знает, что сейчас чувствует герой, не спрашивая экран.
// Все циклы медленнее 3 Гц; пауза урока и «меньше движения» их останавливают.
const KODI_CSS = `
.kodi-av { position: relative; display: block; width: 100%; aspect-ratio: 1 / 1; }
.kodi-disc { position: absolute; inset: 0; border-radius: 50%; overflow: hidden;
  background: radial-gradient(circle at 50% 28%, #FFFFFF 0%, #FFFFFF 58%, #F3F0EA 100%);
  box-shadow: inset 0 0 0 1.5px rgba(28,36,51,.08), 0 8px 18px -10px rgba(28,36,51,.45); }
.kodi-disc > .bot { position: absolute; inset: 0; display: block; width: 100%; height: 100%; overflow: visible; }
/* Волны голоса: за кружком, шире его на треть с каждой стороны. */
.kodi-waves { position: absolute; left: -30%; top: -30%; width: 160%; height: 160%;
  overflow: visible; pointer-events: none; }
.kodi-wave { opacity: .34; }
.kodi-wave-2 { opacity: .42; }
.kodi-wave-3 { opacity: .5; }
/* Тонкое оранжевое кольцо — пока звучит голос, и при «меньше движения»
   оно одно показывает, что Коди говорит. */
.kodi-ring { fill: none; stroke: #FF4F28; stroke-width: 2.2; opacity: 0; transition: opacity .3s ease; }
.kodi-av.is-talking .kodi-ring { opacity: .7; }

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

.speaker-av .kodi-av { transition: transform .22s cubic-bezier(.34,1.56,.64,1); }
.speaker-av:active .kodi-av { transform: scale(.93); }

@media (prefers-reduced-motion: reduce) {
  .kodi .kodi-gaze, .kodi .kodi-blink, .kodi .kodi-glare,
  .kodi.is-talking .kodi-mouth, .kodi.is-talking .kodi-ear { animation: none !important; }
  .kodi .kodi-glare { display: none; }
}
`;

// Градиенты и обтравка объявляются внутри каждого экземпляра, поэтому им нужны
// разные имена: на экране бывает два Коди сразу (в строке героя и в шапке).
let _botUid = 0;

// ВОЛНЫ ГОЛОСА — как у Алисы и Siri, всегда хаотичные. Три оранжевых контура вокруг
// кружка: радиус каждого — сумма трёх синусоид с разным числом горбов. Пока
// звучит голос, через случайные 90–320 мс («слог») меняются громкость, вес и
// число горбов синусоид и направление их бега; слои ещё и вращаются с разной
// скоростью — рисунок не повторяется. Замолчал — волны плавно уходят за кружок
// и цикл засыпает. Атрибуты пишутся прямо в узлы, React кадры не
// перерисовывает. «Меньше движения» — волн нет, о голосе говорит кольцо.
const kodiCalm = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// amp — множитель размаха: у маленького кружка в шапке телефона волны крупнее,
// иначе их не разглядеть.
function KodiWaves({ on, amp = 1 }) {
  const ref = useRef(null);
  const onRef = useRef(on);
  onRef.current = on;
  const ampRef = useRef(amp);
  ampRef.current = amp;
  const kick = useRef(() => {});
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    const R = 50, N = 36, TAU = Math.PI * 2;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const layers = Array.prototype.slice.call(svg.querySelectorAll('.kodi-wave')).map((p, i) => ({
      p, rot: rnd(0, TAU), spin: rnd(-0.6, 0.6), gain: [1, 0.86, 0.94][i] || 0.8,
      comps: [0, 1, 2].map(() => {
        const sp = rnd(0.8, 2.6) * (Math.random() < 0.5 ? -1 : 1);
        return { k: 2 + Math.floor(rnd(0, 5)), ph: rnd(0, TAU), sp, v: sp, a: 0, at: rnd(0.3, 1), swap: false };
      })
    }));
    const f1 = (v) => v.toFixed(1);
    const draw = (l, amp) => {
      const pts = [];
      for (let j = 0; j < N; j += 1) {
        const t = (j / N) * TAU;
        let sum = 0, w = 0;
        l.comps.forEach((c) => { sum += c.a * Math.sin(c.k * t + c.ph); w += c.a; });
        const f = 0.5 + 0.5 * (sum / Math.max(w, 0.5));   // без деления на почти ноль, когда гармоники гаснут
        const r = R - 1 + amp * (0.15 + 0.85 * f);
        pts.push([r * Math.cos(t + l.rot), r * Math.sin(t + l.rot)]);
      }
      let d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
      for (let j = 0; j < N; j += 1) {
        const p0 = pts[(j + N - 1) % N], p1 = pts[j], p2 = pts[(j + 1) % N], p3 = pts[(j + 2) % N];
        d += 'C' + f1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f1(p1[1] + (p2[1] - p0[1]) / 6) + ' '
          + f1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
      }
      l.p.setAttribute('d', d + 'Z');
    };
    // ПЛАВНОСТЬ (заказчик, 17.10.2026: «волны как будто дёргаются»). Рывки
    // давали три вещи: цель размаха менялась каждые 0,1–0,3 с и догонялась за
    // 0,07 с; число горбов (k) у гармоники менялось мгновенно; направление бега
    // разворачивалось на месте. Теперь размах идёт через два сглаживания, k
    // меняется только у затухшей гармоники (swap: гаснет — меняется —
    // разгорается), скорость бега (v) плавно догоняет новую (sp).
    let energy = 0, ease = 0, target = 0, nextAt = 0, last = 0, raf = 0;
    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const talking = !!onRef.current;
      if (now >= nextAt) {
        target = talking ? rnd(0.45, 1) : 0;
        nextAt = now + rnd(260, 560);
        layers.forEach((l) => l.comps.forEach((c) => {
          if (!c.swap) c.at = rnd(0.25, 1);
          if (!c.swap && Math.random() < 0.18) { c.swap = true; c.at = 0; }
          if (Math.random() < 0.15) c.sp = -c.sp;
        }));
      }
      const follow = (x, to, tau) => x + (to - x) * (1 - Math.exp(-dt / tau));
      ease = follow(ease, target, target > ease ? 0.18 : 0.32);
      energy = follow(energy, ease, 0.12);
      // Кружок спрятан (голос в шапке, клавиатура) — считаем, но не рисуем.
      const shown = svg.getClientRects().length > 0;
      layers.forEach((l) => {
        l.rot += l.spin * dt * (0.4 + 1.6 * energy);
        l.comps.forEach((c) => {
          c.v = follow(c.v, c.sp, 0.7);
          c.ph += c.v * dt * (0.6 + 2.4 * energy);
          c.a = follow(c.a, c.at, 0.35);
          if (c.swap && c.a < 0.03) { c.k = 2 + Math.floor(rnd(0, 5)); c.swap = false; c.at = rnd(0.25, 1); }
        });
        if (shown) draw(l, 26 * ampRef.current * energy * l.gain);
      });
      if (!talking && energy < 0.004) { raf = 0; last = 0; layers.forEach((l) => draw(l, 0)); return; }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && !kodiCalm()) { last = 0; raf = requestAnimationFrame(tick); } };
    kick.current = start;
    layers.forEach((l) => draw(l, 0));
    start();
    return () => { cancelAnimationFrame(raf); raf = 0; kick.current = () => {}; };
  }, []);
  useEffect(() => { if (on) kick.current(); }, [on]);
  return (
    <svg ref={ref} className="kodi-waves" viewBox="-80 -80 160 160" aria-hidden="true" focusable="false">
      <path className="kodi-wave kodi-wave-1" fill="#FFB08F" />
      <path className="kodi-wave kodi-wave-2" fill="#FF8A65" />
      <path className="kodi-wave kodi-wave-3" fill="#FF4F28" />
      <circle className="kodi-ring" cx="0" cy="0" r="51.5" />
    </svg>
  );
}

// ЖИВОЙ, КОГДА УЧЕНИК НИЧЕГО НЕ ДЕЛАЕТ (заказчик, 17.10.2026): «пусть не стоит
// как АФК — проявляет эмоции, но не говорит, это показывает лицо». Через 5 с
// без касаний, пока Коди молчит, лицо само меняет выражение: подержал 2–3 с —
// вернулся к обычному — через 1,5–3 с следующее (не то же, что было). Через
// 30 с без касаний Коди задрёмывает (веки опускаются), а касание его будит —
// на миг «ого!». Любое касание, клавиша или ввод сразу возвращает лицо реплики.
// Отсчёт касаний общий на урок; позы — те же, что у реплик, но только лицо.
const KODI_IDLE_MS = 5000;
const KODI_SLEEPY_MS = 30000;
const KODI_MOODS = [
  { pose: 'smile', w: 3 },
  { pose: 'curious', w: 3 },
  { pose: 'explain', vars: { eyeX: -9, eyeY: 1 }, w: 3 },     // оглядывается влево
  { pose: 'explain', vars: { eyeX: 9, eyeY: -3 }, w: 3 },     // и вправо-вверх
  { pose: 'think', w: 2 },
  { pose: 'wonder', w: 1 },
  { pose: 'shy', w: 1 }
];
// Дрёма — глаза полуприкрыты, но видны (веко на 22 закрывало их целиком).
const KODI_DROWSY = { pose: 'rule', vars: { lidY: 10, eyeSY: 0.72, glow: 0.45 }, sleepy: true };
const KODI_WAKE = { pose: 'wonder' };
const _kodiAct = { t: Date.now(), subs: new Set(), on: false };
function kodiActInit() {
  if (_kodiAct.on || typeof window === 'undefined') return;
  _kodiAct.on = true;
  const f = () => { _kodiAct.t = Date.now(); _kodiAct.subs.forEach((g) => g()); };
  ['pointerdown', 'keydown', 'input', 'wheel'].forEach((e) => window.addEventListener(e, f, true));
}
function useKodiMood(talking) {
  const [mood, setMood] = useState(null);
  useEffect(() => {
    kodiActInit();
    if (talking) { setMood(null); return undefined; }
    const quietFrom = Date.now();
    let t = null;
    let last = -1;
    let cur = null;
    const show = (m) => { cur = m; setMood(m); };
    const pickMood = () => {
      const total = KODI_MOODS.reduce((a, m, i) => a + (i === last ? 0 : m.w), 0);
      let r = Math.random() * total;
      for (let i = 0; i < KODI_MOODS.length; i += 1) {
        if (i === last) continue;
        r -= KODI_MOODS[i].w;
        if (r <= 0) { last = i; return KODI_MOODS[i]; }
      }
      last = 0;
      return KODI_MOODS[0];
    };
    const tick = () => {
      const idle = Date.now() - Math.max(_kodiAct.t, quietFrom);
      if (idle < KODI_IDLE_MS) { show(null); t = setTimeout(tick, KODI_IDLE_MS - idle + 50); return; }
      if (idle >= KODI_SLEEPY_MS) { show(KODI_DROWSY); t = setTimeout(tick, 3000); return; }
      if (cur) { show(null); t = setTimeout(tick, 1500 + Math.random() * 1500); return; }
      show(pickMood());
      t = setTimeout(tick, 2200 + Math.random() * 1200);
    };
    const wake = () => {
      clearTimeout(t);
      if (cur && cur.sleepy) { show(KODI_WAKE); t = setTimeout(tick, 900); return; }
      show(null);
      t = setTimeout(tick, KODI_IDLE_MS + 50);
    };
    _kodiAct.subs.add(wake);
    t = setTimeout(tick, KODI_IDLE_MS + 50);
    return () => { clearTimeout(t); _kodiAct.subs.delete(wake); };
  }, [talking]);
  return talking ? null : mood;
}

// ─────────────────────────────────────────────────────────────────────────────
// КОДИ. Имя компонента RobotSVG оставлено каноническим: его зовут
// PersonaBubble, голос в шапке, прощание и типовые экраны.
//
// Рисунок головы — тот же, что у Коди v3 (шлем 204 × 153, медная рамка, экран-
// лицо, уши-вставки; ось x = 210, центр шлема y = 100.5). Рамка головы —
// квадрат 227 вокруг центра шлема: шлем занимает 90% кружка.
// Позы канона двигают здесь только лицо: взгляд и размер глаз (eyeX/eyeY/
// eyeSX/eyeSY), веки, румянец, свечение и его цвет, форму глаз и рта.
// Корпус, руки и голова больше не двигаются — их нет.
//
// Внутри рисунка нет атрибутов transform у групп и фигур с масштабом или
// отражением: канон ставит узлам героя transform-box: fill-box.
// ─────────────────────────────────────────────────────────────────────────────
const LID_LIFT = 12;

function RobotSVG({ pose = 'explain', className, talking, waveAmp }) {
  const audio = useAudio();
  const isTalking = talking !== undefined ? !!talking : !!(audio && audio.playing);
  // Ученик ничего не делает — лицо живёт само (useKodiMood), без голоса.
  const mood = useKodiMood(isTalking);
  const key = mood ? mood.pose : (POSE_SET[pose] ? pose : 'explain');
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  const P = Object.assign({}, S.pose, mood && mood.vars);
  // Веки Коди висят на 12 выше глаз, чтобы их край не срезал свечение глаз в
  // покое; опущенное веко проходит на те же 12 дальше — выражение не меняется.
  if (P.lidY > 0) P.lidY += LID_LIFT;
  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': KODI_GLOW[S.accent] || S.accent };
  Object.keys(P).forEach((k) => { vars['--' + k] = P[k] + (POSE_UNIT[k] || ''); });

  const cls = ['bot', 'kodi', 'eyes-' + S.eyes, S.loop];
  if (S.noBlink) cls.push('no-blink');
  if (isTalking) cls.push('is-talking');

  const u = (id) => `url(#${uid}${id})`;

  // Рот: все формы на месте, видна одна — её выбирает KODI_CSS по состоянию.
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

  // УХО — медная вставка в боку шлема: тёмная прорезь и полоска-индикатор речи.
  const Ear = ({ x, side }) => (
    <>
      <rect x={x} y="78" width="16" height="62" rx="8" fill={u('c')} />
      <rect x={x + (side === 'l' ? 7.5 : 3.5)} y="88" width="5" height="42" rx="2.5" fill={u('cup')} />
      <rect className="kodi-ear" x={x + (side === 'l' ? 8.5 : 4.5)} y="92" width="3" height="34" rx="1.5" fill="none"
        stroke="var(--accent)" strokeWidth="2.5" />
    </>
  );

  return (
    <span className={'kodi-av' + (isTalking ? ' is-talking' : '') + (className ? ' ' + className : '')} style={vars}>
      <style>{KODI_CSS}</style>
      <KodiWaves on={isTalking} amp={waveAmp || 1} />
      <span className="kodi-disc">
        <svg className={cls.join(' ')} viewBox="96.5 -13 227 227" aria-hidden="true" focusable="false">
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
            {/* прорезь уха: тёплая тёмная медь, а не чёрная дыра */}
            <radialGradient id={uid + 'cup'} cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#6B4328" />
              <stop offset="100%" stopColor="#2E1C11" />
            </radialGradient>
            <clipPath id={uid + 'v'}><rect x="132" y="53" width="156" height="107" rx="27" /></clipPath>
            <clipPath id={uid + 'hc'}><rect x="108" y="24" width="204" height="153" rx="62" /></clipPath>
          </defs>

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
        </svg>
      </span>
    </span>
  );
}
