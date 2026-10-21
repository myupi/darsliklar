// =============================================================================
// КУРС «HTML» · Модуль 1 · Практика к уроку 1 — «Бумажная улица». Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/praktika-01/p01.src.jsx lessons/html/01p-struktura-dokumenta.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА К УРОКУ 1 · «Бумажная улица» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (22.10.2026, переделка по эталону — урок 1 «Бумажная страница»).
// Стиль урока 1: бумажный коллаж — лист с рваным краем, вырезки с фактурой и
// тенью, stop-motion, шорох бумаги, переход «разбор и сборка», бумажный браузер.
// Сюжет: бумажная улица, каждый дом на ней — веб-страница. Ветер (одно касание
// в хуке) разметал её: у домов пропали названия, тексты и куски кода. Ученик
// чинит четыре дома кодом, а пятый — свой — строит сам. Улица — индикатор
// продвижения: дом загорается, когда его страница готова.
//
// СЕМЬ СЛАЙДОВ (заказчик, 22.10.2026): хук · пять заданий от самого лёгкого к
// сложному, без выхода за грань понимания 10–14 лет · вывод.
//   t1 пекарня — своё название между готовыми тегами title (поле в строке)
//   t2 почта — дописать </title>: без него весь текст честно уезжает на вкладку
//   t3 кинотеатр — блок body со своим текстом (три строки)
//   t4 школа — нажать место, где кончается head, и вписать </head>
//   t5 свой дом — внутри готового html написать head с title и body с текстом
//
// ОСОБЫЕ ПРАВИЛА ПРАКТИКИ (требования заказчика — навык praktika)
//   · Коди не рисуется: в шапке только кружок голоса и лампочка; задание всегда
//     написано строкой-полоской на листе.
//   · Пишет ученик; кнопки < / > только вставляют символ в место курсора.
//   · Проверка — только по «Проверить»; браузер обновляется сразу и показывает
//     честно (текст из незакрытого title уходит на вкладку вместе с тегами).
//   · Неудача — одна причина; со второй неудачи подряд — ещё и ступень
//     подсказки; лампочка открывает ступени по просьбе; после образца третьей
//     ступени — короткая дополнительная задача с новым содержимым.
//   · Код ученика не исполняется: из него извлекается только текст.
//   · Тон — как в эталоне: коротко, спокойно, узбекский как живая речь
//     (Siz; yorliq — вкладка, oyna — окно, sahifa nomi — название).
//   · Конфетти — только в финале.
// =============================================================================

const META = {
  lessonId: 'html-01p-bumazhnaya-ulica',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '1-dars amaliyoti. Qog‘oz ko‘cha',
    ru: 'Практика к уроку 1. Бумажная улица',
    en: 'Lesson 1 practice. Paper Street'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });

// Подстановка в трёхъязычную строку: fillL(FB.openAgain, { tag: 'body' }).
// Значение подстановки — строка или { uz, ru, en }.
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
// БУМАЖНАЯ УЛИЦА — пять домов. Задание n чинит дом n; последний — свой дом ученика.
// ─────────────────────────────────────────────────────────────────────────────
const STREET = [
  { id: 'bakery', c: '#E0643F', name: L3('Novvoyxona', 'Пекарня', 'Bakery') },
  { id: 'post',   c: '#F0B13F', name: L3('Pochta', 'Почта', 'Post office') },
  { id: 'cinema', c: '#1F2A44', name: L3('Kinoteatr', 'Кинотеатр', 'Cinema') },
  { id: 'school', c: '#2A8C7E', name: L3('Maktab', 'Школа', 'School') },
  { id: 'home',   c: '#5E8FB8', name: L3('Sizning uyingiz', 'Твой дом', 'Your house') }
];
const HOME = STREET.length - 1;

// Содержимое страниц домов и дополнительных задач.
const TXT = {
  bakeryText: L3('Har kuni ertalab issiq non.', 'Свежий хлеб каждое утро.', 'Fresh bread every morning.'),
  bikeText: L3('Bu yerda velosipedlar tuzatiladi.', 'Здесь чинят велосипеды.', 'Bikes get fixed here.'),
  postText: L3('Xatlar va posilkalar shu yerda.', 'Здесь письма и посылки.', 'Letters and parcels are here.'),
  stop: L3('Bekat', 'Остановка', 'Bus stop'),
  stopText: L3('Avtobus tez-tez keladi.', 'Автобус приходит часто.', 'The bus comes often.'),
  pool: L3('Basseyn', 'Бассейн', 'Pool'),
  schoolText: L3('Darslar ertalab boshlanadi.', 'Уроки начинаются утром.', 'Lessons start in the morning.'),
  cafe: L3('Kafe', 'Кафе', 'Cafe'),
  cafeText: L3('Choy va pirog.', 'Чай и пирог.', 'Tea and pie.'),
  workshop: L3('Ustaxona', 'Мастерская', 'Workshop')
};

// Подписи интерфейса практики. up, down, mySite, hello, play нужны бумажному набору.
const UI = {
  task: L3('{n}-topshiriq', 'Задание {n}', 'Task {n}'),
  houseOf: L3('{n}/5-uy', 'Дом {n} из 5', 'House {n} of 5'),
  map: L3('Ko‘cha xaritasi', 'Карта улицы', 'Street map'),
  works: L3('tayyor', 'готов', 'ready'),
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
  wind: L3('Shamol!', 'Ветер!', 'Wind!'),
  given: L3('tayyor', 'уже есть', 'given'),
  bpTitle: L3('uy nomi', 'название дома', 'house name'),
  bpBody: L3('oynadagi matn', 'текст в окне', 'text in the window'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Katta sarlavha va xatboshilar', 'Большой заголовок и абзацы', 'A big heading and paragraphs'),
  part: {
    open: L3('ochuvchi teg', 'открывающий тег', 'opening tag'),
    name: L3('nom', 'название', 'name'),
    text: L3('matn', 'текст', 'text'),
    close: L3('yopuvchi teg', 'закрывающий тег', 'closing tag')
  },
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play')
};

// ─────────────────────────────────────────────────────────────────────────────
// ОБРАТНАЯ СВЯЗЬ ПРОВЕРКИ. Одна проблема — одна короткая фраза: что не так и
// что сделать. Без «ошибка», «неправильно», «xato», «noto‘g‘ri». Говорим о
// правилах нашей страницы, а не обо всём HTML. Знак — с названием рядом.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  // Запись тега
  noGt: L3('{tag} tegi oxirida o‘ng «>» qavs yetishmayapti.', 'У тега {tag} в конце не хватает уголка «>».', 'The {tag} tag is missing the bracket “>” at the end.'),
  noLt: L3('{tag} oldida chap «<» qavs yetishmayapti.', 'Перед {tag} не хватает уголка «<».', 'The bracket “<” is missing before {tag}.'),
  unknown: L3('«{raw}» tegida harflar adashgan: {tag} kerak.', 'В теге «{raw}» перепутаны буквы: нужно {tag}.', 'The letters in “{raw}” are mixed up: it should be {tag}.'),
  unknownFar: L3('«{raw}» tegi bizga notanish. Sahifamizda faqat html, head, title va body bor.', 'Тег «{raw}» нам не знаком. На нашей странице только html, head, title и body.', 'We don’t know the tag “{raw}”. Our page has only html, head, title and body.'),
  slashEnd: L3('Qiya chiziq boshqa joyda turibdi. Yopuvchi tegda u chap «<» qavsdan keyin keladi: </{tag}>.', 'Косая черта стоит не там. В закрывающем теге она идёт сразу после уголка «<»: </{tag}>.', 'The slash is in the wrong spot. In a closing tag it goes right after the bracket “<”: </{tag}>.'),
  backslash: L3('Yopuvchi tegda qiya chiziq «/» turadi, bu yerda esa teskari «\\» chiziq.', 'В закрывающем теге нужна косая черта «/», а здесь обратная «\\».', 'A closing tag needs a slash “/”, but here it is a backslash “\\”.'),
  junk: L3('Qavslar ichiga faqat teg nomini yozamiz, matn esa tashqarida turadi.', 'Внутри уголков пишем только имя тега, а текст — снаружи.', 'Inside the brackets we write only the tag name; the text goes outside.'),
  emptyTag: L3('Bu yerda bo‘sh qavslar. Ichida teg nomi bo‘lishi kerak.', 'Здесь пустые уголки. Внутри должно быть имя тега.', 'These brackets are empty. A tag name goes inside.'),
  // Пары и вложенность
  openAgain: L3('Bu yerda ochuvchi {tag} yozilgan. Yopuvchi tegga qiya chiziq kerak.', 'Здесь написан открывающий {tag}. Закрывающему тегу нужна косая черта.', 'This is an opening {tag}. The closing tag needs a slash.'),
  notClosedOpen: L3('{tag} hali tugamadi, {next} esa allaqachon boshlanyapti.', '{tag} ещё не закончился, а {next} уже начинается.', '{tag} hasn’t ended yet, but {next} is already starting.'),
  notClosedClose: L3('{tag} hali tugamadi, {next} esa allaqachon yopilyapti. {tag} nima bilan tugashini tekshiring.', '{tag} ещё не закончился, а {next} уже закрывается. Проверь, чем заканчивается {tag}.', '{tag} hasn’t ended yet, but {next} is already closing. Check how {tag} ends.'),
  unclosedEnd: L3('{tag} nima bilan tugashini tekshiring: yopuvchi teg yo‘q.', 'Проверь, чем заканчивается {tag}: закрывающего тега нет.', 'Check how {tag} ends: there is no closing tag.'),
  unclosedHtmlOk: L3('Nom ham, matn ham tayyor. html nima bilan tugashini tekshiring.', 'Название и текст готовы. Проверь, чем заканчивается html.', 'The name and the text are ready. Check how html ends.'),
  twice: L3('{tag} yuqorida allaqachon ochilgan. Sahifamizda u bitta.', '{tag} уже открыт выше. На нашей странице он один.', '{tag} is already opened above. Our page has only one.'),
  closeWithoutOpen: L3('Bu yerda yopuvchi {tag} bor, ochuvchisi esa yo‘q.', 'Здесь закрывающий {tag}, а открывающего нет.', 'There is a closing {tag} here, but no opening one.'),
  closeTwice: L3('{tag} ikki marta yopilgan. Ortiqcha yopuvchi tegni o‘chiring.', '{tag} закрыт два раза. Лишний закрывающий тег сотри.', '{tag} is closed twice. Delete the extra closing tag.'),
  titleOutsideHead: L3('title ni head ichiga yozamiz: bu sahifa haqidagi ma’lumot.', 'title пишем внутри head: это сведения о странице.', 'title goes inside head: it is information about the page.'),
  noHtmlOpen: L3('html dan boshlang: birinchi qatordan keyin ochuvchi html kerak.', 'Начни с html: после первой строки нужен открывающий html.', 'Start with html: after the first line you need an opening html.'),
  afterHtml: L3('{tag} yopuvchi html dan keyin turibdi. Hammasini html ichiga yozamiz.', '{tag} стоит после закрывающего html. Всё пишем внутри html.', '{tag} comes after the closing html. Everything goes inside html.'),
  htmlInside: L3('html hamma qismlarni o‘z ichiga oladi, shuning uchun u hammasidan tashqarida turadi.', 'html объединяет все части, поэтому он стоит снаружи всех.', 'html holds all the parts, so it goes outside everything.'),
  headAfterBody: L3('head body dan oldin turadi: avval sahifa haqida ma’lumot, keyin oynada ko‘rinadigan qism.', 'head стоит перед body: сначала сведения о странице, потом то, что видно в окне.', 'head comes before body: first the page information, then what you see in the window.'),
  textOutNone: L3('Matn html dan tashqarida turibdi. Oynada ko‘rinadigan matnni body ichiga yozamiz.', 'Текст стоит снаружи html. Текст для окна пишем внутри body.', 'The text is outside html. Text for the window goes inside body.'),
  textOutHtml: L3('Matn body dan tashqarida. Oynada ko‘rinadigan matnni body ichiga yozamiz.', 'Текст стоит вне body. Текст для окна пишем внутри body.', 'The text is outside body. Text for the window goes inside body.'),
  textOutHead: L3('head ichida matnni faqat title ichiga yozamiz.', 'В head текст пишем только внутри title.', 'Inside head, text goes only inside title.'),
  missHtml: L3('html jufti yo‘q. U birinchi qatordan keyin ochiladi va eng oxirida yopiladi.', 'Нет пары html. Она открывается после первой строки и закрывается в самом конце.', 'There is no html pair. It opens after the first line and closes at the very end.'),
  missHead: L3('head qismi yo‘q. U html ichida, body dan oldin turadi. Unda title bo‘ladi.', 'Нет части head. Она стоит внутри html перед body, в ней — title.', 'There is no head part. It goes inside html before body, and title lives in it.'),
  missTitle: L3('head ichiga nomli title qo‘ying.', 'В head нужен title с названием.', 'head needs a title with a name.'),
  missBody: L3('body qismi yo‘q. U head dan keyin keladi.', 'Нет части body. Она идёт после head.', 'There is no body part. It comes after head.'),
  titleEmpty: L3('title joyida, lekin bo‘sh. Teglar orasiga nom yozing.', 'title на месте, но пустой. Напиши название между тегами.', 'title is there, but it is empty. Write a name between the tags.'),
  bodyEmpty: L3('body teglari joyida, ichi esa bo‘sh. Matn yozing.', 'Теги body на месте, а внутри пусто. Напиши текст.', 'The body tags are in place, but it is empty inside. Write the text.'),
  noDoctype: L3('Birinchi qator yo‘qoldi. Boshiga <!DOCTYPE html> ni qaytaring.', 'Первая строка пропала. Верни <!DOCTYPE html> в начало.', 'The first line is gone. Put <!DOCTYPE html> back at the start.'),
  textOnly: L3('Matn bor, lekin teglar yo‘q. Sahifa teglardan quriladi: html dan boshlang.', 'Текст есть, а тегов нет. Страница строится из тегов: начни с html.', 'There is text but no tags. A page is built from tags: start with html.'),
  docEmpty: L3('Hozircha faqat birinchi qator bor. Ochuvchi html dan boshlang.', 'Пока есть только первая строка. Начни с открывающего html.', 'There is only the first line so far. Start with an opening html.'),
  // Поля в строках (t1, t2)
  fieldTags: L3('Teglar o‘z joyida turibdi. Bu yerga faqat so‘z yozing, qavslarsiz.', 'Теги уже стоят на месте. Здесь нужны только слова, без уголков.', 'The tags are already in place. Only words here, no brackets.'),
  titleBlank: L3('title hozircha bo‘sh. Nomni title teglari orasiga yozing.', 'title пока пустой. Напиши название между тегами title.', 'title is empty so far. Write a name between the title tags.'),
  fieldLetters: L3('Nomni harflar bilan yozing: kamida bitta so‘z.', 'Напиши название буквами — хотя бы одно слово.', 'Write the name in letters, at least one word.'),
  // Строка title (t3, t4)
  lineEmpty: L3('Qator hozircha bo‘sh. Unga title tegi, nom va yopuvchi tegni yozing.', 'Строка пока пустая. Напиши в ней тег title, название и закрывающий тег.', 'The line is empty so far. Write the title tag, the name and the closing tag.'),
  lineTextOnly: L3('Hozircha bu yerda faqat matn. Sahifa nomi title teglari orasida turadi.', 'Пока здесь только текст. Название страницы стоит между тегами title.', 'There is only text here so far. The page name stands between title tags.'),
  lineWrongTag: L3('Sahifa nomi title ichida yoziladi, bu yerda esa {tag} turibdi.', 'Название страницы пишут в title, а здесь стоит {tag}.', 'The page name goes in title, but here you have {tag}.'),
  lineNoOpen: L3('Nomdan oldin ochuvchi title yo‘q.', 'Перед названием нет открывающего title.', 'There is no opening title before the name.'),
  lineNoClose: L3('Nom bor. Endi uni yoping: nomdan keyin yopuvchi title kerak.', 'Название есть. Теперь закрой его: после названия нужен закрывающий title.', 'The name is there. Now close it: put a closing title after the name.'),
  lineTextOutside: L3('Matnning bir qismi teglardan tashqarida. Nomni ochuvchi va yopuvchi title orasiga yozamiz.', 'Часть текста стоит снаружи тегов. Название пишем между открывающим и закрывающим title.', 'Part of the text is outside the tags. The name goes between the opening and the closing title.'),
  lineOrder: L3('Avval ochuvchi title, keyin nom, keyin yopuvchi title.', 'Сначала открывающий title, потом название, потом закрывающий.', 'First the opening title, then the name, then the closing one.'),
  lineNoName: L3('Teglar joyida, orasi esa bo‘sh. Sahifa nomini yozing.', 'Теги на месте, а между ними пусто. Напиши название страницы.', 'The tags are in place, but there is nothing between them. Write the page name.'),
  lineWrongName: L3('Teglar joyida! Nomni tekshiring: «{name}» kerak.', 'Теги на месте! Проверь название: нужно «{name}».', 'The tags are right! Check the name: it should be “{name}”.'),
  // Блок body (t5)
  blockEmpty: L3('Bu yer hozircha bo‘sh. Matnli body qismini yozing.', 'Здесь пока пусто. Напиши часть body с текстом.', 'It is empty here so far. Write a body part with text.'),
  blockTextOnly: L3('Matn bor, lekin unga o‘z qismi kerak. Uni body ichiga qo‘ying.', 'Текст есть, но ему нужна своя часть. Поставь его внутрь body.', 'The text is there, but it needs its own part. Put it inside body.'),
  blockWrongTag: L3('Oynadagi matnni body ichiga yozamiz, bu yerda esa {tag} turibdi.', 'Текст для окна пишем в body, а здесь стоит {tag}.', 'Text for the window goes in body, but here you have {tag}.'),
  blockOrder: L3('Avval ochuvchi body, keyin matn, keyin yopuvchi body.', 'Сначала открывающий body, потом текст, потом закрывающий body.', 'First the opening body, then the text, then the closing body.'),
  // Один закрывающий тег (t6)
  pickFirst: L3('Avval {tag} qayerda tugashi kerakligini bosing.', 'Сначала нажми место, где должен закончиться {tag}.', 'First tap the place where {tag} should end.'),
  closeEmpty: L3('Qator hozircha bo‘sh. Bu yerga yopuvchi {tag} tegini yozing.', 'Строка пока пустая. Напиши здесь закрывающий тег {tag}.', 'The line is empty so far. Type the closing {tag} tag here.'),
  closeOther: L3('Bu yerda {tag} tugaydi, shuning uchun yopuvchi {tag} kerak.', 'Здесь заканчивается {tag}, поэтому нужен закрывающий {tag}.', '{tag} ends here, so you need a closing {tag}.'),
  closeText: L3('Bu qatorga faqat teg yoziladi, matn kerak emas.', 'В этой строке нужен только тег, без текста.', 'This line needs only the tag, no text.'),
  closeOne: L3('Bitta yopuvchi {tag} yetarli.', 'Достаточно одного закрывающего {tag}.', 'One closing {tag} is enough.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ ЭКРАНОВ. Реплики (say, cast, hints, praise, done, msgs …) звучат;
// подписи (eyebrow, order, plan …) только печатаются.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Хук: улица целая → касание «Ветер!» → дома выцветают и косятся, вывески улетают.
  intro: {
    eyebrow: L3('Qog‘oz ko‘cha', 'Бумажная улица', 'Paper Street'),
    say: L3('Bu qog‘oz ko‘cha. Undagi har bir uy veb-sahifa: yorliqda nomi, oynada matni.',
      'Это бумажная улица. Каждый дом на ней — веб-страница: на вкладке название, в окне текст.',
      'This is Paper Street. Every house on it is a web page: the name on the tab, the text in the window.'),
    blown: L3('Voy, qarang! Shamol uylarning nomlari, matnlari va kod bo‘laklarini uchirib ketdi.',
      'Ой! Ветер унёс у домов названия, тексты и куски кода.',
      'Oh no! The wind blew away the houses’ names, texts and pieces of code.'),
    plan: L3('To‘rtta uyni kod bilan tuzatamiz, beshinchisini esa o‘zingiz qurasiz. Har bir topshiriq oldingisidan biroz qiyinroq.',
      'Починим четыре дома кодом, а пятый ты построишь сам. Каждое задание чуть сложнее прошлого.',
      'We’ll fix four houses with code, and you’ll build the fifth yourself. Each task is a bit harder than the last.'),
    ask: L3('«Shamol!» tugmasini bosing', 'Нажми «Ветер!»', 'Tap “Wind!”'),
    order: L3('To‘rtta uyni tuzating, beshinchisini o‘zingiz quring. Kodni siz yozasiz.',
      'Почини четыре дома, а пятый построй сам. Код пишешь ты.',
      'Fix four houses and build the fifth yourself. You write the code.'),
    note: L3('Sahifasi tayyor bo‘lgan uy yonadi. Jarima yo‘q: xohlagancha tekshiring.',
      'Дом загорается, когда его страница готова. Штрафов нет — проверяй сколько хочешь.',
      'A house lights up when its page is ready. No penalties: check as often as you like.')
  },

  // 1 · самое лёгкое: слово между готовыми тегами.
  t1: {
    order: L3('Novvoyxonaga nom o‘ylab toping va uni title ichiga yozing',
      'Придумай пекарне название и напиши его внутри title',
      'Make up a name for the bakery and type it inside title'),
    say: L3('Bu novvoyxona sahifasi. Yorliqda faqat index.html turibdi, chunki sahifaning nomi yo‘q. Nom o‘ylab toping va uni title ichiga yozing.',
      'Это страница пекарни. На вкладке только index.html: у страницы нет названия. Придумай его и напиши внутри title.',
      'This is the bakery’s page. The tab only says index.html: the page has no name. Make one up and type it inside title.'),
    hints: [
      L3('Sahifa nomi brauzer yorlig‘ida ko‘rinadi. Qaysi teg bunga javob beradi?',
        'Название страницы видно на вкладке браузера. Какой тег за него отвечает?',
        'The page name shows on the browser tab. Which tag is in charge of it?'),
      L3('head ichiga qarang: u yerda title qatori bor.', 'Посмотри внутрь head: там есть строка title.', 'Look inside head: there is a title line.'),
      L3('title teglari orasidagi bo‘sh joyni bosing va nom yozing. Masalan: Issiq non.',
        'Нажми на пустое место между тегами title и напиши название. Например: Тёплый хлеб.',
        'Tap the empty space between the title tags and type a name. For example: Warm Bread.')
    ],
    praise: L3('To‘g‘ri! Nom yorliqda chiqdi. Novvoyxona ochildi.', 'Есть! Название на вкладке — пекарня открылась.', 'Yes! The name is on the tab, and the bakery is open.'),
    done: L3('Novvoyxonaning nomi bor.', 'У пекарни уже есть название.', 'The bakery already has a name.'),
    drill: L3('Bu sahifaga ham nom bering: uni title ichiga yozing.', 'Дай название и этой странице: напиши его внутри title.', 'Name this page too: type the name inside title.')
  },

  // 2 · один тег: дописать </title>.
  t2: {
    order: L3('Qator oxiriga yopuvchi title tegini yozing', 'Допиши в конце строки закрывающий тег title', 'Add the closing title tag at the end of the line'),
    say: L3('Qarang: pochta sahifasining hamma matni yorliqqa chiqib ketdi. title boshlangan, lekin yopilmagan. Qator oxiriga yopuvchi title tegini yozing.',
      'Смотри: весь текст почты уехал на вкладку. title начался, но не закрылся. Допиши в конце строки закрывающий тег title.',
      'Look: all the post office text ended up on the tab. title started but never closed. Add the closing title tag at the end of the line.'),
    hints: [
      L3('Nom boshlandi, lekin tugamadi. Qator oxirida nima yetishmayapti?',
        'Название началось, но не закончилось. Чего не хватает в конце строки?',
        'The name started but didn’t end. What is missing at the end of the line?'),
      L3('Yopuvchi teg ochuvchisi bilan bir xil so‘z. Faqat chap «<» qavsdan keyin qiya chiziq «/» turadi.',
        'Закрывающий тег — то же слово, только после уголка «<» стоит косая черта «/».',
        'A closing tag is the same word, just with a slash “/” after the bracket “<”.'),
      L3('Mana boshqa teg qanday yopiladi. title ni ham shunday yoping.', 'Вот как закрывается другой тег. title закрой так же.', 'Here is how another tag closes. Close title the same way.')
    ],
    praise: L3('To‘g‘ri! title yopildi, matn yana oynaga qaytdi.', 'Есть! title закрылся, и текст вернулся в окно.', 'Yes! title is closed, and the text is back in the window.'),
    done: L3('Pochta sahifasi joyida.', 'Страница почты в порядке.', 'The post office page is fine.'),
    drill: L3('Bu yerda ham title yopilmagan. Qator oxiriga yopuvchi tegni yozing.', 'И здесь title не закрыт. Допиши закрывающий тег в конце строки.', 'title isn’t closed here either. Add the closing tag at the end of the line.')
  },

  // 3 · блок из трёх строк: body со своим текстом.
  t3: {
    order: L3('body qismini yozing: bugun kinoda nima bor?', 'Напиши часть body: что сегодня в кино?', 'Write the body part: what’s on at the cinema today?'),
    say: L3('Kinoteatr oynasi bo‘m-bo‘sh, chunki body qismi yo‘q. Uni o‘zingiz yozing: ochuvchi body, matn va yopuvchi body.',
      'Окно кинотеатра пустое: части body нет. Напиши её: открывающий body, текст и закрывающий body.',
      'The cinema window is empty: there is no body part. Write it: the opening body, the text and the closing body.'),
    empty: L3('Matn shu yerda chiqadi', 'Здесь появится текст', 'The text will appear here'),
    hints: [
      L3('Oynadagi matn hujjatning o‘z qismida turadi. U teg bilan boshlanib, teg bilan tugaydi.',
        'Текст в окне стоит в своей части документа. Она начинается тегом и заканчивается тегом.',
        'Window text sits in its own part of the document. It starts with a tag and ends with a tag.'),
      L3('Bu qism body. U head dan keyin boshlanadi va html yopilishidan oldin tugaydi.',
        'Это часть body. Она начинается после head и заканчивается до закрытия html.',
        'This part is body. It starts after head and ends before html closes.'),
      L3('Mana boshqa matnli namuna. Kinoteatr uchun ham shunday yozing.', 'Вот образец с другим текстом. Для кинотеатра напиши так же.', 'Here’s a sample with other text. Write the cinema one the same way.')
    ],
    praise: L3('To‘g‘ri! Matn oynada. Kinoteatr ochildi.', 'Верно! Текст в окне — кинотеатр открыт.', 'Right! The text is in the window, and the cinema is open.'),
    done: L3('Kinoteatr oynasida matn bor.', 'В окне кинотеатра уже есть текст.', 'The cinema window already has text.'),
    drill: L3('Basseyn oynasi ham bo‘sh. Unga matnli body yozing.', 'Окно бассейна тоже пустое. Напиши для него body с текстом.', 'The pool window is empty too. Write it a body with text.')
  },

  // 4 · найти место в чужом коде и дописать </head>.
  t4: {
    order: L3('head qayerda tugashi kerakligini bosing', 'Нажми место, где должен закончиться head', 'Tap the place where head should end'),
    order2: L3('Shu joyga yopuvchi head tegini yozing', 'Напиши здесь закрывающий тег head', 'Type the closing head tag here'),
    say: L3('Maktab sahifasida head ochilgan, lekin yopilmagan: chap tomondagi chizig‘i punktir. Avval head qayerda tugashi kerakligini bosing.',
      'В странице школы head открыт, но не закрыт: его полоска слева — пунктиром. Сначала нажми место, где head должен закончиться.',
      'On the school page head is opened but not closed: its bar on the left is dashed. First tap the place where head should end.'),
    picked: L3('To‘g‘ri joy! Endi shu yerga yopuvchi head tegini yozing.', 'Верное место! Теперь напиши здесь закрывающий тег head.', 'Right spot! Now type the closing head tag here.'),
    miss: {
      before: L3('Bu yerda head hali boshlanmagan.', 'Здесь head ещё не начался.', 'head hasn’t started here yet.'),
      inside: L3('head endi boshlandi: uning ichida hali title bor.', 'head только начался: внутри него ещё title.', 'head has just started: title is still inside it.'),
      after: L3('Bu yerda body boshlangan. head esa body dan oldin tugashi kerak.', 'Здесь уже идёт body. А head должен закончиться до начала body.', 'body has already started here. head must end before body begins.')
    },
    hints: [
      L3('head nima bilan tugashini tekshiring. U qayerda tugashi kerak?', 'Проверь, чем заканчивается head. Где он должен закончиться?', 'Check how head ends. Where should it end?'),
      L3('head body boshlanishidan oldin tugaydi. title esa head ichida qoladi.', 'head заканчивается до начала body. А title остаётся внутри head.', 'head ends before body starts. title stays inside head.'),
      L3('title qatoridan keyingi joyni bosing va u yerga yopuvchi head yozing.', 'Нажми место после строки title и напиши там закрывающий head.', 'Tap the place after the title line and type the closing head there.')
    ],
    praise: L3('To‘g‘ri! head yopildi, chizig‘i ham butun bo‘ldi.', 'Есть! head закрыт — полоска стала сплошной.', 'Yes! head is closed, and its bar is solid now.'),
    done: L3('Maktab sahifasida head yopiq.', 'В странице школы head уже закрыт.', 'On the school page head is already closed.'),
    drill: L3('Bu yerda body yopilmagan. U qayerda tugashini bosing va yopuvchi tegni yozing.', 'А здесь не закрыт body. Нажми, где он заканчивается, и допиши закрывающий тег.', 'Here body isn’t closed. Tap where it ends and type the closing tag.'),
    drill2: L3('Shu joyga yopuvchi body tegini yozing', 'Напиши здесь закрывающий тег body', 'Type the closing body tag here'),
    drillMiss: {
      before: L3('Bu yerda body hali boshlanmagan.', 'Здесь body ещё не начался.', 'body hasn’t started here yet.'),
      inside: L3('body hali davom etyapti: pastda uning matni bor.', 'body ещё продолжается: ниже его текст.', 'body still goes on: its text is below.')
    }
  },

  // 5 · самое сложное, но посильное: внутри готового html — head с title и body с текстом.
  t5: {
    order: L3('html ichiga ikki qism yozing: nomli title bilan head, keyin matnli body',
      'Внутри html напиши две части: head с title и body с текстом',
      'Inside html, write two parts: head with title, then body with text'),
    say: L3('Ko‘cha tuzaldi! Endi o‘z uyingiz. html ramkasi tayyor. Uning ichiga head va title bilan uy nomini, keyin body va matnni yozing.',
      'Улица починена! Теперь твой дом. Рамка html уже есть. Внутри напиши head с title — это название дома, а потом body с текстом.',
      'The street is fixed! Now your house. The html frame is ready. Inside it, write head with title for the house name, then body with text.'),
    hints: [
      L3('html ichida ikki qism bo‘ladi: avval head, keyin body.', 'Внутри html две части: сначала head, потом body.', 'Inside html there are two parts: first head, then body.'),
      L3('head ichida title qatori bo‘ladi. head yopilgach body ochiladi va html tugashidan oldin yopiladi.',
        'В head — строка title. Когда head закрыт, открывается body, и он закрывается до конца html.',
        'Inside head goes the title line. After head closes, body opens and closes before html ends.'),
      L3('Mana boshqa uyda bu qanday ko‘rinadi. O‘zingiznikini ham shunday yozing.', 'Вот как это выглядит у другого дома. Свою часть напиши так же.', 'Here is how it looks for another house. Write yours the same way.')
    ],
    praise: L3('Uyingiz qurildi! Uning sahifasini o‘zingiz yozdingiz.', 'Дом построен! Его страница написана твоими руками.', 'Your house is built! You wrote its page yourself.'),
    done: L3('Uyingiz qurilgan.', 'Твой дом уже построен.', 'Your house is already built.'),
    drill: L3('Ustaxona uchun body yozing: u yerda nima qilinadi?', 'Напиши body для мастерской: что там делают?', 'Write a body for the workshop: what happens there?')
  },

  // Подсказка 2 своего дома — по той части, где сейчас затруднение.
  house: {
    hint2: {
      html: L3('html juftini tekshiring: ochuvchi html birinchi qatordan keyin, yopuvchisi eng oxirida.', 'Проверь пару html: открывающий — после первой строки, закрывающий — в самом конце.', 'Check the html pair: the opening one after the first line, the closing one at the very end.'),
      head: L3('head juftini tekshiring: u html ichida, title esa uning ichida.', 'Проверь пару head: она внутри html, а title — внутри неё.', 'Check the head pair: it is inside html, and title is inside it.'),
      body: L3('body juftini tekshiring: u head dan keyin ochiladi va html tugashidan oldin yopiladi.', 'Проверь пару body: она открывается после head и закрывается до конца html.', 'Check the body pair: it opens after head and closes before html ends.'),
      tag: L3('Teglar qanday yozilganini tekshiring: qavslar, qiya chiziq va harflar.', 'Проверь, как написаны теги: уголки, косая черта и буквы.', 'Check how the tags are written: brackets, slash and letters.')
    }
  },

  drill: {
    say: L3('Chiqdi! Endi yana bir marta, yangi matn bilan.', 'Получилось! Теперь ещё раз, с новым текстом.', 'You did it! Now once more, with new text.'),
    done: L3('Yangi matn bilan ham chiqdi. Endi bu sizning qo‘lingizda.', 'И с новым текстом получилось. Теперь это точно твоё.', 'It worked with new text too. Now it’s really yours.')
  },

  fin: {
    eyebrow: L3('Ko‘cha yana tirik', 'Улица снова живая', 'The street is alive again'),
    say: L3('Tabriklayman! Ko‘cha yana tirik. Oxirgi uy esa sizniki: uning sahifasini o‘zingiz yozdingiz.',
      'Ура! Улица снова живая. А последний дом — твой: его страница целиком твоя.',
      'Hooray! The street is alive again. And the last house is yours: you wrote its page yourself.'),
    skills: [
      L3('title ichiga sahifa nomini yozaman', 'Пишу название страницы в title', 'I write the page name in title'),
      L3('Yopuvchi tegni yozaman', 'Пишу закрывающий тег', 'I write a closing tag'),
      L3('Matnli body yozaman', 'Пишу body с текстом', 'I write body with text'),
      L3('head qayerda tugashini topaman', 'Нахожу, где заканчивается head', 'I find where head ends'),
      L3('head va body bilan sahifa yozaman', 'Пишу страницу из head и body', 'I write a page with head and body')
    ]
  }
};

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:p01-engine.jsx@*/

/*@FILE:p01-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:p01.css@*/
`;
