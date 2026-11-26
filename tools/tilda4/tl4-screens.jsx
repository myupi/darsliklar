// =============================================================================
// ЭКРАНЫ УРОКА 4 МОДУЛЯ TILDA «Картинки и Cover». Показы — указатель (курсор / палец) сам делает шаги под речь Коди;
// задания — ученик нажимает сам (ничего не печатает), указатель стоит у нужной вещи. Сайт клуба меняется от экрана к экрану:
// только текст и чужие горы на обложке (s1) → серая картинка IM01 (s3) → фото клуба (s4) → лишние картинки убраны (s6) →
// фото клуба на обложке (s8) → фильтр 70% (s10). Сквозные данные: tl4RealUrl.
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
const nav4 = (p, canGo) => navOf(p, canGo);
const shake = (set, k) => { set(k); setTimeout(() => set(null), 700); };

// Блоки страницы урока 4.
const B4 = {
  cover: { u: 'c', k: 'cover', id: 'CR28', foto: 'mount', f: 10, f2: 10 }, title: { u: 't', k: 'title', id: 'TL02' },
  text: { u: 'x', k: 'text', id: 'TX01' }, img: { u: 'i', k: 'img', id: 'IM01', foto: null }, button: { u: 'b', k: 'button', id: 'BF101' }
};
const cov4 = (o) => Object.assign({}, B4.cover, o || {});
const img4 = (foto, o) => Object.assign({}, B4.img, { foto: foto }, o || {});
const page4 = (cover, imgB) => [cover || B4.cover, B4.title, B4.text].concat(imgB ? [imgB] : []).concat([B4.button]);
const COVER_DONE = { foto: 'club', f: 70, f2: 70 };
// Текст «печатается» в поиске библиотеки (показ).
function useTypeIn() {
  const [q, setQ] = useState('');
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const ms = reduceMotion() ? 0.1 : 1;
  const typeIn = (s) => { setQ(''); Array.from(s).forEach((ch, i) => tm.current.push(setTimeout(() => setQ(s.slice(0, i + 1)), (i + 1) * 110 * ms))); };
  return [q, typeIn, setQ];
}

// =============================================================================
// S1. КРЮЧОК — сообщение клуба: «одни буквы, а на обложке чужие горы». Вопрос-мнение и загадка Коди.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
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
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ans ? c.askDone : c.ask} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={ans ? c.askDone : c.ask} />
        <div className="kz-scene tl-scene tl2-hook tl4-hook">
          <div className="tl-msg kz-a-drop">
            <span className="tl-msg-from"><i className="tl-ava" aria-hidden="true" />{pick(c.from)}</span>
            <span className="tl-msg-t">{pick(c.msg)}</span>
            <span className="tl-msg-time">16:20</span>
          </div>
          <TEd2 project="RoboKlub" cls="tl2-mini">
            <TPage4 blocks={page4()} />
          </TEd2>
          <div className="tl-pick is-two">
            {['many', 'club'].map((k) => (
              <button key={k} type="button" data-v={k} className={'kz-btn tl-opt' + (ans === k ? ' is-ok' : '')} disabled={!canTap || !!ans} onClick={() => pickOpt(k)}>{pick(c.opts[k])}</button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «БЛОК КАРТИНКИ» — текст → «+» → «Изображение» → IM01 (серая заглушка) → «Контент» → «Искать в библиотеке» →
// поиск robot. Какое фото — ученик выберет сам (s4).
// =============================================================================
function S2({ p }) {
  const c = C.s2;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(null);
  const [lib, setLib] = useState(false);
  const [cat, setCat] = useState(null);
  const [has, setHas] = useState(solved);
  const [born, setBorn] = useState(null);
  const [cnt, setCnt] = useState(false);
  const [ilib, setIlib] = useState(false);
  const [q, typeIn] = useTypeIn();
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { scrollToSel('[data-b="x"]'); G.go('[data-b="x"]', 0.5, 0.55); } }, { wait: 800 * ms },
    { act: () => { G.tap(); setSel('x'); } }, { wait: 500 * ms },
    { act: () => G.go('[data-b="x"] [data-t="plus"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setLib(true); } }, { wait: 500 * ms },
    { act: () => G.go('[data-v="cat4"]', 0.4, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setCat(CAT_IMG4); } }, { wait: 500 * ms },
    { act: () => G.go('[data-v="IM01"] .tl4-th', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setLib(false); setCat(null); sfx('pop', true); setHas(true); setBorn('i'); setSel('i'); } }, { wait: 400 * ms },
    { act: () => { scrollTopTo('[data-b="i"]'); } }, { wait: 300 * ms },
    { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => G.go('[data-b="i"] [data-t="content"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setCnt(true); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[1], pose: 'explain' }] },
    { act: () => G.go('[data-t="libsearch"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setIlib(true); } }, { wait: 400 * ms },
    { act: () => { G.go('.tl4-q', 0.3, 0.5); typeIn('robot'); } }, { wait: 1000 * ms },
    { say: [{ text: c.steps[2], pose: 'point' }] },
    { act: () => { G.hide(); put({ done: true }); } }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub" cls={cnt ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(null, has ? img4(null) : null)} sel={solved ? null : sel} born={born} lite onPlus={sel === 'x' ? () => {} : null} onContent={sel === 'i' ? () => {} : null} />
            {lib ? <TLib4 cat={cat} off /> : null}
            {cnt ? <TImgCnt onLib={() => {}} /> : null}
            {ilib ? <TImgLib q={q} typing={q.length < 5} fotos={q.length >= 5 ? ['movie', 'club', 'vacuum', 'factory'] : ['mount', 'sunset', 'cat', 'pizza']} off /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ЗАДАНИЕ «ДОБАВЬ КАРТИНКУ» — текст → «+» → «Изображение» → IM01. «+» у другого блока, чужой раздел, замок — причины.
// =============================================================================
function S3({ p }) {
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 4 : 0);   // 0 — выбрать текст, 1 — «+», 2 — раздел, 3 — блок, 4 — готово
  const [sel, setSel] = useState(null);
  const [cat, setCat] = useState(null);
  const [flash, setFlash] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onSel = (u) => { if (!canTap || st > 1) return; sfx('tap', true); setSel(u); setSt(1); T.setMsg(null); };
  const onPlus = (u) => {
    if (!canTap || st !== 1) return;
    if (u !== 'x') { T.miss(c.wrongPlace, sayNow); return; }
    T.hit(); sfx('pop', true); setSt(2);
  };
  const onCat = (i) => {
    if (!canTap || st < 2 || st > 3) return;
    if (i !== CAT_IMG4) { setCat(null); setSt(2); T.miss(c.wrongCat, sayNow); return; }
    T.hit(); sfx('tap', true); setCat(i); setSt(3);
  };
  const onCard = (card) => {
    if (!canTap || st !== 3) return;
    if (card.lock) { shake(setFlash, card.id); T.miss(c.locked, sayNow); return; }
    T.hit(); sfx('ok', true); setSt(4); setCat(null); setSel(null); put({ done: true });
    log(logOf(T, 's3', 'add-image', { value: card.id }));
    sayNow(c.ok, 'cheer');
    setTimeout(() => scrollToSel('[data-b="i"]'), 150);
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, st === 0 ? '[data-b="x"]' : st === 1 ? (sel === 'x' ? '[data-b="x"] [data-t="plus"]' : '[data-b="x"]') : st === 2 ? '[data-v="cat4"]' : st === 3 ? '[data-v="IM01"] .tl4-th' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 4 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage4 blocks={page4(null, st === 4 ? img4(null) : null)} sel={st === 1 ? sel : null} born={st === 4 ? 'i' : null} lite
              onSel={canTap && st < 2 ? onSel : null} onPlus={canTap && st === 1 ? onPlus : null} plusLed={sel === 'x'} />
            {st === 2 || st === 3 ? <TLib4 cat={cat} onCat={onCat} onCard={onCard} off={!canTap} flash={flash} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ЗАДАНИЕ «ВЫБЕРИ ФОТО» — «Контент» → «Искать в библиотеке» (robot) → фото занятия клуба → «Сохранить и закрыть».
// =============================================================================
function S4({ p }) {
  const c = C.s4;
  const log = useLog();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 4 : 0);   // 0 — «Контент», 1 — «Искать в библиотеке», 2 — фото, 3 — сохранить, 4 — готово
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onContent = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); };
  const onLib = () => { if (!canTap || st !== 1) return; T.hit(); sfx('pop', true); setSt(2); };
  const onPick = (k) => {
    if (!canTap || st !== 2) return;
    if (k !== 'club') { shake(setBad, k); T.miss(c.wrong[k], sayNow); return; }
    T.hit(); sfx('ok', true); setSt(3); sayNow(c.picked, 'smile');
  };
  const onSave = () => {
    if (!canTap || st !== 3) return;
    sfx('win', true); setSt(4); put({ done: true });
    log(logOf(T, 's4', 'pick-photo', { value: 'club' }));
    sayNow(c.ok, 'cheer');
  };
  useEffect(() => { const t = setTimeout(() => scrollTopTo('[data-b="i"]'), 300); return () => clearTimeout(t); }, []);
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, st === 0 ? '[data-b="i"] [data-t="content"]' : st === 1 ? '[data-t="libsearch"]' : st === 2 && T.lad.lv >= 3 ? '[data-v="foto-club"]' : st === 3 ? '[data-t="saveclose"]' : null, canTap);
  const panel = st >= 1 && st <= 3;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 4 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={panel ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(null, img4(st === 4 ? 'club' : null, { flash: st === 4 }))} sel={st < 4 ? 'i' : null} lite
              onContent={canTap && st === 0 ? onContent : null} contentLed={canTap && st === 0} />
            {panel ? <TImgCnt foto={st === 3 ? 'club' : null} onLib={canTap && st === 1 ? onLib : null} libLed={st === 1} onSave={canTap && st === 3 ? onSave : null} saveLed={st === 3} /> : null}
            {st === 2 ? <TImgLib q="robot" fotos={['movie', 'club', 'vacuum', 'factory']} onPick={canTap ? onPick : null} bad={bad} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ЗАДАНИЕ «АЛЬТ-ТЕКСТ» — «…» у файла → «SEO: АЛЬТ-ТЕКСТ» → описание «Дети собирают робота» → «Сохранить и закрыть».
// =============================================================================
function S5({ p }) {
  const c = C.s5;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);   // 0 — «…», 1 — описание, 2 — сохранить, 3 — готово
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onDots = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); };
  const onAlt = (k) => {
    if (!canTap || st !== 1) return;
    if (k !== 'kids') { shake(setBad, k); T.miss(c.wrong[k], sayNow); return; }
    T.hit(); sfx('ok', true); setSt(2); sayNow(c.picked, 'smile');
  };
  const onSave = () => {
    if (!canTap || st !== 2) return;
    sfx('win', true); setSt(3); put({ done: true });
    log(logOf(T, 's5', 'alt-text', { value: 'kids' }));
    sayNow(c.ok, 'cheer');
  };
  useEffect(() => { const t = setTimeout(() => scrollTopTo('[data-b="i"]'), 300); return () => clearTimeout(t); }, []);
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, st === 0 ? '[data-t="dots"]' : st === 1 && T.lad.lv >= 3 ? '[data-v="alt-kids"]' : st === 2 ? '[data-t="saveclose"]' : null, canTap);
  const opts = ['file', 'pic', 'kids'].map((k) => [k, c.opts[k]]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 3 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={st < 3 ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(null, img4('club'))} sel={st < 3 ? 'i' : null} lite />
            {st < 3 ? (
              <TImgCnt foto="club" onDots={canTap && st === 0 ? onDots : null} dotsLed={st === 0} alt={st >= 1}
                altVal={st >= 2 ? c.opts.kids : null} altOpts={st === 1 ? opts : null} onAlt={canTap ? onAlt : null} altBad={bad}
                onSave={canTap && st === 2 ? onSave : null} saveLed={st === 2} />
            ) : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. ЗАКРЕПЛЕНИЕ «ЛИШНИЕ КАРТИНКИ» — Коди добавил кота, закат и пиццу. Удалить их корзиной; фото клуба оставить.
// =============================================================================
const EXTRA = [['i2', 'cat'], ['i3', 'sunset'], ['i4', 'pizza']];
function S6({ p }) {
  const c = C.s6;
  const log = useLog();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [left, setLeft] = useState(solved ? [] : EXTRA.map((x) => x[0]));
  const [gone, setGone] = useState(null);
  const [sel, setSel] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onTool = (u, t) => {
    if (!canTap || solved || gone) return;
    if (t !== 'del') { T.miss(c.wrongTool, sayNow); return; }
    if (u === 'i') { T.miss(c.keep, sayNow); return; }
    if (left.indexOf(u) < 0) { T.miss(c.notImg, sayNow); return; }
    T.hit(); sfx('pop', true); setGone(u); setSel(null);
    setTimeout(() => {
      const rest = left.filter((x) => x !== u);
      setLeft(rest); setGone(null);
      if (!rest.length) {
        put({ done: true }); log(logOf(T, 's6', 'remove-extra'));
        sayNow(c.ok, 'cheer');
      } else sayNow(c.half, 'smile');
    }, reduceMotion() ? 50 : 380);
  };
  const extras = EXTRA.filter((x) => left.indexOf(x[0]) >= 0).map(([u, f]) => img4(f, { u: u }));
  const blocks = [B4.cover, B4.title, B4.text, img4('club')].concat(extras).concat([B4.button]);
  const groot = useRef(null);
  const G = useGuide(groot);
  const target = left[0];
  usePoint2(G, solved || !target ? null : sel && left.indexOf(sel) >= 0 ? '[data-b="' + sel + '"] [data-t="del"]' : '[data-b="' + target + '"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub">
            <TPage4 blocks={blocks} sel={solved ? null : sel} gone={gone} ledTool={sel && left.indexOf(sel) >= 0 ? 'del' : null}
              onSel={canTap && !solved ? (u) => { if (u !== sel) sfx('tap', true); setSel(u); T.setMsg(null); } : null}
              onTool={canTap && !solved ? onTool : null} />
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ПОКАЗ «ОБЛОЖКА» — обложка → «Контент» → «Искать в библиотеке» → вертикальное фото (голова робота обрезана) →
// снова, широкое фото (закат — видно всё, но не про клуб).
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(null);
  const [cnt, setCnt] = useState(false);
  const [ilib, setIlib] = useState(false);
  const [file, setFile] = useState(null);
  const [cf, setCf] = useState(solved ? 'sunset' : 'mount');
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const swapTo = (k) => [
    { act: () => G.go('[data-b="c"] [data-t="content"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setFile(null); setCnt(true); } }, { wait: 500 * ms },
    { act: () => G.go('[data-t="libsearch"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setIlib(true); } }, { wait: 600 * ms },
    { act: () => G.go('[data-v="foto-' + k + '"]', 0.5, 0.5) }, { wait: 800 * ms },
    { act: () => { G.tap(); setIlib(false); setFile(k); } }, { wait: 500 * ms },
    { act: () => G.go('[data-t="saveclose"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setCnt(false); setCf(k); sfx('pop', true); } }, { wait: 700 * ms }
  ];
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(
    [{ act: () => { scrollTopTo('[data-b="c"]'); G.go('[data-b="c"]', 0.5, 0.65); } }, { wait: 800 * ms }, { act: () => { G.tap(); setSel('c'); } }, { wait: 400 * ms }],
    [{ act: () => G.go('[data-b="c"] [data-t="content"]', 0.5, 0.5) }, { wait: 700 * ms }, { act: () => { G.tap(); setCnt(true); } }, { wait: 400 * ms }],
    [{ say: [{ text: c.steps[0], pose: 'point' }] }, { act: () => { setCnt(false); } }, { wait: 200 * ms }],
    swapTo('tall'),
    [{ say: [{ text: c.steps[1], pose: 'think' }] }],
    swapTo('sunset'),
    [{ say: [{ text: c.steps[2], pose: 'point' }] }, { act: () => { G.hide(); setSel(null); put({ done: true }); } }]
  ) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub" cls={cnt ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(cov4({ foto: cf }), img4('club'))} sel={sel} lite onContent={sel === 'c' ? () => {} : null} />
            {cnt ? <TCoverCnt foto={file || cf} onLib={() => {}} /> : null}
            {ilib ? <TImgLib fotos={['tall', 'sunset', 'mount', 'factory']} off /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ЗАДАНИЕ «ФОН ОБЛОЖКИ» — обложка → «Контент» → «Искать в библиотеке» → широкое фото клуба → «Сохранить и закрыть».
// =============================================================================
function S8({ p }) {
  const c = C.s8;
  const log = useLog();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 5 : 0);   // 0 — обложка, 1 — «Контент», 2 — библиотека, 3 — фото, 4 — сохранить, 5 — готово
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onSel = (u) => { if (!canTap || st !== 0) return; sfx('tap', true); if (u !== 'c') return; T.hit(); setSt(1); };
  const onContent = () => { if (!canTap || st !== 1) return; T.hit(); sfx('pop', true); setSt(2); };
  const onLib = () => { if (!canTap || st !== 2) return; T.hit(); sfx('pop', true); setSt(3); };
  const onPick = (k) => {
    if (!canTap || st !== 3) return;
    if (k !== 'club') { shake(setBad, k); T.miss(c.wrong[k], sayNow); return; }
    T.hit(); sfx('ok', true); setSt(4); sayNow(c.picked, 'smile');
  };
  const onSave = () => {
    if (!canTap || st !== 4) return;
    sfx('win', true); setSt(5); put({ done: true });
    log(logOf(T, 's8', 'cover-photo', { value: 'club' }));
    sayNow(c.ok, 'cheer');
  };
  useEffect(() => { const t = setTimeout(() => scrollTopTo('[data-b="c"]'), 300); return () => clearTimeout(t); }, []);
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint2(G, st === 0 ? '[data-b="c"]' : st === 1 ? '[data-b="c"] [data-t="content"]' : st === 2 ? '[data-t="libsearch"]' : st === 3 && T.lad.lv >= 3 ? '[data-v="foto-club"]' : st === 4 ? '[data-t="saveclose"]' : null, canTap);
  const panel = st >= 2 && st <= 4;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 5 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={panel ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(cov4({ foto: st === 5 ? 'club' : 'mount' }), img4('club'))} sel={st >= 1 && st <= 4 ? 'c' : null} lite
              onSel={canTap && st === 0 ? onSel : null} onContent={canTap && st === 1 ? onContent : null} contentLed={canTap && st === 1} />
            {panel ? <TCoverCnt foto={st === 4 ? 'club' : 'mount'} onLib={canTap && st === 2 ? onLib : null} libLed={st === 2} onSave={canTap && st === 4 ? onSave : null} saveLed={st === 4} /> : null}
            {st === 3 ? <TImgLib fotos={['tall', 'mount', 'club', 'sunset']} onPick={canTap ? onPick : null} bad={bad} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ПОКАЗ «ФИЛЬТР» — «Настройки» → непрозрачность 100% (фото пропало) → 70% (видно и фото, и текст).
// =============================================================================
function S9({ p }) {
  const c = C.s9;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(null);
  const [set, setSet] = useState(false);
  const [open, setOpen] = useState(null);
  const [f, setF] = useState(solved ? 70 : 10);
  const [f2, setF2] = useState(solved ? 70 : 10);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const opa = (key, v) => [
    { act: () => G.go('[data-t="op-' + key + '"]', 0.5, 0.5) }, { wait: 600 * ms },
    { act: () => { G.tap(); setOpen(key); } }, { wait: 450 * ms },
    { act: () => G.go('[data-v="' + key + '-' + v + '"]', 0.5, 0.5) }, { wait: 600 * ms },
    { act: () => { G.tap(); if (key === 'top') setF(v); else setF2(v); setOpen(null); } }, { wait: 500 * ms }
  ];
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(
    [{ act: () => { scrollTopTo('[data-b="c"]'); G.go('[data-b="c"]', 0.5, 0.65); } }, { wait: 800 * ms }, { act: () => { G.tap(); setSel('c'); } }, { wait: 400 * ms }],
    [{ act: () => G.go('[data-b="c"] [data-t="settings"]', 0.5, 0.5) }, { wait: 700 * ms }, { act: () => { G.tap(); setSet(true); } }, { wait: 500 * ms }],
    [{ say: [{ text: c.steps[0], pose: 'point' }] }],
    opa('top', 100), opa('bot', 100),
    [{ say: [{ text: c.steps[1], pose: 'think' }] }],
    opa('top', 70), opa('bot', 70),
    [{ say: [{ text: c.steps[2], pose: 'smile' }] }, { act: () => { G.hide(); put({ done: true }); } }]
  ) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub" cls={set ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(cov4({ foto: 'club', f: f, f2: f2 }), img4('club'))} sel={sel} lite onSettings={sel === 'c' ? () => {} : null} />
            {set ? <TCoverSet f={f} f2={f2} open={open} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ЗАДАНИЕ «НАСТРОЙ ФИЛЬТР» — обложка → «Настройки» → непрозрачность вверху и внизу: 70%. Результат виден сразу.
// =============================================================================
function S10({ p }) {
  const c = C.s10;
  const log = useLog();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);   // 0 — обложка, 1 — «Настройки», 2 — фильтр, 3 — готово
  const [f, setF] = useState(solved ? 70 : 10);
  const [f2, setF2] = useState(solved ? 70 : 10);
  const [open, setOpen] = useState(null);
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onSel = (u) => { if (!canTap || st !== 0) return; sfx('tap', true); if (u !== 'c') return; T.hit(); setSt(1); };
  const onSettings = () => { if (!canTap || st !== 1) return; T.hit(); sfx('pop', true); setSt(2); };
  const onOpen = (key) => { if (!canTap || st !== 2) return; sfx('tap', true); setOpen((o) => (o === key ? null : key)); };
  const onOpa = (key, v) => {
    if (!canTap || st !== 2) return;
    const nf = key === 'top' ? v : f, nf2 = key === 'bot' ? v : f2;
    setF(nf); setF2(nf2); setOpen(null);
    if (v < 70) { shake(setBad, key + '-' + v); T.miss(c.wrongLow, sayNow); return; }
    if (v > 70) { shake(setBad, key + '-' + v); T.miss(c.wrongHigh, sayNow); return; }
    T.hit();
    if (nf === 70 && nf2 === 70) {
      sfx('win', true); setSt(3); put({ done: true });
      log(logOf(T, 's10', 'cover-filter', { value: 70 }));
      sayNow(c.ok, 'cheer');
      return;
    }
    sfx('ok', true);
    if (key === 'top') sayNow(c.half, 'smile');
  };
  useEffect(() => { const t = setTimeout(() => scrollTopTo('[data-b="c"]'), 300); return () => clearTimeout(t); }, []);
  const groot = useRef(null);
  const G = useGuide(groot);
  const key = f !== 70 ? 'top' : f2 !== 70 ? 'bot' : null;
  usePoint2(G, st === 0 ? '[data-b="c"]' : st === 1 ? '[data-b="c"] [data-t="settings"]'
    : st === 2 && key ? (open === key ? (T.lad.lv >= 3 ? '[data-v="' + key + '-70"]' : null) : '[data-t="op-' + key + '"]') : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 3 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={st === 2 ? 'tl4-panon' : ''}>
            <TPage4 blocks={page4(cov4({ foto: 'club', f: f, f2: f2 }), img4('club'))} sel={st === 1 || st === 2 ? 'c' : null} lite
              onSel={canTap && st === 0 ? onSel : null} onSettings={canTap && st === 1 ? onSettings : null} setLed={canTap && st === 1} />
            {st === 2 ? <TCoverSet f={f} f2={f2} open={open} onOpen={canTap ? onOpen : null} onOpa={canTap ? onOpa : null} ledOpen={key} bad={bad} /> : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ПРОВЕРКА «КАКАЯ ОБЛОЖКА ЛУЧШЕ?» — 4 вопроса по две обложки: фото по теме, фильтр, короткий заголовок, широкое фото.
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const log = useLog();
  const [rec, put] = useRec('s11');
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
      misses.current += 1; shake(setBad, k); sfx('soft', true);
      sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump();
      return;
    }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's11', type: 'good-cover', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene tl-scene tl3-quiz tl4-quiz">
          <div className="tl2-qn" aria-live="polite">
            <span className="tl2-qdots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <b key={r} className="kz-a-drop">{pick(R.q)}</b>
          </div>
          <div key={'o' + r} className="tl3-qopts tl4-qopts kz-a-drop">
            {['a', 'b'].map((k) => {
              const o = k === 'a' ? R.A : R.B;
              return (
                <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK}
                  className={'tl3-qo tl4-qo' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)}>
                  <span className="tl3-cmp-l" translate="no">{k.toUpperCase()}</span>
                  <span className="tl4-qcov" translate="no"><TCover4 foto={o.foto} f={o.f} f2={o.f} title={o.t ? pick(o.t) : 'RoboKlub'} sub={o.long ? null : pick(PAGE4.sub)} long={o.long} /></span>
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
// S12. В НАСТОЯЩЕЙ TILDA — шаги списком; адрес своего сайта (…tilda.ws) или «Сделаю позже».
// =============================================================================
const tildaUrl = (v) => String(v || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(solved ? (store.get('tl4RealUrl') || '') : '');
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
    sfx('win', true); setMsg(null); store.set('tl4RealUrl', u); put({ done: true, later: false });
    log({ screenId: 's12', type: 'real-tilda', correct: true, firstTry: tries.current === 1, attempts: tries.current, hints: 0, depth: 0, value: u });
    sayNow(c.ok, 'cheer');
  };
  const later = () => {
    if (!canTap || solved) return;
    sfx('tap', true); put({ done: true, later: true });
    log({ screenId: 's12', type: 'real-tilda', correct: false, firstTry: false, attempts: tries.current, hints: 0, depth: 0, value: 'later' });
    sayNow(c.okLater, 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={nav4(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={msg} err={!!msg} />
        <div className="kz-scene tl-scene">
          <ol className="tl-real">{c.todo.map((st, i) => <li key={i}><b>{i + 1}</b><span>{pick(st)}</span></li>)}</ol>
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
// S13. ВЫВОД — разгадка, сайт клуба целиком, что умеем, следующий урок.
// =============================================================================
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'shy' : 'point' })));
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
            <div className="tl2-canvas"><TPage4 blocks={page4(cov4(COVER_DONE), img4('club'))} /></div>
          </div>
          <div className="kz-roles tl-roles">
            {['riddle', 'img', 'cover', 'filter'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'img' ? '#0FA38E' : k === 'cover' ? '#7952B3' : '#D97706' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'LEVEL-2', Comp: S4 },
  { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'CHECK', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 's8', code: 'LEVEL-2', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 },
  { id: 's11', code: 'CHECK', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 },
  { id: 's13', code: 'ACHIEVEMENT', Comp: S13 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonTl4Artifact(store) {
  return { type: 'tilda-images-cover', blocks: ['CR28', 'TL02', 'TX01', 'IM01', 'BF101'], image: 'club', alt: 'kids', cover: COVER_DONE,
    realUrl: store.get('tl4RealUrl') ? 'https://' + store.get('tl4RealUrl') : null };
}

export default function TildaKartinkiCover({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonTl4Artifact(store) })
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
