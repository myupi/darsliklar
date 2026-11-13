// =============================================================================
// ЭКРАНЫ УРОКА 16 КУРСА CSS «Адаптивность» (облик «Редактор», 07.11.2026). Основа кода — урок 15 (tools/css15/).
// Типы заданий — по разделу 3а навыка: s3 вписать 100% — s4 px или %; s6 вписать 600px — s7 сработает ли @media;
// s9 вписать none — s10 в @media или всегда; s12 исправить условие без скобок — s13 найти правило; w1 правило @media
// целиком (спрятать баннер на телефоне); s14 своя адаптивная страница; q1 верно или нет.
// Честный браузер: ширина окна (vw) — настоящая ширина страницы (800 — компьютер, 360 — телефон), страница уменьшается,
// чтобы влезть в окно урока; @media (max-width / min-width) решает по этой ширине, условие проверяет matchMedia. Бумаги нет.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'border-radius', 'box-shadow', 'border-top', 'border-right', 'border-bottom', 'border-left', 'display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap', 'position', 'top', 'right', 'bottom', 'left', 'transform', 'cursor', 'transition', 'animation'];
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
// Селектор: тег, .class или #id (ровно один простой селектор, как в уроке), с :hover на конце или без.
// «.tugma :hover» (с пробелом) — уже другой селектор: «то, над чем мышь, внутри .tugma»; у кнопки внутри ничего нет.
function selOf(raw) {
  let s = String(raw || '').trim();
  let hover = false;
  const h = /^(\S+):hover$/.exec(s);
  if (h) { hover = true; s = h[1]; }
  let m = /^\.(-?[A-Za-z_][\w-]*)$/.exec(s);
  if (m) return { kind: 'cls', name: m[1], spec: 10 + (hover ? 10 : 0), hover };
  m = /^#(-?[A-Za-z_][\w-]*)$/.exec(s);
  if (m) return { kind: 'id', name: m[1], spec: 100 + (hover ? 10 : 0), hover };
  m = /^([A-Za-z][A-Za-z0-9]*)$/.exec(s);
  if (m) return { kind: 'tag', name: m[1].toLowerCase(), spec: 1 + (hover ? 10 : 0), hover };
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
// @keyframes имя { from { … } 50% { … } to { … } } — рецепт движения. Кадр с неверным выбором (например «50» без %)
// браузер выбрасывает; свойства кадра проверяет Chrome (CSS.supports), как и в правилах.
const KF_RE = /^@keyframes\s+([A-Za-z_][\w-]*)\s*\{([\s\S]*)\}\s*$/;
const isKf = (t) => /^\s*@keyframes\b/.test(String(t || ''));
function kfParse(text) {
  const m = KF_RE.exec(String(text || '').trim());
  if (!m) return null;
  const frames = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let f;
  while ((f = re.exec(m[2]))) {
    const sels = f[1].split(',').map((x) => x.trim().toLowerCase());
    if (!sels.every((x) => x === 'from' || x === 'to' || /^\d+(\.\d+)?%$/.test(x))) continue;
    const decls = [];
    f[2].split(';').forEach((d) => {
      const i = d.indexOf(':');
      if (i < 0) return;
      const pp = d.slice(0, i).trim().toLowerCase(), v = d.slice(i + 1).trim();
      if (cssOk(pp, v)) decls.push({ p: pp, v });
    });
    frames.push({ sel: sels.join(', '), decls });
  }
  return { name: m[1], frames };
}
// Как браузер поймёт значение animation (через настоящий стиль) — для проверок: имя, время, повторы, скорость, направление.
function animOf(v) {
  try {
    const d = document.createElement('div');
    d.style.animation = String(v || '');
    if (!d.style.animation) return null;
    return { name: d.style.animationName, dur: d.style.animationDuration, count: d.style.animationIterationCount, fn: d.style.animationTimingFunction, dir: d.style.animationDirection };
  } catch (e) { return null; }
}
// Подходит ли правило элементу { t, cls: 'a b', id }.
const matches = (sel, el, hovered) => {
  if (sel.hover && !hovered) return false;
  if (sel.kind === 'tag') return sel.name === el.t;
  if (sel.kind === 'cls') return String(el.cls || '').split(/\s+/).indexOf(sel.name) >= 0;
  if (sel.kind === 'id') return el.id === sel.name;
  return false;
};
const camel = (p) => p.replace(/-([a-z])/g, (a, b) => b.toUpperCase());
const styleFor = (rules, el, hovered) => {
  const st = {};
  rules.filter((r) => matches(r.sel, el, hovered)).sort((a, b) => a.sel.spec - b.sel.spec || a.n - b.n)
    .forEach((r) => r.decls.forEach((d) => { st[camel(d.p)] = d.v; }));
  if (st.backgroundImage) st.backgroundImage = bgUrl(st.backgroundImage);
  return st;
};
// Пробел в строке редактора — свой кусок (строка — flex, голые пробелы схлопываются).
const sp = () => <span className="c16-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c16-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c16-mark c16-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c16-sel c16-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c16-sel c16-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c16-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c16-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c16-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c16-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c16-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c16-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c16-att c16-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c16-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c16-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
  return [open, W_(el.text), T_(el.t, true)];
}

function useFitPage(dep, off) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page || off) return undefined;   // урок 16: страница своей ширины уменьшается целиком (scale), шрифт не ужимаем
    const fit = () => {
      let k = 1;
      el.style.fontSize = '';
      // Страница короткая — шрифт ужимаем, чтобы она влезла целиком. Увеличенная кнопка страницу не ужимает:
      // у .c16-doc overflow: clip. Пока ужимаем — класс is-fit (transition: none), иначе при «all» шрифт кнопки
      // сам плавно уменьшался бы (переход font-size), а замер шёл бы по ещё большому шрифту.
      el.classList.add('is-fit');
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.7) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
      void getComputedStyle(el.querySelector('[data-hk]') || el).fontSize;   // стиль посчитан без перехода
      el.classList.remove('is-fit');
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    // Ужатие — в следующем кадре: fit сам меняет размеры, внутри наблюдателя это зацикливало бы ResizeObserver.
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
    ro.observe(page);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
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
// Курсор мыши показа (как в уроках 4–5 курса HTML): стрелка, над элементом с cursor: pointer — рука.
const MouseCur = ({ at }) => (
  <span className={'c16-mouse' + (at.hand ? ' is-hand' : '')} style={{ left: at.x + 'px', top: at.y + 'px' }} aria-hidden="true">
    {at.hand
      ? <svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 2.5c-.9 0-1.6.7-1.6 1.6v8.6l-1.3-1.4c-.6-.7-1.7-.7-2.3-.1-.6.6-.6 1.5-.1 2.1l4.2 5.6c.8 1.1 2.1 1.7 3.4 1.7h3.6c2.2 0 4-1.8 4-4v-5.1c0-.9-.7-1.6-1.6-1.6-.4 0-.7.1-1 .4v-.3c0-.9-.7-1.6-1.6-1.6-.5 0-.9.2-1.2.5-.2-.7-.8-1.2-1.5-1.2-.4 0-.8.1-1.1.4V4.1c0-.9-.7-1.6-1.6-1.6z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" /></svg>
      : <svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 2.5 L5 19.5 L9.4 15.4 L12.3 21.6 L15.2 20.3 L12.4 14.3 L18.4 14.1 Z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
  </span>
);
// Полоса анимаций (урок 15) — как панель анимаций в DevTools: имя анимации, сколько секунд один раз, сколько раз
// (∞ — infinite) и полоса, что бежит так же (то же время, скорость, повторы и направление) — по данным самого браузера:
// событие animationstart и getComputedStyle. Имя есть, а такой @keyframes нет — серая строка «—»: браузер ничего не делает.
const hashS = (t) => { let h = 0; const s0 = String(t); for (let i = 0; i < s0.length; i++) h = (h * 31 + s0.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const secOf = (v) => { const n = parseFloat(v) || 0; return /ms$/.test(v) ? n / 1000 : n; };
const durLabel = (sec) => (Math.round(sec * 100) / 100) + 's';
function TimeBar({ rows }) {
  return (
    <div className="c16-tl" aria-hidden="true" translate="no">
      {rows.map((r) => (
        <span key={r.p + r.id} className={'c16-tl-row' + (r.d ? '' : ' is-zero') + (r.miss ? ' is-miss' : '')}>
          <i className="c16-tl-p">{r.p}</i>
          <span className="c16-tl-bar"><b style={r.miss ? { width: 0 } : r.d && !reduceMotion() ? { animation: 'c16Fill ' + r.d + 's ' + r.fn + ' ' + r.count + ' ' + r.dir + ' both' } : { width: '100%' }} /></span>
          <i className="c16-tl-d">{r.miss ? '—' : durLabel(r.d) + (r.count === 'infinite' ? ' ∞' : r.count && r.count !== '1' ? ' ×' + r.count : '')}</i>
        </span>
      ))}
    </div>
  );
}
let KF_N = 0;
// Окно своей ширины: страница шириной w пикселей уменьшается (scale), чтобы влезть в окно браузера урока, — как режим
// устройства в DevTools. Сверху справа — сколько пикселей сейчас ширина окна. w == null — обычная страница (как раньше).
function VwFrame({ w, boxW, setBoxW, children }) {
  const ref = useRef(null);
  const [h, setH] = useState(0);
  const [sw, setSw] = useState(0);
  useLayoutEffect(() => {
    if (w == null) return undefined;
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page) return undefined;
    const read = () => {
      const bw = page.clientWidth;
      setBoxW((o) => (o === bw ? o : bw));
      const inner = el.firstElementChild;
      const ih = inner ? inner.offsetHeight : 0;
      setH((o) => (o === ih ? o : ih));
      // Страница шире окна (что-то вылезло) — ширину содержимого показываем красным, как браузер даёт прокрутку вбок.
      const d = inner && inner.firstElementChild;
      const sw = d && d.scrollWidth > d.clientWidth + 1 ? d.scrollWidth : 0;
      setSw((o) => (o === sw ? o : sw));
    };
    read();
    if (typeof ResizeObserver === 'undefined') return undefined;
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(read); });
    ro.observe(page);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }); // eslint-disable-line react-hooks/exhaustive-deps
  if (w == null) return children;
  const k = boxW ? Math.min(1, boxW / w) : 1;
  return (
    <div ref={ref} className="c16-vwrap" style={{ height: Math.ceil(h * k) + 'px' }}>
      <div className="c16-vscale" style={{ transform: 'scale(' + k + ')', width: w + 'px' }}>{children}</div>
      <span className={'c16-vw' + (sw ? ' is-over' : '')} aria-hidden="true" translate="no">{w}px{sw ? <i>{' ↔ ' + sw + 'px'}</i> : null}</span>
    </div>
  );
}
// Ширина окна плавно меняется (как если тянуть край окна в DevTools): страница перестраивается на каждом шаге.
function useAnimNum(target, ms) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (target == null) { setV(target); cur.current = target; return undefined; }
    const from = cur.current == null ? target : cur.current;
    if (reduceMotion() || from === target) { setV(target); cur.current = target; return undefined; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / (ms || 900));
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const x = Math.round(from + (target - from) * e);
      cur.current = x; setV(x);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}
// Подходит ли условие @media ширине окна.
const mqHolds = (mq, w) => (mq.kind === 'max' ? w <= mq.px : w >= mq.px);
function CssPage({ els, rules, insp = false, scroll = null, hover: hover0 = null, mouse = false, pulse = null, timer = false, vw = null }) {
  const R0 = rules || [];
  const vwA = useAnimNum(vw);
  // Правила внутри @media — только когда условие подходит ширине окна (как в браузере); порядок — как в коде.
  const R = vw == null ? R0 : R0.filter((r) => !r.mq || mqHolds(r.mq, vwA));
  R.kf = R0.kf;
  const [boxW, setBoxW] = useState(0);
  // @keyframes страницы — настоящий <style> внутри страницы. Имена — со своей приставкой (на экране бывает две
  // страницы с одинаковыми именами), в animation приставка ставится только к именам, что объявлены здесь: имя с
  // опечаткой или другим регистром остаётся как есть — и браузер, как в жизни, ничего не находит.
  const kf = R.kf || [];
  const preRef = useRef(null);
  if (!preRef.current) { KF_N += 1; preRef.current = 'k' + KF_N + '-'; }
  const pre = preRef.current;
  const kfNames = kf.map((k) => k.name);
  const kfText = kf.map((k) => '@keyframes ' + pre + k.name + ' { ' + k.frames.map((f) => f.sel + ' { ' + f.decls.map((d) => d.p + ': ' + d.v + ';').join(' ') + ' }').join(' ') + ' }').join('\n');
  const scopeAnim = (v) => String(v).replace(/[A-Za-z_][\w-]*/g, (w) => (kfNames.indexOf(w) >= 0 ? pre + w : w));
  const unpre = (n) => (String(n).indexOf(pre) === 0 ? String(n).slice(pre.length) : String(n));
  // Новый шаг (другие правила или кадры) — анимация начинается заново: у элементов новый ключ.
  const ver = JSON.stringify([R.map((r) => [r.sel, r.decls]), kf]);
  // pulse (урок 14) — показ «туда и обратно»: курсор сам наезжает на элемент и уезжает, снова и снова, чтобы был
  // виден переход в обе стороны. Под «меньше движения» — просто «мышь над элементом».
  const [pOn, setPOn] = useState(false);
  useEffect(() => {
    if (!pulse) { setPOn(false); return undefined; }
    if (reduceMotion()) { setPOn(true); return undefined; }
    let on = false, t = 0;
    const tick = () => { on = !on; setPOn(on); t = setTimeout(tick, on ? 2600 : 1700); };
    t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [pulse]);
  const hover = pulse ? (pOn ? pulse : null) : hover0;
  // Над каким элементом мышь (или куда коснулись на телефоне); hover — состояние, которое экран показывает сам.
  // mouse — показ курсором (урок 13): стрелка сама подъезжает к элементу, и только когда она на месте, срабатывает
  // :hover; уезжает — :hover сразу снимается. Курсор только наводится и ничего не нажимает.
  const [hk, setHk] = useState(null);
  const [hv, setHv] = useState(mouse ? null : hover);
  const [aimOk, setAimOk] = useState(!mouse);
  useEffect(() => {
    if (!mouse) { setHv(hover); return undefined; }
    if (!hover || reduceMotion()) { setHv(hover); return undefined; }
    const t = setTimeout(() => setHv(hover), 620);
    return () => clearTimeout(t);
  }, [hover, mouse]);
  useEffect(() => {   // сначала курсор появляется в стороне, потом едет к элементу
    if (!mouse) return undefined;
    const t = setTimeout(() => setAimOk(true), reduceMotion() ? 0 : 160);
    return () => clearTimeout(t);
  }, [mouse]);
  const aim = mouse && aimOk ? hover : null;
  const [mpos, setMpos] = useState(null);
  const hovered = (el) => !!el.k && (hv === el.k || hk === el.k);
  // Полоса времени: что меняется плавно (по событиям браузера).
  const [trs, setTrs] = useState([]);
  const trId = useRef(0);
  const started = useRef({});
  useEffect(() => {
    setTrs([]); started.current = {};
    const d = ref.current;
    if (!timer || !d) return undefined;
    // Имя анимации есть, а она не началась (нет такого @keyframes) — серая строка «—».
    const t0 = setTimeout(() => {
      const miss = [];
      [...d.querySelectorAll('[data-t]')].forEach((e) => {
        String(getComputedStyle(e).animationName).split(',').map((x) => x.trim()).filter((x) => x && x !== 'none').forEach((n) => {
          if (!started.current[n] && miss.indexOf(unpre(n)) < 0) miss.push(unpre(n));
        });
      });
      if (miss.length) setTrs((old) => old.concat(miss.map((n) => ({ p: n, d: 0, miss: true, id: (trId.current += 1) }))).slice(-2));
    }, 450);
    return () => clearTimeout(t0);
  }, [ver, timer]); // eslint-disable-line react-hooks/exhaustive-deps
  const ref = useFitPage(JSON.stringify([els, R.map((r) => [r.sel, r.decls])]), vw != null);
  const doc = Object.assign({}, styleFor(R, { t: 'body' }));
  const [boxes, setBoxes] = useState([]);
  const [ph, setPh] = useState(0);
  const key = JSON.stringify([els, R.map((r) => [r.sel, r.decls]), hv, hk, aim, mouse]);
  const hlDone = useRef(null);
  // Страница — обычный поток (static), как body: «absolute» без родителя-якоря считается от страницы окна.
  // Координаты «Инспектора» — от страницы окна с её прокруткой.
  useLayoutEffect(() => {
    const d = ref.current;
    const page = d && d.closest('.kz-br-page');
    if (!d || !page) return undefined;
    const measure = () => {
      setPh((old) => (old === page.clientHeight ? old : page.clientHeight));
      if (mouse) {
        // Где курсор: на элементе (чуть правее середины) или в стороне от него. Рука — если браузер дал элементу cursor: pointer.
        const o0 = page.getBoundingClientRect();
        const e = d.querySelector('[data-hk]');
        if (e) {
          const r = e.getBoundingClientRect(), w = e.offsetWidth, hh = e.offsetHeight;
          const cx = r.left + r.width / 2 - o0.left + page.scrollLeft, cy = r.top + r.height / 2 - o0.top + page.scrollTop;
          const on = aim && aim === e.getAttribute('data-hk');
          const np = on ? { x: Math.round(cx + w * 0.16), y: Math.round(cy + hh * 0.05), hand: hv === aim && getComputedStyle(e).cursor === 'pointer' }
            : { x: Math.round(cx + w / 2 + 44), y: Math.round(cy - 6), hand: false };
          setMpos((old) => (old && old.x === np.x && old.y === np.y && old.hand === np.hand ? old : np));
        }
      } else setMpos(null);
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
        return { x: Math.round(r.left - o.left + page.scrollLeft), y: Math.round(r.top - o.top + page.scrollTop), w: Math.round(r.width), h: Math.round(r.height), t: e.getAttribute('data-t'), hl: e.classList.contains('is-hl'), hv: e.getAttribute('data-hover') === '1' };
      });
      setBoxes((old) => (JSON.stringify(old) === JSON.stringify(nb) ? old : nb));
    };
    measure();
    page.addEventListener('scroll', measure, { passive: true });
    // Пока идёт переход, рамки «Инспектора» и курсор едут вместе с элементом (меряем каждый кадр).
    let live = 0, raf = 0;
    const loop = () => { measure(); if (live > 0) raf = requestAnimationFrame(loop); else raf = 0; };
    const onAnim = (ev) => {
      if (!timer || !ev.target || !ev.target.getAttribute || !ev.target.getAttribute('data-t')) return;
      started.current[ev.animationName] = 1;
      const cs = getComputedStyle(ev.target);
      const ns = String(cs.animationName).split(',').map((x) => x.trim());
      let j = ns.indexOf(ev.animationName); if (j < 0) j = 0;
      const at = (v) => { const a = String(v).split(/,(?![^(]*\))/).map((x) => x.trim()); return a[j % a.length]; };
      const row = { p: unpre(ev.animationName), d: secOf(at(cs.animationDuration)), fn: at(cs.animationTimingFunction) || 'ease', count: at(cs.animationIterationCount) || '1', dir: at(cs.animationDirection) || 'normal', id: (trId.current += 1) };
      setTrs((old) => old.filter((x) => x.p !== row.p).concat(row).slice(-2));
    };
    d.addEventListener('animationstart', onAnim);
    const onRun = (ev) => {
      live += 1; if (!raf) raf = requestAnimationFrame(loop);
      const t = ev.target;
      if (!timer || !t || !t.getAttribute || !t.getAttribute('data-hk')) return;
      if (/^(outline|font-size|border-.*-color)/.test(ev.propertyName)) return;   // служебные мелочи браузера при «all»
      const cs = getComputedStyle(t);
      const ps = String(cs.transitionProperty).split(',').map((x) => x.trim());
      const ds = String(cs.transitionDuration).split(',').map((x) => x.trim());
      const fs = String(cs.transitionTimingFunction).split(/,(?![^(]*\))/).map((x) => x.trim());
      let j = ps.indexOf(ev.propertyName); if (j < 0) j = ps.indexOf('all'); if (j < 0) j = 0;
      const row = { p: ev.propertyName, d: secOf(ds[j % ds.length]), fn: fs[j % fs.length] || 'ease', id: (trId.current += 1) };
      setTrs((old) => old.filter((x) => x.d && x.p !== row.p).concat(row).slice(-2));
    };
    const onEnd = () => { live = Math.max(0, live - 1); };
    d.addEventListener('transitionrun', onRun);
    d.addEventListener('transitionend', onEnd);
    d.addEventListener('transitioncancel', onEnd);
    const off = () => { cancelAnimationFrame(raf); d.removeEventListener('animationstart', onAnim); d.removeEventListener('transitionrun', onRun); d.removeEventListener('transitionend', onEnd); d.removeEventListener('transitioncancel', onEnd); page.removeEventListener('scroll', measure); };
    if (typeof ResizeObserver === 'undefined') return off;
    let raf2 = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf2); raf2 = requestAnimationFrame(measure); });
    ro.observe(d); ro.observe(page);
    [...d.querySelectorAll('[data-t]')].forEach((c) => ro.observe(c));
    return () => { cancelAnimationFrame(raf2); ro.disconnect(); off(); };
  }, [key, insp, scroll, mouse, timer]); // eslint-disable-line react-hooks/exhaustive-deps
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
    const st = styleFor(R, el, hovered(el));
    if (st.animation) st.animation = scopeAnim(st.animation);
    const props = { key: (el.k || i) + ':' + ver.length + ':' + hashS(ver), className: 'c16-el c16-' + el.t + (el.cls ? ' ' + el.cls : '') + (el.hl ? ' is-hl' : ''), style: fixedLayer ? Object.assign({}, st, { position: 'absolute' }) : st, 'data-t': el.t + (el.cls ? '.' + el.cls.split(' ').join('.') : '') };
    if (fixedLayer) props['data-fixed'] = '1';
    if (el.t === 'a') { props.href = '#'; props.onClick = (e) => e.preventDefault(); props.tabIndex = -1; }
    if (el.t === 'button') { props.type = 'button'; props.tabIndex = -1; }
    if (el.hoverable) {
      props['data-hk'] = el.k;
      // Мышь — настоящий :hover; касание на телефоне включает и выключает его, как в мобильных браузерах.
      props.onMouseEnter = () => setHk(el.k);
      props.onMouseLeave = () => setHk((k) => (k === el.k ? null : k));
      props.onTouchStart = () => setHk((k) => (k === el.k ? null : el.k));
      if (hovered(el)) props['data-hover'] = '1';
    }
    const kids = el.kids ? el.kids.map((k, j) => (typeof k === 'string' ? k : node(Object.assign({ k: (el.k || i) + '-' + j }, k), j))) : el.text;
    return React.createElement(el.t, props, kids);
  };
  // position: fixed — слой, прилипший к видимой части окна браузера (sticky): страница прокручивается, слой — нет.
  // Так fixed держится окна браузера урока, а не всего экрана ученика.
  const isFixed = (el) => styleFor(R, el, hovered(el)).position === 'fixed';
  const fixedEls = els.filter(isFixed);
  const flowEls = els.filter((el) => !isFixed(el));
  return (
    <VwFrame w={vw == null ? null : vwA} boxW={boxW} setBoxW={setBoxW}><div ref={ref} className={'c16-doc' + (vw != null ? ' is-vw' : '') + (insp ? ' is-insp' : '')} style={vw != null ? Object.assign({}, doc, { width: vwA + 'px' }) : doc}>
      {kfText ? <style>{kfText}</style> : null}
      {fixedEls.length ? (   // слой position: fixed (урок 12) — только когда он нужен: пустой, он растягивался на всё окно
        <div className="c16-fixlayer" style={{ height: ph, marginBottom: -ph }}>
          {fixedEls.map((el, i) => node(el, 'f' + i, true))}
        </div>
      ) : null}
      {[].concat(...flowEls.map((el, i) => (i ? [' ', node(el, i)] : [node(el, i)])))}   {/* пробел между тегами, как перенос строки в HTML */}
      {insp ? boxes.map((b, i) => (
        <span key={'b' + i} className={'c16-ibox' + (b.hl ? ' is-hl' : '')} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} aria-hidden="true">{b.hv ? <i className="c16-hovtag" translate="no">:hover</i> : null}</span>
      )) : null}
      {timer && trs.length ? <TimeBar rows={trs} /> : insp && boxes.some((b) => b.hl) ? (
        <div className="c16-ilist" aria-hidden="true" translate="no">{boxes.filter((b) => b.hl).map((b, i) => <i key={i}>{b.t}{b.hv ? ':hover' : ''} {b.w}×{b.h}</i>)}</div>
      ) : null}
      {mouse && mpos ? <MouseCur at={mpos} /> : null}
    </div></VwFrame>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c16-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c16-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c16-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c16-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c16-edge' }), tagL('bo', 0, 'body', false, { cls: 'c16-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c16-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c16-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
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
const ruleParts = (sel, prop, val) => [P('s', 'c16-sel c16-part', sel), ' ', P('b', 'c16-punc', '{'), ' ', P('p', 'c16-prop', prop), P('c', 'c16-punc', ':'), ' ']
  .concat(val, [P('sc', 'c16-punc', ';'), ' ', P('b2', 'c16-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c16-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c16-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c16-cssline ' + (cls || '') });
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
const V = (t, cls) => [P('v', 'c16-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c16-sel c16-part', sel), ' ', P('b', 'c16-punc', '{')], { d: 1, cls: 'c16-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c16-prop', x.prop), P('c', 'c16-punc', ':'), ' '].concat(x.val, [P('sc', 'c16-punc', ';')]),
    { d: 2, cls: 'c16-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c16-punc', '}')], { d: 1, cls: 'c16-cssline ' + (cls || '') })]);
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
// Поле ввода урока — копия InlineInput общего набора (растёт по тексту), но подгонка по наблюдателю размеров —
// в следующем кадре: рядом с блоком @keyframes рост поля переносит строку кода, и подгонка прямо в наблюдателе
// зацикливала ResizeObserver. Общий набор не трогаем.
function LessonInput({ value, onChange, placeholder, label, max = 40, inputRef, onEnter, cls, onFocus }) {
  const pick = usePick();
  const ref = useRef(null);
  const setRef = (el) => { ref.current = el; if (inputRef) inputRef.current = el; };
  const fit = () => fitGrow(ref.current);
  useLayoutEffect(fit, [value]);
  useEffect(() => {
    const host = ref.current && ref.current.parentElement;
    if (typeof ResizeObserver === 'undefined' || !host) {
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
    ro.observe(host);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <textarea ref={setRef} rows={1} className={'tk-input tk-grow' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onFocus={onFocus} onChange={(e) => onChange(e.target.value.replace(/\r?\n/g, ' '))}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (onEnter) onEnter(); else e.currentTarget.blur(); } }} />
  );
}
// Поле в строке правила.
const Slot = ({ ty, led, onEnter, label, cls, max, onChange }) => (
  <span key="g" className={'kz-gap c16-slot ' + (cls || 'c16-slot-col') + (led ? ' kz-gap-led' : '')}>
    <LessonInput value={ty.val} onChange={onChange || ((x) => ty.setVal(x))} inputRef={ty.inputRef} onEnter={onEnter} placeholder={L3('…', '…', '…')} label={label} max={max || 24} />
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
// Основа страницы (тусклая строка кода): кнопка сиреневая, с внутренним отступом.
const BASES = { site: ['.banner { background-color: orange; padding: 10px; box-sizing: border-box; }', '.qator { display: flex; gap: 8px; margin-top: 8px; }', '.karta { background-color: lavender; padding: 10px; }'] };
// Урок 15: основа кубика в редакторе свёрнута — «.kub { … }» (рядом с блоком @keyframes код иначе не влезает в телефон);
// целиком она — на странице и в артефакте.
const baseL = (page) => (BASES[page] || BASES.site).map((r, i) => cssL('base' + i, 1, r.replace(/\{[^}]*\}/, '{ … }'), { cls: 'c16-dim' }));
// @media (условие) { правила } — правила внутри получают mq и действуют, только когда условие подходит ширине окна.
// Условие проверяет сам браузер (matchMedia): «max-width: 600px» без скобок или «600» без px — «not all», и браузер
// выбрасывает весь блок. Урок знает max-width и min-width в px.
const isMq = (t) => /^\s*@media\b/.test(String(t || ''));
const MQ_RE = /^@media\s*([^{]*)\{([\s\S]*)\}\s*$/;
function mqOf(cond) {
  const c = String(cond || '').trim();
  try { if (typeof matchMedia !== 'undefined' && matchMedia(c).media === 'not all') return null; } catch (e) { return null; }
  const m = /^\(\s*(max|min)-width\s*:\s*(\d+(?:\.\d+)?)px\s*\)$/i.exec(c);
  return m ? { kind: m[1].toLowerCase(), px: parseFloat(m[2]) } : null;
}
const withBase = (list, page) => {
  const all = (BASES[page] || BASES.site).concat(list || []);
  const out = [];
  all.forEach((t) => {
    if (isKf(t)) return;
    if (isMq(t)) {
      const m = MQ_RE.exec(String(t).trim());
      const mq = m && mqOf(m[1]);
      if (!mq) return;
      cssParse(m[2]).forEach((r) => out.push(Object.assign(r, { mq })));
      return;
    }
    cssParse(t).forEach((r) => out.push(r));
  });
  out.forEach((r, i) => { r.n = i; });   // порядок — как в коде: позже написанное правило побеждает
  out.kf = all.filter(isKf).map(kfParse).filter(Boolean);
  return out;
};
// Экран «впиши значение»: правило sel { prop: [pre] ▢ [post]; } (и готовые правила given), страница честно.
function FillScreen({ p, c, F, sel, prop, want, given, hl, pre, post, propSlot, fixed, page, scroll, hoverOk, pulseOk }) {
  const pick = usePick();
  const v = F.T.okNow ? want : noSemi(F.ty.val);
  const full = [pre, v, post].filter(Boolean).join(' ');
  // Пустое поле — правила ещё нет (иначе «transition: 0.5s» уже сработал бы: без свойства это all).
  const rules = (given || []).concat(v ? [ruleTxt(sel, [propSlot ? [v, fixed] : [prop, full]])] : []);
  const slot = F.T.okNow ? [P('v', propSlot ? 'c16-prop' : 'c16-val', want)] : [<Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />];
  const val = [].concat(pre ? [P('pre', 'c16-val', pre), ' '] : [], slot, post ? [' ', P('post', 'c16-val', post)] : []);
  // Поле на месте свойства: «sel { ▢: fixed; }».
  const partsOf = () => (propSlot ? [P('s', 'c16-sel c16-part', sel), ' ', P('b', 'c16-punc', '{'), ' '].concat(slot, [P('c', 'c16-punc', ':'), ' ', P('fx', 'c16-val', fixed), P('sc', 'c16-punc', ';'), ' ', P('b2', 'c16-punc', '}')]) : ruleParts(sel, prop, val));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c16-s5 c16-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat((given || []).map((r, i) => cssL('g' + i, 1, r, { cls: 'c16-dim' })), [ruleLine('r', partsOf(), F.T.okNow ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" />{!F.T.okNow && F.T.lad.lv >= 3 ? <HelpCode code={want} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl, page })} rules={withBase(rules, page)} scroll={scroll == null ? null : scroll} hover={hoverOk && F.T.okNow ? hoverOk : null} pulse={pulseOk && F.T.okNow ? HV : null} mouse={!!((hoverOk || pulseOk) && F.T.okNow)} timer /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={[]} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Блок @keyframes в редакторе: заголовок, кадры (каждый — строка), закрывающая скобка. Обычное правило — одна строка.
// slots — поля ввода на месте меток («▢», «▢1»…): кусок кода с таким текстом заменяется полем.
const slotify = (parts, slots) => (slots ? parts.map((x) => (x && x.props && typeof x.props.children === 'string' && slots[x.props.children] ? slots[x.props.children] : x)) : parts);
const lc = (base, extra) => Object.assign({}, extra || {}, { cls: 'c16-cssline ' + base + ' ' + ((extra && extra.cls) || '') });
// Условие @media в редакторе: скобки, имя, двоеточие, значение — своими цветами; метка ▢ — поле.
const mqParts = (cond) => String(cond).split(/(\(|\)|:|\s+)/).filter((x) => x !== '' && x !== undefined).map((x, i) => (
  /^\s+$/.test(x) ? ' ' : x === '(' || x === ')' || x === ':' ? P('q' + i, 'c16-punc', x) : /width$/.test(x) ? P('q' + i, 'c16-prop', x) : P('q' + i, 'c16-val', x)));
function ruleLines(k, d, text, extra, slots) {
  const t = String(text).trim();
  if (isMq(t)) {
    const m = /^@media\s*([^{]*)\{([\s\S]*)\}\s*$/.exec(t);
    const head = codeLine(k + 'h', slotify([P('at', 'c16-at', '@media'), ' '].concat(mqParts(m ? m[1].trim() : ''), [' ', P('b', 'c16-punc', '{')]), slots), Object.assign({ d }, lc('c16-mq', extra)));
    const rules = [];
    const re = /([^{}]+)\{([^}]*)\}/g;
    let f;
    while ((f = re.exec(m ? m[2] : ''))) rules.push(f[1].trim() + ' { ' + f[2].trim() + ' }');
    const body = rules.map((x, i) => { const l = codeLine(k + 'r' + i, cssTokens(x), Object.assign({ d: d + 1 }, lc('c16-mq', extra))); l.parts = slotify(l.parts, slots); return l; });
    return [head].concat(body, [codeLine(k + 'z', [P('z', 'c16-punc', '}')], Object.assign({ d }, lc('c16-mq', extra)))]);
  }
  if (!isKf(t)) { const l = cssL(k, d, t, extra); l.parts = slotify(l.parts, slots); return [l]; }
  const m = /^@keyframes\s+(\S+)\s*\{([\s\S]*)\}\s*$/.exec(t);
  const inner = m ? m[2] : '';
  const head = codeLine(k + 'h', [P('at', 'c16-at', '@keyframes'), ' ', P('n', 'c16-kfn', m ? m[1] : ''), ' ', P('b', 'c16-punc', '{')], Object.assign({ d }, lc('c16-kf', extra)));
  const frames = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let f;
  while ((f = re.exec(inner))) frames.push(f[1].trim() + ' { ' + f[2].trim() + ' }');
  const body = frames.map((x, i) => { const l = codeLine(k + 'f' + i, cssTokens(x), Object.assign({ d: d + 1 }, lc('c16-kf', extra))); l.parts = slotify(l.parts, slots); return l; });
  return [head].concat(body, [codeLine(k + 'z', [P('z', 'c16-punc', '}')], Object.assign({ d }, lc('c16-kf', extra)))]);
}
// Экран «впиши»: tpl — правила и блоки @keyframes, в одном из них метка ▢ (поле). Пустое поле — этого правила ещё нет.
// Переключатель ширины окна: компьютер (800 px) или телефон (360 px) — ученик сам проверяет страницу на обоих.
const VWS = [800, 360];
function WidthToggle({ vw, setVw }) {
  const pick = usePick();
  return (
    <div className="c16-wt" role="group" aria-label={pick(UI.width)}>
      {VWS.map((w) => (
        <button key={w} type="button" data-w={w} className={'c16-wt-b' + (vw === w ? ' is-on' : '')} onClick={() => { if (vw !== w) { sfx('tap', true); setVw(w); } }}>
          <Icon name={w > 600 ? 'screen' : 'phone'} size={14} /><span>{pick(w > 600 ? UI.pc : UI.phone)}</span><b translate="no">{w}px</b>
        </button>
      ))}
    </div>
  );
}
function CodeFill({ p, c, F, tpl, want, keys, vw0 }) {
  const pick = usePick();
  const [vw, setVw] = useState(vw0 || 360);
  const v = F.T.okNow ? want : noSemi(F.ty.val);
  const items = tpl.map((t) => (t.indexOf('▢') >= 0 ? (v ? t.replace('▢', v) : null) : t)).filter(Boolean);
  const slot = F.T.okNow ? P('v', 'c16-val', want) : <Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />;
  const lines = baseL().concat(...tpl.map((t, i) => ruleLines('t' + i, 1, t, { cls: t.indexOf('▢') >= 0 ? (F.T.okNow ? 'is-new' : 'is-hl') : '' }, { '▢': slot })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c16-sheet c16-fill">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c16-s5 c16-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" />{!F.T.okNow && F.T.lad.lv >= 3 ? <HelpCode code={want} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase(items)} vw={vw} /></Br><WidthToggle vw={vw} setVw={setVw} /></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={keys || []} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
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
function ShowScreen({ p, c, id, steps, says, asks, pose, hl, page, scrolls, hovers, pulse, vws }) {
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
      <Sheet cls="c16-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c16-s5 c16-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat(...rules.map((r, i) => ruleLines('r' + i + hashS(r), 1, r, { cls: live && prev.indexOf(r) < 0 ? 'is-new is-read' : '' }))))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl ? hl[Math.min(n, hl.length - 1)] : null, page })} rules={withBase(rules, page)} scroll={scrolls ? scrolls[n] : null} vw={vws ? vws[Math.min(n, vws.length - 1)] : 800} /></Br></div>
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


// ── СТРАНИЦА УРОКА: сайт Коди — баннер «Yangi o'yin!» и ряд из трёх карточек (div.qator > div.karta) ──
const site = (pick) => [
  { t: 'div', cls: 'banner', k: 'bn', text: pick(C.site.banner) },
  { t: 'div', cls: 'qator', k: 'q', kids: C.site.cards.map((x) => ({ t: 'div', cls: 'karta', text: pick(x) })) }
];
const nows = (v) => norm(v).replace(/\s+/g, '');
// Правила урока.
const BN_PX = '.banner { width: 700px; }';
const BN_PCT = '.banner { width: 100%; }';
const MQ = (cond, inner) => '@media ' + cond + ' { ' + inner + ' }';
const MQ_COL = MQ('(max-width: 600px)', '.qator { flex-direction: column; }');
const MQ_HIDE = MQ('(max-width: 600px)', '.banner { display: none; }');
const MQ_FIT = MQ('(max-width: 600px)', '.banner { width: 100%; }');
// Размер в px: «600px» → 600; иначе null.
const pxOf = (v) => { const m = /^(\d+)px$/.exec(nows(v)); return m ? parseInt(m[1], 10) : null; };

// =============================================================================
// S1. КРЮЧОК — сайт Коди на компьютере хорош, окно сужается до телефона: баннер шире экрана (прокрутка вбок), карточки
// тесно в ряд. «Превратить» — width: 100% и @media: на телефоне карточки друг под другом. Загадка: @media в самом верху.
// =============================================================================
const S1_BAD = [BN_PX];
const S1_OK = [BN_PCT, MQ_COL];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [vw, setVw] = useState(solved ? 360 : 800);
  useEffect(() => { if (solved) return undefined; const t = setTimeout(() => setVw(360), reduceMotion() ? 300 : 2600); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const turn = () => {
    if (!canTap || on) return;
    sfx('soft', true); setOn(true); setVw(360); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.magicP, 'explain'); say(c.done, 'think');
  };
  const rules = on ? S1_OK : S1_BAD;
  const lines = baseL().concat(...rules.map((r, i) => ruleLines('r' + i + (on ? 'b' : 'a'), 1, r, { cls: on ? 'is-new' : '' })));
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c16-s5 c16-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase(rules)} vw={vw} /></Br>{on ? <WidthToggle vw={vw} setVw={setVw} /> : null}</div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// S2. % (показ) — width: 700px: на компьютере хорошо, на телефоне шире экрана; 100% — ровно по окну; и на компьютере тоже.
function S2({ p }) {
  const c = C.s2;
  return <ShowScreen p={p} c={c} id="s2"
    steps={[[BN_PX], [BN_PX], [BN_PCT], [BN_PCT]]} vws={[800, 360, 360, 800]}
    says={[c.sayPhone, c.sayPct, c.sayWide]}
    asks={{ list: [c.askStart, c.askPhone, c.askPct, c.askWide], done: c.askDone }} />;
}
// S3. ВО ВСЮ ШИРИНУ — .banner { width: ▢; } → 100%.
function S3({ p }) {
  const c = C.s3;
  const Fl = useFill('s3', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (/^\d+(\.\d+)?px$/.test(v)) return c.msgs.px;
    if (/^\d+(\.\d+)?$/.test(v)) return c.msgs.noPct;
    if (/^\d+(\.\d+)?%$/.test(v)) return v === '100%' ? null : c.msgs.otherPct;
    return cssOk('width', v) ? c.msgs.other : c.msgs.bad;
  });
  return <CodeFill p={p} c={c} F={Fl} tpl={['.banner { width: ▢; }']} want="100%" keys={['%']} />;
}

// S4. px ИЛИ %? (Sort по одному) — задача словами → px (всегда одинаково) или % (от ширины окна).
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const R = useRounds('s4', c, c.items, (it) => it.right, (it) => it.why, (it) => it.right);
  const btn = (v) => (
    <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
      className={'kz-btn c16-tf c16-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
      <span translate="no">{v}</span><Led on={R.led && !R.ok && R.off.length === 0} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <div className="c16-card c16-tf-card kz-a-drop">
              <span className="c16-card-h">{pick(c.card)}</span>
              <p className="c16-tf-t">{pick(R.it.t)}</p>
            </div>
            <div className="kz-pick c16-sides">{btn('px')}{btn('%')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S5. @media (показ) — на телефоне карточки тесно в ряд; @media (max-width: 600px) — на телефоне друг под другом;
// на компьютере правило «спит»; окно сужается через 600 px — правило включается.
function S5({ p }) {
  const c = C.s5;
  return <ShowScreen p={p} c={c} id="s5"
    steps={[[BN_PCT], [BN_PCT], [BN_PCT, MQ_COL], [BN_PCT, MQ_COL]]} vws={[800, 360, 360, 800]}
    says={[c.sayTight, c.sayMedia, c.sayWide]}
    asks={{ list: [c.askStart, c.askTight, c.askMedia, c.askWide], done: c.askDone }} />;
}
// S6. ГРАНИЦА — @media (max-width: ▢) { .qator { flex-direction: column; } } → 600px.
function S6({ p }) {
  const c = C.s6;
  const Fl = useFill('s6', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (/^\d+$/.test(v)) return c.msgs.noPx;
    const n = pxOf(v);
    if (n == null) return c.msgs.bad;
    return n === 600 ? null : c.msgs.other;
  });
  return <CodeFill p={p} c={c} F={Fl} tpl={[BN_PCT, MQ('(max-width: ▢)', '.qator { flex-direction: column; }')]} want="600px" />;
}

// S7. СРАБОТАЕТ ЛИ? (Sort по одному) — условие @media и ширина окна → «работает» или «спит».
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const R = useRounds('s7', c, c.items, (it) => it.right, (it) => it.why, (it) => pick(c.opts[it.right]));
  const btn = (v) => (
    <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
      className={'kz-btn c16-tf c16-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
      {pick(c.opts[v])}<Led on={R.led && !R.ok && R.off.length === 0} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <div className="c16-win kz-a-drop"><Icon name={R.it.vw > 600 ? 'screen' : 'phone'} size={18} /><span>{pick(c.win)}</span><b translate="no">{R.it.vw}px</b></div>
            <KzCode lines={[cssL('c', 0, '@media ' + R.it.mq + ' { … }', { cls: 'is-hl' })]} cls="kz-code-sm c16-big" />
            <div className="kz-pick c16-sides">{btn('yes')}{btn('no')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S8. ЧТО ЕЩЁ МЕНЯЮТ НА ТЕЛЕФОНЕ (показ) — @media прячет баннер (display: none); на компьютере баннер на месте.
function S8({ p }) {
  const c = C.s8;
  return <ShowScreen p={p} c={c} id="s8"
    steps={[[BN_PCT, MQ_COL], [BN_PCT, MQ_COL, MQ_HIDE], [BN_PCT, MQ_COL, MQ_HIDE]]} vws={[360, 360, 800]}
    says={[c.sayHide, c.sayWide]}
    asks={{ list: [c.askStart, c.askHide, c.askWide], done: c.askDone }} />;
}
// S9. СПРЯТАТЬ НА ТЕЛЕФОНЕ — @media (max-width: 600px) { .banner { display: ▢; } } → none.
function S9({ p }) {
  const c = C.s9;
  const Fl = useFill('s9', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === 'none') return null;
    if (cssOk('display', v)) return c.msgs.shown;
    return c.msgs.bad;
  });
  return <CodeFill p={p} c={c} F={Fl} tpl={[BN_PCT, MQ('(max-width: 600px)', '.banner { display: ▢; }')]} want="none" />;
}

// S10. В @media ИЛИ ВСЕГДА? (Sort по одному) — задача словами → правило для всех экранов или внутри @media.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const R = useRounds('s10', c, c.items, (it) => it.right, (it) => it.why, (it) => pick(c.opts[it.right]));
  const btn = (v) => (
    <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
      className={'kz-btn c16-tf c16-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
      {pick(c.opts[v])}<Led on={R.led && !R.ok && R.off.length === 0} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <div className="c16-card c16-tf-card kz-a-drop">
              <span className="c16-card-h">{pick(c.card)}</span>
              <p className="c16-tf-t">{pick(R.it.t)}</p>
            </div>
            <div className="kz-pick c16-sides">{btn('always')}{btn('media')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S11. КОГДА НЕ РАБОТАЕТ (показ) — на телефоне: без скобок — браузер выбросил блок; 600 без px — тоже; min-width —
// «от 600 и шире»: на телефоне спит (а на компьютере карточки встали бы столбиком).
function S11({ p }) {
  const c = C.s11;
  return <ShowScreen p={p} c={c} id="s11" pose="curious"
    steps={[[BN_PCT, MQ_COL], [BN_PCT, MQ('max-width: 600px', '.qator { flex-direction: column; }')], [BN_PCT, MQ('(max-width: 600)', '.qator { flex-direction: column; }')], [BN_PCT, MQ('(min-width: 600px)', '.qator { flex-direction: column; }')]]}
    vws={[360, 360, 360, 360]}
    says={[c.sayParens, c.sayPx, c.sayMin]}
    asks={{ list: [c.askStart, c.askParens, c.askPx, c.askMin], done: c.askDone }} />;
}
// S12. ИСПРАВЬ (Debug & Fix) — условие «max-width: 600px» без скобок → «(max-width: 600px)».
function S12({ p }) {
  const c = C.s12;
  const Fl = useFill('s12', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    const mq = mqOf(v);
    if (!mq) {
      if (!/^\(.*\)$/.test(v.trim())) return c.msgs.parens;
      if (/:\s*\d+\s*\)$/.test(v)) return c.msgs.px;
      return c.msgs.bad;
    }
    if (mq.kind !== 'max') return c.msgs.min;
    return mq.px === 600 ? null : c.msgs.other;
  }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !Fl.T.okNow && !Fl.ty.val) { set0.current = true; Fl.ty.setVal('max-width: 600px');
    // Курсор — в начало (09.11.2026): первая скобка встаёт перед условием с кнопки «(».
    requestAnimationFrame(() => { const el = Fl.ty.inputRef && Fl.ty.inputRef.current; if (el && el.setSelectionRange) { try { el.setSelectionRange(0, 0); } catch (e) { /* без выделения */ } } }); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <CodeFill p={p} c={c} F={Fl} tpl={[BN_PCT, MQ('▢', '.qator { flex-direction: column; }')]} want="(max-width: 600px)" keys={['(', ')']} />;
}

// S13. НАЙДИ ОШИБКУ (Error Detective) — окно телефона: раунд 1 — 600 без px; раунд 2 — min-width вместо max-width.
// Строки блока @media нажимаются вместе (это одно правило).
const S13_ROUNDS = [
  { kind: 'px', bad: 1, rules: ['.karta { color: navy; }', MQ('(max-width: 600)', '.qator { flex-direction: column; }'), BN_PCT], fixed: MQ_COL },
  { kind: 'min', bad: 2, rules: [BN_PCT, '.banner { color: white; }', MQ('(min-width: 600px)', '.qator { flex-direction: column; }')], fixed: MQ_COL }
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
  const lines = [].concat(...rules.map((r, j) => ruleLines('l' + ri + j + (found && j === R.bad ? 'f' : ''), 0, r).map((l, li) => Object.assign(l, {
    cls: l.cls + ' c16-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && li === 0 && ((led && off.length === 0) || (lit && j === R.bad))
  }))));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c16-s5 c16-pair c16-q1" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase(rules)} vw={360} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — «@media (max-width: 600px) { .banner { display: none; } }»: спрятать баннер на телефоне.
function ruleIssue(t, msgs) {
  const s0 = String(t || '').trim();
  if (!s0) return msgs.empty;
  if (!/^@media/i.test(s0)) return /^@?media/i.test(s0) ? msgs.at : msgs.start;
  const m = /^@media\s*([^{]*)\{\s*([^{}]*)\{([^}]*)\}\s*\}\s*$/.exec(s0);
  if (!m) return msgs.braces;
  const mq = mqOf(m[1]);
  if (!mq) return !/^\(.*\)$/.test(m[1].trim()) ? msgs.parens : /:\s*\d+\s*\)$/.test(m[1]) ? msgs.px : msgs.bad;
  if (mq.kind !== 'max') return msgs.min;
  if (mq.px !== 600) return msgs.other;
  if (m[2].trim().toLowerCase() !== '.banner') return msgs.sel;
  const inner = m[3];
  if (inner.indexOf(':') < 0) return msgs.colon;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = nows(d.slice(i + 1));
  if (prop !== 'display') return msgs.prop;
  if (val !== 'none') return msgs.val;
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
  const [vw, setVw] = useState(360);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const css = T.okNow ? MQ_HIDE : ty.val;
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
      <Sheet cls="c16-sheet c16-w1">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c16-s5 c16-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL().concat([cssL('pc', 1, BN_PCT, { cls: 'c16-dim' })], T.okNow ? ruleLines('r', 1, css, { cls: 'is-new' }) : [ruleLine('r', [<span key="g" className={'kz-gap c16-slot c16-slot-rule' + (led ? ' kz-gap-led' : '')}><LessonInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={72} /></span>], 'is-hl')]))} cls="kz-code-sm" />{!T.okNow && T.lad.lv >= 3 ? <HelpCode code={MQ_HIDE} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase([BN_PCT].concat(isMq(css) ? [css] : []))} vw={vw} /></Br><WidthToggle vw={vw} setVw={setVw} /></div>
        </div>
        {!T.okNow ? <KeyRow keys={['@', '(', ')', '{', '}', ':', ';']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// S14. СВОЯ АДАПТИВНАЯ СТРАНИЦА (Live Code Preview, «Готово») — своя граница и что меняется на узком окне: цвет баннера
// и цвет карточек. Ученик сам переключает ширину окна.
const OWN = [{ k: 'myBp', f: 'fa', max: 8 }, { k: 'myBn', f: 'fb', max: 16 }, { k: 'myKa', f: 'fc', max: 16 }];
const ownRules = (v) => [MQ('(max-width: ' + v[0] + ')', '.banner { background-color: ' + v[1] + '; } .karta { background-color: ' + v[2] + '; }')];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const store = useStore();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [vals, setVals] = useState(OWN.map((o) => store.get(o.k) || ''));
  const [msg, setMsg] = useState(null);
  const [vw, setVw] = useState(360);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !vals[0], 0);
  const v = vals.map((x) => x.trim());
  const ready = v.every(Boolean);
  const issueOf = () => {
    if (/^\d+$/.test(nows(v[0]))) return c.msgs.noPx;
    const n = pxOf(v[0]);
    if (n == null) return fillL(c.msgs.bp, { w: v[0] });
    if (n < 360 || n > 1000) return c.msgs.range;
    if (!cssOk('background-color', norm(v[1]))) return fillL(c.msgs.color, { w: v[1] });
    if (!cssOk('background-color', norm(v[2]))) return fillL(c.msgs.color, { w: v[2] });
    return null;
  };
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = cyrIn([].concat(v).join(" ")) || issueOf();
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    OWN.forEach((o, i) => store.set(o.k, i === 0 ? nows(v[i]) : norm(v[i]))); put({ done: true });
    log({ screenId: 's14', type: 'own-media', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, breakpoint: v[0], banner: v[1], card: v[2] });
    sayNow(c.ok, 'cheer');
  };
  const okNow = !issueOf();
  const rules = [BN_PCT].concat(okNow ? ownRules([nows(v[0]), norm(v[1]), norm(v[2])]) : []);
  const field = (i) => (
    <span key={OWN[i].f} className={'kz-gap c16-slot c16-slot-col' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={OWN[i].f}>
      <LessonInput value={vals[i]} onChange={(x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={OWN[i].max} />
    </span>
  );
  const val = (i) => (solved ? P('v' + i, 'c16-val', v[i]) : field(i));
  const tpl = MQ('(max-width: ▢1)', '.banner { background-color: ▢2; } .karta { background-color: ▢3; }');
  const lines = ruleLines('o', 1, tpl, { cls: solved ? 'is-new' : 'is-hl' }, { '▢1': val(0), '▢2': val(1), '▢3': val(2) });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c16-sheet kz-typed c16-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={site(pick)} rules={withBase(rules)} vw={vw} /></Br>
            <WidthToggle vw={vw} setVw={setVw} />
            <KzCode lines={styleWrap(lines)} cls="kz-code-sm" />
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
      className={'kz-btn c16-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = { mq400: [cssL('c', 0, '@media (max-width: 600px) { … }')], order: [cssL('c1', 0, '@media (max-width: 600px) { .banner { width: 100%; } }'), cssL('c2', 0, BN_PX)] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c16-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c16-card c16-tf-card kz-a-drop">
              <span className="c16-card-h">{pick(c.card)}</span>
              <p className="c16-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c16-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S15. ВЫВОД — разгадка: @media написан в самом верху, а ниже — обычное .banner { width: 700px; }: правила одной силы,
// побеждает то, что ниже, и на телефоне баннер опять шире экрана. @media внизу — работает. Своя страница; роли.
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const own = [store.get('myBp') || '600px', store.get('myBn') || 'gold', store.get('myKa') || 'white'];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle' || curK === 'riddle2';
  const rows = curK === 'riddle' ? [MQ_FIT, BN_PX] : curK === 'riddle2' ? [BN_PX, MQ_FIT] : [BN_PCT].concat(ownRules(own));
  const ex = { pct: '100%', mq: '@media', cond: '(max-width: 600px)', order: '@media ↓' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c16-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick)} rules={withBase(rows)} vw={360} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={[].concat(...rows.map((r, i) => ruleLines('r' + i + (curK || ''), 0, r, { cls: riddle ? 'is-read' : '' })))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['pct', 'mq', 'cond', 'order'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" /><span translate="no">{pick(c.roles[k])}</span>{curK === k ? <code className="c16-role-ex" translate="no">{ex[k]}</code> : null}
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
// «Повторить» стирает только экран; своя страница ученика (myBp, myBn, myKa) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя кнопка ученика.
function lessonCss16Artifact(store) {
  const v = OWN.map((o) => store.get(o.k) || '');
  if (!v.some(Boolean)) return null;
  return { type: 'html-page', breakpoint: v[0], banner: v[1], card: v[2],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <meta name="viewport" content="width=device-width, initial-scale=1">', '    <title>Mening saytim</title>', '    <style>'].concat(BASES.site.map((r) => '      ' + r),
      ['      .banner { width: 100%; }'], ownRules(v).map((r) => '      ' + escHtml(r)),
      ['    </style>', '  </head>', '  <body>', '    <div class="banner">Yangi o\'yin!</div>', '    <div class="qator">', '      <div class="karta">O\'yinlar</div>', '      <div class="karta">Musiqa</div>', '      <div class="karta">Kino</div>', '    </div>', '  </body>', '</html>']).join('\n') };
}

export default function CssResponsive({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss16Artifact(store) })
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
