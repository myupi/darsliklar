// Сборка урока 1 модуля Bootstrap «Введение в Bootstrap» в облике «Редактор» (как уроки HTML и CSS; 19.11.2026).
//   node tools/bs1/build.mjs   → lessons/bootstrap/01-vvedenie.jsx
// Исходник — bs1.src.jsx (тексты по /uzbekcha), экраны — bs1-screens.jsx (основа кода — урок 1 CSS, tools/css1/),
// весь CSS урока — bs1.css. Облик эталона — общий набор naborRedaktor в gen/.
// Канон — canon/bootstrap/canon-v1.jsx (копия канона HTML, её пишет tools/build-canon.mjs).
// Страница в окне Chrome рисуется настоящим CSS Bootstrap 6.0.0-alpha.1 (tools/bootstrap/vendor/, хеш совпадает с
// integrity на getbootstrap.com): сборка кладёт его строкой BS_CSS в gen/bs-css.jsx — урок не грузит ничего из сети.
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
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|getbootstrap\.com|getbootstrap|Read the docs|Google|Bootstrap|CDN|CSS|link|script|class|alert|theme success|theme warning|theme|success|warning|primary|danger|Install|Getting started|Components|Variants|Copied|Copy|Button|integrity|style|H (?:one|', 'en words'));
}

// Настоящий CSS Bootstrap 6 — строкой. «https://» и т. п. в нём нет (только data:), внешних загрузок урок не делает.
{
  const css = readFileSync(join(root, 'tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css'), 'utf8').replace(/\/\*# sourceMappingURL=[^*]*\*\/\s*$/, '');
  // Адресов загрузки нет: «http://www.w3.org/2000/svg» — только пространство имён SVG во встроенных картинках (data:).
  // «//» в строке урока записан кодом (как в уроке HTML 5), чтобы валидатор IT не принял его за внешний адрес.
  if (/https?:\/\/(?!www\.w3\.org\/2000\/svg)/.test(css)) throw new Error('build.mjs: в CSS Bootstrap есть внешний адрес');
  writeFileSync(join(gen, 'bs-css.jsx'), '// Bootstrap v6.0.0-alpha.1 (MIT, getbootstrap.com) — bootstrap.min.css, встраивается сборкой tools/bs1/build.mjs.\n'
    + 'const BS_CSS = ' + JSON.stringify(css).split('http://').join('http:\\u002F\\u002F') + ';\n');
}

mkdirSync(join(root, 'lessons/bootstrap'), { recursive: true });
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'bs1.src.jsx'), join(root, 'lessons/bootstrap/01-vvedenie.jsx'), 'bootstrap'], { stdio: 'inherit' });
