// =============================================================================
// S1. КРЮЧОК — сначала бумажная веб-страница в браузере; нажали «Превратить» —
// браузер распадается на бумажные куски, и из этих же кусков собирается
// человечек (заказчик, 23.10.2026: «нужен эффект именно сборки»):
//   · вкладка с названием округляется и становится головой;
//   · окно со страницей перекрашивается в бирюзу и становится телом;
//   · тёмная полоса вкладок рвётся пополам — это руки;
//   · боковые края рамки — ноги.
// Сначала куски чуть расходятся (разбор), потом ступенчато (stop-motion, с
// шорохом) летят на места, меняя форму и цвет. Дальше Коди называет связь:
// голова — вкладка, тело — окно.
// =============================================================================
const S1_FLY = 0.9;   // полёт куска к месту, с
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  // page — страница в браузере · measure — рядом невидимый человечек, по нему
  // меряются места · morph — куски браузера летят и становятся частями · man — собран
  const [phase, setPhase] = useState(solved ? 'man' : 'page');
  const [pieces, setPieces] = useState(null);
  const [stage, setStage] = useState(0);   // 0 — куски на местах браузера · 1 — разошлись · 2 — на местах человечка
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && phase === 'page', 0);
  const sceneRef = useRef(null);
  const tm = useRef([]);
  useEffect(() => () => { tm.current.forEach(clearTimeout); paperOff(); }, []);
  const later = (ms, f) => tm.current.push(setTimeout(f, ms));
  const land = () => { paperOff(); setPieces(null); put({ done: true }); setPhase('man'); sfx('ok', true); sayNow(c.magic, 'wonder'); say(c.magicWin, 'point'); say(c.done, 'smile'); };
  const turn = () => {
    if (!canTap || phase !== 'page') return;
    sfx('pop', true);
    if (reduceMotion()) { land(); return; }
    setPhase('measure');
  };
  // Куски: откуда (часть браузера) → куда (часть человечка). Координаты — от сцены.
  useLayoutEffect(() => {
    if (phase !== 'measure') return;
    const sc = sceneRef.current;
    const br = sc && sc.querySelector('.kz-br');
    const man = sc && sc.querySelector('.kz-s1-man .kz-man');
    if (!br || !man) { land(); return; }
    const S = sc.getBoundingClientRect();
    const B = br.getBoundingClientRect();
    const Bar = br.querySelector('.kz-br-bar').getBoundingClientRect();
    const W = br.querySelector('.kz-br-body').getBoundingClientRect();
    const T = br.querySelector('.kz-br-tab').getBoundingClientRect();
    const M = man.getBoundingClientRect();
    const box = (r) => ({ x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height, r: 0 });
    const cuts = Array.prototype.slice.call(man.children);
    const part = (lbl) => cuts.find((el) => el.getAttribute('aria-label') === lbl);
    const limbs = cuts.filter((el) => !el.getAttribute('aria-label'));   // по порядку: ноги, руки
    const to = (el) => ({ x: M.left - S.left + el.offsetLeft, y: M.top - S.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,
      r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0 });
    const half = B.width / 2;
    const sideH = B.bottom - Bar.bottom;
    setPieces([
      { k: 'legL', c0: KZ.ink, c: KZ.ink, seed: 41, from: { x: B.left - S.left, y: Bar.bottom - S.top, w: Math.max(6, W.left - B.left), h: sideH, r: 0 }, apart: [-12, 4, -5], to: to(limbs[0]), dl: 0.05 },
      { k: 'legR', c0: KZ.ink, c: KZ.ink, seed: 42, from: { x: W.right - S.left, y: Bar.bottom - S.top, w: Math.max(6, B.right - W.right), h: sideH, r: 0 }, apart: [12, 4, 5], to: to(limbs[1]), dl: 0.1 },
      { k: 'armL', c0: KZ.ink, c: KZ.ink, seed: 43, from: { x: B.left - S.left, y: B.top - S.top, w: half, h: Bar.bottom - B.top, r: 0 }, apart: [-10, -10, -6], to: to(limbs[2]), dl: 0.16 },
      { k: 'armR', c0: KZ.ink, c: KZ.ink, seed: 44, from: { x: B.left - S.left + half, y: B.top - S.top, w: half, h: Bar.bottom - B.top, r: 0 }, apart: [10, -10, 6], to: to(limbs[3]), dl: 0.2 },
      { k: 'body', c0: KZ.cream, c: KZ.teal, seed: 45, lines: true, from: { x: W.left - S.left, y: Bar.bottom - S.top, w: W.width, h: W.bottom - Bar.bottom, r: 0 }, apart: [0, 8, 1.5], to: to(part('body')), dl: 0 },
      { k: 'head', c0: '#E6DCC6', c: KZ.face, round: true, text: pick(UI.mySite), from: box(T), apart: [-4, -16, -7], to: to(part('head')), dl: 0.3 }
    ]);
    setStage(0);
    setPhase('morph');
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  // Разбор → полёт → человечек.
  useEffect(() => {
    if (phase !== 'morph' || !pieces) return undefined;
    let r1 = requestAnimationFrame(() => { r1 = requestAnimationFrame(() => { setStage(1); paperOn(); sfx('tap', true); }); });
    later(260, () => setStage(2));
    later(260 + (0.3 + S1_FLY) * 1000 + 120, land);
    return () => cancelAnimationFrame(r1);
  }, [phase, pieces]); // eslint-disable-line react-hooks/exhaustive-deps
  const pieceStyle = (pc) => {
    const g = stage === 0 ? pc.from : stage === 1 ? { x: pc.from.x + pc.apart[0], y: pc.from.y + pc.apart[1], w: pc.from.w, h: pc.from.h, r: pc.apart[2] } : pc.to;
    const fly = stage === 2;
    const d = fly ? S1_FLY + 's' : '.22s';
    const dl = fly ? pc.dl + 's' : '0s';
    const st = fly ? 'steps(9, end)' : 'steps(2, end)';
    return {
      left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px', rotate: g.r + 'deg',
      background: fly ? pc.c : pc.c0,
      borderRadius: pc.round ? (fly ? '50%' : '6px 6px 0 0') : null,
      clipPath: pc.round ? null : torn(pc.seed, 6, 2.5, Math.max(0.2, Math.min(5, g.w / Math.max(1, g.h)))),
      transition: ['left', 'top', 'width', 'height', 'rotate'].map((k) => k + ' ' + d + ' ' + st + ' ' + dl)
        .concat(['background ' + d + ' steps(4, end) ' + dl, 'border-radius ' + d + ' steps(5, end) ' + dl]).join(', ')
    };
  };
  // Подсветка идёт за речью: «название стало головой» — голова, «окно стало телом» — тело.
  const hl = phase !== 'man' ? null : speaker.text === c.magic ? 'head' : speaker.text === c.magicWin ? 'body' : null;
  const askText = phase === 'man' ? c.askDone : c.ask;
  const busy = phase === 'measure' || phase === 'morph';
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} />
        <div ref={sceneRef} className={'kz-scene kz-s1 kz-s1-rev is-' + phase}>
          {phase !== 'man' ? (
            <div className={'kz-col kz-s1-page' + (phase === 'morph' ? ' is-gone' : '')}>
              <PaperBrowser title={pick(UI.mySite)} pageHl={led}>
                <PageBits text={pick(UI.hello)} bits />
              </PaperBrowser>
            </div>
          ) : null}
          {phase !== 'page' ? (
            <div className={'kz-stagebox kz-s1-man' + (phase === 'man' ? '' : ' is-ghost')}>
              <div className="kz-manbox kz-manbox-free">
                <PaperMan key={phase === 'man' ? 'm' : 'g'} anim={false} hl={hl} wave={phase === 'man'} />
              </div>
            </div>
          ) : null}
          {phase === 'morph' && pieces ? (
            <div className="kz-morph" aria-hidden="true">
              {pieces.map((pc) => (
                <span key={pc.k} className={'kz-morph-p is-' + pc.k + (stage === 2 ? ' is-fly' : '')} style={pieceStyle(pc)}>
                  {pc.text ? <span className="kz-morph-t">{pc.text}</span> : null}
                  {pc.lines ? <span className="kz-morph-lines"><i /><i /><i /><b /></span> : null}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {phase !== 'man' ? (
          // Кнопка держит место до конца сборки, чтобы сцена не дёргалась.
          <div className="kz-row" style={busy ? { visibility: 'hidden' } : null}>
            <button type="button" className="kz-btn is-coral" disabled={!canTap || phase !== 'page'} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button>
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S2. ПЛАН — четыре бумажные карточки открываются сами, по очереди: каждая
// переворачивается, когда Коди начинает о ней рассказывать. Открытую можно
// нажать — Коди повторит.
// =============================================================================
const CARD_C = [KZ.coral, KZ.mustard, KZ.teal, 'var(--kz-piece)'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }].concat(c.cards.map((k) => ({ text: k.say, pose: 'point' })), [{ text: c.done, pose: 'smile' }]));
  const [open, setOpen] = useState(solved ? 4 : 0);   // сколько карточек уже открыто
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const reach = (n) => {
    if (n <= open) return;
    setOpen(n);
    sfx('pop', true);
    if (n === 4) put({ done: true });
  };
  // Карточка открывается вместе с началом своей реплики.
  useEffect(() => {
    const i = c.cards.findIndex((k) => k.say === speaker.text);
    reach(i >= 0 ? i + 1 : speaker.text === c.done ? 4 : 0);
  }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  // Очередь реплик кончилась раньше (пропуск, тишина) — план открыт целиком.
  useEffect(() => { if (spoken) reach(4); }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const again = (i) => { if (canTap && i < open) sayNow(c.cards[i].say, 'point'); };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} n={open + '/4'} />
        <div className="kz-plan">
          {c.cards.map((card, i) => {
            const on = i < open;
            const now = on && speaker.text === card.say;
            return (
              <button key={i} type="button" className={'kz-card' + (on ? ' is-open' : '')} disabled={!on || !canTap} onClick={() => again(i)}
                aria-label={on ? pick(card.title) : String(i + 1)} style={{ '--dl': (i * 0.12) + 's' }}>
                <Cut c={on ? CARD_C[i] : 'var(--kz-piece)'} seed={80 + i} n={9} amp={3} asp={1.6} cls="kz-card-cut kz-a-drop" r={i % 2 ? 1.2 : -1.4} dl={i * 0.12}
                  hl={now} hlc={KZ.ink}>
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
// S3. БИРКА ДЛЯ БРАУЗЕРА — бумажный браузер со страницей в рамке html (заказчик,
// 23.10.2026: на экранах 3–5 браузер вместо человечка); две бирки: открывающий и
// закрывающий тег. Ученик нажимает бирки по очереди (светится «нажми сюда»).
// =============================================================================
// Страница в рамке html (экраны 3–5): бумажный браузер — вкладка и окно.
const FramedPage = ({ anim }) => {
  const pick = usePick();
  return (
    <PaperBrowser title={pick(UI.mySite)} cls={anim ? 'kz-a-drop' : ''}>
      <PageBits text={pick(UI.hello)} bits anim={anim} />
    </PaperBrowser>
  );
};
function S3({ p }) {
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayTag, pose: 'explain' }, { text: c.sayAsk, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved, n);
  const tagHl = speaker.text === c.sayTag;   // «Тег — это слово в угловых скобках…» — оба тега светятся
  const tapTop = () => { if (!canTap || n !== 0) return; sfx('tap', true); setN(1); sayNow(c.top, 'point'); say(c.bottomAsk, 'point'); };
  const tapBot = () => { if (!canTap || n !== 1) return; sfx('ok', true); setN(2); put({ done: true }); sayNow(c.bottom, 'explain'); say(c.done, 'smile'); };
  const asking = speaker.text === c.sayAsk || speaker.text === c.bottomAsk;
  const askText = solved || n === 2 ? c.done : n === 0 ? c.sayAsk : c.bottomAsk;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={solved ? null : n + '/2'} />
        <div className="kz-scene">
          <ManBox frame frameAnim={!solved} frameHl={speaker.text === c.say} br={<FramedPage anim={!solved} />}
            labels={<>
              <KzLabel t="html" cls="kz-frame-lbl-top" onClick={tapTop} disabled={!canTap || n !== 0} on={n >= 1} hl={tagHl} led={n === 0 && (led || asking) && canTap} />
              <KzLabel t="html" close cls="kz-frame-lbl-bot" onClick={tapBot} disabled={!canTap || n !== 1} on={n >= 2} hl={tagHl} led={n === 1 && (led || asking) && canTap} />
            </>} />
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S4. ЗАКРОЙ РАМКУ — у рамки вокруг браузера нет нижнего края; ученик набирает </html>
// кнопками или с клавиатуры. Верно — край въезжает, бирка приклеивается.
// =============================================================================
function S4({ p }) {
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
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
  // Пока Коди говорит «нет нижнего края» (и когда ученик медлит), пустое место
  // края на рамке и пустая строка в коде мигают вместе: это одно и то же место.
  const blink = !okNow && (speaker.text === c.say || led);
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const issue = tagTypingIssue(ty.val, 'html', c.msgs);
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
  const hint = hintAt(lad.lv, c.hints);
  const lines = [
    { k: 'o', d: 0, parts: [T_('html')] },
    { k: 'm', d: 1, parts: [<span key="m" className="kz-dim">…</span>] },
    { k: 'c', d: 0, cls: okNow ? 'is-new' : 'is-gap', parts: okNow ? [T_('html', true)] : [
      <span key="g" className={'kz-gap' + (blink ? ' kz-gap-led' : '')}>
        <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={12} cls="kz-tag-in" />
      </span>] }
  ];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hint)} />
        <div className="kz-scene is-tight">
          <ManBox frame frameSides={{ top: 1, right: 1, left: 1, bottom: okNow ? 'new' : 0 }} br={<FramedPage anim={false} />}
            labels={<>
              <KzLabel t="html" cls="kz-frame-lbl-top" on={lad.lv >= 1 && !okNow} />
              {okNow ? <KzLabel t="html" close cls="kz-frame-lbl-bot" anim="stamp" />
                : <span className={'kz-frame-miss' + (blink ? ' is-blink' : '')} aria-hidden="true"><span className="kz-frame-miss-q">?</span></span>}
            </>} />
          <div className="kz-col"><KzCode lines={lines} /></div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'html', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 4} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S5. БИРКИ ПО МЕСТАМ — новый лист: браузер в рамке без бирок; три бирки, одна лишняя.
// Нажать бирку, потом место (или перетащить).
// =============================================================================
const S5_TAGS = [{ id: 'o', raw: '<html>' }, { id: 'b', raw: '<\\html>' }, { id: 'c', raw: '</html>' }];
function S5({ p }) {
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? { top: 'o', bot: 'c' } : { top: null, bot: null });
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = !!(slots.top && slots.bot);
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, (slots.top ? 1 : 0) + (slots.bot ? 1 : 0) + (sel ? 10 : 0));
  const place = (id, where) => {
    if (!canTap || done || !id || !where || slots[where]) return false;
    st.current.tries += 1;
    const want = where === 'top' ? 'o' : 'c';
    if (id !== want) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      const m = id === 'b' ? c.back : where === 'top' ? c.top : c.bottom;
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = Object.assign({}, slots, { [where]: id });
    setSlots(ns); setSel(null); setMsg(null);
    if (ns.top && ns.bot) {
      put({ done: true });
      log({ screenId: 's5', type: 'place-tags', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const trayRef = useRef(null);
  const sceneRef = useRef(null);
  const pickSlot = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const hint = hintAt(lad.lv, c.hints);
  const nextWant = !slots.top ? 'o' : 'c';
  const lit = lad.lv >= 3;
  const raw = (id) => S5_TAGS.find((t) => t.id === id).raw;
  const slotBtn = (where, cls) => (
    <button type="button" data-place={where} className={'kz-slot ' + cls + (dnd.hover === where ? ' is-hover' : '') + (slots[where] ? ' is-full' : '')}
      disabled={!canTap || !!slots[where]} onClick={() => pickSlot(where)}>
      {slots[where] ? <KzLabel raw={raw(slots[where])} flow anim="stamp" /> : <span className="kz-slot-dash" />}
      <Led on={!slots[where] && ((led && !!sel) || (lit && (where === 'top') === (nextWant === 'o')))} />
    </button>
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : ((slots.top ? 1 : 0) + (slots.bot ? 1 : 0)) + '/2'} />
        <div ref={sceneRef} className={'kz-scene is-tight' + (dnd.active || sel ? ' is-dragging' : '')}>
          <ManBox frame frameAnim={!solved} br={<FramedPage anim={!solved} />} cls="kz-s5-box"
            labels={<>{slotBtn('top', 'kz-slot-top')}{slotBtn('bot', 'kz-slot-bot')}</>} />
        </div>
        <div ref={trayRef} className="kz-tray">
          {S5_TAGS.map((t) => {
            const used = slots.top === t.id || slots.bot === t.id;
            if (used) return null;
            return (
              <button key={t.id} type="button" disabled={!canTap || done} data-id={t.id}
                className={'kz-scrap kz-scrap-tag' + (sel === t.id ? ' is-sel' : '') + (shake === t.id ? ' kz-a-shake' : '') + (lit && t.id === nextWant ? ' is-led' : '')}
                style={{ '--r': (t.id === 'b' ? 2 : t.id === 'o' ? -2 : 1) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, t.id, t.raw); }}
                onClick={() => { setSel(sel === t.id ? null : t.id); setMsg(null); sfx('tap', true); }}>
                <span translate="no">{t.raw}</span><Led on={led && !sel && !done} />
              </button>
            );
          })}
        </div>
        {/* Новая механика сначала показывается рукой: взять <html> и отнести наверх. */}
        <KzHand label="<html>" run={canTap && !done && !sel && !dnd.active && !slots.top && !slots.bot}
          targets={[() => trayRef.current && trayRef.current.querySelector('[data-id="o"]'), () => sceneRef.current && sceneRef.current.querySelector('.kz-slot-top')]} />
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S6. ГОЛОВА СТРАНИЦЫ — нажать голову: она приподнимается, внутри карточка
// title; нажать карточку — она улетает на вкладку бумажного браузера.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [step, setStep] = useState(solved ? 2 : 0);
  const [stamp, setStamp] = useState(0);
  const [flying, setFlying] = useState(false);   // карточка title летит на вкладку
  const sceneRef = useRef(null);
  const tm = useRef(0);
  useEffect(() => () => clearTimeout(tm.current), []);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && step < 2, step);
  const openHead = () => { if (!canTap || step !== 0) return; sfx('pop', true); setStep(1); sayNow(c.opened, 'point'); };
  const flyTitle = () => {
    if (!canTap || step !== 1 || flying) return;
    sfx('tap', true);
    const land = () => { setFlying(false); setStep(2); setStamp((s) => s + 1); sfx('ok', true); put({ done: true }); sayNow(c.flew, 'wonder'); say(c.done, 'smile'); };
    const sc = sceneRef.current;
    const went = !reduceMotion() && sc && kzFly(sc.querySelector('.kz-man [aria-label="title"]'), sc.querySelector('.kz-br-tab'), 760);
    if (!went) { land(); return; }
    setFlying(true);
    tm.current = setTimeout(land, 800);
  };
  const title = pick(UI.mySite);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={step === 0 ? c.ask : step === 1 ? c.askCard : c.done} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={step === 0 ? c.ask : step === 1 ? c.askCard : c.done} n={solved ? null : step + '/2'} />
        <div ref={sceneRef} className={'kz-scene' + (flying ? ' is-flying' : '')}>
          <ManBox man={<PaperMan anim={false} headOpen={step === 1} hl={step === 0 && led ? 'head' : null}
            onHead={openHead} titleText={step === 1 ? title : null} onTitle={flyTitle} />} cls="kz-s6-box" />
          <div className="kz-col">
            <PaperBrowser title={step >= 2 ? title : ''} stamp={stamp} tabHl={step >= 2 && speaker.text === c.flew}>
              <PageBits text={pick(UI.hello)} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: step >= 1 ? 'is-hl' : '', parts: [T_('head')] },
              { k: 't', d: 1, cls: step >= 2 ? 'is-new' : '', parts: step >= 2 ? [T_('title'), W_(title), T_('title', true)] : [<span key="d" className="kz-dim">…</span>] },
              { k: 'hc', d: 0, cls: step >= 1 ? 'is-hl' : '', parts: [T_('head', true)] }
            ]} />
          </div>
        </div>
        {step === 1 ? <div className="kz-row" style={flying ? { visibility: 'hidden' } : null}><button type="button" className="kz-btn is-ghost" disabled={!canTap} onClick={flyTitle}>title<Led on={led} /></button></div> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S7. ИМЯ НА ВКЛАДКЕ — поле внутри title; вкладка меняется по ходу набора,
// засчитывается после паузы.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get('myTitle') || '');
  const [stamp, setStamp] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const led = useIdleLed(canTap && !solved && !val.trim(), 0);
  const committed = useRef(store.get('myTitle') || '');
  useEffect(() => {
    if (!okText(val) || val.trim() === committed.current) return undefined;
    const t = setTimeout(() => {
      committed.current = val.trim();
      store.set('myTitle', val.trim());
      setStamp((s) => s + 1); sfx('ok', true);
      if (!solved) {
        put({ done: true });
        log({ screenId: 's7', type: 'write-title', correct: true, hints: lad.asked.current, depth: lad.lv });
        sayNow(c.ok, 'smile');
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = okText(val) ? val : committed.current;
  const hint = hasTags(val) ? UI.noTags : hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} hint={hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={shown} stamp={stamp} tabHl={!solved} short>
              <PageBits text={pick(UI.hello)} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('head')] },
              { k: 't', d: 1, cls: 'is-hl', parts: [T_('title'),
                <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={setVal} placeholder={L3('Masalan: Futbol', 'Например: Футбол', 'For example: Football')} label={c.ask} max={30} /></span>,
                T_('title', true)] },
              { k: 'hc', d: 0, parts: [T_('head', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S8. ВКЛАДКА ИЛИ ОКНО? — прогноз, потом правда браузера. Ловушки в обе
// стороны: слово без бирок падает в окно, длинная фраза в title — на вкладку.
// Промах — дополнительный раунд того же типа с другим словом.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const mine = useMine();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [{ i: 0 }, { i: 1 }, { i: 2 }]));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [view, setView] = useState({ tab: mine.title, win: mine.text, stamp: 0 });
  // Вопрос раунда — вслух: и первый (после вступления), и каждый следующий.
  // В речь слово идёт без конечного «!», чтобы не было «пятницу!. Где…».
  const askOf = (rd) => {
    const R0 = c.rounds[rd.i];
    const w = rd.extra ? R0.extra : R0.word;
    const wv = {}; Object.keys(w).forEach((l) => { wv[l] = String(w[l]).replace(/[!?.]+$/, ''); });
    return fillL(R0.kind === 'title' ? c.askTitle : c.askRaw, { w: wv });
  };
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: askOf({ i: 0 }), pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const R = round ? c.rounds[round.i] : null;
  const word = R ? pick(round.extra ? R.extra : R.word) : '';
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const answer = (where) => {
    if (!canTap || !round || ans) return;
    const right = where === R.want;
    setAns(where);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    // Правда браузера: title — на вкладку, текст без бирок — в окно.
    setView((v) => (R.kind === 'title' ? { tab: word, win: v.win, stamp: v.stamp + 1 } : { tab: '', win: word + ' ' + v.win, stamp: v.stamp + 1 }));
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.unshift({ i: round.i, extra: true });
    const line = right ? c.ok[R.kind] : c.miss[R.kind];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's8.r' + (ii + 1), type: 'predict', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
      });
      put({ done: true });
      setQueue([]);
      sayNow(joinL(line, c.done), 'smile');
      return;
    }
    sayNow(line, right ? 'smile' : 'rule');
    setPending(rest);
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => {
      setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null);
      setView({ tab: mine.title, win: mine.text, stamp: 0 });
      sayNow(askOf(pending[0]), 'curious');
    }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const askText = !round ? c.done : fillL(R.kind === 'title' ? c.askTitle : c.askRaw, { w: word });
  const slip = R ? (R.kind === 'title' ? [T_('title'), W_(word), T_('title', true)] : [W_(word)]) : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            {slip ? <div className="kz-slip-wrap" key={'s' + doneN}><KzCode lines={[{ k: 'n', d: 0, cls: 'kz-slip kz-a-drop', parts: slip }]} /></div> : null}
            <PaperBrowser title={view.tab} stamp={view.stamp} short tabHl={!!ans && R && R.kind === 'title'} pageHl={!!ans && R && R.kind === 'raw'}>
              <div className="kz-br-text" key={'w' + view.stamp}>{view.win}</div>
            </PaperBrowser>
          </div>
        </div>
        {round ? (
          <div className="kz-pick">
            {['tab', 'win'].map((w) => (
              <button key={w} type="button" disabled={!canTap || !!ans}
                className={'kz-btn ' + (ans === w ? (w === R.want ? 'is-ok' : 'is-off') : ans && w === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(w)}>
                {pick(w === 'tab' ? UI.tab : UI.win)}<Led on={led && !ans} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S9. ТЕЛО СТРАНИЦЫ — нажать тело человечка: текст, картинка и кнопка
// выезжают в окно бумажного браузера.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const mine = useMine();
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [out, setOut] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !out, 0);
  const tap = () => { if (!canTap || out) return; sfx('pop', true); setOut(true); put({ done: true }); sayNow(c.out, 'wonder'); say(c.done, 'smile'); };
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={out ? c.done : c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={out ? c.done : c.ask} />
        <div className="kz-scene">
          <ManBox man={<PaperMan anim={false} hl={!out && led ? 'body' : out ? 'body' : null} onBody={tap} />} cls="kz-s6-box" />
          <div className="kz-col">
            <PaperBrowser title={mine.title} pageHl={out}>
              {out ? <PageBits text={pick(UI.hello)} bits anim={!solved} /> : null}
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, cls: out ? 'is-hl' : '', parts: [T_('body')] },
              { k: 'x', d: 1, cls: out ? 'is-new' : '', parts: out ? [W_(pick(UI.hello)), <span key="p" className="kz-dim">{' + ' + pick(UI.pic) + ' + ' + pick(UI.play)}</span>] : [<span key="d" className="kz-dim">…</span>] },
              { k: 'bc', d: 0, cls: out ? 'is-hl' : '', parts: [T_('body', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S10. ПРИВЕТ В ОКНЕ — поле внутри body; окно меняется по ходу набора.
// =============================================================================
function S10({ p }) {
  const log = useLog();
  const store = useStore();
  const c = C.s10;
  const mine = useMine();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get('myText') || '');
  const [flash, setFlash] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const led = useIdleLed(canTap && !solved && !val.trim(), 0);
  const committed = useRef(store.get('myText') || '');
  useEffect(() => {
    if (!okText(val) || val.trim() === committed.current) return undefined;
    const t = setTimeout(() => {
      committed.current = val.trim();
      store.set('myText', val.trim());
      setFlash((f) => f + 1); sfx('ok', true);
      if (!solved) {
        put({ done: true });
        log({ screenId: 's10', type: 'write-body', correct: true, hints: lad.asked.current, depth: lad.lv });
        sayNow(c.ok, 'smile');
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = okText(val) ? val : committed.current;
  const hint = hasTags(val) ? UI.noTags : hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} hint={hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={mine.title} short pageHl={!solved}>
              <div className={'kz-br-text' + (flash ? ' kz-a-stamp' : '')} key={'f' + flash}>{shown}</div>
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, parts: [T_('body')] },
              { k: 'x', d: 1, cls: 'is-hl', parts: [<span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={setVal} placeholder={L3('Masalan: Salom!', 'Например: Привет!', 'For example: Hello!')} label={c.ask} max={60} /></span>] },
              { k: 'bc', d: 0, parts: [T_('body', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S11. РАЗЛОЖИ ВЫРЕЗКИ — имя страницы, привет, картинка, кнопка: в голову или
// в тело. Нажать вырезку, потом место (или перетащить).
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const mine = useMine();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [placed, setPlaced] = useState(solved ? { name: 'head', hello: 'body', pic: 'body', btn: 'body' } : {});
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const doneN = Object.keys(placed).length;
  const done = doneN === 4;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, doneN * 10 + (sel ? 1 : 0));
  const label = (id) => (id === 'name' ? mine.title : id === 'hello' ? pick(UI.hello) : id === 'pic' ? pick(UI.pic) : pick(UI.play));
  // Имя страницы показано в теге title — по нему видно, что ему место в голове.
  const face = (id) => (id === 'name'
    ? <span className="kz-scrap-code" translate="no"><TagK t="title" />{mine.title}<TagK t="title" close /></span>
    : id === 'pic' ? <span className="kz-scrap-pic"><span className="kz-mini-pic" aria-hidden="true" />{label(id)}</span> : label(id));
  const ghostText = (id) => (id === 'name' ? '<title>' + mine.title + '</title>' : label(id));
  const place = (id, where) => {
    if (!canTap || done || !id || !where || placed[id]) return false;
    const it = c.items.find((x) => x.id === id);
    st.current.tries += 1;
    if (it.want !== where) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(it.why); sayNow(it.why, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const np = Object.assign({}, placed, { [id]: where });
    setPlaced(np); setSel(null); setMsg(null);
    if (Object.keys(np).length === 4) {
      put({ done: true });
      log({ screenId: 's11', type: 'sort', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const pickZone = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const hint = hintAt(lad.lv, c.hints);
  const nextId = c.items.map((x) => x.id).find((id) => !placed[id]);
  const nextWant = nextId ? c.items.find((x) => x.id === nextId).want : null;
  const lit = lad.lv >= 3;
  const zone = (where) => (
    <button type="button" data-place={where} className={'kz-zone' + (dnd.hover === where ? ' is-hover' : '') + ((led && sel) || (lit && where === nextWant && sel === nextId) ? ' is-led' : '')}
      disabled={!canTap || done} onClick={() => pickZone(where)}>
      <Cut c={where === 'head' ? KZ.mustard : KZ.teal} seed={where === 'head' ? 91 : 92} n={10} amp={3} asp={1.6} cls="kz-zone-cut" />
      <span className="kz-zone-in">
        <KzLabel t={where} flow />
        <span className="kz-zone-items">{Object.keys(placed).filter((k) => placed[k] === where).map((k, j) => (
          // Разложенная вырезка — та же бумажка, что в лотке: рваный край, тень, свой наклон.
          <span key={k} className="kz-zone-item kz-a-stamp" style={{ '--r': ['-2deg', '1.6deg', '-1.2deg', '2.2deg'][j % 4] }}>
            <span className="kz-zone-item-in">{k === 'pic' ? face(k) : k === 'name' ? face(k) : label(k)}</span>
          </span>))}</span>
      </span>
    </button>
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : doneN + '/4'} />
        <div className="kz-zones">{zone('head')}{zone('body')}</div>
        <div className="kz-tray">
          {c.items.map((it, i) => {
            if (placed[it.id]) return null;
            return (
              <button key={it.id} type="button" disabled={!canTap || done}
                className={'kz-scrap' + (sel === it.id ? ' is-sel' : '') + (shake === it.id ? ' kz-a-shake' : '') + (lit && it.id === nextId && sel !== it.id ? ' is-led' : '')}
                style={{ '--r': ((i % 2 ? 1 : -1) * (1 + i * 0.4)) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, it.id, ghostText(it.id)); }}
                onClick={() => { setSel(sel === it.id ? null : it.id); setMsg(null); sfx('tap', true); }}>
                {face(it.id)}
                <Led on={led && !sel && !done && it.id === nextId} />
              </button>
            );
          })}
        </div>
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S12. СВЕРХУ ВНИЗ — «Читать как браузер»: строки кода подсвечиваются по
// очереди, и страница собирается вырезками: первая строка, рамка, голова с
// именем, тело с текстом.
// =============================================================================
const READ12 = ['doc', 'html', 'head', 'title', 'headc', 'body', 'text', 'bodyc', 'htmlc'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const mine = useMine();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ12.length : -1);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && read < 0, 0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const run = () => {
    if (!canTap || read >= 0) return;
    const step = reduceMotion() ? 120 : 620;
    READ12.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, step * i)));
    timers.current.push(setTimeout(() => { setRead(READ12.length); put({ done: true }); sayNow(c.doctype, 'explain'); ORDER.forEach((x) => say(x.text, x.pose)); }, step * READ12.length + 200));
  };
  const at = (k) => read >= READ12.indexOf(k);
  // Пока Коди называет порядок — свои строки кода и блоки коллажа подсвечены.
  const sayK = spoken ? null : speaker.text === c.order1 ? 'doc' : speaker.text === c.order2 ? 'html' : speaker.text === c.order3 ? 'inner' : null;
  const SAY_LINES = { doc: { doc: 'doc' }, html: { html: 'html', htmlc: 'html' },
    inner: { head: 'head', title: 'head', headc: 'head', body: 'body', text: 'body', bodyc: 'body' } };
  const cur = read >= 0 && read < READ12.length ? READ12[read] : null;
  const lines = [
    { k: 'doc', d: 0, parts: [<span key="d" className="kz-tag"><span className="kz-tk-b">{'<!'}</span><span className="kz-tk-n">DOCTYPE html</span><span className="kz-tk-b">{'>'}</span></span>] },
    { k: 'html', d: 0, parts: [T_('html')] },
    { k: 'head', d: 1, parts: [T_('head')] },
    { k: 'title', d: 2, parts: [T_('title'), W_(mine.title), T_('title', true)] },
    { k: 'headc', d: 1, parts: [T_('head', true)] },
    { k: 'body', d: 1, parts: [T_('body')] },
    { k: 'text', d: 2, parts: [W_(mine.text)] },
    { k: 'bodyc', d: 1, parts: [T_('body', true)] },
    { k: 'htmlc', d: 0, parts: [T_('html', true)] }
  ].map((ln) => {
    const part = sayK && SAY_LINES[sayK][ln.k];
    const PART = { doc: 'doc', html: 'html', htmlc: 'html', head: 'head', title: 'head', headc: 'head', body: 'body', text: 'body', bodyc: 'body' };
    return Object.assign(ln, { cls: cur === ln.k ? 'is-read is-say-' + PART[ln.k] : part ? 'is-say is-say-' + part : '' });
  });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene kz-s12">
          <div className="kz-col kz-col-code"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <PageCollage title={mine.title} text={mine.text} anim={!solved} hl={cur === 'doc' ? 'doc' : sayK === 'inner' ? ['head', 'body'] : sayK}
              show={{ doc: at('doc'), html: at('html'), head: at('head'), title: at('title'), body: at('body'), text: at('text') }} />
          </div>
        </div>
        {read < 0 ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={run}>{pick(UI.read)}<Led on={led} /></button></div> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S13. СОБЕРИ КАРКАС — 8 бумажных полосок; нажатие ставит полоску на текущее
// место, перетаскивание — на любое; две полоски на местах меняются.
// «Проверить» — когда все места заняты; первое нарушенное правило — голосом.
// =============================================================================
const SLOTS13 = ['html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
const TRAY13 = ['body-c', 'title', 'html-o', 'text', 'head-c', 'html-c', 'body-o', 'head-o'];
function check13(slots) {
  const at = (id) => slots.indexOf(id);
  if (slots[0] !== 'html-o' || slots[7] !== 'html-c') return { rule: 'html', mark: ['html-o', 'html-c'].filter((x) => at(x) >= 0) };
  if (at('head-c') < at('head-o') || at('body-c') < at('body-o')) return { rule: 'pair', mark: at('head-c') < at('head-o') ? ['head-o', 'head-c'] : ['body-o', 'body-c'] };
  if (at('body-o') < at('head-o')) return { rule: 'order', mark: ['head-o', 'body-o'] };
  if (at('head-c') > at('body-o')) return { rule: 'headClose', mark: ['head-c', 'body-o'] };
  if (!(at('title') > at('head-o') && at('title') < at('head-c'))) return { rule: 'title', mark: ['title'] };
  if (!(at('text') > at('body-o') && at('text') < at('body-c'))) return { rule: 'text', mark: ['text'] };
  return null;
}
const DEPTH13 = (slots, k) => {
  let d = 0;
  for (let i = 0; i < k; i += 1) { const id = slots[i]; if (id === 'html-o' || id === 'head-o' || id === 'body-o') d += 1; if (id === 'html-c' || id === 'head-c' || id === 'body-c') d -= 1; }
  const id = slots[k];
  if (id === 'html-c' || id === 'head-c' || id === 'body-c') d -= 1;
  return Math.max(0, d) + 0;
};
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const mine = useMine();
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? SLOTS13.slice() : Array(8).fill(null));
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(null);
  const [res, setRes] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const st = useRef({ checks: 0 });
  const full = slots.every(Boolean);
  const tray = TRAY13.filter((id) => slots.indexOf(id) < 0);
  const led = useIdleLed(canTap && !solved && !full, slots.filter(Boolean).length);
  const partsOf = (id) => ({
    'html-o': [T_('html')], 'html-c': [T_('html', true)], 'head-o': [T_('head')], 'head-c': [T_('head', true)],
    'body-o': [T_('body')], 'body-c': [T_('body', true)], title: [T_('title'), W_(mine.title), T_('title', true)], text: [W_(mine.text)]
  }[id]);
  const labelOf = (id) => ({ 'html-o': '<html>', 'html-c': '</html>', 'head-o': '<head>', 'head-c': '</head>', 'body-o': '<body>', 'body-c': '</body>', title: '<title>…</title>', text: mine.text }[id]);
  const putPiece = (id) => {
    if (!canTap || solved) return;
    const s = slots.slice();
    const at = s[cur] === null ? cur : s.indexOf(null);
    if (at < 0) return;
    s[at] = id;
    setSlots(s); setRes(null);
    const ne = s.indexOf(null);
    setCur(ne >= 0 ? ne : at);
    sfx('tap', true);
  };
  const tapSlot = (i) => {
    if (!canTap || solved) return;
    if (!slots[i]) { setCur(i); setHeld(null); return; }
    if (held === null) { setHeld(i); return; }
    if (held === i) { setHeld(null); return; }
    const s = slots.slice(); const t = s[held]; s[held] = s[i]; s[i] = t;
    setSlots(s); setRes(null); setHeld(null); sfx('tap', true);
  };
  const check = () => {
    if (!canTap || !full || solved) return;
    st.current.checks += 1;
    const r = check13(slots);
    if (!r) {
      sfx('win', true); setRes(null); put({ done: true });
      log({ screenId: 's13', type: 'build-flat', correct: true, firstTry: st.current.checks === 1 && lad.asked.current === 0, attempts: st.current.checks, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setRes(r); sayNow(c.rules[r.rule], 'think');
    if (st.current.checks >= 2) lad.bump();
  };
  // ▲ ▼ у поставленной полоски: на строку вверх или вниз (меняется местами с соседней,
  // в том числе с пустой). Как бумажки на столе: нажатая полоска приподнимается и
  // ступенчато проезжает над соседней, соседняя уезжает под ней на освободившееся место.
  const [moved, setMoved] = useState(null);   // { to, from, dy } — dy: откуда приехала полоска
  const mvT = useRef(0);
  const hostRef = useRef(null);
  useEffect(() => () => clearTimeout(mvT.current), []);
  const move = (k, dir) => {
    if (!canTap || solved) return;
    const j = k + dir;
    if (j < 0 || j > 7) return;
    const rows = hostRef.current ? hostRef.current.querySelectorAll('.kz-line-row') : [];
    const a = rows[k + 1], z = rows[j + 1];   // [0] — строка DOCTYPE
    const dy = a && z ? a.getBoundingClientRect().top - z.getBoundingClientRect().top : 0;
    const s2 = slots.slice(); const t = s2[j]; s2[j] = s2[k]; s2[k] = t;
    setSlots(s2); setRes(null); setHeld(null);
    const ne = s2.indexOf(null);
    setCur(ne >= 0 ? ne : j);
    sfx('tap', true);
    setMoved(reduceMotion() ? null : { to: j, from: k, dy, n: Date.now() });
    clearTimeout(mvT.current); mvT.current = setTimeout(() => setMoved(null), 560);
  };
  const dnd = useKzDrag((payload, where) => {
    if (!canTap || solved || where === null) return;
    const k = Number(where);
    const s2 = slots.slice();
    if (payload.from === 'tray') s2[k] = payload.id;
    else if (payload.from === 'slot' && payload.k !== k) { const t2 = s2[payload.k]; s2[payload.k] = s2[k]; s2[k] = t2; }
    else return;
    setSlots(s2); setRes(null); setHeld(null);
    const ne = s2.indexOf(null);
    setCur(ne >= 0 ? ne : k);
    sfx('tap', true);
  });
  const hint = hintAt(lad.lv, c.hints);
  const lines = [{ k: 'doc', d: 0, cls: 'kz-fixed', move: { hide: true }, parts: [<span key="d" className="kz-tag"><span className="kz-tk-b">{'<!'}</span><span className="kz-tk-n">DOCTYPE html</span><span className="kz-tk-b">{'>'}</span></span>] }]
    .concat(slots.map((id, k) => {
      const marked = res && id && res.mark.indexOf(id) >= 0;
      return {
        // Новый ключ на каждый сдвиг — анимация перестановки перезапускается и при быстрых нажатиях.
        k: 's' + k + (moved && (moved.to === k || moved.from === k) ? ':' + moved.n : ''), d: id ? DEPTH13(slots, k) : 0,
        cls: (!id && cur === k && !solved ? 'is-cur' : '') + (held === k ? ' is-sel' : '') + (marked ? ' is-mark' : '') + (moved && moved.to === k ? ' kz-slide-up' : moved && moved.from === k && slots[k] ? ' kz-slide-under' : ''),
        style: moved && (moved.to === k || moved.from === k) ? { '--dy': (moved.to === k ? moved.dy : -moved.dy).toFixed(1) + 'px' } : null,
        move: solved || !id ? { hide: true } : { up: k > 0 ? () => move(k, -1) : null, down: k < 7 ? () => move(k, 1) : null },
        onTap: solved ? null : () => tapSlot(k), disabled: !canTap, led: (led && !id && cur === k) || (lad.lv >= 3 && marked),
        parts: id ? partsOf(id) : [<span key="e" className="kz-dash" aria-label={'slot ' + (k + 2)} />]
      };
    }));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (res ? c.rules[res.rule] : hint)} n={solved ? null : slots.filter(Boolean).length + '/8'} />
        <div className="kz-build">
          <div ref={hostRef} className="kz-code-host" onPointerDown={(e) => {
            if (!canTap || solved) return;
            if (e.target.closest && e.target.closest('.kz-move')) return;   // ▲ ▼ — не перетаскивание
            const ln = e.target.closest && e.target.closest('.kz-line');
            if (!ln) return;
            const row = ln.closest('.kz-line-row') || ln;
            const k = [...row.parentNode.children].indexOf(row) - 1;
            if (k >= 0 && slots[k]) dnd.start(e, { from: 'slot', k }, labelOf(slots[k]));
          }}>
            <KzCode lines={lines.map((ln, i) => (i === 0 ? ln : Object.assign(ln, { place: String(i - 1) })))} cls="kz-code-sm kz-code-build" />
          </div>
          <div className="kz-build-side">
            {tray.length && !solved ? (
              <div className="kz-pool">
                {tray.map((id, i) => (
                  <button key={id} type="button" disabled={!canTap} className="kz-scrap" style={{ '--r': ((i % 2 ? 1 : -1) * 1.5) + 'deg' }}
                    onPointerDown={(e) => { e.stopPropagation(); if (canTap) dnd.start(e, { from: 'tray', id }, labelOf(id)); }}
                    onClick={() => putPiece(id)}>
                    <span translate="no">{labelOf(id)}</span>
                  </button>
                ))}
              </div>
            ) : null}
            {full && !solved ? <button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={check}><Icon name="check" size={17} />{pick(UI.check)}</button> : null}
            {slots.some(Boolean) && !solved ? <p className="kz-msg">{pick(UI.swap)}</p> : null}
          </div>
        </div>
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S14. ВКЛАДКА СЪЕЛА СТРАНИЦУ — без </title> браузер отдаёт вкладке всё, что
// идёт дальше. Ученик выбирает бирку, которой не хватает.
// =============================================================================
function S14({ p }) {
  const log = useLog();
  const c = C.s14;
  const mine = useMine();
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
    if (o === '</title>') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'fix-closing', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'smile');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  // Тег можно отнести пальцем в пустое место строки title или просто нажать.
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const eaten = mine.title + ' </head> <body> ' + mine.text + ' </body> </html>';
  const glow = off.length >= 2 ? '</title>' : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} />
        <div className="kz-scene kz-s14">
          <div className="kz-col">
            <PaperBrowser title={okNow ? mine.title : eaten} stamp={okNow ? 1 : 0} tabHl={!okNow} pageHl={okNow}>
              {okNow ? <div className="kz-br-text kz-a-drop">{mine.text}</div> : null}
            </PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('head')] },
              { k: 't', d: 1, cls: okNow ? 'is-new' : 'is-hl', parts: [T_('title'), W_(mine.title), okNow ? <span key="c" className="kz-a-stamp">{T_('title', true)}</span> : <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />] },
              { k: 'hc', d: 0, parts: [T_('head', true)] },
              { k: 'b', d: 0, parts: [T_('body')] },
              { k: 'x', d: 1, parts: [W_(mine.text)] },
              { k: 'bc', d: 0, parts: [T_('body', true)] }
            ]} cls="kz-code-sm" />
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
// S15. ВЫВОД — своя бумажная страница ученика собирается вырезками; роли
// html, head, title, body загораются, пока Коди их называет. Единственный
// праздник урока.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet>
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <PageCollage title={mine.title} text={mine.text} anim hl={curK} />
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['html', 'head', 'title', 'body'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'html' ? KZ.coral : k === 'body' ? KZ.teal : KZ.mustard }}>
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
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'CHECK-1', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'PREDICT', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; имя и текст ученика (myTitle, myText) остаются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'] };

export default function HtmlKollazh({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store) })
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
  // Переход «разбор и сборка» — на «Дальше» и «Назад».
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
