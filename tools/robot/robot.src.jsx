// =============================================================================
// == ТЕСТОВЫЙ УРОК · «Структура HTML-документа — робот Pixel» (проба урока 1) ===
//
// Переделка урока 1 курса HTML по отзывам учеников (17.10.2026). Отзывы стоят
// выше навыка /novyy-urok:
//   • «зачем это нужно» — в начале: робот Pixel собирается из трёх слоёв (детали ·
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
// Поэтому в речи у Pixel нет «головы», а head везде — «паспорт страницы».
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
    uz: 'HTML hujjat tuzilishi: robot Piksel',
    ru: 'Структура HTML-документа: робот Пиксель',
    en: 'HTML document structure: robot Pixel'
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

// Игра «Битва знаний» — страница, которую показывает Pixel и которую разбирает урок.
const SAMPLE = {
  title: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  text: L3('Salom! O‘yinga xush kelibsiz!', 'Привет! Добро пожаловать в игру!', 'Hi! Welcome to the game!')
};

const UI = {
  tab: L3('Yorliqda', 'Вкладка', 'Tab'),
  page: L3('Sahifa', 'Страница', 'Page'),
  window: L3('Sahifada', 'Окно', 'Window'),
  code: L3('Kod', 'Код', 'Code'),
  volume: L3('3D ko‘rinish', 'Объём', 'Volume'),
  inspector: L3('Tuzilma qoidasi', 'Правило структуры', 'Structure rule'),
  changeTitle: L3('Nomni o‘zgartirish', 'Поменять название', 'Change the name'),
  changeText: L3('Matnni o‘zgartirish', 'Поменять текст', 'Change the text'),
  was: L3('Avval', 'Было', 'Before'),
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
  labels: { start: L3('Ochuvchi', 'Начало', 'Start'), content: L3('Mazmun', 'Содержимое', 'Content'), end: L3('Yopuvchi', 'Конец', 'End') },
  pieces: L3('Detallar', 'Детали', 'Pieces'),
  piece: { head: '<head>…</head>', body: '<body>…</body>', title: '<title>…</title>' },
  dragTip: L3('Detalni kodga sudrang yoki avval detalni, keyin joyni bosing', 'Перетащи деталь в код — или нажми на неё, потом на место', 'Drag a piece into the code, or tap it and then the place'),
  dragTitle: L3('title qatorini head bo‘limiga sudrang yoki avval qatorni, keyin joyni bosing', 'Перетащи строку title внутрь head — или нажми её, потом место', 'Drag the title line into head, or tap it and then the place'),
  here: L3('shu yerga: head ichiga', 'сюда: внутрь head', 'here: into head'),
  intoHtml: L3('html ichiga', 'внутрь html', 'into html'),
  intoHead: L3('head ichiga', 'внутрь head', 'into head'),
  intoBody: L3('body ichiga', 'внутрь body', 'into body'),
  pageText: L3('sahifadagi matn', 'текст страницы', 'page text'),
  slot: L3('joy', 'место', 'slot'),
  swapNote: L3('Qatorni boshqa qator ustiga suring yoki ikkalasini bosing — ular joy almashadi.', 'Перетащи строку на другую (или нажми обе) — они поменяются местами.', 'Drag a line onto another (or tap both): they swap places.'),
  noTags: L3('Bu yerga faqat so‘z yozing, < va > belgilarisiz.', 'Здесь только слова, без уголков.', 'Only words here, no angle brackets.'),
  ideas: L3('G‘oyalar', 'Идеи', 'Ideas'),
  goal: L3('Buyurtma', 'Заказ', 'Order'),
  forExample: L3('Masalan', 'Например', 'For example'),
  scheme: L3('Tuzilma', 'Структура', 'Structure'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  // Робот Pixel
  robot: L3('Robot Piksel: korpus, ekran, qo‘llar, oyoqlar, antenna', 'Робот Пиксель: корпус, экран, руки, ноги, антенна', 'Robot Pixel: case, screen, arms, legs, antenna'),
  pixel: L3('Piksel', 'Пиксель', 'Pixel'),
  layers: {
    html: { name: 'HTML', sub: L3('Detallar', 'Детали', 'Parts') },
    css: { name: 'CSS', sub: L3('Ko‘rinish', 'Вид', 'Look') },
    js: { name: 'JavaScript', sub: L3('Harakat', 'Движение', 'Moves') }
  },
  scr2: L3('1-savol', 'Вопрос 1', 'Question 1'),
  gameQ: L3('1-savol: o‘rgimchakning nechta oyog‘i bor?', 'Вопрос 1: сколько ног у паука?', 'Question 1: how many legs does a spider have?'),
  openScreen: L3('Ekranni ochish', 'Открыть экран', 'Open the screen'),
  passport: L3('Pasport: sahifa nomi va boshqa ma’lumotlar', 'Паспорт: название и настройки страницы', 'Passport: the page name and settings'),
  tabPin: L3('← yorliq', '← вкладка', '← tab')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения, одна мысль. Похвала — эмоция
// и что получилось (банк — навык novyy-urok, pohvala.md). Теги в речи — только
// там, где без них нельзя. Звучат: say, cast, on, ok, miss, h1–h3 …;
// печатаются: eyebrow, ask, btn, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  r1: {
    eyebrow: L3('Robot Piksel', 'Робот Пиксель', 'Robot Pixel'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men Kodi, dasturchi robotman. Bu mening loyiham — robot Piksel. Hozircha u ko‘rinmayapti.',
        'Привет! Я Коди, робот-программист. А это мой проект — робот Пиксель. Пока его не видно.',
        'Hi! I’m Kodi, a programmer robot. This is my project, robot Pixel. You can’t see him yet.') },
      { pose: 'point', text: L3('Piksel uchta qatlamdan iborat. Ularni birma-bir yoqing!',
        'Пиксель собран из трёх слоёв. Включи их по очереди!',
        'Pixel is built from three layers. Turn them on one by one!') }
    ],
    on: {
      html: L3('Voy, detallar paydo bo‘ldi: korpus, ekran, qo‘llar va oyoqlar! HTML Piksel nimalardan tuzilganini belgilaydi.',
        'Ого, появились детали: корпус, экран, руки, ноги! Это HTML — из чего сделан Пиксель.',
        'Whoa, the parts appeared: the case, screen, arms and legs! That’s HTML: what Pixel is made of.'),
      css: L3('Ana, endi Piksel rang-barang! CSS uning tashqi ko‘rinishini belgilaydi.',
        'Теперь Пиксель цветной! Это CSS — внешний вид.',
        'Now Pixel has colours! That’s CSS: the look.'),
      js: L3('Zo‘r, Piksel sizga qo‘l silkitayapti! JavaScript unga harakat beradi.',
        'А теперь Пиксель машет тебе! Это JavaScript — движения.',
        'And now Pixel is waving at you! That’s JavaScript: the moves.')
    },
    done: L3('Har qanday sayt shunday tuzilgan: detallar, ko‘rinish va harakat. Eng asosiysi — HTML, usiz sahifada hech narsa ko‘rinmaydi. Shuning uchun biz HTML bilan boshlaymiz!',
      'Так устроен и каждый сайт: детали, вид, движение. Главное — HTML: без него ничего нет. С него и начнём!',
      'Every website works the same way: parts, look, moves. The key one is HTML: without it there’s nothing. That’s where we start!'),
    next: {
      css: L3('Endi «Ko‘rinish» qatlamini yoqing — bu CSS.', 'Теперь включи следующий слой — «Вид», это CSS.', 'Now turn on the next layer, “Look”: that’s CSS.'),
      js: L3('Oxirgi qatlam qoldi: «Harakat», ya’ni JavaScript. Uni yoqing!', 'А теперь последний — включи «Движение», это JavaScript!', 'Now the last one: turn on “Moves”, that’s JavaScript!')
    },
    off: L3('Ko‘rdingizmi? HTML qatlami o‘chirilganda, Piksel ko‘rinmay qoladi.', 'Видишь? Без HTML исчез весь Пиксель.', 'See? Without HTML, all of Pixel is gone.'),
    ask: L3('Qatlamlarni birma-bir yoqing', 'Включи слои по очереди', 'Turn the layers on one by one'),
    askOne: L3('«{x}» qatlamini yoqing', 'Включи слой «{x}»', 'Turn on the “{x}” layer'),
    askDone: L3('Qatlamlarni o‘chirib, qayta yoqish mumkin', 'Слои можно выключать и включать', 'You can switch the layers off and on')
  },

  r2: {
    eyebrow: L3('Piksel ekrani', 'Экран Пикселя', 'Pixel’s screen'),
    say: L3('Pikselning ko‘kragidagi ekranda «Bilimlar jangi» o‘yini ochiq. Ekranni bosing — ichiga qaraymiz!',
      'На груди у Пикселя экран, а на нём игра «Битва знаний». Нажми на экран — заглянем внутрь!',
      'Pixel has a screen on his chest with the game “Battle of Knowledge”. Tap the screen and let’s look inside!'),
    tab: L3('Voy, bu oddiy veb-sahifa ekan! Brauzerning yuqorisidagi kichik yorliqqa qarang — unda «Bilimlar jangi» deb yozilgan. Bu sahifaning nomi.',
      'Это обычная веб-страница! В самом верху, на вкладке, — её название: «Битва знаний».',
      'It’s a normal web page! At the very top, on the tab, is its name: “Battle of Knowledge”.'),
    win: L3('Pastdagi katta oynada esa sahifadagi matn — o‘yin savoli. O‘yinchi aynan shuni ko‘radi.',
      'А ниже, в окне, — содержимое страницы: вопрос игры. Его и видит игрок.',
      'And below, in the window, is the page content: the game question. That’s what the player sees.'),
    code: L3('Yonidagi matn — sahifaning kodi. Brauzer shu kodni o‘qib, sahifada nimani ko‘rsatishni biladi. Bu yerda ranglar yo‘q — bu faqat HTML.',
      'А рядом — её код: текст с подсказками для браузера. Браузер читает его и рисует страницу. Цветов нет — это только HTML.',
      'And next to it is its code: text with instructions for the browser. The browser reads it and draws the page. No colours: this is just HTML.'),
    done: L3('Internetdagi har bir sayt shunday kod bilan yozilgan. Bugun siz ham o‘rganasiz, dars oxirida esa o‘z sahifangiz Pikselning ekranida paydo bo‘ladi!',
      'Каждый сайт в интернете написан так. Сегодня научишься и ты, а в конце твоя страница появится на экране у Пикселя!',
      'Every website on the internet is written like this. Today you’ll learn how, and at the end your page will appear on Pixel’s screen!'),
    ask: L3('Piksel ekranini bosing', 'Нажми на экран Пикселя', 'Tap Pixel’s screen'),
    askDone: L3('Bu — sahifa kodi. Dars oxirigacha uning har bir qatorini tushunib olasiz', 'Это код страницы. К концу урока будет понятна каждая строчка', 'This is the page’s code. By the end you’ll understand every line')
  },

  m: {
    eyebrow: L3('Dars rejasi', 'Наш план', 'Our plan'),
    say: L3('Darsimiz uch qadamdan iborat.', 'Вот наш план — три шага.', 'Here’s our plan: three steps.'),
    steps: [
      { icon: 'doc', text: L3('Sahifa ichini ko‘rish', 'Заглянуть внутрь страницы', 'Look inside a page'),
        say: L3('Avval sahifaning ichiga qaraymiz va u qanday qismlardan iboratligini bilib olamiz.',
          'Сначала заглянем внутрь страницы и узнаем, из каких частей она состоит.',
          'First we look inside a page and find out what parts it has.') },
      { icon: 'listN', text: L3('Konstruktordek yig‘ish', 'Собрать как конструктор', 'Build it like a kit'),
        say: L3('Keyin sahifani qismlardan, xuddi konstruktordek yig‘amiz.',
          'Потом соберём страницу из частей, как конструктор.',
          'Then we put a page together from parts, like a kit.') },
      { icon: 'browser', text: L3('Sahifangiz — Pikselning ekranida', 'Твоя страница — на экране Пикселя', 'Your page on Pixel’s screen'),
        say: L3('Oxirida o‘z sahifangizni yaratasiz va u Pikselning ekranida paydo bo‘ladi!',
          'А в конце сделаешь свою страницу — и она появится на экране у Пикселя!',
          'And at the end you’ll make your own page, and it will appear on Pixel’s screen!') }
    ],
    done: L3('Reja tayyor! Endi sizga doim yordam beradigan ikkita tugmani ko‘rsataman.',
      'План готов! Теперь покажу две кнопки, которые всегда выручат.',
      'The plan is ready! Now let me show you two buttons that always help.'),
    coach: [
      { id: 'hint', sel: '.chrome-side .ctl-hint', icon: 'bulb',
        title: L3('«Maslahat» tugmasi', 'Кнопка «Подсказка»', 'The “Hint” button'),
        text: L3('Nima qilishni bilmasangiz, shu tugmani bosing — men yordam beraman. Hoziroq bosib ko‘ring!',
          'Не знаешь, что делать? Жми сюда — подскажу. Попробуй прямо сейчас!',
          'Not sure what to do? Tap here and I’ll help. Try it right now!') },
      { id: 'pause', sel: '.chrome-side .ctl-btn:not(.is-exit):not(.ctl-hint)', icon: 'pause',
        title: L3('«Pauza» tugmasi', 'Кнопка «Пауза»', 'The “Pause” button'),
        text: L3('Biroz tanaffus qilmoqchimisiz? «Pauza» tugmasini bosing. Hozir sinab ko‘ring!',
          'Нужно отвлечься? Жми «Паузу». Попробуй!',
          'Need a break? Tap “Pause”. Try it!'),
        text2: L3('Dars to‘xtatildi. Davom etish uchun tugmani yana bosing.',
          'Урок на паузе. Нажми ещё раз — и продолжим.',
          'The lesson is paused. Tap again and we’ll carry on.') }
    ],
    hintSay: L3('Ko‘rdingizmi? «Maslahat» tugmasi doim nima qilish kerakligini aytib beradi.', 'Вот так: подсказка всегда скажет, что делать.', 'Like that: the hint always tells you what to do.'),
    ready: L3('Zo‘r, hammasi tayyor! Boshladik!', 'Отлично, всё готово! Поехали!', 'Great, all set! Let’s go!'),
    ask: L3('Rejani tinglang', 'Послушай план', 'Listen to the plan')
  },

  s1: {
    eyebrow: L3('Ikkita yozuv', 'Две надписи', 'Two labels'),
    say: L3('Har bir sahifada ikkita yozuv bor: yorliqdagi nom va sahifadagi matn. Ulardan birini o‘zgartirib ko‘ring!',
      'У каждой страницы есть две надписи: название на вкладке и текст в окне. Поменяй любую!',
      'Every page has two labels: the name on the tab and the text in the window. Change either one!'),
    done: L3('Ana, sahifa o‘zgardi! Endi bu ichkarida qanday ishlashini bilib olamiz.',
      'Есть! Страница поменялась. Сейчас узнаем, как это работает изнутри.',
      'Yes! The page changed. Now let’s find out how it works inside.'),
    titles: [L3('Futbol viktorinasi', 'Футбольная викторина', 'Football quiz'), L3('Kosmos o‘yini', 'Космическая игра', 'Space game'), L3('Mening saytim', 'Мой сайт', 'My site')],
    texts: [L3('O‘yin boshlandi!', 'Игра началась!', 'The game has started!'), L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'), L3('Kim birinchi?', 'Кто первый?', 'Who’s first?')],
    ask: L3('Nimani o‘zgartiramiz?', 'Что поменяем?', 'What shall we change?'),
    askPick: L3('Variantlardan birini tanlang', 'Выбери вариант', 'Choose an option'),
    askDone: L3('Yana sinab ko‘ring yoki «Davom etish» tugmasini bosing', 'Попробуй ещё или нажми «Дальше»', 'Try another one or tap “Next”')
  },

  s2: {
    eyebrow: L3('Sahifa nomi kodda', 'Название в коде', 'The name in code'),
    say: L3('Sahifa nomi kodda shunday yoziladi. Qarang: bu qatorda uchta qism bor.',
      'Вот как название записано в коде. Смотри: в строке три части.',
      'Here’s how the name is written in code. Look: the line has three parts.'),
    parts: {
      start: L3('Bu — ochuvchi teg. U sahifa nomi qayerdan boshlanishini bildiradi.',
        'Это открывающий тег — начало. Он говорит браузеру: здесь начинается название страницы.',
        'This is the opening tag, the start. It tells the browser: the page name starts here.'),
      content: L3('O‘rtadagi matn — mazmun, ya’ni sahifa nomining o‘zi. Brauzer uni yuqoridagi yorliqda ko‘rsatadi. Qarang!',
        'А это само название. Его видно на вкладке — в самом верху браузера. Смотри!',
        'And this is the name itself. It shows on the tab, at the very top of the browser. Look!'),
      end: L3('Bu — yopuvchi teg. Undagi qiya chiziq nom shu yerda tugashini bildiradi. Teglarning o‘zi sahifada ko‘rinmaydi.',
        'Это закрывающий тег — конец. То же слово, только с косой чертой. Сами теги на странице не видны.',
        'This is the closing tag, the end. The same word, but with a slash. The tags themselves aren’t shown on the page.')
    },
    quiz: L3('Endi tekshiramiz: men so‘rayman, siz esa kerakli qismni bosasiz!', 'А теперь проверим: я спрашиваю — ты нажимаешь!', 'Now let’s check: I ask, you tap!'),
    q: {
      start: L3('Qaysi biri ochuvchi teg?', 'Где начало тега?', 'Where’s the start of the tag?'),
      content: L3('Qaysi matn brauzer yorlig‘ida ko‘rinadi?', 'Где содержимое — то, что видно на вкладке?', 'Where’s the content, the part shown on the tab?'),
      end: L3('Qaysi biri yopuvchi teg?', 'А где конец тега?', 'And where’s the end of the tag?')
    },
    ok: {
      start: L3('To‘g‘ri! Ochuvchi tegda qiya chiziq yo‘q.', 'Есть! Начало — тег без косой черты.', 'Yes! The start is the tag without a slash.'),
      content: L3('Ha, aynan shu! Mazmun ikki teg orasida turadi.', 'Точно! Содержимое — между тегами.', 'Spot on! The content sits between the tags.'),
      end: L3('Zo‘r! Yopuvchi tegda qiya chiziq bor.', 'В точку! Конец — тег с косой чертой.', 'Nailed it! The end is the tag with a slash.')
    },
    miss: {
      start: L3('Hechqisi yo‘q. Siz bosgan qism — ochuvchi teg: unda qiya chiziq yo‘q.', 'Почти! Здесь нет косой черты — это начало.', 'Almost! This one has no slash, so it’s the start.'),
      content: L3('Qarang: siz bosgan qism — teglar orasidagi matn, ya’ni mazmun.', 'Почти! Это текст без уголков — это содержимое.', 'Almost! This is text without angle brackets, so it’s the content.'),
      end: L3('Yana bir qarang: siz bosgan qism — yopuvchi teg, unda qiya chiziq bor.', 'Почти! Здесь есть косая черта — это конец.', 'Almost! This one has a slash, so it’s the end.')
    },
    hint: {
      start: L3('Ochuvchi teg — chapdagi, qiya chiziqsiz yozuv.', 'Начало — запись слева, без косой черты.', 'The start is the one on the left, without a slash.'),
      content: L3('Mazmun — ikki teg orasidagi so‘zlar.', 'Содержимое — слова посередине.', 'The content is the words in the middle.'),
      end: L3('Yopuvchi teg — o‘ngdagi, qiya chiziqli yozuv.', 'Конец — запись справа, с косой чертой.', 'The end is the one on the right, with the slash.')
    },
    done: L3('Ajoyib! Ochuvchi teg, mazmun va yopuvchi teg — sahifaning har bir qismi shunday yoziladi.',
      'Огонь! Начало, содержимое, конец — так устроена каждая часть страницы.',
      'Awesome! Start, content, end: every part of a page is built like this.'),
    askWatch: L3('Tinglang va qatorga qarang', 'Слушай и смотри на строку', 'Listen and watch the line'),
    follow: L3('Mana yana bir qator. Yana javob bering!', 'Ещё одна строка — снова отвечай!', 'One more line: answer again!')
  },

  s3: {
    eyebrow: L3('Sahifa ichida', 'Внутри страницы', 'Inside the page'),
    say: L3('Bu — sahifaning modeli, u shkafga o‘xshaydi. Uni ochish uchun eshikchasini bosing!',
      'Это модель страницы — как шкаф. Открой его: нажми на дверцу!',
      'This is a model of the page, like a cabinet. Open it: tap the door!'),
    html: L3('html — butun sahifani o‘z ichiga oladigan shkaf. Uning ichida head va body tortmalari bor.',
      'Весь шкаф — это html: в нём вся страница целиком. Внутри — два ящика.',
      'The whole cabinet is html: the entire page is inside it. There are two drawers inside.'),
    head: L3('head tortmasida sahifa haqidagi ma’lumotlar saqlanadi — xuddi pasportdagidek. Bu tortma sahifada ko‘rinmaydi, lekin unda sahifa nomi bor.',
      'head — паспорт страницы. В окне его не видно, но в нём хранится название.',
      'head is the page’s passport. You don’t see it in the window, but the name is kept in it.'),
    title: L3('Mana u! Sahifa nomi title teglari orasiga yoziladi, title esa head ichida turadi. Brauzer bu nomni yuqoridagi yorliqda ko‘rsatadi.',
      'Вот оно! title — название для вкладки. Видишь, вкладка подсветилась?',
      'There it is! title is the name for the tab. See the tab light up?'),
    body: L3('body — sahifada ko‘rinadigan hamma narsa joylashadigan tortma. Matn, rasm va tugmalar shu yerda bo‘ladi.',
      'body — тело страницы: всё, что видно в окне. Текст, картинки, кнопки — всё здесь.',
      'body is the page’s body: everything you see in the window. Text, pictures, buttons: it all goes here.'),
    doctype: L3('Bu — har bir sahifaning birinchi qatori. U doim bir xil bo‘ladi va brauzerga bu HTML sahifa ekanini bildiradi.',
      'Это первая строка любой страницы. Она всегда одинаковая и говорит браузеру: это HTML-страница.',
      'This is the first line of every page. It’s always the same and tells the browser: this is an HTML page.'),
    needHead: L3('E’tibor bering: title head tortmasi ichida turadi. Avval head tortmasini oching.', 'title лежит внутри head. Сначала открой head.', 'title lies inside head. Open head first.'),
    done: L3('Zo‘r! html — butun sahifa, head — sahifa haqidagi ma’lumotlar va nom, body — sahifada ko‘rinadigan hamma narsa.',
      'Супер! html — вся страница, head — паспорт с названием, body — всё, что в окне.',
      'Super! html is the whole page, head is the passport with the name, body is everything in the window.'),
    next: {
      html: L3('Eshikchani bosing', 'Нажми на дверцу', 'Tap the door')
    },
    pickOne: L3('Endi tortmalardan birini oching: head yoki body.', 'Открой любой ящик — нажми head или body.', 'Open either drawer: tap head or body.'),
    other: L3('Endi ikkinchi tortma — {x} tortmasini oching.', 'Теперь открой другой ящик — {x}.', 'Now open the other drawer: {x}.'),
    lastTitle: L3('head tortmasida title kartochkasi qoldi. Uni bosing.', 'В паспорте осталась карточка. Нажми на title.', 'There’s a card left in the passport. Tap title.'),
    sum0: L3('Zo‘r! Endi takrorlaymiz: shkaf, kod va brauzerga qarang.', 'Супер! Повторим — смотри на шкаф, код и браузер.', 'Super! Let’s recap: watch the cabinet, the code and the browser.'),
    sumHtml: L3('html — butun sahifa.', 'html — вся страница целиком.', 'html is the whole page.'),
    sumHead: L3('head — sahifa haqidagi ma’lumotlar tortmasi, unda yorliqdagi nom saqlanadi.', 'head — паспорт страницы, в нём название для вкладки.', 'head is the page’s passport, with the name for the tab.'),
    sumBody: L3('body — sahifada ko‘rinadigan hamma narsa.', 'body — всё, что видно в окне.', 'body is everything you see in the window.'),
    ask: L3('Sahifa shkafini oching', 'Открой шкаф страницы', 'Open the page cabinet'),
    askDone: L3('Hammasi ochildi! Qismlarni yana bosish mumkin', 'Всё открыто! Части можно нажимать ещё', 'All open! You can tap the parts again')
  },

  s4: {
    eyebrow: L3('O‘yin nomi', 'Имя игры', 'Name the game'),
    say: L3('title ichidagi nomni o‘zgartiring: tayyor variantni tanlang yoki o‘zingiz yozing. Yorliqqa qarang!',
      'Поменяй название внутри title: выбери готовое или напиши своё. Смотри на вкладку!',
      'Change the name inside title: pick one or type your own. Watch the tab!'),
    done: L3('Zo‘r! Yorliqdagi nom o‘zgardi — brauzer uni title ichidan oladi. Sahifadagi matn esa avvalgidek qoldi.',
      'Вау, у вкладки новое имя! Его берут из title, а окно не изменилось.',
      'Wow, the tab has a new name! It comes from title, and the window didn’t change.'),
    opts: [L3('Mening o‘yinim', 'Моя игра', 'My game'), L3('Futbol viktorinasi', 'Футбольная викторина', 'Football quiz'), L3('Kosmos klubi', 'Клуб космоса', 'Space club')],
    ask: L3('title ichidagi nomni o‘zgartiring', 'Измени название внутри title', 'Change the name inside title')
  },

  s5: {
    eyebrow: L3('O‘yinchilarga', 'Игрокам', 'To the players'),
    say: L3('Endi body navbati. Uning ichidagi matn sahifada ko‘rinadi. O‘yinchilarga salom yozing: tayyor so‘zlarni bosing yoki o‘zingiz yozing.',
      'Теперь body. Всё, что внутри него, видно в окне. Напиши игрокам приветствие: нажимай слова или печатай.',
      'Now body. Everything inside it shows in the window. Write a greeting to the players: tap words or type.'),
    done: L3('Ana, matn sahifada paydo bo‘ldi! Sahifani ochgan har bir kishi uni ko‘radi.',
      'Есть! Текст появился в окне. Его увидит каждый, кто откроет страницу.',
      'Yes! The text appeared in the window. Everyone who opens the page will see it.'),
    words: [L3('Salom!', 'Привет!', 'Hi!'), L3('Bu', 'Это', 'This'), L3('mening', 'моя', 'is my'), L3('o‘yinim.', 'игра.', 'game.'), L3('Kim', 'Кто', 'Who'), L3('birinchi?', 'первый?', 'is first?'), L3('Boshladik!', 'Поехали!', 'Let’s go!')],
    ask: L3('body ichiga sahifadagi matnni yozing', 'Напиши текст страницы внутри body', 'Write the page text inside body')
  },

  s6: {
    eyebrow: L3('Avval taxmin qiling', 'Угадай заранее', 'Guess first'),
    rounds: {
      title: { want: 'tab', text: L3('Sport', 'Спорт', 'Sports'), extra: L3('Musiqa', 'Музыка', 'Music'),
        ask: L3('title ichiga «{t}» yoziladi. Bu so‘z qayerda ko‘rinadi?', 'В title будет «{t}». Где появится это слово?', 'title will say “{t}”. Where will this word appear?') },
      body: { want: 'page', text: L3('Bugun final!', 'Сегодня финал!', 'The final is today!'), extra: L3('Men chizishni yaxshi ko‘raman.', 'Я люблю рисовать.', 'I love drawing.'),
        ask: L3('body ichiga «{t}» yoziladi. Bu matn qayerda ko‘rinadi?', 'В body будет «{t}». А где появится этот текст?', 'body will say “{t}”. Where will this text appear?') }
    },
    say: L3('Hozir kodga yangi so‘z qo‘shiladi. U qayerda ko‘rinishini taxmin qiling: yorliqdami yoki sahifadami? Javobingizni bosing — keyin tekshirib ko‘ramiz!',
      'Сейчас в код попадёт новое слово. Угадай, где оно появится: на вкладке или в окне? Нажми свой ответ — и запустим!',
      'A new word is about to go into the code. Guess where it will appear: on the tab or in the window? Tap your answer and we’ll run it!'),
    okTab: L3('To‘g‘ri! title ichidagi nom yorliqda ko‘rinadi, sahifadagi matn esa o‘zgarmaydi.', 'Точно! title поменял вкладку, а окно не тронул.', 'Spot on! title changed the tab and left the window alone.'),
    okPage: L3('Aynan shunday! body ichidagi matn sahifada ko‘rinadi, yorliqdagi nom esa o‘zgarmaydi.', 'В точку! Текст из body — в окне, вкладка прежняя.', 'Nailed it! The text from body is in the window; the tab stayed the same.'),
    missTab: L3('Qarang: so‘z yorliqda paydo bo‘ldi. title ichidagi matn — bu yorliqdagi nom. Yana bir misol ko‘ramiz!', 'Смотри: слово попало на вкладку. title — это имя вкладки. Ещё пример!', 'Look: the word went to the tab. title is the tab’s name. One more!'),
    missPage: L3('Qarang: matn sahifada paydo bo‘ldi. body ichidagi matn sahifaning o‘zida ko‘rinadi. Yana bir misol ko‘ramiz!', 'Смотри: текст появился в окне. body — это то, что в окне. Ещё пример!', 'Look: the text appeared in the window. body is what’s in the window. One more!'),
    done: L3('Zo‘r! title ichidagi nom — yorliqda, body ichidagi matn — sahifada.', 'Чётко! title — для вкладки, body — для окна.', 'Spot on! title is for the tab, body is for the window.')
  },

  s7: {
    eyebrow: L3('Konstruktor', 'Конструктор', 'Build kit'),
    say: L3('Endi sahifani konstruktordek yig‘ing. Avval detalni tanlang, keyin uni qo‘yadigan joyni bosing.',
      'Теперь собери страницу, как конструктор: выбери деталь, потом её место.',
      'Now build the page like a kit: choose a piece, then its place.'),
    ok: {
      head: L3('Ana! head tortmasi html shkafiga kirdi.', 'Есть! head — в шкафу html.', 'Yes! head is in the html cabinet.'),
      body: L3('Klass! body ham html ichida, head tortmasidan keyin turadi.', 'Класс! body — в html, после head.', 'Cool! body is in html, after head.'),
      title: L3('Zo‘r! title head tortmasiga tushdi — sahifa nomi shu yerda saqlanadi.', 'В точку! title — в паспорте head.', 'Nailed it! title is in the head passport.')
    },
    titleBody: L3('Hechqisi yo‘q. Yorliqdagi nom sahifada ko‘rinmaydi, demak u body ichida turmaydi. Uning joyi — head tortmasi.',
      'Почти! Название вкладки не видно в окне — значит, не в body. Ищи паспорт — head.',
      'Almost! The tab name isn’t shown in the window, so not in body. Look for the passport: head.'),
    titleHtml: L3('Yana bir qarang: title to‘g‘ridan-to‘g‘ri shkafga emas, tortmalardan biriga qo‘yiladi. Sahifa nomi qaysi tortmada saqlanadi?',
      'Почти! title кладут не прямо в шкаф, а в ящик. Какой из них — паспорт?',
      'Almost! title doesn’t go straight into the cabinet but into a drawer. Which one is the passport?'),
    bodyFirst: L3('E’tibor bering: html ichida avval head tortmasi turadi, body esa undan keyin.', 'В шкафу сначала идёт head, а body — после него.', 'In the cabinet, head comes first and body after it.'),
    nested: L3('Qarang: head va body — ikki alohida tortma. Ikkalasi ham to‘g‘ridan-to‘g‘ri html ichida turadi.', 'head и body — два отдельных ящика, оба прямо в html.', 'head and body are two separate drawers, both straight inside html.'),
    noPlace: L3('E’tibor bering: bu tortma hali qo‘yilmagan. Avval uni joyiga qo‘ying.', 'Этого ящика пока нет. Сначала поставь его.', 'That drawer isn’t there yet. Put it in first.'),
    pickFirst: L3('Avval detalni tanlang.', 'Сначала выбери деталь.', 'Choose a piece first.'),
    done: L3('Hammasi yig‘ildi! Endi «3D ko‘rinish» va «Kod» tugmalarini bosib, ikkala ko‘rinishni solishtiring.',
      'Собрано! Вот это да! Теперь переключай «Объём» и «Код» и сравнивай.',
      'Built! Look at that! Now switch between “Volume” and “Code” and compare.'),
    h1: L3('Qaysi tortmada sahifa nomi saqlanadi, qaysi tortma esa sahifada ko‘rinadi?', 'Какой ящик — паспорт с названием, а какой видно в окне?', 'Which drawer is the passport with the name, and which shows in the window?'),
    h2: L3('head va body html ichida turadi (avval head). title esa head ichida.', 'head и body — внутри html (сначала head). title — внутри head.', 'head and body go inside html (head first). title goes inside head.'),
    h3: L3('Keyingi qadam: {p}', 'Сейчас: {p}', 'Now: {p}'),
    hintAsk: L3('Sahifa nomi qaysi tortmada saqlanadi?', 'Какой ящик — паспорт страницы?', 'Which drawer is the page’s passport?'),
    ask: L3('Detalni tanlang, keyin uning joyini bosing', 'Выбери деталь, потом место', 'Choose a piece, then its place'),
    askPlace: L3('Endi joyni bosing', 'Теперь выбери место', 'Now choose the place'),
    askDone: L3('Qismni tanlang — u ikkala ko‘rinishda ham belgilanadi', 'Выбери часть — она выделится в обоих видах', 'Choose a part: it stays selected in both views')
  },

  s8: {
    eyebrow: L3('Teg juftlari', 'Пары', 'Pairs'),
    say: L3('Bu darsdagi teglar juft bo‘ladi: ochuvchi va yopuvchi teg. Avval ochuvchi tegni, keyin uning juftini bosing.',
      'У каждого открывающего тега есть пара — закрывающий. Нажми открывающий, потом его пару.',
      'Every opening tag has a partner: the closing tag. Tap an opening tag, then its partner.'),
    area: {
      html: L3('html teglari orasida butun sahifa joylashgan.', 'Между html и его парой — вся страница.', 'Between html and its partner: the whole page.'),
      head: L3('head teglari orasida sahifa haqidagi ma’lumotlar turadi.', 'Между head и его парой — паспорт страницы.', 'Between head and its partner: the page’s passport.'),
      title: L3('title teglari orasida sahifa nomi turadi — u yorliqda ko‘rinadi.', 'Между title и его парой — название вкладки.', 'Between title and its partner: the tab name.'),
      body: L3('body teglari orasida sahifada ko‘rinadigan hamma narsa joylashgan.', 'Между body и его парой — всё, что видно в окне.', 'Between body and its partner: everything in the window.')
    },
    closeFirst: L3('Qarang: bu — yopuvchi teg, unda qiya chiziq bor. Avval ochuvchi tegni bosing.', 'Это закрывающий тег — в нём косая черта. Сначала нажми открывающий.', 'That’s a closing tag: it has a slash. Tap the opening one first.'),
    otherPair: L3('Hechqisi yo‘q. Siz {a} tegidan boshladingiz, bu esa {b}. Ikkala tegdagi nom bir xil bo‘lishi kerak.', 'Почти! Это {b}, а начали с {a}. Имена должны совпадать.', 'Almost! That’s {b}, but you started with {a}. The names must match.'),
    twoOpen: L3('Bu ham ochuvchi teg. Uning juftida qiya chiziq bo‘ladi.', 'Это тоже открывающий тег. У пары будет косая черта.', 'This is an opening tag too. Its partner has a slash.'),
    picked: L3('Endi uning yopuvchi juftini toping', 'Теперь найди его закрывающую пару', 'Now find its closing partner'),
    done: L3('Barakalla, to‘rtta juftni ham topdingiz! Ochuvchi va yopuvchi teglar har bir qismning chegarasini ko‘rsatadi.', 'Все четыре пары найдены! Видишь — они вложены друг в друга, как коробки.', 'All four pairs found! See? They sit inside each other like boxes.'),
    ask: L3('Avval ochuvchi tegni, keyin uning juftini bosing', 'Нажми открывающий тег, потом его пару', 'Tap an opening tag, then its partner')
  },

  s9: {
    eyebrow: L3('Kodi adashdi', 'Коди перепутал', 'Kodi mixed it up'),
    say: L3('Voy, adashdim! title qatorini noto‘g‘ri bo‘limga qo‘yibman. Tuzatishga yordam berasizmi?', 'Ой! Кажется, я положил название не туда. Поможешь?', 'Oops! I think I put the name in the wrong spot. Can you help?'),
    rule: L3('title doim head bo‘limi ichida turadi', 'title всегда лежит внутри head', 'title always sits inside head'),
    pickTitle: L3('Avval title qatorini tanlang', 'Сначала выбери строку title', 'First choose the title line'),
    pickPlace: L3('Endi head bo‘limi ichidagi joyni bosing', 'Теперь выбери место внутри head', 'Now choose a place inside head'),
    inBody: L3('Hechqisi yo‘q. Bu — body bo‘limi, unda sahifada ko‘rinadigan matn turadi. Sahifa nomi esa head bo‘limida saqlanadi.', 'Это body — там то, что видно в окне. А название живёт в паспорте.', 'That’s body: it holds what shows in the window. The name lives in the passport.'),
    inHtml: L3('Yana bir qarang: bu to‘g‘ridan-to‘g‘ri html shkafi. Sahifa nomi qaysi tortmada saqlanadi?', 'Это прямо шкаф html. В каком ящике паспорт?', 'That’s straight in the html cabinet. Which drawer is the passport?'),
    h1: L3('Yuqoridagi qoidaga qarang.', 'Посмотри на панель правила.', 'Look at the rule panel.'),
    h2: L3('Sahifa nomi title ichiga yoziladi. title esa head bo‘limida bo‘ladi.', 'title — название страницы, оно живёт в паспорте head.', 'title is the page name; it lives in the head passport.'),
    h3: L3('<head> qatorini bosing — title qatori uning ichiga o‘tadi.', 'Нажми строку <head> — title переедет внутрь.', 'Tap the <head> line: title moves inside.'),
    // Третья ступень, пока строка title ещё не выбрана: сначала выбрать её (узбекский — по
    // правке текстов 17.10.2026; русский и английский совпадают с h3).
    h3a: L3('Avval title yozilgan qatorni tanlang, keyin <head> qatorini bosing.', 'Нажми строку <head> — title переедет внутрь.', 'Tap the <head> line: title moves inside.'),
    ok: L3('Rahmat, hammasi joyida! Kod va sxema birga yangilandi.', 'Спасибо, всё на месте! Код и схема обновились вместе.', 'Thanks, everything’s in place! The code and the diagram updated together.'),
    again: L3('Mana yana bir hujjat — bu safar o‘zingiz tuzating.', 'Ещё один документ — теперь твоя очередь.', 'One more document: your turn now.'),
    ask: L3('title qatorini head bo‘limiga o‘tkazing', 'Перенеси title в head', 'Move title into head')
  },

  s10: {
    eyebrow: L3('Yopuvchi tegni yozing', 'Допиши конец', 'Write the end'),
    say: L3('Sahifadagi matn tayyor. Endi body qayerda tugashini ko‘rsatamiz: bo‘sh joyga yopuvchi tegni yozing.',
      'Текст уже есть. Теперь покажем, где кончается body: допиши закрывающий тег.',
      'The text is there. Now let’s show where body ends: type the closing tag.'),
    sayHead: L3('Endi head bo‘limi qayerda tugashini ko‘rsating.', 'Теперь покажи, где кончается head.', 'Now show where head ends.'),
    open: L3('E’tibor bering: bu — ochuvchi teg. Bu yerga esa yopuvchi teg kerak, unda qiya chiziq bo‘ladi.', 'Это открывающий тег. А нужен закрывающий — с косой чертой.', 'That’s an opening tag. We need the closing one, with a slash.'),
    noSlash: L3('Yana bir qarang: qiya chiziq yetishmayapti. Yopuvchi tegda u albatta bo‘ladi.', 'Почти! Не хватает косой черты.', 'Almost! The slash is missing.'),
    noBracket: L3('Hechqisi yo‘q. Burchakli qavs yetishmayapti: teg boshidagi «<» va oxiridagi «>» belgilarini tekshiring.', 'Почти! Не хватает уголка.', 'Almost! An angle bracket is missing.'),
    slashPlace: L3('Qarang: qiya chiziq noto‘g‘ri joyda. U «<» belgisidan keyin yoziladi.', 'Почти! Косая черта стоит не там: её место сразу после «<».', 'Almost! The slash is in the wrong spot: it goes right after “<”.'),
    otherName: L3('E’tibor bering: teg ichidagi nom boshqacha. Bu yerga {tag} kerak.', 'Это другое имя. Нам нужен {tag}.', 'That’s a different name. We need {tag}.'),
    h1: L3('Yuqoridagi ochuvchi tegga qarang.', 'Посмотри на открывающий тег выше.', 'Look at the opening tag above.'),
    h2: L3('Yopuvchi teg ochuvchi tegga o‘xshaydi, faqat unda qiya chiziq bor.', 'Закрывающий тег похож на открывающий, только с косой чертой.', 'A closing tag looks like the opening one, only with a slash.'),
    h3: L3('Qiya chiziq «<» belgisidan keyin darhol yoziladi.', 'Косая черта стоит сразу после «<».', 'The slash comes right after “<”.'),
    ok: L3('Zo‘r! body uchun yopuvchi tegni to‘g‘ri yozdingiz. Endi brauzer body qayerda tugashini biladi.', 'Отлично! body закрыт — теперь браузер знает, где его конец.', 'Great job! body is closed: now the browser knows where it ends.'),
    okHead: L3('Barakalla, head bo‘limi ham yopildi!', 'И head закрыт! Чётко!', 'head is closed too! Spot on!'),
    ask: L3('Bo‘sh joyga body uchun yopuvchi tegni yozing', 'Допиши закрывающий тег body в пустое место', 'Type the closing body tag in the empty place'),
    askHead: L3('Bo‘sh joyga head uchun yopuvchi tegni yozing', 'Допиши закрывающий тег head в пустое место', 'Type the closing head tag in the empty place')
  },

  s12: {
    // Заказ: ученик сам пишет название в title, потом текст в body (заказчик,
    // 17.10.2026). Поля пустые; засчитывается любой осмысленный текст — без
    // проверки на совпадение с примером, опечатки и знаки препинания.
    eyebrow: L3('O‘yinchilardan buyurtma', 'Заказ от игроков', 'An order from players'),
    say: L3('O‘yinchilardan buyurtma keldi: o‘yinga yangi nom va yangi matn kerak. Ularni o‘zingiz yozasiz.',
      'Пришёл заказ от игроков: игре нужно новое название и новый текст. Напишешь их сам.',
      'Players sent an order: the game needs a new name and a new text. You’ll write them yourself.'),
    tasks: [
      { id: 'title', goal: L3('O‘yinga yangi nom o‘ylab toping', 'Придумай игре новое название', 'Come up with a new name for the game'),
        t: L3('Bilimlar jangi 2', 'Битва знаний 2', 'Battle of Knowledge 2') },
      { id: 'text', goal: L3('O‘yinchilarga sahifa uchun matn yozing', 'Напиши игрокам текст для окна', 'Write the players a text for the window'),
        t: L3('Final juma kuni!', 'Финал в пятницу!', 'The final is on Friday!') }
    ],
    sayGoal: {
      title: L3('Birinchi buyurtma — o‘yinning yangi nomi. Uni title ichidagi bo‘sh joyga yozing: masalan, «{t}» yoki o‘zingiz o‘ylab toping.',
        'Заказ первый — новое название игры. Напиши его в пустом месте внутри title: например, «{t}» или своё.',
        'Order one: a new name for the game. Type it in the empty space inside title, for example “{t}”, or your own.'),
      text: L3('Ikkinchi buyurtma — sahifa uchun matn. Uni body ichidagi bo‘sh joyga yozing: masalan, «{t}» yoki o‘zingiz o‘ylab toping.',
        'Заказ второй — текст для окна. Напиши его в пустом месте внутри body: например, «{t}» или своё.',
        'Order two: a text for the window. Type it in the empty space inside body, for example “{t}”, or your own.')
    },
    okTitle: L3('Ana! Yangi nom yorliqda paydo bo‘ldi.', 'Есть! Новое название уже на вкладке.', 'Yes! The new name is already on the tab.'),
    ask: {
      title: L3('Nomni title ichiga yozing', 'Напиши название внутри title', 'Write the name inside title'),
      text: L3('Matnni body ichiga yozing', 'Напиши текст внутри body', 'Write the text inside body')
    },
    h1t: L3('Yorliqdagi nom kodning qayerida yozilgan?', 'Где в коде задаётся название вкладки?', 'Where in the code is the tab name set?'),
    h2t: L3('Yorliqdagi nom — title ichidagi matn.', 'Название вкладки — это текст внутри title.', 'The tab name is the text inside title.'),
    h3t: L3('<title> va </title> orasidagi bo‘sh joyni bosing va nom yozing.', 'Нажми на пустое место между <title> и </title> и напиши название.', 'Tap the empty space between <title> and </title> and type a name.'),
    h1b: L3('Sahifaning o‘zida qaysi matn ko‘rinadi?', 'Что видно в самом окне?', 'What shows in the window itself?'),
    h2b: L3('Sahifadagi matn — body ichida.', 'Текст в окне — внутри body.', 'The text in the window is inside body.'),
    h3b: L3('<body> va </body> orasidagi bo‘sh joyni bosing va matn yozing.', 'Нажми на пустое место между <body> и </body> и напиши текст.', 'Tap the empty space between <body> and </body> and type a text.'),
    done: L3('Barakalla, ikkala buyurtma ham bajarildi! Nom — yorliqda, matn — sahifada.', 'Оба заказа выполнены! Название — на вкладке, текст — в окне.', 'Both orders done! The name is on the tab, the text is in the window.')
  },

  s13: {
    eyebrow: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
    say: L3('Endi o‘z sahifangizni yig‘asiz. Birinchi qator tayyor — qolganlarini to‘g‘ri tartibda joylashtiring.',
      'Финальная сборка! Расставь строки по порядку. Первая строка уже на месте.',
      'Final build! Put the lines in order. The first line is already in place.'),
    rules: {
      html: L3('Butun sahifa html ichida turadi: html birinchi ochiladi va eng oxirida yopiladi.', 'Вся страница — внутри html: он открывается первым и закрывается последним.', 'The whole page is inside html: it opens first and closes last.'),
      pair: L3('Yopuvchi teg o‘z ochuvchi tegidan keyin turadi.', 'Закрывающий тег стоит после своего открывающего.', 'A closing tag comes after its opening tag.'),
      order: L3('Avval head bo‘limi, keyin body bo‘limi keladi.', 'Сначала head — паспорт, потом body.', 'First head, the passport, then body.'),
      headClose: L3('head bo‘limi body boshlanishidan oldin yopiladi.', 'head закрывается до того, как начнётся body.', 'head closes before body starts.'),
      title: L3('title head bo‘limi ichida turadi.', 'title стоит внутри head.', 'title sits inside head.'),
      text: L3('Sahifadagi matn body ichida turadi.', 'Текст страницы стоит внутри body.', 'The page text sits inside body.')
    },
    fill: L3('Zo‘r, qatorlar to‘g‘ri joylashdi! Endi sahifangizga nom bering va matn yozing.', 'Структура верная! Теперь придумай название и текст.', 'The structure is right! Now come up with a name and a text.'),
    done: L3('Ura! Sahifangiz tayyor!', 'Ура! Твоя страница готова!', 'Hooray! Your page is ready!'),
    h1: L3('Eng tashqi qism birinchi ochiladi va oxirida yopiladi.', 'Внешняя часть открывается первой.', 'The outer part opens first.'),
    h2: L3('html ichida avval head (ichida title), keyin body (ichida matn) turadi.', 'Внутри html: head (с title), потом body (с текстом).', 'Inside html: head (with title), then body (with the text).'),
    h3: L3('Belgilangan qatorlarning o‘rnini almashtiring.', 'Поменяй местами отмеченные строки.', 'Swap the marked lines.'),
    ask: L3('Qatorlarni to‘g‘ri tartibda joylashtiring', 'Расставь строки по порядку', 'Put the lines in order'),
    askFill: L3('Sahifa nomi va matnini yozing', 'Напиши название и текст', 'Write the name and the text')
  },

  s14: {
    eyebrow: L3('Sahifangiz Pikselning ekranida', 'Твоя страница на экране Пикселя', 'Your page on Pixel’s screen'),
    say: L3('Tabriklayman! O‘zingiz yaratgan sahifa Pikselning ekranida. Endi siz HTML teglari yordamida sahifa tuza olasiz — xuddi haqiqiy veb-dasturchi kabi!',
      'Смотри — твоя страница на экране у Пикселя! Это было мощно! Теперь ты умеешь собирать страницу из тегов, как настоящий веб-программист.',
      'Look, your page is on Pixel’s screen! That was epic! Now you can build a page from tags, like a real web developer.'),
    ach: {
      place: { self: L3('O‘zgartirish joyini maslahatsiz topdingiz', 'Место изменения — найдено без подсказок', 'Found the place to change on your own'),
        help: L3('O‘zgartirish joyini maslahat bilan topdingiz', 'Место изменения — найдено с подсказкой', 'Found the place to change with a hint') },
      build: { self: L3('Sahifa tuzilmasini yig‘dingiz', 'Структура страницы — собрана', 'Built the page structure'),
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
// R1. ИЗ ЧЕГО СДЕЛАН PIXEL — три слоя: детали (HTML), вид (CSS), движение (JS).
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
// Текст на экране Pixel: заголовок и одна короткая строка.
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
      } else {
        sayNow(c.on[k], k === 'html' ? 'wonder' : 'smile');
        // Следующий слой Коди называет сам (заказчик, 17.10.2026).
        say(k === 'html' ? c.next.css : c.next.js, 'point');
      }
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
// R2. ЭКРАН PIXEL — на нём игра «Битва знаний». Нажали экран — это обычная
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
    sayNow(c.tab, 'wonder');
    say(c.win, 'point');
    say(c.code, 'explain');
    say(c.done, 'cheer');
  };
  // Что Коди называет, то и обведено: вкладка, окно, код.
  const now = speaker.text === c.tab ? 'tab' : speaker.text === c.win ? 'win' : speaker.text === c.code ? 'code' : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={open ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={open ? c.askDone : c.ask} />
      {open ? (
        <div className={'work pr rb-zoom rb-open' + (now ? ' is-' + now : '')}>
          <MiniBrowser title={game.title} page={game.text} flashTab={flash} flashPage={flash} hl={now === 'tab' ? 'title' : now === 'win' ? 'body' : null} />
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
// now — часть, о которой сейчас говорит Коди: она приподнята, обведена, под ней
// подпись, остальные приглушены (заказчик, 17.10.2026: «говорит „это начало“ —
// а не показывает»).
function BigLine({ tag, text, sel, found, onPart, disabled, led, now }) {
  const pick = usePick();
  const parts = [
    { k: 'start', node: <Tag tag={tag} big /> },
    { k: 'content', node: <span className="bl-text">{text}</span> },
    { k: 'end', node: <Tag tag={tag} close big /> }
  ];
  return (
    <div className={'pv-bl' + (now !== undefined ? ' is-watch' : '')} translate="no">
      {parts.map((pt) => (
        <button key={pt.k} type="button" disabled={disabled} onClick={() => onPart(pt.k)}
          className={'bl-part bl-' + pt.k + (sel === pt.k ? ' is-sel' : '') + (now === pt.k ? ' is-now' : '') + (found && found[pt.k] ? ' is-found' : '')}
          aria-label={found && found[pt.k] ? pick(UI.labels[pt.k]) : undefined}>
          {pt.node}
          {now === pt.k ? <span className="bl-lbl is-now">{pick(UI.labels[pt.k])}</span>
            : found && found[pt.k] ? <span className="bl-lbl">{pick(UI.labels[pt.k])}</span> : null}
          <Led on={!!led && led.indexOf(pt.k) >= 0} />
        </button>
      ))}
    </div>
  );
}
// Сначала Коди сам показывает три части по очереди (часть подсвечена, пока он
// о ней говорит; на «содержимом» мигает вкладка). Потом спрашивает: «Где
// начало?», «Где конец?»… — ученик нажимает часть строки (заказчик,
// 17.10.2026: не тыкать наугад в начале, а сначала послушать).
const S2_ORDER = { a: ['end', 'start', 'content'], b: ['content', 'end', 'start'] };
function S2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'done' : 'watch');   // watch → quiz → (follow) → done
  const [qi, setQi] = useState(0);
  const [found, setFound] = useState({});
  const [msg, setMsg] = useState(null);
  const [tabFlash, setTabFlash] = useState(0);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'point' }, { text: c.parts.start, pose: 'point' }, { text: c.parts.content, pose: 'point' },
      { text: c.parts.end, pose: 'point' }, { text: c.quiz, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const st = useRef({ tries: 0, misses: 0, miss1: 0, follow: null, followMiss: 0, helped: false });
  const order = phase === 'follow' ? S2_ORDER.b : S2_ORDER.a;
  const target = phase === 'quiz' || phase === 'follow' ? order[qi] : null;
  const cur = phase === 'watch' ? (speaker.text === c.parts.start ? 'start' : speaker.text === c.parts.content ? 'content' : speaker.text === c.parts.end ? 'end' : null) : null;
  useEffect(() => { if (cur === 'content') setTabFlash((n) => n + 1); }, [cur]);
  // Рассказ договорён — первый вопрос.
  useEffect(() => {
    if (phase !== 'watch' || !spoken || solved) return;
    setPhase('quiz'); setQi(0);
    sayNow(c.q[S2_ORDER.a[0]], 'curious');
  }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const led = useIdleLed(canTap && !!target, qi * 10 + Object.keys(found).length);
  const tap = (part) => {
    if (!canTap || !target || found[part]) return;
    st.current.tries += 1;
    if (part === target) {
      sfx('ok', true);
      const f = Object.assign({}, found, { [part]: true });
      setFound(f); setMsg(null); st.current.miss1 = 0;
      if (qi + 1 < order.length) {
        setQi(qi + 1);
        sayNow(joinL(c.ok[part], c.q[order[qi + 1]]), 'smile');
        return;
      }
      const s0 = st.current;
      if (phase === 'quiz' && s0.helped) {
        // Помогали подсказкой — ещё одна строка того же типа.
        sayNow(joinL(c.ok[part], c.follow), 'smile');
        setTimeout(() => { setFound({}); setQi(0); setPhase('follow'); sayNow(c.q[S2_ORDER.b[0]], 'curious'); }, 1600);
        return;
      }
      if (phase === 'follow') s0.follow = s0.followMiss === 0;
      log({ screenId: 's2', type: 'tag-parts', correct: true, firstTry: s0.misses === 0, attempts: s0.tries,
        hints: s0.helped ? 1 : 0, helped: s0.helped, followUp: s0.follow });
      put({ done: true });
      setPhase('done');
      sayNow(joinL(c.ok[part], c.done), 'cheer');
      return;
    }
    st.current.misses += 1;
    st.current.miss1 += 1;
    if (phase === 'follow') st.current.followMiss += 1;
    sfx('soft', true);
    wobble(part);
    // Первый промах — что это за часть; второй — где искать нужную (и она светится).
    const m = st.current.miss1 >= 2 ? joinL(c.miss[part], c.hint[target]) : c.miss[part];
    if (st.current.miss1 >= 2) st.current.helped = true;
    setMsg(m);
    sayNow(m, 'think');
  };
  const line = phase === 'follow' ? { tag: 'title', text: pick(L3('Kosmos', 'Космос', 'Space')) }
    : phase === 'watch' ? { tag: 'title', text: pick(SAMPLE.title) }
      : { tag: 'title', text: pick(L3('Mening saytim', 'Мой сайт', 'My site')) };
  const askText = phase === 'watch' ? c.askWatch : phase === 'done' ? c.done : c.q[target];
  const doneFound = phase === 'done' ? { start: true, content: true, end: true } : found;
  const ledOn = target && (st.current.miss1 >= 2 || led) ? [target] : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={target ? c.hint[target] : askText} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={target ? msg : null} n={target ? (qi + 1) + '/3' : null} />
      <div className="s2-board">
        <BigLine tag={line.tag} text={line.text} sel={phase === 'watch' ? null : shake} found={phase === 'watch' ? null : doneFound}
          now={phase === 'watch' && cur ? cur : undefined} onPart={tap} disabled={!canTap || !target} led={ledOn} />
        <div className="s2-tabwrap">
          <MiniBrowser title={line.text} page={pick(SAMPLE.text)} compact hl={cur === 'content' || target === 'content' ? 'title' : null}
            flashTab={tabFlash} pins={{ tab: UI.tabPin }} />
        </div>
      </div>
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
  // Что открыть дальше — Коди говорит сам после каждой части (заказчик,
  // 17.10.2026: «дальше молчание — ученик должен догадаться»).
  const promptFor = (sn) => {
    if (sn.indexOf('html') < 0) return c.next.html;
    const hasHead = sn.indexOf('head') >= 0, hasBody = sn.indexOf('body') >= 0;
    if (!hasHead && !hasBody) return c.pickOne;
    if (!hasHead) return fillL(c.other, { x: 'head' });
    if (!hasBody) return fillL(c.other, { x: 'body' });
    if (sn.indexOf('title') < 0) return c.lastTitle;
    return null;
  };
  const tell = (k, pose) => {
    if (mark(k)) {
      // Всё открыто — итог по частям; пока Коди называет часть, она светится
      // в коробке, в коде и в браузере.
      sayNow(c[k], 'cheer');
      say(c.sum0, 'cheer'); say(c.sumHtml, 'point'); say(c.sumHead, 'point'); say(c.sumBody, 'point');
      return;
    }
    sayNow(c[k], pose);
    const nx = promptFor(seenRef.current);
    if (nx) say(nx, 'point');
  };
  const act = (k) => {
    if (!canTap || !k) return;
    taps.current += 1;
    setMsg(null);
    if (k === 'doctype') { setSel('doctype'); sayNow(c.doctype, 'explain'); const nx = promptFor(seenRef.current); if (nx) say(nx, 'point'); return; }
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
  // Итог: часть, которую Коди сейчас называет, светится везде сразу.
  const sumKey = speaker.text === c.sumHtml ? 'html' : speaker.text === c.sumHead ? 'head' : speaker.text === c.sumBody ? 'body' : null;
  const hlKey = sumKey || sel;
  const lit = hlKey === 'html' ? ['html', 'html-close'] : hlKey === 'head' ? ['head', 'head-close'].concat(sumKey ? ['title'] : [])
    : hlKey === 'body' ? ['body', 'body-close', 'page'] : hlKey === 'title' ? ['title'] : hlKey === 'doctype' ? ['doctype'] : [];
  const prompt = promptFor(seen);
  const ledTargets = !next ? [] : next === 'html' ? ['lid'] : prompt === c.pickOne ? ['head', 'body'] : [next === 'title' && seen.indexOf('body') < 0 ? 'body' : next];
  // Часть, которую Коди просит нажать, горит в самом шкафу с той минуты, как он
  // это говорит, и до нажатия (заказчик, 17.10.2026). Пока Коди объясняет только
  // что открытую часть, подсветки нет — она не спорит с объяснением.
  const askingNow = !!speaker.text && [c.say, prompt].some((t) => t && pick(t) === pick(speaker.text));
  const ledKeys = !solved && (askingNow || spoken || led) ? ledTargets : [];
  const askText = solved ? c.askDone : prompt || c.ask;
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
          <MiniBrowser title={t} page={x} compact hl={hlKey === 'doctype' ? null : hlKey} info={UI.passport} flashTab={flash.tab} flashPage={flash.page} />
          <CodeLines lines={docLines(order, { title: t, text: x })} hl={hlKey && hlKey !== 'doctype' ? hlKey : null} className="cv-ex"
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
              <Led on={led && ledTargets.indexOf(k === 'html' ? 'lid' : k) >= 0} />
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
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
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
      // Вопрос следующего раунда — вслух.
      if (rest.length) {
        const NR = c.rounds[rest[0].k];
        say(fillL(NR.ask, { t: pick(rest[0].v === 'extra' ? NR.extra : NR.text) }), 'curious');
      }
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
  const [codeSeen, setCodeSeen] = useState(false);   // «Код» светится, пока его не открыли
  const exRef = useRef(null);
  const pieceRefs = useRef({});
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
      move={{ lid: LID_UP(), 'head-cover': COVER_UP(), 'body-cover': COVER_UP(), head: has('head') ? 0 : DROP(), body: has('body') ? 0 : DROP(), 'title-card': has('title') ? 0 : DROP() }}
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
      <Ask text={solved ? c.askDone : hand ? c.askPlace : c.ask} hint={solved ? null : (msg || hintText)} n={placed.length + '/3'} />
      {solved ? (
        <>
          <div className="seg-row" role="tablist">
            {['volume', 'code'].map((v) => (
              <button key={v} type="button" role="tab" aria-selected={view === v}
                className={'seg' + (view === v ? ' is-on' : '') + (v === 'code' && !codeSeen ? ' is-glow' : '')}
                onClick={() => { setView(v); if (v === 'code') setCodeSeen(true); }}>{pick(v === 'volume' ? UI.volume : UI.code)}</button>
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
          <div ref={exRef} className={'ex rb-rel' + (hand ? ' is-hand' : '')}>{fig}{code}
            <DemoHand wrapRef={exRef} drag label={UI.piece.head} run={canTap && !solved && placed.length === 0 && !sel && !dnd.ghost}
              targets={[() => pieceRefs.current.head, () => {
                // В код: к строке </html> — при перетаскивании над ней встаёт место «сюда: внутрь html».
                const ls = exRef.current ? exRef.current.querySelectorAll('.cv .cv-line') : [];
                return ls.length ? ls[ls.length - 1] : null;
              }]} />
          </div>
          <div className="build-row">
            <span className="drag-tip">{pick(UI.dragTip)}</span>
            <div className="pieces" role="group" aria-label={pick(UI.pieces)}>
              {PIECES.filter((k) => !has(k)).map((k) => (
                <button key={k} ref={(el) => { pieceRefs.current[k] = el; }} type="button" disabled={!canTap} style={{ '--c': TAGC[k] }} aria-pressed={sel === k}
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
  const boxRef = useRef(null);
  const zoneEls = useRef({});
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
      <div ref={boxRef} className="pairs-box rb-rel">
        {/* Первую пару показывает рука: «нажми сюда — потом сюда». Код вне пары
            не тускнеет — найденные пары остаются цветными, со скобкой слева. */}
        <CodeLines lines={buildLines(FULL_DOC, mine)} className="cv-big" barsFor={found} zone={zone} onZone={tapTok}
          regZone={(z, el) => { zoneEls.current[z] = el; }} />
        <DemoHand wrapRef={boxRef} run={canTap && !solved && found.length === 0 && !first}
          targets={[() => zoneEls.current['head-o'], () => zoneEls.current['head-c']]} />
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
  const fixRef = useRef(null);
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
  const lineEl = (id) => { const box = codeRef.current; const i = shown.indexOf(id); return box && i >= 0 ? box.querySelectorAll('.cv-line')[i] : null; };
  const onCodeDown = (e) => {
    const ln = e.target.closest && e.target.closest('.cv-line');
    if (!ln || !codeRef.current || !codeRef.current.contains(ln)) return;
    if (shown[[...ln.parentNode.children].indexOf(ln)] === 'title') startTitle(e);
  };
  const h9 = [c.h1, c.h2, picked ? c.h3 : c.h3a];
  const hint = hintOf(lad.lv, h9);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintOf(Math.min(3, lad.lv + 1), h9) || c.ask} nav={navOf(p, canGo)}>
      <div className={'rule-panel' + (fixed ? ' is-ok' : '')}><span className="rule-ic">{fixed ? <Icon name="check" size={13} /> : '!'}</span><span><b>{pick(UI.inspector)}:</b> {pick(c.rule)}</span></div>
      <Ask text={fixed ? c.ok : picked ? c.pickPlace : c.ask} hint={fixed ? null : (msg || hint)} n={variant === 'B' ? pick(UI.again) : null} />
      <div ref={fixRef} className="fix-row rb-rel">
        <DemoHand wrapRef={fixRef} run={canTap && !fixed && !picked && variant === 'A' && st.current.misses === 0}
          targets={[() => lineEl('title'), () => lineEl('head-o')]} />
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
      <Ask text={okNow ? (tag === 'head' ? c.okHead : c.ok) : tag === 'head' ? c.askHead : c.ask} hint={okNow ? null : (msg || hint)} n={tag === 'head' ? pick(UI.again) : null} />
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
// 12. ЗАКАЗ ОТ ИГРОКОВ — ученик сам пишет: сначала название в title, потом
// текст в body (заказчик, 17.10.2026). Поля пустые; поле body открывается,
// когда название написано. Засчитывается любой осмысленный текст: хотя бы две
// буквы и без уголков — без сверки с примером, опечаток и знаков препинания.
// Пример из заказа — только идея («например»).
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [step, setStep] = useState(solved ? 2 : 0);          // 0 — название, 1 — текст, 2 — готово
  const [title, setTitle] = useState(rec && rec.title ? rec.title : '');
  const [text, setText] = useState(rec && rec.text ? rec.text : '');
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [wire, setWire] = useState({ n: 0, to: null });
  const sayGoal = (k) => fillL(c.sayGoal[k], { t: pick(c.tasks[k === 'title' ? 0 : 1].t) });
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: sayGoal('title'), pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || step === 2, spoken);
  const lad = useLadder(!solved && step < 2);
  const field = step === 0 ? 'title' : step === 1 ? 'text' : null;
  const task = field ? c.tasks[step] : null;
  const val = step === 0 ? title : text;
  const led = useIdleLed(canTap && !!field && !val.trim(), step);
  const wrapRef = useRef(null), tabRef = useRef(null), pageRef = useRef(null);
  const zones = useRef({});
  const regZone = (z, el) => { zones.current[z] = el; };
  // Написал и сделал паузу — заказ выполнен. Поле остаётся открытым: можно дописывать.
  useEffect(() => {
    if (!field || !okText(val)) return undefined;
    const t = setTimeout(() => {
      sfx('ok', true);
      if (step === 0) {
        setFlash((f) => ({ tab: f.tab + 1, page: f.page })); setWire((w) => ({ n: w.n + 1, to: 'tab' }));
        setStep(1); lad.reset();
        sayNow(c.okTitle, 'smile');
        say(sayGoal('text'), 'point');
        return;
      }
      setFlash((f) => ({ tab: f.tab, page: f.page + 1 })); setWire((w) => ({ n: w.n + 1, to: 'page' }));
      log({ screenId: 's12', type: 'write-title-body', correct: true, hints: lad.asked.current, depth: lad.lv });
      put({ done: true, title: title.trim(), text: text.trim() });
      setStep(2);
      sayNow(c.done, 'cheer');
    }, step === 0 ? 1300 : 1500);
    return () => clearTimeout(t);
  }, [val, step]); // eslint-disable-line react-hooks/exhaustive-deps
  const hints = field === 'title' ? [c.h1t, c.h2t, c.h3t] : [c.h1b, c.h2b, c.h3b];
  const hint = field ? hintOf(lad.lv, hints) : null;
  const askText = field ? c.ask[field] : c.done;
  const input = (k) => (
    <span className={'s12-in' + (led && field === k ? ' is-led' : '')}>
      <InlineInput value={k === 'title' ? title : text} onChange={k === 'title' ? setTitle : setText}
        label={c.ask[k]} placeholder={L3('…', '…', '…')} max={k === 'title' ? 40 : 70} />
      <Led on={led && field === k} />
    </span>
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={field ? (hintOf(Math.min(3, lad.lv + 1), hints) || sayGoal(field)) : c.done} nav={navOf(p, canGo)}>
      <div className={'goal-card' + (!task ? ' is-ok' : '')}>
        <span className="goal-l">{pick(UI.goal)} {task ? (step + 1) + '/2' : '2/2'}</span>
        {task ? (
          <span className="goal-row"><b>{pick(task.goal)}</b>
            <span className="goal-eg">{pick(UI.forExample)}: <i translate="no">{pick(task.t)}</i></span></span>
        ) : <b>{pick(c.done)}</b>}
      </div>
      {task ? <Ask text={askText} hint={hasTags(val) ? UI.noTags : hint} /> : null}
      <div className="work pr" ref={wrapRef}>
        <MiniBrowser title={okText(title) ? title : ''} page={okText(text) ? text : ''} tabRef={tabRef} pageRef={pageRef}
          flashTab={flash.tab} flashPage={flash.page} hl={field === 'title' ? 'title' : field === 'text' ? 'body' : null} />
        <CodeLines lines={buildLines(FULL_DOC, { title, text })} className="cv-ed s12-code" regZone={regZone}
          hl={field === 'title' ? 'title' : field === 'text' ? 'body' : null}
          renderText={(t) => (t.z === 'title-text' ? input('title')
            : t.z === 'body-text' ? (step >= 1 ? input('text') : <span className="s12-locked" aria-hidden="true">…</span>)
              : <span className="tk-text">{t.v}</span>)} />
        <Wire wrapRef={wrapRef} on={wire.n > 0} nonce={wire.n} color={wire.to === 'tab' ? TAGC.title : TAGC.body}
          from={() => zones.current[wire.to === 'tab' ? 'title-text' : 'body-text']}
          to={() => (wire.to === 'tab' ? tabRef.current : pageRef.current)} />
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
  // ПЕРЕТАСКИВАНИЕ (заказчик, 17.10.2026): строку из лотка можно перетащить на
  // место, а строки на местах — друг на друга (меняются). Нажатия работают
  // как раньше. Первый ход показывает рука: «<html> — на первое место».
  const flatRef = useRef(null);
  const chipRefs = useRef({});
  const slotOf = (el) => {
    const ln = el && el.closest && el.closest('.cv-line');
    const box = flatRef.current;
    if (!ln || !box || !box.contains(ln)) return -1;
    return [...ln.parentNode.children].indexOf(ln) - 1;
  };
  const dropAt = (payload, k) => {
    if (!canTap || k < 0 || k >= 8 || !payload) return;
    const s2 = slots.slice();
    if (payload.from === 'tray') s2[k] = payload.id;                     // прежняя строка места — обратно в лоток
    else if (payload.from === 'slot' && payload.k !== k) { const t2 = s2[payload.k]; s2[payload.k] = s2[k]; s2[k] = t2; }
    else return;
    setSlots(s2); setRes(null); setHeld(null);
    const ne = s2.indexOf(null);
    setCur(ne >= 0 ? ne : k);
    sfx('tap', true);
  };
  const dnd = useDragDrop((payload, el) => dropAt(payload, slotOf(el)));
  const labelOf = (id) => buildLines([id], { title: '…', text: pick(UI.pageText) })[0].toks
    .map((t) => (t.k === 'text' ? t.v : '<' + (t.k === 'close' ? '/' : '') + t.tag + '>')).join('');
  const onFlatDown = (e) => {
    if (!canTap) return;
    const k = slotOf(e.target);
    if (k >= 0 && slots[k]) dnd.start(e, { from: 'slot', k }, labelOf(slots[k]));
  };
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
      <Ask text={c.ask} hint={res ? c.rules[res.rule] : hint} n={slots.filter(Boolean).length + '/8'} />
      <div ref={flatRef} className="s13-row rb-rel" onPointerDown={onFlatDown}>
      <DemoHand wrapRef={flatRef} drag label="<html>" run={canTap && slots.every((x) => !x) && !dnd.ghost}
        targets={[() => chipRefs.current['html-o'], () => flatRef.current && flatRef.current.querySelectorAll('.cv-flat .cv-line')[1]]} />
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
              <button key={id} ref={(el) => { chipRefs.current[id] = el; }} type="button" disabled={!canTap}
                className={'pool-chip' + (dnd.ghost && dnd.ghost.payload.id === id ? ' is-drag' : '')}
                onPointerDown={(e) => { e.stopPropagation(); if (canTap) dnd.start(e, { from: 'tray', id }, labelOf(id)); }}
                onClick={() => putPiece(id)}>
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
      <DragGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// 14. ТВОЯ СТРАНИЦА НА ЭКРАНЕ PIXEL — финал: Pixel со всеми слоями показывает
// страницу ученика, рядом её код; подтверждённые достижения.
// =============================================================================
function S14({ p }) {
  // Финал без перегруза (заказчик, 17.10.2026): крупный Пиксель со страницей ученика
  // на экране, короткий список того, что получилось, и следующий урок. Код и
  // браузер здесь больше не дублируются — они были на всех экранах урока.
  const pick = usePick();
  const store = useStore();
  const c = C.s14;
  const mine = useMine();
  const ach = store.get('ach') || {};
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const list = ['place', 'build', 'close', 'page'].filter((k) => ach[k]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <div className="rb-fin">
        <div className="rb-fin-pixel">
          <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: mine.title, scr2: shortTxt(mine.text, 22) }} label={UI.robot} />
        </div>
        <div className="rb-fin-side">
          {list.length ? (
            <div className="ach" aria-label={pick(UI.done)}>
              {list.map((k) => (
                <span key={k} className={'ach-i' + (ach[k] === 'self' ? ' is-self' : '')}><span className="ach-m"><Icon name={ach[k] === 'self' ? 'star' : 'check'} size={12} /></span>{pick(c.ach[k][ach[k] === 'self' ? 'self' : 'help'])}</span>
              ))}
            </div>
          ) : null}
          <div className="bye-next next-card">
            <span className="bye-next-ic"><Icon name="doc" size={22} /></span>
            <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(UI.next)}</b></span>
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
