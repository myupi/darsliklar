// Сборка урока 1 курса HTML «Структура HTML-документа» в облике «Редактор» — ЭТАЛОН КУРСА (заказчик,
// 02.11.2026: бывший тестовый урок 28 стал первым уроком; прежний урок 1 «Kodi playground» — теперь
// lessons/test/29-struktura-playground.jsx). Имя папки tools/redaktor28/ — историческое.
//   node tools/redaktor28/build.mjs   → lessons/html/01-struktura-dokumenta.jsx
// Экраны, механики и тексты урока: tools/problemitas17/build.mjs --gen-only пишет их в свою папку gen/
// (экраны урока 16 tools/bdizayn16/b16-screens.jsx с правками, реплики b16-texts.jsx, исходник с META
// урока 1 из tools/kollazh/kollazh.src.jsx) — отсюда берутся только они. Облик — общий набор
// naborRedaktor (nabor.mjs): набор урока 1, рамка B, облик p17, поверх — «Редактор»: стол, герой,
// редактор кода, Chrome, шапка и низ CoddyCamp, переход-глитч со звуком, шрифт Inter.
// Своё для урока 1 здесь — только цвета кусков, летящих в героя на экране 1 (цвета героя).
// --gen-only: только папка gen/ (для тестовых уроков на основе урока 1), без сборки урока.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { naborRedaktor } from './nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const P17 = join(root, 'tools/problemitas17');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

// Экраны, реплики и исходник урока 1 (без облика).
execFileSync('node', [join(P17, 'build.mjs'), '--gen-only'], { stdio: 'inherit' });
for (const f of ['kollazh-screens.jsx', 'b16-texts.jsx', 'p17.src.jsx']) copyFileSync(join(P17, 'gen', f), join(gen, f));

// Облик «Редактор».
naborRedaktor(gen);

let scr = readFileSync(join(gen, 'kollazh-screens.jsx'), 'utf8');
for (const [k, from, to] of [
  ['legL', "c0: '#DEE1E6', c: '#6CCBA8'", "c0: '#DEE1E6', c: '#344157'"],
  ['legR', "c0: '#DEE1E6', c: '#6CCBA8'", "c0: '#DEE1E6', c: '#344157'"],
  ['armL', "c0: '#FFFFFF', c: '#FF8D7D'", "c0: '#FFFFFF', c: '#14A391'"],
  ['armR', "c0: '#FFFFFF', c: '#FF8D7D'", "c0: '#FFFFFF', c: '#14A391'"],
  ['body', "c0: KZ.cream, c: '#7FD6B6'", "c0: KZ.cream, c: '#14A391'"],
  ['head', "c0: '#DEE1E6', c: '#E9B48C'", "c0: '#DEE1E6', c: '#F1C29E'"],
  ['name', "c0: '#FFFFFF', c: '#F7A3CB'", "c0: '#FFFFFF', c: '#FFFFFF'"]
]) scr = must(scr, "{ k: '" + k + "', " + from, "{ k: '" + k + "', " + to, 'morph ' + k);
writeFileSync(join(gen, 'kollazh-screens.jsx'), scr);

// META — урока 1 курса (lessonId html-01-struktura-dokumenta) из исходника, без замены.
let src = readFileSync(join(gen, 'p17.src.jsx'), 'utf8');
src = must(src, '/*@FILE:p17.css@*/', '/*@FILE:p17.css@*/\n/*@FILE:r28.css@*/', 'css');
src = src.replace(/^\/\/ СГЕНЕРИРОВАНО[^\n]*\n/, '// СГЕНЕРИРОВАНО tools/redaktor28/build.mjs (урок 1 курса HTML, облик «Редактор») — не править руками.\n');
const srcOut = join(gen, 'r28.src.jsx');
writeFileSync(srcOut, src);

if (!process.argv.includes('--gen-only')) {
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, 'lessons/html/01-struktura-dokumenta.jsx')], { stdio: 'inherit' });
}
