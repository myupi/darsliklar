// =============================================================================
// УРОК 3 МОДУЛЯ TILDA «Блоки Text и Button» (25.11.2026, заказчик: «сделай следующий урок по тильда»).
// Сборка: node tools/tilda3/build.mjs → lessons/tilda/03-tekst-i-knopki.jsx
// Правила модуля (заказчик, 24.11.2026): окна браузера и кода нет — только интерфейс Tilda; телефон — всегда в приоритете;
// каждый шаг показан указателем (курсор на компьютере, палец на телефоне). Ученик ничего не печатает — всё нажатиями.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · Tilda: Text и Button =====
//
// ЗАМЫСЕЛ. RoboKlub пишет: «сайт открывают, но не читают, и кнопки записи нет». Загадка (Коди ошибается): «весь текст
// жирным и крупным — и все прочитают; кнопку нажмут, где бы она ни стояла». По дороге ученик узнаёт виды текста (заголовок,
// лид, текст, цитата), раскладывает тексты клуба по блокам, разрезает стену на абзацы по темам, выделяет жирным одно главное
// слово, добавляет кнопку BF101, выбирает ей текст-действие и ставит её после текста. Разгадка: жирное — только главное,
// кнопка — следующий шаг и после текста.
// Дуга (14): крючок → показ «виды текста» → какой блок → разбей стену → показ «стиль» → главное слово → сравни →
// показ «кнопка» → добавь кнопку → текст кнопки → место кнопки → проверка → в настоящей Tilda → вывод.
// =============================================================================
const META = {
  lessonId: 'tilda-03-tekst-i-knopki',
  module: 'tilda-m1',
  lessonTitle: {
    uz: '3-dars. Text va Button bloklari',
    ru: 'Урок 3. Блоки Text и Button',
    en: 'Lesson 3. Text and Button blocks'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};
/*@FILE:../tilda1/tl-words.jsx@*/

// Подписи кнопок блока и верхней полосы (как в уроке 2).
const TL2 = {
  undo: TW('Отменить', 'Undo'), redo: TW('Повторить', 'Redo'),
  copy: TW('Копировать', 'Copy'), del: TW('Удалить', 'Delete'), off: TW('Выключить', 'Turn off'), more: TW('Еще', 'More'),
  up: TW('Переместить выше', 'Move up'), down: TW('Переместить ниже', 'Move down'), plus: TW('Добавить блок', 'Add block'),
  offL: TW('Блок выключен', 'Block is off')
};

const UI = {
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Rasmlar va Cover', 'Картинки и Cover', 'Images and Cover'),
  coverSub: L3('Har shanba — robotlar!', 'Каждую субботу — роботы!', 'Robots every Saturday!')
};

// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, why, hints, help, right, reply, riddle, wrong*; печатаются: eyebrow, ask, opts, msg, names, q, A, B.
// ───────────────────────────────────────────────────────────────────────────
/*@FILE:tl3-texts.part.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, reply: 1, riddle: 1, right: 1, rounds: 1, ok: 1, wrong: 1, half: 1,
  wrongWord: 1, wrongTool: 1, wrongCat: 1, locked: 1, wrongGo: 1, wrongEn: 1, wrongUp: 1, wrongBlock: 1, bad: 1, demo: 1, okLater: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { a: 1, q: 1, A: 1, B: 1, kind: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../tilda1/tl1-guide.jsx@*/

/*@FILE:../tilda1/tl1-parts.jsx@*/

/*@FILE:../tilda2/tl2-parts.jsx@*/

/*@FILE:tl3-parts.jsx@*/

/*@FILE:tl3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../tilda1/tl1.css@*/
/*@FILE:../tilda1/tl1-real.css@*/
/*@FILE:../tilda2/tl2.css@*/
/*@FILE:tl3.css@*/
`;
