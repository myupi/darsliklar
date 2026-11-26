// Сборка урока 4 курса JavaScript «Операторы» в облике «Редактор» (26.11.2026).
//   node tools/js4/build.mjs   → lessons/javascript/04-operatory.jsx
// Исходник — j4.src.jsx (тексты), движок — j4-engine.jsx (движок урока 3 + порядок действий, сравнения, шаги расчёта),
// экраны — j4-screens.jsx (основа — урок 3, tools/js3/), стили — ../css1/c1.css + ../js1/j1.css + ../js2/j2.css + ../js3/j3.css + j4.css.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'j4.src.jsx'), join(root, 'lessons/javascript/04-operatory.jsx'), 'javascript'], { stdio: 'inherit' });
