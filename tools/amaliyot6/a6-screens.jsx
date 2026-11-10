// =============================================================================
// ПРАКТИКА 6 «Анкеты Коди» (облик «Редактор»), на основе практики 05p (tools/amaliyot5):
//   · разбор кода lexA6 (теги и атрибуты: у input — type и placeholder) / a6Group / a6Form (заголовки, абзацы,
//     form, label с подписью и полем, input) — теги уроков 1–6, одна самая полезная проблема;
//   · честный браузер a6Page / A6Doc / A6Field — как в уроке 6: password — точки, number — только цифры и
//     стрелки, text и незнакомый type — видно, что написано; placeholder — серая подсказка в пустом поле;
//     label — подпись и поле в одну строку; form не видна; то, что набрал посетитель, в коде не появляется;
//   · редактор A6Editor, ряд символов A6Keys, браузер A6Browser с пятью вкладками-картой, ход задания
//     useA6Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–6, у открывающего — attrs), text (v — без крайних
// пробелов, raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A6_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'img', 'form', 'label', 'input'];
const A6_HEAD = /^h[1-6]$/;
const A6_INLINE = { b: 1, i: 1, a: 1 };
const A6_OUTER = { html: 1, head: 1, title: 1 };
const A6_TYPES = ['text', 'password', 'number'];
const a6Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a6Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a6Norm = (s) => a6Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,:]/g, '').replace(/\s+/g, ' ').trim();
function a6Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a6Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A6_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a6Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA6(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a6Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
  while (i < s.length) {
    if (s[i] !== '<') { text += s[i]; i += 1; continue; }
    let j = i + 1;
    while (j < s.length && s[j] !== '>' && s[j] !== '<' && s[j] !== '\n') j += 1;
    const closed = s[j] === '>';
    const raw = s.slice(i, closed ? j + 1 : j).trim();
    const inner = s.slice(i + 1, j).trim();
    flush();
    i = closed ? j + 1 : j;
    if (/^!/.test(inner)) { out.push(/^!doctype\s+html$/i.test(inner) && closed ? { k: 'doc', raw } : { k: 'bad', why: 'unknown', bad: raw }); continue; }
    if (!closed) { out.push({ k: 'bad', why: 'noGt', bad: raw }); continue; }
    if (!inner) { out.push({ k: 'bad', why: 'emptyTag', bad: raw }); continue; }
    if (inner.charAt(0) === '\\') { out.push({ k: 'bad', why: 'backslash', bad: raw }); continue; }
    const close = inner.charAt(0) === '/';
    const body = (close ? inner.slice(1) : inner).trim();
    const nm = /^[^\s=]+/.exec(body);
    const name = (nm ? nm[0] : body).toLowerCase();
    if (A6_KNOWN.indexOf(name) >= 0) {
      const tok = { k: close ? 'close' : 'open', name, raw };
      if (!close) Object.assign(tok, a6Attrs(name, body.slice(name.length)));
      out.push(tok);
      continue;
    }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a6Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Атрибуты открывающего тега (уроки 4–6): у a — href, у img — src и alt, у input — type и placeholder; у других
// тегов атрибутов в курсе ещё нет. attrs — значения (нет атрибута — undefined); attrErr — первая ошибка записи:
// noEq, noQuote, attrTypo (другое имя, например placehoder), attrNone.
const A6_ATTRS = { a: ['href'], img: ['src', 'alt'], input: ['type', 'placeholder'] };
function a6Attrs(name, rest) {
  const attrs = {};
  let attrErr = null;
  const re = /\s*([^\s="']+)(\s*=\s*(?:"([^"]*)("?)|'([^']*)('?)|([^\s"']*)))?/g;
  let m;
  const src = String(rest || '');
  const ok = A6_ATTRS[name] || [];
  while (src.slice(re.lastIndex).trim() && (m = re.exec(src))) {
    if (!m[0]) break;
    const an = m[1].toLowerCase();
    if (!ok.length) { attrErr = attrErr || { why: 'attrNone', tag: name }; continue; }
    if (ok.indexOf(an) < 0) { attrErr = attrErr || { why: 'attrTypo', bad: m[1], tag: name, list: ok.join(', ') }; continue; }
    if (!m[2]) { attrErr = attrErr || { why: 'noEq', attr: an }; attrs[an] = ''; continue; }
    if (m[3] !== undefined) { attrs[an] = m[3].trim(); if (!m[4]) attrErr = attrErr || { why: 'noQuote', attr: an }; continue; }
    if (m[5] !== undefined) { attrs[an] = m[5].trim(); if (!m[6]) attrErr = attrErr || { why: 'noQuote', attr: an }; continue; }
    attrs[an] = (m[7] || '').trim();
    attrErr = attrErr || { why: 'noQuote', attr: an };
  }
  return { attrs, attrErr };
}
// Тег без левого уголка: «label>» или «/form>» внутри текста.
const A6_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|form|label|input)\s*>)/i;
const a6Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a6Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a6Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'open' && t.attrErr) return a6Fb(t.attrErr.why, { bad: t.attrErr.bad || '', tag: t.attrErr.tag || t.name, attr: t.attrErr.attr || '', list: t.attrErr.list || '' });
    if (t.k === 'close' && t.name === 'input') return FB.inputClose;
    if (t.k === 'text') { const m = A6_NOLT.exec(t.v); if (m) return a6Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body (а в заданиях 2–4 — часть form): doctype, html, head, title, body (и form) — уже есть.
function a6Outer(toks, inForm) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A6_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
    if (inForm && (t.k === 'open' || t.k === 'close') && t.name === 'form') return FB.hasForm;
  }
  return null;
}
// Текст вместе с b, i и a внутри него — один кусок { k: 'text', v }. b, i и a закрываются внутри куска.
function a6Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0, a: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', inner: {} }; };
  const end = () => {
    if (!cur) return null;
    if (depth.a > 0) return FB.aOpen;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a6Fb('inlineOpen', { tag: tg });
    cur.v = a6Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A6_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a6Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') { depth[t.name] += 1; cur.inner[t.name] = ''; }
      else {
        if (!depth[t.name]) return { msg: a6Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a6Letters(cur.inner[t.name])) return { msg: a6Fb('inlineEmpty', { tag: t.name }) };
      }
      continue;
    }
    if (t.k === 'text') {
      start();
      cur.v += t.raw;
      ['b', 'i', 'a'].forEach((tg) => { if (depth[tg] > 0) cur.inner[tg] += t.raw; });
      continue;
    }
    const m = end();
    if (m) return { msg: m };
    out.push(t);
  }
  const m = end();
  return m ? { msg: m } : { list: out };
}

// РАЗБОР НА УЗЛЫ: { kind: 'block', tag, text } (заголовок, абзац), { kind: 'form', kids }, { kind: 'label', cap,
// inputs: [attrs], after } (подпись и поля внутри label), { kind: 'input', attrs } (поле без label).
// opts.inForm — код пишется внутри form (form уже есть). Первая проблема — одна фраза { msg }.
function a6Form(src, opts) {
  const o = opts || {};
  const toks = lexA6(src);
  const bad = a6Bad(toks) || a6Outer(toks, o.inForm);
  if (bad) return { msg: bad };
  const g = a6Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  let i = 0;
  const closeOf = (tag, z) => {
    if (z && z.k === 'close' && z.name === tag) return null;
    if (z && z.k === 'open' && z.name === tag) return a6Fb('needSlash', { tag });
    return a6Fb(A6_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  const items = (until) => {
    const out = [];
    while (i < L.length) {
      const t = L[i];
      if (t.k === 'close' && until && t.name === until) { i += 1; return { list: out, closed: true }; }
      if (t.k === 'close') return { msg: a6Fb('closeStray', { got: t.name }) };
      if (t.k === 'text') return { msg: until === 'form' || o.inForm ? FB.needLabel : a6Fb('needOpenText', { tag: 'p' }) };
      if (t.name === 'input') { out.push({ kind: 'input', attrs: t.attrs || {} }); i += 1; continue; }
      if (t.name === 'form') {
        if (until === 'form') return { msg: a6Fb('needSlash', { tag: 'form' }) };
        i += 1;
        const r = items('form');
        if (r.msg) return r;
        if (!r.closed) return { msg: a6Fb('needClose', { tag: 'form' }) };
        out.push({ kind: 'form', kids: r.list });
        continue;
      }
      if (t.name === 'label') {
        i += 1;
        let cap = '', after = '';
        const inputs = [];
        for (;;) {
          const x = L[i];
          if (!x) return { msg: a6Fb('needClose', { tag: 'label' }) };
          if (x.k === 'close' && x.name === 'label') { i += 1; break; }
          if (x.k === 'text') { if (inputs.length) after += ' ' + x.v; else cap += ' ' + x.v; i += 1; continue; }
          if (x.k === 'open' && x.name === 'input') { inputs.push(x.attrs || {}); i += 1; continue; }
          if (x.k === 'open' && x.name === 'label') return { msg: a6Fb('needSlash', { tag: 'label' }) };
          return { msg: a6Fb('needClose', { tag: 'label' }) };
        }
        out.push({ kind: 'label', cap: a6Squash(cap), inputs, after: a6Squash(after) });
        continue;
      }
      if (A6_HEAD.test(t.name) || t.name === 'p') {
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a6Fb('needText', { tag: t.name }) };
        if (!a6Letters(y.v)) return { msg: FB.short };
        const m = closeOf(t.name, L[i + 2]);
        if (m) return { msg: m };
        out.push({ kind: 'block', tag: t.name, text: y.v });
        i += 3;
        continue;
      }
      return { msg: a6Fb('unknown', { bad: '<' + t.name + '>' }) };
    }
    return { list: out, closed: false };
  };
  const r = items(null);
  if (r.msg) return r;
  return { nodes: r.list };
}
// Вид поля: нет type, пустой, незнакомый, не тот. null — всё верно.
function a6TypeIssue(at, want) {
  const a = at || {};
  if (a.type === undefined) return FB.noType;
  const v = a6Squash(a.type).toLowerCase();
  if (!v) return FB.emptyType;
  if (A6_TYPES.indexOf(v) < 0) return fillL(FB.typeNo, { got: a.type });
  if (want && v !== want) return want === 'password' && v === 'text' ? FB.passVisible : fillL(FB.typeOther, { got: v, want });
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроке 6. Окно — блоки { tag: 'h1'…'h6' | 'p' | 'lab' | 'raw', runs }: run — текст
// { t, b, i } или поле { fld: { type, ph, val } }. label — подпись и поле в одну строку; input вне label — на своей
// строке (после блока); form не видна. vals — что набрали посетители, по порядку полей (в коде этого нет).
// ─────────────────────────────────────────────────────────────────────────────
function a6Page(src, vals) {
  const blocks = [];
  let cur = null;
  let hOpen = 0;
  let fi = 0;
  const d = { b: 0, i: 0 };
  const nb = (tag) => { cur = { tag, inh: A6_HEAD.test(tag) ? 0 : hOpen, runs: [] }; blocks.push(cur); };
  lexA6(src).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      const n = t.name;
      if (A6_HEAD.test(n)) {
        if (t.k === 'open') { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); }
        else { hOpen = 0; cur = null; }
        return;
      }
      if (n === 'p' || n === 'label') { if (t.k === 'open') nb(n === 'p' ? 'p' : 'lab'); else if (cur && cur.tag === (n === 'p' ? 'p' : 'lab')) cur = null; return; }
      if (n === 'form') { cur = null; return; }
      if (n === 'input') {
        if (t.k !== 'open') return;   // у input нет закрывающего тега — браузер его не замечает
        const at = t.attrs || {};
        const fld = { type: at.type, ph: at.placeholder, val: vals ? vals[fi] : '' };
        fi += 1;
        if (!cur) nb('raw');
        cur.runs.push({ t: '', fld });
        return;
      }
      if (n === 'b' || n === 'i') d[n] = t.k === 'open' ? d[n] + 1 : Math.max(0, d[n] - 1);
      return;
    }
    let txt = null;
    if (t.k === 'text') txt = t.raw;
    else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
    if (txt == null) return;
    if (!cur) nb('raw');
    cur.runs.push({ t: txt, b: d.b > 0, i: d.i > 0 });
  });
  return { blocks: blocks.filter((bk) => bk.runs.some((r) => r.fld || r.t.trim())) };
}
// Страница всегда помещается в окно целиком (как в уроке 2): не влезает — шрифт ступеньками
// уменьшается, не меньше 56 %. Страница пересоздаётся (например, после «Проверить») — подгонка
// запускается заново: следит за самим узлом.
function useA6Fit(dep) {
  const ref = useRef(null);
  const seen = useRef({ el: null, dep: undefined, ro: null });
  useLayoutEffect(() => {
    const el = ref.current;
    const s = seen.current;
    if (el === s.el && dep === s.dep) return;
    if (s.ro) { s.ro.disconnect(); s.ro = null; }
    s.el = el; s.dep = dep;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page) return;
    const fit = () => {
      let k = 1;
      el.style.fontSize = '';
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.56) { k -= 0.06; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    s.ro = new ResizeObserver(() => fit());
    s.ro.observe(page);
  });
  useEffect(() => () => { if (seen.current.ro) seen.current.ro.disconnect(); }, []);
  return ref;
}
// ПОЛЕ — как рисует Chrome (урок 6). password — точки; number — только цифры и стрелки справа; text и
// незнакомый type — видно, что написано; placeholder — серая подсказка, пока поле пустое.
function A6Field({ type, ph, val, cls }) {
  const t = a6Squash(type).toLowerCase() || 'text';
  let v = String(val || '');
  if (t === 'number') v = v.replace(/\D/g, '');
  const shown = t === 'password' ? '•'.repeat(v.length) : v;
  return (
    <span className={'a6-in' + (t === 'number' ? ' is-num' : '') + (t === 'password' ? ' is-pass' : '') + (cls ? ' ' + cls : '')}>
      {v ? <span className="a6-in-v">{shown}</span> : ph ? <span className="a6-in-ph">{ph}</span> : <span className="a6-in-v">{' '}</span>}
      {t === 'number' ? <i className="a6-spin" aria-hidden="true" /> : null}
    </span>
  );
}
function A6Doc({ blocks, flash }) {
  const ref = useA6Fit(JSON.stringify(blocks));
  if (!blocks || !blocks.length) return null;
  const runs = (rs) => rs.map((r, j) => {
    if (r.fld) return <A6Field key={j} {...r.fld} />;
    const c = ((r.b ? 'a6-wb' : '') + (r.i ? ' a6-wi' : '')).trim() || undefined;
    return <span key={j} className={c}>{r.t}</span>;
  });
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a6-doc' + (flash ? ' a6-in-a' : '')}>
      {blocks.map((bk, i) => <div key={i} className={'a6-blk a6-' + bk.tag + (bk.inh ? ' a6-inh' + bk.inh : '')}>{runs(bk.runs)}</div>)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a6Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a6-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a6-t">{p}</span>;
    return (
      <span key={i} className="a6-g">
        <span className="a6-b">{'<' + m[1]}</span><span className="a6-n">{m[2]}</span>
        {m[3] ? <span className="a6-a">{m[3]}</span> : null}<span className="a6-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a6Insert(el, ch) {
  if (!el) return;
  el.focus();
  const a = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
  const b = typeof el.selectionEnd === 'number' ? el.selectionEnd : el.value.length;
  if (el.setRangeText) el.setRangeText(ch, a, b, 'end');
  else {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
    setter.call(el, el.value.slice(0, a) + ch + el.value.slice(b));
    el.setSelectionRange(a + ch.length, a + ch.length);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

// ─────────────────────────────────────────────────────────────────────────────
// РЕДАКТОР КОДА (каркас 01p). Рамка — тёмный редактор урока (.kz-code: вкладка index.html, фон
// VS Code); строки — свои (номер слева), чтобы перенос строки совпадал у подсветки и
// у прозрачной textarea над ней. before / after — неизменяемые строки задания; single —
// одна строка (Enter не переносит); big — во всё свободное место (свой список).
// ─────────────────────────────────────────────────────────────────────────────
const A6_MAX = 1200;
function A6Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a6-edit');
    if (!box || !ed || box.scrollHeight <= box.clientHeight + 2) return;
    const top = ed.offsetTop, bot = top + ed.offsetHeight;
    if (top < box.scrollTop + 4 || bot > box.scrollTop + box.clientHeight - 4) box.scrollTop = Math.max(0, Math.min(top - 8, bot - box.clientHeight + 8));
  }, []);
  useLayoutEffect(() => { reveal(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const vv = typeof window !== 'undefined' && window.visualViewport;
    const on = () => { if (inputRef && inputRef.current && document.activeElement === inputRef.current) setTimeout(reveal, 60); };
    if (vv) vv.addEventListener('resize', on);
    window.addEventListener('resize', on);
    return () => { if (vv) vv.removeEventListener('resize', on); window.removeEventListener('resize', on); };
  }, [reveal]); // eslint-disable-line react-hooks/exhaustive-deps
  const row = (txt, n, key, cls) => (
    <div key={key} className={'a6-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a6Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a6-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a6-edit' + (led ? ' is-led' : '')}>
        <div className="a6-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a6-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A6_MAX)); }}
          onFocus={() => { setTimeout(reveal, 80); setTimeout(reveal, 420); }}
          onKeyDown={(e) => { if (single && e.key === 'Enter') { e.preventDefault(); if (onEnter) onEnter(); } }}
          spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
          enterKeyHint={single ? 'done' : 'enter'} aria-label={pick(label || UI.editor)} />
      </div>
      {(after || []).map((t, i) => row(t, nB + lines.length + i + 1, 'a' + i, 'is-static'))}
    </div>
  );
}

// Статичный код (образец подсказки, код готовой страницы) — в той же рамке.
function A6Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a6-ed a6-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a6-ln a6-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a6-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a6Hl(t) : '​'}</button>
      ) : <div key={i} className={'a6-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a6Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A6Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a6-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a6Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР С ПЯТЬЮ ВКЛАДКАМИ — браузер урока (PaperBrowser), вкладки — пять анкет кружков (карта).
// tabs: [{ st: 'ok' | 'off', name, ico, c }]; cur — открытая вкладка, title — её название
// сейчас. Сломанная анкета — серый значок «!», починенная — цветной.
// ─────────────────────────────────────────────────────────────────────────────
const A6_ICO = {
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4z" /></>,
  crown: <path d="M4 19h16M5 16.5 3.8 7.5l5 3.8L12 5l3.2 6.3 5-3.8-1.2 9z" />,
  gear: <><circle cx="12" cy="12" r="3.4" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const A6Fav = ({ ico, c, off }) => (
  <i className={'a6-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A6_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A6Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl, url, onBack }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a6-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a6-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a6-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a6-pop' : '')}>
            <A6Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a6-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A6Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a6-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn a6-back" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
        <span className="kz-br-url"><i className="kz-br-lock" aria-hidden="true" /><span className="kz-br-url-t">{url || 'index.html'}</span></span>
      </div>
      <div className="kz-br-body">
        <Cut c={KZ.cream} seed={32} n={16} amp={1.1} asp={1.6} cls="kz-br-paper" />
        <div className="kz-br-page">{children}</div>
      </div>
    </div>
  );
}

// Вкладки по стору: решённые задания — горят. all — горят все (крючок до сбоя, вывод).
function useA6Tabs(all) {
  const store = useStore();
  const pick = usePick();
  return TABS.map((tb, i) => {
    const rec = store.get('t' + (i + 1));
    const lit = all || !!(rec && rec.solved);
    return { st: lit ? 'ok' : 'off', name: pick(tb.name), ico: tb.ico, c: tb.c };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// НАГЛЯДНАЯ ПОМОЩЬ — видна сразу, подписи — названия тегов и частей.
// ─────────────────────────────────────────────────────────────────────────────
// Части строки по порядку — кодом, как в редакторе.
function A6Parts({ parts }) {
  const pick = usePick();
  return (
    <div className="a6-slots" translate="no">
      {parts.map((x, n) => (
        <span key={n} className="a6-slot" style={{ '--pc': 'var(--r-html)' }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(x.word)}</em>}
        </span>
      ))}
    </div>
  );
}
// Виды полей (урок 6): значение type и как выглядит поле.
function A6Types() {
  const pick = usePick();
  return (
    <div className="a6-files a6-types" translate="no">
      <span className="a6-files-l">{pick(UI.types)}:</span>
      <span className="a6-ty"><code>text</code><A6Field type="text" val="Ali" cls="is-mini" /></span>
      <span className="a6-ty"><code>password</code><A6Field type="password" val="kodi" cls="is-mini" /></span>
      <span className="a6-ty"><code>number</code><A6Field type="number" val="12" cls="is-mini" /></span>
    </div>
  );
}
// Схема своей анкеты: body уже есть; h1, form и два label — пишет ученик.
function A6Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a6-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a6-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a6-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a6-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a6-tree" translate="no">
      {row('', 'body', 'var(--r-body)', UI.given, true)}
      {row('├─ ', 'h1', 'var(--r-html)', UI.bpH1, D.h1)}
      {row('└─ ', 'form', 'var(--r-head)', UI.bpForm, D.form)}
      {row('   ├─ ', 'label', 'var(--r-html)', UI.bpText, D.text)}
      {row('   └─ ', 'label', 'var(--r-html)', UI.bpPass, D.pass)}
    </div>
  );
}
// Образец третьей ступени — под редактором, с другим содержимым.
// Образец третьей ступени сам подъезжает в видимую часть экрана — над панелью подсказки (10.11.2026: на ноутбуке
// и в столбик образец уходил за низ окна, страница не прокручивалась, ученик уменьшал масштаб до 80 %).
function useRevealSample(ref) {
  useEffect(() => {
    const go = () => {
      const el = ref.current;
      const sc = el && el.closest('.stage-content');
      if (!sc) return;
      const sh = document.querySelector('.b-sheet:not(.is-ok)');
      const lim = sh ? Math.min(sh.getBoundingClientRect().top, window.innerHeight) : window.innerHeight;
      const r = el.getBoundingClientRect(), top0 = sc.getBoundingClientRect().top;
      if (r.bottom > lim - 8) sc.scrollTop += Math.max(0, Math.min(r.bottom - lim + 12, r.top - top0 - 8));
    };
    const t1 = setTimeout(go, 150), t2 = setTimeout(go, 550);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
const A6Sample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="a6-sample">
      <span className="a6-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A6Code lines={lines} cls="a6-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A6_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA6Task(cfg) {
  const store = useStore();
  const log = useLog();
  const [rec0] = useState(() => store.get(cfg.id) || { st: cfg.init(), checks: 0, fails: 0, lv: 0, solved: false, done: false, drill: null });
  const [rec, setRec] = useState(rec0);
  const ref = useRef(rec0);
  const put = useCallback((patch) => {
    const v = Object.assign({}, ref.current, patch);
    ref.current = v; store.set(cfg.id, v); setRec(v);
    return v;
  }, [cfg.id, store]);
  const drilling = !!(rec.drill && !rec.drill.done);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec.done ? cfg.C.ok : drilling ? C.drill.say : cfg.C.say, pose: rec.done ? 'smile' : 'point' }]);
  const canGo = useAdvanceGate(rec.done, spoken);
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(0);
  useTipClears(setMsg);
  // Лампочка в шапке — следующая ступень (пока задание не решено).
  const pulse = useHintPulse();
  const p0 = useRef(pulse);
  useEffect(() => {
    if (pulse === p0.current) return;
    p0.current = pulse;
    const cur = ref.current;
    if (cur.solved || cur.lv >= 3) return;
    const v = put({ lv: cur.lv + 1 });
    row(v);
  }, [pulse]); // eslint-disable-line react-hooks/exhaustive-deps
  const row = (v) => log({ screenId: cfg.id, type: cfg.kind, correct: !!v.solved, firstTry: !!v.first, attempts: v.checks, hintMax: v.lv,
    drill: v.drill ? { done: !!v.drill.done, attempts: v.drill.checks } : null });
  const setSt = (st) => { setMsg(null); put({ st }); };
  const setDrillSt = (st) => { setMsg(null); put({ drill: Object.assign({}, ref.current.drill, { st }) }); };
  // Неудача: причина; со второй подряд — ещё и следующая ступень подсказки.
  const fail = (m) => {
    sfx('soft', true);
    const cur = ref.current;
    const fails = (cur.fails || 0) + 1;
    if (fails >= A6_AUTO_HINT && cur.lv < 3 && !cur.solved) {
      const lv = cur.lv + 1;
      const h = cfg.C.hints[lv - 1];
      const v = put({ fails, lv });
      row(v);
      setMsg(joinL(m, h));
      sayNow(joinL(m, h), 'think');
      return;
    }
    put({ fails });
    setMsg(m);
    sayNow(m, 'think');
  };
  const check = () => {
    const cur = ref.current;
    if (cur.drill && !cur.drill.done) {
      const r = cfg.drill.check(cur.drill.st);
      const d = Object.assign({}, cur.drill, { checks: cur.drill.checks + 1 });
      if (!r.ok) { put({ drill: d }); fail(r.msg); return; }
      sfx('ok', true); setMsg(null); setFlash((k) => k + 1);
      const v = put({ drill: Object.assign(d, { done: true }), done: true, fails: 0 });
      row(v);
      sayNow(C.drill.done, 'smile');
      return;
    }
    if (cur.solved) return;
    const r = cfg.check(cur.st);
    const checks = cur.checks + 1;
    if (!r.ok) { put({ checks }); fail(r.msg); return; }
    // Решено после образца третьей ступени — короткая задача с новым содержимым.
    const needDrill = !!cfg.drill && cur.lv >= 3;
    const v = put({ checks, fails: 0, solved: true, first: checks === 1 && cur.lv === 0, done: !needDrill, result: r.result || null,
      drill: needDrill ? { st: cfg.drill.init(), checks: 0, done: false } : null });
    if (cfg.onSolved) cfg.onSolved(r);
    sfx('win', true); setMsg(null); setFlash((k) => k + 1);
    row(v);
    sayNow(needDrill ? joinL(cfg.C.ok, C.drill.say) : cfg.C.ok, 'smile');
  };
  return { rec, put, setSt, setDrillSt, check, fail, msg, setMsg, speaker, sayNow, canGo, flash, drilling };
}

// Экран задания: строка задания (KzAsk → панели рамки), браузер с вкладками, помощь,
// редактор, ряд кнопок. Вид — от cfg.view(st, ctx) → { title, blocks, editor, aid, keys }.
// ПЕРЕКЛЮЧАТЕЛЬ «Kod / Natija» НА ТЕЛЕФОНЕ (заказчик, 10.11.2026: «где чуть больше кода — toggle кода и результата,
// чтобы результат и код друг другу не мешали»). Где кода больше, окно
// браузера и код — по очереди. Переключатель появляется, когда в редакторе от 7 строк (и уже не исчезает).
// Верный ответ показывает результат; ошибка, подсказка, дополнительная задача — код.
// На ноутбуке и планшете видно то и другое — переключателя нет (CSS).
const VT_OPTS = [{ v: 'code', label: L3("Kod", 'Код', 'Code') }, { v: 'result', label: L3("Natija", 'Результат', 'Result') }];
function useViewToggle(num, workRef, lineSel, done, drilling, msg, lv) {
  const [many, setMany] = useState(false);
  const [view, setView] = useState(done ? 'result' : 'code');
  useLayoutEffect(() => { const el = workRef.current; if (!many && el && el.querySelectorAll(lineSel).length >= 7) setMany(true); });
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setView(done ? 'result' : 'code'); }, [done, drilling]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (msg || lv > 0) setView('code'); }, [msg, lv]);
  return { many, view, setView };
}
const ViewToggle = ({ vt }) => (vt.many ? <div className="vt-row"><SegToggle value={vt.view} onChange={vt.setView} options={VT_OPTS} /></div> : null);

function A6TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA6Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA6Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.a6-main .a6-ln', rec.done, drilling, t.msg, lv);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a6-sheet a6-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'a6-work' + (v.big ? ' is-big' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')}>
          <div className="a6-side">
            <A6Browser tabs={tabs} cur={cfg.num - 1} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}
              url={v.url || TABS[cfg.num - 1].file}>
              <A6Doc blocks={v.blocks} flash={t.flash} />
            </A6Browser>
            {v.aid || null}
          </div>
          <div className="a6-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A6Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A6Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ. Анкета кружка: заголовок, form и label с подписью и полем. vals — что набрали посетители.
// ─────────────────────────────────────────────────────────────────────────────
const A6_DOC = '<!DOCTYPE html>';
const a6Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);
const a6At = (n, v) => (v == null ? '' : ' ' + n + '="' + v + '"');
const a6Input = (type, ph) => '<input' + a6At('type', type) + a6At('placeholder', ph) + '>';
const a6Label = (cap, inner) => '<label>' + cap + ' ' + inner + '</label>';
const a6Parts = (code, key) => <React.Fragment key={key}>{a6Hl(code)}</React.Fragment>;

// Т1 · поле в строке: вид поля в пустом type (пароль виден всем). d — страница: клуб, подпись, что набрал посетитель.
const A6_T1 = { club: 'futbol', cap: 'pass', val: VIS.pass, want: 'password' };
const A6_T1X = { club: 'suzish', cap: 'age', val: VIS.age, want: 'number' };
function a6FieldCheck(v, want) {
  const s = a6Squash(v).toLowerCase();
  if (!s) return { ok: false, msg: FB.emptyType };
  if (/[<>"'=]/.test(s)) return { ok: false, msg: UI.noTags };
  if (A6_TYPES.indexOf(s) < 0) return { ok: false, msg: fillL(FB.typeNo, { got: a6Squash(v) }) };
  if (s !== want) return { ok: false, msg: want === 'password' && s === 'text' ? FB.passVisible : fillL(FB.typeOther, { got: s, want }) };
  return { ok: true };
}
function a6FieldView(d) {
  return (st, x) => {
    const v = st.v || '';
    const club = x.pick(CLUB[d.club]);
    const capN = x.pick(CAP.name), cap = x.pick(CAP[d.cap]);
    const lines = [
      { k: 'h1', parts: [T_('h1'), W_(club), T_('h1', true)] },
      { k: 'fo', parts: [T_('form')] },
      { k: 'l1', d: 1, parts: [T_('label'), W_(capN + ' '), a6Parts(a6Input('text'), 'i'), T_('label', true)] },
      { k: 'l2', d: 1, parts: [T_('label'), W_(cap)] },
      { k: 'l2i', d: 2, cls: x.solved ? 'is-new' : 'is-hl', parts: [
        <span key="ah" className="a6-g"><span className="a6-b">&lt;</span><span className="a6-n">input</span><span className="a6-a"> type="</span></span>,
        x.solved ? <span key="v" className="a6-a">{v}</span> : (
          <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
            <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={20}
              onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a6-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
          </span>),
        <span key="az" className="a6-g"><span className="a6-a">"</span><span className="a6-b">&gt;</span></span>
      ] },
      { k: 'l2c', d: 1, parts: [T_('label', true)] },
      { k: 'fc', parts: [T_('form', true)] }
    ];
    const code = '<h1>' + club + '</h1><form>' + a6Label(capN, a6Input('text')) + a6Label(cap, a6Input(v)) + '</form>';
    return {
      title: club, url: d.club + '.html', blocks: a6Page(code, [VIS.name, d.val]).blocks,
      aid: <A6Types />,
      editor: <div className="a6-fieldwrap"><KzCode cls="a6-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = () => ({
  id: 't1', num: 1, kind: 'write-type', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a6FieldCheck(st.v, A6_T1.want),
  view: a6FieldView(A6_T1),
  sample: (pk) => [a6Label(pk(CAP.age), a6Input('number'))],
  drill: { init: () => ({ v: '' }), check: (st) => a6FieldCheck(st.v, A6_T1X.want), view: a6FieldView(A6_T1X) }
});

// Т2 · строка: <input type="…" placeholder="…"> целиком внутри label (input не закрывается).
function a6LineCheck(code, wantType, wantPh) {
  const toks = lexA6(code);
  const bad = a6Bad(toks) || a6Outer(toks, true);
  if (bad) return { ok: false, msg: bad };
  const ins = toks.filter((t) => t.k === 'open' && t.name === 'input');
  const other = toks.find((t) => !(t.k === 'open' && t.name === 'input'));
  if (!ins.length) {
    if (other && (other.k === 'open' || other.k === 'close')) return { ok: false, msg: a6Fb('wrongOpen', { tag: 'input', got: other.name }) };
    return { ok: false, msg: toks.length ? FB.needInput : FB.empty };
  }
  if (ins.length > 1) return { ok: false, msg: FB.oneInput };
  if (other) return { ok: false, msg: a6Fb('extra', { got: other.k === 'text' ? other.v : other.raw }) };
  const at = ins[0].attrs || {};
  const m = a6TypeIssue(at, wantType);
  if (m) return { ok: false, msg: m };
  if (at.placeholder === undefined) return { ok: false, msg: FB.noPh };
  if (a6Norm(at.placeholder) !== a6Norm(wantPh)) return { ok: false, msg: fillL(FB.phOther, { want: wantPh }) };
  return { ok: true };
}
const A6_T2 = { club: 'shaxmat', cap: 'name', type: 'text', ph: 'name' };
const A6_T2X = { club: 'musiqa', cap: 'age', type: 'number', ph: 'age' };
function a6LineView(d) {
  return (st, x) => {
    const club = x.pick(CLUB[d.club]);
    const before = ['<body>', '  <h1>' + club + '</h1>', '  <form>', '    <label>' + x.pick(CAP[d.cap])];
    const after = ['    </label>', '  </form>', '</body>'];
    return {
      title: club, url: d.club + '.html', blocks: a6Page(before.concat([st.code], after).join('\n')).blocks,
      aid: <A6Parts parts={[{ code: '<input' }, { code: 'type="…"' }, { code: 'placeholder="…"' }, { code: '>' }]} />,
      editor: <A6Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-input', C: C.t2,
  init: () => ({ code: '      ' }),
  check: (st) => a6LineCheck(st.code, A6_T2.type, pick(PH[A6_T2.ph])),
  view: a6LineView(A6_T2),
  sample: (pk) => [a6Input('text', pk(PH.game))],
  drill: { init: () => ({ code: '      ' }), check: (st) => a6LineCheck(st.code, A6_T2X.type, pick(PH[A6_T2X.ph])), view: a6LineView(A6_T2X) }
});

// Т3 · блок: label с подписью и полем внутри (подпись и поле — в одну строку, нажатие на подпись выбирает поле).
function a6LabelCheck(code, wantCap, wantType) {
  const r = a6Form(code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind === 'input') return { ok: false, msg: FB.needLabel };
  if (f.kind === 'block') return { ok: false, msg: f.tag === 'p' ? FB.capInP : a6Fb('wrongOpen', { tag: 'label', got: f.tag }) };
  if (f.kind !== 'label') return { ok: false, msg: FB.needLabel };
  if (!f.inputs.length) return { ok: false, msg: N[1] && N[1].kind === 'input' ? FB.inputOut : FB.labelNoInput };
  if (!a6Letters(f.cap)) return { ok: false, msg: FB.labelNoCap };
  if (a6Norm(f.cap) !== a6Norm(wantCap)) return { ok: false, msg: fillL(FB.capOther, { want: wantCap }) };
  if (f.inputs.length > 1) return { ok: false, msg: FB.oneInput };
  const m = a6TypeIssue(f.inputs[0], wantType);
  if (m) return { ok: false, msg: m };
  if (N.length > 1) return { ok: false, msg: a6Fb('extra', { got: N[1].kind === 'block' ? '<' + N[1].tag + '>' : '<' + N[1].kind + '>' }) };
  return { ok: true };
}
const A6_T3 = { club: 'robot', cap: 'age', type: 'number' };
const A6_T3X = { club: 'suzish', cap: 'pass', type: 'password' };
function a6LabelView(d) {
  return (st, x) => {
    const club = x.pick(CLUB[d.club]);
    const before = ['<body>', '  <h1>' + club + '</h1>', '  <form>'];
    const after = ['  </form>', '</body>'];
    return {
      title: club, url: d.club + '.html', blocks: a6Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A6Parts parts={[{ code: '<label>' }, { code: x.pick(CAP[d.cap]) }, { code: '<input type="' + d.type + '">' }, { code: '</label>' }]} />,
      editor: <A6Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = (pick) => ({
  id: 't3', num: 3, kind: 'write-label', C: C.t3,
  init: () => ({ code: '    ' }),
  check: (st) => a6LabelCheck(st.code, pick(CAP[A6_T3.cap]), A6_T3.type),
  view: a6LabelView(A6_T3),
  sample: (pk) => [a6Label(pk(CAP.pass), a6Input('password'))],
  drill: { init: () => ({ code: '    ' }), check: (st) => a6LabelCheck(st.code, pick(CAP[A6_T3X.cap]), A6_T3X.type), view: a6LabelView(A6_T3X) }
});

// Т4 · найти строку и исправить: пароль «спрятан» через placeholder, а type — text (загадка урока 6); в
// дополнительной задаче — опечатка в значении type. Видно, что набрал посетитель.
const A6_T4 = { club: 'rasm', bad: (pk) => a6Label(pk(CAP.pass), a6Input('text', pk(PH.pass))), val: VIS.pass2 };
const A6_T4X = { club: 'musiqa', bad: (pk) => a6Label(pk(CAP.pass), a6Input('pasword')), val: 'nota2026' };
function a6FixView(d, C4) {
  return (st, x) => {
    const club = x.pick(CLUB[d.club]);
    const lines = a6Body(['<h1>' + club + '</h1>', '<form>', '  ' + a6Label(x.pick(CAP.name), a6Input('text', x.pick(PH.name))), '  ' + d.bad(x.pick), '</form>']);
    const BAD = 4;
    const vals = ['', d.val];
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => {
          const el = x.inRef.current;
          if (!el) return;
          el.focus();
          const m = /type="([^"]*)"/.exec(el.value);
          if (m) { const a = m.index + 6; el.setSelectionRange(a, a + m[1].length); } else el.setSelectionRange(el.value.length, el.value.length);
        }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i] || C4.why[0]);
    };
    if (st.at == null) {
      return {
        title: club, url: d.club + '.html', blocks: a6Page(lines.join('\n'), vals).blocks, pageHl: true, keys: false, ask: C4.ask,
        editor: <A6Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title: club, url: d.club + '.html', blocks: a6Page(before.concat([st.code], after).join('\n'), vals).blocks, ask: C4.ask2,
      editor: <A6Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a6FixCheck(st, pick) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a6Form(st.code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const f = r.nodes[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind !== 'label') return { ok: false, msg: FB.needLabel };
  if (!f.inputs.length) return { ok: false, msg: FB.labelNoInput };
  if (a6Norm(f.cap) !== a6Norm(pick(CAP.pass))) return { ok: false, msg: FB.keepLine };
  const m = a6TypeIssue(f.inputs[0], 'password');
  if (m) return { ok: false, msg: m };
  if (r.nodes.length > 1) return { ok: false, msg: FB.keepLine };
  return { ok: true };
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a6FixCheck(st, pick),
  view: a6FixView(A6_T4, C.t4),
  sample: (pk) => [a6Label(pk(CAP.pass), a6Input('password', pk(PH.pass)))],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a6FixCheck(st, pick), view: a6FixView(A6_T4X, C.t4) }
});

// Т5 · своя анкета внутри body: h1, form, два label — поле с placeholder и поле пароля.
function a6OwnCheck(code) {
  const r = a6Form(code, {});
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind !== 'block' || f.tag === 'p') return { ok: false, msg: FB.h1First };
  if (f.tag !== 'h1') return { ok: false, msg: a6Fb('mainH1', { got: f.tag }) };
  if (N.slice(1).some((b) => b.kind === 'block' && b.tag === 'h1')) return { ok: false, msg: FB.oneH1 };
  const loose = N.some((b) => b.kind === 'label' || b.kind === 'input');
  const form = N.find((b) => b.kind === 'form');
  if (!form) return { ok: false, msg: loose ? FB.inForm : FB.needForm };
  if (loose) return { ok: false, msg: FB.inForm };
  if (form.kids.some((k) => k.kind === 'input')) return { ok: false, msg: FB.needLabel };
  const labels = form.kids.filter((k) => k.kind === 'label');
  for (const lb of labels) {
    if (!lb.inputs.length) return { ok: false, msg: FB.labelNoInput };
    if (!a6Letters(lb.cap)) return { ok: false, msg: FB.labelNoCap };
    for (const at of lb.inputs) {
      const ty = at.type === undefined ? '' : a6Squash(at.type).toLowerCase();
      if (at.type !== undefined && !ty) return { ok: false, msg: FB.emptyType };
      if (ty && A6_TYPES.indexOf(ty) < 0) return { ok: false, msg: fillL(FB.typeNo, { got: at.type }) };
    }
  }
  if (labels.length < 2) return { ok: false, msg: FB.twoFields };
  const ins = [].concat(...labels.map((lb) => lb.inputs));
  const tyOf = (at) => a6Squash(at.type).toLowerCase();
  if (!ins.some((at) => tyOf(at) === 'password')) return { ok: false, msg: FB.needPass };
  if (!ins.some((at) => tyOf(at) !== 'password' && a6Letters(at.placeholder))) return { ok: false, msg: FB.needPh };
  return { ok: true, result: { heading: f.text, fields: labels.map((lb) => ({ cap: lb.cap, type: tyOf(lb.inputs[0]) || 'text', ph: lb.inputs[0].placeholder || '' })), code } };
}
// Что уже есть в своей анкете (для схемы): терпимо к недописанному коду.
function a6OwnDone(code) {
  const tk = lexA6(code);
  const has = (k, name) => tk.some((t) => t.k === k && t.name === name);
  let inLabel = false;
  let text = false, pass = false;
  tk.forEach((t) => {
    if (t.name === 'label') inLabel = t.k === 'open';
    if (inLabel && t.k === 'open' && t.name === 'input') {
      const at = t.attrs || {};
      const ty = a6Squash(at.type).toLowerCase();
      if (ty === 'password') pass = true;
      else if (a6Letters(at.placeholder)) text = true;
    }
  });
  return { h1: has('open', 'h1') && has('close', 'h1'), form: has('open', 'form') && has('close', 'form'), text, pass };
}
// Код анкеты — строками: блок и label — своей строкой, form — с отступом внутри; esc — для артефакта.
function a6Lines(code, esc) {
  const toks = lexA6(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const isLine = (t) => (t.k === 'open' || t.k === 'close') && (A6_HEAD.test(t.name) || t.name === 'p' || t.name === 'label');
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  const val = (v) => (esc ? escHtml(v) : v);
  const tagText = (t) => {
    if (t.k === 'close') return '</' + t.name + '>';
    const at = t.attrs || {};
    const keys = t.name === 'input' ? ['type', 'placeholder'] : t.name === 'img' ? ['src', 'alt'] : t.name === 'a' ? ['href'] : [];
    return '<' + t.name + keys.filter((k) => at[k] !== undefined).map((k) => ' ' + k + '="' + val(at[k]) + '"').join('') + '>';
  };
  toks.forEach((t, n) => {
    if (t.k === 'close' && t.name === 'input') return;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'form') {
      flush();
      if (t.k === 'close') depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + tagText(t));
      if (t.k === 'open') depth += 1;
      return;
    }
    if (t.k === 'open' && t.name === 'input' && !cur) { lines.push('  '.repeat(depth) + tagText(t)); return; }
    if (isLine(t)) {
      if (t.k === 'open') { flush(); cur = tagText(t); return; }
      cur += tagText(t);
      flush();
      return;
    }
    if (t.k === 'open' || t.k === 'close') { cur += (t.name === 'input' && cur && !/\s$/.test(cur) ? ' ' : '') + tagText(t); return; }
    if (t.k === 'text') {
      let s2 = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || isLine(prev)) s2 = s2.replace(/^\s+/, '');
      if (!next || (isLine(next) && next.k === 'close')) s2 = s2.replace(/\s+$/, '');
      cur += esc ? escHtml(s2) : s2;
    }
  });
  flush();
  return lines;
}
const a6OwnSample = (pk) => ['<h1>' + pk(XTRA.ownH) + '</h1>', '<form>', '  ' + a6Label(pk(XTRA.ownCap), a6Input('text', pk(PH.game))),
  '  ' + a6Label(pk(CAP.pass), a6Input('password')), '</form>'];
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-form', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a6OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myFields', r.result.fields);
    store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), blocks: a6Page(st.code).blocks, big: true,
    aid: <><A6Tree done={a6OwnDone(st.code)} /><A6Types /></>,
    editor: <A6Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: a6OwnSample
});

function A6Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A6TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A6Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A6Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A6Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A6Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A6Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: анкета футбола, пароль за точками → «Saqlash» → сбой: значение type стёрлось — пароль виден
// всем, вкладки гаснут. Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const broke = !!(rec && rec.done);
  const [boom, setBoom] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: broke ? c.done : c.say, pose: broke ? 'point' : 'wonder' }]);
  const canGo = useAdvanceGate(broke, spoken);
  const led = useIdleLed(!broke, 0);
  const all = useA6Tabs(true);
  const tabs = broke ? all.map((t) => Object.assign({}, t, { st: 'off' })) : all;
  const tap = () => {
    if (broke) return;
    sfx('off', true);
    setBoom(true);
    setTimeout(() => setBoom(false), 700);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const club = pick(CLUB.futbol);
  const lines = ['<h1>' + club + '</h1>', '<form>', '  ' + a6Label(pick(CAP.name), a6Input('text')), '  ' + a6Label(pick(CAP.pass), a6Input(broke ? '' : 'password')), '</form>'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a6-sheet a6-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a6-work">
          <div className="a6-side">
            <A6Browser tabs={tabs} cur={0} title={club} cls={boom ? 'a6-glitch' : ''} url="futbol.html">
              <A6Doc blocks={a6Page(lines.join('\n'), [VIS.name, VIS.pass]).blocks} />
            </A6Browser>
          </div>
          <div className="a6-main">
            <A6Code lines={lines} cls={boom ? 'a6-glitch' : ''} mark={broke ? 3 : null} />
            {!broke ? (
              <div className="kz-row a6-row">
                <button type="button" className="kz-btn is-coral a6-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h11l3 3v15H5z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></svg>
                  {pick(UI.save)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ВЫВОД: все пять вкладок горят, своя анкета открыта; её код; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA6Tabs(true);
  const code = store.get('myCode') || a6OwnSample(pick).join('\n');
  const lines = a6Body(a6Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'input' || curK === 'type' ? find(/type="password"/) : curK === 'placeholder' ? find(/placeholder="/) : curK === 'label' ? find(/<label>/) : null;
  const ROLE_C = { input: '#FA4F28', type: '#7C5CFA', placeholder: '#0FA38E', label: '#F59E0B', own: '#E44D26' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a6-sheet a6-fin">
        <KzAsk text={c.ask} />
        <div className="a6-work">
          <div className="a6-side">
            <A6Browser tabs={tabs} cur={4} title={pick(TABS[4].name)} pageHl={curK === 'own'} url="anketa.html"><A6Doc blocks={a6Page(code, ['', VIS.pass]).blocks} /></A6Browser>
            <div className="a6-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a6-main">
            <A6Code lines={lines} mark={mark} />
            <div className="kz-roles a6-roles">
              {['input', 'type', 'placeholder', 'label', 'own'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': ROLE_C[k] }}>
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
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: T3 },
  { id: 't4', code: 'CHECK-1', Comp: T4 },
  { id: 't5', code: 'LEVEL-4', Comp: T5 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только текущее задание (у своей анкеты — и её код и тексты).
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'myFields', 'myTab'] };

// Артефакт — своя анкета из задания 5 (тексты и значения атрибутов — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', fields: store.get('myFields') || [],
    html: [A6_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a6Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika6({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: practiceArtifact(store) })
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
