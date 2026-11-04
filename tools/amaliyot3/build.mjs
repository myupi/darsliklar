// Сборка практики к уроку 3 курса HTML «Праздник Коди» в облике «Редактор» (04.11.2026, на основе
// практики 02p — tools/amaliyot2; каркас практик — references/karkas.md навыка praktika).
//   node tools/amaliyot3/build.mjs   → lessons/html/03p-spiski.jsx
// Исходник — a3.src.jsx (тексты по /uzbekcha), разбор кода, браузер, экраны — a3-screens.jsx, облик — a3.css.
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

// Как в уроке 3: английские слова в узбекской речи — английским голосом; ul, ol, li — по буквам («U L»).
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|unordered list|ordered list|list item|U L|O L|L I|H (?:one|', 'en words'));
  const k = join(gen, 'kollazh-kit.jsx');
  writeFileSync(k, must(readFileSync(k, 'utf8'), '  const out = spokenHtmlL2(s, lang);',
    "  const out = spokenHtmlL2(s, lang).replace(/(^|[^A-Za-z'‘’-])(ul|ol|li)(?![A-Za-z'‘’])/g, (all, pre, t) => pre + t.toUpperCase().split('').join(' '));", 'ul ol li speech'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'a3.src.jsx'), join(root, 'lessons/html/03p-spiski.jsx')], { stdio: 'inherit' });
