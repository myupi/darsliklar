// =============================================================================
// ЭКРАНЫ УРОКА 7 «Формы, часть 2: выбор и отправка» (облик «Редактор»). Сделаны с нуля; основа кода — экраны уроков 2–6.
// Типы заданий — по разделу 3а навыка: s3 вписать — s4 строка кода ↔ пункт списка; s6 собрать код — s7 найти пару;
// s9 вписать — s10 до и после; s12, s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет.
// Честный браузер (как Chrome): select — поле со стрелкой, в нём виден первый (или выбранный) пункт, по нажатию —
// список; текст в select без option в список не попадает; textarea — большое поле, текст переносится, в углу —
// уголок для растягивания; текст между тегами textarea — внутри поля; без </textarea> всё, что дальше, тоже
// стало текстом в поле; button — серая кнопка, надпись — между тегами; кнопка в form отправляет анкету —
// сервера нет, поэтому страница просто открывается заново и поля пустеют. Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// СПИСОК (select). opts — пункты; val — выбранный (по умолчанию первый); open — список раскрыт;
// tap(j) — пункты нажимаются (задание); hiItem — подсвеченный пункт.
function Sel({ opts, val, open, tap, hiItem, offItems, led, hl, focus }) {
  const shown = val != null ? val : (opts[0] || '');
  return (
    <span className={'z7-selw' + (open ? ' is-open' : '')}>
      <span className={'z7-sel' + (hl ? ' is-hl' : '') + (focus ? ' is-focus' : '')}><span className="z7-sel-v">{shown || ' '}</span><i className="z7-chev" aria-hidden="true" /></span>
      {open ? (
        <span className="z7-pop">
          {opts.length ? opts.map((o, j) => {
            const c = 'z7-opt' + (o === shown ? ' is-cur' : '') + (hiItem === j ? ' is-hl' : '') + (offItems && offItems.indexOf(j) >= 0 ? ' is-off' : '');
            return tap !== undefined
              ? <button key={j} type="button" className={c + ' z7-map'} disabled={!tap || (offItems && offItems.indexOf(j) >= 0)} onClick={tap ? () => tap(j) : undefined}>{o}<Led on={!!led} /></button>
              : <span key={j} className={c}>{o}</span>;
          }) : <span className="z7-pop-empty" />}
        </span>
      ) : null}
    </span>
  );
}
// БОЛЬШОЕ ПОЛЕ (textarea): текст переносится; ph — серая подсказка; в углу — уголок для растягивания.
const TArea = ({ val, ph, focus, hl, mono }) => (
  <span className={'z7-ta' + (focus ? ' is-focus' : '') + (hl ? ' is-hl' : '') + (mono ? ' is-mono' : '')}>
    {val ? <span className="z7-ta-v">{val}</span> : ph ? <span className="z7-ta-ph">{ph}</span> : <span className="z7-ta-v">{' '}</span>}
    <i className="z7-grip" aria-hidden="true" />
  </span>
);
// КНОПКА (button) — серая кнопка Chrome.
const Btn = ({ text, pressed, hl }) => <span className={'z7-btn' + (pressed ? ' is-down' : '') + (hl ? ' is-hl' : '')}>{text || ' '}</span>;
// Однострочное поле (input) — для сравнения с textarea.
const In1 = ({ val, hl }) => <span className={'z7-in' + (hl ? ' is-hl' : '')}><span className="z7-in-v">{val || ' '}</span></span>;

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
// Страница: блоки { t: 'h1' | 'p' | 'sel' | 'ta' | 'btn' | 'in' | 'none', … , hl, k, cls }.
function PageDoc({ blocks, cls }) {
  const ref = useFitPage(JSON.stringify(blocks.map((b) => [b.t, b.k, b.cls, b.hl, b.parts, b.opts, b.val, b.open, b.ph, b.text, b.pressed, b.focus, b.hiItem, b.offItems])));
  return (
    <div ref={ref} className={'z7-doc' + (cls ? ' ' + cls : '')}>
      {blocks.map((bk, i) => {
        const c = 'z7-blk ' + (/^(sel|ta|btn|in)$/.test(bk.t) ? 'z7-b-' : 'z7-') + bk.t + (bk.hl && (bk.t === 'h1' || bk.t === 'p' || bk.t === 'none') ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '');
        const key = bk.k || i;
        if (bk.t === 'sel') return <div key={key} className={c}><Sel opts={bk.opts} val={bk.val} open={bk.open} tap={bk.tap} hiItem={bk.hiItem} offItems={bk.offItems} led={bk.led} hl={bk.hl} focus={bk.focus} /></div>;
        if (bk.t === 'ta') return <div key={key} className={c}><TArea val={bk.val} ph={bk.ph} focus={bk.focus} hl={bk.hl} mono={bk.mono} /></div>;
        if (bk.t === 'btn') return <div key={key} className={c}><Btn text={bk.text} pressed={bk.pressed} hl={bk.hl} /></div>;
        if (bk.t === 'in') return <div key={key} className={c}><In1 val={bk.val} hl={bk.hl} /></div>;
        if (bk.t === 'none') return <div key={key} className={c}><span className="z7-none" /></div>;
        return <div key={key} className={c}>{bk.parts}</div>;
      })}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url} short={short} cls={'z7-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;

// КОД. Атрибут — свой кусок (z7-att даёт отступ-пробел): на телефоне строка переносится между кусками.
const attrSpan = (n, v, k, last) => <span key={k} className="kz-tag z7-att" translate="no"><span className="z7-attr">{n}</span><span className="kz-tk-b">=</span><span className="z7-val">{'"' + v + '"'}</span>{last ? <span className="kz-tk-b">{'>'}</span> : null}</span>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts }, extra || {});
const textLine = (k, t, w, extra) => codeLine(k, [T_(t), W_(w), T_(t, true)], extra);
const optLine = (k, w, extra) => codeLine(k, [T_('option'), W_(w), T_('option', true)], Object.assign({ d: 1 }, extra || {}));
const tagLine = (k, t, close, extra) => codeLine(k, [T_(t, close)], extra);
const selLines = (opts, pre, extra) => [tagLine((pre || '') + 'so', 'select', false, extra)].concat(opts.map((o, j) => optLine((pre || '') + 'o' + j, o, extra)), [tagLine((pre || '') + 'sc', 'select', true, extra)]);
const taOpen = (ph) => [<span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">textarea</span>{ph ? null : <span className="kz-tk-b">{'>'}</span>}</span>].concat(ph ? [attrSpan('placeholder', ph, 'p', true)] : []);
const taLine = (k, ph, inner, extra) => codeLine(k, taOpen(ph).concat(inner ? [W_(inner)] : [], [T_('textarea', true)]), extra);
const btnLine = (k, text, extra) => textLine(k, 'button', text, extra);
const KNOWN_TAGS = ['img', 'a', 'p', 'h1', 'ul', 'ol', 'li', 'b', 'i', 'input', 'label', 'form', 'select', 'button', 'textarea'];

// =============================================================================
// S1. КРЮЧОК — анкета клуба из урока 6: в поле игры ответы вразнобой, длинный рассказ о себе не влезает
// в одну строку, отправить нечем. «Превратить»: список игр, большое поле и кнопка. Загадка: Коди написал
// игры внутри select без option.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const s = C.site;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(1); put({ done: true });
    tm.current = setTimeout(() => { setOn(2); sfx('pop', true); }, reduceMotion() ? 100 : 1000);
    sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile');
  };
  const games = pick(s.games);
  const blocks = [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.capGame), k: 'cg' },
    on ? { t: 'sel', opts: games, open: on >= 2, k: 'sel', cls: 'z7-a-in' } : { t: 'in', val: 'mainkraft', k: 'ig' },
    { t: 'p', parts: pick(s.capAbout), k: 'ca' },
    on ? { t: 'ta', val: pick(s.about), k: 'ta', cls: 'z7-a-in' } : { t: 'in', val: pick(s.about), k: 'ia' }]
    .concat(on ? [{ t: 'btn', text: pick(s.send), k: 'b', cls: 'z7-a-in', hl: speaker.text === c.magicP }] : []);
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene z7-s1">
          <div className="kz-stagebox z7-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={!!on} /></div></div>
          <div className="kz-col z7-s1-page"><Br title={pick(s.club)} url="klub.html"><PageDoc blocks={blocks} /></Br></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. select И option (показ) — <select></select> — пустой список; пункты option — в поле первый пункт;
// список раскрывается; выбран «Futbol».
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const s = C.site;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 пустой select; 2 пункты; 3 раскрыт; 4 выбран второй
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.saySel, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } },
    { say: [{ text: c.sayOpt, pose: 'explain' }] },
    { act: () => { sfx('tap', true); setN(3); } },
    { wait: reduceMotion() ? 200 : 900 },
    { act: () => { sfx('ok', true); setN(4); } },
    { say: [{ text: c.sayPick, pose: 'smile' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const games = pick(s.games);
  const lines = [textLine('c', 'p', pick(s.capGame), { cls: 'z7-ctx' })]
    .concat(n >= 1 ? (n >= 2 ? selLines(games, '', { cls: n === 2 ? 'is-new' : '' }) : [codeLine('se', [T_('select'), T_('select', true)], { cls: 'is-new' })]) : []);
  lines.forEach((l) => { if (l.parts && l.k.charAt(0) === 'o') l.cls = n === 2 ? 'is-new' : speaker.text === c.sayOpt ? 'is-read' : ''; });
  const blocks = [{ t: 'p', parts: pick(s.capGame), k: 'c' }]
    .concat(n >= 1 ? [{ t: 'sel', opts: n >= 2 ? games : [], val: n >= 4 ? games[1] : null, open: n === 3, hiItem: n === 3 ? 1 : null, hl: true, k: 's', cls: n === 1 ? 'z7-a-in' : '' }] : []);
  const askText = solved || demo.done ? c.askDone : n >= 3 ? c.askPick : n >= 2 ? c.askOpt : c.askSel;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z7-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ ТЕГ ПУНКТА (Fill in the Blanks) — в строке <___>Shaxmat</option> нет имени тега: честно, пункта
// «Shaxmat» в списке нет; option — пункт появляется.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const s = C.site;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const games = pick(s.games);
  const isOpt = okNow || normT(ty.val) === 'option';
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = normT(ty.val);
    const issue = v === 'option' ? null : !v ? c.msgs.empty : /[<>/]/.test(v) ? c.msgs.brackets : v === 'li' ? c.msgs.li : KNOWN_TAGS.indexOf(v) >= 0 ? c.msgs.other : c.msgs.typo;
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-option', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const opts = isOpt ? games : games.slice(0, 2);
  const blocks = [{ t: 'p', parts: pick(s.capGame), k: 'c' }, { t: 'sel', opts, open: true, hiItem: isOpt ? 2 : null, k: 's' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[tagLine('so', 'select'), optLine('o0', games[0], { cls: 'z7-ctx' }), optLine('o1', games[1], { cls: 'z7-ctx' }),
              okNow ? optLine('o2', games[2], { cls: 'is-new' }) : codeLine('o2', [
                <span key="l" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span></span>,
                <span key="g" className={'kz-gap z7-slot z7-slot-tag' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={12} /></span>,
                <span key="r" className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>,
                W_(games[2]), T_('option', true)], { d: 1, cls: 'is-hl' }),
              tagLine('sc', 'select', true)]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 2} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. СТРОКА option ↔ ПУНКТ СПИСКА (Visual Code Mapping) — в коде горит строка option, ученик нажимает её пункт
// в раскрытом списке. Раунд 2: Коди переставил строки — пункты тоже переставились. Раунд 3: новая строка.
// =============================================================================
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const s = C.site;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? 2 : 0);
  const [ans, setAns] = useState(solved ? 3 : null);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const misses = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const g = pick(s.games4);
  const ROUNDS = [{ opts: [g[0], g[1], g[2]], hl: 1 }, { opts: [g[2], g[0], g[1]], hl: 0 }, { opts: [g[2], g[0], g[1], g[3]], hl: 3 }];
  const R = ROUNDS[ri];
  const done = ri === 2 && ans === R.hl;
  const canGo = useAdvanceGate(solved || done, spoken);
  const led = useIdleLed(canTap && ans === null, ri * 10 + off.length);
  // Ступени подсказки — на каждый раунд свои; ошибаться можно несколько раз (со второй ошибки ступень открывается сама).
  const ch = useChoiceHints(!done && ans !== R.hl, ri);
  const gi = [1, 2, 3][ri];
  const ansL = {};
  Object.keys(s.games4).forEach((l) => { ansL[l] = s.games4[l][gi]; });
  const hints = choiceHints(c.hint1, c.hint2, fillL(c.why3, { a: ansL }), ansL);
  const tap = (j) => {
    if (!canTap || ans === R.hl || off.indexOf(j) >= 0) return;
    if (j !== R.hl) {
      misses.current += 1;
      sfx('soft', true); setOff(off.concat(j)); sayNow(ch.miss(c.miss, hints), 'rule');
      return;
    }
    sfx('ok', true); setAns(j); setMsg(null); ch.clear();
    if (ri === 2) {
      put({ done: true });
      log({ screenId: 's4', type: 'map-option', correct: true, firstTry: misses.current === 0, attempts: misses.current + 3, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.ok[ri], c.done), 'smile');
    } else { sayNow(c.ok[ri], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setAns(null); setOff([]); setMsg(null); sayNow(c.rounds[ri + 1], 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const live = ans !== R.hl;
  const lines = [tagLine('so', 'select')].concat(R.opts.map((o, j) => optLine('o' + j, o, { cls: j === R.hl ? 'is-read' : '' })), [tagLine('sc', 'select', true)]);
  const blocks = [{ t: 'p', parts: pick(s.capGame), k: 'c' },
    { t: 'sel', opts: R.opts, open: true, val: R.opts[0], tap: live && canTap ? tap : null, hiItem: ans === R.hl ? R.hl : null, offItems: off, led: live && led, k: 's' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.done : (ch.next(hints) || c.askQ)} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={done ? c.done : c.askQ} hint={done || ans === R.hl ? null : ch.now(hints)} err={ch.err} n={done ? null : (ri + 1) + '/3'} />
        <div className="kz-scene z7-s5" key={'r' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" cls="z7-s4-br"><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. textarea (показ) — длинный рассказ в input: одна строка, конец не виден → textarea: текст переносится,
// уголок для растягивания; закрывающий тег обязателен; текст между тегами — внутри поля.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const s = C.site;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st5, setSt5] = useState(solved ? 2 : 0);   // 0 input; 1 textarea; 2 текст между тегами
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { say: [{ text: c.sayInput, pose: 'think' }] },
    { act: () => { sfx('pop', true); setSt5(1); } },
    { say: [{ text: c.sayTa, pose: 'wonder' }] },
    { act: () => { sfx('pop', true); setSt5(2); } },
    { say: [{ text: c.sayClose, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const about = pick(s.about);
  const hello = pick(s.hello);
  const line = st5 === 0 ? codeLine('i', [<span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">input</span></span>, attrSpan('type', 'text', 't', true)], { cls: 'is-read' })
    : taLine('ta' + st5, null, st5 === 2 ? hello : '', { cls: 'is-new' });
  const blocks = [{ t: 'p', parts: pick(s.capAbout), k: 'c' },
    st5 === 0 ? { t: 'in', val: about, k: 'i', hl: true } : { t: 'ta', val: st5 === 2 ? hello : about, k: 'ta' + st5, hl: true, cls: 'z7-a-in' }];
  const askText = solved || demo.done ? c.askDone : c.asks[st5];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z7-s5">
          <div className="kz-col"><KzCode lines={[textLine('c', 'p', pick(s.capAbout), { cls: 'z7-ctx' }), line]} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ БОЛЬШОЕ ПОЛЕ (Code Builder) — <textarea · placeholder="…" · > · </textarea>; лишний type="text".
// =============================================================================
const S6_ORDER = ['open', 'ph', 'gt', 'close'];
const S6_TRAY = ['gt', 'close', 'type', 'ph', 'open'];
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const s = C.site;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S6_ORDER.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === S6_ORDER.length;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const ph = pick(s.phAbout);
  const TXT = { open: '<textarea', ph: 'placeholder="' + ph + '"', gt: '>', close: '</textarea>', type: 'type="text"' };
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const want = S6_ORDER[got.length];
    if (id !== want) {
      st.current.misses += 1;
      const m = id === 'type' ? c.why.type : c.why[want];
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === S6_ORDER.length) {
      put({ done: true });
      log({ screenId: 's6', type: 'build-textarea', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const nextOk = S6_ORDER[got.length];
  const slot = (i) => (got[i] ? <span key={'s' + i} className={'z7-built z7-a-in' + (got[i] === 'ph' ? ' z7-att z7-attr' : ' kz-tk-n')}>{TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm z7-bslot' + (i === 1 ? ' z7-att' : '') + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  const blocks = [{ t: 'p', parts: pick(s.capAbout), k: 'c' }, done ? { t: 'ta', ph, k: 'ta', hl: true, cls: 'z7-a-in' } : { t: 'none', k: 'n', hl: true }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/4'} />
        <div className={'kz-scene kz-scene-col z7-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('c', 'p', pick(s.capAbout), { cls: 'z7-ctx' }), codeLine('code', S6_ORDER.map((x, i) => slot(i)), { cls: done ? 'is-new' : 'is-hl' })]} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z7-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextOk ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, TXT[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{TXT[id]}</span><Led on={led} />
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
// S7. НАЙДИ ПАРУ (Matching Pairs) — select / option / textarea ↔ маленькая картинка вещи и подпись.
// =============================================================================
const S7_TAGS = ['select', 'option', 'textarea'];
const S7_CARDS = ['textarea', 'select', 'option'];
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const s = C.site;
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
  const games = pick(s.games);
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
  const pic = {
    select: <Sel opts={games} />,
    option: <span className="z7-pop z7-pop-one"><span className="z7-opt is-hl">{games[1]}</span></span>,
    textarea: <TArea val={pick(s.hello)} />
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene z7-match">
          <div className="z7-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code z7-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{t}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z7-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z7-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="z7-mcard-f">{pic[k]}</span>
                  <span className="z7-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z7-mcard-tag" translate="no">{k}</span> : null}
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
// S8. button (показ) — в анкете появляется кнопка «Yuborish»; Коди её нажимает — анкета уходит: сервера нет,
// страница открывается заново, поля пустые.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const s = C.site;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [st8, setSt8] = useState(solved ? 3 : 0);   // 0 без кнопки; 1 кнопка; 2 нажата; 3 страница заново
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setSt8(1); } },
    { say: [{ text: c.sayBtn, pose: 'explain' }] },
    { act: () => { sfx('tap', true); setSt8(2); } },
    { wait: reduceMotion() ? 150 : 450 },
    { act: () => { sfx('ok', true); setSt8(3); } },
    { say: [{ text: c.saySent, pose: 'wonder' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const games = pick(s.games);
  const empty = st8 >= 3;
  const lines = [tagLine('fo', 'form'), textLine('c', 'p', pick(s.capGame), { d: 1, cls: 'z7-ctx' })].concat(selLines(['…'], '', { d: 1, cls: 'z7-ctx' }).slice(0, 1).map((l) => Object.assign(l, { parts: [T_('select'), W_('…'), T_('select', true)] })),
    st8 >= 1 ? [btnLine('b', pick(s.send), { d: 1, cls: st8 === 1 ? 'is-new' : 'is-read' })] : [], [tagLine('fc', 'form', true)]);
  const blocks = [{ t: 'p', parts: pick(s.capGame), k: 'c' }, { t: 'sel', opts: games, val: empty ? games[0] : games[2], k: 's' + (empty ? 'e' : '') },
    { t: 'ta', val: empty ? '' : pick(s.hello), k: 't' + (empty ? 'e' : '') }]
    .concat(st8 >= 1 ? [{ t: 'btn', text: pick(s.send), pressed: st8 === 2, hl: st8 >= 1 && st8 < 3, k: 'b', cls: st8 === 1 ? 'z7-a-in' : '' }] : []);
  const askText = solved || demo.done ? c.askDone : st8 >= 2 ? c.askSent : c.askBtn;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z7-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short cls={st8 === 3 && !solved ? 'z7-reload' : ''}><PageDoc blocks={blocks} key={empty ? 'r' : 'f'} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЗАКРОЙ textarea (Fill in the Blanks) — без </textarea> кнопка стала текстом внутри поля. Ученик пишет
// закрывающий тег; честно: поле пустое, кнопка появилась.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const s = C.site;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 14 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const closed = okNow || tagTypingIssue(ty.val, 'textarea', c.msgs) === null;
  const send = pick(s.send);
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = tagTypingIssue(ty.val, 'textarea', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'close-textarea', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'p', parts: pick(s.capAbout), k: 'c' }, { t: 'ta', val: closed ? '' : '<button>' + send + '</button>\n</form>', mono: !closed, k: 'ta' + (closed ? 'c' : ''), hl: !okNow }]
    .concat(closed ? [{ t: 'btn', text: send, k: 'b', cls: 'z7-a-in' }] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('c', 'p', pick(s.capAbout), { cls: 'z7-ctx' }),
              codeLine('ta', taOpen(null).concat(okNow ? [T_('textarea', true)] : [
                <span key="g" className={'kz-gap z7-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={14} /></span>]), { cls: okNow ? 'is-new' : 'is-hl' }),
              btnLine('b', send, { cls: 'z7-ctx' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 5} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ДО И ПОСЛЕ (Before / After) — в списке стало на пункт больше (option); кнопка вышла из поля
// (</textarea>); под анкетой появилась кнопка (button).
// =============================================================================
const S10_ROUNDS = [{ want: 'opt', g: 3 }, { want: 'close' }, { want: 'btn' }];
const S10_EXTRA = [{ want: 'opt', g: 4 }, { want: 'close' }, { want: 'btn' }];
const S10_BTN = { opt: '<option>', close: '</textarea>', btn: '<button>' };
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const s = C.site;
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
  // Ступени подсказки — на каждый раунд свои; ответ в раунде один (после него виден верный).
  // Ответ — тег на кнопке: 3-я ступень говорит его словами, и верная кнопка загорается.
  const ch = useChoiceHints(!!round && !ans, doneN);
  const hints = R ? [c.hint1, c.hint2[R.want], joinL(c.miss[R.want], c.pick3[R.want])] : null;
  const glow = !!round && !ans && ch.lad.lv >= 3 ? R.want : null;
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
        log({ screenId: 's10.r' + (ii + 1), type: 'before-after', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null, hints: ch.lad.asked.current });
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
  const g = pick(s.games4);
  const send = pick(shownRd && shownRd.extra ? s.join : s.send);
  const view = (after) => {
    if (!R) return null;
    if (R.want === 'opt') return <PageDoc blocks={[{ t: 'sel', opts: g.slice(0, after ? R.g : R.g - 1), open: true, k: 's' }]} />;
    if (R.want === 'close') return <PageDoc blocks={after ? [{ t: 'ta', val: '', k: 't' }, { t: 'btn', text: send, k: 'b' }] : [{ t: 'ta', val: '<button>' + send + '</button>', mono: true, k: 't' }]} />;
    return <PageDoc blocks={[{ t: 'ta', val: '', k: 't' }].concat(after ? [{ t: 'btn', text: send, k: 'b' }] : [])} />;
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? (ch.next(hints) || c.askQ) : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : round && !ans ? ch.now(hints) : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z7-ba kz-a-drop">
                <div className="z7-card"><span className="z7-card-h">{pick(c.before)}</span>{view(false)}</div>
                <span className="z7-ba-arrow" aria-hidden="true" />
                <div className="z7-card is-after"><span className="z7-card-h">{pick(c.after)}</span>{view(true)}</div>
              </div>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick z7-pick3">
            {['opt', 'close', 'btn'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z7-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost') + (glow === k ? ' is-led' : '')}
                onClick={() => answer(k)}><span translate="no">{S10_BTN[k]}</span><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. АНКЕТА ЦЕЛИКОМ (показ) — браузер читает анкету сверху вниз: подпись, список, подпись, большое поле,
// кнопка; строки кода загораются по очереди, вещи встают на свои места.
// =============================================================================
const READ11 = ['g', 'sel', 'a', 'ta', 'btn'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const s = C.site;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ11.length : -1);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 700;
  const run = () => { READ11.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run }, { wait: STEP * READ11.length + 200 }, { act: () => setRead(READ11.length) },
    { say: ORDER }, { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const sayK = spoken ? null : speaker.text === c.order1 ? 'sel' : speaker.text === c.order2 ? 'ta' : speaker.text === c.order3 ? 'btn' : null;
  const cur = read >= 0 && read < READ11.length ? READ11[read] : null;
  const on = (k) => (sayK ? sayK === k : cur === k);
  const at = (k) => read >= READ11.indexOf(k);
  const games = pick(s.games);
  const ph = pick(s.phAbout);
  const lines = [tagLine('fo', 'form'),
    textLine('g', 'p', pick(s.capGame), { d: 1, cls: on('g') ? 'is-read' : '' }),
    codeLine('sel', [T_('select'), W_(games.join(' · ')), T_('select', true)], { d: 1, cls: on('sel') ? 'is-read' : '' }),
    textLine('a', 'p', pick(s.capAbout), { d: 1, cls: on('a') ? 'is-read' : '' }),
    taLine('ta', ph, '', { d: 1, cls: on('ta') ? 'is-read' : '' }),
    btnLine('btn', pick(s.send), { d: 1, cls: on('btn') ? 'is-read' : '' }),
    tagLine('fc', 'form', true)];
  lines[2].parts = [T_('select'), <span key="d" className="kz-txt z7-dots">…</span>, T_('select', true)];
  const blocks = [at('g') ? { t: 'p', parts: pick(s.capGame), k: 'g', hl: on('g') } : null,
    at('sel') ? { t: 'sel', opts: games, k: 'sel', hl: on('sel'), cls: solved ? '' : 'z7-a-in' } : null,
    at('a') ? { t: 'p', parts: pick(s.capAbout), k: 'a', hl: on('a') } : null,
    at('ta') ? { t: 'ta', ph, k: 'ta', hl: on('ta'), cls: solved ? '' : 'z7-a-in' } : null,
    at('btn') ? { t: 'btn', text: pick(s.send), k: 'btn', hl: on('btn'), cls: solved ? '' : 'z7-a-in' } : null].filter(Boolean);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene z7-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html">{blocks.length ? <PageDoc blocks={blocks} /> : null}</Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. СВОЯ КНОПКА и S13. СВОЙ ПУНКТ (Live Code Preview, по «Готово») — своя анкета: надпись на кнопке,
// потом свой пункт в списке.
// =============================================================================
const useMine7 = () => {
  const store = useStore();
  const pick = usePick();
  return { btn: store.get('myBtn') || pick(C.s12.sample), opt: store.get('myOpt') || pick(C.s13.sample) };
};
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const s = C.site;
  const [rec] = useRec('s12');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myBtn', screenId: 's12', type: 'own-button', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'cheer')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const blocks = [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'ta', ph: pick(s.phAbout), k: 't' }, { t: 'btn', text: ty.shown || '', hl: !ty.solved, k: 'b' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.myForm)} url="anketa.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[tagLine('fo', 'form'), taLine('t', pick(s.phAbout), '', { d: 1, cls: 'z7-ctx' }), codeLine('b', [T_('button'),
              <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={24} /></span>, T_('button', true)], { d: 1, cls: 'is-hl' }),
              tagLine('fc', 'form', true)]} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const s = C.site;
  const mine = useMine7();
  const [rec] = useRec('s13');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myOpt', screenId: 's13', type: 'own-option', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'cheer')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const games = pick(s.games).slice(0, 2);
  const opts = games.concat(ty.shown ? [ty.shown] : []);
  const blocks = [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'sel', opts, open: true, hiItem: ty.shown ? 2 : null, k: 's' }, { t: 'btn', text: mine.btn, k: 'b' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.myForm)} url="anketa.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[tagLine('so', 'select', false, { d: 1 }), optLine('o0', games[0], { d: 2, cls: 'z7-ctx' }), optLine('o1', games[1], { d: 2, cls: 'z7-ctx' }),
              codeLine('o2', [T_('option'), <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={24} /></span>, T_('option', true)], { d: 2, cls: 'is-hl' }),
              tagLine('sc', 'select', true, { d: 1 })]} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ПУНКТ ПРОПАЛ (Debug & Fix) — в своём списке Коди дописал «Futbol» без тегов: честно, в списке его нет.
// Перетащить (или нажать) верную строку: <option>…</option>, а не <li> и не <p>.
// =============================================================================
const S14_OPTS = ['li', 'option', 'p'];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const s = C.site;
  const mine = useMine7();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const extra = pick(s.extraGame);
  // Ступени подсказки (лампочка; со второй ошибки — сами); на 3-й верный кусок загорается.
  const ch = useChoiceHints(!okNow, 0);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === 'option') {
      sfx('win', true); setOkNow(true); setMsg(null); ch.clear(); put({ done: true });
      log({ screenId: 's14', type: 'fix-option', correct: true, firstTry: off.length === 0, attempts: off.length + 1, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(c.ok, 'cheer');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.why[o], c.hints), 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const games = pick(s.games).slice(0, 2);
  const opts = games.concat([mine.opt], okNow ? [extra] : []);
  const blocks = [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'sel', opts, open: true, hiItem: okNow ? 3 : null, k: 's' }, { t: 'btn', text: mine.btn, k: 'b' }];
  const piece = (o) => '<' + o + '>' + extra + '</' + o + '>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={okNow ? c.ok : (ch.next(c.hints) || c.ask)} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : ch.now(c.hints)} err={ch.err} />
        <div className="kz-scene z7-s5">
          <div className="kz-col"><Br title={pick(UI.myForm)} url="anketa.html" cls={okNow ? '' : 'z7-broken-br'}><PageDoc blocks={blocks} /></Br></div>
          <div className="kz-col">
            <KzCode lines={[tagLine('so', 'select'), optLine('o0', games[0], { cls: 'z7-ctx' }), optLine('o1', games[1], { cls: 'z7-ctx' }), optLine('o2', mine.opt, { cls: 'z7-ctx' }),
              okNow ? optLine('o3', extra, { cls: 'is-new' }) : codeLine('gap', [
                <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z7-miss' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />,
                <span key="w" className="kz-txt z7-bare">{extra}</span>], { d: 1, cls: 'is-hl' }),
              tagLine('sc', 'select', true)]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {S14_OPTS.map((o) => (
              <button key={o} type="button" data-o={o} disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, piece(o)); }}
                className={'kz-scrap kz-scrap-code' + (off.indexOf(o) >= 0 ? ' is-used' : '') + ((off.length >= 2 || ch.lad.lv >= 3) && o === 'option' ? ' is-led' : '')}>
                <span translate="no">{piece(o)}</span><Led on={led && off.indexOf(o) < 0} />
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
// Q1. НАЙДИ ОШИБКУ (Error Detective) — анкета без образца. Раунд 1: нет </textarea> — кнопка стала текстом
// в поле. Раунд 2: опечатка <opton> — пункта «Futbol» нет в списке. Ученик нажимает строку.
// =============================================================================
const Q1_ROUNDS = [{ bad: 3, kind: 'close' }, { bad: 1, kind: 'opt' }];
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const s = C.site;
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
  const broken = (kind) => !found && R.kind === kind;
  const g = pick(s.games);
  const send = pick(s.send);
  const optTag = broken('opt') ? 'opton' : 'option';
  const noClose = broken('close');
  // Строки-цели: три пункта, textarea, button (select и form — рамка, их не нажимают).
  const targets = [optLine('t0', g[0]), codeLine('t1', [T_(optTag), W_(g[1]), T_(optTag, true)], { d: 1 }), optLine('t2', g[2]),
    noClose ? codeLine('t3', taOpen(null)) : taLine('t3', null, ''), btnLine('t4', send)];
  const lines = [tagLine('so', 'select')].concat(targets.slice(0, 3).map((l, j) => Object.assign(l, { tapI: j })), [tagLine('sc', 'select', true)],
    targets.slice(3).map((l, j) => Object.assign(l, { tapI: j + 3 })));
  const lit = lad.lv >= 3;
  const opts = broken('opt') ? [g[0], g[2]] : g;
  const blocks = [{ t: 'sel', opts, open: true, k: 's' + ri + (found ? 'f' : '') }, { t: 'ta', val: noClose ? '<button>' + send + '</button>' : '', mono: noClose, k: 't' + (noClose ? 'x' : '') }]
    .concat(noClose ? [] : [{ t: 'btn', text: send, k: 'b', cls: found && R.kind === 'close' ? 'z7-a-in' : '' }]);
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene z7-s5 z7-q1" key={'q' + ri}>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" cls={found ? '' : 'z7-broken-br'}><PageDoc blocks={blocks} /></Br></div>
          <div className="kz-col">
            <KzCode lines={lines.map((l) => (l.tapI === undefined ? l : Object.assign(l, {
              cls: 'z7-hline' + (found && l.tapI === R.bad ? ' is-new' : '') + (off.indexOf(l.tapI) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(l.tapI), disabled: !canTap || found || off.indexOf(l.tapI) >= 0,
              led: !found && ((led && off.length === 0 && l.tapI === 0) || (lit && l.tapI === R.bad))
            })))} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q2. ВЕРНО ИЛИ НЕТ (True / False).
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
  const s = C.site;
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
  // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — как читать фразу, 2 — правило урока, 3 — причина и ответ.
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, it.right ? c.yes : c.no);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) {
      st.current.misses += 1;
      sfx('soft', true); setOff(v); sayNow(ch.miss(it.why, hints), 'think');
      return;
    }
    sfx('ok', true); setOk(true); setMsg(null); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'q2', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
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
      className={'kz-btn z7-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = {
    ta: [taLine('c', null, '')],
    btn: [btnLine('c', pick(s.send))],
    bare: [tagLine('so', 'select'), codeLine('w', [W_(pick(s.games)[0])], { d: 1 }), tagLine('sc', 'select', true)]
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z7-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z7-card z7-tf-card kz-a-drop">
              <span className="z7-card-h">{pick(c.card)}</span>
              <p className="z7-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z7-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: у Коди игры написаны внутри select без option — список пустой; своя анкета ученика;
// роли select, option, textarea, button загораются, пока Коди их называет.
// =============================================================================
const S15_ROLES = ['select', 'option', 'textarea', 'button'];
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const s = C.site;
  const mine = useMine7();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const games = pick(s.games).slice(0, 2);
  const blocks = riddle
    ? [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.capGame), k: 'c' }, { t: 'sel', opts: [], open: true, hl: true, k: 'r' }]
    : [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'sel', opts: games.concat([mine.opt]), val: mine.opt, open: curK === 'option', hl: curK === 'select', k: 'm' },
      { t: 'ta', ph: pick(s.phAbout), hl: curK === 'textarea', k: 't' }, { t: 'btn', text: mine.btn, hl: curK === 'button', k: 'b' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z7-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(s.club) : pick(UI.myForm)} url={riddle ? 'klub.html' : 'anketa.html'}><PageDoc blocks={blocks} key={riddle ? 'r' : 'm'} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {S15_ROLES.map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'option') ? ' is-on' : '')}>
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
// «Повторить» стирает только экран; своя анкета ученика (myBtn, myOpt) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — своя анкета ученика: список со своим пунктом, большое поле и своя кнопка.
function lesson7Artifact(store) {
  const btn = store.get('myBtn'), opt = store.get('myOpt');
  if (!btn && !opt) return null;
  return { type: 'html-page', button: btn || '', option: opt || '',
    html: ['<form>', '  <select>', '    <option>Minecraft</option>', '    <option>Futbol</option>', '    <option>' + escHtml(opt || '') + '</option>', '  </select>',
      '  <textarea></textarea>', '  <button>' + escHtml(btn || '') + '</button>', '</form>'].join('\n') };
}

export default function HtmlFormalar2({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson7Artifact(store) })
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
