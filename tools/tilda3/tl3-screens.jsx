// =============================================================================
// ЭКРАНЫ УРОКА 3 МОДУЛЯ TILDA «Блоки Text и Button». Показы — указатель (курсор / палец) сам делает шаги под речь Коди;
// задания — ученик нажимает сам (ничего не печатает), указатель стоит у нужной вещи. Сайт клуба меняется от экрана к экрану:
// стена жирного текста (s1) → три абзаца (s4) → одно жирное слово (s6) → кнопка (s9) → её текст (s10) → её место (s11).
// Сквозные данные: tl3Btn (выбранный текст кнопки), tl3RealUrl.
// =============================================================================
const useShowHelp = (help) => {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
};
function useActTask(hints0) {
  const lad = useKzLadder(true);
  const [msg, setMsg] = useState(null);
  const st = useRef({ tries: 0, misses: 0 });
  return {
    lad, msg, st, setMsg,
    miss: (m, sayNow) => { st.current.tries += 1; st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); },
    hit: () => { st.current.tries += 1; setMsg(null); },
    now: (h) => msg || hintAt(lad.lv, h || hints0),
    next: (h) => hintAt(Math.min(3, lad.lv + 1), h || hints0)
  };
}
const logOf = (T, id, type, extra) => Object.assign({ screenId: id, type: type, correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv }, extra || {});
const nav3 = (p, canGo) => navOf(p, canGo);

// Блоки страницы урока 3.
const B3 = {
  cover: { u: 'c', k: 'cover', id: 'CR28' }, title: { u: 't', k: 'title', id: 'TL02' }, lead: { u: 'l', k: 'lead', id: 'TX02' },
  text: { u: 'x', k: 'text', id: 'TX01' }, quote: { u: 'q', k: 'quote', id: 'QT01' }, button: { u: 'b', k: 'button', id: 'BF101' }
};
const WALL = Object.assign({}, B3.text, { wall: true });
const BTN_TXT = (k) => (k ? C.s10.opts[k] : null);
// Ключ слова «предложение:слово» для главного слова (bepul / бесплатное / free) и для «10:00» — по языку урока.
const keyOf = (pick, si, word) => { const ws = wordsOf(pick(PAGE3.sents[si])); const i = ws.findIndex((x) => x.w.toLowerCase() === pick(word).toLowerCase()); return si + ':' + Math.max(0, i); };
const useBtnBlock = () => { const store = useStore(); return Object.assign({}, B3.button, { t: BTN_TXT(store.get('tl3Btn') || 'join') }); };

// =============================================================================
// S1. КРЮЧОК — сообщение клуба: «сайт не читают, кнопки записи нет». Сайт: стена жирного текста. Вопрос-мнение и загадка
// Коди: «всё жирным и крупным — и прочитают; кнопку нажмут, где бы она ни стояла».
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ans, setAns] = useState(solved ? rec.k : null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const pickOpt = (k) => {
    if (!canTap || ans) return;
    sfx('tap', true); setAns(k); put({ done: true, k: k });
    sayNow(joinL(c.reply[k], c.riddle), 'curious');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ans ? c.askDone : c.ask} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={ans ? c.askDone : c.ask} />
        <div className="kz-scene tl-scene tl2-hook tl3-hook">
          <div className="tl-msg kz-a-drop">
            <span className="tl-msg-from"><i className="tl-ava" aria-hidden="true" />{pick(c.from)}</span>
            <span className="tl-msg-t">{pick(c.msg)}</span>
            <span className="tl-msg-time">11:05</span>
          </div>
          <TEd2 project="RoboKlub" cls="tl2-mini">
            <TPage3 blocks={[B3.cover, WALL]} />
          </TEd2>
          <div className="tl-pick is-two">
            {['big', 'split'].map((k) => (
              <button key={k} type="button" data-v={k} className={'kz-btn tl-opt' + (ans === k ? ' is-ok' : '')} disabled={!canTap || !!ans} onClick={() => pickOpt(k)}>{pick(c.opts[k])}</button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «ВИДЫ ТЕКСТА» — указатель подходит к заголовку, лиду, тексту, цитате; у блока рамка, шифр и название вида.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const blocks = [B3.title, B3.lead, B3.text, B3.quote];
  const kinds = ['title', 'lead', 'text', 'quote'];
  const ms = reduceMotion() ? 0.1 : 1;
  const visit = (b, i) => [
    { act: () => { scrollToSel('[data-b="' + b.u + '"]'); } }, { wait: 250 * ms },
    { act: () => { G.go('[data-b="' + b.u + '"]', 0.62, 0.55); } }, { wait: 700 * ms },
    { act: () => { sfx('pop', true); setSel(b.u); } },
    { say: [{ text: c.steps[i], pose: 'point' }] }
  ];
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(visit(blocks[0], 0), visit(blocks[1], 1), visit(blocks[2], 2), visit(blocks[3], 3), [{ act: () => { G.hide(); put({ done: true }); } }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const cur = blocks.findIndex((b) => b.u === sel);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub">
            <TPage3 blocks={blocks} sel={solved ? null : sel} lite label={!solved && cur >= 0 ? { u: sel, t: pick(c.names[kinds[cur]]) } : null} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ЗАДАНИЕ «КАКОЙ БЛОК?» — 4 раунда: текст клуба → заголовок, лид, текст или цитата. Промах — подсказка по ступеням.
// =============================================================================
const KINDS = [['title', 'TL02'], ['lead', 'TX02'], ['text', 'TX01'], ['quote', 'QT01']];
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okK, setOkK] = useState(solved ? c.rounds[c.rounds.length - 1].a : null);
  const [bad, setBad] = useState(null);
  const misses = useRef(0);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const R = c.rounds[r];
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tap = (k) => {
    if (!canTap || solved || okK) return;
    if (k !== R.a) {
      misses.current += 1; setBad(k); sfx('soft', true);
      sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump();
      setTimeout(() => setBad(null), 700);
      return;
    }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's3', type: 'text-kinds', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene tl-scene tl3-kinds">
          <div className="tl2-qn" aria-live="polite">
            <span className="tl2-qdots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
          </div>
          <div key={r} className={'tl3-piece kz-a-drop is-' + R.a}>{pick(R.q)}</div>
          <div className="tl3-kb">
            {KINDS.map(([k, id]) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK}
                className={'tl3-kind' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)}>
                <span className={'tl3-ki is-' + k} aria-hidden="true"><i /><i /><i /></span>
                <b>{pick(C.s2.names[k])}</b><em translate="no">{id}</em>
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ЗАДАНИЕ «РАЗБЕЙ СТЕНУ» — между предложениями ножницы; верные разрезы — после 2-го и 4-го предложения (смена темы).
// Неверный разрез — своя причина. После двух разрезов — три абзаца.
// =============================================================================
const CUTS_OK = [1, 3];
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const log = useLog();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [cuts, setCuts] = useState(solved ? CUTS_OK : []);
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const cut = (g) => {
    if (!canTap || solved || cuts.indexOf(g) >= 0) return;
    if (CUTS_OK.indexOf(g) < 0) { setBad(g); setTimeout(() => setBad(null), 700); T.miss(c.wrong, sayNow); return; }
    T.hit(); sfx('pop', true);
    const next = cuts.concat(g);
    setCuts(next);
    if (next.length === CUTS_OK.length) {
      put({ done: true }); log(logOf(T, 's4', 'split-text'));
      sayNow(c.ok, 'cheer');
    } else sayNow(c.half, 'smile');
  };
  const groups = [];
  let cur = [];
  PAGE3.sents.forEach((s, i) => { cur.push(i); if (cuts.indexOf(i) >= 0 || i === PAGE3.sents.length - 1) { groups.push(cur); cur = []; } });
  const groot = useRef(null);
  const G = useGuide(groot);
  const nextOk = CUTS_OK.find((g) => cuts.indexOf(g) < 0);
  usePoint(G, solved || T.lad.lv < 3 || nextOk == null ? null : '[data-v="cut' + nextOk + '"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <div className="tl2-page">
              <div className="tl2-b is-text is-sel" data-b="x">
                <div className={'tl2-tx tl3-tx tl3-split' + (cuts.length ? '' : ' is-wall')}>
                  {groups.map((gr, gi) => (
                    <p key={gi} className={cuts.length ? 'kz-a-drop' : ''}>
                      {gr.map((si) => (
                        <React.Fragment key={si}>
                          <span className="tl3-sent">{pick(PAGE3.sents[si])}</span>
                          {si < PAGE3.sents.length - 1 && cuts.indexOf(si) < 0 ? (
                            <button type="button" data-v={'cut' + si} className={'tl3-cut' + (bad === si ? ' is-bad' : '')} disabled={!canTap || solved} onClick={() => cut(si)} aria-label={'✂ ' + (si + 1)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.5 7.5L20 18M8.5 16.5L20 6" /></svg>
                            </button>
                          ) : ' '}
                        </React.Fragment>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ПОКАЗ «СТИЛЬ ТЕКСТА» — указатель нажимает «10:00», появляется панель; B делает слово жирным; потом жирным становится
// всё (ничего не выделяется) — и обратно одно слово.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const tk = keyOf(pick, 4, PAGE3.time);
  const [selW, setSelW] = useState(null);
  const [bold, setBold] = useState([]);
  const [all, setAll] = useState(false);
  const [fmtLed, setFmtLed] = useState(null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { scrollToSel('[data-w="' + tk + '"]'); G.go('[data-w="' + tk + '"]', 0.5, 0.6); } }, { wait: 800 * ms },
    { act: () => { G.tap(); sfx('tap', true); setSelW(tk); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => { G.go('[data-f="b"]', 0.5, 0.5); setFmtLed('b'); } }, { wait: 800 * ms },
    { act: () => { G.tap(); sfx('pop', true); setBold([tk]); setFmtLed(null); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[1], pose: 'smile' }] },
    { act: () => { G.hide(); setSelW(null); sfx('soft', true); setAll(true); } }, { wait: 600 * ms },
    { say: [{ text: c.steps[2], pose: 'think' }] },
    { act: () => { sfx('pop', true); setAll(false); put({ done: true }); } }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub" cls={selW ? 'tl3-fmton' : ''}>
            <TPage3 blocks={[B3.title, B3.text]} selW={selW} boldSet={solved ? [tk] : bold} allBold={all} />
            {selW ? <TFmt led={fmtLed} off /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. ЗАДАНИЕ «ГЛАВНОЕ СЛОВО» — нажать «bepul» (панель стиля), нажать B. Другое слово — своя причина; I, U, S, ссылка,
// цвет, размер — своя причина.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const log = useLog();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const key = keyOf(pick, 5, PAGE3.key);
  const [selW, setSelW] = useState(null);
  const [bold, setBold] = useState(solved ? [key] : []);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onWord = (k) => { if (!canTap || solved) return; sfx('tap', true); setSelW(k); T.setMsg(null); };
  const onFmt = (f) => {
    if (!canTap || solved || !selW) return;
    if (f !== 'b') { T.miss(c.wrongTool, sayNow); return; }
    if (selW !== key) { T.miss(c.wrongWord, sayNow); return; }
    T.hit(); sfx('ok', true); setBold([key]); setSelW(null); put({ done: true });
    log(logOf(T, 's6', 'bold-key'));
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, solved ? null : selW === key ? '[data-f="b"]' : '[data-w="' + key + '"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={selW ? 'tl3-fmton' : ''}>
            <TPage3 blocks={[B3.title, B3.lead, B3.text]} selW={selW} boldSet={bold} onWord={!solved && canTap ? onWord : null} />
            {selW ? <TFmt onFmt={onFmt} off={!canTap} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ЗАКРЕПЛЕНИЕ «СРАВНИ» — две схемы сайта с одним текстом: стена жирным и заголовок + абзацы + одно жирное слово.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const log = useLog();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [ok, setOk] = useState(solved);
  const [bad, setBad] = useState(false);
  const misses = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tap = (k) => {
    if (!canTap || ok) return;
    if (k !== 'b') { misses.current += 1; setBad(true); setTimeout(() => setBad(false), 700); sfx('soft', true); sayNow(c.wrong, 'think'); return; }
    sfx('ok', true); setOk(true); put({ done: true });
    log({ screenId: 's7', type: 'compare', correct: true, firstTry: misses.current === 0, attempts: misses.current + 1, hints: 0, depth: 0 });
    sayNow(c.ok, 'cheer');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} />
        <div className="kz-scene tl-scene tl3-cmp">
          {['a', 'b'].map((k) => (
            <button key={k} type="button" data-v={k} disabled={!canTap || ok}
              className={'tl3-cmp-c' + (ok && k === 'b' ? ' is-ok' : '') + (bad && k === 'a' ? ' is-bad' : '')} onClick={() => tap(k)}>
              <span className="tl3-cmp-l" translate="no">{k.toUpperCase()}</span>
              <TSchema good={k === 'b'} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ПОКАЗ «КНОПКА» — указатель: «ВСЕ БЛОКИ» → «Кнопка» → BF101; кнопка встаёт после текста с надписью «Button»;
// «Контент» → поле текста печатается заново («Batafsil»).
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const key = keyOf(pick, 5, PAGE3.key);
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [lib, setLib] = useState(false);
  const [cat, setCat] = useState(null);
  const [btn, setBtn] = useState(solved ? 'demo' : null);    // null — кнопки нет; 'def' — «Button»; 'demo' — свой текст
  const [sel, setSel] = useState(null);
  const [cnt, setCnt] = useState(false);
  const [typed, setTyped] = useState("Let's go!");
  const [born, setBorn] = useState(null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const typeIn = (s) => { setTyped(''); const chars = Array.from(s); chars.forEach((ch, i) => tm.current.push(setTimeout(() => setTyped(chars.slice(0, i + 1).join('')), (i + 1) * 70 * ms))); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => G.go('.tl-all', 0.5, 0.5) }, { wait: 800 * ms }, { act: () => { G.tap(); setLib(true); } }, { wait: 500 * ms },
    { act: () => G.go('[data-v="cat7"]', 0.4, 0.5) }, { wait: 800 * ms }, { act: () => { G.tap(); setCat(CAT_BTN3); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => G.go('[data-v="BF101"] .tl3-th', 0.5, 0.5) }, { wait: 800 * ms },
    { act: () => { G.tap(); setLib(false); setCat(null); sfx('pop', true); setBtn('def'); setBorn('b'); } }, { wait: 600 * ms },
    { act: () => { scrollToSel('[data-b="b"]'); G.go('[data-b="b"]', 0.5, 0.6); } }, { wait: 600 * ms },
    { say: [{ text: c.steps[1], pose: 'think' }] },
    { act: () => { G.tap(); setSel('b'); } }, { wait: 500 * ms },
    { act: () => G.go('[data-b="b"] [data-t="content"]', 0.5, 0.5) }, { wait: 800 * ms },
    { act: () => { G.tap(); setCnt(true); } }, { wait: 500 * ms },
    { act: () => { typeIn(pick(c.demoText)); } }, { wait: 1400 * ms },
    { say: [{ text: c.steps[2], pose: 'point' }] },
    { act: () => { G.go('.tl3-cnt-sc', 0.5, 0.5); } }, { wait: 700 * ms },
    { act: () => { G.tap(); setCnt(false); setSel(null); setBtn('demo'); sfx('ok', true); } }, { wait: 400 * ms },
    { act: () => { G.hide(); put({ done: true }); } }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const btnB = btn ? Object.assign({}, B3.button, { t: btn === 'demo' ? c.demoText : null }) : null;
  const blocks = [B3.title, B3.text].concat(btnB ? [btnB] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub">
            <TPage3 blocks={blocks} boldSet={[key]} sel={sel} born={born} lite onContent={sel ? () => {} : null} />
            <TDock />
            {lib ? <TLib3 cat={cat} off /> : null}
            {cnt ? <TContent3 value={typed} typing /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЗАДАНИЕ «ДОБАВЬ КНОПКУ» — «ВСЕ БЛОКИ» → «Кнопка» → BF101. Чужой раздел и платный блок (замок) — свои причины.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const log = useLog();
  const key = keyOf(pick, 5, PAGE3.key);
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);
  const [cat, setCat] = useState(null);
  const [flash, setFlash] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const open = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); };
  const onCat = (i) => {
    if (!canTap || st < 1 || st > 2) return;
    if (i !== CAT_BTN3) { setCat(null); setSt(1); T.miss(c.wrongCat, sayNow); return; }
    T.hit(); sfx('tap', true); setCat(i); setSt(2);
  };
  const onCard = (card) => {
    if (!canTap || st !== 2) return;
    if (card.lock) { setFlash(card.id); setTimeout(() => setFlash(null), 600); T.miss(c.locked, sayNow); return; }
    T.hit(); sfx('ok', true); setSt(3); setCat(null); put({ done: true });
    log(logOf(T, 's9', 'add-button', { value: card.id }));
    sayNow(c.ok, 'cheer');
  };
  const blocks = [B3.title, B3.lead, B3.text].concat(st === 3 ? [Object.assign({}, B3.button, { t: null })] : []);
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, st === 0 ? '.tl-all' : st === 1 ? '[data-v="cat7"]' : st === 2 ? '[data-v="BF101"] .tl3-th' : null, canTap);
  useEffect(() => { if (st === 3) setTimeout(() => scrollToSel('[data-b="b"]'), 150); }, [st]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 3 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage3 blocks={blocks} boldSet={[key]} born={st === 3 ? 'b' : null} />
            <TDock led={canTap && st === 0} onAll={canTap && st === 0 ? open : null} />
            {st === 1 || st === 2 ? <TLib3 cat={cat} onCat={onCat} onCard={onCard} off={!canTap} flash={flash} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ЗАДАНИЕ «ТЕКСТ КНОПКИ» — нажать кнопку на странице → «Контент» → выбрать текст: «Klubga yozilish» (верно),
// «Bosing» и «Button» — свои причины.
// =============================================================================
const BTN_OPTS = ['go', 'en', 'join'];
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const log = useLog();
  const store = useStore();
  const key = keyOf(pick, 5, PAGE3.key);
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);      // 0 — выбрать кнопку, 1 — «Контент», 2 — выбрать текст, 3 — готово
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onSel = (u) => { if (!canTap || st !== 0) return; if (u !== 'b') { sfx('tap', true); return; } T.hit(); sfx('tap', true); setSt(1); };
  const onContent = () => { if (!canTap || st !== 1) return; T.hit(); sfx('pop', true); setSt(2); };
  const onOpt = (k) => {
    if (!canTap || st !== 2) return;
    if (k !== 'join') { setBad(k); setTimeout(() => setBad(null), 700); T.miss(k === 'go' ? c.wrongGo : c.wrongEn, sayNow); return; }
    T.hit(); sfx('ok', true); store.set('tl3Btn', 'join'); setSt(3); put({ done: true });
    log(logOf(T, 's10', 'button-text', { value: 'join' }));
    sayNow(c.ok, 'cheer');
  };
  const btnB = Object.assign({}, B3.button, { t: st === 3 ? c.opts.join : null, flash: st === 3 });
  const groot = useRef(null);
  const G = useGuide(groot);
  useEffect(() => { const t = setTimeout(() => scrollToSel('[data-b="b"]'), 300); return () => clearTimeout(t); }, []);
  usePoint2(G, st === 0 ? '[data-b="b"] .tl3-btn' : st === 1 ? '[data-b="b"] [data-t="content"]' : st === 2 && T.lad.lv >= 3 ? '[data-v="txt-join"]' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 3 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage3 blocks={[B3.title, B3.lead, B3.text, btnB]} boldSet={[key]} sel={st === 1 || st === 2 ? 'b' : null}
              onSel={canTap && st === 0 ? onSel : null} onContent={canTap && st === 1 ? onContent : null} contentLed={canTap && st === 1} lite />
            {st === 2 ? <TContent3 value="Let's go!" opts={BTN_OPTS.map((k) => [k, c.opts[k]])} onOpt={canTap ? onOpt : null} bad={bad} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ЗАДАНИЕ «МЕСТО КНОПКИ» — Коди поднял кнопку под обложку; ученик опускает её стрелкой ↓, пока она не встанет после
// текста. ↑ у кнопки, стрелки у другого блока и другие кнопки панели — свои причины.
// =============================================================================
const moveDown = (bs, u) => { const i = bs.findIndex((b) => b.u === u); if (i < 0 || i >= bs.length - 1) return bs; const o = bs.slice(); [o[i], o[i + 1]] = [o[i + 1], o[i]]; return o; };
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const log = useLog();
  const key = keyOf(pick, 5, PAGE3.key);
  const btnB = useBtnBlock();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const start = [B3.cover, btnB, B3.title, B3.lead, B3.text];
  const end = [B3.cover, B3.title, B3.lead, B3.text, btnB];
  const [blocks, setBlocks] = useState(solved ? end : start);
  const [sel, setSel] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'shy' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onTool = (u, t) => {
    if (!canTap || solved) return;
    if (t !== 'up' && t !== 'down') { T.miss(c.wrongTool, sayNow); return; }
    if (u !== 'b') { T.miss(c.wrongBlock, sayNow); return; }
    if (t === 'up') { T.miss(c.wrongUp, sayNow); return; }
    T.hit(); sfx('pop', true);
    const nb = moveDown(blocks, 'b');
    setBlocks(nb);
    setTimeout(() => scrollToSel('[data-b="b"]'), 60);
    if (nb[nb.length - 1].u === 'b') {
      setSel(null); put({ done: true });
      log(logOf(T, 's11', 'move-button'));
      sayNow(c.ok, 'cheer');
    }
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, solved ? null : sel === 'b' ? '[data-b="b"] [data-t="down"]' : '[data-b="b"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage3 blocks={blocks} boldSet={[key]} sel={solved ? null : sel}
              onSel={canTap && !solved ? (u) => { if (u !== sel) sfx('tap', true); setSel(u); T.setMsg(null); } : null}
              onTool={canTap && !solved ? onTool : null} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ПРОВЕРКА «ЧТО ЛУЧШЕ?» — 4 вопроса, в каждом два варианта (кнопка, жирное слово, место кнопки, заголовок).
// =============================================================================
function BoldLine({ s }) {
  return <>{String(s).split('||').map((t, i) => (i % 2 ? <b key={i}>{t}</b> : <span key={i}>{t}</span>))}</>;
}
function QOpt({ R, side, pick }) {
  const txt = pick(side === 'a' ? R.A : R.B);
  if (R.kind === 'btn') return <span className="tl3-btn is-mini">{txt}</span>;
  if (R.kind === 'bold') return <span className="tl3-qtx"><BoldLine s={txt} /></span>;
  if (R.kind === 'title') return <span className="tl3-qh">{txt}</span>;
  const before = side === 'a';
  return (
    <span className="tl3-qpos">
      <span className={'tl3-sch is-good is-mini' + (before ? ' is-btn-top' : '')} aria-hidden="true">
        <i className="is-h" />{before ? <i className="is-btn" /> : null}<span className="tl3-sch-p"><i /><i className="is-s" /></span><span className="tl3-sch-p"><i /><i className="is-s" /></span>{before ? null : <i className="is-btn" />}
      </span>
      <em>{txt}</em>
    </span>
  );
}
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const log = useLog();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okK, setOkK] = useState(solved ? c.rounds[c.rounds.length - 1].a : null);
  const [bad, setBad] = useState(null);
  const misses = useRef(0);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const R = c.rounds[r];
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tap = (k) => {
    if (!canTap || solved || okK) return;
    if (k !== R.a) {
      misses.current += 1; setBad(k); sfx('soft', true);
      sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump();
      setTimeout(() => setBad(null), 700);
      return;
    }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's12', type: 'good-or-bad', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene tl-scene tl3-quiz">
          <div className="tl2-qn" aria-live="polite">
            <span className="tl2-qdots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <b key={r} className="kz-a-drop">{pick(R.q)}</b>
          </div>
          <div key={'o' + r} className="tl3-qopts kz-a-drop">
            {['a', 'b'].map((k) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK}
                className={'tl3-qo' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)}>
                <span className="tl3-cmp-l" translate="no">{k.toUpperCase()}</span>
                <QOpt R={R} side={k} pick={pick} />
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. В НАСТОЯЩЕЙ TILDA — шаги списком; адрес своего сайта (…tilda.ws) или «Сделаю позже».
// =============================================================================
const tildaUrl = (v) => String(v || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(solved ? (store.get('tl3RealUrl') || '') : '');
  const [msg, setMsg] = useState(null);
  const tries = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? (rec.later ? c.okLater : c.ok) : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const u = tildaUrl(val);
    if (!/^[a-z0-9][a-z0-9-]*\.tilda\.ws$/.test(u)) { sfx('soft', true); setMsg(c.bad); sayNow(c.bad, 'think'); return; }
    if (u === SITE_URL) { sfx('soft', true); setMsg(c.demo); sayNow(c.demo, 'think'); return; }
    sfx('win', true); setMsg(null); store.set('tl3RealUrl', u); put({ done: true, later: false });
    log({ screenId: 's13', type: 'real-tilda', correct: true, firstTry: tries.current === 1, attempts: tries.current, hints: 0, depth: 0, value: u });
    sayNow(c.ok, 'cheer');
  };
  const later = () => {
    if (!canTap || solved) return;
    sfx('tap', true); put({ done: true, later: true });
    log({ screenId: 's13', type: 'real-tilda', correct: false, firstTry: false, attempts: tries.current, hints: 0, depth: 0, value: 'later' });
    sayNow(c.okLater, 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={nav3(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={msg} err={!!msg} />
        <div className="kz-scene tl-scene">
          <ol className="tl-real">{c.steps.map((st, i) => <li key={i}><b>{i + 1}</b><span>{pick(st)}</span></li>)}</ol>
          <div className="tl-real-in">
            <span className="tl-url is-field"><i className="tl-globe" aria-hidden="true" />
              <input value={val} placeholder={pick(c.ph)} aria-label={pick(c.ask)} disabled={solved} data-v="url"
                onChange={(e) => { setVal(e.target.value); setMsg(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } }}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} inputMode="url" enterKeyHint="done" />
            </span>
            {!solved ? (
              <span className="tl-real-btns">
                <button type="button" className="kz-btn is-coral" data-v="check" disabled={!canTap || !val.trim()} onClick={check}>{pick(c.check)}</button>
                <button type="button" className="kz-btn is-ghost" data-v="later" disabled={!canTap} onClick={later}>{pick(c.later)}</button>
              </span>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ВЫВОД — разгадка, сайт клуба целиком (обложка, заголовок, лид, три абзаца с одним жирным словом, кнопка после
// текста), что умеем, следующий урок.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const key = keyOf(pick, 5, PAGE3.key);
  const btnB = useBtnBlock();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'shy' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="tl-sheet">
        <div className="kz-scene tl-scene tl-end tl2-end">
          <div className="tl-ed is-live tl2-live" translate="no">
            <div className="tl-url"><i className="tl-globe" aria-hidden="true" /><span>{SITE_URL}</span></div>
            <div className="tl2-canvas"><TPage3 blocks={[B3.cover, B3.title, B3.lead, B3.text, btnB]} boldSet={[key]} /></div>
          </div>
          <div className="kz-roles tl-roles">
            {['riddle', 'kinds', 'bold', 'button'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'kinds' ? '#0FA38E' : k === 'bold' ? '#7952B3' : '#D97706' }}>
                <i aria-hidden="true" />{pick(c.roles[k])}
              </span>
            ))}
          </div>
          <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'LEVEL-2', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-2', Comp: S9 }, { id: 's10', code: 'LEVEL-2', Comp: S10 },
  { id: 's11', code: 'LEVEL-3', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 }, { id: 's13', code: 'CHECK', Comp: S13 },
  { id: 's14', code: 'ACHIEVEMENT', Comp: S14 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonTl3Artifact(store) {
  if (!store.get('tl3Btn')) return null;
  return { type: 'tilda-text-button', blocks: ['CR28', 'TL02', 'TX02', 'TX01', 'BF101'], button: store.get('tl3Btn'), boldKeyWord: true,
    realUrl: store.get('tl3RealUrl') ? 'https://' + store.get('tl3RealUrl') : null };
}

export default function TildaTekstKnopki({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonTl3Artifact(store) })
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
