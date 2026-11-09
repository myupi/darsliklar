// =============================================================================
// ЭКРАНЫ УРОКА 2 КУРСА CSS «Как выбрать элемент для стилизации» (облик «Редактор», 05.11.2026).
// Основа кода — урок 1 курса CSS (tools/css1/). Типы заданий — по разделу 3а навыка:
// s3 вписать имя класса — s4 какие абзацы покрасит; s6 собрать селектор — s7 найти пару; s9 поставить точку —
// s10 найти сломанное правило; s11 свой класс; q1 верно или нет. Экрана плана нет.
// Честный браузер: селекторы тег, .class, #id сопоставляются по-настоящему (имя класса — с учётом регистра),
// сила — id > class > тег, при равенстве — последнее правило; значения проверяет Chrome (CSS.supports).
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
const sp = () => <span className="c2-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Строка CSS в редакторе: селектор (знак . или # отдельно), скобки, свойство, двоеточие, значение. lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c2-raw">{s}</span>];
  const selT = s.slice(0, b).trim();
  const mk = /^([.#])(.*)$/.exec(selT);
  if (mk) out.push(<span key="m" className={'c2-mark c2-part' + cls('mark') + cls('sel')}>{mk[1]}</span>, <span key="s" className={'c2-sel c2-part' + cls('name') + cls('sel')}>{mk[2]}</span>);
  else out.push(<span key="s" className={'c2-sel c2-part' + cls('name') + cls('sel')}>{selT}</span>);
  out.push(' ', <span key="b1" className="c2-punc">{'{'}</span>, ' ');
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':') { out.push(<span key={'p' + n} className="c2-punc">:</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className="c2-punc">;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className="c2-prop">{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className="c2-val">{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className="c2-punc">{'}'}</span>);
  return spaced(out);
}
// Строка HTML: <тег class="…">текст</тег> (или id). lit — горит атрибут.
function elParts(el, lit) {
  const attr = el.cls != null && el.cls !== '' ? ['class', el.cls] : el.id != null && el.id !== '' ? ['id', el.id] : null;
  const open = <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">{el.t}</span>{attr ? <span className={'c2-att c2-part' + (lit ? ' is-cur' : '')}>{' '}<span className="c2-attr">{attr[0]}</span><span className="kz-tk-b">=</span><span className="c2-aval">{'"' + attr[1] + '"'}</span></span> : null}<span className="kz-tk-b">{'>'}</span></span>;
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
    <div ref={ref} className="c2-doc" style={body}>
      {els.map((el, i) => {
        const c = 'c2-blk c2-' + el.t + (el.hl ? ' is-hl' : '') + (mark && mark.indexOf(i) >= 0 ? ' is-mark' : '') + (off && off.indexOf(i) >= 0 ? ' is-off' : '') + (tap ? ' is-tap' : '');
        return (
          <div key={el.k || i} className={c} style={el.t === 'raw' ? {} : styleFor(R, el)} data-i={i}
            onClick={tap ? () => tap(i) : undefined}>{el.text}{led === i ? <Led on /> : null}</div>
        );
      })}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c2-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c2-cssline' }, extra || {}));
const elL = (k, d, el, extra, lit) => codeLine(k, elParts(el, lit), Object.assign({ d }, extra || {}));
// Два куска кода: style с правилами и body с элементами.
function bothLines(css, els, opts) {
  const o = opts || {};
  const out = [tagL('so', 0, 'style', false, { cls: 'c2-edge' })];
  css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 1, cls: 'c2-cssline ' + (r.cls || '') }) : cssL(r.k, 1, r.text, { cls: r.cls || '' }, r.lit)));
  out.push(tagL('sc', 0, 'style', true, { cls: 'c2-edge' }), tagL('bo', 0, 'body', false, { cls: 'c2-edge' }));
  els.forEach((el, i) => out.push(el.parts ? codeLine('e' + i, el.parts, { d: 1, cls: el.lcls || '' }) : elL('e' + i, 1, el, { cls: el.lcls || '' }, el.lit)));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c2-edge' }));
  return o.only ? out.slice(o.only[0], o.only[1]) : out;
}
const TagChip = ({ t, cls, on }) => <span className={'c2-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
// Страница новостей Коди: h1 и три абзаца.
const news = (pick, opt) => {
  const o = opt || {};
  return [
    { t: 'h1', text: pick(C.site.title), k: 'h', id: o.hId, cls: o.hCls, hl: o.hl === 'h' },
    { t: 'p', text: pick(C.site.chess), k: 'p1', cls: o.p1, hl: o.hl === 'p1' },
    { t: 'p', text: pick(C.site.football), k: 'p2', cls: o.p2, hl: o.hl === 'p2' },
    { t: 'p', text: pick(C.site.photos), k: 'p3', cls: o.p3, hl: o.hl === 'p3' }
  ];
};

// =============================================================================
// S1. КРЮЧОК — страница новостей: Коди хочет красным только важный абзац. «Покрасить» — правило p: красные все.
// Загадка: Коди дал абзацу class="muhim", а в CSS написал «muhim { … }» без точки.
// =============================================================================
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
    sayNow(c.magic, 'embarrassed'); say(c.magicP, 'think'); say(c.done, 'smile');
  };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c2-edge' }), cssL('r', 1, 'p { color: red; }', { cls: on ? 'is-read' : 'is-hl' }), tagL('sc', 0, 'style', true, { cls: 'c2-edge' })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={news(pick, { hl: on ? null : 'p2' })} rules={on ? cssParse('p { color: red; }') : []} /></Br></div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. АТРИБУТ class (показ) — в HTML важному абзацу добавляется class="muhim"; в CSS «p» → «.muhim»: красный
// только он. Горят атрибут в HTML, потом точка с именем в CSS.
// =============================================================================
// Помощь на экране-объяснении (заказчик, 09.11.2026): ступени 1-2-3 по лампочке (useKzLadder) — 1 на что смотреть,
// 2 что это значит, 3 пример из жизни. now — открытая ступень с номером «2/3» для панели, next — текст следующей
// ступени без номера: его читает вслух лампочка.
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);   // 0 — p; 1 — class в HTML; 2 — .muhim в CSS
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayHtml, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayCss, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const els = news(pick, { p2: n >= 1 ? 'muhim' : undefined }).slice(1);
  const rule = n >= 2 ? '.muhim { color: red; }' : 'p { color: red; }';
  const lines = bothLines([{ k: 'r', text: rule, cls: n === 2 && live ? 'is-new is-read' : n === 2 ? 'is-new' : '', lit: n === 2 && live ? 'sel' : null }],
    els.map((el, i) => Object.assign({}, el, { lcls: i === 1 && n >= 1 ? (n === 1 && live ? 'is-new is-read' : 'is-new') : '', lit: i === 1 && n === 1 && live })));
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askCss : n === 1 ? c.askHtml : c.askStart;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={news(pick, { p2: n >= 1 ? 'muhim' : undefined, hl: n === 2 && live ? 'p2' : null })} rules={cssParse(rule)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ ИМЯ КЛАССА (Fill in the Blanks) — «.… { color: green; }»: у третьего абзаца class="yangi".
// Браузер красит то, что выбрал класс (muhim — второй абзац, неизвестное имя — ничего).
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 14 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const name = okNow ? 'yangi' : ty.val.trim();
  const els = news(pick, { p2: 'muhim', p3: 'yangi' });
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const w = ty.val.trim();
    const issue = cyrIn(ty.val) || (!w ? c.msgs.empty : /^[.#]/.test(w) ? c.msgs.dot : w === 'yangi' ? null : w === 'muhim' ? c.msgs.other : c.msgs.none);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-class', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const css = '.' + name + ' { color: green; }';
  const ruleParts = okNow ? null : [<span key="m" className="c2-mark">.</span>,
    <span key="g" className={'kz-gap c2-slot c2-slot-sel' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={14} /></span>,
    ' ', <span key="b" className="c2-punc">{'{'}</span>, ' ', <span key="p" className="c2-prop">color</span>, <span key="c" className="c2-punc">:</span>, ' ', <span key="v" className="c2-val">green</span>, <span key="sc" className="c2-punc">;</span>, ' ', <span key="b2" className="c2-punc">{'}'}</span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={bothLines([okNow ? { k: 'r', text: '.yangi { color: green; }', cls: 'is-new' } : { k: 'r', parts: ruleParts, cls: 'is-hl' }],
            els.slice(1).map((el, i) => Object.assign({}, el, { lit: i === 2 && lad.lv >= 3 })))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(css)} /></Br></div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. КАКИЕ ПОКРАСИТ (Visual Code Mapping) — правило «.sport { color: blue; }» и четыре абзаца с разными
// классами. Ученик нажимает абзацы, которые станут синими (два); найдены оба — правило срабатывает.
// =============================================================================
const S4_ELS = [{ cls: 'sport', key: 'run' }, { cls: 'maktab', key: 'school' }, { cls: 'sport', key: 'football' }, { cls: '', key: 'photos' }];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? [0, 2] : []);
  const [off, setOff] = useState([]);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 2;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const ch = useChoiceHints(!done, got.length);
  const hints = [c.hint1, c.hint2, c.hint3];
  const led = useIdleLed(canTap && !done, got.length * 10 + off.length);
  const els = S4_ELS.map((e, i) => ({ t: 'p', text: pick(C.site[e.key]), cls: e.cls, k: 'q' + i }));
  const tap = (i) => {
    if (!canTap || done || got.indexOf(i) >= 0 || off.indexOf(i) >= 0) return;
    st.current.tries += 1;
    if (S4_ELS[i].cls !== 'sport') {
      st.current.misses += 1; sfx('soft', true); setOff(off.concat(i));
      sayNow(ch.miss(S4_ELS[i].cls ? c.why.maktab : c.why.none, hints), 'think');
      return;
    }
    sfx('ok', true); ch.clear();
    const nx = got.concat(i);
    setGot(nx);
    if (nx.length === 2) {
      put({ done: true });
      log({ screenId: 's4', type: 'map-class', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.got, 'smile');
  };
  const lit = ch.lad.lv >= 3 ? [0, 2].find((i) => got.indexOf(i) < 0) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet c2-k2 c2-tapsheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : ch.now(hints)} err={ch.err} n={done ? null : got.length + '/2'} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={bothLines([{ k: 'r', text: '.sport { color: blue; }', cls: done ? 'is-new' : 'is-hl' }], els.map((el) => Object.assign({}, el)))} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls="c2-maptap"><CssPage els={els} rules={done ? cssParse('.sport { color: blue; }') : []} tap={done || !canTap ? null : tap} mark={got} off={off} led={lit != null ? lit : null} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. АТРИБУТ id (показ) — заголовку добавляется id="bosh"; правило «#bosh { color: purple; }»: фиолетовый
// только заголовок. Класс — форма команды, id — номер паспорта.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayHtml, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayCss, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const els = news(pick, { hId: n >= 1 ? 'bosh' : undefined, p2: 'muhim', hl: n === 2 && live ? 'h' : null }).slice(0, 3);
  const css = [{ k: 'r0', text: '.muhim { color: red; }', cls: 'c2-dim' }].concat(n >= 2 ? [{ k: 'r', text: '#bosh { color: purple; }', cls: live ? 'is-new is-read' : 'is-new', lit: live ? 'sel' : null }] : []);
  const lines = bothLines(css, els.map((el, i) => Object.assign({}, el, { lcls: i === 0 && n >= 1 ? (n === 1 && live ? 'is-new is-read' : 'is-new') : '', lit: i === 0 && n === 1 && live })));
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askCss : n === 1 ? c.askHtml : c.askStart;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(css.map((r) => r.text).join(' '))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ СЕЛЕКТОР (Code Builder) — у заголовка id="logo"; в правиле два места: знак и имя. В лотке «.», «#»,
// «logo», «h2». Верно — «#» и «logo»: заголовок оранжевый.
// =============================================================================
const S6_TRAY = ['dot', 'logo', 'hash', 'tag'];
const S6_WANT = ['hash', 'logo'];
const S6_TXT = { dot: '.', hash: '#', logo: 'logo', tag: 'h2' };
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
  const done = got.length === 2;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const want = S6_WANT[got.length];
    if (id !== want) {
      st.current.misses += 1;
      const m = id === 'dot' ? c.why.dot : id === 'tag' ? c.why.tag : c.why.nameFirst;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 2) {
      put({ done: true });
      log({ screenId: 's6', type: 'build-id-selector', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const slot = (i) => (got[i] ? <span key={'s' + i} className={'c2-built c2-a-in ' + (got[i] === 'hash' ? 'c2-mark' : 'c2-sel')}>{S6_TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm c2-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  const els = [{ t: 'h1', text: pick(C.site.title), id: 'logo', k: 'h', hl: !done }, { t: 'p', text: pick(C.site.chess), k: 'p1' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/2'} />
        <div className={'kz-scene c2-s5 c2-pair c2-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col"><KzCode lines={bothLines([{ k: 'r', parts: [slot(0), slot(1), ' ', <span key="b" className="c2-punc">{'{'}</span>, ' ', <span key="p" className="c2-prop">color</span>, <span key="c" className="c2-punc">:</span>, ' ', <span key="v" className="c2-val">orange</span>, <span key="sc" className="c2-punc">;</span>, ' ', <span key="b2" className="c2-punc">{'}'}</span>], cls: done ? 'is-new' : 'is-hl' }], els)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={done ? cssParse('#logo { color: orange; }') : []} /></Br></div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code c2-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === S6_WANT[got.length] ? ' is-led' : '')}
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
// S7. НАЙДИ ПАРУ (Matching Pairs) — p, .muhim, #logo ↔ что выбирают.
// =============================================================================
const S7_TAGS = ['tag', 'cls', 'id'];
const S7_CARDS = ['id', 'tag', 'cls'];
const S7_TXT = { tag: 'p', cls: '.muhim', id: '#logo' };
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [paired, setPaired] = useState(solved ? S7_TAGS.slice() : []);
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
  const nextT = S7_TAGS.find((t) => paired.indexOf(t) < 0);
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
      log({ screenId: 's7', type: 'match-selectors', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene c2-match">
          <div className="c2-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code c2-mtag c2-mtag-' + t + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{S7_TXT[t]}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="c2-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'c2-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="c2-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="c2-mcard-tag" translate="no">{S7_TXT[k]}</span> : null}
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
// K1. CLASS ИЛИ ID (показ) — три новости sport и единственный заголовок: «.sport» красит все три синим,
// «#logo» — только заголовок оранжевым. Много одинаковых — class, одна вещь — id.
// =============================================================================
const kEls = (pick, hl) => [
  { t: 'h1', text: pick(C.site.title), id: 'logo', k: 'h', hl: hl === 'id' },
  { t: 'p', text: pick(C.site.run), cls: 'sport', k: 'p1', hl: hl === 'cls' },
  { t: 'p', text: pick(C.site.football), cls: 'sport', k: 'p2', hl: hl === 'cls' },
  { t: 'p', text: pick(C.site.photos), k: 'p3' },
  { t: 'p', text: pick(C.site.chess), cls: 'sport', k: 'p4', hl: hl === 'cls' }
];
function K1({ p }) {
  const pick = usePick();
  const c = C.k1;
  const [rec, put] = useRec('k1');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayCls, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayId, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const css = [{ k: 'r1', text: '.sport { color: blue; }', cls: n === 1 && live ? 'is-new is-read' : n >= 1 ? 'is-new' : '' }]
    .concat(n >= 2 ? [{ k: 'r2', text: '#logo { color: orange; }', cls: live ? 'is-new is-read' : 'is-new' }] : []);
  const hl = !live ? null : n === 1 ? 'cls' : n === 2 ? 'id' : null;
  const els = kEls(pick, hl);
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askId : n === 1 ? c.askCls : c.askStart;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={bothLines(n ? css : [{ k: 'r0', text: '', parts: [<span key="e" className="c2-raw"> </span>] }], els)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(css.slice(0, n).map((r) => r.text).join(' '))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// K2. СЕЛЕКТОР ЦЕЛИКОМ (Fill in the Blanks) — «… { color: green; }»: ученик пишет «.sport» сам, со знаком.
// Браузер честно красит выбранное: «sport» без точки — ничего, «p» — все абзацы, «#sport» — ничего.
// =============================================================================
function K2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.k2;
  const [rec, put] = useRec('k2');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 14 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const sel = okNow ? '.sport' : ty.val.trim();
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const w = ty.val.trim();
    const issue = cyrIn(ty.val) || (!w ? c.msgs.empty : /^[.#]\s/.test(w) ? c.msgs.space : w === '.sport' ? null : w === 'sport' ? c.msgs.noDot : w === '#sport' ? c.msgs.hash : w.toLowerCase() === 'p' ? c.msgs.tag : c.msgs.other);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 'k2', type: 'write-selector', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const css = (sel || 'x-none') + ' { color: green; }';
  const ruleParts = okNow ? null : [<span key="g" className={'kz-gap c2-slot c2-slot-sel' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={14} /></span>,
    ' ', <span key="b" className="c2-punc">{'{'}</span>, ' ', <span key="p" className="c2-prop">color</span>, <span key="c" className="c2-punc">:</span>, ' ', <span key="v" className="c2-val">green</span>, <span key="sc" className="c2-punc">;</span>, ' ', <span key="b2" className="c2-punc">{'}'}</span>];
  // Короче, чем в показе: заголовок, две новости sport и одна другая — чтобы ряд кнопок не наезжал на код.
  const els = kEls(pick, okNow ? null : 'cls').slice(0, 4);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet c2-k2">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={bothLines([okNow ? { k: 'r', text: '.sport { color: green; }', cls: 'is-new' } : { k: 'r', parts: ruleParts, cls: 'is-hl' }], els)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(css)} /></Br></div>
        </div>
        {!okNow ? <KeyRow keys={['.', '#']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// K3. CLASS ИЛИ ID (сортировка по одному) — вещь на странице: много одинаковых — class, одна — id.
// =============================================================================
function K3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.k3;
  const [rec, put] = useRec('k3');
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
  const hints = choiceHints(c.hint1, c.hint2, it.why, c[it.right]);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) { st.current.misses += 1; sfx('soft', true); setOff(v); sayNow(ch.miss(it.why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'k3', type: 'sort-class-id', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
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
      className={'kz-btn c2-tf c2-where ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      <span translate="no">{pick(c[v])}</span><Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c2-card c2-tf-card kz-a-drop">
              <span className="c2-card-h">{pick(c.card)}</span>
              <p className="c2-tf-t">{pick(it.t)}</p>
            </div>
            <div className="kz-pick c2-tf-pick">{btn('cls')}{btn('id')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ЧТО ЛОМАЕТ ВЫБОР (показ) — опечатка в имени («.muhum»), «#» вместо точки для класса, точка в HTML
// (class=".muhim"): важный абзац каждый раз не красится.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setN(1); } }, { say: [{ text: c.sayTypo, pose: 'think' }] },
    { act: () => { sfx('soft', true); setN(2); } }, { say: [{ text: c.sayHash, pose: 'wonder' }] },
    { act: () => { sfx('soft', true); setN(3); } }, { say: [{ text: c.sayDotHtml, pose: 'think' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const live = !solved && !demo.done;
  const rule = n === 1 ? '.muhum { color: red; }' : n === 2 ? '#muhim { color: red; }' : '.muhim { color: red; }';
  const cls = n === 3 ? '.muhim' : 'muhim';
  const els = news(pick, { p2: cls, hl: n ? 'p2' : null }).slice(1);
  const lines = bothLines([{ k: 'r', text: rule, cls: n && n < 3 ? 'is-read' : '', lit: n === 1 ? 'name' : n === 2 ? 'mark' : null }],
    els.map((el, i) => Object.assign({}, el, { lcls: i === 1 && n === 3 ? 'is-read' : '', lit: i === 1 && n === 3 })));
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askDotHtml : n === 2 ? c.askHash : n === 1 ? c.askTypo : c.askDone;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(rule)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ПОСТАВЬ ТОЧКУ (Debug & Fix) — «muhim { color: red; }»: перед именем пустое место; ученик пишет «.»
// (кнопки . и #). Без точки браузер ищет тег muhim и ничего не красит.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 3 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const sign = okNow ? '.' : ty.val.replace(/\s+/g, '');
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const w = ty.val.replace(/\s+/g, '');
    const issue = cyrIn(ty.val) || (w === '.' ? null : !w ? c.msgs.empty : w === '#' ? c.msgs.hash : c.msgs.other);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'fix-dot', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const css = sign + 'muhim { color: red; }';
  const ruleParts = okNow ? null : [<span key="g" className={'kz-gap c2-slot c2-slot-sign' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={3} /></span>,
    <span key="s" className="c2-sel">muhim</span>, ' ', <span key="b" className="c2-punc">{'{'}</span>, ' ', <span key="p" className="c2-prop">color</span>, <span key="c" className="c2-punc">:</span>, ' ', <span key="v" className="c2-val">red</span>, <span key="sc" className="c2-punc">;</span>, ' ', <span key="b2" className="c2-punc">{'}'}</span>];
  const els = news(pick, { p2: 'muhim', hl: okNow ? null : 'p2' }).slice(1);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={bothLines([okNow ? { k: 'r', text: '.muhim { color: red; }', cls: 'is-new' } : { k: 'r', parts: ruleParts, cls: 'is-hl' }], els)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={okNow ? '' : 'c2-broken'}><CssPage els={els} rules={cssParse(css)} /></Br></div>
        </div>
        {!okNow ? <KeyRow keys={['.', '#']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. НАЙДИ СЛОМАННОЕ ПРАВИЛО (Error Detective) — три правила и HTML. Раунд 1: «.Sport» при class="sport"
// (регистр); раунд 2: «#logo» при class="logo» (не тот знак). Ученик нажимает сломанную строку.
// =============================================================================
const S10_ROUNDS = [
  { kind: 'case', bad: 1, rules: ['#bosh { color: purple; }', '.Sport { color: blue; }', 'body { background-color: lightyellow; }'], fixed: '.sport { color: blue; }',
    els: (pick) => [{ t: 'h1', text: pick(C.site.title), id: 'bosh', k: 'h' }, { t: 'p', text: pick(C.site.run), cls: 'sport', k: 'p1' }, { t: 'p', text: pick(C.site.football), cls: 'sport', k: 'p2' }] },
  { kind: 'sign', bad: 0, rules: ['#logo { color: orange; }', '.muhim { color: red; }', 'p { background-color: lavender; }'], fixed: '.logo { color: orange; }',
    els: (pick) => [{ t: 'h1', text: pick(C.site.title), cls: 'logo', k: 'h' }, { t: 'p', text: pick(C.site.football), cls: 'muhim', k: 'p1' }, { t: 'p', text: pick(C.site.photos), k: 'p2' }] }
];
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? S10_ROUNDS.length - 1 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === S10_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const R = S10_ROUNDS[ri];
  const ch = useChoiceHints(!found, ri);
  const hints = [c.hint1, c.hint2[R.kind], c.hint3[R.kind]];
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (j !== R.bad) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(j)); sayNow(ch.miss(c.fine, hints), 'think'); return; }
    sfx('win', true); setFound(true); ch.clear();
    if (ri === S10_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 's10', type: 'find-error', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.found[R.kind], c.ok), 'cheer');
    } else { sayNow(c.found[R.kind], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); sayNow(c.say2, 'curious'); }, reduceMotion() ? 300 : 1200);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const rules = R.rules.map((r, j) => (found && j === R.bad ? R.fixed : r));
  const els = R.els(pick);
  const lit = ch.lad.lv >= 3;
  const lines = rules.map((r, j) => ({
    k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: cssTokens(r),
    cls: 'c2-cssline c2-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
    led: !found && ((led && off.length === 0) || (lit && j === R.bad))
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S10_ROUNDS.length} />
        <div className="kz-scene c2-s5 c2-pair c2-q1" key={'q' + ri}>
          <div className="kz-col">
            <KzCode lines={lines} cls="kz-code-sm" />
            <KzCode lines={els.map((el, i) => elL('e' + i, 0, el))} cls="kz-code-sm c2-html" />
          </div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls={found ? '' : 'c2-broken'}><CssPage els={els} rules={cssParse(rules.join(' '))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — у заголовка id="bosh"; ученик сам пишет «#bosh { color: purple; }». Браузер
// честно применяет написанное; проверка называет одну, самую полезную проблему.
// =============================================================================
function ruleIssue(t, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return inner.indexOf('=') >= 0 ? msgs.eq : msgs.colon;
  const sel = m[1].trim();
  if (sel === '.bosh') return msgs.dot;
  if (sel === 'bosh') return msgs.noSign;
  if (sel.toLowerCase() === 'h1') return msgs.tag;
  if (sel !== '#bosh') return msgs.sel;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim().toLowerCase();
  if (prop !== 'color') return msgs.prop;
  if (!cssOk(prop, val)) return msgs.notColor;
  if (val !== 'purple') return msgs.other;
  return null;
}
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 40 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const css = okNow ? '#bosh { color: purple; }' : ty.val;
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = cyrIn(ty.val) || (ruleIssue(ty.val, c.msgs));
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 'w1', type: 'write-rule', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const els = [{ t: 'h1', text: pick(C.site.title), id: 'bosh', k: 'h', hl: !okNow }, { t: 'p', text: pick(C.site.chess), k: 'p1' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene c2-s5 c2-pair">
          <div className="kz-col"><KzCode lines={bothLines([okNow ? { k: 'r', text: '#bosh { color: purple; }', cls: 'is-new' } : { k: 'r', parts: [<span key="g" className={'kz-gap c2-slot c2-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={40} /></span>], cls: 'is-hl' }], els)} cls="kz-code-sm" />{!okNow && lad.lv >= 3 ? <HelpCode code={'#bosh { color: purple; }'} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={els} rules={cssParse(css)} /></Br></div>
        </div>
        {!okNow ? <KeyRow keys={['#', '{', '}', ':', ';']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 4} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. СВОЙ КЛАСС (Live Code Preview, «Готово») — своё имя класса в HTML (class="…") и в CSS (после точки);
// совпали — абзац розовый. Имя: латинские буквы, цифры, дефис, не с цифры.
// =============================================================================
const CLS_RE = /^-?[A-Za-z_][\w-]*$/;
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const store = useStore();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [a, setA] = useState(store.get('myClass') || '');
  const [b, setB] = useState(store.get('myClass') || '');
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
    const issue = cyrIn(va, vb) || (/^\./.test(va) ? c.msgs.dot : !CLS_RE.test(va) || !CLS_RE.test(vb) ? c.msgs.bad : va !== vb ? fillL(c.msgs.mismatch, { a: va, b: vb }) : null);
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    store.set('myClass', va); put({ done: true });
    log({ screenId: 's11', type: 'own-class', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, name: va });
    sayNow(c.ok, 'cheer');
  };
  const css = '.' + vb + ' { color: deeppink; }';
  const field = (val, set, k) => (
    <span key={k} className={'kz-gap c2-slot c2-slot-sel' + (led && k === 'fa' ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={14} /></span>
  );
  const rule = [<span key="m" className="c2-mark">.</span>, solved ? <span key="v" className="c2-sel">{vb}</span> : field(b, setB, 'fb'), ' ', <span key="b" className="c2-punc">{'{'}</span>, ' ', <span key="p" className="c2-prop">color</span>, <span key="c" className="c2-punc">:</span>, ' ', <span key="v2" className="c2-val">deeppink</span>, <span key="sc" className="c2-punc">;</span>, ' ', <span key="b2" className="c2-punc">{'}'}</span>];
  const htmlP = [<span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">p</span>{' '}<span className="c2-attr">class</span><span className="kz-tk-b">=</span><span className="c2-aval">"</span></span>,
    solved ? <span key="v" className="c2-aval">{va}</span> : field(a, setA, 'fa'), <span key="c" className="kz-tag"><span className="c2-aval">"</span><span className="kz-tk-b">{'>'}</span></span>, W_(pick(C.site.mine)), T_('p', true)];
  const els = [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.mine), cls: va, k: 'm' }, { t: 'p', text: pick(C.site.chess), k: 'p' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet kz-typed c2-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage els={els} rules={cssParse(css)} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c2-edge' }), codeLine('r', rule, { d: 1, cls: 'c2-cssline ' + (solved ? 'is-new' : 'is-hl') }), tagL('sc', 0, 'style', true, { cls: 'c2-edge' }),
              codeLine('e', htmlP, { d: 0, cls: solved ? 'is-new' : 'is-hl' })]} cls="kz-code-sm" />
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
      className={'kz-btn c2-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = {
    id: [cssL('c', 0, '#logo { color: orange; }')],
    cls: [elL('h', 0, { t: 'p', cls: 'muhim', text: '…' }), cssL('c', 0, '.muhim { color: red; }')]
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c2-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c2-card c2-tf-card kz-a-drop">
              <span className="c2-card-h">{pick(c.card)}</span>
              <p className="c2-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c2-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ВЫВОД — разгадка: «muhim { … }» без точки — браузер ищет тег muhim, абзац не красится; свой абзац ученика
// со своим классом; роли тег / .class / #id загораются, пока Коди их называет.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const store = useStore();
  const mc = store.get('myClass') || 'mening';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const css = riddle ? 'muhim { color: red; }' : '.' + mc + ' { color: deeppink; }';
  const els = riddle ? news(pick, { p2: 'muhim', hl: 'p2' }).slice(1)
    : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.mine), cls: mc, k: 'm', hl: curK === 'cls' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c2-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={els} rules={cssParse(css)} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={[cssL('r1', 0, css, { cls: riddle ? 'is-read' : '' }, riddle ? 'sel' : curK === 'cls' ? 'sel' : null)]} cls="kz-code-sm" />
            <div className="kz-roles">
              {['tag', 'cls', 'id'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'cls') ? ' is-on' : '')} style={{ '--c': k === 'tag' ? '#FA4F28' : k === 'cls' ? '#7C5CFA' : '#0FA38E' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 'k1', code: 'SHOW', Comp: K1 }, { id: 'k2', code: 'LEVEL-K', Comp: K2 }, { id: 'k3', code: 'CHECK-K', Comp: K3 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 'w1', code: 'LEVEL-W', Comp: W1 },
  { id: 's11', code: 'LEVEL-4', Comp: S11 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 's12', code: 'ACHIEVEMENT', Comp: S12 }
];
// «Повторить» стирает только экран; свой класс ученика (myClass) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  k1: ['k1'], k2: ['k2'], k3: ['k3'], s10: ['s10'], w1: ['w1'], s11: ['s11'], q1: ['q1'] };

// Артефакт урока — своя страница ученика: абзац со своим классом.
function lessonCss2Artifact(store) {
  const mc = store.get('myClass');
  if (!mc) return null;
  return { type: 'html-page', className: mc,
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening saytim</title>', '    <style>',
      '      .' + escHtml(mc) + ' { color: deeppink; }', '    </style>', '  </head>', '  <body>',
      '    <h1>Mening saytim</h1>', '    <p class="' + escHtml(mc) + '">Bu mening abzasim.</p>', '  </body>', '</html>'].join('\n') };
}

export default function CssSelektory({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss2Artifact(store) })
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
