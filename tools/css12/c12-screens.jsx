// =============================================================================
// ЭКРАНЫ УРОКА 12 КУРСА CSS «Позиционирование» (облик «Редактор», 06.11.2026). Основа кода — урок 11 (tools/css11/).
// Типы заданий — по разделу 3а навыка: s3 вписать relative — s4 сдвиг ↔ куда поехал; s6 вписать relative родителю —
// s7 где окажется метка; s9 вписать fixed — s10 какое значение position нужно; s12 исправить «relativ» — s13 найти
// правило, которое не работает; w1 правило целиком (метка в левый нижний угол); s14 своя метка; q1 верно или нет.
// Честный браузер: relative и absolute считает сам браузер (страница — static, как body); fixed — слой, прилипший к окну
// браузера урока. Бумаги нет.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'border-radius', 'box-shadow', 'border-top', 'border-right', 'border-bottom', 'border-left', 'display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap', 'position', 'top', 'right', 'bottom', 'left'];
const cssOk = (p, v) => {
  if (CSS_PROPS.indexOf(p) < 0 || !v) return false;
  try { return typeof CSS === 'undefined' || !CSS.supports ? true : CSS.supports(p, v); } catch (e) { return false; }
};
// Русские (кириллические) буквы вместо латинских (09.11.2026, проход «слабого ученика»): «рх», «р» выглядят как px, p —
// своя причина раньше любой проверки, иначе ученик видит «верный» ответ и не понимает отказа.
const CYR_MSG = L3("Harflar kirillchada yozilganga o'xshaydi. CSS lotin harflarida yoziladi: klaviaturani EN ga almashtiring va qaytadan yozing.",
  'Похоже, буквы набраны по-русски. В CSS пишут английскими буквами: переключи клавиатуру на EN и набери ещё раз.',
  'Looks like some letters are Cyrillic. CSS uses English letters: switch your keyboard to EN and type again.');
const cyrIn = (...vs) => (vs.some((x) => /[\u0400-\u04FF]/.test(String(x == null ? '' : x))) ? CYR_MSG : null);
// Лишняя «;» в конце значения (ученик помнит, что правило кончается ею) — не ошибка: значение без неё.
const noSemi = (s) => String(s || '').replace(/[“”«»„]/g, '"').trim().replace(/;+\s*$/, '').trim();
// Образец на третьей ступени помощи (09.11.2026, проход «слабого ученика»): третья подсказка звучит словами — без
// символов, а на экране под кодом печатью стоит готовый ответ; ученик переписывает его сам и жмёт «Проверить».
const HELP_CODE = L3('Namuna', 'Образец', 'Example');
function HelpCode({ code }) {
  const pick = usePick();
  return <div className="kz-helpcode" translate="no"><span>{pick(HELP_CODE)}</span><code>{code}</code></div>;
}
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
const sp = () => <span className="c12-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c12-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c12-mark c12-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c12-sel c12-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c12-sel c12-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c12-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c12-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c12-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c12-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c12-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c12-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c12-att c12-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c12-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c12-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
      // Урок 12: шрифт не ужимаем — длинная страница должна прокручиваться (показ fixed).
      while (false && page.scrollHeight > page.clientHeight + 1 && k > 0.8) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
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
function CssPage({ els, rules, insp = true, scroll = null }) {
  const R = rules || [];
  const ref = useFitPage(JSON.stringify([els, R.map((r) => [r.sel, r.decls])]));
  const doc = Object.assign({}, styleFor(R, { t: 'body' }));
  const [boxes, setBoxes] = useState([]);
  const [ph, setPh] = useState(0);
  const key = JSON.stringify([els, R.map((r) => [r.sel, r.decls])]);
  const hlDone = useRef(null);
  // Страница — обычный поток (static), как body: «absolute» без родителя-якоря считается от страницы окна.
  // Координаты «Инспектора» — от страницы окна с её прокруткой.
  useLayoutEffect(() => {
    const d = ref.current;
    const page = d && d.closest('.kz-br-page');
    if (!d || !page) return undefined;
    const measure = () => {
      setPh((old) => (old === page.clientHeight ? old : page.clientHeight));
      // К подсвеченному — один раз на каждую новую страницу (13.11.2026: раньше это шло и на каждую прокрутку, и окно
      // возвращалось назад — страницу на телефоне нельзя было листать пальцем).
      if (scroll == null && hlDone.current !== key) {
        const h = d.querySelector('.is-hl');
        if (page.scrollHeight > page.clientHeight + 1 && h && getComputedStyle(h).position !== 'fixed') {
          page.scrollTop = Math.max(0, h.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 30);
          hlDone.current = key;
        } else if (!h) hlDone.current = key;
      }
      if (!insp) return;
      const o = page.getBoundingClientRect();
      const nb = [...d.querySelectorAll('[data-t]')].filter((e) => e.getClientRects().length).map((e) => {
        const r = e.getBoundingClientRect();
        return { x: Math.round(r.left - o.left + page.scrollLeft), y: Math.round(r.top - o.top + page.scrollTop), w: Math.round(r.width), h: Math.round(r.height), t: e.getAttribute('data-t'), hl: e.classList.contains('is-hl') };
      });
      setBoxes((old) => (JSON.stringify(old) === JSON.stringify(nb) ? old : nb));
    };
    measure();
    page.addEventListener('scroll', measure, { passive: true });
    if (typeof ResizeObserver === 'undefined') return () => page.removeEventListener('scroll', measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(d); ro.observe(page);
    [...d.querySelectorAll('[data-t]')].forEach((c) => ro.observe(c));
    return () => { ro.disconnect(); page.removeEventListener('scroll', measure); };
  }, [key, insp, scroll]); // eslint-disable-line react-hooks/exhaustive-deps
  // Прокрутка страницы по шагу показа: 0 — верх, 1 — низ.
  useEffect(() => {
    const page = ref.current && ref.current.closest('.kz-br-page');
    if (!page || scroll == null) return undefined;
    const to = Math.round(scroll * Math.max(0, page.scrollHeight - page.clientHeight));
    // Своя плавная прокрутка (behavior: 'smooth' в окне урока не срабатывает): 12 шагов по 25 мс.
    if (reduceMotion()) { page.scrollTop = to; return undefined; }
    const from = page.scrollTop;
    let i = 0;
    const iv = setInterval(() => { i += 1; const k = i / 12; page.scrollTop = Math.round(from + (to - from) * (1 - (1 - k) * (1 - k))); if (i >= 12) clearInterval(iv); }, 25);
    return () => { clearInterval(iv); page.scrollTop = to; };
  }, [scroll, key]); // eslint-disable-line react-hooks/exhaustive-deps
  const node = (el, i, fixedLayer) => {
    const st = styleFor(R, el);
    const props = { key: el.k || i, className: 'c12-el c12-' + el.t + (el.cls ? ' ' + el.cls : '') + (el.hl ? ' is-hl' : ''), style: fixedLayer ? Object.assign({}, st, { position: 'absolute' }) : st, 'data-t': el.t + (el.cls ? '.' + el.cls.split(' ').join('.') : '') };
    if (fixedLayer) props['data-fixed'] = '1';
    if (el.t === 'a') { props.href = '#'; props.onClick = (e) => e.preventDefault(); props.tabIndex = -1; }
    const kids = el.kids ? el.kids.map((k, j) => (typeof k === 'string' ? k : node(Object.assign({ k: (el.k || i) + '-' + j }, k), j))) : el.text;
    return React.createElement(el.t, props, kids);
  };
  // position: fixed — слой, прилипший к видимой части окна браузера (sticky): страница прокручивается, слой — нет.
  // Так fixed держится окна браузера урока, а не всего экрана ученика.
  const isFixed = (el) => styleFor(R, el).position === 'fixed';
  const fixedEls = els.filter(isFixed);
  const flowEls = els.filter((el) => !isFixed(el));
  return (
    <div ref={ref} className={'c12-doc' + (insp ? ' is-insp' : '')} style={doc}>
      <div className="c12-fixlayer" style={{ height: ph, marginBottom: -ph }} aria-hidden={fixedEls.length ? undefined : 'true'}>
        {fixedEls.map((el, i) => node(el, 'f' + i, true))}
      </div>
      {[].concat(...flowEls.map((el, i) => (i ? [' ', node(el, i)] : [node(el, i)])))}   {/* пробел между тегами, как перенос строки в HTML */}
      {insp ? boxes.map((b, i) => (
        <span key={'b' + i} className={'c12-ibox' + (b.hl ? ' is-hl' : '')} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} aria-hidden="true" />
      )) : null}
      {insp && boxes.some((b) => b.hl) ? (
        <div className="c12-ilist" aria-hidden="true" translate="no">{boxes.filter((b) => b.hl).map((b, i) => <i key={i}>{b.t} {b.w}×{b.h}</i>)}</div>
      ) : null}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c12-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c12-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c12-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c12-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c12-edge' }), tagL('bo', 0, 'body', false, { cls: 'c12-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c12-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c12-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
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
const ruleParts = (sel, prop, val) => [P('s', 'c12-sel c12-part', sel), ' ', P('b', 'c12-punc', '{'), ' ', P('p', 'c12-prop', prop), P('c', 'c12-punc', ':'), ' ']
  .concat(val, [P('sc', 'c12-punc', ';'), ' ', P('b2', 'c12-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c12-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c12-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c12-cssline ' + (cls || '') });
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
const V = (t, cls) => [P('v', 'c12-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c12-sel c12-part', sel), ' ', P('b', 'c12-punc', '{')], { d: 1, cls: 'c12-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c12-prop', x.prop), P('c', 'c12-punc', ':'), ' '].concat(x.val, [P('sc', 'c12-punc', ';')]),
    { d: 2, cls: 'c12-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c12-punc', '}')], { d: 1, cls: 'c12-cssline ' + (cls || '') })]);
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
  <span key="g" className={'kz-gap c12-slot ' + (cls || 'c12-slot-col') + (led ? ' kz-gap-led' : '')}>
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
    const issue = cyrIn(ty.val) || issueOf(noSemi(ty.val));
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
// Основа страницы (тусклые строки кода): у каждой страницы своя.
const BASES = {
  card: ['.karta { background-color: lavender; padding: 16px; }', '.belgi { background-color: orange; }'],
  boxes: ['.quti { background-color: lavender; }', '.ikki { background-color: orange; }'],
  long: ['.tugma { background-color: gold; padding: 6px; }']
};
const baseL = (page) => (BASES[page] || BASES.card).map((r, i) => cssL('base' + i, 1, r, { cls: 'c12-dim' }));
const withBase = (list, page) => cssParse((BASES[page] || BASES.card).concat(list || []).join(' '));
// Экран «впиши значение»: правило sel { prop: [pre] ▢ [post]; } (и готовые правила given), страница честно.
function FillScreen({ p, c, F, sel, prop, want, given, hl, pre, post, propSlot, fixed, page, scroll }) {
  const pick = usePick();
  const v = F.T.okNow ? want : noSemi(F.ty.val);
  const full = [pre, v, post].filter(Boolean).join(' ');
  const rules = (given || []).concat([ruleTxt(sel, [propSlot ? [v || 'x', fixed] : [prop, full]])]);
  const slot = F.T.okNow ? [P('v', propSlot ? 'c12-prop' : 'c12-val', want)] : [<Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />];
  const val = [].concat(pre ? [P('pre', 'c12-val', pre), ' '] : [], slot, post ? [' ', P('post', 'c12-val', post)] : []);
  // Поле на месте свойства: «sel { ▢: fixed; }».
  const partsOf = () => (propSlot ? [P('s', 'c12-sel c12-part', sel), ' ', P('b', 'c12-punc', '{'), ' '].concat(slot, [P('c', 'c12-punc', ':'), ' ', P('fx', 'c12-val', fixed), P('sc', 'c12-punc', ';'), ' ', P('b2', 'c12-punc', '}')]) : ruleParts(sel, prop, val));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c12-s5 c12-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat((given || []).map((r, i) => cssL('g' + i, 1, r, { cls: 'c12-dim' })), [ruleLine('r', partsOf(), F.T.okNow ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" />{!F.T.okNow && F.T.lad.lv >= 3 ? <HelpCode code={want} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl, page })} rules={withBase(rules, page)} scroll={scroll == null ? null : scroll} /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={[]} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Экран-показ: шаги правил по очереди; steps[n] — список правил, hl[n] — подсвеченный элемент.
// Помощь на экране-объяснении (заказчик, 09.11.2026): ступени 1-2-3 по лампочке (useKzLadder) — 1 на что смотреть,
// 2 что это значит, 3 пример из жизни. now — открытая ступень с номером «2/3» для панели, next — текст следующей
// ступени без номера: его читает вслух лампочка.
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
function ShowScreen({ p, c, id, steps, says, asks, pose, hl, page, scrolls }) {
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
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c12-s5 c12-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat(rules.map((r, i) => cssL('r' + i + r, 1, r, { cls: live && prev.indexOf(r) < 0 ? 'is-new is-read' : '' }))))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl ? hl[Math.min(n, hl.length - 1)] : null, page })} rules={withBase(rules, page)} scroll={scrolls ? scrolls[n] : null} /></Br></div>
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
// card — карточка с меткой «YANGI» внутри; boxes — три коробки (вторая двигается); long — длинная страница с кнопкой.
const site = (pick, o) => {
  const x = o || {};
  if (x.page === 'boxes') {
    return ['bir', 'ikki', 'uch'].map((c, i) => ({ t: 'div', cls: 'quti ' + c, k: c, text: String(i + 1), hl: x.hl === c }));
  }
  if (x.page === 'long') {
    return [{ t: 'h1', text: pick(C.long.title), k: 'h' }]
      .concat([1, 2, 3, 4].map((i) => ({ t: 'p', k: 'p' + i, text: pick(C.long['p' + i]) })),
        [{ t: 'a', cls: 'tugma', k: 'tg', text: pick(C.long.btn), hl: x.hl === 'tugma' }]);
  }
  return [
    { t: 'h1', text: pick(C.site.title), k: 'h' },
    { t: 'div', cls: 'karta', k: 'k', hl: x.hl === 'karta', kids: [{ t: 'span', cls: 'belgi', text: pick(C.site.badge), hl: x.hl === 'belgi' }, ' ' + pick(C.site.card)] },
    { t: 'p', k: 'p', text: pick(C.site.p) }
  ];
};
const POS = ['static', 'relative', 'absolute', 'fixed'];
const posIssue = (w, msgs, want) => {
  const v = norm(w);
  if (!v) return msgs.empty;
  if (!cssOk('position', v)) return msgs.bad;
  if (v === want) return null;
  return msgs[v] || msgs.other;
};
const REL = '.karta { position: relative; }';
const BADGE = '.belgi { position: absolute; top: 0px; right: 0px; }';
const ABS_BTN = '.tugma { position: absolute; bottom: 10px; right: 10px; }';
const FIX_BTN = '.tugma { position: fixed; bottom: 10px; right: 10px; }';
// Мини-картинка сдвига: пунктир — прежнее место, кубик — где он теперь (position: relative и сдвиг).
const MiniShift = ({ decl }) => <span className="c12-mshift"><i className="c12-ghost" /><i className="c12-mbox" style={cssStyle('position: relative; ' + decl)} /></span>;

// =============================================================================
// S1. КРЮЧОК — метка «YANGI» в строке текста, кнопка «Наверх» — в самом низу страницы; «Превратить» — метка в углу
// карточки, кнопка — в углу окна. Загадка: absolute метке без relative у карточки.
// =============================================================================
const S1_CSS = [REL, BADGE];
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
  const lines = baseL('card').concat(on ? S1_CSS.map((r, i) => cssL('r' + i, 1, r, { cls: 'is-new' })) : []);
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c12-s5 c12-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: 'belgi' })} rules={withBase(on ? S1_CSS : [], 'card')} /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// S2. relative (показ) — сама по себе ничего не меняет; top: вниз, left: вправо; прежнее место остаётся пустым.
function S2({ p }) {
  const c = C.s2;
  const R0 = '.ikki { position: relative; }';
  return <ShowScreen p={p} c={c} id="s2" page="boxes"
    steps={[[], [R0], [R0, '.ikki { top: 20px; }'], [R0, '.ikki { top: 20px; }', '.ikki { left: 40px; }']]}
    says={[c.sayRel, c.sayTop, c.sayLeft]} hl={['ikki']}
    asks={{ list: [c.askStart, c.askRel, c.askTop, c.askLeft], done: c.askDone }} />;
}
// S3. ВПИШИ relative — .ikki { position: ▢; } при top 20px и left 40px.
function S3({ p }) {
  const c = C.s3;
  const Fl = useFill('s3', c, (w) => posIssue(w, c.msgs, 'relative'));
  return <FillScreen p={p} c={c} F={Fl} sel=".ikki" prop="position" want="relative" hl="ikki" page="boxes" given={['.ikki { top: 20px; left: 40px; }']} />;
}

// S4. НАЙДИ ПАРУ (Matching Pairs) — сдвиг ↔ куда поехал кубик.
const S4_CODES = ['top', 'left', 'bottom'];
const S4_CARDS = ['left', 'bottom', 'top'];
function S4({ p }) {
  const log = useLog();
  const pick = usePick();
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
      log({ screenId: 's4', type: 'match-offset', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene c12-match">
          <div className="c12-match-col">
            {S4_CODES.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code c12-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{t + ': 14px'}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="c12-match-col">
            {S4_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'c12-mcard c12-shapecard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <MiniShift decl={k + ': 14px;'} />
                  {ok ? <span className="c12-mcard-tag">{pick(c.dir[k])}</span> : null}
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

// S5. absolute (показ) — метка выпала из строки → top 0, right 0 — в угол страницы → у карточки relative — в угол карточки.
function S5({ p }) {
  const c = C.s5;
  const A0 = '.belgi { position: absolute; }';
  return <ShowScreen p={p} c={c} id="s5" page="card"
    steps={[[], [A0], [BADGE], [BADGE, REL]]}
    says={[c.sayOut, c.sayCorner, c.sayParent]} hl={['belgi']}
    asks={{ list: [c.askStart, c.askOut, c.askCorner, c.askParent], done: c.askDone }} />;
}
// S6. ЯКОРЬ — .karta { position: ▢; } при метке absolute top 0 right 0 → relative.
function S6({ p }) {
  const c = C.s6;
  const Fl = useFill('s6', c, (w) => posIssue(w, c.msgs, 'relative'));
  return <FillScreen p={p} c={c} F={Fl} sel=".karta" prop="position" want="relative" hl="belgi" page="card" given={[BADGE]} />;
}

// S7. ГДЕ МЕТКА? (выбор по одному) — карточка с меткой в углу; какие сдвиги её туда поставили.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const R = useRounds('s7', c, c.rounds, (it) => it.want, (it) => it.why, (it) => it.want);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c12-sheet c12-pickpage">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase([REL, '.belgi { position: absolute; ' + R.it.want + ' }'], 'card')} insp={false} /></Br>
            <div className="kz-pick c12-opts">
              {R.it.opts.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c12-tf c12-opt ' + (R.ok && v === R.it.want ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && !R.ok && v === R.it.want ? ' is-led' : '')}>
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

// S8. fixed (показ) — кнопка absolute уезжает с прокруткой; fixed — остаётся в углу окна.
function S8({ p }) {
  const c = C.s8;
  return <ShowScreen p={p} c={c} id="s8" page="long"
    steps={[[ABS_BTN], [ABS_BTN], [FIX_BTN], [FIX_BTN]]} scrolls={[0, 1, 1, 0]}
    says={[c.sayAway, c.sayFixed, c.sayTop]} hl={['tugma']}
    asks={{ list: [c.askStart, c.askAway, c.askFixed, c.askTop], done: c.askDone }} />;
}
// S9. ВПИШИ fixed — .tugma { position: ▢; } при bottom 10px и right 10px; страница прокручена вниз.
function S9({ p }) {
  const c = C.s9;
  const Fl = useFill('s9', c, (w) => posIssue(w, c.msgs, 'fixed'));
  return <FillScreen p={p} c={c} F={Fl} sel=".tugma" prop="position" want="fixed" hl="tugma" page="long" given={['.tugma { bottom: 10px; right: 10px; }']} scroll={1} />;
}

// S10. КАКОЕ ЗНАЧЕНИЕ? (Sort по одному) — задача словами → static, relative, absolute или fixed.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const R = useRounds('s10', c, c.items, (it) => it.right, (it) => it.why, (it) => it.right);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <div className="c12-card c12-tf-card kz-a-drop">
              <span className="c12-card-h">{pick(c.card)}</span>
              <p className="c12-tf-t">{pick(R.it.t)}</p>
            </div>
            <div className="kz-pick c12-sides">
              {POS.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c12-tf c12-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
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

// S11. КОГДА НЕ РАБОТАЕТ (показ) — top без position; «positon» с опечаткой; «top: 20» без px.
function S11({ p }) {
  const c = C.s11;
  return <ShowScreen p={p} c={c} id="s11" pose="curious" page="boxes"
    steps={[['.ikki { position: relative; top: 20px; }'], ['.ikki { top: 20px; }'], ['.ikki { positon: relative; top: 20px; }'], ['.ikki { position: relative; top: 20; }']]}
    says={[c.sayNoPos, c.sayTypo, c.sayNoUnit]} hl={['ikki']}
    asks={{ list: [c.askStart, c.askNoPos, c.askTypo, c.askNoUnit], done: c.askDone }} />;
}

// S12. ИСПРАВЬ (Debug & Fix) — в поле «relativ»: не хватает буквы.
function S12({ p }) {
  const c = C.s12;
  // Начало слова relative без конца («relativ») — точная причина «не хватает буквы в конце»; другие опечатки — общая.
  const Fl = useFill('s12', c, (w) => { const v = norm(w); return v && v !== 'relative' && 'relative'.indexOf(v) === 0 ? c.msgs.short : posIssue(w, c.msgs, 'relative'); }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !Fl.T.okNow && !Fl.ty.val) { set0.current = true; Fl.ty.setVal('relativ'); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <FillScreen p={p} c={c} F={Fl} sel=".ikki" prop="position" want="relative" hl="ikki" page="boxes" given={['.ikki { top: 20px; left: 40px; }']} />;
}

// S13. НАЙДИ ОШИБКУ (Error Detective) — раунд 1: top без position; раунд 2: «absolut» с опечаткой.
const S13_ROUNDS = [
  { kind: 'nopos', bad: 1, page: 'boxes', rules: ['.quti { padding: 6px; }', '.ikki { top: 30px; left: 30px; }', '.uch { background-color: gold; }'], fixed: '.ikki { position: relative; top: 30px; left: 30px; }' },
  { kind: 'typo', bad: 1, page: 'card', rules: [REL, '.belgi { position: absolut; top: 0px; right: 0px; }', 'h1 { color: orange; }'], fixed: BADGE }
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
    cls: 'c12-cssline c12-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c12-s5 c12-pair c12-q1" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={found ? '' : 'c12-broken'}><CssPage els={site(pick, { page: R.page })} rules={withBase(rules, R.page)} insp={false} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — метка в левый нижний угол: «.belgi { position: absolute; bottom: 0px; left: 0px; }».
const zero = (v) => v === '0' || v === '0px';
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return msgs.colon;
  // Два свойства без «;» между ними или кусок без двоеточия — своя причина (09.11.2026), а не «браузер не узнал слово».
  const chunks = inner.split(';').map((x) => x.trim()).filter(Boolean);
  if (chunks.some((d) => (d.match(/:/g) || []).length > 1)) return msgs.semi;
  if (chunks.some((d) => d.indexOf(':') < 0)) return msgs.colon;
  if (chunks.some((d) => /\d\s+px\b/i.test(d))) return msgs.space;
  if (m[1].trim().toLowerCase() !== '.belgi') return msgs.sel;
  const decl = {};
  inner.split(';').map((x) => x.trim()).filter(Boolean).forEach((d) => {
    const i = d.indexOf(':');
    if (i > 0) decl[d.slice(0, i).trim().toLowerCase()] = norm(d.slice(i + 1));
  });
  if (decl.position == null) return msgs.noPos;
  if (!cssOk('position', decl.position)) return msgs.bad;
  if (decl.position !== 'absolute') return msgs.notAbs;
  if (decl.bottom == null || decl.left == null) return msgs.side;
  if (!zero(decl.bottom) || !zero(decl.left) || decl.top != null || decl.right != null) return msgs.other;
  return null;
}
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 72 });
  const T = useTypeTask('w1', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const css = T.okNow ? '.belgi { position: absolute; bottom: 0px; left: 0px; }' : ty.val;
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const issue = cyrIn(ty.val) || (ruleIssue(ty.val, c.msgs));
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
      <Sheet cls="c12-sheet c12-w1">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c12-s5 c12-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL('card').concat([cssL('rel', 1, REL, { cls: 'c12-dim' }), T.okNow ? cssL('r', 1, css, { cls: 'is-new' }) : ruleLine('r', [<span key="g" className={'kz-gap c12-slot c12-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={72} /></span>], 'is-hl')]))} cls="kz-code-sm" />{!T.okNow && T.lad.lv >= 3 ? <HelpCode code={'.belgi { position: absolute; bottom: 0px; left: 0px; }'} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: T.okNow ? null : 'belgi' })} rules={withBase([REL, css], 'card')} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['{', '}', ':', ';', '.']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// S14. СВОЯ МЕТКА (Live Code Preview, «Готово») — сдвиги сверху и справа и цвет метки: любые настоящие значения.
const OWN = [{ k: 'myTop', sel: '.belgi', prop: 'top', f: 'fa', max: 8 }, { k: 'myRight', sel: '.belgi', prop: 'right', f: 'fb', max: 8 }, { k: 'myBg', sel: '.belgi', prop: 'background-color', f: 'fc', max: 16 }];
const OWN_GIVEN = [REL, '.belgi { position: absolute; }'];
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
    if (!cssOk('top', norm(v[0]))) return fillL(c.msgs.len, { w: v[0] });
    if (!cssOk('right', norm(v[1]))) return fillL(c.msgs.len, { w: v[1] });
    if (!cssOk('background-color', norm(v[2]))) return fillL(c.msgs.color, { w: v[2] });
    return null;
  };
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = cyrIn([].concat(v).join(" ")) || issueOf();
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    OWN.forEach((o, i) => store.set(o.k, v[i])); put({ done: true });
    log({ screenId: 's14', type: 'own-badge', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, top: v[0], right: v[1], color: v[2] });
    sayNow(c.ok, 'cheer');
  };
  const rules = OWN_GIVEN.concat(OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + v[i] + '; }'));
  const field = (i) => (
    <span key={OWN[i].f} className={'kz-gap c12-slot c12-slot-col' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={OWN[i].f}>
      <InlineInput value={vals[i]} onChange={(x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={OWN[i].max} />
    </span>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c12-sheet kz-typed c12-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={site(pick)} rules={withBase(rules, 'card')} insp={false} /></Br>
            <KzCode lines={styleWrap(OWN_GIVEN.map((r, i) => cssL('g' + i, 1, r, { cls: 'c12-dim' })).concat(OWN.map((o, i) => ruleLine(o.f, ruleParts(o.sel, o.prop, [solved ? P('v', 'c12-val', v[i]) : field(i)]), solved ? 'is-new' : 'is-hl'))))} cls="kz-code-sm" />
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
      className={'kz-btn c12-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = { badge: [cssL('c', 0, BADGE)], nopos: [cssL('c', 0, '.ikki { top: 30px; }')] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c12-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c12-card c12-tf-card kz-a-drop">
              <span className="c12-card-h">{pick(c.card)}</span>
              <p className="c12-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c12-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S15. ВЫВОД — разгадка: absolute без relative у карточки — метка в углу страницы; с relative — в углу карточки; своя метка; роли.
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const own = [store.get('myTop') || '8px', store.get('myRight') || '8px', store.get('myBg') || 'gold'];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle' || curK === 'riddle2';
  const mine = OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + own[i] + '; }');
  const rows = curK === 'riddle' ? [BADGE] : curK === 'riddle2' ? [REL, BADGE] : mine;   // в коде — свои строки ученика
  const pageRules = riddle ? rows : OWN_GIVEN.concat(mine);   // на странице — и якорь с absolute
  const ex = { rel: 'relative', abs: 'absolute', anchor: '.karta', fix: 'fixed' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c12-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'belgi' : null })} rules={withBase(pageRules, 'card')} insp={riddle} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['rel', 'abs', 'anchor', 'fix'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" /><span translate="no">{pick(c.roles[k])}</span>{curK === k ? <code className="c12-role-ex" translate="no">{ex[k]}</code> : null}
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
// «Повторить» стирает только экран; своя метка ученика (myTop, myRight, myBg) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя карточка с меткой.
function lessonCss12Artifact(store) {
  const v = OWN.map((o) => store.get(o.k) || '');
  if (!v.some(Boolean)) return null;
  return { type: 'html-page', top: v[0], right: v[1], color: v[2],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening kartochkam</title>', '    <style>'].concat(BASES.card.concat(OWN_GIVEN).map((r) => '      ' + r),
      OWN.map((o, i) => '      ' + o.sel + ' { ' + o.prop + ': ' + escHtml(v[i]) + '; }'),
      ['    </style>', '  </head>', '  <body>', '    <div class="karta"><span class="belgi">YANGI</span> Bugun yangi o\'yin chiqdi!</div>', '  </body>', '</html>']).join('\n') };
}

export default function CssPozicionirovanie({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss12Artifact(store) })
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
