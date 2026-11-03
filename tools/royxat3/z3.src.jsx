// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 3 — «Списки»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/royxat3/build.mjs → lessons/html/03-spiski.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Списки» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Урок с нуля (черновики прежних уроков удалены заказчиком); основа кода —
// урок 2 (tools/zagolovki2/). Облик — эталона «Редактор» (naborRedaktor); бумаги нет нигде.
// Коди записал рецепт плова, но продукты и шаги слиплись в одну строку. Ученик учит теги списков:
// продукты — список с точками (ul), шаги готовки — список с номерами (ol), каждый пункт — li —
// и собирает свой список. Загадка (hikoya.md, без имён): Коди сам вписал номера в шаги и думает,
// что всё будет красиво; в выводе признаёт ошибку — в ol номера удваиваются («1. 1.»).
//
// ДУГА (17 экранов; экрана плана нет). Типы заданий — по разделу 3а навыка, в соседних тройках не
// повторяются:
//   s1 крючок (каша → рецепт, загадка)
//   ul и li:   s2 показ · s3 вписать <li></li> (Fill in the Blanks) · s4 пункты в список (Drag & Drop)
//   ol:        s5 показ · s6 шаги по порядку (Code Builder) · s7 тег ↔ что делает (Matching Pairs)
//   ul или ol: s8 показ «поменяй местами» · s9 вписать ol вместо ul (Fill in the Blanks) · s10 до и после (Before / After)
//   свой список: s11 показ «сверху вниз» · s12, s13 заголовок и пункты (Live Code Preview) · s14 вставить <li> (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: без ul/ol строки склеиваются; текст в списке без li — без точки; ol сам
//     нумерует 1. 2. 3. и сам добавляет номер новому пункту; номер, вписанный руками, — второй.
//   · Подсветка идёт за речью Коди; объяснения — показом, без руки.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ (draft, урок 3): ro'yxat — список; ul — nuqtali ro'yxat (с точками), ol — raqamli
// ro'yxat (с номерами), li — band, ro'yxat bandi (пункт). В речи ul, ol, li звучат по буквам
// («U L»), как h1 — «H one». Как в уроках 1–2: teg, sarlavha, abzas.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-03-spiski',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: "3-dars. Ro'yxatlar",
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
  inspector: L3('Qoida', 'Правило', 'Rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Havolalar', 'Ссылки', 'Links'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА КОДИ — рецепт плова: продукты (ul) и шаги готовки (ol).
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  title: L3('Osh retsepti', 'Рецепт плова', 'Plov recipe'),
  h2a: L3('Mahsulotlar', 'Продукты', 'Ingredients'),
  ing: L3(['Guruch', "Go'sht", 'Sabzi', 'Piyoz', "Yog'"], ['Рис', 'Мясо', 'Морковь', 'Лук', 'Масло'], ['Rice', 'Meat', 'Carrots', 'Onions', 'Oil']),
  h2b: L3('Tayyorlash', 'Приготовление', 'Cooking'),
  steps: L3(["Go'shtni qovuring.", "Sabzi va piyozni qo'shing.", 'Guruchni soling.', 'Dam yediring.'],
    ['Обжарь мясо.', 'Добавь морковь и лук.', 'Засыпь рис.', 'Дай настояться.'],
    ['Fry the meat.', 'Add the carrots and onions.', 'Add the rice.', 'Let it steam.'])
};

// Обёртка пункта или списка в тег, набранная в два поля (s3, s9): что не так.
const WRAP_MSGS = {
  needOpen: L3("So'zdan oldin ochuvchi {tag} tegi kerak bo'ladi.", 'Перед словом нужен открывающий тег {tag}.', 'Before the word you need the opening {tag} tag.'),
  openSlash: L3('Bu yopuvchi teg. Oldinga qiya chiziqsiz ochuvchi teg turadi.', 'Это закрывающий тег. Впереди ставят открывающий, без косой черты.', 'That’s a closing tag. The opening tag, without a slash, goes first.'),
  needClose: L3("So'zdan keyin yopuvchi {tag} tegi kerak bo'ladi.", 'После слова нужен закрывающий тег {tag}.', 'After the word you need the closing {tag} tag.'),
  needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda {tag} yozuvidan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needLt: L3('Teg chap «<» qavs bilan boshlanadi.', 'Тег начинается с уголка «<».', 'A tag starts with the bracket “<”.'),
  needGt: L3("Teg oxirida o'ng «>» qavs turadi.", 'В конце тега нужен уголок «>».', 'A tag ends with the bracket “>”.'),
  wrongName: L3("Teg ichida {tag} bo'lishi kerak.", 'Внутри тега должно быть {tag}.', 'The tag should say {tag}.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card.
// Реплики сцеплены в одну историю (hikoya.md); термин впервые — через «ya'ni … degani».
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Chalkash retsept', 'Каша из рецепта', 'A messy recipe'),
    say: L3("Yana salom! O'tgan darsda sarlavha va abzaslarni o'rgandik. Bugun men osh retseptini sahifaga yozdim. Lekin qarang: mahsulotlar ham, qadamlar ham bitta qatorga yopishib qolgan. Nimani olish kerak, nimadan boshlash kerak, bilib bo'lmaydi. Keling, buni tuzatamiz. «Aylantirish» tugmasini bosing.",
      'Привет снова! На прошлом уроке мы разобрали заголовки и абзацы. А сегодня я записал на страницу рецепт плова. Но смотри: и продукты, и шаги слиплись в одну строку. Что купить и с чего начать — не понять. Давай это исправим. Нажми «Превратить».',
      'Hi again! Last time we learned headings and paragraphs. Today I wrote a plov recipe on a page. But look: the ingredients and the steps are all stuck in one line. You can’t tell what to buy or where to start. Let’s fix it. Tap “Transform”.'),
    magic: L3("Voy, qarang! Mahsulotlar alohida qatorlarga tizildi, har birining oldida nuqta bor.", 'Ого, смотри! Продукты встали отдельными строками, у каждого точка.', 'Whoa, look! The ingredients lined up on separate lines, each with a dot.'),
    magicP: L3("Tayyorlash qadamlari esa raqamlandi: bir, ikki, uch.", 'А шаги готовки получили номера: один, два, три.', 'And the cooking steps got numbers: one, two, three.'),
    done: L3("Bugun shunday ro'yxatlar tuzishni o'rganasiz va o'z ro'yxatingizni yasaysiz. Lekin oldin kichik topishmoq. Men qadamlarni yozganimda har bir qadamning boshiga raqamni o'zim qo'shib qo'ydim: bir, ikki, uch. Menimcha, sahifada hammasi chiroyli chiqadi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делать такие списки и соберёшь свой. Но сначала маленькая загадка. Когда я писал шаги, я сам поставил перед каждым номер: один, два, три. По-моему, на странице всё выйдет красиво. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make lists like these and build your own. But first, a little riddle. When I wrote the steps, I put a number in front of each one myself: one, two, three. I think it will look great on the page. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Ikkita ro'yxat paydo bo'ldi", 'Получилось два списка', 'Two lists appeared')
  },
  s2: {
    eyebrow: L3("Nuqtali ro'yxat", 'Список с точками', 'Bulleted list'),
    say: L3("Keling, mahsulotlardan boshlaymiz. Qarang: kodda uchta so'z bor, lekin brauzer ularni bitta qatorga yopishtirdi. Ro'yxat bo'lishi uchun bizga ikkita yangi teg kerak bo'ladi.",
      'Начнём с продуктов. Смотри: в коде три слова, но браузер склеил их в одну строку. Чтобы получился список, нужны два новых тега.',
      'Let’s start with the ingredients. Look: the code has three words, but the browser glued them into one line. To make a list, we need two new tags.'),
    sayUl: L3("Birinchisi ul tegi. ul inglizcha unordered list so'zlaridan olingan, ya'ni tartibi muhim bo'lmagan ro'yxat degani. ul butun ro'yxatni o'rab turadi.",
      'Первый — тег ul. ul — от английского unordered list, то есть список, где порядок не важен. ul обнимает весь список.',
      'The first one is the ul tag. ul comes from unordered list: a list where the order doesn’t matter. ul wraps the whole list.'),
    sayLi: L3("Ikkinchisi li tegi. li inglizcha list item so'zlaridan olingan, ya'ni ro'yxat bandi degani. Har bir band alohida li ichiga yoziladi. Qarang.",
      'Второй — тег li. li — от английского list item, то есть пункт списка. Каждый пункт пишут в свой li. Смотри.',
      'The second one is the li tag. li comes from list item: one point of the list. Each item goes into its own li. Watch.'),
    done: L3("Brauzer har bir li oldiga o'zi nuqta qo'yadi. Eslab qoling: ul butun ro'yxatni o'raydi, li esa har bir bandni. Shuning uchun li doim ul ichida turadi.",
      'Браузер сам ставит точку перед каждым li. Запомни: ul обнимает весь список, а li — каждый пункт. Поэтому li всегда стоит внутри ul.',
      'The browser puts a dot in front of each li by itself. Remember: ul wraps the whole list, and li wraps each item. That’s why li always sits inside ul.'),
    askUl: L3("Qarang: ro'yxat tegi", 'Смотри: тег списка', 'Watch: the list tag'),
    askLi: L3("Qarang: ro'yxat bandlari", 'Смотри: пункты списка', 'Watch: the list items'),
    askDone: L3('Har bir band alohida li ichida', 'Каждый пункт — в своём li', 'Each item is in its own li')
  },
  s3: {
    eyebrow: L3("Bandni qo'shing", 'Добавь пункт', 'Add an item'),
    say: L3("Endi navbat sizga. Qarang: sabzi ro'yxatda turibdi, lekin uning oldida nuqta yo'q. Chunki u li ichida emas. Sabzi so'zini li tegiga o'rang: so'zdan oldin ochuvchi tegni, keyin yopuvchi tegni yozing.",
      'Теперь твоя очередь. Смотри: морковь стоит в списке, но точки перед ней нет. Потому что она не в li. Оберни слово в тег li: перед словом напиши открывающий тег, после — закрывающий.',
      'Now it’s your turn. Look: the carrots are in the list, but there’s no dot in front of them, because they aren’t inside li. Wrap the word in li: type the opening tag before it and the closing tag after it.'),
    hints: [
      L3('Har bir band qaysi teg ichida turadi?', 'В каком теге стоит каждый пункт?', 'Which tag holds each item?'),
      L3("Band tegi li bo'ladi. Uning yopuvchisida qiya chiziq bor.", 'Тег пункта — li. В закрывающем есть косая черта.', 'The item tag is li. The closing one has a slash.'),
      L3("Birinchi joyga ochuvchi li, ikkinchisiga yopuvchi li yozing.", 'В первое место — открывающий li, во второе — закрывающий li.', 'Type the opening li in the first spot and the closing li in the second.')
    ],
    ok: L3("Zo'r! Sabzining oldida ham nuqta paydo bo'ldi. Endi u ham ro'yxat bandi bo'ladi.", 'Огонь! Перед морковью тоже появилась точка. Теперь это тоже пункт списка.', 'Awesome! A dot appeared in front of the carrots too. Now they’re a list item as well.'),
    ask: L3("«{w}» so'zini li tegiga o'rang", 'Оберни слово «{w}» в тег li', 'Wrap the word “{w}” in the li tag')
  },
  s4: {
    eyebrow: L3("Ro'yxatni to'ldiring", 'Дополни список', 'Fill the list'),
    say: L3("Oshga yana piyoz va yog' kerak bo'ladi. Ikkala bandni ro'yxatga olib boring. Diqqat qiling: ro'yxat yopuvchi ul tegida tugaydi.",
      'Для плова нужны ещё лук и масло. Перетащи оба пункта в список. Внимание: список заканчивается на закрывающем теге ul.',
      'The plov also needs onions and oil. Drag both items into the list. Careful: the list ends at the closing ul tag.'),
    why: {
      out: L3("Bu joy ro'yxatdan tashqarida turibdi: ul allaqachon yopilgan. Bandni ul ichiga qo'ying.", 'Это место за пределами списка: ul уже закрыт. Поставь пункт внутрь ul.', 'This spot is outside the list: ul is already closed. Put the item inside ul.')
    },
    hints: [
      L3("Ro'yxat qayerda boshlanib, qayerda tugaydi?", 'Где начинается и где кончается список?', 'Where does the list start and end?'),
      L3("Ro'yxat ochuvchi ul va yopuvchi ul o'rtasida bo'ladi.", 'Список — между открывающим и закрывающим ul.', 'The list is between the opening and the closing ul.'),
      L3("Bandlarni yopuvchi ul tegidan oldingi bo'sh qatorlarga qo'ying.", 'Поставь пункты в пустые строки перед закрывающим ul.', 'Put the items into the empty lines before the closing ul.')
    ],
    ok: L3("Barakalla! Endi ro'yxatda beshta mahsulot bor, hammasining oldida nuqta turibdi.", 'Молодец! Теперь в списке пять продуктов, и у всех есть точка.', 'Well done! Now the list has five ingredients, and each one has a dot.'),
    ask: L3("Bandlarni ro'yxatga olib boring", 'Перетащи пункты в список', 'Drag the items into the list'),
    askPlace: L3("Endi bo'sh joyni bosing", 'Теперь нажми пустое место', 'Now tap an empty spot'),
    pickFirst: L3('Oldin bandni bosing.', 'Сначала нажми пункт.', 'Tap an item first.')
  },
  s5: {
    eyebrow: L3("Raqamli ro'yxat", 'Нумерованный список', 'Numbered list'),
    say: L3("Mahsulotlar tayyor, endi tayyorlash qadamlariga o'tamiz. Bu yerda tartib muhim bo'ladi: oldin go'sht qovuriladi, keyin sabzi qo'shiladi. Lekin nuqtalar tartibni ko'rsatmaydi.",
      'Продукты готовы, переходим к шагам готовки. Здесь порядок важен: сначала жарят мясо, потом добавляют морковь. Но точки порядок не показывают.',
      'The ingredients are done; now the cooking steps. Here the order matters: first you fry the meat, then you add the carrots. But dots don’t show the order.'),
    sayOl: L3("Buning uchun ol tegi bor. ol inglizcha ordered list so'zlaridan olingan, ya'ni tartiblangan ro'yxat degani. Qarang, ul o'rniga ol yozamiz.",
      'Для этого есть тег ol. ol — от английского ordered list, то есть упорядоченный список. Смотри, пишем ol вместо ul.',
      'For that there’s the ol tag. ol comes from ordered list: a list in order. Watch, we write ol instead of ul.'),
    sayAuto: L3("Raqamlarni brauzer o'zi qo'yadi. Yangi band qo'shsak, keyingi raqam ham o'zi paydo bo'ladi.",
      'Номера браузер ставит сам. Добавим новый пункт — следующий номер тоже появится сам.',
      'The browser adds the numbers by itself. If we add a new item, the next number appears by itself too.'),
    done: L3("Demak, tartib muhim bo'lsa ol, muhim bo'lmasa ul ishlatiladi. Bandlar esa ikkalasida ham li bo'ladi.",
      'Значит, если порядок важен — ol, если нет — ul. А пункты в обоих — li.',
      'So if the order matters, use ol; if not, use ul. The items in both are li.'),
    askOl: L3("Qarang: ul o'rniga ol", 'Смотри: ol вместо ul', 'Watch: ol instead of ul'),
    askAuto: L3("Qarang: raqamlar o'zi paydo bo'ladi", 'Смотри: номера появляются сами', 'Watch: the numbers appear by themselves'),
    askDone: L3("Raqamlarni brauzer o'zi qo'yadi", 'Номера ставит браузер', 'The browser adds the numbers')
  },
  s6: {
    eyebrow: L3('Qadamlarni tering', 'Расставь шаги', 'Put the steps in order'),
    say: L3("Endi qadamlardan o'zingiz ro'yxat yig'ing. Qadamlarni ovqat tayyorlanadigan tartibda ol ichidagi bo'sh qatorlarga qo'ying. Raqamlarni brauzer o'zi qo'yadi.",
      'Теперь собери список из шагов сам. Ставь шаги в пустые строки внутри ol в том порядке, в каком готовят плов. Номера браузер поставит сам.',
      'Now build the list of steps yourself. Put the steps into the empty lines inside ol in the order you cook. The browser will add the numbers.'),
    why: {
      riceFirst: L3("Guruchni hozir solsak, go'sht xom qolib ketadi. Oldin qozonda nima qilinadi?", 'Если засыпать рис сейчас, мясо останется сырым. Что делают в казане сначала?', 'If we add the rice now, the meat stays raw. What happens in the pot first?'),
      carrotFirst: L3("Sabzi va piyozdan oldin qozonda bir narsa qovurilishi kerak bo'ladi. U nima?", 'Перед морковью и луком в казане нужно кое-что обжарить. Что?', 'Before the carrots and onions, something has to be fried in the pot. What is it?'),
      riceEarly: L3("Guruch eng oxirida solinadi. Undan oldin nima qo'shiladi?", 'Рис засыпают в самом конце. Что добавляют перед ним?', 'The rice goes in last. What do we add before it?')
    },
    hints: [
      L3('Osh tayyorlash nimadan boshlanadi?', 'С чего начинается плов?', 'What does making plov start with?'),
      L3("Birinchi qadam go'shtni qovurish bo'ladi.", 'Первый шаг — обжарить мясо.', 'The first step is frying the meat.'),
      L3("Tartib shunday bo'ladi: oldin go'sht, keyin sabzi va piyoz, oxirida esa guruch.", 'Порядок такой: мясо, потом морковь и лук, а в конце рис.', 'The order is: meat, then carrots and onions, and rice at the end.')
    ],
    ok: L3("Ajoyib! Qadamlar to'g'ri tartibda turibdi, raqamlarni esa brauzer o'zi qo'ydi.", 'Отлично! Шаги стоят по порядку, а номера браузер поставил сам.', 'Great! The steps are in order, and the browser added the numbers by itself.'),
    ask: L3("Qadamlarni to'g'ri tartibda qo'ying", 'Расставь шаги по порядку', 'Put the steps in the right order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Endi bizda uchta teg bor: ul, ol va li. Har bir tegni uning ishi bilan juftlang. Oldin tegni bosing, keyin uning ishini bosing.",
      'Теперь у нас три тега: ul, ol и li. Соедини каждый тег с тем, что он делает. Сначала нажми тег, потом его дело.',
      'Now we have three tags: ul, ol and li. Match each tag with what it does. Tap a tag first, then what it does.'),
    cards: {
      ul: L3("Nuqtali ro'yxat", 'Список с точками', 'A bulleted list'),
      ol: L3("Raqamli ro'yxat", 'Список с номерами', 'A numbered list'),
      li: L3("Ro'yxatning bitta bandi", 'Один пункт списка', 'One list item')
    },
    pairOk: {
      ul: L3("To'g'ri! ul nuqtali ro'yxat yasaydi.", 'Верно! ul делает список с точками.', 'Right! ul makes a bulleted list.'),
      ol: L3("To'g'ri! ol raqamli ro'yxat yasaydi.", 'Верно! ol делает список с номерами.', 'Right! ol makes a numbered list.'),
      li: L3("To'g'ri! li ro'yxatning bitta bandi bo'ladi.", 'Верно! li — один пункт списка.', 'Right! li is one list item.')
    },
    why: {
      ul: L3("ul nuqtali ro'yxat yasaydi, unda raqam bo'lmaydi.", 'ul делает список с точками, номеров в нём нет.', 'ul makes a bulleted list, with no numbers.'),
      ol: L3("ol raqamli ro'yxat yasaydi, raqamlarni brauzer o'zi qo'yadi.", 'ol делает список с номерами, номера ставит браузер.', 'ol makes a numbered list; the browser adds the numbers.'),
      li: L3("li butun ro'yxat emas, u faqat bitta band bo'ladi.", 'li — не весь список, а только один пункт.', 'li isn’t the whole list, only one item.')
    },
    hints: [
      L3('Qaysi teg nuqta qo\'yadi, qaysi biri raqam qo\'yadi?', 'Какой тег ставит точки, а какой номера?', 'Which tag adds dots, and which adds numbers?'),
      L3("ol so'zida tartib bor, demak raqam ham bor bo'ladi.", 'В ol есть порядок — значит, есть и номера.', 'ol means order, so it has numbers.'),
      L3("ul nuqtali ro'yxat, ol raqamli ro'yxat, li esa bitta band bo'ladi.", 'ul — список с точками, ol — с номерами, li — один пункт.', 'ul is a bulleted list, ol is numbered, and li is one item.')
    ],
    ok: L3("Qoyil! Uchala teg ham o'z ishini topdi.", 'Класс! Все три тега нашли своё дело.', 'Brilliant! All three tags found their job.'),
    ask: L3('Tegni uning ishi bilan juftlang', 'Соедини тег с его делом', 'Match each tag with its job'),
    askPlace: L3('Endi uning ishini bosing', 'Теперь нажми его дело', 'Now tap its job'),
    pickFirst: L3('Oldin tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.')
  },
  s8: {
    eyebrow: L3('ul yoki ol?', 'ul или ol?', 'ul or ol?'),
    say: L3("Xo'sh, qachon ul, qachon ol kerak bo'ladi? Bitta savol yordam beradi: bandlarning o'rnini almashtirsak, ma'no o'zgaradimi?",
      'Так когда нужен ul, а когда ol? Поможет один вопрос: если поменять пункты местами, смысл изменится?',
      'So when do we need ul, and when ol? One question helps: if we swap the items, does the meaning change?'),
    sayA: L3("Mana, xaridlar ro'yxati. Non bilan sutning o'rnini almashtiramiz. Hech narsa o'zgarmadi, ikkalasini ham baribir olamiz. Demak, bu yerga ul to'g'ri keladi.",
      'Вот список покупок. Меняем местами хлеб и молоко. Ничего не изменилось: купим и то и другое. Значит, здесь подходит ul.',
      'Here’s a shopping list. We swap the bread and the milk. Nothing changed: we’ll buy both anyway. So ul fits here.'),
    sayB: L3("Endi ertalabki ishlarga qarang. Uyg'onish bilan yuvinishning o'rnini almashtiramiz. Voy, uyg'onmasdan yuvinib bo'lmaydi-ku! Ma'no buzildi. Demak, bu yerga ol kerak bo'ladi.",
      'А теперь утренние дела. Меняем местами «просыпаюсь» и «умываюсь». Ой, не проснувшись, не умоешься! Смысл сломался. Значит, здесь нужен ol.',
      'Now the morning routine. We swap waking up and washing. Oops, you can’t wash before you wake up! The meaning broke. So ol is needed here.'),
    done: L3("Eslab qoling: bandlarning o'rni almashganda ma'no buzilsa, ol tanlanadi. Ma'no o'zgarmasa, ul yetarli bo'ladi.",
      'Запомни: если от перестановки пунктов смысл ломается — выбирай ol. Если не меняется — хватит ul.',
      'Remember: if swapping the items breaks the meaning, choose ol. If the meaning stays the same, ul is enough.'),
    cards: { a: L3('Xaridlar', 'Покупки', 'Shopping'), b: L3('Ertalab', 'Утро', 'Morning') },
    listA: L3(['Non', 'Sut', 'Olma'], ['Хлеб', 'Молоко', 'Яблоки'], ['Bread', 'Milk', 'Apples']),
    listB: L3(["Uyg'onaman", 'Yuvinaman', 'Nonushta qilaman'], ['Просыпаюсь', 'Умываюсь', 'Завтракаю'], ['I wake up', 'I wash', 'I have breakfast']),
    same: L3("Ma'no o'zgarmadi", 'Смысл тот же', 'Same meaning'),
    broken: L3("Ma'no buzildi", 'Смысл сломался', 'Meaning broke'),
    askA: L3('Qarang: xaridlar', 'Смотри: покупки', 'Watch: shopping'),
    askB: L3('Qarang: ertalabki ishlar', 'Смотри: утренние дела', 'Watch: the morning routine'),
    askDone: L3("Ma'no buzilsa ol, buzilmasa ul", 'Смысл ломается — ol, нет — ul', 'Meaning breaks: ol; it doesn’t: ul')
  },
  s9: {
    eyebrow: L3('ol tegini qo\'ying', 'Поставь ol', 'Use ol'),
    say: L3("Voy, men ertalabki ishlarni ul bilan yozib qo'yibman. Lekin bu yerda tartib muhim bo'ladi. ul o'rniga ol yozing: boshiga ochuvchi ol tegini, oxiriga yopuvchi ol tegini qo'ying.",
      'Ой, я записал утренние дела через ul. А здесь порядок важен. Напиши ol вместо ul: в начале — открывающий тег ol, в конце — закрывающий.',
      'Oops, I wrote the morning routine with ul. But here the order matters. Write ol instead of ul: the opening ol tag at the start and the closing ol tag at the end.'),
    msgs: {
      needOpen: L3("Ro'yxat boshida ochuvchi ol tegi kerak bo'ladi.", 'В начале списка нужен открывающий тег ol.', 'The list needs the opening ol tag at the start.'),
      openSlash: L3("Bu yopuvchi teg. Ro'yxat boshida qiya chiziqsiz ochuvchi teg turadi.", 'Это закрывающий тег. В начале списка ставят открывающий, без косой черты.', 'That’s a closing tag. The opening tag, without a slash, goes at the start.'),
      needClose: L3("Ro'yxat oxirida yopuvchi ol tegi kerak bo'ladi.", 'В конце списка нужен закрывающий тег ol.', 'The list needs the closing ol tag at the end.'),
      other: L3("Bu yana ul bo'lib qoldi. Bizga raqamli ro'yxat kerak, ya'ni ol degani.", 'Это снова ul. Нам нужен список с номерами, то есть ol.', 'That’s ul again. We need a numbered list, which is ol.')
    },
    hints: [
      L3("Raqamli ro'yxat tegi qaysi?", 'Какой тег у списка с номерами?', 'Which tag makes a numbered list?'),
      L3("Bu ol tegi bo'ladi. Uning yopuvchisida qiya chiziq bor.", 'Это тег ol. В закрывающем есть косая черта.', 'It’s the ol tag. The closing one has a slash.'),
      L3('Birinchi joyga ochuvchi ol, oxirgisiga yopuvchi ol yozing.', 'В первое место — открывающий ol, в последнее — закрывающий ol.', 'Type the opening ol in the first spot and the closing ol in the last.')
    ],
    ok: L3("Ajoyib! Nuqtalar raqamlarga aylandi. Endi tartib aniq ko'rinib turibdi.", 'Отлично! Точки стали номерами. Теперь порядок видно сразу.', 'Great! The dots turned into numbers. Now the order is easy to see.'),
    ask: L3("ul o'rniga ol yozing", 'Напиши ol вместо ul', 'Write ol instead of ul')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Endi ikkita ro'yxatga qarang: oldin va keyin. Ro'yxatda nimadir o'zgardi. Xo'sh, buni qaysi teg qildi?",
      'Теперь посмотри на два списка: до и после. В списке что-то изменилось. Ну и какой тег это сделал?',
      'Now look at two lists: before and after. Something changed in the list. So which tag did that?'),
    askQ: L3('Qaysi teg buni qildi?', 'Какой тег это сделал?', 'Which tag did it?'),
    ok: {
      ol: L3("To'g'ri! ol nuqtalarni raqamlarga aylantirdi.", 'Верно! ol превратил точки в номера.', 'Right! ol turned the dots into numbers.'),
      li: L3("To'g'ri! Yangi li yangi band qo'shdi.", 'Верно! Новый li добавил новый пункт.', 'Right! A new li added a new item.'),
      ul: L3("To'g'ri! ul raqamlarni nuqtalarga aylantirdi.", 'Верно! ul превратил номера в точки.', 'Right! ul turned the numbers into dots.')
    },
    miss: {
      ol: L3("Qarang: keyin nuqtalar raqamlarga aylandi. Raqam qo'yadigan teg esa ol bo'ladi.", 'Смотри: после точки стали номерами. Номера ставит тег ol.', 'Look: after, the dots became numbers. The ol tag adds numbers.'),
      li: L3("Qarang: keyin ro'yxatda bitta band ko'paydi. Yangi bandni li qo'shadi.", 'Смотри: после в списке стало на один пункт больше. Новый пункт добавляет li.', 'Look: after, the list has one more item. li adds a new item.'),
      ul: L3("Qarang: keyin raqamlar nuqtalarga aylandi. Nuqta qo'yadigan teg esa ul bo'ladi.", 'Смотри: после номера стали точками. Точки ставит тег ul.', 'Look: after, the numbers became dots. The ul tag adds dots.')
    },
    done: L3('Endi uchala tegni ham adashtirmaysiz. Keyin butun sahifani birga o\'qiymiz.', 'Теперь эти три тега не перепутать. Дальше прочитаем всю страницу целиком.', 'Now you won’t mix up these three tags. Next, let’s read the whole page.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After')
  },
  s11: {
    eyebrow: L3('Tepadan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3("Mana, osh retseptining butun sahifasi. Brauzer uni qanday o'qishini ko'raylik.", 'Вот вся страница рецепта плова. Посмотрим, как браузер её читает.', 'Here’s the whole plov recipe page. Let’s see how the browser reads it.'),
    order1: L3("Brauzer kodni tepadan pastga o'qiydi. Oldin h1 keladi, bu asosiy sarlavha bo'ladi.", 'Браузер читает код сверху вниз. Сначала h1 — главный заголовок.', 'The browser reads code from top to bottom. First comes h1, the main heading.'),
    order2: L3("Keyin h2 va ul keladi: mahsulotlar nuqtali ro'yxatda turibdi.", 'Потом h2 и ul: продукты стоят в списке с точками.', 'Then h2 and ul: the ingredients are in a bulleted list.'),
    order3: L3("Oxirida yana h2 va ol keladi: qadamlar raqamli ro'yxatda turibdi.", 'В конце снова h2 и ol: шаги стоят в списке с номерами.', 'At the end, another h2 and ol: the steps are in a numbered list.'),
    ask: L3("Brauzer qanday o'qishini kuzating", 'Смотри, как читает браузер', 'Watch how the browser reads'),
    askDone: L3("Brauzer tepadan pastga o'qiydi", 'Браузер читает сверху вниз', 'The browser reads top to bottom')
  },
  // Свой список — два экрана (одно действие на экран): заголовок, потом три пункта; засчёт по «Готово».
  s12: {
    eyebrow: L3("Ro'yxat sarlavhasi", 'Заголовок списка', 'List heading'),
    say: L3("Endi o'z ro'yxatingizni yasang. Oldin unga sarlavha kerak bo'ladi. h2 ichiga ro'yxatingiz nima haqida ekanini yozing va «Tayyor»ni bosing.",
      'Теперь сделай свой список. Сначала ему нужен заголовок. Напиши в h2, о чём твой список, и нажми «Готово».',
      'Now make your own list. First it needs a heading. Type in h2 what your list is about, then tap “Done”.'),
    ok: L3("Zo'r sarlavha! Endi unga bandlar kerak bo'ladi.", 'Классный заголовок! Теперь ему нужны пункты.', 'Great heading! Now it needs items.'),
    hints: [
      L3("Nima haqida ro'yxat tuzmoqchisiz? Masalan, sevimli o'yinlaringiz haqida.", 'О чём будет твой список? Например, о любимых играх.', 'What will your list be about? Your favorite games, for example.'),
      L3("Faqat so'z yozing, teglar allaqachon joyida turibdi.", 'Пиши только слова — теги уже на месте.', 'Type only words: the tags are already in place.'),
      L3("Masalan: Sevimli o'yinlarim. Keyin «Tayyor»ni bosing.", 'Например: Мои любимые игры. Потом нажми «Готово».', 'For example: My favorite games. Then tap “Done”.')
    ],
    ask: L3("h2 ichiga ro'yxat sarlavhasini yozing va «Tayyor»ni bosing", 'Напиши заголовок в h2 и нажми «Готово»', 'Type a heading in h2 and tap “Done”'),
    ph: L3("Masalan: Sevimli o'yinlarim", 'Например: Мои любимые игры', 'For example: My favorite games')
  },
  s13: {
    eyebrow: L3('Bandlaringiz', 'Свои пункты', 'Your items'),
    say: L3("Sarlavha bor, endi ro'yxatning o'zi qoldi. Uchta li ichiga uchta band yozing va «Tayyor»ni bosing. Nuqtalarni brauzer o'zi qo'yadi.",
      'Заголовок есть, осталось сделать сам список. Напиши три пункта в три li и нажми «Готово». Точки браузер поставит сам.',
      'You have a heading; now the list itself. Type three items into the three li tags, then tap “Done”. The browser adds the dots.'),
    ok: L3("Barakalla! Ro'yxatingiz tayyor: sarlavha ham, uchta band ham bor.", 'Молодец! Твой список готов: есть и заголовок, и три пункта.', 'Well done! Your list is ready: it has a heading and three items.'),
    hints: [
      L3("Sarlavhangizga mos uchta narsani o'ylab toping.", 'Придумай три вещи под свой заголовок.', 'Think of three things that fit your heading.'),
      L3("Har bir li ichiga bittadan band yozing, teglar joyida turibdi.", 'В каждый li — по одному пункту, теги на месте.', 'One item into each li: the tags are in place.'),
      L3("Masalan: Futbol, Shaxmat, Minecraft. Keyin «Tayyor»ni bosing.", 'Например: Футбол, Шахматы, Minecraft. Потом нажми «Готово».', 'For example: Football, Chess, Minecraft. Then tap “Done”.')
    ],
    ask: L3("Uchta li ichiga uchta band yozing va «Tayyor»ni bosing", 'Напиши три пункта в li и нажми «Готово»', 'Type three items into li and tap “Done”'),
    ph: L3(['Futbol', 'Shaxmat', 'Minecraft'], ['Футбол', 'Шахматы', 'Minecraft'], ['Football', 'Chess', 'Minecraft'])
  },
  s14: {
    eyebrow: L3("Nuqta yo'qoldi", 'Пропала точка', 'A dot is missing'),
    say: L3("Voy, ro'yxatingizda ikkinchi bandning nuqtasi yo'qolib qoldi! Uning oldidagi ochuvchi li tegi tushib qolgan. Yetishmayotgan tegni bo'sh joyga olib boring.",
      'Ой, в твоём списке у второго пункта пропала точка! Перед ним потерялся открывающий тег li. Перетащи недостающий тег в пустое место.',
      'Oops, the second item in your list lost its dot! Its opening li tag went missing. Drag the missing tag into the empty spot.'),
    why: {
      '</li>': L3('Bu yopuvchi li tegi. Band boshida qiya chiziqsiz ochuvchi teg turadi.', 'Это закрывающий li. В начале пункта стоит открывающий, без косой черты.', 'That’s the closing li. The opening tag, without a slash, starts the item.'),
      '<ol>': L3("Bu raqamli ro'yxat tegi. Bizga esa band tegi kerak bo'ladi.", 'Это тег списка с номерами. А нам нужен тег пункта.', 'That’s the numbered list tag. We need the item tag.')
    },
    ok: L3("Ana endi joyida! Ikkinchi bandning oldida ham nuqta paydo bo'ldi.", 'Вот теперь порядок! У второго пункта тоже появилась точка.', 'That’s it! The second item has its dot again.'),
    ask: L3("Yetishmayotgan tegni bo'sh joyga olib boring", 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty spot'),
    opts: ['</li>', '<li>', '<ol>']
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые списки без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, maktab sumkasi uchun ro'yxat, lekin unda xato bor. Brauzerga qarang: nima noto'g'ri ko'rinyapti? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот список для школьной сумки, но в нём ошибка. Посмотри на браузер: что выглядит не так? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s a list for a school bag, but it has a bug. Look at the browser: what looks wrong? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Mana ertalabki ishlar ro'yxati. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Вот список утренних дел. Что сломано здесь?', 'Great, the first bug is found! Here’s the morning routine. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan: band li ichida turibdi. Brauzerga qarang: buzilish qayerda?", 'Эта строка в порядке: пункт стоит в li. Посмотри на браузер: где поломка?', 'This line is fine: the item is inside li. Look at the browser: where’s the problem?'),
    found: {
      bare: L3("Topdingiz! Bu bandda li tegi yo'q edi. Shuning uchun uning oldida nuqta chiqmagan edi.", 'Нашёл! У этого пункта не было тега li. Поэтому перед ним не было точки.', 'Found it! This item had no li tag. That’s why it had no dot.'),
      num: L3("Topdingiz! Bu bandga raqam qo'lda yozilgan edi. ol raqamni o'zi qo'yadi, shuning uchun ikkita raqam chiqqan edi.", 'Нашёл! В этом пункте номер был вписан руками. ol ставит номер сам, поэтому номеров было два.', 'Found it! This item had a number typed by hand. ol adds the number by itself, so there were two numbers.')
    },
    hints: {
      bare: [
        L3("Brauzerga qarang: qaysi bandning oldida nuqta yo'q?", 'Посмотри на браузер: у какого пункта нет точки?', 'Look at the browser: which item has no dot?'),
        L3('Nuqta li tegidan keladi. O\'sha bandning qatorini tekshiring.', 'Точка берётся из тега li. Проверь строку этого пункта.', 'The dot comes from the li tag. Check that item’s line.'),
        L3("Qaysi qatorda so'z li ichida turmaydi?", 'В какой строке слово не стоит в li?', 'Which line has a word outside li?')
      ],
      num: [
        L3("Brauzerga qarang: qaysi bandda raqam ikki marta chiqdi?", 'Посмотри на браузер: у какого пункта номер дважды?', 'Look at the browser: which item has its number twice?'),
        L3("ol raqamni o'zi qo'yadi. Qaysi qatorda raqam qo'lda yozilgan?", 'ol ставит номер сам. В какой строке номер вписан руками?', 'ol adds the number itself. Which line has a number typed by hand?'),
        L3('Ikkinchi bandga qarang: uning matnida raqam bormi?', 'Посмотри на второй пункт: в его тексте есть номер?', 'Look at the second item: is there a number in its text?')
      ]
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz endi ro'yxatlarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь списки как настоящий программист.', 'Super! Both bugs are found. You check lists like a real programmer.'),
    bagTitle: L3('Maktab sumkasi', 'Школьная сумка', 'School bag'),
    bag: L3(['Daftar', 'Ruchka', 'Kitob'], ['Тетрадь', 'Ручка', 'Книга'], ['Notebook', 'Pen', 'Book'])
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3("ol ichidagi raqamlarni o'zimiz yozishimiz kerak bo'ladi.", 'Номера в ol нужно писать самим.', 'We have to type the numbers in ol ourselves.'), right: false,
        why: L3("Aslida raqamlarni brauzer o'zi qo'yadi. Biz faqat bandlarni li ichiga yozamiz.", 'На самом деле номера ставит браузер. Мы пишем только пункты в li.', 'Actually the browser adds the numbers. We only write the items in li.') },
      { t: L3("Har bir band alohida li ichida bo'ladi.", 'Каждый пункт стоит в своём li.', 'Each item goes in its own li.'), right: true,
        code: [{ t: 'li' }, { w: L3('Non', 'Хлеб', 'Bread') }, { t: 'li', close: true }],
        why: L3("li ro'yxatning bitta bandi bo'ladi. Nechta band bo'lsa, shuncha li bo'ladi.", 'li — один пункт списка. Сколько пунктов, столько и li.', 'li is one list item. As many items, as many li tags.') },
      { t: L3("Xaridlar ro'yxati uchun faqat ol to'g'ri keladi.", 'Для списка покупок подходит только ol.', 'Only ol works for a shopping list.'), right: false,
        why: L3("Xaridlarda tartib muhim emas, shuning uchun ul ham yetarli bo'ladi.", 'В покупках порядок не важен, поэтому хватит и ul.', 'Order doesn’t matter for shopping, so ul is enough.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz ul, ol va li teglarini yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь теги ul, ol и li.', 'All correct! You know the ul, ol and li tags really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men har bir qadamning boshiga raqamni o'zim yozgan edim? Afsuski, men adashibman. ol raqamlarni o'zi qo'yadi, shuning uchun sahifada ikkita raqam chiqadi: bir, bir. Demak, ol ichida raqamni qo'lda yozish kerak emas.",
        'Вернёмся к загадке. Помнишь, я сам вписал номер перед каждым шагом? Увы, я ошибся. ol ставит номера сам, поэтому на странице выходит два номера: один, один. Значит, в ol номер руками писать не нужно.',
        'Back to our riddle. Remember, I typed a number in front of each step myself? Sadly, I was wrong. ol adds the numbers by itself, so the page shows two numbers: one, one. So you don’t type numbers in ol by hand.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning ro'yxatingiz!", 'Посмотри, это твой список!', 'Look, this is your list!'), k: null },
      { text: L3("ul nuqtali ro'yxat bo'ladi, unda tartib muhim emas.", 'ul — список с точками, порядок в нём не важен.', 'ul is a bulleted list where the order doesn’t matter.'), k: 'ul' },
      { text: L3("ol raqamli ro'yxat bo'ladi, raqamlarni brauzer o'zi qo'yadi.", 'ol — список с номерами, номера ставит браузер.', 'ol is a numbered list; the browser adds the numbers.'), k: 'ol' },
      { text: L3("li esa ro'yxatning bitta bandi bo'ladi, u doim ul yoki ol ichida turadi.", 'А li — один пункт списка, он всегда стоит внутри ul или ol.', 'And li is one list item; it always sits inside ul or ol.'), k: 'li' },
      { text: L3("Tabriklayman! Endi sahifangizda tartibli ro'yxatlar bor. Keyingi darsda havolalar bilan tanishamiz. Ko'rishguncha!", 'Ура! Теперь на твоей странице есть аккуратные списки. На следующем уроке познакомимся со ссылками. До встречи!', 'Hooray! Now your page has neat lists. Next time we’ll meet links. See you!'), k: null }
    ],
    roles: {
      ul: L3("ul — nuqtali ro'yxat", 'ul — список с точками', 'ul — bulleted list'),
      ol: L3("ol — raqamli ro'yxat", 'ol — список с номерами', 'ol — numbered list'),
      li: L3("li — ro'yxat bandi", 'li — пункт списка', 'li — list item')
    },
    ask: L3("Ro'yxatingizga qarang", 'Посмотри на свой список', 'Look at your list')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { why: 1, magic: 1, magicP: 1, msgs: 1, sayUl: 1, sayLi: 1, sayOl: 1, sayAuto: 1, sayA: 1, sayB: 1, askQ: 1, miss: 1,
  order1: 1, order2: 1, order3: 1, say2: 1, fine: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:z3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:z3.css@*/
`;
