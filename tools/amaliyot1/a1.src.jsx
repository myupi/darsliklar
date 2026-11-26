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
  empty: L3("Bu yer hali bo'm-bo'sh-ku. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari qiya chiziq «\\» bo'lib qolibdi. Yopuvchi tegda esa oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("Tegning oxiri tushib qolibdi, o'ng burchakli qavs «>» yo'q ekan: \u2063«{bad}»\u2064.", 'В конце тега не хватает уголка «>»: \u2063«{bad}»\u2064.', 'This tag is missing the bracket “>” at the end: \u2063“{bad}”\u2064.'),
  noLt: L3("Tegning boshi tushib qolibdi: teg doim chap burchakli qavs «<» bilan boshlanadi. Bu yerda esa u yo'q: \u2063«{bad}»\u2064.", 'Тег начинается с уголка «<», а здесь его нет: \u2063«{bad}»\u2064.', 'A tag starts with the bracket “<”, but it’s missing here: \u2063“{bad}”\u2064.'),
  typo: L3("Brauzer bunday tegni bilmaydi: \u2063«{bad}»\u2064. Balki «{near}» demoqchi edingiz?", 'Такого тега нет: \u2063«{bad}»\u2064. Может быть, «{near}»?', 'There’s no such tag: \u2063“{bad}”\u2064. Did you mean “{near}”?'),
  unknown: L3("Bunday tegni bugun ishlatmaymiz: \u2063«{bad}»\u2064. Bizga faqat html, head, title va body kerak.", 'Такого тега на нашей странице нет: \u2063«{bad}»\u2064. У нас только html, head, title и body.', 'Our page has no such tag: \u2063“{bad}”\u2064. We only have html, head, title and body.'),
  emptyTag: L3("Qavslar bor-u, ichi bo'sh qolibdi. Burchakli qavslar ichida teg nomi turishi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  needOpenText: L3("Shoshilmang: matndan oldin ochuvchi {tag} tegi turishi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeFirst: L3("Bu yopuvchi \u2063{got}\u2064 tegi-ku. Bu joyda esa oldin ochuvchi {tag} tegi kelishi kerak.", 'Это закрывающий тег \u2063{got}\u2064. Здесь сначала нужен открывающий тег {tag}.', 'That’s the closing \u2063{got}\u2064 tag. First you need the opening {tag} tag here.'),
  order: L3("Tartib almashib qolibdi: bu yerda oldin {tag} keladi. Siz yozgan teg esa keyinroq turishi kerak: \u2063{got}\u2064.", 'Порядок другой: сначала идёт {tag}. Твой тег должен идти позже: \u2063{got}\u2064.', 'The order is off: {tag} comes first. Your tag should come later: \u2063{got}\u2064.'),
  wrongOpen: L3("Bu yerga {tag} tegi kerak, boshqa teg emas: \u2063{got}\u2064.", 'Здесь нужен тег {tag}, другой не подойдёт: \u2063{got}\u2064.', 'You need the {tag} tag here, not another one: \u2063{got}\u2064.'),
  titleOut: L3("title head ichida yashaydi-ku. Shuning uchun oldin ochuvchi head tegini yozing.", 'title живёт внутри head: сначала напиши открывающий тег head.', 'title lives inside head: write the opening head tag first.'),
  hasHtml: L3("html teglari allaqachon bor-ku: biri tepada, biri pastda. Siz ularning o'rtasiga yozing.", 'html уже есть: сверху и снизу. Пиши внутри него.', 'html is already there, at the top and bottom. Write inside it.'),
  hasDoctype: L3("Doctype qatorini qayta yozish shart emas, u allaqachon eng tepada turibdi.", 'Строка doctype уже стоит в самом верху.', 'The doctype line is already at the very top.'),
  needText: L3("{tag} ichida hali hech narsa yo'q. Bir-ikki so'z yozsangiz ham yetadi.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needName: L3("Sahifaning nomi qani? Uni title ichiga yozing.", 'Напиши название страницы внутри title.', 'Write the page name inside title.'),
  needSlash: L3("Oz qoldi! Bu ochuvchi teg-ku. Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» bo'ladi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} qismi ochiq qolibdi. Uning oxiriga yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  titleOpen: L3("title yopilmagani uchun brauzer pastdagi hamma narsani ham varaqqa chiqarib yuboribdi. Nomdan keyin yopuvchi title tegini yozing.", 'title не закрыт, поэтому всё остальное уехало на вкладку. После названия напиши закрывающий тег title.', 'title isn’t closed, so everything else went onto the tab. Add the closing title tag after the name.'),
  next: L3("Yaxshi boshladingiz! Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.'),
  headNotClosed: L3("head hali ochiq turibdi. body boshlanishidan oldin uni yopuvchi head tegi bilan yoping.", 'head ещё не закрыт. Перед body напиши закрывающий тег head.', 'head isn’t closed yet. Add the closing head tag before body.'),
  textAfter: L3("Yopuvchi {tag} tegidan keyin matn qolib ketibdi. Uni teglarning ichiga ko'chiring.", 'После закрывающего тега {tag} остался текст. Перенеси его внутрь тегов.', 'There’s text left after the closing {tag} tag. Move it inside the tags.'),
  extra: L3("Oxirida bitta ortiqcha teg qolib ketibdi: \u2063{got}\u2064.", 'В конце остался лишний тег: \u2063{got}\u2064.', 'There’s an extra tag at the end: \u2063{got}\u2064.'),
  textOut: L3("Brauzer bu matnni oynada baribir ko'rsataveradi. Lekin oynadagi matn body ichida turishi kerak: shunda sahifaning tartibi buzilmaydi.", 'Браузер всё равно покажет этот текст в окне. Но по нашему правилу текст окна стоит внутри body.', 'The browser will still show this text in the window. But by our rule, window text goes inside body.'),
  short: L3("Juda qisqa chiqdi: kamida ikkita harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  wrongName: L3("Varaqqa boshqa nom chiqib qoldi: \u2063«{got}»\u2064. Bizga esa «{want}» kerak.", 'На вкладке вышло другое название: \u2063«{got}»\u2064. А нужно «{want}».', 'The tab shows a different name: \u2063“{got}”\u2064. We need “{want}”.'),
  keepName: L3("Nomga tegmang, u «{want}» bo'lib qolsin. Faqat qatorni yoping.", 'Пусть название останется «{want}», просто закрой строку.', 'Keep the name “{want}”, just close the line.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Beshta varaq", 'Пять вкладок', 'Five tabs'),
    say: L3("Brauzerimda nechta varaq ochiq turibdi, sanab ko'ring-chi: beshta! Musiqa, o'yinlar, ob-havo va kino sahifalari bor, beshinchisi esa hozircha bo'sh. Kecha ularni yangilamoqchi bo'lgandim, kompyuterim qotib qoldi. Keling, nima bo'lganini birga ko'ramiz: «Yangilash» tugmasini bosing.",
      'Привет! Это мой браузер. Здесь открыты пять моих любимых страниц: музыка, игры, погода, кино и ещё одна пустая вкладка. Вчера я хотел их обновить, но что-то случилось. Давай посмотрим вместе. Нажми «Обновить».',
      'Hi! This is my browser. Five of my favourite pages are open here: music, games, weather, movies and one more empty tab. Yesterday I tried to refresh them, but something happened. Let’s look together. Tap “Refresh”.'),
    broke: L3("Oo, varaqlarga qarang: birortasida ham nom yo'q! Oynam ham bo'm-bo'sh, demak, sahifalarimning kodidan bo'laklar tushib qolgan.",
      'Ой! Код страниц стёрся. На вкладках нет названий, а окно совсем пустое.',
      'Oh no! The pages’ code got erased. The tabs have no names, and the window is empty.'),
    done: L3("Tushib qolganlarini sanab chiqdim: har varaqdan bittadan, hammasi beshta. Ularning hammasini o'tgan darsda o'rgangansiz, shuning uchun o'zingiz tuzata olasiz. Varaqlarni men ketma-ket ochib beraman. Bo'sh varaq esa oxirida sizniki: unga o'z sahifangizni yozasiz.",
      'На прошлом уроке мы разобрали, как устроена страница. Теперь с этими знаниями починим пять вкладок по одной. В этот раз код пишешь ты, а я рядом. А пятая вкладка станет твоей собственной страницей!',
      'Last lesson we saw how a page is built. Now let’s use that to fix the five tabs one by one. This time you write the code, and I’ll be right here. And the fifth tab will become your very own page!'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta varaqni tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять вкладок — код пишешь ты', 'Let’s fix five tabs — you write the code')
  },
  t1: {
    eyebrow: L3("Musiqa", 'Музыка', 'Music'),
    say: L3("Musiqadan boshlaymiz, usiz ishlashim qiyin! Bu varaqda kod deyarli butun, sahifaning nomi yo'qolibdi, xolos. Nom title tegining ichiga yozilishini, brauzer esa uni varaqqa chiqarishini eslaysizmi? Qani, title ichiga «Musiqa» deb yozing-da, «Tekshirish»ni bosing.",
      'Первая вкладка: музыка. Код почти цел, пропало только название страницы. Помнишь, название пишут внутри тега title, а браузер показывает его на вкладке. Впиши в title слово «Музыка» и нажми «Проверить».',
      'The first tab is music. The code is almost fine, only the page name is gone. Remember, the name goes inside the title tag, and the browser shows it on the tab. Type “Music” inside title and tap “Check”.'),
    ask: L3("title ichiga «Musiqa» deb yozing", 'Впиши в title: «Музыка»', 'Type “Music” inside title'),
    ok: L3("Varaqda «Musiqa» yonib turibdi, birinchi sahifam tirildi! Qo'shiqlarimni yana eshitaman.", 'Отлично! На вкладке горит «Музыка». Первая страница ожила!', 'Great! “Music” is shining on the tab. The first page is back!'),
    hints: [
      L3("Sahifaning nomi qaysi tegda yashaydi? Kodga qarab, title tegini topib ko'ring-chi.", 'Где живёт название страницы? Найди в коде тег title.', 'Where does the page name live? Find the title tag in the code.'),
      L3("Ikkita title tegini ko'ryapsizmi, biri ochuvchi, biri yopuvchi? Nom ularning aynan o'rtasiga tushadi.", 'Пиши в пустое место между открывающим и закрывающим тегом title.', 'Type in the empty spot between the opening and closing title tags.'),
      L3("Namunada kitoblar sahifasi turibdi: unda ham nom title ichida, ikkita teg o'rtasida. Musiqa varag'ida ham shunday bo'ladi.", 'Например, у страницы про книги — так. А ты впиши «Музыка».', 'For a page about books, it looks like this. You type “Music”.')
    ],
    drill: L3("Endi nomni «Sport» qiling", 'А теперь назови вкладку «Спорт»', 'Now name the tab “Sport”')
  },
  t2: {
    eyebrow: L3("O'yinlar", 'Игры', 'Games'),
    say: L3("Musiqa yana chalinyapti, endi o'yinlar! Bu yerda ahvol battarroq: title qatorining o'zi yo'q. Uch bo'lakni ketma-ket yozasiz: oldin ochuvchi title tegi, undan keyin «O'yinlar» degan nom, eng oxirida yopuvchi title tegi. head ichidagi bo'sh qatorni topdingizmi? Aynan shu yerga yozing.",
      'Первая вкладка готова, теперь игры. Здесь строка title стёрлась целиком. Напиши её от начала до конца в пустой строке внутри head: открывающий тег title, название «Игры» и закрывающий тег title.',
      'The first tab is done, now games. Here the title line is gone completely. Write it from start to end in the empty line inside head: the opening title tag, the name “Games” and the closing title tag.'),
    ask: L3("head ichiga title qatorini yozing: nomi «O'yinlar»", 'Напиши строку title: «Игры»', 'Write the title line: “Games”'),
    ok: L3("Qatorni boshidan oxirigacha o'zingiz yozdingiz-u, «O'yinlar» varag'i yonib ketdi! Shaxmat doskam meni kutyapti.", 'Вот это да! Вся строка написана твоими руками, и вкладка «Игры» загорелась!', 'Wow! You wrote the whole line, and the “Games” tab lit up!'),
    hints: [
      L3("Qayerdan boshlaymiz? Sahifaning nomi title tegida bo'ladi, title esa head ichida yashaydi. Demak, qator head ichidagi shu bo'sh joyga yoziladi.", 'Название пишут в теге title, а title стоит внутри head. Пиши в эту пустую строку.', 'The name goes in the title tag, and title sits inside head. Type in this empty line.'),
      L3("Bu qatorda uchta bo'lak bor: ochuvchi title tegi, nom va yopuvchi title tegi. Yopuvchisini qiya chizig'idan tanib olasiz.", 'В строке три части: открывающий тег title, название и закрывающий тег title. В закрывающем есть косая черта.', 'The line has three parts: the opening title tag, the name and the closing title tag. The closing one has a slash.'),
      L3("Namuna tagida sport varag'ining title qatori turibdi. Uchta bo'lakni ko'ring, siz ham aynan shu uchtani «O'yinlar» bilan yozasiz.", 'Вот строка страницы про спорт. Напиши так же, только с названием «Игры».', 'Here’s the line for a sport page. Write it the same way, just with the name “Games”.')
    ],
    drill: L3("Endi xuddi shunday qator yozing: nomi «Kitoblar»", 'Теперь такую же строку: название «Книги»', 'Now the same kind of line: name “Books”')
  },
  t3: {
    eyebrow: L3("Ob-havo", 'Погода', 'Weather'),
    say: L3("Ertalab soyabon olaymi-yo'qmi, ob-havo varag'idan bilaman. Nomi joyida, oynasi esa bo'm-bo'sh: body qismi butunlay yo'qolibdi. Oynada ko'rinadigan hamma narsa body ichida turishini eslaysizmi? Demak, uni qaytarish kerak. head yopilgan joydan keyin body qismini yozing, ichiga esa ob-havo haqida bitta gap qo'shing, masalan, «Bugun quyoshli».",
      'Две вкладки горят! Третья: погода. Название на месте, но окно пустое: часть body пропала целиком. Помнишь, всё, что видно в окне, стоит внутри body. После того места, где закрылся head, напиши часть body, а внутри — пару слов о погоде.',
      'Two tabs are lit! The third is weather. The name is there, but the window is empty: the body part is gone. Remember, everything you see in the window sits inside body. After the place where head closes, write the body part, with a few words about the weather inside.'),
    ask: L3("body qismini yozing, ichida — «Bugun quyoshli»", 'Напиши часть body, внутри — «Сегодня солнечно»', 'Write the body part, with “Sunny today” inside'),
    ok: L3("Oynada matn paydo bo'ldi, ob-havo varag'i qaytdi! Ertaga nima kiyishni endi bilaman.", 'Огонь! В окне появился текст. Погода снова работает!', 'Awesome! Text appeared in the window. The weather works again!'),
    hints: [
      L3("Oynadagi matn qayerda yashaydi? body ichida! body esa head yopilgandan keyin boshlanadi.", 'Текст, который виден в окне, пишут внутри body. После закрытого head начинается body.', 'Text you see in the window goes inside body. body starts after head closes.'),
      L3("Bu safar uchta qator kerak bo'ladi: tepada ochuvchi body tegi, o'rtada matn, pastda yopuvchi body tegi.", 'Напиши три строки: открывающий тег body, потом текст, потом закрывающий тег body.', 'Write three lines: the opening body tag, then the text, then the closing body tag.'),
      L3("Namunada oddiy salomlashuvli body bor: ochiladi, ichida gap, yopiladi. Siz salom o'rniga ob-havo haqida yozasiz.", 'Вот часть body с приветствием. Напиши так же, только со своим текстом.', 'Here’s a body part with a greeting. Write it the same way, with your own text.')
    ],
    drill: L3("Endi yana bir body yozing: ichida — «Ertaga yomg'ir»", 'Теперь ещё один body: внутри — «Завтра дождь»', 'Now one more body: with “Rain tomorrow” inside')
  },
  t4: {
    eyebrow: L3("Kino", 'Кино', 'Movies'),
    say: L3("Kino varag'ida g'alati ish bor: butun matn varaqqa chiqib ketgan, oyna esa bo'sh! Sizningcha, qaysi qator aybdor? Varaqdagi ortiqcha so'zlarga qarab, uni kodda toping-da, ustiga bosing.",
      'Три вкладки готовы! Четвёртая: кино. Смотри, тут странно: весь текст страницы уехал на вкладку, а окно пустое. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Three tabs are done! The fourth is movies. Look, something’s odd here: all the page text went onto the tab, and the window is empty. So one line of code is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Aynan shu qator: title ochilgan-u, yopilmagan! Brauzer nom qayerda tugashini bilmay, pastdagi hamma narsani nomga qo'shib yuboribdi. Yopuvchi tegni o'zingiz qo'ying.",
      'Нашлась! title открыт, но не закрыт. Поэтому браузер приклеил к названию всё остальное. Теперь почини эту строку.',
      'Found it! title opens but never closes. That’s why the browser glued everything else to the name. Now fix this line.'),
    ok: L3("Voy, ishladi! Matn oynaga qaytib tushdi, varaqda esa faqat «Kino» qoldi. Kichkina bitta yopuvchi teg shuncha ishni qilar ekan-a! Endi kechqurun bemalol multfilm ko'raman.", 'Ура, заработало! Текст вернулся в окно, а на вкладке только «Кино». Поломка найдена, как у настоящего программиста!', 'Yes, it works! The text is back in the window, and the tab just says “Movies”. You found the bug like a real developer!'),
    why: {
      0: L3("Bu doctype qatori, u doim eng tepada turadi. Aybni boshqa joydan qidiring: varaqda nima ortiqcha chiqib turibdi?", 'Это особая первая строка, она в порядке. Посмотри, что попало на вкладку.', 'That’s the special first line, it’s fine. Look at what ended up on the tab.'),
      1: L3("Bu html tegi-ku, uni yopuvchi jufti eng pastda turibdi. Boshqa qatorni tekshiring.", 'html открывается здесь и закрывается в самом конце. Эта строка в порядке.', 'html opens here and closes at the very end. This line is fine.'),
      2: L3("head ham o'z joyida: shu yerda ochilib, sal pastroqda yopiladi.", 'head открывается здесь и закрывается ниже. Эта строка в порядке.', 'head opens here and closes further down. This line is fine.'),
      4: L3("Bu yopuvchi head tegi, o'zi joyida turibdi. Lekin brauzer uni nomning bir bo'lagi deb o'qiyapti. Nega shunday bo'larkin? Javobni bir qator tepadan qidiring.", 'Это закрывающий тег head, он на месте. Но браузер читает его как часть названия. Почему? Посмотри на строку выше.', 'That’s the closing head tag, it’s in place. But the browser reads it as part of the name. Why? Look one line up.'),
      5: L3("body to'g'ri ochilgan-ku. Brauzer uni ham nomga qo'shib yuboribdi, demak, sababi teparoqda.", 'body открыт как надо. Но браузер и эту строку приклеил к названию. Причина выше.', 'body opens just fine. But the browser glued this line to the name too. The reason is higher up.'),
      6: L3("Bu matn aslida oynada chiqishi kerak edi. O'zi joyida, lekin varaqqa chiqib ketibdi. Aybdor teparoqda yashiringan.", 'Это текст, который должен быть в окне. Он на месте, но уехал на вкладку. Причина выше.', 'That’s the text that should be in the window. It’s in place, but it went onto the tab. The reason is higher up.'),
      7: L3("Mana body ham yopildi, bu qator butun. Sababi boshqa joyda.", 'body закрывается здесь, эта строка в порядке.', 'body closes here, this line is fine.'),
      8: L3("Eng oxirgi qator: html shu yerda tugaydi. Bunisi ham buzilmagan.", 'html закрывается здесь, эта строка в порядке.', 'html closes here, this line is fine.')
    },
    hints: [
      L3("Varaqqa qarang-chi: nom bilan birga butun sahifaning matni chiqib turibdi. Qaysi teg o'z qismini yopishni unutib qo'ydi ekan?", 'На вкладке рядом с названием стоит весь текст страницы. Какой тег забыл закрыть свою часть?', 'The tab shows the whole page text next to the name. Which tag forgot to close its part?'),
      L3("Endi sahifaning nomi yozilgan qatorga yaqinroq qarang: nomdan keyin nima yetishmayapti?", 'Посмотри на строку с названием страницы: чего не хватает после названия?', 'Look at the line with the page name: what’s missing after the name?'),
      L3("Yopilgan title qatori qanday ko'rinadi? Namunada ko'ring: nomdan keyin qiya chiziqli teg turadi. Sizniki ham shunday tugasin.", 'Вот правильно закрытая строка. Добавь после названия закрывающий тег title.', 'Here’s a properly closed line. Add the closing title tag after the name.')
    ],
    drill: L3("Yana bir varaqda ham qator buzilgan: topib, tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Eng qizig'i qoldi: beshinchi, bo'sh varaq sizniki! Qanday sahifa yasagingiz keladi, o'yin haqidami yoki futbol haqidami? Hozircha unda ramka bor, xolos: doctype qatori va ikkita html tegi. Oldin head yozing, ichida title bilan o'zingiz o'ylagan nom. Keyin body, ichida xohlagan matningiz. Chizma yoningizda turibdi.",
      'Четыре вкладки горят! Теперь пятая: твоя страница. Здесь есть только рамка: строка doctype и тег html. Внутри напиши страницу сам. Сначала часть head, в ней title и твоё название. Потом часть body и внутри любой текст. Схема подскажет дорогу.',
      'Four tabs are lit! Now the fifth one: your page. There’s only a frame here: the doctype line and the html tag. Write the page inside it yourself. First the head part, with title and your own name in it. Then the body part with any text inside. The plan will show you the way.'),
    ask: L3("html ichiga yozing: head, title va body", 'Напиши в html: head, title и body', 'Write inside html: head, title and body'),
    ok: L3("Bo'sh ramkadan butun sahifa chiqdi! Varaqda o'zingiz o'ylagan nom yonib turibdi, oynada esa o'z gapingiz.", 'Это было мощно! Вся страница твоя, и на вкладке горит твоё название!', 'That was awesome! You wrote the whole page. Your name is shining on the tab!'),
    hints: [
      L3("Chizmaga bir qarang-chi: html ichida oldin head turadi, keyin body keladi.", 'Посмотри на схему: внутри html сначала head, потом body.', 'Look at the plan: inside html, first head, then body.'),
      L3("head ichiga title kiradi, title ichiga esa nom. Har bir ochgan tegingizni o'zining yopuvchi tegi bilan yopishni unutmang.", 'Внутри head напиши title, а в title — название. Каждый открытый тег закрывается своим закрывающим.', 'Inside head write title, and the name inside title. Every opened tag is closed by its own closing tag.'),
      L3("Namunada sport sahifasining ichi ochiq turibdi: oldin head, keyin body. Sizning sahifangizda ham tartib shunday, nom bilan matn esa o'zingizniki.", 'Вот внутренняя часть страницы про спорт. Напиши так же, только со своим названием и своим текстом.', 'Here’s the inside of a sport page. Write it the same way, with your own name and text.')
    ]
  },
  drill: {
    say: L3("Namunaga qarab yozdingiz. Endi kichkina sinov: bu varaq uchun namuna yo'q, kodni xotirangizdan yozasiz.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Xotiradan yozdingiz, demak, bu varaq o'zingizniki bo'ldi!", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Mana, brauzerim yana ishga tushdi, kompyuterim ham qotmayapti: musiqa, o'yinlar, ob-havo va kino yonib turibdi!", 'Смотри, все пять вкладок горят! Страницы спасены — и это твоя работа.', 'Look, all five tabs are lit! You saved the pages.') },
      { k: 'title', text: L3("Sahifaning nomi title tegida turdi, brauzer esa uni varaqqa chiqardi: kompyuterim qotgan edi-yu, endi hammasi o'z joyida!", 'Название страницы стояло в теге title, и браузер показал его на вкладке.', 'You wrote the page name in the title tag, and the browser showed it on the tab.') },
      { k: 'body', text: L3("Matnni body ichiga qo'ydingiz, shuning uchun u oynada chiqdi.", 'Текст для окна оказался внутри body.', 'You put the window text inside body.') },
      { k: 'close', text: L3("Har bir ochgan tegingizni yopdingiz, kino varag'ida yopilmay qolgan title tegini ham o'zingiz topdingiz.", 'Каждый открытый тег закрыт, и сломанная строка найдена.', 'You closed every opened tag and even found the broken line.') },
      { k: 'own', text: L3("Beshinchi varaq esa endi bo'm-bo'sh emas: unda o'zingiz yozgan sahifa turibdi! Katta sarlavha bilan abzaslar hali yo'q: ular sahifangizni navbatdagi darsda to'ldiradi.", 'А в конце вся страница написана твоими руками. Это было мощно! На следующем уроке добавим на страницу большой заголовок и абзацы.', 'And at the end you wrote a whole page yourself. That was awesome! Next lesson we’ll add a big heading and paragraphs to the page.') }
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
