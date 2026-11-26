// =============================================================================
// ЭКРАНЫ УРОКА 5 КУРСА JAVASCRIPT «Условия — 1 часть» (облик «Редактор», 26.11.2026).
// Основа — урок 4 (tools/js4/j4-screens.jsx): помощники, Predict, «найди сломанную строку», «верно или нет», вывод.
// Своё: показ запусков RunShow (ветки по шагам), дверь и ключ, сборка if из строк, задание с полем GapTask,
// «какие строки выполнятся», своя дверь if / else.
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

// Код строками: массив или L3 из массивов (строки сообщений — на языке урока).
const codeOfL = (pick, x) => (Array.isArray(x) ? x : pick(x));
// Строка-скобка: «}», «} else {» — без своего шага.
const isBrace = (t) => /^\s*\}?\s*(else\s*)?\{?\s*$/.test(t);
// Строка с полем: шаблон «… ¤ …» — до и после поля.
function gapLine(k, tpl, gap, extra) {
  const [a, b] = tpl.split('¤');
  const rk = (list, pre) => list.map((x, i) => (React.isValidElement(x) ? React.cloneElement(x, { key: pre + i }) : x));
  const pa = a.trim() ? rk(jsParts(a.trim()), 'a') : [];
  if (a.trim() && /\s$/.test(a)) pa.push(' ');
  const pb = b.trim() ? rk(jsParts(b.trim()), 'b') : [];
  return codeLine(k, pa.concat([gap]).concat(pb), Object.assign({ d: indOf(tpl), cls: 'is-hl j1-line' }, extra || {}));
}

// =============================================================================
// S1. КРЮЧОК — дверь и ключ: запусти (else — «нужен ключ»), возьми ключ, запусти снова (if — дверь открыта). Загадка.
// =============================================================================
const DOOR = (open) => (
  <svg viewBox="0 0 64 72" width="56" height="63" aria-hidden="true" className={'j5-door-svg' + (open ? ' is-open' : '')}>
    <rect x="6" y="4" width="52" height="66" rx="4" fill="#3F2A1D" />
    <rect className="j5-door-in" x="11" y="9" width="42" height="61" fill="#FDE68A" />
    <g className="j5-door-p"><rect x="11" y="9" width="42" height="61" fill="#B45309" /><rect x="16" y="15" width="32" height="20" rx="2" fill="#92400E" /><rect x="16" y="41" width="32" height="22" rx="2" fill="#92400E" /><circle cx="45" cy="40" r="3" fill="#FDE68A" /></g>
  </svg>
);
const KEY_ICO = <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="8" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M12.5 12H21M17.5 12v3.5M20.5 12v2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [key, setKey] = useState(solved);
  const [runs, setRuns] = useState(solved ? 2 : 0);
  const [runN, setRunN] = useState(0);
  const code = (k) => ['let hasKey = ' + (k ? 'true' : 'false') + ';'].concat(pick(c.code));
  const [tr, setTr] = useState(solved ? jsTrace(code(true)) : null);
  const A = useTraceAnim(tr, runN);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const [pend, setPend] = useState(false);
  const busy = pend || !!(tr && A.fresh);
  const stage = solved ? 3 : runs === 0 ? 0 : !key ? 1 : runs === 1 ? 2 : 3;
  const run = () => {
    if (!canTap || busy || stage === 1 || stage === 3) return;
    const t = jsTrace(code(key));
    sfx('pop', true); setTr(t); setRunN((x) => x + 1); setPend(true);
    const nr = runs + 1; setRuns(nr);
    const ms = reduceMotion() ? 0.05 : 1;
    tm.current.push(setTimeout(() => {
      setPend(false);
      if (!key) { sfx('soft', true); sayNow(c.locked, 'think'); return; }
      sfx('win', true); put({ done: true }); sayNow(c.works, 'wonder'); say(c.riddle, 'curious');
    }, (t.n + 1) * 560 * ms + 200));
  };
  const take = () => { if (!canTap || busy || stage !== 1) return; sfx('pop', true); setKey(true); sayNow(c.took, 'smile'); };
  const open = !!(key && runs >= 2 && !A.fresh) || solved;
  const ask = stage === 0 ? c.ask : stage === 1 ? c.askKey : stage === 2 ? c.askAgain : c.askDone;
  const lines = code(key).map((t, i) => jsL('l' + i, 0, t, { cls: execCls(tr ? A : null, i + 1) + (i === 0 && key && stage === 2 ? ' is-new' : '') }));
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene j1-scene j1-pair j5-hook">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {tr ? <JsCalc steps={lastCalc(code(key), tr, A.k)} /> : null}
            <div className={'j5-hookbar' + (stage === 3 && !busy ? ' is-done' : '')}>
              <span className={'j5-door' + (open ? ' is-open' : tr && !key && !A.fresh ? ' is-shut' : '')}>{DOOR(open)}</span>
              <button type="button" className={'j5-keyb' + (stage === 1 && canTap && !busy ? ' is-led' : '') + (key ? ' is-have' : '')} onClick={take} disabled={!canTap || busy || stage !== 1}>
                <i>{KEY_ICO}</i><span>{pick(key ? UI.haveKey : UI.takeKey)}</span>
              </button>
              <button type="button" className={'j5-runb' + ((stage === 0 || stage === 2) && canTap && !busy ? ' is-led' : '')} onClick={run} disabled={!canTap || busy || stage === 1 || stage === 3}>▶ {pick(UI.run)}</button>
            </div>
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ПОКАЗ (s2, s6, s9, s11) — один или два запуска; код выполняется по шагам, Коди говорит на остановках.
//   phases: [{ code, stops: [k …], pose }] — stops: после скольких шагов говорить (по умолчанию — в конце).
// =============================================================================
function RunShow({ p, id, phases }) {
  const pick = usePick();
  const c = C[id];
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const codes = phases.map((ph) => codeOfL(pick, ph.code));
  const trs = useMemo(() => codes.map((cd) => jsTrace(cd)), [codes.map((x) => x.join('|')).join('#')]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = phases.length - 1;
  const [ph, setPh] = useState(solved ? last : 0);
  const [k, setK] = useState(solved ? 99 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const steps = [];
  let si = 0;
  phases.forEach((pl, i) => {
    const n = trs[i].n;
    steps.push({ act: () => { setPh(i); setK(0); } });
    steps.push({ wait: 500 * ms });
    let from = 1;
    (pl.stops || [n]).forEach((stop, j) => {
      for (let s = from; s <= stop; s += 1) { const ss = s; steps.push({ act: () => { sfx(trs[i].steps[ss - 1] && trs[i].steps[ss - 1].cond != null ? 'blip' : 'pop', true); setK(ss); } }); steps.push({ wait: 700 * ms }); }
      from = stop + 1;
      steps.push({ say: [{ text: c.steps[si], pose: (pl.poses && pl.poses[j]) || pl.pose || 'point' }] });
      si += 1;
    });
    if (from <= n) for (let s = from; s <= n; s += 1) { const ss = s; steps.push({ act: () => setK(ss) }); steps.push({ wait: 650 * ms }); }
    steps.push({ act: () => setK(99) });
  });
  steps.push({ act: () => put({ done: true }) });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const code = codes[ph];
  const tr = trs[ph];
  const A = traceView(tr, k);
  const done = k > tr.n;
  const lines = code.map((t, i) => jsL('l' + i, 0, t, { cls: (k === 0 ? ' j2-dim' : execCls(A, i + 1)) + (ph > 0 && i === 0 && k === 0 ? ' is-new' : '') }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            {phases.length > 1 ? <span className="j5-runs">{phases.map((x, i) => <i key={i} className={i < ph ? 'is-done' : i === ph ? 'is-now' : ''}>{pick(UI.runN)} {i + 1}</i>)}</span> : null}
            <KzCode key={ph} lines={lines} cls="kz-code-sm j1-js j1-num" />
            <JsCalc steps={k ? lastCalc(code, tr, A.k) : []} />
          </div>
          <div className="kz-col"><JsSide mem={A.mem} items={A.shown} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
const S2_CODE = (coins) => L3(['let coins = ' + coins + ';', 'if (coins > 100) {', '  console.log("Sovg\'a oldingiz!");', '}'],
  ['let coins = ' + coins + ';', 'if (coins > 100) {', '  console.log("Вы получили подарок!");', '}'],
  ['let coins = ' + coins + ';', 'if (coins > 100) {', '  console.log("You got a gift!");', '}']);
const S2 = ({ p }) => <RunShow p={p} id="s2" phases={[{ code: S2_CODE(120), stops: [2, 3], poses: ['point', 'smile'] }, { code: S2_CODE(50), stops: [2], poses: ['explain'] }]} />;
const S6_CODE = (lives) => L3(['let lives = ' + lives + ';', 'if (lives > 0) {', '  console.log("Davom eting!");', '} else {', '  console.log("Game over");', '}'],
  ['let lives = ' + lives + ';', 'if (lives > 0) {', '  console.log("Беги дальше!");', '} else {', '  console.log("Game over");', '}'],
  ['let lives = ' + lives + ';', 'if (lives > 0) {', '  console.log("Keep running");', '} else {', '  console.log("Game over");', '}']);
const S6 = ({ p }) => <RunShow p={p} id="s6" phases={[{ code: S6_CODE(0), stops: [2, 3], poses: ['point', 'explain'] }, { code: S6_CODE(2), stops: [3], poses: ['smile'] }]} />;
const S9_A = L3(['let hasKey = true;', 'if (hasKey) {', '  console.log("Eshik ochildi!");', '}'], ['let hasKey = true;', 'if (hasKey) {', '  console.log("Дверь открыта!");', '}'], ['let hasKey = true;', 'if (hasKey) {', '  console.log("The door is open!");', '}']);
const S9_B = L3(['let password = "kodi2026";', 'if (password === "Kodi2026") {', '  console.log("Eshik ochildi!");', '} else {', '  console.log("Parol xato");', '}'],
  ['let password = "kodi2026";', 'if (password === "Kodi2026") {', '  console.log("Дверь открыта!");', '} else {', '  console.log("Неверный пароль");', '}'],
  ['let password = "kodi2026";', 'if (password === "Kodi2026") {', '  console.log("The door is open!");', '} else {', '  console.log("Wrong password");', '}']);
const S9 = ({ p }) => <RunShow p={p} id="s9" phases={[{ code: S9_A, stops: [2, 3], poses: ['point', 'smile'] }, { code: S9_B, stops: [2, 3], poses: ['wonder', 'explain'] }]} />;
const S11_CODE = (coins) => L3(['let coins = ' + coins + ';', 'if (coins > 100) {', '  console.log("Sovg\'a!");', '}', 'console.log("Keyingi daraja");'],
  ['let coins = ' + coins + ';', 'if (coins > 100) {', '  console.log("Подарок!");', '}', 'console.log("Следующий уровень");'],
  ['let coins = ' + coins + ';', 'if (coins > 100) {', '  console.log("A gift!");', '}', 'console.log("Next level");']);
const S11 = ({ p }) => <RunShow p={p} id="s11" phases={[{ code: S11_CODE(30), stops: [2, 3], poses: ['wonder', 'explain'] }, { code: S11_CODE(150), stops: [4], poses: ['smile'] }]} />;
const S3 = ({ p }) => <Predict p={p} id="s3" type="predict-if" />;
const S7 = ({ p }) => <Predict p={p} id="s7" type="predict-else" />;
const S15 = ({ p }) => <Predict p={p} id="s15" type="pick-condition" />;

// =============================================================================
// ПРЕДСКАЗАНИЕ (s3, s7) и ВЫБОР УСЛОВИЯ (s15) — раунды: код, варианты; после верного ответа код выполняется по шагам.
//   R.q — правило над кодом; R.fill — варианты встают на место ___ в коде.
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
  const code0 = codeOfL(pick, R.code);
  const opts = arrOf(pick, R.opts);
  const code = okK != null && c.fill ? code0.map((l) => l.replace('___', opts[okK])) : code0;
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tr = useMemo(() => (okK != null ? jsTrace(code) : null), [okK, r, code.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, r);
  const tap = (i) => {
    if (!canTap || solved || okK != null) return;
    if (i !== R.a) { misses.current += 1; shake(setBad, i); sfx('soft', true); sayNow(R.no && R.no[i] ? R.no[i] : misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(i);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: id, type: type, correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 2600 + (tr ? 0 : code.length * 420));
  };
  const lines = code.map((t, i) => jsL('l' + i, 0, t, { cls: (okK != null ? execCls(A, i + 1) : '') + (okK == null && t.indexOf('___') >= 0 ? ' is-hl' : '') }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className={'kz-scene j1-scene j1-pair j1-predict' + (c.fill ? ' j5-fillscene' : '')}>
          <div className="kz-col">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK != null) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            {R.q ? <div className="j5-rule kz-a-drop" key={'q' + r}>{pick(R.q)}</div> : null}
            <KzCode key={r} lines={lines} cls="kz-code-sm j1-js j1-num" />
            {okK != null && tr ? <JsCalc steps={lastCalc(code, tr, A.k)} /> : null}
            <div className={'j1-opts' + (c.fill ? ' j5-optc' : '') + (okK != null ? ' is-answered' : '')} key={'o' + r}>
              {opts.map((o, i) => (
                <button key={i} type="button" data-v={'o' + i} disabled={!canTap || solved || okK != null} className={'j1-opt kz-a-drop' + (okK === i ? ' is-ok' : '') + (bad === i ? ' is-bad' : '') + (lad.lv >= 3 && okK == null && i === R.a ? ' is-led' : '')} onClick={() => tap(i)} translate="no">
                  {c.fill ? <code>{jsParts(o)}</code> : o}
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
// S4. ЗАДАНИЕ «СОБЕРИ IF» — строки в беспорядке; нажимать по порядку.
// =============================================================================
const S4_ORDER = [3, 0, 2, 1];
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const log = useLog();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const code = pick(c.code);
  const N = code.length;
  const [k, setK] = useState(solved ? N : 0);
  const [bad, setBad] = useState(null);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || k >= N, spoken);
  const tr = useMemo(() => (k >= N ? jsTrace(code) : null), [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr);
  const tap = (j) => {
    if (!canTap || k >= N) return;
    if (j !== k) { shake(setBad, j); T.miss(c.piece[k], sayNow); return; }
    T.hit(); sfx('pop', true);
    const nk = k + 1; setK(nk);
    if (nk === N) { sfx('win', true); put({ done: true }); log(T.logRec('s4', 'assemble-if')); sayNow(c.ok, 'cheer'); }
  };
  const lines = code.slice(0, k).map((t, i) => jsL('l' + i, 0, t, { cls: (k >= N ? execCls(A, i + 1) : '') + (i === k - 1 && k < N ? ' is-new' : '') }));
  if (k < N) lines.push(codeLine('cur', [<span key="cur" className="j2-caret" aria-hidden="true" />], { cls: 'is-hl j1-line' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={k >= N ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={k >= N ? c.ok : c.ask} hint={k >= N ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {k < N ? (
              <div className="j5-lines" translate="no">
                {S4_ORDER.map((j) => {
                  const used = j < k;
                  return <button key={j} type="button" data-v={'p' + j} disabled={!canTap || used} className={'j5-lineb' + (used ? ' is-used' : '') + (bad === j ? ' is-bad' : '') + (T.lad.lv >= 3 && j === k ? ' is-led' : '')} onClick={() => tap(j)}><code>{jsParts(code[j].trim())}</code></button>;
                })}
              </div>
            ) : <JsCalc steps={lastCalc(code, tr, A.k)} />}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ЗАДАНИЕ С ПОЛЕМ (s5, s8, s10, s14) — строка с полем ¤; «Запустить»; проверка по смыслу — check(v) → сообщение или null.
// =============================================================================
function GapTask({ p, id, tpl, gapAt, check, keys, max, prefill, example, type, okVal, ready }) {
  const pick = usePick();
  const c = C[id];
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: max || 30 });
  useEffect(() => { if (!solved && prefill) ty.setVal(prefill); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [ok, setOk] = useState(solved);
  const [runN, setRunN] = useState(0);
  const base = pick(tpl);
  const codeOf = (v) => base.map((l) => l.replace('¤', v));
  const [cv, setCv] = useState(solved ? rec.v : null);
  const [tr, setTr] = useState(solved ? jsTrace(codeOf(rec.v)) : null);
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
    if (hasCyr(v) && !/["']/.test(base[gapAt])) { T.miss(CYR_JS, sayNow); return; }
    const m = check(v, t, codeOf);
    if (m) { T.miss(m, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec(id, type));
    sayNow(c.ok, 'cheer');
  };
  const shownV = ok ? cv : null;
  const lines = base.map((t, i) => {
    if (i === gapAt && !ok) return gapLine('l' + i, t, gapOf('g', ty, T.setMsg, run, c.ph || L3('…', '…', '…'), c.ask, max || 30, led, true), { cls: 'is-hl j1-line' + execCls(tr ? A : null, i + 1) });
    return jsL('l' + i, 0, i === gapAt ? t.replace('¤', shownV) : t, { cls: tr ? execCls(A, i + 1) : (i > gapAt ? ' j2-dim' : '') });
  });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            {c.goal ? <div className="j5-rule">{pick(c.goal)}</div> : null}
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num" />
            {tr && !jsErr(tr.items) ? <JsCalc steps={lastCalc(codeOf(cv), tr, A.k)} /> : null}
            {!ok && T.lad.lv >= 3 ? <HelpCode code={pick(example)} /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <KeyRow keys={keys} ty={ty} canTap={canTap} onCheck={run} ready={ready ? ready(ty.val) : ty.val.trim().length > 0} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}
// Вывод строки n (с 1) в запуске.
const ranLine = (t, n) => ranLines(t).indexOf(n) >= 0;
const ASSIGN_RE = /(^|[^=!<>])=([^=]|$)/;
const S5_TPL = L3(['let score = 150;', 'if (¤) {', '  console.log("Yangi daraja!");', '}'], ['let score = 150;', 'if (¤) {', '  console.log("Новый уровень!");', '}'], ['let score = 150;', 'if (¤) {', '  console.log("New level!");', '}']);
const S5 = ({ p }) => {
  const c = C.s5;
  const check = (v, t, codeOf) => {
    if (jsErr(t.items)) return /is not defined/.test(jsErr(t.items).text) ? c.msgs.name : c.msgs.syntax;
    if (ASSIGN_RE.test(v)) return c.msgs.assign;
    if (!/\bscore\b/.test(v)) return c.msgs.noScore;
    if (!/\b100\b/.test(v)) return c.msgs.no100;
    if (!ranLine(t, 3)) return c.msgs.dir;
    const low = jsTrace(codeOf(v).map((l, i) => (i === 0 ? 'let score = 50;' : l)));
    if (ranLine(low, 3)) return c.msgs.always;
    return null;
  };
  return <GapTask p={p} id="s5" tpl={S5_TPL} gapAt={1} check={check} keys={['>', '<']} example={L3('if (score > 100) {', 'if (score > 100) {', 'if (score > 100) {')} type="write-condition" ready={(x) => x.trim().length > 6} />;
};
const S8_TPL = L3(['let coins = ¤;', 'if (coins > 50) {', '  console.log("Qilich sizniki!");', '} else {', '  console.log("Tanga yetmaydi");', '}'],
  ['let coins = ¤;', 'if (coins > 50) {', '  console.log("Меч твой!");', '} else {', '  console.log("Монет не хватает");', '}'],
  ['let coins = ¤;', 'if (coins > 50) {', '  console.log("The sword is yours!");', '} else {', '  console.log("Not enough coins");', '}']);
const S8 = ({ p }) => {
  const c = C.s8;
  const check = (v, t) => {
    if (!/^\d{1,6}$/.test(v)) return c.msgs.num;
    if (jsErr(t.items)) return c.msgs.num;
    if (ranLine(t, 3)) return fillL(c.msgs.ifRan, { v: sayHide(v) });
    return null;
  };
  return <GapTask p={p} id="s8" tpl={S8_TPL} gapAt={0} check={check} keys={[]} max={6} example={L3('let coins = 20;', 'let coins = 20;', 'let coins = 20;')} type="pick-value-else" />;
};
const S10_TPL = L3(['let password = "¤";', 'if (password === "Kodi2026") {', '  console.log("Eshik ochildi!");', '} else {', '  console.log("Parol xato");', '}'],
  ['let password = "¤";', 'if (password === "Kodi2026") {', '  console.log("Дверь открыта!");', '} else {', '  console.log("Неверный пароль");', '}'],
  ['let password = "¤";', 'if (password === "Kodi2026") {', '  console.log("The door is open!");', '} else {', '  console.log("Wrong password");', '}']);
const S10 = ({ p }) => {
  const c = C.s10;
  const check = (v, t) => {
    if (jsErr(t.items) || /["']/.test(v)) return c.msgs.quote;
    if (v === 'Kodi2026') return null;
    if (v.replace(/\s/g, '') === 'Kodi2026') return c.msgs.space;
    if (v.toLowerCase() === 'kodi2026') return c.msgs.caseM;
    return c.msgs.other;
  };
  return <GapTask p={p} id="s10" tpl={S10_TPL} gapAt={0} check={check} keys={[]} max={16} example={L3('let password = "Kodi2026";', 'let password = "Kodi2026";', 'let password = "Kodi2026";')} type="match-password" />;
};
const S14_TPL = L3(['let lives = 3;', 'if (¤) {', '  console.log("Game over");', '} else {', '  console.log("Davom eting!");', '}', 'console.log(lives);'],
  ['let lives = 3;', 'if (¤) {', '  console.log("Game over");', '} else {', '  console.log("Беги дальше!");', '}', 'console.log(lives);'],
  ['let lives = 3;', 'if (¤) {', '  console.log("Game over");', '} else {', '  console.log("Keep running");', '}', 'console.log(lives);']);
const S14 = ({ p }) => {
  const c = C.s14;
  const check = (v, t, codeOf) => {
    if (jsErr(t.items)) return c.msgs.syntax;
    if (ASSIGN_RE.test(v)) return c.msgs.still;
    if (!/\blives\b/.test(v) || !/\b0\b/.test(v)) return c.msgs.keep;
    const lv = memVal(t, 'lives');
    if (!lv || lv.val !== 3 || !ranLine(t, 5)) return c.msgs.keep;
    const zero = jsTrace(codeOf(v).map((l, i) => (i === 0 ? 'let lives = 0;' : l)));
    if (!ranLine(zero, 3)) return c.msgs.keep;
    return null;
  };
  return <GapTask p={p} id="s14" tpl={S14_TPL} gapAt={1} check={check} keys={['=']} prefill="lives = 0" example={L3('if (lives === 0) {', 'if (lives === 0) {', 'if (lives === 0) {')} type="fix-assign" ready={(x) => /==/.test(x)} />;
};

// =============================================================================
// S12. ЗАДАНИЕ «КАКИЕ СТРОКИ ВЫПОЛНЯТСЯ?» — отметить строки, «Проверить»; потом код идёт по шагам. 2 раунда.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const log = useLog();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [sel, setSel] = useState({});
  const [okR, setOkR] = useState(solved);
  const [runN, setRunN] = useState(0);
  const misses = useRef(0);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const R = c.rounds[r];
  const code = codeOfL(pick, R.code);
  const full = useMemo(() => jsTrace(code), [r, code.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const want = ranLines(full);
  const tr = okR ? full : null;
  const A = useTraceAnim(tr, r + ':' + runN);
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const [msg, setMsg] = useState(null);
  const hints = [c.hint1, c.hint2, R.why];
  const toggle = (n) => { if (!canTap || okR) return; sfx('tap', true); setMsg(null); setSel((s) => Object.assign({}, s, { [n]: !s[n] })); };
  const check = () => {
    if (!canTap || okR) return;
    const picked = Object.keys(sel).filter((k) => sel[k]).map(Number);
    const extra = picked.filter((n) => want.indexOf(n) < 0);
    const miss = want.filter((n) => picked.indexOf(n) < 0);
    if (extra.length || miss.length) {
      misses.current += 1; sfx('soft', true);
      const m = extra.length ? c.extra : miss.indexOf(want[want.length - 1]) >= 0 && want[want.length - 1] > (full.steps.find((s) => s.cond != null) || {}).line ? c.after : c.miss;
      setMsg(m); sayNow(m, 'think'); if (misses.current >= 2) lad.bump(); return;
    }
    sfx('ok', true); setOkR(true); setMsg(null); setRunN((x) => x + 1);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's12', type: 'which-lines-run', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkR(false); setSel({}); }, reduceMotion() ? 300 : 3200 + full.n * 560);
  };
  const lines = code.map((t, i) => {
    const n = i + 1;
    const br = isBrace(t);
    const on = !!sel[n];
    return jsL('l' + i, 0, t, {
      cls: (okR ? execCls(A, n) : '') + (on && !okR ? ' j5-sel' : '') + (br ? ' j5-brace' : ' j5-pickable') + (lad.lv >= 3 && !okR && !br && want.indexOf(n) >= 0 && !on ? ' is-hl' : ''),
      onTap: !br && canTap && !okR && !solved ? () => toggle(n) : null, disabled: !canTap
    });
  });
  const nSel = Object.keys(sel).filter((k) => sel[k]).length;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : (msg || hintAt(lad.lv, hints))} err={!!msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okR) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <KzCode key={r} lines={lines} cls="kz-code-sm j1-js j1-num j5-pickcode" />
            {okR ? <JsCalc steps={lastCalc(code, tr, A.k)} /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!okR && !solved ? <RunBar onRun={check} ready={nSel > 0} canTap={canTap} label={UI.check} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. ЗАДАНИЕ «НАЙДИ СЛОМАННУЮ СТРОКУ» — по консоли и «Памяти»; 3 раунда.
// =============================================================================
function S13({ p }) {
  const pick = usePick();
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
  const hints = [R.hint1 || c.hint1, c.hint2, R.why];
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
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkR(false); }, reduceMotion() ? 300 : 2600);
  };
  const RL = codeOfL(pick, R.lines);
  const tr = useMemo(() => jsTrace(RL), [r, RL.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const A = useTraceAnim(tr, r);
  const lines = RL.map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A, i + 1) + (okR && i === R.bad ? ' is-err-line is-found' : '') + (bad === i ? ' is-bad' : '') + (lad.lv >= 3 && !okR && i === R.bad ? ' is-hl' : ''),
    onTap: canTap && !solved && !okR ? () => tap(i) : null, disabled: !canTap }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={R.ask || c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
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
// S16. ЗАДАНИЕ «СВОЯ ДВЕРЬ» — сколько очков у игрока, сколько нужно, два сообщения; «Запустить».
// =============================================================================
const s16Code = (v) => ['let score = ' + v[0] + ';', 'if (score > ' + v[1] + ') {', '  console.log("' + v[2] + '");', '} else {', '  console.log("' + v[3] + '");', '}'];
function S16({ p }) {
  const pick = usePick();
  const c = C.s16;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s16');
  const solved = !!(rec && rec.done);
  const t1 = useTagTyping({ max: 5 }), t2 = useTagTyping({ max: 5 }), t3 = useTagTyping({ max: 24 }), t4 = useTagTyping({ max: 24 });
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
    const v = [t1.val.trim(), t2.val.trim(), JS_Q(t3.val).trim(), JS_Q(t4.val).trim()];
    if (!v[0] || !v[1]) { T.miss(c.msgs.nums, sayNow); return; }
    if (!/^\d{1,5}$/.test(v[0]) || !/^\d{1,5}$/.test(v[1])) { T.miss(c.msgs.digits, sayNow); return; }
    if (!v[2] || !v[3]) { T.miss(c.msgs.texts, sayNow); return; }
    if (/["\\]/.test(v[2] + v[3])) { T.miss(c.msgs.quote, sayNow); return; }
    const t = jsTrace(s16Code(v));
    setTr(t); setCv(v); setRunN((x) => x + 1);
    if (jsErr(t.items)) { T.miss(c.msgs.quote, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    store.set('j5Prog', s16Code(v));
    log(T.logRec('s16', 'own-if-else'));
    sayNow(joinL(Number(v[0]) > Number(v[1]) ? c.wentIf : c.wentElse, c.ok), 'cheer');
  };
  const f = (ty, k, ph, mx, wide) => gapOf(k, ty, T.setMsg, run, ph, c.ask, mx, false, wide);
  const lines = ok ? s16Code(cv).map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A, i + 1) })) : [
    gapLine('l0', 'let score = ¤;', f(t1, 'f1', c.ph[0], 5)),
    gapLine('l1', 'if (score > ¤) {', f(t2, 'f2', c.ph[1], 5)),
    gapLine('l2', '  console.log("¤");', f(t3, 'f3', c.ph[2], 24, true)),
    jsL('l3', 0, '} else {'),
    gapLine('l4', '  console.log("¤");', f(t4, 'f4', c.ph[3], 24, true)),
    jsL('l5', 0, '}')
  ];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm j1-js j1-num j5-own" />
            {tr && !jsErr(tr.items) ? <JsCalc steps={lastCalc(s16Code(cv), tr, A.k)} /> : null}
            {!ok && T.lad.lv >= 3 ? <HelpCode code={pick(c.example)} /> : null}
          </div>
          <div className="kz-col"><JsSide anim={tr ? A : null} mem={[]} items={[]} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={!!(t1.val.trim() && t2.val.trim() && t3.val.trim() && t4.val.trim())} canTap={canTap} /> : null}
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
// S18. ВЫВОД — разгадка; дверь ученика из s16 по шагам; что умеем; следующий урок.
// =============================================================================
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const prog = store.get('j5Prog') || s16Code(['120', '100', pick(c.def[0]), pick(c.def[1])]);
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
            <div className="j4-endcode"><KzCode lines={prog.map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A, i + 1) }))} cls="kz-code-sm j1-js j1-num" /><JsCalc steps={lastCalc(prog, tr, A.k)} /></div>
            <JsSide anim={A} />
          </div>
          <div className="kz-roles j1-endroles">
            {['riddle', 'if', 'else', 'cond'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'if' ? '#16A34A' : k === 'else' ? '#2563EB' : '#7C3AED' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'CHECK', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 },
  { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'CHECK', Comp: S7 },
  { id: 's8', code: 'LEVEL-2', Comp: S8 }, { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-2', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 }, { id: 's13', code: 'LEVEL-2', Comp: S13 },
  { id: 's14', code: 'LEVEL-3', Comp: S14 }, { id: 's15', code: 'CHECK', Comp: S15 }, { id: 's16', code: 'LEVEL-3', Comp: S16 },
  { id: 's17', code: 'CHECK', Comp: S17 }, { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonJs5Artifact(store) {
  const prog = store.get('j5Prog');
  return prog ? { type: 'js-if-else', code: prog.join('\n') } : null;
}

export default function JsUsloviya1({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonJs5Artifact(store) })
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
