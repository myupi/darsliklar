// =============================================================================
// ЭКРАНЫ УРОКА 10 КУРСА CSS «Flexbox: расположение элементов» (облик «Редактор», 06.11.2026). Основа кода — урок 9
// курса CSS (tools/css9/). Типы заданий — по разделу 3а навыка: s3 вписать flex — s4 какому тегу display: flex;
// s6 вписать column — s7 какое правило у полки; s9 вписать row-reverse — s10 куда идёт главная ось; s12 исправить
// «flexbox» — s13 найти правило, которое не работает; w1 правило целиком (меню столбиком через flex); s14 своя полка;
// q1 верно или нет. Честный браузер: настоящие теги; стрелки осей — по flex-direction, который вычислил браузер. Бумаги нет.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'border-radius', 'box-shadow', 'border-top', 'border-right', 'border-bottom', 'border-left', 'display', 'flex-direction'];
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
const sp = () => <span className="c10-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c10-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c10-mark c10-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c10-sel c10-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c10-sel c10-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c10-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c10-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c10-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c10-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c10-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c10-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c10-att c10-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c10-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c10-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
// Страница из настоящих тегов: элемент { t, text | kids, k, hl }; kids — строки и вложенные элементы (span в абзаце).
// У каждого тега свой display по умолчанию, как в браузере: div, p, h1 — блоки, span и a — строчные.
const BG_KEYS = ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition'];
const pxN = (v) => Math.round(parseFloat(v) || 0);
// «Инспектор»: у каждого тега пунктирная рамка, у подсвеченных — оранжевая; их размеры «тег ширина×высота» — строкой
// под страницей (ярлыки над тегами налезали бы на соседей). Меряет сам браузер (getBoundingClientRect), так видно,
// что строчный элемент не берёт width.
function CssPage({ els, rules, insp = true, axes = true }) {
  const pick = usePick();
  const R = rules || [];
  const ref = useFitPage(JSON.stringify([els, R.map((r) => [r.sel, r.decls])]));
  const doc = Object.assign({}, styleFor(R, { t: 'body' }));
  const [boxes, setBoxes] = useState([]);
  const [ax, setAx] = useState([]);
  const key = JSON.stringify([els, R.map((r) => [r.sel, r.decls])]);
  useLayoutEffect(() => {
    const d = ref.current;
    if (!d || (!insp && !axes)) return undefined;
    const measure = () => {
      const o = d.getBoundingClientRect();
      // Оси flex-контейнера: направление берём у браузера (getComputedStyle), не из кода урока.
      const na = axes ? [...d.querySelectorAll('[data-axes]')].map((e) => {
        const cs = getComputedStyle(e);
        if (cs.display.indexOf('flex') < 0 || !e.getClientRects().length) return null;
        const r = e.getBoundingClientRect();
        return { x: Math.round(r.left - o.left + d.scrollLeft), y: Math.round(r.top - o.top + d.scrollTop), w: Math.round(r.width), h: Math.round(r.height), dir: cs.flexDirection };
      }).filter(Boolean) : [];
      setAx((old) => (JSON.stringify(old) === JSON.stringify(na) ? old : na));
      if (!insp) return;
      const nb = [...d.querySelectorAll('[data-t]')].filter((e) => e.getClientRects().length).map((e) => {
        const r = e.getBoundingClientRect();
        return { x: Math.round(r.left - o.left + d.scrollLeft), y: Math.round(r.top - o.top + d.scrollTop), w: Math.round(r.width), h: Math.round(r.height), t: e.getAttribute('data-t'), hl: e.classList.contains('is-hl') };
      });
      setBoxes((old) => (JSON.stringify(old) === JSON.stringify(nb) ? old : nb));
      const page = d.closest('.kz-br-page');
      const h = d.querySelector('.is-hl');
      if (page && page.scrollHeight > page.clientHeight + 1) page.scrollTop = h ? Math.max(0, h.offsetTop - 30) : page.scrollTop;
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(d);
    [...d.querySelectorAll('[data-t]')].forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [key, insp, axes]); // eslint-disable-line react-hooks/exhaustive-deps
  const node = (el, i) => {
    const props = { key: el.k || i, className: 'c10-el c10-' + el.t + (el.cls ? ' ' + el.cls : '') + (el.hl ? ' is-hl' : ''), style: styleFor(R, el), 'data-t': el.t + (el.cls ? '.' + el.cls : '') };
    if (el.axes) props['data-axes'] = '1';
    if (el.t === 'a') { props.href = '#'; props.onClick = (e) => e.preventDefault(); props.tabIndex = -1; }
    const kids = el.kids ? el.kids.map((k, j) => (typeof k === 'string' ? k : node(Object.assign({ k: (el.k || i) + '-' + j }, k), j))) : el.text;
    return React.createElement(el.t, props, kids);
  };
  return (
    <div ref={ref} className={'c10-doc' + (insp ? ' is-insp' : '')} style={doc}>
      {[].concat(...els.map((el, i) => (i ? [' ', node(el, i)] : [node(el, i)])))}   {/* пробел между тегами, как перенос строки в HTML */}
      {insp ? boxes.map((b, i) => (
        <span key={'b' + i} className={'c10-ibox' + (b.hl ? ' is-hl' : '')} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} aria-hidden="true" />
      )) : null}
      {ax.map((a, i) => {
        const row = a.dir.indexOf('row') === 0, rev = /reverse$/.test(a.dir);
        return [
          <span key={'ah' + i} className={'c10-arr c10-arr-h ' + (row ? 'is-main' : 'is-cross') + (row && rev ? ' is-back' : '')} style={{ left: a.x, top: a.y + a.h + 7, width: a.w }} aria-hidden="true" />,
          <span key={'av' + i} className={'c10-arr c10-arr-v ' + (row ? 'is-cross' : 'is-main') + (!row && rev ? ' is-back' : '')} style={{ left: a.x - 10, top: a.y, height: a.h }} aria-hidden="true" />
        ];
      })}
      {ax.length ? <div className="c10-axleg" aria-hidden="true"><i className="is-main">{pick(UI.mainAx)}</i><i className="is-cross">{pick(UI.crossAx)}</i></div> : null}
      {insp && boxes.some((b) => b.hl) ? (
        <div className="c10-ilist" aria-hidden="true" translate="no">{boxes.filter((b) => b.hl).map((b, i) => <i key={i}>{b.t} {b.w}×{b.h}</i>)}</div>
      ) : null}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c10-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c10-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c10-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c10-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c10-edge' }), tagL('bo', 0, 'body', false, { cls: 'c10-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c10-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c10-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
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
const ruleParts = (sel, prop, val) => [P('s', 'c10-sel c10-part', sel), ' ', P('b', 'c10-punc', '{'), ' ', P('p', 'c10-prop', prop), P('c', 'c10-punc', ':'), ' ']
  .concat(val, [P('sc', 'c10-punc', ';'), ' ', P('b2', 'c10-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c10-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c10-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c10-cssline ' + (cls || '') });
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
const V = (t, cls) => [P('v', 'c10-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c10-sel c10-part', sel), ' ', P('b', 'c10-punc', '{')], { d: 1, cls: 'c10-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c10-prop', x.prop), P('c', 'c10-punc', ':'), ' '].concat(x.val, [P('sc', 'c10-punc', ';')]),
    { d: 2, cls: 'c10-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c10-punc', '}')], { d: 1, cls: 'c10-cssline ' + (cls || '') })]);
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
  <span key="g" className={'kz-gap c10-slot ' + (cls || 'c10-slot-col') + (led ? ' kz-gap-led' : '')}>
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
// Основа страницы (тусклая строка кода): у полки — сиреневые карточки с отступом, у меню — сиреневые ссылки.
const BASES = { shelf: ['.karta { background-color: lavender; margin: 4px; }'], menu: ['a { background-color: lavender; }'] };
const baseL = (page) => BASES[page || 'shelf'].map((r, i) => cssL('base' + i, 1, r, { cls: 'c10-dim' }));
const withBase = (list, page) => cssParse(BASES[page || 'shelf'].concat(list || []).join(' '));
// Экран «впиши значение»: правило sel { prop: [pre] ▢ [post]; } (и готовые правила given), страница честно.
function FillScreen({ p, c, F, sel, prop, want, given, hl, pre, post, propSlot, fixed, page }) {
  const pick = usePick();
  const v = F.T.okNow ? want : F.ty.val.trim();
  const full = [pre, v, post].filter(Boolean).join(' ');
  const rules = (given || []).concat([ruleTxt(sel, [propSlot ? [v || 'x', fixed] : [prop, full]])]);
  const slot = F.T.okNow ? [P('v', propSlot ? 'c10-prop' : 'c10-val', want)] : [<Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />];
  const val = [].concat(pre ? [P('pre', 'c10-val', pre), ' '] : [], slot, post ? [' ', P('post', 'c10-val', post)] : []);
  // Поле на месте свойства: «sel { ▢: fixed; }».
  const partsOf = () => (propSlot ? [P('s', 'c10-sel c10-part', sel), ' ', P('b', 'c10-punc', '{'), ' '].concat(slot, [P('c', 'c10-punc', ':'), ' ', P('fx', 'c10-val', fixed), P('sc', 'c10-punc', ';'), ' ', P('b2', 'c10-punc', '}')]) : ruleParts(sel, prop, val));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c10-sheet">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c10-s5 c10-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat((given || []).map((r, i) => cssL('g' + i, 1, r, { cls: 'c10-dim' })), [ruleLine('r', partsOf(), F.T.okNow ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl, page })} rules={withBase(rules, page)} /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={[]} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Экран-показ: шаги правил по очереди; steps[n] — список правил, hl[n] — подсвеченный элемент.
function ShowScreen({ p, c, id, steps, says, asks, pose, hl, page }) {
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
      <Sheet cls="c10-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c10-s5 c10-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat(rules.map((r, i) => cssL('r' + i + r, 1, r, { cls: live && prev.indexOf(r) < 0 ? 'is-new is-read' : '' }))))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl ? hl[Math.min(n, hl.length - 1)] : null, page })} rules={withBase(rules, page)} /></Br></div>
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


// ── СТРАНИЦЫ УРОКА ─────────────────────────────────────────────────────────
// shelf — полка игр: заголовок и div.javon (родитель, ось рисуется) с тремя div.karta (дети); menu — nav с тремя ссылками.
const site = (pick, o) => {
  const x = o || {};
  if (x.page === 'menu') {
    return [{ t: 'nav', k: 'nav', axes: true, hl: x.hl === 'nav', kids: [' ', { t: 'a', text: pick(C.menu.a1) }, ' ', { t: 'a', text: pick(C.menu.a2) }, ' ', { t: 'a', text: pick(C.menu.a3) }, ' '] }];
  }
  return [
    { t: 'h1', text: pick(C.site.title), k: 'h' },
    { t: 'div', cls: 'javon', k: 'j', axes: true, hl: x.hl === 'javon', kids: [1, 2, 3].map((n) => ({ t: 'div', cls: 'karta', text: pick(C.site['c' + n]), hl: x.hl === 'karta' })) }
  ];
};
const F = '.javon { display: flex; }';
const DIRS = ['row', 'column', 'row-reverse', 'column-reverse'];
const dirIssue = (w, msgs, want) => {
  const v = norm(w);
  if (!v) return msgs.empty;
  if (!cssOk('flex-direction', v)) return msgs.bad;
  if (v === want) return null;
  return msgs[v] || msgs.other;
};
// Строки HTML для экрана «какому тегу display: flex»: <tag class="…"> … </tag>.
const tagOpen = (t, cls, close) => (close ? [T_(t, true)] : [elParts({ t, cls })[0]]);
const htmlLine = (t, cls, text) => elParts({ t, cls, text });

// =============================================================================
// S1. КРЮЧОК — карточки полки стоят столбиком; «Превратить» — display: flex у родителя. Загадка: flex у самих карточек.
// =============================================================================
const S1_CSS = [F];
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
      <Sheet cls="c10-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c10-s5 c10-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: 'javon' })} rules={withBase(on ? S1_CSS : [])} /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// S2. РОДИТЕЛЬ И ДЕТИ (показ) — div.javon — родитель, div.karta — дети; display: flex у родителя ставит детей в ряд.
function S2({ p }) {
  const c = C.s2;
  return <ShowScreen p={p} c={c} id="s2"
    steps={[[], [F]]}
    says={[c.sayFlex]} hl={['karta', 'javon']}
    asks={{ list: [c.askStart, c.askFlex], done: c.askDone }} />;
}
// S3. ВПИШИ flex — .javon { display: ▢; } → flex.
function S3({ p }) {
  const c = C.s3;
  const Fl = useFill('s3', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (v === 'flexbox' || v === 'flex box') return c.msgs.flexbox;
    if (!cssOk('display', v)) return c.msgs.bad;
    return v === 'flex' ? null : (c.msgs[v] || c.msgs.other);
  });
  return <FillScreen p={p} c={c} F={Fl} sel=".javon" prop="display" want="flex" hl="javon" />;
}

// S4. КАКОМУ ТЕГУ? (выбор строки HTML) — display: flex пишут родителю: nav, ul, div.javon.
const S4_ROUNDS = [
  { t: 'nav', cls: null, kid: 'a', kids: ['m1', 'm2', 'm3'] },
  { t: 'ul', cls: null, kid: 'li', kids: ['l1', 'l2', 'l3'] },
  { t: 'div', cls: 'javon', kid: 'div', kidCls: 'karta', kids: ['c1', 'c2', 'c3'] }
];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? S4_ROUNDS.length - 1 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === S4_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const R = S4_ROUNDS[ri];
  const ch = useChoiceHints(!found, ri);
  const hints = [c.hint1, c.hint2, c.hint3];
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (j !== 0) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(j)); sayNow(ch.miss(c.child, hints), 'think'); return; }
    sfx('win', true); setFound(true); ch.clear();
    if (ri === S4_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 's4', type: 'pick-parent', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.right, c.ok), 'cheer');
    } else { sayNow(c.right, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const lit = ch.lad.lv >= 3;
  const tapLine = (j, parts, d) => ({
    k: 'r' + ri + 'l' + j, d, parts,
    cls: 'c10-hline' + (found && j === 0 ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0 && false) || (lit && j === 0))
  });
  const lines = [tapLine(0, tagOpen(R.t, R.cls), 0)]
    .concat(R.kids.map((k, i) => tapLine(i + 1, htmlLine(R.kid, R.kidCls, pick(C.s4.words[k])), 1)))
    .concat([{ k: 'r' + ri + 'z', d: 0, parts: tagOpen(R.t, null, true) }]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c10-sheet">
        <KzAsk text={found ? (done ? c.ok : c.right) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S4_ROUNDS.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm c10-html" /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S5. НАПРАВЛЕНИЕ (показ) — flex-direction: column → row-reverse → column-reverse; ось показывает направление.
function S5({ p }) {
  const c = C.s5;
  const d = (v) => '.javon { flex-direction: ' + v + '; }';
  return <ShowScreen p={p} c={c} id="s5"
    steps={[[F], [F, d('column')], [F, d('row-reverse')], [F, d('column-reverse')]]}
    says={[c.sayCol, c.sayRR, c.sayCR]} hl={['javon']}
    asks={{ list: [c.askStart, c.askCol, c.askRR, c.askCR], done: c.askDone }} />;
}
// S6. СТОЛБИКОМ — .javon { flex-direction: ▢; } → column.
function S6({ p }) {
  const c = C.s6;
  const Fl = useFill('s6', c, (w) => dirIssue(w, c.msgs, 'column'));
  return <FillScreen p={p} c={c} F={Fl} sel=".javon" prop="flex-direction" want="column" hl="javon" given={[F]} />;
}

// S7. КАКОЕ НАПРАВЛЕНИЕ? (выбор по одному) — полка с номерами, стрелок нет; три значения.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const R = useRounds('s7', c, c.rounds, (it) => it.want, (it) => it.why, (it) => it.want);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c10-sheet c10-pickpage">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase([F, '.javon { flex-direction: ' + R.it.want + '; }'])} insp={false} axes={R.ok} /></Br>
            <div className="kz-pick c10-opts c10-three">
              {R.it.opts.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c10-tf c10-opt ' + (R.ok && v === R.it.want ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && !R.ok && v === R.it.want ? ' is-led' : '')}>
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

// S8. ДВЕ ОСИ (показ) — главная ось по направлению, поперечная поперёк: высота полки — дети тянутся по поперечной оси.
function S8({ p }) {
  const c = C.s8;
  const H = '.javon { height: 120px; }';
  return <ShowScreen p={p} c={c} id="s8"
    steps={[[F], [F, H], [F, H, '.javon { flex-direction: column; }']]}
    says={[c.sayStretch, c.sayCol]} hl={['javon']}
    asks={{ list: [c.askStart, c.askStretch, c.askCol], done: c.askDone }} />;
}
// S9. ОСЬ СПРАВА НАЛЕВО — .javon { flex-direction: ▢; } → row-reverse.
function S9({ p }) {
  const c = C.s9;
  const Fl = useFill('s9', c, (w) => dirIssue(w, c.msgs, 'row-reverse'));
  return <FillScreen p={p} c={c} F={Fl} sel=".javon" prop="flex-direction" want="row-reverse" hl="javon" given={[F]} />;
}

// S10. КУДА ИДЁТ ГЛАВНАЯ ОСЬ? (Sort по одному) — значение flex-direction → стрелка.
const ARROWS = { r: '→', l: '←', d: '↓', u: '↑' };
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const R = useRounds('s10', c, c.items, (it) => it.right, (it) => it.why, (it) => pick(c.dirs[it.right]));
  const btn = (v) => (
    <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
      className={'kz-btn c10-tf c10-where c10-arrbtn ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
      <b aria-hidden="true">{ARROWS[v]}</b><span>{pick(c.dirs[v])}</span><Led on={R.led && !R.ok && R.off.length === 0} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c10-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <KzCode lines={[cssL('a', 0, F, { cls: 'c10-dim' }), cssL('b', 0, '.javon { flex-direction: ' + R.it.dir + '; }', { cls: 'is-hl' })]} cls="kz-code-sm" />
            <div className="kz-pick c10-sides">{btn('r')}{btn('l')}{btn('d')}{btn('u')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S11. КОГДА НЕ РАБОТАЕТ (показ) — «colum» с опечаткой; «flexbox» вместо flex; flex-direction без display: flex.
function S11({ p }) {
  const c = C.s11;
  return <ShowScreen p={p} c={c} id="s11" pose="curious"
    steps={[[F, '.javon { flex-direction: column; }'], [F, '.javon { flex-direction: colum; }'], ['.javon { display: flexbox; }'], ['.javon { flex-direction: row-reverse; }']]}
    says={[c.sayTypo, c.sayFlexbox, c.sayNoFlex]} hl={['javon']}
    asks={{ list: [c.askStart, c.askTypo, c.askFlexbox, c.askNoFlex], done: c.askDone }} />;
}

// S12. ИСПРАВЬ (Debug & Fix) — в поле «flexbox»: значение — просто flex.
function S12({ p }) {
  const c = C.s12;
  const Fl = useFill('s12', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (v.indexOf('flexbox') >= 0 || v === 'flex box') return c.msgs.flexbox;
    if (!cssOk('display', v)) return c.msgs.bad;
    return v === 'flex' ? null : c.msgs.other;
  }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !Fl.T.okNow && !Fl.ty.val) { set0.current = true; Fl.ty.setVal('flexbox'); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <FillScreen p={p} c={c} F={Fl} sel=".javon" prop="display" want="flex" hl="javon" />;
}

// S13. НАЙДИ ОШИБКУ (Error Detective) — раунд 1: «colum»; раунд 2: flex-direction без display: flex.
const S13_ROUNDS = [
  { kind: 'typo', bad: 2, rules: ['h1 { color: orange; }', F, '.javon { flex-direction: colum; }'], fixed: '.javon { flex-direction: column; }' },
  { kind: 'noflex', bad: 1, rules: ['.karta { padding: 8px; }', '.javon { flex-direction: row-reverse; }', 'h1 { font-size: 24px; }'], fixed: '.javon { display: flex; flex-direction: row-reverse; }' }
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
    k: 'l' + ri + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: cssTokens(r),
    cls: 'c10-cssline c10-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c10-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c10-s5 c10-pair c10-q1" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={found ? '' : 'c10-broken'}><CssPage els={site(pick)} rules={withBase(rules)} insp={false} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — меню столбиком через flex: «nav { display: flex; flex-direction: column; }».
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return msgs.colon;
  if (m[1].trim().toLowerCase() !== 'nav') return msgs.sel;
  const decl = {};
  inner.split(';').map((x) => x.trim()).filter(Boolean).forEach((d) => {
    const i = d.indexOf(':');
    if (i > 0) decl[d.slice(0, i).trim().toLowerCase()] = norm(d.slice(i + 1));
  });
  if (decl.display == null) return msgs.noFlex;
  if (!cssOk('display', decl.display)) return msgs.bad;
  if (decl.display !== 'flex') return msgs.noFlex;
  if (decl['flex-direction'] == null) return msgs.noDir;
  if (!cssOk('flex-direction', decl['flex-direction'])) return msgs.bad;
  if (decl['flex-direction'] !== 'column') return msgs.dir;
  return null;
}
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 64 });
  const T = useTypeTask('w1', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const css = T.okNow ? 'nav { display: flex; flex-direction: column; }' : ty.val;
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
      <Sheet cls="c10-sheet c10-w1">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c10-s5 c10-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL('menu').concat([T.okNow ? cssL('r', 1, css, { cls: 'is-new' }) : ruleLine('r', [<span key="g" className={'kz-gap c10-slot c10-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={64} /></span>], 'is-hl')]))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { page: 'menu', hl: T.okNow ? null : 'nav' })} rules={withBase([css], 'menu')} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['{', '}', ':', ';', '-']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// S14. СВОЯ ПОЛКА (Live Code Preview, «Готово») — направление, фон и padding карточек: любые настоящие значения.
const OWN = [{ k: 'myDir', sel: '.javon', prop: 'flex-direction', f: 'fa', max: 16 }, { k: 'myBg', sel: '.karta', prop: 'background-color', f: 'fb', max: 16 }, { k: 'myPad', sel: '.karta', prop: 'padding', f: 'fc', max: 10 }];
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
    if (!cssOk('flex-direction', norm(v[0]))) return fillL(c.msgs.dir, { w: v[0] });
    if (!cssOk('background-color', norm(v[1]))) return fillL(c.msgs.color, { w: v[1] });
    if (!cssOk('padding', norm(v[2]))) return fillL(c.msgs.pad, { w: v[2] });
    return null;
  };
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = issueOf();
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    OWN.forEach((o, i) => store.set(o.k, v[i])); put({ done: true });
    log({ screenId: 's14', type: 'own-shelf', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, direction: v[0], color: v[1], padding: v[2] });
    sayNow(c.ok, 'cheer');
  };
  const rules = [F].concat(OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + v[i] + '; }'));
  const field = (i) => (
    <span key={OWN[i].f} className={'kz-gap c10-slot c10-slot-col' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={OWN[i].f}>
      <InlineInput value={vals[i]} onChange={(x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={OWN[i].max} />
    </span>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c10-sheet kz-typed c10-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={site(pick)} rules={cssParse(rules.join(' '))} insp={false} /></Br>
            <KzCode lines={styleWrap([cssL('f', 1, F, { cls: 'c10-dim' })].concat(OWN.map((o, i) => ruleLine(o.f, ruleParts(o.sel, o.prop, [solved ? P('v', 'c10-val', v[i]) : field(i)]), solved ? 'is-new' : 'is-hl'))))} cls="kz-code-sm" />
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
      className={'kz-btn c10-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = { col: [cssL('a', 0, F), cssL('c', 0, '.javon { flex-direction: column; }')] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c10-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c10-card c10-tf-card kz-a-drop">
              <span className="c10-card-h">{pick(c.card)}</span>
              <p className="c10-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c10-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S15. ВЫВОД — разгадка: display: flex у карточек не ставит их в ряд; у родителя — ставит; своя полка; роли.
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const own = [store.get('myDir') || 'row', store.get('myBg') || 'gold', store.get('myPad') || '12px'];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle' || curK === 'riddle2';
  const rows = curK === 'riddle' ? ['.karta { display: flex; }'] : curK === 'riddle2' ? [F] : [F].concat(OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + own[i] + '; }'));
  const ex = { flex: '.javon', dir: 'column', main: '→', cross: '↓' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c10-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'javon' : null })} rules={riddle ? withBase(rows) : cssParse(rows.join(' '))} insp={riddle} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['flex', 'dir', 'main', 'cross'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" /><span translate="no">{pick(c.roles[k])}</span>{curK === k ? <code className="c10-role-ex" translate="no">{ex[k]}</code> : null}
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
// «Повторить» стирает только экран; своя полка ученика (myDir, myBg, myPad) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя полка ученика.
function lessonCss10Artifact(store) {
  const v = OWN.map((o) => store.get(o.k) || '');
  if (!v.some(Boolean)) return null;
  return { type: 'html-page', direction: v[0], color: v[1], padding: v[2],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening javonim</title>', '    <style>', '      ' + F]
      .concat(OWN.map((o, i) => '      ' + o.sel + ' { ' + o.prop + ': ' + escHtml(v[i]) + '; }'),
        ['    </style>', '  </head>', '  <body>', '    <div class="javon">', '      <div class="karta">Futbol</div>', '      <div class="karta">Shaxmat</div>', '      <div class="karta">Suzish</div>', '    </div>', '  </body>', '</html>']).join('\n') };
}

export default function CssFlexOsi({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss10Artifact(store) })
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
