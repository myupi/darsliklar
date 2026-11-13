// =============================================================================
// КАРКАС ПРАКТИК КУРСА CSS (09.11.2026; облик «Редактор», устройство — как у практик HTML, tools/amaliyot1).
//   · Честный браузер CpPage: страница практики в изолированной рамке (iframe, скрипты запрещены — sandbox без
//     allow-scripts); код ученика ставится в её <style> как текст, применяет его сам браузер: селекторы, :hover,
//     transition, @keyframes, @media (у рамки своя ширина vw). Файлы картинок — только свои (CP_FILES), @import и
//     чужие адреса вырезаются (cpSan).
//   · Разбор cpDiagnose — одна самая полезная причина: русские буквы, скобки, «=» вместо «:», нет «;» между
//     свойствами, неизвестное свойство (с похожим), число без единицы, пробел, запятая в дроби, значение, которое
//     браузер выбросил (CSS.supports); потом — цель задания по готовой странице (CpDoc: вычисленные стили, правила).
//   · Редактор CpEditor — прозрачная textarea над подсвеченными строками (как в практиках HTML, шрифт поля = шрифт
//     кода); кнопки символов вставляют в место курсора и не забирают фокус.
//   · Ход задания useCpTask — проверка по «Tekshirish», вторая неудача подряд добавляет ступень подсказки, лампочка —
//     ступени 1–3, на третьей под редактором образец, после него — дополнительная задача; всё в сторе экрана.
// Данные практики — в pNN.jsx: META, PR (вкладки-карта, страницы, задания cpTask, крючок, вывод), C (тексты).
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// ФАЙЛЫ И ЗАЩИТА. url("имя") — только файлы практики (data:), остальное — none; @import вырезается.
// ─────────────────────────────────────────────────────────────────────────────
const CP_FILES = (typeof PR !== 'undefined' && PR.files) || {};
const cpQuotes = (s) => String(s || '').replace(/[“”«»„]/g, '"').replace(/[‘’]/g, "'");
function cpSan(css) {
  return cpQuotes(css)
    .replace(/@import[^;]*;?/gi, '')
    .replace(/url\(\s*(["']?)([^"')]*)\1\s*\)/gi, (m, q, name) => (CP_FILES[name.trim()] ? 'url("' + CP_FILES[name.trim()] + '")' : 'none'))
    .replace(/<\//g, '<\\/');
}
const CP_CYR = /[Ѐ-ӿ]/;

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР ТЕКСТА CSS (без браузера): блоки с их «шапкой» и объявления. Вложение: @media — правила внутри,
// @keyframes — кадры внутри. Нужен, чтобы назвать причину до того, как браузер молча выбросит запись.
// ─────────────────────────────────────────────────────────────────────────────
function cpBlocks(src) {
  const s = String(src || '').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));   // места символов не сдвигаются
  const out = { blocks: [], extraClose: false, extraAt: -1, unclosed: 0, stray: '' };
  const stack = [];
  let buf = '';
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (ch === '{') { stack.push({ prelude: buf.trim(), body: '', at: i }); buf = ''; continue; }
    if (ch === '}') {
      if (!stack.length) { if (!out.extraClose) out.extraAt = i; out.extraClose = true; buf = ''; continue; }
      const b = stack.pop();
      b.body += buf; buf = '';
      b.parent = stack.length ? stack[stack.length - 1].prelude : '';
      out.blocks.push(b);
      continue;
    }
    buf += ch;
  }
  out.unclosed = stack.length;
  stack.forEach((b) => { b.body += buf; b.parent = ''; out.blocks.push(b); buf = ''; });
  out.stray = buf.trim();
  return out;
}
const cpDecls = (body) => String(body || '').split(';').map((x) => x.trim()).filter(Boolean);
const CP_PROPS = ['color', 'background-color', 'background-image', 'background-repeat', 'background-size', 'background', 'font-size', 'font-family',
  'font-weight', 'font-style', 'text-align', 'text-decoration', 'width', 'height', 'padding', 'margin', 'border', 'border-radius', 'box-shadow',
  'box-sizing', 'border-top', 'border-right', 'border-bottom', 'border-left', 'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
  'flex-wrap', 'position', 'top', 'right', 'bottom', 'left', 'transform', 'cursor', 'transition', 'animation', 'opacity', 'line-height', 'max-width', 'min-width'];
function cpDist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const cpNear = (p) => { let best = null, bd = 9; CP_PROPS.forEach((q) => { const x = cpDist(p, q); if (x < bd) { bd = x; best = q; } }); return bd <= 2 ? best : null; };
// Похожее слово-значение из словаря практик (опечатка: orang → orange, centre → center, bolt → bold).
const CP_VAL_WORDS = Object.keys(typeof CP_GLOSS !== 'undefined' ? CP_GLOSS : {}).map((k) => k.replace(/^val:/, '')).filter((k) => /^[a-z][a-z-]*$/.test(k));
const cpNearVal = (w) => {
  const x = String(w || '').toLowerCase();
  if (!/^[a-z][a-z-]*$/.test(x) || CP_VAL_WORDS.indexOf(x) >= 0) return null;
  let best = null, bd = 9;
  CP_VAL_WORDS.forEach((q) => { const d = cpDist(x, q); if (d < bd) { bd = d; best = q; } });
  return bd <= (x.length <= 4 ? 1 : 2) ? best : null;
};
const cpSup = (p, v) => { try { return typeof CSS === 'undefined' || !CSS.supports ? true : CSS.supports(p, v); } catch (e) { return false; } };
const cpPropOk = (p) => cpSup(p, 'initial') || cpSup(p, 'inherit');
// Одна самая полезная причина по записи (или null — дальше смотрим на страницу). Где она — в CP_DIAG.at
// (место символа, кусок текста или «конец»): по нему редактор помечает строку (10.11.2026, «куда смотреть»).
const CP_DIAG = { at: null };
function cpDiagnose(code) {
  CP_DIAG.at = null;
  const src = cpQuotes(String(code || ''));
  const at = (a, m) => { CP_DIAG.at = a; return m; };
  if (!src.trim()) return FB.empty;
  if (CP_CYR.test(src)) return at({ i: CP_CYR.exec(src).index }, FB.cyr);
  const P = cpBlocks(src);
  if (P.extraClose) return at({ i: P.extraAt }, FB.braceExtra);
  if (P.stray && /:/.test(P.stray)) return at({ s: P.stray }, FB.braceOpen);
  if (!P.blocks.length && P.stray) return at({ s: P.stray }, FB.noRule);
  if (P.unclosed) return at({ end: true }, FB.braceClose);
  for (const b of P.blocks) {
    if (!b.prelude) return at({ i: b.at }, FB.noSel);
    if (/^@/.test(b.prelude) && !/^@keyframes/i.test(b.prelude)) continue;   // @media: внутри — правила
    if (/^@keyframes/i.test(b.prelude)) continue;
    for (const d of cpDecls(b.body)) {
      const w = (m) => at({ s: d, from: b.at }, m);
      const c = (d.match(/:/g) || []).length;
      const name = (d.split(/[:=\s]/)[0] || '').trim().toLowerCase();
      if (!c && d.indexOf('=') < 0 && name && !cpPropOk(name) && !cpNear(name)) return w(fillL(FB.declNoProp, { v: d.trim() }));
      if (!c) return w(fillL(d.indexOf('=') >= 0 ? FB.eq : FB.colon, { p: name || '…' }));
      if (c > 1) return w(FB.semi);
      const i = d.indexOf(':');
      const p = d.slice(0, i).trim().toLowerCase(), v = d.slice(i + 1).trim();
      if (!p) return w(FB.noSel);
      if (!cpPropOk(p)) { const n = cpNear(p); return w(n ? fillL(FB.propNear, { p, n }) : fillL(FB.prop, { p })); }
      if (!v) return w(fillL(FB.value, { p }));
      if (!cpSup(p, cpSan(v))) {
        if (/^(transition|animation)(-duration)?$/.test(p) && /(^|\s)\d+(\.\d+)?(\s|$)/.test(v) && !/\d,\d/.test(v)) return w(fillL(FB.time, { p }));
        if (/^-?\d+(\.\d+)?$/.test(v) && cpSup(p, v + 'px')) return w(fillL(FB.unit, { p }));
        if (/\d\s+(px|%|em|rem|s|ms|deg)\b/i.test(v)) return w(fillL(FB.space, { p }));
        if (/\d,\d/.test(v)) return w(fillL(FB.comma, { p }));
        for (const t of cpVals(v)) { const n = cpNearVal(t); if (n && !cpSup(p, t)) return w(fillL(FB.valueNear, { v: t, n })); }
        return w(fillL(FB.value, { p }));
      }
    }
  }
  return null;
}
// Номер строки (с нуля) кода ученика, где причина; null — не нашлось.
function cpLineAt(code, a) {
  if (!a) return null;
  const src = cpQuotes(String(code || ''));
  let i = -1;
  if (a.end) i = src.replace(/\s+$/, '').length - 1;
  else if (typeof a.i === 'number') i = a.i;
  else if (a.s) {
    const s0 = String(a.s), s1 = s0.split('\n')[0];
    i = src.indexOf(s0, a.from || 0);
    if (i < 0) i = src.indexOf(s1, a.from || 0);
    if (i < 0) i = src.indexOf(s1);
  }
  return i < 0 ? null : src.slice(0, i).split('\n').length - 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧТО ПИСАТЬ (10.11.2026, проход «слабого ученика» на узбекском: «не понимают, куда писать и что писать»).
//   · Рамка в строке (задания 1–2 и их дополнительные): отличие начального кода от ответа — одно место в одной
//     строке; ученик пишет только туда, остальное правило уже стоит вокруг. role — что в рамке: sel / val / decl.
// ─────────────────────────────────────────────────────────────────────────────
const CP_SLOT_L = /[:\s{(,]/, CP_SLOT_R = /[;\s})]/;
function cpSlotOf(a, b) {
  a = String(a || ''); b = String(b || '');
  if (!a || a === b) return null;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  let j = 0;
  while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j += 1;
  while (i > 0 && !CP_SLOT_L.test(a[i - 1])) i -= 1;           // рамка — по целому слову (дефис внутри слова)
  while (j > 0 && !CP_SLOT_R.test(a[a.length - j])) j -= 1;
  const v0 = a.slice(i, a.length - j), ans = b.slice(i, b.length - j);
  if (/\n/.test(v0) || /\n/.test(ans) || !ans.trim()) return null;
  const pre = a.slice(0, i), post = a.slice(a.length - j);
  const depth = (pre.match(/{/g) || []).length - (pre.match(/}/g) || []).length;
  const tail = pre.slice(Math.max(pre.lastIndexOf('{'), pre.lastIndexOf(';'), pre.lastIndexOf('}')) + 1);
  return { pre, post, v0, ans, role: depth <= 0 ? 'sel' : /:/.test(tail) ? 'val' : 'decl' };
}
// Значение по словам: пробел и запятая делят, скобки функции — нет.
function cpVals(v) {
  const out = [];
  let buf = '', d = 0;
  for (const ch of String(v || '')) {
    if (ch === '(') d += 1;
    if (ch === ')') d = Math.max(0, d - 1);
    if (!d && /[\s,]/.test(ch)) { if (buf) out.push(buf); buf = ''; continue; }
    buf += ch;
  }
  if (buf) out.push(buf);
  return out;
}


// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА: что видно в окне браузера (CpDoc для проверки цели). Вычисленные стили — как в DevTools.
// ─────────────────────────────────────────────────────────────────────────────
const cpNormSel = (s) => String(s || '').replace(/\s+/g, ' ').replace(/\s*([>+~,])\s*/g, '$1').trim().toLowerCase();
function cpDocApi(frame, code) {
  const doc = frame && frame.contentDocument;
  if (!doc || !doc.body) return null;
  const win = doc.defaultView;
  const u = doc.getElementById('cp-u');
  const flat = [];
  const walk = (rules, media) => { Array.from(rules || []).forEach((r) => {
    if (r.cssRules && r.media) walk(r.cssRules, r.media.mediaText);
    else if (r.selectorText) flat.push({ sel: r.selectorText, style: r.style, media: media || null });
    else if (r.type === 7 || r.name) flat.push({ kf: r.name, rule: r, media: media || null });
  }); };
  try { walk(u && u.sheet ? u.sheet.cssRules : [], null); } catch (e) { /* лист ещё не готов */ }
  const probe = (prop, v) => { const e = doc.createElement('i'); e.style.setProperty(prop, v); doc.body.appendChild(e); const r = win.getComputedStyle(e).getPropertyValue(prop).trim(); e.remove(); return r; };
  const api = {
    doc, win, code: String(code || ''), rules: flat,
    q: (s) => { try { return doc.querySelector(s); } catch (e) { return null; } },
    qa: (s) => { try { return Array.from(doc.querySelectorAll(s)); } catch (e) { return []; } },
    cs: (s, p) => { const e = api.q(s); return e ? win.getComputedStyle(e).getPropertyValue(p).trim() : ''; },
    // Последнее правило с этим селектором (ниже — сильнее, как в браузере; готовые правила стоят выше кода ученика).
    rule: (sel, media) => flat.slice().reverse().find((r) => r.sel && cpNormSel(r.sel) === cpNormSel(sel) && (media === undefined || (r.media || null) === media)) || null,
    // Значение свойства из последнего правила с этим селектором, где оно есть.
    val: (sel, p) => { const r = flat.slice().reverse().find((x) => x.sel && cpNormSel(x.sel) === cpNormSel(sel) && x.style.getPropertyValue(p).trim()); return r ? r.style.getPropertyValue(p).trim() : ''; },
    kf: (name) => flat.find((r) => r.kf === name) || null,
    col: (v) => probe('color', v),
    same: (a, b) => probe('color', a) === probe('color', b),
    // Сколько объявлений браузер принял (без пустых правил).
    decls: () => flat.reduce((n, r) => n + (r.style ? r.style.length : 0), 0),
    // Селекторы ученика, которые ничего не выбрали (без :hover и псевдо).
    missing: () => flat.filter((r) => r.sel && !/^(html|body|\*)$/i.test(r.sel.trim()) && !api.q(r.sel.replace(/:hover|:focus|:active/g, '').trim() || '*')).map((r) => r.sel)
  };
  return api;
}

// Документ рамки: страница практики + свои стили (cp-base) + стили ученика (cp-u).
const CP_BASE_CSS = 'html{-webkit-text-size-adjust:100%}body{margin:10px 12px;font-family:"Times New Roman",Times,serif;color:#202124}h1{margin:.3em 0 .35em}h2{margin:.3em 0}p{margin:.35em 0}img{max-width:100%}';
const cpSrcdoc = (html, base) => '<!DOCTYPE html><html><head><meta charset="utf-8"><style id="cp-b">' + CP_BASE_CSS + (base || '') +
  '</style><style id="cp-u"></style></head><body>' + html + '</body></html>';

// Честный браузер: рамка без скриптов; css ученика — в <style id="cp-u">; страница ужимается, чтобы влезть
// (zoom), или рисуется в окне ширины vw и уменьшается целиком (как режим устройства в DevTools).
function CpPage({ html, css, base, vw, frameRef, fit = true, flash }) {
  const box = useRef(null);
  const fr = useRef(null);
  const [bw, setBw] = useState(0);
  const [bh, setBh] = useState(0);
  const [ok, setOk] = useState(0);
  const [k, setK] = useState(1);
  const srcdoc = useMemo(() => cpSrcdoc(html, base), [html, base]);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => { requestAnimationFrame(() => { setBw(el.clientWidth); setBh(el.clientHeight); }); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Стили ученика — в <style id="cp-u"> как текст. Ужатие (09.11.2026) — не zoom, а уменьшение рамки целиком
  // (transform): внутри страницы размеры остаются честными, «160px» так и считается 160px, а не 159.98.
  // Пометка data-nofit на странице — не ужимать (длинная страница с прокруткой и fixed).
  const apply = useCallback(() => {
    const f = fr.current;
    const doc = f && f.contentDocument;
    if (!doc || !doc.body) return;
    const u = doc.getElementById('cp-u');
    if (u) u.textContent = cpSan(css);
    if (!fit || vw || !bw || !bh) return;
    requestAnimationFrame(() => {
      if (doc.querySelector('[data-nofit]')) { if (k !== 1) setK(1); return; }
      const H = doc.documentElement.scrollHeight;
      const inner = bh / k;
      if (!H) return;
      // Страница видна целиком (на низком телефоне — мельче, но результат виден: ряд, столбик, место).
      if (H > inner + 1) { const k2 = Math.max(0.34, Math.floor((bh / H) * 50) / 50); if (k2 !== k) setK(k2); }
      else if (k < 1 && H < inner * 0.85) { const k2 = Math.min(1, Math.floor((bh / H) * 0.95 * 50) / 50); if (k2 > k) setK(k2); }
    });
  }, [css, fit, vw, k, bw, bh]);
  useEffect(() => { apply(); }, [apply, ok]);
  const setRef = (el) => { fr.current = el; if (frameRef) frameRef.current = el; };
  const kk = vw && bw ? bw / vw : k;
  const w = vw || (bw ? bw / k : 0);
  const style = bw && (vw || k !== 1) ? { width: Math.round(w) + 'px', height: Math.max(80, Math.round(bh / kk)) + 'px', transform: 'scale(' + kk + ')', transformOrigin: '0 0' } : null;
  return (
    <div ref={box} className={'cp-pagebox' + (flash ? ' cp-in' : '')}>
      <iframe ref={setRef} className="cp-frame" title="page" sandbox="allow-same-origin" srcDoc={srcdoc} style={style || undefined}
        onLoad={() => setOk((x) => x + 1)} tabIndex={-1} />
      {vw ? <span className={'cp-vw' + (vw < 600 ? ' is-phone' : '')}>{vw}px</span> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА — как в редакторе урока: селектор жёлтый, свойство голубое, значение оранжевое, числа зелёные,
// @-правила фиолетовые, теги HTML (<style>) — как в курсе HTML. Состояние (селектор / объявления) идёт
// через строки, поэтому правило можно писать в несколько строк.
// ─────────────────────────────────────────────────────────────────────────────
function cpHlLines(lines) {
  const stack = [];   // 'r' — внутри правила (объявления), 'g' — внутри @media (правила), 'k' — внутри @keyframes
  const out = [];
  lines.forEach((line, li) => {
    const parts = [];
    let i = 0, n = 0;
    const push = (cls, t) => { if (t) parts.push(<span key={n++} className={cls}>{t}</span>); };
    if (/^\s*<\/?[a-z]+>\s*$/i.test(line)) {
      const m = /^(\s*)(<\/?)([a-z]+)(>)\s*$/i.exec(line);
      push('cp-t', m[1]); push('cp-tb', m[2]); push('cp-tn', m[3]); push('cp-tb', m[4]);
      out.push(parts); return;
    }
    let mode = stack.length ? stack[stack.length - 1] : 'top';
    let prelude = '';
    while (i < line.length) {
      const ch = line[i];
      if (mode === 'r') {
        if (ch === '}') { push('cp-pu', '}'); stack.pop(); mode = stack.length ? stack[stack.length - 1] : 'top'; i += 1; continue; }
        const j = line.slice(i).search(/[:;}]/);
        const seg = j < 0 ? line.slice(i) : line.slice(i, i + j);
        const next = j < 0 ? '' : line[i + j];
        if (next === ':') {
          push('cp-pr', seg); push('cp-pu', ':'); i += seg.length + 1;
          const k = line.slice(i).search(/[;}]/);
          const val = k < 0 ? line.slice(i) : line.slice(i, i + k);
          val.split(/(\s+|,)/).forEach((w) => push(/^#|^-?\d/.test(w) ? 'cp-nu' : /^\s+$|^,$/.test(w) ? 'cp-t' : 'cp-va', w));
          i += val.length;
          continue;
        }
        // Пустые скобки «{  }» — место, куда писать (заготовка своей страницы): видно рамкой.
        push(next === '}' && !seg.trim() && seg.length && /\{\s*$/.test(line.slice(0, i)) ? 'cp-hole' : 'cp-pr', seg); i += seg.length;
        if (next === ';') { push('cp-pu', ';'); i += 1; }
        continue;
      }
      if (ch === '{') {
        push('cp-pu', '{');
        const pre = prelude.trim();
        stack.push(/^@media/i.test(pre) ? 'g' : /^@keyframes/i.test(pre) ? 'k' : 'r');
        mode = stack[stack.length - 1]; prelude = ''; i += 1; continue;
      }
      if (ch === '}') { push('cp-pu', '}'); stack.pop(); mode = stack.length ? stack[stack.length - 1] : 'top'; i += 1; continue; }
      const j = line.slice(i).search(/[{}]/);
      const seg = j < 0 ? line.slice(i) : line.slice(i, i + j);
      prelude += seg;
      if (/^\s*@/.test(seg)) {
        // «@» без слова (ученик ещё печатает @keyframes) — тоже at-правило, иначе подсветка падала (13.11.2026).
        const m = /^(\s*)(@[\w-]*)(.*)$/.exec(seg);
        push('cp-t', m[1]); push('cp-at', m[2]); push('cp-mq', m[3]);
      } else push(mode === 'k' ? 'cp-nu' : 'cp-se', seg);
      i += seg.length;
    }
    out.push(parts);
    return li;
  });
  return out;
}
const CP_ZW = '​';

// Символ в место курсора: фокус и клавиатура остаются, React узнаёт о вводе.
function cpInsert(el, ch) {
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
// РЕДАКТОР — рамка .kz-code урока, свои строки с номерами; before / after — неизменяемые строки (<style>, готовые
// правила), посередине — прозрачная textarea над подсветкой. single — одна строка, big — своя страница.
// ─────────────────────────────────────────────────────────────────────────────
const CP_MAX = 1600;
function CpEditor({ before, value, onChange, after, single, big, inputRef, led, label, onEnter, mark }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const B = before || [], A = after || [];
  const lines = String(value || '').split('\n');
  const hl = cpHlLines(B.concat(lines, A));
  // Пустая строка внутри скобок (заготовка «@media (…) {  }») — сюда пишут; подпись исчезает с первой буквой.
  const holes = lines.map((ln, i) => {
    if (ln.trim() || i === 0 || i === lines.length - 1) return false;
    const before = lines.slice(0, i).join('\n');
    return (before.match(/{/g) || []).length > (before.match(/}/g) || []).length && /{\s*$/.test(before);
  });
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.cp-edit');
    if (!box || !ed || box.scrollHeight <= box.clientHeight + 2) return;
    const top = ed.offsetTop, bot = top + ed.offsetHeight;
    if (top < box.scrollTop + 4 || bot > box.scrollTop + box.clientHeight - 4) box.scrollTop = Math.max(0, Math.min(top - 8, bot - box.clientHeight + 8));
  }, []);
  useLayoutEffect(() => { reveal(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const row = (n, key, cls) => (
    <div key={key} className={'cp-ln' + (cls ? ' ' + cls : '')} data-n={n}>{hl[n - 1] && hl[n - 1].length ? hl[n - 1] : CP_ZW}</div>
  );
  return (
    <div ref={boxRef} className={'kz-code cp-ed' + (big ? ' is-big' : '') + (single ? ' is-single' : '')} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {B.map((t, i) => row(i + 1, 'b' + i, 'is-static'))}
      <div className={'cp-edit' + (led ? ' is-led' : '')}>
        <div className="cp-hl" aria-hidden="true">
          {!String(value || '').length ? (
            <div className="cp-ln" data-n={B.length + 1}><span className="cp-ghost">✎ {pick(UI.writeHere)}</span></div>
          ) : lines.map((ln, i) => (holes[i]
            ? <div key={'e' + i} className="cp-ln" data-n={B.length + i + 1}>{ln}<span className="cp-ghost">✎ {pick(UI.writeHere)}</span></div>
            : row(B.length + i + 1, 'e' + i, mark === i ? 'is-mark' : '')))}
        </div>
        <textarea ref={inputRef} className="cp-ta" value={value} rows={1} wrap="soft"
          onChange={(e) => { let v = e.target.value; if (single) v = v.replace(/\r?\n/g, ' '); onChange(v.slice(0, CP_MAX)); }}
          onFocus={() => { setTimeout(reveal, 80); setTimeout(reveal, 420); }}
          onKeyDown={(e) => { if (single && e.key === 'Enter') { e.preventDefault(); if (onEnter) onEnter(); } }}
          spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
          enterKeyHint={single ? 'done' : 'enter'} aria-label={pick(label || UI.editor)} />
      </div>
      {A.map((t, i) => row(B.length + lines.length + i + 1, 'a' + i, 'is-static'))}
    </div>
  );
}
// Редактор с рамкой в строке (задания 1–2): правило стоит готовым, писать — только в рамку. Рамка — поле прямо в
// строке (InlineInput: растёт по тексту); пока в ней старое слово, касание выделяет его — набор заменяет целиком.
const CP_MK = 'qqcpslotqq';
function CpSlotEditor({ before, after, slot, value, onChange, inputRef, led, onEnter }) {
  const pick = usePick();
  const B = before || [], A = after || [];
  const tl = (slot.pre + CP_MK + slot.post).split('\n');
  const hl = cpHlLines(B.concat(tl, A));
  const vRef = useRef(value);
  vRef.current = value;
  // Длинная заготовка (кадры @keyframes, @media) выше окна редактора — строка с рамкой прокручивается в вид.
  const boxRef = useRef(null);
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ln = box && box.querySelector('.cp-slotln');
    if (!box || !ln || box.scrollHeight <= box.clientHeight + 2) return;
    const top = ln.offsetTop, bot = top + ln.offsetHeight;
    if (top < box.scrollTop + 4 || bot > box.scrollTop + box.clientHeight - 4) box.scrollTop = Math.max(0, Math.round(top - (box.clientHeight - ln.offsetHeight) / 2));
  }, []);
  useLayoutEffect(() => { reveal(); const t = setTimeout(reveal, 300); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // iPhone ставит курсор касанием уже после фокуса и снимает выделение: пока в рамке старое слово, касание
  // снова выделяет его целиком — набор заменит слово, а не допишет к нему.
  useEffect(() => {
    const el = inputRef && inputRef.current;
    if (!el) return undefined;
    const h = () => { if (slot.v0 && vRef.current === slot.v0 && el.selectionStart === el.selectionEnd) { try { el.setSelectionRange(0, el.value.length); } catch (er) { /* нет выделения */ } } };
    el.addEventListener('click', h);
    return () => el.removeEventListener('click', h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const ph = slot.role === 'val' ? UI.phVal : slot.role === 'sel' ? UI.phSel : UI.phDecl;
  const gap = (
    <span key="gap" className={'cp-gap cp-gap-' + slot.role + (value ? '' : ' is-empty')}>
      <InlineInput value={value} onChange={onChange} inputRef={inputRef} onEnter={onEnter} placeholder={ph} label={UI.editor} max={60} cls="cp-gap-in"
        onFocus={(e) => { const el = e.currentTarget; setTimeout(reveal, 80); setTimeout(reveal, 420); if (slot.v0 && vRef.current === slot.v0) setTimeout(() => { try { el.setSelectionRange(0, el.value.length); } catch (er) { /* нет выделения */ } }, 40); }} />
    </span>
  );
  const withGap = (parts) => {
    const out = [];
    (parts || []).forEach((el, k) => {
      const t = el && el.props ? el.props.children : null;
      if (typeof t !== 'string' || t.indexOf(CP_MK) < 0) { out.push(el); return; }
      const [x, y] = t.split(CP_MK);
      if (x) out.push(<span key={'x' + k} className={el.props.className}>{x}</span>);
      out.push(gap);
      if (y) out.push(<span key={'y' + k} className={el.props.className}>{y}</span>);
    });
    return out;
  };
  return (
    <div ref={boxRef} className={'kz-code cp-ed cp-sed'} translate="no"
      onClick={(e) => { if (inputRef && inputRef.current && !e.target.closest('textarea')) inputRef.current.focus(); }}>
      {B.concat(tl, A).map((t, i) => {
        const inT = i >= B.length && i < B.length + tl.length;
        const has = inT && t.indexOf(CP_MK) >= 0;
        const parts = has ? withGap(hl[i]) : hl[i];
        return (
          <div key={i} className={'cp-ln' + (inT ? '' : ' is-static') + (has ? ' cp-slotln' + (led ? ' is-led' : '') : '')} data-n={i + 1}>
            {parts && parts.length ? parts : CP_ZW}
          </div>
        );
      })}
    </div>
  );
}
// Статичный код (образец, код готовой страницы) — в той же рамке.
function CpCode({ lines, cls, mark }) {
  const hl = cpHlLines(lines);
  return (
    <div className={'kz-code cp-ed cp-static' + (cls ? ' ' + cls : '')} translate="no">
      {lines.map((t, i) => <div key={i} className={'cp-ln' + (mark === i ? ' is-mark' : '')} data-n={i + 1}>{hl[i] && hl[i].length ? hl[i] : CP_ZW}</div>)}
    </div>
  );
}
// HTML страницы — короткой справкой (имена классов и id видны сразу, без кнопки «показать»).
function cpHtmlParts(line) {
  const parts = [];
  let n = 0;
  String(line).split(/(<\/?[a-z0-9]+(?:\s[^>]*)?>)/i).forEach((seg) => {
    if (!seg) return;
    const m = /^<(\/?)([a-z0-9]+)((?:\s[^>]*)?)>$/i.exec(seg);
    if (!m) { parts.push(<span key={n++} className="cp-t">{seg}</span>); return; }
    parts.push(<span key={n++} className="cp-tb">{'<' + m[1]}</span>, <span key={n++} className="cp-tn">{m[2]}</span>);
    String(m[3] || '').split(/(\s[\w-]+=)("[^"]*")/).forEach((a) => { if (a) parts.push(<span key={n++} className={/^"/.test(a) ? 'cp-hv' : 'cp-ha'}>{a}</span>); });
    parts.push(<span key={n++} className="cp-tb">{'>'}</span>);
  });
  return parts;
}
function CpHtml({ lines, mark }) {
  const pick = usePick();
  return (
    <div className="cp-html">
      <span className="cp-html-l"><Icon name="doc" size={13} />{pick(UI.html)}</span>
      <div className="kz-code cp-ed cp-static cp-html-code" translate="no">
        {lines.map((t, i) => <div key={i} className={'cp-ln' + (mark != null && (mark === i || (Array.isArray(mark) && mark.indexOf(i) >= 0)) ? ' is-mark' : '')} data-n={i + 1}>{cpHtmlParts(t)}</div>)}
      </div>
    </div>
  );
}

// Ряд под редактором: символы (не забирают фокус) и «Tekshirish».
const CP_SYMS = ['{', '}', ':', ';'];
function CpKeys({ inputRef, onCheck, ready, syms }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="keys cp-keys" translate="no" role="group" aria-label={pick(UI.keys)}>
      <div className="cp-syms">
        {(syms || CP_SYMS).map((k) => (
          <button key={k} type="button" className="key-b mono" onPointerDown={keep} onMouseDown={keep}
            onClick={() => { cpInsert(inputRef.current, k); sfx('type', true); }}>{k}</button>
        ))}
      </div>
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} onMouseDown={keep} onClick={onCheck}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
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
const CpSample = ({ lines }) => {
  const pick = usePick();
  const ref = useRef(null);
  useRevealSample(ref);
  return (
    <div ref={ref} className="cp-sample">
      <span className="cp-sample-l"><Icon name="bulb" size={14} />{pick(UI.sample)}</span>
      <CpCode lines={lines} cls="cp-sample-code" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// БРАУЗЕР С ПЯТЬЮ ВКЛАДКАМИ (карта) — браузер урока (облик Chrome): погасшая вкладка — серый «!», готовая —
// цветной значок, открытая — с названием.
// ─────────────────────────────────────────────────────────────────────────────
const CP_ICO = {
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  game: <><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M6 12h4M8 10v4" /><circle cx="15.5" cy="13" r=".6" /><circle cx="18" cy="11" r=".6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  film: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  cup: <><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" /><path d="M17 10h2a2 2 0 0 1 0 4h-2" /><path d="M8 2v3M12 2v3" /></>,
  book: <><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" /><path d="M20 4h-4a3 3 0 0 0-3 3" /><path d="M20 4v14h-6" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 7l4 3-1.5 5h-5L8 10z" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  paw: <><circle cx="7" cy="10" r="2" /><circle cx="12" cy="7" r="2" /><circle cx="17" cy="10" r="2" /><path d="M8 17c0-3 2-5 4-5s4 2 4 5-2 3-4 3-4 0-4-3z" /></>,
  rocket: <><path d="M12 2c4 3 5 8 4 12H8C7 10 8 5 12 2z" /><path d="M8 14l-3 3 3 1M16 14l3 3-3 1" /><circle cx="12" cy="9" r="1.6" /></>,
  leaf: <><path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z" /><path d="M5 19l8-8" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2l2.4 11h11L21 7H7" /></>,
  pin: <><path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1-.8-1.4-.8-2.4 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4c0-4.6-4-8.4-9-8.4z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  off: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>
};
const CpFav = ({ ico, c, off }) => (
  <i className={'cp-fav' + (off ? ' is-off' : '')} style={{ '--fc': off ? '#9AA0A6' : c }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{CP_ICO[off ? 'off' : ico] || CP_ICO.star}</svg>
  </i>
);
function CpBrowser({ tabs, cur, children, flash, cls }) {
  const t = tabs[cur] || {};
  return (
    <div className={'kz-br cp-br' + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar cp-bar">
        {tabs.map((tb, i) => (i === cur ? (
          <span key={i + ':' + (flash || 0)} className={'kz-br-tab cp-tab is-cur' + (flash ? ' cp-pop' : '')}>
            <CpFav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
            <span className="kz-br-tab-t">{t.name}</span>
            <i className="kz-br-x" aria-hidden="true" />
          </span>
        ) : (
          <span key={i} className={'cp-tab is-side' + (tb.st === 'off' ? ' is-off' : ' is-ok')} title={tb.name}>
            <CpFav ico={tb.ico} c={tb.c} off={tb.st === 'off'} />
          </span>
        )))}
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows"><i className="kz-ar-l" aria-hidden="true" /><i className="kz-ar-r" aria-hidden="true" /></span>
        <span className="kz-br-url"><i className="kz-br-lock" aria-hidden="true" /><span className="kz-br-url-t">{t.file || 'index.html'}</span></span>
      </div>
      <div className="kz-br-body">
        <Cut c={KZ.cream} seed={32} n={16} amp={1.1} asp={1.6} cls="kz-br-paper" />
        <div className="kz-br-page cp-brpage">{children}</div>
      </div>
    </div>
  );
}
// Вкладки по стору: решённые задания горят; all — все (крючок до сбоя, вывод).
function useCpTabs(all) {
  const store = useStore();
  const pick = usePick();
  return PR.tabs.map((tb, i) => {
    const rec = store.get('t' + (i + 1));
    const lit = all || !!(rec && rec.solved);
    const name = i === 4 ? (store.get('myName') || pick(tb.name)) : pick(tb.name);
    return { st: lit ? 'ok' : 'off', name, ico: tb.ico, c: tb.c, file: tb.file };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ХОД ЗАДАНИЯ. Стор tN: st — { code }; checks; fails подряд; lv — ступень подсказки; solved — вкладка горит;
// done — можно дальше (после дополнительной задачи, если была); drill — { st, checks, done }; first.
// ─────────────────────────────────────────────────────────────────────────────
const CP_AUTO_HINT = 2;   // со второй неудачи подряд — ступень подсказки сама (заказчик, 15.10.2026)
function useCpTask(cfg, frameRef) {
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
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec.done ? cfg.C.ok : drilling ? CP_DRILL.say : cfg.C.say, pose: rec.done ? 'smile' : 'point' }]);
  const canGo = useAdvanceGate(rec.done, spoken);
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(0);
  useTipClears(setMsg);
  const pulse = useHintPulse();
  const p0 = useRef(pulse);
  useEffect(() => {
    if (pulse === p0.current) return;
    p0.current = pulse;
    const cur = ref.current;
    if (cur.solved || cur.lv >= 3) return;
    row(put({ lv: cur.lv + 1 }));
  }, [pulse]); // eslint-disable-line react-hooks/exhaustive-deps
  const row = (v) => log({ screenId: cfg.id, type: cfg.kind, correct: !!v.solved, firstTry: !!v.first, attempts: v.checks, hintMax: v.lv,
    drill: v.drill ? { done: !!v.drill.done, attempts: v.drill.checks } : null });
  const [mark, setMark] = useState(null);
  const setSt = (st) => { setMsg(null); setMark(null); put({ st }); };
  const setDrillSt = (st) => { setMsg(null); setMark(null); put({ drill: Object.assign({}, ref.current.drill, { st }) }); };
  const fail = (m, at) => {
    setMark(at == null ? null : at);
    sfx('soft', true);
    const cur = ref.current;
    const fails = (cur.fails || 0) + 1;
    if (fails >= CP_AUTO_HINT && cur.lv < 3 && !cur.solved) {
      const lv = cur.lv + 1;
      const both = joinL(m, cfg.C.hints[lv - 1]);
      row(put({ fails, lv }));
      setMsg(both); sayNow(both, 'think');
      return;
    }
    put({ fails });
    setMsg(m); sayNow(m, 'think');
  };
  const judge = (spec, st) => {
    if (spec.slot) {
      const v = String(st.v == null ? spec.slot.v0 : st.v);
      if (!v.trim()) return { ok: false, msg: FB.slotEmpty };
      if (/[{}]/.test(v) || (spec.slot.role === 'val' && /:/.test(v))) return { ok: false, msg: FB[spec.slot.role === 'val' ? 'slotVal' : spec.slot.role === 'sel' ? 'slotSel' : 'slotDecl'] };
      // В рамку для «свойство: значение» написано одно значение (green) — нужно и свойство.
      if (spec.slot.role === 'decl' && !/[:=]/.test(v) && !cpPropOk(v.trim().split(/\s+/)[0].toLowerCase())) return { ok: false, msg: FB.slotNoProp };
    }
    const d0 = cpDiagnose(st.code);
    if (d0) return { ok: false, msg: d0, at: spec.slot ? null : cpLineAt(st.code, CP_DIAG.at) };
    const D = cpDocApi(frameRef.current, st.code);
    if (!D) return { ok: false, msg: FB.notYet };
    const g = spec.goal(D, st);
    if (g === true || g == null) return { ok: true, D };
    if (D.missing().length) {
      // Строка селектора, который ничего не выбрал, — помечается, как и причина записи.
      const m0 = D.missing()[0], src = cpQuotes(st.code);
      const k = src.toLowerCase().indexOf(String(m0).toLowerCase());
      const at = spec.slot || k < 0 ? null : src.slice(0, k).split('\n').length - 1;
      // Частое у новичка: имя класса без точки (hero), точка перед тегом (.h1).
      const bare = String(m0).trim();
      if (/^[a-z][\w-]*$/i.test(bare) && D.q('.' + bare)) return { ok: false, msg: fillL(FB.needDot, { s: bare }), at };
      if (/^[a-z][\w-]*$/i.test(bare) && D.q('#' + bare)) return { ok: false, msg: fillL(FB.needHash, { s: bare }), at };
      if (/^\.[a-z][a-z0-9]*$/i.test(bare) && D.q(bare.slice(1))) return { ok: false, msg: fillL(FB.noDot, { s: bare.slice(1) }), at };
      return { ok: false, msg: FB.noMatch, at };
    }
    return { ok: false, msg: g === false ? FB.notYet : g };
  };
  const check = () => {
    const cur = ref.current;
    if (cur.drill && !cur.drill.done) {
      const r = judge(cfg.drill, cur.drill.st);
      const d = Object.assign({}, cur.drill, { checks: cur.drill.checks + 1 });
      if (!r.ok) { put({ drill: d }); fail(r.msg, r.at); return; }
      sfx('ok', true); setMsg(null); setFlash((k) => k + 1);
      row(put({ drill: Object.assign(d, { done: true }), done: true, fails: 0 }));
      sayNow(CP_DRILL.done, 'smile');
      return;
    }
    if (cur.solved) return;
    const r = judge(cfg, cur.st);
    const checks = cur.checks + 1;
    if (!r.ok) { put({ checks }); fail(r.msg, r.at); return; }
    const needDrill = !!cfg.drill && cur.lv >= 3;
    const v = put({ checks, fails: 0, solved: true, first: checks === 1 && cur.lv === 0, done: !needDrill,
      drill: needDrill ? { st: cfg.drill.init(), checks: 0, done: false } : null });
    if (cfg.onSolved) cfg.onSolved(cur.st, r.D);
    sfx('win', true); setMsg(null); setFlash((k) => k + 1);
    row(v);
    sayNow(needDrill ? joinL(cfg.C.ok, CP_DRILL.say) : cfg.C.ok, needDrill ? 'smile' : 'cheer');
  };
  return { rec, put, setSt, setDrillSt, check, fail, msg, setMsg, speaker, sayNow, canGo, flash, drilling, mark };
}

// Экран задания: строка задания (KzAsk → панели рамки), браузер-карта со страницей, HTML-справка, редактор,
// кнопки, образец третьей ступени.
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

function CpTaskScreen({ p, cfg }) {
  const pick = usePick();
  const frameRef = useRef(null);
  const t = useCpTask(cfg, frameRef);
  const rec = t.rec;
  const inRef = useRef(null);
  const drilling = t.drilling;
  const spec = drilling ? cfg.drill : cfg;
  const st = drilling ? rec.drill.st : rec.st;
  const tabs = useCpTabs(false);
  const lv = rec.solved ? 0 : rec.lv;
  const slot = spec.slot;
  const sv = slot ? String(st.v == null ? slot.v0 : st.v) : '';
  const empty = slot ? !sv.trim() : !String(st.code || '').trim();
  const led = useIdleLed(!rec.done, empty ? 0 : 1);
  const html = (spec.page || cfg.page)(pick);
  const given = spec.given || cfg.given || [];
  // Во время дополнительной задачи решённое оформление остаётся на странице (если страница та же).
  const css = given.join('\n') + '\n' + (drilling && !cfg.drill.page ? rec.st.code + '\n' : '') + st.code;
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : cfg.C.ask;
  const hint = t.msg || (!rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.cp-main .cp-ln', rec.done, drilling, t.msg, lv);
  const htmlAid = spec.htmlAid || cfg.htmlAid;
  // Условия «готово» своей работы — видны сразу и загораются по живой странице.
  const [marks, setMarks] = useState([]);
  useEffect(() => {
    if (!spec.list) return undefined;
    const tm = setTimeout(() => { const D = cpDocApi(frameRef.current, st.code); setMarks(spec.list.map((x) => { try { return !!(D && x.ok(D)); } catch (e) { return false; } })); }, 260);
    return () => clearTimeout(tm);
  }, [css]); // eslint-disable-line react-hooks/exhaustive-deps
  const qa = JSON.stringify({ a: cfg.answer, d: cfg.drill ? cfg.drill.answer : null, bad: cfg.bad || null,
    s: cfg.slot ? cfg.slot.ans : null, ds: cfg.drill && cfg.drill.slot ? cfg.drill.slot.ans : null });
  const setCode = drilling ? t.setDrillSt : t.setSt;
  // Без своего набора у задания — { } : ; и знаки из ответа (скобки url, кавычки, %, #, точка, дефис): парные рядом,
  // нужное чаще — первым (ряд на узком экране прокручивается вбок); «@» — только если его ещё нет в заготовке.
  const CP_ORD = ['{', '}', ':', ';', '(', ')', '"', '#', '%', '.', '-', ',', '@'];
  const ord = (a) => a.slice().sort((x, y) => (CP_ORD.indexOf(x) < 0 ? 99 : CP_ORD.indexOf(x)) - (CP_ORD.indexOf(y) < 0 ? 99 : CP_ORD.indexOf(y)));
  const syms = slot ? ord(Array.from(new Set(slot.ans.replace(/[\w\s]/g, '').split(''))))
    : (spec.syms || cfg.syms || ord(Array.from(new Set(CP_SYMS.concat(String(spec.answer || '').replace(/[\w\s]/g, '').split(''))))
      .filter((c) => !(c === '@' && /@/.test(String(spec.code0 || ''))))));
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={cfg.C.hints[Math.min(3, lv + 1) - 1] || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'cp-sheet cp-' + cfg.id + (cfg.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'cp-work' + (cfg.big ? ' is-big' : '') + (htmlAid ? ' has-html' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')} data-qa={qa}>
          <div className="cp-side">
            <CpBrowser tabs={tabs} cur={cfg.num - 1} flash={t.flash}>
              <CpPage html={html} css={css} base={PR.base} vw={spec.vw || cfg.vw} frameRef={frameRef} flash={t.flash} />
            </CpBrowser>
            {spec.list ? (
              <div className="cp-list">
                {spec.list.map((x, i) => (
                  <span key={i} className={'cp-li' + (marks[i] ? ' is-ok' : '')}><b>{marks[i] ? <Icon name="check" size={12} /> : i + 1}</b><span>{pick(x.t)}</span></span>
                ))}
              </div>
            ) : null}
            {htmlAid ? <CpHtml lines={htmlAid(pick)} /> : null}
          </div>
          <div className="cp-main">
            {slot ? (
              <CpSlotEditor key={drilling ? 'd' : 'm'} before={['<style>'].concat(given)} after={['</style>']} slot={slot} value={sv}
                onChange={(v) => setCode({ v, code: slot.pre + v + slot.post })} inputRef={inRef} led={led || lv === 2} onEnter={t.check} />
            ) : (
              <CpEditor before={['<style>'].concat(given)} after={['</style>']} value={st.code} onChange={(code) => setCode({ code })}
                inputRef={inRef} led={led || lv === 2} single={!!spec.single} big={!!cfg.big} onEnter={t.check} mark={t.mark} />
            )}
            {!rec.solved && lv >= 3 && cfg.sample ? <CpSample lines={cfg.sample} /> : null}
            {!rec.done ? <CpKeys inputRef={inRef} onCheck={t.check} ready={!empty} syms={syms} /> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
function CpTask({ p, n }) {
  const store = useStore();
  const pick = usePick();
  const cfg = useMemo(() => PR.tasks[n](pick, store), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <CpTaskScreen p={p} cfg={cfg} />;
}
// Задание: id t1…t5 и номер вкладки; init — начальный код; drill — та же форма. C — тексты из C.tN.
function cpTask(n, o) {
  const id = 't' + n;
  const mk = (x) => {
    const slot = n <= 2 && !o.big && x.slot !== false ? cpSlotOf(x.code0, x.answer) : null;
    return Object.assign({ init: () => (slot ? { code: x.code0 || '', v: slot.v0 } : { code: x.code0 || '' }) }, x, { slot });
  };
  return Object.assign(mk(o), { id, num: n, C: C[id], kind: o.kind || 'write-css', drill: o.drill ? mk(o.drill) : null });
}

// ─────────────────────────────────────────────────────────────────────────────
// КРЮЧОК: сайт в стилях, вкладки горят → «Yangilash» → сбой: стили пропали, вкладки гаснут. Одно касание.
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
  const all = useCpTabs(true);
  const tabs = broke ? all.map((x) => Object.assign({}, x, { st: 'off' })) : all;
  const tap = () => {
    if (broke) return;
    sfx('off', true);
    setBoom(true);
    setTimeout(() => setBoom(false), 700);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const css = PR.hook.css.join('\n');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="cp-sheet cp-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="cp-work">
          <div className="cp-side">
            <CpBrowser tabs={tabs} cur={0} cls={boom ? 'cp-glitch' : ''}>
              <CpPage html={PR.hook.page(pick)} css={broke ? '' : css} base={PR.base} vw={PR.hook.vw} />
            </CpBrowser>
          </div>
          <div className="cp-main">
            <CpCode lines={['<style>'].concat(broke ? ['  '] : PR.hook.css, ['</style>'])} cls={boom ? 'cp-glitch' : ''} />
            {!broke ? (
              <div className="kz-row cp-row">
                <button type="button" className="kz-btn is-coral cp-refresh" onClick={tap}>
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
// ВЫВОД: все пять вкладок горят, своя открыта и в стилях ученика; его код; что умеет (роли); дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Fin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useCpTabs(true);
  const own = store.get('myCss') || PR.ownDefault;
  const keys = Object.keys(c.roles);
  const COLS = ['#FA4F28', '#7C5CFA', '#0FA38E', '#F59E0B'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="cp-sheet cp-fin">
        <KzAsk text={c.ask} />
        <div className="cp-work">
          <div className="cp-side">
            <CpBrowser tabs={tabs} cur={4}><CpPage html={PR.ownPage(pick)} css={(PR.ownGiven || []).join('\n') + '\n' + own} base={PR.base} vw={PR.ownVw} /></CpBrowser>
            <div className="cp-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="cp-main">
            <CpCode lines={['<style>'].concat(String(own).split('\n'), ['</style>'])} />
            <div className="kz-roles cp-roles">
              {keys.map((k, i) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': COLS[i % COLS.length] }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(PR.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const T1 = ({ p }) => <CpTask p={p} n={0} />;
const T2 = ({ p }) => <CpTask p={p} n={1} />;
const T3 = ({ p }) => <CpTask p={p} n={2} />;
const T4 = ({ p }) => <CpTask p={p} n={3} />;
const T5 = ({ p }) => <CpTask p={p} n={4} />;
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: T3 },
  { id: 't4', code: 'CHECK-1', Comp: T4 },
  { id: 't5', code: 'LEVEL-4', Comp: T5 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только текущее задание (у своей страницы — и её стили).
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myCss', 'myName'] };

// Артефакт — своя страница из задания 5: HTML и стили ученика (в <style> — без закрывающего тега внутри).
function practiceArtifact(store) {
  const css = store.get('myCss');
  if (!css) return null;
  const pick = (x) => (x && x.ru) || '';
  return { type: 'css-page', css,
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <style>', String((PR.ownGiven || []).join('\n') + '\n' + css).replace(/<\//g, '<\\/'), '    </style>', '  </head>', '  <body>',
      '    ' + PR.ownPage(pick), '  </body>', '</html>'].join('\n') };
}

export default function CssPraktika({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
