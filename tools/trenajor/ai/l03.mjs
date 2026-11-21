// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 3 «Что должно быть на сайте?» — 18 вопросов с выбором (6 easy, 8 medium, 4 hard).
// Проверяем четвёртый вопрос формулы «Ichida nima?»: блок — раздел страницы; блоки по названию, а не «hamma narsa»;
// пустая строка — общий шаблон из карточек; порядок блоков на сайте — как написан; лендинг — одна страница, блоки
// рассказом (что есть → доверие → действие); вопрос гостя → блок; лишние блоки путают; контент — настоящие цена и
// телефон только из промпта, иначе ИИ выдумывает («Taxmin»); ИИ не видит сообщение клиента — только промпт.
// Промпт — только «Nima? Nega? Kim uchun? Ichida nima?» (q 0–3). Сайты — как их собирает симулятор урока
// (tools/ai1/ai1-kit.jsx: insOf, blockEl): блоки в написанном порядке, ненаписанные цифры — с меткой «Taxmin».
// Словарь урока: blok, lending (bitta sahifali sayt), kontent (bloklar ichidagi ma'lumot), sharh, savol-javob, aloqa.
// Апостроф в узбекском — только ASCII «'». Ситуации тестов модуля (tools/aitest/l03.jsx) не повторяются.
// Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const G = T('Taxmin', 'Догадка', 'Guess');
const CLIENT = T('Mijoz', 'Клиент', 'Client');
const FOOT = T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.');

export default [
  // ── EASY ──
  {
    id: 'ai_l03_q01', difficulty: 'easy', tags: ['blok'], sort: false,
    vis: null,
    uz: {
      ctx: "Saytlar bloklardan yig'iladi.",
      q: 'Blok nima?',
      opts: ["Sahifaning bir bo'limi: menyu, rasmlar, aloqa", "Saytning ranglari, shrifti va burchaklari", 'Sahifadagi bitta tugma yoki havola', 'Sayt kimlar uchun va nega yaratilgani'],
      why: "Blok — sahifaning bir bo'limi. «Ichida nima?» qatoriga kerakli bloklarni sanab yozamiz: menyu, rasmlar, sharhlar, aloqa.",
    },
    ru: {
      ctx: 'Сайты собираются из блоков.',
      q: 'Что такое блок?',
      opts: ['Один раздел страницы: меню, фото, контакты', 'Цвета, шрифт и форма углов сайта', 'Одна кнопка или ссылка на странице', 'Для кого и зачем сделан сайт'],
      why: 'Блок — один раздел страницы. В строку «Что внутри?» перечисляем нужные блоки: меню, фото, отзывы, контакты.',
    },
    en: {
      ctx: 'Sites are built from blocks.',
      q: 'What is a block?',
      opts: ['One section of the page: menu, photos, contact', 'The site’s colours, font and corner shapes', 'A single button or link on the page', 'Who the site is for and why it exists'],
      why: 'A block is one section of the page. In the “What’s inside?” line we list the blocks we need: menu, photos, reviews, contact.',
    },
  },
  {
    id: 'ai_l03_q02', difficulty: 'easy', tags: ['bloklar'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("Hayvonot bog'i sayti", 'Сайт зоопарка', 'A zoo site') },
        { q: 1, t: T('oilalar chipta olsin', 'чтобы семьи покупали билеты', 'get families to buy tickets') },
        { q: 2, t: T('bolali oilalar', 'семьи с детьми', 'families with kids') },
        { q: 3, t: null },
      ],
    } },
    uz: {
      ctx: "Oilalar so'raydi: qanday hayvonlar bor, chipta qancha, bog' qayerda?",
      q: "Qaysi «Ichida nima?» sun'iy intellektga ko'proq yordam beradi?",
      opts: ['hayvonlar rasmlari, chipta narxi, manzil', "hayvonot bog'i haqida kerakli hamma narsa", "eng qiziqarli va chiroyli bo'limlar", "oilalarga yoqadigan zo'r bloklar bo'lsin"],
      why: "Bloklar nomma-nom aytilgan va oilalarning uchta savoliga javob beradi. «Hamma narsa»dan sun'iy intellekt blok yasay olmaydi.",
    },
    ru: {
      ctx: 'Семьи спрашивают: какие есть звери, сколько стоит билет, где зоопарк?',
      q: 'Какая строка «Что внутри?» больше поможет ИИ?',
      opts: ['фото зверей, цены билетов, адрес', 'всё, что нужно знать про зоопарк', 'самые интересные и красивые разделы', 'классные блоки, которые понравятся семьям'],
      why: 'Блоки названы по имени и отвечают на три вопроса семей. Из «всего» ИИ блоки не соберёт.',
    },
    en: {
      ctx: 'Families ask: what animals are there, how much is a ticket, where is the zoo?',
      q: 'Which “What’s inside?” line helps the AI more?',
      opts: ['animal photos, ticket prices, address', 'everything you need to know about the zoo', 'the most interesting, prettiest sections', 'cool blocks that families will love'],
      why: 'The blocks are named and answer the families’ three questions. The AI can’t build blocks out of “everything”.',
    },
  },
  {
    id: 'ai_l03_q03', difficulty: 'easy', tags: ['mehmon-savoli'], sort: false,
    vis: { ai: {
      msg: { who: T('Mehmon', 'Гость', 'Visitor'), text: T('«Bu maktabda kim dars beradi?»', '«Кто преподаёт в этой школе?»', '“Who teaches at this school?”') },
    } },
    uz: {
      ctx: 'Musiqa maktabi saytiga mehmon kirdi.',
      q: 'Mehmon javobni qaysi blokdan topadi?',
      opts: ['Ustozlar', 'Jadval', 'Narxlar', 'Rasmlar'],
      why: "«Kim?» degan savolga ustozlar bloki javob beradi: unda o'qituvchilar haqida yoziladi.",
    },
    ru: {
      ctx: 'На сайт музыкальной школы зашёл гость.',
      q: 'В каком блоке гость найдёт ответ?',
      opts: ['Учителя', 'Расписание', 'Цены', 'Фото'],
      why: 'На вопрос «кто?» отвечает блок учителей: в нём рассказано о преподавателях.',
    },
    en: {
      ctx: 'A visitor opens the music school site.',
      q: 'Which block will the visitor find the answer in?',
      opts: ['Teachers', 'Schedule', 'Prices', 'Photos'],
      why: 'A “who?” question is answered by the teachers block: it tells you about the teachers.',
    },
  },
  {
    id: 'ai_l03_q04', difficulty: 'easy', tags: ['lending'], sort: false,
    vis: null,
    uz: {
      ctx: '«Bizga lending kerak», — deydi mijoz.',
      q: 'Lending nima?',
      opts: ['Bitta sahifali sayt: bloklar ketma-ket keladi', "Ko'p sahifali katta sayt, har blok alohida", 'Saytning eng tepasidagi katta banner', "Saytning pastidagi ro'yxatdan o'tish formasi"],
      why: "Lending — bitta sahifa. Bloklar hikoyadek ketma-ket keladi: oldin nima borligi, keyin ishonch, oxirida harakat.",
    },
    ru: {
      ctx: '«Нам нужен лендинг», — говорит клиент.',
      q: 'Что такое лендинг?',
      opts: ['Одностраничный сайт: блоки идут друг за другом', 'Большой многостраничный сайт, блок — страница', 'Большой баннер в самом верху сайта', 'Форма записи или заказа внизу сайта'],
      why: 'Лендинг — одна страница. Блоки идут как рассказ: сначала что у нас есть, потом доверие, в конце действие.',
    },
    en: {
      ctx: '“We need a landing page,” says the client.',
      q: 'What is a landing page?',
      opts: ['A one-page site with blocks one after another', 'A big site with many pages, a page per block', 'The big banner at the very top of a site', 'The sign-up or order form at the bottom'],
      why: 'A landing page is one page. Its blocks go like a story: first what we offer, then trust, and finally action.',
    },
  },
  {
    id: 'ai_l03_q05', difficulty: 'easy', tags: ['kontent'], sort: false,
    vis: null,
    uz: {
      ctx: 'Bloklar tayyor: narxlar va aloqa.',
      q: 'Kontent nima?',
      opts: ["Bloklar ichidagi ma'lumot: narx, telefon, matn", 'Bloklarning saytda qaysi tartibda turishi', 'Saytning ranglari, burchaklari va shrifti', 'Sayt kimlar uchun va nega yaratilgani'],
      why: "Kontent — bloklar ichidagi ma'lumot. Narx yoki telefon yozilmasa, sun'iy intellekt ularni o'zi o'ylab topadi.",
    },
    ru: {
      ctx: 'Блоки готовы: цены и контакты.',
      q: 'Что такое контент?',
      opts: ['Данные внутри блоков: цена, телефон, текст', 'В каком порядке блоки стоят на сайте', 'Цвета, углы и шрифт всего сайта', 'Для кого и зачем сделан сайт'],
      why: 'Контент — данные внутри блоков. Если не написать цену или телефон, ИИ придумает их сам.',
    },
    en: {
      ctx: 'The blocks are ready: prices and contact.',
      q: 'What is content?',
      opts: ['The details inside blocks: price, phone, text', 'The order the blocks go in on the site', 'The site’s colours, corners and font', 'Who the site is for and why it exists'],
      why: 'Content is the details inside the blocks. If you don’t write the price or phone, the AI makes them up.',
    },
  },
  {
    id: 'ai_l03_q06', difficulty: 'easy', tags: ['formula'], sort: false,
    vis: null,
    uz: {
      ctx: "Shaxmat to'garagi uchun to'rt qator yozildi, lekin ular aralashib ketdi.",
      q: "Qaysi qator «Ichida nima?» joyiga tushadi?",
      opts: ['jadval, ustozlar, aloqa', "bolalar to'garakka yozilsin", '8–11 yoshli bolalar', "Shaxmat to'garagi sayti"],
      why: "«Ichida nima?» — saytdagi bloklar ro'yxati. Qolganlari: «Nima?» — sayt, «Nega?» — maqsad, «Kim uchun?» — auditoriya.",
    },
    ru: {
      ctx: 'Для шахматного кружка написали четыре строки, но они перепутались.',
      q: 'Какая строка — для «Что внутри?»?',
      opts: ['расписание, тренеры, контакты', 'чтобы дети записывались в кружок', 'дети 8–11 лет', 'Сайт шахматного кружка'],
      why: '«Что внутри?» — список блоков сайта. Остальные строки: «Что?» — сайт, «Зачем?» — цель, «Для кого?» — аудитория.',
    },
    en: {
      ctx: 'Four lines were written for a chess club, but they got mixed up.',
      q: 'Which line belongs in “What’s inside?”?',
      opts: ['schedule, coaches, contact', 'get kids to join the club', 'kids aged 8–11', 'A chess club site'],
      why: '“What’s inside?” is the list of the site’s blocks. The others: “What?” is the site, “Why?” the goal, “For whom?” the audience.',
    },
  },

  // ── MEDIUM ──
  {
    id: 'ai_l03_q07', difficulty: 'medium', tags: ['bosh-qator', 'shablon'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Kuzgi yarmarka sayti', 'Сайт осенней ярмарки', 'An autumn fair site') },
        { q: 1, t: T('odamlar yarmarkaga kelsin', 'чтобы люди пришли на ярмарку', 'get people to come to the fair') },
        { q: 2, t: T('mahalladagi oilalar', 'семьи нашего района', 'families in our neighbourhood') },
        { q: 3, t: null },
      ],
      site: {
        title: T('Kuzgi yarmarka', 'Осенняя ярмарка', 'Autumn fair'), em: '🍎', c: '#EA580C', c2: '#9A3412', bg: '#FFEDD5', noFoot: true,
        nav: [T('Biz haqimizda', 'О нас', 'About'), T('Xizmatlar', 'Услуги', 'Services'), T("Bog'lanish", 'Связь', 'Contact')],
        badge: T('Oktabr · 2026', 'Октябрь · 2026', 'October · 2026'), sub: T('Oilangiz bilan keling!', 'Приходи всей семьёй!', 'Come with your family!'), cta: T('Qanday borish mumkin', 'Как добраться', 'How to get there'),
        cards: [
          { ic: '⭐', h: T('Afzalliklar', 'Преимущества', 'Benefits'), p: T('Nega aynan biz', 'Почему мы', 'Why us') },
          { ic: '💡', h: T('Xizmatlar', 'Услуги', 'Services'), p: T('Biz nima qilamiz', 'Что мы делаем', 'What we do') },
          { ic: '📞', h: T("Bog'lanish", 'Связь', 'Contact'), p: T('Bizga yozing', 'Напиши нам', 'Write to us') },
        ],
      },
    } },
    uz: {
      ctx: "«Ichida nima?» bo'sh qoldi. Mehmon esa mahsulotlar va narxlarni qidiryapti.",
      q: 'Nega saytda faqat uchta umumiy kartochka bor?',
      opts: ["Bloklar yozilmagan, u shablon qo'ydi", 'U yarmarkaga uchta blok yetarli deb bildi', 'Sayt hali oxirigacha yuklanib bo\'lmagan', 'Kartochkalar mehmon uchun eng yaxshi blok'],
      why: "«Ichida nima?» bo'sh bo'lsa, sun'iy intellekt umumiy shablon qo'yadi. Mehmonga kerakli bloklarni o'zingiz yozasiz.",
    },
    ru: {
      ctx: '«Что внутри?» пустая. А гость ищет товары и цены.',
      q: 'Почему на сайте только три общие карточки?',
      opts: ['Блоки не написаны — ИИ поставил шаблон', 'ИИ решил, что ярмарке хватит трёх блоков', 'Сайт ещё не догрузился до конца', 'Карточки — лучший блок для гостей'],
      why: 'Если «Что внутри?» пустая, ИИ ставит общий шаблон. Блоки, нужные гостю, в промпт пишешь ты.',
    },
    en: {
      ctx: '“What’s inside?” is empty. But visitors want the goods and prices.',
      q: 'Why does the site only have three generic cards?',
      opts: ['No blocks were written, so it used a template', 'The AI decided three blocks are enough', 'The site hasn’t finished loading yet', 'Cards are the best block for visitors'],
      why: 'If “What’s inside?” is empty, the AI uses a generic template. You write the blocks the visitor needs yourself.',
    },
  },
  {
    id: 'ai_l03_q08', difficulty: 'medium', tags: ['tartib'], sort: false,
    vis: { ai: {
      site: {
        title: T('Bolalar kutubxonasi', 'Детская библиотека', 'Children’s library'), em: '📚', c: '#2563EB', c2: '#1E3A8A', bg: '#DBEAFE', noFoot: true,
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Qoidalar', 'Правила', 'Rules'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T("Kitob o'qish bepul", 'Читать бесплатно', 'Reading is free'), sub: T('Har hafta yangi kitoblar!', 'Новые книги каждую неделю!', 'New books every week!'), cta: T("A'zo bo'lish", 'Записаться', 'Join'),
        blocks: [
          { h: T('Jadval', 'Расписание', 'Schedule'), items: [{ t: T('Dushanba–Juma · 9:00–18:00', 'Пн–Пт · 9:00–18:00', 'Mon–Fri · 9:00–18:00') }, { t: T('Shanba · 10:00–15:00', 'Суббота · 10:00–15:00', 'Saturday · 10:00–15:00') }] },
          { h: T('Qoidalar', 'Правила', 'Rules'), items: [{ t: T('✅ Kitobni 2 haftada qaytaring', '✅ Верни книгу за 2 недели', '✅ Return books in 2 weeks') }, { t: T("✅ Zalda jim o'tiring", '✅ В зале тихо', '✅ Keep quiet in the hall') }] },
          { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: T("📍 Navoiy ko'chasi, 7", '📍 ул. Навои, 7', '📍 7 Navoi street'), wide: true }] },
        ],
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Sun'iy intellekt kutubxona uchun shu saytni yaratdi.",
      q: "Promptdagi «Ichida nima?» qanday edi?",
      opts: ['jadval, qoidalar, aloqa', 'aloqa, qoidalar, jadval', 'qoidalar, jadval, aloqa', 'jadval va aloqa, qoidasiz'],
      why: "Sun'iy intellekt bloklarni yozilgan tartibda qo'yadi. Saytda tepadan pastga: jadval, qoidalar, aloqa.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт для библиотеки.',
      q: 'Какой была строка «Что внутри?» в промпте?',
      opts: ['расписание, правила, контакты', 'контакты, правила, расписание', 'правила, расписание, контакты', 'расписание и контакты, без правил'],
      why: 'ИИ ставит блоки в написанном порядке. На сайте сверху вниз: расписание, правила, контакты.',
    },
    en: {
      ctx: 'The AI made this site for a library.',
      q: 'What did the “What’s inside?” line say?',
      opts: ['schedule, rules, contact', 'contact, rules, schedule', 'rules, schedule, contact', 'schedule and contact, no rules'],
      why: 'The AI places blocks in the written order. On the site, top to bottom: schedule, rules, contact.',
    },
  },
  {
    id: 'ai_l03_q09', difficulty: 'medium', tags: ['tartib'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Batut markazi sayti', 'Сайт батутного центра', 'A trampoline park site') },
        { q: 1, t: T('bolalar sakrashga kelsin', 'чтобы дети приходили прыгать', 'get kids to come and jump') },
        { q: 2, t: T('6–12 yoshli bolalar', 'дети 6–12 лет', 'kids aged 6–12') },
        { q: 3, t: T('aloqa, rasmlar, sharhlar', 'контакты, фото, отзывы', 'contact, photos, reviews'), hl: true },
      ],
    } },
    uz: {
      ctx: "Sun'iy intellekt shu prompt bo'yicha sayt yaratadi.",
      q: 'Bannerdan keyin qaysi blok birinchi chiqadi?',
      opts: ['Aloqa: u birinchi yozilgan', "Rasmlar: mehmon oldin ularni ko'radi", 'Sharhlar: ishonch eng muhimi', "Sun'iy intellekt tartibni o'zi tanlaydi"],
      why: "Sun'iy intellekt yozilgan tartibni saqlaydi, shuning uchun aloqa birinchi chiqadi. Lending uchun uni oxiriga yozish kerak.",
    },
    ru: {
      ctx: 'ИИ сделает сайт по этому промпту.',
      q: 'Какой блок будет первым после баннера?',
      opts: ['Контакты: они написаны первыми', 'Фото: гость сначала смотрит их', 'Отзывы: доверие важнее всего', 'ИИ сам выберет порядок блоков'],
      why: 'ИИ сохраняет написанный порядок, поэтому контакты будут первыми. Для лендинга их пишут в конце.',
    },
    en: {
      ctx: 'The AI will build a site from this prompt.',
      q: 'Which block comes first after the banner?',
      opts: ['Contact: it’s written first', 'Photos: visitors look at them first', 'Reviews: trust matters most', 'The AI picks the order itself'],
      why: 'The AI keeps the written order, so contact comes first. For a landing page, it goes at the end.',
    },
  },
  {
    id: 'ai_l03_q10', difficulty: 'medium', tags: ['lending', 'tartib'], sort: false,
    vis: null,
    uz: {
      ctx: "Robotlar ko'rgazmasiga lending kerak. To'rtta blok tanlandi.",
      q: 'Qaysi tartib lendingga mos?',
      opts: ['rasmlar, narxlar, sharhlar, aloqa', 'aloqa, narxlar, sharhlar, rasmlar', 'sharhlar, aloqa, rasmlar, narxlar', 'narxlar, aloqa, rasmlar, sharhlar'],
      why: "Lending hikoyadek o'qiladi: oldin rasmlar nima borligini ko'rsatadi, keyin narx va sharhlar ishonch beradi, oxirida aloqa.",
    },
    ru: {
      ctx: 'Выставке роботов нужен лендинг. Выбраны четыре блока.',
      q: 'Какой порядок подходит лендингу?',
      opts: ['фото, цены, отзывы, контакты', 'контакты, цены, отзывы, фото', 'отзывы, контакты, фото, цены', 'цены, контакты, фото, отзывы'],
      why: 'Лендинг читается как рассказ: сначала что у нас есть (фото), потом цена и доверие (отзывы), в конце действие (контакты).',
    },
    en: {
      ctx: 'A robot show needs a landing page. Four blocks are chosen.',
      q: 'Which order suits a landing page?',
      opts: ['photos, prices, reviews, contact', 'contact, prices, reviews, photos', 'reviews, contact, photos, prices', 'prices, contact, photos, reviews'],
      why: 'A landing page reads like a story: first what we offer (photos), then price and trust (reviews), and finally action (contact).',
    },
  },
  {
    id: 'ai_l03_q11', difficulty: 'medium', tags: ['kontent', 'taxmin'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Musiqa maktabi sayti', 'Сайт музыкальной школы', 'A music school site') },
        { q: 1, t: T('bolalar darsga yozilsin', 'чтобы дети записывались на уроки', 'get kids to sign up for lessons') },
        { q: 2, t: T('7–14 yoshli bolalar', 'дети 7–14 лет', 'kids aged 7–14') },
        { q: 3, t: T('narxlar, aloqa', 'цены, контакты', 'prices, contact'), hl: true },
      ],
      site: {
        title: T('Musiqa maktabi', 'Музыкальная школа', 'Music school'), em: '🎹', c: '#7C3AED', c2: '#5B21B6', bg: '#EDE9FE', noFoot: true,
        nav: [T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact'), T('Biz haqimizda', 'О нас', 'About')],
        badge: T('Yangi guruhlar', 'Новые группы', 'New groups'), sub: T('Pianino va gitara darslari', 'Уроки фортепиано и гитары', 'Piano and guitar lessons'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        blocks: [
          { h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Asosiy', 'Базовый', 'Basic'), p: T("50 000 so'm", '50 000 сум', '50,000 sum'), guess: G }, { t: T('Standart', 'Стандарт', 'Standard'), p: T("90 000 so'm", '90 000 сум', '90,000 sum'), guess: G }] },
          { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 90 123 45 67', guess: G, wide: true }] },
        ],
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Saytda narx va telefon yonida «Taxmin» turibdi.",
      q: "«Taxmin» yo'qolishi uchun «Ichida nima?» ga nima qo'shamiz?",
      opts: ['haqiqiy narx va telefon raqamini', "«raqamlar to'g'ri bo'lsin» degan iltimosni", "yana ikki blokni: rasmlar va sharhlar", "«Taxmin» belgisini olib tashla, degan so'zni"],
      why: "«Taxmin» — sun'iy intellekt o'ylab topgan raqam. Haqiqiy narx va telefonni promptga o'zingiz yozsangiz, saytda aynan ular chiqadi.",
    },
    ru: {
      ctx: 'На сайте рядом с ценой и телефоном стоит «Догадка».',
      q: 'Что добавить в «Что внутри?», чтобы «Догадка» исчезла?',
      opts: ['настоящие цену и номер телефона', 'просьбу «пусть цифры будут верными»', 'ещё два блока: фото и отзывы', 'слова «убери метку Догадка»'],
      why: '«Догадка» — цифра, которую придумал ИИ. Если написать в промпт настоящие цену и телефон, на сайте будут именно они.',
    },
    en: {
      ctx: 'On the site, the price and phone have a “Guess” tag.',
      q: 'What do we add to “What’s inside?” to remove “Guess”?',
      opts: ['the real price and phone number', 'a request: “make the numbers right”', 'two more blocks: photos and reviews', 'the words “remove the Guess tag”'],
      why: '“Guess” marks a number the AI made up. If you write the real price and phone in the prompt yourself, the site shows exactly those.',
    },
  },
  {
    id: 'ai_l03_q12', difficulty: 'medium', tags: ['kontent'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Bir oy — 180 000 so'm. Telefonimiz: +998 93 111 22 33. Saytda narx va aloqa bo'lsin.»", '«Месяц — 180 000 сум. Наш телефон: +998 93 111 22 33. На сайте нужны цена и контакты».', '“One month is 180,000 sum. Our phone: +998 93 111 22 33. Put the price and contact on the site.”') },
      prompt: [
        { q: 0, t: T("Kulolchilik to'garagi sayti", 'Сайт гончарного кружка', 'A pottery club site') },
        { q: 1, t: T("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to join the club') },
        { q: 2, t: T('10–14 yoshli bolalar', 'дети 10–14 лет', 'kids aged 10–14') },
        { q: 3, t: null },
      ],
    } },
    uz: {
      ctx: 'Mijoz haqiqiy narx va telefonni yubordi.',
      q: "Qaysi «Ichida nima?» saytga haqiqiy raqamlarni beradi?",
      opts: ["narx: 180 000 so'm, aloqa: +998 93 111 22 33", "narx va aloqa, raqamlar haqiqiy bo'lsin", 'narx: xabardagi narx, aloqa: xabardagi raqam', 'narx: arzon va qulay, aloqa: telefonimiz'],
      why: "Sun'iy intellekt faqat promptdagi raqamlarni qo'yadi. Narx va telefon raqam bilan yozilsa, saytda «Taxmin» bo'lmaydi.",
    },
    ru: {
      ctx: 'Клиент прислал настоящие цену и телефон.',
      q: 'Какая строка «Что внутри?» даст сайту настоящие цифры?',
      opts: ['цена: 180 000 сум, контакты: +998 93 111 22 33', 'цена и контакты, цифры настоящие', 'цена: из сообщения, контакты: из сообщения', 'цена: недорого, контакты: наш телефон'],
      why: 'ИИ ставит только цифры из промпта. Если цена и телефон написаны цифрами, «Догадки» на сайте не будет.',
    },
    en: {
      ctx: 'The client sent the real price and phone.',
      q: 'Which “What’s inside?” line puts the real numbers on the site?',
      opts: ['price: 180,000 sum, contact: +998 93 111 22 33', 'price and contact, real numbers please', 'price: from the message, contact: from it too', 'price: cheap, contact: our phone number'],
      why: 'The AI only uses the numbers in the prompt. If the price and phone are written as numbers, there’s no “Guess” on the site.',
    },
  },
  {
    id: 'ai_l03_q13', difficulty: 'medium', tags: ['ortiqcha-blok'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Mehmonga muzqaymoqlar menyusi va manzilimiz kerak, xolos. Boshqa narsa shart emas.»", '«Гостю нужны только меню мороженого и наш адрес. Больше ничего не надо».', '“Visitors only need our ice cream menu and our address. Nothing else.”') },
    } },
    uz: {
      ctx: "Muzqaymoq do'koni egasi buyurtmani tushuntiryapti.",
      q: "Qaysi «Ichida nima?» buyurtmaga mos?",
      opts: ['menyu, aloqa', 'menyu, jadval, ustozlar, qoidalar, aloqa', 'menyu, aloqa va yana hamma bloklar', 'rasmlar, sharhlar, savol-javob, aloqa'],
      why: "Ortiqcha bloklar mehmonni adashtiradi. Mijoz ikki narsani so'radi: menyu va manzil, demak ikki blok yetadi.",
    },
    ru: {
      ctx: 'Владелец киоска с мороженым объясняет заказ.',
      q: 'Какая строка «Что внутри?» подходит заказу?',
      opts: ['меню, контакты', 'меню, расписание, тренеры, правила, контакты', 'меню, контакты и все остальные блоки', 'фото, отзывы, вопросы и ответы, контакты'],
      why: 'Лишние блоки путают гостя. Клиент просил две вещи — меню и адрес, значит, хватит двух блоков.',
    },
    en: {
      ctx: 'The ice cream kiosk owner explains the order.',
      q: 'Which “What’s inside?” line fits the order?',
      opts: ['menu, contact', 'menu, schedule, coaches, rules, contact', 'menu, contact and all the other blocks', 'photos, reviews, FAQ, contact'],
      why: 'Extra blocks confuse visitors. The client asked for two things, the menu and the address, so two blocks are enough.',
    },
  },
  {
    id: 'ai_l03_q14', difficulty: 'medium', tags: ['yetishmaydi'], sort: false,
    vis: { ai: {
      site: {
        title: T('Akvapark', 'Аквапарк', 'Water park'), em: '🌊', c: '#0891B2', c2: '#155E75', bg: '#CFFAFE', noFoot: true,
        nav: [T('Rasmlar', 'Фото', 'Photos'), T('Narxlar', 'Цены', 'Prices')],
        badge: T('Yozgi mavsum', 'Летний сезон', 'Summer season'), sub: T('Butun oila bilan dam oling!', 'Отдыхай всей семьёй!', 'Have fun with the whole family!'), cta: T('Chipta olish', 'Купить билет', 'Buy a ticket'),
        blocks: [
          { h: T('Rasmlar', 'Фото', 'Photos'), items: [{ t: T('🌊 Basseyn', '🌊 Бассейн', '🌊 Pool') }, { t: T('🛝 Tepaliklar', '🛝 Горки', '🛝 Slides') }, { t: T('🏖️ Plyaj', '🏖️ Пляж', '🏖️ Beach') }] },
          { h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Kattalar', 'Взрослые', 'Adults'), p: T("120 000 so'm", '120 000 сум', '120,000 sum') }, { t: T('Bolalar', 'Дети', 'Kids'), p: T("80 000 so'm", '80 000 сум', '80,000 sum') }] },
        ],
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Ona so'raydi: «Akvaparkda qanday qoidalar bor? Bolani yolg'iz qo'yish mumkinmi?»",
      q: 'Javob uchun saytga qaysi blok yetishmaydi?',
      opts: ['Qoidalar bloki', 'Sharhlar bloki', 'Yana bir rasmlar bloki', 'Biz haqimizda bloki'],
      why: "Ona qoidalar haqida so'rayapti, saytda esa faqat rasmlar va narxlar bor. «Ichida nima?» ga qoidalar blokini qo'shamiz.",
    },
    ru: {
      ctx: 'Мама спрашивает: «Какие в аквапарке правила? Можно оставить ребёнка одного?»',
      q: 'Какого блока на сайте не хватает для ответа?',
      opts: ['Блока правил', 'Блока отзывов', 'Ещё одного блока фото', 'Блока «О нас»'],
      why: 'Мама спрашивает о правилах, а на сайте только фото и цены. Добавляем в «Что внутри?» блок правил.',
    },
    en: {
      ctx: 'A mum asks: “What are the water park rules? Can I leave my child alone?”',
      q: 'Which block is the site missing for the answer?',
      opts: ['A rules block', 'A reviews block', 'Another photos block', 'An about us block'],
      why: 'The mum is asking about rules, but the site only has photos and prices. We add a rules block to “What’s inside?”.',
    },
  },

  // ── HARD ──
  {
    id: 'ai_l03_q15', difficulty: 'hard', tags: ['kontent', 'taxmin'], sort: false,
    vis: { ai: {
      site: {
        title: T('Karting klubi', 'Картинг-клуб', 'Go-kart club'), em: '🏎️', c: '#DC2626', c2: '#991B1B', bg: '#FEE2E2', noFoot: true,
        nav: [T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi trassa', 'Новая трасса', 'New track'), sub: T('Tezlikni his qiling!', 'Почувствуй скорость!', 'Feel the speed!'), cta: T('Joy band qilish', 'Забронировать', 'Book a ride'),
        blocks: [
          { h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Asosiy', 'Базовый', 'Basic'), p: T("50 000 so'm", '50 000 сум', '50,000 sum'), guess: G }, { t: T('Standart', 'Стандарт', 'Standard'), p: T("90 000 so'm", '90 000 сум', '90,000 sum'), guess: G }] },
          { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 97 765 43 21', wide: true }] },
        ],
      },
      focus: '.blk',
    } },
    uz: {
      ctx: 'Narxlar va telefonga diqqat bilan qarang.',
      q: "Qaysi «Ichida nima?» shu saytni bergan?",
      opts: ['narxlar, aloqa: +998 97 765 43 21', "narxlar: 50 000 so'm, aloqa", "narxlar: 50 000 so'm, aloqa: +998 97 765 43 21", "hamma narsa bo'lsin, telefon ham"],
      why: "Telefon promptda yozilgan, u haqiqiy. Narx yozilmagan, shuning uchun sun'iy intellekt uni o'ylab topdi va «Taxmin» qo'ydi.",
    },
    ru: {
      ctx: 'Посмотри внимательно на цены и телефон.',
      q: 'Какая строка «Что внутри?» дала этот сайт?',
      opts: ['цены, контакты: +998 97 765 43 21', 'цены: 50 000 сум, контакты', 'цены: 50 000 сум, контакты: +998 97 765 43 21', 'пусть будет всё, и телефон тоже'],
      why: 'Телефон написан в промпте — он настоящий. Цены не написаны, поэтому ИИ их придумал и поставил «Догадку».',
    },
    en: {
      ctx: 'Look closely at the prices and the phone.',
      q: 'Which “What’s inside?” line gave this site?',
      opts: ['prices, contact: +998 97 765 43 21', 'prices: 50,000 sum, contact', 'prices: 50,000 sum, contact: +998 97 765 43 21', 'everything, and the phone too'],
      why: 'The phone is written in the prompt, so it’s real. The prices aren’t, so the AI made them up and tagged them “Guess”.',
    },
  },
  {
    id: 'ai_l03_q16', difficulty: 'hard', tags: ['mehmon-savoli', 'bloklar'], sort: false,
    vis: { ai: {
      msg: { who: T('Ota-onalar', 'Родители', 'Parents'), text: T("«Kim o'rgatadi? Boshqa ota-onalar nima deydi? Darslar qachon boshlanadi?»", '«Кто учит? Что говорят другие родители? Когда начинаются занятия?»', '“Who teaches? What do other parents say? When do lessons start?”') },
      prompt: [
        { q: 0, t: T('Rasm studiyasi sayti', 'Сайт студии рисования', 'An art studio site') },
        { q: 1, t: T('bolalar darsga yozilsin', 'чтобы дети записывались на занятия', 'get kids to sign up for lessons') },
        { q: 2, t: T('8–12 yoshli bolalar', 'дети 8–12 лет', 'kids aged 8–12') },
        { q: 3, t: null },
      ],
    } },
    uz: {
      ctx: 'Ota-onalar studiyaga shunday savollar berishadi.',
      q: "Qaysi «Ichida nima?» uchala savolga javob beradi?",
      opts: ['ustozlar, sharhlar, jadval', 'ustozlar, rasmlar, narxlar', 'sharhlar, aloqa, narxlar', 'jadval, narxlar, aloqa'],
      why: "«Kim?» — ustozlar, «boshqalar nima deydi?» — sharhlar, «qachon?» — jadval. Har bir savolga bitta blok.",
    },
    ru: {
      ctx: 'Родители задают студии такие вопросы.',
      q: 'Какая строка «Что внутри?» отвечает на все три?',
      opts: ['учителя, отзывы, расписание', 'учителя, фото, цены', 'отзывы, контакты, цены', 'расписание, цены, контакты'],
      why: '«Кто?» — учителя, «что говорят другие?» — отзывы, «когда?» — расписание. На каждый вопрос — свой блок.',
    },
    en: {
      ctx: 'Parents ask the studio these questions.',
      q: 'Which “What’s inside?” line answers all three?',
      opts: ['teachers, reviews, schedule', 'teachers, photos, prices', 'reviews, contact, prices', 'schedule, prices, contact'],
      why: '“Who?” is teachers, “what do others say?” is reviews, “when?” is schedule. One block for each question.',
    },
  },
  {
    id: 'ai_l03_q17', difficulty: 'hard', tags: ['tartib', 'lending'], sort: false,
    vis: { ai: {
      site: {
        title: T("Tortlar do'koni", 'Магазин тортов', 'Cake shop'), em: '🎂', c: '#B45309', c2: '#78350F', bg: '#FEF3C7', noFoot: true,
        nav: [T('Aloqa', 'Контакты', 'Contact'), T('Rasmlar', 'Фото', 'Photos'), T('Sharhlar', 'Отзывы', 'Reviews')],
        badge: T('Buyurtma bilan', 'На заказ', 'Made to order'), sub: T("Har bir bayramga o'z torti!", 'Свой торт к каждому празднику!', 'A cake for every party!'), cta: T('Buyurtma berish', 'Заказать', 'Order'),
        blocks: [
          { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 90 321 54 76' }, { t: T("📍 Yunusobod, 4", '📍 Юнусабад, 4', '📍 Yunusabad, 4') }] },
          { h: T('Rasmlar', 'Фото', 'Photos'), items: [{ t: '🎂' }, { t: '🧁' }, { t: '🍰' }] },
          { h: T('Sharhlar', 'Отзывы', 'Reviews'), items: [{ t: T('«Juda mazali!»', '«Очень вкусно!»', '“So tasty!”'), wide: true }] },
        ],
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Mijoz lending so'radi, lekin saytda aloqa eng tepada turibdi.",
      q: 'Buni qanday tuzatamiz?',
      opts: ["Promptda aloqani oxiriga ko'chirib yozamiz", "«Nega?» ga «tartibli bo'lsin» deb qo'shamiz", "Aloqa blokini promptdan butunlay o'chiramiz", "Oxiriga yana bitta aloqa blokini qo'shamiz"],
      why: "Sun'iy intellekt bloklarni yozilgan tartibda qo'yadi. Aloqani oxiriga yozsak — rasmlar, sharhlar, aloqa — lending tayyor.",
    },
    ru: {
      ctx: 'Клиент просил лендинг, а контакты на сайте в самом верху.',
      q: 'Как это исправить?',
      opts: ['В промпте переносим контакты в конец', 'Добавляем в «Зачем?»: «пусть будет по порядку»', 'Совсем убираем контакты из промпта', 'Добавляем в конец ещё один блок контактов'],
      why: 'ИИ ставит блоки в написанном порядке. Пишем контакты в конце — фото, отзывы, контакты — и лендинг готов.',
    },
    en: {
      ctx: 'The client asked for a landing page, but contact is at the very top.',
      q: 'How do we fix this?',
      opts: ['Move contact to the end of the prompt line', 'Add “keep it in order” to the “Why?” line', 'Remove contact from the prompt completely', 'Add a second contact block at the end'],
      why: 'The AI places blocks in the written order. Write contact last (photos, reviews, contact) and the landing page is ready.',
    },
  },
  {
    id: 'ai_l03_q18', difficulty: 'hard', tags: ['kontent', 'taxmin'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Bir soat velosiped — 20 000 so'm. Saytda narxlar bo'lsin.»", '«Час на велосипеде — 20 000 сум. На сайте нужны цены».', '“One hour on a bike is 20,000 sum. Put prices on the site.”') },
      prompt: [
        { q: 0, t: T('Velosiped ijarasi sayti', 'Сайт проката велосипедов', 'A bike rental site') },
        { q: 1, t: T('odamlar velosiped ijaraga olsin', 'чтобы люди брали велосипеды', 'get people to rent bikes') },
        { q: 2, t: T("sayrni yaxshi ko'radigan o'smirlar", 'подростки, которые любят кататься', 'teens who love to ride') },
        { q: 3, t: T('narxlar, aloqa', 'цены, контакты', 'prices, contact'), hl: true },
      ],
    } },
    uz: {
      ctx: "Mijoz narxni aytdi, lekin «Ichida nima?» ga «narxlar, aloqa» deb yozildi.",
      q: 'Saytda qanday narx chiqadi?',
      opts: ["O'ylab topilgan narx, «Taxmin» belgisi bilan", "Mijoz aytgan narx: soatiga 20 000 so'm", "Narx o'rnida bo'sh joy qoladi", 'Narxlar bloki saytda umuman chiqmaydi'],
      why: "Sun'iy intellekt mijoz xabarini ko'rmaydi, faqat promptni o'qiydi. Promptda raqam yo'q, shuning uchun narxni o'zi o'ylab topadi.",
    },
    ru: {
      ctx: 'Клиент назвал цену, а в «Что внутри?» написали «цены, контакты».',
      q: 'Какая цена будет на сайте?',
      opts: ['Придуманная, с меткой «Догадка»', 'Цена клиента: 20 000 сум в час', 'На месте цены будет пусто', 'Блока цен на сайте не будет вообще'],
      why: 'ИИ не видит сообщение клиента — он читает только промпт. Цифры в промпте нет, поэтому цену он придумает сам.',
    },
    en: {
      ctx: 'The client named a price, but “What’s inside?” says “prices, contact”.',
      q: 'What price will the site show?',
      opts: ['A made-up one, with a “Guess” tag', 'The client’s price: 20,000 sum an hour', 'The price spot will be left empty', 'There will be no prices block at all'],
      why: 'The AI doesn’t see the client’s message; it only reads the prompt. There’s no number in the prompt, so it makes up a price.',
    },
  },
];
