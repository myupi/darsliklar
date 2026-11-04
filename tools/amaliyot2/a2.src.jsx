// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 2 — «Газета Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot2/build.mjs → lessons/html/02p-zagolovki-i-tekst.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 2 · «Газета Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на каркасе 01p — tools/amaliyot1). У Коди сайт школьной газеты: пять
// страниц-вкладок. При публикации теги пропали — слова слиплись в одну строку (как в крючке
// урока 2). Ученик чинит страницы по одной и сам пишет код: слова в h1 (смесь с уроком 1: title —
// на вкладке, h1 — на странице) → строка h2 → два абзаца p → найти и закрыть незакрытый b →
// своя статья: h1, p и b или i. Карта продвижения — вкладки браузера, как в 01p.
// 7 слайдов (заказчик, 22.10.2026): крючок · пять заданий · вывод. Сценарий —
// docs/scenarij-02p-zagolovki-i-tekst.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a2-screens.jsx, lexA2) находит теги и текст, страницу
//     рисует React как текст. Браузер честный, как в уроке 2: заголовки убывают от h1 к h6,
//     строки кода склеиваются в пробел, каждый p — свой абзац, незакрытый h1 делает крупным всё
//     ниже, незакрытый b — жирным весь текст дальше.
//   · Код — часть body, как в уроке 2 (head с title — над ней); в задании 1 — весь документ.
//   · Проверка по «Tekshirish», одна самая полезная проблема; вторая неудача подряд добавляет
//     ступень подсказки; лампочка — ступени 1–3; после третьей — дополнительная задача.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz», abzas, qalin / qiya,
//     asosiy sarlavha, bo'lim sarlavhasi, вкладка — «varaq» (как в уроке 1). RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-02p-zagolovki-i-tekst',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '2-amaliyot. Kodining gazetasi',
    ru: 'Практика 2. Газета Коди',
    en: 'Practice 2. Kodi’s newspaper'
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
  publish: L3("Nashr qilish", 'Опубликовать', 'Publish'),
  drill: L3("Qo'shimcha", 'Ещё разок', 'Bonus'),
  sample: L3("Namuna", 'Образец', 'Example'),
  workReady: L3("Ish tayyor", 'Работа готова', 'Work is ready'),
  nextLesson: L3("Keyingi dars", 'Следующий урок', 'Next lesson'),
  next: L3("Ro'yxatlar", 'Списки', 'Lists'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  part: {
    open: L3("ochuvchi teg", 'открывающий', 'opening tag'),
    word: L3("so'z", 'слово', 'word'),
    text: L3("gap", 'предложение', 'sentence'),
    close: L3("yopuvchi teg", 'закрывающий', 'closing tag')
  },
  bpH1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'),
  bpP: L3("abzas", 'абзац', 'paragraph'),
  bpBI: L3("qalin yoki qiya so'z", 'жирное или наклонное слово', 'a bold or slanted word'),
  given: L3("bor", 'уже есть', 'already there'),
  twice: L3("2 marta", '2 раза', '2 times'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening sahifam", 'Моя страница', 'My page'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// ПЯТЬ СТРАНИЦ ГАЗЕТЫ — объекты карты (вкладки). name — название из title, ico — значок;
// остальное — содержимое страницы. Пятая — статья ученика.
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'front', ico: 'news', c: '#FA4F28', name: L3("Maktab gazetasi", 'Школьная газета', 'School paper'),
    text: L3("Maktab yangiliklari", 'Новости нашей школы', 'News from our school') },
  { id: 'sport', ico: 'ball', c: '#7C5CFA', name: L3("Sport", 'Спорт', 'Sport'), h2: L3("Futbol", 'Футбол', 'Football'),
    text: L3("Bizning jamoa yutdi!", 'Наша команда победила!', 'Our team won!') },
  { id: 'pets', ico: 'paw', c: '#0FA38E', name: L3("Hayvonlar", 'Животные', 'Animals'), h2: L3("Mushuklar", 'Кошки', 'Cats') },
  { id: 'weather', ico: 'sun', c: '#F59E0B', name: L3("Ob-havo", 'Погода', 'Weather'),
    pre: L3("Bugun", 'Сегодня', 'Today it is'), bold: L3("juda issiq", 'очень жарко', 'very hot'),
    after: L3("Ertaga yomg'ir yog'adi.", 'Завтра пойдёт дождь.', 'Tomorrow it will rain.') },
  { id: 'mine', ico: 'pen', c: '#E44D26', name: L3("Mening maqolam", 'Моя статья', 'My article') }
];
// Содержимое дополнительных задач и образцов (другое, чем в задании).
const XTRA = {
  books: L3("Kitoblar olami", 'Мир книг', 'World of books'),
  school: L3("Bizning maktab", 'Наша школа', 'Our school'),
  basket: L3("Basketbol", 'Баскетбол', 'Basketball'),
  chess: L3("Shaxmat", 'Шахматы', 'Chess'),
  dogs: L3("Itlar", 'Собаки', 'Dogs'),
  dog1: L3("Itlar juda sodiq.", 'Собаки очень верные.', 'Dogs are very loyal.'),
  dog2: L3("Ular yugurishni yaxshi ko'radi.", 'Они любят бегать.', 'They love to run.'),
  imp: { pre: L3("Bu", 'Это', 'This is'), bold: L3("juda muhim", 'очень важная', 'very important'), post: L3("xabar.", 'новость.', 'news.') },
  wind: { pre: L3("Ertaga", 'Завтра', 'Tomorrow there will be'), bold: L3("kuchli shamol", 'сильный ветер', 'strong wind'),
    after: L3("Soyabon oling.", 'Возьми зонтик.', 'Take an umbrella.') },
  own: { h: L3("Mening itim", 'Моя собака', 'My dog'), pre: L3("Itim", 'Моя собака', 'My dog is'), bold: L3("juda aqlli", 'очень умная', 'very smart') }
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {near} — похожий тег.
// В звучащих узбекских фразах нет тире (движок делает из тире точку).
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari chiziq «\\». Yopuvchi tegda oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("«{bad}» tegining oxirida o'ng burchakli qavs «>» yo'q.", 'В конце тега «{bad}» не хватает уголка «>».', 'The tag “{bad}” is missing the bracket “>” at the end.'),
  noLt: L3("«{bad}»: teg chap burchakli qavs «<» bilan boshlanadi.", '«{bad}» — тег начинается с уголка «<».', '“{bad}” — a tag starts with the bracket “<”.'),
  typo: L3("«{bad}» degan teg yo'q. Balki «{near}» demoqchisiz?", '«{bad}» — такого тега нет. Может быть, «{near}»?', '“{bad}” — there’s no such tag. Did you mean “{near}”?'),
  unknown: L3("«{bad}» tegi bizning sahifamizda yo'q. Bizda h1 tegidan h6 tegigacha sarlavhalar, p, b va i bor.", 'Тега «{bad}» на нашей странице нет. У нас заголовки от h1 до h6, p, b и i.', 'Our page has no “{bad}” tag. We have headings from h1 to h6, p, b and i.'),
  noLevel: L3("«{bad}» degan sarlavha yo'q: sarlavhalar h1 tegidan h6 tegigacha bo'ladi.", 'Заголовка «{bad}» нет: заголовки бывают от h1 до h6.', 'There’s no “{bad}” heading: headings go from h1 to h6.'),
  emptyTag: L3("Burchakli qavslar ichida teg nomi bo'lishi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Bu yerga faqat body ichidagi qismni yozing: qolgani allaqachon bor.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body allaqachon bor: tepada va pastda. Uning ichiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Matndan oldin ochuvchi {tag} tegi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeFirst: L3("Bu yopuvchi {got} tegi. Bu yerda oldin ochuvchi {tag} tegi kerak.", 'Это закрывающий тег {got}. Здесь сначала нужен открывающий тег {tag}.', 'That’s the closing {got} tag. First you need the opening {tag} tag here.'),
  wrongOpen: L3("Bu yerda {tag} tegi kerak, {got} emas.", 'Здесь нужен тег {tag}, а не {got}.', 'You need the {tag} tag here, not {got}.'),
  h1Taken: L3("h1 asosiy sarlavha, u sahifada allaqachon bor. Bo'lim sarlavhasi uchun h2 tegini yozing.", 'h1 — главный заголовок, он на странице уже есть. Для заголовка раздела напиши h2.', 'h1 is the main heading, and the page already has it. For a section heading, write h2.'),
  wrongLevel: L3("Bu yerda {tag} kerak, {got} emas. Raqam qancha katta bo'lsa, sarlavha shuncha kichik bo'ladi.", 'Здесь нужен {tag}, а не {got}. Чем больше цифра, тем мельче заголовок.', 'You need {tag} here, not {got}. The bigger the number, the smaller the heading.'),
  closeMismatch: L3("Ochuvchi teg {tag} bo'lsa, yopuvchisi ham {tag} bo'ladi.", 'Открывающий тег — {tag}, значит, и закрывающий тоже {tag}.', 'The opening tag is {tag}, so the closing one is {tag} too.'),
  needText: L3("{tag} ichiga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} qismi yopilmadi: oxiriga yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmadi, shuning uchun pastdagi hamma narsa ham katta bo'lib ketdi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  textAfter: L3("Yopuvchi {tag} tegidan keyin matn qolib ketdi. Uni teglar ichiga o'tkazing.", 'После закрывающего тега {tag} остался текст. Перенеси его внутрь тегов.', 'There’s text left after the closing {tag} tag. Move it inside the tags.'),
  extra: L3("Oxirida ortiqcha teg qolibdi: {got}.", 'В конце остался лишний тег: {got}.', 'There’s an extra tag at the end: {got}.'),
  short: L3("Matn juda qisqa: kamida ikki harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  textOutP: L3("Brauzer bu matnni baribir ko'rsatadi, lekin hammasini bitta qatorga yopishtiradi. Har bir abzas o'z p tegida turadi.", 'Браузер всё равно покажет этот текст, но слепит всё в одну строку. Каждый абзац стоит в своём p.', 'The browser will still show this text, but it glues it all into one line. Each paragraph sits in its own p.'),
  oneP: L3("Hozircha abzas bitta: brauzer kod qatorlarini yopishtirib yuboradi. Ikkinchi abzas uchun yana bitta p kerak.", 'Пока абзац один: браузер склеивает строки кода. Для второго абзаца нужен ещё один p.', 'There’s only one paragraph so far: the browser glues code lines together. The second paragraph needs another p.'),
  inlineOpen: L3("{tag} yopilmadi. Ajratilgan so'zlardan keyin, yopuvchi p tegidan oldin yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов, перед закрывающим p, напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, before the closing p, add the closing {tag} tag.'),
  inlineStray: L3("Bu yopuvchi {tag} tegi, lekin {tag} ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichida kamida bitta so'z bo'lsin.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  wrongHead: L3("Sahifada «{got}» chiqdi. Bizga «{want}» kerak.", 'На странице вышло «{got}». А нужно «{want}».', 'The page says “{got}”. We need “{want}”.'),
  wrongWord: L3("Sarlavhada «{got}» chiqdi. Bizga «{want}» kerak.", 'В заголовке вышло «{got}». А нужно «{want}».', 'The heading says “{got}”. We need “{want}”.'),
  keepWords: L3("So'zlar o'zgarmasin: «{want}». Faqat b qismini yoping.", 'Пусть слова останутся прежними: «{want}». Просто закрой b.', 'Keep the words as they were: “{want}”. Just close b.'),
  keepB: L3("b tegini o'chirmang: so'zlar qalin bo'lib qolsin, faqat b qismini yoping.", 'Не убирай b: слова должны остаться жирными, просто закрой b.', 'Don’t remove b: the words should stay bold, just close b.'),
  h1First: L3("Maqola sarlavhadan boshlanadi: eng tepaga h1 tegini yozing.", 'Статья начинается с заголовка: в самом верху напиши h1.', 'An article starts with a heading: write h1 at the very top.'),
  mainH1: L3("Asosiy sarlavha uchun h1 kerak, {got} emas.", 'Для главного заголовка нужен h1, а не {got}.', 'The main heading needs h1, not {got}.'),
  oneH1: L3("h1 sahifada bitta bo'ladi. Keyingi sarlavhalar uchun h2 bor.", 'h1 на странице один. Для следующих заголовков есть h2.', 'A page has just one h1. Use h2 for the next headings.'),
  needP: L3("Sarlavha tayyor! Endi uning ostiga p tegida abzas yozing.", 'Заголовок готов! Теперь под ним напиши абзац в p.', 'The heading is ready! Now write a paragraph in p under it.'),
  needBI: L3("Abzasdagi bir so'zni b yoki i bilan ajrating.", 'Выдели одно слово в абзаце тегом b или i.', 'Mark one word in the paragraph with b or i.'),
  next: L3("Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Maktab gazetasi", 'Школьная газета', 'School paper'),
    say: L3("Salom! Bu bizning maktab gazetamiz sayti. Unda beshta sahifa bor: bosh sahifa, sport, hayvonlar, ob-havo va yana bitta bo'sh sahifa. Bo'sh sahifa sizniki bo'ladi! Hammasi tayyor, faqat saytni nashr qilish qoldi. «Nashr qilish» tugmasini bosing.",
      'Привет! Это сайт нашей школьной газеты. В нём пять страниц: главная, спорт, животные, погода и ещё одна пустая. Пустая будет твоей! Всё готово, осталось только опубликовать сайт. Нажми «Опубликовать».',
      'Hi! This is our school newspaper website. It has five pages: the front page, sport, animals, weather and one more empty page. The empty one will be yours! Everything is ready, we just need to publish the site. Tap “Publish”.'),
    broke: L3("Voy! Nashr paytida teglar yo'qolib qoldi. Sarlavhalar ham, abzaslar ham yo'q: hamma so'zlar bitta qatorga yopishib ketdi.",
      'Ой! При публикации пропали теги. Ни заголовков, ни абзацев: все слова слиплись в одну строку.',
      'Oh no! The tags got lost while publishing. No headings, no paragraphs: all the words are glued into one line.'),
    done: L3("O'tgan darsda teglar matnni qanday tartibga solishini ko'rdik. Endi shu bilim bilan beshta sahifani birma-bir tuzatamiz. Kodni o'zingiz yozasiz, men esa yoningizdaman. Beshinchi sahifada esa o'z maqolangizni yozasiz!",
      'На прошлом уроке мы увидели, как теги наводят порядок в тексте. Теперь с этими знаниями починим пять страниц по одной. Код пишешь ты, а я рядом. А на пятой странице будет твоя собственная статья!',
      'Last lesson we saw how tags put text in order. Now let’s use that to fix the five pages one by one. You write the code, and I’ll be right here. And on the fifth page you’ll write your own article!'),
    ask: L3("«Nashr qilish» tugmasini bosing", 'Нажми «Опубликовать»', 'Tap “Publish”'),
    askDone: L3("Beshta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять страниц — код пишешь ты', 'Let’s fix five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Bosh sahifa", 'Главная', 'Front page'),
    say: L3("Birinchi sahifa: bosh sahifa. Varaqqa qarang: u yerda «Maktab gazetasi» degan nom bor. Bu nom title tegidan keladi, u joyida. Lekin sahifaning o'zida katta sarlavha yo'q: h1 bo'sh qolgan. Esingizdami, h1 asosiy sarlavha, ya'ni sahifadagi eng katta sarlavha degani. h1 ichiga «Maktab gazetasi» deb yozing.",
      'Первая страница: главная. Посмотри на вкладку: там название «Школьная газета». Оно берётся из тега title, и с ним всё в порядке. А на самой странице большого заголовка нет: h1 пустой. Помнишь, h1 — это главный заголовок, то есть самый крупный на странице. Впиши в h1 «Школьная газета».',
      'The first page is the front page. Look at the tab: it says “School paper”. That name comes from the title tag, and it’s fine. But the page itself has no big heading: h1 is empty. Remember, h1 is the main heading, that is, the biggest one on the page. Type “School paper” inside h1.'),
    ask: L3("h1 ichiga «Maktab gazetasi» deb yozing", 'Впиши в h1: «Школьная газета»', 'Type “School paper” inside h1'),
    ok: L3("Ajoyib! Endi nom ikki joyda: varaqda kichkina, sahifada esa katta sarlavha bo'lib turibdi!", 'Отлично! Теперь название в двух местах: маленьким на вкладке и крупным заголовком на странице!', 'Great! Now the name is in two places: small on the tab and as a big heading on the page!'),
    hints: [
      L3("Varaqdagi nom title tegidan keladi. Sahifadagi katta sarlavha esa qaysi tegda yoziladi?", 'Название на вкладке берётся из title. А в каком теге пишут крупный заголовок на самой странице?', 'The tab name comes from title. And which tag holds the big heading on the page itself?'),
      L3("Ochuvchi va yopuvchi h1 teglari o'rtasidagi bo'sh joyga yozing.", 'Пиши в пустое место между открывающим и закрывающим тегом h1.', 'Type in the empty spot between the opening and closing h1 tags.'),
      L3("Masalan, kitoblar sahifasida shunday bo'ladi. Siz esa «Maktab gazetasi» deb yozing.", 'Например, у страницы про книги — так. А ты впиши «Школьная газета».', 'For a page about books, it looks like this. You type “School paper”.')
    ],
    drill: L3("Endi sarlavhani «Bizning maktab» qiling", 'А теперь сделай заголовок «Наша школа»', 'Now make the heading “Our school”')
  },
  t2: {
    eyebrow: L3("Sport", 'Спорт', 'Sport'),
    say: L3("Bosh sahifa tayyor, endi sport. Bu yerda asosiy sarlavha bor, lekin bo'lim sarlavhasi o'chib ketgan. Bo'lim sarlavhasi asosiy sarlavhadan kichikroq bo'ladi, shuning uchun unga h2 tegi kerak. Bo'sh qatorga butun qatorni yozing: ochuvchi h2 tegi, «Futbol» so'zi va yopuvchi h2 tegi.",
      'Главная готова, теперь спорт. Здесь главный заголовок есть, а заголовок раздела стёрся. Заголовок раздела чуть мельче главного, поэтому ему нужен тег h2. Напиши в пустой строке всю строку: открывающий тег h2, слово «Футбол» и закрывающий тег h2.',
      'The front page is done, now sport. The main heading is here, but the section heading got erased. A section heading is a bit smaller than the main one, so it needs the h2 tag. Write the whole line in the empty row: the opening h2 tag, the word “Football” and the closing h2 tag.'),
    ask: L3("h2 qatorini yozing: «Futbol»", 'Напиши строку h2: «Футбол»', 'Write the h2 line: “Football”'),
    ok: L3("Barakalla! Butun qatorni o'zingiz yozdingiz, sport bo'limi o'z sarlavhasini oldi!", 'Вот это да! Вся строка написана твоими руками, и у раздела спорта появился заголовок!', 'Wow! You wrote the whole line, and the sport section got its heading!'),
    hints: [
      L3("h1 asosiy sarlavha, u allaqachon bor. Bo'lim sarlavhasi uchun h2 tegi ishlatiladi.", 'h1 — главный заголовок, он уже есть. Для заголовка раздела берут тег h2.', 'h1 is the main heading, and it’s already here. A section heading uses the h2 tag.'),
      L3("Qator uch qismdan iborat: ochuvchi h2 tegi, so'z va yopuvchi h2 tegi. Yopuvchi tegda qiya chiziq bor.", 'В строке три части: открывающий тег h2, слово и закрывающий тег h2. В закрывающем есть косая черта.', 'The line has three parts: the opening h2 tag, the word and the closing h2 tag. The closing one has a slash.'),
      L3("Mana, basketbol bo'limining qatori. Siz ham xuddi shunday yozing, faqat «Futbol» so'zi bilan.", 'Вот строка для раздела про баскетбол. Напиши так же, только со словом «Футбол».', 'Here’s the line for a basketball section. Write it the same way, just with the word “Football”.')
    ],
    drill: L3("Endi yana bir bo'lim: h2, «Shaxmat»", 'Теперь ещё раздел: h2, «Шахматы»', 'One more section: h2, “Chess”')
  },
  t3: {
    eyebrow: L3("Hayvonlar", 'Животные', 'Animals'),
    say: L3("Ikki sahifa tayyor! Uchinchisi: hayvonlar. Sarlavhalar joyida, lekin mushuklar haqidagi matn yo'qolgan. Esingizdami, kodda yangi qatorga o'tsangiz ham, brauzer hammasini bitta qatorga yopishtiradi. Yangi abzasni faqat p tegi yasaydi. Mushuklar haqida ikki abzas yozing: har biri o'z p tegida bo'lsin.",
      'Две страницы готовы! Третья: животные. Заголовки на месте, а текст про кошек пропал. Помнишь, даже если в коде перейти на новую строку, браузер склеит всё в одну. Новый абзац делает только тег p. Напиши про кошек два абзаца, каждый в своём p.',
      'Two pages are done! The third is animals. The headings are there, but the text about cats is gone. Remember, even if you start a new line in the code, the browser glues it all into one. Only the p tag makes a new paragraph. Write two paragraphs about cats, each in its own p.'),
    ask: L3("Mushuklar haqida ikki abzas yozing: ikkita p", 'Напиши два абзаца про кошек: два p', 'Write two paragraphs about cats: two p'),
    ok: L3("Zo'r! Ikki abzas, har biri alohida. Matn endi o'qishga qulay!", 'Огонь! Два абзаца, и каждый сам по себе. Теперь текст легко читать!', 'Awesome! Two paragraphs, each on its own. The text is easy to read now!'),
    hints: [
      L3("Har bir abzas o'z p tegida turadi. Kodda yangi qatorga o'tish yangi abzas yasamaydi.", 'Каждый абзац стоит в своём p. Новая строка в коде абзаца не делает.', 'Each paragraph sits in its own p. A new line in the code doesn’t make a paragraph.'),
      L3("Ikki marta yozing: ochuvchi p tegi, gap, yopuvchi p tegi.", 'Напиши два раза: открывающий тег p, предложение, закрывающий тег p.', 'Write it twice: the opening p tag, a sentence, the closing p tag.'),
      L3("Mana, itlar haqidagi ikki abzas. Siz ham shunday yozing, faqat mushuklar haqida.", 'Вот два абзаца про собак. Напиши так же, только про кошек.', 'Here are two paragraphs about dogs. Write them the same way, just about cats.')
    ],
    drill: L3("Endi itlar haqida ikki abzas yozing", 'Теперь два абзаца про собак', 'Now two paragraphs about dogs')
  },
  t4: {
    eyebrow: L3("Ob-havo", 'Погода', 'Weather'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: ob-havo. Qarang, bu yerda g'alati: faqat ikki so'z qalin bo'lishi kerak edi, lekin pastdagi hamma matn ham qalin bo'lib ketdi. Demak, kodning bir qatori buzilgan. Oldin o'sha qatorni toping va ustiga bosing.",
      'Три страницы готовы! Четвёртая: погода. Смотри, тут странно: жирными должны быть только два слова, а жирным стал и весь текст ниже. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is weather. Look, something’s odd here: only two words were supposed to be bold, but all the text below turned bold too. So one line of code is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! b ochildi, lekin yopilmadi. Shuning uchun brauzer pastdagi hamma matnni ham qalin qilib yubordi. Endi shu qatorni tuzating.",
      'Нашлась! b открыт, но не закрыт. Поэтому браузер сделал жирным и весь текст ниже. Теперь почини эту строку.',
      'Found it! b opens but never closes. That’s why the browser made all the text below bold too. Now fix this line.'),
    ok: L3("Voy, ishladi! Qalin faqat kerakli so'zlarda qoldi. Buzilgan joyni xuddi haqiqiy dasturchidek topdingiz!", 'Ура, заработало! Жирными остались только нужные слова. Поломка найдена, как у настоящего программиста!', 'Yes, it works! Only the right words are bold now. You found the bug like a real developer!'),
    why: {
      0: L3("body shu yerda ochiladi, bu qator joyida. Qalin matn qayerdan boshlanganiga qarang.", 'Здесь открывается body, строка в порядке. Посмотри, откуда начинается жирный текст.', 'body opens here, this line is fine. Look at where the bold text starts.'),
      1: L3("Sarlavha h1 to'g'ri ochilgan va yopilgan. Bu qator joyida.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      3: L3("Bu abzas o'zi joyida, lekin qalinlik unga tepadan o'tib kelgan. Bir qator tepaga qarang.", 'Сам этот абзац в порядке, но жирность пришла к нему сверху. Посмотри на строку выше.', 'This paragraph is fine itself, but the bold came to it from above. Look one line up.'),
      4: L3("body shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Qalinlik qaysi so'zdan boshlanadi? Qaysi teg o'z qismini yopishni unutdi?", 'С какого слова начинается жирный? Какой тег забыл закрыть свою часть?', 'Which word does the bold start from? Which tag forgot to close its part?'),
      L3("Qalin so'zlar bor qatorga qarang: b ochilgan, yopuvchi b tegi qani?", 'Посмотри на строку с жирными словами: b открыт, а где закрывающий b?', 'Look at the line with the bold words: b is open, but where’s the closing b?'),
      L3("Mana, to'g'ri yopilgan b. Siz ham qalin so'zlardan keyin yopuvchi b tegini qo'ying.", 'Вот правильно закрытый b. Поставь закрывающий b после жирных слов.', 'Here’s a properly closed b. Put the closing b after the bold words.')
    ],
    drill: L3("Bu sahifada ham xuddi shunday: buzilgan qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening maqolam", 'Моя статья', 'My article'),
    say: L3("To'rtta sahifa yonib turibdi! Endi beshinchisi: sizning maqolangiz. Bu yerda faqat body bor. Uning ichiga maqolani o'zingiz yozing. Eng tepada h1 tegida sarlavha. Keyin p tegida abzas. Abzasdagi eng muhim so'zni esa b yoki i bilan ajrating. Mavzuni o'zingiz tanlang: hayvon, o'yin yoki sevimli taomingiz. Chizma yo'l ko'rsatib turadi.",
      'Четыре страницы горят! Теперь пятая: твоя статья. Здесь есть только body. Внутри напиши статью сам. В самом верху заголовок в теге h1. Потом абзац в теге p. А самое важное слово в абзаце выдели тегом b или i. Тему выбирай сам: животное, игра или любимая еда. Схема подскажет дорогу.',
      'Four pages are lit! Now the fifth: your article. There’s only body here. Write the article inside it yourself. At the very top, a heading in the h1 tag. Then a paragraph in the p tag. And mark the most important word in the paragraph with b or i. Pick the topic yourself: an animal, a game or your favourite food. The plan will show you the way.'),
    ask: L3("body ichiga yozing: h1, p va b yoki i", 'Напиши в body: h1, p и в нём b или i', 'Write inside body: h1, p and b or i'),
    ok: L3("Bu juda zo'r chiqdi! Butun maqolani o'zingiz yozdingiz: sarlavha, abzas va ajratilgan so'z!", 'Это было мощно! Вся статья твоя: заголовок, абзац и выделенное слово!', 'That was awesome! You wrote the whole article: a heading, a paragraph and a marked word!'),
    hints: [
      L3("Chizmaga qarang: oldin h1, keyin p, p ichida esa b yoki i.", 'Посмотри на схему: сначала h1, потом p, а внутри p — b или i.', 'Look at the plan: first h1, then p, and b or i inside p.'),
      L3("Har bir ochilgan teg o'z yopuvchi tegi bilan yopiladi. b yoki i esa p ichida yopiladi.", 'Каждый открытый тег закрывается своим закрывающим. А b или i закрывается внутри p.', 'Every opened tag is closed by its own closing tag. And b or i closes inside p.'),
      L3("Mana, it haqidagi maqola. Xuddi shunday yozing, faqat o'z mavzuingiz bilan.", 'Вот статья про собаку. Напиши так же, только про своё.', 'Here’s an article about a dog. Write yours the same way, about your own topic.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, gazetaning beshta sahifasi ham tayyor! Saytni siz qutqardingiz.", 'Смотри, все пять страниц газеты готовы! Сайт спасён — и это твоя работа.', 'Look, all five pages of the paper are ready! You saved the site.') },
      { k: 'h', text: L3("Asosiy sarlavhani h1 tegiga, bo'lim sarlavhasini esa h2 tegiga yozdingiz.", 'Главный заголовок стоял в h1, а заголовок раздела — в h2.', 'You put the main heading in h1 and the section heading in h2.') },
      { k: 'p', text: L3("Har bir abzas o'z p tegida turdi, shuning uchun matn yopishib qolmadi.", 'Каждый абзац был в своём p, поэтому текст не слипся.', 'Each paragraph sat in its own p, so the text didn’t glue together.') },
      { k: 'bi', text: L3("b va i bilan muhim so'zlarni ajratdingiz va ularni yopishni ham unutmadingiz.", 'Важные слова выделены тегами b и i, и теги закрыты, поэтому жирное не расползлось.', 'You marked important words with b and i, and you didn’t forget to close them.') },
      { k: 'own', text: L3("Oxirida esa butun maqolani o'zingiz yozdingiz. Bu juda kuchli bo'ldi! Keyingi darsda ro'yxatlar tuzamiz.", 'А в конце вся статья написана твоими руками. Это было мощно! На следующем уроке сделаем списки.', 'And at the end you wrote a whole article yourself. That was awesome! Next lesson we’ll make lists.') }
    ],
    roles: {
      h: L3("h1, h2 — sarlavhalar", 'h1, h2 — заголовки', 'h1, h2 — headings'),
      p: L3("p — abzas", 'p — абзац', 'p — paragraph'),
      bi: L3("b — qalin, i — qiya", 'b — жирный, i — наклонный', 'b — bold, i — slanted'),
      own: L3("Maqolani o'zim yozdim", 'Своя статья с нуля', 'My own article')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { h: 1, p: 1, bi: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a2.css@*/
`;
