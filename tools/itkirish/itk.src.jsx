// =============================================================================
// ВВОДНЫЙ УРОК «IT ga kirish: IT va dasturlash nima?» (тестовый, 25.11.2026). Заказчик: «нужно сделать первый урок, где
// ученику объясняется что такое it и прочее, представь что ты скачал приложение и та не знаешь что вообще такое
// программирование и it… сделай всё в нашем стиле». Референс — пробные уроки «Foundation» в Figma Senior Program
// (старый и новый IT, железо и программы, ОС, направления IT, компании, удалённая работа, алгоритм, языки, первая практика).
// Сборка: node tools/itkirish/build.mjs → lessons/test/36-it-ga-kirish.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ВВОДНЫЙ УРОК · IT ga kirish (версия 2) =====
//
// Версия 1 (13 экранов с теорией) заказчик отверг: «урок в начале вообще не цепляющий… слайдов дофига, слайды скучные,
// ученик не захочет обрести курс». Шесть игр без вступления — тоже нет: «нет ни приветствия… мы должны открыть путь к
// айти, объяснить ему что это, дать пощупать, заинтересовать».
// ЗАМЫСЕЛ. Коди здоровается и предлагает открыть дверь в мир IT: дверь распахивается, вылетают игры, сайты, приложения,
// роботы, ИИ. «Что такое IT»: ученик нажимает буквы I и T, они раскрываются (информация, технологии), фото летит с
// телефона на телефон. Приложения переворачиваются — внутри код, его пишут программисты. Ученик сам чинит сломанную
// игру, меняя одно число в коде. Загадка (Коди ошибается): «компьютер умный, думает сам, просто ленится». Робот идёт по
// пути ученика буквально, даже в стену — разгадка: компьютер только выполняет, думает программист; команды по порядку —
// алгоритм. Направления IT — четыре карточки с живым примером работы. Первая программа без клавиатуры: слово, цвет, «Запустить» — неоновая вывеска. Итог — праздник: медаль, три победы, что ученик создаст в курсе (без «следующего урока»).
// Дуга (8): приветствие · что такое IT · код в приложениях · игра · робот · направления IT · первая программа · итог.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'test-36-it-ga-kirish',
  module: 'kirish',
  lessonTitle: {
    uz: 'Kirish. IT va dasturlash nima?',
    ru: 'Введение. Что такое IT и программирование?',
    en: 'Intro. What are IT and programming?'
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

const UI = {
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('HTML hujjat tuzilishi', 'Структура HTML-документа', 'HTML document structure')
};

// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, ok, wow, riddle, lvlOk, low, equal, hints, bump, edge, short, empty, noColor,
// types.*.say; печатаются: eyebrow, ask, подписи, кнопки, вопросы и ответы S4.
// ───────────────────────────────────────────────────────────────────────────
/*@FILE:itk-texts.part.jsx@*/

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { sayI: 1, sayT: 1, hints: 1, riddle: 1, wow: 1, ok: 1, lvlOk: 1, low: 1, equal: 1, bump: 1, edge: 1, short: 1, empty: 1, noColor: 1,
  dirs: 1 });
Object.assign(NOT_SPOKEN_IN, { dirs: { name: 1, who: 1, does: 1 } });

// Новая узбекская озвучка (заказчик, 25.11.2026: «чтобы поменялся хоть 1 символ, чтобы платформа посчитала, что такой
// записи нет»): в конец каждой узбекской реплики — невидимый пробел нулевой ширины (U+200B). На экране ничего не меняется,
// а для сервиса озвучки это новый текст — он сгенерирует запись заново. Обход — как у heroLines (SPOKEN, NOT_SPOKEN_IN).
const ITK_UZ_NEW = '​';
function itkUzNew(node, on, parent) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach((x) => itkUzNew(x, on, parent)); return; }
  if (node.uz !== undefined || node.ru !== undefined) {
    if (on && typeof node.uz === 'string' && node.uz && node.uz.slice(-1) !== ITK_UZ_NEW) node.uz += ITK_UZ_NEW;
    return;
  }
  Object.keys(node).forEach((k) => {
    if (parent && NOT_SPOKEN_IN[parent] && NOT_SPOKEN_IN[parent][k]) return;
    itkUzNew(node[k], on || !!SPOKEN[k], SPOKEN[k] ? k : parent);
  });
}
itkUzNew(C, false, null);

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:itk-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:itk.css@*/
`;
