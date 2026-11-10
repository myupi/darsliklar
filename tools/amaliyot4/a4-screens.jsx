// =============================================================================
// ПРАКТИКА 4 «Путешествие Коди» (облик «Редактор»), на основе практики 03p (tools/amaliyot3):
//   · разбор кода lexA4 (теги и атрибуты: у a — href) / a4Group (b, i и a внутри текста; ссылки) / a4Plan /
//     a4Blocks — теги уроков 1–4, одна самая полезная проблема;
//   · честный браузер a4Page / A4Doc — как в уроке 4: a с href — синяя ссылка, нажимается и открывает файл
//     сайта (useA4Nav: адрес, вкладка, «назад»; нет файла — «Fayl topilmadi»), a без href — простой текст;
//   · редактор A4Editor, ряд символов A4Keys, браузер A4Browser с пятью вкладками-картой, ход задания
//     useA4Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–2), text (v — без крайних пробелов,
// raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A4_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li', 'a'];
const A4_LIST = { ul: 1, ol: 1 };
const A4_HEAD = /^h[1-6]$/;
const A4_INLINE = { b: 1, i: 1, a: 1 };
const A4_OUTER = { html: 1, head: 1, title: 1 };
const a4Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a4Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a4Norm = (s) => a4Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,:]/g, '').replace(/\s+/g, ' ').trim();
function a4Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a4Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A4_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a4Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA4(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a4Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    if (A4_KNOWN.indexOf(name) >= 0) {
      const tok = { k: close ? 'close' : 'open', name, raw };
      if (!close) Object.assign(tok, a4Attrs(name, body.slice(name.length)));
      out.push(tok);
      continue;
    }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a4Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Атрибуты открывающего тега (урок 4): у a — href="имя файла"; у других тегов атрибутов в курсе ещё нет.
// attrs.href — значение (нет href — undefined); attrErr — первая ошибка записи: noEq (href без =), noQuote
// (значение без кавычек), attrTypo (другое имя атрибута), attrNone (атрибут у тега, которому он не нужен).
function a4Attrs(name, rest) {
  const attrs = {};
  let attrErr = null;
  const re = /\s*([^\s="']+)(\s*=\s*(?:"([^"]*)("?)|'([^']*)('?)|([^\s"']*)))?/g;
  let m;
  const src = String(rest || '');
  while (src.slice(re.lastIndex).trim() && (m = re.exec(src))) {
    if (!m[0]) break;
    const an = m[1].toLowerCase();
    if (name !== 'a') { attrErr = attrErr || { why: 'attrNone', tag: name }; continue; }
    if (an !== 'href') { attrErr = attrErr || { why: 'attrTypo', bad: m[1] }; continue; }
    if (!m[2]) { attrErr = attrErr || { why: 'noEq' }; attrs.href = ''; continue; }
    if (m[3] !== undefined) { attrs.href = m[3].trim(); if (!m[4]) attrErr = attrErr || { why: 'noQuote' }; continue; }
    if (m[5] !== undefined) { attrs.href = m[5].trim(); if (!m[6]) attrErr = attrErr || { why: 'noQuote' }; continue; }
    attrs.href = (m[7] || '').trim();
    attrErr = attrErr || { why: 'noQuote' };
  }
  return { attrs, attrErr };
}
// Тег без левого уголка: «h1>» или «/p>» внутри текста.
const A4_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|ul|ol|li)\s*>)/i;
const a4Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a4Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a4Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'open' && t.attrErr) return a4Fb(t.attrErr.why, { bad: t.attrErr.bad || '', tag: t.attrErr.tag || t.name });
    if (t.k === 'text') { const m = A4_NOLT.exec(t.v); if (m) return a4Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body: doctype, html, head, title и сам body — уже есть.
function a4Outer(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A4_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
  }
  return null;
}
// Текст вместе с b и i внутри него — один кусок { k: 'text', v, used: { b, i } }. b и i
// закрываются внутри куска (до следующего блочного тега), в них — хотя бы одно слово.
function a4Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0, a: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', used: {}, inner: {}, links: [] }; };
  const end = () => {
    if (!cur) return null;
    if (depth.a > 0) return FB.aOpen;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a4Fb('inlineOpen', { tag: tg });
    cur.v = a4Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A4_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a4Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') {
        depth[t.name] += 1; cur.used[t.name] = true; cur.inner[t.name] = '';
        if (t.name === 'a') cur.links.push({ href: t.attrs ? t.attrs.href : undefined, text: '' });
      }
      else {
        if (!depth[t.name]) return { msg: a4Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a4Letters(cur.inner[t.name])) return { msg: a4Fb('inlineEmpty', { tag: t.name }) };
        if (t.name === 'a') cur.links[cur.links.length - 1].text = a4Squash(cur.inner.a);
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
function a4Plan(src, plan, opts) {
  const o = opts || {};
  const toks = lexA4(src);
  const bad = a4Bad(toks) || a4Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a4Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  const texts = {};
  let p = 0;
  let lastClose = null;
  for (let i = 0; i < L.length; i += 1) {
    const t = L[i];
    if (p >= plan.length) {
      if (t.k === 'text') return { ok: false, msg: a4Fb('textAfter', { tag: lastClose || '' }) };
      return { ok: false, msg: a4Fb('extra', { got: t.raw }) };
    }
    const want = plan[p];
    if (want.k === 'open') {
      if (t.k === 'open' && t.name === want.name) { p += 1; continue; }
      if (t.k === 'text') return { ok: false, msg: want.name === 'li' ? FB.textNoLi : a4Fb('needOpenText', { tag: want.name }) };
      if (want.name === 'li' && t.k === 'open' && A4_LIST[t.name]) return { ok: false, msg: FB.listThere };
      if (t.k === 'close') return { ok: false, msg: a4Fb('closeFirst', { got: t.name, tag: want.name }) };
      return { ok: false, msg: a4Fb('wrongOpen', { tag: want.name, got: t.name }) };
    }
    if (want.k === 'text') {
      if (t.k === 'text') {
        if (!a4Letters(t.v)) return { ok: false, msg: FB.short };
        texts[want.key] = t.v; p += 1; continue;
      }
      return { ok: false, msg: a4Fb('needText', { tag: want.name }) };
    }
    if (t.k === 'close' && t.name === want.name) { p += 1; lastClose = want.name; continue; }
    if (t.k === 'open' && t.name === want.name) return { ok: false, msg: a4Fb('needSlash', { tag: want.name }) };
    if (t.k === 'close' && A4_HEAD.test(t.name) && A4_HEAD.test(want.name)) return { ok: false, msg: a4Fb('closeMismatch', { tag: want.name }) };
    return { ok: false, msg: a4Fb(A4_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  if (p < plan.length) {
    const want = plan[p];
    if (p === 0) return { ok: false, msg: FB.empty };
    if (want.k === 'open') return { ok: false, msg: a4Fb('next', { tag: want.name }) };
    if (want.k === 'text') return { ok: false, msg: a4Fb('needText', { tag: want.name }) };
    return { ok: false, msg: a4Fb(A4_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  return { ok: true, texts };
}
const A4_LI = [{ k: 'open', name: 'li' }, { k: 'text', name: 'li', key: 'li' }, { k: 'close', name: 'li' }];

// РАЗБОР КУСКА body НА БЛОКИ: { kind: 'block', tag, text, used } (заголовок, абзац) и
// { kind: 'list', tag: 'ul' | 'ol', items: [{ text, used }] }. Первая проблема — одна фраза.
function a4Blocks(src) {
  const toks = lexA4(src);
  const bad = a4Bad(toks) || a4Outer(toks);
  if (bad) return { msg: bad };
  const g = a4Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  const out = [];
  let i = 0;
  const closeOf = (tag, z) => {
    if (!z) return a4Fb(A4_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
    if (z.k === 'close' && z.name === tag) return null;
    if (z.k === 'open' && z.name === tag) return a4Fb('needSlash', { tag });
    return a4Fb(A4_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  while (i < L.length) {
    const t = L[i];
    if (t.k === 'text') return { msg: a4Fb('needOpenText', { tag: 'p' }) };   // текст вне блоков — абзацу нужен p
    if (t.k === 'close') return { msg: a4Fb('closeStray', { got: t.name }) };
    if (t.name === 'li') return { msg: FB.liOut };
    if (A4_LIST[t.name]) {
      const tag = t.name;
      const items = [];
      i += 1;
      for (;;) {
        const x = L[i];
        if (!x) return { msg: a4Fb('needClose', { tag }) };
        if (x.k === 'close' && x.name === tag) { i += 1; break; }
        if (x.k === 'close' && A4_LIST[x.name]) return { msg: a4Fb('listMismatch', { tag }) };
        if (x.k === 'text') return { msg: FB.textNoLi };
        if (x.k === 'close') return { msg: a4Fb('closeStray', { got: x.name }) };
        if (x.name !== 'li') return { msg: a4Fb('needClose', { tag }) };
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a4Fb('needText', { tag: 'li' }) };
        if (!a4Letters(y.v)) return { msg: FB.short };
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
    if (!y || y.k !== 'text') return { msg: a4Fb('needText', { tag }) };
    if (!a4Letters(y.v)) return { msg: FB.short };
    const m = closeOf(tag, L[i + 2]);
    if (m) return { msg: m };
    out.push({ kind: 'block', tag, text: y.v, used: y.used, links: y.links || [] });
    i += 3;
  }
  return { blocks: out };
}
const A4_NUM = /^\s*\d+\s*[.)]/;
const a4ManualNum = (list) => list.tag === 'ol' && list.items.some((it) => A4_NUM.test(it.text));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроках 2–3. Название — между <title> и </title>; без title в коде — название
// страницы (head над частью body). Окно — блоки: заголовки и абзацы { tag, inh, runs } и списки
// { tag: 'ul' | 'ol' | 'loose', items: [{ runs, bare }] }: ul — точки, ol — номера по порядку (ставит браузер;
// номер, вписанный руками, — второй), текст в списке без li — без точки и номера (bare), li без списка —
// с точкой (loose). Незакрытый h1 делает крупным всё ниже, незакрытый b — жирным весь текст дальше.
function a4Page(src, fixedTitle) {
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
  const nb = (tag) => { list = null; item = null; cur = { tag, inh: A4_HEAD.test(tag) ? 0 : hOpen, runs: [] }; blocks.push(cur); };
  lexA4(rest).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      const n = t.name;
      if (A4_HEAD.test(n)) {
        if (t.k === 'open') { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); }
        else { hOpen = 0; cur = null; }
        return;
      }
      if (n === 'p') { if (t.k === 'open') nb('p'); else if (cur && cur.tag === 'p') cur = null; return; }
      if (A4_LIST[n]) {
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
      if (n === 'a') {
        if (t.k === 'open') hrefs.push(t.attrs && t.attrs.href !== undefined ? t.attrs.href : null);
        else hrefs.pop();
        return;
      }
      if (A4_INLINE[n]) d[n] = t.k === 'open' ? d[n] + 1 : Math.max(0, d[n] - 1);
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
  const has = (runs) => runs.some((r) => r.t.trim());
  return { title: a4Squash(title), eaten, blocks: blocks.filter((bk) => (bk.items ? bk.items.some((it) => has(it.runs)) : has(bk.runs))) };
}
// Страница всегда помещается в окно целиком (как в уроке 2): не влезает — шрифт ступеньками
// уменьшается, не меньше 56 %.
function useA4Fit(dep) {
  const ref = useRef(null);
  const seen = useRef({ el: null, dep: undefined, ro: null });
  // Страница пересоздаётся (например, после «Проверить») — подгонка запускается заново: следит за самим узлом.
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
// Ссылка с href — синяя подчёркнутая, нажимается (onNav открывает файл); a без href — простой текст.
function A4Doc({ blocks, flash, onNav }) {
  const ref = useA4Fit(JSON.stringify(blocks));
  if (!blocks || !blocks.length) return null;
  const runs = (rs) => rs.map((r, j) => {
    const c = ((r.b ? 'a4-wb' : '') + (r.i ? ' a4-wi' : '')).trim() || undefined;
    if (r.href != null) return <button key={j} type="button" className={'a4-a' + (c ? ' ' + c : '')} onClick={() => { if (onNav) onNav(r.href); }}>{r.t}</button>;
    return <span key={j} className={c}>{r.t}</span>;
  });
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a4-doc' + (flash ? ' a4-in' : '')}>
      {blocks.map((bk, i) => {
        if (bk.items) {
          const L = bk.tag === 'ol' ? 'ol' : 'ul';
          return (
            <L key={i} className={'a4-blk a4-list a4-' + bk.tag + (bk.inh ? ' a4-inh' + bk.inh : '')}>
              {bk.items.filter((it) => it.runs.some((r) => r.t.trim())).map((it, j) => (it.bare
                ? <span key={j} className="a4-bare">{runs(it.runs)}</span> : <li key={j}>{runs(it.runs)}</li>))}
            </L>
          );
        }
        return <div key={i} className={'a4-blk a4-' + bk.tag + (bk.inh ? ' a4-inh' + bk.inh : '')}>{runs(bk.runs)}</div>;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a4Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a4-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a4-t">{p}</span>;
    return (
      <span key={i} className="a4-g">
        <span className="a4-b">{'<' + m[1]}</span><span className="a4-n">{m[2]}</span>
        {m[3] ? <span className="a4-a">{m[3]}</span> : null}<span className="a4-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a4Insert(el, ch) {
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
const A4_MAX = 1200;
function A4Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a4-edit');
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
    <div key={key} className={'a4-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a4Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a4-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a4-edit' + (led ? ' is-led' : '')}>
        <div className="a4-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a4-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A4_MAX)); }}
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
function A4Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a4-ed a4-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a4-ln a4-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a4-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a4Hl(t) : '​'}</button>
      ) : <div key={i} className={'a4-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a4Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A4Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a4-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a4Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
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
const A4_ICO = {
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  pin: <><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>,
  dome: <><path d="M5 20h14M6 20v-7M18 20v-7M4 13h16" /><path d="M7 13a5 5 0 0 1 10 0" /><path d="M12 8V5" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const A4Fav = ({ ico, c, off }) => (
  <i className={'a4-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A4_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A4Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl, url, onBack }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a4-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a4-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a4-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a4-pop' : '')}>
            <A4Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a4-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A4Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a4-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn a4-back" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
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
function useA4Tabs(all) {
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
const A4_COL = { h1: 'var(--r-html)', p: 'var(--r-body)', a: '#0000EE' };
// Части строки по порядку: код (как в редакторе) или подпись (что пишет ученик).
function A4Parts({ parts }) {
  const pick = usePick();
  return (
    <div className="a4-slots" translate="no">
      {parts.map((x, n) => (
        <span key={n} className="a4-slot" style={{ '--pc': A4_COL.a }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(x.word)}</em>}
        </span>
      ))}
    </div>
  );
}
// Файлы сайта — имена, которые можно ставить в href (буква в букву).
function A4Files() {
  const pick = usePick();
  return (
    <div className="a4-files" translate="no">
      <span className="a4-files-l">{pick(UI.files)}:</span>
      {SITE_FILES.map((f) => <code key={f}>{f}</code>)}
    </div>
  );
}
// Схема своей страницы: body уже есть; h1, p и ссылка внутри p — пишет ученик.
function A4Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a4-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a4-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a4-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a4-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a4-tree" translate="no">
      {row('', 'body', 'var(--r-body)', UI.given, true)}
      {row('├─ ', 'h1', A4_COL.h1, UI.bpH1, D.h1)}
      {row('└─ ', 'p', A4_COL.p, UI.bpP, D.p)}
      {row('   └─ ', 'a href', A4_COL.a, UI.bpA, D.a)}
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
const A4Sample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="a4-sample">
      <span className="a4-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A4Code lines={lines} cls="a4-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A4_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA4Task(cfg) {
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
    if (fails >= A4_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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
const A4_CITIES = ['toshkent', 'samarqand', 'buxoro', 'xiva'];
function a4SiteCode(file, pick) {
  const pg = SITE[file];
  if (!pg) return null;
  if (file === 'index.html') {
    return '<h1>' + pick(pg.title) + '</h1><p>' + pick(pg.p) + '</p><ul>'
      + A4_CITIES.map((k) => '<li><a href="' + k + '.html">' + pick(CITY[k]) + '</a></li>').join('') + '</ul>';
  }
  return '<h1>' + pick(pg.title) + '</h1><p>' + pick(pg.p) + '</p><p><a href="index.html">' + pick(HOME) + '</a></p>';
}
function useA4Nav(home, dep) {
  const [stack, setStack] = useState([]);
  useEffect(() => { setStack([]); }, [dep]);
  const go = useCallback((href) => { sfx('type', true); setStack((s) => s.concat([String(href == null ? '' : href).trim()])); }, []);
  const back = stack.length ? () => setStack((s) => s.slice(0, -1)) : null;
  return { file: stack.length ? stack[stack.length - 1] : home, away: stack.length > 0, go, back };
}
// Что показывает браузер: своя страница задания или открытый по ссылке файл.
function a4Shown(nav, own, pick) {
  if (!nav.away) return own;
  const code = a4SiteCode(nav.file, pick);
  if (code) return { title: pick(SITE[nav.file].title), blocks: a4Page(code).blocks, url: nav.file };
  return { title: pick(UI.nf), blocks: a4Page('<h1>' + pick(UI.nf) + '</h1><p>' + pick(UI.nfText) + '</p>').blocks, url: nav.file || '?', nf: true };
}

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

function A4TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA4Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA4Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const file = TABS[cfg.num - 1].file;
  const nav = useA4Nav(file, JSON.stringify(st));
  const shown = a4Shown(nav, { title: v.title, blocks: v.blocks, url: file }, pick);
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.a4-main .a4-ln', rec.done, drilling, t.msg, lv);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a4-sheet a4-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'a4-work' + (v.big ? ' is-big' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')}>
          <div className="a4-side">
            <A4Browser tabs={tabs} cur={cfg.num - 1} title={shown.title} flash={t.flash} short pageHl={!rec.solved && !nav.away && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}
              url={shown.url} onBack={nav.back} cls={shown.nf ? 'is-nf' : ''}>
              <A4Doc blocks={shown.blocks} flash={nav.away ? 0 : t.flash} onNav={nav.go} />
            </A4Browser>
            {v.aid || null}
          </div>
          <div className="a4-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A4Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A4Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ
// ─────────────────────────────────────────────────────────────────────────────
const A4_DOC = '<!DOCTYPE html>';
const a4Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);

// Проблема ссылки: нет href, пустой, нет такого файла, ведёт не туда. null — всё верно.
function a4LinkIssue(ln, want) {
  if (!ln || ln.href === undefined) return FB.noHref;
  if (!ln.href) return FB.emptyHref;
  if (SITE_FILES.indexOf(ln.href) < 0) return fillL(FB.fileNo, { got: ln.href });
  if (want && ln.href !== want) return fillL(FB.fileOther, { got: ln.href, want });
  return null;
}
// Подсвеченная строка кода для KzCode (части — как в редакторе).
const a4Parts = (code, key) => <React.Fragment key={key}>{a4Hl(code)}</React.Fragment>;

// Т1 · поле в строке: имя файла в пустом href меню (смесь с уроком 3 — меню списком).
function a4FieldCheck(v, want) {
  const s = a4Squash(v);
  if (!s) return { ok: false, msg: FB.emptyHref };
  if (/[<>"'=]/.test(s)) return { ok: false, msg: UI.noTags };
  if (SITE_FILES.indexOf(s) < 0) return { ok: false, msg: fillL(FB.fileNo, { got: s }) };
  if (s !== want) return { ok: false, msg: fillL(FB.fileOther, { got: s, want }) };
  return { ok: true };
}
// На экране — два пункта меню: соседний и пустой (на телефоне длинные строки со ссылками переносятся).
function a4FieldView(gapCity, prevCity) {
  return (st, x) => {
    const v = st.v || '';
    const pg = SITE['index.html'];
    const name = x.pick(pg.title);
    const hrefOf = (k) => (k === gapCity ? v : k + '.html');
    const shownCities = [prevCity, gapCity];
    // Кусок body — только меню (заголовок над ним — на вкладке): на телефоне страница остаётся крупной.
    const code = '<ul>' + shownCities.map((k) => '<li><a href="' + hrefOf(k) + '">' + x.pick(CITY[k]) + '</a></li>').join('') + '</ul>';
    const lines = [
      { k: 'ul', parts: [T_('ul')] }
    ].concat(shownCities.map((k) => {
      if (k !== gapCity) return { k, d: 1, parts: [a4Parts('<li><a href="' + k + '.html">' + x.pick(CITY[k]) + '</a></li>', k)] };
      return { k, d: 1, cls: x.solved ? 'is-new' : 'is-hl', parts: [
        a4Parts('<li>', 'o'),
        <span key="ah" className="a4-g"><span className="a4-b">&lt;</span><span className="a4-n">a</span><span className="a4-a"> href="</span></span>,
        x.solved ? <span key="v" className="a4-a">{v}</span> : (
          <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
            <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={30}
              onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a4-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
          </span>),
        <span key="az" className="a4-g"><span className="a4-a">"</span><span className="a4-b">&gt;</span></span>,
        <span key="w" className="a4-t">{x.pick(CITY[k])}</span>,
        a4Parts('</a></li>', 'c')
      ] };
    }), [
      { k: 'ulc', parts: [T_('ul', true)] }
    ]);
    return {
      title: name, blocks: a4Page(code).blocks,
      aid: <A4Files />,
      editor: <div className="a4-fieldwrap"><KzCode cls="a4-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = () => ({
  id: 't1', num: 1, kind: 'write-href', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a4FieldCheck(st.v, 'samarqand.html'),
  view: a4FieldView('samarqand', 'toshkent'),
  sample: (pk) => ['<a href="xiva.html">' + pk(CITY.xiva) + '</a>'],
  drill: { init: () => ({ v: '' }), check: (st) => a4FieldCheck(st.v, 'buxoro.html'), view: a4FieldView('buxoro', 'samarqand') }
});

// Т2 · строка: ссылка целиком — <a href="…">слова</a>.
function a4LineCheck(code, wantHref, wantText) {
  const toks = lexA4(code);
  const bad = a4Bad(toks) || a4Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a4Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  if (!L.length) return { ok: false, msg: FB.empty };
  const t0 = L[0];
  if (t0.k === 'close') return { ok: false, msg: a4Fb('closeStray', { got: t0.name }) };
  if (t0.k === 'open') return { ok: false, msg: a4Fb('wrongOpen', { tag: 'a', got: t0.name }) };
  if (L.length > 1) return { ok: false, msg: a4Fb('extra', { got: L[1].raw || '' }) };
  if (!t0.links.length) return { ok: false, msg: a4Fb('needOpenText', { tag: 'a' }) };
  const ln = t0.links[0];
  const m = a4LinkIssue(ln, wantHref);
  if (m) return { ok: false, msg: m };
  if (a4Norm(t0.v) !== a4Norm(ln.text)) return { ok: false, msg: a4Fb('textAfter', { tag: 'a' }) };
  if (a4Norm(ln.text) !== a4Norm(wantText)) return { ok: false, msg: fillL(FB.linkText, { got: ln.text, want: wantText }) };
  return { ok: true };
}
function a4LineView() {
  return (st, x) => {
    const pg = SITE['toshkent.html'];
    const before = ['<body>', '  <h1>' + x.pick(pg.title) + '</h1>', '  <p>' + x.pick(pg.p) + '</p>'];
    const after = ['</body>'];
    return {
      title: x.pick(pg.title), blocks: a4Page(before.concat([st.code], after).join('\n')).blocks,
      aid: <A4Parts parts={[{ code: '<a href="…">' }, { word: UI.part.words }, { code: '</a>' }]} />,
      editor: <A4Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-link', C: C.t2,
  init: () => ({ code: '  ' }),
  check: (st) => a4LineCheck(st.code, 'index.html', pick(HOME)),
  view: a4LineView(),
  sample: (pk) => ['<a href="xiva.html">' + pk(CITY.xiva) + '</a>'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a4LineCheck(st.code, 'samarqand.html', pick(CITY.samarqand)), view: a4LineView() }
});

// Т3 · блок: абзац «Keyingi shahar: <город>», город — ссылка внутри p (смесь с уроком 2).
function a4ParaCheck(code, city, href) {
  const r = a4Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const f = B[0];
  if (f.kind !== 'block' || f.tag !== 'p') return { ok: false, msg: a4Fb('wrongOpen', { tag: 'p', got: f.tag }) };
  if (B.length > 1) return { ok: false, msg: FB.onePara };
  if (!f.links.length) return { ok: false, msg: FB.needLinkIn };
  const ln = f.links[f.links.length - 1];
  const m = a4LinkIssue(ln, href);
  if (m) return { ok: false, msg: m };
  if (a4Norm(ln.text) !== a4Norm(city)) return { ok: false, msg: fillL(FB.linkText, { got: ln.text, want: city }) };
  return { ok: true };
}
function a4ParaFull(code, pre, city, href) {
  const r = a4ParaCheck(code, city, href);
  if (!r.ok) return r;
  const f = a4Blocks(code).blocks[0];
  if (a4Norm(f.text) !== a4Norm(pre + ' ' + city)) return { ok: false, msg: fillL(FB.pWords, { want: pre + ' ' + city }) };
  return { ok: true };
}
function a4ParaView() {
  return (st, x) => {
    const pg = SITE['samarqand.html'];
    const before = ['<body>', '  <h1>' + x.pick(pg.title) + '</h1>', '  <p>' + x.pick(pg.p) + '</p>'];
    const after = ['</body>'];
    return {
      title: x.pick(pg.title), blocks: a4Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <><A4Parts parts={[{ code: '<p>' }, { word: NEXT_CITY }, { code: '<a href="…">…</a>' }, { code: '</p>' }]} /><A4Files /></>,
      editor: <A4Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = (pick) => ({
  id: 't3', num: 3, kind: 'write-p-link', C: C.t3,
  init: () => ({ code: '  ' }),
  check: (st) => a4ParaFull(st.code, pick(NEXT_CITY), pick(CITY.buxoro), 'buxoro.html'),
  view: a4ParaView(),
  sample: (pk) => ['<p>' + pk(NEXT_CITY) + ' <a href="xiva.html">' + pk(CITY.xiva) + '</a></p>'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a4ParaFull(st.code, pick(NEXT_CITY), pick(CITY.xiva), 'xiva.html'), view: a4ParaView() }
});

// Т4 · найти строку и исправить: a без href (загадка урока 4) — слово осталось простым текстом.
const A4_FIX = { pre: NEXT_CITY, word: CITY.xiva, href: 'xiva.html' };
const A4_FIX2 = { pre: null, word: HOME, href: 'index.html' };
const a4FixLine = (x, d) => '<p>' + (d.pre ? x.pick(d.pre) + ' ' : '') + '<a>' + x.pick(d.word) + '</a></p>';
function a4FixView(data, C4) {
  return (st, x) => {
    const pg = SITE['buxoro.html'];
    const lines = a4Body(['<h1>' + x.pick(pg.title) + '</h1>', '<p>' + x.pick(pg.p) + '</p>', a4FixLine(x, data)]);
    const BAD = 3;
    const title = x.pick(pg.title);
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); const n = el.value.indexOf('<a'); const at = n < 0 ? el.value.length : n + 2; el.setSelectionRange(at, at); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i] || C4.why[0]);
    };
    if (st.at == null) {
      return {
        title, blocks: a4Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: C4.ask, aid: <A4Files />,
        editor: <A4Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      // Файлы сайта — как на своей странице (заказчик, 10.11.2026: ученик писал bukhara.html, khiva.html — «нет такого файла»).
      title, blocks: a4Page(before.concat([st.code], after).join('\n')).blocks, ask: C4.ask2, aid: <A4Files />,
      editor: <A4Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a4FixCheck(st, words, href) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a4Blocks(st.code);
  if (r.msg) return { ok: false, msg: r.msg };
  const f = r.blocks[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind !== 'block' || f.tag !== 'p') return { ok: false, msg: a4Fb('wrongOpen', { tag: 'p', got: f.tag }) };
  if (!f.links.length) return { ok: false, msg: FB.noHref };
  const m = a4LinkIssue(f.links[f.links.length - 1], href);
  if (m) return { ok: false, msg: m };
  if (a4Norm(f.text) !== a4Norm(words)) return { ok: false, msg: fillL(FB.keepWords, { want: words }) };
  return { ok: true };
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a4FixCheck(st, pick(A4_FIX.pre) + ' ' + pick(A4_FIX.word), A4_FIX.href),
  view: a4FixView(A4_FIX, C.t4),
  sample: (pk) => ['<a href="toshkent.html">' + pk(CITY.toshkent) + '</a>'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a4FixCheck(st, pick(A4_FIX2.word), A4_FIX2.href), view: a4FixView(A4_FIX2, C.t4) }
});

// Т5 · своя страница внутри body: h1, потом абзац со ссылкой на файл сайта (можно ещё абзацы и списки).
function a4OwnCheck(code) {
  const r = a4Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const f = B[0];
  if (f.kind === 'list' || f.tag === 'p') return { ok: false, msg: FB.h1First };
  if (f.tag !== 'h1') return { ok: false, msg: a4Fb('mainH1', { got: f.tag }) };
  if (B.slice(1).some((b) => b.kind === 'block' && b.tag === 'h1')) return { ok: false, msg: FB.oneH1 };
  const ps = B.filter((b) => b.kind === 'block' && b.tag === 'p');
  if (!ps.length) return { ok: false, msg: FB.needP };
  const withLink = ps.find((b) => b.links.length);
  if (!withLink) return { ok: false, msg: FB.needLinkIn };
  const ln = withLink.links[0];
  const m = a4LinkIssue(ln, null);
  if (m) return { ok: false, msg: m };
  return { ok: true, result: { heading: f.text, text: withLink.text, href: ln.href, code } };
}
function a4OwnDone(code) {
  const tk = lexA4(code);
  const n = (k, name) => tk.filter((t) => t.k === k && t.name === name).length;
  return { h1: n('open', 'h1') > 0 && n('close', 'h1') > 0, p: n('open', 'p') > 0 && n('close', 'p') > 0,
    a: tk.some((t) => t.k === 'open' && t.name === 'a' && t.attrs && t.attrs.href && SITE_FILES.indexOf(t.attrs.href) >= 0) && n('close', 'a') > 0 };
}
// Код страницы — строками: каждый блок и пункт с новой строки, пункты списка — с отступом; esc — для артефакта.
function a4Lines(code, esc) {
  const toks = lexA4(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const isBlock = (t) => (t.k === 'open' || t.k === 'close') && (A4_HEAD.test(t.name) || t.name === 'p' || t.name === 'li' || !!A4_LIST[t.name]);
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  const tagText = (t) => (t.k === 'close' ? '</' + t.name + '>' : '<' + t.name + (t.name === 'a' && t.attrs && t.attrs.href !== undefined ? ' href="' + (esc ? escHtml(t.attrs.href) : t.attrs.href) + '"' : '') + '>');
  toks.forEach((t, n) => {
    if (isBlock(t)) {
      if (A4_LIST[t.name]) {
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
      let s = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || isBlock(prev)) s = s.replace(/^\s+/, '');
      if (!next || isBlock(next)) s = s.replace(/\s+$/, '');
      cur += esc ? escHtml(s) : s;
    }
  });
  flush();
  return lines;
}
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-page-link', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a4OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myText', r.result.text); store.set('myHref', r.result.href); store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), blocks: a4Page(st.code).blocks, big: true,
    aid: <><A4Tree done={a4OwnDone(st.code)} /><A4Files /></>,
    editor: <A4Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: (pk) => ['<h1>' + pk(XTRA.ownH) + '</h1>', '<p>' + pk(XTRA.ownP) + ' <a href="xiva.html">' + pk(CITY.xiva) + '</a></p>']
});

function A4Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A4TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A4Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A4Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A4Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A4Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A4Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: главная с меню-ссылками (нажимаются) → «Saqlash» → сбой: ссылки оборвались (a пропали),
// названия городов — простой текст, вкладки гаснут. Одно касание.
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
  const all = useA4Tabs(true);
  const tabs = broke ? all.map((t) => Object.assign({}, t, { st: 'off' })) : all;
  const nav = useA4Nav('index.html', broke ? 'b' : 'a');
  const tap = () => {
    if (broke) return;
    sfx('off', true);
    setBoom(true);
    setTimeout(() => setBoom(false), 700);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const name = pick(SITE['index.html'].title);
  const cities = ['toshkent', 'samarqand'];
  // Без обёртки body и с двумя городами: строки со ссылками на телефоне переносятся.
  const lines = ['<h1>' + name + '</h1>', '<ul>'].concat(cities.map((k) => '  <li>' + (broke ? pick(CITY[k]) : '<a href="' + k + '.html">' + pick(CITY[k]) + '</a>') + '</li>'), ['</ul>']);
  const shown = a4Shown(nav, { title: name, blocks: a4Page(lines.join('\n')).blocks, url: 'index.html' }, pick);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a4-sheet a4-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a4-work">
          <div className="a4-side">
            <A4Browser tabs={tabs} cur={0} title={shown.title} cls={boom ? 'a4-glitch' : ''} url={shown.url} onBack={nav.back}>
              <A4Doc blocks={shown.blocks} onNav={nav.go} />
            </A4Browser>
          </div>
          <div className="a4-main">
            <A4Code lines={lines} cls={boom ? 'a4-glitch' : ''} />
            {!broke ? (
              <div className="kz-row a4-row">
                <button type="button" className="kz-btn is-coral a4-publish" onClick={tap}>
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
// ВЫВОД: все пять вкладок горят, своя страница открыта — ссылка на ней нажимается; её код; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA4Tabs(true);
  const code = store.get('myCode') || ('<h1>' + pick(XTRA.ownH) + '</h1>\n<p>' + pick(XTRA.ownP) + ' <a href="xiva.html">' + pick(CITY.xiva) + '</a></p>');
  const lines = a4Body(a4Lines(code, false));
  const nav = useA4Nav('mening.html', 'fin');
  const shown = a4Shown(nav, { title: pick(TABS[4].name), blocks: a4Page(code).blocks, url: 'mening.html' }, pick);
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'a' || curK === 'href' || curK === 'val' ? find(/<a /) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a4-sheet a4-fin">
        <KzAsk text={c.ask} />
        <div className="a4-work">
          <div className="a4-side">
            <A4Browser tabs={tabs} cur={4} title={shown.title} pageHl={curK === 'own' && !nav.away} url={shown.url} onBack={nav.back}>
              <A4Doc blocks={shown.blocks} onNav={nav.go} />
            </A4Browser>
            <div className="a4-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a4-main">
            <A4Code lines={lines} mark={mark} />
            <div className="kz-roles a4-roles">
              {['a', 'href', 'val', 'own'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'a' ? '#0000EE' : k === 'href' ? '#7C5CFA' : k === 'val' ? '#0FA38E' : '#E44D26' }}>
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
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'myText', 'myHref', 'myTab'] };

// Артефакт — своя страница из задания 5 (тексты и адрес — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', text: store.get('myText') || '', href: store.get('myHref') || '',
    html: [A4_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a4Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika4({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
