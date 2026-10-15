// Перенос канона в уроки: заменяет блок канона в каждом уроке курса на
// актуальный canon/<курс>/canon-v1.jsx. Запускать после node tools/build-canon.mjs.
//
//   node tools/sync-canon.mjs            — все уроки курса html
//   node tools/sync-canon.mjs css        — уроки другого курса
//
// Блок канона в уроке находится по двум якорям: первые две строки канона
// (шапка «КАНОН УРОКОВ») и его последняя строка. Всё между ними заменяется
// целиком, урок до и после блока не трогается. Если якорь не найден или
// встречается дважды, файл пропускается с объяснением — ничего не ломается.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const course = process.argv[2] || 'html';
const canonPath = `${root}canon/${course}/canon-v1.jsx`;
if (!existsSync(canonPath)) { console.log(`Нет канона ${canonPath}`); process.exit(1); }
const canon = readFileSync(canonPath, 'utf8').replace(/\n+$/, '');
const lines = canon.split('\n');
const startKey = lines.slice(0, 2).join('\n');
const endKey = lines[lines.length - 1];

const dir = `${root}lessons/${course}/`;
const files = readdirSync(dir).filter((f) => /^\d+.*\.jsx$/.test(f));
let bad = 0;
for (const f of files) {
  const src = readFileSync(dir + f, 'utf8');
  const s = src.indexOf(startKey);
  if (s < 0 || src.indexOf(startKey, s + 1) >= 0) { bad += 1; console.log(`✗ ${f}: шапка канона не найдена или встречается дважды`); continue; }
  const e0 = src.indexOf(endKey, s);
  if (e0 < 0) { bad += 1; console.log(`✗ ${f}: конец канона не найден`); continue; }
  const e = e0 + endKey.length;
  if (src.slice(s, e) === canon) { console.log(`· ${f}: канон уже актуален`); continue; }
  writeFileSync(dir + f, src.slice(0, s) + canon + src.slice(e));
  console.log(`✓ ${f}: канон обновлён`);
}
if (!files.length) console.log(`В lessons/${course}/ пока нет уроков.`);
process.exit(bad ? 1 : 0);
