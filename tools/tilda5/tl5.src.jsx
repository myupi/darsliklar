// =============================================================================
// УРОК 5 МОДУЛЯ TILDA «Цвета и шрифты» (26.11.2026, заказчик: «делай урок 5 тильды»).
// Сборка: node tools/tilda5/build.mjs → lessons/tilda/05-cveta-i-shrifty.jsx
// Правила модуля (заказчик, 24.11.2026): окна браузера и кода нет — только интерфейс Tilda; телефон — всегда в приоритете;
// каждый шаг показан указателем (курсор на компьютере, палец на телефоне). Ученик ничего не печатает — всё нажатиями.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · Tilda: Цвета и шрифты =====
//
// ЗАМЫСЕЛ. RoboKlub пишет: «сайт чёрно-белый, как у всех; сделай в цветах клуба — тёмно-синий и оранжевый; и шрифт обычный».
// Загадка (Коди ошибается): «чем больше цветов и разных шрифтов — тем ярче и лучше». По дороге ученик видит, зачем цвет
// (два цвета против радуги), выбирает читаемые сочетания, меняет цвета в «Настройки сайта → Цвета и стили», красит кнопку
// в «Настройки» блока → «КНОПКА», подбирает шрифт под характер сайта и ставит его в «Шрифты», находит ошибки на чужом сайте.
// Разгадка: один-два цвета, главный — у кнопки; контраст; один шрифт под тему.
// Дуга (13): крючок → показ «зачем цвет» → читается? → показ «цвета сайта» → цвет заголовков → цвет кнопки → сравни →
// показ «шрифт» → какой шрифт → смени шрифт → найди ошибки → в настоящей Tilda → вывод.
// =============================================================================
const META = {
  lessonId: 'tilda-05-cveta-i-shrifty',
  module: 'tilda-m1',
  lessonTitle: {
    uz: '5-dars. Ranglar va shriftlar',
    ru: 'Урок 5. Цвета и шрифты',
    en: 'Lesson 5. Colors and fonts'
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
  next: L3("Qulay joylashuv va o'qish", 'Расположение и удобство чтения', 'Layout and readability')
};

// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, why, hints, help, right, reply, riddle, wrong*, picked …; печатаются: eyebrow, ask, opts, msg, todo, q.
// ───────────────────────────────────────────────────────────────────────────
/*@FILE:tl5-texts.part.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, reply: 1, riddle: 1, right: 1, rounds: 1, ok: 1, wrong: 1, half: 1,
  wrongTab: 1, wrongRow: 1, wrongSec: 1, picked: 1, fix: 1, good: 1, bad: 1, demo: 1, okLater: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { a: 1, q: 1, A: 1, B: 1, word: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../tilda1/tl1-guide.jsx@*/

/*@FILE:../tilda1/tl1-parts.jsx@*/

/*@FILE:../tilda2/tl2-parts.jsx@*/

/*@FILE:../tilda4/tl4-parts.jsx@*/

/*@FILE:tl5-parts.jsx@*/

/*@FILE:tl5-screens.jsx@*/

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
/*@FILE:../tilda4/tl4.css@*/
/*@FILE:tl5.css@*/
`;
