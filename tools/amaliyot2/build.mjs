// Сборка практики к уроку 2 курса HTML «Газета Коди» в облике «Редактор» (04.11.2026, на каркасе 01p — tools/amaliyot1;
// прежние практики удалены заказчиком). Каркас практики для следующих — см. .claude/skills/praktika/references/karkas.md.
//   node tools/amaliyot2/build.mjs   → lessons/html/02p-zagolovki-i-tekst.jsx
// Исходник — a2.src.jsx (тексты по /uzbekcha), разбор кода, редактор и экраны — a2-screens.jsx, облик — a2.css.
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

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'a2.src.jsx'), join(root, 'lessons/html/02p-zagolovki-i-tekst.jsx')], { stdio: 'inherit' });
