// Сборка урока 7 модуля «ИИ» «Как улучшить результат ИИ?» (12.11.2026).
//   node tools/ai7/build.mjs   → lessons/ai/07-uluchshit-rezultat.jsx
// Исходник — ai7.src.jsx (тексты по /uzbekcha); набор модуля, симулятор и общие экраны — ../ai1/ (ai1-kit.jsx, ai-common.jsx,
// ai1-engine.jsx, ai1.css); экраны урока — ai7-screens.jsx, CSS — ai7.css. Страница сайта — движок урока 17 CSS.
// Облик эталона — общий набор naborRedaktor в gen/. Канон — canon/css/canon-v1.jsx (дословная копия канона HTML;
// своего канона у модуля «ИИ» пока нет).
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
// Английские слова в узбекской и русской речи — английским голосом.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|', 'doctype|DOCTYPE|Minecraft|Roblox|prompt|hover|Telegram|H (?:one|', 'en words'));
}
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'ai7.src.jsx'), join(root, 'lessons/ai/07-uluchshit-rezultat.jsx'), 'css'], { stdio: 'inherit' });
