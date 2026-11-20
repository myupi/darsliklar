// =============================================================================
// ЭКРАНЫ УРОКА 2 МОДУЛЯ BOOTSTRAP «Цвета и кнопки» (облик «Редактор», 20.11.2026). Набор — bs2-kit.jsx (основа —
// урок 1), похожий сайт — bs2-site.jsx. Страница в окне Chrome честная: настоящий bootstrap.min.css 6.0.0-alpha.1,
// class пишется как набран. Показы с сайтом — «как на видео»: курсор (tools/mysh) делает в окнах браузера то, что
// делает человек; Коди рассказывает каждый шаг. Сценарий — docs/scenarij-bootstrap-02-cveta-i-knopki.md.
// =============================================================================
const SWATCH = { primary: '#0a84ff', accent: '#7c3aed', success: '#16a34a', danger: '#e11d48', warning: '#fbbf24', info: '#0ea5e9', inverse: '#111827', secondary: '#d1d5db' };
const btnHtml = (cls, text) => '<button type="button"' + clsA(cls) + '>' + escH(text) + '</button>';
const BTN_WANT_T1 = 8 + BS_THEMES.indexOf('success');   // строка «btn-outline theme-success» в Variants
const shapeOf = (cls) => (/btn-outline/.test(cls) ? 'btn-outline' : /btn-solid/.test(cls) ? 'btn-solid' : null);
const colorOf = (cls) => { const m = /theme-([a-z]+)/.exec(cls || ''); return m ? m[1] : null; };
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');

// ── Проверка слова в class. kind: theme | fg | bg | shape; want — ответ (null — подходит любое верное слово).
// Возвращает { k, w } — ключ причины (C.fill.msgs) и слово для неё, или null.
const NATIVE_RE = /^(qizil|yashil|sariq|kok|binafsha|qora|kulrang|havorang|oq|pushti|red|green|yellow|blue|purple|violet|black|gr[ae]y|orange|pink|white|lightblue)$/;
// «Умные» кавычки, апостроф, «;» и точка в конце — не ошибка (как в уроках CSS).
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"'`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
function clsIssue(raw, kind, want) {
  const v = normCls(raw);
  if (!v) return { k: 'empty' };
  if (v[0] === '.') return { k: 'dot' };   // привычка из CSS: .theme-danger
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (/\s/.test(v)) return { k: 'one' };
  if (kind === 'shape') {
    if (/^btn-(primary|secondary|success|danger|warning|info|light|dark|accent|inverse)$/.test(v)) return { k: 'v5' };
    if (want ? v === want : (v === 'btn-solid' || v === 'btn-outline')) return null;
    if (v === 'btn-solid' || v === 'btn-outline') return { k: 'otherShape' };
    if (/^(solid|outline)$/.test(v)) return { k: 'noPrefix', w: 'btn-' + v };
    if (/^(theme|fg|bg)-/.test(v) || BS_THEMES.indexOf(v) >= 0) return { k: 'isColor' };
    return { k: 'noShape', w: v };
  }
  const pre = { theme: 'theme-', fg: 'fg-', bg: 'bg-' }[kind];
  if (NATIVE_RE.test(v.replace(/^(theme|fg|bg)-/, ''))) return /^(theme|fg|bg)-/.test(v) ? { k: 'noColor', w: v } : { k: 'native' };
  if (/^(btn|text|alert)-[a-z]+$/.test(v) && v !== 'btn-solid' && v !== 'btn-outline') return { k: 'v5' };
  if (v === 'btn-solid' || v === 'btn-outline') return { k: 'isShape' };
  if (BS_THEMES.indexOf(v) >= 0) return { k: 'noPrefix', w: pre + v };
  const m = /^(theme|fg|bg)-([a-z]+)$/.exec(v);
  if (!m) return { k: 'noColor', w: v };
  if (m[1] + '-' !== pre) return { k: 'fam_' + kind, w: v };
  if (BS_THEMES.indexOf(m[2]) < 0) return { k: 'noColor', w: v };
  if (want && v !== want) return { k: 'other' };
  return null;
}
const issueText = (c, is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);

// Ход заданий раундами: ступени подсказки с нуля на каждом раунде, похвала → следующий раунд, когда Коди договорил.
function useRounds(n, solved) {
  const [ii, setIi] = useState(solved ? n - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [next, setNext] = useState(false);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, misses: 0 });
  const rm = useRef(0);   // промахи в этом раунде: вторая ошибка подряд открывает следующую ступень подсказки
  const advance = (spoken) => { if (next && spoken) { setNext(false); setIi((x) => x + 1); setOk(false); rm.current = 0; const a = lad.asked.current; lad.reset(); lad.asked.current = a; } };
  return { ii, setIi, ok, setOk, next, setNext, lad, st, rm, advance, last: ii === n - 1, done: ok && ii === n - 1 };
}
function useRoundNext(R, spoken) {
  useEffect(() => {
    if (!R.next || !spoken) return undefined;
    const t = setTimeout(() => R.advance(true), reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [R.next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
}

// =============================================================================
// S1. КРЮЧОК — серая кнопка «Ro'yxatdan o'tish», её никто не замечает (Yozildi: 0). «Bootstrap bilan» — у кнопки два слова
// class, она зелёная; счётчик растёт. Загадка: «у каждой вещи свои слова цвета — всё надо зубрить».
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [cnt, setCnt] = useState(solved ? 12 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  useEffect(() => {
    if (!on || cnt >= 12) return undefined;
    const t = setTimeout(() => setCnt((x) => x + 1), cnt === 0 ? 700 : 140);
    return () => clearTimeout(t);
  }, [on, cnt]);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.done, 'smile');
  };
  const cls = on ? 'btn-solid theme-success' : null;
  const lines = [hl('h', 0, '<h1>' + pick(C.site.h1) + '</h1>'), hl('p', 0, '<p>' + pick(C.site.when) + '</p>'),
    hl('b', 0, '<button type="button"' + (on ? ' class="btn-solid theme-success"' : '') + '>' + pick(C.site.btn) + '</button>', { cls: on ? 'is-new is-read' : 'is-hl' })];
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <SitePage pick={pick} o={{ p: '', btns: [{ cls }] }}>
              <span className={'b2-count' + (on ? ' is-on' : '')}><Icon name="star" size={14} />{pick(c.count)}: <b>{cnt}</b></span>
            </SitePage>
          </div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. КНОПКА = СТИЛЬ + ЦВЕТ (показ) — голая кнопка → btn-solid (серая кнопка Bootstrap) → theme-success → theme-danger →
// theme-primary. Метки «uslub» и «rang» под строкой загораются вместе со словом.
// =============================================================================
const S2_CLS = [null, 'btn-solid', 'btn-solid theme-success', 'btn-solid theme-danger', 'btn-solid theme-primary'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 4 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayShape, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayColor, pose: 'wonder' }] },
    { act: () => { sfx('pop', true); setN(3); }, wait: 1300 },
    { act: () => { sfx('pop', true); setN(4); }, wait: 1100 },
    { say: [{ text: c.sayMore, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : n >= 2 ? c.askColor : n === 1 ? c.askShape : c.askStart;
  const help = useShowHelp(c.help);
  const cls = S2_CLS[n];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={[hl('b' + n, 0, btnHtml(cls, pick(C.site.btn)), { cls: n > 0 ? 'is-new is-read' : '' })]} cls="kz-code-sm" />
            <div className="b2-parts">
              <span className={'b2-part' + (n >= 1 ? ' is-on' : '')} style={{ '--c': '#0FA38E' }}><b translate="no">btn-solid</b>{pick(c.shapeL)}</span>
              <span className={'b2-part' + (n >= 2 ? ' is-on' : '')} style={{ '--c': SWATCH[colorOf(cls) || 'success'] }}><b translate="no">{colorOf(cls) ? 'theme-' + colorOf(cls) : 'theme-…'}</b>{pick(c.colorL)}</span>
            </div>
          </div>
          <div className="kz-col"><SitePage pick={pick} o={{ p: '', btns: [{ cls }] }} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// X1. ОПЫТ «ПУЛЬТ» — 2 стиля и 8 цветов; кнопка на странице и строка кода меняются сразу. Новый цвет — Коди коротко
// называет его смысл. Готово — оба стиля и три цвета.
// =============================================================================
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [shape, setShape] = useState('btn-solid');
  const [color, setColor] = useState(solved ? 'success' : null);
  const [shapes, setShapes] = useState(solved ? ['btn-solid', 'btn-outline'] : ['btn-solid']);
  const [colors, setColors] = useState(solved ? ['success', 'danger', 'primary'] : []);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, shapes.length * 10 + colors.length);
  const check = (sh, co) => {
    if (sh.length >= 2 && co.length >= 3 && !ok) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer'); say(c.done, 'smile');
      return true;
    }
    return false;
  };
  const tapShape = (s) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true); setShape(s);
    const sh = shapes.indexOf(s) >= 0 ? shapes : shapes.concat(s);
    setShapes(sh);
    if (!check(sh, colors) && !ok && s !== shape) sayNow(s === 'btn-outline' ? c.outline : c.solid, 'point');
  };
  const tapColor = (t) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true); setColor(t);
    const fresh = colors.indexOf(t) < 0;
    const co = fresh ? colors.concat(t) : colors;
    setColors(co);
    if (!check(shapes, co) && !ok && fresh) sayNow(c.mean[t], 'point');
    if (st.current.tries >= 8 && !ok) lad.bump();
  };
  const cls = shape + (color ? ' theme-' + color : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} />
        <div className="kz-scene b1-pair b2-x1">
          <div className="kz-col"><KzCode lines={[hl('b' + cls, 0, btnHtml(cls, pick(C.site.btn)), { cls: 'is-new' })]} cls="kz-code-sm b2-x1-code" /></div>
          <div className="kz-col"><SitePage pick={pick} o={{ p: '', btns: [{ cls }] }} /></div>
        </div>
        <div className="b2-pult">
          <div className="b2-pult-row">
            <span className="b2-pult-h">{pick(c.shapeH)} <i>{Math.min(2, shapes.length)}/2</i></span>
            {['btn-solid', 'btn-outline'].map((s) => (
              <button key={s} type="button" className={'b2-chip is-shape' + (shape === s ? ' is-on' : '') + (shapes.indexOf(s) >= 0 ? ' is-seen' : '')} onClick={() => tapShape(s)} disabled={!canTap} data-shape={s}>
                <i className={s === 'btn-outline' ? 'is-out' : ''} aria-hidden="true" /><span translate="no">{s}</span><Led on={led && !ok && shapes.indexOf(s) < 0} />
              </button>
            ))}
          </div>
          <div className="b2-pult-row">
            <span className="b2-pult-h">{pick(c.colorH)} <i>{Math.min(3, colors.length)}/3</i></span>
            <div className="b2-colors">
              {BS_THEMES.map((t) => (
                <button key={t} type="button" className={'b2-chip' + (color === t ? ' is-on' : '') + (colors.indexOf(t) >= 0 ? ' is-seen' : '')} onClick={() => tapColor(t)} disabled={!canTap} data-color={t}>
                  <i style={{ background: SWATCH[t] }} aria-hidden="true" /><span translate="no">{t}</span><Led on={led && !ok && colors.length < 3 && colors.indexOf(t) < 0 && t === BS_THEMES[colors.length * 2]} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// R1. ЧИТАЕМ КОД — строка с class → на странице четыре кнопки, нажать ту, что нарисует эта строка (3 раунда).
// Промах — какая часть не совпала: стиль, цвет или обе.
// =============================================================================
const R1_ROUNDS = [
  { want: 'btn-outline theme-danger', opts: ['btn-solid theme-danger', 'btn-outline theme-primary', 'btn-outline theme-danger', 'btn-solid theme-warning'] },
  { want: 'btn-solid theme-warning', opts: ['btn-solid theme-warning', 'btn-outline theme-warning', 'btn-solid theme-success', 'btn-outline theme-danger'] },
  { want: 'btn-solid theme-accent', opts: ['btn-solid theme-primary', 'btn-outline theme-accent', 'btn-solid theme-info', 'btn-solid theme-accent'] }
];
function R1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.r1;
  const [rec, put] = useRec('r1');
  const solved = !!(rec && rec.done);
  const R = useRounds(R1_ROUNDS.length, solved);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  const RR = R1_ROUNDS[R.ii];
  const [msg, setMsg] = useState(null);
  useEffect(() => setMsg(null), [R.ii]);
  const led = useIdleLed(canTap && !R.ok, R.ii);
  const choose = (v) => {
    if (!canTap || R.ok) return;
    R.st.current.tries += 1;
    if (v !== RR.want) {
      R.st.current.misses += 1; sfx('soft', true);
      const m = shapeOf(v) !== shapeOf(RR.want) && colorOf(v) !== colorOf(RR.want) ? c.both : shapeOf(v) !== shapeOf(RR.want) ? c.shape : c.color;
      const t = R.lad.lv > 0 ? joinL(m, hintAt(R.lad.lv, c.hints)) : m;
      setMsg(t); sayNow(t, 'think'); R.rm.current += 1; if (R.rm.current >= 2) R.lad.bump();
      return;
    }
    sfx('ok', true); R.setOk(true); setMsg(null);
    if (R.last) {
      put({ done: true });
      log({ screenId: 'r1', type: 'read-class', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: R.lad.asked.current, depth: R.lad.lv });
      sayNow(joinL(c.right, c.done), 'cheer');
    } else { sayNow(c.right, 'smile'); R.setNext(true); }
  };
  const btns = RR.opts.map((o, j) => ({ cls: R.ok && o !== RR.want ? o + ' b2-dim' : o, text: pick(c.btnT), v: o }));
  const html = '<style>.b2-dim{opacity:.35}</style>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, R.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : (msg || hintAt(R.lad.lv, c.hints))} err={!!msg} n={(R.ii + 1) + '/' + R1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-r1" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={[hl('b', 0, btnHtml(RR.want, pick(c.btnT)), { cls: 'is-hl' })]} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <Br title={pick(C.site.title)} short cls="b2-pickpage">
              <BsFrame body={html + siteHtml2(pick, { h1: false, btns })} bs dep={R.ii + String(R.ok)} onPick={choose} />
            </Br>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// G1. СТРАНИЦА BUTTON (показ «как на видео») — со страницы Alert: меню (на телефоне ☰) → Components → Button → Variants:
// пример (ряд с заливкой и ряд с рамкой) и строки кода; строка «btn-solid theme-success» загорается.
// =============================================================================
function G1({ p }) {
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const [page, setPage] = useState(solved ? 'Button' : 'Alert');
  const [open, setOpen] = useState('comp');
  const [menuView, setMenuView] = useState(false);
  const [H, setH] = useState(null);
  const [scroll, setScroll] = useState(solved ? 'variants' : null);
  const [exHl, setExHl] = useState(null);
  const [mark, setMark] = useState(solved ? { variants: [2, 10] } : null);
  const [n, setN] = useState(solved ? 4 : 0);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { setN(1); if (burger()) M.go('[data-x="burger"]', 0.5, 0.5, { hand: true }); }, wait: M.slow },
    { act: () => { if (burger()) { M.click(); setMenuView(true); } }, wait: 450 },
    { act: () => M.go('.bd-item[data-item="Button"]', 0.3, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); setPage('Button'); setMenuView(false); setN(2); }, wait: 600 },
    { act: () => M.hide() },
    { say: [{ text: c.sayPage, pose: 'point' }] },
    { act: () => { setScroll('sec:variants'); setH('variants'); setExHl('variants'); setN(3); }, wait: 700 },
    { say: [{ text: c.sayVariants, pose: 'point' }] },
    { act: () => { setH(null); setExHl(null); setScroll('variants'); setMark({ variants: [2] }); }, wait: 500 },
    { act: () => M.go('.bd-code[data-code="variants"] [data-ln="2"]', 0.6, 0.5), wait: M.slow },
    { say: [{ text: c.sayLine, pose: 'wonder' }] },
    { act: () => { setMark({ variants: [2, 10] }); M.go('.bd-code[data-code="variants"] [data-ln="10"]', 0.6, 0.5); setN(4); }, wait: M.slow },
    { say: [{ text: c.sayOutline, pose: 'point' }] },
    { act: () => M.hide() },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askVariants, c.askLine][n];
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className="kz-scene kz-scene-col ms-root">
          <div className="kz-col">
            <DocsBr page={page} cls="b1-web"><BsDocs page={page} open={open} hl={H} navOff copyOff menuView={menuView} exHl={exHl} mark={mark} scrollTo={scroll} scrollKey={String(n)} /></DocsBr>
          </div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. БЕРЁМ ОДНУ СТРОКУ (показ «как на видео») — курсор выделяет строку «btn-solid theme-success» на сайте, Ctrl+C →
// строка в body → текст «Success» выделяется и меняется на свой → btn-success (имя версии 5): кнопка стала обычной → назад.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const [sel, setSel] = useState(solved ? 2 : null);
  const [n, setN] = useState(solved ? 5 : 0);   // 1 — выделено; 2 — вставлено; 3 — свой текст; 4 — btn-success; 5 — назад
  const [tsel, setTsel] = useState(false);
  const [view, setView] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const LN = '.bd-code[data-code="variants"] [data-ln="2"]';
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => M.go(LN, 0.02, 0.55), wait: M.slow },
    { act: () => { M.hold(true); setSel(2); setN(1); M.go(LN, 0.97, 0.55); }, wait: 900 },
    { act: () => { M.hold(false); M.card({ t: 'Ctrl + C' }); sfx('pop', true); }, wait: 900 },
    { act: () => M.card(null) },
    { say: [{ text: c.sayCopy, pose: 'point' }] },
    { act: () => { M.hide(); sfx('ok', true); setN(2); setView(true); }, wait: 700 },
    { say: [{ text: c.sayPaste, pose: 'wonder' }] },
    { act: () => setTsel(true), wait: 1000 },
    { act: () => { setTsel(false); sfx('pop', true); setN(3); }, wait: 600 },
    { say: [{ text: c.sayText, pose: 'point' }] },
    { act: () => { sfx('soft', true); setN(4); }, wait: 900 },
    { say: [{ text: c.sayOld, pose: 'think' }] },
    { act: () => { sfx('ok', true); setN(5); }, wait: 800 },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askCopy, c.askPaste, c.askText, c.askOld, c.askBack][n];
  const help = useShowHelp(c.help);
  const cls = n === 4 ? 'btn-success' : 'btn-solid theme-success';
  const text = n >= 3 ? pick(C.site.btn) : 'Success';
  const bodyL = [hl('h', 1, '<h1>' + pick(C.site.h1) + '</h1>'), hl('p', 1, '<p>' + pick(C.site.when) + '</p>')]
    .concat(n >= 2 ? [hl('b' + n, 1, btnHtml(cls, text), { cls: (tsel ? 'is-sel ' : '') + (n === 2 || n === 4 || n === 5 ? 'is-new is-read' : n === 3 ? 'is-new' : '') })] : [quietSlot('slot', 1, pick, n === 1)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page="Button"><BsDocs page="Button" only="variants" copyOff scrollTo="variants" lines={{ variants: { sel } }} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, [linkL('lk', 1, { cls: 'b2-cut' })], bodyL)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} o={{ p: '', btns: n >= 2 ? [{ cls, text }] : [] }} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// T1. ВОЗЬМИ КНОПКУ САМ — образец «зелёная кнопка с рамкой»; найти в меню Button, нажать нужную строку в Variants
// (выделить и скопировать), нажать пустое место в body. Не та строка — что не совпало; не та страница — она честно открывается.
// =============================================================================
function T1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t1;
  const [rec, put] = useRec('t1');
  const solved = !!(rec && rec.done);
  const [page, setPage] = useState(solved ? 'Button' : 'Install');
  const [open, setOpen] = useState(solved ? 'comp' : 'start');
  const [menuView, setMenuView] = useState(false);
  const [clip, setClip] = useState(solved ? BTN_WANT_T1 : null);
  const [tried, setTried] = useState(null);
  const [pasted, setPasted] = useState(solved);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!pasted);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || pasted, spoken);
  const lv = lad.lv;
  const led = useIdleLed(canTap && !pasted, (page === 'Button' ? 1 : 0) + (clip != null ? 2 : 0));
  const miss = (m) => { st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); };
  const nav = (it) => {
    if (!canTap || pasted) return;
    setPage(it); setMenuView(false);
    if (it !== 'Button') { miss(fillL(c.msgs.wrongPage, { w: it })); return; }
    sfx('ok', true); setMsg(null);
  };
  const onLine = (i) => {
    if (!canTap || pasted) return;
    st.current.tries += 1;
    setTried(i);
    if (i !== BTN_WANT_T1) {
      const v = lineOf('variants', i);
      const sh = shapeOf(v) === 'btn-outline', co = colorOf(v) === 'success';
      miss(sh ? c.msgs.color : co ? c.msgs.shape : c.msgs.both);
      return;
    }
    sfx('pop', true); setClip(i); setMsg(c.copied);
  };
  const paste = () => {
    if (!canTap || pasted) return;
    if (clip == null) { miss(c.msgs.noClip); return; }
    sfx('win', true); setPasted(true); setMsg(null); put({ done: true });
    log({ screenId: 't1', type: 'find-copy-line', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const onBtn = page === 'Button';
  const lit = pasted ? null : !onBtn ? (lv >= 2 ? (open === 'comp' ? 'item:Button' : 'grp:comp') : null) : null;
  const bodyL = [hl('h', 1, '<h1>' + pick(C.site.h1) + '</h1>')].concat(pasted ? [hl('b', 1, lineOf('variants', BTN_WANT_T1), { cls: 'is-new' })]
    : [slotLine('slot', 1, pick, paste, clip != null && (led || lv >= 3), !canTap)]);
  const hintNow = pasted ? null : (msg || hintAt(lv, c.hints));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={pasted ? c.ok : onBtn ? c.ask : c.askFind} hint={hintNow} err={!!msg && msg !== c.copied} />
        {!pasted ? <Goal pick={pick} html={btnHtml('btn-outline theme-success', 'Success')} /> : null}
        <div className={docsPhoneCls({ clip: clip != null, nav: clip == null, done: pasted })}>
          {!pasted ? <div className="kz-col b1-tri-docs"><DocsBr page={page}><BsDocs page={page} open={open} onOpen={(x) => canTap && setOpen(x)} onNav={nav} navOff={!canTap} copyOff lit={lit} menuView={menuView} onMenu={() => setMenuView((x) => !x)} scrollTo={onBtn ? 'variants' : null} scrollKey={page}
            lines={{ variants: { onLine, sel: clip != null ? clip : tried, lineLed: lv >= 3 ? BTN_WANT_T1 : null, lineOff: !canTap } }} /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, [linkL('lk', 1)], bodyL)} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} o={{ btns: pasted ? [{ cls: 'btn-outline theme-success', text: 'Success' }] : [] }} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ЗАДАНИЕ С ПОЛЕМ В CLASS (t2, t3, t4, t5) — раунды: строка кода с полем на месте слова, страница меняется при наборе
// (честно: что набрано, то и в class), образец «Kerak» (или объявление на странице), справка — раздел сайта.
// «Tekshirish» или Enter. Промах — своя причина (clsIssue).
// round: { kind, want, line(field) → строки кода, page(v) → o для SitePage, goal → html образца, ask, hints, why }
// =============================================================================
function FillRounds({ p, id, c, rounds, docs, type }) {
  const pick = usePick();
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const R = useRounds(rounds.length, solved);
  const RR = rounds[R.ii];
  const [val, setVal] = useState(solved ? RR.want : '');
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => { if (!solved || R.ii) { setVal(R.ok ? RR.want : ''); setMsg(null); } }, [R.ii]); // eslint-disable-line react-hooks/exhaustive-deps
  const led = useIdleLed(canTap && !R.ok && !val, R.ii);
  const check = () => {
    if (!canTap || R.ok) return;
    R.st.current.tries += 1;
    const is = clsIssue(val, RR.kind, RR.want);
    if (is) {
      R.st.current.misses += 1; R.rm.current += 1; sfx('soft', true);
      const m = issueText(c, is);
      const t = R.rm.current >= 2 && R.lad.lv > 0 ? joinL(m, hintAt(R.lad.lv, RR.hints)) : m;
      setMsg(t); sayNow(t, 'think'); if (R.rm.current >= 2) R.lad.bump();
      return;
    }
    sfx('ok', true); R.setOk(true); setMsg(null); setVal(RR.want);
    const line = joinL(C.fill.right, RR.why);
    if (R.last) {
      put({ done: true });
      log({ screenId: id, type: type, correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: R.lad.asked.current, depth: R.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const v = normCls(val);
  const field = R.ok ? <span key="f" className="b1-st b2-done">{RR.want}</span>
    : <span key="f" className={'kz-gap b1-slotin b2-field' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { setVal(x); setMsg(null); }} onEnter={check} placeholder={RR.ph || L3('…', '…', '…')} label={RR.ask} max={24} /></span>;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, R.lad.lv + 1), RR.hints) || RR.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={R.done ? c.done : RR.ask} hint={R.ok ? null : (msg || hintAt(R.lad.lv, RR.hints))} err={!!msg} n={rounds.length > 1 ? (R.ii + 1) + '/' + rounds.length : null} />
        <div className={docs ? docsPhoneCls({ ref: true, done: R.done }) : 'kz-scene b1-pair'} key={'r' + R.ii}>
          {docs && !R.done ? <div className="kz-col b1-tri-docs"><DocsBr page={docs.page}><BsDocs page={docs.page} only={docs.only} copyOff /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code">
            {RR.goal ? <Goal pick={pick} html={RR.goal} zoom={RR.gz} /> : null}
            <KzCode lines={RR.line(field)} cls="kz-code-sm" />
          </div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} o={RR.page(R.ok ? RR.want : v)} /></div>
        </div>
        {!R.done ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap || R.ok || !v} onClick={check}>{pick(UI.check)}<Led on={canTap && !R.ok && !!v && led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}
const lineCls = (k, d, o, extra) => ({ k, d, cls: 'b1-line is-hl' + (extra ? ' ' + extra : ''), parts: clsParts(o) });

// T2 — кнопку по образцу: цвет, стиль, снова цвет.
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const T = pick(C.site.more);
  const btnLineF = (before, after) => (f) => [lineCls('b', 0, { tag: 'button', attrs: [['type', 'button']], before, field: f, after, text: T, close: true })];
  const rounds = [
    { kind: 'theme', want: 'theme-danger', line: btnLineF('btn-outline', null), page: (v) => ({ h1: false, btns: [{ cls: 'btn-outline ' + v, text: T }] }), goal: btnHtml('btn-outline theme-danger', T), ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('theme-…', 'theme-…', 'theme-…') },
    { kind: 'shape', want: 'btn-solid', line: btnLineF(null, 'theme-danger'), page: (v) => ({ h1: false, btns: [{ cls: v + ' theme-danger', text: T }] }), goal: btnHtml('btn-solid theme-danger', T), ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('btn-…', 'btn-…', 'btn-…') },
    { kind: 'theme', want: 'theme-primary', line: btnLineF('btn-solid', null), page: (v) => ({ h1: false, btns: [{ cls: 'btn-solid ' + v, text: T }] }), goal: btnHtml('btn-solid theme-primary', T), ask: c.ask3, hints: c.hints3, why: c.why3, ph: L3('theme-…', 'theme-…', 'theme-…') }
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} docs={{ page: 'Button', only: 'variants' }} type="button-by-sample" />;
}

// =============================================================================
// S8. ОДНО СЛОВО ВЕЗДЕ (показ) — у объявления и у кнопки одно слово theme-success; меняем у объявления на theme-warning,
// потом у кнопки — оба жёлтые. Слово цвета одно для всех вещей Bootstrap.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);   // 1 — слова загорелись; 2 — у объявления warning; 3 — у кнопки
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayBoth, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); }, wait: 1100 },
    { say: [{ text: c.sayAlert, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(3); }, wait: 1100 },
    { say: [{ text: c.sayButton, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askButton : n === 2 ? c.askAlert : n === 1 ? c.askBoth : c.askStart;
  const help = useShowHelp(c.help);
  const aCls = 'alert ' + (n >= 2 ? 'theme-warning' : 'theme-success');
  const bCls = 'btn-solid ' + (n >= 3 ? 'theme-warning' : 'theme-success');
  const w = (s) => (n >= 1 ? { word: s.indexOf('theme-warning') >= 0 ? 'theme-warning' : 'theme-success' } : null);
  const aSrc = '<div class="' + aCls + '" role="alert">', bSrc = btnHtml(bCls, pick(C.site.btn));
  const lines = [Object.assign(hl('a' + n, 0, aSrc, { cls: n === 2 ? 'is-new is-read' : '' }), { parts: hParts(aSrc, w(aSrc)) }), hl('ap', 1, '<p>' + pick(C.site.notice) + '</p>'), hl('ac', 0, '</div>'),
    Object.assign(hl('b' + n, 0, bSrc, { cls: n === 3 ? 'is-new is-read' : '' }), { parts: hParts(bSrc, w(bSrc)) })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col"><SitePage pick={pick} o={{ h1: false, alert: aCls, btns: [{ cls: bCls }] }} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// T3 — кнопка в цвет объявления: слово — в коде объявления.
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const B = pick(C.site.btn);
  const rounds = [{
    kind: 'theme', want: 'theme-accent', ask: c.ask, hints: c.hints, why: c.why, ph: L3('theme-…', 'theme-…', 'theme-…'),
    line: (f) => [hl('a', 0, '<div class="alert theme-accent" role="alert">', { cls: 'b2-lit' }), hl('ap', 1, '<p>' + pick(C.site.notice) + '</p>'), hl('ac', 0, '</div>'),
      lineCls('b', 0, { tag: 'button', attrs: [['type', 'button']], before: 'btn-solid', field: f, text: B, close: true })],
    page: (v) => ({ h1: false, alert: 'alert theme-accent', btns: [{ cls: 'btn-solid ' + v }] })
  }];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} type="match-alert" />;
}

// =============================================================================
// S10 / S12. ЦВЕТ ТЕКСТА И ФОН (показы «как на видео») — меню (☰) → Utilities → Colors (или Background) → курсор двойным
// щелчком выделяет слово в строке кода на сайте, Ctrl+C → слово встаёт в class у h1 (или у p) → страница меняется.
// =============================================================================
function UtilShow({ p, id, c, from, to, block, ln, word, tag }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const [page, setPage] = useState(solved ? to : from);
  const [open, setOpen] = useState(solved ? 'util' : from === 'Button' ? 'comp' : 'util');
  const [menuView, setMenuView] = useState(false);
  const [peek, setPeek] = useState(null);
  const [scroll, setScroll] = useState(solved ? block : null);
  const [wsel, setWsel] = useState(solved ? { i: ln, w: word } : null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 — меню; 2 — страница; 3 — слово выделено; 4 — в class
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const LN = '.bd-code[data-code="' + block + '"] [data-ln="' + ln + '"]';
  const steps = [
    { act: () => { setN(1); if (burger()) M.go('[data-x="burger"]', 0.5, 0.5, { hand: true }); }, wait: M.slow },
    { act: () => { if (burger()) { M.click(); setMenuView(true); } setPeek('util'); }, wait: 450 }
  ].concat(from !== 'Button' ? [] : [
    { act: () => M.go('.bd-grp-h[data-g="util"]', 0.35, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); setOpen('util'); }, wait: 400 }
  ], [
    { act: () => M.go('.bd-item[data-item="' + to + '"]', 0.3, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); setPage(to); setMenuView(false); setN(2); setScroll('sec:' + block); }, wait: 700 },
    { act: () => M.hide() },
    { say: [{ text: c.sayPage, pose: 'point' }] },
    { act: () => setScroll(block), wait: 500 },
    { act: () => M.go(LN, 0.3, 0.55), wait: M.slow },
    { act: () => { M.click(); setTimeout(() => M.click(), 160); setWsel({ i: ln, w: word }); setN(3); }, wait: 700 },
    { act: () => { M.card({ t: 'Ctrl + C' }); sfx('pop', true); }, wait: 900 },
    { act: () => { M.card(null); M.hide(); sfx('ok', true); setN(4); setView(true); }, wait: 800 },
    { say: [{ text: c.sayApply, pose: 'wonder' }] },
    { say: [{ text: c.sayOld, pose: 'think' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askWord, c.askApply][n];
  const help = useShowHelp(c.help);
  const on = n >= 4;
  const h1Src = '<h1' + (tag === 'h1' && on ? ' class="' + word + '"' : '') + '>' + pick(C.site.h1) + '</h1>';
  const pSrc = '<p' + (tag === 'p' && on ? ' class="' + word + '"' : '') + '>' + pick(C.site.when) + '</p>';
  const bodyL = [hl('h' + n, 1, h1Src, { cls: tag === 'h1' ? (on ? 'is-new is-read' : 'is-hl') : '' }), hl('p' + n, 1, pSrc, { cls: tag === 'p' ? (on ? 'is-new is-read' : 'is-hl') : '' }), hl('b', 1, btnHtml('btn-solid theme-success', pick(C.site.btn)))];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view && n < 4, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={page}><BsDocs page={page} open={open} navOff copyOff menuView={menuView} peek={peek} scrollTo={scroll} scrollKey={String(view) + n} lines={{ [block]: { word: wsel } }} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, [linkL('lk', 1, { cls: 'b2-cut' })], bodyL)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} o={{ h1: tag === 'h1' && on ? word : '', p: tag === 'p' && on ? word : '', btns: [{ cls: 'btn-solid theme-success' }] }} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}
const S10 = ({ p }) => <UtilShow p={p} id="s10" c={C.s10} from="Button" to="Colors" block="colors" ln={2} word="fg-success" tag="h1" />;
const S12 = ({ p }) => <UtilShow p={p} id="s12" c={C.s12} from="Colors" to="Background" block="bg" ln={4} word="bg-warning" tag="p" />;

// T4 — заголовок по образцу (fg-*); T5 — фон по образцу (bg-*).
function T4({ p }) {
  const pick = usePick();
  const c = C.t4;
  const H1 = pick(C.site.h1);
  const line = (f) => [lineCls('h', 0, { tag: 'h1', field: f, text: H1, close: true })];
  const rounds = [
    { kind: 'fg', want: 'fg-danger', line, page: (v) => ({ h1: v, p: '' }), goal: '<h1 class="fg-danger" style="margin:0">' + escH(H1) + '</h1>', gz: 0.55, ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('fg-…', 'fg-…', 'fg-…') },
    { kind: 'fg', want: 'fg-accent', line, page: (v) => ({ h1: v, p: '' }), goal: '<h1 class="fg-accent" style="margin:0">' + escH(H1) + '</h1>', gz: 0.55, ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('fg-…', 'fg-…', 'fg-…') }
  ];
  return <FillRounds p={p} id="t4" c={c} rounds={rounds} docs={{ page: 'Colors', only: 'colors' }} type="text-color" />;
}
function T5({ p }) {
  const pick = usePick();
  const c = C.t5;
  const P = pick(C.site.when);
  const line = (f) => [lineCls('p', 0, { tag: 'p', field: f, text: P, close: true })];
  const rounds = [
    { kind: 'bg', want: 'bg-success', line, page: (v) => ({ h1: false, p: v }), goal: '<p class="bg-success" style="margin:0">' + escH(P) + '</p>', ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('bg-…', 'bg-…', 'bg-…') },
    { kind: 'bg', want: 'bg-info', line, page: (v) => ({ h1: false, p: v }), goal: '<p class="bg-info" style="margin:0">' + escH(P) + '</p>', ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('bg-…', 'bg-…', 'bg-…') }
  ];
  return <FillRounds p={p} id="t5" c={c} rounds={rounds} docs={{ page: 'Background', only: 'bg' }} type="background" />;
}

// =============================================================================
// Q1. КАРТИНКА → КОД (4 раунда): образец «Kerak» и окно с результатом выбранного кода (честно). У каждого неверного
// варианта своя причина.
// =============================================================================
const Q1_ROUNDS = [
  { tag: 'button', opts: ['btn-solid theme-danger', 'btn-danger', 'btn-outline theme-danger', 'btn-solid theme-red'], a: 0 },
  { tag: 'h1', opts: ['text-success', 'bg-success', 'fg-success', 'theme-green'], a: 2 },
  { tag: 'p', opts: ['fg-warning', 'bg-warning', 'bg-yellow', 'theme-warning'], a: 1 },
  { tag: 'button', opts: ['btn-solid theme-accent', 'btn-outline theme-purple', 'btn-outline theme-primary', 'btn-outline theme-accent'], a: 3 }
];
const q1Html = (pick, tag, cls) => (tag === 'button' ? btnHtml(cls, pick(C.site.btn)) : tag === 'h1' ? '<h1' + clsA(cls) + ' style="margin:0">' + escH(pick(C.site.h1)) + '</h1>' : '<p' + clsA(cls) + ' style="margin:0">' + escH(pick(C.site.when)) + '</p>');
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const R = useRounds(Q1_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [shown, setShown] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => { setOff([]); setShown(null); }, [R.ii]);
  const RR = Q1_ROUNDS[R.ii];
  const right = RR.opts[RR.a];
  const ch = useChoiceHints(!R.ok, R.ii);
  const why = c.why[R.ii];
  const hints = choiceHints(c.hint1, c.hint2, why, right);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (j) => {
    const o = RR.opts[j];
    if (!canTap || R.ok || off.indexOf(o) >= 0) return;
    R.st.current.tries += 1; setShown(o);
    if (j !== RR.a) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.no[o], hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 'q1', type: 'picture-to-code', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const res = R.ok ? right : shown;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1" key={'r' + R.ii}>
          <div className="kz-col"><Goal pick={pick} html={q1Html(pick, RR.tag, right)} /></div>
          <div className="kz-col">
            <Br title={pick(C.site.title)} short cls="b2-q1page">
              {res ? <BsFrame body={q1Html(pick, RR.tag, res)} bs dep={res} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
            </Br>
          </div>
        </div>
        <div className="kz-pick b2-codes">
          {RR.opts.map((o, j) => (
            <button key={o} type="button" disabled={!canTap || R.ok || off.indexOf(o) >= 0} onClick={() => choose(j)} data-v={o}
              className={'kz-btn b2-code-opt ' + (R.ok && j === RR.a ? 'is-ok' : off.indexOf(o) >= 0 ? 'is-off' : 'is-ghost')} translate="no">
              {'class="' + o + '"'}<Led on={(led && !R.ok && off.length === 0 && j === 0) || (ch.lad.lv >= 3 && j === RR.a && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// T6. ПОЧЕМУ НЕ КРАСИТСЯ — btn-success (версия 5), btn-solid theme-green (нет цвета), theme-success (нет стиля).
// =============================================================================
const T6_ROUNDS = [{ k: 'old', cls: 'btn-success' }, { k: 'noColor', cls: 'btn-solid theme-green' }, { k: 'noShape', cls: 'theme-success' }];
function T6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t6;
  const [rec, put] = useRec('t6');
  const solved = !!(rec && rec.done);
  const R = useRounds(T6_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => setOff([]), [R.ii]);
  const RR = T6_ROUNDS[R.ii];
  const why = c.rounds[R.ii];
  const ch = useChoiceHints(!R.ok, R.ii);
  const hints = choiceHints(c.hint1, c.hint2, why, c.opts[RR.k]);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (k) => {
    if (!canTap || R.ok || off.indexOf(k) >= 0) return;
    R.st.current.tries += 1;
    if (k !== RR.k) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(why, hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 't6', type: 'why-no-color', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const keys = ['old', 'noColor', 'noShape'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={[hl('h', 0, '<h1>' + pick(C.site.h1) + '</h1>'), hl('b', 0, btnHtml(RR.cls, pick(C.site.btn)), { cls: 'is-hl' })]} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} o={{ btns: [{ cls: RR.cls }] }} /></div>
        </div>
        <div className="kz-pick b1-why">
          {keys.map((k) => (
            <button key={k} type="button" disabled={!canTap || R.ok || off.indexOf(k) >= 0} onClick={() => choose(k)} data-v={k}
              className={'kz-btn b1-opt2 ' + (R.ok && k === RR.k ? 'is-ok' : off.indexOf(k) >= 0 ? 'is-off' : 'is-ghost')}>
              {pick(c.opts[k])}<Led on={(led && !R.ok && off.length === 0) || (ch.lad.lv >= 3 && k === RR.k && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. СВОЯ КНОПКА — стиль и цвет (два поля в class) и свой текст; справка — Variants на сайте; «Tayyor».
// =============================================================================
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [sh, setSh] = useState(store.get('myShape') || '');
  const [co, setCo] = useState(store.get('myColor') || '');
  const [tx, setTx] = useState(store.get('myBtn') || '');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !sh, 0);
  const vs = normCls(sh), vc = normCls(co), vx = tx.trim();
  const ready = !!(vs && vc && vx);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    st.current.tries += 1;
    const issue = issueText(c, clsIssue(vs, 'shape', null)) || issueText(c, clsIssue(vc, 'theme', null))
      || (noTagsIn(vx) ? UI.noTags : vx.replace(/\s+/g, '').length < 3 ? c.msgs.text : normT(vx) === normT('Success') ? c.msgs.same : null);
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myShape', vs); store.set('myColor', vc); store.set('myBtn', vx); put({ done: true });
    log({ screenId: 'w1', type: 'own-button', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, cls: vs + ' ' + vc });
    sayNow(c.ok, 'cheer');
  };
  const f = (val, set, k, max, ph, lit) => (solved ? <span key={k} className={k === 'tx' ? 'b1-tx' : 'b1-st'}>{val.trim()}</span>
    : <span key={k} className={'kz-gap b1-slotin b2-field' + (lit ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={ph} label={c.ask} max={max} /></span>);
  const l1 = [pn('a', '<'), <span key="b" className="b1-tg">button</span>, sp(), <span key="c" className="b1-at">type</span>, pn('d', '='), <span key="e" className="b1-st">"button"</span>, sp(),
    <span key="f" className="b1-at">class</span>, pn('g', '='), <span key="h" className="b1-st">{'"'}</span>, f(sh, setSh, 'sh', 16, L3('btn-…', 'btn-…', 'btn-…'), led),
    <span key="i" className="b1-st">{' '}</span>, f(co, setCo, 'co', 20, L3('theme-…', 'theme-…', 'theme-…')), <span key="j" className="b1-st">{'"'}</span>, pn('k', '>')];
  const l2 = [f(tx, setTx, 'tx', 40, L3('…', '…', '…'))];
  const pageCls = (vs + ' ' + vc).trim();
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className={docsPhoneCls({ ref: true, done: solved })}>
          {!solved ? <div className="kz-col b1-tri-docs"><DocsBr page="Button"><BsDocs page="Button" only="variants" copyOff /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={[{ k: 'a', d: 0, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l1 }, { k: 'b', d: 1, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l2 }, hl('c', 0, '</button>')]} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} o={{ h1: false, btns: [{ cls: pageCls || null, text: vx || pick(C.site.btn) }] }} title={pick(UI.mySite)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}
const noTagsIn = (s) => /[<>]/.test(String(s || ''));

// =============================================================================
// S18. ВЫВОД — разгадка: слова цвета — одна семья; своя кнопка ученика на сайте кружка; что умеем.
// =============================================================================
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const cls = (store.get('myShape') || 'btn-solid') + ' ' + (store.get('myColor') || 'theme-success');
  const text = store.get('myBtn') || pick(C.site.btn);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const fam = curK === 'riddle' || curK === 'theme';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col">
            <SitePage pick={pick} o={{ h1: 'fg-success', p: 'bg-warning', alert: fam ? 'alert theme-success' : null, btns: [{ cls, text }] }} title={pick(UI.mySite)} />
          </div>
          <div className="kz-col b1-end-side">
            <KzCode lines={[hl('h', 0, '<h1 class="fg-success">…</h1>', { cls: curK === 'fg' ? 'is-read' : '' }), hl('p', 0, '<p class="bg-warning">…</p>', { cls: curK === 'fg' ? 'is-read' : '' }), hl('b', 0, btnHtml(cls, text), { cls: curK === 'btn' || fam ? 'is-read' : '' })]} cls="kz-code-sm b1-nowrap" />
            <div className="kz-roles">
              {['btn', 'theme', 'fg', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'btn' ? '#0FA38E' : k === 'theme' ? '#7952B3' : k === 'fg' ? '#D97706' : '#FA4F28' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 'r1', code: 'CHECK', Comp: R1 },
  { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 's6', code: 'SHOW', Comp: S6 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's10', code: 'SHOW', Comp: S10 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 't5', code: 'LEVEL-2', Comp: T5 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
// «Повторить» стирает только экран; своя кнопка ученика (myShape, myColor, myBtn) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

// Артефакт урока — страница кружка с Bootstrap и своей кнопкой ученика.
function lessonBs2Artifact(store) {
  const sh = store.get('myShape'), co = store.get('myColor'), tx = store.get('myBtn');
  if (!sh && !co && !tx) return null;
  const cls = ((sh || '') + ' ' + (co || '')).trim();
  return { type: 'html-page', cls, text: tx || '',
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      "    <h1 class=\"fg-success\">Robot to'garagi</h1>", '    <button type="button" class="' + escH(cls) + '">' + escH(tx || '') + '</button>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapCvetaIKnopki({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs2Artifact(store) })
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
