// Сборка урока 3 курса HTML «Списки» в облике «Редактор» (по эталону — уроку 1 курса).
//   node tools/royxat3/build.mjs   → lessons/html/03-spiski.jsx
// Исходник — z3.src.jsx (тексты по /uzbekcha), экраны — z3-screens.jsx (с нуля, основа кода — урок 2,
// tools/zagolovki2/; типы заданий — по разделу 3а навыка), весь CSS урока — z3.css.
// Облик эталона — общий набор naborRedaktor (tools/redaktor28/nabor.mjs) в gen/.
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

// Английские слова в узбекской речи — английским голосом; ul, ol, li — по буквам («U L»), как h1 — «H one».
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|unordered list|ordered list|list item|U L|O L|L I|H (?:one|', 'en words'));
  const k = join(gen, 'kollazh-kit.jsx');
  writeFileSync(k, must(readFileSync(k, 'utf8'), '  const out = spokenHtmlL2(s, lang);',
    "  const out = spokenHtmlL2(s, lang).replace(/(^|[^A-Za-z'‘’-])(ul|ol|li)(?![A-Za-z'‘’])/g, (all, pre, t) => pre + t.toUpperCase().split('').join(' '));", 'ul ol li speech'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'z3.src.jsx'), join(root, 'lessons/html/03-spiski.jsx')], { stdio: 'inherit' });
