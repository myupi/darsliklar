// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 6 «Контейнер и сетка» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: сетка — Layout → Grid; ряд делится на 12 частей, col-N — N частей из 12; сумма больше 12 — колонка уходит
// на новую строку; col делят остаток поровну; md:col-4 — с 768 px в ряд, на телефоне друг под другом; md-col-4 (дефис)
// и col-md-4 (версия 5) не работают; lg — с 1024 px; container на телефоне — во весь экран; container → row → col;
// скопированный пример Grid настраивают: ещё одна col — ещё одна равная колонка.
// Страницы с сеткой — всегда с vw (800 — ширина ноутбука/планшета, срабатывает md, но не lg). Блоки колонок окрашены
// стилем только на странице (в коде ученика его нет). Классы сверены с tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css.
// Ситуации тестов модуля (tools/webtest/bootstrap/l06.jsx) не повторяются. Апостроф в узбекском — ASCII «'».
// Словарь урока: konteyner, setka, qator, ustun, 12 bo'lak, ekran kengligi, ostma-ost.
// =============================================================================

const L3c = (fn) => ({ uz: fn(0), ru: fn(1), en: fn(2) });
const W = {
  r: ['Robotlar', 'Роботы', 'Robots'],
  j: ['Jadval', 'Расписание', 'Schedule'],
  a: ['Aloqa', 'Контакты', 'Contact'],
};
// ряд из колонок: cls — class каждой колонки, keys — слова из W
const row = (cls, keys) => (i) => '<div class="row">\n' + keys.map((k, n) => `  <div class="${cls[n]}">${W[k][i]}</div>`).join('\n') + '\n</div>';
// окраска колонок — только на странице
const DECO = '<style>.row>div{background:#FFE4D6;border:2px solid #fff;padding:10px 6px;font:600 15px Arial;text-align:center}.row{margin-bottom:10px}</style>\n';
const page = (fn) => L3c((i) => DECO + fn(i));

export default [
  {
    id: 'bootstrap_l06_q01',
    difficulty: 'easy',
    tags: ['site', 'grid'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Sahifani ustunlarga bo'lmoqchisiz. Setka misolini Bootstrap saytidan olasiz.",
      q: "Grid sahifasi qaysi bo'limda?",
      opts: ['Layout', 'Components', 'Utilities', 'Forms'],
      why: "Setka sahifaning tuzilishi, shuning uchun u Layout bo'limida: Containers, Grid, Breakpoints. Ekran o'lchamlari jadvali ham shu yerda, Breakpoints sahifasida.",
    },
    ru: {
      ctx: 'Ты хочешь разделить страницу на колонки. Пример сетки берёшь с сайта Bootstrap.',
      q: 'В каком разделе страница Grid?',
      opts: ['Layout', 'Components', 'Utilities', 'Forms'],
      why: 'Сетка — это устройство страницы, поэтому она в разделе Layout: Containers, Grid, Breakpoints. Таблица размеров экрана тоже там, на странице Breakpoints.',
    },
    en: {
      ctx: 'You want to split the page into columns. You take the grid example from the Bootstrap site.',
      q: 'Which section has the Grid page?',
      opts: ['Layout', 'Components', 'Utilities', 'Forms'],
      why: 'The grid is the page’s layout, so it’s in the Layout section: Containers, Grid, Breakpoints. The screen size table is there too, on the Breakpoints page.',
    },
  },
  {
    id: 'bootstrap_l06_q02',
    difficulty: 'easy',
    tags: ['col'],
    mono: true,
    sort: false,
    vis: { page: page(row(['col-6', 'col-6'], ['r', 'a'])) },
    uz: {
      ctx: "Noutbukda ikki blok qatorni teng ikkiga bo'lib turibdi.",
      q: "Ustunlarga qaysi so'zlar yozilgan?",
      opts: ['col-6 va col-6', 'col-2 va col-2', 'col-50 va col-50', 'col-12 va col-12'],
      why: "Qator 12 bo'lakka bo'lingan, teng ikkiga esa 6 tadan: col-6 va col-6. col-50 degan so'z yo'q, raqam foiz emas. col-12 butun qatorni oladi.",
    },
    ru: {
      ctx: 'На ноутбуке два блока делят ряд ровно пополам.',
      q: 'Какие слова написаны колонкам?',
      opts: ['col-6 и col-6', 'col-2 и col-2', 'col-50 и col-50', 'col-12 и col-12'],
      why: 'Ряд делится на 12 частей, а пополам — по 6: col-6 и col-6. Слова col-50 нет, число — не проценты. А col-12 занимает весь ряд.',
    },
    en: {
      ctx: 'On a laptop two blocks split the row exactly in half.',
      q: 'Which words do the columns have?',
      opts: ['col-6 and col-6', 'col-2 and col-2', 'col-50 and col-50', 'col-12 and col-12'],
      why: 'The row is split into 12 parts, and half is 6 each: col-6 and col-6. There’s no col-50; the number isn’t a percent. col-12 takes the whole row.',
    },
  },
  {
    id: 'bootstrap_l06_q03',
    difficulty: 'easy',
    tags: ['col', '12'],
    mono: false,
    sort: true,
    vis: null,
    uz: {
      ctx: "Bootstrap setkasida ustun kengligi bo'laklar bilan o'lchanadi.",
      q: "Bitta qator nechta bo'lakka bo'lingan?",
      opts: ['12', '10', '100', '6'],
      why: "Qator 12 bo'lakka bo'lingan, col so'zidan keyingi raqam — shulardan nechtasi. 12 ni 2, 3, 4 va 6 ga bo'lish mumkin, shuning uchun ustunlarni qulay taqsimlasa bo'ladi.",
    },
    ru: {
      ctx: 'В сетке Bootstrap ширину колонки считают частями.',
      q: 'На сколько частей поделён один ряд?',
      opts: ['12', '10', '100', '6'],
      why: 'Ряд поделён на 12 частей, а число после col — сколько из них взять. 12 делится на 2, 3, 4 и 6, поэтому колонки удобно делить.',
    },
    en: {
      ctx: 'In the Bootstrap grid a column’s width is counted in parts.',
      q: 'How many parts is one row split into?',
      opts: ['12', '10', '100', '6'],
      why: 'A row is split into 12 parts, and the number after col says how many of them to take. 12 divides by 2, 3, 4 and 6, so columns split up nicely.',
    },
  },
  {
    id: 'bootstrap_l06_q04',
    difficulty: 'easy',
    tags: ['md', 'breakpoints'],
    mono: false,
    sort: true,
    vis: null,
    uz: {
      ctx: "Uchta blokka md:col-4 yozildi.",
      q: 'Bloklar ekran kengligi qanchadan boshlab qatorga tiziladi?',
      opts: ['768 px', '576 px', '1024 px', '360 px'],
      why: "md — o'rta ekran, 768 pikseldan boshlab. sm 576 pikseldan, lg 1024 pikseldan boshlanadi. Torroq ekranda bloklar ostma-ost turadi.",
    },
    ru: {
      ctx: 'Трём блокам написали md:col-4.',
      q: 'С какой ширины экрана блоки встанут в ряд?',
      opts: ['768 px', '576 px', '1024 px', '360 px'],
      why: 'md — средний экран, от 768 пикселей. sm начинается с 576, lg — с 1024 пикселей. На экране уже блоки стоят друг под другом.',
    },
    en: {
      ctx: 'Three blocks got md:col-4.',
      q: 'From what screen width will the blocks line up in a row?',
      opts: ['768 px', '576 px', '1024 px', '360 px'],
      why: 'md is a medium screen, from 768 pixels. sm starts at 576 and lg at 1024 pixels. On a narrower screen the blocks stand one under another.',
    },
  },
  {
    id: 'bootstrap_l06_q05',
    difficulty: 'medium',
    tags: ['col', '12'],
    mono: false,
    sort: false,
    vis: { code: L3c(row(['col-8', 'col-8'], ['r', 'j'])), page: page(row(['col-8', 'col-8'], ['r', 'j'])) },
    uz: {
      ctx: "Ikki blok yonma-yon turishi kerak edi, lekin ikkinchisi pastga tushib qoldi.",
      q: 'Nega?',
      opts: ["8 va 8 birga 16, bu 12 dan ko'p", 'row o\'rniga d-flex yozish kerak', 'col-8 faqat telefonda ishlaydi', 'Bloklarni container o\'rab turmagan'],
      why: "Qator 12 bo'lakdan iborat. 8 va 8 birga 16, ikkinchi blokka joy qolmaydi va u keyingi qatorga o'tadi. Yonma-yon turishi uchun yig'indi 12 bo'lsin, masalan col-8 va col-4.",
    },
    ru: {
      ctx: 'Два блока должны были стоять рядом, а второй съехал вниз.',
      q: 'Почему?',
      opts: ['8 и 8 — это 16, больше 12', 'Вместо row нужно писать d-flex', 'col-8 работает только на телефоне', 'Блоки не обёрнуты в container'],
      why: 'Ряд состоит из 12 частей. 8 и 8 — это 16, второму блоку не хватает места, и он уходит на новую строку. Чтобы стояли рядом, сумма должна быть 12: например, col-8 и col-4.',
    },
    en: {
      ctx: 'Two blocks should stand side by side, but the second one dropped down.',
      q: 'Why?',
      opts: ['8 and 8 make 16, more than 12', 'It needs d-flex instead of row', 'col-8 only works on phones', 'The blocks aren’t in a container'],
      why: 'A row has 12 parts. 8 and 8 make 16, so the second block has no room and moves to a new line. To sit side by side the sum should be 12, like col-8 and col-4.',
    },
  },
  {
    id: 'bootstrap_l06_q06',
    difficulty: 'medium',
    tags: ['md', 'colon'],
    mono: false,
    sort: false,
    vis: {
      code: L3c(row(['md-col-4', 'md-col-4', 'md-col-4'], ['r', 'j', 'a'])),
      page: page(row(['md-col-4', 'md-col-4', 'md-col-4'], ['r', 'j', 'a'])),
      vw: 800,
    },
    uz: {
      ctx: "Noutbukda uchta blok qatorda turishi kerak edi, lekin ular ostma-ost turibdi.",
      q: 'Nega bloklar qatorga tizilmadi?',
      opts: ["Chiziqcha o'rnida ikki nuqta kerak: md:col-4", 'row o\'rniga d-flex yozish kerak', "Noutbukda md so'zlari ishlamaydi", 'Bloklarni container o\'rab turmagan'],
      why: "Oltinchi versiyada ekran o'lchami so'zdan ikki nuqta bilan ajraladi: md:col-4. md-col-4 degan so'z Bootstrapda yo'q, shuning uchun har bir blok butun qatorni oladi.",
    },
    ru: {
      ctx: 'На ноутбуке три блока должны стоять в ряд, а стоят друг под другом.',
      q: 'Почему блоки не встали в ряд?',
      opts: ['Вместо дефиса нужно двоеточие: md:col-4', 'Вместо row нужно писать d-flex', 'На ноутбуке слова с md не работают', 'Блоки не обёрнуты в container'],
      why: 'В шестой версии размер экрана отделяется от слова двоеточием: md:col-4. Слова md-col-4 в Bootstrap нет, поэтому каждый блок занимает весь ряд.',
    },
    en: {
      ctx: 'On a laptop three blocks should stand in a row, but they’re stacked.',
      q: 'Why didn’t the blocks line up?',
      opts: ['It needs a colon, not a dash: md:col-4', 'It needs d-flex instead of row', 'md words don’t work on laptops', 'The blocks aren’t in a container'],
      why: 'In version 6 the screen size is split from the word by a colon: md:col-4. Bootstrap has no word md-col-4, so each block takes the whole row.',
    },
  },
  {
    id: 'bootstrap_l06_q07',
    difficulty: 'medium',
    tags: ['md', 'phone'],
    mono: false,
    sort: false,
    vis: { code: L3c(row(['md:col-4', 'md:col-4', 'md:col-4'], ['r', 'j', 'a'])) },
    uz: {
      ctx: "Bu sahifani 360 px kenglikdagi telefonda ochishdi.",
      q: 'Bloklar telefonda qanday turadi?',
      opts: ['Ostma-ost, har biri butun enida', 'Qatorda, uchta tor ustun bo\'lib', 'Ikkitasi qatorda, bittasi pastda', "Telefonda bloklar ko'rinmaydi"],
      why: "md:col-4 768 pikseldan boshlab ishlaydi. Telefon torroq, shuning uchun qator ichidagi har bir blok butun enni oladi va ular ostma-ost turadi.",
    },
    ru: {
      ctx: 'Эту страницу открыли на телефоне шириной 360 px.',
      q: 'Как блоки встанут на телефоне?',
      opts: ['Друг под другом, каждый во всю ширину', 'В ряд, тремя узкими колонками', 'Два в ряд, а третий ниже', 'На телефоне блоков не видно'],
      why: 'md:col-4 работает с 768 пикселей. Телефон уже, поэтому каждый блок в ряду занимает всю ширину, и они встают друг под другом.',
    },
    en: {
      ctx: 'This page was opened on a phone 360 px wide.',
      q: 'How will the blocks stand on the phone?',
      opts: ['One under another, each full width', 'In a row, as three narrow columns', 'Two in a row and one below', 'The blocks aren’t visible on phones'],
      why: 'md:col-4 works from 768 pixels. The phone is narrower, so each block in the row takes the full width and they stand one under another.',
    },
  },
  {
    id: 'bootstrap_l06_q08',
    difficulty: 'medium',
    tags: ['container', 'phone'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Sahifaning hamma qismi container ichida. Uni 360 px kenglikdagi telefonda ochishdi.",
      q: 'container telefonda qancha joy oladi?',
      opts: ['Butun ekran enini', '720 px: ekrandan chiqib ketadi', "540 px va o'rtada turadi", 'Ekranning faqat yarmini'],
      why: "container kengligini ekranga qarab o'zi tanlaydi: planshetda 720 px, noutbukda 960 yoki 1200 px, telefonda esa butun ekran. Shuning uchun telefonda sahifa ekranga sig'adi.",
    },
    ru: {
      ctx: 'Вся страница лежит внутри container. Её открыли на телефоне шириной 360 px.',
      q: 'Сколько места займёт container на телефоне?',
      opts: ['Всю ширину экрана', '720 px: вылезет за экран', '540 px и встанет посередине', 'Только половину экрана'],
      why: 'container сам выбирает ширину по экрану: на планшете 720 px, на ноутбуке 960 или 1200 px, а на телефоне — весь экран. Поэтому на телефоне страница помещается.',
    },
    en: {
      ctx: 'The whole page is inside a container. It was opened on a phone 360 px wide.',
      q: 'How much room does the container take on the phone?',
      opts: ['The whole screen width', '720 px: it goes off the screen', '540 px, standing in the middle', 'Only half the screen'],
      why: 'container picks its width by the screen: 720 px on a tablet, 960 or 1200 px on a laptop, and the whole screen on a phone. So on a phone the page fits.',
    },
  },
  {
    id: 'bootstrap_l06_q09',
    difficulty: 'medium',
    tags: ['site', 'copy', 'col'],
    mono: false,
    sort: false,
    vis: {
      code: '<div class="container text-center">\n  <div class="row">\n    <div class="col">Column</div>\n'
        + '    <div class="col">Column</div>\n    <div class="col">Column</div>\n  </div>\n</div>',
    },
    uz: {
      ctx: "Grid sahifasidan misolni nusxaladingiz: uchta teng ustun. Sizga to'rtta teng blok kerak.",
      q: 'Nima qilasiz?',
      opts: ['Yana bitta col qatorini qo\'shaman', 'col o\'rniga col-4 yozaman', 'Yana bitta row qatorini qo\'shaman', 'container o\'rniga container-4 yozaman'],
      why: "col qatorni teng bo'ladi, nechta bo'lsa ham. To'rtinchi col qo'shilsa, har biri qatorning choragini oladi. col-4 esa uchta ustunga mos keladi.",
    },
    ru: {
      ctx: 'Ты скопировал пример со страницы Grid: три равные колонки. Тебе нужно четыре равных блока.',
      q: 'Что ты делаешь?',
      opts: ['Добавляю ещё одну строку col', 'Пишу col-4 вместо col', 'Добавляю ещё одну строку row', 'Пишу container-4 вместо container'],
      why: 'col делят ряд поровну, сколько бы их ни было. Добавишь четвёртую col — каждая займёт четверть ряда. А col-4 подходит для трёх колонок.',
    },
    en: {
      ctx: 'You copied the example from the Grid page: three equal columns. You need four equal blocks.',
      q: 'What do you do?',
      opts: ['Add one more col line', 'Write col-4 instead of col', 'Add one more row line', 'Write container-4 instead of container'],
      why: 'col columns share the row equally, however many there are. Add a fourth col, and each takes a quarter of the row. col-4 fits three columns.',
    },
  },
  {
    id: 'bootstrap_l06_q10',
    difficulty: 'hard',
    tags: ['lg', 'breakpoints'],
    mono: false,
    sort: false,
    vis: {
      code: L3c(row(['lg:col-4', 'lg:col-4', 'lg:col-4'], ['r', 'j', 'a'])),
      page: page(row(['lg:col-4', 'lg:col-4', 'lg:col-4'], ['r', 'j', 'a'])),
      vw: 800,
    },
    uz: {
      ctx: "Planshet ekrani 800 px. Kodi lg:col-4 yozdi, lekin bloklar ostma-ost turibdi.",
      q: 'Nega bloklar qatorga tizilmadi?',
      opts: ['lg 1024 pikseldan boshlanadi, 800 kichik', "lg so'zi oltinchi versiyada yo'q", 'row ichida lg ishlamaydi', 'lg:col-4 faqat telefonda ishlaydi'],
      why: "lg — katta ekran, 1024 pikseldan boshlab. 800 px planshetda lg:col-4 hali ishlamaydi. Planshetda qatorga qo'yish uchun md:col-4 kerak: md 768 pikseldan boshlanadi.",
    },
    ru: {
      ctx: 'Экран планшета — 800 px. Коди написал lg:col-4, но блоки стоят друг под другом.',
      q: 'Почему блоки не встали в ряд?',
      opts: ['lg начинается с 1024 px, а 800 меньше', 'Слова lg нет в шестой версии', 'Внутри row lg не работает', 'lg:col-4 работает только на телефоне'],
      why: 'lg — большой экран, от 1024 пикселей. На планшете в 800 px lg:col-4 ещё не работает. Чтобы на планшете был ряд, нужен md:col-4: md начинается с 768 пикселей.',
    },
    en: {
      ctx: 'The tablet screen is 800 px. Kodi wrote lg:col-4, but the blocks are stacked.',
      q: 'Why didn’t the blocks line up?',
      opts: ['lg starts at 1024 px, and 800 is less', 'There’s no lg in version 6', 'lg doesn’t work inside row', 'lg:col-4 only works on phones'],
      why: 'lg is a large screen, from 1024 pixels. On an 800 px tablet lg:col-4 doesn’t work yet. For a row on a tablet you need md:col-4: md starts at 768 pixels.',
    },
  },
  {
    id: 'bootstrap_l06_q11',
    difficulty: 'hard',
    tags: ['col', '12'],
    mono: false,
    sort: false,
    vis: { code: L3c(row(['col', 'col-6', 'col'], ['r', 'j', 'a'])) },
    uz: {
      ctx: "O'rtadagi blokda col-6, chetdagi ikkitasida shunchaki col.",
      q: 'Chetdagi bloklar qatorning qancha qismini oladi?',
      opts: ["Har biri chorak: qolgan yarmini bo'lishadi", "Har biri uchdan bir: col teng bo'ladi", 'Har biri yarim: ular pastga tushadi', "Matnicha: col o'lcham bermaydi"],
      why: "col-6 qatorning yarmini oladi: 12 bo'lakdan 6 tasini. Qolgan yarmini ikkita col teng bo'lishadi: har biriga 3 bo'lak, bu qatorning choragi.",
    },
    ru: {
      ctx: 'У среднего блока col-6, у двух крайних — просто col.',
      q: 'Какую часть ряда займут крайние блоки?',
      opts: ['Каждый — четверть: делят остаток', 'Каждый — треть: col делят поровну', 'Каждый — половину: они съедут вниз', 'По тексту: col не даёт ширины'],
      why: 'col-6 берёт половину ряда, то есть 6 частей из 12. Оставшуюся половину два col делят поровну: каждому по 3 части, это четверть ряда.',
    },
    en: {
      ctx: 'The middle block has col-6, and the two outer ones just col.',
      q: 'How much of the row does each outer block take?',
      opts: ['A quarter each: they share the rest', 'A third each: col split equally', 'Half each: they drop down', 'As wide as the text: col gives no width'],
      why: 'col-6 takes half the row, 6 parts out of 12. The two col blocks share the other half equally: 3 parts each, which is a quarter of the row.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'bootstrap_l06_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['container'],
    mono: true,
    answer: ['container'],
    vis: {
      code: L3c((i) => '<div class="___">\n  <div class="row">\n'
        + `    <div class="col">${W.r[i]}</div>\n    <div class="col">${W.a[i]}</div>\n  </div>\n</div>`),
    },
    uz: {
      ctx: "Noutbukda bloklar chetdan chetgacha cho'zilgan. Sahifa o'rtada, chetlarida joy bilan tursin.",
      q: "Tashqi div tegiga bitta so'z yozing.",
      why: "container sahifani o'rtaga yig'adi va kengligini ekranga qarab cheklaydi. Uning ichida row, row ichida esa col turadi.",
    },
    ru: {
      ctx: 'На ноутбуке блоки растянулись от края до края. Страница должна стоять посередине, с полями по бокам.',
      q: 'Впиши одно слово для внешнего div.',
      why: 'container собирает страницу посередине и ограничивает её ширину по экрану. Внутри него row, а внутри row — col.',
    },
    en: {
      ctx: 'On a laptop the blocks stretch from edge to edge. The page should sit in the middle, with space at the sides.',
      q: 'Type one word for the outer div.',
      why: 'container gathers the page in the middle and limits its width by the screen. Inside it goes row, and inside row goes col.',
    },
  },
  {
    id: 'bootstrap_l06_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['col', '12'],
    mono: false,
    answer: ['8'],
    vis: {
      code: L3c((i) => '<div class="row">\n'
        + `  <div class="col-4">${['Rasm', 'Фото', 'Photo'][i]}</div>\n  <div class="col-___">${['Matn', 'Текст', 'Text'][i]}</div>\n</div>`),
    },
    uz: {
      ctx: "Rasm ustuni col-4. Matn ustuni qatorning qolgan qismini to'liq olsin.",
      q: "Bo'sh joyga raqam yozing.",
      why: "Qator 12 bo'lak: 4 tasini rasm oldi, 12 dan 4 ni olsak, 8 qoladi. Demak col-8, ikkalasi birga butun qator.",
    },
    ru: {
      ctx: 'У колонки с фото col-4. Колонка с текстом должна занять весь остаток ряда.',
      q: 'Впиши на пустое место число.',
      why: 'Ряд — 12 частей: 4 взяло фото, 12 минус 4 — это 8. Значит, col-8, и вместе они дают весь ряд.',
    },
    en: {
      ctx: 'The photo column is col-4. The text column should take all the rest of the row.',
      q: 'Type a number in the empty spot.',
      why: 'A row is 12 parts: the photo took 4, and 12 minus 4 is 8. So it’s col-8, and together they fill the whole row.',
    },
  },
  {
    id: 'bootstrap_l06_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['md', 'col'],
    mono: true,
    answer: ['md:col-6'],
    vis: { code: L3c(row(['___', '___'], ['r', 'j'])) },
    uz: {
      ctx: "Telefonda ikki blok ostma-ost tursin, 768 pikseldan boshlab esa yonma-yon, teng ikkiga.",
      q: "Ikkala bo'sh joyga bir xil so'z yoziladi. Uni yozing.",
      why: "768 pikseldan boshlab — bu md, teng ikkiga esa col-6. Ular ikki nuqta bilan birlashadi: md:col-6. Torroq ekranda bloklar ostma-ost turadi.",
    },
    ru: {
      ctx: 'На телефоне два блока друг под другом, а с 768 пикселей — рядом, ровно пополам.',
      q: 'В оба пустых места пишется одно и то же слово. Впиши его.',
      why: 'С 768 пикселей — это md, а пополам — col-6. Они соединяются двоеточием: md:col-6. На экране уже блоки стоят друг под другом.',
    },
    en: {
      ctx: 'On a phone the two blocks are stacked; from 768 pixels they sit side by side, half and half.',
      q: 'Both empty spots get the same word. Type it.',
      why: 'From 768 pixels is md, and half is col-6. They join with a colon: md:col-6. On a narrower screen the blocks stand one under another.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l06_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['md', 'colon'],
    pieces: ['md', ':', 'col-4'],
    extra: ['-', 'col-md-4', 'lg'],
    vis: { code: L3c((i) => `<div class="row">\n  <div class="___">${W.r[i]}</div>\n</div>`) },
    uz: {
      ctx: "Telefonda bloklar ostma-ost tursin, 768 pikseldan boshlab esa uchta ustun bo'lsin.",
      q: "Bo'laklarni bosib, ustun so'zini yig'ing",
      why: "Oldin ekran o'lchami md, keyin ikki nuqta, keyin kenglik col-4. col-md-4 — beshinchi versiyadagi eski nom, oltinchi versiyada ishlamaydi. lg esa 1024 pikseldan.",
    },
    ru: {
      ctx: 'На телефоне блоки друг под другом, а с 768 пикселей — три колонки.',
      q: 'Нажимай кусочки и собери слово колонки',
      why: 'Сначала размер экрана md, потом двоеточие, потом ширина col-4. col-md-4 — старое имя из 5-й версии, в 6-й не работает. А lg — с 1024 пикселей.',
    },
    en: {
      ctx: 'On a phone the blocks are stacked; from 768 pixels there are three columns.',
      q: 'Tap the pieces to build the column word',
      why: 'First the screen size md, then a colon, then the width col-4. col-md-4 is an old name from version 5; it doesn’t work in version 6. And lg starts at 1024 pixels.',
    },
  },
  {
    id: 'bootstrap_l06_q16',
    type: 'build',
    difficulty: 'easy',
    tags: ['row'],
    pieces: ['<div', ' class="row"', '>'],
    extra: [' class="rows"', ' class="col-12"'],
    vis: {
      code: L3c((i) => '<div class="container">\n  ___\n'
        + `    <div class="col">${W.r[i]}</div>\n    <div class="col">${W.a[i]}</div>\n  </div>\n</div>`),
    },
    uz: {
      ctx: "Ikkita col yonma-yon tursin. Buning uchun ularni qator o'rab turishi kerak.",
      q: "Bo'laklarni bosib, qatorning ochuvchi tegini yig'ing",
      why: "Ustunlar faqat row ichida qatorga tiziladi: container ichida row, row ichida col. rows degan so'z yo'q, col-12 esa butun qatorni oladigan ustun.",
    },
    ru: {
      ctx: 'Две col должны стоять рядом. Для этого их должен обнимать ряд.',
      q: 'Нажимай кусочки и собери открывающий тег ряда',
      why: 'Колонки встают в ряд только внутри row: в container — row, в row — col. Слова rows нет, а col-12 — колонка на весь ряд.',
    },
    en: {
      ctx: 'Two col blocks should sit side by side. For that, a row must wrap them.',
      q: 'Tap the pieces to build the row’s opening tag',
      why: 'Columns line up only inside row: row goes in container, col goes in row. There’s no word rows, and col-12 is a column as wide as the whole row.',
    },
  },
  {
    id: 'bootstrap_l06_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['md', 'old-name'],
    line: 3,
    vis: {
      code: L3c(row(['md:col-4', 'col-md-4', 'md:col-4'], ['r', 'j', 'a'])),
      page: page(row(['md:col-4', 'col-md-4', 'md:col-4'], ['r', 'j', 'a'])),
      vw: 800,
    },
    uz: {
      ctx: "Noutbukda uchta blok qatorda turishi kerak, lekin bittasi butun qatorni egallab oldi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "3-qatorda col-md-4 turibdi. Bu beshinchi versiyadagi eski nom, oltinchi versiyada ishlamaydi, shuning uchun blok butun qatorni oldi. To'g'risi: md:col-4.",
    },
    ru: {
      ctx: 'На ноутбуке три блока должны стоять в ряд, а один занял весь ряд.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 3 стоит col-md-4. Это старое имя из 5-й версии, в 6-й оно не работает, поэтому блок занял весь ряд. Правильно: md:col-4.',
    },
    en: {
      ctx: 'On a laptop three blocks should stand in a row, but one took the whole row.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 3 has col-md-4. That’s an old name from version 5; it doesn’t work in version 6, so the block took the whole row. Correct: md:col-4.',
    },
  },
  {
    id: 'bootstrap_l06_q18',
    type: 'tap',
    difficulty: 'easy',
    tags: ['col'],
    answer: 'a',
    vis: {
      page: DECO + '<div class="row">\n  <div class="col-3" data-t="a">1</div>\n  <div class="col-9" data-t="b">2</div>\n</div>\n'
        + '<div class="row">\n  <div class="col-6" data-t="c">3</div>\n  <div class="col-6" data-t="d">4</div>\n</div>',
    },
    uz: {
      ctx: "Sahifada ikki qator, ularda to'rtta blok.",
      q: 'Qaysi blok col-3? Ustiga bosing',
      why: "col-3 — 12 bo'lakdan 3 tasi, bu qatorning choragi. Yonidagi col-9 qolgan bo'lakni oladi, pastdagi ikkita col-6 esa qatorni teng yarmiga bo'ladi.",
    },
    ru: {
      ctx: 'На странице два ряда, в них четыре блока.',
      q: 'Какой блок col-3? Нажми на него',
      why: 'col-3 — 3 части из 12, то есть четверть ряда. Соседний col-9 берёт остальное, а два col-6 внизу делят ряд пополам.',
    },
    en: {
      ctx: 'The page has two rows with four blocks.',
      q: 'Which block is col-3? Tap it',
      why: 'col-3 is 3 parts out of 12, a quarter of the row. The col-9 next to it takes the rest, and the two col-6 below split the row in half.',
    },
  },
];
