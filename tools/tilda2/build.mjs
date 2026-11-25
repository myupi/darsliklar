// Урок 2 модуля Tilda «Блоки: что это и как добавить» (25.11.2026).
//   node tools/tilda2/build.mjs   → lessons/tilda/02-bloki.jsx
// Облик — общий набор naborRedaktor (шапка и низ CoddyCamp, Коди, панели) в gen/; части Tilda, указатель и стили — из урока 1
// (../tilda1/), свои — tl2-parts.jsx, tl2-screens.jsx, tl2.css. Окна браузера и кода нет; сначала — телефон (заказчик, 24.11.2026).
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'tl2.src.jsx'), join(root, 'lessons/tilda/02-bloki.jsx'), 'tilda'], { stdio: 'inherit' });
