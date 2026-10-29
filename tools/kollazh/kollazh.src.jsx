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
// body — то, что видно в окне. UZ: teg, brauzer varag‘i — вкладка (тексты заказчика 28.10.2026; кнопка — «Varaq»), oyna — окно,
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
  writeHere: L3('Shu yerga yozing', 'Пиши здесь', 'Type here'),
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
  tab: L3('Varaq', 'Вкладка', 'Tab'),
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
    sayTab: L3('Tepadagi kichkina joyni ko‘ryapsizmi? Bu brauzer varag‘i, unda sahifa nomi yozilgan.',
      'Видишь маленькое место сверху? Это вкладка браузера, на ней написано название страницы.',
      'See the little spot at the top? That’s the browser tab. It shows the page name.'),
    sayGo: L3('Agar veb-sahifa odam bo‘lsa, nima deb o‘ylaysiz, u qanday ko‘rinardi? Keling, shuni ko‘ramiz. «Aylantirish» tugmasini bosing.',
      'А если бы веб-страница была человеком, как думаешь, какой бы она была? Давай проверим! Нажми «Превратить».',
      'If a web page were a person, what do you think it would look like? Let’s find out! Tap “Transform”.'),
    // После сборки: голова — сведения о странице (название — лишь одно из них), тело — то, что видно.
    magic: L3('Voy, qarang! Sahifa jonlanib, odamchaga aylandi!',
      'Ого, смотри! Страница ожила и стала человечком!',
      'Whoa, look! The page came alive as a paper buddy!'),
    magicHead: L3('Sezdingizmi? Sahifa nomi odamchaning boshiga joylashdi. Boshda sahifa haqidagi ma’lumotlar saqlanadi.',
      'Смотри-ка! Название страницы спряталось у него в голове. В голове хранятся сведения о странице.',
      'Did you notice? The page name went into its head. The head keeps information about the page.'),
    magicWin: L3('Tanasi-chi? U sahifada ko‘rinadigan narsalardan yig‘ildi: matn, rasm va tugmadan.',
      'А тело? Оно собралось из того, что видно на странице: текста, картинки и кнопки.',
      'And the body? It’s made of what you see on the page: text, a picture and a button.'),
    // Короткая цель вместо экрана плана (заказчик, 26.10.2026).
    done: L3('Bugun o‘z sahifangizni yaratasiz, unga nom berasiz va salomlashish matnini yozasiz! Keling, avval buning kodi qanday ko‘rinishini ko‘rib chiqamiz.',
      'Сегодня ты создашь страницу со своим названием и приветствием! Сначала посмотрим, как выглядит код.',
      'Today you’ll create a page with your own page name and greeting! First, let’s see what code looks like.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askLook: L3('Qarang: brauzer varag‘i', 'Смотри: вкладка браузера', 'Look: the browser tab'),
    askDone: L3('Boshda — sahifa haqida ma’lumot, tanada — ko‘rinadigan narsalar',
      'В голове — сведения о странице, в теле — то, что видно',
      'The head keeps page info, the body is what you see')
  },
  // «Как читают код?» (заказчик, 26.10.2026): копия «Сверху вниз» в начале урока — весь код
  // и браузер, который сам его читает; что значит каждый тег, не говорим. Главное — код
  // читают слева направо и сверху вниз (показывают стрелки и маркер по строке).
  rd: {
    eyebrow: L3('Kod qanday o‘qiladi?', 'Как читают код?', 'How is code read?'),
    say: L3('Mana, sahifaning kodi! Brauzer shu kod asosida sahifani yaratadi. U kodni qanday o‘qishini kuzating!',
      'Вот это код! Из него браузер и собирает страницу. Смотри, как он его читает!',
      'This is code! The browser builds the page from it. Watch how it reads it!'),
    read1: L3('Sezdingizmi? Brauzer kodni xuddi kitob o‘qigandek o‘qiydi.',
      'Смотри-ка: браузер читает код, как книжку.',
      'Did you notice? The browser reads code like a book.'),
    read2: L3('Har bir qatorni chapdan o‘ngga o‘qiydi.',
      'Каждую строчку — слева направо.',
      'Each line from left to right.'),
    read3: L3('Qatorlarni esa yuqoridan pastga, birin-ketin o‘qiydi.',
      'А строчки — сверху вниз, одну за другой.',
      'And the lines from top to bottom, one after another.'),
    done: L3('Mana, sahifa tayyor! Endi kodning har bir qismi nimani anglatishini birga bilib olamiz.',
      'Строчка за строчкой — и страница готова! Дальше разберёмся с этим кодом вместе.',
      'Line by line, and the page is ready! Next, let’s figure out this code together.'),
    ask: L3('Brauzer kodni qanday o‘qishini kuzating', 'Смотри, как браузер читает код', 'Watch how the browser reads code'),
    askDone: L3('Chapdan o‘ngga, yuqoridan pastga', 'Слева направо, сверху вниз', 'Left to right, top to bottom')
  },
  // «Тег html» (заказчик, 26.10.2026: отдельный экран «что такое тег» убран — здесь же
  // объясняем, что такое тег, открывающий и закрывающий; о чём говорим — в «прожекторе»).
  s3: {
    eyebrow: L3('Teg nima?', 'Что такое тег?', 'What is a tag?'),
    say: L3('Ramkaga qarang: unda ikkita qiziq yozuv bor. Ular nimani bildiradi?',
      'Посмотри на рамку: на ней две интересные надписи. Что же это такое?',
      'Look at the frame: there are two interesting labels on it. What are they?'),
    // Сначала знаки, потом имя, потом вся запись — подсветка точно за словами (заказчик, 27.10.2026).
    br: L3('Mana bu belgilarga qarang. Ular burchakli qavslar deyiladi.',
      'Посмотри на эти знаки. Они называются угловыми скобками.',
      'Look at these signs. They’re called angle brackets.'),
    nm: L3('Qavslar orasida html deb yozilgan. Bu — tegning nomi.',
      'Между ними написано html. Это название тега.',
      'Between them it says html. That’s the tag’s name.'),
    sayTag: L3('Qavslar va ular orasidagi nom birgalikda teg deyiladi. Mana bu — html tegi. Brauzer tegni o‘qiydi, lekin sahifada ko‘rsatmaydi.',
      'Вся запись вместе — тег html. Браузер не показывает тег на странице, а читает его.',
      'All together, it’s the html tag. The browser doesn’t show a tag on the page, it reads it.'),
    top: L3('Yuqoridagi <html> — ochuvchi teg. U brauzerga: «Sahifa shu yerdan boshlanadi», deydi.',
      'Верхний — открывающий тег html. Он говорит браузеру: «Здесь страница начинается».',
      'The top one is the opening html tag. It tells the browser: “The page starts here.”'),
    bottom: L3('Pastdagi yozuvga qarang: birinchi qavsdan keyin qiya chiziq bor. Bu — yopuvchi </html> tegi. U brauzerga: «Sahifa shu yerda tugaydi», deydi.',
      'А на нижнем сразу после первой скобки стоит косая черта. Это закрывающий тег html, он говорит: «Здесь страница заканчивается».',
      'On the bottom one, a slash comes right after the first bracket. It’s the closing html tag. It says: “The page ends here.”'),
    pair: L3('Ochuvchi teg boshlanishni, yopuvchi teg esa tugashni bildiradi. Sahifaning barcha mazmuni shu ikki teg orasida joylashadi.',
      'Открывающий тег обозначает начало, закрывающий — конец. Всё содержимое страницы стоит между ними.',
      'The opening tag marks the start, the closing tag marks the end. Everything on the page goes between them.'),
    done: L3('Bir sirni aytaymi? Bu ramkani tushunish oson bo‘lishi uchun chizdik. Aslida brauzer bu ramkani ko‘rsatmaydi.',
      'Маленький секрет: рамку мы нарисовали для наглядности. В браузере её не увидишь.',
      'A little secret: we drew the frame to make it clear. You won’t see it in a browser.'),
    ask: L3('Ramkadagi teglarga qarang', 'Смотри на теги рамки', 'Watch the tags on the frame'),
    askDone: L3('Ochuvchi teg boshlaydi, qiya chiziqli yopuvchi teg tugatadi',
      'Открывающий тег начинает, закрывающий (с косой чертой) заканчивает',
      'The opening tag starts, the closing one (with a slash) ends')
  },
  s4: {
    eyebrow: L3('Ramkani yoping', 'Закрой рамку', 'Close the frame'),
    say: L3('Qarang, ramkaning pastki cheti yo‘q! Kodda yopuvchi html tegi yetishmayapti. Uni bo‘sh qatorga yozing va «Tekshirish» tugmasini bosing.',
      'Смотри: у рамки пропал нижний край! В коде не хватает закрывающего тега html. Напиши его в пустой строке и нажми «Проверить».',
      'Look: the frame’s bottom edge is gone! The closing html tag is missing from the code. Type it in the empty line and tap “Check”.'),
    msgs: {
      needSlash: L3('Deyarli to‘g‘ri! Bu — ochuvchi teg. Yopuvchi tegda html nomidan oldin qiya chiziq bo‘ladi.',
      'Почти! Это открывающий тег. В закрывающем перед словом html стоит косая черта.',
      'Almost! That’s the opening tag. The closing tag has a slash before html.'),
      needLt: L3('Teg boshida chap burchakli qavs yetishmayapti. Uni qo‘shing.',
      'Чего-то не хватает: тег начинается с угловой скобки «<». Добавь её в начало.',
      'Something is missing: a tag starts with the angle bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida o‘ng burchakli qavs yetishmayapti. Uni qo‘shing.',
      'В конце чего-то не хватает: тег заканчивается угловой скобкой «>». Добавь её в конец.',
      'Something is missing at the end: a tag ends with the angle bracket “>”. Add it at the end.'),
      wrongName: L3('Teg nomini tekshiring: bu yerda html bo‘lishi kerak.',
      'Посмотри на слово внутри тега: здесь нужен html.',
      'Check the word inside the tag: here you need html.'),
      generic: L3('Belgilar tartibini tekshiring: avval chap burchakli qavs, keyin qiya chiziq, undan keyin html va oxirida o‘ng burchakli qavs.',
      'Проверь порядок знаков: угловая скобка «<», косая черта «/», слово html и угловая скобка «>».',
      'Check the order: angle bracket “<”, slash “/”, the word html, angle bracket “>”.')
    },
    hints: [L3('Ramkaning yuqorisidagi ochuvchi tegga qarang.', 'Посмотри на верхний тег на рамке.', 'Look at the top tag on the frame.'),
      L3('Yopuvchi tegning nomi ham html. Faqat nomidan oldin qiya chiziq qo‘yiladi.', 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3('Avval chap burchakli qavsni, keyin qiya chiziqni yozing. So‘ng html deb yozing va oxiriga o‘ng burchakli qavsni qo‘ying.',
      'Начни с угловой скобки, потом поставь косую черту. Дальше html и в конце снова угловая скобка.',
      'Start with the angle bracket, then add the slash. Then html, and another angle bracket at the end.')],
    ok: L3('Zo‘r, ramka yopildi! Endi sahifaning barcha mazmuni ikki html tegi orasida.',
      'Есть! Рамка закрылась: вся страница теперь между двумя тегами html.',
      'Yes! The frame is closed: the whole page is between the two html tags now.'),
    ask: L3('Bo‘sh qatorga yopuvchi html tegini yozing va «Tekshirish»ni bosing', 'Напиши закрывающий тег html в пустой строке и нажми «Проверить»', 'Type the closing html tag in the empty line and tap “Check”')
  },
  s5: {
    eyebrow: L3('Teglarni joyiga qo‘ying', 'Теги по местам', 'Tags in place'),
    say: L3('Endi teglarni joyiga qo‘ying! Biri ramkaning yuqorisiga, ikkinchisi pastiga qo‘yiladi. Diqqat: uchta tegdan bittasi ortiqcha!',
      'Теперь твоя очередь! Рамке нужны два тега: сверху и снизу. Осторожно, один из трёх тегов внизу лишний.',
      'Your turn! The frame needs two tags: top and bottom. Careful, one of the three tags below is extra.'),
    // Как переносить — словами, пока рука показывает (рука — после этой реплики).
    sayHow: L3('Tegni barmog‘ingiz bilan bosib turing va kerakli joyga suring. Yoki avval tegni, keyin uning joyini bosing.',
      'Хватай тег пальцем и неси на место. Или проще: нажми тег, а потом место.',
      'Grab a tag with your finger and carry it into place. Or simply tap the tag, then the place.'),
    top: L3('Deyarli to‘g‘ri! Yuqorida sahifa boshlanadi. Bu yerga qiya chiziqsiz ochuvchi teg kerak.',
      'Почти! Сверху страница начинается, здесь нужен открывающий тег, без косой черты.',
      'Almost! The page starts at the top, so it needs the opening tag, without a slash.'),
    bottom: L3('Yana bir bor urinib ko‘ring! Pastda sahifa tugaydi. Bu yerga qiya chiziqli yopuvchi teg kerak.',
      'Ничего! Снизу страница заканчивается, здесь нужен закрывающий тег, с косой чертой.',
      'No worries! The page ends at the bottom, so it needs the closing tag, with a slash.'),
    back: L3('Bu tegdagi chiziqqa qarang: uning yuqori uchi chap tomonda. Yopuvchi tegdagi qiya chiziqning yuqori uchi esa o‘ng tomonda bo‘lishi kerak.',
      'А вот и хитрость! Эта черта наклонена не в ту сторону. В закрывающем теге она наклонена вправо: «/».',
      'Here’s the trick! This slash leans the wrong way. In a closing tag it leans right: “/”.'),
    pickFirst: L3('Avval tegni tanlang.', 'Сначала выбери тег.', 'Pick a tag first.'),
    hints: [L3('Qaysi teg sahifaning boshlanishini, qaysi biri tugashini bildiradi?', 'Какой тег начинает страницу, а какой заканчивает?', 'Which tag starts the page, and which one ends it?'),
      L3('Yuqoriga qiya chiziqsiz ochuvchi tegni, pastga esa qiya chiziqli yopuvchi tegni qo‘ying.',
      'Сверху — тег без косой черты. Снизу — тег с косой чертой.',
      'Top: the tag without a slash. Bottom: the tag with a slash.'),
      L3('Ochuvchi html tegini ramkaning yuqorisidagi joyga suring.', 'Перетащи <html> на верхнее место.', 'Drag <html> to the top place.')],
    ok: L3('Ajoyib, ikkala teg ham joyida! Chizig‘i teskari tomonga qiyalangan teg ortiqcha edi.',
      'Отлично, оба тега на месте! А тег с обратной чертой был лишним.',
      'Great, both tags are in place! The one with the backslash was extra.'),
    ask: L3('Tegni joyiga suring', 'Перетащи тег на место', 'Drag a tag into place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  s6: {
    eyebrow: L3('head va title', 'head и title', 'head and title'),
    // Короткими шагами, у каждого — своя подсветка: голова → окно → title → вкладка.
    // Окно браузера впервые названо здесь, на sayInfo, — пока оно подсвечено.
    say: L3('html ichida ikkita asosiy qism bor. Birinchisi — head. Ingliz tilida head «bosh» degani. Odamchaning boshi bu qismni eslab qolishga yordam beradi.',
      'Внутри html живут две части. Первая — head. Голова человечка как раз про неё.',
      'Two parts live inside html. The first is head. The buddy’s head stands for it.'),
    sayInfo: L3('head qismida sahifa haqidagi ma’lumotlar saqlanadi. Bu ma’lumotlar sahifaning asosiy qismida ko‘rinmaydi.',
      'В head — сведения о странице. Посмотри на большое место внизу, на окно браузера: там их не видно.',
      'head holds information about the page. Look at the big area below, the browser window: you can’t see it there.'),
    opened: L3('head ichida nima bor ekan? Mana, sahifaning nomi! U ochuvchi va yopuvchi title teglari orasiga yoziladi.',
      'А что внутри? Вот, название страницы! Его пишут внутри тега title.',
      'What’s inside? Here, the page name! It’s written inside the title tag.'),
    flew: L3('Sahifaning nomi brauzer varag‘iga ko‘chdi! Brauzer title ichidagi nomni shu yerda ko‘rsatadi.',
      'Название перелетело на вкладку! Браузер показывает текст из title именно там.',
      'The name flew to the tab! The browser shows the text from title right there.'),
    // «Внутри head» — через код: сверху <head>, снизу </head>, title между ними (заказчик, 27.10.2026).
    inHead: L3('Kodga qarang: yuqorida ochuvchi head tegi, pastda esa yopuvchi head tegi bor.',
      'Посмотри на код: сверху открывающий тег head, снизу закрывающий.',
      'Look at the code: the opening head tag is at the top, the closing one at the bottom.'),
    done: L3('title qatori shu ikki teg orasida joylashgan. Demak, title head qismining ichida.',
      'Строка title стоит между ними. Значит, title находится внутри head.',
      'The title line sits between them. So title is inside head.'),
    ask: L3('Qarang: odamchaning boshi', 'Смотри: голова человечка', 'Watch: the buddy’s head'),
    askCard: L3('Qarang: title tegi', 'Смотри: тег title', 'Watch: the title tag')
  },
  s7: {
    eyebrow: L3('Brauzer varag‘idagi nom', 'Название на вкладке', 'The name on the tab'),
    say: L3('Endi sahifangizga nom bering! Ochuvchi va yopuvchi title teglari orasiga o‘zingiz tanlagan nomni yozing. Masalan, «Futbol». Nom darhol brauzer varag‘ida paydo bo‘ladi. So‘ng «Tayyor» tugmasini bosing.',
      'А теперь самое интересное: придумай своей странице название! Напиши его внутри title, например «Футбол». Оно сразу появится на вкладке. Потом нажми «Готово».',
      'Now the fun part: name your page! Type it inside title, for example “Football”. It shows up on the tab right away. Then tap “Done”.'),
    ok: L3('Zo‘r! Endi brauzer varag‘ida sahifangizning nomi ko‘rinib turibdi.',
      'Класс! Теперь на вкладке видно название твоей страницы.',
      'Cool! Your page name is now on the tab.'),
    hints: [L3('Sahifaning nomi qayerga yoziladi? Kodga qarang.', 'В каком теге пишут название? Посмотри на код.', 'Which tag holds the name? Look at the code.'),
      L3('Sahifaning nomi ochuvchi va yopuvchi title teglari orasiga yoziladi.', 'Название пишут между двумя тегами title.', 'The name goes between the two title tags.'),
      L3('title teglari orasidagi bo‘sh joyni bosing va sahifangizga nom yozing. So‘ng «Tayyor» tugmasini bosing.',
      'Нажми пустое место между тегами title, напиши название и нажми «Готово».',
      'Tap the empty spot between the title tags, type a name and tap “Done”.')],
    noTags: L3('Bu yerga faqat sahifa nomini yozing. Burchakli qavslar kerak emas.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
    ask: L3('title ichiga nom yozing va «Tayyor»ni bosing', 'Напиши название в title и нажми «Готово»', 'Type a name in title and tap “Done”')
  },
  // Вкладка или окно (заказчик, 26.10.2026: после body) — по строке кода предсказать: title — вкладка, body — окно.
  s8: {
    eyebrow: L3('Varaqmi yoki oyna?', 'Вкладка или окно?', 'Tab or window?'),
    say: L3('Endi o‘ynaymiz: o‘zingizni brauzer deb tasavvur qiling! Kodga qarang va matn qayerda paydo bo‘lishini toping: brauzer varag‘idami yoki oynadami?',
      'А теперь игра: ты — браузер! Посмотри на строку кода и реши, где появится слово: на вкладке или в окне?',
      'Now a game: you’re the browser! Look at the line of code and decide where the word will show: on the tab or in the window?'),
    rounds: [
      { kind: 'title', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'tab' },
      { kind: 'body', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'win' },
      { kind: 'title', word: L3('Final juma kuni!', 'Финал в пятницу!', 'The final is on Friday!'), extra: L3('Bugun konsert!', 'Сегодня концерт!', 'Concert today!'), want: 'tab' }
    ],
    ok: {
      title: L3('To‘g‘ri! title ichidagi matn brauzer varag‘ida paydo bo‘ldi.',
      'Верно! Слово из title — на вкладке.',
      'Right! The word from title is on the tab.'),
      body: L3('Topdingiz! body ichidagi matn brauzer oynasida paydo bo‘ldi.',
      'В точку! Слово из body — в окне.',
      'Spot on! The word from body is in the window.')
    },
    miss: {
      title: L3('Yana bir bor urinib ko‘ramiz! Matn title ichida yozilgan, shuning uchun u brauzer varag‘ida paydo bo‘ldi. Keling, yana bir misolni ko‘ramiz.',
      'Ничего! Слово в title, поэтому оно на вкладке. Давай ещё пример.',
      'No worries! The word is in title, so it’s on the tab. Let’s try another one.'),
      body: L3('Yana bir bor urinib ko‘ramiz! Matn body ichida yozilgan, shuning uchun u brauzer oynasida paydo bo‘ldi. Keling, yana bir misolni ko‘ramiz.',
      'Почти! Слово в body, поэтому оно в окне. Давай ещё пример.',
      'Almost! The word is in body, so it’s in the window. Let’s try another one.')
    },
    askTitle: L3('title teglari orasida «{w}» deb yozilgan. Bu matn qayerda paydo bo‘ladi?',
      'В title — «{w}». Ну-ка, где оно появится?',
      'title says “{w}”. So, where will it show up?'),
    askBody: L3('Endi body teglari orasida «{w}» deb yozilgan. Bu safar matn qayerda paydo bo‘ladi?',
      'А теперь в body — «{w}». Где оно появится на этот раз?',
      'Now body says “{w}”. Where will it show up this time?'),
    hints: [L3('Matn qaysi teglar orasida yozilgan?', 'Между какими тегами стоит слово?', 'Which tags is the word between?'),
      L3('title ichidagi matn brauzer varag‘ida, body ichidagi matn esa brauzer oynasida ko‘rinadi.', 'Текст из title видно на вкладке, текст из body — в окне.', 'Text from title shows on the tab, text from body in the window.'),
      L3('Teg nomiga qarang: title bo‘lsa, «Varaq» tugmasini bosing. body bo‘lsa, «Oyna» tugmasini bosing.', 'Прочитай имя тега: title — жми «Вкладка», body — жми «Окно».', 'Read the tag name: for title tap “Tab”, for body tap “Window”.')],
    done: L3('Ajoyib! Endi bilasiz: title ichidagi matn brauzer varag‘ida, body ichidagi matn esa brauzer oynasida ko‘rinadi.',
      'Отличная игра! Текст из title — на вкладке, текст из body — в окне.',
      'Great game! Text from title goes on the tab, text from body in the window.')
  },
  s9: {
    eyebrow: L3('body qismi', 'Часть body', 'The body part'),
    say: L3('Sahifangizning nomi tayyor! Endi uning ichini to‘ldiramiz. html ichidagi ikkinchi asosiy qism — body. Ingliz tilida body «tana» degani. Odamchaning tanasiga qarang: undan nimalar chiqarkin?',
      'Название готово. Теперь заполним саму страницу! Вторая часть внутри html — body, как тело человечка. Смотри, что из него вылетит!',
      'The name is ready. Now let’s fill the page itself! The second part inside html is body, like the buddy’s body. Watch what comes out of it!'),
    out: L3('Mana! Matn, rasm va tugma odamchaning tanasidan uchib chiqib, sahifada paydo bo‘ldi.',
      'Вот это да! Текст, картинка и кнопка вылетели из тела в окно.',
      'How about that! The text, the picture and the button flew from the body into the window.'),
    done: L3('Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar body qismida joylashadi.',
      'Текст, картинки и кнопки, которые видны на странице, располагаются внутри body.',
      'The text, pictures and buttons you see on the page go inside body.'),
    ask: L3('Qarang: odamchaning tanasi', 'Смотри: тело человечка', 'Watch: the buddy’s body')
  },
  s10: {
    eyebrow: L3('Oynadagi salom', 'Привет в окне', 'Hello in the window'),
    // Сначала поле в коде (оно мигает), потом окно с результатом (заказчик, 27.10.2026).
    say: L3('Endi ochuvchi va yopuvchi body teglari orasidagi bo‘sh joyga salomlashish matnini yozing. Masalan, «Salom!».',
      'Теперь напиши приветствие в пустом поле между тегами body. Например, «Привет!».',
      'Now type a greeting in the empty field between the body tags. For example, “Hello!”.'),
    sayWin: L3('Yozgan matningiz darhol sahifada paydo bo‘ladi. So‘ng «Tayyor» tugmasini bosing.',
      'Текст появится в окне. Потом нажми «Готово».',
      'The text will appear in the window. Then tap “Done”.'),
    ok: L3('Ajoyib! Siz yozgan salomlashish matni endi sahifada ko‘rinib turibdi.',
      'Отлично! Твоё приветствие уже в окне.',
      'Great! Your greeting is in the window.'),
    hints: [L3('Kodga qarang: body teglari orasidagi bo‘sh joyni toping.',
      'Посмотри на код: между тегами body есть пустое поле.',
      'Look at the code: there’s an empty field between the body tags.'),
      L3('Salomlashish matni ochuvchi va yopuvchi body teglari orasiga yoziladi.', 'Текст пишут между двумя тегами body.', 'The text goes between the two body tags.'),
      L3('body teglari orasidagi bo‘sh joyni bosing va «Salom!» deb yozing. So‘ng «Tayyor» tugmasini bosing.',
      'Нажми пустое поле между тегами body, напиши текст и нажми «Готово».',
      'Tap the empty field between the body tags, type your text and tap “Done”.')],
    noTags: L3('Bu yerga faqat matn yozing. Burchakli qavslar kerak emas.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
    ask: L3('body teglari orasiga salom yozing va «Tayyor»ni bosing', 'Напиши приветствие между тегами body и нажми «Готово»', 'Type a greeting between the body tags and tap “Done”')
  },
  s11: {
    eyebrow: L3('Bo‘laklarni joylang', 'Разложи вырезки', 'Sort the cut-outs'),
    say: L3('Keling, har bir bo‘lakni o‘z joyiga qo‘yamiz! Uning joyi qayerda: head qismidami yoki body qismidami? Bo‘lakni kerakli qismga suring. Yoki avval bo‘lakni, keyin kerakli qismni bosing.',
      'Наведём порядок! Где живёт каждая вырезка: в head или в body? Перетащи её или нажми вырезку, а потом часть.',
      'Let’s tidy up! Where does each cut-out live: in head or in body? Drag it, or tap a cut-out, then a part.'),
    items: [
      { id: 'name', want: 'head', why: L3('Qarang, bu — title qatori. title head ichida joylashadi. Bu bo‘lakni head qismiga qo‘ying.',
      'Смотри: это строка title. title стоит внутри head, поэтому её место в head.',
      'Look: this is the title line. title sits inside head, so it belongs in head.') },
      { id: 'hello', want: 'body', why: L3('Bu matn sahifada ko‘rinishi kerak. Shuning uchun uni body qismiga qo‘ying.',
      'Почти! Этот текст должен быть виден в окне, значит, он в body.',
      'Almost! This text should show in the window, so it goes in body.') },
      { id: 'pic', want: 'body', why: L3('Rasm ham sahifada ko‘rinadi. Shuning uchun uning joyi body qismida.',
      'Ничего! Картинку мы видим в окне, значит, она в body.',
      'No worries! We see the picture in the window, so it goes in body.') },
      { id: 'btn', want: 'body', why: L3('«O‘ynash» tugmasi sahifada ko‘rinishi kerak. Demak, uning joyi ham body qismida.',
      'Подумай: где мы нажимаем кнопку? В окне! Значит, она в body.',
      'Think: where do we press the button? In the window! So it goes in body.') }
    ],
    ok: L3('Ajoyib, hammasi o‘z joyida! title head ichida, matn, rasm va tugma esa body ichida.',
      'Порядок! title — в head, текст, картинка и кнопка — в body.',
      'All sorted! title is in head; the text, the picture and the button are in body.'),
    pickFirst: L3('Avval bo‘lakni tanlang.', 'Сначала выбери вырезку.', 'Pick a cut-out first.'),
    hints: [L3('O‘ylab ko‘ring: bu bo‘lakdagi narsa sahifada ko‘rinadimi yoki brauzer varag‘idami?', 'Эту вещь видно в окне браузера?', 'Can you see this in the browser window?'),
      L3('Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar body qismida joylashadi. title esa head ichida bo‘ladi.',
      'Текст, картинки и кнопки страницы — в body. Строка title — в head.',
      'The page’s text, pictures and buttons go in body. The title line goes in head.'),
      L3('Ajratib ko‘rsatilgan bo‘lakni ajratib ko‘rsatilgan joyga suring.', 'Перетащи светящуюся вырезку в светящееся место.', 'Drag the glowing cut-out to the glowing place.')],
    ask: L3('Bo‘lakni head yoki body qismiga suring', 'Перетащи вырезку в head или в body', 'Drag a cut-out into head or body'),
    askPlace: L3('Endi head yoki body qismini bosing', 'Теперь нажми head или body', 'Now tap head or body')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Endi sahifangizning to‘liq kodini ko‘rib chiqamiz. Brauzer kodni yuqoridan pastga o‘qib, sahifani yaratadi. Qanday o‘qishini kuzating!',
      'Теперь посмотрим весь код целиком. Как работает браузер? Читает код сверху вниз и собирает страницу. Смотри!',
      'Now let’s see all the code. How does the browser work? It reads the code from top to bottom and builds the page. Watch!'),
    // Коди сам проходит по частям (тексты — в parts); между title и body — когда закрывается head.
    order5: L3('Bu joyga e’tibor bering: avval head qismi yopiladi, keyin body qismi ochiladi.',
      'Внимание, важный момент: сначала закрываем head, потом открываем body.',
      'Here’s an important bit: first head closes, then body opens.'),
    askDone: L3('html ichida: avval head (unda title), keyin body (unda matn)',
      'В html: сначала head с title, потом body с текстом',
      'In html: first head with title, then body with the text'),
    ask: L3('Brauzer qanday o‘qishini kuzating', 'Смотри, как читает браузер', 'Watch how the browser reads'),
    // После показа ученик сам нажимает строку кода или часть страницы справа — Коди объясняет эту часть.
    tapSay: L3('Biror qism haqidagi tushuntirishni yana eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi mos qismni bosing. Men yana tushuntirib beraman.',
      'Хочешь услышать какую-то часть ещё раз? Нажми строку кода или часть справа, и я расскажу.',
      'Want to hear a part again? Tap a code line or a part on the right, and I’ll tell you.'),
    askTap: L3('Qatorni yoki qismni bossangiz, Kodi yana aytadi', 'Нажми строку или часть — Коди повторит', 'Tap a line or a part to hear it again'),
    parts: {
      // DOCTYPE — особая первая строка, не парный тег.
      doc: L3('Birinchi qatorda doctype html deb yozilgan. Bu — maxsus ko‘rsatma. U brauzerga: «Bu HTML hujjati», deb bildiradi. Unga yopuvchi teg kerak emas.',
      'Первая строка <!DOCTYPE html> — особая. Она говорит браузеру: «Это HTML-страница». Пары у неё нет.',
      'The first line, <!DOCTYPE html>, is special. It tells the browser: “This is an HTML page.” It has no pair.'),
      html: L3('Ochuvchi va yopuvchi html teglari orasida sahifaning barcha mazmuni joylashadi. head va body qismlari ham shu yerda.',
      'Тег html обнимает всю страницу: внутри него head и body.',
      'The html tag hugs the whole page: head and body are inside it.'),
      head: L3('Mana, head — sahifaning «boshi». Bu qismda sahifa haqidagi ma’lumotlar saqlanadi.',
      'А вот head, «голова» страницы. В ней сведения о странице.',
      'Here’s head, the page’s “head”. It holds information about the page.'),
      title: L3('head ichida title joylashadi. Ochuvchi va yopuvchi title teglari orasiga sahifaning nomi yoziladi. Brauzer bu nomni brauzer varag‘ida ko‘rsatadi.',
      'Внутри head — title. В нём пишут название страницы, браузер показывает это название на вкладке.',
      'Inside head is title. Inside it goes the page name, and the browser shows that name on the tab.'),
      body: L3('Mana, body — sahifaning «tanasi». Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar shu qismda joylashadi.',
      'А вот body, «тело» страницы. В нём текст, картинки и кнопки, которые видны на странице.',
      'And here’s body, the page’s “body”. It holds the text, pictures and buttons you see on the page.'),
      text: L3('Mana, siz yozgan matn! U body ichida yozilgani uchun sahifada ko‘rinadi.',
      'А вот и твой текст! Он внутри body, поэтому в окне.',
      'And here’s your text! It’s inside body, so it’s in the window.')
    }
  },
  s13: {
    eyebrow: L3('Sahifa tuzilishini yig‘ing', 'Собери основу страницы', 'Build the page structure'),
    say: L3('Endi sahifangizning to‘liq kodini o‘zingiz yig‘ing! Birinchi qator allaqachon joyida. O‘ngdagi bo‘laklardan birini bosing — u navbatdagi bo‘sh qatorga joylashadi.',
      'А теперь главное испытание: собери весь код! Первая строка уже стоит. Нажми полоску — она встанет в следующую пустую строку.',
      'Now the big challenge: build the whole code! The first line is in place. Tap a strip, and it goes into the next empty line.'),
    // Звучит один раз — после первой поставленной полоски; стрелки ▲ ▼ в это время мигают.
    sayMove: L3('Tartibni o‘zgartirish uchun bo‘lakni yuqoriga yoki pastga yo‘nalgan strelkalar yordamida suring. Barcha qatorlarni joyiga qo‘ygach, «Tekshirish» tugmasini bosing.',
      'Если нужно изменить порядок, сдвинь полоску стрелками вверх или вниз. Когда всё на местах, нажми «Проверить».',
      'If you need to change the order, move a strip up or down with the arrows. When everything’s in place, tap “Check”.'),
    rules: {
      html: L3('doctype qatoridan so‘ng darhol ochuvchi html tegini qo‘ying. Yopuvchi html tegi esa eng oxirida bo‘lishi kerak.',
      'После строки DOCTYPE поставь открывающий тег html. Закрывающий — в самом конце.',
      'Put the opening html tag right after the DOCTYPE line. The closing one goes at the very end.'),
      pair: L3('Avval ochuvchi teg, undan keyin unga mos yopuvchi teg kelishi kerak.',
      'Закрывающий тег стоит после своего открывающего.',
      'A closing tag comes after its opening tag.'),
      order: L3('Avval head qismi, keyin body qismi keladi.', 'Сначала идёт head, потом body.', 'head comes first, then body.'),
      headClose: L3('Avval head qismini yoping, keyin body qismini oching.', 'head нужно закрыть до того, как начнётся body.', 'Close head before body starts.'),
      title: L3('title qatorini ochuvchi va yopuvchi head teglari orasiga qo‘ying.', 'title стоит внутри head.', 'title goes inside head.'),
      text: L3('Siz yozgan matnni ochuvchi va yopuvchi body teglari orasiga qo‘ying.', 'Текст страницы стоит внутри body.', 'The page text goes inside body.')
    },
    hints: [L3('doctype qatoridan keyin qaysi teg keladi? Eng oxirida-chi?',
      'Какой тег стоит сразу после DOCTYPE, а какой — в самом конце?',
      'Which tag comes right after DOCTYPE, and which one goes at the very end?'),
      L3('html ichida avval head, keyin body joylashadi. title qatori head ichida, siz yozgan matn esa body ichida bo‘ladi.',
      'Внутри html сначала head с title, потом body с текстом.',
      'Inside html: first head with title, then body with the text.'),
      L3('Belgilangan bo‘laklardan birini, keyin ikkinchisini bosing. Ular o‘rin almashadi.',
      'Нажми одну отмеченную полоску, потом другую — они поменяются местами.',
      'Tap one marked strip, then the other: they swap places.')],
    ok: L3('Qoyil, kodni to‘g‘ri yig‘dingiz! Sahifaning nomi title teglari orasida, title esa head ichida. Siz yozgan matn body ichida.',
      'Вот это да, код собран верно! Название — в head, текст — в body.',
      'Look at that, the code is right! The page name is in head, the text is in body.'),
    ask: L3('Qatorlarni tartib bilan qo‘ying', 'Расставь полоски по порядку', 'Put the strips in order'),
    // Все места заняты — что дальше (заказчик, 29.10.2026: ученик не понимал, что нажать «Проверить»).
    sayCheck: L3('Hamma qatorlar joyida! Endi «Tekshirish» tugmasini bosing, kod to‘g‘ri yig‘ilganini bilib olamiz.',
      'Все полоски на местах! Теперь нажми «Проверить» — узнаем, верно ли собран код.',
      'All the strips are in place! Now tap “Check” to see if the code is right.'),
    askCheck: L3('Hamma qatorlar joyida — «Tekshirish»ni bosing', 'Все полоски на местах — нажми «Проверить»', 'All strips are in place — tap “Check”'),
    // После неверной проверки — чем исправлять: стрелками ▲ ▼ (заказчик, 29.10.2026).
    sayFix: L3('Belgilangan qatorlarni strelkalar bilan yuqoriga yoki pastga suring, keyin yana «Tekshirish»ni bosing.',
      'Сдвинь отмеченные полоски стрелками вверх или вниз и снова нажми «Проверить».',
      'Move the marked strips up or down with the arrows, then tap “Check” again.'),
    askFix: L3('Belgilangan qatorlarni ▲ ▼ strelkalar bilan suring va yana «Tekshirish»ni bosing', 'Сдвинь отмеченные полоски стрелками ▲ ▼ и снова нажми «Проверить»', 'Move the marked strips with the ▲ ▼ arrows and tap “Check” again'),
    moveTip: L3('qatorni yuqoriga yoki pastga surish', 'сдвинуть полоску вверх или вниз', 'move a strip up or down'),
    fixTip: L3('belgilangan qatorlarni suring va yana «Tekshirish»ni bosing', 'сдвинь отмеченные полоски и снова нажми «Проверить»', 'move the marked strips, then tap “Check” again')
  },
  s14: {
    eyebrow: L3('Matn brauzer varag‘iga tushib qoldi', 'Текст попал на вкладку', 'Text on the tab'),
    say: L3('Qarang, nimadir noto‘g‘ri! Sahifaning barcha matni brauzer varag‘ida paydo bo‘ldi, oyna esa bo‘sh qoldi. title qatorida bitta teg yetishmayapti.',
      'Ну и дела! На вкладку уехал весь текст страницы, а окно пустое. В строке title не хватает одного тега.',
      'Something broke! All the page text went to the tab, and the window is empty. One tag is missing in the title line.'),
    sayHow: L3('Keling, xatoni tuzatamiz! Kerakli tegni bo‘sh joyga suring yoki tegning o‘zini bosing.',
      'Починим? Перетащи нужный тег в пустое место или просто нажми его.',
      'Shall we fix it? Drag the right tag into the empty spot, or just tap it.'),
    opts: ['</title>', '<title>', '</head>'],
    why: {
      '<title>': L3('Bu — ochuvchi teg. title allaqachon ochilgan. Endi uni yopish kerak.',
      'Почти! Это открывающий тег, а title уже открыт. Теперь его нужно закрыть.',
      'Almost! That’s an opening tag, and title is already open. Now it needs to close.'),
      '</head>': L3('Bu teg head qismini yopadi. Avval title qismini yopish kerak, keyin head yopiladi.',
      'Не спеши! head закроется позже. Сначала должно закончиться название, поэтому закрой title.',
      'Not so fast! head closes later. First the page name has to end, so close title.')
    },
    hints: [L3('Kodga qarang: qaysi teg ochilgan, lekin hali yopilmagan?', 'Какой тег открыт, но не закрыт?', 'Which tag is open but not closed?'),
      L3('title ochilgan, lekin yopilmagan. Uni yopish uchun qaysi teg kerak?', 'title открыт. Нужен тег, который его закрывает.', 'title is open. You need the tag that closes it.'),
      L3('Qiya chiziqli yopuvchi title tegini bo‘sh joyga qo‘ying.', 'Поставь в пустое место тег title с косой чертой.', 'Put the title tag with a slash into the empty spot.')],
    ok: L3('Ajoyib, xato tuzatildi! Endi sahifaning nomi brauzer varag‘ida, salomlashish matni esa oynada. Yopuvchi title tegi nom qayerda tugashini bildirdi.',
      'Починили! Название на вкладке, текст в окне. Закрывающий тег title показал, где кончается название.',
      'Fixed it! The name is on the tab, the text is in the window. The closing title tag showed where the name ends.'),
    ask: L3('Yetishmayotgan tegni bo‘sh joyga suring', 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty place')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новый пример без подсказки до первой попытки.
  q1: {
    eyebrow: L3('Varaq va oyna', 'Вкладка и окно', 'Tab and window'),
    say: L3('Endi o‘zingizni sinab ko‘ring! Yangi sahifada «Robotlar» brauzer varag‘ida, «Salom!» esa oynada ko‘rinishi kerak. Har bir matnni koddagi kerakli joyga suring. Yoki avval matnni, keyin uning joyini bosing.',
      'Теперь проверь себя! Новая страница: на вкладке должно быть «Роботы», в окне — «Привет!». Перетащи каждую фразу на её место в коде. Или нажми фразу, потом место.',
      'Now test yourself! A new page: the tab should say “Robots”, the window “Hello!”. Drag each phrase to its place in the code. Or tap a phrase, then the place.'),
    tabWord: L3('Robotlar', 'Роботы', 'Robots'),
    winWord: L3('Salom!', 'Привет!', 'Hello!'),
    toWin: L3('Qarang, «{w}» oynada paydo bo‘ldi. Chunki body ichidagi matn oynada ko‘rinadi. Uni brauzer varag‘ida ko‘rsatish uchun title teglari orasiga qo‘yish kerak.',
      'Смотри: «{w}» попало в окно. Текст из body виден в окне, а для вкладки нужен title.',
      'Look: “{w}” landed in the window. Text in body shows in the window, and the tab needs title.'),
    toTab: L3('Qarang, «{w}» brauzer varag‘ida paydo bo‘ldi. Chunki title ichidagi matn varaqda ko‘rinadi. Uni oynada ko‘rsatish uchun body teglari orasiga qo‘yish kerak.',
      'Смотри: «{w}» попало на вкладку. Текст из title виден на вкладке, а для окна нужен body.',
      'Look: “{w}” landed on the tab. Text in title shows on the tab, and the window needs body.'),
    hints: [L3('Brauzer varag‘ida ko‘rinadigan matn qaysi teglar orasiga yoziladi?', 'В каком теге текст для вкладки?', 'Which tag holds the text for the tab?'),
      L3('Brauzer varag‘idagi nom title teglari orasiga, oynadagi matn esa body teglari orasiga yoziladi.', 'Для вкладки — title, для окна — body.', 'For the tab: title. For the window: body.'),
      L3('Ajratib ko‘rsatilgan matnni ajratib ko‘rsatilgan joyga suring.', 'Перетащи светящуюся фразу в светящееся место.', 'Drag the glowing phrase to the glowing place.')],
    ok: L3('Ajoyib! «Robotlar» title ichida, shuning uchun brauzer varag‘ida ko‘rinadi. «Salom!» esa body ichida, shuning uchun oynada ko‘rinadi.',
      'Идеально! «Роботы» в title — поэтому на вкладке. «Привет!» в body — поэтому в окне.',
      'Perfect! “Robots” is in title, so it’s on the tab. “Hello!” is in body, so it’s in the window.'),
    pickFirst: L3('Avval matnni tanlang.', 'Сначала выбери фразу.', 'Pick a phrase first.'),
    ask: L3('Har bir matnni o‘z joyiga suring', 'Перетащи каждую фразу на её место', 'Drag each phrase into its place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  q2: {
    eyebrow: L3('Nega </title> kerak?', 'Зачем нужен </title>?', 'Why </title>?'),
    say: L3('Endi oxirgi savol! Yopuvchi title tegi nima uchun kerak? To‘g‘ri javobni tanlang.',
      'И последний вопрос. Как думаешь, зачем нужен закрывающий тег title? Нажми ответ.',
      'And the last question. What do you think: why do we need the closing title tag? Tap an answer.'),
    // Верный ответ не первый; неверные выключаются после попытки, с объяснением.
    opts: [
      { id: 'win', t: L3('Sahifa nomini brauzer oynasida ko‘rsatadi', 'Показывает название в окне', 'It shows the name in the window'),
        why: L3('Yana o‘ylab ko‘ring: sahifaning nomi oynada emas, brauzer varag‘ida ko‘rinadi. Yopuvchi title tegi esa nom qayerda tugashini bildiradi.',
      'Не совсем: закрывающий тег на странице не виден и название в окно не выводит.',
      'Not quite: a closing tag doesn’t show on the page and doesn’t put the name in the window.') },
      { id: 'end', right: true, t: L3('Sahifa nomi qayerda tugashini bildiradi', 'Показывает, где заканчивается название страницы', 'It shows where the page name ends') },
      { id: 'new', t: L3('Yangi sahifani boshlaydi', 'Начинает новую страницу', 'It starts a new page'),
        why: L3('Yana o‘ylab ko‘ring: bu teg yangi sahifani boshlamaydi. U sahifa nomi qayerda tugashini bildiradi.',
      'Не совсем: этот тег не начинает новую страницу. Он показывает, где заканчивается название.',
      'Not quite: this tag doesn’t start a new page. It shows where the name ends.') }
    ],
    hints: [L3('Sahifa matni brauzer varag‘ida paydo bo‘lgan misolni eslang. O‘shanda qaysi teg yetishmayotgan edi?',
      'Вспомни страницу, где текст попал на вкладку. Какого тега там не хватало?',
      'Remember the page where the text ended up on the tab. Which tag was missing there?'),
      L3('Ochuvchi teg boshlanishni, yopuvchi teg esa tugashni bildiradi. title teglari orasiga nima yoziladi?', 'Тег с косой чертой заканчивает часть. Что стоит внутри title?', 'A tag with a slash ends a part. What’s inside title?'),
      L3('Yopuvchi title tegi sahifa nomi qayerda tugashini bildiradi.', 'Закрывающий тег title заканчивает название страницы.', 'The closing title tag ends the page name.')],
    ok: L3('To‘g‘ri! Yopuvchi title tegi brauzerga sahifa nomi qayerda tugashini bildiradi. Usiz sahifaning qolgan matni ham brauzer varag‘ida paydo bo‘lishi mumkin.',
      'Точно! Он показывает, где кончается название. Без него текст страницы уезжает на вкладку.',
      'Exactly! It shows where the name ends. Without it, the page text ends up on the tab.'),
    ask: L3('Javobni tanlang', 'Выбери ответ', 'Pick an answer')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Mana, siz yaratgan birinchi sahifa!',
      'Вот она, твоя первая страница!',
      'Here it is, your very first page!'), k: null },
      { text: L3('Esingizdami? Teg nomi burchakli qavslar orasiga yoziladi. Brauzer tegni o‘qiydi, lekin uni sahifada ko‘rsatmaydi.',
      'Помнишь? Тег — слово в угловых скобках. Браузер его не показывает, а читает.',
      'Remember? A tag is a word in angle brackets. The browser doesn’t show it, it reads it.'), k: null },
      { text: L3('html ichida sahifaning ikkita asosiy qismi joylashadi: head va body.',
      'Всю страницу собирает html: и head, и body — внутри него.',
      'html holds the whole page: both head and body are inside it.'), k: 'html' },
      { text: L3('head qismida sahifa haqidagi ma’lumotlar saqlanadi.',
      'head хранит сведения о странице.',
      'head keeps information about the page.'), k: 'head' },
      { text: L3('title head ichida joylashadi. title teglari orasiga sahifaning nomi yoziladi. Brauzer bu nomni brauzer varag‘ida ko‘rsatadi.',
      'title стоит внутри head. В нём пишут название страницы, браузер показывает это название на вкладке.',
      'title is inside head. Inside it goes the page name, and the browser shows that name on the tab.'), k: 'title' },
      { text: L3('Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar body qismida joylashadi.',
      'Текст, картинки и кнопки, которые видны на странице, располагаются внутри body.',
      'The text, pictures and buttons you see on the page go inside body.'), k: 'body' },
      { text: L3('Tabriklayman! Birinchi HTML sahifangizni yaratdingiz! Keyingi darsda sahifangizga katta sarlavha va matn uchun abzatslar qo‘shamiz.',
      'Ура! Твоя первая HTML-страница готова. Ты на шаг ближе к настоящему веб-программисту!',
      'Hooray! Your first HTML page is ready. You’re one step closer to being a real web developer!'), k: null }
    ],
    roles: {
      html: L3('html — hamma qismlarni o‘z ichiga oladi', 'html — объединяет все части страницы', 'html — holds all the parts of the page'),
      head: L3('head — sahifa haqida ma’lumot', 'head — сведения о странице', 'head — information about the page'),
      title: L3('title — sahifa nomi', 'title — название страницы', 'title — the page name'),
      body: L3('body — matn, rasm, tugmalar', 'body — текст, картинки, кнопки', 'body — text, pictures, buttons')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { br: 1, nm: 1, inHead: 1, sayWin: 1, pair: 1, read1: 1, read2: 1, read3: 1, magic: 1, magicHead: 1, magicWin: 1, sayTab: 1, sayGo: 1, sayInfo: 1, sayTag: 1, sayHow: 1, sayMove: 1, why: 1, opts: 1, rules: 1, miss: 1, askTitle: 1, askBody: 1, toWin: 1, toTab: 1, tapSay: 1, parts: 1, order5: 1, top: 1, bottom: 1, msgs: 1, opened: 1, flew: 1, out: 1, back: 1, items: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { id: 1, want: 1 }, opts: { t: 1, id: 1, right: 1 } });

/*@FILE:kollazh-paper-data.jsx@*/

/*@FILE:kollazh-paper.jsx@*/

/*@FILE:kollazh-kit.jsx@*/

/*@FILE:kollazh-trans.jsx@*/

/*@FILE:kollazh-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:kollazh.css@*/
/* Урок 1 (заказчик, 27.10.2026: «окно браузера маленькое»): на ноутбуке браузер на
   экранах 6–10, 14 и 15 крупнее — место вокруг было пустым; текст в окне крупнее вместе
   с ним. Только в уроке 1 — общий kollazh.css (уроки 2–5, практики) не трогается. */
@media (min-width: 760px) {
  .kz-sheet .kz-s6 > .kz-col > .kz-br, .kz-sheet .kz-s9 > .kz-col > .kz-br { --brh: 40dvh; }
  .kz-sheet .kz-scene-col > .kz-col > .kz-br:not(.is-short) { --brh: 40dvh; }
  .kz-sheet .kz-scene-col > .kz-col > .kz-br.is-short { --brh: 34dvh; }
  .kz-sheet .kz-s14 > .kz-col > .kz-br, .kz-sheet .kz-q1 > .kz-col > .kz-br { --brh: 46dvh; }
  .kz-s6 .kz-br-page, .kz-s9 .kz-br-page, .kz-scene-col .kz-br-page, .kz-s14 .kz-br-page, .kz-q1 .kz-br-page { font-size: clamp(14px, 2.9dvh, 26px); }
}
`;
