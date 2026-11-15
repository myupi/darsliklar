// ОБЩИЙ НАБОР ОБЛИКА «РЕДАКТОР» — облик урока 1 курса HTML, эталона (заказчик, 02.11.2026: бывший
// тестовый 28 стал уроком 1). Имя папки tools/redaktor28/ — историческое.
// Пишет в папку gen урока всё, что нужно для облика эталона:
//   · набор урока 1 «Kodi playground» (naborPlayground из tools/problemitas17/nabor.mjs: механики набора
//     tools/kollazh/, рамка B tools/bdizayn16/, облик p17 — снятие бумаги и раскладка на телефоне);
//   · поверх — облик «Редактор»: p17-skin.jsx → r28-skin.jsx (стол, герой, подсказка-инспектор, полёт
//     названия), kollazh-trans.jsx → r28-trans.jsx (переход «Глитч» со звуком sounds/glitch.mp3),
//     шапка и низ CoddyCamp в b16-chrome.jsx (класс сцены r28), r28.css (шрифт Inter — ресурсы урока, 15.11.2026).
//   import { naborRedaktor } from '../redaktor28/nabor.mjs';
//   naborRedaktor(join(here, 'gen'));   // потом sobrat.mjs по исходнику урока
// Включения в исходнике урока — .claude/skills/novyy-urok/references/etalon-redaktor.md, раздел «Как собрать».
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { naborPlayground } from '../problemitas17/nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('nabor.mjs (redaktor): не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

export function naborRedaktor(gen) {
  naborPlayground(gen);

  writeFileSync(join(gen, 'p17-skin.jsx'), readFileSync(join(here, 'r28-skin.jsx'), 'utf8'));
  // Перетаскивание мышью (заказчик, 05.11.2026, урок 1: «вставляется на 1 строчку выше»): строки кода в
  // «Редакторе» низкие (~23 px), а место искалось на 14 px выше курсора — под копией — и попадало на строку
  // выше. С мышью место — под курсором (копия — запасной вариант); с пальцем — как было: палец закрывает
  // строку, ученик целится копией, она летит выше пальца.
  {
    const kit = join(gen, 'kollazh-kit.jsx');
    writeFileSync(kit, must(readFileSync(kit, 'utf8'),
      'const placeAt = (x, y, touch) => placeAt1(x, y - (touch ? 40 : 14)) || placeAt1(x, y);',
      'const placeAt = (x, y, touch) => (touch ? placeAt1(x, y - 40) || placeAt1(x, y) : placeAt1(x, y) || placeAt1(x, y - 14));', 'drop under cursor'));
  }
  // Переход-глитч со звуком заказчика (sounds/glitch.mp3 встраивается в base64).
  writeFileSync(join(gen, 'kollazh-trans.jsx'), must(readFileSync(join(here, 'r28-trans.jsx'), 'utf8'), '/*@R28_GLITCH@*/',
    readFileSync(join(here, 'sounds/glitch.mp3')).toString('base64'), 'glitch sound'));

  let chrome = readFileSync(join(gen, 'b16-chrome.jsx'), 'utf8');
  chrome = must(chrome, "className={'stage b-stage p17'", "className={'stage b-stage p17 r28'", 'stage class');
  // Шапка — как в дизайне уроков CoddyCamp LMS (заказчик, 02.11.2026: «верхнюю и нижнюю часть экрана
  // берём оттуда»): «‹» назад · ярлык раздела · счётчик «3/17» · лампочка и пауза · Коди; ниже — полоса
  // прогресса из скруглённых сегментов. Названия урока сверху нет (заказчик: «вообще не нужно»).
  {
    const a = chrome.indexOf('      <div className="stage-header b-head">');
    const b = chrome.indexOf('      {speaker && (\n        <div className="speaker-wrap">');
    if (a < 0 || b < a) throw new Error('nabor.mjs (redaktor): не найдена шапка StageB');
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
  // Валидатор IT (Y09): _bAskSet — ссылка на сеттер смонтированной рамки, при размонтировании сбрасывается в null.
  chrome = must(chrome, 'let _bAskSet = null;   // KzAsk сообщает рамке текст задания и подсказку (build.mjs)',
    "let _bAskSet = null;   // jsx-tekshir: ataylab — ramka sozlagichi, unmount'da null bo'ladi (KzAsk сообщает рамке текст задания)", 'bAskSet');
  writeFileSync(join(gen, 'b16-chrome.jsx'), chrome);

  // LMS CoddyCamp (15.11.2026; пакет IT dars-mashina, валидатор jsx-tekshir: R06 и предел кода в gzip 400 КБ):
  // шрифты не встраиваются в CSS base64. Nunito на экранах «Редактора» не используется (весь текст — Inter) —
  // убран; Inter — файлы-ресурсы урока (tools/redaktor28/fonts → lessons/<курс>/assets/<урок>/<ключ>.woff2,
  // копирует sobrat.mjs), грузит их канон: useLmsPlatform → useResources().loadFont (tools/build-canon.mjs).
  {
    const p17 = join(gen, 'p17.css');
    const css = readFileSync(p17, 'utf8');
    const out = css.split('\n').filter((l) => !l.startsWith("@font-face { font-family: 'Nunito'")).join('\n');
    if (out === css) throw new Error('nabor.mjs (redaktor): нет @font-face Nunito в p17.css');
    writeFileSync(p17, out);
  }
  // Кнопка «X» LMS стоит в левом верхнем углу окна урока (8–44 px, режим ученика) — шапка начинается правее (B09).
  writeFileSync(join(gen, 'r28.css'), must(readFileSync(join(here, 'r28.css'), 'utf8'), '/*@R28_FONTS@*/',
    "/* Шрифт Inter — ресурсы WOFF2 урока, грузит канон (useLmsPlatform). */\n"
    + "/* LMS: кнопка «X» платформы — слева сверху (8–44 px): шапка урока начинается с 52 px (валидатор IT, B09). */\n"
    + '.r28.b-stage .stage-header.b-head.cc-head { padding-left: 52px; }', 'fonts'));
}
