// =============================================================================
// УРОК 2 МОДУЛЯ TILDA «Блоки: что это и как добавить» (25.11.2026, заказчик: «делай второй урок тильды»).
// Сборка: node tools/tilda2/build.mjs → lessons/tilda/02-bloki.jsx
// Правила модуля (заказчик, 24.11.2026): окна браузера и кода нет — только интерфейс Tilda; телефон — всегда в приоритете;
// каждый шаг показан указателем (курсор на компьютере, палец на телефоне). Интерфейс — по настоящей Tilda (сверка 24–25.11.2026).
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · Tilda: блоки =====
//
// ЗАМЫСЕЛ. Клуб роботов просит: после обложки — заголовок, картинка, текст о клубе. Загадка (Коди ошибается): «новый блок
// встаёт только вниз, переставить нельзя, ошибся — всё заново». Разгадка: «+» ставит блок куда нужно, стрелки переставляют,
// ↶ возвращает удалённое. По дороге ученик узнаёт, что у блока есть шифр (CR, TL, TX, IM) и раздел в библиотеке, добавляет
// заголовок и текст, пишет свой текст, добавляет картинку через «+», переставляет её, удаляет лишний блок, отменяет ошибку.
// Дуга: крючок → показ «блок и шифр» → показ «как добавить» → заголовок → текст → свой текст → показ «кнопки блока» →
// картинка через «+» → переставить → удалить → отменить → проверка кнопок → в настоящей Tilda → вывод.
// =============================================================================
const META = {
  lessonId: 'tilda-02-bloki',
  module: 'tilda-m1',
  lessonTitle: {
    uz: "2-dars. Bloklar: nima va qanday qo'shiladi",
    ru: 'Урок 2. Блоки: что это и как добавить',
    en: 'Lesson 2. Blocks: what they are and how to add them'
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

// Подписи кнопок блока и верхней полосы (подсказки Tilda при наведении).
const TL2 = {
  undo: TW('Отменить', 'Undo'), redo: TW('Повторить', 'Redo'),
  copy: TW('Копировать', 'Copy'), del: TW('Удалить', 'Delete'), off: TW('Выключить', 'Turn off'), more: TW('Еще', 'More'),
  up: TW('Переместить выше', 'Move up'), down: TW('Переместить ниже', 'Move down'), plus: TW('Добавить блок', 'Add block'),
  offL: TW('Блок выключен', 'Block is off')
};

const UI = {
  done: L3('Tayyor', 'Готово', 'Done'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Text va Button bloklari', 'Блоки Text и Button', 'Text and Button blocks'),
  coverSub: L3('Har shanba — robotlar!', 'Каждую субботу — роботы!', 'Robots every Saturday!')
};

// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, why, hints, help, right, reply, riddle, wrong*; печатаются: eyebrow, ask, opts, msg, names, q.
// ───────────────────────────────────────────────────────────────────────────
/*@FILE:tl2-texts.part.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, reply: 1, riddle: 1, wrongCat: 1, quote: 1, empty: 1, same: 1,
  right: 1, rounds: 1, wrongDown: 1, wrongBlock: 1, wrongTool: 1, wrongPlus: 1, wrongRedo: 1, wrong: 1, bad: 1, demo: 1, okLater: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { a: 1, q: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../tilda1/tl1-guide.jsx@*/

/*@FILE:../tilda1/tl1-parts.jsx@*/

/*@FILE:tl2-parts.jsx@*/

/*@FILE:tl2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../tilda1/tl1.css@*/
/*@FILE:../tilda1/tl1-real.css@*/
/*@FILE:tl2.css@*/
`;
