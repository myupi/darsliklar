// =============================================================================
// БАНК ТРЕНАЖЁРА CSS · урок 11 «Flexbox: выравнивание» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: justify-content — вдоль главной оси (flex-end — к правому краю ряда, space-between — к краям),
// align-items — вдоль поперечной (по умолчанию stretch, flex-start — своей высоты наверху, flex-end — внизу,
// center); центр по двум осям — оба свойства; в column justify-content центрует по высоте; align-items без лишней
// высоты полки не виден; gap — только между соседями (4 карточки — 3 промежутка, в столбике — сверху вниз), с px;
// flex-wrap: wrap — новая строка; middle вместо center.
// Ситуации тестов курса (tools/webtest/css/l11.jsx) не повторяются. Формат — FORMAT.md. Апостроф в узбекском — ASCII «'».
// Словарь урока: tekislash, asosiy o'q, ko'ndalang o'q, boshi, o'rtasi, oxiri, oraliq, yangi qator, cho'zish.
// =============================================================================

// Основа страниц (невидима ученику). display: flex и выравнивание — всегда в видимом CSS, если вопрос о них.
const SHELF = '.javon{background:#FFF1EC;border:2px dashed #FDBA74;padding:6px}'
  + '.karta{background:#FA4F28;color:#fff;font:bold 15px Arial;padding:8px 10px;margin:3px;border-radius:8px}';
const cards = (cls, a, b, c) => `<div class="${cls}">\n  <div class="karta">${a}</div>\n  <div class="karta">${b}</div>\n  <div class="karta">${c}</div>\n</div>`;

export default [
  {
    id: 'css_l11_q01',
    difficulty: 'easy',
    tags: ['justify-content'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Flex qutida ikki o'q bor: asosiy va ko'ndalang.",
      q: "justify-content qaysi o'q bo'ylab tekislaydi?",
      opts: ["Asosiy o'q bo'ylab", "Ko'ndalang o'q bo'ylab", "Ikkala o'q bo'ylab birdan", 'Doim tepadan pastga'],
      why: "justify-content bolalarni asosiy o'q bo'ylab, ya'ni to'q sariq strelka yo'nalishida tekislaydi. Ko'ndalang o'q bo'ylab esa align-items ishlaydi.",
    },
    ru: {
      ctx: 'У flex-коробки две оси: главная и поперечная.',
      q: 'Вдоль какой оси выравнивает justify-content?',
      opts: ['Вдоль главной оси', 'Вдоль поперечной оси', 'Вдоль обеих осей сразу', 'Всегда сверху вниз'],
      why: 'justify-content выравнивает детей вдоль главной оси — по оранжевой стрелке. Вдоль поперечной оси работает align-items.',
    },
    en: {
      ctx: 'A flex box has two axes: the main axis and the cross axis.',
      q: 'Along which axis does justify-content align?',
      opts: ['Along the main axis', 'Along the cross axis', 'Along both axes at once', 'Always top to bottom'],
      why: 'justify-content aligns the children along the main axis, the orange arrow. Along the cross axis, align-items does the job.',
    },
  },
  {
    id: 'css_l11_q02',
    difficulty: 'easy',
    tags: ['justify-content', 'flex-end'],
    mono: true,
    sort: false,
    vis: {
      css: '.panel {\n  display: flex;\n  justify-content: ___;\n}',
      html: {
        uz: '<div class="panel">\n  <button>Qayta</button>\n  <button>Davom</button>\n</div>',
        ru: '<div class="panel">\n  <button>Заново</button>\n  <button>Дальше</button>\n</div>',
        en: '<div class="panel">\n  <button>Retry</button>\n  <button>Next</button>\n</div>',
      },
      base: '.panel{background:#EEF2FF;border:2px dashed #A5B4FC;padding:6px}'
        + 'button{background:#FA4F28;color:#fff;border:0;border-radius:6px;padding:7px 12px;margin:3px;font:bold 14px Arial}',
      goal: '.panel { display: flex; justify-content: flex-end; }',
    },
    uz: {
      ctx: "O'yin paneli: «Qayta» va «Davom» tugmalari o'ng chetga yopishsin, rasmdagidek.",
      q: "Bo'sh joyga qaysi qiymat yoziladi?",
      opts: ['flex-end', 'flex-start', 'center', 'space-between'],
      why: "flex-end — asosiy o'qning oxiri. Qatorda asosiy o'q chapdan o'ngga ketadi, demak uning oxiri o'ng chetda.",
    },
    ru: {
      ctx: 'Панель игры: кнопки «Заново» и «Дальше» должны прижаться к правому краю, как на картинке.',
      q: 'Какое значение на пустом месте?',
      opts: ['flex-end', 'flex-start', 'center', 'space-between'],
      why: 'flex-end — конец главной оси. В ряду главная ось идёт слева направо, значит, её конец — у правого края.',
    },
    en: {
      ctx: 'A game panel: the “Retry” and “Next” buttons should hug the right edge, like in the picture.',
      q: 'Which value goes in the empty spot?',
      opts: ['flex-end', 'flex-start', 'center', 'space-between'],
      why: 'flex-end is the end of the main axis. In a row the main axis runs left to right, so its end is at the right edge.',
    },
  },
  {
    id: 'css_l11_q03',
    difficulty: 'easy',
    tags: ['gap'],
    mono: false,
    sort: false,
    vis: { css: '.galereya {\n  display: flex;\n  gap: 10px;\n}' },
    uz: {
      ctx: "Hayvonot bog'i galereyasida to'rtta rasm qatorda turibdi.",
      q: 'gap: 10px nima qiladi?',
      opts: ["Rasmlar orasiga 10px qo'yadi", "Galereya atrofiga 10px qo'yadi", "Har bir rasm ichiga 10px qo'yadi", 'Har bir rasmni 10px kengaytiradi'],
      why: "gap — oraliq: u faqat qo'shni bolalar orasiga bo'sh joy qo'yadi. Galereyaning chetlari va rasmlarning o'zi o'zgarmaydi.",
    },
    ru: {
      ctx: 'В галерее зоопарка четыре картинки стоят в ряд.',
      q: 'Что делает gap: 10px?',
      opts: ['Ставит 10px между картинками', 'Ставит 10px вокруг галереи', 'Ставит 10px внутри картинок', 'Делает картинки шире на 10px'],
      why: 'gap — промежуток: он ставит пустое место только между соседними детьми. Края галереи и сами картинки не меняются.',
    },
    en: {
      ctx: 'In the zoo gallery, four pictures stand in a row.',
      q: 'What does gap: 10px do?',
      opts: ['Puts 10px between the pictures', 'Puts 10px around the gallery', 'Puts 10px inside each picture', 'Makes each picture 10px wider'],
      why: 'gap only puts empty space between neighboring children. The gallery’s edges and the pictures themselves don’t change.',
    },
  },
  {
    id: 'css_l11_q04',
    difficulty: 'easy',
    tags: ['align-items', 'stretch'],
    mono: true,
    sort: false,
    vis: {
      css: '.javon {\n  display: flex;\n  height: 100px;\n}',
      html: {
        uz: cards('javon', 'Tort', 'Muzqaymoq', 'Pishiriq'),
        ru: cards('javon', 'Торт', 'Мороженое', 'Пирожок'),
        en: cards('javon', 'Cake', 'Ice cream', 'Pie'),
      },
      base: SHELF,
    },
    uz: {
      ctx: "Kafe javoni: align-items yozilmagan, lekin kartochkalar javonning butun bo'yiga cho'zildi.",
      q: 'Hozir align-items qaysi qiymatda ishlayapti?',
      opts: ['stretch', 'center', 'flex-start', 'flex-end'],
      why: "align-items yozilmasa, u odatda stretch, ya'ni cho'zish: bolalar ko'ndalang o'q bo'ylab qutining butun bo'yini egallaydi.",
    },
    ru: {
      ctx: 'Полка кафе: align-items не написан, а карточки вытянулись на всю высоту полки.',
      q: 'Какое значение align-items работает сейчас?',
      opts: ['stretch', 'center', 'flex-start', 'flex-end'],
      why: 'Если align-items не написан, он по умолчанию stretch — растянуть: дети занимают всю высоту коробки по поперечной оси.',
    },
    en: {
      ctx: 'A café shelf: align-items isn’t written, but the cards stretched to the shelf’s full height.',
      q: 'Which align-items value is working now?',
      opts: ['stretch', 'center', 'flex-start', 'flex-end'],
      why: 'Without align-items, it’s stretch by default: the children fill the box’s whole height along the cross axis.',
    },
  },
  {
    id: 'css_l11_q05',
    difficulty: 'medium',
    tags: ['gap'],
    mono: false,
    sort: true,
    vis: null,
    uz: {
      ctx: "Javonda to'rtta kartochka bor, javonga gap: 20px yozildi.",
      q: 'Kartochkalar orasida nechta oraliq paydo bo\'ladi?',
      opts: ['3', '4', '5', '2'],
      why: "gap faqat qo'shni kartochkalar orasiga qo'yiladi, javon chetlariga emas. To'rtta kartochka orasida uchta oraliq bor.",
    },
    ru: {
      ctx: 'На полке четыре карточки, полке написали gap: 20px.',
      q: 'Сколько промежутков появится между карточками?',
      opts: ['3', '4', '5', '2'],
      why: 'gap ставится только между соседними карточками, а не у краёв полки. Между четырьмя карточками три промежутка.',
    },
    en: {
      ctx: 'The shelf has four cards, and the shelf got gap: 20px.',
      q: 'How many gaps will appear between the cards?',
      opts: ['3', '4', '5', '2'],
      why: 'gap only goes between neighboring cards, not at the shelf’s edges. Four cards have three gaps between them.',
    },
  },
  {
    id: 'css_l11_q06',
    difficulty: 'medium',
    tags: ['align-items', 'flex-start'],
    mono: true,
    sort: false,
    vis: {
      css: '.jamoa {\n  display: flex;\n  height: 100px;\n  ___\n}',
      html: {
        uz: cards('jamoa', 'Darvozabon', 'Himoyachi', 'Hujumchi'),
        ru: cards('jamoa', 'Вратарь', 'Защитник', 'Нападающий'),
        en: cards('jamoa', 'Goalie', 'Defender', 'Striker'),
      },
      base: '.jamoa{background:#ECFDF5;border:2px dashed #6EE7B7;padding:6px}'
        + '.karta{background:#059669;color:#fff;font:bold 14px Arial;padding:8px;margin:3px;border-radius:8px}',
    },
    uz: {
      ctx: "Futbolchilar kartochkalari javon bo'yiga cho'zilgan. Ular o'z bo'yida qolib, tepada tursin.",
      q: "Bo'sh qatorga nima yoziladi?",
      opts: ['align-items: flex-start;', 'justify-content: flex-start;', 'align-items: stretch;', 'flex-direction: column;'],
      why: "Qatorda tepadan pastga — bu ko'ndalang o'q, uni align-items tekislaydi. flex-start kartochkalarni cho'zmaydi va o'qning boshiga, ya'ni tepaga qo'yadi.",
    },
    ru: {
      ctx: 'Карточки футболистов вытянулись на всю высоту. Они должны остаться своей высоты и стоять наверху.',
      q: 'Что написать в пустую строку?',
      opts: ['align-items: flex-start;', 'justify-content: flex-start;', 'align-items: stretch;', 'flex-direction: column;'],
      why: 'В ряду сверху вниз — это поперечная ось, её выравнивает align-items. flex-start не растягивает карточки и ставит их в начало оси — наверх.',
    },
    en: {
      ctx: 'The football player cards stretched to full height. They should keep their own height and sit at the top.',
      q: 'What goes on the empty line?',
      opts: ['align-items: flex-start;', 'justify-content: flex-start;', 'align-items: stretch;', 'flex-direction: column;'],
      why: 'In a row, top to bottom is the cross axis, and align-items aligns it. flex-start doesn’t stretch the cards and puts them at the start of the axis: the top.',
    },
  },
  {
    id: 'css_l11_q07',
    difficulty: 'medium',
    tags: ['justify-content', 'align-items'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "O'yin ekrani — qator. «O'ynash» tugmasi ekranning qoq o'rtasida tursin: ham eniga, ham bo'yiga.",
      q: 'Ekranga qaysi ikki xususiyat center qiymati bilan yoziladi?',
      opts: ['justify-content va align-items', 'justify-content va text-align', 'align-items va flex-direction', 'flex-direction va text-align'],
      why: "Qatorda eni — asosiy o'q, uni justify-content tekislaydi. Bo'yi — ko'ndalang o'q, uni align-items tekislaydi. Ikkalasiga center yozilsa, tugma qoq o'rtada.",
    },
    ru: {
      ctx: 'Экран игры — ряд. Кнопка «Играть» должна стоять ровно в центре: и по ширине, и по высоте.',
      q: 'Какие два свойства со значением center нужны экрану?',
      opts: ['justify-content и align-items', 'justify-content и text-align', 'align-items и flex-direction', 'flex-direction и text-align'],
      why: 'В ряду ширина — главная ось, её выравнивает justify-content. Высота — поперечная ось, её выравнивает align-items. Оба center — и кнопка ровно в центре.',
    },
    en: {
      ctx: 'The game screen is a row. The “Play” button must sit right in the center, both across and up and down.',
      q: 'Which two properties with the value center does the screen need?',
      opts: ['justify-content and align-items', 'justify-content and text-align', 'align-items and flex-direction', 'flex-direction and text-align'],
      why: 'In a row, the width is the main axis, aligned by justify-content. The height is the cross axis, aligned by align-items. Both center, and the button is dead center.',
    },
  },
  {
    id: 'css_l11_q08',
    difficulty: 'medium',
    tags: ['gap', 'column'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Qo'shiqlar ro'yxati ustun bo'lib turibdi: flex-direction: column. Unga gap: 12px yozildi.",
      q: "Oraliqlar qayerda paydo bo'ladi?",
      opts: ["Qo'shiqlar orasida, tepadan pastga", "Faqat chap va o'ng chetlarda", 'Hech qayerda: gap faqat qatorda', "Butun ro'yxatning atrofida"],
      why: "gap qo'shni bolalar orasiga joy qo'yadi, yo'nalish qanday bo'lmasin. Ustunda bolalar tepadan pastga turadi, demak oraliqlar ham ular orasida.",
    },
    ru: {
      ctx: 'Список песен стоит столбиком: flex-direction: column. Ему написали gap: 12px.',
      q: 'Где появятся промежутки?',
      opts: ['Между песнями, сверху вниз', 'Только у левого и правого края', 'Нигде: gap бывает только в ряду', 'Вокруг всего списка'],
      why: 'gap ставит место между соседними детьми при любом направлении. В столбике дети идут сверху вниз — значит, и промежутки между ними.',
    },
    en: {
      ctx: 'A song list stands in a column: flex-direction: column. It got gap: 12px.',
      q: 'Where will the gaps appear?',
      opts: ['Between the songs, top to bottom', 'Only at the left and right edges', 'Nowhere: gap works only in a row', 'Around the whole list'],
      why: 'gap puts space between neighboring children in any direction. In a column the children go top to bottom, so the gaps sit between them.',
    },
  },
  {
    id: 'css_l11_q09',
    difficulty: 'medium',
    tags: ['justify-content', 'align-items'],
    mono: false,
    sort: false,
    vis: { css: '.javon {\n  display: flex;\n  height: 120px;\n  justify-content: flex-end;\n  align-items: flex-end;\n}' },
    uz: {
      ctx: 'Javon — qator. Unga ikkita flex-end yozildi.',
      q: 'Kartochkalar javonning qayerida turadi?',
      opts: ["O'ng pastki burchakda", 'Chap pastki burchakda', "O'ng yuqori burchakda", "O'ng chetda, o'rtada"],
      why: "justify-content: flex-end asosiy o'q oxiriga, ya'ni o'ngga suradi. align-items: flex-end ko'ndalang o'q oxiriga, ya'ni pastga tushiradi. Natijada — o'ng pastki burchak.",
    },
    ru: {
      ctx: 'Полка — ряд. Ей написали два flex-end.',
      q: 'Где на полке окажутся карточки?',
      opts: ['В правом нижнем углу', 'В левом нижнем углу', 'В правом верхнем углу', 'У правого края, посередине'],
      why: 'justify-content: flex-end двигает к концу главной оси — вправо. align-items: flex-end — к концу поперечной оси, вниз. Вместе — правый нижний угол.',
    },
    en: {
      ctx: 'The shelf is a row. It got two flex-end values.',
      q: 'Where on the shelf will the cards be?',
      opts: ['In the bottom right corner', 'In the bottom left corner', 'In the top right corner', 'At the right edge, in the middle'],
      why: 'justify-content: flex-end moves them to the end of the main axis: right. align-items: flex-end moves them to the end of the cross axis: down. Together: bottom right.',
    },
  },
  {
    id: 'css_l11_q10',
    difficulty: 'hard',
    tags: ['justify-content', 'column'],
    mono: false,
    sort: false,
    vis: { css: '.menyu {\n  display: flex;\n  flex-direction: column;\n  height: 300px;\n  justify-content: center;\n}' },
    uz: {
      ctx: "Kafe menyusi — ustun, bo'yi 300px.",
      q: 'Menyu bandlari qayerda turadi?',
      opts: ["Bo'yiga o'rtaga", "Eniga o'rtaga", 'Tepaga yopishadi', "Butun bo'yga cho'ziladi"],
      why: "Ustunda asosiy o'q tepadan pastga ketadi, justify-content esa asosiy o'q bo'ylab tekislaydi. Shuning uchun center bandlarni bo'yiga o'rtaga qo'yadi.",
    },
    ru: {
      ctx: 'Меню кафе — столбик высотой 300px.',
      q: 'Где встанут пункты меню?',
      opts: ['В середину по высоте', 'В середину по ширине', 'Прижмутся к верху', 'Растянутся на всю высоту'],
      why: 'В столбике главная ось идёт сверху вниз, а justify-content выравнивает вдоль главной оси. Поэтому center ставит пункты в середину по высоте.',
    },
    en: {
      ctx: 'The café menu is a column 300px tall.',
      q: 'Where will the menu items go?',
      opts: ['To the middle of the height', 'To the middle of the width', 'They stick to the top', 'They stretch to the full height'],
      why: 'In a column the main axis runs top to bottom, and justify-content aligns along the main axis. So center puts the items in the middle of the height.',
    },
  },
  {
    id: 'css_l11_q11',
    difficulty: 'hard',
    tags: ['align-items', 'height'],
    mono: false,
    sort: false,
    vis: {
      css: '.javon {\n  display: flex;\n  align-items: center;\n}',
      html: {
        uz: cards('javon', 'Merkuriy', 'Venera', 'Yer'),
        ru: cards('javon', 'Меркурий', 'Венера', 'Земля'),
        en: cards('javon', 'Mercury', 'Venus', 'Earth'),
      },
      base: SHELF,
    },
    uz: {
      ctx: "Kodi align-items: center yozdi, lekin sayyoralar avvalgidek turibdi.",
      q: "Nega hech narsa o'zgarmadi?",
      opts: ["Javonning bo'yi kartochkalarniki bilan teng", 'align-items faqat ustunda ishlaydi', 'align-items kartochkalarga yoziladi', 'center faqat justify-content uchun'],
      why: "align-items kartochkalarni tepadan pastga suradi. Javonning bo'yi kartochkalarniki bilan teng, ortiqcha joy yo'q. Javonga height berilsa, o'rta ko'rinadi.",
    },
    ru: {
      ctx: 'Коди написал align-items: center, а планеты стоят как раньше.',
      q: 'Почему ничего не изменилось?',
      opts: ['Полка такой же высоты, как карточки', 'align-items работает только в столбике', 'align-items пишут карточкам', 'center бывает только у justify-content'],
      why: 'align-items двигает карточки сверху вниз. Полка ровно такой высоты, как карточки, лишнего места нет. Дай полке height — и центр станет виден.',
    },
    en: {
      ctx: 'Kodi wrote align-items: center, but the planets stand just like before.',
      q: 'Why didn’t anything change?',
      opts: ['The shelf is as tall as the cards', 'align-items only works in a column', 'align-items goes on the cards', 'center is only for justify-content'],
      why: 'align-items moves the cards up and down. The shelf is exactly as tall as the cards, so there’s no spare room. Give the shelf a height and the center shows.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'css_l11_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['gap'],
    mono: true,
    answer: ['15px'],
    vis: { css: '.pitsalar {\n  display: flex;\n  gap: ___;\n}' },
    uz: {
      ctx: "Pitsa menyusi: kartochkalar orasida 15 piksel bo'sh joy bo'lsin.",
      q: "gap uchun qiymatni yozing: son va birlik.",
      why: "gap qiymati — son va px, orasida bo'sh joysiz: 15px. px yozilmasa, brauzer bu qatorni tashlab yuboradi.",
    },
    ru: {
      ctx: 'Меню пиццерии: между карточками должно быть 15 пикселей.',
      q: 'Впиши значение для gap: число и единицу.',
      why: 'Значение gap — число и px без пробела: 15px. Без px браузер выбросит эту строку.',
    },
    en: {
      ctx: 'A pizza menu: there should be 15 pixels between the cards.',
      q: 'Type the value for gap: a number and a unit.',
      why: 'The gap value is a number and px with no space: 15px. Without px the browser throws the line away.',
    },
  },
  {
    id: 'css_l11_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['align-items', 'flex-end'],
    mono: true,
    answer: ['flex-end', 'end'],
    vis: {
      css: '.polka {\n  display: flex;\n  height: 110px;\n  align-items: ___;\n}',
      html: '<div class="polka">\n  <div class="kitob k1"></div>\n  <div class="kitob k2"></div>\n  <div class="kitob k3"></div>\n  <div class="kitob k4"></div>\n</div>',
      base: '.polka{background:#FEF3C7;border:2px dashed #FCD34D;border-bottom:6px solid #92400E;padding:0 6px}'
        + '.kitob{width:28px;margin:0 3px;border-radius:4px 4px 0 0}'
        + '.k1{height:70px;background:#FA4F28}.k2{height:92px;background:#7C3AED}.k3{height:56px;background:#0D9488}.k4{height:80px;background:#2563EB}',
      goal: '.polka { display: flex; height: 110px; align-items: flex-end; }',
    },
    uz: {
      ctx: "Kitoblarning bo'yi har xil. Ular javonning tagida tursin, rasmdagidek.",
      q: 'align-items uchun qiymatni yozing.',
      why: "Qatorda tepadan pastga — ko'ndalang o'q. Uning oxiri — flex-end: kitoblar pastga tushadi va javon tagida turadi.",
    },
    ru: {
      ctx: 'Книги разной высоты. Они должны стоять на дне полки, как на картинке.',
      q: 'Впиши значение для align-items.',
      why: 'В ряду сверху вниз — поперечная ось. Её конец — flex-end: книги опускаются и стоят на дне полки.',
    },
    en: {
      ctx: 'The books have different heights. They should stand on the bottom of the shelf, like in the picture.',
      q: 'Type the value for align-items.',
      why: 'In a row, top to bottom is the cross axis. Its end is flex-end: the books move down and stand on the shelf’s bottom.',
    },
  },
  {
    id: 'css_l11_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['flex-wrap'],
    mono: true,
    answer: ['flex-wrap'],
    vis: { css: '.albom {\n  display: flex;\n  ___: wrap;\n}' },
    uz: {
      ctx: "Albomdagi stikerlar bir qatorga sig'may, siqilib qoldi. Sig'maganlari yangi qatorga o'tsin.",
      q: "Bo'sh joyga xususiyat nomini yozing.",
      why: "flex-wrap: wrap sig'magan bolalarni yangi qatorga o'tkazadi. Ular endi siqilmaydi va o'z kengligida qoladi.",
    },
    ru: {
      ctx: 'Наклейки не помещаются в одну строку и сжались. Лишние пусть перейдут на новую строку.',
      q: 'Впиши на пустое место имя свойства.',
      why: 'flex-wrap: wrap переносит не поместившихся детей на новую строку. Они больше не сжимаются и остаются своей ширины.',
    },
    en: {
      ctx: 'The album stickers don’t fit in one row and got squeezed. The ones that don’t fit should move to a new row.',
      q: 'Type the property name in the empty spot.',
      why: 'flex-wrap: wrap moves the children that don’t fit to a new row. They stop getting squeezed and keep their own width.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'css_l11_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['justify-content', 'space-between'],
    pieces: ['justify-content', ': ', 'space-between', ';'],
    extra: ['align-items', 'center'],
    vis: { css: '.shapka {\n  display: flex;\n  ___\n}' },
    uz: {
      ctx: "Kafe sayti shapkasi: logotip chap chetda, «Menyu» tugmasi esa o'ng chetda tursin.",
      q: "Bo'laklarni tartib bilan bosib, tekislashni yig'ing",
      why: "space-between birinchi bolani boshiga, oxirgisini oxiriga qo'yadi, qolgan joy esa ular orasida. Bu asosiy o'q bo'ylab, ya'ni justify-content ishi.",
    },
    ru: {
      ctx: 'Шапка сайта кафе: логотип у левого края, кнопка «Меню» — у правого.',
      q: 'Нажимай кусочки по порядку и собери выравнивание',
      why: 'space-between ставит первого ребёнка в начало, последнего — в конец, а свободное место — между ними. Это вдоль главной оси, работа justify-content.',
    },
    en: {
      ctx: 'A café site header: the logo at the left edge, the “Menu” button at the right edge.',
      q: 'Tap the pieces in order to build the alignment',
      why: 'space-between puts the first child at the start, the last at the end, and the free space between them. That’s along the main axis, a job for justify-content.',
    },
  },
  {
    id: 'css_l11_q16',
    type: 'build',
    difficulty: 'easy',
    tags: ['align-items', 'center'],
    pieces: ['align-items', ': ', 'center', ';'],
    extra: ['justify-content', 'middle'],
    vis: { css: '.kosmos {\n  display: flex;\n  height: 200px;\n  ___\n}' },
    uz: {
      ctx: "Kosmos sayti: sayyoralar qatorda turibdi. Ular bo'yiga, ya'ni tepadan pastga o'rtada tursin.",
      q: "Bo'laklarni tartib bilan bosib, tekislashni yig'ing",
      why: "Qatorda tepadan pastga — ko'ndalang o'q, uni align-items tekislaydi. O'rta — center, middle esa CSS tilida yo'q so'z.",
    },
    ru: {
      ctx: 'Космический сайт: планеты стоят в ряд. Они должны быть посередине по высоте.',
      q: 'Нажимай кусочки по порядку и собери выравнивание',
      why: 'В ряду сверху вниз — поперечная ось, её выравнивает align-items. Середина — center, а слова middle в CSS нет.',
    },
    en: {
      ctx: 'A space site: the planets stand in a row. They should be in the middle of the height.',
      q: 'Tap the pieces in order to build the alignment',
      why: 'In a row, top to bottom is the cross axis, aligned by align-items. The middle is center; there’s no middle value in CSS.',
    },
  },
  {
    id: 'css_l11_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['align-items', 'center'],
    line: 5,
    vis: {
      css: '.javon {\n  display: flex;\n  height: 100px;\n  justify-content: center;\n  align-items: middle;\n}',
      html: {
        uz: cards('javon', 'Sher', 'Pingvin', 'Mushuk'),
        ru: cards('javon', 'Лев', 'Пингвин', 'Кот'),
        en: cards('javon', 'Lion', 'Penguin', 'Cat'),
      },
      base: SHELF,
    },
    uz: {
      ctx: "Kartochkalar javonning qoq o'rtasida turishi kerak, lekin ular tepadan pastga cho'zilib qoldi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "5-qatorda middle yozilgan, CSS tilida esa o'rta — center. Brauzer bu qatorni tashlab yubordi, shuning uchun kartochkalar odatdagidek cho'zildi.",
    },
    ru: {
      ctx: 'Карточки должны стоять ровно в центре полки, а они вытянулись сверху донизу.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 5 написано middle, а в CSS середина — center. Браузер выбросил эту строку, поэтому карточки растянулись, как обычно.',
    },
    en: {
      ctx: 'The cards should sit right in the center of the shelf, but they stretched from top to bottom.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 5 says middle, but in CSS the middle is center. The browser threw the line away, so the cards stretched as usual.',
    },
  },
  {
    id: 'css_l11_q18',
    type: 'tap',
    difficulty: 'medium',
    tags: ['align-items', 'flex-end'],
    answer: 'ai-end',
    vis: {
      css: '.javon {\n  display: flex;\n  align-items: flex-end;\n}',
      html: '<div class="p a" data-t="jc-end">\n  <div class="k"></div><div class="k"></div><div class="k"></div>\n</div>\n'
        + '<div class="p b" data-t="center">\n  <div class="k"></div><div class="k"></div><div class="k"></div>\n</div>\n'
        + '<div class="p javon" data-t="ai-end">\n  <div class="k"></div><div class="k"></div><div class="k"></div>\n</div>\n'
        + '<div class="p c" data-t="between">\n  <div class="k"></div><div class="k"></div><div class="k"></div>\n</div>',
      base: '.p{height:54px;background:#FFF1EC;border:2px dashed #FDBA74;padding:4px;margin-bottom:12px}'
        + '.k{width:24px;height:24px;background:#FA4F28;border-radius:6px;margin:0 3px}'
        + '.a{display:flex;justify-content:flex-end}.b{display:flex;justify-content:center;align-items:center}.c{display:flex;justify-content:space-between}',
    },
    uz: {
      ctx: "To'rtta javon, har birida uchta kubik. Shu qoida ulardan bittasiga yozilgan.",
      q: 'Qoida qaysi javonni shunday tekisladi? Uni bosing',
      why: "align-items ko'ndalang o'q bo'ylab, ya'ni tepadan pastga tekislaydi: flex-end kubiklarni pastga tushiradi. Asosiy o'q bo'ylab ular boshida, chapda qoladi.",
    },
    ru: {
      ctx: 'Четыре полки, на каждой три кубика. Это правило написано одной из них.',
      q: 'Какую полку так выровняло правило? Нажми на неё',
      why: 'align-items выравнивает по поперечной оси — сверху вниз: flex-end опускает кубики вниз. По главной оси они остаются в начале, слева.',
    },
    en: {
      ctx: 'Four shelves, three cubes on each. This rule is written for one of them.',
      q: 'Which shelf did this rule align? Tap it',
      why: 'align-items aligns along the cross axis, top to bottom: flex-end moves the cubes down. Along the main axis they stay at the start, on the left.',
    },
  },
];
