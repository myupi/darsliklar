// =============================================================================
// ДВИЖОК УРОКА 17 КУРСА CSS «Финальный проект» (11.11.2026) — копия движка урока 16 (tools/css16/c16-screens.jsx)
// с картинками-файлами (FILES, как в уроке 4: фон url("…") и тег img) и align-self. Экраны — c17-screens.jsx.
// Ниже — исходное описание движка урока 16.
// ЭКРАНЫ УРОКА 16 КУРСА CSS «Адаптивность» (облик «Редактор», 07.11.2026). Основа кода — урок 15 (tools/css15/).
// Типы заданий — по разделу 3а навыка: s3 вписать 100% — s4 px или %; s6 вписать 600px — s7 сработает ли @media;
// s9 вписать none — s10 в @media или всегда; s12 исправить условие без скобок — s13 найти правило; w1 правило @media
// целиком (спрятать баннер на телефоне); s14 своя адаптивная страница; q1 верно или нет.
// Честный браузер: ширина окна (vw) — настоящая ширина страницы (800 — компьютер, 360 — телефон), страница уменьшается,
// чтобы влезть в окно урока; @media (max-width / min-width) решает по этой ширине, условие проверяет matchMedia. Бумаги нет.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'border-radius', 'box-shadow', 'border-top', 'border-right', 'border-bottom', 'border-left', 'display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap', 'position', 'top', 'right', 'bottom', 'left', 'transform', 'cursor', 'transition', 'animation',
  'background-image', 'background-repeat', 'background-size', 'align-self'];
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
const sp = () => <span className="c17-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c17-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c17-mark c17-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c17-sel c17-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c17-sel c17-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c17-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c17-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c17-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c17-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c17-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c17-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c17-att c17-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c17-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c17-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
      // у .c17-doc overflow: clip. Пока ужимаем — класс is-fit (transition: none), иначе при «all» шрифт кнопки
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
  <span className={'c17-mouse' + (at.hand ? ' is-hand' : '')} style={{ left: at.x + 'px', top: at.y + 'px' }} aria-hidden="true">
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
    <div className="c17-tl" aria-hidden="true" translate="no">
      {rows.map((r) => (
        <span key={r.p + r.id} className={'c17-tl-row' + (r.d ? '' : ' is-zero') + (r.miss ? ' is-miss' : '')}>
          <i className="c17-tl-p">{r.p}</i>
          <span className="c17-tl-bar"><b style={r.miss ? { width: 0 } : r.d && !reduceMotion() ? { animation: 'c17Fill ' + r.d + 's ' + r.fn + ' ' + r.count + ' ' + r.dir + ' both' } : { width: '100%' }} /></span>
          <i className="c17-tl-d">{r.miss ? '—' : durLabel(r.d) + (r.count === 'infinite' ? ' ∞' : r.count && r.count !== '1' ? ' ×' + r.count : '')}</i>
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
    <div ref={ref} className="c17-vwrap" style={{ height: Math.ceil(h * k) + 'px' }}>
      <div className="c17-vscale" style={{ transform: 'scale(' + k + ')', width: w + 'px' }}>{children}</div>
      <span className={'c17-vw' + (sw ? ' is-over' : '')} aria-hidden="true" translate="no">{w}px{sw ? <i>{' ↔ ' + sw + 'px'}</i> : null}</span>
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
  // Урок 17: окно без своей ширины (vw) — условие @media проверяется по настоящей ширине окна браузера урока (pw).
  const [pw, setPw] = useState(800);
  const R = R0.filter((r) => !r.mq || mqHolds(r.mq, vw == null ? pw : vwA));
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
  // Страница — обычный поток (static), как body: «absolute» без родителя-якоря считается от страницы окна.
  // Координаты «Инспектора» — от страницы окна с её прокруткой.
  useLayoutEffect(() => {
    const d = ref.current;
    const page = d && d.closest('.kz-br-page');
    if (!d || !page) return undefined;
    const measure = () => {
      setPh((old) => (old === page.clientHeight ? old : page.clientHeight));
      setPw((old) => (old === page.clientWidth ? old : page.clientWidth));
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
      if (scroll == null) {
        const h = d.querySelector('.is-hl');
        if (page.scrollHeight > page.clientHeight + 1 && h && getComputedStyle(h).position !== 'fixed') page.scrollTop = Math.max(0, h.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 30);
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
    // Урок 17: окно своей ширины — высота обёртки меняется позже (масштаб), прокрутка к подсвеченному — по ней.
    const vwrap = d.closest('.c17-vwrap'); if (vwrap) ro.observe(vwrap);
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
    const props = { key: (el.k || i) + ':' + ver.length + ':' + hashS(ver), className: 'c17-el c17-' + el.t + (el.cls ? ' ' + el.cls : '') + (el.hl ? ' is-hl' : ''), style: fixedLayer ? Object.assign({}, st, { position: 'absolute' }) : st, 'data-t': el.t + (el.cls ? '.' + el.cls.split(' ').join('.') : '') };
    if (fixedLayer) props['data-fixed'] = '1';
    if (el.t === 'a') { props.href = '#'; props.onClick = (e) => e.preventDefault(); props.tabIndex = -1; }
    if (el.t === 'button') { props.type = 'button'; props.tabIndex = -1; }
    if (el.t === 'img') { props.src = FILES[el.src] || ''; props.alt = el.alt || ''; props.draggable = false; }
    if (el.hoverable) {
      props['data-hk'] = el.k;
      // Мышь — настоящий :hover; касание на телефоне включает и выключает его, как в мобильных браузерах.
      props.onMouseEnter = () => setHk(el.k);
      props.onMouseLeave = () => setHk((k) => (k === el.k ? null : k));
      props.onTouchStart = () => setHk((k) => (k === el.k ? null : el.k));
      if (hovered(el)) props['data-hover'] = '1';
    }
    const kids = el.kids ? el.kids.map((k, j) => (typeof k === 'string' ? k : node(Object.assign({ k: (el.k || i) + '-' + j }, k), j))) : el.text;
    return el.t === 'img' ? React.createElement('img', props) : React.createElement(el.t, props, kids);
  };
  // position: fixed — слой, прилипший к видимой части окна браузера (sticky): страница прокручивается, слой — нет.
  // Так fixed держится окна браузера урока, а не всего экрана ученика.
  const isFixed = (el) => styleFor(R, el, hovered(el)).position === 'fixed';
  const fixedEls = els.filter(isFixed);
  const flowEls = els.filter((el) => !isFixed(el));
  return (
    <VwFrame w={vw == null ? null : vwA} boxW={boxW} setBoxW={setBoxW}><div ref={ref} className={'c17-doc' + (vw != null ? ' is-vw' : '') + (insp ? ' is-insp' : '')} style={vw != null ? Object.assign({}, doc, { width: vwA + 'px' }) : doc}>
      {kfText ? <style>{kfText}</style> : null}
      {fixedEls.length ? (   // слой position: fixed (урок 12) — только когда он нужен: пустой, он растягивался на всё окно
        <div className="c17-fixlayer" style={{ height: ph, marginBottom: -ph }}>
          {fixedEls.map((el, i) => node(el, 'f' + i, true))}
        </div>
      ) : null}
      {[].concat(...flowEls.map((el, i) => (i ? [' ', node(el, i)] : [node(el, i)])))}   {/* пробел между тегами, как перенос строки в HTML */}
      {insp ? boxes.map((b, i) => (
        <span key={'b' + i} className={'c17-ibox' + (b.hl ? ' is-hl' : '')} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} aria-hidden="true">{b.hv ? <i className="c17-hovtag" translate="no">:hover</i> : null}</span>
      )) : null}
      {timer && trs.length ? <TimeBar rows={trs} /> : insp && boxes.some((b) => b.hl) ? (
        <div className="c17-ilist" aria-hidden="true" translate="no">{boxes.filter((b) => b.hl).map((b, i) => <i key={i}>{b.t}{b.hv ? ':hover' : ''} {b.w}×{b.h}</i>)}</div>
      ) : null}
      {mouse && mpos ? <MouseCur at={mpos} /> : null}
    </div></VwFrame>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c17-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c17-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c17-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c17-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c17-edge' }), tagL('bo', 0, 'body', false, { cls: 'c17-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c17-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c17-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
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
const ruleParts = (sel, prop, val) => [P('s', 'c17-sel c17-part', sel), ' ', P('b', 'c17-punc', '{'), ' ', P('p', 'c17-prop', prop), P('c', 'c17-punc', ':'), ' ']
  .concat(val, [P('sc', 'c17-punc', ';'), ' ', P('b2', 'c17-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c17-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c17-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c17-cssline ' + (cls || '') });
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


// ── ФАЙЛЫ УРОКА: картинки сайта лагеря (свои SVG, имена — как у файлов сайта; как в уроке 4) ───────
const svgUri = (s) => 'data:image/svg+xml,' + encodeURIComponent(s);
const FILES = {
  // Небо с горами и солнцем — плитка 160×80: повтор (repeat) сразу виден рядом одинаковых гор.
  'osmon.jpg': svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='80' viewBox='0 0 160 80'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4FA9E8'/><stop offset='1' stop-color='#BFE3FA'/></linearGradient></defs><rect width='160' height='80' fill='url(#g)'/><circle cx='128' cy='20' r='9' fill='#FFD54A'/><path d='M0 80 L38 34 L62 58 L92 22 L136 80 Z' fill='#2F7D5B'/><path d='M92 22 L82 34 L88 33 L92 38 L97 33 L102 34 Z' fill='#fff'/><path d='M0 80 L24 60 L48 80 Z' fill='#3E9B6A'/></svg>"),
  // Фото лагеря: палатки у озера, 600×160 — шире окна телефона, пока у img нет width.
  'lager.jpg': svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='600' height='160' viewBox='0 30 600 160' preserveAspectRatio='xMidYMid slice'><rect width='600' height='220' fill='#BFE3FA'/><circle cx='520' cy='48' r='26' fill='#FFD54A'/><path d='M0 150 L120 70 L220 130 L330 50 L470 140 L600 90 L600 220 L0 220 Z' fill='#5BAF7A'/><rect y='160' width='600' height='60' fill='#4FA9E8'/><path d='M60 160 L110 96 L160 160 Z' fill='#FA4F28'/><path d='M110 96 L100 160 L120 160 Z' fill='#C93A1A'/><path d='M200 162 L240 112 L280 162 Z' fill='#FFB020'/><path d='M240 112 L232 162 L248 162 Z' fill='#D98E00'/><path d='M380 162 L425 104 L470 162 Z' fill='#1E9E72'/><path d='M425 104 L416 162 L434 162 Z' fill='#147A57'/><path d='M500 175 h50 l-10 12 h-30 z' fill='#8B5A2B'/></svg>")
};
// url("имя") → настоящий файл урока; имени нет среди файлов — картинки нет (как «файл не найден»).
function bgUrl(v) {
  return String(v).replace(/url\(\s*(["']?)([^"')]*)\1\s*\)/gi, (m, q, name) => (FILES[name.trim()] ? 'url("' + FILES[name.trim()] + '")' : 'none'));
}
const V = (t, cls) => [P('v', 'c17-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c17-sel c17-part', sel), ' ', P('b', 'c17-punc', '{')], { d: 1, cls: 'c17-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c17-prop', x.prop), P('c', 'c17-punc', ':'), ' '].concat(x.val, [P('sc', 'c17-punc', ';')]),
    { d: 2, cls: 'c17-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c17-punc', '}')], { d: 1, cls: 'c17-cssline ' + (cls || '') })]);
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
  <span key="g" className={'kz-gap c17-slot ' + (cls || 'c17-slot-col') + (led ? ' kz-gap-led' : '')}>
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
// Основа сайта лагеря (урок 17): то, что не относится ни к одной станции, — отступы, размеры, белые карточки.
// Цвет кнопки — отдельной строкой (TUGMA_BG): в «большой проверке» её нет, там цвет кнопки задаёт сама поломка.
const TUGMA_BG = '.tugma { background-color: #FA4F28; }';
const BASE_LAGER = ['.shapka { padding: 14px 12px; }', 'h1 { margin: 0; font-size: 24px; }', '.quyosh { display: inline-block; }', '.nav { padding: 6px 0; }', '.menu { padding: 4px 8px; }',
  '.rasm { align-self: flex-start; }', '.karta { background-color: white; width: 28%; box-sizing: border-box; }', '.yangi { background-color: gold; padding: 2px 6px; font-size: 12px; }',
  '.tugma { color: white; padding: 10px 18px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }'];
const BASES = { site: BASE_LAGER.concat([TUGMA_BG]), boss: BASE_LAGER, none: [] };
// Урок 15: основа кубика в редакторе свёрнута — «.kub { … }» (рядом с блоком @keyframes код иначе не влезает в телефон);
// целиком она — на странице и в артефакте.
const baseL = (page) => (BASES[page] || BASES.site).map((r, i) => cssL('base' + i, 1, r.replace(/\{[^}]*\}/, '{ … }'), { cls: 'c17-dim' }));
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
  const slot = F.T.okNow ? [P('v', propSlot ? 'c17-prop' : 'c17-val', want)] : [<Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />];
  const val = [].concat(pre ? [P('pre', 'c17-val', pre), ' '] : [], slot, post ? [' ', P('post', 'c17-val', post)] : []);
  // Поле на месте свойства: «sel { ▢: fixed; }».
  const partsOf = () => (propSlot ? [P('s', 'c17-sel c17-part', sel), ' ', P('b', 'c17-punc', '{'), ' '].concat(slot, [P('c', 'c17-punc', ':'), ' ', P('fx', 'c17-val', fixed), P('sc', 'c17-punc', ';'), ' ', P('b2', 'c17-punc', '}')]) : ruleParts(sel, prop, val));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c17-sheet">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c17-s5 c17-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat((given || []).map((r, i) => cssL('g' + i, 1, r, { cls: 'c17-dim' })), [ruleLine('r', partsOf(), F.T.okNow ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" />{!F.T.okNow && F.T.lad.lv >= 3 ? <HelpCode code={want} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl, page })} rules={withBase(rules, page)} scroll={scroll == null ? null : scroll} hover={hoverOk && F.T.okNow ? hoverOk : null} pulse={pulseOk && F.T.okNow ? pulseOk : null} mouse={!!((hoverOk || pulseOk) && F.T.okNow)} timer /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={[]} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Блок @keyframes в редакторе: заголовок, кадры (каждый — строка), закрывающая скобка. Обычное правило — одна строка.
// slots — поля ввода на месте меток («▢», «▢1»…): кусок кода с таким текстом заменяется полем.
const slotify = (parts, slots) => (slots ? parts.map((x) => (x && x.props && typeof x.props.children === 'string' && slots[x.props.children] ? slots[x.props.children] : x)) : parts);
const lc = (base, extra) => Object.assign({}, extra || {}, { cls: 'c17-cssline ' + base + ' ' + ((extra && extra.cls) || '') });
// Условие @media в редакторе: скобки, имя, двоеточие, значение — своими цветами; метка ▢ — поле.
const mqParts = (cond) => String(cond).split(/(\(|\)|:|\s+)/).filter((x) => x !== '' && x !== undefined).map((x, i) => (
  /^\s+$/.test(x) ? ' ' : x === '(' || x === ')' || x === ':' ? P('q' + i, 'c17-punc', x) : /width$/.test(x) ? P('q' + i, 'c17-prop', x) : P('q' + i, 'c17-val', x)));
function ruleLines(k, d, text, extra, slots) {
  const t = String(text).trim();
  if (isMq(t)) {
    const m = /^@media\s*([^{]*)\{([\s\S]*)\}\s*$/.exec(t);
    const head = codeLine(k + 'h', slotify([P('at', 'c17-at', '@media'), ' '].concat(mqParts(m ? m[1].trim() : ''), [' ', P('b', 'c17-punc', '{')]), slots), Object.assign({ d }, lc('c17-mq', extra)));
    const rules = [];
    const re = /([^{}]+)\{([^}]*)\}/g;
    let f;
    while ((f = re.exec(m ? m[2] : ''))) rules.push(f[1].trim() + ' { ' + f[2].trim() + ' }');
    const body = rules.map((x, i) => { const l = codeLine(k + 'r' + i, cssTokens(x), Object.assign({ d: d + 1 }, lc('c17-mq', extra))); l.parts = slotify(l.parts, slots); return l; });
    return [head].concat(body, [codeLine(k + 'z', [P('z', 'c17-punc', '}')], Object.assign({ d }, lc('c17-mq', extra)))]);
  }
  if (!isKf(t)) { const l = cssL(k, d, t, extra); l.parts = slotify(l.parts, slots); return [l]; }
  const m = /^@keyframes\s+(\S+)\s*\{([\s\S]*)\}\s*$/.exec(t);
  const inner = m ? m[2] : '';
  const head = codeLine(k + 'h', [P('at', 'c17-at', '@keyframes'), ' ', P('n', 'c17-kfn', m ? m[1] : ''), ' ', P('b', 'c17-punc', '{')], Object.assign({ d }, lc('c17-kf', extra)));
  const frames = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let f;
  while ((f = re.exec(inner))) frames.push(f[1].trim() + ' { ' + f[2].trim() + ' }');
  const body = frames.map((x, i) => { const l = codeLine(k + 'f' + i, cssTokens(x), Object.assign({ d: d + 1 }, lc('c17-kf', extra))); l.parts = slotify(l.parts, slots); return l; });
  return [head].concat(body, [codeLine(k + 'z', [P('z', 'c17-punc', '}')], Object.assign({ d }, lc('c17-kf', extra)))]);
}
// Экран «впиши»: tpl — правила и блоки @keyframes, в одном из них метка ▢ (поле). Пустое поле — этого правила ещё нет.
// Переключатель ширины окна: компьютер (800 px) или телефон (360 px) — ученик сам проверяет страницу на обоих.
const VWS = [800, 360];
function WidthToggle({ vw, setVw }) {
  const pick = usePick();
  return (
    <div className="c17-wt" role="group" aria-label={pick(UI.width)}>
      {VWS.map((w) => (
        <button key={w} type="button" data-w={w} className={'c17-wt-b' + (vw === w ? ' is-on' : '')} onClick={() => { if (vw !== w) { sfx('tap', true); setVw(w); } }}>
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
  const slot = F.T.okNow ? P('v', 'c17-val', want) : <Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />;
  const lines = baseL().concat(...tpl.map((t, i) => ruleLines('t' + i, 1, t, { cls: t.indexOf('▢') >= 0 ? (F.T.okNow ? 'is-new' : 'is-hl') : '' }, { '▢': slot })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c17-sheet c17-fill">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c17-s5 c17-pair">
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
      <Sheet cls="c17-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c17-s5 c17-pair">
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


const nows = (v) => norm(v).replace(/\s+/g, '');
const MQ = (cond, inner) => '@media ' + cond + ' { ' + inner + ' }';
// Размер в px: «600px» → 600; иначе null.
const pxOf = (v) => { const m = /^(\d+)px$/.exec(nows(v)); return m ? parseInt(m[1], 10) : null; };
