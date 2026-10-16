// Сборка тестовой версии урока 3 курса HTML «Списки».
//   node tools/spiski/spiski.build.mjs → lessons/test/04-spiski.jsx
// Файл урока = шапка + канон курса HTML (дословно, не правится) + пометка
// «УРОК» + spiski.src.jsx, куда встают помощники урока 2 (строки от «ТЕГИ
// ВСЛУХ» до «Артефакт урока»), CSS урока 2 и свой CSS (sp-own.css).
// Помощники и CSS берутся из lessons/html/02-zagolovki-i-tekst.jsx при каждой
// сборке — по пометкам, а не по номерам строк.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => readFileSync(here(p), 'utf8');
const canon = read('../../canon/html/canon-v1.jsx').replace(/\n+$/, '');
const l2 = read('../../lessons/html/02-zagolovki-i-tekst.jsx');
const cut = (s, a, b) => {
  const i = s.indexOf(a), j = s.indexOf(b, i + 1);
  if (i < 0 || j < 0) throw new Error('нет пометки ' + (i < 0 ? a : b));
  return s.slice(i, j);
};
// Помощники: от заголовка «ТЕГИ ВСЛУХ» до makeArtifact урока 2 (у урока 3 свой).
const helpers = cut(l2, '// ─────────────────────────────────────────────────────────────────────────────\n// ТЕГИ ВСЛУХ',
  '// Артефакт урока для payload').trim()
  // Без частей, завязанных на данные урока 2 (ROBO, C.s11): в уроке 3 их нет.
  .replace(cut(l2, '// Страница Коди о робофутболе', '// Предложения блока'), '')
  .replace(cut(l2, '// Кнопки тегов выделения', '// Кнопки уровня заголовка'), '');
// CSS урока 2: содержимое шаблонной строки LESSON_CSS (без CANON_SCREEN_CSS).
const cssStart = 'const LESSON_CSS = CANON_SCREEN_CSS + `\n';
const css = cut(l2, cssStart, '\n`;').slice(cssStart.length).trim();

let src = read('./spiski.src.jsx');
const put = (mark, text) => {
  if (src.indexOf(mark) < 0) throw new Error('нет метки ' + mark);
  src = src.split(mark).join(text);
};
put('/*@L2_HELPERS@*/', helpers);
put('/*@L2_CSS@*/', css);
put('/*@OWN_CSS@*/', read('./sp-own.css').trim());

const head = `// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Списки» — урок 3 курса HTML, проба перед переносом в курс
// 11–14 лет, 16 экранов. Сценарий: docs/scenarij-03-spiski.md.
// Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
//
// Пропсы: { studentName, lang, ttsApiBase, voiceGender, onFinished } — весь список.
// ФАЙЛ СОБРАН: node tools/spiski/spiski.build.mjs. Правится
// tools/spiski/spiski.src.jsx и sp-own.css, а не этот файл.
// =============================================================================
`;
const out = head + '\n' + canon + '\n' + '// ==============================  У Р О К  =====================================\n' + src;
const dest = here('../../lessons/test/04-spiski.jsx');
writeFileSync(dest, out);
console.log('wrote', dest, Math.round(out.length / 1024) + ' KB');
