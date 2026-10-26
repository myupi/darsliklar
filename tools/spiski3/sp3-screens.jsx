// =============================================================================
// ЧАСТИ УРОКА 3 — честная страница со списками, бумажные листы списков, код
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// Теги урока вслух: голые ul, ol, li в репликах — словами (как теги в уроке 2).
// Обёртка поверх озвучки бумажного набора: сначала набор, потом свои слова.
const spokenKit3 = spokenHtml;
// eslint-disable-next-line no-func-assign
spokenHtml = (text, lang) => {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  return spokenKit3(text, lang).replace(/(^|[^A-Za-z‘’'ʻʼ])(ul|ol|li)(?=[^A-Za-z‘’'ʻʼ]|$)/g, (a, pre, t) => pre + m[t]);
};

// Строки кода: пункт li, открывающий и закрывающий тег списка.
const liParts = (s) => [T_('li'), W_(s), T_('li', true)];

// Страница всегда помещается в окно целиком, без прокрутки (правило эталона):
// не влезает — шрифт страницы ступеньками уменьшается (не меньше 56 %).
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
    // Вырезки входят «штампом» (увеличение) — пока он идёт, страница кажется выше. Ещё раз после него.
    const t = setTimeout(fit, 700);
    if (typeof ResizeObserver === 'undefined') return () => clearTimeout(t);
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// СТРАНИЦА В БУМАЖНОМ БРАУЗЕРЕ — как её рисует настоящий браузер:
//   { t: 'h1' | 'h2' | 'p', s }                  — заголовок, абзац;
//   { t: 'ul' | 'ol', kids: [...] }              — список; ребёнок:
//       { li: true, s }  пункт (точка или номер; пустой — тоже пункт),
//       { txt: s }       текст без li (без точки; соседние склеиваются в строку),
//       { p: s }         абзац внутри незакрытого списка (сдвинут, как список);
//   { t: 'stray', s }                            — li вне списка: без отступа.
// У любого: k (ключ), hl (подсветка), cls; у ребёнка — miss («?» на месте точки).
function ListPage({ blocks, anim }) {
  const ref = useFitPage(JSON.stringify(blocks));
  let n = 0;
  const st = (i) => (anim ? { '--dl': (0.1 * i) + 's' } : null);
  const ac = anim ? ' kz-a-drop' : '';
  return (
    <div ref={ref} className="l3-doc">
      {blocks.map((bk, i) => {
        const k = bk.k || i;
        const c = (bk.hl ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '') + ac;
        if (bk.t === 'ul' || bk.t === 'ol') {
          n = 0;
          const rows = [];
          (bk.kids || []).forEach((kid, j) => {
            const kc = (kid.hl ? ' is-hl' : '') + (kid.cls ? ' ' + kid.cls : '');
            if (kid.li) {
              n += 1;
              rows.push(<div key={kid.k || 'li' + j} className={'l3-li' + kc}><span className="l3-mk" aria-hidden="true">{bk.t === 'ol' ? n + '.' : '•'}</span><span className="l3-li-t">{kid.s || ' '}</span></div>);
            } else if (kid.p !== undefined) {
              rows.push(<div key={kid.k || 'p' + j} className={'l3-p' + kc}>{kid.p}</div>);
            } else {
              const last = rows.length ? rows[rows.length - 1] : null;
              if (last && last.props['data-txt']) {
                rows[rows.length - 1] = React.cloneElement(last, {}, last.props.children, ' ' + kid.txt);
              } else rows.push(<div key={kid.k || 't' + j} data-txt="1" className={'l3-txt' + kc}>{kid.miss ? <span className="l3-miss" aria-hidden="true" /> : null}{kid.txt}</div>);
            }
          });
          return <div key={k} className={'l3-list l3-' + bk.t + c} style={st(i)}>{rows}</div>;
        }
        if (bk.t === 'stray') return <div key={k} className={'l3-li l3-stray' + c} style={st(i)}><span className="l3-mk" aria-hidden="true">•</span><span className="l3-li-t">{bk.s}</span></div>;
        return <div key={k} className={'l3-blk l3-' + bk.t + c} style={st(i)}>{bk.s}</div>;
      })}
    </div>
  );
}

// БУМАЖНЫЙ ЛИСТ СПИСКА (как в ролике): бирюзовый — с точками (ul), горчичный —
// с номерами (ol); пункты — кремовые полоски, точка — коралловый кружок, номер —
// коралловый кружок с цифрой. Образ для наглядности: в браузере так не видно.
function ListSheet({ kind, items, marks = true, hl, tag, title, cls, place, hover, call, children, ghost, fresh }) {
  return (
    <div className={'l3-sheet l3-sheet-' + kind + (hl ? ' is-hl' : '') + (hover ? ' is-hover' : '') + (call ? ' is-call' : '') + (cls ? ' ' + cls : '')} data-place={place}>
      <Cut c={kind === 'ul' ? KZ.teal : KZ.mustard} seed={kind === 'ul' ? 600 : 700} n={14} amp={1.8} asp={0.9} cls="l3-sheet-cut" r={kind === 'ul' ? -0.6 : 0.7} />
      {tag ? <KzLabel t={kind} cls="l3-sheet-lbl" /> : null}
      {title ? <span className="l3-sheet-title">{title}</span> : null}
      <div className="l3-sheet-in">
        {(items || []).map((s, i) => (
          <div key={i} className={'l3-row' + (ghost ? ' is-ghost' : '')} data-k={kind + i}>
            {marks ? <span className={'l3-dot' + (kind === 'ol' ? ' is-num' : '') + (fresh ? ' kz-a-stamp' : '')} style={{ '--dl': (0.12 * i + 0.1) + 's' }}>{kind === 'ol' ? i + 1 : ''}</span> : <span className="l3-dot is-off" />}
            <span className="l3-strip">{s}</span>
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}

// Обёртка в тег, набранная в два поля: перед и после. null — всё верно.
function wrapIssue3(a, b, tag, msgs) {
  const na = normT(a), nb = normT(b);
  const o = '<' + tag + '>', z = '</' + tag + '>';
  const one = (v, want, side) => {
    if (v === want) return null;
    if (!v) return side === 'a' ? msgs.needOpen : msgs.needClose;
    if (side === 'a' && v === z) return msgs.openSlash;
    if (side === 'b' && v === o) return msgs.needSlash;
    if (v.charAt(0) !== '<') return msgs.needLt;
    if (v.charAt(v.length - 1) !== '>') return msgs.needGt;
    return msgs.wrongName;
  };
  const m = one(na, o, 'a') || one(nb, z, 'b');
  return m ? fillL(m, { tag }) : null;
}
// Два поля и общие кнопки < / тег >: символ встаёт в поле, где курсор.
function useTwoSlots() {
  const a = useTagTyping({ max: 8 });
  const b = useTagTyping({ max: 8 });
  const [act, setAct] = useState('a');
  const ty = act === 'a' ? a : b;
  return { a, b, act, setAct, ty: { val: a.val || b.val, insert: ty.insert, backspace: ty.backspace } };
}
const Slot = ({ ty, on, onFocus, blink, label, onEnter, miss }) => (
  <span className={'kz-gap l3-slot' + (blink ? ' kz-gap-led' : '') + (on ? ' is-act' : '') + (miss && !ty.val ? ' l3-q' : '')}>
    <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} onFocus={onFocus} onEnter={onEnter}
      placeholder={L3('…', '…', '…')} label={label} max={8} cls="kz-tag-in" />
  </span>
);

// =============================================================================
// S1. КРЮЧОК — записки Коди: шесть полосок вперемешку лежат поверх двух пустых
// листов. «Разложить»: полоски ступенчато (stop-motion, с шорохом) летят по
// местам — вещи на бирюзовый лист, шаги рецепта на горчичный; у вещей
// появляются точки, у шагов — номера по порядку.
// =============================================================================
const S1_FLY = 0.75;
const S1_PILE = [
  { k: 'ol2', l: 4, t: 4, r: -9 }, { k: 'ul0', l: 56, t: 10, r: 7 }, { k: 'ol0', l: 26, t: 30, r: -4 },
  { k: 'ul2', l: 2, t: 56, r: 5 }, { k: 'ol1', l: 50, t: 62, r: -7 }, { k: 'ul1', l: 30, t: 84, r: 3 }
];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'done' : 'pile');   // pile · fly · done
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && phase === 'pile', 0);
  const tm = useRef(0);
  const boxRef = useRef(null);
  useEffect(() => () => { clearTimeout(tm.current); paperOff(); }, []);
  const land = () => { paperOff(); put({ done: true }); setPhase('done'); sfx('ok', true); sayNow(c.magicUl, 'wonder'); say(c.magicOl, 'point'); say(c.done, 'smile'); };
  const sortIt = () => {
    if (!canTap || phase !== 'pile') return;
    sfx('pop', true);
    if (reduceMotion()) { land(); return; }
    setPhase('fly');
  };
  useLayoutEffect(() => {
    if (phase !== 'fly') return undefined;
    const box = boxRef.current;
    if (!box) { land(); return undefined; }
    let last = 0;
    box.querySelectorAll('.l3-pile [data-k]').forEach((el, i) => {
      const k = el.getAttribute('data-k');
      const to = box.querySelector('.l3-sheet [data-k="' + k + '"] .l3-strip');
      if (!to) return;
      const a = el.getBoundingClientRect(), b = to.getBoundingClientRect();
      const dl = i * 0.12;
      last = Math.max(last, dl);
      const tr = (prop) => prop + ' ' + S1_FLY + 's steps(9, end) ' + dl.toFixed(2) + 's';
      el.style.transition = [tr('translate'), tr('scale'), tr('rotate')].join(', ');
      el.style.translate = (b.left - a.left).toFixed(1) + 'px ' + (b.top - a.top).toFixed(1) + 'px';
      el.style.scale = (b.height / a.height).toFixed(3);
      el.style.rotate = '0deg';
    });
    paperOn();
    tm.current = setTimeout(land, (last + S1_FLY) * 1000 + 180);
    return undefined;
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const things = TRIP.things.map(pick), steps = TRIP.steps.map(pick);
  const textOf = (k) => (k.slice(0, 2) === 'ul' ? things : steps)[Number(k.slice(2))];
  const done = phase === 'done';
  const askText = done ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l3-s1">
          <div className="l3-s1-box" ref={boxRef}>
          <div className="l3-pair">
            <ListSheet kind="ul" items={things} marks={done} ghost={!done} fresh={done && !solved} title={pick(UI.things)} hl={done && speaker.text === c.magicUl} />
            <ListSheet kind="ol" items={steps} marks={done} ghost={!done} fresh={done && !solved} title={pick(UI.cocoa)} hl={done && speaker.text === c.magicOl} />
          </div>
          {!done ? (
            <div className="l3-pile">
              {S1_PILE.map((x) => (
                <span key={x.k} data-k={x.k} className="l3-strip l3-pile-strip" style={{ left: x.l + '%', top: x.t + '%', rotate: x.r + 'deg' }}>{textOf(x.k)}</span>
              ))}
            </div>
          ) : null}
          </div>
        </div>
        {!done ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap || phase !== 'pile'} onClick={sortIt}>{pick(UI.sort)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S2. ПЛАН — четыре карточки открываются сами, пока Коди о них говорит.
// =============================================================================
const CARD_C = [KZ.teal, KZ.mustard, KZ.coral, 'var(--kz-piece)'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }].concat(c.cards.map((k) => ({ text: k.say, pose: 'point' })), [{ text: c.done, pose: 'smile' }]));
  const [open, setOpen] = useState(solved ? 4 : 0);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const reach = (n) => { if (n <= open) return; setOpen(n); sfx('pop', true); if (n === 4) put({ done: true }); };
  useEffect(() => {
    const i = c.cards.findIndex((k) => k.say === speaker.text);
    reach(i >= 0 ? i + 1 : speaker.text === c.done ? 4 : 0);
  }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (spoken) reach(4); }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const again = (i) => { if (canTap && i < open) sayNow(c.cards[i].say, 'point'); };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={c.ask} n={open + '/4'} />
        <div className="kz-plan">
          {c.cards.map((card, i) => {
            const on = i < open;
            const now = on && speaker.text === card.say;
            return (
              <button key={i} type="button" className={'kz-card' + (on ? ' is-open' : '')} disabled={!on || !canTap} onClick={() => again(i)}
                aria-label={on ? pick(card.title) : String(i + 1)} style={{ '--dl': (i * 0.12) + 's' }}>
                <Cut c={on ? CARD_C[i] : 'var(--kz-piece)'} seed={90 + i} n={9} amp={3} asp={1.6} cls="kz-card-cut kz-a-drop" r={i % 2 ? 1.2 : -1.4} dl={i * 0.12} hl={now} hlc={KZ.ink}>
                  <span className="kz-card-face" key={on ? 'o' : 'c'}>
                    {on ? <span className="kz-a-stamp">{pick(card.title)}</span> : <span className="kz-card-n">{i + 1}</span>}
                  </span>
                </Cut>
              </button>
            );
          })}
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S3. ПУНКТЫ СПИСКА — вещи стоят внутри ul без li: браузер честно склеил их в
// одну строку без точек. Показ: вещи по очереди загораются — каждая оборачивается в li,
// в окне у неё появляется точка. Потом Коди называет ul и li (подсветка за речью).
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [wrapped, setWrapped] = useState(solved ? [true, true, true] : [false, false, false]);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.doneUl, pose: 'explain' }, { text: c.doneLi, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayLi, pose: 'point' }]);
  const n = wrapped.filter(Boolean).length;
  const wrap = (k) => { setWrapped((w) => { const x = w.slice(); x[k] = true; return x; }); sfx('pop', true); };
  const codeRef = useRef(null);
  const line = () => codeRef.current && codeRef.current.querySelector('.kz-line.l3-hline');
  // Показ: вещи по очереди загораются — каждая оборачивается в li.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: line, act: () => wrap(0) },
    { look: line, act: () => wrap(1) },
    { look: line, act: () => { wrap(2); } },
    { say: [{ text: c.doneUl, pose: 'explain' }, { text: c.doneLi, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const things = TRIP.things.map(pick);
  const glued = speaker.text === c.say && !solved;
  const hlUl = speaker.text === c.doneUl;
  const hlLi = speaker.text === c.doneLi;
  const nextK = wrapped.findIndex((x) => !x);
  const kids = things.map((s, k) => (wrapped[k] ? { li: true, s, k: 'i' + k, cls: 'kz-a-stamp', hl: hlLi } : { txt: s, k: 't' + k }));
  const ulLine = (close) => ({ k: close ? 'uc' : 'uo', d: 0, cls: hlUl ? 'is-read' : '', parts: [T_('ul', close)] });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={n === 3 ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={n === 3 ? c.askDone : c.ask} n={n === 3 ? null : n + '/3'} />
        <div className="kz-scene l3-duo">
          <div className="kz-col" ref={codeRef}>
            <KzCode lines={[ulLine(false)].concat(things.map((s, k) => ({
              k: 'l' + k + (wrapped[k] ? 'w' : ''), d: 1, cls: wrapped[k] ? 'is-new' + (hlLi ? ' is-read' : '') : 'l3-hline' + (k === nextK && speaker.text === c.sayLi ? ' is-read' : ''),
              parts: wrapped[k] ? liParts(s) : [W_(s)]
            }))).concat([ulLine(true)])} />
          </div>
          <div className="kz-col">
            <PaperBrowser title={pick(TRIP.title)} short cls="l3-br" pageHl={glued}><ListPage blocks={[{ t: 'ul', kids, hl: hlUl }]} /></PaperBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S4. ДОБАВЬ ПУНКТ — «спальник» внутри ul, но без li: в окне он без точки (на её
// месте мигает «?»). Два поля вокруг слова; кнопки < / li > вставляют в поле
// с курсором. Набранный <li> без </li> браузер уже считает пунктом (честно).
// =============================================================================
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
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
  const check = () => {
    if (!canTap || okNow || (!sl.a.val.trim() && !sl.b.val.trim())) return;
    st.current.tries += 1;
    const issue = wrapIssue3(sl.a.val, sl.b.val, 'li', ITEM_MSGS);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's4', type: 'wrap-li', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const things = TRIP.things.map(pick);
  const w = pick(c.word);
  const isLi = okNow || normT(sl.a.val) === '<li>';
  const kids = things.map((s, k) => ({ li: true, s, k: 'i' + k })).concat([isLi ? { li: true, s: w, k: 'new', cls: 'kz-a-stamp' } : { txt: w, k: 'new', miss: true }]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(TRIP.title)} short cls="l3-br" pageHl={!okNow}><ListPage blocks={[{ t: 'ul', kids }]} /></PaperBrowser>
            <KzCode lines={[
              { k: 'uo', d: 0, cls: 'l3-edge', parts: [T_('ul')] },
              ...things.map((s, k) => ({ k: 'l' + k, d: 1, cls: k < 2 ? 'l3-ctx' : '', parts: liParts(s) })),
              { k: 'x', d: 1, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? liParts(w) : [
                <Slot key="a" ty={sl.a} on={sl.act === 'a'} onFocus={() => sl.setAct('a')} blink={!okNow && led} label={c.ask} onEnter={check} />,
                W_(w),
                <Slot key="z" ty={sl.b} on={sl.act === 'b'} onFocus={() => sl.setAct('b')} blink={!okNow && led} label={c.ask} onEnter={check} />] },
              { k: 'uc', d: 0, cls: 'l3-edge', parts: [T_('ul', true)] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'li', '>']} ty={sl.ty} canTap={canTap} onCheck={check} ready={sl.a.val.trim().length > 3 && sl.b.val.trim().length > 4} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S5. СКОЛЬКО ТОЧЕК? — кусок списка; ученик отвечает 1, 2 или 3, браузер
// показывает правду. Ловушки: два li в одной строке; один li на две строки;
// текст без li. Промах — дополнительный раунд того же типа.
// =============================================================================
// Токены строки: l — <li>слово</li>; o — <li>слово (пункт открыт); c — слово</li>; t — слово без li.
const S5_ROUNDS = [
  { lines: [['l0', 'l1']], dots: 2, type: 'many' },
  { lines: [['o2'], ['c3']], dots: 1, type: 'one' },
  { lines: [['l4'], ['t0'], ['l5']], dots: 2, type: 'bare' }
];
const S5_EXTRA = [
  { lines: [['l3', 'l2', 'l1']], dots: 3, type: 'many' },
  { lines: [['o0'], ['c1']], dots: 1, type: 'one' },
  { lines: [['t2'], ['l4'], ['t3']], dots: 1, type: 'bare' }
];
function tokParts(tok, pick) {
  const w = pick(WORDS[Number(tok.slice(1))]);
  if (tok[0] === 'l') return liParts(w);
  if (tok[0] === 'o') return [T_('li'), W_(w)];
  if (tok[0] === 'c') return [W_(w), T_('li', true)];
  return [W_(w)];
}
function tokKids(rd, pick) {
  const out = [];
  let cur = null;
  rd.lines.forEach((ln) => ln.forEach((tok) => {
    const w = pick(WORDS[Number(tok.slice(1))]);
    if (tok[0] === 'l') { out.push({ li: true, s: w }); cur = null; }
    else if (tok[0] === 'o') { cur = { li: true, s: w }; out.push(cur); }
    else if (tok[0] === 'c' && cur) { cur.s += ' ' + w; cur = null; }
    else if (cur) cur.s += ' ' + w;
    else out.push({ txt: w });
  }));
  return out;
}
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (ans ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S5_EXTRA : S5_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const answer = (k) => {
    if (!canTap || !round || ans) return;
    const right = k === R.dots;
    setAns(k);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.unshift({ i: round.i, extra: true });
    const line = right ? c.ok : c.miss[R.type];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's5.r' + (ii + 1), type: 'predict', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            {R ? (
              <div className="kz-slip-wrap" key={'s' + doneN}>
                <KzCode cls="kz-code-sm" lines={[{ k: 'uo', d: 0, cls: 'kz-a-drop', parts: [T_('ul')] }]
                  .concat(R.lines.map((ln, j) => ({ k: 'r' + j, d: 1, cls: 'kz-a-drop', parts: [].concat(...ln.map((tok) => tokParts(tok, pick))) })))
                  .concat([{ k: 'uc', d: 0, cls: 'kz-a-drop', parts: [T_('ul', true)] }])} />
              </div>
            ) : null}
            <PaperBrowser title={pick(TRIP.title)} short cls="l3-br" pageHl={!!ans}>
              {ans && R ? <ListPage blocks={[{ t: 'ul', kids: tokKids(R, pick) }]} anim /> : <div className="l3-qmark" aria-hidden="true">?</div>}
            </PaperBrowser>
          </div>
        </div>
        {round ? (
          <div className="kz-pick l3-pick3">
            {[1, 2, 3].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn ' + (ans === k ? (k === R.dots ? 'is-ok' : 'is-off') : ans && k === R.dots ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}>{k}<Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S6. СПИСОК С НОМЕРАМИ — рецепт какао в ol. Показ: строки кода сами
// ступенчато меняются местами, номера в окне остаются 1, 2, 3 — шаги
// перепутались, над окном «?!». Потом строки встают на места сами.
// =============================================================================
const S6_MIX = [2, 0, 1];
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'back' : 'calm');   // calm · mixed · back
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayN, pose: 'point' }]);
  // Показ: строки сами перемешиваются — шаги путаются, Коди удивляется; потом встают на места.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setPhase('mixed'); } },
    { say: [{ text: c.mixed, pose: 'wonder' }] },
    { wait: reduceMotion() ? 200 : 700 },
    { act: () => { sfx('pop', true); setPhase('back'); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const steps = TRIP.steps.map(pick);
  const order = phase === 'mixed' ? S6_MIX : [0, 1, 2];
  const hlOl = speaker.text === c.say;
  const hlNum = speaker.text === c.sayN;
  const askText = phase === 'back' ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l3-duo">
          <div className="kz-col">
            <KzCode lines={[{ k: 'oo', d: 0, cls: hlOl ? 'is-read' : '', parts: [T_('ol')] }]
              .concat(order.map((i) => ({ k: 's' + i, d: 1, cls: phase === 'mixed' ? 'l3-moved' : '', parts: liParts(steps[i]) })))
              .concat([{ k: 'oc', d: 0, cls: hlOl ? 'is-read' : '', parts: [T_('ol', true)] }])} />
          </div>
          <div className="kz-col l3-br-wrap">
            <PaperBrowser title={pick(TRIP.title)} short cls={'l3-br' + (phase === 'mixed' ? ' l3-broken' : '')} pageHl={hlOl}>
              <ListPage blocks={[{ t: 'ol', cls: hlNum ? 'is-hlmk' : '', kids: order.map((i) => ({ li: true, s: steps[i], k: 's' + i })) }]} />
            </PaperBrowser>
            {phase === 'mixed' ? <span className="l3-oops kz-a-stamp" aria-hidden="true">?!</span> : null}
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S7. ДОБАВЬ НОМЕРА — шаги сборки рюкзака без тегов списка: в окне пункты висят
// без отступа. Ученик пишет <ol> сверху и </ol> снизу. Окно честно меняется по
// ходу набора: с <ol> — номера, с <ul> — точки.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
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
  const check = () => {
    if (!canTap || okNow || (!sl.a.val.trim() && !sl.b.val.trim())) return;
    st.current.tries += 1;
    const issue = wrapIssue3(sl.a.val, sl.b.val, 'ol', LIST_MSGS);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's7', type: 'wrap-ol', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const steps = c.steps.map(pick);
  const a = normT(sl.a.val);
  const kind = okNow || a === '<ol>' ? 'ol' : a === '<ul>' ? 'ul' : null;
  const blocks = kind ? [{ t: kind, k: kind, cls: okNow ? 'kz-a-stamp' : '', kids: steps.map((s, i) => ({ li: true, s, k: 's' + i })) }]
    : steps.map((s, i) => ({ t: 'stray', s, k: 'x' + i }));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(c.title)} short cls="l3-br" pageHl={!okNow}><ListPage blocks={blocks} /></PaperBrowser>
            <KzCode lines={[
              { k: 'a', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? [T_('ol')] : [<Slot key="a" ty={sl.a} on={sl.act === 'a'} onFocus={() => sl.setAct('a')} blink={!okNow && led} label={c.ask} onEnter={check} miss />] },
              ...steps.map((s, i) => ({ k: 's' + i, d: 1, cls: 'l3-step', parts: liParts(s) })),
              { k: 'z', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? [T_('ol', true)] : [<Slot key="z" ty={sl.b} on={sl.act === 'b'} onFocus={() => sl.setAct('b')} blink={!okNow && led} label={c.ask} onEnter={check} miss />] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'ol', '>']} ty={sl.ty} canTap={canTap} onCheck={check} ready={sl.a.val.trim().length > 3 && sl.b.val.trim().length > 4} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S8. ul ИЛИ ol? — четыре карточки-списка; перетащить на бирюзовый лист ul или
// горчичный ol (или нажать карточку, потом лист). На листе карточка получает
// точки или номера. Не туда — карточка трясётся, Коди называет причину.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [placed, setPlaced] = useState(solved ? c.cards.map((k) => k.id) : []);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = placed.length === c.cards.length;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, placed.length * 10 + (sel ? 1 : 0));
  const cardOf = (id) => c.cards.find((k) => k.id === id);
  const place = (id, where) => {
    if (!canTap || done || !id || placed.indexOf(id) >= 0 || (where !== 'ul' && where !== 'ol')) return false;
    st.current.tries += 1;
    const card = cardOf(id);
    if (card.want !== where) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(card.why); sayNow(card.why, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const np = placed.concat(id);
    setPlaced(np); setSel(null); setMsg(null);
    if (np.length === c.cards.length) {
      put({ done: true });
      log({ screenId: 's8', type: 'sort-lists', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const tapSheet = (kind) => { if (!sel) { if (!done) setMsg(c.pickFirst); return; } place(sel, kind); };
  const trayRef = useRef(null);
  const pairRef = useRef(null);
  const nextId = (c.cards.find((k) => placed.indexOf(k.id) < 0) || {}).id || null;
  const lit = lad.lv >= 3;
  const nextWant = nextId ? cardOf(nextId).want : null;
  const mini = (card, kind) => (
    <div key={card.id} className="l3-mini kz-a-stamp">
      <b>{pick(card.title)}</b>
      {pick(card.items).map((s, i) => <span key={i} className="l3-mini-i"><i className={'l3-dot' + (kind === 'ol' ? ' is-num' : '')}>{kind === 'ol' ? i + 1 : ''}</i>{s}</span>)}
    </div>
  );
  const sheetFor = (kind) => (
    <button type="button" className="l3-sheet-btn" onClick={() => tapSheet(kind)} disabled={!canTap || done} data-place={kind}>
      <ListSheet kind={kind} tag marks={false} hover={dnd.hover === kind} call={!!(dnd.active || sel) && !done} hl={lit && nextWant === kind}>
        {placed.filter((id) => cardOf(id).want === kind).map((id) => mini(cardOf(id), kind))}
        {!placed.some((id) => cardOf(id).want === kind) ? <span className="l3-sheet-empty" /> : null}
      </ListSheet>
      <Led on={!!sel && led && !done} />
    </button>
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} n={done ? null : placed.length + '/4'} />
        <div className={'kz-scene l3-s8' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="l3-pair" ref={pairRef}>{sheetFor('ul')}{sheetFor('ol')}</div>
        </div>
        {!done ? (
          <div ref={trayRef} className="kz-tray l3-cards">
            {c.cards.map((card, i) => {
              if (placed.indexOf(card.id) >= 0) return null;
              return (
                <button key={card.id} type="button" disabled={!canTap || done} data-id={card.id}
                  className={'l3-card' + (sel === card.id ? ' is-sel' : '') + (shake === card.id ? ' kz-a-shake' : '') + (lit && card.id === nextId ? ' is-led' : '')}
                  style={{ '--r': ((i % 2 ? 1 : -1) * (1 + i * 0.4)) + 'deg' }}
                  onPointerDown={(e) => { if (canTap && !done) dnd.start(e, card.id, pick(card.title)); }}
                  onClick={() => { setSel(sel === card.id ? null : card.id); setMsg(null); sfx('tap', true); }}>
                  <b>{pick(card.title)}</b>
                  <span>{pick(card.items).join(', ')}</span>
                  <Led on={led && !sel && card.id === nextId} />
                </button>
              );
            })}
          </div>
        ) : null}
        <KzHand label={nextId ? pick(cardOf(nextId).title) : ''} run={canTap && !done && !sel && !dnd.active && placed.length === 0}
          targets={[() => trayRef.current && trayRef.current.querySelector('[data-id="shop"]'), () => pairRef.current && pairRef.current.querySelector('[data-place="ul"]')]} />
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S9. ПУНКТ ВНУТРИ СПИСКА — li «бутерброды» стоит после </ul>: в окне он без
// отступа, не в ряд с остальными. Показ: выпавшая строка загорается и перелетает
// в место внутри списка, Коди объясняет.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [inside, setInside] = useState(solved);
  const [sel, setSel] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayDo, pose: 'point' }]);
  const codeRef = useRef(null);
  const at = (q) => () => codeRef.current && codeRef.current.querySelector(q);
  // Показ: загорается выпавший пункт, потом место внутри списка — строка перелетает на место.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: at('.l3-stray-line'), act: () => { sfx('tap', true); setSel(true); } },
    { look: at('[data-place="in"]'), act: () => { if (!reduceMotion()) kzFly(at('.l3-stray-line')(), at('[data-place="in"]')(), 700); } },
    { wait: reduceMotion() ? 0 : 720 },
    { act: () => { sfx('win', true); setInside(true); setSel(false); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const things = TRIP.things.map(pick);
  const lines = [
    { k: 'uo', d: 0, parts: [T_('ul')] },
    { k: 'l0', d: 1, parts: liParts(things[0]) },
    { k: 'l1', d: 1, parts: liParts(things[1]) },
    inside ? { k: 'l2', d: 1, cls: 'is-new', parts: liParts(things[2]) }
      : { k: 'gap', d: 1, place: 'in', cls: 'l3-dropline' + (sel ? ' is-call' : ''), parts: [<span key="d" className="kz-dash l3-dash" />] },
    { k: 'uc', d: 0, parts: [T_('ul', true)] },
    inside ? null : { k: 'stray', d: 0, cls: 'l3-stray-line' + (sel ? ' is-sel' : ''), parts: liParts(things[2]) }
  ].filter(Boolean);
  const blocks = [{ t: 'ul', kids: things.slice(0, inside ? 3 : 2).map((s, i) => ({ li: true, s, k: 'i' + i, cls: inside && i === 2 ? 'kz-a-stamp' : '' })) }]
    .concat(inside ? [] : [{ t: 'stray', s: things[2], k: 'st', hl: speaker.text === c.say }]);
  const askText = inside ? c.done : sel ? c.askPlace : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l3-duo">
          <div className="kz-col" ref={codeRef}>
            <KzCode lines={lines} />
          </div>
          <div className="kz-col">
            <PaperBrowser title={pick(TRIP.title)} short cls="l3-br"><ListPage blocks={blocks} /></PaperBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S10. ЗАКРОЙ СПИСОК — нет </ul>: абзац «Сбор в восемь утра» браузер честно
// кладёт внутрь списка, он сдвинут вправо. Ученик набирает </ul>.
// =============================================================================
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const blink = !okNow && (speaker.text === c.say || led);
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const issue = tagTypingIssue(ty.val, 'ul', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's10', type: 'write-closing', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const things = TRIP.things.map(pick);
  const note = pick(c.note);
  const kids = things.map((s, i) => ({ li: true, s, k: 'i' + i }));
  const blocks = okNow ? [{ t: 'ul', kids }, { t: 'p', s: note, k: 'p', cls: 'kz-a-stamp' }]
    : [{ t: 'ul', kids: kids.concat([{ p: note, k: 'p', hl: true }]) }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(TRIP.title)} short cls={'l3-br' + (okNow ? '' : ' l3-broken')} pageHl={!okNow}><ListPage blocks={blocks} /></PaperBrowser>
            <KzCode lines={[
              { k: 'uo', d: 0, parts: [T_('ul')] },
              ...things.map((s, i) => ({ k: 'l' + i, d: 1, cls: i < 2 ? 'l3-ctx' : '', parts: liParts(s) })),
              { k: 'gap', d: 0, cls: okNow ? 'is-new' : 'is-gap', parts: [okNow ? <span key="c" className="kz-a-stamp">{T_('ul', true)}</span> : (
                <span key="g" className={'kz-gap' + (blink ? ' kz-gap-led' : '') + (ty.val ? '' : ' l3-q')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={12} cls="kz-tag-in" />
                </span>)] },
              { k: 'p', d: 0, parts: [T_('p'), W_(note), T_('p', true)] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'ul', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 4} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S11. НАЙДИ ПОЛОМКУ — Коди написал списки, в каждом одна поломка; браузер
// честно её показывает. Нажать сломанную строку. Верно — строка чинится, окно
// меняется. Не та — строка вздрагивает, Коди подсказывает смотреть в окно;
// промах в раунде — в конце ещё раунд того же типа.
// =============================================================================
// Строки: U / u — <ul> / </ul>; l — <li>слово</li>; t — слово без li; O — <li>слово<li>.
const S11_ROUNDS = [
  { type: 'bare', lines: ['U', 'l0', 't1', 'l2', 'u'], bad: 2 },
  { type: 'out', lines: ['U', 'l3', 'l4', 'u', 'l0'], bad: 4 },
  { type: 'open', lines: ['U', 'l2', 'O1', 'l3', 'u'], bad: 2 }
];
const S11_EXTRA = [
  { type: 'bare', lines: ['U', 't4', 'l5', 'l0', 'u'], bad: 1 },
  { type: 'out', lines: ['U', 'l1', 'l5', 'u', 'l2'], bad: 4 },
  { type: 'open', lines: ['U', 'O3', 'l4', 'u'], bad: 1 }
];
// Исправленный вариант: строка без li получает li, выпавший li встаёт внутрь, <li> → </li>.
const s11Fixed = (rd) => {
  if (rd.type === 'out') { const ls = rd.lines.slice(0, -1); ls.splice(ls.length - 1, 0, rd.lines[rd.lines.length - 1]); return ls; }
  return rd.lines.map((x, i) => (i === rd.bad ? 'l' + x.slice(1) : x));
};
function s11LineParts(x, pick) {
  if (x === 'U' || x === 'u') return [T_('ul', x === 'u')];
  const w = pick(WORDS[Number(x.slice(1))]);
  if (x[0] === 'l') return liParts(w);
  if (x[0] === 'O') return [T_('li'), W_(w), T_('li')];
  return [W_(w)];
}
// Как покажет браузер: li внутри списка — пункт, текст — без точки, после </ul> — без отступа.
function s11Blocks(lines, pick) {
  const out = [];
  let list = null;
  lines.forEach((x) => {
    if (x === 'U') { list = { t: 'ul', kids: [], k: 'ul' }; out.push(list); return; }
    if (x === 'u') { list = null; return; }
    const w = pick(WORDS[Number(x.slice(1))]);
    if (x[0] === 't') { if (list) list.kids.push({ txt: w }); else out.push({ t: 'p', s: w }); return; }
    if (!list) { out.push({ t: 'stray', s: w, k: 'st' + out.length }); return; }
    list.kids.push({ li: true, s: w });
    if (x[0] === 'O') list.kids.push({ li: true, s: '' });
  });
  return out;
}
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [fixed, setFixed] = useState(false);
  const [shake, setShake] = useState(null);
  const [missed, setMissed] = useState(false);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'embarrassed' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (fixed ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S11_EXTRA : S11_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !fixed, doneN * 10 + (missed ? 1 : 0));
  const tap = (j) => {
    if (!canTap || !round || fixed) return;
    if (j !== R.bad) {
      sfx('soft', true); setShake(j); setTimeout(() => setShake(null), 520);
      setMissed(true); sayNow(c.fine, 'think');
      return;
    }
    sfx('ok', true); setFixed(true);
    stats.current.push({ i: round.i, extra: !!round.extra, right: !missed });
    const rest = queue.slice(1);
    if (missed && !round.extra) rest.push({ i: round.i, extra: true });
    const line = c.ok[R.type];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's11.r' + (ii + 1), type: 'find-bug', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
      });
      put({ done: true }); setQueue([]);
      sayNow(joinL(line, c.done), 'smile');
      return;
    }
    sayNow(line, 'smile');
    setPending(rest);
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setFixed(false); setMissed(false); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const lines = R ? (fixed ? s11Fixed(R) : R.lines) : [];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene l3-duo" key={'r' + doneN}>
            <div className="kz-col">
              <KzCode cls="kz-code-sm" lines={lines.map((x, j) => ({
                k: 'x' + j + x + (fixed ? 'f' : ''), d: x === 'U' || x === 'u' ? 0 : (R.type === 'out' && !fixed && j === R.bad ? 0 : 1),
                cls: 'kz-a-drop' + (fixed && j === (R.type === 'out' ? lines.length - 2 : R.bad) ? ' is-new' : '') + (shake === j ? ' kz-a-shake' : ''),
                onTap: fixed ? null : () => tap(j), disabled: !canTap || fixed,
                parts: s11LineParts(x, pick)
              }))} />
            </div>
            <div className="kz-col">
              <PaperBrowser title={pick(TRIP.title)} short cls={'l3-br' + (fixed ? '' : ' l3-broken')}><ListPage blocks={s11Blocks(lines, pick)} /></PaperBrowser>
            </div>
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S12. СВЕРХУ ВНИЗ — показ: браузер сам читает код; части кода страницы похода
// подсвечиваются по очереди, страница собирается в окне.
// =============================================================================
const READ12 = ['h1', 'ul', 'ol'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ12.length : -1);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 800;
  const run = () => { READ12.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  // Показ: части читаются по очереди сами, потом Коди называет порядок.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run },
    { wait: STEP * READ12.length + 200 },
    { act: () => { setRead(READ12.length); } },
    { say: ORDER },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const sayK = spoken ? null : speaker.text === c.order1 ? 'h1' : speaker.text === c.order2 ? 'ul' : speaker.text === c.order3 ? 'ol' : null;
  const cur = read >= 0 && read < READ12.length ? READ12[read] : null;
  const on = (k) => (sayK ? sayK === k : cur === k);
  const things = TRIP.things.map(pick), steps = TRIP.steps.map(pick);
  const lines = [
    { k: 'h1', g: 'h1', d: 0, parts: [T_('h1'), W_(pick(TRIP.title)), T_('h1', true)] },
    { k: 'uo', g: 'ul', d: 0, parts: [T_('ul')] },
    ...things.map((s, i) => ({ k: 'u' + i, g: 'ul', d: 1, parts: liParts(s) })),
    { k: 'uc', g: 'ul', d: 0, parts: [T_('ul', true)] },
    { k: 'oo', g: 'ol', d: 0, parts: [T_('ol')] },
    ...steps.map((s, i) => ({ k: 'o' + i, g: 'ol', d: 1, parts: liParts(s) })),
    { k: 'oc', g: 'ol', d: 0, parts: [T_('ol', true)] }
  ].map((ln) => Object.assign(ln, { cls: on(ln.g) ? 'is-read' : '' }));
  const at = (k) => read >= READ12.indexOf(k);
  const blocks = [
    at('h1') ? { t: 'h1', s: pick(TRIP.title), hl: on('h1'), k: 'h1' } : null,
    at('ul') ? { t: 'ul', hl: on('ul'), k: 'ul', kids: things.map((s, i) => ({ li: true, s, k: 'u' + i })) } : null,
    at('ol') ? { t: 'ol', hl: on('ol'), k: 'ol', kids: steps.map((s, i) => ({ li: true, s, k: 'o' + i })) } : null
  ].filter(Boolean);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene l3-duo l3-s12">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm l3-code-xs" /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(TRIP.title)} cls="l3-br">{blocks.length ? <ListPage blocks={blocks} anim={!solved} /> : null}</PaperBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S13. НАЗВАНИЕ СПИСКА и S13b. ПУНКТЫ СПИСКА — свой список двумя экранами (одно
// действие на экран): название в h1, потом три пункта, по одному в каждый li.
// Окно меняется сразу при наборе; засчитывается только по «Готово» (useTypedDone
// из набора, как в уроках 1 и 2; заказчик: пауза в наборе не завершает задание).
// =============================================================================
const useMine3 = () => {
  const store = useStore();
  const pick = usePick();
  const items = store.get('myItems') || [];
  const sample = C.s8.cards[2].items;
  return {
    title: store.get('myTitle') || pick(UI.mySite),
    items: [0, 1, 2].map((i) => items[i] || pick(sample)[i]),
    ordered: !!(store.get('s14') || {}).done
  };
};
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const [rec] = useRec('s13');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myTitle', screenId: 's13', type: 'own-list-name', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const blocks = ty.shown ? [{ t: 'h1', s: ty.shown, k: 'h' }] : [];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="l3-br" pageHl={!ty.solved}>{blocks.length ? <ListPage blocks={blocks} /> : null}</PaperBrowser>
            <KzCode cls="kz-code-sm" lines={[
              { k: 'h', d: 0, cls: 'is-hl', parts: [T_('h1'),
                <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={30} /></span>,
                T_('h1', true)] },
              { k: 'uo', d: 0, cls: 'l3-later', parts: [T_('ul')] },
              { k: 'i', d: 1, cls: 'l3-later', parts: [T_('li'), <span key="d" className="kz-dim">…</span>, T_('li', true)] },
              { k: 'uc', d: 0, cls: 'l3-later', parts: [T_('ul', true)] }
            ]} />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </Stage>
  );
}

// Три пункта: «Готово» горит, когда во всех трёх есть слова и нет тегов; похвала и
// событие — один раз; правка после засчёта сохраняется сама.
function S13B({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s13b;
  const mine = useMine3();
  const [rec, put] = useRec('s13b');
  const solved = !!(rec && rec.done);
  const [items, setItems] = useState(() => { const v = store.get('myItems') || []; return [v[0] || '', v[1] || '', v[2] || '']; });
  const [stamp, setStamp] = useState(0);
  const doneRef = useRef(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const ready = items.every((x) => okText(x));
  const led = useIdleLed(canTap && !solved && !ready, items.filter((x) => okText(x)).length);
  useEffect(() => { if (doneRef.current && ready) store.set('myItems', items.map((x) => x.trim())); }, [items]); // eslint-disable-line react-hooks/exhaustive-deps
  const confirm = () => {
    if (!canTap || !ready) return;
    store.set('myItems', items.map((x) => x.trim())); setStamp((v) => v + 1); sfx('ok', true);
    if (!doneRef.current) {
      doneRef.current = true; put({ done: true });
      log({ screenId: 's13b', type: 'own-list-items', correct: true, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
  };
  const setItem = (i, v) => { const n = items.slice(); n[i] = v; setItems(n); };
  const bad = items.some((x) => hasTags(x)) ? UI.noTags : null;
  const shown = items.map((x) => (okText(x) ? x : null));
  const blocks = [{ t: 'h1', s: mine.title, k: 'h' }].concat(shown.some(Boolean)
    ? [{ t: 'ul', k: 'ul' + stamp, kids: shown.map((x, i) => (x ? { li: true, s: x, k: 'i' + i } : null)).filter(Boolean) }] : []);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved && !bad ? null : (bad || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="l3-br" pageHl={!solved}><ListPage blocks={blocks} /></PaperBrowser>
            <KzCode cls="kz-code-sm" lines={[
              { k: 'h', d: 0, cls: 'l3-edge', parts: [T_('h1'), W_(mine.title), T_('h1', true)] },
              { k: 'uo', d: 0, cls: 'l3-edge', parts: [T_('ul')] },
              ...[0, 1, 2].map((i) => ({ k: 'i' + i, d: 1, cls: 'is-hl', parts: [T_('li'),
                <span key="g" className={'kz-gap' + (led && !okText(items[i]) ? ' kz-gap-led' : '')}>
                  <InlineInput value={items[i]} onChange={(v) => setItem(i, v)} onEnter={confirm} placeholder={c.ph} label={c.ask} max={30} />
                </span>, T_('li', true)] })),
              { k: 'uc', d: 0, cls: 'l3-edge', parts: [T_('ul', true)] }
            ]} />
          </div>
        </div>
        <ReadyBtn on={canTap && ready} glow={canTap && ready && !solved} onClick={confirm} />
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S14. ЭТО ТВОЙ ТОП — свой список ученика с ul; топу нужны номера. Перетащить
// (или нажать) нужную бирку на место <ul>: верная — оба тега становятся ol,
// точки ступенчато превращаются в номера.
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
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === '<ol>') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'ul-to-ol', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'smile');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'tag' ? choose(o) : false));
  const kind = okNow ? 'ol' : 'ul';
  const glow = off.length >= 2 ? '<ol>' : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} />
        <div className="kz-scene l3-duo">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="l3-br" pageHl={!okNow}>
              <ListPage blocks={[{ t: 'h1', s: mine.title, k: 'h' }, { t: kind, k: kind, cls: okNow ? 'kz-a-stamp' : '', kids: mine.items.map((s, i) => ({ li: true, s, k: 'i' + i })) }]} />
            </PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode cls="kz-code-sm" lines={[
              { k: 'h', d: 0, cls: 'l3-ctx', parts: [T_('h1'), W_(mine.title), T_('h1', true)] },
              { k: 'uo' + kind, d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: [okNow ? <span key="o" className="kz-a-stamp">{T_('ol')}</span>
                : <span key="t" data-place="tag" className={'l3-droptag' + (dnd.hover === 'tag' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')}>{T_('ul')}</span>] },
              ...mine.items.map((s, i) => ({ k: 'i' + i, d: 1, parts: liParts(s) })),
              { k: 'uc' + kind, d: 0, cls: okNow ? 'is-new' : '', parts: [okNow ? <span key="c" className="kz-a-stamp">{T_('ol', true)}</span> : T_('ul', true)] }
            ]} />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {c.opts.map((o, i) => (
              <button key={o} type="button" disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, o); }}
                className={'kz-scrap kz-scrap-tag' + (off.indexOf(o) >= 0 ? ' is-used' : '') + (glow === o ? ' is-led' : '')} style={{ '--r': ((i - 1) * 2) + 'deg' }}>
                <span translate="no">{o}</span><Led on={led && off.indexOf(o) < 0} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// Q1. ПРОВЕРЬ СЕБЯ — новая страница без образца: два списка без тега списка —
// покупки (порядок не важен) и шаги бутерброда (порядок важен); бирки ul, ol и
// лишняя h1. Ученик сам решает, какой тег какому списку (перетащить или нажать
// тег, потом место). До первой попытки ответ не подсвечен. Не туда — браузер
// честно на миг показывает, что вышло, Коди называет причину, бирка возвращается.
// =============================================================================
const Q1_TAGS = ['ol', 'h1', 'ul'];
const Q1_WANT = { a: 'ul', b: 'ol' };
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? Object.assign({}, Q1_WANT) : { a: null, b: null });
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [peek, setPeek] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = !!(slots.a && slots.b);
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const nFull = (slots.a ? 1 : 0) + (slots.b ? 1 : 0);
  const led = useIdleLed(canTap && !done, nFull + (sel ? 10 : 0));
  const place = (tag, where) => {
    if (!canTap || done || !tag || !where || slots[where]) return false;
    st.current.tries += 1;
    if (Q1_WANT[where] !== tag) {
      st.current.misses += 1;
      sfx('soft', true); setShake(tag); setTimeout(() => setShake(null), 520);
      clearTimeout(peekT.current); setPeek({ where, tag }); peekT.current = setTimeout(() => setPeek(null), 1800);
      const m = tag === 'h1' ? c.why.h1 : where === 'a' ? c.why.aOl : c.why.bUl;
      setMsg(m); setSel(null); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = Object.assign({}, slots, { [where]: tag });
    setSlots(ns); setSel(null); setMsg(null); setPeek(null);
    if (ns.a && ns.b) {
      put({ done: true });
      log({ screenId: 'q1', type: 'ul-or-ol', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((tag, where) => place(tag, where));
  const pickSlot = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const lit = lad.lv >= 3;
  const nextWhere = !slots.a ? 'a' : 'b';
  const A = c.itemsA.map(pick), B = c.itemsB.map(pick);
  // Честная страница: без тега списка пункты li выпадают из ряда; h1 — огромные пункты.
  const tagOf = (where) => slots[where] || (peek && peek.where === where ? peek.tag : null);
  const listBlocks = (where, items) => {
    const t = tagOf(where);
    if (t === 'ul' || t === 'ol') return [{ t, k: where + t, kids: items.map((x, i) => ({ li: true, s: x, k: where + i })) }];
    return items.map((x, i) => ({ t: 'stray', s: x, k: where + 's' + i, cls: t === 'h1' ? 'l3-big' : '' }));
  };
  const blocks = [{ t: 'p', s: pick(c.capA), k: 'ca' }].concat(listBlocks('a', A), [{ t: 'p', s: pick(c.capB), k: 'cb' }], listBlocks('b', B));
  const slot = (where) => (
    <button key={'s' + where} type="button" data-place={where} disabled={!canTap || done || !!slots[where]} onClick={() => pickSlot(where)}
      className={'kz-dash kz-drop kz-q1-slot' + (dnd.hover === where ? ' is-hover' : '') + (dnd.active || sel ? ' is-call' : '')}>
      <Led on={(led && !!sel) || (lit && where === nextWhere)} />
    </button>
  );
  const listLines = (where, items) => [
    { k: where + 'o', d: 0, cls: slots[where] ? 'is-new' : '', parts: slots[where] ? [T_(slots[where])] : [slot(where)] },
    ...items.map((x, i) => ({ k: where + i, d: 1, parts: liParts(x) })),
  ].concat(slots[where] ? [{ k: where + 'c', d: 0, cls: 'is-new', parts: [T_(slots[where], true)] }] : []);
  const hint = hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : nFull + '/2'} />
        <div className={'kz-scene l3-duo l3-q1' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="l3-br" pageHl={!!peek}><ListPage blocks={blocks} /></PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode cls="kz-code-sm l3-code-xs" lines={[{ k: 'pa', d: 0, parts: [T_('p'), W_(pick(c.capA)), T_('p', true)] }].concat(listLines('a', A),
              [{ k: 'pb', d: 0, parts: [T_('p'), W_(pick(c.capB)), T_('p', true)] }], listLines('b', B))} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {Q1_TAGS.map((tg, i) => ((slots.a === tg || slots.b === tg) ? null : (
              <button key={tg} type="button" disabled={!canTap} data-id={tg}
                className={'kz-scrap kz-scrap-tag' + (sel === tg ? ' is-sel' : '') + (shake === tg ? ' kz-a-shake' : '') + (lit && tg === Q1_WANT[nextWhere] ? ' is-led' : '')}
                style={{ '--r': ((i % 2 ? 1 : -1) * 2) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, tg, '<' + tg + '>'); }}
                onClick={() => { setSel(sel === tg ? null : tg); setMsg(null); sfx('tap', true); }}>
                <span translate="no">{'<' + tg + '>'}</span><Led on={led && !sel} />
              </button>
            )))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// Q2. ГДЕ СТОИТ li? — три варианта, верный не первый. До первой попытки ничего
// не подсвечено; неверный вариант гаснет, Коди называет причину, можно снова.
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
  const mine = useMine3();
  const [rec, put] = useRec('q2');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o.id) >= 0) return;
    if (o.right) {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 'q2', type: 'where-li', correct: true, firstTry: off.length === 0 && lad.asked.current === 0, attempts: off.length + 1, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setOff(off.concat(o.id)); setMsg(o.why); sayNow(o.why, 'think');
    if (off.length + 1 >= 2) lad.bump();
  };
  const lit = lad.lv >= 3;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l3-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col kz-q2">
          <div className="kz-col">
            <KzCode lines={[{ k: 'l', d: 0, parts: [<span key="o" className="kz-q2-close">{T_('li')}</span>, W_(mine.items[0]), <span key="c" className="kz-q2-close">{T_('li', true)}</span>] }]} />
            <div className="kz-quiz">
              {c.opts.map((o) => (
                <button key={o.id} type="button" disabled={!canTap || okNow || off.indexOf(o.id) >= 0} onClick={() => choose(o)}
                  className={'kz-btn ' + (okNow && o.right ? 'is-ok' : off.indexOf(o.id) >= 0 ? 'is-off' : 'is-ghost') + (lit && o.right && !okNow ? ' is-led' : '')}>
                  {pick(o.t)}<Led on={led && !okNow && off.indexOf(o.id) < 0} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S15. ВЫВОД — свой список ученика в бумажном браузере; роли ul, ol, li
// загораются, пока Коди их называет. Единственный праздник урока.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine3();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const kind = mine.ordered ? 'ol' : 'ul';
  const blocks = [
    { t: 'h1', s: mine.title, k: 'h' },
    { t: kind, k: kind, hl: curK === kind, kids: mine.items.map((s, i) => ({ li: true, s, k: 'i' + i, hl: curK === 'li' })) }
  ];
  const things = TRIP.things.map(pick), steps = TRIP.steps.map(pick);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="l3-sheetpage">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <PaperBrowser title={pick(UI.mySite)} cls="l3-br"><ListPage blocks={blocks} anim /></PaperBrowser>
            <div className="l3-pair l3-pair-sm">
              <ListSheet kind="ul" items={things} tag hl={curK === 'ul'} />
              <ListSheet kind="ol" items={steps} tag hl={curK === 'ol'} />
            </div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['ul', 'ol', 'li'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'ul' ? KZ.teal : k === 'ol' ? KZ.mustard : KZ.coral }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 },
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'PREDICT', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'CHECK-1', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's13b', code: 'LEVEL-4B', Comp: S13B },
  { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 'q1', code: 'CHECK-4', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; название и пункты ученика (myTitle, myItems) остаются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s13b: ['s13b'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — страница ученика: название на вкладке и в h1, свой список.
function lesson3Artifact(store) {
  const t = store.get('myTitle'), items = store.get('myItems');
  if (!t && !items) return null;
  const tag = (store.get('s14') || {}).done ? 'ol' : 'ul';
  const li = (items || []).map((x) => '      <li>' + escHtml(x) + '</li>');
  return { type: 'html-page', title: t || '', text: (items || []).join(', '), items: items || [],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(t || '') + '</title>', '  </head>', '  <body>',
      '    <h1>' + escHtml(t || '') + '</h1>', '    <' + tag + '>'].concat(li, ['    </' + tag + '>', '  </body>', '</html>']).join('\n') };
}

export default function HtmlSpiski({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson3Artifact(store) })
  });
  useParallax();
  usePaperSound();
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
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next), prev: R.i > 0 ? go(R.prev) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
