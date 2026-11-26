// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 5 — «Зоопарк Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot5/build.mjs → lessons/html/05p-izobrazheniya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 5 · «Зоопарк Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на основе практики 04p — tools/amaliyot4). Коди сделал сайт зоопарка: страницы
// животных с фото. При сохранении фото пропали — на страницах остались только подписи. Ученик чинит
// страницы по одной и сам пишет код: имя файла в src → строка img с src и alt → фото и абзац под ним
// (смесь с уроком 2) → найти img с href вместо src (загадка урока 5) → своя страница: h1, img и p.
// Карта — вкладки браузера, как в 01p–04p. 7 слайдов: крючок · пять заданий · вывод. Сценарий —
// docs/scenarij-05p-izobrazheniya.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a5-screens.jsx) находит теги, атрибуты и текст, страницу рисует
//     React. Браузер честный, как в уроке 5: есть файл — картинка; нет файла — значок сломанной картинки и
//     текст alt; нет src — только текст alt; у img нет закрывающего тега.
//   · Код — часть body, как в уроках 2–5; в задании 1 — готовый код с пустым src.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; rasm, rasm fayli, alt matni,
//     buzilgan rasm belgisi — как в уроке 5. В речи img и src — по буквам, alt — по-английски. Символов
//     (= " /) в звучащих фразах нет. RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-05p-izobrazheniya',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: "5-amaliyot. Kodining hayvonot bog'i",
    ru: 'Практика 5. Зоопарк Коди',
    en: 'Practice 5. Kodi’s zoo'
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
  next: L3("Formalar", 'Формы', 'Forms'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga fayl nomining o'zini yozing, xolos: qo'shtirnoq bilan burchakli qavslar kodda allaqachon bor.", 'Здесь нужно только имя файла: без кавычек и уголков.', 'Only the file name here: no quotes or angle brackets.'),
  files: L3("Rasm fayllari", 'Файлы картинок', 'Picture files'),
  nf: L3("Fayl topilmadi", 'Файл не найден', 'File not found'),
  nfText: L3("Bunday fayl saytda yo'q.", 'Такого файла на сайте нет.', 'There’s no such file on the site.'),
  part: {
    open: L3("ochuvchi teg", 'открывающий', 'opening tag'),
    words: L3("so'zlar", 'слова', 'words'),
    close: L3("yopuvchi teg", 'закрывающий', 'closing tag')
  },
  bpH1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'),
  bpImg: L3("rasm: src va alt", 'картинка: src и alt', 'picture: src and alt'),
  bpP: L3("abzas", 'абзац', 'paragraph'),
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
// ЗООПАРК — животные (название, факт для абзаца) и файлы картинок на «диске» сайта (рисунки — в a5-screens.jsx).
// ─────────────────────────────────────────────────────────────────────────────
const ANIMAL = {
  sher: { name: L3("Sher", 'Лев', 'Lion'), fact: L3("Sher kuniga yigirma soat uxlaydi.", 'Лев спит по двадцать часов в день.', 'A lion sleeps twenty hours a day.') },
  fil: { name: L3("Fil", 'Слон', 'Elephant'), fact: L3("Fil xartumi bilan suv ichadi.", 'Слон пьёт воду с помощью хобота.', 'An elephant drinks water with its trunk.') },
  jirafa: { name: L3("Jirafa", 'Жираф', 'Giraffe'), fact: L3("Jirafaning bo'yni juda uzun.", 'У жирафа очень длинная шея.', 'A giraffe has a very long neck.') },
  panda: { name: L3("Panda", 'Панда', 'Panda'), fact: L3("Panda kun bo'yi bambuk yeydi.", 'Панда целый день ест бамбук.', 'A panda eats bamboo all day.') },
  toshbaqa: { name: L3("Toshbaqa", 'Черепаха', 'Turtle'), fact: L3("Toshbaqa juda sekin yuradi.", 'Черепаха ходит очень медленно.', 'A turtle walks very slowly.') },
  kapalak: { name: L3("Kapalak", 'Бабочка', 'Butterfly'), fact: L3("Kapalak gullarni yaxshi ko'radi.", 'Бабочка любит цветы.', 'A butterfly loves flowers.') }
};
const IMG_FILES = ['sher.jpg', 'fil.jpg', 'jirafa.jpg', 'panda.jpg', 'toshbaqa.jpg', 'kapalak.jpg'];
// Ссылок на другие страницы в этой практике нет: переходы — только «Fayl topilmadi».
const SITE = {};
const SITE_FILES = [];
// ПЯТЬ ВКЛАДОК — объекты карты: файл страницы, значок, цвет. Пятая — своя страница ученика.
const TABS = [
  { id: 'sher', file: 'sher.html', ico: 'paw', c: '#FA4F28', name: ANIMAL.sher.name },
  { id: 'fil', file: 'fil.html', ico: 'leaf', c: '#7C5CFA', name: ANIMAL.fil.name },
  { id: 'jirafa', file: 'jirafa.html', ico: 'sun', c: '#0FA38E', name: ANIMAL.jirafa.name },
  { id: 'panda', file: 'panda.html', ico: 'heart', c: '#F59E0B', name: ANIMAL.panda.name },
  { id: 'mine', file: 'mening.html', ico: 'star', c: '#E44D26', name: L3("Mening sahifam", 'Моя страница', 'My page') }
];
const XTRA = {
  ownH: L3("Mening sevimli hayvonim", 'Моё любимое животное', 'My favourite animal')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {attr} — атрибут.
// В звучащих узбекских фразах нет тире и символов (= " /): движок делает из тире точку.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Qafas hali bo'sh turibdi, kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Qarang, bu teskari chiziq «\\» bo'lib qolibdi. O'ngga qiyshaygan «/» kerak: yopuvchi tegda aynan u turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("Bu tegning oxiri tushib qolibdi, unga o'ng burchakli qavs «>» kerak: \u2063«{bad}»\u2064.", 'В конце тега не хватает уголка «>»: \u2063«{bad}»\u2064.', 'This tag is missing the bracket “>” at the end: \u2063“{bad}”\u2064.'),
  noLt: L3("Teg doim chap burchakli qavs «<» bilan boshlanadi, bunisida esa boshi tushib qolibdi: \u2063«{bad}»\u2064.", 'Тег начинается с уголка «<», а здесь его нет: \u2063«{bad}»\u2064.', 'A tag starts with the bracket “<”, but it’s missing here: \u2063“{bad}”\u2064.'),
  typo: L3("Bu teg hayvonot bog'imizda yo'q: \u2063«{bad}»\u2064. Balki «{near}» yozmoqchisiz?", 'Такого тега нет: \u2063«{bad}»\u2064. Может быть, «{near}»?', 'There’s no such tag: \u2063“{bad}”\u2064. Did you mean “{near}”?'),
  unknown: L3("Bog'imiz sahifalarida bunday teg uchramaydi: \u2063«{bad}»\u2064. Rasm qo'yish uchun img tegi kerak bo'ladi.", 'Такого тега на нашей странице нет: \u2063«{bad}»\u2064. Для картинки у нас есть тег img.', 'Our page has no such tag: \u2063“{bad}”\u2064. For a picture we have the img tag.'),
  noLevel: L3("Bunday sarlavha bo'lmaydi: \u2063«{bad}»\u2064. Sarlavha teglari h1 tegidan boshlanib, h6 tegida tugaydi.", 'Такого заголовка нет: \u2063«{bad}»\u2064. Заголовки бывают от h1 до h6.', 'There’s no such heading: \u2063“{bad}”\u2064. Headings go from h1 to h6.'),
  emptyTag: L3("Burchakli qavslarning ichi bo'sh, ichiga teg nomini yozing.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Sahifaning qolgan qismini men yozib qo'yganman. Siz bu yerga faqat body ichidagi qismni yozing.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body teglari tepada ham, pastda ham allaqachon turibdi. Kodni ularning o'rtasiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Matn tegsiz qolib ketibdi. Uning oldiga ochuvchi {tag} tegini qo'ying.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeFirst: L3("Bu yopuvchi \u2063{got}\u2064 tegi, uning ochuvchisi hali yo'q. Bu yerga oldin ochuvchi {tag} tegi kerak.", 'Это закрывающий тег \u2063{got}\u2064. Здесь сначала нужен открывающий тег {tag}.', 'That’s the closing \u2063{got}\u2064 tag. First you need the opening {tag} tag here.'),
  closeStray: L3("Bu yopuvchi \u2063{got}\u2064 tegi, lekin u hali ochilmagan-ku. Yopishdan oldin uni ochish kerak.", 'Это закрывающий тег \u2063{got}\u2064, но открывающего тега нет.', 'That’s the closing \u2063{got}\u2064 tag, but it was never opened.'),
  wrongOpen: L3("Bu joyga {tag} tegi kerak edi, boshqasi emas: \u2063{got}\u2064.", 'Здесь нужен тег {tag}, другой не подойдёт: \u2063{got}\u2064.', 'You need the {tag} tag here, not another one: \u2063{got}\u2064.'),
  needText: L3("{tag} tegi hali bo'sh turibdi, uning ichiga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu hali ochuvchi teg. Yopuvchi tegda {tag} so'zining oldida qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} hali ochiq qolgan! Oxiriga yopuvchi {tag} tegini yozib qo'ying.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmay qolibdi, hayvonning rasmi bilan abzasi ham sarlavha bo'lib ketdi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  textAfter: L3("Yopuvchi {tag} tegidan keyin matn tashqarida qolib ketibdi. Uni teglarning o'rtasiga olib kiring.", 'После закрывающего тега {tag} остался текст. Перенеси его внутрь тегов.', 'There’s text left after the closing {tag} tag. Move it inside the tags.'),
  extra: L3("Kodning oxirida bitta ortiqcha teg qolib ketibdi: \u2063{got}\u2064.", 'В конце остался лишний тег: \u2063{got}\u2064.', 'There’s an extra tag at the end: \u2063{got}\u2064.'),
  short: L3("Bunchalik qisqa matn ko'rinmay qoladi, kamida ikkita harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} yopilmagan ekan. Ajratilgan so'zlardan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Yopuvchi {tag} tegi bor-u, {tag} hali ochilmagan ekan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} tegining ichida so'z yo'q, hech bo'lmasa bittasini yozing.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  h1First: L3("Hayvonning sahifasi hayvon nomidan boshlanadi: eng tepaga h1 tegini yozing.", 'Страница начинается с заголовка: в самом верху напиши h1.', 'The page starts with a heading: write h1 at the very top.'),
  mainH1: L3("Sahifaning asosiy sarlavhasiga h1 tegi kerak, boshqasi emas: \u2063{got}\u2064.", 'Для главного заголовка нужен h1, другой не подойдёт: \u2063{got}\u2064.', 'The main heading needs h1, not another tag: \u2063{got}\u2064.'),
  oneH1: L3("Sahifada h1 tegi faqat bitta bo'ladi. Keyingi sarlavhalarga esa h2 tegini qo'ying.", 'h1 на странице один. Для следующих заголовков есть h2.', 'A page has just one h1. Use h2 for the next headings.'),
  textNoLi: L3("Bu so'z li ichiga tushmagan: oldida nuqta ham, raqam ham chiqmadi. Har bir bandni o'z li tegiga soling.", 'Этот текст не внутри li, поэтому у него нет точки или номера. Каждый пункт пиши внутри li.', 'This text isn’t inside li, so it has no bullet or number. Write each item inside li.'),
  liOut: L3("li faqat ro'yxat ichida bo'ladi: hayvonlar sahifasida ro'yxat kerak bo'lsa, ul yoki ol tegini oching.", 'li живёт внутри списка: сначала напиши открывающий тег ul или ol.', 'li lives inside a list: write the opening ul or ol tag first.'),
  listMismatch: L3("Ro'yxatni {tag} tegi ochgan, yopuvchisi ham {tag} bo'lishi kerak.", 'Список открыт тегом {tag}, значит, и закрывается тегом {tag}.', 'The list opens with {tag}, so it closes with {tag}.'),
  noHref: L3("a tegida href turmagani uchun so'z oddiy matn bo'lib qoldi. Ochuvchi a tegiga href atributini qo'shing.", 'У этого тега a нет href, поэтому слово осталось простым текстом. Добавь href в открывающий тег a.', 'This a tag has no href, so the word stayed plain text. Add href to the opening a tag.'),
  emptyHref: L3("Qo'shtirnoq ichi bo'sh qolibdi: href atributiga fayl nomini yozing.", 'href пустой: впиши в кавычки имя файла.', 'href is empty: write the file name in the quotes.'),
  fileNo: L3("Saytda bunday fayl topilmadi: \u2063«{got}»\u2064. Fayl nomini ro'yxatdan harfma-harf ko'chirib yozing.", 'Такого файла нет: \u2063«{got}»\u2064. Пиши имя файла буква в букву: посмотри на список.', 'There’s no such file: \u2063“{got}”\u2064. Write the file name letter by letter: look at the list.'),
  fileOther: L3("Bu havola boshqa sahifaga olib ketadi: \u2063{got}\u2064. Bizga esa {want} kerak.", 'Эта ссылка ведёт на другую страницу: \u2063{got}\u2064. А нужно {want}.', 'This link goes to a different page: \u2063{got}\u2064. We need {want}.'),
  aOpen: L3("a tegi yopilmay qolibdi, shuning uchun keyingi matn ham havolaga aylanib ketdi. Havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт, поэтому и текст дальше стал ссылкой. После слов ссылки напиши закрывающий тег a.', 'a isn’t closed, so the text after it became a link too. Add the closing a tag after the link words.'),
  // Атрибуты (уроки 4–5).
  noQuote: L3("{attr} qiymatini qo'shtirnoq ichiga olishni unutibsiz: fayl nomi shu ikki belgi o'rtasida turadi.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("{attr} so'zidan keyin teng belgisi turadi, undan keyin esa qo'shtirnoq ichida qiymat keladi.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("Brauzer bunday atributni tanimaydi: \u2063«{bad}»\u2064. Rasmning atributlari ikkita: src va alt.", 'Такого атрибута нет: \u2063«{bad}»\u2064. У картинки есть src и alt.', 'There’s no such attribute: \u2063“{bad}”\u2064. A picture has src and alt.'),
  attrNone: L3("Bu {tag} tegiga atribut kerak emas, atributlar rasmga kerak. Uni olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  // Картинки (урок 5).
  hrefOnImg: L3("Rasmga href emas, src kerak, chunki rasm faylining nomini brauzerga aynan src aytadi.", 'Картинке нужен не href, а src: src называет файл картинки.', 'A picture needs src, not href: src names the picture file.'),
  noSrc: L3("Bu img tegida src yo'q ekan, shuning uchun brauzer qaysi rasmni chiqarishni bilmadi. img tegiga src atributini qo'shing.", 'У этого тега img нет src, поэтому картинка не появилась. Добавь src в тег img.', 'This img tag has no src, so the picture didn’t show. Add src to the img tag.'),
  emptySrc: L3("src qiymati hali bo'sh. Qo'shtirnoq ichiga rasm faylining nomini yozing.", 'src пустой: впиши в кавычки имя файла картинки.', 'src is empty: write the picture file name in the quotes.'),
  imgNo: L3("Hayvonot bog'ida bunday rasm fayli yo'q: \u2063«{got}»\u2064. Shuning uchun brauzer buzilgan rasm belgisini chiqardi. Ro'yxatga qarang-da, fayl nomini harfma-harf yozing.", 'Такого файла картинки нет: \u2063«{got}»\u2064. Поэтому вышел значок сломанной картинки. Пиши имя файла буква в букву: посмотри на список.', 'There’s no such picture file: \u2063“{got}”\u2064. That’s why a broken picture icon showed up. Write the file name letter by letter: look at the list.'),
  imgOther: L3("Bu boshqa hayvonning rasmi chiqdi: \u2063{got}\u2064. Bizga esa {want} kerak edi.", 'Это картинка другого животного: \u2063{got}\u2064. А нужна {want}.', 'That’s a different animal’s picture: \u2063{got}\u2064. We need {want}.'),
  noAlt: L3("Bu img tegida alt atributi yo'q ekan. Uni qo'shing-da, rasmda nima borligini so'z bilan yozing: rasm ochilmay qolsa, brauzer shu so'zlarni ko'rsatadi.", 'Нет alt. Напиши в alt словами, что на картинке: если она не откроется, появятся эти слова.', 'There’s no alt. In alt, say in words what’s in the picture: if it doesn’t open, those words show up.'),
  emptyAlt: L3("alt qiymati bo'sh qolibdi. Qo'shtirnoq ichiga rasmda nima borligini yozing.", 'alt пустой: напиши, что на картинке.', 'alt is empty: write what’s in the picture.'),
  imgClose: L3("img tegining jufti yo'q, u yopilmaydi. Yopuvchi img tegini olib tashlang, u bu yerda ortiqcha.", 'img не закрывается: закрывающий тег img не нужен, убери его.', 'img doesn’t close: the closing img tag isn’t needed, remove it.'),
  needImg: L3("Sarlavha tayyor bo'ldi! Endi hayvonning rasmini qo'ying: img tegi, unga src va alt kerak.", 'Заголовок готов! Теперь поставь картинку: тег img, src и alt.', 'The heading is ready! Now add a picture: the img tag, src and alt.'),
  imgFirst: L3("Bu sahifada oldin rasm turadi, keyin abzas keladi. Shuning uchun eng tepaga img tegini yozing.", 'Сначала картинка, потом абзац: в самом верху напиши тег img.', 'First the picture, then the paragraph: write the img tag at the very top.'),
  needPAfter: L3("Rasm joyiga keldi! Endi uning tagiga hayvon haqida abzas yozing.", 'Картинка готова! Теперь под ней напиши абзац.', 'The picture is ready! Now write a paragraph under it.'),
  keepImg: L3("Fayl nomi bilan alt qiymatiga tegmang, ular o'zi to'g'ri. Faqat href so'zini src bilan almashtiring.", 'Пусть имя файла и alt останутся прежними: просто напиши src вместо href.', 'Keep the file name and alt as they were: just write src instead of href.'),
  next: L3("Endi {tag} qismini ham yozib qo'ying.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Hayvonot bog'i", 'Зоопарк', 'Zoo'),
    say: L3("Hayvonot bog'ida bir kun o'tkazsangiz, oldin kimning oldiga borardingiz, sherningmi yoki pandaningmi? Menga hammasi yoqadi, shuning uchun saytimga hammasini qo'ydim: sher, fil, jirafa va panda. Beshinchi sahifa bo'sh, u sizning hayvoningiz uchun. Mehmonlar ertalab keladi, endi «Saqlash» tugmasini bosing.",
      'Привет! Я сделал сайт зоопарка. У каждого животного своя страница: лев, слон, жираф, панда и ещё одна пустая. Пустая будет твоей! Осталось только сохранить сайт. Нажми «Сохранить».',
      'Hi! I made a zoo website. Each animal has its own page: lion, elephant, giraffe, panda and one more empty page. The empty one will be yours! I just need to save the site. Tap “Save”.'),
    broke: L3("Sher sahifasini ochsam, sher o'rniga faqat «Sher» degan so'z turibdi! Rasmlarni kecha boshqa papkaga ko'chirgandim, saytga aytishni unutibman. Qafaslar ochiq qolibdi-ku: hamma sahifada rasm o'rniga so'zlar.",
      'Ой! При сохранении картинки пропали. На страницах вместо них остались только слова.',
      'Oh no! The pictures got lost while saving. Only words are left on the pages instead of them.'),
    done: L3("Hayvonlar yo'qolmagan, papkada turibdi. Ularni sahifaga qaytarish uchun img tegi, src va alt atributlari kerak. Qochoqlarni kod yozib o'zingiz tutasiz, men esa ular qayerda yashiringanini aytib turaman. Beshinchi qafas hali bo'sh: unga sevimli hayvoningizni o'zingiz olib kelasiz!",
      'На прошлом уроке мы познакомились с картинками: тег img, атрибуты src и alt. Теперь с этими знаниями починим пять страниц по одной. Код пишешь ты, а я рядом. А пятая страница будет твоей!',
      'Last lesson we met pictures: the img tag and the src and alt attributes. Now let’s use that to fix the five pages one by one. You write the code, and I’ll be right here. And the fifth page will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("Beshta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять страниц — код пишешь ты', 'Let’s fix five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Sher", 'Лев', 'Lion'),
    say: L3("Birinchi bo'lib sherni qaytaramiz. Kodga qarang: img tegi joyida, alt ham bor, lekin src qiymati bo'm-bo'sh qolibdi. Brauzer qaysi faylni ochishni bilmayapti, shuning uchun rasm o'rnida faqat alt matni chiqyapti. Qo'shtirnoq ichiga rasm faylining nomini yozing: sher.jpg.",
      'Первая страница: лев. Тег img на месте, alt тоже есть, а значение src пустое. Поэтому вместо картинки виден только текст alt. Впиши в кавычки имя файла картинки: sher.jpg.',
      'The first page is the lion. The img tag is there, and so is alt, but the src value is empty. That’s why only the alt text shows instead of the picture. Type the picture file name in the quotes: sher.jpg.'),
    ask: L3("src ichiga yozing: sher.jpg", 'Впиши в src: sher.jpg', 'Type in src: sher.jpg'),
    ok: L3("Sherimiz qaytib keldi! Brauzer sher.jpg faylini topdi-yu, rasmni darrov ochib berdi.", 'Отлично! Вот и картинка со львом!', 'Great! There’s the lion picture!'),
    hints: [
      L3("Rasm qaysi fayldan olinishini brauzerga src aytadi. Kodda bo'sh qo'shtirnoqni topa olasizmi?", 'Из какого файла взять картинку, говорит src. Найди пустые кавычки.', 'src says which file the picture comes from. Find the empty quotes.'),
      L3("Endi o'sha bo'sh qo'shtirnoq ichiga fayl nomini harfma-harf yozasiz. Qaysi fayllar borligi yoningizdagi ro'yxatda ko'rinib turibdi.", 'Впиши в кавычки имя файла буква в букву. Список файлов рядом.', 'Type the file name in the quotes, letter by letter. The list of files is right there.'),
      L3("Fil sahifasidagi rasm qatorida src ichida fil.jpg turibdi. Sherniki ham shunday, faqat fayl nomi boshqa: sher.jpg.", 'Например, картинку слона ставят так. А ты впиши sher.jpg.', 'For example, the elephant picture goes in like this. You type sher.jpg.')
    ],
    drill: L3("Endi src ichiga toshbaqa.jpg yozing", 'Теперь впиши в src: toshbaqa.jpg', 'Now type toshbaqa.jpg in src')
  },
  t2: {
    eyebrow: L3("Fil", 'Слон', 'Elephant'),
    say: L3("Endi filning navbati. Bu sahifada rasm qatori butunlay yo'q bo'lib ketibdi. Bo'sh qatorga uni butunligicha qaytadan yozing: img tegi, src ichida fil.jpg, alt ichida esa Fil degan so'z. Esingizdami, img yopilmaydi: uning jufti yo'q.",
      'Лев готов, теперь слон. На этой странице строка с картинкой стёрлась целиком. Напиши в пустой строке всю строку: тег img, в src — fil.jpg, а в alt — слово «Слон». Помнишь, img не закрывается.',
      'The lion is done, now the elephant. On this page the picture line got erased completely. Write the whole line in the empty row: the img tag, fil.jpg in src, and the word “Elephant” in alt. Remember, img doesn’t close.'),
    ask: L3("img qatori: src «fil.jpg», alt «Fil»", 'Строка img: src «fil.jpg», alt «Слон»', 'img line: src “fil.jpg”, alt “Elephant”'),
    ok: L3("Fil ham uyiga qaytdi! img tegi, src va alt bitta qatorga sig'di, yopuvchi teg esa kerak ham bo'lmadi.", 'Вот это да! Вся строка написана твоими руками, и слон вернулся на страницу!', 'Wow! You wrote the whole line, and the elephant is back on the page!'),
    hints: [
      L3("Rasmni sahifaga img tegi olib chiqadi. Unga esa ikkita atribut kerak: src va alt.", 'Картинку пишут в теге img. Ей нужны два атрибута: src и alt.', 'A picture goes in the img tag. It needs two attributes: src and alt.'),
      L3("src ichiga fayl nomini, alt ichiga esa rasmda nima borligini yozasiz. Ikkala qiymat ham qo'shtirnoq ichida turadi.", 'В src — имя файла, а в alt — что на картинке. Каждое значение в кавычках.', 'src holds the file name, and alt says what’s in the picture. Each value goes in quotes.'),
      L3("Jirafa rasmining qatori oldingisiga o'xshash: fayl nomi va alt so'zi boshqa, xolos. Fil uchun ham shunday yoziladi.", 'Вот строка картинки с жирафом. Напиши так же, только со слоном.', 'Here’s the line for a giraffe picture. Write yours the same way, just with the elephant.')
    ],
    drill: L3("Endi kapalak rasmi: src «kapalak.jpg», alt «Kapalak»", 'Теперь бабочка: src «kapalak.jpg», alt «Бабочка»', 'Now a butterfly: src “kapalak.jpg”, alt “Butterfly”')
  },
  t3: {
    eyebrow: L3("Jirafa", 'Жираф', 'Giraffe'),
    say: L3("Uchinchi sahifa jirafaniki, unda faqat sarlavha qolibdi. Rasm bo'lmasa, jirafaning bo'yi qanchalik uzunligini kim ko'radi? Sarlavhaning tagiga jirafa rasmini qo'ying, src ichida jirafa.jpg bo'lsin. Rasmdan keyin jirafa haqida bitta abzas yozing.",
      'Две страницы готовы! Третья: жираф. Здесь остался только заголовок. Под заголовком поставь картинку жирафа: в src — jirafa.jpg. А под картинкой напиши абзац про жирафа.',
      'Two pages are done! The third is the giraffe. Only the heading is left here. Under the heading, add the giraffe picture with jirafa.jpg in src. And under the picture, write a paragraph about the giraffe.'),
    ask: L3("img «jirafa.jpg» va tagida p yozing", 'Напиши img «jirafa.jpg», а под ним p', 'Write img “jirafa.jpg” and a p under it'),
    ok: L3("Jirafa ham uzun bo'yni bilan qaytdi! Rasmi ham, u haqidagi abzas ham joyida turibdi, sahifa jonlanib ketdi.", 'Огонь! И картинка, и текст на месте. Страница ожила!', 'Awesome! The picture and the text are both there. The page came alive!'),
    hints: [
      L3("Jirafa sahifasida nima birinchi turishi kerak, rasmmi yoki matnmi? Sarlavhadan keyingi qismni o'ylab ko'ring.", 'Сначала тег img с src и alt. Потом абзац в теге p.', 'First the img tag with src and alt. Then a paragraph in the p tag.'),
      L3("Bu ikkita qator bo'ladi. Birinchisida src va alt bilan img tegi, ikkinchisida esa ochuvchi p, jirafa haqida gap va yopuvchi p turadi.", 'Напиши две строки: в первой img, во второй открывающий p, предложение и закрывающий p.', 'Write two lines: img in the first, and the opening p, a sentence and the closing p in the second.'),
      L3("Panda sahifasida rasm tepada, abzas tagida turibdi. Jirafa sahifasi ham shu tartibni xohlaydi.", 'Вот картинка и абзац для панды. Напиши так же, только про жирафа.', 'Here are the picture and paragraph for the panda. Write yours the same way, about the giraffe.')
    ],
    drill: L3("Endi toshbaqa: img «toshbaqa.jpg» va tagida p", 'Теперь черепаха: img «toshbaqa.jpg» и под ним p', 'Now a turtle: img “toshbaqa.jpg” and a p under it')
  },
  t4: {
    eyebrow: L3("Panda", 'Панда', 'Panda'),
    say: L3("Navbat pandaga. Bu sahifada rasm fayli ham, img tegi ham joyida, lekin rasm chiqmayapti, faqat «Panda» degan so'z turibdi. Fayl desam fayl joyida, teg desam teg joyida, nima buzilgan ekan? O'sha qatorni topib, ustiga bosing.",
      'Три страницы готовы! Четвёртая: панда. Смотри, тут странно: тег img есть, файл тоже есть, а картинки нет, только слово. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is the panda. Look, something’s odd here: there’s an img tag and a file, but no picture, just a word. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Pandani yashirgan qator topildi: src o'rniga href yozilibdi, xuddi havolalardagidek! href havolalarga kerak, rasm esa faqat src bilan ochiladi. href so'zini o'chirib, o'rniga src deb yozing.",
      'Нашлась! Здесь вместо src написано href, как у ссылки. А картинке нужен src. Замени href на src.',
      'Found it! Here it says href instead of src, like a link. But a picture needs src. Replace href with src.'),
    ok: L3("Mana, panda topildi! Bor-yo'g'i bitta so'zni almashtirdingiz, butun rasm qaytib keldi.", 'Ура, заработало! Картинка с пандой появилась. Поломка найдена, как у настоящего программиста!', 'Yes, it works! The panda picture showed up. You found the bug like a real developer!'),
    why: {
      0: L3("Bu body qatori, pandaning izi bu yerda yo'q. Rasm qatoriga qarang-chi.", 'Здесь открывается body, строка в порядке. Посмотри на строку с картинкой.', 'body opens here, this line is fine. Look at the picture line.'),
      1: L3("Panda sarlavhasi sahifada ko'rinyapti, demak, h1 qatori butun. Rasmni boshqa qatordan qidiring.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      3: L3("Abzas o'z joyida, panda haqidagi gap ham ko'rinib turibdi. Rasm nega chiqmayapti-chi? Bir qator tepaga qarang.", 'Этот абзац в порядке. Почему нет картинки? Посмотри на строку выше.', 'This paragraph is fine. Why is there no picture? Look one line up.'),
      4: L3("body shu yerda yopiladi, bu yerda ham panda yo'q.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Fayl bor-u, rasm chiqmadi. Esingizdami, rasmga qaysi atribut kerak edi?", 'Файл есть, а картинки нет. Какой атрибут нужен картинке?', 'The file is there, but no picture. Which attribute does a picture need?'),
      L3("Endi img qatoriga qarang-chi: fayl nomi qaysi atributning ichida turibdi?", 'Посмотри на строку img: в каком атрибуте стоит имя файла?', 'Look at the img line: which attribute holds the file name?'),
      L3("Rasm faqat src bilan ochilishini bilasiz. Buzilgan qatorda bu so'z o'rnida nima turibdi? Uni almashtiring.", 'Вот правильная строка картинки. Напиши и ты src вместо href.', 'Here’s a proper picture line. Write src instead of href too.')
    ],
    drill: L3("Bu yerda ham rasm qochgan: qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Qochoqlarning hammasi tutildi, to'rtala hayvon ham uyida! Beshinchi sahifa esa hali bo'm-bo'sh. Unga qaysi hayvonni olib kelasiz, sevimlisini tanlang-chi! Oldin nomi: uni h1 tegiga yozing. Undan keyin img bilan rasmini qo'ying, oxirida esa p tegida u haqida bitta gap yozing. Rasm fayllari yoningizdagi ro'yxatda turibdi.",
      'Четыре страницы горят! Теперь пятая: твоя страница. Здесь есть только body. Выбери любимое животное. В самом верху заголовок в теге h1, потом его картинка в img, а в конце фраза о нём в теге p. Файлы картинок рядом.',
      'Four pages are lit! Now the fifth: your page. There’s only body here. Pick your favourite animal. At the very top, a heading in the h1 tag, then its picture in img, and at the end a sentence about it in the p tag. The picture files are right there.'),
    ask: L3("body ichiga: h1, img (src, alt) va p", 'В body: h1, img (src, alt) и p', 'Inside body: h1, img (src, alt) and p'),
    ok: L3("Sahifangizda sevimli hayvoningizning nomi ham, rasmi ham, u haqidagi gap ham bor: bog'imizga yangi mehmon keldi!", 'Это было мощно! На твоей странице есть заголовок, картинка и фраза!', 'That was awesome! Your page has a heading, a picture and a sentence!'),
    hints: [
      L3("Yondagi chizmaga bir qarang-chi: oldin h1, keyin img, eng oxirida p keladi.", 'Посмотри на схему: сначала h1, потом img, в конце p.', 'Look at the plan: first h1, then img, and p at the end.'),
      L3("img qatorida src ichiga ro'yxatdagi fayl nomlaridan birini, alt ichiga esa rasmda nima borligini yozing.", 'В теге img: в src — имя файла из списка, а в alt — что на картинке.', 'In the img tag: src holds a file name from the list, and alt says what’s in the picture.'),
      L3("Toshbaqa sahifasida uch narsa bor: sarlavha, rasm, bitta gap. Sizning hayvoningiz ham shu uchtani oladi.", 'Вот страница о любимом животном. Напиши так же, только про своё.', 'Here’s a page about a favourite animal. Write yours the same way, about your own.')
    ]
  },
  drill: {
    say: L3("Bog'da yana bitta bo'sh qafas topildi, rasmni endi o'zingiz yozib ko'ring-chi.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Bu hayvon ham qafasiga qaytdi, img qatori endi yodingizda!", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, hayvonot bog'imiz yana to'la! Har bir sahifada rasm o'z joyida turibdi.", 'Смотри, все пять страниц зоопарка готовы, и все картинки на месте!', 'Look, all five pages of the zoo are ready, and all the pictures are in place!') },
      { k: 'img', text: L3("Hayvonlarni sahifaga img tegi olib chiqdi. U yopilmaydi, chunki yopuvchi img tegi umuman bo'lmaydi.", 'Картинку ставит тег img, и он не закрывается.', 'You added pictures with the img tag, and img doesn’t close.') },
      { k: 'src', text: L3("src esa brauzerga rasm faylining nomini aytib turdi. Panda sahifasi buni yaxshi ko'rsatdi: rasmga href emas, src kerak.", 'src называл файл картинки. Картинке нужен src, а не href.', 'src named the picture file. A picture needs src, not href.') },
      { k: 'alt', text: L3("alt atributi rasmda nima borligini so'z bilan aytdi. Rasmlar g'oyib bo'lganda sahifalarda aynan shu so'zlar qolgan edi.", 'А alt словами говорил, что на картинке.', 'And alt said in words what’s in the picture.') },
      { k: 'own', text: L3("Endi bog'imizda sizning sevimli hayvoningiz ham yashaydi, uning sahifasini o'zingiz yozdingiz! Mehmonlar bog'ni baholashi kerak-ku: buning uchun anketa bo'lmasa bo'lmaydi.", 'А в конце своя страница с картинкой. Это было мощно! На следующем уроке познакомимся с формами.', 'And at the end you made your own page with a picture. That was awesome! Next lesson we’ll meet forms.') }
    ],
    roles: {
      img: L3("img — rasm", 'img — картинка', 'img — picture'),
      src: L3("src — rasm fayli", 'src — файл картинки', 'src — picture file'),
      alt: L3("alt — rasm haqida so'z", 'alt — слова о картинке', 'alt — words about the picture'),
      own: L3("Sahifamga rasm qo'ydim", 'Своя страница с картинкой', 'My page has a picture')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { img: 1, src: 1, alt: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a5-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a5.css@*/
`;
