// Сборка тестового урока «HTML: загляни внутрь страницы — эксперимент».
//   node tools/anatomy/zaglyani.build.mjs → lessons/test/02-zaglyani-vnutr.jsx
// Файл урока = шапка + канон курса HTML (дословно, не правится) + пометка
// «УРОК» + zaglyani.src.jsx, где на место меток встают: помощники урока 1
// (zh-helpers.jsx: произношение тегов, код, мини-браузер, провод), CSS урока 1
// (zaglyani.css), посчитанная фигура — шкаф документа (shkaf.figures.mjs) и CSS кита anatomy.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as k from './kit/iso-kit.mjs';
import { cabinetModel } from './shkaf.figures.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const canon = readFileSync(here('../../canon/html/canon-v1.jsx'), 'utf8').replace(/\n+$/, '');
let src = readFileSync(here('./zaglyani.src.jsx'), 'utf8');
const put = (mark, text) => {
  if (src.indexOf(mark) < 0) throw new Error('нет метки ' + mark);
  src = src.split(mark).join(text);
};
const tpl = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
put('/*@HELPERS@*/', readFileSync(here('./zh-helpers.jsx'), 'utf8').trim());
put('/*@FIGURES@*/', 'const FIG = ' + JSON.stringify(cabinetModel()) + ';');   // шкаф документа (заказчик, 17.10.2026)
put('/*@LESSON1_CSS@*/', readFileSync(here('./zaglyani.css'), 'utf8').trim());   // уже внутри шаблонной строки
put('/*@ISO_CSS@*/', tpl(k.ISO_CSS.trim()));

const head = `// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «HTML: загляни внутрь страницы — эксперимент»
// Урок 1 курса HTML заново: объёмная модель документа (навык anatomy) рядом с
// мини-браузером и настоящим кодом. 8 этапов, 11–14 лет.
// Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
//
// Пропсы: { studentName, lang, ttsApiBase, voiceGender, onFinished } — весь список.
// ФАЙЛ СОБРАН: node tools/anatomy/zaglyani.build.mjs. Правится
// tools/anatomy/zaglyani.src.jsx и shkaf.figures.mjs, а не этот файл.
// =============================================================================
`;
const out = head + '\n' + canon + '\n' + '// ==============================  У Р О К  =====================================\n' + src;
const dest = here('../../lessons/test/02-zaglyani-vnutr.jsx');
writeFileSync(dest, out);
console.log('wrote', dest, Math.round(out.length / 1024) + ' KB');
