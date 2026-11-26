// Сборка урока 1 курса JavaScript «Что такое JavaScript» в облике «Редактор» (26.11.2026).
//   node tools/js1/build.mjs   → lessons/javascript/01-chto-takoe-js.jsx
// Исходник — j1.src.jsx (тексты), движок — j1-engine.jsx (честный console.log, ошибки как в Chrome, консоль),
// экраны — j1-screens.jsx (основа — урок 1 CSS, tools/css1/), стили — ../css1/c1.css + j1.css.
// Облик эталона — общий набор naborRedaktor в gen/. Канон — canon/javascript/canon-v1.jsx.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'j1.src.jsx'), join(root, 'lessons/javascript/01-chto-takoe-js.jsx'), 'javascript'], { stdio: 'inherit' });
