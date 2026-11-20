// =============================================================================
// ЭКРАНЫ УРОКА 7 «Формы» (20.11.2026). Помощники — bs7-head.jsx, общие куски — bs7-common.jsx.
// Сценарий — docs/scenarij-bootstrap-07-formy.md.
// =============================================================================
const HOOK_PARTS = ['name', 'group', 'agree', 'send'];   // без textarea: на телефоне код и форма помещаются
const NEWL = 'is-new is-read';

// Курсор над вещью внутри страницы (iframe): невидимая метка .b7-aim встаёт поверх вещи, курсор едет к метке.
function useAim(root) {
  const g = useRef(null);
  const find = (sel) => {
    const r = root.current;
    if (!r) return null;
    const fs = r.querySelectorAll('iframe');
    for (let i = 0; i < fs.length; i++) { const d = fs[i].contentDocument; const el = d && d.querySelector(sel); if (el) return { f: fs[i], d, el }; }
    return null;
  };
  const aim = (sel) => {
    const r = root.current, x = find(sel);
    if (!r || !x || !g.current) return null;
    const a = r.getBoundingClientRect(), fr = x.f.getBoundingClientRect(), k = fr.width / (x.f.offsetWidth || 1), b = x.el.getBoundingClientRect();
    Object.assign(g.current.style, { left: Math.round(fr.left - a.left + b.left * k) + 'px', top: Math.round(fr.top - a.top + b.top * k) + 'px', width: Math.round(b.width * k) + 'px', height: Math.round(b.height * k) + 'px' });
    return x;
  };
  return { find, aim, el: <i ref={g} className="b7-aim" aria-hidden="true" /> };
}
// Рамка фокуса у поля (как у браузера при щелчке) — без настоящего фокуса: на телефоне не выскочит клавиатура.
const ring = (el, on) => { if (el) { el.style.outline = on ? 'var(--bs-focus-ring, 3px solid rgba(0,135,254,.35))' : ''; el.style.outlineOffset = on ? '-1px' : ''; } };

// Общий показ: шаги — состояния { parts, o, hl, fold, open, rules, say, ask, pose }.
function FormShow({ p, id, c, states }) {
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
  const askText = solved || demo.done ? c.askDone : (S.ask ? c[S.ask] : c.askStart);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className={'kz-scene b1-pair b7-pair b7-' + id}>
          <div className="kz-col">
            <KzCode lines={formLines(pick, S.parts, S.o, { hl: S.hl, fold: S.fold })} cls="kz-code-sm b2-small" />
            {S.rules ? <CssCard pick={pick} rules={rulesOf(S.rules)} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={formH(pick, S.parts, S.o)} title={pick(C.site.title)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S1. КРЮЧОК — форма записи без классов: каша. «Bootstrap bilan» — аккуратная форма. Загадка.
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
  const o = on ? FORM_FULL : {};
  const hlk = on ? { 'name.l': NEWL, 'name.c': NEWL, 'group.l': NEWL, 'group.c': NEWL, agree: NEWL, 'send.c': NEWL } : {};
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair b7-pair b7-s1">
          <div className="kz-col"><KzCode lines={formLines(pick, HOOK_PARTS, o, { hl: hlk, fold: { agree: true } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={formH(pick, HOOK_PARTS, o)} title={pick(C.site.title)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. FORM-CONTROL и FORM-LABEL (показ): поле «Ism» → поле «Telefon» → подписи.
const S2_PARTS = ['name', 'phone'];
const S2_STATES = [
  { parts: S2_PARTS, o: {} },
  { parts: S2_PARTS, o: { 'name.c': 'form-control' }, hl: { 'name.c': NEWL }, rules: ['form-control'], say: 'sayCtl', ask: 'askCtl' },
  { parts: S2_PARTS, o: { 'name.c': 'form-control', 'phone.c': 'form-control' }, hl: { 'phone.c': NEWL }, rules: ['form-control'], say: 'sayTwo', ask: 'askTwo' },
  { parts: S2_PARTS, o: { 'name.c': 'form-control', 'phone.c': 'form-control', 'name.l': 'form-label', 'phone.l': 'form-label' }, hl: { 'name.l': NEWL, 'phone.l': NEWL }, rules: ['form-label'], say: 'sayLab', ask: 'askLab', pose: 'wonder' }
];
const S2 = ({ p }) => <FormShow p={p} id="s2" c={C.s2} states={S2_STATES} />;

// X1. ОПЫТ — переключатели: form-label, form-control, check, btn-solid. Готово — каждый выключен хотя бы раз.
const X1_PARTS = ['name', 'agree', 'send'];
const X1_SW = [{ k: 'form-label', keys: ['name.l'] }, { k: 'form-control', keys: ['name.c'] }, { k: 'check', keys: ['agree.c'] }, { k: 'btn-solid', keys: ['send.c'] }];
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [seen, setSeen] = useState(solved ? X1_SW.map((s) => s.k) : []);
  const [last, setLast] = useState(null);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, seen.length);
  const tap = (k) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true); setLast(k);
    const was = off.indexOf(k) >= 0;
    setOff(was ? off.filter((x) => x !== k) : off.concat(k));
    const s2 = !was && seen.indexOf(k) < 0 ? seen.concat(k) : seen;
    setSeen(s2);
    const line = c.what[k][was ? 'on' : 'off'];
    if (!ok && s2.length >= X1_SW.length) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(line, c.ok), 'cheer'); say(c.done, 'smile');
      return;
    }
    sayNow(line, was ? 'smile' : 'point');
    if (st.current.tries >= 8 && !ok) lad.bump();
  };
  const o = {};
  X1_SW.forEach((s) => s.keys.forEach((key) => { o[key] = off.indexOf(s.k) >= 0 ? null : FORM_FULL[key]; }));
  o['agree.f'] = 'form-field';
  const sw = X1_SW.find((s) => s.k === last);
  const hlk = {};
  if (sw) sw.keys.forEach((key) => { hlk[key] = 'is-new'; });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} n={Math.min(4, seen.length) + '/4'} />
        <div className="kz-scene b1-pair b7-pair b7-x1">
          <div className="kz-col"><KzCode lines={formLines(pick, X1_PARTS, o, { hl: hlk })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={formH(pick, X1_PARTS, o)} title={pick(C.site.title)} /></div>
        </div>
        <div className="b2-pult"><div className="b2-pult-row b7-sw">
          {X1_SW.map((s) => {
            const isOn = off.indexOf(s.k) < 0;
            return (
              <button key={s.k} type="button" className={'b2-chip is-shape b7-toggle' + (isOn ? ' is-on' : '') + (seen.indexOf(s.k) >= 0 ? ' is-seen' : '')} onClick={() => tap(s.k)} disabled={!canTap} data-k={s.k} aria-pressed={isOn}>
                <i className="b7-tg" aria-hidden="true" /><span translate="no">{s.k}</span><Led on={led && !ok && seen.indexOf(s.k) < 0 && s.k === X1_SW.map((x) => x.k).find((x) => seen.indexOf(x) < 0)} />
              </button>
            );
          })}
        </div></div>
      </Sheet>
    </StageB>
  );
}

// G1. ПРИМЕР С САЙТА (показ «как на видео»): меню → Forms → Form control → копирование Example → вставка в форму;
// «Email address» → своя подпись, «name@example.com» → свой placeholder.
const G1_LAB = (t) => '<label for="exampleFormControlInput" class="form-label mb-2">' + t + '</label>';
const G1_INP = (ph) => '<input type="email" class="form-control" id="exampleFormControlInput" placeholder="' + ph + '">';
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Form control' : 'Grid', solved ? 'forms' : 'layout');
  const [scroll, setScroll] = useState(solved ? 'fcexample' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 6 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 выделена подпись; 5 своя подпись; 6 свой placeholder
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'forms', 'Form control', false, () => { setN(2); setScroll('sec:fcexample'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('fcexample'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="fcexample"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('fcexample'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayPaste, pose: 'wonder' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 900 },
      { act: () => { sfx('ok', true); setN(5); }, wait: 700 },
      { say: [{ text: c.sayLab, pose: 'point' }] },
      { act: () => { sfx('pop', true); setN(5.5); }, wait: 900 },
      { act: () => { sfx('ok', true); setN(6); }, wait: 700 },
      { say: [{ text: c.sayPh, pose: 'point' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askLab, c.askLab, c.askPh][Math.floor(n)];
  const help = useShowHelp(c.help);
  const lab = n >= 5 ? pick(C.site.email) : 'Email address';
  const ph = n >= 6 ? 'parent@mail.uz' : 'name@example.com';
  const name = formLines(pick, ['name'], FORM_FULL, { noForm: true }).map((l) => Object.assign({}, l, { d: 1 }));
  const mid = n >= 3 ? [
    hl('ga' + (n >= 5 ? 1 : 0), 1, G1_LAB(lab), { cls: n === 3 || n === 5 ? 'is-new' : n === 4 ? 'is-hl' : '' }, n === 4 ? { word: 'Email address' } : null),
    hl('gb' + (n >= 6 ? 1 : 0), 1, G1_INP(ph), { cls: n === 3 || n === 6 ? 'is-new' : n === 5.5 ? 'is-hl' : '' }, n === 5.5 ? { word: 'name@example.com' } : null)
  ] : [quietSlot('slot', 1, pick, !!copied)];
  const send = formLines(pick, ['send'], FORM_FULL, { noForm: true }).map((l) => Object.assign({}, l, { d: 1 }));
  const lines = [hl('fo', 0, '<form>', { cls: 'b1-edge' })].concat(name, mid, send, [hl('fc', 0, '</form>', { cls: 'b1-edge' })]);
  const body = '<form>' + formParts(pick, 'name').map((r) => rowHtml(r, FORM_FULL[r.key])).join('')
    + (n >= 3 ? G1_LAB(escH(lab)) + G1_INP(ph) : '') + rowHtml(formParts(pick, 'send')[0], FORM_FULL['send.c']) + '</form>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} title={pick(C.site.title)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// Задание «впиши class» по форме: parts, o — что уже есть, key — где поле, want — ответ, goal — образец (вся форма).
const fillRound = (pick, { parts, o, key, want, kind, ask, hints, why, ph, no, goal, gz }) => ({
  kind, want, ask, hints, why, no, gz: gz || 0.5, ph: ph || L3('…', '…', '…'),
  line: (f) => formLines(pick, parts, o, { field: { key, node: f } }),
  goal: goal === false ? null : formH(pick, parts, withCls(o, { [key]: [].concat(want)[0] })),
  body: (v) => formH(pick, parts, withCls(o, { [key]: v || null }))
});

// T1 — по образцу: form-control у поля, form-label у подписи, form-control у textarea.
function T1({ p }) {
  const pick = usePick();
  const c = C.t1;
  const rounds = [
    fillRound(pick, { parts: ['name', 'phone'], o: without(FORM_FULL, ['phone.c']), key: 'phone.c', want: 'form-control', kind: 'control', ask: c.ask1, hints: c.hints1, why: c.why1, gz: 0.4 }),
    fillRound(pick, { parts: ['name', 'phone'], o: without(FORM_FULL, ['phone.l']), key: 'phone.l', want: 'form-label', kind: 'label', ask: c.ask2, hints: c.hints2, why: c.why2, gz: 0.4 }),
    fillRound(pick, { parts: ['name', 'note'], o: without(FORM_FULL, ['note.c']), key: 'note.c', want: 'form-control', kind: 'control', ask: c.ask3, hints: c.hints3, why: c.why3, gz: 0.4 })
  ];
  return <FillRounds p={p} id="t1" c={c} rounds={rounds} type="form-control" />;
}

// G2. СПИСОК (показ «как на видео»): form-select из старого урока — список не меняется; сайт: Form control → Select,
// выноска «Heads up!» → form-control — список красивый.
function G2({ p }) {
  const pick = usePick();
  const c = C.g2;
  const [rec, put] = useRec('g2');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Form control' : 'Checkbox', 'forms');
  const [scroll, setScroll] = useState(solved ? 'sec:fcselect' : null);
  const [lit, setLit] = useState(solved ? 'callout' : null);
  const [n, setN] = useState(solved ? 3 : 0);   // 1 меню; 2 выноска; 3 form-control
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'think' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'forms', 'Form control', true, () => { setN(2); setScroll('sec:fcselect'); }), [
      { act: () => { setLit('callout'); M.go('[data-x="callout"]', 0.3, 0.5); }, wait: M.slow },
      { say: [{ text: c.sayCallout, pose: 'wonder' }] },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayApply, pose: 'point' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askApply][n];
  const help = useShowHelp(c.help);
  const o = withCls(FORM_FULL, { 'group.c': n >= 3 ? 'form-control' : 'form-select' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} hl={lit} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={formLines(pick, ['group'], o, { hl: { 'group.c': n >= 3 ? NEWL : 'is-hl' } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={formH(pick, ['group'], o)} title={pick(C.site.title)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T2 — список «Guruh» и поле даты: тоже form-control. Сайт — раздел Select с выноской.
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const rounds = [
    fillRound(pick, { parts: ['group'], o: without(FORM_FULL, ['group.c']), key: 'group.c', want: 'form-control', kind: 'control', ask: c.ask1, hints: c.hints1, why: c.why1, goal: false }),
    fillRound(pick, { parts: ['date'], o: without(FORM_FULL, ['date.c']), key: 'date.c', want: 'form-control', kind: 'control', ask: c.ask2, hints: c.hints2, why: c.why2, goal: false })
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} docs={{ page: 'Form control', only: 'fcselect' }} type="form-select" />;
}

// S8. ГАЛОЧКА (показ): check → form-field (подпись рядом) → radio → switch.
const S8_STATES = [
  { parts: ['agree', 'send'], o: { 'send.c': FORM_FULL['send.c'] } },
  { parts: ['agree', 'send'], o: { 'send.c': FORM_FULL['send.c'], 'agree.c': 'check' }, hl: { 'agree.c': NEWL }, rules: ['check'], say: 'sayCheck', ask: 'askCheck' },
  { parts: ['agree', 'send'], o: { 'send.c': FORM_FULL['send.c'], 'agree.c': 'check', 'agree.f': 'form-field' }, hl: { 'agree.f': NEWL }, rules: ['form-field'], say: 'sayField', ask: 'askField' },
  { parts: ['time', 'send'], o: FORM_FULL, hl: { 'time.c': NEWL }, rules: ['radio'], say: 'sayRadio', ask: 'askRadio' },
  { parts: ['news', 'send'], o: FORM_FULL, hl: { 'news.c': NEWL }, rules: ['switch'], say: 'saySwitch', ask: 'askSwitch', pose: 'wonder' }
];
const S8 = ({ p }) => <FormShow p={p} id="s8" c={C.s8} states={S8_STATES} />;

// G3. ПЕРЕКЛЮЧАТЕЛЬ С САЙТА (показ «как на видео»): Forms → Switch → копирование «With form field» → вставка;
// «Default switch» → своя подпись.
const G3_ROWS = (t) => ['<div class="form-field">', '  <div class="switch">', '    <input type="checkbox" value="" id="switchMdLabel" role="switch" switch>', '  </div>', '  <label for="switchMdLabel">' + t + '</label>', '</div>'];
function G3({ p }) {
  const pick = usePick();
  const c = C.g3;
  const [rec, put] = useRec('g3');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Switch' : 'Form control', 'forms');
  const [scroll, setScroll] = useState(solved ? 'sfield' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 5 : 0);   // 1 меню; 2 страница; 3 вставлено; 4 выделено; 5 своя подпись
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'forms', 'Switch', true, () => { setN(2); setScroll('sec:sfield'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('sfield'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="sfield"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('sfield'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayPaste, pose: 'wonder' }] },
      { act: () => { sfx('pop', true); setN(4); }, wait: 900 },
      { act: () => { sfx('ok', true); setN(5); }, wait: 700 },
      { say: [{ text: c.sayLab, pose: 'point' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askLab, c.askLab][n];
  const help = useShowHelp(c.help);
  const lab = n >= 5 ? pick(C.site.news) : 'Default switch';
  const rows = G3_ROWS(lab);
  const mid = n >= 3 ? rows.map((s, j) => hl('w' + j + (j === 4 && n >= 5 ? 'x' : ''), 1 + (s.match(/^ */)[0].length / 2), s.trim(),
    { cls: n === 3 || (n === 5 && j === 4) ? 'is-new' : n === 4 && j === 4 ? 'is-hl' : '' }, n === 4 && j === 4 ? { word: 'Default switch' } : null)) : [quietSlot('slot', 1, pick, !!copied)];
  const agree = formLines(pick, ['agree'], FORM_FULL, { noForm: true, fold: { agree: true } }).map((l) => Object.assign({}, l, { d: 1 }));
  const send = formLines(pick, ['send'], FORM_FULL, { noForm: true }).map((l) => Object.assign({}, l, { d: 1 }));
  const lines = [hl('fo', 0, '<form>', { cls: 'b1-edge' })].concat(agree, mid, send, [hl('fc', 0, '</form>', { cls: 'b1-edge' })]);
  const body = '<form>' + formParts(pick, 'agree').map((r) => rowHtml(r, r.key ? FORM_FULL[r.key] : null)).join('')
    + (n >= 3 ? rows.join('').replace(/>\s+</g, '><').replace(lab, escH(lab)) : '') + rowHtml(formParts(pick, 'send')[0], FORM_FULL['send.c']) + '</form>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} title={pick(C.site.title)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T3 — галочка, кружок, переключатель: check, radio, switch.
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const rounds = [
    fillRound(pick, { parts: ['agree'], o: without(FORM_FULL, ['agree.c']), key: 'agree.c', want: 'check', kind: 'check', ask: c.ask1, hints: c.hints1, why: c.why1, gz: 0.8 }),
    fillRound(pick, { parts: ['time'], o: without(FORM_FULL, ['time.c']), key: 'time.c', want: 'radio', kind: 'radio', ask: c.ask2, hints: c.hints2, why: c.why2, gz: 0.8 }),
    fillRound(pick, { parts: ['news'], o: without(FORM_FULL, ['news.c']), key: 'news.c', want: 'switch', kind: 'switch', ask: c.ask3, hints: c.hints3, why: c.why3, gz: 0.8 })
  ];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} type="check-radio-switch" />;
}

// S11. КАК РАБОТАЕТ ФОРМА (показ): курсор пишет имя, выбирает группу, ставит галочку и жмёт «Yuborish» — e'lon «Rahmat!».
const LIVE_PARTS = ['name', 'group', 'agree', 'send'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const A = useAim(root);
  const api = useRef(null);
  const was = useRef(solved).current;   // страница не перезагружается после показа: написанное остаётся
  const [n, setN] = useState(solved ? 4 : 0);   // 1 имя; 2 группа; 3 галочка; 4 отправлено
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const word = pick(C.site.demoName);
  const typeSteps = word.split('').map((ch, i) => ({ act: () => { const x = A.find('#ism'); if (x) { x.el.value = word.slice(0, i + 1); sfx('tap', true); } }, wait: 220 }));
  const at = (sel, hand) => ({ act: () => { if (A.aim(sel)) M.go('.b7-aim', 0.5, 0.5, { hand }); }, wait: M.slow });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    at('#ism'),
    { act: () => { M.click(); const x = A.find('#ism'); if (x) ring(x.el, true); setN(1); }, wait: 400 }
  ].concat(typeSteps, [
    { act: () => { const x = A.find('#ism'); if (x) ring(x.el, false); }, wait: 200 },
    { say: [{ text: c.sayName, pose: 'point' }] },
    at('#guruh'),
    { act: () => { M.click(); const x = A.find('#guruh'); if (x) { ring(x.el, true); x.el.selectedIndex = 1; } setN(2); }, wait: 700 },
    { act: () => { const x = A.find('#guruh'); if (x) ring(x.el, false); }, wait: 200 },
    { say: [{ text: c.sayGroup, pose: 'point' }] },
    at('#rozi', true),
    { act: () => { M.click(); const x = A.find('#rozi'); if (x) x.el.checked = true; setN(3); }, wait: 600 },
    { say: [{ text: c.sayAgree, pose: 'point' }] },
    at('[data-v="send"]', true),
    { act: () => {
      M.click();
      const x = A.find('form');
      if (x && !x.d.querySelector('.alert')) { x.el.insertAdjacentHTML('beforebegin', thanksH(pick)); if (api.current) api.current.fit(); }
      sfx('win', true); setN(4);
    }, wait: 700 },
    { act: () => M.hide(), wait: 200 },
    { say: [{ text: c.saySent, pose: 'cheer' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askName, c.askGroup, c.askAgree, c.askSent][n];
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className="kz-scene b1-pair b7-pair b7-live ms-root">
          <div className="kz-col"><KzCode lines={formLines(pick, LIVE_PARTS, FORM_FULL, { fold: { agree: true } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={formH(pick, LIVE_PARTS, FORM_FULL, was ? thanksH(pick) : '')} title={pick(C.site.title)} api={api} /></div>
          {A.el}
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// X2. СВОЁ ДЕЙСТВИЕ — ученик сам заполняет форму на странице и нажимает «Yuborish». Нет имени или галочки — Коди
// говорит, чего не хватает. Готово — e'lon «Rahmat!».
function X2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x2;
  const [rec, put] = useRec('x2');
  const solved = !!(rec && rec.done);
  const api = useRef(null);
  const was = useRef(solved).current;   // после отправки страница не перезагружается: имя и галочка ученика остаются
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const live = useRef({});
  live.current = { canTap, solved };
  const onPick = (v, d) => {
    if (v !== 'send' || !d) return;
    if (!live.current.canTap || live.current.solved) return;
    st.current.tries += 1;
    const nm = (d.querySelector('#ism') || {}).value || '';
    const ok = !!(d.querySelector('#rozi') || {}).checked;
    const issue = !nm.trim() ? c.noName : !ok ? c.noAgree : null;
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    const f = d.querySelector('form');
    if (f && !d.querySelector('.alert')) { f.insertAdjacentHTML('beforebegin', thanksH(pick)); if (api.current) api.current.fit(); }
    sfx('win', true); setMsg(null); put({ done: true });
    log({ screenId: 'x2', type: 'fill-form', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b7-pair b7-x2">
          <div className="kz-col"><KzCode lines={formLines(pick, LIVE_PARTS, FORM_FULL, { fold: { agree: true } })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={formH(pick, LIVE_PARTS, FORM_FULL, was ? thanksH(pick) : '')} title={pick(C.site.title)} onPick={onPick} api={api} cls="b7-fill" /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// T4. СБОРКА ПО ПОРЯДКУ: form → подпись Ism → поле → подпись Guruh → список → кнопка → закрыть.
const T4_ORDER = ['form', 'lab1', 'inp1', 'lab2', 'sel', 'btn', 'formc'];
const T4_SHUFFLE = ['sel', 'lab1', 'formc', 'btn', 'form', 'inp1', 'lab2'];
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
  const rowsN = formParts(pick, 'name'), rowsG = formParts(pick, 'group'), rowB = formParts(pick, 'send')[0];
  const R = { lab1: rowsN[0], inp1: rowsN[1], lab2: rowsG[0], sel: rowsG[1], btn: rowB };
  const src = (k) => (k === 'form' ? '<form>' : k === 'formc' ? '</form>' : rowSrc(R[k], FORM_FULL[R[k].key]));
  const html = (k) => (k === 'form' ? '<form>' : k === 'formc' ? '</form>' : rowHtml(R[k], FORM_FULL[R[k].key]));
  const label = { form: '<form>', lab1: 'label · ' + pick(C.site.name), inp1: 'input · form-control', lab2: 'label · ' + pick(C.site.group), sel: 'select · form-control', btn: 'button · ' + pick(C.site.send), formc: '</form>' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T4_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = c.msgs[want]; const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === T4_ORDER.length - 1 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T4_ORDER.length) {
      put({ done: true });
      log({ screenId: 't4', type: 'order-form', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  const depth = (k) => (k === 'form' || k === 'formc' ? 0 : 1);
  const lines = done.map((k, j) => hl('d' + k, depth(k), src(k), { cls: j === done.length - 1 ? 'is-new' : '' })).concat(fin ? [] : [quietSlot('slot', done.length ? depth(T4_ORDER[done.length]) : 0, pick, true)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/' + T4_ORDER.length} />
        <div className="kz-scene b1-pair b7-pair b7-t4">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={done.map(html).join('')} title={pick(C.site.title)} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T4_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span><Led on={(lad.lv >= 3 && k === T4_ORDER[done.length]) || (led && done.length === 0 && k === 'form')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// Q1. КАРТИНКА → CLASS (4 раунда): поле, список, галочка, кнопка. Окна — честный результат.
const Q1_ROUNDS = [
  { opts: ['form-control', 'form-input', 'input', 'form-text'], a: 0, make: (pick, x) => formH(pick, ['name'], { 'name.l': 'form-label', 'name.c': x }) },
  { opts: ['form-select', 'form-control', 'select', 'form-option'], a: 1, make: (pick, x) => formH(pick, ['group'], { 'group.l': 'form-label', 'group.c': x }) },
  { opts: ['form-check', 'checkbox', 'check', 'check-input'], a: 2, make: (pick, x) => formH(pick, ['agree'], { 'agree.f': 'form-field', 'agree.c': x }) },
  { opts: ['btn-primary', 'button', 'btn-form', 'btn-solid theme-primary'], a: 3, make: (pick, x) => formH(pick, ['send'], { 'send.c': x }) }
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
        <div className="kz-scene b1-pair b2-q1 b3-q1 b7-q1" key={'r' + R.ii}>
          <div className="kz-col"><Br title={pick(UI.need)} short cls="b2-q1page b3-goalwin"><BsFrame body={RR.make(pick, right)} bs dep={'g' + R.ii} /></Br></div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={RR.make(pick, res)} bs dep={res} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
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

// T6. ПОЧЕМУ НЕ РАБОТАЕТ: form-select (версия 5); class на подписи, а не на поле; опечатка form-contol.
const T6_ROUNDS = [
  { k: 'old', parts: ['name', 'group'], o: withCls(FORM_FULL, { 'group.c': 'form-select' }), hl: { 'group.c': 'is-hl' } },
  { k: 'tag', parts: ['name'], o: { 'name.l': 'form-control', 'name.c': null }, hl: { 'name.l': 'is-hl', 'name.c': 'is-hl' } },
  { k: 'typo', parts: ['name', 'phone'], o: withCls(FORM_FULL, { 'phone.c': 'form-contol' }), hl: { 'phone.c': 'is-hl' } }
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
  const keys = ['old', 'tag', 'typo'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code b7-pair b7-t6" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={formLines(pick, RR.parts, RR.o, { hl: RR.hl })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={formH(pick, RR.parts, RR.o)} title={pick(C.site.title)} /></div>
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

// W1. СВОЙ ВОПРОС В ФОРМЕ — текст подписи, вид поля (текст, дата, число, большое поле), class поля; «Tayyor».
const W1_KINDS = [{ k: 'text', tag: 'input', attrs: [['type', 'text']] }, { k: 'date', tag: 'input', attrs: [['type', 'date']] }, { k: 'number', tag: 'input', attrs: [['type', 'number']] }, { k: 'textarea', tag: 'textarea', attrs: [['rows', '2']], close: true }];
const ownRow = (kind) => { const K = W1_KINDS.find((x) => x.k === kind) || W1_KINDS[0]; return { tag: K.tag, attrs: K.attrs.concat([['id', 'savol']]), text: K.close ? '' : null, close: !!K.close }; };
const ownH = (pick, lab, kind, cls) => '<label for="savol" class="form-label">' + escH(lab) + '</label>' + rowHtml(ownRow(kind), cls);
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [lab, setLab] = useState(store.get('myLabel') || '');
  const [cv, setCv] = useState(store.get('myCls') || '');
  const [kind, setKind] = useState(store.get('myKind') || 'text');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const v = normCls(cv);
  const t = String(lab || '').trim();
  const led = useIdleLed(canTap && !solved && (!t || !v), t ? 1 : 0);
  const confirm = () => {
    if (!canTap || solved) return;
    st.current.tries += 1;
    const issue = !t ? c.noLabel : /[<>]/.test(t) ? UI.noTags : issueText(wordIssue(v, 'control', 'form-control'));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myLabel', t); store.set('myCls', v); store.set('myKind', kind); put({ done: true });
    log({ screenId: 'w1', type: 'own-field', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, kind });
    sayNow(c.ok, 'cheer');
  };
  const f1 = solved ? <span key="f1" className="b1-tx">{t}</span>
    : <span key="f1" className={'kz-gap b1-slotin b2-field b7-labin' + (led && !t ? ' kz-gap-led' : '')}><InlineInput value={lab} onChange={(x) => { setLab(x); setMsg(null); }} onEnter={confirm} placeholder={c.labPh} label={c.askLab} max={28} /></span>;
  const f2 = solved ? <span key="f2" className="b1-st">{v}</span>
    : <span key="f2" className={'kz-gap b1-slotin b2-field' + (led && t && !v ? ' kz-gap-led' : '')}><InlineInput value={cv} onChange={(x) => { setCv(x); setMsg(null); }} onEnter={confirm} placeholder={L3('form-…', 'form-…', 'form-…')} label={c.askCls} max={20} /></span>;
  const R = ownRow(kind);
  const labLine = { k: 'ol', d: 1, cls: 'b1-line is-hl', parts: [pn('a', '<'), <span key="b" className="b1-tg">label</span>, <React.Fragment key="s">{sp()}</React.Fragment>, <span key="c" className="b1-at">for</span>, pn('e', '='), <span key="v" className="b1-st">"savol"</span>,
    <React.Fragment key="s2">{sp()}</React.Fragment>, <span key="c2" className="b1-at">class</span>, pn('e2', '='), <span key="v2" className="b1-st">"form-label"</span>, pn('g', '>'), f1, pn('h', '</'), <span key="i" className="b1-tg">label</span>, pn('j', '>')] };
  const fLine = { k: 'of' + kind, d: 1, cls: 'b1-line is-hl', parts: clsParts({ tag: R.tag, attrs: R.attrs, field: f2, text: R.close ? '' : null, close: R.close }) };
  const lines = [hl('fo', 0, '<form>', { cls: 'b1-edge' })].concat([labLine, fLine],
    formLines(pick, ['send'], FORM_FULL, { noForm: true }).map((l) => Object.assign({}, l, { d: 1 })), [hl('fc', 0, '</form>', { cls: 'b1-edge' })]);
  const body = '<form>' + ownH(pick, t || '…', kind, v || null) + rowHtml(formParts(pick, 'send')[0], FORM_FULL['send.c']) + '</form>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b7-pair b7-w1">
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm b2-small" />
            <div className="b7-kinds">
              {W1_KINDS.map((K) => (
                <button key={K.k} type="button" className={'b2-chip is-shape' + (kind === K.k ? ' is-on' : '')} onClick={() => { if (solved) return; sfx('tap', true); setKind(K.k); }} disabled={!canTap || solved} data-kind={K.k}>
                  <span>{pick(c.kinds[K.k])}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="kz-col"><SitePage pick={pick} body={body} title={pick(C.site.title)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && !!t && !!v} glow={canTap && !!t && !!v} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: одно form-control у трёх видов полей (строки загораются по очереди), потом форма ученика.
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const lab = store.get('myLabel'), kind = store.get('myKind') || 'text', cls = store.get('myCls') || 'form-control';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const [vi, setVi] = useState(0);
  useEffect(() => { if (curK !== 'riddle') return undefined; const t = setInterval(() => setVi((x) => (x + 1) % 3), 1300); return () => clearInterval(t); }, [curK]);
  const riddle = curK === 'riddle';
  const RP = ['name', 'group', 'note'];
  const hlk = riddle ? { [RP[vi] + '.c']: 'is-hl' } : {};
  const body = riddle ? formH(pick, RP, FORM_FULL)
    : '<form>' + ['name', 'group'].map((pp) => formParts(pick, pp).map((r) => rowHtml(r, FORM_FULL[r.key])).join('')).join('') + (lab ? ownH(pick, lab, kind, cls) : '')
      + formParts(pick, 'agree').concat(formParts(pick, 'send')).map((r) => rowHtml(r, r.key ? FORM_FULL[r.key] : null)).join('') + '</form>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col"><SitePage pick={pick} body={body} title={pick(C.site.title)} /></div>
          <div className="kz-col b1-end-side">
            <KzCode lines={formLines(pick, RP, FORM_FULL, { hl: hlk, noForm: true })} cls="kz-code-sm b2-small" />
            <div className="kz-roles">
              {['ctl', 'lab', 'chk', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'ctl' ? '#0FA38E' : k === 'lab' ? '#7952B3' : k === 'chk' ? '#D97706' : '#FA4F28' }}>
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
  { id: 't1', code: 'LEVEL-1', Comp: T1 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 'g3', code: 'SHOW', Comp: G3 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 'x2', code: 'LEVEL-2', Comp: X2 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs7Artifact(store) {
  const lab = store.get('myLabel');
  if (!lab) return null;
  const kind = store.get('myKind') || 'text';
  const field = kind === 'textarea' ? '<textarea id="savol" rows="2" class="form-control"></textarea>' : '<input type="' + kind + '" id="savol" class="form-control">';
  return { type: 'html-page', label: lab, kind,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>', '    <form>',
      '      <label for="ism" class="form-label">Ism</label>', '      <input type="text" id="ism" class="form-control">',
      '      <label for="savol" class="form-label">' + escH(lab) + '</label>', '      ' + field,
      '      <div class="form-field">', '        <input type="checkbox" id="rozi" class="check">', '        <label for="rozi">Qoidalarga roziman</label>', '      </div>',
      '      <button type="submit" class="btn-solid theme-primary">Yuborish</button>', '    </form>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapFormy({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs7Artifact(store) })
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
