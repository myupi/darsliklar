// =============================================================================
// ЭКРАНЫ УРОКА 6 «Контейнер и сетка» (20.11.2026). Помощники — bs6-head.jsx, общие куски — bs6-common.jsx.
// Сценарий — docs/scenarij-bootstrap-06-kontejner-i-setka.md.
// =============================================================================
const COLS3 = (c) => [c, c, c];

// Общий показ: шаги — состояния страницы { o, vw, k (ключ строки для подсветки), rule } и реплики.
function GridShow({ p, id, c, states, says }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const last = states.length - 1;
  const [n, setN] = useState(solved ? last : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const steps = [];
  states.forEach((S, j) => { if (!j) return; steps.push({ act: () => { sfx(j === last ? 'ok' : 'pop', true); setN(j); }, wait: S.say ? 0 : 1500 }); if (S.say) steps.push({ say: [{ text: c[S.say], pose: S.pose || 'point' }] }); });
  steps.push({ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const S = states[n];
  const askText = solved || demo.done ? c.askDone : (S.ask ? fillL(c[S.ask], { w: String(S.vw) }) : c.askStart);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair b6-pair">
          <div className="kz-col">
            <KzCode lines={S.lines ? S.lines(pick) : gridLines(pick, S.o, S.hl)} cls="kz-code-sm b2-small" />
            {S.rules ? <CssCard pick={pick} rules={S.rules.map(colRule).filter(Boolean)} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={S.body ? S.body(pick) : gridH(pick, S.o)} vw={S.vw} title={vwTitle(pick, S.vw)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S1. КРЮЧОК — ноутбук: три блока растянуты и друг под другом. «Bootstrap bilan» — container, row, три col. Загадка.
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.done, 'smile');
  };
  const o = on ? { cont: 'container', row: 'row', cols: COLS3('col') } : { cont: null, row: null, cols: COLS3(null) };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair b6-pair">
          <div className="kz-col"><KzCode lines={gridLines(pick, o, on ? { cont: 'is-new is-read', row: 'is-new is-read', cols: COLS3('is-new is-read') } : {})} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={gridH(pick, o)} vw={LAPTOP} title={vwTitle(pick, LAPTOP)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. CONTAINER (показ): без контейнера на 1024 — от края до края; container: 1024 → 768 → 360.
const S2_STATES = [
  { o: { cont: null, row: null, cols: COLS3(null) }, vw: LAPTOP },
  { o: { cont: 'container', row: null, cols: COLS3(null) }, vw: LAPTOP, hl: { cont: 'is-new is-read' }, rules: ['container'], say: 'say1280', ask: 'askW' },
  { o: { cont: 'container', row: null, cols: COLS3(null) }, vw: TABLET, rules: ['container'], say: 'say768', ask: 'askW' },
  { o: { cont: 'container', row: null, cols: COLS3(null) }, vw: PHONE, rules: ['container'], say: 'say360', ask: 'askW' }
];
const S2 = ({ p }) => <GridShow p={p} id="s2" c={C.s2} states={S2_STATES} />;

// S3. ROW и COL (показ): container + row → три col — равные колонки.
const S3_STATES = [
  { o: { cont: 'container', row: null, cols: COLS3(null) }, vw: LAPTOP },
  { o: { cont: 'container', row: 'row', cols: COLS3(null) }, vw: LAPTOP, hl: { row: 'is-new is-read' }, rules: ['row'], say: 'sayRow', ask: 'askRow' },
  { o: { cont: 'container', row: 'row', cols: COLS3('col') }, vw: LAPTOP, hl: { cols: COLS3('is-new is-read') }, rules: ['row', 'col'], say: 'sayCol', ask: 'askCol', pose: 'wonder' }
];
const S3 = ({ p }) => <GridShow p={p} id="s3" c={C.s3} states={S3_STATES} />;

// X1. ОПЫТ — сколько колонок (1–4): col делит ряд поровну. Готово — три разных числа.
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [k, setK] = useState(3);
  const [seen, setSeen] = useState(solved ? [1, 2, 3, 4] : [3]);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, seen.length);
  const tap = (v) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true); setK(v);
    const s2 = seen.indexOf(v) >= 0 ? seen : seen.concat(v);
    setSeen(s2);
    if (!ok && s2.length >= 3) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(fillL(c.each, { w: String(Math.round(1000 / v) / 10) }), c.ok), 'cheer'); say(c.done, 'smile');
      return;
    }
    if (!ok) sayNow(fillL(c.each, { w: String(Math.round(1000 / v) / 10) }), 'point');
    if (st.current.tries >= 6 && !ok) lad.bump();
  };
  const o = { cont: 'container', row: 'row', cols: Array.from({ length: k }, () => 'col') };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} />
        <div className="kz-scene b1-pair b6-pair b6-x1">
          <div className="kz-col"><KzCode lines={gridLines(pick, o)} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={gridH(pick, o)} vw={LAPTOP} title={vwTitle(pick, LAPTOP)} /></div>
        </div>
        <div className="b2-pult"><div className="b2-pult-row">
          <span className="b2-pult-h">{pick(c.colsH)} <i>{Math.min(3, seen.length)}/3</i></span>
          {[1, 2, 3, 4].map((v) => (
            <button key={v} type="button" className={'b2-chip is-shape b6-num' + (k === v ? ' is-on' : '') + (seen.indexOf(v) >= 0 ? ' is-seen' : '')} onClick={() => tap(v)} disabled={!canTap} data-n={v}>
              <span>{v}</span><Led on={led && !ok && seen.indexOf(v) < 0 && v === [1, 2, 4].find((x) => seen.indexOf(x) < 0)} />
            </button>
          ))}
        </div></div>
      </Sheet>
    </StageB>
  );
}

// G1. ПРИМЕР С САЙТА (показ «как на видео»): меню → Layout → Grid → копирование Example → вставка; «Column» → свой текст.
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Grid' : 'Card', solved ? 'layout' : 'comp');
  const [scroll, setScroll] = useState(solved ? 'gexample' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 — меню; 2 — страница; 3 — вставлено; 4 — свой текст
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'layout', 'Grid', false, () => { setN(2); setScroll('sec:gexample'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('gexample'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="gexample"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('gexample'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayPaste, pose: 'wonder' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 900 },
      { say: [{ text: c.sayText, pose: 'point' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askText][n];
  const help = useShowHelp(c.help);
  const label = (j) => (n >= 4 ? pick(C.site[BLOCK_KEYS[j]]) : 'Column');
  const lines = n >= 3 ? [hl('a', 1, '<div class="container text-center">', { cls: n === 3 ? 'is-new' : '' }), hl('b', 2, '<div class="row">', { cls: n === 3 ? 'is-new' : '' })]
    .concat([0, 1, 2].map((j) => hl('c' + j + n, 3, '<div class="col">' + label(j) + '</div>', { cls: n === 4 ? 'is-new is-read' : n === 3 ? 'is-new' : '' })), [hl('d', 2, '</div>'), hl('e', 1, '</div>')])
    : [quietSlot('slot', 1, pick, !!copied)];
  const body = n >= 3 ? '<div class="container text-center"><div class="row">' + [0, 1, 2].map((j) => '<div class="col"><div class="card card-body">' + escH(label(j)) + '</div></div>').join('') + '</div></div>' : '';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={[hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(lines, [hl('bc', 0, '</body>', { cls: 'b1-edge' })])} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} vw={LAPTOP} title={vwTitle(pick, LAPTOP)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// Строки с полем: в class контейнера, ряда или колонки j.
const fieldLines = (pick, o, where) => (f) => {
  const L = gridLines(pick, o);
  const idx = where === 'cont' ? 0 : where === 'row' ? (o.cont === false ? 0 : 1) : (o.cont === false ? 0 : 1) + (o.row === false ? 0 : 1) + where;
  const old = L[idx];
  const tail = where === 'cont' || where === 'row' ? null : '…' + pick(C.site[BLOCK_KEYS[where]]) + '…';
  L[idx] = { k: old.k + 'f', d: old.d, cls: 'b1-line is-hl', parts: clsParts({ tag: 'div', attrs: [], before: null, field: f, text: tail, close: tail != null }) };
  return L;
};
// Образец «Kerak» — та же страница в маленьком окне (ширина vw).
const goalGrid = (pick, o) => gridH(pick, o);

// T1 — по образцу: container, row, col.
function T1({ p }) {
  const pick = usePick();
  const c = C.t1;
  const full = { cont: 'container', row: 'row', cols: COLS3('col') };
  const mk = (kind, want, where, o, ask, hints, why) => ({ kind, want, ask, hints, why, vw: LAPTOP, gz: 0.3, ph: L3('…', '…', '…'),
    line: fieldLines(pick, o, where), goal: goalGrid(pick, full),
    body: (v) => gridH(pick, Object.assign({}, o, where === 'cont' ? { cont: v } : where === 'row' ? { row: v } : { cols: o.cols.map((x, j) => (j === where ? v : x)) })) });
  const rounds = [
    mk('cont', 'container', 'cont', { cont: null, row: 'row', cols: COLS3('col') }, c.ask1, c.hints1, c.why1),
    mk('row', 'row', 'row', { cont: 'container', row: null, cols: COLS3('col') }, c.ask2, c.hints2, c.why2),
    mk('col', 'col', 2, { cont: 'container', row: 'row', cols: ['col', 'col', null] }, c.ask3, c.hints3, c.why3)
  ];
  return <FillRounds p={p} id="t1" c={c} rounds={rounds} type="grid-parts" />;
}

// S7. 12 ЧАСТЕЙ (показ): col-6 в середине → col-8 + col-4.
const S7_STATES = [
  { o: { cont: 'container', row: 'row', cols: COLS3('col') }, vw: LAPTOP },
  { o: { cont: 'container', row: 'row', cols: ['col', 'col-6', 'col'] }, vw: LAPTOP, hl: { cols: [null, 'is-new is-read', null] }, rules: ['col-6'], say: 'say6', ask: 'ask6' },
  { o: { cont: 'container', row: 'row', cols: ['col-8', 'col-4'] }, vw: LAPTOP, hl: { cols: ['is-new is-read', 'is-new is-read'] }, rules: ['col-8', 'col-4'], say: 'say84', ask: 'ask84', pose: 'wonder' }
];
const S7 = ({ p }) => <GridShow p={p} id="s7" c={C.s7} states={S7_STATES} />;

// T2 — ширины по образцу: col-6 в середине; col-8 у первой из двух.
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const mk = (want, where, o, goalO, ask, hints, why) => ({ kind: 'col', want, ask, hints, why, vw: LAPTOP, gz: 0.3, ph: L3('col-…', 'col-…', 'col-…'),
    line: fieldLines(pick, o, where), goal: goalGrid(pick, goalO), body: (v) => gridH(pick, Object.assign({}, o, { cols: o.cols.map((x, j) => (j === where ? v : x)) })) });
  const rounds = [
    mk('col-6', 1, { cont: 'container', row: 'row', cols: ['col', null, 'col'] }, { cont: 'container', row: 'row', cols: ['col', 'col-6', 'col'] }, c.ask1, c.hints1, c.why1),
    mk('col-8', 0, { cont: 'container', row: 'row', cols: [null, 'col-4'] }, { cont: 'container', row: 'row', cols: ['col-8', 'col-4'] }, c.ask2, c.hints2, c.why2)
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} type="col-width" />;
}

// S9. ТЕЛЕФОН (показ): col на 360 — тесно → md:col-4: 360 столбиком, 768 и 1024 в ряд.
const MD3 = COLS3('md:col-4');
const S9_STATES = [
  { o: { cont: 'container', row: 'row', cols: COLS3('col') }, vw: PHONE, ask: 'askTight' },
  { o: { cont: 'container', row: 'row', cols: MD3 }, vw: PHONE, hl: { cols: COLS3('is-new is-read') }, rules: ['md:col-4'], say: 'sayMd', ask: 'askW' },
  { o: { cont: 'container', row: 'row', cols: MD3 }, vw: TABLET, rules: ['md:col-4'], say: 'say768', ask: 'askW' },
  { o: { cont: 'container', row: 'row', cols: MD3 }, vw: LAPTOP, rules: ['md:col-4'], say: 'sayOld', ask: 'askW', pose: 'think' }
];
const S9 = ({ p }) => <GridShow p={p} id="s9" c={C.s9} states={S9_STATES} />;

// G2. BREAKPOINTS (показ «как на видео»): меню → Layout → Breakpoints → таблица, строка md загорается → в нашем коде
// col-4 → md:col-4; экран 360 — столбиком.
function G2({ p }) {
  const pick = usePick();
  const c = C.g2;
  const [rec, put] = useRec('g2');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Breakpoints' : 'Grid', 'layout');
  const [scroll, setScroll] = useState(solved ? 'sec:bptable' : null);
  const [mark, setMark] = useState(solved ? { bptable: [2] } : null);
  const [word, setWord] = useState(solved ? { w: 'md' } : null);
  const [n, setN] = useState(solved ? 3 : 0);
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'layout', 'Breakpoints', true, () => { setN(2); setScroll('sec:bptable'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => { setMark({ bptable: [2] }); M.go('.b6-bp tr[data-ln="2"] code', 0.5, 0.55); }, wait: M.slow },
      { act: () => { M.click(); setTimeout(() => M.click(), 160); setWord({ w: 'md' }); }, wait: 700 },
      { say: [{ text: c.sayMd, pose: 'point' }] },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayApply, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askApply][n];
  const help = useShowHelp(c.help);
  const cols = n >= 3 ? MD3 : COLS3('col-4');
  const o = { cont: 'container', row: 'row', cols };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} mark={mark} word={word} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={gridLines(pick, o, n >= 3 ? { cols: COLS3('is-new is-read') } : {})} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={gridH(pick, o)} vw={PHONE} title={vwTitle(pick, PHONE)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T3 — по образцу: на телефоне столбиком (md:col-4), на планшете тоже столбиком (lg:col-4).
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const mk = (want, vw, others, ask, hints, why) => ({ kind: 'col', want, ask, hints, why, vw, gz: 0.4, ph: L3('…', '…', '…'),
    line: fieldLines(pick, { cont: 'container', row: 'row', cols: [others, others, null] }, 2),   // образца нет: два соседних блока уже показывают, как надо

    body: (v) => gridH(pick, { cont: 'container', row: 'row', cols: [others, others, v] }) });
  const rounds = [mk('md:col-4', PHONE, 'md:col-4', c.ask1, c.hints1, c.why1), mk('lg:col-4', TABLET, 'lg:col-4', c.ask2, c.hints2, c.why2)];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} docs={{ page: 'Breakpoints', only: 'bptable' }} type="responsive-col" />;
}

// S12. ВСЁ ВМЕСТЕ (показ): шапка (урок 4) + контейнер + ряд карточек (урок 5) с md:col-4; ширина 360 → 1024.
const headerH = (pick) => '<div class="d-flex justify-content-between align-items-center"><img src="logo.png" alt="Logo"><h4>' + escH(pick(C.site.h1)) + '</h4><a href="#" class="btn-solid theme-success">' + escH(pick(C.site.join)) + '</a></div>';
const fullPage = (pick) => '<div class="container">' + headerH(pick) + '<div class="row">' + [0, 1, 2].map((j) => '<div class="md:col-4"><section class="card"><img src="robot' + (j + 1) + '.jpg" class="card-img-top" alt="Robot"><div class="card-body"><h4 class="card-title">' + escH(pick(C.site[BLOCK_KEYS[j]])) + '</h4></div></section></div>').join('') + '</div></div>';
const fullLines = (pick) => [hl('a', 0, '<div class="container">', { cls: 'is-read' }), hl('h', 1, '<div class="d-flex justify-content-between …">…</div>', { cls: 'b2-cut' }), hl('r', 1, '<div class="row">', { cls: 'is-read' })]
  .concat([0, 1, 2].map((j) => hl('k' + j, 2, '<div class="md:col-4"><section class="card">…</section></div>', { cls: 'b2-cut' })), [hl('rc', 1, '</div>'), hl('ac', 0, '</div>')]);
const S12_STATES = [
  { lines: fullLines, body: fullPage, vw: PHONE, ask: 'askW' },
  { lines: fullLines, body: fullPage, vw: TABLET, say: 'sayTablet', ask: 'askW' },
  { lines: fullLines, body: fullPage, vw: LAPTOP, say: 'sayLaptop', ask: 'askW', pose: 'wonder' }
];
const S12 = ({ p }) => <GridShow p={p} id="s12" c={C.s12} states={S12_STATES} />;

// T4. СБОРКА ПО ПОРЯДКУ: container → row → колонка → блок → закрыть колонку → закрыть ряд → закрыть контейнер.
const T4_ORDER = ['cont', 'row', 'col', 'card', 'colc', 'rowc', 'contc'];
const T4_SHUFFLE = ['col', 'rowc', 'cont', 'card', 'contc', 'row', 'colc'];
function T4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t4;
  const [rec, put] = useRec('t4');
  const solved = !!(rec && rec.done);
  const [done, setDone] = useState(solved ? T4_ORDER : []);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(done.length < T4_ORDER.length);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const fin = done.length === T4_ORDER.length;
  const canGo = useAdvanceGate(solved || fin, spoken);
  const led = useIdleLed(canTap && !fin, done.length);
  const src = { cont: '<div class="container">', row: '<div class="row">', col: '<div class="md:col-6">', card: '<div class="card card-body">' + pick(C.site.b1) + '</div>', colc: '</div>', rowc: '</div>', contc: '</div>' };
  const depth = { cont: 0, row: 1, col: 2, card: 3, colc: 2, rowc: 1, contc: 0 };
  const label = { cont: 'container', row: 'row', col: 'md:col-6', card: 'card', colc: '</div> · col', rowc: '</div> · row', contc: '</div> · container' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T4_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = c.msgs[want]; const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === T4_ORDER.length - 1 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T4_ORDER.length) {
      put({ done: true });
      log({ screenId: 't4', type: 'order-grid', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  const lines = done.map((k, j) => hl('d' + k, depth[k], src[k], { cls: j === done.length - 1 ? 'is-new' : '' })).concat(fin ? [] : [quietSlot('slot', done.length ? depth[T4_ORDER[done.length]] : 0, pick, true)]);
  const html = done.map((k) => src[k]).join('');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/' + T4_ORDER.length} />
        <div className="kz-scene b1-pair b6-pair b6-t4">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={html} vw={TABLET} title={vwTitle(pick, TABLET)} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T4_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span><Led on={(lad.lv >= 3 && k === T4_ORDER[done.length]) || (led && done.length === 0 && k === 'cont')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// Q1. КАРТИНКА → КЛАССЫ (4 раунда). Варианты — классы колонок (или контейнера); окна — честный результат.
const Q1_ROUNDS = [
  { opts: ['col-3 · col-3 · col-3', 'row · row · row', 'col · col · col', 'col-6 · col-6 · col-6'], a: 2, vw: LAPTOP, make: (x) => ({ cont: 'container', row: 'row', cols: x.split(' · ') }) },
  { opts: ['col-6 · col · col', 'col · col-6 · col', 'col · col · col', 'col · col-8 · col-8'], a: 1, vw: LAPTOP, make: (x) => ({ cont: 'container', row: 'row', cols: x.split(' · ') }) },
  { opts: ['lg:col-4 ×3', 'col-md-4 ×3', 'md-col-4 ×3', 'md:col-4 ×3'], a: 3, vw: TABLET, make: (x) => ({ cont: 'container', row: 'row', cols: COLS3(x.replace(' ×3', '')) }) },
  { opts: ['container', 'container-fluid', 'contain', 'row'], a: 0, vw: LAPTOP, make: (x) => ({ cont: x, row: 'row', cols: COLS3('col') }) }
];
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const R = useRounds(Q1_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [shown, setShown] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => { setOff([]); setShown(null); }, [R.ii]);
  const RR = Q1_ROUNDS[R.ii];
  const right = RR.opts[RR.a];
  const ch = useChoiceHints(!R.ok, R.ii);
  const why = c.why[R.ii];
  const hints = choiceHints(c.hint1, c.hint2, why, right);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (j) => {
    const o = RR.opts[j];
    if (!canTap || R.ok || off.indexOf(o) >= 0) return;
    R.st.current.tries += 1; setShown(o);
    if (j !== RR.a) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.no[o], hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 'q1', type: 'picture-to-grid', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const res = R.ok ? right : shown;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1 b3-q1" key={'r' + R.ii}>
          <div className="kz-col"><Br title={pick(UI.need) + ' · ' + vwTitle(pick, RR.vw)} short cls="b2-q1page b3-goalwin"><BsFrame body={gridH(pick, RR.make(right))} bs dep={'g' + R.ii} vw={RR.vw} /></Br></div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={gridH(pick, RR.make(res))} bs dep={res} vw={RR.vw} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
            </Br>
          </div>
        </div>
        <div className="kz-pick b2-codes">
          {RR.opts.map((o, j) => (
            <button key={o} type="button" disabled={!canTap || R.ok || off.indexOf(o) >= 0} onClick={() => choose(j)} data-v={o}
              className={'kz-btn b2-code-opt ' + (R.ok && j === RR.a ? 'is-ok' : off.indexOf(o) >= 0 ? 'is-off' : 'is-ghost')} translate="no">
              {o}<Led on={(led && !R.ok && off.length === 0 && j === 0) || (ch.lad.lv >= 3 && j === RR.a && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// T6. ПОЧЕМУ НЕ ТАК: нет row (колонки столбиком); col-md-4 (версия 5); col-8 + col-8 (больше 12 — перенос).
const T6_ROUNDS = [
  { k: 'noRow', o: { cont: 'container', row: false, cols: COLS3('col') }, vw: LAPTOP },
  { k: 'old', o: { cont: 'container', row: 'row', cols: COLS3('col-md-4') }, vw: LAPTOP },
  { k: 'over', o: { cont: 'container', row: 'row', cols: ['col-8', 'col-8'] }, vw: LAPTOP }
];
function T6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t6;
  const [rec, put] = useRec('t6');
  const solved = !!(rec && rec.done);
  const R = useRounds(T6_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => setOff([]), [R.ii]);
  const RR = T6_ROUNDS[R.ii];
  const why = c.rounds[R.ii];
  const ch = useChoiceHints(!R.ok, R.ii);
  const hints = choiceHints(c.hint1, c.hint2, why, c.opts[RR.k]);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (k) => {
    if (!canTap || R.ok || off.indexOf(k) >= 0) return;
    R.st.current.tries += 1;
    if (k !== RR.k) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(why, hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 't6', type: 'why-broken', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const keys = ['noRow', 'old', 'over'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code b6-pair" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={gridLines(pick, RR.o, { cols: RR.o.cols.map(() => 'is-hl') })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={gridH(pick, RR.o)} vw={RR.vw} title={vwTitle(pick, RR.vw)} /></div>
        </div>
        <div className="kz-pick b1-why">
          {keys.map((k) => (
            <button key={k} type="button" disabled={!canTap || R.ok || off.indexOf(k) >= 0} onClick={() => choose(k)} data-v={k}
              className={'kz-btn b1-opt2 ' + (R.ok && k === RR.k ? 'is-ok' : off.indexOf(k) >= 0 ? 'is-off' : 'is-ghost')}>
              {pick(c.opts[k])}<Led on={(led && !R.ok && off.length === 0) || (ch.lad.lv >= 3 && k === RR.k && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. СВОИ КОЛОНКИ — класс колонки для всех трёх (любой верный: col, col-N, md:col-N…); экран — переключатель; «Tayyor».
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [cv, setCv] = useState(store.get('myCol') || '');
  const [vw, setVw] = useState(LAPTOP);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !cv, 0);
  const v = normCls(cv);
  const confirm = () => {
    if (!canTap || !v || solved) return;
    st.current.tries += 1;
    const issue = issueText(wordIssue(v, 'col', null)) || (COL_RE.test(v) ? null : C.fill.msgs.unknown);
    if (issue && !COL_RE.test(v)) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myCol', v); put({ done: true });
    log({ screenId: 'w1', type: 'own-grid', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, cls: v });
    sayNow(c.ok, 'cheer');
  };
  const field = solved ? <span key="f" className="b1-st">{v}</span>
    : <span key="f" className={'kz-gap b1-slotin b2-field' + (led ? ' kz-gap-led' : '')}><InlineInput value={cv} onChange={(x) => { setCv(x); setMsg(null); }} onEnter={confirm} placeholder={L3('col…', 'col…', 'col…')} label={c.ask} max={16} /></span>;
  const o = { cont: 'container', row: 'row', cols: COLS3(v || null) };
  const L = gridLines(pick, o);
  L[2] = { k: 'f', d: 2, cls: 'b1-line is-hl', parts: clsParts({ tag: 'div', attrs: [], field, text: '…' + pick(C.site.b1) + '…', close: true }) };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b6-pair b6-w1">
          <div className="kz-col">
            <KzCode lines={L} cls="kz-code-sm b2-small" />
            <WidthChips pick={pick} vw={vw} onPick={(w) => { sfx('tap', true); setVw(w); }} />
          </div>
          <div className="kz-col"><SitePage pick={pick} body={gridH(pick, o)} vw={vw} title={vwTitle(pick, vw)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && !!v} glow={canTap && !!v} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: один код, три экрана (переключаются сами, пока Коди говорит о загадке).
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const col = store.get('myCol') || 'md:col-4';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const [vi, setVi] = useState(2);
  useEffect(() => { if (curK !== 'riddle') return undefined; const t = setInterval(() => setVi((x) => (x + 1) % 3), 1600); return () => clearInterval(t); }, [curK]);
  const vw = [PHONE, TABLET, LAPTOP][vi];
  const o = { cont: 'container', row: 'row', cols: COLS3(curK === 'riddle' ? 'md:col-4' : col) };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col"><SitePage pick={pick} body={gridH(pick, o)} vw={vw} title={vwTitle(pick, vw)} /></div>
          <div className="kz-col b1-end-side">
            <KzCode lines={gridLines(pick, o)} cls="kz-code-sm b2-small" />
            <div className="kz-roles">
              {['cont', 'grid', 'resp', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'cont' ? '#0FA38E' : k === 'grid' ? '#7952B3' : k === 'resp' ? '#D97706' : '#FA4F28' }}>
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

// РЕЕСТР И КОРЕНЬ
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 'g1', code: 'SHOW', Comp: G1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 }, { id: 's7', code: 'SHOW', Comp: S7 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs6Artifact(store) {
  const col = store.get('myCol');
  if (!col) return null;
  return { type: 'html-page', col,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>', '    <div class="container">', '      <div class="row">',
      '        <div class="' + escH(col) + '"><div class="card card-body">Robotlar</div></div>', '        <div class="' + escH(col) + '"><div class="card card-body">Jadval</div></div>', '        <div class="' + escH(col) + '"><div class="card card-body">Aloqa</div></div>',
      '      </div>', '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapKontejnerISetka({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs6Artifact(store) })
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
