// =============================================================================
// ПРАКТИКА 7 «Лагерь Коди» (облик «Редактор»), на основе практики 06p (tools/amaliyot6):
//   · разбор кода lexA7 (теги и атрибуты: у input — type и placeholder, у textarea — placeholder) / a7Group /
//     a7Form (заголовки, абзацы, form, label, input, select с option, textarea, button) — теги уроков 1–7,
//     одна самая полезная проблема;
//   · честный браузер a7Page / A7Doc / A7Sel / A7TArea / A7Btn — как в уроке 7: в список попадает только текст
//     внутри option; textarea — всё до </textarea> текст в поле; button — серая кнопка с надписью;
//   · редактор A7Editor, ряд символов A7Keys, браузер A7Browser с пятью вкладками-картой, ход задания
//     useA7Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================
// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–6, у открывающего — attrs), text (v — без крайних
// пробелов, raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A7_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'img', 'form', 'label', 'input', 'select', 'option', 'textarea', 'button'];
const A7_HEAD = /^h[1-6]$/;
const A7_INLINE = { b: 1, i: 1, a: 1 };
const A7_OUTER = { html: 1, head: 1, title: 1 };
const A7_TYPES = ['text', 'password', 'number'];
const a7Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a7Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a7Norm = (s) => a7Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,:]/g, '').replace(/\s+/g, ' ').trim();
function a7Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a7Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A7_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a7Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA7(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a7Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    if (A7_KNOWN.indexOf(name) >= 0) {
      const tok = { k: close ? 'close' : 'open', name, raw };
      if (!close) Object.assign(tok, a7Attrs(name, body.slice(name.length)));
      out.push(tok);
      continue;
    }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a7Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Атрибуты открывающего тега (уроки 4–7): у a — href, у img — src и alt, у input — type и placeholder, у textarea —
// placeholder; у других
// тегов атрибутов в курсе ещё нет. attrs — значения (нет атрибута — undefined); attrErr — первая ошибка записи:
// noEq, noQuote, attrTypo (другое имя, например placehoder), attrNone.
const A7_ATTRS = { a: ['href'], img: ['src', 'alt'], input: ['type', 'placeholder'], textarea: ['placeholder'] };
function a7Attrs(name, rest) {
  const attrs = {};
  let attrErr = null;
  const re = /\s*([^\s="']+)(\s*=\s*(?:"([^"]*)("?)|'([^']*)('?)|([^\s"']*)))?/g;
  let m;
  const src = String(rest || '');
  const ok = A7_ATTRS[name] || [];
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
const A7_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|form|label|input|select|option|textarea|button)\s*>)/i;
const a7Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a7Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a7Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'open' && t.attrErr) return a7Fb(t.attrErr.why, { bad: t.attrErr.bad || '', tag: t.attrErr.tag || t.name, attr: t.attrErr.attr || '', list: t.attrErr.list || '' });
    if (t.k === 'close' && t.name === 'input') return FB.inputClose;
    if (t.k === 'text') { const m = A7_NOLT.exec(t.v); if (m) return a7Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body (а в заданиях 2–4 — часть form): doctype, html, head, title, body (и form) — уже есть.
function a7Outer(toks, inForm) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A7_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
    if (inForm && (t.k === 'open' || t.k === 'close') && t.name === 'form') return FB.hasForm;
  }
  return null;
}
// Текст вместе с b, i и a внутри него — один кусок { k: 'text', v }. b, i и a закрываются внутри куска.
function a7Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0, a: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', inner: {} }; };
  const end = () => {
    if (!cur) return null;
    if (depth.a > 0) return FB.aOpen;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a7Fb('inlineOpen', { tag: tg });
    cur.v = a7Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A7_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a7Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') { depth[t.name] += 1; cur.inner[t.name] = ''; }
      else {
        if (!depth[t.name]) return { msg: a7Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a7Letters(cur.inner[t.name])) return { msg: a7Fb('inlineEmpty', { tag: t.name }) };
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


// РАЗБОР НА УЗЛЫ: { kind: 'block', tag, text } (заголовок, абзац), { kind: 'form', kids }, { kind: 'label', cap, ctrls },
// поля { kind: 'input', attrs }, { kind: 'select', opts: [текст] }, { kind: 'textarea', attrs, text },
// { kind: 'button', text }. opts.inForm — код пишется внутри form (form уже есть). Первая проблема — одна фраза { msg }.
const A7_CTRL = { input: 1, select: 1, textarea: 1, button: 1 };
function a7Form(src, opts) {
  const o = opts || {};
  const toks = lexA7(src);
  const bad = a7Bad(toks) || a7Outer(toks, o.inForm);
  if (bad) return { msg: bad };
  const g = a7Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  let i = 0;
  const closeOf = (tag, z) => {
    if (z && z.k === 'close' && z.name === tag) return null;
    if (z && z.k === 'open' && z.name === tag) return a7Fb('needSlash', { tag });
    return a7Fb(A7_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  // Поле: input, select с option, textarea (закрывается!), button с надписью.
  const ctrl = (t) => {
    i += 1;
    if (t.name === 'input') return { node: { kind: 'input', attrs: t.attrs || {} } };
    if (t.name === 'select') {
      const list = [];
      for (;;) {
        const x = L[i];
        if (!x) return { msg: a7Fb('needClose', { tag: 'select' }) };
        if (x.k === 'close' && x.name === 'select') { i += 1; break; }
        if (x.k === 'text') return { msg: a7Fb('wordNoOpt', { got: x.v }) };
        if (x.name === 'li' || x.name === 'p') return { msg: a7Fb('liNotOption', { got: x.name }) };
        if (x.k === 'open' && x.name === 'option') {
          const y = L[i + 1];
          if (!y || y.k !== 'text') return { msg: a7Fb('needText', { tag: 'option' }) };
          const m = closeOf('option', L[i + 2]);
          if (m) return { msg: m };
          list.push(y.v);
          i += 3;
          continue;
        }
        if (x.k === 'close') return { msg: a7Fb('closeStray', { got: x.name }) };
        return { msg: a7Fb('needClose', { tag: 'select' }) };
      }
      return { node: { kind: 'select', opts: list } };
    }
    if (t.name === 'textarea') {
      let text = '';
      if (L[i] && L[i].k === 'text') { text = L[i].v; i += 1; }
      if (!(L[i] && L[i].k === 'close' && L[i].name === 'textarea')) return { msg: FB.taOpen };
      i += 1;
      return { node: { kind: 'textarea', attrs: t.attrs || {}, text } };
    }
    const y = L[i];
    if (!y || y.k !== 'text') return { msg: y && y.k === 'close' && y.name === 'button' ? a7Fb('needText', { tag: 'button' }) : a7Fb('needClose', { tag: 'button' }) };
    const m = closeOf('button', L[i + 1]);
    if (m) return { msg: m };
    i += 2;
    return { node: { kind: 'button', text: y.v } };
  };
  const items = (until) => {
    const out = [];
    while (i < L.length) {
      const t = L[i];
      if (t.k === 'close' && until && t.name === until) { i += 1; return { list: out, closed: true }; }
      if (t.k === 'close') return { msg: a7Fb('closeStray', { got: t.name }) };
      if (t.k === 'text') return { msg: until === 'form' || o.inForm ? FB.needLabel : a7Fb('needOpenText', { tag: 'p' }) };
      if (A7_CTRL[t.name]) { const r = ctrl(t); if (r.msg) return r; out.push(r.node); continue; }
      if (t.name === 'option') return { msg: FB.optInSel };
      if (t.name === 'form') {
        if (until === 'form') return { msg: a7Fb('needSlash', { tag: 'form' }) };
        i += 1;
        const r = items('form');
        if (r.msg) return r;
        if (!r.closed) return { msg: a7Fb('needClose', { tag: 'form' }) };
        out.push({ kind: 'form', kids: r.list });
        continue;
      }
      if (t.name === 'label') {
        i += 1;
        let cap = '';
        const ctrls = [];
        for (;;) {
          const x = L[i];
          if (!x) return { msg: a7Fb('needClose', { tag: 'label' }) };
          if (x.k === 'close' && x.name === 'label') { i += 1; break; }
          if (x.k === 'text') { if (!ctrls.length) cap += ' ' + x.v; i += 1; continue; }
          if (x.k === 'open' && A7_CTRL[x.name]) { const r = ctrl(x); if (r.msg) return r; ctrls.push(r.node); continue; }
          if (x.k === 'open' && x.name === 'label') return { msg: a7Fb('needSlash', { tag: 'label' }) };
          return { msg: a7Fb('needClose', { tag: 'label' }) };
        }
        out.push({ kind: 'label', cap: a7Squash(cap), ctrls });
        continue;
      }
      if (A7_HEAD.test(t.name) || t.name === 'p') {
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a7Fb('needText', { tag: t.name }) };
        if (!a7Letters(y.v)) return { msg: FB.short };
        const m = closeOf(t.name, L[i + 2]);
        if (m) return { msg: m };
        out.push({ kind: 'block', tag: t.name, text: y.v });
        i += 3;
        continue;
      }
      return { msg: a7Fb('unknown', { bad: '<' + t.name + '>' }) };
    }
    return { list: out, closed: false };
  };
  const r = items(null);
  if (r.msg) return r;
  return { nodes: r.list };
}
// Все поля анкеты по порядку — и внутри label.
const a7Ctrls = (nodes) => [].concat(...(nodes || []).map((n) => (n.kind === 'label' ? n.ctrls : A7_CTRL[n.kind] ? [n] : [])));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроке 7. Окно — блоки { tag: 'h1'…'h6' | 'p' | 'lab' | 'raw', runs }: run — текст
// { t, b, i }, поле { fld }, список { sel: { opts } }, большое поле { ta: { ph, text } }, кнопка { btn: { text } }.
// select: в список попадает только текст внутри option, остальное внутри select браузер выбрасывает; textarea:
// всё до </textarea> — текст в поле, без </textarea> — весь код дальше; label — подпись и поле в одну строку;
// form не видна. o.vals — что набрали посетители в input; o.open — список раскрыт (панель под полем).
// ─────────────────────────────────────────────────────────────────────────────
function a7Page(src, o) {
  const opt = o || {};
  const blocks = [];
  let cur = null;
  let hOpen = 0;
  let fi = 0;
  let sel = null, optRun = null, btn = null;
  const d = { b: 0, i: 0 };
  const nb = (tag) => { cur = { tag, inh: A7_HEAD.test(tag) ? 0 : hOpen, runs: [] }; blocks.push(cur); };
  const put = (run) => { if (!cur) nb('raw'); cur.runs.push(run); };
  // textarea — до разбора: внутри него код не читается.
  const segs = [];
  let rest = String(src || '');
  for (;;) {
    const m = /<\s*textarea\b([^>]*)>/i.exec(rest);
    if (!m) { segs.push({ code: rest }); break; }
    segs.push({ code: rest.slice(0, m.index) });
    const after = rest.slice(m.index + m[0].length);
    const c = /<\s*\/\s*textarea\s*>/i.exec(after);
    const pm = /placeholder\s*=\s*(?:"([^"]*)|'([^']*))/i.exec(m[1]);
    const ph = pm ? (pm[1] !== undefined ? pm[1] : pm[2]) : undefined;
    const raw = c ? after.slice(0, c.index) : after;
    segs.push({ ta: { ph, text: raw.split('\n').map((l) => l.trim()).join('\n').trim() } });
    if (!c) break;
    rest = after.slice(c.index + c[0].length);
  }
  segs.forEach((sg) => {
    if (sg.ta) { if (!sel) { btn = null; put({ t: '', ta: sg.ta }); } return; }
    lexA7(sg.code).forEach((t) => {
      if (t.k === 'open' || t.k === 'close') {
        const n = t.name;
        if (sel) {   // внутри select браузер замечает только option и конец списка
          if (n === 'option') { if (t.k === 'open') { optRun = { t: '' }; sel.opts.push(optRun); } else optRun = null; }
          if (n === 'select' && t.k === 'close') { sel = null; optRun = null; }
          return;
        }
        if (n === 'select') { if (t.k === 'open') { btn = null; sel = { opts: [] }; put({ t: '', sel }); } return; }
        if (n === 'button') { if (t.k === 'open') { btn = { text: '' }; put({ t: '', btn }); } else btn = null; return; }
        if (A7_HEAD.test(n)) {
          if (t.k === 'open') { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); }
          else { hOpen = 0; cur = null; }
          return;
        }
        if (n === 'p' || n === 'label') { if (t.k === 'open') nb(n === 'p' ? 'p' : 'lab'); else if (cur && cur.tag === (n === 'p' ? 'p' : 'lab')) cur = null; return; }
        if (n === 'form') { cur = null; return; }
        if (n === 'input') {
          if (t.k !== 'open') return;
          const at = t.attrs || {};
          put({ t: '', fld: { type: at.type, ph: at.placeholder, val: opt.vals ? opt.vals[fi] : '' } });
          fi += 1;
          return;
        }
        if (n === 'b' || n === 'i') d[n] = t.k === 'open' ? d[n] + 1 : Math.max(0, d[n] - 1);
        return;
      }
      let txt = null;
      if (t.k === 'text') txt = t.raw;
      else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
      if (txt == null) return;
      if (sel) { if (optRun) optRun.t = a7Squash(optRun.t + ' ' + txt); return; }   // текст вне option в список не попадает
      if (btn) { btn.text = a7Squash(btn.text + ' ' + txt); return; }
      put({ t: txt, b: d.b > 0, i: d.i > 0 });
    });
  });
  blocks.forEach((bk) => bk.runs.forEach((r) => { if (r.sel) r.sel = { opts: r.sel.opts.map((x) => x.t).filter((x) => x), open: !!opt.open }; }));
  return { blocks: blocks.filter((bk) => bk.runs.some((r) => r.fld || r.sel || r.ta || r.btn || r.t.trim())) };
}
// Страница всегда помещается в окно целиком (как в уроке 2): не влезает — шрифт ступеньками
// уменьшается, не меньше 56 %. Страница пересоздаётся (например, после «Проверить») — подгонка
// запускается заново: следит за самим узлом.
function useA7Fit(dep) {
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
// ПОЛЯ — как рисует Chrome (уроки 6–7).
function A7Field({ type, ph, val, cls }) {
  const t = a7Squash(type).toLowerCase() || 'text';
  let v = String(val || '');
  if (t === 'number') v = v.replace(/\D/g, '');
  const shown = t === 'password' ? '•'.repeat(v.length) : v;
  return (
    <span className={'a7-in' + (t === 'number' ? ' is-num' : '') + (t === 'password' ? ' is-pass' : '') + (cls ? ' ' + cls : '')}>
      {v ? <span className="a7-in-v">{shown}</span> : ph ? <span className="a7-in-ph">{ph}</span> : <span className="a7-in-v">{' '}</span>}
      {t === 'number' ? <i className="a7-spin" aria-hidden="true" /> : null}
    </span>
  );
}
// Список: поле со стрелкой, в нём первый пункт; open — панель с пунктами под полем.
function A7Sel({ opts, open, cls }) {
  return (
    <span className={'a7-selw' + (open ? ' is-open' : '') + (cls ? ' ' + cls : '')}>
      <span className="a7-sel"><span className="a7-sel-v">{opts[0] || ' '}</span><i className="a7-chev" aria-hidden="true" /></span>
      {open ? <span className="a7-pop">{opts.length ? opts.map((x, j) => <span key={j} className={'a7-opt' + (j === 0 ? ' is-cur' : '')}>{x}</span>) : <span className="a7-pop-empty" />}</span> : null}
    </span>
  );
}
// Большое поле: текст переносится, ph — серая подсказка, в углу — уголок для растягивания.
const A7TArea = ({ ph, text, cls }) => (
  <span className={'a7-tx' + (cls ? ' ' + cls : '')}>
    {text ? <span className="a7-tx-v">{text}</span> : ph ? <span className="a7-tx-ph">{ph}</span> : <span className="a7-tx-v">{' '}</span>}
    <i className="a7-grip" aria-hidden="true" />
  </span>
);
// Кнопка — серая кнопка Chrome.
const A7Btn = ({ text, cls }) => <span className={'a7-btn' + (cls ? ' ' + cls : '')}>{text || ' '}</span>;
function A7Doc({ blocks, flash }) {
  const ref = useA7Fit(JSON.stringify(blocks));
  if (!blocks || !blocks.length) return null;
  const runs = (rs) => rs.map((r, j) => {
    if (r.fld) return <A7Field key={j} {...r.fld} />;
    if (r.sel) return <A7Sel key={j} {...r.sel} />;
    if (r.ta) return <A7TArea key={j} {...r.ta} />;
    if (r.btn) return <A7Btn key={j} {...r.btn} />;
    const c = ((r.b ? 'a7-wb' : '') + (r.i ? ' a7-wi' : '')).trim() || undefined;
    return <span key={j} className={c}>{r.t}</span>;
  });
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a7-doc' + (flash ? ' a7-in-a' : '')}>
      {blocks.map((bk, i) => <div key={i} className={'a7-blk a7-' + bk.tag + (bk.inh ? ' a7-inh' + bk.inh : '')}>{runs(bk.runs)}</div>)}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a7Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a7-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a7-t">{p}</span>;
    return (
      <span key={i} className="a7-g">
        <span className="a7-b">{'<' + m[1]}</span><span className="a7-n">{m[2]}</span>
        {m[3] ? <span className="a7-a">{m[3]}</span> : null}<span className="a7-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a7Insert(el, ch) {
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
const A7_MAX = 1200;
function A7Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a7-edit');
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
    <div key={key} className={'a7-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a7Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a7-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a7-edit' + (led ? ' is-led' : '')}>
        <div className="a7-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a7-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A7_MAX)); }}
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
function A7Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a7-ed a7-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a7-ln a7-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a7-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a7Hl(t) : '​'}</button>
      ) : <div key={i} className={'a7-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a7Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A7Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a7-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a7Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР С ПЯТЬЮ ВКЛАДКАМИ — браузер урока (PaperBrowser), вкладки — пять анкет лагеря (карта).
// tabs: [{ st: 'ok' | 'off', name, ico, c }]; cur — открытая вкладка, title — её название
// сейчас. Сломанная анкета — серый значок «!», починенная — цветной.
// ─────────────────────────────────────────────────────────────────────────────
const A7_ICO = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  pen: <><path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4z" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};

const A7Fav = ({ ico, c, off }) => (
  <i className={'a7-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A7_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A7Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl, url, onBack }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a7-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a7-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a7-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a7-pop' : '')}>
            <A7Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a7-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A7Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a7-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn a7-back" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
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
function useA7Tabs(all) {
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
function A7Parts({ parts }) {
  const pick = usePick();
  return (
    <div className="a7-slots" translate="no">
      {parts.map((x, n) => (
        <span key={n} className="a7-slot" style={{ '--pc': 'var(--r-html)' }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(x.word)}</em>}
        </span>
      ))}
    </div>
  );
}
// Части анкеты (урок 7): тег и как он выглядит на странице.
function A7Kinds() {
  const pick = usePick();
  return (
    <div className="a7-files a7-types" translate="no">
      <span className="a7-files-l">{pick(UI.parts)}:</span>
      <span className="a7-ty"><code>select</code><A7Sel opts={['…']} cls="is-mini" /></span>
      <span className="a7-ty"><code>textarea</code><A7TArea cls="is-mini" /></span>
      <span className="a7-ty"><code>button</code><A7Btn text="OK" cls="is-mini" /></span>
    </div>
  );
}
// Схема своей анкеты: body уже есть; h1, form, select, textarea и button — пишет ученик.
function A7Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a7-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a7-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a7-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a7-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a7-tree" translate="no">
      {row('', 'body', 'var(--r-body)', UI.given, true)}
      {row('├─ ', 'h1', 'var(--r-html)', UI.bpH1, D.h1)}
      {row('└─ ', 'form', 'var(--r-head)', UI.bpForm, D.form)}
      {row('   ├─ ', 'select', 'var(--r-html)', UI.bpSel, D.sel)}
      {row('   ├─ ', 'textarea', 'var(--r-html)', UI.bpTa, D.ta)}
      {row('   └─ ', 'button', 'var(--r-html)', UI.bpBtn, D.btn)}
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
const A7Sample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="a7-sample">
      <span className="a7-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A7Code lines={lines} cls="a7-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A7_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA7Task(cfg) {
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
    if (fails >= A7_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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

function A7TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA7Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA7Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.a7-main .a7-ln', rec.done, drilling, t.msg, lv);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a7-sheet a7-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'a7-work' + (v.big ? ' is-big' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')}>
          <div className="a7-side">
            <A7Browser tabs={tabs} cur={cfg.num - 1} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}
              url={v.url || TABS[cfg.num - 1].file}>
              <A7Doc blocks={v.blocks} flash={t.flash} />
            </A7Browser>
            {v.aid || null}
          </div>
          <div className="a7-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A7Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A7Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ. Анкета лагеря: заголовок, form, списки select, большие поля textarea, кнопки button.
// ─────────────────────────────────────────────────────────────────────────────
const A7_DOC = '<!DOCTYPE html>';
const a7Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);
const a7At = (n, v) => (v == null ? '' : ' ' + n + '="' + v + '"');
const a7Input = (type, ph) => '<input' + a7At('type', type) + a7At('placeholder', ph) + '>';
const a7Label = (cap, inner) => '<label>' + cap + ' ' + inner + '</label>';
const a7Opt = (w) => '<option>' + w + '</option>';
const a7Ta = (ph) => '<textarea' + a7At('placeholder', ph) + '></textarea>';
const a7Btn = (t) => '<button>' + t + '</button>';
const a7Sel = (words, ind) => ['<select>'].concat(words.map((w) => (ind || '  ') + a7Opt(w)), ['</select>']);
const a7Parts = (code, key) => <React.Fragment key={key}>{a7Hl(code)}</React.Fragment>;

// Т1 · поле в строке: имя тега у пункта списка (без него пункта в списке нет). d — страница, пункты, место.
const A7_T1 = { pg: 'smena', opts: 'oy', gap: 1 };
const A7_T1X = { pg: 'ovqat', opts: 'taom', gap: 1 };
function a7TagCheck(v) {
  const s = a7Squash(v).toLowerCase();
  if (!s) return { ok: false, msg: FB.emptyTag };
  if (/[<>\/"'=]/.test(s)) return { ok: false, msg: UI.noTags };
  if (s === 'option') return { ok: true };
  if (s === 'li' || s === 'p') return { ok: false, msg: a7Fb('liNotOption', { got: s }) };
  if (s === 'select') return { ok: false, msg: FB.selNotOption };
  if (a7Dist(s, 'option') <= 2) return { ok: false, msg: a7Fb('typo', { bad: '<' + s + '>', near: '<option>' }) };
  return { ok: false, msg: a7Fb('unknown', { bad: '<' + s + '>' }) };
}
function a7FieldView(d) {
  return (st, x) => {
    const v = st.v || '';
    const pg = x.pick(PG[d.pg]);
    const words = x.pick(OPT[d.opts]);
    const lines = [
      { k: 'h1', parts: [T_('h1'), W_(pg), T_('h1', true)] },
      { k: 'fo', parts: [T_('form')] },
      { k: 'so', d: 1, parts: [a7Parts('<select>', 's')] }
    ].concat(words.map((w, j) => (j !== d.gap ? { k: 'o' + j, d: 2, parts: [a7Parts(a7Opt(w), 'o')] } : {
      k: 'o' + j, d: 2, cls: x.solved ? 'is-new' : 'is-hl', parts: [
        <span key="lt" className="a7-g"><span className="a7-b">&lt;</span></span>,
        x.solved ? <span key="v" className="a7-n">{v}</span> : (
          <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
            <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={16}
              onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a7-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
          </span>),
        <span key="gt" className="a7-g"><span className="a7-b">&gt;</span></span>, W_(w), T_('option', true)
      ] })), [{ k: 'sc', d: 1, parts: [a7Parts('</select>', 'c')] }, { k: 'fc', parts: [T_('form', true)] }]);
    const code = '<h1>' + pg + '</h1><form><select>' + words.map((w, j) => (j === d.gap ? '<' + v + '>' + w + '</option>' : a7Opt(w))).join('') + '</select></form>';
    return {
      title: pg, url: d.pg + '.html', blocks: a7Page(code, { open: true }).blocks,
      editor: <div className="a7-fieldwrap"><KzCode cls="a7-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = () => ({
  id: 't1', num: 1, kind: 'write-option', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a7TagCheck(st.v),
  view: a7FieldView(A7_T1),
  sample: (pk) => a7Sel(pk(OPT.taom).slice(0, 2)),
  drill: { init: () => ({ v: '' }), check: (st) => a7TagCheck(st.v), view: a7FieldView(A7_T1X) }
});

// Т2 · строка: кнопка <button>…</button> целиком (button закрывается, надпись — между тегами).
function a7BtnCheck(code, want) {
  const r = a7Form(code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0].kind === 'label' && N[0].ctrls.length ? N[0].ctrls[0] : N[0];
  if (f.kind === 'input') return { ok: false, msg: FB.btnInput };
  if (f.kind !== 'button') return { ok: false, msg: a7Fb('wrongOpen', { tag: 'button', got: f.tag || f.kind }) };
  if (a7Norm(f.text) !== a7Norm(want)) return { ok: false, msg: fillL(FB.btnOther, { want }) };
  if (N.length > 1) return { ok: false, msg: a7Fb('extra', { got: N[1].kind === 'block' ? '<' + N[1].tag + '>' : '<' + N[1].kind + '>' }) };
  return { ok: true };
}
const A7_T2 = { pg: 'yozilish', btn: 'send' };
const A7_T2X = { pg: 'profil', btn: 'save' };
function a7LineView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  <h1>' + pg + '</h1>', '  <form>', '    ' + a7Label(x.pick(CAP.name), a7Input('text', x.pick(PH.name)))];
    const after = ['  </form>', '</body>'];
    return {
      title: pg, url: d.pg + '.html', blocks: a7Page(before.concat([st.code], after).join('\n')).blocks,
      aid: <A7Parts parts={[{ code: '<button>' }, { code: x.pick(BTN[d.btn]) }, { code: '</button>' }]} />,
      editor: <A7Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-button', C: C.t2,
  init: () => ({ code: '    ' }),
  check: (st) => a7BtnCheck(st.code, pick(BTN[A7_T2.btn])),
  view: a7LineView(A7_T2),
  sample: () => [a7Btn('OK')],
  drill: { init: () => ({ code: '    ' }), check: (st) => a7BtnCheck(st.code, pick(BTN[A7_T2X.btn])), view: a7LineView(A7_T2X) }
});

// Т3 · блок: select с тремя option (каждый пункт — в своём option).
function a7SelCheck(code, wants) {
  const r = a7Form(code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind !== 'select') return { ok: false, msg: a7Fb('wrongOpen', { tag: 'select', got: f.tag || f.kind }) };
  const have = f.opts.map(a7Norm);
  const miss = wants.find((w) => have.indexOf(a7Norm(w)) < 0);
  if (miss) return { ok: false, msg: fillL(FB.optMissing, { want: miss }) };
  if (f.opts.length !== wants.length) return { ok: false, msg: fillL(FB.needOpts, { n: String(wants.length) }) };
  if (N.length > 1) return { ok: false, msg: a7Fb('extra', { got: '<' + (N[1].tag || N[1].kind) + '>' }) };
  return { ok: true };
}
const A7_T3 = { pg: 'sport', opts: 'sport' };
const A7_T3X = { pg: 'sayohat', opts: 'sayohat' };
function a7SelView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  <h1>' + pg + '</h1>', '  <form>'];
    const after = ['  </form>', '</body>'];
    return {
      title: pg, url: d.pg + '.html', blocks: a7Page(before.concat([st.code], after).join('\n'), { open: true }).blocks, pageHl: true,
      aid: <A7Parts parts={[{ code: '<select>' }, { code: '<option>…</option>' }, { code: '</select>' }]} />,
      editor: <A7Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = (pick) => ({
  id: 't3', num: 3, kind: 'write-select', C: C.t3,
  init: () => ({ code: '    ' }),
  check: (st) => a7SelCheck(st.code, pick(OPT[A7_T3.opts])),
  view: a7SelView(A7_T3),
  sample: (pk) => a7Sel(pk(OPT.taom)),
  drill: { init: () => ({ code: '    ' }), check: (st) => a7SelCheck(st.code, pick(OPT[A7_T3X.opts])), view: a7SelView(A7_T3X) }
});

// Т4 · найти строку и исправить: слово в select без option (загадка урока 7) — его нет в списке; в
// дополнительной задаче — незакрытый textarea: код кнопки стал текстом в поле.
const A7_T4 = {
  pg: 'fikr', bad: 5, why: 'why', found: 'found', kind: 'opt',
  lines: (pk) => a7Body(['<h1>' + pk(PG.fikr) + '</h1>', '<form>', '  <select>', '    ' + a7Opt(pk(OPT.baho)[0]), '    ' + pk(OPT.baho)[1], '  </select>',
    '  ' + a7Btn(pk(BTN.send)), '</form>'])
};
const A7_T4X = {
  pg: 'savol', bad: 3, why: 'whyX', found: 'foundX', kind: 'ta',
  lines: (pk) => a7Body(['<h1>' + pk(PG.savol) + '</h1>', '<form>', '  <textarea' + a7At('placeholder', pk(PH.savol)) + '>', '  ' + a7Btn(pk(BTN.send)), '</form>'])
};
function a7FixView(d, C4) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const lines = d.lines(x.pick);
    const BAD = d.bad;
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
          if (d.kind === 'opt') { const a = el.value.length - el.value.trimStart().length; el.setSelectionRange(a, el.value.trimEnd().length); }
          else el.setSelectionRange(el.value.length, el.value.length);
        }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4[d.why][i] || C4[d.why][0]);
    };
    if (st.at == null) {
      return {
        title: pg, url: d.pg + '.html', blocks: a7Page(lines.join('\n'), { open: true }).blocks, pageHl: true, keys: false, ask: C4.ask,
        editor: <A7Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title: pg, url: d.pg + '.html', blocks: a7Page(before.concat([st.code], after).join('\n'), { open: true }).blocks, ask: C4.ask2,
      editor: <A7Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
// Строка пункта: слово в option (не в li и не в p), слово прежнее.
function a7OptLine(code, want) {
  const toks = lexA7(code);
  const bad = a7Bad(toks);
  if (bad) return { ok: false, msg: bad };
  const tag = toks.find((t) => t.k === 'open' || t.k === 'close');
  const txt = toks.find((t) => t.k === 'text');
  if (!tag) return { ok: false, msg: txt ? a7Fb('wordNoOpt', { got: txt.v }) : FB.empty };
  if (tag.name === 'li' || tag.name === 'p') return { ok: false, msg: a7Fb('liNotOption', { got: tag.name }) };
  if (tag.name !== 'option') return { ok: false, msg: a7Fb('wrongOpen', { tag: 'option', got: tag.name }) };
  const [a, b, c] = toks;
  if (!(a.k === 'open' && a.name === 'option')) return { ok: false, msg: a7Fb('needOpenText', { tag: 'option' }) };
  if (!b || b.k !== 'text') return { ok: false, msg: a7Fb('needText', { tag: 'option' }) };
  if (!c || c.k !== 'close' || c.name !== 'option') return { ok: false, msg: c && c.k === 'open' && c.name === 'option' ? a7Fb('needSlash', { tag: 'option' }) : a7Fb('needClose', { tag: 'option' }) };
  if (a7Norm(b.v) !== a7Norm(want)) return { ok: false, msg: FB.keepWord };
  if (toks.length > 3) return { ok: false, msg: a7Fb('extra', { got: toks[3].k === 'text' ? toks[3].v : toks[3].raw }) };
  return { ok: true };
}
// Строка большого поля: textarea с закрывающим тегом, placeholder прежний.
function a7TaLine(code, ph) {
  const r = a7Form(code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const f = r.nodes[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind !== 'textarea') return { ok: false, msg: a7Fb('wrongOpen', { tag: 'textarea', got: f.tag || f.kind }) };
  if (a7Norm(f.attrs.placeholder) !== a7Norm(ph)) return { ok: false, msg: FB.keepTa };
  if (r.nodes.length > 1) return { ok: false, msg: FB.keepTa };
  return { ok: true };
}
function a7FixCheck(st, d, pick) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  return d.kind === 'opt' ? a7OptLine(st.code, pick(OPT.baho)[1]) : a7TaLine(st.code, pick(PH.savol));
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a7FixCheck(st, A7_T4, pick),
  view: a7FixView(A7_T4, C.t4),
  sample: (pk) => ['<select>', '  ' + a7Opt(pk(OPT.taom)[0]), '  ' + a7Opt(pk(OPT.taom)[1]), '</select>'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a7FixCheck(st, A7_T4X, pick), view: a7FixView(A7_T4X, C.t4) }
});

// Т5 · своя анкета внутри body: h1, form, select (хотя бы два option), textarea, button.
function a7OwnCheck(code) {
  const r = a7Form(code, {});
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind !== 'block' || f.tag === 'p') return { ok: false, msg: FB.h1First };
  if (f.tag !== 'h1') return { ok: false, msg: a7Fb('mainH1', { got: f.tag }) };
  if (N.slice(1).some((b) => b.kind === 'block' && b.tag === 'h1')) return { ok: false, msg: FB.oneH1 };
  const loose = a7Ctrls(N).length > 0;
  const form = N.find((b) => b.kind === 'form');
  if (!form) return { ok: false, msg: loose ? FB.inForm : FB.needForm };
  if (loose) return { ok: false, msg: FB.inForm };
  const cs = a7Ctrls(form.kids);
  const sel = cs.find((c) => c.kind === 'select');
  if (!sel) return { ok: false, msg: FB.needSel };
  if (sel.opts.length < 2) return { ok: false, msg: FB.twoOpts };
  if (!cs.some((c) => c.kind === 'textarea')) return { ok: false, msg: FB.needTa };
  const btn = cs.find((c) => c.kind === 'button');
  if (!btn) return { ok: false, msg: FB.needBtn };
  return { ok: true, result: { heading: f.text, options: sel.opts, button: btn.text, code } };
}
// Что уже есть в своей анкете (для схемы): терпимо к недописанному коду.
function a7OwnDone(code) {
  const tk = lexA7(code);
  const n = (k, name) => tk.filter((t) => t.k === k && t.name === name).length;
  const bi = tk.findIndex((t) => t.k === 'open' && t.name === 'button');
  return { h1: n('open', 'h1') > 0 && n('close', 'h1') > 0, form: n('open', 'form') > 0 && n('close', 'form') > 0,
    sel: n('open', 'select') > 0 && n('close', 'select') > 0 && n('close', 'option') >= 2,
    ta: n('open', 'textarea') > 0 && n('close', 'textarea') > 0,
    btn: bi >= 0 && !!tk[bi + 1] && tk[bi + 1].k === 'text' && !!tk[bi + 2] && tk[bi + 2].k === 'close' && tk[bi + 2].name === 'button' };
}
// Код анкеты — строками: form и select — с отступом внутри, пункт, поле, кнопка, заголовок — своей строкой;
// esc — для артефакта.
function a7Lines(code, esc) {
  const toks = lexA7(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const LINE = { p: 1, label: 1, option: 1, textarea: 1, button: 1 };
  const isLine = (t) => (t.k === 'open' || t.k === 'close') && (A7_HEAD.test(t.name) || !!LINE[t.name]);
  const isBox = (t) => (t.k === 'open' || t.k === 'close') && (t.name === 'form' || t.name === 'select');
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  const val = (v) => (esc ? escHtml(v) : v);
  const tagText = (t) => {
    if (t.k === 'close') return '</' + t.name + '>';
    const at = t.attrs || {};
    const keys = t.name === 'input' ? ['type', 'placeholder'] : t.name === 'textarea' ? ['placeholder'] : t.name === 'img' ? ['src', 'alt'] : t.name === 'a' ? ['href'] : [];
    return '<' + t.name + keys.filter((k) => at[k] !== undefined).map((k) => ' ' + k + '="' + val(at[k]) + '"').join('') + '>';
  };
  toks.forEach((t, n) => {
    if (t.k === 'close' && t.name === 'input') return;
    if (isBox(t)) {
      flush();
      if (t.k === 'close') depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + tagText(t));
      if (t.k === 'open') depth += 1;
      return;
    }
    if (t.k === 'open' && t.name === 'input' && !cur) { lines.push('  '.repeat(depth) + tagText(t)); return; }
    if (isLine(t)) {
      if (t.k === 'open') { if (t.name !== 'label' && /^<label>/.test(cur)) { cur += ' ' + tagText(t); return; } flush(); cur = tagText(t); return; }
      cur += tagText(t);
      if (t.name === 'label' || !/^<label>/.test(cur)) flush();
      return;
    }
    if (t.k === 'open' || t.k === 'close') { cur += (t.name === 'input' && cur && !/\s$/.test(cur) ? ' ' : '') + tagText(t); return; }
    if (t.k === 'text') {
      let s2 = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || isLine(prev) || isBox(prev)) s2 = s2.replace(/^\s+/, '');
      if (!next || isLine(next) || isBox(next)) s2 = s2.replace(/\s+$/, '');
      cur += esc ? escHtml(s2) : s2;
    }
  });
  flush();
  return lines;
}
const a7OwnSample = (pk) => ['<h1>' + pk(XTRA.ownH) + '</h1>', '<form>'].concat(a7Sel(pk(XTRA.ownOpts)).map((s) => '  ' + s),
  ['  ' + a7Ta(pk(PH.about)), '  ' + a7Btn(pk(XTRA.ownBtn)), '</form>']);
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-form', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a7OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myOpts', r.result.options); store.set('myBtn', r.result.button);
    store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), blocks: a7Page(st.code).blocks, big: true,
    aid: <><A7Tree done={a7OwnDone(st.code)} /><A7Kinds /></>,
    editor: <A7Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: a7OwnSample
});

function A7Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A7TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A7Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A7Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A7Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A7Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A7Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: анкета смены, в списке три месяца → «Saqlash» → сбой: у июля стёрлось имя тега — пункт пропал
// из списка, вкладки гаснут. Одно касание.
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
  const all = useA7Tabs(true);
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
  const pg = pick(PG.smena);
  const w = pick(OPT.oy);
  const lines = ['<h1>' + pg + '</h1>', '<form>', '  <select>', '    ' + a7Opt(w[0]), '    ' + (broke ? '<>' + w[1] + '</option>' : a7Opt(w[1])), '    ' + a7Opt(w[2]), '  </select>', '</form>'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a7-sheet a7-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a7-work">
          <div className="a7-side">
            <A7Browser tabs={tabs} cur={0} title={pg} cls={boom ? 'a7-glitch' : ''} url="smena.html">
              <A7Doc blocks={a7Page(lines.join('\n'), { open: true }).blocks} />
            </A7Browser>
          </div>
          <div className="a7-main">
            <A7Code lines={lines} cls={boom ? 'a7-glitch' : ''} mark={broke ? 4 : null} />
            {!broke ? (
              <div className="kz-row a7-row">
                <button type="button" className="kz-btn is-coral a7-publish" onClick={tap}>
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
  const tabs = useA7Tabs(true);
  const code = store.get('myCode') || a7OwnSample(pick).join('\n');
  const lines = a7Body(a7Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'select' ? find(/<select>/) : curK === 'option' ? find(/<option>/) : curK === 'textarea' ? find(/<textarea/) : curK === 'button' ? find(/<button>/) : null;
  const ROLE_C = { select: '#FA4F28', option: '#7C5CFA', textarea: '#0FA38E', button: '#F59E0B', own: '#E44D26' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a7-sheet a7-fin">
        <KzAsk text={c.ask} />
        <div className="a7-work">
          <div className="a7-side">
            <A7Browser tabs={tabs} cur={4} title={pick(TABS[4].name)} pageHl={curK === 'own'} url="anketa.html"><A7Doc blocks={a7Page(code, { open: curK === 'option' || curK === 'select' }).blocks} /></A7Browser>
            <div className="a7-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a7-main">
            <A7Code lines={lines} mark={mark} />
            <div className="kz-roles a7-roles">
              {['select', 'option', 'textarea', 'button', 'own'].map((k) => (
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
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'myOpts', 'myBtn', 'myTab'] };

// Артефакт — своя анкета из задания 5 (тексты и значения атрибутов — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', options: store.get('myOpts') || [], button: store.get('myBtn') || '',
    html: [A7_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a7Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika7({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
