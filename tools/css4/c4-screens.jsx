// =============================================================================
// ЭКРАНЫ УРОКА 4 КУРСА CSS «Фон» (облик «Редактор», 05.11.2026). Основа кода — урок 3 курса CSS (tools/css3/).
// Типы заданий — по разделу 3а навыка: s3 вписать цвет фона — s4 что покрасило правило; s6 собрать url — s7 какой
// код у страницы; s9 вписать no-repeat — s10 плиткой или одна; s12 вписать url( — s13 найти сломанное правило;
// w1 правило целиком; s14 свой фон; q1 верно или нет. Экрана плана нет.
// Честный браузер: верная ли запись — решает Chrome (CSS.supports); картинки — файлы урока (FILES), чужое имя —
// картинки нет; маленькая картинка повторяется плиткой; фон body — на всё окно. Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'background-image', 'background-repeat', 'background-size', 'background-position'];
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
const sp = () => <span className="c4-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c4-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c4-mark c4-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c4-sel c4-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c4-sel c4-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c4-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c4-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c4-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c4-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c4-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c4-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c4-att c4-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c4-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c4-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
// Страница: элементы { t, text, cls, id, k, hl } и правила. tap(i) — экран «какие покрасит» (по номеру элемента);
// mark — номера отмеченных; led — номер с огоньком.
const BG_KEYS = ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition'];
function CssPage({ els, rules, tap, tapBody, mark, led, off }) {
  const R = rules || [];
  const ref = useFitPage(JSON.stringify([els.map((b) => [b.t, b.k, b.text, b.cls, b.id, b.hl]), R.map((r) => [r.sel, r.decls]), mark, off]));
  const body = styleFor(R, { t: 'body' });
  const doc = Object.assign({}, body);
  BG_KEYS.forEach((k) => { delete doc[k]; });
  const bgKey = JSON.stringify(BG_KEYS.map((k) => body[k] || ''));
  useLayoutEffect(() => {
    const el = ref.current && ref.current.closest('.kz-br-body');
    if (el) BG_KEYS.forEach((k) => { el.style[k] = body[k] || ''; });
  }, [bgKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className={'c4-doc' + (tapBody ? ' is-tap' : '')} style={doc} onClick={tapBody ? (e) => { if (e.target === e.currentTarget) tapBody(); } : undefined}>
      {els.map((el, i) => {
        const c = 'c4-blk c4-' + el.t + (el.hl ? ' is-hl' : '') + (mark && mark.indexOf(i) >= 0 ? ' is-mark' : '') + (off && off.indexOf(i) >= 0 ? ' is-off' : '') + (tap ? ' is-tap' : '');
        return (
          <div key={el.k || i} className={c} style={el.t === 'raw' ? {} : styleFor(R, el)} data-i={i}
            onClick={tap ? () => tap(i) : undefined}>{el.text}{led === i ? <Led on /> : null}</div>
        );
      })}
      {led === 'body' ? <Led on /> : null}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c4-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c4-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c4-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c4-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c4-edge' }), tagL('bo', 0, 'body', false, { cls: 'c4-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c4-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c4-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
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
const ruleParts = (sel, prop, val) => [P('s', 'c4-sel c4-part', sel), ' ', P('b', 'c4-punc', '{'), ' ', P('p', 'c4-prop', prop), P('c', 'c4-punc', ':'), ' ']
  .concat(val, [P('sc', 'c4-punc', ';'), ' ', P('b2', 'c4-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c4-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c4-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c4-cssline ' + (cls || '') });
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


// ── ФАЙЛЫ УРОКА: картинки фона (свои SVG, имена — как у файлов сайта) ───────
const svgUri = (s) => 'data:image/svg+xml,' + encodeURIComponent(s);
const FILES = {
  'maydon.jpg': svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='130' viewBox='0 0 220 130'><rect width='220' height='130' fill='#3E9B4F'/><g fill='#4BAE5C'><rect x='0' width='22' height='130'/><rect x='44' width='22' height='130'/><rect x='88' width='22' height='130'/><rect x='132' width='22' height='130'/><rect x='176' width='22' height='130'/></g><g fill='none' stroke='#fff' stroke-width='2' opacity='.92'><rect x='6' y='6' width='208' height='118'/><line x1='110' y1='6' x2='110' y2='124'/><circle cx='110' cy='65' r='20'/><rect x='6' y='38' width='26' height='54'/><rect x='188' y='38' width='26' height='54'/></g><circle cx='110' cy='65' r='2.5' fill='#fff'/></svg>"),
  'osmon.jpg': svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='130' viewBox='0 0 220 130'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#5DB4F0'/><stop offset='1' stop-color='#D2EEFF'/></linearGradient></defs><rect width='220' height='130' fill='url(#g)'/><circle cx='178' cy='34' r='16' fill='#FFD54A'/><g fill='#fff'><ellipse cx='58' cy='46' rx='26' ry='10'/><ellipse cx='74' cy='39' rx='16' ry='11'/><ellipse cx='132' cy='90' rx='30' ry='10'/><ellipse cx='148' cy='83' rx='15' ry='10'/></g></svg>"),
  'futbol.png': svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><circle cx='28' cy='28' r='15' fill='#fff' stroke='#1F2430' stroke-width='1.6'/><path d='M28 21.5l6.2 4.5-2.4 7.3h-7.6l-2.4-7.3z' fill='#1F2430'/><path d='M28 13v8.5M34.2 26l7.6-2.6M31.8 33.3l4.6 6.4M24.2 33.3l-4.6 6.4M21.8 26l-7.6-2.6' stroke='#1F2430' stroke-width='1.4' fill='none'/></svg>"),
  'yulduz.png': svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 40 40'><path d='M20 8.5l3.4 6.9 7.6 1.1-5.5 5.3 1.3 7.6L20 25.8l-6.8 3.6 1.3-7.6-5.5-5.3 7.6-1.1z' fill='#FFB020' stroke='#E08A00' stroke-width='1.2' stroke-linejoin='round'/></svg>")
};
const FILE_NAMES = Object.keys(FILES);
// url("имя") → настоящий файл урока; имени нет среди файлов — картинки нет (как «файл не найден»).
function bgUrl(v) {
  return String(v).replace(/url\(\s*(["']?)([^"')]*)\1\s*\)/gi, (m, q, name) => (FILES[name.trim()] ? 'url("' + FILES[name.trim()] + '")' : 'none'));
}
const imgOf = (name) => (FILES[name] ? { backgroundImage: 'url("' + FILES[name] + '")' } : {});
// Код в три и больше строк: «sel {», объявления, «}». decls — [{ prop, val: [куски], cls }].
const V = (t, cls) => [P('v', 'c4-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c4-sel c4-part', sel), ' ', P('b', 'c4-punc', '{')], { d: 1, cls: 'c4-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c4-prop', x.prop), P('c', 'c4-punc', ':'), ' '].concat(x.val, [P('sc', 'c4-punc', ';')]),
    { d: 2, cls: 'c4-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c4-punc', '}')], { d: 1, cls: 'c4-cssline ' + (cls || '') })]);
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
function FilesBar({ lit, names }) {
  const pick = usePick();
  return (
    <div className="c4-files" aria-hidden="true">
      <span className="c4-files-h"><Icon name="doc" size={14} />{pick(C.site.files)}</span>
      {(names || FILE_NAMES).map((n) => (
        <span key={n} className={'c4-file' + (lit === n ? ' is-on' : '')} data-file={n}>
          <i style={imgOf(n)} /><b translate="no">{n}</b>
        </span>
      ))}
    </div>
  );
}
// Мини-страница с фоном из кода (для выбора и сортировки).
const thumbStyle = (code) => {
  const st = styleFor(cssParse('body { ' + code.replace(/\n/g, ' ') + ' }'), { t: 'body' });
  return BG_KEYS.reduce((o, k) => (st[k] ? Object.assign(o, { [k]: st[k] }) : o), {});
};
const site = (pick) => [
  { t: 'h1', text: pick(C.site.title), k: 'h' },
  { t: 'p', text: pick(C.site.p1), k: 'p1' },
  { t: 'p', text: pick(C.site.p2), k: 'p2' }
];

// =============================================================================
// S1. КРЮЧОК — белый сайт клуба; «Превратить» — поле за страницей (cover), белые полосы под заголовком и абзацами.
// HTML не тронут. Загадка: Коди написал «background-image: "maydon.jpg";» без url( ).
// =============================================================================
const S1_CSS = ['body { background-image: url("maydon.jpg"); background-size: cover; }', 'h1 { background-color: white; }', 'p { background-color: white; }'];
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
  const lines = on ? blockOf('b', S1_CSS[0], 'is-new').concat([cssL('h', 1, S1_CSS[1], { cls: 'is-new' }), cssL('p', 1, S1_CSS[2], { cls: 'is-new' })])
    : [codeLine('e', [P('e', 'c4-raw', ' ')], { d: 1, cls: 'is-hl' })];
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={on ? cssParse(S1_CSS.join(' ')) : []} /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ФОН ЭЛЕМЕНТА (показ) — body светло-зелёный → h1 золотой (полоса на всю ширину) → p белые.
// =============================================================================
const S2_CSS = ['body { background-color: #DFF3E4; }', 'h1 { background-color: gold; }', 'p { background-color: white; }'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayH1, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayP, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const css = S2_CSS.slice(0, n + 1);
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askP : n === 1 ? c.askH1 : c.askStart;
  const els = site(pick).map((el) => Object.assign({}, el, { hl: live && ((n === 1 && el.t === 'h1') || (n === 2 && el.t === 'p')) }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(css.map((r, i) => cssL('r' + i, 1, r, { cls: live && i === n && n > 0 ? 'is-new is-read' : i === n && n > 0 ? 'is-new' : '' })))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(css.join(' '))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ФОН ЗАГОЛОВКА (Fill in the Blanks) — на зелёной странице «h1 { background-color: ▢; }»: белый (любая запись).
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 24 });
  const T = useTypeTask('s3', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const v = T.okNow ? 'white' : ty.val.trim();
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const w = ty.val.trim();
    const issue = !w ? c.msgs.empty : !cssOk('color', w) ? c.msgs.notColor : colorKey(w) === colorKey('white') ? null : c.msgs.other;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-bg-color', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv, value: w });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const val = T.okNow ? V(v) : [<span key="g" className={'kz-gap c4-slot c4-slot-col' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={24} /></span>];
  const css = 'body { background-color: green; } h1 { background-color: ' + v + '; }';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap([cssL('b', 1, 'body { background-color: green; }', { cls: 'c4-dim' }), ruleLine('r', ruleParts('h1', 'background-color', val), T.okNow ? 'is-new' : 'is-hl')])} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick).map((el) => Object.assign({}, el, { hl: el.t === 'h1' && !T.okNow }))} rules={cssParse(css)} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 2} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ЧТО ПОКРАСИЛО (Visual Code Mapping) — три правила фона (body, h1, p); горит одно — ученик нажимает на
// странице то, что оно покрасило (пустое место страницы — это body). Три раунда.
// =============================================================================
const S4_CSS = ['body { background-color: lavender; }', 'h1 { background-color: gold; }', 'p { background-color: white; }'];
const S4_ROUNDS = ['p', 'body', 'h1'];
const S4_LINE = { body: 0, h1: 1, p: 2 };
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? S4_ROUNDS.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ri === S4_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const kind = S4_ROUNDS[ri];
  const ch = useChoiceHints(!ok, ri);
  const hints = choiceHints(c.hint1, c.hint2, c.why[kind], C.site.names[kind]);
  const led = useIdleLed(canTap && !ok, ri * 10 + off.length);
  const els = site(pick);
  const pickIt = (t, i) => {
    if (!canTap || ok) return;
    if (i != null && off.indexOf(i) >= 0) return;
    st.current.tries += 1;
    if (t !== kind) {
      st.current.misses += 1; sfx('soft', true);
      if (i != null) setOff(off.concat(i));
      sayNow(ch.miss(c.why[kind], hints), 'think');
      return;
    }
    sfx('ok', true); setOk(true); ch.clear();
    if (ri === S4_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 's4', type: 'map-background', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(c.ok, 'cheer');
    } else { sayNow(c.got, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setOk(false); setOff([]); }, reduceMotion() ? 300 : 900);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const lit = ch.lad.lv >= 3 && !ok ? (kind === 'body' ? 'body' : els.findIndex((el) => el.t === kind)) : null;
  const mark = ok ? els.map((el, i) => (el.t === kind ? i : -1)).filter((i) => i >= 0) : [];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet c4-tapsheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S4_ROUNDS.length} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(S4_CSS.map((r, i) => cssL('r' + i, 1, r, { cls: i === S4_LINE[kind] ? (ok ? 'is-new' : 'is-hl') : 'c4-dim' })))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls="c4-maptap"><CssPage els={els} rules={cssParse(S4_CSS.join(' '))}
            tap={done || !canTap ? null : (i) => pickIt(els[i].t, i)} tapBody={done || !canTap ? null : () => pickIt('body', null)}
            mark={mark} off={off} led={lit != null ? lit : null} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. КАРТИНКА НА ФОНЕ (показ) — «body { background-image: url("yulduz.png"); }»: url и имя файла; маленькая
// звёздочка повторяется плиткой на весь фон.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayUrl, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayTile, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const css = 'body { background-image: url("yulduz.png"); }';
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askTile : n === 1 ? c.askUrl : c.askStart;
  const lines = n ? blockOf('b', css, live && n === 1 ? 'is-new is-read' : 'is-new', live && n === 1 ? 0 : null) : [codeLine('e', [P('e', 'c4-raw', ' ')], { d: 1 })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap(lines)} cls="kz-code-sm" />
            <FilesBar lit={live && n >= 1 ? 'yulduz.png' : null} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={live && n === 2 ? 'c4-zoomtile' : ''}><CssPage els={site(pick)} rules={n ? cssParse(css) : []} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ url (Code Builder) — «background-image: ▢▢▢;» из кусков url( · "osmon.jpg" · ) и лишнего src=.
// =============================================================================
const S6_TRAY = ['file', 'src', 'close', 'url'];
const S6_WANT = ['url', 'file', 'close'];
const S6_TXT = { url: 'url(', file: '"osmon.jpg"', close: ')', src: 'src=' };
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S6_WANT.slice() : []);
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
    if (id !== S6_WANT[got.length]) {
      st.current.misses += 1;
      const m = id === 'src' ? c.why.src : c.why.order;
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
      log({ screenId: 's6', type: 'build-url', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const slot = (i) => (got[i] ? <span key={'s' + i} className="c4-built c4-a-in c4-val">{S6_TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm c4-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  const lines = blockL('b', 'body', [{ prop: 'background-image', val: [slot(0), slot(1), slot(2)] }], done ? 'is-new' : 'is-hl');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/3'} />
        <div className={'kz-scene c4-s5 c4-pair c4-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={done ? cssParse('body { background-image: url("osmon.jpg"); }') : []} /></Br></div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code c4-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === S6_WANT[got.length] ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, S6_TXT[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{S6_TXT[id]}</span><Led on={led} />
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
// S7. КАКОЙ КОД? (выбор, по одному) — мини-страница с фоном и три кода: звёзды, голубой цвет, поле.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.rounds.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.rounds.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + off.length);
  const it = c.rounds[ii];
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, it.want);
  const choose = (v) => {
    if (!canTap || ok || off.indexOf(v) >= 0) return;
    st.current.tries += 1;
    if (v !== it.want) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(v)); sayNow(ch.miss(it.why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's7', type: 'pick-background', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff([]); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c4-card c4-thumb-card kz-a-drop"><div className="c4-thumb" style={thumbStyle(it.want)}><b>{pick(C.site.title)}</b></div></div>
            <div className="kz-pick c4-opts">
              {it.opts.map((v) => (
                <button key={v} type="button" disabled={!canTap || ok || off.indexOf(v) >= 0} onClick={() => choose(v)} data-v={v}
                  className={'kz-btn c4-tf c4-opt ' + (ok && v === it.want ? 'is-ok' : off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (ch.lad.lv >= 3 && !ok && v === it.want ? ' is-led' : '')}>
                  <span translate="no">{v}</span><Led on={led && !ok && off.length === 0} />
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
// S8. ПОВТОР И РАЗМЕР (показ) — мячи плиткой → no-repeat (один в углу) → большое небо одно (сбоку пусто) → cover.
// =============================================================================
const S8_STEPS = [
  [['background-image', 'url("futbol.png")']],
  [['background-image', 'url("futbol.png")'], ['background-repeat', 'no-repeat']],
  [['background-image', 'url("osmon.jpg")'], ['background-repeat', 'no-repeat']],
  [['background-image', 'url("osmon.jpg")'], ['background-repeat', 'no-repeat'], ['background-size', 'cover']]
];
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayOne, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayBig, pose: 'think' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayCover, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const dec = S8_STEPS[n];
  const changed = (i) => live && ((n === 1 && i === 1) || (n === 2 && i === 0) || (n === 3 && i === 2));
  const lines = blockL('b', 'body', dec.map(([pr, v], i) => ({ prop: pr, val: V(v), key: pr + v, cls: changed(i) ? 'is-new is-read' : '' })), '');
  const css = 'body { ' + dec.map(([pr, v]) => pr + ': ' + v + ';').join(' ') + ' }';
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askCover : n === 2 ? c.askBig : n === 1 ? c.askOne : c.askStart;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={cssParse(css)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ОДИН МЯЧ (Fill in the Blanks) — «background-repeat: ▢;» → no-repeat. «no repeat» с пробелом браузер
// не принимает (честно: мячи остаются плиткой).
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 16 });
  const T = useTypeTask('s9', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const v = T.okNow ? 'no-repeat' : ty.val.trim();
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const w = ty.val.trim().toLowerCase();
    const issue = !w ? c.msgs.empty : /^no\s+repeat$/.test(w) ? c.msgs.space : w === 'repeat' ? c.msgs.repeat : w === 'no-repeat' ? null : c.msgs.other;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-no-repeat', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const field = T.okNow ? V(v) : [<span key="g" className={'kz-gap c4-slot c4-slot-col' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={16} /></span>];
  const lines = blockL('b', 'body', [{ prop: 'background-image', val: V('url("futbol.png")'), cls: '' }, { prop: 'background-repeat', val: field, cls: T.okNow ? 'is-new' : 'is-hl' }], '');
  const css = 'body { background-image: url("futbol.png"); background-repeat: ' + v + '; }';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={cssParse(css)} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['-']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 5} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ПЛИТКОЙ ИЛИ ОДНА (Sort по одному) — код фона body; после ответа мини-страница показывает результат.
// =============================================================================
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.items.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, C.site[it.right]);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) { st.current.misses += 1; sfx('soft', true); setOff(v); sayNow(ch.miss(it.why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 's10', type: 'sort-repeat', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = (v) => (
    <button key={v} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)} data-v={v}
      className={'kz-btn c4-tf c4-where ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(C.site[v])}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c4-card c4-tf-card c4-sortcard kz-a-drop">
              <span className="c4-card-h">{pick(c.card)}</span>
              <pre className="c4-code-t" translate="no">{it.code}</pre>
              <div className={'c4-thumb c4-thumb-sm' + (ok ? ' is-on' : '')} style={ok ? thumbStyle(it.code) : {}} />
            </div>
            <div className="kz-pick c4-tf-pick">{btn('tile')}{btn('one')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. КОГДА КАРТИНКИ НЕТ (показ) — поле; без url — пусто; опечатка «maydn.jpg» — пусто; + background-color:
// green — виден запасной цвет.
// =============================================================================
const S11_STEPS = [
  [['background-image', 'url("maydon.jpg")'], ['background-size', 'cover']],
  [['background-image', '"maydon.jpg"'], ['background-size', 'cover']],
  [['background-image', 'url("maydn.jpg")'], ['background-size', 'cover']],
  [['background-color', 'green'], ['background-image', 'url("maydn.jpg")'], ['background-size', 'cover']]
];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setN(1); } }, { say: [{ text: c.sayNoUrl, pose: 'think' }] },
    { act: () => { sfx('soft', true); setN(2); } }, { say: [{ text: c.sayTypo, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayBackup, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const dec = S11_STEPS[n];
  const lines = blockL('b', 'body', dec.map(([pr, v]) => ({ prop: pr, val: V(v, live && pr === 'background-image' && (n === 1 || n === 2) ? 'c4-bad' : ''), key: pr + v,
    cls: live && ((n < 3 && n > 0 && pr === 'background-image') || (n === 3 && pr === 'background-color')) ? 'is-new is-read' : '' })), '');
  const css = 'body { ' + dec.map(([pr, v]) => pr + ': ' + v + ';').join(' ') + ' }';
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askBackup : n === 2 ? c.askTypo : n === 1 ? c.askNoUrl : c.askDone;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap(lines)} cls="kz-code-sm" />
            <FilesBar lit={live && n === 2 ? 'maydon.jpg' : null} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={live && (n === 1 || n === 2) ? 'c4-broken' : ''}><CssPage els={site(pick)} rules={cssParse(css)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ПОСТАВЬ url( (Debug & Fix) — «background-image: ▢"maydon.jpg");» — ученик пишет «url(».
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 8 });
  const T = useTypeTask('s12', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const w = T.okNow ? 'url(' : ty.val.replace(/\s+/g, '');
  const value = w + '"maydon.jpg")';
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const x = ty.val.replace(/\s+/g, '');
    const issue = !x ? c.msgs.empty : /^url$/i.test(x) ? c.msgs.paren : /^url\($/i.test(x) && cssOk('background-image', x + '"maydon.jpg")') ? null : c.msgs.other;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's12', type: 'fix-url', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const val = T.okNow ? V('url("maydon.jpg")') : [<span key="g" className={'kz-gap c4-slot c4-slot-sign' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={8} /></span>,
    P('v', 'c4-val', '"maydon.jpg")')];
  const lines = blockL('b', 'body', [{ prop: 'background-image', val, cls: T.okNow ? 'is-new' : 'is-hl' }, { prop: 'background-size', val: V('cover'), cls: '' }], '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={T.okNow ? '' : 'c4-broken'}><CssPage els={site(pick)} rules={cssParse('body { background-image: ' + value + '; background-size: cover; }')} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['url(', '(', '"']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. НАЙДИ ОШИБКУ (Error Detective) — раунд 1: «osmon.jpeg» при файле osmon.jpg (неба нет); раунд 2:
// «no repeat» с пробелом (мячи плиткой). Ученик нажимает сломанную строку.
// =============================================================================
const S13_ROUNDS = [
  { kind: 'file', bad: 0, rules: ['body { background-image: url("osmon.jpeg"); }', 'h1 { background-color: white; }', 'p { color: navy; }'], fixed: 'body { background-image: url("osmon.jpg"); }' },
  { kind: 'space', bad: 2, rules: ['h1 { color: darkgreen; }', 'body { background-image: url("futbol.png"); }', 'body { background-repeat: no repeat; }'], fixed: 'body { background-repeat: no-repeat; }' }
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
    cls: 'c4-cssline c4-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c4-s5 c4-pair c4-q1" key={'q' + ri}>
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm" />
            <FilesBar />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={found ? '' : 'c4-broken'}><CssPage els={site(pick)} rules={cssParse(rules.join(' '))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — «body { background-image: url("yulduz.png"); }». Браузер честно применяет
// написанное; проверка называет одну, самую полезную проблему.
// =============================================================================
const W1_FILE = 'yulduz.png';
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return msgs.colon;
  if (m[1].trim().toLowerCase() !== 'body') return msgs.sel;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim();
  if (prop !== 'background-image') return msgs.prop;
  if (!/^url\s*\(/i.test(val)) return msgs.noUrl;
  const u = /^url\(\s*(["']?)([^"')]*)\1\s*\)$/i.exec(val);
  if (!u || !cssOk(prop, val)) return msgs.broken;
  const name = u[2].trim();
  if (!FILES[name]) return msgs.noFile;
  if (name !== W1_FILE) return msgs.other;
  return null;
}
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 60 });
  const T = useTypeTask('w1', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const css = T.okNow ? 'body { background-image: url("' + W1_FILE + '"); }' : ty.val;
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
      <Sheet cls="c4-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c4-s5 c4-pair">
          <div className="kz-col"><KzCode lines={styleWrap(T.okNow ? blockOf('b', css, 'is-new') : [ruleLine('r', [<span key="g" className={'kz-gap c4-slot c4-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={60} /></span>], 'is-hl')])} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={cssParse(css)} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['{', '}', ':', ';', '(', ')', '"']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 10} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. СВОЙ ФОН (Live Code Preview, «Готово») — картинка фона страницы (имя файла из «Файлов») и цвет фона
// заголовка (любой). Браузер показывает сразу; «Готово» — когда файл есть и цвет настоящий.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const store = useStore();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [a, setA] = useState(store.get('myImg') || '');
  const [b, setB] = useState(store.get('myHeadBg') || '');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !a, 0);
  const va = a.trim(), vb = b.trim();
  const ready = !!(va && vb);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = !FILES[va] ? fillL(c.msgs.noFile, { w: va }) : !cssOk('color', vb) ? fillL(c.msgs.notColor, { w: vb }) : null;
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    store.set('myImg', va); store.set('myHeadBg', vb); put({ done: true });
    log({ screenId: 's14', type: 'own-background', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, image: va, color: vb });
    sayNow(c.ok, 'cheer');
  };
  const css = 'body { background-image: url("' + va + '"); } h1 { background-color: ' + vb + '; }';
  const field = (val, set, k, cls) => (
    <span key={k} className={'kz-gap c4-slot ' + cls + (led && k === 'fa' ? ' kz-gap-led' : '')} data-f={k}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={24} /></span>
  );
  const imgVal = solved ? V('url("' + va + '")') : [P('u', 'c4-val', 'url("'), field(a, setA, 'fa', 'c4-slot-file'), P('u2', 'c4-val', '")')];
  const els = [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.p2), k: 'p1' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet kz-typed c4-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={els} rules={cssParse(css)} /></Br>
            <KzCode lines={styleWrap(blockL('b', 'body', [{ prop: 'background-image', val: imgVal }], solved ? 'is-new' : 'is-hl')
              .concat([ruleLine('h', ruleParts('h1', 'background-color', [solved ? P('v', 'c4-val', vb) : field(b, setB, 'fb', 'c4-slot-col')]), solved ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" />
            {!solved ? <FilesBar /> : null}
          </div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q1. ВЕРНО ИЛИ НЕТ (True / False) — четыре утверждения; ступени подсказки — как во всех выборах.
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
      className={'kz-btn c4-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = {
    img: blockL('i', 'body', [{ prop: 'background-image', val: V('url("osmon.jpg")') }], '').map((l) => Object.assign({}, l, { d: l.d - 1 })),
    backup: blockL('b', 'body', [{ prop: 'background-color', val: V('green') }, { prop: 'background-image', val: V('url("maydn.jpg")') }], '').map((l) => Object.assign({}, l, { d: l.d - 1 }))
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c4-card c4-tf-card kz-a-drop">
              <span className="c4-card-h">{pick(c.card)}</span>
              <p className="c4-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c4-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: «background-image: "maydon.jpg";» без url — фон пустой; своя страница ученика со своим
// фоном; роли background-color / background-image / background-repeat загораются, пока Коди их называет.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const mi = store.get('myImg') || 'osmon.jpg', mh = store.get('myHeadBg') || 'white';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const css = riddle ? 'body { background-image: "maydon.jpg"; }' : 'body { background-image: url("' + mi + '"); } h1 { background-color: ' + mh + '; }';
  const lines = riddle ? blockL('r', 'body', [{ prop: 'background-image', val: V('"maydon.jpg"', 'c4-bad') }], 'is-read')
    : blockL('b', 'body', [{ prop: 'background-image', val: V('url("' + mi + '")') }], '').concat([cssL('h', 1, 'h1 { background-color: ' + mh + '; }')]);
  const els = riddle ? site(pick) : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.p2), k: 'p1' }];
  const ex = { color: 'gold', image: 'url("osmon.jpg")', repeat: 'no-repeat' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c4-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={els} rules={cssParse(css)} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={lines.map((l) => Object.assign({}, l, { d: Math.max(0, l.d - 1) }))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['color', 'image', 'repeat'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'image') ? ' is-on' : '')} style={{ '--c': k === 'color' ? '#FA4F28' : k === 'image' ? '#7C5CFA' : '#0FA38E' }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}{curK === k ? <code className="c4-role-ex" translate="no">{ex[k]}</code> : null}
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
// «Повторить» стирает только экран; свой фон ученика (myImg, myHeadBg) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя страница ученика со своим фоном.
function lessonCss4Artifact(store) {
  const mi = store.get('myImg'), mh = store.get('myHeadBg');
  if (!mi && !mh) return null;
  return { type: 'html-page', image: mi || '', headingBackground: mh || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening saytim</title>', '    <style>',
      '      body { background-image: url("' + escHtml(mi || '') + '"); }', '      h1 { background-color: ' + escHtml(mh || '') + '; }', '    </style>', '  </head>', '  <body>',
      '    <h1>Mening saytim</h1>', "    <p>Bizga qo'shiling!</p>", '  </body>', '</html>'].join('\n') };
}

export default function CssFon({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss4Artifact(store) })
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
