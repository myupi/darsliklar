// =============================================================================
// БАНК ТРЕНАЖЁРА HTML · урок 9 «Финальный HTML-проект» (повторение курса) — 12 вопросов с выбором + 4 «впиши ответ» (q13–q16). Игровые: q17–q18 «собери», q19–q20 «найди ошибку», q21 «нажми на странице».
// Части сайта (main), заголовки (h3 → h1), поле для чисел (type number), лишний </img>,
// ol → ul, href в теге p, label против placeholder, нет title, что покажет браузер (h1 + ol + a),
// опечатка opton в select, картинка-ссылка, две ошибки на одной странице (scr и a без href).
// Ситуации тестов курса (tools/webtest/html/l01…l08.jsx) не повторяются. Формат — FORMAT.md.
// Сайт вопросов — летний лагерь Коди.
// =============================================================================
export default [
  {
    id: 'html_l09_q01',
    difficulty: 'easy',
    tags: ['main'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Lager saytidagi smenalar, narxlar va rasmlar — sahifaning eng muhim qismi.",
      q: "Bularni qaysi teg o'rab turadi?",
      opts: ['main', 'header', 'footer', 'head'],
      why: "main ya'ni asosiy qism degani: sahifaning eng muhim mazmuni shu yerda turadi. header — sayt boshi, footer — sayt oxiri.",
    },
    ru: {
      ctx: 'Смены, цены и фото на сайте лагеря — самое важное на странице.',
      q: 'Какой тег их обнимает?',
      opts: ['main', 'header', 'footer', 'head'],
      why: 'main — главная часть: здесь стоит самое важное содержание страницы. header — верх сайта, footer — его низ.',
    },
    en: {
      ctx: 'Sessions, prices and photos on the camp site are the most important part of the page.',
      q: 'Which tag wraps them?',
      opts: ['main', 'header', 'footer', 'head'],
      why: 'main means the main part: the most important content of the page goes here. header is the site top, footer is the bottom.',
    },
  },
  {
    id: 'html_l09_q02',
    difficulty: 'easy',
    tags: ['h1'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<h3>Kodi lageri</h3>\n<p>Yozgi lagerga xush kelibsiz!</p>`,
        ru: `<h3>Лагерь Коди</h3>\n<p>Добро пожаловать в летний лагерь!</p>`,
        en: `<h3>Kodi Camp</h3>\n<p>Welcome to summer camp!</p>`,
      },
      page: true,
    },
    uz: {
      ctx: "Sayt nomi kichkina chiqdi: abzasdan sal kattaroq, xolos.",
      q: "Uni eng katta sarlavha qilish uchun nima kerak?",
      opts: [
        "Ikkala joyda h3 o'rniga h1 yozish",
        "Ikkala joyda h3 o'rniga h6 yozish",
        "Ikkala joyda h3 o'rniga title yozish",
        "Sayt nomini b tegiga o'rab qo'yish",
      ],
      why: "h1 — eng katta, asosiy sarlavha, h6 esa eng kichigi. Teg nomi ochuvchi va yopuvchi tegda bir xil yoziladi.",
    },
    ru: {
      ctx: 'Название сайта вышло маленьким: чуть крупнее абзаца.',
      q: 'Что нужно, чтобы оно стало самым крупным заголовком?',
      opts: [
        'В обоих местах написать h1 вместо h3',
        'В обоих местах написать h6 вместо h3',
        'В обоих местах написать title вместо h3',
        'Обернуть название сайта в тег b',
      ],
      why: 'h1 — самый крупный, главный заголовок, а h6 — самый мелкий. Имя тега в открывающем и закрывающем тегах одинаковое.',
    },
    en: {
      ctx: 'The site name came out small: just a bit bigger than a paragraph.',
      q: 'What makes it the biggest heading?',
      opts: [
        'Write h1 instead of h3 in both places',
        'Write h6 instead of h3 in both places',
        'Write title instead of h3 in both places',
        'Wrap the site name in a b tag',
      ],
      why: 'h1 is the biggest, main heading, and h6 is the smallest. The tag name is the same in the opening and closing tags.',
    },
  },
  {
    id: 'html_l09_q03',
    difficulty: 'easy',
    tags: ['input', 'type'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Anketadagi «Yoshingiz» maydoniga faqat raqam yozilsin.",
      q: "type atributiga qaysi qiymat yoziladi?",
      opts: ['number', 'password', 'text', 'placeholder'],
      why: "number maydonni raqam uchun qiladi, yonida strelkalar chiqadi. text — oddiy matn, password esa harflarni nuqtalar bilan yashiradi.",
    },
    ru: {
      ctx: 'В поле анкеты «Твой возраст» должны писать только число.',
      q: 'Какое значение пишется в атрибут type?',
      opts: ['number', 'password', 'text', 'placeholder'],
      why: 'number делает поле для чисел, рядом появляются стрелки. text — обычный текст, а password прячет буквы за точками.',
    },
    en: {
      ctx: 'Only a number should go into the “Your age” field of the form.',
      q: 'Which value goes into the type attribute?',
      opts: ['number', 'password', 'text', 'placeholder'],
      why: 'number makes a field for numbers with little arrows next to it. text is plain text, and password hides letters behind dots.',
    },
  },
  {
    id: 'html_l09_q04',
    difficulty: 'easy',
    tags: ['img'],
    mono: false,
    sort: true,
    vis: {
      code: {
        uz: `<h2>Bizning lager</h2>\n<img src="tog.png" alt="Tog'">\n</img>\n<p>Lager tog' etagida turadi.</p>`,
        ru: `<h2>Наш лагерь</h2>\n<img src="tog.png" alt="Горы">\n</img>\n<p>Лагерь стоит у подножия гор.</p>`,
        en: `<h2>Our camp</h2>\n<img src="tog.png" alt="Mountains">\n</img>\n<p>The camp is near the mountains.</p>`,
      },
    },
    uz: {
      ctx: "Kodda bitta qator ortiqcha.",
      q: "Qaysi qatorni o'chirish kerak?",
      opts: ['3-qator', '1-qator', '2-qator', '4-qator'],
      why: "img yolg'iz teg: uning yopuvchi tegi bo'lmaydi. Shuning uchun </img> qatori ortiqcha.",
    },
    ru: {
      ctx: 'В коде одна строка лишняя.',
      q: 'Какую строку нужно удалить?',
      opts: ['Строка 3', 'Строка 1', 'Строка 2', 'Строка 4'],
      why: 'img — одиночный тег: закрывающего тега у него нет. Поэтому строка </img> лишняя.',
    },
    en: {
      ctx: 'One line in the code is extra.',
      q: 'Which line should be deleted?',
      opts: ['Line 3', 'Line 1', 'Line 2', 'Line 4'],
      why: 'img is a single tag: it has no closing tag. That is why the </img> line is extra.',
    },
  },
  {
    id: 'html_l09_q05',
    difficulty: 'medium',
    tags: ['ul', 'ol'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<p>Lagerga olib boring:</p>\n<ol>\n  <li>Kepka</li>\n  <li>Suv idishi</li>\n  <li>Krossovka</li>\n</ol>`,
        ru: `<p>Возьми в лагерь:</p>\n<ol>\n  <li>Кепка</li>\n  <li>Бутылка воды</li>\n  <li>Кроссовки</li>\n</ol>`,
        en: `<p>Take to camp:</p>\n<ol>\n  <li>Cap</li>\n  <li>Water bottle</li>\n  <li>Sneakers</li>\n</ol>`,
      },
      page: true,
    },
    uz: {
      ctx: "Bu narsalarning tartibi muhim emas: raqamlar o'rnida nuqtalar tursin.",
      q: "Kodda nimani o'zgartirish kerak?",
      opts: [
        "Ikkala joyda ol o'rniga ul yozish",
        "Hamma li teglarini ul tegiga almashtirish",
        "Har bir band oldiga nuqta belgisini yozish",
        "ol tegiga type=\"ul\" atributini yozish",
      ],
      why: "Raqamli ro'yxatni ol, nuqtali ro'yxatni ul yasaydi. Ochuvchi va yopuvchi tegda nom bir xil bo'ladi, li teglari esa o'zgarmaydi.",
    },
    ru: {
      ctx: 'Порядок этих вещей не важен: вместо номеров пусть будут точки.',
      q: 'Что нужно изменить в коде?',
      opts: [
        'В обоих местах написать ul вместо ol',
        'Заменить все теги li на тег ul',
        'Поставить точку перед каждым пунктом',
        'Добавить тегу ol атрибут type="ul"',
      ],
      why: 'Нумерованный список делает ol, список с точками — ul. Имя в открывающем и закрывающем тегах одно, а li остаются как были.',
    },
    en: {
      ctx: "The order of these things doesn't matter: let dots replace the numbers.",
      q: 'What needs to change in the code?',
      opts: [
        'Write ul instead of ol in both places',
        'Replace all the li tags with ul tags',
        'Put a dot in front of every item',
        'Add the attribute type="ul" to ol',
      ],
      why: 'ol makes a numbered list, ul makes a list with dots. The name is the same in the opening and closing tags, and the li tags stay as they are.',
    },
  },
  {
    id: 'html_l09_q06',
    difficulty: 'medium',
    tags: ['a', 'href'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<h2>Lager hayoti</h2>\n<p href="rasmlar.html">Rasmlar</p>`,
        ru: `<h2>Жизнь лагеря</h2>\n<p href="foto.html">Фото</p>`,
        en: `<h2>Camp life</h2>\n<p href="photos.html">Photos</p>`,
      },
      page: true,
    },
    uz: {
      ctx: "«Rasmlar» havola bo'lishi kerak edi, lekin oddiy matn bo'lib chiqdi.",
      q: "Nimani o'zgartirish kerak?",
      opts: [
        "Ikkala joyda p tegini a tegiga almashtirish",
        "href o'rniga src atributini yozish",
        "«Rasmlar» so'zini b tegiga o'rash",
        "href qiymatidan qo'shtirnoqni olish",
      ],
      why: "href faqat a tegida ishlaydi: a havola yasaydi, href esa qayerga olib borishini aytadi. p tegida href hech narsa qilmaydi.",
    },
    ru: {
      ctx: '«Фото» должно было стать ссылкой, а получилось простым текстом.',
      q: 'Что нужно изменить?',
      opts: [
        'В обоих местах заменить тег p на a',
        'Заменить атрибут href на src',
        'Обернуть слово «Фото» в тег b',
        'Убрать кавычки у значения href',
      ],
      why: 'href работает только в теге a: a делает ссылку, а href говорит, куда она ведёт. В теге p атрибут href ничего не делает.',
    },
    en: {
      ctx: '“Photos” was supposed to be a link, but it came out as plain text.',
      q: 'What needs to change?',
      opts: [
        'Replace p with a in both places',
        'Replace the href attribute with src',
        'Wrap the word “Photos” in a b tag',
        'Remove the quotes from the href value',
      ],
      why: 'href works only in the a tag: a makes a link, and href says where it leads. In a p tag, href does nothing.',
    },
  },
  {
    id: 'html_l09_q07',
    difficulty: 'medium',
    tags: ['label', 'placeholder'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Maydon oldida «Ismingiz» yozuvi doim tursin, mehmon yoza boshlaganda yo'qolmasin.",
      q: "Bu yozuv uchun nima kerak?",
      opts: ['label', 'placeholder', 'option', 'title'],
      why: "label — maydon yozuvi: u doim ko'rinib turadi. placeholder esa maydon ichidagi kulrang ishora, mehmon yoza boshlaganda yo'qoladi.",
    },
    ru: {
      ctx: 'Пусть перед полем всегда стоит надпись «Твоё имя» и не исчезает, когда гость пишет.',
      q: 'Что нужно для этой надписи?',
      opts: ['label', 'placeholder', 'option', 'title'],
      why: 'label — подпись поля: её видно всегда. А placeholder — серая подсказка внутри поля, она исчезает, когда гость начинает писать.',
    },
    en: {
      ctx: 'The text “Your name” should always stay in front of the field, even while the guest types.',
      q: 'What is needed for this text?',
      opts: ['label', 'placeholder', 'option', 'title'],
      why: 'label is the caption of the field: it is always visible. placeholder is a gray hint inside the field that disappears when the guest starts typing.',
    },
  },
  {
    id: 'html_l09_q08',
    difficulty: 'medium',
    tags: ['title', 'head'],
    mono: true,
    sort: false,
    vis: {
      code: {
        uz: `<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Kodi lageri</h1>\n  </body>\n</html>`,
        ru: `<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Лагерь Коди</h1>\n  </body>\n</html>`,
        en: `<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Kodi Camp</h1>\n  </body>\n</html>`,
      },
    },
    uz: {
      ctx: "Brauzer yorlig'ida sahifa nomi yo'q, uning o'rnida fayl nomi chiqib turibdi.",
      q: "head ichiga nima qo'shish kerak?",
      opts: [
        '<title>Kodi lageri</title>',
        '<h1>Kodi lageri</h1>',
        '<header>Kodi lageri</header>',
        '<p>Kodi lageri</p>',
      ],
      why: "Yorliqdagi sahifa nomini head ichidagi title tegi beradi. h1, header va p esa sahifaning o'zida ko'rinadi.",
    },
    ru: {
      ctx: 'На вкладке браузера нет названия страницы, вместо него — имя файла.',
      q: 'Что нужно добавить внутрь head?',
      opts: [
        '<title>Лагерь Коди</title>',
        '<h1>Лагерь Коди</h1>',
        '<header>Лагерь Коди</header>',
        '<p>Лагерь Коди</p>',
      ],
      why: 'Название страницы на вкладке даёт тег title внутри head. А h1, header и p видны на самой странице.',
    },
    en: {
      ctx: 'The browser tab shows no page name, only the file name.',
      q: 'What should be added inside head?',
      opts: [
        '<title>Kodi Camp</title>',
        '<h1>Kodi Camp</h1>',
        '<header>Kodi Camp</header>',
        '<p>Kodi Camp</p>',
      ],
      why: 'The page name on the tab comes from the title tag inside head. h1, header and p show up on the page itself.',
    },
  },
  {
    id: 'html_l09_q09',
    difficulty: 'medium',
    tags: ['ol', 'a'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<h1>Kodi lageri</h1>\n<ol>\n  <li>Nonushta</li>\n  <li>Futbol</li>\n</ol>\n<a href="rasmlar.html">Rasmlar</a>`,
        ru: `<h1>Лагерь Коди</h1>\n<ol>\n  <li>Завтрак</li>\n  <li>Футбол</li>\n</ol>\n<a href="foto.html">Фото</a>`,
        en: `<h1>Kodi Camp</h1>\n<ol>\n  <li>Breakfast</li>\n  <li>Football</li>\n</ol>\n<a href="photos.html">Photos</a>`,
      },
    },
    uz: {
      ctx: "Brauzer bu kodni tepadan pastga o'qiydi.",
      q: "Sahifada nima chiqadi?",
      opts: [
        "Sarlavha, raqamli ro'yxat va havola",
        "Sarlavha, nuqtali ro'yxat va havola",
        "Sarlavha, raqamli ro'yxat va rasm",
        "Sarlavha, raqamli ro'yxat va oddiy matn",
      ],
      why: "h1 — asosiy sarlavha, ol — raqamli ro'yxat. a tegida href bor, shuning uchun «Rasmlar» rasm emas, havola bo'ladi.",
    },
    ru: {
      ctx: 'Браузер читает этот код сверху вниз.',
      q: 'Что появится на странице?',
      opts: [
        'Заголовок, нумерованный список и ссылка',
        'Заголовок, список с точками и ссылка',
        'Заголовок, нумерованный список и картинка',
        'Заголовок, нумерованный список и простой текст',
      ],
      why: 'h1 — главный заголовок, ol — нумерованный список. У тега a есть href, поэтому «Фото» будет ссылкой, а не картинкой.',
    },
    en: {
      ctx: 'The browser reads this code from top to bottom.',
      q: 'What appears on the page?',
      opts: [
        'A heading, a numbered list and a link',
        'A heading, a list with dots and a link',
        'A heading, a numbered list and a picture',
        'A heading, a numbered list and plain text',
      ],
      why: 'h1 is the main heading, and ol is a numbered list. The a tag has href, so “Photos” is a link, not a picture.',
    },
  },
  {
    id: 'html_l09_q10',
    difficulty: 'medium',
    tags: ['option'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<label>\n  Smena:\n  <select>\n    <opton>Iyun</opton>\n    <option>Iyul</option>\n  </select>\n</label>`,
        ru: `<label>\n  Смена:\n  <select>\n    <opton>Июнь</opton>\n    <option>Июль</option>\n  </select>\n</label>`,
        en: `<label>\n  Session:\n  <select>\n    <opton>June</opton>\n    <option>July</option>\n  </select>\n</label>`,
      },
    },
    uz: {
      ctx: "Smenalar ro'yxatida faqat Iyul bor, Iyun esa yo'q.",
      q: "Nega Iyun ro'yxatga tushmadi?",
      opts: [
        "Teg nomida bitta harf tushib qolgan",
        "select tegi label ichida turibdi",
        "Iyun qatori Iyuldan oldin yozilgan",
        "label ichida faqat bitta variant bo'ladi",
      ],
      why: "opton degan teg yo'q, brauzer uni tanimaydi. Ro'yxatga faqat option tegidagi variant tushadi.",
    },
    ru: {
      ctx: 'В списке смен есть только Июль, а Июня нет.',
      q: 'Почему Июнь не попал в список?',
      opts: [
        'В имени тега пропущена одна буква',
        'Тег select стоит внутри label',
        'Строка Июня написана раньше Июля',
        'Внутри label бывает только один пункт',
      ],
      why: 'Тега opton не существует, браузер его не знает. В список попадает только пункт в теге option.',
    },
    en: {
      ctx: 'The session list has only July, and June is missing.',
      q: "Why didn't June get into the list?",
      opts: [
        'One letter is missing in the tag name',
        'The select tag is inside label',
        'The June line comes before July',
        'label can hold only one choice',
      ],
      why: "There is no opton tag, and the browser doesn't know it. Only a choice in an option tag gets into the list.",
    },
  },
  {
    id: 'html_l09_q11',
    difficulty: 'hard',
    tags: ['a', 'img'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Tog' rasmini bosganda rasmlar sahifasi ochilsin.",
      q: "Qaysi kod to'g'ri?",
      opts: [
        '<a href="rasmlar.html"><img src="tog.png"></a>',
        '<img src="tog.png" href="rasmlar.html">',
        '<a src="tog.png" href="rasmlar.html"></a>',
        '<a href="rasmlar.html"></a><img src="tog.png">',
      ],
      why: "Rasm a tegining ichida turadi: a havola yasaydi, href qayerga olib borishini aytadi, img esa src orqali rasmni ko'rsatadi.",
    },
    ru: {
      ctx: 'Пусть по нажатию на картинку с горами открывается страница с фото.',
      q: 'Какой код правильный?',
      opts: [
        '<a href="foto.html"><img src="tog.png"></a>',
        '<img src="tog.png" href="foto.html">',
        '<a src="tog.png" href="foto.html"></a>',
        '<a href="foto.html"></a><img src="tog.png">',
      ],
      why: 'Картинка стоит внутри тега a: a делает ссылку, href говорит, куда она ведёт, а img показывает картинку по src.',
    },
    en: {
      ctx: 'Clicking the mountain picture should open the photos page.',
      q: 'Which code is correct?',
      opts: [
        '<a href="photos.html"><img src="tog.png"></a>',
        '<img src="tog.png" href="photos.html">',
        '<a src="tog.png" href="photos.html"></a>',
        '<a href="photos.html"></a><img src="tog.png">',
      ],
      why: 'The picture sits inside the a tag: a makes the link, href says where it leads, and img shows the picture from src.',
    },
  },
  {
    id: 'html_l09_q12',
    difficulty: 'hard',
    tags: ['src', 'href'],
    mono: false,
    sort: true,
    vis: {
      code: {
        uz: `<header>\n  <h1>Kodi lageri</h1>\n</header>\n<main>\n  <img scr="tog.png" alt="Tog'">\n  <p>Yozgi lager <b>iyulda</b>.</p>\n  <a>Yozilish</a>\n</main>`,
        ru: `<header>\n  <h1>Лагерь Коди</h1>\n</header>\n<main>\n  <img scr="tog.png" alt="Горы">\n  <p>Летний лагерь <b>в июле</b>.</p>\n  <a>Записаться</a>\n</main>`,
        en: `<header>\n  <h1>Kodi Camp</h1>\n</header>\n<main>\n  <img scr="tog.png" alt="Mountains">\n  <p>Summer camp is <b>in July</b>.</p>\n  <a>Sign up</a>\n</main>`,
      },
    },
    uz: {
      ctx: "Bu sahifada ikkita narsa ishlamayapti.",
      q: "Xatolar qaysi qatorlarda?",
      opts: ['5 va 7', '1 va 5', '6 va 7', '2 va 8'],
      why: "5-qatorda atribut nomi scr deb yozilgan, src bo'lishi kerak. 7-qatordagi a tegida href yo'q, shuning uchun u havola emas.",
    },
    ru: {
      ctx: 'На этой странице не работают две вещи.',
      q: 'В каких строках ошибки?',
      opts: ['5 и 7', '1 и 5', '6 и 7', '2 и 8'],
      why: 'В строке 5 атрибут написан как scr, а нужен src. У тега a в строке 7 нет href, поэтому это не ссылка.',
    },
    en: {
      ctx: "Two things on this page don't work.",
      q: 'Which lines have the mistakes?',
      opts: ['5 and 7', '1 and 5', '6 and 7', '2 and 8'],
      why: "Line 5 has the attribute written as scr, but it must be src. The a tag on line 7 has no href, so it isn't a link.",
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'html_l09_q13',
    type: 'input',
    difficulty: 'easy',
    tags: ['alt'],
    mono: true,
    answer: ['alt'],
    vis: {
      code: {
        uz: `<h2>Lager atrofi</h2>\n<img src="tog.png" ___="Tog'lar">`,
        ru: `<h2>Вокруг лагеря</h2>\n<img src="tog.png" ___="Горы">`,
        en: `<h2>Around the camp</h2>\n<img src="tog.png" ___="Mountains">`,
      },
    },
    uz: {
      ctx: "Rasm ochilmasa, uning o'rnida «Tog'lar» yozuvi chiqsin.",
      q: "Bo'sh joyga qaysi atribut nomi yoziladi? Faqat nomini yozing.",
      why: "alt atributi — rasmning matnli tavsifi: rasm ochilmasa, brauzer uning o'rnida shu yozuvni ko'rsatadi. src esa rasm faylining nomi.",
    },
    ru: {
      ctx: 'Если картинка не откроется, пусть вместо неё будет надпись «Горы».',
      q: 'Какое имя атрибута вписать на пустое место? Только имя.',
      why: 'Атрибут alt — описание картинки словами: если она не откроется, браузер покажет эту надпись. А src — имя файла картинки.',
    },
    en: {
      ctx: 'If the picture does not open, the text “Mountains” should show instead.',
      q: 'Which attribute name goes in the empty spot? Just the name.',
      why: 'The alt attribute describes the picture in words: if it does not open, the browser shows this text. src is the picture file name.',
    },
  },
  {
    id: 'html_l09_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['href'],
    mono: true,
    answer: ['aloqa.html', '"aloqa.html"'],
    vis: {
      code: {
        uz: `<footer>\n  <p>Savollar bormi?</p>\n  <a href="___">Aloqa</a>\n</footer>`,
        ru: `<footer>\n  <p>Есть вопросы?</p>\n  <a href="___">Контакты</a>\n</footer>`,
        en: `<footer>\n  <p>Any questions?</p>\n  <a href="___">Contacts</a>\n</footer>`,
      },
    },
    uz: {
      ctx: "«Aloqa» havolasi aloqa.html sahifasini ochishi kerak.",
      q: "Bo'sh joyga qo'shtirnoqlar ichidagi qiymatni yozing.",
      why: "href qiymati — havola olib boradigan fayl nomi, harfma-harf: aloqa.html. Qo'shtirnoqlar kodda allaqachon bor.",
    },
    ru: {
      ctx: 'Ссылка «Контакты» должна открывать страницу aloqa.html.',
      q: 'Впиши на пустое место значение, которое стоит внутри кавычек.',
      why: 'Значение href — имя файла, куда ведёт ссылка, буква в букву: aloqa.html. Кавычки в коде уже есть.',
    },
    en: {
      ctx: 'The “Contacts” link should open the page aloqa.html.',
      q: 'Type the value that goes inside the quotes.',
      why: 'The href value is the name of the file the link leads to, letter for letter: aloqa.html. The quotes are already in the code.',
    },
  },
  {
    id: 'html_l09_q15',
    type: 'input',
    difficulty: 'medium',
    tags: ['img', 'src'],
    mono: true,
    answer: ['<img src="pingvin.png">', "<img src='pingvin.png'>", '<img src="pingvin.png"/>', "<img src='pingvin.png'/>"],
    vis: {
      code: {
        uz: `<h2>Lager do'stlari</h2>\n<p>Bizning pingvin:</p>\n___`,
        ru: `<h2>Друзья лагеря</h2>\n<p>Наш пингвин:</p>\n___`,
        en: `<h2>Camp friends</h2>\n<p>Our penguin:</p>\n___`,
      },
    },
    uz: {
      ctx: "Abzas ostida pingvin.png rasmi chiqishi kerak.",
      q: "Bo'sh joyga faqat src atributi bor img tegini to'liq yozing.",
      why: "Rasmni img tegi ko'rsatadi, fayl nomi src atributida qo'shtirnoq ichida yoziladi. img yolg'iz teg, uning yopuvchi tegi yo'q.",
    },
    ru: {
      ctx: 'Под абзацем должна появиться картинка pingvin.png.',
      q: 'Впиши на пустое место тег img целиком, только с атрибутом src.',
      why: 'Картинку показывает тег img, имя файла пишется в атрибуте src в кавычках. img — одиночный тег, закрывающего у него нет.',
    },
    en: {
      ctx: 'The picture pingvin.png should appear under the paragraph.',
      q: 'Type the whole img tag in the empty spot, with only the src attribute.',
      why: 'The img tag shows a picture, and the file name goes in the src attribute in quotes. img is a single tag with no closing tag.',
    },
  },
  {
    id: 'html_l09_q16',
    type: 'input',
    difficulty: 'hard',
    tags: ['a', 'href'],
    mono: false,
    answer: ['2'],
    vis: {
      code: {
        uz: `<nav>\n  <a href="index.html">Bosh sahifa</a>\n  <a>Smenalar</a>\n  <p href="narx.html">Narxlar</p>\n  <a href="rasm.html">Rasmlar</a>\n</nav>`,
        ru: `<nav>\n  <a href="index.html">Главная</a>\n  <a>Смены</a>\n  <p href="narx.html">Цены</p>\n  <a href="rasm.html">Фото</a>\n</nav>`,
        en: `<nav>\n  <a href="index.html">Home</a>\n  <a>Sessions</a>\n  <p href="narx.html">Prices</p>\n  <a href="rasm.html">Photos</a>\n</nav>`,
      },
    },
    uz: {
      ctx: "Lager menyusida to'rtta yozuv bor.",
      q: "Ulardan nechtasi bosiladigan havola bo'ladi? Son bilan yozing.",
      why: "Havolaga a tegi ham, href atributi ham kerak. Smenalarda href yo'q, Narxlar esa p tegida, shuning uchun havola ikkita.",
    },
    ru: {
      ctx: 'В меню лагеря четыре надписи.',
      q: 'Сколько из них будут ссылками? Напиши числом.',
      why: 'Для ссылки нужны и тег a, и атрибут href. У «Смен» нет href, а «Цены» стоят в теге p, поэтому ссылок две.',
    },
    en: {
      ctx: 'The camp menu has four items.',
      q: 'How many of them will be links? Write a number.',
      why: 'A link needs both the a tag and the href attribute. “Sessions” has no href, and “Prices” is in a p tag, so there are two links.',
    },
  },
  // ---- Игровые: «собери» (q17, q18), «найди ошибку» (q19, q20), «нажми на странице» (q21) ----
  {
    id: 'html_l09_q17',
    type: 'build',
    difficulty: 'medium',
    tags: ['a', 'href'],
    pieces: ['<a', ' href="oyin.html"', '>', { uz: "O'yinlar", ru: 'Матчи', en: 'Matches' }, '</a>'],
    extra: [' src="oyin.html"', '<p'],
    vis: {
      code: {
        uz: `<nav>\n  <a href="jamoa.html">Jamoa</a>\n  ___\n</nav>`,
        ru: `<nav>\n  <a href="jamoa.html">Команда</a>\n  ___\n</nav>`,
        en: `<nav>\n  <a href="jamoa.html">Team</a>\n  ___\n</nav>`,
      },
    },
    uz: {
      ctx: "Futbol jamoasi saytining menyusida oyin.html sahifasiga havola yo'q.",
      q: "Bo'laklarni tartib bilan bosib, «O'yinlar» havolasini yig'ing",
      why: "Havolani a tegi yasaydi, qayerga olib borishini href atributi aytadi. src atributi rasm uchun, p tegi esa havola bo'la olmaydi.",
    },
    ru: {
      ctx: 'В меню сайта футбольной команды нет ссылки на страницу oyin.html.',
      q: 'Нажимай кусочки по порядку и собери ссылку «Матчи»',
      why: 'Ссылку делает тег a, а куда она ведёт, говорит атрибут href. Атрибут src — для картинок, а тег p ссылкой не станет.',
    },
    en: {
      ctx: 'The football team site menu has no link to the page oyin.html.',
      q: 'Tap the pieces in order to build the “Matches” link',
      why: 'The a tag makes a link, and the href attribute says where it leads. The src attribute is for pictures, and a p tag cannot become a link.',
    },
  },
  {
    id: 'html_l09_q18',
    type: 'build',
    difficulty: 'hard',
    tags: ['p', 'b'],
    pieces: ['<p>', { uz: 'Bir smena: ', ru: 'Одна смена: ', en: 'One session: ' }, '<b>', { uz: "900 000 so'm", ru: '900 000 сумов', en: '900,000 sum' }, '</b>', '</p>'],
    extra: ['<i>', '<h1>'],
    vis: {
      code: {
        uz: `<section>\n  <h2>Narxlar</h2>\n  ___\n</section>`,
        ru: `<section>\n  <h2>Цены</h2>\n  ___\n</section>`,
        en: `<section>\n  <h2>Prices</h2>\n  ___\n</section>`,
      },
    },
    uz: {
      ctx: "Lager narxi abzasda tursin: oldin «Bir smena:», keyin narx — faqat narx qalin.",
      q: "Bo'laklarni tartib bilan bosib, narx abzasini yig'ing",
      why: "Butun qator p abzasida turadi, narx esa b tegi ichida, shuning uchun faqat u qalin chiqadi. i tegi matnni qiya qiladi, qalin emas.",
    },
    ru: {
      ctx: 'Пусть цена лагеря стоит в абзаце: сначала «Одна смена:», потом цена — жирная только она.',
      q: 'Нажимай кусочки по порядку и собери абзац с ценой',
      why: 'Вся строка стоит в абзаце p, а цена — внутри тега b, поэтому жирной выходит только она. Тег i делает текст курсивом, а не жирным.',
    },
    en: {
      ctx: 'The camp price should be in a paragraph: first “One session:”, then the price, and only the price is bold.',
      q: 'Tap the pieces in order to build the price paragraph',
      why: 'The whole line sits in a p paragraph, and the price is inside the b tag, so only the price comes out bold. The i tag makes text italic, not bold.',
    },
  },
  {
    id: 'html_l09_q19',
    type: 'bug',
    difficulty: 'medium',
    tags: ['img', 'src'],
    line: 3,
    vis: {
      code: {
        uz: `<section>\n  <h2>Hayvonot bog'iga sayohat</h2>\n  <img href="sher.png" alt="Sher">\n  <p>Shanba kuni sherni ko'ramiz.</p>\n</section>`,
        ru: `<section>\n  <h2>Поездка в зоопарк</h2>\n  <img href="sher.png" alt="Лев">\n  <p>В субботу увидим льва.</p>\n</section>`,
        en: `<section>\n  <h2>Trip to the zoo</h2>\n  <img href="sher.png" alt="Lion">\n  <p>On Saturday we will see a lion.</p>\n</section>`,
      },
      page: true,
    },
    uz: {
      ctx: "Lager sahifasida sher rasmi o'rnida faqat «Sher» yozuvi chiqyapti.",
      q: "Qaysi qatorda xato bor? Shu qatorni bosing",
      why: "3-qatorda rasm fayli href atributiga yozilgan. img tegiga rasmni src atributi ko'rsatadi, href esa havola uchun.",
    },
    ru: {
      ctx: 'На странице лагеря вместо картинки со львом видна только надпись «Лев».',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В 3-й строке файл картинки записан в атрибут href. Тегу img картинку показывает атрибут src, а href — для ссылок.',
    },
    en: {
      ctx: 'On the camp page there is only the text “Lion” instead of the lion picture.',
      q: 'Which line has the mistake? Tap that line',
      why: 'On line 3 the picture file is written in the href attribute. The src attribute tells the img tag which picture to show, and href is for links.',
    },
  },
  {
    id: 'html_l09_q20',
    type: 'bug',
    difficulty: 'hard',
    tags: ['a'],
    line: 4,
    vis: {
      code: {
        uz: `<nav>\n  <a href="menyu.html">Menyu</a>\n  <a href="narx.html">Narxlar</a>\n  <a href="aloqa.html"Aloqa</a>\n</nav>`,
        ru: `<nav>\n  <a href="menyu.html">Меню</a>\n  <a href="narx.html">Цены</a>\n  <a href="aloqa.html"Контакты</a>\n</nav>`,
        en: `<nav>\n  <a href="menyu.html">Menu</a>\n  <a href="narx.html">Prices</a>\n  <a href="aloqa.html"Contacts</a>\n</nav>`,
      },
      page: true,
    },
    uz: {
      ctx: "Kafe menyusida uchta havola bo'lishi kerak edi, lekin sahifada faqat ikkitasi bor.",
      q: "Qaysi qatorda xato bor? Shu qatorni bosing",
      why: "4-qatorda href qiymatidan keyin o'ng burchakli qavs > tushib qolgan. Brauzer «Aloqa» so'zini ham tegning bir qismi deb o'yladi va uni sahifada ko'rsatmadi.",
    },
    ru: {
      ctx: 'В меню кафе должно быть три ссылки, а на странице видно только две.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В 4-й строке после значения href пропала правая угловая скобка >. Браузер решил, что слово «Контакты» — тоже часть тега, и не показал его на странице.',
    },
    en: {
      ctx: 'The café menu should have three links, but the page shows only two.',
      q: 'Which line has the mistake? Tap that line',
      why: 'On line 4 the right angle bracket > is missing after the href value. The browser took the word “Contacts” as part of the tag and did not show it on the page.',
    },
  },
  {
    id: 'html_l09_q21',
    type: 'tap',
    difficulty: 'medium',
    tags: ['ol', 'ul'],
    answer: 'ol',
    vis: {
      page: {
        uz: `<h1 data-t="h1">Uyda pitsa</h1>\n<p data-t="p">Bugun pitsani o'zimiz pishiramiz!</p>\n<ul data-t="ul"><li>Un</li><li>Pishloq</li><li>Pomidor</li></ul>\n<ol data-t="ol"><li>Xamir qoramiz</li><li>Pishloq sepamiz</li><li>Pechga qo'yamiz</li></ol>`,
        ru: `<h1 data-t="h1">Пицца дома</h1>\n<p data-t="p">Сегодня печём пиццу сами!</p>\n<ul data-t="ul"><li>Мука</li><li>Сыр</li><li>Помидоры</li></ul>\n<ol data-t="ol"><li>Месим тесто</li><li>Посыпаем сыром</li><li>Ставим в печь</li></ol>`,
        en: `<h1 data-t="h1">Pizza at home</h1>\n<p data-t="p">Today we bake pizza ourselves!</p>\n<ul data-t="ul"><li>Flour</li><li>Cheese</li><li>Tomatoes</li></ul>\n<ol data-t="ol"><li>Knead the dough</li><li>Add the cheese</li><li>Put it in the oven</li></ol>`,
      },
    },
    uz: {
      ctx: "Retsept sahifasida ikkita ro'yxat bor: mahsulotlar va pishirish qadamlari.",
      q: "Sahifada ol tegi yasagan ro'yxatni bosing",
      why: "ol raqamli ro'yxat yasaydi: har bir band oldida 1, 2, 3 turadi, chunki qadamlar tartibi muhim. ul esa bandlar oldiga nuqta qo'yadi.",
    },
    ru: {
      ctx: 'На странице с рецептом два списка: продукты и шаги готовки.',
      q: 'Нажми на список, который сделал тег ol',
      why: 'ol делает нумерованный список: перед каждым пунктом стоит 1, 2, 3, потому что порядок шагов важен. А ul ставит перед пунктами точки.',
    },
    en: {
      ctx: 'The recipe page has two lists: the ingredients and the cooking steps.',
      q: 'Tap the list that the ol tag made',
      why: 'ol makes a numbered list: each item has 1, 2, 3 in front, because the order of the steps matters. ul puts dots in front of the items.',
    },
  },
];
