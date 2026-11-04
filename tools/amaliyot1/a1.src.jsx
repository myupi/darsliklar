// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 1 — «Пять вкладок Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot1/build.mjs → lessons/html/01p-struktura-dokumenta.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 1 · «Пять вкладок Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, с нуля: прежние практики удалены заказчиком). Сбой стёр код пяти любимых
// страниц Коди — вкладки браузера погасли. Ученик чинит их по одной и сам пишет код: название
// между тегами → строка title → блок body → найти и починить незакрытый title → своя страница.
// Карта продвижения — сами вкладки браузера (погасшая — серый значок, починенная — цветной значок
// и название, текущая — открыта): название из title видно на вкладке — главная мысль урока 1.
// 7 слайдов (заказчик, 22.10.2026): крючок · пять заданий · вывод. Сценарий —
// docs/scenarij-01p-struktura-dokumenta.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a1-screens.jsx, lexA1) находит теги и текст, страницу
//     рисует React как текст. Браузер честный: незакрытый title уносит остальной код на вкладку.
//   · Проверка по «Tekshirish», одна самая полезная проблема; вторая неудача подряд добавляет
//     ступень подсказки; лампочка — ступени 1–3; после третьей — дополнительная задача.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz», вкладка — «brauzer varag'i»,
//     «varaq» (как в уроке 1). RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-01p-struktura-dokumenta',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '1-amaliyot. Kodining beshta varag\'i',
    ru: 'Практика 1. Пять вкладок Коди',
    en: 'Practice 1. Kodi’s five tabs'
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
  check: L3("Tekshirish", 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  editor: L3("Kod muharriri", 'Редактор кода', 'Code editor'),
  keys: L3("Belgilar", 'Символы', 'Symbols'),
  refresh: L3("Yangilash", 'Обновить', 'Refresh'),
  drill: L3("Qo'shimcha", 'Ещё разок', 'Bonus'),
  sample: L3("Namuna", 'Образец', 'Example'),
  workReady: L3("Ish tayyor", 'Работа готова', 'Work is ready'),
  nextLesson: L3("Keyingi dars", 'Следующий урок', 'Next lesson'),
  next: L3("Sarlavhalar va matn", 'Заголовки и текст', 'Headings and text'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  part: {
    open: L3("ochuvchi teg", 'открывающий', 'opening tag'),
    name: L3("nom", 'название', 'name'),
    text: L3("matn", 'текст', 'text'),
    close: L3("yopuvchi teg", 'закрывающий', 'closing tag')
  },
  bpTitle: L3("sahifa nomi", 'название страницы', 'page name'),
  bpBody: L3("oynadagi matn", 'текст в окне', 'text in the window'),
  given: L3("bor", 'уже есть', 'already there'),
  tabsLbl: L3("Varaqlar", 'Вкладки', 'Tabs'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening sahifam", 'Моя страница', 'My page'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// ПЯТЬ ВКЛАДОК — объекты карты. name — название из title, text — что в окне, ico — значок.
// Пятая — своя страница ученика (название и текст — из задания 5).
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'music', ico: 'music', c: '#FA4F28', name: L3("Musiqa", 'Музыка', 'Music'), text: L3("Eng yaxshi qo'shiqlar", 'Лучшие песни', 'Top songs') },
  { id: 'games', ico: 'game', c: '#7C5CFA', name: L3("O'yinlar", 'Игры', 'Games'), text: L3("Bugungi o'yin: shaxmat", 'Игра дня: шахматы', 'Game of the day: chess') },
  { id: 'weather', ico: 'sun', c: '#F59E0B', name: L3("Ob-havo", 'Погода', 'Weather'), text: L3("Bugun quyoshli", 'Сегодня солнечно', 'Sunny today') },
  { id: 'movies', ico: 'film', c: '#0FA38E', name: L3("Kino", 'Кино', 'Movies'), text: L3("Yangi multfilmlar", 'Новые мультфильмы', 'New cartoons') },
  { id: 'mine', ico: 'star', c: '#E44D26', name: L3("Mening sahifam", 'Моя страница', 'My page'), text: L3("Salom!", 'Привет!', 'Hello!') }
];
// Содержимое дополнительных задач и образцов (другое, чем в задании).
const XTRA = {
  sport: L3("Sport", 'Спорт', 'Sport'),
  books: L3("Kitoblar", 'Книги', 'Books'),
  football: L3("Bugun futbol", 'Сегодня футбол', 'Football today'),
  rain: L3("Ertaga yomg'ir", 'Завтра дождь', 'Rain tomorrow'),
  hi: L3("Salom!", 'Привет!', 'Hello!')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {near} — похожий тег.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari chiziq «\\». Yopuvchi tegda oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("«{bad}» tegining oxirida o'ng burchakli qavs «>» yo'q.", 'В конце тега «{bad}» не хватает уголка «>».', 'The tag “{bad}” is missing the bracket “>” at the end.'),
  noLt: L3("«{bad}»: teg chap burchakli qavs «<» bilan boshlanadi.", '«{bad}» — тег начинается с уголка «<».', '“{bad}” — a tag starts with the bracket “<”.'),
  typo: L3("«{bad}» degan teg yo'q. Balki «{near}» demoqchisiz?", '«{bad}» — такого тега нет. Может быть, «{near}»?', '“{bad}” — there’s no such tag. Did you mean “{near}”?'),
  unknown: L3("«{bad}» tegi bizning sahifamizda yo'q. Bizda faqat html, head, title va body bor.", 'Тега «{bad}» на нашей странице нет. У нас только html, head, title и body.', 'Our page has no “{bad}” tag. We only have html, head, title and body.'),
  emptyTag: L3("Burchakli qavslar ichida teg nomi bo'lishi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  needOpenText: L3("Matndan oldin ochuvchi {tag} tegi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeFirst: L3("Bu yopuvchi {got} tegi. Bu yerda oldin ochuvchi {tag} tegi kerak.", 'Это закрывающий тег {got}. Здесь сначала нужен открывающий тег {tag}.', 'That’s the closing {got} tag. First you need the opening {tag} tag here.'),
  order: L3("Oldin {tag} keladi, keyin {got}.", 'Сначала идёт {tag}, потом {got}.', 'First comes {tag}, then {got}.'),
  wrongOpen: L3("Bu yerda {tag} tegi kerak, {got} emas.", 'Здесь нужен тег {tag}, а не {got}.', 'You need the {tag} tag here, not {got}.'),
  titleOut: L3("title head ichida yashaydi: oldin ochuvchi head tegini yozing.", 'title живёт внутри head: сначала напиши открывающий тег head.', 'title lives inside head: write the opening head tag first.'),
  hasHtml: L3("html allaqachon bor: tepada va pastda. Uning ichiga yozing.", 'html уже есть: сверху и снизу. Пиши внутри него.', 'html is already there, at the top and bottom. Write inside it.'),
  hasDoctype: L3("Doctype qatori allaqachon eng tepada turibdi.", 'Строка doctype уже стоит в самом верху.', 'The doctype line is already at the very top.'),
  needText: L3("{tag} ichiga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needName: L3("title ichiga sahifa nomini yozing.", 'Напиши название страницы внутри title.', 'Write the page name inside title.'),
  needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} qismi yopilmadi: oxiriga yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  titleOpen: L3("title yopilmadi, shuning uchun qolgan hamma narsa varaqqa chiqib ketdi. Nomdan keyin yopuvchi title tegini yozing.", 'title не закрыт, поэтому всё остальное уехало на вкладку. После названия напиши закрывающий тег title.', 'title isn’t closed, so everything else went onto the tab. Add the closing title tag after the name.'),
  next: L3("Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.'),
  headNotClosed: L3("head hali yopilmadi. body tegidan oldin yopuvchi head tegini yozing.", 'head ещё не закрыт. Перед body напиши закрывающий тег head.', 'head isn’t closed yet. Add the closing head tag before body.'),
  textAfter: L3("Yopuvchi {tag} tegidan keyin matn qolib ketdi. Uni teglar ichiga o'tkazing.", 'После закрывающего тега {tag} остался текст. Перенеси его внутрь тегов.', 'There’s text left after the closing {tag} tag. Move it inside the tags.'),
  extra: L3("Oxirida ortiqcha teg qolibdi: {got}.", 'В конце остался лишний тег: {got}.', 'There’s an extra tag at the end: {got}.'),
  textOut: L3("Brauzer bu matnni oynada baribir ko'rsatadi. Lekin bizning qoidamiz bo'yicha oynadagi matn body ichida turadi.", 'Браузер всё равно покажет этот текст в окне. Но по нашему правилу текст окна стоит внутри body.', 'The browser will still show this text in the window. But by our rule, window text goes inside body.'),
  short: L3("Matn juda qisqa: kamida ikki harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  wrongName: L3("Varaqda «{got}» chiqdi. Bizga «{want}» kerak.", 'На вкладке вышло «{got}». А нужно «{want}».', 'The tab says “{got}”. We need “{want}”.'),
  keepName: L3("Nom «{want}» bo'lib qolsin, faqat qatorni yoping.", 'Пусть название останется «{want}», просто закрой строку.', 'Keep the name “{want}”, just close the line.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Beshta varaq", 'Пять вкладок', 'Five tabs'),
    say: L3("Salom! Bu mening brauzerim. Unda beshta sevimli sahifam ochiq turibdi: musiqa, o'yinlar, ob-havo, kino va yana bitta bo'sh varaq. Kecha ularni yangilamoqchi edim, lekin nimadir bo'ldi. Keling, birga ko'ramiz. «Yangilash» tugmasini bosing.",
      'Привет! Это мой браузер. Здесь открыты пять моих любимых страниц: музыка, игры, погода, кино и ещё одна пустая вкладка. Вчера я хотел их обновить, но что-то случилось. Давай посмотрим вместе. Нажми «Обновить».',
      'Hi! This is my browser. Five of my favourite pages are open here: music, games, weather, movies and one more empty tab. Yesterday I tried to refresh them, but something happened. Let’s look together. Tap “Refresh”.'),
    broke: L3("Voy! Sahifalarning kodi o'chib ketdi. Varaqlarda nom yo'q, oyna esa bo'm-bo'sh.",
      'Ой! Код страниц стёрся. На вкладках нет названий, а окно совсем пустое.',
      'Oh no! The pages’ code got erased. The tabs have no names, and the window is empty.'),
    done: L3("O'tgan darsda sahifa qanday tuzilishini ko'rdik. Endi shu bilim bilan beshta varaqni birma-bir tuzatamiz. Bu safar kodni o'zingiz yozasiz, men esa yoningizdaman. Beshinchi varaq esa sizning o'z sahifangiz bo'ladi!",
      'На прошлом уроке мы разобрали, как устроена страница. Теперь с этими знаниями починим пять вкладок по одной. В этот раз код пишешь ты, а я рядом. А пятая вкладка станет твоей собственной страницей!',
      'Last lesson we saw how a page is built. Now let’s use that to fix the five tabs one by one. This time you write the code, and I’ll be right here. And the fifth tab will become your very own page!'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta varaqni tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять вкладок — код пишешь ты', 'Let’s fix five tabs — you write the code')
  },
  t1: {
    eyebrow: L3("Musiqa", 'Музыка', 'Music'),
    say: L3("Birinchi varaq: musiqa. Kod deyarli joyida, faqat sahifa nomi yo'qolgan. Esingizdami, sahifa nomi title tegi ichida yoziladi, brauzer esa uni varaqda ko'rsatadi. title ichiga «Musiqa» deb yozing-da, «Tekshirish»ni bosing.",
      'Первая вкладка: музыка. Код почти цел, пропало только название страницы. Помнишь, название пишут внутри тега title, а браузер показывает его на вкладке. Впиши в title слово «Музыка» и нажми «Проверить».',
      'The first tab is music. The code is almost fine, only the page name is gone. Remember, the name goes inside the title tag, and the browser shows it on the tab. Type “Music” inside title and tap “Check”.'),
    ask: L3("title ichiga «Musiqa» deb yozing", 'Впиши в title: «Музыка»', 'Type “Music” inside title'),
    ok: L3("Ajoyib! Varaqda «Musiqa» yonib turibdi. Birinchi sahifa tirildi!", 'Отлично! На вкладке горит «Музыка». Первая страница ожила!', 'Great! “Music” is shining on the tab. The first page is back!'),
    hints: [
      L3("Sahifa nomi qaysi tegda yashaydi? Koddan title tegini toping.", 'Где живёт название страницы? Найди в коде тег title.', 'Where does the page name live? Find the title tag in the code.'),
      L3("Ochuvchi va yopuvchi title teglari o'rtasidagi bo'sh joyga yozing.", 'Пиши в пустое место между открывающим и закрывающим тегом title.', 'Type in the empty spot between the opening and closing title tags.'),
      L3("Masalan, kitoblar sahifasida shunday bo'ladi. Siz esa «Musiqa» deb yozing.", 'Например, у страницы про книги — так. А ты впиши «Музыка».', 'For a page about books, it looks like this. You type “Music”.')
    ],
    drill: L3("Endi nomni «Sport» qiling", 'А теперь назови вкладку «Спорт»', 'Now name the tab “Sport”')
  },
  t2: {
    eyebrow: L3("O'yinlar", 'Игры', 'Games'),
    say: L3("Birinchi varaq tayyor, endi o'yinlar. Bu yerda title qatori butunlay o'chib ketgan. head ichidagi bo'sh qatorga uni boshidan oxirigacha yozing: ochuvchi title tegi, «O'yinlar» degan nom va yopuvchi title tegi.",
      'Первая вкладка готова, теперь игры. Здесь строка title стёрлась целиком. Напиши её от начала до конца в пустой строке внутри head: открывающий тег title, название «Игры» и закрывающий тег title.',
      'The first tab is done, now games. Here the title line is gone completely. Write it from start to end in the empty line inside head: the opening title tag, the name “Games” and the closing title tag.'),
    ask: L3("head ichiga title qatorini yozing: nomi «O'yinlar»", 'Напиши строку title: «Игры»', 'Write the title line: “Games”'),
    ok: L3("Barakalla! Butun qatorni o'zingiz yozdingiz, «O'yinlar» varag'i yondi!", 'Вот это да! Вся строка написана твоими руками, и вкладка «Игры» загорелась!', 'Wow! You wrote the whole line, and the “Games” tab lit up!'),
    hints: [
      L3("Sahifa nomi title tegida yoziladi, title esa head ichida turadi. Shu bo'sh qatorga yozing.", 'Название пишут в теге title, а title стоит внутри head. Пиши в эту пустую строку.', 'The name goes in the title tag, and title sits inside head. Type in this empty line.'),
      L3("Qator uch qismdan iborat: ochuvchi title tegi, nom va yopuvchi title tegi. Yopuvchi tegda qiya chiziq bor.", 'В строке три части: открывающий тег title, название и закрывающий тег title. В закрывающем есть косая черта.', 'The line has three parts: the opening title tag, the name and the closing title tag. The closing one has a slash.'),
      L3("Mana, sport sahifasining qatori. Siz ham xuddi shunday yozing, faqat nomi «O'yinlar».", 'Вот строка страницы про спорт. Напиши так же, только с названием «Игры».', 'Here’s the line for a sport page. Write it the same way, just with the name “Games”.')
    ],
    drill: L3("Endi xuddi shunday qator yozing: nomi «Kitoblar»", 'Теперь такую же строку: название «Книги»', 'Now the same kind of line: name “Books”')
  },
  t3: {
    eyebrow: L3("Ob-havo", 'Погода', 'Weather'),
    say: L3("Ikki varaq yondi! Uchinchisi: ob-havo. Nomi joyida, lekin oyna bo'sh: body qismi butunlay yo'qolgan. Esingizdami, oynada ko'rinadigan hamma narsa body ichida turadi. head yopilgan joydan keyin body qismini yozing, ichiga esa ob-havo haqida bir gap.",
      'Две вкладки горят! Третья: погода. Название на месте, но окно пустое: часть body пропала целиком. Помнишь, всё, что видно в окне, стоит внутри body. После того места, где закрылся head, напиши часть body, а внутри — пару слов о погоде.',
      'Two tabs are lit! The third is weather. The name is there, but the window is empty: the body part is gone. Remember, everything you see in the window sits inside body. After the place where head closes, write the body part, with a few words about the weather inside.'),
    ask: L3("body qismini yozing, ichida — «Bugun quyoshli»", 'Напиши часть body, внутри — «Сегодня солнечно»', 'Write the body part, with “Sunny today” inside'),
    ok: L3("Zo'r! Oynada matn paydo bo'ldi. Ob-havo yana ishlayapti!", 'Огонь! В окне появился текст. Погода снова работает!', 'Awesome! Text appeared in the window. The weather works again!'),
    hints: [
      L3("Oynada ko'rinadigan matn body ichida yoziladi. head yopilgandan keyin body boshlanadi.", 'Текст, который виден в окне, пишут внутри body. После закрытого head начинается body.', 'Text you see in the window goes inside body. body starts after head closes.'),
      L3("Uch qator yozing: ochuvchi body tegi, keyin matn, keyin yopuvchi body tegi.", 'Напиши три строки: открывающий тег body, потом текст, потом закрывающий тег body.', 'Write three lines: the opening body tag, then the text, then the closing body tag.'),
      L3("Mana, salom yozilgan body qismi. Siz ham shunday yozing, faqat o'z matningiz bilan.", 'Вот часть body с приветствием. Напиши так же, только со своим текстом.', 'Here’s a body part with a greeting. Write it the same way, with your own text.')
    ],
    drill: L3("Endi yana bir body yozing: ichida — «Ertaga yomg'ir»", 'Теперь ещё один body: внутри — «Завтра дождь»', 'Now one more body: with “Rain tomorrow” inside')
  },
  t4: {
    eyebrow: L3("Kino", 'Кино', 'Movies'),
    say: L3("Uchta varaq tayyor! To'rtinchisi: kino. Qarang, bu yerda g'alati: sahifaning hamma matni varaqqa chiqib ketgan, oyna esa bo'sh. Demak, kodning bir qatori buzilgan. Oldin o'sha qatorni toping va ustiga bosing.",
      'Три вкладки готовы! Четвёртая: кино. Смотри, тут странно: весь текст страницы уехал на вкладку, а окно пустое. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Three tabs are done! The fourth is movies. Look, something’s odd here: all the page text went onto the tab, and the window is empty. So one line of code is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! title ochildi, lekin yopilmadi. Shuning uchun brauzer qolgan hamma narsani nomga qo'shib yubordi. Endi shu qatorni tuzating.",
      'Нашлась! title открыт, но не закрыт. Поэтому браузер приклеил к названию всё остальное. Теперь почини эту строку.',
      'Found it! title opens but never closes. That’s why the browser glued everything else to the name. Now fix this line.'),
    ok: L3("Voy, ishladi! Matn oynaga qaytdi, varaqda esa faqat «Kino». Buzilgan joyni xuddi haqiqiy dasturchidek topdingiz!", 'Ура, заработало! Текст вернулся в окно, а на вкладке только «Кино». Поломка найдена, как у настоящего программиста!', 'Yes, it works! The text is back in the window, and the tab just says “Movies”. You found the bug like a real developer!'),
    why: {
      0: L3("Bu maxsus birinchi qator, u joyida. Varaqqa nima chiqqaniga qarang.", 'Это особая первая строка, она в порядке. Посмотри, что попало на вкладку.', 'That’s the special first line, it’s fine. Look at what ended up on the tab.'),
      1: L3("html shu yerda ochiladi va eng oxirida yopiladi. Bu qator joyida.", 'html открывается здесь и закрывается в самом конце. Эта строка в порядке.', 'html opens here and closes at the very end. This line is fine.'),
      2: L3("head shu yerda ochiladi va pastroqda yopiladi. Bu qator joyida.", 'head открывается здесь и закрывается ниже. Эта строка в порядке.', 'head opens here and closes further down. This line is fine.'),
      4: L3("Bu yopuvchi head tegi, u joyida. Lekin brauzer uni nomning bir qismi deb o'qiyapti. Nega? Bir qator tepaga qarang.", 'Это закрывающий тег head, он на месте. Но браузер читает его как часть названия. Почему? Посмотри на строку выше.', 'That’s the closing head tag, it’s in place. But the browser reads it as part of the name. Why? Look one line up.'),
      5: L3("body to'g'ri ochilgan. Lekin brauzer bu qatorni ham nomga qo'shib yubordi. Sababi teparoqda.", 'body открыт как надо. Но браузер и эту строку приклеил к названию. Причина выше.', 'body opens just fine. But the browser glued this line to the name too. The reason is higher up.'),
      6: L3("Bu oynada chiqishi kerak bo'lgan matn. U joyida, lekin varaqqa chiqib ketgan. Sababi teparoqda.", 'Это текст, который должен быть в окне. Он на месте, но уехал на вкладку. Причина выше.', 'That’s the text that should be in the window. It’s in place, but it went onto the tab. The reason is higher up.'),
      7: L3("body shu yerda yopiladi, bu qator joyida.", 'body закрывается здесь, эта строка в порядке.', 'body closes here, this line is fine.'),
      8: L3("html shu yerda yopiladi, bu qator joyida.", 'html закрывается здесь, эта строка в порядке.', 'html closes here, this line is fine.')
    },
    hints: [
      L3("Varaqda nom bilan birga butun sahifa matni turibdi. Qaysi teg o'z qismini yopishni unutdi?", 'На вкладке рядом с названием стоит весь текст страницы. Какой тег забыл закрыть свою часть?', 'The tab shows the whole page text next to the name. Which tag forgot to close its part?'),
      L3("Sahifa nomi yozilgan qatorga qarang: nomdan keyin nima yetishmayapti?", 'Посмотри на строку с названием страницы: чего не хватает после названия?', 'Look at the line with the page name: what’s missing after the name?'),
      L3("Mana, to'g'ri yopilgan qator. Siz ham nomdan keyin yopuvchi title tegini qo'shing.", 'Вот правильно закрытая строка. Добавь после названия закрывающий тег title.', 'Here’s a properly closed line. Add the closing title tag after the name.')
    ],
    drill: L3("Bu sahifada ham xuddi shunday: buzilgan qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("To'rtta varaq yonib turibdi! Endi beshinchisi: sizning sahifangiz. Bu yerda faqat ramka bor: doctype qatori va html tegi. Uning ichiga sahifani o'zingiz yozing. Oldin head qismi, uning ichida title va o'z nomingiz. Keyin body qismi va ichida istalgan matn. Chizma yo'l ko'rsatib turadi.",
      'Четыре вкладки горят! Теперь пятая: твоя страница. Здесь есть только рамка: строка doctype и тег html. Внутри напиши страницу сам. Сначала часть head, в ней title и твоё название. Потом часть body и внутри любой текст. Схема подскажет дорогу.',
      'Four tabs are lit! Now the fifth one: your page. There’s only a frame here: the doctype line and the html tag. Write the page inside it yourself. First the head part, with title and your own name in it. Then the body part with any text inside. The plan will show you the way.'),
    ask: L3("html ichiga yozing: head, title va body", 'Напиши в html: head, title и body', 'Write inside html: head, title and body'),
    ok: L3("Bu juda zo'r chiqdi! Butun sahifani o'zingiz yozdingiz. Varaqda sizning nomingiz yonib turibdi!", 'Это было мощно! Вся страница твоя, и на вкладке горит твоё название!', 'That was awesome! You wrote the whole page. Your name is shining on the tab!'),
    hints: [
      L3("Chizmaga qarang: html ichida oldin head, keyin body keladi.", 'Посмотри на схему: внутри html сначала head, потом body.', 'Look at the plan: inside html, first head, then body.'),
      L3("head ichiga title yozing, title ichiga esa nom. Har bir ochilgan teg o'z yopuvchi tegi bilan yopiladi.", 'Внутри head напиши title, а в title — название. Каждый открытый тег закрывается своим закрывающим.', 'Inside head write title, and the name inside title. Every opened tag is closed by its own closing tag.'),
      L3("Mana, sport sahifasining ichki qismi. Xuddi shunday yozing, faqat o'z nomingiz va o'z matningiz bilan.", 'Вот внутренняя часть страницы про спорт. Напиши так же, только со своим названием и своим текстом.', 'Here’s the inside of a sport page. Write it the same way, with your own name and text.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, beshta varaqning hammasi yonib turibdi! Sahifalarni siz qutqardingiz.", 'Смотри, все пять вкладок горят! Страницы спасены — и это твоя работа.', 'Look, all five tabs are lit! You saved the pages.') },
      { k: 'title', text: L3("Sahifa nomini title tegiga yozdingiz, brauzer uni varaqda ko'rsatdi.", 'Название страницы стояло в теге title, и браузер показал его на вкладке.', 'You wrote the page name in the title tag, and the browser showed it on the tab.') },
      { k: 'body', text: L3("Oynadagi matnni body ichiga joyladingiz.", 'Текст для окна оказался внутри body.', 'You put the window text inside body.') },
      { k: 'close', text: L3("Ochilgan har bir tegni yopdingiz va buzilgan qatorni ham topdingiz.", 'Каждый открытый тег закрыт, и сломанная строка найдена.', 'You closed every opened tag and even found the broken line.') },
      { k: 'own', text: L3("Oxirida esa butun sahifani o'zingiz yozdingiz. Bu juda kuchli bo'ldi! Keyingi darsda sahifaga katta sarlavha va abzaslar qo'shamiz.", 'А в конце вся страница написана твоими руками. Это было мощно! На следующем уроке добавим на страницу большой заголовок и абзацы.', 'And at the end you wrote a whole page yourself. That was awesome! Next lesson we’ll add a big heading and paragraphs to the page.') }
    ],
    roles: {
      title: L3("title — varaqdagi nom", 'title — название на вкладке', 'title — the name on the tab'),
      body: L3("body — oynadagi matn", 'body — текст в окне', 'body — the text in the window'),
      close: L3("Har bir ochilgan teg yopiladi", 'Каждый открытый тег закрывается', 'Every opened tag gets closed'),
      own: L3("Sahifani noldan yozdim", 'Страница написана с нуля', 'I wrote a page from scratch')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { title: 1, body: 1, close: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a1-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a1.css@*/
`;
