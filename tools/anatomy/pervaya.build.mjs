// Сборка тестового урока «Моя первая страница: исследуй, собери, создай».
//   node tools/anatomy/pervaya.build.mjs → lessons/test/03-pervaya-stranitsa.jsx
// Файл урока = шапка + канон курса HTML (дословно, не правится) + пометка
// «УРОК» + pervaya.src.jsx, куда встают: помощники урока 1 (zh-helpers.jsx),
// общие части интерфейса (pv-ui.jsx), фигура (pervaya.figures.mjs), CSS урока 1
// (zaglyani.css), базовый CSS моделей (pv-base.css), свой CSS (pv-own.css) и
// CSS кита anatomy.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as k from './kit/iso-kit.mjs';
import { docModel } from './pervaya.figures.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => readFileSync(here(p), 'utf8');
const canon = read('../../canon/html/canon-v1.jsx').replace(/\n+$/, '');
let src = read('./pervaya.src.jsx');
const put = (mark, text) => {
  if (src.indexOf(mark) < 0) throw new Error('нет метки ' + mark);
  src = src.split(mark).join(text);
};
const tpl = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
put('/*@HELPERS@*/', read('./zh-helpers.jsx').trim());
put('/*@UI@*/', read('./pv-ui.jsx').trim());
put('/*@FIGURES@*/', 'const FIG = ' + JSON.stringify(docModel()) + ';');
put('/*@LESSON1_CSS@*/', read('./zaglyani.css').trim());   // CSS внутри шаблонной строки урока
put('/*@ISO_CSS@*/', tpl(k.ISO_CSS.trim()));
put('/*@FIG_CSS@*/', read('./pv-base.css').trim());
put('/*@OWN_CSS@*/', read('./pv-own.css').trim());

const head = `// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Моя первая страница: исследуй, собери, создай»
// Эксперимент: интерактивный HTML + Anatomy. Тема урока 1 курса HTML, 11–14 лет,
// 14 экранов. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
//
// Пропсы: { studentName, lang, ttsApiBase, voiceGender, onFinished } — весь список.
// ФАЙЛ СОБРАН: node tools/anatomy/pervaya.build.mjs. Правится
// tools/anatomy/pervaya.src.jsx, pv-own.css и pervaya.figures.mjs, а не этот файл.
// =============================================================================
`;
const out = head + '\n' + canon + '\n' + '// ==============================  У Р О К  =====================================\n' + src;
const dest = here('../../lessons/test/03-pervaya-stranitsa.jsx');
writeFileSync(dest, out);
console.log('wrote', dest, Math.round(out.length / 1024) + ' KB');
