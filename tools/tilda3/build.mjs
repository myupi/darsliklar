// Урок 3 модуля Tilda «Блоки Text и Button» (25.11.2026).
//   node tools/tilda3/build.mjs   → lessons/tilda/03-tekst-i-knopki.jsx
// Облик — общий набор naborRedaktor (шапка и низ CoddyCamp, Коди, панели) в gen/; части Tilda, указатель и стили — из уроков 1–2
// (../tilda1/, ../tilda2/), свои — tl3-parts.jsx, tl3-screens.jsx, tl3.css. Окна браузера и кода нет; сначала — телефон.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'tl3.src.jsx'), join(root, 'lessons/tilda/03-tekst-i-knopki.jsx'), 'tilda'], { stdio: 'inherit' });
