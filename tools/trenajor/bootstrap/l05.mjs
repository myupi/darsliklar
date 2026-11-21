// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 5 «Карточки» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: пример карточки — Components → Card; card (рамка), card-img-top (фото сверху во всю ширину), card-body
// (отступы внутри); card-title и card-text в CSS 6.0 правил не имеют — это имена; порядок внутри карточки (фото, потом
// card-body); настройка скопированного: свой текст вместо Card title, свой файл с окончанием вместо src="...", цвет кнопки
// theme-*, card и card-body не трогаем; длинный пример — значком копирования; мягкий цвет — card-subtle theme-*;
// цвет пишут тому тегу, который красят; карточки в d-flex тянутся до одной высоты; card-success — нет такого слова.
// Классы сверены с tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css. Ситуации тестов модуля
// (tools/webtest/bootstrap/l05.jsx) не повторяются. Апостроф в узбекском — ASCII «'».
// Словарь урока: kartochka, ramka, ichki joy, rasm, namuna, nusxalash, moslash, rang so'zi.
// =============================================================================

const L3c = (fn) => ({ uz: fn(0), ru: fn(1), en: fn(2) });
const NAME = 'Robo-1';
const DESC = ['Futbol o\'ynaydi', 'Играет в футбол', 'Plays football'];
const tapCard = (src, t, i) => `<div class="card" style="width: 100px" data-t="${t}">`
  + `<img src="${src}" class="card-img-top" alt="...">`
  + `<div class="card-body"><b>${['Robot', 'Робот', 'Robot'][i]} ${t}</b></div></div>`;

export default [
  {
    id: 'bootstrap_l05_q01',
    difficulty: 'easy',
    tags: ['site', 'card'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Robotlar uchun kartochka kerak. Uni o'zimiz yozmaymiz, Bootstrap saytidan olamiz.",
      q: "Kartochka namunasi saytning qaysi joyida?",
      opts: ['Components → Card', 'Utilities → Flex', 'Layout → Grid', 'Getting started → Install'],
      why: "Kartochka tayyor bo'lak, tayyor bo'laklar esa Components bo'limida. Card sahifasidagi birinchi misolda rasm, sarlavha, matn va tugma bor.",
    },
    ru: {
      ctx: 'Для роботов нужна карточка. Сами её не пишем — берём с сайта Bootstrap.',
      q: 'Где на сайте пример карточки?',
      opts: ['Components → Card', 'Utilities → Flex', 'Layout → Grid', 'Getting started → Install'],
      why: 'Карточка — готовая часть, а готовые части лежат в разделе Components. В первом примере на странице Card есть фото, заголовок, текст и кнопка.',
    },
    en: {
      ctx: 'The robots need cards. We don’t write one ourselves; we take it from the Bootstrap site.',
      q: 'Where on the site is the card example?',
      opts: ['Components → Card', 'Utilities → Flex', 'Layout → Grid', 'Getting started → Install'],
      why: 'A card is a ready-made part, and ready-made parts are in Components. The first example on the Card page has a photo, a title, text and a button.',
    },
  },
  {
    id: 'bootstrap_l05_q02',
    difficulty: 'easy',
    tags: ['card-img-top'],
    mono: true,
    sort: false,
    vis: {
      code: '<div class="card">\n  <img src="robot.png" class="___">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">${NAME}</h4>\n  </div>\n</div>`,
    },
    uz: {
      ctx: "Rasm kartochkaning tepasida butun eni bo'ylab tursin, tepa burchaklari esa yumaloq bo'lsin.",
      q: "Bo'sh joyga qaysi so'z yoziladi?",
      opts: ['card-img-top', 'card-top-img', 'img-thumbnail', 'card-body'],
      why: "card-img-top rasmni kartochka eniga cho'zadi va tepa burchaklarini kartochkadek yumaloq qiladi. So'zning tartibi saytdagidek: card, img, top.",
    },
    ru: {
      ctx: 'Фото должно стоять сверху карточки во всю ширину, а верхние углы — быть скруглёнными.',
      q: 'Какое слово пишется на пустое место?',
      opts: ['card-img-top', 'card-top-img', 'img-thumbnail', 'card-body'],
      why: 'card-img-top растягивает фото на ширину карточки и скругляет верхние углы, как у карточки. Порядок частей слова — как на сайте: card, img, top.',
    },
    en: {
      ctx: 'The photo should sit at the top of the card, full width, with rounded top corners.',
      q: 'Which word goes in the empty spot?',
      opts: ['card-img-top', 'card-top-img', 'img-thumbnail', 'card-body'],
      why: 'card-img-top stretches the photo to the card’s width and rounds its top corners like the card. The word goes in the site’s order: card, img, top.',
    },
  },
  {
    id: 'bootstrap_l05_q03',
    difficulty: 'easy',
    tags: ['copy', 'card-title'],
    mono: false,
    sort: false,
    vis: {
      code: '<div class="card-body">\n  <h4 class="card-title">Card title</h4>\n  <p class="card-text">Some quick example text</p>\n</div>',
      mark: [2],
    },
    uz: {
      ctx: "Bu saytdan nusxalangan kartochkaning bir qismi. Sarlavhada robotning nomi turishi kerak.",
      q: 'Robot nomini qayerga yozasiz?',
      opts: ['Card title yozuvi o\'rniga', "class ichiga, card-title o'rniga", 'h4 tegining oldiga, alohida qatorga', 'p tegining class ichiga'],
      why: "Moslash degani saytdagi matnni o'zingiznikiga almashtirish. Card title — namunadagi matn, uning o'rniga robot nomi yoziladi. class ichidagi so'z esa qoladi.",
    },
    ru: {
      ctx: 'Это часть карточки, скопированной с сайта. В заголовке должно стоять имя робота.',
      q: 'Куда ты пишешь имя робота?',
      opts: ['Вместо текста Card title', 'В class, вместо card-title', 'Перед тегом h4, отдельной строкой', 'В class тега p'],
      why: 'Настроить под себя — значит заменить текст сайта своим. Card title — текст примера, вместо него пишут имя робота. А слово в class остаётся.',
    },
    en: {
      ctx: 'This is part of a card copied from the site. The title should show the robot’s name.',
      q: 'Where do you write the robot’s name?',
      opts: ['Instead of the text Card title', 'In class, instead of card-title', 'Before the h4 tag, on its own line', 'In the class of the p tag'],
      why: 'Adapting means replacing the site’s text with your own. Card title is the example text, so the robot’s name goes there. The word in class stays.',
    },
  },
  {
    id: 'bootstrap_l05_q04',
    difficulty: 'easy',
    tags: ['copy', 'theme'],
    mono: false,
    sort: false,
    vis: { code: '<a class="btn-solid theme-primary">Go somewhere</a>', page: true },
    uz: {
      ctx: "Saytdan olingan kartochkada ko'k «Go somewhere» tugmasi bor. Sizga yashil «Batafsil» tugmasi kerak.",
      q: "Nimani o'zgartirasiz?",
      opts: ['theme-primary → theme-success, matn → Batafsil', 'btn-solid → btn-success, matn → Batafsil', 'Kartochkaga theme-success qo\'shaman', 'a tegini button tegiga almashtiraman'],
      why: "Tugma rangini theme so'zi beradi: primary ko'k, success yashil. btn-success — beshinchi versiyadagi eski nom, oltinchi versiyada ishlamaydi.",
    },
    ru: {
      ctx: 'В карточке с сайта синяя кнопка «Go somewhere». Тебе нужна зелёная кнопка «Подробнее».',
      q: 'Что ты меняешь?',
      opts: ['theme-primary → theme-success, текст → Подробнее', 'btn-solid → btn-success, текст → Подробнее', 'Добавляю карточке theme-success', 'Меняю тег a на тег button'],
      why: 'Цвет кнопки задаёт слово theme: primary — синий, success — зелёный. btn-success — старое имя из 5-й версии, в 6-й не работает.',
    },
    en: {
      ctx: 'The card from the site has a blue “Go somewhere” button. You need a green “More” button.',
      q: 'What do you change?',
      opts: ['theme-primary → theme-success, text → More', 'btn-solid → btn-success, text → More', 'I add theme-success to the card', 'I change the a tag to a button tag'],
      why: 'A button’s color comes from the theme word: primary is blue, success is green. btn-success is an old name from version 5; it doesn’t work in version 6.',
    },
  },
  {
    id: 'bootstrap_l05_q05',
    difficulty: 'medium',
    tags: ['site', 'copy'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Card sahifasidagi birinchi misolning kodi uzun: rasm, sarlavha, matn, tugma.",
      q: 'Bu kodni qanday olgan qulay?',
      opts: ['Kod burchagidagi nusxa olish belgisini bosib', 'Har bir qatorni qo\'lda qayta yozib', 'Faqat birinchi qatorni nusxalab', 'Misol rasmini sahifaga qo\'yib'],
      why: "Nusxa olish belgisi butun kodni birdaniga oladi, hech bir harf tushib qolmaydi. Keyin uni body ichiga qo'yamiz va o'zimizga moslaymiz.",
    },
    ru: {
      ctx: 'Код первого примера на странице Card длинный: фото, заголовок, текст, кнопка.',
      q: 'Как удобнее всего его взять?',
      opts: ['Нажать значок копирования в углу кода', 'Перепечатать каждую строку вручную', 'Скопировать только первую строку', 'Вставить на страницу картинку примера'],
      why: 'Значок копирования берёт весь код сразу, и ни одна буква не потеряется. Потом вставляем его в body и настраиваем под себя.',
    },
    en: {
      ctx: 'The code of the first example on the Card page is long: photo, title, text, button.',
      q: 'What’s the handiest way to take it?',
      opts: ['Click the copy icon in the code’s corner', 'Retype every line by hand', 'Copy only the first line', 'Put a picture of the example on the page'],
      why: 'The copy icon takes all the code at once, and not a single letter gets lost. Then we paste it into body and adapt it.',
    },
  },
  {
    id: 'bootstrap_l05_q06',
    difficulty: 'medium',
    tags: ['card', 'card-img-top'],
    mono: false,
    sort: false,
    vis: {
      code: L3c((i) => '<div class="card">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">${NAME}</h4>\n    <p class="card-text">${DESC[i]}</p>\n  </div>\n</div>`),
    },
    uz: {
      ctx: "Kartochkaga tepada turadigan rasm qo'shmoqchisiz: <img class=\"card-img-top\">.",
      q: 'img qatorini qayerga qo\'yasiz?',
      opts: ["card qatoridan keyin, card-body qatoridan oldin", 'card-body ichiga, matndan keyin', "card qatoridan oldin, kartochkadan tashqariga", 'Eng oxirgi yopuvchi div tegidan keyin'],
      why: "Kartochkada tartib tepadan pastga: oldin rasm, keyin card-body ichida nom, matn va tugma. Rasm card ichida turishi kerak, aks holda u ramkadan tashqarida qoladi.",
    },
    ru: {
      ctx: 'Ты добавляешь в карточку фото, которое стоит сверху: <img class="card-img-top">.',
      q: 'Куда ты ставишь строку img?',
      opts: ['После строки card, перед строкой card-body', 'Внутрь card-body, после текста', 'Перед строкой card, вне карточки', 'После последнего закрывающего div'],
      why: 'В карточке порядок сверху вниз: сначала фото, потом внутри card-body имя, текст и кнопка. Фото должно быть внутри card, иначе оно окажется за рамкой.',
    },
    en: {
      ctx: 'You’re adding a photo that sits at the top of the card: <img class="card-img-top">.',
      q: 'Where do you put the img line?',
      opts: ['After the card line, before card-body', 'Inside card-body, after the text', 'Before the card line, outside the card', 'After the very last closing div'],
      why: 'A card goes top to bottom: the photo first, then name, text and button inside card-body. The photo must be inside card, or it ends up outside the frame.',
    },
  },
  {
    id: 'bootstrap_l05_q07',
    difficulty: 'medium',
    tags: ['src', 'copy'],
    mono: false,
    sort: false,
    vis: {
      code: '<div class="card">\n  <img src="robot" class="card-img-top" alt="Robo">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">${NAME}</h4>\n  </div>\n</div>`,
      page: true,
    },
    uz: {
      ctx: "Saytingiz yonida robot.png fayli turibdi. Kartochkada esa rasm o'rnida buzilgan belgi.",
      q: 'Rasm nega chiqmadi?',
      opts: ["Fayl nomida .png qismi yo'q", 'src o\'rniga href yozish kerak', 'card-img-top rasmni yashirib qo\'ydi', 'alt atributi rasmni to\'sib qo\'ydi'],
      why: "Brauzer faylni to'liq nomi bilan, oxiridagi .png bilan qidiradi. robot degan fayl yo'q, robot.png bor. src atributiga robot.png yoziladi.",
    },
    ru: {
      ctx: 'Рядом с сайтом лежит файл robot.png. А в карточке вместо фото — значок сломанной картинки.',
      q: 'Почему фото не появилось?',
      opts: ['В имени файла нет .png', 'Вместо src нужно писать href', 'card-img-top спрятал картинку', 'Атрибут alt закрыл картинку'],
      why: 'Браузер ищет файл по полному имени, с .png на конце. Файла robot нет, есть robot.png. Правильно: src="robot.png".',
    },
    en: {
      ctx: 'The file robot.png sits next to the site. But the card shows a broken image icon.',
      q: 'Why didn’t the photo appear?',
      opts: ['The file name has no .png', 'It should be href instead of src', 'card-img-top hid the picture', 'The alt attribute covered the picture'],
      why: 'The browser looks for the file by its full name, with .png at the end. There’s no file robot, there’s robot.png. Correct: src="robot.png".',
    },
  },
  {
    id: 'bootstrap_l05_q08',
    difficulty: 'medium',
    tags: ['copy', 'card'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Card namunasini nusxaladingiz va uni o'z robotingizga moslayapsiz.",
      q: "Qaysi qismni o'zgartirmaysiz?",
      opts: ["card va card-body so'zlarini", 'src ichidagi uchta nuqtani', 'Card title yozuvini', 'Tugmadagi yozuvni'],
      why: "card va card-body — kartochkaning o'zi, ular joyida qoladi. Moslash degani rasm faylini, matnni va rangni o'zingizniki qilish.",
    },
    ru: {
      ctx: 'Ты скопировал пример Card и настраиваешь его под своего робота.',
      q: 'Какую часть ты не меняешь?',
      opts: ['Слова card и card-body', 'Три точки в src', 'Текст Card title', 'Надпись на кнопке'],
      why: 'card и card-body — это сама карточка, они остаются на месте. Настроить под себя — значит сделать своими файл фото, текст и цвет.',
    },
    en: {
      ctx: 'You copied the Card example and are adapting it to your robot.',
      q: 'Which part do you leave unchanged?',
      opts: ['The words card and card-body', 'The three dots in src', 'The text Card title', 'The text on the button'],
      why: 'card and card-body are the card itself, so they stay. Adapting means making the photo file, the text and the color your own.',
    },
  },
  {
    id: 'bootstrap_l05_q09',
    difficulty: 'medium',
    tags: ['theme'],
    mono: false,
    sort: false,
    vis: {
      code: L3c((i) => '<div class="card theme-danger">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">Robo-3</h4>\n    <a class="btn-solid theme-primary">${['Batafsil', 'Подробнее', 'More'][i]}</a>\n  </div>\n</div>`),
      page: true,
    },
    uz: {
      ctx: "Kodi tugmani qizil qilmoqchi edi va kartochkaga theme-danger yozdi. Tugma esa ko'k qoldi.",
      q: "Nega tugma ko'k qoldi?",
      opts: ["Tugmaning o'z rang so'zi bor: theme-primary", "theme-danger faqat sarlavhani bo'yaydi", "Kartochkaga rang so'zi yozib bo'lmaydi", 'Tugma card-body ichida, rang yetib bormaydi'],
      why: "Rang so'zi o'zi turgan tegni bo'yaydi. Tugmada o'zining theme-primary so'zi bor, shuning uchun u ko'k. Qizil tugma uchun theme-danger tugmaning o'ziga yoziladi.",
    },
    ru: {
      ctx: 'Коди хотел сделать кнопку красной и написал карточке theme-danger. А кнопка осталась синей.',
      q: 'Почему кнопка осталась синей?',
      opts: ['У кнопки своё слово цвета: theme-primary', 'theme-danger красит только заголовок', 'Карточке нельзя писать слово цвета', 'Кнопка внутри card-body, цвет не доходит'],
      why: 'Слово цвета красит тот тег, у которого стоит. У кнопки своё слово theme-primary, поэтому она синяя. Для красной кнопки theme-danger пишут самой кнопке.',
    },
    en: {
      ctx: 'Kodi wanted a red button and gave the card theme-danger. But the button stayed blue.',
      q: 'Why did the button stay blue?',
      opts: ['The button has its own color word: theme-primary', 'theme-danger only colors the title', 'A card can’t take a color word', 'The button is in card-body; color can’t reach it'],
      why: 'A color word colors the tag it’s on. The button has its own theme-primary, so it’s blue. For a red button, theme-danger goes on the button itself.',
    },
  },
  {
    id: 'bootstrap_l05_q10',
    difficulty: 'hard',
    tags: ['d-flex', 'card'],
    mono: false,
    sort: false,
    vis: {
      code: L3c((i) => '<div class="d-flex gap-3">\n  <div class="card card-body">Bip</div>\n  <div class="card card-body">\n'
        + `    ${['Piksel<br>rasm chizadi<br>qo\'shiq aytadi', 'Пиксель<br>рисует<br>и поёт песни', 'Pixel<br>draws pictures<br>and sings songs'][i]}\n`
        + '  </div>\n  <div class="card card-body">Zum</div>\n</div>'),
      page: true,
    },
    uz: {
      ctx: "Uchta robot kartochkasi qatorda. Ikkinchisida matn uch qator, qolganlarida bitta so'z.",
      q: 'Nega uchalasi bir xil balandlikda?',
      opts: ["d-flex bolalarni balandlik bo'yicha cho'zadi", 'card so\'zi balandlikni tenglashtiradi', 'card-body matnni bir xil qiladi', 'gap-3 balandlikni tenglashtiradi'],
      why: "d-flex ichida bolalar odatda ko'ndalang o'q bo'ylab cho'ziladi, qatorda bu balandlik. Shuning uchun hamma kartochka eng baland kartochkadek bo'ladi.",
    },
    ru: {
      ctx: 'Три карточки роботов стоят в ряд. У второй текст в три строки, у остальных одно слово.',
      q: 'Почему все три одной высоты?',
      opts: ['d-flex растягивает детей по высоте', 'Слово card выравнивает высоту', 'card-body делает текст одинаковым', 'gap-3 выравнивает высоту'],
      why: 'Внутри d-flex дети обычно растягиваются по поперечной оси, а в ряду это высота. Поэтому все карточки становятся высотой с самую высокую.',
    },
    en: {
      ctx: 'Three robot cards stand in a row. The second has three lines of text, the others one word.',
      q: 'Why are all three the same height?',
      opts: ['d-flex stretches the children by height', 'The word card evens out the height', 'card-body makes the text the same', 'gap-3 evens out the height'],
      why: 'Inside d-flex the children usually stretch along the cross axis, and in a row that’s height. So every card becomes as tall as the tallest one.',
    },
  },
  {
    id: 'bootstrap_l05_q11',
    difficulty: 'hard',
    tags: ['card-title'],
    mono: false,
    sort: false,
    vis: {
      code: L3c((i) => `<div class="card-body">\n  <h4 class="card-titel">Robo-2</h4>\n  <p class="card-text">${['Rasm chizadi', 'Рисует картины', 'Draws pictures'][i]}</p>\n</div>`),
      mark: [2],
    },
    uz: {
      ctx: "Kodi card-title so'zini adashib card-titel deb yozdi.",
      q: "Sahifada nima o'zgaradi?",
      opts: ['Hech narsa: card-title shunchaki nom', 'Sarlavha oddiy matnga aylanadi', "Kartochkaning ramkasi yo'qoladi", 'Sarlavha kartochkadan chiqib ketadi'],
      why: "Oltinchi versiyada card-title va card-text o'z qoidasiga ega emas, ular qismning nomi. Ko'rinishni card va card-body beradi. Baribir nomni saytdagidek yozgan yaxshi.",
    },
    ru: {
      ctx: 'Коди по ошибке написал card-titel вместо card-title.',
      q: 'Что изменится на странице?',
      opts: ['Ничего: card-title — просто имя', 'Заголовок станет обычным текстом', 'У карточки пропадёт рамка', 'Заголовок вылезет из карточки'],
      why: 'В шестой версии у card-title и card-text нет своих правил — это имена частей. Вид дают card и card-body. Но имя всё равно лучше писать как на сайте.',
    },
    en: {
      ctx: 'Kodi mistakenly wrote card-titel instead of card-title.',
      q: 'What changes on the page?',
      opts: ['Nothing: card-title is just a name', 'The title becomes plain text', 'The card loses its frame', 'The title sticks out of the card'],
      why: 'In version 6, card-title and card-text have no rules of their own; they’re part names. The look comes from card and card-body. Still, write the name as on the site.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'bootstrap_l05_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['card'],
    mono: true,
    answer: ['card'],
    vis: {
      code: '<div class="___">\n  <img src="robot.png" class="card-img-top">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">${NAME}</h4>\n  </div>\n</div>`,
    },
    uz: {
      ctx: "Robot kartochkasida ramka ham, yumaloq burchaklar ham yo'q.",
      q: "Tashqi div tegiga bitta so'z yozing.",
      why: "card — kartochkaning o'zi: ramka va yumaloq burchaklar. Rasm va card-body uning ichida turadi.",
    },
    ru: {
      ctx: 'У карточки робота нет ни рамки, ни скруглённых углов.',
      q: 'Впиши одно слово для внешнего div.',
      why: 'card — это сама карточка: рамка и скруглённые углы. Фото и card-body лежат внутри неё.',
    },
    en: {
      ctx: 'The robot card has no frame and no rounded corners.',
      q: 'Type one word for the outer div.',
      why: 'card is the card itself: the frame and the rounded corners. The photo and card-body sit inside it.',
    },
  },
  {
    id: 'bootstrap_l05_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['theme', 'copy'],
    mono: true,
    answer: ['theme-danger'],
    vis: { code: L3c((i) => `<a class="btn-solid ___">${['Batafsil', 'Подробнее', 'More'][i]}</a>`) },
    uz: {
      ctx: "Saytdan olingan kartochkada tugma ko'k: btn-solid theme-primary. Sizga qizil tugma kerak.",
      q: "Bo'sh joyga rang so'zini yozing.",
      why: "Tugma rangini theme so'zi beradi, qizil esa danger: theme-danger. btn-solid qoladi, u tugmaning to'liq bo'yalgan uslubi.",
    },
    ru: {
      ctx: 'В карточке с сайта синяя кнопка: btn-solid theme-primary. Тебе нужна красная кнопка.',
      q: 'Впиши на пустое место слово цвета.',
      why: 'Цвет кнопки задаёт слово theme, а красный — это danger: theme-danger. btn-solid остаётся: это стиль залитой кнопки.',
    },
    en: {
      ctx: 'The card from the site has a blue button: btn-solid theme-primary. You need a red one.',
      q: 'Type the color word in the empty spot.',
      why: 'A button’s color comes from the theme word, and red is danger: theme-danger. btn-solid stays: it’s the filled button style.',
    },
  },
  {
    id: 'bootstrap_l05_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['card-subtle'],
    mono: true,
    answer: ['card-subtle'],
    vis: {
      code: '<div class="card ___ theme-success">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">${NAME}</h4>\n  </div>\n</div>`,
    },
    uz: {
      ctx: "Kartochka yashil bo'lsin, lekin yorqin emas, yumshoq, och rangda.",
      q: "Bo'sh joyga bitta so'z yozing.",
      why: "Kartochka rangini theme so'zi beradi, yumshoq rang uchun esa yana card-subtle qo'shiladi. Bu so'z Card sahifasida, ranglar misolida bor.",
    },
    ru: {
      ctx: 'Карточка должна быть зелёной, но не яркой, а мягкого, светлого цвета.',
      q: 'Впиши на пустое место одно слово.',
      why: 'Цвет карточки задаёт слово theme, а для мягкого цвета добавляют ещё card-subtle. Это слово есть на странице Card, в примерах цветов.',
    },
    en: {
      ctx: 'The card should be green, but not bright: a soft, light color.',
      q: 'Type one word in the empty spot.',
      why: 'A card’s color comes from the theme word, and for a soft color you add card-subtle. You’ll find it on the Card page, in the color examples.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l05_q15',
    type: 'build',
    difficulty: 'easy',
    tags: ['card-text'],
    pieces: ['<p', ' class="card-text"', '>', { uz: "Futbol o'ynaydi", ru: 'Играет в футбол', en: 'Plays football' }, '</p>'],
    extra: [' class="card-body"', '</h4>'],
    vis: { code: `<div class="card-body">\n  <h4 class="card-title">${NAME}</h4>\n  ___\n</div>` },
    uz: {
      ctx: "Nom ostida robot haqida matn bo'lsin, saytdagi namunadagidek.",
      q: "Bo'laklarni tartib bilan bosib, matn qatorini yig'ing",
      why: "Namunada matn p tegida, card-text nomi bilan turadi. card-body butun ichki qismni o'raydigan div uchun, p tegi esa o'zining yopuvchi tegi bilan yopiladi.",
    },
    ru: {
      ctx: 'Под именем должен быть текст о роботе, как в примере на сайте.',
      q: 'Нажимай кусочки по порядку и собери строку текста',
      why: 'В примере текст стоит в теге p с именем card-text. card-body — для div, который обнимает всю внутреннюю часть, а p закрывается своим закрывающим тегом.',
    },
    en: {
      ctx: 'Under the name there should be text about the robot, as in the site’s example.',
      q: 'Tap the pieces in order to build the text line',
      why: 'In the example the text is in a p tag named card-text. card-body is for the div that wraps the whole inside, and p closes with its own closing tag.',
    },
  },
  {
    id: 'bootstrap_l05_q16',
    type: 'build',
    difficulty: 'medium',
    tags: ['card-body'],
    pieces: ['<div', ' class="card-body"', '>'],
    extra: [' class="card-text"', ' class="body"'],
    vis: { code: `<div class="card">\n  <img src="robot.png" class="card-img-top">\n  ___\n    <h4 class="card-title">${NAME}</h4>\n  </div>\n</div>` },
    uz: {
      ctx: "Robot nomi kartochka ramkasiga yopishib qoldi. Uning atrofida ichki joy bo'lsin.",
      q: "Bo'laklarni bosib, ichki qismning ochuvchi tegini yig'ing",
      why: "Ichki joyni card-body beradi: u matn atrofida bo'sh joy qoldiradi va ichidagilarni ustun qilib teradi. card-text bu ishni qilmaydi, body degan so'z esa Bootstrapda yo'q.",
    },
    ru: {
      ctx: 'Имя робота прилипло к рамке карточки. Вокруг него нужен отступ внутри.',
      q: 'Нажимай кусочки и собери открывающий тег внутренней части',
      why: 'Отступ внутри даёт card-body: он оставляет место вокруг текста и ставит всё внутри столбиком. card-text этого не делает, а слова body в Bootstrap нет.',
    },
    en: {
      ctx: 'The robot’s name is stuck to the card’s frame. It needs space around it inside.',
      q: 'Tap the pieces to build the opening tag of the inner part',
      why: 'The inner space comes from card-body: it leaves room around the text and stacks everything inside. card-text doesn’t do that, and Bootstrap has no word body.',
    },
  },
  {
    id: 'bootstrap_l05_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['theme', 'card'],
    line: 1,
    vis: {
      code: L3c((i) => '<div class="card card-success">\n  <img src="robot.png" class="card-img-top">\n  <div class="card-body">\n'
        + `    <h4 class="card-title">${['Yashil robot', 'Зелёный робот', 'Green robot'][i]}</h4>\n  </div>\n</div>`),
      page: true,
    },
    uz: {
      ctx: "Kartochka yashil bo'lishi kerak edi, lekin u oddiy, kulrang ramkada qoldi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "1-qatorda card-success turibdi, bunday so'z yo'q: kartochka rangi ham theme so'zi bilan beriladi. To'g'risi: card theme-success.",
    },
    ru: {
      ctx: 'Карточка должна была стать зелёной, а осталась обычной, с серой рамкой.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 1 стоит card-success, а такого слова нет: цвет карточки тоже задаёт слово theme. Правильно: card theme-success.',
    },
    en: {
      ctx: 'The card was supposed to turn green, but it stayed plain, with a gray frame.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 1 has card-success, and there’s no such word: a card’s color is a theme word too. Correct: card theme-success.',
    },
  },
  {
    id: 'bootstrap_l05_q18',
    type: 'tap',
    difficulty: 'easy',
    tags: ['src', 'copy'],
    answer: '2',
    vis: {
      page: L3c((i) => '<div class="d-flex gap-3">\n' + tapCard('robot.png', '1', i) + '\n' + tapCard('...', '2', i) + '\n'
        + tapCard('tort.png', '3', i) + '\n</div>'),
    },
    uz: {
      ctx: "Uchta kartochka saytdan nusxalangan. Bittasida src atributi namunadagidek qolib ketgan.",
      q: "src ichida uchta nuqta qolgan kartochkani bosing",
      why: "Saytdagi misolda src ichida uchta nuqta turadi, bu fayl emas, to'ldirgich. Uni o'zgartirmasangiz, rasm o'rnida buzilgan belgi chiqadi.",
    },
    ru: {
      ctx: 'Три карточки скопированы с сайта. В одной атрибут src остался как в примере.',
      q: 'Нажми на карточку, где в src остались три точки',
      why: 'В примере на сайте в src стоят три точки — это не файл, а заглушка. Если её не заменить, вместо фото будет значок сломанной картинки.',
    },
    en: {
      ctx: 'Three cards were copied from the site. In one, the src attribute stayed as in the example.',
      q: 'Tap the card where src still has three dots',
      why: 'In the site’s example src holds three dots: not a file, just a placeholder. If you don’t replace it, a broken image icon shows instead of the photo.',
    },
  },
];
