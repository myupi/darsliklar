// Вводный урок «IT ga kirish: IT va dasturlash nima?» (25.11.2026, заказчик: «нужно сделать первый урок, где ученику
// объясняется что такое it и прочее… представь что ты скачал приложение и не знаешь что вообще такое программирование»).
// Тестовый (lessons/test), облик — общий набор naborRedaktor; референс — пробные уроки «Foundation» в Figma Senior Program.
//   node tools/itkirish/build.mjs   → lessons/test/36-it-ga-kirish.jsx
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'itk.src.jsx'), join(root, 'lessons/test/36-it-ga-kirish.jsx'), 'css'], { stdio: 'inherit' });
