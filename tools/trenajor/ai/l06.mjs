// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 6 «Как дать ИИ точные требования?» — 18 вопросов с выбором (6 easy, 8 medium, 4 hard).
// Проверяем седьмой вопрос формулы «Qoidalar?»: majburiy — что обязательно, с настоящими данными (телефон, адрес, часы,
// Telegram); mumkin emas — что нельзя, каждое по названию (окно подписки, скидка, чат); ограничения — одна кнопка,
// не больше N блоков; без правил, с «hammasi tushunarli» или «ortiqcha narsa bo'lmasin» ИИ сам добавляет окно, «−50%»
// и чат («Taxmin»); «mumkin emas» убирает только названное; «majburiy» не убирает лишнего; телефон без номера — ИИ его
// выдумывает; ИИ не знает клиента — правила из сообщения клиента переносим все («albatta» → majburiy, «kerak emas» → mumkin emas).
// Промпт — вопросы формулы уроков 1–6 (q 0–6). Ситуации тестов модуля (tools/aitest/l06.jsx) не повторяются.
// Апостроф в узбекском — только ASCII «'». Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const G = T('Taxmin', 'Догадка', 'Guess');
const GC = '#475569';
const MIJOZ = T('Mijoz', 'Клиент', 'Client');
const FOOT = T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.');
const POPUP = T("🎁 Obuna bo'ling!", '🎁 Подпишись!', '🎁 Subscribe!');

export default [
  // ── EASY ──
  {
    id: 'ai_l06_q01', difficulty: 'easy', tags: ['majburiy'], sort: false,
    vis: null,
    uz: {
      ctx: "«Qoidalar?» qatorida ikki so'z ko'p uchraydi: majburiy va mumkin emas.",
      q: '«Majburiy» — bu qanday narsa?',
      opts: ["Saytda albatta bo'lishi kerak narsa", "Saytda bo'lmasligi kerak narsa", "Sun'iy intellekt o'zi qo'shadigan narsa", 'Saytdagi bloklar sonining chegarasi'],
      why: "Majburiy, ya'ni saytda albatta bo'lishi kerak narsa degani: telefon, manzil, Telegram. Aniq ma'lumotni esa o'zingiz yozasiz.",
    },
    ru: {
      ctx: 'В строке «Какие правила?» часто встречаются два слова: обязательно и нельзя.',
      q: '«Обязательно» — это что?',
      opts: ['То, что точно должно быть на сайте', 'То, чего не должно быть на сайте', 'То, что ИИ добавляет сам от себя', 'Предел числа блоков на сайте'],
      why: 'Обязательно — то, что точно должно быть на сайте: телефон, адрес, Telegram. А точные данные пишешь сам.',
    },
    en: {
      ctx: 'Two words often appear in the “What rules?” line: required and not allowed.',
      q: 'What does “required” mean?',
      opts: ['Something that must be on the site', 'Something that must not be on the site', 'Something the AI adds by itself', 'A limit on the number of blocks'],
      why: 'Required means it must be on the site: a phone, an address, Telegram. And you write the exact data yourself.',
    },
  },
  {
    id: 'ai_l06_q02', difficulty: 'easy', tags: ['mumkin-emas', 'mijoz'], sort: false,
    vis: { ai: { msg: { who: MIJOZ, text: T(
      "«Saytda chat bo'lmasin, bizda javob beradigan odam yo'q.»",
      '«Чата на сайте быть не должно — у нас некому отвечать».',
      '“No chat on the site — we have nobody to answer it.”') } } },
    uz: {
      ctx: "Karate klubi mijozining gapini o'qing.",
      q: 'Bu gapdan qaysi qoida chiqadi?',
      opts: ['mumkin emas: chat', 'majburiy: chat', "faqat bitta chat bo'lsin", 'majburiy: javob beradigan odam'],
      why: "«Bo'lmasin» — bu mumkin emas. Mijoz chatni xohlamayapti, shuning uchun qoidaga «mumkin emas: chat» deb yozamiz.",
    },
    ru: {
      ctx: 'Прочитай слова клиента из клуба карате.',
      q: 'Какое правило отсюда следует?',
      opts: ['нельзя: чат', 'обязательно: чат', 'только один чат', 'обязательно: кто-то, кто отвечает'],
      why: '«Быть не должно» — значит нельзя. Клиенту чат не нужен, поэтому пишем правило: «нельзя: чат».',
    },
    en: {
      ctx: 'Read what the karate club client says.',
      q: 'Which rule comes from this?',
      opts: ['not allowed: chat', 'required: chat', 'only one chat', 'required: someone to answer'],
      why: '“No chat” means not allowed. The client doesn’t want a chat, so the rule is “not allowed: chat”.',
    },
  },
  {
    id: 'ai_l06_q03', difficulty: 'easy', tags: ['qator'], sort: false,
    vis: { ai: { prompt: [
      { q: 0, t: T('Gimnastika zali sayti', 'Сайт гимнастического зала', 'A gymnastics hall site') },
      { q: 1, t: T("odamlar mashg'ulotga yozilsin", 'чтобы люди записывались на занятия', 'get people to sign up for classes') },
      { q: 6, t: null, hl: true },
    ] } },
    uz: {
      ctx: 'Gimnastika zali uchun prompt yozyapmiz.',
      q: "Qaysi biri «Qoidalar?» qatoriga mos?",
      opts: ['majburiy: manzil Olmazor 3', 'tugma bosilganda xabar chiqsin', 'zamonaviy, yashil va oq', 'jadval, narxlar va aloqa'],
      why: "«Qoidalar?» — nima majburiy va nima mumkin emas. Xabar — «Qanday ishlaydi?», ranglar — «Ko'rinishi?», bloklar — «Ichida nima?».",
    },
    ru: {
      ctx: 'Пишем промпт для гимнастического зала.',
      q: 'Что подходит в строку «Какие правила?»?',
      opts: ['обязательно: адрес Алмазар 3', 'при нажатии появляется сообщение', 'современный, зелёный и белый', 'расписание, цены и контакты'],
      why: '«Какие правила?» — что обязательно и что нельзя. Сообщение — это «Как ведёт себя?», цвета — «Как выглядит?», блоки — «Что внутри?».',
    },
    en: {
      ctx: 'We’re writing a prompt for a gymnastics hall.',
      q: 'Which fits the “What rules?” line?',
      opts: ['required: address 3 Olmazor', 'when pressed, show a message', 'modern, green and white', 'schedule, prices and contact'],
      why: '“What rules?” is what is required and what is not allowed. A message is “How it behaves?”, colours are “How it looks?”, blocks are “What’s inside?”.',
    },
  },
  {
    id: 'ai_l06_q04', difficulty: 'easy', tags: ['chegara'], sort: false,
    vis: null,
    uz: {
      ctx: "Qoidalar uch xil bo'ladi: majburiy, mumkin emas va chegara.",
      q: 'Qaysi biri — chegara qoidasi?',
      opts: ["ko'pi bilan 3 ta blok bo'lsin", 'majburiy: Telegram tugmasi', "obuna oynasi bo'lmasin", "bloklar chiroyli bo'lsin"],
      why: "Chegara, ya'ni nechta bo'lishi mumkinligi degani: «ko'pi bilan 3 ta blok» yoki «faqat bitta tugma». Shunda sayt keraksiz narsaga to'lib ketmaydi.",
    },
    ru: {
      ctx: 'Правила бывают трёх видов: обязательно, нельзя и ограничение.',
      q: 'Какое из них — ограничение?',
      opts: ['не больше 3 блоков', 'обязательно: кнопка Telegram', 'нельзя: окно подписки', 'пусть блоки будут красивыми'],
      why: 'Ограничение — сколько чего может быть: «не больше 3 блоков» или «только одна кнопка». Тогда сайт не забит лишним.',
    },
    en: {
      ctx: 'Rules come in three kinds: required, not allowed and limits.',
      q: 'Which one is a limit?',
      opts: ['no more than 3 blocks', 'required: a Telegram button', 'not allowed: subscription pop-up', 'make the blocks pretty'],
      why: 'A limit says how many there can be: “no more than 3 blocks” or “only one button”. Then the site isn’t stuffed with extra things.',
    },
  },
  {
    id: 'ai_l06_q05', difficulty: 'easy', tags: ['ozicha', 'taxmin'], sort: false,
    vis: { ai: { site: {
      title: T("Sport do'koni", 'Спортивный магазин', 'Sports shop'), em: '⚽', c: '#16A34A', c2: '#14532D', bg: '#DCFCE7',
      nav: [T('Kiyimlar', 'Одежда', 'Clothes'), T("To'plar", 'Мячи', 'Balls'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi kolleksiya', 'Новая коллекция', 'New collection'), sub: T('Sport uchun hamma narsa!', 'Всё для спорта!', 'Everything for sport!'),
      cta: T('Buyurtma berish', 'Заказать', 'Order'),
      extras: { popup: POPUP, sale: '−50%', chat: true },
      marks: { extras: { t: G, c: GC }, hero: { t: G, c: GC } },
      foot: FOOT,
    } } },
    uz: {
      ctx: "«Qoidalar?» qatori bo'sh qoldi. «Taxmin» belgilariga qarang.",
      q: "Sun'iy intellekt nimalarni o'zicha qo'shdi?",
      opts: ['Obuna oynasi, chegirma va chat', 'Menyu, sarlavha va asosiy tugma', "Rasmlar, narxlar va aloqa bloki", "Do'kon nomi va «Buyurtma» tugmasi"],
      why: "Qoidalar bo'lmasa, sun'iy intellekt o'zicha «foydali» narsa qo'shadi: obuna oynasi, «−50%» va chat. Kerak bo'lmasa, ularni «mumkin emas» ga yozing.",
    },
    ru: {
      ctx: 'Строка «Какие правила?» осталась пустой. Посмотри на метки «Догадка».',
      q: 'Что ИИ добавил сам?',
      opts: ['Окно подписки, скидку и чат', 'Меню, заголовок и главную кнопку', 'Фото, цены и блок контактов', 'Название магазина и кнопку «Заказать»'],
      why: 'Без правил ИИ сам добавляет «полезное»: окно подписки, «−50%» и чат. Если они не нужны, напиши их в «нельзя».',
    },
    en: {
      ctx: 'The “What rules?” line was left empty. Look at the “Guess” tags.',
      q: 'What did the AI add by itself?',
      opts: ['A subscription pop-up, a discount and a chat', 'The menu, the heading and the main button', 'Photos, prices and a contact block', 'The shop name and the “Order” button'],
      why: 'Without rules the AI adds “useful” things itself: a subscription pop-up, “−50%” and a chat. If they aren’t needed, put them under “not allowed”.',
    },
  },
  {
    id: 'ai_l06_q06', difficulty: 'easy', tags: ['majburiy', 'mijoz'], sort: false,
    vis: { ai: { msg: { who: MIJOZ, text: T(
      "«Ish vaqtimiz 9:00–18:00. Saytda bu albatta ko'rinib tursin.»",
      '«Мы работаем 9:00–18:00. Это обязательно должно быть на сайте».',
      '“We’re open 9:00–18:00. This must be on the site.”') } } },
    uz: {
      ctx: 'Sartaroshxona mijozi shunday yozdi.',
      q: 'Qaysi qoida xabarga mos?',
      opts: ['majburiy: ish vaqti 9:00–18:00', 'mumkin emas: ish vaqti 9:00–18:00', "ko'pi bilan 9 ta blok bo'lsin", 'hammasi tushunarli, yozish shart emas'],
      why: "«Albatta ko'rinib tursin» — bu majburiy. Vaqtni ham aniq yozamiz: sun'iy intellekt uni bilmaydi.",
    },
    ru: {
      ctx: 'Так написал клиент из парикмахерской.',
      q: 'Какое правило подходит к сообщению?',
      opts: ['обязательно: часы работы 9:00–18:00', 'нельзя: часы работы 9:00–18:00', 'не больше 9 блоков на сайте', 'всё понятно, писать ничего не нужно'],
      why: '«Обязательно должно быть» — это обязательно. И время пишем точно: ИИ его не знает.',
    },
    en: {
      ctx: 'This is what the barbershop client wrote.',
      q: 'Which rule fits the message?',
      opts: ['required: opening hours 9:00–18:00', 'not allowed: opening hours 9:00–18:00', 'no more than 9 blocks on the site', 'it’s all clear, no need to write it'],
      why: '“Must be on the site” means required. And we write the time exactly: the AI doesn’t know it.',
    },
  },

  // ── MEDIUM ──
  {
    id: 'ai_l06_q07', difficulty: 'medium', tags: ['mumkin-emas'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("Qandolat do'koni sayti", 'Сайт кондитерской', 'A sweet shop site') },
        { q: 6, t: T("chegirma bo'lmasin", 'нельзя: скидка', 'not allowed: discount'), hl: true },
      ],
      site: {
        title: T("Qandolat do'koni", 'Кондитерская', 'Sweet shop'), em: '🍰', c: '#9333EA', c2: '#6B21A8', bg: '#F3E8FF',
        nav: [T('Tortlar', 'Торты', 'Cakes'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi tortlar', 'Новые торты', 'New cakes'), sub: T('Har kuni yangi shirinliklar!', 'Свежие сладости каждый день!', 'Fresh sweets every day!'),
        cta: T('Buyurtma berish', 'Заказать', 'Order'),
        extras: { popup: POPUP, chat: true },
        marks: { extras: { t: G, c: GC } },
        foot: FOOT,
      },
    } },
    uz: {
      ctx: "Chegirma yo'qoldi, lekin obuna oynasi va chat hali turibdi.",
      q: 'Nega ular qolib ketdi?',
      opts: ["Ular «mumkin emas» ga yozilmagan", "Mijoz ularni albatta so'ragan", 'Chegirma ularni ham olib kelgan', "«Mumkin emas» faqat bitta narsani oladi"],
      why: "«Mumkin emas» faqat nomi aytilgan narsani olib tashlaydi. Hammasi kerak bo'lmasa: «obuna oynasi, chegirma va chat bo'lmasin».",
    },
    ru: {
      ctx: 'Скидка пропала, но окно подписки и чат остались.',
      q: 'Почему они остались?',
      opts: ['Их не написали в «нельзя»', 'Клиент сам их обязательно просил', 'Скидка притянула их за собой', '«Нельзя» убирает только одну вещь'],
      why: '«Нельзя» убирает только то, что названо. Если не нужно ничего из этого: «нельзя: окно подписки, скидка, чат».',
    },
    en: {
      ctx: 'The discount is gone, but the subscription pop-up and the chat are still there.',
      q: 'Why did they stay?',
      opts: ['They weren’t written under “not allowed”', 'The client asked for them', 'The discount brought them along', '“Not allowed” removes only one thing'],
      why: '“Not allowed” removes only what is named. If none of it is needed: “not allowed: subscription pop-up, discount, chat”.',
    },
  },
  {
    id: 'ai_l06_q08', difficulty: 'medium', tags: ['raqam', 'majburiy'], sort: false,
    vis: { ai: {
      msg: { who: MIJOZ, text: T('«Bizning raqam: +998 71 234 56 78.»', '«Наш номер: +998 71 234 56 78».', '“Our number is +998 71 234 56 78.”') },
      site: {
        title: T('Bolalar teatri', 'Детский театр', 'Kids’ theatre'), em: '🎭', c: '#4338CA', c2: '#312E81', bg: '#E0E7FF',
        nav: [T('Spektakllar', 'Спектакли', 'Shows'), T('Jadval', 'Расписание', 'Schedule'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi spektakl', 'Новый спектакль', 'New show'), sub: T('Ertaklar sahnada!', 'Сказки на сцене!', 'Fairy tales on stage!'),
        cta: T("Qo'ng'iroq qilish", 'Позвонить', 'Call'),
        info: [{ t: '📞 +998 11 222 33 44', guess: G }],
        noFoot: true,
      },
      focus: '.info',
    } },
    uz: {
      ctx: "Promptda «majburiy: telefon raqami» deb yozilgan edi.",
      q: "Qaysi «Qoidalar?» qatori buni tuzatadi?",
      opts: ['majburiy: telefon +998 71 234 56 78', 'majburiy: haqiqiy telefon raqami', "telefon raqami to'g'ri bo'lsin", "mumkin emas: to'qib chiqarilgan raqam"],
      why: "Sun'iy intellekt teatrning raqamini bilmaydi. Raqamning o'zi yozilmasa, uni to'qib chiqaradi. Raqamni xabardan ko'chirib yozing.",
    },
    ru: {
      ctx: 'В промпте было написано «обязательно: номер телефона».',
      q: 'Какая строка «Какие правила?» это исправит?',
      opts: ['обязательно: телефон +998 71 234 56 78', 'обязательно: настоящий номер телефона', 'пусть номер телефона будет правильным', 'нельзя: выдуманный номер телефона'],
      why: 'ИИ не знает номер театра. Если не написать сам номер, он его придумает. Перепиши номер из сообщения.',
    },
    en: {
      ctx: 'The prompt said “required: a phone number”.',
      q: 'Which “What rules?” line fixes this?',
      opts: ['required: phone +998 71 234 56 78', 'required: the real phone number', 'make the phone number correct', 'not allowed: a made-up number'],
      why: 'The AI doesn’t know the theatre’s number. If the number itself isn’t written, it makes one up. Copy the number from the message.',
    },
  },
  {
    id: 'ai_l06_q09', difficulty: 'medium', tags: ['noaniq'], sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Kompyuter kursi sayti', 'Сайт компьютерных курсов', 'A computer course site') },
        { q: 6, t: T("ortiqcha narsalar bo'lmasin", 'чтобы не было ничего лишнего', 'nothing extra on the site'), hl: true },
      ],
      site: {
        title: T('Kompyuter kursi', 'Компьютерные курсы', 'Computer course'), em: '💻', c: '#0F766E', c2: '#134E4A', bg: '#CCFBF1',
        nav: [T('Kurslar', 'Курсы', 'Courses'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Kompyuterni birga o'rganamiz!", 'Изучаем компьютер вместе!', 'Let’s learn computers together!'),
        cta: T('Yozilish', 'Записаться', 'Sign up'),
        extras: { popup: POPUP, sale: '−50%', chat: true },
        marks: { extras: { t: G, c: GC }, hero: { t: G, c: GC } },
        foot: FOOT,
      },
    } },
    uz: {
      ctx: "Qoida yozildi, lekin oyna, chegirma va chat joyida turibdi.",
      q: "Nega hech narsa yo'qolmadi?",
      opts: ["Nima ortiqchaligini sun'iy intellekt bilmaydi", 'Qoida juda qisqa, uzunroq yozish kerak', "«Bo'lmasin» so'zini sun'iy intellekt tushunmaydi", "Mijoz bu narsalarni o'zi so'ragan edi"],
      why: "«Ortiqcha» har kimga har xil, sun'iy intellektga bu hech narsa demaydi. Har birini nomi bilan yozing: obuna oynasi, chegirma, chat.",
    },
    ru: {
      ctx: 'Правило написали, но окно, скидка и чат на месте.',
      q: 'Почему ничего не пропало?',
      opts: ['ИИ не знает, что для тебя лишнее', 'Правило слишком короткое, нужно длиннее', 'Слова «не было» ИИ не понимает', 'Клиент сам просил эти вещи'],
      why: '«Лишнее» каждый понимает по-своему, ИИ это ничего не говорит. Назови каждую вещь: окно подписки, скидка, чат.',
    },
    en: {
      ctx: 'The rule was written, but the pop-up, the discount and the chat are still there.',
      q: 'Why didn’t anything disappear?',
      opts: ['The AI doesn’t know what “extra” means to you', 'The rule is too short, it must be longer', 'The AI doesn’t understand the word “nothing”', 'The client asked for these things'],
      why: '“Extra” means something different to everyone; it tells the AI nothing. Name each thing: subscription pop-up, discount, chat.',
    },
  },
  {
    id: 'ai_l06_q10', difficulty: 'medium', tags: ['bitta-tugma', 'chegara'], sort: false,
    vis: { ai: { site: {
      title: T("Oshpazlik to'garagi", 'Кулинарный кружок', 'Cooking club'), em: '👩‍🍳', c: '#EA580C', c2: '#9A3412', bg: '#FFEDD5',
      nav: [T('Darslar', 'Занятия', 'Lessons'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T('Mazali taomlarni birga pishiramiz!', 'Готовим вкусное вместе!', 'Let’s cook tasty food together!'),
      cta: T('Yozilish', 'Записаться', 'Sign up'),
      goal: { h: T('Yozilish', 'Запись', 'Sign up'), fields: [T('Ismingiz', 'Твоё имя', 'Your name'), T('Telefon', 'Телефон', 'Phone')], btn: T('Yuborish', 'Отправить', 'Send') },
      noFoot: true,
    } } },
    uz: {
      ctx: 'Saytda uchta tugma bor: menyuda, bannerda va formada.',
      q: "Qoidaga «faqat bitta tugma» qo'shsak, nima bo'ladi?",
      opts: ['Faqat bitta asosiy tugma qoladi', "Asosiy tugma ham yo'qolib ketadi", "Hamma tugmalar bir xil rangda bo'ladi", 'Saytda faqat bitta blok qoladi'],
      why: "«Faqat bitta tugma» — chegara. Menyudagi va pastdagi tugmalar ketadi, asosiy tugma qoladi: mehmon nimani bosishni darrov biladi.",
    },
    ru: {
      ctx: 'На сайте три кнопки: в меню, на баннере и в форме.',
      q: 'Что будет, если добавить правило «только одна кнопка»?',
      opts: ['Останется одна главная кнопка', 'Пропадёт и главная кнопка тоже', 'Все кнопки станут одного цвета', 'На сайте останется один блок'],
      why: '«Только одна кнопка» — это ограничение. Кнопки в меню и внизу уйдут, главная останется: гость сразу знает, что нажать.',
    },
    en: {
      ctx: 'The site has three buttons: in the menu, on the banner and in the form.',
      q: 'What happens if we add the rule “only one button”?',
      opts: ['Only one main button stays', 'The main button disappears too', 'All buttons turn the same colour', 'Only one block stays on the site'],
      why: '“Only one button” is a limit. The menu and bottom buttons go away, the main one stays: a visitor knows right away what to press.',
    },
  },
  {
    id: 'ai_l06_q11', difficulty: 'medium', tags: ['noaniq', 'mijoz'], sort: false,
    vis: { ai: { prompt: [
      { q: 0, t: T('Muzey sayti', 'Сайт музея', 'A museum site') },
      { q: 1, t: T("o'quvchilar ekskursiyaga kelsin", 'чтобы школьники приходили на экскурсии', 'get students to come on tours') },
      { q: 6, t: T("hammasi mijoz aytganidek bo'lsin", 'пусть всё будет, как сказал клиент', 'make everything as the client said'), hl: true },
    ] } },
    uz: {
      ctx: "Sun'iy intellekt mijozning xabarini ko'rmagan, u faqat promptni o'qiydi.",
      q: "Natija qanday bo'ladi?",
      opts: ["O'zicha oyna, chegirma va chat qo'shadi", 'Mijoz aytgan hamma narsani aniq bajaradi', "Saytga faqat mijozning raqamini qo'yadi", 'Saytni yaratmaydi, oyna bo\'sh qoladi'],
      why: "Sun'iy intellekt mijozni tanimaydi va u nima deganini bilmaydi. Mijozning har bir istagini qoidaga o'zingiz ko'chirib yozasiz.",
    },
    ru: {
      ctx: 'ИИ не видел сообщения клиента — он читает только промпт.',
      q: 'Что получится?',
      opts: ['ИИ сам добавит окно, скидку и чат', 'ИИ точно выполнит всё, что сказал клиент', 'На сайте будет только номер клиента', 'ИИ не сделает сайт, окно будет пустым'],
      why: 'ИИ не знает клиента и не знает, что тот сказал. Каждое желание клиента переписываешь в правила сам.',
    },
    en: {
      ctx: 'The AI hasn’t seen the client’s message — it only reads the prompt.',
      q: 'What will happen?',
      opts: ['It adds a pop-up, a discount and a chat itself', 'It does exactly what the client said', 'It puts only the client’s number on the site', 'It makes no site, the window stays empty'],
      why: 'The AI doesn’t know the client or what they said. You copy each of the client’s wishes into the rules yourself.',
    },
  },
  {
    id: 'ai_l06_q12', difficulty: 'medium', tags: ['malumot'], sort: false,
    vis: null,
    uz: {
      ctx: "Mijozning manzili — Chilonzor 7. Uni promptga o'zimiz yozyapmiz.",
      q: "Nega buni sun'iy intellektga qoldirmaymiz?",
      opts: ["Sun'iy intellekt mijozning manzilini bilmaydi", "Sun'iy intellekt manzil yozishni bilmaydi", 'Manzil yozilmasa, sayt umuman ochilmaydi', "Manzil faqat telefonda ko'rinib turadi"],
      why: "Sun'iy intellekt mijozni tanimaydi. Manzilni yozmasangiz, uni o'zi to'qib chiqaradi va mehmonlar boshqa joyga borib qoladi.",
    },
    ru: {
      ctx: 'Адрес клиента — Чиланзар 7. Мы сами пишем его в промпт.',
      q: 'Почему не оставить это ИИ?',
      opts: ['ИИ не знает адреса этого клиента', 'ИИ вообще не умеет писать адреса', 'Без адреса сайт просто не откроется', 'Адрес виден только на телефоне'],
      why: 'ИИ не знает клиента. Если не написать адрес, он его придумает, и гости придут не туда.',
    },
    en: {
      ctx: 'The client’s address is 7 Chilonzor. We write it into the prompt ourselves.',
      q: 'Why don’t we leave it to the AI?',
      opts: ['The AI doesn’t know this client’s address', 'The AI can’t write addresses at all', 'Without an address the site won’t open', 'The address only shows on a phone'],
      why: 'The AI doesn’t know the client. If the address isn’t written, it makes one up, and visitors go to the wrong place.',
    },
  },
  {
    id: 'ai_l06_q13', difficulty: 'medium', tags: ['chegara', 'mijoz'], sort: false,
    vis: { ai: { msg: { who: MIJOZ, text: T(
      "«Sayt juda uzun bo'lib ketdi. 3 tadan ortiq bo'lim kerak emas.»",
      '«Сайт получился слишком длинным. Больше 3 разделов не нужно».',
      '“The site got too long. We don’t need more than 3 sections.”') } } },
    uz: {
      ctx: 'Musiqa maktabi mijozi saytdan norozi.',
      q: 'Bu xabardan qaysi qoida chiqadi?',
      opts: ["ko'pi bilan 3 ta blok", 'mumkin emas: 3 ta blok', "sayt uzun bo'lmasin", "faqat bitta blok bo'lsin"],
      why: "«3 tadan ortiq kerak emas» — bu chegara: ko'pi bilan uchta. «Uzun bo'lmasin» esa sun'iy intellektga nechta ekanini aytmaydi.",
    },
    ru: {
      ctx: 'Клиент из музыкальной школы недоволен сайтом.',
      q: 'Какое правило следует из сообщения?',
      opts: ['не больше 3 блоков', 'нельзя: 3 блока', 'пусть сайт не будет длинным', 'только один блок'],
      why: '«Больше 3 не нужно» — это ограничение: не больше трёх. А «не длинный» не говорит ИИ, сколько именно.',
    },
    en: {
      ctx: 'The music school client is unhappy with the site.',
      q: 'Which rule comes from the message?',
      opts: ['no more than 3 blocks', 'not allowed: 3 blocks', 'don’t make the site long', 'only one block'],
      why: '“No more than 3” is a limit: three at most. “Not long” doesn’t tell the AI how many exactly.',
    },
  },
  {
    id: 'ai_l06_q14', difficulty: 'medium', tags: ['bitta-tugma', 'mijoz'], sort: false,
    vis: null,
    uz: {
      ctx: "Mijoz: «Odamlar bizga faqat qo'ng'iroq qilsin, boshqa tugmalar chalg'itadi.»",
      q: 'Bu gapdan qaysi qoida chiqadi?',
      opts: ["faqat bitta tugma bo'lsin", 'mumkin emas: hamma tugmalar', 'majburiy: Telegram tugmasi', "ko'pi bilan 1 ta blok"],
      why: "Mijozga bitta narsa kerak — qo'ng'iroq. Bu chegara: «faqat bitta tugma». Hamma tugmani olib tashlasak, qo'ng'iroq tugmasi ham qolmaydi.",
    },
    ru: {
      ctx: 'Клиент: «Пусть нам только звонят, другие кнопки только отвлекают».',
      q: 'Какое правило отсюда следует?',
      opts: ['только одна кнопка', 'нельзя: все кнопки', 'обязательно: кнопка Telegram', 'не больше 1 блока'],
      why: 'Клиенту нужно одно — звонок. Это ограничение: «только одна кнопка». Если убрать все кнопки, пропадёт и кнопка звонка.',
    },
    en: {
      ctx: 'Client: “People should only call us, other buttons just distract.”',
      q: 'Which rule comes from this?',
      opts: ['only one button', 'not allowed: all buttons', 'required: a Telegram button', 'no more than 1 block'],
      why: 'The client needs one thing — calls. That’s a limit: “only one button”. Remove all buttons and the call button is gone too.',
    },
  },

  // ── HARD ──
  {
    id: 'ai_l06_q15', difficulty: 'hard', tags: ['majburiy', 'ozicha'], sort: false,
    vis: null,
    uz: {
      ctx: "«Qoidalar?» da faqat bitta qoida: «majburiy: telefon +998 90 111 22 33».",
      q: "Saytda nima bo'ladi?",
      opts: ["Haqiqiy raqam, lekin oyna, chegirma va chat ham", "Faqat haqiqiy raqam, ortiqcha narsa yo'q", "To'qib chiqarilgan raqam va chegirma", "Raqam ham, ortiqcha narsa ham bo'lmaydi"],
      why: "«Majburiy» kerakli narsani qo'shadi, lekin ortiqchani olib tashlamaydi. Oyna, chegirma va chat kerak bo'lmasa, ularni «mumkin emas» ga alohida yozing.",
    },
    ru: {
      ctx: 'В «Какие правила?» только одно: «обязательно: телефон +998 90 111 22 33».',
      q: 'Что будет на сайте?',
      opts: ['Настоящий номер, но и окно, скидка, чат', 'Только настоящий номер, лишнего нет', 'Придуманный номер, скидка и окно', 'Ни номера, ни лишних вещей не будет'],
      why: '«Обязательно» добавляет нужное, но не убирает лишнее. Если окно, скидка и чат не нужны, отдельно напиши их в «нельзя».',
    },
    en: {
      ctx: 'The “What rules?” line has just one rule: “required: phone +998 90 111 22 33”.',
      q: 'What will be on the site?',
      opts: ['Real number, plus pop-up, discount and chat', 'Only the real number, nothing extra', 'A made-up number, a discount and a pop-up', 'No number and nothing extra at all'],
      why: '“Required” adds what’s needed but doesn’t remove extras. If the pop-up, discount and chat aren’t wanted, put them under “not allowed” separately.',
    },
  },
  {
    id: 'ai_l06_q16', difficulty: 'hard', tags: ['detektiv', 'mumkin-emas'], sort: false,
    vis: { ai: { focus: '.foot', site: {
      title: T('Bolalar kutubxonasi', 'Детская библиотека', 'Kids’ library'), em: '📚', c: '#0369A1', c2: '#0C4A6E', bg: '#E0F2FE',
      nav: [T('Kitoblar', 'Книги', 'Books'), T('Tadbirlar', 'События', 'Events'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi kitoblar', 'Новые книги', 'New books'), sub: T("Kitob o'qish — qiziq!", 'Читать — интересно!', 'Reading is fun!'),
      cta: T("Qo'ng'iroq qilish", 'Позвонить', 'Call'),
      info: [{ t: '📞 +998 94 321 00 77' }],
      marks: { info: { t: T('Qoidalar?', 'Какие правила?', 'What rules?'), c: '#BE123C' } },
      extras: { chat: true },
      foot: FOOT,
    } } },
    uz: {
      ctx: "Mijoz so'ragan edi: haqiqiy raqam bo'lsin, oyna, chegirma va chat bo'lmasin.",
      q: 'Saytga qarang. Qoidada nima unutilgan?',
      opts: ["Chat bo'lmasligi", "Telefon raqamining o'zi", "Chegirma bo'lmasligi", "Obuna oynasi bo'lmasligi"],
      why: "Raqam haqiqiy, oyna va chegirma yo'q. Faqat burchakda chat turibdi — demak, u «mumkin emas» ga yozilmagan. Har bir istakni qoidaga ko'chiramiz.",
    },
    ru: {
      ctx: 'Клиент просил: настоящий номер, без окна подписки, скидки и чата.',
      q: 'Посмотри на сайт. Что забыли написать в правилах?',
      opts: ['Что чата быть не должно', 'Сам номер телефона', 'Что скидки быть не должно', 'Что окна подписки быть не должно'],
      why: 'Номер настоящий, окна и скидки нет. А в углу остался чат — значит, его не написали в «нельзя». Каждое желание переносим в правила.',
    },
    en: {
      ctx: 'The client asked: the real number, no pop-up, no discount, no chat.',
      q: 'Look at the site. What was left out of the rules?',
      opts: ['That there’s no chat', 'The phone number itself', 'That there’s no discount', 'That there’s no subscription pop-up'],
      why: 'The number is real, and there’s no pop-up or discount. But a chat sits in the corner — so it wasn’t put under “not allowed”. Every wish goes into the rules.',
    },
  },
  {
    id: 'ai_l06_q17', difficulty: 'hard', tags: ['raqam', 'taxmin'], sort: false,
    vis: { ai: { prompt: [
      { q: 0, t: T("Tikuvchilik to'garagi sayti", 'Сайт кружка шитья', 'A sewing club site') },
      { q: 1, t: T("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') },
      { q: 6, t: T('majburiy: telefon raqami, manzil Yashnobod 9', 'обязательно: номер телефона, адрес Яшнабад 9', 'required: a phone number, address 9 Yashnobod'), hl: true },
    ] } },
    uz: {
      ctx: "Sun'iy intellekt shu prompt bilan sayt yaratadi.",
      q: "Saytda qaysi ma'lumot yonida «Taxmin» chiqadi?",
      opts: ['Telefon raqami yonida', 'Manzil yonida', 'Ikkalasining yonida ham', 'Hech birining yonida'],
      why: "Manzil aniq yozilgan: Yashnobod 9. Telefonning esa faqat nomi bor, raqami yo'q — sun'iy intellekt uni o'zi to'qib chiqaradi.",
    },
    ru: {
      ctx: 'ИИ сделает сайт по этому промпту.',
      q: 'Рядом с чем на сайте будет «Догадка»?',
      opts: ['Рядом с номером телефона', 'Рядом с адресом', 'Рядом с тем и другим', 'Ни рядом с одним из них'],
      why: 'Адрес написан точно: Яшнабад 9. А у телефона есть только слово, самого номера нет — ИИ его придумает.',
    },
    en: {
      ctx: 'The AI will make a site from this prompt.',
      q: 'Next to what will a “Guess” tag appear?',
      opts: ['Next to the phone number', 'Next to the address', 'Next to both of them', 'Next to neither of them'],
      why: 'The address is written exactly: 9 Yashnobod. The phone has only the word, not the number — so the AI will make one up.',
    },
  },
  {
    id: 'ai_l06_q18', difficulty: 'hard', tags: ['mijoz', 'qoidalar'], sort: false,
    vis: { ai: { msg: { who: MIJOZ, text: T(
      "«Chat qo'ymang, javob beradigan odamimiz yo'q. Manzilimiz Mirobod 8 — albatta yozing. Bo'limlar ko'p bo'lsa, odamlar adashadi, 2 tadan oshmasin.»",
      '«Чат не ставьте — отвечать у нас некому. Адрес Мирабад 8 — обязательно напишите. Если разделов много, люди путаются: не больше двух».',
      '“Don’t add a chat — nobody can answer it. Our address is 8 Mirobod — be sure to include it. Too many sections confuse people: no more than 2.”') } } },
    uz: {
      ctx: 'Fotostudiya mijozi qoidalarni oddiy gaplar bilan yozdi.',
      q: 'Bu xabarda nechta qoida bor?',
      opts: ['Uchta: manzil, chat va bloklar soni', 'Ikkita: manzil va chat, qolgani maslahat', 'Bitta: faqat manzil, qolgani oddiy gap', "To'rtta: «odam yo'q» ham alohida qoida"],
      why: "«Chat qo'ymang» — mumkin emas, «albatta yozing» — majburiy, «2 tadan oshmasin» — chegara. Mijoz «qoida» demasa ham, har bir istak qoidaga aylanadi.",
    },
    ru: {
      ctx: 'Клиент из фотостудии написал правила обычными словами.',
      q: 'Сколько правил в этом сообщении?',
      opts: ['Три: адрес, чат и число разделов', 'Два: адрес и чат, остальное — совет', 'Одно: только адрес, остальное — слова', 'Четыре: «некому отвечать» — тоже правило'],
      why: '«Чат не ставьте» — нельзя, «обязательно напишите» — обязательно, «не больше двух» — ограничение. Клиент не говорит «правило», но каждое желание становится правилом.',
    },
    en: {
      ctx: 'The photo studio client wrote the rules in plain words.',
      q: 'How many rules are in this message?',
      opts: ['Three: address, chat and number of sections', 'Two: address and chat, the rest is advice', 'One: just the address, the rest is talk', 'Four: “nobody can answer” is a rule too'],
      why: '“Don’t add a chat” is not allowed, “be sure to include it” is required, “no more than 2” is a limit. The client never says “rule”, but every wish becomes one.',
    },
  },
];
