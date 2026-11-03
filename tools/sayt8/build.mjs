// Сборка урока 8 курса HTML «Структура настоящего сайта» в облике «Редактор» (по эталону — уроку 1 курса).
//   node tools/sayt8/build.mjs   → lessons/html/08-struktura-sajta.jsx
// Исходник — z8.src.jsx (тексты по /uzbekcha), экраны — z8-screens.jsx (с нуля, основа кода — уроки 2–7,
// tools/zagolovki2/, tools/royxat3/, tools/havola4/; типы заданий — по разделу 3а навыка), весь CSS урока — z8.css.
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

// Английские слова в узбекской речи — английским голосом: имена тегов частей сайта.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|header|nav|main|section|footer|head|H (?:one|', 'en words'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'z8.src.jsx'), join(root, 'lessons/html/08-struktura-sajta.jsx')], { stdio: 'inherit' });
