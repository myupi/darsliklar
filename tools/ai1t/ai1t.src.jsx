// =============================================================================
// МОДУЛЬ «ИИ» · Тест к уроку 1 «Что создаём и зачем?» (13.11.2026; вместо практики — тест, заказчик).
// 5 экранов: 5 вопросов подряд, без вступления и без итога; оценка — платформе. Подсказок нет, одна попытка на вопрос.
// Сборка: node tools/ai1t/build.mjs → lessons/ai/01t-chto-i-zachem.jsx. Набор тестов — tools/aitest/.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ТЕСТ К УРОКУ 1 · «Что создаём и зачем?» · модуль ai-m1-sayt =====
//
// ЧТО ПРОВЕРЯЕМ (урок 1): «Nima?» — конкретная вещь, а не тема или «zo'r narsa»; «Nega?» — цель сайта (yozilsin,
// buyurtma qilsin, qo'ng'iroq qilsin, kelsin, bilsin), а не «chiroyli bo'lsin»; цель видна на сайте (кнопка и раздел);
// строки берутся из сообщения клиента.
//   q1 выбор: какой «Nima?» точнее · q2 сайт: какой «Nega?» дал этот сайт · q3 ошибка: строка, из-за которой ИИ
//   гадает · q4 клиент: отметить две верные строки · q5 сам: написать «Nega?» для заказа тортов.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-01t-chto-i-zachem',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '1-dars testi. Nima yaratamiz va nega?',
    ru: 'Тест к уроку 1. Что создаём и зачем?',
    en: 'Lesson 1 test. What are we making and why?'
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
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  kodi: L3('Kodi', 'Коди', 'Kodi'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say (вопрос), why (почему — после ответа); печатаются: ask, варианты, строки.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  q1: {
    say: L3("Birinchi savol. Qaysi «Nima?» qatori sun'iy intellektga aniqroq?", 'Первый вопрос. Какая строка «Что?» точнее для ИИ?', 'First question. Which “What?” line is clearer for the AI?'),
    ask: L3("Qaysi «Nima?» qatori aniqroq?", 'Какая строка «Что?» точнее?', 'Which “What?” line is clearer?'),
    opts: [{ v: 'a', t: L3('Sayt', 'Сайт', 'A site') }, { v: 'b', t: L3('Futbol turniri sayti', 'Сайт футбольного турнира', 'A football tournament site') }, { v: 'c', t: L3("Zo'r narsa", 'Что-нибудь крутое', 'Something cool') }],
    why: L3("«Futbol turniri sayti» aniq narsani aytadi: qanday sayt kerakligini.", '«Сайт футбольного турнира» называет конкретную вещь: какой нужен сайт.', '“A football tournament site” names a real thing: exactly what site is needed.')
  },
  q2: {
    say: L3("Ikkinchi savol. Saytga qarang: qaysi «Nega?» qatori shunday saytni berdi?", 'Второй вопрос. Посмотри на сайт: какая строка «Зачем?» дала такой сайт?', 'Second question. Look at the site: which “Why?” line gave this site?'),
    ask: L3("Qaysi «Nega?» shu saytni berdi?", 'Какое «Зачем?» дало этот сайт?', 'Which “Why?” gave this site?'),
    what: L3('Shaxmat turniri sayti', 'Шахматный турнир', 'Chess tournament'),
    whyLine: L3("o'yinchilar turnirga yozilsin", 'чтобы игроки записывались на турнир', 'get players to sign up for the tournament'),
    opts: [{ v: 'a', t: L3("odamlar turnir qachon va qayerdaligini bilsin", 'чтобы люди узнали, когда и где турнир', 'people learn when and where the tournament is') },
      { v: 'b', t: L3("o'yinchilar turnirga yozilsin", 'чтобы игроки записывались на турнир', 'get players to sign up for the tournament') },
      { v: 'c', t: L3("odamlar bizga qo'ng'iroq qilsin", 'чтобы люди нам звонили', 'get people to call us') }],
    why: L3("Saytda ro'yxatdan o'tish tugmasi va formasi bor: maqsad yozilish.", 'На сайте кнопка и форма записи: цель — запись.', 'The site has a sign-up button and form: the goal is sign-ups.')
  },
  q3: {
    say: L3("Uchinchi savol. Bu promptda bir qator sun'iy intellektga hech narsa demaydi. Qaysi biri? Qatorni bosing.", 'Третий вопрос. В этом промпте одна строка ничего не говорит ИИ. Какая? Нажми её.', 'Third question. One line in this prompt tells the AI nothing. Which one? Tap it.'),
    ask: L3("Qaysi qator hech narsa demaydi? Bosing", 'Какая строка ничего не говорит? Нажми', 'Which line says nothing? Tap it'),
    rows: [{ qi: 0, t: L3('Pitsa kafesi sayti', 'Пиццерия', 'Pizza cafe') }, { qi: 1, t: L3("chiroyli bo'lsin", 'чтобы было красиво', 'make it pretty') }],
    why: L3("«Chiroyli bo'lsin» maqsad emas: sayt nima qilishi kerakligini aytmaydi. Shuning uchun saytda buyurtma tugmasi yo'q.", '«Чтобы было красиво» — не цель: не сказано, что должен сделать сайт. Поэтому кнопки заказа нет.', '“Make it pretty” isn’t a goal: it doesn’t say what the site should do. That’s why there’s no order button.')
  },
  q4: {
    say: L3("To'rtinchi savol. Mijozning xabarini o'qing va unga mos ikkita qatorni belgilang.", 'Четвёртый вопрос. Прочитай сообщение клиента и отметь две строки, которые ему подходят.', 'Fourth question. Read the client’s message and tick the two lines that fit it.'),
    ask: L3('Mos ikkita qatorni belgilang', 'Отметь две подходящие строки', 'Tick the two lines that fit'),
    card: { h: L3('Mijoz', 'Клиент', 'Client'), t: L3("«Maktabimizda shaxmat to'garagi ochildi. Bolalar to'garakka yozilishini xohlaymiz.»", '«В нашей школе открылся шахматный кружок. Хотим, чтобы дети в него записывались».', '“Our school has opened a chess club. We want kids to sign up for it.”') },
    opts: [{ v: 'a', qi: 0, t: L3("Shaxmat to'garagi sayti", 'Сайт шахматного кружка', 'A chess club site') }, { v: 'b', qi: 1, t: L3("odamlar bizga qo'ng'iroq qilsin", 'чтобы люди нам звонили', 'get people to call us') },
      { v: 'c', qi: 0, t: L3('Pitsa kafesi sayti', 'Сайт пиццерии', 'A pizza cafe site') }, { v: 'd', qi: 1, t: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') }],
    why: L3("Mijoz shaxmat to'garagi haqida yozdi va bolalar yozilishini xohlaydi.", 'Клиент пишет про шахматный кружок и хочет, чтобы дети записывались.', 'The client writes about a chess club and wants kids to sign up.')
  },
  q5: {
    say: L3("Oxirgi savol. Novvoyxona odamlar tort buyurtma qilishini xohlaydi. «Nega?» qatorini o'zingiz yozing va yuboring.", 'Последний вопрос. Пекарня хочет, чтобы люди заказывали торты. Напиши строку «Зачем?» сам и отправь.', 'Last question. A bakery wants people to order cakes. Write the “Why?” line yourself and send it.'),
    ask: L3("«Nega?» qatorini yozing", 'Напиши строку «Зачем?»', 'Write the “Why?” line'),
    card: { h: L3('Mijoz', 'Клиент', 'Client'), t: L3("«Bizning novvoyxonamizga odamlar tort buyurtma qilsin.»", '«Пусть люди заказывают торты в нашей пекарне».', '“We want people to order cakes from our bakery.”') },
    what: L3('Novvoyxona sayti', 'Пекарня', 'Bakery'),
    ph: L3('sayt nima qilsin?', 'что должен сделать сайт?', 'what should the site do?'),
    why: L3("Maqsad: buyurtma qilish. Shunda saytda buyurtma tugmasi va bo'limi paydo bo'ladi.", 'Цель — заказ. Тогда на сайте появляются кнопка и раздел заказа.', 'The goal is ordering. Then the site gets an order button and section.')
  }
};
/*@L2_HELPERS@*/

Object.assign(SPOKEN, { why: 1 });
Object.assign(NOT_SPOKEN_IN, { opts: 1, rows: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:../aitest/test-kit.jsx@*/

/*@FILE:ai1t-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:../aitest/test.css@*/
`;
