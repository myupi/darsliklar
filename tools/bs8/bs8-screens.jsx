// =============================================================================
// ЭКРАНЫ УРОКА 8 «Карусель» (20.11.2026). Помощники — bs8-head.jsx, общие куски — bs8-common.jsx.
// Сценарий — docs/scenarij-bootstrap-08-karusel.md.
// =============================================================================
const NEWL = 'is-new is-read';
const PLAIN = { car: null, id: null, auto: null, inner: null, items: [null, null, null], ints: [], btns: null, dots: null };
const ITEMS3 = (c) => [c + ' active', c, c];

// Курсор над вещью внутри страницы (iframe): невидимая метка .b8-aim встаёт поверх вещи, курсор едет к метке.
function useAim(root) {
  const g = useRef(null);
  const find = (sel) => {
    const r = root.current;
    if (!r) return null;
    const fs = r.querySelectorAll('.b1-tri-page iframe, .kz-col:last-child > .kz-br iframe');
    for (let i = fs.length - 1; i >= 0; i--) { const d = fs[i].contentDocument; const el = d && d.querySelector(sel); if (el) return { f: fs[i], d, el }; }
    return null;
  };
  const aim = (sel) => {
    const r = root.current, x = find(sel);
    if (!r || !x || !g.current) return null;
    const a = r.getBoundingClientRect(), fr = x.f.getBoundingClientRect(), k = fr.width / (x.f.offsetWidth || 1), b = x.el.getBoundingClientRect();
    Object.assign(g.current.style, { left: Math.round(fr.left - a.left + b.left * k) + 'px', top: Math.round(fr.top - a.top + b.top * k) + 'px', width: Math.round(b.width * k) + 'px', height: Math.round(b.height * k) + 'px' });
    return x;
  };
  return { find, aim, el: <i ref={g} className="b8-aim" aria-hidden="true" /> };
}
// Шаги курсора: щёлкнуть вещь на странице (по-настоящему: el.click() — работает, как у человека) и «провести пальцем».
const clickSteps = (M, A, sel) => [
  { act: () => { if (A.aim(sel)) M.go('.b8-aim', 0.5, 0.5, { hand: true }); }, wait: M.slow },
  { act: () => { M.click(); const x = A.find(sel); if (x) x.el.click(); }, wait: 1100 }
];
const swipeSteps = (M, A, to) => [
  { act: () => { if (A.aim('.carousel-inner')) M.go('.b8-aim', 0.8, 0.5); }, wait: M.slow },
  { act: () => { M.hold(true); if (A.aim('.carousel-inner')) M.go('.b8-aim', 0.2, 0.5); const x = A.find('.carousel'); if (x && x.el.__bs) x.el.__bs.go(to, true); }, wait: 900 },
  { act: () => M.hold(false), wait: 500 }
];

// Общий показ: состояния { o, js, script, hl, rules, say, ask, pose, openDots, click (что нажать на странице), swipe (к какому
// слайду провести) }.
function CarShow({ p, id, c, states }) {
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
    if (!S.same) steps.push({ act: () => { sfx(j === last ? 'ok' : 'pop', true); setN(j); }, wait: S.say || S.click || S.swipe != null ? 900 : 1500 });
    else steps.push({ act: () => setN(j), wait: 200 });
    if (S.click) steps.push(...clickSteps(M, A, S.click), { act: () => M.hide(), wait: 300 });
    if (S.swipe != null) steps.push(...swipeSteps(M, A, S.swipe), { act: () => M.hide(), wait: 300 });
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
        <div ref={root} className={'kz-scene b1-pair b8-pair ms-root b8-' + id}>
          <div className="kz-col">
            <KzCode lines={carLines(pick, S.o, { hl: S.hl, script: S.script, openDots: S.openDots })} cls="kz-code-sm b2-small" />
            {S.rules ? <CssCard pick={pick} rules={rulesOf(S.rules)} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={carH(pick, S.o)} js={S.js} title={pick(C.site.title)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// S1. КРЮЧОК — галерея: три фото друг под другом. «Bootstrap bilan» — карусель с кнопками. Загадка.
const S1_ON = carO({ btns: BTNS });
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
  const o = on ? S1_ON : PLAIN;
  useHlScroll(on);
  const hlk = on ? { car: NEWL, inner: NEWL, i0: NEWL, i1: NEWL, i2: NEWL, prev: NEWL, next: NEWL, script: NEWL } : {};
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair b8-pair b8-s1">
          <div className="kz-col"><KzCode lines={carLines(pick, o, { hl: hlk, script: on })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={carH(pick, o)} js={on} title={pick(C.site.title)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. УСТРОЙСТВО (показ): carousel-inner — фото в ряд; carousel-item — по одному; курсор листает.
const S2_STATES = [
  { o: PLAIN },
  { o: carO({ items: [null, null, null] }), hl: { car: NEWL, inner: NEWL }, rules: ['inner'], say: 'sayInner', ask: 'askInner' },
  { o: carO(), hl: { i0: NEWL, i1: NEWL, i2: NEWL }, rules: ['item'], say: 'sayItem', ask: 'askItem' },
  { o: carO(), same: true, swipe: 1, say: 'saySwipe', ask: 'askSwipe', pose: 'wonder' }
];
const S2 = ({ p }) => <CarShow p={p} id="s2" c={C.s2} states={S2_STATES} />;

// X1. ОПЫТ — листать самому (палец; на ноутбуке — перетащить мышью). Готово — увидел все три фото.
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [seen, setSeen] = useState(solved ? [0, 1, 2] : [0]);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, seen: solved ? [0, 1, 2] : [0] });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const live = useRef({});
  live.current = { ok };
  useEffect(() => { if (ok) return undefined; const t = setTimeout(() => lad.bump(), 14000); return () => clearTimeout(t); }, [ok, lad.lv]); // eslint-disable-line react-hooks/exhaustive-deps
  const onSlide = (i) => {
    if (live.current.ok) return;
    st.current.tries += 1;
    if (st.current.seen.indexOf(i) >= 0) return;
    const s2 = st.current.seen.concat(i);
    st.current.seen = s2;
    setSeen(s2); sfx('pop', true);
    if (s2.length >= 3) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'swipe', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer'); say(c.done, 'smile');
    } else sayNow(c.more, 'point');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Math.min(3, seen.length) + '/3'} />
        <div className="kz-scene b1-pair b8-pair b8-x1">
          <div className="kz-col"><KzCode lines={carLines(pick, carO(), { hl: { ['i' + seen[seen.length - 1]]: 'is-read' } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={carH(pick, carO())} title={pick(C.site.title)} onSlide={onSlide} cls={ok ? '' : 'b8-swipe'} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// G1. ПРИМЕР С САЙТА (показ «как на видео»): Components → Carousel → Bottom controls → копирование → вставка; вместо
// картинок «...» — сломанные; «...» → robot1.jpg…; щелчок по кнопке «›» — листается (строка script из урока 1 есть).
const G1_ID = 'carouselStackedBottom';
const g1O = (k) => carO({ id: G1_ID, inner: 'carousel-inner rounded-5', btns: { prev: 'prev', next: 'next', target: '#' + G1_ID }, ctlCls: '', pics: k >= 4 ? PICS : ['...', '...', '...'] });
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const A = useAim(root);
  const D = useDocsNav(solved ? 'Carousel' : 'Alert', 'comp');
  const [scroll, setScroll] = useState(solved ? 'bottom' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 5 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 свои фото; 5 листается
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Carousel', true, () => { setN(2); setScroll('sec:bottom'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('bottom'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="bottom"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('bottom'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 900 },
      { say: [{ text: c.sayPaste, pose: 'think' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 1000 },
      { say: [{ text: c.sayPics, pose: 'point' }] }
    ], clickSteps(M, A, '[data-bs-slide="next"]'), [
      { act: () => { M.hide(); setN(5); }, wait: 600 },
      { say: [{ text: c.sayNext, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askPics, c.askNext][n];
  const help = useShowHelp(c.help);
  const o = g1O(n);
  const hlk = n === 3 ? { car: 'is-new', inner: 'is-new', i0: 'is-new', i1: 'is-new', i2: 'is-new', prev: 'is-new', next: 'is-new' } : n === 4 ? { i0: NEWL, i1: NEWL, i2: NEWL } : {};
  const mid = n >= 3 ? carLines(pick, o, { hl: hlk }).map((l) => Object.assign({}, l, { d: l.d + 1 })) : [quietSlot('slot', 1, pick, !!copied)];
  const lines = [hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(mid, [scriptL('sc', 1, { cls: 'b2-cut' }), hl('bc', 0, '</body>', { cls: 'b1-edge' })]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={n >= 3 ? carH(pick, o) : ''} js title={pick(C.site.title)} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// Задание «впиши» по карусели: o — что уже есть, key/attr/before — где поле, set(v) — o с ответом.
const fillCar = (pick, { o, key, attr, before, set, want, kind, ask, hints, why, ph, goal, gz, js, fold }) => ({
  kind, want, ask, hints, why, gz: gz || 0.4, js, ph: ph || L3('…', '…', '…'),
  line: (f) => carLines(pick, o, { field: { key, attr, node: f, before }, script: js, foldCtl: fold }),
  goal: goal ? carH(pick, set([].concat(want)[0])) : null,
  body: (v) => carH(pick, set(v || null))
});
const setItem = (o, i, v) => Object.assign({}, o, { items: o.items.map((x, j) => (j === i ? v : x)) });

// T1 — по образцу: carousel-inner, carousel-item, active (карусель начинается со второго фото).
function T1({ p }) {
  const pick = usePick();
  const c = C.t1;
  const o1 = carO({ inner: null }), o2 = setItem(carO(), 2, null), o3 = carO({ items: ['carousel-item', 'carousel-item', 'carousel-item'] });
  const rounds = [
    fillCar(pick, { o: o1, key: 'inner', attr: 'class', set: (v) => carO({ inner: v }), want: 'carousel-inner', kind: 'cls', ask: c.ask1, hints: c.hints1, why: c.why1, goal: true }),
    fillCar(pick, { o: o2, key: 'i2', attr: 'class', set: (v) => setItem(carO(), 2, v), want: 'carousel-item', kind: 'cls', ask: c.ask2, hints: c.hints2, why: c.why2, goal: true }),
    fillCar(pick, { o: o3, key: 'i1', attr: 'class', before: 'carousel-item ', set: (v) => setItem(o3, 1, 'carousel-item' + (v ? ' ' + v : '')), want: 'active', kind: 'cls', ask: c.ask3, hints: c.hints3, why: c.why3, goal: true, js: true })
  ];
  return <FillRounds p={p} id="t1" c={c} rounds={rounds} type="carousel-classes" />;
}

// S6. КНОПКИ (показ): без строки script кнопка «›» не работает; со script — листает. data-bs-slide и data-bs-target.
const S6_O = carO({ btns: BTNS });
const S6_STATES = [
  { o: S6_O, hl: { prev: 'is-hl', next: 'is-hl' } },
  { o: S6_O, same: true, click: '[data-bs-slide="next"]', say: 'sayDead', ask: 'askDead', pose: 'think' },
  { o: S6_O, js: true, script: true, hl: { script: NEWL }, say: 'sayScript', ask: 'askScript' },
  { o: S6_O, js: true, script: true, same: true, click: '[data-bs-slide="next"]', hl: { next: 'is-read' }, say: 'sayNext', ask: 'askNext', pose: 'wonder' },
  { o: S6_O, js: true, script: true, same: true, hl: { next: 'is-read' }, say: 'sayTarget', ask: 'askTarget' }
];
const S6 = ({ p }) => <CarShow p={p} id="s6" c={C.s6} states={S6_STATES} />;

// T2 — кнопка «›»: data-bs-slide="next"; data-bs-target="#galereya" (с решёткой).
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const b1 = { prev: 'prev', next: null, target: '#' + CAR_ID };
  const b2 = (t) => ({ prev: 'prev', next: 'next', targets: { prev: '#' + CAR_ID, next: t } });
  const rounds = [
    fillCar(pick, { o: carO({ btns: b1 }), key: 'next', attr: 'data-bs-slide', set: (v) => carO({ btns: Object.assign({}, b1, { next: v }) }), want: 'next', kind: 'slide', ask: c.ask1, hints: c.hints1, why: c.why1, js: true }),
    fillCar(pick, { o: carO({ btns: b2(null) }), key: 'next', attr: 'data-bs-target', set: (v) => carO({ btns: b2(v) }), want: '#' + CAR_ID, kind: 'target', ask: c.ask2, hints: c.hints2, why: c.why2, js: true })
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} type="carousel-buttons" />;
}

// S8. ТОЧКИ (показ): carousel-indicators, data-bs-slide-to; щелчок по третьей точке.
const S8_O = carO({ dots: '#' + CAR_ID });
const S8_STATES = [
  { o: carO(), js: true, script: true },
  { o: S8_O, js: true, script: true, openDots: true, hl: { dots: NEWL }, rules: ['dots', 'dotOn'], say: 'sayDots', ask: 'askDots' },
  { o: S8_O, js: true, script: true, openDots: true, same: true, click: '[data-bs-slide-to="2"]', hl: { dot2: 'is-read' }, say: 'sayTo', ask: 'askTo', pose: 'wonder' }
];
const S8 = ({ p }) => <CarShow p={p} id="s8" c={C.s8} states={S8_STATES} />;

// G2. АВТОПРОКРУТКА С САЙТА (показ «как на видео»): Carousel → Autoplay → строка с data-bs-autoplay="true" → в нашу карусель;
// фото листаются сами, у точки — полоска времени. Потом Individual intervals: data-bs-interval у слайда, в миллисекундах.
function G2({ p }) {
  const pick = usePick();
  const c = C.g2;
  const [rec, put] = useRec('g2');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav('Carousel', 'comp');
  const [scroll, setScroll] = useState(solved ? 'cint' : 'sec:bottom');
  const [mark, setMark] = useState(solved ? { cint: [1] } : null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 раздел Autoplay; 2 строка выделена; 3 в нашей карусели; 4 интервалы
  const [view, setView] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { setN(1); setScroll('sec:cauto'); }, wait: 900 },
    { say: [{ text: c.sayPage, pose: 'point' }] },
    { act: () => { setScroll('cauto'); }, wait: 600 },
    { act: () => M.go('.bd-code[data-code="cauto"] [data-ln="0"]', 0.55, 0.5), wait: M.slow },
    { act: () => { M.click(); setMark({ cauto: [0] }); setN(2); }, wait: 600 },
    { act: () => { M.card({ t: 'Ctrl + C' }); sfx('pop', true); }, wait: 900 },
    { act: () => { M.card(null); M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 900 },
    { say: [{ text: c.sayAuto, pose: 'wonder' }] },
    { act: () => { setView(false); setScroll('cint'); setMark({ cint: [1] }); setN(4); }, wait: 1200 },
    { say: [{ text: c.sayInt, pose: 'point' }] },
    { act: () => setView(true), wait: 400 },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askPage, c.askLine, c.askAuto, c.askInt][n];
  const help = useShowHelp(c.help);
  const o = carO({ btns: BTNS, dots: '#' + CAR_ID, auto: n >= 3 ? 'true' : null });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff mark={mark} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={carLines(pick, o, { hl: n >= 3 ? { car: NEWL } : {}, script: true, foldCtl: true })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={carH(pick, o)} js title={pick(C.site.title)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T3 — data-bs-autoplay="true"; data-bs-interval="3000" у первого фото (3 секунды = 3000 миллисекунд).
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const base = carO({ btns: BTNS, dots: '#' + CAR_ID });
  const rounds = [
    fillCar(pick, { o: base, key: 'car', attr: 'data-bs-autoplay', set: (v) => Object.assign({}, base, { auto: v }), want: 'true', kind: 'auto', ask: c.ask1, hints: c.hints1, why: c.why1, js: true, fold: true }),
    fillCar(pick, { o: Object.assign({}, base, { auto: 'true' }), key: 'i0', attr: 'data-bs-interval', set: (v) => Object.assign({}, base, { auto: 'true', ints: [v, null, null] }), want: '3000', kind: 'ms', ask: c.ask2, hints: c.hints2, why: c.why2, js: true, fold: true })
  ];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} type="carousel-autoplay" />;
}

// S11. CROSSFADE (показ): slide → carousel-fade — фото сменяются прозрачностью.
const S11_A = carO({ auto: 'true', ints: ['2500', '2500', '2500'], dots: '#' + CAR_ID });
const S11_STATES = [
  { o: S11_A, js: true, script: true },
  { o: Object.assign({}, S11_A, { car: 'carousel carousel-fade' }), js: true, script: true, hl: { car: NEWL }, rules: ['fade', 'fadeOn'], say: 'sayFade', ask: 'askFade', pose: 'wonder' },
  { o: Object.assign({}, S11_A, { car: 'carousel carousel-fade' }), js: true, script: true, same: true, say: 'sayWhy', ask: 'askWhy' }
];
const S11 = ({ p }) => <CarShow p={p} id="s11" c={C.s11} states={S11_STATES} />;

// X2. ОПЫТ — эффект (slide / carousel-fade) и время (1000 / 3000 мс). Готово — испробованы оба эффекта и оба времени.
function X2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x2;
  const [rec, put] = useRec('x2');
  const solved = !!(rec && rec.done);
  const [fx, setFx] = useState('slide');
  const [ms, setMs] = useState('3000');
  const [seen, setSeen] = useState(solved ? ['slide', 'carousel-fade', '1000', '3000'] : ['slide', '3000']);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, seen.length);
  const tap = (k, isFx) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true);
    if (isFx) setFx(k); else setMs(k);
    const s2 = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(s2);
    const line = c.what[k];
    if (!ok && s2.length >= 4) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x2', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(line, c.ok), 'cheer'); say(c.done, 'smile');
      return;
    }
    sayNow(line, 'point');
    if (st.current.tries >= 6 && !ok) lad.bump();
  };
  const o = carO({ car: fx === 'slide' ? 'carousel slide' : 'carousel carousel-fade', auto: 'true', ints: [ms, ms, ms], dots: '#' + CAR_ID });
  const chip = (k, isFx, cur) => (
    <button key={k} type="button" className={'b2-chip is-shape' + (cur === k ? ' is-on' : '') + (seen.indexOf(k) >= 0 ? ' is-seen' : '')} onClick={() => tap(k, isFx)} disabled={!canTap} data-k={k}>
      <span translate="no">{k}</span><Led on={led && !ok && seen.indexOf(k) < 0 && k === ['carousel-fade', '1000'].find((x) => seen.indexOf(x) < 0)} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Math.min(4, seen.length) + '/4'} />
        <div className="kz-scene b1-pair b8-pair b8-x2">
          <div className="kz-col"><KzCode lines={carLines(pick, o, { hl: { car: 'is-read', i0: 'is-read' } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={carH(pick, o)} js title={pick(C.site.title)} /></div>
        </div>
        <div className="b2-pult"><div className="b2-pult-row b8-sw">
          <span className="b2-pult-h">{pick(c.fxH)}</span>{['slide', 'carousel-fade'].map((k) => chip(k, true, fx))}
        </div><div className="b2-pult-row b8-sw">
          <span className="b2-pult-h">{pick(c.msH)}</span>{['1000', '3000'].map((k) => chip(k, false, ms))}
        </div></div>
      </Sheet>
    </StageB>
  );
}

// T4. СБОРКА ПО ПОРЯДКУ: carousel → carousel-inner → слайд active → слайд → слайд → закрыть inner → закрыть carousel.
const T4_ORDER = ['car', 'inner', 'i0', 'i1', 'i2', 'innerc', 'carc'];
const T4_SHUFFLE = ['i1', 'carc', 'inner', 'i0', 'innerc', 'car', 'i2'];
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
  const rows = {};
  carRows(carO()).forEach((r) => { rows[r.key] = r; });
  const label = { car: 'carousel slide', inner: 'carousel-inner', i0: 'carousel-item active · slayd1', i1: 'carousel-item · slayd2', i2: 'carousel-item · slayd3', innerc: '</div> · inner', carc: '</div> · carousel' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T4_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = c.msgs[want]; const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === T4_ORDER.length - 1 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T4_ORDER.length) {
      put({ done: true });
      log({ screenId: 't4', type: 'order-carousel', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  useHlScroll(done.length);
  const lines = done.map((k, j) => hl('d' + k, rows[k].d, rowSrc8(rows[k]), { cls: (rows[k].img ? 'b2-cut ' : '') + (j === done.length - 1 ? 'is-new' : '') })).concat(fin ? [] : [quietSlot('slot', done.length ? rows[T4_ORDER[done.length]].d : 0, pick, true)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/' + T4_ORDER.length} />
        <div className="kz-scene b1-pair b8-pair b8-t4">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={done.map((k) => rowHtml8(rows[k])).join('')} title={pick(C.site.title)} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T4_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span><Led on={(lad.lv >= 3 && k === T4_ORDER[done.length]) || (led && done.length === 0 && k === 'car')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// Q1. КАРТИНКА → КОД (4 раунда): по одному фото, плавная смена, сам листает, точки. Окна — честный результат со скриптом.
const Q1_ROUNDS = [
  { opts: ['carousel-item', 'carousel-items', 'item', 'slide'], a: 0, make: (x) => carO({ items: [x + ' active', x, x] }) },
  { opts: ['slide', 'fade', 'carousel-fade', 'carousel-slide'], a: 2, make: (x) => carO({ car: 'carousel ' + x, auto: 'true', ints: ['1800', '1800', '1800'] }) },
  { opts: ['data-bs-ride="carousel"', 'autoplay="true"', 'data-bs-autoplay="false"', 'data-bs-autoplay="true"'], a: 3, make: (x) => carO({ extra: x, ints: ['1800', '1800', '1800'] }) },
  { opts: ['carousel-dots', 'carousel-indicators', 'indicators', 'carousel-control'], a: 1, make: (x) => carO({ dots: '#' + CAR_ID, dotsCls: x }) }
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
      log({ screenId: 'q1', type: 'picture-to-code', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const res = R.ok ? right : shown;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1 b3-q1 b8-q1" key={'r' + R.ii}>
          <div className="kz-col"><Br title={pick(UI.need)} short cls="b2-q1page b3-goalwin"><BsFrame body={carH(pick, RR.make(right))} bs js dep={'g' + R.ii} /></Br></div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={carH(pick, RR.make(res))} bs js dep={res} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
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

// T6. ПОЧЕМУ НЕ РАБОТАЕТ: нет строки script (кнопки мёртвые); data-bs-target без «#»; data-bs-ride — имя версии 5.
const T6_ROUNDS = [
  { k: 'noScript', o: carO({ btns: BTNS }), js: false, script: false, hl: { next: 'is-hl', prev: 'is-hl' } },
  { k: 'noHash', o: carO({ btns: { prev: 'prev', next: 'next', target: CAR_ID } }), js: true, script: true, hl: { next: 'is-hl', prev: 'is-hl' } },
  { k: 'old', o: carO({ extra: 'data-bs-ride="carousel"', dots: '#' + CAR_ID }), js: true, script: true, fold: true, hl: { car: 'is-hl' } }
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
  const keys = ['noScript', 'noHash', 'old'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code b8-pair b8-t6" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={carLines(pick, RR.o, { hl: RR.hl, script: RR.script, foldCtl: RR.fold })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={carH(pick, RR.o)} js={RR.js} title={pick(C.site.title)} /></div>
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

// W1. СВОЯ КАРУСЕЛЬ — эффект (slide / carousel-fade) и время каждого фото в миллисекундах (1000–10000); «Tayyor».
const msOk = (v) => /^\d+$/.test(v) && +v >= 1000 && +v <= 10000;
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [mv, setMv] = useState(store.get('myMs') || '');
  const [fade, setFade] = useState(!!store.get('myFade'));
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const v = normCls(mv);
  const led = useIdleLed(canTap && !solved && !v, 0);
  const confirm = () => {
    if (!canTap || !v || solved) return;
    st.current.tries += 1;
    const issue = msOk(v) ? null : /^\d+$/.test(v) && +v >= 100 ? c.range : issueText(wordIssue(v, 'ms', '3000'));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myMs', v); store.set('myFade', fade); put({ done: true });
    log({ screenId: 'w1', type: 'own-carousel', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, ms: +v, fade });
    sayNow(c.ok, 'cheer');
  };
  const good = msOk(v) ? v : null;
  const o = carO({ car: fade ? 'carousel carousel-fade' : 'carousel slide', auto: 'true', ints: [good, good, good], dots: '#' + CAR_ID });
  const field = solved ? <span key="f" className="b1-st">{v}</span>
    : <span key="f" className={'kz-gap b1-slotin b2-field' + (led ? ' kz-gap-led' : '')}><InlineInput value={mv} onChange={(x) => { setMv(x); setMsg(null); }} onEnter={confirm} placeholder={L3('3000', '3000', '3000')} label={c.ask} max={8} /></span>;
  const lines = carLines(pick, o, { field: { key: 'i0', attr: 'data-bs-interval', node: field }, hl: { car: 'is-read' }, foldCtl: true });
  useHlScroll(fade);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b8-pair b8-w1">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm b2-small" />
            <div className="b8-kinds">
              {[['slide', false], ['carousel-fade', true]].map(([k, f]) => (
                <button key={k} type="button" className={'b2-chip is-shape' + (fade === f ? ' is-on' : '')} onClick={() => { if (solved) return; sfx('tap', true); setFade(f); }} disabled={!canTap || solved} data-k={k}>
                  <span translate="no">{k}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="kz-col"><SitePage pick={pick} body={carH(pick, o)} js title={pick(C.site.title)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && !!v} glow={canTap && !!v} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: своего JavaScript нет — классы, атрибуты data-bs-* и одна строка script; карусель ученика.
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const ms = store.get('myMs') || '3000', fade = !!store.get('myFade');
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  useHlScroll(curK);
  const o = carO({ car: fade ? 'carousel carousel-fade' : 'carousel slide', auto: 'true', ints: [ms, ms, ms], btns: BTNS, dots: '#' + CAR_ID });
  const hlk = curK === 'riddle' ? { script: 'is-hl' } : curK === 'item' ? { inner: 'is-hl', i0: 'is-hl', i1: 'is-hl', i2: 'is-hl' } : curK === 'btn' ? { ctl: 'is-hl' } : curK === 'auto' ? { car: 'is-hl', i0: 'is-hl' } : {};
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end b8-end">
          <div className="kz-col"><SitePage pick={pick} body={carH(pick, o)} js title={pick(C.site.title)} /></div>
          <div className="kz-col b1-end-side">
            <KzCode lines={carLines(pick, o, { hl: hlk, script: true, foldCtl: true })} cls="kz-code-sm b2-small" />
            <div className="kz-roles">
              {['item', 'btn', 'auto', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'item' ? '#0FA38E' : k === 'btn' ? '#7952B3' : k === 'auto' ? '#D97706' : '#FA4F28' }}>
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

function lessonBs8Artifact(store) {
  const ms = store.get('myMs');
  if (!ms) return null;
  const fade = !!store.get('myFade');
  const item = (i) => '        <div class="carousel-item' + (i ? '' : ' active') + '" data-bs-interval="' + escH(ms) + '"><img src="slayd' + (i + 1) + '.jpg" class="d-block w-100" alt="Robot"></div>';
  return { type: 'html-page', ms: +ms, fade,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <div id="galereya" class="carousel ' + (fade ? 'carousel-fade' : 'slide') + '" data-bs-autoplay="true">', '      <div class="carousel-inner">', item(0), item(1), item(2), '      </div>',
      '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapKarusel({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs8Artifact(store) })
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
