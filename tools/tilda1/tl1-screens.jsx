// =============================================================================
// ЭКРАНЫ УРОКА 1 МОДУЛЯ TILDA. Показы — вещи меняются сами под речь Коди (useKzDemo), без руки и без действий ученика;
// задания — действия ученика в похожем интерфейсе Tilda. Сквозные данные: tlProject (имя проекта), tlCover, tlTitle.
// =============================================================================

// Помощь на экране-объяснении: ступени 1-2-3 по лампочке (как в уроках CSS и Bootstrap).
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
// Задание-действие: промах → своя причина; второй промах подряд — следующая ступень подсказки.
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
const useProject = () => { const store = useStore(); const pick = usePick(); return store.get('tlProject') || store.get('tlTheme') || pick(UI.club); };
const useSiteTitle = () => { const store = useStore(); const pick = usePick(); return store.get('tlTitle') || pick(UI.club); };
const useCoverId = () => { const store = useStore(); return store.get('tlCover') || 'CR28'; };
const done1 = (p, canGo) => navOf(p, canGo);

// =============================================================================
// S1. КРЮЧОК (переделан 24.11.2026, заказчик: «первая страница нифига не цепляет») — ученик выбирает тему своего сайта
// (клан в игре, футбольная команда, блогер, клуб роботов), и сайт за пару секунд собирается у него на глазах блок за блоком:
// меню, обложка с кнопкой, карточки, подвал с адресом и счётчиком просмотров. Можно перебрать все темы. Потом — загадка.
// =============================================================================
function THookSite({ t, n, views }) {
  const pick = usePick();
  return (
    <div className={'tl-ed tl-hk is-' + t.k} translate="no">
      <div className={'tl-hk-url' + (n >= 5 ? ' is-on' : '')}><i className="tl-globe" aria-hidden="true" /><span>{t.k}-{t.name.toLowerCase().replace(/[^a-z]/g, '')}.tilda.ws</span></div>
      <div className="tl-hk-page">
        {n >= 1 ? <div className="tl-hk-menu kz-a-drop"><b>{t.name}</b><i /><i /><i /></div> : null}
        {n >= 2 ? (
          <div className="tl-hk-cover kz-a-drop">
            <i className="tl-hk-art" aria-hidden="true"><b /><b /><b /></i>
            <h3>{pick(t.h)}</h3>
            {n >= 3 ? <span className="tl-hk-btn kz-a-drop">{pick(t.btn)}</span> : null}
          </div>
        ) : null}
        {n >= 4 ? <div className="tl-hk-cards kz-a-drop">{t.cards.map((c, i) => <span key={i}><i aria-hidden="true" />{pick(c)}</span>)}</div> : null}
        {n >= 5 ? <div className="tl-hk-foot kz-a-drop"><span>Made on Tilda</span><b>♥ {pick(fillL(C.s1.likes, { n: views }))}</b></div> : null}
        {n === 0 ? <div className="tl-hk-empty" aria-hidden="true" /> : null}
      </div>
    </div>
  );
}
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const store = useStore();
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [k, setK] = useState(solved ? rec.k : null);
  const [n, setN] = useState(solved ? 5 : 0);
  const [views, setViews] = useState(solved ? 128 : 0);
  const [seen, setSeen] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const t = c.themes.find((x) => x.k === k) || c.themes[3];
  const build = (key) => {
    if (!canTap && !solved && seen === 0) return;
    tm.current.forEach(clearTimeout); tm.current = [];
    setK(key); setN(0); sfx('tap', true);
    const step = reduceMotion() ? 60 : 380;
    [1, 2, 3, 4, 5].forEach((i) => tm.current.push(setTimeout(() => { setN(i); sfx(i === 5 ? 'win' : 'pop', true); if (i === 5) { setViews(97 + Math.floor(Math.random() * 60)); } }, step * i)));
    const th = c.themes.find((x) => x.k === key);
    store.set('tlTheme', pick(th.chip));
    const was = seen;
    setSeen(was + 1);
    if (was === 0) tm.current.push(setTimeout(() => { sayNow(c.wow, 'wonder'); }, step * 5 + 150));
    if (was === 1 && !solved) tm.current.push(setTimeout(() => { put({ done: true, k: key }); celebrate(); sayNow(c.riddle, 'curious'); }, step * 5 + 150));
  };
  const askText = solved || seen >= 2 ? c.askDone : seen === 1 ? c.askMore : c.ask;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene tl-scene tl-hook">
          <div className="tl-chips">
            {c.themes.map((th) => (
              <button key={th.k} type="button" data-v={th.k} className={'tl-chip2 is-' + th.k + (k === th.k ? ' is-on' : '') + (!k && canTap ? ' is-led' : '')}
                disabled={!canTap && seen === 0} onClick={() => build(th.k)}>{pick(th.chip)}</button>
            ))}
          </div>
          <THookSite t={t} n={k ? n : 0} views={views} />
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «КОНСТРУКТОР» — сайт школы роботов по одному блоку: меню, обложка, текст, галерея, форма, подвал.
// =============================================================================
const STACK = [['menu', TL.bMenu], ['cover', TL.bCover], ['text', TL.bText], ['gal', TL.bGal], ['form', TL.bForm], ['foot', TL.bFoot]];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? STACK.length : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const add = (k) => ({ wait: reduceMotion() ? 50 : 520, act: () => { sfx('pop', true); setN(k); } });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    add(1), add(2), add(3), add(4), add(5), add(6),
    { say: [{ text: c.steps[0], pose: 'point' }] }, { say: [{ text: c.steps[1], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene">
          <div className="tl-ed tl-stack" translate="no">
            {STACK.slice(0, n).map(([k, t]) => (
              <div key={k} className={'tl-sb is-' + k + ' kz-a-drop'}>
                <span className="tl-sb-tag">{pick(t)}</span>
                <span className="tl-sb-art" aria-hidden="true"><i /><i /><i /></span>
              </div>
            ))}
            {n < STACK.length ? <div className="tl-sb-slot" aria-hidden="true" /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ПОКАЗ «КАК НАЙТИ TILDA» (заказчик, 24.11.2026: «как вообще найти тильду… курсор / рука»): указатель нажимает на поиск,
// печатается tilda, «Найти», выдача, первая ссылка tilda.cc → сайт Tilda (на телефоне и компьютере — свой вид).
// =============================================================================
function S4({ p }) {
  const c = C.s4;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [q, setQ] = useState(solved ? 'tilda' : '');
  const [res, setRes] = useState(false);
  const [hl, setHl] = useState(false);
  const [open, setOpen] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const W = 'tilda';
  const ms = reduceMotion() ? 60 : 1;
  const steps = [
    { act: () => G.go('[data-g="sfield"]', 0.3, 0.5) }, { wait: 900 * ms }, { act: () => G.tap() }, { wait: 300 * ms }
  ].concat(Array.from({ length: W.length }, (_, i) => ({ wait: 200 * ms, act: () => { sfx('tap', true); setQ(W.slice(0, i + 1)); } })), [
    { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => G.go('[data-g="sgo"]') }, { wait: 900 * ms }, { act: () => { G.tap(); setRes(true); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[1], pose: 'point' }] },
    { act: () => { setHl(true); G.go('[data-g="sres1"] .tl-se-h', 0.3, 0.5); } }, { wait: 1000 * ms }, { act: () => G.tap() }, { wait: 400 * ms },
    { act: () => { G.hide(); sfx('pop', true); setOpen(true); } },
    { say: [{ text: c.steps[2], pose: 'smile' }] },
    { say: [{ text: c.steps[3], pose: 'point' }] },
    { act: () => put({ done: true }) }
  ]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          {open ? <TSite cookie /> : <TSearch q={q} results={res} hl={hl} />}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ЗАДАНИЕ «COOKIES И РЕГИСТРАЦИЯ» — на tilda.cc: закрыть окно cookies (любая кнопка, лучше «Отклонить все»),
// потом нажать «Регистрация» («Войти» — своя причина: аккаунта ещё нет).
// =============================================================================
function S5({ p }) {
  const c = C.s5, c2 = C.s6;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 2 : 0);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c2.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const H = st === 0 ? c.hints : c2.hints;
  const onCookie = (k) => {
    if (!canTap || st !== 0) return;
    T.hit(); sfx('ok', true); setSt(1); T.lad.reset();
    sayNow(joinL(k === 'no' ? c.okDecline : c.okAccept, c2.say), 'smile');
  };
  const onReg = () => {
    if (!canTap || st !== 1) return;
    T.hit(); sfx('ok', true); setSt(2); put({ done: true });
    log({ screenId: 's5', type: 'cookies-sign-up', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
    sayNow(c2.ok, 'cheer');
  };
  const onLogin = () => { if (!canTap || st !== 1) return; T.miss(c2.wrong, sayNow); };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, st === 0 ? '[data-v="ckNo"]' : st === 1 ? '[data-v="reg"]' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c2.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next(H) || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={st === 0 ? c.ask : c2.ask} hint={st === 2 ? null : T.now(H)} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          {st === 2 ? <TRegForm v={{ name: '', mail: '', pass: '' }} set={() => {}} onGo={() => {}} practice={C.s7.practice} rules={C.s7.rules} />
            : <TSite cookie={st === 0} onCookie={canTap && st === 0 ? onCookie : null} ckLed={canTap && st === 0}
              onReg={st === 1 ? onReg : null} onLogin={st === 1 ? onLogin : null} regLed={canTap && st === 1} off={!canTap} />}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ЗАДАНИЕ «ФОРМА» — имя, почта (с @ и точкой), пароль (три условия), «Зарегистрироваться». Тренировка: не настоящий пароль.
// Пароль ученика не сохраняется и в журнал не идёт.
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [v, setV] = useState({ name: solved ? (store.get('tlName') || '') : '', mail: solved ? (store.get('tlMail') || '') : '', pass: '' });
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const set = (k, x) => { setV((o) => Object.assign({}, o, { [k]: x })); T.setMsg(null); };
  const ready = v.name.trim() && mailOk(v.mail) && passRules(v.pass).every(Boolean);
  const go = () => {
    if (!canTap || solved) return;
    if (!v.name.trim()) { T.miss(c.msgs.name, sayNow); return; }
    if (!mailOk(v.mail)) { T.miss(c.msgs.mail, sayNow); return; }
    if (!passRules(v.pass).every(Boolean)) { T.miss(c.msgs.pass, sayNow); return; }
    T.hit(); sfx('win', true); store.set('tlName', v.name.trim()); store.set('tlMail', v.mail.trim()); put({ done: true });
    log({ screenId: 's7', type: 'sign-up-form', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, solved ? null : !v.name.trim() ? '[data-v="name"]' : !mailOk(v.mail) ? '[data-v="mail"]' : !passRules(v.pass).every(Boolean) ? '[data-v="pass"]' : '[data-v="regGo"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          {solved ? <TNewSite value="" onChange={() => {}} onCreate={() => {}} /> : <TRegForm v={v} set={set} onGo={go} led={!!ready && canTap} practice={c.practice} rules={c.rules} />}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ЗАДАНИЕ «СОЗДАЙ ПРОЕКТ» — окно «Создать новый сайт»: название в «Заголовок», «Создать» → страница проекта.
// =============================================================================
function S8({ p }) {
  const c = C.s8;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get('tlProject') || '');
  const T = useActTask(c.hints);
  const inRef = useRef(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const create = () => {
    if (!canTap || solved) return;
    const v = val.trim();
    if (!v) { T.miss(c.empty, sayNow); return; }
    T.hit(); sfx('ok', true); store.set('tlProject', v); put({ done: true });
    log({ screenId: 's8', type: 'create-project', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv, value: v });
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, solved ? null : !val.trim() ? '.tl-ns-in' : '.tl-ns-go', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          {solved ? <TProject name={store.get('tlProject')} /> : (
            <TNewSite value={val} onChange={(x) => { setVal(x); T.setMsg(null); }} onCreate={create} led={canTap && !val} ph={c.ph} inRef={inRef} />
          )}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ЗАДАНИЕ «ПЕРВАЯ СТРАНИЦА» — «Создать новую страницу» → «Пустая страница» (ИИ и шаблоны — своя причина).
// =============================================================================
function S10({ p }) {
  const c = C.s10;
  const log = useLog();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 2 : 0);
  const name = useProject();
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onNew = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); T.lad.reset(); sayNow(c.sayPick, 'explain'); };
  const H = st === 0 ? c.hints : c.hintsB;
  const onPick = (k) => {
    if (!canTap || st !== 1) return;
    if (k === 'ai') { T.miss(c.notAi, sayNow); return; }
    if (k === 'tpl') { T.miss(c.notTpl, sayNow); return; }
    T.hit(); sfx('ok', true); setSt(2); put({ done: true });
    log({ screenId: 's10', type: 'blank-page', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, st === 0 ? '.tl-pj-new' : st === 1 ? '[data-v="blank"]' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next(H) || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={st === 0 ? c.ask : c.askPick} hint={solved ? null : T.now(H)} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          {st === 0 ? <TProject name={name} onNew={canTap ? onNew : null} newLed={canTap} /> : null}
          {st === 1 ? <TNewPage onPick={onPick} led={canTap} off={!canTap} /> : null}
          {st === 2 ? <TEd project={name}><TEmpty /><TDock /></TEd> : null}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ЗАДАНИЕ «ОБЛОЖКА» — «ВСЕ БЛОКИ» → раздел «Обложка» → блок без замка (CR01, CR02 платные — дрожат и объясняют).
// =============================================================================
function S12({ p }) {
  const c = C.s12, c3 = C.s13;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);
  const [cover, setCover] = useState(solved ? store.get('tlCover') : null);
  const [flash, setFlash] = useState(null);
  const name = useProject();
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c3.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const H = st === 0 ? c.hints : st === 1 ? c.hintsB : c3.hints;
  const onAll = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); T.lad.reset(); sayNow(c.sayCat, 'point'); };
  const onCat = (i) => {
    if (!canTap || st !== 1) return;
    if (i !== 0) { T.miss(c.wrongCat, sayNow); return; }
    T.hit(); sfx('ok', true); setSt(2); T.lad.reset(); sayNow(c3.say, 'explain');
  };
  const onCard = (cv) => {
    if (!canTap || st !== 2) return;
    if (cv.paid) { setFlash(cv.id); setTimeout(() => setFlash(null), 600); T.miss(c3.locked, sayNow); return; }
    T.hit(); sfx('ok', true); setCover(cv.id); store.set('tlCover', cv.id); setSt(3); put({ done: true });
    log({ screenId: 's12', type: 'free-cover', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv, value: cv.id });
    sayNow(c3.ok, 'cheer');
  };
  const txt = cover ? COVER_TXT[cover] : null;
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, st === 0 ? '.tl-all' : st === 1 ? '[data-v="cat0"]' : st === 2 ? '[data-v="CR28"]' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next(H) || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={st === 0 ? c.ask : st === 1 ? c.askCat : c3.ask} hint={st === 3 ? null : T.now(H)} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd project={name}>
            {cover ? <div className="tl-rec kz-a-drop"><TRecBar id={cover} /><TCover id={cover} title={txt.t} sub={txt.p} /></div> : <TEmpty />}
            <TDock led={canTap && st === 0} onAll={canTap && st === 0 ? onAll : null} />
            {st === 1 || st === 2 ? <TLib cat={st === 2} catLed={st === 1 && canTap} onCat={onCat} onCard={onCard} flash={flash} off={!canTap} /> : null}
          </TEd>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ЗАДАНИЕ «СВОЙ ЗАГОЛОВОК» — нажать на заголовок обложки, написать своё название, «Готово».
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const name = useProject();
  const cover = useCoverId();
  const txt = COVER_TXT[cover];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const T = useActTask(c.hints);
  const inRef = useRef(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  useEffect(() => { if (editing && inRef.current) { try { inRef.current.focus(); } catch (e) { /* без фокуса */ } } }, [editing]);
  const save = () => {
    const v = draft.trim();
    if (!v) { T.miss(c.empty, sayNow); return; }
    if (v.toLowerCase() === txt.t.toLowerCase()) { T.miss(c.same, sayNow); return; }
    T.hit(); sfx('ok', true); store.set('tlTitle', v); setEditing(false); put({ done: true });
    log({ screenId: 's14', type: 'edit-title', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv, value: v });
    sayNow(c.ok, 'cheer');
  };
  const title = solved ? store.get('tlTitle') : txt.t;
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, solved ? null : editing ? (draft.trim() && draft.trim().toLowerCase() !== txt.t.toLowerCase() ? '.tl-ok' : '.tl-in') : '.tl-h.is-tap', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd project={name}>
            <div className="tl-rec">
              <TRecBar id={cover} />
              <TCover id={cover} title={title} sub={txt.p} editing={editing}
                onTitle={!solved && canTap ? () => { sfx('tap', true); setDraft(txt.t); setEditing(true); T.setMsg(null); } : null}
                edit={(
                  <span className="tl-edit">
                    <input ref={inRef} className="tl-in" value={draft} maxLength={40} placeholder={pick(c.ph)} aria-label={pick(c.ask)}
                      onChange={(e) => { setDraft(e.target.value); T.setMsg(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } }}
                      autoComplete="off" spellCheck={false} enterKeyHint="done" />
                    <button type="button" className="kz-btn is-coral tl-ok" onClick={save}>{pick(UI.done)}</button>
                  </span>
                )} />
            </div>
            <TDock />
          </TEd>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ЗАДАНИЕ «ОПУБЛИКОВАТЬ» — «Опубликовать» → окно с адресом (загадка разгадана) → «Открыть страницу» → сайт.
// =============================================================================
function S15({ p }) {
  const c = C.s15;
  const log = useLog();
  const [rec, put] = useRec('s15');
  const solved = !!(rec && rec.done);
  const name = useProject();
  const cover = useCoverId();
  const title = useSiteTitle();
  const txt = COVER_TXT[cover];
  const [st, setSt] = useState(solved ? 2 : 0);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onPub = () => { if (!canTap || st !== 0) return; T.hit(); sfx('pop', true); setSt(1); T.lad.reset(); celebrate(); sayNow(c.sayOpen, 'wonder'); };
  const H = st === 0 ? c.hints : c.hintsB;
  const onOpen = () => {
    if (!canTap || st !== 1) return;
    T.hit(); sfx('win', true); setSt(2); put({ done: true });
    log({ screenId: 's15', type: 'publish', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, st === 0 ? '[data-part="publish"]' : st === 1 ? '.tl-open' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next(H) || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={st === 2 ? c.askDone : st === 1 ? c.askOpen : c.ask} hint={st === 2 ? null : T.now(H)} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          {st === 2 ? <TLive cover={cover} title={title} /> : (
            <TEd project={name} onPub={canTap && st === 0 ? onPub : null} pubLed={canTap && st === 0}>
              <div className="tl-rec"><TRecBar id={cover} /><TCover id={cover} title={title} sub={txt.p} /></div>
              <TDock />
              {st === 1 ? <TPubModal onOpen={canTap ? onOpen : null} led={canTap} /> : null}
            </TEd>
          )}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S16. ЗАДАНИЕ «ВХОД В СЛЕДУЮЩИЙ РАЗ» — почта и пароль введены; отметить «Я не робот» и нажать «Войти».
// =============================================================================
function S16({ p }) {
  const c = C.s16;
  const log = useLog();
  const [rec, put] = useRec('s16');
  const solved = !!(rec && rec.done);
  const [tick, setTick] = useState(solved);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onTick = () => { if (!canTap || solved) return; sfx('tap', true); setTick((x) => !x); T.setMsg(null); };
  const onGo = () => {
    if (!canTap || solved) return;
    if (!tick) { T.miss(c.noTick, sayNow); return; }
    T.hit(); sfx('ok', true); put({ done: true });
    log({ screenId: 's16', type: 'log-in', correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const name = useProject();
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, solved ? null : !tick ? '[data-v="robot"]' : '[data-v="loginGo"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={done1(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          {solved ? <TMySites name={name} /> : <TLogin tick={tick} onTick={onTick} onGo={onGo} off={!canTap} led={canTap} />}
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S18. В НАСТОЯЩЕЙ TILDA — шаги списком; ученик вписывает адрес своего сайта (…tilda.ws) или «Сделаю позже».
// =============================================================================
const tildaUrl = (v) => String(v || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s18');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(solved ? (store.get('tlRealUrl') || '') : '');
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
    sfx('win', true); setMsg(null); store.set('tlRealUrl', u); put({ done: true, later: false });
    log({ screenId: 's18', type: 'real-tilda', correct: true, firstTry: tries.current === 1, attempts: tries.current, hints: 0, depth: 0, value: u });
    sayNow(c.ok, 'cheer');
  };
  const later = () => {
    if (!canTap || solved) return;
    sfx('tap', true); put({ done: true, later: true });
    log({ screenId: 's18', type: 'real-tilda', correct: false, firstTry: false, attempts: tries.current, hints: 0, depth: 0, value: 'later' });
    sayNow(c.okLater, 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={done1(p, canGo)}>
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
// S19. ВЫВОД — разгадка загадки, сайт ученика, что умеем, домашнее задание, следующий урок.
// =============================================================================
function S19({ p }) {
  const pick = usePick();
  const c = C.s19;
  const cover = useCoverId();
  const title = useSiteTitle();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="tl-sheet">
        <div className="kz-scene tl-scene tl-end">
          <TLive cover={cover} title={title} />
          <div className="kz-roles tl-roles">
            {['blocks', 'account', 'project', 'riddle'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'blocks' ? '#0FA38E' : k === 'account' ? '#7952B3' : '#D97706' }}>
                <i aria-hidden="true" />{pick(c.roles[k])}
              </span>
            ))}
          </div>
          <div className={'tl-hw' + (curK === 'next' ? ' is-on' : '')}><b>{pick(UI.homework)}</b><span>{pick(c.hw)}</span></div>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's4', code: 'SHOW', Comp: S4 },
  { id: 's5', code: 'LEVEL-1', Comp: S5 }, { id: 's7', code: 'LEVEL-2', Comp: S7 },
  { id: 's8', code: 'LEVEL-2', Comp: S8 }, { id: 's10', code: 'LEVEL-2', Comp: S10 },
  { id: 's12', code: 'LEVEL-2', Comp: S12 }, { id: 's14', code: 'LEVEL-3', Comp: S14 }, { id: 's15', code: 'LEVEL-3', Comp: S15 },
  { id: 's16', code: 'LEVEL-2', Comp: S16 }, { id: 's18', code: 'CHECK', Comp: S18 },
  { id: 's19', code: 'ACHIEVEMENT', Comp: S19 }
];
// «Повторить» стирает только экран; имя проекта, обложка и заголовок ученика остаются.
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonTl1Artifact(store) {
  const t = store.get('tlTitle');
  if (!t) return null;
  return { type: 'tilda-page', project: store.get('tlProject') || '', cover: store.get('tlCover') || '', title: t, url: 'https://' + SITE_URL, realUrl: store.get('tlRealUrl') ? 'https://' + store.get('tlRealUrl') : null };
}

export default function TildaVvedenie({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonTl1Artifact(store) })
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
