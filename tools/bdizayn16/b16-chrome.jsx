// ─────────────────────────────────────────────────────────────────────────────
// РАМКА «B · O'YIN» (тестовый урок 16, 28.10.2026; заказчик: «оставив стилистику
// первого урока, внедрить этот дизайн — верхняя часть, нижняя часть и прочее»).
// Источник — гайд Junior IT Academy «B · O'yin» (B-variant-dizayn-stilistikasi.md).
// Содержимое экранов — урок 1 без изменений (бумажный лист, человечек, браузер);
// новая только рамка вокруг:
//   · шапка: закрыть ✕ · сегментный прогресс (сделано — гранат, текущий — с кольцом)
//     · счётчик «6/17» · Коди, лампочка, пауза — «нажимные» кнопки;
//   · ярлык раздела во втором ряду шапки: объяснение — фиолетовый с книжкой,
//     задание — гранатовый с карандашом;
//   · низ: «Назад» — белая кнопка, «Дальше» — гранатовая, у обеих толстый нижний
//     край (2/2/5/2), при нажатии кнопка «опускается»;
//   · после решённого задания низ становится зелёной панелью «Barakalla!» с
//     объяснением (тот же текст, что был в строке задания) и зелёной «Дальше»;
//   · причина ошибки и подсказка лампочки — лососевая панель «Maslahat» снизу
//     с кнопкой «Qayta urinish» (закрыть); строка задания на листе остаётся заданием.
// Экраны рисуют StageB вместо Stage канона (замена при сборке, build.mjs).
// ─────────────────────────────────────────────────────────────────────────────
let _bAskSet = null;   // KzAsk сообщает рамке текст задания и подсказку (build.mjs)

const B_UI = {
  ok: L3('Barakalla!', 'Молодец!', 'Well done!'),
  hint: L3('Maslahat', 'Подсказка', 'Hint'),
  retry: L3('Qayta urinish', 'Попробовать ещё', 'Try again'),
  close: L3('Darsdan chiqish', 'Выйти из урока', 'Leave the lesson'),
  show: L3('Tushuntirish', 'Объяснение', 'Explanation'),
  task: L3('Mashq', 'Задание', 'Practice')
};

// Значки Lucide (обводка, круглые концы).
const BIco = ({ d, size = 20, w = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const B_ICO = {
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  bulb: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>,
  book: <><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></>,
  pencil: <><path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" /><path d="m15 5 4 4" /></>
};

// Задание или объяснение — по коду экрана (SHOW и HOOK — показ, финал — вывод).
const bIsTask = (i, total) => {
  const s = typeof SCREENS !== 'undefined' ? SCREENS[i] : null;
  return !!s && s.code !== 'SHOW' && s.code !== 'HOOK' && i < total - 1;
};

const BExit = () => {
  const pick = usePick();
  const audio = useAudio();
  const page = usePage();
  if (!page || !page.exit) return null;
  const label = pick(B_UI.close);
  return (
    <button type="button" className="ctl-btn is-exit b-exit" onClick={() => { sfx('tap', audio && audio.on); page.exit(); }}
      title={label} aria-label={label}><BIco d={B_ICO.x} size={24} w={2.4} /></button>
  );
};

const BProgress = ({ screen, total }) => (
  <div className="b-prog" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={screen + 1}>
    {Array.from({ length: total }).map((_, k) => (
      <i key={k} className={k < screen ? 'is-done' : k === screen ? 'is-cur' : ''} />
    ))}
  </div>
);

const StageB = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint, voiceTop }) => {
  const pick = usePick();
  const speaking = useSayBusy();
  useEffect(() => { _hintText = hint || null; return () => { _hintText = null; }; }, [hint]);
  const idle = useIdleCoach(!!nav, speaking);
  const [ask, setAsk] = useState({ text: '', hint: '' });
  useLayoutEffect(() => { _bAskSet = setAsk; return () => { if (_bAskSet === setAsk) _bAskSet = null; }; }, []);
  const [shut, setShut] = useState('');
  const task = bIsTask(screen, total);
  const okSheet = task && !!done && !!nav;
  const hintSheet = !okSheet && !!nav && !!ask.hint && ask.hint !== shut;
  const sheet = okSheet ? 'ok' : hintSheet ? 'hint' : '';
  return (
    <div className={'stage b-stage' + (heroFixed ? ' stage-hero-fixed' : '') + (hideSpeaker ? ' stage-bare' : '') + (voiceTop ? ' stage-voicetop' : '')
      + (speaking ? ' is-speaking' : '') + (idle ? ' is-idle is-idle-' + idle : '') + (sheet ? ' has-sheet is-sheet-' + sheet : '')}>
      <div className="stage-header b-head">
        {/* Два ряда (заказчик, 28.10.2026: кнопки — не в одной строке со страницами):
            сверху — страницы и счётчик, ниже — ярлык раздела и Коди, лампочка, пауза. */}
        <div className="limit b-head-row">
          <BExit />
          <BProgress screen={screen} total={total} />
          <span className="b-count counter">{String(screen + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
        </div>
        <div className="limit b-head-row2">
          {eyebrow ? (
            <div className={'b-chip ' + (task ? 'is-task' : 'is-show')}>
              <BIco d={task ? B_ICO.pencil : B_ICO.book} size={16} w={2.4} /><span className="b-chip-t">{pick(eyebrow)}</span>
            </div>
          ) : <span />}
          <div className="chrome-side b-side">
            {speaker && !hideSpeaker ? <VoiceDot pose={speaker.pose} /> : null}
            {nav && <HintChromeBtn />}
            {nav && <PauseBtn done={done} />}
          </div>
        </div>
      </div>
      {speaker && (
        <div className="speaker-wrap"><div className="limit"><PersonaBubble {...speaker} /></div></div>
      )}
      <div className={'stage-content' + (speaker ? ' has-speaker' : '')}>
        <div className="limit stack stagger">
          {children}
        </div>
      </div>
      {nav && sheet === 'ok' ? (
        <div className="stage-nav b-sheet is-ok" role="status">
          <div className="limit b-sheet-in">
            <span className="b-sheet-ic"><BIco d={B_ICO.check} size={28} w={3} /></span>
            <div className="b-sheet-tx"><b>{pick(B_UI.ok)}</b>{ask.text ? <p>{ask.text}</p> : null}</div>
            <div className="navrow b-sheet-nav">{nav}</div>
          </div>
        </div>
      ) : nav && sheet === 'hint' ? (
        <div className="stage-nav b-sheet is-hint" role="status">
          <div className="limit b-sheet-in">
            <span className="b-sheet-ic"><BIco d={B_ICO.bulb} size={26} w={2.6} /></span>
            <div className="b-sheet-tx"><b>{pick(B_UI.hint)}</b><p>{ask.hint}</p></div>
            <div className="navrow b-sheet-nav">
              <button type="button" className="b-btn-hint" onClick={() => setShut(ask.hint)}>{pick(B_UI.retry)}</button>
            </div>
          </div>
        </div>
      ) : nav ? (
        <div className="stage-nav b-foot"><div className="limit navrow">{nav}</div></div>
      ) : null}
      {overlay}
    </div>
  );
};

// ── Реплики v2 (28.10.2026) ─────────────────────────────────────────────────
Object.assign(SPOKEN, { more: 1 });

// Варианты ответа в случайном порядке, верный — не первым.
function b16Shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  if (a[0] && a[0].right && a.length > 1) a.push(a.shift());
  return a;
}

// Показ урока 1 (useKzDemo) + шаг «нажми сам» (заказчик, v2: на экранах 3 и 6 ученик
// нажимает бирку, голову, бумажку): { tap: 'ключ', el: () => вещь, act }. Пока шаг ждёт,
// вещь мягко пульсирует; экран зовёт demo.tap('ключ') по нажатию.
function useB16Demo({ steps, run: run0, spoken, sayNow, say }) {
  const runRef = useRef(run0);
  const run = runRef.current;
  const [idx, setIdx] = useState(-1);
  const [wait, setWait] = useState(null);
  const ran = useRef(-1);
  const tm = useRef([]);
  const audio = useAudio();
  const pausedRef = useRef(false);
  pausedRef.current = !!(audio && audio.paused);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const later = (ms, f) => {
    const go = () => { if (pausedRef.current) { tm.current.push(setTimeout(go, 300)); return; } f(); };
    tm.current.push(setTimeout(go, ms));
  };
  const next = (i) => setIdx((v) => (v === i ? i + 1 : v));
  const lookAt = (el, i, act) => {
    const done = () => { if (act) act(); next(i); };
    if (!el || !el.classList || reduceMotion()) { done(); return; }
    el.classList.add('kz-demo-on');
    later(560, done);
    later(900, () => el.classList.remove('kz-demo-on'));
  };
  useEffect(() => {
    if (!run) return;
    if (idx === -1) { if (spoken) setIdx(0); return; }
    const st = steps[idx];
    if (!st) return;
    if (ran.current !== idx) {
      if (st.tap && !spoken) return;   // просьба нажать — когда Коди договорил
      ran.current = idx;
      const i = idx;
      if (st.say) { sayNow(st.say[0].text, st.say[0].pose); st.say.slice(1).forEach((l) => say(l.text, l.pose)); return; }
      if (st.tap) { setWait({ key: st.tap, i }); return; }
      if (st.look) { later(200, () => lookAt(st.look(), i, st.act)); return; }
      if (st.wait) { if (st.act) st.act(); later(st.wait, () => next(i)); return; }
      if (st.act) st.act();
      next(i);
      return;
    }
    if (st.say && spoken) next(idx);
  }, [idx, spoken, run]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!wait) return undefined;
    const st = steps[wait.i];
    const el = st && st.el ? st.el() : null;
    if (el && el.classList) el.classList.add('b16-tapme');
    return () => { if (el && el.classList) el.classList.remove('b16-tapme'); };
  }, [wait]); // eslint-disable-line react-hooks/exhaustive-deps
  const tap = (key) => {
    if (!wait || wait.key !== key) return false;
    const st = steps[wait.i];
    const i = wait.i;
    setWait(null);
    if (st.act) st.act();
    next(i);
    return true;
  };
  return { idx, done: !run || idx >= steps.length, step: Math.max(0, Math.min(idx, steps.length)), waiting: wait ? wait.key : null, tap };
}

// Английские слова в узбекской и русской речи — по-английски (заказчик, 28.10.2026:
// «слово tag и все теги читались на английском»). Сервис понимает пометки языка в
// квадратных скобках (как [O'zbekcha tallaffuz] в начале реплики и теги эмоций):
// перед английскими словами ставим [English pronunciation], сразу после — пометку
// языка урока. Узбекское окончание («tag-i») идёт уже после неё.
const B16_BACK = { uz: "[O'zbekcha tallaffuz]", ru: '[Русское произношение]' };
const B16_EN = '(?:tag|HTML|html|head|title|body|doctype|DOCTYPE|H (?:one|two|three|four|five|six))';
const B16_EN_RE = new RegExp("(^|[^A-Za-z'‘’ʻʼ-])(" + B16_EN + '(?:\\s+' + B16_EN + ')*)(-[A-Za-z]+)?(?![A-Za-z])', 'g');
function b16EnWords(s, lang) {
  const back = B16_BACK[lang];
  if (!back) return s;
  return String(s).replace(B16_EN_RE, (all, pre, words, suf) => pre + '[English pronunciation] ' + words + ' ' + back + (suf || ''));
}
// Голос браузера (когда сервиса озвучки нет) пометки в скобках не понимает и прочёл
// бы их вслух — для него они убираются.
if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance === 'function' && !window.__b16Utt) {
  const BaseUtt = window.SpeechSynthesisUtterance;
  window.__b16Utt = true;
  window.SpeechSynthesisUtterance = function B16Utterance(t) {
    return new BaseUtt(String(t == null ? '' : t).replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').replace(/\s+([.,!?;:-])/g, '$1').trim());
  };
}
