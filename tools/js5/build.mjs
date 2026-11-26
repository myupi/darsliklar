// Сборка урока 5 курса JavaScript «Условия — 1 часть» в облике «Редактор» (26.11.2026).
//   node tools/js5/build.mjs   → lessons/javascript/05-usloviya-1.jsx
// Исходник — j5.src.jsx (тексты), движок — j5-engine.jsx (движок урока 4 + if, else, блоки, переходы),
// экраны — j5-screens.jsx (основа — урок 4, tools/js4/), стили — ../css1/c1.css + ../js1/j1.css + ../js2/j2.css + ../js3/j3.css + ../js4/j4.css + j5.css.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'j5.src.jsx'), join(root, 'lessons/javascript/05-usloviya-1.jsx'), 'javascript'], { stdio: 'inherit' });
