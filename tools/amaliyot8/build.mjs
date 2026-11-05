// Сборка практики к уроку 8 курса HTML «Сайт школы Коди» в облике «Редактор» (04.11.2026, на основе
// практики 07p — tools/amaliyot7; каркас практик — references/karkas.md навыка praktika).
//   node tools/amaliyot8/build.mjs   → lessons/html/08p-struktura-sajta.jsx
// Исходник — a8.src.jsx (тексты по /uzbekcha), разбор частей сайта, браузер с рамками «Инспектора», экраны — a8-screens.jsx, облик — a8.css.
// Облик эталона — naborRedaktor (tools/redaktor28/nabor.mjs) в gen/.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { naborRedaktor } from '../redaktor28/nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

naborRedaktor(gen);

// Как в уроке 8: имена частей сайта в узбекской речи — английским голосом; h1 — как в наборе.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|header|nav|main|section|footer|head|href|H (?:one|', 'en words'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'a8.src.jsx'), join(root, 'lessons/html/08p-struktura-sajta.jsx')], { stdio: 'inherit' });
