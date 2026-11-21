// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 2 «Цвета и кнопки» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14) + игровые: 2 «собери» (q15, q16), 1 «найди ошибку» (q17), 1 «нажми на странице» (q18).
// Проверяем: кнопка — два слова: стиль btn-solid / btn-outline + цвет theme-*; смысл цветов (primary — синий, accent —
// фиолетовый, success, danger, warning, info — голубой, inverse — чёрный, secondary — серый); одна семья слов цвета для
// кнопки и e'lon; цвет текста fg-*, фон bg-*; сайт: Components → Button → Variants, Utilities → Colors / Background;
// скопированную кнопку настраивают: цвет и надпись; btn-solid без цвета — серая; theme-* без стиля — обычная кнопка;
// theme-green — такого слова нет; btn-danger, text-primary — имена версии 5.
// Словарь: tugma, uslub, ichi to'la, chegarali, rang so'zi, matn rangi, fon, Variants bo'limi, eski nom.
// Тесты модуля (tools/webtest/bootstrap/l02.jsx) не повторяем. Апостроф в узбекском — только ASCII «'».
// =============================================================================
export default [
  {
    id: 'bootstrap_l02_q01',
    difficulty: 'easy',
    tags: ['theme-accent'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: '<button class="btn-solid theme-accent">\n  Yozilish\n</button>',
        ru: '<button class="btn-solid theme-accent">\n  Записаться\n</button>',
        en: '<button class="btn-solid theme-accent">\n  Sign up\n</button>',
      },
    },
    uz: {
      ctx: "Robo-futbol sayti uchun tugma kodi tayyor, lekin sahifa hali ochilmagan.",
      q: "Bu tugma qaysi rangda bo'ladi?",
      opts: ['Binafsha', "Ko'k", 'Yashil', 'Kulrang'],
      why: "accent, ya'ni urg'u degani: Bootstrapda u binafsha rang. Ko'k rang primary, yashil success, kulrang esa secondary.",
    },
    ru: {
      ctx: 'Код кнопки для сайта Robo-futbol готов, но страница ещё не открыта.',
      q: 'Какого цвета будет эта кнопка?',
      opts: ['Фиолетовой', 'Синей', 'Зелёной', 'Серой'],
      why: 'accent значит «акцент»: в Bootstrap это фиолетовый. Синий — primary, зелёный — success, серый — secondary.',
    },
    en: {
      ctx: 'The button code for the Robo-futbol site is ready, but the page isn’t open yet.',
      q: 'What color will this button be?',
      opts: ['Purple', 'Blue', 'Green', 'Gray'],
      why: 'accent means an accent color: in Bootstrap it is purple. Blue is primary, green is success, gray is secondary.',
    },
  },
  {
    id: 'bootstrap_l02_q02',
    difficulty: 'easy',
    tags: ['button', 'docs'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Sizga tugmalarning hamma ranglari va ularning kodi kerak.",
      q: 'Saytning qaysi sahifasini ochasiz?',
      opts: ['Components → Button', 'Utilities → Background', 'Getting started → Install', 'Components → Alert'],
      why: "Tugmalar Components bo'limida, Button sahifasida. Uning Variants qismida har bir rangdagi tugma va tagida uning kodi turadi.",
    },
    ru: {
      ctx: 'Тебе нужны все цвета кнопок и их код.',
      q: 'Какую страницу сайта откроешь?',
      opts: ['Components → Button', 'Utilities → Background', 'Getting started → Install', 'Components → Alert'],
      why: 'Кнопки лежат в разделе Components, на странице Button. В её части Variants есть кнопка каждого цвета, а под ней — её код.',
    },
    en: {
      ctx: 'You need all the button colors and their code.',
      q: 'Which page of the site do you open?',
      opts: ['Components → Button', 'Utilities → Background', 'Getting started → Install', 'Components → Alert'],
      why: 'Buttons are in the Components section, on the Button page. Its Variants part shows a button of every color with its code below.',
    },
  },
  {
    id: 'bootstrap_l02_q03',
    difficulty: 'easy',
    tags: ['btn-solid', 'btn-outline'],
    mono: false,
    sort: false,
    vis: {
      page: {
        uz: '<button class="btn-solid theme-success">Yozilish</button>\n<button class="btn-outline theme-success">Batafsil</button>',
        ru: '<button class="btn-solid theme-success">Записаться</button>\n<button class="btn-outline theme-success">Подробнее</button>',
        en: '<button class="btn-solid theme-success">Sign up</button>\n<button class="btn-outline theme-success">More</button>',
      },
    },
    uz: {
      ctx: "Saytda ikkita yashil tugma bor: birining ichi to'la, ikkinchisining faqat chegarasi rangli.",
      q: 'Kodda ular nimasi bilan farq qiladi?',
      opts: ["Birinchi so'zi: btn-solid va btn-outline", "Rang so'zi: theme-success va theme-info", 'Tegi: biri button, biri a', "Hech nimasi: brauzer o'zi shunday chizdi"],
      why: "Tugmaning birinchi so'zi uslubni beradi: btn-solid — ichi to'la, btn-outline — faqat chegara. Rang so'zi ikkalasida bir xil: theme-success.",
    },
    ru: {
      ctx: 'На сайте две зелёные кнопки: одна залитая, у другой цветная только рамка.',
      q: 'Чем они отличаются в коде?',
      opts: ['Первым словом: btn-solid и btn-outline', 'Словом цвета: theme-success и theme-info', 'Тегом: одна button, другая a', 'Ничем: браузер сам так нарисовал'],
      why: 'Первое слово кнопки задаёт стиль: btn-solid — с заливкой, btn-outline — только рамка. Слово цвета у обеих одно: theme-success.',
    },
    en: {
      ctx: 'The site has two green buttons: one is filled, the other has only a colored border.',
      q: 'How are they different in the code?',
      opts: ['The first word: btn-solid and btn-outline', 'The color word: theme-success and theme-info', 'The tag: one is button, one is a', 'Nothing: the browser drew them that way'],
      why: 'The first word of a button sets the style: btn-solid is filled, btn-outline is just a border. Both have the same color word: theme-success.',
    },
  },
  {
    id: 'bootstrap_l02_q04',
    difficulty: 'easy',
    tags: ['fg', 'docs'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Sarlavha harflarini rangli qilmoqchisiz. So'zni saytdan olasiz.",
      q: 'Matn rangi saytning qaysi sahifasida?',
      opts: ['Utilities → Colors', 'Utilities → Background', 'Components → Button', 'Customize → Color'],
      why: "Matn rangi so'zlari Utilities bo'limidagi Colors sahifasida, ular fg bilan boshlanadi. Background sahifasida esa fon so'zlari bor, ular bg bilan boshlanadi.",
    },
    ru: {
      ctx: 'Хочешь сделать буквы заголовка цветными. Слово берёшь с сайта.',
      q: 'На какой странице сайта цвет текста?',
      opts: ['Utilities → Colors', 'Utilities → Background', 'Components → Button', 'Customize → Color'],
      why: 'Слова цвета текста лежат в разделе Utilities на странице Colors, они начинаются с fg. А на странице Background — слова фона, они начинаются с bg.',
    },
    en: {
      ctx: 'You want to color the heading letters. You take the word from the site.',
      q: 'Which page of the site has text colors?',
      opts: ['Utilities → Colors', 'Utilities → Background', 'Components → Button', 'Customize → Color'],
      why: 'Text color words are in the Utilities section on the Colors page; they start with fg. The Background page has background words; they start with bg.',
    },
  },
  {
    id: 'bootstrap_l02_q05',
    difficulty: 'medium',
    tags: ['theme'],
    mono: true,
    sort: false,
    vis: {
      code: {
        uz: `<div class="alert theme-warning" role="alert">\n  <p>Shanba kuni o'yin!</p>\n</div>\n<button class="btn-solid ___">Yozilish</button>`,
        ru: '<div class="alert theme-warning" role="alert">\n  <p>Игра в субботу!</p>\n</div>\n<button class="btn-solid ___">Записаться</button>',
        en: '<div class="alert theme-warning" role="alert">\n  <p>Game on Saturday!</p>\n</div>\n<button class="btn-solid ___">Sign up</button>',
      },
    },
    uz: {
      ctx: "Tugma tepadagi e'lon bilan bir xil rangda bo'lishi kerak.",
      q: "Bo'sh joyga qaysi so'z yoziladi?",
      opts: ['theme-warning', 'alert-warning', 'btn-warning', 'fg-warning'],
      why: "Ranglar bitta oila: theme-warning e'longa ham, tugmaga ham to'g'ri keladi. fg-warning faqat harflarni bo'yaydi, alert-warning va btn-warning esa 5-versiyaning eski nomlari.",
    },
    ru: {
      ctx: 'Кнопка должна быть того же цвета, что и объявление над ней.',
      q: 'Какое слово пишется на пустое место?',
      opts: ['theme-warning', 'alert-warning', 'btn-warning', 'fg-warning'],
      why: 'Цвета — одна семья: theme-warning подходит и объявлению, и кнопке. fg-warning красит только буквы, а alert-warning и btn-warning — старые имена из 5-й версии.',
    },
    en: {
      ctx: 'The button must be the same color as the notice above it.',
      q: 'Which word goes in the empty spot?',
      opts: ['theme-warning', 'alert-warning', 'btn-warning', 'fg-warning'],
      why: 'Colors are one family: theme-warning fits both the notice and the button. fg-warning colors only the letters, and alert-warning and btn-warning are old version 5 names.',
    },
  },
  {
    id: 'bootstrap_l02_q06',
    difficulty: 'medium',
    tags: ['theme'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: '<button class="btn-solid theme-green">\n  Kirish\n</button>',
        ru: '<button class="btn-solid theme-green">\n  Войти\n</button>',
        en: '<button class="btn-solid theme-green">\n  Log in\n</button>',
      },
      page: true,
    },
    uz: {
      ctx: "Tugma yashil bo'lishi kerak edi, lekin kulrang chiqdi.",
      q: 'Nega?',
      opts: ["theme-green yo'q: yashil — theme-success", "btn-solid faqat kulrang tugma qila oladi", 'Oldin rang, keyin uslub yoziladi', 'Tugmaga yana script qatori kerak'],
      why: "Bootstrap faqat o'z rang so'zlarini biladi: yashil — success. Notanish so'z o'rniga u rangsiz kulrang tugma chizadi. So'zni Variants bo'limidan olish kerak.",
    },
    ru: {
      ctx: 'Кнопка должна была стать зелёной, а получилась серой.',
      q: 'Почему?',
      opts: ['theme-green нет: зелёный — theme-success', 'btn-solid делает кнопку только серой', 'Сначала пишут цвет, потом стиль', 'Кнопке нужна ещё строка script'],
      why: 'Bootstrap знает только свои слова цвета: зелёный — success. Вместо незнакомого слова он рисует кнопку без цвета, серую. Слово берут из раздела Variants.',
    },
    en: {
      ctx: 'The button was supposed to be green, but it came out gray.',
      q: 'Why?',
      opts: ['There is no theme-green: green is theme-success', 'btn-solid only makes gray buttons', 'The color must come before the style', 'The button needs another script line'],
      why: 'Bootstrap knows only its own color words: green is success. For an unknown word it draws a button with no color, gray. Take the word from the Variants section.',
    },
  },
  {
    id: 'bootstrap_l02_q07',
    difficulty: 'medium',
    tags: ['btn-solid', 'theme'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: '<button class="theme-success">\n  Yuborish\n</button>',
        ru: '<button class="theme-success">\n  Отправить\n</button>',
        en: '<button class="theme-success">\n  Send\n</button>',
      },
      page: true,
    },
    uz: {
      ctx: "Kodi tugmaga faqat rang so'zini yozdi, lekin tugma yashil bo'lmadi.",
      q: 'Nima yetishmayapti?',
      opts: ["Uslub so'zi: btn-solid yoki btn-outline", "Yana bitta rang so'zi: theme-green", 'button tegida type atributi', 'head ichida ikkinchi link qatori'],
      why: "Bootstrap tugmasi — ikki so'z: uslub va rang. Uslub so'zi tugmani yasaydi, theme-success esa uni bo'yaydi. Uslubsiz bo'yaladigan tugma yo'q, shuning uchun brauzerning oddiy tugmasi qoladi.",
    },
    ru: {
      ctx: 'Коди написал кнопке только слово цвета, но зелёной она не стала.',
      q: 'Чего не хватает?',
      opts: ['Слова стиля: btn-solid или btn-outline', 'Ещё одного слова цвета: theme-green', 'Атрибута type у тега button', 'Второй строки link внутри head'],
      why: 'Кнопка Bootstrap — два слова: стиль и цвет. Слово стиля делает кнопку, а theme-success её красит. Без стиля красить нечего, и остаётся обычная кнопка браузера.',
    },
    en: {
      ctx: 'Kodi gave the button only a color word, but it didn’t turn green.',
      q: 'What is missing?',
      opts: ['A style word: btn-solid or btn-outline', 'One more color word: theme-green', 'A type attribute on the button tag', 'A second link line inside head'],
      why: 'A Bootstrap button is two words: style and color. The style word builds the button, and theme-success paints it. Without a style there’s nothing to paint, so a plain browser button stays.',
    },
  },
  {
    id: 'bootstrap_l02_q08',
    difficulty: 'medium',
    tags: ['namuna', 'moslash'],
    mono: false,
    sort: false,
    vis: { code: '<button type="button"\n  class="btn-solid theme-primary">\n  Primary\n</button>' },
    uz: {
      ctx: "Saytdan ko'k tugma nusxalandi. Sizga esa qizil «Bekor qilish» tugmasi kerak.",
      q: "Nimalarni o'zgartirasiz?",
      opts: ['primary → danger, Primary → Bekor qilish', "Faqat yozuvni: rang o'zi o'zgaradi", 'btn-solid → btn-danger va yozuvni', 'theme-primary → theme-red va yozuvni'],
      why: "Rangni rang so'zi beradi: qizil — theme-danger. Yozuv teglar o'rtasida turadi, uni o'zingiznikiga almashtirasiz. btn-solid esa uslub, u qoladi.",
    },
    ru: {
      ctx: 'С сайта скопирована синяя кнопка. А нужна красная кнопка «Отмена».',
      q: 'Что поменяешь?',
      opts: ['primary → danger, Primary → Отмена', 'Только надпись: цвет поменяется сам', 'btn-solid → btn-danger и надпись', 'theme-primary → theme-red и надпись'],
      why: 'Цвет даёт слово цвета: красный — theme-danger. Надпись стоит между тегами, её меняешь на свою. А btn-solid — стиль, он остаётся.',
    },
    en: {
      ctx: 'A blue button was copied from the site. But you need a red “Cancel” button.',
      q: 'What do you change?',
      opts: ['primary → danger, Primary → Cancel', 'Only the label: the color changes itself', 'btn-solid → btn-danger and the label', 'theme-primary → theme-red and the label'],
      why: 'The color comes from the color word: red is theme-danger. The label sits between the tags; you replace it with yours. btn-solid is the style, so it stays.',
    },
  },
  {
    id: 'bootstrap_l02_q09',
    difficulty: 'medium',
    tags: ['fg', 'bg'],
    mono: true,
    sort: false,
    vis: {
      page: {
        uz: '<h2 class="fg-success">Robo-futbol</h2>\n<p class="bg-warning">Shanba, soat 10:00</p>',
        ru: '<h2 class="fg-success">Робо-футбол</h2>\n<p class="bg-warning">Суббота, 10:00</p>',
        en: '<h2 class="fg-success">Robo-football</h2>\n<p class="bg-warning">Saturday, 10:00</p>',
      },
    },
    uz: {
      ctx: "Sahifada sarlavha harflari yashil, sana yozilgan qatorning esa foni sariq.",
      q: 'Qaysi kod buni qildi?',
      opts: ['h2: fg-success · p: bg-warning', 'h2: bg-success · p: fg-warning', 'h2: theme-success · p: theme-warning', 'h2: text-success · p: bg-warning'],
      why: "fg — harflar rangi, bg — fon. Shuning uchun h2 tegida fg-success, p tegida bg-warning. text-success — 5-versiyaning eski nomi, theme so'zi esa yolg'iz o'zi hech narsani bo'yamaydi.",
    },
    ru: {
      ctx: 'На странице буквы заголовка зелёные, а у строки с датой жёлтый фон.',
      q: 'Какой код это сделал?',
      opts: ['h2: fg-success · p: bg-warning', 'h2: bg-success · p: fg-warning', 'h2: theme-success · p: theme-warning', 'h2: text-success · p: bg-warning'],
      why: 'fg — цвет букв, bg — фон. Поэтому у h2 — fg-success, у p — bg-warning. text-success — старое имя из 5-й версии, а слово theme само по себе ничего не красит.',
    },
    en: {
      ctx: 'On the page the heading letters are green, and the date line has a yellow background.',
      q: 'Which code did this?',
      opts: ['h2: fg-success · p: bg-warning', 'h2: bg-success · p: fg-warning', 'h2: theme-success · p: theme-warning', 'h2: text-success · p: bg-warning'],
      why: 'fg is the letter color, bg is the background. So h2 has fg-success and p has bg-warning. text-success is an old version 5 name, and a theme word alone colors nothing.',
    },
  },
  {
    id: 'bootstrap_l02_q10',
    difficulty: 'hard',
    tags: ['btn-solid'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: '<button class="btn-solid">\n  Yozilish\n</button>',
        ru: '<button class="btn-solid">\n  Записаться\n</button>',
        en: '<button class="btn-solid">\n  Sign up\n</button>',
      },
    },
    uz: {
      ctx: "Kodi tugmaga btn-solid yozdi-yu, rang so'zini unutdi.",
      q: "Tugma qanday ko'rinadi?",
      opts: ['Bootstrapning kulrang tugmasi', "Ko'k tugma: ko'k — asosiy rang", 'Brauzerning oddiy tugmasi', "Tugma sahifadan yo'qoladi"],
      why: "btn-solid tugmani yasaydi: ichki bo'shliq, yumaloq burchaklar. Rangni esa theme so'zi beradi, u bo'lmasa tugma kulrang bo'lib qoladi.",
    },
    ru: {
      ctx: 'Коди написал кнопке btn-solid, а слово цвета забыл.',
      q: 'Какой будет кнопка?',
      opts: ['Серая кнопка Bootstrap', 'Синяя: синий — главный цвет', 'Обычная кнопка браузера', 'Кнопка пропадёт со страницы'],
      why: 'btn-solid делает кнопку: отступы внутри, скруглённые углы. А цвет даёт слово theme, без него кнопка остаётся серой.',
    },
    en: {
      ctx: 'Kodi gave the button btn-solid but forgot the color word.',
      q: 'What will the button look like?',
      opts: ['A gray Bootstrap button', 'Blue: blue is the main color', 'A plain browser button', 'The button disappears from the page'],
      why: 'btn-solid builds the button: inner space, rounded corners. The color comes from a theme word; without it the button stays gray.',
    },
  },
  {
    id: 'bootstrap_l02_q11',
    difficulty: 'hard',
    tags: ['theme-inverse'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Kino klubi saytiga qora tugma kerak.",
      q: "Qaysi rang so'zi tugmani qora qiladi?",
      opts: ['theme-inverse', 'theme-black', 'theme-dark', 'theme-secondary'],
      why: "inverse, ya'ni teskari degani: Bootstrapda u qora. theme-black va theme-dark degan so'zlar yo'q, secondary esa kulrang.",
    },
    ru: {
      ctx: 'Сайту киноклуба нужна чёрная кнопка.',
      q: 'Какое слово цвета делает кнопку чёрной?',
      opts: ['theme-inverse', 'theme-black', 'theme-dark', 'theme-secondary'],
      why: 'inverse значит «наоборот»: в Bootstrap это чёрный. Слов theme-black и theme-dark нет, а secondary — серый.',
    },
    en: {
      ctx: 'A movie club site needs a black button.',
      q: 'Which color word makes the button black?',
      opts: ['theme-inverse', 'theme-black', 'theme-dark', 'theme-secondary'],
      why: 'inverse means the opposite: in Bootstrap it is black. There are no theme-black or theme-dark words, and secondary is gray.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'bootstrap_l02_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['theme', 'btn-outline'],
    mono: true,
    answer: ['theme-danger'],
    vis: {
      code: {
        uz: `<button class="btn-outline ___">\n  O'chirish\n</button>`,
        ru: '<button class="btn-outline ___">\n  Удалить\n</button>',
        en: '<button class="btn-outline ___">\n  Delete\n</button>',
      },
    },
    uz: {
      ctx: "«O'chirish» tugmasining chegarasi va yozuvi qizil bo'lsin.",
      q: "Bo'sh joyga rang so'zini yozing.",
      why: "Qizil — danger, tugma rangi theme bilan yoziladi: theme-danger. Uslub so'zi btn-outline allaqachon bor, u chegarali tugma qiladi.",
    },
    ru: {
      ctx: 'У кнопки «Удалить» рамка и надпись должны быть красными.',
      q: 'Впиши на пустое место слово цвета.',
      why: 'Красный — danger, цвет кнопки пишется с theme: theme-danger. Слово стиля btn-outline уже есть, оно делает кнопку с рамкой.',
    },
    en: {
      ctx: 'The “Delete” button should have a red border and red label.',
      q: 'Type the color word in the empty spot.',
      why: 'Red is danger, and a button color is written with theme: theme-danger. The style word btn-outline is already there; it makes a border button.',
    },
  },
  {
    id: 'bootstrap_l02_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['fg'],
    mono: true,
    answer: ['fg-accent'],
    vis: {
      code: {
        uz: '<h1 class="___">Robo-futbol</h1>',
        ru: '<h1 class="___">Робо-футбол</h1>',
        en: '<h1 class="___">Robo-football</h1>',
      },
    },
    uz: {
      ctx: "Turnir sayti: sarlavha harflari binafsha bo'lsin.",
      q: "Bo'sh joyga bitta so'z yozing.",
      why: "Harflar rangi fg bilan boshlanadi, binafsha esa accent. Shuning uchun fg-accent. bg-accent fonni bo'yagan bo'lardi.",
    },
    ru: {
      ctx: 'Сайт турнира: буквы заголовка должны быть фиолетовыми.',
      q: 'Впиши на пустое место одно слово.',
      why: 'Цвет букв начинается с fg, а фиолетовый — это accent. Поэтому fg-accent. bg-accent покрасил бы фон.',
    },
    en: {
      ctx: 'A tournament site: the heading letters should be purple.',
      q: 'Type one word in the empty spot.',
      why: 'A letter color starts with fg, and purple is accent. So it is fg-accent. bg-accent would color the background.',
    },
  },
  {
    id: 'bootstrap_l02_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['bg'],
    mono: true,
    answer: ['bg-success'],
    vis: {
      code: {
        uz: `<p class="___">G'olib: Lochin jamoasi</p>`,
        ru: '<p class="___">Победитель: команда «Лочин»</p>',
        en: '<p class="___">Winner: team Lochin</p>',
      },
    },
    uz: {
      ctx: "G'olib yozilgan qatorning foni yashil bo'lsin.",
      q: "Bo'sh joyga bitta so'z yozing.",
      why: "Fon so'zi bg bilan boshlanadi, yashil esa success: bg-success. fg-success faqat harflarni bo'yagan bo'lardi.",
    },
    ru: {
      ctx: 'У строки с победителем фон должен быть зелёным.',
      q: 'Впиши на пустое место одно слово.',
      why: 'Слово фона начинается с bg, а зелёный — это success: bg-success. fg-success покрасил бы только буквы.',
    },
    en: {
      ctx: 'The line with the winner should have a green background.',
      q: 'Type one word in the empty spot.',
      why: 'A background word starts with bg, and green is success: bg-success. fg-success would color only the letters.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l02_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['btn-solid', 'theme'],
    pieces: ['<button', ' class="', 'btn-solid theme-info', '">', { uz: 'Batafsil', ru: 'Подробнее', en: 'More' }, '</button>'],
    extra: ['btn-info', '</btn>'],
    vis: { code: '<body>\n  ___\n</body>' },
    uz: {
      ctx: "Havorang, ichi to'la «Batafsil» tugmasi kerak.",
      q: "Bo'laklarni tartib bilan bosib, tugmani yig'ing",
      why: "Tugma — button tegi, class ichida ikki so'z: btn-solid ichini to'ldiradi, theme-info havorang qiladi. btn-info — 5-versiyaning eski nomi, yopuvchi teg esa </button>.",
    },
    ru: {
      ctx: 'Нужна голубая залитая кнопка «Подробнее».',
      q: 'Нажимай кусочки по порядку и собери кнопку',
      why: 'Кнопка — тег button, в class два слова: btn-solid даёт заливку, theme-info — голубой цвет. btn-info — старое имя из 5-й версии, а закрывающий тег — </button>.',
    },
    en: {
      ctx: 'We need a light blue filled “More” button.',
      q: 'Tap the pieces in order to build the button',
      why: 'A button is a button tag with two words in class: btn-solid fills it, theme-info makes it light blue. btn-info is an old version 5 name, and the closing tag is </button>.',
    },
  },
  {
    id: 'bootstrap_l02_q16',
    type: 'build',
    difficulty: 'easy',
    tags: ['fg'],
    pieces: ['<h1', ' class="', 'fg-success', '">', { uz: "Bog' klubi", ru: 'Садовый клуб', en: 'Garden club' }, '</h1>'],
    extra: ['text-success', 'bg-success'],
    vis: { code: '<body>\n  ___\n</body>' },
    uz: {
      ctx: "Bog' klubi sayti: sarlavha harflari yashil bo'lsin.",
      q: "Bo'laklarni tartib bilan bosib, sarlavhani yig'ing",
      why: "Harflar rangi — fg, yashil — success: fg-success. bg-success fonni bo'yardi, text-success esa 5-versiyaning eski nomi.",
    },
    ru: {
      ctx: 'Сайт садового клуба: буквы заголовка должны быть зелёными.',
      q: 'Нажимай кусочки по порядку и собери заголовок',
      why: 'Цвет букв — fg, зелёный — success: fg-success. bg-success покрасил бы фон, а text-success — старое имя из 5-й версии.',
    },
    en: {
      ctx: 'A garden club site: the heading letters should be green.',
      q: 'Tap the pieces in order to build the heading',
      why: 'Letter color is fg, and green is success: fg-success. bg-success would color the background, and text-success is an old version 5 name.',
    },
  },
  {
    id: 'bootstrap_l02_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['btn-solid', 'versiya5'],
    line: 5,
    vis: {
      code: {
        uz: '<h2 class="fg-primary">Robo-futbol</h2>\n<button class="btn-solid theme-success">\n  Yozilish\n</button>\n<button class="btn-danger">Bekor qilish</button>',
        ru: '<h2 class="fg-primary">Робо-футбол</h2>\n<button class="btn-solid theme-success">\n  Записаться\n</button>\n<button class="btn-danger">Отмена</button>',
        en: '<h2 class="fg-primary">Robo-football</h2>\n<button class="btn-solid theme-success">\n  Sign up\n</button>\n<button class="btn-danger">Cancel</button>',
      },
      page: true,
    },
    uz: {
      ctx: "Turnir sahifasida bitta tugma qizil emas, oddiy bo'lib qolib ketdi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "5-qatorda btn-danger yozilgan — bu 5-versiyaning eski nomi, 6-versiyada ishlamaydi. Qizil tugmaga ikki so'z kerak: btn-solid theme-danger.",
    },
    ru: {
      ctx: 'На странице турнира одна кнопка не стала красной и осталась обычной.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 5 написано btn-danger — старое имя из 5-й версии, в 6-й не работает. Красной кнопке нужны два слова: btn-solid theme-danger.',
    },
    en: {
      ctx: 'On the tournament page one button didn’t turn red and stayed plain.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 5 has btn-danger, an old version 5 name that doesn’t work in 6. A red button needs two words: btn-solid theme-danger.',
    },
  },
  {
    id: 'bootstrap_l02_q18',
    type: 'tap',
    difficulty: 'medium',
    tags: ['btn-outline', 'theme'],
    answer: 'outline-primary',
    vis: {
      page: {
        uz: `<div style="display:flex;flex-wrap:wrap;gap:12px">\n<button class="btn-solid theme-primary" data-t="solid-primary">Yozilish</button>\n<button class="btn-outline theme-primary" data-t="outline-primary">Batafsil</button>\n<button class="btn-solid theme-danger" data-t="solid-danger">O'chirish</button>\n<button class="btn-outline theme-success" data-t="outline-success">Jadval</button>\n</div>`,
        ru: '<div style="display:flex;flex-wrap:wrap;gap:12px">\n<button class="btn-solid theme-primary" data-t="solid-primary">Записаться</button>\n<button class="btn-outline theme-primary" data-t="outline-primary">Подробнее</button>\n<button class="btn-solid theme-danger" data-t="solid-danger">Удалить</button>\n<button class="btn-outline theme-success" data-t="outline-success">Расписание</button>\n</div>',
        en: '<div style="display:flex;flex-wrap:wrap;gap:12px">\n<button class="btn-solid theme-primary" data-t="solid-primary">Sign up</button>\n<button class="btn-outline theme-primary" data-t="outline-primary">More</button>\n<button class="btn-solid theme-danger" data-t="solid-danger">Delete</button>\n<button class="btn-outline theme-success" data-t="outline-success">Schedule</button>\n</div>',
      },
    },
    uz: {
      ctx: "Saytda to'rtta tugma, har birining o'z uslubi va rangi bor.",
      q: 'btn-outline theme-primary qaysi tugma? Ustiga bosing',
      why: "btn-outline tugmaning faqat chegarasi va yozuvini bo'yaydi, ichi oq qoladi. primary — ko'k. Demak, bu ko'k chegarali tugma.",
    },
    ru: {
      ctx: 'На сайте четыре кнопки, у каждой свой стиль и цвет.',
      q: 'Какая кнопка — btn-outline theme-primary? Нажми на неё',
      why: 'btn-outline красит у кнопки только рамку и надпись, внутри она белая. primary — синий. Значит, это кнопка с синей рамкой.',
    },
    en: {
      ctx: 'The site has four buttons, each with its own style and color.',
      q: 'Which button is btn-outline theme-primary? Tap it',
      why: 'btn-outline colors only the border and label, and the inside stays white. primary is blue. So it is the button with a blue border.',
    },
  },
];
