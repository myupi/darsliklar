// =============================================================================
// ===== ТЕСТОВЫЙ УРОК · «Моя первая страница: исследуй, собери, создай» ======
//
// Эксперимент: интерактивный HTML + Anatomy. Тема урока 1 курса HTML для
// 11–14 лет, 14 экранов. Канон курса — дословно сверху, не правится.
//
// ОДНА МОДЕЛЬ ДОКУМЕНТА. Документ — это { order, title, text }: порядок строк
// (FULL_DOC и его варианты) и два текста. Из неё строятся код (CodeLines),
// дерево структуры (Tree), объёмная модель (Fig) и мини-браузер — поэтому
// после любого действия они не расходятся.
//
// ОБЪЁМ (навык anatomy) — только на экранах 3 (исследование вложенности) и 7
// (сборка) и коротко в финале. Модель показывает вложенность: коробка html,
// отделения head и body, карточка title в head; табличка <!DOCTYPE html> стоит
// отдельно перед коробкой — это служебная строка, а не часть html.
//
// ПОМОЩЬ. Лесенка из трёх ступеней: 1 — направить внимание, 2 — назвать
// принцип, 3 — помочь с конкретным действием (только тогда загорается место).
// Ступень поднимает лампочка в шапке или затруднение. После 3-й ступени —
// новый короткий пример того же типа. Журнал (log канона) пишет по строке на
// задачу: первая попытка, попытки, подсказки (hints, depth), помощь (helped),
// результат нового примера (followUp), самостоятельность (independent).
//
// Учебная проверка структуры — не поведение браузера: браузер исправляет
// разметку сам, урок проверяет расположение явно записанных тегов. Поломок
// браузера урок не рисует.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you». Файл собирается скриптом
// tools/anatomy/pervaya.build.mjs; правится этот исходник и фигура
// tools/anatomy/pervaya.figures.mjs.
// =============================================================================

const META = {
  lessonId: 'test-html-pervaya-stranitsa',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'Birinchi sahifam: o‘rganing, yig‘ing, yarating',
    ru: 'Моя первая страница: исследуй, собери, создай',
    en: 'My first page: explore, build, create'
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

const SAMPLE = {
  title: L3('Kodi sahifasi', 'Страница Коди', 'Kodi’s page'),
  text: L3('Salom! Mehmonga keling!', 'Привет! Заходи в гости!', 'Hi! Come and visit!')
};

const UI = {
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  page: L3('Sahifa', 'Страница', 'Page'),
  code: L3('Kod', 'Код', 'Code'),
  volume: L3('Hajm', 'Объём', 'Volume'),
  inspector: L3('Tuzilma qoidasi', 'Правило структуры', 'Structure rule'),
  changeTitle: L3('Nomni o‘zgartirish', 'Поменять название', 'Change the name'),
  changeText: L3('Salomni o‘zgartirish', 'Поменять приветствие', 'Change the greeting'),
  was: L3('Oldin', 'Было', 'Before'),
  now: L3('Hozir', 'Сейчас', 'Now'),
  before: L3('O‘zgarishlargacha', 'До изменений', 'Before changes'),
  reset: L3('Namunani qaytarish', 'Вернуть пример', 'Restore the example'),
  erase: L3('So‘zni o‘chirish', 'Стереть слово', 'Erase a word'),
  notes: L3('Izohlar', 'Пояснения', 'Notes'),
  hide: L3('Yashirish', 'Свернуть', 'Hide'),
  show: L3('Ko‘rsatish', 'Показать', 'Show'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  remove: L3('Qatorni olib tashlash', 'Убрать строку', 'Remove the line'),
  author: L3('Muallif', 'Автор', 'Author'),
  ready: L3('Sahifa tayyor', 'Страница готова', 'The page is ready'),
  saveNote: L3('U darsni tugatganingizda natija bilan birga saqlanadi.', 'Она сохранится вместе с результатом, когда ты завершишь урок.', 'It will be saved with your result when you finish the lesson.'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Katta sarlavha va xatboshilar qo‘shamiz', 'Добавим большой заголовок и абзацы', 'We add a big heading and paragraphs'),
  hintN: L3('Maslahat', 'Подсказка', 'Hint'),
  again: L3('yangi misol', 'новый пример', 'new example'),
  labels: { start: L3('Boshlanish', 'Начало', 'Start'), content: L3('Mazmun', 'Содержимое', 'Content'), end: L3('Oxiri', 'Конец', 'End') },
  pieces: L3('Qismlar', 'Детали', 'Pieces'),
  piece: { head: '<head>…</head>', body: '<body>…</body>', title: '<title>…</title>' },
  dragTip: L3('Qismni kodga sudrang yoki bosing, keyin joyni tanlang', 'Перетащи деталь в код — или нажми на неё, потом на место', 'Drag a piece into the code, or tap it and then the place'),
  dragTitle: L3('title qatorini head ichiga sudrang yoki bosing, keyin joyni tanlang', 'Перетащи строку title внутрь head — или нажми её, потом место', 'Drag the title line into head, or tap it and then the place'),
  here: L3('shu yerga: head ichiga', 'сюда: внутрь head', 'here: into head'),
  intoHtml: L3('html ichiga', 'внутрь html', 'into html'),
  intoHead: L3('head ichiga', 'внутрь head', 'into head'),
  intoBody: L3('body ichiga', 'внутрь body', 'into body'),
  tree: L3('Hujjat tuzilishi', 'Структура документа', 'Document structure'),
  pageText: L3('sahifa matni', 'текст страницы', 'page text'),
  slot: L3('joy', 'место', 'slot'),
  swapNote: L3('Qatorni bosing, keyin boshqasini — ular joy almashadi. Tanlangan qatorni olib tashlash mumkin.', 'Нажми строку, потом другую — они поменяются местами. Выбранную строку можно убрать.', 'Tap a line, then another: they swap places. A chosen line can be removed.'),
  noTags: L3('Bu yerga faqat so‘zlar, burchaklarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no angle brackets.'),
  ideas: L3('G‘oyalar', 'Идеи', 'Ideas'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  scheme: L3('Tuzilma', 'Структура', 'Structure'),
  done: L3('Bajarildi', 'Сделано', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплики Коди короткие: одна реплика — одна связь или одно действие.
// Звучат: say, lines, ok, miss, h1–h3 … ; печатаются: eyebrow, ask, btn, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Bitta sahifa', 'Одна страница', 'One page'),
    say: L3('Sahifaning yorliqda nomi va ichida matni bor. Bugun o‘zingiznikini yasaysiz.',
      'У страницы есть название на вкладке и текст внутри. Сегодня ты сделаешь свою.',
      'A page has a name on the tab and text inside. Today you will make your own.'),
    done: L3('Siz sahifani o‘zgartirdingiz. Endi bu qanday ishlashini bilib olamiz.',
      'Ты уже изменил страницу. Теперь узнаем, как это работает.',
      'You have already changed the page. Now let us find out how it works.'),
    titles: [L3('Mening saytim', 'Мой сайт', 'My site'), L3('Kosmos', 'Космос', 'Space'), L3('Mushuklar', 'Котики', 'Cats')],
    texts: [L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'), L3('Men HTML o‘rganyapman.', 'Я учу HTML.', 'I am learning HTML.'), L3('Xush kelibsiz!', 'Добро пожаловать!', 'Welcome!')],
    ask: L3('Nima o‘zgartiramiz?', 'Что поменяем?', 'What shall we change?'),
    askPick: L3('Variantni tanlang', 'Выбери вариант', 'Choose an option'),
    askDone: L3('Yana birini sinab ko‘ring yoki «Keyingi»ni bosing', 'Попробуй ещё или нажми «Дальше»', 'Try another one or tap “Next”')
  },

  s2: {
    eyebrow: L3('Teg qismlari', 'Части тега', 'Parts of a tag'),
    say: L3('Qatordagi har bir qismni bosing.', 'Нажми на каждую часть строки.', 'Tap each part of the line.'),
    parts: {
      start: L3('Bu yerda sahifa mazmuni boshlanadi.', 'Здесь начинается содержимое страницы.', 'The page content starts here.'),
      content: L3('Bu matnni tashrif buyuruvchi ko‘radi.', 'Это текст, который увидит посетитель.', 'This is the text a visitor will see.'),
      end: L3('Bu yerda bu qism tugaydi.', 'Здесь эта часть заканчивается.', 'This part ends here.')
    },
    phase2: L3('Endi yangi qator. Belgini tanlang, keyin qator qismini.', 'Теперь новая строка. Выбери подпись, потом часть строки.', 'Now a new line. Choose a label, then a part of the line.'),
    ok: {
      start: L3('Ha, bu boshlanish: qiya chiziqsiz teg.', 'Да, это начало: тег без косой черты.', 'Yes, this is the start: a tag without a slash.'),
      content: L3('Ha, mazmun teglar orasida turadi.', 'Да, содержимое стоит между тегами.', 'Yes, the content sits between the tags.'),
      end: L3('Ha, bu oxiri: tegda qiya chiziq bor.', 'Да, это конец: в теге есть косая черта.', 'Yes, this is the end: the tag has a slash.')
    },
    miss: {
      start: L3('Bu yozuvda qiya chiziq yo‘q — u boshlanishni bildiradi.', 'В этой записи нет косой черты — она обозначает начало.', 'This one has no slash: it marks the start.'),
      content: L3('Bu burchaklarsiz matn — bu mazmun.', 'Это текст без уголков — это содержимое.', 'This is text without angle brackets: it is the content.'),
      end: L3('Bu yozuvda qiya chiziq bor — u oxirini bildiradi.', 'В этой записи есть косая черта — она обозначает конец.', 'This one has a slash: it marks the end.')
    },
    h1: L3('Burchaklar va qiya chiziqqa qarang.', 'Посмотри на уголки и косую черту.', 'Look at the angle brackets and the slash.'),
    h2: L3('Boshlanish va oxiri — burchakli teglar. Mazmun ular orasida.', 'Начало и конец — теги в уголках. Содержимое — между ними.', 'Start and end are tags in brackets. The content is between them.'),
    h3: L3('«Oxiri» — o‘ngdagi, qiya chiziqli yozuv.', '«Конец» — запись справа, с косой чертой.', '“End” is the one on the right, with the slash.'),
    done: L3('Boshlanish, mazmun, oxiri — har bir element shunday tuzilgan.', 'Начало, содержимое, конец — так устроен каждый из этих элементов.', 'Start, content, end: each of these elements is built like this.'),
    askA: L3('Har bir qismni bosing', 'Нажми на каждую часть', 'Tap each part'),
    askB: L3('Belgini tanlang, keyin qismni', 'Выбери подпись, потом часть', 'Choose a label, then a part'),
    askFollow: L3('Yangi qator: belgilarni qo‘ying', 'Новая строка: расставь подписи', 'A new line: place the labels')
  },

  s3: {
    eyebrow: L3('Hujjatni oching', 'Открой документ', 'Open the document'),
    say: L3('Bu hujjat modeli. Yorliq nomi qayerda saqlanishini oching.', 'Это модель документа. Открой место, где хранится название вкладки.', 'This is a document model. Open the place where the tab name is kept.'),
    html: L3('html hujjat qismlarini birlashtiradi. Ichida ikki bo‘lim: head va body.', 'html объединяет части документа. Внутри — два отделения: head и body.', 'html holds the parts of the document together. Inside are two sections: head and body.'),
    head: L3('head da sahifa haqidagi ma’lumot. Ichida title yotibdi.', 'В head — сведения о странице. Внутри лежит title.', 'head has information about the page. title lies inside it.'),
    title: L3('head ichidagi title yorliq nomini beradi. Kodga va yorliqqa qarang.', 'title внутри head задаёт название вкладки. Посмотри на код и на вкладку.', 'title inside head sets the tab name. Look at the code and at the tab.'),
    body: L3('body da sahifada ko‘rinadigan narsa.', 'В body — то, что видно на странице.', 'body holds what you see on the page.'),
    doctype: L3('Bu xizmat qatori. U html dan oldin turadi va brauzerga bu HTML hujjat ekanini aytadi. Bu quti emas, uning jufti yo‘q.',
      'Это служебная строка. Она стоит перед html и сообщает браузеру, что это HTML-документ. Это не коробка, и пары у неё нет.',
      'This is a service line. It comes before html and tells the browser this is an HTML document. It is not a box, and it has no pair.'),
    needHead: L3('title head bo‘limida. Avval head ni oching.', 'title лежит в отделении head. Сначала открой head.', 'title is in the head section. Open head first.'),
    ask: L3('Yorliq nomi saqlanadigan joyni oching', 'Открой место, где хранится название вкладки', 'Open the place where the tab name is kept'),
    askDone: L3('Topildi! Qismlarni yana ochib-yopishingiz mumkin', 'Нашёл! Части можно открывать и закрывать ещё', 'Found it! You can open and close the parts again')
  },

  s4: {
    eyebrow: L3('Sahifa nomi', 'Имя страницы', 'Page name'),
    say: L3('title ichidagi matnni o‘zgartiring: tayyor nomni tanlang yoki o‘zingiz yozing.', 'Измени текст внутри title: выбери готовое название или напиши своё.', 'Change the text inside title: pick a ready name or write your own.'),
    done: L3('Yorliq nomi title dan olinadi. Sahifa o‘sha-o‘sha qoldi.', 'Название вкладки берётся из title. Страница осталась прежней.', 'The tab name comes from title. The page stayed the same.'),
    opts: [L3('Mening sahifam', 'Моя страница', 'My page'), L3('O‘yinlar olami', 'Мир игр', 'World of games'), L3('Kosmos klubi', 'Клуб космоса', 'Space club')],
    ask: L3('title ichidagi matnni o‘zgartiring', 'Измени текст внутри title', 'Change the text inside title')
  },

  s5: {
    eyebrow: L3('Tashrif buyuruvchiga', 'Напиши посетителю', 'Write to a visitor'),
    say: L3('Endi sahifa matnini yozing: so‘zlarni bosing yoki o‘zingiz yozing.', 'Теперь напиши текст страницы: нажимай слова или печатай сам.', 'Now write the page text: tap words or type yourself.'),
    done: L3('Bu matn body ichida. Uni tashrif buyuruvchi ko‘radi.', 'Этот текст находится внутри body. Его видит посетитель.', 'This text is inside body. A visitor sees it.'),
    words: [L3('Salom!', 'Привет!', 'Hi!'), L3('Bu', 'Это', 'This'), L3('mening', 'моя', 'is my'), L3('sahifam.', 'страница.', 'page.'), L3('Men', 'Я', 'I'), L3('yaxshi ko‘raman', 'люблю', 'love'), L3('kosmosni', 'космос', 'space')],
    ask: L3('body ichiga sahifa matnini yozing', 'Напиши текст страницы внутри body', 'Write the page text inside body')
  },

  s6: {
    eyebrow: L3('Oldindan ayting', 'Угадай до запуска', 'Guess first'),
    rounds: {
      title: { want: 'tab', text: L3('Sport', 'Спорт', 'Sports'), extra: L3('Musiqa', 'Музыка', 'Music'),
        ask: L3('title ichida «{t}» bo‘ladi. Yangi nom qayerda paydo bo‘ladi?', 'В title будет «{t}». Где появится новое название?', 'title will say “{t}”. Where will the new name appear?') },
      body: { want: 'page', text: L3('Bugun o‘yin bor!', 'Сегодня игра!', 'There is a game today!'), extra: L3('Men chizishni yaxshi ko‘raman.', 'Я люблю рисовать.', 'I love drawing.'),
        ask: L3('body ichida «{t}» bo‘ladi. Bu matn qayerda paydo bo‘ladi?', 'В body будет «{t}». А где появится этот текст?', 'body will say “{t}”. Where will this text appear?') }
    },
    say: L3('Avval taxmin qiling, keyin ishga tushiramiz.', 'Сначала угадай, потом запустим.', 'Guess first, then we run it.'),
    okTab: L3('To‘g‘ri: title yorliqni o‘zgartirdi, sahifa o‘zgarmadi.', 'Верно: title изменил вкладку, страница не изменилась.', 'Right: title changed the tab; the page did not change.'),
    okPage: L3('To‘g‘ri: body dagi matn sahifada, yorliq o‘zgarmadi.', 'Верно: текст из body — на странице, вкладка не изменилась.', 'Right: the text from body is on the page; the tab did not change.'),
    missTab: L3('Qarang: matn yorliqqa tushdi. title — yorliq nomi. Yangi misol.', 'Смотри: текст попал на вкладку. title — это название вкладки. Новый пример.', 'Look: the text went to the tab. title is the tab name. A new example.'),
    missPage: L3('Qarang: matn sahifada paydo bo‘ldi. body — sahifa mazmuni. Yangi misol.', 'Смотри: текст появился на странице. body — содержимое страницы. Новый пример.', 'Look: the text appeared on the page. body is the page content. A new example.'),
    done: L3('title — yorliq uchun, body — sahifa uchun.', 'title — для вкладки, body — для страницы.', 'title is for the tab, body is for the page.')
  },

  s7: {
    eyebrow: L3('Yig‘ib tushunamiz', 'Собери, чтобы разобраться', 'Build to understand'),
    say: L3('Qismni tanlang, keyin uning joyini. Har bir qism bilan kod qatorlari paydo bo‘ladi.', 'Выбери деталь, потом её место. С каждой деталью появятся строки кода.', 'Choose a piece, then its place. Code lines appear with each piece.'),
    ok: {
      head: L3('head html ichida.', 'head внутри html.', 'head is inside html.'),
      body: L3('body html ichida, head dan keyin.', 'body внутри html, после head.', 'body is inside html, after head.'),
      title: L3('title head ichida.', 'title внутри head.', 'title is inside head.')
    },
    titleBody: L3('Yorliq nomi — sahifa haqidagi ma’lumot. Uning joyini head ichidan toping.', 'Название вкладки — это сведения о странице. Найди для него место внутри head.', 'The tab name is information about the page. Find a place for it inside head.'),
    titleHtml: L3('title to‘g‘ridan-to‘g‘ri html ga emas, bo‘limlardan biriga qo‘yiladi. Qaysi biri sahifa haqida?', 'title кладут не прямо в html, а в одно из отделений. Какое из них — о странице?', 'title does not go straight into html but into one of the sections. Which one is about the page?'),
    bodyFirst: L3('html ichida avval head, body esa undan keyin.', 'Внутри html сначала идёт head, а body — после него.', 'Inside html, head comes first and body after it.'),
    nested: L3('head va body — ikki alohida bo‘lim, ikkalasi html ichida.', 'head и body — два отдельных отделения, оба внутри html.', 'head and body are two separate sections, both inside html.'),
    noPlace: L3('Bu bo‘lim hali yo‘q.', 'Этого отделения пока нет.', 'That section is not there yet.'),
    pickFirst: L3('Avval qismni tanlang.', 'Сначала выбери деталь.', 'Choose a piece first.'),
    done: L3('Yig‘ildi! Endi «Hajm» va «Kod» ni almashtirib solishtiring.', 'Собрано! Теперь переключай «Объём» и «Код» и сравнивай.', 'Built! Now switch between “Volume” and “Code” and compare.'),
    ask: L3('Qismni tanlang, keyin joyini', 'Выбери деталь, потом место', 'Choose a piece, then its place'),
    askPlace: L3('Endi joyni tanlang', 'Теперь выбери место', 'Now choose the place'),
    askDone: L3('Qismni tanlang — u ikkala ko‘rinishda ham belgilanadi', 'Выбери часть — она выделится в обоих видах', 'Choose a part: it stays selected in both views')
  },

  s8: {
    eyebrow: L3('Qism qayerda tugaydi?', 'Где заканчивается часть?', 'Where does a part end?'),
    say: L3('Bu teglarning yopuvchi jufti bor. Ochuvchi tegni, keyin uning juftini tanlang.', 'У этих тегов есть закрывающая пара. Выбери открывающий тег, потом его пару.', 'These tags have a closing pair. Choose an opening tag, then its pair.'),
    area: {
      html: L3('html va yopuvchi html orasida — butun hujjat.', 'Между html и закрывающим html — весь документ.', 'Between html and closing html is the whole document.'),
      head: L3('head va yopuvchi head orasida — sahifa haqidagi ma’lumot.', 'Между head и закрывающим head находятся сведения о странице.', 'Between head and closing head is the information about the page.'),
      title: L3('title va yopuvchi title orasida — yorliq nomi.', 'Между title и закрывающим title — название вкладки.', 'Between title and closing title is the tab name.'),
      body: L3('body va yopuvchi body orasida — sahifada ko‘rinadigan narsa.', 'Между body и закрывающим body — то, что видно на странице.', 'Between body and closing body is what you see on the page.')
    },
    closeFirst: L3('Bu yopuvchi teg — unda qiya chiziq bor. Avval ochuvchisini tanlang.', 'Это закрывающий тег — в нём косая черта. Сначала выбери открывающий.', 'That is a closing tag: it has a slash. Choose the opening one first.'),
    otherPair: L3('Bu boshqa teg: {b}. Siz {a} dan boshladingiz — nom bir xil bo‘lishi kerak.', 'Это другой тег: {b}. Ты начал с {a} — имя должно совпадать.', 'That is another tag: {b}. You started with {a}: the name must match.'),
    twoOpen: L3('Bu ham ochuvchi teg. Juftida qiya chiziq bo‘ladi.', 'Это тоже открывающий тег. У пары будет косая черта.', 'This is an opening tag too. Its pair has a slash.'),
    picked: L3('Endi uning yopuvchi juftini toping', 'Теперь найди его закрывающую пару', 'Now find its closing pair'),
    done: L3('To‘rtta juft topildi: ular bir-birining ichida.', 'Все четыре пары найдены: они вложены друг в друга.', 'All four pairs found: they are nested inside each other.'),
    ask: L3('Ochuvchi tegni, keyin juftini tanlang', 'Выбери открывающий тег, потом его пару', 'Choose an opening tag, then its pair')
  },

  s9: {
    eyebrow: L3('Kodi joyni chalkashtirdi', 'Коди перепутал место', 'Kodi mixed up a place'),
    say: L3('Menimcha, nomni noto‘g‘ri joyga qo‘ydim. Yordam berasizmi?', 'Кажется, я положил название не туда. Поможешь разобраться?', 'I think I put the name in the wrong place. Will you help?'),
    rule: L3('Bizning hujjatda title head ichida turadi', 'В нашем документе title находится внутри head', 'In our document, title sits inside head'),
    pickTitle: L3('Avval title qatorini tanlang', 'Сначала выбери строку title', 'First choose the title line'),
    pickPlace: L3('Endi head ichidagi joyni tanlang', 'Теперь выбери место внутри head', 'Now choose a place inside head'),
    inBody: L3('Bu body — u yerda sahifada ko‘rinadigan narsa. title boshqa joyda bo‘lishi kerak.', 'Это body — там то, что видно на странице. title должен быть в другом месте.', 'That is body: it holds what shows on the page. title belongs elsewhere.'),
    inHtml: L3('Bu to‘g‘ridan-to‘g‘ri html. Qaysi bo‘lim sahifa haqida?', 'Это прямо html. Какое отделение — о странице?', 'That is straight in html. Which section is about the page?'),
    h1: L3('Qoida paneliga qarang.', 'Посмотри на панель правила.', 'Look at the rule panel.'),
    h2: L3('title — sahifa haqidagi ma’lumot, ular head da.', 'title — сведения о странице, они в head.', 'title is information about the page; that lives in head.'),
    h3: L3('<head> qatorini bosing — title uning ichiga o‘tadi.', 'Нажми строку <head> — title переедет внутрь.', 'Tap the <head> line: title moves inside.'),
    ok: L3('title head da. Kod va tuzilma birga yangilandi.', 'title в head. Код и структура обновились вместе.', 'title is in head. The code and the structure updated together.'),
    again: L3('Yana bir hujjat — o‘zingiz tuzating.', 'Ещё один документ — исправь сам.', 'One more document: fix it yourself.'),
    ask: L3('title ni head ga o‘tkazing', 'Перенеси title в head', 'Move title into head')
  },

  s10: {
    eyebrow: L3('Oxirini yozing', 'Допиши окончание', 'Write the ending'),
    say: L3('Matn yozilgan. Endi body qayerda tugashini belgilaymiz.', 'Текст уже написан. Теперь обозначим, где заканчивается body.', 'The text is written. Now let us mark where body ends.'),
    sayHead: L3('Endi head qayerda tugashini belgilang.', 'Теперь обозначь, где заканчивается head.', 'Now mark where head ends.'),
    open: L3('Bu ochuvchi teg. Yopuvchi teg qismni tugatadi.', 'Это открывающий тег. Закрывающий заканчивает часть.', 'That is an opening tag. A closing tag ends the part.'),
    noSlash: L3('Qiya chiziq yetishmayapti.', 'Не хватает косой черты.', 'The slash is missing.'),
    noBracket: L3('Burchak yetishmayapti.', 'Не хватает уголка.', 'An angle bracket is missing.'),
    otherName: L3('Bu boshqa nom. Bizga {tag} kerak.', 'Это другое имя. Нам нужен {tag}.', 'That is a different name. We need {tag}.'),
    h1: L3('Yuqoridagi ochuvchi tegga qarang.', 'Посмотри на открывающий тег выше.', 'Look at the opening tag above.'),
    h2: L3('Yopuvchi teg ochuvchisiga o‘xshaydi, faqat qiya chiziq bilan.', 'Закрывающий тег похож на открывающий, только с косой чертой.', 'A closing tag looks like the opening one, only with a slash.'),
    h3: L3('Qiya chiziq «<» dan keyin darhol turadi.', 'Косая черта стоит сразу после «<».', 'The slash comes right after “<”.'),
    ok: L3('body yopildi. Bu teglarning yopuvchi jufti bor.', 'body закрыт. У этих тегов есть закрывающая пара.', 'body is closed. These tags have a closing pair.'),
    okHead: L3('head ham yopildi!', 'head тоже закрыт!', 'head is closed too!'),
    ask: L3('Bo‘sh joyga body ning yopuvchi tegini yozing', 'Допиши закрывающий тег body в пустое место', 'Type the closing body tag in the empty place'),
    askHead: L3('Bo‘sh joyga head ning yopuvchi tegini yozing', 'Допиши закрывающий тег head в пустое место', 'Type the closing head tag in the empty place')
  },

  s11: {
    eyebrow: L3('O‘zgarishlar laboratoriyasi', 'Лаборатория изменений', 'Lab of changes'),
    say: L3('Bu yerda erkin tajriba qiling: title va body ni o‘zgartiring, oldingisi bilan solishtiring.', 'Здесь экспериментируй свободно: меняй title и body, сравнивай с тем, что было.', 'Experiment freely here: change title and body and compare with what was there.'),
    sawTitle: L3('Yorliq o‘zgardi — bu title.', 'Вкладка изменилась — это title.', 'The tab changed: that is title.'),
    sawBody: L3('Sahifa o‘zgardi — bu body.', 'Страница изменилась — это body.', 'The page changed: that is body.'),
    ideas: [
      { label: L3('Hayvon haqida', 'О животном', 'About an animal'), title: L3('Mening mushugim', 'Мой кот', 'My cat'), text: L3('Mening mushugim uxlashni yaxshi ko‘radi.', 'Мой кот любит спать.', 'My cat loves to sleep.') },
      { label: L3('Sevimli o‘yin', 'О любимой игре', 'A favourite game'), title: L3('Sevimli o‘yinim', 'Моя любимая игра', 'My favourite game'), text: L3('Men futbol o‘ynayman.', 'Я играю в футбол.', 'I play football.') },
      { label: L3('Do‘stga xat', 'Послание другу', 'A note to a friend'), title: L3('Do‘stimga', 'Другу', 'To my friend'), text: L3('Salom! Ertaga ko‘rishamiz.', 'Привет! Увидимся завтра.', 'Hi! See you tomorrow.') }
    ],
    note: L3('title — yorliqdagi nom (head ichida). body ichidagi matn — sahifada.', 'title — название на вкладке (внутри head). Текст внутри body — на странице.', 'title is the name on the tab (inside head). The text inside body is on the page.'),
    ask: L3('title va body ni o‘zgartirib ko‘ring', 'Попробуй изменить title и body', 'Try changing title and body')
  },

  s12: {
    eyebrow: L3('Siz uchun buyurtma', 'Заказ для тебя', 'An order for you'),
    say: L3('Mendan sahifani yangilashni so‘rashdi. Endi o‘zingiz bajaring.', 'Меня попросили обновить страницу. Теперь попробуй сам.', 'I was asked to update a page. Now try it yourself.'),
    tasks: [
      { id: 'title', goal: L3('Faqat yorliq nomini o‘zgartiring: «{t}»', 'Измени только название вкладки: «{t}»', 'Change only the tab name: “{t}”'), t: L3('Kosmos klubi', 'Клуб космоса', 'Space club'), tB: L3('Mening uy hayvonim', 'Мой питомец', 'My pet') },
      { id: 'text', goal: L3('Faqat sahifa matnini o‘zgartiring: «{t}»', 'Измени только текст страницы: «{t}»', 'Change only the page text: “{t}”'), t: L3('Juma kuni uchrashamiz!', 'Встреча в пятницу!', 'Meeting on Friday!'), tB: L3('Men chizishni yaxshi ko‘raman.', 'Я люблю рисовать.', 'I love drawing.') }
    ],
    tag: L3('Bu teg — u qism chegarasini belgilaydi. Teg emas, matn o‘zgaradi.', 'Это тег — он отмечает границу части. Меняем текст, а не тег.', 'That is a tag: it marks a border of a part. We change text, not the tag.'),
    wrongText: L3('Bu matn boshqa joyda ko‘rinadi. Vazifaga qarang.', 'Этот текст виден в другом месте. Посмотри на задание.', 'This text shows somewhere else. Look at the task.'),
    typeIt: L3('Endi shu yerga yozing', 'Теперь напиши сюда', 'Now type it here'),
    h1t: L3('Hujjatda yorliq nomi qayerda beriladi?', 'Где в документе задаётся название вкладки?', 'Where in the document is the tab name set?'),
    h2t: L3('Yorliq nomi — head ichidagi title mazmuni.', 'Название вкладки — это содержимое title внутри head.', 'The tab name is the content of title inside head.'),
    h3t: L3('<title> va </title> orasidagi matnni bosing.', 'Нажми на текст между <title> и </title>.', 'Tap the text between <title> and </title>.'),
    h1b: L3('Sahifada nima ko‘rinadi?', 'Что видно на самой странице?', 'What shows on the page itself?'),
    h2b: L3('Sahifa matni — body ichida.', 'Текст страницы находится внутри body.', 'The page text is inside body.'),
    h3b: L3('<body> va </body> orasidagi matnni bosing.', 'Нажми на текст между <body> и </body>.', 'Tap the text between <body> and </body>.'),
    ok: L3('Bajarildi, qolgani o‘zgarmadi.', 'Готово, остальное не изменилось.', 'Done, and the rest did not change.'),
    again: L3('Yaxshi. Endi shunga o‘xshash yangi misol.', 'Хорошо. Теперь похожий новый пример.', 'Good. Now a similar new example.'),
    done: L3('Ikkala buyurtma bajarildi.', 'Оба заказа выполнены.', 'Both orders are done.'),
    ask: L3('Kerakli matnni toping va o‘zgartiring', 'Найди нужный текст и измени его', 'Find the right text and change it')
  },

  s13: {
    eyebrow: L3('Sahifangizni yarating', 'Создай свою страницу', 'Create your page'),
    say: L3('Avval hujjatni qatorlardan yig‘ing. <!DOCTYPE html> allaqachon joyida.', 'Сначала собери документ из строк. <!DOCTYPE html> уже на месте.', 'First build the document from lines. <!DOCTYPE html> is already in place.'),
    rules: {
      html: L3('Butun hujjat html ichida: u birinchi ochiladi va oxirida yopiladi.', 'Весь документ — внутри html: он открывается первым и закрывается последним.', 'The whole document is inside html: it opens first and closes last.'),
      pair: L3('Yopuvchi teg o‘z ochuvchisidan keyin turadi.', 'Закрывающий тег стоит после своего открывающего.', 'A closing tag comes after its opening tag.'),
      order: L3('Avval head, keyin body.', 'Сначала head, потом body.', 'First head, then body.'),
      headClose: L3('head body boshlanishidan oldin yopiladi.', 'head закрывается до того, как начнётся body.', 'head closes before body starts.'),
      title: L3('title head ichida turadi.', 'title стоит внутри head.', 'title sits inside head.'),
      text: L3('Sahifa matni body ichida turadi.', 'Текст страницы стоит внутри body.', 'The page text sits inside body.')
    },
    fill: L3('Tuzilma to‘g‘ri! Endi nom va matnni yozing.', 'Структура верная! Теперь напиши название и текст.', 'The structure is right! Now write the name and the text.'),
    done: L3('Sahifangiz tayyor.', 'Твоя страница готова.', 'Your page is ready.'),
    h1: L3('Tashqi qism birinchi ochiladi.', 'Внешняя часть открывается первой.', 'The outer part opens first.'),
    h2: L3('html ichida: head (title bilan), keyin body (matn bilan).', 'Внутри html: head (с title), потом body (с текстом).', 'Inside html: head (with title), then body (with the text).'),
    h3: L3('Belgilangan qatorlarni almashtiring.', 'Поменяй местами отмеченные строки.', 'Swap the marked lines.'),
    ask: L3('Qatorlarni tartib bilan qo‘ying', 'Расставь строки по порядку', 'Put the lines in order'),
    askFill: L3('Nom va matnni yozing', 'Напиши название и текст', 'Write the name and the text')
  },

  s14: {
    eyebrow: L3('Buni siz yasadingiz', 'Это сделал ты', 'You made this'),
    say: L3('Sahifangizda nom va matn bor. Endi ular kodda qayerda ekanini bilasiz.', 'У твоей страницы есть название и текст. Теперь ты знаешь, где они находятся в коде.', 'Your page has a name and text. Now you know where they are in the code.'),
    ach: {
      place: { self: L3('Kerakli joyni o‘zingiz topdingiz', 'Сам нашёл место изменения', 'Found the place to change on your own'), help: L3('Kerakli joyni maslahat bilan topdingiz', 'Нашёл место изменения с подсказкой', 'Found the place to change with a hint') },
      build: { self: L3('Tuzilmani yig‘dingiz', 'Собрал структуру', 'Built the structure'), help: L3('Tuzilmani maslahat bilan yig‘dingiz', 'Собрал структуру с подсказкой', 'Built the structure with a hint') },
      close: { self: L3('Yopuvchi tegni yozdingiz', 'Написал закрывающий тег', 'Wrote a closing tag'), help: L3('Yopuvchi tegni maslahat bilan yozdingiz', 'Написал закрывающий тег с подсказкой', 'Wrote a closing tag with a hint') },
      page: { self: L3('O‘z sahifangizni yaratdingiz', 'Создал свою страницу', 'Created your own page'), help: L3('O‘z sahifangizni yaratdingiz', 'Создал свою страницу', 'Created your own page') }
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
// 1. ДВЕ НАДПИСИ — ОДНА СТРАНИЦА
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const [title, setTitle] = useState(rec ? rec.title : pick(SAMPLE.title));
  const [text, setText] = useState(rec ? rec.text : pick(SAMPLE.text));
  const [mode, setMode] = useState(null);           // 'title' | 'text'
  const [shown, setShown] = useState(null);         // строка кода, показанная после изменения
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const changed = !!rec;
  const [speaker, , spoken, sayNow] = useVoice([{ text: changed ? c.done : c.say, pose: changed ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(changed, spoken);
  const led = useIdleLed(canTap && !changed, mode ? 1 : 0);
  useEffect(() => {
    if (!shown) return undefined;
    const t = setTimeout(() => setShown(null), 4500);
    return () => clearTimeout(t);
  }, [shown && shown.n]); // eslint-disable-line react-hooks/exhaustive-deps
  const apply = (v) => {
    if (!canTap) return;
    sfx('pop', true);
    const nt = mode === 'title' ? v : title, nx = mode === 'text' ? v : text;
    setTitle(nt); setText(nx);
    setFlash((f) => (mode === 'title' ? { tab: f.tab + 1, page: f.page } : { tab: f.tab, page: f.page + 1 }));
    setShown({ k: mode, n: Date.now() });
    if (!changed) { put({ title: nt, text: nx }); sayNow(c.done, 'cheer'); } else put({ title: nt, text: nx });
  };
  const opts = mode === 'title' ? c.titles : mode === 'text' ? c.texts : [];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={mode ? c.askPick : c.ask} nav={navOf(p, canGo)}>
      <Ask text={changed && !mode ? c.askDone : mode ? c.askPick : c.ask} />
      <div className="s1-stage">
        <MiniBrowser title={title} page={text} flashTab={flash.tab} flashPage={flash.page} />
        <div className={'s1-code' + (shown ? ' is-on' : '')} aria-live="polite" translate="no">
          {shown ? (shown.k === 'title'
            ? <span className="mono"><Tag tag="title" /><span className="tk-text">{title}</span><Tag tag="title" close /></span>
            : <span className="mono"><Tag tag="body" /><span className="tk-text">{text}</span><Tag tag="body" close /></span>) : null}
        </div>
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
// 2. ЧТО СПРЯТАНО ВОКРУГ ТЕКСТА? — части тега, затем подписи.
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
  const store = useStore();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'done' : 'explore');   // explore → label → (follow) → done
  const [seen, setSeen] = useState([]);
  const [cur, setCur] = useState(null);
  const [label, setLabel] = useState(null);
  const [found, setFound] = useState({});
  const [msg, setMsg] = useState(null);
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
    const next = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(next);
    sayNow(c.parts[k], 'point');
    if (next.length === 3) setTimeout(() => { setPhase('label'); setCur(null); sayNow(c.phase2, 'explain'); }, 1800);
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
  const line = phase === 'explore' ? { tag: 'body', text: pick(L3('Salom!', 'Привет!', 'Hi!')) }
    : phase === 'follow' ? { tag: 'title', text: pick(L3('Mening saytim', 'Мой сайт', 'My site')) }
      : { tag: 'body', text: pick(L3('Men HTML o‘rganyapman', 'Я учу HTML', 'I am learning HTML')) };
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
            <span className="s2-res-l">{pick(UI.page)}</span>
            <span className="s2-res-t">{line.text}</span>
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
// 3. ОТКРОЙ ДОКУМЕНТ — первая сцена Anatomy: раскрытие вложенности.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [open, setOpen] = useState(() => (solved ? { html: true, head: true, body: false } : { html: false, head: false, body: false }));
  const [sel, setSel] = useState(solved ? 'title' : null);
  const [lidGone, setLidGone] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.title : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const taps = useRef(0);
  const led = useIdleLed(canTap && !solved, (open.html ? 1 : 0) + (open.head ? 2 : 0));
  useEffect(() => {
    if (open.html) { const t = setTimeout(() => setLidGone(true), reduceMotion() ? 0 : 450); return () => clearTimeout(t); }
    setLidGone(false); return undefined;
  }, [open.html]);
  const act = (k) => {
    if (!canTap || !k) return;
    taps.current += 1;
    setMsg(null);
    if (k === 'doctype') { setSel('doctype'); sayNow(c.doctype, 'explain'); return; }
    if (k === 'html') {
      if (!open.html) { sfx('pop', true); setOpen({ html: true, head: false, body: false }); setSel('html'); sayNow(c.html, 'wonder'); }
      else { setSel('html'); sayNow(c.html, 'explain'); }
      return;
    }
    if (!open.html) { act('html'); return; }
    if (k === 'close-html') { sfx('tap', true); setOpen({ html: false, head: false, body: false }); setSel(null); return; }
    if (k === 'head' || k === 'body') {
      const now = !open[k];
      sfx('tap', true);
      setOpen((o) => Object.assign({}, o, { [k]: now }));
      setSel(now ? k : null);
      if (now) sayNow(c[k], 'explain');
      return;
    }
    if (k === 'title') {
      if (!open.head) { setMsg(c.needHead); sayNow(c.needHead, 'think'); return; }
      sfx('ok', true);
      setSel('title');
      if (!solved) {
        put({ done: true });
        log({ screenId: 's3', type: 'explore-nesting', correct: true, attempts: taps.current });
      }
      sayNow(c.title, 'cheer');
    }
  };
  const hitMap = { lid: 'html', html: 'html', head: 'head', body: 'body', title: 'title', page: 'body', doctype: 'doctype' };
  const order = ['doctype'].concat(open.html
    ? ['html-o'].concat(open.head ? ['head-o', 'title', 'head-c'] : ['head-fold']).concat(open.body ? ['body-o', 'text', 'body-c'] : ['body-fold']).concat(['html-c'])
    : ['html-fold']);
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const lit = sel === 'html' ? ['html', 'html-close'] : sel === 'head' ? ['head', 'head-close'] : sel === 'body' ? ['body', 'body-close', 'page'] : sel === 'title' ? ['title'] : sel === 'doctype' ? ['doctype'] : [];
  const ledKeys = !led ? [] : !open.html ? ['lid'] : !open.head ? ['head'] : ['title'];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.askDone : c.ask} hint={msg} />
      <div className="ex">
        <Fig texts={docTexts(t, x)} onPick={(h) => act(hitMap[h])} label={c.ask}
          parts={{ slots: 'off', 'title-stray': 'off', lid: lidGone ? 'off' : 'on', 'head-cover': open.head ? 'off' : 'on', 'body-cover': open.body ? 'off' : 'on',
            'title-card': open.head ? 'on' : 'off', 'page-card': open.body ? 'on' : 'off' }}
          move={{ lid: open.html ? LID_UP() : 0, 'head-cover': open.head ? COVER_UP() : 0, 'body-cover': open.body ? COVER_UP() : 0,
            'title-card': open.head ? (sel === 'title' ? 6 : 0) : DROP(), 'page-card': open.body ? 0 : DROP() }}
          lit={lit} led={ledKeys} />
        <div className="ex-side">
          <MiniBrowser title={t} page={x} compact hl={sel === 'title' ? 'title' : sel === 'body' ? 'body' : null} />
          <CodeLines lines={docLines(order, { title: t, text: x })} hl={sel && sel !== 'doctype' ? sel : null} className="cv-ex"
            lineProps={(ln) => (ln.id === 'doctype' ? { cls: sel === 'doctype' ? 'is-doc' : 'is-doc-dim' } : null)} />
        </div>
      </div>
      <div className="chips" translate="no">
        <button type="button" className="chip mono chip-doc" disabled={!canTap} onClick={() => act('doctype')} style={{ '--c': T.ink2 }}>!DOCTYPE</button>
        {['html', 'head', 'title', 'body'].map((k) => (
          <button key={k} type="button" disabled={!canTap || (k !== 'html' && !open.html) || (k === 'title' && !open.head)} style={{ '--c': TAGC[k] }}
            className={'chip mono' + (sel === k ? ' is-sel' : '') + ((k === 'html' ? open.html : open[k]) ? ' is-open' : '')}
            aria-pressed={k === 'title' ? sel === 'title' : !!(k === 'html' ? open.html : open[k])}
            onClick={() => act(k === 'html' && open.html && sel === 'html' ? 'close-html' : k)}>
            {k}
          </button>
        ))}
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
              <span className={'where-ic where-' + w} aria-hidden="true" />{pick(w === 'tab' ? UI.tab : UI.page)}
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
  const hint = hintOf(lad.lv, [L3('Qaysi bo‘lim sahifa haqida, qaysi biri sahifada ko‘rinadi?', 'Какое отделение — о странице, а какое видно на странице?', 'Which section is about the page, and which shows on the page?'),
    L3('head va body — html ichida (avval head). title — head ichida.', 'head и body — внутри html (сначала head). title — внутри head.', 'head and body go inside html (head first). title goes inside head.'),
    L3('Hozir: {p}', 'Сейчас: {p}', 'Now: {p}')]);
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
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? c.askDone : (hintOf(Math.min(3, lad.lv + 1), [L3('Qaysi bo‘lim sahifa haqida?', 'Какое отделение — о странице?', 'Which section is about the page?')]) || c.ask)} nav={navOf(p, canGo)}>
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
    if (w === '<' + tag + '/>' || w === '/' + tag + '>' || w === '<\\' + tag + '>' || w === '<' + tag + '>/') return { m: c.noSlash };
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
// 11. ЛАБОРАТОРИЯ ИЗМЕНЕНИЙ — свободный эксперимент, «До / Сейчас».
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s11;
  const mine = useMine();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const base = useRef({ title: mine.title, text: mine.text });
  const lab = store.get('lab');
  const [title, setTitle] = useState(lab ? lab.title : mine.title);
  const [text, setText] = useState(lab ? lab.text : mine.text);
  const [before, setBefore] = useState(false);
  const [notes, setNotes] = useState(true);
  const [speaker, , spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const canGo = useAdvanceGate(solved || true, spoken);
  const said = useRef({ t: !!solved, b: !!solved });
  useEffect(() => {
    const t = setTimeout(() => {
      if (okText(title) && !same(title, base.current.title) && !said.current.t) { said.current.t = true; sayNow(c.sawTitle, 'point'); }
      if (okText(text) && !same(text, base.current.text) && !said.current.b) { said.current.b = true; sayNow(c.sawBody, 'point'); }
      if (okText(title) && okText(text)) store.set('lab', { title: title.trim(), text: text.trim() });
      if (said.current.t && said.current.b && !solved) put({ done: true });
    }, 1300);
    return () => clearTimeout(t);
  }, [title, text]); // eslint-disable-line react-hooks/exhaustive-deps
  const shownT = before ? base.current.title : (okText(title) ? title : '');
  const shownB = before ? base.current.text : (okText(text) ? text : '');
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <div className="lab-top">
        <div className="seg-row" role="tablist">
          {[false, true].map((b) => (
            <button key={String(b)} type="button" role="tab" aria-selected={before === b} className={'seg' + (before === b ? ' is-on' : '')} onClick={() => setBefore(b)}>{pick(b ? UI.before : UI.now)}</button>
          ))}
        </div>
        <button type="button" className="link-b" onClick={() => setNotes(!notes)} aria-expanded={notes}>{pick(UI.notes)}: {pick(notes ? UI.hide : UI.show)}</button>
      </div>
      <div className="work pr">
        <div className={'lab-b' + (before ? ' is-before' : '')}>
          <MiniBrowser title={shownT} page={shownB} />
          {before ? <span className="before-tag">{pick(UI.before)}</span> : null}
        </div>
        <div className="lab-c">
          <MiniDoc title={title} text={text}
            editTitle={<InlineInput value={title} onChange={setTitle} label={C.s4.ask} max={40} placeholder={SAMPLE.title} />}
            editText={<InlineInput value={text} onChange={setText} label={C.s5.ask} max={70} placeholder={SAMPLE.text} />} />
          {notes ? <p className="lab-note">{pick(c.note)}</p> : null}
        </div>
      </div>
      <div className="lab-acts">
        <span className="lab-ideas-l">{pick(UI.ideas)}:</span>
        {c.ideas.map((id, i) => (
          <button key={i} type="button" className="opt-chip sm" onClick={() => { setTitle(pick(id.title)); setText(pick(id.text)); setBefore(false); }}>{pick(id.label)}</button>
        ))}
        <button type="button" className="btn-ghost lab-reset" onClick={() => { setTitle(base.current.title); setText(base.current.text); setBefore(false); }}><Icon name="undo" size={15} />{pick(UI.reset)}</button>
      </div>
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
// 14. ЭТО СДЕЛАЛ ТЫ — работа ученика, код, схема, подтверждённые достижения.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s14;
  const mine = useMine();
  const ach = store.get('ach') || {};
  const [view, setView] = useState('page');
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'bye' }]);
  const canGo = useAdvanceGate(true, spoken);
  const list = ['place', 'build', 'close', 'page'].filter((k) => ach[k]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <div className="fin-head"><span className="fin-author">{pick(UI.author)}: <b>{p.name}</b></span></div>
      <div className="seg-row only-phone" role="tablist">
        {['page', 'code'].map((v) => (
          <button key={v} type="button" role="tab" aria-selected={view === v} className={'seg' + (view === v ? ' is-on' : '')} onClick={() => setView(v)}>{pick(v === 'page' ? UI.page : UI.code)}</button>
        ))}
      </div>
      <div className={'fin fin-' + view}>
        <div className="fin-b"><MiniBrowser title={mine.title} page={mine.text} /></div>
        <div className="fin-c"><CodeLines lines={buildLines(FULL_DOC, mine)} className="cv-pr" /></div>
        <div className="fin-s"><Fig texts={docTexts(mine.title, mine.text)} parts={Object.assign({}, ALL_OPEN, { doctype: 'on' })} move={{ lid: LID_UP() }} lit={['title', 'page']} cls="fig-mini" label={UI.scheme} /></div>
      </div>
      <div className="fin-tree only-phone" aria-label={pick(UI.scheme)}><Tree order={FULL_DOC} disabled /></div>
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
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'CHECK-1', Comp: S6 },
  { id: 's7', code: 'LEVEL-3', Comp: S7 }, { id: 's8', code: 'LEVEL-4', Comp: S8 }, { id: 's9', code: 'CHECK-2', Comp: S9 },
  { id: 's10', code: 'CHECK-3', Comp: S10 }, { id: 's11', code: 'LEVEL-5', Comp: S11 }, { id: 's12', code: 'CHECK-4', Comp: S12 },
  { id: 's13', code: 'RESULT', Comp: S13 }, { id: 's14', code: 'ACHIEVEMENT', Comp: S14 }
];
// «Повторить» стирает только экран; тексты ученика (myTitle, myText, lab,
// artifact) и достижения (ach) сохраняются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'], s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'] };

export default function HtmlPervayaStranitsa({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
