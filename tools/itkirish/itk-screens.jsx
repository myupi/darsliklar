// =============================================================================
// ЭКРАНЫ ВВОДНОГО УРОКА «IT ga kirish», версия 2 (25.11.2026). Заказчик о версии 1: «урок в начале вообще не цепляющий…
// слайдов дофига, слайды скучные»; о шести играх без вступления: «нет ни приветствия… мы должны открыть путь к айти,
// объяснить ему что это, дать пощупать, заинтересовать». Восемь слайдов: приветствие и дверь в мир IT, «что такое IT»
// на нажатиях, код внутри приложений, сломанная игра, робот (разгадка), «какой ты программист», первая программа,
// итог со значком.
// Значки — свои SVG (без эмодзи и чужих логотипов), оформление только светлое.
// =============================================================================

// ── Значки (свой рисунок, линии 24×24) ──
const ITK_PATHS = {
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12zM9 12h.01M12 12h.01M15 12h.01',
  video: 'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zM10 9l5 3-5 3z',
  taxi: 'M5 16h14M6 16V11l2-5h8l2 5v5M5 11h14M8 19v-2M16 19v-2M10 3h4M7.5 13.5h.01M16.5 13.5h.01',
  game: 'M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.3 1.9L15.5 14h-7l-1.2 1.9A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z',
  camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  web: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z',
  ai: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1',
  design: 'M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 21zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01M17 11h.01',
  apple: 'M12 7c-2-2-6-1.5-6.5 3S7 20 9.5 20c1 0 1.5-.6 2.5-.6s1.5.6 2.5.6C17 20 18.5 14 18.5 10S14 5 12 7zM12 7c0-2 1-3.5 3-4',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16',
  robot: 'M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM12 8V4M12 4h.01M9 13h.01M15 13h.01M9 17h6',
  play: 'M7 4l13 8-13 8z',
  check: 'M5 12.5l4.5 4.5L19 7',
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5',
  text: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  photo: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6',
  pin: 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  laptop: 'M5 5h14v10H5zM3 19h18l-2-4H5z',
  wifi: 'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',
  apps: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  save: 'M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
};
function ItkIco({ k, size }) {
  return (
    <svg className="itk-ico" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ITK_PATHS[k] || ''} />
    </svg>
  );
}
const APP_C = { chat: '#0EA5E9', video: '#EF4444', taxi: '#EAB308', game: '#8B5CF6', music: '#10B981', camera: '#64748B' };

// Задание: промах — своя причина; второй промах подряд — следующая ступень подсказки.
function useActTask(hints0) {
  const lad = useKzLadder(true);
  const [msg, setMsg] = useState(null);
  const st = useRef({ tries: 0, misses: 0 });
  return {
    lad, msg, st, setMsg,
    miss: (m, sayNow) => { st.current.tries += 1; st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); },
    hit: () => { st.current.tries += 1; setMsg(null); },
    fresh: () => { st.current.misses = 0; setMsg(null); lad.reset(); },
    now: (h) => msg || hintAt(lad.lv, h || hints0),
    next: (h) => hintAt(Math.min(3, lad.lv + 1), h || hints0)
  };
}
const logOf = (T, id, type, extra) => Object.assign({ screenId: id, type: type, correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv }, extra || {});
const nav = (p, canGo) => navOf(p, canGo);

// Робот-герой игр (свой рисунок): антенна, лицо-экран, глаза смотрят по ходу движения; ноги (бегун) или гусеница
// (робот на поле). hurt — глаза крестиком.
function ItkBot({ face, hurt, legs }) {
  const d = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }[face] || [1, 0];
  const ex = d[0] * 1.4, ey = d[1] * 1.4;
  return (
    <svg className="itk-bot-svg" viewBox="0 0 40 44" aria-hidden="true">
      <line x1="20" y1="3.5" x2="20" y2="9.5" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" />
      <circle className="itk-ant" cx="20" cy="3.6" r="2.9" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
      {legs ? (
        <g fill="#C2410C"><rect className="itk-leg is-l" x="11" y="29" width="6.5" height="12" rx="3.2" /><rect className="itk-leg is-r" x="22.5" y="29" width="6.5" height="12" rx="3.2" /></g>
      ) : (
        <g><rect x="6" y="32" width="28" height="9" rx="4.5" fill="#475569" /><circle cx="11" cy="36.5" r="2" fill="#CBD5E1" /><circle cx="20" cy="36.5" r="2" fill="#CBD5E1" /><circle cx="29" cy="36.5" r="2" fill="#CBD5E1" /></g>
      )}
      <rect x="5" y="9" width="30" height="24" rx="9" fill="#FA4F28" />
      <rect x="5" y="25" width="30" height="8" rx="4" fill="#E2401C" />
      <rect x="9.5" y="12.5" width="21" height="13.5" rx="5.5" fill="#fff" />
      {hurt ? (
        <path d="M13.5 16.5l4 4M17.5 16.5l-4 4M22.5 16.5l4 4M26.5 16.5l-4 4" stroke="#1B1F2E" strokeWidth="1.9" strokeLinecap="round" />
      ) : (
        <g fill="#1B1F2E"><circle cx={15.8 + ex} cy={19.2 + ey} r="2.5" /><circle cx={24.2 + ex} cy={19.2 + ey} r="2.5" /><circle cx={16.6 + ex} cy={18.3 + ey} r=".8" fill="#fff" /><circle cx={25 + ex} cy={18.3 + ey} r=".8" fill="#fff" /></g>
      )}
      <circle cx="9" cy="23" r="1.6" fill="#FDBA9F" opacity=".8" /><circle cx="31" cy="23" r="1.6" fill="#FDBA9F" opacity=".8" />
    </svg>
  );
}
const ItkApple = () => (
  <svg className="itk-apple-svg" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 7c-2-2-6.2-1.5-6.7 3S7 20.5 9.5 20.5c1 0 1.5-.6 2.5-.6s1.5.6 2.5.6C17 20.5 18.7 14 18.7 10S14 5 12 7z" fill="#EF4444" />
    <path d="M12 7c-2-2-6.2-1.5-6.7 3-.2 1.8.3 4.3 1.2 6.4C7.4 12 9 8.4 12 7z" fill="#DC2626" />
    <path d="M12 7.2c0-2 .8-3.6 2.6-4.4" stroke="#7C2D12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M13.6 5.6c1.4-1.9 4-1.8 4.6-1-.9 1.6-3.1 2-4.6 1z" fill="#22C55E" />
    <ellipse cx="9.4" cy="10.8" rx="1.2" ry="2.1" fill="#fff" opacity=".6" />
  </svg>
);
// Дальние холмы и ближние деревья игры — свой рисунок, слой шире сцены (едет при беге).
const HILLS = 'M0 40V27Q12 12 26 21T52 17T80 22T108 13T136 21T164 15T200 20V40Z';
const TREES = [8, 27, 41, 63, 82, 101, 118, 139, 157, 176, 192];

// Подсветка короткой строки кода: if — слово языка, имя перед «(» — функция, числа и строки — свои цвета.
function CodeLine({ text }) {
  const parts = text.split(/(\bif\b|\blet\b|"[^"]*"|\b\d+\b|\.?[A-Za-z]+(?=\())/g).filter((s) => s !== '');
  return (
    <>{parts.map((s, i) => {
      const cls = s === 'if' || s === 'let' ? 'k' : /^"/.test(s) ? 's' : /^\d+$/.test(s) ? 'n' : /^\.?[A-Za-z]+$/.test(s) && text.charAt(text.indexOf(s) + s.length) === '(' ? 'f' : '';
      return cls ? <b key={i} className={cls}>{s}</b> : <span key={i}>{s}</span>;
    })}</>
  );
}

// =============================================================================
// S1. ПРИВЕТСТВИЕ — Коди здоровается; в центре дверь «IT». Нажатие — дверь распахивается, из неё вылетают части мира
// IT (игры, сайты, приложения, роботы, ИИ, видео) и встают кругом. Коди: что ученик сегодня сделает.
// =============================================================================
// Звёздочки вокруг двери: x, y в процентах сцены, задержка мерцания.
const STARS = [[14, 16, 0], [84, 12, .6], [92, 46, 1.2], [8, 58, .3], [20, 88, .9], [80, 86, 1.5], [50, 4, 1.8], [64, 30, 2.1]];
const WORLD = [['game', '#8B5CF6'], ['web', '#FA4F28'], ['phone', '#0EA5E9'], ['robot', '#64748B'], ['ai', '#10B981'], ['video', '#EF4444']];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const log = useLog();
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [open, setOpen] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.wow : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tap = () => {
    if (!canTap || open) return;
    sfx('win', true); setOpen(true); put({ done: true });
    log({ screenId: 's1', type: 'welcome', correct: true, firstTry: true, attempts: 1, hints: 0, depth: 0 });
    sayNow(c.wow, 'celebrate');
  };
  const ask = open ? c.askDone : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene itk-scene itk-welcome">
          <div className={'itk-world' + (open ? ' is-open' : '')}>
            <i className="itk-w-bg" aria-hidden="true" />
            <i className="itk-rays" aria-hidden="true" />
            <i className="itk-orbit" aria-hidden="true" />
            {STARS.map(([x, y, d], i) => <i key={i} className="itk-star" style={{ left: x + '%', top: y + '%', '--d': d + 's' }} aria-hidden="true" />)}
            {WORLD.map(([k, col], i) => {
              const a = -Math.PI / 2 + (i * Math.PI * 2) / WORLD.length;
              return (
                <span key={k} className="itk-wi" style={{ '--c': col, '--x': (Math.cos(a) * 36).toFixed(1) + '%', '--y': (Math.sin(a) * 39).toFixed(1) + '%', '--d': i * 110 + 'ms', '--f': (i * 0.37).toFixed(2) + 's' }}>
                  <i><ItkIco k={k} size={24} /></i><b>{pick(c.items[k])}</b>
                </span>
              );
            })}
            <i className="itk-stepstone" aria-hidden="true" />
            <button type="button" data-v="door" className={'itk-door' + (canTap && !open ? ' is-led' : '')} disabled={!canTap && !open} onClick={tap} aria-label={pick(c.ask)}>
              <span className="itk-door-in"><i /><b>{pick(c.world)}</b></span>
              <span className="itk-door-panel"><em className="is-a" /><em className="is-b" /><b>IT</b><i /></span>
            </button>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. «ЧТО ТАКОЕ IT» — две большие буквы. I — виды информации, T — технологии. Когда открыты обе и Коди сводит их
// вместе, фото летит с телефона на телефон и загораются «хранит, передаёт, показывает»: IT = информационные технологии.
// =============================================================================
const KIND_IC = { I: ['text', 'photo', 'video', 'mic', 'pin'], T: ['phone', 'laptop', 'wifi', 'apps'] };
const KIND_C = { I: ['#0EA5E9', '#EC4899', '#EF4444', '#8B5CF6', '#10B981'], T: ['#FA4F28', '#334155', '#0EA5E9', '#F59E0B'] };
const ACT_IC = ['save', 'wifi', 'eye'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const log = useLog();
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? ['I', 'T'] : []);
  const [act, setAct] = useState(solved ? 3 : -1);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  // Показ «фото летит» идёт вместе с репликой-итогом Коди.
  useEffect(() => {
    if (act >= 0 || speaker.text !== c.ok) return;
    [0, 900, 2200, 3800].forEach((t, i) => tm.current.push(setTimeout(() => { setAct(i); if (i) sfx('pop', true); }, t)));
  }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  const tap = (k) => {
    if (!canTap || got.includes(k)) return;
    sfx('pop', true);
    const next = got.concat(k);
    setGot(next);
    sayNow(k === 'I' ? c.sayI : c.sayT, 'point');
    if (next.length === 2 && !solved) {
      put({ done: true });
      log({ screenId: 's2', type: 'it-letters', correct: true, firstTry: true, attempts: 2, hints: 0, depth: 0 });
      say(c.ok, 'cheer');
    }
  };
  const ask = got.length === 2 ? c.askDone : got.length ? c.more : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene itk-scene itk-what">
          <div className={'itk-lets' + (got.length === 2 ? ' is-both' : '')}>
            {['I', 'T'].map((k, ki) => {
              const on = got.includes(k);
              return (
                <div key={k} className={'itk-let-col is-' + k + (on ? ' is-on' : '')}>
                  <button type="button" data-v={'let-' + k} className={'itk-let' + (canTap && !on ? ' is-led' : '')} disabled={!canTap && !on} onClick={() => tap(k)}>
                    <b>{k}</b><em translate="no">{k === 'I' ? 'Information' : 'Technology'}</em>
                    <small>{on ? pick(c[k].word) : '?'}</small>
                  </button>
                  <div className="itk-bubbles">
                    {KIND_IC[k].map((ic, i) => (
                      <span key={ic} className={'itk-bub' + (on ? ' is-on' : '')} style={{ '--c': KIND_C[k][i], '--d': i * 110 + 'ms', '--sx': (ki ? -1 : 1) * (30 + i * 8) + 'px' }}>
                        <i><ItkIco k={ic} size={20} /></i><b>{pick(c[k].kinds[i])}</b>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <span className="itk-plus" aria-hidden="true">{got.length === 2 ? '=' : '+'}</span>
          </div>
          <div className={'itk-sendrow is-a' + Math.max(0, act) + (act >= 0 ? ' is-on' : '')}>
            <div className="itk-send3">
              <svg className="itk-arc" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path d="M48 62 Q150 -14 252 62" /></svg>
              <span className="itk-wifi" aria-hidden="true"><ItkIco k="wifi" size={22} /></span>
              <span className={'itk-ph is-l' + (act >= 1 ? ' is-on' : '')}><i className="itk-pic" />{act >= 1 ? <em><ItkIco k="check" size={12} /></em> : null}</span>
              <span className={'itk-ph is-r' + (act >= 3 ? ' is-on' : '')}>{act >= 3 ? <i className="itk-pic kz-a-drop" /> : null}{act >= 3 ? <em className="is-heart">♥</em> : null}</span>
              <span className={'itk-flyx' + (act >= 2 ? ' is-fly' : '')} aria-hidden="true"><i className="itk-flyy"><i className="itk-pic" /></i></span>
            </div>
            <div className="itk-acts2">{c.acts.map((x, i) => <span key={i} className={act > i ? 'is-on' : ''}><ItkIco k={ACT_IC[i]} size={16} />{pick(x)}</span>)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ИГРА «СЛОМАННАЯ ИГРА» — бегун врезается в стену сразу, как открылся экран. В коде одно число — высота прыжка;
// ученик меняет его кнопками «−» / «+», пунктир показывает высоту прыжка, «Играть» — забег. Два уровня: стена 4, потом 7.
// Ниже стены — «бум», ровно со стену — задел ногой. После второго уровня — «это и есть программирование» и загадка
// Коди: «компьютер думает сам, просто ленится».
// =============================================================================
const RUN_LV = [{ wall: 4, j0: 2 }, { wall: 7, j0: 3 }];
// Сцена в процентах: стена едет справа налево за T мс; герой слева; прыжок длиной D мс с плоской вершиной; U — шаг
// высоты (один кирпич), G — земля.
const RG = { T: 2600, X0: 104, X1: -14, HX: 16, HW: 11, WW: 9, D: 1100, U: 5.2, G: 14, J_MAX: 12 };
function runFrame(t, j, wall) {
  const v = (RG.X0 - RG.X1) / RG.T;
  const wx = RG.X0 - v * Math.min(t, RG.T);
  const tc = (RG.X0 - (RG.HX + RG.HW / 2 - RG.WW / 2)) / v;
  const pr = (t - (tc - RG.D / 2)) / RG.D;
  const y = pr > 0 && pr < 1 ? j * (1 - Math.pow(2 * pr - 1, 4)) : 0;
  const over = wx < RG.HX + RG.HW && wx + RG.WW > RG.HX;
  return { wx, y, hit: over && y < wall };
}
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const log = useLog();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [lv, setLv] = useState(solved ? 1 : 0);
  const [j, setJ] = useState(solved ? rec.j : RUN_LV[0].j0);
  const [ph, setPh] = useState('idle');
  const [fr, setFr] = useState({ wx: 62, y: 0 });
  const [coins, setCoins] = useState(solved ? 20 : 0);
  const T = useActTask(c.hints);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const raf = useRef(0);
  const tm = useRef([]);
  const st = useRef({ lv: lv, solved: solved });
  st.current.lv = lv; st.current.solved = solved;
  useEffect(() => () => { cancelAnimationFrame(raf.current); tm.current.forEach(clearTimeout); }, []);
  const wall = RUN_LV[lv].wall;
  const finish = (res, jv, auto) => {
    const s = st.current;
    if (res === 'crash') {
      setPh('crash'); sfx('soft', true);
      if (!auto && !s.solved) T.miss(jv < RUN_LV[s.lv].wall ? c.low : c.equal, sayNow);
      return;
    }
    setPh('pass'); sfx('win', true);
    setCoins((n) => n + 10);
    if (s.solved) return;
    T.hit();
    if (s.lv === 0) {
      tm.current.push(setTimeout(() => {
        setLv(1); setJ(RUN_LV[1].j0); setPh('idle'); setFr({ wx: 62, y: 0 }); T.fresh();
      }, 1100));
      sayNow(c.lvlOk, 'smile');
      return;
    }
    put({ done: true, j: jv });
    log(logOf(T, 's4', 'fix-game', { value: jv }));
    sayNow(c.ok, 'cheer');
    say(c.riddle, 'curious');
  };
  const play = (jv, auto) => {
    cancelAnimationFrame(raf.current);
    const w = RUN_LV[st.current.lv].wall;
    setPh('run'); T.setMsg(null);
    if (reduceMotion()) {
      let t = 0, f = runFrame(0, jv, w);
      while (t < RG.T && !f.hit) { t += 16; f = runFrame(t, jv, w); }
      setFr(f); finish(f.hit ? 'crash' : 'pass', jv, auto);
      return;
    }
    const t0 = performance.now();
    const tick = (now) => {
      const f = runFrame(now - t0, jv, w);
      setFr(f);
      if (f.hit) { finish('crash', jv, auto); return; }
      if (now - t0 >= RG.T) { finish('pass', jv, auto); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  // Игра сломана с первой секунды: забег начинается сам, герой врезается.
  useEffect(() => {
    if (solved) return undefined;
    const t = setTimeout(() => play(RUN_LV[0].j0, true), 700);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const busy = ph === 'run' || (ph === 'pass' && !solved);
  const step = (d) => {
    if (!canTap || busy) return;
    const nj = Math.max(1, Math.min(RG.J_MAX, j + d));
    if (nj === j) return;
    sfx('tap', true); setJ(nj); setPh('idle'); setFr({ wx: 62, y: 0 }); T.setMsg(null);
  };
  const go = () => { if (!canTap || busy) return; sfx('tap', true); play(j, false); };
  const ask = solved ? c.askDone : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene itk-scene itk-run">
          <div className={'itk-game is-' + ph} style={{ '--U': RG.U + '%', '--G': RG.G + '%', '--s': (RG.X0 - fr.wx).toFixed(2) }}>
            <i className="itk-sun" aria-hidden="true" />
            <i className="itk-cloud is-a" aria-hidden="true" /><i className="itk-cloud is-b" aria-hidden="true" />
            <svg className="itk-hills" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d={HILLS} /></svg>
            <svg className="itk-trees" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
              {TREES.map((x, i) => <g key={i}><rect x={x - .6} y={i % 2 ? 17 : 14} width="1.2" height="16" fill="#A16207" /><ellipse cx={x} cy={i % 2 ? 16 : 12} rx={i % 3 ? 3.2 : 4.2} ry={i % 2 ? 6 : 8} fill={i % 3 ? '#4ADE80' : '#22C55E'} /></g>)}
            </svg>
            <i className="itk-ground" aria-hidden="true" />
            <span className="itk-lvl">{pick(fillL(c.lvl, { n: lv + 1 }))}</span>
            <span className="itk-hud"><i className="itk-coin" aria-hidden="true" /><b>{coins}</b></span>
            <i className="itk-jl" style={{ '--j': j }} aria-hidden="true"><em>{j}</em></i>
            <i className="itk-wall" style={{ '--n': wall, left: fr.wx + '%' }} aria-hidden="true">
              {Array.from({ length: wall }, (_, k) => <i key={k} className={k % 2 ? 'is-odd' : ''} />)}
              <b>{wall}</b>
              <i className={'itk-coin is-big' + ((ph === 'run' || ph === 'pass') && fr.wx + RG.WW / 2 < RG.HX + RG.HW / 2 ? ' is-got' : '')} style={{ '--n': wall }} />
            </i>
            <i className="itk-shadow" style={{ '--y': fr.y }} aria-hidden="true" />
            <i className={'itk-hero' + (ph === 'run' ? ' is-run' : '') + (fr.y > 0.05 ? ' is-air' : '')} style={{ '--y': fr.y }} aria-hidden="true">
              {ph === 'run' && fr.y < 0.05 ? <span className="itk-speed"><i /><i /><i /></span> : null}
              <ItkBot face="r" legs hurt={ph === 'crash'} />
              {ph === 'crash' ? <span className="itk-dizzy"><i /><i /><i /></span> : null}
            </i>
            {ph === 'crash' ? <span className="itk-boom kz-a-drop">BUM!</span> : null}
            {ph === 'pass' ? <span className="itk-win kz-a-drop">+10</span> : null}
          </div>
          <div className="itk-side">
            <div className="itk-code" translate="no">
              <div className="itk-cl"><em>1</em><span><b className="v">wall</b> = <b className="n">{wall}</b>;</span><small>// {pick(c.cWall)}</small></div>
              <div className="itk-cl is-edit"><em>2</em>
                <span><b className="v">jump</b> =
                  <button type="button" data-v="minus" className="itk-step" disabled={!canTap || busy || j <= 1} onClick={() => step(-1)} aria-label="−">−</button>
                  <b className="n itk-jv">{j}</b>
                  <button type="button" data-v="plus" className={'itk-step' + (canTap && !busy && !solved && j <= wall ? ' is-led' : '')} disabled={!canTap || busy || j >= RG.J_MAX} onClick={() => step(1)} aria-label="+">+</button>;
                </span>
                <small>// {pick(c.cJump)}</small>
              </div>
            </div>
            <button type="button" data-v="play" className={'kz-btn is-coral itk-play' + (canTap && !busy && !solved && j > wall ? ' is-led' : '')} disabled={!canTap || busy} onClick={go}>
              <ItkIco k="play" size={18} /> {pick(c.play)}
            </button>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. «КОД ВНУТРИ» — шесть приложений; нажатие переворачивает плитку: за значком короткий код и что он делает.
// После трёх — «у всех внутри код, его пишут программисты; их мир — IT».
// =============================================================================
const APP_CODE = {
  chat: ['if (newMessage) {', '  phone.ring();', '  show(message);', '}'],
  video: ['button.onClick(() => {', '  video.play();', '});'],
  taxi: ['let car = findCar(you);', 'car.goTo(home);'],
  game: ['if (hero.jumped) {', '  score += 10;', '}'],
  music: ['let song = list.next();', 'song.play();'],
  camera: ['let photo = camera.shoot();', 'gallery.save(photo);']
};
// Символы кода, что плавают вокруг телефона: текст, x и y в процентах сцены, задержка.
const FLOAT_SYM = [['{ }', 6, 12, 0], ['</>', 86, 8, 1.1], [';', 12, 48, 2.2], ['( )', 90, 40, .6], ['=', 4, 80, 1.7], ['if', 88, 76, 2.8], ['++', 18, 92, .9], ['[ ]', 80, 94, 2]];
const APPS2 = ['chat', 'video', 'taxi', 'game', 'music', 'camera'];
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [seen, setSeen] = useState(solved ? rec.open : []);
  const [cur, setCur] = useState(null);
  const [scan, setScan] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.wow : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const openApp = (k) => {
    if ((!canTap && !solved) || cur) return;
    sfx('pop', true); setCur(k); setScan(false);
    tm.current.push(setTimeout(() => { setScan(true); sfx('tap', true); }, reduceMotion() ? 50 : 750));
    if (seen.includes(k)) return;
    const next = seen.concat(k);
    setSeen(next);
    if (!solved && next.length >= 3) {
      put({ done: true, open: next });
      log({ screenId: 's3', type: 'apps', correct: true, firstTry: true, attempts: next.length, hints: 0, depth: 0 });
      tm.current.push(setTimeout(() => sayNow(c.wow, 'cheer'), 1400));
    }
  };
  const home = () => { if (!cur) return; sfx('tap', true); setCur(null); setScan(false); };
  const n = seen.length;
  const ci = cur ? APPS2.indexOf(cur) : 0;
  const ask = cur && !solved ? (n >= 3 ? c.askDone : c.back) : solved ? c.askDone : n ? c.more : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={ask} />
        <div className={'kz-scene itk-scene itk-apps2' + (solved ? ' is-done' : '')}>
          <div className="itk-codefloat" aria-hidden="true">
            {FLOAT_SYM.map(([t, x, y, d], i) => <i key={i} style={{ left: x + '%', top: y + '%', '--d': d + 's' }}>{t}</i>)}
          </div>
          <div className="itk-phone2">
            <i className="itk-notch" aria-hidden="true" />
            <div className="itk-sbar"><span>9:41</span><i aria-hidden="true"><ItkIco k="wifi" size={13} /><b className="itk-batt" /></i></div>
            <div className="itk-slots">
              <span>{pick(fillL(c.count, { n: n }))}</span>
              <i>{[0, 1, 2].map((i) => <b key={i} className={i < n ? 'is-on' : ''}><ItkIco k="code" size={13} /></b>)}</i>
            </div>
            <div className="itk-screen">
              <div className="itk-home">
                {APPS2.map((k) => (
                  <button key={k} type="button" data-v={k} className={'itk-app2' + (canTap && !n && !solved ? ' is-hint' : '')} style={{ '--c': APP_C[k] }}
                    disabled={(!canTap && !solved) || !!cur} onClick={() => openApp(k)} aria-label={pick(c.apps[k].name)}>
                    <i><ItkIco k={k} size={28} />{seen.includes(k) ? <em>&lt;/&gt;</em> : null}</i>
                    <b>{pick(c.apps[k].name)}</b>
                  </button>
                ))}
              </div>
              {cur ? (
                <div key={cur} className={'itk-appview' + (scan ? ' is-scan' : '')} style={{ '--c': APP_C[cur], '--ox': ((ci % 3) * 2 + 1) / 6 * 100 + '%', '--oy': (Math.floor(ci / 3) * 2 + 1) / 4 * 100 + '%' }}>
                  <div className="itk-av-ui">
                    <div className="itk-av-head"><ItkIco k={cur} size={18} /><b>{pick(c.apps[cur].name)}</b></div>
                    <div className="itk-av-body"><i><ItkIco k={cur} size={46} /></i><span /><span /><span /></div>
                  </div>
                  <div className="itk-av-code">
                    <div className="itk-av-tab"><span><i /><i /><i /></span><b translate="no">{cur}.js</b></div>
                    <code translate="no">{APP_CODE[cur].map((l, i) => <span key={i}><em>{i + 1}</em><CodeLine text={l} /></span>)}</code>
                    <small><ItkIco k="check" size={14} />{pick(c.apps[cur].does)}</small>
                  </div>
                  <i className="itk-av-line" aria-hidden="true" />
                  <button type="button" data-v="home" className="itk-av-home" onClick={home}><ItkIco k="home" size={16} />{pick(c.home)}</button>
                </div>
              ) : null}
            </div>
            <i className="itk-dock" aria-hidden="true" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. «РОБОТ И ЯБЛОКО» — путь стрелками, «Запустить». Робот выполняет буквально: стена — «бум», край — уходит,
// мало стрелок — встаёт. Два уровня: 4×4 и 5×4 с двумя стенами. После второго — разгадка: компьютер только
// выполняет, думает программист; команды по порядку — алгоритм.
// =============================================================================
const MAZES = [
  { w: 4, h: 4, start: [0, 3], apple: [3, 1], walls: ['1,3', '1,2', '2,2'], max: 10 },
  { w: 5, h: 4, start: [0, 0], apple: [4, 3], walls: ['1,0', '1,1', '3,2', '3,3'], max: 12 }
];
const DIRV = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
const DIR_ARROW = { u: '↑', d: '↓', l: '←', r: '→' };
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [lv, setLv] = useState(solved ? 1 : 0);
  const M = MAZES[lv];
  const [prog, setProg] = useState(solved ? rec.prog : []);
  const [pos, setPos] = useState(solved ? MAZES[1].apple : MAZES[0].start);
  const [run, setRun] = useState(false);
  const [boom, setBoom] = useState(false);
  const [win, setWin] = useState(solved);
  const [step, setStep] = useState(-1);
  const [face, setFace] = useState('r');
  const [trail, setTrail] = useState([]);
  const T = useActTask(c.hints[0]);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const locked = !canTap || solved || run || win;
  const add = (d) => { if (locked || prog.length >= M.max) return; sfx('tap', true); T.setMsg(null); setPos(M.start); setBoom(false); setStep(-1); setTrail([]); setProg(prog.concat(d)); };
  const clear = () => { if (locked) return; sfx('tap', true); setProg([]); setPos(M.start); setBoom(false); setStep(-1); setTrail([]); T.setMsg(null); };
  const go = () => {
    if (locked) return;
    if (!prog.length) { T.miss(c.empty, sayNow); return; }
    setRun(true); setBoom(false); setPos(M.start); setTrail([]); setFace(prog[0]); T.setMsg(null);
    let [x, y] = M.start;
    const ms = reduceMotion() ? 60 : 420;
    for (let i = 0; i < prog.length; i += 1) {
      const [dx, dy] = DIRV[prog[i]];
      const nx = x + dx, ny = y + dy;
      const out = nx < 0 || ny < 0 || nx >= M.w || ny >= M.h;
      const wall = !out && M.walls.includes(nx + ',' + ny);
      if (out || wall) {
        tm.current.push(setTimeout(() => { setStep(i); setFace(prog[i]); setBoom(true); setRun(false); T.miss(out ? c.edge : c.bump, sayNow); }, ms * (i + 1)));
        return;
      }
      x = nx; y = ny;
      const px = x, py = y, idx = i;
      const hit = x === M.apple[0] && y === M.apple[1];
      tm.current.push(setTimeout(() => {
        setStep(idx); setFace(prog[idx]); setTrail((t) => t.concat(px + ',' + py)); setPos([px, py]); sfx('pop', true);
        if (!hit) return;
        setRun(false); setWin(true); T.hit();
        if (lv === 0) {
          sayNow(c.lvlOk, 'smile');
          tm.current.push(setTimeout(() => {
            setLv(1); setProg([]); setPos(MAZES[1].start); setWin(false); setStep(-1); setTrail([]); setFace('d'); T.fresh();
          }, 1300));
          return;
        }
        put({ done: true, prog: prog.slice(0, idx + 1) });
        log(logOf(T, 's5', 'robot', { value: prog.join('') }));
        sayNow(c.ok, 'cheer');
      }, ms * (i + 1)));
      if (hit) return;
    }
    tm.current.push(setTimeout(() => { setRun(false); T.miss(c.short, sayNow); }, ms * (prog.length + 1)));
  };
  const cells = [];
  for (let y = 0; y < M.h; y += 1) for (let x = 0; x < M.w; x += 1) {
    const wl = M.walls.includes(x + ',' + y);
    const apple = x === M.apple[0] && y === M.apple[1];
    const st0 = x === M.start[0] && y === M.start[1];
    cells.push(
      <span key={lv + ':' + x + ',' + y} className={'itk-cell' + ((x + y) % 2 ? ' is-alt' : '') + (wl ? ' is-wall' : '')}>
        {wl ? <i className="itk-rock" /> : null}
        {st0 ? <i className="itk-start" /> : null}
        {trail.includes(x + ',' + y) && !apple ? <i className="itk-dot" /> : null}
        {apple && !win ? <i className="itk-apple"><ItkApple /></i> : null}
      </span>
    );
  }
  const hints = c.hints[lv];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next(hints) || c.ask)} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now(hints)} err={!!T.msg} />
        <div className="kz-scene itk-scene itk-robot">
          <div className="itk-board-wrap">
            <div key={lv} className="itk-board" style={{ '--w': M.w, '--h': M.h }}>
              {cells}
              <i className={'itk-bot' + (boom ? ' is-boom' : '') + (win ? ' is-win' : '') + (run ? ' is-go' : '')} style={{ '--x': pos[0], '--y': pos[1], '--nx': DIRV[face][0], '--ny': DIRV[face][1] }} aria-hidden="true">
                <ItkBot face={face} hurt={boom} />
                {boom ? <span className="itk-dizzy"><i /><i /><i /></span> : null}
                {win ? <span className="itk-spark"><i /><i /><i /><i /><i /><i /></span> : null}
              </i>
            </div>
          </div>
          <div className="itk-ctl">
            <div className="itk-prog" aria-label={pick(c.prog)}>
              <span className="itk-prog-h">{pick(c.prog)}</span>
              <span className="itk-prog-row">{prog.length ? prog.map((d, i) => <i key={i} className={i === step && (run || boom) ? 'is-now' : ''}>{DIR_ARROW[d]}</i>) : <em>…</em>}</span>
              <span className="itk-lvl is-prog">{pick(fillL(c.lvl, { n: lv + 1 }))}</span>
            </div>
            <div className="itk-arrows">
              {['u', 'l', 'd', 'r'].map((d) => (
                <button key={d} type="button" data-v={'dir-' + d} className="itk-arrow" disabled={locked} onClick={() => add(d)} aria-label={pick(c.dirs[d])}>{DIR_ARROW[d]}</button>
              ))}
            </div>
            <div className="itk-run-row">
              <button type="button" data-v="clear" className="kz-btn is-ghost" disabled={locked || !prog.length} onClick={clear}>{pick(c.clear)}</button>
              <button type="button" data-v="run" className={'kz-btn is-coral' + (!locked && prog.length ? ' is-led' : '')} disabled={locked} onClick={go}>{pick(c.run)}</button>
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. «НАПРАВЛЕНИЯ IT» — четыре карточки: игры, сайты, приложения, ИИ. Нажатие — рядом оживает пример работы такого
// программиста (герой прыгает в игре, сайт собирается в окне браузера, в телефоне приходят сообщения, ИИ отвечает на
// вопрос), Коди говорит, что он создаёт. Слайд пройден, когда открыты все четыре.
// =============================================================================
const DIRS = ['game', 'web', 'mobile', 'ai'];
const DIR_IC = { game: 'game', web: 'web', mobile: 'phone', ai: 'ai' };
const DIR_C = { game: '#8B5CF6', web: '#FA4F28', mobile: '#0EA5E9', ai: '#10B981' };
function DirPreview({ k, c, pick }) {
  if (k === 'game') return (
    <div className="itk-pv itk-pv-game">
      <i className="itk-pv-sun" /><i className="itk-pv-hill" />
      <b className="itk-pv-score"><i className="itk-coin" />120</b>
      <i className="itk-pv-wall" /><i className="itk-coin itk-pv-coin" />
      <span className="itk-pv-hero"><ItkBot face="r" legs /></span>
      <i className="itk-pv-ground" />
    </div>
  );
  if (k === 'web') return (
    <div className="itk-pv itk-pv-web">
      <div className="itk-pv-bar"><span><i /><i /><i /></span><b translate="no">maktab.uz</b></div>
      <div className="itk-pv-page">
        <div className="itk-pv-nav"><b>{pick(c.site.title)}</b><i /><i /><i /></div>
        <div className="itk-pv-hero2"><i /><i /><b>{pick(c.site.btn)}</b></div>
        <div className="itk-pv-cards"><i /><i /><i /></div>
      </div>
    </div>
  );
  if (k === 'mobile') return (
    <div className="itk-pv itk-pv-mob">
      <div className="itk-pv-phone">
        <div className="itk-pv-phead"><ItkIco k="chat" size={14} /><b>Messenjer</b></div>
        {c.chat.map((m, i) => <span key={i} className={'itk-pv-msg' + (i % 2 ? ' is-me' : '')} style={{ '--d': 0.3 + i * 0.9 + 's' }}>{pick(m)}</span>)}
      </div>
    </div>
  );
  return (
    <div className="itk-pv itk-pv-ai">
      <span className="itk-pv-msg is-me" style={{ '--d': '.2s' }}>{pick(c.aiQ)}</span>
      <span className="itk-pv-typing"><i /><i /><i /></span>
      <span className="itk-pv-msg is-ai" style={{ '--d': '2s' }}><i><ItkIco k="ai" size={14} /></i>{pick(c.aiA)}</span>
    </div>
  );
}
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const log = useLog();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [seen, setSeen] = useState(solved ? DIRS.slice() : []);
  const [cur, setCur] = useState(solved ? 'game' : null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.wow : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tap = (k) => {
    if ((!canTap && !solved) || k === cur) return;
    sfx('pop', true);
    setCur(k);
    if (solved) return;
    sayNow(c.dirs[k].say, 'point');
    if (seen.includes(k)) return;
    const next = seen.concat(k);
    setSeen(next);
    if (next.length === DIRS.length) {
      put({ done: true });
      log({ screenId: 's6', type: 'it-paths', correct: true, firstTry: true, attempts: next.length, hints: 0, depth: 0 });
      say(c.wow, 'cheer');
    }
  };
  const n = seen.length;
  const ask = solved || n === DIRS.length ? c.askDone : n ? c.more : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene itk-scene itk-dirs">
          <div className="itk-dir-tiles">
            {DIRS.map((k) => (
              <button key={k} type="button" data-v={k} className={'itk-dir' + (cur === k ? ' is-cur' : '') + (seen.includes(k) ? ' is-seen' : '') + (canTap && !seen.length && !solved ? ' is-hint' : '')}
                style={{ '--c': DIR_C[k] }} disabled={!canTap && !solved} onClick={() => tap(k)}>
                <i><ItkIco k={DIR_IC[k]} size={24} />{seen.includes(k) ? <em><ItkIco k="check" size={11} /></em> : null}</i>
                <b>{pick(c.dirs[k].name)}</b>
              </button>
            ))}
          </div>
          <div className={'itk-dir-view' + (cur ? ' is-on' : '')} style={{ '--c': cur ? DIR_C[cur] : '#CBD5E1' }}>
            {cur ? (
              <>
                <div key={cur} className="itk-dir-stage"><DirPreview k={cur} c={c} pick={pick} /></div>
                <div className="itk-dir-cap"><b>{pick(c.dirs[cur].who)}</b><span>{pick(c.dirs[cur].does)}</span></div>
              </>
            ) : (
              <div className="itk-dir-empty"><i>?</i><span>{pick(c.ask)}</span></div>
            )}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. «ПЕРВАЯ ПРОГРАММА» — три строки настоящего кода: имя (ученик пишет между кавычками), цвет (плашки ниже меняют
// слово в коде), вывеска. «Запустить» — имя зажигается неоновой вывеской. Цвет можно менять и запускать снова.
// Имя ученика в голос не идёт.
// =============================================================================
const NEON = [['orange', '#FA4F28'], ['cyan', '#06B6D4'], ['pink', '#EC4899'], ['lime', '#65A30D']];
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [name, setName] = useState(solved ? (store.get('itkName') || '') : '');
  const [col, setCol] = useState(solved ? (store.get('itkColor') || 'orange') : 'orange');
  const [out, setOut] = useState(solved ? { name: store.get('itkName') || '', col: store.get('itkColor') || 'orange', n: 0 } : null);
  const [picked, setPicked] = useState(solved);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const greet = pick(c.greet);
  const go = () => {
    if (!canTap) return;
    const v = name.trim();
    if (!v) { if (!solved) T.miss(c.empty, sayNow); return; }
    if (!picked) { if (!solved) T.miss(c.noColor, sayNow); return; }
    sfx('win', true);
    setOut({ name: v, col: col, n: (out ? out.n : 0) + 1 });
    store.set('itkName', v); store.set('itkColor', col);
    if (solved) return;
    T.hit(); put({ done: true });
    log(logOf(T, 's7', 'first-program', { value: col }));
    sayNow(c.ok, 'cheer');
  };
  const hex = (k) => (NEON.find((x) => x[0] === k) || NEON[0])[1];
  const step = solved ? 0 : !name.trim() ? 1 : !picked ? 2 : 3;
  // Слова для первой строки — нажатием, без клавиатуры; первым — имя ученика, если платформа его передала.
  const real = p.name && !/^(O'quvchi|Student|Ученик)$/.test(p.name) ? p.name : null;
  const words = (real ? [real] : []).concat(c.words.map((w) => pick(w)));
  const lineCls = (i) => 'itk-cl itk-step-l' + (step === 0 || step > i ? ' is-done' : step === i ? ' is-now' : ' is-later');
  const ask = solved ? c.again : c.steps[step - 1];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || ask)} nav={nav(p, canGo)}>
      <Sheet cls="itk-sheet">
        <KzAsk text={ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene itk-scene itk-neon">
          <div className="itk-code is-prog is-steps" translate="no">
            <div className={lineCls(1)}>
              <i className="itk-snum">{step > 1 || solved ? '✓' : '1'}</i>
              <span><b className="k">let</b> <b className="v">name</b> = <b className={'s itk-slot' + (name ? ' is-full' : '') + (step === 1 && canTap ? ' is-led' : '')}>"{name || '___'}"</b>;</span>
              <small>← {pick(c.notes[0])}</small>
              <div className="itk-colors itk-words" role="group" aria-label={pick(c.notes[0])}>
                {words.map((w, i) => (
                  <button key={w} type="button" data-v={'word-' + i} className={'itk-chip is-word' + (name === w ? ' is-on' : '') + (step === 1 ? ' is-led' : '')}
                    disabled={!canTap} onClick={() => { sfx('tap', true); setName(w); T.setMsg(null); }}>
                    <span translate="no">{w}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={lineCls(2)}>
              <i className="itk-snum">{step > 2 || solved ? '✓' : '2'}</i>
              <span><b className="k">let</b> <b className="v">color</b> = <b className="s" style={{ color: hex(col) }}>"{col}"</b>;</span>
              <small>← {pick(c.notes[1])}</small>
              <div className="itk-colors" role="group" aria-label={pick(c.colorH)}>
                {NEON.map(([k, h]) => (
                  <button key={k} type="button" data-v={'col-' + k} className={'itk-chip' + (col === k && picked ? ' is-on' : '') + (step === 2 ? ' is-led' : '')} style={{ '--c': h }}
                    disabled={!canTap || step === 1} onClick={() => { sfx('tap', true); setCol(k); setPicked(true); }}>
                    <i /><span translate="no">{k}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={lineCls(3)}>
              <i className="itk-snum">{solved ? '✓' : '3'}</i>
              <span><b className="f">neon</b>(<b className="s">"{greet}"</b> + <b className="v">name</b>, <b className="v">color</b>);</span>
              <small>← {pick(c.notes[2])}</small>
            </div>
          </div>
          <button type="button" data-v="run" className={'kz-btn is-coral itk-play' + (canTap && (step === 3 || (solved && out && (out.col !== col || out.name !== name.trim()))) ? ' is-led' : '') + (step === 1 || step === 2 ? ' is-wait' : '')} disabled={!canTap} onClick={go}>
            <ItkIco k="play" size={18} /> {pick(c.run)}
          </button>
          <div className={'itk-sign' + (out ? ' is-on' : ' is-off')} style={{ '--c': hex(out ? out.col : col) }}>
            {out ? <b key={out.n} className="itk-sign-t" translate="no">{greet}{out.name}!</b> : <b className="itk-sign-t is-off" translate="no">{greet}{name.trim() || '…'}!</b>}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ИТОГ — праздник: большая медаль «Юный программист» с именем, три победы урока медальонами (загораются по одному
// на реплике Коди о победах), что ученик создаст в курсе — мини-картинки (сайт, дизайн, ИИ; оживают на последней
// реплике). Следующего урока на экране нет (заказчик, 25.11.2026).
// =============================================================================
const FUTURE = [['site', '#FA4F28'], ['design', '#EC4899'], ['ai', '#10B981']];
const ACH = [['fix', 'game', '#8B5CF6'], ['robot', 'robot', '#0EA5E9'], ['prog', 'code', '#FA4F28']];
function FutureMini({ k }) {
  if (k === 'site') return (
    <span className="itk-fm is-site"><i className="itk-fm-bar"><b /><b /><b /></i><i className="itk-fm-head" /><i className="itk-fm-hero" /><i className="itk-fm-row"><b /><b /><b /></i></span>
  );
  if (k === 'design') return (
    <span className="itk-fm is-design"><b style={{ '--c': '#FA4F28' }} /><b style={{ '--c': '#EC4899' }} /><b style={{ '--c': '#8B5CF6' }} /><b style={{ '--c': '#0EA5E9' }} /><em>Aa</em></span>
  );
  return (
    <span className="itk-fm is-ai"><i className="is-q" /><i className="is-a"><ItkIco k="ai" size={11} /></i><i className="is-q is-2" /></span>
  );
}
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const store = useStore();
  const word = store.get('itkName');
  const real = p.name && !/^(O'quvchi|Student|Ученик)$/.test(p.name) ? p.name : null;
  const nm = real || (word ? pick(C.s7.greet) + word + '!' : 'Kodi');
  const col = (NEON.find((x) => x[0] === store.get('itkColor')) || NEON[0])[1];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'shy' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const order = { riddle: 0, did: 1, next: 2 };
  const [reach, setReach] = useState(0);
  useEffect(() => { if (curK && order[curK] > reach) setReach(order[curK]); }, [curK]); // eslint-disable-line react-hooks/exhaustive-deps
  const achOn = reach >= 1 || canGo;
  const futOn = reach >= 2 || canGo;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="itk-sheet">
        <KzAsk text={c.ask} />
        <div className="kz-scene itk-scene itk-end2">
          <div className="itk-award" style={{ '--c': col }}>
            <i className="itk-award-rays" aria-hidden="true" />
            {[0, 1, 2, 3, 4].map((i) => <i key={i} className={'itk-award-star is-' + i} aria-hidden="true" />)}
            <span className="itk-medal2">
              <i className="itk-ribbon is-l" aria-hidden="true" /><i className="itk-ribbon is-r" aria-hidden="true" />
              <b><ItkIco k="code" size={36} /></b>
            </span>
            <small>{pick(c.badge)}</small>
            <strong translate="no">{nm}</strong>
          </div>
          <div className={'itk-ach2' + (achOn ? ' is-on' : '')}>
            {ACH.map(([k, ic, h], i) => (
              <span key={k} style={{ '--c': h, '--d': i * 0.45 + 's' }}>
                <i><ItkIco k={ic} size={24} /><em><ItkIco k="check" size={11} /></em></i>
                <b>{pick(c.ach[k])}</b>
              </span>
            ))}
          </div>
          <div className={'itk-future2' + (futOn ? ' is-on' : '')}>
            <span className="itk-future-h">{pick(c.future)}</span>
            <div className="itk-future2-row">
              {FUTURE.map(([k, h], i) => (
                <span key={k} style={{ '--c': h, '--d': i * 0.35 + 's' }}><FutureMini k={k} /><b>{pick(c.cards[k])}</b></span>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'LEVEL-1', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 },
  { id: 's4', code: 'LEVEL-2', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'LEVEL-1', Comp: S6 },
  { id: 's7', code: 'LEVEL-3', Comp: S7 }, { id: 's8', code: 'ACHIEVEMENT', Comp: S8 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

export default function ItKirish({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: store.get('itkName') ? { type: 'first-program', name: store.get('itkName'), color: store.get('itkColor') || 'orange' } : null })
  });
  useParallax();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
