// Сборка практик курса CSS (09.11.2026, каркас cssp — tools/cssp/cp-kit.jsx):
//   node tools/cssp/build.mjs 01        → lessons/css/01p-<slug>.jsx
//   node tools/cssp/build.mjs all       → все практики, у которых есть pNN.jsx
// Практика = канон курса + общее (cp-base.jsx: UI, FB) + данные практики (pNN.jsx: META, PR, C) + помощники
// урока 2 + облик эталона «Редактор» (naborRedaktor → gen/) + каркас (cp-kit.jsx) + облик (cp.css).
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

const course = readFileSync(join(root, 'lessons/css/_course.js'), 'utf8');
const slugOf = (n) => { const m = new RegExp('n:\\s*' + n + ',\\s*slug:\\s*\'([^\']+)\'').exec(course); return m ? m[1] : null; };

const arg = process.argv[2] || 'all';
const list = arg === 'all'
  ? readdirSync(here).filter((f) => /^p\d\d\.jsx$/.test(f)).map((f) => f.slice(1, 3))
  : [String(arg).padStart(2, '0')];

for (const nn of list) {
  const n = Number(nn);
  const slug = slugOf(n);
  if (!slug) throw new Error('Нет урока ' + n + ' в lessons/css/_course.js');
  if (!existsSync(join(here, 'p' + nn + '.jsx'))) throw new Error('Нет tools/cssp/p' + nn + '.jsx');
  const out = join(root, 'lessons/css/' + nn + 'p-' + slug + '.jsx');
  const src = `// =============================================================================
// КУРС «CSS» · Практика к уроку ${n} (облик «Редактор»). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/cssp/build.mjs ${nn} → lessons/css/${nn}p-${slug}.jsx (данные — tools/cssp/p${nn}.jsx)
// =============================================================================
/*@CANON@*/
/*@FILE:../cp-base.jsx@*/

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

/*@FILE:../cp-kit.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + \`
/*@L2_CSS@*/
/*@FILE:kollazh.css@*/
/*@FILE:b16.css@*/
/*@FILE:p17.css@*/
/*@FILE:r28.css@*/
/*@FILE:../cp.css@*/
\`;
`;
  const srcPath = join(gen, 'p' + nn + '.src.jsx');
  writeFileSync(srcPath, src);
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcPath, out, 'css'], { stdio: 'inherit' });
}
