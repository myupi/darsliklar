// Урок 5 модуля Tilda «Цвета и шрифты» (26.11.2026).
//   node tools/tilda5/build.mjs   → lessons/tilda/05-cveta-i-shrifty.jsx
// Облик — общий набор naborRedaktor (шапка и низ CoddyCamp, Коди, панели) в gen/; части Tilda, указатель и стили — из уроков 1–2
// (../tilda1/, ../tilda2/, ../tilda3/tl3.css, ../tilda4/), свои — tl5-parts.jsx, tl5-screens.jsx, tl5.css. Окна браузера и кода нет; сначала — телефон.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'tl5.src.jsx'), join(root, 'lessons/tilda/05-cveta-i-shrifty.jsx'), 'tilda'], { stdio: 'inherit' });
