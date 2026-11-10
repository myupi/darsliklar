// =============================================================================
// ПРАКТИКА 1 «Пять вкладок Коди» (облик «Редактор»). Каркас практики курса HTML:
//   · разбор кода lexA1 / a1Plan — теги урока 1, одна самая полезная проблема;
//   · честный браузер a1Page — незакрытый title уносит остальной код на вкладку;
//   · настоящий редактор A1Editor — прозрачная textarea над подсвеченными строками
//     в тёмной рамке редактора урока (.kz-code), шрифт 16 px;
//   · браузер A1Browser — браузер урока (PaperBrowser) с пятью вкладками-картой;
//   · ход задания useA1Task — проверка по «Tekshirish», вторая неудача подряд добавляет
//     ступень подсказки, лампочка — ступени 1–3, после третьей — дополнительная задача;
//     всё в сторе экрана: «Назад» ничего не теряет, «Повторить» стирает только задание.
// Панели результата, ошибки и подсказки — рамки StageB (через KzAsk), как в уроках.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Токены: doc (<!DOCTYPE html>), open / close (теги урока 1), text,
// bad (why: noGt, emptyTag, backslash, typo, unknown). Код не исполняется.
// ─────────────────────────────────────────────────────────────────────────────
const A1_KNOWN = ['html', 'head', 'title', 'body'];
const a1Squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const a1Letters = (s) => (String(s || '').match(/\p{L}/gu) || []).length >= 2;
const a1Norm = (s) => a1Squash(s).toLowerCase().replace(/ё/g, 'е').replace(/[«»"“”„'‘’ʻʼ`.!]/g, '').replace(/\s+/g, ' ').trim();
function a1Dist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}
const a1Near = (name) => {
  if (!name || name.length < 3) return null;
  let best = null, bd = 9;
  A1_KNOWN.forEach((k) => { const dd = a1Dist(name, k); if (dd < bd) { bd = dd; best = k; } });
  return bd <= 2 ? best : null;
};
function lexA1(src) {
  const s = String(src || '');
  const out = [];
  let text = '';
  let i = 0;
  const flush = () => { const v = a1Squash(text); if (v) out.push({ k: 'text', v }); text = ''; };
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
    if (A1_KNOWN.indexOf(name) >= 0) { out.push({ k: close ? 'close' : 'open', name, raw }); continue; }
    const near = a1Near(name.replace(/[^a-z]/g, ''));
    out.push(near ? { k: 'bad', why: 'typo', bad: raw, near: '<' + (close ? '/' : '') + near + '>' } : { k: 'bad', why: 'unknown', bad: raw });
  }
  flush();
  return out;
}
// Тег без левого уголка: «title>» или «/body>» внутри текста.
const A1_NOLT = /(^|[^<\w])(\/?\s*(?:html|head|title|body)\s*>)/i;
const a1Fb = (key, vars) => (vars ? fillL(FB[key], vars) : FB[key]);
function a1Bad(toks) {
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'bad') return a1Fb(t.why, { bad: t.bad, near: t.near || '' });
    if (t.k === 'text') { const m = A1_NOLT.exec(t.v); if (m) return a1Fb('noLt', { bad: m[2].replace(/\s+/g, '') }); }
  }
  return null;
}
// ПЛАН: ожидаемая последовательность { k: 'open' | 'text' | 'close', name, key }. Первая
// расхождение — одна фраза: что ждём и что встретили. ok — с текстами по key.
// opts: textOut — текст вместо <body> (браузер покажет, но по правилу — внутри body).
function a1Plan(src, plan, opts) {
  const o = opts || {};
  const toks = lexA1(src);
  const bad = a1Bad(toks);
  if (bad) return { ok: false, msg: bad };
  const texts = {};
  let p = 0;
  let lastClose = null;
  const idxOpen = (name) => plan.findIndex((x) => x.k === 'open' && x.name === name);
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k === 'doc') return { ok: false, msg: FB.hasDoctype };
    if ((t.k === 'open' || t.k === 'close') && t.name === 'html') return { ok: false, msg: FB.hasHtml };
    if (p >= plan.length) {
      if (t.k === 'text') return { ok: false, msg: a1Fb('textAfter', { tag: lastClose || '' }) };
      return { ok: false, msg: a1Fb('extra', { got: t.raw }) };
    }
    const want = plan[p];
    if (want.k === 'open') {
      if (t.k === 'open' && t.name === want.name) { p += 1; continue; }
      if (t.k === 'text') return { ok: false, msg: o.textOut && want.name === 'body' ? FB.textOut : a1Fb('needOpenText', { tag: want.name }) };
      if (t.k === 'close') return { ok: false, msg: a1Fb('closeFirst', { got: t.name, tag: want.name }) };
      if (want.name === 'head' && t.name === 'title') return { ok: false, msg: FB.titleOut };
      return { ok: false, msg: a1Fb(idxOpen(t.name) > p ? 'order' : 'wrongOpen', { tag: want.name, got: t.name }) };
    }
    if (want.k === 'text') {
      if (t.k === 'text') {
        if (!a1Letters(t.v)) return { ok: false, msg: FB.short };
        texts[want.key] = t.v; p += 1; continue;
      }
      return { ok: false, msg: want.name === 'title' ? FB.needName : a1Fb('needText', { tag: want.name }) };
    }
    if (t.k === 'close' && t.name === want.name) { p += 1; lastClose = want.name; continue; }
    if (t.k === 'open' && t.name === want.name) return { ok: false, msg: a1Fb('needSlash', { tag: want.name }) };
    if (want.name === 'title') return { ok: false, msg: FB.titleOpen };
    if (want.name === 'head' && t.k === 'open' && t.name === 'body') return { ok: false, msg: FB.headNotClosed };
    return { ok: false, msg: a1Fb('needClose', { tag: want.name }) };
  }
  if (p < plan.length) {
    const want = plan[p];
    if (p === 0) return { ok: false, msg: FB.empty };
    if (want.k === 'open') return { ok: false, msg: a1Fb('next', { tag: want.name }) };
    if (want.k === 'text') return { ok: false, msg: want.name === 'title' ? FB.needName : a1Fb('needText', { tag: want.name }) };
    return { ok: false, msg: want.name === 'title' ? FB.titleOpen : a1Fb('needClose', { tag: want.name }) };
  }
  return { ok: true, texts };
}
const A1_LINE = [{ k: 'open', name: 'title' }, { k: 'text', name: 'title', key: 'title' }, { k: 'close', name: 'title' }];
const A1_BODY = [{ k: 'open', name: 'body' }, { k: 'text', name: 'body', key: 'body' }, { k: 'close', name: 'body' }];
const A1_PAGE = [{ k: 'open', name: 'head' }].concat(A1_LINE, [{ k: 'close', name: 'head' }], A1_BODY);

// ЧЕСТНЫЙ БРАУЗЕР. Название — всё между <title> и </title>; нет </title> — весь
// остальной код уходит на вкладку, окно пустеет. Окно — весь текст вне title (браузер
// показывает и текст без body); то, что он не считает тегом (<\body>, <>), — тоже текст.
function a1Page(src) {
  const s = String(src || '');
  const m = /<\s*title\s*>/i.exec(s);
  let title = '';
  let rest = s;
  let eaten = false;
  if (m) {
    const after = s.slice(m.index + m[0].length);
    const c = /<\s*\/\s*title\s*>/i.exec(after);
    if (c) { title = after.slice(0, c.index); rest = s.slice(0, m.index) + ' ' + after.slice(c.index + c[0].length); }
    else { title = after; rest = s.slice(0, m.index); eaten = true; }
  }
  const text = lexA1(rest).filter((t) => t.k === 'text' || (t.k === 'bad' && (t.why === 'backslash' || t.why === 'emptyTag')))
    .map((t) => (t.k === 'text' ? t.v : t.bad)).join(' ');
  return { title: a1Squash(title), text: a1Squash(text), eaten };
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА СТРОКИ — как в редакторе урока: уголки серые, имя тега синее, текст светлый.
// ─────────────────────────────────────────────────────────────────────────────
function a1Hl(line) {
  const parts = String(line).split(/(<[^<>\n]*>?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.charAt(0) !== '<') return <span key={i} className="a1-t">{p}</span>;
    const m = /^<(\s*\/?\s*)([^\s>]*)([^>]*)(>?)$/.exec(p);
    if (!m) return <span key={i} className="a1-t">{p}</span>;
    return (
      <span key={i} className="a1-g">
        <span className="a1-b">{'<' + m[1]}</span><span className="a1-n">{m[2]}</span>
        {m[3] ? <span className="a1-a">{m[3]}</span> : null}<span className="a1-b">{m[4]}</span>
      </span>
    );
  });
}

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function a1Insert(el, ch) {
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
// РЕДАКТОР КОДА. Рамка — тёмный редактор урока (.kz-code: вкладка index.html, фон
// VS Code); строки — свои (номер слева), чтобы перенос строки совпадал у подсветки и
// у прозрачной textarea над ней. before / after — неизменяемые строки задания; single —
// одна строка (Enter не переносит); big — во всё свободное место (своя страница).
// ─────────────────────────────────────────────────────────────────────────────
const A1_MAX = 1200;
function A1Editor({ before, value, onChange, after, single, big, inputRef, led, label, mark, onEnter }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.a1-edit');
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
    <div key={key} className={'a1-ln' + (cls ? ' ' + cls : '') + (mark === n - 1 ? ' is-mark' : '')} data-n={n}>{txt ? a1Hl(txt) : '​'}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code a1-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {(before || []).map((t, i) => row(t, i + 1, 'b' + i, 'is-static'))}
      <div className={'a1-edit' + (led ? ' is-led' : '')}>
        <div className="a1-hl" aria-hidden="true">{lines.map((ln, i) => row(ln, nB + i + 1, 'e' + i))}</div>
        <textarea ref={inputRef} className="a1-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, A1_MAX)); }}
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
function A1Code({ lines, cls, label, mark, onTap, led, miss }) {
  return (
    <div className={'kz-code a1-ed a1-static' + (cls ? ' ' + cls : '')} translate="no" data-label={label || undefined}>
      {lines.map((t, i) => (onTap ? (
        <button key={i} type="button" className={'a1-ln a1-tap' + (mark === i ? ' is-mark' : '') + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' a1-shake' : '')}
          data-n={i + 1} onClick={() => onTap(i)}>{t ? a1Hl(t) : '​'}</button>
      ) : <div key={i} className={'a1-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{t ? a1Hl(t) : '​'}</div>))}
    </div>
  );
}

// Ряд под редактором: символы < / > (не забирают фокус) и «Tekshirish».
function A1Keys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys a1-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      {(syms || ['<', '/', '>']).map((k) => (
        <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { a1Insert(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР С ПЯТЬЮ ВКЛАДКАМИ — браузер урока (PaperBrowser), но вкладок пять: это карта.
// tabs: [{ st: 'ok' | 'off', name, ico, c }]; cur — открытая вкладка, title — её название
// сейчас (пусто — «index.html»). Погасшая вкладка — серый значок «!», починенная — цветной.
// ─────────────────────────────────────────────────────────────────────────────
const A1_ICO = {
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  game: <><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M6 12h4M8 10v4" /><circle cx="15.5" cy="13" r=".6" /><circle cx="18" cy="11" r=".6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  film: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const A1Fav = ({ ico, c, off }) => (
  <i className={'a1-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{A1_ICO[off ? 'off' : ico]}</svg>
  </i>
);
function A1Browser({ tabs, cur, title, children, flash, short, cls, pageHl, tabHl }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br a1-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar a1-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab a1-tab is-cur' + (tabHl ? ' is-hl' : '') + (flash ? ' a1-pop' : '')}>
            <A1Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'a1-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.st === 'off' ? 'index.html' : tb.name}>
            <A1Fav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="a1-tab-t">{tb.st === 'off' ? 'index.html' : tb.name}</span>
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
// Текст в окне — как браузер по умолчанию: обычный абзац.
const A1Page = ({ text, flash }) => (text ? <div key={'p' + (flash || 0)} className={'a1-page' + (flash ? ' a1-in' : '')}>{text}</div> : null);

// Вкладки по стору: решённые задания — горят. n — сколько первых вкладок горит всегда (хук до сбоя, вывод).
function useA1Tabs(all) {
  const store = useStore();
  const pick = usePick();
  return TABS.map((tb, i) => {
    const rec = store.get('t' + (i + 1));
    const lit = all || !!(rec && rec.solved);
    const name = i === 4 ? (store.get('myTitle') || pick(tb.name)) : pick(tb.name);
    return { st: lit ? 'ok' : 'off', name, ico: tb.ico, c: tb.c };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// НАГЛЯДНАЯ ПОМОЩЬ — видна сразу, подписи — названия тегов и частей.
// ─────────────────────────────────────────────────────────────────────────────
// Три места строки или блока: открывающий тег · название / текст · закрывающий.
function A1Slots({ tag, mid, rows }) {
  const pick = usePick();
  const items = [{ k: 'open', code: '<' + tag + '>' }, { k: mid, code: null }, { k: 'close', code: '</' + tag + '>' }];
  return (
    <div className={'a1-slots' + (rows ? ' is-rows' : '')} translate="no">
      {items.map((x, n) => (
        <span key={x.k} className={'a1-slot is-' + x.k} style={{ '--pc': tag === 'body' ? 'var(--r-body)' : 'var(--r-head)' }}>
          <b>{n + 1}</b>{x.code ? <code>{x.code}</code> : <em>{pick(UI.part[x.k])}</em>}
        </span>
      ))}
    </div>
  );
}
// Схема своей страницы: html уже есть; head → title, body — пишет ученик.
function A1Tree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a1-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a1-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a1-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a1-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a1-tree" translate="no">
      {row('', 'html', 'var(--r-html)', UI.given, true)}
      {row('├─ ', 'head', 'var(--r-head)', null, D.head)}
      {row('│  └─ ', 'title', 'var(--r-head)', UI.bpTitle, D.title)}
      {row('└─ ', 'body', 'var(--r-body)', UI.bpBody, D.body)}
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
const A1Sample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="a1-sample">
      <span className="a1-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <A1Code lines={lines} cls="a1-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ДОКУМЕНТЫ ЗАДАНИЙ — строки кода (отступ — пробелами, как пишет ученик).
// ─────────────────────────────────────────────────────────────────────────────
const A1_DOC = '<!DOCTYPE html>';
const a1Head = (title) => ['<html>', '  <head>', '    <title>' + title + '</title>', '  </head>'];
const a1Full = (title, text) => [A1_DOC].concat(a1Head(title), ['  <body>', '    ' + text, '  </body>', '</html>']);
// Т4: строка 3 — <title> без </title>.
const a1Broken = (title, text) => { const l = a1Full(title, text); l[3] = '    <title>' + title; return l; };
const A1_BAD = 3;

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ. Запись в сторе (tN): st — код ученика; checks — проверки; fails — неудачи
// подряд; lv — ступень подсказки; solved — вкладка горит; done — можно дальше (после
// дополнительной задачи, если была); drill — { st, checks, done }; first — с первой ли.
// ─────────────────────────────────────────────────────────────────────────────
const A1_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useA1Task(cfg) {
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
    if (fails >= A1_AUTO_HINT && cur.lv < 3 && !cur.solved) {
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
// редактор, ряд кнопок. Вид — от cfg.view(st, ctx) → { title, text, editor, aid, keys }.
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

function A1TaskScreen({ p, cfg }) {
  const pick = usePick();
  const t = useA1Task(cfg);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useA1Tabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const empty = !String((st && (st.code != null ? st.code : st.v)) || '').trim();
  const led = useIdleLed(!rec.done && empty, empty ? 0 : 1);
  const v = (drilling ? cfg.drill.view : cfg.view)(st, {
    set: drilling ? t.setDrillSt : t.setSt, inRef, lv, led: led || lv === 2, solved: rec.solved && !drilling, check: t.check, t, pick
  });
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : (v.ask || cfg.C.ask);
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.a1-main .a1-ln', rec.done, drilling, t.msg, lv);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'a1-sheet a1-' + cfg.id + (v.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'a1-work' + (v.big ? ' is-big' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')}>
          <div className="a1-side">
            <A1Browser tabs={tabs} cur={cfg.num - 1} title={v.title} flash={t.flash} short pageHl={!rec.solved && !!v.pageHl} tabHl={!rec.solved && !!v.tabHl}>
              <A1Page text={v.text} flash={t.flash} />
            </A1Browser>
            {v.aid || null}
          </div>
          <div className="a1-main">
            {v.editor}
            {!rec.done && v.keys !== false ? <A1Keys inputRef={inRef} onCheck={t.check} ready={!empty} syms={v.syms} /> : null}
            {!rec.solved && lv >= 3 && cfg.sample ? <A1Sample lines={cfg.sample(pick)} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗАДАНИЯ
// ─────────────────────────────────────────────────────────────────────────────
// Т1 · поле в строке: название между тегами title.
function a1FieldCheck(v, want) {
  const s = a1Squash(v);
  if (!s) return { ok: false, msg: fillL(L3("Hozircha bo'sh. title ichiga «{want}» so'zini yozing.", 'Пока пусто. Впиши в title слово «{want}».', 'It’s empty. Type “{want}” inside title.'), { want }) };
  if (/[<>]/.test(s)) return { ok: false, msg: UI.noTags };
  if (a1Norm(s) !== a1Norm(want)) return { ok: false, msg: fillL(FB.wrongName, { got: s, want }) };
  return { ok: true };
}
function a1FieldView(pageText, want) {
  return (st, x) => {
    const v = st.v || '';
    return {
      title: v, text: x.pick(pageText),
      editor: (
        <div className="a1-fieldwrap">
          <KzCode cls="a1-kz" lines={[
            { k: 'd', parts: [W_(A1_DOC)] },
            { k: 'h', parts: [T_('html')] },
            { k: 'hd', d: 1, parts: [T_('head')] },
            { k: 't', d: 2, cls: x.solved ? 'is-new' : 'is-hl', parts: [T_('title'), x.solved ? W_(v) : (
              <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
                <InlineInput value={v} onChange={(s) => x.set({ v: s })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={30}
                  onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a1-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
              </span>), T_('title', true)] },
            { k: 'hc', d: 1, parts: [T_('head', true)] },
            { k: 'b', d: 1, parts: [T_('body')] },
            { k: 'x', d: 2, parts: [W_(x.pick(pageText))] },
            { k: 'bc', d: 1, parts: [T_('body', true)] },
            { k: 'hz', parts: [T_('html', true)] }
          ]} />
        </div>
      ),
      keys: !x.solved, syms: []
    };
  };
}
const cfgT1 = (pick) => {
  const want = pick(TABS[0].name);
  const sport = pick(XTRA.sport);
  return {
    id: 't1', num: 1, kind: 'write-title', C: C.t1,
    init: () => ({ v: '' }),
    check: (st) => a1FieldCheck(st.v, want),
    view: a1FieldView(TABS[0].text, want),
    sample: (pk) => ['<title>' + pk(XTRA.books) + '</title>'],
    drill: { init: () => ({ v: '' }), check: (st) => a1FieldCheck(st.v, sport), view: a1FieldView(L3("Bugungi o'yin natijalari", 'Результаты матчей', 'Match results'), sport) }
  };
};

// Т2 · строка: <title>…</title> целиком внутри head.
function a1LineCheck(code, want) {
  const r = a1Plan(code, A1_LINE);
  if (!r.ok) return r;
  if (a1Norm(r.texts.title) !== a1Norm(want)) return { ok: false, msg: fillL(FB.wrongName, { got: r.texts.title, want }) };
  return { ok: true };
}
function a1LineView(pageText) {
  return (st, x) => {
    const before = [A1_DOC, '<html>', '  <head>'];
    const after = ['  </head>', '  <body>', '    ' + x.pick(pageText), '  </body>', '</html>'];
    const pg = a1Page(before.concat([st.code], after).join('\n'));
    return {
      title: pg.title, text: pg.text,
      aid: <A1Slots tag="title" mid="name" />,
      editor: <A1Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-line', C: C.t2,
  init: () => ({ code: '    ' }),
  check: (st) => a1LineCheck(st.code, pick(TABS[1].name)),
  view: a1LineView(TABS[1].text),
  sample: (pk) => ['<title>' + pk(XTRA.sport) + '</title>'],
  drill: { init: () => ({ code: '    ' }), check: (st) => a1LineCheck(st.code, pick(XTRA.books)), view: a1LineView(L3("Eng sevimli kitoblarim", 'Мои любимые книги', 'My favourite books')) }
});

// Т3 · блок: body с текстом после </head>.
function a1BodyView(title) {
  return (st, x) => {
    const before = [A1_DOC].concat(a1Head(x.pick(title)));
    const after = ['</html>'];
    const pg = a1Page(before.concat([st.code], after).join('\n'));
    return {
      title: pg.title, text: pg.text, pageHl: true,
      aid: <A1Slots tag="body" mid="text" rows />,
      editor: <A1Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgT3 = () => ({
  id: 't3', num: 3, kind: 'write-block', C: C.t3,
  init: () => ({ code: '  ' }),
  check: (st) => a1Plan(st.code, A1_BODY, { textOut: true }),
  view: a1BodyView(TABS[2].name),
  sample: (pk) => ['<body>', '  ' + pk(XTRA.hi), '</body>'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a1Plan(st.code, A1_BODY, { textOut: true }), view: a1BodyView(TABS[2].name) }
});

// Т4 · найти строку и исправить: незакрытый title.
function a1FixView(title, text, C4, isDrill) {
  return (st, x) => {
    const want = x.pick(title);
    const lines = a1Broken(want, x.pick(text));
    // Нажатая строка: верная раскрывается в поле с её текстом, неверная — своя причина.
    const pickLine = (i) => {
      if (i === A1_BAD) {
        sfx('ok', true);
        x.set({ at: i, code: '<title>' + want, miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i]);
    };
    if (st.at == null) {
      const pg = a1Page(lines.join('\n'));
      return {
        title: pg.title, text: pg.text, tabHl: true, keys: false, ask: C4.ask,
        editor: <A1Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? A1_BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, A1_BAD);
    const after = lines.slice(A1_BAD + 1);
    const pg = a1Page(before.concat([st.code], after).join('\n'));
    return {
      title: pg.title, text: pg.text, ask: C4.ask2,
      editor: <A1Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={A1_BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a1FixCheck(st, want) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a1Plan(st.code, A1_LINE);
  if (!r.ok) return r;
  if (a1Norm(r.texts.title) !== a1Norm(want)) return { ok: false, msg: fillL(FB.keepName, { want }) };
  return { ok: true };
}
const cfgT4 = (pick) => ({
  id: 't4', num: 4, kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => a1FixCheck(st, pick(TABS[3].name)),
  view: a1FixView(TABS[3].name, TABS[3].text, C.t4),
  sample: (pk) => ['<title>' + pk(XTRA.books) + '</title>'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a1FixCheck(st, pick(XTRA.sport)), view: a1FixView(XTRA.sport, XTRA.football, C.t4, true) }
});

// Т5 · своя страница: head с title и body внутри готовой рамки html.
const A1_FRAME = { before: [A1_DOC, '<html>'], after: ['</html>'] };
function a1OwnDone(code) {
  const tk = lexA1(code);
  const has = (k, n) => tk.some((t) => t.k === k && t.name === n);
  return { head: has('open', 'head') && has('close', 'head'), title: has('open', 'title') && has('close', 'title'), body: has('open', 'body') && has('close', 'body') };
}
const cfgT5 = (pick, store) => ({
  id: 't5', num: 5, kind: 'write-page', C: C.t5,
  init: () => ({ code: '' }),
  check: (st) => {
    const r = a1Plan(st.code, A1_PAGE);
    return r.ok ? { ok: true, result: { title: r.texts.title, text: r.texts.body } } : r;
  },
  onSolved: (r) => { store.set('myTitle', r.result.title); store.set('myText', r.result.text); },
  view: (st, x) => {
    const pg = a1Page(A1_FRAME.before.concat([st.code], A1_FRAME.after).join('\n'));
    return {
      title: pg.title, text: pg.text, big: true,
      aid: <A1Tree done={a1OwnDone(st.code)} />,
      editor: <A1Editor before={A1_FRAME.before} after={A1_FRAME.after} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  },
  sample: (pk) => ['<head>', '  <title>' + pk(XTRA.sport) + '</title>', '</head>', '<body>', '  ' + pk(XTRA.football), '</body>']
});

function A1Task({ p, make }) {
  const pick = usePick();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <A1TaskScreen p={p} cfg={cfg} />;
}
const T1 = ({ p }) => <A1Task p={p} make={cfgT1} />;
const T2 = ({ p }) => <A1Task p={p} make={cfgT2} />;
const T3 = ({ p }) => <A1Task p={p} make={cfgT3} />;
const T4 = ({ p }) => <A1Task p={p} make={cfgT4} />;
const T5 = ({ p }) => <A1Task p={p} make={cfgT5} />;

// ─────────────────────────────────────────────────────────────────────────────
// S1 · КРЮЧОК: здоровый браузер с пятью вкладками → «Yangilash» → сбой: вкладки гаснут,
// окно пустое, код стёрт. Одно касание.
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
  const all = useA1Tabs(true);
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
  const lines = broke
    ? [A1_DOC, '<html>', '  <head>', '    ', '  </head>', '  ', '    ', '  ', '</html>']
    : a1Full(pick(TABS[0].name), pick(TABS[0].text));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a1-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a1-work">
          <div className="a1-side">
            <A1Browser tabs={tabs} cur={0} title={broke ? '' : pick(TABS[0].name)} cls={boom ? 'a1-glitch' : ''}>
              <A1Page text={broke ? '' : pick(TABS[0].text)} />
            </A1Browser>
          </div>
          <div className="a1-main">
            <A1Code lines={lines} cls={boom ? 'a1-glitch' : ''} />
            {!broke ? (
              <div className="kz-row a1-row">
                <button type="button" className="kz-btn is-coral a1-refresh" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
                  {pick(UI.refresh)}<Led on={led} />
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
// ВЫВОД: все пять вкладок горят, своя открыта; код своей страницы; что умеет; дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA1Tabs(true);
  const title = store.get('myTitle') || pick(UI.mySite);
  const text = store.get('myText') || pick(UI.hello);
  const code = [A1_DOC, '<html>', '  <head>', '    <title>' + title + '</title>', '  </head>', '  <body>', '    ' + text, '  </body>', '</html>'];
  const mark = curK === 'title' ? 3 : curK === 'body' ? 6 : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <KzAsk text={c.ask} />
        <div className="a1-work">
          <div className="a1-side">
            <A1Browser tabs={tabs} cur={4} title={title} tabHl={curK === 'title'} pageHl={curK === 'body'}><A1Page text={text} /></A1Browser>
            <div className="a1-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a1-main">
            <A1Code lines={code} mark={mark} />
            <div className="kz-roles a1-roles">
              {['title', 'body', 'close', 'own'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'title' ? '#7C5CFA' : k === 'body' ? '#0FA38E' : '#FA4F28' }}>
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
// «Повторить» стирает только текущее задание (у своей страницы — и её название и текст).
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myTitle', 'myText'] };

// Артефакт — своя страница из задания 5 (тексты — через escHtml).
function practiceArtifact(store) {
  const t = store.get('myTitle'), x = store.get('myText');
  if (!t && !x) return null;
  return { type: 'html-page', title: t || '', text: x || '',
    html: [A1_DOC, '<html>', '  <head>', '    <title>' + escHtml(t || '') + '</title>', '  </head>', '  <body>', '    ' + escHtml(x || ''), '  </body>', '</html>'].join('\n') };
}

export default function HtmlPraktika1({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
