// =============================================================================
// ПРАКТИКА 5 «Зоопарк Коди» (облик «Редактор»), на основе практики 04p (tools/amaliyot4):
//   · разбор кода lexA5 (теги и атрибуты: у a — href, у img — src и alt) / a5Group / a5Plan / a5Blocks
//     (заголовки, абзацы, списки, картинки) — теги уроков 1–5, одна самая полезная проблема;
//   · честный браузер a5Page / A5Doc / A5Img — как в уроке 5: есть файл — рисунок, нет файла — значок
//     сломанной картинки и alt, нет src — только alt; у img нет закрывающего тега;
//   · редактор A5Editor, ряд символов A5Keys, браузер A5Browser с пятью вкладками-картой, ход задания
//     useA5Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–2), text (v — без крайних пробелов,
// raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A5_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'img'];
const A5_LIST = { ul: 1, ol: 1 };
const A5_HEAD = /^h[1-6]$/;
const A5_INLINE = { b: 1, i: 1, a: 1 };
const A5_OUTER = { html: 1, head: 1, title: 1 };
const a5Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a5Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a5Norm = (s) => a5Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,:]/g, '').replace(/\s+/g, ' ').trim();
function a5Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a5Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A5_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a5Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA5(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a5Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    if (A5_KNOWN.indexOf(name) >= 0) {
      const tok = { k: close ? 'close' : 'open', name, raw };
      if (!close) Object.assign(tok, a5Attrs(name, body.slice(name.length)));
      out.push(tok);
      continue;
    }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a5Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Атрибуты открывающего тега (урок 4): у a — href="имя файла"; у других тегов атрибутов в курсе ещё нет.
// attrs.href — значение (нет href — undefined); attrErr — первая ошибка записи: noEq (href без =), noQuote
// (значение без кавычек), attrTypo (другое имя атрибута), attrNone (атрибут у тега, которому он не нужен).
// Атрибуты открывающего тега (уроки 4–5): у a — href, у img — src и alt; у других тегов атрибутов в курсе
// ещё нет. attrs — значения (нет атрибута — undefined); attrErr — первая ошибка записи: noEq, noQuote,
// hrefOnImg (href у картинки — загадка урока 5), attrTypo, attrNone.
const A5_ATTRS = { a: ['href'], img: ['src', 'alt'] };
function a5Attrs(name, rest) {
  const attrs = {};
  let attrErr = null;
  const re = /\s*([^\s="']+)(\s*=\s*(?:"([^"]*)("?)|'([^']*)('?)|([^\s"']*)))?/g;
  let m;
  const src = String(rest || '');
  const ok = A5_ATTRS[name] || [];
  while (src.slice(re.lastIndex).trim() && (m = re.exec(src))) {
    if (!m[0]) break;
    const an = m[1].toLowerCase();
    if (!ok.length) { attrErr = attrErr || { why: 'attrNone', tag: name }; continue; }
    if (name === 'img' && an === 'href') {
      attrErr = attrErr || { why: 'hrefOnImg' };
      attrs.href = m[3] !== undefined ? m[3] : m[5] !== undefined ? m[5] : (m[7] || '');
      continue;
    }
    if (ok.indexOf(an) < 0) { attrErr = attrErr || { why: 'attrTypo', bad: m[1] }; continue; }
    if (!m[2]) { attrErr = attrErr || { why: 'noEq', attr: an }; attrs[an] = ''; continue; }
    if (m[3] !== undefined) { attrs[an] = m[3].trim(); if (!m[4]) attrErr = attrErr || { why: 'noQuote', attr: an }; continue; }
    if (m[5] !== undefined) { attrs[an] = m[5].trim(); if (!m[6]) attrErr = attrErr || { why: 'noQuote', attr: an }; continue; }
    attrs[an] = (m[7] || '').trim();
    attrErr = attrErr || { why: 'noQuote', attr: an };
  }
  return { attrs, attrErr };
}
// Тег без левого уголка: «h1>» или «/p>» внутри текста.
const A5_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|ul|ol|li)\s*>)/i;
const a5Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a5Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a5Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'open' && t.attrErr) return a5Fb(t.attrErr.why, { bad: t.attrErr.bad || '', tag: t.attrErr.tag || t.name, attr: t.attrErr.attr || '' });
    if (t.k === 'close' && t.name === 'img') return FB.imgClose;
    if (t.k === 'text') { const m = A5_NOLT.exec(t.v); if (m) return a5Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body: doctype, html, head, title и сам body — уже есть.
function a5Outer(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A5_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
  }
  return null;
}
// Текст вместе с b и i внутри него — один кусок { k: 'text', v, used: { b, i } }. b и i
// закрываются внутри куска (до следующего блочного тега), в них — хотя бы одно слово.
function a5Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0, a: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', used: {}, inner: {}, links: [] }; };
  const end = () => {
    if (!cur) return null;
    if (depth.a > 0) return FB.aOpen;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a5Fb('inlineOpen', { tag: tg });
    cur.v = a5Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A5_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a5Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') {
        depth[t.name] += 1; cur.used[t.name] = true; cur.inner[t.name] = '';
        if (t.name === 'a') cur.links.push({ href: t.attrs ? t.attrs.href : undefined, text: '' });
      }
      else {
        if (!depth[t.name]) return { msg: a5Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a5Letters(cur.inner[t.name])) return { msg: a5Fb('inlineEmpty', { tag: t.name }) };
        if (t.name === 'a') cur.links[cur.links.length - 1].text = a5Squash(cur.inner.a);
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
// ПЛАН: ожидаемая последовательность { k: 'open' | 'text' | 'close', name, key } (код — часть body).
// Первое расхождение — одна фраза: что ждём и что встретили. ok — с текстами по key.
// opts: textOut — текст вместо <p> (браузер покажет, но слепит); moreP — не хватает второго p.
function a5Plan(src, plan, opts) {
  const o = opts || {};
  const toks = lexA5(src);
  const bad = a5Bad(toks) || a5Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a5Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  const texts = {};
  let p = 0;
  let lastClose = null;
  for (let i = 0; i < L.length; i += 1) {
    const t = L[i];
    if (p >= plan.length) {
      if (t.k === 'text') return { ok: false, msg: a5Fb('textAfter', { tag: lastClose || '' }) };
      return { ok: false, msg: a5Fb('extra', { got: t.raw }) };
    }
    const want = plan[p];
    if (want.k === 'open') {
      if (t.k === 'open' && t.name === want.name) { p += 1; continue; }
      if (t.k === 'text') return { ok: false, msg: want.name === 'li' ? FB.textNoLi : a5Fb('needOpenText', { tag: want.name }) };
      if (want.name === 'li' && t.k === 'open' && A5_LIST[t.name]) return { ok: false, msg: FB.listThere };
      if (t.k === 'close') return { ok: false, msg: a5Fb('closeFirst', { got: t.name, tag: want.name }) };
      return { ok: false, msg: a5Fb('wrongOpen', { tag: want.name, got: t.name }) };
    }
    if (want.k === 'text') {
      if (t.k === 'text') {
        if (!a5Letters(t.v)) return { ok: false, msg: FB.short };
        texts[want.key] = t.v; p += 1; continue;
      }
      return { ok: false, msg: a5Fb('needText', { tag: want.name }) };
    }
    if (t.k === 'close' && t.name === want.name) { p += 1; lastClose = want.name; continue; }
    if (t.k === 'open' && t.name === want.name) return { ok: false, msg: a5Fb('needSlash', { tag: want.name }) };
    if (t.k === 'close' && A5_HEAD.test(t.name) && A5_HEAD.test(want.name)) return { ok: false, msg: a5Fb('closeMismatch', { tag: want.name }) };
    return { ok: false, msg: a5Fb(A5_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  if (p < plan.length) {
    const want = plan[p];
    if (p === 0) return { ok: false, msg: FB.empty };
    if (want.k === 'open') return { ok: false, msg: a5Fb('next', { tag: want.name }) };
    if (want.k === 'text') return { ok: false, msg: a5Fb('needText', { tag: want.name }) };
    return { ok: false, msg: a5Fb(A5_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  return { ok: true, texts };
}
const A5_LI = [{ k: 'open', name: 'li' }, { k: 'text', name: 'li', key: 'li' }, { k: 'close', name: 'li' }];

// РАЗБОР КУСКА body НА БЛОКИ: { kind: 'block', tag, text, used } (заголовок, абзац) и
// { kind: 'list', tag: 'ul' | 'ol', items: [{ text, used }] }. Первая проблема — одна фраза.
function a5Blocks(src) {
  const toks = lexA5(src);
  const bad = a5Bad(toks) || a5Outer(toks);
  if (bad) return { msg: bad };
  const g = a5Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  const out = [];
  let i = 0;
  const closeOf = (tag, z) => {
    if (!z) return a5Fb(A5_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
    if (z.k === 'close' && z.name === tag) return null;
    if (z.k === 'open' && z.name === tag) return a5Fb('needSlash', { tag });
    return a5Fb(A5_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  while (i < L.length) {
    const t = L[i];
    if (t.k === 'text') return { msg: a5Fb('needOpenText', { tag: 'p' }) };   // текст вне блоков — абзацу нужен p
    if (t.k === 'close') return { msg: a5Fb('closeStray', { got: t.name }) };
    if (t.name === 'img') { out.push({ kind: 'img', attrs: t.attrs || {} }); i += 1; continue; }
    if (t.name === 'li') return { msg: FB.liOut };
    if (A5_LIST[t.name]) {
      const tag = t.name;
      const items = [];
      i += 1;
      for (;;) {
        const x = L[i];
        if (!x) return { msg: a5Fb('needClose', { tag }) };
        if (x.k === 'close' && x.name === tag) { i += 1; break; }
        if (x.k === 'close' && A5_LIST[x.name]) return { msg: a5Fb('listMismatch', { tag }) };
        if (x.k === 'text') return { msg: FB.textNoLi };
        if (x.k === 'close') return { msg: a5Fb('closeStray', { got: x.name }) };
        if (x.name !== 'li') return { msg: a5Fb('needClose', { tag }) };
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a5Fb('needText', { tag: 'li' }) };
        if (!a5Letters(y.v)) return { msg: FB.short };
        const m = closeOf('li', L[i + 2]);
        if (m) return { msg: m };
        items.push({ text: y.v, used: y.used, links: y.links || [] });
        i += 3;
      }
      out.push({ kind: 'list', tag, items });
      continue;
    }
    const tag = t.name;
    const y = L[i + 1];
    if (!y || y.k !== 'text') return { msg: a5Fb('needText', { tag }) };
    if (!a5Letters(y.v)) return { msg: FB.short };
    const m = closeOf(tag, L[i + 2]);
    if (m) return { msg: m };
    out.push({ kind: 'block', tag, text: y.v, used: y.used, links: y.links || [] });
    i += 3;
  }
  return { blocks: out };
}
const A5_NUM = /^\s*\d+\s*[.)]/;
const a5ManualNum = (list) => list.tag === 'ol' && list.items.some((it) => A5_NUM.test(it.text));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроках 2–3. Название — между <title> и </title>; без title в коде — название
// страницы (head над частью body). Окно — блоки: заголовки и абзацы { tag, inh, runs } и списки
// { tag: 'ul' | 'ol' | 'loose', items: [{ runs, bare }] }: ul — точки, ol — номера по порядку (ставит браузер;
// номер, вписанный руками, — второй), текст в списке без li — без точки и номера (bare), li без списка —
// с точкой (loose). Незакрытый h1 делает крупным всё ниже, незакрытый b — жирным весь текст дальше.
function a5Page(src, fixedTitle) {
  const s = String(src || '');
  const m = /<\s*title\s*>/i.exec(s);
  let title = fixedTitle || '';
  let rest = s;
  let eaten = false;
  if (m) {
    const after = s.slice(m.index + m[0].length);
    const c = /<\s*\/\s*title\s*>/i.exec(after);
    if (c) { title = after.slice(0, c.index); rest = s.slice(0, m.index) + ' ' + after.slice(c.index + c[0].length); }
    else { title = after; rest = s.slice(0, m.index); eaten = true; }
  }
  const blocks = [];
  let cur = null;
  let list = null;
  let item = null;
  let hOpen = 0;
  const d = { b: 0, i: 0 };
  const hrefs = [];   // открытые a: значение href (нет href — null: простой текст, как в браузере)
  const nb = (tag) => { list = null; item = null; cur = { tag, inh: A5_HEAD.test(tag) ? 0 : hOpen, runs: [] }; blocks.push(cur); };
  lexA5(rest).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      const n = t.name;
      if (A5_HEAD.test(n)) {
        if (t.k === 'open') { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); }
        else { hOpen = 0; cur = null; }
        return;
      }
      if (n === 'p') { if (t.k === 'open') nb('p'); else if (cur && cur.tag === 'p') cur = null; return; }
      if (A5_LIST[n]) {
        if (t.k === 'open') { cur = null; item = null; list = { tag: n, inh: hOpen, items: [] }; blocks.push(list); }
        else { list = null; item = null; }
        return;
      }
      if (n === 'li') {
        if (t.k === 'open') {
          if (!list) { cur = null; list = { tag: 'loose', inh: hOpen, items: [] }; blocks.push(list); }
          item = { runs: [], bare: false };
          list.items.push(item);
        } else item = null;
        return;
      }
      if (n === 'img') {
        if (t.k !== 'open') return;   // у img нет закрывающего тега — браузер его не замечает
        const im = { t: ' ', img: { src: t.attrs ? t.attrs.src : undefined, alt: t.attrs ? t.attrs.alt : undefined } };
        if (list) { if (!item) { item = { runs: [], bare: true }; list.items.push(item); } item.runs.push(im); return; }
        if (!cur) nb('raw');
        cur.runs.push(im);
        return;
      }
      if (n === 'a') {
        if (t.k === 'open') hrefs.push(t.attrs && t.attrs.href !== undefined ? t.attrs.href : null);
        else hrefs.pop();
        return;
      }
      if (A5_INLINE[n]) d[n] = t.k === 'open' ? d[n] + 1 : Math.max(0, d[n] - 1);
      return;
    }
    let txt = null;
    if (t.k === 'text') txt = t.raw;
    else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
    if (txt == null) return;
    const top = hrefs.length ? hrefs[hrefs.length - 1] : null;
    const run = { t: txt, b: d.b > 0, i: d.i > 0, href: top };
    if (list) {
      if (!item) { item = { runs: [], bare: true }; list.items.push(item); }
      item.runs.push(run);
      return;
    }
    if (!cur) nb('raw');
    cur.runs.push(run);
  });
  const has = (runs) => runs.some((r) => r.img || r.t.trim());
  return { title: a5Squash(title), eaten, blocks: blocks.filter((bk) => (bk.items ? bk.items.some((it) => has(it.runs)) : has(bk.runs))) };
}
// Страница всегда помещается в окно целиком (как в уроке 2): не влезает — шрифт ступеньками
// уменьшается, не меньше 56 %.
// Страница пересоздаётся (например, после «Проверить») — подгонка запускается заново: следит за самим узлом.
function useA5Fit(dep) {
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
// РИСУНКИ-«ФОТО» — файлы картинок на «диске» сайта зоопарка. Плоские, в цветах облика.
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
const A5_PICS = { 'sher.jpg': PicSher, 'fil.jpg': PicFil, 'jirafa.jpg': PicJirafa, 'panda.jpg': PicPanda, 'toshbaqa.jpg': PicToshbaqa, 'kapalak.jpg': PicKapalak };
// Картинка честно, как в браузере: есть файл — рисунок; нет файла — значок сломанной картинки и текст alt;
// нет src (или пустой) — только текст alt (без alt — ничего).
function A5Img({ src, alt }) {
  const Pic = src ? A5_PICS[src] : null;
  if (Pic) return <span className="a5-imgbox" role="img" aria-label={alt || src}><Pic /></span>;
  if (src) return <span className="a5-broken"><i className="a5-broken-ic" aria-hidden="true" />{alt ? <span>{alt}</span> : null}</span>;
  return alt ? <span className="a5-alt">{alt}</span> : null;
}
// Ссылка с href — синяя подчёркнутая, нажимается (onNav открывает файл); a без href — простой текст.
function A5Doc({ blocks, flash, onNav }) {
  const ref = useA5Fit(JSON.stringify(blocks));
  if (!blocks || !blocks.length) return null;
  const runs = (rs) => rs.map((r, j) => {
    const c = ((r.b ? 'a5-wb' : '') + (r.i ? ' a5-wi' : '')).trim() || undefined;
    if (r.img) return <A5Img key={j} src={r.img.src} alt={r.img.alt} />;
    if (r.href != null) return <button key={j} type="button" className={'a5-a' + (c ? ' ' + c : '')} onClick={() => { if (onNav) onNav(r.href); }}>{r.t}</button>;
    return <span key={j} className={c}>{r.t}</span>;
  });
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a5-doc' + (flash ? ' a5-in' : '')}>
      {blocks.map((bk, i) => {
        if (bk.items) {
          const L = bk.tag === 'ol' ? 'ol' : 'ul';
          return (
            <L key={i} className={'a5-blk a5-list a5-' + bk.tag + (bk.inh ? ' a5-inh' + bk.inh : '')}>
              {bk.items.filter((it) => it.runs.some((r) => r.img || r.t.trim())).map((it, j) => (it.bare
                ? <span key={j} className="a5-bare">{runs(it.runs)}</span> : <li key={j}>{runs(it.runs)}</li>))}
            </L>
          );
        }
        return <div key={i} className={'a5-blk a5-' + bk.tag + (bk.inh ? ' a5-inh' + bk.inh : '')}>{runs(bk.runs)}</div>;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a5Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a5-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a5-t">{p}</span>;
    return (
      <span key={i} className="a5-g">
        <span className="a5-b">{'<' + m[1]}</span><span className="a5-n">{m[2]}</span>
        {m[3] ? <span className="a5-a">{m[3]}</span> : null}<span className="a5-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a5Insert(el, ch) {
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
const A5_MAX = 1200;
function A5Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a5-edit');
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
    <div key={key} className={'a5-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a5Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a5-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a5-edit' + (led ? ' is-led' : '')}>
        <div className="a5-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a5-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A5_MAX)); }}
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
function A5Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a5-ed a5-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a5-ln a5-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a5-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a5Hl(t) : '​'}</button>
      ) : <div key={i} className={'a5-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a5Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A5Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a5-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a5Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР С ПЯТЬЮ ВКЛАДКАМИ — браузер урока (PaperBrowser), вкладки — пять страниц газеты (карта).
// tabs: [{ st: 'ok' | 'off', name, ico, c }]; cur — открытая вкладка, title — её название
// сейчас (пусто — «index.html»). Сломанная страница — серый значок «!», починенная — цветной.
// ─────────────────────────────────────────────────────────────────────────────
const A5_ICO = {
  paw: <><circle cx="6.5" cy="10.5" r="1.8" /><circle cx="10" cy="6.5" r="1.8" /><circle cx="14.5" cy="6.5" r="1.8" /><circle cx="18" cy="10.5" r="1.8" /><path d="M12.2 12.5c-2.8 0-5 3-4.6 5.1.4 1.7 2.9 1.3 4.6 1.3s4.2.4 4.6-1.3c.4-2.1-1.8-5.1-4.6-5.1z" /></>,
  leaf: <><path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15" /><path d="M5 19l8-8" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const A5Fav = ({ ico, c, off }) => (
  <i className={'a5-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A5_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A5Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl, url, onBack }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a5-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a5-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a5-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a5-pop' : '')}>
            <A5Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a5-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A5Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a5-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn a5-back" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
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
function useA5Tabs(all) {
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
const A5_COL = { h1: 'var(--r-html)', p: 'var(--r-body)', a: '#0000EE' };
// Части строки по порядку: код (как в редакторе) или подпись (что пишет ученик).
function A5Parts({ parts }) {
  const pick = usePick();
  return (
    <div className="a5-slots" translate="no">
      {parts.map((x, n) => (
        <span key={n} className="a5-slot" style={{ '--pc': A5_COL.a }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(x.word)}</em>}
        </span>
      ))}
    </div>
  );
}
// Файлы сайта — имена, которые можно ставить в href (буква в букву).
function A5Files() {
  const pick = usePick();
  return (
    <div className="a5-files" translate="no">
      <span className="a5-files-l">{pick(UI.files)}:</span>
      {IMG_FILES.map((f) => <code key={f}>{f}</code>)}
    </div>
  );
}
// Схема своей страницы: body уже есть; h1, img (src, alt) и p — пишет ученик.
function A5Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a5-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a5-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a5-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a5-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a5-tree" translate="no">
      {row('', 'body', 'var(--r-body)', UI.given, true)}
      {row('├─ ', 'h1', 'var(--r-html)', UI.bpH1, D.h1)}
      {row('├─ ', 'img', 'var(--r-head)', UI.bpImg, D.img)}
      {row('└─ ', 'p', 'var(--r-body)', UI.bpP, D.p)}
    </div>
  );
}
// Образец третьей ступени — под редактором, с другим содержимым.
const A5Sample = ({ lines }) => {
  const pick = usePick();
  return (
    <div className="a5-sample">
      <span className="a5-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A5Code lines={lines} cls="a5-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A5_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA5Task(cfg) {
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
    if (fails >= A5_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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
// ─────────────────────────────────────────────────────────────────────────────
// ПЕРЕХОДЫ ПО ССЫЛКАМ (урок 4). Нажатая ссылка открывает файл сайта (SITE): адрес и вкладка меняются,
// стрелка «назад» возвращает; нет такого файла — «Fayl topilmadi» (имя файла — буква в букву). Правка
// кода возвращает на свою страницу.
// ─────────────────────────────────────────────────────────────────────────────
const A5_CITIES = ['toshkent', 'samarqand', 'buxoro', 'xiva'];
function a5SiteCode(file, pick) {
  const pg = SITE[file];
  if (!pg) return null;
  if (file === 'index.html') {
    return '<h1>' + pick(pg.title) + '</h1><p>' + pick(pg.p) + '</p><ul>'
      + A5_CITIES.map((k) => '<li><a href="' + k + '.html">' + pick(CITY[k]) + '</a></li>').join('') + '</ul>';
  }
  return '<h1>' + pick(pg.title) + '</h1><p>' + pick(pg.p) + '</p><p><a href="index.html">' + pick(HOME) + '</a></p>';
}
function useA5Nav(home, dep) {
  const [stack, setStack] = useState([]);
  useEffect(() => { setStack([]); }, [dep]);
  const go = useCallback((href) => { sfx('type', true); setStack((s) => s.concat([String(href == null ? '' : href).trim()])); }, []);
  const back = stack.length ? () => setStack((s) => s.slice(0, -1)) : null;
  return { file: stack.length ? stack[stack.length - 1] : home, away: stack.length > 0, go, back };
}
// Что показывает браузер: своя страница задания или открытый по ссылке файл.
function a5Shown(nav, own, pick) {
  if (!nav.away) return own;
  const code = a5SiteCode(nav.file, pick);
  if (code) return { title: pick(SITE[nav.file].title), blocks: a5Page(code).blocks, url: nav.file };
  return { title: pick(UI.nf), blocks: a5Page('<h1>' + pick(UI.nf) + '</h1><p>' + pick(UI.nfText) + '</p>').blocks, url: nav.file || '?', nf: true };
}

function A5TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA5Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA5Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const file = TABS[cfg.num - 1].file;
  const nav = useA5Nav(file, JSON.stringify(st));
  const shown = a5Shown(nav, { title: v.title, blocks: v.blocks, url: file }, pick);
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a5-sheet a5-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <div className={'a5-work' + (v.big ? ' is-big' : '')}>
          <div className="a5-side">
            <A5Browser tabs={tabs} cur={cfg.num - 1} title={shown.title} flash={t.flash} short pageHl={!rec.solved && !nav.away && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}
              url={shown.url} onBack={nav.back} cls={shown.nf ? 'is-nf' : ''}>
              <A5Doc blocks={shown.blocks} flash={nav.away ? 0 : t.flash} onNav={nav.go} />
            </A5Browser>
            {v.aid || null}
          </div>
          <div className="a5-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A5Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A5Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ
// ─────────────────────────────────────────────────────────────────────────────
const A5_DOC = '<!DOCTYPE html>';
const a5Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);

// Проблема картинки: href вместо src, нет src, пустой, нет файла, не тот файл, нет alt. null — всё верно.
function a5ImgIssue(at, want, needAlt) {
  const a = at || {};
  if (a.src === undefined && a.href !== undefined) return FB.hrefOnImg;
  if (a.src === undefined) return FB.noSrc;
  if (!a.src) return FB.emptySrc;
  if (IMG_FILES.indexOf(a.src) < 0) return fillL(FB.imgNo, { got: a.src });
  if (want && a.src !== want) return fillL(FB.imgOther, { got: a.src, want });
  if (needAlt && a.alt === undefined) return FB.noAlt;
  if (needAlt && !a5Letters(a.alt)) return a.alt ? FB.short : FB.emptyAlt;
  return null;
}
// Подсвеченная строка кода для KzCode (части — как в редакторе).
const a5Parts = (code, key) => <React.Fragment key={key}>{a5Hl(code)}</React.Fragment>;
// Страница животного: заголовок, картинка, факт.
const a5AnimalCode = (k, pick, src) => '<h1>' + pick(ANIMAL[k].name) + '</h1><img src="' + (src == null ? k + '.jpg' : src) + '" alt="' + pick(ANIMAL[k].name) + '"><p>' + pick(ANIMAL[k].fact) + '</p>';

// Т1 · поле в строке: имя файла в пустом src (alt уже есть — пока виден только он).
function a5FieldCheck(v, want) {
  const s = a5Squash(v);
  if (!s) return { ok: false, msg: FB.emptySrc };
  if (/[<>"'=]/.test(s)) return { ok: false, msg: UI.noTags };
  if (IMG_FILES.indexOf(s) < 0) return { ok: false, msg: fillL(FB.imgNo, { got: s }) };
  if (s !== want) return { ok: false, msg: fillL(FB.imgOther, { got: s, want }) };
  return { ok: true };
}
function a5FieldView(k) {
  return (st, x) => {
    const v = st.v || '';
    const name = x.pick(ANIMAL[k].name);
    const lines = [
      { k: 'h1', parts: [T_('h1'), W_(name), T_('h1', true)] },
      { k: 'img', cls: x.solved ? 'is-new' : 'is-hl', parts: [
        <span key="ah" className="a5-g"><span className="a5-b">&lt;</span><span className="a5-n">img</span><span className="a5-a"> src="</span></span>,
        x.solved ? <span key="v" className="a5-a">{v}</span> : (
          <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
            <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={30}
              onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a5-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
          </span>),
        <span key="az" className="a5-g"><span className="a5-a">" alt="{name}"</span><span className="a5-b">&gt;</span></span>
      ] },
      { k: 'p', parts: [T_('p'), W_(x.pick(ANIMAL[k].fact)), T_('p', true)] }
    ];
    return {
      title: name, blocks: a5Page(a5AnimalCode(k, x.pick, v)).blocks,
      aid: <A5Files />,
      editor: <div className="a5-fieldwrap"><KzCode cls="a5-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = () => ({
  id: 't1', num: 1, kind: 'write-src', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a5FieldCheck(st.v, 'sher.jpg'),
  view: a5FieldView('sher'),
  sample: (pk) => ['<img src="fil.jpg" alt="' + pk(ANIMAL.fil.name) + '">'],
  drill: { init: () => ({ v: '' }), check: (st) => a5FieldCheck(st.v, 'toshbaqa.jpg'), view: a5FieldView('toshbaqa') }
});

// Т2 · строка: <img src="…" alt="…"> целиком (img не закрывается).
function a5LineCheck(code, want) {
  const r = a5Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const f = B[0];
  if (f.kind !== 'img') return { ok: false, msg: a5Fb('wrongOpen', { tag: 'img', got: f.tag || 'p' }) };
  const m = a5ImgIssue(f.attrs, want, true);
  if (m) return { ok: false, msg: m };
  if (B.length > 1) return { ok: false, msg: a5Fb('extra', { got: B[1].tag ? '<' + B[1].tag + '>' : '' }) };
  return { ok: true };
}
function a5LineView(k) {
  return (st, x) => {
    const before = ['<body>', '  <h1>' + x.pick(ANIMAL[k].name) + '</h1>'];
    const after = ['  <p>' + x.pick(ANIMAL[k].fact) + '</p>', '</body>'];
    return {
      title: x.pick(ANIMAL[k].name), blocks: a5Page(before.concat([st.code], after).join('\n')).blocks,
      aid: <A5Parts parts={[{ code: '<img' }, { code: 'src="…"' }, { code: 'alt="…"' }, { code: '>' }]} />,
      editor: <A5Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = () => ({
  id: 't2', num: 2, kind: 'write-img', C: C.t2,
  init: () => ({ code: '  ' }),
  check: (st) => a5LineCheck(st.code, 'fil.jpg'),
  view: a5LineView('fil'),
  sample: (pk) => ['<img src="jirafa.jpg" alt="' + pk(ANIMAL.jirafa.name) + '">'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a5LineCheck(st.code, 'kapalak.jpg'), view: a5LineView('kapalak') }
});

// Т3 · блок: картинка и абзац под ней (смесь с уроком 2).
function a5PairCheck(code, want) {
  const r = a5Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  if (B[0].kind !== 'img') return { ok: false, msg: FB.imgFirst };
  const m = a5ImgIssue(B[0].attrs, want, true);
  if (m) return { ok: false, msg: m };
  const p = B[1];
  if (!p) return { ok: false, msg: FB.needPAfter };
  if (p.kind !== 'block' || p.tag !== 'p') return { ok: false, msg: a5Fb('wrongOpen', { tag: 'p', got: p.tag || 'img' }) };
  if (B.length > 2) return { ok: false, msg: a5Fb('textAfter', { tag: 'p' }) };
  return { ok: true };
}
function a5PairView(k) {
  return (st, x) => {
    const before = ['<body>', '  <h1>' + x.pick(ANIMAL[k].name) + '</h1>'];
    const after = ['</body>'];
    return {
      title: x.pick(ANIMAL[k].name), blocks: a5Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A5Parts parts={[{ code: '<img src="…" alt="…">' }, { code: '<p>…</p>' }]} />,
      editor: <A5Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = () => ({
  id: 't3', num: 3, kind: 'write-img-p', C: C.t3,
  init: () => ({ code: '  ' }),
  check: (st) => a5PairCheck(st.code, 'jirafa.jpg'),
  view: a5PairView('jirafa'),
  sample: (pk) => ['<img src="panda.jpg" alt="' + pk(ANIMAL.panda.name) + '">', '<p>' + pk(ANIMAL.panda.fact) + '</p>'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a5PairCheck(st.code, 'toshbaqa.jpg'), view: a5PairView('toshbaqa') }
});

// Т4 · найти строку и исправить: href вместо src у картинки (загадка урока 5) — видно только alt.
function a5FixView(k, C4) {
  return (st, x) => {
    const name = x.pick(ANIMAL[k].name);
    const lines = a5Body(['<h1>' + name + '</h1>', '<img href="' + k + '.jpg" alt="' + name + '">', '<p>' + x.pick(ANIMAL[k].fact) + '</p>']);
    const BAD = 2;
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); const n = el.value.indexOf('href'); const at = n < 0 ? el.value.length : n; el.setSelectionRange(at, at + (n < 0 ? 0 : 4)); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i] || C4.why[0]);
    };
    if (st.at == null) {
      return {
        title: name, blocks: a5Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: C4.ask,
        editor: <A5Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title: name, blocks: a5Page(before.concat([st.code], after).join('\n')).blocks, ask: C4.ask2,
      editor: <A5Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a5FixCheck(st, k, pick) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a5Blocks(st.code);
  if (r.msg) return { ok: false, msg: r.msg };
  const f = r.blocks[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind !== 'img') return { ok: false, msg: a5Fb('wrongOpen', { tag: 'img', got: f.tag || '' }) };
  const m = a5ImgIssue(f.attrs, null, true);
  if (m) return { ok: false, msg: m };
  if (f.attrs.src !== k + '.jpg' || a5Norm(f.attrs.alt) !== a5Norm(pick(ANIMAL[k].name))) return { ok: false, msg: FB.keepImg };
  return { ok: true };
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a5FixCheck(st, 'panda', pick),
  view: a5FixView('panda', C.t4),
  sample: (pk) => ['<img src="sher.jpg" alt="' + pk(ANIMAL.sher.name) + '">'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a5FixCheck(st, 'kapalak', pick), view: a5FixView('kapalak', C.t4) }
});

// Т5 · своя страница внутри body: h1, картинка (src из списка, alt), абзац.
function a5OwnCheck(code) {
  const r = a5Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const f = B[0];
  if (f.kind !== 'block' || f.tag === 'p') return { ok: false, msg: FB.h1First };
  if (f.tag !== 'h1') return { ok: false, msg: a5Fb('mainH1', { got: f.tag }) };
  if (B.slice(1).some((b) => b.kind === 'block' && b.tag === 'h1')) return { ok: false, msg: FB.oneH1 };
  const img = B.find((b) => b.kind === 'img');
  if (!img) return { ok: false, msg: FB.needImg };
  const m = a5ImgIssue(img.attrs, null, true);
  if (m) return { ok: false, msg: m };
  const p = B.find((b) => b.kind === 'block' && b.tag === 'p');
  if (!p) return { ok: false, msg: FB.needPAfter };
  return { ok: true, result: { heading: f.text, src: img.attrs.src, alt: img.attrs.alt, text: p.text, code } };
}
function a5OwnDone(code) {
  const tk = lexA5(code);
  const n = (k, name) => tk.filter((t) => t.k === k && t.name === name).length;
  return { h1: n('open', 'h1') > 0 && n('close', 'h1') > 0, p: n('open', 'p') > 0 && n('close', 'p') > 0,
    img: tk.some((t) => t.k === 'open' && t.name === 'img' && t.attrs && IMG_FILES.indexOf(t.attrs.src) >= 0 && a5Letters(t.attrs.alt)) };
}
// Код страницы — строками: каждый блок, картинка и пункт с новой строки; esc — для артефакта.
function a5Lines(code, esc) {
  const toks = lexA5(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const isBlock = (t) => (t.k === 'open' || t.k === 'close') && (A5_HEAD.test(t.name) || t.name === 'p' || t.name === 'li' || !!A5_LIST[t.name]);
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  const val = (v) => (esc ? escHtml(v) : v);
  const tagText = (t) => {
    if (t.k === 'close') return '</' + t.name + '>';
    const at = t.attrs || {};
    const keys = t.name === 'img' ? ['src', 'alt'] : t.name === 'a' ? ['href'] : [];
    return '<' + t.name + keys.filter((k) => at[k] !== undefined).map((k) => ' ' + k + '="' + val(at[k]) + '"').join('') + '>';
  };
  toks.forEach((t, n) => {
    if (t.k === 'open' && t.name === 'img') { flush(); lines.push('  '.repeat(depth) + tagText(t)); return; }
    if (t.k === 'close' && t.name === 'img') return;
    if (isBlock(t)) {
      if (A5_LIST[t.name]) {
        flush();
        if (t.k === 'close') depth = Math.max(0, depth - 1);
        lines.push('  '.repeat(depth) + tagText(t));
        if (t.k === 'open') depth += 1;
        return;
      }
      if (t.k === 'open') { flush(); cur = tagText(t); return; }
      cur += tagText(t);
      flush();
      return;
    }
    if (t.k === 'open' || t.k === 'close') { cur += tagText(t); return; }
    if (t.k === 'text') {
      let s2 = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || isBlock(prev)) s2 = s2.replace(/^\s+/, '');
      if (!next || isBlock(next)) s2 = s2.replace(/\s+$/, '');
      cur += esc ? escHtml(s2) : s2;
    }
  });
  flush();
  return lines;
}
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-page-img', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a5OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myText', r.result.text); store.set('mySrc', r.result.src); store.set('myAlt', r.result.alt);
    store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), blocks: a5Page(st.code).blocks, big: true,
    aid: <><A5Tree done={a5OwnDone(st.code)} /><A5Files /></>,
    editor: <A5Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: (pk) => ['<h1>' + pk(XTRA.ownH) + '</h1>', '<img src="toshbaqa.jpg" alt="' + pk(ANIMAL.toshbaqa.name) + '">', '<p>' + pk(ANIMAL.toshbaqa.fact) + '</p>']
});

function A5Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A5TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A5Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A5Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A5Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A5Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A5Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: страница льва с фото → «Saqlash» → сбой: src пропал — вместо фото только alt, вкладки гаснут.
// Одно касание.
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
  const all = useA5Tabs(true);
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
  const name = pick(ANIMAL.sher.name);
  const lines = ['<h1>' + name + '</h1>', broke ? '<img alt="' + name + '">' : '<img src="sher.jpg" alt="' + name + '">', '<p>' + pick(ANIMAL.sher.fact) + '</p>'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a5-sheet a5-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a5-work">
          <div className="a5-side">
            <A5Browser tabs={tabs} cur={0} title={name} cls={boom ? 'a5-glitch' : ''} url="sher.html">
              <A5Doc blocks={a5Page(lines.join('\n')).blocks} />
            </A5Browser>
          </div>
          <div className="a5-main">
            <A5Code lines={lines} cls={boom ? 'a5-glitch' : ''} />
            {!broke ? (
              <div className="kz-row a5-row">
                <button type="button" className="kz-btn is-coral a5-publish" onClick={tap}>
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
// ВЫВОД: все пять вкладок горят, своя страница с картинкой открыта; её код; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA5Tabs(true);
  const code = store.get('myCode') || ('<h1>' + pick(XTRA.ownH) + '</h1>\n<img src="toshbaqa.jpg" alt="' + pick(ANIMAL.toshbaqa.name) + '">\n<p>' + pick(ANIMAL.toshbaqa.fact) + '</p>');
  const lines = a5Body(a5Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'img' || curK === 'src' || curK === 'alt' ? find(/<img /) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a5-sheet a5-fin">
        <KzAsk text={c.ask} />
        <div className="a5-work">
          <div className="a5-side">
            <A5Browser tabs={tabs} cur={4} title={pick(TABS[4].name)} pageHl={curK === 'own'} url="mening.html"><A5Doc blocks={a5Page(code).blocks} /></A5Browser>
            <div className="a5-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a5-main">
            <A5Code lines={lines} mark={mark} />
            <div className="kz-roles a5-roles">
              {['img', 'src', 'alt', 'own'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'img' ? '#FA4F28' : k === 'src' ? '#7C5CFA' : k === 'alt' ? '#0FA38E' : '#E44D26' }}>
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
// «Повторить» стирает только текущее задание (у своей статьи — и её код и тексты).
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'myText', 'mySrc', 'myAlt', 'myTab'] };

// Артефакт — своя страница из задания 5 (тексты, src и alt — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', text: store.get('myText') || '', src: store.get('mySrc') || '', alt: store.get('myAlt') || '',
    html: [A5_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a5Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika5({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
