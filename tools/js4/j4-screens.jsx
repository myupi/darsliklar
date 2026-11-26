// =============================================================================
// ЭКРАНЫ УРОКА 4 КУРСА JAVASCRIPT «Операторы» (облик «Редактор», 26.11.2026).
// Основа — урок 3 (tools/js3/j3-screens.jsx): помощники, Predict, StepShow, «найди сломанную строку», «верно или нет»,
// вывод. Своё: полоса «Расчёт» (JsCalc) под кодом — выражение по шагам; магазин, «какой знак», = или ===, скобки, босс.
// =============================================================================
const sp1 = () => <span className="c1-sp">{' '}</span>;
const spaced1 = (parts) => (parts || []).map((x) => (x === ' ' ? sp1() : x));
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced1(parts) }, extra || {});
const CYR_JS = L3("Harflar kirillchada yozilganga o'xshaydi. JavaScript buyruqlari lotin harflarida yoziladi: klaviaturani EN ga almashtiring.",
  'Похоже, буквы набраны по-русски. Команды JavaScript пишут английскими буквами: переключи клавиатуру на EN.',
  'Looks like some letters are Cyrillic. JavaScript commands use English letters: switch your keyboard to EN.');
const hasCyr = (s) => /[Ѐ-ӿ]/.test(String(s || '').replace(/(["'`]).*?\1/g, ''));
const HELP_CODE = L3('Namuna', 'Образец', 'Example');
function HelpCode({ code }) {
  const pick = usePick();
  return <div className="kz-helpcode" translate="no"><span>{pick(HELP_CODE)}</span><code>{code}</code></div>;
}
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
const shake = (set, k) => { set(k); setTimeout(() => set(null), 700); };
const arrOf = (pick, x) => (Array.isArray(x) ? x : pick(x));
// Кнопка «Запустить» (без клавиш символов).
function RunBar({ onRun, ready, canTap, label }) {
  const pick = usePick();
  return (
    <div className="keys j1-runbar" translate="no">
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={onRun}>▶ {pick(label || UI.run)}</button>
    </div>
  );
}
// Общий ход задания с запуском кода: попытки, ступени помощи, сообщение.
function useRunTask(hints) {
  const lad = useKzLadder(true);
  const [msg, setMsg] = useState(null);
  const st = useRef({ tries: 0, misses: 0 });
  return {
    lad, msg, setMsg, st,
    miss: (m, sayNow) => { st.current.tries += 1; st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); },
    hit: () => { st.current.tries += 1; setMsg(null); },
    now: () => msg || hintAt(lad.lv, hints),
    next: () => hintAt(Math.min(3, lad.lv + 1), hints),
    logRec: (id, type, extra) => Object.assign({ screenId: id, type: type, correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv }, extra || {})
  };
}
// Куски строки console.log(…) с полем внутри.
const P_ = (k, c, t) => <span key={k} className={c}>{t}</span>;
const logHead = () => [P_('o', 'j1-obj', 'console'), P_('d', 'j1-punc', '.'), P_('f', 'j1-fn', 'log'), P_('p', 'j1-punc', '(')];
const gapOf = (k, ty, setMsg, onEnter, ph, label, max, led, wide) => (
  <span key={k} className={'kz-gap c1-slot' + (wide ? ' j1-wide' : '') + (led ? ' kz-gap-led' : '')}>
    <InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={onEnter} placeholder={ph} label={label} max={max} />
  </span>
);
// Строки кода из массива с подсветкой выполнения.
const traceLines = (code, A, extra) => code.map((t, i) => jsL('l' + i, 0, t, Object.assign({ cls: execCls(A, i + 1) }, extra ? extra(i) : {})));


// Шаги «Расчёта» для строки upto или ближайшей выше, где есть действие.
function lastCalc(code, tr, upto) {
  for (let n = Math.min(upto, code.length); n >= 1; n -= 1) { const st = calcAt(code, tr, n); if (st.length) return st; }
  return [];
}

// =============================================================================
// S1. КРЮЧОК — магазин: coins = coins - price; console.log(coins > price); «Купить меч» трижды. Загадка.
// =============================================================================
const S1_CODE = ['let coins = 100;', 'let price = 30;', 'coins = coins - price;', 'console.log(coins > price);'];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [coins, setCoins] = useState(solved ? 10 : 100);
  const [cur, setCur] = useState(null);
  const [logs, setLogs] = useState(solved ? [true, true, false] : []);
  const [steps, setSteps] = useState([]);
  const [ch, setCh] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const busy = cur != null;
  const poor = coins < 30;
  const mem = (v) => [{ name: 'coins', kind: 'let', val: v }, { name: 'price', kind: 'let', val: 30 }];
  const buy = () => {
    if (!canTap || busy || poor) return;
    const v = coins - 30;
    const ms = reduceMotion() ? 0.05 : 1;
    sfx('pop', true); setCur(3); setSteps(jsCalc(S1_CODE[2], mem(coins)));
    tm.current.push(setTimeout(() => { setCoins(v); setCh(true); }, 1500 * ms));
    tm.current.push(setTimeout(() => { setCur(4); setCh(false); setSteps(jsCalc(S1_CODE[3], mem(v))); }, 2300 * ms));
    tm.current.push(setTimeout(() => { setLogs((l) => l.concat([v > 30])); }, 3700 * ms));
    tm.current.push(setTimeout(() => {
      setCur(null);
      if (v === 70) sayNow(c.buy, 'smile');
      if (v < 30 && !solved) { put({ done: true }); sfx('soft', true); sayNow(c.works, 'wonder'); say(c.riddle, 'curious'); }
    }, 4100 * ms));
  };
  const done = solved || (poor && !busy);
  const ask = done ? c.askDone : coins === 100 ? c.ask : c.askMore;
  const items = logs.map((v) => ({ type: 'log', text: String(v), num: true, line: 4 }));
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={S1_CODE.map((t, i) => jsL('l' + i, 0, t, { cls: cur === i + 1 ? ' is-exec' : '' }))} cls="kz-code-sm j1-js j1-num" />
            {steps.length ? <JsCalc steps={steps} /> : null}
            <button type="button" className={'j4-buy' + (canTap && !busy && !poor ? ' is-led' : '')} onClick={buy} disabled={!canTap || busy || poor}>
              <i aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M14.5 3.5 20.5 3.5 20.5 9.5 10 20 7 20 4 17 4 14Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M3 21l3-3M8 13l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></i><span>{pick(poor ? UI.poor : UI.buy)}</span><b>30</b>
            </button>
          </div>
          <div className="kz-col"><JsSide mem={[{ name: 'coins', kind: 'let', val: coins, ch }, { name: 'price', kind: 'let', val: 30 }]} items={items} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Показы по строкам и предсказания.
const S2_CODE = ['let a = 10;', 'console.log(a + 5);', 'console.log(a - 3);', 'console.log(a * 2);', 'console.log(a / 4);'];
const S2 = ({ p }) => <StepShow p={p} id="s2" code={S2_CODE} plan={[{ lines: [1, 2], pose: 'point' }, { lines: [3, 4], pose: 'explain' }, { lines: [5], pose: 'smile' }]} />;
const S5_CODE = ['let score = 120;', 'console.log(score > 100);', 'console.log(score < 50);', 'let level = 3;', 'console.log(level > 3);'];
const S5 = ({ p }) => <StepShow p={p} id="s5" code={S5_CODE} plan={[{ lines: [1, 2], pose: 'point' }, { lines: [3], pose: 'explain' }, { lines: [4, 5], pose: 'think' }]} />;
const S8_CODE = ['let answer = 5;', 'console.log(answer === 5);', 'console.log(answer === 7);', 'console.log("5" === 5);'];
const S8 = ({ p }) => <StepShow p={p} id="s8" code={S8_CODE} plan={[{ lines: [1, 2], pose: 'point' }, { lines: [3], pose: 'explain' }, { lines: [4], pose: 'wonder' }, { lines: [], pose: 'smile' }]} />;
const S11_CODE = ['console.log(2 + 3 * 4);', 'console.log((2 + 3) * 4);'];
const S11 = ({ p }) => <StepShow p={p} id="s11" code={S11_CODE} plan={[{ lines: [1], pose: 'wonder' }, { lines: [2], pose: 'explain' }, { lines: [], pose: 'smile' }]} />;
const S4 = ({ p }) => <Predict p={p} id="s4" type="predict-math" />;
const S6 = ({ p }) => <Predict p={p} id="s6" type="predict-compare" />;
const S10 = ({ p }) => <Predict p={p} id="s10" type="predict-equal" />;
const S13 = ({ p }) => <Predict p={p} id="s13" type="predict-order" />;

// =============================================================================
// S3. ЗАДАНИЕ «КАКОЙ ЗНАК?» — console.log(12 ? 3); в консоли нужно 4, 15, 36.
// =============================================================================
const OPS4 = ['+', '-', '*', '/'];
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [op, setOp] = useState(solved ? c.rounds[c.rounds.length - 1].a : null);
  const [okK, setOkK] = useState(solved);
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
  const line = 'console.log(12 ' + (op || '?') + ' 3);';
  const tr = useMemo(() => (op ? jsTrace([line]) : null), [op, r]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, r + ':' + op);
  const tap = (k) => {
    if (!canTap || solved || okK) return;
    setOp(k);
    if (k !== R.a) {
      const got = jsOp(k, 12, 3);
      misses.current += 1; shake(setBad, k); sfx('soft', true);
      sayNow(fillL(c.wrong, { got: String(got), want: String(R.want) }), 'think'); if (misses.current >= 2) lad.bump(); return;
    }
    sfx('ok', true); setOkK(true);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's3', type: 'pick-operator', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(false); setOp(null); }, reduceMotion() ? 300 : 2600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene j1-scene j1-pair j1-predict">
          <div className="kz-col">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <div className="j4-want" key={'w' + r}><span>{pick(UI.want)}</span><b className="kz-a-drop">{R.want}</b></div>
            <KzCode key={r + ':' + op} lines={[jsL('l0', 0, line, { cls: tr ? execCls(A, 1) : 'is-hl' }, op || '?')]} cls="kz-code-sm j1-js j1-num j2-big" />
            {tr ? <JsCalc steps={calcAt([line], tr, 1)} /> : null}
            <div className="j1-opts j4-ops">
              {OPS4.map((k) => (
                <button key={k} type="button" data-v={k} disabled={!canTap || solved || okK} className={'j1-opt j4-op' + (okK && op === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '') + (lad.lv >= 3 && !okK && k === R.a ? ' is-led' : '')} onClick={() => tap(k)} translate="no">{k}</button>
              ))}
            </div>
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ЗАДАНИЕ «УРОВЕНЬ ОТКРОЕТСЯ?» — let unlocked = …; → score > 100.
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const log = useLog();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 30 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let score = 150;', 'let unlocked = ' + v + ';', 'console.log(unlocked);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf(rec.v || 'score > 100')) : null);
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok && !ty.val, 0);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim().replace(/;$/, '');
    if (!v) { T.miss(c.msgs.empty, sayNow); return; }
    const t = jsTrace(codeOf(v));
    setTr(t); setRunN((x) => x + 1);
    if (hasCyr(v)) { T.miss(CYR_JS, sayNow); return; }
    if (jsErr(t.items)) { T.miss(c.msgs.syntax, sayNow); return; }
    const b = memVal(t, 'unlocked');
    if (!b || typeof b.val !== 'boolean') { T.miss(c.msgs.notBool, sayNow); return; }
    if (!/\bscore\b/.test(v)) { T.miss(c.msgs.noScore, sayNow); return; }
    if (!/\b100\b/.test(v)) { T.miss(c.msgs.no100, sayNow); return; }
    if (/===|==|!==|!=/.test(v)) { T.miss(c.msgs.eq, sayNow); return; }
    if (!b.val) { T.miss(c.msgs.dir, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s7', 'write-compare'));
    sayNow(c.ok, 'cheer');
  };
  const code = codeOf(ok ? (rec && rec.v ? rec.v : JS_Q(ty.val).trim().replace(/;$/, '')) : '…');
  const parts = [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'unlocked'), ' ', P_('e', 'j1-punc', '='), ' ', gapOf('g', ty, T.setMsg, run, L3('score …', 'score …', 'score …'), c.ask, 30, led, true), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(code, A) : [jsL('l0', 0, code[0], { cls: execCls(A, 1) }), codeLine('l1', parts, { cls: 'is-hl j1-line' + execCls(A, 2) }), jsL('l2', 0, code[2], { cls: tr ? execCls(A, 3) : ' j2-dim' })];
  const calcCode = tr ? codeOf(JS_Q(ty.val).trim().replace(/;$/, '') || (rec && rec.v) || 'score > 100') : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {tr && !jsErr(tr.items) ? <JsCalc steps={calcAt(calcCode, tr, 2)} /> : null}
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let unlocked = score > 100;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <KeyRow keys={['>', '<']} ty={ty} canTap={canTap} onCheck={run} ready={ty.val.trim().length > 6} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЗАДАНИЕ «= ИЛИ ===?» — 4 раунда.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const log = useLog();
  const [rec, put] = useRec('s9');
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
    if (k !== R.a) { misses.current += 1; shake(setBad, k); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's9', type: 'assign-or-equal', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1500);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene j1-scene j1-quiz">
          <div className="j1-qcard">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <b key={r} className="kz-a-drop">{pick(R.q)}</b>
          </div>
          <div className="j1-tf j4-eqs">
            {['=', '==='].map((k) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK} className={'j1-tfb j4-eqb' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)} translate="no">{k}</button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ЗАДАНИЕ «ПОСТАВЬ СКОБКИ» — let total = 2 + 3 * 4; → (2 + 3) * 4.
// =============================================================================
function S12({ p }) {
  const c = C.s12;
  const log = useLog();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 30 });
  useEffect(() => { if (!solved) ty.setVal('2 + 3 * 4'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let total = ' + v + ';', 'console.log(total);'];
  const [tr, setTr] = useState(jsTrace(codeOf(solved ? '(2 + 3) * 4' : '2 + 3 * 4')));
  const [cv, setCv] = useState(solved ? '(2 + 3) * 4' : '2 + 3 * 4');
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim().replace(/;$/, '');
    const t = jsTrace(codeOf(v || '0'));
    setTr(t); setCv(v); setRunN((x) => x + 1);
    if (jsErr(t.items)) { T.miss(c.msgs.syntax, sayNow); return; }
    const nums = (v.match(/\d+(\.\d+)?/g) || []).sort().join(',');
    if (nums !== '2,3,4') { T.miss(c.msgs.nums, sayNow); return; }
    const b = memVal(t, 'total');
    if (b && b.val === 14) { T.miss(c.msgs.still, sayNow); return; }
    if (!b || b.val !== 20) { T.miss(c.msgs.other, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true });
    log(T.logRec('s12', 'add-brackets'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'total'), ' ', P_('e', 'j1-punc', '='), ' ', gapOf('g', ty, T.setMsg, run, L3('…', '…', '…'), c.ask, 30, false, true), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(codeOf('(2 + 3) * 4'), A) : [codeLine('l0', parts, { cls: 'is-hl j1-line' + execCls(A, 1) }), jsL('l1', 0, 'console.log(total);', { cls: execCls(A, 2) })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!jsErr(tr.items) ? <JsCalc steps={calcAt(codeOf(ok ? '(2 + 3) * 4' : cv), tr, 1)} /> : null}
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let total = (2 + 3) * 4;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={A} /></div>
        </div>
        {!ok ? <KeyRow keys={['(', ')']} ty={ty} canTap={canTap} onCheck={run} ready={/\(/.test(ty.val) && /\)/.test(ty.val)} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ЗАДАНИЕ «ИТОГОВАЯ ЦЕНА» — let total = price * count; → 75.
// =============================================================================
function S15({ p }) {
  const c = C.s15;
  const log = useLog();
  const [rec, put] = useRec('s15');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 30 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let price = 25;', 'let count = 3;', 'let total = ' + v + ';', 'console.log(total);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf(rec.v || 'price * count')) : null);
  const [cv, setCv] = useState(solved ? rec.v || 'price * count' : '');
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok && !ty.val, 0);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim().replace(/;$/, '');
    if (!v) { T.miss(c.msgs.empty, sayNow); return; }
    const t = jsTrace(codeOf(v));
    setTr(t); setCv(v); setRunN((x) => x + 1);
    if (hasCyr(v)) { T.miss(CYR_JS, sayNow); return; }
    const e = jsErr(t.items);
    if (e) { T.miss(/is not defined/.test(e.text) ? c.msgs.name : c.msgs.syntax, sayNow); return; }
    const b = memVal(t, 'total');
    if (!b || b.val !== 75) { T.miss(fillL(c.msgs.value, { got: b ? sayHide(memShow(b.val)) : '?' }), sayNow); return; }
    if (!/\bprice\b/.test(v) || !/\bcount\b/.test(v)) { T.miss(c.msgs.names, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s15', 'write-expression'));
    sayNow(c.ok, 'cheer');
  };
  const code = codeOf(ok ? cv || 'price * count' : '…');
  const parts = [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'total'), ' ', P_('e', 'j1-punc', '='), ' ', gapOf('g', ty, T.setMsg, run, L3('…', '…', '…'), c.ask, 30, led, true), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(code, A) : [jsL('l0', 0, code[0], { cls: execCls(A, 1) }), jsL('l1', 0, code[1], { cls: execCls(A, 2) }), codeLine('l2', parts, { cls: 'is-hl j1-line' + execCls(A, 3) }), jsL('l3', 0, code[3], { cls: tr ? execCls(A, 4) : ' j2-dim' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {tr && !jsErr(tr.items) ? <JsCalc steps={calcAt(codeOf(cv), tr, 3)} /> : null}
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let total = price * count;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <KeyRow keys={['*', '+']} ty={ty} canTap={canTap} onCheck={run} ready={ty.val.trim().length > 6} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S16. ЗАДАНИЕ «БОЙ С БОССОМ» — attack и hits; bossHp = bossHp - attack * hits; bossHp > 0 → false.
// =============================================================================
const s16Code = (v) => ['let bossHp = 100;', 'let attack = ' + v[0] + ';', 'let hits = ' + v[1] + ';', 'bossHp = bossHp - attack * hits;', 'console.log(bossHp);', 'console.log(bossHp > 0);'];
function S16({ p }) {
  const c = C.s16;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s16');
  const solved = !!(rec && rec.done);
  const t1 = useTagTyping({ max: 4 }), t2 = useTagTyping({ max: 4 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const [cv, setCv] = useState(solved ? rec.v : null);
  const [tr, setTr] = useState(solved ? jsTrace(s16Code(rec.v)) : null);
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = [t1.val.trim(), t2.val.trim()];
    if (v.some((x) => !x)) { T.miss(c.msgs.empty, sayNow); return; }
    if (!/^\d{1,4}$/.test(v[0]) || !/^\d{1,4}$/.test(v[1])) { T.miss(c.msgs.num, sayNow); return; }
    const t = jsTrace(s16Code(v));
    setTr(t); setCv(v); setRunN((x) => x + 1);
    const hp = memVal(t, 'bossHp');
    if (hp && hp.val > 0) { T.miss(fillL(c.msgs.alive, { hp: String(hp.val) }), sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    store.set('j4Prog', s16Code(v));
    log(T.logRec('s16', 'boss-fight'));
    sayNow(c.ok, 'cheer');
  };
  const f = (ty, k, ph) => gapOf(k, ty, T.setMsg, run, ph, c.ask, 4, false);
  const lines = ok ? traceLines(s16Code(cv), A) : [
    jsL('l0', 0, 'let bossHp = 100;', { cls: execCls(A, 1) }),
    codeLine('l1', [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'attack'), ' ', P_('e', 'j1-punc', '='), ' ', f(t1, 'f1', c.ph[0]), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' + execCls(A, 2) }),
    codeLine('l2', [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'hits'), ' ', P_('e', 'j1-punc', '='), ' ', f(t2, 'f2', c.ph[1]), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' + execCls(A, 3) }),
    jsL('l3', 0, 'bossHp = bossHp - attack * hits;', { cls: tr ? execCls(A, 4) : ' j2-dim' }), jsL('l4', 0, 'console.log(bossHp);', { cls: tr ? execCls(A, 5) : ' j2-dim' }), jsL('l5', 0, 'console.log(bossHp > 0);', { cls: tr ? execCls(A, 6) : ' j2-dim' })
  ];
  const calcCode = cv ? s16Code(cv) : null;
  const calcLine = A.cur && A.cur >= 4 ? A.cur : 4;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {calcCode && (A.cur == null || A.cur >= 4) ? <JsCalc steps={lastCalc(calcCode, tr, A.cur == null ? 6 : calcLine)} /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={!!(t1.val.trim() && t2.val.trim())} canTap={canTap} /> : null}
      </Sheet>
    </StageB>
  );
}


// =============================================================================
// ПРЕДСКАЗАНИЕ (s4, s6, s10, s13) — раунды: код, варианты; после верного ответа код выполняется по строкам.
// =============================================================================
function Predict({ p, id, type }) {
  const pick = usePick();
  const c = C[id];
  const log = useLog();
  const [rec, put] = useRec(id);
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
  const code = arrOf(pick, R.code);
  const opts = arrOf(pick, R.opts);
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tr = useMemo(() => (okK != null ? jsTrace(code) : null), [okK, r, code.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, r);
  const tap = (i) => {
    if (!canTap || solved || okK != null) return;
    if (i !== R.a) { misses.current += 1; shake(setBad, i); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(i);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: id, type: type, correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 2300 + code.length * 500);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene j1-scene j1-pair j1-predict">
          <div className="kz-col">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK != null) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <KzCode key={r} lines={traceLines(code, okK != null ? A : null)} cls="kz-code-sm j1-js j1-num" />
            {okK != null && tr ? <JsCalc steps={lastCalc(code, tr, A.cur == null ? code.length : A.cur)} /> : null}
            <div className="j1-opts" key={'o' + r}>
              {opts.map((o, i) => (
                <button key={i} type="button" data-v={'o' + i} disabled={!canTap || solved || okK != null} className={'j1-opt kz-a-drop' + (okK === i ? ' is-ok' : '') + (bad === i ? ' is-bad' : '') + (o === 'err' ? ' is-err' : '')} onClick={() => tap(i)} translate="no">
                  {o === 'err' ? pick(UI.err) : o}
                </button>
              ))}
            </div>
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ПОКАЗ ПО СТРОКАМ (s2, s5, s8, s11) + «Расчёт» текущей строки — код целиком, строки выполняются по шагам показа; k — сколько строк выполнено.
// =============================================================================
function StepShow({ p, id, code, plan }) {
  const c = C[id];
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [k, setK] = useState(solved ? code.length : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const steps = [];
  plan.forEach((pl, i) => {
    pl.lines.forEach((ln, j) => { steps.push({ act: () => { sfx(pl.err && j === pl.lines.length - 1 ? 'soft' : 'pop', true); setK(ln); } }); steps.push({ wait: 650 * ms }); });
    steps.push({ say: [{ text: c.steps[i], pose: pl.pose || 'point' }] });
  });
  steps.push({ act: () => put({ done: true }) });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const tr = useMemo(() => jsTrace(code), [code.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = { cur: k > 0 && k <= tr.n ? k : null, errLine: null };
  const errIt = tr.items.find((x) => x.type === 'err' && x.line <= k);
  if (errIt) A.errLine = errIt.line;
  const lines = code.map((t, i) => jsL('l' + i, 0, t, { cls: i + 1 > k ? ' j2-dim' : A.errLine === i + 1 ? ' is-err-line' : i + 1 === k ? ' is-exec' : ' is-past' }));
  const mem = k > 0 ? tr.mem[Math.min(k, tr.mem.length) - 1] || [] : [];
  const items = tr.items.filter((x) => x.line <= k);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num" /><JsCalc steps={lastCalc(code, tr, k)} /></div>
          <div className="kz-col"><JsSide mem={mem} items={items} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ЗАДАНИЕ «НАЙДИ СЛОМАННУЮ СТРОКУ» — по консоли; 2 раунда.
// =============================================================================
function S14({ p }) {
  const c = C.s14;
  const log = useLog();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okR, setOkR] = useState(solved);
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
  const tap = (i) => {
    if (!canTap || solved || okR) return;
    if (i !== R.bad) { misses.current += 1; shake(setBad, i); sfx('soft', true); sayNow(misses.current >= 2 ? joinL(c.wrong, c.hint2) : c.wrong, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkR(true);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's14', type: 'find-error-line', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkR(false); }, reduceMotion() ? 300 : 1900);
  };
  const RL = arrOf(usePick(), R.lines);
  const tr = useMemo(() => jsTrace(RL), [r, RL.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, r);
  const lines = RL.map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A, i + 1) + (okR && i === R.bad ? ' is-err-line is-found' : '') + (bad === i ? ' is-bad' : '') + (lad.lv >= 3 && !okR && i === R.bad ? ' is-hl' : ''),
    onTap: canTap && !solved && !okR ? () => tap(i) : null, disabled: !canTap }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okR) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <KzCode key={r} lines={lines} cls="kz-code-sm j1-js j1-num" />
          </div>
          <div className="kz-col"><JsSide anim={A} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S17. ПРОВЕРКА «ВЕРНО ИЛИ НЕТ» — 5 утверждений.
// =============================================================================
function S17({ p }) {
  const pick = usePick();
  const c = C.s17;
  const log = useLog();
  const [rec, put] = useRec('s17');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okK, setOkK] = useState(solved ? String(c.rounds[c.rounds.length - 1].a) : null);
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
  const tap = (v) => {
    if (!canTap || solved || okK) return;
    if (v !== R.a) { misses.current += 1; shake(setBad, String(v)); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(String(v));
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's17', type: 'true-false', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene j1-scene j1-quiz">
          <div className="j1-qcard">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <b key={r} className="kz-a-drop" translate="no">{pick(R.q)}</b>
          </div>
          <div className="j1-tf">
            {[true, false].map((v) => (
              <button key={String(v)} type="button" data-v={String(v)} disabled={!canTap || solved || !!okK} className={'j1-tfb is-' + v + (okK === String(v) ? ' is-ok' : '') + (bad === String(v) ? ' is-bad' : '')} onClick={() => tap(v)}>
                {pick(v ? UI.yes : UI.no)}
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S18. ВЫВОД — разгадка; бой ученика из s16 с «Памятью» и «Расчётом»; что умеем; следующий урок.
// =============================================================================
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const prog = store.get('j4Prog') || s16Code(['25', '4']);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'shy' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tr = useMemo(() => jsTrace(prog), [prog.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="j1-sheet">
        <div className="kz-scene j1-scene j1-end">
          <div className="j1-endpair">
            <div className="j4-endcode"><KzCode lines={traceLines(prog, A)} cls="kz-code-sm j1-js j1-num" /><JsCalc steps={lastCalc(prog, tr, A.cur == null ? 4 : A.cur)} /></div>
            <JsSide anim={A} />
          </div>
          <div className="kz-roles j1-endroles">
            {['riddle', 'math', 'cmp', 'eq'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'math' ? '#16A34A' : k === 'cmp' ? '#2563EB' : '#7C3AED' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'CHECK', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-1', Comp: S9 }, { id: 's10', code: 'CHECK', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-2', Comp: S12 }, { id: 's13', code: 'CHECK', Comp: S13 },
  { id: 's14', code: 'LEVEL-2', Comp: S14 }, { id: 's15', code: 'LEVEL-3', Comp: S15 }, { id: 's16', code: 'LEVEL-3', Comp: S16 },
  { id: 's17', code: 'CHECK', Comp: S17 }, { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonJs4Artifact(store) {
  const prog = store.get('j4Prog');
  return prog ? { type: 'js-operators', code: prog.join('\n') } : null;
}

export default function JsOperatory({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonJs4Artifact(store) })
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


