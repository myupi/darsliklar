// =============================================================================
// ЭКРАНЫ УРОКА 1 КУРСА CSS «Что такое CSS и как он меняет сайт» (облик «Редактор», 05.11.2026).
// Основа кода — урок 4 курса HTML (tools/havola4/). Типы заданий — по разделу 3а навыка:
// s3 вписать — s4 HTML или CSS; s6 собрать правило — s7 найти пару; s9 вписать селектор — s10 правило ↔ место;
// s12 исправить знак — s13 найти сломанное правило; s14 своя страница; q1 верно или нет. Экрана плана нет.
// Честный браузер: CSS разбирается по-настоящему, значение принимает или отбрасывает сам Chrome
// (CSS.supports); «=» вместо «:», пропущенная «;», опечатка в свойстве — правило не действует; CSS без тега
// style — текст на странице. Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// ── CSS ДВИЖОК УРОКА ───────────────────────────────────────────────────────
// Свойства, которые урок умеет показать (остальные честно не нужны в уроке 1).
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
// Разбор таблицы стилей: «селектор { свойство: значение; … }». Объявление без «:», с неизвестным свойством или
// неверным значением пропускается — как в браузере.
function cssParse(text) {
  const rules = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(String(text || '')))) {
    const sel = m[1].trim().toLowerCase();
    const decls = [];
    m[2].split(';').forEach((d) => {
      const i = d.indexOf(':');
      if (i < 0) return;
      const p = d.slice(0, i).trim().toLowerCase(), v = d.slice(i + 1).trim();
      if (cssOk(p, v)) decls.push({ p, v });
    });
    rules.push({ sel, decls });
  }
  return rules;
}
const camel = (p) => p.replace(/-([a-z])/g, (a, b) => b.toUpperCase());
const styleFor = (rules, tag) => {
  const st = {};
  rules.forEach((r) => { if (r.sel === tag) r.decls.forEach((d) => { st[camel(d.p)] = d.v; }); });
  return st;
};
// Пробел в строке редактора: строка — flex, голый пробел между кусками схлопывается; пробел — свой кусок.
const sp = () => <span className="c1-sp">{' '}</span>;
const spaced = (parts) => (parts || []).map((x) => (x === ' ' ? sp() : x));
// Раскраска строки CSS в редакторе: селектор, скобки, свойство, знак, значение, «;». lit — горящая часть.
function cssTokens(text, lit) {
  const out = [];
  const s = String(text);
  const b = s.indexOf('{');
  const cls = (k) => (lit && (lit === k || (Array.isArray(lit) && lit.indexOf(k) >= 0)) ? ' is-cur' : '');
  if (b < 0) return [<span key="t" className="c1-raw">{s}</span>];
  const res = () => spaced(out);
  out.push(<span key="s" className={'c1-sel c1-part' + cls('sel')}>{s.slice(0, b).trim()}</span>, ' ');
  out.push(<span key="b1" className={'c1-punc c1-part' + cls('brace')}>{'{'}</span>);
  const e = s.lastIndexOf('}');
  const inner = s.slice(b + 1, e < 0 ? s.length : e).trim();
  out.push(' ');
  let mode = 'prop', n = 0;
  inner.split(/(\s+|:|;|=)/).forEach((tok) => {
    if (!tok) return;
    n += 1;
    if (/^\s+$/.test(tok)) { out.push(' '); return; }
    if (tok === ':' || tok === '=') { out.push(<span key={'p' + n} className={'c1-punc c1-part' + (tok === '=' ? ' c1-bad' : '') + cls('val')}>{tok}</span>); mode = 'val'; return; }
    if (tok === ';') { out.push(<span key={'p' + n} className={'c1-punc c1-part' + cls('semi')}>;</span>); mode = 'prop'; return; }
    if (mode === 'prop') { out.push(<span key={'w' + n} className={'c1-prop c1-part' + cls('prop')}>{tok}</span>); mode = 'val'; return; }
    out.push(<span key={'w' + n} className={'c1-val c1-part' + cls('val')}>{tok}</span>);
  });
  if (e >= 0) out.push(' ', <span key="b2" className={'c1-punc c1-part' + cls('brace')}>{'}'}</span>);
  return res();
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
// Страница в браузере: блоки { t: 'h1' | 'p' | 'raw', text, k, hl } и стили из rules (body — фон и цвет всей
// страницы, наследуется детьми, как в браузере). tap(kind) — экран «правило ↔ место» (h1, p, body).
function CssPage({ blocks, rules, tap, led }) {
  const R = rules || [];
  const ref = useFitPage(JSON.stringify([blocks.map((b) => [b.t, b.k, b.text, b.hl]), R]));
  const body = styleFor(R, 'body');
  // Фон body в браузере — на всё окно страницы: красим и корпус страницы окна (как настоящий viewport).
  const bg = body.backgroundColor || '';
  useLayoutEffect(() => {
    const el = ref.current && ref.current.closest('.kz-br-body');
    if (el) el.style.backgroundColor = bg;
  }, [bg]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className={'c1-doc' + (tap ? ' is-tap' : '')} style={body} onClick={tap ? () => tap('body') : undefined} data-k="body">
      {blocks.map((bk, i) => {
        const st = bk.t === 'raw' ? {} : styleFor(R, bk.t);
        const c = 'c1-blk c1-' + bk.t + (bk.hl ? ' is-hl' : '');
        return (
          <div key={bk.k || i} className={c} style={st} data-k={bk.t}
            onClick={tap ? (e) => { e.stopPropagation(); tap(bk.t); } : undefined}>{bk.text}{led === bk.t ? <Led on /> : null}</div>
        );
      })}
      {led === 'body' ? <Led on /> : null}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'c1-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts: spaced(parts) }, extra || {});
const tagL = (k, d, t, close, extra) => codeLine(k, [T_(t, close)], Object.assign({ d }, extra || {}));
const textL = (k, d, t, w, extra) => codeLine(k, [T_(t), W_(w), T_(t, true)], Object.assign({ d }, extra || {}));
const cssL = (k, d, text, extra, lit) => codeLine(k, cssTokens(text, lit), Object.assign({ d, cls: 'c1-cssline' }, extra || {}));
// Документ целиком: head со style (строки CSS), body со страницей. css: [{ k, text, cls, lit, parts }].
function docLines(css, bodyLines, opts) {
  const o = opts || {};
  const out = [tagL('ho', 0, 'head', false, { cls: 'c1-edge' })];
  if (o.style !== false) {
    out.push(tagL('so', 1, 'style', false, { cls: o.styleCls || '' }));
    css.forEach((r) => out.push(r.parts ? codeLine(r.k, r.parts, { d: 2, cls: 'c1-cssline ' + (r.cls || '') }) : cssL(r.k, 2, r.text, { cls: 'c1-cssline ' + (r.cls || '') }, r.lit)));
    out.push(tagL('sc', 1, 'style', true, { cls: o.styleCls || '' }));
  }
  out.push(tagL('hc', 0, 'head', true, { cls: 'c1-edge' }), tagL('bo', 0, 'body', false, { cls: 'c1-edge' }));
  bodyLines.forEach((l) => out.push(l));
  out.push(tagL('bc', 0, 'body', true, { cls: 'c1-edge' }));
  return out;
}
// Содержимое сайта Коди: заголовок и два абзаца (HTML не меняется на всех экранах).
const siteBlocks = (pick, hl) => [{ t: 'h1', text: pick(C.site.title), k: 'h', hl: hl === 'h1' }, { t: 'p', text: pick(C.site.hello), k: 'p1', hl: hl === 'p' }, { t: 'p', text: pick(C.site.hobby), k: 'p2', hl: hl === 'p' }];
const siteBody = (pick) => [textL('h1', 1, 'h1', pick(C.site.title)), textL('p1', 1, 'p', pick(C.site.hello)), textL('p2', 1, 'p', pick(C.site.hobby))];
// Панель цветов: образец и английское имя (то, что пишут в CSS), подпись на языке урока.
const Palette = ({ names, hl, title }) => {
  const pick = usePick();
  const nm = pick(C.site.names);
  return (
    <div className="c1-files c1-palette" aria-label={pick(title || C.site.colorsH)}>
      <span className="c1-files-h">{pick(title || C.site.colorsH)}</span>
      {names.map((n) => <span key={n} className={'c1-file c1-sw' + (hl === n ? ' is-hl' : '')} translate="no" title={nm[n]}><i aria-hidden="true" style={{ background: n }} />{n}</span>)}
    </div>
  );
};
const TagChip = ({ t, cls, on }) => <span className={'c1-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;

// =============================================================================
// S1. КРЮЧОК — сайт Коди чёрно-белый. «Превратить»: фон, заголовок и текст получают цвета — HTML тот же.
// Загадка: Коди написал «h1 { color = orange; }», как атрибут в HTML.
// =============================================================================
const HOOK_CSS = 'body { background-color: lightyellow; } h1 { color: orange; } p { color: green; }';
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
    sfx('ok', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile');
  };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene c1-s1">
          <div className="kz-stagebox c1-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={on} /></div></div>
          <div className="kz-col c1-s1-page">
            <Br title={pick(C.site.title)} cls={on ? 'c1-pop' : ''}><CssPage blocks={siteBlocks(pick)} rules={on ? cssParse(HOOK_CSS) : []} /></Br>
          </div>
        </div>
        {!on ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ГДЕ ЖИВЁТ CSS (показ) — документ: head и body. В head появляются style и /style (пусто — ничего не
// меняется), потом правило «h1 { color: orange; }» — заголовок оранжевый, строки HTML те же.
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
  const [n, setN] = useState(solved ? 2 : 0);   // 0 — нет style; 1 — пустой style; 2 — правило
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayStyle, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayRule, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const rule = 'h1 { color: orange; }';
  const lines = docLines(n === 2 ? [{ k: 'r', text: rule, cls: 'is-new is-read' }] : [], siteBody(pick), { style: n >= 1, styleCls: n === 1 ? 'is-new is-read' : n === 2 ? 'is-new' : '' });
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askRule : n === 1 ? c.askStyle : c.askStart;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c1-s5 c1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick, n === 2 && !demo.done && !solved ? 'h1' : null)} rules={n === 2 ? cssParse(rule) : []} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ ЦВЕТ (Fill in the Blanks) — «h1 { color: …; }»: ученик пишет blue; браузер меняется сразу
// (любой цвет, который знает браузер, честно красит заголовок; засчитан только синий).
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 16 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const v = okNow ? 'blue' : ty.val.trim().replace(/;+$/, '');
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const w = normT(ty.val).replace(/;+$/, '');
    const issue = cyrIn(ty.val) || (!w ? c.msgs.empty : !cssOk('color', w) ? c.msgs.notColor : w !== 'blue' ? c.msgs.other : null);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-value', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const css = 'h1 { color: ' + v + '; }';
  const ruleParts = okNow ? null : [<span key="s" className="c1-sel">h1</span>, ' ', <span key="b" className="c1-punc">{'{'}</span>, ' ', <span key="p" className="c1-prop">color</span>, <span key="c" className="c1-punc">:</span>, ' ',
    <span key="g" className={'kz-gap c1-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={16} /></span>,
    <span key="sc" className="c1-punc">;</span>, ' ', <span key="b2" className="c1-punc">{'}'}</span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick, okNow ? null : 'h1')} rules={cssParse(css)} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' }),
              okNow ? cssL('r', 1, css, { cls: 'is-new' }) : codeLine('r', ruleParts, { d: 1, cls: 'c1-cssline is-hl' }),
              tagL('sc', 0, 'style', true, { cls: 'c1-edge' })]} cls="kz-code-sm" />
            <Palette names={['red', 'green', 'blue', 'purple']} hl={lad.lv >= 3 ? 'blue' : null} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. HTML ИЛИ CSS (сортировка по одному) — «до» и «после»: изменился текст или новый абзац — HTML; цвет текста
// или фон — CSS. Промах — причина, можно выбрать снова; ступени подсказки — как во всех заданиях на выбор.
// =============================================================================
function s4View(pick, k, after) {
  const base = siteBlocks(pick).slice(0, 2);
  if (k === 'text') return { blocks: [{ t: 'h1', text: after ? pick(C.site.games) : pick(C.site.title), k: 'h' }, base[1]], css: '' };
  if (k === 'color') return { blocks: base, css: after ? 'h1 { color: green; }' : '' };
  if (k === 'para') return { blocks: after ? base.concat([{ t: 'p', text: pick(C.site.news), k: 'n' }]) : base, css: '' };
  return { blocks: base, css: after ? 'body { background-color: lightblue; }' : '' };
}
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
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
      log({ screenId: 's4', type: 'sort-html-css', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); }, reduceMotion() ? 300 : 1200);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = (after) => { const v = s4View(pick, it.k, after); return <CssPage blocks={v.blocks} rules={cssParse(v.css)} />; };
  const btn = (v) => (
    <button key={v} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)} data-v={v}
      className={'kz-btn c1-tf c1-where ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(c[v])}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col" key={'i' + ii}>
          <div className="kz-col">
            <div className="c1-ba kz-a-drop">
              <div className="c1-card"><span className="c1-card-h">{pick(c.before)}</span><div className="c1-mini">{view(false)}</div></div>
              <span className="c1-ba-arrow" aria-hidden="true" />
              <div className="c1-card is-after"><span className="c1-card-h">{pick(c.after)}</span><div className="c1-mini">{view(true)}</div></div>
            </div>
            <div className="kz-pick c1-tf-pick">{btn('html')}{btn('css')}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ИЗ ЧЕГО ПРАВИЛО (показ) — «p { color: green; }» крупно; под речь Коди загораются: селектор, фигурные
// скобки, свойство, двоеточие со значением, точка с запятой; подписи под строкой.
// =============================================================================
const S5_PARTS = ['sel', 'brace', 'prop', 'val', 'semi'];
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? 5 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const steps = [];
  const sayK = { sel: c.sayTag, brace: c.sayBrace, prop: c.sayProp, val: c.sayVal, semi: c.saySemi };
  S5_PARTS.forEach((k, i) => { steps.push({ act: () => { sfx('tap', true); setOn(i + 1); } }, { say: [{ text: sayK[k], pose: 'point' }] }); });
  steps.push({ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) });
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cur = solved || demo.done ? null : S5_PARTS[on - 1];
  const cls = (k) => 'c1-part c1-part-' + k + (S5_PARTS.indexOf(k) < on ? ' is-on' : '') + (cur === k ? ' is-cur' : '');
  const askText = solved || demo.done ? c.askDone : cur ? c.asks[cur] : c.askStart;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c1-anat">
          <div className="c1-anat-code" translate="no">
            <span className={cls('sel')}><b className="c1-sel">p</b></span>{' '}
            <span className={cls('brace')}><i>{'{'}</i></span>{' '}
            <span className={cls('prop')}><b className="c1-prop">color</b></span><span className={cls('val')}><i>:</i> <b className="c1-val">green</b></span><span className={cls('semi')}><i>;</i></span>{' '}
            <span className={cls('brace')}><i>{'}'}</i></span>
          </div>
          <div className="c1-anat-labels">
            {S5_PARTS.map((k, i) => (i < on ? <TagChip key={k} t={pick(c.labels[k])} cls={'c1-anat-lbl c1-a-in c1-lbl-' + k} on={cur === k} /> : null))}
          </div>
          <div className="c1-anat-br"><Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick)} rules={on >= 4 ? cssParse('p { color: green; }') : []} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ ПРАВИЛО (Code Builder) — «p { … }»: в скобках четыре места; в лотке вперемешку color, :, green, ;.
// Нажать кусок (или перетащить) — он встаёт на следующее место. Собрано — абзацы зелёные.
// =============================================================================
const S6_TRAY = ['val', 'semi', 'prop', 'colon'];
const S6_WANT = ['prop', 'colon', 'val', 'semi'];
const S6_TXT = { prop: 'color', colon: ':', val: 'green', semi: ';' };
const S6_CLS = { prop: 'c1-prop', colon: 'c1-punc', val: 'c1-val', semi: 'c1-punc' };
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
  const done = got.length === 4;
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
      const m = c.why[want];
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 4) {
      put({ done: true });
      log({ screenId: 's6', type: 'build-rule', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const slot = (i) => (got[i] ? <span key={'s' + i} className={'c1-built c1-a-in ' + S6_CLS[got[i]]}>{S6_TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm c1-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/4'} />
        <div className={'kz-scene kz-scene-col c1-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick, done ? 'p' : null)} rules={done ? cssParse('p { color: green; }') : []} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' }),
              codeLine('r', [<span key="s" className="c1-sel">p</span>, ' ', <span key="b" className="c1-punc">{'{'}</span>, ' ', slot(0), slot(1), ' ', slot(2), slot(3), ' ', <span key="b2" className="c1-punc">{'}'}</span>], { d: 1, cls: 'c1-cssline ' + (done ? 'is-new' : 'is-hl'), place: 'code' }),
              tagL('sc', 0, 'style', true, { cls: 'c1-edge' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code c1-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === S6_WANT[got.length] ? ' is-led' : '')}
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
// S7. НАЙДИ ПАРУ (Matching Pairs) — p, color, green ↔ селектор, свойство, значение.
// =============================================================================
const S7_TAGS = ['sel', 'prop', 'val'];
const S7_CARDS = ['val', 'sel', 'prop'];
const S7_TXT = { sel: 'p', prop: 'color', val: 'green' };
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
      log({ screenId: 's7', type: 'match-parts', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="c1-match-rule" translate="no"><span className="c1-sel">p</span> <span className="c1-punc">{'{'}</span> <span className="c1-prop">color</span><span className="c1-punc">:</span> <span className="c1-val">green</span><span className="c1-punc">;</span> <span className="c1-punc">{'}'}</span></div>
        <div className="kz-scene c1-match">
          <div className="c1-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code c1-mtag c1-mtag-' + t + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{S7_TXT[t]}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="c1-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'c1-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="c1-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="c1-mcard-tag" translate="no">{S7_TXT[k]}</span> : null}
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
// S8. ЧТО КРАСИТ ПРАВИЛО (показ) — «h1 { color: orange; }» красит только заголовок; селектор → p: заголовок снова
// чёрный, абзацы оранжевые; второе правило «body { background-color: lightblue; }» — фон всей страницы.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setN(1); } }, { say: [{ text: c.sayP, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } }, { say: [{ text: c.sayBody, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const r1 = (n === 0 ? 'h1' : 'p') + ' { color: orange; }';
  const r2 = 'body { background-color: lightblue; }';
  const css = [{ k: 'r1', text: r1, cls: n === 1 && !demo.done && !solved ? 'is-new is-read' : '', lit: n === 1 && !demo.done ? 'sel' : null }]
    .concat(n >= 2 ? [{ k: 'r2', text: r2, cls: !demo.done && !solved ? 'is-new is-read' : 'is-new' }] : []);
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askBody : n === 1 ? c.askP : c.askStart;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c1-s5 c1-pair">
          <div className="kz-col"><KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' })].concat(css.map((r) => cssL(r.k, 1, r.text, { cls: r.cls }, r.lit)), [tagL('sc', 0, 'style', true, { cls: 'c1-edge' })])} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick)} rules={cssParse(r1 + (n >= 2 ? ' ' + r2 : ''))} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ВПИШИ СЕЛЕКТОР (Fill in the Blanks) — «… { color: purple; }»: ученик пишет p; браузер честно красит то,
// что выбрал селектор (h1 — заголовок, body — весь текст, неизвестный тег — ничего).
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 10 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const sel = okNow ? 'p' : normT(ty.val);
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const w = normT(ty.val);
    const issue = cyrIn(ty.val) || (!w ? c.msgs.empty : /[<>/]/.test(w) ? c.msgs.brackets : w === 'p' ? null : w === 'h1' ? c.msgs.h1 : w === 'body' ? c.msgs.body : c.msgs.other);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-selector', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const css = (sel && !/[<>/{}]/.test(sel) ? sel : 'x-none') + ' { color: purple; }';
  const ruleParts = okNow ? null : [<span key="g" className={'kz-gap c1-slot c1-slot-sel' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={10} /></span>,
    ' ', <span key="b" className="c1-punc">{'{'}</span>, ' ', <span key="p" className="c1-prop">color</span>, <span key="c" className="c1-punc">:</span>, ' ', <span key="v" className="c1-val">purple</span>, <span key="sc" className="c1-punc">;</span>, ' ', <span key="b2" className="c1-punc">{'}'}</span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick, okNow ? null : 'p')} rules={cssParse(css)} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' }),
              okNow ? cssL('r', 1, 'p { color: purple; }', { cls: 'is-new' }) : codeLine('r', ruleParts, { d: 1, cls: 'c1-cssline is-hl' }),
              tagL('sc', 0, 'style', true, { cls: 'c1-edge' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ПРАВИЛО ↔ МЕСТО (Visual Code Mapping) — три правила; горит одно; ученик нажимает на странице то, что оно
// покрасило: заголовок, абзац или фон (пустое место страницы). Раунды: p, body, h1.
// =============================================================================
const S10_CSS = 'h1 { color: orange; } p { color: green; } body { background-color: lavender; }';
const S10_RULES = { h1: 'h1 { color: orange; }', p: 'p { color: green; }', body: 'body { background-color: lavender; }' };
const S10_ROUNDS = ['p', 'body', 'h1'];
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? S10_ROUNDS.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ri === S10_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const want = S10_ROUNDS[ri];
  const ch = useChoiceHints(!ok, ri);
  const hints = [c.hint1, c.hint2[want], c.hint3[want]];
  const led = useIdleLed(canTap && !ok, ri);
  const tap = (k) => {
    if (!canTap || ok) return;
    st.current.tries += 1;
    if (k !== want) { st.current.misses += 1; sfx('soft', true); sayNow(ch.miss(c.miss[want], hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    if (ri === S10_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 's10', type: 'map-rule', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.right[want], c.ok), 'cheer');
    } else { sayNow(c.right[want], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setOk(false); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const order = ['h1', 'p', 'body'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S10_ROUNDS.length} />
        <div className="kz-scene c1-s5 c1-pair" key={'r' + ri}>
          <div className="kz-col"><KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' })].concat(order.map((k) => cssL('r' + k, 1, S10_RULES[k], { cls: k === want ? (ok ? 'is-new' : 'is-read') : 'c1-dim' })), [tagL('sc', 0, 'style', true, { cls: 'c1-edge' })])} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short cls="c1-maptap"><CssPage blocks={siteBlocks(pick)} rules={cssParse(S10_CSS)} tap={ok || !canTap ? null : tap} led={!ok && (ch.lad.lv >= 3 ? want : led ? null : null)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ЧТО ЛОМАЕТ ПРАВИЛО (показ) — «=» вместо «:» — заголовок не красится; нет «;» между двумя свойствами —
// не работает ни одно; правило без тега style, прямо в body — браузер показывает его как текст.
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);   // 0 — исходно; 1 — «=»; 2 — нет «;»; 3 — без style
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setN(1); } }, { say: [{ text: c.sayEq, pose: 'think' }] },
    { act: () => { sfx('soft', true); setN(2); } }, { say: [{ text: c.saySemi, pose: 'wonder' }] },
    { act: () => { sfx('soft', true); setN(3); } }, { say: [{ text: c.sayNoStyle, pose: 'think' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const rule = n === 1 ? 'h1 { color = orange; }' : n === 2 ? 'h1 { color: orange background-color: yellow; }' : 'h1 { color: orange; }';
  const lines = n === 3
    ? docLines([], [codeLine('raw', [<span key="r" className="c1-raw">{rule}</span>], { d: 1, cls: 'c1-cssline is-read' })].concat(siteBody(pick).slice(0, 2)), { style: false })
    : docLines([{ k: 'r', text: rule, cls: n ? 'is-read' : '' }], siteBody(pick).slice(0, 2));
  const blocks = (n === 3 ? [{ t: 'raw', text: rule, k: 'raw', hl: true }] : []).concat(siteBlocks(pick, n && n < 3 ? 'h1' : null).slice(0, 2));
  const askText = solved || demo.done ? c.askDone : n === 3 ? c.askNoStyle : n === 2 ? c.askSemi : n === 1 ? c.askEq : c.askDone;
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene c1-s5 c1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage blocks={blocks} rules={n === 3 ? [] : cssParse(rule)} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ИСПРАВЬ ЗНАК (Debug & Fix) — «h1 { color = orange; }»: в поле стоит «=»; ученик пишет «:» (кнопки : и ;).
// Браузер честно красит заголовок, только когда знак верный.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 3 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const inited = useRef(false);
  useEffect(() => { if (!inited.current && !solved) { inited.current = true; ty.setVal('='); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow, 0);
  const sign = okNow ? ':' : ty.val.trim();
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const w = ty.val.replace(/\s+/g, '');
    const issue = cyrIn(ty.val) || (w === ':' ? null : !w ? c.msgs.empty : w.indexOf('=') >= 0 ? c.msgs.eq : w === ';' ? c.msgs.semi : c.msgs.other);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's12', type: 'fix-colon', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const css = 'h1 { color' + (sign || ' ') + ' orange; }';
  const ruleParts = okNow ? null : [<span key="s" className="c1-sel">h1</span>, ' ', <span key="b" className="c1-punc">{'{'}</span>, ' ', <span key="p" className="c1-prop">color</span>,
    <span key="g" className={'kz-gap c1-slot c1-slot-sign' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={3} /></span>,
    ' ', <span key="v" className="c1-val">orange</span>, <span key="sc" className="c1-punc">;</span>, ' ', <span key="b2" className="c1-punc">{'}'}</span>];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.title)} short cls={okNow ? '' : 'c1-broken'}><CssPage blocks={siteBlocks(pick, okNow ? null : 'h1')} rules={cssParse(css)} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' }),
              okNow ? cssL('r', 1, 'h1 { color: orange; }', { cls: 'is-new' }) : codeLine('r', ruleParts, { d: 1, cls: 'c1-cssline is-hl' }),
              tagL('sc', 0, 'style', true, { cls: 'c1-edge' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[':', ';']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 0} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. НАЙДИ СЛОМАННОЕ ПРАВИЛО (Error Detective) — три правила; одно не работает (страница показывает, что не
// покрасилось). Раунд 1: «colr» в правиле p; раунд 2: нет «:» в правиле h1. Ученик нажимает сломанную строку.
// =============================================================================
const S13_ROUNDS = [
  { kind: 'typo', bad: 1, rules: ['h1 { color: orange; }', 'p { colr: green; }', 'body { background-color: lightyellow; }'], fixed: 'p { color: green; }' },
  { kind: 'colon', bad: 0, rules: ['h1 { color orange; }', 'p { color: green; }', 'body { background-color: lightyellow; }'], fixed: 'h1 { color: orange; }' }
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
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : ch.now(hints)} err={ch.err} n={(ri + 1) + '/' + S13_ROUNDS.length} />
        <div className="kz-scene kz-scene-col c1-q1" key={'q' + ri}>
          <div className="kz-col">
            <Br title={pick(C.site.title)} short cls={found ? '' : 'c1-broken'}><CssPage blocks={siteBlocks(pick)} rules={cssParse(rules.join(' '))} /></Br>
            <KzCode lines={rules.map((r, j) => ({
              k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: cssTokens(r),
              cls: 'c1-cssline c1-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && ((led && off.length === 0) || (lit && j === R.bad))
            }))} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. ПРАВИЛО ЦЕЛИКОМ (перенос) — пустая строка в style; ученик сам пишет «p { color: red; }». Браузер честно
// применяет то, что написано, сразу при наборе; проверка называет одну, самую полезную проблему.
// =============================================================================
function ruleIssue(t, want, msgs) {
  const s = String(t || '').trim();
  if (!s) return msgs.empty;
  if (s.indexOf('{') < 0 || s.indexOf('}') < 0) return msgs.braces;
  const m = /^([^{]*)\{([^}]*)\}\s*$/.exec(s);
  if (!m) return msgs.braces;
  const inner = m[2];
  if (inner.indexOf(':') < 0) return inner.indexOf('=') >= 0 ? msgs.eq : msgs.colon;
  if (!m[1].trim()) return msgs.noSel;
  if (m[1].trim().toLowerCase() !== want.sel) return msgs.sel;
  const d = inner.split(';').map((x) => x.trim()).filter(Boolean)[0] || '';
  const i = d.indexOf(':');
  const prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim().toLowerCase();
  if (prop !== want.prop) return msgs.prop;
  if (!cssOk(prop, val)) return msgs.notColor;
  if (val !== want.val) return msgs.other;
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
  const css = okNow ? 'p { color: red; }' : ty.val;
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = cyrIn(ty.val) || (ruleIssue(ty.val, { sel: 'p', prop: 'color', val: 'red' }, c.msgs));
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
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.title)} short><CssPage blocks={siteBlocks(pick, okNow ? null : 'p')} rules={cssParse(css)} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' }),
              okNow ? cssL('r', 1, 'p { color: red; }', { cls: 'is-new' }) : codeLine('r', [<span key="g" className={'kz-gap c1-slot c1-slot-rule' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={40} /></span>], { d: 1, cls: 'c1-cssline is-hl' }),
              tagL('sc', 0, 'style', true, { cls: 'c1-edge' })]} cls="kz-code-sm" />{!okNow && lad.lv >= 3 ? <HelpCode code={'p { color: red; }'} /> : null}
          </div>
        </div>
        {!okNow ? <KeyRow keys={['{', '}', ':', ';']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 4} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. СВОЯ СТРАНИЦА (Live Code Preview, «Готово») — два правила с пустыми цветами: h1 { color } и
// body { background-color }. Любой цвет, который знает браузер, честно красит страницу сразу; «Готово» — когда
// оба цвета понятны браузеру и не совпадают.
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
  const va = a.trim().toLowerCase(), vb = b.trim().toLowerCase();
  const ready = !!(va && vb);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const bad = !cssOk('color', va) ? a.trim() : !cssOk('background-color', vb) ? b.trim() : null;
    const issue = cyrIn(va, vb) || (bad && /\s/.test(bad) ? c.msgs.space : bad ? fillL(c.msgs.notColor, { w: bad }) : va === vb ? c.msgs.same : null);
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); return; }
    sfx('win', true); setMsg(null);
    store.set('myColor', va); store.set('myBg', vb); put({ done: true });
    log({ screenId: 's14', type: 'own-colors', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, color: va, bg: vb });
    sayNow(c.ok, 'cheer');
  };
  const css = 'h1 { color: ' + va + '; } body { background-color: ' + vb + '; }';
  const field = (val, set, k, max) => (
    <span key={k} className={'kz-gap c1-slot' + (led && k === 'fa' ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={max} /></span>
  );
  const l1 = [<span key="s" className="c1-sel">h1</span>, ' ', <span key="b" className="c1-punc">{'{'}</span>, ' ', <span key="p" className="c1-prop">color</span>, <span key="c" className="c1-punc">:</span>, ' ', solved ? <span key="v" className="c1-val">{va}</span> : field(a, setA, 'fa', 16), <span key="sc" className="c1-punc">;</span>, ' ', <span key="b2" className="c1-punc">{'}'}</span>];
  const l2 = [<span key="s" className="c1-sel">body</span>, ' ', <span key="b" className="c1-punc">{'{'}</span>, ' ', <span key="p" className="c1-prop">background-color</span>, <span key="c" className="c1-punc">:</span>, ' ', solved ? <span key="v" className="c1-val">{vb}</span> : field(b, setB, 'fb', 16), <span key="sc" className="c1-punc">;</span>, ' ', <span key="b2" className="c1-punc">{'}'}</span>];
  const blocks = [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.hello), k: 'p' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet kz-typed c1-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><CssPage blocks={blocks} rules={cssParse(css)} /></Br>
            <KzCode lines={[tagL('so', 0, 'style', false, { cls: 'c1-edge' }), codeLine('a', l1, { d: 1, cls: 'c1-cssline ' + (solved ? 'is-new' : 'is-hl') }), codeLine('b', l2, { d: 1, cls: 'c1-cssline ' + (solved ? 'is-new' : 'is-hl') }), tagL('sc', 0, 'style', true, { cls: 'c1-edge' })]} cls="kz-code-sm" />
            <Palette names={['red', 'blue', 'purple', 'orange', 'lightyellow', 'lightblue', 'pink', 'lavender']} />
          </div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q1. ВЕРНО ИЛИ НЕТ (True / False) — четыре утверждения по очереди; ступени подсказки — как во всех выборах.
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
      className={'kz-btn c1-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = {
    ok: [cssL('c', 0, 'h1 { color: orange; }')],
    style: [tagL('ho', 0, 'head'), tagL('so', 1, 'style'), cssL('c', 2, 'h1 { color: orange; }'), tagL('sc', 1, 'style', true), tagL('hc', 0, 'head', true)],
    p: [cssL('c', 0, 'p { color: red; }')]
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c1-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c1-card c1-tf-card kz-a-drop">
              <span className="c1-card-h">{pick(c.card)}</span>
              <p className="c1-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={codes[it.code]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c1-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: «color = orange» не работает (в CSS — двоеточие); своя страница ученика в его цветах;
// роли style, селектор, свойство, значение загораются, пока Коди их называет.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const store = useStore();
  const mc = store.get('myColor') || 'purple', mb = store.get('myBg') || 'lavender';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const css = riddle ? 'h1 { color = orange; }' : 'h1 { color: ' + mc + '; } body { background-color: ' + mb + '; }';
  const blocks = riddle ? siteBlocks(pick, 'h1').slice(0, 2) : [{ t: 'h1', text: pick(UI.mySite), k: 'h', hl: curK === 'sel' }, { t: 'p', text: pick(C.site.hello), k: 'p' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c1-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage blocks={blocks} rules={cssParse(css)} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <KzCode lines={[cssL('r1', 0, riddle ? 'h1 { color = orange; }' : 'h1 { color: ' + mc + '; }', { cls: riddle ? 'is-read' : '' }, curK === 'sel' ? 'sel' : curK === 'prop' ? ['prop', 'val'] : null)].concat(riddle ? [] : [cssL('r2', 0, 'body { background-color: ' + mb + '; }')])} cls="kz-code-sm" />
            <div className="kz-roles">
              {['style', 'sel', 'prop', 'val'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (curK === 'prop' && k === 'val') || (riddle && k === 'prop') ? ' is-on' : '')} style={{ '--c': k === 'style' ? '#FA4F28' : k === 'sel' ? '#D97706' : k === 'prop' ? '#7C5CFA' : '#0FA38E' }}>
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

// Артефакт урока — своя страница ученика в его цветах.
function lessonCss1Artifact(store) {
  const mc = store.get('myColor'), mb = store.get('myBg');
  if (!mc && !mb) return null;
  return { type: 'html-page', color: mc || '', background: mb || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening saytim</title>', '    <style>',
      '      h1 { color: ' + escHtml(mc || '') + '; }', '      body { background-color: ' + escHtml(mb || '') + '; }', '    </style>', '  </head>', '  <body>',
      '    <h1>Mening saytim</h1>', '  </body>', '</html>'].join('\n') };
}

export default function CssChtoTakoe({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss1Artifact(store) })
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
