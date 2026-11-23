// =============================================================================
// ЭКРАНЫ УРОКА 7 «Navbar и Pagination» (23.11.2026). Помощники — bsnav-head.jsx, общие куски — bsnav-common.jsx.
// Сценарий — docs/scenarij-bootstrap-07-navbar-i-pagination.md.
// =============================================================================
const NEWL = 'is-new is-read';
const FOLD_D = { drw: true };
const TOG = NAV_FULL.tog, DRW = NAV_FULL.drw;

// Курсор над вещью внутри страницы (iframe): невидимая метка .bn-aim встаёт поверх вещи, курсор едет к метке.
function useAim(root) {
  const g = useRef(null);
  const find = (sel) => {
    const r = root.current;
    if (!r) return null;
    const fs = r.querySelectorAll('.kz-br:not(.b1-docs) iframe');
    for (let i = fs.length - 1; i >= 0; i--) { const d = fs[i].contentDocument; const el = d && d.querySelector(sel); if (el) return { f: fs[i], d, el }; }
    return null;
  };
  const aim = (sel, box) => {
    const r = root.current, x = find(sel);
    if (!r || !x || !g.current) return null;
    const a = r.getBoundingClientRect(), fr = x.f.getBoundingClientRect(), k = fr.width / (x.f.offsetWidth || 1), b = box || x.el.getBoundingClientRect();
    Object.assign(g.current.style, { left: Math.round(fr.left - a.left + b.left * k) + 'px', top: Math.round(fr.top - a.top + b.top * k) + 'px', width: Math.round(b.width * k) + 'px', height: Math.round(b.height * k) + 'px' });
    return x;
  };
  return { find, aim, el: <i ref={g} className="bn-aim" aria-hidden="true" /> };
}
const actSteps = (M, A, act) => [
  { act: () => { if (A.aim(act)) M.go('.bn-aim', 0.5, 0.5, { hand: true }); }, wait: M.slow },
  { act: () => { M.click(); const x = A.find(act); if (x) x.el.click(); }, wait: 1100 }
];

// Общий показ: состояния { n, pg, news, vw, js, script, hl, fold, rules, say, ask, pose, acts: [селектор], same }.
function NavShow({ p, id, c, states }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const last = states.length - 1;
  const root = useRef(null);
  const M = useMysh(root);
  const A = useAim(root);
  const [n, setN] = useState(solved ? last : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const steps = [];
  states.forEach((S, j) => {
    if (!j) return;
    steps.push({ act: () => { if (!S.same) sfx(j === last ? 'ok' : 'pop', true); setN(j); }, wait: S.same ? 200 : S.acts ? 1000 : 1500 });
    (S.acts || []).forEach((a) => steps.push(...actSteps(M, A, a)));
    if (S.acts) steps.push({ act: () => M.hide(), wait: 300 });
    if (S.say) steps.push({ say: [{ text: c[S.say], pose: S.pose || 'point' }] });
  });
  steps.push({ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const S = states[n];
  useHlScroll(n);
  const askText = solved || demo.done ? c.askDone : (S.ask ? c[S.ask] : c.askStart);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={'kz-scene b1-pair bn-pair ms-root bn-' + id}>
          <div className="kz-col">
            <KzCode lines={codeLines(pick, S.n, S.pg, { hl: S.hl, fold: S.fold, script: S.script })} cls="kz-code-sm b2-small" />
            {S.rules ? <CssCard pick={pick} rules={rulesOf(S.rules)} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={pageH(pick, S.n, S.news, S.pg)} js={S.js} vw={S.vw} title={vwTitle(pick, S.vw)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// S1. КРЮЧОК — телефон: ссылки разделов и номера страниц столбиком; «Bootstrap bilan» — Navbar с ☰ и Pagination. Загадка.
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
  useHlScroll(on);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.done, 'smile');
  };
  const n = on ? NAV_FULL : NAV_PLAIN, pg = on ? PAG_FULL : PAG_PLAIN;
  const hlk = on ? { nav: NEWL, drw: NEWL, drw: NEWL, pul: NEWL, script: NEWL } : {};
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair bn-pair bn-s1">
          <div className="kz-col"><KzCode lines={codeLines(pick, n, pg, { hl: hlk, fold: FOLD_D, script: on })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={pageH(pick, n, 1, pg)} js={on} vw={PHONE} title={vwTitle(pick, PHONE)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. ИЗ ЧЕГО NAVBAR (показ, планшет 768): navbar + container-fluid → navbar-brand → nav navbar-nav, nav-item, nav-link, md:navbar-expand.
const NAV_BARE = navO({ theme: null, expand: null, tog: false, drw: false, brand: null, ul: null, li: null, a: null });
const S2_STATES = [
  { n: NAV_PLAIN, vw: TABLET },
  { n: NAV_BARE, vw: TABLET, hl: { nav: NEWL, cf: NEWL }, rules: ['navbar', 'fluid'], say: 'sayBar', ask: 'askBar' },
  { n: Object.assign({}, NAV_BARE, { brand: 'navbar-brand' }), vw: TABLET, hl: { brand: NEWL }, rules: ['brand'], say: 'sayBrand', ask: 'askBrand' },
  { n: navO({ theme: null, tog: false, drw: false }), vw: TABLET, hl: { nav: NEWL, ul: NEWL, i0: NEWL, i1: NEWL, i2: NEWL, i3: NEWL }, rules: ['nav', 'link', 'expand'], say: 'sayLinks', ask: 'askLinks', pose: 'wonder' }
];
const S2 = ({ p }) => <NavShow p={p} id="s2" c={C.s2} states={S2_STATES} />;

// X1. ОПЫТ — один и тот же Navbar на телефоне, планшете и ноутбуке.
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const all = { [PHONE]: 1, [TABLET]: 1, [LAPTOP]: 1 };
  const [vw, setVw] = useState(solved ? PHONE : TABLET);
  const [seen, setSeen] = useState(solved ? all : { [TABLET]: 1 });
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, Object.keys(seen).length);
  useEffect(() => { if (ok) return undefined; const t = setTimeout(() => lad.bump(), 14000); return () => clearTimeout(t); }, [ok, lad.lv]); // eslint-disable-line react-hooks/exhaustive-deps
  const pickW = (w) => {
    if (!canTap || ok) { setVw(w); return; }
    st.current.tries += 1; setVw(w); sfx('pop', true);
    const s2 = Object.assign({}, seen, { [w]: 1 });
    setSeen(s2);
    if (Object.keys(s2).length >= 3) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'navbar-widths', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.w[w], c.ok), 'cheer'); say(c.done, 'smile');
    } else sayNow(joinL(c.w[w], c.more), 'point');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Object.keys(seen).length + '/3'} />
        <div className="kz-scene b1-pair bn-pair bn-x1">
          <div className="kz-col"><KzCode lines={codeLines(pick, NAV_FULL, null, { fold: FOLD_D, hl: { nav: 'is-read' } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col">
            <SitePage pick={pick} body={pageH(pick, NAV_FULL, 1, null)} vw={vw} title={vwTitle(pick, vw)} />
            <WidthChips pick={pick} vw={vw} onPick={pickW} seen={seen} disabled={!canTap} led={led} />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S4. ☰ И ЯЩИК (показ, телефон 360): без script ☰ молчит; со script — ящик выезжает; крестик (data-bs-dismiss="drawer") закрывает.
const S4_STATES = [
  { n: NAV_FULL, vw: PHONE, hl: { tog: 'is-read', drw: 'is-read' }, fold: FOLD_D },
  { n: NAV_FULL, vw: PHONE, fold: FOLD_D, same: true, acts: ['.navbar-toggler'], say: 'sayDead', ask: 'askDead', pose: 'think' },
  { n: NAV_FULL, vw: PHONE, fold: FOLD_D, js: true, script: true, hl: { script: NEWL, tog: 'is-read' }, acts: ['.navbar-toggler'], rules: ['drawer'], say: 'sayOpen', ask: 'askOpen', pose: 'wonder' },
  { n: NAV_FULL, vw: PHONE, js: true, script: true, same: true, hl: { dh: 'is-read' }, acts: ['.drawer .btn-close'], say: 'sayClose', ask: 'askClose' }
];
const S4 = ({ p }) => <NavShow p={p} id="s4" c={C.s4} states={S4_STATES} />;

// G1. NAVBAR С САЙТА (показ «как на видео»): Components → Navbar → Example → копирование → вставка; лишнее (Menu, поиск)
// удалено; «Navbar», «Home», «Link» → свои; телефон: ☰ — ящик выехал (строка script из урока 1 есть).
const G1_EX = navO({ theme: null, brandText: 'Navbar', items: ['home', 'courses', 'contact'], texts: ['Home', 'Link', 'Disabled'], a: ['nav-link', 'nav-link', 'nav-link disabled'],
  extra: true, tog: Object.assign({}, TOG, { target: '#navbarDrawer' }), drw: Object.assign({}, DRW, { id: 'navbarDrawer' }) });
const g1N = (k) => (k >= 5 ? navO({ theme: null }) : k >= 4 ? Object.assign({}, G1_EX, { extra: false }) : G1_EX);
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const A = useAim(root);
  const D = useDocsNav(solved ? 'Navbar' : 'Alert', 'comp');
  const [scroll, setScroll] = useState(solved ? 'nex' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 6 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 лишнее удалено; 5 свои слова; 6 ящик открыт
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Navbar', true, () => { setN(2); setScroll('sec:nex'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('nex'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="nex"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('nex'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 900 },
      { say: [{ text: c.sayPaste, pose: 'think' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 900 },
      { say: [{ text: c.sayTrim, pose: 'point' }] },
      { act: () => { sfx('pop', true); setN(5); }, wait: 1000 },
      { say: [{ text: c.sayText, pose: 'point' }] }
    ], actSteps(M, A, '.navbar-toggler'), [
      { act: () => { M.hide(); setN(6); }, wait: 600 },
      { say: [{ text: c.sayOpen, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askTrim, c.askText, c.askOpen][n];
  const help = useShowHelp(c.help);
  useHlScroll(n);
  const nv = g1N(n);
  const hlk = n === 3 ? { nav: 'is-new', imenu: 'is-hl', form: 'is-hl' } : n === 5 ? { brand: NEWL, i0: NEWL, i1: NEWL, i2: NEWL, i3: NEWL } : {};
  const mid = n >= 3 ? codeLines(pick, nv, null, { hl: hlk }).map((l) => Object.assign({}, l, { d: l.d + 1 })) : [quietSlot('slot', 1, pick, !!copied)];
  const lines = [hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(mid, [scriptL('sc', 1, { cls: 'b2-cut' }), hl('bc', 0, '</body>', { cls: 'b1-edge' })]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={n >= 3 ? pageH(pick, nv, null, null) : ''} js vw={PHONE} title={vwTitle(pick, PHONE)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// Задание «впиши» по Navbar или Pagination: n / pg — что есть; key / attr / before / after / link — где поле; set(v) → [n, pg].
const fillNav = (pick, { n, pg, news, key, attr, before, after, link, set, want, kind, ask, hints, why, js, vw, fold }) => ({
  kind, want, ask, hints, why, js, vw, ph: L3('…', '…', '…'),
  line: (f) => codeLines(pick, n, pg, { field: { key, attr, node: f, before, after, link }, fold, script: js }),
  goal: null,
  body: (v) => { const r = set(v || null); return pageH(pick, r[0], news || null, r[1]); }
});

// T1 — navbar-brand, nav-link, md:navbar-expand (планшет 768).
function T1({ p }) {
  const pick = usePick();
  const c = C.t1;
  const A4 = (x) => ['nav-link', 'nav-link', x, 'nav-link'];
  const rounds = [
    fillNav(pick, { n: navO({ brand: null }), key: 'brand', attr: 'class', set: (v) => [navO({ brand: v }), null], want: 'navbar-brand', kind: 'cls', ask: c.ask1, hints: c.hints1, why: c.why1, vw: TABLET, fold: FOLD_D }),
    fillNav(pick, { n: navO({ a: A4(null) }), key: 'i2', attr: 'class', link: true, set: (v) => [navO({ a: A4(v) }), null], want: 'nav-link', kind: 'cls', ask: c.ask2, hints: c.hints2, why: c.why2, vw: TABLET }),
    fillNav(pick, { n: navO({ expand: null }), key: 'nav', attr: 'class', before: 'navbar', after: 'bg-1', set: (v) => [navO({ expand: v }), null], want: 'md:navbar-expand', kind: 'cls', ask: c.ask3, hints: c.hints3, why: c.why3, vw: TABLET, fold: FOLD_D })
  ];
  return <FillRounds p={p} id="t1" c={c} rounds={rounds} type="navbar-classes" />;
}

// S7. ЦВЕТ И АКТИВНАЯ ССЫЛКА (показ, планшет): data-bs-theme="dark" → bg-primary → active у первой ссылки.
const S7_STATES = [
  { n: navO({ theme: null, active: null }), vw: TABLET, fold: FOLD_D, hl: { nav: 'is-read' } },
  { n: navO({ active: null }), vw: TABLET, fold: FOLD_D, hl: { nav: NEWL }, rules: ['dark'], say: 'sayDark', ask: 'askDark' },
  { n: navO({ active: null, bg: 'bg-primary' }), vw: TABLET, fold: FOLD_D, hl: { nav: NEWL }, say: 'sayBlue', ask: 'askBlue', pose: 'wonder' },
  { n: navO({ bg: 'bg-primary' }), vw: TABLET, hl: { i0: NEWL }, rules: ['active'], say: 'sayActive', ask: 'askActive' }
];
const S7 = ({ p }) => <NavShow p={p} id="s7" c={C.s7} states={S7_STATES} />;

// T2 — data-bs-theme="dark", active у «Kurslar», data-bs-target="#menyu" (телефон, со script).
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const A4 = (x) => ['nav-link', joinC('nav-link', x), 'nav-link', 'nav-link'];
  const rounds = [
    fillNav(pick, { n: navO({ theme: null }), key: 'nav', attr: 'data-bs-theme', set: (v) => [navO({ theme: v }), null], want: 'dark', kind: 'theme', ask: c.ask1, hints: c.hints1, why: c.why1, vw: TABLET, fold: FOLD_D }),
    fillNav(pick, { n: navO({ active: null, a: A4(null) }), key: 'i1', attr: 'class', before: 'nav-link', link: true, set: (v) => [navO({ active: null, a: A4(v) }), null], want: 'active', kind: 'cls', ask: c.ask2, hints: c.hints2, why: c.why2, vw: TABLET }),
    fillNav(pick, { n: navO({ tog: Object.assign({}, TOG, { target: null }) }), key: 'tog', attr: 'data-bs-target', set: (v) => [navO({ tog: Object.assign({}, TOG, { target: v }) }), null], want: '#' + DRW_ID, kind: 'target', ask: c.ask3, hints: c.hints3, why: c.why3, vw: PHONE, js: true, fold: FOLD_D })
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} type="navbar-setup" />;
}

// T3. СБОРКА ПО ПОРЯДКУ: nav → container-fluid → название → ☰ → ящик со ссылками → закрыть container → закрыть nav.
const T3_ORDER = ['nav', 'cf', 'brand', 'tog', 'drw', 'cfc', 'navc'];
const T3_SHUFFLE = ['brand', 'navc', 'drw', 'nav', 'cfc', 'tog', 'cf'];
function T3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t3;
  const [rec, put] = useRec('t3');
  const solved = !!(rec && rec.done);
  const [done, setDone] = useState(solved ? T3_ORDER : []);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(done.length < T3_ORDER.length);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const fin = done.length === T3_ORDER.length;
  const canGo = useAdvanceGate(solved || fin, spoken);
  const led = useIdleLed(canTap && !fin, done.length);
  useHlScroll(done.length);
  const rows = navRows(pick, NAV_FULL);
  const R = {};
  rows.forEach((r) => { R[r.key] = r; });
  const drwKeys = rows.slice(rows.findIndex((r) => r.key === 'drw'), rows.findIndex((r) => r.key === 'drwc') + 1);
  const part = (k, html) => {
    if (k === 'drw') return html ? drwKeys.map((r) => rowHtml(r, pick)).join('') : rowSrc(R.drw) + '…</dialog>';
    return html ? rowHtml(R[k], pick) : rowSrc(R[k]);
  };
  const depth = { nav: 0, cf: 1, brand: 2, tog: 2, drw: 2, cfc: 1, navc: 0 };
  const label = { nav: '<nav class="navbar …">', cf: '<div class="container-fluid">', brand: '<a class="navbar-brand">', tog: '<button class="navbar-toggler">☰', drw: '<dialog class="drawer">…', cfc: '</div>', navc: '</nav>' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T3_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = c.msgs[want]; const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === T3_ORDER.length - 1 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T3_ORDER.length) {
      put({ done: true });
      log({ screenId: 't3', type: 'order-navbar', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  const lines = done.map((k, j) => hl('d' + k, depth[k], part(k, false), { cls: (k === 'drw' ? 'b2-cut ' : '') + (j === done.length - 1 ? 'is-new' : '') })).concat(fin ? [] : [quietSlot('slot', done.length ? depth[T3_ORDER[done.length]] : 0, pick, true)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/' + T3_ORDER.length} />
        <div className="kz-scene b1-pair bn-pair bn-t3">
          <div className="kz-col"><KzCode lines={lines.concat(fin ? [scriptL('sc', 0, { cls: 'b2-cut' })] : [])} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={done.map((k) => part(k, true)).join('')} js={fin} vw={TABLET} title={vwTitle(pick, TABLET)} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T3_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span><Led on={(lad.lv >= 3 && k === T3_ORDER[done.length]) || (led && done.length === 0 && k === 'nav')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// S10. НОМЕРА СТРАНИЦ (показ, планшет): список → pagination, page-item, page-link → active → justify-content-center.
const S10_BASE = { n: NAV_FULL, news: 1, vw: TABLET, fold: { nav: true } };
const S10_STATES = [
  Object.assign({}, S10_BASE, { pg: PAG_PLAIN }),
  Object.assign({}, S10_BASE, { pg: pagO({ align: null, act: null }), hl: { pul: NEWL, p0: NEWL, p1: NEWL, p2: NEWL, p3: NEWL, p4: NEWL }, rules: ['pag', 'plink'], say: 'sayRow', ask: 'askRow' }),
  Object.assign({}, S10_BASE, { pg: pagO({ align: null }), hl: { p1: NEWL }, rules: ['pact'], say: 'sayActive', ask: 'askActive' }),
  Object.assign({}, S10_BASE, { pg: PAG_FULL, hl: { pul: NEWL }, rules: ['center'], say: 'sayCenter', ask: 'askCenter', pose: 'wonder' })
];
const S10 = ({ p }) => <NavShow p={p} id="s10" c={C.s10} states={S10_STATES} />;

// G2. PAGINATION С САЙТА (показ «как на видео»): Components → Pagination → Overview → копирование → вставка → свои
// «Oldingi / Keyingi» → раздел Alignment: двойной щелчок по justify-content-center, Ctrl + C → в class у ul.
const G2_EN = { prev: 'Previous', next: 'Next' };
const g2P = (k) => (k >= 6 ? pagO({ act: null }) : k >= 4 ? pagO({ align: null, act: null }) : pagO({ align: null, act: null, texts: G2_EN }));
function G2({ p }) {
  const pick = usePick();
  const c = C.g2;
  const [rec, put] = useRec('g2');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Pagination' : 'Navbar', 'comp');
  const [scroll, setScroll] = useState(solved ? 'palign' : null);
  const [copied, setCopied] = useState(null);
  const [wsel, setWsel] = useState(null);
  const [n, setN] = useState(solved ? 6 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 свои слова; 5 слово выделено; 6 в class
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const LN = '.bd-code[data-code="palign"] [data-ln="0"]';
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Pagination', true, () => { setN(2); setScroll('sec:pover'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('pover'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="pover"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('pover'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 900 },
      { say: [{ text: c.sayPaste, pose: 'point' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 900 },
      { say: [{ text: c.sayText, pose: 'point' }] },
      { act: () => { setView(false); setScroll('palign'); }, wait: 700 },
      { act: () => M.go(LN, 0.62, 0.55), wait: M.slow },
      { act: () => { M.click(); setTimeout(() => M.click(), 160); setWsel({ i: 0, w: 'justify-content-center' }); setN(5); }, wait: 700 },
      { act: () => { M.card({ t: 'Ctrl + C' }); sfx('pop', true); }, wait: 900 },
      { act: () => { M.card(null); M.hide(); sfx('ok', true); setN(6); setView(true); }, wait: 900 },
      { say: [{ text: c.sayAlign, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askText, c.askAlign, c.askAlign][n];
  const help = useShowHelp(c.help);
  useHlScroll(n);
  const pg = g2P(n);
  const hlk = n === 3 ? { pul: 'is-new', p0: 'is-hl', p4: 'is-hl' } : n === 4 ? { p0: NEWL, p4: NEWL } : n >= 6 ? { pul: NEWL } : {};
  const mid = n >= 3 ? codeLines(pick, null, pg, { hl: hlk }) : [quietSlot('slot', 0, pick, !!copied)];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} lines={{ palign: { word: wsel } }} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={mid} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={pageH(pick, null, 1, n >= 3 ? pg : null)} title={pick(C.site.title)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// X3. ОПЫТ — номера 2 и 3 открывают другие страницы новостей; active переходит на открытую.
function X3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x3;
  const [rec, put] = useRec('x3');
  const solved = !!(rec && rec.done);
  const [page, setPage] = useState(1);
  const [seen, setSeen] = useState(solved ? [2, 3] : []);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, seen: solved ? [2, 3] : [], page: 1 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const live = useRef({});
  live.current = { ok };
  useEffect(() => { if (ok) return undefined; const t = setTimeout(() => lad.bump(), 14000); return () => clearTimeout(t); }, [ok, lad.lv]); // eslint-disable-line react-hooks/exhaustive-deps
  const onPick = (v) => {
    if (!/^pg/.test(v)) return;
    const cur = st.current.page;
    const to = v === 'pgprev' ? Math.max(1, cur - 1) : v === 'pgnext' ? Math.min(3, cur + 1) : +v.slice(2);
    if (!to) return;
    st.current.tries += 1;
    if (to === cur) { if (!live.current.ok) sayNow(c.same, 'point'); return; }
    st.current.page = to; setPage(to); sfx('pop', true);
    if (live.current.ok) return;
    const line = fillL(c.page, { n: to });
    if (to === 1 || st.current.seen.indexOf(to) >= 0) { sayNow(joinL(line, c.more), 'point'); return; }
    const s2 = st.current.seen.concat(to);
    st.current.seen = s2; setSeen(s2);
    if (s2.length >= 2) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x3', type: 'use-pagination', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(line, c.ok), 'cheer'); say(c.done, 'smile');
    } else sayNow(joinL(line, c.more), 'point');
  };
  const pg = pagO({ act: page });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Math.min(2, seen.length) + '/2'} />
        <div className="kz-scene b1-pair bn-pair bn-x3">
          <div className="kz-col"><KzCode lines={codeLines(pick, null, pg, { hl: { ['p' + page]: 'is-hl' } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={pageH(pick, null, page, pg)} title={pick(C.site.title)} onPick={onPick} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// T4 — pagination, page-link, active у page-item, justify-content-center.
function T4({ p }) {
  const pick = usePick();
  const c = C.t4;
  const rounds = [
    fillNav(pick, { pg: pagO({ ul: null }), news: 1, key: 'pul', attr: 'class', after: 'justify-content-center', set: (v) => [null, pagO({ ul: v })], want: 'pagination', kind: 'cls', ask: c.ask1, hints: c.hints1, why: c.why1 }),
    fillNav(pick, { pg: pagO({ aX: { 2: null } }), news: 1, key: 'p2', attr: 'class', link: true, set: (v) => [null, pagO({ aX: { 2: v } })], want: 'page-link', kind: 'cls', ask: c.ask2, hints: c.hints2, why: c.why2 }),
    fillNav(pick, { pg: pagO({ act: null, liX: { 2: null } }), news: 2, key: 'p2', attr: 'class', before: 'page-item', set: (v) => [null, pagO({ act: null, liX: { 2: joinC('page-item', v) } })], want: 'active', kind: 'cls', ask: c.ask3, hints: c.hints3, why: c.why3 }),
    fillNav(pick, { pg: pagO({ align: null }), news: 1, key: 'pul', attr: 'class', before: 'pagination', set: (v) => [null, pagO({ align: v })], want: 'justify-content-center', kind: 'cls', ask: c.ask4, hints: c.hints4, why: c.why4 })
  ];
  return <FillRounds p={p} id="t4" c={c} rounds={rounds} type="pagination-classes" />;
}

// Q1. КАРТИНКА → CLASS (4 раунда): nav-link, navbar-brand, page-link, active.
// Картинки — в узком окне: ряд ссылок ul.nav (узкий Navbar прячет ссылки за ☰), строка Navbar с одним названием, номера страниц.
const qLinks = (pick, x) => '<ul class="nav">' + NAV_ITEMS.slice(0, 3).map((k) => '<li class="nav-item"><a class="' + escH(x) + '" href="#">' + escH(pick(C.site[k])) + '</a></li>').join('') + '</ul>';
const qBrand = (pick, x) => '<nav class="navbar bg-1" data-bs-theme="dark"><div class="container-fluid"><a class="' + escH(x) + '" href="#">' + escH(pick(C.site.title)) + '</a></div></nav>';
const Q1_ROUNDS = [
  { opts: ['navbar-link', 'nav-link', 'link', 'nav-item'], a: 1, make: (pick, x) => qLinks(pick, x) },
  { opts: ['brand', 'navbar-logo', 'navbar-brand', 'navbar-title'], a: 2, make: (pick, x) => qBrand(pick, x) },
  { opts: ['page-link', 'pagination-link', 'page', 'link-page'], a: 0, make: (pick, x) => pageH(pick, null, null, pagO({ a: x, act: null })) },
  { opts: ['selected', 'current', 'disabled', 'active'], a: 3, make: (pick, x) => pageH(pick, null, null, pagO({ act: null, liX: { 2: 'page-item ' + x } })) }
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
      log({ screenId: 'q1', type: 'picture-to-class', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const res = R.ok ? right : shown;
  const html = (x) => RR.make(pick, x);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1 b3-q1 bn-q1" key={'r' + R.ii}>
          <div className="kz-col"><Br title={pick(UI.need)} short cls="b2-q1page b3-goalwin"><BsFrame body={html(right)} bs dep={'g' + R.ii} /></Br></div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={html(res)} bs dep={res} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
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
// Промах в «почему не работает» / «верно или нет» (заказчик, 23.11.2026: «да, сделай» — при ошибке сначала намёк, а не ответ):
// первая ошибка — нейтральная фраза, со второй к ней добавляется ступень подсказки; объяснение верного ответа — только на 3-й ступени.
const MISS_WHY = L3("Bu sabab emas. Sahifaga va kodga yana bir qarang.", 'Не эта причина. Посмотри ещё раз на страницу и код.', 'That’s not the reason. Look at the page and the code again.');
const MISS_TF = L3("Unday emas. Gapni yana bir bor o'qing.", 'Не так. Прочитай утверждение ещё раз.', 'Not quite. Read the statement again.');

// T6. ПОЧЕМУ НЕ РАБОТАЕТ: нет строки script (☰ молчит); navbar-expand-lg (версия 5 — на планшете ☰); data-bs-target без «#».
// р1 — подсвечено пустое место в конце, где должна быть строка script; р3 — строка ☰ свёрнута до data-bs-target (видно без прокрутки).
const T6_ROUNDS = [
  { k: 'noScript', n: NAV_FULL, js: false, script: false, gapEnd: true, vw: PHONE, hl: {} },
  { k: 'old', n: navO({ expand: 'navbar-expand-lg' }), js: true, script: true, vw: TABLET, hl: { nav: 'is-hl' } },
  { k: 'noHash', n: navO({ tog: Object.assign({}, TOG, { target: DRW_ID }) }), js: true, script: true, vw: PHONE, hl: { tog: 'is-hl' }, src: { tog: '<button … data-bs-target="' + DRW_ID + '">' } }
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
    if (k !== RR.k) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(MISS_WHY, hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 't6', type: 'why-broken', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const keys = ['noScript', 'old', 'noHash'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.asks[R.ii]} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className={'kz-scene b1-pair b1-wide-code bn-pair bn-t6' + (RR.gapEnd && !R.ok ? ' bn-t6-gap' : '')} key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={codeLines(pick, RR.n, null, { hl: RR.hl, script: RR.script, gapEnd: RR.gapEnd && !R.ok, src: RR.src, fold: FOLD_D })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={pageH(pick, RR.n, 1, null)} js={RR.js} vw={RR.vw} title={vwTitle(pick, RR.vw)} /></div>
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

// W1. СВОЯ ССЫЛКА В NAVBAR — текст ссылки (любой) и её class; «Tayyor». Ширину можно переключить.
const ownNav = (t, v) => navO({ items: NAV_ITEMS.concat(['own']), texts: [null, null, null, null, t || '…'], a: ['nav-link', 'nav-link', 'nav-link', 'nav-link', v || null] });
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [txt, setTxt] = useState(store.get('myLink') || '');
  const [cv, setCv] = useState(solved ? 'nav-link' : '');
  const [vw, setVw] = useState(TABLET);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const t = String(txt || '').trim();
  const v = normCls(cv);
  const led = useIdleLed(canTap && !solved && (!t || !v), t ? 1 : 0);
  useHlScroll(0);
  const confirm = () => {
    if (!canTap || solved) return;
    st.current.tries += 1;
    const issue = !t ? c.noText : /[<>]/.test(t) ? UI.noTags : issueText(wordIssue(v, 'cls', 'nav-link'));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myLink', t); put({ done: true });
    log({ screenId: 'w1', type: 'own-nav-link', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const f1 = solved ? <span key="f1" className="b1-tx">{t}</span>
    : <span key="f1" className={'kz-gap b1-slotin b2-field bn-txtin' + (led && !t ? ' kz-gap-led' : '')}><InlineInput value={txt} onChange={(x) => { setTxt(x); setMsg(null); }} onEnter={confirm} placeholder={c.ph} label={c.askText} max={24} /></span>;
  const f2 = solved ? <span key="f2" className="b1-st">{v}</span>
    : <span key="f2" className={'kz-gap b1-slotin b2-field' + (led && t && !v ? ' kz-gap-led' : '')}><InlineInput value={cv} onChange={(x) => { setCv(x); setMsg(null); }} onEnter={confirm} placeholder={L3('nav-…', 'nav-…', 'nav-…')} label={c.askCls} max={20} /></span>;
  const nv = ownNav(t, v);
  const L = codeLines(pick, nv, null, { script: true });
  const at = L.findIndex((l) => /^i4/.test(String(l.k)));
  if (at >= 0) L[at] = { k: 'own', d: L[at].d, cls: 'b1-line is-hl', parts: [pn('a', '<'), <span key="b" className="b1-tg">li</span>, <React.Fragment key="s0">{sp()}</React.Fragment>, <span key="c0" className="b1-at">class</span>, pn('e0', '='), <span key="v0" className="b1-st">"nav-item"</span>, pn('g0', '>'),
    pn('a1', '<'), <span key="b1" className="b1-tg">a</span>, <React.Fragment key="s">{sp()}</React.Fragment>, <span key="c" className="b1-at">class</span>, pn('e', '='), <span key="q" className="b1-st">"</span>, f2, <span key="q2" className="b1-st">"</span>, pn('g', '>'), f1, pn('x', '</'), <span key="y" className="b1-tg">a</span>, pn('z', '></'), <span key="y2" className="b1-tg">li</span>, pn('z2', '>')] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : t ? c.askClass : c.askName} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair bn-pair bn-w1">
          <div className="kz-col"><KzCode lines={L} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col">
            <SitePage pick={pick} body={pageH(pick, nv, null, null)} js vw={vw} title={vwTitle(pick, vw)} />
            {solved ? <WidthChips pick={pick} vw={vw} onPick={setVw} /> : null}
          </div>
        </div>
        {!solved ? <ReadyBtn on={canTap && !!t && !!v} glow={canTap && !!t && !!v} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S17. ВЫВОД — разгадка: одно меню, а не два — md:navbar-expand меняет его по ширине; сайт ученика: Navbar с его ссылкой и номера страниц.
function S17({ p }) {
  const pick = usePick();
  const c = C.s17;
  const store = useStore();
  const mine = store.get('myLink');
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const [vw, setVw] = useState(TABLET);
  useEffect(() => { if (curK === 'riddle' || curK === 'drw') setVw(PHONE); else if (curK) setVw(TABLET); }, [curK]);
  useHlScroll(curK);
  const nv = mine ? ownNav(mine, 'nav-link') : NAV_FULL;
  const hlk = curK === 'riddle' ? { nav: 'is-hl' } : curK === 'nav' ? { nav: 'is-hl', drw: 'is-hl' } : curK === 'drw' ? { tog: 'is-hl', drw: 'is-hl', script: 'is-hl' } : curK === 'pag' ? { pul: 'is-hl' } : curK === 'site' ? { script: 'is-hl' } : {};
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end bn-end">
          <div className="kz-col">
            <SitePage pick={pick} body={pageH(pick, nv, 1, PAG_FULL)} js vw={vw} title={vwTitle(pick, vw)} />
            <WidthChips pick={pick} vw={vw} onPick={setVw} />
          </div>
          <div className="kz-col b1-end-side">
            <KzCode lines={codeLines(pick, nv, PAG_FULL, { hl: hlk, fold: FOLD_D, script: true })} cls="kz-code-sm b2-small" />
            <div className="kz-roles">
              {['nav', 'drw', 'pag', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'nav' ? '#0FA38E' : k === 'drw' ? '#7952B3' : k === 'pag' ? '#D97706' : '#FA4F28' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 's4', code: 'SHOW', Comp: S4 },
  { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 't2', code: 'LEVEL-2', Comp: T2 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's10', code: 'SHOW', Comp: S10 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 'x3', code: 'EXPERIMENT', Comp: X3 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's17', code: 'ACHIEVEMENT', Comp: S17 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's17') SCREEN_RESET[s.id] = [s.id]; });

function lessonBsNavArtifact(store) {
  const mine = store.get('myLink');
  if (!mine) return null;
  return { type: 'html-page', link: mine,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <nav class="navbar md:navbar-expand bg-1" data-bs-theme="dark">', '      <div class="container-fluid">', '        <a class="navbar-brand" href="#">Robot to\'garagi</a>',
      '        <button class="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer" data-bs-target="#menyu" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>',
      '        <dialog class="drawer drawer-end" id="menyu">', '          <div class="drawer-header"><h5 class="drawer-title">Menyu</h5><button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button></div>',
      '          <div class="drawer-body">', '            <ul class="nav navbar-nav">', '              <li class="nav-item"><a class="nav-link active" href="#">Asosiy</a></li>',
      '              <li class="nav-item"><a class="nav-link" href="#">Kurslar</a></li>', '              <li class="nav-item"><a class="nav-link" href="#">' + escH(mine) + '</a></li>',
      '            </ul>', '          </div>', '        </dialog>', '      </div>', '    </nav>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapNavbarIPagination({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBsNavArtifact(store) })
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
