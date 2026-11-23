// =============================================================================
// ЭКРАНЫ УРОКА 5 «Карточки» (20.11.2026). Помощники — bs5-head.jsx, общие куски из урока 3 — bs5-common.jsx.
// Сценарий — docs/scenarij-bootstrap-05-kartochki.md.
// =============================================================================

// S1. КРЮЧОК — фото, имя, описание и кнопка кучей. «Bootstrap bilan» — section.card, card-img-top, card-body. Загадка.
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
  const o = on ? { card: 'card', img: 'card-img-top', body: 'card-body' } : { body: null };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={cardLines(pick, o, on ? { card: 'is-new is-read', img: 'is-new is-read', body: 'is-new is-read' } : {})} cls="kz-code-sm" /></div>
          <div className="kz-col"><SitePage pick={pick} body={cardH(pick, o)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. ИЗ ЧЕГО КАРТОЧКА (показ) — card (рамка) → card-img-top (фото сверху) → card-body (отступы, колонка с gap).
const S2_O = [{ body: null }, { card: 'card', body: null }, { card: 'card', img: 'card-img-top', body: null }, { card: 'card', img: 'card-img-top', body: 'card-body' }];
const S2_K = [null, 'card', 'card-img-top', 'card-body'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayCard, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } }, { say: [{ text: c.sayImg, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayBody, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askCard, c.askImg, c.askBody][n];
  const help = useShowHelp(c.help);
  const o = S2_O[n];
  const k = S2_K[n];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={cardLines(pick, o, k ? { [k === 'card' ? 'card' : k === 'card-img-top' ? 'img' : 'body']: 'is-new is-read' } : {})} cls="kz-code-sm b2-small" />
            {k ? <CssCard pick={pick} rules={[CARD_RULES[k]]} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={cardH(pick, o)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// X1. ОПЫТ — переключатели card, card-img-top, card-body и card-title/card-text: последние ничего не меняют (имена).
const X1_SW = ['card', 'card-img-top', 'card-body', 'card-title'];
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState({ card: true, 'card-img-top': true, 'card-body': true, 'card-title': true });
  const [seen, setSeen] = useState(solved ? X1_SW : []);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, seen.length);
  const flip = (k) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true);
    const nv = !on[k];
    setOn(Object.assign({}, on, { [k]: nv }));
    const s2 = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(s2);
    if (!ok && s2.length >= 4) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.what[k], c.ok), 'cheer'); say(c.done, 'smile');
      return;
    }
    if (!ok) sayNow(nv ? c.back : c.what[k], 'point');
    if (st.current.tries >= 7 && !ok) lad.bump();
  };
  const o = { card: on.card ? 'card' : null, img: on['card-img-top'] ? 'card-img-top' : null, body: on['card-body'] ? 'card-body' : null, title: on['card-title'] ? 'card-title' : null, text: on['card-title'] ? 'card-text' : null };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} />
        <div className="kz-scene b1-pair b5-x1">
          <div className="kz-col"><KzCode lines={cardLines(pick, o)} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={cardH(pick, o)} /></div>
        </div>
        <div className="kz-row b1-sws b5-sws">
          {X1_SW.map((k) => (
            <button key={k} type="button" className={'b1-sw' + (on[k] ? ' is-on' : '')} onClick={() => flip(k)} disabled={!canTap} aria-pressed={on[k] ? 'true' : 'false'} data-sw={k}>
              <i aria-hidden="true" /><span translate="no">{k === 'card-title' ? 'card-title / card-text' : k}</span><Led on={led && !ok && seen.indexOf(k) < 0 && k === X1_SW.find((x) => seen.indexOf(x) < 0)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// G1. ПРИМЕР С САЙТА (показ «как на видео») — меню (☰) → Components → Card → значок копирования → пример в body;
// картинка сломана: в примере src="...".
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Card' : 'Gap', solved ? 'comp' : 'util');
  const [scroll, setScroll] = useState(solved ? 'example' : null);
  const [copied, setCopied] = useState(null);
  const [n, setN] = useState(solved ? 3 : 0);
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Card', false, () => { setN(2); setScroll('sec:example'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('example'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="example"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('example'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayPaste, pose: 'think' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste][n];
  const help = useShowHelp(c.help);
  const lines = n >= 3 ? CARD_EX.map((l, j) => hl('e' + j, 1 + (l.length - l.trimStart().length) / 2, l.trim(), { cls: 'is-new' + (j === 1 ? ' is-read' : '') + (j === 4 ? ' b2-cut' : '') })) : [quietSlot('slot', 1, pick, !!copied)];
  const body = n >= 3 ? CARD_EX.join('') : '';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={[hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(lines, [hl('bc', 0, '</body>', { cls: 'b1-edge' })])} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// S5. НАСТРОЙКА (показ) — src="..." → robot1.jpg (фото пришло) → своё имя → своё описание → кнопка theme-success.
const S5_STEPS = [
  { src: '...', name: 'Card title', desc: 'Some quick example text…', btn: 'theme-primary', k: null },
  { src: 'robot1.jpg', name: 'Card title', desc: 'Some quick example text…', btn: 'theme-primary', k: 'img' },
  { src: 'robot1.jpg', name: null, desc: 'Some quick example text…', btn: 'theme-primary', k: 'title' },
  { src: 'robot1.jpg', name: null, desc: null, btn: 'theme-primary', k: 'text' },
  { src: 'robot1.jpg', name: null, desc: null, btn: 'theme-success', k: 'btn' }
];
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 4 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.saySrc, pose: 'wonder' }] },
    { act: () => { sfx('pop', true); setN(2); }, wait: 900 },
    { act: () => { sfx('pop', true); setN(3); } }, { say: [{ text: c.sayText, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(4); } }, { say: [{ text: c.sayBtn, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askSrc, c.askText, c.askText, c.askBtn][n];
  const help = useShowHelp(c.help);
  const S = S5_STEPS[n];
  const o = Object.assign({}, FULL, { src: S.src, name: S.name, desc: S.desc, btn: S.btn });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={cardLines(pick, o, S.k ? { [S.k]: 'is-new is-read' } : {})} cls="kz-code-sm b2-small" />
            <FilesBar pick={pick} lit={n >= 1 ? 'robot1.jpg' : null} />
          </div>
          <div className="kz-col"><SitePage pick={pick} body={cardH(pick, o)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// T1. САМ — найти Card в меню, значок копирования у примера, пустое место в body.
function T1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t1;
  const [rec, put] = useRec('t1');
  const solved = !!(rec && rec.done);
  const D = useDocsNav(solved ? 'Card' : 'Install', solved ? 'comp' : 'start');
  const [clip, setClip] = useState(solved ? 'example' : null);
  const [pasted, setPasted] = useState(solved);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!pasted);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || pasted, spoken);
  const lv = lad.lv;
  const led = useIdleLed(canTap && !pasted, (D.page === 'Card' ? 1 : 0) + (clip ? 2 : 0));
  const miss = (m) => { st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); };
  const nav = (it) => {
    if (!canTap || pasted) return;
    D.set.setPage(it); D.set.setMenuView(false);
    if (it !== 'Card') { miss(fillL(c.msgs.wrongPage, { w: it })); return; }
    sfx('ok', true); setMsg(null);
  };
  const copy = (k) => {
    if (!canTap || pasted) return;
    st.current.tries += 1;
    if (k !== 'example') { miss(c.msgs.wrongBlock); return; }
    sfx('pop', true); setClip(k); setMsg(c.copied);
  };
  const paste = () => {
    if (!canTap || pasted) return;
    if (!clip) { miss(c.msgs.noClip); return; }
    sfx('win', true); setPasted(true); setMsg(null); put({ done: true });
    log({ screenId: 't1', type: 'find-copy', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const onCard = D.page === 'Card';
  const lit = pasted ? null : !onCard ? (lv >= 2 ? (D.open === 'comp' ? 'item:Card' : 'grp:comp') : null) : (!clip && (led || lv >= 2) ? 'example' : null);
  const lines = pasted ? CARD_EX.map((l, j) => hl('e' + j, 1 + (l.length - l.trimStart().length) / 2, l.trim(), { cls: 'is-new' + (j === 4 ? ' b2-cut' : '') })) : [slotLine('slot', 1, pick, paste, !!clip && (led || lv >= 3), !canTap)];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={pasted ? c.ok : onCard ? c.ask : c.askFind} hint={pasted ? null : (msg || hintAt(lv, c.hints))} err={!!msg && msg !== c.copied} />
        <div className={docsPhoneCls({ clip: !!clip, nav: !clip, done: pasted })}>
          {!pasted ? <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} onOpen={(x) => canTap && D.set.setOpen(x)} onNav={nav} navOff={!canTap} onCopy={copy} copied={clip} copyOff={!canTap || !onCard} lit={lit} menuView={D.menuView} onMenu={() => D.set.setMenuView((x) => !x)} scrollTo={onCard ? 'example' : null} scrollKey={D.page} /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={[hl('bo', 0, '<body>', { cls: 'b1-edge' })].concat(lines, [hl('bc', 0, '</body>', { cls: 'b1-edge' })])} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={pasted ? CARD_EX.join('') : ''} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Строка карточки с полем: в src или в class кнопки / секции.
const srcLine = (o) => (f) => [hl('s', 0, '<section class="' + (o.card || 'card') + '" style="' + CARD_W + '">'),
  { k: 'i', d: 1, cls: 'b1-line is-hl', parts: [pn('a', '<'), <span key="b" className="b1-tg">img</span>, <React.Fragment key="s0">{sp()}</React.Fragment>, <span key="c" className="b1-at">src</span>, pn('d', '='), <span key="q1" className="b1-st">"</span>, f, <span key="q2" className="b1-st">"</span>,
    <React.Fragment key="s1">{sp()}</React.Fragment>, <span key="e" className="b1-at">class</span>, pn('f', '='), <span key="g" className="b1-st">"card-img-top"</span>, pn('h', '>')] },
  hl('b', 1, '<div class="card-body">', { cls: 'b2-cut' }), hl('t', 2, '<h4 class="card-title">…</h4>', { cls: 'b2-cut' }), hl('bc', 1, '</div>'), hl('sc', 0, '</section>')];
const btnLine5 = (pick) => (f) => [hl('b', 1, '<div class="card-body">', { cls: 'b2-cut' }), hl('t', 2, '<h4 class="card-title">' + pick(C.site.name2) + '</h4>', { cls: 'b2-cut' }),
  { k: 'a', d: 2, cls: 'b1-line is-hl', parts: clsParts({ tag: 'a', attrs: [['href', '#']], before: 'btn-solid', field: f, text: pick(C.site.more), close: true }) }, hl('bc', 1, '</div>')];
const secLine = (before) => (f) => [{ k: 's', d: 0, cls: 'b1-line is-hl', parts: clsParts({ tag: 'section', attrs: [], before, field: f }) }, hl('i', 1, '<img src="robot3.jpg" class="card-img-top" alt="Robot">', { cls: 'b2-cut' }), hl('b', 1, '<div class="card-body">…</div>', { cls: 'b2-cut' }), hl('sc', 0, '</section>')];

// T2 — настроить скопированное: файл фото, цвет кнопки.
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const base = Object.assign({}, FULL, { name: pick(C.site.name2), desc: pick(C.site.desc2) });
  const rounds = [
    { kind: 'file', want: 'robot2.jpg', ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('…', '…', '…'), line: srcLine({}), body: (v) => cardH(pick, Object.assign({}, base, { src: v || '...' })),
      goal: '<img src="robot2.jpg" style="width:56px;border-radius:6px" alt="">', gz: 0.8, extra: <FilesBar pick={pick} cls="l5-files" /> },   // l5-files: на узком телефоне картинки файлов видны (сверить с образцом)
    { kind: 'theme', want: 'theme-success', ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('theme-…', 'theme-…', 'theme-…'), line: btnLine5(pick), body: (v) => cardH(pick, Object.assign({}, base, { src: 'robot2.jpg', btn: v })),
      goal: '<a href="#" class="btn-solid theme-success">' + escH(pick(C.site.more)) + '</a>', gz: 0.9 }
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} type="customize-card" />;
}

// S8. ЦВЕТ КАРТОЧКИ (показ) — card theme-primary (фон цвета) → card card-subtle theme-success (мягкий).
const S8_C = ['card', 'card theme-primary', 'card card-subtle theme-success'];
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayTheme, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.saySubtle, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askTheme, c.askSubtle][n];
  const help = useShowHelp(c.help);
  const o = Object.assign({}, FULL, { card: S8_C[n], src: 'robot1.jpg' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={cardLines(pick, o, n ? { card: 'is-new is-read' } : {})} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={cardH(pick, o)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// G2 — Card → Theme variants: слово theme-success → в class карточки (WordShow).
function G2({ p }) {
  const pick = usePick();
  const o = (on) => Object.assign({}, FULL, { card: 'card' + (on ? ' theme-success' : ''), src: 'robot1.jpg' });
  const code = (on) => cardLines(pick, o(on), { card: on ? 'is-new is-read' : 'is-hl' });
  const page = (on) => cardH(pick, o(on));
  return <WordShow p={p} id="g2" c={C.g2} from="Button" fromOpen="comp" grp="comp" to="Card" block="ctheme" ln={2} word="theme-success" code={code} page={page} />;
}

// T3 — цвет карточки по образцу.
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const base = Object.assign({}, FULL, { src: 'robot3.jpg', name: pick(C.site.name3), desc: pick(C.site.desc3) });
  const mk = (before, want, ask, hints, why) => ({ kind: 'theme', want, ask, hints, why, ph: L3('theme-…', 'theme-…', 'theme-…'), line: secLine(before),
    body: (v) => cardH(pick, Object.assign({}, base, { card: before + ' ' + v })), goal: '<section class="' + before + ' ' + want + '" style="max-width: 230px"><div class="card-body">' + escH(pick(C.site.name3)) + '</div></section>', gz: 0.8 });
  const rounds = [mk('card', 'theme-danger', c.ask1, c.hints1, c.why1), mk('card card-subtle', 'theme-warning', c.ask2, c.hints2, c.why2)];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} docs={{ page: 'Card', only: 'ctheme' }} type="card-color" />;
}

// S11. КАРТОЧКИ В РЯД (показ) — три карточки друг под другом → d-flex → d-flex gap-5 (урок 4).
const S11_C = [null, 'd-flex', 'd-flex gap-5'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayFlex, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayGap, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askFlex, c.askGap][n];
  const help = useShowHelp(c.help);
  const cards = ROBOTS.map((r, j) => Object.assign({}, FULL, { src: r.src, name: pick(C.site['name' + (j + 1)]), desc: pick(C.site['desc' + (j + 1)]) }));
  const cls = S11_C[n];
  const lines = [hl('o' + n, 0, '<div' + (cls ? ' class="' + cls + '"' : '') + '>', { cls: n ? 'is-new is-read' : 'is-hl' })].concat(ROBOTS.map((r, j) => hl('c' + j, 1, '<section class="card">…' + r.src + '…</section>', { cls: 'b2-cut' })), [hl('e', 0, '</div>')]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><SitePage pick={pick} body={rowH(pick, cls, cards)} vw={WIDE} title={vwTitle(pick, WIDE)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// T5 — ряд карточек: d-flex, потом gap-7. Образец — три маленькие карточки (на телефоне образец невысокий).
const miniRow = (cls) => '<div class="' + cls + '">' + ['#0FA38E', '#7c3aed', '#FA4F28'].map((c) => '<div class="card" style="width:46px;height:34px;border-top:6px solid ' + c + '"></div>').join('') + '</div>';
function T5({ p }) {
  const pick = usePick();
  const c = C.t5;
  const cards = ROBOTS.map((r, j) => Object.assign({}, FULL, { src: r.src, name: pick(C.site['name' + (j + 1)]), desc: pick(C.site['desc' + (j + 1)]) }));
  const rowLine = (before) => (f) => [{ k: 'o', d: 0, cls: 'b1-line is-hl', parts: clsParts({ tag: 'div', attrs: [], before, field: f }) }].concat(ROBOTS.map((r, j) => hl('c' + j, 1, '<section class="card">…' + r.src + '…</section>', { cls: 'b2-cut' })), [hl('e', 0, '</div>')]);
  const rounds = [
    // 23.11.2026: в первом раунде (d-flex) справки Gap нет — она про второй раунд
    { kind: 'flex', want: 'd-flex', ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('…', '…', '…'), vw: WIDE, line: rowLine(null), body: (v) => rowH(pick, v, cards), goal: miniRow('d-flex'), gz: 0.8, docs: null },
    { kind: 'gap', want: 'gap-7', ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('gap-…', 'gap-…', 'gap-…'), vw: WIDE, line: rowLine('d-flex'), body: (v) => rowH(pick, 'd-flex ' + v, cards),
      goal: '<div style="display:flex;align-items:center;gap:10px"><b style="font:600 13px system-ui;color:#BE123C">↔ 24 px</b>' + miniRow('d-flex gap-7') + '</div>', gz: 0.8 }
  ];
  return <FillRounds p={p} id="t5" c={c} rounds={rounds} docs={{ page: 'Gap', only: 'notation' }} type="cards-row" />;
}

// T4. СБОРКА ПО ПОРЯДКУ — кусочки кода карточки: нажимать по порядку; неверный — причина.
const T4_ORDER = ['img', 'body', 'title', 'text', 'btn', 'close'];
const T4_SHUFFLE = ['title', 'close', 'img', 'btn', 'body', 'text'];
function T4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t4;
  const [rec, put] = useRec('t4');
  const solved = !!(rec && rec.done);
  const [done, setDone] = useState(solved ? T4_ORDER : []);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(done.length < 6);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const fin = done.length === T4_ORDER.length;
  const canGo = useAdvanceGate(solved || fin, spoken);
  const led = useIdleLed(canTap && !fin, done.length);
  const src = { img: '<img src="robot1.jpg" class="card-img-top" alt="Robot">', body: '<div class="card-body">', title: '<h4 class="card-title">' + pick(C.site.name1) + '</h4>', text: '<p class="card-text">' + pick(C.site.desc1) + '</p>', btn: '<a href="#" class="btn-solid theme-primary">' + pick(C.site.more) + '</a>', close: '</div>' };
  const tap = (k) => {
    if (!canTap || fin || done.indexOf(k) >= 0) return;
    st.current.tries += 1;
    const want = T4_ORDER[done.length];
    if (k !== want) { st.current.misses += 1; sfx('soft', true); const m = fillL(c.msgs[want], {}); const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(m, hintAt(lad.lv, c.hints)) : m; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx(done.length === 5 ? 'win' : 'pop', true); setMsg(null);
    const d2 = done.concat(k); setDone(d2);
    if (d2.length === T4_ORDER.length) {
      put({ done: true });
      log({ screenId: 't4', type: 'order-card', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
  };
  const depth = { img: 1, body: 1, title: 2, text: 2, btn: 2, close: 1 };
  // 23.11.2026: подписи кусочков одного вида — тег и его class (содержимое — «…»; закрытие — чей тег закрывает)
  const label = { img: '<img class="card-img-top">', body: '<div class="card-body">', title: '<h4 class="card-title">…', text: '<p class="card-text">…', btn: '<a class="btn-solid">…', close: '</div> · card-body' };
  const lines = [hl('s', 0, '<section class="card" style="' + CARD_W + '">')].concat(done.map((k, j) => hl('d' + k, depth[k], src[k], { cls: (j === done.length - 1 ? 'is-new' : '') + (k === 'text' ? ' b2-cut' : '') })), fin ? [] : [quietSlot('slot', done.length && done[done.length - 1] !== 'close' && done.indexOf('body') >= 0 && done.indexOf('close') < 0 ? 2 : 1, pick, true)], [hl('sc', 0, '</section>')]);
  const html = '<section class="card" style="' + CARD_W + '">' + done.map((k) => src[k]).join('') + (done.indexOf('body') >= 0 && done.indexOf('close') < 0 ? '</div>' : '') + '</section>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={fin ? c.ok : c.ask} hint={fin ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done.length + '/6'} />
        <div className="kz-scene b1-pair b5-t4">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col"><SitePage pick={pick} body={html} /></div>
        </div>
        {!fin ? (
          <div className="b4-pieces b5-pieces">
            {T4_SHUFFLE.filter((k) => done.indexOf(k) < 0).map((k) => (
              <button key={k} type="button" className="b2-chip b4-piece b5-piece" onClick={() => tap(k)} disabled={!canTap} data-piece={k}>
                <span translate="no">{label[k]}</span>
                <Led on={(lad.lv >= 3 && k === T4_ORDER[done.length]) || (led && done.length === 0 && k === 'img')} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// Q1. КАКОЙ CLASS У ЧАСТИ (4 раунда): фото, рамка, отступ внутри, цвет. Образец и честный результат выбранного.
const Q1_ROUNDS = [
  // 23.11.2026: неверные — те, что видно глазом (card-img-bottom и img-fluid выглядели почти как card-img-top)
  { part: 'img', opts: ['rounded-circle', 'card-img-top', 'card-body', 'img-thumbnail'], a: 1 },
  { part: 'card', opts: ['card-box', 'cards', 'card', 'border'], a: 2 },
  { part: 'body', opts: ['card-body', 'card-text', 'card-content', 'p-0'], a: 0 },
  { part: 'card', opts: ['card bg-green', 'card-success', 'card fg-success', 'card theme-success'], a: 3 }
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
  const html = (cls) => cardH(pick, Object.assign({}, FULL, { [RR.part]: cls }));
  const choose = (j) => {
    const o = RR.opts[j];
    if (!canTap || R.ok || off.indexOf(o) >= 0) return;
    R.st.current.tries += 1; setShown(o);
    if (j !== RR.a) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.no[o], hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 'q1', type: 'part-class', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const res = R.ok ? right : shown;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : pick(c.asks[R.ii])} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1 b3-q1 b5-q1" key={'r' + R.ii}>
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
              {'class="' + o + '"'}<Led on={(led && !R.ok && off.length === 0 && j === 0) || (ch.lad.lv >= 3 && j === RR.a && !R.ok)} />
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

// T6. ПОЧЕМУ НЕ ТАК — нет card-body (текст прилип к рамке); src="..." (картинка сломана); card-success (такого нет).
const T6_ROUNDS = [
  { k: 'noBody', o: { card: 'card', img: 'card-img-top', body: false, title: 'card-title', text: 'card-text' } },
  { k: 'noSrc', o: Object.assign({}, FULL, { src: '...' }) },
  { k: 'noClass', o: Object.assign({}, FULL, { card: 'card card-success' }) }
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
    if (k !== RR.k) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(MISS_WHY, hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 't6', type: 'why-broken', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const keys = ['noBody', 'noSrc', 'noClass'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.asks[R.ii]} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code" key={'r' + R.ii}>
          {/* 23.11.2026: своя строка-симптом у раунда; подсвечены строки поломки (1 — текст прямо в section, без card-body) */}
          <div className="kz-col"><KzCode lines={cardLines(pick, RR.o, R.ii === 0 ? { title: 'is-hl', text: 'is-hl', btn: 'is-hl' } : R.ii === 1 ? { img: 'is-hl' } : { card: 'is-hl' })} cls="kz-code-sm b2-small" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={cardH(pick, RR.o)} /></div>
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

// W1. СВОЯ КАРТОЧКА — фото (имя файла), имя робота и цвет карточки (theme-…); «Tayyor».
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [fs, setFs] = useState(store.get('mySrc') || '');
  const [nm, setNm] = useState(store.get('myName') || '');
  const [th, setTh] = useState(store.get('myCardTheme') || '');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !fs, 0);
  const vf = normCls(fs), vn = nm.trim(), vt = normCls(th);
  const ready = !!(vf && vn && vt);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    st.current.tries += 1;
    const fi = wordIssue(vf, 'file', ROBOTS.map((r) => r.src));
    const issue = (fi ? issueText(fi) : null) || (/[<>]/.test(vn) ? UI.noTags : vn.replace(/\s+/g, '').length < 2 ? c.msgs.name : null) || issueText(wordIssue(vt, 'theme', BS_THEMES.map((t) => 'theme-' + t)));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('mySrc', vf); store.set('myName', vn); store.set('myCardTheme', vt); put({ done: true });
    log({ screenId: 'w1', type: 'own-card', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, cls: vt });
    sayNow(c.ok, 'cheer');
  };
  const f = (val, set, k, ph, lit, cls) => (solved ? <span key={k} className={cls || 'b1-st'}>{val.trim()}</span>
    : <span key={k} className={'kz-gap b1-slotin b2-field' + (lit ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={ph} label={c.ask} max={30} /></span>);
  const lS = clsParts({ tag: 'section', attrs: [], before: 'card', field: f(th, setTh, 'th', L3('theme-…', 'theme-…', 'theme-…')) });
  const lI = [pn('a', '<'), <span key="b" className="b1-tg">img</span>, <React.Fragment key="s">{sp()}</React.Fragment>, <span key="c" className="b1-at">src</span>, pn('d', '='), <span key="q" className="b1-st">"</span>, f(fs, setFs, 'fs', L3('…', '…', '…'), led), <span key="q2" className="b1-st">"</span>,
    <React.Fragment key="s2">{sp()}</React.Fragment>, <span key="e" className="b1-at">class</span>, pn('f', '='), <span key="g" className="b1-st">"card-img-top"</span>, pn('h', '>')];
  const lT = [pn('a', '<'), <span key="b" className="b1-tg">h4</span>, pn('c', '>'), f(nm, setNm, 'nm', L3('…', '…', '…'), false, 'b1-tx'), pn('d', '</'), <span key="e" className="b1-tg">h4</span>, pn('g', '>')];
  const o = Object.assign({}, FULL, { card: 'card' + (vt ? ' ' + vt : ''), src: FILES[vf] ? vf : (vf || '...'), name: vn || '…', desc: pick(C.site.desc1) });
  const L = (k, d, parts) => ({ k, d, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b5-w1">
          <div className="kz-col">
            <KzCode lines={[L('s', 0, lS), L('i', 1, lI), hl('b', 1, '<div class="card-body">'), L('t', 2, lT), hl('p', 2, '<p class="card-text">…</p>'), hl('bc', 1, '</div>'), hl('sc', 0, '</section>')]} cls="kz-code-sm b2-small" />
            {!solved ? <FilesBar pick={pick} lit={FILES[vf] ? vf : null} /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={cardH(pick, o)} title={pick(UI.mySite)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: держат card и card-body; ряд из трёх карточек, первая — ученика.
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const mine = Object.assign({}, FULL, { card: 'card ' + (store.get('myCardTheme') || 'theme-success'), src: store.get('mySrc') || 'robot1.jpg', name: store.get('myName') || pick(C.site.name1), desc: pick(C.site.desc1) });
  const cards = [mine].concat(ROBOTS.slice(1).map((r, j) => Object.assign({}, FULL, { src: r.src, name: pick(C.site['name' + (j + 2)]), desc: pick(C.site['desc' + (j + 2)]) })));
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col"><SitePage pick={pick} body={rowH(pick, 'd-flex gap-5', cards)} vw={WIDE} title={pick(UI.mySite)} /></div>
          <div className="kz-col b1-end-side">
            <CssCard pick={pick} rules={[CARD_RULES.card, CARD_RULES['card-body'], CARD_RULES['card-title']]} on={curK === 'riddle'} />
            <div className="kz-roles">
              {['parts', 'copy', 'color', 'row'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'parts' ? '#0FA38E' : k === 'copy' ? '#FA4F28' : k === 'color' ? '#7952B3' : '#D97706' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 's5', code: 'SHOW', Comp: S5 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 't5', code: 'LEVEL-2', Comp: T5 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs5Artifact(store) {
  const src = store.get('mySrc'), nm = store.get('myName'), th = store.get('myCardTheme');
  if (!src && !nm && !th) return null;
  return { type: 'html-page', theme: th || '', src: src || '', name: nm || '',
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <section class="card ' + escH(th || '') + '" style="max-width: 320px">', '      <img src="' + escH(src || '') + '" class="card-img-top" alt="Robot">', '      <div class="card-body">',
      '        <h4 class="card-title">' + escH(nm || '') + '</h4>', '      </div>', '    </section>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapKartochki({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs5Artifact(store) })
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
