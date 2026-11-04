// Сборка практики к уроку 1 курса HTML «Пять вкладок Коди» в облике «Редактор» (04.11.2026, с нуля:
// прежние практики удалены заказчиком). Каркас практики для следующих — см. .claude/skills/praktika/references/karkas.md.
//   node tools/amaliyot1/build.mjs   → lessons/html/01p-struktura-dokumenta.jsx
// Исходник — a1.src.jsx (тексты по /uzbekcha), разбор кода, редактор и экраны — a1-screens.jsx, облик — a1.css.
// Облик эталона — naborRedaktor (tools/redaktor28/nabor.mjs) в gen/.
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

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'a1.src.jsx'), join(root, 'lessons/html/01p-struktura-dokumenta.jsx')], { stdio: 'inherit' });
