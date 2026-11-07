// =============================================================================
// ЭКРАНЫ УРОКА 14 КУРСА CSS «Плавные эффекты» (облик «Редактор», 07.11.2026). Основа кода — урок 13 (tools/css13/).
// Типы заданий — по разделу 3а навыка: s3 вписать время (0.5s) — s4 сразу, быстро или медленно; s6 вписать свойство
// (background-color) — s7 какой transition нужен; s9 вписать 1000ms — s10 что поменять; s12 исправить «0,5s» — s13 найти
// правило, которое не работает; w1 правило целиком (transition: transform 0.3s); s14 своя кнопка; q1 верно или нет.
// Честный браузер: переход считает сам браузер (настоящий transition в стиле элемента); :hover настоящий (мышь, на
// телефоне — касание). На показах курсор сам наезжает на кнопку и уезжает (pulse); полоса времени — по событиям браузера.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'box-sizing', 'border-radius', 'box-shadow', 'border-top', 'border-right', 'border-bottom', 'border-left', 'display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap', 'position', 'top', 'right', 'bottom', 'left', 'transform', 'cursor', 'transition'];
const cssOk = (p, v) => {
  if (CSS_PROPS.indexOf(p) < 0 || !v) return false;
  try { return typeof CSS === 'undefined' || !CSS.supports ? true : CSS.supports(p, v); } catch (e) { return false; }
};
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
const sp = () => <span className="c14-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c14-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c14-mark c14-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c14-sel c14-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c14-sel c14-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c14-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c14-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c14-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c14-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c14-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c14-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c14-att c14-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c14-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c14-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
      // Страница короткая — шрифт ужимаем, чтобы она влезла целиком. Увеличенная кнопка страницу не ужимает:
      // у .c14-doc overflow: clip. Пока ужимаем — класс is-fit (transition: none), иначе при «all» шрифт кнопки
      // сам плавно уменьшался бы (переход font-size), а замер шёл бы по ещё большому шрифту.
      el.classList.add('is-fit');
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.7) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
      void getComputedStyle(el.querySelector('[data-hk]') || el).fontSize;   // стиль посчитан без перехода
      el.classList.remove('is-fit');
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
// Курсор мыши показа (как в уроках 4–5 курса HTML): стрелка, над элементом с cursor: pointer — рука.
const MouseCur = ({ at }) => (
  <span className={'c14-mouse' + (at.hand ? ' is-hand' : '')} style={{ left: at.x + 'px', top: at.y + 'px' }} aria-hidden="true">
    {at.hand
      ? <svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 2.5c-.9 0-1.6.7-1.6 1.6v8.6l-1.3-1.4c-.6-.7-1.7-.7-2.3-.1-.6.6-.6 1.5-.1 2.1l4.2 5.6c.8 1.1 2.1 1.7 3.4 1.7h3.6c2.2 0 4-1.8 4-4v-5.1c0-.9-.7-1.6-1.6-1.6-.4 0-.7.1-1 .4v-.3c0-.9-.7-1.6-1.6-1.6-.5 0-.9.2-1.2.5-.2-.7-.8-1.2-1.5-1.2-.4 0-.8.1-1.1.4V4.1c0-.9-.7-1.6-1.6-1.6z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" /></svg>
      : <svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 2.5 L5 19.5 L9.4 15.4 L12.3 21.6 L15.2 20.3 L12.4 14.3 L18.4 14.1 Z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
  </span>
);
// Полоса времени (урок 14) — как панель анимаций в DevTools: какое свойство меняется плавно, сколько секунд
// (по данным самого браузера: событие transitionrun и getComputedStyle) и полоса, что заполняется с той же
// кривой скорости (animation с тем же transition-timing-function). Без transition — «0s»: всё сразу.
const secOf = (v) => { const n = parseFloat(v) || 0; return /ms$/.test(v) ? n / 1000 : n; };
const durLabel = (sec) => (Math.round(sec * 100) / 100) + 's';
function TimeBar({ rows }) {
  return (
    <div className="c14-tl" aria-hidden="true" translate="no">
      {rows.map((r) => (
        <span key={r.p + r.id} className={'c14-tl-row' + (r.d ? '' : ' is-zero')}>
          <i className="c14-tl-p">{r.p}</i>
          <span className="c14-tl-bar"><b style={r.d && !reduceMotion() ? { animation: 'c14Fill ' + r.d + 's ' + r.fn + ' both' } : { width: '100%' }} /></span>
          <i className="c14-tl-d">{durLabel(r.d)}</i>
        </span>
      ))}
    </div>
  );
}
function CssPage({ els, rules, insp = true, scroll = null, hover: hover0 = null, mouse = false, pulse = null, timer = false }) {
  const R = rules || [];
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
  const hvNow = !!(hv || hk);
  useEffect(() => { setTrs([]); }, [JSON.stringify(R.map((r) => [r.sel, r.decls]))]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const d = ref.current;
    if (!timer || !d) return undefined;
    // Переходов нет (transition не задан) — «0s»: браузер меняет всё сразу.
    const e = d.querySelector('[data-hk]');
    const t0 = setTimeout(() => {
      if (!e) return;
      const cs = getComputedStyle(e);
      const any = String(cs.transitionDuration).split(',').some((x) => secOf(x.trim()) > 0);
      if (!any) { trId.current += 1; setTrs([{ p: 'transition', d: 0, fn: 'linear', id: trId.current }]); }
    }, 30);
    return () => clearTimeout(t0);
  }, [hvNow, timer]); // eslint-disable-line react-hooks/exhaustive-deps
  const ref = useFitPage(JSON.stringify([els, R.map((r) => [r.sel, r.decls])]));
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
    const off = () => { cancelAnimationFrame(raf); d.removeEventListener('transitionrun', onRun); d.removeEventListener('transitionend', onEnd); d.removeEventListener('transitioncancel', onEnd); page.removeEventListener('scroll', measure); };
    if (typeof ResizeObserver === 'undefined') return off;
    const ro = new ResizeObserver(() => measure());
    ro.observe(d); ro.observe(page);
    [...d.querySelectorAll('[data-t]')].forEach((c) => ro.observe(c));
    return () => { ro.disconnect(); off(); };
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
    const props = { key: el.k || i, className: 'c14-el c14-' + el.t + (el.cls ? ' ' + el.cls : '') + (el.hl ? ' is-hl' : ''), style: fixedLayer ? Object.assign({}, st, { position: 'absolute' }) : st, 'data-t': el.t + (el.cls ? '.' + el.cls.split(' ').join('.') : '') };
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
    <div ref={ref} className={'c14-doc' + (insp ? ' is-insp' : '')} style={doc}>
      <div className="c14-fixlayer" style={{ height: ph, marginBottom: -ph }} aria-hidden={fixedEls.length ? undefined : 'true'}>
        {fixedEls.map((el, i) => node(el, 'f' + i, true))}
      </div>
      {[].concat(...flowEls.map((el, i) => (i ? [' ', node(el, i)] : [node(el, i)])))}   {/* пробел между тегами, как перенос строки в HTML */}
      {insp ? boxes.map((b, i) => (
        <span key={'b' + i} className={'c14-ibox' + (b.hl ? ' is-hl' : '')} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} aria-hidden="true">{b.hv ? <i className="c14-hovtag" translate="no">:hover</i> : null}</span>
      )) : null}
      {timer && trs.length ? <TimeBar rows={trs} /> : insp && boxes.some((b) => b.hl) ? (
        <div className="c14-ilist" aria-hidden="true" translate="no">{boxes.filter((b) => b.hl).map((b, i) => <i key={i}>{b.t}{b.hv ? ':hover' : ''} {b.w}×{b.h}</i>)}</div>
      ) : null}
      {mouse && mpos ? <MouseCur at={mpos} /> : null}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c14-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c14-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c14-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c14-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c14-edge' }), tagL('bo', 0, 'body', false, { cls: 'c14-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c14-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c14-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
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
const ruleParts = (sel, prop, val) => [P('s', 'c14-sel c14-part', sel), ' ', P('b', 'c14-punc', '{'), ' ', P('p', 'c14-prop', prop), P('c', 'c14-punc', ':'), ' ']
  .concat(val, [P('sc', 'c14-punc', ';'), ' ', P('b2', 'c14-punc', '}')]);
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c14-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c14-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c14-cssline ' + (cls || '') });
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
const V = (t, cls) => [P('v', 'c14-val' + (cls ? ' ' + cls : ''), t)];
const blockL = (k, sel, decls, cls) => [codeLine(k + 'a', [P('s', 'c14-sel c14-part', sel), ' ', P('b', 'c14-punc', '{')], { d: 1, cls: 'c14-cssline ' + (cls || '') })]
  .concat(decls.map((x, i) => codeLine(k + 'd' + i + (x.key || ''), [P('p', 'c14-prop', x.prop), P('c', 'c14-punc', ':'), ' '].concat(x.val, [P('sc', 'c14-punc', ';')]),
    { d: 2, cls: 'c14-cssline ' + (x.cls != null ? x.cls : (cls || '')) })),
  [codeLine(k + 'z', [P('b2', 'c14-punc', '}')], { d: 1, cls: 'c14-cssline ' + (cls || '') })]);
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
  <span key="g" className={'kz-gap c14-slot ' + (cls || 'c14-slot-col') + (led ? ' kz-gap-led' : '')}>
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
// Основа страницы (тусклая строка кода): кнопка сиреневая, с внутренним отступом.
const BASES = { btn: ['.tugma { background-color: lavender; padding: 10px; cursor: pointer; }'] };
const baseL = (page) => (BASES[page] || BASES.btn).map((r, i) => cssL('base' + i, 1, r, { cls: 'c14-dim' }));
const withBase = (list, page) => cssParse((BASES[page] || BASES.btn).concat(list || []).join(' '));
// Экран «впиши значение»: правило sel { prop: [pre] ▢ [post]; } (и готовые правила given), страница честно.
function FillScreen({ p, c, F, sel, prop, want, given, hl, pre, post, propSlot, fixed, page, scroll, hoverOk, pulseOk }) {
  const pick = usePick();
  const v = F.T.okNow ? want : F.ty.val.trim();
  const full = [pre, v, post].filter(Boolean).join(' ');
  // Пустое поле — правила ещё нет (иначе «transition: 0.5s» уже сработал бы: без свойства это all).
  const rules = (given || []).concat(v ? [ruleTxt(sel, [propSlot ? [v, fixed] : [prop, full]])] : []);
  const slot = F.T.okNow ? [P('v', propSlot ? 'c14-prop' : 'c14-val', want)] : [<Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />];
  const val = [].concat(pre ? [P('pre', 'c14-val', pre), ' '] : [], slot, post ? [' ', P('post', 'c14-val', post)] : []);
  // Поле на месте свойства: «sel { ▢: fixed; }».
  const partsOf = () => (propSlot ? [P('s', 'c14-sel c14-part', sel), ' ', P('b', 'c14-punc', '{'), ' '].concat(slot, [P('c', 'c14-punc', ':'), ' ', P('fx', 'c14-val', fixed), P('sc', 'c14-punc', ';'), ' ', P('b2', 'c14-punc', '}')]) : ruleParts(sel, prop, val));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c14-s5 c14-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat((given || []).map((r, i) => cssL('g' + i, 1, r, { cls: 'c14-dim' })), [ruleLine('r', partsOf(), F.T.okNow ? 'is-new' : 'is-hl')]))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl, page })} rules={withBase(rules, page)} scroll={scroll == null ? null : scroll} hover={hoverOk && F.T.okNow ? hoverOk : null} pulse={pulseOk && F.T.okNow ? HV : null} mouse={!!((hoverOk || pulseOk) && F.T.okNow)} timer /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={[]} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Экран-показ: шаги правил по очереди; steps[n] — список правил, hl[n] — подсвеченный элемент.
function ShowScreen({ p, c, id, steps, says, asks, pose, hl, page, scrolls, hovers, pulse }) {
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
      <Sheet cls="c14-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c14-s5 c14-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL(page).concat(rules.map((r, i) => cssL('r' + i + r, 1, r, { cls: live && prev.indexOf(r) < 0 ? 'is-new is-read' : '' }))))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: hl ? hl[Math.min(n, hl.length - 1)] : null, page })} rules={withBase(rules, page)} scroll={scrolls ? scrolls[n] : null} hover={hovers ? hovers[Math.min(n, hovers.length - 1)] : null} pulse={pulse ? HV : null} mouse={!!(hovers || pulse)} timer /></Br></div>
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


// ── СТРАНИЦА УРОКА: игра Коди — заголовок, абзац, кнопка «Играть» (настоящий <button>, :hover) и абзац под ней ──
const site = (pick, o) => {
  const x = o || {};
  return [
    { t: 'h1', text: pick(C.site.title), k: 'h' },
    { t: 'p', text: pick(C.site.p1), k: 'p1' },
    { t: 'button', cls: 'tugma', k: 'tg', text: pick(C.site.btn), hoverable: true, hl: x.hl === 'tugma' },
    { t: 'p', text: pick(C.site.p2), k: 'p2' }
  ];
};
const HV = 'tg';
const nows = (v) => norm(v).replace(/\s+/g, '');
// Правила урока: что меняется под мышкой (H_*) и сам переход (TR).
const H_TF = '.tugma:hover { transform: scale(1.2); }';
const H_BG = '.tugma:hover { background-color: orange; }';
const H_MV = '.tugma:hover { transform: translate(70px, 0px); }';
const TR = (v) => '.tugma { transition: ' + v + '; }';
// Время перехода: «0.5s», «.5s», «500ms» → секунды; иначе null. Запятая вместо точки и число без единицы — свои ошибки.
const timeOf = (v) => {
  const m = /^(\d*\.?\d+)(s|ms)$/.exec(nows(v));
  if (!m) return null;
  return m[2] === 'ms' ? parseFloat(m[1]) / 1000 : parseFloat(m[1]);
};
const hasComma = (v) => /\d,\d/.test(String(v || ''));
const noUnit = (v) => /^\d*\.?\d+$/.test(nows(v));
// Имена свойств, которые знает ученик (для опечаток: transition принимает любое слово, но плавным ничего не станет).
const KNOWN_P = ['all', 'transform', 'background-color', 'color', 'width', 'height', 'padding', 'margin', 'border', 'border-radius', 'box-shadow', 'font-size', 'opacity', 'top', 'left'];
const EASES = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];

// =============================================================================
// S1. КРЮЧОК — кнопка «Играть» под мышкой прыгает (рост и цвет — мгновенно); «Превратить» — transition: всё плавно.
// Загадка: Коди писал transition внутри .tugma:hover — «плавно в обе стороны»?
// =============================================================================
const S1_CSS = [H_TF, H_BG];
const S1_TR = TR('all 0.4s');
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
  const rules = S1_CSS.concat(on ? [S1_TR] : []);
  const lines = baseL().concat(S1_CSS.map((r, i) => cssL('h' + i, 1, r)), on ? [cssL('t', 1, S1_TR, { cls: 'is-new' })] : []);
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c14-s5 c14-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: 'tugma' })} rules={withBase(rules)} pulse={HV} mouse timer /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// S2. transition (показ) — без transition кнопка прыгает (0s); transform 1s — медленно и плавно; 0.3s — быстро и плавно.
function S2({ p }) {
  const c = C.s2;
  return <ShowScreen p={p} c={c} id="s2" pulse
    steps={[[H_TF], [H_TF], [H_TF, TR('transform 1s')], [H_TF, TR('transform 0.3s')]]}
    says={[c.sayJump, c.saySlow, c.sayFast]} hl={['tugma']}
    asks={{ list: [c.askStart, c.askJump, c.askSlow, c.askFast], done: c.askDone }} />;
}
// S3. ПОЛСЕКУНДЫ — .tugma { transition: transform ▢; } → 0.5s (или .5s, 500ms).
function S3({ p }) {
  const c = C.s3;
  const Fl = useFill('s3', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (hasComma(v)) return c.msgs.comma;
    if (noUnit(v)) return c.msgs.unit;
    const t = timeOf(v);
    if (t == null || !cssOk('transition', 'transform ' + v)) return c.msgs.bad;
    return Math.abs(t - 0.5) < 1e-9 ? null : c.msgs.other;
  });
  return <FillScreen p={p} c={c} F={Fl} sel=".tugma" prop="transition" pre="transform" want="0.5s" given={[H_TF]} hl="tugma" pulseOk />;
}

// S4. СРАЗУ, БЫСТРО ИЛИ МЕДЛЕННО? (Sort по одному) — строка transition → как поведёт себя кнопка.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const R = useRounds('s4', c, c.items, (it) => it.right, (it) => it.why, (it) => pick(c.opts[it.right]));
  const btn = (v) => (
    <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
      className={'kz-btn c14-tf c14-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
      {pick(c.opts[v])}<Led on={R.led && !R.ok && R.off.length === 0} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <KzCode lines={[cssL('c', 0, R.it.code, { cls: 'is-hl' })]} cls="kz-code-sm c14-big" />
            <div className="kz-pick c14-sides c14-three">{btn('jump')}{btn('fast')}{btn('slow')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S5. КАКОЕ СВОЙСТВО (показ) — под мышкой меняются размер и цвет: transform 1s — плавный только рост; background-color 1s —
// только цвет; all 1s — всё.
function S5({ p }) {
  const c = C.s5;
  return <ShowScreen p={p} c={c} id="s5" pulse
    steps={[[H_TF, H_BG], [H_TF, H_BG, TR('transform 1s')], [H_TF, H_BG, TR('background-color 1s')], [H_TF, H_BG, TR('all 1s')]]}
    says={[c.sayTf, c.sayBg, c.sayAll]} hl={['tugma']}
    asks={{ list: [c.askStart, c.askTf, c.askBg, c.askAll], done: c.askDone }} />;
}
// S6. ПЛАВНЫЙ ЦВЕТ — под мышкой меняется фон: .tugma { transition: ▢ 0.5s; } → background-color.
function S6({ p }) {
  const c = C.s6;
  const Fl = useFill('s6', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === 'background-color') return null;
    if (v === 'all') return c.msgs.all;
    if (v === 'color') return c.msgs.color;
    if (v === 'transform') return c.msgs.tf;
    if (v === 'orange') return c.msgs.value;
    if (KNOWN_P.indexOf(v) < 0) return c.msgs.typo;
    return c.msgs.other;
  });
  return <FillScreen p={p} c={c} F={Fl} sel=".tugma" prop="transition" post="0.5s" want="background-color" given={[H_BG]} hl="tugma" pulseOk />;
}

// S7. КАКОЙ transition? (выбор по одному) — дано правило :hover; какой transition сделает его плавным.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const R = useRounds('s7', c, c.rounds, (it) => it.want, (it) => it.why, (it) => it.want);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <KzCode lines={[cssL('c', 0, R.it.hover, { cls: 'is-hl' }), cssL('t', 0, '.tugma { transition: ? ; }', { cls: 'c14-dim' })]} cls="kz-code-sm c14-big" />
            <div className="kz-pick c14-opts">
              {R.it.opts.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c14-tf c14-opt ' + (R.ok && v === R.it.want ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && !R.ok && v === R.it.want ? ' is-led' : '')}>
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

// S8. ВРЕМЯ И СКОРОСТЬ (показ) — 0.5s = 500ms; сдвиг за 2s: linear — ровно; ease (сам по себе) — разгон и торможение.
function S8({ p }) {
  const c = C.s8;
  return <ShowScreen p={p} c={c} id="s8" pulse
    steps={[[H_TF, TR('transform 0.5s')], [H_TF, TR('transform 500ms')], [H_MV, TR('transform 2s linear')], [H_MV, TR('transform 2s ease')]]}
    says={[c.sayMs, c.sayLinear, c.sayEase]} hl={['tugma']}
    asks={{ list: [c.askStart, c.askMs, c.askLinear, c.askEase], done: c.askDone }} />;
}
// S9. СЕКУНДА В МИЛЛИСЕКУНДАХ — .tugma { transition: transform ▢; } → 1000ms.
function S9({ p }) {
  const c = C.s9;
  const Fl = useFill('s9', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (hasComma(v)) return c.msgs.bad;
    if (noUnit(v)) return c.msgs.unit;
    const t = timeOf(v);
    if (t == null) return c.msgs.bad;
    if (!/ms$/.test(v)) return Math.abs(t - 1) < 1e-9 ? c.msgs.sec : c.msgs.other;
    return Math.abs(t - 1) < 1e-9 ? null : c.msgs.other;
  });
  return <FillScreen p={p} c={c} F={Fl} sel=".tugma" prop="transition" pre="transform" want="1000ms" given={[H_TF]} hl="tugma" pulseOk />;
}

// S10. ЧТО ПОМЕНЯТЬ? (Sort по одному) — задача словами → время, свойство, linear или all.
const WHAT4 = ['0.2s', 'background-color', 'linear', 'all'];
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const R = useRounds('s10', c, c.items, (it) => it.right, (it) => it.why, (it) => it.right);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            <KzCode lines={[cssL('c', 0, TR('transform 2s'), { cls: 'c14-dim' })]} cls="kz-code-sm" />
            <div className="c14-card c14-tf-card kz-a-drop">
              <span className="c14-card-h">{pick(c.card)}</span>
              <p className="c14-tf-t">{pick(R.it.t)}</p>
            </div>
            <div className="kz-pick c14-sides">
              {WHAT4.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c14-tf c14-where ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
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

// S11. КОГДА НЕ РАБОТАЕТ (показ) — 0.5 без s; 0,5s с запятой (браузер выбросил правило); transfrom — опечатка: браузер
// правило принял, но такого свойства нет — плавным не стало ничего.
function S11({ p }) {
  const c = C.s11;
  return <ShowScreen p={p} c={c} id="s11" pose="curious" pulse
    steps={[[H_TF, TR('transform 0.5s')], [H_TF, TR('transform 0.5')], [H_TF, TR('transform 0,5s')], [H_TF, TR('transfrom 0.5s')]]}
    says={[c.sayUnit, c.sayComma, c.sayTypo]} hl={['tugma']}
    asks={{ list: [c.askStart, c.askUnit, c.askComma, c.askTypo], done: c.askDone }} />;
}
// S12. ИСПРАВЬ (Debug & Fix) — в поле «transform 0,5s»: нужна точка.
function S12({ p }) {
  const c = C.s12;
  const Fl = useFill('s12', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (hasComma(v)) return c.msgs.comma;
    const parts = v.split(' ');
    if (parts[0] !== 'transform') return KNOWN_P.indexOf(parts[0]) < 0 ? c.msgs.typo : c.msgs.other;
    if (parts.length < 2 || noUnit(parts[1])) return c.msgs.unit;
    const t = timeOf(parts[1]);
    if (t == null || parts.length > 2) return c.msgs.bad;
    return Math.abs(t - 0.5) < 1e-9 ? null : c.msgs.other;
  }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !Fl.T.okNow && !Fl.ty.val) { set0.current = true; Fl.ty.setVal('transform 0,5s'); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <FillScreen p={p} c={c} F={Fl} sel=".tugma" prop="transition" want="transform 0.5s" given={[H_TF]} hl="tugma" pulseOk />;
}

// S13. НАЙДИ ОШИБКУ (Error Detective) — раунд 1: время без s; раунд 2: опечатка transfrom. Курсор водит по кнопке сам,
// полоса времени честно показывает «0s».
const S13_ROUNDS = [
  { kind: 'unit', bad: 1, rules: ['h1 { color: orange; }', TR('transform 1'), H_TF], fixed: TR('transform 1s') },
  { kind: 'typo', bad: 2, rules: ['.tugma { background-color: gold; }', H_TF, TR('transfrom 0.5s')], fixed: TR('transform 0.5s') }
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
    cls: 'c14-cssline c14-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c14-s5 c14-pair c14-q1" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={withBase(rules)} insp={false} pulse={HV} mouse timer /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — «.tugma { transition: transform 0.3s; }» при готовом .tugma:hover со scale.
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return msgs.colon;
  const sel = m[1].trim().toLowerCase();
  if (/^\.tugma\s*:hover$/.test(sel)) return msgs.hoverSel;
  if (sel !== '.tugma') return msgs.sel;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = norm(d.slice(i + 1));
  if (prop !== 'transition') return msgs.prop;
  if (hasComma(val)) return msgs.comma;
  const parts = val.split(' ');
  if (parts[0] !== 'transform') return KNOWN_P.indexOf(parts[0]) < 0 && !timeOf(parts[0]) ? msgs.typo : msgs.which;
  if (parts.length < 2 || noUnit(parts[1])) return msgs.unit;
  const tt = timeOf(parts[1]);
  if (tt == null || !cssOk('transition', val)) return msgs.bad;
  if (Math.abs(tt - 0.3) > 1e-9) return msgs.other;
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
  const css = T.okNow ? TR('transform 0.3s') : ty.val;
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
      <Sheet cls="c14-sheet c14-w1">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c14-s5 c14-pair">
          <div className="kz-col"><KzCode lines={styleWrap(baseL().concat([cssL('h', 1, H_TF, { cls: 'c14-dim' }), T.okNow ? cssL('r', 1, css, { cls: 'is-new' }) : ruleLine('r', [<span key="g" className={'kz-gap c14-slot c14-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={64} /></span>], 'is-hl')]))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: 'tugma' })} rules={withBase([H_TF, css])} pulse={T.okNow ? HV : null} mouse={T.okNow} timer /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['{', '}', ':', ';', '.']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// S14. СВОЯ КНОПКА (Live Code Preview, «Готово») — что меняется под мышкой (transform), время и скорость перехода.
const OWN = [{ k: 'myTf', f: 'fa', max: 24 }, { k: 'myDur', f: 'fb', max: 8 }, { k: 'myFn', f: 'fc', max: 12 }];
const ownRules = (v) => ['.tugma:hover { transform: ' + v[0] + '; }', '.tugma { transition: transform ' + v[1] + ' ' + v[2] + '; }'];
const fnOk = (v) => EASES.indexOf(nows(v)) >= 0;
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
    if (!cssOk('transform', norm(v[0]))) return fillL(c.msgs.tf, { w: v[0] });
    if (hasComma(v[1])) return c.msgs.comma;
    if (noUnit(v[1])) return c.msgs.unit;
    const t = timeOf(v[1]);
    if (t == null) return fillL(c.msgs.time, { w: v[1] });
    if (t <= 0) return c.msgs.zero;
    if (t > 5) return c.msgs.long;
    if (!fnOk(v[2])) return fillL(c.msgs.fn, { w: v[2] });
    return null;
  };
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = issueOf();
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    OWN.forEach((o, i) => store.set(o.k, i === 2 ? nows(v[i]) : norm(v[i]))); put({ done: true });
    log({ screenId: 's14', type: 'own-transition', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, transform: v[0], duration: v[1], timing: v[2] });
    sayNow(c.ok, 'cheer');
  };
  const okNow = !issueOf();
  const rules = okNow ? ownRules(v.map(norm)) : [];
  const field = (i) => (
    <span key={OWN[i].f} className={'kz-gap c14-slot c14-slot-col' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={OWN[i].f}>
      <InlineInput value={vals[i]} onChange={(x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={OWN[i].max} />
    </span>
  );
  const val = (i) => (solved ? P('v' + i, 'c14-val', v[i]) : field(i));
  const lines = [ruleLine('fa', ruleParts('.tugma:hover', 'transform', [val(0)]), solved ? 'is-new' : 'is-hl'),
    ruleLine('fb', ruleParts('.tugma', 'transition', [P('tp', 'c14-val', 'transform'), ' ', val(1), ' ', val(2)]), solved ? 'is-new' : 'is-hl')];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c14-sheet kz-typed c14-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={site(pick)} rules={withBase(rules)} insp={false} pulse={solved ? HV : null} mouse={solved} timer /></Br>
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
      className={'kz-btn c14-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = { comma: [cssL('c', 0, TR('transform 0,5s'))], inHover: [cssL('c', 0, '.tugma:hover { transition: transform 0.5s; }')] };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c14-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c14-card c14-tf-card kz-a-drop">
              <span className="c14-card-h">{pick(c.card)}</span>
              <p className="c14-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c14-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S15. ВЫВОД — разгадка: transition внутри .tugma:hover — туда плавно, обратно прыжком (правило с :hover уходит вместе
// с мышкой и забирает transition); в .tugma — плавно в обе стороны. Своя кнопка; роли.
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const own = [store.get('myTf') || 'scale(1.2)', store.get('myDur') || '0.3s', store.get('myFn') || 'ease'];
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle' || curK === 'riddle2';
  const rows = curK === 'riddle' ? [H_TF, '.tugma:hover { transition: transform 0.6s; }'] : curK === 'riddle2' ? [H_TF, TR('transform 0.6s')] : ownRules(own);
  const ex = { tr: 'transition', time: '0.3s · 300ms', prop: 'transform · all', place: '.tugma { … }' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c14-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'tugma' : null })} rules={withBase(rows)} insp={riddle} pulse={HV} mouse timer /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['tr', 'time', 'prop', 'place'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" /><span translate="no">{pick(c.roles[k])}</span>{curK === k ? <code className="c14-role-ex" translate="no">{ex[k]}</code> : null}
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
// «Повторить» стирает только экран; своя кнопка ученика (myTf, myDur, myFn) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя кнопка ученика.
function lessonCss14Artifact(store) {
  const v = OWN.map((o) => store.get(o.k) || '');
  if (!v.some(Boolean)) return null;
  return { type: 'html-page', transform: v[0], duration: v[1], timing: v[2],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening tugmam</title>', '    <style>'].concat(BASES.btn.map((r) => '      ' + r),
      ownRules(v).map((r) => '      ' + escHtml(r)),
      ['    </style>', '  </head>', '  <body>', '    <button class="tugma">O\'ynash</button>', '  </body>', '</html>']).join('\n') };
}

export default function CssTransition({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss14Artifact(store) })
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
