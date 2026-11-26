// =============================================================================
// ЭКРАНЫ УРОКА 3 КУРСА JAVASCRIPT «Типы данных» (облик «Редактор», 26.11.2026).
// Основа — урок 2 (tools/js2/j2-screens.jsx): общие помощники, Predict (угадай вывод), StepShow (показ по строкам),
// «найди сломанную строку», «верно или нет», вывод. Своё: «Память» по типам (j3-engine.jsx), «какой тип», true, typeof.
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


// =============================================================================
// ПРЕДСКАЗАНИЕ (s4, s8, s14) — раунды: код, варианты; после верного ответа код выполняется по строкам.
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
// ПОКАЗ ПО СТРОКАМ (s6, s9) — код целиком, строки выполняются по шагам показа; k — сколько строк выполнено.
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
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num" /></div>
          <div className="kz-col"><JsSide mem={mem} items={items} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S1. КРЮЧОК — сохранение игры: name, coins, hasKey → три коробки трёх цветов. Загадка.
// =============================================================================
const S1_CODE = ['let name = "Kodi";', 'let coins = 120;', 'let hasKey = true;'];
function S1({ p }) {
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [tr, setTr] = useState(solved ? jsTrace(S1_CODE) : null);
  const A = useTraceAnim(tr, solved ? 0 : 1);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const save = () => {
    if (!canTap || tr) return;
    sfx('pop', true); setTr(jsTrace(S1_CODE));
    tm.current = setTimeout(() => { put({ done: true }); sfx('win', true); sayNow(c.works, 'wonder'); say(c.riddle, 'curious'); }, reduceMotion() ? 200 : 2100);
  };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved ? c.askDone : c.ask} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={traceLines(S1_CODE, tr ? A : null)} cls="kz-code-sm j1-js j1-num j2-big" /></div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!tr ? <RunBar onRun={save} ready canTap={canTap} label={UI.save} /> : null}
      </Sheet>
    </StageB>
  );
}

// Показы по строкам: string, number, boolean, typeof, плюс.
const S2_CODE = L3(['let hero = "Kodi";', "let city = 'Toshkent';", 'console.log(hero + " " + city);'], ['let hero = "Kodi";', "let city = 'Москва';", 'console.log(hero + " " + city);'], ['let hero = "Kodi";', "let city = 'London';", 'console.log(hero + " " + city);']);
const S2 = ({ p }) => { const pick = usePick(); return <StepShow p={p} id="s2" code={pick(S2_CODE)} plan={[{ lines: [1], pose: 'point' }, { lines: [2], pose: 'explain' }, { lines: [3], pose: 'smile' }]} />; };
const S4_CODE = ['let coins = 120;', 'let price = 45;', 'console.log(coins - price);', 'let speed = 2.5;', 'console.log(speed * 2);'];
const S4 = ({ p }) => <StepShow p={p} id="s4" code={S4_CODE} plan={[{ lines: [1, 2], pose: 'point' }, { lines: [3], pose: 'explain' }, { lines: [4, 5], pose: 'smile' }]} />;
const S6_CODE = ['let hasKey = true;', 'let isGameOver = false;', 'let answer = "true";'];
const S6 = ({ p }) => <StepShow p={p} id="s6" code={S6_CODE} plan={[{ lines: [1], pose: 'point' }, { lines: [2], pose: 'explain' }, { lines: [3], pose: 'think' }]} />;
const S8_CODE = ['let hero = "Kodi";', 'let coins = 120;', 'let hasKey = true;', 'console.log(typeof hero);', 'console.log(typeof coins);', 'console.log(typeof hasKey);'];
const S8 = ({ p }) => <StepShow p={p} id="s8" code={S8_CODE} plan={[{ lines: [1, 2, 3, 4], pose: 'point' }, { lines: [5], pose: 'explain' }, { lines: [6], pose: 'smile' }]} />;
const S10_CODE = L3(['console.log(10 + 5);', 'console.log("10" + 5);', 'console.log("Ochko: " + 15);'], ['console.log(10 + 5);', 'console.log("10" + 5);', 'console.log("Очки: " + 15);'], ['console.log(10 + 5);', 'console.log("10" + 5);', 'console.log("Score: " + 15);']);
const S10 = ({ p }) => { const pick = usePick(); return <StepShow p={p} id="s10" code={pick(S10_CODE)} plan={[{ lines: [1], pose: 'point' }, { lines: [2], pose: 'wonder' }, { lines: [3], pose: 'smile' }]} />; };
const S5 = ({ p }) => <Predict p={p} id="s5" type="predict-types" />;
const S9 = ({ p }) => <Predict p={p} id="s9" type="predict-typeof" />;
const S12 = ({ p }) => <Predict p={p} id="s12" type="add-or-glue" />;

// =============================================================================
// S3. ЗАДАНИЕ «КАКОЙ ТИП?» — 6 раундов: string, number, boolean.
// =============================================================================
const TYPES3 = ['string', 'number', 'boolean'];
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
    if (k !== R.a) { misses.current += 1; shake(setBad, k); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's3', type: 'which-type', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
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
            <b key={r} className={'kz-a-drop j3-val' + (okK ? ' is-t-' + okK : '')} translate="no">{jsParts(R.v)}</b>
          </div>
          <div className="j1-langs j3-types">
            {TYPES3.map((k) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK} className={'j1-lang j3-tb is-t-' + k + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)} translate="no">
                <b>{k}</b><span>{pick(UI.types[k])}</span>
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ЗАДАНИЕ «ЗАПИШИ ДА» — let isWinner = …; → true.
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const log = useLog();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let isWinner = ' + v + ';', 'console.log(isWinner);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf('true')) : null);
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
    const e = jsErr(t.items);
    if (e) { T.miss(/^(true|false)$/i.test(v) ? c.msgs.cap : /is not defined/.test(e.text) ? c.msgs.word : c.msgs.other, sayNow); return; }
    const b = memVal(t, 'isWinner');
    if (b && typeof b.val === 'string') { T.miss(c.msgs.quoted, sayNow); return; }
    if (b && b.val === false) { T.miss(c.msgs.no, sayNow); return; }
    if (!b || b.val !== true) { T.miss(c.msgs.other, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true });
    log(T.logRec('s7', 'write-true'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'isWinner'), ' ', P_('e', 'j1-punc', '='), ' ', gapOf('g', ty, T.setMsg, run, L3('…', '…', '…'), c.ask, 12, led), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(codeOf('true'), A) : [codeLine('l0', parts, { cls: 'is-hl j1-line' + execCls(A, 1) }), jsL('l1', 0, 'console.log(isWinner);', { cls: tr ? execCls(A, 2) : ' j2-dim' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let isWinner = true;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={ty.val.trim().length > 2} canTap={canTap} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ЗАДАНИЕ «ИСПРАВЬ 5010» — let coins = "50"; → убрать кавычки → 60.
// =============================================================================
const S11_REST = ['coins = coins + 10;', 'console.log(coins);'];
function S11({ p }) {
  const c = C.s11;
  const log = useLog();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 10 });
  useEffect(() => { if (!solved) ty.setVal('"50"'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let coins = ' + v + ';'].concat(S11_REST);
  const [tr, setTr] = useState(jsTrace(codeOf(solved ? '50' : '"50"')));
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim().replace(/;$/, '');
    if (!v) { T.miss(c.msgs.empty, sayNow); return; }
    const t = jsTrace(codeOf(v));
    setTr(t); setRunN((x) => x + 1);
    if (jsErr(t.items)) { T.miss(c.msgs.other, sayNow); return; }
    const b = memVal(t, 'coins');
    if (b && typeof b.val === 'string') { T.miss(c.msgs.still, sayNow); return; }
    if (!b || b.val !== 60) { T.miss(c.msgs.value, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true });
    log(T.logRec('s11', 'fix-string-number'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'coins'), ' ', P_('e', 'j1-punc', '='), ' ', gapOf('g', ty, T.setMsg, run, L3('…', '…', '…'), c.ask, 10, false), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(codeOf('50'), A) : [codeLine('l0', parts, { cls: 'is-hl j1-line' + execCls(A, 1) })].concat(S11_REST.map((t, i) => jsL('r' + i, 0, t, { cls: execCls(A, i + 2) })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let coins = 50;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={A} /></div>
        </div>
        {!ok ? <KeyRow keys={['"']} ty={ty} canTap={canTap} onCheck={run} ready={!/["']/.test(ty.val) && ty.val.trim().length > 0} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ЗАДАНИЕ «СТРОКА ЦЕЛИКОМ» — let hasKey = true; (ниже console.log(typeof hasKey);)
// =============================================================================
function S14({ p }) {
  const c = C.s14;
  const log = useLog();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 40 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => [v, 'console.log(typeof hasKey);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf(rec.v || 'let hasKey = true;')) : null);
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok && !ty.val, 0);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim();
    if (!v) { T.miss(c.msgs.empty, sayNow); return; }
    const t = jsTrace(codeOf(v));
    setTr(t); setRunN((x) => x + 1);
    if (hasCyr(v)) { T.miss(CYR_JS, sayNow); return; }
    const e = jsErr(t.items);
    if (e) { T.miss(/(True|TRUE|False|FALSE) is not defined/.test(e.text) ? c.msgs.cap : c.msgs.syntax, sayNow); return; }
    const b = memVal(t, 'hasKey');
    if (!b) { T.miss(c.msgs.name, sayNow); return; }
    if (b.kind === 'global') { T.miss(c.msgs.noKw, sayNow); return; }
    if (typeof b.val === 'string') { T.miss(c.msgs.quoted, sayNow); return; }
    if (b.val === false) { T.miss(c.msgs.no, sayNow); return; }
    if (b.val !== true) { T.miss(c.msgs.notBool, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s14', 'write-boolean'));
    sayNow(c.ok, 'cheer');
  };
  const lines = ok ? traceLines(codeOf(rec && rec.v ? rec.v : JS_Q(ty.val).trim()), A)
    : [codeLine('l0', [gapOf('g', ty, T.setMsg, run, L3('let …', 'let …', 'let …'), c.ask, 40, led, true)], { cls: 'is-hl j1-line' + execCls(A, 1) }), jsL('l1', 0, 'console.log(typeof hasKey);', { cls: tr ? execCls(A, 2) : ' j2-dim' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let hasKey = true;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <KeyRow keys={['=', ';']} ty={ty} canTap={canTap} onCheck={run} ready={ty.val.trim().length > 8} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ЗАДАНИЕ «ТВОЁ СОХРАНЕНИЕ» — const name = "…"; let coins = …; let hasKey = …; три console.log.
// =============================================================================
const s15Code = (pre, v) => ['const name = "' + JS_Q(v[0]) + '";', 'let coins = ' + v[1] + ';', 'let hasKey = ' + v[2] + ';', 'console.log("' + pre + '" + name);', 'console.log(coins + 10);', 'console.log(typeof hasKey);'];
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s15');
  const solved = !!(rec && rec.done);
  const t1 = useTagTyping({ max: 16 }), t2 = useTagTyping({ max: 6 }), t3 = useTagTyping({ max: 6 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const pre = pick(c.pre);
  const [tr, setTr] = useState(solved ? jsTrace(s15Code(pre, rec.v)) : null);
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = [t1.val.trim(), t2.val.trim(), JS_Q(t3.val).trim()];
    if (v.some((x) => !x)) { T.miss(c.msgs.empty, sayNow); return; }
    if (/["'`“”«»]/.test(v[0])) { T.miss(c.msgs.quote, sayNow); return; }
    if (!/^\d{1,6}$/.test(v[1])) { T.miss(c.msgs.num, sayNow); return; }
    if (!/^(true|false)$/.test(v[2])) { T.miss(c.msgs.bool, sayNow); return; }
    T.hit(); setTr(jsTrace(s15Code(pre, v))); setRunN((x) => x + 1); sfx('win', true); setOk(true); put({ done: true, v: v });
    store.set('j3Prog', s15Code(pre, v));
    log(T.logRec('s15', 'own-save'));
    sayNow(c.ok, 'cheer');
  };
  const f = (ty, k, ph, max) => gapOf(k, ty, T.setMsg, run, ph, c.ask, max, false);
  const lines = ok ? traceLines(s15Code(pre, solved ? rec.v : [t1.val.trim(), t2.val.trim(), JS_Q(t3.val).trim()]), A) : [
    codeLine('l0', [P_('k', 'j2-kw', 'const'), ' ', P_('n', 'j2-var', 'name'), ' ', P_('e', 'j1-punc', '='), ' ', P_('q', 'j1-str', '"'), f(t1, 'f1', c.ph[0], 16), P_('q2', 'j1-str', '"'), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' }),
    codeLine('l1', [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'coins'), ' ', P_('e', 'j1-punc', '='), ' ', f(t2, 'f2', c.ph[1], 6), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' }),
    codeLine('l2', [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'hasKey'), ' ', P_('e', 'j1-punc', '='), ' ', f(t3, 'f3', c.ph[2], 6), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' }),
    jsL('l3', 0, 'console.log("' + pre + '" + name);', { cls: ' j2-dim' }), jsL('l4', 0, 'console.log(coins + 10);', { cls: ' j2-dim' }), jsL('l5', 0, 'console.log(typeof hasKey);', { cls: ' j2-dim' })
  ];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num" /></div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={!!(t1.val.trim() && t2.val.trim() && t3.val.trim())} canTap={canTap} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. ЗАДАНИЕ «НАЙДИ СЛОМАННУЮ СТРОКУ» — по консоли; 2 раунда.
// =============================================================================
function S13({ p }) {
  const c = C.s13;
  const log = useLog();
  const [rec, put] = useRec('s13');
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
      log({ screenId: 's13', type: 'find-error-line', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
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
// S16. ПРОВЕРКА «ВЕРНО ИЛИ НЕТ» — 5 утверждений.
// =============================================================================
function S16({ p }) {
  const pick = usePick();
  const c = C.s16;
  const log = useLog();
  const [rec, put] = useRec('s16');
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
      log({ screenId: 's16', type: 'true-false', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
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
// S17. ВЫВОД — разгадка; сохранение ученика из s15 с «Памятью»; что умеем; следующий урок.
// =============================================================================
function S17({ p }) {
  const pick = usePick();
  const c = C.s17;
  const store = useStore();
  const prog = store.get('j3Prog') || s15Code(pick(C.s15.pre), ['Robo', '100', 'true']);
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
            <KzCode lines={traceLines(prog, A)} cls="kz-code-sm j1-js j1-num" />
            <JsSide anim={A} />
          </div>
          <div className="kz-roles j1-endroles">
            {['riddle', 'string', 'number', 'boolean'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'string' ? '#C2410C' : k === 'number' ? '#16A34A' : '#2563EB' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'SHOW', Comp: S4 },
  { id: 's5', code: 'CHECK', Comp: S5 }, { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'CHECK', Comp: S9 }, { id: 's10', code: 'SHOW', Comp: S10 },
  { id: 's11', code: 'LEVEL-2', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 }, { id: 's13', code: 'LEVEL-2', Comp: S13 },
  { id: 's14', code: 'LEVEL-3', Comp: S14 }, { id: 's15', code: 'LEVEL-3', Comp: S15 }, { id: 's16', code: 'CHECK', Comp: S16 },
  { id: 's17', code: 'ACHIEVEMENT', Comp: S17 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonJs3Artifact(store) {
  const prog = store.get('j3Prog');
  return prog ? { type: 'js-data-types', code: prog.join('\n') } : null;
}

export default function JsTipyDannyh({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonJs3Artifact(store) })
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

