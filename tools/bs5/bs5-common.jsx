// ОБЩИЕ КУСКИ ЭКРАНОВ — скопированы из урока 3 (tools/bs3/bs3-screens.jsx): раунды, плашка «не помещается», курсор по меню,
// показ «слово с сайта» WordShow, задание с полем FillRounds, строки с полем. Проверка слова — wordIssue урока 4 (bs4-head.jsx).

function useRounds(n, solved) {
  const [ii, setIi] = useState(solved ? n - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [next, setNext] = useState(false);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, misses: 0 });
  const rm = useRef(0);
  const advance = () => { setNext(false); setIi((x) => x + 1); setOk(false); rm.current = 0; const a = lad.asked.current; lad.reset(); lad.asked.current = a; };
  return { ii, ok, setOk, next, setNext, lad, st, rm, advance, last: ii === n - 1, done: ok && ii === n - 1 };
}
function useRoundNext(R, spoken) {
  useEffect(() => {
    if (!R.next || !spoken) return undefined;
    const t = setTimeout(() => R.advance(), reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [R.next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
}
// Плашка «не поместилось» над экраном телефона (onWide от BsFrame).
function WideBadge({ pick, wide }) {
  return <span className={'b3-badge' + (wide ? ' is-wide' : ' is-fit')}>{pick(wide ? UI.wide : UI.fit)}</span>;
}
// Курсор по меню сайта: ☰ на телефоне → раздел → пункт. set: { setMenuView, setOpen, setPeek, setPage }.
function navSteps(M, burger, set, grp, item, openNow, after) {
  return [
    { act: () => { if (burger()) M.go('[data-x="burger"]', 0.5, 0.5, { hand: true }); }, wait: M.slow },
    { act: () => { if (burger()) { M.click(); set.setMenuView(true); } set.setPeek(grp); }, wait: 450 }
  ].concat(openNow ? [] : [
    { act: () => M.go('.bd-grp-h[data-g="' + grp + '"]', 0.35, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); set.setOpen(grp); }, wait: 400 }
  ], [
    { act: () => M.go('.bd-item[data-item="' + item + '"]', 0.3, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); set.setPage(item); set.setMenuView(false); if (after) after(); }, wait: 700 },
    { act: () => M.hide() }
  ]);
}
function useDocsNav(page0, open0) {
  const [page, setPage] = useState(page0);
  const [open, setOpen] = useState(open0);
  const [menuView, setMenuView] = useState(false);
  const [peek, setPeek] = useState(null);
  return { page, open, menuView, peek, set: { setPage, setOpen, setMenuView, setPeek } };
}


function WordShow({ p, id, c, from, fromOpen, grp, to, block, ln, word, code, page, vw }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? to : from, solved ? grp : fromOpen);
  const [scroll, setScroll] = useState(solved ? block : null);
  const [wsel, setWsel] = useState(solved ? { i: ln, w: word } : null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 — меню; 2 — страница; 3 — слово; 4 — в class
  const [view, setView] = useState(solved);
  const [wide, setWide] = useState(false);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const LN = '.bd-code[data-code="' + block + '"] [data-ln="' + ln + '"]';
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, grp, to, fromOpen === grp, () => { setN(2); setScroll('sec:' + block); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll(block), wait: 500 },
      { act: () => M.go(LN, 0.32, 0.55), wait: M.slow },
      { act: () => { M.click(); setTimeout(() => M.click(), 160); setWsel({ i: ln, w: word }); setN(3); }, wait: 700 },
      { act: () => { M.card({ t: 'Ctrl + C' }); sfx('pop', true); }, wait: 900 },
      { act: () => { M.card(null); M.hide(); sfx('ok', true); setN(4); setView(true); }, wait: 800 },
      { say: [{ text: c.sayApply, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askWord, c.askApply][n];
  const help = useShowHelp(c.help);
  const on = n >= 4;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} scrollTo={scroll} scrollKey={String(view) + n} lines={{ [block]: { word: wsel } }} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={code(on, n)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={page(on)} vw={vw} onWide={setWide} title={vwTitle(pick, vw)}>{vw === PHONE ? <WideBadge pick={pick} wide={wide} /> : null}</SitePage></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

function FillRounds({ p, id, c, rounds, docs, type }) {
  const pick = usePick();
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const R = useRounds(rounds.length, solved);
  const RR = rounds[R.ii];
  if (RR.docs !== undefined) docs = RR.docs;   // справка своего раунда (null — без сайта; урок 5, t5, 23.11.2026)
  const want0 = [].concat(RR.want)[0];
  const [val, setVal] = useState(solved ? want0 : '');
  const [msg, setMsg] = useState(null);
  const [wide, setWide] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setVal(''); setMsg(null); }, [R.ii]);
  const led = useIdleLed(canTap && !R.ok && !val, R.ii);
  const check = () => {
    if (!canTap || R.ok) return;
    R.st.current.tries += 1;
    const is = wordIssue(val, RR.kind, RR.want);
    if (is) {
      R.st.current.misses += 1; R.rm.current += 1; sfx('soft', true);
      const m = (RR.no && RR.no[normCls(val)]) || issueText(is);   // своя причина для варианта (rounded-pill на квадрате)
      const t = R.rm.current >= 2 && R.lad.lv > 0 ? joinL(m, hintAt(R.lad.lv, RR.hints)) : m;
      setMsg(t); sayNow(t, 'think'); if (R.rm.current >= 2) R.lad.bump();
      return;
    }
    sfx('ok', true); R.setOk(true); setMsg(null); setVal(normCls(val));
    const line = joinL(C.fill.right, RR.why);
    if (R.last) {
      put({ done: true });
      log({ screenId: id, type: type, correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: R.lad.asked.current, depth: R.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const v = normCls(val);
  const field = R.ok ? <span key="f" className="b1-st b2-done">{v || want0}</span>
    : <span key="f" className={'kz-gap b1-slotin b2-field' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { setVal(x); setMsg(null); }} onEnter={check} placeholder={RR.ph || L3('…', '…', '…')} label={RR.ask} max={28} /></span>;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, R.lad.lv + 1), RR.hints) || RR.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={R.done ? c.done : RR.ask} hint={R.ok ? null : (msg || hintAt(R.lad.lv, RR.hints))} err={!!msg} n={rounds.length > 1 ? (R.ii + 1) + '/' + rounds.length : null} />
        <div className={docs ? docsPhoneCls({ ref: true, done: R.done }) : 'kz-scene b1-pair'} key={'r' + R.ii}>
          {docs && !R.done ? <div className="kz-col b1-tri-docs"><DocsBr page={docs.page}><BsDocs page={docs.page} only={docs.only} copyOff /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code">
            {RR.goal ? <Goal pick={pick} html={RR.goal} zoom={RR.gz} /> : null}
            <KzCode lines={RR.line(field)} cls="kz-code-sm b2-small" />
            {RR.extra || null}
          </div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={RR.body(R.ok ? (v || want0) : v)} vw={RR.vw} onWide={setWide} title={vwTitle(pick, RR.vw)}>{RR.vw && RR.badge ? <WideBadge pick={pick} wide={wide} /> : null}</SitePage></div>
        </div>
        {!R.done ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap || R.ok || !v} onClick={check}>{pick(UI.check)}<Led on={canTap && !R.ok && !!v && led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}
const lineCls = (k, d, o, extra) => ({ k, d, cls: 'b1-line is-hl' + (extra ? ' ' + extra : ''), parts: clsParts(o) });
// Строка с полем в class и атрибутами после него: <img src=… class="before [поле]" alt="…">, <div class="[поле]" role="status">.
function clsLineA(o, tail) {
  const parts = clsParts(o);
  parts.pop();   // «>»
  (tail || []).forEach((a, j) => parts.push(<React.Fragment key={'ts' + j}>{sp()}</React.Fragment>, <span key={'ta' + j} className="b1-at">{a[0]}</span>, pn('te' + j, '='), <span key={'tv' + j} className="b1-st">{'"' + a[1] + '"'}</span>));
  parts.push(pn('tg', '>'));
  return parts;
}
