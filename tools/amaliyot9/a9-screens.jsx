// =============================================================================
// ПРАКТИКА 9 «Мой сайт от и до» (облик «Редактор»), к финальному HTML-проекту, на основе практики 08p (tools/amaliyot8):
//   · разбор кода lexA9 (все теги курса: каркас, заголовки и текст, списки, ссылки, картинки, формы, части сайта; атрибуты
//     href, src, alt, type, placeholder) / a9Group / a9Struct (части, списки, форма, пустые img и input) — одна самая
//     полезная проблема;
//   · честный браузер a9Page / A9Doc — весь документ: title на вкладке, body в окне; части видны рамками «Инспектора»
//     (урок 8), списки, картинки файлов (урок 5), поля и кнопки как в Chrome (уроки 6–7);
//   · один сайт растёт по шагам: в редакторе — новая часть, готовые части свёрнуты; карта — план сайта из пяти частей;
//   · редактор A9Editor, ряд символов A9Keys, ход задания useA9Task — общие части каркаса 01p.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================
// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–6, у открывающего — attrs), text (v — без крайних
// пробелов, raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A9_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'img', 'header', 'nav', 'main', 'section', 'footer', 'form', 'label', 'input', 'button', 'select', 'option'];
const A9_HEAD = /^h[1-6]$/;
const A9_INLINE = { b: 1, i: 1, a: 1 };
const A9_OUTER = { html: 1, head: 1, title: 1 };
const a9Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a9Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a9Norm = (s) => a9Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,:]/g, '').replace(/\s+/g, ' ').trim();
function a9Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a9Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A9_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a9Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA9(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a9Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    if (A9_KNOWN.indexOf(name) >= 0) {
      const tok = { k: close ? 'close' : 'open', name, raw };
      if (!close) Object.assign(tok, a9Attrs(name, body.slice(name.length)));
      out.push(tok);
      continue;
    }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a9Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Атрибуты открывающего тега (уроки 4–7): у a — href, у img — src и alt, у input — type и placeholder, у textarea —
// placeholder; у других
// тегов атрибутов в курсе ещё нет. attrs — значения (нет атрибута — undefined); attrErr — первая ошибка записи:
// noEq, noQuote, attrTypo (другое имя, например placehoder), attrNone.
const A9_ATTRS = { a: ['href'], img: ['src', 'alt'], input: ['type', 'placeholder'] };
function a9Attrs(name, rest) {
  const attrs = {};
  let attrErr = null;
  const re = /\s*([^\s="']+)(\s*=\s*(?:"([^"]*)("?)|'([^']*)('?)|([^\s"']*)))?/g;
  let m;
  const src = String(rest || '');
  const ok = A9_ATTRS[name] || [];
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
const A9_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|ul|ol|li|header|nav|main|section|footer|form|label|button|select|option)\s*>)/i;
const a9Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a9Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a9Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'open' && t.attrErr) return a9Fb(t.attrErr.why, { bad: t.attrErr.bad || '', tag: t.attrErr.tag || t.name, attr: t.attrErr.attr || '', list: t.attrErr.list || '' });
    if (t.k === 'text') { const m = A9_NOLT.exec(t.v); if (m) return a9Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body: doctype, html, title и сам body — уже есть; head внутри body — путаница урока 8 (head ≠ header).
function a9Outer(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if ((t.k === 'open' || t.k === 'close') && t.name === 'head') return FB.headNotHeader;
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A9_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
  }
  return null;
}
// Текст вместе с b, i и a внутри него — один кусок { k: 'text', v, links: [{ href, text }] }. b, i и a закрываются
// внутри куска, в них — хотя бы одно слово.
function a9Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0, a: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', inner: {}, links: [] }; };
  const end = () => {
    if (!cur) return null;
    if (depth.a > 0) return FB.aOpen;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a9Fb('inlineOpen', { tag: tg });
    cur.v = a9Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A9_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a9Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') {
        depth[t.name] += 1; cur.inner[t.name] = '';
        if (t.name === 'a') cur.links.push({ href: t.attrs ? t.attrs.href : undefined, text: '' });
      } else {
        if (!depth[t.name]) return { msg: a9Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a9Letters(cur.inner[t.name])) return { msg: a9Fb('inlineEmpty', { tag: t.name }) };
        if (t.name === 'a') cur.links[cur.links.length - 1].text = a9Squash(cur.inner.a);
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

// РАЗБОР НА УЗЛЫ (вся тема курса): части { kind: 'part', tag, kids } (header, nav, main, section, footer), контейнеры
// { kind: 'box', tag, kids } (ul, ol, li, form, label), блоки { kind: 'block', tag, text, links } (h1–h6, p, button),
// пустые теги { kind: 'img' | 'input', attrs }, текст { kind: 'text', v, links }. Первая проблема — одна фраза { msg }.
const A9_PART = { header: 1, nav: 1, main: 1, section: 1, footer: 1 };
const A9_BOX = { ul: 1, ol: 1, li: 1, form: 1, label: 1, select: 1 };
const A9_VOID = { img: 1, input: 1 };
function a9Struct(src) {
  const toks = lexA9(src);
  const bad = a9Bad(toks) || a9Outer(toks);
  if (bad) return { msg: bad };
  const g = a9Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  let i = 0;
  const closeOf = (tag, z) => {
    if (z && z.k === 'close' && z.name === tag) return null;
    if (z && z.k === 'open' && z.name === tag) return a9Fb('needSlash', { tag });
    return a9Fb(A9_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  const items = (until) => {
    const out = [];
    while (i < L.length) {
      const t = L[i];
      if (t.k === 'close' && until && t.name === until) { i += 1; return { list: out, closed: true }; }
      if (t.k === 'close' && A9_VOID[t.name]) return { msg: a9Fb('voidClose', { tag: t.name }) };
      if (t.k === 'close') return { msg: until && (A9_PART[t.name] || A9_BOX[t.name]) ? a9Fb('needClose', { tag: until }) : a9Fb('closeStray', { got: t.name }) };
      if (t.k === 'text') { out.push({ kind: 'text', v: t.v, links: t.links || [] }); i += 1; continue; }
      if (A9_VOID[t.name]) { out.push({ kind: t.name, attrs: t.attrs || {} }); i += 1; continue; }
      if (A9_PART[t.name] || A9_BOX[t.name]) {
        if (t.name === until) return { msg: a9Fb('needSlash', { tag: t.name }) };
        i += 1;
        const r = items(t.name);
        if (r.msg) return r;
        if (!r.closed) return { msg: a9Fb('needClose', { tag: t.name }) };
        out.push({ kind: A9_PART[t.name] ? 'part' : 'box', tag: t.name, kids: r.list });
        continue;
      }
      if (A9_HEAD.test(t.name) || t.name === 'p' || t.name === 'button' || t.name === 'option') {
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a9Fb('needText', { tag: t.name }) };
        if (!a9Letters(y.v)) return { msg: FB.short };
        const m = closeOf(t.name, L[i + 2]);
        if (m) return { msg: m };
        out.push({ kind: 'block', tag: t.name, text: y.v, links: y.links || [] });
        i += 3;
        continue;
      }
      return { msg: a9Fb('unknown', { bad: '<' + t.name + '>' }) };
    }
    return { list: out, closed: false };
  };
  const r = items(null);
  if (r.msg) return r;
  return { nodes: r.list };
}
// Все ссылки внутри узлов (в тексте и в блоках, с вложенными частями).
const a9Kids = (n) => (n.kids || []);
const a9Links = (nodes) => [].concat(...(nodes || []).map((n) => (n.kids ? a9Links(n.kids) : n.links || [])));
const a9Text = (nodes) => a9Squash((nodes || []).map((n) => (n.kids ? a9Text(n.kids) : n.kind === 'text' ? n.v : n.text || '')).join(' '));
// Все узлы с вложенными — для поиска (img, input, button где угодно внутри).
const a9All = (nodes) => [].concat(...(nodes || []).map((n) => [n].concat(n.kids ? a9All(n.kids) : [])));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — весь документ: на вкладке — title, в окне — body, как в уроках 1–8. Части сайта вид страницы
// не меняют — их показывает «Инспектор» (рамки урока 8). Списки — с маркерами или номерами (урок 3), картинка —
// рисунок файла или значок сломанной картинки и alt (урок 5), поля, подписи и кнопки — как в Chrome (уроки 6–7),
// form не видна. Текст в head (кроме title) браузер не показывает.
// Дерево: { tag, kids } — части; блоки { tag: 'h1'…'h6' | 'p' | 'lab' | 'raw', runs }; списки { list: 'ul' | 'ol', items: [runs] }.
// run — текст { t, b, i, href } | картинка { img } | поле { fld } | кнопка { btn }.
// ─────────────────────────────────────────────────────────────────────────────
function a9Page(src) {
  const root = { tag: 'root', kids: [] };
  const stack = [root];
  let cur = null, list = null, btn = null, sel = null, opt = null;
  let hOpen = 0, inTitle = false, inHead = false;
  let title = '';
  const d = { b: 0, i: 0 };
  const hrefs = [];
  const box = () => stack[stack.length - 1];
  const nb = (tag) => { cur = { tag, inh: A9_HEAD.test(tag) ? 0 : hOpen, runs: [] }; box().kids.push(cur); };
  const put = (run) => { if (!cur) nb('raw'); cur.runs.push(run); };
  lexA9(src).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      const n = t.name;
      const o = t.k === 'open';
      if (sel) {   // внутри select браузер замечает только option и конец списка (урок 7)
        if (n === 'option') { if (o) { opt = { t: '' }; sel.opts.push(opt); } else opt = null; }
        if (n === 'select' && !o) { sel = null; opt = null; }
        return;
      }
      if (n === 'select') { if (o) { btn = null; sel = { opts: [] }; put({ t: '', sel }); } return; }
      if (n === 'title') { inTitle = o; return; }
      if (n === 'head') { inHead = o; return; }
      if (n === 'html' || n === 'body') { cur = null; return; }
      if (A9_PART[n]) {
        if (o) { const part = { tag: n, kids: [] }; box().kids.push(part); stack.push(part); cur = null; list = null; }
        else { const at = stack.map((x) => x.tag).lastIndexOf(n); if (at > 0) stack.length = at; cur = null; list = null; }
        return;
      }
      if (n === 'ul' || n === 'ol') { if (o) { list = { list: n, items: [] }; box().kids.push(list); } else list = null; cur = null; return; }
      if (n === 'li') {
        if (o) { if (list) { cur = { tag: 'li', runs: [] }; list.items.push(cur); } else nb('raw'); }
        else cur = null;
        return;
      }
      if (A9_HEAD.test(n)) { if (o) { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); } else { hOpen = 0; cur = null; } return; }
      if (n === 'p' || n === 'label') { const tg = n === 'p' ? 'p' : 'lab'; if (o) nb(tg); else if (cur && cur.tag === tg) cur = null; return; }
      if (n === 'form') { cur = null; return; }
      if (n === 'img') { if (o) put({ t: '', img: { src: (t.attrs || {}).src, alt: (t.attrs || {}).alt } }); return; }
      if (n === 'input') { if (o) put({ t: '', fld: { type: (t.attrs || {}).type, ph: (t.attrs || {}).placeholder } }); return; }
      if (n === 'button') { if (o) { btn = { text: '' }; put({ t: '', btn }); } else btn = null; return; }
      if (n === 'a') { if (o) hrefs.push(t.attrs && t.attrs.href !== undefined ? t.attrs.href : null); else hrefs.pop(); return; }
      if (n === 'b' || n === 'i') d[n] = o ? d[n] + 1 : Math.max(0, d[n] - 1);
      return;
    }
    let txt = null;
    if (t.k === 'text') txt = t.raw;
    else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
    if (txt == null) return;
    if (inTitle) { title += txt; return; }
    if (inHead) return;
    if (sel) { if (opt) opt.t = a9Squash(opt.t + ' ' + txt); return; }
    if (btn) { btn.text = a9Squash(btn.text + ' ' + txt); return; }
    put({ t: txt, b: d.b > 0, i: d.i > 0, href: hrefs.length ? hrefs[hrefs.length - 1] : null });
  });
  const walk = (node) => (node.kids || []).forEach((k) => { if (k.runs) k.runs.forEach((r) => { if (r.sel) r.sel = { opts: r.sel.opts.map((x) => x.t).filter((x) => x) }; }); else if (k.list) k.items.forEach((it) => it.runs.forEach((r) => { if (r.sel) r.sel = { opts: r.sel.opts.map((x) => x.t).filter((x) => x) }; })); else walk(k); });
  walk(root);
  const has = (rs) => rs.some((r) => r.img || r.fld || r.btn || r.sel || r.t.trim());
  const clean = (node) => {
    node.kids = node.kids.filter((k) => (k.runs ? has(k.runs) : k.list ? (k.items = k.items.filter((it) => has(it.runs))).length > 0 : (clean(k), true)));
    return node;
  };
  return { title: a9Squash(title), tree: clean(root) };
}
// Страница всегда помещается в окно целиком: не влезает — шрифт ступеньками уменьшается, не меньше 56 %.
// Страница пересоздаётся (например, после «Проверить») — подгонка запускается заново: следит за самим узлом.
function useA9Fit(dep) {
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
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.8) { k -= 0.05; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    s.ro = new ResizeObserver(() => fit());
    s.ro.observe(page);
  });
  useEffect(() => () => { if (seen.current.ro) seen.current.ro.disconnect(); }, []);
  return ref;
}
// КАРТИНКИ САЙТА — файлы рядом с index.html (как в уроке 5 и практике 05p): рисунки зверей.
const PicSher = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FDE8C8" />
    <circle cx="80" cy="56" r="38" fill="#C9792B" />{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => <circle key={a} cx={80 + 36 * Math.cos(a * Math.PI / 180)} cy={56 + 36 * Math.sin(a * Math.PI / 180)} r="11" fill="#A85F1F" />)}
    <circle cx="80" cy="58" r="26" fill="#F2B45A" /><circle cx="70" cy="52" r="3.6" fill="#1F2937" /><circle cx="90" cy="52" r="3.6" fill="#1F2937" />
    <path d="M75 63 L85 63 L80 69 Z" fill="#7C3F12" /><path d="M80 69 Q74 75 70 72 M80 69 Q86 75 90 72" stroke="#7C3F12" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);
const PicFil = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#DCEFF5" /><rect y="88" width="160" height="22" fill="#B7DFA4" />
    <ellipse cx="88" cy="62" rx="40" ry="26" fill="#9AA5B1" /><rect x="58" y="74" width="12" height="20" rx="4" fill="#8A95A1" /><rect x="100" y="74" width="12" height="20" rx="4" fill="#8A95A1" />
    <circle cx="52" cy="52" r="20" fill="#9AA5B1" /><ellipse cx="62" cy="48" rx="12" ry="16" fill="#B4BEC8" />
    <path d="M38 58 Q30 80 40 92" stroke="#9AA5B1" strokeWidth="9" fill="none" strokeLinecap="round" /><circle cx="46" cy="46" r="3" fill="#1F2937" />
  </svg>
);
const PicJirafa = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#E3F2FD" /><rect y="92" width="160" height="18" fill="#B7DFA4" />
    <rect x="76" y="26" width="14" height="52" rx="6" fill="#F3C25A" /><ellipse cx="96" cy="78" rx="28" ry="14" fill="#F3C25A" />
    <rect x="76" y="86" width="7" height="14" fill="#D9A43F" /><rect x="108" y="86" width="7" height="14" fill="#D9A43F" />
    <ellipse cx="76" cy="24" rx="15" ry="10" fill="#F3C25A" /><circle cx="72" cy="21" r="2.6" fill="#1F2937" /><path d="M80 14 V8 M86 15 V9" stroke="#B9822A" strokeWidth="3" strokeLinecap="round" />
    {[[82, 36], [80, 52], [85, 66], [96, 74], [110, 80], [102, 84]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.6" fill="#B9822A" />)}
  </svg>
);
const PicPanda = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#E8F5E9" />
    <path d="M128 110 V30 M138 110 V44" stroke="#5BB46F" strokeWidth="5" /><path d="M128 50 L142 44 M138 66 L150 60" stroke="#5BB46F" strokeWidth="3" />
    <circle cx="58" cy="30" r="11" fill="#1F2937" /><circle cx="102" cy="30" r="11" fill="#1F2937" /><circle cx="80" cy="58" r="34" fill="#fff" stroke="#1F2937" strokeWidth="2" />
    <ellipse cx="68" cy="54" rx="8" ry="10" fill="#1F2937" /><ellipse cx="92" cy="54" rx="8" ry="10" fill="#1F2937" /><circle cx="69" cy="53" r="2.4" fill="#fff" /><circle cx="91" cy="53" r="2.4" fill="#fff" />
    <ellipse cx="80" cy="68" rx="5" ry="3.5" fill="#1F2937" />
  </svg>
);
const PicToshbaqa = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FFF8E1" /><rect y="86" width="160" height="24" fill="#D7CCA0" />
    <circle cx="124" cy="68" r="11" fill="#7CB342" /><circle cx="128" cy="65" r="2.4" fill="#1F2937" />
    <rect x="48" y="76" width="12" height="14" rx="5" fill="#7CB342" /><rect x="96" y="76" width="12" height="14" rx="5" fill="#7CB342" />
    <path d="M36 80 Q78 20 120 80 Z" fill="#558B2F" /><path d="M58 76 L66 52 L90 52 L98 76 M66 52 L78 40 L90 52" stroke="#33691E" strokeWidth="2.5" fill="none" />
  </svg>
);
const PicKapalak = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FCE4EC" />
    <ellipse cx="58" cy="44" rx="22" ry="18" fill="#7C5CFA" /><ellipse cx="102" cy="44" rx="22" ry="18" fill="#7C5CFA" />
    <ellipse cx="62" cy="72" rx="16" ry="13" fill="#FA4F28" /><ellipse cx="98" cy="72" rx="16" ry="13" fill="#FA4F28" />
    <circle cx="58" cy="44" r="6" fill="#FDD835" /><circle cx="102" cy="44" r="6" fill="#FDD835" />
    <rect x="76" y="34" width="8" height="50" rx="4" fill="#1F2937" /><path d="M78 34 Q70 20 64 18 M82 34 Q90 20 96 18" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);
const A9_PICS = { 'sher.jpg': PicSher, 'fil.jpg': PicFil, 'jirafa.jpg': PicJirafa, 'panda.jpg': PicPanda, 'toshbaqa.jpg': PicToshbaqa, 'kapalak.jpg': PicKapalak };
const IMG_FILES = Object.keys(A9_PICS);
// Картинка честно, как в браузере: есть файл — рисунок; нет файла — значок сломанной картинки и alt; нет src — только alt.
function A9Img({ src, alt }) {
  const Pic = src ? A9_PICS[src] : null;
  if (Pic) return <span className="a9-imgbox" role="img" aria-label={alt || src}><Pic /></span>;
  if (src) return <span className="a9-broken"><i className="a9-broken-ic" aria-hidden="true" />{alt ? <span>{alt}</span> : null}</span>;
  return alt ? <span className="a9-alt">{alt}</span> : null;
}
// Поле и кнопка — как рисует Chrome (уроки 6–7).
function A9Field({ type, ph }) {
  const t = a9Squash(type).toLowerCase() || 'text';
  return (
    <span className={'a9-in' + (t === 'number' ? ' is-num' : '')}>
      {ph ? <span className="a9-in-ph">{ph}</span> : <span className="a9-in-v">{' '}</span>}
      {t === 'number' ? <i className="a9-spin" aria-hidden="true" /> : null}
    </span>
  );
}
const A9Btn = ({ text }) => <span className="a9-btn">{text || ' '}</span>;
// Список выбора — поле со стрелкой, в нём первый пункт (урок 7).
const A9Sel = ({ opts }) => <span className="a9-sel"><span className="a9-sel-v">{(opts && opts[0]) || ' '}</span><i className="a9-chev" aria-hidden="true" /></span>;
// Сайт длиннее окна — страница прокручивается, как в браузере; to — что показать: 'end' (новая часть внизу), 'top' или
// селектор узла (вывод: часть, о которой говорит Коди).
function A9Doc({ tree, flash, to }) {
  const pick = usePick();
  const key = JSON.stringify(tree);
  const ref = useA9Fit(key);
  useLayoutEffect(() => {
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!page || page.scrollHeight <= page.clientHeight + 1) return;
    let y = 0;
    if (to === 'end') y = page.scrollHeight;
    else if (to && to !== 'top') { const n = el.querySelector(to); if (n) y = n.getBoundingClientRect().top - el.getBoundingClientRect().top - 8; }
    if (page.scrollTo) page.scrollTo({ top: y, behavior: reduceMotion() ? 'auto' : 'smooth' }); else page.scrollTop = y;
  }, [key, to]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!tree || !tree.kids.length) return null;
  const runs = (rs) => rs.map((r, j) => {
    if (r.img) return <A9Img key={j} {...r.img} />;
    if (r.fld) return <A9Field key={j} {...r.fld} />;
    if (r.btn) return <A9Btn key={j} {...r.btn} />;
    if (r.sel) return <A9Sel key={j} {...r.sel} />;
    const c = ((r.b ? 'a9-wb' : '') + (r.i ? ' a9-wi' : '') + (r.href != null ? ' a9-a' : '')).trim() || undefined;
    return <span key={j} className={c}>{r.t}</span>;
  });
  const node = (n, i) => {
    if (n.runs) return <div key={i} className={'a9-blk a9-' + n.tag + (n.inh ? ' a9-inh' + n.inh : '')}>{runs(n.runs)}</div>;
    if (n.list) {
      const L = n.list === 'ol' ? 'ol' : 'ul';
      return React.createElement(L, { key: i, className: 'a9-list' }, n.items.map((it, j) => <li key={j}>{runs(it.runs)}</li>));
    }
    return <div key={i} className={'a9-reg a9-reg-' + n.tag} style={{ '--c': PART_C[n.tag] }}><span className="a9-reg-tag" translate="no">{n.tag}</span>{n.kids.map(node)}</div>;
  };
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a9-doc' + (flash ? ' a9-in-a' : '')}>
      <span className="a9-insp-badge"><i aria-hidden="true" />{pick(UI.insp)}</span>
      {tree.kids.map(node)}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a9Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a9-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a9-t">{p}</span>;
    return (
      <span key={i} className="a9-g">
        <span className="a9-b">{'<' + m[1]}</span><span className="a9-n">{m[2]}</span>
        {m[3] ? <span className="a9-a">{m[3]}</span> : null}<span className="a9-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a9Insert(el, ch) {
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
const A9_MAX = 1200;
function A9Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a9-edit');
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
    <div key={key} className={'a9-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a9Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a9-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a9-edit' + (led ? ' is-led' : '')}>
        <div className="a9-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a9-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A9_MAX)); }}
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
function A9Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a9-ed a9-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a9-ln a9-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a9-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a9Hl(t) : '​'}</button>
      ) : <div key={i} className={'a9-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a9Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A9Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a9-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a9Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР — браузер урока (PaperBrowser) с одной вкладкой: сайт ученика, на вкладке — его title.
// tabs: [{ st: 'ok' | 'off', name, ico, c }]; cur — открытая вкладка, title — её название
// сейчас. Сломанная страница — серый значок «!», починенная — цветной.
// ─────────────────────────────────────────────────────────────────────────────
const A9_ICO = {
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
  news: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
  gear: <><circle cx="12" cy="12" r="3.4" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};

const A9Fav = ({ ico, c, off }) => (
  <i className={'a9-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A9_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A9Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl, url, onBack }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a9-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a9-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a9-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a9-pop' : '')}>
            <A9Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a9-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A9Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a9-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn a9-back" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
        <span className="kz-br-url"><i className="kz-br-lock" aria-hidden="true" /><span className="kz-br-url-t">{url || 'index.html'}</span></span>
      </div>
      <div className="kz-br-body">
        <Cut c={KZ.cream} seed={32} n={16} amp={1.1} asp={1.6} cls="kz-br-paper" />
        <div className="kz-br-page">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// НАГЛЯДНАЯ ПОМОЩЬ — видна сразу, подписи — названия тегов.
// ─────────────────────────────────────────────────────────────────────────────
// План сайта — девять шагов (карта практики): сделанный — зелёный с галочкой, текущий — оранжевый.
const PLAN = ['title', 'h1', 'nav', 'section', 'ul', 'img', 'footer', 'form', 'select'].map((code, i) => ({ id: 't' + (i + 1), code }));
function A9Plan({ cur, all, hidden }) {
  const pick = usePick();
  const store = useStore();
  return (
    <div className={'a9-plan' + (hidden ? ' is-hidden' : '')} aria-label={pick(UI.plan)}>
      {PLAN.map((x, i) => {
        const rec = store.get(x.id);
        const done = all || !!(rec && rec.solved);
        return (
          <span key={x.id} className={'a9-st' + (done ? ' is-done' : '') + (i === cur && !all ? ' is-cur' : '')} title={pick(C['t' + (i + 1)].eyebrow)}>
            <b>{i + 1}</b><i translate="no">{x.code}</i>
          </span>
        );
      })}
    </div>
  );
}
// Части кода по порядку — как в редакторе.
function A9Parts({ parts }) {
  const pick = usePick();
  return (
    <div className="a9-slots" translate="no">
      {parts.map((x, n) => (
        <span key={n} className="a9-slot" style={{ '--pc': 'var(--r-html)' }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(x.word)}</em>}
        </span>
      ))}
    </div>
  );
}
// Файлы картинок рядом с index.html (урок 5): рисунок и имя.
function A9Files({ lit }) {
  const pick = usePick();
  return (
    <div className="a9-files a9-pics" translate="no">
      <span className="a9-files-l">{pick(UI.files)}:</span>
      {IMG_FILES.map((f) => {
        const Pic = A9_PICS[f];
        return <span key={f} className={'a9-pic' + (lit === f ? ' is-on' : '')}><i aria-hidden="true"><Pic /></i><code>{f}</code></span>;
      })}
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
const A9Sample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="a9-sample">
      <span className="a9-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A9Code lines={lines} cls="a9-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A9_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA9Task(cfg) {
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
    if (fails >= A9_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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

function A9TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA9Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const store = useStore();
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick, store, drilling
  });
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.a9-main .a9-ln', rec.done, drilling, t.msg, lv);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a9-sheet a9-' + cfg.id + (v.big ? ' is-big' : '')}>
        <A9Plan cur={cfg.num - 1} />
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'a9-work' + (v.big ? ' is-big' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')}>
          <div className="a9-side">
            <A9Browser tabs={[{ st: 'ok', ico: 'star', c: '#FA4F28' }]} cur={0} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}
              url="index.html">
              <A9Doc tree={v.tree} flash={t.flash} to={v.to || 'end'} />
            </A9Browser>
            {v.aid || null}
          </div>
          <div className="a9-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A9Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A9Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}




// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ. Один сайт ученика растёт по шагам (заказчик, 06.11.2026: в финальной практике заданий больше пяти):
// t1 title → t2 header с h1 → t3 меню nav в header → t4 main с разделом h2 и p → t5 список в разделе → t6 раздел с
// картинкой → t7 footer с абзацем → t8 форма в footer: label и input → t9 в форме: select и button.
// В редакторе — только новый кусок, готовые части — свёрнутыми строками или вокруг места вставки; в браузере —
// весь сайт целиком.
// ─────────────────────────────────────────────────────────────────────────────
const A9_DOC = '<!DOCTYPE html>';
const A9_N = 9;
const a9Wrap = (tag, inner) => '<' + tag + '>' + inner + '</' + tag + '>';
const a9Link = (href, text) => '<a href="' + href + '">' + text + '</a>';
const a9Img = (src, alt) => '<img src="' + src + '" alt="' + alt + '">';
const a9Ind = (lines, n) => lines.map((s) => ' '.repeat(n) + s);
// Вставка куска перед последним закрывающим тегом / сразу после открывающего.
function a9LastClose(code, tag) {
  const re = new RegExp('<\\s*/\\s*' + tag + '\\s*>', 'gi');
  let m, k = -1;
  while ((m = re.exec(code))) k = m.index;
  return k;
}
const a9Ins = (code, tag, piece) => {
  const c = code || '';
  if (!piece) return c;
  const k = a9LastClose(c, tag);
  return k < 0 ? c + '\n' + piece : c.slice(0, k) + piece + '\n' + c.slice(k);
};
const a9InsOpen = (code, tag, piece) => {
  const c = code || '';
  if (!piece) return c;
  const m = new RegExp('<\\s*' + tag + '\\s*>', 'i').exec(c);
  if (!m) return c + '\n' + piece;
  const k = m.index + m[0].length;
  return c.slice(0, k) + '\n' + piece + c.slice(k);
};
// Части сайта из кусков заданий.
const a9Body = (P) => ({
  header: a9Ins(P.t2, 'header', P.t3),
  main: a9Ins(a9Ins(P.t4, 'section', P.t5), 'main', P.t6),
  footer: a9InsOpen(P.t7, 'footer', a9Ins(P.t8, 'form', P.t9))
});
const a9Full = (P) => { const B = a9Body(P); return [A9_DOC, '<html>', '<head>', P.t1 || '', '</head>', '<body>', B.header, B.main, B.footer, '</body>', '</html>'].join('\n'); };
// Готовая часть из стора (решённое задание) или запасная — для входа на экран без прошлых (отладка, повтор).
const a9Got = (store, id, fb) => { const r = store.get(id); return r && r.solved && r.st && r.st.code ? r.st.code : fb; };
const a9Def = (pk) => ({
  t1: a9Wrap('title', pk(XTRA.site)),
  t2: ['<header>', '  ' + a9Wrap('h1', pk(XTRA.site)), '</header>'].join('\n'),
  t3: a9Wrap('nav', a9Link('index.html', pk(XTRA.home))),
  t4: ['<main>', '  <section>', '    ' + a9Wrap('h2', pk(XTRA.about)), '    ' + a9Wrap('p', pk(XTRA.aboutP)), '  </section>', '</main>'].join('\n'),
  t5: ['<ul>', '  ' + a9Wrap('li', pk(XTRA.li1)), '  ' + a9Wrap('li', pk(XTRA.li2)), '</ul>'].join('\n'),
  t6: ['<section>', '  ' + a9Wrap('h2', pk(XTRA.pet)), '  ' + a9Img('panda.jpg', pk(XTRA.panda)), '</section>'].join('\n'),
  t7: ['<footer>', '  ' + a9Wrap('p', pk(XTRA.copy)), '</footer>'].join('\n'),
  t8: ['<form>', '  <label>' + pk(XTRA.name) + ' <input type="text"></label>', '</form>'].join('\n'),
  t9: ['<select>', '  ' + a9Wrap('option', pk(XTRA.li1)), '  ' + a9Wrap('option', pk(XTRA.li2)), '</select>', a9Wrap('button', pk(XTRA.send))].join('\n')
});
// Куски заданий до n (и само задание — code).
function a9Pieces(store, pk, n, code) {
  const D = a9Def(pk);
  const P = {};
  for (let i = 1; i <= A9_N; i += 1) if (i < n) P['t' + i] = a9Got(store, 't' + i, D['t' + i]);
  if (code != null) P['t' + n] = code;
  return P;
}
const a9L = (code) => a9Lines(code || '', false);
// Разрезать строки по последней строке, подходящей под re: до неё и с неё.
const a9Split = (lines, re) => { let k = -1; lines.forEach((x, i) => { if (re.test(x)) k = i; }); return k < 0 ? [lines, []] : [lines.slice(0, k), lines.slice(k)]; };
const a9TitleOf = (P) => a9Page(a9Full({ t1: P.t1 })).title;
const A9_TOP = ['<body>', '  <header>…</header>'];
const A9_ALL = ['<body>', '  <header>…</header>', '  <main>…</main>'];
const A9_SYMS = ['<', '/', '>', '"', '='];
const a9Extra = (N) => a9Fb('extra', { got: N[1].tag ? '<' + N[1].tag + '>' : N[1].v || N[1].kind });
const a9First = (code) => { const r = a9Struct(code); if (r.msg) return { msg: r.msg }; if (!r.nodes.length) return { msg: FB.empty }; return { N: r.nodes, f: r.nodes[0] }; };
const a9Ok = (result) => ({ ok: true, result });
const a9No = (msg) => ({ ok: false, msg });

// Т1 · строка в head: <title>…</title> (урок 1).
function a9TitleCheck(code, want) {
  const t = lexA9(code);
  const bad = a9Bad(t);
  if (bad) return a9No(bad);
  if (!t.length) return a9No(FB.empty);
  if (t.some((x) => (x.k === 'open' || x.k === 'close') && x.name !== 'title') || t.some((x) => x.k === 'doc')) return a9No(FB.onlyTitle);
  if (t[0].k === 'text') return a9No(a9Fb('needOpenText', { tag: 'title' }));
  if (t[0].k === 'close') return a9No(a9Fb('closeStray', { got: 'title' }));
  if (!t[1] || t[1].k !== 'text') return a9No(a9Fb('needText', { tag: 'title' }));
  if (!a9Letters(t[1].v)) return a9No(FB.short);
  if (!t[2]) return a9No(a9Fb('needClose', { tag: 'title' }));
  if (t[2].k === 'open') return a9No(a9Fb('needSlash', { tag: 'title' }));
  if (t.length > 3) return a9No(a9Fb('extra', { got: t[3].v || ('<' + t[3].name + '>') }));
  if (want && a9Norm(t[1].v) !== a9Norm(want)) return a9No(fillL(FB.textOther, { tag: 'title', want }));
  return a9Ok({ title: t[1].v });
}
// Т2 · header с h1 (уроки 2, 8).
function a9H1Check(code, want) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind !== 'part' || f.tag !== 'header') return a9No(f.kind === 'block' ? FB.headerWrap : a9Fb('wrongOpen', { tag: 'header', got: f.tag || f.kind }));
  const h1 = f.kids.find((k) => k.kind === 'block' && k.tag === 'h1');
  if (!h1) return a9No(FB.h1InHeader);
  if (f.kids.length > 1) return a9No(FB.onlyH1);
  if (want && a9Norm(h1.text) !== a9Norm(want)) return a9No(fillL(FB.textOther, { tag: 'h1', want }));
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ heading: h1.text });
}
// Т3 · меню nav со ссылкой — в header под h1 (уроки 4, 8).
function a9NavCheck(code, want) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind !== 'part' && (f.links || []).length) return a9No(FB.navWrap);
  if (f.kind !== 'part' || f.tag !== 'nav') return a9No(a9Fb('wrongOpen', { tag: 'nav', got: f.tag || f.kind }));
  const L = a9Links(f.kids);
  if (!L.length) return a9No(FB.navNoLink);
  if (L.some((l) => !a9Squash(l.href))) return a9No(FB.noHref);
  if (want) {
    if (a9Squash(L[0].href) !== want.href) return a9No(fillL(FB.hrefOther, { got: L[0].href, want: want.href }));
    if (a9Norm(L[0].text) !== a9Norm(want.link)) return a9No(fillL(FB.linkText, { want: want.link }));
  }
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ link: L[0].text });
}
// Т4 · main, в нём раздел section: h2 и абзац (уроки 2, 8).
function a9SecCheck(code, want) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind === 'part' && f.tag === 'section') return a9No(FB.mainWrap);
  if (f.kind !== 'part' || f.tag !== 'main') return a9No(a9Fb('wrongOpen', { tag: 'main', got: f.tag || f.kind }));
  const s = f.kids.find((k) => k.kind === 'part' && k.tag === 'section');
  if (!s) return a9No(f.kids.some((k) => k.kind === 'block') ? FB.secWrap : FB.needSection);
  if (!(s.kids[0] && s.kids[0].kind === 'block' && s.kids[0].tag === 'h2')) return a9No(FB.secNeedH2);
  if (!s.kids.some((k) => k.kind === 'block' && k.tag === 'p')) return a9No(FB.secNeedP);
  if (want && a9Norm(s.kids[0].text) !== a9Norm(want)) return a9No(fillL(FB.textOther, { tag: 'h2', want }));
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ about: s.kids[0].text });
}
// Т5 · список ul из li — в разделе под абзацем (урок 3).
function a9ListCheck(code, min) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind === 'box' && f.tag === 'li') return a9No(FB.liNoList);
  if (f.kind !== 'box' || (f.tag !== 'ul' && f.tag !== 'ol')) return a9No(a9Fb('wrongOpen', { tag: 'ul', got: f.tag || f.kind }));
  if (f.kids.some((k) => !(k.kind === 'box' && k.tag === 'li'))) return a9No(FB.liWrap);
  if (f.kids.some((k) => !a9Letters(a9Text(k.kids)))) return a9No(FB.liText);
  const need = min || 2;
  if (f.kids.length < need) return a9No(need > 2 ? fillL(FB.liN, { n: need }) : FB.liTwo);
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ items: f.kids.length });
}
// Т6 · ещё раздел в main — h2 и картинка img с src из файлов и alt (урок 5).
function a9GalCheck(code, want) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind === 'part' && f.tag === 'main') return a9No(FB.oneMain);
  if (f.kind !== 'part' || f.tag !== 'section') return a9No(f.kind === 'block' || f.kind === 'img' ? FB.galWrap : a9Fb('wrongOpen', { tag: 'section', got: f.tag || f.kind }));
  if (!(f.kids[0] && f.kids[0].kind === 'block' && f.kids[0].tag === 'h2')) return a9No(FB.secNeedH2);
  const img = a9All(f.kids).find((k) => k.kind === 'img');
  if (!img) return a9No(FB.needImg);
  const src = a9Squash(img.attrs.src);
  if (!src) return a9No(FB.imgNoSrc);
  if (IMG_FILES.indexOf(src) < 0) return a9No(fillL(FB.imgNo, { got: src }));
  if (!a9Letters(img.attrs.alt)) return a9No(FB.imgNoAlt);
  if (want) {
    if (a9Norm(f.kids[0].text) !== a9Norm(want.h2)) return a9No(fillL(FB.textOther, { tag: 'h2', want: want.h2 }));
    if (src !== want.src) return a9No(fillL(FB.imgOther, { want: want.src }));
  }
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ pet: f.kids[0].text, src });
}
// Т7 · footer с абзацем (урок 8).
function a9FootCheck(code, want) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind !== 'part' || f.tag !== 'footer') return a9No(f.kind === 'block' ? FB.footPWrap : a9Fb('wrongOpen', { tag: 'footer', got: f.tag || f.kind }));
  const p = f.kids.find((k) => k.kind === 'block' && k.tag === 'p');
  if (!p) return a9No(FB.needFootP);
  if (want && a9Norm(p.text) !== a9Norm(want)) return a9No(fillL(FB.textOther, { tag: 'p', want }));
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ footer: p.text });
}
// Т8 · форма в footer над абзацем: label с надписью и input (урок 6).
const A9_TYPES = ['text', 'password', 'number', 'email'];
function a9FormCheck(code, want) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N, f } = r;
  if (f.kind !== 'box' || f.tag !== 'form') return a9No(f.kind === 'input' || (f.kind === 'box' && f.tag === 'label') ? FB.formWrap : a9Fb('wrongOpen', { tag: 'form', got: f.tag || f.kind }));
  const all = a9All(f.kids);
  const label = all.find((k) => k.kind === 'box' && k.tag === 'label');
  if (!label || !a9Letters(a9Text(label.kids))) return a9No(FB.needLabel);
  const inp = all.find((k) => k.kind === 'input');
  if (!inp) return a9No(FB.needInput);
  const ty = a9Squash(inp.attrs.type).toLowerCase();
  if (ty && A9_TYPES.indexOf(ty) < 0) return a9No(fillL(FB.typeOther, { got: ty }));
  if (want) {
    if (a9Norm(a9Text(label.kids)) !== a9Norm(want.label)) return a9No(fillL(FB.textOther, { tag: 'label', want: want.label }));
    if (ty !== want.type) return a9No(fillL(FB.typeNeed, { want: want.type }));
  }
  if (N.length > 1) return a9No(a9Extra(N));
  return a9Ok({ label: a9Text(label.kids) });
}
// Т9 · в форме: список выбора select из option и кнопка button (урок 7). Своя работа, без дополнительной задачи.
function a9SelCheck(code) {
  const r = a9First(code);
  if (r.msg) return a9No(r.msg);
  const { N } = r;
  const sel = N.find((k) => k.kind === 'box' && k.tag === 'select');
  if (!sel) return a9No(N.some((k) => k.kind === 'block' && k.tag === 'option') ? FB.optNoSel : FB.needSelect);
  if (sel.kids.some((k) => !(k.kind === 'block' && k.tag === 'option'))) return a9No(FB.optWrap);
  if (sel.kids.length < 2) return a9No(FB.optTwo);
  if (!N.some((k) => k.kind === 'block' && k.tag === 'button')) return a9No(FB.needButton);
  const other = N.find((k) => k !== sel && !(k.kind === 'block' && k.tag === 'button'));
  if (other) return a9No(a9Fb('extra', { got: other.tag ? '<' + other.tag + '>' : other.v || other.kind }));
  return a9Ok({ options: sel.kids.map((k) => k.text) });
}

// Вид задания: редактор с кусками вокруг места вставки, браузер — весь сайт; ed(P, x) → { before, after, single, big, aid, syms, to }.
function a9View(n, ed) {
  return (st, x) => {
    const P = a9Pieces(x.store, x.pick, n, st.code);
    const pg = a9Page(a9Full(P));
    const e = ed(P, x, st);
    return {
      title: pg.title, tree: pg.tree, to: e.to || 'end', tabHl: !!e.tabHl, pageHl: !e.tabHl, big: !!e.big, syms: e.syms,
      aid: e.aid,
      editor: <A9Editor before={e.before} after={e.after} value={st.code} single={!!e.single} big={!!e.big} onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const a9Cfg = (o) => (pick, store) => {
  const c = o(pick, store);
  return Object.assign({ init: () => ({ code: '' }) }, c, {
    drill: c.drillCheck ? { init: () => ({ code: '' }), check: (st) => c.drillCheck(st.code), view: c.view } : undefined
  });
};
const cfgT1 = a9Cfg((pick, store) => ({
  id: 't1', num: 1, kind: 'write-title', C: C.t1,
  check: (st) => a9TitleCheck(st.code),
  onSolved: (r) => store.set('mySite', r.result.title),
  view: a9View(1, () => ({ tabHl: true, to: 'top', single: true, before: [A9_DOC, '<html>', '<head>'], after: ['</head>', '<body>', '</body>', '</html>'],
    aid: <A9Parts parts={[{ code: '<title>' }, { word: UI.siteName }, { code: '</title>' }]} /> })),
  sample: (pk) => [a9Wrap('title', pk(XTRA.sampleT))],
  drillCheck: (code) => a9TitleCheck(code, pick(XTRA.blog))
}));
const cfgT2 = a9Cfg((pick) => ({
  id: 't2', num: 2, kind: 'write-header', C: C.t2,
  check: (st) => a9H1Check(st.code),
  view: a9View(2, (P) => ({ to: 'top', before: ['<head>', '  <title>' + a9TitleOf(P) + '</title>', '</head>', '<body>'], after: ['</body>'],
    aid: <A9Parts parts={[{ code: '<header>' }, { code: '<h1>…</h1>' }, { code: '</header>' }]} /> })),
  sample: (pk) => ['<header>', '  ' + a9Wrap('h1', pk(XTRA.sportH)), '</header>'],
  drillCheck: (code) => a9H1Check(code, pick(XTRA.sportH))
}));
const cfgT3 = a9Cfg((pick) => ({
  id: 't3', num: 3, kind: 'write-nav', C: C.t3,
  check: (st) => a9NavCheck(st.code),
  view: a9View(3, (P) => {
    const [b, a] = a9Split(a9L(P.t2), /<\/header>/);
    return { to: 'top', single: true, before: ['<body>'].concat(a9Ind(b, 2)), after: a9Ind(a, 2).concat(['</body>']), syms: A9_SYMS,
      aid: <A9Parts parts={[{ code: '<nav>' }, { code: '<a href="…">…</a>' }, { code: '</nav>' }]} /> };
  }),
  sample: (pk) => [a9Wrap('nav', a9Link('index.html', pk(XTRA.home)))],
  drillCheck: (code) => a9NavCheck(code, { link: pick(XTRA.games), href: 'oyinlar.html' })
}));
const cfgT4 = a9Cfg((pick) => ({
  id: 't4', num: 4, kind: 'write-section', C: C.t4,
  check: (st) => a9SecCheck(st.code),
  view: a9View(4, () => ({ before: A9_TOP, after: ['</body>'],
    aid: <A9Parts parts={[{ code: '<main>' }, { code: '<section>' }, { code: '<h2>…</h2>' }, { code: '<p>…</p>' }, { code: '</section>' }, { code: '</main>' }]} /> })),
  sample: (pk) => ['<main>', '  <section>', '    ' + a9Wrap('h2', pk(XTRA.games)), '    ' + a9Wrap('p', pk(XTRA.gamesP)), '  </section>', '</main>'],
  drillCheck: (code) => a9SecCheck(code, pick(XTRA.books))
}));
const cfgT5 = a9Cfg(() => ({
  id: 't5', num: 5, kind: 'write-list', C: C.t5,
  check: (st) => a9ListCheck(st.code),
  view: a9View(5, (P) => {
    const [b, a] = a9Split(a9L(P.t4), /<\/section>/);
    return { before: A9_TOP.concat(a9Ind(b, 2)), after: a9Ind(a, 2).concat(['</body>']),
      aid: <A9Parts parts={[{ code: '<ul>' }, { code: '<li>…</li>' }, { code: '<li>…</li>' }, { code: '</ul>' }]} /> };
  }),
  sample: (pk) => ['<ol>', '  ' + a9Wrap('li', pk(XTRA.g1)), '  ' + a9Wrap('li', pk(XTRA.g2)), '</ol>'],
  drillCheck: (code) => a9ListCheck(code, 3)
}));
const cfgT6 = a9Cfg((pick) => ({
  id: 't6', num: 6, kind: 'write-image', C: C.t6,
  check: (st) => a9GalCheck(st.code),
  view: a9View(6, (P, x, st) => {
    const img = lexA9(st.code).find((t) => t.k === 'open' && t.name === 'img');
    return { before: A9_TOP.concat(['  <main>', '    <section>…</section>']), after: ['  </main>', '</body>'], syms: A9_SYMS,
      aid: <><A9Parts parts={[{ code: '<section>' }, { code: '<h2>…</h2>' }, { code: '<img src="…" alt="…">' }, { code: '</section>' }]} /><A9Files lit={img && img.attrs ? img.attrs.src : null} /></> };
  }),
  sample: (pk) => ['<section>', '  ' + a9Wrap('h2', pk(XTRA.elephant)), '  ' + a9Img('fil.jpg', pk(XTRA.elephant)), '</section>'],
  drillCheck: (code) => a9GalCheck(code, { h2: pick(XTRA.butterfly), src: 'kapalak.jpg' })
}));
const cfgT7 = a9Cfg((pick, store) => ({
  id: 't7', num: 7, kind: 'write-footer', C: C.t7,
  check: (st) => a9FootCheck(st.code),
  onSolved: (r) => store.set('myFoot', r.result.footer),
  view: a9View(7, () => ({ before: A9_ALL, after: ['</body>'],
    aid: <A9Parts parts={[{ code: '<footer>' }, { code: '<p>…</p>' }, { code: '</footer>' }]} /> })),
  sample: (pk) => ['<footer>', '  ' + a9Wrap('p', pk(XTRA.copyS)), '</footer>'],
  drillCheck: (code) => a9FootCheck(code, pick(XTRA.copyS))
}));
const cfgT8 = a9Cfg((pick) => ({
  id: 't8', num: 8, kind: 'write-form', C: C.t8,
  check: (st) => a9FormCheck(st.code),
  view: a9View(8, (P) => {
    const L = a9L(P.t7);
    return { before: A9_ALL.concat(a9Ind(L.slice(0, 1), 2)), after: a9Ind(L.slice(1), 2).concat(['</body>']), syms: A9_SYMS,
      aid: <A9Parts parts={[{ code: '<form>' }, { code: '<label>…' }, { code: '<input type="text">' }, { code: '</label>' }, { code: '</form>' }]} /> };
  }),
  sample: (pk) => ['<form>', '  <label>' + pk(XTRA.email) + ' <input type="email"></label>', '</form>'],
  drillCheck: (code) => a9FormCheck(code, { label: pick(XTRA.age), type: 'number' })
}));
const cfgT9 = a9Cfg(() => ({
  id: 't9', num: 9, kind: 'write-select', C: C.t9,
  check: (st) => a9SelCheck(st.code),
  view: a9View(9, (P) => {
    const [b, a] = a9Split(a9L(a9InsOpen(P.t7, 'footer', P.t8)), /<\/form>/);
    return { big: true, before: A9_ALL.concat(a9Ind(b, 2)), after: a9Ind(a, 2).concat(['</body>']),
      aid: <A9Parts parts={[{ code: '<select>' }, { code: '<option>…</option>' }, { code: '<option>…</option>' }, { code: '</select>' }, { code: '<button>…</button>' }]} /> };
  }),
  sample: (pk) => ['<select>', '  ' + a9Wrap('option', pk(XTRA.g1)), '  ' + a9Wrap('option', pk(XTRA.g2)), '</select>', a9Wrap('button', pk(XTRA.join))]
}));

function A9Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A9TaskScreen p={p} cfg={cfg} />;
}
const TASKS = [cfgT1, cfgT2, cfgT3, cfgT4, cfgT5, cfgT6, cfgT7, cfgT8, cfgT9].map((make) => function A9T({ p }) { return <A9Task p={p} make={make} />; });


// Код сайта — строками для вывода и артефакта: части, списки и форма — с отступом внутри; заголовок, абзац, пункт,
// подпись, кнопка, меню — своей строкой; esc — для артефакта.
const A9_BOXL = { header: 1, main: 1, section: 1, footer: 1, ul: 1, ol: 1, form: 1, select: 1 };
const A9_LINE = { h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, li: 1, label: 1, button: 1, nav: 1, title: 1, option: 1 };
function a9Lines(code, esc) {
  const toks = lexA9(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const E = (s) => (esc ? escHtml(s) : s);
  const tagText = (t) => {
    if (t.k === 'close') return '</' + t.name + '>';
    const at = t.attrs || {};
    return '<' + t.name + (A9_ATTRS[t.name] || []).filter((a) => at[a] !== undefined).map((a) => ' ' + a + '="' + E(at[a]) + '"').join('') + '>';
  };
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  const isTag = (t) => t && (t.k === 'open' || t.k === 'close');
  toks.forEach((t, n) => {
    if (t.k === 'doc') return;
    if (isTag(t) && A9_BOXL[t.name]) {
      flush();
      if (t.k === 'close') depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + tagText(t));
      if (t.k === 'open') depth += 1;
      return;
    }
    if (isTag(t) && A9_LINE[t.name]) {
      if (t.k === 'open') { flush(); cur = tagText(t); return; }
      cur += tagText(t);
      flush();
      return;
    }
    if (t.k === 'open' && A9_VOID[t.name]) { if (cur.trim()) cur += tagText(t); else lines.push('  '.repeat(depth) + tagText(t)); return; }
    if (isTag(t)) { cur += tagText(t); return; }
    if (t.k === 'text') {
      let s2 = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || (isTag(prev) && (A9_BOXL[prev.name] || (A9_LINE[prev.name] && prev.k === 'close')))) s2 = s2.replace(/^\s+/, '');
      if (!next || (isTag(next) && (A9_BOXL[next.name] || (A9_LINE[next.name] && next.k === 'open')))) s2 = s2.replace(/\s+$/, '');
      cur += E(s2);
    }
  });
  flush();
  return lines;
}
// Весь сайт строками: head с title, body с частями.
function a9SiteLines(P, esc) {
  const tl = a9Lines(P.t1 || '', esc);
  return [A9_DOC, '<html>', '  <head>'].concat(a9Ind(tl, 4), ['  </head>', '  <body>'],
    a9Ind(a9Lines((() => { const B = a9Body(P); return [B.header, B.main, B.footer].join('\n'); })(), esc), 4), ['  </body>', '</html>']);
}

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: пустой файл index.html — «Boshlash»: появляются каркас и план из девяти шагов. Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const on = !!(rec && rec.done);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: on ? c.done : c.say, pose: on ? 'point' : 'hello' }]);
  const canGo = useAdvanceGate(on, spoken);
  const led = useIdleLed(!on, 0);
  const tap = () => {
    if (on) return;
    sfx('pop', true);
    put({ done: true });
    sayNow(c.start, 'wonder');
    say(c.done, 'point');
  };
  const lines = on ? [A9_DOC, '<html>', '  <head>', '    <title>…</title>', '  </head>', '  <body>', '    <header>…</header>', '    <main>…</main>', '    <footer>…</footer>', '  </body>', '</html>'] : [A9_DOC, ''];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a9-sheet a9-s1">
        <A9Plan cur={-1} hidden={!on} />
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="a9-work">
          <div className="a9-side">
            <A9Browser tabs={[{ st: 'ok', ico: 'star', c: '#FA4F28' }]} cur={0} title="" url="index.html" flash={on ? 1 : 0}>
              <div className="a9-doc a9-blank" />
            </A9Browser>
          </div>
          <div className="a9-main">
            <A9Code lines={lines} cls={on ? 'a9-in-a' : ''} />
            {!on ? (
              <div className="kz-row a9-row">
                <button type="button" className="kz-btn is-coral a9-publish" onClick={tap}>
                  <Icon name="doc" size={18} />{pick(UI.start)}<Led on={led} />
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
// ВЫВОД: план горит весь, открыт готовый сайт ученика; его код; что умеет; дальше — курс CSS.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const P = a9Pieces(store, pick, A9_N + 1);
  const pg = a9Page(a9Full(P));
  const lines = a9SiteLines(P, false);
  const RE = { title: /<title>/, header: /<header>/, nav: /<nav>/, main: /<main>/, list: /<(ul|ol)>/, img: /<img/, footer: /<footer>/, form: /<form>/ };
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = RE[curK] ? find(RE[curK]) : null;
  const SEL = { header: '.a9-reg-header', nav: '.a9-reg-nav', main: '.a9-reg-main', list: '.a9-list', img: '.a9-imgbox, .a9-broken', footer: '.a9-reg-footer', form: '.a9-lab' };
  const ROLES = ['title', 'header', 'nav', 'main', 'list', 'img', 'footer', 'form'];
  const RC = { title: '#E44D26', header: PART_C.header, nav: PART_C.nav, main: PART_C.main, list: '#D97706', img: '#0EA5E9', footer: PART_C.footer, form: '#7C5CFA' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a9-sheet a9-fin">
        <A9Plan all />
        <KzAsk text={c.ask} />
        <div className="a9-work">
          <div className="a9-side">
            <A9Browser tabs={[{ st: 'ok', ico: 'star', c: '#FA4F28' }]} cur={0} title={pg.title} pageHl={curK === 'own'} url="index.html"><A9Doc tree={pg.tree} to={SEL[curK] || 'top'} /></A9Browser>
            <div className="a9-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a9-main">
            <A9Code lines={lines} mark={mark} cls="a9-fincode" />
            <div className="kz-roles a9-roles">
              {ROLES.map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': RC[k] }}>
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
  { id: 's1', code: 'HOOK', Comp: S1 }
].concat(TASKS.map((Comp, i) => ({ id: 't' + (i + 1), code: 'LEVEL-' + (i + 1), Comp })), [
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
]);
// «Повторить» стирает только текущее задание (у названия и низа — и их сохранённые тексты).
const SCREEN_RESET = { s1: ['s1'], t1: ['t1', 'mySite'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5'], t6: ['t6'], t7: ['t7', 'myFoot'], t8: ['t8'], t9: ['t9'] };

// Артефакт — весь сайт ученика (тексты и адреса — через escHtml).
function practiceArtifact(store) {
  const P = {};
  for (let i = 1; i <= A9_N; i += 1) { const r = store.get('t' + i); if (r && r.solved && r.st) P['t' + i] = r.st.code; }
  if (!P.t9) return null;
  return { type: 'html-page', title: store.get('mySite') || '', footer: store.get('myFoot') || '', html: a9SiteLines(P, true).join('\n') };
}

export default function HtmlPraktika9({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
