// Исходник новой практики — копия готовой практики в облике «Редактор»: по умолчанию каркаса 01p
// «Пять вкладок Коди» (tools/amaliyot1/), для практик к урокам 2+ — удобнее 02p «Газета Коди»
// (tools/amaliyot2/: заголовки, абзацы, b и i, страница из блоков).
//
//   node .claude/skills/praktika/scripts/shablon.mjs tools/<папка> [эталон-папка]
//
// Копирует build.mjs, aK.src.jsx, aK-screens.jsx, aK.css, .gitignore эталона (K — его номер) в новую
// папку под именами aN.* (N — число в конце имени папки, например tools/amaliyot3 → a3.*) и правит в
// них пути сборки. Файл практики в build.mjs — заглушка lessons/<курс>/<NN>p-<slug>.jsx: заменить.
// Имена aK в коде (функции, классы) не меняются — переименовать по желанию.
// Дальше исходник правится под тему (references/karkas.md навыка praktika), сборка — node tools/<папка>/build.mjs.
// Существующая папка с исходником не перезаписывается.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const [outArg, refArg] = process.argv.slice(2);
if (!outArg) { console.log('Использование: node shablon.mjs tools/<папка> [эталон-папка]'); process.exit(1); }
const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');
const out = resolve(root, outArg);
const refRel = (refArg || 'tools/amaliyot1').replace(/\/$/, '');
const ref = resolve(root, refRel);
// Префикс эталона — по его исходнику (tools/amaliyot1 → a1, tools/amaliyot2 → a2).
const src0 = readdirSync(ref).find((f) => /^a\d+\.src\.jsx$/.test(f)) || 'a1.src.jsx';
const pre = src0.replace(/\.src\.jsx$/, '');
const m = /(\d+)\s*$/.exec(basename(out));
const n = m ? String(Number(m[1])) : 'N';
const name = (f) => f.replace(new RegExp('^' + pre), 'a' + n);
const files = ['build.mjs', pre + '.src.jsx', pre + '-screens.jsx', pre + '.css', '.gitignore'];
if (existsSync(resolve(out, name(pre + '.src.jsx')))) { console.log('Исходник уже есть, не перезаписываю: ' + outArg); process.exit(1); }
mkdirSync(out, { recursive: true });
const dir = outArg.replace(/\/$/, '');
files.forEach((f) => {
  let s = readFileSync(resolve(ref, f), 'utf8');
  s = s.split(pre + '-screens.jsx').join(name(pre + '-screens.jsx')).split(pre + '.src.jsx').join(name(pre + '.src.jsx'))
    .split('/*@FILE:' + pre + '.css@*/').join('/*@FILE:' + name(pre + '.css') + '@*/').split(pre + '.css').join(name(pre + '.css'))
    .split(refRel + '/').join(dir + '/');
  if (f === 'build.mjs') s = s.replace(/lessons\/html\/\d+p-[\w-]+\.jsx/g, 'lessons/<курс>/<NN>p-<slug>.jsx');
  writeFileSync(resolve(out, name(f)), s);
});
console.log('Исходник практики: ' + outArg + ' (' + files.map(name).join(', ') + ') — копия ' + refRel + '.');
console.log('Дальше: в build.mjs — путь файла практики; под тему — разделы из references/karkas.md; имена ' + pre + ' в коде можно оставить или сменить на свой префикс.');
