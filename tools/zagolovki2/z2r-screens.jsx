// =============================================================================
// ЭКРАНЫ УРОКА 2 «Заголовки и текст» (облик «Редактор»). Основа — экраны прежнего урока 2
// (tools/zagolovki/z2-screens.jsx, тестовый 20) — переписаны без бумаги; типы заданий — по разделу 3а навыка
// (заказчик, 03.11.2026): s4 вписать — s5 перетащить; s7 собрать код — s8 код ↔ страница;
// s10 вписать — s11 до и после; s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет.
// Экрана плана нет (как в уроке 1).
// ЧАСТИ УРОКА 2 — страница в браузере, код с тегами, обёртка в два поля
// =============================================================================
const WAIT_MS = 1100;   // пауза в наборе, после которой свой текст засчитывается (s13)
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// Части строки абзаца → JSX страницы (b — жирный, i — курсив) и → код (теги b, i).
// Часть с ключом k ({ s, k } / { b, k } / { i, k }) получает data-k — по нему в хуке
// слово из каши находит своё место на странице.
const inl = (parts, hl, key) => (parts || []).map((x, j) => (typeof x === 'string' ? <React.Fragment key={(key || '') + j}>{x}</React.Fragment>
  : x.s !== undefined ? <span key={(key || '') + j} data-k={x.k}>{x.s}</span>
    : x.b !== undefined ? <b key={(key || '') + j} data-k={x.k} className={'z2-b' + (hl === 'b' ? ' is-hl' : '')}>{x.b}</b>
      : <i key={(key || '') + j} data-k={x.k} className={'z2-i' + (hl === 'i' ? ' is-hl' : '')}>{x.i}</i>));
const codeParts = (parts) => [].concat(...(parts || []).map((x, j) => (typeof x === 'string' ? [W_(x)]
  : x.b !== undefined ? [<span key={'bo' + j}>{T_('b')}</span>, W_(x.b), <span key={'bc' + j}>{T_('b', true)}</span>]
    : [<span key={'io' + j}>{T_('i')}</span>, W_(x.i), <span key={'ic' + j}>{T_('i', true)}</span>])));
const plainOf = (parts) => (parts || []).map((x) => (typeof x === 'string' ? x : x.s !== undefined ? x.s : x.b !== undefined ? x.b : x.i)).join('');

// СТРАНИЦА В БУМАЖНОМ БРАУЗЕРЕ — как её рисует браузер по умолчанию: заголовки
// убывают от h1 к h6, абзацы с отступом, b — жирный, i — курсив. Блок:
// { t: 'h1'…'h6' | 'p' | 'raw', parts, hl, k, cls }. raw — текст без тегов.
// wall — всё одной склеенной строкой (так браузер показывает текст без тегов).
// Страница всегда помещается в окно целиком, без прокрутки (заказчик, 22.10.2026:
// «ученик не поймёт» полосу прокрутки): не влезает — шрифт страницы ступеньками
// уменьшается, пока не влезет (не меньше 55 %). Пересчёт — при смене текста и
// размера окна.
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
function PageDoc({ blocks, wall, anim, cls }) {
  const ref = useFitPage(JSON.stringify(blocks) + (wall ? 'w' : ''));
  if (wall) return <div ref={ref} className={'z2-doc z2-wall' + (cls ? ' ' + cls : '')}>{blocks.map((bk) => plainOf(bk.parts)).join(' ')}</div>;
  return (
    <div ref={ref} className={'z2-doc' + (cls ? ' ' + cls : '')}>
      {blocks.map((bk, i) => {
        const c = 'z2-blk z2-' + bk.t + (bk.hl === true ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '') + (anim ? ' kz-a-drop' : '');
        const st = bk.st || (anim ? { '--dl': (0.12 * i) + 's' } : null);
        if (bk.tap !== undefined) return <button key={bk.k || i} type="button" className={c} style={st} disabled={!bk.tap} onClick={bk.tap || undefined}>{inl(bk.parts, bk.hl, 'k' + i)}<Led on={!!bk.led} /></button>;
        return <div key={bk.k || i} className={c} style={st}>{inl(bk.parts, bk.hl, 'k' + i)}</div>;
      })}
    </div>
  );
}

// Обёртка в тег, набранная в два поля: перед текстом и после. null — всё верно.
function wrapIssue(a, b, tag) {
  const na = normT(a), nb = normT(b);
  const o = '<' + tag + '>', z = '</' + tag + '>';
  const one = (n, want, side) => {
    if (n === want) return null;
    if (!n) return side === 'a' ? WRAP_MSGS.needOpen : WRAP_MSGS.needClose;
    if (side === 'a' && n === z) return WRAP_MSGS.openSlash;
    if (side === 'b' && n === o) return WRAP_MSGS.needSlash;
    if (n.charAt(0) !== '<') return WRAP_MSGS.needLt;
    if (n.charAt(n.length - 1) !== '>') return WRAP_MSGS.needGt;
    return WRAP_MSGS.wrongName;
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
const Slot = ({ ty, on, onFocus, blink, label, onEnter }) => (
  <span className={'kz-gap z2-slot' + (blink ? ' kz-gap-led' : '') + (on ? ' is-act' : '')}>
    <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} onFocus={onFocus} onEnter={onEnter}
      placeholder={L3('…', '…', '…')} label={label} max={8} cls="kz-tag-in" />
  </span>
);

// =============================================================================
// S1. КРЮЧОК — каша из текста в браузере. «Превратить»: слова из каши плавно
// разлетаются по своим местам — название подлетает наверх и растёт в заголовок,
// абзацы встают с отступом, слово «очень» становится жирным и подсвечивается.
// Ученик видит: это тот же текст, только разложенный тегами.
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
  const pageRef = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const land = () => { put({ done: true }); setPhase('page'); sfx('ok', true); sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.magicB, 'point'); say(c.done, 'smile'); };
  const turn = () => {
    if (!canTap || phase !== 'wall') return;
    sfx('pop', true);
    if (reduceMotion()) { land(); return; }
    setPhase('fly');
  };
  // Превращение: каша тает, страница собирается по блокам сверху вниз — заголовок, абзац,
  // заголовок раздела, абзац (каждый — плавным появлением, заголовки вырастают из строки текста).
  useEffect(() => {
    if (phase !== 'fly') return undefined;
    tm.current = setTimeout(land, 1500);
    return () => clearTimeout(tm.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  // Подсветка за речью: «название» — h1, «абзацы» — абзацы, «жирное слово» — b.
  const hl = phase !== 'page' ? null : speaker.text === c.magic ? 'h1' : speaker.text === c.magicP ? 'p' : speaker.text === c.magicB ? 'b' : null;
  // Части с ключами «блок-часть»: по ним кусок каши находит своё место.
  const keyed = (parts, bi) => parts.map((x, j) => (typeof x === 'string' ? { s: x, k: bi + '-' + j } : Object.assign({}, x, { k: bi + '-' + j })));
  const blocks = [
    { t: 'h1', parts: keyed([pick(PAGE.title)], 0), hl: hl === 'h1' },
    { t: 'p', parts: keyed(pick(PAGE.p1), 1), hl: hl === 'p' ? true : hl === 'b' ? 'b' : null },
    { t: 'h2', parts: keyed([pick(PAGE.h2)], 2) },
    { t: 'p', parts: keyed(pick(PAGE.p2), 3), hl: hl === 'p' }
  ];
  // Каша: те же куски подряд, одной строкой, одним шрифтом.
  // Пробел — только между блоками: внутри абзаца пробелы уже есть в самих частях.
  const chunks = [].concat(...blocks.map((bk) => bk.parts));
  const wall = (cls) => (
    <div className={'z2-doc z2-wall' + (cls ? ' ' + cls : '')}>
      {chunks.map((x, j) => {
        // Пробелы по краям куска — снаружи плашки: у inline-block они схлопываются.
        const raw = x.s !== undefined ? x.s : x.b !== undefined ? x.b : x.i;
        const lead = /^\s/.test(raw) || (j && x.k.split('-')[1] === '0') ? ' ' : '';
        const trail = /\S\s+$/.test(raw) ? ' ' : '';
        const word = raw.trim();
        return <React.Fragment key={x.k}>{lead}{word ? <span className="z2-chunk" data-k={x.k}>{word}</span> : null}{trail}</React.Fragment>;
      })}
    </div>
  );
  const askText = phase === 'wall' ? c.ask : c.askDone;
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z2-s1">
          <div className="kz-stagebox z2-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={phase === 'page'} /></div></div>
          <div className="kz-col z2-s1-page">
            <PaperBrowser title={pick(PAGE.title)} cls="z2-br">
              <div ref={pageRef} className="z2-s1-box">
                {phase !== 'page' ? wall(phase === 'fly' ? 'z2-wall-out' : '') : null}
                {phase !== 'wall' ? <PageDoc blocks={blocks.map((bk, i) => (phase === 'fly' ? Object.assign({}, bk, { cls: 'z2-build', st: { '--dl': (0.25 + i * 0.22) + 's' } }) : bk))} /> : null}
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
// S3. ЗАГОЛОВКИ h1–h6 — показ: на листе body шесть полосок, крупнейшая и мельчайшая
// загораются под речь Коди (h1 — звезда, h6 — лупа).
// =============================================================================
const H_SIZE = [1, 0.84, 0.7, 0.58, 0.48, 0.4];
// Ярлык тега над частью страницы — плоский, как подпись блока в инспекторе DevTools.
const TagChip = ({ t, cls, on, hl }) => <span className={'z2-chip' + (on ? ' is-on' : '') + (hl ? ' is-hl' : '') + (cls ? ' ' + cls : '')} translate="no">{T_(t)}</span>;
function BodySheet({ children, label = true, cls }) {
  return (
    <div className={'z2-body' + (cls ? ' ' + cls : '')}>
      {label ? <TagChip t="body" cls="z2-body-lbl" /> : null}
      <div className="z2-body-in">{children}</div>
    </div>
  );
}
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }]);
  const boxRef = useRef(null);
  const strip = (i) => () => boxRef.current && boxRef.current.querySelectorAll('.z2-hstrip')[i];
  // Показ: загорается самый крупный заголовок, потом самый мелкий; Коди называет оба.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: strip(0), act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.big, pose: 'point' }] },
    { look: strip(5), act: () => { sfx('ok', true); setN(2); } },
    { say: [{ text: c.small, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  // Строка задания — за речью: пока Коди говорит о h1, она ещё про h1.
  const askText = solved || demo.done ? c.done : demo.idx >= 2 ? c.askSmall : c.askBig;
  // Пока Коди говорит о h1 — светится h1, о h6 — h6.
  const hlI = speaker.text === c.big ? 0 : speaker.text === c.small ? 5 : -1;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={askText} n={solved ? null : n + '/2'} />
        <div className="kz-scene" ref={boxRef}>
          <BodySheet cls="z2-s3-body">
            {H_SIZE.map((s, i) => {
              return (
                <span key={i} className={'z2-hstrip kz-a-left' + (hlI === i ? ' is-hl' : '')}
                  style={{ '--hs': s, '--dl': (0.12 * i) + 's' }}>
                  <span className="z2-hstrip-paper">
                    <TagK t={'h' + (i + 1)} />
                    <span className="z2-hstrip-w">{pick(c.word)}</span>
                  </span>
                  {i === 0 && n >= 1 ? <span className="z2-star z2-a-in" aria-hidden="true">★</span> : null}
                  {i === 5 && n >= 2 ? <span className="z2-loupe z2-a-in" aria-hidden="true" /> : null}
                </span>
              );
            })}
          </BodySheet>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ЗАКРОЙ ЗАГОЛОВОК — без </h1> браузер честно делает огромным и абзац под
// заголовком. Ученик набирает </h1>: абзац плавно становится обычным.
// =============================================================================
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
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
    const issue = tagTypingIssue(ty.val, 'h1', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's4', type: 'write-closing', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const p1 = pick(PAGE.p2);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls={'z2-br' + (okNow ? '' : ' z2-broken')} pageHl={!okNow}>
              <PageDoc blocks={[{ t: 'h1', parts: [pick(PAGE.title)] }, { t: 'p', parts: p1, cls: okNow ? 'z2-a-in' : 'z2-inh1' }]} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] },
              { k: 'h', d: 1, cls: okNow ? 'is-new' : 'is-gap', parts: [T_('h1'), W_(pick(PAGE.title)), okNow ? <span key="c" className="z2-a-in">{T_('h1', true)}</span> : (
                <span key="g" className={'kz-gap' + (blink ? ' kz-gap-led' : '') + (ty.val ? '' : ' z2-miss')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={12} cls="kz-tag-in" />
                </span>)] },
              { k: 'p', d: 1, parts: [T_('p'), ...codeParts(p1), T_('p', true)] },
              { k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'h1', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 4} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. КАКОЙ ЗАГОЛОВОК — три строки страницы без тегов; бирки h1, h2, h2, h6
// (одна лишняя). Перетащить бирку на строку или нажать бирку, потом строку.
// Браузер рядом сразу показывает размер. Новую механику сначала показывает рука.
// =============================================================================
const S5_TAGS = [{ id: 'h2a', t: 'h2' }, { id: 'h6', t: 'h6' }, { id: 'h1', t: 'h1' }, { id: 'h2b', t: 'h2' }];
const S5_WANT = ['h1', 'h2', 'h2'];
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? ['h1', 'h2a', 'h2b'] : [null, null, null]);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const doneN = slots.filter(Boolean).length;
  const done = doneN === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, doneN * 10 + (sel ? 1 : 0));
  const tagOf = (id) => S5_TAGS.find((x) => x.id === id).t;
  const place = (id, where) => {
    const k = Number(where);
    if (!canTap || done || !id || Number.isNaN(k) || slots[k]) return false;
    st.current.tries += 1;
    const t = tagOf(id);
    if (t !== S5_WANT[k]) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      const m = t === 'h6' ? c.why.h6 : t === 'h1' ? c.why.h1sec : c.why.h2title;
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = slots.slice(); ns[k] = id;
    setSlots(ns); setSel(null); setMsg(null);
    if (ns.every(Boolean)) {
      put({ done: true });
      log({ screenId: 's5', type: 'place-headings', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const trayRef = useRef(null);
  const codeRef = useRef(null);
  const pickLine = (k) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, String(k)); };
  const nextK = slots.findIndex((x) => !x);
  const lit = lad.lv >= 3;
  const nextId = nextK >= 0 ? S5_TAGS.find((x) => x.t === S5_WANT[nextK] && slots.indexOf(x.id) < 0).id : null;
  const lines = c.lines.map((ln, k) => {
    const id = slots[k];
    const t = id ? tagOf(id) : null;
    return {
      k: 'l' + k, d: 0, place: String(k), cls: (id ? 'is-new' : 'z2-hline') + (dnd.hover === String(k) ? ' is-hover' : ''),
      onTap: id ? null : () => pickLine(k), disabled: !canTap || done,
      led: !id && ((led && !!sel) || (lit && k === nextK)),
      parts: t ? [T_(t), W_(pick(ln)), T_(t, true)] : [<span key="d" className="kz-dash kz-dash-sm" />, W_(pick(ln)), <span key="e" className="kz-dash kz-dash-sm" />]
    };
  });
  const blocks = c.lines.map((ln, k) => (slots[k] ? { t: tagOf(slots[k]), parts: [pick(ln)], k: 'b' + k } : { t: 'raw', parts: [pick(ln)], k: 'b' + k }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : doneN + '/3'} />
        <div className={'kz-scene z2-s5' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col" ref={codeRef}><KzCode lines={lines} /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z2-br"><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
        </div>
        {!done ? (
          <div ref={trayRef} className="kz-tray">
            {S5_TAGS.map((tg, i) => {
              if (slots.indexOf(tg.id) >= 0) return null;
              return (
                <button key={tg.id} type="button" disabled={!canTap || done} data-id={tg.id}
                  className={'kz-scrap kz-scrap-tag' + (sel === tg.id ? ' is-sel' : '') + (shake === tg.id ? ' kz-a-shake' : '') + (lit && tg.id === nextId ? ' is-led' : '')}
                  onPointerDown={(e) => { if (canTap && !done) dnd.start(e, tg.id, '<' + tg.t + '>'); }}
                  onClick={() => { setSel(sel === tg.id ? null : tg.id); setMsg(null); sfx('tap', true); }}>
                  <TagK t={tg.t} /><Led on={led && !sel && !done && tg.id === nextId} />
                </button>
              );
            })}
          </div>
        ) : null}
        <KzHand label="<h1>" run={canTap && !done && !sel && !dnd.active && doneN === 0}
          targets={[() => trayRef.current && trayRef.current.querySelector('[data-id="h1"]'), () => codeRef.current && codeRef.current.querySelector('[data-place="0"]')]} />
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// S6. АБЗАЦЫ — три строки кода без тегов: браузер склеил их в одну. Показ: строки
// загораются — каждая оборачивается в p, в окне появляется отдельный абзац.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [wrapped, setWrapped] = useState(solved ? [true, true, true] : [false, false, false]);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayP, pose: 'point' }]);
  const n = wrapped.filter(Boolean).length;
  const wrap = (k) => { setWrapped((w) => { const x = w.slice(); x[k] = true; return x; }); sfx('pop', true); };
  const codeRef = useRef(null);
  const line = (k) => () => codeRef.current && codeRef.current.querySelectorAll('.kz-line.z2-hline')[0];
  // Показ: строки по очереди загораются — каждая оборачивается в p.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: line(0), act: () => wrap(0) },
    { look: line(1), act: () => wrap(1) },
    { look: line(2), act: () => { wrap(2); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  // Пока Коди говорит про склейку — окно подсвечено.
  const glued = speaker.text === c.say && !solved;
  // Честно: подряд идущие строки без тегов склеиваются, каждый p — отдельный абзац.
  const blocks = [];
  c.lines.forEach((ln, k) => {
    if (wrapped[k]) blocks.push({ t: 'p', parts: [pick(ln)], k: 'p' + k, cls: 'z2-a-in' });
    else if (blocks.length && blocks[blocks.length - 1].t === 'raw') blocks[blocks.length - 1].parts.push(' ' + pick(ln));
    else blocks.push({ t: 'raw', parts: [pick(ln)], k: 'r' + k });
  });
  const nextK = wrapped.findIndex((x) => !x);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={n === 3 ? c.done : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={n === 3 ? c.done : c.ask} n={n === 3 ? null : n + '/3'} />
        <div className="kz-scene z2-s5">
          <div className="kz-col" ref={codeRef}>
            <KzCode lines={[{ k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] }].concat(c.lines.map((ln, k) => ({
              k: 'l' + k + (wrapped[k] ? 'w' : ''), d: 1, cls: wrapped[k] ? 'is-new' : 'z2-hline' + (k === nextK && speaker.text === c.sayP ? ' is-read' : ''),
              parts: wrapped[k] ? [T_('p'), W_(pick(ln)), T_('p', true)] : [W_(pick(ln))]
            }))).concat([{ k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }])} />
          </div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z2-br" pageHl={glued}><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. СОБЕРИ АБЗАЦ (Code Builder) — строка ещё не абзац: браузер приклеил её к прошлой.
// В лотке вперемешку три куска: <p>, текст, </p>. Ученик ставит их по порядку в пустые
// строки редактора — нажатием (кусок встаёт в следующую строку) или перетаскиванием;
// браузер сразу показывает, что вышло. Не тот кусок — причина, кусок остаётся в лотке.
// =============================================================================
const S7_TRAY = ['close', 'open', 'text'];
const S7_WANT = ['open', 'text', 'close'];
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S7_WANT.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    if (id !== S7_WANT[got.length]) {
      st.current.misses += 1;
      const m = got.length === 0 ? (id === 'close' ? c.why.closeFirst : c.why.textFirst) : c.why.closeEarly;
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
      log({ screenId: 's7', type: 'build-p', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const prev = pick(c.prev), text = pick(c.text);
  const label = (id) => (id === 'open' ? '<p>' : id === 'close' ? '</p>' : text);
  const node = (id) => (id === 'open' ? T_('p') : id === 'close' ? T_('p', true) : W_(text));
  // Честно, как в настоящем браузере: пока нет <p>, новой строки на странице нет; пустой <p> не виден;
  // с текстом внутри <p> строка — уже отдельный абзац, первая остаётся простым текстом.
  const blocks = [{ t: 'raw', parts: [prev], k: 'r' }].concat(got.length >= 2 ? [{ t: 'p', parts: [text], k: 'p', cls: 'z2-a-in' }] : []);
  const lit = lad.lv >= 3;
  const slotLine = (i) => {
    const id = got[i];
    return { k: 's' + i + (id || ''), d: i === 1 ? 2 : 1, place: 'code', cls: id ? 'is-new' : i === got.length ? 'is-hl' : 'z2-later',
      parts: id ? [node(id)] : [<span key="d" className={'kz-dash kz-dash-sm' + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />] };
  };
  const hint = hintAt(lad.lv, c.hints);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hint)} err={!!msg} n={done ? null : got.length + '/3'} />
        <div className={'kz-scene kz-scene-col z2-s7' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls="z2-br" pageHl={done}><PageDoc blocks={blocks} /></PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] },
              { k: 'p', d: 1, cls: 'z2-ctx', parts: [W_(prev)] },
              slotLine(0), slotLine(1), slotLine(2),
              { k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }
            ]} cls="kz-code-sm" />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray z2-s7-tray">
            {S7_TRAY.map((id, i) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap ' + (id === 'text' ? 'kz-scrap-code z2-s7-text' : 'kz-scrap-tag') + (shake === id ? ' kz-a-shake' : '') + (lit && id === S7_WANT[got.length] ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, label(id)); }}
                onClick={() => place(id)}>
                <span translate="no">{label(id)}</span><Led on={led} />
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
// S8. КОД ↔ СТРАНИЦА (Visual Code Mapping) — в коде загорается одно слово; ученик
// нажимает абзац на странице, где оно оказалось. Ловушки: в одной строке кода два p —
// это два абзаца; p открыт в одной строке, закрыт в другой — это один абзац. Промах —
// Коди называет причину, верный абзац загорается, и добавляется раунд того же типа.
// =============================================================================
const S8_W = [L3('Mushugim uxlaydi.', 'Кот спит.', 'The cat sleeps.'), L3('U baliq yeydi.', 'Он ест рыбу.', 'He eats fish.'),
  L3("U o'ynaydi.", 'Он играет.', 'He plays.'), L3('Bugun havo quyoshli.', 'Сегодня солнце.', 'It’s sunny today.'), L3('Biz sayr qilamiz.', 'Мы гуляем.', 'We go for a walk.')];
// lines — строки кода (токены: p0 — <p>текст</p>; o0 — <p>текст; m0 — текст; c0 — текст</p>);
// hl — [строка, токен] горящего слова; want — номер абзаца на странице; type — какая ловушка.
const S8_ROUNDS = [
  { lines: [['p0', 'p1']], hl: [0, 1], want: 1, type: 'many' },
  { lines: [['p2'], ['o3'], ['c4']], hl: [2, 0], want: 1, type: 'one' },
  { lines: [['p1'], ['p0', 'p2']], hl: [1, 1], want: 2, type: 'many' }
];
const S8_EXTRA = [
  { lines: [['p3', 'p4', 'p2']], hl: [0, 2], want: 2, type: 'many' },
  { lines: [['o0'], ['c1'], ['p3']], hl: [1, 0], want: 0, type: 'one' },
  { lines: [['p4'], ['p3', 'p0']], hl: [1, 1], want: 2, type: 'many' }
];
function s8Parts(tok, pick, lit) {
  const w = pick(S8_W[Number(tok.slice(1))]);
  const W = lit ? <span className="kz-txt z2-target">{w}</span> : W_(w);
  if (tok[0] === 'p') return [T_('p'), W, T_('p', true)];
  if (tok[0] === 'o') return [T_('p'), W];
  if (tok[0] === 'c') return [W, T_('p', true)];
  return [W];
}
function s8Blocks(rd, pick) {
  const out = [];
  let cur = null;
  rd.lines.forEach((ln) => ln.forEach((tok) => {
    const w = pick(S8_W[Number(tok.slice(1))]);
    if (tok[0] === 'p') out.push({ t: 'p', parts: [w] });
    else if (tok[0] === 'o') { cur = { t: 'p', parts: [w] }; out.push(cur); }
    else if (cur) cur.parts.push(' ' + w);
    if (tok[0] === 'c') cur = null;
  }));
  return out;
}
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
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
  const shownRd = round || lastRef.current || { i: 2 };
  const R = (shownRd.extra ? S8_EXTRA : S8_ROUNDS)[shownRd.i];
  const led = useIdleLed(canTap && !!round && ans === null, doneN);
  const answer = (k) => {
    if (!canTap || !round || ans !== null) return;
    const right = k === R.want;
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
        log({ screenId: 's8.r' + (ii + 1), type: 'map-code-page', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1200);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const live = !!round && ans === null;
  const blocks = s8Blocks(R, pick).map((bk, k) => Object.assign(bk, {
    k: 'a' + k, hl: ans !== null && k === R.want ? true : undefined,
    cls: 'z2-map' + (ans === k && k !== R.want ? ' is-off' : '') + (live ? ' is-call' : ''),
    tap: live && canTap ? () => answer(k) : null, led: live && led
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans !== null && ans !== R.want ? c.miss[R.type] : null} err={round && ans !== null && ans !== R.want} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        <div className="kz-scene kz-scene-col" key={'s' + doneN}>
          <div className="kz-col">
            <KzCode lines={R.lines.map((ln, j) => ({ k: 'r' + j, d: 0, cls: 'kz-a-drop',
              parts: [].concat(...ln.map((tok, t) => s8Parts(tok, pick, j === R.hl[0] && t === R.hl[1]))) }))} cls="kz-code-sm" />
            <PaperBrowser title={pick(PAGE.title)} short cls="z2-br"><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЖИРНЫЙ И КУРСИВ — карточка абзаца с ярлыком <p>, над словами «очень» и «спать» —
// ярлыки <b> и <i>. Показ: загорается ярлык b — слово становится жирным и подсвечивается;
// потом ярлык i — слово наклоняется. Строка кода под карточкой обновляется по шагу.
// Карточка — образ (как рамка в уроке 1); в браузере так же — жирный и курсив.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }]);
  const cardRef = useRef(null);
  const lbl = (k) => () => cardRef.current && cardRef.current.querySelector('.z2-w.is-' + k + ' .kz-label');
  // Показ: загорается бирка b — слово жирное; потом бирка i — слово наклонное.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: lbl('b'), act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.b, pose: 'point' }] },
    { look: lbl('i'), act: () => { sfx('ok', true); setN(2); } },
    { say: [{ text: c.i, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const src = pick(PAGE.p1);
  // Пока бирка не сработала, слово ещё без тега: в коде — части по шагу.
  const parts = src.map((x) => (typeof x === 'string' ? x : x.b !== undefined ? (n >= 1 ? x : x.b) : (n >= 2 ? x : x.i)));
  // Строка задания — за речью: пока Коди говорит о b, она ещё про b.
  const askText = solved || demo.done ? c.done : demo.idx >= 2 ? c.askI : c.askB;
  // Пока Коди говорит о b — светится бирка b и её слово; о i — бирка i.
  const sayK = speaker.text === c.b ? 'b' : speaker.text === c.i ? 'i' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={askText} n={solved ? null : n + '/2'} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <div className="z2-pcard kz-piece kz-a-drop" ref={cardRef}>
              <TagChip t="p" cls="z2-pcard-lbl" />
              <p className="z2-pcard-text">
                {src.map((x, j) => {
                  // Знак препинания сразу после слова держится с ним на одной строке.
                  const punct = (k) => { const nx = src[k]; return typeof nx === 'string' ? (nx.match(/^[.,!?;:…]+/) || [''])[0] : ''; };
                  if (typeof x === 'string') return <React.Fragment key={j}>{j > 0 && typeof src[j - 1] !== 'string' ? x.slice(punct(j).length) : x}</React.Fragment>;
                  const isB = x.b !== undefined;
                  const on = isB ? n >= 1 : n >= 2;
                  return (
                    <span key={j} className={'z2-w' + (isB ? ' is-b' : ' is-i') + (on ? ' is-on' : '') + (sayK === (isB ? 'b' : 'i') ? ' is-say' : '')}>
                      <TagChip t={isB ? 'b' : 'i'} cls="z2-w-lbl" on={on} hl={sayK === (isB ? 'b' : 'i')} />
                      <span className="z2-w-txt">{isB ? x.b : x.i}</span>{punct(j + 1)}
                    </span>
                  );
                })}
              </p>
            </div>
            <KzCode lines={[{ k: 'p' + n, d: 0, cls: n ? 'is-new' : '', parts: [T_('p'), ...codeParts(parts), T_('p', true)] }]} />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ВЫДЕЛИ СЛОВО — два поля вокруг слова; набранный <b> без </b> честно
// делает жирным всё до конца абзаца.
// =============================================================================
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
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
  const [pre, w, post] = pick(c.parts);
  const check = () => {
    if (!canTap || okNow || (!sl.a.val.trim() && !sl.b.val.trim())) return;
    st.current.tries += 1;
    const issue = wrapIssue(sl.a.val, sl.b.val, 'b');
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's10', type: 'wrap-b', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const openB = okNow || normT(sl.a.val) === '<b>';
  const closeB = okNow || normT(sl.b.val) === '</b>';
  // Честно: открыт и закрыт — жирное слово; только открыт — жирное до конца абзаца.
  const parts = openB && closeB ? [pre, { b: w }, post] : openB ? [pre, { b: w + post }] : [pre + w + post];
  const ask = fillL(c.ask, { w });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={okNow ? c.ok : ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} short cls={'z2-br' + (openB && !closeB ? ' z2-broken' : '')}><PageDoc blocks={[{ t: 'p', parts, cls: 'z2-big' }]} /></PaperBrowser>
            <KzCode lines={[{ k: 'x', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? [T_('p'), W_(pre), T_('b'), W_(w), T_('b', true), W_(post), T_('p', true)] : [
              T_('p'), W_(pre),
              <Slot key="a" ty={sl.a} on={sl.act === 'a'} onFocus={() => sl.setAct('a')} blink={!okNow && led} label={ask} onEnter={check} />,
              <span key="w" className="kz-txt z2-target">{w}</span>,
              <Slot key="z" ty={sl.b} on={sl.act === 'b'} onFocus={() => sl.setAct('b')} blink={!okNow && led} label={ask} onEnter={check} />,
              W_(post), T_('p', true)] }]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'b', '>']} ty={sl.ty} canTap={canTap} onCheck={check} ready={sl.a.val.trim().length > 2 && sl.b.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ДО И ПОСЛЕ (Before / After) — строчка страницы «до» и «после»: слово стало жирным
// или наклонным. Ученик выбирает тег, который это сделал (b или i); код и браузер
// показывают его выбор честно. Промах — Коди называет причину, ещё раунд того же типа.
// =============================================================================
const S11_ROUNDS = [
  { want: 'b', s: L3(['Mushugim ', 'juda', ' katta.'], ['Мой кот ', 'очень', ' большой.'], ['My cat is ', 'very', ' big.']) },
  { want: 'i', s: L3(['U ', 'sekin', ' yuradi.'], ['Он ходит ', 'медленно', '.'], ['He walks ', 'slowly', '.']) },
  { want: 'b', s: L3(['Bu ', 'mening', ' mushugim.'], ['Это ', 'мой', ' кот.'], ['This is ', 'my', ' cat.']) }
];
const S11_EXTRA = [
  { want: 'b', s: L3(['Bugun ', 'juda', ' issiq.'], ['Сегодня ', 'очень', ' жарко.'], ['Today is ', 'very', ' hot.']) },
  { want: 'i', s: L3(['U ', 'jimgina', ' uxlaydi.'], ['Он спит ', 'тихо', '.'], ['He sleeps ', 'quietly', '.']) },
  { want: 'b', s: L3(['Bu ', 'mening', ' uyim.'], ['Это ', 'мой', ' дом.'], ['This is ', 'my', ' house.']) }
];
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'embarrassed' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (ans ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S11_EXTRA : S11_ROUNDS)[shownRd.i] : null;
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
        log({ screenId: 's11.r' + (ii + 1), type: 'choose-tag', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
  const s = R ? pick(R.s) : null;
  const mk = (tag) => (s ? [s[0], tag === 'b' ? { b: s[1] } : { i: s[1] }, s[2]] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z2-ba kz-a-drop">
                <div className="z2-card"><span className="z2-card-h">{pick(c.before)}</span><PageDoc blocks={[{ t: 'p', parts: [s.join('')], cls: 'z2-big' }]} /></div>
                <span className="z2-ba-arrow" aria-hidden="true" />
                <div className="z2-card is-after"><span className="z2-card-h">{pick(c.after)}</span><PageDoc blocks={[{ t: 'p', parts: mk(R.want), cls: 'z2-big' }]} /></div>
              </div>
              <KzCode lines={[{ k: 'c', d: 0, cls: ans ? 'is-new' : 'is-hl', parts: [T_('p'), W_(s[0]),
                ans ? <span key="o">{T_(ans)}</span> : <span key="o" className="kz-dash kz-dash-sm" />, W_(s[1]),
                ans ? <span key="z">{T_(ans, true)}</span> : <span key="z" className="kz-dash kz-dash-sm" />, W_(s[2]), T_('p', true)] }]} />
              <PaperBrowser title={pick(PAGE.title)} short cls="z2-br" pageHl={!!ans}>
                <PageDoc blocks={[{ t: 'p', parts: ans ? mk(ans) : [s.join('')], cls: 'z2-big' + (ans ? ' z2-a-in' : '') }]} />
              </PaperBrowser>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick">
            {['b', 'i'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z2-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}><TagK t={k} /><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. СВЕРХУ ВНИЗ — показ: браузер сам читает код; строки кода страницы о коте
// подсвечиваются по очереди, страница собирается в окне.
// =============================================================================
const READ12 = ['h1', 'p1', 'h2', 'p2'];
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
  const STEP = reduceMotion() ? 120 : 700;
  const run = () => { READ12.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  // Показ: строки читаются по очереди сами, потом Коди называет порядок.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run },
    { wait: STEP * READ12.length + 200 },
    { act: () => { setRead(READ12.length); } },
    { say: ORDER },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const sayK = spoken ? null : speaker.text === c.order1 ? ['h1'] : speaker.text === c.order2 ? ['p1'] : speaker.text === c.order3 ? ['h2', 'p2'] : null;
  const cur = read >= 0 && read < READ12.length ? READ12[read] : null;
  const on = (k) => (sayK ? sayK.indexOf(k) >= 0 : cur === k);
  const p1 = pick(PAGE.p1), p2 = pick(PAGE.p2);
  const lines = [
    { k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] },
    { k: 'h1', d: 1, parts: [T_('h1'), W_(pick(PAGE.title)), T_('h1', true)] },
    { k: 'p1', d: 1, parts: [T_('p'), ...codeParts(p1), T_('p', true)] },
    { k: 'h2', d: 1, parts: [T_('h2'), W_(pick(PAGE.h2)), T_('h2', true)] },
    { k: 'p2', d: 1, parts: [T_('p'), ...codeParts(p2), T_('p', true)] },
    { k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }
  ].map((ln) => Object.assign(ln, { cls: on(ln.k) ? 'is-read' : '' }));
  const at = (k) => read >= READ12.indexOf(k);
  const blocks = [
    at('h1') ? { t: 'h1', parts: [pick(PAGE.title)], hl: on('h1'), k: 'h1' } : null,
    at('p1') ? { t: 'p', parts: p1, hl: on('p1'), k: 'p1' } : null,
    at('h2') ? { t: 'h2', parts: [pick(PAGE.h2)], hl: on('h2'), k: 'h2' } : null,
    at('p2') ? { t: 'p', parts: p2, hl: on('p2'), k: 'p2' } : null
  ].filter(Boolean);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene z2-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <PaperBrowser title={pick(PAGE.title)} cls="z2-br">{blocks.length ? <PageDoc blocks={blocks} anim={!solved} /> : null}</PaperBrowser>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. СВОЙ ЗАГОЛОВОК и S13b. СВОЙ АБЗАЦ — своя страница двумя экранами (одно
// действие на экран): сначала заголовок в h1, потом предложение в p. Окно
// меняется сразу при наборе; засчитывается только по «Готово» (useTypedDone из
// набора, как в уроке 1; заказчик: пауза в наборе не завершает задание).
// =============================================================================
function OwnTextScreen({ p, id, storeKey, type, max, code }) {
  const pick = usePick();
  const c = C[id];
  const [rec] = useRec(id);
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey, screenId: id, type, lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const input = <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={max} /></span>;
  const v = code(input, ty.shown);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls="z2-br" pageHl={!ty.solved}>{v.blocks.length ? <PageDoc blocks={v.blocks} /> : null}</PaperBrowser>
            <KzCode lines={v.lines} />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}
function S13({ p }) {
  return <OwnTextScreen p={p} id="s13" storeKey="myTitle" type="own-heading" max={30} code={(input, shown) => ({
    blocks: shown ? [{ t: 'h1', parts: [shown] }] : [],
    lines: [
      { k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] },
      { k: 'h', d: 1, cls: 'is-hl', parts: [T_('h1'), input, T_('h1', true)] },
      { k: 'p', d: 1, cls: 'z2-later', parts: [T_('p'), <span key="d" className="kz-dim">…</span>, T_('p', true)] },
      { k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }
    ]
  })} />;
}
function S13B({ p }) {
  const mine = useMine2();
  return <OwnTextScreen p={p} id="s13b" storeKey="myText" type="own-paragraph" max={70} code={(input, shown) => ({
    blocks: [{ t: 'h1', parts: [mine.title] }].concat(shown ? [{ t: 'p', parts: [shown] }] : []),
    lines: [
      { k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] },
      { k: 'h', d: 1, cls: 'z2-ctx', parts: [T_('h1'), W_(mine.title), T_('h1', true)] },
      { k: 'p', d: 1, cls: 'is-hl', parts: [T_('p'), input, T_('p', true)] },
      { k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }
    ]
  })} />;
}

// Своя страница ученика (s13–s15): название и текст, образец — если пропущено.
const useMine2 = () => {
  const store = useStore();
  const pick = usePick();
  return { title: store.get('myTitle') || pick(UI.mySite), text: store.get('myText') || pick(UI.hello) };
};

// =============================================================================
// S14. ВСЁ СТАЛО ЖИРНЫМ — на своей странице <b> открыт и не закрыт: браузер
// честно делает жирным весь текст дальше. Перетащить (или нажать) нужную бирку.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const mine = useMine2();
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
    if (o === '</b>') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'fix-closing', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'smile');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const bw = pick(c.bword), tail = pick(c.tail);
  // Честно: без </b> жирным становится всё до конца страницы, и следующий абзац тоже.
  const blocks = okNow
    ? [{ t: 'h1', parts: [mine.title] }, { t: 'p', parts: [{ b: bw }, ' ' + mine.text], cls: 'z2-a-in' }, { t: 'p', parts: [tail] }]
    : [{ t: 'h1', parts: [mine.title] }, { t: 'p', parts: [{ b: bw + ' ' + mine.text }] }, { t: 'p', parts: [{ b: tail }] }];
  const glow = off.length >= 2 ? '</b>' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z2-s5">
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} cls={'z2-br' + (okNow ? '' : ' z2-broken')} pageHl={!okNow}><PageDoc blocks={blocks} /></PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode lines={[
              { k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] },
              { k: 'h', d: 1, parts: [T_('h1'), W_(mine.title), T_('h1', true)] },
              { k: 'p', d: 1, cls: okNow ? 'is-new' : 'is-hl', parts: [T_('p'), T_('b'), W_(bw), okNow ? <span key="c" className="z2-a-in">{T_('b', true)}</span>
                : <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z2-miss' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />, W_(' ' + mine.text), T_('p', true)] },
              { k: 'p2', d: 1, parts: [T_('p'), W_(tail), T_('p', true)] },
              { k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }
            ]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {c.opts.map((o, i) => (
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
// Q1. НАЙДИ ОШИБКУ (Error Detective) — новая страница про собаку, без образца. Браузер
// честно показывает поломку; ученик нажимает строку кода, в которой ошибка. Нашёл —
// строка чинится сама, страница становится правильной, следующий раунд. Нажал верную
// строку — Коди говорит, почему она в порядке, и куда смотреть. Два раунда.
// =============================================================================
// bad — номер строки с ошибкой; kind — какая ошибка.
const Q1_ROUNDS = [{ bad: 0, kind: 'h1' }, { bad: 2, kind: 'b' }];
function q1Lines(kind, t, fixed) {
  const P = (parts) => [T_('p')].concat(parts, [T_('p', true)]);
  const l0 = kind === 'h1' && !fixed ? [T_('h1'), W_(t.head), T_('h1')] : [T_('h1'), W_(t.head), T_('h1', true)];
  const l2 = kind === 'b' && !fixed ? P([W_(t.pre), T_('b'), W_(t.word + t.post)]) : P([W_(t.pre), T_('b'), W_(t.word), T_('b', true), W_(t.post)]);
  const out = [l0, P([W_(t.line)]), l2];
  if (kind === 'b') out.push(P([W_(t.more)]));
  return out;
}
// Честно, как в настоящем браузере: второй <h1> вместо </h1> — всё ниже внутри заголовка (огромное);
// без </b> жирным становится и хвост абзаца, и следующий абзац.
function q1Blocks(kind, t, fixed) {
  const big = kind === 'h1' && !fixed ? ' z2-inh1' : '';
  const out = [{ t: 'h1', parts: [t.head], k: 'h' }, { t: 'p', parts: [t.line], k: 'l', cls: big }];
  if (kind === 'b' && !fixed) out.push({ t: 'p', parts: [t.pre, { b: t.word + t.post }], k: 'w' }, { t: 'p', parts: [{ b: t.more }], k: 'm' });
  else {
    out.push({ t: 'p', parts: [t.pre, { b: t.word }, t.post], k: 'w', cls: big });
    if (kind === 'b') out.push({ t: 'p', parts: [t.more], k: 'm' });
  }
  return out;
}
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
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === Q1_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!found);
  const st = useRef({ tries: 0, misses: 0 });
  const [next, setNext] = useState(false);
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
  const t = { head: pick(c.head), line: pick(c.line), pre: pick(c.pre), word: pick(c.word), post: pick(c.post), more: pick(c.more) };
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  const ask = found ? (done ? c.ok : c.found[R.kind]) : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene kz-scene-col z2-q1" key={'q' + ri}>
          <div className="kz-col">
            <PaperBrowser title={pick(UI.mySite)} short cls={'z2-br' + (found ? '' : ' z2-broken')}><PageDoc blocks={q1Blocks(R.kind, t, found)} /></PaperBrowser>
            <KzCode lines={[{ k: 'b', d: 0, cls: 'z2-edge', parts: [T_('body')] }].concat(q1Lines(R.kind, t, found).map((parts, j) => ({
              k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 1, parts,
              cls: 'z2-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
            }))).concat([{ k: 'bc', d: 0, cls: 'z2-edge', parts: [T_('body', true)] }])} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q2. ВЕРНО ИЛИ НЕТ (True / False) — три коротких утверждения по очереди, у каждого —
// строчка кода. До первой попытки ничего не подсвечено; промах — кнопка гаснет, Коди
// объясняет, можно снова. После ответа Коди коротко говорит почему — и следующее.
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
      className={'kz-btn z2-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z2-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z2-card z2-tf-card kz-a-drop">
              <span className="z2-card-h">{pick(c.card)}</span>
              <p className="z2-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={[{ k: 'c', d: 0, parts: it.code.map((x, j) => (x.w ? <span key={j}>{W_(pick(x.w))}</span> : <span key={j}>{T_(x.t, x.close)}</span>)) }]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z2-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — своя страница ученика в браузере; роли тегов загораются,
// пока Коди их называет. Единственный праздник урока.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine2();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const bw = pick(C.s14.bword);
  const blocks = [
    { t: 'h1', parts: [mine.title], hl: curK === 'h' },
    { t: 'p', parts: [{ b: bw }, ' ' + mine.text], hl: curK === 'p' ? true : curK === 'bi' ? 'b' : null }
  ];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z2-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <PaperBrowser title={pick(UI.mySite)} cls="z2-br"><PageDoc blocks={blocks} anim /></PaperBrowser>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['h', 'p', 'bi'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'h' ? '#FA4F28' : k === 'p' ? '#0FA38E' : '#7C5CFA' }}>
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
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'CHECK-1', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'PREDICT', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's13b', code: 'LEVEL-4B', Comp: S13B },
  { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 'q1', code: 'CHECK-4', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; название и текст ученика (myTitle, myText) остаются.
const SCREEN_RESET = { s1: ['s1'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s13b: ['s13b'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — страница ученика: название на вкладке и в h1, абзац с жирным словом.
function lesson2Artifact(store, lang) {
  const t = store.get('myTitle'), x = store.get('myText');
  if (!t && !x) return null;
  const bw = C.s14.bword[lang] || C.s14.bword.ru;
  return { type: 'html-page', title: t || '', text: x || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(t || '') + '</title>', '  </head>', '  <body>',
      '    <h1>' + escHtml(t || '') + '</h1>', '    <p><b>' + escHtml(bw) + '</b> ' + escHtml(x || '') + '</p>', '  </body>', '</html>'].join('\n') };
}

export default function HtmlZagolovki({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson2Artifact(store, lang) })
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
