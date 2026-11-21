// Сборка практик модуля Bootstrap (21.11.2026, каркас bsp — tools/bsp/bp-kit.jsx поверх каркаса практик CSS tools/cssp):
//   node tools/bsp/build.mjs 01        → lessons/bootstrap/01p-<slug>.jsx
//   node tools/bsp/build.mjs all       → все практики, у которых есть pNN.jsx
// Практика = канон модуля (canon/bootstrap) + общее (bp-base.jsx: UI, FB) + данные практики (pNN.jsx: META, PR, C) +
// помощники урока 2 + облик эталона «Редактор» (naborRedaktor → gen/) + настоящий CSS Bootstrap 6 (gen/bs-css.jsx, BS_CSS) +
// каркас (bp-kit.jsx) + облик (../cssp/cp.css + bp.css).
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { naborRedaktor } from '../redaktor28/nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });
naborRedaktor(gen);

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};
// Английские слова в узбекской и русской речи — английским голосом (как в уроках модуля).
{
  const f = join(gen, 'b16-chrome.jsx');
  writeFileSync(f, must(readFileSync(f, 'utf8'), 'doctype|DOCTYPE|H (?:one|',
    'doctype|DOCTYPE|getbootstrap\\.com|getbootstrap|Bootstrap|CDN|CSS|link|script|class|alert|theme success|theme warning|theme danger|theme info|theme primary|theme|success|warning|primary|danger|info|Install|Components|Alert|Variants|Copied|Copy|integrity|stylesheet|head|body|H (?:one|', 'en words'));
}
// Настоящий CSS Bootstrap 6 — строкой (как tools/bs1/build.mjs). «//» в строке записан кодом для валидатора IT.
{
  const css = readFileSync(join(root, 'tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css'), 'utf8').replace(/\/\*# sourceMappingURL=[^*]*\*\/\s*$/, '');
  if (/https?:\/\/(?!www\.w3\.org\/2000\/svg)/.test(css)) throw new Error('build.mjs: в CSS Bootstrap есть внешний адрес');
  writeFileSync(join(gen, 'bs-css.jsx'), '// Bootstrap v6.0.0-alpha.1 (MIT, getbootstrap.com) — bootstrap.min.css, встраивается сборкой tools/bsp/build.mjs.\n'
    + 'const BS_CSS = ' + JSON.stringify(css).split('http://').join('http:\\u002F\\u002F') + ';\n');
}

const course = readFileSync(join(root, 'lessons/bootstrap/_course.js'), 'utf8');
const slugOf = (n) => { const m = new RegExp('n:\\s*' + n + ',\\s*slug:\\s*\'([^\']+)\'').exec(course); return m ? m[1] : null; };

const arg = process.argv[2] || 'all';
const list = arg === 'all'
  ? readdirSync(here).filter((f) => /^p\d\d\.jsx$/.test(f)).map((f) => f.slice(1, 3))
  : [String(arg).padStart(2, '0')];

for (const nn of list) {
  const n = Number(nn);
  const slug = slugOf(n);
  if (!slug) throw new Error('Нет урока ' + n + ' в lessons/bootstrap/_course.js');
  if (!existsSync(join(here, 'p' + nn + '.jsx'))) throw new Error('Нет tools/bsp/p' + nn + '.jsx');
  const out = join(root, 'lessons/bootstrap/' + nn + 'p-' + slug + '.jsx');
  const src = `// =============================================================================
// МОДУЛЬ «Bootstrap» · Практика к уроку ${n} (облик «Редактор»). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон модуля (до пометки «УРОК») + практика.
// Сборка: node tools/bsp/build.mjs ${nn} → lessons/bootstrap/${nn}p-${slug}.jsx (данные — tools/bsp/p${nn}.jsx)
// =============================================================================
/*@CANON@*/
/*@FILE:../bp-base.jsx@*/

/*@FILE:bs-css.jsx@*/

/*@FILE:../p${nn}.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { a: 1, b: 1, c: 1, d: 1 } });

/*@FILE:b16-chrome.jsx@*/

/*@FILE:p17-skin.jsx@*/

/*@FILE:kollazh-paper-data.jsx@*/

/*@FILE:kollazh-paper.jsx@*/

/*@FILE:kollazh-kit.jsx@*/

/*@FILE:kollazh-trans.jsx@*/

/*@FILE:../bp-kit.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + \`
/*@L2_CSS@*/
/*@FILE:kollazh.css@*/
/*@FILE:b16.css@*/
/*@FILE:p17.css@*/
/*@FILE:r28.css@*/
/*@FILE:../../cssp/cp.css@*/
/*@FILE:../bp.css@*/
\`;
`;
  const srcPath = join(gen, 'p' + nn + '.src.jsx');
  writeFileSync(srcPath, src);
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcPath, out, 'bootstrap'], { stdio: 'inherit' });
}
