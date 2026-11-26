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
  empty: L3("Bu yer hali bo'sh, kodingizni aynan shu yerdan boshlang.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Qiya chiziq teskari yozilibdi: «\\». Yopuvchi tegga o'ngga qiyshaygan «/» kerak.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("O'ng burchakli qavs «>» tushib qolgan, shuning uchun teg tugamay qolgan: \u2063«{bad}»\u2064.", 'В конце тега не хватает уголка «>»: \u2063«{bad}»\u2064.', 'This tag is missing the bracket “>” at the end: \u2063“{bad}”\u2064.'),
  noLt: L3("Chap burchakli qavs «<» tushib qolibdi, teg esa doim shundan boshlanadi: \u2063«{bad}»\u2064.", 'Тег начинается с уголка «<», а здесь его нет: \u2063«{bad}»\u2064.', 'A tag starts with the bracket “<”, but it’s missing here: \u2063“{bad}”\u2064.'),
  typo: L3("Brauzer bunday tegni tanimaydi: \u2063«{bad}»\u2064. «{near}» yozmoqchi bo'lgandirsiz?", 'Такого тега нет: \u2063«{bad}»\u2064. Может быть, «{near}»?', 'There’s no such tag: \u2063“{bad}”\u2064. Did you mean “{near}”?'),
  unknown: L3("Gazetamizda bunday tegni ishlatmaymiz: \u2063«{bad}»\u2064. Bizga h1 tegidan h6 tegigacha sarlavhalar, p, b va i yetadi.", 'Такого тега на нашей странице нет: \u2063«{bad}»\u2064. У нас заголовки от h1 до h6, p, b и i.', 'Our page has no such tag: \u2063“{bad}”\u2064. We have headings from h1 to h6, p, b and i.'),
  noLevel: L3("Bunday sarlavha bo'lmaydi: \u2063«{bad}»\u2064. Sarlavhalar h1 tegidan h6 tegigacha bo'ladi, hammasi bo'lib oltita.", 'Такого заголовка нет: \u2063«{bad}»\u2064. Заголовки бывают от h1 до h6.', 'There’s no such heading: \u2063“{bad}”\u2064. Headings go from h1 to h6.'),
  emptyTag: L3("Burchakli qavslarni qo'ydingiz, lekin teg nomi yozilmabdi. Nomni ularning ichiga yozing.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Qolganini muharrir tayyorlab qo'ygan, siz faqat body ichiga yozasiz.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body teglari tayyor: biri tepada, biri pastda. Kod ularning o'rtasiga tushadi.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Matn bor-u, uning oldida ochuvchi {tag} tegi yo'q. Oldin tegni oching.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeFirst: L3("Yopuvchi \u2063{got}\u2064 tegi bu yerga hali erta: bu joyga oldin ochuvchi {tag} tegi kerak.", 'Это закрывающий тег \u2063{got}\u2064. Здесь сначала нужен открывающий тег {tag}.', 'That’s the closing \u2063{got}\u2064 tag. First you need the opening {tag} tag here.'),
  wrongOpen: L3("Bu yerda {tag} bo'lishi kerak, siz yozgan teg esa boshqa narsa uchun: \u2063{got}\u2064.", 'Здесь нужен тег {tag}, другой не подойдёт: \u2063{got}\u2064.', 'You need the {tag} tag here, not another one: \u2063{got}\u2064.'),
  h1Taken: L3("Asosiy sarlavha h1 tegida allaqachon turibdi-ku. Bo'lim sarlavhasi uchun esa h2 tegini yozing.", 'h1 — главный заголовок, он на странице уже есть. Для заголовка раздела напиши h2.', 'h1 is the main heading, and the page already has it. For a section heading, write h2.'),
  wrongLevel: L3("Bu yerga {tag} kerak, boshqa daraja emas: \u2063{got}\u2064. Esingizda bo'lsin: raqam qancha katta bo'lsa, sarlavha shuncha kichik chiqadi.", 'Здесь нужен {tag}, другой уровень не подойдёт: \u2063{got}\u2064. Чем больше цифра, тем мельче заголовок.', 'You need {tag} here, a different level won’t do: \u2063{got}\u2064. The bigger the number, the smaller the heading.'),
  closeMismatch: L3("Ochuvchi {tag} bo'lsa, yopuvchi ham {tag} bo'lishi kerak: ular doim juft yuradi.", 'Открывающий тег — {tag}, значит, и закрывающий тоже {tag}.', 'The opening tag is {tag}, so the closing one is {tag} too.'),
  needText: L3("{tag} tegining ichi bo'sh. Bir-ikki so'z yozing, shunda sahifada ko'rinadi.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu ochuvchi teg, yopuvchi emas: yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} hali ochiq turibdi, brauzer uning qayerda tugashini bilmayapti. Yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("Pastdagi matnga qarang: {tag} yopilmagani uchun hammasi kattalashib ketibdi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  textAfter: L3("Yopuvchi {tag} tegidan keyin matn tashqarida qolibdi. Matnni teglar ichiga ko'chiring.", 'После закрывающего тега {tag} остался текст. Перенеси его внутрь тегов.', 'There’s text left after the closing {tag} tag. Move it inside the tags.'),
  extra: L3("Kod oxirida ortiqcha teg turibdi: \u2063{got}\u2064.", 'В конце остался лишний тег: \u2063{got}\u2064.', 'There’s an extra tag at the end: \u2063{got}\u2064.'),
  short: L3("Matn juda qisqa chiqdi, hech bo'lmasa ikkita harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  textOutP: L3("Brauzer bu matnni baribir ko'rsatadi, lekin hammasini bitta qatorga yopishtirib yuboradi. Har bir abzasni o'z p tegiga joylang, shunda ular ajralib turadi.", 'Браузер всё равно покажет этот текст, но слепит всё в одну строку. Каждый абзац стоит в своём p.', 'The browser will still show this text, but it glues it all into one line. Each paragraph sits in its own p.'),
  oneP: L3("Hozircha abzas bitta chiqyapti, chunki brauzer kod qatorlarini bir-biriga ulab yuboradi. Ikkinchi abzas uchun yana bitta p tegi kerak.", 'Пока абзац один: браузер склеивает строки кода. Для второго абзаца нужен ещё один p.', 'There’s only one paragraph so far: the browser glues code lines together. The second paragraph needs another p.'),
  inlineOpen: L3("{tag} tegi yopilmay qolibdi. Ajratilgan so'zlardan keyin, yopuvchi p tegidan oldin yopuvchi {tag} tegini qo'ying.", '{tag} не закрыт. После выделенных слов, перед закрывающим p, напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, before the closing p, add the closing {tag} tag.'),
  inlineStray: L3("Yopuvchi {tag} tegi bor-u, {tag} hali ochilmagan ekan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichida kamida bitta so'z turishi kerak, aks holda nimani ajratamiz?", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  wrongHead: L3("Sahifada boshqa so'zlar chiqib qoldi: \u2063«{got}»\u2064. Bizga esa «{want}» kerak.", 'На странице вышел другой текст: \u2063«{got}»\u2064. А нужно «{want}».', 'The page shows different text: \u2063“{got}”\u2064. We need “{want}”.'),
  wrongWord: L3("Sarlavhaga boshqa so'z tushib qolibdi: \u2063«{got}»\u2064. Bu yerda «{want}» turishi kerak.", 'В заголовке вышел другой текст: \u2063«{got}»\u2064. А нужно «{want}».', 'The heading shows different text: \u2063“{got}”\u2064. We need “{want}”.'),
  keepWords: L3("So'zlarga tegmang, ular «{want}» bo'lib qolsin. Faqat b tegini yoping.", 'Пусть слова останутся прежними: «{want}». Просто закрой b.', 'Keep the words as they were: “{want}”. Just close b.'),
  keepB: L3("b tegini olib tashlamang: so'zlar qalin turishi kerak, faqat tegni yopib qo'ying.", 'Не убирай b: слова должны остаться жирными, просто закрой b.', 'Don’t remove b: the words should stay bold, just close b.'),
  h1First: L3("Har qanday maqola sarlavhadan boshlanadi. Eng tepaga h1 tegini yozing.", 'Статья начинается с заголовка: в самом верху напиши h1.', 'An article starts with a heading: write h1 at the very top.'),
  mainH1: L3("Gazeta nomi uchun h1 tegi kerak, boshqasi emas: \u2063{got}\u2064.", 'Для главного заголовка нужен h1, другой не подойдёт: \u2063{got}\u2064.', 'The main heading needs h1, not another tag: \u2063{got}\u2064.'),
  oneH1: L3("Sahifada h1 bitta bo'ladi. Keyingi sarlavhalar uchun h2 tegini ishlating.", 'h1 на странице один. Для следующих заголовков есть h2.', 'A page has just one h1. Use h2 for the next headings.'),
  needP: L3("Sarlavha chiqdi! Endi uning ostiga p tegida abzas yozing.", 'Заголовок готов! Теперь под ним напиши абзац в p.', 'The heading is ready! Now write a paragraph in p under it.'),
  needBI: L3("Abzasingizdagi bitta so'zni b yoki i bilan ajratib qo'ying, o'quvchi uni darrov payqasin.", 'Выдели одно слово в абзаце тегом b или i.', 'Mark one word in the paragraph with b or i.'),
  next: L3("Bu qism tayyor, keyingisi: {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Maktab gazetasi", 'Школьная газета', 'School paper'),
    say: L3("Maktab gazetamiz chiqishiga yarim soat qoldi, saytni esa bir haftada yasab chiqdim. Bosh sahifa, sport, hayvonlar va ob-havo sahifalari tayyor, beshinchisi esa sizning maqolangizni kutyapti. Faqat nashr qilish qoldi, shundan keyin butun maktab o'qiydi. «Nashr qilish» tugmasini bosing, ko'ramiz!",
      'Привет! Это сайт нашей школьной газеты. В нём пять страниц: главная, спорт, животные, погода и ещё одна пустая. Пустая будет твоей! Всё готово, осталось только опубликовать сайт. Нажми «Опубликовать».',
      'Hi! This is our school newspaper website. It has five pages: the front page, sport, animals, weather and one more empty page. The empty one will be yours! Everything is ready, we just need to publish the site. Tap “Publish”.'),
    broke: L3("Nashr bosilishi bilan teglarning bir qismi qayoqqadir yo'qoldi! Bosh sahifaga qarang: sarlavha ham, abzas ham yo'q, hamma so'z bir-biriga yopishib, bitta uzun qatorga aylanibdi.",
      'Ой! При публикации пропали теги. Ни заголовков, ни абзацев: все слова слиплись в одну строку.',
      'Oh no! The tags got lost while publishing. No headings, no paragraphs: all the words are glued into one line.'),
    done: L3("Yarim soat kam emas, ulguramiz. Har bir sahifadan bittadan narsa tushib qolgan: qayerdan sarlavha, qayerdan abzas, qayerdan qalin so'z. Men muharrirman, qayerda nima yetishmayotganini tez payqayman va ko'rsatib turaman. Matnni esa o'zingiz yozasiz. Beshinchi sahifa maqolangiz uchun bo'sh turibdi.",
      'На прошлом уроке мы увидели, как теги наводят порядок в тексте. Теперь с этими знаниями починим пять страниц по одной. Код пишешь ты, а я рядом. А на пятой странице будет твоя собственная статья!',
      'Last lesson we saw how tags put text in order. Now let’s use that to fix the five pages one by one. You write the code, and I’ll be right here. And on the fifth page you’ll write your own article!'),
    ask: L3("«Nashr qilish» tugmasini bosing", 'Нажми «Опубликовать»', 'Tap “Publish”'),
    askDone: L3("Beshta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять страниц — код пишешь ты', 'Let’s fix five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Bosh sahifa", 'Главная', 'Front page'),
    say: L3("Gazeta bosh sahifadan ochiladi, shundan boshlaymiz. Varaqdagi nomga qarang: «Maktab gazetasi» turibdi, demak, title joyida. Lekin sahifaning o'zida katta sarlavha yo'q, chunki h1 bo'sh qolibdi. Asosiy sarlavhani aynan h1 yasaydi, sahifadagi eng kattasi shu bo'ladi. h1 ichiga ham «Maktab gazetasi» deb yozing, nom ikki joyda ko'rinsin.",
      'Первая страница: главная. Посмотри на вкладку: там название «Школьная газета». Оно берётся из тега title, и с ним всё в порядке. А на самой странице большого заголовка нет: h1 пустой. Помнишь, h1 — это главный заголовок, то есть самый крупный на странице. Впиши в h1 «Школьная газета».',
      'The first page is the front page. Look at the tab: it says “School paper”. That name comes from the title tag, and it’s fine. But the page itself has no big heading: h1 is empty. Remember, h1 is the main heading, that is, the biggest one on the page. Type “School paper” inside h1.'),
    ask: L3("h1 ichiga «Maktab gazetasi» deb yozing", 'Впиши в h1: «Школьная газета»', 'Type “School paper” inside h1'),
    ok: L3("Gazeta nomi endi ikki joyda turibdi: varaqda kichkina, sahifada esa katta sarlavha bo'lib!", 'Отлично! Теперь название в двух местах: маленьким на вкладке и крупным заголовком на странице!', 'Great! Now the name is in two places: small on the tab and as a big heading on the page!'),
    hints: [
      L3("Varaqdagi nomni title qo'yadi, buni bilamiz. Sahifaning o'zidagi katta sarlavha-chi, u qaysi tegda yashaydi?", 'Название на вкладке берётся из title. А в каком теге пишут крупный заголовок на самой странице?', 'The tab name comes from title. And which tag holds the big heading on the page itself?'),
      L3("Ochuvchi va yopuvchi h1 teglarining o'rtasiga qarang: o'sha bo'sh joy sarlavhani kutib turibdi.", 'Пиши в пустое место между открывающим и закрывающим тегом h1.', 'Type in the empty spot between the opening and closing h1 tags.'),
      L3("Kitoblar sahifasida ham katta sarlavha bor, uni h1 qiladi. Sizning h1 ichingizga esa «Maktab gazetasi» tushadi.", 'Например, у страницы про книги — так. А ты впиши «Школьная газета».', 'For a page about books, it looks like this. You type “School paper”.')
    ],
    drill: L3("Endi sarlavhani «Bizning maktab» qiling", 'А теперь сделай заголовок «Наша школа»', 'Now make the heading “Our school”')
  },
  t2: {
    eyebrow: L3("Sport", 'Спорт', 'Sport'),
    say: L3("Sport bo'limida muammo boshqacha: asosiy sarlavha joyida, bo'lim sarlavhasi esa o'chib ketibdi. Jamoamiz yutgan ekan-u, bu haqda sarlavha yo'q! Bo'lim sarlavhasi asosiysidan sal kichikroq bo'ladi, shuning uchun unga h2 tegi kerak. Bo'sh qatorga sarlavhani to'liq yozing: ochuvchi h2 tegi, «Futbol» so'zi va yopuvchi h2 tegi.",
      'Главная готова, теперь спорт. Здесь главный заголовок есть, а заголовок раздела стёрся. Заголовок раздела чуть мельче главного, поэтому ему нужен тег h2. Напиши в пустой строке всю строку: открывающий тег h2, слово «Футбол» и закрывающий тег h2.',
      'The front page is done, now sport. The main heading is here, but the section heading got erased. A section heading is a bit smaller than the main one, so it needs the h2 tag. Write the whole line in the empty row: the opening h2 tag, the word “Football” and the closing h2 tag.'),
    ask: L3("h2 qatorini yozing: «Futbol»", 'Напиши строку h2: «Футбол»', 'Write the h2 line: “Football”'),
    ok: L3("Futbol xabari endi o'z sarlavhasi bilan turibdi, uni hech kim o'tkazib yubormaydi!", 'Вот это да! Вся строка написана твоими руками, и у раздела спорта появился заголовок!', 'Wow! You wrote the whole line, and the sport section got its heading!'),
    hints: [
      L3("Tepadagi katta sarlavhaga qarang: u h1 tegida yozilgan va sahifada bitta bo'ladi. Bo'lim sarlavhasi uchun esa h2 tegini olamiz.", 'h1 — главный заголовок, он уже есть. Для заголовка раздела берут тег h2.', 'h1 is the main heading, and it’s already here. A section heading uses the h2 tag.'),
      L3("Sarlavhaning boshida ochuvchi h2 tegi, oxirida qiya chiziqli yopuvchi h2 tegi turadi. «Futbol» so'zi esa shu ikkisining o'rtasiga tushadi.", 'В строке три части: открывающий тег h2, слово и закрывающий тег h2. В закрывающем есть косая черта.', 'The line has three parts: the opening h2 tag, the word and the closing h2 tag. The closing one has a slash.'),
      L3("Basketbol bo'limi sarlavhasi qanday yozilgan, bilasizmi? Ochuvchi h2, so'z, yopuvchi h2. Futbol ham aynan shunday.", 'Вот строка для раздела про баскетбол. Напиши так же, только со словом «Футбол».', 'Here’s the line for a basketball section. Write it the same way, just with the word “Football”.')
    ],
    drill: L3("Endi yana bir bo'lim: h2, «Shaxmat»", 'Теперь ещё раздел: h2, «Шахматы»', 'One more section: h2, “Chess”')
  },
  t3: {
    eyebrow: L3("Hayvonlar", 'Животные', 'Animals'),
    say: L3("Hayvonlar sahifasini maktabda hammadan ko'p o'qishadi, shuning uchun u bo'sh qolmasligi kerak. Sarlavhalar joyida, mushuklar haqidagi matn esa yo'qolgan. Kodda yangi qatorga o'tsangiz ham, brauzer buni sezmaydi, hamma gapni bitta qatorga yopishtiraveradi. Yangi abzasni faqat p tegi ocha oladi. Mushuklar haqida ikkita abzas yozing, har biri o'z p tegida tursin.",
      'Две страницы готовы! Третья: животные. Заголовки на месте, а текст про кошек пропал. Помнишь, даже если в коде перейти на новую строку, браузер склеит всё в одну. Новый абзац делает только тег p. Напиши про кошек два абзаца, каждый в своём p.',
      'Two pages are done! The third is animals. The headings are there, but the text about cats is gone. Remember, even if you start a new line in the code, the browser glues it all into one. Only the p tag makes a new paragraph. Write two paragraphs about cats, each in its own p.'),
    ask: L3("Mushuklar haqida ikki abzas yozing: ikkita p", 'Напиши два абзаца про кошек: два p', 'Write two paragraphs about cats: two p'),
    ok: L3("Ikkita abzas endi alohida-alohida turibdi, mushuklar haqidagi matnni o'qish yoqimli!", 'Огонь! Два абзаца, и каждый сам по себе. Теперь текст легко читать!', 'Awesome! Two paragraphs, each on its own. The text is easy to read now!'),
    hints: [
      L3("Har bir abzasning o'z p tegi bo'ladi. Kodda shunchaki yangi qatorga o'tsangiz, abzas paydo bo'lmaydi.", 'Каждый абзац стоит в своём p. Новая строка в коде абзаца не делает.', 'Each paragraph sits in its own p. A new line in the code doesn’t make a paragraph.'),
      L3("Buni ikki marta takrorlang: ochuvchi p tegi, bitta gap, yopuvchi p tegi.", 'Напиши два раза: открывающий тег p, предложение, закрывающий тег p.', 'Write it twice: the opening p tag, a sentence, the closing p tag.'),
      L3("Itlar haqidagi ikkita abzas qanday yozilgan? Har biri o'z p tegida. Mushuklar ham shunday ikkiga bo'linadi.", 'Вот два абзаца про собак. Напиши так же, только про кошек.', 'Here are two paragraphs about dogs. Write them the same way, just about cats.')
    ],
    drill: L3("Endi itlar haqida ikki abzas yozing", 'Теперь два абзаца про собак', 'Now two paragraphs about dogs')
  },
  t4: {
    eyebrow: L3("Ob-havo", 'Погода', 'Weather'),
    say: L3("Ob-havo sahifasini o'qigan bir sinfdoshim menga yozdi: «Hamma narsa qalin chiqyapti, ko'zim og'ridi!» Qarang-chi, rostdan ham: faqat ikkita so'z qalin bo'lishi kerak edi, pastdagi hamma matn ham qalinlashib ketibdi. Qalinlik qaysi so'zdan boshlanganini ko'ryapsizmi? O'sha so'zlar turgan qatorni kodda topib, ustiga bosing.",
      'Три страницы готовы! Четвёртая: погода. Смотри, тут странно: жирными должны быть только два слова, а жирным стал и весь текст ниже. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is weather. Look, something’s odd here: only two words were supposed to be bold, but all the text below turned bold too. So one line of code is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Qalin harflarning sababchisi topildi: b tegi ochilgan, yopilishi esa esdan chiqqan. Brauzer qalinlikni to'xtatmay, pastdagi matnga ham yoyib yuboribdi. Yopuvchi b tegi qayerga tushishini o'zingiz bilasiz, shu qatorni tuzating.",
      'Нашлась! b открыт, но не закрыт. Поэтому браузер сделал жирным и весь текст ниже. Теперь почини эту строку.',
      'Found it! b opens but never closes. That’s why the browser made all the text below bold too. Now fix this line.'),
    ok: L3("Bitta unutilgan teg butun sahifani qalin qilib yuborgan ekan! Siz uni bir zumda topdingiz, endi qalinlik faqat kerakli so'zlarda.", 'Ура, заработало! Жирными остались только нужные слова. Поломка найдена, как у настоящего программиста!', 'Yes, it works! Only the right words are bold now. You found the bug like a real developer!'),
    why: {
      0: L3("body qatorining qalinlikka aloqasi yo'q-ku. Qalinlik qayerdan boshlanganini qidiring.", 'Здесь открывается body, строка в порядке. Посмотри, откуда начинается жирный текст.', 'body opens here, this line is fine. Look at where the bold text starts.'),
      1: L3("h1 qatori butun: ochuvchi teg ham, yopuvchisi ham joyida. Muammo pastroqda, keyingi qatorga qarang.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      3: L3("Bu abzasning o'zi joyida, qalinlik unga tepadan yuqib qolgan. Bir qator tepaga qarang-chi.", 'Сам этот абзац в порядке, но жирность пришла к нему сверху. Посмотри на строку выше.', 'This paragraph is fine itself, but the bold came to it from above. Look one line up.'),
      4: L3("body shu yerda tugaydi, qalinlikka bu qator sabab emas.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Qalin harflar qaysi so'zdan boshlanyapti? O'sha yerda qaysi teg yopilmay qolgan ekan?", 'С какого слова начинается жирный? Какой тег забыл закрыть свою часть?', 'Which word does the bold start from? Which tag forgot to close its part?'),
      L3("Qalin so'zlar turgan qatorga qarang: b ochilibdi, yopuvchi b tegi esa qani?", 'Посмотри на строку с жирными словами: b открыт, а где закрывающий b?', 'Look at the line with the bold words: b is open, but where’s the closing b?'),
      L3("Qalin so'zlar odatda b ichida turadi va o'z vaqtida yopiladi. Sizning qatoringizda yopuvchi b tegi nega yo'qligini o'ylab ko'ring-da, uni qo'shing.", 'Вот правильно закрытый b. Поставь закрывающий b после жирных слов.', 'Here’s a properly closed b. Put the closing b after the bold words.')
    ],
    drill: L3("Bu sahifada ham bir narsa buzilgan: topib, tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening maqolam", 'Моя статья', 'My article'),
    say: L3("Gazetaning eng qiziq sahifasi qoldi: bu sizning maqolangiz! Hozircha unda faqat body bor. Maqola sarlavhadan boshlanadi, shuning uchun eng tepaga h1 tegida sarlavha yozing. Uning ostiga p tegida abzas qo'ying, ichidagi eng muhim so'zni esa b yoki i bilan ajrating. Nima haqida yozasiz, sevimli hayvoningiz, o'yiningiz yoki taomingiz haqidami? Tartibni chizma ko'rsatib turadi.",
      'Четыре страницы горят! Теперь пятая: твоя статья. Здесь есть только body. Внутри напиши статью сам. В самом верху заголовок в теге h1. Потом абзац в теге p. А самое важное слово в абзаце выдели тегом b или i. Тему выбирай сам: животное, игра или любимая еда. Схема подскажет дорогу.',
      'Four pages are lit! Now the fifth: your article. There’s only body here. Write the article inside it yourself. At the very top, a heading in the h1 tag. Then a paragraph in the p tag. And mark the most important word in the paragraph with b or i. Pick the topic yourself: an animal, a game or your favourite food. The plan will show you the way.'),
    ask: L3("body ichiga yozing: h1, p va b yoki i", 'Напиши в body: h1, p и в нём b или i', 'Write inside body: h1, p and b or i'),
    ok: L3("Sarlavha, abzas va ajratilgan so'z: butun maqola sizning qo'lingizdan chiqdi! Ertaga uni butun maktab o'qiydi.", 'Это было мощно! Вся статья твоя: заголовок, абзац и выделенное слово!', 'That was awesome! You wrote the whole article: a heading, a paragraph and a marked word!'),
    hints: [
      L3("Chizma tartibini kuzating: oldin h1, keyin p, p ichida esa b yoki i keladi.", 'Посмотри на схему: сначала h1, потом p, а внутри p — b или i.', 'Look at the plan: first h1, then p, and b or i inside p.'),
      L3("Har bir ochilgan teg o'zining yopuvchi tegini kutadi. b yoki i tegi esa p yopilishidan oldin, uning ichida yopiladi.", 'Каждый открытый тег закрывается своим закрывающим. А b или i закрывается внутри p.', 'Every opened tag is closed by its own closing tag. And b or i closes inside p.'),
      L3("Namunada it haqidagi kichkina maqola turibdi: sarlavha, abzas va bitta qalin so'z. Sizniki ham shu tuzilishda bo'lsin, mavzusi esa o'zingizniki.", 'Вот статья про собаку. Напиши так же, только про своё.', 'Here’s an article about a dog. Write yours the same way, about your own topic.')
    ]
  },
  drill: {
    say: L3("Yana bitta iltimos: xuddi shunday sahifani boshqa so'zlar bilan o'zingiz yozib ko'ring-chi.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Gazeta chiqishiga hali vaqt bor, siz esa tezlashib ketdingiz!", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Yarim soatga ulgurdik: gazeta tayyor, endi uni nashr qilsak bo'ladi!", 'Смотри, все пять страниц газеты готовы! Сайт спасён — и это твоя работа.', 'Look, all five pages of the paper are ready! You saved the site.') },
      { k: 'h', text: L3("Esingizdami, qaysi sarlavha eng katta edi? Asosiy sarlavha h1 tegida turdi, bo'lim sarlavhasi esa sal kichikroq h2 bo'ldi.", 'Главный заголовок стоял в h1, а заголовок раздела — в h2.', 'You put the main heading in h1 and the section heading in h2.') },
      { k: 'p', text: L3("Abzaslar o'z p teglarida turgani uchun matn bir-biriga yopishmadi.", 'Каждый абзац был в своём p, поэтому текст не слипся.', 'Each paragraph sat in its own p, so the text didn’t glue together.') },
      { k: 'bi', text: L3("Qalin va qiya so'zlarni b bilan i ajratdi, siz esa ularni o'z vaqtida yopdingiz, shuning uchun qalinlik boshqa joyga yoyilmadi.", 'Важные слова выделены тегами b и i, и теги закрыты, поэтому жирное не расползлось.', 'You marked important words with b and i, and you didn’t forget to close them.') },
      { k: 'own', text: L3("Gazetada endi sizning maqolangiz ham bor! Sarlavha, abzas va qalin so'z tayyor, endi nima qo'shsak, gazeta boyroq chiqadi? Ro'yxatlar kerak bo'lsa kerak.", 'А в конце вся статья написана твоими руками. Это было мощно! На следующем уроке сделаем списки.', 'And at the end you wrote a whole article yourself. That was awesome! Next lesson we’ll make lists.') }
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
