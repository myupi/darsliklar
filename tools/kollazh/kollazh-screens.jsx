// =============================================================================
// S1. КРЮЧОК — сначала бумажная веб-страница в браузере. Коди показывает вкладку
// (подсвечена) и окно (подсвечено) — до того, как эти слова понадобятся. Нажали
// «Превратить» — браузер распадается на бумажные куски, и из этих же кусков
// собирается человечек (заказчик, 23.10.2026: «нужен эффект именно сборки»):
//   · верхняя тёмная полоса браузера округляется и становится головой, а вкладка
//     с названием влетает внутрь головы — название лишь одно из сведений о
//     странице, которые хранит голова (образ head; голова ≠ название);
//   · окно со страницей перекрашивается в бирюзу и становится телом;
//   · адресная строка рвётся пополам — это руки; боковые края рамки — ноги.
// Сначала куски чуть расходятся (разбор), потом ступенчато (stop-motion, с
// шорохом) летят на места, меняя форму и цвет. Дальше Коди: в голове — сведения
// о странице (например, название), в теле — всё, что видно в окне.
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
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'hello' }, { text: c.sayTab, pose: 'point' }, { text: c.sayWin, pose: 'point' }, { text: c.sayGo, pose: 'smile' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && phase === 'page', 0);
  const sceneRef = useRef(null);
  const tm = useRef([]);
  useEffect(() => () => { tm.current.forEach(clearTimeout); paperOff(); }, []);
  const later = (ms, f) => tm.current.push(setTimeout(f, ms));
  const land = () => { paperOff(); setPieces(null); put({ done: true }); setPhase('man'); sfx('ok', true); sayNow(c.magic, 'wonder'); say(c.magicHead, 'point'); say(c.magicWin, 'point'); say(c.done, 'smile'); };
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
    const Tool = br.querySelector('.kz-br-tool').getBoundingClientRect();
    const M = man.getBoundingClientRect();
    const box = (r) => ({ x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height, r: 0 });
    const cuts = Array.prototype.slice.call(man.children);
    const part = (lbl) => cuts.find((el) => el.getAttribute('aria-label') === lbl);
    const limbs = cuts.filter((el) => !el.getAttribute('aria-label'));   // по порядку: ноги, руки
    const to = (el) => ({ x: M.left - S.left + el.offsetLeft, y: M.top - S.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,
      r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0 });
    const half = B.width / 2;
    const sideH = B.bottom - Bar.bottom;
    const head = to(part('head'));
    setPieces([
      { k: 'legL', c0: KZ.ink, c: KZ.ink, seed: 41, from: { x: B.left - S.left, y: Bar.bottom - S.top, w: Math.max(6, W.left - B.left), h: sideH, r: 0 }, apart: [-12, 4, -5], to: to(limbs[0]), dl: 0.05 },
      { k: 'legR', c0: KZ.ink, c: KZ.ink, seed: 42, from: { x: W.right - S.left, y: Bar.bottom - S.top, w: Math.max(6, B.right - W.right), h: sideH, r: 0 }, apart: [12, 4, 5], to: to(limbs[1]), dl: 0.1 },
      { k: 'armL', c0: '#E6DCC6', c: KZ.ink, seed: 43, from: { x: B.left - S.left, y: Tool.top - S.top, w: half, h: Tool.height, r: 0 }, apart: [-10, -6, -6], to: to(limbs[2]), dl: 0.16 },
      { k: 'armR', c0: '#E6DCC6', c: KZ.ink, seed: 44, from: { x: B.left - S.left + half, y: Tool.top - S.top, w: half, h: Tool.height, r: 0 }, apart: [10, -6, 6], to: to(limbs[3]), dl: 0.2 },
      { k: 'body', c0: KZ.cream, c: KZ.teal, seed: 45, lines: true, from: { x: W.left - S.left, y: Tool.bottom - S.top, w: W.width, h: W.bottom - Tool.bottom, r: 0 }, apart: [0, 8, 1.5], to: to(part('body')), dl: 0 },
      // Голова — из всей верхней полосы браузера (не из одной вкладки).
      { k: 'head', c0: KZ.ink, c: KZ.face, round: true, from: { x: B.left - S.left, y: B.top - S.top, w: B.width, h: Bar.bottom - B.top, r: 0 }, apart: [0, -16, -4], to: head, dl: 0.24 },
      // Вкладка с названием влетает внутрь головы и прячется в ней: название — одно из сведений, которые хранит голова.
      { k: 'name', c0: '#E6DCC6', c: '#E6DCC6', round: true, text: pick(UI.mySite), fade: true, from: box(T), apart: [-4, -26, -7],
        to: { x: head.x + head.w * 0.18, y: head.y + head.h * 0.36, w: head.w * 0.64, h: head.h * 0.26, r: -4 }, dl: 0.34 }
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
      borderRadius: pc.round ? (fly ? (pc.fade ? '6px' : '50%') : '6px 6px 0 0') : null,
      opacity: pc.fade && fly ? 0 : 1,
      clipPath: pc.round ? null : torn(pc.seed, 6, 2.5, Math.max(0.2, Math.min(5, g.w / Math.max(1, g.h)))),
      transition: ['left', 'top', 'width', 'height', 'rotate'].map((k) => k + ' ' + d + ' ' + st + ' ' + dl)
        .concat(['background ' + d + ' steps(4, end) ' + dl, 'border-radius ' + d + ' steps(5, end) ' + dl])
        .concat(pc.fade ? ['opacity .2s steps(2, end) ' + (pc.dl + S1_FLY - 0.05).toFixed(2) + 's'] : []).join(', ')
    };
  };
  // Подсветка идёт за речью: до превращения — вкладка, потом окно; после — голова
  // («сведения о странице»), потом тело («всё, что в окне»).
  const hl = phase !== 'man' ? null : speaker.text === c.magicHead ? 'head' : speaker.text === c.magicWin ? 'body' : null;
  const tabNow = phase === 'page' && speaker.text === c.sayTab;
  const winNow = phase === 'page' && speaker.text === c.sayWin;
  const askText = phase === 'man' ? c.askDone : spoken ? c.ask : c.askLook;
  const busy = phase === 'measure' || phase === 'morph';
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} />
        <div ref={sceneRef} className={'kz-scene kz-s1 kz-s1-rev is-' + phase}>
          {phase !== 'man' ? (
            <div className={'kz-col kz-s1-page' + (phase === 'morph' ? ' is-gone' : '')}>
              <PaperBrowser title={pick(UI.mySite)} tabHl={tabNow} pageHl={winNow || led}>
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
// ЧТО ТАКОЕ ТЕГ (заказчик, 23.10.2026): до рамки html — зачем угловые скобки и
// что значит косая черта. Только объяснение, без «сам делает» и закрепления
// (исключение из троек — так решил заказчик). Браузер рядом честный: слово без
// скобок он показывает текстом, тег — нет.
// =============================================================================
// Тег из кусочков: коралловые скобки и черта, имя чернилами (как TagK).
const TgTag = ({ close, hl, cap, slashHl, cls }) => (
  <span className={'kz-tg-tag' + (hl ? ' is-hl' : '') + (cls ? ' ' + cls : '')} translate="no">
    <span className="kz-tag"><span className="kz-tk-b">{'<'}</span>{close ? <span className={'kz-tk-b kz-tg-slash' + (slashHl ? ' is-hl' : '')}>/</span> : null}<span className="kz-tk-n">html</span><span className="kz-tk-b">{'>'}</span></span>
    {cap ? <i className="kz-tg-cap">{cap}</i> : null}
  </span>
);

// =============================================================================
// TG1. ЧТО ТАКОЕ ТЕГ — в коде «html Привет, мир!»: браузер честно показывает
// слово html текстом. Показ (ученик смотрит, кнопок нет): к слову слетаются
// угловые скобки — оно пропало со страницы: это тег; в конце строки влетает
// закрывающий тег, косая черта падает сверху.
// =============================================================================
function TG1({ p }) {
  const pick = usePick();
  const c = C.tg1;
  const [rec, put] = useRec('tg1');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);   // 0 — слово · 1 — <html> · 2 — и </html>
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.askPair, pose: 'point' }]);
  const stripRef = useRef(null);
  // Показ: слово загорается, к нему слетаются скобки — тег; потом влетает закрывающий тег.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: () => stripRef.current && stripRef.current.querySelector('.kz-tg-word'), act: () => { sfx('pop', true); setN(1); } },
    { wait: 700 },
    { say: [{ text: c.pair, pose: 'wonder' }, { text: c.askSlash, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } },
    { wait: 900 },
    { say: [{ text: c.slash, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  // Подсветка за речью: «слово показал текстом» — слово и окно; «это тег» — тег; «косая черта» — закрывающий.
  const hlWord = speaker.text === c.say;
  const hlOpen = speaker.text === c.pair;
  const hlClose = speaker.text === c.slash;
  const text = pick(c.text);
  const askText = n === 2 ? c.aDone : n === 1 && speaker.text === c.askSlash ? c.aSlash : c.aPair;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={solved || n === 2 ? null : n + '/2'} />
        <div className="kz-scene kz-tg kz-tg1">
          <div className="kz-tg-strip kz-a-drop" translate="no" ref={stripRef}>
            {n === 0 ? <span className={'kz-tg-word' + (hlWord ? ' is-hl' : '')}>html</span>
              : <TgTag hl={hlOpen} cap={pick(c.open)} cls={n === 1 && !solved ? 'kz-tg-in' : ''} />}
            <span className="kz-tg-text">{text}</span>
            {n === 2 ? <TgTag close hl={hlClose} slashHl={hlClose} cap={pick(c.close)} cls={solved ? '' : 'kz-tg-in is-new'} /> : null}
          </div>
          <PaperBrowser title="" cls="kz-tg-br" pageHl={hlWord || hlOpen}>
            <div className="kz-tg-page" key={n === 0 ? 'w' : 't'}>{n === 0 ? <><span className={hlWord ? 'kz-tg-mark' : ''}>html</span> {text}</> : <span className={n === 1 ? 'kz-a-pop' : ''}>{text}</span>}</div>
          </PaperBrowser>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S3. ТЕГ HTML — бумажный браузер со страницей в рамке html (заказчик,
// 23.10.2026: браузер вместо человечка); две бирки — открывающий и закрывающий
// тег. Показ: бирки по очереди загораются и становятся жёлтыми, Коди называет каждую.
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
    : [{ text: c.say, pose: 'explain' }, { text: c.sayTag, pose: 'explain' }]);
  const boxRef = useRef(null);
  // Показ: загорается верхняя бирка, Коди называет её; потом нижняя.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: () => boxRef.current && boxRef.current.querySelector('.kz-frame-lbl-top'), act: () => { sfx('tap', true); setN(1); } },
    { say: [{ text: c.top, pose: 'point' }] },
    { look: () => boxRef.current && boxRef.current.querySelector('.kz-frame-lbl-bot'), act: () => { sfx('ok', true); setN(2); } },
    { say: [{ text: c.bottom, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const tagHl = speaker.text === c.sayTag;   // «Тег html показывает…» — оба тега светятся
  const askText = solved || n === 2 ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={solved ? null : n + '/2'} />
        <div className="kz-scene" ref={boxRef}>
          <ManBox frame frameAnim={!solved} frameHl={speaker.text === c.say} br={<FramedPage anim={!solved} />}
            labels={<>
              <KzLabel t="html" cls="kz-frame-lbl-top" on={n >= 1} hl={tagHl || speaker.text === c.top} />
              <KzLabel t="html" close cls="kz-frame-lbl-bot" on={n >= 2} hl={tagHl || speaker.text === c.bottom} />
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
// S6. ГОЛОВА СТРАНИЦЫ — показ короткими шагами, у каждого своя подсветка:
// «голова напоминает head» — голова и строки head; «в окне не видно» — окно;
// голова приподнимается, внутри карточка title, в коде — строка title; карточка
// улетает на вкладку — вкладка; «в head — title, в title — название».
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
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayInfo, pose: 'explain' }]);
  const q = (sel) => () => sceneRef.current && sceneRef.current.querySelector(sel);
  // Показ: голова загорается и открывается; карточка title загорается и летит на вкладку.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q('.kz-man [aria-label="head"]'), act: () => { sfx('pop', true); setStep(1); } },
    { say: [{ text: c.opened, pose: 'point' }] },
    { look: q('.kz-man [aria-label="title"]'), act: () => {
      sfx('tap', true);
      const sc = sceneRef.current;
      if (!reduceMotion() && sc && kzFly(sc.querySelector('.kz-man [aria-label="title"]'), sc.querySelector('.kz-br-tab'), 760)) setFlying(true);
    } },
    { wait: 800 },
    { act: () => { setFlying(false); setStep(2); setStamp((v) => v + 1); sfx('ok', true); } },
    { say: [{ text: c.flew, pose: 'wonder' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const title = pick(UI.mySite);
  const askText = step === 0 ? c.ask : step === 1 ? c.askCard : c.done;
  // Подсветка за речью: голова и строки head → окно → строка title → вкладка.
  const hlHead = speaker.text === c.say;
  const hlWin = speaker.text === c.sayInfo;
  const hlTitle = speaker.text === c.opened;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={solved ? null : step + '/2'} />
        <div ref={sceneRef} className={'kz-scene' + (flying ? ' is-flying' : '')}>
          <ManBox man={<PaperMan anim={false} headOpen={step === 1} hl={hlHead ? 'head' : null}
            titleText={step === 1 ? title : null} />} cls="kz-s6-box" />
          <div className="kz-col">
            <PaperBrowser title={step >= 2 ? title : ''} stamp={stamp} tabHl={step >= 2 && speaker.text === c.flew} pageHl={hlWin}>
              <PageBits text={pick(UI.hello)} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: hlHead || step === 1 ? 'is-hl' : '', parts: [T_('head')] },
              { k: 't', d: 1, cls: hlTitle ? 'is-read' : step >= 2 ? 'is-new' : '', parts: step >= 1 ? [T_('title'), W_(title), T_('title', true)] : [<span key="d" className="kz-dim">…</span>] },
              { k: 'hc', d: 0, cls: hlHead || step === 1 ? 'is-hl' : '', parts: [T_('head', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// СВОЙ ТЕКСТ УЧЕНИКА (s7 — название, s10 — приветствие). Предпросмотр — сразу
// при наборе; засчитывается только по кнопке «Готово» (заказчик, 23.10.2026:
// пауза в наборе не завершает задание — ребёнок мог остановиться после первой
// буквы). Пустое поле, одни пробелы и теги не принимаются. Похвала и событие в
// журнале — один раз. После засчёта правка сохраняется сама (страница и
// итоговый артефакт берут новый текст), «Готово» её отмечает, без новой похвалы.
// =============================================================================
function useTypedDone({ storeKey, screenId, type, lad }) {
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec(screenId);
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get(storeKey) || '');
  const [saved, setSaved] = useState(store.get(storeKey) || '');
  const [stamp, setStamp] = useState(0);
  const doneRef = useRef(solved);
  useEffect(() => {
    if (!doneRef.current || !okText(val) || val.trim() === saved) return;
    store.set(storeKey, val.trim()); setSaved(val.trim());
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = okText(val);   // повторное «Готово» после засчёта только отмечает текст: похвала и журнал — один раз
  const commit = (first) => {
    if (!okText(val)) return false;
    const v = val.trim();
    store.set(storeKey, v); setSaved(v); setStamp((x) => x + 1); sfx('ok', true);
    if (!doneRef.current) {
      doneRef.current = true;
      put({ done: true });
      log({ screenId, type, correct: true, hints: lad.asked.current, depth: lad.lv });
      if (first) first();
    }
    return true;
  };
  return { solved, val, setVal, saved, stamp, ready, commit, shown: okText(val) ? val : saved };
}
// Кнопка «Готово» под кодом: горит, когда текст можно засчитать.
function ReadyBtn({ on, glow, onClick }) {
  const pick = usePick();
  return (
    <div className="kz-row">
      <button type="button" className="kz-btn is-coral kz-ready" disabled={!on} onClick={onClick}>{pick(UI.ready)}<Led on={glow} /></button>
    </div>
  );
}

// =============================================================================
// S7. ИМЯ НА ВКЛАДКЕ — поле внутри title; вкладка меняется по ходу набора,
// засчитывается по «Готово».
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const [rec] = useRec('s7');
  const solved0 = !!(rec && rec.done);
  const lad = useKzLadder(!solved0);
  const ty = useTypedDone({ storeKey: 'myTitle', screenId: 's7', type: 'write-title', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={ty.shown} stamp={ty.stamp} tabHl={!ty.solved} short>
              <PageBits text={pick(UI.hello)} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('head')] },
              { k: 't', d: 1, cls: 'is-hl', parts: [T_('title'),
                <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={L3('Masalan: Futbol', 'Например: Футбол', 'For example: Football')} label={c.ask} max={30} /></span>,
                T_('title', true)] },
              { k: 'hc', d: 0, parts: [T_('head', true)] }
            ]} />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
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
// S9. ТЕЛО СТРАНИЦЫ — показ без слов о механике (заказчик, 23.10.2026: «показать
// с анимацией, не словами, что выходит именно оттуда»): тело человечка
// загорается, на него клеится бирка body; из тела по очереди вылетают бумажные
// куски страницы — строка текста, полоски, картинка, кнопка — и ступенчато
// ложатся на свои места в окне. Окно обводится той же бирюзой, что и тело, на
// окно клеится такая же бирка body, в коде загораются строки body. Тело = body =
// всё, что видно в окне.
// =============================================================================
const S9_FLY = 1.1;   // полёт куска из тела в окно, с
const S9_PEEK = 450;  // куски сначала видны на теле (выглядывают), мс
const S9_GAP = 0.2;   // лесенка: каждый следующий кусок вылетает позже, с
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const mine = useMine();
  // idle — тело на месте · measure — содержимое окна невидимо, по нему меряются места ·
  // fly — куски летят из тела · out — содержимое в окне
  const [phase, setPhase] = useState(solved ? 'out' : 'idle');
  const [pieces, setPieces] = useState(null);
  const [stage, setStage] = useState(0);
  const [lbl, setLbl] = useState(null);   // где бирки body: на теле и на окне
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const sceneRef = useRef(null);
  const tm = useRef([]);
  useEffect(() => () => { tm.current.forEach(clearTimeout); paperOff(); }, []);
  const later = (ms, f) => tm.current.push(setTimeout(f, ms));
  const land = () => { paperOff(); setPieces(null); setPhase('out'); sfx('ok', true); };
  // Показ: тело загорается — куски страницы вылетают из него в окно.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: () => sceneRef.current && sceneRef.current.querySelector('.kz-man [aria-label="body"]'), act: () => { sfx('pop', true); setPhase(reduceMotion() ? 'out' : 'measure'); } },
    { wait: reduceMotion() ? 100 : S9_PEEK + (S9_FLY + 5 * S9_GAP + 0.4) * 1000 },
    { say: [{ text: c.out, pose: 'wonder' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  // Бирки и места кусков — от сцены.
  const measure = () => {
    const sc = sceneRef.current;
    const body = sc && sc.querySelector('.kz-man [aria-label="body"]');
    const win = sc && sc.querySelector('.kz-br-body');
    if (!body || !win) return null;
    const S = sc.getBoundingClientRect(), B = body.getBoundingClientRect(), W = win.getBoundingClientRect();
    return { S, B, W, box: (r) => ({ x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height }) };
  };
  useLayoutEffect(() => {
    if (phase !== 'out' && phase !== 'measure') return;
    const m = measure();
    if (!m) return;
    setLbl({ body: { x: m.B.left - m.S.left + m.B.width / 2, y: m.B.top - m.S.top }, win: { x: m.W.right - m.S.left - 8, y: m.W.top - m.S.top } });
    if (phase !== 'measure') return;
    const sc = sceneRef.current;
    const q = (sel) => Array.prototype.slice.call(sc.querySelectorAll('.kz-s9-ghost ' + sel));
    const B = m.box(m.B);
    // На теле куски лежат стопкой сверху вниз (уменьшены, чтобы поместиться): видно, откуда они.
    const from = (i, w, h) => { const k = Math.min(0.6, (B.w * 0.8) / Math.max(1, w)); return { x: B.x + B.w / 2 - (w * k) / 2 + (i % 2 ? 4 : -4), y: B.y + B.h * (0.14 + 0.12 * i), w: w * k, h: Math.max(4, h * k) }; };
    const list = [];
    q('.kz-br-text').forEach((el) => list.push({ k: 'text', el }));
    q('.kz-bit-line').forEach((el, i) => list.push({ k: 'line' + i, el }));
    q('.kz-bit-pic').forEach((el) => list.push({ k: 'pic', el }));
    q('.kz-bit-btn').forEach((el) => list.push({ k: 'btn', el }));
    if (!list.length) { land(); return; }
    setPieces(list.map((it, i) => { const t = m.box(it.el.getBoundingClientRect()); return { k: it.k, to: t, from: from(i, t.w, t.h), dl: i * S9_GAP, r: (i % 2 ? 7 : -7) }; }));
    setStage(0);
    setPhase('fly');
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (phase !== 'fly' || !pieces) return undefined;
    let r1 = requestAnimationFrame(() => { r1 = requestAnimationFrame(() => { setStage(1); sfx('tap', true); }); });
    later(S9_PEEK, () => { setStage(2); paperOn(); });
    later(S9_PEEK + Math.round((S9_FLY + pieces[pieces.length - 1].dl) * 1000) + 160, land);
    return () => cancelAnimationFrame(r1);
  }, [phase, pieces]); // eslint-disable-line react-hooks/exhaustive-deps
  const pieceStyle = (pc) => {
    // 0 — ещё не видны · 1 — выглянули на теле стопкой · 2 — летят на свои места в окне
    const g = stage === 2 ? pc.to : pc.from;
    const d = S9_FLY + 's', dl = pc.dl + 's';
    return {
      left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px', rotate: (stage === 2 ? 0 : pc.r) + 'deg', opacity: stage ? 1 : 0,
      transition: stage === 2
        ? ['left', 'top', 'width', 'height', 'rotate'].map((k) => k + ' ' + d + ' steps(10, end) ' + dl).join(', ')
        : 'opacity .2s steps(2, end) ' + (pc.dl * 0.5).toFixed(2) + 's'
    };
  };
  const out = phase === 'out';
  const going = phase === 'fly' || out;   // тело уже отдаёт содержимое: окно и код body горят
  const hello = pick(UI.hello);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={out ? c.done : c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={out ? c.done : c.ask} />
        <div className="kz-scene kz-s9" ref={sceneRef}>
          <ManBox man={<PaperMan anim={false} hl={speaker.text === c.say || going ? 'body' : null} />} cls="kz-s6-box" />
          <div className="kz-col">
            <PaperBrowser title={mine.title} pageHl={going}>
              {out ? <PageBits text={hello} bits />
                : phase === 'measure' || phase === 'fly' ? <div className="kz-s9-ghost"><PageBits text={hello} bits /></div> : null}
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, cls: going ? 'is-hl' : '', parts: [T_('body')] },
              { k: 'x', d: 1, cls: out ? 'is-new' : '', parts: out ? [W_(hello), <span key="p" className="kz-dim">{' + ' + pick(UI.pic) + ' + ' + pick(UI.play)}</span>] : [<span key="d" className="kz-dim">…</span>] },
              { k: 'bc', d: 0, cls: going ? 'is-hl' : '', parts: [T_('body', true)] }
            ]} />
          </div>
          {lbl && going ? <KzLabel t="body" cls="kz-s9-lbl is-man" anim={solved ? null : 'stamp'} style={{ left: lbl.body.x + 'px', top: lbl.body.y + 'px' }} /> : null}
          {lbl && out ? <KzLabel t="body" cls="kz-s9-lbl is-win" anim={solved ? null : 'stamp'} style={{ left: lbl.win.x + 'px', top: lbl.win.y + 'px' }} /> : null}
          {phase === 'fly' && pieces ? (
            <div className="kz-morph" aria-hidden="true">
              {pieces.map((pc) => (
                <span key={pc.k} className={'kz-s9-p is-' + pc.k.replace(/\d+$/, '')} style={pieceStyle(pc)}>
                  {pc.k === 'text' ? <span className="kz-s9-p-t">{hello}</span> : null}
                  {pc.k === 'btn' ? <span className="kz-s9-p-b">{pick(UI.play)}</span> : null}
                  {pc.k === 'pic' ? <><span className="kz-pic-sun" /><span className="kz-pic-mnt" /></> : null}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S10. ПРИВЕТ В ОКНЕ — поле внутри body; окно меняется по ходу набора,
// засчитывается по «Готово».
// =============================================================================
function S10({ p }) {
  const c = C.s10;
  const mine = useMine();
  const [rec] = useRec('s10');
  const solved0 = !!(rec && rec.done);
  const lad = useKzLadder(!solved0);
  const ty = useTypedDone({ storeKey: 'myText', screenId: 's10', type: 'write-body', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={mine.title} short pageHl={!ty.solved}>
              <div className={'kz-br-text' + (ty.stamp ? ' kz-a-stamp' : '')} key={'f' + ty.stamp}>{ty.shown}</div>
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, parts: [T_('body')] },
              { k: 'x', d: 1, cls: 'is-hl', parts: [<span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={L3('Masalan: Salom!', 'Например: Привет!', 'For example: Hello!')} label={c.ask} max={60} /></span>] },
              { k: 'bc', d: 0, parts: [T_('body', true)] }
            ]} />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
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
// S12. СВЕРХУ ВНИЗ — показ: браузер сам читает код; строки кода подсвечиваются по
// очереди, и страница собирается вырезками: первая строка, рамка, голова с
// именем, тело с текстом. Потом короткими репликами — вложенность перед сборкой
// (s13): html содержит две целые группы head и body; title — внутри head; head
// закрывается до открытия body; приветствие — внутри body. Подсветка — за речью.
// Потом Коди сам проходит по частям по порядку (заказчик, 23.10.2026): DOCTYPE,
// html, head, title, «сначала закрываем head, потом открываем body», body, свой
// текст — у каждой своя подсветка строк и блока коллажа. После этого по желанию
// ученик нажимает строку кода или часть коллажа — Коди повторяет объяснение
// именно этой части. Нажимать не обязательно, «Дальше» доступна.
// =============================================================================
const READ12 = ['doc', 'html', 'head', 'title', 'headc', 'body', 'text', 'bodyc', 'htmlc'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const mine = useMine();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ12.length : -1);
  // Коди сам проходит по частям: у каждой реплики — своя подсвеченная часть (k).
  const WALK = [{ text: c.parts.doc, pose: 'explain', k: 'doc' }, { text: c.parts.html, pose: 'point', k: 'html' },
    { text: c.parts.head, pose: 'point', k: 'head' }, { text: c.parts.title, pose: 'point', k: 'title' },
    { text: c.order5, pose: 'point', k: 'switch' }, { text: c.parts.body, pose: 'point', k: 'body' },
    { text: c.parts.text, pose: 'smile', k: 'text' }];
  const ORDER = WALK.map((w) => ({ text: w.text, pose: w.pose })).concat([{ text: c.tapSay, pose: 'curious' }]);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 620;
  const run = () => { READ12.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  // Показ: строки читаются по очереди сами, потом Коди объясняет каждую часть.
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run },
    { wait: STEP * READ12.length + 200 },
    { act: () => { setRead(READ12.length); } },
    { say: ORDER },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  // По желанию после показа: нажатая часть подсвечена, Коди повторяет её объяснение.
  const explore = solved || demo.done;
  const [picked, setPicked] = useState(null);
  const pickPart = (k) => {
    if (!explore || !k) return;
    sfx('tap', true); setPicked(k);
    sayNow(c.parts[k], 'point');
  };
  const LINE_PART = { doc: 'doc', html: 'html', htmlc: 'html', head: 'head', headc: 'head', title: 'title', body: 'body', bodyc: 'body', text: 'text' };
  const PICK_LINES = { doc: { doc: 'doc' }, html: { html: 'html', htmlc: 'html' }, head: { head: 'head', title: 'head', headc: 'head' },
    title: { title: 'head' }, body: { body: 'body', text: 'body', bodyc: 'body' }, text: { text: 'body' } };
  const PICK_COLL = { doc: 'doc', html: 'html', head: 'head', title: 'title', body: 'body', text: 'body' };
  const pickColl = (e) => {
    const t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    const k = t.closest('.kz-col-title') ? 'title' : t.closest('.kz-col-text') ? 'text' : t.closest('.kz-col-doc') ? 'doc'
      : t.closest('.kz-col-lbl-head, .kz-col-head') ? 'head' : t.closest('.kz-col-lbl-body, .kz-col-body') ? 'body'
      : t.closest('.kz-col-lbl-html, .kz-col-html') ? 'html' : null;
    pickPart(k);
  };
  const ledLine = useIdleLed(explore && !picked, 0);
  const at = (k) => read >= READ12.indexOf(k);
  // Пока Коди объясняет часть — её строки кода и блок коллажа подсвечены.
  const walkNow = spoken || picked ? null : WALK.find((w) => w.text === speaker.text);
  const sayK = walkNow ? walkNow.k : null;
  const SAY_LINES = { doc: { doc: 'doc' }, html: { html: 'html', htmlc: 'html' }, head: { head: 'head', title: 'head', headc: 'head' },
    title: { title: 'head' }, switch: { headc: 'head', body: 'body' }, body: { body: 'body', text: 'body', bodyc: 'body' }, text: { text: 'body' } };
  const COLL_HL = { doc: 'doc', html: 'html', head: 'head', title: 'title', switch: ['head', 'body'], body: 'body', text: 'body' };
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
    const part = picked ? PICK_LINES[picked][ln.k] : sayK && SAY_LINES[sayK][ln.k];
    const PART = { doc: 'doc', html: 'html', htmlc: 'html', head: 'head', title: 'head', headc: 'head', body: 'body', text: 'body', bodyc: 'body' };
    return Object.assign(ln, { cls: cur === ln.k ? 'is-read is-say-' + PART[ln.k] : part ? 'is-say is-say-' + part : '',
      onTap: explore ? () => pickPart(LINE_PART[ln.k]) : null, led: ln.k === 'head' && ledLine });
  });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : explore ? c.askTap : c.askDone} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={read < 0 ? c.ask : explore ? c.askTap : c.askDone} />
        <div className={'kz-scene kz-s12' + (explore ? ' is-explore' : '')}>
          <div className="kz-col kz-col-code"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col kz-s12-coll" onClick={explore ? pickColl : undefined}>
            <PageCollage title={mine.title} text={mine.text} anim={!solved} hl={cur === 'doc' ? 'doc' : picked ? PICK_COLL[picked] : sayK ? COLL_HL[sayK] : null}
              show={{ doc: at('doc'), html: at('html'), head: at('head'), title: at('title'), body: at('body'), text: at('text') }} />
          </div>
        </div>
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
// Q1. ИТОГОВАЯ ПРОВЕРКА: ВКЛАДКА И ОКНО — новый пример без подсказки до первой
// попытки: на вкладке должно быть «Robotlar», в окне — «Salom!». Ученик сам
// решает, какую фразу в title, какую в body (перетащить или нажать фразу, потом
// место). Не туда — браузер честно на миг показывает фразу там, куда она попала,
// Коди называет причину, фраза возвращается. Подсказки — по лампочке.
// =============================================================================
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? { tab: 't', win: 'w' } : { tab: null, win: null });
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [peek, setPeek] = useState(null);   // { where, id } — куда на миг попала фраза при ошибке
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = !!(slots.tab && slots.win);
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const led = useIdleLed(canTap && !done, (slots.tab ? 1 : 0) + (slots.win ? 1 : 0) + (sel ? 10 : 0));
  const word = (id) => pick(id === 't' ? c.tabWord : c.winWord);
  const place = (id, where) => {
    if (!canTap || done || !id || !where || slots[where]) return false;
    st.current.tries += 1;
    if ((where === 'tab') !== (id === 't')) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      clearTimeout(peekT.current); setPeek({ where, id }); peekT.current = setTimeout(() => setPeek(null), 1800);
      const m = fillL(where === 'win' ? c.toWin : c.toTab, { w: id === 't' ? c.tabWord : c.winWord });
      setMsg(m); setSel(null); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = Object.assign({}, slots, { [where]: id });
    setSlots(ns); setSel(null); setMsg(null); setPeek(null);
    if (ns.tab && ns.win) {
      put({ done: true });
      log({ screenId: 'q1', type: 'tab-or-window', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const pickSlot = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  // Третья ступень подсказки — светятся фраза и её место; до этого ответ не подсвечивается.
  const lit = lad.lv >= 3;
  const nextId = !slots.tab ? 't' : 'w';
  const slot = (where) => (slots[where] ? <span key={where} className="kz-a-stamp">{W_(word(slots[where]))}</span> : (
    <button key={where} type="button" data-place={where} disabled={!canTap || done} onClick={() => pickSlot(where)}
      className={'kz-dash kz-drop kz-q1-slot' + (dnd.hover === where ? ' is-hover' : '') + (dnd.active || sel ? ' is-call' : '')}>
      <Led on={(led && !!sel) || (lit && (where === 'tab') === (nextId === 't'))} />
    </button>
  ));
  const tabText = slots.tab ? word(slots.tab) : peek && peek.where === 'tab' ? word(peek.id) : '';
  const winText = slots.win ? word(slots.win) : peek && peek.where === 'win' ? word(peek.id) : '';
  const hint = hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : ((slots.tab ? 1 : 0) + (slots.win ? 1 : 0)) + '/2'} />
        <div className={'kz-scene kz-q1' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col">
            <PaperBrowser title={tabText} stamp={(slots.tab ? 1 : 0) + (peek && peek.where === 'tab' ? 2 : 0)} short tabHl={!!(peek && peek.where === 'tab')} pageHl={!!(peek && peek.where === 'win')}>
              {winText ? <div className="kz-br-text kz-a-drop" key={'w' + winText}>{winText}</div> : null}
            </PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('head')] },
              { k: 't', d: 1, parts: [T_('title'), slot('tab'), T_('title', true)] },
              { k: 'hc', d: 0, parts: [T_('head', true)] },
              { k: 'b', d: 0, parts: [T_('body')] },
              { k: 'x', d: 1, parts: [slot('win')] },
              { k: 'bc', d: 0, parts: [T_('body', true)] }
            ]} cls="kz-code-sm" />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {['t', 'w'].map((id, i) => (slots.tab === id || slots.win === id ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap' + (sel === id ? ' is-sel' : '') + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextId ? ' is-led' : '')}
                style={{ '--r': (i ? 2 : -2) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, word(id)); }}
                onClick={() => { setSel(sel === id ? null : id); setMsg(null); sfx('tap', true); }}>
                <span>{word(id)}</span><Led on={led && !sel} />
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
// Q2. ЗАЧЕМ НУЖЕН </title>? — три варианта, верный не первый. До первой попытки
// ничего не подсвечено; неверный вариант гаснет, Коди называет причину, можно
// выбрать снова. Подсказки — по лампочке (третья ступень подсвечивает ответ).
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
  const mine = useMine();
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
      log({ screenId: 'q2', type: 'why-close-title', correct: true, firstTry: off.length === 0 && lad.asked.current === 0, attempts: off.length + 1, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setOff(off.concat(o.id)); setMsg(o.why); sayNow(o.why, 'think');
    if (off.length + 1 >= 2) lad.bump();
  };
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hint)} />
        <div className="kz-scene kz-scene-col kz-q2">
          <div className="kz-col">
            <KzCode lines={[{ k: 't', d: 0, cls: 'kz-q2-line', parts: [T_('title'), W_(mine.title), <span key="c" className="kz-q2-close">{T_('title', true)}</span>] }]} />
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
  { id: 'tg1', code: 'SHOW', Comp: TG1 },
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'CHECK-1', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'PREDICT', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 'q1', code: 'CHECK-4', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; имя и текст ученика (myTitle, myText) остаются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], tg1: ['tg1'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

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
