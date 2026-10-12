// Проверка: канон внутри уроков курса совпадает с canon/<курс>/canon-v1.jsx
// дословно, а урок стоит ниже пометки «УРОК».
//
//   node tools/check-canon.mjs            — все уроки курса html
//   node tools/check-canon.mjs css        — уроки другого курса

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const course = process.argv[2] || 'html';
const canon = readFileSync(`${root}canon/${course}/canon-v1.jsx`, 'utf8');
const dir = `${root}lessons/${course}/`;
const files = readdirSync(dir).filter((f) => /^\d+.*\.jsx$/.test(f));

let bad = 0;
for (const f of files) {
  const src = readFileSync(dir + f, 'utf8');
  const at = src.indexOf(canon);
  if (at < 0) { bad += 1; console.log(`✗ ${f}: канон не совпадает с canon/${course}/canon-v1.jsx`); continue; }
  // Слово «У Р О К О В» встречается и внутри канона — пометку ищем после него.
  const marker = src.indexOf('==  У Р О К  ==', at + canon.length);
  if (marker < 0) { bad += 1; console.log(`✗ ${f}: пометка «УРОК» стоит не после канона`); continue; }
  console.log(`✓ ${f}: канон совпадает (${canon.split('\n').length} строк)`);
}
if (!files.length) console.log(`В lessons/${course}/ пока нет уроков.`);
process.exit(bad ? 1 : 0);
