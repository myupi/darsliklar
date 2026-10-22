// Сборка файла урока из исходника: канон курса дословно + урок ниже пометки «УРОК».
//
//   node .claude/skills/novyy-urok/scripts/sobrat.mjs <исходник.jsx> <урок.jsx> [курс]
//
//   курс — папка канона canon/<курс>/canon-v1.jsx, по умолчанию html.
//
// Метки в исходнике (каждая — ровно один раз, кроме FILE):
//   /*@CANON@*/       — здесь встаёт канон и сразу за ним пометка «УРОК».
//                       Всё, что выше метки, — шапка файла (3–4 строки комментария,
//                       как в уроке 2). Без метки канон встаёт в начало файла.
//   /*@L2_HELPERS@*/  — общие помощники курса HTML из урока 2: от «ТЕГИ ВСЛУХ»
//                       до «Артефакт урока для payload» (TAG_SAY, spokenHtml, SPOKEN,
//                       heroLines, SpokenTags, TAGC, модель блоков, Tag, Tok, Src,
//                       Page, MiniBrowser, Wire, DemoHand, лесенка, SegToggle,
//                       InlineInput, Work, useRec, useShake, Inspector, набор тега,
//                       WordLine, LevelRow, GoalCard). Части, завязанные на данные
//                       урока 2 (roboDoc, MarkBtns), вырезаются.
//   /*@L2_CSS@*/      — CSS урока 2 (содержимое его LESSON_CSS без CANON_SCREEN_CSS).
//                       Ставить ВНУТРИ шаблонной строки своего LESSON_CSS.
//   /*@FILE:путь@*/   — вставить файл (путь от папки исходника), например свой CSS.
//
// Помощники и CSS берутся из урока 2 по уникальным якорям, а не по номерам строк:
// если якорь не найден или встречается дважды, сборка останавливается.
// Результат — обычный цельный файл урока; дальше его можно править напрямую.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [srcArg, outArg, course = 'html'] = process.argv.slice(2);
if (!srcArg || !outArg) {
  console.log('Использование: node sobrat.mjs <исходник.jsx> <урок.jsx> [курс]');
  process.exit(1);
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const read = (p) => readFileSync(p, 'utf8');
const MARK = '// ==============================  У Р О К  =====================================';

const once = (hay, needle, label) => {
  const i = hay.indexOf(needle);
  if (i < 0) throw new Error(`Не найден якорь «${label}»`);
  if (hay.indexOf(needle, i + 1) >= 0) throw new Error(`Якорь «${label}» встречается больше одного раза`);
  return i;
};
const cut = (hay, a, b, label) => {
  const i = once(hay, a, label + ': начало');
  const j = hay.indexOf(b, i + a.length);
  if (j < 0) throw new Error(`Не найден конец «${label}»`);
  return hay.slice(i, j);
};

const canon = read(`${root}/canon/${course}/canon-v1.jsx`).replace(/\n+$/, '');
let src = read(resolve(srcArg));
const srcDir = dirname(resolve(srcArg));

const put = (mark, text) => {
  if (src.indexOf(mark) < 0) return false;
  once(src, mark, mark);
  src = src.replace(mark, () => text);
  return true;
};

if (src.indexOf('/*@L2_HELPERS@*/') >= 0 || src.indexOf('/*@L2_CSS@*/') >= 0) {
  // С 22.10.2026 урок 2 переделан в бумажный стиль; помощники берутся из замороженной
  // копии прежнего урока 2 («робофутбол») — tools/l2-helpers/urok2-robofutbol.jsx.
  const l2 = read(`${root}/tools/l2-helpers/urok2-robofutbol.jsx`);
  const helpers = cut(l2, '// ─────────────────────────────────────────────────────────────────────────────\n// ТЕГИ ВСЛУХ',
    '// Артефакт урока для payload', 'помощники урока 2')
    .replace(cut(l2, '// Страница Коди о робофутболе', '// Предложения блока', 'roboDoc'), '')
    .replace(cut(l2, '// Кнопки тегов выделения', '// Кнопки уровня заголовка', 'MarkBtns'), '')
    .trim();
  const cssStart = 'const LESSON_CSS = CANON_SCREEN_CSS + `\n';
  const css = cut(l2, cssStart, '\n`;', 'CSS урока 2').slice(cssStart.length).trim();
  put('/*@L2_HELPERS@*/', helpers);
  put('/*@L2_CSS@*/', css);
}
src = src.replace(/\/\*@FILE:([^@]+)@\*\//g, (m, p) => read(resolve(srcDir, p.trim())).trim());

let out;
if (src.indexOf('/*@CANON@*/') >= 0) {
  const at = once(src, '/*@CANON@*/', 'CANON');
  out = src.slice(0, at) + canon + '\n' + MARK + src.slice(at + '/*@CANON@*/'.length);
} else {
  out = canon + '\n' + MARK + '\n' + src;
}

// Проверки результата.
const left = out.match(/\/\*@[A-Z0-9_]+(:[^@]*)?@\*\//g);
if (left) throw new Error('Остались метки: ' + left.join(', '));
const cAt = once(out, canon, 'канон в результате');
if (out.indexOf('==  У Р О К  ==', cAt + canon.length) < 0) throw new Error('Пометка «УРОК» не после канона');
const lesson = out.slice(cAt + canon.length);
const imports = (lesson.match(/^\s*import .+$/gm) || []);
if (imports.length) throw new Error('Импорты ниже канона запрещены: ' + imports.join(' | '));
if (/from ['"](?!react['"])/.test(out.replace(/^import React[^\n]*$/m, ''))) throw new Error('Есть импорт не из react');
if ((out.match(/export default /g) || []).length !== 1) throw new Error('Нужен ровно один export default');

writeFileSync(resolve(outArg), out);
console.log(`Собран ${outArg}: ${out.split('\n').length} строк, ${Math.round(out.length / 1024)} КБ; канон ${course} дословно, пометка «УРОК» на месте.`);
