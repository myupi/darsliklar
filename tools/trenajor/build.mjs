// Сборка тренажёра модуля: вопросы tools/trenajor/<модуль>/lNN.mjs → банк JSON + копия JSX для LMS.
//   node tools/trenajor/build.mjs [html]            — проверить и собрать trenajor/<модуль>/
//   node tools/trenajor/build.mjs --check [html]    — только проверить
// Верный вариант в исходнике — первый; сборщик расставляет верные по местам A–D поровну (детерминированно),
// sort: true — варианты в естественном порядке. Формат вопросов — tools/trenajor/<модуль>/FORMAT.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const draft = args.includes('--draft');   // черновик для просмотра: нет файла или числа вопросов — не ошибка
const MOD = args.find((a) => !a.startsWith('--')) || 'html';
const SRC = path.join(ROOT, 'tools/trenajor', MOD);
const OUT = path.join(ROOT, 'trenajor', MOD);
const LANGS = ['uz', 'ru', 'en'];

const META = {
  html: {
    // вопросов на урок: с выбором (choice), «впиши ответ» (input) и игровые (18.11.2026): «собери» (build), «найди ошибку» (bug), «нажми на странице» (tap)
    lessons: 9, per: { 9: { choice: 12, input: 4, build: 2, bug: 2, tap: 1 } }, perDefault: { choice: 11, input: 3, build: 2, bug: 1, tap: 1 },
    topics: {
      1: { uz: 'HTML hujjatining tuzilishi', ru: 'Структура HTML-документа', en: 'HTML document structure' },
      2: { uz: 'Sarlavhalar va matn', ru: 'Заголовки и текст', en: 'Headings and text' },
      3: { uz: "Ro'yxatlar", ru: 'Списки', en: 'Lists' },
      4: { uz: 'Havolalar va atributlar', ru: 'Ссылки и атрибуты', en: 'Links and attributes' },
      5: { uz: 'Rasmlar', ru: 'Изображения', en: 'Images' },
      6: { uz: "Formalar: ma'lumot kiritish", ru: 'Формы: ввод данных', en: 'Forms: entering data' },
      7: { uz: 'Formalar: tanlash va yuborish', ru: 'Формы: выбор и отправка', en: 'Forms: choosing and sending' },
      8: { uz: 'Haqiqiy sayt tuzilishi', ru: 'Структура настоящего сайта', en: 'The structure of a real site' },
      9: { uz: 'Yakuniy HTML loyiha', ru: 'Финальный HTML-проект', en: 'The final HTML project' },
    },
  },
  // CSS (19.11.2026): 16 уроков по 18 вопросов, финальный 17 — 21 (повторение всего курса); миссия «Сайт одевается».
  css: {
    lessons: 17, per: { 17: { choice: 12, input: 4, build: 2, bug: 2, tap: 1 } }, perDefault: { choice: 11, input: 3, build: 2, bug: 1, tap: 1 },
    topics: {
      1: { uz: "CSS nima va u saytni qanday o'zgartiradi", ru: 'Что такое CSS и как он меняет сайт', en: 'What CSS is and how it changes a site' },
      2: { uz: 'Bezash uchun elementni qanday tanlash', ru: 'Как выбрать элемент для стилизации', en: 'How to pick an element to style' },
      3: { uz: 'Ranglar', ru: 'Цвета', en: 'Colors' },
      4: { uz: 'Fon', ru: 'Фон', en: 'Backgrounds' },
      5: { uz: 'Matn va shriftlar', ru: 'Текст и шрифты', en: 'Text and fonts' },
      6: { uz: "Elementlar o'lchami", ru: 'Размеры элементов', en: 'Element sizes' },
      7: { uz: 'Box Model', ru: 'Box Model', en: 'Box Model' },
      8: { uz: 'Chiroyli kartochkalar', ru: 'Красивые карточки', en: 'Beautiful cards' },
      9: { uz: 'Elementlar sahifada qanday turadi', ru: 'Как элементы ведут себя на странице', en: 'How elements behave on a page' },
      10: { uz: 'Flexbox: elementlarni joylashtirish', ru: 'Flexbox: расположение элементов', en: 'Flexbox: arranging elements' },
      11: { uz: 'Flexbox: tekislash', ru: 'Flexbox: выравнивание', en: 'Flexbox: alignment' },
      12: { uz: 'Pozitsiyalash', ru: 'Позиционирование', en: 'Positioning' },
      13: { uz: 'Hover va transform', ru: 'Hover и transform', en: 'Hover and transform' },
      14: { uz: 'Silliq effektlar', ru: 'Плавные эффекты', en: 'Smooth effects' },
      15: { uz: 'CSS animatsiyalar', ru: 'CSS-анимации', en: 'CSS animations' },
      16: { uz: 'Moslashuvchan sayt', ru: 'Адаптивность', en: 'Responsive design' },
      17: { uz: 'Yakuniy CSS loyiha', ru: 'Финальный CSS-проект', en: 'The final CSS project' },
    },
  },
  // «ИИ» (21.11.2026, заказчик: «по ии тоже нужно создать такие, там только тесты будут»): только вопросы с выбором,
  // уроки 1–7 по 18, финальный 8 — 21 (повторение всей формулы); картинка — vis.ai (промпт, сообщение клиента, сайт);
  // миссия «Заказы студии».
  ai: {
    lessons: 8, per: { 8: { choice: 21 } }, perDefault: { choice: 18 },
    topics: {
      1: { uz: 'Nima yaratamiz va nega?', ru: 'Что создаём и зачем?', en: 'What are we making and why?' },
      2: { uz: 'Kim uchun yaratamiz?', ru: 'Для кого создаём?', en: 'Who are we making it for?' },
      3: { uz: "Saytda nima bo'ladi?", ru: 'Что должно быть на сайте?', en: 'What goes on the site?' },
      4: { uz: "Sayt qanday ko'rinadi?", ru: 'Как должен выглядеть сайт?', en: 'How should the site look?' },
      5: { uz: 'Sayt qanday ishlaydi?', ru: 'Как сайт должен вести себя?', en: 'How should the site behave?' },
      6: { uz: 'Aniq talablar qanday beriladi?', ru: 'Как дать ИИ точные требования?', en: 'How to give the AI exact requirements?' },
      7: { uz: 'Natijani qanday yaxshilaymiz?', ru: 'Как улучшить результат ИИ?', en: 'How to improve the AI’s result?' },
      8: { uz: 'Yakuniy loyiha', ru: 'Финальный ИИ-проект', en: 'The final AI project' },
    },
  },
}[MOD];
if (!META) { console.error('Неизвестный модуль: ' + MOD); process.exit(1); }

const errors = [];
const warns = [];
const err = (id, m) => errors.push(`${id}: ${m}`);
const warn = (id, m) => warns.push(`${id}: ${m}`);

// детерминированный ГПСЧ
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const same = (o) => LANGS.every((l) => o[l] === o.uz);
const L3 = (get) => { const o = {}; LANGS.forEach((l) => { o[l] = get(l); }); return same(o) ? o.uz : o; };

// Сравнение вписанного ответа — так же сравнивает LMS (README): регистр, пробелы по краям и вокруг < > / =, «умные» кавычки, «;» в конце.
export const normAnswer = (s) => String(s == null ? '' : s).normalize('NFKC').replace(/[‘’ʻʼ`´]/g, "'").replace(/[“”«»„]/g, '"')
  .trim().replace(/\s+/g, ' ').replace(/\s*([<>/=])\s*/g, '$1').replace(/;+$/, '').toLowerCase();

// Картинка вопроса на языке l так, как её покажет тренажёр (decodeVis в trenajor.jsx — та же логика):
// HTML-вид { code, page|page:true, mark } и CSS-вид { css, html, base, goal, vw, mark } — в редакторе css (style.css),
// на странице html + <style> base + css (объявления с ___ выброшены) или goal, если он есть.
const pickL = (v, l) => (v == null ? null : typeof v === 'object' ? v[l] : v);
const dropSlots = (css) => String(css).replace(/[^{};\n]*___[^{};\n]*;?/g, '');
function visL(vis, l) {
  if (!vis) return null;
  if (vis.css != null || vis.html != null) {
    const css = pickL(vis.css, l); const html = pickL(vis.html, l); const base = pickL(vis.base, l) || ''; const goal = pickL(vis.goal, l);
    const page = html == null ? null : `<style>${base}\n${goal != null ? goal : dropSlots(css || '')}</style>\n${html}`;
    return { code: css, page, css: true };
  }
  const code = pickL(vis.code, l);
  return { code, page: vis.page === true ? code : pickL(vis.page, l), css: false };
}

const all = [];
for (let n = 1; n <= META.lessons; n++) {
  const f = path.join(SRC, `l${String(n).padStart(2, '0')}.mjs`);
  if (!fs.existsSync(f)) { if (!draft) err(`l${n}`, 'нет файла ' + path.relative(ROOT, f)); continue; }
  const qs = (await import(pathToFileURL(f).href + '?t=' + Date.now())).default;
  const need = META.per[n] || META.perDefault;
  if (!Array.isArray(qs)) { err(`l${n}`, 'export default — не массив'); continue; }
  const cnt = { choice: 0, input: 0, build: 0, bug: 0, tap: 0 };
  qs.forEach((q) => { cnt[q.type || 'choice'] = (cnt[q.type || 'choice'] || 0) + 1; });
  if (!draft && Object.keys(need).some((k) => cnt[k] !== need[k])) err(`l${n}`, `вопросов ${JSON.stringify(cnt)}, нужно ${JSON.stringify(need)}`);
  qs.forEach((q) => all.push({ ...q, lesson: n }));
}

const ids = new Set();
const RU_VY = /\b(вы|вас|вам|ваш\w*)\b|\b\w+(?:ите|йте)\b/i;
const RU_GENDER = /\bты\s+\S+(л|ла)\b|\b(сделал|нашёл|нашла|сделала|ответил|ответила|выбрал|выбрала|ошибся|ошиблась)\b/i;
const PRAISE = /^(barakalla|qoyil|zo'r|to'ppa|ajoyib|juda|xuddi|верно|молодец|отлично|здорово|именно|правильно|great|right|correct|nice|well done|exactly)/i;
const UZ_BAD_APOS = /[‘’ʻʼ`]/;
for (const q of all) {
  const id = q.id || `l${q.lesson}?`;
  if (!new RegExp(`^${MOD}_l\\d\\d_q\\d\\d$`).test(id)) err(id, `id не по образцу ${MOD}_lNN_qKK`);
  if (!id.startsWith(`${MOD}_l${String(q.lesson).padStart(2, '0')}_`)) err(id, 'id не совпадает с файлом урока');
  if (ids.has(id)) err(id, 'повтор id'); ids.add(id);
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) err(id, 'difficulty');
  for (const l of LANGS) {
    const t = q[l];
    if (!t) { err(id, `нет языка ${l}`); continue; }
    if (typeof t.q !== 'string' || !t.q.trim()) err(id, `${l}: пустой q`);
    if (typeof t.why !== 'string' || !t.why.trim()) err(id, `${l}: пустой why`);
    if (q.type) { if (t.opts) err(id, `${l}: у вопроса ${q.type} вариантов opts нет`); }
    else if (!Array.isArray(t.opts) || t.opts.length !== 4) err(id, `${l}: вариантов не 4`);
    else if (new Set(t.opts.map((o) => String(o).trim())).size !== 4) err(id, `${l}: варианты повторяются`);
    const texts = [t.ctx || '', t.q || '', t.why || '', ...(t.opts || []).map(String)];
    if (l === 'uz' && texts.some((s) => UZ_BAD_APOS.test(s))) err(id, 'uz: апостроф не ASCII');
    if (l === 'ru' && texts.slice(0, 3).some((s) => RU_VY.test(s))) err(id, 'ru: обращение на «вы»: ' + texts.slice(0, 3).find((s) => RU_VY.test(s)));
    if (l === 'ru' && texts.slice(0, 3).some((s) => RU_GENDER.test(s))) warn(id, 'ru: возможно, род: ' + texts.slice(0, 3).find((s) => RU_GENDER.test(s)));
    if (PRAISE.test((t.why || '').trim())) err(id, `${l}: why начинается с похвалы`);
    if ((t.ctx || '').length > 110) warn(id, `${l}: ctx ${t.ctx.length} знаков`);
    if ((t.q || '').length > 90) warn(id, `${l}: q ${t.q.length} знаков`);
    if ((t.why || '').length > 210) warn(id, `${l}: why ${t.why.length} знаков`);
    if ((t.opts || []).some((o) => String(o).length > 48)) warn(id, `${l}: длинный вариант`);
    const lens = (t.opts || []).map((o) => String(o).length);
    if (lens.length === 4 && lens[0] > 1.8 * Math.max(...lens.slice(1)) && lens[0] > 14) warn(id, `${l}: верный вариант заметно длиннее неверных`);
  }
  if (q.type === 'input') {
    if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((a) => typeof a !== 'string' || !a.trim())) err(id, 'input: answer — непустой массив строк');
    else {
      if (q.answer.some((a) => a.length > 30)) warn(id, 'input: длинный ответ');
      if (new Set(q.answer.map(normAnswer)).size !== q.answer.length) warn(id, 'input: в answer есть одинаковые после сравнения записи');
    }
  } else if (q.type === 'build') {
    const ps = q.pieces; const ex = q.extra || [];
    if (!Array.isArray(ps) || ps.length < 2 || ps.length > 7) err(id, 'build: pieces — 2–7 кусочков в верном порядке');
    else if (!Array.isArray(ex) || ex.length < 1 || ex.length > 3) err(id, 'build: extra — 1–3 лишних кусочка');
    else {
      if (ps.length + ex.length < 4 || ps.length + ex.length > 8) err(id, `build: всего кусочков ${ps.length + ex.length} (можно 4–8)`);
      for (const l of LANGS) {
        const tt = [...ps, ...ex].map((x) => (x && typeof x === 'object' ? x[l] : x));
        if (tt.some((x) => typeof x !== 'string' || !x.trim())) { err(id, `build: кусочек без текста (${l})`); continue; }
        if (new Set(tt.map((x) => x.trim())).size !== tt.length) err(id, `build: кусочки повторяются (${l})`);
        if (tt.some((x) => x.trim().length > 20)) warn(id, `build: длинный кусочек (${l})`);
        if (l === 'uz' && tt.some((x) => UZ_BAD_APOS.test(x))) err(id, 'build uz: апостроф не ASCII');
      }
    }
    if (q.vis) {
      if (q.vis.page != null || q.vis.html != null) err(id, 'build: страница не нужна (page/html)');
      for (const l of LANGS) { const c = visL(q.vis, l).code; if ((String(c).match(/___/g) || []).length !== 1) err(id, `build: в коде ровно один ___ (${l})`); }
    }
  } else if (q.type === 'bug') {
    if (!q.vis || visL(q.vis, 'uz').code == null) err(id, 'bug: нужен код (vis.code или vis.css)');
    else {
      if (q.vis.mark) err(id, 'bug: mark выдаёт ответ');
      for (const l of LANGS) {
        const V = visL(q.vis, l); const c = V.code;
        const n = String(c).replace(/^\n+|\s+$/g, '').split('\n').length;
        if (!Number.isInteger(q.line) || q.line < 1 || q.line > n) err(id, `bug: line ${q.line} вне кода (${n} строк, ${l})`);
        if (n > (V.page ? 6 : 7)) err(id, `bug: ${n} строк (можно ${V.page ? 6 : 7})`);
        if (String(c).includes('___')) err(id, 'bug: ___ не нужен');
      }
    }
  } else if (q.type === 'tap') {
    if (!q.vis || visL(q.vis, 'uz').page == null) err(id, 'tap: нужна страница (vis.page или vis.html)');
    else {
      let first = null;
      for (const l of LANGS) {
        const page = visL(q.vis, l).page;
        const ts = [...String(page).matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]);
        if (ts.length < 3 || ts.length > 5) err(id, `tap: целей data-t ${ts.length} (нужно 3–5, ${l})`);
        if (new Set(ts).size !== ts.length) err(id, `tap: data-t повторяются (${l})`);
        if (!ts.includes(q.answer)) err(id, `tap: answer «${q.answer}» нет среди data-t (${l})`);
        const key = ts.slice().sort().join(',');
        if (first == null) first = key; else if (first !== key) err(id, 'tap: data-t на языках разные');
      }
    }
  } else if (q.type != null) err(id, 'type: input, build, bug, tap или без type');
  if (q.vis && q.vis.ai) {
    // «ИИ»: { prompt: [{ q: 0–6, t } | { lab, c, bg, t }], msg: { who, text }, site: {…}, focus } — тексты строкой или { uz, ru, en }
    const A = q.vis.ai;
    if (Object.keys(q.vis).length !== 1) err(id, 'vis: ai — только вместе с самим собой');
    if (!A.prompt && !A.msg && !A.site) err(id, 'vis.ai: нужен prompt, msg или site');
    const L3ok = (v, what) => { if (v == null) return; if (typeof v === 'string') { if (UZ_BAD_APOS.test(v)) err(id, `vis.ai ${what}: апостроф не ASCII`); return; }
      if (typeof v !== 'object') return err(id, `vis.ai ${what}: текст`);
      for (const l of LANGS) { if (typeof v[l] !== 'string') err(id, `vis.ai ${what}: нет языка ${l}`); }
      if (typeof v.uz === 'string' && UZ_BAD_APOS.test(v.uz)) err(id, `vis.ai ${what}: uz апостроф не ASCII`); };
    const walk = (v, path) => { if (v == null) return; if (typeof v === 'string' || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length && Object.keys(v).every((k) => LANGS.includes(k)))) return L3ok(v, path);
      if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`)); else if (typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`)); };
    walk(A, 'ai');
    if (A.prompt) {
      if (!Array.isArray(A.prompt) || !A.prompt.length || A.prompt.length > 8) err(id, 'vis.ai.prompt: 1–8 строк');
      else A.prompt.forEach((r, i) => { if (!r.lab && !(Number.isInteger(r.q) && r.q >= 0 && r.q <= 6)) err(id, `vis.ai.prompt[${i}]: q 0–6 или lab`); });
    }
    if (A.msg && (!A.msg.who || !A.msg.text)) err(id, 'vis.ai.msg: who и text');
    if (A.site) {
      const S = A.site;
      if (!S.title || !S.c || !S.c2) err(id, 'vis.ai.site: title, c, c2');
      if (!S.mobile && !(Array.isArray(S.nav) && S.nav.length)) warn(id, 'vis.ai.site: нет меню nav');
    }
  } else if (q.vis) {
    const cssMode = q.vis.css != null || q.vis.html != null;
    if (cssMode && (q.vis.code != null || q.vis.page != null)) err(id, 'vis: css/html и code/page вместе нельзя');
    if (!cssMode && (q.vis.base != null || q.vis.goal != null)) err(id, 'vis: base/goal — только с css/html');
    if (q.vis.vw != null && !(Number.isInteger(q.vis.vw) && q.vis.vw >= 320 && q.vis.vw <= 900)) err(id, 'vis.vw: ширина страницы 320–900');
    for (const l of LANGS) {
      const V = visL(q.vis, l); const code = V.code; const page = V.page;
      if ((q.vis.code != null || q.vis.css != null) && typeof code !== 'string') err(id, `vis: нет кода на ${l}`);
      if ((q.vis.page != null || q.vis.html != null) && typeof page !== 'string') err(id, `vis: нет страницы на ${l}`);
      if (cssMode && pickL(q.vis.html, l) && pickL(q.vis.html, l).includes('___')) err(id, 'vis.html: ___ только в css');
      if (cssMode && code && (/<\/?[a-z]+[\s>]/i.test(code))) err(id, 'vis.css: в CSS попал HTML-тег');
      if (code) {
        const lines = code.replace(/^\n+|\s+$/g, '').split('\n');
        const max = page ? 8 : 10;
        if (lines.length > max) err(id, `vis.code: ${lines.length} строк (можно ${max})`);
        if (lines.some((s) => s.length > 52)) warn(id, `vis.code (${l}): строка длиннее 52`);
        if (l === 'uz' && UZ_BAD_APOS.test(code)) err(id, 'vis.code uz: апостроф не ASCII');
      }
      if (!cssMode && q.vis.page === true && code && code.includes('___')) err(id, 'vis: page:true с ___');
      if (page && /<script/i.test(page)) err(id, 'vis: script на странице');
    }
  }
}

// Сборка вопросов банка: верные — по местам A–D поровну.
const r = rng(20261118);
// Место верного: где меньше всего верных — в уроке и во всём банке (ничья — случайно). Вопросы с sort: true ставят верный
// туда, куда он встал по порядку, а остальные выравнивают счёт.
const gCnt = [0, 0, 0, 0];
const lCnt = {};
const bank = all.map((q) => {
  const lc = lCnt[q.lesson] || (lCnt[q.lesson] = [0, 0, 0, 0]);
  let vis = null;
  if (q.vis) {
    const v = {};
    for (const k of ['code', 'page', 'css', 'html', 'base', 'goal', 'vw', 'ai']) if (q.vis[k] != null) v[k] = q.vis[k];
    if (q.vis.mark && q.vis.mark.length) v.mark = q.vis.mark;
    vis = '@htmlvis:' + JSON.stringify(v);
  }
  const base = {
    question_id: q.id, module: MOD, block_id: MOD, lesson: q.lesson,
    topic: META.topics[q.lesson], difficulty: q.difficulty,
  };
  const tail = (o) => {
    Object.assign(o, {
      solution_explanation: L3((l) => q[l].why),
      tags: [`dars${String(q.lesson).padStart(2, '0')}`, ...(q.tags || [])],
      status: 'Approved', source_provenance: 'original',
    });
    if (q.mono) o.mono = true;
    return o;
  };
  const plain = (type, correct, extra) => tail(Object.assign(base, {
    question_type: type, context: L3((l) => q[l].ctx || ''), question_text: L3((l) => q[l].q),
    vis, options: [], correct_answer: correct, accepted_answers: [correct],
  }, extra || {}));
  // «Собери»: варианты — кусочки (перемешаны), ответ — id кусочков по порядку через запятую: "c,a,d".
  if (q.type === 'build') {
    const src = [...q.pieces, ...(q.extra || [])];
    let order = shuffle(src.map((_, i) => i), r);
    // кусочки не должны лежать уже собранными: верные подряд в начале — перемешать ещё раз
    for (let t = 0; t < 20 && q.pieces.every((_, k) => order[k] === k); t++) order = shuffle(order, r);
    const ids8 = 'abcdefgh'.split('');
    const options = order.map((k, i) => ({ id: ids8[i], text: L3((l) => String(src[k] && typeof src[k] === 'object' ? src[k][l] : src[k])) }));
    const correct = q.pieces.map((_, k) => ids8[order.indexOf(k)]).join(',');
    return tail(Object.assign(base, {
      question_type: 'assemble', context: L3((l) => q[l].ctx || ''), question_text: L3((l) => q[l].q),
      vis, options, correct_answer: correct, accepted_answers: [correct],
    }));
  }
  if (q.type === 'bug') return plain('find_error', String(q.line));    // ответ — номер строки
  if (q.type === 'tap') return plain('tap_page', String(q.answer));     // ответ — data-t нажатого места
  // «Впиши ответ»: вариантов нет, correct_answer — образец, accepted_answers — все верные записи (сравнение — normAnswer).
  if (q.type === 'input') {
    return tail(Object.assign(base, {
      question_type: 'text_input', context: L3((l) => q[l].ctx || ''), question_text: L3((l) => q[l].q),
      vis, options: [], correct_answer: q.answer[0], accepted_answers: q.answer.slice(),
    }));
  }
  let order;   // order[k] = индекс исходного варианта на месте k
  if (q.sort) {
    order = [0, 1, 2, 3].sort((a, b) => String(q.uz.opts[a]).localeCompare(String(q.uz.opts[b]), 'en', { numeric: true }));
  } else {
    const score = [0, 1, 2, 3].map((k) => lc[k] * 4 + gCnt[k] + r() * 0.5);
    const pos = score.indexOf(Math.min(...score));
    const others = shuffle([1, 2, 3], r);
    order = []; let k = 0;
    for (let i = 0; i < 4; i++) order.push(i === pos ? 0 : others[k++]);
  }
  const cp = order.indexOf(0); gCnt[cp]++; lc[cp]++;
  const ids4 = ['a', 'b', 'c', 'd'];
  const options = order.map((src, i) => ({ id: ids4[i], text: L3((l) => String(q[l].opts[src])) }));
  return tail(Object.assign(base, {
    question_type: 'single_choice', context: L3((l) => q[l].ctx || ''), question_text: L3((l) => q[l].q),
    vis, options, correct_answer: ids4[order.indexOf(0)],
  }));
});

const pos = { a: 0, b: 0, c: 0, d: 0 };
const choice = bank.filter((q) => q.question_type === 'single_choice');
choice.forEach((q) => { pos[q.correct_answer]++; });
const diff = {}; bank.forEach((q) => { diff[q.difficulty] = (diff[q.difficulty] || 0) + 1; });
const withVis = bank.filter((q) => q.vis).length;
const byType = {}; bank.forEach((q) => { byType[q.question_type] = (byType[q.question_type] || 0) + 1; });
console.log(`Вопросов: ${bank.length} ${JSON.stringify(byType)} · верный ответ по местам: A ${pos.a}, B ${pos.b}, C ${pos.c}, D ${pos.d} · сложность: ${JSON.stringify(diff)} · с картинкой: ${withVis}`);
for (let n = 1; n <= META.lessons; n++) {
  const l = bank.filter((q) => q.lesson === n);
  const p = { a: 0, b: 0, c: 0, d: 0 }; l.forEach((q) => { if (q.question_type === 'single_choice') p[q.correct_answer]++; });
  console.log(`  урок ${n}: ${l.length} вопросов (с выбором ${l.filter((q) => q.question_type === 'single_choice').length}), A${p.a} B${p.b} C${p.c} D${p.d}, с картинкой ${l.filter((q) => q.vis).length}`);
}
if (warns.length) { console.log(`\nЗамечания (${warns.length}):`); warns.forEach((w) => console.log('  · ' + w)); }
if (errors.length) { console.log(`\nОШИБКИ (${errors.length}):`); errors.forEach((e) => console.log('  ✗ ' + e)); process.exit(1); }
if (checkOnly) { console.log('\nПроверка пройдена.'); process.exit(0); }

fs.mkdirSync(OUT, { recursive: true });
const jsxName = `trenajor_${MOD}_v1.jsx`;
const bankName = `savollar_banki_${MOD}_v1.json`;
const src = fs.readFileSync(path.join(ROOT, 'tools/trenajor/trenajor.jsx'), 'utf8');
const head = `// @junior-trainer ${MOD} v1 — СОБРАН node tools/trenajor/build.mjs ${MOD} из tools/trenajor/trenajor.jsx. Править исходник, не этот файл.\n// LMS: этот JSX + ${bankName} (${bank.length} вопросов: single_choice, text_input, assemble, find_error, tap_page; block_id "${MOD}", у каждого — lesson).\n`;
fs.writeFileSync(path.join(OUT, jsxName), head + src);
fs.writeFileSync(path.join(OUT, bankName), JSON.stringify(bank, null, 1) + '\n');
console.log(`\nГотово: trenajor/${MOD}/${jsxName} (${(fs.statSync(path.join(OUT, jsxName)).size / 1024).toFixed(1)} КБ), trenajor/${MOD}/${bankName} (${(fs.statSync(path.join(OUT, bankName)).size / 1024).toFixed(1)} КБ)`);
