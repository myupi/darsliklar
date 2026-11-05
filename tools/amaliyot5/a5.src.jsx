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
  noTags: L3("Bu yerga faqat fayl nomini yozing: qo'shtirnoq va burchakli qavslar kerak emas.", 'Здесь нужно только имя файла: без кавычек и уголков.', 'Only the file name here: no quotes or angle brackets.'),
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
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari chiziq «\\». Yopuvchi tegda oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("«{bad}» tegining oxirida o'ng burchakli qavs «>» yo'q.", 'В конце тега «{bad}» не хватает уголка «>».', 'The tag “{bad}” is missing the bracket “>” at the end.'),
  noLt: L3("«{bad}»: teg chap burchakli qavs «<» bilan boshlanadi.", '«{bad}» — тег начинается с уголка «<».', '“{bad}” — a tag starts with the bracket “<”.'),
  typo: L3("«{bad}» degan teg yo'q. Balki «{near}» demoqchisiz?", '«{bad}» — такого тега нет. Может быть, «{near}»?', '“{bad}” — there’s no such tag. Did you mean “{near}”?'),
  unknown: L3("«{bad}» tegi bizning sahifamizda yo'q. Rasm uchun bizda img tegi bor.", 'Тега «{bad}» на нашей странице нет. Для картинки у нас есть тег img.', 'Our page has no “{bad}” tag. For a picture we have the img tag.'),
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
  noHref: L3("Bu a tegida href yo'q, shuning uchun so'z oddiy matn bo'lib qoldi. Ochuvchi a tegiga href qo'shing.", 'У этого тега a нет href, поэтому слово осталось простым текстом. Добавь href в открывающий тег a.', 'This a tag has no href, so the word stayed plain text. Add href to the opening a tag.'),
  emptyHref: L3("href bo'sh: qo'shtirnoq ichiga fayl nomini yozing.", 'href пустой: впиши в кавычки имя файла.', 'href is empty: write the file name in the quotes.'),
  fileNo: L3("«{got}» degan fayl yo'q. Fayl nomini harfma-harf yozing: ro'yxatga qarang.", 'Файла «{got}» нет. Пиши имя файла буква в букву: посмотри на список.', 'There’s no “{got}” file. Write the file name letter by letter: look at the list.'),
  fileOther: L3("Bu havola {got} sahifasiga olib boradi. Bizga {want} kerak.", 'Эта ссылка ведёт на {got}. А нужно {want}.', 'This link goes to {got}. We need {want}.'),
  aOpen: L3("a yopilmadi, shuning uchun keyingi matn ham havola bo'lib qoldi. Havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт, поэтому и текст дальше стал ссылкой. После слов ссылки напиши закрывающий тег a.', 'a isn’t closed, so the text after it became a link too. Add the closing a tag after the link words.'),
  // Атрибуты (уроки 4–5).
  noQuote: L3("{attr} qiymatini qo'shtirnoq ichiga yozing.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("{attr} so'zidan keyin teng belgisi, keyin qo'shtirnoq ichida qiymat keladi.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("«{bad}» degan atribut yo'q. Rasmda src va alt bo'ladi.", 'Атрибута «{bad}» нет. У картинки есть src и alt.', 'There’s no “{bad}” attribute. A picture has src and alt.'),
  attrNone: L3("{tag} tegiga atribut kerak emas, uni olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  // Картинки (урок 5).
  hrefOnImg: L3("Rasmga href emas, src kerak: src rasm faylining nomini aytadi.", 'Картинке нужен не href, а src: src называет файл картинки.', 'A picture needs src, not href: src names the picture file.'),
  noSrc: L3("Bu img tegida src yo'q, shuning uchun rasm chiqmadi. Ochuvchi img tegiga src qo'shing.", 'У этого тега img нет src, поэтому картинка не появилась. Добавь src в тег img.', 'This img tag has no src, so the picture didn’t show. Add src to the img tag.'),
  emptySrc: L3("src bo'sh: qo'shtirnoq ichiga rasm faylining nomini yozing.", 'src пустой: впиши в кавычки имя файла картинки.', 'src is empty: write the picture file name in the quotes.'),
  imgNo: L3("«{got}» degan rasm fayli yo'q, shuning uchun buzilgan rasm belgisi chiqdi. Fayl nomini harfma-harf yozing: ro'yxatga qarang.", 'Файла картинки «{got}» нет, поэтому вышел значок сломанной картинки. Пиши имя файла буква в букву: посмотри на список.', 'There’s no picture file “{got}”, so a broken picture icon showed up. Write the file name letter by letter: look at the list.'),
  imgOther: L3("Bu {got} rasmi. Bizga {want} kerak.", 'Это картинка {got}. А нужна {want}.', 'That’s the {got} picture. We need {want}.'),
  noAlt: L3("alt yo'q. alt ichida rasmda nima borligini so'z bilan yozing: rasm ochilmasa, shu so'zlar chiqadi.", 'Нет alt. Напиши в alt словами, что на картинке: если она не откроется, появятся эти слова.', 'There’s no alt. In alt, say in words what’s in the picture: if it doesn’t open, those words show up.'),
  emptyAlt: L3("alt bo'sh: rasmda nima borligini yozing.", 'alt пустой: напиши, что на картинке.', 'alt is empty: write what’s in the picture.'),
  imgClose: L3("img yopilmaydi: yopuvchi img tegi kerak emas, uni olib tashlang.", 'img не закрывается: закрывающий тег img не нужен, убери его.', 'img doesn’t close: the closing img tag isn’t needed, remove it.'),
  needImg: L3("Sarlavha tayyor! Endi rasm qo'ying: img tegi, src va alt.", 'Заголовок готов! Теперь поставь картинку: тег img, src и alt.', 'The heading is ready! Now add a picture: the img tag, src and alt.'),
  imgFirst: L3("Oldin rasm, keyin abzas: eng tepaga img tegini yozing.", 'Сначала картинка, потом абзац: в самом верху напиши тег img.', 'First the picture, then the paragraph: write the img tag at the very top.'),
  needPAfter: L3("Rasm tayyor! Endi uning tagiga abzas yozing.", 'Картинка готова! Теперь под ней напиши абзац.', 'The picture is ready! Now write a paragraph under it.'),
  keepImg: L3("Fayl nomi va alt o'zgarmasin: faqat href o'rniga src yozing.", 'Пусть имя файла и alt останутся прежними: просто напиши src вместо href.', 'Keep the file name and alt as they were: just write src instead of href.'),
  next: L3("Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Hayvonot bog'i", 'Зоопарк', 'Zoo'),
    say: L3("Salom! Men hayvonot bog'i sayti tayyorladim. Har bir hayvonning o'z sahifasi bor: sher, fil, jirafa, panda va yana bitta bo'sh sahifa. Bo'sh sahifa sizniki bo'ladi! Faqat saytni saqlash qoldi. «Saqlash» tugmasini bosing.",
      'Привет! Я сделал сайт зоопарка. У каждого животного своя страница: лев, слон, жираф, панда и ещё одна пустая. Пустая будет твоей! Осталось только сохранить сайт. Нажми «Сохранить».',
      'Hi! I made a zoo website. Each animal has its own page: lion, elephant, giraffe, panda and one more empty page. The empty one will be yours! I just need to save the site. Tap “Save”.'),
    broke: L3("Voy! Saqlash paytida rasmlar yo'qolib qoldi. Sahifalarda rasm o'rniga faqat so'zlar qoldi.",
      'Ой! При сохранении картинки пропали. На страницах вместо них остались только слова.',
      'Oh no! The pictures got lost while saving. Only words are left on the pages instead of them.'),
    done: L3("O'tgan darsda rasmlar bilan tanishdik: img tegi, src va alt atributlari. Endi shu bilim bilan beshta sahifani birma-bir tuzatamiz. Kodni o'zingiz yozasiz, men esa yoningizdaman. Beshinchi sahifa esa sizniki bo'ladi!",
      'На прошлом уроке мы познакомились с картинками: тег img, атрибуты src и alt. Теперь с этими знаниями починим пять страниц по одной. Код пишешь ты, а я рядом. А пятая страница будет твоей!',
      'Last lesson we met pictures: the img tag and the src and alt attributes. Now let’s use that to fix the five pages one by one. You write the code, and I’ll be right here. And the fifth page will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("Beshta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять страниц — код пишешь ты', 'Let’s fix five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Sher", 'Лев', 'Lion'),
    say: L3("Birinchi sahifa: sher. img tegi joyida, alt ham bor, lekin src qiymati bo'sh. Shuning uchun rasm o'rniga faqat alt matni chiqyapti. Qo'shtirnoq ichiga rasm faylining nomini yozing: sher.jpg.",
      'Первая страница: лев. Тег img на месте, alt тоже есть, а значение src пустое. Поэтому вместо картинки виден только текст alt. Впиши в кавычки имя файла картинки: sher.jpg.',
      'The first page is the lion. The img tag is there, and so is alt, but the src value is empty. That’s why only the alt text shows instead of the picture. Type the picture file name in the quotes: sher.jpg.'),
    ask: L3("src ichiga yozing: sher.jpg", 'Впиши в src: sher.jpg', 'Type in src: sher.jpg'),
    ok: L3("Ajoyib! Mana, sher rasmi chiqdi!", 'Отлично! Вот и картинка со львом!', 'Great! There’s the lion picture!'),
    hints: [
      L3("Rasm qaysi fayldan olinishini src aytadi. Bo'sh qo'shtirnoqni toping.", 'Из какого файла взять картинку, говорит src. Найди пустые кавычки.', 'src says which file the picture comes from. Find the empty quotes.'),
      L3("Qo'shtirnoq ichiga fayl nomini harfma-harf yozing. Fayllar ro'yxati yonida turibdi.", 'Впиши в кавычки имя файла буква в букву. Список файлов рядом.', 'Type the file name in the quotes, letter by letter. The list of files is right there.'),
      L3("Masalan, fil rasmi shunday qo'yiladi. Siz esa sher.jpg deb yozing.", 'Например, картинку слона ставят так. А ты впиши sher.jpg.', 'For example, the elephant picture goes in like this. You type sher.jpg.')
    ],
    drill: L3("Endi src ichiga toshbaqa.jpg yozing", 'Теперь впиши в src: toshbaqa.jpg', 'Now type toshbaqa.jpg in src')
  },
  t2: {
    eyebrow: L3("Fil", 'Слон', 'Elephant'),
    say: L3("Sher tayyor, endi fil. Bu sahifada rasm qatori butunlay o'chib ketgan. Bo'sh qatorga butun qatorni yozing: img tegi, src ichida fil.jpg, alt ichida esa Fil so'zi. Esingizdami, img yopilmaydi.",
      'Лев готов, теперь слон. На этой странице строка с картинкой стёрлась целиком. Напиши в пустой строке всю строку: тег img, в src — fil.jpg, а в alt — слово «Слон». Помнишь, img не закрывается.',
      'The lion is done, now the elephant. On this page the picture line got erased completely. Write the whole line in the empty row: the img tag, fil.jpg in src, and the word “Elephant” in alt. Remember, img doesn’t close.'),
    ask: L3("img qatori: src «fil.jpg», alt «Fil»", 'Строка img: src «fil.jpg», alt «Слон»', 'img line: src “fil.jpg”, alt “Elephant”'),
    ok: L3("Barakalla! Butun qatorni o'zingiz yozdingiz, fil ham sahifaga qaytdi!", 'Вот это да! Вся строка написана твоими руками, и слон вернулся на страницу!', 'Wow! You wrote the whole line, and the elephant is back on the page!'),
    hints: [
      L3("Rasm img tegida yoziladi. Unga ikkita atribut kerak: src va alt.", 'Картинку пишут в теге img. Ей нужны два атрибута: src и alt.', 'A picture goes in the img tag. It needs two attributes: src and alt.'),
      L3("src ichida fayl nomi, alt ichida esa rasmda nima borligi. Har bir qiymat qo'shtirnoq ichida.", 'В src — имя файла, а в alt — что на картинке. Каждое значение в кавычках.', 'src holds the file name, and alt says what’s in the picture. Each value goes in quotes.'),
      L3("Mana, jirafa rasmining qatori. Siz ham shunday yozing, faqat fil bilan.", 'Вот строка картинки с жирафом. Напиши так же, только со слоном.', 'Here’s the line for a giraffe picture. Write yours the same way, just with the elephant.')
    ],
    drill: L3("Endi kapalak rasmi: src «kapalak.jpg», alt «Kapalak»", 'Теперь бабочка: src «kapalak.jpg», alt «Бабочка»', 'Now a butterfly: src “kapalak.jpg”, alt “Butterfly”')
  },
  t3: {
    eyebrow: L3("Jirafa", 'Жираф', 'Giraffe'),
    say: L3("Ikki sahifa tayyor! Uchinchisi: jirafa. Bu yerda faqat sarlavha qolgan. Sarlavha tagiga jirafa rasmini qo'ying, src ichida jirafa.jpg bo'lsin. Rasm tagiga esa jirafa haqida bir abzas yozing.",
      'Две страницы готовы! Третья: жираф. Здесь остался только заголовок. Под заголовком поставь картинку жирафа: в src — jirafa.jpg. А под картинкой напиши абзац про жирафа.',
      'Two pages are done! The third is the giraffe. Only the heading is left here. Under the heading, add the giraffe picture with jirafa.jpg in src. And under the picture, write a paragraph about the giraffe.'),
    ask: L3("img «jirafa.jpg» va tagida p yozing", 'Напиши img «jirafa.jpg», а под ним p', 'Write img “jirafa.jpg” and a p under it'),
    ok: L3("Zo'r! Rasm ham, matn ham joyida. Sahifa jonlandi!", 'Огонь! И картинка, и текст на месте. Страница ожила!', 'Awesome! The picture and the text are both there. The page came alive!'),
    hints: [
      L3("Oldin img tegi: src va alt bilan. Keyin p tegida abzas.", 'Сначала тег img с src и alt. Потом абзац в теге p.', 'First the img tag with src and alt. Then a paragraph in the p tag.'),
      L3("Ikki qator yozing: birinchisida img, ikkinchisida ochuvchi p, gap va yopuvchi p.", 'Напиши две строки: в первой img, во второй открывающий p, предложение и закрывающий p.', 'Write two lines: img in the first, and the opening p, a sentence and the closing p in the second.'),
      L3("Mana, panda sahifasining rasmi va abzasi. Siz ham shunday yozing, faqat jirafa haqida.", 'Вот картинка и абзац для панды. Напиши так же, только про жирафа.', 'Here are the picture and paragraph for the panda. Write yours the same way, about the giraffe.')
    ],
    drill: L3("Endi toshbaqa: img «toshbaqa.jpg» va tagida p", 'Теперь черепаха: img «toshbaqa.jpg» и под ним p', 'Now a turtle: img “toshbaqa.jpg” and a p under it')
  },
  t4: {
    eyebrow: L3("Panda", 'Панда', 'Panda'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: panda. Qarang, bu yerda g'alati: img tegi bor, fayl ham bor, lekin rasm chiqmayapti, faqat so'z turibdi. Demak, bir qator buzilgan. Oldin o'sha qatorni toping va ustiga bosing.",
      'Три страницы готовы! Четвёртая: панда. Смотри, тут странно: тег img есть, файл тоже есть, а картинки нет, только слово. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is the panda. Look, something’s odd here: there’s an img tag and a file, but no picture, just a word. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Bu yerda src o'rniga href yozilgan, xuddi havoladagidek. Lekin rasmga src kerak. href so'zi o'rniga src atributini yozing.",
      'Нашлась! Здесь вместо src написано href, как у ссылки. А картинке нужен src. Замени href на src.',
      'Found it! Here it says href instead of src, like a link. But a picture needs src. Replace href with src.'),
    ok: L3("Ura, ishladi! Panda rasmi chiqdi. Buzilgan joyni xuddi haqiqiy dasturchidek topdingiz!", 'Ура, заработало! Картинка с пандой появилась. Поломка найдена, как у настоящего программиста!', 'Yes, it works! The panda picture showed up. You found the bug like a real developer!'),
    why: {
      0: L3("body shu yerda ochiladi, bu qator joyida. Rasm qatoriga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на строку с картинкой.', 'body opens here, this line is fine. Look at the picture line.'),
      1: L3("Sarlavha h1 to'g'ri ochilgan va yopilgan. Bu qator joyida.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      3: L3("Bu abzas joyida. Rasm nega chiqmayapti? Bir qator tepaga qarang.", 'Этот абзац в порядке. Почему нет картинки? Посмотри на строку выше.', 'This paragraph is fine. Why is there no picture? Look one line up.'),
      4: L3("body shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Fayl bor, lekin rasm chiqmadi. Rasmga qaysi atribut kerak edi?", 'Файл есть, а картинки нет. Какой атрибут нужен картинке?', 'The file is there, but no picture. Which attribute does a picture need?'),
      L3("img qatoriga qarang: fayl nomi qaysi atributda turibdi?", 'Посмотри на строку img: в каком атрибуте стоит имя файла?', 'Look at the img line: which attribute holds the file name?'),
      L3("Mana, to'g'ri rasm qatori. Siz ham href o'rniga src yozing.", 'Вот правильная строка картинки. Напиши и ты src вместо href.', 'Here’s a proper picture line. Write src instead of href too.')
    ],
    drill: L3("Bu sahifada ham xuddi shunday: buzilgan qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("To'rtta sahifa yonib turibdi! Endi beshinchisi: sizning sahifangiz. Bu yerda faqat body bor. Sevimli hayvoningizni tanlang. Eng tepada h1 tegida sarlavha, keyin img bilan uning rasmi, oxirida esa p tegida u haqida bir gap. Rasm fayllari yonida turibdi.",
      'Четыре страницы горят! Теперь пятая: твоя страница. Здесь есть только body. Выбери любимое животное. В самом верху заголовок в теге h1, потом его картинка в img, а в конце фраза о нём в теге p. Файлы картинок рядом.',
      'Four pages are lit! Now the fifth: your page. There’s only body here. Pick your favourite animal. At the very top, a heading in the h1 tag, then its picture in img, and at the end a sentence about it in the p tag. The picture files are right there.'),
    ask: L3("body ichiga: h1, img (src, alt) va p", 'В body: h1, img (src, alt) и p', 'Inside body: h1, img (src, alt) and p'),
    ok: L3("Bu juda zo'r chiqdi! Sahifangizda sarlavha, rasm va gap bor!", 'Это было мощно! На твоей странице есть заголовок, картинка и фраза!', 'That was awesome! Your page has a heading, a picture and a sentence!'),
    hints: [
      L3("Chizmaga qarang: oldin h1, keyin img, oxirida p.", 'Посмотри на схему: сначала h1, потом img, в конце p.', 'Look at the plan: first h1, then img, and p at the end.'),
      L3("img tegida src ichida ro'yxatdagi fayl nomi, alt ichida esa rasmda nima borligi bo'lsin.", 'В теге img: в src — имя файла из списка, а в alt — что на картинке.', 'In the img tag: src holds a file name from the list, and alt says what’s in the picture.'),
      L3("Mana, sevimli hayvon haqidagi sahifa. Xuddi shunday yozing, faqat o'z hayvoningiz bilan.", 'Вот страница о любимом животном. Напиши так же, только про своё.', 'Here’s a page about a favourite animal. Write yours the same way, about your own.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, hayvonot bog'ining beshta sahifasi ham tayyor va hamma rasmlar joyida!", 'Смотри, все пять страниц зоопарка готовы, и все картинки на месте!', 'Look, all five pages of the zoo are ready, and all the pictures are in place!') },
      { k: 'img', text: L3("Rasmni img tegi bilan qo'ydingiz, img esa yopilmaydi.", 'Картинку ставит тег img, и он не закрывается.', 'You added pictures with the img tag, and img doesn’t close.') },
      { k: 'src', text: L3("src rasm faylining nomini aytdi. Rasmga href emas, src kerak.", 'src называл файл картинки. Картинке нужен src, а не href.', 'src named the picture file. A picture needs src, not href.') },
      { k: 'alt', text: L3("alt esa rasmda nima borligini so'z bilan aytdi.", 'А alt словами говорил, что на картинке.', 'And alt said in words what’s in the picture.') },
      { k: 'own', text: L3("Oxirida esa o'z sahifangizni rasm bilan yasadingiz. Bu juda kuchli bo'ldi! Keyingi darsda formalar bilan tanishamiz.", 'А в конце своя страница с картинкой. Это было мощно! На следующем уроке познакомимся с формами.', 'And at the end you made your own page with a picture. That was awesome! Next lesson we’ll meet forms.') }
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
