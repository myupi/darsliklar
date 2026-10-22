// =============================================================================
// МЕХАНИКА ПРАКТИКИ 2 (копия механики практики 01p; под тему урока 2 — теги
// h1–h6, p, b, i, честная страница с заголовками и абзацами, проверка фрагментов,
// карта-газета). Каркас — практика 01p (разбор кода, редактор, ход задания,
// экран без Коди); вид — бумажный набор урока 1 (лист, вырезки, бумажный браузер).
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГИ ПРОИЗНОСЯТСЯ СЛОВАМИ. На экране точная запись (title, </body>), в озвучку
// теги уходят английскими словами («title», «закрывающий тег body»). Знаки в
// кавычках рядом со своим названием убирает бумажный набор (kollazh-kit).
// ─────────────────────────────────────────────────────────────────────────────
const TAG_SAY = {
  ru: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six', p: 'P', b: 'B', i: 'I',
    close: 'закрывающий тег', lt: 'уголок', gt: 'уголок', slash: 'косая черта' },
  uz: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six', p: 'P', b: 'B', i: 'I',
    close: 'yopuvchi teg', lt: 'chap qavs', gt: 'o‘ng qavs', slash: 'qiya chiziq' },
  en: { html: 'H T M L', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six', p: 'P', b: 'B', i: 'I',
    close: 'closing tag', lt: 'less-than sign', gt: 'greater-than sign', slash: 'slash' }
};
function spokenHtml(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const word = (t) => m[String(t).toLowerCase()] || t;
  let s = String(text || '');
  s = s.replace(/<!DOCTYPE\s+html>/gi, m.doctype + ' ' + m.html);
  s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => ' ' + m.close + ' ' + word(t) + ' ');
  s = s.replace(/<\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => ' ' + word(t) + ' ');
  s = s.replace(/\b(html|HTML|head|title|body|DOCTYPE|h[1-6])\b/g, (w) => word(w));
  // Одиночные латинские p, b, i — имена тегов (как в уроке 2): других в репликах нет.
  s = s.replace(/(^|[\s(«“"])([pbi])(?=[\s,.!?:;)»”"]|$)/g, (all, pre, t) => pre + word(t));
  s = s.replace(/</g, ' ' + m.lt + ' ').replace(/>/g, ' ' + m.gt + ' ').replace(/\s\/\s/g, ' ' + m.slash + ' ');
  return s.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}
// Реплики в данных экрана — для прогрева озвучки. Подписи, которые только
// печатаются, пропускаем; шаблоны с подстановкой {…} — тоже.
const PRINTED = { eyebrow: 1, order: 1, order2: 1, drill2: 1, ask: 1, empty: 1, note: 1, skills: 1, drill: 1, pose: 1 };
function heroLines(node, lang, out) {
  const acc = out || [];
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((x) => heroLines(x, lang, acc)); return acc; }
  if (node.uz !== undefined || node.ru !== undefined) {
    const s = node[lang] !== undefined ? node[lang] : node.ru;
    if (typeof s === 'string' && s.indexOf('{') < 0) acc.push(s);
    return acc;
  }
  Object.keys(node).forEach((k) => { if (!PRINTED[k]) heroLines(node[k], lang, acc); });
  return acc;
}
function SpokenTags({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenHtml(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧАСТИ СТРАНИЦЫ — цвета как в уроке 1: html — коралл, head и title — горчица,
// body — бирюза. Цвет — только у полосок вложенности; смысл несёт форма
// (сплошная — закрыто, пунктир — нет), а теги в коде — коралловые уголки и
// имя чернилами, как на бумажках урока.
// ─────────────────────────────────────────────────────────────────────────────
const TAGC = { html: '#E0643F', head: '#D39A1E', title: '#D39A1E', body: '#2A8C7E',
  h1: '#E0643F', h2: '#E0643F', h3: '#E0643F', h4: '#E0643F', h5: '#E0643F', h6: '#E0643F', p: '#2A8C7E', b: '#D39A1E', i: '#D39A1E' };
const HEADS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const KNOWN = ['html', 'head', 'title', 'body'].concat(HEADS, ['p', 'b', 'i']);
const catOf = (tag) => (tag === 'html' ? 'html' : tag === 'head' || tag === 'title' ? 'head' : 'body');
const isHead = (t) => /^h[1-6]$/.test(t);
const isBlock = (t) => isHead(t) || t === 'p';
const isInline = (t) => t === 'b' || t === 'i';

// Осмысленный текст: хотя бы две буквы любого алфавита.
const LETTER_RE = /\p{L}/gu;
const hasLetters = (s) => (String(s || '').match(LETTER_RE) || []).length >= 2;
// Похоже на тег: «<» с буквой, «/» или «!» после него, либо знакомый тег без «<».
const hasTags = (s) => /<\s*[A-Za-z\/!\\]/.test(String(s || '')) || /\b(html|head|title|body|h[1-6])\s*>/i.test(String(s || ''));
const squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
// Сравнение заданных надписей: регистр, ё/е, кавычки и знаки по краям не важны.
const normName = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е')
  .replace(/[«»"“”„'‘’ʻʼ`.!?,:;…]/g, '').replace(/\s+/g, ' ').trim();
const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pickOf = (x, lang) => (x && typeof x === 'object' ? (x[lang] !== undefined ? x[lang] : x.ru) : String(x || ''));

// Расстояние между словами — чтобы узнать «titel» и подсказать title.
function editDist(a, b) {
  const m = a.length, n = b.length;
  const d = [];
  for (let i = 0; i <= m; i += 1) { d[i] = [i]; }
  for (let j = 0; j <= n; j += 1) { d[0][j] = j; }
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[m][n];
}
const nearTag = (name) => {
  const s = String(name || '').toLowerCase();
  let best = null;
  let bd = 3;
  KNOWN.forEach((k) => { const dd = editDist(s, k); if (dd < bd) { bd = dd; best = k; } });
  return s.length >= 2 && bd <= 2 ? best : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Код ученика НИКОГДА не исполняется и не вставляется как HTML:
// lexDoc только режет строку на теги и текст. Пробелы и переносы внутри и
// между тегами допустимы, регистр букв не важен.
//   { k: 'doctype' } · { k: 'open' | 'close', name } · { k: 'text', v } ·
//   { k: 'bad', bad: 'noGt' | 'noLt' | 'unknown' | 'slashEnd' | 'backslash' | 'junk' | 'emptyTag', name, raw }
// У каждого токена — номер строки (line), считая от нуля.
// ─────────────────────────────────────────────────────────────────────────────
function lexDoc(src) {
  const s = String(src || '');
  const out = [];
  let line = 0;
  const push = (tok, from, to) => {
    tok.line = line;
    out.push(tok);
    for (let k = from; k < to; k += 1) if (s.charCodeAt(k) === 10) line += 1;
  };
  // Текст без «<». Внутри ищем знакомый тег без открывающего уголка: «title>».
  const pushText = (from, to) => {
    const part = s.slice(from, to);
    const re = /(\/?)[ \t]*\b(html|head|title|body|h[1-6])[ \t]*>/gi;
    let last = 0;
    let m;
    while ((m = re.exec(part))) {
      if (m.index > last) push({ k: 'text', v: part.slice(last, m.index) }, from + last, from + m.index);
      push({ k: 'bad', bad: 'noLt', name: m[2].toLowerCase(), raw: m[0] }, from + m.index, from + m.index + m[0].length);
      last = m.index + m[0].length;
    }
    if (last < part.length) push({ k: 'text', v: part.slice(last) }, from + last, to);
  };
  let i = 0;
  while (i < s.length) {
    // «<» без буквы, «/», «\» или «!» после него — просто текст («<3», «2 < 5»),
    // как и в настоящем браузере.
    if (s[i] === '<' && !/^<\s*[A-Za-z\/!\\]/.test(s.slice(i, i + 24))) {
      const j = s.indexOf('<', i + 1);
      const end = j < 0 ? s.length : j;
      pushText(i, end);
      i = end;
      continue;
    }
    if (s[i] !== '<') {
      const j = s.indexOf('<', i);
      const end = j < 0 ? s.length : j;
      pushText(i, end);
      i = end;
      continue;
    }
    const gt = s.indexOf('>', i + 1);
    const lt = s.indexOf('<', i + 1);
    if (gt < 0 || (lt >= 0 && lt < gt)) {
      // «<title» без «>»: тег не закончен. Хвост дальше читается как текст.
      const m = /^<\s*[\/\\]?\s*!?[A-Za-z]*[A-Za-z0-9]*/.exec(s.slice(i));
      const raw = m ? m[0] : '<';
      const name = (/[A-Za-z][A-Za-z0-9]*/.exec(raw.replace(/^<\s*[\/\\]?\s*!?/, '')) || [''])[0].toLowerCase();
      push({ k: 'bad', bad: 'noGt', name, raw }, i, i + raw.length);
      i += raw.length;
      continue;
    }
    const inner = s.slice(i + 1, gt);
    const raw = s.slice(i, gt + 1);
    let tok;
    let m;
    if (/^\s*!/.test(inner)) tok = { k: 'doctype', raw };
    else if ((m = /^\s*(\/)?\s*([A-Za-z][A-Za-z0-9]*)\s*$/.exec(inner))) {
      const name = m[2].toLowerCase();
      tok = KNOWN.indexOf(name) >= 0 ? { k: m[1] ? 'close' : 'open', name, raw }
        : { k: 'bad', bad: 'unknown', name, raw };
    } else if ((m = /^\s*\\\s*([A-Za-z][A-Za-z0-9]*)\s*$/.exec(inner))) {
      tok = { k: 'bad', bad: 'backslash', name: m[1].toLowerCase(), raw };
    } else if ((m = /^\s*([A-Za-z][A-Za-z0-9]*)\s*\/\s*$/.exec(inner))) {
      tok = { k: 'bad', bad: 'slashEnd', name: m[1].toLowerCase(), raw };
    } else if (/^\s*$/.test(inner)) tok = { k: 'bad', bad: 'emptyTag', name: '', raw };
    else {
      m = /^\s*\/?\s*([A-Za-z][A-Za-z0-9]*)/.exec(inner);
      tok = { k: 'bad', bad: 'junk', name: m ? m[1].toLowerCase() : '', raw };
    }
    push(tok, i, gt + 1);
    i = gt + 1;
  }
  return out;
}

const fb = (key, vars, cat) => ({ ok: false, msg: vars ? fillL(FB[key] || key, vars) : (FB[key] || key), cat: cat || 'tag' });
const fbT = (node, vars, cat) => ({ ok: false, msg: vars ? fillL(node, vars) : node, cat: cat || 'tag' });

// Неверно записанный тег — своя фраза для каждого случая.
function badFb(t) {
  const nm = t.name || '';
  const cat = KNOWN.indexOf(nm) >= 0 ? catOf(nm) : (nearTag(nm) ? catOf(nearTag(nm)) : 'tag');
  const r = (o) => Object.assign(o, { line: t.line });
  if (t.bad === 'noGt') return r(fb('noGt', { tag: KNOWN.indexOf(nm) >= 0 ? nm : (t.raw || '<') }, cat));
  if (t.bad === 'noLt') return r(fb('noLt', { tag: nm }, cat));
  if (t.bad === 'slashEnd') return r(fb('slashEnd', { tag: KNOWN.indexOf(nm) >= 0 ? nm : (nearTag(nm) || nm) }, cat));
  if (t.bad === 'backslash') return r(fb('backslash', null, cat));
  if (t.bad === 'emptyTag') return r(fb('emptyTag', null, 'tag'));
  if (t.bad === 'junk') return r(fb('junk', null, cat));
  const near = nearTag(nm);
  return r(near ? fb('unknown', { raw: t.raw, tag: near }, catOf(near)) : fb('unknownFar', { raw: t.raw }, 'tag'));
}

// Полоски вложенности: какой контейнер на каких строках и закрыт ли он.
// Незакрытый тянется до места, где его закрыли бы, или до конца кода.
// title — строчный, полоска ему не нужна.
function regionsOf(src) {
  const toks = lexDoc(src);
  const last = String(src || '').split('\n').length - 1;
  const stack = [];
  const regs = [];
  toks.forEach((t) => {
    if (t.k === 'open' && t.name !== 'title') stack.push({ tag: t.name, from: t.line, depth: stack.length });
    else if (t.k === 'close' && t.name !== 'title') {
      let at = -1;
      for (let k = stack.length - 1; k >= 0; k -= 1) if (stack[k].tag === t.name) { at = k; break; }
      if (at < 0) return;
      for (let k = stack.length - 1; k > at; k -= 1) regs.push(Object.assign({}, stack[k], { to: t.line - 1, closed: false }));
      regs.push(Object.assign({}, stack[at], { to: t.line, closed: true }));
      stack.length = at;
    }
  });
  stack.forEach((r) => regs.push(Object.assign({}, r, { to: last, closed: false })));
  return regs;
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА КОДА — как теги на бумажках урока 1: уголки и косая черта
// коралловые, имя чернилами. Начертание одно для всех кусочков: подсветка
// лежит под прозрачной textarea и обязана совпадать с ней буква в букву.
// ─────────────────────────────────────────────────────────────────────────────
function hlLine(str) {
  const re = /<!DOCTYPE\s+html\s*>|<\s*[\/\\]?\s*[A-Za-z][A-Za-z0-9]*\s*\/?\s*>/gi;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(<span key={'t' + last} className="ed-t">{str.slice(last, m.index)}</span>);
    const raw = m[0];
    const nm = ((/[A-Za-z][A-Za-z0-9]*/.exec(raw.replace(/^<\s*[\/\\]?\s*/, '')) || [''])[0]).toLowerCase();
    if (/^<!/.test(raw)) out.push(<span key={'g' + m.index} className="ed-doc">{raw}</span>);
    else if (KNOWN.indexOf(nm) >= 0 && /^<\s*\/?\s*[A-Za-z][A-Za-z0-9]*\s*>$/.test(raw)) {
      const mm = /^(<\s*\/?\s*)([A-Za-z][A-Za-z0-9]*)(\s*>)$/.exec(raw);
      out.push(<span key={'g' + m.index} className="ed-tag"><span className="ed-br">{mm[1]}</span><span className="ed-nm">{mm[2]}</span><span className="ed-br">{mm[3]}</span></span>);
    } else out.push(<span key={'g' + m.index} className="ed-unk">{raw}</span>);
    last = m.index + raw.length;
  }
  if (last < str.length) out.push(<span key={'t' + last} className="ed-t">{str.slice(last)}</span>);
  return out;
}

// Вставка символа с кнопки < / > в место курсора. execCommand сохраняет
// отмену (Ctrl+Z) и шлёт обычное событие ввода; запасной путь — setRangeText.
function insertAtCaret(el, ch) {
  if (!el) return;
  if (document.activeElement !== el) el.focus();
  let done = false;
  try { done = !!(document.execCommand && document.execCommand('insertText', false, ch)); } catch (e) { done = false; }
  if (done) return;
  const a = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
  const b = typeof el.selectionEnd === 'number' ? el.selectionEnd : a;
  if (el.setRangeText) el.setRangeText(ch, a, b, 'end');
  else {
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, el.value.slice(0, a) + ch + el.value.slice(b));
    el.setSelectionRange(a + ch.length, a + ch.length);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

const MAX_CODE = 1500;

// Бумажная подложка: вырезка с рваным краем под содержимым (редактор, заметка,
// образец). Сам край не обрезает текст — он лежит слоем ниже.
function Pad({ c, seed = 7, cls, children, style }) {
  return (
    <div className={'pp-pad kz-piece' + (cls ? ' ' + cls : '')} style={style}>
      <Cut c={c || '#FFFCF4'} seed={seed} n={18} amp={0.9} asp={1.4} cls="pp-pad-bg" />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// РЕДАКТОР КОДА. Прозрачная textarea лежит поверх подсвеченных строк той же
// ширины, шрифта и отступов: всё, что умеет обычное поле (курсор, выделение,
// удаление, переносы, вставка, отмена), работает как есть. Строки до и после
// — неизменяемая рамка задания. single — одна строка: Enter не переносит.
// regions — полоски вложенности; markLine — строка, на которую указывает подсказка.
// ─────────────────────────────────────────────────────────────────────────────
function CodeEditor({ value, onChange, before, after, single, ind, regions, markLine, inputRef, label, led }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  // Рамка задания длиннее окна (телефон) — показываем место для ввода сразу.
  useLayoutEffect(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.ed-edit');
    if (box && ed && box.scrollHeight > box.clientHeight + 4) box.scrollTop = Math.max(0, ed.offsetTop - 28);
  }, []);
  // Открылась клавиатура — редактор стал ниже: строка ввода не должна уехать
  // за край. Для документа целиком браузер сам держит курсор на виду.
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.ed-edit');
    if (!box || !ed || !nB) return;
    const top = ed.offsetTop, bot = top + ed.offsetHeight;
    if (top < box.scrollTop + 4 || bot > box.scrollTop + box.clientHeight - 4) box.scrollTop = Math.max(0, Math.min(top - 8, bot - box.clientHeight + 8));
  }, [nB]);
  useEffect(() => {
    const vv = typeof window !== 'undefined' && window.visualViewport;
    const on = () => { if (inputRef && inputRef.current && document.activeElement === inputRef.current) setTimeout(reveal, 60); };
    if (vv) vv.addEventListener('resize', on);
    window.addEventListener('resize', on);
    return () => { if (vv) vv.removeEventListener('resize', on); window.removeEventListener('resize', on); };
  }, [reveal]); // eslint-disable-line react-hooks/exhaustive-deps
  const barsAt = (i) => (regions ? regions.filter((r) => r.from <= i && i <= r.to) : []);
  const bars = (i) => barsAt(i).map((r, k) => (
    <span key={k} aria-hidden="true"
      className={'ed-bar' + (r.closed ? '' : ' is-open') + (r.from === i ? ' is-first' : '') + (r.to === i ? ' is-last' : '')}
      style={{ '--c': TAGC[r.tag], '--lv': r.depth }} />
  ));
  const staticLine = (txt, i, key) => (
    <div className={'ed-line is-static' + (markLine === i ? ' is-mark' : '')} key={key}>
      <span className="ed-n" aria-hidden="true">{i + 1}</span>
      {bars(i)}
      {txt ? hlLine(txt) : '​'}
    </div>
  );
  const change = (e) => {
    let v = e.target.value;
    if (single) v = v.replace(/\r?\n/g, ' ');
    onChange(v.slice(0, MAX_CODE));
  };
  return (
    <div ref={boxRef} className="ed" translate="no" style={{ '--edi': (ind || 0) + 'ch' }}>
      {(before || []).map((t, i) => staticLine(t, i, 'b' + i))}
      <div className={'ed-edit' + (single ? ' is-single' : '') + (nB || (after && after.length) ? ' is-framed' : '') + (led ? ' is-led-in' : '')}>
        <div className="ed-hl" aria-hidden="true">
          {lines.map((ln, i) => (
            <div key={i} className={'ed-line' + (markLine === nB + i ? ' is-mark' : '')}>
              <span className="ed-n">{nB + i + 1}</span>
              {bars(nB + i)}
              {ln ? hlLine(ln) : '​'}
            </div>
          ))}
        </div>
        <textarea ref={inputRef} className="ed-ta" value={value} onChange={change} rows={1} wrap="soft"
          onFocus={() => { setTimeout(reveal, 80); setTimeout(reveal, 420); }}
          onKeyDown={(e) => { if (single && e.key === 'Enter') e.preventDefault(); }}
          spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
          enterKeyHint={single ? 'done' : 'enter'} aria-label={pick(label || UI.editor)} />
      </div>
      {(after || []).map((t, i) => staticLine(t, nB + lines.length + i, 'a' + i))}
    </div>
  );
}

// Поле прямо в строке кода. Растёт по тексту: сначала в ширину, упёрлось в
// край строки — переносит текст и растёт в высоту. 16 px — меньше нельзя:
// iOS увеличит страницу. Enter строку не переносит.
let _growCtx = null;
function fitGrow(el) {
  if (!el) return;
  const cs = getComputedStyle(el);
  if (!_growCtx) _growCtx = document.createElement('canvas').getContext('2d');
  if (_growCtx) {
    _growCtx.font = cs.font || (cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily);
    const txt = el.value || el.placeholder || '';
    const w = Math.ceil(_growCtx.measureText(txt).width) + parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0) + 10;
    el.style.width = w + 'px';
  }
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
function InlineInput({ value, onChange, placeholder, label, max = 60, inputRef, cls }) {
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
    const ro = new ResizeObserver(() => fit());
    ro.observe(host);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <textarea ref={setRef} rows={1} className={'tk-input' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onChange={(e) => onChange(e.target.value.replace(/\r?\n/g, ' '))}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ДОКУМЕНТ С ПОЛЯМИ (t1, t2). Документ собран правильно; ученик пишет только
// содержимое title или body — прямо в строке кода. Полоски слева — вложенность;
// hl подсвечивает часть по подсказке, led — поле, куда писать.
// ─────────────────────────────────────────────────────────────────────────────
function FieldDoc({ title, body, onTitle, onBody, editTitle = true, editBody = true, hl, led, titleRef, bodyRef, focusBody, ph }) {
  const pick = usePick();
  const boxRef = useRef(null);
  useLayoutEffect(() => {
    const box = boxRef.current;
    const row = box && box.children[6];
    if (focusBody && row && box.scrollHeight > box.clientHeight + 4) box.scrollTop = Math.max(0, row.offsetTop - box.clientHeight / 2);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const field = (val, on, ref, lbl, which) => (
    <InlineInput value={val} onChange={on} label={lbl} inputRef={ref} placeholder={ph && ph[which]}
      cls={led === which ? 'is-led-in' : ''} max={which === 'body' ? 140 : 40} />
  );
  const rows = [
    { d: 0, reg: [], c: <span className="pp-doc">{'<!DOCTYPE html>'}</span> },
    { d: 0, reg: ['html'], first: 'html', c: T_('html') },
    { d: 1, reg: ['html', 'head'], first: 'head', c: T_('head') },
    { d: 2, reg: ['html', 'head', 'title'], c: <>{T_('title')}{editTitle ? field(title, onTitle, titleRef, UI.titleField, 'title') : <span className="pp-text">{title}</span>}{T_('title', true)}</> },
    { d: 1, reg: ['html', 'head'], last: 'head', c: T_('head', true) },
    { d: 1, reg: ['html', 'body'], first: 'body', c: T_('body') },
    { d: 2, reg: ['html', 'body'], c: editBody ? field(body, onBody, bodyRef, UI.bodyField, 'body') : <span className="pp-text">{body}</span> },
    { d: 1, reg: ['html', 'body'], last: 'body', c: T_('body', true) },
    { d: 0, reg: ['html'], last: 'html', c: T_('html', true) }
  ];
  return (
    <div ref={boxRef} className="cv" translate="no" aria-label={pick(UI.editor)} role="group">
      {rows.map((r, i) => {
        const inHl = hl && r.reg.indexOf(hl) >= 0;
        return (
          <div key={i} className={'cv-line' + (hl ? (inHl ? ' is-in' : ' is-out') : '')} style={{ '--d': r.d }}>
            <span className="cv-n" aria-hidden="true">{i + 1}</span>
            {r.reg.filter((g) => g !== 'title').map((g) => (
              <span key={g} aria-hidden="true" className={'cv-bar' + (r.first === g ? ' is-first' : '') + (r.last === g ? ' is-last' : '')}
                style={{ '--c': TAGC[g], '--lv': g === 'html' ? 0 : 1 }} />
            ))}
            <span className="cv-code">{r.c}</span>
          </div>
        );
      })}
    </div>
  );
}

// Статичный кусок кода: образец подсказки, код готовой страницы.
function CodeSample({ code, label, cls }) {
  const pick = usePick();
  return (
    <div className={'sample' + (cls ? ' ' + cls : '')} translate="no">
      {label ? <span className="sample-lbl">{pick(label)}</span> : null}
      <div className="sample-code">
        {String(code).split('\n').map((ln, i) => <div key={i} className="sample-line">{ln ? hlLine(ln) : '​'}</div>)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧТО ПОКАЖЕТ БРАУЗЕР (урок 2) — честно, как настоящий, для наших тегов:
//   · title — на вкладку (незакрытый уносит на вкладку остальной код);
//   · h1–h6 и p — блоки; новый блок закрывает открытый абзац; p внутри
//     незакрытого заголовка рисуется шрифтом заголовка;
//   · b и i — жирный и курсив; незакрытый b / i тянется дальше, через абзацы
//     (как настоящий браузер переоткрывает форматирование);
//   · текст без тегов — отдельной строкой в окне.
// Возвращает { title, blocks: [{ t, inh, parts: [{ s, b, i }] }] } — только текст.
// ─────────────────────────────────────────────────────────────────────────────
function renderDoc(src) {
  const toks = lexDoc(src);
  let title = null;
  let inTitle = false;
  let tt = '';
  const blocks = [];
  let cur = null;
  const fmt = { b: 0, i: 0 };
  // Незакрытый заголовок: абзацы после него браузер кладёт внутрь — шрифтом заголовка.
  let openHead = null;
  const open = (t, inh) => { cur = { t, inh: inh || null, parts: [] }; blocks.push(cur); };
  const text = (v) => {
    if (!cur) { if (!v.trim()) return; open('raw'); }
    cur.parts.push({ s: v, b: fmt.b > 0, i: fmt.i > 0 });
  };
  toks.forEach((t) => {
    if (inTitle) {
      if (t.k === 'close' && t.name === 'title') { inTitle = false; title = squash(tt); return; }
      tt += t.k === 'text' ? t.v : ' ' + (t.raw || '') + ' ';
      return;
    }
    if (t.k === 'open' && t.name === 'title') { inTitle = true; tt = ''; return; }
    if (t.k === 'text') { text(t.v); return; }
    if (t.k === 'bad') { if (t.bad === 'noLt' || t.bad === 'backslash' || t.bad === 'emptyTag') text(t.raw); return; }
    if (t.k === 'open') {
      if (isHead(t.name)) { open(t.name); openHead = t.name; return; }
      if (t.name === 'p') { open('p', openHead); return; }
      if (isInline(t.name)) { fmt[t.name] += 1; return; }
      return;
    }
    if (t.k === 'close') {
      if (isInline(t.name)) { fmt[t.name] = Math.max(0, fmt[t.name] - 1); return; }
      // Любой </h1>…</h6> закрывает открытый заголовок (так и в браузере).
      if (isHead(t.name)) openHead = null;
      if (isBlock(t.name) && cur) { cur.done = true; cur = null; }
    }
  });
  if (inTitle) title = squash(tt);
  return { title, blocks: blocks.filter((bk) => bk.parts.some((x) => x.s.trim())) };
}

// ПРОВЕРКА ФРАГМЕНТА (теги урока 2). Обход по порядку записи; первая проблема —
// фраза, всего проблем — для счётчика «осталось исправить».
//   · блоки h1–h6 и p стоят друг за другом, не внутри друг друга;
//   · b и i — внутри блока; пары совпадают (h2 закрывается </h2>);
//   · strictText — текст вне блоков тоже проблема (своя статья).
function checkFrag(code, opts) {
  const o = opts || {};
  const toks = lexDoc(code);
  const issues = [];
  const add = (key, vars, line) => issues.push({ key, vars: vars || null, line });
  const stack = [];
  const blocks = [];
  let cur = null;
  // После тега до следующего тега нет слов — значит, тег пустой (ставили закрывающий).
  const bare = (idx) => {
    for (let k = idx + 1; k < toks.length; k += 1) {
      if (toks[k].k !== 'text') return true;
      if (hasLetters(toks[k].v)) return false;
    }
    return true;
  };
  toks.forEach((t, idx) => {
    if (t.k === 'bad') { issues.push(Object.assign(badFb(t), { line: t.line, bad: true })); return; }
    if (t.k === 'doctype' || ((t.k === 'open' || t.k === 'close') && !isBlock(t.name) && !isInline(t.name))) return;
    if (t.k === 'text') {
      if (cur) cur.text += t.v;
      if (cur && stack.some(isInline)) stack.filter(isInline).forEach((x) => { cur.marks.push({ tag: x, v: t.v }); });
      else if (!cur && hasLetters(t.v) && o.strictText) add('textOutside', null, t.line);
      return;
    }
    const top = stack[stack.length - 1];
    if (t.k === 'open') {
      if (isBlock(t.name)) {
        // <h2>Погода<h2> — открывающий тег вместо закрывающего: нет косой черты.
        if (top === t.name && stack.length === 1 && bare(idx)) { add('openAgain', { tag: t.name }, t.line); stack.length = 0; cur = null; return; }
        if (stack.length) add('blockInBlock', { tag: stack.find(isBlock) || top, next: t.name }, t.line);
        stack.length = 0;
        cur = { t: t.name, text: '', marks: [], line: t.line };
        blocks.push(cur);
        stack.push(t.name);
        return;
      }
      if (!cur) add('inlineOutside', { tag: t.name }, t.line);
      stack.push(t.name);
      return;
    }
    if (top === t.name) { stack.pop(); if (isBlock(t.name)) cur = null; return; }
    if (top && isHead(top) && isHead(t.name)) { add('pairMismatch', { a: top, b: t.name }, t.line); stack.pop(); cur = null; return; }
    const at = stack.lastIndexOf(t.name);
    if (at >= 0) {
      for (let k = stack.length - 1; k > at; k -= 1) add('unclosedIn', { tag: stack[k], next: t.name }, t.line);
      stack.length = at;
      if (isBlock(t.name)) cur = null;
      return;
    }
    add('closeWithoutOpen', { tag: t.name }, t.line);
  });
  for (let k = stack.length - 1; k >= 0; k -= 1) add('unclosedEnd', { tag: stack[k] }, null);
  const first = issues[0];
  const msg = first ? (first.bad ? first.msg : fillL(FB[first.key], first.vars || {})) : null;
  return { ok: !issues.length, msg, line: first ? first.line : null, count: issues.length, blocks };
}

// Страница всегда помещается в окно целиком, без прокрутки (правило эталона):
// не влезает — шрифт страницы ступеньками уменьшается (не меньше 56 %).
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

// Бумажный браузер урока 1 со страницей урока 2: заголовки, абзацы, жирный и курсив.
// Классы pg- (pp-doc занят строкой DOCTYPE в коде с полями).
function PageView({ title, blocks, empty, flash, hl }) {
  const pick = usePick();
  const list = blocks || [];
  const ref = useFitPage(JSON.stringify(list) + (flash || 0));
  return (
    <PaperBrowser title={title} stamp={flash} tabHl={hl === 'title'} pageHl={hl === 'body'} cls="pp-br kz-piece">
      <div ref={ref} key={'pg' + (flash || 0)} className={'pg-doc' + (list.length ? '' : ' is-empty') + (flash ? ' kz-a-pop' : '')}>
        {list.length ? list.map((bk, j) => (
          <div key={j} className={'pg-blk pg-' + bk.t + (bk.inh ? ' pg-in-' + bk.inh : '')}>
            {bk.parts.map((x, k) => {
              const inner = x.i ? <i>{x.s}</i> : x.s;
              return x.b ? <b key={k}>{inner}</b> : <React.Fragment key={k}>{inner}</React.Fragment>;
            })}
          </div>
        )) : (empty ? pick(empty) : '\u00a0')}
      </div>
    </PaperBrowser>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// СТЕНГАЗЕТА — карта продвижения из бумажных вырезок. Вырезка: лист с рваным
// краем, тёмная полоса заголовка, строки текста, цветная картинка. Ждёт — выцвела,
// перекошена, строки вразнобой; готова — свой цвет, ровно, галочка. Своя статья до
// написания — пунктирный контур; потом на ней заголовок ученика.
// (Функции houseLit / houseName / StreetStrip / StreetMap — устройство карты 01p.)
// ─────────────────────────────────────────────────────────────────────────────
const houseLit = (store, i) => !!(store.get('t' + (i + 1)) || {}).solved;
const houseName = (store, i, pick) => {
  const own = i === HOME ? ((store.get('t' + (i + 1)) || {}).result || {}).title : null;
  return own && houseLit(store, i) ? own : pick(STREET[i].name);
};
const TILT = [-7, 5, -5, 7, 0];
function Clipping({ i, lit, cur, name, size, pop, whole }) {
  const h = STREET[i];
  const home = i === HOME;
  const on = lit || (whole && !home);
  const ghost = home && !lit;
  const wait = !on && !home;
  return (
    <span className={'pp-house pp-clip' + (on ? ' is-lit' : '') + (wait ? ' is-wait' : '') + (cur ? ' is-cur' : '') + (ghost ? ' is-ghost' : '') + (pop ? ' kz-a-stamp' : '') + (size ? ' is-' + size : '')}
      style={{ '--hc': h.c, '--tilt': TILT[i % TILT.length] + 'deg' }}>
      <span className="pp-h-art" aria-hidden="true">
        {ghost ? <span className="pp-clip-plan" /> : (
          <>
            <Cut c="#FBF6EA" seed={80 + i} n={8} amp={3} asp={0.82} cls="pp-clip-paper" />
            <span className={'pp-clip-head' + (on ? '' : ' is-off')} />
            <span className="pp-clip-pic" />
            <span className={'pp-clip-lines' + (on ? '' : ' is-mess')}><i /><i /><i /></span>
          </>
        )}
      </span>
      {lit ? <span className="pp-h-ok"><Icon name="check" size={9} /></span> : null}
      {name ? <span className="pp-h-name">{name}</span> : null}
    </span>
  );
}

// Полоса улицы над заданием: восемь домов и подпись текущего. mini — для шапки
// телефона: только предыдущий, текущий и следующий дом, без подписи.
function StreetStrip({ cur, pop, mini }) {
  const pick = usePick();
  const store = useStore();
  const shown = mini ? STREET.map((s, i) => i).filter((i) => Math.abs(i - cur) <= 1) : STREET.map((s, i) => i);
  const nm = (i) => houseName(store, i, pick);
  return (
    <div className={'pp-strip' + (mini ? ' is-mini' : ' kz-piece')}>
      <div className="pp-strip-row" role="list" aria-label={pick(UI.map)}>
        {shown.map((i) => (
          <span key={STREET[i].id} role="listitem" title={nm(i)}
            aria-label={nm(i) + ' — ' + pick(houseLit(store, i) ? UI.works : UI.off) + (i === cur ? ', ' + pick(UI.now) : '')}>
            <Clipping i={i} lit={houseLit(store, i)} cur={i === cur} size="s" pop={pop && i === cur} />
          </span>
        ))}
      </div>
      {mini ? null : (
        <span className="pp-strip-cap"><b>{pick(fillL(UI.houseOf, { n: cur + 1 }))}</b><span>{nm(cur)}</span></span>
      )}
    </div>
  );
}

// Большая улица — на вступлении и в финале: дома стоят на бумажной мостовой.
// whole — улица до ветра (хук): все дома целые; blown — ветер только что
// прошёл: с домов слетают бумажки-вывески.
function StreetMap({ glow, whole, blown }) {
  const pick = usePick();
  const store = useStore();
  return (
    <div className={'pp-street kz-piece' + (glow ? ' is-glow' : '') + (blown ? ' is-blown' : '')} role="list" aria-label={pick(UI.map)}>
      <Cut c="#D9BC8C" seed={120} n={20} amp={6} asp={6} cls="pp-road pp-board" />
      {STREET.map((s, i) => {
        const lit = houseLit(store, i);
        return (
          <span key={s.id} role="listitem" className="pp-street-h" style={{ '--dl': (glow ? 0.15 + i * 0.12 : i * 0.06) + 's', '--i': i }}
            aria-label={houseName(store, i, pick) + ' — ' + pick(lit || (whole && i !== HOME) ? UI.works : UI.off)}>
            <Clipping i={i} lit={lit} whole={whole} name={houseName(store, i, pick)} size="l" />
            {blown && i !== HOME ? <Cut c="var(--kz-piece)" seed={140 + i} n={5} amp={10} asp={2.6} cls="pp-scrap" /> : null}
          </span>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// НАГЛЯДНАЯ ПОМОЩЬ — видна сразу, подписана названиями тегов.
// ─────────────────────────────────────────────────────────────────────────────
// Вырезка «как должно быть» (t3): предложение с жирным и наклонным словом.
function TargetCard({ parts }) {
  const pick = usePick();
  return (
    <div className="pp-target kz-piece">
      <span className="pp-target-h">{pick(UI.target)}</span>
      <span className="pp-target-s">{parts.map((x, k) => (typeof x === 'string' ? <React.Fragment key={k}>{x}</React.Fragment>
        : x.b !== undefined ? <b key={k}>{x.b}</b> : <i key={k}>{x.i}</i>))}</span>
    </div>
  );
}
// Сколько ещё испорченных тегов (t4): живой счётчик — условие видно.
function FixLeft({ n }) {
  const pick = usePick();
  return (
    <div className={'pp-left kz-piece' + (n ? '' : ' is-ok')} aria-live="polite">
      {n ? pick(fillL(UI.left, { n })) : <><Icon name="check" size={13} />{pick(UI.allFixed)}</>}
    </div>
  );
}
// Что должно быть в своей статье (t5) — галочки загораются по ходу набора.
function Checklist({ items }) {
  const pick = usePick();
  return (
    <div className="pp-check kz-piece">
      {items.map((it) => (
        <span key={it.k} className={'pp-check-i' + (it.ok ? ' is-ok' : '')}>
          <span className="pp-check-box">{it.ok ? <Icon name="check" size={11} /> : null}</span>{pick(it.text)}
        </span>
      ))}
    </div>
  );
}

// Подписи ступеней подсказки: направление → место или правило → образец.
const HINT_STEP = [
  L3('Yo‘nalish', 'Направление', 'Where to look'),
  L3('Joy va qoida', 'Место и правило', 'Place and rule'),
  L3('Deyarli javob', 'Почти ответ', 'Almost there')
];

// Одна заметка под работой — бумажный листок: разбор проверки, ступень
// подсказки (с образцом на третьей) или похвала.
function TaskNote({ note, extra }) {
  const pick = usePick();
  if (!note || !note.text) return null;
  const kind = note.kind === 'hint' ? 'hint' : note.kind === 'ok' ? 'ok' : 'fb';
  return (
    <div className={'note-one pp-note is-' + kind + ' kz-piece'} key={kind + note.n} aria-live="polite">
      <span className="pp-note-lbl">
        {kind === 'hint' ? <><Icon name="bulb" size={13} />{pick(HINT_STEP[note.level - 1])}<span className="pp-note-step">{note.level}/3</span></>
          : kind === 'ok' ? <><Icon name="check" size={13} />{pick(UI.ok)}</>
            : <>{pick(UI.fb)}{note.sub ? <span className="pp-note-sub">{pick(UI.incomplete)}</span> : null}</>}
      </span>
      {kind === 'hint' && note.fb ? <div className="pp-note-fb">{pick(note.fb)}</div> : null}
      <div className="pp-note-body">{pick(note.text)}</div>
      {kind === 'hint' && note.level === 3 && extra ? <div className="pp-note-extra">{extra}</div> : null}
    </div>
  );
}

// Кнопки < / > для телефона. Нажатие не забирает фокус у поля: символ встаёт
// в место курсора, клавиатура остаётся открытой.
function SymKeys({ inputRef }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="pp-sym" role="group" aria-label={pick(UI.keys)} translate="no">
      {['<', '/', '>'].map((k) => (
        <button key={k} type="button" className="pp-key" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { insertAtCaret(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
    </div>
  );
}

// Подпись задания в шапке: «Задание 2 · Почта».
const taskEyebrow = (num, house) => {
  const head = fillL(UI.task, { n: num });
  const out = {};
  LANGS.forEach((l) => { out[l] = head[l] + ' · ' + STREET[house - 1].name[l]; });
  return out;
};

// =============================================================================
// ЗАДАНИЕ — общий ход
//
// Запись задания в сторе (tN): st — то, что написал ученик; checks — число
// проверок; hint — сколько ступеней подсказки открыто; note — заметка под
// работой; solved — дом на улице горит; done — можно идти дальше (после
// дополнительной задачи, если она была); drill — дополнительная задача.
// Всё живёт в сторе урока, поэтому «Назад» и возврат ничего не теряют, а
// «Повторить» (SCREEN_RESET) стирает только текущее задание.
// =============================================================================
// Со скольких неудачных проверок подряд подсказка приходит сама.
const AUTO_HINT_AFTER = 2;

function useTask(cfg) {
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => {
    const saved = store.get(cfg.id);
    return saved && saved.st ? saved
      : { st: cfg.init(), solved: false, done: false, checks: 0, hint: 0, note: null, drill: null, n: 0 };
  });
  const ref = useRef(rec);
  const put = useCallback((patch) => {
    const v = Object.assign({}, ref.current, patch);
    ref.current = v;
    store.set(cfg.id, v);
    setRec(v);
    return v;
  }, [cfg.id, store]);

  const drilling0 = !!(rec.drill && !rec.drill.done);
  const [speaker, , spoken, sayNow] = useVoice(rec.done ? [{ text: cfg.C.done, pose: 'smile' }]
    : [{ text: drilling0 ? C.drill.say : cfg.C.say, pose: 'point' }]);
  const canGo = useAdvanceGate(rec.done, spoken);
  const [fresh, setFresh] = useState(false);
  const [flash, setFlash] = useState(0);

  // Строка журнала: попытка — это проверка по кнопке, а не нажатие клавиши.
  const row = (v) => log({
    screenId: cfg.id, type: cfg.kind, correct: !!v.solved, firstTry: !!v.firstTry,
    attempts: v.checks, hintMax: v.hint,
    drill: v.drill ? { done: !!v.drill.done, attempts: v.drill.checks } : null
  });

  const setSt = useCallback((st) => { put({ st }); }, [put]);
  const setDrillSt = useCallback((st) => { put({ drill: Object.assign({}, ref.current.drill, { st }) }); }, [put]);

  // Следующая ступень подсказки: что записать в rec и что показать.
  const nextHint = (cur) => {
    const lv = Math.min(3, cur.hint + 1);
    const h = cfg.hint(lv, cur.st);
    return { lv, h, patch: { hint: lv, hcat: lv === 3 ? (h.cat || cur.hcat || null) : cur.hcat } };
  };

  // ПОДСКАЗКА ПОСЛЕ НЕУДАЧ (заказчик, 15.10.2026). Каждая неудачная проверка
  // сначала называет, что не так. Начиная со второй неудачи подряд к этому
  // сразу добавляется следующая ступень подсказки. Одна реплика на всё.
  const check = () => {
    const cur = ref.current;
    const r = cfg.check(cur.st);
    const checks = cur.checks + 1;
    const n = cur.n + 1;
    if (!r.ok) {
      sfx('soft', true);
      const fails = (cur.fails || 0) + 1;
      if (fails >= AUTO_HINT_AFTER && cur.hint < 3) {
        const { lv, h, patch } = nextHint(cur);
        const v = put(Object.assign({ checks, n, fails, lastOk: false, shake: n,
          note: { kind: 'hint', level: lv, text: h.text, fb: r.msg, n } }, patch));
        row(v);
        sayNow(joinL(r.msg, h.text), 'think');
        return;
      }
      const v = put({ checks, n, fails, lastOk: false, shake: n, note: { kind: 'fb', text: r.msg, n, sub: !!r.sub } });
      row(v);
      sayNow(r.msg, 'think');
      return;
    }
    const was = cur.solved;
    // Решил после образца третьей ступени — короткая задача с новым содержимым.
    const needDrill = !was && !!cfg.drill && cur.hint >= 3;
    const say = needDrill ? joinL(cfg.C.praise, C.drill.say) : cfg.C.praise;
    let drill = cur.drill;
    if (needDrill) {
      const d = cfg.drill.make(cur.hcat || null);
      drill = { cat: cur.hcat || null, st: d.init(), checks: 0, done: false, note: null };
    }
    const v = put({
      checks, n, fails: 0, solved: true, lastOk: true, firstTry: was ? cur.firstTry : checks === 1,
      done: !needDrill, result: r.result || null, drill, note: { kind: 'ok', text: say, n }
    });
    if (cfg.onSolved) cfg.onSolved(r);
    sfx(was ? 'ok' : 'win', true);
    if (!was) setFresh(true);
    setFlash((k) => k + 1);
    row(v);
    sayNow(say, 'smile');
  };

  const checkDrill = () => {
    const cur = ref.current;
    const d = cur.drill;
    if (!d || d.done) return;
    const dc = cfg.drill.make(d.cat);
    const r = dc.check(d.st);
    const checks = d.checks + 1;
    const n = cur.n + 1;
    if (!r.ok) {
      sfx('soft', true);
      const v = put({ n, shake: n, drill: Object.assign({}, d, { checks, note: { kind: 'fb', text: r.msg, n, sub: !!r.sub } }) });
      row(v);
      sayNow(r.msg, 'think');
      return;
    }
    sfx('ok', true);
    const v = put({ n, done: true, drill: Object.assign({}, d, { checks, done: true, note: null }),
      note: { kind: 'ok', text: C.drill.done, n } });
    row(v);
    sayNow(C.drill.done, 'smile');
  };

  // Подсказка по просьбе — лампочкой в шапке (её реплику канон произносит
  // сам — здесь только ступень в заметке).
  const openHint = () => {
    const cur = ref.current;
    if (cur.solved) return;
    const { lv, h, patch } = nextHint(cur);
    const n = cur.n + 1;
    const v = put(Object.assign({ n, note: { kind: 'hint', level: lv, text: h.text, n } }, patch));
    row(v);
  };
  const openRef = useRef(openHint);
  openRef.current = openHint;
  useEffect(() => {
    const h = (e) => { const el = e.target; if (el && el.closest && el.closest('.ctl-hint')) openRef.current(); };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, []);

  return { rec, put, setSt, setDrillSt, check, checkDrill, openHint, speaker, canGo, fresh, flash, say: sayNow };
}

// ─────────────────────────────────────────────────────────────────────────────
// ВЫБОР МЕСТА (t6): код — неподвижные строки, между ними — места-щели. Нажатое
// верное место раскрывается в строку ввода (дальше обычный редактор), неверное
// трясётся, и проверка называет причину. Полоски вложенности видны сразу:
// незакрытая часть — пунктиром.
// ─────────────────────────────────────────────────────────────────────────────
function GapPick({ lines, gaps, onPick, led, miss }) {
  const pick = usePick();
  const regs = regionsOf(lines.join('\n'));
  const bars = (i) => regs.filter((r) => r.from <= i && i <= r.to).map((r, k) => (
    <span key={k} aria-hidden="true" className={'ed-bar' + (r.closed ? '' : ' is-open') + (r.from === i ? ' is-first' : '') + (r.to === i ? ' is-last' : '')}
      style={{ '--c': TAGC[r.tag], '--lv': r.depth }} />
  ));
  return (
    <div className="ed pp-gaps" translate="no">
      {lines.map((ln, i) => (
        <React.Fragment key={i}>
          <div className="ed-line is-static"><span className="ed-n" aria-hidden="true">{i + 1}</span>{bars(i)}{ln ? hlLine(ln) : '​'}</div>
          {gaps.indexOf(i) >= 0 ? (
            <button type="button" className={'pp-gap' + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' kz-a-shake' : '')}
              key={'g' + i + (miss && miss.at === i ? ':' + miss.n : '')} onClick={() => onPick(i)} aria-label={pick(UI.gapHere)}>
              <span className="pp-gap-line" aria-hidden="true" />
            </button>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

// Рабочая область: бумажный браузер с наглядной помощью и редактор с
// кнопками. В колонку на телефоне (браузер сверху, редактор — главный), в ряд
// на компьютере.
function Workbench({ spec, st, setSt, inputRef, fx, aids, tools, flash, onPick }) {
  const f = fx || {};
  let title;
  let text;
  let editor;
  if (spec.kind === 'fields') {
    title = st.title;
    text = st.body;
    editor = (
      <FieldDoc title={st.title} body={st.body} editTitle={spec.editTitle !== false} editBody={spec.editBody !== false}
        onTitle={(v) => setSt(Object.assign({}, st, { title: v }))}
        onBody={(v) => setSt(Object.assign({}, st, { body: v }))}
        hl={f.hl} led={f.led} titleRef={inputRef} bodyRef={inputRef} focusBody={!!spec.focusBody} ph={spec.ph} />
    );
  } else if (spec.kind === 'gap' && st.at == null) {
    const pg = renderDoc(spec.lines.join('\n'));
    title = pg.title;
    text = pg.blocks;
    editor = <GapPick lines={spec.lines} gaps={spec.gaps} onPick={onPick} led={f.ledGap} miss={st.miss} />;
  } else {
    const before = spec.kind === 'gap' ? spec.lines.slice(0, st.at + 1) : spec.before;
    const after = spec.kind === 'gap' ? spec.lines.slice(st.at + 1) : spec.after;
    const full = (before || []).concat([st.code]).concat(after || []).join('\n');
    const pg = renderDoc(full);
    title = pg.title;
    text = pg.blocks;
    editor = (
      <CodeEditor value={st.code} onChange={(v) => setSt(Object.assign({}, st, { code: v }))}
        before={before} after={after} single={spec.kind === 'line' || spec.kind === 'gap'} ind={spec.ind}
        regions={spec.bars ? regionsOf(full) : null} markLine={f.markLine} inputRef={inputRef} led={!!f.led} />
    );
  }
  return (
    <div className={'op-work' + (spec.big ? ' is-big' : '')}>
      <div className="op-side">
        <PageView title={title} blocks={spec.kind === 'fields' ? null : text} empty={spec.empty} flash={flash} hl={f.hl} />
        {aids || null}
      </div>
      <div className="op-main">
        <Pad cls={'pp-edpad' + (spec.big ? ' is-big' : '')}>{editor}</Pad>
        {tools}
      </div>
    </div>
  );
}

// =============================================================================
// КАРКАС ЭКРАНА ПРАКТИКИ — БЕЗ КОДИ И БЕЗ ТЕКСТА РЕПЛИК
// =============================================================================
// Коди — как в уроке 1 на телефоне (заказчик, 22.10.2026): голова в кружке в
// шапке рядом с лампочкой (VoiceDot канона): лицо держит эмоцию реплики,
// вокруг бегут волны, пока звучит голос. Текста реплик нет (заказчик,
// 14–15.10.2026): пузырь героя смонтирован, но спрятан — он ведёт озвучку и
// зовёт onSpoken. Телефон: Коди и лампочка слева, три дома улицы по центру,
// пауза и счётчик справа. Содержимое — на бумажном листе урока 1.
const PStage = ({ children, eyebrow, screen, total, nav, speaker, done, hint, top }) => {
  const pick = usePick();
  const speaking = useSayBusy();
  useEffect(() => { _hintText = hint || null; return () => { _hintText = null; }; }, [hint]);
  const line = speaker ? pick(speaker.text) : '';
  const idle = useIdleCoach(!!nav, speaking);
  const voiceDot = speaker ? <VoiceDot pose={speaker.pose} /> : null;
  return (
    <div className={'stage p-stage' + (speaking ? ' is-speaking' : '') + (idle ? ' is-idle is-idle-' + idle : '')}>
      <div className="stage-header">
        <div className="limit">
          <div className="progress-track">
            <div className="progress-bar" style={{ width: ((screen + 1) / total) * 100 + '%' }} />
          </div>
          <div className="chrome">
            <div className="eyebrow"><span className="dot" />{pick(eyebrow)}</div>
            <span className="p-voice-l">{line ? voiceDot : null}{nav && <HintChromeBtn />}</span>
            {top ? <div className="p-top">{top}</div> : null}
            <div className="chrome-side">
              <ExitBtn />
              {line ? <span className="p-voice-r">{voiceDot}</span> : null}
              {nav && <span className="p-voice-r"><HintChromeBtn /></span>}
              {nav && <PauseBtn done={done} />}
              <div className="mono counter">{String(screen + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      </div>
      {speaker && (
        <div className="speaker-wrap p-hidden-hero"><div className="limit"><PersonaBubble {...speaker} /></div></div>
      )}
      <div className="stage-content">
        <div className="limit stack">{children}</div>
      </div>
      {nav && <div className="stage-nav"><div className="limit navrow">{nav}</div></div>}
    </div>
  );
};

// Строка задания — бумажная полоска урока 1 (KzAsk); у дополнительной задачи — ярлычок.
function PAsk({ text, drill }) {
  const pick = usePick();
  return (
    <div className="kz-ask-wrap pp-ask-wrap">
      <p className={'kz-ask pp-ask' + (drill ? ' is-drill' : '')} aria-live="polite">
        {drill ? <span className="pp-drill-tag">{pick(UI.drill)}</span> : null}{pick(text)}
      </p>
    </div>
  );
}

function TaskScreen({ p, make }) {
  const pick = usePick();
  const lang = useLang();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store, lang), [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const t = useTask(cfg);
  const rec = t.rec;
  const mainRef = useRef(null);
  const drillRef = useRef(null);
  const drilling = !!(rec.drill && !rec.drill.done);
  const dcfg = drilling ? cfg.drill.make(rec.drill.cat) : null;
  const cur = drilling ? dcfg : cfg;
  const st = drilling ? rec.drill.st : rec.st;
  const spec = cur.spec;
  const typing = spec.kind !== 'fields' && !(spec.kind === 'gap' && st.at == null);
  const stageHint = drilling ? dcfg.order : rec.solved ? cfg.C.done : cfg.hint(Math.min(3, rec.hint + 1), rec.st).text;
  const keep = (e) => e.preventDefault();
  // Нажатое место в задании с выбором места (t6): верное раскрывается в строку
  // ввода, неверное трясётся и называет причину.
  const onPick = (i) => {
    const res = cur.pick(i);
    const n = rec.n + 1;
    const nst = res.ok ? Object.assign({}, st, { at: i, miss: null }) : Object.assign({}, st, { miss: { at: i, n } });
    const note = res.ok ? null : { kind: 'fb', text: res.msg, n };
    if (drilling) t.put({ n, drill: Object.assign({}, rec.drill, { st: nst, note }) });
    else t.put({ n, st: nst, note });
    sfx(res.ok ? 'ok' : 'soft', true);
    t.say(res.ok ? res.say : res.msg, res.ok ? 'point' : 'think');
    if (res.ok) setTimeout(() => { const el = (drilling ? drillRef : mainRef).current; if (el) el.focus(); }, 60);
  };
  const tools = (
    <div className="op-tools kz-piece">
      {typing ? <SymKeys inputRef={drilling ? drillRef : mainRef} /> : null}
      <button type="button" className="pp-go" onMouseDown={keep} onClick={drilling ? t.checkDrill : t.check}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
  const note = drilling ? (rec.drill.note || rec.note) : rec.note;
  const order = drilling ? (dcfg.orderOf ? dcfg.orderOf(st) : dcfg.order) : (cfg.orderOf ? cfg.orderOf(rec.st) : cfg.C.order);
  return (
    <PStage eyebrow={taskEyebrow(cfg.num, cfg.num)} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      top={<StreetStrip mini cur={cfg.num - 1} pop={t.fresh} />}
      hint={stageHint}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!t.canGo} onClick={p.next} /></>}>
      <Sheet cls="pp-sheet">
        <StreetStrip cur={cfg.num - 1} pop={t.fresh} />
        <PAsk text={order} drill={drilling} />
        {cur.orderExtra ? <div className="pp-extra">{typeof cur.orderExtra === 'function' ? cur.orderExtra(rec, st) : cur.orderExtra}</div> : null}
        <Workbench key={drilling ? 'drill' : 'main'} spec={spec} st={st} setSt={drilling ? t.setDrillSt : t.setSt}
          inputRef={drilling ? drillRef : mainRef} fx={!drilling && cfg.fx ? cfg.fx(rec) : (drilling && dcfg.fx ? dcfg.fx(rec.drill) : null)}
          aids={cur.aids ? (typeof cur.aids === 'function' ? cur.aids(rec, st) : cur.aids) : null}
          tools={tools} flash={drilling ? 0 : t.flash} onPick={onPick} />
        <TaskNote note={note} extra={!drilling && cfg.h3 ? cfg.h3(rec) : null} />
      </Sheet>
    </PStage>
  );
}
