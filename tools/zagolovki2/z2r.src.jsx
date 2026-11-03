// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 2 — «Заголовки и текст»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/zagolovki2/build.mjs → lessons/html/02-zagolovki-i-tekst.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Заголовки и текст» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Облик — эталона «Редактор» (tools/redaktor28/nabor.mjs: код в тёмном
// редакторе, Chrome, шапка и низ CoddyCamp, переход-глитч); бумаги нет нигде (заказчик, 03.11.2026:
// «напрочь убери все бумажные стили»). Основа экранов — прежний урок 2 (тестовый 20), переписанная
// без бумаги в z2r-screens.jsx; весь CSS урока — z2r.css. Друг сделал страницу о своём коте, но все
// слова слиплись в кашу. Ученик учит теги, которые делают текст читаемым, и собирает свою страницу.
// Загадка (промт озвучки CoddyCamp, hikoya.md): Коди сам ставит на главный заголовок h6 («шесть
// больше — значит, крупнее») и спрашивает, прав ли он. Имён персонажей нет (заказчик, 03.11.2026).
// Разгадка — в выводе: Коди признаёт ошибку.
//
// ДУГА (17 экранов; экрана плана нет — как в уроке 1). Типы заданий — по разделу 3а навыка
// /novyy-urok (заказчик, 03.11.2026), в соседних тройках не повторяются:
//   s1 крючок (каша → страница, загадка)
//   заголовки:  s3 показ h1–h6 · s4 вписать </h1> (Fill in the Blanks) · s5 h1/h2 по местам (Drag & Drop)
//   абзац:      s6 показ p · s7 собрать абзац из кусков (Code Builder) · s8 слово в коде ↔ абзац (Visual Code Mapping)
//   b и i:      s9 показ · s10 вписать <b></b> (Fill in the Blanks) · s11 до и после (Before / After)
//   страница:   s12 показ «сверху вниз» · s13, s13b свой заголовок и абзац (Live Code Preview) · s14 вставить </b> (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь.
//   · Честный браузер: заголовки убывают от h1 к h6; переносы строк в коде склеиваются
//     в пробел; каждый p — отдельный абзац; незакрытый h1 делает огромным всё, что после
//     него; незакрытый b делает жирным весь текст дальше (так и в настоящем браузере).
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ' (строки — в двойных кавычках),
//     связный рассказ (hikoya.md), термин впервые — через «ya'ni».
//
// СИСТЕМА СЛОВ. Заголовок (sarlavha) — h1…h6, h1 главный и самый крупный, обычно один —
// asosiy sarlavha (не «название»: название страницы — title, урок 1); h2 — заголовок
// раздела (bo'lim sarlavhasi). Абзац (abzas; заказчик, 03.11.2026: «xatboshi непонятно, проще») — p. b — жирный (qalin), i — курсив
// (qiya). Как в уроке 1: teg, oyna — окно, sahifa nomi — название.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-02-zagolovki-i-tekst',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '2-dars. Sarlavhalar va matn',
    ru: 'Урок 2. Заголовки и текст',
    en: 'Lesson 2. Headings and text'
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
  inspector: L3("Qoida", 'Правило', 'Rule'),
  check: L3("Tekshirish", 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3("Vazifa", 'Задание', 'Task'),
  save: L3("Saqlash", 'Сохранить', 'Save'),
  saved: L3("Saqlandi", 'Сохранено', 'Saved'),
  author: L3("Muallif", 'Автор', 'Author'),
  code: L3("Kod", 'Код', 'Code'),
  result: L3("Natija", 'Результат', 'Result'),
  nextLesson: L3("Keyingi dars", 'Следующий урок', 'Next lesson'),
  next: L3("Ro'yxatlar", 'Списки', 'Lists'),
  turn: L3("Aylantirish", 'Превратить', 'Transform'),
  ready: L3("Tayyor", 'Готово', 'Done'),
  tab: L3("Yorliq", 'Вкладка', 'Tab'),
  win: L3("Oyna", 'Окно', 'Window'),
  mySite: L3("Mening saytim", 'Мой сайт', 'My site'),
  hello: L3("Salom, dunyo!", 'Привет, мир!', 'Hello, world!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3("Yordam", 'Подсказка', 'Hint'),
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  finish: L3("Darsni tugatish", 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА ГЕРОЯ О КОТЕ — сквозной пример урока. Строка абзаца — части:
// строка или { b } / { i } (слово в теге).
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  title: L3("Mening mushugim", 'Мой кот', 'My cat'),
  p1: L3(['Mushugim ', { b: 'juda' }, ' ', { i: 'uxlashni' }, " yaxshi ko'radi."],
    ['Мой кот ', { b: 'очень' }, ' любит ', { i: 'спать' }, '.'],
    ['My cat ', { b: 'really' }, ' loves to ', { i: 'sleep' }, '.']),
  h2: L3("U nima yeydi", 'Что он ест', 'What he eats'),
  p2: L3(["Baliq va sutni yaxshi ko'radi."], ['Он любит рыбу и молоко.'], ['He loves fish and milk.'])
};

// Обёртка слова или строки в тег, набранная в два поля (s7, s10): что не так.
const WRAP_MSGS = {
  needOpen: L3("Matndan oldin ochuvchi {tag} tegi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  openSlash: L3("Bu yopuvchi teg. Matndan oldin qiya chiziqsiz ochuvchi teg turadi.", 'Это закрывающий тег. Перед текстом ставят открывающий, без косой черты.', 'That’s a closing tag. Before the text goes the opening tag, without a slash.'),
  needClose: L3("Matndan keyin yopuvchi {tag} tegi kerak.", 'После текста нужен закрывающий тег {tag}.', 'After the text you need the closing {tag} tag.'),
  needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda {tag} yozuvidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needLt: L3("Teg chap «<» qavs bilan boshlanadi.", 'Тег начинается с уголка «<».', 'A tag starts with the bracket “<”.'),
  needGt: L3("Teg oxirida o'ng «>» qavs turadi.", 'В конце тега нужен уголок «>».', 'A tag ends with the bracket “>”.'),
  wrongName: L3("Teg ichida {tag} bo'lishi kerak.", 'Внутри тега должно быть {tag}.', 'The tag should say {tag}.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card.
// Реплики сцеплены в одну историю (hikoya.md): начало экрана опирается на прошлый,
// конец ведёт к следующему; термин впервые — через «ya'ni».
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Chalkash matn", 'Каша из текста', 'A wall of text'),
    say: L3("Yana salom! O'tgan darsda sahifaning tuzilishini yig'dik. Bugun do'stimiz mushugi haqida sahifa yozdi. Lekin qarang: hamma so'zlar bir-biriga yopishib qolgan. Qayerda sarlavha, qayerda hikoya, tushunib bo'lmaydi. Keling, buni tuzatamiz. «Aylantirish» tugmasini bosing.",
      'Привет снова! На прошлом уроке мы собрали каркас страницы. А сегодня наш друг написал страницу про своего кота. Но смотри: все слова слиплись в кашу. Где заголовок, где рассказ — не понять. Давай это исправим. Нажми «Превратить».',
      'Hi again! Last time we built the frame of a page. Today our friend wrote a page about his cat. But look: all the words are stuck together. You can’t tell the heading from the story. Let’s fix it. Tap “Transform”.'),
    magic: L3("Voy, qarang! Tepada katta sarlavha paydo bo'ldi.", 'Ого! Наверху появился крупный заголовок.', 'Whoa! A big heading appeared at the top.'),
    magicP: L3("Matn abzaslarga bo'lindi.", 'Текст разделился на абзацы.', 'The text split into paragraphs.'),
    magicB: L3("Muhim so'z esa qalin bo'ldi.", 'А важное слово стало жирным.', 'And the important word turned bold.'),
    done: L3("Bugun matnni shunday bezashni o'rganasiz va o'z sahifangizni yasaysiz. Lekin oldin kichik topishmoq. Men ham sahifa yasadim va asosiy sarlavhaga h6 tegini qo'ydim. Olti katta son-ku, demak, sarlavha ham juda katta chiqadi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься так оформлять текст и сделаешь свою страницу. Но сначала маленькая загадка. Я тоже сделал страницу и поставил на главный заголовок тег h6. Шесть — большое число, значит, и заголовок выйдет огромным. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to shape text like this and make your own page. But first, a little riddle. I made a page too, and I put the h6 tag on the main heading. Six is a big number, so the heading will be huge. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3("«Aylantirish» tugmasini bosing", 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Sarlavha, abzaslar va qalin so'z", 'Заголовок, абзацы и жирное слово', 'A heading, paragraphs and a bold word')
  },
  s3: {
    eyebrow: L3("Sarlavhalar", 'Заголовки', 'Headings'),
    say: L3("Keling, sarlavhalardan boshlaymiz. Sarlavha uchun oltita teg bor: h1 tegidan h6 tegigacha. h harfi inglizcha heading so'zidan olingan, ya'ni sarlavha degani.",
      'Начнём с заголовков. Тегов заголовков шесть: от h1 до h6. Буква h — от английского слова heading, то есть заголовок.',
      'Let’s start with headings. There are six heading tags: from h1 to h6. The letter h comes from the word heading.'),
    askBig: L3("Qarang: eng katta sarlavha", 'Смотри: самый крупный заголовок', 'Watch: the biggest heading'),
    big: L3("Bu h1. U eng muhim va eng katta sarlavha bo'ladi, ya'ni butun sahifaning asosiy sarlavhasi degani. Odatda sahifada h1 bitta bo'ladi.",
      'Это h1 — самый главный и самый крупный заголовок, то есть главный заголовок всей страницы. Обычно он на странице один.',
      'This is h1, the most important and biggest heading: the main heading of the whole page. A page usually has just one.'),
    askSmall: L3("Qarang: eng kichik sarlavha", 'Смотри: самый мелкий заголовок', 'Watch: the smallest heading'),
    small: L3("Bu h6, u eng kichik sarlavha bo'ladi. Diqqat qiling: raqam qancha katta bo'lsa, sarlavha shuncha kichik bo'ladi. Raqam sarlavhaning o'lchamini emas, darajasini bildiradi.",
      'Это h6 — самый маленький. Внимание: чем больше цифра, тем мельче заголовок. Цифра говорит не о размере, а о том, насколько заголовок главный.',
      'This is h6, the smallest. Note: the bigger the number, the smaller the heading. The number shows how important the heading is, not its size.'),
    done: L3("Nega bu kerak? Gazetani bir eslab ko'ring: katta sarlavhani darrov ko'rasiz, kichigini keyin o'qiysiz. Brauzer ham sarlavhalarni katta va qalin qilib ko'rsatadi. Bu tasmalarni esa yaqqol ko'rinishi uchun yasadik.",
      'Зачем это нужно? Вспомни газету: крупный заголовок видишь сразу, мелкий читаешь потом. Браузер тоже показывает заголовки крупно и жирно. А эти полоски мы сделали для наглядности.',
      'Why do we need this? Think of a newspaper: you see the big heading at once and read the small ones later. The browser also shows headings big and bold. We made these strips to help you see it.'),
    ask: L3("Sarlavhalarga qarang", 'Смотри на заголовки', 'Watch the headings'),
    word: L3("Sarlavha", 'Заголовок', 'Heading')
  },
  s4: {
    eyebrow: L3("Sarlavhani yoping", 'Закрой заголовок', 'Close the heading'),
    say: L3("Endi navbat sizga. Voy, butun matn ulkan bo'lib ketdi! h1 ochilgan, lekin yopilmagan. Shuning uchun brauzer sarlavha hali davom etyapti, deb o'ylaydi. Bo'sh joyga yopuvchi h1 tegini yozing.",
      'Теперь твоя очередь. Ой, весь текст стал огромным! h1 открыт, но не закрыт. Поэтому браузер думает, что заголовок ещё продолжается. Допиши в пустое место закрывающий тег h1.',
      'Now it’s your turn. Oops, all the text turned huge! h1 is opened but not closed. So the browser thinks the heading still goes on. Type the closing h1 tag in the empty spot.'),
    msgs: {
      needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda h1 yozuvidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед h1 стоит косая черта «/».', 'That’s the opening tag. The closing one has a slash “/” before h1.'),
      needLt: L3("Teg chap «<» qavs bilan boshlanadi. Uni boshiga qo'shing.", 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      needGt: L3("Teg oxirida o'ng «>» qavs turadi. Uni oxiriga qo'shing.", 'В конце тега нужен уголок «>». Добавь его в конец.', 'A tag ends with the bracket “>”. Add it at the end.'),
      wrongName: L3("Teg ichida boshqa so'z yozilgan. Bu yerda h1 kerak.", 'Внутри тега другое слово. Здесь нужен h1.', 'There’s a different word inside the tag. Here you need h1.'),
      generic: L3("Qiya chiziq «/» birinchi burchakli qavsdan keyin darrov turadi.", 'Косая черта «/» стоит сразу после первого уголка.', 'The slash “/” goes right after the first bracket.')
    },
    hints: [
      L3("Sarlavha qayerda tugashi kerak? Uning ochuvchi tegiga qarang.", 'Где должен закончиться заголовок? Посмотри на его открывающий тег.', 'Where should the heading end? Look at its opening tag.'),
      L3("Yopuvchi teg ham o'sha so'z bo'ladi, faqat qiya chiziq bilan yoziladi.", 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3("Oldin burchakli qavs, keyin qiya chiziq qo'ying. Undan keyin h1 yozing, oxirida esa yana burchakli qavs qo'ying.", 'Сначала уголок, потом косая черта. Дальше h1 и в конце снова уголок.', 'First a bracket, then the slash. Then h1, and another bracket at the end.')
    ],
    ok: L3("Zo'r! Sarlavha yopildi, matn yana oddiy bo'ldi. Chunki endi brauzer sarlavha qayerda tugashini biladi.", 'Есть! Заголовок закрыт, текст снова обычный. Ведь теперь браузер знает, где кончается заголовок.', 'Yes! The heading is closed and the text is normal again, because now the browser knows where the heading ends.'),
    ask: L3("Bo'sh joyga yopuvchi h1 tegini yozing", 'Допиши закрывающий тег h1 в пустое место', 'Type the closing h1 tag in the empty spot')
  },
  s5: {
    eyebrow: L3("Qaysi sarlavha?", 'Какой заголовок?', 'Which heading?'),
    say: L3("Demak, h1 bitta va eng katta bo'ladi. Butun sahifaning asosiy sarlavhasi uchun h1 kerak, bo'lim sarlavhalari uchun esa h2 kerak. Teglarni o'z joyiga olib boring, bittasi ortiqcha.",
      'Значит, h1 один и самый крупный. Главный заголовок страницы — это h1, заголовки разделов — h2. Перетащи теги на места, один тег лишний.',
      'So, h1 is the one and the biggest. The main heading of the page is h1, and section headings are h2. Drag the tags into place; one tag is extra.'),
    why: {
      h1sec: L3("h1 sahifada bitta bo'ladi, u asosiy sarlavha hisoblanadi. Bo'lim uchun esa h2 kerak.", 'h1 на странице один — это главный заголовок. Для раздела нужен h2.', 'A page has one h1: the main heading. A section needs h2.'),
      h2title: L3("Bu butun sahifaning asosiy sarlavhasi, unga h1 kerak.", 'Это главный заголовок всей страницы, ему нужен h1.', 'This is the main heading of the whole page: it needs h1.'),
      h6: L3("h6 eng kichik sarlavha bo'ladi. Bu yerga boshqa teg kerak.", 'h6 — самый мелкий. Здесь нужен другой тег.', 'h6 is the smallest. A different tag goes here.')
    },
    hints: [
      L3("Qaysi qator butun sahifaning asosiy sarlavhasi?", 'Какая строка — главный заголовок всей страницы?', 'Which line is the main heading of the whole page?'),
      L3("Asosiy sarlavha tepada turadi. Qolgan ikkitasi esa bo'lim sarlavhalari bo'ladi.", 'Главный заголовок стоит сверху. Остальные две строки — разделы.', 'The main heading is at the top. The other two lines are sections.'),
      L3("h1 tegini tepadagi qatorga, ikkala h2 tegini pastdagi qatorlarga qo'ying.", 'h1 — на верхнюю строку, оба h2 — на две нижние.', 'Put h1 on the top line and both h2 tags on the two lines below.')
    ],
    ok: L3("Barakalla! Asosiy sarlavha katta, bo'limlar kichikroq bo'ladi. Shuning uchun sahifani o'qish oson.", 'Верно! Главный заголовок крупно, разделы помельче — поэтому страницу легко читать.', 'Right! The main heading is big and the sections smaller, so the page is easy to read.'),
    ask: L3("Tegni sarlavhaga olib boring", 'Перетащи тег на заголовок', 'Drag a tag onto a heading'),
    askPlace: L3("Endi qatorni bosing", 'Теперь нажми строку', 'Now tap a line'),
    pickFirst: L3("Oldin tegni bosing.", 'Сначала нажми тег.', 'Tap a tag first.'),
    lines: [L3("Mening mushugim", 'Мой кот', 'My cat'), L3("U nima yeydi", 'Что он ест', 'What he eats'), L3("U qanday o'ynaydi", 'Как он играет', 'How he plays')]
  },
  s6: {
    eyebrow: L3("Abzas", 'Абзац', 'Paragraph'),
    say: L3("Sarlavhalar tayyor bo'ldi, endi matnning o'ziga o'tamiz. Qarang: kodda uchta qator bor, lekin brauzer ularni bitta qatorga yopishtirdi. Chunki koddagi qator ko'chishini brauzer ko'rmaydi.",
      'Заголовки готовы, теперь сам текст. Смотри: в коде три строки, а браузер склеил их в одну. Потому что переносы строк в коде браузер не видит.',
      'The headings are done; now the text itself. Look: the code has three lines, but the browser glued them into one, because the browser doesn’t see line breaks in code.'),
    sayP: L3("Matn abzas bo'lishi uchun uni p tegiga o'raymiz. p inglizcha paragraph so'zidan olingan, ya'ni abzas degani. Qarang.",
      'Чтобы текст стал абзацем, его оборачивают в тег p. Буква p — от английского paragraph, то есть абзац. Смотри.',
      'To make text a paragraph, we wrap it in the p tag. p comes from the word paragraph. Watch.'),
    done: L3("Har bir p alohida abzas bo'ladi. Abzaslar o'rtasida brauzer o'zi bo'sh joy qoldiradi. Eslab qoling: kodda yangi qatorga o'tish hali yangi abzas boshlandi degani emas, abzasni faqat p qila oladi.",
      'Каждый p — отдельный абзац. Между абзацами браузер сам делает отступ. Запомни: новая строка в коде — ещё не новый абзац, абзац делает только p.',
      'Each p is a separate paragraph. The browser adds space between paragraphs by itself. Remember: a new line in the code isn’t a new paragraph; only p makes one.'),
    ask: L3("Qarang: qatorlar abzaslarga aylanadi", 'Смотри: строки становятся абзацами', 'Watch: the lines become paragraphs'),
    lines: [L3("Mushugim kun bo'yi uxlaydi.", 'Мой кот спит весь день.', 'My cat sleeps all day.'),
      L3("Kechqurun u o'ynaydi.", 'Вечером он играет.', 'In the evening he plays.'),
      L3("Baliqni yaxshi ko'radi.", 'Он любит рыбу.', 'He loves fish.')]
  },
  s7: {
    eyebrow: L3("Abzasni yig'ing", 'Собери абзац', 'Build a paragraph'),
    say: L3("Endi o'zingiz yig'ib ko'ring. Pastki qator hali abzas emas: brauzer uni oldingi gapga yopishtirib qo'ydi. Abzas uch bo'lakdan iborat: ochuvchi p tegi, matn va yopuvchi p tegi. Bo'laklarni to'g'ri tartibda bo'sh qatorlarga qo'ying.",
      'Теперь собери сам. Нижняя строка ещё не абзац: браузер приклеил её к прошлой фразе. Абзац — это три куска: открывающий тег p, текст и закрывающий тег p. Поставь куски по порядку в пустые строки.',
      'Now build it yourself. The bottom line isn’t a paragraph yet: the browser glued it to the sentence before. A paragraph has three pieces: the opening p tag, the text and the closing p tag. Put the pieces in order into the empty lines.'),
    why: {
      closeFirst: L3("Bu yopuvchi teg, unda qiya chiziq bor. U matndan keyin turadi. Oldin ochuvchi p kerak.", 'Это закрывающий тег, в нём косая черта. Он стоит после текста. Сначала нужен открывающий p.', 'That’s the closing tag: it has a slash. It goes after the text. First you need the opening p.'),
      textFirst: L3("Matndan oldin ochuvchi p tegi turadi. Shunda brauzer abzas qayerdan boshlanishini biladi.", 'Перед текстом стоит открывающий тег p. Так браузер знает, где начинается абзац.', 'The opening p tag goes before the text. That’s how the browser knows where the paragraph starts.'),
      closeEarly: L3("Hali erta. Oldin abzas ichiga matn kiradi, yopuvchi teg esa undan keyin keladi.", 'Рано. Сначала внутрь абзаца идёт текст, а закрывающий тег — после него.', 'Too early. The text goes inside the paragraph first, and the closing tag comes after it.')
    },
    hints: [
      L3("Abzas nima bilan boshlanadi?", 'С чего начинается абзац?', 'What does a paragraph start with?'),
      L3("Birinchi qatorga qiya chiziqsiz teg qo'yiladi.", 'В первую строку ставят тег без косой черты.', 'The first line gets the tag without a slash.'),
      L3("Tartib shunday bo'ladi: ochuvchi p, keyin matn, oxirida esa yopuvchi p.", 'Порядок такой: открывающий p, потом текст, в конце закрывающий p.', 'The order: the opening p, then the text, and the closing p at the end.')
    ],
    ok: L3("Ajoyib! Qarang, brauzerda yangi abzas paydo bo'ldi. Chunki matn endi p ichida turibdi.", 'Огонь! Смотри, в браузере появился новый абзац. Ведь текст теперь внутри p.', 'Awesome! Look, a new paragraph appeared in the browser, because the text is inside p now.'),
    ask: L3("Bo'laklarni tartib bilan bo'sh qatorlarga qo'ying", 'Поставь куски по порядку в пустые строки', 'Put the pieces in order into the empty lines'),
    prev: L3("Mushugim kun bo'yi uxlaydi.", 'Мой кот спит весь день.', 'My cat sleeps all day.'),
    text: L3("Kechqurun u to'p o'ynaydi.", 'Вечером он играет с мячом.', 'In the evening he plays with a ball.')
  },
  s8: {
    eyebrow: L3("Kod va sahifa", 'Код и страница', 'Code and page'),
    say: L3("Endi kodni sahifa bilan solishtiramiz. Kodda bitta so'z yonib turadi. Brauzer uni qaysi abzasga qo'ydi? Eslab qoling: abzasni qator emas, p tegi yasaydi.",
      'Теперь сравним код со страницей. В коде горит одно слово. В какой абзац браузер его поставил? Запомни: абзац делает не строка, а тег p.',
      'Now let’s match the code with the page. One word in the code is glowing. Which paragraph did the browser put it in? Remember: a paragraph comes from the p tag, not from a line.'),
    askQ: L3("Yonib turgan so'z qaysi abzasda? Uni sahifada bosing", 'В каком абзаце горящее слово? Нажми его на странице', 'Which paragraph has the glowing word? Tap it on the page'),
    ok: L3("To'ppa-to'g'ri! Siz kodni xuddi brauzer kabi o'qiyapsiz.", 'В точку! Ты читаешь код прямо как браузер.', 'Spot on! You read code just like a browser.'),
    miss: {
      one: L3("Qarang: bu so'z yuqorida ochilgan p ichida turibdi. p ikki qatorda yozilgan, lekin abzas bitta bo'ladi.", 'Смотри: это слово внутри p, который открыт строкой выше. p записан в двух строках, но абзац один.', 'Look: this word is inside the p opened on the line above. The p takes two lines, but it’s one paragraph.'),
      many: L3("Qarang: bitta qatorda ikkita p bor. Demak, sahifada ular ikkita alohida abzas bo'ladi.", 'Смотри: в одной строке два p. Значит, на странице это два отдельных абзаца.', 'Look: one line has two p tags. So on the page they are two separate paragraphs.')
    },
    done: L3("Demak, koddagi qatorlar emas, p teglari hal qiladi. Endi muhim so'zlarni ajratishni o'rganamiz.", 'Значит, важны не строки в коде, а теги p. Теперь научимся выделять важные слова.', 'So what matters is the p tags, not the lines in the code. Next, let’s learn to make words stand out.')
  },
  s9: {
    eyebrow: L3("Qalin va qiya", 'Жирный и курсив', 'Bold and italic'),
    say: L3("Abzas ichida ham bir so'zni ajratib ko'rsatish mumkin. Buning uchun yana ikkita teg bor.", 'Внутри абзаца тоже можно выделить слово. Для этого есть ещё два тега.', 'You can make a word stand out inside a paragraph too. There are two more tags for that.'),
    askB: L3("Qarang: b tegi", 'Смотри: тег b', 'Watch: the b tag'),
    b: L3("b tegi so'zni qalin qiladi. b inglizcha bold so'zidan olingan, ya'ni qalin degani. Shunda muhim so'z darrov ko'zga tashlanadi.", 'Тег b делает слово жирным. b — от английского bold, то есть жирный. Так важное слово сразу заметно.', 'The b tag makes a word bold: b comes from bold. That way the important word catches the eye.'),
    askI: L3("Qarang: i tegi", 'Смотри: тег i', 'Watch: the i tag'),
    i: L3("i tegi esa so'zni qiya qiladi. i inglizcha italic so'zidan olingan, ya'ni qiya yozuv degani.", 'А тег i наклоняет слово. i — от английского italic, то есть курсив.', 'And the i tag slants the word: i comes from italic.'),
    done: L3("b va i so'z atrofiga qo'yiladi: so'zdan oldin ochuvchi teg, so'zdan keyin esa yopuvchi teg turadi. Yopuvchi tegni unutsangiz, keyingi hamma matn ham qalin bo'lib ketadi.", 'b и i ставят вокруг слова: открывающий тег перед ним, закрывающий после. Забудешь закрывающий — жирным станет и весь текст дальше.', 'b and i go around a word: the opening tag before it, the closing tag after. Forget the closing one, and all the text after it turns bold too.'),
    ask: L3("b va i teglariga qarang", 'Смотри на теги b и i', 'Watch the b and i tags')
  },
  s10: {
    eyebrow: L3("So'zni ajrating", 'Выдели слово', 'Make a word stand out'),
    say: L3("Keling, sinab ko'ramiz. Bu so'zni qalin qiling: so'zdan oldin ochuvchi b tegini, keyin yopuvchi b tegini yozing.", 'Давай попробуем. Сделай это слово жирным: перед словом напиши открывающий тег b, после — закрывающий.', 'Let’s try. Make this word bold: type the opening b tag before the word and the closing one after it.'),
    hints: [
      L3("So'zni qalin qiladigan teg qaysi?", 'Какой тег делает слово жирным?', 'Which tag makes a word bold?'),
      L3("Bu b tegi bo'ladi. Uning yopuvchisida qiya chiziq bor.", 'Это тег b. В закрывающем есть косая черта.', 'It’s the b tag. The closing one has a slash.'),
      L3("So'zdan oldingi joyga ochuvchi b, keyingi joyga yopuvchi b yozing.", 'В место перед словом — открывающий b, после слова — закрывающий b.', 'Type the opening b before the word and the closing b after it.')
    ],
    ok: L3("Qoyil! So'z qalin bo'ldi, qolgan matn esa oddiy qoldi.", 'Есть! Слово стало жирным, а остальной текст остался обычным.', 'Yes! The word is bold, and the rest of the text stayed normal.'),
    ask: L3("«{w}» so'zini qalin qiling", 'Сделай слово «{w}» жирным', 'Make the word “{w}” bold'),
    parts: L3(['U ', 'baliqni', " yaxshi ko'radi."], ['Он любит ', 'рыбу', '.'], ['He loves ', 'fish', '.'])
  },
  s11: {
    eyebrow: L3("Oldin va keyin", 'До и после', 'Before and after'),
    say: L3("Endi ikkita qatorga qarang: oldin va keyin. Bitta so'z o'zgardi. Xo'sh, buni qaysi teg qildi?",
      'Теперь посмотри на две строчки: до и после. Одно слово изменилось. Ну и какой тег это сделал?',
      'Now look at two lines: before and after. One word changed. So which tag did that?'),
    askQ: L3("Qaysi teg buni qildi: b yoki i?", 'Какой тег это сделал: b или i?', 'Which tag did it: b or i?'),
    ok: {
      b: L3("To'g'ri! b so'zni qalin qiladi.", 'Верно! b делает слово жирным.', 'Right! b makes the word bold.'),
      i: L3("To'g'ri! i so'zni qiya qiladi.", 'Верно! i делает слово наклонным.', 'Right! i makes the word slanted.')
    },
    miss: {
      b: L3("Qarang: keyin so'z qalin bo'ldi. Qalin qiladigan teg esa b bo'ladi.", 'Смотри: после слово стало жирным. Жирным делает тег b.', 'Look: after, the word is bold. The b tag makes it bold.'),
      i: L3("Qarang: keyin so'z qiya bo'ldi. Qiya qiladigan teg esa i bo'ladi.", 'Смотри: после слово стало наклонным. Наклоняет тег i.', 'Look: after, the word is slanted. The i tag slants it.')
    },
    done: L3("Endi b va i ni adashtirmaysiz. Keyin butun sahifani birga o'qiymiz.", 'Теперь b и i не перепутать. Дальше прочитаем всю страницу целиком.', 'Now you won’t mix up b and i. Next, let’s read the whole page.'),
    before: L3("Oldin", 'До', 'Before'),
    after: L3("Keyin", 'После', 'After')
  },
  s12: {
    eyebrow: L3("Tepadan pastga", 'Сверху вниз', 'Top to bottom'),
    say: L3("Mana, do'stimizning butun sahifasi. Brauzer uni qanday o'qishini ko'raylik.", 'Вот вся страница нашего друга. Посмотрим, как браузер её читает.', 'Here’s our friend’s whole page. Let’s see how the browser reads it.'),
    order1: L3("Brauzer kodni tepadan pastga o'qiydi. Oldin h1 keladi, bu asosiy sarlavha bo'ladi.", 'Браузер читает код сверху вниз. Сначала h1 — главный заголовок.', 'The browser reads code from top to bottom. First h1, the main heading.'),
    order2: L3("Keyin abzas keladi. Uning ichida qalin so'z va qiya so'z bor.", 'Потом абзац, а в нём жирное слово и наклонное слово.', 'Then a paragraph with a bold word and a slanted word inside.'),
    order3: L3("Keyin h2 keladi, bu bo'lim sarlavhasi bo'ladi, undan keyin esa yana abzas.", 'Дальше h2 — заголовок раздела, и снова абзац.', 'Then h2, a section heading, and another paragraph.'),
    ask: L3("Brauzer qanday o'qishini kuzating", 'Смотри, как читает браузер', 'Watch how the browser reads'),
    askDone: L3("Brauzer tepadan pastga o'qiydi", 'Браузер читает сверху вниз', 'The browser reads top to bottom')
  },
  // Своя страница — два экрана (одно действие на экран): заголовок, потом абзац; засчёт по «Готово».
  s13: {
    eyebrow: L3("Sarlavhangiz", 'Свой заголовок', 'Your heading'),
    say: L3("Endi o'z sahifangizni yasang. h1 ichiga o'zingizga yoqqan narsa haqida sarlavha yozing va «Tayyor»ni bosing.",
      'Теперь твоя страница. Напиши в h1 заголовок о том, что тебе нравится, и нажми «Готово».',
      'Now your own page. Type a heading in h1 about something you like, then tap “Done”.'),
    ok: L3("Zo'r sarlavha! U sahifadagi eng katta va asosiy sarlavha bo'ladi.", 'Отличный заголовок! Он самый крупный и главный на странице.', 'Great heading! It’s the biggest and the main one on the page.'),
    hints: [
      L3("Sarlavha o'ylab toping: masalan, sevimli o'yiningiz yoki hayvoningiz.", 'Придумай заголовок: например, любимая игра или животное.', 'Make up a heading: your favorite game or animal, for example.'),
      L3("Faqat so'z yozing, teglar allaqachon joyida turibdi.", 'Пиши только слова — теги уже на месте.', 'Type only words: the tags are already in place.'),
      L3("Masalan: Futbol. Yozib bo'lgach, «Tayyor»ni bosing.", 'Например: Футбол. Потом нажми «Готово».', 'For example: Football. Then tap “Done”.')
    ],
    ask: L3("h1 ichiga sarlavha yozing va «Tayyor»ni bosing", 'Напиши заголовок в h1 и нажми «Готово»', 'Type a heading in h1 and tap “Done”'),
    ph: L3("Masalan: Futbol", 'Например: Футбол', 'For example: Football')
  },
  s13b: {
    eyebrow: L3("Abzasingiz", 'Свой абзац', 'Your paragraph'),
    say: L3("Sarlavha bor, endi unga matn kerak. p ichiga sarlavhangiz haqida bitta gap yozing va «Tayyor»ni bosing.",
      'Заголовок есть, теперь нужен текст. Напиши в p одно предложение о своём заголовке и нажми «Готово».',
      'You have a heading; now it needs text. Type one sentence about your heading in p, then tap “Done”.'),
    ok: L3("Barakalla! Sahifangiz tayyor: sarlavha ham, abzas ham bor.", 'Молодец! Твоя страница готова: есть и заголовок, и абзац.', 'Well done! Your page is ready: it has a heading and a paragraph.'),
    hints: [
      L3("Sarlavhangiz haqida nima deya olasiz?", 'Что можно сказать о твоём заголовке?', 'What can you say about your heading?'),
      L3("Faqat so'z yozing, teglar allaqachon joyida turibdi.", 'Пиши только слова — теги уже на месте.', 'Type only words: the tags are already in place.'),
      L3("Masalan: Men do'stlarim bilan futbol o'ynayman. Keyin «Tayyor»ni bosing.", 'Например: Я играю в футбол с друзьями. Потом нажми «Готово».', 'For example: I play football with my friends. Then tap “Done”.')
    ],
    ask: L3("p ichiga bitta gap yozing va «Tayyor»ni bosing", 'Напиши в p одно предложение и нажми «Готово»', 'Type one sentence in p and tap “Done”'),
    ph: L3("Masalan: Men futbol o'ynayman.", 'Например: Я играю в футбол.', 'For example: I play football.')
  },
  s14: {
    eyebrow: L3("Hammasi qalin bo'ldi", 'Всё стало жирным', 'Everything turned bold'),
    say: L3("Voy, sahifangizdagi hamma matn qalin bo'lib ketdi! b ochilgan, lekin u qayerda tugashini brauzer bilmaydi. Yetishmayotgan tegni bo'sh joyga olib boring.",
      'Ой, весь текст на твоей странице стал жирным! b открыт, а где он заканчивается — браузер не знает. Перетащи недостающий тег в пустое место.',
      'Oops, all the text on your page turned bold! b is opened, but the browser doesn’t know where it ends. Drag the missing tag into the empty spot.'),
    why: {
      '</i>': L3("Bu yopuvchi i tegi. Bizga b tegini yopish kerak.", 'Это закрывающий i. А закрыть нужно b.', 'That’s the closing i. We need to close b.'),
      '<b>': L3("Bu yana ochuvchi b. Yopuvchi tegda qiya chiziq bor.", 'Это ещё один открывающий b. В закрывающем есть косая черта.', 'That’s another opening b. The closing one has a slash.')
    },
    ok: L3("Ana endi joyida! Faqat bitta so'z qalin qoldi.", 'Вот теперь порядок! Жирным осталось только одно слово.', 'That’s it! Only one word is bold now.'),
    ask: L3("Yetishmayotgan tegni bo'sh joyga olib boring", 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty spot'),
    opts: ['</i>', '</b>', '<b>'],
    bword: L3("Diqqat!", 'Внимание!', 'Note!'),
    tail: L3("Sahifam tayyor.", 'Моя страница готова.', 'My page is ready.')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новый пример без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3("Xatoni toping", 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, it haqida yangi sahifa, lekin unda xato bor. Brauzerga qarang: nima noto'g'ri ko'rinyapti? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот новая страница — про собаку, но в ней ошибка. Посмотри на браузер: что выглядит не так? Найди, в какой строке ошибка, и нажми эту строку.',
      'Now check yourself. Here’s a new page about a dog, but it has a bug. Look at the browser: what looks wrong? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Mana yana bitta sahifa. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Вот ещё одна страница. Что сломано здесь?', 'Great, the first bug is found! Here’s one more page. What’s broken here?'),
    ask: L3("Xato bor qatorni bosing", 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan: teglar ochilgan va yopilgan. Brauzerga qarang: buzilish qayerdan boshlanadi?", 'Эта строка в порядке: теги открыты и закрыты. Посмотри на браузер: откуда начинается поломка?', 'This line is fine: its tags are opened and closed. Look at the browser: where does the problem start?'),
    found: {
      h1: L3("Topdingiz! Bu yerda ikkinchi teg ham ochuvchi bo'lib qolgan, unda qiya chiziq yo'q. Shuning uchun pastdagi hamma matn ham ulkan edi.", 'Нашёл! Здесь второй тег тоже открывающий, в нём нет косой черты. Поэтому и весь текст ниже был огромным.', 'Found it! The second tag here is an opening one too: it has no slash. That’s why all the text below was huge.'),
      b: L3("Topdingiz! b ochilgan, lekin yopilmagan. Shuning uchun qolgan matn ham qalin bo'lib ketgan edi.", 'Нашёл! b открыт, но не закрыт. Поэтому и остальной текст стал жирным.', 'Found it! b is opened but never closed. That’s why the rest of the text turned bold.')
    },
    hints: {
      h1: [
        L3("Brauzerga qarang: qaysi matn keraksiz ulkan bo'lib qolgan?", 'Посмотри на браузер: какой текст зря огромный?', 'Look at the browser: which text is huge for no reason?'),
        L3("Ulkan matn sarlavhadan keyin boshlanadi. h1 qatorini tekshiring.", 'Огромный текст начинается после заголовка. Проверь строку с h1.', 'The huge text starts after the heading. Check the h1 line.'),
        L3("Yopuvchi tegda qiya chiziq bo'lishi kerak. Qaysi qatorda u yo'q?", 'В закрывающем теге должна быть косая черта. В какой строке её нет?', 'A closing tag needs a slash. Which line is missing it?')
      ],
      b: [
        L3("Brauzerga qarang: qaysi so'zlar keraksiz qalin bo'lib qolgan?", 'Посмотри на браузер: какие слова зря жирные?', 'Look at the browser: which words are bold for no reason?'),
        L3("Qalin matn b tegidan boshlanadi. b qaysi qatorda turibdi?", 'Жирный текст начинается с тега b. В какой строке b?', 'Bold text starts at the b tag. Which line has b?'),
        L3("Ochilgan b yopilganmi? Yopuvchi b tegi qaysi qatorda yo'q?", 'Открытый b закрыт? В какой строке нет закрывающего b?', 'Is the opened b closed? Which line is missing the closing b?')
      ]
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz endi kodni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь код как настоящий программист.', 'Super! Both bugs are found. You check code like a real programmer.'),
    head: L3("Mening itim", 'Мой пёс', 'My dog'),
    line: L3("Uning ismi Reks.", 'Его зовут Рекс.', 'His name is Rex.'),
    pre: L3("U ", 'Он ', 'He is '),
    word: L3("juda", 'очень', 'very'),
    post: L3(" aqlli.", ' умный.', ' smart.'),
    more: L3("U suyakni yaxshi ko'radi.", 'Он любит косточки.', 'He loves bones.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3("Kodi aytadi", 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    // Верный ответ не всегда «верно»; промах — кнопка гаснет, Коди объясняет, можно снова.
    items: [
      { t: L3("h6 eng katta sarlavha bo'ladi.", 'h6 — самый крупный заголовок.', 'h6 is the biggest heading.'), right: false,
        code: [{ t: 'h6' }, { w: L3("Sarlavha", 'Заголовок', 'Heading') }, { t: 'h6', close: true }],
        why: L3("Aslida h6 eng kichik sarlavha bo'ladi. Eng kattasi esa h1 bo'ladi.", 'На самом деле h6 — самый мелкий заголовок. Самый крупный — h1.', 'Actually h6 is the smallest heading. The biggest is h1.') },
      { t: L3("Kodda yangi qatorga o'tsangiz, brauzer yangi abzas boshlaydi.", 'Если в коде перейти на новую строку, браузер начнёт новый абзац.', 'If you start a new line in the code, the browser starts a new paragraph.'), right: false,
        why: L3("Brauzer kod qatorlarini bitta qilib yopishtiradi. Yangi abzasni faqat p yasay oladi.", 'Браузер склеивает строки кода в одну. Новый абзац делает только p.', 'The browser glues code lines together. Only p makes a new paragraph.') },
      { t: L3("Sahifada odatda bitta h1 bo'ladi.", 'На странице обычно один h1.', 'A page usually has one h1.'), right: true,
        code: [{ t: 'h1' }, { w: L3("Mening sahifam", 'Моя страница', 'My page') }, { t: 'h1', close: true }],
        why: L3("h1 asosiy sarlavha hisoblanadi. Bo'limlar uchun esa h2 bor.", 'h1 — это главный заголовок. А для разделов есть h2.', 'h1 is the main heading. Sections use h2.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz sarlavha, abzas, qalin va qiya teglarni yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь теги заголовков, абзаца, жирного и курсива.', 'All correct! You know the heading, paragraph, bold and italic tags really well.')
  },
  s15: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men asosiy sarlavhaga h6 tegini qo'ygan edim? Afsuski, men adashibman: h6 eng kichik sarlavha bo'ladi, eng kattasi esa h1. Men raqamni o'lcham deb o'ylagan edim. Lekin raqam qancha katta bo'lsa, sarlavha shuncha kichik bo'ladi.",
        'Вернёмся к загадке. Помнишь, я поставил на главный заголовок h6? Я ошибся: h6 — самый мелкий заголовок, а самый крупный — h1. Я думал, что цифра — это размер. Но чем больше цифра, тем мельче заголовок.',
        'Back to our riddle. Remember, I put h6 on the main heading? I was wrong: h6 is the smallest heading, and the biggest is h1. I thought the number was the size. But the bigger the number, the smaller the heading.'), k: 'h' },
      { text: L3("Qarang, bu sizning sahifangiz!", 'Посмотри, это твоя страница!', 'Look, this is your page!'), k: null },
      { text: L3("h1 tegidan h6 tegigacha hammasi sarlavha teglari bo'ladi. h1 eng katta bo'ladi, bu asosiy sarlavha.", 'Теги от h1 до h6 — заголовки. h1 самый крупный, это главный заголовок.', 'The tags from h1 to h6 are headings. h1 is the biggest: the main heading.'), k: 'h' },
      { text: L3("p tegi abzas yasaydi. Har bir p yangi qatordan boshlanadi.", 'Тег p — абзац. Каждый p начинается с новой строки.', 'The p tag is a paragraph. Each p starts on a new line.'), k: 'p' },
      { text: L3("b so'zni qalin qiladi, i esa qiya qiladi.", 'b делает слово жирным, а i — наклонным.', 'b makes a word bold, and i makes it slanted.'), k: 'bi' },
      { text: L3("Tabriklayman! Endi sahifangiz o'z hikoyasini aytib bera oladi. Keyingi darsda ro'yxatlar tuzamiz. Ko'rishguncha!", 'Ура! Теперь твоя страница умеет рассказывать. На следующем уроке сделаем списки. До встречи!', 'Hooray! Now your page can tell a story. Next time we’ll make lists. See you!'), k: null }
    ],
    roles: {
      h: L3("h1–h6 — sarlavhalar", 'h1–h6 — заголовки', 'h1–h6 — headings'),
      p: L3("p — abzas", 'p — абзац', 'p — paragraph'),
      bi: L3("b — qalin, i — qiya", 'b — жирный, i — курсив', 'b — bold, i — italic')
    },
    ask: L3("Sahifangizga qarang", 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { opts: 1, why: 1, magic: 1, magicP: 1, magicB: 1, big: 1, small: 1, msgs: 1, sayP: 1, askQ: 1, miss: 1,
  b: 1, i: 1, order1: 1, order2: 1, order3: 1, cards: 1, say2: 1, fine: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { cards: { title: 1 }, opts: { t: 1, id: 1, right: 1 }, items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:z2r-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:z2r.css@*/
`;
