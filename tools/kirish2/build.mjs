// Сборка вводного урока, вариант 2 «Свой сайт за 5 минут» (17.11.2026, заказчик: «создай по новой тестовый урок того
// как ты видишь… можешь полностью по новой сделать»). Тестовый — вне списка курсов; кода нет; в конце — дорожная карта.
//   node tools/kirish2/build.mjs   → lessons/test/34-kirish-yol-xaritasi.jsx
// Исходник — kirish2.src.jsx (тексты по /uzbekcha), экраны — kirish2-screens.jsx, CSS — kirish2.css.
// Окно сайта — набор модуля «ИИ» (tools/ai1); облик эталона — общий набор naborRedaktor в gen/. Канон — canon/css.
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
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|', 'doctype|DOCTYPE|HTML|CSS|JavaScript|Bootstrap|Tilda|Blockly|GitHub|React|Minecraft|H (?:one|', 'en words'));
}
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'kirish2.src.jsx'), join(root, 'lessons/test/34-kirish-yol-xaritasi.jsx'), 'css'], { stdio: 'inherit' });
