// =============================================================================
// ПРАКТИКА 3 «Праздник Коди» (облик «Редактор»), на основе практики 02p (tools/amaliyot2):
//   · разбор кода lexA3 / a3Group / a3Plan / a3Blocks — теги уроков 1–3, одна самая полезная проблема;
//     a3Blocks раскладывает кусок body на заголовки, абзацы и списки ul / ol с пунктами li;
//   · честный браузер a3Page / A3Doc — как в уроке 3: ul — точки, ol — номера (номер, вписанный руками, —
//     второй), текст в списке без li — без точки; страница всегда помещается в окно (useA3Fit);
//   · редактор A3Editor, ряд символов A3Keys, браузер A3Browser с пятью вкладками-картой, ход задания
//     useA3Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–2), text (v — без крайних пробелов,
// raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A3_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'ul', 'ol', 'li'];
const A3_LIST = { ul: 1, ol: 1 };
const A3_HEAD = /^h[1-6]$/;
const A3_INLINE = { b: 1, i: 1 };
const A3_OUTER = { html: 1, head: 1, title: 1 };
const a3Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a3Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a3Norm = (s) => a3Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,]/g, '').replace(/\s+/g, ' ').trim();
function a3Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a3Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A3_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a3Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA3(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a3Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    const name = (close ? inner.slice(1) : inner).trim().toLowerCase();
    if (A3_KNOWN.indexOf(name) >= 0) { out.push({ k: close ? 'close' : 'open', name, raw }); continue; }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a3Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Тег без левого уголка: «h1>» или «/p>» внутри текста.
const A3_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i|ul|ol|li)\s*>)/i;
const a3Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a3Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a3Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'text') { const m = A3_NOLT.exec(t.v); if (m) return a3Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body: doctype, html, head, title и сам body — уже есть.
function a3Outer(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A3_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
  }
  return null;
}
// Текст вместе с b и i внутри него — один кусок { k: 'text', v, used: { b, i } }. b и i
// закрываются внутри куска (до следующего блочного тега), в них — хотя бы одно слово.
function a3Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', used: {}, inner: {} }; };
  const end = () => {
    if (!cur) return null;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a3Fb('inlineOpen', { tag: tg });
    cur.v = a3Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A3_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a3Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') { depth[t.name] += 1; cur.used[t.name] = true; cur.inner[t.name] = ''; }
      else {
        if (!depth[t.name]) return { msg: a3Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a3Letters(cur.inner[t.name])) return { msg: a3Fb('inlineEmpty', { tag: t.name }) };
      }
      continue;
    }
    if (t.k === 'text') {
      start();
      cur.v += t.raw;
      ['b', 'i'].forEach((tg) => { if (depth[tg] > 0) cur.inner[tg] += t.raw; });
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
function a3Plan(src, plan, opts) {
  const o = opts || {};
  const toks = lexA3(src);
  const bad = a3Bad(toks) || a3Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a3Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  const texts = {};
  let p = 0;
  let lastClose = null;
  for (let i = 0; i < L.length; i += 1) {
    const t = L[i];
    if (p >= plan.length) {
      if (t.k === 'text') return { ok: false, msg: a3Fb('textAfter', { tag: lastClose || '' }) };
      return { ok: false, msg: a3Fb('extra', { got: t.raw }) };
    }
    const want = plan[p];
    if (want.k === 'open') {
      if (t.k === 'open' && t.name === want.name) { p += 1; continue; }
      if (t.k === 'text') return { ok: false, msg: want.name === 'li' ? FB.textNoLi : a3Fb('needOpenText', { tag: want.name }) };
      if (want.name === 'li' && t.k === 'open' && A3_LIST[t.name]) return { ok: false, msg: FB.listThere };
      if (t.k === 'close') return { ok: false, msg: a3Fb('closeFirst', { got: t.name, tag: want.name }) };
      return { ok: false, msg: a3Fb('wrongOpen', { tag: want.name, got: t.name }) };
    }
    if (want.k === 'text') {
      if (t.k === 'text') {
        if (!a3Letters(t.v)) return { ok: false, msg: FB.short };
        texts[want.key] = t.v; p += 1; continue;
      }
      return { ok: false, msg: a3Fb('needText', { tag: want.name }) };
    }
    if (t.k === 'close' && t.name === want.name) { p += 1; lastClose = want.name; continue; }
    if (t.k === 'open' && t.name === want.name) return { ok: false, msg: a3Fb('needSlash', { tag: want.name }) };
    if (t.k === 'close' && A3_HEAD.test(t.name) && A3_HEAD.test(want.name)) return { ok: false, msg: a3Fb('closeMismatch', { tag: want.name }) };
    return { ok: false, msg: a3Fb(A3_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  if (p < plan.length) {
    const want = plan[p];
    if (p === 0) return { ok: false, msg: FB.empty };
    if (want.k === 'open') return { ok: false, msg: a3Fb('next', { tag: want.name }) };
    if (want.k === 'text') return { ok: false, msg: a3Fb('needText', { tag: want.name }) };
    return { ok: false, msg: a3Fb(A3_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  return { ok: true, texts };
}
const A3_LI = [{ k: 'open', name: 'li' }, { k: 'text', name: 'li', key: 'li' }, { k: 'close', name: 'li' }];

// РАЗБОР КУСКА body НА БЛОКИ: { kind: 'block', tag, text, used } (заголовок, абзац) и
// { kind: 'list', tag: 'ul' | 'ol', items: [{ text, used }] }. Первая проблема — одна фраза.
function a3Blocks(src) {
  const toks = lexA3(src);
  const bad = a3Bad(toks) || a3Outer(toks);
  if (bad) return { msg: bad };
  const g = a3Group(toks);
  if (g.msg) return { msg: g.msg };
  const L = g.list;
  const out = [];
  let i = 0;
  const closeOf = (tag, z) => {
    if (!z) return a3Fb(A3_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
    if (z.k === 'close' && z.name === tag) return null;
    if (z.k === 'open' && z.name === tag) return a3Fb('needSlash', { tag });
    return a3Fb(A3_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag });
  };
  while (i < L.length) {
    const t = L[i];
    if (t.k === 'text') return { msg: FB.textNoLi };
    if (t.k === 'close') return { msg: a3Fb('closeStray', { got: t.name }) };
    if (t.name === 'li') return { msg: FB.liOut };
    if (A3_LIST[t.name]) {
      const tag = t.name;
      const items = [];
      i += 1;
      for (;;) {
        const x = L[i];
        if (!x) return { msg: a3Fb('needClose', { tag }) };
        if (x.k === 'close' && x.name === tag) { i += 1; break; }
        if (x.k === 'close' && A3_LIST[x.name]) return { msg: a3Fb('listMismatch', { tag }) };
        if (x.k === 'text') return { msg: FB.textNoLi };
        if (x.k === 'close') return { msg: a3Fb('closeStray', { got: x.name }) };
        if (x.name !== 'li') return { msg: a3Fb('needClose', { tag }) };
        const y = L[i + 1];
        if (!y || y.k !== 'text') return { msg: a3Fb('needText', { tag: 'li' }) };
        if (!a3Letters(y.v)) return { msg: FB.short };
        const m = closeOf('li', L[i + 2]);
        if (m) return { msg: m };
        items.push({ text: y.v, used: y.used });
        i += 3;
      }
      out.push({ kind: 'list', tag, items });
      continue;
    }
    const tag = t.name;
    const y = L[i + 1];
    if (!y || y.k !== 'text') return { msg: a3Fb('needText', { tag }) };
    if (!a3Letters(y.v)) return { msg: FB.short };
    const m = closeOf(tag, L[i + 2]);
    if (m) return { msg: m };
    out.push({ kind: 'block', tag, text: y.v, used: y.used });
    i += 3;
  }
  return { blocks: out };
}
const A3_NUM = /^\s*\d+\s*[.)]/;
const a3ManualNum = (list) => list.tag === 'ol' && list.items.some((it) => A3_NUM.test(it.text));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроках 2–3. Название — между <title> и </title>; без title в коде — название
// страницы (head над частью body). Окно — блоки: заголовки и абзацы { tag, inh, runs } и списки
// { tag: 'ul' | 'ol' | 'loose', items: [{ runs, bare }] }: ul — точки, ol — номера по порядку (ставит браузер;
// номер, вписанный руками, — второй), текст в списке без li — без точки и номера (bare), li без списка —
// с точкой (loose). Незакрытый h1 делает крупным всё ниже, незакрытый b — жирным весь текст дальше.
function a3Page(src, fixedTitle) {
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
  const nb = (tag) => { list = null; item = null; cur = { tag, inh: A3_HEAD.test(tag) ? 0 : hOpen, runs: [] }; blocks.push(cur); };
  lexA3(rest).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      const n = t.name;
      if (A3_HEAD.test(n)) {
        if (t.k === 'open') { hOpen = 0; nb(n); hOpen = Number(n.charAt(1)); }
        else { hOpen = 0; cur = null; }
        return;
      }
      if (n === 'p') { if (t.k === 'open') nb('p'); else if (cur && cur.tag === 'p') cur = null; return; }
      if (A3_LIST[n]) {
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
      if (A3_INLINE[n]) d[n] = t.k === 'open' ? d[n] + 1 : Math.max(0, d[n] - 1);
      return;
    }
    let txt = null;
    if (t.k === 'text') txt = t.raw;
    else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
    if (txt == null) return;
    const run = { t: txt, b: d.b > 0, i: d.i > 0 };
    if (list) {
      if (!item) { item = { runs: [], bare: true }; list.items.push(item); }
      item.runs.push(run);
      return;
    }
    if (!cur) nb('raw');
    cur.runs.push(run);
  });
  const has = (runs) => runs.some((r) => r.t.trim());
  return { title: a3Squash(title), eaten, blocks: blocks.filter((bk) => (bk.items ? bk.items.some((it) => has(it.runs)) : has(bk.runs))) };
}
// Страница всегда помещается в окно целиком (как в уроке 2): не влезает — шрифт ступеньками
// уменьшается, не меньше 56 %.
function useA3Fit(dep) {
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
function A3Doc({ blocks, flash }) {
  const ref = useA3Fit(JSON.stringify(blocks));
  if (!blocks || !blocks.length) return null;
  const runs = (rs) => rs.map((r, j) => <span key={j} className={((r.b ? 'a3-wb' : '') + (r.i ? ' a3-wi' : '')).trim() || undefined}>{r.t}</span>);
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a3-doc' + (flash ? ' a3-in' : '')}>
      {blocks.map((bk, i) => {
        if (bk.items) {
          const L = bk.tag === 'ol' ? 'ol' : 'ul';
          return (
            <L key={i} className={'a3-blk a3-list a3-' + bk.tag + (bk.inh ? ' a3-inh' + bk.inh : '')}>
              {bk.items.filter((it) => it.runs.some((r) => r.t.trim())).map((it, j) => (it.bare
                ? <span key={j} className="a3-bare">{runs(it.runs)}</span> : <li key={j}>{runs(it.runs)}</li>))}
            </L>
          );
        }
        return <div key={i} className={'a3-blk a3-' + bk.tag + (bk.inh ? ' a3-inh' + bk.inh : '')}>{runs(bk.runs)}</div>;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a3Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a3-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a3-t">{p}</span>;
    return (
      <span key={i} className="a3-g">
        <span className="a3-b">{'<' + m[1]}</span><span className="a3-n">{m[2]}</span>
        {m[3] ? <span className="a3-a">{m[3]}</span> : null}<span className="a3-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a3Insert(el, ch) {
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
const A3_MAX = 1200;
function A3Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a3-edit');
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
    <div key={key} className={'a3-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a3Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a3-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a3-edit' + (led ? ' is-led' : '')}>
        <div className="a3-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a3-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A3_MAX)); }}
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
function A3Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a3-ed a3-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a3-ln a3-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a3-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a3Hl(t) : '​'}</button>
      ) : <div key={i} className={'a3-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a3Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A3Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a3-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a3Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
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
const A3_ICO = {
  menu: <><path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10" /><path d="M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9" /></>,
  balloon: <><ellipse cx="12" cy="9" rx="5.5" ry="6.5" /><path d="M12 15.5l-1.2 2h2.4zM12 17.5c0 2-2 2.5-1 4.5" /></>,
  cake: <><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M4 15c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0M12 11V7.5" /><path d="M12 4.5c.8.8.8 1.8 0 2.4-.8-.6-.8-1.6 0-2.4z" /></>,
  list: <><path d="M10 6h10M10 12h10M10 18h10" /><path d="M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const A3Fav = ({ ico, c, off }) => (
  <i className={'a3-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A3_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A3Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a3-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a3-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a3-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a3-pop' : '')}>
            <A3Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a3-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A3Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a3-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows"><i className="kz-ar-l" aria-hidden="true" /><i className="kz-ar-r" aria-hidden="true" /></span>
        <span className="kz-br-url"><i className="kz-br-lock" aria-hidden="true" /><span className="kz-br-url-t">index.html</span></span>
      </div>
      <div className="kz-br-body">
        <Cut c={KZ.cream} seed={32} n={16} amp={1.1} asp={1.6} cls="kz-br-paper" />
        <div className="kz-br-page">{children}</div>
      </div>
    </div>
  );
}

// Вкладки по стору: решённые задания — горят. all — горят все (крючок до сбоя, вывод).
function useA3Tabs(all) {
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
const A3_COL = { h1: 'var(--r-html)', ul: 'var(--r-body)', ol: 'var(--r-body)', li: 'var(--r-head)' };
// Три места строки: открывающий тег · слово / шаг · закрывающий; rep — «3 раза».
function A3Slots({ tag, mid, rep, wrap }) {
  const pick = usePick();
  const items = [{ k: 'open', code: '<' + tag + '>' }, { k: mid, code: null }, { k: 'close', code: '</' + tag + '>' }];
  return (
    <div className="a3-slots" translate="no">
      {wrap ? <span className="a3-slot is-wrap" style={{ '--pc': A3_COL[wrap] }}><code>{'<' + wrap + '>'}</code></span> : null}
      {items.map((x, n) => (
        <span key={x.k} className={'a3-slot is-' + x.k} style={{ '--pc': A3_COL[tag] }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(UI.part[x.k])}</em>}
        </span>
      ))}
      {rep ? <span className="a3-rep">× {pick(UI.three)}</span> : null}
      {wrap ? <span className="a3-slot is-wrap" style={{ '--pc': A3_COL[wrap] }}><code>{'</' + wrap + '>'}</code></span> : null}
    </div>
  );
}
// Схема своего списка: body уже есть; h1, ul или ol, li × 3 — пишет ученик.
function A3Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a3-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a3-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a3-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a3-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a3-tree" translate="no">
      {row('', 'body', 'var(--r-body)', UI.given, true)}
      {row('├─ ', 'h1', A3_COL.h1, UI.bpH1, D.h1)}
      {row('└─ ', 'ul / ol', A3_COL.ul, UI.bpList, D.list)}
      {row('   └─ ', 'li', A3_COL.li, UI.bpLi, D.li)}
    </div>
  );
}
// Образец третьей ступени — под редактором, с другим содержимым.
const A3Sample = ({ lines }) => {
  const pick = usePick();
  return (
    <div className="a3-sample">
      <span className="a3-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A3Code lines={lines} cls="a3-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A3_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA3Task(cfg) {
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
    if (fails >= A3_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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
function A3TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA3Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA3Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a3-sheet a3-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <div className={'a3-work' + (v.big ? ' is-big' : '')}>
          <div className="a3-side">
            <A3Browser tabs={tabs} cur={cfg.num - 1} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}>
              <A3Doc blocks={v.blocks} flash={t.flash} />
            </A3Browser>
            {v.aid || null}
          </div>
          <div className="a3-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A3Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A3Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ
// ─────────────────────────────────────────────────────────────────────────────
const A3_DOC = '<!DOCTYPE html>';
const a3Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);

// Т1 · поле в строке: слово в пустом li меню (ul уже есть; смесь с уроком 2 — h1 над списком).
function a3FieldCheck(v, want) {
  const s = a3Squash(v);
  if (!s) return { ok: false, msg: fillL(L3("Hozircha bo'sh. li ichiga «{want}» deb yozing.", 'Пока пусто. Впиши в li «{want}».', 'It’s empty. Type “{want}” inside li.'), { want }) };
  if (/[<>]/.test(s)) return { ok: false, msg: UI.noTags };
  if (a3Norm(s) !== a3Norm(want)) return { ok: false, msg: fillL(FB.wrongItem, { got: s, want }) };
  return { ok: true };
}
function a3FieldView() {
  return (st, x) => {
    const tab = TABS[0];
    const v = st.v || '';
    const name = x.pick(tab.name);
    const items = tab.items.map((it) => x.pick(it));
    const code = ['<h1>' + name + '</h1>', '<ul>'].concat(items.map((t) => '<li>' + t + '</li>'), ['<li>' + v + '</li>', '</ul>']).join('\n');
    const lines = [
      { k: 'b', parts: [T_('body')] },
      { k: 'h1', d: 1, parts: [T_('h1'), W_(name), T_('h1', true)] },
      { k: 'ul', d: 1, parts: [T_('ul')] }
    ].concat(items.map((t, n) => ({ k: 'li' + n, d: 2, parts: [T_('li'), W_(t), T_('li', true)] })), [
      { k: 'gap', d: 2, cls: x.solved ? 'is-new' : 'is-hl', parts: [T_('li'), x.solved ? W_(v) : (
        <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
          <InlineInput value={v} onChange={(s) => x.set({ v: s })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={30}
            onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a3-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
        </span>), T_('li', true)] },
      { k: 'ulc', d: 1, parts: [T_('ul', true)] },
      { k: 'bc', parts: [T_('body', true)] }
    ]);
    return {
      title: name, blocks: a3Page(code).blocks,
      editor: <div className="a3-fieldwrap"><KzCode cls="a3-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = (pick) => ({
  id: 't1', num: 1, kind: 'write-li-text', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a3FieldCheck(st.v, pick(TABS[0].want)),
  view: a3FieldView(),
  sample: (pk) => ['<li>' + pk(XTRA.salad) + '</li>'],
  drill: { init: () => ({ v: '' }), check: (st) => a3FieldCheck(st.v, pick(XTRA.icecream)), view: a3FieldView() }
});

// Т2 · строка: <li>…</li> целиком внутри готового ul.
function a3LineCheck(code, want) {
  const r = a3Plan(code, A3_LI);
  if (!r.ok) return r;
  if (a3Norm(r.texts.li) !== a3Norm(want)) return { ok: false, msg: fillL(FB.wrongItem, { got: r.texts.li, want }) };
  return { ok: true };
}
function a3LineView() {
  return (st, x) => {
    const tab = TABS[1];
    const before = ['<body>', '  <h1>' + x.pick(tab.name) + '</h1>', '  <ul>', '    <li>' + x.pick(tab.before) + '</li>'];
    const after = ['    <li>' + x.pick(tab.after) + '</li>', '  </ul>', '</body>'];
    return {
      title: x.pick(tab.name), blocks: a3Page(before.concat([st.code], after).join('\n')).blocks,
      aid: <A3Slots tag="li" mid="word" />,
      editor: <A3Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-li-line', C: C.t2,
  init: () => ({ code: '    ' }),
  check: (st) => a3LineCheck(st.code, pick(TABS[1].want)),
  view: a3LineView(),
  sample: (pk) => ['<li>' + pk(XTRA.flowers) + '</li>'],
  drill: { init: () => ({ code: '    ' }), check: (st) => a3LineCheck(st.code, pick(XTRA.confetti)), view: a3LineView() }
});

// Т3 · блок: список ol из трёх и больше li (свои шаги; номера — не руками).
function a3OlCheck(code) {
  const r = a3Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const first = B[0];
  if (first.kind !== 'list') return { ok: false, msg: a3Fb('wrongOpen', { tag: 'ol', got: first.tag }) };
  if (first.tag !== 'ol') return { ok: false, msg: FB.olNeeded };
  if (a3ManualNum(first)) return { ok: false, msg: FB.manualNum };
  if (first.items.length < 3) return { ok: false, msg: fillL(FB.moreItems, { n: String(first.items.length) }) };
  if (B.length > 1) return { ok: false, msg: FB.oneList };
  return { ok: true };
}
function a3OlView(heading) {
  return (st, x) => {
    const before = ['<body>', '  <h1>' + x.pick(heading) + '</h1>'];
    const after = ['</body>'];
    return {
      title: x.pick(TABS[2].name), blocks: a3Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A3Slots tag="li" mid="step" rep wrap="ol" />,
      editor: <A3Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = () => ({
  id: 't3', num: 3, kind: 'write-ol', C: C.t3,
  init: () => ({ code: '  ' }),
  check: (st) => a3OlCheck(st.code),
  view: a3OlView(TABS[2].name),
  sample: (pk) => ['<ol>'].concat(XTRA.tea.map((t) => '  <li>' + pk(t) + '</li>'), ['</ol>']),
  drill: { init: () => ({ code: '  ' }), check: (st) => a3OlCheck(st.code), view: a3OlView(XTRA.gift) }
});

// Т4 · найти строку и исправить: номер, вписанный руками в ol, — на странице два номера («2. 2.»).
function a3FixView(data, C4) {
  return (st, x) => {
    const steps = data.steps.map((t) => x.pick(t));
    const BAD = 3 + data.bad;
    const lines = a3Body(['<h1>' + x.pick(TABS[3].name) + '</h1>', '<ol>'].concat(steps.map((t, n) => '  <li>' + (n === data.bad ? (n + 1) + '. ' : '') + t + '</li>'), ['</ol>']));
    const title = x.pick(TABS[3].name);
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); const n = el.value.indexOf('<li>'); const at = n < 0 ? 0 : n + 4; el.setSelectionRange(at, at); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i] || C4.why.step);
    };
    if (st.at == null) {
      return {
        title, blocks: a3Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: C4.ask,
        editor: <A3Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title, blocks: a3Page(before.concat([st.code], after).join('\n')).blocks, ask: C4.ask2,
      editor: <A3Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a3FixCheck(st, words) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a3Plan(st.code, A3_LI);
  if (!r.ok) return r;
  if (A3_NUM.test(r.texts.li)) return { ok: false, msg: FB.manualNum };
  if (a3Norm(r.texts.li) !== a3Norm(words)) return { ok: false, msg: fillL(FB.keepStep, { want: words }) };
  return { ok: true };
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a3FixCheck(st, pick(TABS[3].steps[TABS[3].bad])),
  view: a3FixView(TABS[3], C.t4),
  sample: (pk) => ['<li>' + pk(TABS[3].steps[0]) + '</li>'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a3FixCheck(st, pick(XTRA.dance.steps[XTRA.dance.bad])), view: a3FixView(XTRA.dance, C.t4) }
});

// Т5 · свой список внутри body: h1, потом ul или ol с тремя и больше li (можно ещё абзацы и h2).
function a3OwnCheck(code) {
  const r = a3Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const f = B[0];
  if (f.kind === 'list' || f.tag === 'p') return { ok: false, msg: FB.h1First };
  if (f.tag !== 'h1') return { ok: false, msg: a3Fb('mainH1', { got: f.tag }) };
  if (B.slice(1).some((b) => b.kind === 'block' && b.tag === 'h1')) return { ok: false, msg: FB.oneH1 };
  const lists = B.filter((b) => b.kind === 'list');
  if (!lists.length) return { ok: false, msg: FB.needList };
  if (lists.some(a3ManualNum)) return { ok: false, msg: FB.manualNum };
  const big = lists.find((l) => l.items.length >= 3);
  if (!big) return { ok: false, msg: fillL(FB.moreItems, { n: String(Math.max.apply(null, lists.map((l) => l.items.length))) }) };
  return { ok: true, result: { heading: f.text, items: big.items.map((it) => it.text), code } };
}
function a3OwnDone(code) {
  const tk = lexA3(code);
  const n = (k, name) => tk.filter((t) => t.k === k && t.name === name).length;
  return { h1: n('open', 'h1') > 0 && n('close', 'h1') > 0,
    list: (n('open', 'ul') > 0 && n('close', 'ul') > 0) || (n('open', 'ol') > 0 && n('close', 'ol') > 0),
    li: n('open', 'li') >= 3 && n('close', 'li') >= 3 };
}
// Код страницы — строками: каждый блок и пункт с новой строки, пункты списка — с отступом; esc — для артефакта.
function a3Lines(code, esc) {
  const toks = lexA3(code);
  const lines = [];
  let cur = '';
  let depth = 0;
  const isBlock = (t) => (t.k === 'open' || t.k === 'close') && (A3_HEAD.test(t.name) || t.name === 'p' || t.name === 'li' || !!A3_LIST[t.name]);
  const flush = () => { if (cur.trim()) lines.push('  '.repeat(depth) + cur.trim()); cur = ''; };
  toks.forEach((t, n) => {
    if (isBlock(t)) {
      if (A3_LIST[t.name]) {
        flush();
        if (t.k === 'close') depth = Math.max(0, depth - 1);
        lines.push('  '.repeat(depth) + (t.k === 'close' ? '</' : '<') + t.name + '>');
        if (t.k === 'open') depth += 1;
        return;
      }
      if (t.k === 'open') { flush(); cur = '<' + t.name + '>'; return; }
      cur += '</' + t.name + '>';
      flush();
      return;
    }
    if (t.k === 'open' || t.k === 'close') { cur += (t.k === 'close' ? '</' : '<') + t.name + '>'; return; }
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
  id: 't5', num: 5, kind: 'write-list', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a3OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myItems', r.result.items); store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), blocks: a3Page(st.code).blocks, big: true,
    aid: <A3Tree done={a3OwnDone(st.code)} />,
    editor: <A3Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: (pk) => ['<h1>' + pk(XTRA.own.h) + '</h1>', '<ul>'].concat(XTRA.own.items.map((t) => '  <li>' + pk(t) + '</li>'), ['</ul>'])
});

function A3Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A3TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A3Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A3Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A3Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A3Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A3Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: меню праздника — заголовок и список → «Saqlash» → сбой: теги пропали, пункты слиплись в
// одну строку, вкладки гаснут. Одно касание.
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
  const all = useA3Tabs(true);
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
  const name = pick(TABS[0].name);
  const items = TABS[0].items.concat([TABS[0].want]).map((t) => pick(t));
  const lines = broke ? a3Body([name].concat(items))
    : a3Body(['<h1>' + name + '</h1>', '<ul>'].concat(items.map((t) => '  <li>' + t + '</li>'), ['</ul>']));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a3-sheet a3-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a3-work">
          <div className="a3-side">
            <A3Browser tabs={tabs} cur={0} title={name} cls={boom ? 'a3-glitch' : ''}>
              <A3Doc blocks={a3Page(lines.join('\n')).blocks} />
            </A3Browser>
          </div>
          <div className="a3-main">
            <A3Code lines={lines} cls={boom ? 'a3-glitch' : ''} />
            {!broke ? (
              <div className="kz-row a3-row">
                <button type="button" className="kz-btn is-coral a3-publish" onClick={tap}>
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
// ВЫВОД: все пять вкладок горят, свой список открыт; его код; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA3Tabs(true);
  const code = store.get('myCode') || ['<h1>' + pick(XTRA.own.h) + '</h1>', '<ul>'].concat(XTRA.own.items.map((t) => '<li>' + pick(t) + '</li>'), ['</ul>']).join('\n');
  const lines = a3Body(a3Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'ul' ? find(/<ul>/) : curK === 'ol' ? find(/<ol>/) : curK === 'li' ? find(/<li>/) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a3-sheet a3-fin">
        <KzAsk text={c.ask} />
        <div className="a3-work">
          <div className="a3-side">
            <A3Browser tabs={tabs} cur={4} title={pick(TABS[4].name)} pageHl={curK === 'own'}><A3Doc blocks={a3Page(code).blocks} /></A3Browser>
            <div className="a3-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a3-main">
            <A3Code lines={lines} mark={mark} />
            <div className="kz-roles a3-roles">
              {['ul', 'ol', 'li', 'own'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'ul' ? '#0FA38E' : k === 'ol' ? '#7C5CFA' : k === 'li' ? '#FA4F28' : '#E44D26' }}>
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
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'myItems', 'myTab'] };

// Артефакт — свой список из задания 5 (тексты — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', items: store.get('myItems') || [],
    html: [A3_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a3Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika3({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
