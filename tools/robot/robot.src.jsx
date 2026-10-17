// =============================================================================
// == ТЕСТОВЫЙ УРОК · «Структура HTML-документа — робот Bob» (проба урока 1) ===
//
// Переделка урока 1 курса HTML по отзывам учеников (17.10.2026). Отзывы стоят
// выше навыка /novyy-urok:
//   • «зачем это нужно» — в начале: робот Bob собирается из трёх слоёв (детали ·
//     вид · движение = HTML · CSS · JavaScript), на его экране — игра «Битва
//     знаний», это настоящая страница, и у неё есть код (экраны r1, r2);
//   • каждый тег объясняется там, где появляется: тег — на строке title (s2),
//     html, head, title, body — по одному, с подсветкой в браузере (s3);
//   • простые слова: html — вся страница, head — паспорт страницы (в нём
//     название), body — тело страницы, всё, что видно в окне;
//   • наглядно: объёмный робот (навык anatomy), коробка документа, провода от
//     кода к вкладке и окну, хлопушки на похвалах;
//   • нельзя застрять: у каждого задания счётчик и подсказка «что дальше»,
//     светится следующее место;
//   • живые короткие реплики, теги в речи — по минимуму (озвучка).
//
// ЛОВУШКА «ГОЛОВА». У робота есть голова, а head страницы — не голова, а паспорт.
// Поэтому в речи у Bob нет «головы», а head везде — «паспорт страницы».
// Робот — для крючка и финала; структура разбирается на настоящей странице.
//
// ОДНА МОДЕЛЬ ДОКУМЕНТА. Документ — это { order, title, text }: порядок строк
// (FULL_DOC и его варианты) и два текста. Из неё строятся код (CodeLines),
// дерево структуры (Tree), коробка (Fig) и мини-браузер — поэтому после любого
// действия они не расходятся.
//
// ПОМОЩЬ. Лесенка из трёх ступеней: 1 — направить внимание, 2 — назвать
// принцип, 3 — помочь с конкретным действием (только тогда загорается место).
// После 3-й ступени — новый короткий пример того же типа.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you». Файл собирается
// скриптом tools/robot/robot.build.mjs.
// =============================================================================

const META = {
  lessonId: 'test-html-struktura-robot',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'HTML hujjat tuzilishi: robot Bob',
    ru: 'Структура HTML-документа: робот Bob',
    en: 'HTML document structure: robot Bob'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    out[l] = s;
  });
  return out;
};

// Игра «Битва знаний» — страница, которую показывает Bob и которую разбирает урок.
const SAMPLE = {
  title: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  text: L3('Salom! O‘yinga xush kelibsiz!', 'Привет! Добро пожаловать в игру!', 'Hi! Welcome to the game!')
};

const UI = {
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  page: L3('Sahifa', 'Страница', 'Page'),
  window: L3('Oyna', 'Окно', 'Window'),
  code: L3('Kod', 'Код', 'Code'),
  volume: L3('Hajm', 'Объём', 'Volume'),
  inspector: L3('Tuzilma qoidasi', 'Правило структуры', 'Structure rule'),
  changeTitle: L3('Nomni o‘zgartirish', 'Поменять название', 'Change the name'),
  changeText: L3('Matnni o‘zgartirish', 'Поменять текст', 'Change the text'),
  was: L3('Oldin', 'Было', 'Before'),
  now: L3('Hozir', 'Сейчас', 'Now'),
  erase: L3('So‘zni o‘chirish', 'Стереть слово', 'Erase a word'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  remove: L3('Qatorni olib tashlash', 'Убрать строку', 'Remove the line'),
  author: L3('Muallif', 'Автор', 'Author'),
  saveNote: L3('U darsni tugatganingizda natija bilan birga saqlanadi.', 'Она сохранится вместе с результатом, когда урок будет завершён.', 'It will be saved with your result when you finish the lesson.'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Katta sarlavha va xatboshilar qo‘shamiz', 'Добавим большой заголовок и абзацы', 'We add a big heading and paragraphs'),
  hintN: L3('Maslahat', 'Подсказка', 'Hint'),
  again: L3('yangi misol', 'новый пример', 'new example'),
  labels: { start: L3('Boshlanish', 'Начало', 'Start'), content: L3('Mazmun', 'Содержимое', 'Content'), end: L3('Oxiri', 'Конец', 'End') },
  pieces: L3('Qismlar', 'Детали', 'Pieces'),
  piece: { head: '<head>…</head>', body: '<body>…</body>', title: '<title>…</title>' },
  dragTip: L3('Detalni kodga sudrang yoki bosing, keyin joyni tanlang', 'Перетащи деталь в код — или нажми на неё, потом на место', 'Drag a piece into the code, or tap it and then the place'),
  dragTitle: L3('title qatorini head ichiga sudrang yoki bosing, keyin joyni tanlang', 'Перетащи строку title внутрь head — или нажми её, потом место', 'Drag the title line into head, or tap it and then the place'),
  here: L3('shu yerga: head ichiga', 'сюда: внутрь head', 'here: into head'),
  intoHtml: L3('html ichiga', 'внутрь html', 'into html'),
  intoHead: L3('head ichiga', 'внутрь head', 'into head'),
  intoBody: L3('body ichiga', 'внутрь body', 'into body'),
  pageText: L3('sahifa matni', 'текст страницы', 'page text'),
  slot: L3('joy', 'место', 'slot'),
  swapNote: L3('Qatorni bosing, keyin boshqasini — ular joy almashadi. Tanlangan qatorni olib tashlash mumkin.', 'Нажми строку, потом другую — они поменяются местами. Выбранную строку можно убрать.', 'Tap a line, then another: they swap places. A chosen line can be removed.'),
  noTags: L3('Bu yerga faqat so‘zlar, burchaklarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no angle brackets.'),
  ideas: L3('G‘oyalar', 'Идеи', 'Ideas'),
  goal: L3('Buyurtma', 'Заказ', 'Order'),
  scheme: L3('Tuzilma', 'Структура', 'Structure'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  // Робот Bob
  robot: L3('Robot Bob: korpus, ekran, qo‘llar, oyoqlar, antenna', 'Робот Bob: корпус, экран, руки, ноги, антенна', 'Robot Bob: case, screen, arms, legs, antenna'),
  bob: L3('Bob', 'Bob', 'Bob'),
  layers: {
    html: { name: 'HTML', sub: L3('Detallar', 'Детали', 'Parts') },
    css: { name: 'CSS', sub: L3('Ko‘rinish', 'Вид', 'Look') },
    js: { name: 'JavaScript', sub: L3('Harakat', 'Движение', 'Moves') }
  },
  scr2: L3('1-savol', 'Вопрос 1', 'Question 1'),
  gameQ: L3('1-savol: o‘rgimchakning nechta oyog‘i bor?', 'Вопрос 1: сколько ног у паука?', 'Question 1: how many legs does a spider have?'),
  openScreen: L3('Ekranni ochish', 'Открыть экран', 'Open the screen'),
  passport: L3('Pasport: sahifa nomi va sozlamalari', 'Паспорт: название и настройки страницы', 'Passport: the page name and settings')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения, одна мысль. Похвала — эмоция
// и что получилось (банк — навык novyy-urok, pohvala.md). Теги в речи — только
// там, где без них нельзя. Звучат: say, cast, on, ok, miss, h1–h3 …;
// печатаются: eyebrow, ask, btn, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  r1: {
    eyebrow: L3('Robot Bob', 'Робот Bob', 'Robot Bob'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men Kodi, dasturchi robotman. Bu mening loyiham — robot Bob. Hozircha u ko‘rinmayapti.',
        'Привет! Я Коди, робот-программист. А это мой проект — робот Bob. Пока его не видно.',
        'Hi! I’m Kodi, a programmer robot. This is my project, robot Bob. You can’t see him yet.') },
      { pose: 'point', text: L3('Bob uch qatlamdan yig‘ilgan. Ularni navbat bilan yoqing!',
        'Bob собран из трёх слоёв. Включи их по очереди!',
        'Bob is built from three layers. Turn them on one by one!') }
    ],
    on: {
      html: L3('Voy, detallar paydo bo‘ldi: korpus, ekran, qo‘llar, oyoqlar! Bu HTML — Bob nimadan yasalgani.',
        'Ого, появились детали: корпус, экран, руки, ноги! Это HTML — из чего Bob сделан.',
        'Whoa, the parts appeared: the case, screen, arms and legs! That’s HTML: what Bob is made of.'),
      css: L3('Endi Bob rangli! Bu CSS — tashqi ko‘rinish.',
        'Теперь Bob цветной! Это CSS — внешний вид.',
        'Now Bob has colours! That’s CSS: the look.'),
      js: L3('Mana endi Bob sizga qo‘l silkitayapti! Bu JavaScript — harakat.',
        'А теперь Bob машет тебе! Это JavaScript — движения.',
        'And now Bob is waving at you! That’s JavaScript: the moves.')
    },
    done: L3('Har bir sayt ham shunday tuzilgan: detallar, ko‘rinish, harakat. Asosiysi — HTML: usiz hech narsa yo‘q. Shundan boshlaymiz!',
      'Так устроен и каждый сайт: детали, вид, движение. Главное — HTML: без него ничего нет. С него и начнём!',
      'Every website works the same way: parts, look, moves. The key one is HTML: without it there’s nothing. That’s where we start!'),
    off: L3('Ko‘rdingizmi? HTML siz Bob butunlay yo‘qoldi.', 'Видишь? Без HTML исчез весь Bob.', 'See? Without HTML, all of Bob is gone.'),
    ask: L3('Qatlamlarni navbat bilan yoqing', 'Включи слои по очереди', 'Turn the layers on one by one'),
    askOne: L3('«{x}» qatlamini yoqing', 'Включи слой «{x}»', 'Turn on the “{x}” layer'),
    askDone: L3('Qatlamlarni o‘chirib-yoqib ko‘ring', 'Слои можно выключать и включать', 'You can switch the layers off and on')
  },

  r2: {
    eyebrow: L3('Bob ekrani', 'Экран Bob', 'Bob’s screen'),
    say: L3('Bobning ko‘kragida ekran bor, unda «Bilimlar jangi» o‘yini. Ekranni bosing — ichiga qaraymiz!',
      'На груди у Bob экран, а на нём игра «Битва знаний». Нажми на экран — заглянем внутрь!',
      'Bob has a screen on his chest with the game “Battle of Knowledge”. Tap the screen and let’s look inside!'),
    page: L3('Bu oddiy veb-sahifa! Tepada — yorliqdagi nom, pastda — o‘yinning o‘zi.',
      'Это обычная веб-страница! Сверху — название на вкладке, ниже — сама игра.',
      'It’s a normal web page! The name is on the tab at the top, the game itself is below.'),
    code: L3('Yonida esa uning kodi — brauzer uchun ko‘rsatmali matn. Brauzer uni o‘qib, sahifani chizadi. Ranglar yo‘q — bu faqat HTML.',
      'А рядом — её код: текст с подсказками для браузера. Браузер читает его и рисует страницу. Цветов нет — это только HTML.',
      'And next to it is its code: text with instructions for the browser. The browser reads it and draws the page. No colours: this is just HTML.'),
    done: L3('Internetdagi har bir sayt shunday yozilgan. Bugun siz ham o‘rganasiz — oxirida Bob ekranida sizning sahifangiz bo‘ladi!',
      'Каждый сайт в интернете написан так. Сегодня научишься и ты — а в конце на экране Bob будет твоя страница!',
      'Every website on the internet is written like this. Today you’ll learn how, and at the end Bob’s screen will show your page!'),
    ask: L3('Bob ekranini bosing', 'Нажми на экран Bob', 'Tap Bob’s screen'),
    askDone: L3('Bu sahifa kodi. Dars oxirida har bir qatorini tushunasiz', 'Это код страницы. К концу урока будет понятна каждая строчка', 'This is the page’s code. By the end you’ll understand every line')
  },

  m: {
    eyebrow: L3('Bizning reja', 'Наш план', 'Our plan'),
    say: L3('Mana rejamiz — uch qadam.', 'Вот наш план — три шага.', 'Here’s our plan: three steps.'),
    steps: [
      { icon: 'doc', text: L3('Sahifa ichiga qarash', 'Заглянуть внутрь страницы', 'Look inside a page'),
        say: L3('Avval sahifa ichiga qarab, u qanday qismlardan iboratligini bilib olamiz.',
          'Сначала заглянем внутрь страницы и узнаем, из каких частей она состоит.',
          'First we look inside a page and find out what parts it has.') },
      { icon: 'listN', text: L3('Konstruktordek yig‘ish', 'Собрать как конструктор', 'Build it like a kit'),
        say: L3('Keyin sahifani qismlardan konstruktordek yig‘amiz.',
          'Потом соберём страницу из частей, как конструктор.',
          'Then we put a page together from parts, like a kit.') },
      { icon: 'browser', text: L3('Sahifangiz Bob ekranida', 'Своя страница на экране Bob', 'Your page on Bob’s screen'),
        say: L3('Oxirida o‘z sahifangizni yasaysiz — va u Bob ekranida chiqadi!',
          'А в конце сделаешь свою страницу — и она появится на экране Bob!',
          'And at the end you’ll make your own page, and it will appear on Bob’s screen!') }
    ],
    done: L3('Reja tayyor! Endi doim yordam beradigan ikki tugmani ko‘rsataman.',
      'План готов! Теперь покажу две кнопки, которые всегда выручат.',
      'The plan is ready! Now let me show you two buttons that always help.'),
    coach: [
      { id: 'hint', sel: '.chrome-side .ctl-hint', icon: 'bulb',
        title: L3('«Maslahat» tugmasi', 'Кнопка «Подсказка»', 'The “Hint” button'),
        text: L3('Nima qilishni bilmasangiz, shu yerni bosing — aytib beraman. Hoziroq bosib ko‘ring!',
          'Не знаешь, что делать? Жми сюда — подскажу. Попробуй прямо сейчас!',
          'Not sure what to do? Tap here and I’ll help. Try it right now!') },
      { id: 'pause', sel: '.chrome-side .ctl-btn:not(.is-exit):not(.ctl-hint)', icon: 'pause',
        title: L3('«Pauza» tugmasi', 'Кнопка «Пауза»', 'The “Pause” button'),
        text: L3('Chalg‘ish kerakmi? «Pauza»ni bosing. Sinab ko‘ring!',
          'Нужно отвлечься? Жми «Паузу». Попробуй!',
          'Need a break? Tap “Pause”. Try it!'),
        text2: L3('Dars pauzada. Yana bosing — davom etamiz.',
          'Урок на паузе. Нажми ещё раз — и продолжим.',
          'The lesson is paused. Tap again and we’ll carry on.') }
    ],
    hintSay: L3('Mana shunday: maslahat doim nima qilishni aytadi.', 'Вот так: подсказка всегда скажет, что делать.', 'Like that: the hint always tells you what to do.'),
    ready: L3('Zo‘r, hammasi tayyor! Ketdik!', 'Отлично, всё готово! Поехали!', 'Great, all set! Let’s go!'),
    ask: L3('Rejani tinglang', 'Послушай план', 'Listen to the plan')
  },

  s1: {
    eyebrow: L3('Ikki yozuv', 'Две надписи', 'Two labels'),
    say: L3('Har bir sahifada ikkita yozuv bor: yorliqdagi nom va oynadagi matn. Istalganini o‘zgartiring!',
      'У каждой страницы есть две надписи: название на вкладке и текст в окне. Поменяй любую!',
      'Every page has two labels: the name on the tab and the text in the window. Change either one!'),
    done: L3('Ana! Sahifa o‘zgardi. Endi bu ichkaridan qanday ishlashini bilib olamiz.',
      'Есть! Страница поменялась. Сейчас узнаем, как это работает изнутри.',
      'Yes! The page changed. Now let’s find out how it works inside.'),
    titles: [L3('Futbol viktorinasi', 'Футбольная викторина', 'Football quiz'), L3('Kosmos o‘yini', 'Космическая игра', 'Space game'), L3('Mening saytim', 'Мой сайт', 'My site')],
    texts: [L3('O‘yin boshlandi!', 'Игра началась!', 'The game has started!'), L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'), L3('Kim birinchi?', 'Кто первый?', 'Who’s first?')],
    ask: L3('Nimani o‘zgartiramiz?', 'Что поменяем?', 'What shall we change?'),
    askPick: L3('Variantni tanlang', 'Выбери вариант', 'Choose an option'),
    askDone: L3('Yana sinab ko‘ring yoki «Keyingi»ni bosing', 'Попробуй ещё или нажми «Дальше»', 'Try another one or tap “Next”')
  },

  s2: {
    eyebrow: L3('Nom kodda', 'Название в коде', 'The name in code'),
    say: L3('Nom kodda mana shunday yozilgan. Qatorning har bir qismini bosing.',
      'Вот как название записано в коде. Нажми на каждую часть строки.',
      'Here’s how the name is written in code. Tap each part of the line.'),
    parts: {
      start: L3('Bu ochuvchi teg — boshlanish. U brauzerga aytadi: shu yerda sahifa nomi boshlanadi.',
        'Это открывающий тег — начало. Он говорит браузеру: здесь начинается название страницы.',
        'This is the opening tag, the start. It tells the browser: the page name starts here.'),
      content: L3('Bu esa nomning o‘zi. Aynan u yorliqda ko‘rinadi — qarang!',
        'А это само название. Его и видно на вкладке — смотри!',
        'And this is the name itself. That’s what shows on the tab. Look!'),
      end: L3('Bu yopuvchi teg — oxiri. Xuddi o‘sha so‘z, faqat qiya chiziq bilan.',
        'Это закрывающий тег — конец. То же слово, только с косой чертой.',
        'This is the closing tag, the end. The same word, but with a slash.')
    },
    phase2: L3('Teglar — brauzer uchun ko‘rsatma, sahifada ular ko‘rinmaydi. Endi yangi qator: belgini tanlang, keyin qator qismini.',
      'Теги — подсказки для браузера, на странице их не видно. Теперь новая строка: выбери подпись, потом часть строки.',
      'Tags are instructions for the browser; you don’t see them on the page. Now a new line: choose a label, then a part of the line.'),
    ok: {
      start: L3('Ana! Boshlanish — qiya chiziqsiz teg.', 'Есть! Начало — тег без косой черты.', 'Yes! The start is the tag without a slash.'),
      content: L3('Aniq! Mazmun — teglar orasida.', 'Точно! Содержимое — между тегами.', 'Spot on! The content sits between the tags.'),
      end: L3('Aynan nishonga! Oxiri — qiya chiziqli teg.', 'В точку! Конец — тег с косой чертой.', 'Nailed it! The end is the tag with a slash.')
    },
    miss: {
      start: L3('Deyarli! Bu yozuvda qiya chiziq yo‘q — demak, bu boshlanish.', 'Почти! В этой записи нет косой черты — значит, это начало.', 'Almost! This one has no slash, so it’s the start.'),
      content: L3('Deyarli! Bu burchaksiz matn — demak, bu mazmun.', 'Почти! Это текст без уголков — значит, это содержимое.', 'Almost! This is text without angle brackets, so it’s the content.'),
      end: L3('Deyarli! Bu yozuvda qiya chiziq bor — demak, bu oxiri.', 'Почти! В этой записи есть косая черта — значит, это конец.', 'Almost! This one has a slash, so it’s the end.')
    },
    h1: L3('Burchaklar va qiya chiziqqa qarang.', 'Посмотри на уголки и косую черту.', 'Look at the angle brackets and the slash.'),
    h2: L3('Boshlanish va oxiri — burchakli teglar. Mazmun ular orasida.', 'Начало и конец — теги в уголках. Содержимое — между ними.', 'Start and end are tags in brackets. The content is between them.'),
    h3: L3('«Oxiri» — o‘ngdagi, qiya chiziqli yozuv.', '«Конец» — запись справа, с косой чертой.', '“End” is the one on the right, with the slash.'),
    done: L3('Zo‘r-ku! Boshlanish, mazmun, oxiri — sahifaning har bir qismi shunday tuzilgan.',
      'Огонь! Начало, содержимое, конец — так устроена каждая часть страницы.',
      'Awesome! Start, content, end: every part of a page is built like this.'),
    askA: L3('Qatorning har bir qismini bosing', 'Нажми на каждую часть строки', 'Tap each part of the line'),
    askB: L3('Belgini tanlang, keyin qismni', 'Выбери подпись, потом часть', 'Choose a label, then a part'),
    askFollow: L3('Yana bir qator: belgilarni qo‘ying', 'Ещё строка: расставь подписи', 'One more line: place the labels')
  },

  s3: {
    eyebrow: L3('Sahifa ichida', 'Внутри страницы', 'Inside the page'),
    say: L3('Bu sahifa modeli — xuddi quti. Uni oching: qopqoqni bosing!',
      'Это модель страницы — как коробка. Открой её: нажми на крышку!',
      'This is a model of the page, like a box. Open it: tap the lid!'),
    html: L3('Butun quti — bu html: unda butun sahifa. Ichida ikki bo‘lim bor.',
      'Вся коробка — это html: в ней вся страница целиком. Внутри — два отделения.',
      'The whole box is html: the entire page is inside it. There are two sections inside.'),
    head: L3('head — sahifa pasporti. Oynada u ko‘rinmaydi, lekin unda sahifa nomi saqlanadi.',
      'head — паспорт страницы. В окне его не видно, но в нём хранится название.',
      'head is the page’s passport. You don’t see it in the window, but the name is kept in it.'),
    title: L3('Mana u! title — yorliq uchun nom. Yorliq yorishganini ko‘rdingizmi?',
      'Вот оно! title — название для вкладки. Видишь, вкладка подсветилась?',
      'There it is! title is the name for the tab. See the tab light up?'),
    body: L3('body — sahifa tanasi: oynada ko‘rinadigan hamma narsa. Matn, rasm, tugmalar — hammasi shu yerda.',
      'body — тело страницы: всё, что видно в окне. Текст, картинки, кнопки — всё здесь.',
      'body is the page’s body: everything you see in the window. Text, pictures, buttons: it all goes here.'),
    doctype: L3('Bu har bir sahifaning birinchi qatori. U doim bir xil va brauzerga aytadi: bu HTML sahifa.',
      'Это первая строка любой страницы. Она всегда одинаковая и говорит браузеру: это HTML-страница.',
      'This is the first line of every page. It’s always the same and tells the browser: this is an HTML page.'),
    needHead: L3('title head ichida yotadi. Avval head ni oching.', 'title лежит внутри head. Сначала открой head.', 'title lies inside head. Open head first.'),
    done: L3('Super! html — butun sahifa, head — nom yozilgan pasport, body — oynadagi hamma narsa.',
      'Супер! html — вся страница, head — паспорт с названием, body — всё, что в окне.',
      'Super! html is the whole page, head is the passport with the name, body is everything in the window.'),
    next: {
      html: L3('Qopqoqni bosing', 'Нажми на крышку', 'Tap the lid'),
      head: L3('head bo‘limini oching', 'Открой отделение head', 'Open the head section'),
      title: L3('title kartochkasini bosing', 'Нажми на карточку title', 'Tap the title card'),
      body: L3('body bo‘limini oching', 'Открой отделение body', 'Open the body section')
    },
    ask: L3('Sahifa qutisini oching', 'Открой коробку страницы', 'Open the page box'),
    askDone: L3('Hammasi ochildi! Qismlarni yana bosish mumkin', 'Всё открыто! Части можно нажимать ещё', 'All open! You can tap the parts again')
  },

  s4: {
    eyebrow: L3('O‘yin nomi', 'Имя игры', 'Name the game'),
    say: L3('title ichidagi nomni o‘zgartiring: tayyorini tanlang yoki o‘zingiz yozing. Yorliqqa qarang!',
      'Поменяй название внутри title: выбери готовое или напиши своё. Смотри на вкладку!',
      'Change the name inside title: pick one or type your own. Watch the tab!'),
    done: L3('Voy, yorliq yangi nom oldi! Nom title dan olinadi, oyna esa o‘zgarmadi.',
      'Вау, у вкладки новое имя! Его берут из title, а окно не изменилось.',
      'Wow, the tab has a new name! It comes from title, and the window didn’t change.'),
    opts: [L3('Mening o‘yinim', 'Моя игра', 'My game'), L3('Futbol viktorinasi', 'Футбольная викторина', 'Football quiz'), L3('Kosmos klubi', 'Клуб космоса', 'Space club')],
    ask: L3('title ichidagi nomni o‘zgartiring', 'Измени название внутри title', 'Change the name inside title')
  },

  s5: {
    eyebrow: L3('O‘yinchilarga', 'Игрокам', 'To the players'),
    say: L3('Endi body. Uning ichidagi hamma narsa oynada ko‘rinadi. O‘yinchilarga salom yozing: so‘zlarni bosing yoki yozing.',
      'Теперь body. Всё, что внутри него, видно в окне. Напиши игрокам приветствие: нажимай слова или печатай.',
      'Now body. Everything inside it shows in the window. Write a greeting to the players: tap words or type.'),
    done: L3('Ana! Matn oynada paydo bo‘ldi. Sahifani ochgan har kim uni ko‘radi.',
      'Есть! Текст появился в окне. Его увидит каждый, кто откроет страницу.',
      'Yes! The text appeared in the window. Everyone who opens the page will see it.'),
    words: [L3('Salom!', 'Привет!', 'Hi!'), L3('Bu', 'Это', 'This'), L3('mening', 'моя', 'is my'), L3('o‘yinim.', 'игра.', 'game.'), L3('Kim', 'Кто', 'Who'), L3('birinchi?', 'первый?', 'is first?'), L3('Boshladik!', 'Поехали!', 'Let’s go!')],
    ask: L3('body ichiga sahifa matnini yozing', 'Напиши текст страницы внутри body', 'Write the page text inside body')
  },

  s6: {
    eyebrow: L3('Oldin taxmin', 'Угадай заранее', 'Guess first'),
    rounds: {
      title: { want: 'tab', text: L3('Sport', 'Спорт', 'Sports'), extra: L3('Musiqa', 'Музыка', 'Music'),
        ask: L3('title ichida «{t}» bo‘ladi. Bu so‘z qayerda chiqadi?', 'В title будет «{t}». Где появится это слово?', 'title will say “{t}”. Where will this word appear?') },
      body: { want: 'page', text: L3('Bugun final!', 'Сегодня финал!', 'The final is today!'), extra: L3('Men chizishni yaxshi ko‘raman.', 'Я люблю рисовать.', 'I love drawing.'),
        ask: L3('body ichida «{t}» bo‘ladi. Bu matn qayerda chiqadi?', 'В body будет «{t}». А где появится этот текст?', 'body will say “{t}”. Where will this text appear?') }
    },
    say: L3('Avval taxmin qiling, keyin ishga tushiramiz!', 'Сначала угадай, потом запустим!', 'Guess first, then we run it!'),
    okTab: L3('Aniq! title yorliqni o‘zgartirdi, oynaga tegmadi.', 'Точно! title поменял вкладку, а окно не тронул.', 'Spot on! title changed the tab and left the window alone.'),
    okPage: L3('Aynan nishonga! body dagi matn — oynada, yorliq o‘sha-o‘sha.', 'В точку! Текст из body — в окне, вкладка прежняя.', 'Nailed it! The text from body is in the window; the tab stayed the same.'),
    missTab: L3('Qarang: so‘z yorliqqa tushdi. title — yorliq nomi. Yana bir misol!', 'Смотри: слово попало на вкладку. title — это имя вкладки. Ещё пример!', 'Look: the word went to the tab. title is the tab’s name. One more!'),
    missPage: L3('Qarang: matn oynada chiqdi. body — oynadagi narsa. Yana bir misol!', 'Смотри: текст появился в окне. body — это то, что в окне. Ещё пример!', 'Look: the text appeared in the window. body is what’s in the window. One more!'),
    done: L3('Aniq! title — yorliq uchun, body — oyna uchun.', 'Чётко! title — для вкладки, body — для окна.', 'Spot on! title is for the tab, body is for the window.')
  },

  s7: {
    eyebrow: L3('Konstruktor', 'Конструктор', 'Build kit'),
    say: L3('Endi sahifani konstruktordek yig‘ing: detalni tanlang, keyin uning joyini.',
      'Теперь собери страницу, как конструктор: выбери деталь, потом её место.',
      'Now build the page like a kit: choose a piece, then its place.'),
    ok: {
      head: L3('Ana! head — html qutisida.', 'Есть! head — в коробке html.', 'Yes! head is in the html box.'),
      body: L3('Klass! body — html ichida, head dan keyin.', 'Класс! body — в html, после head.', 'Cool! body is in html, after head.'),
      title: L3('Aynan nishonga! title — head pasportida.', 'В точку! title — в паспорте head.', 'Nailed it! title is in the head passport.')
    },
    titleBody: L3('Deyarli! Yorliq nomi oynada ko‘rinmaydi — demak, body ga emas. Pasportni qidiring — head.',
      'Почти! Название вкладки не видно в окне — значит, не в body. Ищи паспорт — head.',
      'Almost! The tab name isn’t shown in the window, so not in body. Look for the passport: head.'),
    titleHtml: L3('Deyarli! title qutiga to‘g‘ridan-to‘g‘ri emas, bo‘limga qo‘yiladi. Qaysi biri pasport?',
      'Почти! title кладут не прямо в коробку, а в отделение. Какое из них — паспорт?',
      'Almost! title doesn’t go straight into the box but into a section. Which one is the passport?'),
    bodyFirst: L3('html ichida avval head, body esa undan keyin.', 'В коробке сначала идёт head, а body — после него.', 'In the box, head comes first and body after it.'),
    nested: L3('head va body — ikki alohida bo‘lim, ikkalasi to‘g‘ridan-to‘g‘ri html ichida.', 'head и body — два отдельных отделения, оба прямо в html.', 'head and body are two separate sections, both straight inside html.'),
    noPlace: L3('Bu bo‘lim hali yo‘q. Avval uni qo‘ying.', 'Этого отделения пока нет. Сначала поставь его.', 'That section isn’t there yet. Put it in first.'),
    pickFirst: L3('Avval detalni tanlang.', 'Сначала выбери деталь.', 'Choose a piece first.'),
    done: L3('Yig‘ildi! Qoyil! Endi «Hajm» va «Kod» ni almashtirib solishtiring.',
      'Собрано! Вот это да! Теперь переключай «Объём» и «Код» и сравнивай.',
      'Built! Look at that! Now switch between “Volume” and “Code” and compare.'),
    h1: L3('Qaysi bo‘lim — nomli pasport, qaysi biri oynada ko‘rinadi?', 'Какое отделение — паспорт с названием, а какое видно в окне?', 'Which section is the passport with the name, and which shows in the window?'),
    h2: L3('head va body — html ichida (avval head). title — head ichida.', 'head и body — внутри html (сначала head). title — внутри head.', 'head and body go inside html (head first). title goes inside head.'),
    h3: L3('Hozir: {p}', 'Сейчас: {p}', 'Now: {p}'),
    hintAsk: L3('Qaysi bo‘lim — sahifa pasporti?', 'Какое отделение — паспорт страницы?', 'Which section is the page’s passport?'),
    ask: L3('Detalni tanlang, keyin joyini', 'Выбери деталь, потом место', 'Choose a piece, then its place'),
    askPlace: L3('Endi joyni tanlang', 'Теперь выбери место', 'Now choose the place'),
    askDone: L3('Qismni tanlang — u ikkala ko‘rinishda ham belgilanadi', 'Выбери часть — она выделится в обоих видах', 'Choose a part: it stays selected in both views')
  },

  s8: {
    eyebrow: L3('Juftlar', 'Пары', 'Pairs'),
    say: L3('Har bir ochuvchi tegning jufti bor — yopuvchi teg. Ochuvchini bosing, keyin uning juftini.',
      'У каждого открывающего тега есть пара — закрывающий. Нажми открывающий, потом его пару.',
      'Every opening tag has a partner: the closing tag. Tap an opening tag, then its partner.'),
    area: {
      html: L3('html va uning jufti orasida — butun sahifa.', 'Между html и его парой — вся страница.', 'Between html and its partner: the whole page.'),
      head: L3('head va uning jufti orasida — sahifa pasporti.', 'Между head и его парой — паспорт страницы.', 'Between head and its partner: the page’s passport.'),
      title: L3('title va uning jufti orasida — yorliq nomi.', 'Между title и его парой — название вкладки.', 'Between title and its partner: the tab name.'),
      body: L3('body va uning jufti orasida — oynadagi hamma narsa.', 'Между body и его парой — всё, что видно в окне.', 'Between body and its partner: everything in the window.')
    },
    closeFirst: L3('Bu yopuvchi teg — unda qiya chiziq bor. Avval ochuvchisini bosing.', 'Это закрывающий тег — в нём косая черта. Сначала нажми открывающий.', 'That’s a closing tag: it has a slash. Tap the opening one first.'),
    otherPair: L3('Deyarli! Bu {b}, siz esa {a} dan boshladingiz. Nomlar bir xil bo‘lishi kerak.', 'Почти! Это {b}, а начали с {a}. Имена должны совпадать.', 'Almost! That’s {b}, but you started with {a}. The names must match.'),
    twoOpen: L3('Bu ham ochuvchi teg. Juftida qiya chiziq bo‘ladi.', 'Это тоже открывающий тег. У пары будет косая черта.', 'This is an opening tag too. Its partner has a slash.'),
    picked: L3('Endi uning yopuvchi juftini toping', 'Теперь найди его закрывающую пару', 'Now find its closing partner'),
    done: L3('To‘rtta juft topildi! Ko‘rdingizmi — ular qutilardek bir-birining ichida.', 'Все четыре пары найдены! Видишь — они вложены друг в друга, как коробки.', 'All four pairs found! See? They sit inside each other like boxes.'),
    ask: L3('Ochuvchi tegni, keyin juftini bosing', 'Нажми открывающий тег, потом его пару', 'Tap an opening tag, then its partner')
  },

  s9: {
    eyebrow: L3('Kodi adashdi', 'Коди перепутал', 'Kodi mixed it up'),
    say: L3('Voy! Nomni boshqa joyga qo‘yib qo‘yganga o‘xshayman. Yordam berasizmi?', 'Ой! Кажется, я положил название не туда. Поможешь?', 'Oops! I think I put the name in the wrong spot. Can you help?'),
    rule: L3('title doim head ichida turadi', 'title всегда лежит внутри head', 'title always sits inside head'),
    pickTitle: L3('Avval title qatorini tanlang', 'Сначала выбери строку title', 'First choose the title line'),
    pickPlace: L3('Endi head ichidagi joyni tanlang', 'Теперь выбери место внутри head', 'Now choose a place inside head'),
    inBody: L3('Bu body — unda oynada ko‘rinadigan narsa. Nom esa pasportda yashaydi.', 'Это body — там то, что видно в окне. А название живёт в паспорте.', 'That’s body: it holds what shows in the window. The name lives in the passport.'),
    inHtml: L3('Bu to‘g‘ridan-to‘g‘ri html qutisi. Pasport qaysi bo‘limda?', 'Это прямо коробка html. В каком отделении паспорт?', 'That’s straight in the html box. Which section is the passport?'),
    h1: L3('Qoida paneliga qarang.', 'Посмотри на панель правила.', 'Look at the rule panel.'),
    h2: L3('title — sahifa nomi, u head pasportida yashaydi.', 'title — название страницы, оно живёт в паспорте head.', 'title is the page name; it lives in the head passport.'),
    h3: L3('<head> qatorini bosing — title uning ichiga o‘tadi.', 'Нажми строку <head> — title переедет внутрь.', 'Tap the <head> line: title moves inside.'),
    ok: L3('Rahmat, hammasi joyida! Kod va sxema birga yangilandi.', 'Спасибо, всё на месте! Код и схема обновились вместе.', 'Thanks, everything’s in place! The code and the diagram updated together.'),
    again: L3('Yana bir hujjat — endi navbat sizda.', 'Ещё один документ — теперь твоя очередь.', 'One more document: your turn now.'),
    ask: L3('title ni head ga o‘tkazing', 'Перенеси title в head', 'Move title into head')
  },

  s10: {
    eyebrow: L3('Oxirini yozing', 'Допиши конец', 'Write the end'),
    say: L3('Matn tayyor. Endi body qayerda tugashini ko‘rsatamiz: yopuvchi tegni yozing.',
      'Текст уже есть. Теперь покажем, где кончается body: допиши закрывающий тег.',
      'The text is there. Now let’s show where body ends: type the closing tag.'),
    sayHead: L3('Endi head qayerda tugashini ko‘rsating.', 'Теперь покажи, где кончается head.', 'Now show where head ends.'),
    open: L3('Bu ochuvchi teg. Bizga yopuvchisi kerak — qiya chiziq bilan.', 'Это открывающий тег. А нужен закрывающий — с косой чертой.', 'That’s an opening tag. We need the closing one, with a slash.'),
    noSlash: L3('Deyarli! Qiya chiziq yetishmayapti.', 'Почти! Не хватает косой черты.', 'Almost! The slash is missing.'),
    noBracket: L3('Deyarli! Burchak yetishmayapti.', 'Почти! Не хватает уголка.', 'Almost! An angle bracket is missing.'),
    slashPlace: L3('Deyarli! Qiya chiziq boshqa joyda: u «<» dan keyin darhol turadi.', 'Почти! Косая черта стоит не там: её место сразу после «<».', 'Almost! The slash is in the wrong spot: it goes right after “<”.'),
    otherName: L3('Bu boshqa nom. Bizga {tag} kerak.', 'Это другое имя. Нам нужен {tag}.', 'That’s a different name. We need {tag}.'),
    h1: L3('Yuqoridagi ochuvchi tegga qarang.', 'Посмотри на открывающий тег выше.', 'Look at the opening tag above.'),
    h2: L3('Yopuvchi teg ochuvchisiga o‘xshaydi, faqat qiya chiziq bilan.', 'Закрывающий тег похож на открывающий, только с косой чертой.', 'A closing tag looks like the opening one, only with a slash.'),
    h3: L3('Qiya chiziq «<» dan keyin darhol turadi.', 'Косая черта стоит сразу после «<».', 'The slash comes right after “<”.'),
    ok: L3('Bomba! body yopildi — brauzer endi uning oxirini biladi.', 'Бомба! body закрыт — теперь браузер знает, где его конец.', 'Boom! body is closed: now the browser knows where it ends.'),
    okHead: L3('head ham yopildi! Aniq!', 'И head закрыт! Чётко!', 'head is closed too! Spot on!'),
    ask: L3('Bo‘sh joyga body ning yopuvchi tegini yozing', 'Допиши закрывающий тег body в пустое место', 'Type the closing body tag in the empty place'),
    askHead: L3('Bo‘sh joyga head ning yopuvchi tegini yozing', 'Допиши закрывающий тег head в пустое место', 'Type the closing head tag in the empty place')
  },

  s12: {
    eyebrow: L3('O‘yinchilardan buyurtma', 'Заказ от игроков', 'An order from players'),
    say: L3('O‘yinchilardan buyurtma keldi! Faqat so‘ralgan narsani o‘zgartiring.', 'Пришёл заказ от игроков! Поменяй только то, что просят.', 'Players sent an order! Change only what they ask for.'),
    tasks: [
      { id: 'title', goal: L3('Faqat yorliq nomini o‘zgartiring: «{t}»', 'Измени только название вкладки: «{t}»', 'Change only the tab name: “{t}”'),
        t: L3('Bilimlar jangi 2', 'Битва знаний 2', 'Battle of Knowledge 2'), tB: L3('Mening uy hayvonim', 'Мой питомец', 'My pet') },
      { id: 'text', goal: L3('Faqat oynadagi matnni o‘zgartiring: «{t}»', 'Измени только текст в окне: «{t}»', 'Change only the text in the window: “{t}”'),
        t: L3('Final juma kuni!', 'Финал в пятницу!', 'The final is on Friday!'), tB: L3('Men chizishni yaxshi ko‘raman.', 'Я люблю рисовать.', 'I love drawing.') }
    ],
    tag: L3('Bu teg — qism chegarasi. Tegni emas, matnni o‘zgartiramiz.', 'Это тег — граница части. Меняем текст, а не тег.', 'That’s a tag: the border of a part. We change the text, not the tag.'),
    wrongText: L3('Bu matn boshqa joyda ko‘rinadi. Buyurtmaga qarang.', 'Этот текст виден в другом месте. Посмотри на заказ.', 'This text shows somewhere else. Look at the order.'),
    typeIt: L3('Endi shu yerga yozing', 'Теперь напиши сюда', 'Now type it here'),
    h1t: L3('Kodda yorliq nomi qayerda beriladi?', 'Где в коде задаётся название вкладки?', 'Where in the code is the tab name set?'),
    h2t: L3('Yorliq nomi — title ichidagi matn.', 'Название вкладки — это текст внутри title.', 'The tab name is the text inside title.'),
    h3t: L3('<title> va </title> orasidagi matnni bosing.', 'Нажми на текст между <title> и </title>.', 'Tap the text between <title> and </title>.'),
    h1b: L3('Oynaning o‘zida nima ko‘rinadi?', 'Что видно в самом окне?', 'What shows in the window itself?'),
    h2b: L3('Oynadagi matn — body ichida.', 'Текст в окне — внутри body.', 'The text in the window is inside body.'),
    h3b: L3('<body> va </body> orasidagi matnni bosing.', 'Нажми на текст между <body> и </body>.', 'Tap the text between <body> and </body>.'),
    ok: L3('Ana! Buyurtma bajarildi, qolganiga tegilmadi.', 'Есть! Заказ выполнен, остальное не тронуто.', 'Yes! Order done, nothing else touched.'),
    again: L3('Super! Endi shunga o‘xshash buyurtma.', 'Супер! А теперь похожий заказ.', 'Super! Now a similar order.'),
    done: L3('Ikkala buyurtma bajarildi! O‘yinchilar xursand.', 'Оба заказа выполнены! Игроки довольны.', 'Both orders done! The players are happy.'),
    ask: L3('Kerakli matnni toping va o‘zgartiring', 'Найди нужный текст и измени его', 'Find the right text and change it')
  },

  s13: {
    eyebrow: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
    say: L3('Final yig‘ish! Qatorlarni tartib bilan qo‘ying. Birinchi qator allaqachon joyida.',
      'Финальная сборка! Расставь строки по порядку. Первая строка уже на месте.',
      'Final build! Put the lines in order. The first line is already in place.'),
    rules: {
      html: L3('Butun sahifa html ichida: u birinchi ochiladi va oxirida yopiladi.', 'Вся страница — внутри html: он открывается первым и закрывается последним.', 'The whole page is inside html: it opens first and closes last.'),
      pair: L3('Yopuvchi teg o‘z ochuvchisidan keyin turadi.', 'Закрывающий тег стоит после своего открывающего.', 'A closing tag comes after its opening tag.'),
      order: L3('Avval head — pasport, keyin body.', 'Сначала head — паспорт, потом body.', 'First head, the passport, then body.'),
      headClose: L3('head body boshlanishidan oldin yopiladi.', 'head закрывается до того, как начнётся body.', 'head closes before body starts.'),
      title: L3('title head ichida turadi.', 'title стоит внутри head.', 'title sits inside head.'),
      text: L3('Sahifa matni body ichida turadi.', 'Текст страницы стоит внутри body.', 'The page text sits inside body.')
    },
    fill: L3('Tuzilma to‘g‘ri! Endi nom va matnni o‘ylab toping.', 'Структура верная! Теперь придумай название и текст.', 'The structure is right! Now come up with a name and a text.'),
    done: L3('Ura! Sahifangiz tayyor!', 'Ура! Твоя страница готова!', 'Hooray! Your page is ready!'),
    h1: L3('Tashqi qism birinchi ochiladi.', 'Внешняя часть открывается первой.', 'The outer part opens first.'),
    h2: L3('html ichida: head (title bilan), keyin body (matn bilan).', 'Внутри html: head (с title), потом body (с текстом).', 'Inside html: head (with title), then body (with the text).'),
    h3: L3('Belgilangan qatorlarni almashtiring.', 'Поменяй местами отмеченные строки.', 'Swap the marked lines.'),
    ask: L3('Qatorlarni tartib bilan qo‘ying', 'Расставь строки по порядку', 'Put the lines in order'),
    askFill: L3('Nom va matnni yozing', 'Напиши название и текст', 'Write the name and the text')
  },

  s14: {
    eyebrow: L3('Sahifangiz Bob ekranida', 'Твоя страница на экране Bob', 'Your page on Bob’s screen'),
    say: L3('Qarang — sahifangiz Bob ekranida! Bu kuchli bo‘ldi! Endi sahifani teglardan yig‘a olasiz, xuddi haqiqiy veb-dasturchi kabi.',
      'Смотри — твоя страница на экране Bob! Это было мощно! Теперь ты умеешь собирать страницу из тегов, как настоящий веб-программист.',
      'Look, your page is on Bob’s screen! That was epic! Now you can build a page from tags, like a real web developer.'),
    ach: {
      place: { self: L3('Kerakli joyni o‘zingiz topdingiz', 'Место изменения — найдено без подсказок', 'Found the place to change on your own'),
        help: L3('Kerakli joyni maslahat bilan topdingiz', 'Место изменения — найдено с подсказкой', 'Found the place to change with a hint') },
      build: { self: L3('Tuzilmani yig‘dingiz', 'Структура страницы — собрана', 'Built the page structure'),
        help: L3('Tuzilmani maslahat bilan yig‘dingiz', 'Структура — собрана с подсказкой', 'Built the structure with a hint') },
      close: { self: L3('Yopuvchi tegni yozdingiz', 'Закрывающий тег — написан', 'Wrote a closing tag'),
        help: L3('Yopuvchi tegni maslahat bilan yozdingiz', 'Закрывающий тег — написан с подсказкой', 'Wrote a closing tag with a hint') },
      page: { self: L3('O‘z sahifangizni yaratdingiz', 'Своя страница — создана', 'Created your own page'),
        help: L3('O‘z sahifangizni yaratdingiz', 'Своя страница — создана', 'Created your own page') }
    },
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@HELPERS@*/

// Свёрнутые строки кода для экрана 3: «<html>…</html>» и т. п.
['html', 'head', 'body'].forEach((t) => {
  LINE_TOKS[t + '-fold'] = () => [{ k: 'open', tag: t, z: t + '-o' }, { k: 'text', v: '…', z: t + '-fold' }, { k: 'close', tag: t, z: t + '-c' }];
});
// Строки документа с правильной вложенностью: свёрнутая строка тоже лежит «в» своём теге.
function docLines(order, v) {
  return buildLines(order, v).map((ln) => (/-fold$/.test(ln.id) ? Object.assign({}, ln, { reg: ln.reg.concat([ln.id.split('-')[0]]) }) : ln));
}

/*@UI@*/

// ═════════════════════════════════════════════════════════════════════════════
// ФИГУРА (навык anatomy): модель документа, посчитана при сборке.
// ═════════════════════════════════════════════════════════════════════════════
/*@FIGURES@*/
const COVER_UP = () => FIG.open.cover;
// Всё раскрыто, лишнего нет.
const ALL_OPEN = { lid: 'off', slots: 'off', 'title-stray': 'off', 'head-cover': 'off', 'body-cover': 'off' };

function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const t = store.get('myTitle'), x = store.get('myText');
  if (!t && !x) return null;
  return { type: 'html-page', title: t || '', text: x || '', html: buildHtml(t || '', x || '') };
}
const okText = (s) => hasLetters(s) && !hasTags(s);
const same = (a, b) => String(a || '').trim().replace(/\s+/g, ' ').toLowerCase() === String(b || '').trim().replace(/\s+/g, ' ').toLowerCase();
// Название и текст ученика (или образец) — сквозные для экранов 4–14.
const useMine = () => {
  const store = useStore();
  const pick = usePick();
  return { title: store.get('myTitle') || pick(SAMPLE.title), text: store.get('myText') || pick(SAMPLE.text) };
};
// Достижения для финала: 'self' — сам, 'help' — с подсказкой.
const putAch = (store, k, v) => {
  const a = Object.assign({}, store.get('ach') || {});
  if (a[k] !== 'self') a[k] = v;
  store.set('ach', a);
};

// ЛЕСЕНКА ПОДСКАЗОК: ступень поднимает лампочка в шапке (по запросу) или
// затруднение. 1 — внимание, 2 — принцип, 3 — конкретное действие.
function useLadder(active) {
  const [lv, setLv] = useState(0);
  const asked = useRef(0);
  const pulse = useHintPulse();
  const p0 = useRef(pulse);
  const act = useRef(active);
  act.current = active;
  useEffect(() => {
    if (pulse === p0.current) return;
    p0.current = pulse;
    if (!act.current) return;
    asked.current += 1;
    setLv((l) => Math.min(3, l + 1));
  }, [pulse]);
  const bump = useCallback(() => setLv((l) => Math.min(3, l + 1)), []);
  const reset = useCallback(() => { setLv(0); asked.current = 0; }, []);
  return { lv, bump, reset, asked };
}
// Ступень подсказки на месте задания.
const hintOf = (lv, h) => (lv > 0 && h[lv - 1] ? fillL(h[lv - 1], {}) : null);
function HintNote({ lv, text }) {
  const pick = usePick();
  if (!lv || !text) return null;
  return (
    <p className="hint-note" aria-live="polite"><Icon name="bulb" size={15} /><b>{pick(UI.hintN)} {lv}/3</b>{pick(text)}</p>
  );
}

// =============================================================================
// R1. ИЗ ЧЕГО СДЕЛАН BOB — три слоя: детали (HTML), вид (CSS), движение (JS).
// Пустая подставка; ученик включает слои по очереди и видит, что даёт каждый.
// Без HTML нет ничего — поэтому урок начинается с него.
// =============================================================================
const LAYERS = ['html', 'css', 'js'];
const LAYER_C = { html: '#586A83', css: '#227882', js: '#8A5A3C' };
function LayerIcon({ k }) {
  const d = {
    html: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
    css: <><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.7-1 1.2-1.9-.5-1 .1-2 1.2-2H17a4 4 0 0 0 4-4C21 7.6 17 3 12 3z" /><circle cx="7.5" cy="11.5" r="1.1" /><circle cx="10.5" cy="7.5" r="1.1" /><circle cx="15.5" cy="8" r="1.1" /></>,
    js: <path d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12l1-7.5z" />
  }[k];
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
}
const robotCls = (on) => 'fig-robot' + LAYERS.filter((k) => on[k]).map((k) => ' rb-' + k).join('');
const ALL_LAYERS = { html: true, css: true, js: true };
// Текст на экране Bob: заголовок и одна короткая строка.
const shortTxt = (s, n) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; };

function R1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.r1;
  const [rec, put] = useRec('r1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? ALL_LAYERS : { html: false, css: false, js: false });
  const [seen, setSeen] = useState(solved ? LAYERS.slice() : []);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : c.cast.map((x) => ({ text: x.text, pose: x.pose })));
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const next = LAYERS.find((k) => seen.indexOf(k) < 0) || null;
  const led = useIdleLed(canTap && !solved, seen.length);
  const offSaid = useRef(false);
  const toggle = (k) => {
    if (!canTap) return;
    if (!solved && k !== next) return;
    const now = !on[k];
    setOn((o) => Object.assign({}, o, { [k]: now }));
    sfx(now ? 'pop' : 'tap', true);
    if (!solved) {
      const ns = seen.concat(k);
      setSeen(ns);
      if (ns.length === LAYERS.length) {
        put({ done: true });
        log({ screenId: 'r1', type: 'layers', correct: true, attempts: ns.length });
        sayNow(c.on.js, 'cheer');
        say(c.done, 'explain');
      } else sayNow(c.on[k], k === 'html' ? 'wonder' : 'smile');
      return;
    }
    if (k === 'html' && !now && !offSaid.current) { offSaid.current = true; sayNow(c.off, 'explain'); }
  };
  const askText = solved ? c.askDone : next ? fillL(c.askOne, { x: pick(UI.layers[next].sub) }) : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={solved ? null : seen.length + '/3'} />
      <div className="rb-stage">
        <Fig fig={RFIG} cls={robotCls(on)} texts={{ scr1: pick(SAMPLE.title), scr2: pick(UI.scr2) }} label={UI.robot} />
        <div className="rb-layers" role="group">
          {LAYERS.map((k) => (
            <button key={k} type="button" className={'rb-layer' + (on[k] ? ' is-on' : '')} style={{ '--c': LAYER_C[k] }}
              aria-pressed={!!on[k]} disabled={!canTap || (!solved && k !== next)} onClick={() => toggle(k)}>
              <span className="rb-l-ic"><LayerIcon k={k} /></span>
              <span className="rb-l-txt"><span className="rb-l-name" translate="no">{UI.layers[k].name}</span><span className="rb-l-sub">{pick(UI.layers[k].sub)}</span></span>
              <span className="rb-sw" aria-hidden="true" />
              <Led on={led && k === next} />
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// R2. ЭКРАН BOB — на нём игра «Битва знаний». Нажали экран — это обычная
// веб-страница, а рядом её код. Ответ на «зачем»: так написан каждый сайт.
// =============================================================================
function R2({ p }) {
  const pick = usePick();
  const c = C.r2;
  const [rec, put] = useRec('r2');
  const solved = !!(rec && rec.done);
  const [open, setOpen] = useState(solved);
  const [flash, setFlash] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !open, 0);
  const game = { title: pick(SAMPLE.title), text: pick(UI.gameQ) };
  const tap = () => {
    if (!canTap || open) return;
    sfx('pop', true);
    setOpen(true); setFlash((n) => n + 1);
    put({ done: true });
    sayNow(c.page, 'wonder');
    say(c.code, 'explain');
    say(c.done, 'cheer');
  };
  // Пока звучит реплика про код — код подсвечен; про страницу — окно.
  const now = speaker.text === c.code ? 'code' : speaker.text === c.page ? 'page' : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={open ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={open ? c.askDone : c.ask} />
      {open ? (
        <div className={'work pr rb-zoom rb-open' + (now ? ' is-' + now : '')}>
          <MiniBrowser title={game.title} page={game.text} flashTab={flash} flashPage={flash} hl={now === 'page' ? 'html' : null} />
          <CodeLines lines={buildLines(FULL_DOC, game)} className="cv-pr rb-code" />
        </div>
      ) : (
        <>
          <div className="rb-tapfig" role="button" tabIndex={0} aria-label={pick(c.ask)} onClick={tap}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } }}>
            <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: game.title, scr2: pick(UI.scr2) }} label={UI.robot}
              led={led ? ['screen'] : []} />
          </div>
          <div className="rb-acts">
            <button type="button" className="btn-accent rb-open-b" disabled={!canTap} onClick={tap}>
              <Icon name="browser" size={18} />{pick(UI.openScreen)}<Led on={led} />
            </button>
          </div>
        </>
      )}
    </Stage>
  );
}

// =============================================================================
// M. ПЛАН УРОКА карточками (канон) и две кнопки-помощницы. Урок первый в
// курсе, поэтому после плана Коди показывает настоящие кнопки шапки:
// «Подсказку» и «Паузу». Шаг засчитывается настоящим нажатием.
// (Перенесено из урока 1 курса, экран s2.)
// =============================================================================
const COACH_SAFETY_MS = 30000;
function M({ p }) {
  const pick = usePick();
  const audio = useAudio();
  const store = useStore();
  const c = C.m;
  const tour = useCardTour({ id: 'm', intro: c.say, lines: c.steps.map((st) => st.say), done: c.done });
  // -1 карточки · 0 «Подсказка» · 1 «Пауза» · 2 итоговая реплика · 3 готово
  const [phase, setPhase] = useState(() => (store.get('mc') ? 3 : -1));
  useEffect(() => { if (phase === -1 && tour.ended && tour.spoken) setPhase(0); }, [tour.ended, tour.spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const cur = phase === 0 || phase === 1 ? c.coach[phase] : null;

  // Реплика шага тура звучит голосом героя. Предохранитель: шаг, который ребёнок
  // так и не выполнил, сам уступает место следующему — урок не запирает.
  const pickRef = useRef(pick);
  pickRef.current = pick;
  useEffect(() => {
    if (!cur) return undefined;
    let dead = false;
    (async () => {
      if (audio && audio.stop) audio.stop();
      if (audio && !dead) await audio.speak(pickRef.current(cur.text), VOICE.bot);
    })();
    const t = setTimeout(() => { if (!dead) setPhase((ph) => (ph === phase ? ph + 1 : ph)); }, COACH_SAFETY_MS);
    return () => { dead = true; clearTimeout(t); };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // «Подсказка»: ловим нажатие настоящей лампочки в шапке и ждём, пока герой
  // договорит то, что она произносит.
  const [hintHit, setHintHit] = useState(false);
  useEffect(() => {
    if (phase !== 0) return undefined;
    const h = (e) => { if (e.target && e.target.closest && e.target.closest('.ctl-hint')) setHintHit(true); };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, [phase]);
  const playing = !!(audio && audio.playing);
  const heard = useRef(false);
  useEffect(() => {
    if (phase !== 0 || !hintHit) return undefined;
    if (playing) { heard.current = true; return undefined; }
    const t = setTimeout(() => setPhase(1), heard.current ? 700 : 5000);
    return () => clearTimeout(t);
  }, [phase, hintHit, playing]);

  // «Пауза»: засчитываются два нажатия — остановил и продолжил.
  const paused = !!(audio && audio.paused);
  const [hits, setHits] = useState(0);
  const lastPaused = useRef(null);
  useEffect(() => {
    if (phase !== 1) { lastPaused.current = null; return; }
    if (lastPaused.current !== null && lastPaused.current !== paused) setHits((h) => h + 1);
    lastPaused.current = paused;
  }, [phase, paused]);
  useEffect(() => { if (phase === 1 && hits >= 2) setPhase(2); }, [phase, hits]);

  // Итоговая реплика — своим голосом экрана, после тура.
  const [speaker2, , spoken2, sayNow2] = useVoice([]);
  const [said, setSaid] = useState(false);
  useEffect(() => { if (phase === 2 && !said) { setSaid(true); sayNow2(c.ready, 'cheer'); } }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (phase === 2 && said && spoken2) { store.set('mc', true); setPhase(3); }
  }, [phase, said, spoken2]); // eslint-disable-line react-hooks/exhaustive-deps
  const ended = phase === 3;

  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={phase >= 2 && said ? speaker2 : tour.speaker}
      done={ended} hint={phase === 0 ? c.hintSay : c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!ended} onClick={p.next} /></>}
      overlay={cur ? (
        <CoachMark selector={cur.sel} icon={cur.icon} title={cur.title}
          text={phase === 1 && hits >= 1 ? cur.text2 : cur.text} nonce={phase * 10 + Math.min(hits, 1)} />
      ) : null}>
      <TourCards tour={tour} cards={c.steps} label={(st) => st.text}
        face={(st) => (
          <>
            <span className="tour-ic"><Icon name={st.icon} size={30} /></span>
            <span className="tour-t">{pick(st.text)}</span>
          </>
        )} />
    </Stage>
  );
}

// =============================================================================
// 1. ДВЕ НАДПИСИ — название на вкладке и текст в окне.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const [title, setTitle] = useState(rec ? rec.title : pick(SAMPLE.title));
  const [text, setText] = useState(rec ? rec.text : pick(SAMPLE.text));
  const [mode, setMode] = useState(null);           // 'title' | 'text'
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const changed = !!rec;
  const [speaker, , spoken, sayNow] = useVoice([{ text: changed ? c.done : c.say, pose: changed ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(changed, spoken);
  const led = useIdleLed(canTap && !changed, mode ? 1 : 0);
  const apply = (v) => {
    if (!canTap) return;
    sfx('pop', true);
    const nt = mode === 'title' ? v : title, nx = mode === 'text' ? v : text;
    setTitle(nt); setText(nx);
    setFlash((f) => (mode === 'title' ? { tab: f.tab + 1, page: f.page } : { tab: f.tab, page: f.page + 1 }));
    if (!changed) { put({ title: nt, text: nx }); sayNow(c.done, 'cheer'); } else put({ title: nt, text: nx });
  };
  const opts = mode === 'title' ? c.titles : mode === 'text' ? c.texts : [];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={mode ? c.askPick : c.ask} nav={navOf(p, canGo)}>
      <Ask text={changed && !mode ? c.askDone : mode ? c.askPick : c.ask} />
      <div className="s1-stage">
        <MiniBrowser title={title} page={text} flashTab={flash.tab} flashPage={flash.page} hl={mode === 'title' ? 'title' : mode === 'text' ? 'body' : null} />
      </div>
      <div className="s1-acts" role="group">
        {['title', 'text'].map((m) => (
          <button key={m} type="button" disabled={!canTap} className={'act-card' + (mode === m ? ' is-sel' : '')} aria-pressed={mode === m}
            onClick={() => setMode(m)}>
            <span className={'act-ic act-' + m} aria-hidden="true" />
            {pick(m === 'title' ? UI.changeTitle : UI.changeText)}
            <Led on={led && !mode} />
          </button>
        ))}
      </div>
      {mode ? (
        <div className="pv-opts" role="group">
          {opts.map((o, i) => (
            <button key={i} type="button" disabled={!canTap} className="opt-chip" onClick={() => apply(pick(o))}>{pick(o)}</button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 2. НАЗВАНИЕ В КОДЕ — части тега на строке title: что такое тег, объясняется
// на том, что ученик уже видел (название на вкладке). Потом — подписи.
// =============================================================================
const PARTS3 = ['start', 'content', 'end'];
function BigLine({ tag, text, sel, found, onPart, disabled, led }) {
  const pick = usePick();
  const parts = [
    { k: 'start', node: <Tag tag={tag} big /> },
    { k: 'content', node: <span className="bl-text">{text}</span> },
    { k: 'end', node: <Tag tag={tag} close big /> }
  ];
  return (
    <div className="pv-bl" translate="no">
      {parts.map((pt) => (
        <button key={pt.k} type="button" disabled={disabled} onClick={() => onPart(pt.k)}
          className={'bl-part bl-' + pt.k + (sel === pt.k ? ' is-sel' : '') + (found && found[pt.k] ? ' is-found' : '')}
          aria-label={found && found[pt.k] ? pick(UI.labels[pt.k]) : undefined}>
          {pt.node}
          {found && found[pt.k] ? <span className="bl-lbl">{pick(UI.labels[pt.k])}</span> : null}
          <Led on={!!led && led.indexOf(pt.k) >= 0} />
        </button>
      ))}
    </div>
  );
}
function S2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'done' : 'explore');   // explore → label → (follow) → done
  const [seen, setSeen] = useState([]);
  const [cur, setCur] = useState(null);
  const [label, setLabel] = useState(null);
  const [found, setFound] = useState({});
  const [msg, setMsg] = useState(null);
  const [tabFlash, setTabFlash] = useState(0);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(phase === 'label' || phase === 'follow');
  const st = useRef({ tries: 0, misses: 0, follow: null, followMiss: 0 });
  const led = useIdleLed(canTap && phase === 'explore', seen.length);

  const explore = (k) => {
    if (!canTap) return;
    sfx('tap', true);
    setCur(k);
    if (k === 'content') setTabFlash((n) => n + 1);
    const next = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(next);
    sayNow(c.parts[k], 'point');
    if (next.length === 3 && seen.length < 3) setTimeout(() => { setPhase('label'); setCur(null); sayNow(c.phase2, 'explain'); }, 2200);
  };
  const place = (part) => {
    if (!canTap) return;
    if (!label) { setMsg(c.askB); return; }
    if (found[part]) return;
    st.current.tries += 1;
    if (label === part) {
      sfx('ok', true);
      const f = Object.assign({}, found, { [part]: true });
      setFound(f); setLabel(null); setMsg(null);
      if (PARTS3.every((k) => f[k])) {
        const s = st.current;
        if (phase === 'label' && lad.lv >= 3) {
          // Подробная помощь — ещё одна строка того же типа.
          sayNow(joinL(c.ok[part], c.askFollow), 'smile');
          setTimeout(() => { setFound({}); setPhase('follow'); lad.reset(); }, 1500);
          return;
        }
        if (phase === 'follow') s.follow = s.followMiss === 0;
        log({ screenId: 's2', type: 'tag-parts', correct: true, firstTry: s.misses === 0 && lad.asked.current === 0, attempts: s.tries,
          hints: lad.asked.current, depth: lad.lv, helped: lad.lv >= 3 || phase === 'follow', followUp: s.follow });
        put({ done: true });
        setPhase('done');
        sayNow(joinL(c.ok[part], c.done), 'cheer');
      } else sayNow(c.ok[part], 'smile');
      return;
    }
    st.current.misses += 1;
    if (phase === 'follow') st.current.followMiss += 1;
    sfx('soft', true);
    wobble(part);
    setMsg(c.miss[part]);
    sayNow(c.miss[part], 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const line = phase === 'explore' ? { tag: 'title', text: pick(SAMPLE.title) }
    : phase === 'follow' ? { tag: 'title', text: pick(L3('Kosmos', 'Космос', 'Space')) }
      : { tag: 'title', text: pick(L3('Mening saytim', 'Мой сайт', 'My site')) };
  const hint = hintOf(lad.lv, [c.h1, c.h2, c.h3]);
  const askText = phase === 'explore' ? c.askA : phase === 'follow' ? c.askFollow : phase === 'done' ? c.done : c.askB;
  const doneFound = phase === 'done' ? { start: true, content: true, end: true } : found;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintOf(Math.min(3, lad.lv + 1), [c.h1, c.h2, c.h3]) || askText} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={phase !== 'done' && phase !== 'explore' ? msg : null} n={phase === 'explore' ? seen.length + '/3' : null} />
      <HintNote lv={phase === 'label' || phase === 'follow' ? lad.lv : 0} text={hint} />
      <div className="s2-board">
        <BigLine tag={line.tag} text={line.text} sel={phase === 'explore' ? cur : shake} found={phase === 'explore' ? null : doneFound}
          onPart={phase === 'explore' ? explore : place} disabled={!canTap || phase === 'done'}
          led={phase === 'explore' && led ? PARTS3.filter((k) => seen.indexOf(k) < 0) : lad.lv >= 3 && label ? [label] : null} />
        {phase === 'explore' ? (
          <div className="s2-result">
            <span className="s2-res-l">{pick(UI.tab)}</span>
            <span key={'t' + tabFlash} className={'s2-tab' + (tabFlash ? ' is-flash' : '')}><span className="mb-fav" aria-hidden="true" />{line.text}</span>
            {cur ? <span className="s2-expl">{pick(c.parts[cur])}</span> : null}
          </div>
        ) : null}
      </div>
      {phase === 'label' || phase === 'follow' ? (
        <div className="labels" role="group">
          {PARTS3.map((k) => (
            <button key={k} type="button" disabled={!canTap || found[k]} aria-pressed={label === k}
              className={'lbl-chip' + (label === k ? ' is-sel' : '') + (found[k] ? ' is-done' : '')} onClick={() => { setLabel(label === k ? null : k); setMsg(null); }}>
              {found[k] ? <Icon name="check" size={13} /> : null}{pick(UI.labels[k])}
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 3. ВНУТРИ СТРАНИЦЫ — коробка документа (anatomy). Части открываются по
// одной: html → head → title → body. Каждая объясняется, когда появляется, и
// подсвечивает свою часть браузера. Счётчик и «что дальше» — в строке задания.
// =============================================================================
const S3_ORDER = ['html', 'head', 'title', 'body'];
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [open, setOpen] = useState(() => (solved ? { html: true, head: true, body: true } : { html: false, head: false, body: false }));
  const [seen, setSeen] = useState(solved ? S3_ORDER.slice() : []);
  const [sel, setSel] = useState(solved ? 'body' : null);
  const [lidGone, setLidGone] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const taps = useRef(0);
  const seenRef = useRef(seen);
  const next = S3_ORDER.find((k) => seen.indexOf(k) < 0) || null;
  const led = useIdleLed(canTap && !solved, seen.length);
  useEffect(() => {
    if (open.html) { const t = setTimeout(() => setLidGone(true), reduceMotion() ? 0 : 450); return () => clearTimeout(t); }
    setLidGone(false); return undefined;
  }, [open.html]);
  // Отметить часть; true — это была последняя из четырёх.
  const mark = (k) => {
    const cur = seenRef.current;
    if (cur.indexOf(k) >= 0) return false;
    const ns = cur.concat(k);
    seenRef.current = ns;
    setSeen(ns);
    if (ns.length === S3_ORDER.length && !solved) {
      put({ done: true });
      log({ screenId: 's3', type: 'explore-nesting', correct: true, attempts: taps.current });
      return true;
    }
    return false;
  };
  const tell = (k, pose) => {
    if (mark(k)) { sayNow(c[k], 'cheer'); say(c.done, 'explain'); } else sayNow(c[k], pose);
  };
  const act = (k) => {
    if (!canTap || !k) return;
    taps.current += 1;
    setMsg(null);
    if (k === 'doctype') { setSel('doctype'); sayNow(c.doctype, 'explain'); return; }
    if (k === 'html') {
      if (!open.html) { sfx('pop', true); setOpen({ html: true, head: false, body: false }); }
      setSel('html');
      tell('html', open.html ? 'explain' : 'wonder');
      return;
    }
    if (!open.html) { act('html'); return; }
    if (k === 'head' || k === 'body') {
      if (!open[k]) sfx('tap', true);
      setOpen((o) => Object.assign({}, o, { [k]: true }));
      setSel(k);
      if (k === 'body') setFlash((f) => ({ tab: f.tab, page: f.page + 1 }));
      tell(k, 'explain');
      return;
    }
    if (k === 'title') {
      if (!open.head) { setMsg(c.needHead); sayNow(c.needHead, 'think'); return; }
      sfx('ok', true);
      setSel('title');
      setFlash((f) => ({ tab: f.tab + 1, page: f.page }));
      tell('title', 'smile');
    }
  };
  const hitMap = { lid: 'html', html: 'html', head: 'head', body: 'body', title: 'title', page: 'body', doctype: 'doctype' };
  const order = ['doctype'].concat(open.html
    ? ['html-o'].concat(open.head ? ['head-o', 'title', 'head-c'] : ['head-fold']).concat(open.body ? ['body-o', 'text', 'body-c'] : ['body-fold']).concat(['html-c'])
    : ['html-fold']);
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const lit = sel === 'html' ? ['html', 'html-close'] : sel === 'head' ? ['head', 'head-close'] : sel === 'body' ? ['body', 'body-close', 'page'] : sel === 'title' ? ['title'] : sel === 'doctype' ? ['doctype'] : [];
  const ledKeys = !led || !next ? [] : next === 'html' ? ['lid'] : [next];
  const askText = solved ? c.askDone : next ? c.next[next] : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={msg} n={solved ? null : seen.length + '/4'} />
      <div className="ex">
        <Fig texts={docTexts(t, x)} onPick={(h) => act(hitMap[h])} label={c.ask}
          parts={{ slots: 'off', 'title-stray': 'off', lid: lidGone ? 'off' : 'on', 'head-cover': open.head ? 'off' : 'on', 'body-cover': open.body ? 'off' : 'on',
            'title-card': open.head ? 'on' : 'off', 'page-card': open.body ? 'on' : 'off' }}
          move={{ lid: open.html ? LID_UP() : 0, 'head-cover': open.head ? COVER_UP() : 0, 'body-cover': open.body ? COVER_UP() : 0,
            'title-card': open.head ? (sel === 'title' ? 6 : 0) : DROP(), 'page-card': open.body ? 0 : DROP() }}
          lit={lit} led={ledKeys} />
        <div className="ex-side">
          <MiniBrowser title={t} page={x} compact hl={sel === 'doctype' ? null : sel} info={UI.passport} flashTab={flash.tab} flashPage={flash.page} />
          <CodeLines lines={docLines(order, { title: t, text: x })} hl={sel && sel !== 'doctype' ? sel : null} className="cv-ex"
            lineProps={(ln) => (ln.id === 'doctype' ? { cls: sel === 'doctype' ? 'is-doc' : 'is-doc-dim' } : null)} />
        </div>
      </div>
      <div className="chips" translate="no">
        <button type="button" className="chip mono chip-doc" disabled={!canTap || !open.html} onClick={() => act('doctype')} style={{ '--c': T.ink2 }}>!DOCTYPE</button>
        {S3_ORDER.map((k) => {
          const isSeen = seen.indexOf(k) >= 0;
          return (
            <button key={k} type="button" disabled={!canTap || (k !== 'html' && !open.html) || (k === 'title' && !open.head)} style={{ '--c': TAGC[k] }}
              className={'chip mono' + (sel === k ? ' is-sel' : '') + (isSeen ? ' is-seen' : '')} aria-pressed={sel === k} onClick={() => act(k)}>
              {k}
              <Led on={led && k === next} />
            </button>
          );
        })}
      </div>
    </Stage>
  );
}

// =============================================================================
// 4. ДАЙ СТРАНИЦЕ ИМЯ — содержимое title (код + браузер, без объёма).
// =============================================================================
function EditLine({ tag, value, onChange, placeholder, label, inputRef, max }) {
  // Строка кода с неподвижными тегами и полем между ними.
  return (
    <div className="edit-line mono" translate="no">
      <Tag tag={tag} />
      <InlineInput value={value} onChange={onChange} placeholder={placeholder} label={label} inputRef={inputRef} max={max || 40} />
      <Tag tag={tag} close />
    </div>
  );
}
function MiniDoc({ title, text, editTitle, editText, hl, regZone }) {
  // Короткий настоящий документ: строки head/body; редактируемые — с полем.
  const lines = buildLines(FULL_DOC, { title, text });
  return (
    <CodeLines lines={lines} hl={hl} regZone={regZone} className="cv-ed"
      renderText={(t) => (t.z === 'title-text' && editTitle ? editTitle : t.z === 'body-text' && editText ? editText : <span className="tk-text">{t.v}</span>)} />
  );
}
function S4({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const mine = useMine();
  const first = store.get('s4first') || pick(SAMPLE.title);
  const [val, setVal] = useState(mine.title);
  const [was, setWas] = useState(rec && rec.was ? rec.was : first);
  const [wire, setWire] = useState(0);
  const [flash, setFlash] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved, 0);
  const wrapRef = useRef(null), tabRef = useRef(null);
  const zones = useRef({});
  const regZone = (z, el) => { zones.current[z] = el; };
  const committed = useRef(mine.title);
  // Изменение засчитывается после паузы в наборе: тогда импульс к вкладке и одна реплика.
  useEffect(() => {
    if (!okText(val) || same(val, committed.current)) return undefined;
    const t = setTimeout(() => {
      setWas(committed.current);
      committed.current = val.trim();
      store.set('myTitle', val.trim());
      setWire((n) => n + 1); setFlash((n) => n + 1);
      sfx('ok', true);
      if (!solved) { put({ done: true, was: first }); sayNow(c.done, 'cheer'); }
    }, 1100);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = okText(val) ? val : committed.current;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={hasTags(val) ? UI.noTags : null} />
      <div className="work pr" ref={wrapRef}>
        <MiniBrowser title={shown} page={mine.text} tabRef={tabRef} flashTab={flash} />
        <div className={'ed-box' + (led ? ' is-led' : '')}>
          <MiniDoc title={shown} text={mine.text} hl="title" regZone={regZone}
            editTitle={<InlineInput value={val} onChange={setVal} label={c.ask} placeholder={SAMPLE.title} max={40} />} />
          <Led on={led} />
        </div>
        <Wire wrapRef={wrapRef} on={wire > 0} nonce={wire} color={TAGC.title} from={() => zones.current['title-text']} to={() => tabRef.current} />
      </div>
      <div className="pv-opts" role="group">
        {c.opts.map((o, i) => <button key={i} type="button" disabled={!canTap} className="opt-chip" onClick={() => setVal(pick(o))}>{pick(o)}</button>)}
      </div>
      {wire > 0 ? (
        <div className="pv-cmp" translate="no">
          <span className="cmp-i"><i>{pick(UI.was)}</i>{was}</span><span className="cmp-arrow" aria-hidden="true">→</span><span className="cmp-i is-now"><i>{pick(UI.now)}</i>{committed.current}</span>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 5. НАПИШИ ПОСЕТИТЕЛЮ — текст внутри body, слова-кнопки и обычный ввод.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const mine = useMine();
  const [val, setVal] = useState(store.get('myText') || '');
  const [wire, setWire] = useState(0);
  const [flash, setFlash] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !val, 0);
  const wrapRef = useRef(null), pageRef = useRef(null);
  const zones = useRef({});
  const regZone = (z, el) => { zones.current[z] = el; };
  const committed = useRef(store.get('myText') || '');
  useEffect(() => {
    if (!okText(val) || same(val, committed.current)) return undefined;
    const t = setTimeout(() => {
      committed.current = val.trim();
      store.set('myText', val.trim());
      setWire((n) => n + 1); setFlash((n) => n + 1);
      if (!solved) { put({ done: true }); sfx('ok', true); sayNow(c.done, 'cheer'); }
    }, 1200);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const addWord = (w) => setVal((v) => (v.trim() ? v.trim() + ' ' : '') + w);
  const eraseWord = () => setVal((v) => v.trim().split(/\s+/).slice(0, -1).join(' '));
  const shown = okText(val) ? val : '';
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={hasTags(val) ? UI.noTags : null} />
      <div className="work pr" ref={wrapRef}>
        <MiniBrowser title={mine.title} page={shown} pageRef={pageRef} flashPage={flash} />
        <div className={'ed-box' + (led ? ' is-led' : '')}>
          <MiniDoc title={mine.title} text={shown} hl="body" regZone={regZone}
            editText={<InlineInput value={val} onChange={setVal} label={c.ask} placeholder={SAMPLE.text} max={70} />} />
          <Led on={led} />
        </div>
        <Wire wrapRef={wrapRef} on={wire > 0} nonce={wire} color={TAGC.body} from={() => zones.current['body-text']} to={() => pageRef.current} />
      </div>
      <div className="words" role="group" translate="no">
        {c.words.map((w, i) => <button key={i} type="button" className="word-b" onClick={() => addWord(pick(w))}>{pick(w)}</button>)}
        <button type="button" className="word-b word-erase" onClick={eraseWord} aria-label={pick(UI.erase)}><Icon name="undo" size={15} /></button>
      </div>
    </Stage>
  );
}

// =============================================================================
// 6. УГАДАЙ ДО ЗАПУСКА — сначала ответ, потом изменение и импульс.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const mine = useMine();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [{ k: 'title', v: 'text' }, { k: 'body', v: 'text' }]));
  const [doneN, setDoneN] = useState(0);
  const round = queue[0] || null;
  const R = round ? c.rounds[round.k] : null;
  const [vals, setVals] = useState({ title: mine.title, text: mine.text });
  const [answered, setAnswered] = useState(null);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [wire, setWire] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stats = useRef({ title: { first: null, extra: null }, body: { first: null, extra: null } });
  const wrapRef = useRef(null), tabRef = useRef(null), pageRef = useRef(null);
  const zones = useRef({});
  const regZone = (z, el) => { zones.current[z] = el; };
  const newText = round ? pick(round.v === 'extra' ? R.extra : R.text) : '';
  const answer = (where) => {
    if (!canTap || !round || answered) return;
    const k = round.k;
    const right = where === R.want;
    if (round.v === 'extra') stats.current[k].extra = right; else stats.current[k].first = right;
    setAnswered(where);
    setVals((v) => (k === 'title' ? Object.assign({}, v, { title: newText }) : Object.assign({}, v, { text: newText })));
    setFlash((f) => (R.want === 'tab' ? { tab: f.tab + 1, page: f.page } : { tab: f.tab, page: f.page + 1 }));
    setWire((n) => n + 1);
    sfx(right ? 'ok' : 'soft', true);
    sayNow(right ? (R.want === 'tab' ? c.okTab : c.okPage) : (R.want === 'tab' ? c.missTab : c.missPage), right ? 'smile' : 'rule');
    setTimeout(() => {
      const rest = queue.slice(1);
      if (!right && round.v !== 'extra') rest.unshift({ k, v: 'extra' });
      setQueue(rest); setDoneN((n) => n + 1); setAnswered(null);
      if (!rest.length) {
        const s = stats.current;
        ['title', 'body'].forEach((kk) => log({ screenId: 's6.' + kk, type: 'predict', correct: true, firstTry: s[kk].first === true,
          attempts: s[kk].extra === null ? 1 : 2, hints: s[kk].first ? 0 : 1, helped: s[kk].first === false, followUp: s[kk].extra }));
        put({ done: true });
        setTimeout(() => sayNow(c.done, 'cheer'), 300);
      }
    }, reduceMotion() ? 1500 : 2600);
  };
  const askText = round ? fillL(R.ask, { t: newText }) : c.done;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
      <div className="work pr" ref={wrapRef}>
        <MiniBrowser title={vals.title} page={vals.text} tabRef={tabRef} pageRef={pageRef} flashTab={flash.tab} flashPage={flash.page} typed={!!answered} />
        <div className="pending-wrap">
          {round && !answered ? (
            <div className="pv-pending mono" translate="no">
              <Tag tag={round.k} /><span className="tk-text">{newText}</span><Tag tag={round.k} close />
            </div>
          ) : null}
          <CodeLines lines={buildLines(FULL_DOC, vals)} regZone={regZone} className="cv-pr" hl={round && !answered ? (round.k === 'title' ? 'title' : 'body') : null} />
        </div>
        <Wire wrapRef={wrapRef} on={!!answered} nonce={wire} color={round && round.k === 'title' ? TAGC.title : TAGC.body}
          from={() => zones.current[round && round.k === 'title' ? 'title-text' : 'body-text']}
          to={() => (round && R.want === 'tab' ? tabRef.current : pageRef.current)} />
      </div>
      {round ? (
        <div className="where" role="group">
          {['tab', 'page'].map((w) => (
            <button key={w} type="button" disabled={!canTap || !!answered}
              className={'where-b' + (answered === w ? (w === R.want ? ' is-ok' : ' is-miss') : '') + (answered && w === R.want && answered !== w ? ' is-real' : '')}
              onClick={() => answer(w)}>
              <span className={'where-ic where-' + w} aria-hidden="true" />{pick(w === 'tab' ? UI.tab : UI.window)}
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 7. СОБЕРИ, ЧТОБЫ РАЗОБРАТЬСЯ — вторая сцена Anatomy: сборка вложенности.
// =============================================================================
// ПЕРЕТАСКИВАНИЕ. Деталь тянется за пальцем или мышью; место определяется по
// тому, что под указателем при отпускании ([data-place] в коде, часть модели,
// узел дерева). Короткое касание без движения остаётся обычным нажатием —
// так тот же путь доступен с клавиатуры: выбрать деталь → нажать место.
function useDragDrop(onDrop) {
  const drag = useRef(null);
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;
  const [ghost, setGhost] = useState(null);
  const [hover, setHover] = useState(null);
  const start = (e, payload, label) => {
    if (e.button > 0) return;
    drag.current = { payload, label, x: e.clientX, y: e.clientY, moved: false };
  };
  useEffect(() => {
    const placeAt = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const z = el && el.closest && el.closest('[data-place]');
      return z ? z.getAttribute('data-place') : null;
    };
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 7) d.moved = true;
      if (!d.moved) return;
      setGhost({ label: d.label, payload: d.payload, x: e.clientX, y: e.clientY });
      setHover(placeAt(e.clientX, e.clientY));
    };
    const up = (e) => {
      const d = drag.current;
      drag.current = null;
      setGhost(null); setHover(null);
      if (!d || !d.moved) return;
      dropRef.current(d.payload, document.elementFromPoint(e.clientX, e.clientY));
    };
    const cancel = () => { drag.current = null; setGhost(null); setHover(null); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
  }, []);
  return { start, ghost, hover };
}
function DragGhost({ ghost }) {
  if (!ghost) return null;
  return <div className="drag-ghost mono" aria-hidden="true" style={{ left: ghost.x, top: ghost.y, '--c': TAGC[ghost.payload] || T.ink2 }}>{ghost.label}</div>;
}
// Место для вставки в коде: пунктирная строка «сюда».
function DropZone({ place, hover, onPick, label }) {
  const pick = usePick();
  return (
    <button type="button" className={'drop-zone' + (hover === place ? ' is-hover' : '')} data-place={place} style={{ '--c': TAGC[place] }}
      onClick={onPick} aria-label={pick(label)}>
      <span className="dz-arrow" aria-hidden="true">↳</span>{pick(label)}
    </button>
  );
}

const PIECES = ['head', 'body', 'title'];
function orderOf(placed) {
  const has = (k) => placed.indexOf(k) >= 0;
  const o = ['doctype', 'html-o'];
  if (has('head')) { o.push('head-o'); if (has('title')) o.push('title'); o.push('head-c'); }
  if (has('body')) o.push('body-o', 'text', 'body-c');
  o.push('html-c');
  return o;
}
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s7;
  const mine = useMine();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [placed, setPlaced] = useState(solved ? PIECES.slice() : []);
  const placedRef = useRef(placed);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [newest, setNewest] = useState(null);
  const [view, setView] = useState('volume');
  const [part, setPart] = useState(null);           // выделение после сборки — общее для «Объём» и «Код»
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [chipShake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !solved && lad.lv >= 3, placed.length);
  const has = (k) => placed.indexOf(k) >= 0;
  const placeIt = (piece, place) => {
    if (!canTap || !piece || has(piece) || !place) return;
    st.current.tries += 1;
    const cur = placedRef.current;
    let why = null;
    if (piece === 'head') why = place === 'html' ? null : c.nested;
    else if (piece === 'body') why = place !== 'html' ? c.nested : cur.indexOf('head') < 0 ? c.bodyFirst : null;
    else why = place === 'head' ? null : place === 'body' ? c.titleBody : c.titleHtml;
    if ((place === 'head' || place === 'body') && cur.indexOf(place) < 0) why = c.noPlace;
    if (!why) {
      const next = cur.concat(piece);
      placedRef.current = next;
      setPlaced(next); setSel(null); setMsg(null); setNewest(piece);
      sfx('ok', true);
      if (next.length === 3) {
        const s = st.current;
        log({ screenId: 's7', type: 'assemble-volume', correct: true, firstTry: s.misses === 0 && lad.asked.current === 0, attempts: s.tries,
          hints: lad.asked.current, depth: lad.lv, helped: lad.lv >= 3, independent: s.misses === 0 && lad.asked.current === 0 });
        putAch(store, 'build', s.misses === 0 && lad.asked.current === 0 ? 'self' : 'help');
        put({ done: true });
        sayNow(joinL(c.ok[piece], c.done), 'cheer');
      } else sayNow(c.ok[piece], 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true);
    wobble(piece);
    setShake((x) => ({ k: place === 'html' ? 'body' : place, n: x.n + 1 }));
    setMsg(why);
    sayNow(why, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const hitToPlace = (h) => ({ html: 'html', lid: 'html', head: 'head', body: 'body', title: 'head', page: 'body' }[h] || null);
  const pickPlace = (pl) => { if (!sel) { setMsg(c.pickFirst); return; } placeIt(sel, pl); };
  const dnd = useDragDrop((piece, el) => {
    if (!el) return;
    const z = el.closest('[data-place]');
    const h = el.closest('.fig [data-hit]');
    placeIt(piece, z ? z.getAttribute('data-place') : h ? hitToPlace(h.getAttribute('data-hit')) : null);
  });
  const hand = !solved && !!(sel || dnd.ghost);
  const t = mine.title, x = mine.text;
  // Порядок строк с местами для вставки: пока деталь «в руке», в коде видны
  // пунктирные строки внутри html, внутри head и внутри body.
  const zones = {};
  const order = (() => {
    if (!hand) return orderOf(placed);
    const o = ['doctype', 'html-o'];
    if (has('head')) { o.push('head-o'); if (has('title')) o.push('title'); else { zones[o.length] = 'head'; o.push(null); } o.push('head-c'); }
    if (has('body')) { o.push('body-o'); zones[o.length] = 'body'; o.push(null); o.push('text', 'body-c'); }
    zones[o.length] = 'html'; o.push(null);
    o.push('html-c');
    return o;
  })();
  const partLit = { html: ['html', 'html-close'], head: ['head', 'head-close'], body: ['body', 'body-close', 'page'], title: ['title'] };
  const lit = solved ? (partLit[part] || []) : (newest ? partLit[newest] : []);
  const hint = hintOf(lad.lv, [c.h1, c.h2, c.h3]);
  const nextStep = !has('head') ? '<head> → ' + pick(UI.intoHtml) : !has('body') ? '<body> → ' + pick(UI.intoHtml) : '<title> → ' + pick(UI.intoHead);
  const hintText = hint && lad.lv === 3 ? fillL(hint, { p: nextStep }) : hint;
  const fig = (
    <Fig texts={docTexts(t, x)} onPick={solved ? (h) => setPart({ html: 'html', lid: 'html', head: 'head', body: 'body', title: 'title', page: 'body' }[h]) : (h) => pickPlace(hitToPlace(h))}
      pickable={solved ? null : sel ? ['html', 'head', 'body', 'title', 'page'] : []}
      parts={{ lid: 'off', 'title-stray': 'off', 'head-cover': 'off', 'body-cover': 'off', doctype: 'on', slots: placed.length < 2 ? 'on' : 'off',
        head: has('head') ? 'on' : 'off', body: has('body') ? 'on' : 'off', 'title-card': has('title') ? 'on' : 'off' }}
      move={{ lid: LID_UP(), head: has('head') ? 0 : DROP(), body: has('body') ? 0 : DROP(), 'title-card': has('title') ? 0 : DROP() }}
      lit={lit} shake={shake} led={led && sel ? ['html', 'head'] : []} label={c.ask} />
  );
  const code = (
    <CodeLines lines={buildLines(order, { title: t, text: x })} className="cv-ex" hl={solved ? part : null}
      lineProps={(ln, i) => {
        if (ln.empty && zones[i]) {
          const zp = zones[i];
          return { cls: 'is-zone', empty: <DropZone place={zp} hover={dnd.hover} onPick={() => pickPlace(zp)} label={zp === 'html' ? UI.intoHtml : zp === 'head' ? UI.intoHead : UI.intoBody} /> };
        }
        const pt = { 'html-o': 'html', 'html-c': 'html', 'head-o': 'head', 'head-c': 'head', title: 'title', 'body-o': 'body', text: 'body', 'body-c': 'body' }[ln.id];
        if (solved && pt) return { onTap: () => setPart(pt), cls: '' };
        return { cls: !solved && pt === newest ? 'is-new' : '' };
      }} />
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? c.askDone : (hintOf(Math.min(3, lad.lv + 1), [c.hintAsk]) || c.ask)} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.askDone : hand ? c.askPlace : c.ask} hint={solved ? null : msg} n={placed.length + '/3'} />
      <HintNote lv={solved ? 0 : lad.lv} text={hintText} />
      {solved ? (
        <>
          <div className="seg-row" role="tablist">
            {['volume', 'code'].map((v) => (
              <button key={v} type="button" role="tab" aria-selected={view === v} className={'seg' + (view === v ? ' is-on' : '')} onClick={() => setView(v)}>{pick(v === 'volume' ? UI.volume : UI.code)}</button>
            ))}
          </div>
          <div className={'vc vc-' + view}>{view === 'volume' ? fig : code}</div>
          <div className="chips" translate="no">
            {['html', 'head', 'title', 'body'].map((k) => (
              <button key={k} type="button" className={'chip mono' + (part === k ? ' is-sel' : '')} style={{ '--c': TAGC[k] }} aria-pressed={part === k} onClick={() => setPart(k)}>{k}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={'ex' + (hand ? ' is-hand' : '')}>{fig}{code}</div>
          <div className="build-row">
            <span className="drag-tip">{pick(UI.dragTip)}</span>
            <div className="pieces" role="group" aria-label={pick(UI.pieces)}>
              {PIECES.filter((k) => !has(k)).map((k) => (
                <button key={k} type="button" disabled={!canTap} style={{ '--c': TAGC[k] }} aria-pressed={sel === k}
                  className={'piece mono' + (sel === k ? ' is-sel' : '') + (chipShake === k ? ' fx-no' : '') + (dnd.ghost && dnd.ghost.payload === k ? ' is-drag' : '')}
                  onPointerDown={(e) => { if (canTap) dnd.start(e, k, UI.piece[k]); }}
                  onClick={() => { setSel(sel === k ? null : k); setMsg(null); }}>
                  {UI.piece[k]}<Led on={led && !sel && k === PIECES.filter((q) => !has(q))[0]} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <DragGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// 8. ГДЕ ЗАКАНЧИВАЕТСЯ ЧАСТЬ? — пары тегов в обычном коде.
// =============================================================================
const PAIR_TAGS = ['html', 'head', 'title', 'body'];
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const mine = useMine();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [found, setFound] = useState(solved ? PAIR_TAGS.slice() : []);
  const [first, setFirst] = useState(null);         // { tag, z }
  const [last, setLast] = useState(solved ? 'head' : null);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !solved, found.length * 10 + (first ? 1 : 0));
  const tapTok = (z, el, t) => {
    if (!canTap || !t || (t.k !== 'open' && t.k !== 'close') || PAIR_TAGS.indexOf(t.tag) < 0) return;
    if (found.indexOf(t.tag) >= 0) { setLast(t.tag); sayNow(c.area[t.tag], 'explain'); return; }
    if (!first) {
      if (t.k === 'close') { st.current.misses += 1; sfx('soft', true); setMsg(c.closeFirst); sayNow(c.closeFirst, 'think'); return; }
      sfx('tap', true); setFirst({ tag: t.tag, z }); setMsg(null);
      return;
    }
    st.current.tries += 1;
    if (t.k === 'open') {
      if (t.tag === first.tag) { setFirst(null); return; }
      // Новый выбор открывающего тега — без упрёка, просто меняем начало.
      setFirst({ tag: t.tag, z }); setMsg(c.twoOpen); return;
    }
    if (t.tag !== first.tag) {
      st.current.misses += 1; sfx('soft', true);
      const m = fillL(c.otherPair, { a: '<' + first.tag + '>', b: '</' + t.tag + '>' });
      setMsg(m); sayNow(m, 'think'); return;
    }
    sfx('ok', true);
    const next = found.concat(t.tag);
    setFound(next); setFirst(null); setLast(t.tag); setMsg(null);
    if (next.length === PAIR_TAGS.length) {
      put({ done: true });
      log({ screenId: 's8', type: 'pairs', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries });
      sayNow(joinL(c.area[t.tag], c.done), 'cheer');
    } else sayNow(c.area[t.tag], 'smile');
  };
  const zone = (z, t) => {
    if (!t || (t.k !== 'open' && t.k !== 'close') || PAIR_TAGS.indexOf(t.tag) < 0) return null;
    const isF = found.indexOf(t.tag) >= 0;
    return { tap: true, disabled: !canTap, cls: (isF ? 'is-pair' : '') + (first && first.z === z ? ' is-sel' : ''), style: { '--c': TAGC[t.tag] },
      led: led && !isF && (first ? (t.k === 'close' && t.tag === first.tag && false) : t.k === 'open') };
  };
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={first ? c.picked : c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved || found.length === 4 ? c.done : first ? c.picked : c.ask} hint={found.length === 4 ? null : msg} n={found.length + '/4'} />
      <div className="pairs-box">
        <CodeLines lines={buildLines(FULL_DOC, mine)} className="cv-big" barsFor={found} hl={last} zone={zone} onZone={tapTok} />
        <div className="pairs-side">
        <div className="pair-chips" translate="no">
          {PAIR_TAGS.map((k) => (
            <span key={k} className={'pv-pc mono' + (found.indexOf(k) >= 0 ? ' is-on' : '')} style={{ '--c': TAGC[k] }}>
              {found.indexOf(k) >= 0 ? <Icon name="check" size={12} /> : null}{k}
            </span>
          ))}
        </div>
        {last ? <p className="area-note" style={{ '--c': TAGC[last] }}>{pick(c.area[last])}</p> : null}
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// 9. КОДИ ПЕРЕПУТАЛ МЕСТО — title из body в head; код и дерево вместе.
// =============================================================================
function Tree({ order, sel, onPlace, disabled, onLeafDown, hover }) {
  // Компактное дерево фактической структуры, построенное из того же порядка строк.
  const kids = (open, close) => {
    const a = order.indexOf(open), b = order.indexOf(close);
    return a < 0 || b < 0 ? [] : order.slice(a + 1, b);
  };
  const leaf = (id) => (id === 'title'
    ? <span className={'tr-leaf mono' + (onLeafDown ? ' is-drag' : '')} style={{ '--c': TAGC.title }} onPointerDown={onLeafDown ? (e) => onLeafDown(e) : undefined}>title</span>
    : id === 'text' ? <span className="tr-leaf tr-text">Aa</span> : null);
  const node = (tag, children) => (
    <div className={'tr-node' + (sel === tag ? ' is-sel' : '') + (hover === tag ? ' is-hover' : '')} style={{ '--c': TAGC[tag] }} data-place={onPlace ? tag : undefined}>
      <button type="button" className="tr-h mono" disabled={disabled} onClick={() => onPlace && onPlace(tag)}>{tag}</button>
      <div className="tr-kids">{children}</div>
    </div>
  );
  return (
    <div className="tree" translate="no">
      {node('html', [
        <React.Fragment key="h">{node('head', kids('head-o', 'head-c').map((id) => <React.Fragment key={id}>{leaf(id)}</React.Fragment>))}</React.Fragment>,
        <React.Fragment key="b">{node('body', kids('body-o', 'body-c').map((id) => <React.Fragment key={id}>{leaf(id)}</React.Fragment>))}</React.Fragment>
      ])}
    </div>
  );
}
const BAD9 = ['doctype', 'html-o', 'head-o', 'head-c', 'body-o', 'title', 'text', 'body-c', 'html-c'];
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const mine = useMine();
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [order, setOrder] = useState(solved ? FULL_DOC : BAD9);
  const [variant, setVariant] = useState('A');
  const [picked, setPicked] = useState(false);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const st = useRef({ tries: 0, misses: 0, followMiss: 0 });
  const led = useIdleLed(canTap && !solved && lad.lv >= 3, picked ? 1 : 0);
  const fixed = order.indexOf('title') === 3;
  const titleText = variant === 'A' ? mine.title : pick(L3('Mushuklar', 'Котики', 'Cats'));
  const place = (where, dragged) => {
    if (!canTap || fixed || !where) return;
    if (!picked && !dragged) { if (where === 'title') { setPicked(true); setMsg(null); sfx('tap', true); } else setMsg(c.pickTitle); return; }
    if (where === 'title') { setPicked(false); return; }
    st.current.tries += 1;
    if (where === 'head') {
      sfx('ok', true);
      setOrder(FULL_DOC); setPicked(false); setMsg(null);
      if (variant === 'A' && lad.lv >= 3) {
        sayNow(joinL(c.ok, c.again), 'smile');
        setTimeout(() => { setOrder(BAD9); setVariant('B'); lad.reset(); }, 1800);
        return;
      }
      const s = st.current;
      log({ screenId: 's9', type: 'fix-nesting', correct: true, firstTry: s.misses === 0 && lad.asked.current === 0, attempts: s.tries,
        hints: lad.asked.current, depth: lad.lv, helped: variant === 'B', followUp: variant === 'B' ? s.followMiss === 0 : null });
      put({ done: true });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    if (variant === 'B') st.current.followMiss += 1;
    sfx('soft', true);
    const m = where === 'body' ? c.inBody : c.inHtml;
    setMsg(m); sayNow(m, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const lineMap = { title: 'title', 'head-o': 'head', 'head-c': 'head', 'body-o': 'body', text: 'body', 'body-c': 'body', 'html-o': 'html', 'html-c': 'html' };
  // Строку title можно перетащить: пока она «в руке», внутри head видно место «сюда».
  const codeRef = useRef(null);
  const shownRef = useRef(order);
  const dnd = useDragDrop((payload, el) => {
    if (!el) return;
    const z = el.closest('[data-place]');
    if (z) { place(z.getAttribute('data-place'), true); return; }
    const ln = el.closest('.cv-line');
    if (ln && codeRef.current && codeRef.current.contains(ln)) place(lineMap[shownRef.current[[...ln.parentNode.children].indexOf(ln)]], true);
  });
  const hand = !fixed && (picked || !!dnd.ghost);
  const shown = hand ? order.slice(0, order.indexOf('head-o') + 1).concat([null]).concat(order.slice(order.indexOf('head-o') + 1)) : order;
  shownRef.current = shown;
  const startTitle = (e) => { if (canTap && !fixed) dnd.start(e, 'title', '<title>' + titleText + '</title>'); };
  const onCodeDown = (e) => {
    const ln = e.target.closest && e.target.closest('.cv-line');
    if (!ln || !codeRef.current || !codeRef.current.contains(ln)) return;
    if (shown[[...ln.parentNode.children].indexOf(ln)] === 'title') startTitle(e);
  };
  const hint = hintOf(lad.lv, [c.h1, c.h2, c.h3]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintOf(Math.min(3, lad.lv + 1), [c.h1, c.h2, c.h3]) || c.ask} nav={navOf(p, canGo)}>
      <div className={'rule-panel' + (fixed ? ' is-ok' : '')}><span className="rule-ic">{fixed ? <Icon name="check" size={13} /> : '!'}</span><span><b>{pick(UI.inspector)}:</b> {pick(c.rule)}</span></div>
      <Ask text={fixed ? c.ok : picked ? c.pickPlace : c.ask} hint={fixed ? null : msg} n={variant === 'B' ? pick(UI.again) : null} />
      <HintNote lv={fixed ? 0 : lad.lv} text={hint} />
      <div className="fix-row">
        <div ref={codeRef} onPointerDown={onCodeDown} className="drag-host">
          <CodeLines lines={buildLines(shown, { title: titleText, text: mine.text })} className="cv-ex"
            lineProps={(ln) => {
              if (ln.empty) return { cls: 'is-zone', empty: <DropZone place="head" hover={dnd.hover} onPick={() => place('head')} label={UI.here} /> };
              return lineMap[ln.id] && !fixed ? { onTap: () => place(lineMap[ln.id]), disabled: !canTap,
                cls: (ln.id === 'title' ? 'is-draggable' : '') + (ln.id === 'title' && (picked || dnd.ghost) ? ' is-picked' : ''), led: led && (picked ? false : ln.id === 'title') }
                : { cls: ln.id === 'title' && fixed ? 'is-new' : '' };
            }} />
        </div>
        <Tree order={order} sel={picked ? 'title' : null} onPlace={(tg) => place(tg)} disabled={!canTap || fixed} hover={dnd.hover}
          onLeafDown={fixed ? null : startTitle} />
      </div>
      {!fixed ? <span className="drag-tip">{pick(UI.dragTitle)}</span> : null}
      <DragGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// 10. ДОПИШИ ОКОНЧАНИЕ — ввод закрывающего тега, разбор ввода.
// =============================================================================
const DOC10 = { body: ['doctype', 'html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', null, 'html-c'], head: ['doctype', 'html-o', 'head-o', 'title', null, 'body-o', 'text', 'body-c', 'html-c'] };
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s10;
  const mine = useMine();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [tag, setTag] = useState('body');
  const [val, setVal] = useState(solved ? '</body>' : '');
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const st = useRef({ tries: 0, misses: 0, follow: null });
  const inputRef = useRef(null);
  const led = useIdleLed(canTap && !okNow && !val, tag === 'head' ? 1 : 0);
  // Разбор ввода по существу: что именно не так.
  const judge = (raw) => {
    const w = tagWord(raw);
    const want = '</' + tag + '>';
    if (w === want) return { ok: true };
    if (w === '<' + tag + '>') return { m: c.open };
    if (/^<[a-z]+>$/.test(w) && w.indexOf(tag) >= 0) return { m: c.open };
    if (w === '<' + tag + '/>' || w === '<\\' + tag + '>' || w === '<' + tag + '>/') return { m: c.slashPlace };
    if (w === '/' + tag + '>') return { m: c.noBracket };
    if (w === '</' + tag || w === '/' + tag || w === '</' + tag + '/' || w === tag + '>' || w === '/' + tag + '>') return { m: w.indexOf('/') < 0 ? c.noSlash : c.noBracket };
    const name = (w.match(/[a-z]+/) || [''])[0];
    if (name && name !== tag) return { m: fillL(c.otherName, { tag: want }) };
    if (w.indexOf('/') < 0) return { m: c.noSlash };
    return { m: c.noBracket };
  };
  const check = () => {
    if (!canTap || okNow || !val.trim()) return;
    st.current.tries += 1;
    const r = judge(val);
    if (r.ok) {
      sfx('win', true); setMsg(null); setOkNow(true);
      if (tag === 'body' && lad.lv >= 3) {
        sayNow(joinL(c.ok, c.sayHead), 'smile');
        setTimeout(() => { setTag('head'); setVal(''); setOkNow(false); lad.reset(); }, 1600);
        return;
      }
      if (tag === 'head') st.current.follow = st.current.headMiss ? false : true;
      const s = st.current;
      log({ screenId: 's10', type: 'write-closing', correct: true, firstTry: s.misses === 0 && lad.asked.current === 0, attempts: s.tries,
        hints: lad.asked.current, depth: lad.lv, helped: tag === 'head', followUp: s.follow });
      putAch(store, 'close', s.misses === 0 && lad.asked.current === 0 && tag === 'body' ? 'self' : 'help');
      put({ done: true });
      sayNow(tag === 'head' ? c.okHead : c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    if (tag === 'head') st.current.headMiss = true;
    sfx('soft', true);
    setMsg(r.m); sayNow(r.m, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const ins = (ch) => { setVal((v) => v + ch); if (inputRef.current) inputRef.current.focus(); };
  const hint = hintOf(lad.lv, [c.h1, c.h2, c.h3]);
  const order = okNow ? FULL_DOC : DOC10[tag];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintOf(Math.min(3, lad.lv + 1), [c.h1, c.h2, c.h3]) || c.ask} nav={navOf(p, canGo)}>
      <Ask text={okNow ? (tag === 'head' ? c.okHead : c.ok) : tag === 'head' ? c.askHead : c.ask} hint={okNow ? null : msg} n={tag === 'head' ? pick(UI.again) : null} />
      <HintNote lv={okNow ? 0 : lad.lv} text={hint} />
      <div className="work pr s10-work">
      <MiniBrowser title={mine.title} page={mine.text} flashPage={okNow ? 1 : 0} />
      <CodeLines lines={buildLines(order, mine)} className="cv-big cv-10"
        lineProps={(ln, i) => (ln.empty ? { cls: 'is-gap', empty: (
          <span className={'gap-in' + (led ? ' is-led' : '')}>
            <InlineInput value={val} onChange={(v) => { setVal(v); setMsg(null); }} onEnter={check} inputRef={inputRef} placeholder={L3('…', '…', '…')} label={tag === 'head' ? c.askHead : c.ask} max={12} cls="tk-input-tag" />
            <Led on={led} />
          </span>) } : {
            // При открытой клавиатуре видны только строки рядом с пустым местом (.is-ctx уходят).
            cls: (ln.id === tag + '-o' && lad.lv >= 1 && !okNow ? 'is-look ' : '') + (Math.abs(i - order.indexOf(null)) > 1 ? 'is-ctx' : '')
          })} />
      </div>
      {!okNow ? (
        <div className="pv-keys" role="group" translate="no">
          {['<', '/', '>'].map((k) => <button key={k} type="button" className="key-b mono" onClick={() => ins(k)} aria-label={k}>{k}</button>)}
          <button type="button" className="key-b key-erase" onClick={() => setVal((v) => v.slice(0, -1))} aria-label={pick(UI.erase)}><Icon name="undo" size={15} /></button>
          <button type="button" className="btn-accent key-check" disabled={!canTap || !val.trim()} onClick={check}>{pick(UI.check)}</button>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 12. ЗАКАЗ ДЛЯ ТЕБЯ — перенос с уменьшенной поддержкой.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const start = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };
  const [ti, setTi] = useState(solved ? 2 : 0);
  const [variant, setVariant] = useState('A');
  const [doc, setDoc] = useState(start);
  const [editing, setEditing] = useState(null);     // 'title' | 'text' — какой текст ученик выбрал для правки
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(false);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved && !okNow);
  const st = useRef({});
  const task = c.tasks[ti] || null;
  const S = () => st.current[task.id] || (st.current[task.id] = { tries: 0, misses: 0, followMiss: 0 });
  const target = task ? pick(variant === 'B' ? task.tB : task.t) : '';
  const field = task ? task.id : null;
  const hints = task ? (task.id === 'title' ? [c.h1t, c.h2t, c.h3t] : [c.h1b, c.h2b, c.h3b]) : [];
  const tapZone = (z) => {
    if (!canTap || !task || okNow) return;
    S().tries += 1;
    const want = field === 'title' ? 'title-text' : 'body-text';
    if (z === want) { setEditing(field); setVal(doc[field]); setMsg(null); sfx('tap', true); return; }
    S().misses += 1;
    if (variant === 'B') S().followMiss += 1;
    sfx('soft', true);
    const m = z === 'title-text' || z === 'body-text' ? c.wrongText : c.tag;
    setMsg(m); sayNow(m, 'think');
    if (S().misses >= 2) lad.bump();
  };
  useEffect(() => {
    if (!editing || okNow) return undefined;
    if (!same(val, target)) return undefined;
    const t = setTimeout(() => {
      const nd = Object.assign({}, doc, { [field]: val.trim() });
      setDoc(nd); setEditing(null); setOkNow(true);
      setFlash((f) => (field === 'title' ? { tab: f.tab + 1, page: f.page } : { tab: f.tab, page: f.page + 1 }));
      sfx('ok', true);
      const s = S();
      const helped = lad.lv >= 3;
      if (variant === 'A' && helped) {
        sayNow(joinL(c.ok, c.again), 'smile');
        setTimeout(() => { setVariant('B'); setOkNow(false); setDoc(nd); lad.reset(); }, 1700);
        return;
      }
      const indep = variant === 'A' && s.misses === 0 && lad.asked.current === 0;
      log({ screenId: 's12.' + field, type: 'transfer', correct: true, firstTry: indep, attempts: s.tries, hints: lad.asked.current, depth: lad.lv,
        helped: variant === 'B' || lad.lv > 0, independent: indep, followUp: variant === 'B' ? s.followMiss === 0 : null });
      putAch(store, 'place', indep ? 'self' : 'help');
      sayNow(c.ok, 'smile');
      setTimeout(() => {
        setOkNow(false); setVariant('A'); lad.reset();
        if (ti + 1 >= c.tasks.length) { put({ done: true }); setTi(2); sayNow(c.done, 'cheer'); } else setTi(ti + 1);
      }, 1500);
    }, 700);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const hint = hintOf(lad.lv, hints);
  const goal = task ? fillL(task.goal, { t: target }) : c.done;
  const showT = editing === 'title' ? val : doc.title, showB = editing === 'text' ? val : doc.text;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintOf(Math.min(3, lad.lv + 1), hints) || goal} nav={navOf(p, canGo)}>
      <div className={'goal-card' + (okNow ? ' is-ok' : '')}><span className="goal-l">{pick(UI.goal)} {task ? (ti + 1) + '/2' : ''}{variant === 'B' ? ' · ' + pick(UI.again) : ''}</span><b>{pick(goal)}</b></div>
      <Ask text={!task ? c.done : editing ? c.typeIt : c.ask} hint={okNow || !task ? null : msg} />
      <HintNote lv={okNow ? 0 : lad.lv} text={hint} />
      <div className="work pr">
        <MiniBrowser title={okText(showT) ? showT : ''} page={okText(showB) ? showB : ''} flashTab={flash.tab} flashPage={flash.page} />
        <CodeLines lines={buildLines(FULL_DOC, doc)} className="cv-pr"
          renderText={(t) => (editing && t.z === (editing === 'title' ? 'title-text' : 'body-text')
            ? <InlineInput value={val} onChange={setVal} label={goal} max={60} />
            : <span className="tk-text">{t.v}</span>)}
          zone={(z, t) => (z && !editing && task && !okNow ? { tap: true, disabled: !canTap, led: lad.lv >= 3 && z === (field === 'title' ? 'title-text' : 'body-text') } : null)}
          onZone={(z) => tapZone(z)} />
      </div>
    </Stage>
  );
}

// =============================================================================
// 13. СОЗДАЙ СВОЮ СТРАНИЦУ — плоская сборка из 8 строк, затем свои тексты.
// =============================================================================
const SLOTS13 = ['html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
const TRAY13 = ['body-c', 'title', 'html-o', 'text', 'head-c', 'html-c', 'body-o', 'head-o'];
function check13(slots) {
  const at = (id) => slots.indexOf(id);
  const bad = (ids) => ids.filter((id) => at(id) >= 0);
  if (slots[0] !== 'html-o' || slots[7] !== 'html-c') return { rule: 'html', mark: bad(['html-o', 'html-c']) };
  if (at('head-c') < at('head-o') || at('body-c') < at('body-o')) return { rule: 'pair', mark: at('head-c') < at('head-o') ? ['head-o', 'head-c'] : ['body-o', 'body-c'] };
  if (at('body-o') < at('head-o')) return { rule: 'order', mark: ['head-o', 'body-o'] };
  if (at('head-c') > at('body-o')) return { rule: 'headClose', mark: ['head-c', 'body-o'] };
  if (!(at('title') > at('head-o') && at('title') < at('head-c'))) return { rule: 'title', mark: ['title'] };
  if (!(at('text') > at('body-o') && at('text') < at('body-c'))) return { rule: 'text', mark: ['text'] };
  return null;
}
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s13;
  const mine = useMine();
  const [rec, put] = useRec('s13');
  const [phase, setPhase] = useState(rec ? (rec.done ? 'done' : 'fill') : 'build');
  const [slots, setSlots] = useState(rec ? SLOTS13.slice() : Array(8).fill(null));
  const [cur, setCur] = useState(0);                // пустое место, куда встанет следующая строка
  const [held, setHeld] = useState(null);           // строка, выбранная для перестановки
  const [res, setRes] = useState(null);             // результат проверки
  const lab = store.get('lab');
  // Поля начинаются пустыми: прошлые варианты ученика — только предложения.
  const [title, setTitle] = useState(rec && rec.title ? rec.title : '');
  const [text, setText] = useState(rec && rec.text ? rec.text : '');
  const sugT = [mine.title, lab && lab.title].filter((x, i, a) => x && a.indexOf(x) === i);
  const sugB = [mine.text, lab && lab.text].filter((x, i, a) => x && a.indexOf(x) === i);
  const [speaker, , spoken, sayNow] = useVoice([{ text: phase === 'build' ? c.say : c.fill, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(phase === 'done', spoken);
  const lad = useLadder(phase === 'build');
  const st = useRef({ checks: 0 });
  const tray = TRAY13.filter((id) => slots.indexOf(id) < 0);
  const full = slots.every(Boolean);
  const v = { title: '…', text: pick(UI.pageText) };
  const lineOf = (id) => buildLines([id], { title: '…', text: pick(UI.pageText) })[0];
  const putPiece = (id) => {
    if (!canTap) return;
    const s = slots.slice();
    let at = s[cur] === null ? cur : s.indexOf(null);
    if (at < 0) at = cur;
    s[at] = id;
    setSlots(s); setRes(null);
    const nextEmpty = s.indexOf(null);
    setCur(nextEmpty >= 0 ? nextEmpty : at);
    sfx('tap', true);
  };
  const tapSlot = (i) => {
    if (!canTap) return;
    if (!slots[i]) { setCur(i); setHeld(null); return; }
    if (held === null) { setHeld(i); return; }
    if (held === i) { setHeld(null); return; }
    // Две выбранные строки меняются местами — остальное решение не трогаем.
    const s = slots.slice(); const t = s[held]; s[held] = s[i]; s[i] = t;
    setSlots(s); setRes(null); setHeld(null); sfx('tap', true);
  };
  const removeAt = (i) => { const s = slots.slice(); s[i] = null; setSlots(s); setCur(i); setHeld(null); setRes(null); };
  const check = () => {
    if (!canTap || !full) return;
    st.current.checks += 1;
    const r = check13(slots);
    if (!r) {
      sfx('win', true); setRes(null);
      log({ screenId: 's13.build', type: 'build-flat', correct: true, firstTry: st.current.checks === 1 && lad.asked.current === 0, attempts: st.current.checks,
        hints: lad.asked.current, depth: lad.lv, independent: st.current.checks === 1 && lad.asked.current === 0 });
      putAch(store, 'build', st.current.checks === 1 && lad.asked.current === 0 ? 'self' : 'help');
      put({ build: true });
      setPhase('fill'); sayNow(c.fill, 'cheer');
      return;
    }
    sfx('soft', true); setRes(r); sayNow(c.rules[r.rule], 'think');
    if (st.current.checks >= 2) lad.bump();
  };
  useEffect(() => {
    if (phase !== 'fill' || !okText(title) || !okText(text)) return undefined;
    const t = setTimeout(() => {
      store.set('myTitle', title.trim()); store.set('myText', text.trim());
      store.set('artifact', { type: 'html-page', title: title.trim(), text: text.trim(), html: buildHtml(title.trim(), text.trim()) });
      putAch(store, 'page', 'self');
      put({ build: true, done: true, title: title.trim(), text: text.trim() });
      setPhase('done'); sfx('ok', true); sayNow(c.done, 'cheer');
    }, 1600);
    return () => clearTimeout(t);
  }, [title, text, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const hint = hintOf(lad.lv, [c.h1, c.h2, c.h3]);
  if (phase !== 'build') {
    return (
      <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.askFill} nav={navOf(p, canGo)}>
        <Ask text={phase === 'done' ? c.done : c.askFill} />
        <div className="work pr">
          <MiniBrowser title={okText(title) ? title : ''} page={okText(text) ? text : ''} />
          <MiniDoc title={title} text={text}
            editTitle={<InlineInput value={title} onChange={setTitle} label={C.s4.ask} max={40} placeholder={SAMPLE.title} />}
            editText={<InlineInput value={text} onChange={setText} label={C.s5.ask} max={70} placeholder={SAMPLE.text} />} />
        </div>
        {phase === 'fill' ? (
          <div className="sugg" translate="no">
            <span className="lab-ideas-l">{pick(UI.ideas)}:</span>
            {sugT.map((x) => <button key={'t' + x} type="button" className="opt-chip sm sugg-t" onClick={() => setTitle(x)}><Tag tag="title" />{x}</button>)}
            {sugB.map((x) => <button key={'b' + x} type="button" className="opt-chip sm sugg-b" onClick={() => setText(x)}><Tag tag="body" />{x}</button>)}
          </div>
        ) : null}
      </Stage>
    );
  }
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintOf(Math.min(3, lad.lv + 1), [c.h1, c.h2, c.h3]) || c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={res ? c.rules[res.rule] : null} n={slots.filter(Boolean).length + '/8'} />
      <HintNote lv={lad.lv} text={hint} />
      <div className="s13-row">
      {/* Тот же вид кода, что во всём уроке: номера строк, отступы и цветные скобки
          вложенности считаются по текущему порядку строк. Пустое место — пунктир. */}
      <CodeLines lines={buildLines(['doctype'].concat(slots), v)} className="cv-ex cv-flat"
        lineProps={(ln, i) => {
          if (i === 0) return { cls: 'is-fixed' };
          const k = i - 1;
          const id = slots[k];
          const marked = res && id && res.mark.indexOf(id) >= 0;
          return {
            onTap: () => tapSlot(k), disabled: !canTap,
            cls: (!id && cur === k ? 'is-cur' : '') + (held === k ? ' is-held' : '') + (marked ? ' is-mark' : ''),
            empty: <span className="flat-dash" aria-label={pick(UI.slot) + ' ' + (i + 1)} />
          };
        }} />
      <div className="s13-side">
      {tray.length ? (
        <div className="pool" role="group" aria-label={pick(UI.pieces)} translate="no">
          {tray.map((id) => {
            const ln = lineOf(id);
            return (
              <button key={id} type="button" disabled={!canTap} className="pool-chip" onClick={() => putPiece(id)}>
                {ln.toks.map((t, j) => (t.k === 'text' ? <span key={j} className="tk-text">{t.v}</span> : <Tag key={j} tag={t.tag} close={t.k === 'close'} />))}
              </button>
            );
          })}
        </div>
      ) : (
        <button type="button" className="bigbtn" disabled={!canTap} onClick={check}><span className="bigbtn-in"><Icon name="check" size={18} />{pick(UI.check)}</span></button>
      )}
      {held !== null && slots[held] ? <button type="button" className="btn-ghost flat-remove" onClick={() => removeAt(held)}>{pick(UI.remove)}</button> : null}
      {slots.some(Boolean) ? <p className="swap-note">{pick(UI.swapNote)}</p> : null}
      </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// 14. ТВОЯ СТРАНИЦА НА ЭКРАНЕ BOB — финал: Bob со всеми слоями показывает
// страницу ученика, рядом её код; подтверждённые достижения.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s14;
  const mine = useMine();
  const ach = store.get('ach') || {};
  const [view, setView] = useState('bob');
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const list = ['place', 'build', 'close', 'page'].filter((k) => ach[k]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <div className="fin-head"><span className="fin-author">{pick(UI.author)}: <b>{p.name}</b></span></div>
      <div className="seg-row only-phone" role="tablist">
        {['bob', 'code'].map((v) => (
          <button key={v} type="button" role="tab" aria-selected={view === v} className={'seg' + (view === v ? ' is-on' : '')} onClick={() => setView(v)}>{pick(v === 'bob' ? UI.bob : UI.code)}</button>
        ))}
      </div>
      <div className={'rb-fin' + (view === 'code' ? ' is-code' : '')}>
        <div className="rb-fin-bob">
          <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: mine.title, scr2: shortTxt(mine.text, 22) }} label={UI.robot} />
        </div>
        <div className="rb-fin-code">
          <MiniBrowser title={mine.title} page={mine.text} compact />
          <CodeLines lines={buildLines(FULL_DOC, mine)} className="cv-pr" />
        </div>
        <div className="rb-fin-side">
      <div className="ach" aria-label={pick(UI.done)}>
        {list.map((k) => (
          <span key={k} className={'ach-i' + (ach[k] === 'self' ? ' is-self' : '')}><span className="ach-m"><Icon name={ach[k] === 'self' ? 'star' : 'check'} size={12} /></span>{pick(c.ach[k][ach[k] === 'self' ? 'self' : 'help'])}</span>
        ))}
      </div>
      <div className="fin-foot">
        <p className="final-note">{pick(UI.saveNote)}</p>
        <div className="bye-next next-card">
          <span className="bye-next-ic"><Icon name="doc" size={22} /></span>
          <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(UI.next)}</b></span>
          <span className="next-tags mono" translate="no">h1 · p</span>
        </div>
      </div>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 'r1', code: 'HOOK', Comp: R1 }, { id: 'r2', code: 'WHY', Comp: R2 }, { id: 'm', code: 'MISSION', Comp: M },
  { id: 's1', code: 'SHOW', Comp: S1 }, { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'CHECK-1', Comp: S6 },
  { id: 's7', code: 'LEVEL-3', Comp: S7 }, { id: 's8', code: 'LEVEL-4', Comp: S8 }, { id: 's9', code: 'CHECK-2', Comp: S9 },
  { id: 's10', code: 'CHECK-3', Comp: S10 }, { id: 's12', code: 'CHECK-4', Comp: S12 },
  { id: 's13', code: 'RESULT', Comp: S13 }, { id: 's14', code: 'ACHIEVEMENT', Comp: S14 }
];
// «Повторить» стирает только экран; тексты ученика (myTitle, myText,
// artifact) и достижения (ach) сохраняются.
const SCREEN_RESET = { r1: ['r1'], r2: ['r2'], m: ['m', 'mc'], s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'],
  s9: ['s9'], s10: ['s10'], s12: ['s12'], s13: ['s13'] };

export default function HtmlStrukturaRobot({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store), achievements: store.get('ach') || {} })
  });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@LESSON1_CSS@*/
/*@ISO_CSS@*/
/*@FIG_CSS@*/
/*@OWN_CSS@*/
`;
