// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 5 «Как сайт должен вести себя?» — 18 вопросов с выбором (6 easy, 8 medium, 4 hard).
// Проверяем шестой вопрос формулы «Qanday ishlaydi?»: поведение = когда + что + что происходит; четыре «когда» —
// при наведении (hover), при нажатии (сайт отвечает), при открытии страницы (анимация), на телефоне (☰, кнопка внизу;
// мыши нет — наведение не работает); без «когда» — просто вид (кнопка всегда жёлтая); есть «когда», нет «что происходит» —
// ИИ угадывает («Taxmin»); «jonli», «interaktiv» — ИИ решает сам, всё прыгает; движение помогает, а не мешает
// (мигает одна главная кнопка); несколько поведений — у каждого своё «когда»; наведение — временное состояние.
// Картинка статична: поведение показано курсором (cursor, ctaHot), сообщением после нажатия (toast), телефоном (mobile, bottomBtn).
// Промпт — только вопросы формулы уроков 1–5 (q 0–5). Ситуации тестов модуля (tools/aitest/l05.jsx) не повторяются.
// Апостроф в узбекском — только ASCII «'». Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const G = T('Taxmin', 'Догадка', 'Guess');
const GC = '#475569';

export default [
  // ── EASY ──
  {
    id: 'ai_l05_q01', difficulty: 'easy', tags: ['hover'], sort: false,
    vis: null,
    uz: {
      ctx: "Saytlar haqida gapirganda «hover» so'zini ko'p eshitasiz.",
      q: '«Hover» — bu qachon?',
      opts: ['Sichqoncha biror narsa ustiga kelganda', 'Tugmani sichqoncha bilan bosganda', 'Sahifa endigina ochilib kelganda', "Saytni telefonda ochib ko'rganda"],
      why: "Hover, ya'ni sichqoncha ustiga kelganda degani. Hali hech narsa bosilmagan, sichqoncha shunchaki ustida turibdi. Bosish — boshqa holat.",
    },
    ru: {
      ctx: 'Про сайты часто говорят слово «hover».',
      q: '«Hover» — это когда?',
      opts: ['Когда мышь наведена на элемент', 'Когда по кнопке щёлкают мышью', 'Когда страница только открылась', 'Когда сайт открыли на телефоне'],
      why: 'Hover — это наведение мыши: на элемент ещё не нажали, мышь просто над ним. Нажатие — уже другой случай.',
    },
    en: {
      ctx: 'People often say “hover” when they talk about sites.',
      q: 'When is “hover”?',
      opts: ['When the mouse is over something', 'When you click a button with the mouse', 'When the page has just opened', 'When you open the site on a phone'],
      why: 'Hover means the mouse is over something: nothing is clicked yet, it just sits on top. A click is a different case.',
    },
  },
  {
    id: 'ai_l05_q02', difficulty: 'easy', tags: ['qator'], sort: false,
    vis: { ai: { prompt: [
      { q: 0, t: T("Muzqaymoq do'koni sayti", 'Сайт магазина мороженого', 'An ice cream shop site') },
      { q: 1, t: T('odamlar muzqaymoq buyurtma qilsin', 'чтобы люди заказывали мороженое', 'get people to order ice cream') },
      { q: 5, t: null, hl: true },
    ] } },
    uz: {
      ctx: "Muzqaymoq do'koni uchun prompt yozyapmiz.",
      q: "Qaysi biri «Qanday ishlaydi?» qatoriga mos?",
      opts: ["tugma bosilganda «Rahmat!» xabari chiqsin", 'zamonaviy uslubda, pushti va oq ranglarda', "menyu, narxlar va aloqa bloklari bo'lsin", "muzqaymoqni yaxshi ko'radigan bolalar uchun"],
      why: "«Qanday ishlaydi?» — odam biror narsa qilganda sayt nima qilishi. Ranglar — «Ko'rinishi?», bloklar — «Ichida nima?», bolalar — «Kim uchun?».",
    },
    ru: {
      ctx: 'Пишем промпт для магазина мороженого.',
      q: 'Что подходит в строку «Как ведёт себя?»?',
      opts: ['при нажатии на кнопку появляется «Спасибо!»', 'в современном стиле, розовый и белый', 'блоки: меню, цены и контакты', 'для детей, которые любят мороженое'],
      why: '«Как ведёт себя?» — что делает сайт, когда человек что-то делает. Цвета — это «Как выглядит?», блоки — «Что внутри?», дети — «Для кого?».',
    },
    en: {
      ctx: 'We’re writing a prompt for an ice cream shop.',
      q: 'Which fits the “How it behaves?” line?',
      opts: ['when the button is pressed, show “Thanks!”', 'modern style, pink and white', 'blocks: menu, prices and contact', 'for kids who love ice cream'],
      why: '“How it behaves?” is what the site does when a person does something. Colours are “How it looks?”, blocks are “What’s inside?”, kids are “For whom?”.',
    },
  },
  {
    id: 'ai_l05_q03', difficulty: 'easy', tags: ['hover'], sort: false,
    vis: { ai: { site: {
      title: T("Hayvonot bog'i", 'Зоопарк', 'The zoo'), em: '🦁', c: '#15803D', c2: '#166534', bg: '#DCFCE7',
      cursor: 'hover', ctaHot: { bg: '#FACC15', fg: '#1F2937', scale: 1.08 },
      nav: [T('Hayvonlar', 'Животные', 'Animals'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi: pingvinlar', 'Новые: пингвины', 'New: penguins'), sub: T("Hayvonlarni yaqindan ko'ring!", 'Смотри на животных вблизи!', 'See the animals up close!'),
      cta: T('Chipta olish', 'Купить билет', 'Get a ticket'), noFoot: true,
    } } },
    uz: {
      ctx: 'Tugmaga va sichqonchaga qarang.',
      q: "Tugmaning rangi qachon o'zgardi?",
      opts: ['Sichqoncha ustiga kelganda', 'Tugma bosilganda', 'Sahifa ochilganda', 'Sayt telefonda ochilganda'],
      why: "Sichqoncha tugma ustida turibdi, bosish halqasi yo'q. Demak, rang ustiga kelganda o'zgardi — bu hover.",
    },
    ru: {
      ctx: 'Посмотри на кнопку и на мышь.',
      q: 'Когда кнопка поменяла цвет?',
      opts: ['При наведении мыши', 'При нажатии на кнопку', 'При открытии страницы', 'Когда сайт открыли на телефоне'],
      why: 'Мышь стоит над кнопкой, кольца нажатия нет. Значит, цвет поменялся при наведении — это hover.',
    },
    en: {
      ctx: 'Look at the button and the mouse.',
      q: 'When did the button change colour?',
      opts: ['When the mouse is over it', 'When the button is clicked', 'When the page opens', 'When the site opens on a phone'],
      why: 'The mouse is over the button and there’s no click ring. So the colour changed on hover.',
    },
  },
  {
    id: 'ai_l05_q04', difficulty: 'easy', tags: ['ochilganda', 'animatsiya'], sort: false,
    vis: null,
    uz: {
      ctx: "Kutubxona saytini kompyuterda ochdingiz. Hech narsa bosmadingiz, kitoblar esa birin-ketin silliq chiqdi.",
      q: 'Bu harakat qachon ishladi?',
      opts: ['Sahifa ochilganda', 'Ustiga kelganda', 'Tugma bosilganda', 'Telefonda'],
      why: "Hech narsa bosilmadi, sichqoncha ham kelmadi — sahifa ochildi xolos. Bu animatsiya, ya'ni silliq harakat degani. U ko'zni kerakli joyga olib boradi.",
    },
    ru: {
      ctx: 'Ты открываешь сайт библиотеки на компьютере. Ничего не нажимаешь, а книги плавно появляются по очереди.',
      q: 'Когда сработало это движение?',
      opts: ['При открытии страницы', 'При наведении мыши', 'При нажатии на кнопку', 'На телефоне'],
      why: 'Ничего не нажимали, мышь не наводили — страница просто открылась. Это анимация, плавное движение: она ведёт взгляд куда нужно.',
    },
    en: {
      ctx: 'You open a library site on a computer. You click nothing, and the books appear smoothly one by one.',
      q: 'When did this motion work?',
      opts: ['When the page opens', 'On hover', 'When a button is clicked', 'On a phone'],
      why: 'Nothing was clicked or hovered — the page just opened. That’s animation, smooth motion: it leads the eye to the right place.',
    },
  },
  {
    id: 'ai_l05_q05', difficulty: 'easy', tags: ['formula', 'qachon'], sort: false,
    vis: { ai: { prompt: [
      { q: 0, t: T('Karate klubi sayti', 'Сайт клуба карате', 'A karate club site') },
      { q: 5, t: T("tugma bosilganda «Rahmat!» xabari chiqsin", 'при нажатии на кнопку появляется «Спасибо!»', 'when the button is pressed, show a “Thanks!” message'), hl: true },
    ] } },
    uz: {
      ctx: "Har bir harakatda uch qism bor: qachon, nima va nima bo'ladi.",
      q: "Bu qatorda «qachon?» qaysi qism?",
      opts: ['«bosilganda»', '«tugma»', '«xabari chiqsin»', '«Rahmat!»'],
      why: "«Bosilganda» — qachon, «tugma» — nima, «xabari chiqsin» — nima bo'ladi. Uchala qism bor, shuning uchun qator aniq.",
    },
    ru: {
      ctx: 'В каждом поведении три части: когда, что и что происходит.',
      q: 'Какая часть этой строки — «когда?»?',
      opts: ['«при нажатии»', '«на кнопку»', '«появляется»', '«Спасибо!»'],
      why: '«При нажатии» — когда, «на кнопку» — что, «появляется «Спасибо!»» — что происходит. Все три части есть, поэтому строка точная.',
    },
    en: {
      ctx: 'Every behaviour has three parts: when, what and what happens.',
      q: 'Which part of this line is the “when?”?',
      opts: ['“when … is pressed”', '“the button”', '“show a message”', '“Thanks!”'],
      why: '“When … is pressed” is the when, “the button” is the what, “show a message” is what happens. All three parts are there, so the line is exact.',
    },
  },
  {
    id: 'ai_l05_q06', difficulty: 'easy', tags: ['bosilganda', 'javob'], sort: false,
    vis: { ai: { site: {
      title: T('Musiqa maktabi', 'Музыкальная школа', 'Music school'), em: '🎹', c: '#7C3AED', c2: '#5B21B6', bg: '#EDE9FE',
      cursor: 'click',
      nav: [T('Darslar', 'Занятия', 'Lessons'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Pianino chalishni o'rganing!", 'Научись играть на пианино!', 'Learn to play the piano!'),
      cta: T("Yozilish", 'Записаться', 'Sign up'), noFoot: true,
    } } },
    uz: {
      ctx: "Musiqa maktabi saytida «Yozilish» bosildi, lekin hech narsa chiqmadi.",
      q: "Bu yerda nima yetishmayapti?",
      opts: ['Bosilgandan keyin sayt javobi — xabar', 'Ustiga kelganda tugmaning rangi', 'Sahifa ochilganda silliq harakat', 'Telefonda menyuning ☰ tugmasi'],
      why: "Bosilganda sayt javob bermasa, odam yozildimi-yo'qmi bilmaydi va yana-yana bosadi. Kerak: «tugma bosilganda «Rahmat!» xabari chiqsin».",
    },
    ru: {
      ctx: 'На сайте музыкальной школы нажали «Записаться», но ничего не появилось.',
      q: 'Чего здесь не хватает?',
      opts: ['Ответа сайта после нажатия — сообщения', 'Смены цвета кнопки при наведении', 'Плавного движения при открытии', 'Кнопки ☰ для меню на телефоне'],
      why: 'Если сайт не отвечает на нажатие, человек не знает, получилось ли, и жмёт снова и снова. Нужно: «при нажатии на кнопку появляется «Спасибо!»».',
    },
    en: {
      ctx: 'On a music school site someone pressed “Sign up”, but nothing appeared.',
      q: 'What is missing here?',
      opts: ['The site’s answer after the click', 'The button changing colour on hover', 'Smooth motion when the page opens', 'A ☰ button for the menu on a phone'],
      why: 'If the site doesn’t answer a click, the person doesn’t know if it worked and clicks again and again. Needed: “when the button is pressed, show “Thanks!””.',
    },
  },

  // ── MEDIUM ──
  {
    id: 'ai_l05_q07', difficulty: 'medium', tags: ['qachonsiz', 'korinish'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Tennis klubi sayti', 'Сайт теннисного клуба', 'A tennis club site') },
        { q: 5, t: T("tugma sariq bo'lsin", 'пусть кнопка будет жёлтой', 'make the button yellow'), hl: true },
      ],
      site: {
        title: T('Tennis klubi', 'Теннисный клуб', 'Tennis club'), em: '🎾', c: '#0369A1', c2: '#075985', bg: '#E0F2FE',
        btn: '#FACC15', btnFg: '#1F2937',
        nav: [T('Kortlar', 'Корты', 'Courts'), T('Murabbiylar', 'Тренеры', 'Coaches'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yozgi mavsum', 'Летний сезон', 'Summer season'), sub: T("Tennis o'ynashni o'rganing!", 'Научись играть в теннис!', 'Learn to play tennis!'),
        cta: T('Yozilish', 'Записаться', 'Sign up'), noFoot: true,
      },
    } },
    uz: {
      ctx: "Sichqoncha hali saytga kelmagan, tugma esa allaqachon sariq.",
      q: "«Tugma sariq bo'lsin» — bu harakatmi?",
      opts: ["Yo'q: «qachon?» yo'q, bu oddiy ko'rinish", "Ha: rang o'zgarsa, bu doim harakat", "Ha: sun'iy intellekt qachonligini o'zi biladi", 'Ha: sariq tugma o\'zi lipillab turadi'],
      why: "«Qachon?» bo'lmasa, sun'iy intellekt tugmani shunchaki doim sariq qiladi. Harakat uchun: «tugma ustiga sichqoncha kelganda sariq bo'lsin».",
    },
    ru: {
      ctx: 'Мышь ещё не подходила к сайту, а кнопка уже жёлтая.',
      q: '«Пусть кнопка будет жёлтой» — это поведение?',
      opts: ['Нет: нет «когда?», это просто вид', 'Да: если меняется цвет, это всегда поведение', 'Да: ИИ сам знает, когда это нужно', 'Да: жёлтая кнопка сама мигает'],
      why: 'Без «когда?» ИИ просто делает кнопку жёлтой всегда. Для поведения нужно: «при наведении мыши кнопка становится жёлтой».',
    },
    en: {
      ctx: 'The mouse hasn’t come to the site yet, but the button is already yellow.',
      q: 'Is “make the button yellow” a behaviour?',
      opts: ['No: there’s no “when?”, it’s just a look', 'Yes: a colour change is always a behaviour', 'Yes: the AI knows by itself when to do it', 'Yes: a yellow button blinks by itself'],
      why: 'Without “when?” the AI just makes the button yellow all the time. For a behaviour: “when the mouse is over the button, it turns yellow”.',
    },
  },
  {
    id: 'ai_l05_q08', difficulty: 'medium', tags: ['bosilganda', 'detektiv'], sort: false,
    vis: { ai: { site: {
      title: T('Bolalar kinoteatri', 'Детский кинотеатр', 'Kids’ cinema'), em: '🎬', c: '#DC2626', c2: '#991B1B', bg: '#FEE2E2',
      cursor: 'click', toast: T('✅ Tayyor! Chipta band qilindi.', '✅ Готово! Билет забронирован.', '✅ Done! Your ticket is booked.'),
      nav: [T('Filmlar', 'Фильмы', 'Films'), T('Jadval', 'Расписание', 'Schedule'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Shanba — multfilmlar', 'Суббота — мультфильмы', 'Saturday — cartoons'), sub: T('Eng yaxshi multfilmlar katta ekranda!', 'Лучшие мультфильмы на большом экране!', 'The best cartoons on a big screen!'),
      cta: T('Chipta olish', 'Купить билет', 'Get a ticket'), noFoot: true,
    } } },
    uz: {
      ctx: "Sun'iy intellekt kinoteatr uchun shu saytni yaratdi.",
      q: "Qaysi «Qanday ishlaydi?» qatori shu saytni bergan?",
      opts: ["tugma bosilganda «Tayyor!» xabari chiqsin", "tugma ustiga kelganda «Tayyor!» xabari chiqsin", "sahifa ochilganda «Tayyor!» xabari chiqsin", "«Tayyor!» xabari katta va chiroyli bo'lsin"],
      why: "Sichqoncha tugmani bosdi — halqa bor, keyin xabar chiqdi. Demak, xabar bosilganda chiqadi, ustiga kelganda yoki ochilganda emas.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт для кинотеатра.',
      q: 'Какая строка «Как ведёт себя?» дала этот сайт?',
      opts: ['при нажатии на кнопку появляется «Готово!»', 'при наведении на кнопку появляется «Готово!»', 'при открытии страницы появляется «Готово!»', 'пусть «Готово!» будет большим и красивым'],
      why: 'Мышь нажала на кнопку — видно кольцо, и только потом появилось сообщение. Значит, при нажатии, а не при наведении или открытии.',
    },
    en: {
      ctx: 'The AI made this site for a cinema.',
      q: 'Which “How it behaves?” line gave this site?',
      opts: ['when the button is pressed, show “Done!”', 'when the mouse is over the button, show “Done!”', 'when the page opens, show “Done!”', 'make the “Done!” message big and pretty'],
      why: 'The mouse clicked the button — there’s the ring — and then the message appeared. So it’s on click, not on hover or when the page opens.',
    },
  },
  {
    id: 'ai_l05_q09', difficulty: 'medium', tags: ['taxmin', 'nima-boladi'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Akvapark sayti', 'Сайт аквапарка', 'A water park site') },
        { q: 5, t: T('tugma ustiga sichqoncha kelganda', 'при наведении мыши на кнопку', 'when the mouse is over the button'), hl: true },
      ],
      site: {
        title: T('Akvapark', 'Аквапарк', 'Water park'), em: '🌊', c: '#0891B2', c2: '#155E75', bg: '#CFFAFE',
        cursor: 'hover', ctaHot: { bg: '#F97316', fg: '#FFFFFF' },
        nav: [T('Basseynlar', 'Бассейны', 'Pools'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yoz ochildi!', 'Лето открыто!', 'Summer is open!'), sub: T('Eng uzun suv tepaliklari!', 'Самые длинные водные горки!', 'The longest water slides!'),
        cta: T('Chipta olish', 'Купить билет', 'Get a ticket'), noFoot: true,
        marks: { cta: { t: G, c: GC } },
      },
    } },
    uz: {
      ctx: "Sichqoncha kelganda tugma to'q sariq bo'ldi. Yonida esa «Taxmin» belgisi.",
      q: "Nega bu yerda «Taxmin» turibdi?",
      opts: ["«Nima bo'ladi?» yo'q, rangni o'zi tanladi", "«Qachon?» yo'q, shuning uchun taxmin qildi", "Tugma yozilmagan, uni o'zi topib oldi", "Sichqoncha hali bosmagan, sayt kutyapti"],
      why: "Qatorda qachon va nima bor: ustiga kelganda, tugma. Lekin nima bo'lishi yo'q. Shuni sun'iy intellekt o'zicha tanladi. Masalan, «… kattalashsin» deb yozing.",
    },
    ru: {
      ctx: 'При наведении кнопка стала оранжевой. А рядом — метка «Догадка».',
      q: 'Почему здесь стоит «Догадка»?',
      opts: ['Нет «что происходит» — цвет ИИ выбрал сам', 'Нет «когда?», поэтому ИИ угадывал', 'Не написана кнопка, ИИ нашёл её сам', 'Мышь ещё не нажала, сайт ждёт нажатия'],
      why: 'В строке есть «когда» (при наведении) и «что» (кнопка), но нет «что происходит». Это ИИ выбрал сам. Допиши, например: «…кнопка увеличивается».',
    },
    en: {
      ctx: 'On hover the button turned orange. And next to it there’s a “Guess” tag.',
      q: 'Why is there a “Guess” here?',
      opts: ['No “what happens”, so it picked a colour', 'No “when?”, so the AI had to guess', 'The button isn’t named, so the AI found it', 'The mouse hasn’t clicked, the site is waiting'],
      why: 'The line has a when (the mouse is over) and a what (the button), but no what happens. The AI chose that itself. Add, for example, “…it grows”.',
    },
  },
  {
    id: 'ai_l05_q10', difficulty: 'medium', tags: ['jonli', 'taxmin'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("O'yinchoqlar do'koni sayti", 'Сайт магазина игрушек', 'A toy shop site') },
        { q: 5, t: T("interaktiv va qiziqarli bo'lsin", 'пусть будет интерактивным и интересным', 'make it interactive and fun'), hl: true },
      ],
      site: {
        title: T("O'yinchoqlar do'koni", 'Магазин игрушек', 'Toy shop'), em: '🧸', c: '#EA580C', c2: '#9A3412', bg: '#FFEDD5',
        cursor: 'hover', ctaHot: { bg: '#FACC15', fg: '#1F2937', scale: 1.25 },
        nav: [T("O'yinchoqlar", 'Игрушки', 'Toys'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi kelganlar', 'Новинки', 'New arrivals'), sub: T("Eng qiziq o'yinchoqlar shu yerda!", 'Самые интересные игрушки здесь!', 'The coolest toys are here!'),
        cta: T('Buyurtma berish', 'Заказать', 'Order'), noFoot: true,
        marks: { hero: { t: G, c: GC }, cta: { t: G, c: GC } },
      },
    } },
    uz: {
      ctx: "Saytda hamma narsa sakrab aylanyapti, «Taxmin» belgilari esa ko'p.",
      q: 'Nega shunday bo\'ldi?',
      opts: ["So'zlar aniq emas, sun'iy intellekt o'zi tanladi", "Mijoz aynan shunday sakrashni so'ragan edi", "Do'kon saytlari doim shunday bo'lishi kerak", 'Sayt telefonda ochilgani uchun shunday bo\'ldi'],
      why: "«Interaktiv», «qiziqarli» har kimga har xil. Sun'iy intellekt o'zicha tushunib, hamma narsani sakratdi. Aniq yozing: qachon, nima va nima bo'ladi.",
    },
    ru: {
      ctx: 'На сайте всё прыгает и крутится, а меток «Догадка» много.',
      q: 'Почему так получилось?',
      opts: ['Слова неточные, и ИИ сам решил, что делать', 'Клиент сам просил, чтобы всё так прыгало', 'Сайты магазинов всегда должны быть такими', 'Сайт открыли на телефоне, поэтому так вышло'],
      why: '«Интерактивный», «интересный» каждый понимает по-своему. ИИ понял по-своему и заставил всё прыгать. Пиши точно: когда, что и что происходит.',
    },
    en: {
      ctx: 'Everything on the site jumps and spins, and there are many “Guess” tags.',
      q: 'Why did this happen?',
      opts: ['The words aren’t exact, so the AI chose itself', 'The client asked for everything to jump', 'Shop sites must always be like this', 'It was opened on a phone, so it happened'],
      why: '“Interactive” and “fun” mean different things to everyone. The AI took them its own way and made everything jump. Write exactly: when, what and what happens.',
    },
  },
  {
    id: 'ai_l05_q11', difficulty: 'medium', tags: ['telefon', 'hover'], sort: false,
    vis: null,
    uz: {
      ctx: 'Velosiped ijarasi saytini mijozlar faqat telefondan ochadi.',
      q: 'Qaysi harakat ular uchun ishlamaydi?',
      opts: ["Sichqoncha kelganda tugma rangi o'zgarishi", "Tugma bosilganda «Rahmat!» chiqishi", "Ochilganda bloklar silliq paydo bo'lishi", "Menyuning ☰ tugmasiga yig'ilishi"],
      why: "Telefonda sichqoncha yo'q, ekranga barmoq tegadi. Shuning uchun «ustiga kelganda» ishlamaydi, bosish, ochilish va ☰ esa ishlaydi.",
    },
    ru: {
      ctx: 'Сайт проката велосипедов клиенты открывают только с телефона.',
      q: 'Какое поведение у них не сработает?',
      opts: ['Смена цвета кнопки при наведении мыши', 'Сообщение «Спасибо!» при нажатии', 'Плавное появление блоков при открытии', 'Сворачивание меню в кнопку ☰'],
      why: 'У телефона нет мыши, по экрану касаются пальцем. Поэтому наведение не работает, а нажатие, открытие и ☰ работают.',
    },
    en: {
      ctx: 'Customers open the bike rental site only on phones.',
      q: 'Which behaviour won’t work for them?',
      opts: ['The button changing colour on mouse hover', 'A “Thanks!” message on click', 'Blocks fading in when the page opens', 'The menu folding into a ☰ button'],
      why: 'A phone has no mouse — you touch the screen with a finger. So hover doesn’t work, while clicks, page opening and ☰ do.',
    },
  },
  {
    id: 'ai_l05_q12', difficulty: 'medium', tags: ['telefon', 'mijoz'], sort: false,
    vis: { ai: {
      msg: { who: T('Mijoz', 'Клиент', 'Client'), text: T(
        "«Odamlar saytni telefondan ochadi. Pastga tushib ketsa, yozilish tugmasini topolmay qolishyapti.»",
        '«Сайт открывают с телефона. Пролистают вниз — и уже не могут найти кнопку записи».',
        '“People open the site on phones. Once they scroll down, they can’t find the sign-up button.”') },
      site: {
        title: T('Raqs studiyasi', 'Студия танцев', 'Dance studio'), em: '💃', c: '#DB2777', c2: '#9D174D', bg: '#FCE7F3', mobile: true, noFoot: true,
        nav: [T('Guruhlar', 'Группы', 'Groups'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Raqsga tushishni o'rganing!", 'Научись танцевать!', 'Learn to dance!'),
        cta: T('Yozilish', 'Записаться', 'Sign up'),
      },
    } },
    uz: {
      ctx: 'Raqs studiyasi telefondagi saytdan norozi.',
      q: "«Qanday ishlaydi?» ga qaysi qatorni qo'shamiz?",
      opts: ['telefonda yozilish tugmasi pastda doim tursin', 'tugma ustiga kelganda kattalashib, yorishsin', "yozilish tugmasi katta va yorqin bo'lsin", 'sahifa ochilganda tugma lipillab tursin'],
      why: "Mijoz telefon haqida gapiryapti. Telefonda sichqoncha yo'q, katta tugma esa baribir tepada qolib ketadi. Pastda doim turgan tugmani barmoq darrov topadi.",
    },
    ru: {
      ctx: 'Студия танцев недовольна сайтом на телефоне.',
      q: 'Какую строку добавить в «Как ведёт себя?»?',
      opts: ['на телефоне кнопка записи всегда внизу экрана', 'при наведении кнопка увеличивается и светится', 'пусть кнопка записи будет большой и яркой', 'при открытии страницы кнопка записи мигает'],
      why: 'Клиент говорит про телефон. Мыши там нет, а большая кнопка всё равно остаётся наверху. Кнопку, которая всегда внизу, палец находит сразу.',
    },
    en: {
      ctx: 'The dance studio is unhappy with the site on phones.',
      q: 'Which line do we add to “How it behaves?”?',
      opts: ['on phones, a sign-up button stays at the bottom', 'on hover, the button grows and glows', 'make the sign-up button big and bright', 'when the page opens, the sign-up button blinks'],
      why: 'The client is talking about phones. There’s no mouse there, and a big button still stays at the top. A button that’s always at the bottom is easy to find.',
    },
  },
  {
    id: 'ai_l05_q13', difficulty: 'medium', tags: ['holatlar'], sort: false,
    vis: { ai: { prompt: [
      { q: 0, t: T('Matematika olimpiadasi sayti', 'Сайт олимпиады по математике', 'A maths olympiad site') },
      { q: 5, t: T("tugma ustiga kelganda kattalashsin, telefonda menyu ☰ ga yig'ilsin", 'при наведении кнопка растёт, на телефоне меню сворачивается в ☰', 'on hover the button grows, on a phone the menu folds into ☰'), hl: true },
    ] } },
    uz: {
      ctx: "«Qanday ishlaydi?» qatoriga qarang.",
      q: 'Bu qatorda nechta harakat bor?',
      opts: ["Ikkita: har birining o'z «qachon?» qismi bor", 'Bitta: ikkalasi ham bitta tugma haqida', 'Bitta: telefon — bu harakat emas', 'Uchta: tugma, menyu va telefon'],
      why: "Birinchisi — ustiga kelganda, ikkinchisi — telefonda. «Qachon?» nechta bo'lsa, harakat ham shuncha; ularni vergul bilan yozamiz.",
    },
    ru: {
      ctx: 'Посмотри на строку «Как ведёт себя?».',
      q: 'Сколько поведений в этой строке?',
      opts: ['Два: у каждого своё «когда?»', 'Одно: оба про одну и ту же кнопку', 'Одно: телефон — это не поведение', 'Три: кнопка, меню и телефон'],
      why: 'Первое — при наведении, второе — на телефоне. Сколько «когда?», столько и поведений; их пишут через запятую.',
    },
    en: {
      ctx: 'Look at the “How it behaves?” line.',
      q: 'How many behaviours are in this line?',
      opts: ['Two: each has its own “when?”', 'One: both are about the same button', 'One: a phone isn’t a behaviour', 'Three: button, menu and phone'],
      why: 'The first is on hover, the second is on a phone. There are as many behaviours as “when?”s; we write them with commas.',
    },
  },
  {
    id: 'ai_l05_q14', difficulty: 'medium', tags: ['foyda', 'lipillash'], sort: false,
    vis: null,
    uz: {
      ctx: 'Musiqa festivali saytida hamma tugma va rasm birdan lipillab turibdi.',
      q: 'Qaysi qator saytni yaxshilaydi?',
      opts: ['sahifa ochilganda faqat asosiy tugma lipillasin', 'sahifa ochilganda hamma tugmalar lipillasin', 'sahifadagi hamma narsa lipillab, aylanib tursin', "jonli bo'lsin, hamma narsa harakatlanib tursin"],
      why: "Hamma narsa lipillasa, ko'z charchaydi va qaysi tugmani bosishni bilmaydi. Bitta asosiy tugma lipillasa, u «meni bosing» deydi.",
    },
    ru: {
      ctx: 'На сайте музыкального фестиваля мигают сразу все кнопки и картинки.',
      q: 'Какая строка сделает сайт лучше?',
      opts: ['при открытии мигает только главная кнопка', 'при открытии страницы мигают все кнопки', 'пусть всё на странице мигает и крутится', 'пусть будет живым, пусть всё двигается'],
      why: 'Когда мигает всё, глаза устают и непонятно, куда нажать. Если мигает одна главная кнопка, она говорит: «нажми меня».',
    },
    en: {
      ctx: 'On a music festival site every button and picture blinks at once.',
      q: 'Which line makes the site better?',
      opts: ['when the page opens, only the main button blinks', 'when the page opens, all the buttons blink', 'make everything on the page blink and spin', 'make it lively, make everything move'],
      why: 'When everything blinks, eyes get tired and it’s unclear what to press. One blinking main button says “press me”.',
    },
  },

  // ── HARD ──
  {
    id: 'ai_l05_q15', difficulty: 'hard', tags: ['qoshish', 'holatlar'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Novvoyxona sayti', 'Сайт пекарни', 'A bakery site') },
        { q: 5, t: T("tugma ustiga kelganda rangi o'zgarsin", 'при наведении кнопка меняет цвет', 'on hover the button changes colour'), hl: true },
      ],
      site: {
        title: T('Novvoyxona', 'Пекарня', 'Bakery'), em: '🥐', c: '#A16207', c2: '#713F12', bg: '#FEF3C7',
        cursor: 'hover', ctaHot: { bg: '#16A34A', fg: '#FFFFFF' },
        nav: [T('Non', 'Хлеб', 'Bread'), T('Pishiriqlar', 'Выпечка', 'Pastries'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Har kuni yangi', 'Свежее каждый день', 'Fresh every day'), sub: T('Issiq non va pishiriqlar!', 'Горячий хлеб и выпечка!', 'Hot bread and pastries!'),
        cta: T('Buyurtma berish', 'Заказать', 'Order'), noFoot: true,
      },
    } },
    uz: {
      ctx: "Qatorga yana qo'shamiz: «bosilganda «Rahmat!» xabari chiqsin».",
      q: "Saytda nima o'zgaradi?",
      opts: ["Bosilganda «Rahmat!» chiqadi, rang ham o'zgaradi", "Rang endi o'zgarmaydi, faqat xabar qoladi", "«Rahmat!» sahifa ochilishi bilan chiqib turadi", "Tugma doim yashil va katta bo'lib qoladi"],
      why: "Har bir harakat o'z «qachon?» qismi bilan ishlaydi. Yangisi eskisini o'chirmaydi: ustiga kelganda rang o'zgaradi, bosilganda «Rahmat!» chiqadi.",
    },
    ru: {
      ctx: 'Добавляем в строку: «при нажатии появляется «Спасибо!»».',
      q: 'Что изменится на сайте?',
      opts: ['И «Спасибо!» при нажатии, и цвет при наведении', 'Цвет больше не меняется, будет только сообщение', '«Спасибо!» висит сразу после открытия страницы', 'Кнопка навсегда станет зелёной и большой'],
      why: 'Каждое поведение работает со своим «когда?». Новое не стирает старое: при наведении меняется цвет, при нажатии появляется «Спасибо!».',
    },
    en: {
      ctx: 'We add to the line: “when it’s pressed, show “Thanks!””.',
      q: 'What changes on the site?',
      opts: ['“Thanks!” on click, and the hover colour stays', 'The colour no longer changes, just the message', '“Thanks!” shows as soon as the page opens', 'The button stays green and big forever'],
      why: 'Each behaviour works with its own “when?”. The new one doesn’t erase the old one: on hover the colour changes, on click “Thanks!” appears.',
    },
  },
  {
    id: 'ai_l05_q16', difficulty: 'hard', tags: ['jonli', 'taxmin'], sort: false,
    vis: null,
    uz: {
      ctx: "«Qanday ishlaydi?»: «jonli bo'lsin, tugma bosilganda «Rahmat!» chiqsin».",
      q: "Qatorning qaysi qismi noaniq yozilgan?",
      opts: ["«Jonli» qismini — nima sakrashini o'zi tanlaydi", "«Rahmat!» qismini — uni ochilganda chiqaradi", "Hech qaysini — ikkala qism ham aniq yozilgan", "Ikkalasini — bitta noaniq so'z hammasini buzadi"],
      why: "«Tugma bosilganda «Rahmat!» chiqsin» aniq: qachon, nima va nima bo'ladi bor. «Jonli» esa har kimga har xil — buni sun'iy intellekt o'zicha tushunadi.",
    },
    ru: {
      ctx: '«Как ведёт себя?»: «пусть будет живым, при нажатии на кнопку появляется «Спасибо!»».',
      q: 'Какая часть строки написана неточно?',
      opts: ['Часть «живым» — что прыгает, ИИ решит сам', 'Часть «Спасибо!» — покажет его при открытии', 'Никакую — обе части строки написаны точно', 'Обе части — одно неточное слово портит всё'],
      why: '«При нажатии на кнопку появляется «Спасибо!»» — точно: есть когда, что и что происходит. А «живым» каждый понимает по-своему, это ИИ решит сам.',
    },
    en: {
      ctx: '“How it behaves?”: “make it lively, when the button is pressed, show “Thanks!””.',
      q: 'Which part of the line is written vaguely?',
      opts: ['The “lively” part — it picks what jumps', 'The “Thanks!” part — it shows it on page open', 'None — both parts are written exactly', 'Both — one vague word spoils everything'],
      why: '“When the button is pressed, show “Thanks!”” is exact: it has when, what and what happens. “Lively” means something different to everyone, so the AI decides that itself.',
    },
  },
  {
    id: 'ai_l05_q17', difficulty: 'hard', tags: ['qachon', 'mijoz'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("Rasm to'garagi sayti", 'Сайт кружка рисования', 'A drawing club site') },
        { q: 1, t: T("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') },
        { q: 5, t: T("sahifa ochilganda «Rahmat!» xabari chiqsin", 'при открытии страницы появляется «Спасибо!»', 'when the page opens, show “Thanks!”'), hl: true },
      ],
      site: {
        title: T("Rasm to'garagi", 'Кружок рисования', 'Drawing club'), em: '🎨', c: '#0D9488', c2: '#115E59', bg: '#CCFBF1',
        toast: T('✅ Rahmat!', '✅ Спасибо!', '✅ Thanks!'),
        nav: [T('Darslar', 'Занятия', 'Lessons'), T('Rasmlar', 'Рисунки', 'Drawings'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Rasm chizishni birga o'rganamiz!", 'Учимся рисовать вместе!', 'Let’s learn to draw together!'),
        cta: T('Yozilish', 'Записаться', 'Sign up'), noFoot: true,
      },
    } },
    uz: {
      ctx: "Mijoz: «Odam yozilgandan keyin «Rahmat!» ni ko'rsin». Hali hech kim hech narsa bosmagan.",
      q: "Bu qatorda nima to'g'ri kelmayapti?",
      opts: ["«Qachon?» boshqa: «bosilganda» bo'lishi kerak", "«Nima bo'ladi?» yo'q: nima qilishi noma'lum", "«Nima?» yo'q: qaysi xabar ekani aytilmagan", "Hech narsa: qatorda uchala qism ham bor"],
      why: "Uchala qism bor, lekin «qachon?» boshqa: xabar sahifa ochilishi bilan chiqdi, hali hech kim yozilmagan. Kerak: «tugma bosilganda «Rahmat!» chiqsin».",
    },
    ru: {
      ctx: 'Клиент: «Пусть «Спасибо!» видят после записи». Ещё никто ничего не нажимал.',
      q: 'Что в этой строке не так?',
      opts: ['Не то «когда?»: нужно «при нажатии»', 'Нет «что происходит»: непонятно, что делать', 'Нет «что?»: непонятно, какое сообщение', 'Всё так: в строке есть все три части'],
      why: 'Все три части есть, но «когда?» не то: сообщение появилось сразу при открытии, а записи ещё не было. Нужно: «при нажатии на кнопку появляется «Спасибо!»».',
    },
    en: {
      ctx: 'Client: “People should see “Thanks!” after they sign up.” Nobody has clicked anything yet.',
      q: 'What’s wrong with this line?',
      opts: ['Wrong “when?”: it should be “on click”', 'No “what happens”: unclear what to do', 'No “what?”: unclear which message', 'Nothing: all three parts are there'],
      why: 'All three parts are there, but the “when?” is wrong: the message showed as soon as the page opened, before anyone signed up. Needed: “when the button is pressed, show “Thanks!””.',
    },
  },
  {
    id: 'ai_l05_q18', difficulty: 'hard', tags: ['hover', 'korinish'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Maktab yarmarkasi sayti', 'Сайт школьной ярмарки', 'A school fair site') },
        { q: 4, t: T("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white') },
        { q: 5, t: T("tugma ustiga kelganda sariq bo'lsin", 'при наведении кнопка становится жёлтой', 'on hover the button turns yellow'), hl: true },
      ],
      site: {
        title: T('Maktab yarmarkasi', 'Школьная ярмарка', 'School fair'), em: '🎪', c: '#2563EB', c2: '#1E40AF', bg: '#DBEAFE',
        cursor: 'hover', ctaHot: { bg: '#FACC15', fg: '#1F2937' },
        nav: [T('Rastalar', 'Лотки', 'Stalls'), T('Jadval', 'Расписание', 'Schedule'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Shanba kuni', 'В субботу', 'On Saturday'), sub: T("Qo'l ishlari va shirinliklar!", 'Поделки и сладости!', 'Crafts and sweets!'),
        cta: T('Kelaman', 'Я приду', 'I’ll come'), noFoot: true,
      },
    } },
    uz: {
      ctx: "Sichqoncha tugma ustida — tugma sariq. Endi sichqoncha tugmadan ketdi.",
      q: 'Tugma qanday bo\'ladi?',
      opts: ["Yana ko'k: sariq faqat ustiga kelganda bo'ladi", "Sariq bo'lib qoladi: rang bir marta o'zgardi", "Oq bo'ladi: «Ko'rinishi?» da oq ham bor", "Sariq va ko'k bo'lib navbat bilan lipillaydi"],
      why: "Ustiga kelganda — bu vaqtincha holat. Sichqoncha ketsa, tugma «Ko'rinishi?» dagi asosiy rangiga, ko'kka qaytadi.",
    },
    ru: {
      ctx: 'Мышь над кнопкой — кнопка жёлтая. Теперь мышь ушла с кнопки.',
      q: 'Какой станет кнопка?',
      opts: ['Снова синей: жёлтая она только при наведении', 'Останется жёлтой: цвет уже поменялся', 'Белой: в «Как выглядит?» есть и белый', 'Будет мигать то жёлтым, то синим цветом'],
      why: 'Наведение — временное состояние. Мышь ушла — и кнопка возвращается к главному цвету из «Как выглядит?», к синему.',
    },
    en: {
      ctx: 'The mouse is over the button — it’s yellow. Now the mouse leaves the button.',
      q: 'What will the button look like?',
      opts: ['Blue again: it’s yellow only on hover', 'Still yellow: the colour already changed', 'White: “How it looks?” has white too', 'It blinks yellow and blue in turns'],
      why: 'Hover is a temporary state. When the mouse leaves, the button goes back to its main colour from “How it looks?”, blue.',
    },
  },
];
