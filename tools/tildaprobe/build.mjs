// Пробный экран модуля Tilda (24.11.2026, заказчик: «сделай пробный экран урока 1 тильды»): похожий редактор Tilda
// (сверен с настоящим редактором — docs/tilda-redaktor-zametki.md) — без окна браузера и без кода, сначала под телефон.
// Тестовый урок, не урок курса.
//   node tools/tildaprobe/build.mjs   → lessons/test/35-tilda-probnyy-ekran.jsx
// Облик — общий набор naborRedaktor (шапка и низ CoddyCamp, Коди, панели), свой CSS — t1.css. Канон — Bootstrap
// (голос по языку урока; модуль Tilda идёт после Bootstrap).
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
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 't1.src.jsx'), join(root, 'lessons/test/35-tilda-probnyy-ekran.jsx'), 'bootstrap'], { stdio: 'inherit' });
