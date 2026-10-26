// =============================================================================
// КУРС «HTML» · Модуль 1 · Практика к уроку 4 — «Острова». Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/praktika-04/p04.src.jsx lessons/html/04p-ssylki-i-atributy.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА К УРОКУ 4 · «Острова» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (26.10.2026; каркас и вид — практики 01p–03p, бумажный стиль урока 1).
// Сайт островов: у каждого острова своя страница, между ними мосты-ссылки. В
// хуке ученик нажимает «Шторм!» — шторм рвёт мосты. Ученик чинит четыре моста
// кодом и пишет своё меню островов. Ссылки в бумажном браузере честные: их
// можно нажать — откроется страница острова (или «Файл не найден»).
//
// СЕМЬ СЛАЙДОВ (заказчик, 22.10.2026): хук · пять заданий от лёгкого к сложному,
// у каждого своя механика:
//   t1 попугаи — у готовой ссылки нет адреса: дописать href="parrots.html";
//   t2 указатели — две ссылки ведут не туда: поменять значения href (проверить нажатием);
//   t3 вулкан — с пустой строки написать ссылку целиком;
//   t4 после шторма — найти и починить две сломанные ссылки (опечатка в href,
//      нет </a> — абзац ниже стал ссылкой); счётчик «осталось исправить»;
//   t5 своё меню — с нуля: h1 (урок 2), список ul (урок 3) и три ссылки на острова.
// Только материал уроков 1–4: готовые head и body вокруг кода, h1, h2, p, ul, li, a, href.
//
// ОСОБЫЕ ПРАВИЛА (как в 01p–03p): Коди — голова в кружке в шапке, без облака с
// текстом; пишет ученик; проверка по «Проверить» (одна причина, со второй неудачи
// — ступень подсказки); три ступени по лампочке, после образца — ещё одна задача;
// браузер честный и без прокрутки; код не исполняется; конфетти только в финале.
// =============================================================================
const META = {
  lessonId: 'html-04p-orollar',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '4-dars amaliyoti. Orollar',
    ru: 'Практика к уроку 4. Острова',
    en: 'Lesson 4 practice. The islands'
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
// ОСТРОВА — пять мест карты. Задание n чинит мост к острову n; последний — меню
// ученика. file — страница острова.
// ─────────────────────────────────────────────────────────────────────────────
const STREET = [
  { id: 'parrots', c: '#2A8C7E', file: 'parrots.html', name: L3('To‘tiqushlar', 'Попугаи', 'Parrots') },
  { id: 'cave', c: '#7B6A9E', file: 'cave.html', name: L3('G‘or', 'Пещера', 'Cave') },
  { id: 'volcano', c: '#E0643F', file: 'volcano.html', name: L3('Vulqon', 'Вулкан', 'Volcano') },
  { id: 'light', c: '#F0B13F', file: 'lighthouse.html', name: L3('Mayoq', 'Маяк', 'Lighthouse') },
  { id: 'mine', c: '#1F2A44', name: L3('Sizning menyuingiz', 'Твоё меню', 'Your menu') }
];
const HOME = STREET.length - 1;
// Фото-файлов в этой практике нет (картинки — урок 5).
const PHOTO_FILES = {};
// Страницы сайта: куда ведут ссылки.
const SITE_PAGES = {
  'index.html': { title: L3('Orollar xaritasi', 'Карта островов', 'Island map'), text: L3('Qayerga suzamiz?', 'Куда поплывём?', 'Where shall we sail?'), pic: 'map' },
  'parrots.html': { title: L3('To‘tiqushlar oroli', 'Остров попугаев', 'Parrot Island'), text: L3('Bu yerda to‘tiqushlar qo‘shiq aytadi.', 'Здесь попугаи поют песни.', 'Parrots sing songs here.'), pic: 'parrots' },
  'cave.html': { title: L3('G‘or', 'Пещера', 'Cave'), text: L3('G‘orda qadimiy xazina yashiringan.', 'В пещере спрятан старинный клад.', 'An old treasure is hidden in the cave.'), pic: 'cave' },
  'volcano.html': { title: L3('Vulqon', 'Вулкан', 'Volcano'), text: L3('Vulqon uxlayapti, lekin issiq.', 'Вулкан спит, но он горячий.', 'The volcano is asleep, but it’s hot.'), pic: 'volcano' },
  'lighthouse.html': { title: L3('Mayoq', 'Маяк', 'Lighthouse'), text: L3('Mayoq kemalarga yo‘l ko‘rsatadi.', 'Маяк показывает кораблям дорогу.', 'The lighthouse shows ships the way.'), pic: 'light' }
};

// Слова ссылок и страниц.
const TXT = {
  top: L3('Orollar', 'Острова', 'Islands'),
  parrots: L3('To‘tiqushlar oroli', 'Остров попугаев', 'Parrot Island'),
  cave: L3('G‘or', 'Пещера', 'Cave'),
  light: L3('Mayoq', 'Маяк', 'Lighthouse'),
  volcano: L3('Vulqon', 'Вулкан', 'Volcano'),
  parrotsS: L3('To‘tiqushlar', 'Попугаи', 'Parrots'),
  whereH: L3('Qayerga suzamiz?', 'Куда поплывём?', 'Where shall we sail?'),
  wish: L3('Yaxshi sayohat!', 'Счастливого пути!', 'Have a good trip!'),
  wish2: L3('Ehtiyot bo‘ling, to‘lqinlar!', 'Осторожно, волны!', 'Watch out for the waves!'),
  menuH: L3('Mening orollarim', 'Мои острова', 'My islands'),
  home: L3('Bosh sahifa', 'Главная', 'Home')
};

// Подписи интерфейса практики. up, down, mySite, hello, play нужны бумажному набору.
const UI = {
  task: L3('{n}-topshiriq', 'Задание {n}', 'Task {n}'),
  houseOf: L3('{n}/5-orol', 'Остров {n} из 5', 'Island {n} of 5'),
  map: L3('Orollar xaritasi', 'Карта островов', 'Island map'),
  works: L3('ko‘prik bor', 'мост есть', 'bridge ready'),
  off: L3('kutmoqda', 'ждёт', 'waiting'),
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
  storm: L3('Bo‘ron!', 'Шторм!', 'Storm!'),
  files: L3('Orollar fayllari', 'Файлы островов', 'Island files'),
  tryLink: L3('Havolani bosib tekshiring', 'Нажми ссылку — проверь', 'Tap a link to test it'),
  left: L3('Tuzatish kerak: {n}', 'Осталось исправить: {n}', 'Left to fix: {n}'),
  allFixed: L3('Hammasi tuzatildi', 'Всё исправлено', 'All fixed'),
  needH1: L3('h1 — menyu nomi', 'h1 — название меню', 'h1 — the menu name'),
  needList: L3('ul yoki ol — ro‘yxat', 'ul или ol — список', 'ul or ol — the list'),
  need3: L3('li ichida kamida 3 ta havola', 'хотя бы 3 ссылки в li', 'at least 3 links in li'),
  needReal: L3('havolalar orollarga olib boradi', 'ссылки ведут на острова', 'the links lead to islands'),
  needClosed: L3('hamma teglar yopilgan', 'все теги закрыты', 'all tags are closed'),
  notFound: L3('Fayl topilmadi', 'Файл не найден', 'File not found'),
  back: L3('← Orqaga', '← Назад', '← Back'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Rasmlar', 'Изображения', 'Images'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play')
};

// ─────────────────────────────────────────────────────────────────────────────
// ОБРАТНАЯ СВЯЗЬ ПРОВЕРКИ. Одна проблема — одна короткая фраза: что не так и
// что сделать. Без «ошибка», «неправильно», «xato», «noto‘g‘ri». Фразы про
// атрибуты (имя, «=», кавычки, атрибут в закрывающем теге) — общие, в движке.
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
  // Ссылки (урок 4)
  needA: L3('Bu yerda havola kerak: a tegi.', 'Здесь нужна ссылка — тег a.', 'This needs a link: the a tag.'),
  oneLink: L3('Bitta havola yozing: bitta a jufti.', 'Напиши одну ссылку — одну пару a.', 'Write just one link: one opening a and one closing a.'),
  noHref: L3('Havolada manzil yo‘q: ochuvchi a tegiga href atributini yozing.', 'У ссылки нет адреса: допиши в открывающий тег a атрибут href.', 'The link has no address: add the href attribute to the opening a tag.'),
  hrefEmpty: L3('href ichi bo‘sh: qo‘shtirnoq ichiga sahifa manzilini yozing.', 'В href пусто: впиши между кавычками адрес страницы.', 'href is empty: type the page address between the quotes.'),
  hrefWrong: L3('Bu havola {href} ga olib boradi, bizga esa {want} kerak.', 'Эта ссылка ведёт на {href}, а нужен {want}.', 'This link leads to {href}, but we need {want}.'),
  textKeep: L3('Manzil to‘g‘ri! Havola so‘zlarini avvalgidek qoldiring: «{w}».', 'Адрес верный! Слова ссылки оставь прежними: «{w}».', 'The address is right! Keep the link words as they were: “{w}”.'),
  linkTo: L3('«{text}» havolasi {href} ga olib boryapti. «{text}» orolining sahifasi esa {want}.', '«{text}» ведёт на {href}, а страница острова «{text}» — {want}.', 'The “{text}” link leads to {href}, but the “{text}” island page is {want}.'),
  twoLinks: L3('Ikkala havola joyida qolsin: har biri o‘z oroliga.', 'Пусть обе ссылки останутся — каждая на свой остров.', 'Keep both links, each pointing to its island.'),
  needText: L3('Teglar orasiga sahifada ko‘rinadigan so‘zlarni yozing.', 'Между тегами напиши слова, которые увидят на странице.', 'Between the tags, type the words people will see on the page.'),
  keepLinks: L3('Teglar tuzaldi! Faqat havolalarni avvalgidek qoldiring: o‘sha so‘zlar va o‘sha manzillar.', 'Теги починены! Только оставь ссылки как были: те же слова и те же адреса.', 'The tags are fixed! Just keep the links as they were: the same words and addresses.'),
  notReal: L3('{href} degan sahifa yo‘q. Orollar fayllaridan birini yozing.', 'Страницы {href} нет. Впиши файл одного из островов.', 'There’s no page {href}. Type one of the island files.'),
  // t5 — своё меню
  artEmpty: L3('Hozircha bo‘sh. Menyu nomini h1 ga yozishdan boshlang.', 'Пока пусто. Начни с названия меню в h1.', 'It’s empty so far. Start with the menu name in h1.'),
  needH1: L3('Tepaga h1 sarlavha kerak: menyuingiz nomi.', 'Сверху нужен заголовок h1 — название твоего меню.', 'You need an h1 heading on top: your menu’s name.'),
  menuHeadEmpty: L3('Sarlavha teglari joyida, ichi esa bo‘sh. Menyu nomini yozing.', 'Теги заголовка на месте, а внутри пусто. Напиши название меню.', 'The heading tags are in place, but empty. Write the menu name.'),
  needList: L3('Sarlavha ostiga ro‘yxat kerak: ul yoki ol.', 'Под заголовком нужен список: ul или ol.', 'Under the heading you need a list: ul or ol.'),
  needLinks: L3('Ro‘yxatda kamida uchta havola bo‘lsin: har bir li ichida bittadan.', 'В списке нужно хотя бы три ссылки — по одной в каждом li.', 'The list needs at least three links, one in each li.'),
  needHome: L3('index.html ga olib boradigan havola kerak.', 'Нужна ссылка, которая ведёт на index.html.', 'You need a link that leads to index.html.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ ЭКРАНОВ. Реплики (say, hints, praise, done …) звучат; подписи
// (eyebrow, order, ask, note, empty …) только печатаются. В узбекских звучащих
// репликах нет тире: движок отдаёт его сервису точкой.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Хук: острова соединены мостами → касание «Шторм!» → мосты рвутся, флажки гаснут.
  intro: {
    eyebrow: L3('Orollar', 'Острова', 'Islands'),
    say: L3('Bu orollar sayti: har bir orolning o‘z sahifasi bor, orollar orasida esa havolalar ko‘prik bo‘lib turibdi.',
      'Это сайт островов: у каждого острова своя страница, а между ними мосты-ссылки.',
      'This is an islands website: each island has its own page, and link bridges connect them.'),
    blown: L3('Voy! Bo‘ron ko‘priklarni uzib yubordi: havolalar ishlamayapti.', 'Ой! Шторм порвал мосты — ссылки не работают.', 'Oh no! The storm broke the bridges: the links don’t work.'),
    plan: L3('To‘rtta ko‘prikni kod bilan tiklaymiz, beshinchi orolga esa o‘z menyuingizni yozasiz. Har bir topshiriq oldingisidan biroz qiyinroq.',
      'Починим четыре моста кодом, а для пятого острова ты напишешь своё меню. Каждое задание чуть сложнее прошлого.',
      'We’ll fix four bridges with code, and you’ll write your own menu for the fifth island. Each task is a bit harder than the last.'),
    ask: L3('«Bo‘ron!» tugmasini bosing', 'Нажми «Шторм!»', 'Tap “Storm!”'),
    order: L3('To‘rtta ko‘prikni tiklang va o‘z menyuingizni yozing. Kodni siz yozasiz.', 'Почини четыре моста и напиши своё меню. Код пишешь ты.', 'Fix four bridges and write your own menu. You write the code.'),
    note: L3('Ko‘prigi tiklangan orol yonadi. Havolani bosib tekshirsa bo‘ladi: brauzer o‘sha sahifani ochadi.', 'Остров загорается, когда его мост готов. Ссылку можно нажать и проверить — браузер откроет страницу.', 'An island lights up when its bridge is ready. You can tap a link to test it: the browser opens that page.')
  },

  // 1 · самое лёгкое: у готовой ссылки нет адреса.
  t1: {
    order: L3('Havolaga manzil bering: parrots.html', 'Дай ссылке адрес: parrots.html', 'Give the link an address: parrots.html'),
    say: L3('To‘tiqushlar oroliga havola bor, lekin manzili yo‘q: so‘zlar qora. Ochuvchi a tegiga href atributini yozing.',
      'Ссылка на остров попугаев есть, а адреса нет — слова чёрные. Допиши в открывающий тег a атрибут href.',
      'There’s a link to Parrot Island, but it has no address: the words are black. Add the href attribute to the opening a tag.'),
    hints: [
      L3('Havolaga qaysi atribut manzil beradi?', 'Какой атрибут даёт ссылке адрес?', 'Which attribute gives a link its address?'),
      L3('Bu href. U ochuvchi tegda, a dan keyin yoziladi: nomi, tenglik belgisi va qo‘shtirnoq ichida manzil.', 'Это href. Его пишут в открывающем теге после a: имя, знак равно и адрес в кавычках.', 'It’s href. It goes in the opening tag, right after the letter a: the name, an equals sign and the address in quotes.'),
      L3('Mana boshqa havolaning manzili qanday yozilgan. To‘tiqushlarni ham shunday yozing.', 'Вот как записан адрес у другой ссылки. Попугаев запиши так же.', 'Here’s how another link’s address is written. Write the parrots the same way.')
    ],
    praise: L3('Zo‘r! Ko‘prik tiklandi: havolani bosib ko‘ring.', 'Огонь! Мост восстановлен — нажми ссылку и проверь.', 'Awesome! The bridge is back: tap the link to try it.'),
    done: L3('To‘tiqushlarga ko‘prik tayyor.', 'Мост к попугаям готов.', 'The bridge to the parrots is ready.'),
    drill: L3('G‘or havolasiga ham manzil bering: cave.html.', 'Дай адрес и ссылке на пещеру: cave.html.', 'Give the cave link an address too: cave.html.')
  },

  // 2 · две ссылки ведут не туда: поменять значения href.
  t2: {
    order: L3('Ikkala havolani o‘z oroliga yo‘naltiring', 'Направь обе ссылки на их острова', 'Point both links to their islands'),
    say: L3('Bo‘ron ko‘rsatkichlarni aralashtirib yubordi: «G‘or» mayoqqa, «Mayoq» esa g‘orga olib boryapti. Manzillarni tuzating. Havolani bosib tekshirib ko‘rishingiz mumkin.',
      'Шторм перепутал указатели: «Пещера» ведёт на маяк, а «Маяк» — в пещеру. Исправь адреса. Ссылку можно нажать и проверить.',
      'The storm mixed up the signposts: “Cave” leads to the lighthouse, and “Lighthouse” leads to the cave. Fix the addresses. You can tap a link to test it.'),
    hints: [
      L3('Har bir havolani bosing: u qayerga olib boradi?', 'Нажми каждую ссылку: куда она ведёт?', 'Tap each link: where does it lead?'),
      L3('G‘or sahifasi cave.html, mayoqniki esa lighthouse.html. href qiymatlarini almashtiring.', 'Пещера — cave.html, маяк — lighthouse.html. Поменяй значения href местами.', 'The cave is cave.html, the lighthouse is lighthouse.html. Swap the href values.'),
      L3('Mana to‘g‘ri havola. Ikkinchisini ham shunday tuzating.', 'Вот правильная ссылка. Вторую поправь так же.', 'Here’s a correct link. Fix the second one the same way.')
    ],
    praise: L3('To‘g‘ri! Endi har bir ko‘rsatkich o‘z oroliga olib boradi.', 'Верно! Теперь каждый указатель ведёт на свой остров.', 'Right! Now each signpost leads to its own island.'),
    done: L3('Ko‘rsatkichlar joyida.', 'Указатели на месте.', 'The signposts are right.'),
    drill: L3('Bu yerda ham aralash: «To‘tiqushlar» va «Vulqon». Tuzating.', 'И здесь путаница: «Попугаи» и «Вулкан». Исправь.', 'They’re mixed up here too: “Parrots” and “Volcano”. Fix them.')
  },

  // 3 · ссылка целиком с пустой строки.
  t3: {
    order: L3('Vulqonga havolani to‘liq yozing', 'Напиши ссылку на вулкан целиком', 'Write a whole link to the volcano'),
    say: L3('Vulqonga ko‘prik umuman yo‘q. Bo‘sh qatorga havolani to‘liq yozing: a tegi, volcano.html manzilli href va o‘z so‘zlaringiz.',
      'К вулкану моста совсем нет. Напиши в пустой строке ссылку целиком: тег a, href с адресом volcano.html и свои слова.',
      'There’s no bridge to the volcano at all. Write a whole link on the empty line: the a tag, href with the address volcano.html, and your own words.'),
    hints: [
      L3('Havola uch qismdan iborat: ochuvchi teg, so‘zlar va yopuvchi teg.', 'Ссылка из трёх частей: открывающий тег, слова и закрывающий тег.', 'A link has three parts: the opening tag, the words and the closing tag.'),
      L3('Ochuvchi tegga volcano.html manzilli href atributini yozing, oxirida a ni yoping.', 'В открывающий тег впиши href с адресом volcano.html, а в конце закрой a.', 'Put href with the address volcano.html in the opening tag, and close the a at the end.'),
      L3('Mana boshqa orolga havola. Vulqonga ham shunday yozing.', 'Вот ссылка на другой остров. На вулкан напиши так же.', 'Here’s a link to another island. Write the volcano one the same way.')
    ],
    praise: L3('Ajoyib! Vulqonga yangi ko‘prik qurildi.', 'Здорово! К вулкану построен новый мост.', 'Great! A new bridge to the volcano is built.'),
    done: L3('Vulqonga ko‘prik tayyor.', 'Мост к вулкану готов.', 'The bridge to the volcano is ready.'),
    drill: L3('Endi mayoqqa havolani to‘liq yozing: lighthouse.html.', 'Теперь напиши целиком ссылку на маяк: lighthouse.html.', 'Now write a whole link to the lighthouse: lighthouse.html.')
  },

  // 4 · найти и починить две сломанные ссылки; счётчик «осталось исправить».
  t4: {
    order: L3('Ikkita buzilgan havolani toping va tuzating', 'Найди и почини две сломанные ссылки', 'Find and fix two broken links'),
    say: L3('Bo‘ron ikkita havolani buzdi: «Mayoq» qora bo‘lib qoldi, pastdagi tilak esa ko‘k. Buzilgan joylarni toping va tuzating.',
      'Шторм сломал две ссылки: «Маяк» стал чёрным, а пожелание внизу — синим. Найди поломки и почини.',
      'The storm broke two links: “Lighthouse” turned black, and the wish below turned blue. Find the breaks and fix them.'),
    hints: [
      L3('Har bir havolani tekshiring: atribut nomi to‘g‘rimi, havola yopilganmi?', 'Проверь каждую ссылку: верно ли имя атрибута, закрыта ли ссылка?', 'Check each link: is the attribute name right, is the link closed?'),
      L3('{n}-qatorga qarang: undagi havolada nimadir joyida emas.', 'Посмотри на строку {n}: со ссылкой в ней что-то не так.', 'Look at line {n}: something’s off with the link there.'),
      L3('Havola: href bilan ochuvchi a, so‘zlar va yopuvchi a. Mana to‘g‘ri havolalar.', 'Ссылка — это открывающий a с href, слова и закрывающий a. Вот правильные ссылки.', 'A link is the opening a with href, the words and the closing a. Here are correct links.')
    ],
    hintLine: L3('Hammasi tuzaldi, «Tekshirish»ni bosing.', 'Всё починено — нажми «Проверить».', 'Everything is fixed — tap “Check”.'),
    hintKeep: L3('Avvalgi kod bilan solishtiring: o‘sha havolalar va o‘sha manzillar qolishi kerak.', 'Сравни с тем, что было: те же ссылки и те же адреса.', 'Compare with how it was: the same links and the same addresses.'),
    hintTags: L3('Teglarni tekshiring: har bir ochilgan teg o‘z jufti bilan yopilishi kerak.', 'Проверь теги: каждый открытый тег должен закрыться своей парой.', 'Check the tags: every opened tag must close with its pair.'),
    praise: L3('Qutqardingiz! Ikkala havola yana ishlaydi.', 'Спасено! Обе ссылки снова работают.', 'Saved! Both links work again.'),
    done: L3('Havolalar tuzatildi.', 'Ссылки починены.', 'The links are fixed.'),
    drill: L3('Bu yerda ham ikkita havola buzilgan. Toping va tuzating.', 'И здесь две ссылки сломаны. Найди и почини.', 'Two links are broken here too. Find and fix them.')
  },

  // 5 · своё меню с нуля: h1 (урок 2), список (урок 3) и три ссылки на острова.
  t5: {
    order: L3('O‘z menyuingizni yozing: h1 nom, ro‘yxat va kamida uchta havola', 'Напиши своё меню: название h1, список и хотя бы три ссылки', 'Write your menu: an h1 name, a list and at least three links'),
    say: L3('Ko‘priklar tiklandi! Endi orollar menyusini o‘zingiz yozing: h1 da nom, ostida ro‘yxat, unda kamida uchta li, har birida orolga havola.',
      'Мосты восстановлены! Теперь напиши своё меню островов: название h1, под ним список, а в нём хотя бы три li, в каждом ссылка на остров.',
      'The bridges are back! Now write your own island menu: an h1 name, a list under it, with at least three li, each with a link to an island.'),
    empty: L3('Menyuingiz shu yerda chiqadi', 'Здесь появится твоё меню', 'Your menu will appear here'),
    hints: [
      L3('Sahifa sarlavhadan boshlanadi, ostida ro‘yxat, ro‘yxatda havolalar.', 'Страница начинается с заголовка, под ним список, в списке ссылки.', 'The page starts with a heading, then a list, with links in the list.'),
      L3('h1 juftidan boshlang va ichiga menyu nomini yozing.', 'Начни с пары h1 и напиши внутри название меню.', 'Start with an h1 pair and type the menu name inside.'),
      L3('Mana boshqa menyu. O‘zingiznikini ham shunday tuzing.', 'Вот другое меню. Своё построй так же.', 'Here’s another menu. Build yours the same way.')
    ],
    hint2: {
      h1: L3('h1 juftidan boshlang va ichiga menyu nomini yozing.', 'Начни с пары h1 и напиши внутри название меню.', 'Start with an h1 pair and type the menu name inside.'),
      list: L3('Sarlavhadan keyin ul ni oching, oxirida uni yoping.', 'После заголовка открой ul, а в конце закрой.', 'After the heading, open ul, and close it at the end.'),
      links: L3('Har bir li ichiga havola yozing: a, href da orol fayli va so‘zlar.', 'В каждый li впиши ссылку: a, в href файл острова и слова.', 'In each li, write a link: the a tag with an island file in href, and the words.'),
      real: L3('Orollar fayllariga qarang: href da faqat bor sahifalar bo‘lsin.', 'Посмотри на файлы островов: в href — только существующие страницы.', 'Look at the island files: href should only have pages that exist.'),
      tag: L3('Teglarni tekshiring: har bir ochilgan teg o‘z jufti bilan yopilishi kerak.', 'Проверь теги: каждый открытый тег должен закрыться своей парой.', 'Check the tags: every opened tag must close with its pair.')
    },
    praise: L3('Menyuingiz tayyor! Havolalarni bosib ko‘ring: har biri o‘z oroliga olib boradi.', 'Твоё меню готово! Нажми ссылки — каждая ведёт на свой остров.', 'Your menu is ready! Tap the links: each one leads to its island.'),
    done: L3('Menyuingiz tayyor.', 'Твоё меню уже готово.', 'Your menu is already done.'),
    drill: L3('Menyu ostiga bosh sahifaga havola qo‘shing: index.html.', 'Добавь под меню ссылку на главную: index.html.', 'Add a link to the home page under the menu: index.html.')
  },

  drill: {
    say: L3('Chiqdi! Endi yana bir marta, yangi matn bilan.', 'Получилось! Теперь ещё раз, с новым текстом.', 'You did it! Now once more, with new text.'),
    done: L3('Yangi matn bilan ham chiqdi. Endi bu sizning qo‘lingizda.', 'И с новым текстом получилось. Теперь это точно твоё.', 'It worked with new text too. Now it’s really yours.')
  },

  fin: {
    eyebrow: L3('Ko‘priklar tiklandi', 'Мосты восстановлены', 'The bridges are back'),
    say: L3('Tabriklayman! Orollar yana bog‘langan. Menyu esa sizniki.', 'Ура! Острова снова связаны. А меню — твоё.', 'Hooray! The islands are connected again. And the menu is yours.'),
    skills: [
      L3('Havolaga href bilan manzil beraman', 'Даю ссылке адрес атрибутом href', 'I give a link an address with href'),
      L3('Noto‘g‘ri manzilni tuzataman', 'Исправляю неверный адрес', 'I fix a wrong address'),
      L3('Havolani to‘liq yozaman', 'Пишу ссылку целиком', 'I write a whole link'),
      L3('Buzilgan havolalarni tuzataman', 'Чиню сломанные ссылки', 'I fix broken links'),
      L3('Havolali menyu yozaman', 'Пишу меню со ссылками', 'I write a menu with links')
    ]
  }
};

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:p04-engine.jsx@*/

/*@FILE:p04-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:p04.css@*/
`;
