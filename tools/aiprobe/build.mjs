// Пробный экран модуля «ИИ» (11.11.2026, заказчик: «обнови темы и сделай пробный экран»): новый облик
// «запрос → ответ ИИ → сайт в браузере» поверх рамки CoddyCamp. Тестовый урок, не урок курса.
//   node tools/aiprobe/build.mjs   → lessons/test/32-ai-probnyy-ekran.jsx
// Движок страницы — tools/css17/c17-engine.jsx (честный браузер урока 17), облик — c17.css + a0.css.
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'a0.src.jsx'), join(root, 'lessons/test/32-ai-probnyy-ekran.jsx'), 'css'], { stdio: 'inherit' });
