// Исходник новой практики — копия исходника эталона 01p «Бумажная улица» (tools/praktika-01/).
//
//   node .claude/skills/praktika/scripts/shablon.mjs tools/praktika-<NN> [эталон-папка]
//
// Копирует p01.src.jsx, p01-engine.jsx, p01-screens.jsx, p01.css в новую папку под
// именами pNN.* и правит в исходнике пути на свои файлы. Бумажный набор урока 1
// (tools/kollazh/) не копируется — исходник подключает его как есть.
// Дальше исходник правится под тему (см. references/karkas.md навыка praktika),
// а файл практики собирается: node .claude/skills/novyy-urok/scripts/sobrat.mjs <папка>/pNN.src.jsx <файл>.
// Существующая папка с исходником не перезаписывается.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const [outArg, refArg] = process.argv.slice(2);
if (!outArg) { console.log('Использование: node shablon.mjs tools/praktika-<NN> [эталон-папка]'); process.exit(1); }
const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');
const out = resolve(root, outArg);
const ref = resolve(root, refArg || 'tools/praktika-01');
const m = /(\d+)\s*$/.exec(basename(out));
const nn = m ? m[1].padStart(2, '0') : 'NN';
const name = (f) => f.replace(/^p01/, 'p' + nn);
const files = ['p01.src.jsx', 'p01-engine.jsx', 'p01-screens.jsx', 'p01.css'];
if (existsSync(resolve(out, name(files[0])))) { console.log('Исходник уже есть, не перезаписываю: ' + outArg); process.exit(1); }
mkdirSync(out, { recursive: true });
files.forEach((f) => {
  let s = readFileSync(resolve(ref, f), 'utf8');
  if (f === 'p01.src.jsx') {
    s = s.replace(/\/\*@FILE:p01-engine\.jsx@\*\//, '/*@FILE:' + name('p01-engine.jsx') + '@*/')
      .replace(/\/\*@FILE:p01-screens\.jsx@\*\//, '/*@FILE:' + name('p01-screens.jsx') + '@*/')
      .replace(/\/\*@FILE:p01\.css@\*\//, '/*@FILE:' + name('p01.css') + '@*/')
      .replace(/tools\/praktika-01\/p01\.src\.jsx lessons\/html\/01p-struktura-dokumenta\.jsx/, outArg.replace(/\/$/, '') + '/' + name('p01.src.jsx') + ' lessons/<курс>/<NN>p-<slug>.jsx  ← заполнить');
  }
  writeFileSync(resolve(out, name(f)), s);
});
console.log('Исходник практики: ' + outArg + ' (' + files.map(name).join(', ') + ') — копия ' + (refArg || 'tools/praktika-01') + '.');
console.log('Дальше: переписать под тему разделы «под тему» из references/karkas.md, затем собрать sobrat.mjs.');
