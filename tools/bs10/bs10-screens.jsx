// =============================================================================
// ЭКРАНЫ УРОКА 10 «Финальный проект» (20.11.2026). Помощники — bs10-head.jsx, общие куски — bs10-common.jsx.
// Сценарий — docs/scenarij-bootstrap-10-final-proekt.md.
// =============================================================================
const NEWL = 'is-new is-read';

// S1. КРЮЧОК — сайт без Bootstrap: всё кучей. «Bootstrap bilan» — весь сайт. Загадка «всё наизусть».
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
  const o = { plain: !on };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair b10-pair b10-s1">
          <div className="kz-col"><KzCode lines={siteLines(pick, o, on ? { link: NEWL, cont: NEWL, hdr: NEWL, alert: NEWL, car: NEWL, row: NEWL, form: NEWL, script: NEWL } : {})} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={siteH(pick, o)} bs={on} js={on} title={pick(C.site.title)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. КАРТА ПУТИ — 9 станций, по одной на урок модуля.
const ST_KEYS = ['st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7', 'st8', 'st9'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const store = useStore();
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'explain' }]);
  const canGo = useAdvanceGate(true, spoken);
  const passed = ST_KEYS.filter((k) => store.get('done-' + k));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={c.ask} />
        <div className="b10-map">
          {ST_KEYS.map((k, i) => (
            <div key={k} className={'b10-stop' + (passed.indexOf(k) >= 0 ? ' is-done' : '')} style={{ '--i': i }}>
              <b>{i + 1}</b><span>{pick(C.map[k])}</span>
            </div>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// Станции 2–9: «впиши слово» на своей части сайта. spec: { lines(f), body(v), want, kind, vw, js, goal, badge, no }.
function Station({ p, id, spec }) {
  const pick = usePick();
  const c = C[id];
  const store = useStore();
  const RR = Object.assign({ ask: c.ask, hints: c.hints, why: c.why, ph: L3('…', '…', '…') }, spec(pick));
  return <FillRounds p={p} id={id} c={Object.assign({}, c, { eyebrow: fillL(C.fill.stop, { n: String(ST_KEYS.indexOf(id) + 1), w: c.eyebrow }) })} rounds={[RR]} type={'station-' + id} onDone={() => store.set('done-' + id, true)} />;
}
const HDR_KIDS = (pick) => '<img src="logo.png" alt="Logo"><h4>' + TX(pick, 'title') + '</h4>';
const st2 = (pick) => ({ kind: 'theme', want: 'success', ph: L3('…', '…', '…'),
  line: (f) => [hl('h0', 0, '<div class="d-flex justify-content-between align-items-center">'), hl('h1', 1, '<h4>' + pick(C.site.title) + '</h4>'),
    fLine('h2', 1, 'button', [['class', FIELD]], f, 'btn-solid theme-', pick(C.site.join) + '</button>'), hl('h3', 0, '</div>')],
  goal: '<div class="d-flex justify-content-between align-items-center"><h4>' + TX(pick, 'title') + '</h4><button class="btn-solid theme-success">' + TX(pick, 'join') + '</button></div>',
  body: (v) => '<div class="d-flex justify-content-between align-items-center"><h4>' + TX(pick, 'title') + '</h4><button class="btn-solid' + (v ? ' theme-' + escH(v) : '') + '">' + TX(pick, 'join') + '</button></div>', gz: 0.5 });
const st3 = (pick) => ({ kind: 'cls', want: 'img-fluid', vw: PHONE, badge: true,
  line: (f) => [hl('i0', 0, '<h4>' + pick(C.site.team) + '</h4>'), fLine('i1', 0, 'img', [['src', 'jamoa.jpg'], ['class', FIELD], ['alt', 'Jamoa']], f)],
  body: (v) => '<h4>' + TX(pick, 'team') + '</h4><img src="jamoa.jpg"' + (v ? ' class="' + escH(v) + '"' : '') + ' alt="Jamoa">' });
const st4 = (pick) => ({ kind: 'cls', want: 'justify-content-between', gz: 0.5,
  line: (f) => [fLine('j0', 0, 'div', [['class', FIELD]], f, 'd-flex '), hl('j1', 1, '<img src="logo.png" alt="Logo">'), hl('j2', 1, '<h4>' + pick(C.site.title) + '</h4>'), hl('j3', 1, '<button class="btn-solid theme-success">' + pick(C.site.join) + '</button>'), hl('j4', 0, '</div>')],
  goal: '<div class="d-flex justify-content-between align-items-center">' + HDR_KIDS(pick) + '<button class="btn-solid theme-success">' + TX(pick, 'join') + '</button></div>',
  body: (v) => '<div class="d-flex' + (v ? ' ' + escH(v) : '') + ' align-items-center">' + HDR_KIDS(pick) + '<button class="btn-solid theme-success">' + TX(pick, 'join') + '</button></div>' });
const st5 = (pick) => ({ kind: 'cls', want: 'card', gz: 0.45,
  line: (f) => [fLine('c0', 0, 'section', [['class', FIELD], ['style', 'max-width: 240px']], f), hl('c1', 1, '<img src="robot1.jpg" class="card-img-top" alt="Robot">'), hl('c2', 1, '<div class="card-body"><h4>' + pick(C.site.r1) + '</h4></div>'), hl('c3', 0, '</section>')],
  goal: P_CARD(pick, false, 1),
  body: (v) => P_CARD(pick, false, 1, v || '') });
const st6 = (pick) => ({ kind: 'cls', want: 'md:col-4', vw: TABLET,
  no: { 'col-4': C.st6.noCol, col: C.st6.noCol },
  line: (f) => [hl('r0', 0, '<div class="row">'), hl('r1', 1, '<div class="md:col-4"><section class="card">…</section></div>', { cls: 'b2-cut' }), hl('r2', 1, '<div class="md:col-4"><section class="card">…</section></div>', { cls: 'b2-cut' }),
    fLine('r3', 1, 'div', [['class', FIELD]], f, '', '<section class="card">…</section></div>'), hl('r4', 0, '</div>')],
  body: (v) => P_ROW(pick, false, ['md:col-4', 'md:col-4', v || '']) });
const st7 = (pick) => ({ kind: 'cls', want: 'form-control', gz: 0.5,
  line: (f) => [hl('f0', 0, '<form>'), hl('f1', 1, '<label for="ism" class="form-label">' + pick(C.site.name) + '</label>'), fLine('f2', 1, 'input', [['type', 'text'], ['id', 'ism'], ['class', FIELD]], f), hl('f3', 1, '<button type="submit" class="btn-solid theme-success">' + pick(C.site.send) + '</button>'), hl('f4', 0, '</form>')],
  goal: P_FORM(pick, false, 'success'),
  body: (v) => P_FORM(pick, false, 'success', v || '') });
const st8 = (pick) => ({ kind: 'cls', want: 'carousel-item', js: true,
  line: (f) => [hl('k0', 0, '<div id="galereya" class="carousel slide">'), hl('k1', 1, '<div class="carousel-inner">'),
    hl('k2', 2, '<div class="carousel-item active"><img src="slayd1.jpg" …></div>', { cls: 'b2-cut' }), hl('k3', 2, '<div class="carousel-item"><img src="slayd2.jpg" …></div>', { cls: 'b2-cut' }),
    fLine('k4', 2, 'div', [['class', FIELD]], f, '', '<img src="slayd3.jpg" …></div>'), hl('k5', 1, '</div>'), hl('k6', 1, '<div class="d-flex align-items-center gap-3">…</div>', { cls: 'b2-cut' }), hl('k7', 0, '</div>'), scriptL('k8', 0, { cls: 'b2-cut' })],
  body: (v) => P_CAR(pick, false, ['carousel-item active', 'carousel-item', v || '']) });
const st9 = (pick) => ({ kind: 'toggle', want: 'menu', js: true,
  line: (f) => [fLine('m0', 0, 'button', [['class', 'btn-outline theme-success'], ['data-bs-toggle', FIELD]], f, '', pick(C.site.sections) + '</button>'), hl('m1', 0, '<div class="menu">'),
    hl('m2', 1, '<a class="menu-item" href="#">' + pick(C.site.g1) + '</a>'), hl('m3', 1, '<a class="menu-item" href="#">' + pick(C.site.g2) + '</a>'), hl('m4', 1, '<a class="menu-item" href="#">' + pick(C.site.g3) + '</a>'), hl('m5', 0, '</div>'), scriptL('m6', 0, { cls: 'b2-cut' })],
  body: (v) => P_MENU(pick, false, 'success', v || null) });
const ST2 = ({ p }) => <Station p={p} id="st2" spec={st2} />;
const ST3 = ({ p }) => <Station p={p} id="st3" spec={st3} />;
const ST4 = ({ p }) => <Station p={p} id="st4" spec={st4} />;
const ST5 = ({ p }) => <Station p={p} id="st5" spec={st5} />;
const ST6 = ({ p }) => <Station p={p} id="st6" spec={st6} />;
const ST7 = ({ p }) => <Station p={p} id="st7" spec={st7} />;
const ST8 = ({ p }) => <Station p={p} id="st8" spec={st8} />;
const ST9 = ({ p }) => <Station p={p} id="st9" spec={st9} />;

// ST1. СТАНЦИЯ 1 (урок 1) — какую строку поставить в head: живой результат на странице.
const ST1_OPTS = ['link', 'script', 'typo', 'style'];
function ST1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.st1;
  const store = useStore();
  const [rec, put] = useRec('st1');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [shown, setShown] = useState(solved ? 'link' : null);
  const [ok, setOk] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const ch = useChoiceHints(!ok, 0);
  const hints = choiceHints(c.hint1, c.hint2, c.why, c.opts.link);
  const led = useIdleLed(canTap && !ok, off.length);
  const st = useRef({ tries: 0, misses: 0 });
  const choose = (k) => {
    if (!canTap || ok || off.indexOf(k) >= 0) return;
    st.current.tries += 1; setShown(k);
    if (k !== 'link') { st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(c.no[k], hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear(); put({ done: true }); store.set('done-st1', true);
    log({ screenId: 'st1', type: 'station-cdn', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
    sayNow(joinL(C.fill.right, c.why), 'cheer');
  };
  const line = shown === 'link' ? linkL('ln', 1, { cls: 'is-new' }) : shown === 'script' ? scriptL('ln', 1, { cls: 'is-new' }) : shown === 'typo' ? hl('ln', 1, LINK_BAD, { cls: 'is-new' }, { fold: 'pkg' })
    : shown === 'style' ? hl('ln', 1, '<style>bootstrap</style>', { cls: 'is-new' }) : quietSlot('ln', 1, pick, true);
  const lines = [hl('ho', 0, '<head>', { cls: 'b1-edge' }), line, hl('hc', 0, '</head>', { cls: 'b1-edge' }), hl('bo', 0, '<body>', { cls: 'b1-edge' }),
    hl('b1', 1, '<div class="d-flex justify-content-between align-items-center">…</div>', { cls: 'b2-cut' }), hl('b2', 1, '<div class="alert theme-success" role="alert">…</div>', { cls: 'b2-cut' }), hl('bc', 0, '</body>', { cls: 'b1-edge' })];
  const body = '<div class="d-flex justify-content-between align-items-center">' + HDR_KIDS(pick) + '<button class="btn-solid theme-success">' + TX(pick, 'join') + '</button></div>' + P_ALERT(pick, false, 'success');
  return (
    <StageB voiceTop eyebrow={fillL(C.fill.stop, { n: '1', w: c.eyebrow })} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.done : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} />
        <div className="kz-scene b1-pair b10-pair b10-st1">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={body} bs={shown === 'link'} title={pick(C.site.title)} /></div>
        </div>
        <div className="kz-pick b2-codes b10-opts">
          {ST1_OPTS.map((k) => (
            <button key={k} type="button" disabled={!canTap || ok || off.indexOf(k) >= 0} onClick={() => choose(k)} data-v={k}
              className={'kz-btn b2-code-opt ' + (ok && k === 'link' ? 'is-ok' : off.indexOf(k) >= 0 ? 'is-off' : 'is-ghost')} translate="no">
              {pick(c.opts[k])}<Led on={(led && !ok && off.length === 0 && k === 'script') || (ch.lad.lv >= 3 && k === 'link' && !ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// G1. ЗАБЫЛИ СЛОВО? (показ «как на видео»): Components → Menu → строка кнопки с data-bs-toggle="menu".
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Menu' : 'Alert', 'comp');
  const [scroll, setScroll] = useState(solved ? 'mover' : null);
  const [mark, setMark] = useState(solved ? { mover: [0] } : null);
  const [n, setN] = useState(solved ? 3 : 0);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'think' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Menu', true, () => { setN(2); setScroll('sec:mover'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('mover'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="mover"] [data-ln="0"]', 0.55, 0.5), wait: M.slow },
      { act: () => { M.click(); setMark({ mover: [0] }); setN(3); }, wait: 700 },
      { act: () => M.hide(), wait: 300 },
      { say: [{ text: c.sayLine, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askLine][n];
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className="kz-scene b1-tri ms-root b10-g1 is-show">
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} mark={mark} scrollTo={scroll} scrollKey={String(n)} /></DocsBr></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T4. СБОРКА ДОКУМЕНТА ПО ПОРЯДКУ: link в head → body → шапка → карусель → карточки → script → </body>.
const T4_ORDER = ['link', 'bo', 'hdr', 'car', 'row', 'sc', 'bc'];
const T4_SHUFFLE = ['row', 'sc', 'link', 'car', 'bc', 'hdr', 'bo'];
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
  useHlScroll(done.length);
  const line = (k, cls) => (k === 'link' ? linkL('d' + k, 1, { cls: 'b2-cut ' + cls }) : k === 'sc' ? scriptL('d' + k, 1, { cls: 'b2-cut ' + cls })
    : hl('d' + k, k === 'bo' || k === 'bc' ? 0 : 1, { bo: '<body>', bc: '</body>', hdr: '<div class="d-flex justify-content-between …">…</div>', car: '<div id="galereya" class="carousel slide">…</div>', row: '<div class="row">…md:col-4 · card…</div>' }[k], { cls: 'b2-cut ' + cls }));
  const html = { link: '', bo: '', bc: '', sc: '', hdr: P_HDR(pick, false, 'success'), car: P_CAR(pick, false), row: P_ROW(pick, false) };
  const label = { link: '<link …bootstrap.min.css>', bo: '<body>', hdr: 'd-flex · ' + pick(C.site.title), car: 'carousel', row: 'row · card', sc: '<script …bundle.min.js>', bc: '</body>' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T4_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = c.msgs[want]; const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === T4_ORDER.length - 1 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T4_ORDER.length) {
      put({ done: true });
      log({ screenId: 't4', type: 'order-page', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  const head = [hl('ho', 0, '<head>', { cls: 'b1-edge' })].concat(done.indexOf('link') >= 0 ? [line('link', done[done.length - 1] === 'link' ? 'is-new' : '')] : [], [hl('hc', 0, '</head>', { cls: 'b1-edge' })]);
  const bodyLines = done.filter((k) => k !== 'link').map((k, j, arr) => line(k, j === arr.length - 1 && done[done.length - 1] === k ? 'is-new' : ''));
  const lines = head.concat(bodyLines, fin ? [] : [quietSlot('slot', T4_ORDER[done.length] === 'link' || T4_ORDER[done.length] === 'bo' || T4_ORDER[done.length] === 'bc' ? 0 : 1, pick, true)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/' + T4_ORDER.length} />
        <div className="kz-scene b1-pair b10-pair b10-t4">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={done.map((k) => html[k]).join('')} bs={done.indexOf('link') >= 0} js={done.indexOf('sc') >= 0} title={pick(C.site.title)} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T4_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span><Led on={(lad.lv >= 3 && k === T4_ORDER[done.length]) || (led && done.length === 0 && k === 'link')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// TF. ВЕРНО ИЛИ НЕТ (5 утверждений).
const TF_A = [true, false, true, false, true];
function TF({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.tf;
  const [rec, put] = useRec('tf');
  const solved = !!(rec && rec.done);
  const R = useRounds(TF_A.length, solved);
  const [off, setOff] = useState([]);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => setOff([]), [R.ii]);
  const right = TF_A[R.ii] ? 'yes' : 'no';
  const why = c.why[R.ii];
  const ch = useChoiceHints(!R.ok, R.ii);
  const hints = choiceHints(c.hint1, c.hint2, why, c.opts[right]);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (k) => {
    if (!canTap || R.ok || off.indexOf(k) >= 0) return;
    R.st.current.tries += 1;
    if (k !== right) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(why, hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 'tf', type: 'true-false', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + TF_A.length} />
        <div className="b10-claim" key={'r' + R.ii}><span className="b10-claim-q">?</span><p>{pick(c.claims[R.ii])}</p></div>
        <div className="kz-pick b1-why b10-tf">
          {['yes', 'no'].map((k) => (
            <button key={k} type="button" disabled={!canTap || R.ok || off.indexOf(k) >= 0} onClick={() => choose(k)} data-v={k}
              className={'kz-btn b1-opt2 ' + (R.ok && k === right ? 'is-ok' : off.indexOf(k) >= 0 ? 'is-off' : 'is-ghost')}>
              {pick(c.opts[k])}<Led on={(led && !R.ok && off.length === 0 && k === 'yes') || (ch.lad.lv >= 3 && k === right && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// T6. ПОЧЕМУ НЕ РАБОТАЕТ: нет link (Bootstrap не подключён); btn-primary (версия 5); нет script (меню молчит).
const T6_ROUNDS = [
  { k: 'noLink', o: { noLink: true }, bs: false, js: true, hl: { link: '' } },
  { k: 'old', o: { btnCls: 'btn-primary' }, bs: true, js: true, hl: { hdr: 'is-hl' } },
  { k: 'noScript', o: { noScript: true }, bs: true, js: false, hl: { hdr: 'is-hl' } }
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
  useHlScroll(R.ii);
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
  const keys = ['noLink', 'old', 'noScript'];
  const body = '<div class="container">' + P_HDR(pick, false, 'success', RR.o.btnCls) + P_ALERT(pick, false, 'success') + '</div>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code b10-pair b10-t6" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={siteLines(pick, RR.o, RR.hl)} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={body} bs={RR.bs} js={RR.js} title={pick(C.site.title)} /></div>
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

// W1. СВОЙ ЦВЕТ САЙТА — слово theme-… для кнопок и объявления; «Tayyor».
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [tv, setTv] = useState(store.get('myTheme') || '');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const v = normCls(tv).replace(/^theme-/, '');
  const good = BS_THEMES.indexOf(v) >= 0;
  const led = useIdleLed(canTap && !solved && !v, 0);
  useHlScroll(0);
  const confirm = () => {
    if (!canTap || !v || solved) return;
    st.current.tries += 1;
    const issue = good ? null : issueText(wordIssue(v, 'theme', BS_THEMES));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myTheme', v); put({ done: true });
    log({ screenId: 'w1', type: 'own-theme', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, theme: v });
    sayNow(c.ok, 'cheer');
  };
  const th = good ? v : 'success';
  const field = solved ? <span key="f" className="b1-st">{v}</span>
    : <span key="f" className={'kz-gap b1-slotin b2-field' + (led ? ' kz-gap-led' : '')}><InlineInput value={tv} onChange={(x) => { setTv(x); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={14} /></span>;
  const lines = [hl('c0', 0, '<div class="container">'), hl('c1', 1, '<div class="d-flex justify-content-between …">…theme-' + (good ? v : '…') + '…</div>', { cls: 'b2-cut' }),
    fLine('c2', 1, 'div', [['class', FIELD], ['role', 'alert']], field, 'alert theme-', '…</div>'), hl('c3', 1, '<div class="row">…</div>', { cls: 'b2-cut' }), hl('c4', 0, '</div>')];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b10-pair b10-w1">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={'<div class="container">' + P_HDR(pick, false, th) + P_ALERT(pick, false, th) + P_ROW(pick, false) + '</div>'} js title={pick(C.site.title)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && !!v} glow={canTap && !!v} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: наизусть не нужно — сайт Bootstrap подскажет; весь сайт ученика.
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const th = store.get('myTheme') || 'success';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  useHlScroll(curK);
  const hlk = curK === 'cdn' ? { link: 'is-hl', script: 'is-hl' } : curK === 'look' ? { hdr: 'is-hl', alert: 'is-hl' } : curK === 'layout' ? { cont: 'is-hl', row: 'is-hl', form: 'is-hl' } : curK === 'js' ? { car: 'is-hl', hdr: 'is-hl' } : {};
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end b10-end">
          <div className="kz-col"><SitePage pick={pick} body={siteH(pick, { th })} js title={pick(C.site.title)} /></div>
          <div className="kz-col b1-end-side">
            <KzCode lines={siteLines(pick, { th }, hlk)} cls="kz-code-sm b2-small" />
            <div className="kz-roles">
              {['cdn', 'look', 'layout', 'js'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'cdn' ? '#0FA38E' : k === 'look' ? '#7952B3' : k === 'layout' ? '#D97706' : '#FA4F28' }}>
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
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'SHOW', Comp: S2 },
  { id: 'st1', code: 'LEVEL-1', Comp: ST1 }, { id: 'st2', code: 'LEVEL-1', Comp: ST2 }, { id: 'st3', code: 'LEVEL-1', Comp: ST3 }, { id: 'st4', code: 'LEVEL-2', Comp: ST4 },
  { id: 'st5', code: 'LEVEL-2', Comp: ST5 }, { id: 'st6', code: 'LEVEL-2', Comp: ST6 }, { id: 'st7', code: 'LEVEL-2', Comp: ST7 }, { id: 'st8', code: 'LEVEL-2', Comp: ST8 },
  { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 'st9', code: 'LEVEL-2', Comp: ST9 },
  { id: 't4', code: 'LEVEL-2', Comp: T4 }, { id: 'tf', code: 'CHECK', Comp: TF }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs10Artifact(store) {
  const th = store.get('myTheme');
  if (!th) return null;
  return { type: 'html-page', theme: th,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>', '    <div class="container">',
      '      <div class="d-flex justify-content-between align-items-center">', '        <h4>Robot to\'garagi</h4>', '        <button class="btn-solid theme-' + escH(th) + '">Yozilish</button>', '      </div>',
      '      <div class="alert theme-' + escH(th) + '" role="alert"><p>Shanba kuni musobaqa!</p></div>', '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapFinalProekt({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs10Artifact(store) })
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
