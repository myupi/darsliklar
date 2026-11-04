// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 3 — «Праздник Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot3/build.mjs → lessons/html/03p-spiski.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 3 · «Праздник Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на основе практики 02p — tools/amaliyot2). У Коди завтра день рождения: сайт
// для гостей из пяти страниц-вкладок. При сохранении теги списков пропали — пункты слиплись в одну
// строку (как в крючке урока 3). Ученик чинит страницы по одной и сам пишет код: слово в пустом li →
// строка li → список ol из трёх li → найти пункт с номером, вписанным руками (загадка урока 3: ol
// ставит номер сам, вышло «2. 2.»), → свой список: h1 и ul или ol (смесь с уроком 2). Карта — вкладки
// браузера, как в 01p и 02p. 7 слайдов: крючок · пять заданий · вывод. Сценарий —
// docs/scenarij-03p-spiski.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a3-screens.jsx) находит теги и текст, страницу рисует React.
//     Браузер честный, как в уроке 3: ul — точки, ol — номера по порядку (ставит браузер; номер, вписанный
//     руками, — второй), текст в списке без li — без точки и номера, li без списка — с точкой.
//   · Код — часть body, как в уроках 2–3; в задании 1 — готовый код с пустым li.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; ro'yxat, nuqtali ro'yxat (ul),
//     raqamli ro'yxat (ol), band / ro'yxat bandi (li), как в уроке 3. В речи ul, ol, li — по буквам.
//     RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-03p-spiski',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: "3-amaliyot. Kodining bayrami",
    ru: 'Практика 3. Праздник Коди',
    en: 'Practice 3. Kodi’s party'
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
  next: L3("Havolalar", 'Ссылки', 'Links'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  part: {
    open: L3("ochuvchi teg", 'открывающий', 'opening tag'),
    word: L3("so'z", 'слово', 'word'),
    step: L3("qadam", 'шаг', 'step'),
    close: L3("yopuvchi teg", 'закрывающий', 'closing tag')
  },
  bpH1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'),
  bpList: L3("ro'yxat", 'список', 'list'),
  bpLi: L3("kamida 3 ta band", 'не меньше 3 пунктов', 'at least 3 items'),
  given: L3("bor", 'уже есть', 'already there'),
  three: L3("3 marta", '3 раза', '3 times'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening sahifam", 'Моя страница', 'My page'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// ПЯТЬ СТРАНИЦ ПРАЗДНИКА — объекты карты (вкладки). name — название из title, ico — значок;
// остальное — содержимое страницы. Пятая — список ученика.
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'menu', ico: 'menu', c: '#FA4F28', name: L3("Menyu", 'Меню', 'Menu'),
    items: [L3("Tort", 'Торт', 'Cake'), L3("Pitsa", 'Пицца', 'Pizza')], want: L3("Sharbat", 'Сок', 'Juice') },
  { id: 'decor', ico: 'balloon', c: '#7C5CFA', name: L3("Bezaklar", 'Украшения', 'Decorations'),
    before: L3("Bayroqchalar", 'Флажки', 'Flags'), after: L3("Chiroqlar", 'Гирлянды', 'Lights'), want: L3("Sharlar", 'Шарики', 'Balloons') },
  { id: 'cake', ico: 'cake', c: '#0FA38E', name: L3("Tort retsepti", 'Рецепт торта', 'Cake recipe') },
  { id: 'prep', ico: 'list', c: '#F59E0B', name: L3("Tayyorgarlik", 'Подготовка', 'Getting ready'),
    steps: [L3("Sharlarni puflang", 'Надуй шарики', 'Blow up the balloons'), L3("Stollarni qo'ying", 'Поставь столы', 'Set up the tables'),
      L3("Mehmonlarni kuting", 'Жди гостей', 'Wait for the guests')], bad: 1 },
  { id: 'mine', ico: 'star', c: '#E44D26', name: L3("Mening ro'yxatim", 'Мой список', 'My list') }
];
// Содержимое дополнительных задач и образцов (другое, чем в задании).
const XTRA = {
  salad: L3("Salat", 'Салат', 'Salad'),
  icecream: L3("Muzqaymoq", 'Мороженое', 'Ice cream'),
  flowers: L3("Gullar", 'Цветы', 'Flowers'),
  confetti: L3("Konfetti", 'Конфетти', 'Confetti'),
  tea: [L3("Suv qaynating", 'Вскипяти воду', 'Boil the water'), L3("Choy soling", 'Насыпь чай', 'Add the tea'), L3("Besh daqiqa kuting", 'Подожди пять минут', 'Wait five minutes')],
  gift: L3("Sovg'a", 'Подарок', 'Gift'),
  dance: { steps: [L3("Musiqani yoqing", 'Включи музыку', 'Turn on the music'), L3("Raqsga tushing", 'Танцуй', 'Dance'),
    L3("Tortni kesing", 'Разрежь торт', 'Cut the cake')], bad: 2 },
  own: { h: L3("Sevimli mevalar", 'Любимые фрукты', 'Favourite fruit'),
    items: [L3("Olma", 'Яблоко', 'Apple'), L3("Banan", 'Банан', 'Banana'), L3("Uzum", 'Виноград', 'Grapes')] }
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
  unknown: L3("«{bad}» tegi bizning sahifamizda yo'q. Ro'yxat uchun bizda ul, ol va li bor.", 'Тега «{bad}» на нашей странице нет. Для списка у нас есть ul, ol и li.', 'Our page has no “{bad}” tag. For lists we have ul, ol and li.'),
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
  // Списки (урок 3).
  textNoLi: L3("Bu matn li ichida emas, shuning uchun oldida nuqta yoki raqam yo'q. Har bir bandni li ichiga yozing.", 'Этот текст не внутри li, поэтому у него нет точки или номера. Каждый пункт пиши внутри li.', 'This text isn’t inside li, so it has no bullet or number. Write each item inside li.'),
  liOut: L3("li ro'yxat ichida yashaydi: oldin ochuvchi ul yoki ol tegini yozing.", 'li живёт внутри списка: сначала напиши открывающий тег ul или ol.', 'li lives inside a list: write the opening ul or ol tag first.'),
  listThere: L3("Ro'yxat allaqachon bor: uning ichiga faqat li qatorini yozing.", 'Список уже есть: внутри него напиши только строку li.', 'The list is already there: just write the li line inside it.'),
  olNeeded: L3("Qadamlarning tartibi muhim, shuning uchun bu yerda ul emas, ol kerak.", 'У шагов важен порядок, поэтому здесь нужен ol, а не ul.', 'The order of the steps matters, so you need ol here, not ul.'),
  moreItems: L3("Hozircha bandlar {n} ta. Kamida uchta li yozing.", 'Пока пунктов: {n}. Напиши не меньше трёх li.', 'There are {n} items so far. Write at least three li.'),
  manualNum: L3("Raqamni qo'lda yozmang. ol raqamlarni o'zi qo'yadi, aks holda ikkita raqam chiqadi.", 'Не пиши номер руками. ol ставит номера сам, иначе выйдет два номера.', 'Don’t type the number yourself. ol adds the numbers, otherwise you get two numbers.'),
  listMismatch: L3("Ro'yxat {tag} bilan ochilgan, demak u {tag} bilan yopiladi.", 'Список открыт тегом {tag}, значит, и закрывается тегом {tag}.', 'The list opens with {tag}, so it closes with {tag}.'),
  needList: L3("Sarlavha tayyor! Endi uning ostiga ro'yxat yozing: ul yoki ol.", 'Заголовок готов! Теперь под ним напиши список: ul или ol.', 'The heading is ready! Now write a list under it: ul or ol.'),
  oneList: L3("Bitta ro'yxat yetarli. Ortiqchasini olib tashlang.", 'Хватит одного списка. Лишнее убери.', 'One list is enough. Remove the extra part.'),
  wrongItem: L3("Bandda «{got}» chiqdi. Bizga «{want}» kerak.", 'В пункте вышло «{got}». А нужно «{want}».', 'The item says “{got}”. We need “{want}”.'),
  keepStep: L3("So'zlar o'zgarmasin: «{want}». Faqat qo'lda yozilgan raqamni o'chiring.", 'Пусть слова останутся прежними: «{want}». Убери только номер, вписанный руками.', 'Keep the words as they were: “{want}”. Only remove the hand-typed number.'),
  next: L3("Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Tug'ilgan kun", 'День рождения', 'Birthday'),
    say: L3("Salom! Ertaga mening tug'ilgan kunim! Mehmonlar uchun sayt tayyorladim: menyu, bezaklar, tort retsepti, tayyorgarlik va yana bitta bo'sh sahifa. Bo'sh sahifa sizniki bo'ladi! Hamma ro'yxatlar tayyor, faqat saytni saqlash qoldi. «Saqlash» tugmasini bosing.",
      'Привет! Завтра мой день рождения! Я сделал сайт для гостей: меню, украшения, рецепт торта, подготовка и ещё одна пустая страница. Пустая будет твоей! Все списки готовы, осталось только сохранить сайт. Нажми «Сохранить».',
      'Hi! Tomorrow is my birthday! I made a website for the guests: menu, decorations, cake recipe, getting ready and one more empty page. The empty one will be yours! All the lists are ready, I just need to save the site. Tap “Save”.'),
    broke: L3("Voy! Saqlash paytida ro'yxatlar buzildi. Teglar yo'qolib qoldi, bandlar esa bitta qatorga yopishib ketdi.",
      'Ой! При сохранении списки сломались. Теги пропали, а пункты слиплись в одну строку.',
      'Oh no! The lists broke while saving. The tags got lost, and the items are glued into one line.'),
    done: L3("O'tgan darsda ro'yxatlar bilan tanishdik: ul, ol va li teglari. Endi shu bilim bilan beshta sahifani birma-bir tuzatamiz. Kodni o'zingiz yozasiz, men esa yoningizdaman. Beshinchi sahifada esa o'z ro'yxatingizni tuzasiz!",
      'На прошлом уроке мы познакомились со списками: теги ul, ol и li. Теперь с этими знаниями починим пять страниц по одной. Код пишешь ты, а я рядом. А на пятой странице будет твой собственный список!',
      'Last lesson we met lists: the ul, ol and li tags. Now let’s use that to fix the five pages one by one. You write the code, and I’ll be right here. And on the fifth page you’ll make your own list!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("Beshta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим пять страниц — код пишешь ты', 'Let’s fix five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Menyu", 'Меню', 'Menu'),
    say: L3("Birinchi sahifa: menyu. Bu nuqtali ro'yxat, ya'ni ul tegi degani. Uning ichida har bir taom o'z li tegida turadi. Uchinchi band bo'sh qolgan. li ichiga «Sharbat» deb yozing.",
      'Первая страница: меню. Это список с точками, то есть тег ul. Внутри каждое блюдо стоит в своём теге li. Третий пункт пустой. Впиши в li слово «Сок».',
      'The first page is the menu. It’s a bulleted list, that is, the ul tag. Inside it, each dish sits in its own li tag. The third item is empty. Type “Juice” inside li.'),
    ask: L3("li ichiga «Sharbat» deb yozing", 'Впиши в li: «Сок»', 'Type “Juice” inside li'),
    ok: L3("Ajoyib! Menyuda yangi band paydo bo'ldi, oldida nuqta ham bor!", 'Отлично! В меню появился новый пункт, и у него есть точка!', 'Great! A new item appeared on the menu, and it has a bullet!'),
    hints: [
      L3("Bo'sh bandni toping: ochuvchi va yopuvchi li teglari bor, ichi esa bo'sh.", 'Найди пустой пункт: открывающий и закрывающий li есть, а внутри пусто.', 'Find the empty item: the opening and closing li tags are there, but it’s empty inside.'),
      L3("Shu ikkita li tegi o'rtasidagi bo'sh joyga yozing.", 'Пиши в пустое место между этими двумя тегами li.', 'Type in the empty spot between those two li tags.'),
      L3("Masalan, salat bandi shunday bo'ladi. Siz esa «Sharbat» deb yozing.", 'Например, пункт про салат выглядит так. А ты впиши «Сок».', 'For example, a salad item looks like this. You type “Juice”.')
    ],
    drill: L3("Endi bandni «Muzqaymoq» qiling", 'А теперь пункт «Мороженое»', 'Now make the item “Ice cream”')
  },
  t2: {
    eyebrow: L3("Bezaklar", 'Украшения', 'Decorations'),
    say: L3("Menyu tayyor, endi bezaklar. Bu ro'yxatda bitta band o'chib ketgan. Bo'sh qatorga butun bandni yozing: ochuvchi li tegi, «Sharlar» so'zi va yopuvchi li tegi.",
      'Меню готово, теперь украшения. В этом списке стёрся один пункт. Напиши в пустой строке весь пункт: открывающий тег li, слово «Шарики» и закрывающий тег li.',
      'The menu is done, now the decorations. One item in this list got erased. Write the whole item in the empty line: the opening li tag, the word “Balloons” and the closing li tag.'),
    ask: L3("li qatorini yozing: «Sharlar»", 'Напиши строку li: «Шарики»', 'Write the li line: “Balloons”'),
    ok: L3("Barakalla! Butun bandni o'zingiz yozdingiz, endi sharlar ham ro'yxatda!", 'Вот это да! Весь пункт написан твоими руками, теперь и шарики в списке!', 'Wow! You wrote the whole item, and now the balloons are on the list!'),
    hints: [
      L3("ul ro'yxati allaqachon bor. Unga faqat yangi band kerak, band esa li tegida yoziladi.", 'Список ul уже есть. Нужен только новый пункт, а пункт пишут в теге li.', 'The ul list is already there. It just needs a new item, and an item goes in the li tag.'),
      L3("Qator uch qismdan iborat: ochuvchi li tegi, so'z va yopuvchi li tegi. Yopuvchi tegda qiya chiziq bor.", 'В строке три части: открывающий тег li, слово и закрывающий тег li. В закрывающем есть косая черта.', 'The line has three parts: the opening li tag, the word and the closing li tag. The closing one has a slash.'),
      L3("Mana, gullar bandining qatori. Siz ham xuddi shunday yozing, faqat «Sharlar» so'zi bilan.", 'Вот строка пункта про цветы. Напиши так же, только со словом «Шарики».', 'Here’s the line for a flowers item. Write it the same way, just with the word “Balloons”.')
    ],
    drill: L3("Endi yana bir band: «Konfetti»", 'Теперь ещё пункт: «Конфетти»', 'One more item: “Confetti”')
  },
  t3: {
    eyebrow: L3("Tort retsepti", 'Рецепт торта', 'Cake recipe'),
    say: L3("Ikki sahifa tayyor! Uchinchisi: tort retsepti. Bu yerda qadamlar yo'qolgan. Qadamlarning tartibi muhim, shuning uchun bizga raqamli ro'yxat kerak, ya'ni ol tegi degani. ol ichida kamida uchta qadam yozing, har biri o'z li tegida bo'lsin. Raqamlarni yozmang, brauzer ularni o'zi qo'yadi.",
      'Две страницы готовы! Третья: рецепт торта. Здесь пропали шаги. У шагов важен порядок, поэтому нам нужен список с номерами, то есть тег ol. Напиши в ol не меньше трёх шагов, каждый в своём li. Номера не пиши: браузер поставит их сам.',
      'Two pages are done! The third is the cake recipe. The steps are gone here. The order of the steps matters, so we need a numbered list, that is, the ol tag. Write at least three steps inside ol, each in its own li. Don’t type the numbers, the browser adds them itself.'),
    ask: L3("ol ro'yxatini yozing: kamida uchta li", 'Напиши список ol: не меньше трёх li', 'Write an ol list: at least three li'),
    ok: L3("Zo'r! Qadamlar raqamlandi, raqamlarni esa brauzer o'zi qo'ydi!", 'Огонь! Шаги пронумерованы, а номера браузер поставил сам!', 'Awesome! The steps are numbered, and the browser added the numbers itself!'),
    hints: [
      L3("Tartib muhim bo'lsa, raqamli ro'yxat kerak: ol tegi. Har bir qadam esa li ichida turadi.", 'Если важен порядок, нужен список с номерами: тег ol. А каждый шаг стоит внутри li.', 'If order matters, you need a numbered list: the ol tag. And each step sits inside li.'),
      L3("Oldin ochuvchi ol tegi, keyin uchta li qatori, oxirida yopuvchi ol tegi.", 'Сначала открывающий тег ol, потом три строки li, в конце закрывающий тег ol.', 'First the opening ol tag, then three li lines, and the closing ol tag at the end.'),
      L3("Mana, choy damlash qadamlari. Siz ham shunday yozing, faqat tort haqida.", 'Вот шаги для чая. Напиши так же, только про торт.', 'Here are the steps for making tea. Write yours the same way, just about the cake.')
    ],
    drill: L3("Endi sovg'a o'rash qadamlarini yozing: ol va uchta li", 'Теперь шаги, как упаковать подарок: ol и три li', 'Now the steps to wrap a gift: ol and three li')
  },
  t4: {
    eyebrow: L3("Tayyorgarlik", 'Подготовка', 'Getting ready'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: tayyorgarlik. Qarang, bu yerda g'alati: bitta qadamda raqam ikki marta chiqyapti. Demak, kodning bir qatori buzilgan. Oldin o'sha qatorni toping va ustiga bosing.",
      'Три страницы готовы! Четвёртая: подготовка. Смотри, тут странно: у одного шага номер выходит два раза. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is getting ready. Look, something’s odd here: one step shows its number twice. So one line of code is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Bu qatorda raqam qo'lda yozilgan. Lekin ol raqamni o'zi qo'yadi, shuning uchun ikkita raqam chiqdi. Qo'lda yozilgan raqamni o'chiring.",
      'Нашлась! В этой строке номер вписан руками. Но ol ставит номер сам, поэтому вышло два номера. Убери номер, вписанный руками.',
      'Found it! The number in this line was typed by hand. But ol adds the number itself, so there are two numbers. Remove the hand-typed number.'),
    ok: L3("Ura, ishladi! Endi har bir qadamda bitta raqam. Buzilgan joyni xuddi haqiqiy dasturchidek topdingiz!", 'Ура, заработало! Теперь у каждого шага один номер. Поломка найдена, как у настоящего программиста!', 'Yes, it works! Now each step has one number. You found the bug like a real developer!'),
    why: {
      0: L3("body shu yerda ochiladi, bu qator joyida. Sahifadagi raqamlarga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на номера на странице.', 'body opens here, this line is fine. Look at the numbers on the page.'),
      1: L3("Sarlavha h1 to'g'ri ochilgan va yopilgan. Bu qator joyida.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("ol shu yerda ochiladi, bu qator joyida. Qaysi qadamda ikkita raqam bor?", 'Здесь открывается ol, строка в порядке. У какого шага два номера?', 'ol opens here, this line is fine. Which step has two numbers?'),
      step: L3("Bu qadam joyida: unda raqam bitta. Ikkita raqam qaysi qadamda chiqyapti?", 'Этот шаг в порядке: номер у него один. У какого шага два номера?', 'This step is fine: it has one number. Which step shows two numbers?'),
      6: L3("ol shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается ol, строка в порядке.', 'ol closes here, this line is fine.'),
      7: L3("body shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Sahifaga qarang: qaysi qadamda raqam ikki marta chiqyapti?", 'Посмотри на страницу: у какого шага номер выходит два раза?', 'Look at the page: which step shows its number twice?'),
      L3("O'sha qadamning qatoriga qarang: li ichida nima ortiqcha?", 'Посмотри на строку этого шага: что лишнее внутри li?', 'Look at that step’s line: what’s extra inside li?'),
      L3("Mana, to'g'ri qadam: raqamsiz. Siz ham qo'lda yozilgan raqamni o'chiring.", 'Вот правильный шаг: без номера. Убери и ты номер, вписанный руками.', 'Here’s a proper step: no number. Remove the hand-typed number too.')
    ],
    drill: L3("Bu sahifada ham xuddi shunday: buzilgan qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening ro'yxatim", 'Мой список', 'My list'),
    say: L3("To'rtta sahifa yonib turibdi! Endi beshinchisi: sizning ro'yxatingiz. Bu yerda faqat body bor. Eng tepada h1 tegida sarlavha yozing. Keyin ro'yxat: nuqtali ul yoki raqamli ol, unda kamida uchta band bo'lsin. Mavzuni o'zingiz tanlang: sevimli o'yinlar, sovg'alar yoki bayram taomlari. Chizma yo'l ko'rsatib turadi.",
      'Четыре страницы горят! Теперь пятая: твой список. Здесь есть только body. В самом верху напиши заголовок в теге h1. Потом список: ul с точками или ol с номерами, и в нём не меньше трёх пунктов. Тему выбирай сам: любимые игры, подарки или праздничные блюда. Схема подскажет дорогу.',
      'Four pages are lit! Now the fifth: your list. There’s only body here. At the very top, write a heading in the h1 tag. Then a list: a bulleted ul or a numbered ol, with at least three items. Pick the topic yourself: favourite games, presents or party food. The plan will show you the way.'),
    ask: L3("body ichiga: h1, ul yoki ol, uchta li", 'В body: h1, ul или ol, три li', 'Inside body: h1, ul or ol, three li'),
    ok: L3("Bu juda zo'r chiqdi! Sarlavha ham, ro'yxat ham butunlay sizniki!", 'Это было мощно! И заголовок, и список — полностью твои!', 'That was awesome! The heading and the list are all yours!'),
    hints: [
      L3("Chizmaga qarang: oldin h1, keyin ro'yxat, uning ichida esa li bandlari.", 'Посмотри на схему: сначала h1, потом список, а внутри него пункты li.', 'Look at the plan: first h1, then a list, with li items inside it.'),
      L3("Ro'yxat ochuvchi ul yoki ol tegi bilan boshlanadi va o'sha teg bilan yopiladi. Har bir band li ichida turadi.", 'Список начинается открывающим тегом ul или ol и закрывается тем же тегом. Каждый пункт стоит внутри li.', 'A list starts with the opening ul or ol tag and closes with the same tag. Each item sits inside li.'),
      L3("Mana, sevimli mevalar ro'yxati. Xuddi shunday yozing, faqat o'z mavzuingiz bilan.", 'Вот список любимых фруктов. Напиши так же, только про своё.', 'Here’s a list of favourite fruit. Write yours the same way, about your own topic.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, bayram saytining beshta sahifasi ham tayyor! Endi mehmonlarni kutsa bo'ladi.", 'Смотри, все пять страниц праздничного сайта готовы! Теперь можно ждать гостей.', 'Look, all five pages of the party site are ready! Now we can wait for the guests.') },
      { k: 'ul', text: L3("Tartibi muhim bo'lmagan ro'yxatni ul tegiga yozdingiz, unda nuqtalar chiqdi.", 'Список, где порядок не важен, стоял в ul, и у пунктов появились точки.', 'You put the list where order doesn’t matter in ul, and it got bullets.') },
      { k: 'ol', text: L3("Qadamlar uchun ol tegini tanladingiz va raqamlarni brauzerning o'ziga qoldirdingiz.", 'Для шагов выбран ol, а номера оставлены самому браузеру.', 'You picked ol for the steps and left the numbers to the browser.') },
      { k: 'li', text: L3("Har bir bandni o'z li tegiga yozdingiz va yopishni ham unutmadingiz.", 'Каждый пункт стоял в своём li, и все li закрыты.', 'You put each item in its own li and didn’t forget to close it.') },
      { k: 'own', text: L3("Oxirida esa butun ro'yxatni o'zingiz tuzdingiz. Bu juda kuchli bo'ldi! Keyingi darsda havolalar bilan tanishamiz.", 'А в конце весь список составлен твоими руками. Это было мощно! На следующем уроке познакомимся со ссылками.', 'And at the end you made a whole list yourself. That was awesome! Next lesson we’ll meet links.') }
    ],
    roles: {
      ul: L3("ul — nuqtali ro'yxat", 'ul — список с точками', 'ul — bulleted list'),
      ol: L3("ol — raqamli ro'yxat", 'ol — список с номерами', 'ol — numbered list'),
      li: L3("li — ro'yxat bandi", 'li — пункт списка', 'li — list item'),
      own: L3("Ro'yxatni o'zim tuzdim", 'Свой список с нуля', 'My own list')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { ul: 1, ol: 1, li: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a3.css@*/
`;
