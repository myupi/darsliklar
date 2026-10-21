// Сборка урока 1 курса HTML «Структура HTML-документа» (робот Pixel) — эталон курса
// с 19.10.2026 (до этого — тестовый урок 07).
//   node tools/robot/robot.build.mjs → lessons/test/13-struktura-robot.jsx
// (22.10.2026 заказчик: урок 1 курса — «Бумажная страница» из tools/kollazh/; робот
// перенесён в тестовые уроки.)
// Файл урока = шапка + канон курса HTML (дословно, не правится) + пометка
// «УРОК» + robot.src.jsx, куда встают: помощники урока 1 (../anatomy/zh-helpers.jsx),
// части интерфейса (rb-ui.jsx), две фигуры — шкаф документа
// (../anatomy/shkaf.figures.mjs — шкаф документа) и робот Pixel (robot.figures.mjs), CSS урока 1,
// базовый CSS моделей, свой CSS (pv-own.css + rb-own.css + раскраска Pixel) и CSS
// кита anatomy.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as k from '../anatomy/kit/iso-kit.mjs';
import { cabinetModel } from '../anatomy/shkaf.figures.mjs';
import { robotModel, armCss } from './robot.figures.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => readFileSync(here(p), 'utf8');
const canon = read('../../canon/html/canon-v1.jsx').replace(/\n+$/, '');
let src = read('./robot.src.jsx');
const put = (mark, text) => {
  if (src.indexOf(mark) < 0) throw new Error('нет метки ' + mark);
  src = src.split(mark).join(text);
};
const tpl = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// Озвучка: CSS и JavaScript — по-английски во всех языках, как HTML (заказчик, 17.10.2026).
let helpers = read('../anatomy/zh-helpers.jsx').trim();
const sayRe = "  s = s.replace(/\\b(html|HTML|head|title|body|DOCTYPE)\\b/g, (w) => word(w));";
if (helpers.indexOf(sayRe) < 0) throw new Error('нет строки замены тегов в zh-helpers.jsx');
helpers = helpers.replace(sayRe, sayRe + "\n  s = s.replace(/\\bJavaScript\\b/g, m.js || 'JavaScript').replace(/\\bCSS\\b/g, m.css || 'CSS');");
// Прогрев озвучки: подписи, которые только печатаются, не греть (достижения,
// варианты ответа, строки задания экрана).
const printedRe = "title: 1, sel: 1, icon: 1, id: 1, pose: 1, show: 1, step: 1 };";
if (helpers.indexOf(printedRe) < 0) throw new Error('нет PRINTED в zh-helpers.jsx');
helpers = helpers.replace(printedRe, "title: 1, sel: 1, icon: 1, id: 1, pose: 1, show: 1, step: 1,\n  ach: 1, titles: 1, texts: 1, askA: 1, askB: 1, askFollow: 1, askPick: 1, askPlace: 1, askHead: 1, rule: 1 };");
helpers = helpers
  .replace("doctype: 'doctype',", "doctype: 'doctype', css: 'CSS', js: 'JavaScript',")
;
// Узбекская озвучка знаков «<» и «>» — тем же термином, что в текстах урока:
// burchakli qavs (правка узбекских текстов, 17.10.2026).
const uzMarks = "lt: 'ochuvchi burchak', gt: 'yopuvchi burchak'";
if (helpers.indexOf(uzMarks) < 0) throw new Error('нет узбекских названий < и > в zh-helpers.jsx');
helpers = helpers.replace(uzMarks, "lt: 'chap burchakli qavs', gt: 'o‘ng burchakli qavs'");
// Озвучка (правка 21.10.2026). 1) Узбекский закрывающий тег — «yopuvchi title tegi»
// (порядок слов узбекского), а не «yopuvchi teg title». 2) Знак в кавычках, который
// стоит рядом со своим названием («chap «<» qavsdan», «уголка «<»», «the bracket “<”»),
// в речь не идёт — название уже звучит; знак без названия читается словами.
const closeRe = "s = s.replace(/<\\s*\\/\\s*([a-z][a-z0-9]*)\\s*>/gi, (all, t) => m.close + ' ' + word(t));";
if (helpers.indexOf(closeRe) < 0) throw new Error('нет замены закрывающего тега в zh-helpers.jsx');
helpers = helpers.replace(closeRe, String.raw`// Знак рядом со своим названием — только название; знак без названия — словами.
  const SIGN_WORD = '(?:qavs|chiziq|скобк|уголк|черт|bracket|slash)[^\\s,.!?:;]*';
  s = s.replace(new RegExp('(' + SIGN_WORD + ')\\s*[«“"]\\s*[<>/\\\\]\\s*[»”"]', 'gi'), '$1');
  s = s.replace(new RegExp('[«“"]\\s*[<>/\\\\]\\s*[»”"]\\s*(' + SIGN_WORD + ')', 'gi'), '$1');
  s = s.replace(/[«“"]\s*([<>/\\])\s*[»”"]/g, (all, c) => ' ' + (c === '<' ? m.lt : c === '>' ? m.gt : m.slash) + ' ');
  s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => (m.closeOf ? m.closeOf(word(t)) : m.close + ' ' + word(t)));`);
const uzClose = "close: 'yopuvchi teg', lt: 'chap burchakli qavs'";
if (helpers.indexOf(uzClose) < 0) throw new Error('нет узбекского close в zh-helpers.jsx');
helpers = helpers.replace(uzClose, "close: 'yopuvchi teg', closeOf: (w) => 'yopuvchi ' + w + ' tegi', lt: 'chap burchakli qavs'");

// Раскраска слоя «вид»: у каждой группы data-paint свой цвет; грани — светлее
// и темнее его, рёбра — темнее (на тёмных деталях — светлее).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const lum = (h) => { const [r, g, b] = hex(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const PAINT = {
  base: '#24345E', base2: '#2F4473', plate: '#F4EBD9', limb: '#8C98AD', limb2: '#A9B3C4', frame: '#C9824A',
  shell: '#FF7A45', head: '#F4EBD9', hand: '#F4EBD9', face: '#1E2B4A', eye: '#5EEAD4', mouth: '#5EEAD4',
  screen: '#10213F', ans1: '#FFB703', ans2: '#4CC9F0', btn1: '#4CC9F0', btn2: '#FFD166', btn3: '#B388FF', ant: '#FFB703'
};
const paintCss = Object.entries(PAINT).map(([name, c]) => {
  const dark = lum(c) < 0.3;
  const edge = (t) => (dark ? mix(c, '#ffffff', t) : mix(c, '#000000', t));
  const v = {
    paper: c, top: mix(c, '#ffffff', 0.3), 'shade-3': mix(c, '#ffffff', 0.12), 'shade-2': c,
    'shade-1': mix(c, '#000000', 0.1), 'shade-0': mix(c, '#000000', 0.2),
    hi: name === 'mouth' ? c : edge(0.55), mid: edge(0.38), lo: edge(0.26), faint: edge(0.16), dot: edge(0.6)
  };
  return '.fig-robot.rb-css [data-paint="' + name + '"] { ' + Object.entries(v).map(([kk, vv]) => '--anatomy-' + kk + ': ' + vv + ';').join(' ') + ' }';
}).join('\n');

put('/*@HELPERS@*/', helpers);
put('/*@UI@*/', read('./rb-ui.jsx').trim());
// Шкаф документа (заказчик, 17.10.2026) с настройками урока: табличка <!DOCTYPE html>
// на крышке, ящики в покое задвинуты — экран 6 выдвигает их по одному (head-cover /
// body-cover), ярлыки в порядке кода: <head> на панели, </head> внутри, <html> / </html>
// на боковине сверху и снизу.
put('/*@FIGURES@*/', 'const FIG = ' + JSON.stringify(cabinetModel({ doctype: true, covers: true, tagsFront: true })) + ';\nconst RFIG = ' + JSON.stringify(robotModel()) + ';\nconst RFIG_BUST = ' + JSON.stringify(robotModel({ bust: true })) + ';');
put('/*@LESSON1_CSS@*/', read('../anatomy/zaglyani.css').trim());   // CSS внутри шаблонной строки урока
put('/*@ISO_CSS@*/', tpl(k.ISO_CSS.trim()));
put('/*@FIG_CSS@*/', read('../anatomy/pv-base.css').trim());
put('/*@OWN_CSS@*/', read('../anatomy/pv-own.css').trim() + '\n' + read('./rb-own.css').trim() + '\n' + paintCss + '\n' + armCss());

const head = `// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 1 — «Структура HTML-документа»
// Эталон курса (заказчик, 19.10.2026). Переделка прежнего урока 1 по отзывам
// учеников: зачем HTML, робот Pixel из трёх слоёв (навык anatomy), каждый тег
// объясняется там, где появляется. Прежний вариант — lessons/test/09-struktura-dokumenta-kodi.jsx.
// Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
//
// Пропсы: { studentName, lang, ttsApiBase, voiceGender, onFinished } — весь список.
// ФАЙЛ СОБРАН: node tools/robot/robot.build.mjs. Правится tools/robot/robot.src.jsx,
// rb-ui.jsx, rb-own.css и robot.figures.mjs, а не этот файл.
// =============================================================================
`;
const out = head + '\n' + canon + '\n' + '// ==============================  У Р О К  =====================================\n' + src;
const dest = here('../../lessons/test/13-struktura-robot.jsx');
writeFileSync(dest, out);
console.log('wrote', dest, Math.round(out.length / 1024) + ' KB');
