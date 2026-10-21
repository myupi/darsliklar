// =============================================================================
// ТЕСТОВЫЕ УРОКИ · Урок 1 курса HTML, вариант «Бумажная страница» — структура документа
// Дети 11–14. Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 (тест) · «Бумажная страница» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ. Стилистика ролика html.mp4 (заказчик, 20.10.2026): бумажный коллаж —
// вырезки из цветной бумаги с рваным краем и фактурой, мягкая тень слой на слой,
// движение вырезками по столу со ступенчатостью stop-motion и параллаксом. На
// листе живёт бумажный человечек; любая страница устроена так же: рамка (html),
// голова, где страница помнит своё имя (head, внутри title), и тело — всё, что
// видно в окне (body). Ученик собирает человечка-страницу, а в конце — свою.
//
// ДУГА. s1 крючок · s2 план · тройки «объяснение → сам делаешь → закрепление»:
// тег и html (s3–s5), head и title (s6–s8), body (s9–s11), весь документ
// (s12–s14) · s15 вывод. Сценарий — docs/scenarij-12-struktura-kollazh.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Цвета частей — как в ролике: html коралл, head горчица, body бирюза;
//     теги — полоски на скотче: уголки коралловые, имя чернилами.
//   · head — «голова» человечка (метафора ролика), а не «паспорт» урока 1.
//   · Конфетти только в финале: похвалы экранов — поза smile.
//   · Честный браузер: текст без ярлыков — в окно, вкладка index.html; без
//     </title> всё, что дальше, уходит во вкладку.
//
// СИСТЕМА СЛОВ. Тег — слово в угловых скобках, подсказка браузеру (не «бирка»: в узбекском «yorliq» — это вкладка); html — рамка всей страницы; head —
// голова: то, что страница знает о себе; title — имя страницы на вкладке;
// body — тело: всё, что видно в окне.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'test-12-struktura-kollazh',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '1-dars (qog‘oz). HTML hujjat tuzilishi',
    ru: 'Урок 1 (бумажный). Структура HTML-документа',
    en: 'Lesson 1 (paper). HTML document structure'
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
  next: L3('Katta sarlavha va xatboshilar qo‘shamiz', 'Добавим большой заголовок и абзацы', 'We add a big heading and paragraphs'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  read: L3('Brauzerdek o‘qish', 'Читать как браузер', 'Read like a browser'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  pic: L3('rasm', 'картинка', 'picture'),
  pageText: L3('sahifa matni', 'текст страницы', 'page text'),
  slot: L3('joy', 'место', 'place'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  again: L3('yangi misol', 'новый пример', 'new example'),
  hintN: L3('Maslahat', 'Подсказка', 'Hint'),
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
    say: L3('Salom! Men Kodiman. Bu qog‘oz odamcha. Uni bosing, sizga bir sirni ko‘rsataman.',
      'Привет! Я Коди. Это бумажный человечек. Нажми на него — покажу секрет.',
      'Hi! I’m Kodi. This is a paper buddy. Tap him, and I’ll show you a secret.'),
    // Две реплики подряд: пока звучит первая, подсвечена вкладка, пока вторая — окно.
    magic: L3('Voy, qarang! Brauzerning tepasidagi yorliqda sahifa nomi paydo bo‘ldi.',
      'Ого! Смотри: наверху, на вкладке браузера, появилось название страницы.',
      'Whoa! Look at the top: the page name appeared on the browser tab.'),
    magicWin: L3('Oynada esa tanadagi hamma narsa ko‘rinyapti.',
      'А в окне теперь всё, что было в теле.',
      'And everything from the body is now in the window.'),
    done: L3('Bugun sahifa qanday qismlardan iboratligini bilib olasiz va o‘z sahifangizni yig‘asiz!',
      'Сегодня ты узнаешь, из каких частей состоит страница, и соберёшь свою!',
      'Today you’ll learn what parts a page has and build your own!'),
    ask: L3('Qog‘oz odamchani bosing', 'Нажми на бумажного человечка', 'Tap the paper buddy'),
    askDone: L3('Sahifa nomi yorliqda, mazmuni esa oynada ko‘rinadi',
      'Название страницы — на вкладке, содержимое — в окне',
      'The page name is on the tab, the content is in the window')
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
      'Третий шаг — текст, который видно в окне браузера.',
      'Step three: the text you see in the browser window.') },
      { title: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
        say: L3('Oxirida esa o‘z sahifangizni to‘liq yig‘asiz!', 'А в конце ты соберёшь свою страницу целиком!', 'And at the end, you’ll build your whole page!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  s3: {
    eyebrow: L3('Teg nima?', 'Что такое тег', 'What is a tag'),
    say: L3('Brauzer sahifa qismlarini teglar orqali taniydi.', 'Браузер узнаёт части страницы по тегам.', 'The browser finds the parts of a page by their tags.'),
    // Пока звучит определение тега, оба тега на рамке подсвечены.
    sayTag: L3('Teg burchakli qavslar ichidagi so‘z. U sahifa qismi qayerda boshlanib, qayerda tugashini ko‘rsatadi.',
      'Тег — это слово в угловых скобках. Он показывает, где часть страницы начинается и где заканчивается.',
      'A tag is a word in angle brackets. It shows where a part of the page starts and where it ends.'),
    sayAsk: L3('Ramkadagi tepa tegni bosing.', 'Нажми верхний тег на рамке.', 'Tap the top tag on the frame.'),
    top: L3('Bu ochuvchi html tegi. HTML hujjat shu tegdan boshlanadi.',
      'Это открывающий тег html. С него начинается HTML-документ.',
      'This is the opening html tag. The HTML document starts here.'),
    bottomAsk: L3('Endi pastki tegni bosing.', 'Теперь нажми нижний тег.', 'Now tap the bottom tag.'),
    bottom: L3('Bu esa yopuvchi html tegi. So‘z o‘sha, faqat oldida qiya chiziq bor. Hujjat shu yerda tugaydi.',
      'А это закрывающий тег html. Слово то же, но перед ним косая черта. Здесь документ заканчивается.',
      'And this is the closing html tag. Same word, but with a slash before it. The document ends here.'),
    done: L3('Butun sahifa shu ikki teg orasida joylashadi. Ramkani tushunarli bo‘lishi uchun chizdik, brauzerda u ko‘rinmaydi.',
      'Вся страница находится между этими двумя тегами. Рамку мы нарисовали для наглядности: в браузере её не видно.',
      'The whole page goes between these two tags. We drew the frame to help you see it. The browser doesn’t show it.'),
    ask: L3('Ramkadagi teglarni bosing', 'Нажми теги на рамке', 'Tap the tags on the frame')
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
      needLt: L3('Teg burchakli qavs bilan boshlanadi: «<». Uni boshiga qo‘shing.',
      'Тег начинается с угловой скобки «<». Добавь её в начало.',
      'A tag starts with the angle bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida burchakli qavs turadi: «>». Uni oxiriga qo‘shing.',
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
    ok: L3('Ramka yopildi: endi butun hujjat ikki html tegi orasida!',
      'Рамка закрылась: весь документ теперь между двумя тегами html!',
      'The frame is closed: the whole document is now between the two html tags!'),
    ask: L3('Bo‘sh qatorga yopuvchi html tegini yozing', 'Напиши закрывающий тег html в пустую строку', 'Type the closing html tag in the empty line')
  },
  s5: {
    eyebrow: L3('Teglar joyida', 'Теги по местам', 'Tags in place'),
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
    say: L3('Odamchaning boshi head qismiga o‘xshaydi. Unda sahifa haqidagi ma’lumot saqlanadi. Brauzer oynasida u ko‘rinmaydi. Odamchaning boshini bosing!',
      'Голова человечка — как часть head. В ней хранятся сведения о странице. В окне браузера их не видно. Нажми на голову человечка!',
      'The buddy’s head is like the head part. It holds information about the page. You don’t see it in the browser window. Tap the buddy’s head!'),
    opened: L3('Ichida title kartochkasi bor. Unda sahifa nomi yozilgan. Kartochkani bosing!',
      'Внутри — карточка title. На ней название страницы. Нажми на карточку!',
      'Inside is the title card. It has the page name on it. Tap the card!'),
    flew: L3('Mana, sahifa nomi brauzer yorlig‘ida ko‘rindi!', 'Название страницы появилось на вкладке браузера!', 'There: the page name is on the browser tab!'),
    done: L3('Sahifa nomi title ichiga yoziladi. title esa head ichida joylashadi.',
      'Название страницы пишут внутри title. А title стоит внутри head.',
      'The page name goes inside title. And title sits inside head.'),
    ask: L3('Odamchaning boshini bosing', 'Нажми на голову человечка', 'Tap the buddy’s head'),
    askCard: L3('title kartochkasini bosing', 'Нажми на карточку title', 'Tap the title card')
  },
  s7: {
    eyebrow: L3('Yorliqdagi nom', 'Название на вкладке', 'The name on the tab'),
    say: L3('Sahifangizga nom o‘ylab toping. Uni title ichiga yozing va brauzer yorlig‘iga qarang.',
      'Придумай название своей страницы. Напиши его внутри title и посмотри на вкладку.',
      'Think of a name for your page. Type it inside title and watch the tab.'),
    ok: L3('Siz yozgan nom yorliqda paydo bo‘ldi!', 'Твоё название уже на вкладке!', 'Your page name is on the tab now!'),
    hints: [L3('Sahifa nomini qaysi teg belgilaydi?', 'Какой тег задаёт название страницы?', 'Which tag sets the page name?'),
      L3('Sahifa nomi title ichiga yoziladi.', 'Название страницы пишут внутри title.', 'The page name goes inside title.'),
      L3('title tegi ichidagi bo‘sh joyni bosing va nom yozing.',
      'Нажми на пустое место внутри title и напиши название.',
      'Tap the empty space inside title and type a name.')],
    ask: L3('title ichiga sahifa nomini yozing', 'Напиши название внутри title', 'Type a page name inside title')
  },
  s8: {
    eyebrow: L3('Yorliqmi yoki oyna?', 'Вкладка или окно?', 'Tab or window?'),
    say: L3('Hozir sahifaga yangi kod qatorlari tushadi. Har bir so‘zni brauzer qayerda ko‘rsatishini o‘ylab ko‘ring.',
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
      raw: L3('Tegsiz so‘zni brauzer oynada ko‘rsatadi. Yorliqda esa hozircha fayl nomi turibdi. To‘g‘ri topdingiz.',
      'Слово без тегов браузер показывает в окне. А на вкладке пока имя файла. Всё верно.',
      'The browser shows a word without tags in the window. The tab still shows the file name. You got it.')
    },
    miss: {
      title: L3('Qarang: title ichidagi matn yorliqqa chiqdi, uzun gap bo‘lsa ham. Yana bir misol.',
      'Смотри: текст из title попал на вкладку, даже длинная фраза. Давай ещё пример.',
      'Look: the text from title went to the tab, even a long phrase. Let’s try another one.'),
      raw: L3('Qarang: so‘zda teg yo‘q, shuning uchun brauzer uni oynada ko‘rsatdi. Yana bir misol.',
      'Смотри: у слова нет тегов, поэтому браузер показал его в окне. Давай ещё пример.',
      'Look: the word has no tags, so the browser showed it in the window. Let’s try another one.')
    },
    askTitle: L3('title ichida «{w}». U qayerda paydo bo‘ladi?', 'В title — «{w}». Где оно появится?', 'title says “{w}”. Where will it show up?'),
    askRaw: L3('Tegsiz «{w}». U qayerda paydo bo‘ladi?', '«{w}» без тегов. Где оно появится?', '“{w}” with no tags. Where will it show up?'),
    done: L3('Esda tuting: title ichidagi matn yorliqda, tegsiz matn esa oynada ko‘rinadi.',
      'Запомни: текст из title — на вкладке, а текст без тегов — в окне.',
      'Remember: text in title shows on the tab, and text without tags shows in the window.')
  },
  s9: {
    eyebrow: L3('body qismi', 'Часть body', 'The body part'),
    say: L3('Odamchaning tanasi body qismiga o‘xshaydi. Brauzer oynasida ko‘rinadigan hamma narsa body ichida bo‘ladi. Odamchaning tanasini bosing!',
      'Тело человечка — как часть body. В body находится всё, что видно в окне браузера. Нажми на тело человечка!',
      'The buddy’s body is like the body part. Everything you see in the browser window is inside body. Tap the buddy’s body!'),
    out: L3('Matn, rasm va tugma oynada paydo bo‘ldi. Bularning hammasi body ichida yozilgan.',
      'Текст, картинка и кнопка появились в окне. Всё это записано внутри body.',
      'The text, the picture and the button appeared in the window. They’re all written inside body.'),
    done: L3('body ichida sahifaning oynada ko‘rinadigan hamma mazmuni bo‘ladi.',
      'В body — всё содержимое страницы, которое видно в окне.',
      'body holds all the page content you see in the window.'),
    ask: L3('Odamchaning tanasini bosing', 'Нажми на тело человечка', 'Tap the buddy’s body')
  },
  s10: {
    eyebrow: L3('Oynadagi salom', 'Привет в окне', 'Hello in the window'),
    say: L3('body ichiga mehmonlar uchun salomlashuv yozing. U darhol oynada paydo bo‘ladi.',
      'Напиши приветствие для гостей внутри body. Оно сразу появится в окне.',
      'Type a greeting for your visitors inside body. It will appear in the window right away.'),
    ok: L3('Siz yozgan matn oynada ko‘rinyapti!', 'Твой текст уже виден в окне!', 'Your text is showing in the window!'),
    hints: [L3('Oynada ko‘rinadigan matn qaysi teg ichiga yoziladi?', 'В каком теге пишут текст, который видно в окне?', 'Which tag holds the text you see in the window?'),
      L3('Oynadagi matn body ichiga yoziladi.', 'Текст для окна пишут внутри body.', 'Text for the window goes inside body.'),
      L3('body ichidagi bo‘sh joyni bosing va matn yozing.', 'Нажми на пустое место внутри body и напиши текст.', 'Tap the empty space inside body and type your text.')],
    ask: L3('body ichiga salom yozing', 'Напиши приветствие внутри body', 'Type a greeting inside body')
  },
  s11: {
    eyebrow: L3('Qirqimlarni joylang', 'Разложи вырезки', 'Sort the cut-outs'),
    say: L3('Har bir qirqim qayerga tegishli: head ichigami yoki body ichigami? Ularni joyiga torting.',
      'Куда положить каждую вырезку: в head или в body? Перетащи их по местам.',
      'Where does each cut-out go: into head or into body? Drag them into place.'),
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
    pickFirst: L3('Avval qirqimni tanlang.', 'Сначала выбери вырезку.', 'Pick a cut-out first.'),
    hints: [L3('Bu narsa brauzer oynasida ko‘rinadimi?', 'Эту вещь видно в окне браузера?', 'Can you see this in the browser window?'),
      L3('Oynada ko‘rinadigan hamma narsa body ichida. Sahifa nomi head ichida.',
      'Всё, что видно в окне, находится в body. Название страницы — в head.',
      'Everything you see in the window goes in body. The page name goes in head.'),
      L3('Yonib turgan qirqimni yonib turgan joyga torting.', 'Перетащи светящуюся вырезку в светящееся место.', 'Drag the glowing cut-out to the glowing place.')],
    ask: L3('Qirqimni head yoki body ichiga torting', 'Перетащи вырезку в head или в body', 'Drag a cut-out into head or body'),
    askPlace: L3('Endi head yoki body ni bosing', 'Теперь нажми head или body', 'Now tap head or body')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Brauzer kodni yuqoridan pastga o‘qiydi va sahifani bo‘lakma-bo‘lak yig‘adi. Tugmani bosing va kuzating.',
      'Браузер читает код сверху вниз и по кусочкам собирает страницу. Нажми кнопку и посмотри.',
      'The browser reads code from top to bottom and builds the page piece by piece. Press the button and watch.'),
    doctype: L3('Birinchi qator <!DOCTYPE html>. U brauzerga bu HTML hujjat ekanini bildiradi.',
      'Первая строка — <!DOCTYPE html>. Она сообщает браузеру, что это HTML-документ.',
      'The first line is <!DOCTYPE html>. It tells the browser this is an HTML document.'),
    // Порядок — тремя репликами: каждая подсвечивает свои строки кода и блок коллажа.
    order1: L3('Tartib shunday: avval birinchi qator.', 'Порядок такой: сначала первая строка.', 'Here’s the order: the first line comes first.'),
    order2: L3('Keyin html keladi.', 'Потом html.', 'Then comes html.'),
    order3: L3('Uning ichida head va body joylashadi.', 'А внутри него — head и body.', 'And inside it are head and body.'),
    askDone: L3('Tartib: birinchi qator, keyin html, uning ichida head va body',
      'Порядок: первая строка, потом html, а внутри него head и body',
      'The order: the first line, then html, and inside it head and body'),
    ask: L3('«Brauzerdek o‘qish» tugmasini bosing', 'Нажми «Читать как браузер»', 'Tap “Read like a browser”')
  },
  s13: {
    eyebrow: L3('Karkasni yig‘ing', 'Собери каркас', 'Build the frame'),
    say: L3('Endi o‘z sahifangiz karkasini yig‘ing. Birinchi qator joyida turibdi. Qolgan qatorlarni tartib bilan joylashtiring.',
      'Теперь собери каркас своей страницы. Первая строка уже стоит. Расставь остальные полоски по порядку.',
      'Now build the skeleton of your page. The first line is already there. Put the other strips in order.'),
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
    ok: L3('Karkas to‘g‘ri yig‘ildi: sahifa nomi head ichida, matn body ichida!',
      'Каркас собран правильно: название — в head, текст — в body!',
      'The skeleton is right: the page name is in head, the text is in body!'),
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
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang, bu sizning sahifangiz!', 'Посмотри, это твоя страница!', 'Look, this is your page!'), k: null },
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

// Знак в кавычках («<», «/», “>”) нужен глазам: в реплике он уже назван словами
// («угловая скобка», «косая черта»). В озвучку он не идёт — иначе сервис читает
// сырой символ, а «<» превращается в «уголок» не в том падеже.
const KZ_QUOTED_SIGN = /[\s:—–-]*[«“"]\s*[<>\/\\]\s*[»”"]/g;
const spokenHtmlL2 = spokenHtml;
// eslint-disable-next-line no-func-assign
spokenHtml = (text, lang) => spokenHtmlL2(String(text || '').replace(KZ_QUOTED_SIGN, ''), lang);

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { magic: 1, magicWin: 1, sayTag: 1, order1: 1, order2: 1, order3: 1, sayAsk: 1, top: 1, bottom: 1, bottomAsk: 1, msgs: 1, opened: 1, flew: 1, out: 1, doctype: 1, back: 1, cards: 1, items: 1 });
Object.assign(NOT_SPOKEN_IN, { cards: { title: 1 }, items: { id: 1, want: 1 } });

/*@FILE:kollazh-paper-data.jsx@*/

/*@FILE:kollazh-paper.jsx@*/

/*@FILE:kollazh-kit.jsx@*/

/*@FILE:kollazh-trans.jsx@*/

/*@FILE:kollazh-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:kollazh.css@*/
`;
