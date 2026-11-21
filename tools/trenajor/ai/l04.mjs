// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 4 «Как должен выглядеть сайт?» — 18 вопросов с выбором (6 easy, 8 medium, 4 hard).
// Проверяем пятый вопрос формулы «Ko'rinishi?»: стиль — настроение сайта, одно слово меняет весь дизайн; «chiroyli» —
// догадка ИИ («Taxmin»), нужно описание; стиль под сайт и его аудиторию; цвета — первый главный, второй на кнопки,
// белый — только фон; форма карточек (скругления / прямые углы), тени (большие / без теней), шрифт (рукописный,
// классический, кода); блоки и порядок — не «Ko'rinishi?», а «Ichida nima?»; свой «Ko'rinishi?» сильнее аудитории.
// Промпт — только «Nima? … Ko'rinishi?» (q 0–4). Сайты — как их собирает симулятор урока (tools/ai1/ai1-kit.jsx:
// lookOf, lookPalette, lookCss): неон — тёмный фон и светящийся цвет, первый цвет — главный, второй — кнопки.
// Словарь урока: uslub (saytning kayfiyati), kayfiyat, asosiy rang, shrift (harflarning ko'rinishi), soya, burchak.
// Апостроф в узбекском — только ASCII «'». Ситуации тестов модуля (tools/aitest/l04.jsx) не повторяются.
// Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const G = T('Taxmin', 'Догадка', 'Guess');
const CLIENT = T('Mijoz', 'Клиент', 'Client');
const FOOT = T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.');

export default [
  // ── EASY ──
  {
    id: 'ai_l04_q01', difficulty: 'easy', tags: ['uslub'], sort: false,
    vis: null,
    uz: {
      ctx: "«Ko'rinishi?» qatoriga oldin uslubni yozamiz.",
      q: 'Uslub nima?',
      opts: ['Saytning kayfiyati: quvnoq, jiddiy, neon', 'Saytdagi bloklar va ularning tartibi', 'Sayt kimlar uchun yaratilgani', 'Saytning maqsadi: odamlar nima qilsin'],
      why: "Uslub — saytning kayfiyati. Bitta so'z, masalan «quvnoq» yoki «jiddiy», butun dizaynni o'zgartiradi.",
    },
    ru: {
      ctx: 'В строку «Как выглядит?» сначала пишем стиль.',
      q: 'Что такое стиль?',
      opts: ['Настроение сайта: весёлый, строгий, неон', 'Блоки сайта и порядок, в котором они идут', 'Для кого сделан этот сайт', 'Цель сайта: что должны делать люди'],
      why: 'Стиль — это настроение сайта. Одно слово, например «весёлый» или «строгий», меняет весь дизайн.',
    },
    en: {
      ctx: 'In the “How it looks?” line we write the style first.',
      q: 'What is the style?',
      opts: ['The site’s mood: fun, formal, neon', 'The site’s blocks and the order they go in', 'Who the site is made for', 'The goal: what people should do'],
      why: 'The style is the site’s mood. One word, like “fun” or “formal”, changes the whole design.',
    },
  },
  {
    id: 'ai_l04_q02', difficulty: 'easy', tags: ['chiroyli', 'aniq'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("Origami to'garagi sayti", 'Сайт кружка оригами', 'An origami club site') },
        { q: 1, t: T("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to join the club') },
        { q: 2, t: T('9–12 yoshli bolalar', 'дети 9–12 лет', 'kids aged 9–12') },
        { q: 3, t: T('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact') },
        { q: 4, t: null },
      ],
    } },
    uz: {
      ctx: "To'rtta qator tayyor. Endi saytning ko'rinishini yozamiz.",
      q: "Qaysi «Ko'rinishi?» sun'iy intellektga aniqroq?",
      opts: ["quvnoq, to'q sariq va oq, yumaloq burchaklar", "chiroyli va zo'r bo'lsin, hammaga yoqsin", "ko'zga yoqimli, juda yaxshi dizayn bo'lsin", "eng chiroyli sayt bo'lsin, xuddi kinodek"],
      why: "«Chiroyli», «yaxshi» hech narsani aniq aytmaydi. Uslub, ranglar va burchaklar yozilsa, sun'iy intellekt aynan shunday qiladi.",
    },
    ru: {
      ctx: 'Четыре строки готовы. Теперь пишем, как выглядит сайт.',
      q: 'Какая строка «Как выглядит?» точнее для ИИ?',
      opts: ['весёлый, оранжевый и белый, скруглённые углы', 'красивый и крутой, чтобы всем понравился', 'приятный глазу, очень хороший дизайн', 'самый красивый сайт, как в кино'],
      why: '«Красивый», «хороший» ничего точно не говорят. Если написать стиль, цвета и углы, ИИ так и сделает.',
    },
    en: {
      ctx: 'Four lines are ready. Now we describe how the site looks.',
      q: 'Which “How it looks?” line is clearer for the AI?',
      opts: ['fun, orange and white, rounded corners', 'pretty and cool, so everyone likes it', 'nice to look at, a really good design', 'the prettiest site, just like in a movie'],
      why: '“Pretty” and “good” don’t say anything exact. If you write the style, colours and corners, the AI does just that.',
    },
  },
  {
    id: 'ai_l04_q03', difficulty: 'easy', tags: ['shrift'], sort: false,
    vis: null,
    uz: {
      ctx: "Tabriknomalar do'koni «Ko'rinishi?» ga «qo'lyozma shrift» deb yozdi.",
      q: "Saytda nima o'zgaradi?",
      opts: ["Harflar qo'lda yozilgandek bo'ladi", "Kartochkalar burchagi yumaloq bo'ladi", "Saytga qo'lda yozish formasi qo'shiladi", "Sayt rangsiz, qalamda chizilgandek bo'ladi"],
      why: "Shrift — harflarning ko'rinishi. «Qo'lyozma» desak, sarlavha va matn harflari qo'lda yozilgandek chiqadi.",
    },
    ru: {
      ctx: 'Магазин открыток написал в «Как выглядит?»: «рукописный шрифт».',
      q: 'Что изменится на сайте?',
      opts: ['Буквы будут как написанные от руки', 'Углы карточек станут скруглёнными', 'На сайте появится форма для письма', 'Сайт станет бесцветным, как набросок'],
      why: 'Шрифт — это то, как выглядят буквы. С «рукописным» буквы заголовков и текста будут как написанные от руки.',
    },
    en: {
      ctx: 'A greeting card shop wrote “handwritten font” in “How it looks?”.',
      q: 'What changes on the site?',
      opts: ['The letters look handwritten', 'The card corners become rounded', 'A handwriting form appears on the site', 'The site turns colourless, like a sketch'],
      why: 'The font is how the letters look. With “handwritten”, the headings and text look written by hand.',
    },
  },
  {
    id: 'ai_l04_q04', difficulty: 'easy', tags: ['asosiy-rang'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site') },
        { q: 1, t: T('bolalar lagerga yozilsin', 'чтобы дети записывались в лагерь', 'get kids to sign up for camp') },
        { q: 2, t: T('10–14 yoshli bolalar', 'дети 10–14 лет', 'kids aged 10–14') },
        { q: 3, t: T('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact') },
        { q: 4, t: T('quvnoq, yashil va sariq', 'весёлый, зелёный и жёлтый', 'fun, green and yellow'), hl: true },
      ],
    } },
    uz: {
      ctx: "Sun'iy intellekt shu prompt bo'yicha sayt yaratadi.",
      q: 'Sayt asosan qaysi rangda chiqadi?',
      opts: ['Yashil: u birinchi yozilgan', 'Sariq: u oxirida yozilgan', 'Yashil va sariq teng yarmidan', "Sun'iy intellekt rangni o'zi tanlaydi"],
      why: "Birinchi yozilgan rang asosiy bo'ladi: sayt yashil. Ikkinchisi, sariq, tugmalarga ketadi.",
    },
    ru: {
      ctx: 'ИИ сделает сайт по этому промпту.',
      q: 'Какого цвета будет сайт в основном?',
      opts: ['Зелёного: он написан первым', 'Жёлтого: он написан последним', 'Зелёного и жёлтого поровну', 'ИИ выберет цвет сам'],
      why: 'Первый написанный цвет — главный: сайт будет зелёным. Второй, жёлтый, уйдёт на кнопки.',
    },
    en: {
      ctx: 'The AI will build a site from this prompt.',
      q: 'What colour will the site mostly be?',
      opts: ['Green: it’s written first', 'Yellow: it’s written last', 'Half green, half yellow', 'The AI picks the colour itself'],
      why: 'The first colour written is the main one: the site is green. The second, yellow, goes to the buttons.',
    },
  },
  {
    id: 'ai_l04_q05', difficulty: 'easy', tags: ['chiroyli', 'taxmin'], sort: false,
    vis: null,
    uz: {
      ctx: "«Ko'rinishi?» qatoriga faqat «chiroyli bo'lsin» yozildi.",
      q: "Sun'iy intellekt nima qiladi?",
      opts: ["Chiroyli qanday bo'lishini o'zi taxmin qiladi", "Siz o'ylagan dizaynni aniq topadi", "Saytni yaratmaydi, to'xtab qoladi", "Hamma uchun bir xil chiroyli sayt qiladi"],
      why: "«Chiroyli» har kimga har xil. Sun'iy intellekt o'zicha tanlaydi va saytda «Taxmin» belgisi chiqadi.",
    },
    ru: {
      ctx: 'В строку «Как выглядит?» написали только «чтобы было красиво».',
      q: 'Что сделает ИИ?',
      opts: ['Сам угадает, что значит «красиво»', 'Точно угадает дизайн из твоей головы', 'Не сделает сайт и сообщит об ошибке', 'Сделает сайт, красивый для всех одинаково'],
      why: '«Красиво» у каждого своё. ИИ выберет сам, и на сайте появится метка «Догадка».',
    },
    en: {
      ctx: 'The “How it looks?” line only says “make it pretty”.',
      q: 'What will the AI do?',
      opts: ['Guess what “pretty” means by itself', 'Find exactly the design you imagined', 'Refuse to make the site and show an error', 'Make a site that is pretty for everyone'],
      why: '“Pretty” means something different to everyone. The AI chooses by itself, and the site gets a “Guess” tag.',
    },
  },
  {
    id: 'ai_l04_q06', difficulty: 'easy', tags: ['uslub', 'auditoriya'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Hayvonot bog'ida kichkintoylar uchun bayram! Bolalar kulsin, hamma xursand bo'lsin.»", '«Праздник для малышей в зоопарке! Пусть дети смеются и радуются».', '“A party for little kids at the zoo! Let the kids laugh and be happy.”') },
    } },
    uz: {
      ctx: "Mijozning xabarini o'qing.",
      q: 'Qaysi uslub bu bayramga mos?',
      opts: ['quvnoq va yorqin', 'jiddiy, klassik shrift', "qorong'i neon, kod shrifti", 'minimalist, kulrang va oq'],
      why: "Kichkintoylar bayramiga quvnoq va yorqin uslub mos: rang-barang, o'yinchoqdek kartochkalar.",
    },
    ru: {
      ctx: 'Прочитай сообщение клиента.',
      q: 'Какой стиль подходит этому празднику?',
      opts: ['весёлый и яркий', 'строгий, классический шрифт', 'тёмный неон, шрифт кода', 'минимализм, серый и белый'],
      why: 'Празднику для малышей подходит весёлый и яркий стиль: разноцветный, с карточками-игрушками.',
    },
    en: {
      ctx: 'Read the client’s message.',
      q: 'Which style suits this party?',
      opts: ['fun and bright', 'formal, classic font', 'dark neon, code font', 'minimal, grey and white'],
      why: 'A party for little kids needs a fun, bright style: colourful, with toy-like cards.',
    },
  },

  // ── MEDIUM ──
  {
    id: 'ai_l04_q07', difficulty: 'medium', tags: ['uslub', 'detektiv'], sort: false,
    vis: { ai: {
      site: {
        title: T('Robotlar jangi', 'Битва роботов', 'Robot battle'), em: '🤖', c: '#A855F7', c2: '#C4B5FD', bg: '#1E1B4B', dark: true, radius: 10,
        heroBg: 'linear-gradient(135deg, #05060F, #2E1065)', btn: '#A855F7', btnFg: '#FFFFFF',
        nav: [T('Robotlar', 'Роботы', 'Robots'), T('Qoidalar', 'Правила', 'Rules'), T('Chiptalar', 'Билеты', 'Tickets')],
        badge: T('Final · 2026', 'Финал · 2026', 'Final · 2026'), sub: T('Eng kuchli robotlar maydonda!', 'Сильнейшие роботы на арене!', 'The strongest robots in the arena!'), cta: T('Chipta olish', 'Купить билет', 'Get a ticket'),
        cards: [
          { ic: '⚡', h: T('Robotlar', 'Роботы', 'Robots'), p: T('16 ta jamoa', '16 команд', '16 teams') },
          { ic: '🏆', h: T('Sovrin', 'Приз', 'Prize'), p: T('Kubok va medallar', 'Кубок и медали', 'Cup and medals') },
          { ic: '🎟️', h: T('Chiptalar', 'Билеты', 'Tickets'), p: T('Onlayn sotuvda', 'В продаже онлайн', 'On sale online') },
        ],
        foot: FOOT,
      },
    } },
    uz: {
      ctx: 'Saytning foni, ranglari va kartochkalariga qarang.',
      q: "Qaysi «Ko'rinishi?» shu saytni bergan?",
      opts: ["qorong'i neon, binafsha", 'quvnoq va yorqin, binafsha', 'minimalist, binafsha va oq', 'sokin, binafsha, yumshoq'],
      why: "Qorong'i fon va yonib turgan binafsha rang — bu neon uslub. Quvnoq sayt rang-barang, minimalist esa oq va toza bo'lardi.",
    },
    ru: {
      ctx: 'Посмотри на фон, цвета и карточки сайта.',
      q: 'Какая строка «Как выглядит?» дала этот сайт?',
      opts: ['тёмный неон, фиолетовый', 'весёлый и яркий, фиолетовый', 'минимализм, фиолетовый и белый', 'спокойный, фиолетовый, мягкий'],
      why: 'Тёмный фон и светящийся фиолетовый — это неон. Весёлый сайт был бы разноцветным, минимализм — белым и чистым.',
    },
    en: {
      ctx: 'Look at the site’s background, colours and cards.',
      q: 'Which “How it looks?” line gave this site?',
      opts: ['dark neon, purple', 'fun and bright, purple', 'minimal, purple and white', 'calm, purple, soft'],
      why: 'A dark background with glowing purple is neon. A fun site would be colourful, and a minimal one white and clean.',
    },
  },
  {
    id: 'ai_l04_q08', difficulty: 'medium', tags: ['shakl', 'shrift'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Kursimizda dasturlashni o'rganishadi. Sayt texnik ko'rinsin, xuddi kod yozadigan dasturdek.»", '«На нашем курсе учат программировать. Пусть сайт выглядит технично, как программа для кода».', '“Our course teaches coding. Make the site look technical, like a code editor.”') },
    } },
    uz: {
      ctx: "Mijoz saytning ko'rinishini tasvirladi.",
      q: "Qaysi «Ko'rinishi?» unga mos?",
      opts: ["to'g'ri burchaklar, soyasiz, kod shrifti", "yumaloq burchaklar, qo'lyozma shrift", "quvnoq, rang-barang, o'yinchoqdek", 'sokin, pushti, katta yumshoq soyalar'],
      why: "Texnik ko'rinish — to'g'ri burchaklar, soyasiz kartochkalar va kod shrifti. Qo'lyozma yoki o'yinchoqdek dizayn bu kursga mos emas.",
    },
    ru: {
      ctx: 'Клиент описал, как должен выглядеть сайт.',
      q: 'Какая строка «Как выглядит?» ему подходит?',
      opts: ['прямые углы, без теней, шрифт кода', 'скруглённые углы, рукописный шрифт', 'весёлый, разноцветный, как игрушка', 'спокойный, розовый, большие мягкие тени'],
      why: 'Технический вид — это прямые углы, карточки без теней и шрифт кода. Рукописный или игрушечный дизайн этому курсу не подходит.',
    },
    en: {
      ctx: 'The client described how the site should look.',
      q: 'Which “How it looks?” line fits?',
      opts: ['square corners, no shadows, code font', 'rounded corners, handwritten font', 'fun, colourful, toy-like', 'calm, pink, big soft shadows'],
      why: 'A technical look means square corners, cards without shadows and a code font. A handwritten or toy-like design doesn’t suit this course.',
    },
  },
  {
    id: 'ai_l04_q09', difficulty: 'medium', tags: ['ikkinchi-rang'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Akvarium sayti', 'Сайт океанариума', 'An aquarium site') },
        { q: 1, t: T('oilalar chipta olsin', 'чтобы семьи покупали билеты', 'get families to buy tickets') },
        { q: 2, t: T('bolali oilalar', 'семьи с детьми', 'families with kids') },
        { q: 3, t: T('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact') },
        { q: 4, t: T("sokin, ko'k va sariq", 'спокойный, синий и жёлтый', 'calm, blue and yellow'), hl: true },
      ],
    } },
    uz: {
      ctx: "Bu prompt bo'yicha sayt asosan ko'k bo'ladi.",
      q: 'Sariq rang saytning qayerida chiqadi?',
      opts: ['Saytdagi tugmalarda', 'Butun saytning fonida', 'Faqat sarlavha harflarida', 'Hech qayerda: faqat birinchisi ishlaydi'],
      why: "Birinchi rang asosiy, ikkinchisi tugmalarga ketadi. Shuning uchun sayt ko'k, tugmalar esa sariq bo'ladi.",
    },
    ru: {
      ctx: 'По этому промпту сайт будет в основном синим.',
      q: 'Где на сайте будет жёлтый цвет?',
      opts: ['На кнопках сайта', 'На фоне всего сайта', 'Только в буквах заголовка', 'Нигде: работает только первый'],
      why: 'Первый цвет — главный, второй уходит на кнопки. Поэтому сайт синий, а кнопки жёлтые.',
    },
    en: {
      ctx: 'With this prompt, the site will be mostly blue.',
      q: 'Where will yellow show up on the site?',
      opts: ['On the site’s buttons', 'As the background of the whole site', 'Only in the heading letters', 'Nowhere: only the first one counts'],
      why: 'The first colour is the main one, and the second goes to the buttons. So the site is blue and the buttons are yellow.',
    },
  },
  {
    id: 'ai_l04_q10', difficulty: 'medium', tags: ['mijoz', 'uslub'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Bizning teatr — klassik va jiddiy. Rangimiz to'q qizil, bezaklari oltin.»", '«Наш театр — классический и строгий. Наш цвет — тёмно-красный, украшения золотые».', '“Our theatre is classic and formal. Our colour is dark red, with gold details.”') },
    } },
    uz: {
      ctx: 'Teatr sayt buyurtma qildi.',
      q: "Qaysi «Ko'rinishi?» xabarga mos?",
      opts: ['jiddiy, qizil va oltin, klassik shrift', 'quvnoq, yorqin va rang-barang', "juda chiroyli va hashamatli bo'lsin", "qorong'i neon, yashil, kod shrifti"],
      why: "Mijoz uch narsani aytdi: jiddiy uslub, qizil va oltin ranglar, klassik ko'rinish. Hammasi bitta qatorda yozilgan.",
    },
    ru: {
      ctx: 'Театр заказал сайт.',
      q: 'Какая строка «Как выглядит?» подходит сообщению?',
      opts: ['строгий, красный и золотой, классический шрифт', 'весёлый, яркий и разноцветный', 'очень красивый и роскошный', 'тёмный неон, зелёный, шрифт кода'],
      why: 'Клиент назвал три вещи: строгий стиль, красный и золотой цвета, классический вид. Всё это есть в одной строке.',
    },
    en: {
      ctx: 'A theatre ordered a site.',
      q: 'Which “How it looks?” line fits the message?',
      opts: ['formal, red and gold, classic font', 'fun, bright and colourful', 'really pretty and luxurious', 'dark neon, green, code font'],
      why: 'The client named three things: a formal style, red and gold colours, a classic look. All of them are in one line.',
    },
  },
  {
    id: 'ai_l04_q11', difficulty: 'medium', tags: ['soya'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Kartochkalar juda tekis. Ular sahifadan ko'tarilib turgandek bo'lsin.»", '«Карточки слишком плоские. Пусть они будто приподнимаются над страницей».', '“The cards are too flat. Make them look like they rise above the page.”') },
      site: {
        title: T('Planetariy', 'Планетарий', 'Planetarium'), em: '🔭', c: '#1D4ED8', c2: '#1E3A8A', bg: '#DBEAFE', shadow: 'none', radius: 16, noFoot: true,
        nav: [T('Shoular', 'Шоу', 'Shows'), T('Chiptalar', 'Билеты', 'Tickets'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yulduzlar sizni kutmoqda', 'Звёзды ждут тебя', 'The stars are waiting'), sub: T('Koinotga sayohat!', 'Путешествие в космос!', 'A trip into space!'), cta: T('Chipta olish', 'Купить билет', 'Get a ticket'),
        cards: [
          { ic: '🪐', h: T('Sayyoralar', 'Планеты', 'Planets'), p: T('Shou 30 daqiqa', 'Шоу 30 минут', 'A 30-minute show') },
          { ic: '🌌', h: T('Yulduzlar', 'Звёзды', 'Stars'), p: T('Har kuni', 'Каждый день', 'Every day') },
          { ic: '🚀', h: T('Raketalar', 'Ракеты', 'Rockets'), p: T('Bolalar uchun', 'Для детей', 'For kids') },
        ],
      },
      focus: '.cards',
    } },
    uz: {
      ctx: 'Mijoz kartochkalarni o\'zgartirmoqchi.',
      q: "«Ko'rinishi?» ga nima qo'shamiz?",
      opts: ['katta soyalar', "to'g'ri burchaklar", 'kod shrifti', 'soyasiz, tekis kartochkalar'],
      why: "Katta soyalar kartochkalarni sahifadan ko'tarilib turgandek qiladi. «Soyasiz» esa ularni tekis qoldiradi.",
    },
    ru: {
      ctx: 'Клиент хочет изменить карточки.',
      q: 'Что добавить в «Как выглядит?»?',
      opts: ['большие тени', 'прямые углы', 'шрифт кода', 'без теней, плоские карточки'],
      why: 'Большие тени делают карточки как будто приподнятыми над страницей. А «без теней» оставляет их плоскими.',
    },
    en: {
      ctx: 'The client wants to change the cards.',
      q: 'What do we add to “How it looks?”?',
      opts: ['big shadows', 'square corners', 'code font', 'no shadows, flat cards'],
      why: 'Big shadows make the cards look raised above the page. “No shadows” keeps them flat.',
    },
  },
  {
    id: 'ai_l04_q12', difficulty: 'medium', tags: ['uslub'], sort: false,
    vis: null,
    uz: {
      ctx: "Prompt o'sha-o'sha, faqat «zamonaviy» so'zi «minimalist» ga almashdi.",
      q: "Saytda nima o'zgaradi?",
      opts: ["Hamma narsa oq va toza, bezaksiz bo'ladi", "Faqat sarlavhaning rangi boshqacha bo'ladi", "Saytga yangi bloklar va bo'limlar qo'shiladi", "Hech narsa: bu ikki so'z bir xil ma'noda"],
      why: "Uslub — saytning kayfiyati, bitta so'z butun dizaynni o'zgartiradi. Minimalist — oq, toza, ortiqcha bezaksiz.",
    },
    ru: {
      ctx: 'Промпт тот же, только «современный» заменили на «минимализм».',
      q: 'Что изменится на сайте?',
      opts: ['Всё станет белым и чистым, без украшений', 'Поменяется только цвет заголовка', 'На сайте появятся новые блоки и разделы', 'Ничего: эти два слова значат одно и то же'],
      why: 'Стиль — настроение сайта, одно слово меняет весь дизайн. Минимализм — белый, чистый, без лишних украшений.',
    },
    en: {
      ctx: 'Same prompt, but “modern” was swapped for “minimal”.',
      q: 'What changes on the site?',
      opts: ['Everything turns white and clean, no decor', 'Only the heading colour changes', 'New blocks and sections are added', 'Nothing: the two words mean the same'],
      why: 'The style is the site’s mood; one word changes the whole design. Minimal means white, clean, with no extra decoration.',
    },
  },
  {
    id: 'ai_l04_q13', difficulty: 'medium', tags: ['chiroyli', 'taxmin'], sort: false,
    vis: { ai: {
      site: {
        title: T('Futbol turniri', 'Футбольный турнир', 'Football tournament'), em: '⚽', c: '#EC4899', c2: '#9D174D', bg: '#FCE7F3', radius: 24, noFoot: true,
        heroBg: 'linear-gradient(135deg, #FBCFE8, #F472B6)',
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Jamoalar', 'Команды', 'Teams'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Maktablar kubogi', 'Кубок школ', 'Schools cup'), sub: T('Eng kuchli jamoalar bir maydonda!', 'Сильнейшие команды на одном поле!', 'The strongest teams on one field!'), cta: T('Jamoani yozish', 'Записать команду', 'Sign up a team'),
        cards: [
          { ic: '🌸', h: T('Jadval', 'Расписание', 'Schedule'), p: T("O'yin kunlari", 'Дни игр', 'Match days') },
          { ic: '🌷', h: T('Jamoalar', 'Команды', 'Teams'), p: T('12 ta maktab', '12 школ', '12 schools') },
        ],
        marks: { hero: { t: G, c: '#475569' } },
      },
    } },
    uz: {
      ctx: "«Ko'rinishi?» da «chiroyli bo'lsin» edi. Sayt pushti va «Taxmin» bilan chiqdi.",
      q: "Futbol sayti o'z ko'rinishini olishi uchun nima qilamiz?",
      opts: ['Uslub va ranglarni aniq yozamiz', "«Chiroyli» ni «juda chiroyli» qilamiz", "«Ichida nima?» ga yana bloklar qo'shamiz", 'Promptni yana yuborib, omadni kutamiz'],
      why: "«Chiroyli» dan sun'iy intellekt o'zicha taxmin qiladi. «Zamonaviy, yashil va oq» kabi uslub va ranglar yozilsa, sayt aynan shunday bo'ladi.",
    },
    ru: {
      ctx: 'В «Как выглядит?» было «чтобы было красиво». Сайт вышел розовым и с «Догадкой».',
      q: 'Что сделать, чтобы у футбольного сайта был свой вид?',
      opts: ['Точно написать стиль и цвета', 'Заменить «красиво» на «очень красиво»', 'Добавить блоки в «Что внутри?»', 'Отправить промпт ещё раз и ждать удачи'],
      why: 'Из «красиво» ИИ угадывает сам. Если написать стиль и цвета, например «современный, зелёный и белый», сайт будет именно таким.',
    },
    en: {
      ctx: '“How it looks?” said “make it pretty”. The site came out pink with a “Guess” tag.',
      q: 'How do we give the football site its own look?',
      opts: ['Write the style and colours exactly', 'Change “pretty” to “very pretty”', 'Add more blocks to “What’s inside?”', 'Send the prompt again and hope for luck'],
      why: 'From “pretty” the AI just guesses. If you write a style and colours, like “modern, green and white”, the site looks exactly like that.',
    },
  },
  {
    id: 'ai_l04_q14', difficulty: 'medium', tags: ['rang', 'yetishmaydi'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Qorong'i fon, oltin rangli harflar va klassik shrift bo'lsin.»", '«Пусть будет тёмный фон, золотые буквы и классический шрифт».', '“A dark background, gold letters and a classic font, please.”') },
      prompt: [
        { q: 0, t: T('Kino klubi sayti', 'Сайт киноклуба', 'A film club site') },
        { q: 1, t: T("o'smirlar kino kechasiga kelsin", 'чтобы подростки приходили на кинопоказ', 'get teens to come to film night') },
        { q: 2, t: T("kinoni yaxshi ko'radigan o'smirlar", 'подростки, которые любят кино', 'teens who love films') },
        { q: 3, t: T('jadval, rasmlar, aloqa', 'расписание, фото, контакты', 'schedule, photos, contact') },
        { q: 4, t: T("qorong'i, klassik shrift", 'тёмный, классический шрифт', 'dark, classic font'), hl: true },
      ],
    } },
    uz: {
      ctx: "Mijozning xabari va yozilgan «Ko'rinishi?» qatori.",
      q: "Qatorga yana nima qo'shish kerak?",
      opts: ['Oltin rang', 'Yumaloq burchaklar', 'Katta soyalar', "«Chiroyli bo'lsin» so'zi"],
      why: "Mijoz uch narsani so'radi: qorong'i fon, oltin harflar, klassik shrift. Qatorda rang yo'q — uni sun'iy intellekt o'zi tanlab qo'yadi.",
    },
    ru: {
      ctx: 'Сообщение клиента и написанная строка «Как выглядит?».',
      q: 'Что ещё нужно добавить в строку?',
      opts: ['Золотой цвет', 'Скруглённые углы', 'Большие тени', 'Слово «красиво»'],
      why: 'Клиент просил три вещи: тёмный фон, золотые буквы, классический шрифт. Цвета в строке нет — ИИ выберет его сам.',
    },
    en: {
      ctx: 'The client’s message and the “How it looks?” line that was written.',
      q: 'What else should be added to the line?',
      opts: ['The colour gold', 'Rounded corners', 'Big shadows', 'The word “pretty”'],
      why: 'The client asked for three things: a dark background, gold letters, a classic font. The line has no colour, so the AI will pick one itself.',
    },
  },

  // ── HARD ──
  {
    id: 'ai_l04_q15', difficulty: 'hard', tags: ['formula'], sort: false,
    vis: null,
    uz: {
      ctx: "Saytning ko'p narsasi «Ko'rinishi?» qatoridan keladi.",
      q: "Qaysi biri «Ko'rinishi?» qatoriga bog'liq emas?",
      opts: ['Bloklar va ularning tartibi', 'Kartochkalarning burchaklari', 'Harflarning shakli, ya\'ni shrift', 'Tugmalarning rangi'],
      why: "Bloklar va tartib — «Ichida nima?» qatorining ishi. «Ko'rinishi?» esa uslub, ranglar, burchaklar, soyalar va shriftni belgilaydi.",
    },
    ru: {
      ctx: 'Многое на сайте задаёт строка «Как выглядит?».',
      q: 'Что НЕ зависит от строки «Как выглядит?»?',
      opts: ['Блоки и их порядок', 'Углы карточек', 'Форма букв, то есть шрифт', 'Цвет кнопок'],
      why: 'Блоки и порядок — работа строки «Что внутри?». А «Как выглядит?» задаёт стиль, цвета, углы, тени и шрифт.',
    },
    en: {
      ctx: 'A lot on the site comes from the “How it looks?” line.',
      q: 'Which one does NOT depend on the “How it looks?” line?',
      opts: ['The blocks and their order', 'The card corners', 'The letter shapes, that is, the font', 'The button colour'],
      why: 'Blocks and their order are the job of “What’s inside?”. “How it looks?” sets the style, colours, corners, shadows and font.',
    },
  },
  {
    id: 'ai_l04_q16', difficulty: 'hard', tags: ['asosiy-rang', 'ikkinchi-rang'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Asosiy rangimiz yashil. Tugmalar esa oltin rangda bo'lsin.»", '«Наш главный цвет — зелёный. А кнопки пусть будут золотыми».', '“Our main colour is green. And make the buttons gold.”') },
      prompt: [
        { q: 0, t: T("Botanika bog'i sayti", 'Сайт ботанического сада', 'A botanical garden site') },
        { q: 1, t: T('oilalar sayrga kelsin', 'чтобы семьи приходили гулять', 'get families to come for a walk') },
        { q: 2, t: T("tabiatni yaxshi ko'radigan oilalar", 'семьи, которые любят природу', 'families who love nature') },
        { q: 3, t: T('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact') },
        { q: 4, t: null },
      ],
    } },
    uz: {
      ctx: 'Mijoz saytning ranglarini aytdi.',
      q: "Qaysi «Ko'rinishi?» uning xohishini beradi?",
      opts: ['sokin, yashil va oltin', 'sokin, oltin va yashil', 'sokin, faqat yashil ranglarda', 'sokin, yashil rang, tugmalar chiroyli'],
      why: "Birinchi rang asosiy, ikkinchisi tugmalarga ketadi: sayt yashil, tugmalar oltin. Oltin rang yozilmasa, tugmalar ham yashil bo'ladi.",
    },
    ru: {
      ctx: 'Клиент назвал цвета сайта.',
      q: 'Какая строка «Как выглядит?» даст то, что он хочет?',
      opts: ['спокойный, зелёный и золотой', 'спокойный, золотой и зелёный', 'спокойный, только в зелёных тонах', 'спокойный, зелёный, кнопки красивые'],
      why: 'Первый цвет — главный, второй уходит на кнопки: сайт зелёный, кнопки золотые. Без золотого и кнопки будут зелёными.',
    },
    en: {
      ctx: 'The client named the site’s colours.',
      q: 'Which “How it looks?” line gives what the client wants?',
      opts: ['calm, green and gold', 'calm, gold and green', 'calm, only in shades of green', 'calm, green, with nice buttons'],
      why: 'The first colour is the main one, the second goes to the buttons: a green site with gold buttons. Without gold, the buttons stay green too.',
    },
  },
  {
    id: 'ai_l04_q17', difficulty: 'hard', tags: ['detektiv', 'shakl'], sort: false,
    vis: { ai: {
      site: {
        title: T('Raqs studiyasi', 'Студия танцев', 'Dance studio'), em: '💃', c: '#7C3AED', c2: '#4C1D95', bg: '#EDE9FE', radius: 30, shadow: 'big',
        btn: '#EC4899', btnFg: '#FFFFFF',
        nav: [T('Darslar', 'Занятия', 'Classes'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruhlar', 'Новые группы', 'New groups'), sub: T('Hip-hop va zamonaviy raqs', 'Хип-хоп и современный танец', 'Hip-hop and modern dance'), cta: T('Darsga yozilish', 'Записаться', 'Sign up'),
        cards: [
          { ic: '💃', h: T('Hip-hop', 'Хип-хоп', 'Hip-hop'), p: T('Dushanba, payshanba', 'Пн, чт', 'Mon, Thu') },
          { ic: '🕺', h: T('Breyk', 'Брейк', 'Breaking'), p: T('Seshanba, juma', 'Вт, пт', 'Tue, Fri') },
          { ic: '🎵', h: T('Shou', 'Шоу', 'Shows'), p: T('Har oy', 'Каждый месяц', 'Every month') },
        ],
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Saytning rangi, tugmalari, burchaklari va soyalariga qarang.",
      q: "Qaysi «Ko'rinishi?» shu saytni bergan?",
      opts: ['binafsha va pushti, yumaloq, katta soyalar', 'pushti va binafsha, yumaloq, katta soyalar', "binafsha va pushti, to'g'ri burchak, soyasiz", 'binafsha va pushti, yumaloq, soyasiz, tekis'],
      why: "Sayt binafsha, tugmalar pushti — demak binafsha birinchi yozilgan. Burchaklar yumaloq, kartochkalar ostida katta soya bor.",
    },
    ru: {
      ctx: 'Посмотри на цвет сайта, кнопки, углы и тени.',
      q: 'Какая строка «Как выглядит?» дала этот сайт?',
      opts: ['фиолетовый и розовый, скругления, большие тени', 'розовый и фиолетовый, скругления, большие тени', 'фиолетовый и розовый, прямые углы, без теней', 'фиолетовый и розовый, скругления, без теней'],
      why: 'Сайт фиолетовый, кнопки розовые — значит, фиолетовый написан первым. Углы скруглённые, под карточками большая тень.',
    },
    en: {
      ctx: 'Look at the site’s colour, buttons, corners and shadows.',
      q: 'Which “How it looks?” line gave this site?',
      opts: ['purple and pink, rounded, big shadows', 'pink and purple, rounded, big shadows', 'purple and pink, square corners, no shadows', 'purple and pink, rounded, flat, no shadows'],
      why: 'The site is purple and the buttons are pink, so purple was written first. The corners are rounded, with a big shadow under the cards.',
    },
  },
  {
    id: 'ai_l04_q18', difficulty: 'hard', tags: ['auditoriya', 'formula'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("Oshpazlik to'garagi sayti", 'Сайт кулинарного кружка', 'A cooking club site') },
        { q: 1, t: T("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to join the club') },
        { q: 2, t: T('6–9 yoshli kichkintoylar', 'малыши 6–9 лет', 'little kids aged 6–9') },
        { q: 3, t: T('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact') },
        { q: 4, t: T("qorong'i neon, kod shrifti", 'тёмный неон, шрифт кода', 'dark neon, code font') },
      ],
      site: {
        title: T("Oshpazlik to'garagi", 'Кулинарный кружок', 'Cooking club'), em: '🧑‍🍳', c: '#22C55E', c2: '#86EFAC', bg: '#052E16', dark: true, radius: 8,
        heroBg: 'linear-gradient(135deg, #05060F, #052E16)', font: '"Courier New", monospace', noFoot: true,
        nav: [T('Rasmlar', 'Фото', 'Photos'), T('Jadval', 'Расписание', 'Schedule'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Kichkintoylar uchun', 'Для малышей', 'For little kids'), sub: T('Birga pishiramiz!', 'Готовим вместе!', 'Let’s cook together!'), cta: T('Yozilish', 'Записаться', 'Sign up'),
        blocks: [{ h: T('Rasmlar', 'Фото', 'Photos'), items: [{ t: '🥞' }, { t: '🍪' }, { t: '🍕' }] }],
      },
    } },
    uz: {
      ctx: "Ota-onalar: «Bu kichkintoylar sayti emas, xuddi xakerlar saytiga o'xshaydi!»",
      q: "Promptning qaysi qatori shunday ko'rinishni berdi?",
      opts: ["«Ko'rinishi?»: qorong'i neon, kod shrifti", '«Kim uchun?»: 6–9 yoshli kichkintoylar', '«Ichida nima?»: rasmlar, jadval, aloqa', "«Nega?»: bolalar to'garakka yozilsin"],
      why: "Ko'rinishni «Ko'rinishi?» qatori belgilaydi, u auditoriyadan ham kuchliroq. Kichkintoylar uchun u yerga «quvnoq va yorqin» yozish kerak edi.",
    },
    ru: {
      ctx: 'Родители: «Это не сайт для малышей, а прямо сайт хакеров!»',
      q: 'Какая строка промпта дала такой вид?',
      opts: ['«Как выглядит?»: тёмный неон, шрифт кода', '«Для кого?»: малыши 6–9 лет', '«Что внутри?»: фото, расписание, контакты', '«Зачем?»: чтобы дети записывались'],
      why: 'Вид задаёт строка «Как выглядит?», и она сильнее аудитории. Для малышей там нужно было написать «весёлый и яркий».',
    },
    en: {
      ctx: 'Parents: “This isn’t a site for little kids, it looks like a hackers’ site!”',
      q: 'Which prompt line gave the site this look?',
      opts: ['“How it looks?”: dark neon, code font', '“For whom?”: little kids aged 6–9', '“What’s inside?”: photos, schedule, contact', '“Why?”: get kids to sign up'],
      why: 'The look comes from the “How it looks?” line, and it is stronger than the audience. For little kids it should have said “fun and bright”.',
    },
  },
];
