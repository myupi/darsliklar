// =============================================================================
// ЭКРАНЫ УРОКА 1 КУРСА JAVASCRIPT «Что такое JavaScript» (облик «Редактор», 26.11.2026).
// Основа — урок 1 CSS (tools/css1/): строки KzCode, поле в строке (InlineInput), клавиши KeyRow, окно PaperBrowser.
// Своё: честный JavaScript (j1-engine.jsx: jsRun, jsParts, JsConsole), страница сайта Коди с кнопкой, консоль Chrome
// под страницей. Объяснения — показом (useKzDemo), руки и кнопок-обманок нет.
// =============================================================================
const sp1 = () => <span className="c1-sp">{' '}</span>;
const spaced1 = (parts) => (parts || []).map((x) => (x === ' ' ? sp1() : x));
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced1(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const textL = (k, d, t, w, extra) => codeLine(k, [T_(t), W_(w), T_(t, true)], Object.assign({ d }, extra || {}));
const htmlL = (k, d, parts, extra) => codeLine(k, parts, Object.assign({ d }, extra || {}));
const scriptSrcL = (k, d, extra) => htmlL(k, d, htmlTag('script', [['src', '"script.js"']], true), extra);
const CYR_JS = L3("Harflar kirillchada yozilganga o'xshaydi. JavaScript buyruqlari lotin harflarida yoziladi: klaviaturani EN ga almashtiring.",
  'Похоже, буквы набраны по-русски. Команды JavaScript пишут английскими буквами: переключи клавиатуру на EN.',
  'Looks like some letters are Cyrillic. JavaScript commands use English letters: switch your keyboard to EN.');
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

// Сайт Коди: mode 'html' — голый, 'css' — одетый; alive — кнопка работает (JavaScript).
function KodiPage({ mode, count, onBtn, led, alive }) {
  const pick = usePick();
  return (
    <div className={'j1-page is-' + (mode || 'css')}>
      <h1>{pick(C.site.title)}</h1>
      <p>{pick(C.site.text)}</p>
      <button type="button" className={'j1-pbtn' + (led ? ' is-led' : '')} onClick={onBtn || undefined} disabled={!onBtn}>{pick(C.site.btn)}<Led on={!!led} /></button>
      {alive && count > 0 ? <p key={count} className="j1-count kz-a-drop">{pick(fillL(C.site.count, { n: count || 0 }))}</p> : null}
    </div>
  );
}
// Окно браузера: страница и (если con) консоль снизу, как DevTools в Chrome.
function JsWin({ page, items, con, conHl, empty, cls, short }) {
  const pick = usePick();
  return (
    <PaperBrowser title={pick(C.site.title)} url="index.html" short={short} cls={'c1-br j1-br' + (con ? ' has-con' : '') + (cls ? ' ' + cls : '')}>
      <div className="j1-win">
        <div className="j1-pagearea">{page}</div>
        {con ? <JsConsole items={items} hl={conHl} empty={empty} /> : null}
      </div>
    </PaperBrowser>
  );
}
// Кнопка «Запустить» (без клавиш символов).
function RunBar({ onRun, ready, canTap, label }) {
  const pick = usePick();
  return (
    <div className="keys j1-runbar" translate="no">
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={onRun}>▶ {pick(label || UI.run)}</button>
    </div>
  );
}
const FileBar = ({ files, hl }) => {
  const pick = usePick();
  return (
    <div className="c1-files j1-files" translate="no">
      <span className="c1-files-h">{pick(UI.files)}</span>
      {files.map((f) => <span key={f} className={'c1-file j1-file is-' + f.split('.').pop() + (hl === f ? ' is-hl' : '')}><i aria-hidden="true" />{f}</span>)}
    </div>
  );
};
// Строки index.html сайта Коди. scriptAt — где стоит тег script ('head' | 'mid' | 'end' | null); inline — код внутри script.
function kodiHtml(pick, o) {
  const opt = o || {};
  const out = [tagL('ho', 0, 'head', false, { cls: 'j1-edge' }), textL('ti', 1, 'title', pick(C.site.title))];
  if (opt.slots) out.push(opt.slots.head);
  out.push(tagL('hc', 0, 'head', true, { cls: 'j1-edge' }), tagL('bo', 0, 'body', false, { cls: 'j1-edge' }), textL('h1', 1, 'h1', pick(C.site.title)));
  if (opt.slots) out.push(opt.slots.mid);
  out.push(textL('bt', 1, 'button', pick(C.site.btn)));
  if (opt.slots) out.push(opt.slots.end);
  if (opt.script === 'inline') {
    out.push(tagL('so', 1, 'script', false, { cls: 'is-new' + (opt.lit ? ' is-hl' : '') }), jsL('sj', 2, '// JavaScript', { cls: 'is-new' }), tagL('sc', 1, 'script', true, { cls: 'is-new' + (opt.lit ? ' is-hl' : '') }));
  }
  if (opt.script === 'src') out.push(scriptSrcL('ss', 1, { cls: 'is-new' + (opt.lit ? ' is-hl' : '') }));
  out.push(tagL('bc', 0, 'body', true, { cls: 'j1-edge' }));
  return out;
}

// =============================================================================
// S1. КРЮЧОК — кнопка «Bosing» мёртвая; «JavaScript'ni ulash» — кнопка считает нажатия. Загадка Коди.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);   // 0 — нажать мёртвую, 1 — подключить, 2 — нажать живую, 3 — готово
  const [count, setCount] = useState(solved ? 1 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const press = () => {
    if (!canTap) return;
    if (st === 0) { sfx('soft', true); setSt(1); sayNow(c.dead, 'think'); return; }
    if (st >= 2) {
      sfx('pop', true); setCount((n) => n + 1);
      if (st === 2) { setSt(3); put({ done: true }); sayNow(c.works, 'wonder'); say(c.riddle, 'curious'); }
    }
  };
  const connect = () => { if (!canTap || st !== 1) return; sfx('ok', true); setSt(2); sayNow(c.alive, 'smile'); };
  const ask = st === 0 ? c.ask : st === 1 ? c.askJs : st === 2 ? c.askAgain : c.askDone;
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ask} />
        <div className="kz-scene j1-scene j1-hook">
          <JsWin page={<KodiPage mode="css" alive={st >= 2} count={count} onBtn={canTap && st !== 1 ? press : null} led={canTap && (st === 0 || st === 2)} />} />
          {st >= 2 ? <span className="j1-chip kz-a-drop" translate="no"><i aria-hidden="true" />script.js</span> : null}
        </div>
        {st === 1 ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={connect}>{pick(UI.connect)}<Led on={canTap} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «ТРИ ЯЗЫКА» — одна страница: только HTML, + CSS, + JavaScript (кнопка сама «нажимается», число растёт).
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [v, setV] = useState(solved ? 2 : 0);
  const [count, setCount] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => setV(0) }, { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => { sfx('pop', true); setV(1); } }, { wait: 400 * ms }, { say: [{ text: c.steps[1], pose: 'smile' }] },
    { act: () => { sfx('ok', true); setV(2); } }, { wait: 400 * ms }, { say: [{ text: c.steps[2], pose: 'wonder' }] },
    { act: () => put({ done: true }) }
  ] });
  useEffect(() => {
    if (v !== 2 || reduceMotion()) return undefined;
    const t = setInterval(() => setCount((n) => (n >= 9 ? 1 : n + 1)), 1100);
    return () => clearInterval(t);
  }, [v]);
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-three">
          <div className="j1-roles">
            {['html', 'css', 'js'].map((k, i) => <span key={k} className={'j1-role is-' + k + (v >= i ? ' is-on' : '') + (v === i ? ' is-cur' : '')} translate="no">{pick(c.roles[k])}</span>)}
          </div>
          <JsWin page={<KodiPage mode={v === 0 ? 'html' : 'css'} alive={v === 2} count={count} />} cls={v === 2 ? 'is-tick' : ''} />
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ЗАДАНИЕ «КТО ЭТО ДЕЛАЕТ?» — 6 раундов: HTML, CSS или JavaScript.
// =============================================================================
const LANG3 = [['html', 'HTML'], ['css', 'CSS'], ['js', 'JavaScript']];
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
      log({ screenId: 's3', type: 'sort-lang', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
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
          <div className="j1-langs">
            {LANG3.map(([k, n]) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK} className={'j1-lang is-' + k + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)} translate="no">{n}</button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ПОКАЗ «ГДЕ ЖИВЁТ JS» — script в конце body с кодом внутри; потом файл script.js и <script src="script.js">.
// =============================================================================
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { wait: 300 * ms }, { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => setN(2) }, { say: [{ text: c.steps[1], pose: 'explain' }] },
    { act: () => { sfx('pop', true); setN(3); } }, { wait: 300 * ms }, { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const lines = kodiHtml(pick, { script: n >= 3 ? 'src' : n >= 1 ? 'inline' : null, lit: n === 2 || n === 3 });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair j1-solo">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          {n >= 3 ? <div className="kz-col kz-a-drop"><KzCode lines={[jsL('j1', 0, pick(L3('// Kodi tugmasi uchun kod', '// код для кнопки Коди', "// code for Kodi's button"))), jsL('j2', 0, 'console.log("Salom!");')]} cls="kz-code-sm j1-js" /><FileBar files={['index.html', 'style.css', 'script.js']} hl="script.js" /></div> : null}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ЗАДАНИЕ «ГДЕ ПОСТАВИТЬ SCRIPT?» — три места: head, между заголовком и кнопкой, перед </body>.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [ok, setOk] = useState(solved);
  const [bad, setBad] = useState(null);
  const [count, setCount] = useState(0);
  const T = useRef({ tries: 0, misses: 0 });
  const lad = useKzLadder(!solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const choose = (k) => {
    if (!canTap || ok) return;
    T.current.tries += 1;
    if (k !== 'end') { T.current.misses += 1; shake(setBad, k); sfx('soft', true); setMsg(c.wrong[k]); sayNow(c.wrong[k], 'think'); if (T.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); setOk(true); put({ done: true });
    log({ screenId: 's5', type: 'script-place', correct: true, firstTry: T.current.misses === 0, attempts: T.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const slot = (k) => (ok ? (k === 'end' ? scriptSrcL('sl' + k, 1, { cls: 'is-new' }) : codeLine('sl' + k, [], { cls: 'j1-gone' }))
    : codeLine('sl' + k, [<span key="s" className="j1-slot">+ script</span>], { d: 1, cls: 'j1-slotline' + (bad === k ? ' is-bad' : '') + (lad.lv >= 3 && k === 'end' ? ' is-hl' : ''), onTap: canTap ? () => choose(k) : null, disabled: !canTap }));
  const lines = kodiHtml(pick, { slots: { head: slot('head'), mid: slot('mid'), end: slot('end') } }).filter((l) => !(l.cls === 'j1-gone'));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={ok ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene j1-scene j1-pair j1-solo">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. ЗАДАНИЕ «ВПИШИ ФАЙЛ» — <script src="…"> → script.js.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const log = useLog();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 24 });
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(solved);
  const [count, setCount] = useState(0);
  const st = useRef({ tries: 0, misses: 0 });
  const lad = useKzLadder(!ok);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok && !ty.val, 0);
  const check = () => {
    if (!canTap || ok) return;
    st.current.tries += 1;
    const w = JS_Q(ty.val).replace(/["']/g, '').trim().toLowerCase();
    const issue = /[Ѐ-ӿ]/.test(ty.val) ? CYR_JS : !w ? c.msgs.empty : w === 'script.js' ? null : w === 'style.css' ? c.msgs.css : w === 'index.html' ? c.msgs.html : w === 'script' ? c.msgs.noExt : c.msgs.other;
    if (!issue) {
      sfx('win', true); setMsg(null); setOk(true); put({ done: true });
      log({ screenId: 's6', type: 'script-src', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const field = [<span key="lt" className="j1-tb">{'<'}</span>, <span key="n" className="j1-tn">script</span>, ' ', <span key="a" className="j1-an">src</span>, <span key="e" className="j1-tb">=</span>, <span key="q1" className="j1-av">"</span>,
    <span key="g" className={'kz-gap c1-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={24} /></span>,
    <span key="q2" className="j1-av">"</span>, <span key="gt" className="j1-tb">{'>'}</span>, <span key="c" className="j1-tb">{'</'}</span>, <span key="cn" className="j1-tn">script</span>, <span key="cg" className="j1-tb">{'>'}</span>];
  const lines = kodiHtml(pick).slice(0, -1).concat([ok ? scriptSrcL('ss', 1, { cls: 'is-new' }) : htmlL('ss', 1, field, { cls: 'is-hl' }), tagL('bc', 0, 'body', true, { cls: 'j1-edge' })]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /><FileBar files={['index.html', 'style.css', 'script.js']} hl={lad.lv >= 3 ? 'script.js' : null} /></div>
        </div>
        {!ok ? <KeyRow keys={['.']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 2} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ПОКАЗ «console.log» — «Запустить»: на странице ничего; открывается консоль — там сообщение.
// =============================================================================
const S7_CODE = 'console.log("Salom, dunyo!");';
function S7({ p }) {
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [ran, setRan] = useState(solved);
  const [con, setCon] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setRan(true); } }, { wait: 500 * ms }, { say: [{ text: c.steps[0], pose: 'think' }] },
    { act: () => { sfx('pop', true); setCon(true); } }, { wait: 500 * ms }, { say: [{ text: c.steps[1], pose: 'wonder' }] },
    { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={[jsL('l1', 0, S7_CODE, { cls: ran ? 'is-run' : 'is-hl' })]} cls="kz-code-sm j1-js" />
            <span className={'j1-runchip' + (ran ? ' is-on' : '')} translate="no">▶ Run</span>
            {con ? <span className="j1-f12 kz-a-drop" translate="no"><b>F12</b> → Console</span> : null}
          </div>
          <div className="kz-col"><JsWin page={<KodiPage mode="css" />} con={con} items={ran ? jsRun([S7_CODE]) : []} conHl={0} /></div>
        </div>
      </Sheet>
    </StageB>
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

// =============================================================================
// S8. ЗАДАНИЕ «ТВОЁ СООБЩЕНИЕ» — console.log("…") — своё слово в кавычках, «Запустить».
// =============================================================================
function S8({ p }) {
  const c = C.s8;
  const log = useLog();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 30 });
  const [ok, setOk] = useState(solved);
  const [items, setItems] = useState(solved ? jsRun(['console.log("' + (rec.v || 'Salom') + '");']) : []);
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
    T.hit(); const res = jsRun(['console.log("' + v + '");']); setItems(res);
    sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s8', 'first-log'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [<span key="o" className="j1-obj">console</span>, <span key="d" className="j1-punc">.</span>, <span key="f" className="j1-fn">log</span>, <span key="p" className="j1-punc">(</span>, <span key="q" className="j1-str">"</span>,
    <span key="g" className={'kz-gap c1-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={run} placeholder={L3('…', '…', '…')} label={c.ask} max={30} /></span>,
    <span key="q2" className="j1-str">"</span>, <span key="p2" className="j1-punc">)</span>, <span key="s" className="j1-punc">;</span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={[ok ? jsL('l1', 0, 'console.log("' + (rec && rec.v ? rec.v : JS_Q(ty.val)) + '");', { cls: 'is-new' }) : codeLine('l1', parts, { cls: 'is-hl' })]} cls="kz-code-sm j1-js" /></div>
          <div className="kz-col"><JsOut items={items} empty={UI.conEmpty} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={ty.val.trim().length > 0} canTap={canTap} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЗАДАНИЕ «ЧТО ПОКАЖЕТ КОНСОЛЬ?» — 3 раунда; после верного ответа строка выполняется.
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
  const tap = (i) => {
    if (!canTap || solved || okK != null) return;
    if (i !== R.a) { misses.current += 1; shake(setBad, i); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(i);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's9', type: 'predict-log', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1900);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene j1-scene j1-pair j1-predict">
          <div className="kz-col">
            <span className="j1-dots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK != null) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <KzCode key={r} lines={[jsL('l1', 0, R.code, { cls: okK != null ? 'is-run' : 'is-hl' })]} cls="kz-code-sm j1-js" />
            <div className="j1-opts" key={'o' + r}>
              {R.opts.map((o, i) => (
                <button key={i} type="button" data-v={'o' + i} disabled={!canTap || solved || okK != null} className={'j1-opt kz-a-drop' + (okK === i ? ' is-ok' : '') + (bad === i ? ' is-bad' : '') + (o === 'err' ? ' is-err' : '')} onClick={() => tap(i)} translate="no">
                  {o === 'err' ? pick(UI.err) : o}
                </button>
              ))}
            </div>
          </div>
          <div className="kz-col"><JsOut items={okK != null ? jsRun([R.code]) : []} empty={UI.conEmpty} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ПОКАЗ «КРАСНЫЕ ОШИБКИ» — без кавычек, Console с большой буквы, без скобки.
// =============================================================================
const S10_LINES = ['console.log(Salom);', 'Console.log("Salom");', 'console.log("Salom";'];
function S10({ p }) {
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : -1);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setN(0); } }, { wait: 400 * ms }, { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => { sfx('soft', true); setN(1); } }, { wait: 400 * ms }, { say: [{ text: c.steps[1], pose: 'point' }] },
    { act: () => { sfx('soft', true); setN(2); } }, { wait: 400 * ms }, { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const lines = n < 0 ? [] : [S10_LINES[n]];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode key={n} lines={lines.length ? [jsL('l1', 0, lines[0], { cls: 'is-err-line' })] : [jsL('l0', 0, '// …')]} cls="kz-code-sm j1-js" />
            <span className="j1-dots">{S10_LINES.map((x, i) => <i key={i} className={i < n ? 'is-done' : i === n ? 'is-now' : ''} />)}</span>
          </div>
          <div className="kz-col"><JsOut items={lines.length ? jsRun(lines) : []} empty={UI.conEmpty} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ЗАДАНИЕ «ИСПРАВЬ» — console.log(Salom); → кавычки.
// =============================================================================
function S11({ p }) {
  const c = C.s11;
  const log = useLog();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 24 });
  useEffect(() => { if (!solved) ty.setVal('Salom'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [ok, setOk] = useState(solved);
  const [items, setItems] = useState(solved ? jsRun(['console.log("Salom");']) : jsRun(['console.log(Salom);']));
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim();
    const res = jsRun(['console.log(' + v + ');']);
    setItems(res);
    const e = jsErr(res);
    if (/[Ѐ-ӿ]/.test(v.replace(/(["'`]).*?\1/g, ''))) { T.miss(CYR_JS, sayNow); return; }
    if (e) {
      if (/is not defined/.test(e.text)) { T.miss(c.msgs.still, sayNow); return; }
      if (/Invalid or unexpected/.test(e.text)) { T.miss(c.msgs.half, sayNow); return; }
      T.miss(c.msgs.other, sayNow); return;
    }
    const outs = jsLogs(res);
    if (outs[0] !== 'Salom') { T.miss(c.msgs.word, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true });
    log(T.logRec('s11', 'fix-quotes'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [<span key="o" className="j1-obj">console</span>, <span key="d" className="j1-punc">.</span>, <span key="f" className="j1-fn">log</span>, <span key="p" className="j1-punc">(</span>,
    <span key="g" className="kz-gap c1-slot"><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={run} label={c.ask} max={24} /></span>,
    <span key="p2" className="j1-punc">)</span>, <span key="s" className="j1-punc">;</span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={[ok ? jsL('l1', 0, 'console.log("Salom");', { cls: 'is-new' }) : codeLine('l1', parts, { cls: 'is-hl' })]} cls="kz-code-sm j1-js" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code={'console.log("Salom");'} /> : null}
          </div>
          <div className="kz-col"><JsOut items={items} /></div>
        </div>
        {!ok ? <KeyRow keys={['"', "'"]} ty={ty} canTap={canTap} onCheck={run} ready label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ЗАДАНИЕ «НАЙДИ СЛОМАННУЮ СТРОКУ» — по консоли (номер строки у красного сообщения); 2 раунда.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const log = useLog();
  const [rec, put] = useRec('s12');
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
      log({ screenId: 's12', type: 'find-error-line', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkR(false); }, reduceMotion() ? 300 : 1900);
  };
  const RL = pick(R.lines);
  const A12 = useRunAnim(jsRun(RL));
  const lines = RL.map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A12, i + 1) + (okR && i === R.bad ? ' is-err-line is-found' : '') + (bad === i ? ' is-bad' : '') + (lad.lv >= 3 && !okR && i === R.bad ? ' is-hl' : ''),
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
          <div className="kz-col"><JsOut anim={A12} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. ЗАДАНИЕ «ПОРЯДОК» — три console.log вперемешку; стрелками поставить по порядку: код работает сверху вниз.
// =============================================================================
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const log = useLog();
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const [order, setOrder] = useState(solved ? [0, 1, 2] : [2, 0, 1]);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const done = order.join() === '0,1,2';
  const move = (i, d) => {
    if (!canTap || solved) return;
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const o = order.slice(); [o[i], o[j]] = [o[j], o[i]];
    sfx('pop', true); setOrder(o); T.hit();
    if (o.join() === '0,1,2') { put({ done: true }); log(T.logRec('s13', 'line-order')); sayNow(c.ok, 'cheer'); }
  };
  const code = order.map((k) => 'console.log("' + pick(c.lines[k]) + '");');
  const A13 = useRunAnim(jsRun(code));
  const lines = code.map((t, i) => jsL('l' + order[i], 0, t, { cls: execCls(A13, i + 1), move: solved ? { hide: true } : { up: canTap && i > 0 ? () => move(i, -1) : null, down: canTap && i < 2 ? () => move(i, 1) : null, hl: T.lad.lv >= 3 } }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={c.ask} hint={solved || done ? null : T.now()} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num" /></div>
          <div className="kz-col"><JsOut anim={A13} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ЗАДАНИЕ «СТРОКА ЦЕЛИКОМ» — ученик пишет console.log("…") сам; ошибки — по консоли.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const log = useLog();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 60 });
  const [ok, setOk] = useState(solved);
  const [items, setItems] = useState(solved ? jsRun([rec.v || pick(c.sample)]) : []);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok && !ty.val, 0);
  const run = () => {
    if (!canTap || ok) return;
    const v = JS_Q(ty.val).trim();
    if (!v) { T.miss(c.msgs.empty, sayNow); return; }
    const res = jsRun([v]);
    setItems(res);
    const e = jsErr(res);
    if (e) {
      const t = e.text;
      const name = (/ReferenceError: (\S+) is not defined/.exec(t) || [])[1] || '';
      const m = /[Ѐ-ӿ]/.test(name) ? CYR_JS : /Console is not defined/.test(t) ? c.msgs.cap : /is not defined/.test(t) ? c.msgs.ref : /is not a function/.test(t) ? c.msgs.fn
        : /missing \)/.test(t) ? c.msgs.paren : /Invalid or unexpected/.test(t) ? c.msgs.token : c.msgs.syntax;
      T.miss(m, sayNow); return;
    }
    if (!jsLogs(res).some((x) => x.trim())) { T.miss(c.msgs.noLog, sayNow); return; }
    T.hit(); sfx('win', true); setOk(true); put({ done: true, v: v });
    log(T.logRec('s14', 'write-line'));
    sayNow(c.ok, 'cheer');
  };
  const parts = [<span key="g" className={'kz-gap c1-slot j1-wide' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={run} placeholder={L3('console.log(…)', 'console.log(…)', 'console.log(…)')} label={c.ask} max={60} /></span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col">
            <KzCode lines={[ok ? jsL('l1', 0, rec && rec.v ? rec.v : JS_Q(ty.val), { cls: 'is-new' }) : codeLine('l1', parts, { cls: 'is-hl' })]} cls="kz-code-sm j1-js" />
            {!ok && T.lad.lv >= 3 ? <HelpCode code={pick(c.sample)} /> : null}
          </div>
          <div className="kz-col"><JsOut items={items} empty={UI.conEmpty} /></div>
        </div>
        {!ok ? <KeyRow keys={['.', '(', ')', '"', ';']} ty={ty} canTap={canTap} onCheck={run} ready={ty.val.trim().length > 8} label={UI.run} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ЗАДАНИЕ «ТВОЯ ВИЗИТКА» — три пропуска: имя, игра (в кавычках) и год рождения (число): 2026 - год.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s15');
  const solved = !!(rec && rec.done);
  const t1 = useTagTyping({ max: 20 }), t2 = useTagTyping({ max: 24 }), t3 = useTagTyping({ max: 4 });
  const [ok, setOk] = useState(solved);
  const vals = solved ? rec.v : [t1.val, t2.val, t3.val];
  const codeOf = (v) => ['console.log("' + pick(c.pre[0]) + JS_Q(v[0]) + '");', 'console.log("' + pick(c.pre[1]) + JS_Q(v[1]) + '");', 'console.log(2026 - ' + JS_Q(v[2]) + ');'];
  const [items, setItems] = useState(solved ? jsRun(codeOf(rec.v)) : []);
  const T = useRunTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const run = () => {
    if (!canTap || ok) return;
    const v = [t1.val.trim(), t2.val.trim(), t3.val.trim()];
    if (v.some((x) => !x)) { T.miss(c.msgs.empty, sayNow); return; }
    if (/["'`“”«»]/.test(v[0] + v[1])) { T.miss(c.msgs.quote, sayNow); return; }
    const y = Number(v[2]);
    if (!/^\d{4}$/.test(v[2]) || 2026 - y < 3 || 2026 - y > 100) { T.miss(c.msgs.year, sayNow); return; }
    T.hit(); setItems(jsRun(codeOf(v))); sfx('win', true); setOk(true); put({ done: true, v: v });
    store.set('j1Prog', codeOf(v));
    log(T.logRec('s15', 'own-program'));
    sayNow(c.ok, 'cheer');
  };
  const field = (ty, k, ph, max) => <span key={k} className="kz-gap c1-slot"><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={run} placeholder={ph} label={c.ask} max={max} /></span>;
  const strLine = (k, pre, f) => codeLine(k, [<span key="o" className="j1-obj">console</span>, <span key="d" className="j1-punc">.</span>, <span key="f" className="j1-fn">log</span>, <span key="p" className="j1-punc">(</span>,
    <span key="s" className="j1-str">{'"' + pre}</span>, f, <span key="q" className="j1-str">"</span>, <span key="p2" className="j1-punc">)</span>, <span key="sc" className="j1-punc">;</span>], { cls: 'is-hl' });
  const A15 = useRunAnim(items);
  const lines = ok ? codeOf(vals).map((t, i) => jsL('l' + i, 0, t, { cls: 'is-new' + execCls(A15, i + 1) })) : [
    strLine('l0', pick(c.pre[0]), field(t1, 'f1', c.ph[0], 20)),
    strLine('l1', pick(c.pre[1]), field(t2, 'f2', c.ph[1], 24)),
    codeLine('l2', [<span key="o" className="j1-obj">console</span>, <span key="d" className="j1-punc">.</span>, <span key="f" className="j1-fn">log</span>, <span key="p" className="j1-punc">(</span>, <span key="n" className="j1-num">2026</span>, ' ', <span key="m" className="j1-punc">-</span>, ' ', field(t3, 'f3', c.ph[2], 4), <span key="p2" className="j1-punc">)</span>, <span key="sc" className="j1-punc">;</span>], { cls: 'is-hl' })
  ];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ok ? null : (T.next() || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="j1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene j1-scene j1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm j1-js j1-num" /></div>
          <div className="kz-col"><JsOut anim={A15} empty={UI.conEmpty} /></div>
        </div>
        {!ok ? <RunBar onRun={run} ready={!!(t1.val.trim() && t2.val.trim() && t3.val.trim().length === 4)} canTap={canTap} /> : null}
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
            <b key={r} className="kz-a-drop">{pick(R.q)}</b>
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
// S17. ВЫВОД — разгадка; программа ученика из s15 в консоли; что умеем; следующий урок.
// =============================================================================
function S17({ p }) {
  const pick = usePick();
  const c = C.s17;
  const store = useStore();
  const prog = store.get('j1Prog') || ['console.log("' + pick(C.s15.pre[0]) + 'Kodi");', 'console.log("' + pick(C.s15.pre[1]) + 'Minecraft");', 'console.log(2026 - 2014);'];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'shy' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const A17 = useRunAnim(jsRun(prog));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="j1-sheet">
        <div className="kz-scene j1-scene j1-end">
          <div className="j1-endpair">
            <KzCode lines={prog.map((t, i) => jsL('l' + i, 0, t, { cls: execCls(A17, i + 1) }))} cls="kz-code-sm j1-js j1-num" />
            <JsOut anim={A17} />
          </div>
          <div className="kz-roles j1-endroles">
            {['riddle', 'roles', 'where', 'errors'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'roles' ? '#E5B800' : k === 'where' ? '#0FA38E' : '#DC2626' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 },
  { id: 's4', code: 'SHOW', Comp: S4 }, { id: 's5', code: 'LEVEL-1', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 's8', code: 'LEVEL-2', Comp: S8 }, { id: 's9', code: 'CHECK', Comp: S9 },
  { id: 's10', code: 'SHOW', Comp: S10 }, { id: 's11', code: 'LEVEL-2', Comp: S11 }, { id: 's12', code: 'LEVEL-2', Comp: S12 },
  { id: 's13', code: 'LEVEL-2', Comp: S13 }, { id: 's14', code: 'LEVEL-3', Comp: S14 }, { id: 's15', code: 'LEVEL-3', Comp: S15 },
  { id: 's16', code: 'CHECK', Comp: S16 }, { id: 's17', code: 'ACHIEVEMENT', Comp: S17 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonJs1Artifact(store) {
  const prog = store.get('j1Prog');
  return prog ? { type: 'js-first-program', code: prog.join('\n') } : null;
}

export default function JsChtoTakoe({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonJs1Artifact(store) })
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
