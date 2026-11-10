// =============================================================================
// ПРАКТИКА 8 «Сайт школы Коди» (облик «Редактор»), на основе практики 07p (tools/amaliyot7):
//   · разбор кода lexA8 (теги уроков 1–8 и атрибуты: у a — href) / a8Group (ссылки внутри текста) / a8Struct
//     (части header, nav, main, section, footer с вложенными, заголовки, абзацы, текст меню) — одна самая полезная
//     проблема; head внутри body — путаница урока 8;
//   · честный браузер a8Page / A8Doc — как в уроке 8: части вид страницы не меняют, их показывает «Инспектор»
//     (пунктирные рамки с именем тега); незнакомый тег и head в body — рамки нет, текст на месте;
//   · редактор A8Editor, ряд символов A8Keys, браузер A8Browser с пятью вкладками-картой, ход задания
//     useA8Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================
// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–6, у открывающего — attrs), text (v — без крайних
// пробелов, raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A8_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'img', 'header', 'nav', 'main', 'section', 'footer'];
const A8_HEAD = /^h[1-6]$/;
const A8_INLINE = { b: 1, i: 1, a: 1 };
const A8_OUTER = { html: 1, head: 1, title: 1 };
const A8_TYPES = ['text', 'password', 'number'];
const a8Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a8Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a8Norm = (s) => a8Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,:]/g, '').replace(/\s+/g, ' ').trim();
function a8Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a8Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A8_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a8Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA8(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a8Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    if (A8_KNOWN.indexOf(name) >= 0) {
      const tok = { k: close ? 'close' : 'open', name, raw };
      if (!close) Object.assign(tok, a8Attrs(name, body.slice(name.length)));
      out.push(tok);
      continue;
    }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a8Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Атрибуты открывающего тега (уроки 4–7): у a — href, у img — src и alt, у input — type и placeholder, у textarea —
// placeholder; у других
// тегов атрибутов в курсе ещё нет. attrs — значения (нет атрибута — undefined); attrErr — первая ошибка записи:
// noEq, noQuote, attrTypo (другое имя, например placehoder), attrNone.
const A8_ATTRS = { a: ['href'], img: ['src', 'alt'] };
function a8Attrs(name, rest) {
  const attrs = {};
  let attrErr = null;
  const re = /\s*([^\s="']+)(\s*=\s*(?:"([^"]*)("?)|'([^']*)('?)|([^\s"']*)))?/g;
  let m;
  const src = String(rest || '');
  const ok = A8_ATTRS[name] || [];
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
const A8_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|header|nav|main|section|footer)\s*>)/i;
const a8Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a8Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a8Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'open' && t.attrErr) return a8Fb(t.attrErr.why, { bad: t.attrErr.bad || '', tag: t.attrErr.tag || t.name, attr: t.attrErr.attr || '', list: t.attrErr.list || '' });
    if (t.k === 'text') { const m = A8_NOLT.exec(t.v); if (m) return a8Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body: doctype, html, title и сам body — уже есть; head внутри body — путаница урока 8 (head ≠ header).
function a8Outer(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if ((t.k === 'open' || t.k === 'close') && t.name === 'head') return FB.headNotHeader;
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A8_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
  }
  return null;
}
// Текст вместе с b, i и a внутри него — один кусок { k: 'text', v, links: [{ href, text }] }. b, i и a закрываются
// внутри куска, в них — хотя бы одно слово.
function a8Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0, a: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', inner: {}, links: [] }; };
  const end = () => {
    if (!cur) return null;
    if (depth.a > 0) return FB.aOpen;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a8Fb('inlineOpen', { tag: tg });
    cur.v = a8Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A8_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a8Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') {
        depth[t.name] += 1; cur.inner[t.name] = '';
        if (t.name === 'a') cur.links.push({ href: t.attrs ? t.attrs.href : undefined, text: '' });
      } else {
        if (!depth[t.name]) return { msg: a8Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a8Letters(cur.inner[t.name])) return { msg: a8Fb('inlineEmpty', { tag: t.name }) };
        if (t.name === 'a') cur.links[cur.links.length - 1].text = a8Squash(cur.inner.a);
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

// РАЗБОР НА УЗЛЫ: части { kind: 'part', tag, kids } (header, nav, main, section, footer — с вложенными), блоки
// { kind: 'block', tag, text, links } (заголовки, абзацы), текст { kind: 'text', v, links } (например, меню в nav).
// Первая проблема — одна фраза { msg }.
const A8_PART = { header: 1, nav: 1, main: 1, section: 1, footer: 1 };
function a8Struct(src) {
  const toks = lexA8(src);
  const bad = a8Bad(toks) || a8Outer(toks);
  if (bad) return { msg: bad };
  const g = a8Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  let i = 0;
  const closeOf = (tag, z) => {
    if (z && z.k === 'close' && z.name === tag) return null;
    if (z && z.k === 'open' && z.name === tag) return a8Fb('needSlash', { tag });
    return a8Fb(A8_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  const items = (until) => {
    const out = [];
    while (i < L.length) {
      const t = L[i];
      if (t.k === 'close' && until && t.name === until) { i += 1; return { list: out, closed: true }; }
      if (t.k === 'close') return { msg: until && A8_PART[t.name] ? a8Fb('needClose', { tag: until }) : a8Fb('closeStray', { got: t.name }) };
      if (t.k === 'text') { out.push({ kind: 'text', v: t.v, links: t.links || [] }); i += 1; continue; }
      if (A8_PART[t.name]) {
        if (t.name === until) return { msg: a8Fb('needSlash', { tag: t.name }) };
        i += 1;
        const r = items(t.name);
        if (r.msg) return r;
        if (!r.closed) return { msg: a8Fb('needClose', { tag: t.name }) };
        out.push({ kind: 'part', tag: t.name, kids: r.list });
        continue;
      }
      if (A8_HEAD.test(t.name) || t.name === 'p') {
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a8Fb('needText', { tag: t.name }) };
        if (!a8Letters(y.v)) return { msg: FB.short };
        const m = closeOf(t.name, L[i + 2]);
        if (m) return { msg: m };
        out.push({ kind: 'block', tag: t.name, text: y.v, links: y.links || [] });
        i += 3;
        continue;
      }
      return { msg: a8Fb('unknown', { bad: '<' + t.name + '>' }) };
    }
    return { list: out, closed: false };
  };
  const r = items(null);
  if (r.msg) return r;
  return { nodes: r.list };
}
// Все ссылки внутри узлов (в тексте и в блоках, с вложенными частями).
const a8Links = (nodes) => [].concat(...(nodes || []).map((n) => (n.kind === 'part' ? a8Links(n.kids) : n.links || [])));
const a8Text = (nodes) => a8Squash((nodes || []).map((n) => (n.kind === 'part' ? a8Text(n.kids) : n.kind === 'text' ? n.v : n.text)).join(' '));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроке 8. Части сайта вид страницы не меняют: страница — заголовки, абзацы, ссылки,
// текст, как в браузере по умолчанию. Части показывает «Инспектор»: цветная пунктирная рамка с именем тега поверх
// страницы. Незнакомый тег (опечатка) и head внутри body — браузер не знает такой части: рамки нет, текст на месте.
// Дерево: { tag, kids } — части и блоки { tag: 'h1'…'h6' | 'p' | 'raw', runs }.
// ─────────────────────────────────────────────────────────────────────────────
function a8Page(src) {
  const root = { tag: 'root', kids: [] };
  const stack = [root];
  let cur = null;
  let hOpen = 0;
  const d = { b: 0, i: 0 };
  const hrefs = [];
  const box = () => stack[stack.length - 1];
  const nb = (tag) => { cur = { tag, inh: A8_HEAD.test(tag) ? 0 : hOpen, runs: [] }; box().kids.push(cur); };
  lexA8(src).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      const n = t.name;
      if (A8_PART[n]) {
        if (t.k === 'open') { const part = { tag: n, kids: [] }; box().kids.push(part); stack.push(part); cur = null; }
        else {
          const at = stack.map((x) => x.tag).lastIndexOf(n);
          if (at > 0) stack.length = at;
          cur = null;
        }
        return;
      }
      if (A8_HEAD.test(n)) {
        if (t.k === 'open') { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); }
        else { hOpen = 0; cur = null; }
        return;
      }
      if (n === 'p') { if (t.k === 'open') nb('p'); else if (cur && cur.tag === 'p') cur = null; return; }
      if (n === 'a') { if (t.k === 'open') hrefs.push(t.attrs && t.attrs.href !== undefined ? t.attrs.href : null); else hrefs.pop(); return; }
      if (n === 'b' || n === 'i') d[n] = t.k === 'open' ? d[n] + 1 : Math.max(0, d[n] - 1);
      return;
    }
    let txt = null;
    if (t.k === 'text') txt = t.raw;
    else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
    if (txt == null) return;
    if (!cur) nb('raw');
    cur.runs.push({ t: txt, b: d.b > 0, i: d.i > 0, href: hrefs.length ? hrefs[hrefs.length - 1] : null });
  });
  const clean = (node) => {
    node.kids = node.kids.filter((k) => (k.runs ? k.runs.some((r) => r.t.trim()) : (clean(k), true)));
    return node;
  };
  return clean(root);
}
// Страница всегда помещается в окно целиком: не влезает — шрифт ступеньками уменьшается, не меньше 56 %.
// Страница пересоздаётся (например, после «Проверить») — подгонка запускается заново: следит за самим узлом.
function useA8Fit(dep) {
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
function A8Doc({ tree, flash }) {
  const pick = usePick();
  const ref = useA8Fit(JSON.stringify(tree));
  if (!tree || !tree.kids.length) return null;
  const runs = (rs) => rs.map((r, j) => {
    const c = ((r.b ? 'a8-wb' : '') + (r.i ? ' a8-wi' : '') + (r.href != null ? ' a8-a' : '')).trim() || undefined;
    return <span key={j} className={c}>{r.t}</span>;
  });
  const node = (n, i) => (n.runs
    ? <div key={i} className={'a8-blk a8-' + n.tag + (n.inh ? ' a8-inh' + n.inh : '')}>{runs(n.runs)}</div>
    : <div key={i} className={'a8-reg a8-reg-' + n.tag} style={{ '--c': PART_C[n.tag] }}><span className="a8-reg-tag" translate="no">{n.tag}</span>{n.kids.map(node)}</div>);
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a8-doc' + (flash ? ' a8-in-a' : '')}>
      <span className="a8-insp-badge"><i aria-hidden="true" />{pick(UI.insp)}</span>
      {tree.kids.map(node)}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a8Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a8-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a8-t">{p}</span>;
    return (
      <span key={i} className="a8-g">
        <span className="a8-b">{'<' + m[1]}</span><span className="a8-n">{m[2]}</span>
        {m[3] ? <span className="a8-a">{m[3]}</span> : null}<span className="a8-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a8Insert(el, ch) {
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
const A8_MAX = 1200;
function A8Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a8-edit');
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
    <div key={key} className={'a8-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a8Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a8-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a8-edit' + (led ? ' is-led' : '')}>
        <div className="a8-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a8-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A8_MAX)); }}
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
function A8Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a8-ed a8-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a8-ln a8-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a8-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a8Hl(t) : '​'}</button>
      ) : <div key={i} className={'a8-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a8Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A8Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a8-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a8Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР С ПЯТЬЮ ВКЛАДКАМИ — браузер урока (PaperBrowser), вкладки — пять страниц сайта школы (карта).
// tabs: [{ st: 'ok' | 'off', name, ico, c }]; cur — открытая вкладка, title — её название
// сейчас. Сломанная страница — серый значок «!», починенная — цветной.
// ─────────────────────────────────────────────────────────────────────────────
const A8_ICO = {
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
  news: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
  gear: <><circle cx="12" cy="12" r="3.4" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};

const A8Fav = ({ ico, c, off }) => (
  <i className={'a8-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A8_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A8Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl, url, onBack }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a8-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a8-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a8-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a8-pop' : '')}>
            <A8Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a8-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A8Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a8-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn a8-back" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
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
function useA8Tabs(all) {
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
// Части кода по порядку — как в редакторе.
function A8Parts({ parts }) {
  const pick = usePick();
  return (
    <div className="a8-slots" translate="no">
      {parts.map((x, n) => (
        <span key={n} className="a8-slot" style={{ '--pc': 'var(--r-html)' }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(x.word)}</em>}
        </span>
      ))}
    </div>
  );
}
// Части сайта (урок 8): тег в цвете своей рамки и что он значит.
function A8Roles() {
  const pick = usePick();
  return (
    <div className="a8-files a8-types" translate="no">
      <span className="a8-files-l">{pick(UI.parts)}:</span>
      {['header', 'nav', 'main', 'section', 'footer'].map((t) => (
        <span key={t} className="a8-ty"><code style={{ color: PART_C[t], borderColor: PART_C[t] }}>{t}</code><span className="a8-ty-r">{pick(ROLE[t])}</span></span>
      ))}
    </div>
  );
}
// Схема своего сайта: body уже есть; header (h1, nav), main (section), footer — пишет ученик.
function A8Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, note, ok) => (
    <div className={'a8-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a8-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': PART_C[tag] || 'var(--r-body)' }}>{tag}</code>
      {note ? <span className="a8-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a8-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a8-tree" translate="no">
      {row('', 'body', UI.given, true)}
      {row('├─ ', 'header', UI.bpHeader, D.header)}
      {row('├─ ', 'main', UI.bpMain, D.main)}
      {row('│  └─ ', 'section', UI.bpSec, D.section)}
      {row('└─ ', 'footer', UI.bpFooter, D.footer)}
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
const A8Sample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="a8-sample">
      <span className="a8-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A8Code lines={lines} cls="a8-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A8_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA8Task(cfg) {
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
    if (fails >= A8_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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

function A8TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA8Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA8Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.a8-main .a8-ln', rec.done, drilling, t.msg, lv);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a8-sheet a8-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'a8-work' + (v.big ? ' is-big' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')}>
          <div className="a8-side">
            <A8Browser tabs={tabs} cur={cfg.num - 1} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}
              url={v.url || TABS[cfg.num - 1].file}>
              <A8Doc tree={v.tree} flash={t.flash} />
            </A8Browser>
            {v.aid || null}
          </div>
          <div className="a8-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A8Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A8Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ. Страница сайта школы: header (h1, nav), main (section с h2 и p), footer.
// ─────────────────────────────────────────────────────────────────────────────
const A8_DOC = '<!DOCTYPE html>';
const a8Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);
const a8Wrap = (tag, inner) => '<' + tag + '>' + inner + '</' + tag + '>';
const a8Link = (href, text) => '<a href="' + href + '">' + text + '</a>';
const a8Parts = (code, key) => <React.Fragment key={key}>{a8Hl(code)}</React.Fragment>;

// Т1 · поле в строке: имя тега части (без него Инспектор рамку не показывает).
function a8TagCheck(v, want) {
  const s = a8Squash(v).toLowerCase();
  if (!s) return { ok: false, msg: FB.emptyTag };
  if (/[<>\/"'=]/.test(s)) return { ok: false, msg: UI.noTags };
  if (s === want) return { ok: true };
  if (s === 'head') return { ok: false, msg: want === 'header' ? FB.headNotHeader : fillL(FB.partOther, { want, role: ROLE[want] }) };
  if (s === 'body') return { ok: false, msg: FB.hasBody };
  if (A8_PART[s]) return { ok: false, msg: fillL(FB.partOther, { want, role: ROLE[want] }) };
  if (a8Dist(s, want) <= 2) return { ok: false, msg: a8Fb('typo', { bad: '<' + s + '>', near: '<' + want + '>' }) };
  return { ok: false, msg: a8Fb('unknown', { bad: '<' + s + '>' }) };
}
const A8_T1 = { pg: 'index', want: 'main' };
const A8_T1X = { pg: 'sport', want: 'footer' };
function a8FieldView(d) {
  return (st, x) => {
    const v = st.v || '';
    const pg = x.pick(PG[d.pg]);
    const school = x.pick(SCHOOL), foot = x.pick(FOOT);
    const gap = (after) => [
      <span key="lt" className="a8-g"><span className="a8-b">&lt;</span></span>,
      x.solved ? <span key="v" className="a8-n">{v}</span> : (
        <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
          <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={16}
            onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a8-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
        </span>),
      <span key="gt" className="a8-g"><span className="a8-b">&gt;</span></span>
    ].concat(after || []);
    const hl = x.solved ? 'is-new' : 'is-hl';
    let lines, code;
    if (d.want === 'main') {
      const sec = a8Wrap('section', a8Wrap('h2', x.pick(TXT.welcome)));
      lines = [
        { k: 'h', parts: [a8Parts(a8Wrap('header', a8Wrap('h1', school)), 'h')] },
        { k: 'mo', cls: hl, parts: gap() },
        { k: 's', d: 1, parts: [a8Parts(sec, 's')] },
        { k: 'mc', parts: [T_('main', true)] },
        { k: 'f', parts: [a8Parts(a8Wrap('footer', foot), 'f')] }
      ];
      code = a8Wrap('header', a8Wrap('h1', school)) + '<' + v + '>' + sec + '</main>' + a8Wrap('footer', foot);
    } else {
      const mid = a8Wrap('main', a8Wrap('p', x.pick(TXT.sportP)));
      lines = [
        { k: 'h', parts: [a8Parts(a8Wrap('header', a8Wrap('h1', pg)), 'h')] },
        { k: 'm', parts: [a8Parts(mid, 'm')] },
        { k: 'fo', cls: hl, parts: gap([W_(foot), T_('footer', true)]) }
      ];
      code = a8Wrap('header', a8Wrap('h1', pg)) + mid + '<' + v + '>' + foot + '</footer>';
    }
    return {
      title: pg, url: TABS[0].file, tree: a8Page(code),
      aid: <A8Roles />,
      editor: <div className="a8-fieldwrap"><KzCode cls="a8-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = () => ({
  id: 't1', num: 1, kind: 'write-part', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a8TagCheck(st.v, A8_T1.want),
  view: a8FieldView(A8_T1),
  sample: (pk) => [a8Wrap('footer', pk(FOOT))],
  drill: { init: () => ({ v: '' }), check: (st) => a8TagCheck(st.v, A8_T1X.want), view: a8FieldView(A8_T1X) }
});

// Т2 · строка: меню <nav><a href="…">…</a></nav> (смесь с уроком 4).
function a8NavCheck(code, text, href) {
  const r = a8Struct(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind !== 'part' && (f.links || []).length) return { ok: false, msg: FB.navWrap };
  if (f.kind !== 'part' || f.tag !== 'nav') return { ok: false, msg: a8Fb('wrongOpen', { tag: 'nav', got: f.tag || 'p' }) };
  const L = a8Links(f.kids);
  if (!L.length) return { ok: false, msg: FB.navNoLink };
  if (L[0].href === undefined) return { ok: false, msg: FB.noHref };
  if (a8Squash(L[0].href) !== href) return { ok: false, msg: fillL(FB.hrefOther, { got: L[0].href || '…', want: href }) };
  if (a8Norm(L[0].text) !== a8Norm(text)) return { ok: false, msg: fillL(FB.linkText, { want: text }) };
  if (N.length > 1) return { ok: false, msg: a8Fb('extra', { got: N[1].tag ? '<' + N[1].tag + '>' : N[1].v }) };
  return { ok: true };
}
const A8_T2 = { pg: 'news', text: 'index', href: 'index.html', p: 'newsP' };
const A8_T2X = { pg: 'gallery', text: 'contact', href: 'aloqa.html', p: 'soon' };
function a8LineView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  <header>', '    <h1>' + pg + '</h1>'];
    const after = ['  </header>', '  ' + a8Wrap('main', a8Wrap('p', x.pick(TXT[d.p]))), '</body>'];
    return {
      title: pg, url: d.pg === 'news' ? TABS[1].file : 'galereya.html', tree: a8Page(before.concat([st.code], after).join('\n')),
      aid: <A8Parts parts={[{ code: '<nav>' }, { code: '<a href="…">…</a>' }, { code: '</nav>' }]} />,
      editor: <A8Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-nav', C: C.t2,
  init: () => ({ code: '    ' }),
  check: (st) => a8NavCheck(st.code, pick(PG[A8_T2.text]), A8_T2.href),
  view: a8LineView(A8_T2),
  sample: (pk) => [a8Wrap('nav', a8Link('togaraklar.html', pk(PG.clubs)))],
  drill: { init: () => ({ code: '    ' }), check: (st) => a8NavCheck(st.code, pick(PG[A8_T2X.text]), A8_T2X.href), view: a8LineView(A8_T2X) }
});

// Т3 · блок: section с h2 и абзацем внутри main.
function a8SecCheck(code, want) {
  const r = a8Struct(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind === 'part' && f.tag === 'main') return { ok: false, msg: FB.oneMain };
  if (f.kind !== 'part') return { ok: false, msg: f.kind === 'block' ? FB.secWrap : a8Fb('needOpenText', { tag: 'section' }) };
  if (f.tag !== 'section') return { ok: false, msg: fillL(FB.partOther, { want: 'section', role: ROLE.section }) };
  const h = f.kids[0];
  if (!h || h.kind !== 'block' || h.tag !== 'h2') return { ok: false, msg: FB.secNeedH2 };
  if (a8Norm(h.text) !== a8Norm(want)) return { ok: false, msg: fillL(FB.h2Other, { want }) };
  if (!f.kids.some((k) => k.kind === 'block' && k.tag === 'p')) return { ok: false, msg: FB.secNeedP };
  if (N.length > 1) return { ok: false, msg: a8Fb('extra', { got: N[1].tag ? '<' + N[1].tag + '>' : N[1].v }) };
  return { ok: true };
}
const A8_T3 = { pg: 'clubs', h2: 'robot' };
const A8_T3X = { pg: 'sport', h2: 'chess' };
function a8SecView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  ' + a8Wrap('header', a8Wrap('h1', pg)), '  <main>'];
    const after = ['  </main>', '  ' + a8Wrap('footer', x.pick(FOOT)), '</body>'];
    return {
      title: pg, url: d.pg === 'clubs' ? TABS[2].file : 'sport.html', tree: a8Page(before.concat([st.code], after).join('\n')), pageHl: true,
      aid: <A8Parts parts={[{ code: '<section>' }, { code: '<h2>…</h2>' }, { code: '<p>…</p>' }, { code: '</section>' }]} />,
      editor: <A8Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = (pick) => ({
  id: 't3', num: 3, kind: 'write-section', C: C.t3,
  init: () => ({ code: '    ' }),
  check: (st) => a8SecCheck(st.code, pick(TXT[A8_T3.h2])),
  view: a8SecView(A8_T3),
  sample: (pk) => ['<section>', '  ' + a8Wrap('h2', pk(PG.sport)), '  ' + a8Wrap('p', pk(TXT.sportP)), '</section>'],
  drill: { init: () => ({ code: '    ' }), check: (st) => a8SecCheck(st.code, pick(TXT[A8_T3X.h2])), view: a8SecView(A8_T3X) }
});

// Т4 · найти строку и исправить: верх обёрнут в head вместо header (загадка урока 8) — рамки верха нет; в
// дополнительной задаче — опечатка foter: рамки низа нет.
const A8_T4 = {
  pg: 'contact', bad: 1, why: 'why', found: 'found', tag: 'header', word: 'head',
  lines: (pk) => a8Body([a8Wrap('head', a8Wrap('h1', pk(PG.contact))), a8Wrap('main', a8Wrap('p', pk(TXT.phone))), a8Wrap('footer', pk(FOOT))])
};
const A8_T4X = {
  pg: 'gallery', bad: 3, why: 'whyX', found: 'foundX', tag: 'footer', word: 'foter',
  lines: (pk) => a8Body([a8Wrap('header', a8Wrap('h1', pk(PG.gallery))), a8Wrap('main', a8Wrap('p', pk(TXT.soon))), a8Wrap('foter', pk(FOOT))])
};
function a8FixView(d, C4) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const lines = d.lines(x.pick);
    const BAD = d.bad;
    const url = d.pg === 'contact' ? TABS[3].file : 'galereya.html';
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4[d.found], 'point');
        setTimeout(() => {
          const el = x.inRef.current;
          if (!el) return;
          el.focus();
          const n = el.value.indexOf('<' + d.word) + 1;
          if (n > 0) el.setSelectionRange(n, n + d.word.length); else el.setSelectionRange(el.value.length, el.value.length);
        }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4[d.why][i] || C4[d.why][0]);
    };
    if (st.at == null) {
      return {
        title: pg, url, tree: a8Page(lines.join('\n')), pageHl: true, keys: false, ask: C4.ask,
        editor: <A8Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title: pg, url, tree: a8Page(before.concat([st.code], after).join('\n')), ask: C4.ask2,
      editor: <A8Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a8FixCheck(st, d, pick) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a8Struct(st.code);
  if (r.msg) return { ok: false, msg: r.msg };
  const f = r.nodes[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind !== 'part' || f.tag !== d.tag) return { ok: false, msg: fillL(FB.partOther, { want: d.tag, role: ROLE[d.tag] }) };
  const want = d.tag === 'header' ? pick(PG.contact) : pick(FOOT);
  if (a8Norm(a8Text(f.kids)) !== a8Norm(want) || r.nodes.length > 1) return { ok: false, msg: FB.keepLine };
  if (d.tag === 'header' && !(f.kids[0] && f.kids[0].kind === 'block' && f.kids[0].tag === 'h1')) return { ok: false, msg: FB.keepLine };
  return { ok: true };
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a8FixCheck(st, A8_T4, pick),
  view: a8FixView(A8_T4, C.t4),
  sample: (pk) => [a8Wrap('header', a8Wrap('h1', pk(SCHOOL)))],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a8FixCheck(st, A8_T4X, pick), view: a8FixView(A8_T4X, C.t4) }
});

// Т5 · свой сайт внутри body: header (h1, nav со ссылкой), main (section с h2 и p), footer — по порядку.
function a8OwnCheck(code) {
  const r = a8Struct(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const parts = N.filter((n) => n.kind === 'part');
  const tags = parts.map((n) => n.tag);
  const header = parts.find((n) => n.tag === 'header');
  if (!header) return { ok: false, msg: FB.needHeader };
  if (N.some((n) => n.kind !== 'part')) return { ok: false, msg: FB.inPart };
  if (!header.kids.some((k) => k.kind === 'block' && k.tag === 'h1')) return { ok: false, msg: FB.h1InHeader };
  const nav = header.kids.find((k) => k.kind === 'part' && k.tag === 'nav');
  if (!nav) return { ok: false, msg: FB.needNav };
  const L = a8Links(nav.kids);
  if (!L.length) return { ok: false, msg: FB.navNoLink };
  if (L.some((l) => !l.href)) return { ok: false, msg: FB.noHref };
  if (tags.indexOf('main') < 0) return { ok: false, msg: FB.needMain };
  if (tags.filter((t) => t === 'main').length > 1) return { ok: false, msg: FB.oneMain };
  const main = parts.find((n) => n.tag === 'main');
  const secs = main.kids.filter((k) => k.kind === 'part' && k.tag === 'section');
  if (!secs.length) return { ok: false, msg: FB.needSection };
  for (const s of secs) {
    if (!(s.kids[0] && s.kids[0].kind === 'block' && s.kids[0].tag === 'h2')) return { ok: false, msg: FB.secNeedH2 };
    if (!s.kids.some((k) => k.kind === 'block' && k.tag === 'p')) return { ok: false, msg: FB.secNeedP };
  }
  const footer = parts.find((n) => n.tag === 'footer');
  if (!footer) return { ok: false, msg: FB.needFooter };
  if (!a8Letters(a8Text(footer.kids))) return { ok: false, msg: a8Fb('needText', { tag: 'footer' }) };
  if (!(tags.indexOf('header') < tags.indexOf('main') && tags.indexOf('main') < tags.lastIndexOf('footer'))) return { ok: false, msg: FB.partOrder };
  const h1 = header.kids.find((k) => k.kind === 'block' && k.tag === 'h1');
  return { ok: true, result: { heading: h1.text, sections: secs.map((s) => s.kids[0].text), footer: a8Text(footer.kids), code } };
}
// Что уже есть в своём сайте (для схемы): терпимо к недописанному коду.
function a8OwnDone(code) {
  const tk = lexA8(code);
  const n = (k, name) => tk.filter((t) => t.k === k && t.name === name).length;
  const both = (name) => n('open', name) > 0 && n('close', name) > 0;
  return { header: both('header') && both('h1') && both('nav'), main: both('main'), section: both('section') && both('h2') && both('p'), footer: both('footer') };
}
// Код сайта — строками: части с отступом внутри; заголовок, абзац, меню, короткая часть с одним текстом — своей
// строкой; esc — для артефакта.
function a8Lines(code, esc) {
  const toks = lexA8(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const inl = {};
  toks.forEach((t, n) => {
    if (t.k === 'open' && A8_PART[t.name] && t.name !== 'nav' && toks[n + 1] && toks[n + 1].k === 'text' && toks[n + 2] && toks[n + 2].k === 'close' && toks[n + 2].name === t.name) { inl[n] = 1; inl[n + 2] = 1; }
  });
  const isLine = (t, n) => (t.k === 'open' || t.k === 'close') && (A8_HEAD.test(t.name) || t.name === 'p' || t.name === 'nav' || !!inl[n]);
  const isBox = (t, n) => (t.k === 'open' || t.k === 'close') && !!A8_PART[t.name] && !isLine(t, n);
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  const tagText = (t) => {
    if (t.k === 'close') return '</' + t.name + '>';
    const at = t.attrs || {};
    return '<' + t.name + (t.name === 'a' && at.href !== undefined ? ' href="' + (esc ? escHtml(at.href) : at.href) + '"' : '') + '>';
  };
  toks.forEach((t, n) => {
    if (isBox(t, n)) {
      flush();
      if (t.k === 'close') depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + tagText(t));
      if (t.k === 'open') depth += 1;
      return;
    }
    if (isLine(t, n)) {
      if (t.k === 'open') { flush(); cur = tagText(t); return; }
      cur += tagText(t);
      flush();
      return;
    }
    if (t.k === 'open' || t.k === 'close') { cur += tagText(t); return; }
    if (t.k === 'text') {
      let s2 = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || isLine(prev, n - 1) || isBox(prev, n - 1)) s2 = s2.replace(/^\s+/, '');
      if (!next || isLine(next, n + 1) || isBox(next, n + 1)) s2 = s2.replace(/\s+$/, '');
      cur += esc ? escHtml(s2) : s2;
    }
  });
  flush();
  return lines;
}
const a8OwnSample = (pk) => ['<header>', '  ' + a8Wrap('h1', pk(XTRA.ownH)), '  ' + a8Wrap('nav', a8Link('index.html', pk(PG.index))), '</header>',
  '<main>', '  <section>', '    ' + a8Wrap('h2', pk(XTRA.ownSec)), '    ' + a8Wrap('p', pk(XTRA.ownP)), '  </section>', '</main>', a8Wrap('footer', pk(XTRA.ownFoot))];
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-site', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a8OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('mySecs', r.result.sections); store.set('myFoot', r.result.footer);
    store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), tree: a8Page(st.code), big: true,
    aid: <><A8Tree done={a8OwnDone(st.code)} /><A8Roles /></>,
    editor: <A8Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: a8OwnSample
});

function A8Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A8TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A8Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A8Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A8Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A8Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A8Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: главная с рамками частей → «Saqlash» → сбой: у main стёрлось имя тега — рамка главной части
// пропала, вкладки гаснут. Одно касание.
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
  const all = useA8Tabs(true);
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
  const pg = pick(PG.index);
  const lines = [a8Wrap('header', a8Wrap('h1', pick(SCHOOL))), broke ? '<>' : '<main>', '  ' + a8Wrap('section', a8Wrap('h2', pick(TXT.welcome))), '</main>', a8Wrap('footer', pick(FOOT))];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a8-sheet a8-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a8-work">
          <div className="a8-side">
            <A8Browser tabs={tabs} cur={0} title={pg} cls={boom ? 'a8-glitch' : ''} url="index.html">
              <A8Doc tree={a8Page(lines.join('\n'))} />
            </A8Browser>
          </div>
          <div className="a8-main">
            <A8Code lines={lines} cls={boom ? 'a8-glitch' : ''} mark={broke ? 1 : null} />
            {!broke ? (
              <div className="kz-row a8-row">
                <button type="button" className="kz-btn is-coral a8-publish" onClick={tap}>
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
// ВЫВОД: все пять вкладок горят, свой сайт открыт; его код; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA8Tabs(true);
  const code = store.get('myCode') || a8OwnSample(pick).join('\n');
  const lines = a8Body(a8Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = A8_PART[curK] ? find(new RegExp('<' + curK + '>')) : null;
  const ROLES = ['header', 'nav', 'main', 'section', 'footer', 'own'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a8-sheet a8-fin">
        <KzAsk text={c.ask} />
        <div className="a8-work">
          <div className="a8-side">
            <A8Browser tabs={tabs} cur={4} title={pick(TABS[4].name)} pageHl={curK === 'own'} url="mening.html"><A8Doc tree={a8Page(code)} /></A8Browser>
            <div className="a8-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a8-main">
            <A8Code lines={lines} mark={mark} />
            <div className="kz-roles a8-roles">
              {ROLES.map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': PART_C[k] || '#E44D26' }}>
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
// «Повторить» стирает только текущее задание (у своего сайта — и его код и тексты).
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'mySecs', 'myFoot', 'myTab'] };

// Артефакт — свой сайт из задания 5 (тексты и адреса — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', sections: store.get('mySecs') || [], footer: store.get('myFoot') || '',
    html: [A8_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a8Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika8({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
