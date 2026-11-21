// =============================================================================
// БАНК ТРЕНАЖЁРА CSS · урок 2 «Как выбрать элемент для стилизации» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: селектор тега выбирает все такие элементы; class в HTML и .class в CSS — один класс на многих элементах
// и разных тегах; id в HTML и #id в CSS — id один на странице, в HTML знак не пишется; поломки выбора: нет точки
// (браузер ищет тег), точка в HTML, «.» для id; сила правил: id > class > тег, при равной силе — нижнее;
// правила с разными свойствами работают вместе.
// Словарь урока 2: selektor, class selektori, id selektori, teg selektori, nuqta, panjara belgisi («#»).
// Апостроф в узбекском — только ASCII «'». Ситуации тестов курса (tools/webtest/css/l02.jsx) не повторяются.
// Формат — tools/trenajor/css/FORMAT.md.
// =============================================================================
export default [
  {
    id: 'css_l02_q01',
    difficulty: 'easy',
    tags: ['class'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: 'Kosmos sayti uchun qoida: .yulduz { color: orange; }',
      q: 'Bu qoida qaysi elementlarni tanlaydi?',
      opts: ['class="yulduz" yozilgan hamma elementni', 'id="yulduz" yozilgan bitta elementni', 'Sahifadagi hamma yulduz teglarini', 'class="yulduz" yozilgan birinchi elementni'],
      why: "Nuqta bilan boshlangan selektor class bo'yicha tanlaydi. Bitta class ko'p elementda bo'lishi mumkin — qoida ularning hammasini bo'yaydi.",
    },
    ru: {
      ctx: 'Правило для сайта о космосе: .yulduz { color: orange; }',
      q: 'Какие элементы выберет это правило?',
      opts: ['Все элементы с class="yulduz"', 'Один элемент с id="yulduz"', 'Все теги yulduz на странице', 'Только первый элемент с class="yulduz"'],
      why: 'Селектор с точкой выбирает по class. Один class может стоять у многих элементов — правило покрасит их все.',
    },
    en: {
      ctx: 'A rule for the space site: .yulduz { color: orange; }',
      q: 'Which elements does this rule pick?',
      opts: ['Every element with class="yulduz"', 'The one element with id="yulduz"', 'Every yulduz tag on the page', 'Only the first element with class="yulduz"'],
      why: 'A selector that starts with a dot picks by class. One class can be on many elements, and the rule styles all of them.',
    },
  },
  {
    id: 'css_l02_q02',
    difficulty: 'easy',
    tags: ['id'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: 'class ham, id ham elementga nom beradi. Lekin ular har xil.',
      q: "id haqida qaysi gap to'g'ri?",
      opts: ['Bir xil id faqat bitta elementga beriladi', 'Bir xil id hamma abzaslarga beriladi', 'CSS kodida id nuqta bilan yoziladi', 'id faqat h1 tegiga beriladi'],
      why: "id — elementning yagona nomi, pasport raqamiga o'xshaydi: sahifada bitta. CSS kodida u panjara belgisi bilan yoziladi: #logo.",
    },
    ru: {
      ctx: 'И class, и id дают элементу имя. Но они разные.',
      q: 'Что верно про id?',
      opts: ['Одинаковый id дают только одному элементу', 'Одинаковый id дают всем абзацам', 'В CSS id пишут через точку', 'id дают только тегу h1'],
      why: 'id — единственное имя элемента, как номер паспорта: на странице он один. В CSS его пишут через решётку: #logo.',
    },
    en: {
      ctx: "Both class and id give an element a name. But they're different.",
      q: 'What is true about id?',
      opts: ['The same id goes on only one element', 'The same id goes on all paragraphs', 'In CSS an id is written with a dot', 'An id goes only on the h1 tag'],
      why: "An id is an element's one-of-a-kind name, like a passport number: one per page. In CSS it's written with a hash: #logo.",
    },
  },
  {
    id: 'css_l02_q03',
    difficulty: 'easy',
    tags: ['id'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "CSS kodida #bayroq selektori bor. Saytdagi bayroq shu qoida bilan bo'yalishi kerak.",
      q: 'HTML kodida bayroqqa nima yoziladi?',
      opts: ['id="bayroq"', 'class="bayroq"', 'id="#bayroq"', 'bayroq="id"'],
      why: "Panjara belgisi id atributini bildiradi, shuning uchun HTML kodida id=\"bayroq\" yoziladi. Belgining o'zi faqat CSS kodida turadi.",
    },
    ru: {
      ctx: 'В CSS есть селектор #bayroq. Флаг на сайте должен покраситься этим правилом.',
      q: 'Что пишется у флага в HTML?',
      opts: ['id="bayroq"', 'class="bayroq"', 'id="#bayroq"', 'bayroq="id"'],
      why: 'Решётка означает атрибут id, поэтому в HTML пишут id="bayroq". Сам знак ставят только в CSS.',
    },
    en: {
      ctx: 'The CSS has a #bayroq selector. The flag on the site must be styled by this rule.',
      q: 'What goes on the flag in the HTML?',
      opts: ['id="bayroq"', 'class="bayroq"', 'id="#bayroq"', 'bayroq="id"'],
      why: 'The hash means the id attribute, so the HTML gets id="bayroq". The sign itself goes only in CSS.',
    },
  },
  {
    id: 'css_l02_q04',
    difficulty: 'easy',
    tags: ['teg', 'a'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Kafe sayti menyusida uchta havola bor. HTML kodiga hech narsa qo'shmaymiz.",
      q: "Uchala havola yashil bo'lishi uchun qaysi selektor kerak?",
      opts: ['a', '.a', '#a', 'href'],
      why: "Teg selektori sahifadagi hamma shunday teglarni tanlaydi. Havolalar — a teglari, demak a selektori uchalasini bo'yaydi. .a va #a uchun HTML kodida class yoki id kerak bo'lardi.",
    },
    ru: {
      ctx: 'В меню сайта кафе три ссылки. В HTML ничего не добавляем.',
      q: 'Какой селектор сделает все три ссылки зелёными?',
      opts: ['a', '.a', '#a', 'href'],
      why: 'Селектор тега выбирает все такие теги на странице. Ссылки — это теги a, значит селектор a покрасит все три. Для .a и #a в HTML понадобились бы class или id.',
    },
    en: {
      ctx: 'The café site menu has three links. We add nothing to the HTML.',
      q: 'Which selector makes all three links green?',
      opts: ['a', '.a', '#a', 'href'],
      why: 'A tag selector picks every tag of that kind on the page. Links are a tags, so the a selector styles all three. .a and #a would need a class or id in the HTML.',
    },
  },
  {
    id: 'css_l02_q05',
    difficulty: 'medium',
    tags: ['class'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<style>\n  .yangi { color: green; }\n</style>\n<h2 class="yangi">Yangi o'yinlar</h2>\n<p class="yangi">Kosmik poyga</p>\n<p>Shaxmat</p>`,
        ru: `<style>\n  .yangi { color: green; }\n</style>\n<h2 class="yangi">Новые игры</h2>\n<p class="yangi">Космические гонки</p>\n<p>Шахматы</p>`,
        en: `<style>\n  .yangi { color: green; }\n</style>\n<h2 class="yangi">New games</h2>\n<p class="yangi">Space race</p>\n<p>Chess</p>`,
      },
    },
    uz: {
      ctx: "O'yinlar do'koni sahifasida bitta class qoidasi bor.",
      q: "Sahifada nima yashil bo'ladi?",
      opts: ['Sarlavha va «Kosmik poyga» abzasi', 'Faqat «Kosmik poyga» abzasi', "Faqat «Yangi o'yinlar» sarlavhasi", 'Sarlavha va ikkala abzas'],
      why: "Qoida class=\"yangi\" yozilgan hamma elementni bo'yaydi, tegi qanday bo'lishidan qat'i nazar: h2 ham, p ham. «Shaxmat»da class yo'q.",
    },
    ru: {
      ctx: 'На странице магазина игр одно правило для класса.',
      q: 'Что на странице станет зелёным?',
      opts: ['Заголовок и абзац «Космические гонки»', 'Только абзац «Космические гонки»', 'Только заголовок «Новые игры»', 'Заголовок и оба абзаца'],
      why: 'Правило красит все элементы с class="yangi", какой бы ни был тег: и h2, и p. У «Шахмат» класса нет.',
    },
    en: {
      ctx: 'The game shop page has one class rule.',
      q: 'What on the page turns green?',
      opts: ['The heading and “Space race”', 'Only the “Space race” paragraph', 'Only the “New games” heading', 'The heading and both paragraphs'],
      why: 'The rule styles every element with class="yangi", whatever its tag: both h2 and p. “Chess” has no class.',
    },
  },
  {
    id: 'css_l02_q06',
    difficulty: 'medium',
    tags: ['class'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<style>\n  eslatma { color: red; }\n</style>\n<p class="eslatma">Ertaga sayohat!</p>\n<p>Bugun darslar odatdagidek</p>`,
        ru: `<style>\n  eslatma { color: red; }\n</style>\n<p class="eslatma">Завтра поход!</p>\n<p>Сегодня уроки как обычно</p>`,
        en: `<style>\n  eslatma { color: red; }\n</style>\n<p class="eslatma">Trip tomorrow!</p>\n<p>Classes as usual today</p>`,
      },
      page: true,
    },
    uz: {
      ctx: "Lager sayti: eslatma qizil bo'lishi kerak edi, lekin qora qoldi.",
      q: 'Nega qoida ishlamadi?',
      opts: ["Nuqta yo'q: brauzer eslatma tegini qidiradi", 'Selektor oldida # turishi kerak edi', 'class nomi katta harf bilan yozilishi kerak', 'Qoida body ichida turishi kerak'],
      why: "Nuqtasiz selektor teg nomi deb o'qiladi: brauzer <eslatma> tegini qidiradi va topmaydi. Class uchun nuqta kerak: .eslatma.",
    },
    ru: {
      ctx: 'Сайт лагеря: напоминание должно было стать красным, но осталось чёрным.',
      q: 'Почему правило не сработало?',
      opts: ['Нет точки: браузер ищет тег eslatma', 'Перед селектором нужна решётка #', 'Имя класса пишут с большой буквы', 'Правило должно стоять внутри body'],
      why: 'Селектор без точки читается как имя тега: браузер ищет тег <eslatma> и не находит. Для класса нужна точка: .eslatma.',
    },
    en: {
      ctx: 'Camp site: the reminder should have turned red but stayed black.',
      q: "Why didn't the rule work?",
      opts: ['No dot: the browser looks for an eslatma tag', 'The selector needs a # in front', 'The class name must start with a capital', 'The rule must be inside body'],
      why: 'A selector without a dot is read as a tag name: the browser looks for an <eslatma> tag and finds none. A class needs a dot: .eslatma.',
    },
  },
  {
    id: 'css_l02_q07',
    difficulty: 'medium',
    tags: ['id', 'class'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<style>\n  .klub { color: blue; }\n</style>\n<h1 id="klub">Burgut FC</h1>\n<p>Keyingi o'yin yakshanba kuni</p>`,
        ru: `<style>\n  .klub { color: blue; }\n</style>\n<h1 id="klub">ФК Беркут</h1>\n<p>Следующий матч в воскресенье</p>`,
        en: `<style>\n  .klub { color: blue; }\n</style>\n<h1 id="klub">Eagle FC</h1>\n<p>Next match on Sunday</p>`,
      },
      page: true,
    },
    uz: {
      ctx: "Futbol klubi sayti: sarlavha ko'k bo'lishi kerak, lekin qora qoldi.",
      q: 'Qanday tuzatamiz?',
      opts: ["CSS kodida .klub o'rniga #klub yozamiz", 'HTML kodida id="#klub" deb yozamiz', "CSS kodida .klub o'rniga klub yozamiz", "HTML kodida id o'rniga name yozamiz"],
      why: "HTML kodida sarlavhaga id berilgan, CSS kodida esa class selektori yozilgan. id panjara belgisi bilan tanlanadi: #klub.",
    },
    ru: {
      ctx: 'Сайт футбольного клуба: заголовок должен быть синим, но остался чёрным.',
      q: 'Как это исправить?',
      opts: ['В CSS написать #klub вместо .klub', 'В HTML написать id="#klub"', 'В CSS написать klub вместо .klub', 'В HTML написать name вместо id'],
      why: 'В HTML у заголовка id, а в CSS написан селектор класса. id выбирают через решётку: #klub.',
    },
    en: {
      ctx: 'Football club site: the heading should be blue but stayed black.',
      q: 'How do we fix it?',
      opts: ['In CSS, write #klub instead of .klub', 'In HTML, write id="#klub"', 'In CSS, write klub instead of .klub', 'In HTML, write name instead of id'],
      why: 'In the HTML the heading has an id, but the CSS has a class selector. An id is picked with a hash: #klub.',
    },
  },
  {
    id: 'css_l02_q08',
    difficulty: 'medium',
    tags: ['kuch'],
    mono: false,
    sort: false,
    vis: {
      css: 'h1 {\n  color: red;\n}\nh1 {\n  color: green;\n}',
    },
    uz: {
      ctx: 'Kinoteatr sayti: bitta sarlavhaga ikki qoida yozilgan.',
      q: 'Sarlavha qanday rangda chiqadi?',
      opts: ['Yashil: pastdagi qoida yutadi', 'Qizil: tepadagi qoida yutadi', "Qora: ikki qoida bir-birini o'chiradi", 'Jigarrang: ikki rang aralashadi'],
      why: "Ikkala selektor bir xil — h1, kuchi teng. Kuchi teng bo'lsa, kodda pastroqda turgan qoida yutadi: sarlavha yashil.",
    },
    ru: {
      ctx: 'Сайт кинотеатра: у одного заголовка два правила.',
      q: 'Каким цветом будет заголовок?',
      opts: ['Зелёным: побеждает нижнее правило', 'Красным: побеждает верхнее правило', 'Чёрным: правила отменяют друг друга', 'Коричневым: цвета смешаются'],
      why: 'Оба селектора одинаковые — h1, сила равная. При равной силе побеждает правило, которое ниже в коде: заголовок зелёный.',
    },
    en: {
      ctx: 'Cinema site: one heading has two rules.',
      q: 'What color will the heading be?',
      opts: ['Green: the lower rule wins', 'Red: the upper rule wins', 'Black: the rules cancel each other', 'Brown: the colors mix'],
      why: "Both selectors are the same, h1, so they're equally strong. With equal strength the rule lower in the code wins: the heading is green.",
    },
  },
  {
    id: 'css_l02_q09',
    difficulty: 'medium',
    tags: ['kuch', 'class'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<style>\n  .hit { color: orange; }\n  p { color: blue; }\n</style>\n<p class="hit">Hafta qo'shig'i: Bahor</p>\n<p>Eski qo'shiqlar</p>`,
        ru: `<style>\n  .hit { color: orange; }\n  p { color: blue; }\n</style>\n<p class="hit">Песня недели: Весна</p>\n<p>Старые песни</p>`,
        en: `<style>\n  .hit { color: orange; }\n  p { color: blue; }\n</style>\n<p class="hit">Song of the week: Spring</p>\n<p>Old songs</p>`,
      },
    },
    uz: {
      ctx: 'Musiqa sayti: bitta abzasga ikki qoida tegadi.',
      q: "«Hafta qo'shig'i» qanday rangda chiqadi?",
      opts: ["To'q sariq: class tegdan kuchli", "Ko'k: pastdagi qoida yutadi", "Ko'k: p hamma abzasni bo'yaydi", "Qora: qoidalar bir-birini o'chiradi"],
      why: "Bu abzasga p ham, .hit ham tegadi. class selektori teg selektoridan kuchli, shuning uchun tartib muhim emas — abzas to'q sariq.",
    },
    ru: {
      ctx: 'Музыкальный сайт: на один абзац действуют два правила.',
      q: 'Каким цветом будет «Песня недели»?',
      opts: ['Оранжевым: класс сильнее тега', 'Синим: побеждает нижнее правило', 'Синим: p красит все абзацы', 'Чёрным: правила отменяют друг друга'],
      why: 'На этот абзац действуют и p, и .hit. Селектор класса сильнее селектора тега, поэтому порядок не важен — абзац оранжевый.',
    },
    en: {
      ctx: 'Music site: two rules apply to one paragraph.',
      q: 'What color will “Song of the week” be?',
      opts: ['Orange: a class beats a tag', 'Blue: the lower rule wins', 'Blue: p styles every paragraph', 'Black: the rules cancel each other'],
      why: "Both p and .hit apply to this paragraph. A class selector is stronger than a tag selector, so the order doesn't matter: the paragraph is orange.",
    },
  },
  {
    id: 'css_l02_q10',
    difficulty: 'hard',
    tags: ['kuch', 'class'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<style>\n  p { color: blue; }\n  .diqqat { background-color: yellow; }\n</style>\n<p class="diqqat">Ertaga musobaqa!</p>`,
        ru: `<style>\n  p { color: blue; }\n  .diqqat { background-color: yellow; }\n</style>\n<p class="diqqat">Завтра соревнования!</p>`,
        en: `<style>\n  p { color: blue; }\n  .diqqat { background-color: yellow; }\n</style>\n<p class="diqqat">Competition tomorrow!</p>`,
      },
    },
    uz: {
      ctx: 'Sport maktabi sayti: bitta abzasga ikki qoida tegadi.',
      q: 'Abzas qanday chiqadi?',
      opts: ["Ko'k matn, sariq fon", 'Qora matn, sariq fon', "Ko'k matn, oq fon", 'Qora matn, oq fon'],
      why: "Qoidalar faqat bir xil xususiyat uchun bahslashadi. Bu yerda biri color, ikkinchisi background-color beradi — ikkalasi ham ishlaydi: ko'k matn, sariq fon.",
    },
    ru: {
      ctx: 'Сайт спортивной школы: на один абзац действуют два правила.',
      q: 'Каким получится абзац?',
      opts: ['Синий текст, жёлтый фон', 'Чёрный текст, жёлтый фон', 'Синий текст, белый фон', 'Чёрный текст, белый фон'],
      why: 'Правила спорят только за одно и то же свойство. Здесь одно задаёт color, другое — background-color, поэтому работают оба: синий текст, жёлтый фон.',
    },
    en: {
      ctx: 'Sports school site: two rules apply to one paragraph.',
      q: 'How will the paragraph look?',
      opts: ['Blue text, yellow background', 'Black text, yellow background', 'Blue text, white background', 'Black text, white background'],
      why: 'Rules only compete over the same property. Here one sets color and the other sets background-color, so both work: blue text, yellow background.',
    },
  },
  {
    id: 'css_l02_q11',
    difficulty: 'hard',
    tags: ['kuch', 'id'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<style>\n  #bosh { color: purple; }\n  .nom { color: green; }\n  h1 { color: orange; }\n</style>\n<h1 id="bosh" class="nom">Robot to'garagi</h1>`,
        ru: `<style>\n  #bosh { color: purple; }\n  .nom { color: green; }\n  h1 { color: orange; }\n</style>\n<h1 id="bosh" class="nom">Кружок роботов</h1>`,
        en: `<style>\n  #bosh { color: purple; }\n  .nom { color: green; }\n  h1 { color: orange; }\n</style>\n<h1 id="bosh" class="nom">Robot club</h1>`,
      },
    },
    uz: {
      ctx: "To'garak sayti: sarlavhaga uchta qoida tegadi.",
      q: 'Sarlavha qanday rangda chiqadi?',
      opts: ['Binafsha', "To'q sariq", 'Yashil', 'Qora'],
      why: "Uchala qoida ham shu sarlavhaga tegadi. Eng kuchlisi — id selektori, keyin class, keyin teg. Shuning uchun #bosh qayerda turmasin yutadi: sarlavha binafsha.",
    },
    ru: {
      ctx: 'Сайт кружка: на заголовок действуют три правила.',
      q: 'Каким цветом будет заголовок?',
      opts: ['Фиолетовым', 'Оранжевым', 'Зелёным', 'Чёрным'],
      why: 'На заголовок действуют все три правила. Сильнее всех селектор id, потом класс, потом тег. Поэтому #bosh побеждает, где бы ни стоял: заголовок фиолетовый.',
    },
    en: {
      ctx: 'Club site: three rules apply to the heading.',
      q: 'What color will the heading be?',
      opts: ['Purple', 'Orange', 'Green', 'Black'],
      why: 'All three rules apply to the heading. The id selector is the strongest, then class, then tag. So #bosh wins wherever it stands: the heading is purple.',
    },
  },
  {
    id: 'css_l02_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['class'],
    mono: true,
    answer: ['mehmon'],
    vis: {
      code: {
        uz: `<style>\n  .___ { color: green; }\n</style>\n<p class="mehmon">Xush kelibsiz!</p>`,
        ru: `<style>\n  .___ { color: green; }\n</style>\n<p class="mehmon">Добро пожаловать!</p>`,
        en: `<style>\n  .___ { color: green; }\n</style>\n<p class="mehmon">Welcome!</p>`,
      },
    },
    uz: {
      ctx: "Mehmonxona sayti: salom abzasi yashil bo'lsin.",
      q: 'Nuqtadan keyin class nomini yozing.',
      why: "CSS kodidagi nom HTML kodidagi class nomi bilan harfma-harf bir xil bo'lishi kerak: .mehmon. Nuqta allaqachon turibdi.",
    },
    ru: {
      ctx: 'Сайт гостиницы: приветствие должно стать зелёным.',
      q: 'Впиши после точки имя класса.',
      why: 'Имя в CSS должно буква в букву совпадать с class в HTML: .mehmon. Точка уже стоит.',
    },
    en: {
      ctx: 'Hotel site: the welcome paragraph should be green.',
      q: 'Type the class name after the dot.',
      why: 'The name in CSS must match the class in the HTML letter for letter: .mehmon. The dot is already there.',
    },
  },
  {
    id: 'css_l02_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['id'],
    mono: true,
    answer: ['#start'],
    vis: null,
    uz: {
      ctx: 'Kosmos sayti, HTML kodida: <h1 id="start">Kosmosga parvoz</h1>',
      q: 'Shu sarlavhani tanlaydigan selektorni belgisi bilan yozing.',
      why: "id panjara belgisi va nom bilan tanlanadi: #start. Nuqta yozilsa, brauzer class qidirib qoladi.",
    },
    ru: {
      ctx: 'Сайт о космосе, в HTML: <h1 id="start">Полёт в космос</h1>',
      q: 'Впиши селектор для этого заголовка вместе со знаком.',
      why: 'id выбирают через решётку и имя: #start. С точкой браузер стал бы искать класс.',
    },
    en: {
      ctx: 'Space site, in the HTML: <h1 id="start">Flight to space</h1>',
      q: 'Type the selector for this heading, with its sign.',
      why: 'An id is picked with a hash and the name: #start. With a dot the browser would look for a class.',
    },
  },
  {
    id: 'css_l02_q14',
    type: 'input',
    difficulty: 'hard',
    tags: ['class'],
    mono: true,
    answer: ['.xabar'],
    vis: {
      code: {
        uz: `<style>\n  ___ { color: blue; }\n</style>\n<h1>Maktab yangiliklari</h1>\n<p class="xabar">Ertaga sport kuni</p>\n<p>Oshxona soat 12 da ochiladi</p>\n<p class="xabar">Kutubxonada yangi kitoblar</p>`,
        ru: `<style>\n  ___ { color: blue; }\n</style>\n<h1>Новости школы</h1>\n<p class="xabar">Завтра день спорта</p>\n<p>Столовая открывается в 12</p>\n<p class="xabar">В библиотеке новые книги</p>`,
        en: `<style>\n  ___ { color: blue; }\n</style>\n<h1>School news</h1>\n<p class="xabar">Sports day tomorrow</p>\n<p>The canteen opens at 12</p>\n<p class="xabar">New books in the library</p>`,
      },
    },
    uz: {
      ctx: "Maktab sayti: faqat ikkita xabar ko'k bo'lsin, qolgan matn o'zgarmasin.",
      q: "Bo'sh joyga selektorni to'liq yozing.",
      why: "Ikkala xabarda bir xil class bor, demak .xabar ikkalasini tanlaydi. p selektori oshxona haqidagi abzasni ham bo'yab yuborardi.",
    },
    ru: {
      ctx: 'Сайт школы: синими должны стать только две новости, остальной текст — без изменений.',
      q: 'Впиши селектор целиком на пустое место.',
      why: 'У обеих новостей один и тот же class, значит .xabar выберет обе. Селектор p покрасил бы и абзац про столовую.',
    },
    en: {
      ctx: 'School site: only the two news items should be blue; the rest stays the same.',
      q: 'Type the whole selector in the empty spot.',
      why: 'Both news items have the same class, so .xabar picks both. The p selector would color the canteen paragraph too.',
    },
  },
  {
    id: 'css_l02_q15',
    type: 'build',
    difficulty: 'easy',
    tags: ['class'],
    pieces: ['.', 'aksiya', ' { color: red; }'],
    extra: ['#', 'p '],
    vis: { css: 'h1 {\n  color: orange;\n}\n___' },
    uz: {
      ctx: "Pitsa kafesi: aksiya abzasida class=\"aksiya\" bor. Faqat u qizil bo'lsin.",
      q: "Bo'laklarni tartib bilan bosib, qoidani yig'ing",
      why: "Class selektori nuqtadan boshlanadi, keyin class nomi keladi: .aksiya. Panjara belgisi id uchun, p esa hamma abzaslarni bo'yab yuborardi.",
    },
    ru: {
      ctx: 'Пиццерия: у абзаца с акцией есть class="aksiya". Красным должен стать только он.',
      q: 'Нажимай кусочки по порядку и собери правило',
      why: 'Селектор класса начинается с точки, потом идёт имя класса: .aksiya. Решётка — для id, а p покрасил бы все абзацы.',
    },
    en: {
      ctx: 'Pizza café: the special-offer paragraph has class="aksiya". Only it should be red.',
      q: 'Tap the pieces in order to build the rule',
      why: 'A class selector starts with a dot, then comes the class name: .aksiya. A hash is for id, and p would color every paragraph.',
    },
  },
  {
    id: 'css_l02_q16',
    type: 'build',
    difficulty: 'medium',
    tags: ['id'],
    pieces: ['id=', '"sher"'],
    extra: ['class=', '"#sher"'],
    vis: {
      code: {
        uz: `<style>\n  #sher { color: orange; }\n</style>\n<h2 ___>Sherlar uyi</h2>\n<p>Ochiq: 9:00 – 18:00</p>`,
        ru: `<style>\n  #sher { color: orange; }\n</style>\n<h2 ___>Дом львов</h2>\n<p>Открыт: 9:00 – 18:00</p>`,
        en: `<style>\n  #sher { color: orange; }\n</style>\n<h2 ___>The lion house</h2>\n<p>Open: 9:00 – 18:00</p>`,
      },
    },
    uz: {
      ctx: "Zoopark sayti: CSS kodida #sher qoidasi tayyor, sarlavhada esa hali hech narsa yo'q.",
      q: "Bo'laklarni tartib bilan bosib, sarlavhaga id bering",
      why: "#sher qoidasi id=\"sher\" bo'lgan elementni qidiradi. HTML kodida panjara belgisi yozilmaydi, class esa .sher selektori uchun bo'lardi.",
    },
    ru: {
      ctx: 'Сайт зоопарка: в CSS готово правило #sher, а у заголовка пока ничего нет.',
      q: 'Нажимай кусочки по порядку и дай заголовку id',
      why: 'Правило #sher ищет элемент с id="sher". В HTML решётку не пишут, а class подошёл бы для селектора .sher.',
    },
    en: {
      ctx: 'Zoo site: the CSS already has a #sher rule, but the heading has nothing yet.',
      q: 'Tap the pieces in order to give the heading an id',
      why: "The #sher rule looks for an element with id=\"sher\". The hash isn't written in HTML, and a class would be for a .sher selector.",
    },
  },
  {
    id: 'css_l02_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['class'],
    line: 5,
    vis: {
      code: {
        uz: `<style>\n  .chegirma { color: red; }\n  .oddiy { color: gray; }\n</style>\n<p class=".chegirma">To'p — chegirmada!</p>\n<p class="oddiy">Raketka</p>`,
        ru: `<style>\n  .chegirma { color: red; }\n  .oddiy { color: gray; }\n</style>\n<p class=".chegirma">Мяч — со скидкой!</p>\n<p class="oddiy">Ракетка</p>`,
        en: `<style>\n  .chegirma { color: red; }\n  .oddiy { color: gray; }\n</style>\n<p class=".chegirma">Ball — on sale!</p>\n<p class="oddiy">Racket</p>`,
      },
      page: true,
    },
    uz: {
      ctx: "Sport do'koni: oddiy tovar kulrang bo'ldi, chegirmadagi tovar esa qizil bo'lmadi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "5-qatorda class nomi nuqta bilan yozilgan. Nuqta faqat CSS selektorida turadi, HTML kodida class=\"chegirma\" bo'lishi kerak.",
    },
    ru: {
      ctx: 'Спортивный магазин: обычный товар стал серым, а товар со скидкой не стал красным.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 5 имя класса написано с точкой. Точка ставится только в селекторе CSS, в HTML нужно class="chegirma".',
    },
    en: {
      ctx: "Sports shop: the regular item turned gray, but the sale item didn't turn red.",
      q: 'Which line has the mistake? Tap that line',
      why: 'On line 5 the class name is written with a dot. The dot goes only in the CSS selector; the HTML needs class="chegirma".',
    },
  },
  {
    id: 'css_l02_q18',
    type: 'tap',
    difficulty: 'medium',
    tags: ['kuch', 'teg'],
    answer: 'venera',
    vis: {
      css: 'p { color: green; }\n.sayyora { color: blue; }\n#tanlangan { color: orange; }',
      html: {
        uz: '<h2 data-t="h2">Quyosh tizimi</h2>\n<p data-t="merkuriy" class="sayyora">Merkuriy</p>\n<p data-t="venera">Venera</p>\n<p data-t="yer" id="tanlangan">Yer</p>\n<p data-t="mars" class="sayyora">Mars</p>',
        ru: '<h2 data-t="h2">Солнечная система</h2>\n<p data-t="merkuriy" class="sayyora">Меркурий</p>\n<p data-t="venera">Венера</p>\n<p data-t="yer" id="tanlangan">Земля</p>\n<p data-t="mars" class="sayyora">Марс</p>',
        en: '<h2 data-t="h2">The Solar System</h2>\n<p data-t="merkuriy" class="sayyora">Mercury</p>\n<p data-t="venera">Venus</p>\n<p data-t="yer" id="tanlangan">Earth</p>\n<p data-t="mars" class="sayyora">Mars</p>',
      },
    },
    uz: {
      ctx: 'Kosmos sayti: abzaslarga uchta qoida tegadi.',
      q: "Qaysi abzasni faqat p qoidasi bo'yadi? Ustiga bosing",
      why: "p qoidasi hamma abzasga tegadi, lekin class va id undan kuchli: ular tekkan abzaslar ko'k va to'q sariq. Venerada class ham, id ham yo'q — u yashil.",
    },
    ru: {
      ctx: 'Сайт о космосе: на абзацы действуют три правила.',
      q: 'Какой абзац покрасило только правило p? Нажми на него',
      why: 'Правило p действует на все абзацы, но class и id сильнее: абзацы с class синие, абзац с id оранжевый. У Венеры нет ни class, ни id — она зелёная.',
    },
    en: {
      ctx: 'Space site: three rules apply to the paragraphs.',
      q: 'Which paragraph was styled only by the p rule? Tap it',
      why: "The p rule applies to every paragraph, but class and id are stronger: their paragraphs are blue and orange. Venus has neither a class nor an id, so it's green.",
    },
  },
];
