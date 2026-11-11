// =============================================================================
// ПРОБНЫЙ ЭКРАН МОДУЛЯ «ИИ» (11.11.2026) — тестовый урок, не урок курса.
// Новый облик: «запрос → ответ ИИ → сайт в браузере» поверх рамки CoddyCamp (шапка, низ, Коди, панели).
// Сборка: node tools/aiprobe/build.mjs → lessons/test/32-ai-probnyy-ekran.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРОБА · модуль «ИИ», урок 1 «Что создаём и зачем?» — один экран =====
//
// ЗАМЫСЕЛ (план заказчика 11.11.2026: каждый урок добавляет в промпт новый кусок, в конце — готовый сайт).
// Коди просит ИИ расплывчато: «Futbol haqida sayt qil» — выходит скучная страница «ни о чём». Ученик дописывает
// промпт двумя полями: «Nima?» (продукт) и «Nega?» (цель) → «Yuborish» → ИИ отвечает, сайт в браузере меняется:
// название продукта, текст о цели, блок «о турнире» (если цель — рассказать), большая кнопка «Ro'yxatdan o'tish»
// (если цель — записать). Внизу — домашка: готовый промпт ученика, его можно скопировать в настоящий ИИ.
// Облик (заказчик, 11.11.2026: чат не подошёл → «промпт в редакторе»): тёмный редактор курса, вкладка prompt.txt —
// строки промпта с метками вопросов формулы (семь строк: в уроке 1 пишутся первые две, остальные — тусклые «N-dars»);
// вкладка index.html — код, который написал ИИ; рядом Chrome с сайтом.
//
// ИИ ЗДЕСЬ — СИМУЛЯТОР: честно собирает HTML и CSS из того, что есть в промпте (без сети, всегда одинаково).
// Ответ ИИ показывает код (свёрнут, раскрывается) — связь с HTML и CSS; страница — настоящая (движок урока 17 CSS).
// =============================================================================
const META = {
  lessonId: 'test-32-ai-probnyy-ekran',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: "Sinov: sun'iy intellekt bilan sayt",
    ru: 'Проба: сайт вместе с ИИ',
    en: 'Trial: a site with AI'
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
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  send: L3('Yuborish', 'Отправить', 'Send'),
  ai: L3("Sun'iy intellekt", 'ИИ', 'AI'),
  you: L3('Siz', 'Ты', 'You'),
  kodi: L3('Kodi', 'Коди', 'Kodi'),
  code: L3('HTML · CSS', 'HTML · CSS', 'HTML · CSS'),
  lines: L3('{n} qator', '{n} строк', '{n} lines'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  prompt: L3('Prompt', 'Промпт', 'Prompt'),
  hw: L3('Uyga vazifa', 'Домашнее задание', 'Homework'),
  copy: L3('Nusxalash', 'Копировать', 'Copy'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  finish: L3('Tugatish', 'Завершить', 'Finish'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};

// Формула модуля: семь вопросов промпта (урок 1 — первые два).
const FORMULA = [
  L3('Nima?', 'Что?', 'What?'), L3('Nega?', 'Зачем?', 'Why?'), L3('Kim uchun?', 'Для кого?', 'For whom?'),
  L3('Ichida nima?', 'Что внутри?', 'What’s inside?'), L3("Ko'rinishi?", 'Как выглядит?', 'How it looks?'),
  L3('Qanday ishlaydi?', 'Как ведёт себя?', 'How it behaves?'), L3('Qoidalar?', 'Какие правила?', 'What rules?')
];

const C = {
  p1: {
    eyebrow: L3("1-dars · Nima va nega?", 'Урок 1 · Что и зачем?', 'Lesson 1 · What and why?'),
    say: L3("Salom! Bugundan saytni sun'iy intellekt bilan yaratamiz. Men unga «Futbol haqida sayt qil» deb yozdim. Qarang, nima chiqdi: oddiy va zerikarli sahifa. Sun'iy intellekt bizga nima kerakligini bilmaydi-ku! Keling, unga ikki narsani aytamiz: nima yaratamiz va nega.",
      'Привет! С сегодняшнего дня делаем сайты вместе с ИИ. Я написал ему: «Сделай сайт про футбол». Смотри, что вышло: простая и скучная страница. ИИ ведь не знает, что нам нужно! Давай скажем ему две вещи: что мы создаём и зачем.',
      'Hi! From today we build sites together with AI. I wrote to it: “Make a site about football.” Look what came out: a plain, boring page. The AI doesn’t know what we need! Let’s tell it two things: what we’re making and why.'),
    vague: L3('Futbol haqida sayt qil.', 'Сделай сайт про футбол.', 'Make a site about football.'),
    aiVague: L3('Mana, futbol haqida sayt.', 'Вот сайт про футбол.', 'Here’s a site about football.'),
    aiOk: L3("Tayyor! Turnir sayti: nomi, turnir haqida ma'lumot va ro'yxatdan o'tish tugmasi.", 'Готово! Сайт турнира: название, рассказ о турнире и кнопка регистрации.', 'Done! A tournament site: the name, info about the tournament and a sign-up button.'),
    aiPart: L3("Tayyor! Saytni maqsadingizga qarab yasadim.", 'Готово! Сделал сайт под твою цель.', 'Done! I built the site around your goal.'),
    fields: {
      what: { label: L3('Nima?', 'Что?', 'What?'), ph: L3('Masalan: futbol turniri sayti', 'Например: сайт футбольного турнира', 'For example: a football tournament site') },
      why: { label: L3('Nega?', 'Зачем?', 'Why?'), ph: L3("Masalan: turnir haqida aytib, o'yinchilarni ro'yxatdan o'tishga undash", 'Например: рассказать о турнире и позвать игроков записаться', 'For example: tell about the tournament and get players to sign up') }
    },
    msgs: {
      what: L3("Oldin yozing: nima yaratamiz? Masalan, qanday sayt.", 'Сначала напиши: что создаём? Например, какой сайт.', 'First write what we’re making: for example, what kind of site.'),
      why: L3("Endi yozing: sayt nega kerak? U nima qilishi kerak?", 'Теперь напиши: зачем нужен сайт? Что он должен сделать?', 'Now write why the site is needed: what should it do?'),
      short: L3("Maqsad juda qisqa. Sayt mehmonga nima qilsin: nimani aytsin yoki nimaga undasin?", 'Цель слишком короткая. Что сайт должен сделать для гостя: что рассказать или к чему позвать?', 'The goal is too short. What should the site do for a visitor: tell them something or get them to do something?'),
      pretty: L3("«Chiroyli bo'lsin» bu maqsad emas, bu ko'rinish. Maqsad: sayt nima qilishi kerak?", '«Чтобы было красиво» — это не цель, а внешний вид. Цель: что сайт должен сделать?', '“Make it pretty” isn’t a goal, it’s a look. The goal: what should the site do?')
    },
    hints: [
      L3("Ikki savolga javob bering: nima yaratamiz va u nega kerak.", 'Ответь на два вопроса: что создаём и зачем это нужно.', 'Answer two questions: what we’re making and why it’s needed.'),
      L3("Nima: qanday sayt. Nega: sayt mehmonga nimani aytadi yoki uni nimaga undaydi.", 'Что: какой сайт. Зачем: что сайт расскажет гостю или к чему его позовёт.', 'What: which site. Why: what the site tells a visitor or gets them to do.'),
      L3("Maydonlardagi namunani o'z so'zlaringiz bilan yozing va Yuborishni bosing.", 'Напиши своими словами, как в примере в полях, и нажми «Отправить».', 'Write it in your own words like the example in the fields and tap Send.')
    ],
    ok: L3("Ajoyib! Qarang: endi sahifada turnir nomi, u haqida ma'lumot va katta ro'yxatdan o'tish tugmasi bor. Sun'iy intellekt maqsadni tushundi!", 'Отлично! Смотри: теперь на странице название турнира, рассказ о нём и большая кнопка регистрации. ИИ понял цель!', 'Great! Look: now the page has the tournament name, info about it and a big sign-up button. The AI understood the goal!'),
    gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
    hw: L3("Shu promptni haqiqiy sun'iy intellektga yuboring va o'z turniringiz saytini yarating.", 'Отправь этот промпт настоящему ИИ и сделай сайт своего турнира.', 'Send this prompt to a real AI and make a site for your own tournament.'),
    ask: L3("Promptga «Nima?» va «Nega?» ni yozing", 'Допиши в промпт «Что?» и «Зачем?»', 'Add “What?” and “Why?” to the prompt'),
    askOk: L3("Sun'iy intellekt maqsadni tushundi", 'ИИ понял цель', 'The AI understood the goal')
  }
};

/*@L2_HELPERS@*/

Object.assign(SPOKEN, { msgs: 1, hint1: 1, hint2: 1, hint3: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../css17/c17-engine.jsx@*/

/*@FILE:a0-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:a0.css@*/
`;
