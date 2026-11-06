// Сборка урока 4 курса CSS «Фон» в облике «Редактор» (как уроки курса HTML;
// заказчик, 05.11.2026: «как html редактор возьмём»).
//   node tools/css4/build.mjs   → lessons/css/04-fon.jsx
// Исходник — c4.src.jsx (тексты по /uzbekcha), экраны — c4-screens.jsx (основа кода — урок 4 курса HTML,
// tools/havola4/), весь CSS урока — c4.css. Облик эталона — общий набор naborRedaktor в gen/.
// Канон — canon/css/canon-v1.jsx (дословная копия канона HTML, её пишет tools/build-canon.mjs).
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

// Английские слова в узбекской и русской речи — английским голосом: CSS, имена свойств и цветов.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|CSS|style|background-image|background-repeat|background-size|no-repeat|repeat|cover|url|background-color|background color|color|class|id|hex|rgb|hsl|orangered|orange|tomato|green|blue|red|purple|lavender|yellow|gold|white|skyblue|navy|lightyellow|darkgreen|selector|property|value|H (?:one|', 'en words'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'c4.src.jsx'), join(root, 'lessons/css/04-fon.jsx'), 'css'], { stdio: 'inherit' });
