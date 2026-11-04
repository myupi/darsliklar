// =============================================================================
// ПРАКТИКА 2 «Газета Коди» (облик «Редактор»), на каркасе практики 01p (tools/amaliyot1):
//   · разбор кода lexA2 / a2Group / a2Plan — теги уроков 1–2, одна самая полезная проблема;
//     b и i внутри текста сливаются с ним в один кусок (a2Group) и проверяются на закрытие;
//   · честный браузер a2Page / A2Doc — как в уроке 2: заголовки убывают от h1 к h6, строки кода
//     склеиваются, каждый p — свой абзац, незакрытый h1 делает крупным всё ниже, незакрытый b —
//     жирным весь текст дальше; страница всегда помещается в окно (шрифт уменьшается);
//   · настоящий редактор A2Editor, ряд символов A2Keys, браузер A2Browser с пятью вкладками-картой,
//     ход задания useA2Task — общие части каркаса 01p, не меняются.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc, open / close (теги уроков 1–2), text (v — без крайних пробелов,
// raw — с одним пробелом по краям, для страницы), bad (why: noGt, emptyTag, backslash, typo,
// unknown, noLevel). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A2_KNOWN = ['html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i'];
const A2_HEAD = /^h[1-6]$/;
const A2_INLINE = { b: 1, i: 1 };
const A2_OUTER = { html: 1, head: 1, title: 1 };
const a2Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a2Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a2Norm = (s) => a2Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!,]/g, '').replace(/\s+/g, ' ').trim();
function a2Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a2Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A2_KNOWN.forEach((k) => { if (k.length < 3) return; const dd = a2Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA2(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a2Squash(text); if (v) out.push({ k: 'text', v, raw: text.replace(/\s+/g, ' ') }); text = ''; };
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
    if (A2_KNOWN.indexOf(name) >= 0) { out.push({ k: close ? 'close' : 'open', name, raw }); continue; }
    if (/^h\s*\d+$/.test(name)) { out.push({ k: 'bad', why: 'noLevel', bad: raw }); continue; }
    const near = a2Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Тег без левого уголка: «h1>» или «/p>» внутри текста.
const A2_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body|h[1-6]|p|b|i)\s*>)/i;
const a2Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a2Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a2Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'text') { const m = A2_NOLT.exec(t.v); if (m) return a2Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// Только часть body: doctype, html, head, title и сам body — уже есть.
function a2Outer(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc' || ((t.k === 'open' || t.k === 'close') && A2_OUTER[t.name])) return FB.inBody;
    if ((t.k === 'open' || t.k === 'close') && t.name === 'body') return FB.hasBody;
  }
  return null;
}
// Текст вместе с b и i внутри него — один кусок { k: 'text', v, used: { b, i } }. b и i
// закрываются внутри куска (до следующего блочного тега), в них — хотя бы одно слово.
function a2Group(toks) {
  const out = [];
  let cur = null;
  const depth = { b: 0, i: 0 };
  const start = () => { if (!cur) cur = { k: 'text', v: '', used: {}, inner: {} }; };
  const end = () => {
    if (!cur) return null;
    for (const tg of ['b', 'i']) if (depth[tg] > 0) return a2Fb('inlineOpen', { tag: tg });
    cur.v = a2Squash(cur.v);
    out.push(cur); cur = null;
    return null;
  };
  for (let n = 0; n < toks.length; n += 1) {
    const t = toks[n];
    if ((t.k === 'open' || t.k === 'close') && A2_INLINE[t.name]) {
      start();
      if (t.k === 'open' && depth[t.name] > 0) return { msg: a2Fb('needSlash', { tag: t.name }) };
      if (t.k === 'open') { depth[t.name] += 1; cur.used[t.name] = true; cur.inner[t.name] = ''; }
      else {
        if (!depth[t.name]) return { msg: a2Fb('inlineStray', { tag: t.name }) };
        depth[t.name] -= 1;
        if (!a2Letters(cur.inner[t.name])) return { msg: a2Fb('inlineEmpty', { tag: t.name }) };
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
function a2Plan(src, plan, opts) {
  const o = opts || {};
  const toks = lexA2(src);
  const bad = a2Bad(toks) || a2Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a2Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  const texts = {};
  let p = 0;
  let lastClose = null;
  for (let i = 0; i < L.length; i += 1) {
    const t = L[i];
    if (p >= plan.length) {
      if (t.k === 'text') return { ok: false, msg: a2Fb('textAfter', { tag: lastClose || '' }) };
      return { ok: false, msg: a2Fb('extra', { got: t.raw }) };
    }
    const want = plan[p];
    if (want.k === 'open') {
      if (t.k === 'open' && t.name === want.name) { p += 1; continue; }
      if (t.k === 'text') return { ok: false, msg: o.textOut && want.name === 'p' ? FB.textOutP : a2Fb('needOpenText', { tag: want.name }) };
      if (t.k === 'close') return { ok: false, msg: a2Fb('closeFirst', { got: t.name, tag: want.name }) };
      if (A2_HEAD.test(want.name) && A2_HEAD.test(t.name)) return { ok: false, msg: t.name === 'h1' ? FB.h1Taken : a2Fb('wrongLevel', { tag: want.name, got: t.name }) };
      return { ok: false, msg: a2Fb('wrongOpen', { tag: want.name, got: t.name }) };
    }
    if (want.k === 'text') {
      if (t.k === 'text') {
        if (!a2Letters(t.v)) return { ok: false, msg: FB.short };
        texts[want.key] = t.v; p += 1; continue;
      }
      return { ok: false, msg: a2Fb('needText', { tag: want.name }) };
    }
    if (t.k === 'close' && t.name === want.name) { p += 1; lastClose = want.name; continue; }
    if (t.k === 'open' && t.name === want.name) return { ok: false, msg: a2Fb('needSlash', { tag: want.name }) };
    if (t.k === 'close' && A2_HEAD.test(t.name) && A2_HEAD.test(want.name)) return { ok: false, msg: a2Fb('closeMismatch', { tag: want.name }) };
    return { ok: false, msg: a2Fb(A2_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  if (p < plan.length) {
    const want = plan[p];
    if (p === 0) return { ok: false, msg: FB.empty };
    if (want.k === 'open') return { ok: false, msg: o.moreP && want.name === 'p' ? FB.oneP : a2Fb('next', { tag: want.name }) };
    if (want.k === 'text') return { ok: false, msg: a2Fb('needText', { tag: want.name }) };
    return { ok: false, msg: a2Fb(A2_HEAD.test(want.name) ? 'headOpen' : 'needClose', { tag: want.name }) };
  }
  return { ok: true, texts };
}
const A2_H2 = [{ k: 'open', name: 'h2' }, { k: 'text', name: 'h2', key: 'h2' }, { k: 'close', name: 'h2' }];
const A2_P = (key) => [{ k: 'open', name: 'p' }, { k: 'text', name: 'p', key }, { k: 'close', name: 'p' }];
const A2_TWO_P = A2_P('p1').concat(A2_P('p2'));

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕСТНЫЙ БРАУЗЕР — как в уроке 2. Название — между <title> и </title> (нет </title> — остальное
// уходит на вкладку); без title в коде — название страницы (head над частью body). Окно — блоки:
// { tag: 'h1'…'h6' | 'p' | 'raw', inh — уровень незакрытого заголовка выше, runs: [{ t, b, i }] }.
// ─────────────────────────────────────────────────────────────────────────────
function a2Page(src, fixedTitle) {
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
  let hOpen = 0;
  const d = { b: 0, i: 0 };
  const nb = (tag) => { cur = { tag, inh: A2_HEAD.test(tag) ? 0 : hOpen, runs: [] }; blocks.push(cur); };
  lexA2(rest).forEach((t) => {
    if (t.k === 'open' || t.k === 'close') {
      if (A2_HEAD.test(t.name)) {
        if (t.k === 'open') { hOpen = 0; nb(t.name); hOpen = Number(t.name.charAt(1)); }
        else { hOpen = 0; cur = null; }
        return;
      }
      if (t.name === 'p') { if (t.k === 'open') nb('p'); else if (cur && cur.tag === 'p') cur = null; return; }
      if (A2_INLINE[t.name]) d[t.name] = t.k === 'open' ? d[t.name] + 1 : Math.max(0, d[t.name] - 1);
      return;
    }
    let txt = null;
    if (t.k === 'text') txt = t.raw;
    else if (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')) txt = ' ' + t.bad + ' ';
    if (txt == null) return;
    if (!cur) nb('raw');
    cur.runs.push({ t: txt, b: d.b > 0, i: d.i > 0 });
  });
  return { title: a2Squash(title), eaten, blocks: blocks.filter((bk) => bk.runs.some((r) => r.t.trim())) };
}
// Страница всегда помещается в окно целиком (как в уроке 2): не влезает — шрифт ступеньками
// уменьшается, не меньше 56 %.
function useA2Fit(dep) {
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
function A2Doc({ blocks, flash }) {
  const ref = useA2Fit(JSON.stringify(blocks));
  if (!blocks || !blocks.length) return null;
  return (
    <div ref={ref} key={'d' + (flash || 0)} className={'a2-doc' + (flash ? ' a2-in' : '')}>
      {blocks.map((bk, i) => (
        <div key={i} className={'a2-blk a2-' + bk.tag + (bk.inh ? ' a2-inh' + bk.inh : '')}>
          {bk.runs.map((r, j) => <span key={j} className={((r.b ? 'a2-wb' : '') + (r.i ? ' a2-wi' : '')).trim() || undefined}>{r.t}</span>)}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a2Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a2-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a2-t">{p}</span>;
    return (
      <span key={i} className="a2-g">
        <span className="a2-b">{'<' + m[1]}</span><span className="a2-n">{m[2]}</span>
        {m[3] ? <span className="a2-a">{m[3]}</span> : null}<span className="a2-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a2Insert(el, ch) {
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
// одна строка (Enter не переносит); big — во всё свободное место (своя статья).
// ─────────────────────────────────────────────────────────────────────────────
const A2_MAX = 1200;
function A2Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a2-edit');
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
    <div key={key} className={'a2-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a2Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a2-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a2-edit' + (led ? ' is-led' : '')}>
        <div className="a2-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a2-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A2_MAX)); }}
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
function A2Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a2-ed a2-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a2-ln a2-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a2-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a2Hl(t) : '​'}</button>
      ) : <div key={i} className={'a2-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a2Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A2Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a2-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a2Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
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
const A2_ICO = {
  news: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h4M7 16h4M13 12h4v4h-4z" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5l4 2.9-1.5 4.6h-5L8 10.4z" /><path d="M12 3v4.5M16 10.4l4.3-1.4M14.5 15l2.7 3.6M9.5 15l-2.7 3.6M8 10.4 3.7 9" /></>,
  paw: <><circle cx="6.5" cy="10.5" r="1.8" /><circle cx="10" cy="6.5" r="1.8" /><circle cx="14.5" cy="6.5" r="1.8" /><circle cx="18" cy="10.5" r="1.8" /><path d="M12.2 12.5c-2.8 0-5 3-4.6 5.1.4 1.7 2.9 1.3 4.6 1.3s4.2.4 4.6-1.3c.4-2.1-1.8-5.1-4.6-5.1z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  pen: <><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></>,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const A2Fav = ({ ico, c, off }) => (
  <i className={'a2-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A2_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A2Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a2-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a2-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a2-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a2-pop' : '')}>
            <A2Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a2-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A2Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a2-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
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
function useA2Tabs(all) {
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
const A2_COL = { h1: 'var(--r-html)', h2: 'var(--r-html)', p: 'var(--r-body)', b: 'var(--r-head)', i: 'var(--r-head)' };
// Три места строки: открывающий тег · слово / предложение · закрывающий; rep — «2 раза».
function A2Slots({ tag, mid, rep }) {
  const pick = usePick();
  const items = [{ k: 'open', code: '<' + tag + '>' }, { k: mid, code: null }, { k: 'close', code: '</' + tag + '>' }];
  return (
    <div className="a2-slots" translate="no">
      {items.map((x, n) => (
        <span key={x.k} className={'a2-slot is-' + x.k} style={{ '--pc': A2_COL[tag] }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(UI.part[x.k])}</em>}
        </span>
      ))}
      {rep ? <span className="a2-rep">× {pick(UI.twice)}</span> : null}
    </div>
  );
}
// Схема своей статьи: body уже есть; h1, p и в нём b или i — пишет ученик.
function A2Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a2-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a2-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a2-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a2-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a2-tree" translate="no">
      {row('', 'body', 'var(--r-body)', UI.given, true)}
      {row('├─ ', 'h1', A2_COL.h1, UI.bpH1, D.h1)}
      {row('└─ ', 'p', A2_COL.p, UI.bpP, D.p)}
      {row('   └─ ', 'b / i', A2_COL.b, UI.bpBI, D.bi)}
    </div>
  );
}
// Образец третьей ступени — под редактором, с другим содержимым.
const A2Sample = ({ lines }) => {
  const pick = usePick();
  return (
    <div className="a2-sample">
      <span className="a2-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A2Code lines={lines} cls="a2-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ (каркас 01p). Запись в сторе (tN): st — код ученика; checks — проверки; fails —
// неудачи подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A2_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA2Task(cfg) {
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
    if (fails >= A2_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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
function A2TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA2Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA2Tabs(false);
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
      <Sheet cls={'a2-sheet a2-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <div className={'a2-work' + (v.big ? ' is-big' : '')}>
          <div className="a2-side">
            <A2Browser tabs={tabs} cur={cfg.num - 1} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}>
              <A2Doc blocks={v.blocks} flash={t.flash} />
            </A2Browser>
            {v.aid || null}
          </div>
          <div className="a2-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A2Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A2Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ
// ─────────────────────────────────────────────────────────────────────────────
const A2_DOC = '<!DOCTYPE html>';
const a2Body = (lines) => ['<body>'].concat(lines.map((s) => '  ' + s), ['</body>']);

// Т1 · поле в строке: слова в h1 (смесь с уроком 1: title — на вкладке, h1 — на странице).
function a2FieldCheck(v, want) {
  const s = a2Squash(v);
  if (!s) return { ok: false, msg: fillL(L3("Hozircha bo'sh. h1 ichiga «{want}» deb yozing.", 'Пока пусто. Впиши в h1 «{want}».', 'It’s empty. Type “{want}” inside h1.'), { want }) };
  if (/[<>]/.test(s)) return { ok: false, msg: UI.noTags };
  if (a2Norm(s) !== a2Norm(want)) return { ok: false, msg: fillL(FB.wrongHead, { got: s, want }) };
  return { ok: true };
}
function a2FieldView(tab) {
  return (st, x) => {
    const v = st.v || '';
    const name = x.pick(tab.name), text = x.pick(tab.text);
    return {
      title: name,
      blocks: a2Page('<h1>' + v + '</h1><p>' + text + '</p>').blocks,
      editor: (
        <div className="a2-fieldwrap">
          <KzCode cls="a2-kz" lines={[
            { k: 'hd', parts: [T_('head')] },
            { k: 't', d: 1, parts: [T_('title'), W_(name), T_('title', true)] },
            { k: 'hc', parts: [T_('head', true)] },
            { k: 'b', parts: [T_('body')] },
            { k: 'h1', d: 1, cls: x.solved ? 'is-new' : 'is-hl', parts: [T_('h1'), x.solved ? W_(v) : (
              <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
                <InlineInput value={v} onChange={(s) => x.set({ v: s })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={30}
                  onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a2-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
              </span>), T_('h1', true)] },
            { k: 'x', d: 1, parts: [T_('p'), W_(text), T_('p', true)] },
            { k: 'bc', parts: [T_('body', true)] }
          ]} />
        </div>
      ),
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = (pick) => {
  const want = pick(TABS[0].name);
  const school = pick(XTRA.school);
  return {
    id: 't1', num: 1, kind: 'write-h1', C: C.t1,
    init: () => ({ v: '' }),
    check: (st) => a2FieldCheck(st.v, want),
    view: a2FieldView(TABS[0]),
    sample: (pk) => ['<h1>' + pk(XTRA.books) + '</h1>'],
    drill: { init: () => ({ v: '' }), check: (st) => a2FieldCheck(st.v, school), view: a2FieldView(TABS[0]) }
  };
};

// Т2 · строка: <h2>…</h2> целиком под h1.
function a2LineCheck(code, want) {
  const r = a2Plan(code, A2_H2);
  if (!r.ok) return r;
  if (a2Norm(r.texts.h2) !== a2Norm(want)) return { ok: false, msg: fillL(FB.wrongWord, { got: r.texts.h2, want }) };
  return { ok: true };
}
function a2LineView() {
  return (st, x) => {
    const tab = TABS[1];
    const before = ['<body>', '  <h1>' + x.pick(tab.name) + '</h1>'];
    const after = ['  <p>' + x.pick(tab.text) + '</p>', '</body>'];
    return {
      title: x.pick(tab.name), blocks: a2Page(before.concat([st.code], after).join('\n')).blocks,
      aid: <A2Slots tag="h2" mid="word" />,
      editor: <A2Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-line', C: C.t2,
  init: () => ({ code: '  ' }),
  check: (st) => a2LineCheck(st.code, pick(TABS[1].h2)),
  view: a2LineView(),
  sample: (pk) => ['<h2>' + pk(XTRA.basket) + '</h2>'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a2LineCheck(st.code, pick(XTRA.chess)), view: a2LineView() }
});

// Т3 · блок: два абзаца p под заголовками.
function a2ParasView(h2) {
  return (st, x) => {
    const tab = TABS[2];
    const before = ['<body>', '  <h1>' + x.pick(tab.name) + '</h1>', '  <h2>' + x.pick(h2) + '</h2>'];
    const after = ['</body>'];
    return {
      title: x.pick(tab.name), blocks: a2Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A2Slots tag="p" mid="text" rep />,
      editor: <A2Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const a2ParasCheck = (st) => a2Plan(st.code, A2_TWO_P, { textOut: true, moreP: true });
const cfgT3 = () => ({
  id: 't3', num: 3, kind: 'write-block', C: C.t3,
  init: () => ({ code: '  ' }),
  check: a2ParasCheck,
  view: a2ParasView(TABS[2].h2),
  sample: (pk) => ['<p>' + pk(XTRA.dog1) + '</p>', '<p>' + pk(XTRA.dog2) + '</p>'],
  drill: { init: () => ({ code: '  ' }), check: a2ParasCheck, view: a2ParasView(XTRA.dogs) }
});

// Т4 · найти строку и исправить: незакрытый b — жирным стал весь текст ниже.
const A2_BAD = 2;
const a2BoldDoc = (x, d) => a2Body(['<h1>' + x.pick(TABS[3].name) + '</h1>', '<p>' + x.pick(d.pre) + ' <b>' + x.pick(d.bold) + '</p>', '<p>' + x.pick(d.after) + '</p>']);
function a2FixView(data, C4) {
  return (st, x) => {
    const lines = a2BoldDoc(x, data);
    const title = x.pick(TABS[3].name);
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === A2_BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[A2_BAD], miss: null });   // с отступом, как в коде страницы
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); const n = el.value.lastIndexOf('</p>'); el.setSelectionRange(n < 0 ? el.value.length : n, n < 0 ? el.value.length : n); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i]);
    };
    if (st.at == null) {
      return {
        title, blocks: a2Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: C4.ask,
        editor: <A2Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? A2_BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, A2_BAD);
    const after = lines.slice(A2_BAD + 1);
    return {
      title, blocks: a2Page(before.concat([st.code], after).join('\n')).blocks, ask: C4.ask2,
      editor: <A2Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={A2_BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a2FixCheck(st, words) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const toks = lexA2(st.code);
  const bad = a2Bad(toks) || a2Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a2Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  if (!L.length) return { ok: false, msg: FB.empty };
  const t0 = L[0], t1 = L[1], t2 = L[2];
  if (t0.k === 'text') return { ok: false, msg: a2Fb('needOpenText', { tag: 'p' }) };
  if (t0.k === 'close') return { ok: false, msg: a2Fb('closeFirst', { got: t0.name, tag: 'p' }) };
  if (t0.name !== 'p') return { ok: false, msg: a2Fb('wrongOpen', { tag: 'p', got: t0.name }) };
  if (!t1 || t1.k !== 'text') return { ok: false, msg: a2Fb('needText', { tag: 'p' }) };
  if (!t2) return { ok: false, msg: a2Fb('needClose', { tag: 'p' }) };
  if (!(t2.k === 'close' && t2.name === 'p')) return { ok: false, msg: a2Fb(t2.k === 'open' && t2.name === 'p' ? 'needSlash' : 'needClose', { tag: 'p' }) };
  if (L[3]) return { ok: false, msg: L[3].k === 'text' ? a2Fb('textAfter', { tag: 'p' }) : a2Fb('extra', { got: L[3].raw }) };
  if (!t1.used.b) return { ok: false, msg: FB.keepB };
  if (a2Norm(t1.v) !== a2Norm(words)) return { ok: false, msg: fillL(FB.keepWords, { want: words }) };
  return { ok: true };
}
const cfgT4 = (pick) => {
  const words = (d) => pick(d.pre) + ' ' + pick(d.bold);
  return {
    id: 't4', num: 4, kind: 'find-fix', C: C.t4,
    init: () => ({ at: null, code: '' }),
    check: (st) => a2FixCheck(st, words(TABS[3])),
    view: a2FixView(TABS[3], C.t4),
    sample: (pk) => ['<p>' + pk(XTRA.imp.pre) + ' <b>' + pk(XTRA.imp.bold) + '</b> ' + pk(XTRA.imp.post) + '</p>'],
    drill: { init: () => ({ at: null, code: '' }), check: (st) => a2FixCheck(st, words(XTRA.wind)), view: a2FixView(XTRA.wind, C.t4) }
  };
};

// Т5 · своя статья внутри body: h1, потом абзацы p (можно h2), в абзаце — b или i.
function a2OwnCheck(code) {
  const toks = lexA2(code);
  const bad = a2Bad(toks) || a2Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a2Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  if (!L.length) return { ok: false, msg: FB.empty };
  const t0 = L[0];
  if (t0.k === 'text' || (t0.k === 'open' && t0.name === 'p')) return { ok: false, msg: FB.h1First };
  if (t0.k === 'close') return { ok: false, msg: a2Fb('closeFirst', { got: t0.name, tag: 'h1' }) };
  if (t0.name !== 'h1') return { ok: false, msg: A2_HEAD.test(t0.name) ? a2Fb('mainH1', { got: t0.name }) : FB.h1First };
  // Блоки по три куска: открывающий · текст · закрывающий.
  let heading = '', firstP = '', nP = 0, bi = false;
  for (let i = 0; i < L.length; i += 3) {
    const t = L[i];
    if (t.k === 'text') return { ok: false, msg: FB.textOutP };
    if (t.k === 'close') return { ok: false, msg: a2Fb('closeFirst', { got: t.name, tag: 'p' }) };
    if (i > 0 && t.name === 'h1') return { ok: false, msg: FB.oneH1 };
    if (t.name !== 'p' && !A2_HEAD.test(t.name)) return { ok: false, msg: a2Fb('wrongOpen', { tag: 'p', got: t.name }) };
    const tag = t.name, x = L[i + 1], z = L[i + 2];
    if (!x || x.k !== 'text') return { ok: false, msg: a2Fb('needText', { tag }) };
    if (!a2Letters(x.v)) return { ok: false, msg: FB.short };
    if (!z) return { ok: false, msg: a2Fb(A2_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag }) };
    if (!(z.k === 'close' && z.name === tag)) {
      if (z.k === 'open' && z.name === tag) return { ok: false, msg: a2Fb('needSlash', { tag }) };
      if (z.k === 'close' && A2_HEAD.test(z.name) && A2_HEAD.test(tag)) return { ok: false, msg: a2Fb('closeMismatch', { tag }) };
      return { ok: false, msg: a2Fb(A2_HEAD.test(tag) ? 'headOpen' : 'needClose', { tag }) };
    }
    if (i === 0) heading = x.v;
    if (tag === 'p') { nP += 1; if (!firstP) firstP = x.v; if (x.used.b || x.used.i) bi = true; }
  }
  if (!nP) return { ok: false, msg: FB.needP };
  if (!bi) return { ok: false, msg: FB.needBI };
  return { ok: true, result: { heading, text: firstP, code } };
}
function a2OwnDone(code) {
  const tk = lexA2(code);
  const has = (k, n) => tk.some((t) => t.k === k && t.name === n);
  return { h1: has('open', 'h1') && has('close', 'h1'), p: has('open', 'p') && has('close', 'p'),
    bi: (has('open', 'b') && has('close', 'b')) || (has('open', 'i') && has('close', 'i')) };
}
// Код статьи — строки: каждый блок с новой строки, отступ — два пробела; esc — для артефакта.
function a2Lines(code, esc) {
  const toks = lexA2(code);
  const lines = [];
  let cur = '';
  const blockTag = (t) => (t.k === 'open' || t.k === 'close') && (A2_HEAD.test(t.name) || t.name === 'p');
  toks.forEach((t, n) => {
    if (t.k === 'open' && blockTag(t)) { if (cur.trim()) lines.push(cur.trim()); cur = '<' + t.name + '>'; return; }
    if (t.k === 'open' || t.k === 'close') { cur += (t.k === 'close' ? '</' : '<') + t.name + '>'; if (t.k === 'close' && blockTag(t)) { lines.push(cur.trim()); cur = ''; } return; }
    if (t.k === 'text') {
      let s = t.raw;
      const prev = toks[n - 1], next = toks[n + 1];
      if (!prev || blockTag(prev)) s = s.replace(/^\s+/, '');
      if (!next || blockTag(next)) s = s.replace(/\s+$/, '');
      cur += esc ? escHtml(s) : s;
    }
  });
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-article', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => a2OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myText', r.result.text); store.set('myTab', pick(TABS[4].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[4].name), blocks: a2Page(st.code).blocks, big: true,
    aid: <A2Tree done={a2OwnDone(st.code)} />,
    editor: <A2Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
  }),
  sample: (pk) => ['<h1>' + pk(XTRA.own.h) + '</h1>', '<p>' + pk(XTRA.own.pre) + ' <b>' + pk(XTRA.own.bold) + '</b>.</p>']
});

function A2Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A2TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A2Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A2Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A2Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A2Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A2Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: главная газеты с заголовком и абзацем → «Nashr qilish» → сбой: теги пропали,
// слова слиплись в одну строку, вкладки гаснут. Одно касание.
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
  const all = useA2Tabs(true);
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
  const name = pick(TABS[0].name), text = pick(TABS[0].text);
  const lines = broke ? a2Body([name, text]) : a2Body(['<h1>' + name + '</h1>', '<p>' + text + '</p>']);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a2-sheet a2-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a2-work">
          <div className="a2-side">
            <A2Browser tabs={tabs} cur={0} title={name} cls={boom ? 'a2-glitch' : ''}>
              <A2Doc blocks={a2Page(lines.join('\n')).blocks} />
            </A2Browser>
          </div>
          <div className="a2-main">
            <A2Code lines={lines} cls={boom ? 'a2-glitch' : ''} />
            {!broke ? (
              <div className="kz-row a2-row">
                <button type="button" className="kz-btn is-coral a2-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
                  {pick(UI.publish)}<Led on={led} />
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
// ВЫВОД: все пять вкладок горят, своя статья открыта; её код; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA2Tabs(true);
  const code = store.get('myCode') || ('<h1>' + pick(XTRA.own.h) + '</h1>\n<p>' + pick(XTRA.own.pre) + ' <b>' + pick(XTRA.own.bold) + '</b>.</p>');
  const lines = a2Body(a2Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'h' ? find(/<h1>/) : curK === 'p' ? find(/<p>/) : curK === 'bi' ? find(/<[bi]>/) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a2-sheet a2-fin">
        <KzAsk text={c.ask} />
        <div className="a2-work">
          <div className="a2-side">
            <A2Browser tabs={tabs} cur={4} title={pick(TABS[4].name)} pageHl={curK === 'own'}><A2Doc blocks={a2Page(code).blocks} /></A2Browser>
            <div className="a2-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a2-main">
            <A2Code lines={lines} mark={mark} />
            <div className="kz-roles a2-roles">
              {['h', 'p', 'bi', 'own'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'h' ? '#FA4F28' : k === 'p' ? '#0FA38E' : k === 'bi' ? '#7C5CFA' : '#E44D26' }}>
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
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCode', 'myHead', 'myText', 'myTab'] };

// Артефакт — своя статья из задания 5 (тексты — через escHtml).
function practiceArtifact(store) {
  const code = store.get('myCode');
  if (!code) return null;
  const tab = store.get('myTab') || '';
  return { type: 'html-page', title: tab, heading: store.get('myHead') || '', text: store.get('myText') || '',
    html: [A2_DOC, '<html>', '  <head>', '    <title>' + escHtml(tab) + '</title>', '  </head>', '  <body>']
      .concat(a2Lines(code, true).map((s) => '    ' + s), ['  </body>', '</html>']).join('\n') };
}

export default function HtmlPraktika2({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
