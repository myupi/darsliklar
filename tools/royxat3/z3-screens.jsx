// =============================================================================
// ЭКРАНЫ УРОКА 3 «Списки» (облик «Редактор»). Сделаны с нуля; основа кода — экраны урока 2
// (tools/zagolovki2/z2r-screens.jsx). Типы заданий — по разделу 3а навыка (заказчик, 03.11.2026):
// s3 вписать — s4 перетащить; s6 собрать код — s7 найти пару; s9 вписать — s10 до и после;
// s12, s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет. Экрана плана нет.
// Бумаги нет нигде: плоские панели, ярлыки тегов TagChip, плавное появление z3-a-in.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// Части строки → JSX страницы (b — жирный) и простой текст.
const inl = (parts, hl, key) => (parts || []).map((x, j) => (typeof x === 'string' ? <React.Fragment key={(key || '') + j}>{x}</React.Fragment>
  : x.s !== undefined ? <span key={(key || '') + j} data-k={x.k}>{x.s}</span>
    : <b key={(key || '') + j} data-k={x.k} className="z3-b">{x.b}</b>));
const plainOf = (parts) => (parts || []).map((x) => (typeof x === 'string' ? x : x.s !== undefined ? x.s : x.b)).join('');

// СТРАНИЦА В БРАУЗЕРЕ — как её рисует браузер по умолчанию. Блок:
// { t: 'h1' | 'h2' | 'p' | 'raw', parts, hl, k, cls } или список
// { t: 'ul' | 'ol', items: [{ parts, bare, hl, cls }], hl, k, cls }; bare — текст в списке без li
// (честно: без точки и номера). Страница всегда помещается в окно (шрифт подгоняет useFitPage).
function useFitPage(dep) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page) return undefined;
    const fit = () => {
      let k = 1;
      el.style.fontSize = '';
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.56) { k -= 0.06; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => ro.disconnect();
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}
function PageDoc({ blocks, wall, cls }) {
  const ref = useFitPage(JSON.stringify(blocks) + (wall ? 'w' : ''));
  if (wall) return <div ref={ref} className={'z3-doc z3-wall' + (cls ? ' ' + cls : '')}>{wall}</div>;
  return (
    <div ref={ref} className={'z3-doc' + (cls ? ' ' + cls : '')}>
      {blocks.map((bk, i) => {
        const c = 'z3-blk z3-' + bk.t + (bk.hl === true ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '');
        if (bk.t === 'ul' || bk.t === 'ol') {
          const L = bk.t;
          return (
            <L key={bk.k || i} className={c} style={bk.st}>
              {bk.items.map((it, j) => (it.bare
                ? <span key={j} className={'z3-bare' + (it.hl ? ' is-hl' : '') + (it.cls ? ' ' + it.cls : '')}>{inl(it.parts, null, i + '-' + j)}</span>
                : <li key={j} className={(it.hl ? 'is-hl' : '') + (it.cls ? ' ' + it.cls : '')}>{inl(it.parts, null, i + '-' + j)}</li>))}
            </L>
          );
        }
        return <div key={bk.k || i} className={c} style={bk.st}>{inl(bk.parts, null, 'k' + i)}</div>;
      })}
    </div>
  );
}
// Строки кода списка: ochuvchi/yopuvchi teg и li-строки. items — [{ w, bare, cls, parts }].
const liLine = (k, w, extra) => Object.assign({ k, d: 1, place: k, parts: [T_('li'), W_(w), T_('li', true)] }, extra || {});
const tagLine = (k, t, close, extra) => Object.assign({ k, d: 0, place: k, parts: [T_(t, close)] }, extra || {});

// Обёртка в тег, набранная в два поля. msgs — свои фразы (по умолчанию WRAP_MSGS). null — всё верно.
function wrapIssue(a, b, tag, msgs) {
  const M = Object.assign({}, WRAP_MSGS, msgs || {});
  const na = normT(a), nb = normT(b);
  const o = '<' + tag + '>', z = '</' + tag + '>';
  const one = (n, want, side) => {
    if (n === want) return null;
    if (!n) return side === 'a' ? M.needOpen : M.needClose;
    if (M.other && (n === '<ul>' || n === '</ul>') && tag === 'ol') return M.other;
    if (side === 'a' && n === z) return M.openSlash;
    if (side === 'b' && n === o) return M.needSlash;
    if (n.charAt(0) !== '<') return M.needLt;
    if (n.charAt(n.length - 1) !== '>') return M.needGt;
    return M.wrongName;
  };
  const m = one(na, o, 'a') || one(nb, z, 'b');
  return m ? fillL(m, { tag }) : null;
}
function useTwoSlots() {
  const a = useTagTyping({ max: 8 });
  const b = useTagTyping({ max: 8 });
  const [act, setAct] = useState('a');
  const ty = act === 'a' ? a : b;
  return { a, b, act, setAct, ty: { val: a.val || b.val, insert: ty.insert, backspace: ty.backspace } };
}
const Slot = ({ ty, on, onFocus, blink, label, onEnter }) => (
  <span className={'kz-gap z3-slot' + (blink ? ' kz-gap-led' : '') + (on ? ' is-act' : '')}>
    <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} onFocus={onFocus} onEnter={onEnter}
      placeholder={L3('…', '…', '…')} label={label} max={8} cls="kz-tag-in" />
  </span>
);
// Ярлык тега — плоский, как подпись блока в инспекторе DevTools.
const TagChip = ({ t, cls, on, hl }) => <span className={'z3-chip' + (on ? ' is-on' : '') + (hl ? ' is-hl' : '') + (cls ? ' ' + cls : '')} translate="no">{T_(t)}</span>;

const ing = (pick) => pick(PAGE.ing);
const steps = (pick) => pick(PAGE.steps);
// Страница рецепта целиком (крючок, s11): h1, h2 + ul, h2 + ol.
const recipeBlocks = (pick, hl, numbered, n = 3) => [
  { t: 'h1', parts: [pick(PAGE.title)], hl: hl === 'h1', k: 'h1' },
  { t: 'h2', parts: [pick(PAGE.h2a)], hl: hl === 'ul', k: 'h2a' },
  { t: 'ul', items: ing(pick).slice(0, n).map((w) => ({ parts: [w] })), hl: hl === 'ul', k: 'ul' },
  { t: 'h2', parts: [pick(PAGE.h2b)], hl: hl === 'ol', k: 'h2b' },
  { t: 'ol', items: steps(pick).slice(0, n).map((w, j) => ({ parts: [numbered ? (j + 1) + '. ' + w : w] })), hl: hl === 'ol', k: 'ol' }
];

// =============================================================================
// S1. КРЮЧОК — рецепт плова слипся в одну строку. «Превратить»: каша тает, страница собирается
// по блокам — заголовок, продукты списком с точками, шаги списком с номерами. Загадка: Коди сам
// вписал номера в шаги.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'page' : 'wall');   // wall · fly · page
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && phase === 'wall', 0);
  const tm = useRef(0);
  useEffect(() => () => clearTimeout(tm.current), []);
  const land = () => { put({ done: true }); setPhase('page'); sfx('ok', true); sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile'); };
  const turn = () => {
    if (!canTap || phase !== 'wall') return;
    sfx('pop', true);
    if (reduceMotion()) { land(); return; }
    setPhase('fly');
  };
  useEffect(() => {
    if (phase !== 'fly') return undefined;
    tm.current = setTimeout(land, 1700);
    return () => clearTimeout(tm.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const hl = phase !== 'page' ? null : speaker.text === c.magic ? 'ul' : speaker.text === c.magicP ? 'ol' : null;
  const blocks = recipeBlocks(pick, hl, false).map((bk, i) => (phase === 'fly' ? Object.assign({}, bk, { cls: 'z3-build', st: { '--dl': (0.25 + i * 0.22) + 's' } }) : bk));
  const wallText = [pick(PAGE.title), pick(PAGE.h2a)].concat(ing(pick).slice(0, 3), [pick(PAGE.h2b)], steps(pick).slice(0, 3)).join(' ');
  const askText = phase === 'wall' ? c.ask : c.askDone;
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z3-s1">
          <div className="kz-stagebox z3-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={phase === 'page'} /></div></div>
          <div className="kz-col z3-s1-page">
            <PaperBrowser title={pick(PAGE.title)} cls="z3-br">
              <div className="z3-s1-box">
                {phase !== 'page' ? <PageDoc blocks={[]} wall={wallText} cls={phase === 'fly' ? 'z3-wall-out' : ''} /> : null}
                {phase !== 'wall' ? <PageDoc blocks={blocks} /> : null}
              </div>
            </PaperBrowser>
          </div>
        </div>
        {phase !== 'page' ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap || phase !== 'wall'} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. НУЖЕН СПИСОК (показ) — три слова в коде браузер склеил в одну строку. Под речь Коди:
// слова обнимает ul (текст сдвигается вправо), потом каждое слово по очереди уходит в li —
// в окне появляется точка. Без действий ученика.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 4 : 0);   // 0 — слова; 1 — ul; 2…4 — li по одному
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const line = (k) => () => codeRef.current && codeRef.current.querySelector('[data-place="' + k + '"]');
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: line('u0'), act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.sayUl, pose: 'point' }, { text: c.sayLi, pose: 'explain' }] },
    { look: line('w0'), act: () => { sfx('tap', true); setN(2); } },
    { look: line('w1'), act: () => { sfx('tap', true); setN(3); } },
    { look: line('w2'), act: () => { sfx('ok', true); setN(4); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const words = ing(pick).slice(0, 3);
  const askText = solved || demo.done ? c.askDone : n >= 1 && speaker.text !== c.sayUl ? c.askLi : c.askUl;
  const sayUl = speaker.text === c.sayUl, sayLi = speaker.text === c.sayLi;
  const lines = [];
  if (n >= 1) lines.push(tagLine('u0', 'ul', false, { cls: 'is-new' + (sayUl ? ' is-read' : '') }));
  words.forEach((w, j) => {
    const wrapped = n >= 2 + j;
    lines.push(wrapped ? liLine('w' + j, w, { cls: 'is-new' + (sayLi ? ' is-read' : ''), d: n >= 1 ? 1 : 0 })
      : { k: 'w' + j, place: 'w' + j, d: n >= 1 ? 1 : 0, cls: 'z3-hline', parts: [W_(w)] });
  });
  if (n >= 1) lines.push(tagLine('u1', 'ul', true, { cls: 'is-new' + (sayUl ? ' is-read' : '') }));
  // Честно: без ul слова склеены в строку; в ul без li — склеены, но с отступом; li — строка с точкой.
  const blocks = n === 0 ? [{ t: 'raw', parts: [words.join(' ')], k: 'r' }]
    : [{ t: 'ul', k: 'ul', hl: sayUl, items: [].concat(words.slice(0, Math.max(0, n - 1)).map((w) => ({ parts: [w], cls: 'z3-a-in', hl: sayLi })),
      n - 1 < 3 ? [{ bare: true, parts: [words.slice(Math.max(0, n - 1)).join(' ')] }] : []) }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z3-s5">
          <div className="kz-col" ref={codeRef}><KzCode lines={lines} /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z3-br" pageHl={speaker.text === c.say && !solved}><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ДОБАВЬ ПУНКТ (Fill in the Blanks) — «Sabzi» стоит в ul без li: в окне без точки.
// Ученик пишет <li> перед словом и </li> после; кнопки < / li > вставляют в поле с курсором.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const sl = useTwoSlots();
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !sl.a.val && !sl.b.val, 0);
  const words = ing(pick);
  const w = words[2];
  const check = () => {
    if (!canTap || okNow || (!sl.a.val.trim() && !sl.b.val.trim())) return;
    st.current.tries += 1;
    const issue = wrapIssue(sl.a.val, sl.b.val, 'li', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'wrap-li', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const ask = fillL(c.ask, { w });
  const blocks = [{ t: 'ul', k: 'ul', items: [{ parts: [words[0]] }, { parts: [words[1]] }, okNow ? { parts: [w], cls: 'z3-a-in' } : { bare: true, parts: [w], hl: !okNow }] }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={okNow ? c.ok : ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z3-br"><PageDoc blocks={blocks} /></PaperBrowser>
            <KzCode lines={[
              tagLine('u0', 'ul', false, { cls: 'z3-edge' }),
              liLine('a', words[0], { cls: 'z3-ctx' }),
              liLine('b', words[1], { cls: 'z3-ctx' }),
              okNow ? liLine('x', w, { cls: 'is-new' }) : { k: 'x', d: 1, cls: 'is-hl', parts: [
                <Slot key="a" ty={sl.a} on={sl.act === 'a'} onFocus={() => sl.setAct('a')} blink={!okNow && led} label={ask} onEnter={check} />,
                <span key="w" className="kz-txt z3-target">{w}</span>,
                <Slot key="z" ty={sl.b} on={sl.act === 'b'} onFocus={() => sl.setAct('b')} blink={!okNow && led} label={ask} onEnter={check} />] },
              tagLine('u1', 'ul', true, { cls: 'z3-edge' })
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'li', '>']} ty={sl.ty} canTap={canTap} onCheck={check} ready={sl.a.val.trim().length > 2 && sl.b.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ДОПОЛНИ СПИСОК (Drag & Drop) — два новых пункта перетащить (или нажать пункт, потом место)
// в пустые строки внутри ul. Третье пустое место — после </ul>, вне списка: туда нельзя.
// =============================================================================
const S4_ITEMS = [3, 4];   // piyoz, yog'
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? [3, 4] : [null, null]);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [peek, setPeek] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const doneN = slots.filter((x) => x !== null).length;
  const done = doneN === 2;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const led = useIdleLed(canTap && !done, doneN * 10 + (sel !== null ? 1 : 0));
  const words = ing(pick);
  const place = (id, where) => {
    if (!canTap || done || id === null || id === undefined || !where) return false;
    st.current.tries += 1;
    if (where === 'out') {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      clearTimeout(peekT.current); setPeek(id); peekT.current = setTimeout(() => setPeek(null), 1800);
      setMsg(c.why.out); setSel(null); sayNow(c.why.out, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    const k = Number(where);
    if (slots[k] !== null) return false;
    sfx('pop', true);
    const ns = slots.slice(); ns[k] = id;
    setSlots(ns); setSel(null); setMsg(null); setPeek(null);
    if (ns.every((x) => x !== null)) {
      put({ done: true });
      log({ screenId: 's4', type: 'place-items', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(Number(id), where));
  const pickSlot = (where) => { if (sel === null) { setMsg(c.pickFirst); return; } place(sel, where); };
  const lit = lad.lv >= 3;
  const nextK = slots.findIndex((x) => x === null);
  const trayRef = useRef(null);
  const codeRef = useRef(null);
  const slotLine = (k) => {
    const id = slots[k];
    if (id !== null) return liLine('s' + k + id, words[id], { cls: 'is-new' });
    return { k: 's' + k, d: 1, place: String(k), cls: 'z3-hline' + (dnd.hover === String(k) ? ' is-hover' : ''),
      onTap: () => pickSlot(String(k)), disabled: !canTap || done, led: (led && sel !== null) || (lit && k === nextK),
      parts: [<span key="d" className="kz-dash kz-dash-sm" />] };
  };
  const lines = [
    tagLine('u0', 'ul'), liLine('a', words[0], { cls: 'z3-ctx' }), liLine('b', words[1], { cls: 'z3-ctx' }), liLine('c', words[2], { cls: 'z3-ctx' }),
    slotLine(0), slotLine(1), tagLine('u1', 'ul', true),
    done ? null : { k: 'out', d: 0, place: 'out', cls: 'z3-hline z3-out' + (dnd.hover === 'out' ? ' is-hover' : ''), onTap: () => pickSlot('out'), disabled: !canTap || done,
      led: led && sel !== null, parts: [<span key="d" className="kz-dash kz-dash-sm" />] }
  ].filter(Boolean);
  const items = [0, 1, 2].map((j) => ({ parts: [words[j]] })).concat(slots.filter((x) => x !== null).map((id) => ({ parts: [words[id]], cls: 'z3-a-in' })));
  // Честно: на миг показанный «вне списка» пункт — после ul, без отступа (как одиночный li без списка).
  const blocks = [{ t: 'ul', k: 'ul', items }].concat(peek !== null ? [{ t: 'p', parts: ['• ' + words[peek]], k: 'peek', cls: 'z3-peek' }] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={done ? c.ok : sel !== null ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : doneN + '/2'} />
        <div className={'kz-scene z3-s5' + (dnd.active || sel !== null ? ' is-dragging' : '')}>
          <div className="kz-col" ref={codeRef}><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z3-br" pageHl={peek !== null}><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
        </div>
        {!done ? (
          <div ref={trayRef} className="kz-tray">
            {S4_ITEMS.map((id) => (slots.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code' + (sel === id ? ' is-sel' : '') + (shake === id ? ' kz-a-shake' : '') + (lit && slots.indexOf(id) < 0 && id === S4_ITEMS.find((x) => slots.indexOf(x) < 0) ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, String(id), '<li>' + words[id] + '</li>'); }}
                onClick={() => { setSel(sel === id ? null : id); setMsg(null); sfx('tap', true); }}>
                <span translate="no">{'<li>' + words[id] + '</li>'}</span><Led on={led && sel === null} />
              </button>
            )))}
          </div>
        ) : null}
        <KzHand label={'<li>' + words[3] + '</li>'} run={canTap && !done && sel === null && !dnd.active && doneN === 0}
          targets={[() => trayRef.current && trayRef.current.querySelector('[data-id="3"]'), () => codeRef.current && codeRef.current.querySelector('[data-place="0"]')]} />
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// S5. ПО ПОРЯДКУ (показ) — шаги рецепта в ul: точки. Под речь Коди ul в коде меняется на ol —
// точки становятся номерами 1. 2. 3.; потом сам добавляется четвёртый шаг — номер 4 появляется сам.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);   // 0 — ul; 1 — ol; 2 — ol и четвёртый шаг
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const line = (k) => () => codeRef.current && codeRef.current.querySelector('[data-place="' + k + '"]');
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { say: [{ text: c.sayOl, pose: 'point' }] },
    { look: line('u0'), act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.sayAuto, pose: 'explain' }] },
    { look: line('n3'), act: () => { sfx('ok', true); setN(2); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const t = n >= 1 ? 'ol' : 'ul';
  const ss = steps(pick);
  const list = ss.slice(0, n >= 2 ? 4 : 3);
  const sayOl = speaker.text === c.sayOl;
  const lines = [tagLine('u0', t, false, { cls: n >= 1 ? 'is-new' + (sayOl ? ' is-read' : '') : '' })]
    .concat(list.map((w, j) => liLine(j === 3 ? 'n3' : 'l' + j, w, { cls: j === 3 ? 'is-new' : '' })))
    .concat([tagLine('u1', t, true, { cls: n >= 1 ? 'is-new' : '' })]);
  const blocks = [{ t: 'h2', parts: [pick(PAGE.h2b)], k: 'h' }, { t, k: t, hl: sayOl || speaker.text === c.sayAuto, items: list.map((w, j) => ({ parts: [w], cls: j === 3 ? 'z3-a-in' : '' })) }];
  const askText = solved || demo.done ? c.askDone : n >= 1 ? c.askAuto : c.askOl;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z3-s5">
          <div className="kz-col" ref={codeRef}><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z3-br"><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. РАССТАВЬ ШАГИ (Code Builder) — внутри ol три пустые строки, в лотке три шага вперемешку.
// Нажать шаг — он встаёт в следующую строку (или перетащить). Браузер сразу нумерует.
// Не тот шаг — причина про порядок готовки, шаг остаётся в лотке.
// =============================================================================
const S6_TRAY = [2, 0, 1];
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? [0, 1, 2] : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const ss = steps(pick);
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    if (id !== got.length) {
      st.current.misses += 1;
      const m = got.length === 0 ? (id === 2 ? c.why.riceFirst : c.why.carrotFirst) : c.why.riceEarly;
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
      log({ screenId: 's6', type: 'build-ol', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(Number(id)));
  const lit = lad.lv >= 3;
  const slotLine = (k) => {
    const id = got[k];
    if (id !== undefined) return liLine('s' + k + id, ss[id], { cls: 'is-new' });
    return { k: 's' + k, d: 1, place: 'code', cls: k === got.length ? 'is-hl' : 'z3-later',
      parts: [<span key="d" className={'kz-dash kz-dash-sm' + (dnd.hover === 'code' && k === got.length ? ' is-hover' : '')} />] };
  };
  const blocks = [{ t: 'h2', parts: [pick(PAGE.h2b)], k: 'h' }, { t: 'ol', k: 'ol', items: got.map((id) => ({ parts: [ss[id]], cls: 'z3-a-in' })) }];
  const hint = hintAt(lad.lv, c.hints);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hint)} err={!!msg} n={done ? null : got.length + '/3'} />
        <div className={'kz-scene kz-scene-col z3-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z3-br" pageHl={done}><PageDoc blocks={blocks} /></PaperBrowser>
            <KzCode lines={[tagLine('o0', 'ol', false, { cls: 'z3-edge' }), slotLine(0), slotLine(1), slotLine(2), tagLine('o1', 'ol', true, { cls: 'z3-edge' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray z3-s6-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z3-step' + (shake === id ? ' kz-a-shake' : '') + (lit && id === got.length ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, String(id), ss[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{ss[id]}</span><Led on={led} />
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
// S7. НАЙДИ ПАРУ (Matching Pairs) — слева теги ul, ol, li, справа — что они делают (с маленьким
// образцом). Нажать тег, потом его дело; пара закрепляется. Не та пара — причина, можно снова.
// =============================================================================
const S7_TAGS = ['ul', 'ol', 'li'];
const S7_CARDS = ['li', 'ul', 'ol'];   // порядок карточек справа
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
  const done = paired.length === 3;
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
    if (nx.length === 3) {
      put({ done: true });
      log({ screenId: 's7', type: 'match-tags', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  const sample = (k) => (k === 'ul' ? <span className="z3-mini"><i>•</i><i>•</i><i>•</i></span>
    : k === 'ol' ? <span className="z3-mini"><i>1.</i><i>2.</i><i>3.</i></span> : <span className="z3-mini is-one"><i>•</i></span>);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene z3-match">
          <div className="z3-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-tag z3-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <TagK t={t} /><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z3-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z3-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  {sample(k)}<span className="z3-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z3-mcard-tag"><TagK t={k} /></span> : null}
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
// S8. ul ИЛИ ol? (показ) — правило «поменяй местами»: в списке покупок пункты меняются местами —
// смысл тот же (ul); в утренних делах — смысл ломается (ol). Под каждым примером — его код: строки
// меняются местами вместе с пунктами, у утра ul в коде становится ol (заказчик, 03.11.2026). Без действий ученика.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [a, setA] = useState(solved ? 2 : 0);   // 0 — как есть; 1 — поменяли; 2 — вывод (ярлык)
  const [b, setB] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setA(1); } },
    { say: [{ text: c.sayA, pose: 'smile' }] },
    { act: () => { sfx('ok', true); setA(2); } },
    { act: () => { sfx('tap', true); setB(1); } },
    { say: [{ text: c.sayB, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setB(2); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const card = (k, list, swapped, verdict, tag, bad) => {
    // Переставленный порядок виден, пока Коди о нём говорит; у утра после вывода (ol) — снова верный порядок.
    const items = swapped === 1 || (swapped >= 2 && !bad) ? [list[1], list[0], list[2]] : list;
    return (
      <div className={'z3-ex' + (swapped === 1 ? ' is-swap' : '') + (swapped >= 1 && bad ? ' is-bad' : '') + (swapped >= 1 && !bad ? ' is-good' : '')} key={k}>
        <span className="z3-card-h">{pick(c.cards[k])}</span>
        <PageDoc blocks={[{ t: swapped >= 2 ? tag : 'ul', k: 'l', items: items.map((w, j) => ({ parts: [w], cls: swapped === 1 && j < 2 ? 'z3-swap' : '' })) }]} />
        {swapped >= 1 ? <span className={'z3-ex-v' + (bad ? ' is-bad' : '')}>{pick(verdict)}</span> : null}
        {swapped >= 2 ? <TagChip t={tag} cls="z3-ex-tag z3-a-in" on /> : null}
        {/* Код примера: при перестановке строки кода тоже меняются местами; в утре ul становится ol. */}
        <KzCode lines={[tagLine('t0', swapped >= 2 ? tag : 'ul', false, { cls: swapped >= 2 && tag === 'ol' ? 'is-new is-read' : '' })]
          .concat(items.map((w, j) => liLine('i' + j + w, w, { cls: swapped === 1 && j < 2 ? 'is-read' : '' })))
          .concat([tagLine('t1', swapped >= 2 ? tag : 'ul', true, { cls: swapped >= 2 && tag === 'ol' ? 'is-new is-read' : '' })])} cls="kz-code-sm z3-ex-code" />
      </div>
    );
  };
  const askText = solved || demo.done ? c.askDone : b >= 1 ? c.askB : c.askA;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z3-exs">
          {card('a', pick(c.listA), a, c.same, 'ul', false)}
          {card('b', pick(c.listB), b, c.broken, 'ol', true)}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ПОСТАВЬ ol (Fill in the Blanks) — утренние дела записаны в ul (точки), а порядок важен.
// Ученик пишет <ol> вместо первой строки и </ol> вместо последней: точки становятся номерами.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const sl = useTwoSlots();
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !sl.a.val && !sl.b.val, 0);
  const list = pick(C.s8.listB);
  const check = () => {
    if (!canTap || okNow || (!sl.a.val.trim() && !sl.b.val.trim())) return;
    st.current.tries += 1;
    const issue = wrapIssue(sl.a.val, sl.b.val, 'ol', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'ul-to-ol', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  // Честно: пока теги не стали ol — список с точками.
  const blocks = [{ t: 'h2', parts: [pick(C.s8.cards.b)], k: 'h' }, { t: okNow ? 'ol' : 'ul', k: 'l', cls: okNow ? 'z3-a-in' : '', items: list.map((w) => ({ parts: [w] })) }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(C.s8.cards.b)} short cls="z3-br"><PageDoc blocks={blocks} /></PaperBrowser>
            <KzCode lines={[
              okNow ? tagLine('o0', 'ol', false, { cls: 'is-new' }) : { k: 'o0', d: 0, cls: 'is-hl', parts: [
                <span key="old" className="z3-old" aria-hidden="true">{T_('ul')}</span>,
                <Slot key="a" ty={sl.a} on={sl.act === 'a'} onFocus={() => sl.setAct('a')} blink={!okNow && led} label={c.ask} onEnter={check} />] },
              ...list.map((w, j) => liLine('l' + j, w, { cls: 'z3-ctx' })),
              okNow ? tagLine('o1', 'ol', true, { cls: 'is-new' }) : { k: 'o1', d: 0, cls: 'is-hl', parts: [
                <span key="old" className="z3-old" aria-hidden="true">{T_('ul', true)}</span>,
                <Slot key="z" ty={sl.b} on={sl.act === 'b'} onFocus={() => sl.setAct('b')} blink={!okNow && led} label={c.ask} onEnter={check} />] }
            ]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'ol', '>']} ty={sl.ty} canTap={canTap} onCheck={check} ready={sl.a.val.trim().length > 2 && sl.b.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ДО И ПОСЛЕ (Before / After) — список «до» и «после»: точки стали номерами (ol), появился
// пункт (li), номера стали точками (ul). Ученик выбирает тег, который это сделал. Промах — причина,
// верный тег загорается, добавляется раунд того же типа.
// =============================================================================
const S10_ROUNDS = [
  { want: 'ol', before: { t: 'ul', n: 3 }, after: { t: 'ol', n: 3 }, list: 'listB' },
  { want: 'li', before: { t: 'ul', n: 2 }, after: { t: 'ul', n: 3 }, list: 'listA' },
  { want: 'ul', before: { t: 'ol', n: 3 }, after: { t: 'ul', n: 3 }, list: 'listA' }
];
const S10_EXTRA = [
  { want: 'ol', before: { t: 'ul', n: 2 }, after: { t: 'ol', n: 2 }, list: 'listB' },
  { want: 'li', before: { t: 'ol', n: 2 }, after: { t: 'ol', n: 3 }, list: 'listB' },
  { want: 'ul', before: { t: 'ol', n: 2 }, after: { t: 'ul', n: 2 }, list: 'listA' }
];
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
  const R = shownRd ? (shownRd.extra ? S10_EXTRA : S10_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
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
        log({ screenId: 's10.r' + (ii + 1), type: 'before-after', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
  const list = R ? pick(C.s8[R.list]) : [];
  const doc = (v) => <PageDoc blocks={[{ t: v.t, k: 'l', items: list.slice(0, v.n).map((w) => ({ parts: [w] })) }]} />;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z3-ba kz-a-drop">
                <div className="z3-card"><span className="z3-card-h">{pick(c.before)}</span>{doc(R.before)}</div>
                <span className="z3-ba-arrow" aria-hidden="true" />
                <div className="z3-card is-after"><span className="z3-card-h">{pick(c.after)}</span>{doc(R.after)}</div>
              </div>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick z3-pick3">
            {['ul', 'ol', 'li'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z3-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}><TagK t={k} /><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. СВЕРХУ ВНИЗ (показ) — браузер читает всю страницу рецепта: строки кода загораются по
// очереди, страница собирается; потом Коди называет порядок.
// =============================================================================
const READ11 = ['h1', 'ul', 'ol'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ11.length : -1);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 750;
  const run = () => { READ11.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run },
    { wait: STEP * READ11.length + 200 },
    { act: () => setRead(READ11.length) },
    { say: ORDER },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const sayK = spoken ? null : speaker.text === c.order1 ? 'h1' : speaker.text === c.order2 ? 'ul' : speaker.text === c.order3 ? 'ol' : null;
  const cur = read >= 0 && read < READ11.length ? READ11[read] : null;
  const on = (k) => (sayK ? sayK === k : cur === k);
  // Код страницы — по два пункта в списке: на телефоне весь код и окно помещаются с заданием.
  const ii = ing(pick).slice(0, 2), ss = steps(pick).slice(0, 2);
  const grp = (k, list) => list.map((ln) => Object.assign(ln, { cls: on(k) ? 'is-read' : '' }));
  const lines = [].concat(
    grp('h1', [{ k: 'h1', d: 0, parts: [T_('h1'), W_(pick(PAGE.title)), T_('h1', true)] }]),
    grp('ul', [{ k: 'h2a', d: 0, parts: [T_('h2'), W_(pick(PAGE.h2a)), T_('h2', true)] }, tagLine('u0', 'ul')].concat(ii.map((w, j) => liLine('i' + j, w)), [tagLine('u1', 'ul', true)])),
    grp('ol', [{ k: 'h2b', d: 0, parts: [T_('h2'), W_(pick(PAGE.h2b)), T_('h2', true)] }, tagLine('o0', 'ol')].concat(ss.map((w, j) => liLine('s' + j, w)), [tagLine('o1', 'ol', true)]))
  );
  const at = (k) => read >= READ11.indexOf(k);
  const blocks = recipeBlocks(pick, null, false, 2).filter((bk) => (bk.k === 'h1' ? at('h1') : bk.k === 'h2a' || bk.k === 'ul' ? at('ul') : at('ol')))
    .map((bk) => Object.assign({}, bk, { hl: on(bk.k === 'h1' ? 'h1' : bk.k === 'h2a' || bk.k === 'ul' ? 'ul' : 'ol'), cls: solved ? '' : 'z3-a-in' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene z3-s5 z3-s11">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm z3-code-xs" /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} cls="z3-br">{blocks.length ? <PageDoc blocks={blocks} /> : null}</PaperBrowser>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ЗАГОЛОВОК СПИСКА и S13. СВОИ ПУНКТЫ (Live Code Preview) — свой список двумя экранами:
// заголовок в h2, потом три пункта в li. Окно меняется сразу при наборе; засчёт — по «Готово».
// =============================================================================
const useMine3 = () => {
  const store = useStore();
  const pick = usePick();
  const items = store.get('myItems');
  return { title: store.get('myTitle') || pick(C.s12.ph).replace(/^[^:]*:\s*/, ''), items: items && items.length ? items : pick(C.s13.ph) };
};
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec] = useRec('s12');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myTitle', screenId: 's12', type: 'own-list-heading', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const dots = pick(C.s13.ph).map(() => ({ parts: ['…'], cls: 'z3-later-li' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="z3-br" pageHl={!ty.solved}>
              <PageDoc blocks={(ty.shown ? [{ t: 'h2', parts: [ty.shown], k: 'h' }] : []).concat([{ t: 'ul', k: 'l', items: dots }])} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: 'is-hl', parts: [T_('h2'), <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={30} /></span>, T_('h2', true)] },
              tagLine('u0', 'ul', false, { cls: 'z3-later' }),
              { k: 'l', d: 1, cls: 'z3-later', parts: [T_('li'), <span key="d" className="kz-dim">…</span>, T_('li', true)] },
              tagLine('u1', 'ul', true, { cls: 'z3-later' })
            ]} />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s13;
  const mine = useMine3();
  const [rec, put] = useRec('s13');
  const saved = store.get('myItems');
  const [vals, setVals] = useState(() => (rec && rec.done && saved ? saved.slice() : ['', '', '']));
  const [solved, setSolved] = useState(!!(rec && rec.done));
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tags = vals.some((v) => hasTags(v));
  const ready = !tags && vals.every((v) => v.trim().length > 0);
  const led = useIdleLed(canTap && !solved && !vals.some((v) => v.trim()), 0);
  const set = (j, v) => { if (solved) return; setVals((a) => { const x = a.slice(); x[j] = v; return x; }); };
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const items = vals.map((v) => v.trim());
    store.set('myItems', items); put({ done: true }); setSolved(true);
    log({ screenId: 's13', type: 'own-list-items', correct: true, firstTry: lad.asked.current === 0, attempts: 1, hints: lad.asked.current, depth: lad.lv });
    sfx('win', true); sayNow(c.ok, 'cheer');
  };
  const ph = pick(c.ph);
  const hint = tags ? UI.noTags : hintAt(lad.lv, c.hints);
  const items = vals.map((v, j) => (v.trim() ? { parts: [v.trim()] } : { parts: ['…'], cls: 'z3-later-li' }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved && !tags ? null : hint} err={tags} n={solved ? null : vals.filter((v) => v.trim()).length + '/3'} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="z3-br" pageHl={!solved}>
              <PageDoc blocks={[{ t: 'h2', parts: [mine.title], k: 'h' }, { t: 'ul', k: 'l', items }]} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: 'z3-ctx', parts: [T_('h2'), W_(mine.title), T_('h2', true)] },
              tagLine('u0', 'ul'),
              ...vals.map((v, j) => ({ k: 'l' + j, d: 1, cls: solved ? '' : 'is-hl', parts: [T_('li'),
                solved ? W_(v) : <span key="g" className={'kz-gap' + (led && j === 0 ? ' kz-gap-led' : '')}><InlineInput value={v} onChange={(x) => set(j, x)} onEnter={confirm} placeholder={L3(ph[j], ph[j], ph[j])} label={c.ask} max={24} /></span>,
                T_('li', true)] })),
              tagLine('u1', 'ul', true)
            ]} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ready && !solved} glow={canTap && ready && !solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ПРОПАЛА ТОЧКА (Debug & Fix) — на своём списке у второго пункта нет <li>: в окне он без
// точки. Перетащить (или нажать) нужный тег в пустое место.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const mine = useMine3();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === '<li>') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'fix-li', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'cheer');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const its = mine.items;
  const items = its.map((w, j) => (j === 1 && !okNow ? { bare: true, parts: [w], hl: true } : { parts: [w], cls: j === 1 ? 'z3-a-in' : '' }));
  const glow = off.length >= 2 ? '<li>' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z3-s5">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} cls={'z3-br' + (okNow ? '' : ' z3-broken')}><PageDoc blocks={[{ t: 'h2', parts: [mine.title], k: 'h' }, { t: 'ul', k: 'l', items }]} /></PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('h2'), W_(mine.title), T_('h2', true)] },
              tagLine('u0', 'ul'),
              liLine('a', its[0]),
              { k: 'b', d: 1, cls: okNow ? 'is-new' : 'is-hl', parts: [okNow ? <span key="c" className="z3-a-in">{T_('li')}</span>
                : <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z3-miss' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />, W_(its[1]), T_('li', true)] },
              liLine('c', its[2]),
              tagLine('u1', 'ul', true)
            ]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {c.opts.map((o) => (
              <button key={o} type="button" disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, o); }}
                className={'kz-scrap kz-scrap-tag' + (off.indexOf(o) >= 0 ? ' is-used' : '') + (glow === o ? ' is-led' : '')}>
                <span translate="no">{o}</span><Led on={led && off.indexOf(o) < 0} />
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
// Q1. НАЙДИ ОШИБКУ (Error Detective) — новые списки без образца. Раунд 1: список в школьную
// сумку, у пункта нет li (без точки). Раунд 2: утренние дела в ol, у пункта номер вписан руками
// (в окне «2. 2.»). Ученик нажимает строку с ошибкой; найденная строка чинится сама.
// =============================================================================
const Q1_ROUNDS = [{ bad: 2, kind: 'bare', list: 'bag', t: 'ul' }, { bad: 2, kind: 'num', list: 'morning', t: 'ol' }];
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
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
  const list = R.list === 'bag' ? pick(c.bag) : pick(C.s8.listB);
  const head = R.list === 'bag' ? pick(c.bagTitle) : pick(C.s8.cards.b);
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (j !== R.bad) {
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
  // Строка кода j (1…3 — пункты): ошибка на R.bad, после находки — исправлена.
  const word = (j) => list[j - 1];
  const broken = (j) => !found && j === R.bad;
  const codeOf = (j) => (broken(j) ? (R.kind === 'bare' ? [W_(word(j))] : [T_('li'), W_(j + '. ' + word(j)), T_('li', true)]) : [T_('li'), W_(word(j)), T_('li', true)]);
  // Честно: текст без li — без точки; номер, вписанный руками в ol, — второй номер рядом с браузерным.
  const items = [1, 2, 3].map((j) => (broken(j) ? (R.kind === 'bare' ? { bare: true, parts: [word(j)] } : { parts: [j + '. ' + word(j)] }) : { parts: [word(j)], cls: found && j === R.bad ? 'z3-a-in' : '' }));
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene kz-scene-col z3-q1" key={'q' + ri}>
          <div className="kz-col">
            <PaperBrowser title={head} short cls={'z3-br' + (found ? '' : ' z3-broken')}><PageDoc blocks={[{ t: 'h2', parts: [head], k: 'h' }, { t: R.t, k: 'l', items }]} /></PaperBrowser>
            <KzCode lines={[tagLine('o0', R.t, false, { cls: 'z3-edge' })].concat([1, 2, 3].map((j) => ({
              k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 1, parts: codeOf(j),
              cls: 'z3-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && ((led && off.length === 0 && j === 1) || (lit && j === R.bad))
            }))).concat([tagLine('o1', R.t, true, { cls: 'z3-edge' })])} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q2. ВЕРНО ИЛИ НЕТ (True / False) — три утверждения по очереди. Промах — кнопка гаснет,
// Коди объясняет, можно снова. После ответа — коротко почему, и следующее.
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
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
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) {
      st.current.misses += 1;
      sfx('soft', true); setOff(v); setMsg(it.why); sayNow(it.why, 'think');
      return;
    }
    sfx('ok', true); setOk(true); setMsg(null);
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'q2', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: 0, depth: 0 });
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
      className={'kz-btn z3-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z3-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z3-card z3-tf-card kz-a-drop">
              <span className="z3-card-h">{pick(c.card)}</span>
              <p className="z3-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={[{ k: 'c', d: 0, parts: it.code.map((x, j) => (x.w ? <span key={j}>{W_(pick(x.w))}</span> : <span key={j}>{T_(x.t, x.close)}</span>)) }]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z3-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка загадки (номера, вписанные руками в ol, удваиваются), свой список ученика,
// роли ul, ol, li загораются, пока Коди их называет. Единственный праздник урока.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine3();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  // Пока Коди разгадывает загадку — в окне его шаги с номерами, вписанными руками («1. 1.»).
  const riddle = curK === 'riddle';
  const blocks = riddle
    ? [{ t: 'h2', parts: [pick(PAGE.h2b)], k: 'h' }, { t: 'ol', k: 'o', hl: true, items: steps(pick).slice(0, 3).map((w, j) => ({ parts: [(j + 1) + '. ' + w] })) }]
    : [{ t: 'h2', parts: [mine.title], k: 'h' }, { t: 'ul', k: 'l', hl: curK === 'ul', items: mine.items.map((w) => ({ parts: [w], hl: curK === 'li' })) }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z3-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <PaperBrowser title={riddle ? pick(PAGE.title) : pick(UI.mySite)} cls="z3-br"><PageDoc blocks={blocks} key={riddle ? 'r' : 'm'} /></PaperBrowser>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['ul', 'ol', 'li'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'ol') ? ' is-on' : '')} style={{ '--c': k === 'ul' ? '#0FA38E' : k === 'ol' ? '#FA4F28' : '#7C5CFA' }}>
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
// «Повторить» стирает только экран; свой список ученика (myTitle, myItems) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — свой список ученика: заголовок h2 и три пункта в ul.
function lesson3Artifact(store) {
  const t = store.get('myTitle'), items = store.get('myItems');
  if (!t && !(items && items.length)) return null;
  const li = (items || []).map((x) => '      <li>' + escHtml(x) + '</li>');
  return { type: 'html-page', title: t || '', items: items || [],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(t || '') + '</title>', '  </head>', '  <body>',
      '    <h2>' + escHtml(t || '') + '</h2>', '    <ul>'].concat(li, ['    </ul>', '  </body>', '</html>']).join('\n') };
}

export default function HtmlSpiski({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson3Artifact(store) })
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
