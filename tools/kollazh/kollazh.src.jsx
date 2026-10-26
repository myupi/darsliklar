// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 1 — «Структура HTML-документа»
// («Бумажная страница», ЭТАЛОН КУРСА с 22.10.2026). Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/kollazh/kollazh.src.jsx lessons/html/01-struktura-dokumenta.jsx
// (звук бумаги: node tools/kollazh/paper-data.mjs → kollazh-paper-data.jsx, потом сборка).
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 · «Бумажная страница» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ. Стилистика ролика html.mp4 (заказчик, 20.10.2026): бумажный коллаж —
// вырезки из цветной бумаги с рваным краем и фактурой, мягкая тень слой на слой,
// движение вырезками по столу со ступенчатостью stop-motion, шорох бумаги, переход
// между экранами «разбор и сборка». На листе живёт бумажный человечек: голова —
// как часть head, тело — как часть body. Образ — только опора: каждый раз за ним
// Коди называет настоящую связь кода с браузером. В конце ученик собирает свою страницу.
//
// ДУГА (17 экранов; заказчик, 26.10.2026: без экрана плана; rd «как читают код» —
// сразу после крючка; отдельного «что такое тег» нет — оно на s3, «вкладка или окно» — после body; реплики —
// docs/urok-01-repliki-redaktura.md). s1 крючок с короткой целью · тройки
// «объяснение → сам делаешь → закрепление»: тег, открывающий и закрывающий на
// рамке html (s3–s5), head и title (s6–s7), body (s9–s10) и закрепление обеих
// частей (s8, s11), весь документ (s12–s14) · итоговая проверка q1 (вкладка/окно),
// q2 (зачем </title>) · s15 вывод. Полное описание — docs/urok-01-opisanie.md; правила
// эталона для следующих уроков — навык novyy-urok, references/etalon-bumazhnaya.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь
//     (длинную фразу делим на реплики, чтобы подсветка совпадала со словами).
//   · Конфетти только в финале: похвалы экранов — поза smile.
//   · Честный браузер: пустой title — вкладка index.html; без </title> всё,
//     что дальше, уходит во вкладку.
//
// СИСТЕМА СЛОВ. Тег — слово в угловых скобках: браузер его не показывает, а
// читает (в уроке теги парные: открывающий и закрывающий; DOCTYPE — особая первая
// строка без пары); html — объединяет все части страницы (рамка на рисунке —
// только наглядность, она обнимает весь браузер вместе с вкладкой);
// head — сведения о странице; title внутри head — название страницы на вкладке;
// body — то, что видно в окне. UZ: teg, yorliq — только вкладка, oyna — окно,
// sahifa nomi — название. Вкладку Коди показывает на s1, окно — на s6, оба раза —
// пока это место подсвечено. Голова человечка — образ head (сведения о странице),
// а не название: название — в title внутри head.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-01-struktura-dokumenta',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '1-dars. HTML hujjatining tuzilishi',
    ru: 'Урок 1. Структура HTML-документа',
    en: 'Lesson 1. HTML document structure'
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
  next: L3('Katta sarlavha va xatboshilar qo‘shamiz', 'Добавим большой заголовок и абзацы', 'Adding a big heading and paragraphs'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  pic: L3('rasm', 'картинка', 'picture'),
  pageText: L3('sahifa matni', 'текст страницы', 'page text'),
  slot: L3('joy', 'место', 'place'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  swap: L3('Ikki qatorni bosing — ular joy almashadi.', 'Нажми две полоски — они поменяются местами.', 'Tap two strips: they swap places.'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения. Звучат: say, top, bottom,
// done, ok, msgs, hints …; печатаются: eyebrow, ask, cards.title, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Qog‘oz sahifa', 'Бумажная страница', 'A paper page'),
    // До превращения Коди показывает только вкладку (окно — на s6, когда его видно) и задаёт вопрос хука.
    say: L3('Salom! Men Kodi. Qarang, mana bu veb-sahifa.',
      'Привет! Я Коди. Смотри, вот веб-страница.',
      'Hi! I’m Kodi. Look, here’s a web page.'),
    sayTab: L3('Tepadagi kichkina joyni ko‘ryapsizmi? Bu brauzer yorlig‘i, unda sahifa nomi yozilgan.',
      'Видишь маленькое место сверху? Это вкладка браузера, на ней написано название страницы.',
      'See the little spot at the top? That’s the browser tab. It shows the page name.'),
    sayGo: L3('Agar veb-sahifa odam bo‘lsa, nima deb o‘ylaysiz, u qanday ko‘rinardi? Keling, shuni ko‘ramiz. «Aylantirish» tugmasini bosing.',
      'А если бы веб-страница была человеком, как думаешь, какой бы она была? Давай проверим! Нажми «Превратить».',
      'If a web page were a person, what do you think it would look like? Let’s find out! Tap “Transform”.'),
    // После сборки: голова — сведения о странице (название — лишь одно из них), тело — то, что видно.
    magic: L3('Voy, qarang! Sahifa jonlanib, odamchaga aylandi!',
      'Ого, смотри! Страница ожила и стала человечком!',
      'Whoa, look! The page came alive as a paper buddy!'),
    magicHead: L3('Sezdingizmi? Sahifa nomi uning boshiga kirib ketdi. Boshda sahifa haqidagi ma’lumotlar saqlanadi.',
      'Смотри-ка! Название страницы спряталось у него в голове. В голове хранятся сведения о странице.',
      'Did you notice? The page name went into its head. The head keeps information about the page.'),
    magicWin: L3('Tanasi-chi? U sahifada ko‘rinadigan narsalardan yig‘ildi: matn, rasm va tugmadan.',
      'А тело? Оно собралось из того, что видно на странице: текста, картинки и кнопки.',
      'And the body? It’s made of what you see on the page: text, a picture and a button.'),
    // Короткая цель вместо экрана плана (заказчик, 26.10.2026).
    done: L3('Bugun shunday sahifani kod bilan o‘zingiz yig‘asiz! Keling, avval kod qanday ko‘rinishini ko‘ramiz.',
      'Сегодня ты соберёшь такую страницу кодом! Сначала посмотрим, как выглядит код.',
      'Today you’ll build a page like this with code! First, let’s see what code looks like.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askLook: L3('Qarang: brauzer yorlig‘i', 'Смотри: вкладка браузера', 'Look: the browser tab'),
    askDone: L3('Boshda — sahifa haqida ma’lumot, tanada — ko‘rinadigan narsalar',
      'В голове — сведения о странице, в теле — то, что видно',
      'The head keeps page info, the body is what you see')
  },
  // «Как читают код?» (заказчик, 26.10.2026): копия «Сверху вниз» в начале урока — весь код
  // и браузер, который сам его читает; что значит каждый тег, не говорим. Главное — код
  // читают слева направо и сверху вниз (показывают стрелки и маркер по строке).
  rd: {
    eyebrow: L3('Kod qanday o‘qiladi?', 'Как читают код?', 'How is code read?'),
    say: L3('Mana bu kod! Brauzer sahifani aynan shundan yig‘adi. Qanday o‘qishini kuzating!',
      'Вот это код! Из него браузер и собирает страницу. Смотри, как он его читает!',
      'This is code! The browser builds the page from it. Watch how it reads it!'),
    read1: L3('Sezdingizmi? Brauzer kodni xuddi kitobdek o‘qiydi.',
      'Смотри-ка: браузер читает код, как книжку.',
      'Did you notice? The browser reads code like a book.'),
    read2: L3('Har bir qatorni chapdan o‘ngga o‘qiydi.',
      'Каждую строчку — слева направо.',
      'Each line from left to right.'),
    read3: L3('Qatorlarni esa yuqoridan pastga, birin-ketin.',
      'А строчки — сверху вниз, одну за другой.',
      'And the lines from top to bottom, one after another.'),
    done: L3('Qator-qator o‘qidi, mana sahifa tayyor! Endi bu kodni birga tushunib olamiz.',
      'Строчка за строчкой — и страница готова! Дальше разберёмся с этим кодом вместе.',
      'Line by line, and the page is ready! Next, let’s figure out this code together.'),
    ask: L3('Brauzer kodni qanday o‘qishini kuzating', 'Смотри, как браузер читает код', 'Watch how the browser reads code'),
    askDone: L3('Chapdan o‘ngga, yuqoridan pastga', 'Слева направо, сверху вниз', 'Left to right, top to bottom')
  },
  // «Тег html» (заказчик, 26.10.2026: отдельный экран «что такое тег» убран — здесь же
  // объясняем, что такое тег, открывающий и закрывающий; о чём говорим — в «прожекторе»).
  s3: {
    eyebrow: L3('Teg nima?', 'Что такое тег?', 'What is a tag?'),
    say: L3('Ramkaga qarang: unda ikkita qiziq yozuv bor. Ular nima ekan?',
      'Посмотри на рамку: на ней две интересные надписи. Что же это такое?',
      'Look at the frame: there are two interesting labels on it. What are they?'),
    sayTag: L3('Bu teg! Burchakli qavsdagi so‘z teg deyiladi. Brauzer tegni sahifada ko‘rsatmaydi, uni o‘qib oladi.',
      'Это тег! Слово в угловых скобках называется тег. Браузер не показывает тег на странице, а читает его.',
      'It’s a tag! A word in angle brackets is called a tag. The browser doesn’t show a tag on the page, it reads it.'),
    top: L3('Tepadagisi ochuvchi html tegi. U brauzerga: «Sahifa shu yerdan boshlanadi», deydi.',
      'Верхний — открывающий тег html. Он говорит браузеру: «Здесь страница начинается».',
      'The top one is the opening html tag. It tells the browser: “The page starts here.”'),
    bottom: L3('Pastdagisida qiya chiziq bor, ko‘ryapsizmi? Bu yopuvchi html tegi. U: «Sahifa shu yerda tugaydi», deydi.',
      'А на нижнем видишь косую черту? Это закрывающий тег html. Он говорит: «Здесь страница заканчивается».',
      'See the slash on the bottom one? It’s the closing html tag. It says: “The page ends here.”'),
    pair: L3('Ochuvchi va yopuvchi teg juftlik bo‘lib keladi. Butun sahifa ularning o‘rtasida, xuddi buterbrod ichidagi narsadek!',
      'Открывающий и закрывающий теги — пара. А вся страница между ними, как начинка в бутерброде!',
      'Opening and closing tags are a pair. The whole page sits between them, like the filling in a sandwich!'),
    done: L3('Bir sir aytaymi? Ramkani biz tushunarli bo‘lsin deb chizdik. Brauzerda uni ko‘rmaysiz.',
      'Маленький секрет: рамку мы нарисовали для наглядности. В браузере её не увидишь.',
      'A little secret: we drew the frame to make it clear. You won’t see it in a browser.'),
    ask: L3('Ramkadagi teglarga qarang', 'Смотри на теги рамки', 'Watch the tags on the frame'),
    askDone: L3('Ochuvchi teg boshlaydi, qiya chiziqli yopuvchi teg tugatadi',
      'Открывающий тег начинает, закрывающий (с косой чертой) заканчивает',
      'The opening tag starts, the closing one (with a slash) ends')
  },
  s4: {
    eyebrow: L3('Ramkani yoping', 'Закрой рамку', 'Close the frame'),
    say: L3('Qarang, ramkaning pastki cheti yo‘q! Kodda yopuvchi html tegi yetishmayapti. Uni bo‘sh qatorga yozing va «Tekshirish»ni bosing.',
      'Смотри: у рамки пропал нижний край! В коде не хватает закрывающего тега html. Напиши его в пустой строке и нажми «Проверить».',
      'Look: the frame’s bottom edge is gone! The closing html tag is missing from the code. Type it in the empty line and tap “Check”.'),
    msgs: {
      needSlash: L3('Deyarli! Bu ochuvchi teg. Yopuvchi tegda html so‘zidan oldin qiya chiziq turadi.',
      'Почти! Это открывающий тег. В закрывающем перед словом html стоит косая черта.',
      'Almost! That’s the opening tag. The closing tag has a slash before html.'),
      needLt: L3('Bir narsa yetishmayapti: teg chap burchakli qavs «<» bilan boshlanadi. Uni boshiga qo‘shing.',
      'Чего-то не хватает: тег начинается с угловой скобки «<». Добавь её в начало.',
      'Something is missing: a tag starts with the angle bracket “<”. Add it at the start.'),
      needGt: L3('Oxirida nimadir yetishmayapti: teg o‘ng burchakli qavs «>» bilan tugaydi. Uni oxiriga qo‘shing.',
      'В конце чего-то не хватает: тег заканчивается угловой скобкой «>». Добавь её в конец.',
      'Something is missing at the end: a tag ends with the angle bracket “>”. Add it at the end.'),
      wrongName: L3('Teg ichidagi so‘zga qarang: bu yerda html kerak.',
      'Посмотри на слово внутри тега: здесь нужен html.',
      'Check the word inside the tag: here you need html.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.',
      'Косая черта «/» стоит сразу после первой угловой скобки.',
      'The slash “/” goes right after the first angle bracket.')
    },
    hints: [L3('Ramkaning tepasidagi tegga qarang.', 'Посмотри на верхний тег на рамке.', 'Look at the top tag on the frame.'),
      L3('Yopuvchi teg o‘sha so‘z, faqat qiya chiziq bilan.', 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3('Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin html va oxirida yana burchakli qavs.',
      'Начни с угловой скобки, потом поставь косую черту. Дальше html и в конце снова угловая скобка.',
      'Start with the angle bracket, then add the slash. Then html, and another angle bracket at the end.')],
    ok: L3('Zo‘r, ramka yopildi! Endi butun sahifa ikki html tegi orasida.',
      'Есть! Рамка закрылась: вся страница теперь между двумя тегами html.',
      'Yes! The frame is closed: the whole page is between the two html tags now.'),
    ask: L3('Bo‘sh qatorga yopuvchi html tegini yozing va «Tekshirish»ni bosing', 'Напиши закрывающий тег html в пустой строке и нажми «Проверить»', 'Type the closing html tag in the empty line and tap “Check”')
  },
  s5: {
    eyebrow: L3('Teglarni joyiga qo‘ying', 'Теги по местам', 'Tags in place'),
    say: L3('Endi navbat sizda! Ramkaga ikkita teg kerak: tepaga va pastga. Ehtiyot bo‘ling, pastdagi uchta tegdan bittasi ortiqcha.',
      'Теперь твоя очередь! Рамке нужны два тега: сверху и снизу. Осторожно, один из трёх тегов внизу лишний.',
      'Your turn! The frame needs two tags: top and bottom. Careful, one of the three tags below is extra.'),
    // Как переносить — словами, пока рука показывает (рука — после этой реплики).
    sayHow: L3('Tegni barmoq bilan ushlab, joyiga olib boring. Yoki oddiygina: avval tegni, keyin joyni bosing.',
      'Хватай тег пальцем и неси на место. Или проще: нажми тег, а потом место.',
      'Grab a tag with your finger and carry it into place. Or simply tap the tag, then the place.'),
    top: L3('Deyarli! Tepada sahifa boshlanadi, bu yerga qiya chiziqsiz ochuvchi teg kerak.',
      'Почти! Сверху страница начинается, здесь нужен открывающий тег, без косой черты.',
      'Almost! The page starts at the top, so it needs the opening tag, without a slash.'),
    bottom: L3('Hechqisi yo‘q! Pastda sahifa tugaydi, bu yerga qiya chiziqli yopuvchi teg kerak.',
      'Ничего! Снизу страница заканчивается, здесь нужен закрывающий тег, с косой чертой.',
      'No worries! The page ends at the bottom, so it needs the closing tag, with a slash.'),
    back: L3('Mana ayyorlik qayerda! Bu chiziq teskari tomonga egilgan. Yopuvchi tegda u o‘ngga egilgan: «/».',
      'А вот и хитрость! Эта черта наклонена не в ту сторону. В закрывающем теге она наклонена вправо: «/».',
      'Here’s the trick! This slash leans the wrong way. In a closing tag it leans right: “/”.'),
    pickFirst: L3('Avval tegni tanlang.', 'Сначала выбери тег.', 'Pick a tag first.'),
    hints: [L3('Qaysi teg sahifani boshlaydi, qaysi biri tugatadi?', 'Какой тег начинает страницу, а какой заканчивает?', 'Which tag starts the page, and which one ends it?'),
      L3('Tepaga qiya chiziqsiz teg, pastga qiya chiziqli teg qo‘yiladi.',
      'Сверху — тег без косой черты. Снизу — тег с косой чертой.',
      'Top: the tag without a slash. Bottom: the tag with a slash.'),
      L3('<html> tegini tepadagi joyga torting.', 'Перетащи <html> на верхнее место.', 'Drag <html> to the top place.')],
    ok: L3('Ajoyib, ikkala teg joyida! Teskari chiziqli teg esa ortiqcha edi.',
      'Отлично, оба тега на месте! А тег с обратной чертой был лишним.',
      'Great, both tags are in place! The one with the backslash was extra.'),
    ask: L3('Tegni joyiga torting', 'Перетащи тег на место', 'Drag a tag into place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  s6: {
    eyebrow: L3('head va title', 'head и title', 'head and title'),
    // Короткими шагами, у каждого — своя подсветка: голова → окно → title → вкладка.
    // Окно браузера впервые названо здесь, на sayInfo, — пока оно подсвечено.
    say: L3('html ichida ikkita qism yashaydi. Birinchisi head. Odamchaning boshi aynan shu qismni eslatadi.',
      'Внутри html живут две части. Первая — head. Голова человечка как раз про неё.',
      'Two parts live inside html. The first is head. The buddy’s head stands for it.'),
    sayInfo: L3('head ichida sahifa haqidagi ma’lumotlar bor. Pastdagi katta joyga, brauzer oynasiga qarang: ular u yerda ko‘rinmaydi.',
      'В head — сведения о странице. Посмотри на большое место внизу, на окно браузера: там их не видно.',
      'head holds information about the page. Look at the big area below, the browser window: you can’t see it there.'),
    opened: L3('Ichida nima bor ekan? Mana, sahifa nomi! U title tegi ichiga yoziladi.',
      'А что внутри? Вот, название страницы! Его пишут внутри тега title.',
      'What’s inside? Here, the page name! It’s written inside the title tag.'),
    flew: L3('Nom yorliqqa uchib o‘tdi! Brauzer title ichidagi nomni aynan shu yerda ko‘rsatadi.',
      'Название перелетело на вкладку! Браузер показывает текст из title именно там.',
      'The name flew to the tab! The browser shows the text from title right there.'),
    done: L3('Demak, eslab qoling: title head ichida turadi, undagi nom esa yorliqda chiqadi.',
      'Запомним: title живёт внутри head, а название из него видно на вкладке.',
      'Let’s remember: title lives inside head, and its name shows on the tab.'),
    ask: L3('Qarang: odamchaning boshi', 'Смотри: голова человечка', 'Watch: the buddy’s head'),
    askCard: L3('Qarang: title tegi', 'Смотри: тег title', 'Watch: the title tag')
  },
  s7: {
    eyebrow: L3('Yorliqdagi nom', 'Название на вкладке', 'The name on the tab'),
    say: L3('Endi eng qiziq joyi: sahifangizga o‘zingiz nom bering! title ichiga yozing, masalan, «Futbol». Nom darhol yorliqda paydo bo‘ladi. Keyin «Tayyor»ni bosing.',
      'А теперь самое интересное: придумай своей странице название! Напиши его внутри title, например «Футбол». Оно сразу появится на вкладке. Потом нажми «Готово».',
      'Now the fun part: name your page! Type it inside title, for example “Football”. It shows up on the tab right away. Then tap “Done”.'),
    ok: L3('Zo‘r! Endi yorliqda sizning nomingiz turibdi.',
      'Класс! Теперь на вкладке твоё название.',
      'Cool! Now your name is on the tab.'),
    hints: [L3('Nom qaysi teg ichiga yoziladi? Kodga qarang.', 'В каком теге пишут название? Посмотри на код.', 'Which tag holds the name? Look at the code.'),
      L3('Nom ikki title tegi orasiga yoziladi.', 'Название пишут между двумя тегами title.', 'The name goes between the two title tags.'),
      L3('Ikki title tegi orasidagi bo‘sh joyni bosing, nom yozing va «Tayyor»ni bosing.',
      'Нажми пустое место между тегами title, напиши название и нажми «Готово».',
      'Tap the empty spot between the title tags, type a name and tap “Done”.')],
    ask: L3('title ichiga nom yozing va «Tayyor»ni bosing', 'Напиши название в title и нажми «Готово»', 'Type a name in title and tap “Done”')
  },
  // Вкладка или окно (заказчик, 26.10.2026: после body) — по строке кода предсказать: title — вкладка, body — окно.
  s8: {
    eyebrow: L3('Yorliqmi yoki oyna?', 'Вкладка или окно?', 'Tab or window?'),
    say: L3('Endi bir o‘yin: siz brauzersiz! Kod qatoriga qarang va so‘z qayerda chiqishini toping: yorliqdami yoki oynadami?',
      'А теперь игра: ты — браузер! Посмотри на строку кода и реши, где появится слово: на вкладке или в окне?',
      'Now a game: you’re the browser! Look at the line of code and decide where the word will show: on the tab or in the window?'),
    rounds: [
      { kind: 'title', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'tab' },
      { kind: 'body', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'win' },
      { kind: 'title', word: L3('Final juma kuni!', 'Финал в пятницу!', 'The final is on Friday!'), extra: L3('Bugun konsert!', 'Сегодня концерт!', 'Concert today!'), want: 'tab' }
    ],
    ok: {
      title: L3('To‘g‘ri! title dagi so‘z yorliqqa chiqdi.',
      'Верно! Слово из title — на вкладке.',
      'Right! The word from title is on the tab.'),
      body: L3('Topdingiz! body dagi so‘z oynaga chiqdi.',
      'В точку! Слово из body — в окне.',
      'Spot on! The word from body is in the window.')
    },
    miss: {
      title: L3('Hechqisi yo‘q! So‘z title ichida, shuning uchun yorliqqa chiqdi. Keling, yana bir misol.',
      'Ничего! Слово в title, поэтому оно на вкладке. Давай ещё пример.',
      'No worries! The word is in title, so it’s on the tab. Let’s try another one.'),
      body: L3('Deyarli! So‘z body ichida, shuning uchun oynaga chiqdi. Keling, yana bir misol.',
      'Почти! Слово в body, поэтому оно в окне. Давай ещё пример.',
      'Almost! The word is in body, so it’s in the window. Let’s try another one.')
    },
    askTitle: L3('title ichida «{w}». Qani, u qayerda chiqadi?',
      'В title — «{w}». Ну-ка, где оно появится?',
      'title says “{w}”. So, where will it show up?'),
    askBody: L3('Endi body ichida «{w}». Bu safar u qayerda chiqadi?',
      'А теперь в body — «{w}». Где оно появится на этот раз?',
      'Now body says “{w}”. Where will it show up this time?'),
    hints: [L3('So‘z qaysi teglar orasida turibdi?', 'Между какими тегами стоит слово?', 'Which tags is the word between?'),
      L3('title dagi matn yorliqda, body dagi matn oynada ko‘rinadi.', 'Текст из title видно на вкладке, текст из body — в окне.', 'Text from title shows on the tab, text from body in the window.'),
      L3('Teg nomini o‘qing: title bo‘lsa «Yorliq», body bo‘lsa «Oyna»ni bosing.', 'Прочитай имя тега: title — жми «Вкладка», body — жми «Окно».', 'Read the tag name: for title tap “Tab”, for body tap “Window”.')],
    done: L3('Zo‘r o‘ynadingiz! title dagi matn yorliqda, body dagi matn oynada.',
      'Отличная игра! Текст из title — на вкладке, текст из body — в окне.',
      'Great game! Text from title goes on the tab, text from body in the window.')
  },
  s9: {
    eyebrow: L3('body qismi', 'Часть body', 'The body part'),
    say: L3('Nom tayyor. Endi sahifaning o‘zini to‘ldiramiz! html ichidagi ikkinchi qism body, xuddi odamchaning tanasidek. Qarang-chi, undan nima chiqarkin!',
      'Название готово. Теперь заполним саму страницу! Вторая часть внутри html — body, как тело человечка. Смотри, что из него вылетит!',
      'The name is ready. Now let’s fill the page itself! The second part inside html is body, like the buddy’s body. Watch what comes out of it!'),
    out: L3('Ana! Matn, rasm va tugma tanadan chiqib, oynaga tushdi. Ular body ichida yozilgan.',
      'Вот это да! Текст, картинка и кнопка вылетели из тела в окно. Они записаны внутри body.',
      'How about that! The text, the picture and the button flew from the body into the window. They’re written inside body.'),
    done: L3('body ichidagi hamma narsa oynada ko‘rinadi.',
      'Всё, что внутри body, видно в окне.',
      'Everything inside body shows in the window.'),
    ask: L3('Qarang: odamchaning tanasi', 'Смотри: тело человечка', 'Watch: the buddy’s body')
  },
  s10: {
    eyebrow: L3('Oynadagi salom', 'Привет в окне', 'Hello in the window'),
    say: L3('Endi oynaga o‘z salomingizni yozing! body ichiga yozing, masalan, «Salom!». Matn darhol oynada chiqadi. Keyin «Tayyor»ni bosing.',
      'Теперь напиши в окне своё приветствие! Пиши внутри body, например «Привет!». Текст сразу появится в окне. Потом нажми «Готово».',
      'Now write your own greeting in the window! Type it inside body, for example “Hello!”. It shows up in the window right away. Then tap “Done”.'),
    ok: L3('Ajoyib! Salomingiz oynada turibdi.',
      'Отлично! Твоё приветствие уже в окне.',
      'Great! Your greeting is in the window.'),
    hints: [L3('Oynadagi matn qaysi teg ichida bo‘ladi? Kodga qarang.', 'В каком теге текст для окна? Посмотри на код.', 'Which tag holds the text for the window? Look at the code.'),
      L3('Matn ikki body tegi orasiga yoziladi.', 'Текст пишут между двумя тегами body.', 'The text goes between the two body tags.'),
      L3('Ikki body tegi orasidagi bo‘sh joyni bosing, matn yozing va «Tayyor»ni bosing.', 'Нажми пустое место между тегами body, напиши текст и нажми «Готово».', 'Tap the empty spot between the body tags, type your text and tap “Done”.')],
    ask: L3('body ichiga salom yozing va «Tayyor»ni bosing', 'Напиши приветствие в body и нажми «Готово»', 'Type a greeting in body and tap “Done”')
  },
  s11: {
    eyebrow: L3('Bo‘laklarni joylang', 'Разложи вырезки', 'Sort the cut-outs'),
    say: L3('Endi tartib o‘rnatamiz! Har bir bo‘lak qayerda yashaydi: head ichidami yoki body ichidami? Torting yoki avval bo‘lakni, keyin qismni bosing.',
      'Наведём порядок! Где живёт каждая вырезка: в head или в body? Перетащи её или нажми вырезку, а потом часть.',
      'Let’s tidy up! Where does each cut-out live: in head or in body? Drag it, or tap a cut-out, then a part.'),
    items: [
      { id: 'name', want: 'head', why: L3('Qarang: bu title ichidagi sahifa nomi. U yorliqda ko‘rinadi, demak head ichida turadi.',
      'Смотри: это название в теге title. Его видно на вкладке, значит, оно в head.',
      'Look: this is the page name in title. It shows on the tab, so it goes in head.') },
      { id: 'hello', want: 'body', why: L3('Deyarli! Bu matn oynada ko‘rinishi kerak, demak u body ichida.',
      'Почти! Этот текст должен быть виден в окне, значит, он в body.',
      'Almost! This text should show in the window, so it goes in body.') },
      { id: 'pic', want: 'body', why: L3('Hechqisi yo‘q! Rasmni oynada ko‘ramiz, demak u body ichida.',
      'Ничего! Картинку мы видим в окне, значит, она в body.',
      'No worries! We see the picture in the window, so it goes in body.') },
      { id: 'btn', want: 'body', why: L3('O‘ylab ko‘ring: tugmani qayerda bosamiz? Oynada! Demak, u body ichida.',
      'Подумай: где мы нажимаем кнопку? В окне! Значит, она в body.',
      'Think: where do we press the button? In the window! So it goes in body.') }
    ],
    ok: L3('Hammasi joy-joyida! Sahifa nomi head ichida, ko‘rinadigan narsalar body ichida.',
      'Порядок! Название — в head, всё, что видно, — в body.',
      'All sorted! The page name is in head, everything you see is in body.'),
    pickFirst: L3('Avval bo‘lakni tanlang.', 'Сначала выбери вырезку.', 'Pick a cut-out first.'),
    hints: [L3('Bu narsa brauzer oynasida ko‘rinadimi?', 'Эту вещь видно в окне браузера?', 'Can you see this in the browser window?'),
      L3('Oynada ko‘rinadigan narsalar body ichida. Sahifa nomi head ichida.',
      'То, что видно в окне, — в body. Название страницы — в head.',
      'What you see in the window goes in body. The page name goes in head.'),
      L3('Yonib turgan bo‘lakni yonib turgan joyga torting.', 'Перетащи светящуюся вырезку в светящееся место.', 'Drag the glowing cut-out to the glowing place.')],
    ask: L3('Bo‘lakni head yoki body ichiga torting', 'Перетащи вырезку в head или в body', 'Drag a cut-out into head or body'),
    askPlace: L3('Endi head yoki body qismini bosing', 'Теперь нажми head или body', 'Now tap head or body')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Endi butun kodni birga ko‘ramiz. Brauzer qanday ishlaydi? Kodni yuqoridan pastga o‘qiydi va sahifani yig‘adi. Kuzating!',
      'Теперь посмотрим весь код целиком. Как работает браузер? Читает код сверху вниз и собирает страницу. Смотри!',
      'Now let’s see all the code. How does the browser work? It reads the code from top to bottom and builds the page. Watch!'),
    // Коди сам проходит по частям (тексты — в parts); между title и body — когда закрывается head.
    order5: L3('Diqqat, muhim joy: avval head yopiladi, keyin body ochiladi.',
      'Внимание, важный момент: сначала закрываем head, потом открываем body.',
      'Here’s an important bit: first head closes, then body opens.'),
    askDone: L3('html ichida: avval head (unda title), keyin body (unda matn)',
      'В html: сначала head с title, потом body с текстом',
      'In html: first head with title, then body with the text'),
    ask: L3('Brauzer qanday o‘qishini kuzating', 'Смотри, как читает браузер', 'Watch how the browser reads'),
    // После показа ученик сам нажимает строку кода или часть страницы справа — Коди объясняет эту часть.
    tapSay: L3('Biror qismni yana eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi qismni bosing, men aytib beraman.',
      'Хочешь услышать какую-то часть ещё раз? Нажми строку кода или часть справа, и я расскажу.',
      'Want to hear a part again? Tap a code line or a part on the right, and I’ll tell you.'),
    askTap: L3('Qatorni yoki qismni bossangiz, Kodi yana aytadi', 'Нажми строку или часть — Коди повторит', 'Tap a line or a part to hear it again'),
    parts: {
      // DOCTYPE — особая первая строка, не парный тег.
      doc: L3('Birinchi qator <!DOCTYPE html> maxsus qator. U brauzerga: «Bu HTML sahifa», deydi. Uning jufti yo‘q.',
      'Первая строка <!DOCTYPE html> — особая. Она говорит браузеру: «Это HTML-страница». Пары у неё нет.',
      'The first line, <!DOCTYPE html>, is special. It tells the browser: “This is an HTML page.” It has no pair.'),
      html: L3('html tegi butun sahifani quchoqlab turadi: ichida head va body bor.',
      'Тег html обнимает всю страницу: внутри него head и body.',
      'The html tag hugs the whole page: head and body are inside it.'),
      head: L3('Mana head, sahifaning «boshi». Unda sahifa haqidagi ma’lumotlar bor.',
      'А вот head, «голова» страницы. В ней сведения о странице.',
      'Here’s head, the page’s “head”. It holds information about the page.'),
      title: L3('head ichida esa title yashaydi. Undagi nomni yorliqda ko‘rasiz.',
      'Внутри head живёт title. Его название ты видишь на вкладке.',
      'Inside head lives title. You see its name on the tab.'),
      body: L3('Mana body, sahifaning «tanasi». Undagi hamma narsa oynada ko‘rinadi.',
      'А вот body, «тело» страницы. Всё, что в нём, видно в окне.',
      'And here’s body, the page’s “body”. Everything in it shows in the window.'),
      text: L3('Mana, bu siz yozgan matn! U body ichida, shuning uchun oynada.',
      'А вот и твой текст! Он внутри body, поэтому в окне.',
      'And here’s your text! It’s inside body, so it’s in the window.')
    }
  },
  s13: {
    eyebrow: L3('Sahifa tuzilishini yig‘ing', 'Собери основу страницы', 'Build the page structure'),
    say: L3('Endi eng katta sinov: butun kodni o‘zingiz yig‘ing! Birinchi qator joyida. Qolgan qatorlardan birini bossangiz, u navbatdagi bo‘sh joyga tushadi.',
      'А теперь главное испытание: собери весь код! Первая строка уже стоит. Нажми полоску — она встанет в следующую пустую строку.',
      'Now the big challenge: build the whole code! The first line is in place. Tap a strip, and it goes into the next empty line.'),
    // Звучит один раз — после первой поставленной полоски; стрелки ▲ ▼ в это время мигают.
    sayMove: L3('Qator noto‘g‘ri joyga tushdimi? Qo‘rqmang, uni o‘qchalar bilan yuqoriga yoki pastga suring. Hammasi joyida bo‘lsa, «Tekshirish»ni bosing.',
      'Полоска встала не туда? Не страшно: сдвинь её стрелками вверх или вниз. Когда всё на местах, нажми «Проверить».',
      'Strip in the wrong spot? No problem: move it up or down with the arrows. When everything’s in place, tap “Check”.'),
    rules: {
      html: L3('html birinchi ochiladi va oxirida yopiladi: butun sahifa uning ichida.',
      'html открывается первым и закрывается последним: внутри него вся страница.',
      'html opens first and closes last: the whole page is inside it.'),
      pair: L3('Yopuvchi teg o‘z ochuvchi tegidan keyin turadi.',
      'Закрывающий тег стоит после своего открывающего.',
      'A closing tag comes after its opening tag.'),
      order: L3('Avval head, keyin body keladi.', 'Сначала идёт head, потом body.', 'head comes first, then body.'),
      headClose: L3('body boshlanishidan oldin head yopilishi kerak.', 'head нужно закрыть до того, как начнётся body.', 'Close head before body starts.'),
      title: L3('title head ichida turadi.', 'title стоит внутри head.', 'title goes inside head.'),
      text: L3('Sahifa matni body ichida turadi.', 'Текст страницы стоит внутри body.', 'The page text goes inside body.')
    },
    hints: [L3('Qaysi teg birinchi ochilib, oxirida yopiladi?', 'Какой тег открывается первым и закрывается последним?', 'Which tag opens first and closes last?'),
      L3('html ichida avval title bilan head, keyin matn bilan body keladi.',
      'Внутри html сначала head с title, потом body с текстом.',
      'Inside html: first head with title, then body with the text.'),
      L3('Belgilangan ikki qatorning o‘rnini almashtiring.', 'Поменяй местами две отмеченные полоски.', 'Swap the two marked strips.')],
    ok: L3('Qoyil, kod to‘g‘ri yig‘ildi! Sahifa nomi head ichida, matn body ichida.',
      'Вот это да, код собран верно! Название — в head, текст — в body.',
      'Look at that, the code is right! The page name is in head, the text is in body.'),
    ask: L3('Qatorlarni tartib bilan qo‘ying', 'Расставь полоски по порядку', 'Put the strips in order')
  },
  s14: {
    eyebrow: L3('Matn yorliqqa tushib qoldi', 'Текст попал на вкладку', 'Text on the tab'),
    say: L3('Voy, nimadir buzildi! Yorliqqa butun sahifa matni chiqib ketdi, oyna esa bo‘sh. title qatorida bitta teg yetishmayapti.',
      'Ну и дела! На вкладку уехал весь текст страницы, а окно пустое. В строке title не хватает одного тега.',
      'Something broke! All the page text went to the tab, and the window is empty. One tag is missing in the title line.'),
    sayHow: L3('Qani, tuzatamizmi? Kerakli tegni bo‘sh joyga torting yoki shunchaki bosing.',
      'Починим? Перетащи нужный тег в пустое место или просто нажми его.',
      'Shall we fix it? Drag the right tag into the empty spot, or just tap it.'),
    opts: ['</title>', '<title>', '</head>'],
    why: {
      '<title>': L3('Deyarli! Bu ochuvchi teg, title esa allaqachon ochilgan. Endi uni yopish kerak.',
      'Почти! Это открывающий тег, а title уже открыт. Теперь его нужно закрыть.',
      'Almost! That’s an opening tag, and title is already open. Now it needs to close.'),
      '</head>': L3('Shoshilmang! head keyinroq yopiladi. Avval sahifa nomi tugashi kerak, shuning uchun title ni yoping.',
      'Не спеши! head закроется позже. Сначала должно закончиться название, поэтому закрой title.',
      'Not so fast! head closes later. First the page name has to end, so close title.')
    },
    hints: [L3('Qaysi teg ochilgan, lekin yopilmagan?', 'Какой тег открыт, но не закрыт?', 'Which tag is open but not closed?'),
      L3('title ochilgan. Uni yopadigan teg kerak.', 'title открыт. Нужен тег, который его закрывает.', 'title is open. You need the tag that closes it.'),
      L3('Qiya chiziqli title tegini bo‘sh joyga qo‘ying.', 'Поставь в пустое место тег title с косой чертой.', 'Put the title tag with a slash into the empty spot.')],
    ok: L3('Ana, tuzaldi! Nom yorliqda, matn oynada. Yopuvchi title tegi nom qayerda tugashini ko‘rsatdi.',
      'Починили! Название на вкладке, текст в окне. Закрывающий тег title показал, где кончается название.',
      'Fixed it! The name is on the tab, the text is in the window. The closing title tag showed where the name ends.'),
    ask: L3('Yetishmayotgan tegni bo‘sh joyga torting', 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty place')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новый пример без подсказки до первой попытки.
  q1: {
    eyebrow: L3('Yorliq va oyna', 'Вкладка и окно', 'Tab and window'),
    say: L3('Endi o‘zingizni sinab ko‘ring! Yangi sahifa: yorliqda «Robotlar», oynada «Salom!» chiqishi kerak. Har bir so‘zni koddagi o‘z joyiga torting yoki avval so‘zni, keyin joyni bosing.',
      'Теперь проверь себя! Новая страница: на вкладке должно быть «Роботы», в окне — «Привет!». Перетащи каждую фразу на её место в коде. Или нажми фразу, потом место.',
      'Now test yourself! A new page: the tab should say “Robots”, the window “Hello!”. Drag each phrase to its place in the code. Or tap a phrase, then the place.'),
    tabWord: L3('Robotlar', 'Роботы', 'Robots'),
    winWord: L3('Salom!', 'Привет!', 'Hello!'),
    toWin: L3('Qarang: «{w}» oynaga tushib qoldi. body dagi matn oynada chiqadi, yorliq uchun esa title kerak.',
      'Смотри: «{w}» попало в окно. Текст из body виден в окне, а для вкладки нужен title.',
      'Look: “{w}” landed in the window. Text in body shows in the window, and the tab needs title.'),
    toTab: L3('Qarang: «{w}» yorliqqa chiqib qoldi. title dagi matn yorliqda chiqadi, oyna uchun esa body kerak.',
      'Смотри: «{w}» попало на вкладку. Текст из title виден на вкладке, а для окна нужен body.',
      'Look: “{w}” landed on the tab. Text in title shows on the tab, and the window needs body.'),
    hints: [L3('Yorliqdagi matn qaysi teg ichida bo‘ladi?', 'В каком теге текст для вкладки?', 'Which tag holds the text for the tab?'),
      L3('Yorliq uchun title, oyna uchun body.', 'Для вкладки — title, для окна — body.', 'For the tab: title. For the window: body.'),
      L3('Yonib turgan so‘zni yonib turgan joyga torting.', 'Перетащи светящуюся фразу в светящееся место.', 'Drag the glowing phrase to the glowing place.')],
    ok: L3('Mukammal! «Robotlar» title ichida, shuning uchun yorliqda. «Salom!» body ichida, shuning uchun oynada.',
      'Идеально! «Роботы» в title — поэтому на вкладке. «Привет!» в body — поэтому в окне.',
      'Perfect! “Robots” is in title, so it’s on the tab. “Hello!” is in body, so it’s in the window.'),
    pickFirst: L3('Avval so‘zni tanlang.', 'Сначала выбери фразу.', 'Pick a phrase first.'),
    ask: L3('Har bir so‘zni o‘z joyiga torting', 'Перетащи каждую фразу на её место', 'Drag each phrase into its place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  q2: {
    eyebrow: L3('Nega </title> kerak?', 'Зачем нужен </title>?', 'Why </title>?'),
    say: L3('Va oxirgi savol. Nima deb o‘ylaysiz, yopuvchi title tegi nima uchun kerak? Javobni bosing.',
      'И последний вопрос. Как думаешь, зачем нужен закрывающий тег title? Нажми ответ.',
      'And the last question. What do you think: why do we need the closing title tag? Tap an answer.'),
    // Верный ответ не первый; неверные выключаются после попытки, с объяснением.
    opts: [
      { id: 'win', t: L3('Sahifa nomini oynada ko‘rsatadi', 'Показывает название в окне', 'It shows the name in the window'),
        why: L3('Unday emas: yopuvchi teg sahifada ko‘rinmaydi va nomni oynaga chiqarmaydi.',
      'Не совсем: закрывающий тег на странице не виден и название в окно не выводит.',
      'Not quite: a closing tag doesn’t show on the page and doesn’t put the name in the window.') },
      { id: 'end', right: true, t: L3('Sahifa nomi qayerda tugashini ko‘rsatadi', 'Показывает, где заканчивается название страницы', 'It shows where the page name ends') },
      { id: 'new', t: L3('Yangi sahifani boshlaydi', 'Начинает новую страницу', 'It starts a new page'),
        why: L3('Unday emas: sahifa html tegi bilan boshlanadi. Yopuvchi title tegi esa nomni tugatadi.',
      'Не совсем: страница начинается с тега html. А закрывающий тег title заканчивает название.',
      'Not quite: a page starts with the html tag. The closing title tag ends the name.') }
    ],
    hints: [L3('Oldingi ekranni eslang: u yerda yopuvchi title tegi yo‘q edi.', 'Вспомни прошлый экран: там не было закрывающего тега title.', 'Remember the last screen: the closing title tag was missing.'),
      L3('Qiya chiziqli teg biror qismni tugatadi. title ichida nima turadi?', 'Тег с косой чертой заканчивает часть. Что стоит внутри title?', 'A tag with a slash ends a part. What’s inside title?'),
      L3('Yopuvchi title tegi sahifa nomini tugatadi.', 'Закрывающий тег title заканчивает название страницы.', 'The closing title tag ends the page name.')],
    ok: L3('Aynan! U nom qayerda tugashini ko‘rsatadi. Usiz sahifa matni yorliqqa chiqib ketadi.',
      'Точно! Он показывает, где кончается название. Без него текст страницы уезжает на вкладку.',
      'Exactly! It shows where the name ends. Without it, the page text ends up on the tab.'),
    ask: L3('Javobni tanlang', 'Выбери ответ', 'Pick an answer')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Mana, sizning birinchi sahifangiz!',
      'Вот она, твоя первая страница!',
      'Here it is, your very first page!'), k: null },
      { text: L3('Esingizdami? Teg burchakli qavsdagi so‘z. Brauzer uni ko‘rsatmaydi, o‘qiydi.',
      'Помнишь? Тег — слово в угловых скобках. Браузер его не показывает, а читает.',
      'Remember? A tag is a word in angle brackets. The browser doesn’t show it, it reads it.'), k: null },
      { text: L3('Butun sahifani html birlashtiradi: head ham, body ham uning ichida.',
      'Всю страницу собирает html: и head, и body — внутри него.',
      'html holds the whole page: both head and body are inside it.'), k: 'html' },
      { text: L3('head sahifa haqidagi ma’lumotlarni saqlaydi.',
      'head хранит сведения о странице.',
      'head keeps information about the page.'), k: 'head' },
      { text: L3('title esa head ichida. Undagi nomni yorliqda ko‘rasiz.',
      'А title живёт внутри head: его название ты видишь на вкладке.',
      'And title lives inside head: you see its name on the tab.'), k: 'title' },
      { text: L3('body ichidagi hamma narsa oynada ko‘rinadi.',
      'Всё, что внутри body, видно в окне.',
      'Everything inside body shows in the window.'), k: 'body' },
      { text: L3('Tabriklayman! Birinchi HTML sahifangiz tayyor. Endi siz haqiqiy veb-dasturchiga bir qadam yaqinsiz!',
      'Ура! Твоя первая HTML-страница готова. Ты на шаг ближе к настоящему веб-программисту!',
      'Hooray! Your first HTML page is ready. You’re one step closer to being a real web developer!'), k: null }
    ],
    roles: {
      html: L3('html — hamma qismlarni o‘z ichiga oladi', 'html — объединяет все части страницы', 'html — holds all the parts of the page'),
      head: L3('head — sahifa haqida ma’lumot', 'head — сведения о странице', 'head — information about the page'),
      title: L3('title — yorliqdagi sahifa nomi', 'title — название на вкладке', 'title — the page name on the tab'),
      body: L3('body — oynada ko‘rinadigan hamma narsa', 'body — всё, что видно в окне', 'body — everything you see in the window')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { pair: 1, read1: 1, read2: 1, read3: 1, magic: 1, magicHead: 1, magicWin: 1, sayTab: 1, sayGo: 1, sayInfo: 1, sayTag: 1, sayHow: 1, sayMove: 1, why: 1, opts: 1, rules: 1, miss: 1, askTitle: 1, askBody: 1, toWin: 1, toTab: 1, tapSay: 1, parts: 1, order5: 1, top: 1, bottom: 1, msgs: 1, opened: 1, flew: 1, out: 1, back: 1, items: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { id: 1, want: 1 }, opts: { t: 1, id: 1, right: 1 } });

/*@FILE:kollazh-paper-data.jsx@*/

/*@FILE:kollazh-paper.jsx@*/

/*@FILE:kollazh-kit.jsx@*/

/*@FILE:kollazh-trans.jsx@*/

/*@FILE:kollazh-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:kollazh.css@*/
`;
