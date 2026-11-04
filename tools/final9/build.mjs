// Сборка урока 9 курса HTML «Финальный HTML-проект» (повторение курса) в облике «Редактор» (по эталону — уроку 1 курса).
//   node tools/final9/build.mjs   → lessons/html/09-final-proekt.jsx
// Исходник — z9.src.jsx (тексты по /uzbekcha), экраны — z9-screens.jsx (с нуля, основа кода — уроки 2–8,
// tools/zagolovki2/, tools/royxat3/, tools/havola4/; типы заданий — по разделу 3а навыка), весь CSS урока — z9.css.
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

// Английские слова в узбекской речи — английским голосом; ul, ol, li, img, src — по буквам («U L», «I M G»),
// как в уроках 3 и 5; тег a — буквой «A», как в уроке 4.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|header|nav|main|section|footer|input|type|password|select|option|textarea|button|label|form|href|alt|U L|O L|L I|I M G|S R C|A|H (?:one|', 'en words'));
  const k = join(gen, 'kollazh-kit.jsx');
  writeFileSync(k, must(readFileSync(k, 'utf8'), '  const out = spokenHtmlL2(s, lang);',
    "  const out = spokenHtmlL2(s, lang).replace(/(^|[^A-Za-z'‘’-])(ul|ol|li|img|src)(?![A-Za-z'‘’])/g, (all, pre, t) => pre + t.toUpperCase().split('').join(' ')).replace(/(^|[^A-Za-z'‘’-])a(?=\\s+(?:teg|tag|тег))/g, (all, pre) => pre + 'A');", 'tag letters speech'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'z9.src.jsx'), join(root, 'lessons/html/09-final-proekt.jsx')], { stdio: 'inherit' });
