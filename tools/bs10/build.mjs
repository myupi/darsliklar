// Сборка урока 10 модуля Bootstrap «Финальный проект» в облике «Редактор» (20.11.2026).
//   node tools/bs10/build.mjs   → lessons/bootstrap/10-final-proekt.jsx
// Исходник — bs10.src.jsx (тексты по /uzbekcha), набор — bs10-kit.jsx (копия набора урока 8; вместо карусели — меню и окно bsUi),
// похожий сайт Bootstrap — bs10-site.jsx (Install, Alert и Components → Menu, Dialog),
// экраны — bs10-screens.jsx, CSS — ../bs1/bs1.css … ../bs6/bs6.css + bs10.css. Облик эталона — общий набор naborRedaktor в gen/.
// Страница в окне Chrome — настоящий CSS Bootstrap 6.0.0-alpha.1 (tools/bootstrap/vendor/), строкой BS_CSS.
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

// Английские слова в узбекской и русской речи — английским голосом. Имена классов с дефисом — целиком
// (theme-success, btn-solid, fg-danger), иначе вторая часть ушла бы узбекским окончанием.
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|btn-solid|btn-outline|btn-success|btn-primary|theme-[a-z]+|fg-[a-z]+|bg-[a-z]+|text-success|container-fluid|container|row|col-[0-9]+|col|md:col-[0-9]+|lg:col-[0-9]+|sm:col-[0-9]+|col-md-4|Grid|Containers|Breakpoints|Layout|menu-item|menu|Menu|data-bs-toggle|data-bs|carousel-item|carousel|form-control|form-label|form|md:col-4|col-md-4|img-fluid|justify-content-between|card-body|card|theme-[a-z]+|btn-success|btn-primary|select|success|primary|Components|Tilda|body|head|link|script|card-img-top|card-body|card-title|card-text|card-subtle|card-header|card|Card|src|d-flex|justify-content-[a-z]+|align-items-[a-z]+|gap-[0-9]+|flex-column|flex-wrap|flex|justify-content|align-items|gap|display|Justify content|Align items|Gap|Flex|img-fluid|img-responsive|img-thumbnail|rounded-circle|rounded-pill|rounded|spinner-border|spinner-grow|spinner|placeholder-wave|placeholder|role|status|Loading|Images|Content|Border radius|Spinner|Placeholder|src|alt|img|span|div|getbootstrap\\.com|getbootstrap|Read the docs|Google|Bootstrap|CDN|CSS|link|script|class|alert|button|theme|solid|outline|success|warning|primary|danger|accent|info|inverse|secondary|foreground|background|Install|Getting started|Components|Utilities|Colors|Background|Variants|Copied|Copy|Button|Ctrl|style|H (?:one|', 'en words'));
}

{
  const css = readFileSync(join(root, 'tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css'), 'utf8').replace(/\/\*# sourceMappingURL=[^*]*\*\/\s*$/, '');
  if (/https?:\/\/(?!www\.w3\.org\/2000\/svg)/.test(css)) throw new Error('build.mjs: в CSS Bootstrap есть внешний адрес');
  writeFileSync(join(gen, 'bs-css.jsx'), '// Bootstrap v6.0.0-alpha.1 (MIT, getbootstrap.com) — bootstrap.min.css, встраивается сборкой tools/bs10/build.mjs.\n'
    + 'const BS_CSS = ' + JSON.stringify(css).split('http://').join('http:\\u002F\\u002F') + ';\n');
}

mkdirSync(join(root, 'lessons/bootstrap'), { recursive: true });
execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), join(here, 'bs10.src.jsx'), join(root, 'lessons/bootstrap/10-final-proekt.jsx'), 'bootstrap'], { stdio: 'inherit' });
