// =============================================================================
// КУРС «HTML» · Модуль 1 · Практика к уроку 5 — «Выставка». Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/praktika-05/p05.src.jsx lessons/html/05p-izobrazheniya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА К УРОКУ 5 · «Выставка» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (26.10.2026; каркас — практики 01p–04p, механика — общий движок 04p
// с атрибутами, бумажный стиль урока 1). Выставка рисунков класса: пять рам на
// стене. В хуке ученик нажимает «Открыть выставку» — картинки выпадают из рам.
// Ученик возвращает их кодом: даёт файлы, чинит имена, пишет подписи alt,
// чинит сломанные теги и собирает свою галерею. Картинки в бумажном браузере
// честные: файл есть — фото; нет src — только alt; нет файла — сломанная картинка.
//
// СЕМЬ СЛАЙДОВ (заказчик, 22.10.2026): хук · пять заданий от лёгкого к сложному,
// у каждого своя механика:
//   t1 кот — у картинки есть alt, но нет src: дописать src="cat.jpg";
//   t2 попугай и рыбка — опечатки в именах файлов: сверить с полкой файлов;
//   t3 подписи — две картинки без alt: написать описания словами (программа
//      чтения экрана сразу их «читает»);
//   t4 витрина — найти и починить два сломанных тега (scr вместо src, href у
//      img); счётчик «осталось исправить»;
//   t5 своя галерея — с нуля: h1 и p (урок 2) и две картинки с src и alt.
// Только материал уроков 1–5: готовые head и body вокруг кода, h1, h2, p, img, src, alt.
//
// ОСОБЫЕ ПРАВИЛА (как в 01p–04p): Коди — голова в кружке в шапке, без облака с
// текстом; пишет ученик; проверка по «Проверить» (одна причина, со второй неудачи
// — ступень подсказки); три ступени по лампочке, после образца — ещё одна задача;
// браузер честный и без прокрутки; код не исполняется; конфетти только в финале.
// =============================================================================
const META = {
  lessonId: 'html-05p-korgazma',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '5-dars amaliyoti. Ko‘rgazma',
    ru: 'Практика к уроку 5. Выставка',
    en: 'Lesson 5 practice. The exhibition'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });

const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      const sv = v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : String(v);
      s = s.split('{' + k + '}').join(sv);
    });
    out[l] = s;
  });
  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// РАМЫ ВЫСТАВКИ — пять мест на стене. Задание n возвращает картинку в раму n;
// последняя — галерея ученика. pic — что в раме, когда она готова.
// ─────────────────────────────────────────────────────────────────────────────
const STREET = [
  { id: 'cat', c: '#F0B13F', pic: 'cat.jpg', name: L3('Mushuk', 'Кот', 'Cat') },
  { id: 'parrot', c: '#E0643F', pic: 'parrot.png', name: L3('To‘tiqush', 'Попугай', 'Parrot') },
  { id: 'sun', c: '#2A8C7E', pic: 'sun.png', name: L3('Tavsiflar', 'Описания', 'Descriptions') },
  { id: 'fish', c: '#5E8FB8', pic: 'fish.jpg', name: L3('Vitrina', 'Витрина', 'Showcase') },
  { id: 'mine', c: '#1F2A44', name: L3('Sizning galereyangiz', 'Твоя галерея', 'Your gallery') }
];
const HOME = STREET.length - 1;
// Файлы картинок выставки: файл → рисунок и фон бумажного фото.
const PHOTO_FILES = {
  'cat.jpg': { pic: 'cat', bg: '#F0B13F', seed: 501 },
  'dog.jpg': { pic: 'dog', bg: '#8FCFC3', seed: 502 },
  'parrot.png': { pic: 'parrot', bg: '#F6DFAE', seed: 503 },
  'fish.jpg': { pic: 'fish', bg: '#9EC9E0', seed: 504 },
  'sun.png': { pic: 'sun', bg: '#BFE0F0', seed: 505 },
  'flower.jpg': { pic: 'flower', bg: '#DCE8CF', seed: 506 }
};
const FILE_LIST = Object.keys(PHOTO_FILES);
// Ссылок в этой практике нет (страницы сайта — урок 4).
const SITE_PAGES = {};

// Слова картинок и страниц.
const TXT = {
  top: L3('Ko‘rgazma', 'Выставка', 'Exhibition'),
  hallH: L3('Sinfimiz rasmlari', 'Рисунки нашего класса', 'Our class drawings'),
  cat: L3('Sariq mushuk', 'Рыжий кот', 'A ginger cat'),
  dog: L3('Quvnoq it', 'Весёлая собака', 'A happy dog'),
  parrot: L3('To‘tiqush', 'Попугай', 'A parrot'),
  fish: L3('Baliq', 'Рыбка', 'A fish'),
  sun: L3('Quyosh', 'Солнце', 'The sun'),
  catS: L3('Mushuk', 'Кот', 'A cat'),
  galH: L3('Mening galereyam', 'Моя галерея', 'My gallery'),
  galP: L3('Bu mening sevimli rasmlarim.', 'Это мои любимые картинки.', 'These are my favorite pictures.'),
  // Слова, которые ничего не говорят о картинке (t3).
  generic: ['rasm', 'surat', 'foto', 'картинка', 'фото', 'рисунок', 'изображение', 'picture', 'photo', 'image', 'drawing']
};

// Подписи интерфейса практики. up, down, mySite, hello, play нужны бумажному набору.
const UI = {
  task: L3('{n}-topshiriq', 'Задание {n}', 'Task {n}'),
  houseOf: L3('{n}/5-rom', 'Рама {n} из 5', 'Frame {n} of 5'),
  map: L3('Ko‘rgazma devori', 'Стена выставки', 'Exhibition wall'),
  works: L3('rasm joyida', 'картинка на месте', 'picture in place'),
  off: L3('bo‘sh', 'пусто', 'empty'),
  now: L3('hozir shu yerda', 'сейчас здесь', 'you are here'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  keys: L3('Teg belgilari', 'Символы для тегов', 'Tag symbols'),
  editor: L3('Kod muharriri', 'Редактор кода', 'Code editor'),
  page: L3('Sahifa', 'Страница', 'Page'),
  code: L3('Kod', 'Код', 'Code'),
  fb: L3('Tekshiruv', 'Проверка', 'Check'),
  incomplete: L3('hujjat hali to‘liq emas', 'документ собран не полностью', 'the document is not complete yet'),
  ok: L3('Tayyor', 'Готово', 'Done'),
  titleField: L3('title ichidagi nom', 'Название в title', 'Name in title'),
  bodyField: L3('body ichidagi matn', 'Текст в body', 'Text in body'),
  sample: L3('Namuna', 'Образец', 'Sample'),
  start: L3('Boshlash', 'Начать', 'Start'),
  finish: L3('Yakunlash', 'Завершить', 'Finish'),
  ready: L3('Ish tayyor', 'Работа готова', 'Work is ready'),
  drill: L3('Yana bitta', 'Ещё одна', 'One more'),
  gapHere: L3('shu yerda tugaydimi?', 'здесь кончается?', 'ends here?'),
  open: L3('Ko‘rgazmani ochish', 'Открыть выставку', 'Open the exhibition'),
  files: L3('Rasm fayllari', 'Файлы картинок', 'Picture files'),
  reader: L3('Ekranni o‘qiydigan dastur aytadi', 'Программа чтения экрана скажет', 'The screen reader will say'),
  noAlt: L3('alt yo‘q', 'нет alt', 'no alt'),
  left: L3('Tuzatish kerak: {n}', 'Осталось исправить: {n}', 'Left to fix: {n}'),
  allFixed: L3('Hammasi tuzatildi', 'Всё исправлено', 'All fixed'),
  needH1: L3('h1 — galereya nomi', 'h1 — название галереи', 'h1 — the gallery name'),
  needP: L3('p — bir jumla', 'p — одна фраза', 'p — one sentence'),
  need2: L3('fayllardan 2 ta rasm', '2 картинки из файлов', '2 pictures from the files'),
  needAlts: L3('har bir rasmda alt bor', 'у каждой картинки alt', 'every picture has alt'),
  needClosed: L3('hamma teglar yopilgan', 'все теги закрыты', 'all tags are closed'),
  notFound: L3('Fayl topilmadi', 'Файл не найден', 'File not found'),
  back: L3('← Orqaga', '← Назад', '← Back'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Formalar', 'Формы', 'Forms'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play')
};

// ─────────────────────────────────────────────────────────────────────────────
// ОБРАТНАЯ СВЯЗЬ ПРОВЕРКИ. Одна проблема — одна короткая фраза: что не так и
// что сделать. Фразы про атрибуты (имя, «=», кавычки, href у img, </img>) —
// общие, в движке 04p.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  // Запись тегов, пары и порядок (разбор фрагмента — checkFrag)
  pairMismatch: L3('{a} tegi </{b}> bilan yopilgan. Juft bir xil bo‘lishi kerak: </{a}>.', '{a} закрыт тегом </{b}>. Пара должна совпадать: </{a}>.', '{a} is closed with </{b}>. The pair must match: </{a}>.'),
  unclosedIn: L3('{tag} hali yopilmagan, {next} esa allaqachon tugayapti.', '{tag} ещё не закрыт, а {next} уже заканчивается.', '{tag} isn’t closed yet, but {next} is already ending.'),
  blockInBlock: L3('{tag} hali tugamadi, {next} esa boshlanyapti. Avval {tag} ni yoping.', '{tag} ещё не закончился, а {next} уже начинается. Сначала закрой {tag}.', '{tag} hasn’t ended, but {next} is already starting. Close {tag} first.'),
  inlineOutside: L3('{tag} so‘z atrofiga qo‘yiladi: xatboshi yoki sarlavha ichida.', '{tag} ставят вокруг слова — внутри абзаца или заголовка.', '{tag} goes around a word, inside a paragraph or a heading.'),
  textOutside: L3('Matn teglardan tashqarida turibdi. Ro‘yxat bandini li ichiga qo‘ying.', 'Текст стоит снаружи тегов. Пункт списка поставь внутрь li.', 'The text is outside the tags. Put the list item inside li.'),
  noGt: L3('{tag} tegi oxirida o‘ng «>» qavs yetishmayapti.', 'У тега {tag} в конце не хватает уголка «>».', 'The {tag} tag is missing the bracket “>” at the end.'),
  noLt: L3('{tag} oldida chap «<» qavs yetishmayapti.', 'Перед {tag} не хватает уголка «<».', 'The bracket “<” is missing before {tag}.'),
  unknown: L3('«{raw}» tegida harflar adashgan: {tag} kerak.', 'В теге «{raw}» перепутаны буквы: нужно {tag}.', 'The letters in “{raw}” are mixed up: it should be {tag}.'),
  unknownFar: L3('«{raw}» tegi bizga notanish. Bizda h1 dan h6 gacha, p, b, i, ul, ol, li, a va img teglari bor.', 'Тег «{raw}» нам не знаком. У нас есть теги с h1 по h6, p, b, i, ul, ol, li, a и img.', 'We don’t know the tag “{raw}”. We have the tags h1 to h6, p, b, i, ul, ol, li, img and the a tag.'),
  slashEnd: L3('Qiya chiziq boshqa joyda turibdi. Yopuvchi tegda u chap «<» qavsdan keyin keladi: </{tag}>.', 'Косая черта стоит не там. В закрывающем теге она идёт сразу после уголка «<»: </{tag}>.', 'The slash is in the wrong spot. In a closing tag it goes right after the bracket “<”: </{tag}>.'),
  backslash: L3('Yopuvchi tegda qiya chiziq «/» turadi, bu yerda esa teskari «\\» chiziq.', 'В закрывающем теге нужна косая черта «/», а здесь обратная «\\».', 'A closing tag needs a slash “/”, but here it is a backslash “\\”.'),
  junk: L3('Qavslar ichiga faqat teg nomini yozamiz, matn esa tashqarida turadi.', 'Внутри уголков пишем только имя тега, а текст — снаружи.', 'Inside the brackets we write only the tag name; the text goes outside.'),
  emptyTag: L3('Bu yerda bo‘sh qavslar. Ichida teg nomi bo‘lishi kerak.', 'Здесь пустые уголки. Внутри должно быть имя тега.', 'These brackets are empty. A tag name goes inside.'),
  openAgain: L3('Bu yerda ochuvchi {tag} yozilgan. Yopuvchi tegga qiya chiziq kerak.', 'Здесь написан открывающий {tag}. Закрывающему тегу нужна косая черта.', 'This is an opening {tag}. The closing tag needs a slash.'),
  unclosedEnd: L3('{tag} nima bilan tugashini tekshiring: yopuvchi teg yo‘q.', 'Проверь, чем заканчивается {tag}: закрывающего тега нет.', 'Check how {tag} ends: there is no closing tag.'),
  closeWithoutOpen: L3('Bu yerda yopuvchi {tag} bor, ochuvchisi esa yo‘q.', 'Здесь закрывающий {tag}, а открывающего нет.', 'There is a closing {tag} here, but no opening one.'),
  textSame: L3('Teglar joyida! Faqat so‘zlar o‘zgarib qoldi: teglarni tuzatamiz, matnni esa avvalgidek qoldiramiz.', 'Теги в порядке! Только слова изменились: чиним теги, а текст оставляем как был.', 'The tags are fine! Only the words changed: we fix the tags and leave the text as it was.'),
  headEmpty: L3('Sarlavha teglari joyida, ichi esa bo‘sh. Ro‘yxat nomini yozing.', 'Теги заголовка на месте, а внутри пусто. Напиши название списка.', 'The heading tags are in place, but empty. Write the list name.'),
  // Списки (урок 3)
  listText: L3('Ro‘yxatda matn li siz turibdi: unda nuqta ham, raqam ham yo‘q. Uni li ga o‘rang.', 'В списке текст стоит без li — у него нет ни точки, ни номера. Оберни его в li.', 'There’s text in the list without li: it gets no dot or number. Wrap it in li.'),
  liOutside: L3('li faqat ul yoki ol ichida yoziladi, bu esa ro‘yxatdan tashqarida turibdi.', 'li пишут только внутри ul или ol, а этот стоит снаружи списка.', 'li goes only inside ul or ol, but this one is outside the list.'),
  listNotClosed: L3('{tag} ro‘yxati hali yopilmagan, {next} esa boshlanyapti. Avval ro‘yxatni yoping.', 'Список {tag} ещё не закрыт, а {next} уже начинается. Сначала закрой список.', 'The {tag} list isn’t closed yet, but {next} is already starting. Close the list first.'),
  // Картинки (урок 5)
  needImg: L3('Bu yerda rasm kerak: img tegi.', 'Здесь нужна картинка — тег img.', 'This needs a picture: the img tag.'),
  oneImg: L3('Bitta rasm yozing: bitta img tegi.', 'Напиши одну картинку — один тег img.', 'Write one picture: one img tag.'),
  noSrc: L3('Rasmda src yo‘q: brauzer qaysi faylni ochishni bilmaydi. src atributini yozing.', 'У картинки нет src — браузер не знает, какой файл открыть. Допиши атрибут src.', 'The picture has no src: the browser doesn’t know which file to open. Add the src attribute.'),
  srcEmpty: L3('src ichi bo‘sh: qo‘shtirnoq ichiga fayl nomini yozing.', 'В src пусто: впиши между кавычками имя файла.', 'src is empty: type the file name between the quotes.'),
  srcWrong: L3('src da {src} turibdi, bizga esa {want} kerak.', 'В src стоит {src}, а нужен {want}.', 'src says {src}, but we need {want}.'),
  altKeep: L3('Fayl to‘g‘ri! alt ni avvalgidek qoldiring: «{w}».', 'Файл верный! alt оставь прежним: «{w}».', 'The file is right! Keep alt as it was: “{w}”.'),
  imgNoFile: L3('«{alt}» rasmi {src} faylini qidiryapti, lekin bunday fayl yo‘q. Nomni fayllar bilan solishtiring.', 'Картинка «{alt}» ищет файл {src}, а такого файла нет. Сверь имя с файлами.', 'The “{alt}” picture looks for the file {src}, but there’s no such file. Compare the name with the files.'),
  imgTo: L3('«{alt}» rasmi {src} ni ko‘rsatyapti, bizga esa {want} kerak.', 'Картинка «{alt}» показывает {src}, а нужен {want}.', 'The “{alt}” picture shows {src}, but we need {want}.'),
  keepImgs: L3('Teglar joyida! Faqat rasmlarni avvalgidek qoldiring: o‘sha fayllar va o‘sha alt.', 'Теги в порядке! Только оставь картинки как были: те же файлы и те же alt.', 'The tags are fine! Just keep the pictures as they were: the same files and alts.'),
  twoImgs: L3('Ikkala rasm joyida qolsin.', 'Пусть обе картинки останутся на месте.', 'Keep both pictures in place.'),
  needAlt: L3('{src} rasmida alt yo‘q. So‘z bilan tavsif yozing.', 'У картинки {src} нет alt. Допиши описание словами.', 'The {src} picture has no alt. Add a description in words.'),
  altEmpty: L3('{src} rasmida alt bo‘sh. Qo‘shtirnoq ichiga rasmda nima borligini yozing.', 'У картинки {src} пустой alt. Впиши между кавычками, что на картинке.', 'The {src} picture has an empty alt. Type what’s in the picture between the quotes.'),
  altFile: L3('alt da fayl nomi turibdi. alt esa rasmni so‘z bilan tasvirlaydi: unda nima bor?', 'В alt стоит имя файла. А alt описывает картинку словами: что на ней?', 'alt has a file name. alt describes the picture in words: what’s in it?'),
  altGeneric: L3('«{w}» so‘zi rasm haqida hech narsa aytmaydi. Unda nima borligini yozing.', 'Слово «{w}» ничего не говорит о картинке. Напиши, что на ней.', 'The word “{w}” says nothing about the picture. Write what’s in it.'),
  keepSrc: L3('Tavsiflar bor! Faqat src ni avvalgidek qoldiring.', 'Описания есть! Только имена файлов в src оставь прежними.', 'The descriptions are there! Just keep src as it was.'),
  // t5 — своя галерея
  artEmpty: L3('Hozircha bo‘sh. Galereya nomini h1 ga yozishdan boshlang.', 'Пока пусто. Начни с названия галереи в h1.', 'It’s empty so far. Start with the gallery name in h1.'),
  needH1: L3('Tepaga h1 sarlavha kerak: galereyangiz nomi.', 'Сверху нужен заголовок h1 — название твоей галереи.', 'You need an h1 heading on top: your gallery’s name.'),
  galHeadEmpty: L3('Sarlavha teglari joyida, ichi esa bo‘sh. Galereya nomini yozing.', 'Теги заголовка на месте, а внутри пусто. Напиши название галереи.', 'The heading tags are in place, but empty. Write the gallery name.'),
  needP: L3('Sarlavha ostiga p xatboshi yozing: bitta jumla.', 'Под заголовком напиши абзац p — одну фразу.', 'Under the heading, write a p paragraph: one sentence.'),
  needTwo: L3('Galereyada fayllardan kamida ikkita rasm bo‘lsin.', 'В галерее нужно хотя бы две картинки — из файлов.', 'The gallery needs at least two pictures from the files.'),
  noFile: L3('{src} degan fayl yo‘q. Rasm fayllaridan birini yozing.', 'Файла {src} нет. Впиши один из файлов картинок.', 'There’s no file {src}. Type one of the picture files.'),
  needAlts: L3('Har bir rasmga so‘z bilan alt yozing.', 'У каждой картинки должен быть alt со словами.', 'Every picture needs an alt with words.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ ЭКРАНОВ. Реплики (say, hints, praise, done …) звучат; подписи
// (eyebrow, order, ask, note, empty …) только печатаются. В узбекских звучащих
// репликах нет тире: движок отдаёт его сервису точкой.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Хук: рамы с картинками → касание «Открыть выставку» → картинки выпадают из рам.
  intro: {
    eyebrow: L3('Ko‘rgazma', 'Выставка', 'Exhibition'),
    say: L3('Bugun sinfimizda rasmlar ko‘rgazmasi. Devorda beshta rom bor, hammasi tayyor.',
      'Сегодня выставка рисунков нашего класса. На стене пять рам, всё готово.',
      'Today is our class drawing exhibition. There are five frames on the wall, all ready.'),
    blown: L3('Voy! Eshik ochilganda shamol kirdi va rasmlar romlardan tushib ketdi.', 'Ой! Открыли дверь, подул ветер, и картинки выпали из рам.', 'Oh no! We opened the door, the wind blew in, and the pictures fell out of the frames.'),
    plan: L3('To‘rtta rasmni kod bilan joyiga qaytaramiz, beshinchi romga esa o‘z galereyangizni yozasiz. Har bir topshiriq oldingisidan biroz qiyinroq.',
      'Вернём четыре картинки кодом, а в пятую раму ты напишешь свою галерею. Каждое задание чуть сложнее прошлого.',
      'We’ll put four pictures back with code, and you’ll write your own gallery for the fifth frame. Each task is a bit harder than the last.'),
    ask: L3('«Ko‘rgazmani ochish» tugmasini bosing', 'Нажми «Открыть выставку»', 'Tap “Open the exhibition”'),
    order: L3('To‘rtta rasmni qaytaring va o‘z galereyangizni yozing. Kodni siz yozasiz.', 'Верни четыре картинки и напиши свою галерею. Код пишешь ты.', 'Put four pictures back and write your own gallery. You write the code.'),
    note: L3('Rasmi qaytgan rom yonadi. Jarima yo‘q: xohlagancha tekshiring.', 'Рама загорается, когда картинка вернулась. Штрафов нет — проверяй сколько хочешь.', 'A frame lights up when its picture is back. No penalties: check as often as you like.')
  },

  // 1 · самое лёгкое: у картинки есть alt, но нет src.
  t1: {
    order: L3('Rasmga fayl bering: cat.jpg', 'Дай картинке файл: cat.jpg', 'Give the picture a file: cat.jpg'),
    say: L3('Mushuk rasmida alt bor, src esa yo‘q: shuning uchun sahifada faqat so‘zlar ko‘rinyapti. img tegiga src atributini yozing.',
      'У картинки с котом есть alt, а src нет — поэтому на странице только слова. Допиши в тег img атрибут src.',
      'The cat picture has alt but no src, so only words show on the page. Add the src attribute to the img tag.'),
    hints: [
      L3('Brauzerga qaysi faylni ochishni qaysi atribut aytadi?', 'Какой атрибут говорит браузеру, какой файл открыть?', 'Which attribute tells the browser which file to open?'),
      L3('Bu src. U img tegi ichida yoziladi: nomi, tenglik belgisi va qo‘shtirnoq ichida fayl nomi.', 'Это src. Его пишут внутри тега img: имя, знак равно и имя файла в кавычках.', 'It’s src. It goes inside the img tag: the name, an equals sign and the file name in quotes.'),
      L3('Mana boshqa rasmda src qanday yozilgan. Mushukni ham shunday yozing.', 'Вот как записан src у другой картинки. Кота запиши так же.', 'Here’s how another picture’s src is written. Write the cat the same way.')
    ],
    praise: L3('Mana mushuk! Rasm romiga qaytdi.', 'Вот и кот! Картинка вернулась в раму.', 'There’s the cat! The picture is back in its frame.'),
    done: L3('Mushuk joyida.', 'Кот на месте.', 'The cat is in place.'),
    drill: L3('It rasmiga ham fayl bering: dog.jpg.', 'Дай файл и картинке с собакой: dog.jpg.', 'Give the dog picture a file too: dog.jpg.')
  },

  // 2 · опечатки в именах файлов: сверить с полкой файлов.
  t2: {
    order: L3('Fayl nomlaridagi xatolarni tuzating', 'Исправь имена файлов', 'Fix the file names'),
    say: L3('Ikkala rasm singan: fayl nomlarida xato bor. Ularni fayllar ro‘yxati bilan solishtiring va tuzating.',
      'Обе картинки сломаны: в именах файлов опечатки. Сверь их со списком файлов и исправь.',
      'Both pictures are broken: the file names have typos. Compare them with the file list and fix them.'),
    hints: [
      L3('Har bir src ni fayllar ro‘yxati bilan harfma-harf solishtiring.', 'Сравни каждый src со списком файлов — буква за буквой.', 'Compare each src with the file list, letter by letter.'),
      L3('To‘tiqush fayli parrot.png, baliqniki esa fish.jpg. Ikkala src ni tuzating.', 'Попугай — parrot.png, рыбка — fish.jpg. Поправь оба src.', 'The parrot is parrot.png, the fish is fish.jpg. Fix both src values.'),
      L3('Mana to‘g‘ri rasm. Ikkinchisini ham shunday tuzating.', 'Вот правильная картинка. Вторую поправь так же.', 'Here’s a correct picture. Fix the second one the same way.')
    ],
    praise: L3('Zo‘r! Ikkala rasm yana ko‘rinyapti.', 'Огонь! Обе картинки снова видны.', 'Awesome! Both pictures show again.'),
    done: L3('Fayl nomlari tuzatildi.', 'Имена файлов исправлены.', 'The file names are fixed.'),
    drill: L3('Bu yerda ham ikkita xato nom bor. Tuzating.', 'И здесь два имени с опечатками. Исправь.', 'Two names have typos here too. Fix them.')
  },

  // 3 · подписи alt для двух картинок (свои слова).
  t3: {
    order: L3('Ikkala rasmga alt tavsifini yozing', 'Напиши обеим картинкам описание alt', 'Write an alt description for both pictures'),
    say: L3('Ko‘rgazmaga ko‘zi ojiz mehmon keldi. Uning dasturi rasmlarni o‘qiy olmayapti: ularda alt yo‘q. Har bir rasmga so‘z bilan tavsif yozing.',
      'На выставку пришёл незрячий гость. Его программа не может прочитать картинки — у них нет alt. Напиши каждой картинке описание словами.',
      'A blind visitor came to the exhibition. Their program can’t read the pictures: they have no alt. Write a description in words for each picture.'),
    hints: [
      L3('Rasmga qarang: unda kim yoki nima bor?', 'Посмотри на картинку: кто или что на ней?', 'Look at the picture: who or what is in it?'),
      L3('img tegi ichiga alt atributini yozing: qo‘shtirnoq ichida bir necha so‘z.', 'Впиши в тег img атрибут alt: несколько слов в кавычках.', 'Add the alt attribute to the img tag: a few words in quotes.'),
      L3('Mana boshqa rasmdagi alt. Siznikini ham shunday yozing, o‘z so‘zlaringiz bilan.', 'Вот alt у другой картинки. Свои напиши так же, своими словами.', 'Here’s another picture’s alt. Write yours the same way, in your own words.')
    ],
    praise: L3('Ajoyib! Endi dastur mehmonga har bir rasmni aytib beradi.', 'Здорово! Теперь программа расскажет гостю про каждую картинку.', 'Great! Now the program will tell the visitor about each picture.'),
    done: L3('Tavsiflar tayyor.', 'Описания готовы.', 'The descriptions are ready.'),
    drill: L3('Gul rasmiga ham alt yozing.', 'Напиши alt и картинке с цветком.', 'Write an alt for the flower picture too.')
  },

  // 4 · найти и починить два сломанных тега; счётчик «осталось исправить».
  t4: {
    order: L3('Ikkita buzilgan rasm tegini toping va tuzating', 'Почини два сломанных тега картинки', 'Find and fix two broken picture tags'),
    say: L3('Vitrinada ikkita rasm o‘rniga faqat so‘zlar turibdi. Teglarda ikkita xato bor. Ularni toping va tuzating.',
      'На витрине вместо двух картинок одни слова. В тегах две ошибки. Найди и почини их.',
      'In the showcase there are only words instead of two pictures. There are two mistakes in the tags. Find and fix them.'),
    hints: [
      L3('Har bir img ni tekshiring: atribut nomlari to‘g‘rimi?', 'Проверь каждый img: верны ли имена атрибутов?', 'Check each img: are the attribute names right?'),
      L3('{n}-qatorga qarang: undagi rasm tegida nimadir joyida emas.', 'Посмотри на строку {n}: с тегом картинки в ней что-то не так.', 'Look at line {n}: something’s off with the picture tag there.'),
      L3('Rasm tegi: img, fayl nomli src va alt. Mana to‘g‘ri teglar.', 'Тег картинки — это img, src с именем файла и alt. Вот правильные теги.', 'A picture tag is img, src with the file name, and alt. Here are correct tags.')
    ],
    hintLine: L3('Hammasi tuzaldi, «Tekshirish»ni bosing.', 'Всё починено — нажми «Проверить».', 'Everything is fixed — tap “Check”.'),
    hintKeep: L3('Avvalgi kod bilan solishtiring: o‘sha fayllar va o‘sha alt qolishi kerak.', 'Сравни с тем, что было: те же файлы и те же alt.', 'Compare with how it was: the same files and alts.'),
    hintTags: L3('Teglarni tekshiring: atribut nomlari va qo‘shtirnoqlar joyidami?', 'Проверь теги: на месте ли имена атрибутов и кавычки?', 'Check the tags: are the attribute names and quotes in place?'),
    praise: L3('Qutqardingiz! Vitrinada yana rasmlar.', 'Спасено! На витрине снова картинки.', 'Saved! The showcase has pictures again.'),
    done: L3('Vitrina tuzatildi.', 'Витрина починена.', 'The showcase is fixed.'),
    drill: L3('Bu yerda ham tuzatiladigan ikkita joy bor. Toping va tuzating.', 'И здесь два места надо поправить. Найди и почини.', 'Two spots need fixing here too. Find and fix them.')
  },

  // 5 · своя галерея с нуля: h1 и p (урок 2), две картинки с src и alt.
  t5: {
    order: L3('O‘z galereyangizni yozing: h1, p va ikkita rasm — har birida alt', 'Напиши свою галерею: h1, p и две картинки с alt', 'Write your gallery: h1, p and two pictures with alt'),
    say: L3('Rasmlar joyida! Endi o‘z galereyangizni yozing: h1 da nom, p da bitta jumla va fayllardan kamida ikkita rasm, har birida alt.',
      'Картинки на месте! Теперь напиши свою галерею: название h1, одну фразу в p и хотя бы две картинки из файлов, у каждой alt.',
      'The pictures are back! Now write your own gallery: an h1 name, one sentence in p, and at least two pictures from the files, each with alt.'),
    empty: L3('Galereyangiz shu yerda chiqadi', 'Здесь появится твоя галерея', 'Your gallery will appear here'),
    hints: [
      L3('Sahifa sarlavhadan boshlanadi, ostida xatboshi, keyin rasmlar.', 'Страница начинается с заголовка, под ним абзац, потом картинки.', 'The page starts with a heading, then a paragraph, then pictures.'),
      L3('h1 juftidan boshlang va ichiga galereya nomini yozing.', 'Начни с пары h1 и напиши внутри название галереи.', 'Start with an h1 pair and type the gallery name inside.'),
      L3('Mana boshqa galereya. O‘zingiznikini ham shunday tuzing.', 'Вот другая галерея. Свою построй так же.', 'Here’s another gallery. Build yours the same way.')
    ],
    hint2: {
      h1: L3('h1 juftidan boshlang va ichiga galereya nomini yozing.', 'Начни с пары h1 и напиши внутри название галереи.', 'Start with an h1 pair and type the gallery name inside.'),
      p: L3('Sarlavha ostiga p juftini yozing: ichida bitta jumla.', 'Под заголовком напиши пару p — внутри одна фраза.', 'Under the heading, write a p pair with one sentence inside.'),
      img: L3('Keyin ikkita img yozing: src da fayl nomi, alt da tavsif.', 'Дальше напиши два img: в src имя файла, в alt описание.', 'Then write two img tags: the file name in src, a description in alt.'),
      file: L3('Fayllar ro‘yxatiga qarang: src da faqat bor fayllar bo‘lsin.', 'Посмотри на список файлов: в src — только существующие файлы.', 'Look at the file list: src should only have files that exist.'),
      alt: L3('Har bir img ga so‘z bilan alt yozing.', 'В каждый img допиши alt со словами.', 'Add an alt with words to each img.'),
      tag: L3('Teglarni tekshiring: har bir ochilgan teg o‘z jufti bilan yopilishi kerak.', 'Проверь теги: каждый открытый тег должен закрыться своей парой.', 'Check the tags: every opened tag must close with its pair.')
    },
    praise: L3('Galereyangiz tayyor! Uning kodini boshidan oxirigacha o‘zingiz yozdingiz.', 'Твоя галерея готова! Её код — целиком твой, от первой до последней строки.', 'Your gallery is ready! You wrote its code yourself, start to finish.'),
    done: L3('Galereyangiz tayyor.', 'Твоя галерея уже готова.', 'Your gallery is already done.'),
    drill: L3('Yana bitta rasm qo‘shing: gul, flower.jpg, alt bilan.', 'Добавь ещё одну картинку — цветок, flower.jpg, с alt.', 'Add one more picture: the flower, flower.jpg, with alt.')
  },

  drill: {
    say: L3('Chiqdi! Endi yana bir marta, yangi matn bilan.', 'Получилось! Теперь ещё раз, с новым текстом.', 'You did it! Now once more, with new text.'),
    done: L3('Yangi matn bilan ham chiqdi. Endi bu sizning qo‘lingizda.', 'И с новым текстом получилось. Теперь это точно твоё.', 'It worked with new text too. Now it’s really yours.')
  },

  fin: {
    eyebrow: L3('Ko‘rgazma ochiq', 'Выставка открыта', 'The exhibition is open'),
    say: L3('Tabriklayman! Hamma rasmlar joyida. Oxirgi rom esa sizning galereyangiz.', 'Ура! Все картинки на местах. А последняя рама — твоя галерея.', 'Hooray! All the pictures are in place. And the last frame is your gallery.'),
    skills: [
      L3('Rasmga src bilan fayl beraman', 'Даю картинке файл атрибутом src', 'I give a picture a file with src'),
      L3('Fayl nomidagi xatoni topaman', 'Нахожу опечатку в имени файла', 'I find a typo in a file name'),
      L3('Rasmga alt tavsifini yozaman', 'Пишу картинке описание alt', 'I write an alt description'),
      L3('Buzilgan rasm tegini tuzataman', 'Чиню сломанный тег картинки', 'I fix a broken picture tag'),
      L3('Rasmli o‘z sahifamni yozaman', 'Пишу свою страницу с картинками', 'I write my own page with pictures')
    ]
  }
};

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:../praktika-04/p04-engine.jsx@*/

/*@FILE:p05-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:../praktika-04/p04.css@*/
/*@FILE:p05.css@*/
`;
