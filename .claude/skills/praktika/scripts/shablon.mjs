// Исходник новой практики — копия каркаса практики 01p «Пять вкладок Коди» в облике «Редактор»
// (tools/amaliyot1/, 04.11.2026; прежние бумажные практики удалены заказчиком).
//
//   node .claude/skills/praktika/scripts/shablon.mjs tools/<папка> [эталон-папка]
//
// Копирует build.mjs, a1.src.jsx, a1-screens.jsx, a1.css, .gitignore в новую папку под именами aN.*
// (N — число в конце имени папки, например tools/amaliyot2 → a2.*) и правит в них пути сборки.
// Файл практики в build.mjs — заглушка lessons/<курс>/<NN>p-<slug>.jsx: заменить.
// Дальше исходник правится под тему (references/karkas.md навыка praktika), сборка — node tools/<папка>/build.mjs.
// Существующая папка с исходником не перезаписывается.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const [outArg, refArg] = process.argv.slice(2);
if (!outArg) { console.log('Использование: node shablon.mjs tools/<папка> [эталон-папка]'); process.exit(1); }
const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');
const out = resolve(root, outArg);
const ref = resolve(root, refArg || 'tools/amaliyot1');
const m = /(\d+)\s*$/.exec(basename(out));
const n = m ? String(Number(m[1])) : 'N';
const name = (f) => f.replace(/^a1/, 'a' + n);
const files = ['build.mjs', 'a1.src.jsx', 'a1-screens.jsx', 'a1.css', '.gitignore'];
if (existsSync(resolve(out, name('a1.src.jsx')))) { console.log('Исходник уже есть, не перезаписываю: ' + outArg); process.exit(1); }
mkdirSync(out, { recursive: true });
const dir = outArg.replace(/\/$/, '');
files.forEach((f) => {
  let s = readFileSync(resolve(ref, f), 'utf8');
  s = s.split('a1-screens.jsx').join(name('a1-screens.jsx')).split('a1.src.jsx').join(name('a1.src.jsx')).split('/*@FILE:a1.css@*/').join('/*@FILE:' + name('a1.css') + '@*/')
    .split('tools/amaliyot1/').join(dir + '/');
  if (f === 'build.mjs') s = s.split('lessons/html/01p-struktura-dokumenta.jsx').join('lessons/<курс>/<NN>p-<slug>.jsx');
  writeFileSync(resolve(out, name(f)), s);
});
console.log('Исходник практики: ' + outArg + ' (' + files.map(name).join(', ') + ') — копия ' + (refArg || 'tools/amaliyot1') + '.');
console.log('Дальше: в build.mjs — путь файла практики; под тему — разделы из references/karkas.md; классы a1- можно оставить или сменить на свой префикс.');
