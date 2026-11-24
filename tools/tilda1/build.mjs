// Урок 1 модуля Tilda «Знакомство с Tilda и первый сайт» (24.11.2026).
//   node tools/tilda1/build.mjs   → lessons/tilda/01-vvedenie.jsx
// Облик — общий набор naborRedaktor (шапка и низ CoddyCamp, Коди, панели) в gen/; свой CSS — tl1.css. Канон — canon/tilda
// (копия канона Bootstrap: голос по языку урока). Окна браузера и кода нет; сначала — телефон (заказчик, 24.11.2026).
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { naborRedaktor } from '../redaktor28/nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });
naborRedaktor(gen);
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'tl1.src.jsx'), join(root, 'lessons/tilda/01-vvedenie.jsx'), 'tilda'], { stdio: 'inherit' });
