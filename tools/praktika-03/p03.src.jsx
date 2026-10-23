// =============================================================================
// КУРС «HTML» · Модуль 1 · Практика к уроку 3 — «Походный блокнот». Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/praktika-03/p03.src.jsx lessons/html/03p-spiski.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА К УРОКУ 3 · «Походный блокнот» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (22.10.2026; каркас и вид — практики 01p и 02p, бумажный стиль урока 1).
// Продолжение похода из урока 3: в блокноте Коди пять привалов на тропе, у
// каждого свой список. В хуке ученик нажимает «Дождь!» — дождь размывает теги
// у списков. Ученик восстанавливает четыре списка и пишет свой пятый.
//
// СЕМЬ СЛАЙДОВ (заказчик, 22.10.2026): хук · пять заданий от лёгкого к сложному,
// у каждого своя механика:
//   t1 рюкзак — дописать новый пункт <li>компас</li> в готовый список (строка);
//   t2 тропа — шаги маршрута в ul: поменять оба тега на ol (правка в двух местах);
//   t3 привал — строку «шапка, вода, карта» превратить в список ul (из текста — в структуру);
//   t4 палатка — найти и починить два сломанных пункта (текст без li, <li> вместо
//      </li>); счётчик «осталось исправить»;
//   t5 свой список — с нуля: название h1 (урок 2) и список с тремя пунктами, по живому
//      списку условий.
// Только материал уроков 1–3: готовые head и body вокруг кода, h1, ul, ol, li.
//
// ОСОБЫЕ ПРАВИЛА (как в 01p и 02p): Коди — голова в кружке в шапке, без облака с
// текстом; пишет ученик; проверка по «Проверить» (одна причина, со второй неудачи
// — ступень подсказки); три ступени по лампочке, после образца — ещё одна задача;
// браузер честный и без прокрутки; код не исполняется; конфетти только в финале.
// =============================================================================
const META = {
  lessonId: 'html-03p-pohodnyy-bloknot',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '3-dars amaliyoti. Sayohat daftari',
    ru: 'Практика к уроку 3. Походный блокнот',
    en: 'Lesson 3 practice. The trip notebook'
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
// ТРОПА — пять привалов. Задание n восстанавливает список привала n; последний —
// список ученика. ol: true — у привала список с номерами (на карте — цифры).
// ─────────────────────────────────────────────────────────────────────────────
const STREET = [
  { id: 'pack',  c: '#2A8C7E', name: L3('Ryukzak', 'Рюкзак', 'Backpack') },
  { id: 'trail', c: '#F0B13F', ol: true, name: L3('So‘qmoq', 'Тропа', 'Trail') },
  { id: 'rest',  c: '#E0643F', name: L3('Dam olish', 'Привал', 'Rest stop') },
  { id: 'tent',  c: '#5E8FB8', ol: true, name: L3('Chodir', 'Палатка', 'Tent') },
  { id: 'mine',  c: '#1F2A44', name: L3('Sizning ro‘yxatingiz', 'Твой список', 'Your list') }
];
const HOME = STREET.length - 1;

// Содержимое списков и дополнительных задач.
const TXT = {
  hike: L3('Sayohat', 'Поход', 'Trip'),
  packH: L3('Ryukzakda', 'В рюкзаке', 'In the backpack'),
  pack: [L3('fonar', 'фонарик', 'flashlight'), L3('suv', 'вода', 'water')],
  add: L3('kompas', 'компас', 'compass'),
  pack2: [L3('qalpoq', 'шапка', 'hat'), L3('choynak', 'чайник', 'kettle')],
  add2: L3('xarita', 'карта', 'map'),
  sample1: L3('qalpoq', 'шапка', 'hat'),
  routeH: L3('Yo‘l', 'Маршрут', 'Route'),
  route: [L3('Lagerdan chiqing', 'Выйди из лагеря', 'Leave the camp'), L3('Ko‘prikdan o‘ting', 'Перейди мостик', 'Cross the bridge'), L3('Tepalikka chiqing', 'Поднимись на холм', 'Climb the hill')],
  sandH: L3('Buterbrod', 'Бутерброд', 'Sandwich'),
  sand: [L3('Non oling', 'Возьми хлеб', 'Take some bread'), L3('Pishloq qo‘ying', 'Положи сыр', 'Add cheese'), L3('Non bilan yoping', 'Накрой хлебом', 'Cover with bread')],
  restH: L3('Dam olishga', 'На привал', 'For the rest stop'),
  rest: [L3('qalpoq', 'шапка', 'hat'), L3('suv', 'вода', 'water'), L3('xarita', 'карта', 'map')],
  gamesH: L3('O‘yinlar', 'Игры', 'Games'),
  games: [L3('to‘p', 'мяч', 'ball'), L3('arqon', 'скакалка', 'jump rope')],
  sample3: [L3('non', 'хлеб', 'bread'), L3('pishloq', 'сыр', 'cheese')],
  tentH: L3('Chodir', 'Палатка', 'Tent'),
  tent: [L3('Chodirni yoying', 'Расстели палатку', 'Spread out the tent'), L3('Qoziqlarni qoqing', 'Вбей колышки', 'Drive in the pegs'), L3('Arqonlarni torting', 'Натяни верёвки', 'Pull the ropes')],
  dishH: L3('Idishlar', 'Посуда', 'Dishes'),
  dish: [L3('krujka', 'кружка', 'mug'), L3('qoshiq', 'ложка', 'spoon'), L3('kosa', 'миска', 'bowl')],
  books: L3('Kitoblarim', 'Мои книги', 'My books'),
  booksL: [L3('ertaklar', 'сказки', 'fairy tales'), L3('sarguzashtlar', 'приключения', 'adventures'), L3('fantastika', 'фантастика', 'sci-fi')]
};

// Подписи интерфейса практики. up, down, mySite, hello, play нужны бумажному набору.
const UI = {
  task: L3('{n}-topshiriq', 'Задание {n}', 'Task {n}'),
  houseOf: L3('{n}/5-to‘xtash', 'Привал {n} из 5', 'Stop {n} of 5'),
  map: L3('Sayohat xaritasi', 'Карта похода', 'Trip map'),
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
  rain: L3('Yomg‘ir!', 'Дождь!', 'Rain!'),
  target: L3('Brauzerda shunday bo‘ladi', 'Как должно быть', 'How it should look'),
  left: L3('Tuzatish kerak: {n}', 'Осталось исправить: {n}', 'Left to fix: {n}'),
  allFixed: L3('Hammasi tuzatildi', 'Всё исправлено', 'All fixed'),
  needH1: L3('h1 — ro‘yxat nomi', 'h1 — название', 'h1 — the list name'),
  needList: L3('ul yoki ol — ro‘yxat', 'ul или ol — список', 'ul or ol — the list'),
  need3: L3('kamida 3 ta li band', 'хотя бы 3 пункта li', 'at least 3 li items'),
  needClosed: L3('hamma teglar yopilgan', 'все теги закрыты', 'all tags are closed'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Havolalar', 'Ссылки', 'Links'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  mySite: L3('Mening ro‘yxatim', 'Мой список', 'My list'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play')
};

// ─────────────────────────────────────────────────────────────────────────────
// ОБРАТНАЯ СВЯЗЬ ПРОВЕРКИ. Одна проблема — одна короткая фраза: что не так и
// что сделать. Без «ошибка», «неправильно», «xato», «noto‘g‘ri».
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  // Запись тегов, пары и порядок (разбор фрагмента — checkFrag)
  pairMismatch: L3('{a} tegi </{b}> bilan yopilgan. Juft bir xil bo‘lishi kerak: </{a}>.', '{a} закрыт тегом </{b}>. Пара должна совпадать: </{a}>.', '{a} is closed with </{b}>. The pair must match: </{a}>.'),
  unclosedIn: L3('{tag} hali yopilmagan, {next} esa allaqachon tugayapti.', '{tag} ещё не закрыт, а {next} уже заканчивается.', '{tag} isn’t closed yet, but {next} is already ending.'),
  blockInBlock: L3('{tag} hali tugamadi, {next} esa boshlanyapti. Avval {tag} ni yoping.', '{tag} ещё не закончился, а {next} уже начинается. Сначала закрой {tag}.', '{tag} hasn’t ended, but {next} is already starting. Close {tag} first.'),
  inlineOutside: L3('{tag} so‘z atrofiga qo‘yiladi: xatboshi yoki sarlavha ichida.', '{tag} ставят вокруг слова — внутри абзаца или заголовка.', '{tag} goes around a word, inside a paragraph or a heading.'),
  textOutside: L3('Matn teglardan tashqarida turibdi. Uni o‘z tegiga qo‘ying: nom h1 ga, band li ga.', 'Текст стоит снаружи тегов. Поставь его в свой тег: название — в h1, пункт — в li.', 'The text is outside the tags. Put it in its tag: the list name in h1, an item in li.'),
  noGt: L3('{tag} tegi oxirida o‘ng «>» qavs yetishmayapti.', 'У тега {tag} в конце не хватает уголка «>».', 'The {tag} tag is missing the bracket “>” at the end.'),
  noLt: L3('{tag} oldida chap «<» qavs yetishmayapti.', 'Перед {tag} не хватает уголка «<».', 'The bracket “<” is missing before {tag}.'),
  unknown: L3('«{raw}» tegida harflar adashgan: {tag} kerak.', 'В теге «{raw}» перепутаны буквы: нужно {tag}.', 'The letters in “{raw}” are mixed up: it should be {tag}.'),
  unknownFar: L3('«{raw}» tegi bizga notanish. Bizda h1–h6, p, b, i, ul, ol va li teglari bor.', 'Тег «{raw}» нам не знаком. У нас есть теги h1–h6, p, b, i, ul, ol и li.', 'We don’t know the tag “{raw}”. We have the tags h1–h6, p, b, i, ul, ol and li.'),
  slashEnd: L3('Qiya chiziq boshqa joyda turibdi. Yopuvchi tegda u chap «<» qavsdan keyin keladi: </{tag}>.', 'Косая черта стоит не там. В закрывающем теге она идёт сразу после уголка «<»: </{tag}>.', 'The slash is in the wrong spot. In a closing tag it goes right after the bracket “<”: </{tag}>.'),
  backslash: L3('Yopuvchi tegda qiya chiziq «/» turadi, bu yerda esa teskari «\\» chiziq.', 'В закрывающем теге нужна косая черта «/», а здесь обратная «\\».', 'A closing tag needs a slash “/”, but here it is a backslash “\\”.'),
  junk: L3('Qavslar ichiga faqat teg nomini yozamiz, matn esa tashqarida turadi.', 'Внутри уголков пишем только имя тега, а текст — снаружи.', 'Inside the brackets we write only the tag name; the text goes outside.'),
  emptyTag: L3('Bu yerda bo‘sh qavslar. Ichida teg nomi bo‘lishi kerak.', 'Здесь пустые уголки. Внутри должно быть имя тега.', 'These brackets are empty. A tag name goes inside.'),
  openAgain: L3('Bu yerda ochuvchi {tag} yozilgan. Yopuvchi tegga qiya chiziq kerak.', 'Здесь написан открывающий {tag}. Закрывающему тегу нужна косая черта.', 'This is an opening {tag}. The closing tag needs a slash.'),
  unclosedEnd: L3('{tag} nima bilan tugashini tekshiring: yopuvchi teg yo‘q.', 'Проверь, чем заканчивается {tag}: закрывающего тега нет.', 'Check how {tag} ends: there is no closing tag.'),
  closeWithoutOpen: L3('Bu yerda yopuvchi {tag} bor, ochuvchisi esa yo‘q.', 'Здесь закрывающий {tag}, а открывающего нет.', 'There is a closing {tag} here, but no opening one.'),
  textSame: L3('Teglar joyida! Faqat so‘zlar o‘zgarib qoldi: teglarni tuzatamiz, matnni esa avvalgidek qoldiramiz.', 'Теги в порядке! Только слова изменились: чиним теги, а текст оставляем как был.', 'The tags are fine! Only the words changed: we fix the tags and leave the text as it was.'),
  headEmpty: L3('Sarlavha teglari joyida, ichi esa bo‘sh. Maqola nomini yozing.', 'Теги заголовка на месте, а внутри пусто. Напиши название статьи.', 'The heading tags are in place, but empty. Write the article name.'),
  // Списки (урок 3)
  listText: L3('Ro‘yxatda matn li siz turibdi: unda nuqta ham, raqam ham yo‘q. Uni li ga o‘rang.', 'В списке текст стоит без li — у него нет ни точки, ни номера. Оберни его в li.', 'There’s text in the list without li: it gets no dot or number. Wrap it in li.'),
  liOutside: L3('li faqat ul yoki ol ichida yoziladi, bu esa ro‘yxatdan tashqarida turibdi.', 'li пишут только внутри ul или ol, а этот стоит снаружи списка.', 'li goes only inside ul or ol, but this one is outside the list.'),
  listNotClosed: L3('{tag} ro‘yxati hali yopilmagan, {next} esa boshlanyapti. Avval ro‘yxatni yoping.', 'Список {tag} ещё не закрыт, а {next} уже начинается. Сначала закрой список.', 'The {tag} list isn’t closed yet, but {next} is already starting. Close the list first.'),
  // t1 — новый пункт
  needLi: L3('Band li jufti ichida yoziladi: ochuvchi li, so‘z, yopuvchi li.', 'Пункт пишут в паре li: открывающий li, слово, закрывающий li.', 'An item goes in an li pair: the opening li, the word, the closing li.'),
  notLi: L3('Bu yerga ro‘yxat bandi kerak: {tag} emas, li.', 'Здесь нужен пункт списка: не {tag}, а li.', 'This needs a list item: li, not {tag}.'),
  oneItem: L3('Bitta band qo‘shing: bitta li jufti.', 'Добавь один пункт — одну пару li.', 'Add one item: one li pair.'),
  wordSame: L3('Teglar joyida! So‘zni tekshiring: «{w}» kerak.', 'Теги на месте! Проверь слово: нужно «{w}».', 'The tags are right! Check the word: it should be “{w}”.'),
  // t2 — ul → ol
  stillUl: L3('Hozir bu ul, ya’ni nuqtalar. Tartib bilan boriladigan qadamlarga ol kerak.', 'Сейчас это ul — точки. Для шагов по порядку нужен ol.', 'Right now it’s ul: dots. Steps in order need ol.'),
  itemsSame: L3('Teg to‘g‘ri! Faqat qadamlar o‘zgarib qoldi: ularni avvalgidek qoldiring.', 'Тег верный! Только шаги изменились — оставь их как были.', 'The tag is right! Only the steps changed: leave them as they were.'),
  noList: L3('Ro‘yxat yo‘qolib qoldi. Qadamlar ro‘yxat ichida, har biri o‘z li ida bo‘lsin.', 'Список пропал. Шаги должны стоять в списке, каждый в своём li.', 'The list is gone. The steps should be in a list, each in its own li.'),
  // t3 — из строки в список
  needUl: L3('Nuqtali ro‘yxat kerak: ul, uning ichida li bandlari.', 'Нужен список с точками: ul, а внутри — пункты li.', 'You need a list with dots: ul, with li items inside.'),
  notOl: L3('Narsalar tartibi muhim emas: bu yerga ol emas, ul kerak.', 'Порядок вещей не важен — здесь нужен ul, а не ol.', 'The order of things doesn’t matter: this needs ul, not ol.'),
  countN: L3('Bandlar {n} ta bo‘lishi kerak: har bir narsaga bittadan.', 'Пунктов должно быть {n} — по одному на каждую вещь.', 'There should be {n} items, one for each thing.'),
  leftText: L3('Satrda hali so‘zlar qoldi. Har bir narsa o‘z li ida bo‘lsin, p satrini esa o‘chiring.', 'В строке ещё остались слова. Каждая вещь — в своём li, а строку p сотри.', 'There are still words in the line. Each thing goes in its own li; delete the p line.'),
  itemsWrong: L3('Ro‘yxat tayyor! Bandlarni tekshiring: ularda {list} bo‘lishi kerak.', 'Список готов! Проверь пункты: в них должны быть {list}.', 'The list is ready! Check the items: they should be {list}.'),
  // t4 — починить пункты
  keepList: L3('Bandlar tuzaldi! Faqat avvalgidek qaytaring: {tag} ro‘yxati va o‘sha qadamlar.', 'Пункты починены! Только верни как было: список {tag} и те же шаги.', 'The items are fixed! Just keep it as it was: a {tag} list with the same steps.'),
  // t5 — свой список
  artEmpty: L3('Hozircha bo‘sh. Ro‘yxat nomini h1 ga yozishdan boshlang.', 'Пока пусто. Начни с названия списка в h1.', 'It’s empty so far. Start with the list name in h1.'),
  needH1: L3('Tepaga h1 sarlavha kerak: ro‘yxatingiz nomi.', 'Сверху нужен заголовок h1 — название твоего списка.', 'You need an h1 heading on top: your list’s name.'),
  needList: L3('Sarlavha ostiga ro‘yxat kerak: ul yoki ol.', 'Под заголовком нужен список: ul или ol.', 'Under the heading you need a list: ul or ol.'),
  needItems: L3('Ro‘yxatda kamida uchta matnli li bandi bo‘lsin.', 'В списке нужно хотя бы три пункта li с текстом.', 'The list needs at least three li items with text.'),
  needOl: L3('Qadamlar uchun raqamli ro‘yxat kerak: ol.', 'Для шагов нужен список с номерами — ol.', 'Steps need a numbered list: ol.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ ЭКРАНОВ. Реплики (say, hints, praise, done …) звучат; подписи
// (eyebrow, order, ask, note, empty …) только печатаются.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Хук: тропа целая → касание «Дождь!» → флажки выцветают, капли смывают теги.
  intro: {
    eyebrow: L3('Sayohat daftari', 'Походный блокнот', 'Trip notebook'),
    say: L3('Bu mening sayohat daftarim: so‘qmoq bo‘yida beshta to‘xtash joyi, har birida o‘z ro‘yxati bor.',
      'Это мой походный блокнот: пять привалов на тропе, у каждого свой список.',
      'This is my trip notebook: five stops on the trail, each with its own list.'),
    blown: L3('Voy! Yomg‘ir yog‘di va ro‘yxatlarning teglarini yuvib ketdi.', 'Ой! Пошёл дождь и размыл теги у списков.', 'Oh no! Rain came and washed the tags off the lists.'),
    plan: L3('To‘rtta ro‘yxatni kod bilan tiklaymiz, beshinchisini esa o‘zingiz yozasiz. Har bir topshiriq oldingisidan biroz qiyinroq.',
      'Восстановим четыре списка кодом, а пятый ты напишешь сам. Каждое задание чуть сложнее прошлого.',
      'We’ll restore four lists with code, and you’ll write the fifth yourself. Each task is a bit harder than the last.'),
    ask: L3('«Yomg‘ir!» tugmasini bosing', 'Нажми «Дождь!»', 'Tap “Rain!”'),
    order: L3('To‘rtta ro‘yxatni tiklang, beshinchisini o‘zingiz yozing. Kodni siz yozasiz.', 'Восстанови четыре списка, а пятый напиши сам. Код пишешь ты.', 'Restore four lists and write the fifth yourself. You write the code.'),
    note: L3('Ro‘yxati tayyor bo‘lgan to‘xtash joyi yonadi. Jarima yo‘q: xohlagancha tekshiring.', 'Привал загорается, когда его список готов. Штрафов нет — проверяй сколько хочешь.', 'A stop lights up when its list is ready. No penalties: check as often as you like.')
  },

  // 1 · самое лёгкое: один новый пункт в готовом списке.
  t1: {
    order: L3('Ro‘yxatga yana bitta band qo‘shing: kompas', 'Добавь в список ещё один пункт: компас', 'Add one more item to the list: compass'),
    say: L3('Ryukzakka kompas ham kerak. Bo‘sh qatorga uni yangi band qilib yozing: li ichida.', 'В рюкзак нужен ещё компас. Напиши его в пустой строке новым пунктом — внутри li.', 'The backpack needs a compass too. Type it on the empty line as a new item, inside li.'),
    hints: [
      L3('Ro‘yxatning har bir bandi alohida teglar juftida. Band tegi qaysi?', 'Каждый пункт списка — отдельная пара тегов. Какой тег у пункта?', 'Each list item is its own pair of tags. Which tag is an item?'),
      L3('Bu li: ochuvchi li, so‘z va qiya chiziqli yopuvchi li.', 'Это li: открывающий li, слово и закрывающий li с косой чертой.', 'It’s li: the opening li, the word and the closing li with a slash.'),
      L3('Mana boshqa band qanday yoziladi. Kompasni ham shunday yozing.', 'Вот как пишется другой пункт. Компас напиши так же.', 'Here’s how another item is written. Write the compass the same way.')
    ],
    praise: L3('To‘g‘ri! Kompas oldida nuqta paydo bo‘ldi.', 'Есть! Перед компасом появилась точка.', 'Yes! A dot appeared before the compass.'),
    done: L3('Ryukzak ro‘yxati tayyor.', 'Список рюкзака уже готов.', 'The backpack list is ready.'),
    drill: L3('Bu ro‘yxatga xaritani qo‘shing: yangi li bandi.', 'Добавь в этот список карту — новым пунктом li.', 'Add a map to this list as a new li item.')
  },

  // 2 · правка в двух местах: ul → ol.
  t2: {
    order: L3('Yo‘l qadamlarini raqamli ro‘yxat qiling', 'Сделай шаги маршрута списком с номерами', 'Make the route steps a numbered list'),
    say: L3('Bu so‘qmoq bo‘ylab yo‘l. Qadamlar tartib bilan bajariladi, lekin ro‘yxat nuqtali. Uni raqamli qiling: ikkala tegni almashtiring.',
      'Это маршрут по тропе. Шаги идут по порядку, а список с точками. Сделай его с номерами: поменяй оба тега.',
      'This is the route along the trail. The steps go in order, but the list has dots. Make it numbered: change both tags.'),
    hints: [
      L3('Qaysi teg raqamli ro‘yxat yasaydi?', 'Какой тег делает список с номерами?', 'Which tag makes a numbered list?'),
      L3('Bu ol. ul ni ol ga ikki joyda almashtiring: ochuvchi va yopuvchi tegda.', 'Это ol. Поменяй ul на ol в двух местах: в открывающем и закрывающем теге.', 'It’s ol. Change ul to ol in two places: the opening and the closing tag.'),
      L3('Mana raqamli ro‘yxatning boshi va oxiri. Bandlar o‘rtada qoladi.', 'Вот начало и конец списка с номерами. Пункты остаются посередине.', 'Here are the start and end of a numbered list. The items stay in the middle.')
    ],
    praise: L3('To‘g‘ri! Qadamlar raqamlandi: endi yo‘l aniq.', 'Верно! У шагов номера — теперь маршрут понятен.', 'Right! The steps have numbers: now the route is clear.'),
    done: L3('Yo‘l ro‘yxati raqamlangan.', 'Маршрут уже с номерами.', 'The route already has numbers.'),
    drill: L3('Buterbrod retsepti ham nuqtali. Uni ham raqamli qiling.', 'Рецепт бутерброда тоже с точками. Сделай и его с номерами.', 'The sandwich recipe has dots too. Make it numbered as well.')
  },

  // 3 · из текста — в структуру: строка через запятую → список ul.
  t3: {
    order: L3('Satrdagi narsalarni nuqtali ro‘yxatga ajrating', 'Разложи вещи из строки в список с точками', 'Turn the things in the line into a list with dots'),
    say: L3('Dam olish uchun narsalar bitta satrda vergul bilan yozilgan. Ulardan nuqtali ro‘yxat yasang: ul, ichida har bir narsa o‘z li ida.',
      'Вещи для привала записаны одной строкой через запятую. Сделай из них список с точками: ul, а внутри каждая вещь в своём li.',
      'The things for the rest stop are written in one line with commas. Make them a list with dots: ul, with each thing in its own li.'),
    hints: [
      L3('Satrda nechta narsa bo‘lsa, shuncha li bandi bo‘ladi.', 'Сколько вещей в строке — столько пунктов li.', 'As many things as in the line, as many li items.'),
      L3('Avval ul ni oching, ichiga uchta li yozing, oxirida ul ni yoping. p satrini o‘chirsa bo‘ladi.', 'Сначала открой ul, внутри напиши три li, в конце закрой ul. Строку p можно стереть.', 'First open ul, write three li inside, then close ul. You can delete the p line.'),
      L3('Mana boshqa narsalar bilan ro‘yxat. Siznikini ham shunday tuzing.', 'Вот список с другими вещами. Свой построй так же.', 'Here’s a list with other things. Build yours the same way.')
    ],
    praise: L3('Ajoyib! Narsalar endi ro‘yxatda, har birida nuqta.', 'Здорово! Вещи теперь в списке, у каждой точка.', 'Nice! The things are in a list now, each with a dot.'),
    done: L3('Dam olish ro‘yxati tayyor.', 'Список для привала уже готов.', 'The rest stop list is ready.'),
    drill: L3('O‘yinlar uchun narsalarni ham ro‘yxatga ajrating.', 'Разложи в список и вещи для игр.', 'Turn the things for games into a list too.')
  },

  // 4 · найти и починить два сломанных пункта; счётчик «осталось исправить».
  t4: {
    order: L3('Ikkita buzilgan bandni toping va tuzating', 'Найди и почини два сломанных пункта', 'Find and fix two broken items'),
    say: L3('Chodir qadamlari chalkashib ketdi: bir qadamda raqam yo‘q, oxirida esa bo‘sh band paydo bo‘ldi. Bunga ikkita buzilgan band sabab. Ularni toping va tuzating.',
      'Шаги с палаткой поехали: у одного шага нет номера, а в конце появился пустой пункт. Виноваты два сломанных пункта. Найди и почини их.',
      'The tent steps went wrong: one step has no number, and an empty item appeared at the end. Two broken items are to blame. Find and fix them.'),
    hints: [
      L3('Har bir band ochuvchi li bilan boshlanib, yopuvchi li bilan tugaydi. Har bir qatorni tekshiring.', 'Каждый пункт начинается открывающим li и заканчивается закрывающим. Проверь каждую строку.', 'Each item starts with an opening li and ends with a closing li. Check every line.'),
      L3('{n}-qatorga qarang: undagi bandda nimadir joyida emas.', 'Посмотри на строку {n}: с пунктом в ней что-то не так.', 'Look at line {n}: something’s off with the item there.'),
      L3('Band — bu ochuvchi li, matn va yopuvchi li. Mana to‘g‘ri ro‘yxat.', 'Пункт — это открывающий li, текст и закрывающий li. Вот правильный список.', 'An item is the opening li, the text and the closing li. Here’s a correct list.')
    ],
    hintLine: L3('Hammasi tuzaldi — «Tekshirish»ni bosing.', 'Всё починено — нажми «Проверить».', 'Everything is fixed — tap “Check”.'),
    hintKeep: L3('Boshlanishi bilan solishtiring: ro‘yxat ol edi va unda o‘sha qadamlar bor edi.', 'Сравни с тем, что было: список был ol, и в нём те же шаги.', 'Compare with how it was: the list was ol with the same steps.'),
    hintTags: L3('Teglarni tekshiring: har bir ochilgan teg o‘z jufti bilan yopilishi kerak.', 'Проверь теги: каждый открытый тег должен закрыться своей парой.', 'Check the tags: every opened tag must close with its pair.'),
    praise: L3('To‘g‘ri! Ikkala band tuzaldi, chodirni tiksa bo‘ladi.', 'Есть! Оба пункта починены — палатку можно ставить.', 'Yes! Both items are fixed: time to pitch the tent.'),
    done: L3('Chodir ro‘yxati tuzatilgan.', 'Список палатки уже починен.', 'The tent list is fixed.'),
    drill: L3('Idishlar ro‘yxati ham buzilgan: bu yerda ham ikkita band. Toping va tuzating.', 'Список посуды тоже сломан: и здесь два пункта. Найди и почини.', 'The dishes list is broken too: two items here as well. Find and fix them.')
  },

  // 5 · своё с нуля: h1 (урок 2) и список с тремя пунктами — по живому списку.
  t5: {
    order: L3('O‘z ro‘yxatingizni yozing: h1 nom, ro‘yxat va kamida uchta band', 'Напиши свой список: название h1, список и хотя бы три пункта', 'Write your list: an h1 name, a list and at least three items'),
    say: L3('So‘qmoq tiklandi! Endi sizning ro‘yxatingiz. Mavzuni o‘zingiz tanlang: h1 nom yozing, ostiga ul yoki ol ro‘yxat, unda kamida uchta li band.',
      'Тропа восстановлена! Теперь твой список. Тему выбери сам: напиши название h1, под ним список ul или ol, а в нём хотя бы три пункта li.',
      'The trail is restored! Now your list. Pick any topic: type a name in h1, then a ul or ol list under it, with at least three li items.'),
    empty: L3('Ro‘yxatingiz shu yerda chiqadi', 'Здесь появится твой список', 'Your list will appear here'),
    hints: [
      L3('Sahifa sarlavhadan boshlanadi, ostida ro‘yxat. Tartib muhim bo‘lsa ol, bo‘lmasa ul.', 'Страница начинается с заголовка, под ним список. Важен порядок — ol, не важен — ul.', 'The page starts with a heading, the list goes under it. If order matters, use ol; if not, ul.'),
      L3('h1 juftidan boshlang va ichiga ro‘yxat nomini yozing.', 'Начни с пары h1 и напиши внутри название списка.', 'Start with an h1 pair and type the list name inside.'),
      L3('Mana boshqa ro‘yxat. O‘zingiznikini ham shunday tuzing, faqat o‘z mavzuingizda.', 'Вот другой список. Свой построй так же, но о своём.', 'Here’s another list. Build yours the same way, about your own topic.')
    ],
    hint2: {
      h1: L3('h1 juftidan boshlang va ichiga ro‘yxat nomini yozing.', 'Начни с пары h1 и напиши внутри название списка.', 'Start with an h1 pair and type the list name inside.'),
      list: L3('Sarlavhadan keyin ul yoki ol ni oching, oxirida uni yoping.', 'После заголовка открой ul или ol, а в конце закрой.', 'After the heading, open ul or ol, and close it at the end.'),
      items: L3('Ro‘yxat ichiga uchta li yozing: har birida bitta band.', 'Внутри списка напиши три li — в каждом по пункту.', 'Inside the list, write three li, one item in each.'),
      tag: L3('Teglarni tekshiring: har bir ochilgan teg o‘z jufti bilan yopilishi kerak.', 'Проверь теги: каждый открытый тег должен закрыться своей парой.', 'Check the tags: every opened tag must close with its pair.')
    },
    praise: L3('Ro‘yxatingiz tayyor! Uning kodini boshidan oxirigacha o‘zingiz yozdingiz.', 'Твой список готов! Его код — целиком твой, от первой до последней строки.', 'Your list is ready! You wrote its code yourself, start to finish.'),
    done: L3('Ro‘yxatingiz tayyor.', 'Твой список уже готов.', 'Your list is already done.'),
    drill: L3('Choy damlash qadamlarini ol ro‘yxati qilib yozing: kamida uchta qadam.', 'Напиши шаги, как заварить чай, списком ol — хотя бы три шага.', 'Write the steps to make tea as an ol list: at least three steps.')
  },

  drill: {
    say: L3('Chiqdi! Endi yana bir marta, yangi matn bilan.', 'Получилось! Теперь ещё раз, с новым текстом.', 'You did it! Now once more, with new text.'),
    done: L3('Yangi matn bilan ham chiqdi. Endi bu sizning qo‘lingizda.', 'И с новым текстом получилось. Теперь это точно твоё.', 'It worked with new text too. Now it’s really yours.')
  },

  fin: {
    eyebrow: L3('So‘qmoq tiklandi', 'Тропа восстановлена', 'The trail is restored'),
    say: L3('Tabriklayman! Sayohat daftari yana tartibda. Oxirgi ro‘yxat esa sizniki.', 'Ура! Походный блокнот снова в порядке. А последний список — твой.', 'Hooray! The trip notebook is in order again. And the last list is yours.'),
    skills: [
      L3('Ro‘yxatga li band qo‘shaman', 'Добавляю пункт li в список', 'I add an li item to a list'),
      L3('ul ni ol ga almashtiraman', 'Меняю ul на ol', 'I change ul to ol'),
      L3('Satrdan ro‘yxat yasayman', 'Делаю список из строки', 'I turn a line into a list'),
      L3('Buzilgan bandlarni tuzataman', 'Чиню сломанные пункты', 'I fix broken items'),
      L3('Ro‘yxatli sahifani noldan yozaman', 'Пишу страницу со списком с нуля', 'I write a page with a list from scratch')
    ]
  }
};

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:p03-engine.jsx@*/

/*@FILE:p03-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:p03.css@*/
`;
