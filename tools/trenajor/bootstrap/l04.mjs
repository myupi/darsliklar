// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 4 «Flex» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: d-flex — тот же display: flex; justify-content-* без d-flex не работает; главная ось — justify-content
// (start, center, end, between, around, evenly), поперечная — align-items (end, center); число в gap-N — номер в таблице
// сайта (gap-4 = 12 px, gap-5 = 16 px, gap-9 = 32 px), а не пиксели; flex-wrap переносит, flex-column ставит столбиком;
// в flex-column по центру ставит align-items-center; align-items не видно у блоков одной высоты; найти на сайте
// (Utilities → Justify content, Gap), скопировать пример и поменять только тексты.
// Классы сверены с tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css. Ситуации тестов модуля
// (tools/webtest/bootstrap/l04.jsx) не повторяются. Апостроф в узбекском — ASCII «'».
// Словарь урока: qator, ustun, bosh o'q, ko'ndalang o'q, oraliq, chetlarga taqsimlash, joylashtirish.
// =============================================================================

const L3c = (fn) => ({ uz: fn(0), ru: fn(1), en: fn(2) });
const box = (t) => `  <div class="p-2 bg-warning">${t}</div>`;
const tapRow = (cls, t) => `<div class="d-flex ${cls} gap-2 p-2 border rounded mb-3" data-t="${t}">`
  + '<div class="p-3 bg-warning rounded"></div><div class="p-3 bg-warning rounded"></div><div class="p-3 bg-warning rounded"></div></div>';

export default [
  {
    id: 'bootstrap_l04_q01',
    difficulty: 'easy',
    tags: ['d-flex'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "CSS darsida bloklarni qatorga qoida bilan qo'ygan edik. Bootstrapda esa bitta so'z bor: d-flex.",
      q: "d-flex ichida qaysi CSS qoidasi yashiringan?",
      opts: ['display: flex', 'flex-direction: row', 'display: block', 'float: left'],
      why: "d-flex — CSS darsidagi o'sha display: flex, faqat qisqa nom bilan. Qoidani Bootstrap oldindan yozib qo'ygan, biz faqat so'zni class ichiga qo'yamiz.",
    },
    ru: {
      ctx: 'В CSS мы ставили блоки в ряд правилом. А в Bootstrap для этого одно слово: d-flex.',
      q: 'Какое CSS-правило спрятано внутри d-flex?',
      opts: ['display: flex', 'flex-direction: row', 'display: block', 'float: left'],
      why: 'd-flex — тот же display: flex из CSS, только с коротким именем. Правило Bootstrap уже написал, нам остаётся поставить слово в class.',
    },
    en: {
      ctx: 'In CSS we put blocks in a row with a rule. In Bootstrap it’s one word: d-flex.',
      q: 'Which CSS rule is hidden inside d-flex?',
      opts: ['display: flex', 'flex-direction: row', 'display: block', 'float: left'],
      why: 'd-flex is the same display: flex from CSS, just with a short name. Bootstrap already wrote the rule; we only put the word in class.',
    },
  },
  {
    id: 'bootstrap_l04_q02',
    difficulty: 'easy',
    tags: ['justify-content'],
    mono: false,
    sort: false,
    vis: {
      code: L3c((i) => '<nav class="d-flex justify-content-center">\n'
        + `  <a href="#">${['Bosh sahifa', 'Главная', 'Home'][i]}</a>\n`
        + `  <a href="#">${['Robotlar', 'Роботы', 'Robots'][i]}</a>\n`
        + `  <a href="#">${['Aloqa', 'Контакты', 'Contact'][i]}</a>\n</nav>`),
    },
    uz: {
      ctx: "Robot to'garagi saytining menyusi: nav tegi va uchta havola.",
      q: 'Sahifada menyu bandlari qayerda turadi?',
      opts: ["Bir qatorda, o'rtada", 'Bir qatorda, chap chetda', 'Ikki chetga taqsimlangan', "Ustun bo'lib, o'rtada"],
      why: "d-flex bandlarni bir qatorga qo'yadi, justify-content-center esa ularni bosh o'q bo'ylab o'rtaga yig'adi.",
    },
    ru: {
      ctx: 'Меню сайта кружка роботов: тег nav и три ссылки.',
      q: 'Где на странице встанут пункты меню?',
      opts: ['В ряд, посередине', 'В ряд, у левого края', 'Разойдутся по краям', 'Столбиком, посередине'],
      why: 'd-flex ставит пункты в ряд, а justify-content-center собирает их посередине главной оси.',
    },
    en: {
      ctx: 'The robot club site menu: a nav tag and three links.',
      q: 'Where will the menu items stand on the page?',
      opts: ['In a row, in the middle', 'In a row, at the left edge', 'Spread to both edges', 'In a column, in the middle'],
      why: 'd-flex puts the items in a row, and justify-content-center gathers them in the middle of the main axis.',
    },
  },
  {
    id: 'bootstrap_l04_q03',
    difficulty: 'easy',
    tags: ['d-flex', 'justify-content'],
    mono: false,
    sort: false,
    vis: {
      code: '<div class="justify-content-between">\n' + box('Robo-1') + '\n' + box('Robo-2') + '\n' + box('Robo-3') + '\n</div>',
      page: true,
    },
    uz: {
      ctx: "Uchta robot ikki chetga taqsimlanishi kerak edi, lekin ular ustma-ust turibdi.",
      q: 'Nega justify-content-between ishlamadi?',
      opts: ["class ichida d-flex yo'q", 'between emas, space-between kerak', 'Robotlarning bloklari juda keng', "justify-content har bir robotga yoziladi"],
      why: "Joylashtiradigan so'zlar faqat flex qutida ishlaydi. Oldin d-flex bloklarni qatorga qo'yadi, keyin justify-content-between ularni chetlarga taqsimlaydi.",
    },
    ru: {
      ctx: 'Три робота должны были разойтись по краям, а стоят друг под другом.',
      q: 'Почему justify-content-between не сработал?',
      opts: ['В class нет d-flex', 'Нужно space-between, а не between', 'Блоки роботов слишком широкие', 'justify-content пишут каждому роботу'],
      why: 'Слова расстановки работают только во flex-коробке. Сначала d-flex ставит блоки в ряд, потом justify-content-between разводит их по краям.',
    },
    en: {
      ctx: 'Three robots were supposed to spread to both edges, but they’re stacked.',
      q: 'Why didn’t justify-content-between work?',
      opts: ['There’s no d-flex in class', 'It needs space-between, not between', 'The robot blocks are too wide', 'justify-content goes on each robot'],
      why: 'Placement words only work in a flex box. First d-flex puts the blocks in a row, then justify-content-between spreads them to the edges.',
    },
  },
  {
    id: 'bootstrap_l04_q04',
    difficulty: 'easy',
    tags: ['site', 'justify-content'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Bloklarni joylashtiradigan so'zlarni Bootstrap saytidan topmoqchisiz.",
      q: "Justify content sahifasi qaysi bo'limda?",
      opts: ['Utilities', 'Components', 'Getting started', 'Content'],
      why: "Bitta ishni qiladigan kichik so'zlar Utilities bo'limida: Flex, Justify content, Align items, Gap. Components bo'limida esa tayyor bo'laklar, masalan Alert va Card.",
    },
    ru: {
      ctx: 'Ты ищешь на сайте Bootstrap слова, которые расставляют блоки.',
      q: 'В каком разделе страница Justify content?',
      opts: ['Utilities', 'Components', 'Getting started', 'Content'],
      why: 'Маленькие слова для одного дела живут в разделе Utilities: Flex, Justify content, Align items, Gap. А в Components — готовые части, например Alert и Card.',
    },
    en: {
      ctx: 'You’re looking on the Bootstrap site for the words that place blocks.',
      q: 'Which section has the Justify content page?',
      opts: ['Utilities', 'Components', 'Getting started', 'Content'],
      why: 'Small one-job words live in Utilities: Flex, Justify content, Align items, Gap. Components holds ready-made parts, like Alert and Card.',
    },
  },
  {
    id: 'bootstrap_l04_q05',
    difficulty: 'medium',
    tags: ['gap'],
    mono: false,
    sort: false,
    vis: {
      code: '<div class="d-flex gap-32">\n  <img src="sher.png">\n  <img src="pingvin.png">\n</div>',
      page: true,
    },
    uz: {
      ctx: "Rasmlar o'rtasida 32 px bo'lishi kerak. Kodi gap-32 yozdi, rasmlar esa yopishib turibdi.",
      q: "Nega oraliq paydo bo'lmadi?",
      opts: ["gap-32 degan so'z jadvalda yo'q", 'gap faqat d-flex siz ishlaydi', "Rasmlar o'rtasida oraliq bo'lmaydi", 'Oraliqni px bilan yozish kerak'],
      why: "gap so'zidan keyingi raqam piksel emas, saytdagi jadvaldagi tartib raqami: 0 dan 12 gacha. Jadvalda 32 px — bu gap-9.",
    },
    ru: {
      ctx: 'Между картинками нужно 32 px. Коди написал gap-32, а картинки слиплись.',
      q: 'Почему промежуток не появился?',
      opts: ['Слова gap-32 нет в таблице', 'gap работает только без d-flex', 'У картинок не бывает промежутков', 'Промежуток надо писать с px'],
      why: 'Число после gap — не пиксели, а номер в таблице на сайте: от 0 до 12. По таблице 32 px — это gap-9.',
    },
    en: {
      ctx: 'There should be 32 px between the pictures. Kodi wrote gap-32, and they stuck together.',
      q: 'Why didn’t the gap appear?',
      opts: ['There’s no gap-32 in the table', 'gap only works without d-flex', 'Pictures can’t have gaps', 'The gap must be written with px'],
      why: 'The number after gap isn’t pixels but a number in the table on the site: 0 to 12. In the table, 32 px is gap-9.',
    },
  },
  {
    id: 'bootstrap_l04_q06',
    difficulty: 'medium',
    tags: ['align-items'],
    mono: true,
    sort: false,
    vis: {
      page: L3c((i) => '<header class="d-flex align-items-end gap-5 p-2 border">\n  <img src="logo.png">\n'
        + `  <b>RoboKlub</b>\n  <b>${['Aloqa', 'Контакты', 'Contact'][i]}</b>\n</header>`),
    },
    uz: {
      ctx: "Logotip baland, yozuvlar past. Yozuvlar logotipning pastki chetida turibdi.",
      q: "class ichidagi qaysi so'z ularni shunday qo'ydi?",
      opts: ['align-items-end', 'justify-content-end', 'align-items-bottom', 'align-items-start'],
      why: "Tepa yoki past — bu ko'ndalang o'q, uni align-items boshqaradi, end esa pastki chet. justify-content-end bloklarni o'ng chetga surardi, align-items-bottom degan so'z yo'q.",
    },
    ru: {
      ctx: 'Логотип высокий, надписи низкие. Надписи стоят у нижнего края логотипа.',
      q: 'Какое слово в class так их поставило?',
      opts: ['align-items-end', 'justify-content-end', 'align-items-bottom', 'align-items-start'],
      why: 'Верх и низ — это поперечная ось, ею управляет align-items, а end — нижний край. justify-content-end сдвинул бы блоки вправо, а слова align-items-bottom нет.',
    },
    en: {
      ctx: 'The logo is tall, the labels are short. The labels sit at the logo’s bottom edge.',
      q: 'Which word in class placed them like this?',
      opts: ['align-items-end', 'justify-content-end', 'align-items-bottom', 'align-items-start'],
      why: 'Top and bottom are the cross axis, controlled by align-items, and end is the bottom edge. justify-content-end would move blocks right, and align-items-bottom doesn’t exist.',
    },
  },
  {
    id: 'bootstrap_l04_q07',
    difficulty: 'medium',
    tags: ['justify-content', 'evenly'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Uchta kartochka orasidagi joylar ham, chetlardagi joylar ham bir xil bo'lishi kerak.",
      q: "Qaysi so'z kerak?",
      opts: ['justify-content-evenly', 'justify-content-around', 'justify-content-between', 'justify-content-center'],
      why: "evenly hamma oraliqni bir xil qiladi, chetdagilarni ham. around har bir blok atrofiga teng joy beradi, chetlarda esa joy ikki baravar kam. between chetlarda joy qoldirmaydi.",
    },
    ru: {
      ctx: 'Промежутки между тремя карточками и у краёв должны быть одинаковыми.',
      q: 'Какое слово нужно?',
      opts: ['justify-content-evenly', 'justify-content-around', 'justify-content-between', 'justify-content-center'],
      why: 'evenly делает все промежутки одинаковыми, и у краёв тоже. around даёт каждому блоку равные поля, поэтому у краёв места вдвое меньше. between у краёв места не оставляет.',
    },
    en: {
      ctx: 'The spaces between three cards and at the edges must all be equal.',
      q: 'Which word do you need?',
      opts: ['justify-content-evenly', 'justify-content-around', 'justify-content-between', 'justify-content-center'],
      why: 'evenly makes every space equal, at the edges too. around gives each block equal margins, so the edges get half as much. between leaves no space at the edges.',
    },
  },
  {
    id: 'bootstrap_l04_q08',
    difficulty: 'medium',
    tags: ['site', 'copy'],
    mono: false,
    sort: false,
    vis: {
      code: '<div class="d-flex justify-content-center">\n  <div class="p-2">Flex item 1</div>\n'
        + '  <div class="p-2">Flex item 2</div>\n  <div class="p-2">Flex item 3</div>\n</div>',
    },
    uz: {
      ctx: "Justify content sahifasidan namunani nusxaladingiz. Menyu bandlari ham shunday o'rtada tursin.",
      q: "Nusxalangan kodda nimani o'zgartirasiz?",
      opts: ['Flex item yozuvlarini menyu bandlariga', "d-flex so'zini o'z so'zingizga", 'justify-content-center o\'rniga center', 'Hech narsani, Flex item qolaversin'],
      why: "Namunada joylashuv allaqachon kerakli: d-flex va justify-content-center. Moslash uchun faqat matnni o'zgartiramiz: Flex item o'rniga o'z bandlarimiz.",
    },
    ru: {
      ctx: 'Ты скопировал пример со страницы Justify content. Пункты меню тоже должны стоять посередине.',
      q: 'Что ты меняешь в скопированном коде?',
      opts: ['Тексты Flex item — на пункты меню', 'Слово d-flex — на своё слово', 'justify-content-center — на center', 'Ничего, пусть будет Flex item'],
      why: 'Расстановка в примере уже нужная: d-flex и justify-content-center. Чтобы настроить под себя, меняем только тексты: вместо Flex item — свои пункты.',
    },
    en: {
      ctx: 'You copied the example from the Justify content page. The menu items should be centered too.',
      q: 'What do you change in the copied code?',
      opts: ['The Flex item texts, to menu items', 'The word d-flex, to your own word', 'justify-content-center, to center', 'Nothing, keep Flex item'],
      why: 'The example already has the right placement: d-flex and justify-content-center. To adapt it, we only change the text: our own items instead of Flex item.',
    },
  },
  {
    id: 'bootstrap_l04_q09',
    difficulty: 'medium',
    tags: ['flex-wrap'],
    mono: true,
    sort: false,
    vis: {
      code: '<div class="d-flex gap-3">\n  <img src="sher.png">\n  <img src="mushuk.png">\n  <img src="pingvin.png">\n</div>',
      page: true,
      vw: 360,
    },
    uz: {
      ctx: "Telefonda uchta rasm bir qatorga sig'madi: uchinchisi ekrandan chiqib ketdi.",
      q: "Sig'magan rasm keyingi qatorga o'tishi uchun class ichiga nima qo'shiladi?",
      opts: ['flex-wrap', 'flex-column', 'justify-content-around', 'gap-0'],
      why: "flex-wrap sig'magan bloklarni keyingi qatorga o'tkazadi. flex-column hammasini ustun qilardi, gap-0 bilan ham uchta rasm sig'maydi, around esa faqat joylashtiradi.",
    },
    ru: {
      ctx: 'На телефоне три картинки не влезли в ряд: третья вылезла за экран.',
      q: 'Что добавить в class, чтобы лишняя картинка ушла на новую строку?',
      opts: ['flex-wrap', 'flex-column', 'justify-content-around', 'gap-0'],
      why: 'flex-wrap переносит то, что не влезло, на следующую строку. flex-column поставил бы всё столбиком, с gap-0 три картинки всё равно не влезут, а around только расставляет.',
    },
    en: {
      ctx: 'On a phone three pictures didn’t fit in a row: the third one went off the screen.',
      q: 'What do you add to class so the extra picture moves to a new line?',
      opts: ['flex-wrap', 'flex-column', 'justify-content-around', 'gap-0'],
      why: 'flex-wrap moves what doesn’t fit to the next line. flex-column would stack everything, three pictures still don’t fit with gap-0, and around only places them.',
    },
  },
  {
    id: 'bootstrap_l04_q10',
    difficulty: 'hard',
    tags: ['flex-column', 'align-items'],
    mono: true,
    sort: false,
    vis: {
      code: L3c((i) => '<div class="d-flex flex-column gap-3">\n'
        + box(['Kirish', 'Вход', 'Log in'][i]) + '\n' + box(['Jadval', 'Расписание', 'Schedule'][i]) + '\n'
        + box(['Aloqa', 'Контакты', 'Contact'][i]) + '\n</div>'),
      page: true,
    },
    uz: {
      ctx: "Uchta blok ustun bo'lib turibdi va sahifaning butun eniga cho'zilgan. Ular tor bo'lib, o'rtada tursin.",
      q: "class ichiga qaysi so'z qo'shiladi?",
      opts: ['align-items-center', 'justify-content-center', 'text-center', 'flex-wrap'],
      why: "flex-column bo'lganda bosh o'q tepadan pastga ketadi, ko'ndalang o'q esa chapdan o'ngga. Chapdan o'ngga o'rtaga qo'yish ko'ndalang o'qning ishi, demak align-items-center. Bloklar cho'zilmaydi ham.",
    },
    ru: {
      ctx: 'Три блока стоят столбиком и растянулись на всю ширину страницы. Они должны быть узкими и посередине.',
      q: 'Какое слово добавить в class?',
      opts: ['align-items-center', 'justify-content-center', 'text-center', 'flex-wrap'],
      why: 'В flex-column главная ось идёт сверху вниз, а поперечная — слева направо. Посередине по ширине — это поперечная ось, то есть align-items-center. И блоки перестанут растягиваться.',
    },
    en: {
      ctx: 'Three blocks stand in a column and stretch across the whole page. They should be narrow and centered.',
      q: 'Which word do you add to class?',
      opts: ['align-items-center', 'justify-content-center', 'text-center', 'flex-wrap'],
      why: 'In flex-column the main axis runs top to bottom and the cross axis left to right. Centering across is the cross axis: align-items-center. The blocks stop stretching too.',
    },
  },
  {
    id: 'bootstrap_l04_q11',
    difficulty: 'hard',
    tags: ['align-items'],
    mono: false,
    sort: false,
    vis: {
      code: L3c((i) => '<div class="d-flex gap-3 align-items-center">\n'
        + box(['Pitsa', 'Пицца', 'Pizza'][i]) + '\n' + box(['Tort', 'Торт', 'Cake'][i]) + '\n'
        + box(['Sharbat', 'Сок', 'Juice'][i]) + '\n</div>'),
      page: true,
    },
    uz: {
      ctx: "Kafe menyusida uchta blok. Kodi align-items-center qo'shdi, lekin hech narsa siljimadi.",
      q: "Nega bloklar joyidan qimirlamadi?",
      opts: ["Bloklar bir xil balandlikda: siljishga joy yo'q", 'align-items faqat ustunda ishlaydi', 'Oldin align-items, keyin d-flex yoziladi', "align-items-center oltinchi versiyada yo'q"],
      why: "align-items bloklarni ko'ndalang o'q bo'ylab joylashtiradi: qatorda bu balandlik. Hamma blok bir xil balandlikda bo'lsa, siljitishga joy yo'q. Baland logotip bo'lsa, farq ko'rinadi.",
    },
    ru: {
      ctx: 'В меню кафе три блока. Коди добавил align-items-center, но ничего не сдвинулось.',
      q: 'Почему блоки остались на месте?',
      opts: ['Блоки одной высоты: двигать некуда', 'align-items работает только в столбике', 'Сначала пишут align-items, потом d-flex', 'align-items-center нет в шестой версии'],
      why: 'align-items расставляет блоки по поперечной оси, то есть по высоте. Если все блоки одной высоты, двигать их некуда. С высоким логотипом разница будет видна.',
    },
    en: {
      ctx: 'The café menu has three blocks. Kodi added align-items-center, but nothing moved.',
      q: 'Why did the blocks stay put?',
      opts: ['They’re the same height: no room to move', 'align-items only works in a column', 'align-items must come before d-flex', 'align-items-center isn’t in version 6'],
      why: 'align-items places blocks along the cross axis, that is, by height. If all blocks are the same height, there’s nowhere to move them. With a tall logo you’d see the difference.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'bootstrap_l04_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['justify-content'],
    mono: true,
    answer: ['justify-content-center'],
    vis: {
      code: L3c((i) => '<nav class="d-flex ___">\n'
        + `  <a href="#">${['Robotlar', 'Роботы', 'Robots'][i]}</a>\n`
        + `  <a href="#">${['Jadval', 'Расписание', 'Schedule'][i]}</a>\n`
        + `  <a href="#">${['Aloqa', 'Контакты', 'Contact'][i]}</a>\n</nav>`),
    },
    uz: {
      ctx: "Menyu bandlari qatorda, lekin chap chetda turibdi. Ular o'rtada tursin.",
      q: "Bo'sh joyga bitta so'z yozing.",
      why: "Chapdan o'ngga joylashtirish — bosh o'q, uni justify-content boshqaradi. O'rtaga qo'yish uchun oxirida center: justify-content-center.",
    },
    ru: {
      ctx: 'Пункты меню в ряд, но стоят у левого края. Они должны встать посередине.',
      q: 'Впиши на пустое место одно слово.',
      why: 'Расстановка слева направо — главная ось, ею управляет justify-content. Чтобы поставить посередине, в конце center: justify-content-center.',
    },
    en: {
      ctx: 'The menu items are in a row but sit at the left edge. They should be in the middle.',
      q: 'Type one word in the empty spot.',
      why: 'Placing left to right is the main axis, controlled by justify-content. To center, end it with center: justify-content-center.',
    },
  },
  {
    id: 'bootstrap_l04_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['gap'],
    mono: true,
    answer: ['gap-5'],
    vis: { code: '<div class="d-flex ___">\n  <img src="robot.png">\n  <img src="top.png">\n</div>' },
    uz: {
      ctx: "Rasmlar o'rtasida 16 px bo'lsin. Saytdagi Gap jadvali: gap-4 — 12 px, gap-5 — 16 px, gap-6 — 20 px.",
      q: "Bo'sh joyga oraliq so'zini yozing.",
      why: "gap so'zidan keyingi raqam — jadvaldagi tartib raqami, piksel emas. Jadvalda 16 px gap-5 qatorida turibdi.",
    },
    ru: {
      ctx: 'Между картинками нужно 16 px. Таблица Gap на сайте: gap-4 — 12 px, gap-5 — 16 px, gap-6 — 20 px.',
      q: 'Впиши на пустое место слово промежутка.',
      why: 'Число после gap — номер в таблице, а не пиксели. В таблице 16 px стоит в строке gap-5.',
    },
    en: {
      ctx: 'Put 16 px between the pictures. The site’s Gap table: gap-4 is 12 px, gap-5 is 16 px, gap-6 is 20 px.',
      q: 'Type the gap word in the empty spot.',
      why: 'The number after gap is a number in the table, not pixels. In the table, 16 px is on the gap-5 row.',
    },
  },
  {
    id: 'bootstrap_l04_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['flex-column'],
    mono: true,
    answer: ['flex-column'],
    vis: {
      code: L3c((i) => '<nav class="d-flex ___ gap-3">\n'
        + `  <a href="#">${['Robotlar', 'Роботы', 'Robots'][i]}</a>\n`
        + `  <a href="#">${['Jadval', 'Расписание', 'Schedule'][i]}</a>\n`
        + `  <a href="#">${['Aloqa', 'Контакты', 'Contact'][i]}</a>\n</nav>`),
    },
    uz: {
      ctx: "Telefonda menyu bandlari bir-birining ostida tursin. d-flex qolsin.",
      q: "Bo'sh joyga ustun yasaydigan so'zni yozing.",
      why: "flex-column bosh o'qni tepadan pastga buradi: bandlar ustun bo'lib turadi. CSS tilida bu flex-direction: column.",
    },
    ru: {
      ctx: 'На телефоне пункты меню должны стоять друг под другом. d-flex остаётся.',
      q: 'Впиши на пустое место слово, которое делает столбик.',
      why: 'flex-column поворачивает главную ось сверху вниз: пункты встают столбиком. На языке CSS это flex-direction: column.',
    },
    en: {
      ctx: 'On a phone the menu items should stand one under another. d-flex stays.',
      q: 'Type the word that makes a column in the empty spot.',
      why: 'flex-column turns the main axis top to bottom: the items stand in a column. In CSS terms it’s flex-direction: column.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l04_q15',
    type: 'build',
    difficulty: 'easy',
    tags: ['d-flex', 'gap'],
    pieces: ['<nav', ' class="d-flex gap-5"', '>'],
    extra: [' class="gap-5"', ' style="d-flex gap-5"'],
    vis: {
      code: L3c((i) => `___\n  <a href="#">${['Robotlar', 'Роботы', 'Robots'][i]}</a>\n  <a href="#">${['Aloqa', 'Контакты', 'Contact'][i]}</a>\n</nav>`),
    },
    uz: {
      ctx: "Menyu bandlari qatorda tursin, o'rtasida 16 px bo'lsin.",
      q: "Bo'laklarni tartib bilan bosib, nav tegini yig'ing",
      why: "Bootstrap so'zlari style ichiga emas, class ichiga yoziladi. gap faqat flex qutida ishlaydi, shuning uchun d-flex ham kerak: d-flex gap-5.",
    },
    ru: {
      ctx: 'Пункты меню должны стоять в ряд, между ними 16 px.',
      q: 'Нажимай кусочки по порядку и собери тег nav',
      why: 'Слова Bootstrap пишут не в style, а в class. gap работает только во flex-коробке, поэтому нужен и d-flex: d-flex gap-5.',
    },
    en: {
      ctx: 'The menu items should stand in a row with 16 px between them.',
      q: 'Tap the pieces in order to build the nav tag',
      why: 'Bootstrap words go in class, not in style. gap only works in a flex box, so d-flex is needed too: d-flex gap-5.',
    },
  },
  {
    id: 'bootstrap_l04_q16',
    type: 'build',
    difficulty: 'medium',
    tags: ['justify-content', 'between'],
    pieces: ['justify', '-content', '-between'],
    extra: ['-space', '-center', 'align'],
    vis: {
      code: L3c((i) => '<header class="d-flex ___">\n  <img src="logo.png">\n  <b>RoboKlub</b>\n'
        + `  <a href="#">${['Kirish', 'Вход', 'Log in'][i]}</a>\n</header>`),
    },
    uz: {
      ctx: "Logotip chap chetda, «Kirish» o'ng chetda, nom esa o'rtada tursin.",
      q: "Bo'laklarni bosib, joylashtiradigan so'zni yig'ing",
      why: "Chetlarga taqsimlash — justify-content-between. CSS qiymati space-between edi, Bootstrap esa uni qisqa yozadi: between. center esa hammasini o'rtaga yig'ardi.",
    },
    ru: {
      ctx: 'Логотип у левого края, «Вход» у правого, а название посередине.',
      q: 'Нажимай кусочки и собери слово расстановки',
      why: 'Развести по краям — justify-content-between. В CSS значение было space-between, а Bootstrap пишет короче: between. А center собрал бы всё посередине.',
    },
    en: {
      ctx: 'The logo at the left edge, “Log in” at the right edge, and the name in the middle.',
      q: 'Tap the pieces to build the placement word',
      why: 'Spreading to the edges is justify-content-between. In CSS the value was space-between; Bootstrap writes it shorter: between. center would gather everything in the middle.',
    },
  },
  {
    id: 'bootstrap_l04_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['gap'],
    line: 2,
    vis: {
      code: L3c((i) => `<h4 class="fg-success">${["Hayvonot bog'i", 'Зоопарк', 'The zoo'][i]}</h4>\n`
        + '<div class="d-flex gap-16">\n  <img src="sher.png">\n  <img src="pingvin.png">\n</div>'),
      page: true,
    },
    uz: {
      ctx: "Hayvonlar rasmlari o'rtasida 16 px bo'lishi kerak, lekin ular yopishib turibdi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "2-qatorda gap-16 turibdi, bunday so'z yo'q: raqam piksel emas, jadvaldagi tartib raqami. Jadvalda 16 px — bu gap-5.",
    },
    ru: {
      ctx: 'Между картинками зверей должно быть 16 px, а они слиплись.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 2 стоит gap-16, а такого слова нет: число — не пиксели, а номер в таблице. По таблице 16 px — это gap-5.',
    },
    en: {
      ctx: 'There should be 16 px between the animal pictures, but they stuck together.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 2 has gap-16, and there’s no such word: the number isn’t pixels but a number in the table. In the table, 16 px is gap-5.',
    },
  },
  {
    id: 'bootstrap_l04_q18',
    type: 'tap',
    difficulty: 'easy',
    tags: ['justify-content'],
    answer: 'end',
    vis: {
      page: tapRow('justify-content-center', 'center') + '\n' + tapRow('justify-content-end', 'end') + '\n'
        + tapRow('justify-content-start', 'start') + '\n' + tapRow('justify-content-between', 'between'),
    },
    uz: {
      ctx: "Sahifada to'rtta qator bor, har birida bitta joylashtiradigan so'z.",
      q: 'justify-content-end yozilgan qatorni bosing',
      why: "end — bosh o'qning oxiri: hamma bloklar o'ng chetga yig'iladi. start chapga, center o'rtaga yig'adi, between esa chetlarga taqsimlaydi.",
    },
    ru: {
      ctx: 'На странице четыре ряда, в каждом одно слово расстановки.',
      q: 'Нажми на ряд, где написано justify-content-end',
      why: 'end — конец главной оси: все блоки собираются у правого края. start собирает слева, center посередине, а between разводит по краям.',
    },
    en: {
      ctx: 'The page has four rows, each with one placement word.',
      q: 'Tap the row that has justify-content-end',
      why: 'end is the end of the main axis: all blocks gather at the right edge. start gathers them left, center in the middle, and between spreads them to the edges.',
    },
  },
];
