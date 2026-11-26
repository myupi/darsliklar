// =============================================================================
// УРОК 4 МОДУЛЯ TILDA «Картинки и Cover» (25.11.2026, заказчик: «делай следующий урок тильды»).
// Сборка: node tools/tilda4/build.mjs → lessons/tilda/04-kartinki-i-cover.jsx
// Правила модуля (заказчик, 24.11.2026): окна браузера и кода нет — только интерфейс Tilda; телефон — всегда в приоритете;
// каждый шаг показан указателем (курсор на компьютере, палец на телефоне). Ученик ничего не печатает — всё нажатиями.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · Tilda: Картинки и Cover =====
//
// ЗАМЫСЕЛ. RoboKlub пишет: «сайт скучный — одни буквы, а на обложке чужие горы». Загадка (Коди ошибается): «чем больше
// картинок и чем они ярче — тем лучше; подойдёт любая красивая». По дороге ученик добавляет блок IM01, находит фото в
// «Библиотеке изображений» (фото занятия, а не робот из кино), даёт ему альт-текст, удаляет лишние картинки Коди, ставит на
// обложку широкое фото клуба и настраивает фильтр, чтобы текст читался. Разгадка: картинка — про сайт, обложке — широкое
// фото, фильтр — чтобы текст читался.
// Дуга (13): крючок → показ «блок картинки» → добавь картинку → выбери фото → альт-текст → лишние картинки →
// показ «обложка» → фон обложки → показ «фильтр» → настрой фильтр → проверка → в настоящей Tilda → вывод.
// =============================================================================
const META = {
  lessonId: 'tilda-04-kartinki-i-cover',
  module: 'tilda-m1',
  lessonTitle: {
    uz: '4-dars. Rasmlar va Cover',
    ru: 'Урок 4. Картинки и Cover',
    en: 'Lesson 4. Images and Cover'
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
  next: L3('Ranglar va shriftlar', 'Цвета и шрифты', 'Colors and fonts')
};

// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, why, hints, help, right, reply, riddle, wrong*, picked …; печатаются: eyebrow, ask, opts, msg, todo, q.
// ───────────────────────────────────────────────────────────────────────────
/*@FILE:tl4-texts.part.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, reply: 1, riddle: 1, right: 1, rounds: 1, ok: 1, wrong: 1, half: 1,
  wrongPlace: 1, wrongCat: 1, locked: 1, picked: 1, keep: 1, wrongTool: 1, notImg: 1, wrongLow: 1, wrongHigh: 1, bad: 1, demo: 1, okLater: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { a: 1, q: 1, A: 1, B: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../tilda1/tl1-guide.jsx@*/

/*@FILE:../tilda1/tl1-parts.jsx@*/

/*@FILE:../tilda2/tl2-parts.jsx@*/

/*@FILE:tl4-parts.jsx@*/

/*@FILE:tl4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../tilda1/tl1.css@*/
/*@FILE:../tilda1/tl1-real.css@*/
/*@FILE:../tilda2/tl2.css@*/
/*@FILE:../tilda3/tl3.css@*/
/*@FILE:tl4.css@*/
`;
