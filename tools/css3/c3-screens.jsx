// =============================================================================
// ЭКРАНЫ УРОКА 3 КУРСА CSS «Цвета» (облик «Редактор», 05.11.2026; упрощён 09.11.2026: названия, hex из палитры, rgb).
// Основа кода — урок 2 курса CSS (tools/css2/). Общие экраны: ShowScreen (показ с помощью 1-2-3 по лампочке),
// FillScreen (впиши значение), RoundsScreen (выбор по одному). Экрана плана нет.
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
// ОБЩИЕ ЭКРАНЫ (09.11.2026, урок упрощён по просьбе заказчика): показ с помощью 1-2-3, «впиши значение», выбор по одному.
// =============================================================================
// Помощь на экране-объяснении: ступени 1-2-3 по лампочке (useKzLadder) — 1 на что смотреть, 2 что это значит,
// 3 пример из жизни. now — открытая ступень с номером «2/3» для панели, next — текст следующей ступени без номера:
// его читает вслух лампочка.
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
// Экран-показ: шаги по очереди; view(n) — { css, val, extra } для шага n: строка CSS, значение для правила и что
// показать под кодом (полосы лучей, палитра). says — реплики после каждого шага.
function ShowScreen({ p, c, id, n0, view, says, asks, pose, els }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const last = says.length;
  const [n, setN] = useState(solved ? last : (n0 || 0));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: pose || 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(...says.map((t, i) => [{ act: () => { sfx(i ? 'ok' : 'pop', true); setN(i + 1); } }, { say: [{ text: t, pose: i % 2 ? 'wonder' : 'point' }] }]),
    [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const v = view(n);
  const askText = solved || demo.done ? asks.done : asks.list[n];
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r' + n, v.parts || ruleParts(v.sel || 'h1', v.prop || 'color', [P('v', 'c3-val', v.val)]), 'is-new is-read')])} cls="kz-code-sm" />
            {v.extra || null}
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els || site(pick, { noLogo: true, short: true })} rules={cssParse(v.css)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}
const ruleTxt = (sel, prop, v) => sel + ' { ' + prop + ': ' + v + '; }';
const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const Slot = ({ ty, led, onEnter, label, cls, max, onChange }) => (
  <span key="g" className={'kz-gap c3-slot ' + (cls || 'c3-slot-col') + (led ? ' kz-gap-led' : '')}>
    <InlineInput value={ty.val} onChange={onChange || ((x) => ty.setVal(x))} inputRef={ty.inputRef} onEnter={onEnter} placeholder={L3('…', '…', '…')} label={label} max={max || 24} />
  </span>
);
// Задание «впиши значение»: одно поле, проверка issueOf(v) → msg | null.
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
// Экран «впиши значение»: «h1 { color: [pre] ▢ [post]; }», страница честно (пустое поле — правила нет); extra — что под
// кодом (палитра, полосы лучей); keys — кнопки знаков.
function FillScreen({ p, c, F, want, pre, post, extra, keys, sel }) {
  const pick = usePick();
  const v = F.T.okNow ? want : noSemi(F.ty.val);
  const full = (pre || '') + v + (post || '');
  const css = v ? ruleTxt(sel || 'h1', 'color', full) : '';
  const slot = F.T.okNow ? P('v', 'c3-val', want) : <Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />;
  const val = [].concat(pre ? [P('pre', 'c3-val', pre)] : [], [slot], post ? [P('post', 'c3-val', post)] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c3-sheet c3-fill">
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col">
            <KzCode lines={styleWrap([ruleLine('r', ruleParts(sel || 'h1', 'color', val), F.T.okNow ? 'is-new' : 'is-hl')])} cls="kz-code-sm" />{!F.T.okNow && F.T.lad.lv >= 3 ? <HelpCode code={want} /> : null}
            {extra || null}
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true, short: true, hl: !F.T.okNow })} rules={cssParse(css)} /></Br></div>
        </div>
        {!F.T.okNow ? <KeyRow keys={keys || []} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Выбор по одному (раунды): список, ключ ответа, объяснение, что сказать ответом.
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
  const hints = choiceHints(c.hint1, c.hint2, whyOf(it), ansOf(it));
  const choose = (v) => {
    if (!canTap || ok || off.indexOf(v) >= 0) return;
    st.current.tries += 1;
    if (v !== keyOf(it)) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(v)); sayNow(ch.miss(whyOf(it), hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, whyOf(it));
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
// Кнопки выбора для useRounds: v — значения, label(v) — подпись.
function RoundsScreen({ p, c, R, n, card, opts, label, cls, mono }) {
  const pick = usePick();
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="c3-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + n} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + R.ii}>
          <div className="kz-col">
            {card}
            <div className={'kz-pick c3-opts ' + (cls || '')}>
              {opts.map((v) => (
                <button key={v} type="button" disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)} data-v={v}
                  className={'kz-btn c3-tf c3-opt' + (mono ? ' is-mono' : '') + ' ' + (R.ok && v === R.it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost')}>
                  <span translate="no">{label ? pick(label(v)) : v}</span><Led on={R.led && !R.ok && R.off.length === 0} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Палитра, как в программе для рисования: квадратики цвета, под каждым — его код. lit — горит код.
const PAL = ['#FA4F28', '#1E90FF', '#2ECC71', '#8E44AD'];
const Palette = ({ lit }) => (
  <div className="c3-pal" aria-hidden="true">
    {PAL.map((h) => (
      <span key={h} className={'c3-pal-i' + (lit === h ? ' is-on' : '')}><i style={{ background: h }} /><b translate="no">{h}</b></span>
    ))}
  </div>
);
// Большое пятно цвета (задания на выбор).
const Swatch = ({ color }) => <div className="c3-card c3-swatch-card kz-a-drop"><span className="c3-swatch" style={{ background: color }} /></div>;
const CodeCard = ({ code }) => <KzCode lines={[cssL('c', 0, code, { cls: 'is-hl' })]} cls="kz-code-sm c3-big" />;

// =============================================================================
// S2. НАЗВАНИЯ ЦВЕТОВ (показ) — red → blue → lightblue (светлый) → darkblue (тёмный).
// =============================================================================
const S2_V = ['red', 'blue', 'lightblue', 'darkblue'];
function S2({ p }) {
  const c = C.s2;
  return <ShowScreen p={p} c={c} id="s2" view={(n) => ({ val: S2_V[n], css: ruleTxt('h1', 'color', S2_V[n]) })}
    says={[c.sayBlue, c.sayLight, c.sayDark]} asks={{ list: [c.askStart, c.askBlue, c.askLight, c.askDark], done: c.askDone }} />;
}
// S3. ЗЕЛЁНЫЙ ЗАГОЛОВОК — «h1 { color: ▢; }» → green.
function S3({ p }) {
  const c = C.s3;
  const Fl = useFill('s3', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    if (!cssOk('color', v)) return c.msgs.notColor;
    return colorKey(v) === colorKey('green') ? null : c.msgs.other;
  });
  return <FillScreen p={p} c={c} F={Fl} want="green" />;
}
// S4. КАКОЕ НАЗВАНИЕ? (выбор по одному) — пятно цвета → его название.
function S4({ p }) {
  const c = C.s4;
  const R = useRounds('s4', c, c.rounds, (it) => it.right, (it) => it.why, (it) => it.right);
  return <RoundsScreen p={p} c={c} R={R} n={c.rounds.length} card={<Swatch color={R.it.right} />} opts={R.it.opts} mono />;
}

// S5. КОД ИЗ ПАЛИТРЫ (показ) — названий мало; точный оттенок — код из палитры: «#» и шесть знаков.
// orange (не тот оттенок) → #FA4F28 (как логотип) → #1E90FF → из чего код.
const S5_V = ['orange', '#FA4F28', '#1E90FF', '#1E90FF'];
function S5({ p }) {
  const c = C.s5;
  return <ShowScreen p={p} c={c} id="s5" els={null}
    view={(n) => ({ val: S5_V[n], css: ruleTxt('h1', 'color', S5_V[n]), extra: <>{n <= 1 ? <LogoMatch color={S5_V[n]} /> : null}<Palette lit={n >= 1 ? S5_V[n] : null} />{n === 3 ? <div className="c3-hexparts c3-a-in" translate="no"><b>#</b><span>1E90FF</span></div> : null}</> })}
    says={[c.sayLogo, c.sayBlue, c.sayParts]} asks={{ list: [c.askStart, c.askLogo, c.askBlue, c.askParts], done: c.askDone }} />;
}
// S6. ЦВЕТ ИЗ ПАЛИТРЫ — фиолетовый: «h1 { color: ▢; }» → #8E44AD (код под квадратиком).
function S6({ p }) {
  const c = C.s6;
  const Fl = useFill('s6', c, (w) => {
    const v = w.replace(/\s+/g, '');
    if (!v) return c.msgs.empty;
    if (/^[0-9a-f]{6}$/i.test(v)) return c.msgs.noHash;
    if (!cssOk('color', v)) return /^#/.test(v) ? c.msgs.badHex : c.msgs.notColor;
    if (colorKey(v) === colorKey('#8E44AD')) return null;
    return /^#[0-9a-f]{6}$/i.test(v) ? c.msgs.near : c.msgs.other;
  });
  return <FillScreen p={p} c={c} F={Fl} want="#8E44AD" extra={<Palette />} keys={['#']} />;
}
// S7. ВЕРНЫЙ КОД? (Sort по одному) — запись hex: верная или сломана.
function S7({ p }) {
  const c = C.s7;
  const R = useRounds('s7', c, c.items, (it) => it.right, (it) => it.why, (it) => c.opts[it.right]);
  return <RoundsScreen p={p} c={c} R={R} n={c.items.length} card={<CodeCard code={'h1 { color: ' + R.it.code + '; }'} />} opts={['ok', 'bad']} label={(v) => c.opts[v]} />;
}

// S8. rgb (показ) — сколько красного, зелёного и синего света: 255 — много, 0 — нет. Красный → синий → жёлтый
// (красный + зелёный) → чёрный (всё 0) и белый (всё 255).
const S8_V = [[255, 0, 0], [0, 0, 255], [255, 255, 0], [0, 0, 0]];
function S8({ p }) {
  const c = C.s8;
  return <ShowScreen p={p} c={c} id="s8"
    view={(n) => ({ parts: ruleParts('h1', 'color', rgbVal(S8_V[n])), css: ruleTxt('h1', 'color', 'rgb(' + S8_V[n].join(', ') + ')'), extra: <Mixer rgb={S8_V[n]} lit="all" extremes={n === 3} /> })}
    says={[c.sayBlue, c.sayYellow, c.sayBlack]} asks={{ list: [c.askStart, c.askBlue, c.askYellow, c.askBlack], done: c.askDone }} />;
}
// S9. ЯРКО-ЗЕЛЁНЫЙ — «h1 { color: rgb(0, ▢, 0); }» → 255. Полосы лучей идут за числом.
function S9({ p }) {
  const c = C.s9;
  const Fl = useFill('s9', c, (w) => {
    const v = w.replace(/\s+/g, '');
    if (!v) return c.msgs.empty;
    if (!/^\d+$/.test(v)) return c.msgs.notNum;
    const n = parseInt(v, 10);
    if (n > 255) return c.msgs.big;
    return n === 255 ? null : c.msgs.small;
  });
  const g = Math.max(0, Math.min(255, parseInt(Fl.T.okNow ? '255' : Fl.ty.val, 10) || 0));
  return <FillScreen p={p} c={c} F={Fl} want="255" pre="rgb(0, " post=", 0)" extra={<Mixer rgb={[0, g, 0]} lit="g" />} />;
}
// S10. КАКОЙ ЦВЕТ? (выбор по одному) — rgb-код → название цвета.
function S10({ p }) {
  const c = C.s10;
  const R = useRounds('s10', c, c.items, (it) => it.right, (it) => it.why, (it) => it.right);
  return <RoundsScreen p={p} c={c} R={R} n={c.items.length} card={<CodeCard code={'h1 { color: ' + R.it.code + '; }'} />} opts={['red', 'blue', 'black', 'white']} mono
    label={(v) => ({ uz: v + ' · ' + C.site.names.uz[v], ru: v + ' · ' + C.site.names.ru[v], en: v })} />;
}

// S11. КОГДА ЦВЕТ ЛОМАЕТСЯ (показ) — «FA4F28» без «#», «#FA4F2» (пять знаков), «gren» (опечатка): каждый раз «Не тот».
const S11_V = ['#FA4F28', 'FA4F28', '#FA4F2', 'gren'];
function S11({ p }) {
  const c = C.s11;
  const pick = usePick();
  return <ShowScreen p={p} c={c} id="s11" pose="curious" els={site(pick, { hl: false, short: true })}
    view={(n) => ({ val: S11_V[n], css: ruleTxt('h1', 'color', S11_V[n]), extra: <LogoMatch color={S11_V[n]} /> })}
    says={[c.sayHash, c.sayFive, c.sayTypo]} asks={{ list: [c.askStart, c.askHash, c.askFive, c.askTypo], done: c.askDone }} />;
}
// S12. ИСПРАВЬ (Debug & Fix) — в поле «FA4F28» без «#»: цвет логотипа не совпал. Ученик ставит «#» (кнопка #).
function S12({ p }) {
  const c = C.s12;
  const Fl = useFill('s12', c, (w) => {
    const v = w.replace(/\s+/g, '');
    if (!v) return c.msgs.empty;
    if (/^[0-9a-f]{6}$/i.test(v)) return c.msgs.noHash;
    if (!cssOk('color', v)) return c.msgs.bad;
    return colorKey(v) === colorKey(LOGO) ? null : c.msgs.other;
  }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !Fl.T.okNow && !Fl.ty.val) { set0.current = true; Fl.ty.setVal('FA4F28');
    // Курсор — в начало: решётку ставят перед кодом, кнопка «#» вставляет знак туда, где курсор (09.11.2026).
    requestAnimationFrame(() => { const el = Fl.ty.inputRef && Fl.ty.inputRef.current; if (el && el.setSelectionRange) { try { el.setSelectionRange(0, 0); } catch (e) { /* поле без выделения */ } } }); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = Fl.T.okNow ? LOGO : Fl.ty.val.trim();
  return <FillScreen p={p} c={c} F={Fl} want={LOGO} extra={<LogoMatch color={shown} />} keys={['#']} />;
}
// =============================================================================
// S13. НАЙДИ ОШИБКУ (Error Detective) — три правила. Раунд 1: «gren» (опечатка в названии) — абзац не зелёный;
// раунд 2: «#1E90F» (пять знаков) — заголовок не синий. Ученик нажимает сломанную строку.
// =============================================================================
const S13_ROUNDS = [
  { kind: 'typo', bad: 1, rules: ['h1 { color: #FA4F28; }', 'p { color: gren; }', 'body { background-color: lightyellow; }'], fixed: 'p { color: green; }' },
  { kind: 'five', bad: 0, rules: ['h1 { color: #1E90F; }', 'p { color: rgb(255, 0, 0); }', 'body { background-color: lavender; }'], fixed: 'h1 { color: #1E90FF; }' }
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
    led: !found && ((led && off.length === 0) || (lit && j === R.bad))
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
// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — «p { color: rgb(0, 0, 255); }»: абзац синий через rgb. Браузер честно применяет
// написанное; проверка называет одну, самую полезную проблему.
// =============================================================================
const W1_CSS = 'p { color: rgb(0, 0, 255); }';
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return msgs.colon;
  if (m[1].trim().toLowerCase() !== 'p') return msgs.sel;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim();
  if (prop !== 'color') return msgs.prop;
  if (!/^rgb\s*\(/i.test(val)) return cssOk('color', val) && colorKey(val) === colorKey('blue') ? msgs.notRgb : msgs.rgbNeed;
  if (!cssOk(prop, val)) return msgs.notColor;
  if (colorKey(val) !== colorKey('blue')) return msgs.other;
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
  const css = T.okNow ? W1_CSS : ty.val;
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
      <Sheet cls="c3-sheet">
        <KzAsk text={T.okNow ? c.ok : c.ask} hint={T.okNow ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene c3-s5 c3-pair">
          <div className="kz-col"><KzCode lines={styleWrap([T.okNow ? cssL('r', 1, css, { cls: 'is-new' }) : ruleLine('r', [<span key="g" className={'kz-gap c3-slot c3-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); T.setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={48} /></span>], 'is-hl')])} cls="kz-code-sm" />{!T.okNow && T.lad.lv >= 3 ? <HelpCode code={W1_CSS} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, { noLogo: true })} rules={cssParse(css)} /></Br></div>
        </div>
        {!T.okNow ? <KeyRow keys={['{', '}', ':', ';', '(', ')', ',']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
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
    const issue = cyrIn(va, vb) || (bad ? fillL(c.msgs.notColor, { w: bad }) : colorKey(va) === colorKey(vb) ? c.msgs.same : null);
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
    rgb: [cssL('c', 0, 'h1 { color: rgb(0, 0, 0); }')],
    yel: [cssL('c', 0, 'h1 { color: rgb(255, 255, 0); }')]
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
// S15. ВЫВОД — разгадка: «#fa4f28» маленькими буквами — тот же цвет, «Совпадает!»; своя страница ученика в своих
// цветах; роли: название, hex, rgb (и hsl — только упомянут), загораются, пока Коди их называет.
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
  const rows = riddle ? ['h1 { color: #fa4f28; }'] : ['h1 { color: ' + mc + '; }', 'body { background-color: ' + mb + '; }'];
  const els = riddle ? site(pick, { hl: true, short: true }) : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.hello), k: 'p1' }];
  const ex = { name: 'orange', hex: '#FA4F28', rgb: 'rgb(250, 79, 40)', hsl: 'hsl(…)' };
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
            {riddle ? <LogoMatch color="#fa4f28" /> : null}
            <div className="kz-roles">
              {['name', 'hex', 'rgb', 'hsl'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'hex') ? ' is-on' : '') + (k === 'hsl' ? ' is-dim' : '')} style={{ '--c': k === 'name' ? '#0FA38E' : k === 'hex' ? '#FA4F28' : k === 'rgb' ? '#7C5CFA' : '#94A3B8' }}>
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
