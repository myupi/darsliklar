// Сборка практики к уроку 5 курса HTML «Зоопарк Коди» в облике «Редактор» (04.11.2026, на основе
// практики 04p — tools/amaliyot4; каркас практик — references/karkas.md навыка praktika).
//   node tools/amaliyot5/build.mjs   → lessons/html/05p-izobrazheniya.jsx
// Исходник — a5.src.jsx (тексты по /uzbekcha), разбор кода, браузер с картинками, экраны — a5-screens.jsx, облик — a5.css.
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

// Как в уроках 3–5: английские слова в узбекской речи — английским голосом; ul, ol, li, img, src — по буквам,
// тег a — «A», href и alt — по-английски.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|href|image|source|alternative text|alt|I M G|S R C|U L|O L|L I|A|H (?:one|', 'en words'));
  const k = join(gen, 'kollazh-kit.jsx');
  writeFileSync(k, must(readFileSync(k, 'utf8'), '  const out = spokenHtmlL2(s, lang);',
    "  const out = spokenHtmlL2(s, lang).replace(/(^|[^A-Za-z'‘’-])(ul|ol|li|img|src)(?![A-Za-z'‘’])/g, (all, pre, t) => pre + t.toUpperCase().split('').join(' '))" +
    ".replace(/(^|[^A-Za-z'‘’-])a(?=\\s+(?:teg|tag|тег))/g, (all, pre) => pre + 'A');", 'ul ol li img src a speech'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'a5.src.jsx'), join(root, 'lessons/html/05p-izobrazheniya.jsx')], { stdio: 'inherit' });
