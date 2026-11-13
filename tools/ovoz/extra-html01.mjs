// Добавки озвучки урока HTML 1 (13.11.2026): реплики с готовыми словами урока, которые экраны собирают из шаблона
// («title tegida «{w}» deb yozilgan…», ««{w}» oynaga tushib qoldi…»). Все варианты слов — из данных урока.
//   node tools/ovoz/extra-html01.mjs → tools/ovoz/extra/html-01-struktura-dokumenta.json
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLesson, LANGS } from './collect.mjs';
import { writeExtra, stripBlock } from './ovoz.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const file = join(root, 'lessons/html/01-struktura-dokumenta.jsx');
const r = await collectLesson(stripBlock(readFileSync(file, 'utf8')), 'h01');
const { __C: C, __fillL: fillL } = r.mod;
const s8 = Object.values(C).find((x) => x && x.askTitle && x.rounds);
const q1 = Object.values(C).find((x) => x && x.toWin && x.toTab);
const out = {};
for (const L of LANGS) {
  const lines = new Set();
  const words = s8.rounds.flatMap((x) => [x.word, x.extra]);
  for (const w of words) for (const t of [s8.askTitle, s8.askBody]) for (const v of new Set([w[L], w[L].replace(/[!?.]+$/, '')])) lines.add(fillL(t, { w: v })[L]);   // на экране слово звучит и без «!» в конце
  for (const w of [q1.tabWord, q1.winWord].filter(Boolean)) for (const t of [q1.toWin, q1.toTab]) lines.add(fillL(t, { w: w[L] })[L]);
  out[L] = [...lines].map((s) => r.clean(s, L));
}
writeExtra(file, out);
console.log(LANGS.map((L) => L + ' ' + out[L].length).join(', '));
console.log(out.uz.slice(0, 2).join('\n'));
