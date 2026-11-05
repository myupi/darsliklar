// Сборка урока 4 курса HTML «Ссылки и атрибуты» в облике «Редактор» (по эталону — уроку 1 курса).
//   node tools/havola4/build.mjs   → lessons/html/04-ssylki-i-atributy.jsx
// Исходник — z4.src.jsx (тексты по /uzbekcha), экраны — z4-screens.jsx (с нуля, основа кода — уроки 2–3,
// tools/zagolovki2/, tools/royxat3/; типы заданий — по разделу 3а навыка), весь CSS урока — z4.css.
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

// Английские слова в узбекской речи — английским голосом; тег a — буквой «A», href — по-английски.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|href|hypertext reference|https|secure|A|H (?:one|', 'en words'));
  const k = join(gen, 'kollazh-kit.jsx');
  writeFileSync(k, must(readFileSync(k, 'utf8'), '  const out = spokenHtmlL2(s, lang);',
    "  const out = spokenHtmlL2(s, lang).replace(/(^|[^A-Za-z'‘’-])a(?=\\s+(?:teg|tag|тег))/g, (all, pre) => pre + 'A');", 'a speech'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'z4.src.jsx'), join(root, 'lessons/html/04-ssylki-i-atributy.jsx')], { stdio: 'inherit' });
