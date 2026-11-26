// Сборка урока 3 курса JavaScript «Типы данных» в облике «Редактор» (26.11.2026).
//   node tools/js3/build.mjs   → lessons/javascript/03-tipy-dannyh.jsx
// Исходник — j3.src.jsx (тексты), движок — j3-engine.jsx (движок урока 2 + true, false, typeof; «Память» по типам),
// экраны — j3-screens.jsx (основа — урок 2, tools/js2/), стили — ../css1/c1.css + ../js1/j1.css + ../js2/j2.css + j3.css.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'j3.src.jsx'), join(root, 'lessons/javascript/03-tipy-dannyh.jsx'), 'javascript'], { stdio: 'inherit' });
