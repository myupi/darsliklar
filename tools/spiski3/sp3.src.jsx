// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 3 — «Списки»
// (бумажный коллаж, по эталону урока 1). Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/spiski3/sp3.src.jsx lessons/html/03-spiski.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Списки» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (22.10.2026, по эталону — урок 1 «Бумажная страница»; материал —
// ролик html3.mp4 «Списки»). Тот же бумажный стиль: лист с рваным краем,
// вырезки с фактурой и тенью, stop-motion, шорох бумаги, переход «разбор и
// сборка», честный бумажный браузер. Образ из ролика: бирюзовый лист — список с
// точками (ul), горчичный — список с номерами (ol), пункты — кремовые полоски.
// Сюжет: класс идёт в поход; записки Коди (вещи и рецепт какао) перемешаны,
// ученик раскладывает их в списки, чинит сломанные и собирает свой.
//
// ДУГА (15 экранов): s1 крючок (полоски разлетаются по двум листам) · s2 план ·
// тройки «объяснение → сам делаешь → закрепление»: пункт li в списке ul (s3–s5),
// список с номерами ol (s6–s8), li только внутри списка и закрытый список
// (s9–s11), своя страница со списком (s12–s14) · s15 вывод.
// Сценарий — docs/scenarij-03-spiski-bumaga.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь.
//   · Честный браузер: точку или номер ставит только li; текст в ul без li —
//     без точки, склеен в строку; номера ol идут по порядку строк; li после
//     </ul> стоит без отступа; без </ul> абзац ниже сдвинут, как часть списка;
//     <li> вместо </li> даёт лишний пустой пункт (так и в настоящем браузере).
//   · Конфетти только в финале: похвалы экранов — поза smile.
//
// СИСТЕМА СЛОВ. Список — ro‘yxat; ul — список с точками (nuqtali ro‘yxat),
// ol — список с номерами (raqamli ro‘yxat); li — пункт (band). Как в уроках
// 1–2: teg, yorliq — только вкладка, oyna — окно, sarlavha, xatboshi.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-03-spiski',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '3-dars. Ro‘yxatlar',
    ru: 'Урок 3. Списки',
    en: 'Lesson 3. Lists'
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
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Havolalar', 'Ссылки', 'Links'),
  sort: L3('Saralash', 'Разложить', 'Sort'),
  shuffle: L3('Chalkashtirish', 'Перемешать', 'Shuffle'),
  read: L3('Brauzerdek o‘qish', 'Читать как браузер', 'Read like a browser'),
  things: L3('Narsalar', 'Вещи', 'Things'),
  cocoa: L3('Kakao', 'Какао', 'Cocoa'),
  mySite: L3('Mening ro‘yxatim', 'Мой список', 'My list'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ПОХОД — сквозной пример урока (как в ролике): вещи и рецепт какао.
// ─────────────────────────────────────────────────────────────────────────────
const TRIP = {
  title: L3('Sinf sayohati', 'Поход класса', 'Class trip'),
  things: [L3('fonar', 'фонарик', 'flashlight'), L3('ryukzak', 'рюкзак', 'backpack'), L3('buterbrodlar', 'бутерброды', 'sandwiches')],
  steps: [L3('Sut quying', 'Налей молоко', 'Pour the milk'), L3('Kakao qo‘shing', 'Добавь какао', 'Add the cocoa'), L3('Aralashtiring', 'Размешай', 'Stir')]
};
// Короткие слова для раундов (s5, s11).
const WORDS = [L3('kompas', 'компас', 'compass'), L3('qalpoq', 'шапка', 'hat'), L3('suv', 'вода', 'water'),
  L3('xarita', 'карта', 'map'), L3('to‘p', 'мяч', 'ball'), L3('choynak', 'чайник', 'kettle')];

// Теги списка вокруг пунктов, набранные в два поля (s7): что не так.
const LIST_MSGS = {
  needOpen: L3('Bandlardan oldin ochuvchi {tag} tegi kerak.', 'Перед пунктами нужен открывающий тег {tag}.', 'Before the items you need the opening {tag} tag.'),
  openSlash: L3('Bu yopuvchi teg. Tepada qiya chiziqsiz ochuvchi teg turadi.', 'Это закрывающий тег. Сверху ставят открывающий, без косой черты.', 'That’s a closing tag. The opening tag goes on top, without a slash.'),
  needClose: L3('Bandlardan keyin yopuvchi {tag} tegi kerak.', 'После пунктов нужен закрывающий тег {tag}.', 'After the items you need the closing {tag} tag.'),
  needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda {tag} dan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needLt: L3('Teg chap «<» qavs bilan boshlanadi.', 'Тег начинается с уголка «<».', 'A tag starts with the bracket “<”.'),
  needGt: L3('Teg oxirida o‘ng «>» qavs turadi.', 'В конце тега нужен уголок «>».', 'A tag ends with the bracket “>”.'),
  wrongName: L3('Teg ichida {tag} bo‘lishi kerak.', 'Внутри тега должно быть {tag}.', 'The tag should say {tag}.')
};
// Пункт, набранный в два поля (s4).
const ITEM_MSGS = Object.assign({}, LIST_MSGS, {
  needOpen: L3('So‘zdan oldin ochuvchi {tag} tegi kerak.', 'Перед словом нужен открывающий тег {tag}.', 'Before the word you need the opening {tag} tag.'),
  openSlash: L3('Bu yopuvchi teg. So‘zdan oldin qiya chiziqsiz ochuvchi teg turadi.', 'Это закрывающий тег. Перед словом ставят открывающий, без косой черты.', 'That’s a closing tag. Before the word goes the opening tag, without a slash.'),
  needClose: L3('So‘zdan keyin yopuvchi {tag} tegi kerak.', 'После слова нужен закрывающий тег {tag}.', 'After the word you need the closing {tag} tag.')
});

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения. Звучат: say, done, ok, msgs,
// hints, why, miss …; печатаются: eyebrow, ask, cards.title, word, items.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Sayohatga tayyorgarlik', 'Сборы в поход', 'Packing for a trip'),
    say: L3('Sinfimiz sayohatga chiqadi. Mana mening yozuvlarim: narsalar va kakao retsepti, hammasi aralashib ketgan.',
      'Наш класс идёт в поход. Вот мои записки: вещи и рецепт какао — всё вперемешку.',
      'Our class is going on a trip. Here are my notes: things to pack and a cocoa recipe, all mixed up.'),
    magicUl: L3('Narsalar nuqtali ro‘yxatga tushdi: ularning tartibi muhim emas.', 'Вещи легли в список с точками: их порядок не важен.', 'The things went into a list with dots: their order doesn’t matter.'),
    magicOl: L3('Retsept qadamlari esa raqamli ro‘yxatga tushdi: ular tartib bilan bajariladi.', 'А шаги рецепта — в список с номерами: их делают по порядку.', 'And the recipe steps went into a numbered list: you do them in order.'),
    done: L3('Bugun shunday ro‘yxatlarni HTML da yasashni o‘rganasiz va o‘z ro‘yxatingizni tuzasiz!', 'Сегодня ты научишься делать такие списки в HTML и соберёшь свой!', 'Today you’ll learn to make lists like these in HTML and build your own!'),
    ask: L3('«Saralash» tugmasini bosing', 'Нажми «Разложить»', 'Tap “Sort”'),
    askDone: L3('Nuqtali va raqamli ro‘yxat', 'Список с точками и список с номерами', 'A list with dots and a numbered list')
  },
  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Mana bugungi dars rejasi. Unda to‘rtta qadam bor.', 'Вот план урока. В нём четыре шага.', 'Here’s the plan for today. It has four steps.'),
    cards: [
      { title: L3('Nuqtali ro‘yxat', 'Список с точками', 'A list with dots'),
        say: L3('Avval nuqtali ro‘yxat yasaymiz: sayohat uchun narsalar.', 'Сначала сделаем список с точками — вещи в поход.', 'First we’ll make a list with dots: things for the trip.') },
      { title: L3('Raqamli ro‘yxat', 'Список с номерами', 'A numbered list'),
        say: L3('Keyin raqamli ro‘yxat: qadamlar tartib bilan.', 'Потом список с номерами: шаги по порядку.', 'Then a numbered list: steps in order.') },
      { title: L3('Ro‘yxatni tuzatish', 'Починим список', 'Fixing lists'),
        say: L3('Uchinchi qadamda buzilgan ro‘yxatlarni tuzatamiz.', 'Третий шаг — починим сломанные списки.', 'Step three: we’ll fix broken lists.') },
      { title: L3('O‘z ro‘yxatingiz', 'Свой список', 'Your own list'),
        say: L3('Oxirida esa o‘z ro‘yxatingizni tuzasiz!', 'А в конце ты соберёшь свой список!', 'And at the end you’ll build your own list!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  s3: {
    eyebrow: L3('Ro‘yxat bandlari', 'Пункты списка', 'List items'),
    say: L3('Bu sayohat uchun narsalar ro‘yxati. Ular ul tegi ichida turibdi, lekin brauzer hammasini bitta qatorga yopishtirdi.',
      'Это список вещей в поход. Они стоят внутри тега ul, но браузер склеил их в одну строку.',
      'This is a list of things for the trip. They sit inside the ul tag, but the browser glued them into one line.'),
    sayLi: L3('Ro‘yxatning har bir bandi li tegiga o‘raladi. Har bir narsani bosing.', 'Каждый пункт списка оборачивают в тег li. Нажми каждую вещь.', 'Each list item is wrapped in the li tag. Tap each thing.'),
    doneUl: L3('ul — nuqtali ro‘yxat. Brauzer har bir band oldiga nuqta qo‘yadi.', 'ul — это список с точками. Браузер ставит точку перед каждым пунктом.', 'ul is a list with dots. The browser puts a dot before each item.'),
    doneLi: L3('li esa ro‘yxatning bitta bandi. Nechta li bo‘lsa, shuncha band.', 'А li — один пункт списка. Сколько li — столько пунктов.', 'And li is one list item. As many li tags, as many items.'),
    ask: L3('Har bir narsani bosing', 'Нажми каждую вещь', 'Tap each thing')
  },
  s4: {
    eyebrow: L3('Band qo‘shing', 'Добавь пункт', 'Add an item'),
    say: L3('Uxlash xaltasi ham kerak. Lekin uning oldida nuqta yo‘q: u hali band emas. Uni li tegiga o‘rang: so‘zdan oldin ochuvchi tegni, keyin yopuvchi tegni yozing.',
      'Ещё нужен спальник. Но точки перед ним нет: это ещё не пункт. Оберни его в тег li: перед словом напиши открывающий тег, после — закрывающий.',
      'We also need a sleeping bag. But there’s no dot before it: it’s not an item yet. Wrap it in li: type the opening tag before the word and the closing tag after it.'),
    hints: [
      L3('Band qaysi teg bilan boshlanib, qaysi teg bilan tugaydi?', 'Каким тегом начинается и заканчивается пункт?', 'Which tag starts and ends an item?'),
      L3('Band tegi li. Yopuvchisida qiya chiziq bor.', 'Тег пункта — li. В закрывающем есть косая черта.', 'The item tag is li. The closing one has a slash.'),
      L3('Birinchi joyga ochuvchi li, ikkinchisiga yopuvchi li yozing.', 'В первое место — открывающий li, во второе — закрывающий li.', 'Type the opening li in the first spot and the closing li in the second.')
    ],
    ok: L3('To‘g‘ri! Uxlash xaltasi oldida nuqta paydo bo‘ldi: endi u ro‘yxat bandi.', 'Есть! Перед спальником появилась точка — теперь это пункт списка.', 'Yes! A dot appeared before the sleeping bag: now it’s a list item.'),
    ask: L3('Uxlash xaltasini li tegiga o‘rang', 'Оберни спальник в тег li', 'Wrap the sleeping bag in li'),
    word: L3('uxlash xaltasi', 'спальник', 'sleeping bag')
  },
  s5: {
    eyebrow: L3('Nechta nuqta?', 'Сколько точек?', 'How many dots?'),
    say: L3('Endi brauzer kabi o‘ylang: nuqtalarni qatorlar emas, li teglari qo‘yadi.', 'Теперь подумай как браузер: точки ставят не строки, а теги li.', 'Now think like a browser: dots come from li tags, not from lines.'),
    askQ: L3('Brauzer nechta nuqta ko‘rsatadi?', 'Сколько точек покажет браузер?', 'How many dots will the browser show?'),
    ok: L3('To‘g‘ri! li nechta bo‘lsa, nuqta shuncha.', 'Верно! Сколько li — столько и точек.', 'Right! As many li tags, as many dots.'),
    miss: {
      many: L3('Qarang: qator bitta, lekin li ikkita. Har bir li o‘z nuqtasini oladi.', 'Смотри: строка одна, а li два. Каждый li получает свою точку.', 'Look: one line, but two li tags. Each li gets its own dot.'),
      one: L3('Qarang: qatorlar ikkita, lekin li bitta. Demak, band ham bitta.', 'Смотри: строк две, а li один. Значит, и пункт один.', 'Look: two lines, but only one li. So there is one item.'),
      bare: L3('Qarang: li siz matn oldida nuqta yo‘q. Nuqtani faqat li qo‘yadi.', 'Смотри: у текста без li точки нет. Точку ставит только li.', 'Look: text without li gets no dot. Only li puts a dot.')
    },
    done: L3('Tushunarli: koddagi qatorlar emas, li teglari muhim.', 'Главное понятно: важны не строки, а теги li.', 'Got it: what matters is the li tags, not the lines.')
  },
  s6: {
    eyebrow: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
    say: L3('Bu kakao retsepti. U ol tegida yozilgan: bu raqamli ro‘yxat.', 'Это рецепт какао. Он записан в теге ol — это список с номерами.', 'This is a cocoa recipe. It’s written in the ol tag: a numbered list.'),
    sayN: L3('Raqamlarni brauzer o‘zi qo‘yadi. «Chalkashtirish» tugmasini bosing.', 'Номера браузер ставит сам. Нажми «Перемешать».', 'The browser adds the numbers by itself. Tap “Shuffle”.'),
    mixed: L3('Voy! Raqamlar joyida, qadamlar esa chalkashib ketdi. Sut quymasdan aralashtirib bo‘lmaydi!', 'Ой! Номера на месте, а шаги перепутались. Размешивать раньше молока — ерунда!', 'Whoa! The numbers stayed, but the steps got mixed up. Stirring before the milk makes no sense!'),
    done: L3('ol da qatorlar tartibi muhim. ul da esa tartib muhim emas.', 'В ol важен порядок строк. А в ul порядок не важен.', 'In ol, the order of lines matters. In ul, it doesn’t.'),
    ask: L3('«Chalkashtirish» tugmasini bosing', 'Нажми «Перемешать»', 'Tap “Shuffle”'),
    askDone: L3('ol da tartib muhim', 'В ol важен порядок', 'In ol, order matters')
  },
  s7: {
    eyebrow: L3('Raqamlar qo‘shing', 'Добавь номера', 'Add numbers'),
    say: L3('Bu ryukzakni yig‘ish qadamlari. Ular tartib bilan bajariladi, demak raqamlar kerak. Tepaga ochuvchi ol tegini, pastga yopuvchi ol tegini yozing.',
      'Это шаги, как собрать рюкзак. Их делают по порядку — значит, нужны номера. Напиши сверху открывающий тег ol, а снизу — закрывающий.',
      'These are the steps to pack a backpack. You do them in order, so they need numbers. Type the opening ol tag at the top and the closing one at the bottom.'),
    hints: [
      L3('Raqamli ro‘yxat qaysi teg bilan yoziladi?', 'Каким тегом пишут список с номерами?', 'Which tag makes a numbered list?'),
      L3('Bu ol. Ro‘yxat ochuvchi ol bilan boshlanib, yopuvchi ol bilan tugaydi.', 'Это ol. Список начинается открывающим ol и заканчивается закрывающим.', 'It’s ol. The list starts with the opening ol and ends with the closing one.'),
      L3('Tepadagi joyga ochuvchi ol, pastdagisiga qiya chiziqli yopuvchi ol yozing.', 'В верхнее место — открывающий ol, в нижнее — закрывающий, с косой чертой.', 'Top spot: the opening ol. Bottom spot: the closing ol, with a slash.')
    ],
    ok: L3('To‘g‘ri! Qadamlar raqamlandi.', 'Верно! У шагов появились номера.', 'Right! The steps got numbers.'),
    ask: L3('Tepaga va pastga ol teglarini yozing', 'Напиши теги ol сверху и снизу', 'Type the ol tags at the top and bottom'),
    steps: [L3('Uxlash xaltasini pastga qo‘ying', 'Положи спальник вниз', 'Put the sleeping bag at the bottom'),
      L3('Ustiga ovqatni qo‘ying', 'Сверху положи еду', 'Put the food on top'),
      L3('Fonarni cho‘ntakka soling', 'Фонарик убери в карман', 'Put the flashlight in the pocket')],
    title: L3('Ryukzak', 'Рюкзак', 'Backpack')
  },
  s8: {
    eyebrow: L3('ul yoki ol?', 'ul или ol?', 'ul or ol?'),
    say: L3('Mana to‘rtta ro‘yxat. Tartib muhim bo‘lganlarini ol ga, muhim bo‘lmaganlarini ul ga torting.',
      'Вот четыре списка. Те, где важен порядок, перетащи в ol, а где не важен — в ul.',
      'Here are four lists. Drag the ones where order matters into ol, and the others into ul.'),
    hints: [
      L3('O‘zingizdan so‘rang: qaysi band birinchi turishi muhimmi?', 'Спроси себя: важно, какой пункт идёт первым?', 'Ask yourself: does it matter which item comes first?'),
      L3('Qadamlar va topdagi o‘rinlar tartib bilan boradi: bu ol. Xarid va do‘stlar ro‘yxati esa ul.', 'Шаги и места в топе идут по порядку — это ol. Покупки и друзья — это ul.', 'Steps and places in a top list go in order: that’s ol. Shopping and friends: ul.'),
      L3('Yonib turgan ro‘yxatni yonib turgan varaqqa torting.', 'Перетащи светящийся список на светящийся лист.', 'Drag the glowing list onto the glowing sheet.')
    ],
    ok: L3('To‘g‘ri! Har bir ro‘yxat o‘z joyida.', 'Верно! Каждый список на своём месте.', 'Right! Every list is in its place.'),
    ask: L3('Ro‘yxatni ul yoki ol ga torting', 'Перетащи список в ul или ol', 'Drag a list into ul or ol'),
    askPlace: L3('Endi ul yoki ol varag‘ini bosing', 'Теперь нажми лист ul или ol', 'Now tap the ul or ol sheet'),
    pickFirst: L3('Avval ro‘yxatni bosing.', 'Сначала нажми список.', 'Tap a list first.'),
    cards: [
      { id: 'shop', want: 'ul', title: L3('Do‘kondan', 'Купить', 'Shopping'),
        items: L3(['non', 'pishloq', 'olma'], ['хлеб', 'сыр', 'яблоки'], ['bread', 'cheese', 'apples']),
        why: L3('Xaridda tartib muhim emas: baribir hammasini olasiz. Bu ul.', 'В покупках порядок не важен: купишь всё. Это ul.', 'Order doesn’t matter for shopping: you’ll buy it all. That’s ul.') },
      { id: 'morning', want: 'ol', title: L3('Ertalab', 'Утро', 'Morning'),
        items: L3(['turing', 'yuvining', 'nonushta qiling'], ['встань', 'умойся', 'позавтракай'], ['get up', 'wash', 'have breakfast']),
        why: L3('Ertalabki ishlar tartib bilan qilinadi: avval turasiz. Bu ol.', 'Утренние дела идут по порядку: сначала встаёшь. Это ol.', 'Morning things go in order: first you get up. That’s ol.') },
      { id: 'top', want: 'ol', title: L3('Top-3 o‘yin', 'Топ‑3 игр', 'Top 3 games'),
        items: L3(['futbol', 'shaxmat', 'Minecraft'], ['футбол', 'шахматы', 'Minecraft'], ['football', 'chess', 'Minecraft']),
        why: L3('Topda o‘rin muhim: birinchisi eng yaxshisi. Bu ol.', 'В топе важно место: первый — самый лучший. Это ol.', 'In a top list, the place matters: number one is the best. That’s ol.') },
      { id: 'friends', want: 'ul', title: L3('Do‘stlarim', 'Мои друзья', 'My friends'),
        items: L3(['Ali', 'Nodira', 'Timur'], ['Али', 'Нодира', 'Тимур'], ['Ali', 'Nodira', 'Timur']),
        why: L3('Do‘stlar ro‘yxatida tartib muhim emas. Bu ul.', 'В списке друзей порядок не важен. Это ul.', 'Order doesn’t matter in a list of friends. That’s ul.') }
    ]
  },
  s9: {
    eyebrow: L3('Band ro‘yxat ichida', 'Пункт внутри списка', 'Item inside the list'),
    say: L3('Qarang: buterbrodlar bandi ro‘yxatdan tushib qoldi. U yopuvchi ul tegidan keyin turibdi, shuning uchun boshqalar bilan bir qatorda emas.',
      'Смотри: пункт с бутербродами выпал из списка. Он стоит после закрывающего тега ul, поэтому и не в ряд с остальными.',
      'Look: the sandwiches item fell out of the list. It’s after the closing ul tag, so it doesn’t line up with the others.'),
    sayDo: L3('li faqat ul yoki ol ichida turadi, papkadagi varaq kabi. Bandni ro‘yxat ichiga torting.', 'li живёт только внутри ul или ol, как листок в папке. Перетащи пункт обратно в список.', 'li lives only inside ul or ol, like a sheet in a folder. Drag the item back into the list.'),
    done: L3('Qaytdi! Endi hamma bandlar ul ichida va bir qatorda.', 'Вернулся! Теперь все пункты внутри ul и стоят ровно.', 'It’s back! Now every item is inside ul and lines up.'),
    ask: L3('Bandni ro‘yxat ichiga torting', 'Перетащи пункт внутрь списка', 'Drag the item into the list'),
    askPlace: L3('Endi ro‘yxat ichidagi joyni bosing', 'Теперь нажми место внутри списка', 'Now tap the spot inside the list'),
    pickFirst: L3('Avval tushib qolgan bandni bosing.', 'Сначала нажми выпавший пункт.', 'Tap the fallen item first.'),
    wrong: L3('Bu joy ro‘yxatdan tashqarida. Band ochuvchi va yopuvchi ul orasida turishi kerak.', 'Это место снаружи списка. Пункт должен стоять между открывающим и закрывающим ul.', 'That spot is outside the list. The item must go between the opening and closing ul.')
  },
  s10: {
    eyebrow: L3('Ro‘yxatni yoping', 'Закрой список', 'Close the list'),
    say: L3('Voy, yig‘ilish haqidagi matn ham o‘ngga surilib qoldi, go‘yo u ro‘yxatning bir qismi. Ro‘yxat yopilmagan: brauzer u qayerda tugashini bilmaydi. Bo‘sh joyga yopuvchi ul tegini yozing.',
      'Ой, текст про сбор тоже сдвинулся вправо, будто он часть списка. Список не закрыт — браузер не знает, где он кончается. Допиши в пустое место закрывающий тег ul.',
      'Oops, the text about meeting up moved right too, as if it were part of the list. The list isn’t closed: the browser doesn’t know where it ends. Type the closing ul tag in the empty spot.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda ul dan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед ul стоит косая черта «/».', 'That’s the opening tag. The closing one has a slash “/” before ul.'),
      needLt: L3('Teg chap «<» qavs bilan boshlanadi. Uni boshiga qo‘shing.', 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida o‘ng «>» qavs turadi. Uni oxiriga qo‘shing.', 'В конце тега нужен уголок «>». Добавь его в конец.', 'A tag ends with the bracket “>”. Add it at the end.'),
      wrongName: L3('Teg ichida boshqa so‘z yozilgan. Bu yerda ul kerak: aynan u ro‘yxatni ochgan.', 'Внутри тега другое слово. Здесь нужен ul — это он открыл список.', 'There’s a different word inside the tag. Here you need ul: it opened the list.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.', 'Косая черта «/» стоит сразу после первого уголка.', 'The slash “/” goes right after the first bracket.')
    },
    hints: [
      L3('Ro‘yxat qaysi teg bilan ochilgan? Aynan uni yopish kerak.', 'Каким тегом открыт список? Его и нужно закрыть.', 'Which tag opened the list? That’s the one to close.'),
      L3('Yopuvchi teg o‘sha so‘z, faqat qiya chiziq bilan.', 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3('Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin ul va oxirida yana burchakli qavs.', 'Сначала уголок, потом косая черта. Дальше ul и в конце снова уголок.', 'First a bracket, then the slash. Then ul, and another bracket at the end.')
    ],
    ok: L3('To‘g‘ri! Ro‘yxat yopildi, matn yana o‘z joyida.', 'Есть! Список закрыт — текст снова на своём месте.', 'Yes! The list is closed, and the text is back in place.'),
    ask: L3('Bo‘sh joyga yopuvchi ul tegini yozing', 'Допиши закрывающий тег ul в пустое место', 'Type the closing ul tag in the empty spot'),
    note: L3('Soat sakkizda yig‘ilamiz.', 'Сбор в восемь утра.', 'We meet at eight.')
  },
  s11: {
    eyebrow: L3('Buzilgan qatorni toping', 'Найди поломку', 'Find the broken line'),
    say: L3('Men ro‘yxatlar yozdim, lekin har birida bitta joy buzilgan. Brauzerga qarang va buzilgan qatorni bosing.',
      'Я написал списки, но в каждом одна поломка. Посмотри на браузер и нажми сломанную строку.',
      'I wrote some lists, but each one has a broken spot. Look at the browser and tap the broken line.'),
    askQ: L3('Qaysi qator buzilgan?', 'Какая строка сломана?', 'Which line is broken?'),
    ok: {
      bare: L3('To‘g‘ri! Bu so‘z li siz turibdi, shuning uchun nuqtasi yo‘q.', 'Верно! Это слово без li, поэтому без точки.', 'Right! This word has no li, so it has no dot.'),
      out: L3('To‘g‘ri! Bu li yopuvchi ul dan keyin turibdi: ro‘yxatdan tashqarida.', 'Верно! Этот li стоит после закрывающего ul — снаружи списка.', 'Right! This li is after the closing ul: outside the list.'),
      open: L3('To‘g‘ri! Bu yerda yopuvchi li o‘rniga yana ochuvchi li yozilgan, shuning uchun bo‘sh band paydo bo‘ldi.', 'Верно! Здесь вместо закрывающего li снова открывающий — вот и лишний пустой пункт.', 'Right! An opening li stands here instead of a closing one, so an extra empty item appeared.')
    },
    fine: L3('Bu qator joyida. Brauzerda nima g‘alati ko‘rinayotganiga qarang.', 'Эта строка в порядке. Посмотри, что в браузере выглядит странно.', 'This line is fine. Look at what seems odd in the browser.'),
    done: L3('Endi buzilgan ro‘yxatni bir qarashda topasiz.', 'Теперь поломку в списке видно с одного взгляда.', 'Now you can spot a broken list at a glance.')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Bu sayohat sahifasining kodi. Brauzer uni qanday o‘qishini ko‘raylik.', 'Это вся страница похода. Посмотрим, как браузер её читает.', 'This is the whole trip page. Let’s see how the browser reads it.'),
    order1: L3('Brauzer kodni yuqoridan pastga o‘qiydi. Avval h1, sahifa nomi.', 'Браузер читает код сверху вниз. Сначала h1 — название страницы.', 'The browser reads code from top to bottom. First h1, the page title.'),
    order2: L3('Keyin ul ro‘yxati: har bir li oldida nuqta.', 'Потом список ul: у каждого li — точка.', 'Then the ul list: each li gets a dot.'),
    order3: L3('Keyin ol ro‘yxati: har bir li ga brauzer raqam beradi.', 'Дальше список ol: каждому li браузер даёт номер.', 'Then the ol list: the browser gives each li a number.'),
    ask: L3('«Brauzerdek o‘qish» tugmasini bosing', 'Нажми «Читать как браузер»', 'Tap “Read like a browser”'),
    askDone: L3('Brauzer yuqoridan pastga o‘qiydi', 'Браузер читает сверху вниз', 'The browser reads top to bottom')
  },
  s13: {
    eyebrow: L3('O‘z ro‘yxatingiz', 'Свой список', 'Your list'),
    say: L3('Endi o‘z ro‘yxatingizni tuzing. Avval h1 ichiga uning nomini yozing: masalan, sevimli o‘yinlaringiz.', 'Теперь твой список. Сначала напиши в h1 его название — например, любимые игры.', 'Now your own list. First type its title in h1: your favorite games, for example.'),
    sayItems: L3('Endi uchta li ichiga uchta band yozing.', 'Теперь напиши три пункта — по одному в каждый li.', 'Now type three items, one in each li.'),
    ok: L3('Ro‘yxatingiz tayyor: nom va uchta band bor.', 'Твой список готов: есть название и три пункта.', 'Your list is ready: a title and three items.'),
    hints: [
      L3('Ro‘yxat nomini o‘ylab toping: sevimli o‘yinlar, taomlar yoki filmlar.', 'Придумай название: любимые игры, еда или фильмы.', 'Make up a title: favorite games, food or films.'),
      L3('Faqat so‘z yozing, teglar allaqachon joyida.', 'Пиши только слова — теги уже на месте.', 'Type only words: the tags are already in place.'),
      L3('Masalan: Sevimli o‘yinlarim. Bandlar: futbol, shaxmat, Minecraft.', 'Например: Мои любимые игры. Пункты: футбол, шахматы, Minecraft.', 'For example: My favorite games. Items: football, chess, Minecraft.')
    ],
    askTitle: L3('h1 ichiga ro‘yxat nomini yozing', 'Напиши название в h1', 'Type the title in h1'),
    askItems: L3('Har bir li ichiga bitta band yozing', 'Напиши по пункту в каждый li', 'Type one item in each li'),
    phTitle: L3('Masalan: Sevimli o‘yinlarim', 'Например: Мои любимые игры', 'For example: My favorite games'),
    phItem: L3('band', 'пункт', 'item')
  },
  s14: {
    eyebrow: L3('Bu sizning topingiz', 'Это твой топ', 'Your top list'),
    say: L3('Keling, bu sizning topingiz bo‘lsin: eng yaxshisi birinchi. Topga raqamlar kerak. Kerakli tegni ul o‘rniga torting.',
      'Пусть это будет твой топ: самое лучшее — первым. Топу нужны номера. Перетащи нужный тег на место ul.',
      'Let’s make this your top list: the best one first. A top list needs numbers. Drag the right tag onto ul.'),
    why: {
      '<li>': L3('li bu bitta band, butun ro‘yxat emas.', 'li — это один пункт, а не весь список.', 'li is one item, not the whole list.'),
      '<p>': L3('p bu xatboshi. Raqamlar uchun boshqa teg kerak.', 'p — это абзац. Для номеров нужен другой тег.', 'p is a paragraph. Numbers need a different tag.')
    },
    ok: L3('To‘g‘ri! Yopuvchi teg ham ol bo‘ldi: juft doim bir xil. Endi bandlar raqamlangan.', 'Верно! Закрывающий тоже стал ol — пара всегда одинаковая. Теперь у пунктов номера.', 'Right! The closing tag became ol too: a pair always matches. Now the items have numbers.'),
    ask: L3('Kerakli tegni ul o‘rniga torting', 'Перетащи нужный тег на место ul', 'Drag the right tag onto ul'),
    opts: ['<li>', '<ol>', '<p>']
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang, bu sizning ro‘yxatingiz!', 'Посмотри, это твой список!', 'Look, this is your list!'), k: null },
      { text: L3('ul — nuqtali ro‘yxat: tartib muhim emas.', 'ul — список с точками: порядок не важен.', 'ul is a list with dots: order doesn’t matter.'), k: 'ul' },
      { text: L3('ol — raqamli ro‘yxat: tartib muhim.', 'ol — список с номерами: порядок важен.', 'ol is a numbered list: order matters.'), k: 'ol' },
      { text: L3('li — ro‘yxatning bitta bandi. U faqat ul yoki ol ichida turadi.', 'li — один пункт списка. Он стоит только внутри ul или ol.', 'li is one list item. It goes only inside ul or ol.'), k: 'li' },
      { text: L3('Tabriklayman! Endi ro‘yxat tuza olasiz.', 'Ура! Теперь ты умеешь делать списки.', 'Hooray! Now you can make lists.'), k: null }
    ],
    roles: {
      ul: L3('ul — nuqtali ro‘yxat', 'ul — список с точками', 'ul — list with dots'),
      ol: L3('ol — raqamli ro‘yxat', 'ol — список с номерами', 'ol — numbered list'),
      li: L3('li — ro‘yxat bandi', 'li — пункт списка', 'li — list item')
    },
    ask: L3('Ro‘yxatingizga qarang', 'Посмотри на свой список', 'Look at your list')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { magicUl: 1, magicOl: 1, sayLi: 1, doneUl: 1, doneLi: 1, msgs: 1, askQ: 1, miss: 1, sayN: 1, mixed: 1,
  sayDo: 1, wrong: 1, fine: 1, order1: 1, order2: 1, order3: 1, sayItems: 1, cards: 1, pickFirst: 1 });
Object.assign(NOT_SPOKEN_IN, { cards: { title: 1, items: 1, id: 1, want: 1 } });
// Теги урока вслух — по-английски во всех языках (заказчик, 17.10.2026).
Object.assign(TAG_SAY.ru, { ul: 'U L', ol: 'O L', li: 'L I' });
Object.assign(TAG_SAY.uz, { ul: 'U L', ol: 'O L', li: 'L I' });
Object.assign(TAG_SAY.en, { ul: 'U L', ol: 'O L', li: 'L I' });

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:sp3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:sp3.css@*/
`;
