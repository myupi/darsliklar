// Сборка тестового урока 29 «Структура HTML-документа — Kodi playground» (урок 1 курса и эталон
// 02.11.2026 до замены уроком «Редактор»; заказчик, 02.11.2026: «сделай урок 28 первым, а этот — в тестовый»).
//   node tools/problemitas17/build.mjs   → lessons/test/29-struktura-playground.jsx
// --gen-only — только папка gen/: экраны, реплики и исходник урока 1 (с META урока 1 курса) для урока 1
// курса в облике «Редактор» (tools/redaktor28/build.mjs); в ней lessonId НЕ меняется.
// Основа — урок 16 «B · O'yin» как есть (реплики, экраны, шапка и низ рамки B, tools/bdizayn16/),
// он же — бумажный урок 1 (tools/kollazh/) с рамкой B; облик — «Kodi playground»: тёплый фон,
// Nunito, мягкие карточки с нажимной тенью, браузер как Chrome в Windows, героиня в манере
// референсов заказчика, переход «Клубки шерсти». Бумажного стиля нет.
// Исходники урока 1 (tools/kollazh/) и урока 16 (tools/bdizayn16/) не меняются: их копии
// с правками ложатся в tools/problemitas17/gen/. Общие для всех уроков в этом облике правки
// набора и рамки — в nabor.mjs (naborPlayground); здесь — только экраны и реплики урока 1.
// Что меняется в копиях:
//   · всё, что меняет урок 16 (StageB, KzAsk → панели, английские слова в речи);
//   · палитра набора KZ; Sheet и PaperMan (героиня) — p17-skin.jsx, прежние переименованы;
//   · Cut: содержимое вырезки — отдельным слоем поверх «материала»;
//   · переход между экранами — p17-trans.jsx вместо kollazh-trans.jsx; шороха бумаги нет;
//   · ступеньки stop-motion в CSS набора и в полётах экранов — плавные;
//   · к CSS добавляется p17.css.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { naborPlayground } from './nabor.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const L1 = join(root, 'tools/kollazh');
const B16 = join(root, 'tools/bdizayn16');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

// Экраны урока 1 — урока 16 (tools/bdizayn16/b16-screens.jsx) с правками облика; кладутся на место kollazh-screens.jsx.
{
  const f = 'kollazh-screens.jsx';
  let s = readFileSync(join(B16, 'b16-screens.jsx'), 'utf8');
  {
    s = s.replace(/<Stage(\s)/g, '<StageB$1').replace(/<\/Stage>/g, '</StageB>');
    // Куски браузера, летящие в персонажа (экран 1) и из тела в окно (экран 8): без рваного края,
    // мягкими «таблетками», в цветах плюшевого персонажа, полёт плавный с пружинкой в конце.
    s = must(s, "clipPath: pc.round ? null : torn(pc.seed, 6, 2.5, Math.max(0.2, Math.min(5, g.w / Math.max(1, g.h)))),", 'clipPath: null,', 'morph clip');
    s = must(s, "borderRadius: pc.round ? (fly ? (pc.fade ? '6px' : '50%') : '6px 6px 0 0') : null,", "borderRadius: fly ? (pc.fade ? '12px' : '999px') : '14px',", 'morph radius');
    s = must(s, "const st = fly ? 'steps(9, end)' : 'steps(2, end)';", "const st = fly ? 'cubic-bezier(.5, 0, .2, 1.18)' : 'ease-out';", 'morph timing');
    // Экран 1, браузер → человечек: куски берут цвета нового браузера (как Chrome в Windows: серая
    // полоса, белая панель и вкладка) и летят в настоящие контуры частей человечка
    // (p17MorphBox в p17-skin.jsx), а не в их прямоугольники с запасом; вкладка с названием —
    // розовой капсулой туда, где она покажется под крышкой головы.
    s = must(s, "{ k: 'legL', c0: KZ.ink, c: KZ.ink,", "{ k: 'legL', c0: '#DEE1E6', c: '#6CCBA8',", 'morph legL');
    s = must(s, "{ k: 'legR', c0: KZ.ink, c: KZ.ink,", "{ k: 'legR', c0: '#DEE1E6', c: '#6CCBA8',", 'morph legR');
    s = must(s, "{ k: 'armL', c0: '#E6DCC6', c: KZ.ink,", "{ k: 'armL', c0: '#FFFFFF', c: '#FF8D7D',", 'morph armL');
    s = must(s, "{ k: 'armR', c0: '#E6DCC6', c: KZ.ink,", "{ k: 'armR', c0: '#FFFFFF', c: '#FF8D7D',", 'morph armR');
    s = must(s, "{ k: 'head', c0: KZ.ink, c: KZ.face,", "{ k: 'head', c0: '#DEE1E6', c: '#E9B48C',", 'morph head');
    s = must(s, "{ k: 'body', c0: KZ.cream, c: KZ.teal,", "{ k: 'body', c0: KZ.cream, c: '#7FD6B6',", 'morph body');
    s = must(s, "{ k: 'name', c0: '#E6DCC6', c: '#E6DCC6',", "{ k: 'name', c0: '#FFFFFF', c: '#F7A3CB',", 'morph name');
    s = must(s, "const to = (el) => ({ x: M.left - S.left + el.offsetLeft, y: M.top - S.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,",
      "const to = (el) => p17MorphBox(el, { x: M.left - S.left + el.offsetLeft, y: M.top - S.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,", 'morph to');
    s = must(s, "      r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0 });\n    const half",
      "      r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0 });\n    const half", 'morph to end');
    s = must(s, "to: { x: head.x + head.w * 0.18, y: head.y + head.h * 0.36, w: head.w * 0.64, h: head.h * 0.26, r: -4 }",
      "to: p17NameBox(part('head'), { x: M.left - S.left, y: M.top - S.top })", 'morph name to');
    s = s.replace(/steps\(\d+, end\)/g, 'cubic-bezier(.45, 0, .2, 1.1)');
    // Экран 1: облачко у человечка — простым словом («Bosh» / «Tana»), теги head и body ещё не знакомы.
    s = must(s, "<PaperMan key={phase === 'man' ? 'm' : 'g'} anim={false} hl={hl} spot wave={phase === 'man'}",
      "<PaperMan key={phase === 'man' ? 'm' : 'g'} anim={false} hl={hl} spot plain wave={phase === 'man'}", 's1 plain');
    // Переход «Клубки шерсти» катится в сторону шага: «Дальше» — вправо, «Назад» — влево.
    s = must(s, 'next: go(R.next), prev: R.i > 0 ? go(R.prev) : null', 'next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null', 'go dir');
    // Экран 8 (body): в строке на листе — коротко, длинную фразу Коди говорит голосом
    // (заказчик, 30.10.2026: «многовато текста, для человечка мало места»).
    s = must(s, '<KzAsk text={out ? c.done : c.ask} />', '<KzAsk text={out ? P17_S9_DONE : c.ask} />', 's9 ask');
    // Экран 8: тело не подсвечивается (заказчик, 30.10.2026: «подсвечивание тела уберём, оставим
    // анимацию, как элементы вылетают»), куски страницы просто вылетают из тела в окно.
    s = must(s, "<PaperMan anim={false} hl={speaker.text === c.say || going ? 'body' : null} spot={speaker.text === c.say} />",
      '<PaperMan anim={false} />', 's9 no hl');
    s = must(s, `{ look: () => sceneRef.current && sceneRef.current.querySelector('.kz-man [aria-label="body"]'), act: () => { sfx('pop', true); setPhase(`,
      `{ look: () => null, act: () => { sfx('pop', true); setPhase(`, 's9 no look');
    // Бирка body на человечке — сбоку от свитшота, на уровне груди, «хвостиком» к телу: не закрывает
    // человечка и видно, к чему она (заказчик, 30.10.2026).
    s = must(s, 'setLbl({ body: { x: m.B.left - m.S.left + m.B.width / 2, y: m.B.top - m.S.top },',
      'setLbl({ body: { x: m.B.right - m.S.left - m.B.width * 0.05, y: m.B.top - m.S.top + m.B.height * 0.4 },', 's9 body label');
    // Бирка body у окна — на самой странице, в нижнем левом углу (страница и есть body), а не на вкладке
    // и кнопках окна и не над браузером, где она упиралась в ноги человечка (проверка «от и до», 31.10.2026).
    s = must(s, 'win: { x: m.W.right - m.S.left - 8, y: m.W.top - m.S.top } });', 'win: { x: m.W.left - m.S.left + 8, y: m.W.bottom - m.S.top - 8 } });', 's9 win label');
  }
  writeFileSync(join(gen, f), s);
}

// Набор облика (правки kollazh-kit, css, перехода, шороха; рамка B, p17) — nabor.mjs.
naborPlayground(gen);
writeFileSync(join(gen, 'b16-texts.jsx'), readFileSync(join(B16, 'b16-texts.jsx'), 'utf8'));

let src = readFileSync(join(L1, 'kollazh.src.jsx'), 'utf8');
// В gen — META урока 1 курса (lessonId html-01-struktura-dokumenta): исходник берёт урок 1 курса (tools/redaktor28).
src = must(src, '/*@L2_HELPERS@*/', '/*@FILE:b16-texts.jsx@*/\n\n/*@L2_HELPERS@*/', 'texts');
src = must(src, '/*@FILE:kollazh-paper-data.jsx@*/', '/*@FILE:b16-chrome.jsx@*/\n\n/*@FILE:p17-skin.jsx@*/\n\n/*@FILE:kollazh-paper-data.jsx@*/', 'chrome');
src = must(src, '/*@FILE:kollazh.css@*/', '/*@FILE:kollazh.css@*/\n/*@FILE:b16.css@*/\n/*@FILE:p17.css@*/', 'css');
src = '// СГЕНЕРИРОВАНО tools/problemitas17/build.mjs из tools/kollazh/ и tools/bdizayn16/ — не править руками.\n' + src;
const srcOut = join(gen, 'p17.src.jsx');
writeFileSync(srcOut, src);

// --gen-only: только папка gen/ (экраны и исходник урока 1 для урока 1 курса в облике «Редактор»), без сборки.
// Сборка тестового 29: свой lessonId и название (прогресс не делится с уроком 1 курса) — в отдельной копии исходника.
if (!process.argv.includes('--gen-only')) {
  let t = must(src, "lessonId: 'html-01-struktura-dokumenta',", "lessonId: 'test-29-struktura-playground',", 'lessonId');
  t = must(t, "    uz: '1-dars. HTML hujjatining tuzilishi',\n    ru: 'Урок 1. Структура HTML-документа',\n    en: 'Lesson 1. HTML document structure'",
    "    uz: 'HTML hujjatining tuzilishi — «Kodi playground»',\n    ru: 'Структура HTML-документа — «Kodi playground»',\n    en: 'HTML document structure — “Kodi playground”'", 'title');
  const srcT = join(gen, 'p17-test29.src.jsx');
  writeFileSync(srcT, t);
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcT, join(root, 'lessons/test/29-struktura-playground.jsx')], { stdio: 'inherit' });
}
