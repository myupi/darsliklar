// Сборка урока 1 курса HTML «Структура HTML-документа» в облике «Редактор» — ЭТАЛОН КУРСА (заказчик,
// 02.11.2026: бывший тестовый урок 28 стал первым уроком; прежний урок 1 «Kodi playground» — теперь
// lessons/test/29-struktura-playground.jsx). Имя папки tools/redaktor28/ — историческое.
//   node tools/redaktor28/build.mjs   → lessons/html/01-struktura-dokumenta.jsx
// Экраны, механики и тексты урока: tools/problemitas17/build.mjs --gen-only пишет их в свою папку gen/
// (экраны урока 16 tools/bdizayn16/b16-screens.jsx с правками, реплики b16-texts.jsx, исходник с META
// урока 1 из tools/kollazh/kollazh.src.jsx) — отсюда берутся только они. Облик — общий набор
// naborRedaktor (nabor.mjs): набор урока 1, рамка B, облик p17, поверх — «Редактор»: стол, герой,
// редактор кода, Chrome, шапка и низ CoddyCamp, переход-глитч со звуком, шрифт Inter.
// Своё для урока 1 здесь — только цвета кусков, летящих в героя на экране 1 (цвета героя).
// --gen-only: только папка gen/ (для тестовых уроков на основе урока 1), без сборки урока.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { naborRedaktor } from './nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const P17 = join(root, 'tools/problemitas17');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

// Экраны, реплики и исходник урока 1 (без облика).
execFileSync('node', [join(P17, 'build.mjs'), '--gen-only'], { stdio: 'inherit' });
for (const f of ['kollazh-screens.jsx', 'b16-texts.jsx', 'p17.src.jsx']) copyFileSync(join(P17, 'gen', f), join(gen, f));

// Облик «Редактор».
naborRedaktor(gen);

let scr = readFileSync(join(gen, 'kollazh-screens.jsx'), 'utf8');
for (const [k, from, to] of [
  ['legL', "c0: '#DEE1E6', c: '#6CCBA8'", "c0: '#DEE1E6', c: '#344157'"],
  ['legR', "c0: '#DEE1E6', c: '#6CCBA8'", "c0: '#DEE1E6', c: '#344157'"],
  ['armL', "c0: '#FFFFFF', c: '#FF8D7D'", "c0: '#FFFFFF', c: '#14A391'"],
  ['armR', "c0: '#FFFFFF', c: '#FF8D7D'", "c0: '#FFFFFF', c: '#14A391'"],
  ['body', "c0: KZ.cream, c: '#7FD6B6'", "c0: KZ.cream, c: '#14A391'"],
  ['head', "c0: '#DEE1E6', c: '#E9B48C'", "c0: '#DEE1E6', c: '#F1C29E'"],
  ['name', "c0: '#FFFFFF', c: '#F7A3CB'", "c0: '#FFFFFF', c: '#FFFFFF'"]
]) scr = must(scr, "{ k: '" + k + "', " + from, "{ k: '" + k + "', " + to, 'morph ' + k);
// Экран 6 «Голова страницы»: курсор мыши показа (tools/mysh; заказчик, 07.11.2026) — когда название перелетело
// на вкладку, стрелка наводится на вкладку, и всплывает карточка с названием и адресом, как в Chrome.
// Правка только урока 1: общие экраны tools/bdizayn16 (и тестовые уроки на них) не меняются.
scr = must(scr, "  const sceneRef = useRef(null);\n  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]\n    : [{ text: c.say, pose: 'explain' }, { text: c.sayInfo, pose: 'explain' }]);",
  "  const sceneRef = useRef(null);\n  const M = useMysh(sceneRef);\n  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]\n    : [{ text: c.say, pose: 'explain' }, { text: c.sayInfo, pose: 'explain' }]);", 's6 mysh');
scr = must(scr, "    { act: () => { setFlying(false); setStep(2); setStamp((v) => v + 1); sfx('ok', true); } },\n    { say: [{ text: c.flew, pose: 'wonder' }, { text: c.inHead, pose: 'point' }, { text: c.done, pose: 'smile' }] },",
  "    { act: () => { setFlying(false); setStep(2); setStamp((v) => v + 1); sfx('ok', true); } },\n    { act: () => M.go('.kz-br-tab', 0.4, 0.62) }, { wait: M.slow },\n    { act: () => M.card({ t: pick(UI.mySite), sub: 'index.html' }) },\n    { say: [{ text: c.flew, pose: 'wonder' }] },\n    { act: () => M.hide() },\n    { say: [{ text: c.inHead, pose: 'point' }, { text: c.done, pose: 'smile' }] },", 's6 steps');
scr = must(scr, "<div ref={sceneRef} className={'kz-scene kz-s6' + (flying ? ' is-flying' : '')}", "<div ref={sceneRef} className={'kz-scene kz-s6 ms-root' + (flying ? ' is-flying' : '')}", 's6 root');
scr = must(scr, "parts: [T_('head', true)] }\n            ]} />\n          </div>\n        </div>\n      </Sheet>",
  "parts: [T_('head', true)] }\n            ]} />\n          </div>\n          {M.el}\n        </div>\n      </Sheet>", 's6 cursor');
// LMS CoddyCamp (14.11.2026, пакет IT dars-mashina, валидатор jsx-tekshir): урок 1 под CRM — только здесь,
// общий набор naborRedaktor и другие уроки не меняются. Корень урока зовёт useR28Lms (r28-lms.jsx):
// шрифт Inter ресурсами WOFF2 через loadFont и markFirstScreenReady.
scr = must(scr, '  useParallax();\n  usePaperSound();\n', '  useParallax();\n  usePaperSound();\n  useR28Lms();\n', 'lms hook');
writeFileSync(join(gen, 'kollazh-screens.jsx'), scr);
// Шрифты не встраиваются в CSS base64: Nunito на экранах «Редактора» не используется (весь текст — Inter),
// Inter — файлы-ресурсы урока (lessons/html/assets/01-struktura-dokumenta/<ключ>.woff2, ключ — в r28-lms.jsx).
const noFaces = (file, family) => {
  const css = readFileSync(join(gen, file), 'utf8');
  const out = css.split('\n').filter((l) => !l.startsWith("@font-face { font-family: '" + family + "'")).join('\n');
  if (out === css) throw new Error('build.mjs: нет @font-face ' + family + ' в ' + file);
  writeFileSync(join(gen, file), out);
};
noFaces('p17.css', 'Nunito');
noFaces('r28.css', 'Inter');
const assets = join(root, 'lessons/html/assets/01-struktura-dokumenta');
mkdirSync(assets, { recursive: true });
for (const f of ['inter-latin-400', 'inter-latin-600', 'inter-cyrillic-400', 'inter-cyrillic-600']) {
  copyFileSync(join(here, 'fonts', f + '.woff2'), join(assets, f.replace(/-/g, '_') + '.woff2'));
}
// Y09 (валидатор): _bAskSet — ссылка на сеттер смонтированной рамки, при размонтировании сбрасывается в null.
let chr = readFileSync(join(gen, 'b16-chrome.jsx'), 'utf8');
chr = must(chr, 'let _bAskSet = null;   // KzAsk сообщает рамке текст задания и подсказку (build.mjs)',
  'let _bAskSet = null;   // jsx-tekshir: ataylab — ramka sozlagichi, unmount\'da null bo\'ladi (KzAsk сообщает рамке текст задания)', 'bAskSet');
writeFileSync(join(gen, 'b16-chrome.jsx'), chr);

// META — урока 1 курса (lessonId html-01-struktura-dokumenta) из исходника, без замены.
let src = readFileSync(join(gen, 'p17.src.jsx'), 'utf8');
src = must(src, '/*@FILE:p17.css@*/', '/*@FILE:p17.css@*/\n/*@FILE:r28.css@*/', 'css');
src = must(src, '/*@FILE:kollazh-screens.jsx@*/', '/*@FILE:../../mysh/mysh.jsx@*/\n\n/*@FILE:kollazh-screens.jsx@*/', 'mysh jsx');
src = must(src, '/*@FILE:r28.css@*/', '/*@FILE:r28.css@*/\n/*@FILE:../../mysh/mysh.css@*/\n/*@FILE:../r28-lms.css@*/', 'mysh css');
src = must(src, '/*@FILE:kollazh-screens.jsx@*/', '/*@FILE:../r28-lms.jsx@*/\n\n/*@FILE:kollazh-screens.jsx@*/', 'lms jsx');
src = src.replace(/^\/\/ СГЕНЕРИРОВАНО[^\n]*\n/, '// СГЕНЕРИРОВАНО tools/redaktor28/build.mjs (урок 1 курса HTML, облик «Редактор») — не править руками.\n');
const srcOut = join(gen, 'r28.src.jsx');
writeFileSync(srcOut, src);

if (!process.argv.includes('--gen-only')) {
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, 'lessons/html/01-struktura-dokumenta.jsx')], { stdio: 'inherit' });
}
