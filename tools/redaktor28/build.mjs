// Сборка тестового урока 28 «Структура HTML-документа — облик «Редактор»» (02.11.2026).
//   node tools/redaktor28/build.mjs   → lessons/test/28-struktura-redaktor.jsx
// Заказчик: «создай тестовый урок в стиле, который ты предложил… из прошлого стиля можно ничего
// не оставлять, вплоть до анимаций и переходов, но структура урока не должна меняться».
// Поэтому экраны, механики и тексты — урока 1 курса как есть: tools/problemitas17/build.mjs --gen-only
// пишет их папку gen/ (урок 1 при этом не пересобирается), она копируется сюда, и в копии меняется облик:
//   · p17-skin.jsx → r28-skin.jsx (рабочий стол, свой герой, подсказка-инспектор, полёт названия);
//   · kollazh-trans.jsx → r28-trans.jsx (переход «Глитч»);
//   · сцене добавляется класс r28, к CSS — r28.css (редактор кода, браузер, рамка, движение);
//   · шапка и низ (с панелями результата) — по дизайну уроков CoddyCamp LMS
//     (CODDY_CAMP_DESIGN_SYSTEM.md + макеты; 02.11.2026), шрифт Inter встроен (fonts/); содержимое экрана — облик «Редактор»;
//   · цвета кусков, летящих в героя на экране 1, — цвета нового героя;
//   · META — свой id и название (прогресс не делится с уроком 1).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const P17 = join(root, 'tools/problemitas17');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

execFileSync('node', [join(P17, 'build.mjs'), '--gen-only'], { stdio: 'inherit' });
for (const f of readdirSync(join(P17, 'gen'))) copyFileSync(join(P17, 'gen', f), join(gen, f));

copyFileSync(join(here, 'r28-skin.jsx'), join(gen, 'p17-skin.jsx'));
copyFileSync(join(here, 'r28-trans.jsx'), join(gen, 'kollazh-trans.jsx'));

let chrome = readFileSync(join(gen, 'b16-chrome.jsx'), 'utf8');
chrome = must(chrome, "className={'stage b-stage p17'", "className={'stage b-stage p17 r28'", 'stage class');
// Шапка — как в дизайне уроков CoddyCamp LMS (заказчик, 02.11.2026: «верхнюю и нижнюю часть экрана
// берём оттуда»): «‹» назад · ярлык раздела · счётчик «3/17» · лампочка и пауза · Коди; ниже — полоса
// прогресса из скруглённых сегментов. Названия урока сверху нет (заказчик: «вообще не нужно»).
{
  const a = chrome.indexOf('      <div className="stage-header b-head">');
  const b = chrome.indexOf('      {speaker && (\n        <div className="speaker-wrap">');
  if (a < 0 || b < a) throw new Error('build.mjs: не найдена шапка StageB');
  chrome = chrome.slice(0, a) + `      <div className="stage-header b-head cc-head">
        <div className="limit cc-row2">
          <span className="cc-left"><BExit /></span>
          {eyebrow ? (
            <div className={'b-chip ' + (task ? 'is-task' : 'is-show')}>
              <BIco d={task ? B_ICO.pencil : B_ICO.book} size={16} w={2.4} /><span className="b-chip-t">{pick(eyebrow)}</span>
            </div>
          ) : <span />}
          <span className="b-count counter cc-count">{screen + 1}<i>/{total}</i></span>
          <div className="chrome-side b-side">
            {nav && <HintChromeBtn />}
            {nav && <PauseBtn done={done} />}
          </div>
          {speaker && !hideSpeaker ? <VoiceDot pose={speaker.pose} /> : null}
        </div>
        <div className="limit cc-row3"><BProgress screen={screen} total={total} /></div>
      </div>
` + chrome.slice(b);
}
chrome = must(chrome, '<BIco d={B_ICO.x} size={24} w={2.4} />', '<BIco d={<path d="m15 18-6-6 6-6" />} size={26} w={2.4} />', 'exit chevron');
writeFileSync(join(gen, 'b16-chrome.jsx'), chrome);

// Шрифт Inter (SIL OFL; латиница и кириллица, 400 и 600) — встроен в CSS: урок не грузит ничего снаружи.
{
  const face = (file, w, range) => "@font-face { font-family: 'Inter'; font-style: normal; font-weight: " + w + "; font-display: swap; src: url(data:font/woff2;base64,"
    + readFileSync(join(here, 'fonts', file)).toString('base64') + ") format('woff2'); unicode-range: " + range + '; }';
  const LAT = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
  const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
  const fonts = [face('inter-latin-400.woff2', '300 500', LAT), face('inter-latin-600.woff2', '600 900', LAT),
    face('inter-cyrillic-400.woff2', '300 500', CYR), face('inter-cyrillic-600.woff2', '600 900', CYR)].join('\n');
  writeFileSync(join(gen, 'r28.css'), must(readFileSync(join(here, 'r28.css'), 'utf8'), '/*@R28_FONTS@*/', fonts, 'fonts'));
}

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
writeFileSync(join(gen, 'kollazh-screens.jsx'), scr);

let src = readFileSync(join(gen, 'p17.src.jsx'), 'utf8');
src = must(src, "lessonId: 'html-01-struktura-dokumenta',", "lessonId: 'test-28-struktura-redaktor',", 'lessonId');
src = must(src, "    uz: '1-dars. HTML hujjatining tuzilishi',\n    ru: 'Урок 1. Структура HTML-документа',\n    en: 'Lesson 1. HTML document structure'",
  "    uz: 'HTML hujjatining tuzilishi — «Muharrir» ko‘rinishi',\n    ru: 'Структура HTML-документа — облик «Редактор»',\n    en: 'HTML document structure — “Editor” look'", 'title');
src = must(src, '/*@FILE:p17.css@*/', '/*@FILE:p17.css@*/\n/*@FILE:r28.css@*/', 'css');
src = src.replace(/^\/\/ СГЕНЕРИРОВАНО[^\n]*\n/, '// СГЕНЕРИРОВАНО tools/redaktor28/build.mjs из сборки урока 1 (tools/problemitas17/) — не править руками.\n');
const srcOut = join(gen, 'r28.src.jsx');
writeFileSync(srcOut, src);

// --gen-only: только папка gen/ (для урока 29 «Живой редактор»), без сборки урока 28.
if (!process.argv.includes('--gen-only')) {
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, 'lessons/test/28-struktura-redaktor.jsx')], { stdio: 'inherit' });
}
