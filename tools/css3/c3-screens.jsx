// =============================================================================
// ЭКРАНЫ УРОКА 3 КУРСА CSS «Цвета» (облик «Редактор», 05.11.2026). Основа кода — урок 2 курса CSS (tools/css2/).
// Типы заданий — по разделу 3а навыка: s3 вписать hex — s4 найти пару; s6 три числа rgb — s7 какой код;
// s9 место на круге — s10 светлый или тёмный; s12 поставить «#» — s13 найти сломанное правило; w1 правило целиком;
// s14 свои цвета; q1 верно или нет. Экрана плана нет.
// Честный браузер: принимает ли браузер цвет — решает сам Chrome (CSS.supports), один ли это цвет — canvas.
// Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();


// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
const CSS_PROPS = ['color', 'background-color', 'font-size'];
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
  return st;
};
// Пробел в строке редактора — свой кусок (строка — flex, голые пробелы схлопываются).
const sp = () => <span className="c3-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c3-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c3-mark c3-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c3-sel c3-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c3-sel c3-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c3-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c3-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c3-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c3-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c3-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c3-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c3-att c3-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c3-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c3-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
function CssPage({ els, rules, tap, mark, led, off }) {
  const R = rules || [];
  const ref = useFitPage(JSON.stringify([els.map((b) => [b.t, b.k, b.text, b.cls, b.id, b.hl]), R.map((r) => [r.sel, r.decls]), mark, off]));
  const body = styleFor(R, { t: 'body' });
  const bg = body.backgroundColor || '';
  useLayoutEffect(() => {
    const el = ref.current && ref.current.closest('.kz-br-body');
    if (el) el.style.backgroundColor = bg;
  }, [bg]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className="c3-doc" style={body}>
      {els.map((el, i) => {
        const c = 'c3-blk c3-' + el.t + (el.hl ? ' is-hl' : '') + (mark && mark.indexOf(i) >= 0 ? ' is-mark' : '') + (off && off.indexOf(i) >= 0 ? ' is-off' : '') + (tap ? ' is-tap' : '');
        return (
          <div key={el.k || i} className={c} style={el.t === 'raw' ? {} : styleFor(R, el)} data-i={i}
            onClick={tap ? () => tap(i) : undefined}>{el.text}{led === i ? <Led on /> : null}</div>
        );
      })}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c3-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c3-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c3-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c3-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c3-edge' }), tagL('bo', 0, 'body', false, { cls: 'c3-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c3-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c3-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;

// ── ЦВЕТА УРОКА ────────────────────────────────────────────────────────────
const LOGO = '#FA4F28';
const INK = '#1F2430';   // цвет текста страницы без правил (как в .c3-doc)
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
const rgbOf = (v) => {
  const k = colorKey(v);
  const m = k && /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(k);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
};
const hex2 = (n) => ('0' + Math.max(0, Math.min(255, n | 0)).toString(16)).slice(-2).toUpperCase();
const P = (k, cls, t) => <span key={k} className={cls}>{t}</span>;
// Правило «sel { prop: VALUE; }» с готовыми кусками значения.
const ruleParts = (sel, prop, val) => [P('s', 'c3-sel c3-part', sel), ' ', P('b', 'c3-punc', '{'), ' ', P('p', 'c3-prop', prop), P('c', 'c3-punc', ':'), ' ']
  .concat(val, [P('sc', 'c3-punc', ';'), ' ', P('b2', 'c3-punc', '}')]);
// hex по парам: «#», красная, зелёная, синяя пары (lit — горят пары).
const hexVal = (hex, lit) => [<span key="hx" className={'c3-val c3-hex' + (lit ? ' is-lit' : '')}>
  <span className="c3-hx-m">#</span><span className="c3-hx c3-hx-r">{hex.slice(0, 2)}</span><span className="c3-hx c3-hx-g">{hex.slice(2, 4)}</span><span className="c3-hx c3-hx-b">{hex.slice(4, 6)}</span></span>];
// rgb по числам (lit — горят числа).
const rgbVal = (v, lit) => [<span key="rg" className={'c3-val c3-rgbv' + (lit ? ' is-lit' : '')}>rgb(<span className="c3-hx c3-hx-r">{v[0]}</span>,{' '}<span className="c3-hx c3-hx-g">{v[1]}</span>,{' '}<span className="c3-hx c3-hx-b">{v[2]}</span>)</span>];
// hsl: место на круге, насыщенность, светлота (lit — 'h' | 'l').
const hslVal = (h, s, l, lit) => [<span key="hs" className="c3-val c3-hslv">hsl(<span className={'c3-hs' + (lit === 'h' ? ' is-cur' : '')}>{h}</span>,{' '}<span className="c3-hs">{s}</span>,{' '}<span className={'c3-hs' + (lit === 'l' ? ' is-cur' : '')}>{l}</span>)</span>];
const styleWrap = (rows) => [tagL('so', 0, 'style', false, { cls: 'c3-edge' })].concat(rows, [tagL('sc', 0, 'style', true, { cls: 'c3-edge' })]);
const ruleLine = (k, parts, cls) => codeLine(k, parts, { d: 1, cls: 'c3-cssline ' + (cls || '') });
// Длинное правило — в три строки, как пишут CSS: «sel {», «  prop: VALUE;», «}».
const ruleBlock = (k, sel, prop, val, cls) => [
  codeLine(k + 'a', [P('s', 'c3-sel c3-part', sel), ' ', P('b', 'c3-punc', '{')], { d: 1, cls: 'c3-cssline ' + (cls || '') }),
  codeLine(k + 'b', [P('p', 'c3-prop', prop), P('c', 'c3-punc', ':'), ' '].concat(val, [P('sc', 'c3-punc', ';')]), { d: 2, cls: 'c3-cssline ' + (cls || '') }),
  codeLine(k + 'c', [P('b2', 'c3-punc', '}')], { d: 1, cls: 'c3-cssline ' + (cls || '') })
];

// Страница сайта Коди: логотип, заголовок, два абзаца.
const site = (pick, o) => {
  const x = o || {};
  return [
    x.noLogo ? null : { t: 'logo', text: 'Kodi', k: 'lg' },
    { t: 'h1', text: x.title || pick(C.site.title), k: 'h', hl: !!x.hl },
    { t: 'p', text: pick(C.site.hello), k: 'p1' },
    x.short || !x.noLogo ? null : { t: 'p', text: pick(C.site.hobby), k: 'p2' }
  ].filter(Boolean);
};

// Лучи: три полосы (красный, зелёный, синий) и пятно цвета. fmt — hex или числа.
function Mixer({ rgb, fmt, lit, extremes }) {
  const pick = usePick();
  const v = rgb || [0, 0, 0];
  const rows = [['r', C.site.red], ['g', C.site.green], ['b', C.site.blue]];
  return (
    <div className={'c3-mx' + (rgb ? '' : ' is-none')} aria-hidden="true">
      <div className="c3-mx-rows">
        {rows.map(([k, name], i) => (
          <div key={k} className={'c3-mx-row c3-mx-' + k + (lit === 'all' || lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0) ? ' is-on' : '')}>
            <span className="c3-mx-l">{pick(name)}</span>
            <span className="c3-mx-bar"><i style={{ width: (v[i] / 255 * 100).toFixed(1) + '%' }} /></span>
            <span className="c3-mx-v" translate="no">{fmt === 'hex' ? hex2(v[i]) : v[i]}</span>
          </div>
        ))}
      </div>
      <span className="c3-mx-res" style={{ background: rgb ? 'rgb(' + v.join(',') + ')' : 'transparent' }} />
      {extremes ? (
        <div className="c3-mx-ext c3-a-in">
          <span><i style={{ background: '#000' }} /><b translate="no">0, 0, 0</b></span>
          <span><i style={{ background: '#fff' }} /><b translate="no">255, 255, 255</b></span>
        </div>
      ) : null}
    </div>
  );
}

// Круг цветов: метка — место (hue), в середине — цвет; полоса светлоты.
function Wheel({ hue, light, showLight }) {
  const h = Number.isFinite(hue) ? hue : null;
  const l = Number.isFinite(light) ? light : 50;
  const lab = (deg, t) => {
    const a = (deg - 90) * Math.PI / 180;
    return <span key={t} className="c3-wh-lab" style={{ left: (50 + 64 * Math.cos(a)).toFixed(1) + '%', top: (50 + 64 * Math.sin(a)).toFixed(1) + '%' }} translate="no">{t}</span>;
  };
  return (
    <div className="c3-whbox" aria-hidden="true">
      <div className="c3-wh">
        <div className="c3-wh-ring" />
        {h !== null ? <div className="c3-wh-hand" style={{ transform: 'rotate(' + h + 'deg)' }}><i /></div> : null}
        <div className="c3-wh-mid" style={{ background: h !== null ? 'hsl(' + h + ', 100%, ' + l + '%)' : 'transparent' }} />
        {lab(0, '0')}{lab(120, '120')}{lab(240, '240')}
      </div>
      {showLight ? (
        <div className="c3-lb">
          <div className="c3-lb-bar" style={{ background: 'linear-gradient(90deg, #000, hsl(' + (h || 0) + ', 100%, 50%), #fff)' }}><i style={{ left: l + '%' }} /></div>
          <div className="c3-lb-t" translate="no"><span>0%</span><b>{l}%</b><span>100%</span></div>
        </div>
      ) : null}
    </div>
  );
}

// Сравнение: цвет логотипа и цвет заголовка — совпали или нет (заголовок — что вышло на странице).
function LogoMatch({ color }) {
  const pick = usePick();
  const k = colorKey(color);
  const ok = !!k && k === colorKey(LOGO);
  return (
    <div className="c3-cmp">
      <span className="c3-cmp-i"><i style={{ background: LOGO }} />{pick(C.site.logo)}</span>
      <span className="c3-cmp-i"><i style={{ background: k || INK }} />{pick(C.site.heading)}</span>
      <b className={'c3-cmp-r' + (ok ? ' is-ok' : '')}>{pick(ok ? C.site.match : C.site.noMatch)}</b>
    </div>
  );
}
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

// =============================================================================
// S1. КРЮЧОК — логотип Коди и заголовок: имена orange, tomato, orangered по очереди — ни одно не совпадает.
// «Превратить» — «#FA4F28»: совпало. Загадка: Коди написал код без «#».
// =============================================================================
const S1_NAMES = ['orange', 'tomato', 'orangered'];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [ni, setNi] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  useEffect(() => {
    if (on) return undefined;
    const t = setInterval(() => setNi((x) => (x + 1) % S1_NAMES.length), reduceMotion() ? 2600 : 1600);
    return () => clearInterval(t);
  }, [on]);
  const turn = () => {
    if (!canTap || on) return;
    sfx('soft', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.magicP, 'explain'); say(c.done, 'think');
  };
  const val = on ? LOGO : S1_NAMES[ni];
  const css = 'h1 { color: ' + val + '; }';
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([cssL('r' + (on ? 'x' : ni), 1, css, { cls: on ? 'is-new' : 'is-hl' })])} cls="kz-code-sm" />
            <LogoMatch color={val} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { hl: !on })} rules={cssParse(css)} /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. hex (показ) — «#FF0000»: «#» и три пары; пары загораются цветами лучей; FF переезжает: зелёный, синий.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayParts, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayGreen, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayBlue, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const hex = n === 3 ? '0000FF' : n === 2 ? '00FF00' : 'FF0000';
  const askText = solved || demo.done ? c.askDone : n >= 1 ? c.askParts : c.askStart;
  const lit = n === 1 ? 'all' : n === 2 ? 'g' : n === 3 ? 'b' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r' + n, ruleParts('h1', 'color', hexVal(hex, n >= 1)), n >= 2 && live ? 'is-new is-read' : n >= 1 ? 'is-read' : '')])} cls="kz-code-sm" />
            <Mixer rgb={rgbOf('#' + hex)} fmt="hex" lit={live ? lit : null} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse('h1 { color: #' + hex + '; }')} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ hex (Fill in the Blanks) — «h1 { color: #▢; }»: синий. Браузер красит то, что вписано;
// короткая запись «00F» — тоже синий (честно).
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 8 });
  const T = useTypeTask('s3', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const w = T.okNow ? '0000FF' : ty.val.replace(/\s+/g, '');
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const v = ty.val.replace(/\s+/g, '');
    const issue = !v ? c.msgs.empty : /^#/.test(v) ? c.msgs.hash : /[^0-9a-f]/i.test(v) ? c.msgs.chars : v.length !== 6 && v.length !== 3 ? c.msgs.len
      : colorKey('#' + v) === colorKey('#0000FF') ? null : c.msgs.other;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-hex', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const val = T.okNow ? hexVal('0000FF', true) : [<span key="m" className="c3-val c3-hex"><span className="c3-hx-m">#</span></span>,
    <span key="g" className={'kz-gap c3-slot c3-slot-hex' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={8} /></span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r', ruleParts('h1', 'color', val), T.okNow ? 'is-new' : 'is-hl')])} cls="kz-code-sm" />
            <Mixer rgb={rgbOf('#' + w)} fmt="hex" lit={T.lad.lv >= 2 && !T.okNow ? 'b' : null} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse('h1 { color: #' + w + '; }')} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['0', 'F']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length >= 6} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. НАЙДИ ПАРУ (Matching Pairs) — #FF0000, #00FF00, #000000 ↔ пятна цвета.
// =============================================================================
const S4_CODES = ['red', 'green', 'black'];
const S4_CARDS = ['black', 'red', 'green'];
const S4_TXT = { red: '#FF0000', green: '#00FF00', black: '#000000' };
function S4({ p }) {
  const pick = usePick();
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
      log({ screenId: 's4', type: 'match-hex', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene c3-match">
          <div className="c3-match-col">
            {S4_CODES.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code c3-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{S4_TXT[t]}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="c3-match-col">
            {S4_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'c3-mcard c3-swcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="c3-sw" style={{ background: S4_TXT[k] }} />
                  {ok ? <span className="c3-mcard-tag" translate="no">{S4_TXT[k]}</span> : null}
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
// S5. rgb (показ) — «rgb(255, 0, 0)»: три числа; красный + зелёный = жёлтый; все нули — чёрный, 255 — белый.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayParts, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayMix, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayBlack, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const v = n === 3 ? [0, 0, 0] : n === 2 ? [255, 255, 0] : [255, 0, 0];
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askBlack : n === 2 ? c.askMix : n === 1 ? c.askParts : c.askStart;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r' + n, ruleParts('h1', 'color', rgbVal(v, n >= 1)), n >= 2 && live ? 'is-new is-read' : n >= 1 ? 'is-read' : '')])} cls="kz-code-sm" />
            <Mixer rgb={v} lit={!live ? null : n === 1 ? 'all' : n === 2 ? ['r', 'g'] : null} extremes={n === 3} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse('h1 { color: rgb(' + v.join(', ') + '); }')} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ ЖЁЛТЫЙ (Fill in the Blanks) — «body { background-color: rgb(▢, ▢, ▢); }»: 255, 255, 0. Фон
// красится тем, что вписано (браузер сам решает, верная ли запись).
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [vals, setVals] = useState(solved ? ['255', '255', '0'] : ['', '', '']);
  const T = useTypeTask('s6', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !vals[0], 0);
  const nums = vals.map((x) => x.trim());
  const css = 'body { background-color: rgb(' + nums.join(', ') + '); }';
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const n = nums.map(Number);
    const issue = nums.some((x) => !x) ? c.msgs.empty : nums.some((x) => !/^\d+$/.test(x) || Number(x) > 255) ? c.msgs.range
      : n[0] !== 255 ? c.msgs.red : n[1] !== 255 ? c.msgs.green : n[2] !== 0 ? c.msgs.blue : null;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's6', type: 'write-rgb', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const field = (i) => (T.okNow ? <span key={'v' + i} className={'c3-hx c3-hx-' + 'rgb'[i]}>{nums[i]}</span>
    : <span key={'f' + i} className={'kz-gap c3-slot c3-slot-num' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={i}><InlineInput value={vals[i]} onChange={(x) => { const nx = vals.slice(); nx[i] = x; setVals(nx); T.setMsg(null); }} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={3} /></span>);
  const val = [<span key="rg" className="c3-val c3-rgbv is-lit">rgb(</span>, field(0), P('c1', 'c3-val', ','), ' ', field(1), P('c2', 'c3-val', ','), ' ', field(2), P('c3', 'c3-val', ')')];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap(ruleBlock('r', 'body', 'background-color', val, T.okNow ? 'is-new' : 'is-hl'))} cls="kz-code-sm" />
            <Mixer rgb={cssOk('color', 'rgb(' + nums.join(', ') + ')') ? rgbOf('rgb(' + nums.join(', ') + ')') : null} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse(css)} /></Br></div>
        </div>
        {!T.okNow ? <CheckRow canTap={canTap} onCheck={check} ready={nums.every((x) => x)} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. КАКОЙ КОД? (выбор, по одному) — пятно цвета и три rgb-кода: жёлтый, чёрный, фиолетовый.
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
      log({ screenId: 's7', type: 'pick-rgb', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
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
      <Sheet cls="c3-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c3-card c3-swatch-card kz-a-drop"><span className="c3-swatch" style={{ background: it.want }} /></div>
            <div className="kz-pick c3-opts">
              {it.opts.map((v) => (
                <button key={v} type="button" disabled={!canTap || ok || off.indexOf(v) >= 0} onClick={() => choose(v)} data-v={v}
                  className={'kz-btn c3-tf c3-opt ' + (ok && v === it.want ? 'is-ok' : off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (ch.lad.lv >= 3 && !ok && v === it.want ? ' is-led' : '')}>
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
// S8. hsl (показ) — круг цветов: место 0 → 120 → 240; светлота 85% — светлее, 25% — темнее.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [hue, setHue] = useState(solved ? 240 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayHue, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); setHue(240); } }, { say: [{ text: c.sayLight, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayDark, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  useEffect(() => {
    if (n !== 1) return undefined;
    const ts = [setTimeout(() => setHue(120), 2600), setTimeout(() => setHue(240), 5200)];
    return () => ts.forEach(clearTimeout);
  }, [n]);
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const light = n === 3 ? 25 : n === 2 ? 85 : 50;
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askDark : n === 2 ? c.askLight : n === 1 ? c.askHue : c.askStart;
  const lit = !live ? null : n === 1 ? 'h' : n >= 2 ? 'l' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap(ruleBlock('r', 'h1', 'color', hslVal(hue, '100%', light + '%', lit), live && n >= 1 ? 'is-read' : ''))} cls="kz-code-sm" />
            <Wheel hue={hue} light={light} showLight={n >= 2} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse('h1 { color: hsl(' + hue + ', 100%, ' + light + '%); }')} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. МЕСТО НА КРУГЕ (Fill in the Blanks) — «h1 { color: hsl(▢, 100%, 40%); }»: 120 — зелёный.
// Метка на круге идёт за вписанным числом.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 4 });
  const T = useTypeTask('s9', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const w = T.okNow ? '120' : ty.val.trim();
  const hue = /^\d{1,3}$/.test(w) ? Number(w) : null;
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const v = ty.val.trim();
    const issue = !v ? c.msgs.empty : /%/.test(v) || !/^\d+$/.test(v) ? c.msgs.num : Number(v) === 120 ? null : c.msgs.other;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-hue', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const val = [<span key="o" className="c3-val c3-hslv">hsl(</span>,
    T.okNow ? <span key="v" className="c3-hs is-cur">120</span> : <span key="g" className={'kz-gap c3-slot c3-slot-num' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={4} /></span>,
    P('tl', 'c3-val', ', 100%, 40%)')];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap(ruleBlock('r', 'h1', 'color', val, T.okNow ? 'is-new' : 'is-hl'))} cls="kz-code-sm" />
            <Wheel hue={hue} light={40} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse('h1 { color: hsl(' + w + ', 100%, 40%); }')} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. СВЕТЛЫЙ ИЛИ ТЁМНЫЙ (Sort по одному) — hsl-код без пятна; после ответа пятно показывает цвет.
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
      log({ screenId: 's10', type: 'sort-light', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
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
      className={'kz-btn c3-tf c3-where ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      <i className={'c3-ld c3-ld-' + v} aria-hidden="true" />{pick(C.site[v])}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c3-card c3-tf-card c3-hslcard kz-a-drop">
              <span className="c3-card-h">{pick(c.card)}</span>
              <p className="c3-tf-t c3-code-t" translate="no">{it.code}</p>
              <span className={'c3-swatch c3-swatch-sm' + (ok ? ' is-on' : '')} style={{ background: ok ? it.code : 'transparent' }} />
            </div>
            <div className="kz-pick c3-tf-pick">{btn('light')}{btn('dark')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. КОГДА ЦВЕТ ЛОМАЕТСЯ (показ) — «FA4F28» без «#», «#FA4F2» (пять знаков), «hsl(11, 95, 57)» без «%»:
// каждый раз браузер выбрасывает цвет, заголовок остаётся чёрным (сравнение — «Не тот»).
// =============================================================================
const S11_RULES = ['#FA4F28', 'FA4F28', '#FA4F2', 'hsl(11, 95, 57)'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setN(1); } }, { say: [{ text: c.sayNoHash, pose: 'think' }] },
    { act: () => { sfx('soft', true); setN(2); } }, { say: [{ text: c.sayFive, pose: 'wonder' }] },
    { act: () => { sfx('soft', true); setN(3); } }, { say: [{ text: c.sayPct, pose: 'think' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const v = S11_RULES[n];
  const css = 'h1 { color: ' + v + '; }';
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askPct : n === 2 ? c.askFive : n === 1 ? c.askNoHash : c.askDone;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r' + n, ruleParts('h1', 'color', [P('v', 'c3-val' + (n && live ? ' c3-bad' : ''), v)]), n && live ? 'is-read' : '')])} cls="kz-code-sm" />
            <LogoMatch color={cssOk('color', v) ? v : ''} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={n ? 'c3-broken' : ''}><CssPage els={site(pick, { hl: n > 0 })} rules={cssParse(css)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ПОСТАВЬ ЗНАК (Debug & Fix) — «h1 { color: ▢FA4F28; }»: ученик пишет «#» (кнопки # и .).
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 3 });
  const T = useTypeTask('s12', solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || T.okNow, spoken);
  const led = useIdleLed(canTap && !T.okNow && !ty.val, 0);
  const sign = T.okNow ? '#' : ty.val.replace(/\s+/g, '');
  const check = () => {
    if (!canTap || T.okNow) return;
    T.st.current.tries += 1;
    const w = ty.val.replace(/\s+/g, '');
    const issue = w === '#' ? null : !w ? c.msgs.empty : w === '.' ? c.msgs.dot : c.msgs.other;
    if (!issue) {
      sfx('win', true); T.setMsg(null); T.setOkNow(true); put({ done: true });
      log({ screenId: 's12', type: 'fix-hash', correct: true, firstTry: T.st.current.misses === 0 && T.lad.asked.current === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    T.st.current.misses += 1;
    sfx('soft', true); T.setMsg(issue); sayNow(issue, 'think');
    if (T.st.current.misses >= 2) T.lad.bump();
  };
  const color = sign + 'FA4F28';
  const val = T.okNow ? hexVal('FA4F28', false) : [<span key="g" className={'kz-gap c3-slot c3-slot-sign' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={3} /></span>,
    P('v', 'c3-val', 'FA4F28')];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r', ruleParts('h1', 'color', val), T.okNow ? 'is-new' : 'is-hl')])} cls="kz-code-sm" />
            <LogoMatch color={cssOk('color', color) ? color : ''} />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={T.okNow ? '' : 'c3-broken'}><CssPage els={site(pick, { hl: !T.okNow })} rules={cssParse('h1 { color: ' + color + '; }')} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['#', '.']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. НАЙДИ ОШИБКУ (Error Detective) — три правила. Раунд 1: «#GG0000» (буква G) — заголовок чёрный;
// раунд 2: «hsl(30, 100, 88)» без «%» — фон белый. Ученик нажимает сломанную строку.
// =============================================================================
const S13_ROUNDS = [
  { kind: 'letter', bad: 0, rules: ['h1 { color: #GG0000; }', 'p { color: rgb(0, 128, 0); }', 'body { background-color: #FFE0B2; }'], fixed: 'h1 { color: #CC0000; }' },
  { kind: 'pct', bad: 2, rules: ['h1 { color: #7C3AED; }', 'p { color: rgb(0, 0, 255); }', 'body { background-color: hsl(30, 100, 88); }'], fixed: 'body { background-color: hsl(30, 100%, 88%); }' }
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
    cls: 'c3-cssline c3-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene c3-s5 c3-pair c3-q1" key={'q' + ri}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={found ? '' : 'c3-broken'}><CssPage els={site(pick, { noLogo: true })} rules={cssParse(rules.join(' '))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — «body { background-color: #FFE0B2; }». Браузер честно применяет написанное;
// проверка называет одну, самую полезную проблему.
// =============================================================================
const W1_BG = '#FFE0B2';
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
  if (prop !== 'background-color') return msgs.prop;
  if (/^[0-9a-f]{6}$/i.test(val)) return msgs.noHash;
  if (!cssOk(prop, val)) return msgs.notColor;
  if (colorKey(val) !== colorKey(W1_BG)) return msgs.other;
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
  const css = T.okNow ? 'body { background-color: ' + W1_BG + '; }' : ty.val;
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
      <Sheet cls="c3-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col"><KzCode lines={styleWrap([T.okNow ? cssL('r', 1, css, { cls: 'is-new' }) : ruleLine('r', [<span key="g" className={'kz-gap c3-slot c3-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={48} /></span>], 'is-hl')])} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse(css)} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['#', '{', '}', ':', ';']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. СВОИ ЦВЕТА (Live Code Preview, «Готово») — цвет заголовка и фона любым способом: имя, hex, rgb, hsl.
// Браузер красит сразу; «Готово» — когда оба цвета настоящие и разные.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const store = useStore();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [a, setA] = useState(store.get('myColor') || '');
  const [b, setB] = useState(store.get('myBg') || '');
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
    const bad = !cssOk('color', va) ? va : !cssOk('color', vb) ? vb : null;
    const issue = bad ? fillL(c.msgs.notColor, { w: bad }) : colorKey(va) === colorKey(vb) ? c.msgs.same : null;
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    store.set('myColor', va); store.set('myBg', vb); put({ done: true });
    log({ screenId: 's14', type: 'own-colors', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, color: va, bg: vb });
    sayNow(c.ok, 'cheer');
  };
  const css = 'h1 { color: ' + va + '; } body { background-color: ' + vb + '; }';
  const field = (val, set, k) => (
    <span key={k} className={'kz-gap c3-slot c3-slot-col' + (led && k === 'fa' ? ' kz-gap-led' : '')} data-f={k}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={24} /></span>
  );
  const els = [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.hello), k: 'p1' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet kz-typed c3-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={els} rules={cssParse(css)} /></Br>
            <KzCode lines={styleWrap([
              ruleLine('r1', ruleParts('h1', 'color', [solved ? P('v', 'c3-val', va) : field(a, setA, 'fa')]), solved ? 'is-new' : 'is-hl')
            ].concat(ruleBlock('r2', 'body', 'background-color', [solved ? P('v', 'c3-val', vb) : field(b, setB, 'fb')], solved ? 'is-new' : 'is-hl')))} cls="kz-code-sm" />
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
      className={'kz-btn c3-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = {
    hex: [cssL('c', 0, 'h1 { color: #FF0000; }')],
    rgb: [cssL('c', 0, 'h1 { color: rgb(255, 255, 0); }')],
    hsl: [cssL('c1', 0, 'h1 { color: hsl(210, 100%, 25%); }'), cssL('c2', 0, 'h1 { color: hsl(210, 100%, 85%); }')]
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c3-card c3-tf-card kz-a-drop">
              <span className="c3-card-h">{pick(c.card)}</span>
              <p className="c3-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c3-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: «FA4F28» без «#» — цвет не узнан, заголовок не тот; своя страница ученика в своих
// цветах; роли hex / rgb / hsl загораются, пока Коди их называет.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const mc = store.get('myColor') || '#7C3AED', mb = store.get('myBg') || 'hsl(260, 100%, 95%)';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const rows = riddle ? ['h1 { color: FA4F28; }'] : ['h1 { color: ' + mc + '; }', 'body { background-color: ' + mb + '; }'];
  const els = riddle ? site(pick, { hl: true, short: true }) : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.hello), k: 'p1' }];
  const ex = { hex: '#FA4F28', rgb: 'rgb(250, 79, 40)', hsl: 'hsl(11, 95%, 57%)' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c3-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={els} rules={cssParse(rows.join(' '))} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls="kz-code-sm" />
            <div className="kz-roles">
              {['hex', 'rgb', 'hsl'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'hex') ? ' is-on' : '')} style={{ '--c': k === 'hex' ? '#FA4F28' : k === 'rgb' ? '#7C5CFA' : '#0FA38E' }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}{curK === k ? <code className="c3-role-ex" translate="no">{ex[k]}</code> : null}
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
// «Повторить» стирает только экран; свои цвета ученика (myColor, myBg) остаются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], w1: ['w1'], s14: ['s14'], q1: ['q1'] };

// Артефакт урока — своя страница ученика в своих цветах.
function lessonCss3Artifact(store) {
  const mc = store.get('myColor'), mb = store.get('myBg');
  if (!mc && !mb) return null;
  return { type: 'html-page', color: mc || '', background: mb || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening saytim</title>', '    <style>',
      '      h1 { color: ' + escHtml(mc || '') + '; }', '      body { background-color: ' + escHtml(mb || '') + '; }', '    </style>', '  </head>', '  <body>',
      '    <h1>Mening saytim</h1>', '    <p>Salom! Bu mening saytim.</p>', '  </body>', '</html>'].join('\n') };
}

export default function CssCveta({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss3Artifact(store) })
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
