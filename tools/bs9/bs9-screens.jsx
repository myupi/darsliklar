// =============================================================================
// ЭКРАНЫ УРОКА 9 «Menu и Dialog» (20.11.2026). Помощники — bs9-head.jsx, общие куски — bs9-common.jsx.
// Сценарий — docs/scenarij-bootstrap-10-menu-i-dialog.md.
// =============================================================================
const NEWL = 'is-new is-read';
const PLAIN_M = { btn: null, toggle: null, cls: null, items: MENU_FULL.items.map((x) => Object.assign({}, x, { cls: null })) };
const PLAIN_D = { tag: 'div', trig: { cls: null, toggle: null, target: null }, cls: null, id: DLG_ID, hdr: null, title: null, x: null, body: null, foot: null, fbtn: null };
const MENU_BTN = '[data-bs-toggle="menu"], button:first-child';

// Курсор над вещью внутри страницы (iframe): невидимая метка .b9-aim встаёт поверх вещи, курсор едет к метке.
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
  return { find, aim, el: <i ref={g} className="b9-aim" aria-hidden="true" /> };
}
// Шаги курсора: щёлкнуть вещь на странице (по-настоящему, el.click()) или мимо открытого окна — по фону.
const actSteps = (M, A, act) => {
  if (act === 'outside') return [
    { act: () => { if (A.aim('dialog[open]', { left: 4, top: 4, width: 10, height: 10 })) M.go('.b9-aim', 0.5, 0.5); }, wait: M.slow },
    { act: () => { M.click(); const x = A.find('dialog[open]'); if (x) x.el.dispatchEvent(new x.f.contentWindow.MouseEvent('click', { bubbles: true, clientX: 2, clientY: 2 })); }, wait: 1000 }
  ];
  return [
    { act: () => { if (A.aim(act)) M.go('.b9-aim', 0.5, 0.5, { hand: true }); }, wait: M.slow },
    { act: () => { M.click(); const x = A.find(act); if (x) x.el.click(); }, wait: 1000 }
  ];
};

// Общий показ: состояния { m, dl, js, script, hl, fold, rules, say, ask, pose, acts: [селектор | 'outside'], same }.
function UiShow({ p, id, c, states }) {
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
        <div ref={root} className={'kz-scene b1-pair b9-pair ms-root b9-' + id}>
          <div className="kz-col">
            <KzCode lines={uiLines(pick, S.m, S.dl, { hl: S.hl, fold: S.fold, script: S.script })} cls="kz-code-sm b2-small" />
            {S.rules ? <CssCard pick={pick} rules={rulesOf(S.rules)} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={uiH(pick, S.m, S.dl)} js={S.js} title={pick(C.site.title)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// S1. КРЮЧОК — ссылки разделов и правила стоят на странице кучей. «Bootstrap bilan» — меню и окно по кнопкам. Загадка.
const FOLD_HF = { hdr: true, foot: true };
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
  const m = on ? MENU_FULL : PLAIN_M, dl = on ? DLG_FULL : PLAIN_D;
  const hlk = on ? { mbtn: NEWL, menu: NEWL, m0: NEWL, m1: NEWL, m2: NEWL, tbtn: NEWL, dlg: NEWL, script: NEWL } : {};
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair b9-pair b9-s1">
          <div className="kz-col"><KzCode lines={uiLines(pick, m, dl, { hl: hlk, fold: FOLD_HF, script: on })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={uiH(pick, m, dl)} js={on} title={pick(C.site.title)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. МЕНЮ (показ): menu и menu-item — список спрятался; data-bs-toggle="menu" и script — кнопка открывает; пункт — закрывает.
const S2_STATES = [
  { m: PLAIN_M },
  { m: menuO({ btn: 'btn-solid theme-primary', toggle: null }), hl: { mbtn: NEWL, menu: NEWL, m0: NEWL, m1: NEWL, m2: NEWL }, rules: ['menu', 'item'], say: 'sayMenu', ask: 'askMenu' },
  { m: MENU_FULL, js: true, script: true, hl: { mbtn: NEWL, script: NEWL }, acts: ['[data-bs-toggle="menu"]'], rules: ['show'], say: 'sayOpen', ask: 'askOpen', pose: 'wonder' },
  { m: MENU_FULL, js: true, script: true, same: true, acts: ['[data-v="g2"]'], say: 'sayPick', ask: 'askPick' }
];
const S2 = ({ p }) => <UiShow p={p} id="s2" c={C.s2} states={S2_STATES} />;

// X1. ОПЫТ — открыть меню и выбрать два разных раздела.
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [seen, setSeen] = useState(solved ? ['g1', 'g2'] : []);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, seen: solved ? ['g1', 'g2'] : [] });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const live = useRef({});
  live.current = { ok };
  useEffect(() => { if (ok) return undefined; const t = setTimeout(() => lad.bump(), 14000); return () => clearTimeout(t); }, [ok, lad.lv]); // eslint-disable-line react-hooks/exhaustive-deps
  const onPick = (v) => {
    if (live.current.ok || !/^g\d$/.test(v)) return;
    st.current.tries += 1;
    const line = fillL(c.picked, { w: C.site[v] });
    if (st.current.seen.indexOf(v) >= 0) { sayNow(joinL(line, c.other), 'point'); return; }
    const s2 = st.current.seen.concat(v);
    st.current.seen = s2; setSeen(s2); sfx('pop', true);
    if (s2.length >= 2) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'use-menu', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(line, c.ok), 'cheer'); say(c.done, 'smile');
    } else sayNow(joinL(line, c.more), 'point');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Math.min(2, seen.length) + '/2'} />
        <div className="kz-scene b1-pair b9-pair b9-x1">
          <div className="kz-col"><KzCode lines={uiLines(pick, MENU_FULL, null, { script: true, hl: { mbtn: 'is-read' } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={uiH(pick, MENU_FULL, null)} js title={pick(C.site.title)} onPick={onPick} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// G1. МЕНЮ С САЙТА (показ «как на видео»): Components → Menu → Overview → копирование → вставка; «Toggle menu» и
// «Menu item 1–3» → свои слова; щелчок по кнопке — меню открылось (строка script из урока 1 есть).
const g1M = (k) => k >= 4 ? MENU_FULL : menuO({ btnText: 'Toggle menu', items: [1, 2, 3].map((i) => ({ kind: 'item', cls: 'menu-item', text: 'Menu item ' + i, k: 'g' + i })) });
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const A = useAim(root);
  const D = useDocsNav(solved ? 'Menu' : 'Alert', 'comp');
  const [scroll, setScroll] = useState(solved ? 'mover' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 5 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 свои слова; 5 открыто
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Menu', true, () => { setN(2); setScroll('sec:mover'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('mover'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="mover"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('mover'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 900 },
      { say: [{ text: c.sayPaste, pose: 'think' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 1000 },
      { say: [{ text: c.sayText, pose: 'point' }] }
    ], actSteps(M, A, '[data-bs-toggle="menu"]'), [
      { act: () => { M.hide(); setN(5); }, wait: 600 },
      { say: [{ text: c.sayOpen, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askText, c.askOpen][n];
  const help = useShowHelp(c.help);
  useHlScroll(n);
  const m = g1M(n);
  const hlk = n === 3 ? { mbtn: 'is-new', menu: 'is-new', m0: 'is-new', m1: 'is-new', m2: 'is-new' } : n === 4 ? { mbtn: NEWL, m0: NEWL, m1: NEWL, m2: NEWL } : {};
  const mid = n >= 3 ? uiLines(pick, m, null, { hl: hlk }).map((l) => Object.assign({}, l, { d: l.d + 1 })) : [quietSlot('slot', 1, pick, !!copied)];
  const lines = [hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(mid, [scriptL('sc', 1, { cls: 'b2-cut' }), hl('bc', 0, '</body>', { cls: 'b1-edge' })]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={n >= 3 ? uiH(pick, m, null) : ''} js title={pick(C.site.title)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// Задание «впиши» по меню или окну: m / dl — что есть, key / attr / before — где поле, set(v) → [m, dl] с ответом.
const fillUi = (pick, { m, dl, key, attr, before, set, want, kind, ask, hints, why, goal, gz, js, fold }) => ({
  kind, want, ask, hints, why, gz: gz || 0.55, js, ph: L3('…', '…', '…'),
  line: (f) => uiLines(pick, m, dl, { field: { key, attr, node: f, before }, script: js, fold }),
  goal: goal ? uiH(pick, ...set([].concat(want)[0])) : null,
  body: (v) => uiH(pick, ...set(v || null))
});

// T1 — menu, menu-item, data-bs-toggle="menu".
function T1({ p }) {
  const pick = usePick();
  const c = C.t1;
  const rounds = [
    fillUi(pick, { m: menuO({ cls: null }), key: 'menu', attr: 'class', set: (v) => [menuO({ cls: v }), null], want: 'menu', kind: 'cls', ask: c.ask1, hints: c.hints1, why: c.why1, goal: true, js: true }),
    fillUi(pick, { m: setMI(MENU_FULL, 2, { cls: null }), key: 'm2', attr: 'class', set: (v) => [setMI(MENU_FULL, 2, { cls: v }), null], want: 'menu-item', kind: 'cls', ask: c.ask2, hints: c.hints2, why: c.why2, js: true }),
    fillUi(pick, { m: menuO({ toggle: null }), key: 'mbtn', attr: 'data-bs-toggle', set: (v) => [menuO({ toggle: v }), null], want: 'menu', kind: 'toggle', ask: c.ask3, hints: c.hints3, why: c.why3, js: true })
  ];
  return <FillRounds p={p} id="t1" c={c} rounds={rounds} type="menu-classes" />;
}

// S6. ЗАГОЛОВОК И ЧЕРТА В МЕНЮ (показ, меню открыто на месте — show position-static, как примеры сайта).
const S6_M0 = menuO({ stat: true });
const S6_M1 = menuO({ stat: true, items: [{ kind: 'hdr', cls: 'menu-header', k: 'courses' }].concat(MENU_FULL.items) });
const S6_M2 = menuO({ stat: true, items: S6_M1.items.concat([{ kind: 'div', cls: 'menu-divider' }, { kind: 'item', cls: 'menu-item', k: 'contact' }]) });
const S6_STATES = [
  { m: S6_M0, hl: { menu: 'is-read' } },
  { m: S6_M1, hl: { m0: NEWL }, rules: ['hdr'], say: 'sayHdr', ask: 'askHdr' },
  { m: S6_M2, hl: { m4: NEWL, m5: NEWL }, rules: ['div'], say: 'sayDiv', ask: 'askDiv', pose: 'wonder' }
];
const S6 = ({ p }) => <UiShow p={p} id="s6" c={C.s6} states={S6_STATES} />;

// T2 — menu-header и пункт «Aloqa» (меню открыто на месте). Черты в задании нет: обычный hr рисует её и без класса,
// разницы ученик не видит (заказчик, 23.11.2026: «есть некоторые непонятные задания») — черта показана на S6 и стоит в коде готовой.
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const rounds = [
    fillUi(pick, { m: setMI(S6_M2, 0, { cls: null }), key: 'm0', attr: 'class', set: (v) => [setMI(S6_M2, 0, { cls: v }), null], want: 'menu-header', kind: 'cls', ask: c.ask1, hints: c.hints1, why: c.why1, goal: true, gz: 0.36 }),
    fillUi(pick, { m: setMI(S6_M2, 5, { cls: null }), key: 'm5', attr: 'class', set: (v) => [setMI(S6_M2, 5, { cls: v }), null], want: 'menu-item', kind: 'cls', ask: c.ask2, hints: c.hints2, why: c.why2, goal: true, gz: 0.36 })
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} type="menu-parts" />;
}

// S8. ОКНО (показ): <dialog> на странице спрятан; кнопка без data-bs-toggle молчит; с toggle и target — окно открывается; крестик закрывает.
const S8_D0 = dlgO({ trig: { cls: 'btn-outline theme-primary', toggle: null, target: null } });
const S8_STATES = [
  { dl: S8_D0, js: true, script: true, fold: FOLD_HF, hl: { dlg: 'is-read' } },
  { dl: S8_D0, js: true, script: true, fold: FOLD_HF, same: true, acts: ['button'], say: 'sayDead', ask: 'askDead', pose: 'think' },
  { dl: DLG_FULL, js: true, script: true, fold: FOLD_HF, hl: { tbtn: NEWL }, acts: ['[data-bs-toggle="dialog"]'], rules: ['dialog', 'open'], say: 'sayOpen', ask: 'askOpen', pose: 'wonder' },
  { dl: DLG_FULL, js: true, script: true, same: true, hl: { x: 'is-read' }, acts: ['dialog .btn-close'], say: 'sayClose', ask: 'askClose' }
];
const S8 = ({ p }) => <UiShow p={p} id="s8" c={C.s8} states={S8_STATES} />;

// G2. ОКНО С САЙТА (показ «как на видео»): Components → Dialog → Example → копирование → вставка; «Dialog title» → свой
// заголовок; щелчок по кнопке — окно открылось.
const g2D = (k) => dlgO({ id: 'exampleDialog', trig: { cls: 'btn-solid theme-primary', toggle: 'dialog', target: '#exampleDialog' }, trigText: 'Open dialog', titleText: k >= 5 ? null : 'Dialog title', fbtnText: 'Close' });
function G2({ p }) {
  const pick = usePick();
  const c = C.g2;
  const [rec, put] = useRec('g2');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const A = useAim(root);
  const D = useDocsNav(solved ? 'Dialog' : 'Menu', 'comp');
  const [scroll, setScroll] = useState(solved ? 'dex' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 6 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 выделен заголовок; 5 свой; 6 открыто
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Dialog', true, () => { setN(2); setScroll('sec:dex'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('dex'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="dex"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('dex'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 900 },
      { say: [{ text: c.sayPaste, pose: 'point' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 900 },
      { act: () => { sfx('ok', true); setN(5); }, wait: 700 },
      { say: [{ text: c.sayTitle, pose: 'point' }] }
    ], actSteps(M, A, '[data-bs-toggle="dialog"]'), [
      { act: () => { M.hide(); setN(6); }, wait: 600 },
      { say: [{ text: c.sayOpen, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askTitle, c.askTitle, c.askOpen][n];
  const help = useShowHelp(c.help);
  useHlScroll(n);
  const dl = g2D(n);
  const ttl = n >= 5 ? pick(C.site.rulesTitle) : 'Dialog title';
  const mid = n >= 3 ? uiLines(pick, null, dl, { fold: { foot: true }, hl: n === 3 ? { tbtn: 'is-new', dlg: 'is-new', hdr: 'is-new', body: 'is-new', foot: 'is-new' } : n === 5 ? { title: NEWL } : n === 4 ? { title: 'is-hl' } : {} })
    .map((l) => (n === 4 && /dialog-title/.test(JSON.stringify(l.k)) ? Object.assign({}, l, { parts: hParts('<h1 class="dialog-title">' + ttl + '</h1>', { word: ttl }) }) : l))
    .map((l) => Object.assign({}, l, { d: l.d + 1 })) : [quietSlot('slot', 1, pick, !!copied)];
  const lines = [hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(mid, [scriptL('sc', 1, { cls: 'b2-cut' }), hl('bc', 0, '</body>', { cls: 'b1-edge' })]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={n >= 3 ? uiH(pick, null, dl) : ''} js title={pick(C.site.title)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T3 — data-bs-target="#qoidalar"; data-bs-dismiss="dialog" у крестика; dialog-body.
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const rounds = [
    fillUi(pick, { dl: trigO(DLG_FULL, { target: null }), key: 'tbtn', attr: 'data-bs-target', set: (v) => [null, trigO(DLG_FULL, { target: v })], want: '#' + DLG_ID, kind: 'target', ask: c.ask1, hints: c.hints1, why: c.why1, js: true, fold: FOLD_HF }),
    fillUi(pick, { dl: dlgO({ x: null }), key: 'x', attr: 'data-bs-dismiss', set: (v) => [null, dlgO({ x: v })], want: 'dialog', kind: 'dismiss', ask: c.ask2, hints: c.hints2, why: c.why2, js: true, fold: { foot: true } }),
    fillUi(pick, { dl: dlgO({ body: null }), key: 'body', attr: 'class', set: (v) => [null, dlgO({ body: v })], want: 'dialog-body', kind: 'cls', ask: c.ask3, hints: c.hints3, why: c.why3, js: true, fold: FOLD_HF })
  ];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} type="dialog-parts" />;
}

// S11. ФОН (показ): щелчок мимо окна — закрылось; data-bs-backdrop="static" — мимо не закрывается, только кнопкой.
const S11_ST = trigO(DLG_FULL, { backdrop: 'static' });
const S11_STATES = [
  { dl: DLG_FULL, js: true, script: true, fold: FOLD_HF },
  { dl: DLG_FULL, js: true, script: true, fold: FOLD_HF, same: true, acts: ['[data-bs-toggle="dialog"]', 'outside'], say: 'sayBack', ask: 'askBack' },
  { dl: S11_ST, js: true, script: true, fold: FOLD_HF, hl: { tbtn: NEWL }, acts: ['[data-bs-toggle="dialog"]', 'outside'], say: 'sayStatic', ask: 'askStatic', pose: 'wonder' },
  { dl: S11_ST, js: true, script: true, same: true, hl: { fbtn: 'is-read' }, acts: ['[data-bs-dismiss="dialog"].btn-solid'], say: 'sayBtn', ask: 'askBtn' }
];
const S11 = ({ p }) => <UiShow p={p} id="s11" c={C.s11} states={S11_STATES} />;

// X2. ОПЫТ — открыть окно и закрыть тремя способами (переделано 23.11.2026, заказчик: «закрыть с тремя разными способами —
// даже взрослый человек не понял»): по одному способу за раз — строка задания называет одно действие (открой → нажми
// крестик / «Понятно» / мимо окна), на странице оранжевая рамка вокруг того, что нажать (фон — оранжевым оттенком),
// слева вместо кода — список «3 способа» с галочками. Закрыл другим, ещё не пройденным способом — тоже засчитано.
const X2_WAYS = ['x', 'btn', 'backdrop'];
const X2_MARK = 'outline: 5px solid #FA4F28; outline-offset: 3px; border-radius: 8px; box-shadow: 0 0 0 10px rgba(250,79,40,.3); animation: b9x2 1.1s ease-in-out infinite;';
const x2Style = (way) => '<style>@keyframes b9x2 { 50% { box-shadow: 0 0 0 18px rgba(250,79,40,.1); } }'
  + '[data-bs-toggle="dialog"] { ' + X2_MARK + ' }'
  + 'body:has(dialog[open]) [data-bs-toggle="dialog"] { outline: none; box-shadow: none; animation: none; }'
  // крестик Bootstrap 6 нарисован маской (mask-image) — рамку и тень она обрезает; поэтому крестик сам оранжевый и «дышит»
  + (way === 'x' ? '@keyframes b9x2s { 50% { transform: scale(1.7); } } dialog .btn-close { color: #FA4F28; opacity: 1; transform: scale(1.35); animation: b9x2s 1.1s ease-in-out infinite; }' : '')
  + (way === 'btn' ? 'dialog .dialog-footer .btn-solid { ' + X2_MARK + ' }' : '')
  + (way === 'backdrop' ? 'dialog.dialog::backdrop { background: rgba(250,79,40,.38); }' : '')
  + '</style>';
function X2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x2;
  const [rec, put] = useRec('x2');
  const solved = !!(rec && rec.done);
  const [seen, setSeen] = useState(solved ? X2_WAYS : []);
  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, seen: solved ? X2_WAYS : [] });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const live = useRef({});
  live.current = { ok };
  const cur = X2_WAYS.find((w) => seen.indexOf(w) < 0) || null;
  useEffect(() => { if (ok) return undefined; const t = setTimeout(() => lad.bump(), 15000); return () => clearTimeout(t); }, [ok, lad.lv]); // eslint-disable-line react-hooks/exhaustive-deps
  const onUi = (ev, how) => {
    if (live.current.ok) return;
    if (ev === 'open') { setOpen(true); return; }
    if (ev !== 'close') return;
    setOpen(false);
    const h = how === 'esc' ? 'backdrop' : how;
    st.current.tries += 1;
    if (st.current.seen.indexOf(h) >= 0) { sayNow(c.same, 'point'); return; }
    const s2 = st.current.seen.concat(h);
    st.current.seen = s2; setSeen(s2); sfx('pop', true);
    if (s2.length >= 3) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x2', type: 'close-dialog', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.how[h], c.ok), 'cheer'); say(c.done, 'smile');
    } else sayNow(joinL(c.how[h], c.next[X2_WAYS.find((w) => s2.indexOf(w) < 0)]), 'point');
  };
  const askNow = ok ? c.askDone : open && cur ? c.step[cur] : c.open;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askNow} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Math.min(3, seen.length) + '/3'} />
        <div className="kz-scene b1-pair b9-pair b9-x2">
          <div className="kz-col">
            <div className="b9-ways">
              <div className="b9-ways-h">{pick(c.title)}</div>
              {X2_WAYS.map((w, j) => {
                const done = seen.indexOf(w) >= 0;
                return (
                  <div key={w} className={'b9-way' + (done ? ' is-done' : '') + (w === cur && !ok ? ' is-cur' : '')} data-way={w}>
                    <span className="b9-way-n">{done ? '✓' : j + 1}</span>
                    <span className="b9-way-t">{pick(c.ways[w])}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="kz-col"><SitePage pick={pick} body={(ok ? '' : x2Style(cur)) + uiH(pick, null, DLG_FULL)} js title={pick(C.site.title)} onUi={onUi} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

const T4_ORDER = ['tbtn', 'dlg', 'hdr', 'body', 'foot', 'dlgc'];
const T4_SHUFFLE = ['body', 'dlgc', 'tbtn', 'foot', 'dlg', 'hdr'];
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
  const rows = {};
  dlgRows(pick, DLG_FULL).forEach((r) => { rows[r.key] = r; });
  const part = (k, html) => {   // шапка и низ — целиком, одной строкой
    if (k === 'hdr') return html ? rowHtml9(rows.hdr) + rowHtml9(rows.title) + rowHtml9(rows.x) + '</div>' : rowSrc9(rows.hdr) + '…</div>';
    if (k === 'foot') return html ? rowHtml9(rows.foot) + rowHtml9(rows.fbtn) + '</div>' : rowSrc9(rows.foot) + '…</div>';
    return html ? rowHtml9(rows[k]) : rowSrc9(rows[k]);
  };
  const depth = { tbtn: 0, dlg: 0, hdr: 1, body: 1, foot: 1, dlgc: 0 };
  const label = { tbtn: '<button data-bs-toggle="dialog">', dlg: '<dialog class="dialog">', hdr: '<div class="dialog-header">', body: '<div class="dialog-body">', foot: '<div class="dialog-footer">', dlgc: '</dialog>' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T4_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = c.msgs[want]; const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === T4_ORDER.length - 1 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T4_ORDER.length) {
      put({ done: true });
      log({ screenId: 't4', type: 'order-dialog', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  const lines = done.map((k, j) => hl('d' + k, depth[k], part(k, false), { cls: (k === 'hdr' || k === 'foot' ? 'b2-cut ' : '') + (j === done.length - 1 ? 'is-new' : '') })).concat(fin ? [] : [quietSlot('slot', done.length ? depth[T4_ORDER[done.length]] : 0, pick, true)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/' + T4_ORDER.length} />
        <div className="kz-scene b1-pair b9-pair b9-t4">
          <div className="kz-col"><KzCode lines={lines.concat(fin ? [scriptL('sc', 0, { cls: 'b2-cut' })] : [])} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={done.map((k) => part(k, true)).join('')} js={fin} title={pick(C.site.title)} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T4_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span><Led on={(lad.lv >= 3 && k === T4_ORDER[done.length]) || (led && done.length === 0 && k === 'tbtn')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// Q1. КАРТИНКА → CLASS (4 раунда): пункт меню, заголовок меню, шапка окна, низ окна. Меню и окно — открыты на месте.
const Q_DLG = (add) => dlgO(Object.assign({ trig: false, open: true }, add));
const Q1_ROUNDS = [
  { opts: ['menu-item', 'dropdown-item', 'menu-link', 'item'], a: 0, make: (x) => [menuO({ stat: true, items: MENU_FULL.items.map((it) => Object.assign({}, it, { cls: x })) }), null] },
  { opts: ['dropdown-header', 'menu-header', 'title', 'menu-title'], a: 1, make: (x) => [setMI(S6_M1, 0, { cls: x }), null] },
  { opts: ['modal-header', 'dialog-top', 'dialog-header', 'header'], a: 2, make: (x) => [null, Q_DLG({ hdr: x })] },
  { opts: ['dialog-bottom', 'footer', 'modal-footer', 'dialog-footer'], a: 3, make: (x) => [null, Q_DLG({ foot: x })] }
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
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1 b3-q1 b9-q1" key={'r' + R.ii}>
          <div className="kz-col"><Br title={pick(UI.need)} short cls="b2-q1page b3-goalwin"><BsFrame body={uiH(pick, ...RR.make(right))} bs dep={'g' + R.ii} /></Br></div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={uiH(pick, ...RR.make(res))} bs dep={res} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
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

// T6. ПОЧЕМУ НЕ РАБОТАЕТ: нет строки script (меню молчит); data-bs-toggle="modal" (версия 5); data-bs-target без «#».
const T6_ROUNDS = [
  { k: 'noScript', m: MENU_FULL, dl: null, js: false, script: false, hl: {} },   // строку кнопки не подсвечиваем — не хватает строки в конце
  { k: 'old', m: null, dl: trigO(DLG_FULL, { toggle: 'modal' }), js: true, script: true, hl: { tbtn: 'is-hl' } },
  { k: 'noHash', m: null, dl: trigO(DLG_FULL, { target: DLG_ID }), js: true, script: true, hl: { tbtn: 'is-hl' } }
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
        <div className="kz-scene b1-pair b1-wide-code b9-pair b9-t6" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={uiLines(pick, RR.m, RR.dl, { hl: RR.hl, script: RR.script, fold: FOLD_HF })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={uiH(pick, RR.m, RR.dl)} js={RR.js} title={pick(C.site.title)} /></div>
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

// W1. СВОЙ ПУНКТ МЕНЮ — текст пункта (любой) и его class; «Tayyor». Меню можно открыть и проверить.
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [txt, setTxt] = useState(store.get('myItem') || '');
  const [cv, setCv] = useState(solved ? 'menu-item' : '');
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
    const issue = !t ? c.noText : /[<>]/.test(t) ? UI.noTags : issueText(wordIssue(v, 'cls', 'menu-item'));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myItem', t); put({ done: true });
    log({ screenId: 'w1', type: 'own-menu-item', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const f1 = solved ? <span key="f1" className="b1-tx">{t}</span>
    : <span key="f1" className={'kz-gap b1-slotin b2-field b9-txtin' + (led && !t ? ' kz-gap-led' : '')}><InlineInput value={txt} onChange={(x) => { setTxt(x); setMsg(null); }} onEnter={confirm} placeholder={c.ph} label={c.askText} max={24} /></span>;
  const f2 = solved ? <span key="f2" className="b1-st">{v}</span>
    : <span key="f2" className={'kz-gap b1-slotin b2-field' + (led && t && !v ? ' kz-gap-led' : '')}><InlineInput value={cv} onChange={(x) => { setCv(x); setMsg(null); }} onEnter={confirm} placeholder={L3('menu-…', 'menu-…', 'menu-…')} label={c.askCls} max={20} /></span>;
  const m = menuO({ items: MENU_FULL.items.concat([{ kind: 'item', cls: v || null, text: t || '…', k: 'own' }]) });
  const L = uiLines(pick, m, null, { script: true });
  const at = L.findIndex((l) => /^m3/.test(String(l.k)));
  if (at >= 0) L[at] = { k: 'own', d: 1, cls: 'b1-line is-hl', parts: [pn('a', '<'), <span key="b" className="b1-tg">a</span>, <React.Fragment key="s">{sp()}</React.Fragment>, <span key="c" className="b1-at">class</span>, pn('e', '='), <span key="q" className="b1-st">"</span>, f2, <span key="q2" className="b1-st">"</span>, <React.Fragment key="s2">{sp()}</React.Fragment>, <span key="h" className="b1-at">href</span>, pn('e2', '='), <span key="v" className="b1-st">"#"</span>, pn('g', '>'), f1, pn('x', '</'), <span key="y" className="b1-tg">a</span>, pn('z', '>')] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b9-pair b9-w1">
          <div className="kz-col"><KzCode lines={L} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={uiH(pick, m, null)} js title={pick(C.site.title)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && !!t && !!v} glow={canTap && !!t && !!v} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: меню и окно — на той же странице, спрятаны до нажатия; страница ученика с его пунктом.
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const mine = store.get('myItem');
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  useHlScroll(curK);
  const m = menuO({ items: MENU_FULL.items.concat(mine ? [{ kind: 'item', cls: 'menu-item', text: mine, k: 'own' }] : []) });
  const hlk = curK === 'riddle' ? { menu: 'is-hl', dlg: 'is-hl' } : curK === 'menu' ? { mbtn: 'is-hl', menu: 'is-hl' } : curK === 'dlg' ? { tbtn: 'is-hl', dlg: 'is-hl' } : curK === 'site' ? { script: 'is-hl' } : {};
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end b9-end">
          <div className="kz-col"><SitePage pick={pick} body={uiH(pick, m, DLG_FULL)} js title={pick(C.site.title)} /></div>
          <div className="kz-col b1-end-side">
            <KzCode lines={uiLines(pick, m, DLG_FULL, { hl: hlk, fold: FOLD_HF, script: true })} cls="kz-code-sm b2-small" />
            <div className="kz-roles">
              {['menu', 'dlg', 'tgl', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'menu' ? '#0FA38E' : k === 'dlg' ? '#7952B3' : k === 'tgl' ? '#D97706' : '#FA4F28' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 'g1', code: 'SHOW', Comp: G1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 }, { id: 's6', code: 'SHOW', Comp: S6 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 'x2', code: 'EXPERIMENT', Comp: X2 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs9Artifact(store) {
  const mine = store.get('myItem');
  if (!mine) return null;
  return { type: 'html-page', item: mine,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <button class="btn-solid theme-primary" data-bs-toggle="menu">Bo\'limlar</button>', '    <div class="menu">',
      '      <a class="menu-item" href="#">Robototexnika</a>', '      <a class="menu-item" href="#">Dasturlash</a>', '      <a class="menu-item" href="#">3D modellash</a>',
      '      <a class="menu-item" href="#">' + escH(mine) + '</a>', '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapMenuIDialog({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs9Artifact(store) })
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
