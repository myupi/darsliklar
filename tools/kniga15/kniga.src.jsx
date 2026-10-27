// =============================================================================
// ТЕСТОВЫЙ УРОК 15 — урок 1 «Структура HTML-документа» (версия 23.10.2026) в стиле
// «книжка с картинками» (заказчик, 27.10.2026, по референсам детской книжки): тёплое
// небо, слои мягких силуэтов по краям, нарисованные формы с зерном кисти, сказочный
// шрифт, плавное движение с пружинкой, переход — проезд камеры по миру
// (или акварельная заливка — KB_TRANS в kniga-trans.jsx). Содержание
// и механики — как в уроке 1 той версии. Дети 10–14, проходят сами.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/kniga15/kniga.src.jsx lessons/test/15-bumazhnaya-stranitsa.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ТЕСТОВЫЙ УРОК 15 · «Книжная страница» · модуль html-m1-osnovy =====
// Стиль книжки — kniga.css (блок «КНИЖКА С КАРТИНКАМИ»), kniga-kit.jsx (Sheet, Cut),
// kniga-trans.jsx (проезд камеры / акварельная заливка). Ниже — замысел урока 1, из которого урок сделан.
//
// ЗАМЫСЕЛ. Стилистика ролика html.mp4 (заказчик, 20.10.2026): бумажный коллаж —
// вырезки из цветной бумаги с рваным краем и фактурой, мягкая тень слой на слой,
// движение вырезками по столу со ступенчатостью stop-motion, шорох бумаги, переход
// между экранами «разбор и сборка». На листе живёт бумажный человечек: голова —
// как часть head, тело — как часть body. Образ — только опора: каждый раз за ним
// Коди называет настоящую связь кода с браузером. В конце ученик собирает свою страницу.
//
// ДУГА. s1 крючок · s2 план · тройки «объяснение → сам делаешь → закрепление»:
// тег (tg1) и html (s3–s5), head и title (s6–s8), body (s9–s11), весь документ
// (s12–s14) · итоговая проверка q1 (вкладка/окно), q2 (зачем </title>) · s15 вывод. Полное описание — docs/urok-01-opisanie.md; правила
// эталона для следующих уроков — навык novyy-urok, references/etalon-bumazhnaya.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь
//     (длинную фразу делим на реплики, чтобы подсветка совпадала со словами).
//   · Конфетти только в финале: похвалы экранов — поза smile.
//   · Честный браузер: текст без тегов — в окно, вкладка index.html; без
//     </title> всё, что дальше, уходит во вкладку.
//
// СИСТЕМА СЛОВ. Тег — слово в угловых скобках, помогает браузеру узнавать части
// страницы (в уроке все теги парные: открывающий и закрывающий); html — объединяет все части страницы (рамка на
// рисунке — только наглядность); head — сведения о странице; title внутри head —
// название страницы на вкладке; body — всё, что видно в окне. UZ: teg, yorliq —
// только вкладка, oyna — окно, sahifa nomi — название. Вкладку и окно Коди
// показывает на s1 до первого использования слов. Голова человечка — образ head
// (сведения о странице), а не название: название — в title внутри head.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'test-15-bumazhnaya-stranitsa',
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
    eyebrow: L3('Kitob sahifa', 'Книжная страница', 'A storybook page'),
    // До превращения Коди по очереди показывает вкладку и окно (подсветка — за речью).
    say: L3('Salom! Men Kodiman. Bu brauzerdagi veb-sahifa.', 'Привет! Я Коди. Это веб-страница в браузере.', 'Hi! I’m Kodi. This is a web page in a browser.'),
    sayTab: L3('Brauzer tepasidagi sahifa nomi yozilgan joyga qarang. Bu — brauzer yorlig‘i.',
      'Посмотри наверх, где написано название страницы. Это вкладка браузера.',
      'Look at the top, where the page name is written. That’s the browser tab.'),
    sayWin: L3('Pastdagi katta joy — oyna. Unda sahifaning o‘zi: matn, rasm va tugma.',
      'Большое место ниже — окно. В нём сама страница: текст, картинка и кнопка.',
      'The big area below is the window. It shows the page itself: text, a picture and a button.'),
    sayGo: L3('Endi «Aylantirish» tugmasini bosing, sizga bir sirni ko‘rsataman.', 'Теперь нажми «Превратить» — покажу секрет.', 'Now tap “Transform”, and I’ll show you a secret.'),
    // После сборки: голова — сведения о странице (название — лишь одно из них), тело — то, что в окне.
    magic: L3('Voy! Sahifa odamchaga aylandi.', 'Ого! Страница превратилась в человечка.', 'Whoa! The page turned into a buddy.'),
    magicHead: L3('Uning boshida sahifa haqidagi ma’lumot saqlanadi. Masalan, yorliqdagi sahifa nomi.',
      'В его голове хранятся сведения о странице. Например, название с вкладки.',
      'His head keeps information about the page. For example, the name from the tab.'),
    magicWin: L3('Tanasida esa oynada ko‘rinadigan hamma narsa: matn, rasm va tugma.',
      'А в теле — всё, что видно в окне: текст, картинка и кнопка.',
      'And his body holds everything you see in the window: text, a picture and a button.'),
    done: L3('Bugun sahifa qanday qismlardan iboratligini bilib olasiz va o‘z sahifangizni yig‘asiz!',
      'Сегодня ты узнаешь, из каких частей состоит страница, и соберёшь свою!',
      'Today you’ll learn what parts a page has and build your own!'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askLook: L3('Yorliq va oynaga qarang', 'Смотри: вкладка и окно', 'Look: the tab and the window'),
    askDone: L3('Boshida — sahifa haqidagi ma’lumot, tanasida — oynadagi narsalar',
      'В голове — сведения о странице, в теле — то, что видно в окне',
      'The head keeps page info, the body holds what’s in the window')
  },
  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Mana bugungi dars rejasi. Unda to‘rtta qadam bor.', 'Вот план урока. В нём четыре шага.', 'Here’s the plan for today. It has four steps.'),
    cards: [
      { title: L3('html tegi', 'Тег html', 'The html tag'),
        say: L3('Avval teg nima ekanini bilib olamiz va html tegi bilan tanishamiz.',
      'Сначала узнаем, что такое тег, и познакомимся с тегом html.',
      'First, we’ll find out what a tag is and meet the html tag.') },
      { title: L3('Sahifa nomi', 'Название страницы', 'The page name'),
        say: L3('Keyin sahifa nomini yozasiz. U brauzer yorlig‘ida ko‘rinadi.',
      'Потом ты напишешь название страницы. Оно появится на вкладке браузера.',
      'Then you’ll write the page name. It will show on the browser tab.') },
      { title: L3('Oynadagi matn', 'Текст в окне', 'Text in the window'),
        say: L3('Uchinchi qadamda brauzer oynasida ko‘rinadigan matnni yozasiz.',
      'Третьим шагом ты напишешь текст, который видно в окне браузера.',
      'In step three, you’ll write the text you see in the browser window.') },
      { title: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
        say: L3('Oxirida esa o‘z sahifangizni to‘liq yig‘asiz!', 'А в конце ты соберёшь свою страницу целиком!', 'And at the end, you’ll build your whole page!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  // «Что такое тег» (заказчик, 23.10.2026): угловые скобки и косая черта — до рамки html; только объяснение.
  tg1: {
    eyebrow: L3('Teg nima?', 'Что такое тег?', 'What is a tag?'),
    say: L3('Qarang: brauzer html so‘zini sahifada oddiy matn qilib ko‘rsatdi. Brauzer uchun bu shunchaki so‘z.',
      'Смотри: слово html браузер показал на странице как обычный текст. Для него это просто слово.',
      'Look: the browser showed the word html on the page as plain text. To the browser, it’s just a word.'),
    askPair: L3('Keling, so‘zni burchakli qavslarga o‘raymiz.', 'Обернём слово в угловые скобки.', 'Let’s wrap the word in angle brackets.'),
    pair: L3('Voy, so‘z sahifadan yo‘qoldi! Burchakli qavslar ichidagi so‘z teg deyiladi. Teg sahifada ko‘rinmaydi: u brauzerga sahifa qismlarini tanishga yordam beradi.',
      'Ого, слово пропало со страницы! Слово в угловых скобках — это тег. На странице тег не виден: он помогает браузеру узнавать части страницы.',
      'Whoa, the word disappeared from the page! A word in angle brackets is a tag. It doesn’t show on the page: it helps the browser recognize the parts of the page.'),
    askSlash: L3('Bu teg qism qayerda boshlanishini ko‘rsatadi. Qayerda tugashini esa qiya chiziqli teg ko‘rsatadi.',
      'Этот тег показывает, где часть начинается. А где она заканчивается, покажет тег с косой чертой.',
      'This tag shows where a part begins. A tag with a slash will show where it ends.'),
    slash: L3('Qiya chiziq birinchi qavsdan keyin turadi: bu yopuvchi teg. Ochuvchi teg boshlaydi, yopuvchi teg tugatadi, matn esa ular orasida.',
      'Косая черта стоит сразу после первой скобки — это закрывающий тег. Открывающий начинает, закрывающий заканчивает, а текст — между ними.',
      'The slash goes right after the first bracket: that’s a closing tag. The opening tag starts, the closing tag ends, and the text goes between them.'),
    done: L3('Bu darsdagi teglar juft: ochuvchi va yopuvchi. Yopuvchi tegda birinchi qavsdan keyin qiya chiziq bor.',
      'В этом уроке теги парные: открывающий и закрывающий. В закрывающем сразу после первой скобки стоит косая черта.',
      'In this lesson, tags come in pairs: an opening one and a closing one. The closing tag has a slash right after the first bracket.'),
    aPair: L3('html so‘ziga qarang', 'Смотри на слово html', 'Watch the word html'),
    aSlash: L3('Qarang: qiya chiziq', 'Смотри: косая черта', 'Watch: the slash'),
    aDone: L3('Teg — burchakli qavslardagi so‘z, yopuvchisida qiya chiziq', 'Тег — слово в угловых скобках, в закрывающем — косая черта', 'A tag is a word in angle brackets; the closing one has a slash'),
    text: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
    open: L3('ochuvchi', 'открывающий', 'opening'),
    close: L3('yopuvchi', 'закрывающий', 'closing')
  },
  s3: {
    eyebrow: L3('html tegi', 'Тег html', 'The html tag'),
    say: L3('Brauzer sahifa qismlarini teglar orqali taniydi.', 'Браузер узнаёт части страницы по тегам.', 'The browser recognizes the parts of a page by their tags.'),
    // Пока звучит определение тега, оба тега на рамке подсвечены.
    sayTag: L3('html tegi butun sahifa qayerda boshlanib, qayerda tugashini ko‘rsatadi.',
      'Тег html показывает, где начинается и где заканчивается вся страница.',
      'The html tag shows where the whole page begins and ends.'),
    top: L3('Bu ochuvchi html tegi. Sahifa shu tegdan boshlanadi.',
      'Это открывающий тег html. С него начинается страница.',
      'This is the opening html tag. The page starts here.'),
    bottom: L3('Bu esa yopuvchi html tegi. So‘z o‘sha, faqat oldida qiya chiziq bor. Hujjat shu yerda tugaydi.',
      'А это закрывающий тег html. Слово то же, но перед ним косая черта. Здесь документ заканчивается.',
      'And this is the closing html tag. Same word, but with a slash before it. The document ends here.'),
    done: L3('Butun sahifa shu ikki teg orasida joylashadi. Ramkani tushunarli bo‘lsin deb chizdik, brauzerda u ko‘rinmaydi.',
      'Вся страница находится между этими двумя тегами. Рамку мы нарисовали для наглядности: в браузере её не видно.',
      'The whole page goes between these two tags. We drew the frame to help you see it. The browser doesn’t show it.'),
    ask: L3('Ramkadagi teglarga qarang', 'Смотри на теги рамки', 'Watch the tags on the frame'),
    askDone: L3('Butun sahifa ikki html tegi orasida', 'Вся страница — между двумя тегами html', 'The whole page is between the two html tags')
  },
  s4: {
    eyebrow: L3('Ramkani yoping', 'Закрой рамку', 'Close the frame'),
    say: L3('Ramkaning pastki cheti yo‘q, ya’ni hujjat yopilmagan. Bo‘sh qatorga yopuvchi html tegini yozing.',
      'У рамки нет нижнего края: документ не закрыт. Напиши в пустую строку закрывающий тег html.',
      'The frame has no bottom edge: the document isn’t closed. Type the closing html tag in the empty line.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda html so‘zidan oldin qiya chiziq turadi.',
      'Это открывающий тег. В закрывающем перед словом html стоит косая черта.',
      'That’s the opening tag. The closing tag has a slash before html.'),
      needLt: L3('Teg burchakli qavs «<» bilan boshlanadi. Uni boshiga qo‘shing.',
      'Тег начинается с угловой скобки «<». Добавь её в начало.',
      'A tag starts with the angle bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida burchakli qavs «>» turadi. Uni oxiriga qo‘shing.',
      'В конце тега нужна угловая скобка «>». Добавь её в конец.',
      'A tag ends with the angle bracket “>”. Add it at the end.'),
      wrongName: L3('Teg ichida boshqa so‘z yozilgan. Bu yerda html kerak.',
      'Внутри тега другое слово. Здесь нужен html.',
      'There’s a different word inside the tag. Here you need html.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.',
      'Косая черта «/» стоит сразу после первой угловой скобки.',
      'The slash “/” goes right after the first angle bracket.')
    },
    hints: [L3('Ramkaning tepasidagi tegga qarang.', 'Посмотри на верхний тег на рамке.', 'Look at the top tag on the frame.'),
      L3('Yopuvchi teg o‘sha so‘z, faqat qiya chiziq bilan.', 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3('Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin html va oxirida yana burchakli qavs.',
      'Начни с угловой скобки, потом поставь косую черту. Дальше html и в конце снова угловая скобка.',
      'Start with the angle bracket, then add the slash. Then html, and another angle bracket at the end.')],
    ok: L3('Ramka yopildi: endi butun sahifa ikki html tegi orasida!',
      'Рамка закрылась: вся страница теперь между двумя тегами html!',
      'The frame is closed: the whole page is now between the two html tags!'),
    ask: L3('Bo‘sh qatorga yopuvchi html tegini yozing', 'Напиши закрывающий тег html в пустую строку', 'Type the closing html tag in the empty line')
  },
  s5: {
    eyebrow: L3('Teglarni joyiga qo‘ying', 'Теги по местам', 'Tags in place'),
    say: L3('Yangi varaq. Ramkaga ikkita teg kerak: biri tepaga, biri pastga. Uchta tegdan bittasi ortiqcha.',
      'Новый лист. Рамке нужны два тега: один сверху, другой снизу. Один тег из трёх лишний.',
      'A new sheet. The frame needs two tags: one at the top and one at the bottom. One of the three tags is extra.'),
    top: L3('Hujjat tepada boshlanadi. Bu yerga qiya chiziqsiz ochuvchi teg kerak.',
      'Сверху документ начинается. Здесь нужен открывающий тег, без косой черты.',
      'The document starts at the top. It needs the opening tag, without a slash.'),
    bottom: L3('Hujjat pastda tugaydi. Bu yerga qiya chiziqli yopuvchi teg kerak.',
      'Снизу документ заканчивается. Здесь нужен закрывающий тег, с косой чертой.',
      'The document ends at the bottom. It needs the closing tag, with a slash.'),
    back: L3('Bu chiziq teskari tomonga qiyshaygan. Yopuvchi tegda u o‘ngga qiyshaygan bo‘ladi: «/».',
      'Эта черта наклонена не в ту сторону. В закрывающем теге она наклонена вправо: «/».',
      'This slash leans the wrong way. In a closing tag it leans right: “/”.'),
    pickFirst: L3('Avval tegni tanlang.', 'Сначала выбери тег.', 'Pick a tag first.'),
    hints: [L3('Qaysi teg hujjatni ochadi, qaysi biri yopadi?', 'Какой тег открывает документ, а какой закрывает?', 'Which tag opens the document, and which one closes it?'),
      L3('Tepaga qiya chiziqsiz teg, pastga qiya chiziqli teg qo‘yiladi.',
      'Сверху — тег без косой черты. Снизу — тег с косой чертой.',
      'Top: the tag without a slash. Bottom: the tag with a slash.'),
      L3('<html> tegini tepadagi joyga torting.', 'Перетащи <html> на верхнее место.', 'Drag <html> to the top place.')],
    ok: L3('Ikkala teg joyida. Teskari chiziqli teg ortiqcha ekan!',
      'Оба тега на месте. Лишним оказался тег с обратной чертой!',
      'Both tags are in place. The one with the backslash was extra!'),
    ask: L3('Tegni joyiga torting', 'Перетащи тег на место', 'Drag a tag into place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  s6: {
    eyebrow: L3('head va title', 'head и title', 'head and title'),
    // Короткими шагами, у каждого — своя подсветка: голова → окно → title → вкладка.
    say: L3('Odamchaning boshi head qismini eslatadi.', 'Голова человечка напоминает часть head.', 'The buddy’s head stands for the head part.'),
    sayInfo: L3('head ichida sahifa haqidagi ma’lumot turadi. Oynada u ko‘rinmaydi. Ichiga qaraymiz.',
      'В head — сведения о странице. В окне их не видно. Заглянем внутрь.',
      'head holds information about the page. You don’t see it in the window. Let’s look inside.'),
    opened: L3('Ichida title tegi bor. Sahifa nomi shu teg ichiga yoziladi.',
      'Внутри — тег title. Название страницы пишут в нём.',
      'Inside is the title tag. The page name is written in it.'),
    flew: L3('title ichidagi nomni brauzer yorliqda ko‘rsatadi.', 'Текст из title браузер показывает на вкладке.', 'The browser shows the text from title on the tab.'),
    done: L3('Demak: head ichida title, title ichida esa sahifa nomi.',
      'Итак: в head — title, а в title — название страницы.',
      'So: title is inside head, and the page name is inside title.'),
    ask: L3('Qarang: odamchaning boshi', 'Смотри: голова человечка', 'Watch: the buddy’s head'),
    askCard: L3('Qarang: title tegi', 'Смотри: тег title', 'Watch: the title tag')
  },
  s7: {
    eyebrow: L3('Yorliqdagi nom', 'Название на вкладке', 'The name on the tab'),
    say: L3('Sahifangizga nom o‘ylab toping. Uni title ichiga yozing: nom darhol yorliqda chiqadi. Keyin «Tayyor» tugmasini bosing.',
      'Придумай название своей страницы. Напиши его внутри title — оно сразу появится на вкладке. Потом нажми «Готово».',
      'Think of a name for your page. Type it inside title: it shows up on the tab right away. Then tap “Done”.'),
    ok: L3('Siz yozgan nom yorliqda paydo bo‘ldi!', 'Твоё название уже на вкладке!', 'Your page name is on the tab now!'),
    hints: [L3('Sahifa nomini qaysi teg belgilaydi?', 'Какой тег задаёт название страницы?', 'Which tag sets the page name?'),
      L3('Sahifa nomi title ichiga yoziladi.', 'Название страницы пишут внутри title.', 'The page name goes inside title.'),
      L3('title ichidagi bo‘sh joyga nom yozing va «Tayyor»ni bosing.',
      'Напиши название в пустом месте внутри title и нажми «Готово».',
      'Type a name in the empty space inside title and tap “Done”.')],
    ask: L3('title ichiga nom yozing va «Tayyor»ni bosing', 'Напиши название в title и нажми «Готово»', 'Type a name in title and tap “Done”')
  },
  s8: {
    eyebrow: L3('Yorliqmi yoki oyna?', 'Вкладка или окно?', 'Tab or window?'),
    say: L3('Hozir yangi kod qatorlari chiqadi. Brauzer har bir so‘zni qayerda ko‘rsatishini o‘ylab ko‘ring.',
      'Сейчас на страницу лягут новые строки кода. Подумай, где браузер покажет каждое слово.',
      'New lines of code are coming. Think about where the browser will show each word.'),
    rounds: [
      { kind: 'title', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'tab' },
      { kind: 'raw', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'win' },
      { kind: 'title', word: L3('Final juma kuni!', 'Финал в пятницу!', 'The final is on Friday!'), extra: L3('Bugun konsert!', 'Сегодня концерт!', 'Concert today!'), want: 'tab' }
    ],
    ok: {
      title: L3('title ichidagi matnni brauzer yorliqda ko‘rsatadi. To‘g‘ri topdingiz.',
      'Текст внутри title браузер показывает на вкладке. Всё верно.',
      'The browser shows text inside title on the tab. You got it.'),
      raw: L3('Bu so‘zda teg yo‘q, shuning uchun brauzer uni oynada ko‘rsatdi. Yorliqda esa hozircha fayl nomi turibdi. To‘g‘ri topdingiz.',
      'У этого слова нет тегов, и браузер показал его в окне. А на вкладке пока имя файла. Всё верно.',
      'This word has no tags, so the browser showed it in the window. The tab still shows the file name. You got it.')
    },
    miss: {
      title: L3('Qarang: title ichidagi matn yorliqqa chiqdi. Uzun gap ham yorliqqa chiqadi. Yana bir misol.',
      'Смотри: текст из title попал на вкладку. Длинная фраза тоже попадёт туда. Давай ещё пример.',
      'Look: the text from title went to the tab. A long phrase goes there too. Let’s try another one.'),
      raw: L3('Qarang: so‘zda teg yo‘q, shuning uchun brauzer uni oynada ko‘rsatdi. Yana bir misol.',
      'Смотри: у слова нет тегов, поэтому браузер показал его в окне. Давай ещё пример.',
      'Look: the word has no tags, so the browser showed it in the window. Let’s try another one.')
    },
    askTitle: L3('title ichida «{w}». U qayerda paydo bo‘ladi?', 'В title — «{w}». Где оно появится?', 'title says “{w}”. Where will it show up?'),
    askRaw: L3('Tegsiz «{w}». U qayerda paydo bo‘ladi?', '«{w}» без тегов. Где оно появится?', '“{w}” with no tags. Where will it show up?'),
    done: L3('Esda tuting: title ichidagi matn yorliqda ko‘rinadi. Bu misollarda tegsiz matn esa oynaga chiqdi.',
      'Запомни: текст из title — на вкладке. А текст без тегов в этих примерах попал в окно.',
      'Remember: text in title shows on the tab. In these examples, text without tags went to the window.')
  },
  s9: {
    eyebrow: L3('body qismi', 'Часть body', 'The body part'),
    say: L3('Odamchaning tanasi body qismini eslatadi. Oynadagi matn, rasm va tugmalar body ichida yoziladi. Qarang.',
      'Тело человечка напоминает часть body. Текст, картинки и кнопки в окне записаны внутри body. Смотри.',
      'The buddy’s body stands for the body part. The text, pictures and buttons in the window are written inside body. Watch.'),
    out: L3('Matn, rasm va tugma oynada paydo bo‘ldi. Bularning hammasi body ichida yozilgan.',
      'Текст, картинка и кнопка появились в окне. Всё это записано внутри body.',
      'The text, the picture and the button appeared in the window. They’re all written inside body.'),
    done: L3('body ichida oynada ko‘rinadigan hamma narsa bor: matn, rasm, tugmalar.',
      'В body — всё, что видно в окне: текст, картинки, кнопки.',
      'body holds everything you see in the window: text, pictures, buttons.'),
    ask: L3('Qarang: odamchaning tanasi', 'Смотри: тело человечка', 'Watch: the buddy’s body')
  },
  s10: {
    eyebrow: L3('Oynadagi salom', 'Привет в окне', 'Hello in the window'),
    say: L3('body ichiga mehmonlar uchun salomlashuv yozing: u darhol oynada chiqadi. Keyin «Tayyor» tugmasini bosing.',
      'Напиши приветствие для гостей внутри body — оно сразу появится в окне. Потом нажми «Готово».',
      'Type a greeting for your visitors inside body: it shows up in the window right away. Then tap “Done”.'),
    ok: L3('Siz yozgan matn oynada ko‘rinyapti!', 'Твой текст уже виден в окне!', 'Your text is showing in the window!'),
    hints: [L3('Oynada ko‘rinadigan matn qaysi teg ichiga yoziladi?', 'В каком теге пишут текст, который видно в окне?', 'Which tag holds the text you see in the window?'),
      L3('Oynadagi matn body ichiga yoziladi.', 'Текст для окна пишут внутри body.', 'Text for the window goes inside body.'),
      L3('body ichidagi bo‘sh joyga matn yozing va «Tayyor»ni bosing.', 'Напиши текст в пустом месте внутри body и нажми «Готово».', 'Type your text in the empty space inside body and tap “Done”.')],
    ask: L3('body ichiga salom yozing va «Tayyor»ni bosing', 'Напиши приветствие в body и нажми «Готово»', 'Type a greeting in body and tap “Done”')
  },
  s11: {
    eyebrow: L3('Bo‘laklarni joylang', 'Разложи карточки', 'Sort the cards'),
    say: L3('Har bir bo‘lak qayerga tegishli: head ichigami yoki body ichigami? Ularni joyiga torting.',
      'Куда положить каждую карточку: в head или в body? Перетащи их по местам.',
      'Where does each card go: into head or into body? Drag them into place.'),
    items: [
      { id: 'name', want: 'head', why: L3('Bu title tegidagi sahifa nomi. U oynada emas, yorliqda ko‘rinadi. Shuning uchun u head ichida bo‘ladi.',
      'Это название страницы в теге title. Его видно на вкладке, а не в окне. Поэтому оно в head.',
      'This is the page name in a title tag. It shows on the tab, not in the window. So it goes in head.') },
      { id: 'hello', want: 'body', why: L3('Bu matn oynada ko‘rinishi kerak. Demak, uning joyi body ichida.',
      'Этот текст должен быть виден в окне. Значит, его место в body.',
      'This text should be visible in the window. So it belongs in body.') },
      { id: 'pic', want: 'body', why: L3('Rasm oynada ko‘rinadi. Demak, u body ichida.', 'Картинку видно в окне. Значит, она в body.', 'You see the picture in the window. So it goes in body.') },
      { id: 'btn', want: 'body', why: L3('Tugmani oynada bosamiz. Demak, u body ichida.', 'Кнопку нажимают в окне. Значит, она в body.', 'You press the button in the window. So it goes in body.') }
    ],
    ok: L3('Hammasi joyida: sahifa nomi head ichida, oynada ko‘rinadigan hamma narsa body ichida!',
      'Всё на местах: название в head, а всё, что видно в окне, в body!',
      'Everything’s in place: the page name in head, everything visible in body!'),
    pickFirst: L3('Avval bo‘lakni tanlang.', 'Сначала выбери карточку.', 'Pick a card first.'),
    hints: [L3('Bu narsa brauzer oynasida ko‘rinadimi?', 'Эту вещь видно в окне браузера?', 'Can you see this in the browser window?'),
      L3('Oynada ko‘rinadigan hamma narsa body ichida. Sahifa nomi head ichida.',
      'Всё, что видно в окне, находится в body. Название страницы — в head.',
      'Everything you see in the window goes in body. The page name goes in head.'),
      L3('Yonib turgan bo‘lakni yonib turgan joyga torting.', 'Перетащи светящуюся карточку в светящееся место.', 'Drag the glowing card to the glowing place.')],
    ask: L3('Bo‘lakni head yoki body ichiga torting', 'Перетащи карточку в head или в body', 'Drag a card into head or body'),
    askPlace: L3('Endi head yoki body qismini bosing', 'Теперь нажми head или body', 'Now tap head or body')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Brauzer kodni yuqoridan pastga o‘qiydi va sahifani bo‘lakma-bo‘lak yig‘adi. Kuzating.',
      'Браузер читает код сверху вниз и по кусочкам собирает страницу. Смотри.',
      'The browser reads code from top to bottom and builds the page piece by piece. Watch.'),
    // Коди сам проходит по частям (тексты — в parts); между title и body — когда закрывается head.
    order5: L3('Avval head qismini yopamiz. Keyin body qismini ochamiz.', 'Сначала закрываем head. Потом открываем body.', 'First we close head. Then we open body.'),
    askDone: L3('html ichida: avval head (unda title), keyin body (unda matn)',
      'В html: сначала head (в нём title), потом body (в нём текст)',
      'In html: first head (with title), then body (with the text)'),
    ask: L3('Brauzer qanday o‘qishini kuzating', 'Смотри, как читает браузер', 'Watch how the browser reads'),
    // После показа ученик сам нажимает строку кода или часть страницы справа — Коди объясняет эту часть.
    tapSay: L3('Yana eshitmoqchi bo‘lsangiz, kod qatorini yoki o‘ngdagi qismni bosing.',
      'Хочешь послушать ещё раз — нажми строку кода или часть страницы справа.',
      'Want to hear it again? Tap a code line or a part on the right.'),
    askTap: L3('Qatorni yoki qismni bossangiz, Kodi yana aytadi', 'Нажми строку или часть — Коди повторит', 'Tap a line or a part to hear it again'),
    parts: {
      doc: L3('Bu birinchi qator — <!DOCTYPE html>. U brauzerga sahifani zamonaviy HTML qoidalari bo‘yicha ko‘rsatishni aytadi.',
        'Это первая строка — <!DOCTYPE html>. Она говорит браузеру показывать страницу по современным правилам HTML.',
        'This is the first line, <!DOCTYPE html>. It tells the browser to show the page by modern HTML rules.'),
      html: L3('Bu html tegi. U butun sahifani o‘rab turadi: ichida head va body bor.',
        'Это тег html. Он обнимает всю страницу: внутри него head и body.',
        'This is the html tag. It wraps the whole page: head and body are inside it.'),
      head: L3('Bu head qismi. Unda sahifa haqidagi ma’lumot turadi, oynada u ko‘rinmaydi.',
        'Это часть head. В ней сведения о странице, в окне их не видно.',
        'This is the head part. It holds information about the page; you don’t see it in the window.'),
      title: L3('Bu title tegi. Uning ichidagi nomni brauzer yorliqda ko‘rsatadi.',
        'Это тег title. Название из него браузер показывает на вкладке.',
        'This is the title tag. The browser shows the name inside it on the tab.'),
      body: L3('Bu body qismi. Oynada ko‘rinadigan hamma narsa shu yerda.',
        'Это часть body. Здесь всё, что видно в окне.',
        'This is the body part. Everything you see in the window is here.'),
      text: L3('Bu sizning matningiz. U body ichida, shuning uchun oynada ko‘rinadi.',
        'Это твой текст. Он внутри body, поэтому виден в окне.',
        'This is your text. It’s inside body, so it shows in the window.')
    }
  },
  s13: {
    eyebrow: L3('Sahifa tuzilishini yig‘ing', 'Собери основу страницы', 'Build the page structure'),
    say: L3('Endi sahifangizning asosiy tuzilishini yig‘ing. Birinchi qator joyida turibdi. Qolgan qatorlarni tartib bilan joylashtiring.',
      'Теперь собери основу своей страницы. Первая строка уже стоит. Расставь остальные полоски по порядку.',
      'Now build the structure of your page. The first line is already there. Put the other strips in order.'),
    rules: {
      html: L3('html birinchi ochiladi va oxirida yopiladi: butun sahifa uning ichida.',
      'html открывается первым и закрывается последним: внутри него вся страница.',
      'html opens first and closes last: the whole page is inside it.'),
      pair: L3('Yopuvchi teg o‘zining ochuvchi tegidan keyin turishi kerak.',
      'Закрывающий тег должен стоять после своего открывающего.',
      'A closing tag must come after its opening tag.'),
      order: L3('Avval head qismi, undan keyin body qismi keladi.', 'Сначала идёт head, потом body.', 'Put head before body.'),
      headClose: L3('body boshlanishidan oldin head yopilishi kerak.', 'head нужно закрыть до того, как начнётся body.', 'Close head before body starts.'),
      title: L3('title head ichida turishi kerak.', 'title должен стоять внутри head.', 'title must be inside head.'),
      text: L3('Sahifa matni body ichida turishi kerak.', 'Текст страницы должен стоять внутри body.', 'The page text must be inside body.')
    },
    hints: [L3('Qaysi teg birinchi ochilib, oxirida yopiladi?', 'Какой тег открывается первым и закрывается последним?', 'Which tag opens first and closes last?'),
      L3('html ichida avval title bilan head, keyin matn bilan body keladi.',
      'Внутри html сначала head с title, потом body с текстом.',
      'Inside html: first head with title, then body with the text.'),
      L3('Belgilangan ikki qatorning o‘rnini almashtiring.', 'Поменяй местами две отмеченные полоски.', 'Swap the two marked strips.')],
    ok: L3('Sahifa tuzilishi to‘g‘ri: sahifa nomi head ichida, matn body ichida!',
      'Основа собрана правильно: название — в head, текст — в body!',
      'The structure is right: the page name is in head, the text is in body!'),
    ask: L3('Qatorlarni tartib bilan qo‘ying', 'Расставь полоски по порядку', 'Put the strips in order')
  },
  s14: {
    eyebrow: L3('Matn yorliqqa tushib qoldi', 'Текст попал на вкладку', 'Text on the tab'),
    say: L3('Sahifa matni yorliqdagi sahifa nomiga qo‘shilib ketdi, oyna esa bo‘sh. Qaysi yopuvchi teg yetishmayapti?',
      'Текст страницы попал в название на вкладке, а окно пустое. Какого закрывающего тега не хватает?',
      'The page text ended up in the page name on the tab, and the window is empty. Which closing tag is missing?'),
    opts: ['</title>', '<title>', '</head>'],
    why: {
      '<title>': L3('Bu ochuvchi teg. title allaqachon ochilgan, endi uni yopish kerak.',
      'Это открывающий тег. title уже открыт, теперь его нужно закрыть.',
      'That’s an opening tag. title is already open. Now it needs to be closed.'),
      '</head>': L3('head keyinroq yopiladi. Avval sahifa nomi tugashi kerak, shuning uchun title tegini yoping.',
      'head закроется позже. Сначала должно закончиться название — закрой title.',
      'head closes later. First the page name has to end, so close title.')
    },
    ok: L3('Yopuvchi title tegi hammasini tuzatdi: sahifa nomi yorliqda, matn esa oynada!',
      'Закрывающий тег title всё исправил: название на вкладке, текст в окне!',
      'The closing title tag fixed it: the page name is on the tab, the text is in the window!'),
    ask: L3('Yetishmayotgan tegni bo‘sh joyga torting', 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty place')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новый пример без подсказки до первой попытки.
  q1: {
    eyebrow: L3('Yorliq va oyna', 'Вкладка и окно', 'Tab and window'),
    say: L3('Yangi sahifa. Yorliqda «Robotlar», oynada esa «Salom!» bo‘lishi kerak. Har bir so‘zni o‘z joyiga qo‘ying.',
      'Новая страница. На вкладке должно быть «Роботы», а в окне — «Привет!». Поставь каждую фразу на её место.',
      'A new page. The tab should say “Robots”, and the window “Hello!”. Put each phrase in its place.'),
    tabWord: L3('Robotlar', 'Роботы', 'Robots'),
    winWord: L3('Salom!', 'Привет!', 'Hello!'),
    toWin: L3('Qarang: «{w}» oynaga chiqdi. body ichidagi matn oynada ko‘rinadi. Yorliq uchun title kerak.',
      'Смотри: «{w}» попало в окно. Текст из body видно в окне. Для вкладки нужен title.',
      'Look: “{w}” went to the window. Text in body shows in the window. The tab needs title.'),
    toTab: L3('Qarang: «{w}» yorliqqa chiqdi. title ichidagi matn yorliqda ko‘rinadi. Oyna uchun body kerak.',
      'Смотри: «{w}» попало на вкладку. Текст из title видно на вкладке. Для окна нужен body.',
      'Look: “{w}” went to the tab. Text in title shows on the tab. The window needs body.'),
    hints: [L3('Yorliqdagi matn qaysi teg ichida bo‘ladi?', 'В каком теге текст для вкладки?', 'Which tag holds the text for the tab?'),
      L3('Yorliq uchun — title, oyna uchun — body.', 'Для вкладки — title, для окна — body.', 'For the tab: title. For the window: body.'),
      L3('Yonib turgan so‘zni yonib turgan joyga torting.', 'Перетащи светящуюся фразу в светящееся место.', 'Drag the glowing phrase to the glowing place.')],
    ok: L3('To‘g‘ri! «Robotlar» title ichida, shuning uchun yorliqda. «Salom!» body ichida, shuning uchun oynada.',
      'Верно! «Роботы» в title — поэтому на вкладке. «Привет!» в body — поэтому в окне.',
      'Right! “Robots” is in title, so it’s on the tab. “Hello!” is in body, so it’s in the window.'),
    pickFirst: L3('Avval so‘zni tanlang.', 'Сначала выбери фразу.', 'Pick a phrase first.'),
    ask: L3('Har bir so‘zni o‘z joyiga torting', 'Перетащи каждую фразу на её место', 'Drag each phrase into its place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  q2: {
    eyebrow: L3('Nega </title> kerak?', 'Зачем нужен </title>?', 'Why </title>?'),
    say: L3('Oxirgi savol. Yopuvchi title tegi nima uchun kerak?', 'Последний вопрос. Зачем нужен закрывающий тег title?', 'Last question. Why do we need the closing title tag?'),
    // Верный ответ не первый; неверные выключаются после попытки, с объяснением.
    opts: [
      { id: 'win', t: L3('Sahifa nomini oynada ko‘rsatadi', 'Показывает название в окне', 'It shows the name in the window'),
        why: L3('Yo‘q: yopuvchi teg sahifada ko‘rinmaydi va nomni oynaga chiqarmaydi.', 'Нет: закрывающий тег на странице не виден и название в окно не выводит.', 'No: a closing tag doesn’t show on the page and doesn’t put the name in the window.') },
      { id: 'end', right: true, t: L3('Sahifa nomi qayerda tugashini ko‘rsatadi', 'Показывает, где заканчивается название страницы', 'It shows where the page name ends') },
      { id: 'new', t: L3('Yangi sahifani boshlaydi', 'Начинает новую страницу', 'It starts a new page'),
        why: L3('Yo‘q: sahifa html tegi bilan boshlanadi. Yopuvchi title tegi esa sahifa nomini tugatadi.', 'Нет: страница начинается с тега html. А закрывающий тег title заканчивает название.', 'No: a page starts with the html tag. The closing title tag ends the page name.') }
    ],
    hints: [L3('Oldingi ekranni eslang: u yerda yopuvchi title tegi yo‘q edi.', 'Вспомни прошлый экран: там не было закрывающего тега title.', 'Remember the last screen: the closing title tag was missing.'),
      L3('Qiya chiziqli teg biror qismni tugatadi. title ichida nima turadi?', 'Тег с косой чертой заканчивает часть. Что стоит внутри title?', 'A tag with a slash ends a part. What sits inside title?'),
      L3('Yopuvchi title tegi sahifa nomini tugatadi.', 'Закрывающий тег title заканчивает название страницы.', 'The closing title tag ends the page name.')],
    ok: L3('To‘g‘ri! Usiz sahifaning qolgan matni ham yorliqqa tushib qoladi, oldingi ekrandagidek.',
      'Верно! Без него весь текст страницы уезжает на вкладку, как на прошлом экране.',
      'Right! Without it, the rest of the page text ends up on the tab, like on the last screen.'),
    ask: L3('Javobni tanlang', 'Выбери ответ', 'Pick an answer')
  },
  // Финальный облёт мира (тестовый урок 15).
  fly: {
    eyebrow: L3('Sizning dunyongiz', 'Твой мир', 'Your world'),
    say: [
      { text: L3('To‘xtang! Orqaga qarang. Nima qurganingizni ko‘ryapsizmi?', 'Стой! Оглянись. Видишь, что ты построил?', 'Wait! Look back. Can you see what you built?'), k: null },
      { text: L3('html — butun dunyo. Yer ham, osmon ham uning ichida.', 'html — это весь мир. И земля, и небо — внутри него.', 'html is the whole world. The land and the sky are inside it.'), k: 'html' },
      { text: L3('head — minora. Uning tepasida title: sahifangiz nomi yozilgan bayroq.', 'head — это башня. Наверху у неё title: флаг с названием твоей страницы.', 'head is the tower. On top of it is title: a flag with your page name.'), k: 'head' },
      { text: L3('body — o‘tloq: uycha va osmondagi salomingiz. Ularni oynada ko‘rasiz.', 'body — это поляна: домик и твоё приветствие в небе. Это видно в окне.', 'body is the meadow: the little house and your greeting in the sky. That is what you see in the window.'), k: 'body' },
      { text: L3('Bu dunyoni siz kod bilan qurdingiz. Zo‘r chiqdi, to‘g‘rimi?', 'Этот мир ты построил кодом. Классно вышло, правда?', 'You built this world with code. Pretty cool, right?'), k: null }
    ],
    sub: L3('Sizning birinchi sahifangiz', 'Твоя первая страница', 'Your first page'),
    ask: L3('Qarang: buni siz qurdingiz', 'Смотри: это построил ты', 'Look: you built this')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang, bu sizning sahifangiz!', 'Посмотри, это твоя страница!', 'Look, this is your page!'), k: null },
      { text: L3('Teg burchakli qavslardagi so‘z. U brauzerga sahifa qismlarini tanishga yordam beradi.',
      'Тег — слово в угловых скобках. Он помогает браузеру узнавать части страницы.',
      'A tag is a word in angle brackets. It helps the browser recognize the parts of the page.'), k: null },
      { text: L3('html sahifaning hamma qismlarini o‘z ichiga oladi. Uning ichida head va body bor.',
      'html объединяет все части страницы. Внутри него — head и body.',
      'html holds all the parts of the page. Inside it are head and body.'), k: 'html' },
      { text: L3('head ichida sahifa haqidagi ma’lumot turadi. U oynada ko‘rinmaydi.',
      'В head — сведения о странице. В окне их не видно.',
      'head holds information about the page. You don’t see it in the window.'), k: 'head' },
      { text: L3('head ichidagi title sahifa nomini belgilaydi. Brauzer uni yorliqda ko‘rsatadi.',
      'title внутри head задаёт название страницы. Браузер показывает его на вкладке.',
      'title inside head sets the page name. The browser shows it on the tab.'), k: 'title' },
      { text: L3('body ichida oynada ko‘rinadigan hamma narsa bor: matn, rasm, tugmalar.',
      'В body — всё, что видно в окне: текст, картинки, кнопки.',
      'body holds everything you see in the window: text, pictures, buttons.'), k: 'body' },
      { text: L3('Tabriklayman! Birinchi HTML sahifangiz tayyor. Undagi nom ham, matn ham sizniki!',
      'Ура! Твоя первая HTML-страница готова. В ней твоё название и твой текст!',
      'Hooray! Your first HTML page is ready. The name and the text are yours!'), k: null }
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
Object.assign(SPOKEN, { askPair: 1, pair: 1, askSlash: 1, slash: 1, magic: 1, magicHead: 1, magicWin: 1, sayTab: 1, sayWin: 1, sayGo: 1, sayInfo: 1, sayTag: 1, why: 1, opts: 1, rules: 1, miss: 1, askTitle: 1, askRaw: 1, toWin: 1, toTab: 1, tapSay: 1, parts: 1, order5: 1, top: 1, bottom: 1, msgs: 1, opened: 1, flew: 1, out: 1, back: 1, cards: 1, items: 1 });
Object.assign(NOT_SPOKEN_IN, { cards: { title: 1, id: 1, raw: 1, want: 1 }, items: { id: 1, want: 1 }, opts: { t: 1, id: 1, right: 1 } });

/*@FILE:kniga-paper-data.jsx@*/

/*@FILE:kniga-paper.jsx@*/

/*@FILE:kniga-kit.jsx@*/

/*@FILE:kniga-trans.jsx@*/

/*@FILE:kniga-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:kniga.css@*/
`;
