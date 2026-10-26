// =============================================================================
// МЕХАНИКА ПРАКТИК 4 И 5 (копия механики практики 03p; добавлены атрибуты:
// ссылка a с href и картинка img с src и alt — честная страница, по ссылке можно
// перейти, картинка показывается, ломается или даёт текст alt; проверка
// атрибутов). Общая для 04p «Острова» и 05p «Выставка»: практика 05p подключает
// этот файл. Свои у каждой — карта (stopArt, STREET), страницы сайта (SITE_PAGES),
// фото-файлы (PHOTO_FILES), тексты. Каркас — практика 01p; вид — бумажный набор урока 1.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГИ ПРОИЗНОСЯТСЯ СЛОВАМИ. На экране точная запись (title, </body>), в озвучку
// теги уходят английскими словами («title», «закрывающий тег body»). Знаки в
// кавычках рядом со своим названием убирает бумажный набор (kollazh-kit).
// ─────────────────────────────────────────────────────────────────────────────
const TAG_SAY = {
  ru: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six', p: 'P', b: 'B', i: 'I', ul: 'U L', ol: 'O L', li: 'L I',
    a: 'A', href: 'H ref', img: 'I M G', src: 'S R C', alt: 'alt', dot: 'точка',
    close: 'закрывающий тег', lt: 'уголок', gt: 'уголок', slash: 'косая черта' },
  uz: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six', p: 'P', b: 'B', i: 'I', ul: 'U L', ol: 'O L', li: 'L I',
    a: 'A', href: 'H ref', img: 'I M G', src: 'S R C', alt: 'alt', dot: 'nuqta',
    close: 'yopuvchi teg', lt: 'chap qavs', gt: 'o‘ng qavs', slash: 'qiya chiziq' },
  en: { html: 'H T M L', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six', p: 'P', b: 'B', i: 'I', ul: 'U L', ol: 'O L', li: 'L I',
    a: 'A', href: 'H ref', img: 'I M G', src: 'S R C', alt: 'alt', dot: 'dot',
    close: 'closing tag', lt: 'less-than sign', gt: 'greater-than sign', slash: 'slash' }
};
function spokenHtml(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const word = (t) => m[String(t).toLowerCase()] || t;
  let s = String(text || '');
  // Знаки «=» и кавычки в речь не идут (рядом всегда слова «знак равно», «кавычки»);
  // файл cats.html — «cats точка HTML», cat.jpg — «cat точка J P G».
  s = s.replace(/[«“"]\s*=\s*[»”"]/g, ' ').replace(/"/g, ' ');
  const EXT = { html: 'html', jpg: 'J P G', png: 'P N G' };
  s = s.replace(/\b([A-Za-z_0-9]+)\.(html|jpg|png)\b/g, (all, n, e) => n + ' ' + m.dot + ' ' + EXT[e]);
  s = s.replace(/<!DOCTYPE\s+html>/gi, m.doctype + ' ' + m.html);
  s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => ' ' + m.close + ' ' + word(t) + ' ');
  s = s.replace(/<\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => ' ' + word(t) + ' ');
  s = s.replace(/\b(html|HTML|head|title|body|DOCTYPE|h[1-6])\b/g, (w) => word(w));
  // Одиночные латинские p, b, i — имена тегов (как в уроке 2): других в репликах нет.
  s = s.replace(/(^|[\s(«“"])([pbi])(?=[\s,.!?:;)»”"]|$)/g, (all, pre, t) => pre + word(t));
  // Голые ul, ol, li (урок 3) — тоже словами.
  s = s.replace(/(^|[^A-Za-z‘’'ʻʼ])(ul|ol|li|href|img|src)(?=[^A-Za-z‘’'ʻʼ]|$)/g, (all, pre, t) => pre + word(t));
  // Тег a: в узбекском и русском латинская «a» — только тег; в английском «a» —
  // артикль, тег узнаётся в «the a», «opening a», «closing a», «letter a».
  if (lang === 'en') s = s.replace(/\b(the|The|letter|opening|closing) a\b/g, '$1 ' + m.a);
  else s = s.replace(/(^|[^A-Za-z‘’'ʻʼ-])a(?=[^A-Za-z‘’'ʻʼ-]|$)/g, (all, pre) => pre + m.a);
  s = s.replace(/</g, ' ' + m.lt + ' ').replace(/>/g, ' ' + m.gt + ' ').replace(/\s\/\s/g, ' ' + m.slash + ' ');
  return s.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}
// Реплики в данных экрана — для прогрева озвучки. Подписи, которые только
// печатаются, пропускаем; шаблоны с подстановкой {…} — тоже.
const PRINTED = { eyebrow: 1, order: 1, order2: 1, drill2: 1, ask: 1, empty: 1, note: 1, skills: 1, drill: 1, pose: 1 };
function heroLines(node, lang, out) {
  const acc = out || [];
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((x) => heroLines(x, lang, acc)); return acc; }
  if (node.uz !== undefined || node.ru !== undefined) {
    const s = node[lang] !== undefined ? node[lang] : node.ru;
    if (typeof s === 'string' && s.indexOf('{') < 0) acc.push(s);
    return acc;
  }
  Object.keys(node).forEach((k) => { if (!PRINTED[k]) heroLines(node[k], lang, acc); });
  return acc;
}
function SpokenTags({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenHtml(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧАСТИ СТРАНИЦЫ — цвета как в уроке 1: html — коралл, head и title — горчица,
// body — бирюза. Цвет — только у полосок вложенности; смысл несёт форма
// (сплошная — закрыто, пунктир — нет), а теги в коде — коралловые уголки и
// имя чернилами, как на бумажках урока.
// ─────────────────────────────────────────────────────────────────────────────
const TAGC = { html: '#E0643F', head: '#D39A1E', title: '#D39A1E', body: '#2A8C7E',
  h1: '#E0643F', h2: '#E0643F', h3: '#E0643F', h4: '#E0643F', h5: '#E0643F', h6: '#E0643F', p: '#2A8C7E', b: '#D39A1E', i: '#D39A1E', ul: '#2A8C7E', ol: '#D39A1E', li: '#E0643F', a: '#2A8C7E', img: '#D39A1E' };
const HEADS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const KNOWN = ['html', 'head', 'title', 'body'].concat(HEADS, ['p', 'b', 'i', 'ul', 'ol', 'li', 'a', 'img']);
// Атрибуты наших тегов (уроки 4–5): у ссылки — href, у картинки — src и alt.
const ATTRS = { a: ['href'], img: ['src', 'alt'] };
const catOf = (tag) => (tag === 'html' ? 'html' : tag === 'head' || tag === 'title' ? 'head' : 'body');
const isHead = (t) => /^h[1-6]$/.test(t);
const isBlock = (t) => isHead(t) || t === 'p';
const isInline = (t) => t === 'b' || t === 'i' || t === 'a';
const isList = (t) => t === 'ul' || t === 'ol';

// Осмысленный текст: хотя бы две буквы любого алфавита.
const LETTER_RE = /\p{L}/gu;
const hasLetters = (s) => (String(s || '').match(LETTER_RE) || []).length >= 2;
// Похоже на тег: «<» с буквой, «/» или «!» после него, либо знакомый тег без «<».
const hasTags = (s) => /<\s*[A-Za-z\/!\\]/.test(String(s || '')) || /\b(html|head|title|body|h[1-6]|ul|ol|li|img)\s*>/i.test(String(s || ''));
const squash = (s) => String(s || '').replace(/\s+/g, ' ').trim();
// Сравнение заданных надписей: регистр, ё/е, кавычки и знаки по краям не важны.
const normName = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е')
  .replace(/[«»"“”„'‘’ʻʼ`.!?,:;…]/g, '').replace(/\s+/g, ' ').trim();
const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pickOf = (x, lang) => (x && typeof x === 'object' ? (x[lang] !== undefined ? x[lang] : x.ru) : String(x || ''));

// Расстояние между словами — чтобы узнать «titel» и подсказать title.
function editDist(a, b) {
  const m = a.length, n = b.length;
  const d = [];
  for (let i = 0; i <= m; i += 1) { d[i] = [i]; }
  for (let j = 0; j <= n; j += 1) { d[0][j] = j; }
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[m][n];
}
const nearTag = (name) => {
  const s = String(name || '').toLowerCase();
  let best = null;
  let bd = 3;
  KNOWN.forEach((k) => { const dd = editDist(s, k); if (dd < bd) { bd = dd; best = k; } });
  return s.length >= 2 && bd <= 2 ? best : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР КОДА. Код ученика НИКОГДА не исполняется и не вставляется как HTML:
// lexDoc только режет строку на теги и текст. Пробелы и переносы внутри и
// между тегами допустимы, регистр букв не важен.
//   { k: 'doctype' } · { k: 'open' | 'close', name } · { k: 'text', v } ·
//   { k: 'bad', bad: 'noGt' | 'noLt' | 'unknown' | 'slashEnd' | 'backslash' | 'junk' | 'emptyTag', name, raw }
// У каждого токена — номер строки (line), считая от нуля.
// ─────────────────────────────────────────────────────────────────────────────
// Атрибуты в открывающем теге, как их читает браузер: имя (строчными), значение,
// в кавычках ли оно, есть ли знак «=».
function parseAttrs(str) {
  const out = [];
  const re = /([^\s"'=<>\/]+)(\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(String(str || '')))) {
    out.push({ n: m[1].toLowerCase(), raw: m[1], eq: !!m[2], v: m[3] != null ? m[3] : m[4] != null ? m[4] : m[5] != null ? m[5] : '', q: m[3] != null || m[4] != null });
  }
  return out;
}
const attrOf = (t, n) => (t && t.attrs ? t.attrs.find((a) => a.n === n) : null);

function lexDoc(src) {
  const s = String(src || '');
  const out = [];
  let line = 0;
  const push = (tok, from, to) => {
    tok.line = line;
    out.push(tok);
    for (let k = from; k < to; k += 1) if (s.charCodeAt(k) === 10) line += 1;
  };
  // Текст без «<». Внутри ищем знакомый тег без открывающего уголка: «title>».
  const pushText = (from, to) => {
    const part = s.slice(from, to);
    const re = /(\/?)[ \t]*\b(html|head|title|body|h[1-6]|ul|ol|li)[ \t]*>/gi;
    let last = 0;
    let m;
    while ((m = re.exec(part))) {
      if (m.index > last) push({ k: 'text', v: part.slice(last, m.index) }, from + last, from + m.index);
      push({ k: 'bad', bad: 'noLt', name: m[2].toLowerCase(), raw: m[0] }, from + m.index, from + m.index + m[0].length);
      last = m.index + m[0].length;
    }
    if (last < part.length) push({ k: 'text', v: part.slice(last) }, from + last, to);
  };
  let i = 0;
  while (i < s.length) {
    // «<» без буквы, «/», «\» или «!» после него — просто текст («<3», «2 < 5»),
    // как и в настоящем браузере.
    if (s[i] === '<' && !/^<\s*[A-Za-z\/!\\]/.test(s.slice(i, i + 24))) {
      const j = s.indexOf('<', i + 1);
      const end = j < 0 ? s.length : j;
      pushText(i, end);
      i = end;
      continue;
    }
    if (s[i] !== '<') {
      const j = s.indexOf('<', i);
      const end = j < 0 ? s.length : j;
      pushText(i, end);
      i = end;
      continue;
    }
    // Конец тега — первый «>» вне кавычек (в значении атрибута «>» не считается).
    let gt = -1;
    let qq = null;
    for (let k = i + 1; k < s.length; k += 1) {
      const ch = s[k];
      if (qq) { if (ch === qq) qq = null; continue; }
      if ((ch === '"' || ch === "'") && /=\s*$/.test(s.slice(i + 1, k))) { qq = ch; continue; }
      if (ch === '>') { gt = k; break; }
      if (ch === '<') break;
    }
    if (qq) {
      // Кавычка открыта и не закрыта: браузер съедает всё до конца — тег не закончен.
      const nm0 = (/^<\s*\/?\s*([A-Za-z][A-Za-z0-9]*)/.exec(s.slice(i)) || ['', ''])[1].toLowerCase();
      push({ k: 'bad', bad: 'quote', name: nm0, raw: s.slice(i) }, i, s.length);
      i = s.length;
      continue;
    }
    if (gt < 0) {
      // «<title» без «>»: тег не закончен. Хвост дальше читается как текст.
      const m = /^<\s*[\/\\]?\s*!?[A-Za-z]*[A-Za-z0-9]*/.exec(s.slice(i));
      const raw = m ? m[0] : '<';
      const name = (/[A-Za-z][A-Za-z0-9]*/.exec(raw.replace(/^<\s*[\/\\]?\s*!?/, '')) || [''])[0].toLowerCase();
      push({ k: 'bad', bad: 'noGt', name, raw }, i, i + raw.length);
      i += raw.length;
      continue;
    }
    const inner = s.slice(i + 1, gt);
    const raw = s.slice(i, gt + 1);
    let tok;
    let m;
    if (/^\s*!/.test(inner)) tok = { k: 'doctype', raw };
    else if ((m = /^\s*(\/)?\s*([A-Za-z][A-Za-z0-9]*)\s*$/.exec(inner))) {
      const name = m[2].toLowerCase();
      tok = KNOWN.indexOf(name) >= 0 ? { k: m[1] ? 'close' : 'open', name, raw, attrs: [] }
        : { k: 'bad', bad: 'unknown', name, raw };
    } else if ((m = /^\s*img\s*\/\s*$/i.exec(inner))) {
      tok = { k: 'open', name: 'img', raw, attrs: [] };
    } else if ((m = /^\s*(\/)?\s*([A-Za-z][A-Za-z0-9]*)\s+([\s\S]*?)\s*(\/)?\s*$/.exec(inner)) && KNOWN.indexOf(m[2].toLowerCase()) >= 0) {
      // Тег с атрибутами: <a href="cats.html">, <img src="cat.jpg" alt="…">.
      tok = { k: m[1] ? 'close' : 'open', name: m[2].toLowerCase(), raw, attrs: parseAttrs(m[3]), attrStr: m[3] };
    } else if ((m = /^\s*\\\s*([A-Za-z][A-Za-z0-9]*)\s*$/.exec(inner))) {
      tok = { k: 'bad', bad: 'backslash', name: m[1].toLowerCase(), raw };
    } else if ((m = /^\s*([A-Za-z][A-Za-z0-9]*)\s*\/\s*$/.exec(inner))) {
      tok = { k: 'bad', bad: 'slashEnd', name: m[1].toLowerCase(), raw };
    } else if (/^\s*$/.test(inner)) tok = { k: 'bad', bad: 'emptyTag', name: '', raw };
    else {
      m = /^\s*\/?\s*([A-Za-z][A-Za-z0-9]*)/.exec(inner);
      tok = { k: 'bad', bad: 'junk', name: m ? m[1].toLowerCase() : '', raw };
    }
    push(tok, i, gt + 1);
    i = gt + 1;
  }
  return out;
}

// Фразы проверки атрибутов — общие для практик 4 и 5 (своё FB практики главнее).
const FB_ATTR = {
  quoteOpen: L3('{tag} tegida qo‘shtirnoq ochilgan, lekin yopilmagan: brauzer undan keyingi hamma narsani qiymat deb o‘ylaydi. Qiymatdan keyin ham qo‘shtirnoq qo‘ying.', 'В теге {tag} кавычка открыта, но не закрыта — браузер считает всё дальше значением. Поставь кавычку и после значения.', 'In the {tag} tag a quote is opened but not closed: the browser treats everything after it as the value. Put a quote after the value too.'),
  attrOnClose: L3('Atribut yopuvchi {tag} tegida turibdi, brauzer uni sezmaydi. Atributni ochuvchi tegga o‘tkazing.', 'Атрибут стоит в закрывающем теге {tag} — браузер его не замечает. Перенеси атрибут в открывающий тег.', 'The attribute is in the closing {tag} tag, and the browser ignores it. Move the attribute into the opening tag.'),
  imgClose: L3('img ning yopuvchi tegi bo‘lmaydi: u hech narsani o‘ramaydi. Yopuvchi img ni o‘chiring.', 'У img не бывает закрывающего тега — он ничего не оборачивает. Сотри закрывающий img.', 'img has no closing tag: it doesn’t wrap anything. Erase the closing img.'),
  hrefOnImg: L3('href havolalar uchun. Rasm faylining manzili src atributida yoziladi.', 'href — для ссылок. Адрес файла картинки пишут в атрибуте src.', 'href is for links. A picture’s file address goes in the src attribute.'),
  srcOnA: L3('Havolada manzil href atributida yoziladi, {raw} da emas.', 'У ссылки адрес пишут в атрибуте href, а не в {raw}.', 'A link’s address goes in the href attribute, not in {raw}.'),
  attrName: L3('Atribut nomini tekshiring: {raw} emas, {want}.', 'Проверь имя атрибута: не {raw}, а {want}.', 'Check the attribute name: not {raw}, but {want}.'),
  attrUnknown: L3('{tag} tegida {raw} atributi kerak emas.', 'У тега {tag} атрибут {raw} не нужен.', 'The {tag} tag doesn’t need the {raw} attribute.'),
  attrNoEq: L3('{name} dan keyin tenglik belgisi «=» va qo‘shtirnoq ichida qiymat kerak.', 'После {name} нужен знак равно «=» и значение в кавычках.', 'After {name} you need an equals sign “=” and a value in quotes.'),
  attrNoQuotes: L3('Brauzer tushundi, lekin {name} qiymati qo‘shtirnoq ichida yoziladi: qiymatdan oldin ham, keyin ham.', 'Браузер понял, но значение {name} пишут в кавычках — и перед ним, и после.', 'The browser understood, but the {name} value goes in quotes, before and after it.'),
  aInA: L3('Oldingi havola yopilmagan: yangi a dan oldin yopuvchi a tegi kerak.', 'Предыдущая ссылка не закрыта: перед новым a нужен закрывающий тег a.', 'The previous link isn’t closed: put the closing a tag before the next opening a.')
};
Object.keys(FB_ATTR).forEach((k) => { if (!FB[k]) FB[k] = FB_ATTR[k]; });

const fb = (key, vars, cat) => ({ ok: false, msg: vars ? fillL(FB[key] || key, vars) : (FB[key] || key), cat: cat || 'tag' });
const fbT = (node, vars, cat) => ({ ok: false, msg: vars ? fillL(node, vars) : node, cat: cat || 'tag' });

// Неверно записанный тег — своя фраза для каждого случая.
function badFb(t) {
  const nm = t.name || '';
  const cat = KNOWN.indexOf(nm) >= 0 ? catOf(nm) : (nearTag(nm) ? catOf(nearTag(nm)) : 'tag');
  const r = (o) => Object.assign(o, { line: t.line });
  if (t.bad === 'quote') return r(fb('quoteOpen', { tag: nm || 'a' }, cat));
  if (t.bad === 'noGt') return r(fb('noGt', { tag: KNOWN.indexOf(nm) >= 0 ? nm : (t.raw || '<') }, cat));
  if (t.bad === 'noLt') return r(fb('noLt', { tag: nm }, cat));
  if (t.bad === 'slashEnd') return r(fb('slashEnd', { tag: KNOWN.indexOf(nm) >= 0 ? nm : (nearTag(nm) || nm) }, cat));
  if (t.bad === 'backslash') return r(fb('backslash', null, cat));
  if (t.bad === 'emptyTag') return r(fb('emptyTag', null, 'tag'));
  if (t.bad === 'junk') return r(fb('junk', null, cat));
  const near = nearTag(nm);
  return r(near ? fb('unknown', { raw: t.raw, tag: near }, catOf(near)) : fb('unknownFar', { raw: t.raw }, 'tag'));
}

// Полоски вложенности: какой контейнер на каких строках и закрыт ли он.
// Незакрытый тянется до места, где его закрыли бы, или до конца кода.
// title — строчный, полоска ему не нужна.
function regionsOf(src) {
  const toks = lexDoc(src);
  const last = String(src || '').split('\n').length - 1;
  const stack = [];
  const regs = [];
  toks.forEach((t) => {
    if (t.k === 'open' && t.name !== 'title' && t.name !== 'img' && t.name !== 'a') stack.push({ tag: t.name, from: t.line, depth: stack.length });
    else if (t.k === 'close' && t.name !== 'title' && t.name !== 'img' && t.name !== 'a') {
      let at = -1;
      for (let k = stack.length - 1; k >= 0; k -= 1) if (stack[k].tag === t.name) { at = k; break; }
      if (at < 0) return;
      for (let k = stack.length - 1; k > at; k -= 1) regs.push(Object.assign({}, stack[k], { to: t.line - 1, closed: false }));
      regs.push(Object.assign({}, stack[at], { to: t.line, closed: true }));
      stack.length = at;
    }
  });
  stack.forEach((r) => regs.push(Object.assign({}, r, { to: last, closed: false })));
  return regs;
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОДСВЕТКА КОДА — как теги на бумажках урока 1: уголки и косая черта
// коралловые, имя чернилами. Начертание одно для всех кусочков: подсветка
// лежит под прозрачной textarea и обязана совпадать с ней буква в букву.
// ─────────────────────────────────────────────────────────────────────────────
// Атрибуты внутри тега: имя бирюзовое, «=» коралловый, значение горчично-коричневое.
// Каждый символ строки остаётся на месте — подсветка совпадает с полем ввода.
function hlAttrs(str, key) {
  const out = [];
  const re = /([^\s"'=]+)(?:(\s*=\s*)("[^"]*"?|'[^']*'?|[^\s"']+)?)?|(\s+)|(.)/g;
  let m;
  let k = 0;
  while ((m = re.exec(str))) {
    k += 1;
    if (m[4] || m[5]) { out.push(<span key={key + 's' + k} className="ed-t">{m[0]}</span>); continue; }
    out.push(<span key={key + 'n' + k} className="ed-an">{m[1]}</span>);
    if (m[2]) out.push(<span key={key + 'e' + k} className="ed-eq">{m[2]}</span>);
    if (m[3]) out.push(<span key={key + 'v' + k} className="ed-av">{m[3]}</span>);
  }
  return out;
}
function hlLine(str) {
  const re = /<!DOCTYPE\s+html\s*>|<\s*[\/\\]?\s*[A-Za-z][A-Za-z0-9]*(?:\s+(?:[^<>"']|"[^"]*"|'[^']*')*)?\s*\/?\s*>/gi;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(<span key={'t' + last} className="ed-t">{str.slice(last, m.index)}</span>);
    const raw = m[0];
    const nm = ((/[A-Za-z][A-Za-z0-9]*/.exec(raw.replace(/^<\s*[\/\\]?\s*/, '')) || [''])[0]).toLowerCase();
    if (/^<!/.test(raw)) out.push(<span key={'g' + m.index} className="ed-doc">{raw}</span>);
    else if (KNOWN.indexOf(nm) >= 0 && /^<\s*\/?\s*[A-Za-z][A-Za-z0-9]*\s*>$/.test(raw)) {
      const mm = /^(<\s*\/?\s*)([A-Za-z][A-Za-z0-9]*)(\s*>)$/.exec(raw);
      out.push(<span key={'g' + m.index} className="ed-tag"><span className="ed-br">{mm[1]}</span><span className="ed-nm">{mm[2]}</span><span className="ed-br">{mm[3]}</span></span>);
    } else if (KNOWN.indexOf(nm) >= 0 && /^<\s*\/?\s*[A-Za-z][A-Za-z0-9]*\s+[\s\S]*>$/.test(raw)) {
      // Тег с атрибутами: «<a» + атрибуты + «>».
      const mm = /^(<\s*\/?\s*)([A-Za-z][A-Za-z0-9]*)(\s+[\s\S]*?)(\s*\/?\s*>)$/.exec(raw);
      out.push(<span key={'g' + m.index} className="ed-tag"><span className="ed-br">{mm[1]}</span><span className="ed-nm">{mm[2]}</span>{hlAttrs(mm[3], 'a' + m.index)}<span className="ed-br">{mm[4]}</span></span>);
    } else out.push(<span key={'g' + m.index} className="ed-unk">{raw}</span>);
    last = m.index + raw.length;
  }
  if (last < str.length) out.push(<span key={'t' + last} className="ed-t">{str.slice(last)}</span>);
  return out;
}

// Вставка символа с кнопки < / > в место курсора. execCommand сохраняет
// отмену (Ctrl+Z) и шлёт обычное событие ввода; запасной путь — setRangeText.
function insertAtCaret(el, ch) {
  if (!el) return;
  if (document.activeElement !== el) el.focus();
  let done = false;
  try { done = !!(document.execCommand && document.execCommand('insertText', false, ch)); } catch (e) { done = false; }
  if (done) return;
  const a = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
  const b = typeof el.selectionEnd === 'number' ? el.selectionEnd : a;
  if (el.setRangeText) el.setRangeText(ch, a, b, 'end');
  else {
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, el.value.slice(0, a) + ch + el.value.slice(b));
    el.setSelectionRange(a + ch.length, a + ch.length);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

const MAX_CODE = 1500;

// Бумажная подложка: вырезка с рваным краем под содержимым (редактор, заметка,
// образец). Сам край не обрезает текст — он лежит слоем ниже.
function Pad({ c, seed = 7, cls, children, style }) {
  return (
    <div className={'pp-pad kz-piece' + (cls ? ' ' + cls : '')} style={style}>
      <Cut c={c || '#FFFCF4'} seed={seed} n={18} amp={0.9} asp={1.4} cls="pp-pad-bg" />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// РЕДАКТОР КОДА. Прозрачная textarea лежит поверх подсвеченных строк той же
// ширины, шрифта и отступов: всё, что умеет обычное поле (курсор, выделение,
// удаление, переносы, вставка, отмена), работает как есть. Строки до и после
// — неизменяемая рамка задания. single — одна строка: Enter не переносит.
// regions — полоски вложенности; markLine — строка, на которую указывает подсказка.
// ─────────────────────────────────────────────────────────────────────────────
function CodeEditor({ value, onChange, before, after, single, ind, regions, markLine, inputRef, label, led }) {
  const pick = usePick();
  const boxRef = useRef(null);
  const lines = String(value || '').split('\n');
  const nB = (before || []).length;
  // Рамка задания длиннее окна (телефон) — показываем место для ввода сразу.
  useLayoutEffect(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.ed-edit');
    if (box && ed && box.scrollHeight > box.clientHeight + 4) box.scrollTop = Math.max(0, ed.offsetTop - 28);
  }, []);
  // Открылась клавиатура — редактор стал ниже: строка ввода не должна уехать
  // за край. Для документа целиком браузер сам держит курсор на виду.
  const reveal = useCallback(() => {
    const box = boxRef.current;
    const ed = box && box.querySelector('.ed-edit');
    if (!box || !ed || !nB) return;
    const top = ed.offsetTop, bot = top + ed.offsetHeight;
    if (top < box.scrollTop + 4 || bot > box.scrollTop + box.clientHeight - 4) box.scrollTop = Math.max(0, Math.min(top - 8, bot - box.clientHeight + 8));
  }, [nB]);
  useEffect(() => {
    const vv = typeof window !== 'undefined' && window.visualViewport;
    const on = () => { if (inputRef && inputRef.current && document.activeElement === inputRef.current) setTimeout(reveal, 60); };
    if (vv) vv.addEventListener('resize', on);
    window.addEventListener('resize', on);
    return () => { if (vv) vv.removeEventListener('resize', on); window.removeEventListener('resize', on); };
  }, [reveal]); // eslint-disable-line react-hooks/exhaustive-deps
  const barsAt = (i) => (regions ? regions.filter((r) => r.from <= i && i <= r.to) : []);
  const bars = (i) => barsAt(i).map((r, k) => (
    <span key={k} aria-hidden="true"
      className={'ed-bar' + (r.closed ? '' : ' is-open') + (r.from === i ? ' is-first' : '') + (r.to === i ? ' is-last' : '')}
      style={{ '--c': TAGC[r.tag], '--lv': r.depth }} />
  ));
  const staticLine = (txt, i, key) => (
    <div className={'ed-line is-static' + (markLine === i ? ' is-mark' : '')} key={key}>
      <span className="ed-n" aria-hidden="true">{i + 1}</span>
      {bars(i)}
      {txt ? hlLine(txt) : '​'}
    </div>
  );
  const change = (e) => {
    let v = e.target.value;
    if (single) v = v.replace(/\r?\n/g, ' ');
    onChange(v.slice(0, MAX_CODE));
  };
  return (
    <div ref={boxRef} className="ed" translate="no" style={{ '--edi': (ind || 0) + 'ch' }}>
      {(before || []).map((t, i) => staticLine(t, i, 'b' + i))}
      <div className={'ed-edit' + (single ? ' is-single' : '') + (nB || (after && after.length) ? ' is-framed' : '') + (led ? ' is-led-in' : '')}>
        <div className="ed-hl" aria-hidden="true">
          {lines.map((ln, i) => (
            <div key={i} className={'ed-line' + (markLine === nB + i ? ' is-mark' : '')}>
              <span className="ed-n">{nB + i + 1}</span>
              {bars(nB + i)}
              {ln ? hlLine(ln) : '​'}
            </div>
          ))}
        </div>
        <textarea ref={inputRef} className="ed-ta" value={value} onChange={change} rows={1} wrap="soft"
          onFocus={() => { setTimeout(reveal, 80); setTimeout(reveal, 420); }}
          onKeyDown={(e) => { if (single && e.key === 'Enter') e.preventDefault(); }}
          spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
          enterKeyHint={single ? 'done' : 'enter'} aria-label={pick(label || UI.editor)} />
      </div>
      {(after || []).map((t, i) => staticLine(t, nB + lines.length + i, 'a' + i))}
    </div>
  );
}

// Поле прямо в строке кода. Растёт по тексту: сначала в ширину, упёрлось в
// край строки — переносит текст и растёт в высоту. 16 px — меньше нельзя:
// iOS увеличит страницу. Enter строку не переносит.
let _growCtx = null;
function fitGrow(el) {
  if (!el) return;
  const cs = getComputedStyle(el);
  if (!_growCtx) _growCtx = document.createElement('canvas').getContext('2d');
  if (_growCtx) {
    _growCtx.font = cs.font || (cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily);
    const txt = el.value || el.placeholder || '';
    const w = Math.ceil(_growCtx.measureText(txt).width) + parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0) + 10;
    el.style.width = w + 'px';
  }
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
function InlineInput({ value, onChange, placeholder, label, max = 60, inputRef, cls }) {
  const pick = usePick();
  const ref = useRef(null);
  const setRef = (el) => { ref.current = el; if (inputRef) inputRef.current = el; };
  const fit = () => fitGrow(ref.current);
  useLayoutEffect(fit, [value]);
  useEffect(() => {
    const host = ref.current && ref.current.parentElement;
    if (typeof ResizeObserver === 'undefined' || !host) {
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
    const ro = new ResizeObserver(() => fit());
    ro.observe(host);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <textarea ref={setRef} rows={1} className={'tk-input' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onChange={(e) => onChange(e.target.value.replace(/\r?\n/g, ' '))}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ДОКУМЕНТ С ПОЛЯМИ (t1, t2). Документ собран правильно; ученик пишет только
// содержимое title или body — прямо в строке кода. Полоски слева — вложенность;
// hl подсвечивает часть по подсказке, led — поле, куда писать.
// ─────────────────────────────────────────────────────────────────────────────
function FieldDoc({ title, body, onTitle, onBody, editTitle = true, editBody = true, hl, led, titleRef, bodyRef, focusBody, ph }) {
  const pick = usePick();
  const boxRef = useRef(null);
  useLayoutEffect(() => {
    const box = boxRef.current;
    const row = box && box.children[6];
    if (focusBody && row && box.scrollHeight > box.clientHeight + 4) box.scrollTop = Math.max(0, row.offsetTop - box.clientHeight / 2);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const field = (val, on, ref, lbl, which) => (
    <InlineInput value={val} onChange={on} label={lbl} inputRef={ref} placeholder={ph && ph[which]}
      cls={led === which ? 'is-led-in' : ''} max={which === 'body' ? 140 : 40} />
  );
  const rows = [
    { d: 0, reg: [], c: <span className="pp-doc">{'<!DOCTYPE html>'}</span> },
    { d: 0, reg: ['html'], first: 'html', c: T_('html') },
    { d: 1, reg: ['html', 'head'], first: 'head', c: T_('head') },
    { d: 2, reg: ['html', 'head', 'title'], c: <>{T_('title')}{editTitle ? field(title, onTitle, titleRef, UI.titleField, 'title') : <span className="pp-text">{title}</span>}{T_('title', true)}</> },
    { d: 1, reg: ['html', 'head'], last: 'head', c: T_('head', true) },
    { d: 1, reg: ['html', 'body'], first: 'body', c: T_('body') },
    { d: 2, reg: ['html', 'body'], c: editBody ? field(body, onBody, bodyRef, UI.bodyField, 'body') : <span className="pp-text">{body}</span> },
    { d: 1, reg: ['html', 'body'], last: 'body', c: T_('body', true) },
    { d: 0, reg: ['html'], last: 'html', c: T_('html', true) }
  ];
  return (
    <div ref={boxRef} className="cv" translate="no" aria-label={pick(UI.editor)} role="group">
      {rows.map((r, i) => {
        const inHl = hl && r.reg.indexOf(hl) >= 0;
        return (
          <div key={i} className={'cv-line' + (hl ? (inHl ? ' is-in' : ' is-out') : '')} style={{ '--d': r.d }}>
            <span className="cv-n" aria-hidden="true">{i + 1}</span>
            {r.reg.filter((g) => g !== 'title').map((g) => (
              <span key={g} aria-hidden="true" className={'cv-bar' + (r.first === g ? ' is-first' : '') + (r.last === g ? ' is-last' : '')}
                style={{ '--c': TAGC[g], '--lv': g === 'html' ? 0 : 1 }} />
            ))}
            <span className="cv-code">{r.c}</span>
          </div>
        );
      })}
    </div>
  );
}

// Статичный кусок кода: образец подсказки, код готовой страницы.
function CodeSample({ code, label, cls }) {
  const pick = usePick();
  return (
    <div className={'sample' + (cls ? ' ' + cls : '')} translate="no">
      {label ? <span className="sample-lbl">{pick(label)}</span> : null}
      <div className="sample-code">
        {String(code).split('\n').map((ln, i) => <div key={i} className="sample-line">{ln ? hlLine(ln) : '​'}</div>)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧТО ПОКАЖЕТ БРАУЗЕР (уроки 2–3) — честно, как настоящий, для наших тегов:
//   · title — на вкладку (незакрытый уносит на вкладку остальной код);
//   · h1–h6 и p — блоки; p внутри незакрытого заголовка — шрифтом заголовка;
//   · b и i — жирный и курсив; незакрытый b / i тянется дальше;
//   · ul / ol — список; точку или номер ставит только li; текст в списке без
//     li — без точки; <li> вместо </li> даёт пустой пункт; li вне списка — без
//     отступа; p в незакрытом списке сдвинут, как список;
//   · текст без тегов — отдельной строкой в окне.
// Возвращает { title, blocks } — только текст. Блок: { t: 'h1'…'h6' | 'p' | 'raw'
// | 'stray', parts } или { t: 'ul' | 'ol', kids: [{ li, parts } | { txt: parts } | { p: parts }] }.
// ─────────────────────────────────────────────────────────────────────────────
function renderDoc(src) {
  const toks = lexDoc(src);
  let title = null;
  let inTitle = false;
  let tt = '';
  const blocks = [];
  let cur = null;        // куда идёт текст: блок, пункт или кусок текста в списке
  let list = null;       // открытый список
  const fmt = { b: 0, i: 0 };
  let openHead = null;
  // Ссылка: href открытого a (строка) — слова синие и ведут туда; a без href — обычный
  // текст. Незакрытый a тянется дальше, как в настоящем браузере.
  let link;
  const part = (v) => ({ s: v, b: fmt.b > 0, i: fmt.i > 0, href: link });
  const open = (t, inh) => { cur = { t, inh: inh || null, parts: [] }; blocks.push(cur); };
  const text = (v) => {
    if (cur) { cur.parts.push(part(v)); return; }
    if (!v.trim()) return;
    if (list) { cur = { txt: true, parts: [part(v)] }; list.kids.push(cur); return; }
    open('raw'); cur.parts.push(part(v));
  };
  toks.forEach((t) => {
    if (inTitle) {
      if (t.k === 'close' && t.name === 'title') { inTitle = false; title = squash(tt); return; }
      tt += t.k === 'text' ? t.v : ' ' + (t.raw || '') + ' ';
      return;
    }
    if (t.k === 'open' && t.name === 'title') { inTitle = true; tt = ''; return; }
    if (t.k === 'text') { text(t.v); return; }
    if (t.k === 'bad') { if (t.bad === 'noLt' || t.bad === 'backslash' || t.bad === 'emptyTag') text(t.raw); return; }
    if (t.k === 'open' && t.name === 'a') { const h = attrOf(t, 'href'); link = h ? h.v.trim() : undefined; return; }
    if (t.k === 'close' && (t.name === 'a' || t.name === 'img')) { if (t.name === 'a') link = undefined; return; }
    if (t.k === 'open' && t.name === 'img') {
      // Картинка — кусок строки: файл есть — фото; нет src — пусто (или текст alt);
      // файла нет — значок сломанной картинки и alt.
      const sa = attrOf(t, 'src'), aa = attrOf(t, 'alt');
      const ip = { img: { src: sa ? sa.v.trim() : undefined, alt: aa ? aa.v : undefined }, href: link, s: '' };
      if (cur) { cur.parts.push(ip); return; }
      if (list) { cur = { txt: true, parts: [ip] }; list.kids.push(cur); return; }
      open('raw'); cur.parts.push(ip);
      return;
    }
    if (t.k === 'open') {
      if (isList(t.name)) { list = { t: t.name, kids: [] }; blocks.push(list); cur = null; openHead = null; return; }
      if (t.name === 'li') {
        if (list) { cur = { li: true, parts: [] }; list.kids.push(cur); }
        else open('stray');
        return;
      }
      if (isHead(t.name) || t.name === 'p') {
        if (list) { cur = { p: true, t: t.name, parts: [] }; list.kids.push(cur); return; }
        if (isHead(t.name)) { open(t.name); openHead = t.name; return; }
        open('p', openHead); return;
      }
      if (isInline(t.name)) { fmt[t.name] += 1; return; }
      return;
    }
    if (t.k === 'close') {
      if (isInline(t.name)) { fmt[t.name] = Math.max(0, fmt[t.name] - 1); return; }
      if (isList(t.name)) { if (list) { list = null; cur = null; } return; }
      if (t.name === 'li') { if (cur && (cur.li || cur.t === 'stray')) cur = null; return; }
      if (isHead(t.name)) openHead = null;
      if ((isBlock(t.name)) && cur) { cur = null; }
      if (cur && cur.txt) cur = null;
    }
  });
  if (inTitle) title = squash(tt);
  const has = (ps) => ps.some((x) => x.img || String(x.s || '').trim());
  return {
    title,
    blocks: blocks.filter((bk) => (bk.kids ? true : has(bk.parts)))
      .map((bk) => (bk.kids ? Object.assign({}, bk, { kids: bk.kids.filter((k) => k.li || has(k.parts)) }) : bk))
  };
}

// ПРОВЕРКА ФРАГМЕНТА (теги уроков 2–3). Обход по порядку записи; первая проблема —
// фраза, всего проблем — для счётчика «осталось исправить» (по строкам с поломкой).
//   · блоки h1–h6 и p стоят друг за другом; b и i — внутри блока или пункта;
//   · список ul / ol, внутри только пункты li; пары совпадают;
//   · strictText — текст вне блоков и списков тоже проблема (своя работа).
// lists: [{ t, items: [{ text, marks }], line }], blocks: [{ t, text, marks }].
// Атрибуты ссылки и картинки: имя знакомое (у a — href, у img — src и alt), есть
// знак «=», значение в кавычках (браузер поймёт и без них — пишем в кавычках).
function attrIssues(t) {
  const ok = ATTRS[t.name] || [];
  const out = [];
  (t.attrs || []).forEach((a) => {
    if (ok.indexOf(a.n) < 0) {
      if (t.name === 'img' && a.n === 'href') out.push({ key: 'hrefOnImg' });
      else if (t.name === 'a' && (a.n === 'src' || a.n === 'alt')) out.push({ key: 'srcOnA', vars: { raw: a.raw } });
      else {
        const near = a.n.length >= 2 ? ok.find((w) => editDist(a.n, w) <= 2) : null;
        out.push(near ? { key: 'attrName', vars: { raw: a.raw, want: near } } : { key: 'attrUnknown', vars: { raw: a.raw, tag: t.name } });
      }
      return;
    }
    if (!a.eq) { out.push({ key: 'attrNoEq', vars: { name: a.n } }); return; }
    if (!a.q) out.push({ key: 'attrNoQuotes', vars: { name: a.n } });
  });
  return out;
}

function checkFrag(code, opts) {
  const o = opts || {};
  const toks = lexDoc(code);
  const issues = [];
  const add = (key, vars, line) => issues.push({ key, vars: vars || null, line });
  const stack = [];
  const blocks = [];
  const lists = [];
  const strays = [];
  const links = [];      // ссылки: { href, text, line, inLi }
  const imgs = [];       // картинки: { src, alt, line, inLi }
  let link = null;
  let cur = null;
  let list = null;
  const bare = (idx) => {
    for (let k = idx + 1; k < toks.length; k += 1) {
      if (toks[k].k !== 'text') return true;
      if (hasLetters(toks[k].v)) return false;
    }
    return true;
  };
  const top = () => stack[stack.length - 1];
  // Строка текста — там, где его первая буква (кусок может начинаться с переноса).
  const textLine = (t) => t.line + (String(t.v).slice(0, String(t.v).search(/\S|$/)).match(/\n/g) || []).length;
  toks.forEach((t, idx) => {
    if (t.k === 'bad') { issues.push(Object.assign(badFb(t), { line: t.line, bad: true })); return; }
    if ((t.k === 'open' || t.k === 'close') && (t.name === 'a' || t.name === 'img')) {
      if (t.k === 'close' && t.attrs && t.attrs.length) add('attrOnClose', { tag: t.name }, t.line);
      if (t.k === 'close' && t.name === 'img') { add('imgClose', null, t.line); return; }
      if (t.k === 'open') {
        attrIssues(t).forEach((x) => add(x.key, x.vars, t.line));
        // Ссылка или картинка прямо в body — строчка страницы (как в настоящем браузере).
        if (!cur && !isList(top())) { cur = { t: 'line', text: '', marks: [], line: t.line }; blocks.push(cur); }
        else if (!cur) add('listText', { tag: top() }, t.line);
        const inLi = top() === 'li';
        if (t.name === 'img') {
          const sa = attrOf(t, 'src'), aa = attrOf(t, 'alt');
          imgs.push({ src: sa ? sa.v.trim() : undefined, alt: aa ? aa.v : undefined, line: t.line, inLi });
          return;
        }
        if (top() === 'a') add('aInA', null, t.line);
        const h = attrOf(t, 'href');
        link = { href: h ? h.v.trim() : undefined, text: '', line: t.line, inLi };
        links.push(link);
        stack.push('a');
        return;
      }
      link = null;
    }
    if (t.k === 'doctype' || ((t.k === 'open' || t.k === 'close') && !isBlock(t.name) && !isInline(t.name) && !isList(t.name) && t.name !== 'li')) return;
    if (t.k === 'text') {
      if (link) link.text += t.v;
      if (cur) {
        cur.text += t.v;
        stack.filter(isInline).forEach((x) => { cur.marks.push({ tag: x, v: t.v }); });
      } else if (hasLetters(t.v)) {
        if (isList(top())) add('listText', { tag: top() }, textLine(t));
        else if (o.strictText) add('textOutside', null, textLine(t));
      }
      return;
    }
    if (t.k === 'open') {
      if (isList(t.name)) {
        if (cur && !(cur.t === 'line' && !stack.length) && !stack.some(isList)) { add('blockInBlock', { tag: stack.find(isBlock) || top(), next: t.name }, t.line); stack.length = 0; cur = null; }
        if (cur && cur.t === 'line') cur = null;
        stack.push(t.name);
        list = { t: t.name, items: [], line: t.line };
        lists.push(list);
        return;
      }
      if (t.name === 'li') {
        if (top() === 'li') {
          if (bare(idx)) { add('openAgain', { tag: 'li' }, t.line); stack.pop(); cur = null; return; }
          add('unclosedIn', { tag: 'li', next: 'li' }, t.line); stack.pop();
        }
        cur = { text: '', marks: [], line: t.line };
        if (isList(top())) list.items.push(cur);
        else { add('liOutside', null, t.line); strays.push(cur); }
        stack.push('li');
        return;
      }
      if (isBlock(t.name)) {
        if (isList(top())) { add('listNotClosed', { tag: top(), next: t.name }, t.line); stack.length = 0; list = null; }
        else if (top() === t.name && stack.length === 1 && bare(idx)) { add('openAgain', { tag: t.name }, t.line); stack.length = 0; cur = null; return; }
        else if (stack.length) add('blockInBlock', { tag: stack.find(isBlock) || top(), next: t.name }, t.line);
        stack.length = 0;
        cur = { t: t.name, text: '', marks: [], line: t.line };
        blocks.push(cur);
        stack.push(t.name);
        return;
      }
      if (!cur) add('inlineOutside', { tag: t.name }, t.line);
      stack.push(t.name);
      return;
    }
    const tp = top();
    if (tp === t.name) {
      stack.pop();
      if (isBlock(t.name) || t.name === 'li') cur = null;
      if (isList(t.name)) { list = null; cur = null; }
      return;
    }
    if ((tp && isHead(tp) && isHead(t.name)) || (isList(tp) && isList(t.name))) { add('pairMismatch', { a: tp, b: t.name }, t.line); stack.pop(); cur = null; if (isList(tp)) list = null; return; }
    const at = stack.lastIndexOf(t.name);
    if (at >= 0) {
      for (let k = stack.length - 1; k > at; k -= 1) add('unclosedIn', { tag: stack[k], next: t.name }, t.line);
      stack.length = at;
      if (isBlock(t.name) || isList(t.name) || t.name === 'li') cur = null;
      if (isList(t.name)) list = null;
      return;
    }
    add('closeWithoutOpen', { tag: t.name }, t.line);
  });
  for (let k = stack.length - 1; k >= 0; k -= 1) add('unclosedEnd', { tag: stack[k] }, null);
  const first = issues[0];
  const msg = first ? (first.bad ? first.msg : fillL(FB[first.key], first.vars || {})) : null;
  const lines = {};
  issues.forEach((x, k) => { lines[x.line == null ? 'n' + k : x.line] = 1; });
  return { ok: !issues.length, msg, line: first ? first.line : null, count: Object.keys(lines).length, blocks, lists, strays, links, imgs };
}

// Страница всегда помещается в окно целиком, без прокрутки (правило эталона):
// не влезает — шрифт страницы ступеньками уменьшается (не меньше 56 %). Ещё раз —
// после «штампа» (пока он идёт, страница кажется выше).
function useFitPage(dep) {
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
    const tm = setTimeout(fit, 700);
    if (typeof ResizeObserver === 'undefined') return () => clearTimeout(tm);
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => { clearTimeout(tm); ro.disconnect(); };
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// Бумажное фото из файла (практика 5): рваная вырезка с фоном и рисунком.
// PHOTO_FILES — файлы практики: { 'cat.jpg': { pic, bg, seed } }.
function PgPhoto({ file }) {
  const ph = PHOTO_FILES[file];
  if (!ph) return null;
  return (
    <span className="pg-photo" data-file={file}>
      <Cut c={ph.bg} seed={ph.seed} n={9} amp={3} asp={1.35} cls="pg-photo-cut" />
      <span className={'pg-pic pg-pic-' + ph.pic} aria-hidden="true"><i /><i /><i /></span>
    </span>
  );
}
// Картинка, как её рисует браузер: файл есть — фото; src нет — пусто (с alt —
// только текст alt); файла нет — значок сломанной картинки и alt.
function PgImg({ src, alt }) {
  const has = typeof src === 'string' && src !== '';
  if (has && PHOTO_FILES[src]) return <PgPhoto file={src} />;
  if (!has) return alt ? <span className="pg-alt">{alt}</span> : <span className="pg-noimg" />;
  return <span className="pg-broken" data-src={src}><i className="pg-broken-ic" aria-hidden="true" />{alt ? <span>{alt}</span> : null}</span>;
}
// Кусочки текста с b и i, ссылки (href — синие, нажимаются) и картинки.
const pgParts = (parts, go) => parts.map((x, k) => {
  let inner = x.img ? <PgImg src={x.img.src} alt={x.img.alt} /> : (x.i ? <i>{x.s}</i> : x.s);
  if (x.b && !x.img) inner = <b>{inner}</b>;
  if (typeof x.href === 'string') {
    return go ? <button key={k} type="button" className="pg-a" data-href={x.href} onClick={() => go(x.href)}>{inner}</button>
      : <span key={k} className="pg-a">{inner}</span>;
  }
  return <React.Fragment key={k}>{inner}</React.Fragment>;
});
const hasText = (ps) => ps.some((x) => x.img || String(x.s || '').trim());

// Страница сайта, на которую ведёт ссылка (практика 4): SITE_PAGES —
// { 'cave.html': { title, text, pic } }. Файла нет — «Файл не найден».
function SitePageView({ url, onBack }) {
  const pick = usePick();
  const pg = SITE_PAGES[url];
  if (!pg) return <div className="pg-nf"><span className="pg-nf-ic" aria-hidden="true" /><b>{pick(UI.notFound)}</b><span translate="no">{url}</span></div>;
  return (
    <div className="pg-site">
      <div className="pg-blk pg-h1">{pick(pg.title)}</div>
      {pg.pic ? <span className={'pg-site-pic pg-site-' + pg.pic} aria-hidden="true"><i /><i /><i /></span> : null}
      <div className="pg-blk pg-p">{pick(pg.text)}</div>
      <button type="button" className="pg-a pg-back" onClick={onBack}>{pick(UI.back)}</button>
    </div>
  );
}

// Бумажный браузер урока 1 со страницей уроков 2–5. Классы pg- (pp-doc занят
// строкой DOCTYPE в коде с полями). По ссылке можно перейти: открывается
// страница файла из href, адрес и вкладка меняются, стрелка «назад» возвращает.
// Код поменялся — снова своя страница.
function PageView({ title, blocks, empty, flash, hl, url }) {
  const pick = usePick();
  const list = blocks || [];
  const key = JSON.stringify(list);
  const [at, setAt] = useState(null);
  const [nav, setNav] = useState(0);
  useEffect(() => { setAt(null); }, [key]);
  const ref = useFitPage(key + (flash || 0) + (at || ''));
  const go = (href) => { const h = String(href || '').trim(); setAt(h || null); setNav((x) => x + 1); sfx('pop', true); };
  const back = () => { setAt(null); setNav((x) => x + 1); sfx('tap', true); };
  const away = at != null;
  const sp = away ? SITE_PAGES[at] : null;
  const tab = away ? (sp ? pick(sp.title) : at) : title;
  return (
    <PaperBrowser title={tab} url={away ? at : (url || 'index.html')} stamp={away || nav ? nav + (flash || 0) : flash} urlHl={away}
      onBack={away ? back : undefined} tabHl={hl === 'title'} pageHl={hl === 'body'} cls="pp-br kz-piece">
      <div ref={ref} key={'pg' + (flash || 0) + ':' + nav} className={'pg-doc' + (list.length || away ? '' : ' is-empty') + (flash || nav ? ' kz-a-pop' : '')}>
        {away ? <SitePageView url={at} onBack={back} /> : list.length ? list.map((bk, j) => {
          if (bk.kids) {
            let n = 0;
            const rows = [];
            bk.kids.forEach((kid, q) => {
              if (kid.li) { n += 1; rows.push(<div key={q} className="pg-li"><span className="pg-mk" aria-hidden="true">{bk.t === 'ol' ? n + '.' : '•'}</span><span>{kid.parts.length && hasText(kid.parts) ? pgParts(kid.parts, go) : ' '}</span></div>); }
              else if (kid.p) rows.push(<div key={q} className={'pg-blk pg-' + (kid.t || 'p')}>{pgParts(kid.parts, go)}</div>);
              else rows.push(<div key={q} className="pg-txt">{pgParts(kid.parts, go)}</div>);
            });
            return <div key={j} className={'pg-list pg-' + bk.t}>{rows}</div>;
          }
          if (bk.t === 'stray') return <div key={j} className="pg-li pg-stray"><span className="pg-mk" aria-hidden="true">•</span><span>{pgParts(bk.parts, go)}</span></div>;
          return <div key={j} className={'pg-blk pg-' + bk.t + (bk.inh ? ' pg-in-' + bk.inh : '')}>{pgParts(bk.parts, go)}</div>;
        }) : (empty ? pick(empty) : ' ')}
      </div>
    </PaperBrowser>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ТРОПА ПОХОДА — карта продвижения: пять привалов на бумажной тропе. Привал —
// бумажный флажок-круг с мини-списком (точки или номера). Ждёт — выцвел и
// покосился, список размыт; готов — свой цвет, ровно, галочка. Свой список до
// написания — пунктирный круг; потом — его название.
// (houseLit / houseName / StreetStrip / StreetMap — устройство карты 01p.)
// ─────────────────────────────────────────────────────────────────────────────
const houseLit = (store, i) => !!(store.get('t' + (i + 1)) || {}).solved;
const houseName = (store, i, pick) => {
  const own = i === HOME ? ((store.get('t' + (i + 1)) || {}).result || {}).title : null;
  return own && houseLit(store, i) ? own : pick(STREET[i].name);
};
const TILT = [-8, 6, -6, 8, 0];
function Clipping({ i, lit, cur, name, size, pop, whole }) {
  const h = STREET[i];
  const home = i === HOME;
  const on = lit || (whole && !home);
  const ghost = home && !lit;
  const wait = !on && !home;
  return (
    <span className={'pp-house pp-stop' + (on ? ' is-lit' : '') + (wait ? ' is-wait' : '') + (cur ? ' is-cur' : '') + (ghost ? ' is-ghost' : '') + (pop ? ' kz-a-stamp' : '') + (size ? ' is-' + size : '')}
      style={{ '--hc': h.c, '--tilt': TILT[i % TILT.length] + 'deg' }}>
      <span className="pp-h-art" aria-hidden="true">
        {ghost ? <span className="pp-stop-plan" /> : stopArt(h, i, on)}
      </span>
      {lit ? <span className="pp-h-ok"><Icon name="check" size={9} /></span> : null}
      {name ? <span className="pp-h-name">{name}</span> : null}
    </span>
  );
}

// Полоса тропы над заданием: пять привалов и подпись текущего. mini — для шапки
// телефона: только предыдущий, текущий и следующий, без подписи.
function StreetStrip({ cur, pop, mini }) {
  const pick = usePick();
  const store = useStore();
  const shown = mini ? STREET.map((s, i) => i).filter((i) => Math.abs(i - cur) <= 1) : STREET.map((s, i) => i);
  const nm = (i) => houseName(store, i, pick);
  return (
    <div className={'pp-strip' + (mini ? ' is-mini' : ' kz-piece')}>
      <div className="pp-strip-row" role="list" aria-label={pick(UI.map)}>
        {shown.map((i) => (
          <span key={STREET[i].id} role="listitem" title={nm(i)}
            aria-label={nm(i) + ' — ' + pick(houseLit(store, i) ? UI.works : UI.off) + (i === cur ? ', ' + pick(UI.now) : '')}>
            <Clipping i={i} lit={houseLit(store, i)} cur={i === cur} size="s" pop={pop && i === cur} />
          </span>
        ))}
      </div>
      {mini ? null : (
        <span className="pp-strip-cap"><b>{pick(fillL(UI.houseOf, { n: cur + 1 }))}</b><span>{nm(cur)}</span></span>
      )}
    </div>
  );
}

// Большая тропа — на вступлении и в финале: привалы вдоль пунктирной тропинки.
// whole — до дождя (хук): все привалы целые; blown — дождь только что прошёл:
// с флажков слетают капли-клочки.
function StreetMap({ glow, whole, blown }) {
  const pick = usePick();
  const store = useStore();
  return (
    <div className={'pp-street pp-trail kz-piece' + (glow ? ' is-glow' : '') + (blown ? ' is-blown' : '')} role="list" aria-label={pick(UI.map)}>
      <Cut c="#DCE8CF" seed={120} n={20} amp={5} asp={6} cls="pp-road pp-board" />
      <span className="pp-trail-path" aria-hidden="true" />
      {STREET.map((s, i) => {
        const lit = houseLit(store, i);
        return (
          <span key={s.id} role="listitem" className="pp-street-h" style={{ '--dl': (glow ? 0.15 + i * 0.12 : i * 0.06) + 's', '--i': i }}
            aria-label={houseName(store, i, pick) + ' — ' + pick(lit || (whole && i !== HOME) ? UI.works : UI.off)}>
            <Clipping i={i} lit={lit} whole={whole} name={houseName(store, i, pick)} size="l" />
            {blown && i !== HOME ? <Cut c="#7FB3D5" round seed={140 + i} n={5} amp={10} cls="pp-scrap pp-drop" /> : null}
          </span>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// НАГЛЯДНАЯ ПОМОЩЬ — видна сразу, подписана названиями тегов.
// ─────────────────────────────────────────────────────────────────────────────
// Как должно выглядеть в браузере (t3): список с точками или номерами.
function ListTarget({ kind, items }) {
  const pick = usePick();
  return (
    <div className="pp-target kz-piece">
      <span className="pp-target-h">{pick(UI.target)}</span>
      <span className="pp-target-s">
        {items.map((x, k) => <span key={k} className="pp-target-li"><i aria-hidden="true">{kind === 'ol' ? (k + 1) + '.' : '•'}</i>{x}</span>)}
      </span>
    </div>
  );
}
// Сколько ещё сломанных строк (t4): живой счётчик — условие видно.
function FixLeft({ n }) {
  const pick = usePick();
  return (
    <div className={'pp-left kz-piece' + (n ? '' : ' is-ok')} aria-live="polite">
      {n ? pick(fillL(UI.left, { n })) : <><Icon name="check" size={13} />{pick(UI.allFixed)}</>}
    </div>
  );
}
// Что должно быть в своей работе (t5) — галочки загораются по ходу набора.
function Checklist({ items }) {
  const pick = usePick();
  return (
    <div className="pp-check kz-piece">
      {items.map((it) => (
        <span key={it.k} className={'pp-check-i' + (it.ok ? ' is-ok' : '')}>
          <span className="pp-check-box">{it.ok ? <Icon name="check" size={11} /> : null}</span>{pick(it.text)}
        </span>
      ))}
    </div>
  );
}

// Подписи ступеней подсказки: направление → место или правило → образец.
const HINT_STEP = [
  L3('Yo‘nalish', 'Направление', 'Where to look'),
  L3('Joy va qoida', 'Место и правило', 'Place and rule'),
  L3('Deyarli javob', 'Почти ответ', 'Almost there')
];

// Одна заметка под работой — бумажный листок: разбор проверки, ступень
// подсказки (с образцом на третьей) или похвала.
function TaskNote({ note, extra }) {
  const pick = usePick();
  if (!note || !note.text) return null;
  const kind = note.kind === 'hint' ? 'hint' : note.kind === 'ok' ? 'ok' : 'fb';
  return (
    <div className={'note-one pp-note is-' + kind + ' kz-piece'} key={kind + note.n} aria-live="polite">
      <span className="pp-note-lbl">
        {kind === 'hint' ? <><Icon name="bulb" size={13} />{pick(HINT_STEP[note.level - 1])}<span className="pp-note-step">{note.level}/3</span></>
          : kind === 'ok' ? <><Icon name="check" size={13} />{pick(UI.ok)}</>
            : <>{pick(UI.fb)}{note.sub ? <span className="pp-note-sub">{pick(UI.incomplete)}</span> : null}</>}
      </span>
      {kind === 'hint' && note.fb ? <div className="pp-note-fb">{pick(note.fb)}</div> : null}
      <div className="pp-note-body">{pick(note.text)}</div>
      {kind === 'hint' && note.level === 3 && extra ? <div className="pp-note-extra">{extra}</div> : null}
    </div>
  );
}

// Кнопки < / > для телефона. Нажатие не забирает фокус у поля: символ встаёт
// в место курсора, клавиатура остаётся открытой.
function SymKeys({ inputRef }) {
  const pick = usePick();
  const keep = (e) => e.preventDefault();
  return (
    <div className="pp-sym" role="group" aria-label={pick(UI.keys)} translate="no">
      {['<', '/', '>'].map((k) => (
        <button key={k} type="button" className="pp-key" onPointerDown={keep} onMouseDown={keep}
          onClick={() => { insertAtCaret(inputRef.current, k); sfx('type', true); }}>{k}</button>
      ))}
    </div>
  );
}

// Подпись задания в шапке: «Задание 2 · Почта».
const taskEyebrow = (num, house) => {
  const head = fillL(UI.task, { n: num });
  const out = {};
  LANGS.forEach((l) => { out[l] = head[l] + ' · ' + STREET[house - 1].name[l]; });
  return out;
};

// =============================================================================
// ЗАДАНИЕ — общий ход
//
// Запись задания в сторе (tN): st — то, что написал ученик; checks — число
// проверок; hint — сколько ступеней подсказки открыто; note — заметка под
// работой; solved — дом на улице горит; done — можно идти дальше (после
// дополнительной задачи, если она была); drill — дополнительная задача.
// Всё живёт в сторе урока, поэтому «Назад» и возврат ничего не теряют, а
// «Повторить» (SCREEN_RESET) стирает только текущее задание.
// =============================================================================
// Со скольких неудачных проверок подряд подсказка приходит сама.
const AUTO_HINT_AFTER = 2;

function useTask(cfg) {
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => {
    const saved = store.get(cfg.id);
    return saved && saved.st ? saved
      : { st: cfg.init(), solved: false, done: false, checks: 0, hint: 0, note: null, drill: null, n: 0 };
  });
  const ref = useRef(rec);
  const put = useCallback((patch) => {
    const v = Object.assign({}, ref.current, patch);
    ref.current = v;
    store.set(cfg.id, v);
    setRec(v);
    return v;
  }, [cfg.id, store]);

  const drilling0 = !!(rec.drill && !rec.drill.done);
  const [speaker, , spoken, sayNow] = useVoice(rec.done ? [{ text: cfg.C.done, pose: 'smile' }]
    : [{ text: drilling0 ? C.drill.say : cfg.C.say, pose: 'point' }]);
  const canGo = useAdvanceGate(rec.done, spoken);
  const [fresh, setFresh] = useState(false);
  const [flash, setFlash] = useState(0);

  // Строка журнала: попытка — это проверка по кнопке, а не нажатие клавиши.
  const row = (v) => log({
    screenId: cfg.id, type: cfg.kind, correct: !!v.solved, firstTry: !!v.firstTry,
    attempts: v.checks, hintMax: v.hint,
    drill: v.drill ? { done: !!v.drill.done, attempts: v.drill.checks } : null
  });

  const setSt = useCallback((st) => { put({ st }); }, [put]);
  const setDrillSt = useCallback((st) => { put({ drill: Object.assign({}, ref.current.drill, { st }) }); }, [put]);

  // Следующая ступень подсказки: что записать в rec и что показать.
  const nextHint = (cur) => {
    const lv = Math.min(3, cur.hint + 1);
    const h = cfg.hint(lv, cur.st);
    return { lv, h, patch: { hint: lv, hcat: lv === 3 ? (h.cat || cur.hcat || null) : cur.hcat } };
  };

  // ПОДСКАЗКА ПОСЛЕ НЕУДАЧ (заказчик, 15.10.2026). Каждая неудачная проверка
  // сначала называет, что не так. Начиная со второй неудачи подряд к этому
  // сразу добавляется следующая ступень подсказки. Одна реплика на всё.
  const check = () => {
    const cur = ref.current;
    const r = cfg.check(cur.st);
    const checks = cur.checks + 1;
    const n = cur.n + 1;
    if (!r.ok) {
      sfx('soft', true);
      const fails = (cur.fails || 0) + 1;
      if (fails >= AUTO_HINT_AFTER && cur.hint < 3) {
        const { lv, h, patch } = nextHint(cur);
        const v = put(Object.assign({ checks, n, fails, lastOk: false, shake: n,
          note: { kind: 'hint', level: lv, text: h.text, fb: r.msg, n } }, patch));
        row(v);
        sayNow(joinL(r.msg, h.text), 'think');
        return;
      }
      const v = put({ checks, n, fails, lastOk: false, shake: n, note: { kind: 'fb', text: r.msg, n, sub: !!r.sub } });
      row(v);
      sayNow(r.msg, 'think');
      return;
    }
    const was = cur.solved;
    // Решил после образца третьей ступени — короткая задача с новым содержимым.
    const needDrill = !was && !!cfg.drill && cur.hint >= 3;
    const say = needDrill ? joinL(cfg.C.praise, C.drill.say) : cfg.C.praise;
    let drill = cur.drill;
    if (needDrill) {
      const d = cfg.drill.make(cur.hcat || null);
      drill = { cat: cur.hcat || null, st: d.init(), checks: 0, done: false, note: null };
    }
    const v = put({
      checks, n, fails: 0, solved: true, lastOk: true, firstTry: was ? cur.firstTry : checks === 1,
      done: !needDrill, result: r.result || null, drill, note: { kind: 'ok', text: say, n }
    });
    if (cfg.onSolved) cfg.onSolved(r);
    sfx(was ? 'ok' : 'win', true);
    if (!was) setFresh(true);
    setFlash((k) => k + 1);
    row(v);
    sayNow(say, 'smile');
  };

  const checkDrill = () => {
    const cur = ref.current;
    const d = cur.drill;
    if (!d || d.done) return;
    const dc = cfg.drill.make(d.cat);
    const r = dc.check(d.st);
    const checks = d.checks + 1;
    const n = cur.n + 1;
    if (!r.ok) {
      sfx('soft', true);
      const v = put({ n, shake: n, drill: Object.assign({}, d, { checks, note: { kind: 'fb', text: r.msg, n, sub: !!r.sub } }) });
      row(v);
      sayNow(r.msg, 'think');
      return;
    }
    sfx('ok', true);
    const v = put({ n, done: true, drill: Object.assign({}, d, { checks, done: true, note: null }),
      note: { kind: 'ok', text: C.drill.done, n } });
    row(v);
    sayNow(C.drill.done, 'smile');
  };

  // Подсказка по просьбе — лампочкой в шапке (её реплику канон произносит
  // сам — здесь только ступень в заметке).
  const openHint = () => {
    const cur = ref.current;
    if (cur.solved) {
      // Дополнительная задача: лампочка даёт правило задания (вторая ступень), без готового ответа.
      if (cur.drill && !cur.drill.done) {
        const n = cur.n + 1;
        put({ n, drill: Object.assign({}, cur.drill, { note: { kind: 'hint', level: 2, text: cfg.hint(2, cur.st).text, n } }) });
      }
      return;
    }
    const { lv, h, patch } = nextHint(cur);
    const n = cur.n + 1;
    const v = put(Object.assign({ n, note: { kind: 'hint', level: lv, text: h.text, n } }, patch));
    row(v);
  };
  const openRef = useRef(openHint);
  openRef.current = openHint;
  useEffect(() => {
    const h = (e) => { const el = e.target; if (el && el.closest && el.closest('.ctl-hint')) openRef.current(); };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, []);

  return { rec, put, setSt, setDrillSt, check, checkDrill, openHint, speaker, canGo, fresh, flash, say: sayNow };
}

// ─────────────────────────────────────────────────────────────────────────────
// ВЫБОР МЕСТА (t6): код — неподвижные строки, между ними — места-щели. Нажатое
// верное место раскрывается в строку ввода (дальше обычный редактор), неверное
// трясётся, и проверка называет причину. Полоски вложенности видны сразу:
// незакрытая часть — пунктиром.
// ─────────────────────────────────────────────────────────────────────────────
function GapPick({ lines, gaps, onPick, led, miss }) {
  const pick = usePick();
  const regs = regionsOf(lines.join('\n'));
  const bars = (i) => regs.filter((r) => r.from <= i && i <= r.to).map((r, k) => (
    <span key={k} aria-hidden="true" className={'ed-bar' + (r.closed ? '' : ' is-open') + (r.from === i ? ' is-first' : '') + (r.to === i ? ' is-last' : '')}
      style={{ '--c': TAGC[r.tag], '--lv': r.depth }} />
  ));
  return (
    <div className="ed pp-gaps" translate="no">
      {lines.map((ln, i) => (
        <React.Fragment key={i}>
          <div className="ed-line is-static"><span className="ed-n" aria-hidden="true">{i + 1}</span>{bars(i)}{ln ? hlLine(ln) : '​'}</div>
          {gaps.indexOf(i) >= 0 ? (
            <button type="button" className={'pp-gap' + (led === i ? ' is-led' : '') + (miss && miss.at === i ? ' kz-a-shake' : '')}
              key={'g' + i + (miss && miss.at === i ? ':' + miss.n : '')} onClick={() => onPick(i)} aria-label={pick(UI.gapHere)}>
              <span className="pp-gap-line" aria-hidden="true" />
            </button>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

// Рабочая область: бумажный браузер с наглядной помощью и редактор с
// кнопками. В колонку на телефоне (браузер сверху, редактор — главный), в ряд
// на компьютере.
function Workbench({ spec, st, setSt, inputRef, fx, aids, tools, flash, onPick }) {
  const f = fx || {};
  let title;
  let text;
  let editor;
  if (spec.kind === 'fields') {
    title = st.title;
    text = st.body;
    editor = (
      <FieldDoc title={st.title} body={st.body} editTitle={spec.editTitle !== false} editBody={spec.editBody !== false}
        onTitle={(v) => setSt(Object.assign({}, st, { title: v }))}
        onBody={(v) => setSt(Object.assign({}, st, { body: v }))}
        hl={f.hl} led={f.led} titleRef={inputRef} bodyRef={inputRef} focusBody={!!spec.focusBody} ph={spec.ph} />
    );
  } else if (spec.kind === 'gap' && st.at == null) {
    const pg = renderDoc(spec.lines.join('\n'));
    title = pg.title;
    text = pg.blocks;
    editor = <GapPick lines={spec.lines} gaps={spec.gaps} onPick={onPick} led={f.ledGap} miss={st.miss} />;
  } else {
    const before = spec.kind === 'gap' ? spec.lines.slice(0, st.at + 1) : spec.before;
    const after = spec.kind === 'gap' ? spec.lines.slice(st.at + 1) : spec.after;
    const full = (before || []).concat([st.code]).concat(after || []).join('\n');
    const pg = renderDoc(full);
    title = pg.title;
    text = pg.blocks;
    editor = (
      <CodeEditor value={st.code} onChange={(v) => setSt(Object.assign({}, st, { code: v }))}
        before={before} after={after} single={spec.kind === 'line' || spec.kind === 'gap'} ind={spec.ind}
        regions={spec.bars ? regionsOf(full) : null} markLine={f.markLine} inputRef={inputRef} led={!!f.led} />
    );
  }
  return (
    <div className={'op-work' + (spec.big ? ' is-big' : '')}>
      <div className="op-side">
        <PageView title={title} blocks={spec.kind === 'fields' ? null : text} empty={spec.empty} flash={flash} hl={f.hl} url={spec.url} />
        {aids || null}
      </div>
      <div className="op-main">
        <Pad cls={'pp-edpad' + (spec.big ? ' is-big' : '')}>{editor}</Pad>
        {tools}
      </div>
    </div>
  );
}

// =============================================================================
// КАРКАС ЭКРАНА ПРАКТИКИ — БЕЗ КОДИ И БЕЗ ТЕКСТА РЕПЛИК
// =============================================================================
// Коди — как в уроке 1 на телефоне (заказчик, 22.10.2026): голова в кружке в
// шапке рядом с лампочкой (VoiceDot канона): лицо держит эмоцию реплики,
// вокруг бегут волны, пока звучит голос. Текста реплик нет (заказчик,
// 14–15.10.2026): пузырь героя смонтирован, но спрятан — он ведёт озвучку и
// зовёт onSpoken. Телефон: Коди и лампочка слева, три дома улицы по центру,
// пауза и счётчик справа. Содержимое — на бумажном листе урока 1.
const PStage = ({ children, eyebrow, screen, total, nav, speaker, done, hint, top }) => {
  const pick = usePick();
  const speaking = useSayBusy();
  useEffect(() => { _hintText = hint || null; return () => { _hintText = null; }; }, [hint]);
  const line = speaker ? pick(speaker.text) : '';
  const idle = useIdleCoach(!!nav, speaking);
  const voiceDot = speaker ? <VoiceDot pose={speaker.pose} /> : null;
  return (
    <div className={'stage p-stage' + (speaking ? ' is-speaking' : '') + (idle ? ' is-idle is-idle-' + idle : '')}>
      <div className="stage-header">
        <div className="limit">
          <div className="progress-track">
            <div className="progress-bar" style={{ width: ((screen + 1) / total) * 100 + '%' }} />
          </div>
          <div className="chrome">
            <div className="eyebrow"><span className="dot" />{pick(eyebrow)}</div>
            <span className="p-voice-l">{line ? voiceDot : null}{nav && <HintChromeBtn />}</span>
            {top ? <div className="p-top">{top}</div> : null}
            <div className="chrome-side">
              <ExitBtn />
              {line ? <span className="p-voice-r">{voiceDot}</span> : null}
              {nav && <span className="p-voice-r"><HintChromeBtn /></span>}
              {nav && <PauseBtn done={done} />}
              <div className="mono counter">{String(screen + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      </div>
      {speaker && (
        <div className="speaker-wrap p-hidden-hero"><div className="limit"><PersonaBubble {...speaker} /></div></div>
      )}
      <div className="stage-content">
        <div className="limit stack">{children}</div>
      </div>
      {nav && <div className="stage-nav"><div className="limit navrow">{nav}</div></div>}
    </div>
  );
};

// Строка задания — бумажная полоска урока 1 (KzAsk); у дополнительной задачи — ярлычок.
function PAsk({ text, drill }) {
  const pick = usePick();
  return (
    <div className="kz-ask-wrap pp-ask-wrap">
      <p className={'kz-ask pp-ask' + (drill ? ' is-drill' : '')} aria-live="polite">
        {drill ? <span className="pp-drill-tag">{pick(UI.drill)}</span> : null}{pick(text)}
      </p>
    </div>
  );
}

function TaskScreen({ p, make }) {
  const pick = usePick();
  const lang = useLang();
  const store = useStore();
  const cfg = useMemo(() => make(pick, store, lang), [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const t = useTask(cfg);
  const rec = t.rec;
  const mainRef = useRef(null);
  const drillRef = useRef(null);
  const drilling = !!(rec.drill && !rec.drill.done);
  const dcfg = drilling ? cfg.drill.make(rec.drill.cat) : null;
  const cur = drilling ? dcfg : cfg;
  const st = drilling ? rec.drill.st : rec.st;
  const spec = cur.spec;
  const typing = spec.kind !== 'fields' && !(spec.kind === 'gap' && st.at == null);
  const stageHint = drilling ? cfg.hint(2, rec.st).text : rec.solved ? cfg.C.done : cfg.hint(Math.min(3, rec.hint + 1), rec.st).text;
  const keep = (e) => e.preventDefault();
  // Нажатое место в задании с выбором места (t6): верное раскрывается в строку
  // ввода, неверное трясётся и называет причину.
  const onPick = (i) => {
    const res = cur.pick(i);
    const n = rec.n + 1;
    const nst = res.ok ? Object.assign({}, st, { at: i, miss: null }) : Object.assign({}, st, { miss: { at: i, n } });
    const note = res.ok ? null : { kind: 'fb', text: res.msg, n };
    if (drilling) t.put({ n, drill: Object.assign({}, rec.drill, { st: nst, note }) });
    else t.put({ n, st: nst, note });
    sfx(res.ok ? 'ok' : 'soft', true);
    t.say(res.ok ? res.say : res.msg, res.ok ? 'point' : 'think');
    if (res.ok) setTimeout(() => { const el = (drilling ? drillRef : mainRef).current; if (el) el.focus(); }, 60);
  };
  const tools = (
    <div className="op-tools kz-piece">
      {typing ? <SymKeys inputRef={drilling ? drillRef : mainRef} /> : null}
      <button type="button" className="pp-go" onMouseDown={keep} onClick={drilling ? t.checkDrill : t.check}>
        <Icon name="check" size={17} />{pick(UI.check)}
      </button>
    </div>
  );
  const note = drilling ? (rec.drill.note || rec.note) : rec.note;
  const order = drilling ? (dcfg.orderOf ? dcfg.orderOf(st) : dcfg.order) : (cfg.orderOf ? cfg.orderOf(rec.st) : cfg.C.order);
  return (
    <PStage eyebrow={taskEyebrow(cfg.num, cfg.num)} screen={p.screen} total={p.total} speaker={t.speaker} done={t.canGo}
      top={<StreetStrip mini cur={cfg.num - 1} pop={t.fresh} />}
      hint={stageHint}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!t.canGo} onClick={p.next} /></>}>
      <Sheet cls="pp-sheet">
        <StreetStrip cur={cfg.num - 1} pop={t.fresh} />
        <PAsk text={order} drill={drilling} />
        {cur.orderExtra ? <div className="pp-extra">{typeof cur.orderExtra === 'function' ? cur.orderExtra(rec, st) : cur.orderExtra}</div> : null}
        <Workbench key={drilling ? 'drill' : 'main'} spec={spec} st={st} setSt={drilling ? t.setDrillSt : t.setSt}
          inputRef={drilling ? drillRef : mainRef} fx={!drilling && cfg.fx ? cfg.fx(rec) : (drilling && dcfg.fx ? dcfg.fx(rec.drill) : null)}
          aids={cur.aids ? (typeof cur.aids === 'function' ? cur.aids(rec, st) : cur.aids) : null}
          tools={tools} flash={drilling ? 0 : t.flash} onPick={onPick} />
        <TaskNote note={note} extra={!drilling && cfg.h3 ? cfg.h3(rec) : null} />
      </Sheet>
    </PStage>
  );
}
