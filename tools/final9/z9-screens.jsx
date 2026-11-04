// =============================================================================
// ЭКРАНЫ УРОКА 9 «Финальный HTML-проект» — повторение курса (облик «Редактор»). Сделаны с нуля; основа кода — уроки 2–8.
// Сайт Коди сломал глитч: 8 станций — по уроку на станцию, на каждой одна поломка и одно действие ученика;
// механики чередуются (собрать, вписать, выбрать, найти строку, перетащить, найти пару). Потом смешанное
// задание (картинка-ссылка), «босс» — пять поломок на одной странице, быстрый раунд «верно или нет», вывод.
// Карта станций — полоса над заданием: пройденные горят, текущая в рамке. Честный браузер — как в уроках.
// Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const STATIONS = ['html', 'h1', 'ol', 'a', 'img', 'input', 'select', 'header'];

// РИСУНКИ-«ФОТО» (как в уроке 5).
const PicOsh = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FDE8C8" />
    <ellipse cx="80" cy="74" rx="62" ry="22" fill="#fff" /><ellipse cx="80" cy="70" rx="48" ry="16" fill="#F6E7B9" />
    <path d="M40 70 Q80 30 120 70 Z" fill="#F3DB9A" />
    {[[60, 58], [72, 50], [86, 52], [98, 60], [78, 62], [66, 66], [92, 66]].map(([x, y], i) => <rect key={i} x={x} y={y} width="9" height="3.5" rx="1.7" fill="#F28C28" transform={'rotate(' + (i * 25) + ' ' + x + ' ' + y + ')'} />)}
    {[[70, 56], [88, 58], [80, 48]].map(([x, y], i) => <circle key={'m' + i} cx={x} cy={y} r="4.5" fill="#8B5A3C" />)}
  </svg>
);
const PicMushuk = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#DCEFF5" />
    <path d="M52 44 L58 18 L74 36 Z M108 44 L102 18 L86 36 Z" fill="#F29A4A" /><circle cx="80" cy="60" r="34" fill="#F29A4A" />
    <circle cx="68" cy="56" r="5" fill="#1F2937" /><circle cx="92" cy="56" r="5" fill="#1F2937" /><path d="M76 68 L84 68 L80 73 Z" fill="#E86A86" />
    <path d="M58 70 H40 M58 75 H42 M102 70 H120 M102 75 H118" stroke="#7C4A1E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const PICS = { 'osh.jpg': PicOsh, 'mushuk.jpg': PicMushuk };

function useFitPage(dep) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page) return undefined;
    const fit = () => {
      let k = 1;
      el.style.fontSize = '';
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.5) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => ro.disconnect();
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// СТРАНИЦА — блоки, как рисует браузер без CSS:
//   { t: 'h', lvl } заголовок h1–h6 (lvl 0 — незнакомый тег: обычный текст); 'p'; 'img' { src, alt } — есть файл → картинка,
//   нет src → только alt; 'list' { ordered, items: [{ text, li }] } — без li пункт без маркера и номера;
//   'links' { items: [{ text, href }] } — без href простой текст; 'field' { cap, type, val } — password точками;
//   'btn' { text }; 'region' { tag, kids } — часть сайта: рамка только в инспекторе.
function Blk({ b, insp, onImgTap }) {
  const hl = b.hl ? ' is-hl' : '';
  if (b.t === 'h') {
    const cls = b.lvl >= 1 && b.lvl <= 6 ? 'z9-h' + b.lvl : 'z9-txt';
    return <div className={'z9-blk ' + cls + hl + (b.cls ? ' ' + b.cls : '')}>{b.text}</div>;
  }
  if (b.t === 'p') return <div className={'z9-blk z9-p' + hl}>{b.text}</div>;
  if (b.t === 'img') {
    const P = b.src ? PICS[b.src] : null;
    const pic = P ? <span className="z9-pic"><P /></span> : <span className="z9-alt">{b.alt}</span>;
    if (onImgTap && P) return <div className={'z9-blk z9-b-img' + hl}><button type="button" className="z9-imglink" onClick={onImgTap}>{pic}</button></div>;
    return <div className={'z9-blk z9-b-img' + hl + (b.cls ? ' ' + b.cls : '')}>{pic}</div>;
  }
  if (b.t === 'list') {
    const Tag = b.ordered ? 'ol' : 'ul';
    return (
      <Tag className={'z9-blk z9-list' + (b.ordered ? ' is-ol' : ' is-ul') + hl}>
        {b.items.map((it, j) => (it.li ? <li key={j}>{it.text}</li> : <span key={j} className="z9-bare">{it.text}</span>))}
      </Tag>
    );
  }
  if (b.t === 'links') return <div className={'z9-blk z9-links' + hl}>{b.items.map((it, j) => <span key={j} className={it.href ? 'z9-a' : 'z9-an'}>{it.text}</span>)}</div>;
  if (b.t === 'field') {
    const v = b.val || '';
    return (
      <div className={'z9-blk z9-lab' + hl}>
        <span>{b.cap}</span>{' '}
        <span className={'z9-in' + (b.type === 'password' ? ' is-pass' : '')}>{b.type === 'password' ? '•'.repeat(v.length) : v || ' '}</span>
      </div>
    );
  }
  if (b.t === 'btn') return <div className={'z9-blk z9-b-btn' + hl}><span className="z9-btn">{b.text}</span></div>;
  if (b.t === 'region') {
    return (
      <div className={'z9-reg z9-reg-' + b.tag + (insp && b.tag ? ' is-insp' : '') + hl}>
        {insp && b.tag ? <span className="z9-reg-tag" translate="no">{b.tag}</span> : null}
        {b.kids.map((k, j) => <Blk key={j} b={k} insp={insp} onImgTap={onImgTap} />)}
      </div>
    );
  }
  return null;
}
function PageDoc({ blocks, insp, onImgTap, cls }) {
  const ref = useFitPage(JSON.stringify([blocks, insp]));
  return (
    <div ref={ref} className={'z9-doc' + (insp ? ' is-insp' : '') + (cls ? ' ' + cls : '')}>
      {insp ? <span className="z9-insp-badge"><i aria-hidden="true" />Inspektor</span> : null}
      {blocks.map((b, i) => <Blk key={b.k || i} b={b} insp={insp} onImgTap={onImgTap} />)}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url} short={short} cls={'z9-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;

// КАРТА СТАНЦИЙ — 8 уроков курса. cur — номер текущей станции (0–7), solved — она уже починена; all — все горят.
function StationMap({ cur, solved, all }) {
  const pick = usePick();
  return (
    <div className="z9-map" aria-label={pick(UI.map)}>
      {STATIONS.map((t, i) => {
        const done = all || i < cur || (i === cur && solved);
        return (
          <span key={t} className={'z9-st' + (done ? ' is-done' : '') + (i === cur && !all ? ' is-cur' : '')} title={pick(C.stations[i])}>
            <b>{i + 1}</b><i translate="no">{t}</i>
          </span>
        );
      })}
    </div>
  );
}

// КОД.
const attrSpan = (n, v, k, last) => <span key={k} className="kz-tag z9-att" translate="no"><span className="z9-attr">{n}</span><span className="kz-tk-b">=</span><span className="z9-val">{'"' + v + '"'}</span>{last ? <span className="kz-tk-b">{'>'}</span> : null}</span>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts }, extra || {});
const textLine = (k, t, w, extra) => codeLine(k, [T_(t), W_(w), T_(t, true)], extra);
const openTag = (name, sp) => <span key="o" className={'kz-tag' + (sp ? ' z9-att' : '')} translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{name}</span></span>;
const tagEnd = (k) => <span key={k || 'gt'} className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>;
const elCode = (name, attrs) => [openTag(name)].concat(attrs.length ? attrs.map((a, j) => attrSpan(a.n, a.v, 'a' + j, j === attrs.length - 1)) : [tagEnd()]);
const linkLine = (k, text, href, extra) => codeLine(k, (href ? elCode('a', [{ n: 'href', v: href }]) : [T_('a')]).concat([W_(text), T_('a', true)]), extra);
const KNOWN = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'img', 'ul', 'ol', 'li', 'b', 'i', 'input', 'label', 'form', 'select', 'option', 'textarea', 'button', 'header', 'nav', 'main', 'section', 'footer', 'head', 'body', 'html', 'title'];
const useStation = (i) => {
  const store = useStore();
  return (firstTry) => store.set('ft' + i, !!firstTry);
};

// Общие куски экранов-станций: задание с картой.
const StationHead = ({ st, solved, ask, hint, err, n }) => (
  <>
    <StationMap cur={st} solved={solved} />
    <KzAsk text={ask} hint={hint} err={err} n={n} />
  </>
);

// =============================================================================
// S1. КРЮЧОК — сайт Коди после глитча: заголовок крошечный, вместо фото слово, список без номеров, ссылка не
// нажимается. Карта: 8 погасших станций. «Ta'mirlash» — станции появляются одна за другой.
// Загадка: Коди думает, что всё надо стереть и написать заново.
// =============================================================================
const brokenHome = (pick) => {
  const s = C.site;
  return [{ t: 'h', lvl: 6, text: pick(s.title), k: 'h' }, { t: 'img', src: null, alt: pick(s.altOsh), k: 'i' },
    { t: 'list', ordered: false, items: pick(s.steps).map((x, j) => ({ text: x, li: j !== 1 })), k: 'l' },
    { t: 'links', items: [{ text: pick(s.menu)[0], href: true }, { text: pick(s.menu)[1], href: false }], k: 'a' },
    { t: 'field', cap: pick(s.capPass), type: 'text', val: 'kodi2026', k: 'f' }];
};
const fixedHome = (pick) => {
  const s = C.site;
  return [{ t: 'h', lvl: 1, text: pick(s.title), k: 'h' }, { t: 'img', src: 'osh.jpg', alt: pick(s.altOsh), k: 'i' },
    { t: 'list', ordered: true, items: pick(s.steps).map((x) => ({ text: x, li: true })), k: 'l' },
    { t: 'links', items: [{ text: pick(s.menu)[0], href: true }, { text: pick(s.menu)[1], href: true }], k: 'a' },
    { t: 'field', cap: pick(s.capPass), type: 'password', val: 'kodi2026', k: 'f' }];
};
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const s = C.site;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? 8 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const start = () => {
    if (!canTap || on) return;
    sfx('ok', true); put({ done: true });
    const step = reduceMotion() ? 40 : 180;
    for (let i = 1; i <= 8; i += 1) timers.current.push(setTimeout(() => { setOn(i); sfx('tap', true); }, step * i));
    sayNow(c.magic, 'point'); say(c.done, 'smile');
  };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <div className={'z9-map-wrap' + (on ? ' is-on' : '')}>
          <div className="z9-map">
            {STATIONS.map((t, i) => (
              <span key={t} className={'z9-st' + (i < on ? ' is-shown' : ' is-off')}><b>{i + 1}</b><i translate="no">{t}</i></span>
            ))}
          </div>
        </div>
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene z9-s1">
          <div className="kz-stagebox z9-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={!!on} /></div></div>
          <div className="kz-col z9-s1-page"><Br title={pick(s.title)} url="index.html" cls="z9-broken-br"><PageDoc blocks={brokenHome(pick)} /></Br></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={start}>{pick(UI.repair)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. СТАНЦИЯ 1 · КАРКАС (Code Builder) — в html пустые места: <head>, <title>…</title>, </head>, <body>…</body>;
// лишний <header>. Честно: название на вкладке — когда title на месте; страница — когда body на месте.
// =============================================================================
const S2_ORDER = ['head', 'title', 'headc', 'body'];
const S2_TRAY = ['body', 'title', 'header', 'headc', 'head'];
function S2({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(0);
  const c = C.s2;
  const s = C.site;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S2_ORDER.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 4;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const TXT = { head: '<head>', title: '<title>' + pick(s.title) + '</title>', headc: '</head>', body: '<body>…</body>', header: '<header>' };
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const want = S2_ORDER[got.length];
    if (id !== want) {
      st.current.misses += 1;
      const m = id === 'header' ? c.why.header : c.why[want];
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 4) {
      const ft = st.current.misses === 0 && lad.asked.current === 0;
      put({ done: true }); mark(ft);
      log({ screenId: 's2', type: 'review-skeleton', correct: true, firstTry: ft, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const nextOk = S2_ORDER[got.length];
  const depth = [1, 2, 1, 1];
  const lines = [codeLine('ho', [T_('html')])].concat([0, 1, 2, 3].map((i) => (got[i]
    ? codeLine('g' + i, [<span key="b" className="z9-built z9-a-in kz-tk-n" translate="no">{TXT[got[i]]}</span>], { d: depth[i], cls: 'is-new' })
    : codeLine('g' + i, [<span key="d" data-place="code" className={'kz-dash kz-dash-sm z9-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />], { d: depth[i], cls: i === got.length ? 'is-hl' : '' }))),
    [codeLine('hc', [T_('html', true)])]);
  const hasTitle = got.indexOf('title') >= 0;
  const hasBody = got.indexOf('body') >= 0;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={0} solved={done} ask={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/4'} />
        <div className={'kz-scene z9-s5' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={hasTitle ? pick(s.title) : ''} url="index.html" short>{hasBody ? <PageDoc blocks={fixedHome(pick).slice(0, 2)} /> : null}</Br></div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S2_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z9-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextOk ? ' is-led' : '')}
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
// S3. СТАНЦИЯ 2 · ЗАГОЛОВОК (Fill in the Blanks) — главный заголовок стал h6 и почти не виден. Ученик вписывает
// имя тега; закрывающий тег повторяет его. Честно: h1–h6 — свой размер, незнакомое имя — обычный текст.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(1);
  const c = C.s3;
  const s = C.site;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 6 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const v = okNow ? 'h1' : normT(ty.val);
  const lvl = !v ? 6 : /^h[1-6]$/.test(v) ? Number(v.charAt(1)) : 0;
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const t = normT(ty.val);
    const issue = t === 'h1' ? null : !t ? c.msgs.empty : /[<>/]/.test(t) ? c.msgs.brackets : /^h[2-6]$/.test(t) ? c.msgs.small : t === 'p' ? c.msgs.p : c.msgs.other;
    if (!issue) {
      const ft = st.current.misses === 0 && lad.asked.current === 0;
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true }); mark(ft);
      log({ screenId: 's3', type: 'review-h1', correct: true, firstTry: ft, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const closeName = okNow ? 'h1' : (v && /^[a-z0-9]+$/.test(v) ? v : 'h6');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={1} solved={okNow} ask={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.recipe)} url="osh.html" short><PageDoc blocks={[{ t: 'h', lvl, text: pick(s.recipe), hl: !okNow, k: 'h' }, { t: 'p', text: pick(s.recipeP), k: 'p' }]} /></Br>
            <KzCode lines={[okNow ? textLine('h', 'h1', pick(s.recipe), { cls: 'is-new' }) : codeLine('h', [
              <span key="l" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span></span>,
              <span key="g" className={'kz-gap z9-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="h6" label={c.ask} max={6} /></span>,
              <span key="r" className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>,
              W_(pick(s.recipe)), T_(closeName, true)], { cls: 'is-hl' }),
              textLine('p', 'p', pick(s.recipeP), { cls: 'z9-ctx' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. СТАНЦИЯ 3 · СПИСОК (выбор тега) — шаги рецепта идут по порядку, а список с точками. Ученик выбирает тег списка:
// ol — номера появились; ul — уже он; li — это пункт, а не весь список.
// =============================================================================
const S4_OPTS = ['ul', 'ol', 'li'];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(2);
  const c = C.s4;
  const s = C.site;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return;
    if (o === 'ol') {
      const ft = off.length === 0;
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true }); mark(ft);
      log({ screenId: 's4', type: 'review-ol', correct: true, firstTry: ft, attempts: off.length + 1 });
      sayNow(c.ok, 'cheer');
      return;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
  };
  const steps = pick(s.steps);
  const tag = okNow ? 'ol' : 'ul';
  const lines = [codeLine('lo', [T_(tag)], { cls: okNow ? 'is-new' : 'is-hl' })].concat(steps.map((x, j) => textLine('i' + j, 'li', x, { d: 1, cls: 'z9-ctx' })), [codeLine('lc', [T_(tag, true)], { cls: okNow ? 'is-new' : 'is-hl' })]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={2} solved={okNow} ask={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z9-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.recipe)} url="osh.html" short><PageDoc blocks={[{ t: 'h', lvl: 2, text: pick(s.stepsH), k: 'h' }, { t: 'list', ordered: okNow, items: steps.map((x) => ({ text: x, li: true })), hl: !okNow, k: 'l' }]} /></Br></div>
        </div>
        {!okNow ? (
          <div className="kz-pick z9-pick3">
            {S4_OPTS.map((o) => (
              <button key={o} type="button" data-o={o} disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                className={'kz-btn z9-tagbtn ' + (off.indexOf(o) >= 0 ? 'is-off' : 'is-ghost')}>
                <span translate="no">{'<' + o + '>'}</span><Led on={led && off.indexOf(o) < 0} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. СТАНЦИЯ 4 · ССЫЛКИ (найди строку) — в меню одно слово не нажимается: у его a нет href. Ученик нажимает
// эту строку — она чинится сама.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(3);
  const c = C.s5;
  const s = C.site;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || found, spoken);
  const lad = useKzLadder(!found);
  const led = useIdleLed(canTap && !found, off.length);
  const menu = pick(s.menu);
  const FILES = ['index.html', 'oyinlar.html', 'osh.html'];
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    if (j !== 1) { sfx('soft', true); setOff(off.concat(j)); setMsg(c.fine); sayNow(c.fine, 'think'); lad.bump(); return; }
    const ft = off.length === 0;
    sfx('win', true); setFound(true); setMsg(null); put({ done: true }); mark(ft);
    log({ screenId: 's5', type: 'review-href', correct: true, firstTry: ft, attempts: off.length + 1 });
    sayNow(c.ok, 'cheer');
  };
  const lines = menu.map((m, j) => Object.assign(linkLine('l' + j, m, j === 1 && !found ? null : FILES[j]), {
    cls: 'z9-hline' + (found && j === 1 ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0) || (lad.lv >= 2 && j === 1))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={3} solved={found} ask={found ? c.ok : c.ask} hint={found ? null : msg} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.title)} url="index.html" short><PageDoc blocks={[{ t: 'h', lvl: 1, text: pick(s.title), k: 'h' }, { t: 'links', items: menu.map((m, j) => ({ text: m, href: found || j !== 1 })), hl: !found, k: 'a' }]} /></Br>
            <KzCode lines={lines} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СТАНЦИЯ 5 · КАРТИНКА (Drag & Drop) — у img стёрлось имя атрибута файла: видно только alt. Перетащить src
// (не href и не alt).
// =============================================================================
const S6_OPTS = ['href', 'src', 'alt'];
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(4);
  const c = C.s6;
  const s = C.site;
  const [rec, put] = useRec('s6');
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
    if (o === 'src') {
      const ft = off.length === 0;
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true }); mark(ft);
      log({ screenId: 's6', type: 'review-src', correct: true, firstTry: ft, attempts: off.length + 1 });
      sayNow(c.ok, 'cheer');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const alt = pick(s.altCat);
  const line = okNow ? codeLine('i', elCode('img', [{ n: 'src', v: 'mushuk.jpg' }, { n: 'alt', v: alt }]), { cls: 'is-new' })
    : codeLine('i', [openTag('img'), <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z9-miss z9-att' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />,
      <span key="v" className="kz-tag" translate="no"><span className="kz-tk-b">=</span><span className="z9-val">"mushuk.jpg"</span></span>, attrSpan('alt', alt, 'al', true)], { cls: 'is-hl' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={4} solved={okNow} ask={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z9-s5">
          <div className="kz-col"><Br title={pick(s.gallery)} url="galereya.html" short><PageDoc blocks={[{ t: 'h', lvl: 1, text: pick(s.gallery), k: 'h' }, { t: 'img', src: okNow ? 'mushuk.jpg' : null, alt, hl: !okNow, cls: okNow ? 'z9-a-in' : '', k: 'i' }]} /></Br></div>
          <div className="kz-col"><KzCode lines={[textLine('h', 'h1', pick(s.gallery), { cls: 'z9-ctx' }), line]} cls="kz-code-sm" /></div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {S6_OPTS.map((o) => (
              <button key={o} type="button" data-o={o} disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, o); }}
                className={'kz-scrap kz-scrap-code' + (off.indexOf(o) >= 0 ? ' is-used' : '') + (off.length >= 2 && o === 'src' ? ' is-led' : '')}>
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
// S7. СТАНЦИЯ 6 · ПАРОЛЬ (Fill in the Blanks) — в поле пароля type пустой: пароль виден буквами. Ученик пишет
// значение type; честно: password — точки, text — буквы, незнакомое слово — обычное поле.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(5);
  const c = C.s7;
  const s = C.site;
  const [rec, put] = useRec('s7');
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
  const typed = okNow ? 'password' : normT(ty.val).replace(/["']/g, '');
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const t = normT(ty.val).replace(/["']/g, '');
    const issue = t === 'password' ? null : !t ? c.msgs.empty : t === 'text' ? c.msgs.text : t === 'number' ? c.msgs.number : c.msgs.typo;
    if (!issue) {
      const ft = st.current.misses === 0 && lad.asked.current === 0;
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true }); mark(ft);
      log({ screenId: 's7', type: 'review-password', correct: true, firstTry: ft, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const cap = pick(s.capPass);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={5} solved={okNow} ask={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(s.club)} url="klub.html" short><PageDoc blocks={[{ t: 'h', lvl: 1, text: pick(s.club), k: 'h' }, { t: 'field', cap, type: typed === 'password' ? 'password' : 'text', val: 'kodi2026', hl: !okNow, k: 'f' }]} /></Br>
            <KzCode lines={[okNow ? codeLine('f', [T_('label'), W_(cap), openTag('input', true), attrSpan('type', 'password', 't', true), T_('label', true)], { cls: 'is-new' })
              : codeLine('f', [T_('label'), W_(cap), openTag('input', true),
                <span key="t" className="kz-tag z9-att" translate="no"><span className="z9-attr">type</span><span className="kz-tk-b">=</span><span className="z9-val">"</span></span>,
                <span key="g" className={'kz-gap z9-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={12} /></span>,
                <span key="q" className="kz-tag" translate="no"><span className="z9-val">"</span><span className="kz-tk-b">{'>'}</span></span>, T_('label', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. СТАНЦИЯ 7 · ЧАСТИ АНКЕТЫ (Matching Pairs) — глитч перепутал названия: select / option / textarea / button ↔
// маленькие вещи на странице.
// =============================================================================
const S8_TAGS = ['select', 'option', 'textarea', 'button'];
const S8_CARDS = ['textarea', 'button', 'select', 'option'];
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(6);
  const c = C.s8;
  const s = C.site;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [paired, setPaired] = useState(solved ? S8_TAGS.slice() : []);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = paired.length === 4;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, paired.length * 10 + (sel ? 1 : 0));
  const lit = lad.lv >= 3;
  const nextT = S8_TAGS.find((t) => paired.indexOf(t) < 0);
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
    if (nx.length === 4) {
      const ft = st.current.misses === 0 && lad.asked.current === 0;
      put({ done: true }); mark(ft);
      log({ screenId: 's8', type: 'review-form-parts', correct: true, firstTry: ft, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  const games = pick(s.games);
  const pic = {
    select: <span className="z9-mini-sel">{games[0]}<i aria-hidden="true" /></span>,
    option: <span className="z9-mini-pop"><span>{games[1]}</span></span>,
    textarea: <span className="z9-mini-ta">{pick(s.hello)}</span>,
    button: <span className="z9-btn">{pick(s.send)}</span>
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={6} solved={done} ask={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/4'} />
        <div className="kz-scene z9-match">
          <div className="z9-match-col">
            {S8_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code z9-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{t}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z9-match-col">
            {S8_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z9-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="z9-mcard-f">{pic[k]}</span>
                  <span className="z9-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z9-mcard-tag" translate="no">{k}</span> : null}
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
// S9. СТАНЦИЯ 8 · ЧАСТИ САЙТА (выбор тега) — верх сайта обёрнут в head: в Инспекторе у верха нет рамки.
// Ученик выбирает тег: header (не head и не h1).
// =============================================================================
const S9_OPTS = ['head', 'header', 'h1'];
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const mark = useStation(7);
  const c = C.s9;
  const s = C.site;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return;
    if (o === 'header') {
      const ft = off.length === 0;
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true }); mark(ft);
      log({ screenId: 's9', type: 'review-header', correct: true, firstTry: ft, attempts: off.length + 1 });
      sayNow(c.ok, 'cheer');
      return;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
  };
  const top = okNow ? 'header' : 'head';
  const menu = pick(s.menu);
  const blocks = [{ t: 'region', tag: okNow ? 'header' : null, kids: [{ t: 'h', lvl: 1, text: pick(s.title) }, { t: 'links', items: menu.map((m) => ({ text: m, href: true })) }], k: 'hd', hl: okNow },
    { t: 'region', tag: 'main', kids: [{ t: 'h', lvl: 2, text: pick(s.stepsH) }, { t: 'p', text: pick(s.recipeP) }], k: 'mn' },
    { t: 'region', tag: 'footer', kids: [{ t: 'p', text: pick(s.foot) }], k: 'ft' }];
  const lines = [codeLine('ho', [T_(top)], { cls: okNow ? 'is-new' : 'is-hl' }), textLine('h1', 'h1', pick(s.title), { d: 1, cls: 'z9-ctx' }), codeLine('nv', [T_('nav'), W_('…'), T_('nav', true)], { d: 1, cls: 'z9-ctx' }),
    codeLine('hc', [T_(top, true)], { cls: okNow ? 'is-new' : 'is-hl' }), codeLine('mn', [T_('main'), W_('…'), T_('main', true)], { cls: 'z9-ctx' }), codeLine('ft', [T_('footer'), W_('…'), T_('footer', true)], { cls: 'z9-ctx' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationHead st={7} solved={okNow} ask={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z9-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(s.title)} url="index.html" short><PageDoc blocks={blocks} insp /></Br></div>
        </div>
        {!okNow ? (
          <div className="kz-pick z9-pick3">
            {S9_OPTS.map((o) => (
              <button key={o} type="button" data-o={o} disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                className={'kz-btn z9-tagbtn ' + (off.indexOf(o) >= 0 ? 'is-off' : 'is-ghost')}>
                <span translate="no">{'<' + o + '>'}</span><Led on={led && off.indexOf(o) < 0} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. СМЕШАННОЕ (Code Builder) — картинка-ссылка: <a href="galereya.html"> · <img src="mushuk.jpg" alt="…"> · </a>;
// лишний </img>. После сборки картинку можно нажать — откроется галерея.
// =============================================================================
const S10_ORDER = ['aopen', 'img', 'aclose'];
const S10_TRAY = ['aclose', 'imgc', 'img', 'aopen'];
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const s = C.site;
  const store = useStore();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S10_ORDER.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [opened, setOpened] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const alt = pick(s.altCat);
  const TXT = { aopen: '<a href="galereya.html">', img: '<img src="mushuk.jpg" alt="' + alt + '">', aclose: '</a>', imgc: '</img>' };
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const want = S10_ORDER[got.length];
    if (id !== want) {
      st.current.misses += 1;
      const m = id === 'imgc' ? c.why.imgc : c.why[want];
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 3) {
      put({ done: true }); store.set('ft9', st.current.misses === 0 && lad.asked.current === 0);
      log({ screenId: 's10', type: 'review-mix', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const nextOk = S10_ORDER[got.length];
  const depth = [0, 1, 0];
  const lines = [textLine('h', 'h1', pick(s.title), { cls: 'z9-ctx' })].concat([0, 1, 2].map((i) => (got[i]
    ? codeLine('g' + i, [<span key="b" className="z9-built z9-a-in kz-tk-n" translate="no">{TXT[got[i]]}</span>], { d: depth[i], cls: 'is-new' })
    : codeLine('g' + i, [<span key="d" data-place="code" className={'kz-dash kz-dash-sm z9-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />], { d: depth[i], cls: i === got.length ? 'is-hl' : '' }))));
  const hasImg = got.indexOf('img') >= 0;
  const blocks = opened ? [{ t: 'h', lvl: 1, text: pick(s.gallery), k: 'g' }, { t: 'p', text: pick(s.galleryP), k: 'gp' }]
    : [{ t: 'h', lvl: 1, text: pick(s.title), k: 'h' }].concat(hasImg ? [{ t: 'img', src: 'mushuk.jpg', alt, k: 'i', cls: 'z9-a-in' }] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <StationMap cur={8} all />
        <KzAsk text={done ? (opened ? c.askOpened : c.askTap) : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/3'} />
        <div className={'kz-scene z9-s5' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={opened ? pick(s.gallery) : pick(s.title)} url={opened ? 'galereya.html' : 'index.html'} short>
            <PageDoc blocks={blocks} onImgTap={done && !opened ? () => { sfx('tap', true); setOpened(true); } : null} key={opened ? 'g' : 'h'} />
          </Br></div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S10_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z9-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextOk ? ' is-led' : '')}
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
// S11. БОСС (Error Detective) — одна страница, пять поломок сразу: h6 вместо h1, картинка без src, пункт без li,
// ссылка без href, пароль с type text. Ученик нажимает строки с ошибками в любом порядке; найденная чинится сама.
// =============================================================================
const BOSS = ['h', 'img', 'li', 'a', 'pass'];
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const s = C.site;
  const store = useStore();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [fixed, setFixed] = useState(solved ? BOSS.slice() : []);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = fixed.length === BOSS.length;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, fixed.length * 10 + off.length);
  const is = (k) => fixed.indexOf(k) >= 0;
  const steps = pick(s.steps);
  const alt = pick(s.altOsh);
  const menu = pick(s.menu);
  // Строки кода: k — поломка или null (строка в порядке).
  const rows = [
    { k: 'h', parts: is('h') ? [T_('h1'), W_(pick(s.title)), T_('h1', true)] : [T_('h6'), W_(pick(s.title)), T_('h6', true)] },
    { k: null, parts: [T_('p'), W_(pick(s.hello)), T_('p', true)] },
    { k: 'img', parts: elCode('img', [{ n: is('img') ? 'src' : 'href', v: 'osh.jpg' }, { n: 'alt', v: alt }]) },
    { k: null, parts: [T_('ol')], tail: true },
    { k: null, parts: [T_('li'), W_(steps[0]), T_('li', true)], d: 1 },
    { k: 'li', parts: is('li') ? [T_('li'), W_(steps[1]), T_('li', true)] : [W_(steps[1])], d: 1 },
    { k: null, parts: [T_('ol', true)] },
    { k: 'a', parts: is('a') ? elCode('a', [{ n: 'href', v: 'oyinlar.html' }]).concat([W_(menu[1]), T_('a', true)]) : [T_('a'), W_(menu[1]), T_('a', true)] },
    { k: 'pass', parts: [T_('label'), W_(pick(s.capPass)), openTag('input', true), attrSpan('type', is('pass') ? 'password' : 'text', 't', true), T_('label', true)] }
  ];
  const tap = (j) => {
    if (!canTap || done || off.indexOf(j) >= 0) return;
    const r = rows[j];
    st.current.tries += 1;
    if (!r.k || is(r.k)) {
      st.current.misses += 1;
      sfx('soft', true); setOff(off.concat(j)); setMsg(c.fine); sayNow(c.fine, 'think');
      setTimeout(() => setOff((o) => o.filter((x) => x !== j)), 1600);
      if (st.current.misses >= 2) lad.bump();
      return;
    }
    sfx('win', true); setMsg(null);
    const nx = fixed.concat(r.k);
    setFixed(nx);
    if (nx.length === BOSS.length) {
      const ft = st.current.misses === 0 && lad.asked.current === 0;
      put({ done: true }); store.set('ftBoss', ft);
      log({ screenId: 's11', type: 'review-boss', correct: true, firstTry: ft, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.found[r.k], c.ok), 'cheer');
    } else sayNow(c.found[r.k], 'smile');
  };
  const nextBug = BOSS.find((k) => !is(k));
  const blocks = [{ t: 'h', lvl: is('h') ? 1 : 6, text: pick(s.title), k: 'h' }, { t: 'p', text: pick(s.hello), k: 'p' },
    { t: 'img', src: is('img') ? 'osh.jpg' : null, alt, k: 'i' },
    { t: 'list', ordered: true, items: [{ text: steps[0], li: true }, { text: steps[1], li: is('li') }], k: 'l' },
    { t: 'links', items: [{ text: menu[1], href: is('a') }], k: 'a' },
    { t: 'field', cap: pick(s.capPass), type: is('pass') ? 'password' : 'text', val: 'kodi2026', k: 'f' }];
  const hint = hintAt(lad.lv, c.hints);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hint)} err={!!msg} n={fixed.length + '/' + BOSS.length} />
        <div className="kz-scene z9-s5 z9-boss">
          <div className="kz-col"><Br title={pick(s.title)} url="index.html" cls={done ? '' : 'z9-broken-br'}><PageDoc blocks={blocks} /></Br></div>
          <div className="kz-col">
            <KzCode lines={rows.map((r, j) => ({
              k: 'r' + j + (r.k && is(r.k) ? 'f' : ''), d: r.d || 0, parts: r.parts,
              cls: 'z9-hline' + (r.k && is(r.k) ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: done ? null : () => tap(j), disabled: !canTap || done || off.indexOf(j) >= 0,
              led: !done && ((led && fixed.length === 0 && off.length === 0 && j === 0) || (lad.lv >= 3 && r.k === nextBug))
            }))} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q1. БЫСТРЫЙ РАУНД (True / False) — пять утверждений вперемешку по всему курсу.
// =============================================================================
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
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
      log({ screenId: 'q1', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: 0, depth: 0 });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); setMsg(null); sayNow(c.items[ii + 1].t, 'curious'); }, reduceMotion() ? 300 : 900);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = (v) => (
    <button key={String(v)} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)}
      className={'kz-btn z9-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z9-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z9-card z9-tf-card kz-a-drop">
              <span className="z9-card-h">{pick(c.card)} · {pick(C.stations[it.st])}</span>
              <p className="z9-tf-t">{pick(it.t)}</p>
            </div>
            <div className="kz-pick z9-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ВЫВОД — разгадка (переписывать всё не нужно: хватило маленьких правок), починенный сайт, все 8 станций горят,
// умения курса по одному, дальше — CSS.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const s = C.site;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z9-sheet">
        <StationMap cur={8} all />
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={pick(s.title)} url="index.html"><PageDoc blocks={fixedHome(pick)} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className={'z9-cert' + (curK === 'cert' ? ' is-on' : '')}>
              <span className="z9-cert-h">{pick(c.certH)}</span>
              <span className="z9-cert-t">{pick(c.certT)}</span>
              <span className="z9-cert-tags" translate="no">{STATIONS.map((t) => <i key={t}>{t}</i>)}</span>
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
  { id: 's2', code: 'REVIEW-1', Comp: S2 }, { id: 's3', code: 'REVIEW-2', Comp: S3 }, { id: 's4', code: 'REVIEW-3', Comp: S4 },
  { id: 's5', code: 'REVIEW-4', Comp: S5 }, { id: 's6', code: 'REVIEW-5', Comp: S6 }, { id: 's7', code: 'REVIEW-6', Comp: S7 },
  { id: 's8', code: 'REVIEW-7', Comp: S8 }, { id: 's9', code: 'REVIEW-8', Comp: S9 },
  { id: 's10', code: 'MIX', Comp: S10 }, { id: 's11', code: 'BOSS', Comp: S11 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 's12', code: 'ACHIEVEMENT', Comp: S12 }
];
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], q1: ['q1'] };

// Итог для платформы — какие темы курса ученик починил с первой попытки (повторение: что стоит повторить).
function lesson9Artifact(store) {
  const topics = STATIONS.map((t, i) => ({ topic: t, lesson: i + 1, firstTry: store.get('ft' + i) }));
  if (!topics.some((x) => x.firstTry !== undefined && x.firstTry !== null)) return null;
  return { type: 'course-review', topics, mix: store.get('ft9'), boss: store.get('ftBoss') };
}

export default function HtmlYakuniy({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson9Artifact(store) })
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
