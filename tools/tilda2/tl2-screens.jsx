// =============================================================================
// ЭКРАНЫ УРОКА 2 МОДУЛЯ TILDA «Блоки: что это и как добавить». Показы — указатель (курсор / палец) сам делает шаги под речь
// Коди; задания — ученик сам, указатель стоит у нужной вещи. Страница ученика растёт от экрана к экрану:
// обложка → + заголовок (s4) → + текст (s5) → свой текст (s6) → + картинка (s8) → картинка выше текста (s9).
// Сквозные данные: tl2Title, tl2TextId, tl2Text, tl2Img (шифры выбранных блоков и текст ученика).
// =============================================================================
const useShowHelp = (help) => {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
};
function useActTask(hints0) {
  const lad = useKzLadder(true);
  const [msg, setMsg] = useState(null);
  const st = useRef({ tries: 0, misses: 0 });
  return {
    lad, msg, st, setMsg,
    miss: (m, sayNow) => { st.current.tries += 1; st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); },
    hit: () => { st.current.tries += 1; setMsg(null); },
    now: (h) => msg || hintAt(lad.lv, h || hints0),
    next: (h) => hintAt(Math.min(3, lad.lv + 1), h || hints0)
  };
}
const logOf = (T, id, type, extra) => Object.assign({ screenId: id, type: type, correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv }, extra || {});
const nav2 = (p, canGo) => navOf(p, canGo);
const useCover2 = () => { const pick = usePick(); return { t: 'RoboKlub', p: UI.coverSub, pick }; };

// Блоки страницы ученика (если экран открыт сразу — шифры по умолчанию).
function useParts() {
  const store = useStore();
  const title = blockOf(cardOf(store.get('tl2Title') || 'TL02'), 't');
  const tx = cardOf(store.get('tl2TextId') || 'TX01');
  const text = blockOf(tx, 'x', { t: store.get('tl2Text') || tx.t });
  const img = blockOf(cardOf(store.get('tl2Img') || 'IM01'), 'i');
  return { title, text, img };
}

// =============================================================================
// S1. КРЮЧОК — сообщение клуба: «после обложки — заголовок, картинка, текст». Вопрос-мнение: блок можно потом переставить?
// Коди: «нет — новый блок только вниз, ошибся — всё заново». Это загадка, разгадка — в выводе (↑ ↓, «+», ↶).
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const cover = useCover2();
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ans, setAns] = useState(solved ? rec.k : null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const pickOpt = (k) => {
    if (!canTap || ans) return;
    sfx('tap', true); setAns(k); put({ done: true, k: k });
    sayNow(joinL(c.reply[k], c.riddle), 'curious');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ans ? c.askDone : c.ask} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={ans ? c.askDone : c.ask} />
        <div className="kz-scene tl-scene tl2-hook">
          <div className="tl-msg kz-a-drop">
            <span className="tl-msg-from"><i className="tl-ava" aria-hidden="true" />{pick(c.from)}</span>
            <span className="tl-msg-t">{pick(c.msg)}</span>
            <span className="tl-msg-time">10:24</span>
          </div>
          <TEd2 project="RoboKlub" cls="tl2-mini">
            <TPage2 blocks={[COVER_B]} cover={cover} />
          </TEd2>
          <div className="tl-pick is-two">
            {['yes', 'no'].map((k) => (
              <button key={k} type="button" data-v={k} className={'kz-btn tl-opt' + (ans === k ? ' is-ok' : '')} disabled={!canTap || !!ans} onClick={() => pickOpt(k)}>{pick(c.opts[k])}</button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «ЧТО ТАКОЕ БЛОК» — готовый сайт: указатель подходит к каждому блоку, у блока рамка и шифр (CR28, TL02, IM01, TX01).
// =============================================================================
function S2({ p }) {
  const c = C.s2;
  const cover = useCover2();
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(solved ? null : null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const blocks = [COVER_B, blockOf(cardOf('TL02'), 't'), blockOf(cardOf('IM01'), 'i'), blockOf(cardOf('TX01'), 'x')];
  const ms = reduceMotion() ? 0.1 : 1;
  const visit = (u, i) => [
    { act: () => { scrollToSel('[data-b="' + u + '"]'); } }, { wait: 250 * ms },
    { act: () => { G.go('[data-b="' + u + '"]', 0.62, 0.55); } }, { wait: 700 * ms },
    { act: () => { sfx('pop', true); setSel(u); } },
    { say: [{ text: c.steps[i], pose: 'point' }] }
  ];
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(visit('c', 0), visit('t', 1), visit('i', 2), visit('x', 3), [{ act: () => { G.hide(); put({ done: true }); } }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={blocks} cover={cover} sel={solved ? null : sel} lite />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ПОКАЗ «КАК ДОБАВИТЬ БЛОК» — указатель: «ВСЕ БЛОКИ» → раздел «Заголовок» → карточка TL02 → блок встаёт после обложки.
// =============================================================================
function S3({ p }) {
  const c = C.s3;
  const cover = useCover2();
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [lib, setLib] = useState(false);
  const [cat, setCat] = useState(null);
  const [blocks, setBlocks] = useState(solved ? [COVER_B, blockOf(cardOf('TL02'), 't')] : [COVER_B]);
  const [born, setBorn] = useState(null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => G.go('.tl-all', 0.5, 0.5) }, { wait: 800 * ms }, { act: () => { G.tap(); setLib(true); } }, { wait: 600 * ms },
    { say: [{ text: c.steps[1], pose: 'point' }] },
    { act: () => G.go('[data-v="cat2"]', 0.4, 0.5) }, { wait: 800 * ms }, { act: () => { G.tap(); setCat(CAT_TITLE); } }, { wait: 600 * ms },
    { say: [{ text: c.steps[2], pose: 'point' }] },
    { act: () => G.go('[data-v="TL02"] .tl2-th', 0.5, 0.5) }, { wait: 800 * ms },
    { act: () => { G.tap(); setLib(false); setCat(null); sfx('pop', true); setBlocks([COVER_B, blockOf(cardOf('TL02'), 't')]); setBorn('t'); } }, { wait: 700 * ms },
    { act: () => G.go('[data-b="t"]', 0.7, 0.5) },
    { say: [{ text: c.steps[3], pose: 'smile' }] },
    { act: () => { G.hide(); put({ done: true }); } }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={blocks} cover={cover} born={born} />
            <TDock />
            {lib ? <TLib2 cat={cat} off /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Задание «добавь блок из библиотеки» (s4 — заголовок, s5 — текст, s8 — картинка через «+»). Шаги: открыть библиотеку →
// нужный раздел (чужой — своя причина) → карточка (цитата QT01 — своя причина). where — после какого блока встаёт новый.
// =============================================================================
function useAddTask({ id, c, catOk, base, plusOnly, onDone }) {
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);       // 0 — открыть, 1 — раздел, 2 — карточка, 3 — готово
  const [cat, setCat] = useState(null);
  const [flash, setFlash] = useState(null);
  const [born, setBorn] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const open = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); };
  const onCat = (i) => {
    if (!canTap || st < 1 || st > 2) return;
    if (i !== catOk) { setCat(null); setSt(1); T.miss(c.wrongCat, sayNow); return; }
    T.hit(); sfx('tap', true); setCat(i); setSt(2);
  };
  const onCard = (card) => {
    if (!canTap || st !== 2) return;
    if (card.k === 'quote') { setFlash(card.id); setTimeout(() => setFlash(null), 600); T.miss(c.quote, sayNow); return; }
    T.hit(); sfx('ok', true); setSt(3); setCat(null);
    const u = onDone(card);
    setBorn(u); put({ done: true });
    log(logOf(T, id, 'add-block', { value: card.id }));
    sayNow(c.ok, 'cheer');
  };
  return { solved, st, cat, flash, born, T, speaker, spoken, sayNow, canTap, canGo, open, onCat, onCard, setSt };
}
function AddScreen({ p, id, c, catOk, storeKey, makeBlocks }) {
  const store = useStore();
  const cover = useCover2();
  const parts = useParts();
  const A = useAddTask({ id, c, catOk, onDone: (card) => { store.set(storeKey, card.id); return storeKey === 'tl2Title' ? 't' : 'x'; } });
  const blocks = makeBlocks(parts, A.st === 3);
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, A.st === 0 ? '.tl-all' : A.st === 1 ? '[data-v="cat' + catOk + '"]' : A.st === 2 ? '[data-v="' + LIB2[catOk][0].id + '"] .tl2-th' : null, A.canTap);
  const askNow = A.st === 3 ? c.ask : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={A.speaker} done={A.canGo} hint={A.solved ? null : (A.T.next() || c.ask)} nav={nav2(p, A.canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={askNow} hint={A.st === 3 ? null : A.T.now()} err={!!A.T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={blocks} cover={cover} born={A.born} />
            <TDock led={A.canTap && A.st === 0} onAll={A.canTap && A.st === 0 ? A.open : null} />
            {A.st === 1 || A.st === 2 ? <TLib2 cat={A.cat} onCat={A.onCat} onCard={A.onCard} off={!A.canTap} flash={A.flash} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}
// S4. ЗАДАНИЕ «ДОБАВЬ ЗАГОЛОВОК» — «ВСЕ БЛОКИ» → «Заголовок» → любой TL.
function S4({ p }) {
  return <AddScreen p={p} id="s4" c={C.s4} catOk={CAT_TITLE} storeKey="tl2Title" makeBlocks={(P, done) => (done ? [COVER_B, P.title] : [COVER_B])} />;
}
// S5. ЗАДАНИЕ «ДОБАВЬ ТЕКСТ» — «ВСЕ БЛОКИ» → «Текстовый блок» → TX01 / TX02 (цитата QT01 — своя причина).
function S5({ p }) {
  return <AddScreen p={p} id="s5" c={C.s5} catOk={CAT_TEXT} storeKey="tl2TextId" makeBlocks={(P, done) => (done ? [COVER_B, P.title, P.text] : [COVER_B, P.title])} />;
}

// =============================================================================
// S6. ЗАДАНИЕ «СВОЙ ТЕКСТ» — нажать на текст блока, написать о клубе, «Готово» (пустой и старый текст — свои причины).
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const log = useLog();
  const store = useStore();
  const cover = useCover2();
  const P = useParts();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const T = useActTask(c.hints);
  const inRef = useRef(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const old = (cardOf(store.get('tl2TextId') || 'TX01') || {}).t || '';
  useEffect(() => { if (editing && inRef.current) { try { inRef.current.focus(); } catch (e) { /* без фокуса */ } } }, [editing]);
  const save = () => {
    const v = draft.trim().replace(/\s+/g, ' ');
    if (!v) { T.miss(c.empty, sayNow); return; }
    if (v.toLowerCase() === old.toLowerCase()) { T.miss(c.same, sayNow); return; }
    T.hit(); sfx('ok', true); store.set('tl2Text', v); setEditing(false); put({ done: true });
    log(logOf(T, 's6', 'edit-text', { value: v }));
    sayNow(c.ok, 'cheer');
  };
  const text = Object.assign({}, P.text, { t: solved ? (store.get('tl2Text') || P.text.t) : old });
  const groot = useRef(null);
  const G = useGuide(groot);
  const ready = draft.trim() && draft.trim().toLowerCase() !== old.toLowerCase();
  usePoint2(G, solved ? null : editing ? (ready ? '.tl2-ok' : '.tl2-in') : '[data-t="text"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={[COVER_B, P.title, text]} cover={cover} editing={editing}
              onText={!solved && canTap && !editing ? () => { sfx('tap', true); setDraft(old); setEditing(true); T.setMsg(null); } : null}
              edit={(
                <span className="tl2-edit">
                  <textarea ref={inRef} className="tl2-in" value={draft} maxLength={160} rows={3} placeholder={pick(c.ph)} aria-label={pick(c.ask)}
                    onChange={(e) => { setDraft(e.target.value); T.setMsg(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); } }}
                    autoComplete="off" spellCheck={false} enterKeyHint="done" />
                  <button type="button" className="kz-btn is-coral tl2-ok" onClick={save}>{pick(UI.done)}</button>
                </span>
              )} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ПОКАЗ «КНОПКИ БЛОКА» — указатель выбирает текст и по очереди жмёт: копировать (появилась копия), удалить (копия ушла),
// выключить (блок бледный) и включить, ↑ (текст выше заголовка) и ↓ (обратно), потом показывает «+» под блоком.
// Показ идёт на копии страницы — страница ученика не меняется.
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const cover = useCover2();
  const P = useParts();
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const start = [COVER_B, P.title, P.text];
  const [blocks, setBlocks] = useState(start);
  const [sel, setSel] = useState(null);
  const [born, setBorn] = useState(null);
  const [gone, setGone] = useState(null);
  const [plus, setPlus] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const T = (u, t) => '[data-b="' + u + '"] [data-t="' + t + '"]';
  const press = (u, t, f) => [
    { act: () => { scrollToSel(T(u, t)); } }, { wait: 200 * ms },
    { act: () => G.go(T(u, t)) }, { wait: 800 * ms }, { act: () => { G.tap(); f(); } }, { wait: 800 * ms }
  ];
  const copyText = Object.assign({}, P.text, { u: 'x2' });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(
    [{ act: () => G.go('[data-b="x"]', 0.7, 0.6) }, { wait: 700 * ms }, { act: () => { G.tap(); setSel('x'); } }, { wait: 500 * ms }],
    [{ say: [{ text: c.steps[0], pose: 'point' }] }],
    press('x', 'copy', () => { sfx('pop', true); setBlocks([COVER_B, P.title, P.text, copyText]); setBorn('x2'); setSel('x2'); }),
    [{ say: [{ text: c.steps[1], pose: 'point' }] }],
    press('x2', 'del', () => { sfx('soft', true); setGone('x2'); setTimeout(() => { setBlocks([COVER_B, P.title, P.text]); setGone(null); setSel('x'); }, 380); }),
    [{ say: [{ text: c.steps[2], pose: 'point' }] }],
    press('x', 'off', () => { sfx('tap', true); setBlocks([COVER_B, P.title, Object.assign({}, P.text, { off: true })]); }),
    press('x', 'off', () => { sfx('tap', true); setBlocks([COVER_B, P.title, P.text]); }),
    [{ say: [{ text: c.steps[3], pose: 'point' }] }],
    press('x', 'up', () => { sfx('pop', true); setBlocks([COVER_B, P.text, P.title]); }),
    press('x', 'down', () => { sfx('pop', true); setBlocks([COVER_B, P.title, P.text]); }),
    [{ act: () => setPlus(true) }, { wait: 300 * ms }, { act: () => { scrollToSel(T('x', 'plus')); G.go(T('x', 'plus')); } }, { wait: 700 * ms }, { act: () => G.tap() }],
    [{ say: [{ text: c.steps[4], pose: 'smile' }] }],
    [{ act: () => { G.hide(); put({ done: true }); } }]
  ) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={solved ? start : blocks} cover={cover} sel={solved ? 'x' : sel} born={born} gone={gone} onTool={() => {}} onPlus={solved || plus ? () => {} : null} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ЗАДАНИЕ «КАРТИНКА ЧЕРЕЗ +» — текст выбран, под ним «+» → «Изображение» → IM01 / IM02; блок встаёт после текста.
// «+» под другим блоком — своя причина; «ВСЕ БЛОКИ» здесь не нужен (выключен).
// =============================================================================
function S8({ p }) {
  const c = C.s8;
  const log = useLog();
  const store = useStore();
  const cover = useCover2();
  const P = useParts();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);
  const [sel, setSel] = useState(solved ? null : 'x');
  const [cat, setCat] = useState(null);
  const [born, setBorn] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onPlus = (u) => {
    if (!canTap || st !== 0) return;
    if (u !== 'x') { T.miss(c.wrongPlus, sayNow); return; }
    T.hit(); sfx('pop', true); setSt(1);
  };
  const onCat = (i) => {
    if (!canTap || st < 1 || st > 2) return;
    if (i !== CAT_IMG) { setCat(null); setSt(1); T.miss(c.wrongCat, sayNow); return; }
    T.hit(); sfx('tap', true); setCat(i); setSt(2);
  };
  const onCard = (card) => {
    if (!canTap || st !== 2) return;
    T.hit(); sfx('ok', true); store.set('tl2Img', card.id); setSt(3); setCat(null); setSel(null); setBorn('i'); put({ done: true });
    log(logOf(T, 's8', 'add-block-plus', { value: card.id }));
    sayNow(c.ok, 'cheer');
  };
  const img = blockOf(cardOf(store.get('tl2Img') || 'IM01'), 'i');
  const blocks = st === 3 ? [COVER_B, P.title, P.text, img] : [COVER_B, P.title, P.text];
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, st === 0 ? (sel === 'x' ? '[data-b="x"] [data-t="plus"]' : '[data-b="x"]') : st === 1 ? '[data-v="cat4"]' : st === 2 ? '[data-v="IM01"] .tl2-th' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 3 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={blocks} cover={cover} sel={st === 0 ? sel : null} born={born}
              onSel={canTap && st === 0 ? (u) => { sfx('tap', true); setSel(u); } : null}
              onTool={canTap && st === 0 ? () => {} : null} onPlus={st === 0 ? onPlus : null} />
            <TDock />
            {st === 1 || st === 2 ? <TLib2 cat={cat} onCat={onCat} onCard={onCard} off={!canTap} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Задание с кнопками блока (s9 — ↑ у картинки, s10 — корзина у лишнего заголовка). Нажатие на блок выбирает его;
// check(u, t, blocks) решает: { ok, blocks } — верно и новая страница; { miss } — своя причина.
// =============================================================================
function ToolScreen({ p, id, c, start, check, type, aim }) {
  const log = useLog();
  const cover = useCover2();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [blocks, setBlocks] = useState(solved ? rec.blocks : start);
  const [sel, setSel] = useState(null);
  const [gone, setGone] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onTool = (u, t) => {
    if (!canTap || solved) return;
    const r = check(u, t, blocks);
    if (r.miss) { T.miss(r.miss, sayNow); return; }
    T.hit(); sfx('ok', true);
    const fin = () => { setBlocks(r.blocks); setSel(null); setGone(null); put({ done: true, blocks: r.blocks }); };
    if (t === 'del') { setGone(u); setTimeout(fin, 380); } else fin();
    log(logOf(T, id, type));
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  const a = aim(sel);
  usePoint2(G, solved ? null : a, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage2 blocks={blocks} cover={cover} sel={solved ? null : sel} gone={gone}
              onSel={canTap && !solved ? (u) => { if (u !== sel) sfx('tap', true); setSel(u); T.setMsg(null); } : null}
              onTool={canTap && !solved ? onTool : null} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}
const moveUp = (bs, u) => { const i = bs.findIndex((b) => b.u === u); if (i <= 0) return bs; const o = bs.slice(); [o[i - 1], o[i]] = [o[i], o[i - 1]]; return o; };
// S9. ЗАДАНИЕ «ПЕРЕСТАВЬ» — картинка ниже текста; ↑ у картинки. ↓ у картинки, стрелки у другого блока, другие кнопки — свои причины.
function S9({ p }) {
  const c = C.s9;
  const P = useParts();
  const start = [COVER_B, P.title, P.text, P.img];
  const check = (u, t, bs) => {
    if (t === 'up' || t === 'down') {
      if (u !== 'i') return { miss: c.wrongBlock };
      if (t === 'down') return { miss: c.wrongDown };
      return { blocks: moveUp(bs, 'i') };
    }
    return { miss: c.wrongTool };
  };
  return <ToolScreen p={p} id="s9" c={c} start={start} check={check} type="move-up" aim={(sel) => (sel === 'i' ? '[data-b="i"] [data-t="up"]' : '[data-b="i"]')} />;
}
// S10. ЗАДАНИЕ «УДАЛИ ЛИШНЕЕ» — два одинаковых заголовка подряд; корзина у любого из них. Корзина у другого блока — «нужен».
function S10({ p }) {
  const c = C.s10;
  const P = useParts();
  const start = [COVER_B, P.title, Object.assign({}, P.title, { u: 't2' }), P.img, P.text];
  const check = (u, t, bs) => {
    if (t !== 'del') return { miss: c.wrongTool };
    if (u !== 't' && u !== 't2') return { miss: c.wrong };
    return { blocks: bs.filter((b) => b.u !== u) };
  };
  return <ToolScreen p={p} id="s10" c={c} start={start} check={check} type="delete" aim={(sel) => (sel === 't2' ? '[data-b="t2"] [data-t="del"]' : '[data-b="t2"]')} />;
}

// =============================================================================
// S11. ЗАДАНИЕ «ОТМЕНИ» — Коди «случайно» удаляет текст (блок уходит на глазах); ученик жмёт ↶ — текст возвращается.
// ↷ — своя причина; ↶ в настоящей Tilda возвращает удалённый блок (сверка 24.11.2026).
// =============================================================================
function S11({ p }) {
  const c = C.s11;
  const log = useLog();
  const cover = useCover2();
  const P = useParts();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const full = [COVER_B, P.title, P.img, P.text];
  const [blocks, setBlocks] = useState(solved ? full : full);
  const [gone, setGone] = useState(null);
  const [lost, setLost] = useState(false);
  const [born, setBorn] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  useEffect(() => {
    if (solved) return undefined;
    const t1 = setTimeout(() => { scrollToSel('[data-b="x"]'); }, 300);
    const t2 = setTimeout(() => { sfx('soft', true); setGone('x'); }, 900);
    const t3 = setTimeout(() => { setBlocks([COVER_B, P.title, P.img]); setGone(null); setLost(true); }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const undo = () => {
    if (!canTap || solved || !lost) return;
    T.hit(); sfx('win', true); setBlocks(full); setBorn('x'); setLost(false); put({ done: true });
    log(logOf(T, 's11', 'undo'));
    sayNow(c.ok, 'cheer');
    setTimeout(() => scrollToSel('[data-b="x"]'), 120);
  };
  const redo = () => { if (!canTap || solved || !lost) return; T.miss(c.wrongRedo, sayNow); };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, solved || !lost ? null : '[data-t="undo"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" onUndo={canTap && lost ? undo : null} undoLed={canTap && lost} onRedo={canTap && lost ? redo : null}>
            <TPage2 blocks={blocks} cover={cover} gone={gone} born={born} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ПРОВЕРКА «КАКАЯ КНОПКА?» — 4 вопроса подряд; ответ — значок без подписи (подпись видна после ответа).
// =============================================================================
const QUIZ_KEYS = ['up', 'down', 'del', 'copy', 'off', 'undo'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const log = useLog();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okK, setOkK] = useState(solved ? c.rounds[c.rounds.length - 1].a : null);
  const [bad, setBad] = useState(null);
  const misses = useRef(0);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const R = c.rounds[r];
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tap = (k) => {
    if (!canTap || solved || okK) return;
    if (k !== R.a) {
      misses.current += 1; setBad(k); sfx('soft', true);
      const h = misses.current >= 2 ? c.hint2 : c.hint1;
      sayNow(h, 'think'); if (misses.current >= 2) lad.bump();
      setTimeout(() => setBad(null), 700);
      return;
    }
    sfx('ok', true); setOkK(k);
    const last = r === c.rounds.length - 1;
    if (last) {
      put({ done: true });
      log({ screenId: 's12', type: 'tools-quiz', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene tl-scene tl2-quiz">
          <div className="tl2-qn" aria-live="polite">
            <span className="tl2-qdots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <b key={r} className="kz-a-drop">{pick(R.q)}</b>
          </div>
          <div className="tl2-qb" translate="no">
            {QUIZ_KEYS.map((k) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK}
                className={'tl2-qk' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)} aria-label={okK === k ? pick(c.names[k]) : k}>
                <TIco k={k} />
                <span className={'tl2-qname' + (okK === k ? ' is-on' : '')}>{okK === k ? pick(c.names[k]) : '?'}</span>
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. В НАСТОЯЩЕЙ TILDA — шаги списком; адрес своего сайта (…tilda.ws) или «Сделаю позже».
// =============================================================================
const tildaUrl = (v) => String(v || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(solved ? (store.get('tl2RealUrl') || '') : '');
  const [msg, setMsg] = useState(null);
  const tries = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? (rec.later ? c.okLater : c.ok) : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const u = tildaUrl(val);
    if (!/^[a-z0-9][a-z0-9-]*\.tilda\.ws$/.test(u)) { sfx('soft', true); setMsg(c.bad); sayNow(c.bad, 'think'); return; }
    if (u === SITE_URL) { sfx('soft', true); setMsg(c.demo); sayNow(c.demo, 'think'); return; }
    sfx('win', true); setMsg(null); store.set('tl2RealUrl', u); put({ done: true, later: false });
    log({ screenId: 's13', type: 'real-tilda', correct: true, firstTry: tries.current === 1, attempts: tries.current, hints: 0, depth: 0, value: u });
    sayNow(c.ok, 'cheer');
  };
  const later = () => {
    if (!canTap || solved) return;
    sfx('tap', true); put({ done: true, later: true });
    log({ screenId: 's13', type: 'real-tilda', correct: false, firstTry: false, attempts: tries.current, hints: 0, depth: 0, value: 'later' });
    sayNow(c.okLater, 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={nav2(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={msg} err={!!msg} />
        <div className="kz-scene tl-scene">
          <ol className="tl-real">{c.steps.map((st, i) => <li key={i}><b>{i + 1}</b><span>{pick(st)}</span></li>)}</ol>
          <div className="tl-real-in">
            <span className="tl-url is-field"><i className="tl-globe" aria-hidden="true" />
              <input value={val} placeholder={pick(c.ph)} aria-label={pick(c.ask)} disabled={solved} data-v="url"
                onChange={(e) => { setVal(e.target.value); setMsg(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } }}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} inputMode="url" enterKeyHint="done" />
            </span>
            {!solved ? (
              <span className="tl-real-btns">
                <button type="button" className="kz-btn is-coral" data-v="check" disabled={!canTap || !val.trim()} onClick={check}>{pick(c.check)}</button>
                <button type="button" className="kz-btn is-ghost" data-v="later" disabled={!canTap} onClick={later}>{pick(c.later)}</button>
              </span>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ВЫВОД — разгадка (Коди ошибся: «+», стрелки, ↶), страница ученика из четырёх блоков, что умеем, следующий урок.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const cover = useCover2();
  const P = useParts();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="tl-sheet">
        <div className="kz-scene tl-scene tl-end tl2-end">
          <div className="tl-ed is-live tl2-live" translate="no">
            <div className="tl-url"><i className="tl-globe" aria-hidden="true" /><span>{SITE_URL}</span></div>
            <div className="tl2-canvas"><TPage2 blocks={[COVER_B, P.title, P.img, P.text]} cover={cover} /></div>
          </div>
          <div className="kz-roles tl-roles">
            {['riddle', 'code', 'add', 'tools'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'code' ? '#0FA38E' : k === 'add' ? '#7952B3' : '#D97706' }}>
                <i aria-hidden="true" />{pick(c.roles[k])}
              </span>
            ))}
          </div>
          <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 },
  { id: 's8', code: 'LEVEL-2', Comp: S8 }, { id: 's9', code: 'LEVEL-2', Comp: S9 }, { id: 's10', code: 'LEVEL-2', Comp: S10 },
  { id: 's11', code: 'LEVEL-3', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 }, { id: 's13', code: 'CHECK', Comp: S13 },
  { id: 's14', code: 'ACHIEVEMENT', Comp: S14 }
];
// «Повторить» стирает только экран; блоки и текст ученика остаются.
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonTl2Artifact(store) {
  if (!store.get('tl2Text')) return null;
  return { type: 'tilda-blocks', blocks: ['CR28', store.get('tl2Title') || 'TL02', store.get('tl2Img') || 'IM01', store.get('tl2TextId') || 'TX01'], text: store.get('tl2Text'),
    realUrl: store.get('tl2RealUrl') ? 'https://' + store.get('tl2RealUrl') : null };
}

export default function TildaBloki({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonTl2Artifact(store) })
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
