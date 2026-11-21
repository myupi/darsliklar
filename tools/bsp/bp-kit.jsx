// =============================================================================
// КАРКАС ПРАКТИК МОДУЛЯ BOOTSTRAP (bsp, 21.11.2026; облик «Редактор», устройство — как у практик CSS, tools/cssp).
//   · Ученик пишет HTML с классами Bootstrap. Честный браузер BpPage — рамка без скриптов (sandbox без allow-scripts):
//     страница берёт body документа ученика, а настоящий CSS Bootstrap 6 (BS_CSS) включается, только если в документе
//     стоит верная строка link с сайта. Другой адрес, буква в адресе, чужой integrity, нет rel — страница голая, как
//     в настоящем браузере. Внешние адреса рамка не грузит: строки link и script вырезаются, картинки — только свои.
//   · Разбор bpDiagnose — одна самая полезная причина: русские буквы в теге, кавычки, незакрытый тег, лишний или
//     незакрытый парный тег, строка link (адрес, версия, rel, integrity), слова в class: точка, имя версии 5,
//     опечатка (по словам самого CSS Bootstrap), неизвестное слово. Потом — цель задания по готовой странице (BpDoc).
//   · Пример с сайта BpDocs: карточка как блок кода на getbootstrap.com с кнопкой копирования; кнопка «Qo'yish»
//     вставляет скопированное в место курсора (до первого касания редактора — в первую пустую строку).
//     Главное умение модуля (заказчик, 19.11.2026): найти на сайте, скопировать, настроить под себя.
//   · Редактор, кнопки, карта-вкладки, ход задания (помощь 1-2-3, образец, дополнительная задача), крючок, вывод —
//     как в каркасе cssp (код оттуда, классы cp-* и облик cp.css — общие).
// Данные практики — в pNN.jsx: META, PR (вкладки, документы, задания bpTask, примеры сайта), C (тексты).
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// ФАЙЛЫ И ЗАЩИТА. «Умные» кавычки — только внутри тегов (в тексте русские «ёлочки» остаются).
// ─────────────────────────────────────────────────────────────────────────────
const BP_FILES = (typeof PR !== 'undefined' && PR.files) || {};
const bpTagQuotes = (s) => String(s || '').replace(/<[^<>]*>?/g, (t) => t.replace(/[“”«»„]/g, '"').replace(/[‘’]/g, "'"));
function bpSan(html) {
  return bpTagQuotes(html)
    .replace(/<script\b[\s\S]*?(<\/script\s*>|$)/gi, '')
    .replace(/<(link|meta|base|iframe|object|embed)\b[^>]*>/gi, '')
    .replace(/(\ssrc\s*=\s*)(["'])([^"']*)\2/gi, (m, a, q, n) => a + q + (BP_FILES[n.trim()] || 'data:,') + q)
    .replace(/\son[a-z]+\s*=/gi, ' data-x=');
}
const CP_CYR = /[Ѐ-ӿ]/;
const escB = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР HTML без браузера: теги с местом в тексте, атрибуты, парные теги.
// ─────────────────────────────────────────────────────────────────────────────
// Теги кода: { i, raw, name, close, open (нет «>»), body (текст атрибутов) }.
function bpScan(src) {
  const s = String(src || '');
  const out = [];
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf('<', i);
    if (j < 0) break;
    if (s.startsWith('<!--', j)) { const e = s.indexOf('-->', j); i = e < 0 ? s.length : e + 3; continue; }
    const m = /^<(\/?)([a-zA-Z!][\w-]*)/.exec(s.slice(j));
    if (!m) { i = j + 1; continue; }
    // конец тега: «>» вне кавычек; новая «<» до «>» — тег не закрыт
    let k = j + m[0].length, q = '', open = true;
    for (; k < s.length; k += 1) {
      const ch = s[k];
      if (q) { if (ch === q) q = ''; continue; }
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (ch === '>') { open = false; break; }
      if (ch === '<' || ch === '\n' && /^\s*</.test(s.slice(k + 1))) break;
    }
    const raw = s.slice(j, open ? k : k + 1);
    out.push({ i: j, raw, name: m[2].toLowerCase(), close: m[1] === '/', open, quotes: q !== '', body: raw.slice(m[0].length).replace(/\/?>$/, '') });
    i = open ? k : k + 1;
  }
  return out;
}
function bpAttrs(body) {
  const a = {};
  const re = /([^\s=/"'<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(String(body || '')))) a[m[1].toLowerCase()] = m[2] != null ? m[2] : m[3] != null ? m[3] : m[4] != null ? m[4] : '';
  return a;
}
const BP_PAIRED = ['html', 'head', 'body', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'header', 'footer', 'nav', 'main', 'span', 'a', 'button', 'ul', 'ol', 'li', 'form', 'label', 'select', 'textarea', 'title', 'b', 'i', 'dialog', 'script'];
// Первый незакрытый или лишний закрывающий парный тег.
function bpBalance(src) {
  const stack = [];
  for (const t of bpScan(src)) {
    if (BP_PAIRED.indexOf(t.name) < 0) continue;
    if (!t.close) { stack.push(t); continue; }
    let k = stack.length - 1;
    while (k >= 0 && stack[k].name !== t.name) k -= 1;
    if (k < 0) return { extra: t };
    if (k < stack.length - 1) return { open: stack[stack.length - 1] };   // внутри остался незакрытый
    stack.pop();
  }
  return stack.length ? { open: stack[stack.length - 1] } : {};
}
function cpDist(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j += 1) d[0][j] = j;
  // переставленные соседние буквы (alret → alert) — одна правка, как одна опечатка
  for (let i = 1; i <= m; i += 1) for (let j = 1; j <= n; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[m][n];
}

// ─────────────────────────────────────────────────────────────────────────────
// СТРОКИ LINK И SCRIPT: верно ли подключён Bootstrap (как решит настоящий браузер) и где стоят строки.
// ─────────────────────────────────────────────────────────────────────────────
function bpPlace(src, i) {
  const s = String(src || '').toLowerCase();
  const hc = s.indexOf('</head'), bo = s.search(/<body[\s>]/), bc = s.lastIndexOf('</body');
  const inHead = (hc < 0 || i < hc) && (bo < 0 || i < bo) && s.slice(0, i).indexOf('<head') >= 0;
  const inBody = bo >= 0 && i > bo && (bc < 0 || i < bc);
  return { inHead, inBody };
}
function bpLinkInfo(src) {
  const s = bpTagQuotes(src);
  const links = bpScan(s).filter((t) => !t.close && t.name === 'link');
  if (!links.length) return { tag: null, ok: false, why: 'none' };
  // строка, похожая на Bootstrap: по адресу (если таких нет — первая)
  const t = links.find((x) => /boo?t?s?t?r?a?p|jsdelivr|\.css/i.test(bpAttrs(x.body).href || '')) || links[0];
  const a = bpAttrs(t.body);
  const href = String(a.href || '').trim();
  const place = bpPlace(s, t.i);
  const base = Object.assign({ tag: t, ok: false, href }, place);
  if (href !== BP_CSS_URL) {
    if (/bootstrap@5|bootstrap@4|bootstrap@3/i.test(href)) return Object.assign(base, { why: 'ver' });
    if (cpDist(href, BP_CSS_URL) <= 4) return Object.assign(base, { why: 'typo' });
    return Object.assign(base, { why: 'url' });
  }
  if (!/(^|\s)stylesheet(\s|$)/i.test(a.rel || '')) return Object.assign(base, { why: 'rel' });
  if (a.integrity != null && a.integrity.trim() !== BP_CSS_SRI) return Object.assign(base, { why: 'sri' });
  return Object.assign(base, { ok: true, why: null });
}
function bpScriptInfo(src) {
  const s = bpTagQuotes(src);
  const all = bpScan(s);
  const t = all.find((x) => !x.close && x.name === 'script');
  if (!t) return { tag: null, ok: false, why: 'none' };
  const a = bpAttrs(t.body);
  const href = String(a.src || '').trim();
  const place = bpPlace(s, t.i);
  // в конце body: после строки script до </body> других тегов нет
  const after = all.filter((x) => x.i > t.i && !(x.close && /^(script|body|html)$/.test(x.name)));
  const base = Object.assign({ tag: t, ok: false, href }, place, { atEnd: place.inBody && !after.some((x) => !/^(body|html)$/.test(x.name)) });
  if (href !== BP_JS_URL) return Object.assign(base, { why: cpDist(href, BP_JS_URL) <= 4 ? 'typo' : 'url' });
  if (a.integrity != null && a.integrity.trim() !== BP_JS_SRI) return Object.assign(base, { why: 'sri' });
  return Object.assign(base, { ok: true, why: null });
}

// ─────────────────────────────────────────────────────────────────────────────
// СЛОВА CLASS: все имена классов самого CSS Bootstrap (bootstrap.min.css 6.0.0-alpha.1), имена версии 5 → версии 6.
// ─────────────────────────────────────────────────────────────────────────────
let BP_KNOWN = null;
// Слова из примеров сайта, у которых в CSS 6.0.0-alpha.1 нет своих правил (имена частей; урок 5: card-title, card-text).
// Урок 8: slide — в примерах Carousel на сайте («carousel slide»), своих правил в CSS 6.0.0-alpha.1 нет.
const BP_DOC_WORDS = ['card-title', 'card-text', 'card-subtitle', 'card-link', 'card-header', 'card-footer', 'list-unstyled', 'slide'];
function bpKnown() {
  if (BP_KNOWN) return BP_KNOWN;
  BP_KNOWN = new Set(BP_DOC_WORDS);
  const re = /\.((?:[a-zA-Z_]|\\3\d )(?:[\w-]|\\.)*)/g;
  let m;
  while ((m = re.exec(BS_CSS))) {
    const w = m[1].replace(/\\3(\d) /g, '$1').replace(/\\(.)/g, '$1');
    if (!/^\d/.test(w) || /^\dxl:/.test(w)) BP_KNOWN.add(w);
  }
  return BP_KNOWN;
}
const BP_THEMES = 'primary|secondary|success|danger|warning|info|light|dark';
function bpV5(w) {
  let m;
  if ((m = new RegExp('^alert-(' + BP_THEMES + ')$').exec(w))) return 'theme-' + (m[1] === 'dark' ? 'inverse' : m[1] === 'light' ? 'secondary' : m[1]);
  if ((m = new RegExp('^btn-outline-(' + BP_THEMES + ')$').exec(w))) return 'btn-outline theme-' + m[1];
  if ((m = new RegExp('^btn-(' + BP_THEMES + ')$').exec(w))) return 'btn-solid theme-' + m[1];
  if ((m = new RegExp('^text-(' + BP_THEMES + ')$').exec(w))) return 'fg-' + m[1];
  if ((m = /^col-(sm|md|lg|xl|xxl)-(\d{1,2})$/.exec(w))) return m[1] + ':col-' + m[2];
  const one = { 'img-responsive': 'img-fluid', 'img-circle': 'rounded-circle', 'form-select': 'form-control', 'form-check': 'form-field',
    'form-check-input': 'check', 'form-check-label': 'form-label', 'dropdown': 'menu', 'dropdown-menu': 'menu', 'dropdown-item': 'menu-item',
    'dropdown-toggle': 'btn-solid', 'modal': 'dialog', 'modal-dialog': 'dialog', 'modal-content': 'dialog', 'modal-header': 'dialog-header',
    'modal-body': 'dialog-body', 'modal-footer': 'dialog-footer', 'modal-title': 'dialog-title', 'carousel-caption': null, 'carousel-control-prev': null, 'carousel-control-next': null };
  return Object.prototype.hasOwnProperty.call(one, w) ? (one[w] || '') : null;
}
// Похожее слово Bootstrap (опечатка: theme-warnig → theme-warning, alret → alert).
function bpNearCls(w) {
  const x = String(w || '').toLowerCase();
  if (!/^[a-z][a-z0-9:-]*$/.test(x)) return null;
  let best = null, bd = 9;
  bpKnown().forEach((q) => {
    if (Math.abs(q.length - x.length) > 2) return;
    const d = cpDist(x, q);
    if (d < bd || (d === bd && best && q.length < best.length)) { bd = d; best = q; }
  });
  return bd <= (x.length <= 4 ? 1 : 2) ? best : null;
}
// Слова в class у тегов кода: { w, i } (i — место в коде).
function bpClassWords(src) {
  const out = [];
  for (const t of bpScan(bpTagQuotes(src))) {
    if (t.close) continue;
    const m = /\sclass\s*=\s*(["'])([^"']*)\1?/i.exec(t.raw);
    if (!m) continue;
    const at = t.i + m.index + m[0].indexOf(m[2]);
    m[2].split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, i: at + m[2].indexOf(w), tag: t }));
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР — одна самая полезная причина (или null — дальше цель по странице). Где она — BP_DIAG.at (место в коде).
// full — весь документ (готовые строки вокруг кода ученика), code — то, что пишет ученик.
// ─────────────────────────────────────────────────────────────────────────────
const BP_DIAG = { at: null };
function bpDiagnose(full, code) {
  BP_DIAG.at = null;
  const src = String(code || '');
  const at = (i, m) => { BP_DIAG.at = { i }; return m; };
  if (!src.trim()) return FB.empty;
  const tags = bpScan(src);
  for (const t of tags) {
    // русские буквы в имени тега или атрибута — всегда; в значении — только в class, id и data-bs-* (alt, title, placeholder — любые)
    const nameCyr = CP_CYR.test(t.raw.replace(/(["'])[^"']*\1/g, ''));
    const vals = [];
    t.raw.replace(/\s(class|id|data-bs-[\w-]+)\s*=\s*(["'])([^"']*)/gi, (m0, n, q, v) => { vals.push(v); return m0; });
    if (nameCyr || vals.some((v) => CP_CYR.test(v))) return at(t.i + Math.max(0, t.raw.search(CP_CYR)), FB.cyr);
    if (t.quotes) return at(t.i, FB.quote);
    if (t.open) return at(t.i, fillL(FB.tagOpen, { t: t.name }));
  }
  const bal = bpBalance(src);
  if (bal.extra) return at(bal.extra.i, fillL(FB.extraClose, { t: bal.extra.name }));
  if (bal.open) return at(bal.open.i, fillL(FB.closeTag, { t: bal.open.name }));
  // строка link (если она есть в документе): адрес, версия, rel, integrity
  const L = bpLinkInfo(full);
  if (L.tag && !L.ok) {
    const k = src.indexOf(L.tag.raw.slice(0, 20));
    const m = { typo: FB.linkTypo, url: FB.linkUrl, ver: FB.linkVer, rel: FB.linkRel, sri: FB.linkSri }[L.why];
    if (m) return k >= 0 ? at(k, m) : m;
  }
  const S = bpScriptInfo(full);
  if (S.tag && !S.ok) {
    const k = src.indexOf(S.tag.raw.slice(0, 20));
    const m = S.why === 'sri' ? FB.scriptSri : FB.scriptUrl;
    return k >= 0 ? at(k, m) : m;
  }
  // слова в class
  for (const x of bpClassWords(src)) {
    const w = x.w;
    if (/^\./.test(w)) return at(x.i, fillL(FB.clsDot, { w: w.replace(/^\.+/, '') }));
    // CSS вместо слова Bootstrap (display: flex;) — урок 4
    if (/[;]|:$/.test(w) || (/^(display|justify-content|align-items|flex-direction|gap)$/.test(w) && !bpKnown().has(w))) return at(x.i, FB.cssInClass);
    // значение CSS внутри слова: justify-content-space-between → between
    let m = /^justify-content-space-(between|around|evenly)$/.exec(w);
    if (m) return at(x.i, fillL(FB.cssValue, { w, n: 'justify-content-' + m[1] }));
    m = /^(row-|column-)?gap-(\d+)$/.exec(w);
    if (m && +m[2] > 12) return at(x.i, fillL(FB.gapNum, { w }));
    // сетка (урок 6): размер экрана через дефис вместо двоеточия (md-col-4), колонок больше двенадцати (col-13)
    m = /^(sm|md|lg|xl|2xl)-col(-\d+)?$/.exec(w);
    if (m) return at(x.i, fillL(FB.bpColon, { w, n: m[1] + ':col' + (m[2] || '') }));
    m = /^((?:sm|md|lg|xl|2xl):)?col-(\d+)$/.exec(w);
    if (m && (+m[2] > 12 || +m[2] < 1)) return at(x.i, fillL(FB.col12, { w }));
    if (bpKnown().has(w) || (PR.ownClasses && PR.ownClasses.indexOf(w) >= 0)) continue;
    const v5 = bpV5(w);
    if (v5 != null) return at(x.i, fillL(FB.v5, { w }));
    // цвет своим словом (theme-green, fg-red): у Bootstrap свои слова цвета
    if (/^(theme|fg|bg|btn|alert)-(red|green|blue|yellow|orange|purple|violet|pink|gray|grey|black|white|cyan|brown)$/.test(w)) return at(x.i, fillL(FB.colorName, { w }));
    const n = bpNearCls(w);
    return at(x.i, n ? fillL(FB.clsNear, { w, n }) : fillL(FB.clsUnknown, { w }));
  }
  // атрибуты data-bs-*: имя версии 5 (data-bs-ride), data-bs-target без «#» или с точкой, data-bs-slide не next/prev
  for (const t of bpScan(bpTagQuotes(src))) {
    if (t.close) continue;
    let m = /\s(data-bs-ride)\s*=/i.exec(t.raw);
    if (m) return at(t.i + m.index + 1, fillL(FB.v5, { w: 'data-bs-ride' }));
    m = /\sdata-bs-target\s*=\s*(["'])\s*([^"'\s]+)\s*\1/i.exec(t.raw);
    if (m && m[2].charAt(0) === '.') return at(t.i + m.index + 1, fillL(FB.bsDot, { w: '#' + m[2].slice(1) }));
    if (m && m[2].charAt(0) !== '#') return at(t.i + m.index + 1, fillL(FB.bsHash, { w: '#' + m[2] }));
    m = /\sdata-bs-(toggle|dismiss)\s*=\s*(["'])\s*([^"'\s]*)\s*\2/i.exec(t.raw);
    if (m && /^(dropdown|modal)$/i.test(m[3])) return at(t.i + m.index + 1, fillL(FB.v5, { w: m[3] }));
    if (m && m[3] && !/^(menu|dialog|collapse|tooltip|popover|tab|offcanvas|button|alert|toast)$/.test(m[3])) return at(t.i + m.index + 1, FB.bsToggle);
    m = /\sdata-bs-slide\s*=\s*(["'])\s*([^"'\s]*)\s*\1/i.exec(t.raw);
    if (m && m[2] && !/^(next|prev)$/.test(m[2])) return at(t.i + m.index + 1, FB.bsSlide);
  }
  return null;
}
// Номер строки (с нуля) кода ученика, где причина; null — не нашлось.
function cpLineAt(code, a) {
  if (!a || typeof a.i !== 'number') return null;
  return String(code || '').slice(0, a.i).split('\n').length - 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧТО ПИСАТЬ — рамка в строке (задания 1–2 и их дополнительные): отличие начального кода от ответа — одно место
// в одной строке. role: cls — слово в class, val — значение другого атрибута, txt — текст между тегами.
// ─────────────────────────────────────────────────────────────────────────────
const CP_SLOT_L = /[\s"'>=]/, CP_SLOT_R = /[\s"'<]/;
function cpSlotOf(a, b) {
  a = String(a || ''); b = String(b || '');
  if (!a || a === b) return null;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  let j = 0;
  while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j += 1;
  const v1 = a.slice(i, a.length - j);
  // рамка — по целому слову; пустое место между кавычками (class="") — вся пара кавычек внутри
  if (v1 || !/["']$/.test(a.slice(0, i))) {
    while (i > 0 && !CP_SLOT_L.test(a[i - 1])) i -= 1;
    while (j > 0 && !CP_SLOT_R.test(a[a.length - j])) j -= 1;
  }
  const v0 = a.slice(i, a.length - j), ans = b.slice(i, b.length - j);
  if (/\n/.test(v0) || /\n/.test(ans) || !ans.trim()) return null;
  const pre = a.slice(0, i), post = a.slice(a.length - j);
  const lastLt = pre.lastIndexOf('<'), lastGt = pre.lastIndexOf('>');
  const inTag = lastLt > lastGt;
  const role = !inTag ? 'txt' : /\sclass\s*=\s*["'][^"']*$/i.test(pre) ? 'cls' : 'val';
  return { pre, post, v0, ans, role };
}

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА: что видно в окне браузера (BpDoc для проверки цели). Вычисленные стили — как в DevTools.
// ─────────────────────────────────────────────────────────────────────────────
function bpBody(full) {
  const s = String(full || '');
  const b = /<body\b[^>]*>/i.exec(s);
  let body = b ? s.slice(b.index + b[0].length) : s.replace(/<head\b[\s\S]*?(<\/head\s*>|$)/i, '');
  body = body.replace(/<\/body\s*>[\s\S]*$/i, '');
  return body.replace(/<!doctype[^>]*>|<\/?(html|head|body)\b[^>]*>|<title\b[\s\S]*?(<\/title\s*>|$)/gi, '');
}
function bpDocApi(frame, full) {
  const doc = frame && frame.contentDocument;
  if (!doc || !doc.body) return null;
  const win = doc.defaultView;
  const L = bpLinkInfo(full), S = bpScriptInfo(full);
  const api = {
    doc, win, full: String(full || ''), bs: !!L.ok, link: L, script: S,
    q: (s) => { try { return doc.querySelector(s); } catch (e) { return null; } },
    qa: (s) => { try { return Array.from(doc.querySelectorAll(s)); } catch (e) { return []; } },
    cs: (s, p) => { const e = typeof s === 'string' ? api.q(s) : s; return e ? win.getComputedStyle(e).getPropertyValue(p).trim() : ''; },
    text: (s) => { const e = typeof s === 'string' ? api.q(s) : s; return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; },
    // слово цвета у вещи: theme-warning → warning ('' — нет)
    theme: (s) => { const e = typeof s === 'string' ? api.q(s) : s; const c = e ? Array.from(e.classList).find((x) => /^theme-/.test(x)) : ''; return c ? c.slice(6) : ''; },
    has: (s, cls) => { const e = typeof s === 'string' ? api.q(s) : s; return !!(e && e.classList.contains(cls)); },
    // слово цвета текста и фона: fg-danger → danger, bg-warning → warning ('' — нет)
    // вещь целиком в ширине страницы (картинка на телефоне не вылезает за край)
    fits: (s) => { const e = typeof s === 'string' ? api.q(s) : s; return !!e && e.getBoundingClientRect().right <= doc.documentElement.clientWidth + 1; },
    fg: (s) => api.word(s, 'fg-'),
    bg: (s) => api.word(s, 'bg-'),
    word: (s, pre) => { const e = typeof s === 'string' ? api.q(s) : s; const c = e ? Array.from(e.classList).find((x) => x.indexOf(pre) === 0) : ''; return c ? c.slice(pre.length) : ''; }
  };
  return api;
}

// КАРУСЕЛЬ (урок 8) — как скрипт Bootstrap, только если в документе верная строка script: карусель встаёт на слайд
// active, кнопки data-bs-slide и точки data-bs-slide-to листают карусель по data-bs-target (нужен «#id»), data-bs-autoplay="true"
// листает сама (время — data-bs-interval слайда, иначе 5000 мс), carousel-fade — смена прозрачностью. Без строки script,
// без «#» или с чужим id кнопки мёртвые — как в настоящем браузере. Прокрутка при scroll-snap в окне не двигается — на время
// перехода прилипание снимается (как в уроке 8).
const bpItems = (inner) => Array.from(inner.children).filter((x) => x.classList.contains('carousel-item'));
function bpSlide(inner, idx, smooth) {
  const items = bpItems(inner);
  if (!items.length) return;
  const n = items.length, i = ((idx % n) + n) % n;
  items.forEach((x, k) => x.classList.toggle('active', k === i));
  const car = inner.closest('.carousel');
  if (car) car.querySelectorAll('[data-bs-slide-to]').forEach((d) => { const on = +d.getAttribute('data-bs-slide-to') === i; d.classList.toggle('active', on); if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  if (car && car.classList.contains('carousel-fade')) return;
  const to = items[i].offsetLeft - items[0].offsetLeft, from = inner.scrollLeft, t0 = performance.now(), dur = smooth ? 450 : 0;
  cancelAnimationFrame(inner.__bpRaf || 0);
  inner.style.scrollSnapType = 'none'; inner.style.scrollBehavior = 'auto';
  const tick = (t) => {
    const k = dur ? Math.min(1, (t - t0) / dur) : 1;
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    inner.scrollLeft = from + (to - from) * e;
    if (k < 1) inner.__bpRaf = requestAnimationFrame(tick);
    else { inner.style.scrollSnapType = ''; inner.style.scrollBehavior = ''; }
  };
  if (dur) inner.__bpRaf = requestAnimationFrame(tick); else tick(t0);
}
const bpCur = (inner) => Math.max(0, bpItems(inner).findIndex((x) => x.classList.contains('active')));
function bpAuto(car) {
  clearTimeout(car.__bpT);
  const inner = car.querySelector('.carousel-inner');
  if (!inner || car.getAttribute('data-bs-autoplay') !== 'true') return;
  const it = bpItems(inner)[bpCur(inner)];
  const ms = Math.max(300, +(it && it.getAttribute('data-bs-interval')) || 5000);
  car.classList.add('carousel-playing');
  car.style.setProperty('--bs-carousel-interval', ms + 'ms');
  car.__bpT = setTimeout(() => {
    if (!car.isConnected || !car.ownerDocument.body || car.ownerDocument.body.dataset.js !== '1') return;
    bpSlide(inner, bpCur(inner) + 1, true);
    bpAuto(car);
  }, ms);
}
function bpCarousels(doc) {
  doc.querySelectorAll('.carousel').forEach((car) => {
    const inner = car.querySelector('.carousel-inner');
    if (!inner) return;
    bpSlide(inner, bpCur(inner), false);
    bpAuto(car);
  });
}
function bpCarouselClick(doc, e) {
  const b = e.target && e.target.closest && e.target.closest('[data-bs-slide], [data-bs-slide-to]');
  if (!b) return false;
  const sel = (b.getAttribute('data-bs-target') || '').trim();
  let car = null;
  try { car = /^#[\w-]+$/.test(sel) ? doc.querySelector(sel) : null; } catch (er) { car = null; }
  const inner = car && car.querySelector('.carousel-inner');
  if (!inner) return true;
  const dir = b.getAttribute('data-bs-slide');
  if (!b.hasAttribute('data-bs-slide-to') && dir !== 'prev' && dir !== 'next') return true;
  const cur = bpCur(inner);
  bpSlide(inner, b.hasAttribute('data-bs-slide-to') ? +b.getAttribute('data-bs-slide-to') : cur + (dir === 'prev' ? -1 : 1), true);
  bpAuto(car);
  return true;
}

// МЕНЮ И ОКНО (урок 9) — тоже только при верной строке script: кнопка data-bs-toggle="menu" открывает соседний .menu под
// собой (пункт или щелчок мимо закрывает), data-bs-toggle="dialog" + data-bs-target="#id" открывает <dialog> (showModal),
// закрывают data-bs-dismiss="dialog", фон и Esc (data-bs-backdrop="static" — только кнопки). Без script, с чужим словом
// или без «#» кнопка мёртвая. Открытое окно выше страницы — страница подрастает (doc.__bpRefit).
const bpMenuOf = (btn) => { let m = btn.nextElementSibling; while (m && !(m.classList && m.classList.contains('menu'))) m = m.nextElementSibling; return m; };
function bpCloseMenus(doc, keep) {
  doc.querySelectorAll('.menu.show').forEach((m) => { if (m === keep || m.classList.contains('position-static')) return; m.classList.remove('show'); if (m.__btn) m.__btn.setAttribute('aria-expanded', 'false'); });
}
function bpOpenDialog(doc, dlg) {
  if (!dlg || dlg.open || typeof dlg.showModal !== 'function') return;
  doc.body.style.minHeight = '';
  dlg.showModal();
  dlg.style.maxHeight = 'none';
  const need = Math.ceil(dlg.getBoundingClientRect().height + 64);
  dlg.style.maxHeight = '';
  if (doc.body.getBoundingClientRect().height < need) doc.body.style.minHeight = need + 'px';
  if (!dlg.__bpClose) {
    dlg.__bpClose = true;
    dlg.addEventListener('close', () => { doc.body.style.minHeight = ''; if (doc.__bpRefit) doc.__bpRefit(); });
    dlg.addEventListener('cancel', (e) => { if (dlg.__static) e.preventDefault(); });
  }
  if (doc.__bpRefit) doc.__bpRefit();
}
function bpUiClick(doc, e) {
  const t = e.target;
  if (!t || !t.closest) return false;
  if (t.tagName === 'DIALOG' && t.open) {   // щелчок мимо коробки окна — по фону
    const r = t.getBoundingClientRect();
    if ((e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) && !t.__static) t.close();
    return true;
  }
  const dis = t.closest('[data-bs-dismiss]');
  if (dis && dis.closest('dialog')) { if (dis.getAttribute('data-bs-dismiss') === 'dialog') dis.closest('dialog').close(); return true; }
  const tg = t.closest('[data-bs-toggle]');
  if (tg) {
    const kind = tg.getAttribute('data-bs-toggle');
    if (kind === 'menu') {
      const m = bpMenuOf(tg);
      if (!m) return true;
      const on = !m.classList.contains('show');
      bpCloseMenus(doc, m);
      m.__btn = tg;
      if (on) {
        doc.body.style.position = 'relative';
        const br = tg.getBoundingClientRect(), dr = doc.body.getBoundingClientRect();
        Object.assign(m.style, { top: Math.round(br.bottom - dr.top + 2) + 'px', left: Math.round(br.left - dr.left) + 'px' });
        m.classList.add('show'); tg.setAttribute('aria-expanded', 'true');
      } else { m.classList.remove('show'); tg.setAttribute('aria-expanded', 'false'); }
      return true;
    }
    if (kind === 'dialog') {
      const sel = (tg.getAttribute('data-bs-target') || '').trim();
      let dlg = null;
      try { dlg = /^#[\w-]+$/.test(sel) ? doc.querySelector(sel) : null; } catch (er) { dlg = null; }
      if (!dlg || dlg.tagName !== 'DIALOG') return true;
      dlg.__static = tg.getAttribute('data-bs-backdrop') === 'static';
      bpOpenDialog(doc, dlg);
      return true;
    }
    return false;
  }
  const inMenu = t.closest('.menu');
  if (!inMenu || t.closest('.menu-item')) bpCloseMenus(doc, null);
  return false;
}

// Документ рамки: свой каркас, CSS Bootstrap (bp-bs) — только при верной строке link, свои стили страницы (bp-b).
// Картинки сами не сжимаются (как в Bootstrap 6: это делает img-fluid, урок 3).
const BP_BASE_CSS = 'html,body{margin:0}body{padding:10px 12px}';
const BP_SRCDOC = '<!DOCTYPE html><html data-bs-theme="light" style="color-scheme:light"><head><meta charset="utf-8"><style id="bp-bs"></style><style id="bp-b">' + BP_BASE_CSS + '</style></head><body></body></html>';

// Честный браузер: рамка без скриптов; body документа ученика — в body рамки, CSS Bootstrap — по строке link.
// Страница ужимается целиком (transform), чтобы влезть в окно, — как в каркасе cssp.
// vw — окно своей ширины (телефон 360 px, как в уроке 3): страница рисуется в этой ширине и уменьшается целиком; что шире — честно обрезано краем.
function BpPage({ full, frameRef, fit = true, flash, onApply, vw }) {
  const box = useRef(null);
  const fr = useRef(null);
  const [bw, setBw] = useState(0);
  const [bh, setBh] = useState(0);
  const [ok, setOk] = useState(0);
  const [k, setK] = useState(1);
  // окно телефона (vw): масштаб, высота страницы, вылезает ли что-то за край
  const [ph, setPh] = useState(null);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => { requestAnimationFrame(() => { setBw(el.clientWidth); setBh(el.clientHeight); }); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const apply = useCallback(() => {
    const f = fr.current;
    const doc = f && f.contentDocument;
    if (!doc || !doc.body) return;
    const bsOn = bpLinkInfo(full).ok;
    const st = doc.getElementById('bp-bs');
    if (st && st.dataset.on !== String(bsOn)) { st.textContent = bsOn ? BS_CSS : ''; st.dataset.on = String(bsOn); }
    const html = bpSan(bpBody(full));
    const fresh = doc.body.dataset.src !== html;
    if (fresh) { doc.body.innerHTML = html; doc.body.dataset.src = html; }
    doc.querySelectorAll('a[href]').forEach((a) => { a.onclick = (e) => e.preventDefault(); });
    // скрипт Bootstrap (строка script): карусель на слайде active, кнопки и точки — по щелчку, автопрокрутка
    const js = bpScriptInfo(full).ok ? '1' : '0';
    const jsNew = doc.body.dataset.js !== js;
    doc.body.dataset.js = js;
    if (js === '1' && (fresh || jsNew || bsOn !== (doc.body.dataset.bs === '1'))) bpCarousels(doc);
    doc.body.dataset.bs = bsOn ? '1' : '0';
    if (!doc.__bpUi) {
      doc.__bpUi = true;
      doc.addEventListener('click', (e) => { if (doc.body && doc.body.dataset.js === '1' && !bpUiClick(doc, e)) bpCarouselClick(doc, e); });
    }
    doc.__bpRefit = () => setOk((x) => x + 1);
    if (js !== '1') doc.querySelectorAll('dialog[open]').forEach((d) => d.close());
    if (onApply) onApply();
    if (vw && bw && bh) {
      // телефон целиком: вся страница видна, уменьшенная; что шире телефона — обрезано краем (красная черта)
      requestAnimationFrame(() => {
        const H = Math.max(80, Math.ceil(doc.body.getBoundingClientRect().height));
        const k2 = Math.min(bw / vw, bh / H);
        const over = doc.documentElement.scrollWidth > vw + 1;
        setPh((p) => (p && Math.abs(p.k - k2) < 0.004 && p.h === H && p.over === over ? p : { k: k2, h: H, over }));
      });
      return;
    }
    if (!fit || vw || !bw || !bh) return;
    requestAnimationFrame(() => {
      const H = doc.documentElement.scrollHeight;
      const inner = bh / k;
      if (!H) return;
      if (H > inner + 1) { const k2 = Math.max(0.34, Math.floor((bh / H) * 50) / 50); if (k2 !== k) setK(k2); }
      else if (k < 1 && H < inner * 0.85) { const k2 = Math.min(1, Math.floor((bh / H) * 0.95 * 50) / 50); if (k2 > k) setK(k2); }
    });
  }, [full, fit, k, bw, bh, vw]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { apply(); }, [apply, ok]);
  const setRef = (el) => { fr.current = el; if (frameRef) frameRef.current = el; };
  const w = bw ? bw / k : 0;
  const ml = vw && ph ? Math.max(0, Math.round((bw - vw * ph.k) / 2)) : 0;
  const style = vw ? (ph ? { width: vw + 'px', height: ph.h + 'px', transform: 'scale(' + ph.k + ')', transformOrigin: '0 0', marginLeft: ml + 'px' } : { width: vw + 'px', visibility: 'hidden' })
    : bw && k !== 1 ? { width: Math.round(w) + 'px', height: Math.max(80, Math.round(bh / k)) + 'px', transform: 'scale(' + k + ')', transformOrigin: '0 0' } : null;
  return (
    <div ref={box} className={'cp-pagebox' + (flash ? ' cp-in' : '') + (vw ? ' bp-phone' : '')}>
      <iframe ref={setRef} className="cp-frame" title="page" sandbox="allow-same-origin" srcDoc={BP_SRCDOC} style={style || undefined}
        onLoad={() => setOk((x) => x + 1)} tabIndex={-1} />
      {vw && ph ? <i className={'bp-edge' + (ph.over ? ' is-over' : '')} style={{ left: ml + Math.round(vw * ph.k) + 'px', height: Math.round(ph.h * ph.k) + 'px' }} aria-hidden="true" /> : null}
      {vw ? <span className={'cp-vw' + (vw < 600 ? ' is-phone' : '') + (ph && ph.over ? ' is-over' : '')}>{vw}px</span> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА HTML — как в редакторе урока: тег синий, атрибут голубой, значение терракотовое. Состояние (внутри тега,
// внутри кавычек) идёт через строки. fold — в готовых строках адрес CDN и integrity свёрнуты (…/bootstrap.min.css,
// sha384-B/GM…CrCe), как в редакторе урока; в строках ученика — полностью (поле поверх подсветки должно совпадать).
// ─────────────────────────────────────────────────────────────────────────────
function bpFoldVal(v) {
  const q = /["']$/.test(v) && v.length > 1 ? v.slice(-1) : '';
  const s = q ? v.slice(0, -1) : v;
  const lead = /^["']/.test(s) ? s[0] : '';
  const x = lead ? s.slice(1) : s;
  if (/cdn\.jsdelivr/.test(x)) return lead + '…/' + x.slice(x.lastIndexOf('/') + 1) + q;
  if (/^sha384-/.test(x) && x.length > 20) return lead + x.slice(0, 11) + '…' + x.slice(-4) + q;
  return v;
}
function cpHlLines(lines, foldAt) {
  let inTag = false, q = '';
  return lines.map((line, li) => {
    const parts = [];
    let n = 0;
    const push = (cls, t) => { if (t) parts.push(<span key={n++} className={cls}>{t}</span>); };
    const fold = foldAt === true || (typeof foldAt === 'function' && foldAt(li));
    let i = 0;
    while (i < line.length) {
      if (q) {
        const j = line.indexOf(q, i);
        const v = j < 0 ? line.slice(i) : line.slice(i, j + 1);
        push('cp-hv', fold ? bpFoldVal(v) : v); i += v.length; if (j >= 0) q = '';
        continue;
      }
      if (!inTag) {
        const j = line.indexOf('<', i);
        if (j < 0) { push('cp-t', line.slice(i)); break; }
        push('cp-t', line.slice(i, j));
        const m = /^<(\/?)([a-zA-Z!][\w-]*)?/.exec(line.slice(j));
        push('cp-tb', '<' + m[1]); push('cp-tn', m[2] || '');
        i = j + m[0].length; inTag = true;
        continue;
      }
      const ch = line[i];
      if (ch === '>') { push('cp-tb', '>'); inTag = false; i += 1; continue; }
      if (ch === '/' && line[i + 1] === '>') { push('cp-tb', '/>'); inTag = false; i += 2; continue; }
      if (ch === '"' || ch === "'") {
        const j = line.indexOf(ch, i + 1);
        const v = j < 0 ? line.slice(i) : line.slice(i, j + 1);
        push('cp-hv', fold ? bpFoldVal(v) : v); i += v.length; if (j < 0) q = ch;
        continue;
      }
      if (ch === '=') { push('cp-tb', '='); i += 1; continue; }
      if (/\s/.test(ch)) { const m = /^\s+/.exec(line.slice(i)); push('cp-t', m[0]); i += m[0].length; continue; }
      const m = /^[^\s=>"'/]+/.exec(line.slice(i));
      const t = m ? m[0] : ch;
      push('cp-ha', t); i += t.length;
    }
    return parts;
  });
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

// Вставка скопированного с сайта: в место курсора, которое поставил ученик. Пока он сам не касался кода (или после
// прошлой вставки не ставил курсор) — в первую пустую строку заготовки (там «✎»), а если их нет — после прошлой вставки.
// Так строка link встаёт в head, пример e'lon — в body, script — за ним. Строки примера получают отступ строки.
function bpPaste(el, text) {
  if (!el) return;
  const v = el.value;
  let a, b;
  const user = el.dataset.touched === '1' && el.dataset.auto !== '1';
  const hole = v.trim() ? /(^|\n)([ \t]*)(?=\n|$)/.exec(v) : null;
  if (!user && hole) a = b = hole.index + hole[1].length + hole[2].length;
  else if (el.dataset.touched === '1' && typeof el.selectionStart === 'number') { a = el.selectionStart; b = el.selectionEnd; }
  else a = b = v.length;
  const ls = v.lastIndexOf('\n', a - 1) + 1;
  const ind = /^[ \t]*/.exec(v.slice(ls))[0];
  const lines = String(text).split('\n');
  const head = v.slice(ls, a).trim() ? '\n' + ind : '';
  const ins = head + lines.map((ln, k) => (k ? ind : '') + ln).join('\n');
  el.dataset.touched = '1';
  el.dataset.auto = '1';
  el.focus();
  if (el.setRangeText) el.setRangeText(ins, a, b, 'end');
  else {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
    setter.call(el, v.slice(0, a) + ins + v.slice(b));
    el.setSelectionRange(a + ins.length, a + ins.length);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРИМЕР С САЙТА — как блок кода на getbootstrap.com: раздел, подпись «HTML» и значок копирования («Copied!»).
// Код в одну строку с прокруткой вбок, адрес CDN и integrity свёрнуты (копируется полностью). chips — слова раздела
// (Variants: theme-primary …), чтобы видеть, какие слова есть на сайте.
// ─────────────────────────────────────────────────────────────────────────────
const BP_DOT = { primary: '#0D6EFD', accent: '#7C3AED', success: '#198754', danger: '#DC3545', warning: '#FFC107', info: '#0DCAF0', inverse: '#212529', secondary: '#6C757D' };
const BpCopyIco = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
);
function BpDocs({ docs, clip, onCopy }) {
  const pick = usePick();
  return (
    <div className="bp-docs" translate="no">
      <div className="bp-docs-top">
        <i className="bp-docs-logo" aria-hidden="true">B</i>
        <span className="bp-docs-url">getbootstrap.com</span>
        <span className="bp-docs-page">{pick(docs.page)}</span>
      </div>
      {docs.items.map((it) => {
        const on = !!(clip && clip.k === it.k);
        const lines = String(it.code).split('\n');
        const hl = cpHlLines(lines, true);
        return (
          <div key={it.k} className="bp-snip">
            <div className="bp-snip-h">
              <span>{pick(it.title)}</span>
              {it.copy === false ? null : (
                <button type="button" className={'bp-copy' + (on ? ' is-on' : '')} onClick={() => onCopy(it)} aria-label={pick(UI.copy)}>
                  {on ? <><Icon name="check" size={13} />{pick(UI.copied)}</> : <BpCopyIco />}
                </button>
              )}
            </div>
            {it.chips ? (
              <div className="bp-chips">{it.chips.map((c) => { const col = BP_DOT[c.replace(/^(theme|fg|bg)-/, '')]; return <span key={c} className="bp-chip">{col ? <i style={{ background: col }} /> : null}{c}</span>; })}</div>
            ) : (
              <div className="bp-snip-code">{lines.map((t, i) => <div key={i} className="bp-snip-ln">{hl[i] && hl[i].length ? hl[i] : CP_ZW}</div>)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
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
  const hl = cpHlLines(B.concat(lines, A), (i) => i < B.length || i >= B.length + lines.length);
  // Пустая строка заготовки (внутри head, внутри body) — сюда пишут; подпись исчезает с первой буквой.
  const holes = lines.map((ln, i) => !ln.trim() && lines.length > 2 && i > 0 && i < lines.length - 1);
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
          onPointerDown={(e) => { e.currentTarget.dataset.touched = '1'; e.currentTarget.dataset.auto = '0'; }}
          onKeyUp={(e) => { if (!/^(Shift|Control|Meta|Alt)$/.test(e.key)) { e.currentTarget.dataset.touched = '1'; e.currentTarget.dataset.auto = '0'; } }}
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
  const hl = cpHlLines(B.concat(tl, A), (i) => i < B.length || i >= B.length + tl.length);
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
  const ph = slot.role === 'cls' ? UI.phCls : slot.role === 'txt' ? UI.phTxt : UI.phVal;
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
  const hl = cpHlLines(lines, true);
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
const CP_SYMS = ['<', '>', '/', '=', '"'];
function CpKeys({ inputRef, onCheck, ready, syms, clip }) {
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
      {clip ? (
        <button type="button" className="key-b bp-paste" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { bpPaste(inputRef.current, clip.code); sfx('type', true); }}><BpCopyIco />{pick(UI.paste)}</button>
      ) : null}
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
// Ступень подсказки дополнительной задачи: 1 — общее направление, 2 — что нужно (drillNo), 3 — к образцу.
const cpDrillHint = (cfg, lv) => (lv <= 0 ? null : lv === 1 ? CP_DRILL.hint1 : lv === 2 ? (cfg.C.drillNo || CP_DRILL.hint1) : CP_DRILL.hint3);
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
    if (cur.drill && !cur.drill.done) {   // дополнительная задача — свои ступени
      const dl = cur.drill.lv || 0;
      if (dl < 3) row(put({ drill: Object.assign({}, cur.drill, { lv: dl + 1 }) }));
      return;
    }
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
    if (cur.drill && !cur.drill.done) {   // дополнительная задача: со второй неудачи подряд — следующая ступень сама
      const df = (cur.drill.fails || 0) + 1, dl = cur.drill.lv || 0;
      if (df >= CP_AUTO_HINT && dl < 3) {
        const h = cpDrillHint(cfg, dl + 1);
        const both = h === m ? m : joinL(m, h);   // разбор и ступень 2 — часто одна строка drillNo
        row(put({ drill: Object.assign({}, cur.drill, { fails: df, lv: dl + 1 }) }));
        setMsg(both); sayNow(both, 'think');
        return;
      }
      put({ drill: Object.assign({}, cur.drill, { fails: df }) });
      setMsg(m); sayNow(m, 'think');
      return;
    }
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
      if (/[<>"=]/.test(v)) return { ok: false, msg: spec.slot.role === 'txt' ? FB.slotTxt : FB.slotCls };
    }
    const full = bpFull(spec, st.code);
    const d0 = bpDiagnose(full, st.code);
    if (d0) return { ok: false, msg: d0, at: spec.slot ? null : cpLineAt(st.code, BP_DIAG.at) };
    const D = bpDocApi(frameRef.current, full);
    if (!D) return { ok: false, msg: FB.notYet };
    const g = spec.goal(D, st);
    if (g === true || g == null) return { ok: true, D };
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
// force — переключатель сразу (задание с примером с сайта или своя страница: на телефоне иначе не влезает).
function useViewToggle(num, workRef, lineSel, done, drilling, msg, lv, force) {
  const [many, setMany] = useState(!!force);
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
  const dlv = drilling ? (rec.drill.lv || 0) : 0;   // ступень подсказки дополнительной задачи
  const slot = spec.slot;
  const sv = slot ? String(st.v == null ? slot.v0 : st.v) : '';
  const empty = slot ? !sv.trim() : !String(st.code || '').trim();
  const led = useIdleLed(!rec.done, empty ? 0 : 1);
  const full = bpFull(spec, st.code);
  // Скопированное с сайта (BpDocs → «Qo'yish»): своё у задания и у дополнительной задачи.
  const [clip, setClip] = useState(null);
  const docs = spec.docs ? spec.docs(pick) : null;
  const onCopy = (it) => {
    setClip({ k: it.k, code: it.code });
    sfx('ok', true);
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(it.code).catch(() => {}); } catch (e) { /* буфер недоступен — есть «Qo'yish» */ }
  };
  const ask = rec.done ? cfg.C.ok : drilling ? fillL(L3('{a}: {b}', '{a}: {b}', '{a}: {b}'), { a: UI.drill, b: cfg.C.drill }) : cfg.C.ask;
  const hint = t.msg || (drilling ? cpDrillHint(cfg, dlv) : !rec.solved && lv > 0 ? cfg.C.hints[lv - 1] : null);
  const workRef = useRef(null);
  const vt = useViewToggle(cfg.num, workRef, '.cp-main .cp-ln', rec.done, drilling, t.msg, drilling ? dlv : lv, !!cfg.big || !!cfg.docs);
  const htmlAid = spec.htmlAid || cfg.htmlAid;
  // Условия «готово» своей работы — видны сразу и загораются по живой странице.
  const [marks, setMarks] = useState([]);
  useEffect(() => {
    if (!spec.list) return undefined;
    const tm = setTimeout(() => { const D = bpDocApi(frameRef.current, full); setMarks(spec.list.map((x) => { try { return !!(D && x.ok(D)); } catch (e) { return false; } })); }, 260);
    return () => clearTimeout(tm);
  }, [full]); // eslint-disable-line react-hooks/exhaustive-deps
  const qa = JSON.stringify({ a: cfg.answer, d: cfg.drill ? cfg.drill.answer : null, bad: cfg.bad || null,
    s: cfg.slot ? cfg.slot.ans : null, ds: cfg.drill && cfg.drill.slot ? cfg.drill.slot.ans : null });
  const setCode = drilling ? t.setDrillSt : t.setSt;
  // Без своего набора у задания — < > / = " (в рамке — знаки её ответа, например дефис).
  const syms = slot ? Array.from(new Set(slot.ans.replace(/[\w\s]/g, '').split(''))) : (spec.syms || cfg.syms || CP_SYMS);
  return (
    <StageB voiceTop eyebrow={cfg.C.eyebrow} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      hint={(drilling ? cpDrillHint(cfg, Math.min(3, dlv + 1)) : cfg.C.hints[Math.min(3, lv + 1) - 1]) || cfg.C.ask} nav={navOf(p, t.canGo)}>
      <Sheet cls={'cp-sheet cp-' + cfg.id + (cfg.big ? ' is-big' : '')}>
        <KzAsk text={ask} hint={rec.done ? null : hint} err={!!t.msg} />
        <ViewToggle vt={vt} />
        <div ref={workRef} className={'cp-work' + (cfg.big ? ' is-big' : '') + (htmlAid ? ' has-html' : '') + (docs && !rec.done ? ' has-docs' : '') + (spec.vw || cfg.vw ? ' has-phone' : '') + (vt.many ? ' has-vt is-v-' + vt.view : '')} data-qa={qa}>
          <div className="cp-side">
            <CpBrowser tabs={tabs} cur={cfg.num - 1} flash={t.flash}>
              <BpPage full={full} frameRef={frameRef} flash={t.flash} vw={spec.vw || cfg.vw} />
            </CpBrowser>
            {spec.list ? (
              <div className="cp-list">
                {spec.list.map((x, i) => (
                  <span key={i} className={'cp-li' + (marks[i] ? ' is-ok' : '')}><b>{marks[i] ? <Icon name="check" size={12} /> : i + 1}</b><span>{pick(x.t)}</span></span>
                ))}
              </div>
            ) : null}
            {htmlAid ? <CpHtml lines={htmlAid(pick)} /> : null}
            {docs && !rec.done ? <BpDocs docs={docs} clip={clip} onCopy={onCopy} /> : null}
          </div>
          <div className="cp-main">
            {slot ? (
              <CpSlotEditor key={drilling ? 'd' : 'm'} before={spec.pre || []} after={spec.post || []} slot={slot} value={sv}
                onChange={(v) => setCode({ v, code: slot.pre + v + slot.post })} inputRef={inRef} led={led || lv === 2 || dlv === 2} onEnter={t.check} />
            ) : (
              <CpEditor key={drilling ? 'd' : 'm'} before={spec.pre || []} after={spec.post || []} value={st.code} onChange={(code) => setCode({ code })}
                inputRef={inRef} led={led || lv === 2 || dlv === 2} single={!!spec.single} big={!!cfg.big} onEnter={t.check} mark={t.mark} />
            )}
            {((!rec.solved && lv >= 3) || (drilling && dlv >= 3)) && cfg.sample ? <CpSample lines={cfg.sample} /> : null}
            {!rec.done ? <CpKeys inputRef={inRef} onCheck={t.check} ready={!empty} syms={syms} clip={docs ? clip : null} /> : null}
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
// Документ целиком: готовые строки над кодом ученика (pre), его код, готовые строки под ним (post).
const bpFull = (spec, code) => (spec.pre || []).concat([String(code || '')], spec.post || []).join('\n');
// Задание: id t1…t5 и номер вкладки; init — начальный код; drill — та же форма (pre, post, docs — от задания,
// если у неё своих нет). C — тексты из C.tN.
function bpTask(n, o) {
  const id = 't' + n;
  const mk = (x) => {
    const slot = n <= 2 && !o.big && x.slot !== false ? cpSlotOf(x.code0, x.answer) : null;
    return Object.assign({ init: () => (slot ? { code: x.code0 || '', v: slot.v0 } : { code: x.code0 || '' }) }, x, { slot });
  };
  const inh = (x) => Object.assign({ pre: o.pre, post: o.post, docs: o.docs }, x);
  return Object.assign(mk(o), { id, num: n, C: C[id], kind: o.kind || 'write-html', drill: o.drill ? mk(inh(o.drill)) : null });
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
  const doc = PR.hook.doc(pick, !broke);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="cp-sheet cp-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className={'cp-work' + (PR.hook.vw ? ' has-phone' : '')}>
          <div className="cp-side">
            <CpBrowser tabs={tabs} cur={0} cls={boom ? 'cp-glitch' : ''}>
              <BpPage full={doc} vw={PR.hook.vw} />
            </CpBrowser>
          </div>
          <div className="cp-main">
            <CpCode lines={doc.split('\n')} cls={boom ? 'cp-glitch' : ''} />
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
  const own = store.get('myDoc') || PR.ownDefault(pick);
  const keys = Object.keys(c.roles);
  const COLS = ['#FA4F28', '#7C5CFA', '#0FA38E', '#F59E0B'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="cp-sheet cp-fin">
        <KzAsk text={c.ask} />
        <div className={'cp-work' + (PR.ownVw ? ' has-phone' : '')}>
          <div className="cp-side">
            <CpBrowser tabs={tabs} cur={4}><BpPage full={own} vw={PR.ownVw} /></CpBrowser>
            <div className="cp-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="cp-main">
            <CpCode lines={String(own).split('\n')} />
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
const SCREEN_RESET = { s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5', 'myDoc', 'myName'] };

// Артефакт — своя страница из задания 5: документ ученика целиком (head со строкой link, body со строкой script).
function practiceArtifact(store) {
  const doc = store.get('myDoc');
  if (!doc) return null;
  return { type: 'bootstrap-page', html: ['<!DOCTYPE html>', '<html>', String(doc), '</html>'].join('\n') };
}

export default function BootstrapPraktika({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
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
