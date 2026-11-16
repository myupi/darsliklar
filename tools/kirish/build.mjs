// Сборка вводного урока всего курса «Из чего сделан сайт» (16.11.2026, заказчик: «пеееервый урок всего курса…
// ученик должен пройти за 5–6 минут… тут не должно быть ни единого кода»). Тестовый — вне списка курсов.
//   node tools/kirish/build.mjs   → lessons/test/33-kirish-sayt.jsx
// Исходник — kirish.src.jsx (тексты по /uzbekcha), экраны — kirish-screens.jsx, CSS — kirish.css.
// Сайт в окне Chrome и симулятор ИИ — набор модуля «ИИ» (tools/ai1: ai1-engine.jsx, ai1-kit.jsx, ai-common.jsx);
// облик эталона — общий набор naborRedaktor в gen/. Канон — canon/css/canon-v1.jsx.
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
// Английские слова в узбекской и русской речи — английским голосом (HTML, CSS — названия частей курса).
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|', 'doctype|DOCTYPE|HTML|CSS|Minecraft|H (?:one|', 'en words'));
}
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'kirish.src.jsx'), join(root, 'lessons/test/33-kirish-sayt.jsx'), 'css'], { stdio: 'inherit' });
