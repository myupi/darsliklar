// =============================================================================
// ЭКРАНЫ УРОКА 2 КУРСА JAVASCRIPT «Переменные» (облик «Редактор», 26.11.2026).
// Основа — урок 1 (tools/js1/j1-screens.jsx): строки KzCode, поле в строке (InlineInput), клавиши KeyRow, консоль.
// Своё: «Память» с коробками переменных рядом с консолью (j2-engine.jsx: jsTrace, useTraceAnim, JsMem, JsSide).
// Страницы в браузере нет (до DOM). Объяснения — показом (useKzDemo), руки и кнопок-обманок нет.
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
// S1. КРЮЧОК — игра Коди: let coins = 0; монета → coins = coins + 1; console.log(coins). Загадка.
// =============================================================================
const S1_CODE = ['let coins = 0;', 'coins = coins + 1;', 'console.log(coins);'];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [cur, setCur] = useState(null);
  const [ready, setReady] = useState(solved);
  const [logs, setLogs] = useState(solved ? [1, 2, 3] : []);
  const [ch, setCh] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => {
    if (solved) return undefined;
    setCur(1);
    tm.current.push(setTimeout(() => { setReady(true); setCur(null); }, 700));
    return () => tm.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const busy = cur != null;
  const tap = () => {
    if (!canTap || busy || !ready) return;
    const v = n + 1;
    sfx('pop', true); setCur(2);
    const ms = reduceMotion() ? 60 : 1;
    tm.current.push(setTimeout(() => { setN(v); setCh(true); }, 300 * ms));
    tm.current.push(setTimeout(() => { setCur(3); setCh(false); setLogs((l) => l.concat([v])); }, 750 * ms));
    tm.current.push(setTimeout(() => {
      setCur(null);
      if (v === 1) sayNow(c.more, 'smile');
      if (v === 3 && !solved) { put({ done: true }); sfx('win', true); sayNow(c.works, 'wonder'); say(c.riddle, 'curious'); }
    }, 1200 * ms));
  };
  const done = n >= 3;
  const ask = done ? c.askDone : n === 0 ? c.ask : c.askMore;
  const A = { cur, errLine: null };
  const mem = ready ? [{ name: 'coins', kind: 'let', val: n, ch, nw: cur === 1 }] : [];
  const items = logs.map((v, i) => ({ type: 'log', text: String(v), num: true, line: 3 }));
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene j1-scene j1-pair j2-hook">
          <div className="kz-col">
            <KzCode lines={S1_CODE.map((t, i) => jsL('l' + i, 0, t, { cls: cur === i + 1 ? ' is-exec' : '' }))} cls="kz-code-sm j1-js j1-num" />
            <button type="button" className={'j2-coin' + (canTap && ready && !busy && !done ? ' is-led' : '')} onClick={tap} disabled={!canTap || !ready} aria-label={pick(UI.coin)}>
              <i aria-hidden="true">+1</i><span>{pick(UI.coin)}</span>
            </button>
          </div>
          <div className="kz-col"><JsSide mem={mem} items={items} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «ПЕРЕМЕННАЯ — КОРОБКА» — let hero = "Kodi"; по частям; console.log(hero) → Kodi.
// =============================================================================
const S2_CODE = ['let hero = "Kodi";', 'console.log(hero);'];
function S2({ p }) {
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 4 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { wait: 300 * ms }, { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => setN(2) }, { say: [{ text: c.steps[1], pose: 'explain' }] },
    { act: () => { sfx('pop', true); setN(3); } }, { wait: 300 * ms }, { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => { sfx('ok', true); setN(4); } }, { wait: 300 * ms }, { say: [{ text: c.steps[3], pose: 'wonder' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const lit = n === 1 ? 'let' : n === 2 ? 'hero' : n === 3 ? 'val' : null;
  const lines = [jsL('l0', 0, S2_CODE[0], { cls: n >= 1 && n <= 3 ? ' is-exec' : n > 3 ? ' is-past' : '' }, lit),
    jsL('l1', 0, S2_CODE[1], { cls: n === 4 ? ' is-exec' : ' j2-dim' })];
  const mem = n >= 1 ? [{ name: 'hero', kind: 'let', val: n >= 3 ? 'Kodi' : undefined, emp: n < 3, nw: n === 1 }] : [];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num j2-big" /></div>
          <div className="kz-col"><JsSide mem={mem} lit={n === 2 ? 'hero' : null} items={n >= 4 ? [{ type: 'log', text: 'Kodi', line: 2 }] : []} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ЗАДАНИЕ «СОБЕРИ СТРОКУ» — кусочки let score = 0 ; по порядку.
// =============================================================================
const S3_PIECES = ['let', 'score', '=', '0', ';'];
const S3_SHOWN = ['0', '=', 'score', ';', 'let'];
const S3_CODE = ['let score = 0;', 'console.log(score);'];
function S3({ p }) {
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [k, setK] = useState(solved ? 5 : 0);
  const [bad, setBad] = useState(null);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || k >= 5, spoken);
  const tr = useMemo(() => (k >= 5 ? jsTrace(S3_CODE) : null), [k]);
  const A = useTraceAnim(tr);
  const tap = (pc) => {
    if (!canTap || k >= 5) return;
    if (pc !== S3_PIECES[k]) { shake(setBad, pc); T.miss(c.piece[k], sayNow); return; }
    T.hit(); sfx('pop', true);
    const nk = k + 1; setK(nk);
    if (nk === 5) { sfx('win', true); put({ done: true }); log(T.logRec('s3', 'assemble-let')); sayNow(c.ok, 'cheer'); }
  };
  const built = S3_PIECES.slice(0, k).join(' ').replace(' ;', ';');
  const line0 = k >= 5 ? jsL('l0', 0, S3_CODE[0], { cls: 'is-new' + execCls(A, 1) })
    : codeLine('l0', jsParts(built).concat([<span key="cur" className="j2-caret" aria-hidden="true" />]), { cls: 'is-hl j1-line' });
  const line1 = jsL('l1', 0, S3_CODE[1], { cls: k >= 5 ? execCls(A, 2) : ' j2-dim' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={k >= 5 ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={k >= 5 ? c.ok : c.ask} hint={k >= 5 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={[line0, line1]} cls="kz-code-sm j1-js j1-num j2-big" />
            {k < 5 ? (
              <div className="j2-pieces" translate="no">
                {S3_SHOWN.map((pc) => {
                  const used = S3_PIECES.indexOf(pc) < k;
                  return <button key={pc} type="button" data-v={pc} disabled={!canTap || used} className={'j2-piece' + (used ? ' is-used' : '') + (bad === pc ? ' is-bad' : '') + (T.lad.lv >= 3 && pc === S3_PIECES[k] ? ' is-led' : '')} onClick={() => tap(pc)}>{pc}</button>;
                })}
              </div>
            ) : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

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
const S4 = ({ p }) => <Predict p={p} id="s4" type="predict-var" />;
const S8 = ({ p }) => <Predict p={p} id="s8" type="trace-var" />;
const S14 = ({ p }) => <Predict p={p} id="s14" type="quotes-or-name" />;

// =============================================================================
// S5. ЗАДАНИЕ «ТВОЙ ГЕРОЙ» — let hero = "…"; console.log(hero);
// =============================================================================
function S5({ p }) {
  const c = C.s5;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 20 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let hero = "' + v + '";', 'console.log(hero);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf(rec.v || 'Robo')) : null);
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok && !ty.val, 0);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val);
    if (!v.trim()) { T.miss(c.msgs.empty, sayNow); return; }
    if (/["'`]/.test(v)) { T.miss(c.msgs.quote, sayNow); return; }
    T.hit(); setTr(jsTrace(codeOf(v))); setRunN((x) => x + 1);
    sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s5', 'own-var'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'hero'), ' ', P_('e', 'j1-punc', '='), ' ', P_('q', 'j1-str', '"'),
    gapOf('g', ty, T.setMsg, run, L3('…', '…', '…'), c.ask, 20, led), P_('q2', 'j1-str', '"'), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(codeOf(rec && rec.v ? rec.v : JS_Q(ty.val)), A) : [codeLine('l0', parts, { cls: 'is-hl' }), jsL('l1', 0, 'console.log(hero);', { cls: ' j2-dim' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num" /></div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={ty.val.trim().length > 0} canTap={canTap} /> : null}
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
const S6_CODE = ['let lives = 3;', 'console.log(lives);', 'lives = 2;', 'console.log(lives);', 'lives = lives - 1;', 'console.log(lives);'];
const S6 = ({ p }) => <StepShow p={p} id="s6" code={S6_CODE} plan={[{ lines: [1, 2], pose: 'point' }, { lines: [3, 4], pose: 'explain' }, { lines: [5, 6], pose: 'smile' }]} />;
const S9_CODE = ['const gameName = "Kodi Run";', 'console.log(gameName);', 'gameName = "Super Kodi";'];
const S9 = ({ p }) => <StepShow p={p} id="s9" code={S9_CODE} plan={[{ lines: [1], pose: 'point' }, { lines: [2], pose: 'smile' }, { lines: [3], pose: 'think', err: true }, { lines: [], pose: 'explain' }]} />;

// =============================================================================
// S7. ЗАДАНИЕ «НОВЫЙ УРОВЕНЬ» — третья строка целиком: level = 5;
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const log = useLog();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 30 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => ['let level = 1;', 'console.log(level);', v, 'console.log(level);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf('level = 5;')) : null);
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
    if (e) { T.miss(/already been declared/.test(e.text) ? c.msgs.redeclare : /is not defined/.test(e.text) ? c.msgs.notFive : c.msgs.syntax, sayNow); return; }
    const b = memVal(t, 'level');
    if (b && b.val === 5) {
      T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
      log(T.logRec('s7', 'reassign'));
      sayNow(c.ok, 'cheer'); return;
    }
    if (b && b.val === '5') { T.miss(c.msgs.quoted, sayNow); return; }
    const other = (t.mem[t.mem.length - 1] || []).some((x) => x.name !== 'level');
    T.miss(b && b.val === 1 && other ? c.msgs.otherBox : c.msgs.notFive, sayNow);
  };
  const lines = ok ? traceLines(codeOf(rec && rec.v ? rec.v : JS_Q(ty.val).trim()), A)
    : codeOf('').map((t, i) => (i === 2 ? codeLine('l2', [gapOf('g', ty, T.setMsg, run, L3('level = …', 'level = …', 'level = …'), c.ask, 30, led, true)], { cls: 'is-hl j1-line' })
      : jsL('l' + i, 0, t, { cls: tr ? execCls(A, i + 1) : '' })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code="level = 5;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <KeyRow keys={['=', ';']} ty={ty} canTap={canTap} onCheck={run} ready={ty.val.trim().length > 4} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ЗАДАНИЕ «let ИЛИ const?» — 5 раундов.
// =============================================================================
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const log = useLog();
  const [rec, put] = useRec('s10');
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
      log({ screenId: 's10', type: 'let-or-const', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
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
          <div className="j1-tf j2-lc">
            {['let', 'const'].map((k) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK} className={'j1-tfb j2-lcb is-' + k + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)} translate="no">
                {k === 'const' ? J2_LOCK : null}{k}
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ЗАДАНИЕ «ИСПРАВЬ» — const coins = 0; coins = coins + 1; → поменять слово на let.
// =============================================================================
const S11_REST = ['coins = coins + 1;', 'console.log(coins);'];
function S11({ p }) {
  const c = C.s11;
  const log = useLog();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 10 });
  useEffect(() => { if (!solved) ty.setVal('const'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (w) => [w + ' coins = 0;'].concat(S11_REST);
  const [tr, setTr] = useState(jsTrace(codeOf(solved ? 'let' : 'const')));
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const w = JS_Q(ty.val).trim();
    if (!w) { T.miss(c.msgs.empty, sayNow); return; }
    const t = jsTrace(codeOf(w));
    setTr(t); setRunN((x) => x + 1);
    if (hasCyr(w)) { T.miss(CYR_JS, sayNow); return; }
    const e = jsErr(t.items);
    if (e) { T.miss(/constant/.test(e.text) ? c.msgs.still : c.msgs.other, sayNow); return; }
    if (w !== 'let') { T.miss(w === 'var' ? c.msgs.old : c.msgs.other, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true });
    log(T.logRec('s11', 'const-to-let'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [gapOf('g', ty, T.setMsg, run, L3('…', '…', '…'), c.ask, 10, false), ' ', P_('n', 'j2-var', 'coins'), ' ', P_('e', 'j1-punc', '='), ' ', P_('z', 'j1-num', '0'), P_('s', 'j1-punc', ';')];
  const lines = ok ? traceLines(codeOf('let'), A) : [codeLine('l0', parts, { cls: 'is-hl j1-line' + execCls(A, 1) })].concat(S11_REST.map((t, i) => jsL('r' + i, 0, t, { cls: execCls(A, i + 2) })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let coins = 0;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={A} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={JS_Q(ty.val).trim() !== 'const' && ty.val.trim().length > 1} canTap={canTap} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ПОКАЗ «ОШИБКИ ПЕРЕМЕННЫХ» — Score вместо score; переменная до let; второй let.
// =============================================================================
const S12_EX = [['let score = 5;', 'console.log(Score);'], ['console.log(lives);', 'let lives = 3;'], ['let hero = "Kodi";', 'let hero = "Robo";']];
function S12({ p }) {
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : -1);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setN(0); } }, { wait: 1500 * ms }, { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => { sfx('soft', true); setN(1); } }, { wait: 1200 * ms }, { say: [{ text: c.steps[1], pose: 'point' }] },
    { act: () => { sfx('soft', true); setN(2); } }, { wait: 600 * ms }, { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const code = n < 0 ? [] : S12_EX[n];
  const tr = useMemo(() => (n < 0 ? null : jsTrace(code)), [n]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, n);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode key={n} lines={code.length ? traceLines(code, A) : [jsL('l0', 0, '// …')]} cls="kz-code-sm j1-js j1-num" />
            <span className="j1-dots">{S12_EX.map((x, i) => <i key={i} className={i < n ? 'is-done' : i === n ? 'is-now' : ''} />)}</span>
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
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
  const tr = useMemo(() => jsTrace(R.lines), [r]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, r);
  const lines = R.lines.map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A, i + 1) + (okR && i === R.bad ? ' is-err-line is-found' : '') + (bad === i ? ' is-bad' : '') + (lad.lv >= 3 && !okR && i === R.bad ? ' is-hl' : ''),
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
// S15. ЗАДАНИЕ «СТРОКА ЦЕЛИКОМ» — let coins = 50; (ниже готовая console.log(coins);)
// =============================================================================
function S15({ p }) {
  const c = C.s15;
  const log = useLog();
  const [rec, put] = useRec('s15');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 40 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const codeOf = (v) => [v, 'console.log(coins);'];
  const [tr, setTr] = useState(solved ? jsTrace(codeOf(rec.v || 'let coins = 50;')) : null);
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
    if (e) {
      const m = /Unexpected identifier/.test(e.text) && /^(let|const)\s+\S+\s+[\p{L}_$]/u.test(v) ? c.msgs.space : /coins is not defined/.test(e.text) ? c.msgs.name : c.msgs.syntax;
      T.miss(m, sayNow); return;
    }
    const b = memVal(t, 'coins');
    if (!b) { T.miss(c.msgs.name, sayNow); return; }
    if (b.kind === 'global') { T.miss(c.msgs.noKw, sayNow); return; }
    if (b.kind === 'var') { T.miss(C.s11.msgs.old, sayNow); return; }
    if (b.val === '50') { T.miss(c.msgs.quoted, sayNow); return; }
    if (b.val !== 50) { T.miss(c.msgs.value, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s15', 'write-let'));
    sayNow(c.ok, 'cheer');
  };
  const lines = ok ? traceLines(codeOf(rec && rec.v ? rec.v : JS_Q(ty.val).trim()), A)
    : [codeLine('l0', [gapOf('g', ty, T.setMsg, run, L3('let …', 'let …', 'let …'), c.ask, 40, led, true)], { cls: 'is-hl j1-line' + execCls(A, 1) }), jsL('l1', 0, 'console.log(coins);', { cls: tr ? execCls(A, 2) : ' j2-dim' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code="let coins = 50;" /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <KeyRow keys={['=', ';']} ty={ty} canTap={canTap} onCheck={run} ready={ty.val.trim().length > 8} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S16. ЗАДАНИЕ «КАРТОЧКА ГЕРОЯ» — const hero = "…"; let score = …; score = score + …; два console.log.
// =============================================================================
const s16Code = (v) => ['const hero = "' + JS_Q(v[0]) + '";', 'let score = ' + v[1] + ';', 'score = score + ' + v[2] + ';', 'console.log(hero);', 'console.log(score);'];
function S16({ p }) {
  const c = C.s16;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s16');
  const solved = !!(rec && rec.done);
  const t1 = useTagTyping({ max: 16 }), t2 = useTagTyping({ max: 5 }), t3 = useTagTyping({ max: 5 });
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const [tr, setTr] = useState(solved ? jsTrace(s16Code(rec.v)) : null);
  const A = useTraceAnim(tr, runN);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = [t1.val.trim(), t2.val.trim(), t3.val.trim()];
    if (v.some((x) => !x)) { T.miss(c.msgs.empty, sayNow); return; }
    if (/["'`“”«»]/.test(v[0])) { T.miss(c.msgs.quote, sayNow); return; }
    if (!/^\d{1,5}$/.test(v[1]) || !/^\d{1,5}$/.test(v[2])) { T.miss(c.msgs.num, sayNow); return; }
    T.hit(); setTr(jsTrace(s16Code(v))); setRunN((x) => x + 1); sfx('win', true); setOk(true); put({ done: true, v: v });
    store.set('j2Prog', s16Code(v));
    log(T.logRec('s16', 'hero-card'));
    sayNow(c.ok, 'cheer');
  };
  const f = (ty, k, ph, max) => gapOf(k, ty, T.setMsg, run, ph, c.ask, max, false);
  const lines = ok ? traceLines(s16Code(solved ? rec.v : [t1.val.trim(), t2.val.trim(), t3.val.trim()]), A) : [
    codeLine('l0', [P_('k', 'j2-kw', 'const'), ' ', P_('n', 'j2-var', 'hero'), ' ', P_('e', 'j1-punc', '='), ' ', P_('q', 'j1-str', '"'), f(t1, 'f1', c.ph[0], 16), P_('q2', 'j1-str', '"'), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' }),
    codeLine('l1', [P_('k', 'j2-kw', 'let'), ' ', P_('n', 'j2-var', 'score'), ' ', P_('e', 'j1-punc', '='), ' ', f(t2, 'f2', c.ph[1], 5), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' }),
    codeLine('l2', [P_('n', 'j2-var', 'score'), ' ', P_('e', 'j1-punc', '='), ' ', P_('n2', 'j2-var', 'score'), ' ', P_('pl', 'j1-punc', '+'), ' ', f(t3, 'f3', c.ph[2], 5), P_('s', 'j1-punc', ';')], { cls: 'is-hl j1-line' }),
    jsL('l3', 0, 'console.log(hero);', { cls: ' j2-dim' }), jsL('l4', 0, 'console.log(score);', { cls: ' j2-dim' })
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
// S18. ВЫВОД — разгадка; карточка героя из s16 с «Памятью»; что умеем; следующий урок.
// =============================================================================
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const prog = store.get('j2Prog') || s16Code(['Robo', '100', '50']);
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
            {['riddle', 'box', 'change', 'const'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'box' ? '#E5B800' : k === 'change' ? '#0FA38E' : '#7C3AED' }}>
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
  { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 },
  { id: 's8', code: 'CHECK', Comp: S8 }, { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-1', Comp: S10 },
  { id: 's11', code: 'LEVEL-2', Comp: S11 }, { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-2', Comp: S13 },
  { id: 's14', code: 'CHECK', Comp: S14 }, { id: 's15', code: 'LEVEL-3', Comp: S15 }, { id: 's16', code: 'LEVEL-3', Comp: S16 },
  { id: 's17', code: 'CHECK', Comp: S17 }, { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonJs2Artifact(store) {
  const prog = store.get('j2Prog');
  return prog ? { type: 'js-variables', code: prog.join('\n') } : null;
}

export default function JsPeremennye({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonJs2Artifact(store) })
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
