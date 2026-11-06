// =============================================================================
// ЭКРАНЫ УРОКА 8 КУРСА CSS «Красивые карточки» (облик «Редактор», 06.11.2026). Основа кода — урок 7 курса CSS (tools/css7/).
// Типы заданий — по разделу 3а навыка: s3 вписать border-radius — s4 радиус ↔ коробка; s6 вписать сдвиг тени — s7 какой
// код у тени; s9 вписать сторону рамки — s10 какая сторона; s12 исправить тень с запятыми — s13 найти сломанное правило;
// w1 правило целиком (линия под h1); s14 своя карточка; q1 верно или нет. Экрана плана нет.
// Честный браузер: верная ли запись — решает Chrome (CSS.supports). Бумаги нет.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'border-radius', 'box-shadow', 'border-top', 'border-right', 'border-bottom', 'border-left'];
const cssOk = (p, v) => {
  if (CSS_PROPS.indexOf(p) < 0 || !v) return false;
  try { return typeof CSS === 'undefined' || !CSS.supports ? true : CSS.supports(p, v); } catch (e) { return false; }
};
// Селектор: тег, .class или #id (ровно один простой селектор, как в уроке); иное — ничего не выбирает.
function selOf(raw) {
  const s = String(raw || '').trim();
  let m = /^\.(-?[A-Za-z_][\w-]*)$/.exec(s);
  if (m) return { kind: 'cls', name: m[1], spec: 10 };
  m = /^#(-?[A-Za-z_][\w-]*)$/.exec(s);
  if (m) return { kind: 'id', name: m[1], spec: 100 };
  m = /^([A-Za-z][A-Za-z0-9]*)$/.exec(s);
  if (m) return { kind: 'tag', name: m[1].toLowerCase(), spec: 1 };
  return { kind: 'bad', spec: 0 };
}
function cssParse(text) {
  const rules = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let m, n = 0;
  while ((m = re.exec(String(text || '')))) {
    const sel = selOf(m[1]);
    const decls = [];
    m[2].split(';').forEach((d) => {
      const i = d.indexOf(':');
      if (i < 0) return;
      const p = d.slice(0, i).trim().toLowerCase(), v = d.slice(i + 1).trim();
      if (cssOk(p, v)) decls.push({ p, v });
    });
    rules.push({ sel, decls, n: n++ });
  }
  return rules;
}
// Подходит ли правило элементу { t, cls: 'a b', id }.
const matches = (sel, el) => {
  if (sel.kind === 'tag') return sel.name === el.t;
  if (sel.kind === 'cls') return String(el.cls || '').split(/\s+/).indexOf(sel.name) >= 0;
  if (sel.kind === 'id') return el.id === sel.name;
  return false;
};
const camel = (p) => p.replace(/-([a-z])/g, (a, b) => b.toUpperCase());
const styleFor = (rules, el) => {
  const st = {};
  rules.filter((r) => matches(r.sel, el)).sort((a, b) => a.sel.spec - b.sel.spec || a.n - b.n)
    .forEach((r) => r.decls.forEach((d) => { st[camel(d.p)] = d.v; }));
  if (st.backgroundImage) st.backgroundImage = bgUrl(st.backgroundImage);
  return st;
};
// Пробел в строке редактора — свой кусок (строка — flex, голые пробелы схлопываются).
const sp = () => <span className="c8-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c8-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c8-mark c8-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c8-sel c8-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c8-sel c8-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c8-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c8-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c8-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c8-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c8-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c8-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c8-att c8-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c8-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c8-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
  return [open, W_(el.text), T_(el.t, true)];
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
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.8) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => ro.disconnect();
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}
// Страница: элементы { t, text, k, hl } и правила. Основа страницы — жёлтый фон заметок (урок 4), строка BASE в коде.
const BG_KEYS = ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition'];
const BASE = ['p { background-color: lavender; padding: 16px; }'];
const pxN = (v) => Math.round(parseFloat(v) || 0);
const SIDES = ['Top', 'Right', 'Bottom', 'Left'];
// «Инспектор», как в DevTools: у каждого элемента пунктирная рамка и ярлык «тег ширина×высота» (размер всей коробки —
// offsetWidth / offsetHeight); у подсвеченного (hl) — отступы цветом: margin оранжевый, padding зелёный. Меряет сам браузер
// (getComputedStyle), слой лежит поверх страницы и её стилем не является.
function CssPage({ els, rules, insp = false }) {
  const R = rules || [];
  const ref = useFitPage(JSON.stringify([els.map((b) => [b.t, b.k, b.text, b.hl]), R.map((r) => [r.sel, r.decls])]));
  const body = styleFor(R, { t: 'body' });
  const doc = Object.assign({}, body);   // фон body — на всю страницу окна
  const [boxes, setBoxes] = useState([]);
  const key = JSON.stringify([els.map((b) => [b.t, b.k, b.text, b.hl]), R.map((r) => [r.sel, r.decls])]);
  useLayoutEffect(() => {
    const d = ref.current;
    if (!d || !insp) return undefined;
    const measure = () => {
      const nb = [...d.querySelectorAll(':scope > .c8-blk')].map((e) => {
        const cs = getComputedStyle(e);
        return { x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight, t: e.getAttribute('data-t'), hl: e.classList.contains('is-hl'),
          m: SIDES.map((k) => pxN(cs['margin' + k])), b: SIDES.map((k) => pxN(cs['border' + k + 'Width'])), p: SIDES.map((k) => pxN(cs['padding' + k])) };
      });
      setBoxes((old) => (JSON.stringify(old) === JSON.stringify(nb) ? old : nb));
      const page = d.closest('.kz-br-page');
      const h = d.querySelector(':scope > .c8-blk.is-hl');
      if (page && page.scrollHeight > page.clientHeight + 1) page.scrollTop = h ? Math.max(0, h.offsetTop - 30) : page.scrollTop;
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(d);
    [...d.children].forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [key, insp]); // eslint-disable-line react-hooks/exhaustive-deps
  const bw = (a) => a.map((v) => v + 'px').join(' ');
  const anyHl = boxes.some((b) => b.hl);
  return (
    <div ref={ref} className={'c8-doc' + (insp ? ' is-insp' : '')} style={doc}>
      {els.map((el, i) => <div key={el.k || i} className={'c8-blk c8-' + el.t + (el.hl ? ' is-hl' : '')} style={styleFor(R, el)} data-t={el.t}>{el.text}</div>)}
      {insp ? boxes.map((b, i) => [
        b.hl ? <span key={'m' + i} className="c8-tint c8-tm" aria-hidden="true" style={{ left: b.x - b.m[3], top: b.y - b.m[0], width: b.w + b.m[1] + b.m[3], height: b.h + b.m[0] + b.m[2], borderWidth: bw(b.m) }} /> : null,
        b.hl ? <span key={'p' + i} className="c8-tint c8-tp" aria-hidden="true" style={{ left: b.x + b.b[3], top: b.y + b.b[0], width: Math.max(0, b.w - b.b[1] - b.b[3]), height: Math.max(0, b.h - b.b[0] - b.b[2]), borderWidth: bw(b.p) }} /> : null,
        <span key={'b' + i} className={'c8-ibox' + (b.hl ? ' is-hl' : '')} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} aria-hidden="true">
          <i className="c8-itag" translate="no">{b.t} {b.w}×{b.h}</i>
        </span>
      ]) : null}
      {insp && anyHl ? <span className="c8-legend" aria-hidden="true" translate="no"><i className="c8-lg-m">margin</i><i className="c8-lg-p">padding</i></span> : null}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c8-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c8-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c8-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c8-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c8-edge' }), tagL('bo', 0, 'body', false, { cls: 'c8-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c8-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c8-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
// Цвет к одному виду (#rrggbb) — сам браузер (canvas): так «#00F» и «#0000FF» — один цвет.
let CK_CTX = null;
const colorKey = (v) => {
  const s = String(v || '').trim();
  if (!s || !cssOk('color', s)) return null;
  try {
    if (!CK_CTX) CK_CTX = document.createElement('canvas').getContext('2d');
    CK_CTX.fillStyle = '#010203'; CK_CTX.fillStyle = s;
    return String(CK_CTX.fillStyle).toLowerCase();
  } catch (e) { return s.toLowerCase(); }
};
const P = (k, cls, t) => <span key={k} className={cls}>{t}</span>;
// Правило «sel { prop: VALUE; }» с готовыми кусками значения.
const ruleParts = (sel, prop, val) => [P('s', 'c8-sel c8-part', sel), ' ', P('b', 'c8-punc', '{'), ' ', P('p', 'c8-prop', prop), P('c', 'c8-punc', ':'), ' ']
  .concat(val, [P('sc', 'c8-punc', ';'), ' ', P('b2', 'c8-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c8-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c8-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c8-cssline ' + (cls || '') });
const CheckRow = ({ canTap, ready, onCheck }) => {
  const pick = usePick();
  return (
    <div className="keys" translate="no">
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={onCheck}>{pick(UI.check)}</button>
    </div>
  );
};
// Ступени подсказки в заданиях с набором — как во всём курсе.
function useTypeTask(id, solved) {
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  return { msg, setMsg, okNow, setOkNow, lad, st };
}


// url("…") в этом уроке не нужны: картинок нет, значение проходит как есть.
function bgUrl(v) { return v; }
const V = (t, cls) => [P('v', 'c8-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c8-sel c8-part', sel), ' ', P('b', 'c8-punc', '{')], { d: 1, cls: 'c8-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c8-prop', x.prop), P('c', 'c8-punc', ':'), ' '].concat(x.val, [P('sc', 'c8-punc', ';')]),
    { d: 2, cls: 'c8-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c8-punc', '}')], { d: 1, cls: 'c8-cssline ' + (cls || '') })]);
// Текст «sel { a: b; c: d; }» → строки блока.
const blockOf = (k, text, cls, litVal) => {
  const m = /^([^{]+)\{([^}]*)\}/.exec(text);
  const decls = m[2].split(';').map((d) => d.trim()).filter(Boolean).map((d, i) => {
    const j = d.indexOf(':');
    return { prop: d.slice(0, j).trim(), val: V(d.slice(j + 1).trim(), litVal === i ? 'is-cur' : '') };
  });
  return blockL(k, m[1].trim(), decls, cls);
};
// Полоса «Файлы»: картинки урока с именами (lit — горит файл).

const ruleTxt = (sel, decls) => sel + ' { ' + decls.map(([pr, v]) => pr + ': ' + v + ';').join(' ') + ' }';
const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
// Поле в строке правила.
const Slot = ({ ty, led, onEnter, label, cls, max, onChange }) => (
  <span key="g" className={'kz-gap c8-slot ' + (cls || 'c8-slot-col') + (led ? ' kz-gap-led' : '')}>
    <InlineInput value={ty.val} onChange={onChange || ((x) => ty.setVal(x))} inputRef={ty.inputRef} onEnter={onEnter} placeholder={L3('…', '…', '…')} label={label} max={max || 24} />
  </span>
);
// Задание «впиши значение»: одно поле, проверка по want(v) → msg | null.
function useFill(id, c, issueOf, pose) {
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 24 });
  const T = useTypeTask(id, solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : (pose || 'explain') }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const issue = issueOf(ty.val.trim());
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: id, type: 'write-value', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  return { ty, T, speaker, canTap, canGo, led, check, onChange: (x) => { ty.setVal(x); T.setMsg(null); } };
}
// Строка основы (жёлтый фон заметок) — тусклая, она есть на каждом экране; правила страницы — всегда вместе с ней.
const baseL = () => BASE.map((r, i) => cssL('base' + i, 1, r, { cls: 'c8-dim' }));
const withBase = (list) => cssParse(BASE.concat(list || []).join(' '));
// Экран «впиши значение»: правило sel { prop: [pre] ▢ [post]; } (и готовые правила given), страница честно.
function FillScreen({ p, c, F, sel, prop, want, given, hl, pre, post, propSlot, fixed }) {
  const pick = usePick();
  const v = F.T.okNow ? want : F.ty.val.trim();
  const full = [pre, v, post].filter(Boolean).join(' ');
  const rules = (given || []).concat([ruleTxt(sel, [propSlot ? [v || 'x', fixed] : [prop, full]])]);
  const slot = F.T.okNow ? [P('v', propSlot ? 'c8-prop' : 'c8-val', want)] : [<Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />];
  const val = [].concat(pre ? [P('pre', 'c8-val', pre), ' '] : [], slot, post ? [' ', P('post', 'c8-val', post)] : []);
  // Поле на месте свойства: «sel { ▢: fixed; }».
  const partsOf = () => (propSlot ? [P('s', 'c8-sel c8-part', sel), ' ', P('b', 'c8-punc', '{'), ' '].concat(slot, [P('c', 'c8-punc', ':'), ' ', P('fx', 'c8-val', fixed), P('sc', 'c8-punc', ';'), ' ', P('b2', 'c8-punc', '}')]) : ruleParts(sel, prop, val));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c8-s5 c8-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL().concat((given || []).map((r, i) => cssL('g' + i, 1, r, { cls: 'c8-dim' })), [ruleLine('r', partsOf(), F.T.okNow ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl })} rules={withBase(rules)} /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={[]} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Экран-показ: шаги правил по очереди; steps[n] — список правил, hl[n] — подсвеченный элемент.
function ShowScreen({ p, c, id, steps, says, asks, pose, hl }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const last = steps.length - 1;
  const [n, setN] = useState(solved ? last : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: pose || 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(...says.map((t, i) => [{ act: () => { sfx(i ? 'ok' : 'pop', true); setN(i + 1); } }, { say: [{ text: t, pose: i % 2 ? 'wonder' : 'point' }] }]),
    [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const rules = steps[n];
  const askText = solved || demo.done ? asks.done : asks.list[n];
  const prev = n > 0 ? steps[n - 1] : [];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c8-s5 c8-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL().concat(rules.map((r, i) => cssL('r' + i + r, 1, r, { cls: live && prev.indexOf(r) < 0 ? 'is-new is-read' : '' }))))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl ? hl[Math.min(n, hl.length - 1)] : null })} rules={withBase(rules)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
function useRounds(id, c, list, keyOf, whyOf, ansOf) {
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? list.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === list.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + off.length);
  const it = list[ii];
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, ansOf(it));
  const choose = (v) => {
    if (!canTap || ok || off.indexOf(v) >= 0) return;
    st.current.tries += 1;
    if (v !== keyOf(it)) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(v)); sayNow(ch.miss(it.why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === list.length - 1) {
      put({ done: true });
      log({ screenId: id, type: 'choose', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff([]); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  return { it, ii, ok, off, done, canTap, canGo, led, ch, hints, choose, speaker };
}
const cssStyle = (decl) => { const st = styleFor(cssParse('x { ' + decl + ' }').map((r) => Object.assign(r, { sel: { kind: 'tag', name: 'x', spec: 1 } })), { t: 'x' }); return st; };


// ── СТРАНИЦА УРОКА: кружки Коди — заголовок и две карточки (сиреневые абзацы с padding) ──
const site = (pick, o) => {
  const x = o || {};
  return [
    { t: 'h1', text: pick(C.site.title), k: 'h', hl: x.hl === 'h1' },
    { t: 'p', text: pick(C.site.n1), k: 'p1', hl: x.hl === 'p' },
    { t: 'p', text: pick(C.site.n2), k: 'p2' }
  ];
};
const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
const hasStyle = (v) => norm(v).split(' ').some((t) => BORDER_STYLES.indexOf(t) >= 0);
const SIDE_PROPS = ['border-top', 'border-right', 'border-bottom', 'border-left'];
const sizeIssue = (w, msgs, want, prop) => {
  const v = norm(w);
  if (!v) return msgs.empty;
  if (/^\d+(\.\d+)?$/.test(v) && v !== '0') return msgs.noUnit;
  if (!cssOk(prop, v)) return msgs.bad;
  return v === want ? null : msgs.other;
};
// Одинаковые ли значения из нескольких частей (порядок частей не важен).
const sameParts = (a, b) => norm(a).split(' ').sort().join(' ') === norm(b).split(' ').sort().join(' ');
// Коробка-образец (s4, s7, s10): белый прямоугольник со стилем из кода.
const Sample = ({ decl, cls }) => <span className={'c8-bbox' + (cls ? ' ' + cls : '')} style={cssStyle(decl)} />;

// =============================================================================
// S1. КРЮЧОК — квадратные карточки без тени; «Превратить» — радиус, тень, полоса слева. Загадка: круг из border-radius.
// =============================================================================
const S1_CSS = ['p { border-radius: 12px; }', 'p { box-shadow: 0px 6px 16px silver; }', 'p { border-left: 6px solid orange; }'];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const turn = () => {
    if (!canTap || on) return;
    sfx('soft', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.magicP, 'explain'); say(c.done, 'think');
  };
  const lines = baseL().concat(on ? S1_CSS.map((r, i) => cssL('r' + i, 1, r, { cls: 'is-new' })) : []);
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c8-s5 c8-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase(on ? S1_CSS : [])} /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// S2. СКРУГЛЕНИЕ (показ) — 8px → 24px → 50px (капсула).
function S2({ p }) {
  const c = C.s2;
  return <ShowScreen p={p} c={c} id="s2"
    steps={[[], ['p { border-radius: 8px; }'], ['p { border-radius: 24px; }'], ['p { border-radius: 50px; }']]}
    says={[c.sayS, c.sayM, c.sayL]} hl={['p']}
    asks={{ list: [c.askStart, c.askS, c.askM, c.askL], done: c.askDone }} />;
}
// S3. ВПИШИ border-radius — p { border-radius: ▢; } → 16px.
function S3({ p }) {
  const c = C.s3;
  const F = useFill('s3', c, (w) => sizeIssue(w, c.msgs, '16px', 'border-radius'));
  return <FillScreen p={p} c={c} F={F} sel="p" prop="border-radius" want="16px" hl="p" />;
}

// S4. НАЙДИ ПАРУ (Matching Pairs) — border-radius 4px, 16px, 40px ↔ коробки.
const S4_CODES = ['r4', 'r16', 'r40'];
const S4_CARDS = ['r16', 'r40', 'r4'];
const S4_TXT = { r4: '4px', r16: '16px', r40: '40px' };
function S4({ p }) {
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [paired, setPaired] = useState(solved ? S4_CODES.slice() : []);
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
  const nextT = S4_CODES.find((t) => paired.indexOf(t) < 0);
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
      log({ screenId: 's4', type: 'match-radius', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene c8-match">
          <div className="c8-match-col">
            {S4_CODES.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code c8-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{'border-radius: ' + S4_TXT[t]}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="c8-match-col">
            {S4_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'c8-mcard c8-shapecard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <Sample decl={'border-radius: ' + S4_TXT[k] + '; border: 3px solid #475569;'} />
                  {ok ? <span className="c8-mcard-tag" translate="no">{S4_TXT[k]}</span> : null}
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

// S5. ТЕНЬ (показ) — сдвиг вправо и вниз, без размытия → только вниз → размытие → цвет.
function S5({ p }) {
  const c = C.s5;
  return <ShowScreen p={p} c={c} id="s5"
    steps={[[], ['p { box-shadow: 6px 6px 0px gray; }'], ['p { box-shadow: 0px 6px 0px gray; }'], ['p { box-shadow: 0px 6px 16px gray; }'], ['p { box-shadow: 0px 6px 16px orange; }']]}
    says={[c.sayRD, c.sayD, c.sayBlur, c.sayColor]} hl={['p']}
    asks={{ list: [c.askStart, c.askRD, c.askD, c.askBlur, c.askColor], done: c.askDone }} />;
}
// S6. СДВИГ ВПРАВО — p { box-shadow: ▢ 6px 0px gray; } → 6px.
function S6({ p }) {
  const c = C.s6;
  const F = useFill('s6', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (/^\d+(\.\d+)?$/.test(v) && v !== '0') return c.msgs.noUnit;
    if (!cssOk('box-shadow', v + ' 6px 0px gray')) return c.msgs.bad;
    if (v === '0px' || v === '0') return c.msgs.zero;
    return v === '6px' ? null : c.msgs.other;
  });
  return <FillScreen p={p} c={c} F={F} sel="p" prop="box-shadow" post="6px 0px gray" want="6px" hl="p" />;
}

// S7. КАКОЙ КОД У ТЕНИ? (выбор по одному) — коробка с тенью и три кода.
function S7({ p }) {
  const c = C.s7;
  const R = useRounds('s7', c, c.rounds, (it) => it.want, (it) => it.why, (it) => it.want);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <div className="c8-card c8-rect-card kz-a-drop"><Sample decl={R.it.want} /></div>
            <div className="kz-pick c8-opts">
              {R.it.opts.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c8-tf c8-opt ' + (R.ok && v === R.it.want ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && !R.ok && v === R.it.want ? ' is-led' : '')}>
                  <span translate="no">{v}</span><Led on={R.led && !R.ok && R.off.length === 0} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S8. РАМКА С ОДНОЙ СТОРОНЫ (показ) — border-left → border-bottom → border-top.
function S8({ p }) {
  const c = C.s8;
  const L = 'p { border-left: 6px solid orange; }', B = 'p { border-bottom: 4px solid purple; }';
  return <ShowScreen p={p} c={c} id="s8"
    steps={[[], [L], [L, B], [L, B, 'p { border-top: 4px dashed green; }']]}
    says={[c.sayLeft, c.sayBottom, c.sayTop]} hl={['p']}
    asks={{ list: [c.askStart, c.askLeft, c.askBottom, c.askTop], done: c.askDone }} />;
}
// S9. ВПИШИ СВОЙСТВО — p { ▢: 6px solid orange; } → border-left.
function S9({ p }) {
  const c = C.s9;
  const F = useFill('s9', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (v === 'border') return c.msgs.all;
    if (v === 'border-right') return c.msgs.right;
    if (SIDE_PROPS.indexOf(v) >= 0 && v !== 'border-left') return c.msgs.side;
    return v === 'border-left' ? null : c.msgs.bad;
  });
  return <FillScreen p={p} c={c} F={F} sel="p" propSlot fixed="6px solid orange" want="border-left" hl="p" />;
}

// S10. КАКАЯ СТОРОНА? (Sort по одному) — коробка с полосой на одной стороне и четыре свойства.
function S10({ p }) {
  const c = C.s10;
  const R = useRounds('s10', c, c.items, (it) => it.right, (it) => it.why, (it) => it.right);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <div className="c8-card c8-rect-card kz-a-drop"><Sample decl={R.it.right + ': 6px solid orange;'} /></div>
            <div className="kz-pick c8-sides">
              {SIDE_PROPS.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c8-tf c8-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
                  <span translate="no">{v}</span><Led on={R.led && !R.ok && R.off.length === 0} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S11. КОГДА ЛОМАЕТСЯ (показ) — радиус без px; тень с запятыми; та же тень через пробелы.
function S11({ p }) {
  const c = C.s11;
  return <ShowScreen p={p} c={c} id="s11" pose="curious"
    steps={[['p { border-radius: 16px; }'], ['p { border-radius: 16; }'], ['p { box-shadow: 0px, 6px, 12px, gray; }'], ['p { box-shadow: 0px 6px 12px gray; }']]}
    says={[c.sayNoUnit, c.sayComma, c.sayFixed]} hl={['p']}
    asks={{ list: [c.askStart, c.askNoUnit, c.askComma, c.askFixed], done: c.askDone }} />;
}

// S12. ИСПРАВЬ (Debug & Fix) — в поле тень с запятыми: убрать запятые.
function S12({ p }) {
  const c = C.s12;
  const F = useFill('s12', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (v.indexOf(',') >= 0) return c.msgs.comma;
    if (!cssOk('box-shadow', v)) return c.msgs.bad;
    return v === '0px 6px 12px gray' ? null : c.msgs.other;
  }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !F.T.okNow && !F.ty.val) { set0.current = true; F.ty.setVal('0px, 6px, 12px, gray'); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <FillScreen p={p} c={c} F={F} sel="p" prop="box-shadow" want="0px 6px 12px gray" hl="p" />;
}

// S13. НАЙДИ ОШИБКУ (Error Detective) — раунд 1: «border-radius: 20» без px; раунд 2: тень с запятыми.
const S13_ROUNDS = [
  { kind: 'unit', bad: 0, rules: ['p { border-radius: 20; }', 'p { box-shadow: 0px 4px 8px gray; }', 'h1 { border-bottom: 3px solid orange; }'], fixed: 'p { border-radius: 20px; }' },
  { kind: 'comma', bad: 1, rules: ['p { border-radius: 12px; }', 'p { box-shadow: 0px, 4px, 8px, gray; }', 'p { border-left: 5px solid purple; }'], fixed: 'p { box-shadow: 0px 4px 8px gray; }' }
];
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? S13_ROUNDS.length - 1 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === S13_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const R = S13_ROUNDS[ri];
  const ch = useChoiceHints(!found, ri);
  const hints = [c.hint1, c.hint2[R.kind], c.hint3[R.kind]];
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (j !== R.bad) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(j)); sayNow(ch.miss(c.fine, hints), 'think'); return; }
    sfx('win', true); setFound(true); ch.clear();
    if (ri === S13_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 's13', type: 'find-error', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.found[R.kind], c.ok), 'cheer');
    } else { sayNow(c.found[R.kind], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); sayNow(c.say2, 'curious'); }, reduceMotion() ? 300 : 1200);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const rules = R.rules.map((r, j) => (found && j === R.bad ? R.fixed : r));
  const lit = ch.lad.lv >= 3;
  const lines = rules.map((r, j) => ({
    k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: cssTokens(r),
    cls: 'c8-cssline c8-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c8-s5 c8-pair c8-q1" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={found ? '' : 'c8-broken'}><CssPage els={site(pick)} rules={withBase(rules)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — «h1 { border-bottom: 3px solid orange; }»: части значения в любом порядке.
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return msgs.colon;
  if (m[1].trim().toLowerCase() !== 'h1') return msgs.sel;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = norm(d.slice(i + 1));
  if (prop === 'border') return msgs.all;
  if (prop !== 'border-bottom') return msgs.prop;
  if (!cssOk('border-bottom', val)) return msgs.bad;
  if (!hasStyle(val)) return msgs.noStyle;
  if (!sameParts(val, '3px solid orange')) return msgs.other;
  return null;
}
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 48 });
  const T = useTypeTask('w1', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const css = T.okNow ? 'h1 { border-bottom: 3px solid orange; }' : ty.val;
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const issue = ruleIssue(ty.val, c.msgs);
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 'w1', type: 'write-rule', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet c8-w1">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c8-s5 c8-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL().concat([T.okNow ? cssL('r', 1, css, { cls: 'is-new' }) : ruleLine('r', [<span key="g" className={'kz-gap c8-slot c8-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={48} /></span>], 'is-hl')]))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: T.okNow ? null : 'h1' })} rules={withBase([css])} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['{', '}', ':', ';', '-']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// S14. СВОЯ КАРТОЧКА (Live Code Preview, «Готово») — скругление, тень и полоса слева: любые настоящие значения.
const OWN = [{ k: 'myRad', prop: 'border-radius', f: 'fa', max: 12 }, { k: 'myShd', prop: 'box-shadow', f: 'fb', max: 28 }, { k: 'myLeft', prop: 'border-left', f: 'fc', max: 24 }];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const store = useStore();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [vals, setVals] = useState(OWN.map((o) => store.get(o.k) || ''));
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !vals[0], 0);
  const v = vals.map((x) => x.trim());
  const ready = v.every(Boolean);
  const issueOf = () => {
    if (!cssOk('border-radius', norm(v[0]))) return fillL(c.msgs.rad, { w: v[0] });
    if (!cssOk('box-shadow', norm(v[1]))) return v[1].indexOf(',') >= 0 ? c.msgs.comma : c.msgs.shd;
    if (!cssOk('border-left', norm(v[2]))) return c.msgs.left;
    if (!hasStyle(v[2])) return c.msgs.noStyle;
    return null;
  };
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = issueOf();
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    OWN.forEach((o, i) => store.set(o.k, v[i])); put({ done: true });
    log({ screenId: 's14', type: 'own-card', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, radius: v[0], shadow: v[1], left: v[2] });
    sayNow(c.ok, 'cheer');
  };
  const rules = OWN.map((o, i) => 'p { ' + o.prop + ': ' + v[i] + '; }');
  const field = (i) => (
    <span key={OWN[i].f} className={'kz-gap c8-slot c8-slot-col' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={OWN[i].f}>
      <InlineInput value={vals[i]} onChange={(x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={OWN[i].max} />
    </span>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet kz-typed c8-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={site(pick)} rules={withBase(rules)} /></Br>
            <KzCode lines={styleWrap(OWN.map((o, i) => ruleLine(o.f, ruleParts('p', o.prop, [solved ? P('v', 'c8-val', v[i]) : field(i)]), solved ? 'is-new' : 'is-hl')))} cls="kz-code-sm" />
          </div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// Q1. ВЕРНО ИЛИ НЕТ (True / False).
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.items.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.items[0].t, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, it.right ? c.yes : c.no);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) { st.current.misses += 1; sfx('soft', true); setOff(v); sayNow(ch.miss(it.why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'q1', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); sayNow(c.items[ii + 1].t, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = (v) => (
    <button key={String(v)} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)}
      className={'kz-btn c8-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = { comma: [cssL('c', 0, 'p { box-shadow: 0px, 4px, 8px, gray; }')], shd: [cssL('c', 0, 'p { box-shadow: 10px 0px 0px gray; }')] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c8-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c8-card c8-tf-card kz-a-drop">
              <span className="c8-card-h">{pick(c.card)}</span>
              <p className="c8-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c8-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S15. ВЫВОД — разгадка: border-radius 100px у широкой карточки — капсула, а не круг; круг — квадрат и 50%; своя карточка; роли.
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const own = [store.get('myRad') || '16px', store.get('myShd') || '0px 6px 16px silver', store.get('myLeft') || '6px solid purple'];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle' || curK === 'riddle2';
  const rows = curK === 'riddle' ? ['p { border-radius: 100px; }'] : curK === 'riddle2' ? ['p { width: 100px; height: 100px; border-radius: 50%; }'] : OWN.map((o, i) => 'p { ' + o.prop + ': ' + own[i] + '; }');
  const ex = { rad: '16px', shd: '0px 6px 16px gray', side: 'border-left', circ: '50%' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c8-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick)} rules={withBase(rows)} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['rad', 'shd', 'side', 'circ'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" /><span translate="no">{pick(c.roles[k])}</span>{curK === k ? <code className="c8-role-ex" translate="no">{ex[k]}</code> : null}
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
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'CHECK-4', Comp: S13 },
  { id: 'w1', code: 'LEVEL-W', Comp: W1 },
  { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; своя карточка ученика (myRad, myShd, myLeft) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя карточка ученика.
function lessonCss8Artifact(store) {
  const v = OWN.map((o) => store.get(o.k) || '');
  if (!v.some(Boolean)) return null;
  return { type: 'html-page', radius: v[0], shadow: v[1], left: v[2],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening kartochkam</title>', '    <style>'].concat(BASE.map((r) => '      ' + r),
      OWN.map((o, i) => '      p { ' + o.prop + ': ' + escHtml(v[i]) + '; }'),
      ['    </style>', '  </head>', '  <body>', "    <h1>To'garaklar</h1>", '    <p>Futbol: seshanba</p>', '  </body>', '</html>']).join('\n') };
}

export default function CssKartochki({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss8Artifact(store) })
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
