// Сборка урока 17 курса CSS «Финальный проект» в облике «Редактор» (как уроки курса HTML;
// заказчик, 05.11.2026: «как html редактор возьмём»).
//   node tools/css17/build.mjs   → lessons/css/17-final-proekt.jsx
// Исходник — c17.src.jsx (тексты по /uzbekcha), движок — c17-engine.jsx (копия движка урока 16, tools/css16/,
// с картинками и тегом img), экраны — c17-screens.jsx, весь CSS урока — c17.css (основа — CSS урока 16).
// Облик эталона — общий набор naborRedaktor в gen/. Канон — canon/css/canon-v1.jsx (дословная копия канона HTML).
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

// Английские слова в узбекской и русской речи — английским голосом: CSS, имена свойств и значений всего курса.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|CSS|style|media|max-width|min-width|keyframes|animation|infinite|transition|linear|hover|transform|scale|rotate|translate|cursor|pointer|position|relative|absolute|fixed|static|top|right|bottom|left|justify-content|space-between|flex-start|flex-direction|column|row|flexbox|flex|inline-block|display|inline|block|none|div|border-radius|box-shadow|border-top|margin|padding|border|width|text-align|center|font-size|px|background-image|background-repeat|background-size|no-repeat|repeat|cover|background-color|color|class|id|hex|lightyellow|navy|silver|orange|green|white|selector|property|value|H (?:one|', 'en words'));
}

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'c17.src.jsx'), join(root, 'lessons/css/17-final-proekt.jsx'), 'css'], { stdio: 'inherit' });
