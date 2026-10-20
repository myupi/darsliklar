// =============================================================================
// == ТЕСТОВЫЙ УРОК · Урок 1 курса HTML, вариант 2 · «Страница Пикселя сломалась» =
//
// Вариант эталона урока 1 (lessons/html/01-struktura-dokumenta.jsx) по задаче
// заказчика 19.10.2026: «урок 1 скучный». Эталон не меняется; механики, фигуры
// и CSS берутся из tools/robot/ только на чтение. Сценарий —
// docs/scenarij-11-struktura-dokumenta-2.md.
//
// ЧТО ИЗМЕНЕНО ПРОТИВ ЭТАЛОНА
//   • старт за ~20 с: Пиксель опубликовал страницу, написанную простым текстом,
//     браузер честно её «сломал» (вкладка index.html, название в окне), игрок
//     пишет в чат; без тура по кнопкам и плана (r2);
//   • сквозной сюжет: одна страница Пикселя; Пиксель перепутал надписи (s2),
//     забыл закрыть title (s8); его ошибка «title — надпись в окне» звучит в s1
//     и возвращается неверным вариантом в проверке (s11);
//   • тег — через починку (s1), без лекции из шести реплик;
//   • три сборки с гаснущими опорами: детали и подписанные места (s7) → строки
//     по контурам + лишняя строка (s9) → теги своей страницы ученик пишет сам (s10);
//   • прогноз по трём макетам и «Открыть в браузере» с чтением кода строка за
//     строкой (s6);
//   • помощь: сначала светодиод на месте, рука — только после промаха или на
//     3-й ступени, конкретный ход — на 3-й ступени;
//   • конфетти — только в финале (s12): похвалы экранов с позой smile;
//   • title и body печатаются по одному разу (s4, s5); пары и «заказ» убраны;
//   • достижение «место изменения найдено» теперь выдаётся (s2).
//
// ЧЕСТНЫЙ БРАУЗЕР. Текст без ярлыков браузер кладёт в окно, вкладка — имя
// файла; без </title> всё, что дальше, уходит во вкладку — так и показано.
//
// СИСТЕМА СЛОВ. Тег — ярлык для браузера; html — вся страница; head — паспорт
// страницы; title — имя вкладки (название); body — всё, что видно в окне.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you». Файл собирается
// скриптом tools/struktura-2/s2.build.mjs.
// =============================================================================

const META = {
  lessonId: 'test-11-struktura-dokumenta-2',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '1-dars (2-variant). HTML hujjat tuzilishi',
    ru: 'Урок 1 (вариант 2). Структура HTML-документа',
    en: 'Lesson 1 (version 2). HTML document structure'
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
  tabPin: L3('← yorliq', '← вкладка', '← tab'),
  tagWord: L3('teg', 'тег', 'tag'),
  publish: L3('Sahifani e’lon qilish', 'Опубликовать страницу', 'Publish the page'),
  player: L3('O‘yinchi', 'Игрок', 'Player'),
  onTab: L3('Yorliqda', 'На вкладке', 'On the tab'),
  openBrowser: L3('Brauzerda ochish', 'Открыть в браузере', 'Open in browser'),
  qMark: L3('Savol', 'Вопрос', 'Question')
};

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
    done: L3('Har qanday sayt shunday tuzilgan: detallar, ko‘rinish, harakat. Eng asosiysi — HTML: usiz hech narsa yo‘q. Undan boshlaymiz!',
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
    eyebrow: L3('Piksel sahifasi', 'Страница Пикселя', 'Pixel’s page'),
    say: L3('Piksel o‘yini uchun sahifani o‘zi yozdi. «E’lon qilish» tugmasini bosing — o‘yinchilar nimani ko‘rishini bilamiz!',
      'Пиксель сам написал страницу своей игры. Нажми «Опубликовать» — посмотрим, что увидят игроки!',
      'Pixel wrote a page for his game himself. Tap “Publish” and let’s see what players will see!'),
    tab: L3('Voy! Yorliqda fayl nomi turibdi, o‘yin nomi esa oynaga, umumiy matn orasiga tushib qolibdi.',
      'Ой! На вкладке — имя файла, а название игры попало в окно, в общую кучу.',
      'Oops! The tab shows the file name, and the game’s name ended up in the window, all in one heap.'),
    done: L3('Piksel sahifani oddiy matn bilan yozibdi, brauzer esa nom qayerdaligini tushunmadi. Keling, tuzatamiz — oxirida esa o‘z sahifangizni yaratasiz!',
      'Пиксель написал страницу просто текстом, и браузер не понял, где название. Починим — а в конце ты сделаешь свою страницу!',
      'Pixel wrote the page as plain text, so the browser didn’t get where the name is. Let’s fix it, and at the end you’ll make your own page!'),
    chat: L3('Bu nima, index.html? O‘yin nomi qani?', 'Это что, index.html? И где название игры?', 'What’s this, index.html? Where’s the game’s name?'),
    ask: L3('«E’lon qilish» tugmasini bosing', 'Нажми «Опубликовать»', 'Tap “Publish”'),
    askDone: L3('Brauzer nom qayerdaligini tushunmadi. Tuzatamiz!', 'Браузер не понял, где название. Починим!', 'The browser didn’t get where the name is. Let’s fix it!')
  },

  s1: {
    eyebrow: L3('Nom uchun yorliq', 'Ярлык для названия', 'A label for the name'),
    say: L3('Piksel sahifasini tuzatamiz! Koddagi o‘yin nomini bosing.', 'Помогаем Пикселю! Нажми в коде на название игры.', 'Let’s help Pixel! Tap the game’s name in the code.'),
    fixed: L3('Voy, yorliqda nom paydo bo‘ldi! Burchakli qavslar ichidagi so‘zlar — teglar, brauzer uchun yorliqlar. Sahifada ular ko‘rinmaydi.',
      'Ого, у вкладки появилось имя! Слова в угловых скобках — теги, ярлыки для браузера. На странице их не видно.',
      'Whoa, the tab got a name! Words in angle brackets are tags, labels for the browser. They don’t show on the page.'),
    tapParts: L3('Qatorning qismlarini bosing — har birini tushuntiraman.', 'Нажимай части строки — расскажу про каждую.', 'Tap the parts of the line and I’ll explain each one.'),
    parts: {
      start: L3('Bu — ochuvchi teg: nom shu yerdan boshlanadi.', 'Это открывающий тег: отсюда начинается название.', 'This is the opening tag: the name starts here.'),
      end: L3('Bu — yopuvchi teg: o‘sha so‘z, faqat qiya chiziq bilan. Nom shu yerda tugaydi.', 'Это закрывающий тег — то же слово с косой чертой. Здесь название кончается.', 'This is the closing tag: the same word with a slash. The name ends here.'),
      content: L3('Teglar orasida — nomning o‘zi. Aynan u yorliqda ko‘rinadi.', 'А между тегами — само название. Его и видно на вкладке.', 'And between the tags is the name itself. That’s what shows on the tab.')
    },
    myth: L3('Piksel title — oynadagi yozuv deb o‘ylagan ekan. Aslida bu yorliq nomi!', 'Пиксель думал, что title — это надпись в окне. А это имя вкладки!', 'Pixel thought title was text in the window. It’s actually the tab’s name!'),
    done: L3('Zo‘r! Ochuvchi teg, mazmun, yopuvchi teg — sahifaning har bir qismi shunday yoziladi.',
      'Огонь! Начало, содержимое, конец — так устроена каждая часть страницы.',
      'Awesome! Start, content, end: every part of a page is built like this.'),
    ask: L3('Koddagi o‘yin nomini bosing', 'Нажми в коде на название игры', 'Tap the game’s name in the code'),
    askParts: L3('Qatorning qismlarini bosing', 'Нажимай части строки', 'Tap the parts of the line')
  },

  s2: {
    eyebrow: L3('Piksel adashdi', 'Пиксель перепутал', 'Pixel mixed it up'),
    say: L3('Piksel yana bitta yorliq qo‘shdi — body: uning ichidagi hamma narsa oynada ko‘rinadi. Lekin yozuvlarni almashtirib qo‘yibdi!',
      'Пиксель добавил ещё ярлык — body: всё внутри него видно в окне. Но надписи он перепутал!',
      'Pixel added another label, body: everything inside it shows in the window. But he mixed up the texts!'),
    sayAsk: L3('Yozuvlarning o‘rnini almashtiring: birini bosing, keyin ikkinchisini.', 'Поменяй надписи местами: нажми одну, потом другую.', 'Swap the texts: tap one, then the other.'),
    chat: L3('Yorliq juda uzun, oynada esa faqat nom turibdi…', 'Вкладка длиннющая, а в окне одно название…', 'The tab is super long, and the window only has the name…'),
    picked: L3('Endi ikkinchi yozuvni bosing', 'Теперь нажми другую надпись', 'Now tap the other text'),
    tags: L3('Deyarli! Teglarga tegmaymiz — ular orasidagi yozuvlarni almashtiramiz.', 'Почти! Теги не трогаем — меняем надписи между ними.', 'Almost! Leave the tags alone: we swap the texts between them.'),
    ok: L3('Voy, hammasi joyida! title — yorliq uchun, body — oyna uchun.', 'Вау, всё на местах! title — для вкладки, body — для окна.', 'Wow, everything’s in place! title is for the tab, body is for the window.'),
    h1: L3('Qarang: hozir yorliqda nima yozilgan?', 'Посмотри: что сейчас написано на вкладке?', 'Look: what does the tab say right now?'),
    h2: L3('Nom title ichida turadi, oynadagi matn esa body ichida.', 'Название живёт в title, а текст для окна — в body.', 'The name lives in title, and the window text lives in body.'),
    h3: L3('title ichidagi matnni, keyin body ichidagi matnni bosing.', 'Нажми текст в title, потом текст в body.', 'Tap the text in title, then the text in body.'),
    ask: L3('Yozuvlarni almashtiring: birini, keyin ikkinchisini bosing', 'Поменяй надписи местами: нажми одну, потом другую', 'Swap the texts: tap one, then the other'),
    dragTip: L3('Yozuvni ikkinchisining ustiga sudrash ham mumkin', 'Надпись можно и перетащить на другую', 'You can also drag one text onto the other')
  },

  s3: {
    eyebrow: L3('Sahifa ichida', 'Внутри страницы', 'Inside the page'),
    say: L3('Haqiqiy sahifaning karkasi bor — xuddi shkafdek. Uni ochish uchun eshikchasini bosing!',
      'У настоящей страницы есть каркас — как шкаф. Открой его: нажми на дверцу!',
      'A real page has a frame, like a cabinet. Open it: tap the door!'),
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
    eyebrow: L3('O‘yinning yangi nomi', 'Новое имя игры', 'A new name for the game'),
    say: L3('Piksel o‘yiniga yangi nom so‘rayapti! title ichidagi nomni o‘zgartiring: tayyorini tanlang yoki o‘zingiz yozing. Yorliqqa qarang!',
      'Пиксель просит новое имя для игры! Поменяй название внутри title: выбери готовое или напиши своё. Смотри на вкладку!',
      'Pixel wants a new name for his game! Change the name inside title: pick one or type your own. Watch the tab!'),
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
    eyebrow: L3('Brauzer nimani ko‘rsatadi?', 'Что покажет браузер?', 'What will the browser show?'),
    say: L3('Kod bo‘yicha taxmin qiling: yorliq va oynada nima bo‘ladi? Maketni tanlang, keyin sahifani oching!',
      'Угадай по коду: что будет на вкладке и в окне? Выбери макет, потом открой страницу!',
      'Guess from the code: what will the tab and the window show? Pick a mock-up, then open the page!'),
    ask: L3('Yorliq va oynada nima bo‘ladi? Maketni tanlang', 'Что будет на вкладке и в окне? Выбери макет', 'What will the tab and window show? Pick a mock-up'),
    askNew: L3('Yangi kod! Maketni tanlang', 'Новый код! Выбери макет', 'New code! Pick a mock-up'),
    askRun: L3('Endi «Brauzerda ochish» tugmasini bosing', 'Теперь нажми «Открыть в браузере»', 'Now tap “Open in browser”'),
    ok: [
      L3('Aynan! title ichidagi so‘z — yorliqda, body ichidagisi — oynada.', 'В точку! Слово из title — на вкладке, из body — в окне.', 'Nailed it! The word in title goes to the tab, the one in body to the window.'),
      L3('To‘g‘ri! title yorlig‘i yo‘q — yorliqda fayl nomi, so‘z esa oynaga tushdi.', 'Точно! Без ярлыка title на вкладке имя файла, а слово уходит в окно.', 'Right! Without the title label the tab shows the file name, and the word goes to the window.'),
      L3('Aniq! title ichida nima bo‘lsa, yorliqda o‘sha — hatto uzun gap bo‘lsa ham.', 'Чётко! Что в title — то и на вкладке, даже если это длинная фраза.', 'Spot on! Whatever is in title is on the tab, even a long phrase.')
    ],
    miss: [
      L3('Qarang: title ichidagi so‘z yorliqqa, body ichidagisi oynaga chiqdi. Yana bir misol!', 'Смотри: слово из title ушло на вкладку, а из body — в окно. Ещё пример!', 'Look: the word in title went to the tab, the one in body to the window. One more!'),
      L3('Qarang: birinchi so‘zda title yorlig‘i yo‘q — brauzer uni oynaga qo‘ydi, yorliqda esa fayl nomi. Yana bir misol!', 'Смотри: у первого слова нет ярлыка title — браузер положил его в окно, а на вкладке имя файла. Ещё пример!', 'Look: the first word has no title label, so the browser put it in the window and the tab shows the file name. One more!'),
      L3('Qarang: brauzer qaysi so‘z muhimligini taxmin qilmaydi, yorliqlarga qaraydi. title ichida gap bor — u yorliqda. Yana bir misol!', 'Смотри: браузер не гадает, что важнее, — он смотрит на ярлыки. В title фраза — она и на вкладке. Ещё пример!', 'Look: the browser doesn’t guess what matters, it reads the labels. The phrase is in title, so it’s on the tab. One more!')
    ],
    done: L3('Zo‘r! Brauzer taxmin qilmaydi — u yorliqlarni o‘qiydi.', 'Огонь! Браузер не догадывается — он читает ярлыки.', 'Awesome! The browser doesn’t guess: it reads the labels.'),
    w1: L3('Sport', 'Спорт', 'Sports'),
    w2: L3('Bugun final!', 'Сегодня финал!', 'The final is today!'),
    e1: L3('Musiqa', 'Музыка', 'Music'),
    e2: L3('Konsert shanba kuni!', 'Концерт в субботу!', 'Concert on Saturday!')
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
    eyebrow: L3('Piksel yopishni unutdi', 'Пиксель забыл закрыть', 'Pixel forgot to close it'),
    say: L3('Voy! Piksel sahifani yana o‘zgartirdi — endi yorliq qolgan hamma narsani yutib yuboribdi!',
      'Ой! Пиксель снова поправил страницу — и вкладка проглотила всё остальное!',
      'Oops! Pixel edited the page again, and now the tab swallowed everything else!'),
    sayAsk: L3('U title tegini yopishni unutibdi. Bo‘sh joyga yopuvchi tegni yozing.', 'Он забыл закрыть title. Допиши закрывающий тег в пустое место.', 'He forgot to close title. Type the closing tag in the empty place.'),
    chat: L3('Yorliq butun sahifani yeb qo‘ydi! Matn qani?', 'Вкладка съела всю страницу! Где текст?', 'The tab ate the whole page! Where’s the text?'),
    open: L3('E’tibor bering: bu — ochuvchi teg. Bu yerga esa yopuvchi teg kerak, unda qiya chiziq bo‘ladi.', 'Это открывающий тег. А нужен закрывающий — с косой чертой.', 'That’s an opening tag. We need the closing one, with a slash.'),
    noSlash: L3('Yana bir qarang: qiya chiziq yetishmayapti. Yopuvchi tegda u albatta bo‘ladi.', 'Почти! Не хватает косой черты.', 'Almost! The slash is missing.'),
    noBracket: L3('Hechqisi yo‘q. Burchakli qavs yetishmayapti: teg boshidagi «<» va oxiridagi «>» belgilarini tekshiring.', 'Почти! Не хватает уголка.', 'Almost! An angle bracket is missing.'),
    slashPlace: L3('Qarang: qiya chiziq boshqa joyda turibdi. Uning joyi — «<» belgisidan keyin.', 'Почти! Косая черта стоит не там: её место сразу после «<».', 'Almost! The slash is in the wrong spot: it goes right after “<”.'),
    otherName: L3('E’tibor bering: teg ichidagi nom boshqacha. Bu yerga {tag} kerak.', 'Это другое имя. Нам нужен {tag}.', 'That’s a different name. We need {tag}.'),
    h1: L3('Qatorning boshidagi ochuvchi tegga qarang.', 'Посмотри на открывающий тег в начале строки.', 'Look at the opening tag at the start of the line.'),
    h2: L3('Yopuvchi teg ochuvchi tegga o‘xshaydi, faqat unda qiya chiziq bor.', 'Закрывающий тег похож на открывающий, только с косой чертой.', 'A closing tag looks like the opening one, only with a slash.'),
    h3: L3('Qiya chiziq «<» belgisidan keyin darhol yoziladi.', 'Косая черта стоит сразу после «<».', 'The slash comes right after “<”.'),
    ok: L3('Ana! Yorliq sahifani qo‘yib yubordi: nom — yorliqda, matn — yana oynada.', 'Есть! Вкладка отпустила страницу: название — на вкладке, текст — снова в окне.', 'Yes! The tab let go of the page: the name is on the tab, the text is back in the window.'),
    again: L3('Mana yana bir sahifa, muammo xuddi shunday — tuzating!', 'Вот ещё одна страница с той же бедой — чини!', 'Here’s one more page with the same problem: fix it!'),
    okB: L3('Mushuklar ham qutqarildi! Aniq!', 'И котики спасены! Чётко!', 'The cats are saved too! Spot on!'),
    bTitle: L3('Mushuklar', 'Котики', 'Cats'),
    bText: L3('Bu yerda mushuklar yashaydi!', 'Здесь живут котики!', 'Cats live here!'),
    ask: L3('Bo‘sh joyga title uchun yopuvchi tegni yozing', 'Допиши закрывающий тег title в пустое место', 'Type the closing title tag in the empty place')
  },

  s9: {
    eyebrow: L3('Konturlar bo‘yicha karkas', 'Каркас по контурам', 'A frame by outlines'),
    say: L3('Piksel yangi sahifa uchun karkas so‘rayapti. Qatorlarni o‘z joyiga qo‘ying — bittasi ortiqcha!',
      'Пиксель просит каркас для новой страницы. Расставь строки по местам — одна строка тут лишняя!',
      'Pixel needs a frame for a new page. Put the lines in place: one line is extra!'),
    rules: {
      stray: L3('Yorliqsiz qator bu yerda ortiqcha: nom allaqachon title ichida.', 'Строка без ярлыков тут лишняя: название уже живёт в title.', 'The line without labels is extra here: the name already lives in title.'),
      html: L3('Butun sahifa html ichida turadi: html birinchi ochiladi va eng oxirida yopiladi.', 'Вся страница — внутри html: он открывается первым и закрывается последним.', 'The whole page is inside html: it opens first and closes last.'),
      pair: L3('Yopuvchi teg o‘z ochuvchi tegidan keyin turadi.', 'Закрывающий тег стоит после своего открывающего.', 'A closing tag comes after its opening tag.'),
      order: L3('Avval head bo‘limi, keyin body bo‘limi keladi.', 'Сначала head — паспорт, потом body.', 'First head, the passport, then body.'),
      headClose: L3('head bo‘limi body boshlanishidan oldin yopiladi.', 'head закрывается до того, как начнётся body.', 'head closes before body starts.'),
      title: L3('title head bo‘limi ichida turadi.', 'title стоит внутри head.', 'title sits inside head.'),
      text: L3('Sahifadagi matn body ichida turadi.', 'Текст страницы стоит внутри body.', 'The page text sits inside body.')
    },
    h1: L3('Eng tashqi qism birinchi ochiladi va oxirida yopiladi.', 'Внешняя часть открывается первой и закрывается последней.', 'The outer part opens first and closes last.'),
    h2: L3('html ichida avval head (ichida title), keyin body (ichida matn) turadi.', 'Внутри html: head (с title), потом body (с текстом).', 'Inside html: head (with title), then body (with the text).'),
    h3: L3('Belgilangan qatorlarning o‘rnini almashtiring.', 'Поменяй местами отмеченные строки.', 'Swap the marked lines.'),
    ok: L3('Karkas to‘g‘ri, ortiqcha qator esa savatda qoldi!', 'Каркас верный, а лишняя строка осталась в лотке!', 'The frame is right, and the extra line stayed in the tray!'),
    ask: L3('Qatorlarni to‘g‘ri tartibda joylashtiring', 'Расставь строки по порядку', 'Put the lines in order')
  },

  s10: {
    eyebrow: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
    say: L3('Endi eng muhimi: sahifangizning hamma teglari sizdan. Nom va matn tayyor — bo‘sh joylarga teglarni yozing.',
      'А теперь главное: все теги своей страницы — твои. Название и текст уже есть — впиши теги в пустые места.',
      'Now the main part: all the tags of your page are yours. The name and the text are there: type the tags in the empty places.'),
    needClose: L3('Bu yerda qism tugaydi — yopuvchi teg kerak, qiya chiziq bilan.', 'Здесь часть кончается — нужен закрывающий тег, с косой чертой.', 'A part ends here: you need a closing tag, with a slash.'),
    needOpen: L3('Bu yerda qism boshlanadi — ochuvchi teg kerak, qiya chiziqsiz.', 'Здесь часть начинается — нужен открывающий тег, без черты.', 'A part starts here: you need an opening tag, without a slash.'),
    noBracket: L3('Hechqisi yo‘q. Burchakli qavs yetishmayapti: teg «<» bilan boshlanib, «>» bilan tugaydi.', 'Почти! Не хватает уголка: тег начинается с «<» и кончается «>».', 'Almost! An angle bracket is missing: a tag starts with “<” and ends with “>”.'),
    slashPlace: L3('Qarang: qiya chiziq boshqa joyda turibdi. Uning joyi — «<» belgisidan keyin.', 'Почти! Косая черта стоит не там: её место сразу после «<».', 'Almost! The slash is in the wrong spot: it goes right after “<”.'),
    otherTag: L3('Teg to‘g‘ri yozilgan, lekin bu yerga boshqasi kerak. Qo‘shni qatorlarga qarang.', 'Тег записан верно, но здесь нужен другой. Посмотри на соседние строки.', 'The tag is written right, but a different one goes here. Look at the lines around it.'),
    h1: L3('Chekinish va qo‘shni qatorlarga qarang: bu yerda nima boshlanadi yoki tugaydi?', 'Посмотри на отступ и соседние строки: что здесь начинается или кончается?', 'Look at the indent and the lines around: what starts or ends here?'),
    h2: L3('Yuqoridan pastga: html, head, title, keyin head yopiladi, body, oxirida hammasi yopiladi.', 'Сверху вниз: html, head, title, потом head закрывается, body, и в конце всё закрывается.', 'Top to bottom: html, head, title, then head closes, body, and at the end everything closes.'),
    h3: L3('Bu yerga {tag} kerak.', 'Здесь нужен {tag}.', 'This place needs {tag}.'),
    done: L3('Ura! Sahifa tayyor — har bir teg o‘z joyida!', 'Ура! Страница готова — каждый тег на месте!', 'Hooray! The page is ready: every tag is in place!'),
    ask: L3('Bo‘sh joylarga teglarni yozing', 'Впиши теги в пустые места', 'Type the tags in the empty places')
  },

  s11: {
    eyebrow: L3('Piksel savollari', 'Вопросы Пикселя', 'Pixel’s questions'),
    say: L3('Piksel hammasini tushunganini tekshirmoqchi. Uning savollariga javob bering!', 'Пиксель хочет проверить, всё ли он понял. Ответь на его вопросы!', 'Pixel wants to check he got it all. Answer his questions!'),
    qs: [
      { q: L3('title nima qiladi?', 'Что делает title?', 'What does title do?'),
        opts: [
          { t: L3('Yorliqqa nom beradi', 'Даёт имя вкладке', 'Gives the tab its name'), ok: true },
          { t: L3('Oynada katta sarlavha yozadi', 'Пишет большой заголовок в окне', 'Writes a big heading in the window'),
            why: L3('Piksel ham shunday o‘ylagan edi! Lekin title faqat yorliqda ko‘rinadi.', 'Пиксель тоже так думал! Но title виден только на вкладке.', 'Pixel thought so too! But title only shows on the tab.') },
          { t: L3('Matnni yashiradi', 'Прячет текст', 'Hides the text'),
            why: L3('Yo‘q, title hech narsani yashirmaydi — u yorliqqa nom beradi.', 'Нет, title ничего не прячет — он даёт имя вкладке.', 'No, title hides nothing: it gives the tab its name.') }
        ],
        ok: L3('Aynan! title — yorliq nomi.', 'В точку! title — имя вкладки.', 'Nailed it! title is the tab’s name.') },
      { q: L3('Yorliqsiz matnni brauzer qayerga qo‘yadi?', 'Куда браузер положит текст без ярлыков?', 'Where does the browser put text without labels?'),
        opts: [
          { t: L3('Oynaga', 'В окно', 'In the window'), ok: true },
          { t: L3('Yorliqqa', 'На вкладку', 'On the tab'),
            why: L3('Piksel sahifasini eslang: yorliqda fayl nomi chiqqan edi.', 'Помнишь страницу Пикселя? На вкладке было имя файла.', 'Remember Pixel’s page? The tab showed the file name.') },
          { t: L3('Hech qayerga', 'Никуда', 'Nowhere'),
            why: L3('Brauzer uni baribir ko‘rsatdi — oynada, hammasi bir uyumda.', 'Браузер всё равно его показал — в окне, одной кучей.', 'The browser still showed it: in the window, all in one heap.') }
        ],
        ok: L3('To‘g‘ri! Yorliqsiz matn oynaga tushadi, hammasi bir uyumda.', 'Точно! Без ярлыков — в окно, одной кучей.', 'Right! Without labels it goes to the window, all in one heap.') },
      { q: L3('html ichida birinchi nima turadi?', 'Что идёт первым внутри html?', 'What comes first inside html?'),
        opts: [
          { t: L3('head', 'head', 'head'), ok: true },
          { t: L3('body', 'body', 'body'),
            why: L3('body keyin keladi: avval pasport — head.', 'body идёт потом: сначала паспорт — head.', 'body comes later: first the passport, head.') },
          { t: L3('title', 'title', 'title'),
            why: L3('title head ichida yotadi, html ichida esa birinchi head turadi.', 'title лежит внутри head, а первым в html идёт head.', 'title lies inside head; first in html comes head.') }
        ],
        ok: L3('Aniq! Avval head, keyin body.', 'Чётко! Сначала head, потом body.', 'Spot on! First head, then body.') }
    ],
    done: L3('Piksel hammasini tushundi — sizning yordamingiz bilan!', 'Пиксель всё понял — с твоей помощью!', 'Pixel got it all, thanks to you!'),
    ask: L3('Javobni tanlang', 'Выбери ответ', 'Choose the answer')
  },

  s12: {
    eyebrow: L3('Sahifangiz Pikselning ekranida', 'Твоя страница на экране Пикселя', 'Your page on Pixel’s screen'),
    say: L3('Qarang — sahifangiz Pikselning ekranida! Bu kuchli bo‘ldi! Endi siz sahifani teglardan yig‘a olasiz — xuddi haqiqiy veb-dasturchi kabi!',
      'Смотри — твоя страница на экране у Пикселя! Это было мощно! Теперь ты умеешь собирать страницу из тегов, как настоящий веб-программист.',
      'Look, your page is on Pixel’s screen! That was epic! Now you can build a page from tags, like a real web developer.'),
    chat: L3('Mana endi tushunarli! Zo‘r sahifa!', 'Вот теперь понятно! Классная страница!', 'Now that makes sense! Great page!'),
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

// ─────────────────────────────────────────────────────────────────────────────
// СТРОКИ «КАК НАПИСАЛ ПИКСЕЛЬ». Текст без ярлыков, строка title без закрывающего
// тега (место для ввода) и лишняя строка лотка. Модель та же: buildLines.
// ─────────────────────────────────────────────────────────────────────────────
LINE_TOKS['raw-title'] = (v) => [{ k: 'text', v: v.title, z: 'raw-title' }];
LINE_TOKS['raw-text'] = (v) => [{ k: 'text', v: v.text, z: 'raw-text' }];
LINE_TOKS['title-nc'] = (v) => [{ k: 'open', tag: 'title', z: 'title-o' }, { k: 'text', v: v.title, z: 'title-text' }, { k: 'text', v: '', z: 'title-gap' }];
LINE_TOKS.stray = (v) => [{ k: 'text', v: v.stray, z: 'stray' }];
const RAW_DOC = ['raw-title', 'raw-text'];
// Без </title> настоящий браузер отдаёт вкладке всё, что идёт дальше.
const eaten = (t, x) => t + ' </head> <body> ' + x + ' </body> </html>';

// Сообщение игрока в чате — сюжет: что видят те, кто открыл страницу Пикселя.
function PlayerMsg({ text, delay }) {
  const pick = usePick();
  const [on, setOn] = useState(() => !delay || reduceMotion());
  useEffect(() => {
    if (on) return undefined;
    const t = setTimeout(() => { setOn(true); sfx('pop', true); }, delay);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!on) return null;
  return (
    <div className="v2-chat" role="status">
      <span className="v2-chat-av" aria-hidden="true"><Icon name="role" size={15} /></span>
      <span className="v2-chat-b"><b>{pick(UI.player)}</b><span>{pick(text)}</span></span>
    </div>
  );
}

// =============================================================================
// R2. СТРАНИЦА СЛОМАЛАСЬ — Пиксель опубликовал страницу, написанную простым
// текстом. Браузер честно показывает: на вкладке имя файла, название — в окне,
// одной кучей. Игрок пишет в чат. Одно нажатие, две реплики.
// =============================================================================
function R2({ p }) {
  const pick = usePick();
  const c = C.r2;
  const [rec, put] = useRec('r2');
  const solved = !!(rec && rec.done);
  const [open, setOpen] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'explain' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !open, 0);
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const tap = () => {
    if (!canTap || open) return;
    sfx('pop', true);
    setOpen(true);
    put({ done: true });
    sayNow(c.tab, 'wonder');
    say(c.done, 'explain');
  };
  const onTab = speaker.text === c.tab;
  const askText = open ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} />
      {open ? (
        <div className="work pr rb-zoom v2-broken">
          <div className="v2-bcol">
            <MiniBrowser title="" page={t + ' ' + x} hl={onTab ? 'title' : null} flashPage={solved ? 0 : 1} />
            <PlayerMsg text={c.chat} delay={solved ? 0 : 1400} />
          </div>
          <CodeLines lines={buildLines(RAW_DOC, { title: t, text: x })} className="cv-pr rb-code" />
        </div>
      ) : (
        <>
          <div className="rb-tapfig" role="button" tabIndex={0} aria-label={pick(c.ask)} onClick={tap}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } }}>
            <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: t, scr2: pick(UI.scr2) }} label={UI.robot}
              led={led ? ['screen'] : []} />
          </div>
          <div className="rb-acts">
            <button type="button" className="btn-accent rb-open-b" disabled={!canTap} onClick={tap}>
              <Icon name="browser" size={18} />{pick(UI.publish)}<Led on={led} />
            </button>
          </div>
        </>
      )}
    </Stage>
  );
}

// =============================================================================
// S1. ЯРЛЫК ДЛЯ НАЗВАНИЯ — тег через починку: ученик нажимает название в коде,
// оно получает ярлыки title, вкладка печатает имя. Потом части строки — по
// нажатию ученика, светится «нажми сюда». Ошибка Пикселя «title — надпись в
// окне» звучит здесь и вернётся в проверке (s11).
// =============================================================================
const PARTS3 = ['start', 'end', 'content'];
function S1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [fixed, setFixed] = useState(solved);
  const [found, setFound] = useState(solved ? { start: true, end: true, content: true } : {});
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [wire, setWire] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const n = (fixed ? 1 : 0) + Object.keys(found).length;
  const led = useIdleLed(canTap && !solved, n);
  const taps = useRef(0);
  const wrapRef = useRef(null), tabRef = useRef(null);
  const zones = useRef({});
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const fix = () => {
    if (!canTap || fixed) return;
    taps.current += 1;
    sfx('pop', true);
    setFixed(true);
    setWire((w) => w + 1);
    setFlash((f) => ({ tab: f.tab + 1, page: f.page + 1 }));
    sayNow(c.fixed, 'wonder');
    say(c.tapParts, 'point');
  };
  const tapPart = (k) => {
    if (!canTap || !fixed || solved) return;
    taps.current += 1;
    if (found[k]) { sayNow(c.parts[k], 'explain'); return; }
    sfx('ok', true);
    const f = Object.assign({}, found, { [k]: true });
    setFound(f);
    if (k === 'content') setFlash((fl) => ({ tab: fl.tab + 1, page: fl.page }));
    if (Object.keys(f).length === 3) {
      log({ screenId: 's1', type: 'tag-parts', correct: true, firstTry: true, attempts: taps.current });
      put({ done: true });
      sayNow(c.parts[k], 'explain');
      say(c.myth, 'explain');
      say(c.done, 'smile');
      return;
    }
    sayNow(c.parts[k], 'point');
  };
  const tagNow = speaker.text === c.fixed;
  const askText = solved ? c.done : fixed ? c.askParts : c.ask;
  const left = PARTS3.filter((k) => !found[k]);
  const ledParts = fixed && !solved && (led || speaker.text === c.tapParts) ? left : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={solved ? null : n + '/4'} />
      <div className="work pr v2-s1" ref={wrapRef}>
        <MiniBrowser title={fixed ? t : ''} page={fixed ? x : t + ' ' + x} tabRef={tabRef} typed={fixed && !solved && n === 1}
          flashTab={flash.tab} flashPage={flash.page} hl={speaker.text === c.parts.content || speaker.text === c.myth ? 'title' : null} />
        <div className="v2-s1-code">
          <CodeLines lines={buildLines(fixed ? ['title', 'raw-text'] : RAW_DOC, { title: t, text: x })} className="cv-pr"
            regZone={(z, el) => { zones.current[z] = el; }}
            lineProps={(ln) => (!fixed && ln.id === 'raw-title' ? { onTap: fix, disabled: !canTap, led: led, cls: 'v2-tapline' }
              : (fixed && ln.id === 'title' && !solved ? { cls: 'is-new' } : null))} />
          {fixed ? (
            <BigLine tag="title" text={t} found={found} now={tagNow ? ['start', 'end'] : undefined}
              onPart={tapPart} disabled={!canTap || solved} led={ledParts} />
          ) : null}
        </div>
        <Wire wrapRef={wrapRef} on={wire > 0} nonce={wire} color={TAGC.title} from={() => zones.current['title-text']} to={() => tabRef.current} />
      </div>
    </Stage>
  );
}

// =============================================================================
// S2. ПИКСЕЛЬ ПЕРЕПУТАЛ — у страницы появился body, но надписи стоят наоборот:
// на вкладке длинное приветствие, в окне одно название. Ученик меняет надписи
// местами (нажать одну, потом другую; или перетащить). Достижение «место
// изменения найдено» выдаётся здесь.
// =============================================================================
const S2_DOC = ['title', 'body-o', 'text', 'body-c'];
function S2({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(null);             // 'title-text' | 'body-text'
  const [msg, setMsg] = useState(null);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [wire, setWire] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayAsk, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, sel ? 1 : 0);
  const wrapRef = useRef(null), tabRef = useRef(null), pageRef = useRef(null);
  const zones = useRef({});
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const v = solved ? { title: t, text: x } : { title: x, text: t };
  const swap = () => {
    if (solved) return;
    tries.current += 1;
    sfx('ok', true);
    setSel(null); setMsg(null);
    setWire((w) => w + 1);
    setFlash((f) => ({ tab: f.tab + 1, page: f.page + 1 }));
    const self = misses === 0 && lad.asked.current === 0;
    putAch(store, 'place', self ? 'self' : 'help');
    log({ screenId: 's2', type: 'swap-texts', correct: true, firstTry: self, attempts: tries.current, hints: lad.asked.current, depth: lad.lv, helped: lad.lv >= 3 });
    put({ done: true });
    sayNow(c.ok, 'smile');
  };
  const onZone = (z, el, tok) => {
    if (!canTap || solved || !tok) return;
    if (tok.k !== 'text') {
      const nm = misses + 1;
      setMisses(nm); sfx('soft', true); setMsg(c.tags); sayNow(c.tags, 'think');
      if (nm >= 2) lad.bump();
      return;
    }
    if (!sel) { sfx('tap', true); setSel(z); setMsg(null); return; }
    if (sel === z) { setSel(null); return; }
    swap();
  };
  const zone = (z, tok) => {
    if (solved || !tok || tok.k === 'doctype') return null;
    const isText = tok.k === 'text';
    const nextT = sel ? (sel === 'title-text' ? 'body-text' : 'title-text') : 'title-text';
    return { tap: true, disabled: !canTap, cls: isText ? 'v2-swap' + (sel === z ? ' is-sel' : '') : 'v2-tagtap',
      led: isText && (lad.lv >= 3 ? z === nextT : (led && z !== sel)) };
  };
  const dnd = useDragDrop((from, el) => {
    if (!el) return;
    const other = zones.current[from === 'title-text' ? 'body-text' : 'title-text'];
    if (other && (other === el || other.contains(el))) swap();
  });
  const onDown = (e) => {
    if (!canTap || solved) return;
    ['title-text', 'body-text'].forEach((z) => {
      const zel = zones.current[z];
      if (zel && zel.contains(e.target)) dnd.start(e, z, z === 'title-text' ? v.title : v.text);
    });
  };
  const hints = [c.h1, c.h2, c.h3];
  const hint = hintOf(lad.lv, hints);
  const askText = solved ? c.ok : sel ? c.picked : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={solved ? c.ok : (hintOf(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={solved ? null : (msg || hint)} />
      <div className="work pr rb-rel" ref={wrapRef}>
        <div className="v2-bcol">
          <MiniBrowser title={v.title} page={v.text} tabRef={tabRef} pageRef={pageRef} flashTab={flash.tab} flashPage={flash.page} />
          {!solved ? <PlayerMsg text={c.chat} delay={1000} /> : null}
        </div>
        <div className="drag-host" onPointerDown={onDown}>
          <CodeLines lines={buildLines(S2_DOC, v)} className="cv-pr cv-big v2-s2code" zone={zone} onZone={onZone}
            regZone={(z, el) => { zones.current[z] = el; }} />
        </div>
        <DemoHand wrapRef={wrapRef} run={canTap && !solved && !sel && lad.lv >= 3 && !dnd.ghost}
          targets={[() => zones.current['title-text'], () => zones.current['body-text']]} />
        <Wire wrapRef={wrapRef} on={wire > 0} nonce={wire} color={TAGC.title} from={() => zones.current['title-text']} to={() => tabRef.current} />
        <Wire wrapRef={wrapRef} on={wire > 0} nonce={wire} color={TAGC.body} from={() => zones.current['body-text']} to={() => pageRef.current} />
      </div>
      {!solved ? <span className="drag-tip">{pick(c.dragTip)}</span> : null}
      <DragGhost ghost={dnd.ghost} />
    </Stage>
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
        sayNow(c.on.js, 'smile');
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

// now — часть, о которой сейчас говорит Коди: она приподнята, обведена, под ней
// подпись, остальные приглушены (заказчик, 17.10.2026: «говорит „это начало“ —
// а не показывает»).
function BigLine({ tag, text, sel, found, onPart, disabled, led, now }) {
  // now — часть или список частей (определение тега: оба тега сразу, подпись «тег»).
  const isNow = (k) => (Array.isArray(now) ? now.indexOf(k) >= 0 : now === k);
  const nowLabel = (k) => (Array.isArray(now) ? UI.tagWord : UI.labels[k]);
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
          className={'bl-part bl-' + pt.k + (sel === pt.k ? ' is-sel' : '') + (isNow(pt.k) ? ' is-now' : '') + (found && found[pt.k] ? ' is-found' : '')}
          aria-label={found && found[pt.k] ? pick(UI.labels[pt.k]) : undefined}>
          {pt.node}
          {isNow(pt.k) ? <span className="bl-lbl is-now">{pick(nowLabel(pt.k))}</span>
            : found && found[pt.k] ? <span className="bl-lbl">{pick(UI.labels[pt.k])}</span> : null}
          <Led on={!!led && led.indexOf(pt.k) >= 0} />
        </button>
      ))}
    </div>
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
      sayNow(c[k], 'smile');
      say(c.sum0, 'smile'); say(c.sumHtml, 'point'); say(c.sumHead, 'point'); say(c.sumBody, 'point');
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
      if (!solved) { put({ done: true, was: first }); sayNow(c.done, 'smile'); }
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
      if (!solved) { put({ done: true }); sfx('ok', true); sayNow(c.done, 'smile'); }
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
// S6. ЧТО ПОКАЖЕТ БРАУЗЕР? — прогноз по трём макетам (вкладка + окно), потом
// «Открыть в браузере»: строки кода подсвечиваются сверху вниз, вкладка и окно
// заполняются по мере чтения. Ловушки в обе стороны: слово без ярлыка уходит
// в окно, длинная фраза в title — на вкладку. Промах — дополнительный раунд.
// =============================================================================
const PRED = [
  { order: ['title', 'body-o', 'text', 'body-c'], swap: false },
  { order: ['raw-title', 'body-o', 'text', 'body-c'], swap: false },
  { order: ['title', 'body-o', 'text', 'body-c'], swap: true }
];
// Три состояния браузера — одни и те же в каждом раунде, верное — своё.
const predStates = (a, b) => [{ tab: a, win: b }, { tab: '', win: a + ' ' + b }, { tab: b, win: a }];
const PRED_ORDER = [[0, 1, 2], [2, 0, 1], [1, 2, 0], [0, 2, 1], [2, 1, 0]];
function MockB({ st, label, cls, onClick, disabled, led }) {
  return (
    <button type="button" className={'v2-mock' + (cls ? ' ' + cls : '')} onClick={onClick} disabled={disabled} translate="no">
      <span className="v2-mock-l mono">{label}</span>
      <span className="v2-mock-top"><span className={'v2-mock-tab' + (st.tab ? '' : ' is-file')}>{st.tab || 'index.html'}</span></span>
      <span className="v2-mock-page">{st.win}</span>
      <Led on={!!led} />
    </button>
  );
}
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [{ k: 0 }, { k: 1 }, { k: 2 }]));
  const [last, setLast] = useState({ k: 2 });
  const [doneN, setDoneN] = useState(0);
  const [choice, setChoice] = useState(solved ? 2 : null);
  const [read, setRead] = useState(-1);
  const [shown, setShown] = useState(null);
  const [verdict, setVerdict] = useState(solved ? 'ok' : null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || (!queue.length && verdict === 'ok'), spoken);
  const stats = useRef([]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const round = queue[0] || last;
  const words = round.extra ? [pick(c.e1), pick(c.e2)] : [pick(c.w1), pick(c.w2)];
  const states = predStates(words[0], words[1]);
  const R = PRED[round.k];
  const v = R.swap ? { title: words[1], text: words[0] } : { title: words[0], text: words[1] };
  const lines = buildLines(R.order, v);
  const ord = PRED_ORDER[doneN % PRED_ORDER.length];
  const live = queue.length > 0 && !verdict;
  const led = useIdleLed(canTap && live && read < 0, (choice === null ? 0 : 1) + doneN * 10);
  const view = shown || (verdict ? states[round.k] : { tab: '', win: '' });
  const run = () => {
    if (!canTap || choice === null || !live || read >= 0) return;
    sfx('tap', true);
    const step = reduceMotion() ? 140 : 560;
    const cur = queue[0], chosen = choice, rest0 = queue.slice(1);
    let tab = '';
    const win = [];
    setShown({ tab: '', win: '' });
    lines.forEach((ln, i) => {
      timers.current.push(setTimeout(() => {
        setRead(i);
        if (ln.id === 'title') tab = v.title;
        if (ln.id === 'raw-title') win.push(v.title);
        if (ln.id === 'text') win.push(v.text);
        setShown({ tab: tab, win: win.join(' ') });
        sfx('tap', true);
      }, step * (i + 1)));
    });
    timers.current.push(setTimeout(() => {
      setRead(-1);
      const right = chosen === cur.k;
      stats.current.push({ k: cur.k, extra: !!cur.extra, right });
      setVerdict(right ? 'ok' : 'miss');
      sfx(right ? 'ok' : 'soft', true);
      const rest = rest0.slice();
      if (!right && !cur.extra) rest.unshift({ k: cur.k, extra: true });
      const line = right ? c.ok[cur.k] : c.miss[cur.k];
      if (!rest.length) {
        const s = stats.current;
        [0, 1, 2].forEach((kk) => {
          const first = s.find((x) => x.k === kk && !x.extra);
          const extra = s.find((x) => x.k === kk && x.extra);
          log({ screenId: 's6.r' + (kk + 1), type: 'predict', correct: true, firstTry: !!(first && first.right), attempts: extra ? 2 : 1,
            hints: first && first.right ? 0 : 1, helped: !!(first && !first.right), followUp: extra ? extra.right : null });
        });
        put({ done: true });
        setLast(cur);
        setQueue([]);
        sayNow(joinL(line, c.done), 'smile');
        return;
      }
      sayNow(line, right ? 'smile' : 'rule');
      setPending(rest);
    }, step * (lines.length + 1) + 250));
  };
  // Следующий раунд — когда Коди договорил разбор (таймер не обрывает реплику).
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => {
      setQueue(pending); setPending(null); setDoneN((n) => n + 1);
      setChoice(null); setVerdict(null); setShown(null);
      sayNow(c.askNew, 'curious');
    }, reduceMotion() ? 400 : 1100);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const askText = !queue.length ? c.done : verdict ? (verdict === 'ok' ? c.ok[round.k] : c.miss[round.k])
    : choice === null ? (doneN ? c.askNew : c.ask) : c.askRun;
  const total = doneN + queue.length;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={queue.length ? (doneN + 1) + '/' + total : null} />
      <div className="work pr v2-pred">
        <MiniBrowser title={view.tab} page={view.win} hl={read >= 0 ? (lines[read] && lines[read].id === 'title' ? 'title' : null) : null} />
        <CodeLines lines={lines} className="cv-pr v2-predcode" lineProps={(ln, i) => ({ cls: read === i ? 'is-read' : '' })} />
      </div>
      <div className="v2-mocks" role="group">
        {ord.map((si, j) => {
          const isSel = choice === si;
          const cls = (isSel ? ' is-sel' : '') + (verdict && isSel ? (verdict === 'ok' ? ' is-ok' : ' is-miss') : '')
            + (verdict === 'miss' && si === round.k ? ' is-real' : '') + (!queue.length && si === round.k ? ' is-ok' : '');
          return (
            <MockB key={si} st={states[si]} label={'ABC'[j]} cls={cls} disabled={!canTap || !live || read >= 0}
              led={led && choice === null}
              onClick={() => { if (canTap && live && read < 0) { sfx('tap', true); setChoice(si); } }} />
          );
        })}
      </div>
      {queue.length ? (
        <div className="v2-run-row">
          <button type="button" className="btn-accent v2-run" disabled={!canTap || choice === null || !live || read >= 0} onClick={run}>
            <Icon name="browser" size={18} />{pick(UI.openBrowser)}<Led on={led && choice !== null} />
          </button>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// S8. ПИКСЕЛЬ ЗАБЫЛ ЗАКРЫТЬ — без </title> браузер отдаёт вкладке всё, что
// идёт дальше: на вкладке «Битва знаний </head> <body> …», окно пустое.
// Ученик пишет закрывающий тег — вкладка и окно возвращаются на места.
// Разбор ввода по существу; после 3-й ступени — ещё одна такая страница.
// =============================================================================
const DOC8 = ['doctype', 'html-o', 'head-o', 'title-nc', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
function judgeClose(raw, tag, c) {
  const w = tagWord(raw);
  const want = '</' + tag + '>';
  if (w === want) return { ok: true };
  if (w === '<' + tag + '>') return { m: c.open };
  if (/^<[a-z]+>$/.test(w) && w.indexOf(tag) >= 0) return { m: c.open };
  if (w === '<' + tag + '/>' || w === '<\\' + tag + '>' || w === '<' + tag + '>/') return { m: c.slashPlace };
  if (w === '/' + tag + '>') return { m: c.noBracket };
  if (w === '</' + tag || w === '/' + tag || w === '</' + tag + '/' || w === tag + '>') return { m: w.indexOf('/') < 0 ? c.noSlash : c.noBracket };
  const name = (w.match(/[a-z]+/) || [''])[0];
  if (name && name !== tag) return { m: fillL(c.otherName, { tag: want }) };
  if (w.indexOf('/') < 0) return { m: c.noSlash };
  return { m: c.noBracket };
}
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s8;
  const mine = useMine();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [variant, setVariant] = useState('A');
  const [val, setVal] = useState(solved ? '</title>' : '');
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [flash, setFlash] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }]
    : [{ text: c.say, pose: 'wonder' }, { text: c.sayAsk, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const st = useRef({ tries: 0, misses: 0, bMiss: false });
  const inputRef = useRef(null);
  const led = useIdleLed(canTap && !okNow && !val, variant === 'B' ? 1 : 0);
  const doc = variant === 'A' ? { title: mine.title, text: mine.text } : { title: pick(c.bTitle), text: pick(c.bText) };   // страница Пикселя — с названием и текстом ученика (s4, s5)
  const check = () => {
    if (!canTap || okNow || !val.trim()) return;
    st.current.tries += 1;
    const r = judgeClose(val, 'title', c);
    if (r.ok) {
      sfx('win', true); setMsg(null); setOkNow(true); setFlash((f) => f + 1);
      if (variant === 'A' && lad.lv >= 3) {
        sayNow(joinL(c.ok, c.again), 'smile');
        setTimeout(() => { setVariant('B'); setVal(''); setOkNow(false); lad.reset(); }, reduceMotion() ? 1200 : 2800);
        return;
      }
      const s = st.current;
      const self = s.misses === 0 && lad.asked.current === 0 && variant === 'A';
      log({ screenId: 's8', type: 'write-closing', correct: true, firstTry: self, attempts: s.tries, hints: lad.asked.current, depth: lad.lv,
        helped: variant === 'B', followUp: variant === 'B' ? !s.bMiss : null });
      putAch(store, 'close', self ? 'self' : 'help');
      put({ done: true });
      sayNow(variant === 'B' ? c.okB : c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    if (variant === 'B') st.current.bMiss = true;
    sfx('soft', true);
    setMsg(r.m); sayNow(r.m, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const ins = (ch) => { setVal((x) => x + ch); setMsg(null); if (inputRef.current) inputRef.current.focus(); };
  const hints = [c.h1, c.h2, c.h3];
  const hint = hintOf(lad.lv, hints);
  const order = okNow ? FULL_DOC : DOC8;
  const tabText = okNow ? doc.title : eaten(doc.title, doc.text);
  const gapIdx = order.indexOf('title-nc');
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={hintOf(Math.min(3, lad.lv + 1), hints) || c.ask} nav={navOf(p, canGo)}>
      <Ask text={okNow ? (variant === 'B' ? c.okB : c.ok) : c.ask} hint={okNow ? null : (msg || hint)} n={variant === 'B' ? pick(UI.again) : null} />
      <div className="work pr s10-work v2-s8">
        <div className="v2-bcol">
          <MiniBrowser title={tabText} page={okNow ? doc.text : ''} flashTab={flash} flashPage={flash} hl={okNow ? null : 'title'} />
          {!okNow ? <p className="v2-tabnote" translate="no"><b>{pick(UI.onTab)}:</b> <span className="mono">{tabText}</span></p> : null}
          {!okNow && variant === 'A' && !solved ? <PlayerMsg text={c.chat} delay={1100} /> : null}
        </div>
        <CodeLines lines={buildLines(order, doc)} className="cv-big cv-10"
          renderText={(tk) => (tk.z === 'title-gap' ? (
            <span className={'gap-in' + (led ? ' is-led' : '')}>
              <InlineInput value={val} onChange={(x) => { setVal(x); setMsg(null); }} onEnter={check} inputRef={inputRef}
                placeholder={L3('…', '…', '…')} label={c.ask} max={12} cls="tk-input-tag" />
              <Led on={led} />
            </span>
          ) : <span className="tk-text">{tk.v}</span>)}
          lineProps={(ln, i) => ({ cls: (ln.id === 'title-nc' && lad.lv >= 1 && !okNow ? 'is-look ' : '') + (gapIdx >= 0 && Math.abs(i - gapIdx) > 1 ? 'is-ctx ' : '')
            + (gapIdx >= 0 && Math.abs(i - gapIdx) > 2 ? 'is-far' : '') })} />
      </div>
      {!okNow ? (
        <div className="pv-keys" role="group" translate="no">
          {['<', '/', '>'].map((k) => <button key={k} type="button" className="key-b mono" onMouseDown={(e) => e.preventDefault()} onClick={() => ins(k)} aria-label={k}>{k}</button>)}
          <button type="button" className="key-b key-erase" onMouseDown={(e) => e.preventDefault()} onClick={() => setVal((x) => x.slice(0, -1))} aria-label={pick(UI.erase)}><Icon name="undo" size={15} /></button>
          <button type="button" className="btn-accent key-check" disabled={!canTap || !val.trim()} onClick={check}>{pick(UI.check)}</button>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// S9. КАРКАС ПО КОНТУРАМ — 8 пустых мест, в лотке 9 строк: лишняя — название
// без ярлыков (как писал Пиксель). Касание ставит строку на текущее место,
// перетаскивание — на любое; строки меняются местами. «Проверить» — когда
// заняты все 8 мест. Рука — только на 3-й ступени, по отмеченным строкам.
// =============================================================================
const SLOTS9 = ['html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
const TRAY9 = ['body-c', 'title', 'html-o', 'stray', 'text', 'head-c', 'html-c', 'body-o', 'head-o'];
function check9(slots) {
  if (slots.indexOf('stray') >= 0) return { rule: 'stray', mark: ['stray'] };
  return check13(slots);
}
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? SLOTS9.slice() : Array(8).fill(null));
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(null);
  const [res, setRes] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const st = useRef({ checks: 0 });
  const tray = TRAY9.filter((id) => slots.indexOf(id) < 0);
  const full = slots.every(Boolean);
  const v = { title: '…', text: pick(UI.pageText), stray: pick(SAMPLE.title) };
  const lineOf = (id) => buildLines([id], v)[0];
  const led = useIdleLed(canTap && !solved && !full, slots.filter(Boolean).length);
  const putPiece = (id) => {
    if (!canTap || solved) return;
    const s = slots.slice();
    let at = s[cur] === null ? cur : s.indexOf(null);
    if (at < 0) return;
    s[at] = id;
    setSlots(s); setRes(null);
    const nextEmpty = s.indexOf(null);
    setCur(nextEmpty >= 0 ? nextEmpty : at);
    sfx('tap', true);
  };
  const tapSlot = (i) => {
    if (!canTap || solved) return;
    if (!slots[i]) { setCur(i); setHeld(null); return; }
    if (held === null) { setHeld(i); return; }
    if (held === i) { setHeld(null); return; }
    const s = slots.slice(); const t = s[held]; s[held] = s[i]; s[i] = t;
    setSlots(s); setRes(null); setHeld(null); sfx('tap', true);
  };
  const removeAt = (i) => { const s = slots.slice(); s[i] = null; setSlots(s); setCur(i); setHeld(null); setRes(null); };
  const check = () => {
    if (!canTap || !full || solved) return;
    st.current.checks += 1;
    const r = check9(slots);
    if (!r) {
      sfx('win', true); setRes(null);
      const self = st.current.checks === 1 && lad.asked.current === 0;
      log({ screenId: 's9', type: 'build-flat', correct: true, firstTry: self, attempts: st.current.checks, hints: lad.asked.current, depth: lad.lv });
      putAch(store, 'build', self ? 'self' : 'help');
      put({ done: true });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setRes(r); sayNow(c.rules[r.rule], 'think');
    if (st.current.checks >= 2) lad.bump();
  };
  const flatRef = useRef(null);
  const slotOf = (el) => {
    const ln = el && el.closest && el.closest('.cv-line');
    const box = flatRef.current;
    if (!ln || !box || !box.contains(ln)) return -1;
    return [...ln.parentNode.children].indexOf(ln) - 1;
  };
  const dropAt = (payload, k) => {
    if (!canTap || solved || k < 0 || k >= 8 || !payload) return;
    const s2 = slots.slice();
    if (payload.from === 'tray') s2[k] = payload.id;
    else if (payload.from === 'slot' && payload.k !== k) { const t2 = s2[payload.k]; s2[payload.k] = s2[k]; s2[k] = t2; }
    else return;
    setSlots(s2); setRes(null); setHeld(null);
    const ne = s2.indexOf(null);
    setCur(ne >= 0 ? ne : k);
    sfx('tap', true);
  };
  const dnd = useDragDrop((payload, el) => dropAt(payload, slotOf(el)));
  const labelOf = (id) => lineOf(id).toks.map((t) => (t.k === 'text' ? t.v : '<' + (t.k === 'close' ? '/' : '') + t.tag + '>')).join('');
  const onFlatDown = (e) => {
    if (!canTap || solved) return;
    const k = slotOf(e.target);
    if (k >= 0 && slots[k]) dnd.start(e, { from: 'slot', k }, labelOf(slots[k]));
  };
  const lineEl = (id) => { const i = slots.indexOf(id); const box = flatRef.current; return box && i >= 0 ? box.querySelectorAll('.cv-flat .cv-line')[i + 1] : null; };
  const hints = [c.h1, c.h2, c.h3];
  const hint = hintOf(lad.lv, hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={solved ? c.ok : (hintOf(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.ok : c.ask} hint={solved ? null : (res ? c.rules[res.rule] : hint)} n={solved ? null : slots.filter(Boolean).length + '/8'} />
      <div ref={flatRef} className="s13-row rb-rel" onPointerDown={onFlatDown}>
        <DemoHand wrapRef={flatRef} run={canTap && !solved && !!res && res.mark.length === 2 && lad.lv >= 3 && held === null && !dnd.ghost}
          targets={[() => (res ? lineEl(res.mark[0]) : null), () => (res ? lineEl(res.mark[1]) : null)]} />
        <CodeLines lines={buildLines(['doctype'].concat(slots), v)} className="cv-ex cv-flat"
          lineProps={(ln, i) => {
            if (i === 0) return { cls: 'is-fixed' };
            const k = i - 1;
            const id = slots[k];
            const marked = res && id && res.mark.indexOf(id) >= 0;
            return {
              onTap: () => tapSlot(k), disabled: !canTap || solved, led: led && !id && cur === k,
              cls: (!id && cur === k && !solved ? 'is-cur' : '') + (held === k ? ' is-held' : '') + (marked ? ' is-mark' : ''),
              empty: <span className="flat-dash" aria-label={pick(UI.slot) + ' ' + (i + 1)} />
            };
          }} />
        <div className="s13-side">
          {tray.length ? (
            <div className={'pool' + (solved ? ' v2-pool-left' : '')} role="group" aria-label={pick(UI.pieces)} translate="no">
              {tray.map((id) => {
                const ln = lineOf(id);
                return (
                  <button key={id} type="button" disabled={!canTap || solved}
                    className={'pool-chip' + (id === 'stray' ? ' v2-stray' : '') + (dnd.ghost && dnd.ghost.payload.id === id ? ' is-drag' : '')}
                    onPointerDown={(e) => { e.stopPropagation(); if (canTap && !solved) dnd.start(e, { from: 'tray', id }, labelOf(id)); }}
                    onClick={() => putPiece(id)}>
                    {ln.toks.map((t, j) => (t.k === 'text' ? <span key={j} className="tk-text">{t.v}</span> : <Tag key={j} tag={t.tag} close={t.k === 'close'} />))}
                  </button>
                );
              })}
            </div>
          ) : null}
          {full && !solved ? (
            <button type="button" className="bigbtn" disabled={!canTap} onClick={check}><span className="bigbtn-in"><Icon name="check" size={18} />{pick(UI.check)}</span></button>
          ) : null}
          {held !== null && slots[held] && !solved ? <button type="button" className="btn-ghost flat-remove" onClick={() => removeAt(held)}>{pick(UI.remove)}</button> : null}
          {slots.some(Boolean) && !solved ? <p className="swap-note">{pick(UI.swapNote)}</p> : null}
        </div>
      </div>
      <DragGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S10. СВОЯ СТРАНИЦА — пустые места вместо всех тегов; название и текст —
// ученика (экраны s4, s5). Верно набранный тег засчитывается сам, курсор
// уходит дальше; «Проверить» разбирает неверный. Браузер честный: пока у
// названия нет ярлыков title, вкладка — index.html, название — в окне.
// =============================================================================
const FIELDS10 = ['html-o', 'head-o', 'title-o', 'title-c', 'head-c', 'body-o', 'body-c', 'html-c'];
const WANT10 = { 'html-o': '<html>', 'head-o': '<head>', 'title-o': '<title>', 'title-c': '</title>', 'head-c': '</head>', 'body-o': '<body>', 'body-c': '</body>', 'html-c': '</html>' };
const TAGLINE10 = { 'html-o': 1, 'head-o': 1, 'head-c': 1, 'body-o': 1, 'body-c': 1, 'html-c': 1 };
const LINE10 = { 'html-o': 1, 'head-o': 2, 'title-o': 3, 'title-c': 3, 'head-c': 4, 'body-o': 5, 'body-c': 7, 'html-c': 8 };
function judgeTag(raw, want, c) {
  const w = tagWord(raw);
  if (w === want) return { ok: true };
  const close = want.indexOf('</') === 0;
  const name = want.replace(/[<>/]/g, '');
  if (close && w === '<' + name + '>') return { m: c.needClose };
  if (!close && w === '</' + name + '>') return { m: c.needOpen };
  if (w === '<' + name + '/>' || w === '<\\' + name + '>' || w === '<' + name + '>/') return { m: c.slashPlace };
  if (/^<\/?[a-z]+>$/.test(w)) return { m: c.otherTag };
  return { m: c.noBracket };
}
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s10;
  const mine = useMine();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const allLocked = () => FIELDS10.reduce((a, k) => Object.assign(a, { [k]: true }), {});
  const [vals, setVals] = useState(() => (solved ? Object.assign({}, WANT10) : {}));
  const [locked, setLocked] = useState(() => (solved ? allLocked() : {}));
  const [active, setActive] = useState(solved ? null : 'html-o');
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useLadder(!solved);
  const st = useRef({ tries: 0, misses: 0, fieldMiss: 0, hints: 0 });
  const refs = useRef({});
  const refOf = (k) => refs.current[k] || (refs.current[k] = { current: null });
  const lockedN = FIELDS10.filter((k) => locked[k]).length;
  const led = useIdleLed(canTap && !solved, lockedN);
  const target = active && !locked[active] ? active : FIELDS10.find((q) => !locked[q]) || null;
  const focusField = (k) => { setActive(k); setTimeout(() => { const r = refOf(k).current; if (r) r.focus(); }, 30); };
  const complete = () => {
    st.current.hints += lad.asked.current;
    const self = st.current.misses === 0 && st.current.hints === 0;
    store.set('artifact', { type: 'html-page', title: mine.title, text: mine.text, html: buildHtml(mine.title, mine.text) });
    putAch(store, 'page', self ? 'self' : 'help');
    log({ screenId: 's10', type: 'write-page', correct: true, firstTry: self, attempts: st.current.tries, hints: st.current.hints, depth: lad.lv });
    put({ done: true });
    setFlash((f) => ({ tab: f.tab + 1, page: f.page + 1 }));
    sfx('win', true);
    sayNow(c.done, 'smile');
  };
  const lockIt = (k) => {
    const lk = Object.assign({}, locked, { [k]: true });
    setLocked(lk);
    setVals((vs) => Object.assign({}, vs, { [k]: WANT10[k] }));
    st.current.tries += 1;
    st.current.fieldMiss = 0;
    st.current.hints += lad.asked.current;
    if (lad.lv) lad.reset();
    setMsg(null);
    sfx('ok', true);
    if ((k === 'title-o' || k === 'title-c') && lk['title-o'] && lk['title-c']) setFlash((f) => ({ tab: f.tab + 1, page: f.page + 1 }));
    const i0 = FIELDS10.indexOf(k);
    const nx = FIELDS10.slice(i0 + 1).concat(FIELDS10.slice(0, i0)).find((q) => !lk[q]);
    if (!nx) { setActive(null); complete(); } else focusField(nx);
  };
  const change = (k, x) => {
    if (!canTap || locked[k] || solved) return;
    setVals((vs) => Object.assign({}, vs, { [k]: x }));
    setMsg(null);
    if (tagWord(x) === WANT10[k]) lockIt(k);
  };
  const check = () => {
    if (!canTap || solved || !target) return;
    const raw = vals[target] || '';
    if (!raw.trim()) { focusField(target); return; }
    st.current.tries += 1;
    const r = judgeTag(raw, WANT10[target], c);
    if (r.ok) { lockIt(target); return; }
    st.current.misses += 1;
    st.current.fieldMiss += 1;
    sfx('soft', true); setMsg(r.m); sayNow(r.m, 'think');
    if (st.current.fieldMiss >= 2) lad.bump();
  };
  const ins = (s) => { if (!target) return; change(target, (vals[target] || '') + s); focusField(target); };
  const erase = () => { if (!target) return; change(target, (vals[target] || '').slice(0, -1)); focusField(target); };
  const ledOn = (k) => !solved && k === target && (led || lad.lv >= 3);
  const field = (k) => {
    if (locked[k]) { const w = WANT10[k]; return <Tag tag={w.replace(/[<>/]/g, '')} close={w.indexOf('</') === 0} />; }
    return (
      <span className={'gap-in v2-gap' + (active === k ? ' is-act' : '') + (ledOn(k) ? ' is-led' : '')}>
        <InlineInput value={vals[k] || ''} onChange={(x) => change(k, x)} onEnter={check} onFocus={() => setActive(k)} inputRef={refOf(k)}
          placeholder={L3('…', '…', '…')} label={c.ask} max={10} cls="tk-input-tag" />
        <Led on={ledOn(k)} />
      </span>
    );
  };
  const lines = buildLines(FULL_DOC, { title: mine.title, text: mine.text }).map((ln) => {
    if (TAGLINE10[ln.id] && !locked[ln.id]) return Object.assign({}, ln, { empty: true, toks: [] });
    if (ln.id === 'title') return Object.assign({}, ln, { toks: [{ k: 'text', v: '', z: 'f:title-o' }, ln.toks[1], { k: 'text', v: '', z: 'f:title-c' }] });
    return ln;
  });
  const actLine = target ? LINE10[target] : -1;
  const lineCls = (i) => (actLine >= 0 && Math.abs(i - actLine) > 1 ? 'is-ctx' : '');
  const titled = !!(locked['title-o'] && locked['title-c']);
  const hints = [c.h1, c.h2, target ? fillL(c.h3, { tag: WANT10[target] }) : c.h2];
  const hint = hintOf(lad.lv, hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={solved ? c.done : (hintOf(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.done : c.ask} hint={solved ? null : (msg || hint)} n={solved ? null : lockedN + '/8'} />
      <div className="work pr s10-work v2-own">
        <MiniBrowser title={titled ? mine.title : ''} page={titled ? mine.text : mine.title + ' ' + mine.text} flashTab={flash.tab} flashPage={flash.page} />
        <CodeLines lines={lines} className="cv-big cv-10"
          renderText={(tk) => (tk.z === 'f:title-o' ? field('title-o') : tk.z === 'f:title-c' ? field('title-c') : <span className="tk-text">{tk.v}</span>)}
          lineProps={(ln, i) => (TAGLINE10[ln.id] && !locked[ln.id] ? { empty: field(ln.id), cls: lineCls(i) } : { cls: lineCls(i) })} />
      </div>
      {!solved ? (
        <div className="pv-keys v2-keys" role="group" translate="no">
          {['<', '/', '>'].map((k) => <button key={k} type="button" className="key-b mono" onMouseDown={(e) => e.preventDefault()} onClick={() => ins(k)} aria-label={k}>{k}</button>)}
          {['html', 'head', 'title', 'body'].map((w) => (
            <button key={w} type="button" className="key-b key-w mono" style={{ '--c': TAGC[w] }} onMouseDown={(e) => e.preventDefault()} onClick={() => ins(w)}>{w}</button>
          ))}
          <button type="button" className="key-b key-erase" onMouseDown={(e) => e.preventDefault()} onClick={erase} aria-label={pick(UI.erase)}><Icon name="undo" size={15} /></button>
          <button type="button" className="btn-accent key-check" disabled={!canTap || !target || !(vals[target] || '').trim()} onClick={check}>{pick(UI.check)}</button>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// S11. ВОПРОСЫ ПИКСЕЛЯ — три вопроса, выбор из трёх; неверный вариант гаснет с
// причиной, после двух промахов светится верный. В первом вопросе — ошибка
// Пикселя из экрана s1: «Пиксель тоже так думал!».
// =============================================================================
const Q_ORDER = [[1, 0, 2], [2, 1, 0], [0, 2, 1]];
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [qi, setQi] = useState(0);
  const [off, setOff] = useState([]);
  const [okI, setOkI] = useState(null);
  const [msg, setMsg] = useState(null);
  const [fin, setFin] = useState(solved);
  const [pending, setPending] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.qs[0].q, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(fin, spoken);
  const q = c.qs[qi];
  const led = useIdleLed(canTap && !fin && okI === null, qi * 10 + off.length);
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => {
      setPending(false); setOff([]); setOkI(null); setMsg(null);
      const ni = qi + 1;
      setQi(ni);
      sayNow(c.qs[ni].q, 'curious');
    }, reduceMotion() ? 300 : 900);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const answer = (i) => {
    if (!canTap || fin || okI !== null || off.indexOf(i) >= 0) return;
    const o = q.opts[i];
    if (o.ok) {
      sfx('ok', true); setOkI(i); setMsg(null);
      log({ screenId: 's11.q' + (qi + 1), type: 'quiz', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      if (qi + 1 >= c.qs.length) { put({ done: true }); setFin(true); sayNow(joinL(q.ok, c.done), 'smile'); return; }
      sayNow(q.ok, 'smile');
      setPending(true);
      return;
    }
    sfx('soft', true);
    setOff(off.concat(i));
    setMsg(o.why);
    sayNow(o.why, 'think');
  };
  const glow = off.length >= 2 ? q.opts.findIndex((o) => o.ok) : -1;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={fin ? c.done : q.q} nav={navOf(p, canGo)}>
      <Ask text={fin ? c.done : q.q} hint={fin || okI !== null ? null : msg} n={fin ? null : (qi + 1) + '/' + c.qs.length} />
      <div className="v2-quiz">
        <div className="v2-qpix">
          <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: '?', scr2: pick(UI.qMark) }} label={UI.robot} />
        </div>
        {fin ? (
          <div className="v2-qsum" role="list">
            {c.qs.map((qq, k) => (
              <span key={k} className="v2-qsum-i" role="listitem"><Icon name="check" size={13} /><b>{pick(qq.q)}</b> {pick(qq.opts.find((o) => o.ok).t)}</span>
            ))}
          </div>
        ) : (
          <div className="v2-qopts" role="group">
            {Q_ORDER[qi].map((i) => {
              const o = q.opts[i];
              const isOff = off.indexOf(i) >= 0;
              return (
                <button key={i} type="button" disabled={!canTap || okI !== null || isOff} onClick={() => answer(i)}
                  className={'v2-qopt' + (isOff ? ' is-off' : '') + (okI === i ? ' is-ok' : '') + (glow === i && okI === null ? ' is-glow' : '')}>
                  <span translate="no">{pick(o.t)}</span>
                  <Led on={led && !isOff && okI === null} />
                </button>
              );
            })}
          </div>
        )}
      </div>
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
  const led = useIdleLed(canTap && !solved, placed.length);   // сначала светодиод, рука — только после промаха
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
        sayNow(joinL(c.ok[piece], c.done), 'smile');
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
      lit={lit} shake={shake} led={led && sel && lad.lv >= 3 ? ['html', 'head'] : []} label={c.ask} />
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
            <DemoHand wrapRef={exRef} drag label={UI.piece.head} run={canTap && !solved && placed.length === 0 && !sel && !dnd.ghost && st.current.misses > 0}
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
                  {UI.piece[k]}<Led on={led && !sel && (lad.lv < 3 || k === PIECES.filter((q) => !has(q))[0])} />
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
// =============================================================================
// S12. ТВОЯ СТРАНИЦА НА ЭКРАНЕ PIXEL (единственный праздник урока: конфетти — только здесь) — финал: Pixel со всеми слоями показывает
// страницу ученика, рядом её код; подтверждённые достижения.
// =============================================================================
function S12({ p }) {
  // Финал без перегруза (заказчик, 17.10.2026): крупный Пиксель со страницей ученика
  // на экране, короткий список того, что получилось, и следующий урок. Код и
  // браузер здесь больше не дублируются — они были на всех экранах урока.
  const pick = usePick();
  const store = useStore();
  const c = C.s12;
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
          <PlayerMsg text={c.chat} delay={1600} />
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
  { id: 'r1', code: 'HOOK', Comp: R1 }, { id: 'r2', code: 'HOOK', Comp: R2 },
  { id: 's1', code: 'SHOW', Comp: S1 }, { id: 's2', code: 'LEVEL-1', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'LEVEL-2', Comp: S4 }, { id: 's5', code: 'LEVEL-3', Comp: S5 }, { id: 's6', code: 'PREDICT', Comp: S6 },
  { id: 's7', code: 'LEVEL-4', Comp: S7 }, { id: 's8', code: 'CHECK-1', Comp: S8 }, { id: 's9', code: 'LEVEL-5', Comp: S9 },
  { id: 's10', code: 'RESULT', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 }, { id: 's12', code: 'ACHIEVEMENT', Comp: S12 }
];
// «Повторить» стирает только экран; тексты ученика (myTitle, myText,
// artifact) и достижения (ach) сохраняются.
const SCREEN_RESET = { r1: ['r1'], r2: ['r2'], s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'],
  s9: ['s9'], s10: ['s10'], s11: ['s11'] };

export default function HtmlStruktura2({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
