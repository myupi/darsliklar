// Сборка урока 1 модуля «ИИ» «Что создаём и зачем?» (11.11.2026).
//   node tools/ai1/build.mjs   → lessons/ai/01-chto-i-zachem.jsx
// Исходник — ai1.src.jsx (тексты по /uzbekcha), набор модуля — ai1-kit.jsx (симулятор ИИ, редактор промпта, метки),
// экраны — ai1-screens.jsx, CSS — ai1.css. Страница сайта — движок урока 17 CSS (tools/css17/c17-engine.jsx, c17.css).
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
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|', 'doctype|DOCTYPE|Minecraft|Roblox|prompt|H (?:one|', 'en words'));
}
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'ai1.src.jsx'), join(root, 'lessons/ai/01-chto-i-zachem.jsx'), 'css'], { stdio: 'inherit' });
