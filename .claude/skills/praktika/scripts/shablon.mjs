// Шаблон исходника новой практики из эталона 01p.
//
//   node .claude/skills/praktika/scripts/shablon.mjs <исходник.jsx> [эталон.jsx]
//
// Пишет в исходник: шапку файла, метку /*@CANON@*/ и всю урочную часть эталона
// (всё ниже пометки «УРОК»). Эталон по умолчанию — lessons/html/01p-struktura-dokumenta.jsx.
// Дальше исходник правится под тему (см. references/karkas.md навыка praktika),
// а файл практики собирается: node .claude/skills/novyy-urok/scripts/sobrat.mjs <исходник> <файл>.
// Существующий исходник не перезаписывается.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [outArg, refArg] = process.argv.slice(2);
if (!outArg) { console.log('Использование: node shablon.mjs <исходник.jsx> [эталон.jsx]'); process.exit(1); }
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const out = resolve(outArg);
if (existsSync(out)) { console.log('Исходник уже есть, не перезаписываю: ' + outArg); process.exit(1); }
const ref = resolve(root, refArg || 'lessons/html/01p-struktura-dokumenta.jsx');
const src = readFileSync(ref, 'utf8');
const canon = readFileSync(resolve(root, 'canon/html/canon-v1.jsx'), 'utf8').replace(/\n+$/, '');
const at = src.indexOf(canon);
if (at < 0) throw new Error('В эталоне нет канона дословно: ' + ref);
const MARK = '// ==============================  У Р О К  =====================================';
const m = src.indexOf(MARK, at + canon.length);
if (m < 0) throw new Error('В эталоне нет пометки «УРОК» после канона');
const lesson = src.slice(m + MARK.length);
const head = [
  '// =============================================================================',
  '// КУРС «HTML» · Практика к уроку N — «Название операции»  ← заполнить',
  '// Дети 11–14. Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.',
  '// =============================================================================',
  '/*@CANON@*/'
].join('\n');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, head + lesson);
console.log('Шаблон практики: ' + outArg + ' (' + lesson.split('\n').length + ' строк урочной части из ' + (refArg || '01p') + ').');
console.log('Дальше: переписать под тему разделы «под тему» из references/karkas.md, затем собрать sobrat.mjs.');
