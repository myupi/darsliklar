// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 2 — «Заголовки и текст»
// (бумажный коллаж, по эталону урока 1). Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/zagolovki/z2.src.jsx lessons/html/02-zagolovki-i-tekst.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Заголовки и текст» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (22.10.2026, переделка по эталону — урок 1 «Бумажная страница»;
// материал — ролик html2.mp4 «Заголовки и текст»). Тот же бумажный стиль: лист
// с рваным краем, вырезки с фактурой и тенью, stop-motion, шорох бумаги,
// переход «разбор и сборка», честный бумажный браузер. Бумажный человечек из
// урока 1 сделал страницу о своём коте, но все слова на ней слиплись в кашу.
// Ученик учит теги, которые делают текст читаемым, и собирает свою страницу.
//
// ДУГА (15 экранов): s1 крючок (каша → страница) · s2 план · тройки
// «объяснение → сам делаешь → закрепление»: заголовки h1–h6 (s3–s5), абзац p
// (s6–s8), жирный b и курсив i (s9–s11), вся страница (s12–s14) · s15 вывод.
// Сценарий — docs/scenarij-02-zagolovki-i-tekst.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь.
//   · Честный браузер: заголовки убывают от h1 к h6; переносы строк в коде
//     склеиваются в пробел; каждый p — отдельный абзац с отступом; незакрытый
//     h1 делает огромным всё, что после него; незакрытый b делает жирным весь
//     текст дальше (так и в настоящем браузере).
//   · Конфетти только в финале: похвалы экранов — поза smile.
//
// СИСТЕМА СЛОВ. Заголовок (sarlavha) — h1…h6, h1 главный и самый крупный,
// обычно один — название страницы; h2 — заголовок раздела. Абзац (xatboshi) —
// p. b — жирный (qalin), i — курсив (qiya, kursiv). Как в уроке 1: teg,
// yorliq — только вкладка, oyna — окно, sahifa nomi — название.
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
  inspector: L3('Qoida', 'Правило', 'Rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Ro‘yxatlar', 'Списки', 'Lists'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  read: L3('Brauzerdek o‘qish', 'Читать как браузер', 'Read like a browser'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА ЧЕЛОВЕЧКА О КОТЕ — сквозной пример урока. Строка абзаца — части:
// строка или { b } / { i } (слово в теге).
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  title: L3('Mening mushugim', 'Мой кот', 'My cat'),
  p1: L3(['Mushugim ', { b: 'juda' }, ' ', { i: 'uxlashni' }, ' yaxshi ko‘radi.'],
    ['Мой кот ', { b: 'очень' }, ' любит ', { i: 'спать' }, '.'],
    ['My cat ', { b: 'really' }, ' loves to ', { i: 'sleep' }, '.']),
  h2: L3('U nima yeydi', 'Что он ест', 'What he eats'),
  p2: L3(['Baliq va sutni yaxshi ko‘radi.'], ['Он любит рыбу и молоко.'], ['He loves fish and milk.'])
};

// Обёртка слова или строки в тег, набранная в два поля (s7, s10): что не так.
const WRAP_MSGS = {
  needOpen: L3('Matndan oldin ochuvchi {tag} tegi kerak.', 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  openSlash: L3('Bu yopuvchi teg. Matndan oldin qiya chiziqsiz ochuvchi teg turadi.', 'Это закрывающий тег. Перед текстом ставят открывающий, без косой черты.', 'That’s a closing tag. Before the text goes the opening tag, without a slash.'),
  needClose: L3('Matndan keyin yopuvchi {tag} tegi kerak.', 'После текста нужен закрывающий тег {tag}.', 'After the text you need the closing {tag} tag.'),
  needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda {tag} dan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needLt: L3('Teg chap «<» qavs bilan boshlanadi.', 'Тег начинается с уголка «<».', 'A tag starts with the bracket “<”.'),
  needGt: L3('Teg oxirida o‘ng «>» qavs turadi.', 'В конце тега нужен уголок «>».', 'A tag ends with the bracket “>”.'),
  wrongName: L3('Teg ichida {tag} bo‘lishi kerak.', 'Внутри тега должно быть {tag}.', 'The tag should say {tag}.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения. Звучат: say, done, ok, msgs,
// hints, why, miss …; печатаются: eyebrow, ask, cards.title, card.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Bo‘tqa matn', 'Каша из текста', 'A wall of text'),
    say: L3('Bu odamchaning mushugi haqidagi sahifasi. Lekin hamma so‘zlar bir-biriga yopishib qolgan: qayerda nom, qayerda hikoya, tushunib bo‘lmaydi.',
      'Это страница человечка о его коте. Но все слова слиплись в одну кашу: где название, где рассказ — не понять.',
      'This is the paper buddy’s page about his cat. But all the words are stuck together: you can’t tell the title from the story.'),
    magic: L3('Voy, qarang! Tepada katta sarlavha paydo bo‘ldi.', 'Ого! Наверху появилось крупное название.', 'Whoa! A big heading appeared at the top.'),
    magicP: L3('Matn xatboshilarga bo‘lindi.', 'Текст разделился на абзацы.', 'The text split into paragraphs.'),
    magicB: L3('Muhim so‘z esa qalin bo‘ldi.', 'А важное слово стало жирным.', 'And the important word turned bold.'),
    done: L3('Bugun matnni shunday bezashni o‘rganasiz va o‘z sahifangizni yasaysiz!', 'Сегодня ты научишься так оформлять текст и сделаешь свою страницу!', 'Today you’ll learn to shape text like this and make your own page!'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3('Sarlavha, xatboshilar va qalin so‘z', 'Заголовок, абзацы и жирное слово', 'A heading, paragraphs and a bold word')
  },
  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Mana bugungi dars rejasi. Unda to‘rtta qadam bor.', 'Вот план урока. В нём четыре шага.', 'Here’s the plan for today. It has four steps.'),
    cards: [
      { title: L3('Sarlavhalar', 'Заголовки', 'Headings'),
        say: L3('Avval sarlavhalar bilan tanishamiz: katta va kichik.', 'Сначала заголовки: большие и маленькие.', 'First, headings: big and small.') },
      { title: L3('Xatboshilar', 'Абзацы', 'Paragraphs'),
        say: L3('Keyin matnni xatboshilarga bo‘lamiz.', 'Потом разделим текст на абзацы.', 'Then we’ll split text into paragraphs.') },
      { title: L3('Qalin va qiya', 'Жирный и курсив', 'Bold and italic'),
        say: L3('Uchinchi qadamda muhim so‘zlarni qalin va qiya qilamiz.', 'Третий шаг — выделим важные слова жирным и курсивом.', 'Step three: we’ll make important words bold and italic.') },
      { title: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
        say: L3('Oxirida esa sarlavha va matnli o‘z sahifangizni yasaysiz!', 'А в конце ты сделаешь свою страницу с заголовком и текстом!', 'And at the end, you’ll make your own page with a heading and text!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  s3: {
    eyebrow: L3('Sarlavhalar', 'Заголовки', 'Headings'),
    say: L3('Sarlavha teglari oltita: h1 dan h6 gacha.', 'Тегов заголовков шесть: от h1 до h6.', 'There are six heading tags: from h1 to h6.'),
    askBig: L3('Eng katta sarlavhani bosing.', 'Нажми самый крупный заголовок.', 'Tap the biggest heading.'),
    big: L3('Bu h1. U eng muhim va eng katta sarlavha. Odatda sahifada bitta bo‘ladi: bu sahifaning nomi.',
      'Это h1 — самый главный и самый крупный заголовок. Обычно он на странице один: это её название.',
      'This is h1, the most important and biggest heading. A page usually has just one: its title.'),
    askSmall: L3('Endi eng kichik sarlavhani bosing.', 'Теперь нажми самый маленький.', 'Now tap the smallest one.'),
    small: L3('Bu h6, eng kichik sarlavha. Raqam qancha katta bo‘lsa, sarlavha shuncha kichik.',
      'Это h6 — самый маленький. Чем больше цифра, тем мельче заголовок.',
      'This is h6, the smallest. The bigger the number, the smaller the heading.'),
    done: L3('Brauzer sarlavhalarni qalin va katta qilib ko‘rsatadi. Qog‘oz chiziqlarni tushunarli bo‘lishi uchun yasadik.',
      'Браузер показывает заголовки крупно и жирно. Бумажные полоски мы сделали для наглядности.',
      'The browser shows headings big and bold. We made the paper strips to help you see it.'),
    ask: L3('Sarlavhalarni bosing', 'Нажми заголовки', 'Tap the headings'),
    word: L3('Sarlavha', 'Заголовок', 'Heading')
  },
  s4: {
    eyebrow: L3('Sarlavhani yoping', 'Закрой заголовок', 'Close the heading'),
    say: L3('Voy, butun matn ulkan bo‘lib ketdi! h1 ochilgan, lekin yopilmagan, shuning uchun brauzer sarlavha davom etyapti deb o‘ylaydi. Bo‘sh joyga yopuvchi h1 tegini yozing.',
      'Ой, весь текст стал огромным! h1 открыт, но не закрыт — браузер думает, что заголовок продолжается. Допиши в пустое место закрывающий тег h1.',
      'Oops, all the text turned huge! h1 is opened but not closed, so the browser thinks the heading goes on. Type the closing h1 tag in the empty spot.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda h1 dan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед h1 стоит косая черта «/».', 'That’s the opening tag. The closing one has a slash “/” before h1.'),
      needLt: L3('Teg chap «<» qavs bilan boshlanadi. Uni boshiga qo‘shing.', 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida o‘ng «>» qavs turadi. Uni oxiriga qo‘shing.', 'В конце тега нужен уголок «>». Добавь его в конец.', 'A tag ends with the bracket “>”. Add it at the end.'),
      wrongName: L3('Teg ichida boshqa so‘z yozilgan. Bu yerda h1 kerak.', 'Внутри тега другое слово. Здесь нужен h1.', 'There’s a different word inside the tag. Here you need h1.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.', 'Косая черта «/» стоит сразу после первого уголка.', 'The slash “/” goes right after the first bracket.')
    },
    hints: [
      L3('Sarlavha qayerda tugashi kerak? Uning ochuvchi tegiga qarang.', 'Где должен закончиться заголовок? Посмотри на его открывающий тег.', 'Where should the heading end? Look at its opening tag.'),
      L3('Yopuvchi teg o‘sha so‘z, faqat qiya chiziq bilan.', 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3('Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin h1 va oxirida yana burchakli qavs.', 'Сначала уголок, потом косая черта. Дальше h1 и в конце снова уголок.', 'First a bracket, then the slash. Then h1, and another bracket at the end.')
    ],
    ok: L3('To‘g‘ri! Sarlavha yopildi, matn yana oddiy bo‘ldi.', 'Есть! Заголовок закрыт — текст снова обычный.', 'Yes! The heading is closed, and the text is normal again.'),
    ask: L3('Bo‘sh joyga yopuvchi h1 tegini yozing', 'Допиши закрывающий тег h1 в пустое место', 'Type the closing h1 tag in the empty spot')
  },
  s5: {
    eyebrow: L3('Qaysi sarlavha?', 'Какой заголовок?', 'Which heading?'),
    say: L3('Sahifa nomi uchun h1 kerak, bo‘limlar sarlavhalari uchun esa h2. Teglarni o‘z joyiga torting, bittasi ortiqcha.',
      'Название страницы — это h1, заголовки разделов — h2. Перетащи теги на места, один тег лишний.',
      'The page title is h1, and section headings are h2. Drag the tags into place; one tag is extra.'),
    why: {
      h1sec: L3('h1 sahifada bitta, bu nom. Bo‘lim uchun h2 kerak.', 'h1 на странице один — это название. Для раздела нужен h2.', 'A page has one h1: its title. A section needs h2.'),
      h2title: L3('Sahifa nomi eng muhimi, unga h1 kerak.', 'Название страницы — самое главное, ему нужен h1.', 'The page title is the most important: it needs h1.'),
      h6: L3('h6 eng kichik sarlavha. Bu yerga boshqa teg kerak.', 'h6 — самый мелкий. Здесь нужен другой тег.', 'h6 is the smallest. A different tag goes here.')
    },
    hints: [
      L3('Qaysi qator butun sahifaning nomi?', 'Какая строка — название всей страницы?', 'Which line is the title of the whole page?'),
      L3('Nom tepada turadi. Qolgan ikkitasi bo‘limlar.', 'Название стоит сверху. Остальные две строки — разделы.', 'The title is at the top. The other two lines are sections.'),
      L3('h1 ni tepadagi qatorga, ikkala h2 ni pastdagi qatorlarga qo‘ying.', 'h1 — на верхнюю строку, оба h2 — на две нижние.', 'Put h1 on the top line and both h2 tags on the two lines below.')
    ],
    ok: L3('To‘g‘ri! Nom katta, bo‘limlar kichikroq: sahifani o‘qish oson.', 'Верно! Название крупно, разделы помельче — страницу легко читать.', 'Right! The title is big, the sections smaller: the page is easy to read.'),
    ask: L3('Tegni sarlavhaga torting', 'Перетащи тег на заголовок', 'Drag a tag onto a heading'),
    askPlace: L3('Endi joyini bosing', 'Теперь нажми место', 'Now tap its place'),
    pickFirst: L3('Avval tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.'),
    lines: [L3('Mening mushugim', 'Мой кот', 'My cat'), L3('U nima yeydi', 'Что он ест', 'What he eats'), L3('U qanday o‘ynaydi', 'Как он играет', 'How he plays')]
  },
  s6: {
    eyebrow: L3('Xatboshi', 'Абзац', 'Paragraph'),
    say: L3('Kodda uchta qator, brauzer esa ularni bitta qatorga yopishtirdi. Koddagi qator ko‘chishini brauzer ko‘rmaydi.',
      'В коде три строки, а браузер склеил их в одну. Переносы строк в коде браузер не видит.',
      'The code has three lines, but the browser glued them into one. The browser doesn’t see line breaks in code.'),
    sayP: L3('Matn xatboshi bo‘lishi uchun uni p tegiga o‘raymiz. Har bir qatorni bosing.',
      'Чтобы текст стал абзацем, его оборачивают в тег p. Нажми каждую строку.',
      'To make text a paragraph, we wrap it in the p tag. Tap each line.'),
    done: L3('Har bir p alohida xatboshi. Xatboshilar orasida brauzer o‘zi bo‘sh joy qoldiradi.',
      'Каждый p — отдельный абзац. Между абзацами браузер сам делает отступ.',
      'Each p is a separate paragraph. The browser adds space between paragraphs by itself.'),
    ask: L3('Har bir qatorni bosing', 'Нажми каждую строку', 'Tap each line'),
    lines: [L3('Mushugim kun bo‘yi uxlaydi.', 'Мой кот спит весь день.', 'My cat sleeps all day.'),
      L3('Kechqurun u o‘ynaydi.', 'Вечером он играет.', 'In the evening he plays.'),
      L3('Baliqni yaxshi ko‘radi.', 'Он любит рыбу.', 'He loves fish.')]
  },
  s7: {
    eyebrow: L3('Xatboshi yozing', 'Напиши абзац', 'Write a paragraph'),
    say: L3('Bu qator hali xatboshi emas: brauzer uni oldingisiga yopishtirdi. Uni p tegiga o‘rang. Matndan oldin ochuvchi tegni, keyin yopuvchi tegni yozing.',
      'Эта строка ещё не абзац: браузер приклеил её к предыдущей. Оберни её в тег p. Перед текстом напиши открывающий тег, после текста — закрывающий.',
      'This line isn’t a paragraph yet: the browser glued it to the one before. Wrap it in p. Type the opening tag before the text and the closing tag after it.'),
    hints: [
      L3('Xatboshi teg bilan boshlanib, teg bilan tugaydi.', 'Абзац начинается тегом и заканчивается тегом.', 'A paragraph starts with a tag and ends with a tag.'),
      L3('Xatboshi tegi p. Yopuvchisida qiya chiziq bor.', 'Тег абзаца — p. В закрывающем есть косая черта.', 'The paragraph tag is p. The closing one has a slash.'),
      L3('Birinchi joyga ochuvchi p, ikkinchisiga yopuvchi p yozing.', 'В первое место — открывающий p, во второе — закрывающий p.', 'Type the opening p in the first spot and the closing p in the second.')
    ],
    ok: L3('To‘g‘ri! Endi bu alohida xatboshi.', 'Верно! Теперь это отдельный абзац.', 'Right! Now it’s a separate paragraph.'),
    ask: L3('Qatorni p tegiga o‘rang', 'Оберни строку в тег p', 'Wrap the line in the p tag'),
    prev: L3('Mushugim kun bo‘yi uxlaydi.', 'Мой кот спит весь день.', 'My cat sleeps all day.'),
    text: L3('Kechqurun u to‘p o‘ynaydi.', 'Вечером он играет с мячом.', 'In the evening he plays with a ball.')
  },
  s8: {
    eyebrow: L3('Nechta xatboshi?', 'Сколько абзацев?', 'How many paragraphs?'),
    say: L3('Endi brauzer kabi o‘ylang: xatboshilarni qatorlar emas, p teglari belgilaydi.', 'Теперь подумай как браузер: абзацы задают не строки, а теги p.', 'Now think like a browser: paragraphs come from p tags, not from lines.'),
    askQ: L3('Brauzer nechta xatboshi ko‘rsatadi?', 'Сколько абзацев покажет браузер?', 'How many paragraphs will the browser show?'),
    ok: L3('To‘g‘ri! p nechta bo‘lsa, xatboshi shuncha.', 'Верно! Сколько p — столько и абзацев.', 'Right! As many p tags, as many paragraphs.'),
    miss: {
      one: L3('Qarang: qatorlar bir nechta, lekin p bitta. Demak, xatboshi ham bitta.', 'Смотри: строк несколько, а p один. Значит, и абзац один.', 'Look: there are several lines, but only one p. So there is one paragraph.'),
      many: L3('Qarang: p teglari bir nechta. Har bir p alohida xatboshi, ular qaysi qatorda turishi muhim emas.', 'Смотри: тегов p несколько. Каждый p — отдельный абзац, неважно, в какой он строке.', 'Look: there are several p tags. Each p is a separate paragraph, whatever line it’s on.')
    },
    done: L3('Tushunarli: koddagi qatorlar emas, p teglari muhim.', 'Главное понятно: важны не строки в коде, а теги p.', 'Got it: what matters is the p tags, not the lines in the code.')
  },
  s9: {
    eyebrow: L3('Qalin va qiya', 'Жирный и курсив', 'Bold and italic'),
    say: L3('Muhim so‘zni ajratish uchun yana ikkita teg bor.', 'Чтобы выделить важное слово, есть ещё два тега.', 'There are two more tags to make a word stand out.'),
    askB: L3('b tegini bosing.', 'Нажми тег b.', 'Tap the b tag.'),
    b: L3('b tegi so‘zni qalin qiladi, uni darhol payqashadi.', 'Тег b делает слово жирным, чтобы его заметили.', 'The b tag makes a word bold so people notice it.'),
    askI: L3('Endi i tegini bosing.', 'Теперь нажми тег i.', 'Now tap the i tag.'),
    i: L3('i tegi esa so‘zni qiyshaytiradi, bu kursiv.', 'А тег i наклоняет слово — это курсив.', 'And the i tag slants the word: that’s italic.'),
    done: L3('b va i so‘z atrofiga qo‘yiladi: so‘zdan oldin ochuvchi teg, so‘zdan keyin yopuvchi teg.', 'b и i ставят вокруг слова: открывающий тег перед ним, закрывающий после.', 'b and i go around a word: the opening tag before it, the closing tag after.'),
    ask: L3('b va i teglarini bosing', 'Нажми теги b и i', 'Tap the b and i tags')
  },
  s10: {
    eyebrow: L3('So‘zni ajrating', 'Выдели слово', 'Make a word stand out'),
    say: L3('Bu so‘zni qalin qiling: so‘zdan oldin ochuvchi b tegini, keyin yopuvchi b tegini yozing.', 'Сделай это слово жирным: перед словом напиши открывающий тег b, после — закрывающий.', 'Make this word bold: type the opening b tag before the word and the closing one after it.'),
    hints: [
      L3('So‘zni qalin qiladigan teg qaysi?', 'Какой тег делает слово жирным?', 'Which tag makes a word bold?'),
      L3('Bu b tegi. Yopuvchisida qiya chiziq bor.', 'Это тег b. В закрывающем есть косая черта.', 'It’s the b tag. The closing one has a slash.'),
      L3('So‘zdan oldingi joyga ochuvchi b, keyingi joyga yopuvchi b yozing.', 'В место перед словом — открывающий b, после слова — закрывающий b.', 'Type the opening b before the word and the closing b after it.')
    ],
    ok: L3('To‘g‘ri! So‘z qalin bo‘ldi.', 'Есть! Слово стало жирным.', 'Yes! The word is bold now.'),
    ask: L3('«{w}» so‘zini qalin qiling', 'Сделай слово «{w}» жирным', 'Make the word “{w}” bold'),
    parts: L3(['U ', 'baliqni', ' yaxshi ko‘radi.'], ['Он любит ', 'рыбу', '.'], ['He loves ', 'fish', '.'])
  },
  s11: {
    eyebrow: L3('b yoki i?', 'b или i?', 'b or i?'),
    say: L3('Men so‘zlarni bezamoqchi edim, lekin teglarni unutib qo‘ydim. Kartochkadagidek bo‘lishi uchun qaysi teg kerak?',
      'Я хотел выделить слова, но забыл теги. Какой тег нужен, чтобы вышло как на карточке?',
      'I wanted to style some words, but I forgot the tags. Which tag makes it look like the card?'),
    askQ: L3('Qaysi teg kerak: b yoki i?', 'Какой тег нужен: b или i?', 'Which tag is needed: b or i?'),
    ok: {
      b: L3('To‘g‘ri! b so‘zni qalin qiladi.', 'Верно! b делает слово жирным.', 'Right! b makes the word bold.'),
      i: L3('To‘g‘ri! i so‘zni qiya qiladi.', 'Верно! i делает слово наклонным.', 'Right! i makes the word slanted.')
    },
    miss: {
      b: L3('Qarang: kartochkada so‘z qalin. Qalin qiladigan teg b.', 'Смотри: на карточке слово жирное. Жирным делает тег b.', 'Look: on the card the word is bold. The b tag makes it bold.'),
      i: L3('Qarang: kartochkada so‘z qiya. Qiya qiladigan teg i.', 'Смотри: на карточке слово наклонное. Наклоняет тег i.', 'Look: on the card the word is slanted. The i tag slants it.')
    },
    done: L3('Endi b va i ni adashtirmaysiz.', 'Теперь b и i не перепутать.', 'Now you won’t mix up b and i.'),
    card: L3('Shunday bo‘lishi kerak', 'Как должно быть', 'How it should look')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Bu odamchaning butun sahifasi. Brauzer uni qanday o‘qishini ko‘raylik.', 'Это вся страница человечка. Посмотрим, как браузер её читает.', 'This is the buddy’s whole page. Let’s see how the browser reads it.'),
    order1: L3('Brauzer kodni yuqoridan pastga o‘qiydi. Avval h1, sahifa nomi.', 'Браузер читает код сверху вниз. Сначала h1 — название страницы.', 'The browser reads code from top to bottom. First h1, the page title.'),
    order2: L3('Keyin xatboshi. Uning ichida qalin va qiya so‘z bor.', 'Потом абзац, а в нём жирное и наклонное слово.', 'Then a paragraph with a bold and a slanted word inside.'),
    order3: L3('Keyin h2, bo‘lim sarlavhasi, va yana xatboshi.', 'Дальше h2 — заголовок раздела, и снова абзац.', 'Then h2, a section heading, and another paragraph.'),
    ask: L3('«Brauzerdek o‘qish» tugmasini bosing', 'Нажми «Читать как браузер»', 'Tap “Read like a browser”'),
    askDone: L3('Brauzer yuqoridan pastga o‘qiydi', 'Браузер читает сверху вниз', 'The browser reads top to bottom')
  },
  s13: {
    eyebrow: L3('O‘z sahifangiz', 'Своя страница', 'Your page'),
    say: L3('Endi o‘z sahifangizni yasang. Avval h1 ichiga uning nomini yozing: o‘zingizga yoqqan narsa haqida.',
      'Теперь твоя страница. Сначала напиши в h1 её название — о том, что тебе нравится.',
      'Now your own page. First, type its title in h1, about something you like.'),
    sayP: L3('Endi p ichiga bu haqda bitta gap yozing.', 'Теперь напиши в p одно предложение об этом.', 'Now type one sentence about it in p.'),
    ok: L3('Sahifangiz tayyor: sarlavha va xatboshi bor.', 'Твоя страница готова: есть заголовок и абзац.', 'Your page is ready: it has a heading and a paragraph.'),
    hints: [
      L3('Nom o‘ylab toping: masalan, sevimli o‘yiningiz yoki hayvoningiz.', 'Придумай название: например, любимая игра или животное.', 'Make up a title: your favorite game or animal, for example.'),
      L3('Faqat so‘z yozing, teglar allaqachon joyida.', 'Пиши только слова — теги уже на месте.', 'Type only words: the tags are already in place.'),
      L3('Masalan: Futbol. Keyin: Men do‘stlarim bilan futbol o‘ynayman.', 'Например: Футбол. А потом: Я играю в футбол с друзьями.', 'For example: Football. Then: I play football with my friends.')
    ],
    askTitle: L3('h1 ichiga sahifa nomini yozing', 'Напиши название в h1', 'Type the title in h1'),
    askP: L3('p ichiga bitta gap yozing', 'Напиши в p одно предложение', 'Type one sentence in p'),
    phTitle: L3('Masalan: Futbol', 'Например: Футбол', 'For example: Football'),
    phP: L3('Masalan: Men futbol o‘ynayman.', 'Например: Я играю в футбол.', 'For example: I play football.')
  },
  s14: {
    eyebrow: L3('Hammasi qalin bo‘ldi', 'Всё стало жирным', 'Everything turned bold'),
    say: L3('Voy, sahifangizdagi hamma matn qalin bo‘lib ketdi! b ochilgan, lekin u qayerda tugashini brauzer bilmaydi. Yetishmayotgan tegni bo‘sh joyga torting.',
      'Ой, весь текст на твоей странице стал жирным! b открыт, а где он заканчивается — браузер не знает. Перетащи недостающий тег в пустое место.',
      'Oops, all the text on your page turned bold! b is opened, but the browser doesn’t know where it ends. Drag the missing tag into the empty spot.'),
    why: {
      '</i>': L3('Bu yopuvchi i tegi. Bizga b ni yopish kerak.', 'Это закрывающий i. А закрыть нужно b.', 'That’s the closing i. We need to close b.'),
      '<b>': L3('Bu yana ochuvchi b. Yopuvchi tegda qiya chiziq bor.', 'Это ещё один открывающий b. В закрывающем есть косая черта.', 'That’s another opening b. The closing one has a slash.')
    },
    ok: L3('To‘g‘ri! Faqat bitta so‘z qalin qoldi.', 'Есть! Жирным осталось только одно слово.', 'Yes! Only one word is bold now.'),
    ask: L3('Yetishmayotgan tegni bo‘sh joyga torting', 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty spot'),
    opts: ['</i>', '</b>', '<b>'],
    bword: L3('Diqqat!', 'Внимание!', 'Note!'),
    tail: L3('Sahifam tayyor.', 'Моя страница готова.', 'My page is ready.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang, bu sizning sahifangiz!', 'Посмотри, это твоя страница!', 'Look, this is your page!'), k: null },
      { text: L3('h1 dan h6 gacha teglar sarlavhalar. h1 eng katta, bu sahifa nomi.', 'Теги от h1 до h6 — заголовки. h1 самый крупный, это название страницы.', 'The tags from h1 to h6 are headings. h1 is the biggest: the page title.'), k: 'h' },
      { text: L3('p tegi xatboshi. Har bir p yangi qatordan boshlanadi.', 'Тег p — абзац. Каждый p начинается с новой строки.', 'The p tag is a paragraph. Each p starts on a new line.'), k: 'p' },
      { text: L3('b so‘zni qalin qiladi, i esa qiya qiladi.', 'b делает слово жирным, а i — наклонным.', 'b makes a word bold, and i makes it slanted.'), k: 'bi' },
      { text: L3('Tabriklayman! Endi sahifangiz o‘z hikoyasini aytib bera oladi.', 'Ура! Теперь твоя страница умеет рассказывать.', 'Hooray! Now your page can tell a story.'), k: null }
    ],
    roles: {
      h: L3('h1–h6 — sarlavhalar', 'h1–h6 — заголовки', 'h1–h6 — headings'),
      p: L3('p — xatboshi', 'p — абзац', 'p — paragraph'),
      bi: L3('b — qalin, i — qiya', 'b — жирный, i — курсив', 'b — bold, i — italic')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { magic: 1, magicP: 1, magicB: 1, askBig: 1, big: 1, askSmall: 1, small: 1, msgs: 1, sayP: 1, askQ: 1, miss: 1,
  askB: 1, b: 1, askI: 1, i: 1, order1: 1, order2: 1, order3: 1, cards: 1 });
Object.assign(NOT_SPOKEN_IN, { cards: { title: 1 } });

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:z2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:z2.css@*/
`;
