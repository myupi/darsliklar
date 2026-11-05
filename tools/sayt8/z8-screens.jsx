// =============================================================================
// ЭКРАНЫ УРОКА 8 «Структура настоящего сайта» (облик «Редактор»). Сделаны с нуля; основа кода — экраны уроков 2–7.
// Типы заданий — по разделу 3а навыка: s3 вписать — s4 часть страницы ↔ строка кода; s6 собрать каркас — s7 найти пару;
// s9 вписать — s10 до и после; s12, s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет.
// Честный браузер: header, nav, main, section и footer сами страницу НЕ меняют — вид тот же. Части видны только
// в «Инспекторе» — цветные рамки с именем тега поверх страницы, как в инструментах разработчика (значок «Inspektor»
// на окне). На s11 — список частей, как его читает программа чтения с экрана. Незнакомый тег (опечатка) —
// не часть страницы: рамки нет. Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const TAG_COLORS = { header: '#FA4F28', nav: '#7C5CFA', main: '#0FA38E', section: '#D97706', footer: '#DB2777' };

function useFitPage(dep) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page) return undefined;
    const fit = () => {
      let k = 1;
      el.style.fontSize = '';
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.5) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => ro.disconnect();
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// Рамка части страницы. Без инспектора — просто обёртка без вида (как в браузере); с инспектором — цветная рамка
// и ярлык с именем тега. tap — рамку можно нажать (задание).
function Reg({ tag, on, insp, hl, k, children, tap, led, off }) {
  if (!on) return <>{children}</>;
  const c = 'z8-reg z8-reg-' + tag + (insp ? ' is-insp' : '') + (hl ? ' is-hl' : '') + (off ? ' is-off' : '');
  const inner = <>{insp ? <span className="z8-reg-tag" translate="no">{tag}</span> : null}{children}</>;
  if (tap !== undefined) return <button key={k} type="button" className={c + ' z8-map'} style={{ '--c': TAG_COLORS[tag] }} disabled={!tap} onClick={tap || undefined}>{inner}<Led on={!!led} /></button>;
  return <div key={k} className={c} style={{ '--c': TAG_COLORS[tag] }}>{inner}</div>;
}

// Сайт Коди (или свой). cfg: { header, nav: true|'title'|false, main, sec: 0|1|2, footer: true|false, top: 'header'|'head' }.
// own — свои тексты ученика { foot, secH }.
function SitePage({ cfg, insp, hl, own, tapReg, led, offRegs }) {
  const pick = usePick();
  const s = C.site;
  const menu = pick(s.menu);
  const t = pick(own ? s.myTitle : s.title);
  const secs = [{ h: own && own.secH ? own.secH : pick(s.sec1h), p: pick(s.sec1p) }, { h: pick(s.sec2h), p: pick(s.sec2p) }];
  const foot = own && own.foot ? own.foot : pick(own ? s.myFoot : s.foot);
  const ref = useFitPage(JSON.stringify([cfg, insp, hl, own, !!tapReg, offRegs]));
  const R = (tag, key, kids, on) => {
    const id = key || tag;
    return <Reg key={id} tag={tag} on={on} insp={insp} hl={hl === id} tap={tapReg ? () => tapReg(id) : undefined} led={led} off={offRegs && offRegs.indexOf(id) >= 0}>{kids}</Reg>;
  };
  const T = <div key="t" className="z8-h1">{t}</div>;
  const M = <div key="m" className="z8-menu">{menu.map((a, j) => <span key={j} className="z8-a">{a}</span>)}</div>;
  const S = (i) => <div key={'s' + i} className="z8-sec"><div className="z8-h2">{secs[i].h}</div><div className="z8-p">{secs[i].p}</div></div>;
  const F = <div key="f" className="z8-foot">{foot}</div>;
  const titleEl = cfg.nav === 'title' ? R('nav', 'nav', T, true) : T;
  const menuEl = cfg.nav === true ? R('nav', 'nav', M, true) : M;
  const top = cfg.header && cfg.top !== 'head' ? R('header', 'header', [titleEl, menuEl], true) : [titleEl, menuEl];
  const secEls = [0, 1].map((i) => (cfg.sec > i ? R('section', 'section' + (i + 1), S(i), true) : S(i)));
  const mid = cfg.main ? R('main', 'main', secEls, true) : secEls;
  const bottom = cfg.footer === true ? R('footer', 'footer', F, true) : F;
  return (
    <div ref={ref} className={'z8-doc' + (insp ? ' is-insp' : '')}>
      {insp ? <span className="z8-insp-badge"><i aria-hidden="true" />{pick(UI.insp)}</span> : null}
      {top}{mid}{bottom}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url} short={short} cls={'z8-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;

// КОД. Строки с отступом (d); содержимое частей свёрнуто в одну строку, чтобы каркас помещался на телефоне.
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts }, extra || {});
const openL = (tag, d, k, extra) => codeLine(k || tag + 'o', [T_(tag)], Object.assign({ d }, extra || {}));
const closeL = (tag, d, k, extra) => codeLine(k || tag + 'c', [T_(tag, true)], Object.assign({ d }, extra || {}));
const collL = (tag, inner, d, k, extra) => codeLine(k || tag, [T_(tag)].concat(inner, [T_(tag, true)]), Object.assign({ d }, extra || {}));
function useSiteCode() {
  const pick = usePick();
  const s = C.site;
  const menu = pick(s.menu);
  const menuParts = [T_('a'), W_(menu[0]), T_('a', true), <span key="dots" className="kz-txt z8-dots">…</span>];
  const secBare = (i, h) => [T_('h2'), W_(h || pick(i ? s.sec2h : s.sec1h)), T_('h2', true), <span key="dots" className="kz-txt z8-dots">…</span>];
  // Строки каркаса по cfg. own — свои тексты; collapse — какие части свернуть в одну строку.
  return (cfg, own, collapse) => {
    const cl = collapse || {};
    const title = pick(own ? s.myTitle : s.title);
    const foot = own && own.foot ? own.foot : pick(own ? s.myFoot : s.foot);
    const lines = [];
    const topTag = cfg.top === 'head' ? 'head' : 'header';
    if (cfg.header && cl.header) lines.push(collL(topTag, [<span key="d" className="kz-txt z8-dots">…</span>], 0, 'hd'));
    else {
      const d = cfg.header ? 1 : 0;
      if (cfg.header) lines.push(openL(topTag, 0, 'hdo'));
      lines.push(cfg.nav === 'title' ? collL('nav', [T_('h1'), W_(title), T_('h1', true)], d, 'h1') : collL('h1', [W_(title)], d, 'h1'));
      lines.push(cfg.nav === true ? collL('nav', menuParts, d, 'menu') : codeLine('menu', menuParts, { d }));
      if (cfg.header) lines.push(closeL(topTag, 0, 'hdc'));
    }
    const secLine = (i, d) => (cfg.sec > i ? collL('section', secBare(i, i === 0 && own && own.secH), d, 'sec' + i) : codeLine('sec' + i, secBare(i, i === 0 && own && own.secH), { d }));
    if (cfg.main && cl.main) lines.push(collL('main', [<span key="d" className="kz-txt z8-dots">…</span>], 0, 'mn'));
    else if (cfg.main) { lines.push(openL('main', 0, 'mno')); lines.push(secLine(0, 1)); lines.push(secLine(1, 1)); lines.push(closeL('main', 0, 'mnc')); } else { lines.push(secLine(0, 0)); lines.push(secLine(1, 0)); }
    lines.push(cfg.footer === true ? collL('footer', [W_(foot)], 0, 'ft') : cfg.footer === 'typo' ? collL('foter', [W_(foot)], 0, 'ft') : collL('p', [W_(foot)], 0, 'ft'));
    return lines;
  };
}
const FULL = { header: true, nav: true, main: true, sec: 2, footer: true };
const KNOWN = ['header', 'nav', 'main', 'section', 'footer', 'head', 'body', 'html', 'p', 'h1', 'div', 'a', 'ul', 'li', 'form', 'img', 'title'];
const lineTag = (l) => (l.k === 'hdo' || l.k === 'hdc' || l.k === 'hd' ? 'header' : l.k === 'mno' || l.k === 'mnc' || l.k === 'mn' ? 'main' : l.k === 'ft' ? 'footer' : l.k === 'menu' ? 'nav' : l.k === 'sec0' ? 'section1' : l.k === 'sec1' ? 'section2' : l.k === 'h1' ? 'h1' : null);

// =============================================================================
// S1. КРЮЧОК — сайт Коди: в коде всё подряд одной кучей. «Превратить»: код разложен по частям (header, nav,
// main, section, footer); страница в браузере НЕ изменилась, части видны только в инспекторе.
// Загадка: Коди думает, что header сам раскрасит шапку.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(1); put({ done: true });
    tm.current = setTimeout(() => { setOn(2); sfx('pop', true); }, reduceMotion() ? 100 : 1100);
    sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile');
  };
  const cfg = on ? FULL : { header: false, nav: false, main: false, sec: 0, footer: false };
  const lines = code(cfg).map((l) => Object.assign(l, { cls: on === 1 ? 'is-new' : '' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene z8-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html"><SitePage cfg={cfg} insp={on >= 2} /></Br></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. header, main, footer (показ) — части оборачиваются по очереди; страница та же, в инспекторе — рамки.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);   // 1 header; 2 main; 3 footer
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.sayHeader, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } },
    { say: [{ text: c.sayMain, pose: 'explain' }] },
    { act: () => { sfx('pop', true); setN(3); } },
    { say: [{ text: c.sayFooter, pose: 'smile' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cfg = { header: n >= 1, nav: false, main: n >= 2, sec: 0, footer: n >= 3 };
  const hl = n === 1 ? 'header' : n === 2 ? 'main' : n === 3 ? 'footer' : null;
  const newK = n === 1 ? ['hdo', 'hdc'] : n === 2 ? ['mno', 'mnc'] : n === 3 ? ['ft'] : [];
  const lines = code(cfg).map((l) => Object.assign(l, { cls: newK.indexOf(l.k) >= 0 ? 'is-new' : '' }));
  const askText = solved || demo.done ? c.askDone : c.asks[n];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z8-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html"><SitePage cfg={cfg} insp hl={solved || demo.done ? null : hl} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ ТЕГ (Fill in the Blanks) — нижняя строка: <___>© 2026 …</footer>. Честно: пока имя не то, в инспекторе
// нет рамки footer.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const isF = okNow || normT(ty.val) === 'footer';
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = normT(ty.val);
    const issue = v === 'footer' ? null : !v ? c.msgs.empty : /[<>/]/.test(v) ? c.msgs.brackets : v === 'header' || v === 'head' ? c.msgs.top : KNOWN.indexOf(v) >= 0 ? c.msgs.other : c.msgs.typo;
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-footer', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const cfg = { header: true, nav: false, main: true, sec: 0, footer: isF };
  const lines = code(cfg, null, { header: true, main: true }).slice(0, -1);
  lines.forEach((l) => { l.cls = 'z8-ctx'; });
  lines.push(okNow ? collL('footer', [W_(pick(s.foot))], 0, 'ft', { cls: 'is-new' }) : codeLine('ft', [
    <span key="l" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span></span>,
    <span key="g" className={'kz-gap z8-slot z8-slot-tag' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={12} /></span>,
    <span key="r" className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>,
    W_(pick(s.foot)), T_('footer', true)], { cls: 'is-hl' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.title)} url="index.html" short><SitePage cfg={cfg} insp hl={isF ? 'footer' : null} /></Br>
            <KzCode lines={lines} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 2} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ЧАСТЬ СТРАНИЦЫ ↔ СТРОКА КОДА (Visual Code Mapping) — в инспекторе горит рамка, ученик нажимает строку кода
// этой части (открывающий или закрывающий тег).
// =============================================================================
const S4_ROUNDS = ['footer', 'header', 'main'];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? 2 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const misses = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === 2;
  const canGo = useAdvanceGate(solved || done, spoken);
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const want = S4_ROUNDS[ri];
  const cfg = { header: true, nav: false, main: true, sec: 0, footer: true };
  const lines = code(cfg);
  // Ступени подсказки — на каждый раунд свои; ошибаться можно несколько раз (со второй ошибки ступень открывается сама).
  // Ответ — строка кода: 3-я ступень называет тег словами, и верные строки загораются.
  const ch = useChoiceHints(!found, ri);
  const hints = [c.hint1, c.hint2, fillL(c.hint3, { t: want })];
  const lit = !found && ch.lad.lv >= 3;
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    if (lineTag(lines[j]) !== want) {
      misses.current += 1;
      sfx('soft', true); setOff(off.concat(j)); sayNow(ch.miss(c.miss, hints), 'rule');
      return;
    }
    sfx('ok', true); setFound(true); setMsg(null); ch.clear();
    if (ri === 2) {
      put({ done: true });
      log({ screenId: 's4', type: 'map-part', correct: true, firstTry: misses.current === 0, attempts: misses.current + 3, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.ok[ri], c.done), 'smile');
    } else { sayNow(c.ok[ri], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); setMsg(null); sayNow(c.rounds[ri + 1], 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.done : (ch.next(hints) || c.askQ)} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={done ? c.done : c.askQ} hint={done || found ? null : ch.now(hints)} err={ch.err} n={done ? null : (ri + 1) + '/3'} />
        <div className="kz-scene z8-s5" key={'r' + ri}>
          <div className="kz-col">
            <KzCode lines={lines.map((l, j) => Object.assign(l, {
              cls: 'z8-hline' + (found && lineTag(l) === want ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && (lit ? lineTag(l) === want && off.indexOf(j) < 0 : led && off.length === 0 && j === 0)
            }))} cls="kz-code-sm" />
          </div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html"><SitePage cfg={cfg} insp hl={want} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. nav, И head ≠ header (показ) — меню (ссылки) оборачивается в nav внутри header; Коди напоминает: head из
// урока 1 — невидимые сведения, header — видимая шапка.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st5, setSt5] = useState(solved ? 2 : 0);   // 0 меню без nav; 1 nav; 2 сравнение head и header
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setSt5(1); } },
    { say: [{ text: c.sayNav, pose: 'point' }] },
    { act: () => { sfx('tap', true); setSt5(2); } },
    { say: [{ text: c.sayHead, pose: 'think' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cfg = { header: true, nav: st5 >= 1, main: true, sec: 0, footer: true };
  const lines = code(cfg, null, { main: true }).map((l) => Object.assign(l, { cls: st5 === 1 && l.k === 'menu' ? 'is-new' : '' }));
  const askText = solved || demo.done ? c.askDone : c.asks[st5];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z8-s5">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm" />
            {st5 >= 2 ? (
              <div className="z8-vs z8-a-in">
                <span className="z8-vs-i"><b translate="no">head</b>{pick(c.headIs)}</span>
                <span className="z8-vs-i is-on"><b translate="no">header</b>{pick(c.headerIs)}</span>
              </div>
            ) : null}
          </div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html"><SitePage cfg={cfg} insp hl={st5 === 1 ? 'nav' : st5 === 2 ? 'header' : null} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ КАРКАС (Code Builder) — три места в body сверху вниз: header, main, footer; лишний head.
// Честно: что поставлено, то и встаёт на странице в этом порядке.
// =============================================================================
const S6_ORDER = ['header', 'main', 'footer'];
const S6_TRAY = ['footer', 'head', 'main', 'header'];
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const s = C.site;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S6_ORDER.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const want = S6_ORDER[got.length];
    if (id !== want) {
      st.current.misses += 1;
      const m = id === 'head' ? c.why.head : c.why[want];
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 3) {
      put({ done: true });
      log({ screenId: 's6', type: 'build-skeleton', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const nextOk = S6_ORDER[got.length];
  const TXT = { header: '<header>…</header>', main: '<main>…</main>', footer: '<footer>…</footer>', head: '<head>…</head>' };
  const inner = { header: pick(s.title), main: pick(s.sec1h) + ' · ' + pick(s.sec2h), footer: pick(s.foot) };
  const lines = [openL('body', 0, 'bo', { cls: 'z8-ctx' })].concat([0, 1, 2].map((i) => (got[i]
    ? collL(got[i], [W_(inner[got[i]])], 1, 'b' + i, { cls: 'is-new' })
    : codeLine('b' + i, [<span key="d" data-place="code" className={'kz-dash kz-dash-sm z8-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />], { d: 1, cls: i === got.length ? 'is-hl' : '' }))),
    [closeL('body', 0, 'bc', { cls: 'z8-ctx' })]);
  const cfg = { header: got.indexOf('header') >= 0, nav: false, main: got.indexOf('main') >= 0, sec: 0, footer: got.indexOf('footer') >= 0 };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/3'} />
        <div className={'kz-scene z8-s5 z8-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html" short><SitePage cfg={cfg} insp /></Br></div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z8-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextOk ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, TXT[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{TXT[id]}</span><Led on={led} />
              </button>
            )))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// S7. НАЙДИ ПАРУ (Matching Pairs) — header / nav / main / footer ↔ схема сайта, где выделена своя часть.
// =============================================================================
const S7_TAGS = ['header', 'nav', 'main', 'footer'];
const S7_CARDS = ['main', 'footer', 'header', 'nav'];
const SiteWire = ({ part }) => (
  <span className="z8-wire" aria-hidden="true">
    <i className={'z8-w-top' + (part === 'header' ? ' is-on' : '')}><i className={'z8-w-nav' + (part === 'nav' ? ' is-on' : '')} /></i>
    <i className={'z8-w-main' + (part === 'main' ? ' is-on' : '')} />
    <i className={'z8-w-foot' + (part === 'footer' ? ' is-on' : '')} />
  </span>
);
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [paired, setPaired] = useState(solved ? S7_TAGS.slice() : []);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = paired.length === 4;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, paired.length * 10 + (sel ? 1 : 0));
  const lit = lad.lv >= 3;
  const nextT = S7_TAGS.find((t) => paired.indexOf(t) < 0);
  const pickCard = (card) => {
    if (!canTap || done || paired.indexOf(card) >= 0) return;
    if (!sel) { setMsg(c.pickFirst); return; }
    st.current.tries += 1;
    if (sel !== card) {
      st.current.misses += 1;
      sfx('soft', true); setShake(card); setTimeout(() => setShake(null), 520);
      const m = c.why[sel];
      setMsg(m); sayNow(m, 'think'); setSel(null);
      if (st.current.misses >= 2) lad.bump();
      return;
    }
    sfx('pop', true); setMsg(null);
    const nx = paired.concat(card);
    setPaired(nx); setSel(null);
    if (nx.length === 4) {
      put({ done: true });
      log({ screenId: 's7', type: 'match-parts', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/4'} />
        <div className="kz-scene z8-match">
          <div className="z8-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code z8-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{t}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z8-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z8-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <SiteWire part={k} />
                  <span className="z8-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z8-mcard-tag" translate="no">{k}</span> : null}
                  <Led on={led && !!sel && !ok} />
                </button>
              );
            })}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. section (показ) — содержимое main делится на два раздела со своими заголовками h2; main — один,
// section — сколько угодно.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.saySec, pose: 'explain' }] },
    { act: () => { sfx('pop', true); setN(2); } },
    { say: [{ text: c.sayTwo, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cfg = { header: true, nav: true, main: true, sec: n, footer: true };
  const lines = code(cfg, null, { header: true }).map((l) => Object.assign(l, { cls: (n === 1 && l.k === 'sec0') || (n === 2 && l.k === 'sec1') ? 'is-new' : '' }));
  const askText = solved || demo.done ? c.askDone : n >= 1 ? c.askSec : c.askMain;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z8-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html"><SitePage cfg={cfg} insp hl={n === 1 ? 'section1' : n === 2 ? 'section2' : 'main'} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ВПИШИ section (Fill in the Blanks) — у второго раздела нет имени открывающего тега: честно, рамки нет.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const s = C.site;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const isS = okNow || normT(ty.val) === 'section';
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = normT(ty.val);
    const issue = v === 'section' ? null : !v ? c.msgs.empty : /[<>/]/.test(v) ? c.msgs.brackets : v === 'main' ? c.msgs.main : KNOWN.indexOf(v) >= 0 ? c.msgs.other : c.msgs.typo;
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-section', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const cfg = { header: true, nav: true, main: true, sec: isS ? 2 : 1, footer: true };
  const sec2 = [T_('h2'), W_(pick(s.sec2h)), T_('h2', true), <span key="dots" className="kz-txt z8-dots">…</span>, T_('section', true)];
  const lines = [openL('main', 0, 'mno', { cls: 'z8-ctx' }), collL('section', [T_('h2'), W_(pick(s.sec1h)), T_('h2', true), <span key="dots" className="kz-txt z8-dots">…</span>], 1, 'sec0', { cls: 'z8-ctx' }),
    okNow ? collL('section', sec2.slice(0, 4), 1, 'sec1', { cls: 'is-new' }) : codeLine('sec1', [
      <span key="l" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span></span>,
      <span key="g" className={'kz-gap z8-slot z8-slot-tag' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={12} /></span>,
      <span key="r" className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>].concat(sec2), { d: 1, cls: 'is-hl' }),
    closeL('main', 0, 'mnc', { cls: 'z8-ctx' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.title)} url="index.html" short><SitePage cfg={cfg} insp hl={isS ? 'section2' : null} /></Br>
            <KzCode lines={lines} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ДО И ПОСЛЕ (Before / After) — в инспекторе появилась рамка: nav (вокруг меню), section (main разделился),
// footer (внизу). Страница сама при этом не меняется — это и видно в карточках.
// =============================================================================
const S10_ROUNDS = [{ want: 'nav' }, { want: 'section' }, { want: 'footer' }];
const S10_BTN = { nav: '<nav>', section: '<section>', footer: '<footer>' };
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (ans ? lastRef.current : null);
  const R = shownRd ? S10_ROUNDS[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  // Ступени подсказки — на каждый раунд свои; ответ в раунде один (после него виден верный).
  // Ответ — тег на кнопке: 3-я ступень говорит его словами, и верная кнопка загорается.
  const ch = useChoiceHints(!!round && !ans, doneN);
  const hints = R ? [c.hint1, c.hint2[R.want], joinL(c.miss[R.want], fillL(c.pick3, { t: R.want }))] : null;
  const glow = !!round && !ans && ch.lad.lv >= 3 ? R.want : null;
  const answer = (k) => {
    if (!canTap || !round || ans) return;
    const right = k === R.want;
    setAns(k);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.unshift({ i: round.i, extra: true });
    const line = right ? c.ok[k] : c.miss[R.want];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's10.r' + (ii + 1), type: 'before-after', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null, hints: ch.lad.asked.current });
      });
      put({ done: true }); setQueue([]);
      sayNow(joinL(line, c.done), 'smile');
      return;
    }
    sayNow(line, right ? 'smile' : 'rule');
    setPending(rest);
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  // Повторный раунд того же вида — та же пара, но рамки уже знакомы: ответ снова по виду рамки.
  const base = { header: true, nav: true, main: true, sec: 2, footer: true };
  const view = (after) => {
    if (!R) return null;
    const cfg = Object.assign({}, base, R.want === 'nav' ? { nav: after } : R.want === 'section' ? { sec: after ? 2 : 0 } : { footer: after });
    return <SitePage cfg={cfg} insp />;
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? (ch.next(hints) || c.askQ) : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : round && !ans ? ch.now(hints) : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z8-ba kz-a-drop">
                <div className="z8-card"><span className="z8-card-h">{pick(c.before)}</span><div className="z8-mini">{view(false)}</div></div>
                <span className="z8-ba-arrow" aria-hidden="true" />
                <div className="z8-card is-after"><span className="z8-card-h">{pick(c.after)}</span><div className="z8-mini">{view(true)}</div></div>
              </div>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick z8-pick3">
            {['nav', 'section', 'footer'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z8-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost') + (glow === k ? ' is-led' : '')}
                onClick={() => answer(k)}><span translate="no">{S10_BTN[k]}</span><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ЗАЧЕМ ЭТО ВСЁ (показ) — программа чтения с экрана видит части страницы списком и может сразу перейти
// к main; поисковик понимает, где главное. Части загораются по очереди за речью Коди.
// =============================================================================
const LANDS = ['header', 'nav', 'main', 'footer'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const s = C.site;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? LANDS.length : -1);
  const [jump, setJump] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 800;
  const run = () => { LANDS.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run }, { wait: STEP * LANDS.length + 200 }, { act: () => setRead(LANDS.length) },
    { say: [{ text: c.sayList, pose: 'point' }] },
    { act: () => { sfx('ok', true); setJump(true); } },
    { say: [{ text: c.sayJump, pose: 'smile' }, { text: c.sayWhy, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cur = jump ? 'main' : read >= 0 && read < LANDS.length ? LANDS[read] : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={read < 0 ? c.ask : jump ? c.askJump : c.askDone} />
        <div className="kz-scene z8-s5">
          <div className="kz-col">
            <div className="z8-reader" aria-label={pick(c.readerH)}>
              <span className="z8-reader-h"><i aria-hidden="true" />{pick(c.readerH)}</span>
              {LANDS.map((k, i) => (read >= i || solved ? (
                <span key={k} className={'z8-land z8-a-in' + (cur === k ? ' is-on' : '')} style={{ '--c': TAG_COLORS[k] }}>
                  <b translate="no">{k}</b><span>{pick(c.lands[k])}</span>
                </span>
              ) : null))}
            </div>
          </div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html"><SitePage cfg={FULL} insp hl={cur} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. СВОЙ ПОДВАЛ и S13. СВОЙ РАЗДЕЛ (Live Code Preview, по «Готово») — свой сайт: текст в footer, потом
// заголовок своего section.
// =============================================================================
const useMine8 = () => {
  const store = useStore();
  const pick = usePick();
  return { foot: store.get('myFoot') || pick(C.s12.sample), secH: store.get('mySec') || pick(C.s13.sample) };
};
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const s = C.site;
  const code = useSiteCode();
  const [rec] = useRec('s12');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myFoot', screenId: 's12', type: 'own-footer', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'cheer')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const own = { foot: ty.shown || ' ', secH: pick(C.s13.sample) };
  const lines = code(FULL, own, { header: true, main: true }).slice(0, -1).map((l) => Object.assign(l, { cls: 'z8-ctx' }));
  lines.push(codeLine('ft', [T_('footer'), <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={32} /></span>, T_('footer', true)], { cls: 'is-hl' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.myTitle)} url="mening.html" short><SitePage cfg={FULL} own={own} insp hl="footer" /></Br>
            <KzCode lines={lines} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const s = C.site;
  const mine = useMine8();
  const [rec] = useRec('s13');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'mySec', screenId: 's13', type: 'own-section', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'cheer')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const own = { foot: mine.foot, secH: ty.shown || ' ' };
  const dots = <span key="dots" className="kz-txt z8-dots">…</span>;
  const lines = [openL('main', 0, 'mno', { cls: 'z8-ctx' }),
    codeLine('sec0', [T_('section'), T_('h2'), <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={28} /></span>, T_('h2', true), dots, T_('section', true)], { d: 1, cls: 'is-hl' }),
    collL('section', [T_('h2'), W_(pick(s.sec2h)), T_('h2', true), <span key="d2" className="kz-txt z8-dots">…</span>], 1, 'sec1', { cls: 'z8-ctx' }),
    closeL('main', 0, 'mnc', { cls: 'z8-ctx' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.myTitle)} url="mening.html" short><SitePage cfg={FULL} own={own} insp hl="section1" /></Br>
            <KzCode lines={lines} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ШАПКА ПРОПАЛА (Debug & Fix) — Коди обернул верх своего сайта в <head>: честно, страница та же, но в
// инспекторе нет рамки header. Перетащить (или нажать) верный тег: header, а не head и не h1.
// =============================================================================
const S14_OPTS = ['head', 'header', 'h1'];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const s = C.site;
  const code = useSiteCode();
  const mine = useMine8();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  // Ступени подсказки (лампочка; со второй ошибки — сами); на 3-й верный кусок загорается.
  const ch = useChoiceHints(!okNow, 0);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === 'header') {
      sfx('win', true); setOkNow(true); setMsg(null); ch.clear(); put({ done: true });
      log({ screenId: 's14', type: 'fix-header', correct: true, firstTry: off.length === 0, attempts: off.length + 1, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(c.ok, 'cheer');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.why[o], c.hints), 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const cfg = Object.assign({}, FULL, { top: okNow ? 'header' : 'head' });
  const all = code(cfg, mine, { main: true });
  const lines = okNow ? all.map((l) => Object.assign(l, { cls: l.k === 'hdo' || l.k === 'hdc' ? 'is-new' : 'z8-ctx' }))
    : all.map((l) => (l.k === 'hdo' ? codeLine('hdo', [<span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z8-miss' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />,
      <span key="w" className="z8-wrong" translate="no">{'<head>'}</span>], { cls: 'is-hl' }) : Object.assign(l, { cls: l.k === 'hdc' ? 'is-hl' : 'z8-ctx' })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={okNow ? c.ok : (ch.next(c.hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : ch.now(c.hints)} err={ch.err} />
        <div className="kz-scene z8-s5">
          <div className="kz-col"><Br title={pick(s.myTitle)} url="mening.html" cls={okNow ? '' : 'z8-broken-br'}><SitePage cfg={cfg} own={mine} insp hl={okNow ? 'header' : null} /></Br></div>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {S14_OPTS.map((o) => (
              <button key={o} type="button" data-o={o} disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, '<' + o + '>'); }}
                className={'kz-scrap kz-scrap-code' + (off.indexOf(o) >= 0 ? ' is-used' : '') + ((off.length >= 2 || ch.lad.lv >= 3) && o === 'header' ? ' is-led' : '')}>
                <span translate="no">{'<' + o + '>'}</span><Led on={led && off.indexOf(o) < 0} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// Q1. НАЙДИ ОШИБКУ (Error Detective) — сайт без образца, инспектор включён. Раунд 1: nav обёрнут вокруг заголовка,
// а не меню. Раунд 2: опечатка <foter> — рамки footer нет.
// =============================================================================
const Q1_ROUNDS = [{ kind: 'nav', bad: 'h1' }, { kind: 'typo', bad: 'ft' }];
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const s = C.site;
  const code = useSiteCode();
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? Q1_ROUNDS.length - 1 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === Q1_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!found);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const R = Q1_ROUNDS[ri];
  const cfg = Object.assign({}, FULL, !found && R.kind === 'nav' ? { nav: 'title' } : {}, !found && R.kind === 'typo' ? { footer: 'typo' } : {});
  const lines = code(cfg, null, { main: true });
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (lines[j].k !== R.bad) {
      st.current.misses += 1;
      sfx('soft', true); setOff(off.concat(j)); setMsg(c.fine); sayNow(c.fine, 'think');
      if (st.current.misses >= 2) lad.bump();
      return;
    }
    sfx('win', true); setFound(true); setMsg(null);
    if (ri === Q1_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 'q1', type: 'find-error', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.found[R.kind], c.ok), 'cheer');
    } else { sayNow(c.found[R.kind], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); setMsg(null); lad.reset(); sayNow(c.say2, 'curious'); }, reduceMotion() ? 300 : 1200);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene z8-s5 z8-q1" key={'q' + ri}>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html" cls={found ? '' : 'z8-broken-br'}><SitePage cfg={cfg} insp /></Br></div>
          <div className="kz-col">
            <KzCode lines={lines.map((l, j) => Object.assign(l, {
              cls: 'z8-hline' + (found && l.k === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && ((led && off.length === 0 && j === 0) || (lit && l.k === R.bad))
            }))} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q2. ВЕРНО ИЛИ НЕТ (True / False).
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
  const s = C.site;
  const [rec, put] = useRec('q2');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.items.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState(null);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.items[0].t, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — как читать фразу, 2 — правило урока, 3 — причина и ответ.
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, it.right ? c.yes : c.no);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) {
      st.current.misses += 1;
      sfx('soft', true); setOff(v); sayNow(ch.miss(it.why, hints), 'think');
      return;
    }
    sfx('ok', true); setOk(true); setMsg(null); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'q2', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); setMsg(null); sayNow(c.items[ii + 1].t, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = (v) => (
    <button key={String(v)} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)}
      className={'kz-btn z8-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = {
    header: [collL('header', [T_('h1'), W_(pick(s.title)), T_('h1', true)], 0, 'c')],
    head: [openL('head', 0, 'h'), collL('title', [W_(pick(s.title))], 1, 't'), closeL('head', 0, 'hc')],
    main: [openL('main', 0, 'm'), collL('section', [<span key="d" className="kz-txt z8-dots">…</span>], 1, 's1'), collL('section', [<span key="d" className="kz-txt z8-dots">…</span>], 1, 's2'), closeL('main', 0, 'mc')]
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z8-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z8-card z8-tf-card kz-a-drop">
              <span className="z8-card-h">{pick(c.card)}</span>
              <p className="z8-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z8-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: Коди обернул шапку в header и ждал цветную шапку — страница не изменилась; свой сайт
// ученика с инспектором; роли header, nav, main, section, footer загораются за речью Коди.
// =============================================================================
const S15_ROLES = ['header', 'nav', 'main', 'section', 'footer'];
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const s = C.site;
  const mine = useMine8();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z8-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(s.title) : pick(s.myTitle)} url={riddle ? 'index.html' : 'mening.html'}>
              {riddle ? <SitePage cfg={FULL} /> : <SitePage cfg={FULL} own={mine} insp hl={curK === 'section' ? 'section1' : curK} />}
            </Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {S15_ROLES.map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
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
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-4B', Comp: S13 },
  { id: 's14', code: 'CHECK-4', Comp: S14 },
  { id: 'q1', code: 'CHECK-5', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; свой сайт ученика (myFoot, mySec) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — каркас своего сайта: подвал и раздел со своими словами.
function lesson8Artifact(store) {
  const foot = store.get('myFoot'), sec = store.get('mySec');
  if (!foot && !sec) return null;
  return { type: 'html-page', footer: foot || '', section: sec || '',
    html: ['<header>', '  <h1>Mening saytim</h1>', '  <nav>…</nav>', '</header>', '<main>', '  <section>', '    <h2>' + escHtml(sec || '') + '</h2>', '  </section>', '</main>',
      '<footer>' + escHtml(foot || '') + '</footer>'].join('\n') };
}

export default function HtmlSaytTuzilishi({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson8Artifact(store) })
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
