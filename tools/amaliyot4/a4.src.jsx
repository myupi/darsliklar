// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 4 — «Путешествие Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot4/build.mjs → lessons/html/04p-ssylki-i-atributy.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 4 · «Путешествие Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на основе практики 03p — tools/amaliyot3). Коди сделал сайт о поездке по
// Узбекистану: главная и страницы городов, связанные ссылками. При сохранении ссылки оборвались — названия
// городов стали простым текстом. Ученик чинит страницы по одной и сам пишет код: имя файла в href →
// строка-ссылка на главную → абзац со ссылкой внутри (смесь с уроком 2) → найти a без href (загадка
// урока 4) → своя страница: h1, p и ссылка внутри. Карта — вкладки браузера, как в 01p–03p. Ссылки в
// браузере нажимаются: страница открывается, адрес меняется, стрелка «назад» возвращает; нет файла —
// «Fayl topilmadi». 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-04p-ssylki-i-atributy.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a4-screens.jsx) находит теги, атрибуты и текст, страницу рисует
//     React. Браузер честный, как в уроке 4: a с href — синяя подчёркнутая ссылка, a без href — простой
//     текст, нет такого файла — «Fayl topilmadi», без </a> ссылкой становится и текст дальше.
//   · Код — часть body, как в уроках 2–4; в задании 1 — готовый код с пустым href.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; havola, atribut, qiymat, manzil,
//     qo'shtirnoq, fayl nomi — как в уроке 4. В речи тег a — «A», href — по-английски. Символов (= " /)
//     в звучащих фразах нет. RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-04p-ssylki-i-atributy',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: "4-amaliyot. Kodining sayohati",
    ru: 'Практика 4. Путешествие Коди',
    en: 'Practice 4. Kodi’s trip'
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
  save: L3("Saqlash", 'Сохранить', 'Save'),
  drill: L3("Qo'shimcha", 'Ещё разок', 'Bonus'),
  sample: L3("Namuna", 'Образец', 'Example'),
  workReady: L3("Ish tayyor", 'Работа готова', 'Work is ready'),
  nextLesson: L3("Keyingi dars", 'Следующий урок', 'Next lesson'),
  next: L3("Rasmlar", 'Изображения', 'Images'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga faqat fayl nomini yozing: qo'shtirnoq va burchakli qavslar kerak emas.", 'Здесь нужно только имя файла: без кавычек и уголков.', 'Only the file name here: no quotes or angle brackets.'),
  files: L3("Saytdagi fayllar", 'Файлы сайта', 'Site files'),
  nf: L3("Fayl topilmadi", 'Файл не найден', 'File not found'),
  nfText: L3("Bunday fayl saytda yo'q.", 'Такого файла на сайте нет.', 'There’s no such file on the site.'),
  part: {
    open: L3("ochuvchi teg", 'открывающий', 'opening tag'),
    words: L3("so'zlar", 'слова', 'words'),
    close: L3("yopuvchi teg", 'закрывающий', 'closing tag')
  },
  bpH1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'),
  bpP: L3("abzas", 'абзац', 'paragraph'),
  bpA: L3("havola: href va fayl nomi", 'ссылка: href и имя файла', 'link: href and a file name'),
  given: L3("bor", 'уже есть', 'already there'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening sahifam", 'Моя страница', 'My page'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// САЙТ ПУТЕШЕСТВИЯ — файлы, на которые ведут ссылки (страницы рисуются из кода body). h — заголовок, p — абзац.
// ─────────────────────────────────────────────────────────────────────────────
const CITY = {
  toshkent: L3("Toshkent", 'Ташкент', 'Tashkent'),
  samarqand: L3("Samarqand", 'Самарканд', 'Samarkand'),
  buxoro: L3("Buxoro", 'Бухара', 'Bukhara'),
  xiva: L3("Xiva", 'Хива', 'Khiva')
};
const HOME = L3("Bosh sahifa", 'Главная', 'Home');
const NEXT_CITY = L3("Keyingi shahar:", 'Следующий город:', 'Next city:');
const SITE = {
  'index.html': { title: L3("Kodining sayohati", 'Путешествие Коди', 'Kodi’s trip'), p: L3("Qaysi shaharga boramiz?", 'В какой город поедем?', 'Which city shall we visit?') },
  'toshkent.html': { title: CITY.toshkent, p: L3("Poytaxt. Metro bekatlari xuddi saroyga o'xshaydi.", 'Столица. Станции метро похожи на дворцы.', 'The capital. The metro stations look like palaces.') },
  'samarqand.html': { title: CITY.samarqand, p: L3("Registon maydoni juda chiroyli.", 'Площадь Регистан очень красивая.', 'Registan Square is beautiful.') },
  'buxoro.html': { title: CITY.buxoro, p: L3("Qadimiy shahar, minoralari baland.", 'Древний город с высокими минаретами.', 'An ancient city with tall minarets.') },
  'xiva.html': { title: CITY.xiva, p: L3("Ichan qal'a: shahar ichidagi shahar.", 'Ичан-Кала: город внутри города.', 'Itchan Kala: a city within a city.') }
};
const SITE_FILES = Object.keys(SITE);
// ПЯТЬ ВКЛАДОК — объекты карты: файл, значок, цвет. Пятая — своя страница ученика.
const TABS = [
  { id: 'home', file: 'index.html', ico: 'home', c: '#FA4F28', name: SITE['index.html'].title },
  { id: 'tash', file: 'toshkent.html', ico: 'pin', c: '#7C5CFA', name: CITY.toshkent },
  { id: 'sam', file: 'samarqand.html', ico: 'dome', c: '#0FA38E', name: CITY.samarqand },
  { id: 'bux', file: 'buxoro.html', ico: 'flag', c: '#F59E0B', name: CITY.buxoro },
  { id: 'mine', file: 'mening.html', ico: 'star', c: '#E44D26', name: L3("Mening sahifam", 'Моя страница', 'My page') }
];
// Содержимое образцов (другое, чем в задании).
const XTRA = {
  ownH: L3("Mening sayohatim", 'Моя поездка', 'My trip'),
  ownP: L3("Men Xivaga borishni xohlayman.", 'Я хочу поехать в Хиву.', 'I want to go to Khiva.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {near} — похожий тег.
// В звучащих узбекских фразах нет тире и символов (= " /): движок делает из тире точку.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari chiziq «\\». Yopuvchi tegda oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("«{bad}» tegining oxirida o'ng burchakli qavs «>» yo'q.", 'В конце тега «{bad}» не хватает уголка «>».', 'The tag “{bad}” is missing the bracket “>” at the end.'),
  noLt: L3("«{bad}»: teg chap burchakli qavs «<» bilan boshlanadi.", '«{bad}» — тег начинается с уголка «<».', '“{bad}” — a tag starts with the bracket “<”.'),
  typo: L3("«{bad}» degan teg yo'q. Balki «{near}» demoqchisiz?", '«{bad}» — такого тега нет. Может быть, «{near}»?', '“{bad}” — there’s no such tag. Did you mean “{near}”?'),
  unknown: L3("«{bad}» tegi bizning sahifamizda yo'q. Havola uchun bizda a tegi bor.", 'Тега «{bad}» на нашей странице нет. Для ссылки у нас есть тег a.', 'Our page has no “{bad}” tag. For a link we have the a tag.'),
  noLevel: L3("«{bad}» degan sarlavha yo'q: sarlavhalar h1 tegidan h6 tegigacha bo'ladi.", 'Заголовка «{bad}» нет: заголовки бывают от h1 до h6.', 'There’s no “{bad}” heading: headings go from h1 to h6.'),
  emptyTag: L3("Burchakli qavslar ichida teg nomi bo'lishi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Bu yerga faqat body ichidagi qismni yozing: qolgani allaqachon bor.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body allaqachon bor: tepada va pastda. Uning ichiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Matndan oldin ochuvchi {tag} tegi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeFirst: L3("Bu yopuvchi {got} tegi. Bu yerda oldin ochuvchi {tag} tegi kerak.", 'Это закрывающий тег {got}. Здесь сначала нужен открывающий тег {tag}.', 'That’s the closing {got} tag. First you need the opening {tag} tag here.'),
  closeStray: L3("Bu yopuvchi {got} tegi, lekin {got} ochilmagan.", 'Это закрывающий тег {got}, но {got} не открыт.', 'That’s the closing {got} tag, but {got} was never opened.'),
  wrongOpen: L3("Bu yerda {tag} tegi kerak, {got} emas.", 'Здесь нужен тег {tag}, а не {got}.', 'You need the {tag} tag here, not {got}.'),
  needText: L3("{tag} ichiga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} qismi yopilmadi: oxiriga yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmadi, shuning uchun pastdagi hamma narsa ham katta bo'lib ketdi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  textAfter: L3("Yopuvchi {tag} tegidan keyin matn qolib ketdi. Uni teglar ichiga o'tkazing.", 'После закрывающего тега {tag} остался текст. Перенеси его внутрь тегов.', 'There’s text left after the closing {tag} tag. Move it inside the tags.'),
  extra: L3("Oxirida ortiqcha teg qolibdi: {got}.", 'В конце остался лишний тег: {got}.', 'There’s an extra tag at the end: {got}.'),
  short: L3("Matn juda qisqa: kamida ikki harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} yopilmadi. Ajratilgan so'zlardan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Bu yopuvchi {tag} tegi, lekin {tag} ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichida kamida bitta so'z bo'lsin.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  h1First: L3("Sahifa sarlavhadan boshlanadi: eng tepaga h1 tegini yozing.", 'Страница начинается с заголовка: в самом верху напиши h1.', 'The page starts with a heading: write h1 at the very top.'),
  mainH1: L3("Asosiy sarlavha uchun h1 kerak, {got} emas.", 'Для главного заголовка нужен h1, а не {got}.', 'The main heading needs h1, not {got}.'),
  oneH1: L3("h1 sahifada bitta bo'ladi. Keyingi sarlavhalar uchun h2 bor.", 'h1 на странице один. Для следующих заголовков есть h2.', 'A page has just one h1. Use h2 for the next headings.'),
  textNoLi: L3("Bu matn li ichida emas, shuning uchun oldida nuqta yoki raqam yo'q. Har bir bandni li ichiga yozing.", 'Этот текст не внутри li, поэтому у него нет точки или номера. Каждый пункт пиши внутри li.', 'This text isn’t inside li, so it has no bullet or number. Write each item inside li.'),
  liOut: L3("li ro'yxat ichida yashaydi: oldin ochuvchi ul yoki ol tegini yozing.", 'li живёт внутри списка: сначала напиши открывающий тег ul или ol.', 'li lives inside a list: write the opening ul or ol tag first.'),
  listMismatch: L3("Ro'yxat {tag} bilan ochilgan, demak u {tag} bilan yopiladi.", 'Список открыт тегом {tag}, значит, и закрывается тегом {tag}.', 'The list opens with {tag}, so it closes with {tag}.'),
  // Ссылки и атрибуты (урок 4).
  noHref: L3("Bu a tegida href yo'q, shuning uchun so'z oddiy matn bo'lib qoldi. Ochuvchi a tegiga href qo'shing.", 'У этого тега a нет href, поэтому слово осталось простым текстом. Добавь href в открывающий тег a.', 'This a tag has no href, so the word stayed plain text. Add href to the opening a tag.'),
  noQuote: L3("href qiymatini qo'shtirnoq ichiga yozing.", 'Значение href пиши в кавычках.', 'Put the href value in quotes.'),
  noEq: L3("href so'zidan keyin teng belgisi, keyin qo'shtirnoq ichida fayl nomi keladi.", 'После href идёт знак равенства, а потом имя файла в кавычках.', 'After href comes an equals sign, then the file name in quotes.'),
  attrTypo: L3("«{bad}» degan atribut yo'q. Balki href demoqchisiz?", 'Атрибута «{bad}» нет. Может быть, href?', 'There’s no “{bad}” attribute. Did you mean href?'),
  attrNone: L3("{tag} tegiga atribut kerak emas, uni olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  emptyHref: L3("href bo'sh: qo'shtirnoq ichiga fayl nomini yozing.", 'href пустой: впиши в кавычки имя файла.', 'href is empty: write the file name in the quotes.'),
  fileNo: L3("«{got}» degan fayl yo'q. Fayl nomini harfma-harf yozing: ro'yxatga qarang.", 'Файла «{got}» нет. Пиши имя файла буква в букву: посмотри на список.', 'There’s no “{got}” file. Write the file name letter by letter: look at the list.'),
  fileOther: L3("Bu havola {got} sahifasiga olib boradi. Bizga {want} kerak.", 'Эта ссылка ведёт на {got}. А нужно {want}.', 'This link goes to {got}. We need {want}.'),
  aOpen: L3("a yopilmadi, shuning uchun keyingi matn ham havola bo'lib qoldi. Havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт, поэтому и текст дальше стал ссылкой. После слов ссылки напиши закрывающий тег a.', 'a isn’t closed, so the text after it became a link too. Add the closing a tag after the link words.'),
  linkText: L3("Havola matni «{got}» bo'lib qoldi. Bizga «{want}» kerak.", 'Текст ссылки вышел «{got}». А нужно «{want}».', 'The link text says “{got}”. We need “{want}”.'),
  pWords: L3("Abzasda «{want}» so'zlari bo'lsin, havola esa ularning oxirida.", 'В абзаце должны быть слова «{want}», а ссылка — в их конце.', 'The paragraph should say “{want}”, with the link at the end.'),
  keepWords: L3("So'zlar o'zgarmasin: «{want}». Faqat href qo'shing.", 'Пусть слова останутся прежними: «{want}». Просто добавь href.', 'Keep the words as they were: “{want}”. Just add href.'),
  needLinkIn: L3("Abzas tayyor! Endi uning ichiga havola qo'shing: a tegi va href.", 'Абзац готов! Теперь добавь в него ссылку: тег a и href.', 'The paragraph is ready! Now add a link inside it: the a tag and href.'),
  needP: L3("Sarlavha tayyor! Endi uning ostiga abzas yozing, ichida havola bo'lsin.", 'Заголовок готов! Теперь под ним напиши абзац со ссылкой внутри.', 'The heading is ready! Now write a paragraph under it with a link inside.'),
  onePara: L3("Bitta abzas yetarli. Ortiqchasini olib tashlang.", 'Хватит одного абзаца. Лишнее убери.', 'One paragraph is enough. Remove the extra part.'),
  next: L3("Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Sayohat", 'Путешествие', 'Trip'),
    say: L3("Salom! Men sayohat sayti tayyorladim: bosh sahifa va shaharlar sahifalari. Sahifalar bir-biriga havolalar bilan ulangan: shahar nomini bossangiz, uning sahifasi ochiladi. Faqat saytni saqlash qoldi. «Saqlash» tugmasini bosing.",
      'Привет! Я сделал сайт о путешествии: главная и страницы городов. Страницы связаны ссылками: нажмёшь на город, и откроется его страница. Осталось только сохранить сайт. Нажми «Сохранить».',
      'Hi! I made a website about a trip: a home page and pages for the cities. The pages are connected with links: tap a city, and its page opens. I just need to save the site. Tap “Save”.'),
    broke: L3("Voy! Saqlash paytida havolalar uzilib ketdi. Shahar nomlari endi oddiy matn: bossangiz, hech narsa bo'lmaydi.",
      'Ой! При сохранении ссылки оборвались. Названия городов теперь простой текст: нажмёшь, и ничего не будет.',
      'Oh no! The links broke while saving. The city names are plain text now: tap them, and nothing happens.'),
    done: L3("O'tgan darsda havolalar bilan tanishdik: a tegi va href atributi. Endi shu bilim bilan beshta sahifani birma-bir tuzatamiz. Kodni o'zingiz yozasiz, men esa yoningizdaman. Beshinchi sahifa esa sizniki bo'ladi!",
      'На прошлом уроке мы познакомились со ссылками: тег a и атрибут href. Теперь с этими знаниями починим пять страниц по одной. Код пишешь ты, а я рядом. А пятая страница будет твоей!',
      'Last lesson we met links: the a tag and the href attribute. Now let’s use that to fix the five pages one by one. You write the code, and I’ll be right here. And the fifth page will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("Beshta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять страниц — код пишешь ты', 'Let’s fix five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Bosh sahifa", 'Главная', 'Home'),
    say: L3("Birinchi sahifa: bosh sahifa. Bu yerda shaharlar menyusi bor. Toshkent havolasi ishlayapti, bosib ko'ring. Samarqand havolasida esa manzil yo'q: href qiymati bo'sh qolgan. Qo'shtirnoq ichiga fayl nomini yozing: samarqand.html.",
      'Первая страница: главная. Здесь меню городов. Ссылка на Ташкент работает, нажми её. А у ссылки на Самарканд нет адреса: значение href пустое. Впиши в кавычки имя файла: samarqand.html.',
      'The first page is the home page. It has a menu of cities. The Tashkent link works, tap it. But the Samarkand link has no address: the href value is empty. Type the file name inside the quotes: samarqand.html.'),
    ask: L3("href ichiga yozing: samarqand.html", 'Впиши в href: samarqand.html', 'Type in href: samarqand.html'),
    ok: L3("Ajoyib! Endi Samarqand havolasi ishlaydi. Bosib ko'ring!", 'Отлично! Теперь ссылка на Самарканд работает. Нажми её!', 'Great! Now the Samarkand link works. Tap it!'),
    hints: [
      L3("Havola qayerga olib borishini href aytadi. Samarqand qatoridagi bo'sh qo'shtirnoqni toping.", 'Куда ведёт ссылка, говорит href. Найди пустые кавычки в строке Самарканда.', 'href says where a link goes. Find the empty quotes in the Samarkand line.'),
      L3("Qo'shtirnoq ichiga fayl nomini harfma-harf yozing. Fayllar ro'yxati yonida turibdi.", 'Впиши в кавычки имя файла буква в букву. Список файлов рядом.', 'Type the file name in the quotes, letter by letter. The list of files is right there.'),
      L3("Masalan, Xiva havolasi shunday bo'ladi. Siz esa samarqand.html deb yozing.", 'Например, ссылка на Хиву выглядит так. А ты впиши samarqand.html.', 'For example, a Khiva link looks like this. You type samarqand.html.')
    ],
    drill: L3("Endi Buxoro havolasini ulang: buxoro.html", 'Теперь подключи ссылку на Бухару: buxoro.html', 'Now connect the Bukhara link: buxoro.html')
  },
  t2: {
    eyebrow: L3("Toshkent", 'Ташкент', 'Tashkent'),
    say: L3("Bosh sahifa tayyor, endi Toshkent. Bu sahifadan bosh sahifaga qaytish yo'li yo'q. Pastdagi bo'sh qatorga havola yozing: href atributi bor ochuvchi a tegi, «Bosh sahifa» so'zlari va yopuvchi a tegi. Manzil esa index.html bo'ladi.",
      'Главная готова, теперь Ташкент. С этой страницы нельзя вернуться на главную. Напиши в пустой строке ссылку: открывающий тег a с атрибутом href, слово «Главная» и закрывающий тег a. А адрес будет index.html.',
      'The home page is done, now Tashkent. There’s no way back to the home page from here. Write a link in the empty line: the opening a tag with the href attribute, the word “Home” and the closing a tag. The address is index.html.'),
    ask: L3("Havola yozing: index.html, matni «Bosh sahifa»", 'Напиши ссылку: index.html, текст «Главная»', 'Write a link: index.html, text “Home”'),
    ok: L3("Barakalla! Endi Toshkentdan bosh sahifaga qaytsa bo'ladi. Bosib ko'ring!", 'Вот это да! Теперь из Ташкента можно вернуться на главную. Нажми!', 'Wow! Now you can get back home from Tashkent. Tap it!'),
    hints: [
      L3("Havola a tegida yoziladi, manzil esa href atributida.", 'Ссылку пишут в теге a, а адрес — в атрибуте href.', 'A link goes in the a tag, and the address in the href attribute.'),
      L3("Qator uch qismdan iborat: href atributi bor ochuvchi a tegi, so'zlar va yopuvchi a tegi.", 'В строке три части: открывающий тег a с href, слова и закрывающий тег a.', 'The line has three parts: the opening a tag with href, the words and the closing a tag.'),
      L3("Mana, Xivaga havola. Siz ham shunday yozing, faqat index.html va «Bosh sahifa» bilan.", 'Вот ссылка на Хиву. Напиши так же, только с index.html и словом «Главная».', 'Here’s a link to Khiva. Write yours the same way, with index.html and “Home”.')
    ],
    drill: L3("Endi Samarqandga havola: samarqand.html, matni «Samarqand»", 'Теперь ссылка на Самарканд: samarqand.html, текст «Самарканд»', 'Now a link to Samarkand: samarqand.html, text “Samarkand”')
  },
  t3: {
    eyebrow: L3("Samarqand", 'Самарканд', 'Samarkand'),
    say: L3("Ikki sahifa tayyor! Uchinchisi: Samarqand. Bu yerda keyingi shaharga yo'l yo'q. Abzas yozing: oldin «Keyingi shahar» so'zlari, keyin Buxoro. Buxoro so'zi esa buxoro.html sahifasiga havola bo'lsin. Havola abzas ichida turadi.",
      'Две страницы готовы! Третья: Самарканд. Здесь нет пути в следующий город. Напиши абзац: сначала слова «Следующий город», потом Бухара. А слово Бухара пусть будет ссылкой на buxoro.html. Ссылка стоит внутри абзаца.',
      'Two pages are done! The third is Samarkand. There’s no way to the next city here. Write a paragraph: first the words “Next city”, then Bukhara. And let the word Bukhara be a link to buxoro.html. The link sits inside the paragraph.'),
    ask: L3("p: «Keyingi shahar: Buxoro», Buxoro havola", 'p: «Следующий город: Бухара», Бухара — ссылка', 'p: “Next city: Bukhara”, Bukhara is a link'),
    ok: L3("Zo'r! Havola abzas ichida ishlayapti. Bosib ko'ring!", 'Огонь! Ссылка работает прямо внутри абзаца. Нажми!', 'Awesome! The link works right inside the paragraph. Tap it!'),
    hints: [
      L3("Havola abzas ichida ham bo'lishi mumkin: p ichida oldin matn, keyin a tegi.", 'Ссылка может стоять и внутри абзаца: в p сначала текст, потом тег a.', 'A link can sit inside a paragraph too: inside p, first the text, then the a tag.'),
      L3("Oldin ochuvchi p tegi va «Keyingi shahar» so'zlari, keyin Buxoro havolasi, oxirida yopuvchi p tegi.", 'Сначала открывающий тег p и слова «Следующий город», потом ссылка на Бухару, в конце закрывающий тег p.', 'First the opening p tag and the words “Next city”, then the Bukhara link, and the closing p tag at the end.'),
      L3("Mana, Xivaga olib boradigan abzas. Siz ham shunday yozing, faqat Buxoro bilan.", 'Вот абзац, который ведёт в Хиву. Напиши так же, только с Бухарой.', 'Here’s a paragraph that leads to Khiva. Write yours the same way, just with Bukhara.')
    ],
    drill: L3("Endi abzas: «Keyingi shahar: Xiva», Xiva — havola", 'Теперь абзац: «Следующий город: Хива», Хива — ссылка', 'Now a paragraph: “Next city: Khiva”, Khiva is a link')
  },
  t4: {
    eyebrow: L3("Buxoro", 'Бухара', 'Bukhara'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: Buxoro. Qarang, Xiva so'zi oddiy matn bo'lib turibdi: bossangiz, hech qayerga olib bormaydi. Demak, bir qator buzilgan. Oldin o'sha qatorni toping va ustiga bosing.",
      'Три страницы готовы! Четвёртая: Бухара. Смотри, слово Хива стоит простым текстом: нажмёшь, и никуда не ведёт. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is Bukhara. Look, the word Khiva is plain text: tap it, and it goes nowhere. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! a tegi bor, lekin href yo'q. href bo'lmasa, brauzer qayerga borishni bilmaydi. Ochuvchi a tegiga href qo'shing.",
      'Нашлась! Тег a есть, а href нет. Без href браузер не знает, куда вести. Добавь href в открывающий тег a.',
      'Found it! The a tag is there, but there’s no href. Without href, the browser doesn’t know where to go. Add href to the opening a tag.'),
    ok: L3("Ura, ishladi! Endi bu so'z havola. Bosib ko'ring! Buzilgan joyni xuddi haqiqiy dasturchidek topdingiz!", 'Ура, заработало! Теперь это слово — ссылка. Нажми! Поломка найдена, как у настоящего программиста!', 'Yes, it works! Now the word is a link. Tap it! You found the bug like a real developer!'),
    why: {
      0: L3("body shu yerda ochiladi, bu qator joyida. Oddiy matn bo'lib qolgan so'zga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на слово, которое осталось простым текстом.', 'body opens here, this line is fine. Look at the word that stayed plain text.'),
      1: L3("Sarlavha h1 to'g'ri ochilgan va yopilgan. Bu qator joyida.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("Bu abzasda havola yo'q va bo'lishi ham shart emas. Pastroqdagi so'zga qarang.", 'В этом абзаце нет ссылки, и она здесь не нужна. Посмотри на слово ниже.', 'This paragraph has no link, and it doesn’t need one. Look at the word below.'),
      4: L3("body shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Bu so'z nega havola emas? Havolaga nima kerak edi?", 'Почему это слово не ссылка? Что нужно ссылке?', 'Why isn’t this word a link? What does a link need?'),
      L3("Oddiy matn bo'lib qolgan so'z yozilgan qatorga qarang: ochuvchi a tegida href bormi?", 'Посмотри на строку со словом, которое осталось текстом: есть ли href в открывающем теге a?', 'Look at the line with the word that stayed plain text: is there href in the opening a tag?'),
      L3("Mana, ishlaydigan havola. Siz ham ochuvchi a tegiga href qo'shing.", 'Вот рабочая ссылка. Добавь и ты href в открывающий тег a.', 'Here’s a working link. Add href to the opening a tag too.')
    ],
    drill: L3("Bu sahifada ham xuddi shunday: buzilgan qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("To'rtta sahifa yonib turibdi! Endi beshinchisi: sizning sahifangiz. Bu yerda faqat body bor. Eng tepada h1 tegida sarlavha yozing. Keyin abzas yozing, abzas ichida esa saytdagi biror sahifaga havola bo'lsin, masalan bosh sahifaga. Fayl nomlari yonida turibdi.",
      'Четыре страницы горят! Теперь пятая: твоя страница. Здесь есть только body. В самом верху напиши заголовок в теге h1. Потом абзац, а в нём ссылку на любую страницу сайта, например на главную. Имена файлов рядом.',
      'Four pages are lit! Now the fifth: your page. There’s only body here. At the very top, write a heading in the h1 tag. Then a paragraph with a link inside it to any page of the site, for example the home page. The file names are right there.'),
    ask: L3("body ichiga: h1, p va ichida havola", 'В body: h1, p и в нём ссылка', 'Inside body: h1, p with a link inside'),
    ok: L3("Bu juda zo'r chiqdi! Sahifangiz saytga ulandi. Havolani bosib ko'ring!", 'Это было мощно! Твоя страница подключена к сайту. Нажми ссылку!', 'That was awesome! Your page is connected to the site. Tap the link!'),
    hints: [
      L3("Chizmaga qarang: oldin h1, keyin p, p ichida esa a tegi.", 'Посмотри на схему: сначала h1, потом p, а в p — тег a.', 'Look at the plan: first h1, then p, with the a tag inside p.'),
      L3("Havolaning ochuvchi a tegida href bo'lsin, qiymati esa ro'yxatdagi fayl nomi.", 'В открывающем теге a должен быть href, а его значение — имя файла из списка.', 'The opening a tag needs href, and its value is a file name from the list.'),
      L3("Mana, sayohat haqidagi sahifa. Xuddi shunday yozing, faqat o'z so'zlaringiz bilan.", 'Вот страница о поездке. Напиши так же, только своими словами.', 'Here’s a page about a trip. Write yours the same way, in your own words.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, sayohat saytining beshta sahifasi ham tayyor va hammasi bir-biriga ulangan!", 'Смотри, все пять страниц сайта о путешествии готовы и связаны друг с другом!', 'Look, all five pages of the trip site are ready and connected to each other!') },
      { k: 'a', text: L3("Havolani a tegiga yozdingiz.", 'Ссылка стояла в теге a.', 'You put the link in the a tag.') },
      { k: 'href', text: L3("href atributi brauzerga qayerga borishni aytdi.", 'Атрибут href говорил браузеру, куда вести.', 'The href attribute told the browser where to go.') },
      { k: 'val', text: L3("Qo'shtirnoq ichiga fayl nomini harfma-harf yozdingiz, shuning uchun sahifalar ochildi.", 'Имя файла в кавычках написано буква в букву, поэтому страницы открылись.', 'You wrote the file name in quotes letter by letter, so the pages opened.') },
      { k: 'own', text: L3("Oxirida esa o'z sahifangizni saytga uladingiz. Bu juda kuchli bo'ldi! Keyingi darsda sahifaga rasm qo'yamiz.", 'А в конце твоя страница подключена к сайту. Это было мощно! На следующем уроке добавим на страницу картинку.', 'And at the end you connected your own page to the site. That was awesome! Next lesson we’ll add a picture to the page.') }
    ],
    roles: {
      a: L3("a — havola", 'a — ссылка', 'a — link'),
      href: L3("href — manzil", 'href — адрес', 'href — address'),
      val: L3("qiymat — fayl nomi", 'значение — имя файла', 'value — file name'),
      own: L3("Sahifamni saytga uladim", 'Своя страница в сайте', 'My page is on the site')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { a: 1, href: 1, val: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a4.css@*/
`;
