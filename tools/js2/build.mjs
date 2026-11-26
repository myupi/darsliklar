// Сборка урока 2 курса JavaScript «Переменные» в облике «Редактор» (26.11.2026).
//   node tools/js2/build.mjs   → lessons/javascript/02-peremennye.jsx
// Исходник — j2.src.jsx (тексты), движок — j2-engine.jsx (движок урока 1 + let, const, присваивание, «Память»),
// экраны — j2-screens.jsx (основа — урок 1, tools/js1/), стили — ../css1/c1.css + ../js1/j1.css + j2.css.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'j2.src.jsx'), join(root, 'lessons/javascript/02-peremennye.jsx'), 'javascript'], { stdio: 'inherit' });
