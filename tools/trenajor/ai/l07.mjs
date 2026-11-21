// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 7 «Как улучшить результат ИИ?» — 18 вопросов с выбором (6 easy, 8 medium, 4 hard).
// Проверяем: анализ — сверить сайт с заказом по пунктам и назвать проблему точно (и мелочь — цифры номера);
// второй промпт вместо нового первого; «qolganini o'zgartirma» сохраняет понравившееся (новое всё равно добавится);
// без неё ИИ пишет сайт заново — свой цвет, своё название, обратный порядок блоков, метки «O'zi o'zgartirdi»;
// «что» без «как» («tugmani o'zgartir», «rangini o'zgartir», «raqamni to'g'irla» без номера) — догадка «Taxmin»;
// «yaxshiroq qil» — ИИ не знает, что улучшать; шагами: второй, третий промпт и проверка после каждого;
// несколько точных правок в одном промпте.
// Сайты — как их честно собрал бы симулятор урока 7 (tools/ai7/ai7-fix.jsx: fixOf, fixSite).
// Метки промптов — «1-prompt», «2-prompt», «3-prompt» (тёмно-серые, как в тестах модуля).
// Ситуации тестов модуля (tools/aitest/l07.jsx) не повторяются. Апостроф в узбекском — только ASCII «'».
// Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const FOOT = T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.');
const G = T('Taxmin', 'Догадка', 'Guess');
const GM = { t: G, c: '#475569' };
const OZ = { t: T("O'zi o'zgartirdi", 'Сам поменял', 'Changed by itself'), c: '#BE123C' };
const PM = (n) => ({ t: n + '-prompt', c: '#334155' });
const PR = (n, t, hl) => (hl ? { lab: n + '-prompt', c: '#334155', bg: '#F1F5F9', t, hl: true } : { lab: n + '-prompt', c: '#334155', bg: '#F1F5F9', t });
const CLIENT = T('Mijoz', 'Клиент', 'Client');

export default [
  // ── easy ──
  {
    id: 'ai_l07_q01', difficulty: 'easy', tags: ['tahlil'], sort: false,
    vis: null,
    uz: {
      ctx: "Sun'iy intellekt sayt yaratdi. Endi natijani tahlil qilamiz.",
      q: 'Tahlil qilish nima degani?',
      opts: ['Natijani buyurtma bilan band-band solishtirish', "Sayt yoqdimi-yo'qmi, shuni aytish", "Sun'iy intellektdan yana bitta sayt so'rash", 'Birinchi promptni boshidan qayta yozish'],
      why: "Tahlil — buyurtmadagi har bir bandni saytdan qidirish. Shunda nima bor-u, nima yo'qligi aniq bo'ladi.",
    },
    ru: {
      ctx: 'ИИ сделал сайт. Теперь анализируем результат.',
      q: 'Что значит «анализировать»?',
      opts: ['Сверить результат с заказом по пунктам', 'Сказать, нравится сайт или нет', 'Попросить у ИИ ещё один сайт', 'Переписать первый промпт с нуля'],
      why: 'Анализ — это найти на сайте каждый пункт заказа. Тогда ясно, что есть, а чего нет.',
    },
    en: {
      ctx: 'The AI made a site. Now we analyse the result.',
      q: 'What does “analyse” mean?',
      opts: ['Compare the result with the order point by point', 'Say whether you like the site or not', 'Ask the AI for one more site', 'Rewrite the first prompt from scratch'],
      why: 'Analysis means looking for each point of the order on the site. Then it’s clear what is there and what is missing.',
    },
  },
  {
    id: 'ai_l07_q02', difficulty: 'easy', tags: ['tahlil', 'buyurtma'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Buyurtma: hayvonot bog'i nomi, ish vaqti, chipta narxlari, yashil rang.»", '«Заказ: название зоопарка, часы работы, цены билетов, зелёный цвет».', '“The order: the zoo’s name, opening hours, ticket prices, green colour.”') },
      site: {
        title: T("Shahar hayvonot bog'i", 'Городской зоопарк', 'City zoo'), em: '🦁', c: '#16A34A', c2: '#15803D', bg: '#DCFCE7',
        nav: [T('Hayvonlar', 'Животные', 'Animals'), T('Ish vaqti', 'Часы работы', 'Hours'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Oilaviy dam olish', 'Семейный отдых', 'Family fun'), sub: T('Sher, zebra va pingvinlar sizni kutmoqda!', 'Львы, зебры и пингвины ждут тебя!', 'Lions, zebras and penguins are waiting!'),
        cta: T('Chipta olish', 'Купить билет', 'Buy a ticket'),
        blocks: [{ h: T('Ish vaqti', 'Часы работы', 'Opening hours'), items: [{ t: T('Har kuni · 9:00–18:00', 'Каждый день · 9:00–18:00', 'Every day · 9:00–18:00'), wide: true }] }],
        noFoot: true,
      },
    } },
    uz: {
      ctx: 'Buyurtmani sayt bilan band-band solishtiring.',
      q: 'Buyurtmaning qaysi bandi bajarilmagan?',
      opts: ['Chipta narxlari', 'Ish vaqti', 'Yashil rang', "Hayvonot bog'i nomi"],
      why: "Saytda nom, ish vaqti va yashil rang bor, chipta narxlari esa yo'q. Band-band solishtirsangiz, buni darrov ko'rasiz.",
    },
    ru: {
      ctx: 'Сверь заказ с сайтом по пунктам.',
      q: 'Какой пункт заказа не выполнен?',
      opts: ['Цены билетов', 'Часы работы', 'Зелёный цвет', 'Название зоопарка'],
      why: 'На сайте есть название, часы работы и зелёный цвет, а цен билетов нет. Если сверять по пунктам, это видно сразу.',
    },
    en: {
      ctx: 'Check the order against the site point by point.',
      q: 'Which point of the order is not done?',
      opts: ['Ticket prices', 'Opening hours', 'Green colour', 'The zoo’s name'],
      why: 'The site has the name, the opening hours and the green colour, but no ticket prices. Checking point by point shows it at once.',
    },
  },
  {
    id: 'ai_l07_q03', difficulty: 'easy', tags: ['qolganini'], sort: false,
    vis: { ai: {
      prompt: [
        PR(1, T("Gul do'koni sayti… (7 qator)", 'Сайт цветочного магазина… (7 строк)', 'A flower shop site… (7 lines)')),
        PR(2, T("guldastalar narxlari blokini qo'sh, …", 'добавь блок цен на букеты, …', 'add a bouquet prices block, …'), true),
      ],
    } },
    uz: {
      ctx: "Gul do'koni sayti mijozga yoqdi, faqat narxlar yo'q.",
      q: 'Ikkinchi prompt oxiriga nima yozamiz?',
      opts: ["qolganini o'zgartirma", 'hammasini yangidan qil', 'tezroq tayyorlab ber', "chiroyliroq bo'lsin"],
      why: "«Qolganini o'zgartirma» sun'iy intellektga faqat narxlarni qo'shishni aytadi. Mijozga yoqqan rang, nom va bloklar joyida qoladi.",
    },
    ru: {
      ctx: 'Сайт цветочного магазина клиенту понравился, нет только цен.',
      q: 'Что дописать в конце второго промпта?',
      opts: ['остальное не меняй', 'сделай всё заново', 'приготовь побыстрее', 'пусть будет красивее'],
      why: '«Остальное не меняй» говорит ИИ только добавить цены. Цвет, название и блоки, которые понравились клиенту, остаются на месте.',
    },
    en: {
      ctx: 'The client liked the flower shop site; only the prices are missing.',
      q: 'What do we add at the end of the second prompt?',
      opts: ['don’t change anything else', 'make everything again', 'get it ready faster', 'make it prettier'],
      why: '“Don’t change anything else” tells the AI to add only the prices. The colour, name and blocks the client liked stay in place.',
    },
  },
  {
    id: 'ai_l07_q04', difficulty: 'easy', tags: ['tahlil'], sort: false,
    vis: null,
    uz: {
      ctx: 'Kafe buyurtmasi: menyu, narxlar, Telegram tugmasi. Sayt tayyor.',
      q: 'Qaysi gap muammoni aniq aytadi?',
      opts: ["Saytda Telegram tugmasi yo'q", 'Sayt biroz zerikarli chiqibdi', "Nimadir yetishmayotganga o'xshaydi", "Dizayni unchalik zo'r emas"],
      why: "Aniq kuzatuv buyurtmadagi bandni nomlaydi: Telegram tugmasi yo'q. Shunda ikkinchi promptda nimani qo'shishni bilasiz.",
    },
    ru: {
      ctx: 'Заказ кафе: меню, цены, кнопка Telegram. Сайт готов.',
      q: 'Какая фраза называет проблему точно?',
      opts: ['На сайте нет кнопки Telegram', 'Сайт получился скучноватым', 'Кажется, чего-то не хватает', 'Дизайн не очень крутой'],
      why: 'Точное наблюдение называет пункт заказа: нет кнопки Telegram. Тогда ясно, что добавить во втором промпте.',
    },
    en: {
      ctx: 'The café’s order: a menu, prices, a Telegram button. The site is ready.',
      q: 'Which sentence names the problem exactly?',
      opts: ['The site has no Telegram button', 'The site came out a bit boring', 'Something seems to be missing', 'The design isn’t that great'],
      why: 'An exact observation names a point of the order: there is no Telegram button. Then you know what to add in the second prompt.',
    },
  },
  {
    id: 'ai_l07_q05', difficulty: 'easy', tags: ['ozi-ozgartirdi'], sort: false,
    vis: { ai: { focus: '.blk',
      site: {
        title: T("Musiqa maktabi — siz kutgan joy!", 'Музыкальная школа — то, что нужно!', 'Music school — just what you wanted!'), em: '🎹', c: '#EA580C', c2: '#C2410C', bg: '#FFEDD5',
        nav: [T('Darslar', 'Уроки', 'Lessons'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruhlar', 'Новые группы', 'New groups'), sub: T('Pianino va gitara darslari', 'Уроки фортепиано и гитары', 'Piano and guitar lessons'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        marks: { hero: OZ },
        blocks: [{ h: T('Ustozlar', 'Учителя', 'Teachers'), items: [{ ic: '🎹', t: T('Pianino', 'Фортепиано', 'Piano') }, { ic: '🎸', t: T('Gitara', 'Гитара', 'Guitar') }], mark: OZ }],
        noFoot: true,
      },
    } },
    uz: {
      ctx: 'Ikkinchi promptdan keyin saytda shunday belgilar chiqdi.',
      q: "«O'zi o'zgartirdi» belgisi nimani bildiradi?",
      opts: ["Buni so'ramagansiz, sun'iy intellekt o'zi qildi", "Buni mijoz telefon orqali so'ragan", 'Bu joy ikkinchi promptda yozilgan', "Bu joyni endi o'zgartirib bo'lmaydi"],
      why: "Bu belgi promptda so'ralmagan o'zgarishni ko'rsatadi. Odatda u «qolganini o'zgartirma» yozilmaganda chiqadi.",
    },
    ru: {
      ctx: 'После второго промпта на сайте появились такие метки.',
      q: 'Что значит метка «Сам поменял»?',
      opts: ['Этого не просили, ИИ сделал сам', 'Это клиент попросил по телефону', 'Это место написано во втором промпте', 'Это место больше нельзя изменить'],
      why: 'Метка показывает изменение, которого в промпте не просили. Обычно она появляется, когда не написано «остальное не меняй».',
    },
    en: {
      ctx: 'After the second prompt, these labels appeared on the site.',
      q: 'What does the “Changed by itself” label mean?',
      opts: ['Nobody asked for it, the AI did it itself', 'The client asked for it by phone', 'This part was written in the second prompt', 'This part can’t be changed any more'],
      why: 'The label shows a change the prompt didn’t ask for. It usually appears when “don’t change anything else” wasn’t written.',
    },
  },
  {
    id: 'ai_l07_q06', difficulty: 'easy', tags: ['ikkinchi-prompt'], sort: false,
    vis: null,
    uz: {
      ctx: 'Sayt mijozga deyarli yoqdi, faqat bitta blok yetishmaydi.',
      q: 'Nega birinchi promptni qayta yozmay, ikkinchi prompt yozamiz?',
      opts: ['Yoqqan joylar qoladi, faqat kamchilik tuzaladi', "Birinchi promptni o'zgartirib bo'lmaydi", "Ikkinchi prompt har doim qisqaroq bo'ladi", "Sun'iy intellekt birinchi promptni unutadi"],
      why: "Ikkinchi prompt tayyor saytni tuzatadi: faqat yetishmagan blok qo'shiladi, mijozga yoqqan hamma narsa saqlanadi.",
    },
    ru: {
      ctx: 'Сайт клиенту почти понравился, не хватает одного блока.',
      q: 'Почему пишем второй промпт, а не первый заново?',
      opts: ['Удачное остаётся, исправляется только недочёт', 'Первый промпт нельзя изменить', 'Второй промпт всегда короче', 'ИИ забывает первый промпт'],
      why: 'Второй промпт правит готовый сайт: добавляется только недостающий блок, а всё, что понравилось клиенту, сохраняется.',
    },
    en: {
      ctx: 'The client almost likes the site; only one block is missing.',
      q: 'Why do we write a second prompt, not the first one again?',
      opts: ['The good parts stay, only the gap gets fixed', 'The first prompt can’t be changed', 'A second prompt is always shorter', 'The AI forgets the first prompt'],
      why: 'A second prompt fixes the ready site: only the missing block is added, and everything the client liked is kept.',
    },
  },

  // ── medium ──
  {
    id: 'ai_l07_q07', difficulty: 'medium', tags: ['qolganini', 'ozi-ozgartirdi'], sort: false,
    vis: { ai: {
      prompt: [
        PR(1, T('Muzey sayti… (7 qator)', 'Сайт музея… (7 строк)', 'A museum site… (7 lines)')),
        PR(2, T("sharhlar blokini qo'sh", 'добавь блок отзывов', 'add a reviews block'), true),
      ],
    } },
    uz: {
      ctx: "Mijozga muzey saytining hammasi yoqqan edi, faqat sharhlar yo'q edi.",
      q: "Shu promptdan keyin saytda nima bo'lishi mumkin?",
      opts: ["Sharhlar qo'shiladi, rang va nom ham o'zgaradi", "Faqat sharhlar qo'shiladi, qolgani joyida", "Hech narsa o'zgarmaydi: blok nomi noaniq", "Sayt o'chib, bo'm-bo'sh sahifa qoladi"],
      why: "«Qolganini o'zgartirma» yo'q — sun'iy intellekt saytni qaytadan yozadi: sharhlar qo'shiladi, lekin rang, nom va bloklar tartibi ham o'zgaradi.",
    },
    ru: {
      ctx: 'Клиенту нравилось в сайте музея всё, не хватало только отзывов.',
      q: 'Что может случиться с сайтом после этого промпта?',
      opts: ['Отзывы появятся, а цвет и название сменятся', 'Добавятся только отзывы, остальное на месте', 'Ничего не изменится: имя блока неточное', 'Сайт удалится, останется пустая страница'],
      why: 'Нет «остальное не меняй» — ИИ пишет сайт заново: отзывы появятся, но цвет, название и порядок блоков тоже поменяются.',
    },
    en: {
      ctx: 'The client liked everything on the museum site; only reviews were missing.',
      q: 'What can happen to the site after this prompt?',
      opts: ['Reviews appear, and the colour and name change', 'Only reviews are added, the rest stays put', 'Nothing changes: the block name is unclear', 'The site is deleted, leaving an empty page'],
      why: 'There’s no “don’t change anything else”, so the AI rewrites the site: reviews appear, but the colour, name and block order change too.',
    },
  },
  {
    id: 'ai_l07_q08', difficulty: 'medium', tags: ['nima-qanday', 'taxmin'], sort: false,
    vis: { ai: {
      prompt: [
        PR(1, T("Sport do'koni sayti… (7 qator)", 'Сайт спортивного магазина… (7 строк)', 'A sports shop site… (7 lines)')),
        PR(2, T("tugmani o'zgartir, qolganini o'zgartirma", 'измени кнопку, остальное не меняй', 'change the button, don’t change anything else'), true),
      ],
      site: {
        title: T("Sport do'koni", 'Спортивный магазин', 'Sports shop'), em: '👟', c: '#2563EB', c2: '#1E40AF', bg: '#DBEAFE', oneBtn: true,
        nav: [T("Krossovkalar", 'Кроссовки', 'Sneakers'), T("To'plar", 'Мячи', 'Balls'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi kolleksiya', 'Новая коллекция', 'New collection'), sub: T('Mashg\'ulot uchun hamma narsa', 'Всё для тренировок', 'Everything for training'),
        cta: T('Buyurtma berish', 'Заказать', 'Order'), btn: '#111827', btnFg: '#FDE047',
        marks: { cta: GM },
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Mijoz: «Tugma ko'rinmayapti, uni kattaroq qiling.»",
      q: "Nega tugma qora-sariq bo'lib qoldi?",
      opts: ["«Qanday» yo'q, sun'iy intellekt taxmin qildi", "Mijoz tugmani qora-sariq qilishni so'ragan", "«Qolganini o'zgartirma» yozilmagan", "Sport saytlarida tugma doim qora-sariq"],
      why: "Promptda faqat «tugmani o'zgartir» bor: nimani — bor, qanday — yo'q. Sun'iy intellekt o'zi taxmin qildi. Kerak edi: «tugmani kattaroq qil».",
    },
    ru: {
      ctx: 'Клиент: «Кнопку не видно, сделайте её больше».',
      q: 'Почему кнопка стала чёрно-жёлтой?',
      opts: ['Не написано «как», ИИ угадал сам', 'Клиент просил чёрно-жёлтую кнопку', 'Не написано «остальное не меняй»', 'У спортивных сайтов кнопки всегда такие'],
      why: 'В промпте только «измени кнопку»: что — есть, как — нет. ИИ угадал сам. Нужно было: «сделай кнопку больше».',
    },
    en: {
      ctx: 'The client: “You can’t see the button, make it bigger.”',
      q: 'Why did the button turn black and yellow?',
      opts: ['The “how” is missing, so the AI guessed', 'The client asked for a black and yellow button', '“Don’t change anything else” is missing', 'Sports sites always have such buttons'],
      why: 'The prompt only says “change the button”: the what is there, the how isn’t. The AI guessed. It needed: “make the button bigger”.',
    },
  },
  {
    id: 'ai_l07_q09', difficulty: 'medium', tags: ['nima-qanday', 'qolganini'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Sarlavha juda kichkina, uzoqdan o'qib bo'lmaydi. Qolgani bizga yoqdi!»", '«Заголовок совсем маленький, издалека не прочитать. Остальное нам понравилось!»', '“The heading is tiny, you can’t read it from afar. We like the rest!”') },
    } },
    uz: {
      ctx: "Bolalar kutubxonasi sayti tayyor. Mijozning xabarini o'qing.",
      q: "Qaysi ikkinchi prompt to'g'ri?",
      opts: ["sarlavhani kattaroq qil, qolganini o'zgartirma", "sarlavhani o'zgartir, qolganini o'zgartirma", 'sarlavhani kattaroq qil, saytni ham yangila', "saytni yaxshiroq qil, qolganini o'zgartirma"],
      why: "Nimani — sarlavhani, qanday — kattaroq, oxirida esa «qolganini o'zgartirma». Shunda mijozga yoqqan joylar saqlanadi.",
    },
    ru: {
      ctx: 'Сайт детской библиотеки готов. Прочитай сообщение клиента.',
      q: 'Какой второй промпт правильный?',
      opts: ['сделай заголовок больше, остальное не меняй', 'измени заголовок, остальное не меняй', 'сделай заголовок больше и обнови сайт', 'сделай сайт лучше, остальное не меняй'],
      why: 'Что — заголовок, как — больше, а в конце «остальное не меняй». Тогда всё, что понравилось клиенту, сохранится.',
    },
    en: {
      ctx: 'The kids’ library site is ready. Read the client’s message.',
      q: 'Which second prompt is right?',
      opts: ['make the heading bigger, don’t change the rest', 'change the heading, don’t change the rest', 'make the heading bigger, and refresh the site', 'make the site better, don’t change the rest'],
      why: 'What — the heading, how — bigger, and at the end “don’t change the rest”. Then everything the client liked stays.',
    },
  },
  {
    id: 'ai_l07_q10', difficulty: 'medium', tags: ['qolganini'], sort: false,
    vis: null,
    uz: {
      ctx: "Ikkinchi prompt: «galereya blokini qo'sh, qolganini o'zgartirma».",
      q: "«Qolganini o'zgartirma» nima qiladi?",
      opts: ['Galereyadan boshqa hamma narsani saqlab qoladi', "Galereyani ham qo'shishga ruxsat bermaydi", 'Saytni birinchi promptdagi holiga qaytaradi', "Saytni o'chirib, boshidan yaratadi"],
      why: "Bu so'zlar sun'iy intellektga aytadi: galereyani qo'sh, rang, nom va tartibga esa tegma. Yangi blok baribir qo'shiladi.",
    },
    ru: {
      ctx: 'Второй промпт: «добавь блок галереи, остальное не меняй».',
      q: 'Что делает «остальное не меняй»?',
      opts: ['Сохраняет всё, кроме новой галереи', 'Запрещает добавлять и галерею тоже', 'Возвращает сайт к первому промпту', 'Удаляет сайт и создаёт его с нуля'],
      why: 'Эти слова говорят ИИ: добавь галерею, а цвет, название и порядок не трогай. Новый блок всё равно появится.',
    },
    en: {
      ctx: 'The second prompt: “add a gallery block, don’t change anything else”.',
      q: 'What does “don’t change anything else” do?',
      opts: ['Keeps everything except the new gallery', 'Forbids adding the gallery too', 'Turns the site back to the first prompt', 'Deletes the site and builds it from scratch'],
      why: 'These words tell the AI: add the gallery, but don’t touch the colour, name or order. The new block still appears.',
    },
  },
  {
    id: 'ai_l07_q11', difficulty: 'medium', tags: ['uchinchi-prompt'], sort: false,
    vis: { ai: {
      prompt: [
        PR(1, T("Bolalar bog'chasi sayti… (7 qator)", 'Сайт детского сада… (7 строк)', 'A kindergarten site… (7 lines)')),
        PR(2, T("telefon raqamini +998 90 345 67 89 qil, qolganini o'zgartirma", 'поставь телефон +998 90 345 67 89, остальное не меняй', 'set the phone to +998 90 345 67 89, don’t change anything else')),
        PR(3, null),
      ],
    } },
    uz: {
      ctx: "Raqam endi to'g'ri. Lekin saytda obuna oynasi chiqib turibdi, mijozga u kerak emas.",
      q: 'Uchinchi prompt qanday bo\'ladi?',
      opts: ["oynani olib tashla, qolganini o'zgartirma", "oynani o'zgartir, qolganini o'zgartirma", "raqamni yana yoz, oynani ham olib tashla", "hammasini boshidan yarat, oyna bo'lmasin"],
      why: "Raqam tuzaldi, endi oynani olib tashlaymiz. Bittadan aniq tuzatish va «qolganini o'zgartirma» — shunda raqam ham joyida qoladi.",
    },
    ru: {
      ctx: 'Номер теперь верный. Но на сайте висит окно подписки, а клиенту оно не нужно.',
      q: 'Каким будет третий промпт?',
      opts: ['убери окно, остальное не меняй', 'измени окно, остальное не меняй', 'напиши номер ещё раз и убери окно', 'создай всё заново, но без окна'],
      why: 'Номер исправлен, теперь убираем окно. Точная правка и «остальное не меняй» — тогда и номер останется на месте.',
    },
    en: {
      ctx: 'The number is right now. But a subscribe window pops up, and the client doesn’t want it.',
      q: 'What will the third prompt be?',
      opts: ['remove the window, don’t change anything else', 'change the window, don’t change anything else', 'write the number again and remove the window', 'build it all again, but with no window'],
      why: 'The number is fixed; now we remove the window. An exact fix plus “don’t change anything else” keeps the number in place too.',
    },
  },
  {
    id: 'ai_l07_q12', difficulty: 'medium', tags: ['nima-qanday', 'telefon'], sort: false,
    vis: { ai: {
      prompt: [
        PR(1, T("Shaxmat to'garagi sayti… (7 qator)", 'Сайт шахматного кружка… (7 строк)', 'A chess club site… (7 lines)')),
        PR(2, T("telefon raqamini to'g'irla, qolganini o'zgartirma", 'исправь номер телефона, остальное не меняй', 'fix the phone number, don’t change anything else'), true),
      ],
      site: {
        title: T("Shaxmat to'garagi", 'Шахматный кружок', 'Chess club'), em: '♟️', c: '#334155', c2: '#0F172A', bg: '#E2E8F0',
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Turnirlar', 'Турниры', 'Tournaments'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Birga o'ylaymiz va yutamiz!", 'Думаем и побеждаем вместе!', 'We think and win together!'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        info: [{ t: '📞 +998 90 000 00 00', guess: G }],
        marks: { info: GM },
        noFoot: true,
      },
      focus: '.info',
    } },
    uz: {
      ctx: "Mijoz: «Raqamimiz +998 91 765 43 21, saytdagisi boshqa!»",
      q: "Nega raqam yana noto'g'ri chiqdi?",
      opts: ["Promptda yangi raqamning o'zi yozilmagan", "«Qolganini o'zgartirma» raqamni ham saqladi", "Sun'iy intellekt raqamlarni yoza olmaydi", "Telefon raqami saytga sig'madi"],
      why: "Sun'iy intellekt mijozning raqamini bilmaydi, shuning uchun o'zi o'ylab topdi. Raqamning o'zini yozish kerak: «telefon raqamini +998 91 765 43 21 qil».",
    },
    ru: {
      ctx: 'Клиент: «Наш номер +998 91 765 43 21, а на сайте другой!»',
      q: 'Почему номер снова неверный?',
      opts: ['В промпте не написан сам новый номер', '«Остальное не меняй» сохранило и номер', 'ИИ не умеет писать цифры', 'Номер телефона не поместился на сайт'],
      why: 'ИИ не знает номер клиента, поэтому придумал его сам. Нужно написать сам номер: «поставь телефон +998 91 765 43 21».',
    },
    en: {
      ctx: 'The client: “Our number is +998 91 765 43 21, the site shows another one!”',
      q: 'Why is the number wrong again?',
      opts: ['The prompt doesn’t include the new number itself', '“Don’t change anything else” kept the number', 'The AI can’t write digits', 'The phone number didn’t fit on the site'],
      why: 'The AI doesn’t know the client’s number, so it made one up. Write the number itself: “set the phone to +998 91 765 43 21”.',
    },
  },
  {
    id: 'ai_l07_q13', difficulty: 'medium', tags: ['uchinchi-prompt', 'nima-qanday'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Biz qizil rang so'ragan edik, binafsha emas!»", '«Мы просили красный цвет, а не фиолетовый!»', '“We asked for red, not purple!”') },
      prompt: [
        PR(1, T('Burger kafesi sayti… (7 qator)', 'Сайт бургерной… (7 строк)', 'A burger café site… (7 lines)')),
        PR(2, T("rangini o'zgartir, qolganini o'zgartirma", 'измени цвет, остальное не меняй', 'change the colour, don’t change anything else')),
        PR(3, null),
      ],
    } },
    uz: {
      ctx: "Ikkinchi promptdan keyin sayt binafsha bo'lib qoldi.",
      q: "Uchinchi prompt qanday bo'ladi?",
      opts: ["asosiy rangni qizil qil, qolganini o'zgartirma", "rangini yana o'zgartir, qolganini o'zgartirma", 'asosiy rangni qizil qil, saytni qayta yarat', "rangini chiroyliroq qil, qolganini o'zgartirma"],
      why: "Ikkinchi promptda «qanday» yo'q edi, binafsha rangni sun'iy intellekt o'zi tanladi. Endi aniq: qizil, qolgani esa saqlanadi.",
    },
    ru: {
      ctx: 'После второго промпта сайт стал фиолетовым.',
      q: 'Каким будет третий промпт?',
      opts: ['сделай главный цвет красным, остальное не меняй', 'измени цвет ещё раз, остальное не меняй', 'сделай главный цвет красным, создай сайт заново', 'сделай цвет красивее, остальное не меняй'],
      why: 'Во втором промпте не было «как», и фиолетовый ИИ выбрал сам. Теперь точно: красный, а остальное сохраняется.',
    },
    en: {
      ctx: 'After the second prompt, the site turned purple.',
      q: 'What will the third prompt be?',
      opts: ['make the main colour red, don’t change the rest', 'change the colour again, don’t change the rest', 'make the main colour red, build the site again', 'make the colour nicer, don’t change the rest'],
      why: 'The second prompt had no “how”, so the AI chose purple itself. Now it’s exact: red, and the rest is kept.',
    },
  },
  {
    id: 'ai_l07_q14', difficulty: 'medium', tags: ['yana-tekshir'], sort: false,
    vis: null,
    uz: {
      ctx: "Sun'iy intellekt birinchi promptdan sayt yaratdi.",
      q: "Ishni qaysi tartibda qilamiz?",
      opts: ['Tekshiramiz → aniq tuzatamiz → yana tekshiramiz', 'Tuzatamiz → mijozga yuboramiz → tekshirmaymiz', 'Qaytadan yaratamiz → yuboramiz → kutamiz', '«Yaxshiroq qil» → yuboramiz → tayyor'],
      why: "Oldin natijani buyurtma bilan solishtiramiz, keyin aniq tuzatamiz. Har bir promptdan keyin yana tekshiramiz: hammasi joyidami?",
    },
    ru: {
      ctx: 'ИИ сделал сайт по первому промпту.',
      q: 'В каком порядке работаем?',
      opts: ['Проверяем → точно исправляем → снова проверяем', 'Исправляем → отправляем клиенту → не проверяем', 'Создаём заново → отправляем → ждём', '«Сделай лучше» → отправляем → готово'],
      why: 'Сначала сверяем результат с заказом, потом точно исправляем. После каждого промпта проверяем снова: всё ли на месте?',
    },
    en: {
      ctx: 'The AI made a site from the first prompt.',
      q: 'In what order do we work?',
      opts: ['Check → fix exactly → check again', 'Fix → send to the client → don’t check', 'Build again → send → wait', '“Make it better” → send → done'],
      why: 'First we compare the result with the order, then fix it exactly. After every prompt we check again: is everything in place?',
    },
  },

  // ── hard ──
  {
    id: 'ai_l07_q15', difficulty: 'hard', tags: ['ozi-ozgartirdi', 'qolganini'], sort: false,
    vis: { ai: { focus: '.blk',
      site: {
        title: T("Raqs studiyasi — eng zo'r tanlov!", 'Танцевальная студия — лучший выбор!', 'Dance studio — the best choice!'), em: '💃', c: '#9333EA', c2: '#6B21A8', bg: '#F3E8FF',
        nav: [T('Aloqa', 'Контакты', 'Contact'), T('Rasmlar', 'Фото', 'Photos'), T('Sharhlar', 'Отзывы', 'Reviews')],
        badge: T('Yangi mavsum', 'Новый сезон', 'New season'), sub: T("Biz bilan raqsga tushing!", 'Танцуй с нами!', 'Dance with us!'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        marks: { hero: OZ },
        blocks: [
          { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 94 700 80 90', wide: true }], mark: OZ },
          { h: T('Rasmlar', 'Фото', 'Photos'), items: [{ t: '📸' }, { t: '📸' }, { t: '📸' }] },
          { h: T('Sharhlar', 'Отзывы', 'Reviews'), items: [{ t: T("«Juda zo'r ustozlar!»", '«Очень классные учителя!»', '“Really great teachers!”'), wide: true }], mark: PM(2) },
        ],
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Oldin sayt qizil edi, nomi «Raqs studiyasi», bloklar: rasmlar, aloqa.",
      q: 'Qaysi ikkinchi prompt yuborilgan?',
      opts: ["sharhlar blokini qo'sh", "sharhlar blokini qo'sh, qolganini o'zgartirma", "rangni binafsha qil, qolganini o'zgartirma", "saytni qaytadan yarat, sharhlar bo'lmasin"],
      why: "Sharhlar qo'shildi, lekin rang, nom va bloklar tartibi ham o'zgardi. Demak, promptda «qolganini o'zgartirma» bo'lmagan.",
    },
    ru: {
      ctx: 'Раньше сайт был красным, назывался «Танцевальная студия», блоки: фото, контакты.',
      q: 'Какой второй промпт отправили?',
      opts: ['добавь блок отзывов', 'добавь блок отзывов, остальное не меняй', 'сделай цвет фиолетовым, остальное не меняй', 'создай сайт заново, без отзывов'],
      why: 'Отзывы добавились, но цвет, название и порядок блоков тоже поменялись. Значит, в промпте не было «остальное не меняй».',
    },
    en: {
      ctx: 'Before, the site was red, called “Dance studio”, with blocks: photos, contact.',
      q: 'Which second prompt was sent?',
      opts: ['add a reviews block', 'add a reviews block, don’t change the rest', 'make the colour purple, don’t change the rest', 'build the site again, with no reviews'],
      why: 'Reviews were added, but the colour, name and block order changed too. So the prompt had no “don’t change the rest”.',
    },
  },
  {
    id: 'ai_l07_q16', difficulty: 'hard', tags: ['nima-qanday', 'ikkinchi-prompt'], sort: false,
    vis: null,
    uz: {
      ctx: "Mijoz: «Narxlar yo'q, tugma ham kichkina.» Prompt «qolganini o'zgartirma» bilan tugaydi.",
      q: 'Uning oldiga nima yozamiz?',
      opts: ["narxlar blokini qo'sh va tugmani kattaroq qil", "narxlar blokini qo'sh va tugmani o'zgartir", 'ikkala kamchilikni tuzatib, yaxshiroq qil', "narxlar blokini qo'sh, tugmaga esa tegma"],
      why: "Bitta promptda bir nechta aniq tuzatish bo'lishi mumkin, har birida nima va qanday bor: narxlar — qo'sh, tugma — kattaroq.",
    },
    ru: {
      ctx: 'Клиент: «Цен нет, и кнопка маленькая». Промпт заканчивается на «остальное не меняй».',
      q: 'Что написать перед этим?',
      opts: ['добавь блок цен и сделай кнопку больше', 'добавь блок цен и измени кнопку', 'исправь оба недочёта, сделай лучше', 'добавь блок цен, а кнопку не трогай'],
      why: 'В одном промпте может быть несколько точных правок, и в каждой есть что и как: цены — добавить, кнопку — больше.',
    },
    en: {
      ctx: 'The client: “No prices, and the button is small.” The prompt ends with “don’t change anything else”.',
      q: 'What do we write before it?',
      opts: ['add a prices block and make the button bigger', 'add a prices block and change the button', 'fix both problems, make it better', 'add a prices block, but leave the button'],
      why: 'One prompt can hold several exact fixes, each with a what and a how: prices — add, the button — bigger.',
    },
  },
  {
    id: 'ai_l07_q17', difficulty: 'hard', tags: ['yaxshiroq', 'taxmin'], sort: false,
    vis: { ai: {
      prompt: [
        PR(1, T("Mevalar do'koni sayti… (7 qator)", 'Сайт фруктовой лавки… (7 строк)', 'A fruit shop site… (7 lines)')),
        PR(2, T("yaxshiroq qil, qolganini o'zgartirma", 'сделай лучше, остальное не меняй', 'make it better, don’t change anything else'), true),
      ],
    } },
    uz: {
      ctx: "Mijoz narxlarni so'ragan edi. Prompt yuborildi: faqat sarlavha shrifti o'zgardi, yonida «Taxmin».",
      q: "Nega narxlar paydo bo'lmadi?",
      opts: ["«Yaxshiroq» nimaligini sun'iy intellekt bilmaydi", "«Qolganini o'zgartirma» narxlarni taqiqladi", 'Narxlar uchun uchinchi prompt shart', "Sun'iy intellekt narxlarni yozishni bilmaydi"],
      why: "Promptda narxlar haqida bir so'z ham yo'q. «Yaxshiroq qil» desangiz, u o'zicha nimanidir o'zgartiradi. Kerak edi: «narxlar blokini qo'sh».",
    },
    ru: {
      ctx: 'Клиент просил цены. Промпт отправлен: изменился только шрифт заголовка, рядом «Догадка».',
      q: 'Почему цены так и не появились?',
      opts: ['Что значит «лучше», ИИ не знает', '«Остальное не меняй» запретило цены', 'Для цен обязателен третий промпт', 'ИИ не умеет писать цены'],
      why: 'В промпте нет ни слова о ценах. На «сделай лучше» ИИ меняет что-то на свой вкус. Нужно было: «добавь блок цен».',
    },
    en: {
      ctx: 'The client asked for prices. The prompt was sent: only the heading font changed, marked “Guess”.',
      q: 'Why didn’t the prices appear?',
      opts: ['The AI doesn’t know what “better” means', '“Don’t change anything else” blocked the prices', 'Prices need a third prompt', 'The AI can’t write prices'],
      why: 'The prompt says nothing about prices. With “make it better”, the AI changes something its own way. It needed: “add a prices block”.',
    },
  },
  {
    id: 'ai_l07_q18', difficulty: 'hard', tags: ['tahlil', 'telefon'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Buyurtma: telefon +998 91 444 55 66, yashil rang, mashg'ulotlar jadvali.»", '«Заказ: телефон +998 91 444 55 66, зелёный цвет, расписание тренировок».', '“The order: phone +998 91 444 55 66, green colour, a training schedule.”') },
      site: {
        title: T('Tennis klubi', 'Теннисный клуб', 'Tennis club'), em: '🎾', c: '#16A34A', c2: '#166534', bg: '#DCFCE7',
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Murabbiylar', 'Тренеры', 'Coaches'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yangi guruhlar', 'Новые группы', 'New groups'), sub: T("Korda uchrashamiz!", 'Встретимся на корте!', 'See you on the court!'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        info: [{ t: '📞 +998 91 444 66 55' }],
        blocks: [{ h: T('Jadval', 'Расписание', 'Schedule'), items: [{ t: T('Dushanba · 17:00', 'Понедельник · 17:00', 'Monday · 17:00') }, { t: T('Payshanba · 17:00', 'Четверг · 17:00', 'Thursday · 17:00') }] }],
        noFoot: true,
      },
    } },
    uz: {
      ctx: 'Buyurtmani sayt bilan diqqat bilan solishtiring.',
      q: "Nima buyurtmaga to'g'ri kelmaydi?",
      opts: ['Telefon raqami — raqamlari boshqa', "Hammasi to'g'ri, tuzatish shart emas", 'Rangi — sayt yashil emas', "Jadval — u saytda yo'q"],
      why: "Raqamlarni bittalab solishtiring: oxirida 55 66 emas, 66 55 turibdi. Kichkina farq ham — bajarilmagan band.",
    },
    ru: {
      ctx: 'Внимательно сверь заказ с сайтом.',
      q: 'Что не совпадает с заказом?',
      opts: ['Телефон — цифры другие', 'Всё верно, исправлять нечего', 'Цвет — сайт не зелёный', 'Расписание — его нет на сайте'],
      why: 'Сверь цифры по одной: в конце не 55 66, а 66 55. Даже маленькое отличие — невыполненный пункт.',
    },
    en: {
      ctx: 'Check the order against the site carefully.',
      q: 'What doesn’t match the order?',
      opts: ['The phone — the digits are different', 'Everything is right, nothing to fix', 'The colour — the site isn’t green', 'The schedule — it isn’t on the site'],
      why: 'Compare the digits one by one: the end is 66 55, not 55 66. Even a small difference is a point not done.',
    },
  },
];
