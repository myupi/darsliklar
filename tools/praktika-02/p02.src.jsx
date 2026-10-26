// =============================================================================
// КУРС «HTML» · Модуль 1 · Практика к уроку 2 — «Стенгазета». Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/praktika-02/p02.src.jsx lessons/html/02p-zagolovki-i-tekst.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА К УРОКУ 2 · «Стенгазета» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (22.10.2026; каркас и вид — практика 01p «Бумажная улица», бумажный
// стиль урока 1). Стенгазета класса: каждая вырезка — маленькая веб-страница.
// В хуке ученик нажимает «Печать», и принтер теряет теги: вырезки выходят кашей.
// Ученик чинит четыре вырезки и пишет свою статью в пятую.
//
// СЕМЬ СЛАЙДОВ (заказчик, 22.10.2026): хук · пять заданий от лёгкого к сложному,
// каждое — своя механика, чтобы не было «печатай и Проверить» пять раз подряд:
//   t1 название газеты — поменять цифру уровня в паре тегов (h4 → h1);
//   t2 новости — разделить один абзац на два (вставить </p><p> посреди строки);
//   t3 спорт — сделать как на вырезке: одно слово b, другое i;
//   t4 погода — найти и починить два испорченных тега (пара </h3>, незакрытый
//      <b> заливает жирным всё дальше); счётчик «осталось исправить»;
//   t5 своя статья — с нуля h2, абзац и выделенное слово, по живому списку.
// Только материал уроков 1–2: документ (опора — готовые head и body), h1–h6, p, b, i.
//
// ОСОБЫЕ ПРАВИЛА (как в 01p): Коди — голова в кружке в шапке, без облака с
// текстом; пишет ученик; проверка по «Проверить» (одна причина, со второй неудачи
// — ступень подсказки); три ступени по лампочке, после образца — ещё одна задача;
// браузер честный и без прокрутки; код не исполняется; конфетти только в финале.
// =============================================================================

const META = {
  lessonId: 'html-02p-stengazeta',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '2-dars amaliyoti. Devoriy gazeta',
    ru: 'Практика к уроку 2. Стенгазета',
    en: 'Lesson 2 practice. The class newspaper'
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
// СТЕНГАЗЕТА — пять вырезок. Задание n чинит вырезку n; последняя — статья ученика.
// ─────────────────────────────────────────────────────────────────────────────
const STREET = [
  { id: 'mast',    c: '#E0643F', name: L3('Gazeta nomi', 'Название газеты', 'The masthead') },
  { id: 'news',    c: '#2A8C7E', name: L3('Yangiliklar', 'Новости', 'News') },
  { id: 'sport',   c: '#F0B13F', name: L3('Sport', 'Спорт', 'Sports') },
  { id: 'weather', c: '#5E8FB8', name: L3('Ob-havo', 'Погода', 'Weather') },
  { id: 'mine',    c: '#1F2A44', name: L3('Sizning maqolangiz', 'Твоя статья', 'Your article') }
];
const HOME = STREET.length - 1;

// Содержимое вырезок и дополнительных задач.
const TXT = {
  gazeta: L3('Sinf gazetasi', 'Газета класса', 'Class newspaper'),
  mast: L3('Bizning sinf', 'Наш класс', 'Our Class'),
  mastText: L3('Har hafta yangi son.', 'Каждую неделю новый выпуск.', 'A new issue every week.'),
  sport: L3('Sport', 'Спорт', 'Sports'),
  news: L3('Yangiliklar', 'Новости', 'News'),
  otherPaper: L3('Maktab xabarlari', 'Школьный вестник', 'School Herald'),   // образец 3-й ступени задания 1 — название другой газеты
  news1: L3('Ertaga ekskursiya bo‘ladi.', 'Завтра у нас экскурсия.', 'Tomorrow we have a trip.'),
  news2: L3('Avtobus ertalab jo‘naydi.', 'Автобус уходит утром.', 'The bus leaves in the morning.'),
  rain1: L3('Bugun yomg‘ir yog‘adi.', 'Сегодня будет дождь.', 'It will rain today.'),
  rain2: L3('Soyabon oling.', 'Возьми зонт.', 'Take an umbrella.'),
  clubs: L3('To‘garaklar', 'Кружки', 'Clubs'),
  club1: L3('Shaxmat to‘garagi ochildi.', 'Открылся кружок шахмат.', 'A chess club has opened.'),
  club2: L3('Hamma kelishi mumkin.', 'Приходить могут все.', 'Everyone can come.'),
  // t3: предложение и слова: b — жирное, i — курсив
  win: L3(['Jamoamiz ', { i: 'yana' }, ' ', { b: 'yutdi' }, '!'], ['Наша команда ', { i: 'снова' }, ' ', { b: 'победила' }, '!'], ['Our team ', { b: 'won' }, ' ', { i: 'again' }, '!']),
  race: L3(['Musobaqa ', { b: 'shanba' }, ' kuni. ', { i: 'Albatta' }, ' keling!'], ['Забег ', { b: 'в субботу' }, '. Приходи ', { i: 'обязательно' }, '!'], ['The race is on ', { b: 'Saturday' }, '. Come ', { i: 'for sure' }, '!']),
  weather: L3('Ob-havo', 'Погода', 'Weather'),
  w1: L3('Ertaga', 'Завтра', 'Tomorrow is'),
  w1b: L3('quyoshli', 'солнечно', 'sunny'),
  w2: L3('Shamol yo‘q.', 'Ветра нет.', 'No wind.'),
  quiz: L3('Viktorina', 'Викторина', 'Quiz'),
  q1: L3('Javob', 'Ответ', 'The answer is'),
  q1b: L3('juma kuni', 'в пятницу', 'on Friday'),
  q2: L3('Omad!', 'Удачи!', 'Good luck!'),
  football: L3('Futbol', 'Футбол', 'Football'),
  footText: L3(['Men ', { b: 'har kuni' }, ' o‘ynayman.'], ['Я играю ', { b: 'каждый день' }, '.'], ['I play ', { b: 'every day' }, '.']),
  workshop: L3('Ustaxona', 'Мастерская', 'Workshop'),
  workText: L3('Biz <b>robotlar</b> yasaymiz.', 'Мы собираем <b>роботов</b>.', 'We build <b>robots</b>.')
};

// Подписи интерфейса практики. up, down, mySite, hello, play нужны бумажному набору.
const UI = {
  task: L3('{n}-topshiriq', 'Задание {n}', 'Task {n}'),
  houseOf: L3('{n}/5-qirqim', 'Вырезка {n} из 5', 'Clipping {n} of 5'),
  map: L3('Devoriy gazeta', 'Стенгазета', 'Class newspaper'),
  works: L3('tayyor', 'готова', 'ready'),
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
  print: L3('Chop etish', 'Печать', 'Print'),
  given: L3('tayyor', 'уже есть', 'given'),
  target: L3('Qirqimda shunday', 'Как на вырезке', 'Like the clipping'),
  left: L3('Tuzatish kerak: {n}', 'Осталось исправить: {n}', 'Left to fix: {n}'),
  allFixed: L3('Hammasi tuzatildi', 'Всё исправлено', 'All fixed'),
  needH2: L3('h2 — maqola sarlavhasi', 'h2 — заголовок статьи', 'h2 — the article heading'),
  needP: L3('p — matnli xatboshi', 'p — абзац с текстом', 'p — a paragraph with text'),
  needEm: L3('b yoki i — ajratilgan so‘z', 'b или i — выделенное слово', 'b or i — a highlighted word'),
  needClosed: L3('hamma teglar yopilgan', 'все теги закрыты', 'all tags are closed'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Ro‘yxatlar', 'Списки', 'Lists'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
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
  textOutside: L3('Matn teglardan tashqarida. Uni p ichiga yozing.', 'Текст стоит снаружи тегов. Напиши его внутри p.', 'The text is outside the tags. Write it inside p.'),
  noGt: L3('{tag} tegi oxirida o‘ng «>» qavs yetishmayapti.', 'У тега {tag} в конце не хватает уголка «>».', 'The {tag} tag is missing the bracket “>” at the end.'),
  noLt: L3('{tag} oldida chap «<» qavs yetishmayapti.', 'Перед {tag} не хватает уголка «<».', 'The bracket “<” is missing before {tag}.'),
  unknown: L3('«{raw}» tegida harflar adashgan: {tag} kerak.', 'В теге «{raw}» перепутаны буквы: нужно {tag}.', 'The letters in “{raw}” are mixed up: it should be {tag}.'),
  unknownFar: L3('«{raw}» tegi bizga notanish. Bizda h1–h6, p, b va i teglari bor.', 'Тег «{raw}» нам не знаком. У нас есть теги h1–h6, p, b и i.', 'We don’t know the tag “{raw}”. We have the tags h1–h6, p, b and i.'),
  slashEnd: L3('Qiya chiziq boshqa joyda turibdi. Yopuvchi tegda u chap «<» qavsdan keyin keladi: </{tag}>.', 'Косая черта стоит не там. В закрывающем теге она идёт сразу после уголка «<»: </{tag}>.', 'The slash is in the wrong spot. In a closing tag it goes right after the bracket “<”: </{tag}>.'),
  backslash: L3('Yopuvchi tegda qiya chiziq «/» turadi, bu yerda esa teskari «\\» chiziq.', 'В закрывающем теге нужна косая черта «/», а здесь обратная «\\».', 'A closing tag needs a slash “/”, but here it is a backslash “\\”.'),
  junk: L3('Qavslar ichiga faqat teg nomini yozamiz, matn esa tashqarida turadi.', 'Внутри уголков пишем только имя тега, а текст — снаружи.', 'Inside the brackets we write only the tag name; the text goes outside.'),
  emptyTag: L3('Bu yerda bo‘sh qavslar. Ichida teg nomi bo‘lishi kerak.', 'Здесь пустые уголки. Внутри должно быть имя тега.', 'These brackets are empty. A tag name goes inside.'),
  openAgain: L3('Bu yerda ochuvchi {tag} yozilgan. Yopuvchi tegga qiya chiziq kerak.', 'Здесь написан открывающий {tag}. Закрывающему тегу нужна косая черта.', 'This is an opening {tag}. The closing tag needs a slash.'),
  unclosedEnd: L3('{tag} nima bilan tugashini tekshiring: yopuvchi teg yo‘q.', 'Проверь, чем заканчивается {tag}: закрывающего тега нет.', 'Check how {tag} ends: there is no closing tag.'),
  closeWithoutOpen: L3('Bu yerda yopuvchi {tag} bor, ochuvchisi esa yo‘q.', 'Здесь закрывающий {tag}, а открывающего нет.', 'There is a closing {tag} here, but no opening one.'),
  // t1 — уровень заголовка
  needHead: L3('Gazeta nomi — sarlavha. Unga h harfi va raqamli teg kerak.', 'Название газеты — это заголовок. Ему нужен тег h с цифрой.', 'The newspaper name is a heading. It needs an h tag with a number.'),
  oneBlock: L3('Bu yerda bitta sarlavha — bitta teglar jufti kerak.', 'Здесь нужен один заголовок — одна пара тегов.', 'One heading here — one pair of tags.'),
  notBiggest: L3('Hozir bu h{n}. Gazeta nomi sahifadagi eng muhim narsa, unga eng katta sarlavha kerak.', 'Сейчас это h{n}. Название газеты — самое главное на странице, ему нужен самый крупный заголовок.', 'Right now it is h{n}. The newspaper name is the most important thing on the page; it needs the biggest heading.'),
  notSection: L3('Hozir bu h{n}. Bo‘lim — nomdan keyingi daraja, unga h2 kerak.', 'Сейчас это h{n}. Раздел — следующий уровень после названия, ему нужен h2.', 'Right now it is h{n}. A section is the next level after the name; it needs h2.'),
  textSame: L3('Teglar joyida! Faqat so‘zlar o‘zgarib qoldi: teglarni tuzatamiz, matnni esa avvalgidek qoldiramiz.', 'Теги в порядке! Только слова изменились: чиним теги, а текст оставляем как был.', 'The tags are fine! Only the words changed: we fix the tags and leave the text as it was.'),
  // t2 — два абзаца
  oneP: L3('Hozircha bu bitta xatboshi. Uni birinchi gapdan keyin yoping va ikkinchisi uchun yangisini oching.', 'Пока это один абзац. Закрой его после первого предложения и открой новый для второго.', 'This is still one paragraph. Close it after the first sentence and open a new one for the second.'),
  tooManyP: L3('Ikkita xatboshi kerak: har bir gapga bittadan.', 'Нужно ровно два абзаца — по одному на предложение.', 'You need exactly two paragraphs, one per sentence.'),
  onlyP: L3('Bu yerda xatboshilar kerak — p teglari, {tag} emas.', 'Здесь нужны абзацы — теги p, а не {tag}.', 'Paragraphs are needed here: p tags, not {tag}.'),
  splitWrong: L3('Ikki xatboshi bor, lekin chegara boshqa joyda. Birinchisi birinchi gapdan keyin tugaydi.', 'Два абзаца есть, но граница не там. Первый кончается после первого предложения.', 'There are two paragraphs, but the border is in the wrong place. The first one ends after the first sentence.'),
  // t3 — как на вырезке
  oneLine: L3('Bu yerda bitta xatboshi — bitta p jufti qolsin.', 'Здесь один абзац — пусть останется одна пара p.', 'This is one paragraph, so keep one p pair.'),
  needB: L3('Qirqimda «{w}» so‘zi qalin. Uni b jufti bilan o‘rang.', 'На вырезке слово «{w}» жирное. Оберни его парой b.', 'On the clipping the word “{w}” is bold. Wrap it in a b pair.'),
  needI: L3('Qirqimda «{w}» so‘zi qiya. Uni i jufti bilan o‘rang.', 'На вырезке слово «{w}» наклонное. Оберни его парой i.', 'On the clipping the word “{w}” is italic. Wrap it in an i pair.'),
  swapped: L3('So‘zlar almashib qoldi: «{b}» qalin bo‘lishi kerak — bu b, «{i}» esa qiya — bu i.', 'Слова перепутаны: «{b}» должно быть жирным — это b, а «{i}» наклонным — это i.', 'The words are swapped: “{b}” should be bold, which is b, and “{i}” italic, which is i.'),
  bWrong: L3('Hozir b ichida «{got}». Qirqimda faqat «{w}» qalin.', 'Сейчас в b стоит «{got}». На вырезке жирное только «{w}».', 'Right now b holds “{got}”. On the clipping only “{w}” is bold.'),
  iWrong: L3('Hozir i ichida «{got}». Qirqimda faqat «{w}» qiya.', 'Сейчас в i стоит «{got}». На вырезке наклонное только «{w}».', 'Right now i holds “{got}”. On the clipping only “{w}” is italic.'),
  // t4 — починить два тега
  keepAsWas: L3('Teglar tuzaldi! Faqat avvalgidek qaytaring: h2 sarlavha va {tag} juftidagi «{w}» so‘zi.', 'Теги починены! Только верни как было: заголовок h2 и слово «{w}» в паре {tag}.', 'The tags are fixed! Just put back what was there: the h2 heading and the word “{w}” in a {tag} pair.'),
  // t5 — своя статья
  artEmpty: L3('Hozircha bo‘sh. Maqolani h2 sarlavhadan boshlang.', 'Пока пусто. Начни статью с заголовка h2.', 'It is empty so far. Start the article with an h2 heading.'),
  needH2: L3('Maqolaga h2 sarlavha kerak — bu gazetaning bo‘limi.', 'Статье нужен заголовок h2 — это раздел газеты.', 'The article needs an h2 heading: it is a section of the newspaper.'),
  h1Taken: L3('h1 gazetada allaqachon bor — bu uning nomi. Maqolaga h2 kerak.', 'h1 в газете уже есть — это её название. Статье нужен h2.', 'The newspaper already has h1: it is its name. The article needs h2.'),
  headEmpty: L3('Sarlavha teglari joyida, ichi esa bo‘sh. Maqola nomini yozing.', 'Теги заголовка на месте, а внутри пусто. Напиши название статьи.', 'The heading tags are in place, but empty. Write the article name.'),
  needP: L3('Sarlavha ostiga matnli xatboshi — p kerak.', 'Под заголовком нужен абзац p с текстом.', 'Under the heading you need a p paragraph with text.'),
  needEm: L3('Xatboshidagi bitta so‘zni ajrating: b — qalin yoki i — qiya.', 'Выдели в абзаце одно слово: b — жирным или i — наклонным.', 'Highlight one word in the paragraph: b for bold or i for italic.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ ЭКРАНОВ. Реплики (say, hints, praise, done …) звучат; подписи
// (eyebrow, order, ask, note, empty …) только печатаются.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Хук: газета целая → касание «Печать» → вырезки выцветают и косятся, клочки летят.
  intro: {
    eyebrow: L3('Devoriy gazeta', 'Стенгазета', 'Class newspaper'),
    say: L3('Bu sinfimizning devoriy gazetasi. Undagi har bir qirqim kichik veb-sahifa: sarlavha va xatboshilar.',
      'Это стенгазета нашего класса. Каждая вырезка в ней — маленькая веб-страница: заголовок и абзацы.',
      'This is our class newspaper. Every clipping in it is a small web page: a heading and paragraphs.'),
    blown: L3('Voy! Printer teglarni chalkashtirib yubordi: sarlavhalar mayda, matnlar bir-biriga yopishib qoldi.',
      'Ой! Принтер напутал теги: заголовки стали мелкими, а тексты слиплись.',
      'Oh no! The printer mixed up the tags: headings got tiny, and texts stuck together.'),
    plan: L3('To‘rtta qirqimni kod bilan tuzatamiz, beshinchisiga esa o‘z maqolangizni yozasiz. Har bir topshiriq oldingisidan biroz qiyinroq.',
      'Починим четыре вырезки кодом, а в пятую ты напишешь свою статью. Каждое задание чуть сложнее прошлого.',
      'We’ll fix four clippings with code, and you’ll write your own article for the fifth. Each task is a bit harder than the last.'),
    ask: L3('«Chop etish» tugmasini bosing', 'Нажми «Печать»', 'Tap “Print”'),
    order: L3('To‘rtta qirqimni tuzating, beshinchisiga maqola yozing. Kodni siz yozasiz.',
      'Почини четыре вырезки, а в пятую напиши статью. Код пишешь ты.',
      'Fix four clippings and write an article for the fifth. You write the code.'),
    note: L3('Sahifasi tayyor bo‘lgan qirqim yonadi. Jarima yo‘q: xohlagancha tekshiring.',
      'Вырезка загорается, когда её страница готова. Штрафов нет — проверяй сколько хочешь.',
      'A clipping lights up when its page is ready. No penalties: check as often as you like.')
  },

  // 1 · самое лёгкое: поменять цифру уровня в паре тегов.
  t1: {
    order: L3('Gazeta nomini eng katta sarlavha qiling', 'Сделай название газеты самым крупным заголовком', 'Make the newspaper name the biggest heading'),
    say: L3('Gazeta nomi juda mayda chiqdi: u h4 tegida turibdi. Nom esa sahifadagi eng muhim narsa. Uni eng katta sarlavha qiling.',
      'Название газеты вышло мелким: оно стоит в теге h4. А название — самое главное на странице. Сделай его самым крупным заголовком.',
      'The newspaper name came out small: it is in an h4 tag. But the name is the most important thing on the page. Make it the biggest heading.'),
    hints: [
      L3('Sarlavha qanchalik katta bo‘lishini h harfidan keyingi raqam belgilaydi.', 'Размер заголовка задаёт цифра после буквы h.', 'The number after the letter h sets the heading size.'),
      L3('Raqam qancha kichik bo‘lsa, sarlavha shuncha katta. Eng kattasi — h1.', 'Чем меньше цифра, тем крупнее заголовок. Самый крупный — h1.', 'The smaller the number, the bigger the heading. The biggest is h1.'),
      L3('Mana boshqa gazetaning nomi. Raqam ikkala tegda turadi — ikkalasini ham almashtiring.', 'Вот название другой газеты. Цифра стоит в обоих тегах — поменяй обе.', 'Here is another newspaper’s name. The number is in both tags, so change both.')
    ],
    praise: L3('Zo‘r! Nom endi eng katta — gazetani uzoqdan ham ko‘rish mumkin.', 'Отлично! Название теперь самое крупное — газету видно издалека.', 'Great! The name is the biggest now — you can see the newspaper from afar.'),
    done: L3('Gazeta nomi tayyor.', 'Название газеты уже готово.', 'The newspaper name is ready.'),
    drill: L3('Sport — gazetaning bo‘limi. Uni h2 sarlavha qiling.', '«Спорт» — раздел газеты. Сделай его заголовком h2.', '“Sports” is a section of the newspaper. Make it an h2 heading.')
  },

  // 2 · вставить </p><p> посреди строки: один абзац → два.
  t2: {
    order: L3('Matnni ikki xatboshiga ajrating: har bir gap — o‘z p ichida', 'Раздели текст на два абзаца: каждое предложение — в своём p', 'Split the text into two paragraphs: each sentence in its own p'),
    say: L3('Yangiliklarda ikki gap bitta xatboshiga yopishib qoldi. Ularni ajrating: birinchi gapdan keyin xatboshini yoping va yangisini oching.',
      'В новостях два предложения слиплись в один абзац. Раздели их: после первого предложения закрой абзац и открой новый.',
      'In the news, two sentences got stuck in one paragraph. Split them: after the first sentence, close the paragraph and open a new one.'),
    hints: [
      L3('Brauzerda gaplar bitta qatorda turibdi. Nechta xatboshi bo‘lishi kerak?', 'В браузере предложения стоят одной строкой. Сколько должно быть абзацев?', 'In the browser the sentences sit in one line. How many paragraphs should there be?'),
      L3('Har bir xatboshi — o‘z p jufti. Birinchi gapning nuqtasidan keyin yopuvchi p, ikkinchi gapdan oldin ochuvchi p qo‘ying.',
        'Каждый абзац — своя пара p. После точки первого предложения поставь закрывающий p, а перед вторым — открывающий.',
        'Each paragraph is its own p pair. After the first sentence’s full stop put a closing p, and before the second one an opening p.'),
      L3('Mana boshqa xabardagi ikki xatboshi. Sizniki ham shunday bo‘ladi.', 'Вот два абзаца в другой заметке. У тебя будет так же.', 'Here are two paragraphs in another note. Yours will look the same.')
    ],
    praise: L3('Ajoyib! Endi ikki xatboshi — o‘qish ancha oson.', 'Здорово! Теперь два абзаца — читать гораздо легче.', 'Nice! Two paragraphs now — much easier to read.'),
    done: L3('Yangiliklar ikki xatboshiga ajratilgan.', 'Новости уже разделены на два абзаца.', 'The news is already split into two paragraphs.'),
    drill: L3('Bu yerda ham ikki gap yopishib qoldi. Ularni ikki xatboshiga ajrating.', 'И здесь слиплись два предложения. Раздели их на два абзаца.', 'Two sentences are stuck together here too. Split them into two paragraphs.')
  },

  // 3 · сделать как на вырезке: одно слово b, другое i.
  t3: {
    order: L3('Qirqimdagidek qiling: bir so‘z qalin, boshqasi qiya', 'Сделай как на вырезке: одно слово жирное, другое наклонное', 'Make it like the clipping: one word bold, another italic'),
    say: L3('Sport qirqimida bir so‘z qalin, boshqasi qiya edi. Printer ularni oddiy qilib qo‘ydi. Qirqimga qarang va kerakli so‘zlarni b va i teglariga o‘rang.',
      'На вырезке «Спорт» одно слово было жирным, а другое наклонным. Принтер сделал их обычными. Посмотри на вырезку и оберни нужные слова в теги b и i.',
      'On the Sports clipping one word was bold and another italic. The printer made them plain. Look at the clipping and wrap the right words in b and i tags.'),
    hints: [
      L3('Brauzerdagi qatorni qirqim bilan solishtiring: qaysi so‘zlar boshqacha ko‘rinadi?', 'Сравни строку в браузере с вырезкой: какие слова выглядят иначе?', 'Compare the line in the browser with the clipping: which words look different?'),
      L3('Qalin so‘z — b jufti ichida, qiya so‘z — i jufti ichida. Teglar so‘zning o‘zini o‘raydi, p ichida.',
        'Жирное слово — в паре b, наклонное — в паре i. Теги стоят прямо вокруг слова, внутри p.',
        'A bold word goes in a b pair, an italic word in an i pair. The tags go right around the word, inside p.'),
      L3('Mana boshqa qatordagi qalin so‘z. i ham xuddi shunday qo‘yiladi.', 'Вот жирное слово в другой строке. i ставится точно так же.', 'Here is a bold word in another line. i goes in exactly the same way.')
    ],
    praise: L3('Aynan o‘zi! Xuddi qirqimdagidek.', 'В точку! Ровно как на вырезке.', 'Spot on! Exactly like the clipping.'),
    done: L3('Sport qirqimi tayyor.', 'Вырезка «Спорт» уже готова.', 'The Sports clipping is ready.'),
    drill: L3('Bu e’longa ham qarang va qirqimdagidek qiling.', 'Посмотри и на это объявление — сделай как на вырезке.', 'Look at this notice too and make it like the clipping.')
  },

  // 4 · найти и починить два испорченных тега; счётчик «осталось исправить».
  t4: {
    order: L3('Ikkita buzilgan tegni toping va tuzating', 'Найди и почини два испорченных тега', 'Find and fix two broken tags'),
    say: L3('Ob-havo qirqimi butunlay chalkashib ketdi: xatboshilar ulkan, qalin yozuv esa tugamaydi. Bunga ikkita buzilgan teg sabab. Ularni toping va tuzating.',
      'Вырезка с погодой совсем поехала: абзацы огромные, а жирное не кончается. Виноваты два испорченных тега. Найди и почини их.',
      'The weather clipping went wild: the paragraphs are huge, and the bold never ends. Two broken tags are to blame. Find and fix them.'),
    hints: [
      L3('Har bir g‘alati narsani bitta teg qilyapti. Kodni ko‘rib chiqing: har bir ochilgan teg qayerda yopiladi?', 'Каждую странность делает один тег. Пройди по коду: где закрывается каждый открытый тег?', 'Each odd thing is caused by one tag. Go through the code: where does each opened tag close?'),
      L3('{n}-qatorga qarang: u yerdagi teg kerakli joyda yopilmagan.', 'Посмотри на строку {n}: тег в ней не закрывается там, где нужно.', 'Look at line {n}: the tag there doesn’t close where it should.'),
      L3('Yopuvchi teg — o‘sha nom, faqat qiya chiziq bilan: h2 ni yopuvchi h2 yopadi, b ni yopuvchi b yopadi. Mana to‘g‘ri qirqim.',
        'Закрывающий тег — то же имя с косой чертой: h2 закрывает закрывающий h2, b — закрывающий b. Вот правильная вырезка.',
        'A closing tag is the same name with a slash: a closing h2 ends h2, a closing b ends b. Here is a correct clipping.')
    ],
    hintLine: L3('Hammasi tuzaldi — «Tekshirish»ni bosing.', 'Всё починено — нажми «Проверить».', 'Everything is fixed — tap “Check”.'),
    hintKeep: L3('Boshlanishi bilan solishtiring: sarlavha h2 edi, bitta so‘z esa ajratilgan edi.', 'Сравни с тем, что было: заголовок стоял в h2, а одно слово было выделено.', 'Compare with how it was: the heading was in h2, and one word was highlighted.'),
    praise: L3('Zo‘r! Ikkala teg tuzaldi, ob-havo yana o‘qiladi.', 'Есть! Оба тега починены — погода снова читается.', 'Yes! Both tags are fixed — the weather is readable again.'),
    done: L3('Ob-havo qirqimi tuzatilgan.', 'Вырезка с погодой уже починена.', 'The weather clipping is already fixed.'),
    drill: L3('Viktorina ham buzilgan: bu yerda ham ikkita teg. Toping va tuzating.', 'Викторина тоже сломалась: и здесь два тега. Найди и почини.', 'The quiz is broken too: two tags here as well. Find and fix them.')
  },

  // 5 · своя статья с нуля: h2, абзац и выделенное слово — по живому списку.
  t5: {
    order: L3('O‘z maqolangizni yozing: h2 sarlavha, xatboshi va bitta ajratilgan so‘z', 'Напиши свою статью: заголовок h2, абзац и одно выделенное слово', 'Write your article: an h2 heading, a paragraph and one highlighted word'),
    say: L3('Gazeta tuzaldi! Endi sizning maqolangiz. Mavzuni o‘zingiz tanlang: h2 sarlavha yozing, uning ostiga xatboshi, xatboshida esa bitta so‘zni qalin yoki qiya qiling.',
      'Газета починена! Теперь твоя статья. Тему выбери любую: напиши заголовок h2, под ним абзац, а в абзаце выдели одно слово жирным или наклонным.',
      'The newspaper is fixed! Now your article. Pick any topic: write an h2 heading, a paragraph under it, and make one word in the paragraph bold or italic.'),
    empty: L3('Maqolangiz shu yerda chiqadi', 'Здесь появится твоя статья', 'Your article will appear here'),
    hints: [
      L3('Maqola gazetadagi qirqimlar kabi tuziladi: tepada sarlavha, ostida xatboshi.', 'Статья устроена как вырезки в газете: сверху заголовок, под ним абзац.', 'An article is built like the clippings in the newspaper: a heading on top, a paragraph under it.'),
      L3('h2 juftidan boshlang va uning ichiga maqola nomini yozing.', 'Начни с пары h2 и напиши внутри название статьи.', 'Start with an h2 pair and write the article name inside.'),
      L3('Mana boshqa bo‘lim maqolasi. O‘zingiznikini ham shunday tuzing, faqat o‘z mavzuingizda.', 'Вот статья другого раздела. Свою построй так же, но о своём.', 'Here is an article from another section. Build yours the same way, about your own topic.')
    ],
    hint2: {
      h2: L3('h2 juftidan boshlang va uning ichiga maqola nomini yozing.', 'Начни с пары h2 и напиши внутри название статьи.', 'Start with an h2 pair and write the article name inside.'),
      p: L3('Sarlavhadan keyin p ni oching, matn yozing va p ni yoping.', 'После заголовка открой p, напиши текст и закрой p.', 'After the heading, open p, write the text and close p.'),
      em: L3('Xatboshidagi bitta so‘zni b yoki i jufti bilan o‘rang.', 'Оберни одно слово в абзаце парой b или i.', 'Wrap one word in the paragraph with a b or i pair.'),
      tag: L3('Teglarni tekshiring: har bir ochilgan teg o‘z jufti bilan yopilishi kerak.', 'Проверь теги: каждый открытый тег должен закрыться своей парой.', 'Check the tags: every opened tag must close with its pair.')
    },
    praise: L3('Maqolangiz gazetada! Uning kodini boshidan oxirigacha o‘zingiz yozdingiz.', 'Твоя статья в газете! Её код — целиком твой, от первой до последней строки.', 'Your article is in the newspaper! You wrote its code yourself, start to finish.'),
    done: L3('Maqolangiz gazetada.', 'Твоя статья уже в газете.', 'Your article is already in the newspaper.'),
    drill: L3('Ustaxona bo‘limiga xatboshi yozing: undagi bitta so‘z qalin yoki qiya bo‘lsin.', 'Напиши абзац для раздела «Мастерская»: одно слово в нём — жирное или наклонное.', 'Write a paragraph for the Workshop section: one word in it bold or italic.')
  },

  drill: {
    say: L3('Chiqdi! Endi yana bir marta, yangi matn bilan.', 'Получилось! Теперь ещё раз, с новым текстом.', 'You did it! Now once more, with new text.'),
    done: L3('Yangi matn bilan ham chiqdi. Endi bu sizning qo‘lingizda.', 'И с новым текстом получилось. Теперь это точно твоё.', 'It worked with new text too. Now it’s really yours.')
  },

  fin: {
    eyebrow: L3('Gazeta tayyor', 'Газета готова', 'The newspaper is ready'),
    say: L3('Tabriklayman! Gazeta yana tartibda. Eng yangi maqola esa sizniki.',
      'Ура! Газета снова в порядке. А самая свежая статья в ней — твоя.',
      'Hooray! The newspaper is in order again. And the freshest article in it is yours.'),
    skills: [
      L3('Sarlavha darajasini tanlayman', 'Выбираю уровень заголовка', 'I choose the heading level'),
      L3('Matnni xatboshilarga ajrataman', 'Делю текст на абзацы', 'I split text into paragraphs'),
      L3('So‘zni qalin va qiya qilaman', 'Делаю слово жирным и наклонным', 'I make words bold and italic'),
      L3('Buzilgan teglarni topib tuzataman', 'Нахожу и чиню испорченные теги', 'I find and fix broken tags'),
      L3('Maqolani noldan yozaman', 'Пишу статью с нуля', 'I write an article from scratch')
    ]
  }
};

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:p02-engine.jsx@*/

/*@FILE:p02-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:p02.css@*/
`;
