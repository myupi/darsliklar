// =============================================================================
// УРОК 1 МОДУЛЯ TILDA «Знакомство с Tilda и первый сайт» (24.11.2026, заказчик: «создай первый урок тильды, неважно
// сколько там слайдов, главное чтобы ученик понял»). Сборка: node tools/tilda1/build.mjs → lessons/tilda/01-vvedenie.jsx
// Правила модуля (заказчик, 24.11.2026): окна браузера и кода нет — только интерфейс Tilda; телефон — всегда в приоритете.
// Интерфейс Tilda нарисован по настоящему (сверка 24.11.2026, docs/tilda-redaktor-zametki.md); слова интерфейса — как в Tilda:
// на русском для uz и ru (узбекского интерфейса у Tilda нет), на английском для en.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 · Tilda: знакомство и первый сайт =====
//
// ПЕРЕДЕЛКА 24.11.2026 (заказчик: «ученик вообще не знает что такое тильда… сумел зарегаться и офигенно его использовать до конца
// курса»): живые примеры сайтов, слова Tilda с переводом, как открыть tilda.cc, окно cookies, регистрация руками ученика,
// редактор в телефонном виде (значки, как в настоящей Tilda на узком экране), вход в следующий раз, в конце — то же
// в настоящей Tilda с адресом своего сайта.
// ЗАМЫСЕЛ. Кружку роботов к завтрашнему дню нужен сайт. Коди: «без кода и за пару минут — на Tilda». Загадка (Коди
// ошибается): «сайт сделать просто, но чтобы выпустить его в интернет, надо платить и звать программиста». Разгадка —
// кнопка «Опубликовать»: бесплатный адрес .tilda.ws сразу. По дороге ученик узнаёт, что Tilda — конструктор из блоков,
// что на ней делают (и чего нет), что нужно для работы, как регистрироваться (правильная почта, надёжный пароль),
// что такое проект и страница, из чего состоит редактор; сам собирает и публикует первую страницу.
// Дуга: крючок → показ «конструктор» → что делают → что нужно → показ регистрации → почта → пароль → показ «проект и
// страницы» → создать проект → пустая страница → показ редактора → библиотека → блок без замка → свой заголовок →
// публикация → верно / неверно → вывод.
// =============================================================================
const META = {
  lessonId: 'tilda-01-vvedenie',
  module: 'tilda-m1',
  lessonTitle: {
    uz: '1-dars. Tilda bilan tanishuv va birinchi sayt',
    ru: 'Урок 1. Знакомство с Tilda и первый сайт',
    en: 'Lesson 1. Meet Tilda: your first site'
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
/*@FILE:tl-words.jsx@*/

const UI = {
  done: L3('Tayyor', 'Готово', 'Done'),
  yes: L3('Ha, bo\'ladi', 'Да, можно', 'Yes, you can'),
  no: L3("Yo'q, kod kerak", 'Нет, нужен код', 'No, you need code'),
  tru: L3("To'g'ri", 'Верно', 'True'),
  fls: L3("Noto'g'ri", 'Неверно', 'False'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Bloklar: nima va qanday qo\'shiladi', 'Блоки: что это и как добавить', 'Blocks: what they are and how to add them'),
  club: L3('Robotlar klubi', 'Клуб роботов', 'Robot club'),
  homework: L3('Uyga vazifa', 'Домашнее задание', 'Homework')
};


// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, done, why, hints, help, right, reply, intro; печатаются: eyebrow, ask, opts, items.
// ───────────────────────────────────────────────────────────────────────────
/*@FILE:tl1-texts.part.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, reply: 1, riddle: 1, sayPick: 1, sayCat: 1, sayOpen: 1,
  notAi: 1, notTpl: 1, wrongCat: 1, locked: 1, empty: 1, same: 1, right: 1, rounds: 1, hintsB: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { a: 1, t: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:tl1-guide.jsx@*/

/*@FILE:tl1-parts.jsx@*/

/*@FILE:tl1-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:tl1.css@*/
/*@FILE:tl1-real.css@*/
`;
