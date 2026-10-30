#!/usr/bin/env node
// Проверка узбекских строк урока или практики (навык /uzbekcha).
//   node .claude/skills/uzbekcha/scripts/tekshir.mjs <файл> [<файл> …] [--soveti] [--tolko-oshibki]
// Берёт узбекские строки — первый аргумент L3('uz', 'ru', 'en') и свойства uz: '…' —
// и ищет то, что ломает озвучку, обращение и стиль курса (references/lugat.md, ovoz.md, uslub.md).
//   ОШИБКА — исправить обязательно (код выхода 1);
//   СОВЕТ  — книжное слово или спорное место: посмотреть глазами, по стилю v3 обычно заменить.
// Скрипт не понимает смысл: он не заменяет чтение реплик вслух и сверку с ru/en.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));
const onlyErr = args.includes('--tolko-oshibki');
if (!files.length) {
  console.log('Использование: node .claude/skills/uzbekcha/scripts/tekshir.mjs <файл> [--tolko-oshibki]');
  process.exit(2);
}

// ── Извлечение строк ────────────────────────────────────────────────────────
// Строка JS в ' " или ` начиная с позиции i; возвращает { text, end }.
function readStr(src, i) {
  const q = src[i];
  let out = '';
  let j = i + 1;
  while (j < src.length && src[j] !== q) {
    if (src[j] === '\\') { out += src[j + 1]; j += 2; continue; }
    if (q === '`' && src[j] === '$' && src[j + 1] === '{') { // ${…} — пометка, не текст
      let d = 1; j += 2;
      while (j < src.length && d) { if (src[j] === '{') d += 1; else if (src[j] === '}') d -= 1; j += 1; }
      out += '{…}';
      continue;
    }
    out += src[j]; j += 1;
  }
  return { text: out, end: j + 1 };
}
function uzStrings(src) {
  const res = [];
  const re = /\bL3\(\s*(['"`])|\buz\s*:\s*(['"`])/g;
  let m;
  while ((m = re.exec(src))) {
    const at = m.index + m[0].length - 1;
    const { text, end } = readStr(src, at);
    const line = src.slice(0, at).split('\n').length;
    res.push({ text, line });
    re.lastIndex = end;
  }
  return res;
}

// ── Правила ─────────────────────────────────────────────────────────────────
const TAGW = 'html|head|title|body|doctype|h[1-6]|ul|ol|li|img|src|alt|href|div|span|meta|link|style|script|table|form|input|button|strong|em';
const ATTR = /^(src|alt|href|width|height|target|lang|charset)$/i;
// Аффикс — к слову teg / atribut: «body tegidan», «src atributiga» (или «body ichida»).
const AFX = { ni: 'ni', ga: 'ga', da: 'da', dagi: 'dagi', dan: 'dan', ning: 'ning', lar: 'lari', larni: 'larini', dek: 'dek' };
const fixOf = (w, a) => {
  const x = AFX[(a || 'ni').toLowerCase()] || 'ni';
  return ATTR.test(w) ? `«${w} atributi${x}»` : `«${w} tegi${x}»` + (/^(da|dagi|dan)$/i.test(a) ? ` или «${w} ichi${x}»` : '');
};
const RULES = [
  // Написание
  { lvl: 'ОШИБКА', re: /[oOgG](['`ʻʼ´])/g, msg: (m) => `«${m[0]}» → o‘ / g‘ (знак ‘ U+2018)` },
  { lvl: 'ОШИБКА', re: /[a-fh-np-zA-FH-NP-Z](['ʻʼ`])(?=[a-z])/g, msg: (m) => `«${m[0]}…» → ’ (U+2019): ma’lumot, a’lo` },
  { lvl: 'ОШИБКА', re: /[А-Яа-яЁё]{2,}/g, msg: (m) => `кириллица в узбекской строке: «${m[0]}»` },
  // Обращение — только «Siz»
  { lvl: 'ОШИБКА', re: /\b(sen|seni|senga|sening|sendan|senda)\b/gi, msg: (m) => `«${m[0]}» — обращение только на «Siz»` },
  { lvl: 'ОШИБКА', re: /\b(bos|yoz|qara|tanla|tekshir|sur|olib bor|ko‘r)(?=[!.?,]|$)/g, msg: (m) => `«${m[0]}» — повеление на «Siz»: «${/[aeiou‘]$/.test(m[0]) ? m[0] + 'ng' : m[0] + 'ing'}»` },
  // Английское слово + аффикс
  { lvl: 'ОШИБКА', re: new RegExp(`\\b(${TAGW})\\s+(ni|ga|da|dagi|dan|ning|lar|larni|dek)\\b`, 'gi'), msg: (m) => `«${m[0]}» — аффикс не отделяется от английского слова: ${fixOf(m[1], m[2])}` },
  { lvl: 'ОШИБКА', re: new RegExp(`\\b(${TAGW})(ni|ga|da|dagi|dan|ning)\\b`, 'gi'), msg: (m) => `«${m[0]}» — не клеить аффикс к английскому слову: ${fixOf(m[1], m[2])}` },
  // Запреты курса
  // Про ответ ученика — никогда; про поломку страницы или промах самого Коди заказчик так пишет (урок 1, экран 14).
  { lvl: 'СОВЕТ', re: /\b(xato\w*|noto‘g‘ri\w*)/gi, msg: (m) => `«${m[0]}» — если это про ответ ученика, заменить: «Oz qoldi!», «Hechqisi yo‘q!», «Unday emas:», «Bu safar adashdingiz!»; про сломанную страницу или промах Коди — можно` },
  { lvl: 'ОШИБКА', re: /\b(veb-usta|varaqcha)\b/gi, msg: (m) => `«${m[0]}» — не используется (veb-dasturchi; yorliq)` },
  { lvl: 'СОВЕТ', re: /\bKlass\b/g, msg: () => '«Klass!» — заказчик просил «Ajoyib!»' },
];
// Текст, который уйдёт в озвучку: теги в угловых скобках и знак в «» рядом с названием движок убирает сам.
const speechRules = (t) => {
  const out = [];
  const s0 = t.replace(/\{[a-z]+\}\/\d+/gi, ' ').replace(/<\/?!?[a-zA-Z{][^<>]*>/g, ' ').replace(/«[<>/=]»/g, ' ').replace(/\{…\}|\{[a-z]+\}/g, ' ');
  // Код в «кавычках» («<img», «src=») — обычно печатная строка; в речи проверить по журналу.
  const quoted = /«[^»]*[<>/=][^»]*»/.test(s0);
  if (quoted) out.push({ lvl: 'СОВЕТ', msg: 'кусок кода в «кавычках» — если строка звучит, проверить озвучку в журнале просмотрщика' });
  const s = s0.replace(/«[^»]*»/g, (q) => q.replace(/[<>/=%+]/g, ' ')).replace(/\{[a-z]+\}\/\d+/gi, ' ');
  const sym = s.match(/[%+=×²/]/);
  if (sym) out.push({ lvl: 'ОШИБКА', msg: `символ «${sym[0]}» в речи — только словами` });
  const br = s.match(/[<>]/);
  if (br) out.push({ lvl: 'ОШИБКА', msg: `знак «${br[0]}» без названия — назвать словами: «chap burchakli qavs», «o‘ng burchakli qavs» (или «<» рядом с названием)` });
  if (/\s[—–-]\s/.test(s)) out.push({ lvl: 'СОВЕТ', msg: 'тире в реплике: движок сделает из него точку — если это пауза-пояснение, переписать двумя фразами или через двоеточие' });
  if (/[()]/.test(s)) out.push({ lvl: 'СОВЕТ', msg: 'скобки в реплике — переписать фразу без скобок' });
  const words = s.split(/\s+/).filter(Boolean).length;
  if (words > 80) out.push({ lvl: 'ОШИБКА', msg: `${words} слов — реплика до 60–80 слов (~25 с)` });
  else if (words > 55) out.push({ lvl: 'СОВЕТ', msg: `${words} слов — длинно, лучше разбить на две реплики` });
  return out;
};
// Книжное → разговорное (по сравнению v2 → v3 заказчика, references/uslub.md).
const BOOKISH = [
  [/\bavval\b/gi, 'avval → oldin'],
  [/\bdarhol\b/gi, 'darhol → darrov / shu zahoti'],
  [/\bDeyarli\b/g, 'Deyarli! → Oz qoldi!'],
  [/\bjoylash(adi|gan)\b/gi, 'joylashadi → turadi / yashaydi'],
  [/\bbirin-ketin\b/gi, 'birin-ketin → bittalab'],
  [/\boras(i|i)(ga|da)\b/gi, 'orasiga / orasida → o‘rtasiga / o‘rtasida'],
  [/\bikki [a-z]+ teg/gi, 'ikki … tegi → ikkita … tegi'],
  [/\bnima uchun\b/gi, 'nima uchun → nimaga'],
  [/\bEsda tuting\b/gi, 'Esda tuting → Esingizda bo‘lsin'],
  [/\bdeb ataladi\b/gi, 'deb ataladi → deyiladi / «…ning nomi …»'],
  [/\bo‘z ichiga oladi\b/gi, 'o‘z ichiga oladi → o‘rab turadi / quchoqlab turadi'],
  [/\bMukammal\b/g, 'Mukammal! → Juda zo‘r!'],
  [/\bAynan!/g, 'Aynan! → Xuddi shunday!'],
  [/\byuqoridan\b/gi, 'yuqoridan → tepadan'],
  [/\btorting\b/gi, 'torting → olib boring (или «suring» — как в уроке)'],
  [/\beslang\b/gi, 'eslang → …esingizdami?'],
];

let errN = 0, sovN = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const strs = uzStrings(src);
  const hasYorliq = strs.some((s) => /\byorliq/i.test(s.text));
  const hasVaraq = strs.some((s) => /brauzer varag‘/i.test(s.text));
  console.log(`\n${f}: узбекских строк — ${strs.length}`);
  for (const { text, line } of strs) {
    const found = [];
    for (const r of RULES) {
      r.re.lastIndex = 0;
      let m;
      while ((m = r.re.exec(text))) { found.push({ lvl: r.lvl, msg: r.msg(m) }); if (!r.re.global) break; }
    }
    found.push(...speechRules(text));
    for (const [re, tip] of BOOKISH) { re.lastIndex = 0; if (re.test(text)) found.push({ lvl: 'СОВЕТ', msg: tip }); }
    const shown = onlyErr ? found.filter((x) => x.lvl === 'ОШИБКА') : found;
    if (!shown.length) continue;
    const cut = text.length > 110 ? text.slice(0, 107) + '…' : text;
    console.log(`  ${f}:${line}  «${cut}»`);
    for (const x of shown) {
      console.log(`    ${x.lvl}: ${x.msg}`);
      if (x.lvl === 'ОШИБКА') errN += 1; else sovN += 1;
    }
  }
  if (hasYorliq && hasVaraq && !onlyErr) {
    console.log('  СОВЕТ: в файле и «yorliq», и «brauzer varag‘i» — вкладка называется одним словом на весь урок');
    sovN += 1;
  }
}
console.log(`\nИтого: ошибок — ${errN}, советов — ${sovN}.`);
process.exit(errN ? 1 : 0);
