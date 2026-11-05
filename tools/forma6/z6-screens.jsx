// =============================================================================
// ЭКРАНЫ УРОКА 6 «Формы, часть 1: ввод данных» (облик «Редактор»). Сделаны с нуля; основа кода — экраны уроков 2–5.
// Типы заданий — по разделу 3а навыка: s3 вписать — s4 строка кода ↔ вещь на странице; s6 собрать код — s7 найти пару;
// s9 вписать — s10 до и после; s12, s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет.
// Честный браузер (как Chrome): input — поле с рамкой; type="text" и незнакомый type — видно, что написано;
// password — точки; number — только цифры и стрелки справа; placeholder — серая подсказка, пока поле пустое;
// p и input — подпись над полем; label — подпись и поле в одну строку, нажатие на подпись выбирает поле;
// form на странице не видна. Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// ПОЛЕ — как рисует Chrome. type: 'text' | 'password' | 'number' | что угодно (незнакомое — как text).
function Field({ type, ph, val, focus, hl, cls }) {
  const t = String(type || 'text').toLowerCase();
  const v = val || '';
  const shown = t === 'password' ? '•'.repeat(v.length) : v;
  return (
    <span className={'z6-in' + (t === 'number' ? ' is-num' : '') + (t === 'password' ? ' is-pass' : '') + (focus ? ' is-focus' : '') + (hl ? ' is-hl' : '') + (cls ? ' ' + cls : '')}>
      {v ? <span className="z6-in-v">{shown}</span> : ph ? <span className="z6-in-ph">{ph}</span> : <span className="z6-in-v">{' '}</span>}
      {focus && !v ? <i className="z6-caret" aria-hidden="true" /> : null}
      {t === 'number' ? <i className="z6-spin" aria-hidden="true" /> : null}
    </span>
  );
}

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
// Страница: блоки { t: 'h1' | 'p' | 'fld' | 'lab' | 'none', parts | cap | f, hl, capHl, k, cls }.
// 'fld' — поле на своей строке (после p); 'lab' — label: подпись и поле в одну строку; 'none' — пустое место (тег не узнан).
function PageDoc({ blocks, cls }) {
  const ref = useFitPage(JSON.stringify(blocks.map((b) => [b.t, b.k, b.cls, b.hl, b.capHl, b.cap, b.parts, b.f])));
  return (
    <div ref={ref} className={'z6-doc' + (cls ? ' ' + cls : '')}>
      {blocks.map((bk, i) => {
        const c = 'z6-blk z6-' + bk.t + (bk.hl && bk.t !== 'fld' && bk.t !== 'lab' ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '');
        if (bk.t === 'fld') return <div key={bk.k || i} className={c}><Field {...bk.f} hl={bk.hl} /></div>;
        if (bk.t === 'lab') return <div key={bk.k || i} className={c}><span className={'z6-cap' + (bk.capHl ? ' is-hl' : '')}>{bk.cap}</span>{' '}<Field {...bk.f} hl={bk.hl} /></div>;
        if (bk.t === 'none') return <div key={bk.k || i} className={c}><span className="z6-none" /></div>;
        return <div key={bk.k || i} className={c}>{bk.parts}</div>;
      })}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url} short={short} cls={'z6-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;

// КОД. Каждый атрибут — свой кусок (z6-att даёт отступ-пробел): на телефоне строка переносится между атрибутами.
const attrSpan = (n, v, k, last) => <span key={k} className="kz-tag z6-att" translate="no"><span className="z6-attr">{n}</span><span className="kz-tk-b">=</span><span className="z6-val">{'"' + v + '"'}</span>{last ? <span className="kz-tk-b">{'>'}</span> : null}</span>;
const tagOpen = (sp) => <span key="o" className={'kz-tag' + (sp ? ' z6-att' : '')} translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">input</span></span>;
const tagClose = (k) => <span key={k || 'c'} className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>;
const inputCode = (attrs, sp) => [<span key="o" className={'kz-tag' + (sp ? ' z6-att' : '')} translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">input</span>{attrs.length ? null : <span className="kz-tk-b">{'>'}</span>}</span>]
  .concat(attrs.map((a, j) => attrSpan(a.n, a.v, 'a' + j, j === attrs.length - 1)));
const attrOpen = (n, k) => <span key={k || 'ao'} className="kz-tag z6-att" translate="no"><span className="z6-attr">{n}</span><span className="kz-tk-b">=</span><span className="z6-val">"</span></span>;
const attrClose = (k) => <span key={k || 'ac'} className="kz-tag" translate="no"><span className="z6-val">"</span></span>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts }, extra || {});
const textLine = (k, t, w, extra) => codeLine(k, [T_(t), W_(w), T_(t, true)], extra);
const labelLine = (k, cap, inner, extra) => codeLine(k, [T_('label'), W_(cap)].concat(inner, [T_('label', true)]), extra);
const formOpen = (k) => codeLine(k || 'fo', [T_('form')]);
const formClose = (k) => codeLine(k || 'fc', [T_('form', true)]);
const TYPE_ATTR = (t) => ({ n: 'type', v: t });
const cleanV = (v) => String(v || '').trim().replace(/^["']+|["']+$/g, '');
const KNOWN_TAGS = ['img', 'a', 'p', 'h1', 'h2', 'ul', 'ol', 'li', 'b', 'i', 'html', 'head', 'body', 'title', 'label', 'form'];

// =============================================================================
// S1. КРЮЧОК — страница «Клуб игр»: подписи есть, а писать некуда. «Превратить»: рядом с подписями
// появляются поля, Коди сам их заполняет (пароль — точками). Загадка: Коди прятал пароль через placeholder.
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
    tm.current = setTimeout(() => { setOn(2); sfx('pop', true); }, reduceMotion() ? 100 : 900);
    sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile');
  };
  const full = on >= 2;
  const caps = [['g', pick(s.capGame), 'text', 'Minecraft'], ['a', pick(s.capAge), 'number', '12'], ['p', pick(s.capPass), 'password', 'kodi2026']];
  const blocks = [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.join), k: 'j' }]
    .concat(caps.map(([k, cap, type, v]) => (on ? { t: 'lab', cap, f: { type, val: full ? v : '' }, k, cls: 'z6-a-in', hl: speaker.text === c.magicP && k === 'p' }
      : { t: 'p', parts: cap, k })));
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene z6-s1">
          <div className="kz-stagebox z6-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={!!on} /></div></div>
          <div className="kz-col z6-s1-page"><Br title={pick(s.club)} url="klub.html"><PageDoc blocks={blocks} /></Br></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ТЕГ input И type="text" (показ) — в коде появляется <input> — в окне пустое поле; в поле само
// появляется слово (его пишет посетитель, не код); добавляется type="text" — вид тот же.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const s = C.site;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.sayInput, pose: 'point' }] },
    { act: () => { sfx('tap', true); setN(2); } },
    { say: [{ text: c.sayTyped, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(3); } },
    { say: [{ text: c.sayType, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const lines = [textLine('h', 'h1', pick(s.club), { cls: 'z6-edge' }), textLine('c', 'p', pick(s.capGame), { cls: 'z6-ctx' })]
    .concat(n >= 1 ? [codeLine('i', inputCode(n >= 3 ? [TYPE_ATTR('text')] : []), { cls: 'is-new' + (speaker.text === c.sayType ? ' is-read' : '') })] : []);
  const blocks = [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.capGame), k: 'c' }]
    .concat(n >= 1 ? [{ t: 'fld', f: { type: 'text', val: n >= 2 ? 'Minecraft' : '' }, k: 'i', hl: true, cls: n === 1 ? 'z6-a-in' : '' }] : []);
  const askText = solved || demo.done ? c.askDone : n >= 3 ? c.askType : n >= 2 ? c.askTyped : c.askInput;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z6-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ ТЕГ (Fill in the Blanks) — в строке <___ type="text"> не хватает имени тега. Браузер честный:
// незнакомое имя — на странице ничего; input — появляется поле.
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
  const isInput = okNow || normT(ty.val) === 'input';
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = normT(ty.val);
    const issue = v === 'input' ? null : !v ? c.msgs.empty : /[<>/]/.test(v) ? c.msgs.brackets : KNOWN_TAGS.indexOf(v) >= 0 ? c.msgs.other : c.msgs.typo;
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-input', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.capGame), k: 'c' },
    isInput ? { t: 'fld', f: { type: 'text' }, k: 'i', hl: !okNow, cls: 'z6-a-in' } : { t: 'none', k: 'n', hl: true }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('c', 'p', pick(s.capGame), { cls: 'z6-ctx' }),
              okNow ? codeLine('i', inputCode([TYPE_ATTR('text')]), { cls: 'is-new' }) : codeLine('i', [
                <span key="l" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span></span>,
                <span key="g" className={'kz-gap z6-slot z6-slot-tag' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={12} /></span>,
                attrSpan('type', 'text', 't', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 2} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. СТРОКА КОДА ↔ ВЕЩЬ НА СТРАНИЦЕ (Visual Code Mapping) — на странице загорается вещь (поле или подпись),
// ученик нажимает строку кода, которая её рисует. Два одинаковых input различаются только порядком.
// =============================================================================
const S4_ROUNDS = [{ hl: 'f2', line: 4 }, { hl: 'c1', line: 1 }, { hl: 'f1', line: 2 }];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const s = C.site;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? 2 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const misses = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === 2;
  const canGo = useAdvanceGate(solved || done, spoken);
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const R = S4_ROUNDS[ri];
  // Ступени подсказки — на каждый раунд свои; можно ошибаться несколько раз. На 3-й ступени верная строка загорается.
  const ch = useChoiceHints(!found, ri);
  const hints = [c.hint1, c.hint2[R.hl === 'c1' ? 'cap' : 'fld'], c.hint3[ri]];
  const lit = !found && ch.lad.lv >= 3;
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    if (j !== R.line) {
      misses.current += 1;
      sfx('soft', true); setOff(off.concat(j));
      const m = c.miss[R.hl === 'c1' ? 'cap' : 'fld'];
      sayNow(ch.miss(m, hints), 'rule');
      return;
    }
    sfx('ok', true); setFound(true); setMsg(null); ch.clear();
    if (ri === 2) {
      put({ done: true });
      log({ screenId: 's4', type: 'map-input', correct: true, firstTry: misses.current === 0, attempts: misses.current + 3, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.ok[ri], c.done), 'smile');
    } else { sayNow(c.ok[ri], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); setMsg(null); sayNow(c.rounds[ri + 1], 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const blocks = [{ t: 'h1', parts: pick(s.club), k: 'h' },
    { t: 'p', parts: pick(s.capGame), k: 'c1', hl: R.hl === 'c1' }, { t: 'fld', f: { type: 'text' }, k: 'f1', hl: R.hl === 'f1' },
    { t: 'p', parts: pick(s.capCity), k: 'c2', hl: false }, { t: 'fld', f: { type: 'text' }, k: 'f2', hl: R.hl === 'f2' }];
  const parts = [[T_('h1'), W_(pick(s.club)), T_('h1', true)], [T_('p'), W_(pick(s.capGame)), T_('p', true)], inputCode([TYPE_ATTR('text')]),
    [T_('p'), W_(pick(s.capCity)), T_('p', true)], inputCode([TYPE_ATTR('text')])];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.done : (ch.next(hints) || c.askQ)} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={done ? c.done : c.askQ} hint={done || found ? null : ch.now(hints)} err={ch.err} n={done ? null : (ri + 1) + '/3'} />
        <div className="kz-scene kz-scene-col" key={'r' + ri}>
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" cls="z6-s4-br"><PageDoc blocks={blocks} /></Br>
            <KzCode lines={parts.map((pp, j) => ({
              k: 'l' + j, d: 0, parts: pp,
              cls: 'z6-hline' + (found && j === R.line ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && (lit ? j === R.line : led && off.length === 0 && j === 0)
            }))} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ВИДЫ ПОЛЕЙ (показ) — одно поле меняет type: text (пароль виден всем) → password (точки) → number (цифры
// и стрелки).
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const s = C.site;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st5, setSt5] = useState(solved ? 2 : 0);   // 0 text; 1 password; 2 number
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { say: [{ text: c.sayText, pose: 'wonder' }] },
    { act: () => { sfx('pop', true); setSt5(1); } },
    { say: [{ text: c.sayPass, pose: 'smile' }] },
    { act: () => { sfx('pop', true); setSt5(2); } },
    { say: [{ text: c.sayNum, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const type = ['text', 'password', 'number'][st5];
  const cap = pick(st5 === 2 ? s.capAge : s.capPass);
  const val = st5 === 2 ? '12' : 'kodi2026';
  const blocks = [{ t: 'p', parts: cap, k: 'c' + (st5 === 2 ? 2 : 0) }, { t: 'fld', f: { type, val }, k: 'f' + st5, hl: true, cls: 'z6-a-in' }];
  const askText = solved || demo.done ? c.askDone : c.asks[type];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z6-s5">
          <div className="kz-col"><KzCode lines={[textLine('c', 'p', cap, { cls: 'z6-ctx' }), codeLine('i', inputCode([TYPE_ATTR(type)]), { cls: 'is-read', k: 'i' + st5 })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ ПОЛЕ ПАРОЛЯ (Code Builder) — пять мест: <input · type · = · "password" · >; лишний </input>.
// =============================================================================
const S6_ORDER = ['open', 'type', 'eq', 'val', 'gt'];
const S6_TRAY = ['val', 'gt', 'close', 'type', 'open', 'eq'];
const S6_TXT = { open: '<input', type: 'type', eq: '=', val: '"password"', gt: '>', close: '</input>' };
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
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const want = S6_ORDER[got.length];
    if (id !== want) {
      st.current.misses += 1;
      const m = id === 'close' ? c.why.close : c.why[want];
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
      log({ screenId: 's6', type: 'build-input', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const nextOk = S6_ORDER[got.length];
  const slot = (i) => (got[i] ? <span key={'s' + i} className={'z6-built z6-a-in' + (got[i] === 'type' ? ' z6-att z6-attr' : got[i] === 'val' ? ' z6-val' : ' kz-tk-n')}>{S6_TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm z6-bslot' + (i === 1 ? ' z6-att' : '') + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  const blocks = [{ t: 'p', parts: pick(s.capPass), k: 'c' }, done ? { t: 'fld', f: { type: 'password', val: 'kodi2026' }, k: 'f', hl: true, cls: 'z6-a-in' } : { t: 'none', k: 'n', hl: true }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/5'} />
        <div className={'kz-scene kz-scene-col z6-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('c', 'p', pick(s.capPass), { cls: 'z6-ctx' }), codeLine('code', S6_ORDER.map((x, i) => slot(i)), { cls: done ? 'is-new' : 'is-hl' })]} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z6-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextOk ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, S6_TXT[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{S6_TXT[id]}</span><Led on={led} />
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
// S7. НАЙДИ ПАРУ (Matching Pairs) — значение type ↔ как выглядит поле (маленькое поле и подпись).
// =============================================================================
const S7_TAGS = ['text', 'password', 'number'];
const S7_CARDS = ['password', 'number', 'text'];
const S7_VAL = { text: 'Minecraft', password: 'kodi2026', number: '12' };
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
      log({ screenId: 's7', type: 'match-type', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene z6-match">
          <div className="z6-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code z6-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{t}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z6-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z6-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="z6-mcard-f"><Field type={k} val={S7_VAL[k]} /></span>
                  <span className="z6-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z6-mcard-tag" translate="no">{k}</span> : null}
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
// S8. placeholder (показ) — пустое поле → серая подсказка → посетитель пишет — подсказка исчезает →
// стёр — подсказка вернулась.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const s = C.site;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [st8, setSt8] = useState(solved ? 3 : 0);   // 0 пусто; 1 подсказка; 2 написали; 3 стёрли
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setSt8(1); } },
    { say: [{ text: c.sayPh, pose: 'explain' }] },
    { act: () => { sfx('tap', true); setSt8(2); } },
    { say: [{ text: c.sayTyped, pose: 'wonder' }] },
    { act: () => { sfx('tap', true); setSt8(3); } },
    { say: [{ text: c.sayBack, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const ph = pick(s.phGame);
  const attrs = [TYPE_ATTR('text')].concat(st8 >= 1 ? [{ n: 'placeholder', v: ph }] : []);
  const blocks = [{ t: 'p', parts: pick(s.capGame), k: 'c' }, { t: 'fld', f: { type: 'text', ph: st8 >= 1 ? ph : '', val: st8 === 2 ? 'Futbol' : '', focus: st8 >= 2 }, k: 'f', hl: true }];
  const askText = solved || demo.done ? c.askDone : st8 >= 3 ? c.askBack : st8 >= 2 ? c.askTyped : c.askPh;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z6-s5">
          <div className="kz-col"><KzCode lines={[textLine('c', 'p', pick(s.capGame), { cls: 'z6-ctx' }), codeLine('i', inputCode(attrs), { cls: st8 === 1 ? 'is-new' : 'is-read' })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ВПИШИ АТРИБУТ (Fill in the Blanks) — <input type="text" ___="Masalan, Minecraft">: ученик пишет имя
// атрибута. Честно: с опечаткой атрибут незнаком браузеру — подсказки в поле нет.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const s = C.site;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 16 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const ph = pick(s.phAge);
  const isPh = okNow || normT(ty.val) === 'placeholder';
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = normT(ty.val);
    const issue = v === 'placeholder' ? null : !v ? c.msgs.empty : /[="<>]/.test(v) ? c.msgs.extra : v === 'type' ? c.msgs.type : c.msgs.typo;
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-placeholder', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'p', parts: pick(s.capAge), k: 'c' }, { t: 'fld', f: { type: 'number', ph: isPh ? ph : '' }, k: 'f', hl: !okNow }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('c', 'p', pick(s.capAge), { cls: 'z6-ctx' }),
              okNow ? codeLine('i', inputCode([TYPE_ATTR('number'), { n: 'placeholder', v: ph }]), { cls: 'is-new' }) : codeLine('i', [tagOpen(), attrSpan('type', 'number', 't'),
                <span key="g" className={'kz-gap z6-slot z6-att' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={16} /></span>,
                <span key="v" className="kz-tag" translate="no"><span className="kz-tk-b">=</span><span className="z6-val">{'"' + ph + '"'}</span></span>,
                tagClose()], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ДО И ПОСЛЕ (Before / After) — буквы → точки (type="password"), пустое → серая подсказка (placeholder),
// просто число → число со стрелками (type="number"). Промах — причина и раунд того же вида.
// =============================================================================
const S10_ROUNDS = [{ want: 'pass', cap: 'capPass', val: 'kodi2026' }, { want: 'ph', cap: 'capGame', ph: 'phGame' }, { want: 'num', cap: 'capAge', val: '12' }];
const S10_EXTRA = [{ want: 'pass', cap: 'capPass', val: 'gol2026' }, { want: 'ph', cap: 'capCity', ph: 'phCity' }, { want: 'num', cap: 'capAge', val: '13' }];
const S10_BTN = { pass: 'type="password"', ph: 'placeholder="…"', num: 'type="number"' };
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
  const ch = useChoiceHints(!!round && !ans, doneN);
  const hints = R ? choiceHints(c.hint1, c.hint2[R.want], c.miss[R.want], c.pick[R.want]) : null;
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
  const view = (after) => {
    if (!R) return null;
    const f = R.want === 'pass' ? { type: after ? 'password' : 'text', val: R.val }
      : R.want === 'ph' ? { type: 'text', ph: after ? pick(s[R.ph]) : '' }
        : { type: after ? 'number' : 'text', val: R.val };
    return <PageDoc blocks={[{ t: 'p', parts: pick(s[R.cap]), k: 'c' }, { t: 'fld', f, k: 'x' }]} />;
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? (ch.next(hints) || c.askQ) : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : round && !ans ? ch.now(hints) : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z6-ba kz-a-drop">
                <div className="z6-card"><span className="z6-card-h">{pick(c.before)}</span>{view(false)}</div>
                <span className="z6-ba-arrow" aria-hidden="true" />
                <div className="z6-card is-after"><span className="z6-card-h">{pick(c.after)}</span>{view(true)}</div>
              </div>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick z6-pick3">
            {['pass', 'ph', 'num'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z6-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}><span translate="no">{S10_BTN[k]}</span><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. label И form (показ) — подпись в p не связана с полем: нажатие ничего не даёт; label: подпись и поле
// встают в строку, нажатие на подпись выбирает поле; form вокруг — на странице ничего не меняется.
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const s = C.site;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [st11, setSt11] = useState(solved ? 4 : 0);   // 0 p+input; 1 нажали подпись — ничего; 2 label; 3 нажали подпись — поле выбрано; 4 form
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setSt11(1); } },
    { say: [{ text: c.sayNoLabel, pose: 'think' }] },
    { act: () => { sfx('pop', true); setSt11(2); } },
    { say: [{ text: c.sayLabel, pose: 'explain' }] },
    { act: () => { sfx('ok', true); setSt11(3); } },
    { say: [{ text: c.sayFocus, pose: 'smile' }] },
    { act: () => { sfx('pop', true); setSt11(4); } },
    { say: [{ text: c.sayForm, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cap = pick(s.capAge);
  const lab = st11 >= 2;
  const inForm = st11 >= 4;
  const fld = inputCode([TYPE_ATTR('number')], true);
  const lines = lab
    ? (inForm ? [formOpen()] : []).concat([labelLine('l', cap, fld, { d: inForm ? 1 : 0, cls: st11 === 2 ? 'is-new' : st11 === 3 ? 'is-read' : '' })], inForm ? [formClose()] : [])
    : [textLine('c', 'p', cap, { cls: st11 === 1 ? 'is-read' : '' }), codeLine('i', inputCode([TYPE_ATTR('number')]))];
  if (inForm) { lines[0].cls = 'is-new'; lines[2].cls = 'is-new'; }
  const blocks = lab
    ? [{ t: 'lab', cap, f: { type: 'number', focus: st11 >= 3 }, k: 'l', capHl: st11 === 3, cls: st11 === 2 ? 'z6-a-in' : '' }]
    : [{ t: 'p', parts: cap, k: 'c', hl: st11 === 1 }, { t: 'fld', f: { type: 'number' }, k: 'f' }];
  const askText = solved || demo.done ? c.askDone : c.asks[st11];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z6-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.club)} url="klub.html" short cls={inForm ? 'is-form' : ''}><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. СВОЯ ПОДПИСЬ и S13. СВОЯ ПОДСКАЗКА (Live Code Preview, по «Готово») — своя анкета: подпись поля в label,
// потом серая подсказка placeholder.
// =============================================================================
const useMine6 = () => {
  const store = useStore();
  const pick = usePick();
  return { cap: store.get('myCap') || pick(C.s12.sample), ph: store.get('myPh') || pick(C.s13.sample) };
};
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec] = useRec('s12');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myCap', screenId: 's12', type: 'own-label', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'cheer')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const blocks = [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'lab', cap: ty.shown || '', f: { type: 'text' }, k: 'l', capHl: !ty.solved }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.myForm)} url="anketa.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[formOpen(), codeLine('l', [T_('label'),
              <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={28} /></span>]
              .concat(inputCode([TYPE_ATTR('text')], true), [T_('label', true)]), { d: 1, cls: 'is-hl' }), formClose()]} cls="kz-code-sm" />
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
  const mine = useMine6();
  const [rec] = useRec('s13');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myPh', screenId: 's13', type: 'own-placeholder', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'cheer')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const blocks = [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'lab', cap: mine.cap, f: { type: 'text', ph: ty.shown || '' }, k: 'l', hl: !ty.solved }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.myForm)} url="anketa.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[formOpen(), labelLine('l', mine.cap, [tagOpen(true), attrSpan('type', 'text', 't'), attrOpen('placeholder'),
              <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={28} /></span>,
              attrClose(), tagClose('gt')], { d: 1, cls: 'is-hl' }), formClose()]} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ПАРОЛЬ ВИДЕН ВСЕМ (Debug & Fix) — в своей анкете у поля пароля стёрлось значение type: браузер считает
// поле обычным, пароль виден буквами. Перетащить (или нажать) нужное значение: "password".
// =============================================================================
const S14_OPTS = ['text', 'password', 'number'];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const s = C.site;
  const mine = useMine6();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const ch = useChoiceHints(!okNow, 0);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === 'password') {
      sfx('win', true); setOkNow(true); setMsg(null); ch.clear(); put({ done: true });
      log({ screenId: 's14', type: 'fix-password', correct: true, firstTry: off.length === 0, attempts: off.length + 1, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(c.ok, 'cheer');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.why[o], c.hints), 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const capP = pick(s.capPass);
  const blocks = [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'lab', cap: mine.cap, f: { type: 'text', ph: mine.ph }, k: 'l1' },
    { t: 'lab', cap: capP, f: { type: okNow ? 'password' : 'text', val: 'kodi2026' }, k: 'l2', hl: !okNow, cls: okNow ? 'z6-a-in' : '' }];
  const glow = off.length >= 2 || ch.lad.lv >= 3 ? 'password' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : ch.now(c.hints)} err={ch.err} />
        <div className="kz-scene z6-s5">
          <div className="kz-col"><Br title={pick(UI.myForm)} url="anketa.html" cls={okNow ? '' : 'z6-broken-br'}><PageDoc blocks={blocks} /></Br></div>
          <div className="kz-col">
            <KzCode lines={[formOpen(), labelLine('l1', mine.cap, inputCode([TYPE_ATTR('text'), { n: 'placeholder', v: mine.ph }], true), { d: 1, cls: 'z6-ctx' }),
              okNow ? labelLine('l2', capP, inputCode([TYPE_ATTR('password')], true), { d: 1, cls: 'is-new' }) : labelLine('l2', capP, [tagOpen(true),
                <span key="t" className="kz-tag z6-att" translate="no"><span className="z6-attr">type</span><span className="kz-tk-b">=</span></span>,
                <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z6-miss' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />,
                tagClose()], { d: 1, cls: 'is-hl' }), formClose()]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {S14_OPTS.map((o) => (
              <button key={o} type="button" disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, '"' + o + '"'); }}
                className={'kz-scrap kz-scrap-code' + (off.indexOf(o) >= 0 ? ' is-used' : '') + (glow === o ? ' is-led' : '')}>
                <span translate="no">{'"' + o + '"'}</span><Led on={led && off.indexOf(o) < 0} />
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
// Q1. НАЙДИ ОШИБКУ (Error Detective) — анкета клуба без образца. Раунд 1: у пароля type="text" (пароль виден).
// Раунд 2: опечатка placehoder (серой подсказки нет). Ученик нажимает строку; найденная чинится сама.
// =============================================================================
const Q1_ROUNDS = [{ bad: 2, kind: 'type' }, { bad: 0, kind: 'ph' }];
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
  const broken = (j) => !found && j === R.bad;
  const ph = pick(s.phGame);
  const fields = [
    { cap: pick(s.capGame), f: { type: 'text', ph: broken(0) && R.kind === 'ph' ? '' : ph }, attrs: [TYPE_ATTR('text'), { n: broken(0) && R.kind === 'ph' ? 'placehoder' : 'placeholder', v: ph }] },
    { cap: pick(s.capAge), f: { type: 'number', val: '12' }, attrs: [TYPE_ATTR('number')] },
    { cap: pick(s.capPass), f: { type: broken(2) && R.kind === 'type' ? 'text' : 'password', val: 'kodi2026' }, attrs: [TYPE_ATTR(broken(2) && R.kind === 'type' ? 'text' : 'password')] }
  ];
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene kz-scene-col z6-q1" key={'q' + ri}>
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short cls={found ? '' : 'z6-broken-br'}>
              <PageDoc blocks={fields.map((x, j) => ({ t: 'lab', cap: x.cap, f: x.f, k: 'l' + j, cls: found && j === R.bad ? 'z6-a-in' : '' }))} />
            </Br>
            <KzCode lines={fields.map((x, j) => ({
              k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: [T_('label'), W_(x.cap)].concat(inputCode(x.attrs, true), [T_('label', true)]),
              cls: 'z6-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
            }))} cls="kz-code-sm" />
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
      className={'kz-btn z6-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const s = C.site;
  const codes = {
    pass: [codeLine('c', inputCode([TYPE_ATTR('password')]))],
    ph: [codeLine('c', inputCode([TYPE_ATTR('text'), { n: 'placeholder', v: pick(s.phGame) }]))],
    label: [labelLine('c', pick(s.capAge), inputCode([TYPE_ATTR('number')], true))]
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z6-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z6-card z6-tf-card kz-a-drop">
              <span className="z6-card-h">{pick(c.card)}</span>
              <p className="z6-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z6-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: у Коди placeholder="Parol", а пароль виден буквами; своя анкета ученика; роли
// input, type, placeholder, label загораются, пока Коди их называет.
// =============================================================================
const S15_ROLES = ['input', 'type', 'placeholder', 'label'];
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const s = C.site;
  const mine = useMine6();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const blocks = riddle
    ? [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'lab', cap: pick(s.capPass), f: { type: 'text', ph: pick(s.phPass), val: 'kodi2026' }, k: 'r', hl: true }]
    : [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'lab', cap: mine.cap, f: { type: 'text', ph: mine.ph }, k: 'l1', hl: curK === 'input' || curK === 'placeholder', capHl: curK === 'label' },
      { t: 'lab', cap: pick(s.capPass), f: { type: 'password', val: 'kodi2026' }, k: 'l2', hl: curK === 'type' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z6-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(s.club) : pick(UI.myForm)} url={riddle ? 'klub.html' : 'anketa.html'}><PageDoc blocks={blocks} key={riddle ? 'r' : 'm'} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {S15_ROLES.map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'type') ? ' is-on' : '')}>
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
// «Повторить» стирает только экран; своя анкета ученика (myCap, myPh) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — своя анкета ученика: подпись и поле с серой подсказкой.
function lesson6Artifact(store) {
  const cap = store.get('myCap'), ph = store.get('myPh');
  if (!cap && !ph) return null;
  return { type: 'html-page', label: cap || '', placeholder: ph || '',
    html: ['<form>', '  <label>' + escHtml(cap || '') + ' <input type="text" placeholder="' + escHtml(ph || '') + '"></label>',
      '  <label>Parol: <input type="password"></label>', '</form>'].join('\n') };
}

export default function HtmlFormalar({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson6Artifact(store) })
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
