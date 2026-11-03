// Сборка урока 2 курса HTML «Заголовки и текст» в облике «Редактор» (по эталону — уроку 1 курса).
//   node tools/zagolovki2/build.mjs   → lessons/html/02-zagolovki-i-tekst.jsx
// Исходник — z2r.src.jsx (тексты по /uzbekcha), экраны — z2r-screens.jsx (основа — экраны прежнего
// урока 2, переписанные без бумаги; типы заданий — по разделу 3а навыка), весь CSS урока — z2r.css
// (бумажный z2.css прежнего урока не подключается). Облик эталона — naborRedaktor (tools/redaktor28/nabor.mjs) в gen/.
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

// Английские слова в узбекской речи — английским голосом (как tag, head, body в уроке 1).
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|', 'doctype|DOCTYPE|heading|paragraph|bold|italic|H (?:one|', 'en words'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'z2r.src.jsx'), join(root, 'lessons/html/02-zagolovki-i-tekst.jsx')], { stdio: 'inherit' });
