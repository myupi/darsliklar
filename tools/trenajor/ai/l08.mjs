// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 8 «Финальный ИИ-проект» — 21 вопрос с выбором (6 easy, 10 medium, 5 hard).
// Повторение всего модуля: формула из семи вопросов (Nima? Nega? Kim uchun? Ichida nima? Ko'rinishi? Qanday ishlaydi?
// Qoidalar?) и второй промпт. Проверяем: одна строка — всё «Taxmin»; главную работу делает человек; какая строка что дала
// на сайте (Nega? — кнопка и форма, Kim uchun? — раздел для родителей, порядок блоков, hover); что вписать в строку
// из письма клиента; чего не хватает в промпте и в письме; первый цвет — главный; без «Ko'rinishi?» вид — по аудитории,
// а написанный вид сильнее аудитории; «jonli» — догадка; номер — только с цифрами; правило «ko'pi bilan 2 ta blok»
// сильнее списка блоков; второй промпт вместо нового первого, что + как + «qolganini o'zgartirma».
// Сайты — как их честно собрал бы симулятор модуля (tools/ai1/ai1-kit.jsx, tools/ai7/ai7-fix.jsx).
// Метки на сайте — цвета формулы; «Taxmin» — серая; второй промпт — «2-prompt».
// Ситуации тестов модуля (tools/aitest/l01…l07.jsx) и урока 8 (фестиваль роботов) не повторяются.
// Апостроф в узбекском — только ASCII «'». Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const G = T('Taxmin', 'Догадка', 'Guess');
const GM = { t: G, c: '#475569' };
const FQ = [
  T('Nima?', 'Что?', 'What?'), T('Nega?', 'Зачем?', 'Why?'), T('Kim uchun?', 'Для кого?', 'For whom?'),
  T('Ichida nima?', 'Что внутри?', 'What’s inside?'), T("Ko'rinishi?", 'Как выглядит?', 'How it looks?'),
  T('Qanday ishlaydi?', 'Как ведёт себя?', 'How it behaves?'), T('Qoidalar?', 'Какие правила?', 'What rules?'),
];
const FC = ['#FA4F28', '#7C3AED', '#0D9488', '#DB2777', '#65A30D', '#B45309', '#BE123C'];
const MK = (i) => ({ t: FQ[i], c: FC[i] });
const L = (q, t, hl) => (hl ? { q, t, hl: true } : { q, t });
const CLIENT = T('Mijoz', 'Клиент', 'Client');
// Варианты-метки формулы: [uz], [ru], [en] в заданном порядке.
const fq = (...ix) => ({ uz: ix.map((i) => FQ[i].uz), ru: ix.map((i) => FQ[i].ru), en: ix.map((i) => FQ[i].en) });

export default [
  // ── easy ──
  {
    id: 'ai_l08_q01', difficulty: 'easy', tags: ['formula'], sort: true,
    vis: null,
    uz: {
      ctx: 'Yakuniy loyihada promptni formula bo\'yicha yozamiz.',
      q: 'Formulada nechta savol bor?',
      opts: ['7 ta', '3 ta', '5 ta', '10 ta'],
      why: "Nima? Nega? Kim uchun? Ichida nima? Ko'rinishi? Qanday ishlaydi? Qoidalar? — yettita savol. Har biri saytning bir qismini beradi.",
    },
    ru: {
      ctx: 'В финальном проекте пишем промпт по формуле.',
      q: 'Сколько вопросов в формуле?',
      opts: ['7', '3', '5', '10'],
      why: 'Что? Зачем? Для кого? Что внутри? Как выглядит? Как ведёт себя? Какие правила? — семь вопросов. Каждый даёт свою часть сайта.',
    },
    en: {
      ctx: 'In the final project we write the prompt with the formula.',
      q: 'How many questions are in the formula?',
      opts: ['7', '3', '5', '10'],
      why: 'What? Why? For whom? What’s inside? How it looks? How it behaves? What rules? — seven questions. Each gives its own part of the site.',
    },
  },
  {
    id: 'ai_l08_q02', difficulty: 'easy', tags: ['qoidalar'], sort: false,
    vis: null,
    uz: {
      ctx: "Promptdagi qator: «reklama oynasi va chegirma bo'lmasin».",
      q: 'Bu qator qaysi savolga javob beradi?',
      opts: fq(6, 3, 5, 4).uz,
      why: "«… bo'lmasin» — bu taqiq, ya'ni qoida. Taqiqlar va majburiy narsalar «Qoidalar?» qatoriga yoziladi.",
    },
    ru: {
      ctx: 'Строка промпта: «без рекламного окна и скидок».',
      q: 'На какой вопрос отвечает эта строка?',
      opts: fq(6, 3, 5, 4).ru,
      why: '«Без …» — это запрет, то есть правило. Запреты и обязательные вещи пишут в строку «Какие правила?».',
    },
    en: {
      ctx: 'A prompt line: “no pop-up window or discount”.',
      q: 'Which question does this line answer?',
      opts: fq(6, 3, 5, 4).en,
      why: '“No …” is a ban, that is, a rule. Bans and must-haves go in the “What rules?” line.',
    },
  },
  {
    id: 'ai_l08_q03', difficulty: 'easy', tags: ['kim-uchun'], sort: false,
    vis: { ai: {
      prompt: [
        L(0, T('Akvapark sayti', 'Сайт аквапарка', 'A water park site')),
        L(1, T('oilalar chipta olsin', 'чтобы семьи покупали билеты', 'get families to buy tickets')),
        L(2, null),
      ],
    } },
    uz: {
      ctx: "Akvaparkka asosan bolali oilalar keladi.",
      q: "«Kim uchun?» qatoriga nima yozamiz?",
      opts: ["6–12 yoshli bolalar va ota-onalari", 'hamma odamlar uchun, kim kelsa ham', 'suv attraksionlari, narxlar, aloqa', "ko'k va sariq, quvnoq ko'rinishda"],
      why: "«Kim uchun?» — kim kelishi: yoshi va kimligi. «Hamma uchun» hech narsa aytmaydi, attraksionlar — «Ichida nima?», ranglar — «Ko'rinishi?».",
    },
    ru: {
      ctx: 'В аквапарк в основном приходят семьи с детьми.',
      q: 'Что написать в строку «Для кого?»?',
      opts: ['дети 6–12 лет и их родители', 'для всех людей, кто бы ни пришёл', 'водные горки, цены, контакты', 'синий и жёлтый, весёлый вид'],
      why: '«Для кого?» — кто придёт: возраст и кто они. «Для всех» ничего не говорит, горки — это «Что внутри?», цвета — «Как выглядит?».',
    },
    en: {
      ctx: 'Mostly families with kids come to the water park.',
      q: 'What goes in the “For whom?” line?',
      opts: ['kids aged 6–12 and their parents', 'for all people, whoever comes', 'water slides, prices, contact', 'blue and yellow, a cheerful look'],
      why: '“For whom?” is who will come: their age and who they are. “For all” says nothing, slides are “What’s inside?”, colours are “How it looks?”.',
    },
  },
  {
    id: 'ai_l08_q04', difficulty: 'easy', tags: ['taxmin', 'formula'], sort: false,
    vis: { ai: {
      prompt: [L(0, T('Konsert sayti', 'Сайт концерта', 'A concert site'))],
      site: {
        title: T('Konsert', 'Концерт', 'Concert'), em: '🎤', c: '#DB2777', c2: '#9D174D', bg: '#FCE7F3',
        nav: [T('Dastur', 'Программа', 'Programme'), T('Chiptalar', 'Билеты', 'Tickets'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T("Eng zo'r kecha!", 'Лучший вечер!', 'The best night!'), sub: T('Hammani kutamiz!', 'Ждём всех!', 'Everyone’s welcome!'),
        cta: T('Batafsil', 'Подробнее', 'More'),
        info: [{ t: '📞 +998 00 000 00 00', guess: G }],
        blocks: [{ h: T('Chiptalar', 'Билеты', 'Tickets'), items: [{ t: T('Chipta', 'Билет', 'Ticket'), p: T("50 000 so'm", '50 000 сум', '50,000 sum'), guess: G }] }],
        marks: { hero: GM },
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Kodi bitta qator yozib, «Yuborish»ni bosdi.",
      q: "Nega saytda hamma joyda «Taxmin» turibdi?",
      opts: ['Qolgan oltita savolga javob yozilmagan', "Sun'iy intellekt konsertlarni bilmaydi", 'Sayt hali oxirigacha yuklanmagan', "Konsert saytlari doim shunday bo'ladi"],
      why: "Bitta qatordan sun'iy intellekt maqsadni ham, auditoriyani ham, narx va raqamni ham bilmaydi. Shuning uchun qolganini o'zi taxmin qiladi.",
    },
    ru: {
      ctx: 'Коди написал одну строку и нажал «Отправить».',
      q: 'Почему на сайте везде «Догадка»?',
      opts: ['На остальные шесть вопросов нет ответов', 'ИИ ничего не знает о концертах', 'Сайт ещё не загрузился до конца', 'Сайты концертов всегда такие'],
      why: 'Из одной строки ИИ не знает ни цели, ни аудитории, ни цены, ни номера. Поэтому всё остальное он угадывает сам.',
    },
    en: {
      ctx: 'Kodi wrote one line and tapped “Send”.',
      q: 'Why does the site say “Guess” everywhere?',
      opts: ['The other six questions have no answers', 'The AI knows nothing about concerts', 'The site hasn’t finished loading', 'Concert sites are always like this'],
      why: 'From one line the AI doesn’t know the goal, the audience, the price or the number. So it guesses all the rest itself.',
    },
  },
  {
    id: 'ai_l08_q05', difficulty: 'easy', tags: ['muallif'], sort: false,
    vis: null,
    uz: {
      ctx: "Kodi aytdi: «Sun'iy intellekt aqlli, menga faqat tugmani bosish qoladi».",
      q: 'Saytda asosiy ishni kim qiladi?',
      opts: ["Odam: o'ylaydi, aniq yozadi, tekshiradi", "Sun'iy intellekt: odam faqat tugma bosadi", 'Mijoz: u promptni o\'zi yozib beradi', "Sun'iy intellekt: u mijozni yaxshi biladi"],
      why: "Sun'iy intellekt — yordamchi. Mijozni tushunish, aniq yozish, natijani tekshirish va tuzatish — odamning ishi.",
    },
    ru: {
      ctx: 'Коди сказал: «ИИ умный, мне остаётся только нажать кнопку».',
      q: 'Кто делает главную работу над сайтом?',
      opts: ['Человек: думает, пишет точно, проверяет', 'ИИ: человек только нажимает кнопку', 'Клиент: он сам пишет промпт', 'ИИ: он хорошо знает клиента'],
      why: 'ИИ — помощник. Понять клиента, написать точно, проверить и исправить результат — работа человека.',
    },
    en: {
      ctx: 'Kodi said: “The AI is smart, all I do is press the button.”',
      q: 'Who does the main work on the site?',
      opts: ['A person: thinks, writes exactly, checks', 'The AI: a person only presses the button', 'The client: they write the prompt', 'The AI: it knows the client well'],
      why: 'The AI is a helper. Understanding the client, writing exactly, checking and fixing the result is a person’s job.',
    },
  },
  {
    id: 'ai_l08_q06', difficulty: 'easy', tags: ['nega'], sort: false,
    vis: { ai: {
      site: {
        title: T('Suzish maktabi', 'Школа плавания', 'Swimming school'), em: '🏊', c: '#0284C7', c2: '#075985', bg: '#E0F2FE',
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Murabbiylar', 'Тренеры', 'Coaches'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Yozgi guruhlar', 'Летние группы', 'Summer groups'), sub: T("Suzishni birga o'rganamiz!", 'Учимся плавать вместе!', 'Let’s learn to swim together!'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        goal: { h: T("Ro'yxatdan o'tish", 'Запись', 'Sign up'), fields: [T('Ism', 'Имя', 'Name'), T('Yosh', 'Возраст', 'Age')], btn: T('Yuborish', 'Отправить', 'Send') },
        noFoot: true,
      },
      focus: '.goal',
    } },
    uz: {
      ctx: "Saytda «Ro'yxatdan o'tish» tugmasi va formasi bor.",
      q: 'Ularni promptning qaysi qatori bergan?',
      opts: fq(1, 0, 2, 4).uz,
      why: "«Nega?» — saytning maqsadi. Maqsad «bolalar ro'yxatdan o'tsin» bo'lsa, saytda shu tugma va forma paydo bo'ladi.",
    },
    ru: {
      ctx: 'На сайте есть кнопка «Записаться» и форма записи.',
      q: 'Какая строка промпта их дала?',
      opts: fq(1, 0, 2, 4).ru,
      why: '«Зачем?» — цель сайта. Если цель «чтобы дети записывались», на сайте появляются такая кнопка и форма.',
    },
    en: {
      ctx: 'The site has a “Sign up” button and a sign-up form.',
      q: 'Which prompt line gave them?',
      opts: fq(1, 0, 2, 4).en,
      why: '“Why?” is the site’s goal. If the goal is “get kids to sign up”, the site gets this button and form.',
    },
  },

  // ── medium ──
  {
    id: 'ai_l08_q07', difficulty: 'medium', tags: ['korinishi', 'mijoz'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Salom! Gitara maktabimiz bor. Bolalar darsga yozilsin. Sayt sokin bo'lsin: jigarrang va oq. Ichida narxlar va jadval bo'lsin.»", '«Здравствуйте! У нас школа гитары. Пусть дети записываются на уроки. Сайт спокойный: коричневый и белый. Внутри — цены и расписание».', '“Hi! We have a guitar school. We want kids to sign up for lessons. The site should be calm: brown and white. Inside: prices and a schedule.”') },
    } },
    uz: {
      ctx: "Mijozning xabarini formulaga bo'lib chiqamiz.",
      q: "Qaysi bo'lak «Ko'rinishi?» qatoriga yoziladi?",
      opts: ["sokin, jigarrang va oq", 'bolalar darsga yozilsin', 'narxlar va jadval', 'gitara maktabi sayti'],
      why: "«Ko'rinishi?» — sayt qanday ko'rinadi: kayfiyat va ranglar. «Yozilsin» — «Nega?», «narxlar va jadval» — «Ichida nima?».",
    },
    ru: {
      ctx: 'Разбираем сообщение клиента по формуле.',
      q: 'Какой кусок идёт в строку «Как выглядит?»?',
      opts: ['спокойный, коричневый и белый', 'чтобы дети записывались на уроки', 'цены и расписание', 'сайт школы гитары'],
      why: '«Как выглядит?» — каким будет сайт: настроение и цвета. «Записывались» — это «Зачем?», «цены и расписание» — «Что внутри?».',
    },
    en: {
      ctx: 'We split the client’s message by the formula.',
      q: 'Which part goes in the “How it looks?” line?',
      opts: ['calm, brown and white', 'get kids to sign up for lessons', 'prices and a schedule', 'a guitar school site'],
      why: '“How it looks?” is what the site looks like: the mood and colours. “Sign up” is “Why?”, “prices and a schedule” is “What’s inside?”.',
    },
  },
  {
    id: 'ai_l08_q08', difficulty: 'medium', tags: ['ichida-nima', 'taxmin'], sort: false,
    vis: { ai: {
      site: {
        title: T('Novvoyxona', 'Пекарня', 'Bakery'), em: '🥐', c: '#B45309', c2: '#78350F', bg: '#FEF3C7',
        nav: [T('Biz haqimizda', 'О нас', 'About'), T('Yangiliklar', 'Новости', 'News'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Har kuni yangi non', 'Свежий хлеб каждый день', 'Fresh bread every day'), sub: T('Issiq non va shirinliklar', 'Горячий хлеб и выпечка', 'Warm bread and pastries'),
        cta: T('Buyurtma berish', 'Заказать', 'Order'),
        blocks: [
          { h: T('Biz haqimizda', 'О нас', 'About us'), items: [{ t: T('2010-yildan beri', 'С 2010 года', 'Since 2010'), wide: true }], mark: GM },
          { h: T('Yangiliklar', 'Новости', 'News'), items: [{ t: T('Yangi non turi', 'Новый сорт хлеба', 'A new kind of bread'), wide: true }], mark: GM },
        ],
        noFoot: true,
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Mijoz menyu va narxlarni kutgan edi. Promptda bitta qator yo'q — bloklarga qarang.",
      q: 'Qaysi qator yozilmagan?',
      opts: fq(3, 2, 5, 6).uz,
      why: "Bloklarni sun'iy intellekt o'zi tanlagan — yonida «Taxmin». Demak, «Ichida nima?» qatori yo'q: qaysi bloklar kerakligi aytilmagan.",
    },
    ru: {
      ctx: 'Клиент ждал меню и цены. В промпте нет одной строки — посмотри на блоки.',
      q: 'Какой строки нет?',
      opts: fq(3, 2, 5, 6).ru,
      why: 'Блоки ИИ выбрал сам — рядом «Догадка». Значит, нет строки «Что внутри?»: не сказано, какие блоки нужны.',
    },
    en: {
      ctx: 'The client expected a menu and prices. One prompt line is missing — look at the blocks.',
      q: 'Which line is missing?',
      opts: fq(3, 2, 5, 6).en,
      why: 'The AI picked the blocks itself — they’re marked “Guess”. So the “What’s inside?” line is missing: nobody said which blocks are needed.',
    },
  },
  {
    id: 'ai_l08_q09', difficulty: 'medium', tags: ['qanday-ishlaydi'], sort: false,
    vis: { ai: {
      site: {
        title: T('Karting klubi', 'Картинг-клуб', 'Karting club'), em: '🏎️', c: '#DC2626', c2: '#991B1B', bg: '#FEE2E2',
        nav: [T('Trassa', 'Трасса', 'Track'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Dam olish kunlari', 'По выходным', 'At weekends'), sub: T('Tezlikni his qiling!', 'Почувствуй скорость!', 'Feel the speed!'),
        cta: T('Joy band qilish', 'Забронировать', 'Book a ride'),
        cursor: 'hover', ctaHot: { scale: 1.25 },
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Sichqoncha tugmaga keldi — tugma kattalashdi. Ketgach, yana oddiy bo'ldi.",
      q: "Qaysi «Qanday ishlaydi?» qatori shuni bergan?",
      opts: ['tugma ustiga kelganda kattalashsin', "tugma doim katta va yorqin bo'lsin", "sayt jonli va qiziqarli bo'lsin", 'tugma bosilganda xabar chiqsin'],
      why: "Qatorda qachon — ustiga kelganda, nima — tugma, nima bo'ladi — kattalashadi. Shuning uchun tugma faqat sichqoncha kelganda o'sadi.",
    },
    ru: {
      ctx: 'Мышка навелась на кнопку — кнопка выросла. Ушла — кнопка снова обычная.',
      q: 'Какая строка «Как ведёт себя?» это дала?',
      opts: ['кнопка увеличивается при наведении', 'кнопка всегда большая и яркая', 'сайт живой и интересный', 'при нажатии появляется сообщение'],
      why: 'В строке есть когда — при наведении, что — кнопка, что происходит — увеличивается. Поэтому кнопка растёт только под мышкой.',
    },
    en: {
      ctx: 'The mouse moved onto the button — it grew. The mouse left — it’s normal again.',
      q: 'Which “How it behaves?” line gave this?',
      opts: ['the button grows on hover', 'the button is always big and bright', 'the site is lively and fun', 'a message appears on click'],
      why: 'The line has when — on hover, what — the button, and what happens — it grows. So the button grows only under the mouse.',
    },
  },
  {
    id: 'ai_l08_q10', difficulty: 'medium', tags: ['qoidalar', 'majburiy'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Saytda albatta telefonimiz bo'lsin: +998 71 200 30 40.»", '«На сайте обязательно должен быть наш телефон: +998 71 200 30 40».', '“Our phone must be on the site: +998 71 200 30 40.”') },
      prompt: [
        L(0, T("Teatr to'garagi sayti", 'Сайт театрального кружка', 'A drama club site')),
        L(6, null),
      ],
    } },
    uz: {
      ctx: "Mijozning xabarini «Qoidalar?» qatoriga yozamiz.",
      q: 'Qaysi qator aniq?',
      opts: ['majburiy: telefon +998 71 200 30 40', "majburiy: telefon raqami bo'lsin", "hammasi tushunarli, o'zing bil", 'telefon raqami chiroyli tursin'],
      why: "Raqamning o'zi yozilmasa, sun'iy intellekt uni o'ylab topadi — «Taxmin». Mijozning raqami qatorda bo'lishi shart.",
    },
    ru: {
      ctx: 'Пишем сообщение клиента в строку «Какие правила?».',
      q: 'Какая строка точная?',
      opts: ['обязательно: телефон +998 71 200 30 40', 'обязательно: пусть будет номер телефона', 'всё понятно, сам разберёшься', 'номер телефона должен быть красивым'],
      why: 'Если не написать сам номер, ИИ его придумает — «Догадка». Номер клиента должен быть в строке.',
    },
    en: {
      ctx: 'We put the client’s message in the “What rules?” line.',
      q: 'Which line is exact?',
      opts: ['must: phone +998 71 200 30 40', 'must: there should be a phone number', 'it’s all clear, you decide', 'the phone number should look nice'],
      why: 'If the number itself isn’t written, the AI makes one up — “Guess”. The client’s number must be in the line.',
    },
  },
  {
    id: 'ai_l08_q11', difficulty: 'medium', tags: ['ikkinchi-prompt'], sort: false,
    vis: { ai: {
      prompt: [
        L(0, T('Ekologiya klubi sayti', 'Сайт эко-клуба', 'An eco club site')),
        L(1, T("o'quvchilar klubga yozilsin", 'чтобы школьники записывались в клуб', 'get students to join the club')),
        L(2, T("tabiatni sevadigan 11–14 yoshli o'quvchilar", 'школьники 11–14 лет, которые любят природу', 'students aged 11–14 who love nature')),
        L(3, T('jadval, rasmlar, aloqa', 'расписание, фото, контакты', 'schedule, photos, contact')),
        L(4, T('sokin, yashil va oq', 'спокойный, зелёный и белый', 'calm, green and white')),
        L(5, T("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover')),
        L(6, T("majburiy: telefon +998 90 111 22 33, chat bo'lmasin", 'обязательно: телефон +998 90 111 22 33, без чата', 'must: phone +998 90 111 22 33, no chat')),
        { lab: '2-prompt', c: '#334155', bg: '#F1F5F9', t: null },
      ],
    } },
    uz: {
      ctx: 'Sayt mijozga yoqdi. Faqat savol-javob bloki kerak.',
      q: 'Endi nima qilamiz?',
      opts: ["Ikkinchi promptda faqat shu blokni so'raymiz", 'Yettita qatorni boshidan qayta yozamiz', '«Yaxshiroq qil» deb yana yuboramiz', "Sun'iy intellekt o'zi topishini kutamiz"],
      why: "Yoqqan saytni buzmaymiz: ikkinchi prompt — «savol-javob blokini qo'sh, qolganini o'zgartirma». Shunda faqat yangi blok qo'shiladi.",
    },
    ru: {
      ctx: 'Сайт клиенту понравился. Нужен только блок вопросов и ответов.',
      q: 'Что делаем теперь?',
      opts: ['Во втором промпте просим только этот блок', 'Переписываем все семь строк с нуля', 'Снова отправляем «сделай лучше»', 'Ждём, когда ИИ догадается сам'],
      why: 'Удачный сайт не ломаем: второй промпт — «добавь блок вопросов и ответов, остальное не меняй». Тогда добавится только новый блок.',
    },
    en: {
      ctx: 'The client liked the site. Only a Q&A block is needed.',
      q: 'What do we do now?',
      opts: ['Ask for just this block in a second prompt', 'Rewrite all seven lines from scratch', 'Send “make it better” again', 'Wait for the AI to guess it'],
      why: 'Don’t break a good site: the second prompt is “add a Q&A block, don’t change anything else”. Then only the new block is added.',
    },
  },
  {
    id: 'ai_l08_q12', difficulty: 'medium', tags: ['kim-uchun', 'auditoriya'], sort: false,
    vis: { ai: {
      site: {
        title: T('Robototexnika kursi', 'Курс робототехники', 'Robotics course'), em: '🤖', c: '#0D9488', c2: '#115E59', bg: '#CCFBF1',
        nav: [T('Darslar', 'Уроки', 'Lessons'), T('Ota-onalar uchun', 'Родителям', 'For parents'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Bolalar uchun', 'Для детей', 'For kids'), sub: T("Keling, birga robot yig'amiz! 🎈", 'Давай вместе собирать роботов! 🎈', 'Let’s build robots together! 🎈'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        blocks: [{ h: T('Ota-onalar uchun', 'Для родителей', 'For parents'), items: [{ t: T('🛡️ Xavfsiz darslar', '🛡️ Безопасные занятия', '🛡️ Safe lessons') }, { t: T('📊 Har oy hisobot', '📊 Отчёт каждый месяц', '📊 A monthly report') }], mark: MK(2) }],
        noFoot: true,
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Saytda «Bolalar uchun» yozuvi va ota-onalar uchun alohida bo'lim bor.",
      q: "Qaysi «Kim uchun?» qatori shu saytni bergan?",
      opts: ["9–12 yoshli bolalar va ularning ota-onalari", "9–12 yoshli bolalar, robotlarni sevadi", "hamma uchun, katta-kichik farqi yo'q", "maktab o'qituvchilari va direktorlar"],
      why: "Ota-onalar bo'limi promptda ota-onalar ham yozilgandagina chiqadi. «Bolalar uchun» yozuvi esa yoshdan: 9–12 yosh.",
    },
    ru: {
      ctx: 'На сайте надпись «Для детей» и отдельный раздел для родителей.',
      q: 'Какая строка «Для кого?» дала этот сайт?',
      opts: ['дети 9–12 лет и их родители', 'дети 9–12 лет, любят роботов', 'для всех, от мала до велика', 'школьные учителя и директора'],
      why: 'Раздел для родителей появляется, только если в промпте написаны и родители. А надпись «Для детей» — из возраста: 9–12 лет.',
    },
    en: {
      ctx: 'The site says “For kids” and has a separate section for parents.',
      q: 'Which “For whom?” line gave this site?',
      opts: ['kids aged 9–12 and their parents', 'kids aged 9–12 who love robots', 'for everyone, young and old', 'school teachers and head teachers'],
      why: 'A parents’ section appears only if the prompt mentions parents too. “For kids” comes from the age: 9–12.',
    },
  },
  {
    id: 'ai_l08_q13', difficulty: 'medium', tags: ['korinishi', 'rang'], sort: false,
    vis: null,
    uz: {
      ctx: "«Ko'rinishi?» qatori: «zamonaviy, ko'k va oq».",
      q: "Saytning asosiy rangi qaysi bo'ladi?",
      opts: ["Ko'k — u birinchi yozilgan", 'Oq — u oxirida yozilgan', "Ikkalasi teng: yarmi ko'k, yarmi oq", "Sun'iy intellekt o'zi tanlaydi"],
      why: "Birinchi yozilgan rang — asosiy rang: tugmalar va sarlavhalar shu rangda bo'ladi. Oq esa yordamchi rang, fon uchun.",
    },
    ru: {
      ctx: 'Строка «Как выглядит?»: «современный, синий и белый».',
      q: 'Какой цвет будет главным на сайте?',
      opts: ['Синий — он написан первым', 'Белый — он написан последним', 'Оба поровну: половина синяя, половина белая', 'ИИ выберет сам'],
      why: 'Первый написанный цвет — главный: в нём будут кнопки и заголовки. Белый — помощник, для фона.',
    },
    en: {
      ctx: 'The “How it looks?” line: “modern, blue and white”.',
      q: 'Which colour will be the site’s main one?',
      opts: ['Blue — it’s written first', 'White — it’s written last', 'Both equally: half blue, half white', 'The AI will choose itself'],
      why: 'The first colour written is the main one: buttons and headings use it. White is a helper colour, for the background.',
    },
  },
  {
    id: 'ai_l08_q14', difficulty: 'medium', tags: ['ichida-nima', 'tartib'], sort: false,
    vis: { ai: {
      site: {
        title: T('Kitob festivali', 'Книжный фестиваль', 'Book festival'), em: '📚', c: '#7C3AED', c2: '#5B21B6', bg: '#EDE9FE',
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Rasmlar', 'Фото', 'Photos'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T('Shanba kuni', 'В субботу', 'On Saturday'), sub: T("Kitobxonlar bayrami!", 'Праздник для читателей!', 'A party for readers!'),
        cta: T('Kelaman', 'Я приду', 'I’ll come'),
        blocks: [
          { h: T('Jadval', 'Расписание', 'Schedule'), items: [{ t: T('10:00 · Ochilish', '10:00 · Открытие', '10:00 · Opening'), wide: true }], mark: MK(3) },
          { h: T('Rasmlar', 'Фото', 'Photos'), items: [{ t: '🖼️' }, { t: '🖼️' }, { t: '🖼️' }] },
          { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 90 808 70 60', wide: true }] },
        ],
        noFoot: true,
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Mijoz: «Aloqa bloki eng tepada tursin, qolgani o'z tartibida.»",
      q: "«Ichida nima?» qatorini qanday yozamiz?",
      opts: ['aloqa, jadval, rasmlar', 'jadval, rasmlar, aloqa', 'jadval, aloqa, rasmlar', "aloqa tepada, chiroyli bo'lsin"],
      why: "Sun'iy intellekt bloklarni promptda qanday tartibda yozilgan bo'lsa, saytga xuddi shunday qo'yadi. Aloqa birinchi bo'lsin desak — birinchi yozamiz.",
    },
    ru: {
      ctx: 'Клиент: «Пусть контакты будут на самом верху, остальное по порядку».',
      q: 'Как написать строку «Что внутри?»?',
      opts: ['контакты, расписание, фото', 'расписание, фото, контакты', 'расписание, контакты, фото', 'контакты сверху, чтобы красиво'],
      why: 'ИИ ставит блоки на сайт в том порядке, в каком они написаны в промпте. Нужны контакты первыми — пишем их первыми.',
    },
    en: {
      ctx: 'The client: “Put the contact block at the very top, the rest in order.”',
      q: 'How do we write the “What’s inside?” line?',
      opts: ['contact, schedule, photos', 'schedule, photos, contact', 'schedule, contact, photos', 'contact on top, make it pretty'],
      why: 'The AI puts blocks on the site in the order they’re written in the prompt. To get contact first, write it first.',
    },
  },
  {
    id: 'ai_l08_q15', difficulty: 'medium', tags: ['korinishi', 'auditoriya'], sort: false,
    vis: null,
    uz: {
      ctx: "«Kim uchun?» — «6–8 yoshli bolalar». «Ko'rinishi?» qatori yozilmagan.",
      q: "Sayt qanday ko'rinishda chiqishi mumkin?",
      opts: ['Bolalarga mos: quvnoq va yorqin', 'Kattalarga mos: jiddiy, qora-kulrang', 'Umuman rangsiz, faqat oq va qora', 'Hech qanday: sayt umuman chiqmaydi'],
      why: "«Ko'rinishi?» bo'lmasa, sun'iy intellekt ko'rinishni auditoriyaga qarab tanlaydi. Lekin bu — uning taxmini, aniq ranglarni o'zingiz yozganingiz yaxshi.",
    },
    ru: {
      ctx: '«Для кого?» — «дети 6–8 лет». Строка «Как выглядит?» не написана.',
      q: 'Каким может получиться сайт?',
      opts: ['Детским: весёлым и ярким', 'Взрослым: строгим, чёрно-серым', 'Совсем бесцветным, только чёрно-белым', 'Никаким: сайт вообще не появится'],
      why: 'Без «Как выглядит?» ИИ подбирает вид под аудиторию. Но это его догадка: точные цвета лучше написать самому.',
    },
    en: {
      ctx: '“For whom?” is “kids aged 6–8”. The “How it looks?” line isn’t written.',
      q: 'What might the site look like?',
      opts: ['Kid-friendly: cheerful and bright', 'Grown-up: serious, black and grey', 'No colour at all, just black and white', 'Nothing: the site won’t appear at all'],
      why: 'Without “How it looks?”, the AI picks a look for the audience. But that’s its guess: it’s better to write the exact colours yourself.',
    },
  },
  {
    id: 'ai_l08_q16', difficulty: 'medium', tags: ['qanday-ishlaydi', 'taxmin'], sort: false,
    vis: { ai: {
      prompt: [
        L(0, T('Sirk sayti', 'Сайт цирка', 'A circus site')),
        L(5, T("sayt jonli bo'lsin", 'сайт пусть будет живым', 'make the site lively'), true),
      ],
    } },
    uz: {
      ctx: "Promptdagi «Qanday ishlaydi?» qatoriga qarang.",
      q: "Bu qatordan keyin saytda nima bo'ladi?",
      opts: ["Hamma narsa o'zicha qimirlaydi — bu taxmin", 'Faqat tugma ustiga kelganda kattalashadi', 'Sayt telefonda ham qulay ochiladi', 'Hech narsa: bu qator hisobga olinmaydi'],
      why: "«Jonli»da qachon va nima bo'lishi aytilmagan. Sun'iy intellekt hamma narsani o'zicha qimirlatadi. Kerak: qachon + nima + nima bo'ladi.",
    },
    ru: {
      ctx: 'Посмотри на строку «Как ведёт себя?» в промпте.',
      q: 'Что будет на сайте после этой строки?',
      opts: ['Всё само дёргается и прыгает — это догадка', 'Только кнопка растёт при наведении', 'Сайт удобно откроется и на телефоне', 'Ничего: эту строку ИИ не учтёт'],
      why: 'В слове «живой» не сказано, когда и что происходит. ИИ заставляет прыгать всё подряд. Нужно: когда + что + что происходит.',
    },
    en: {
      ctx: 'Look at the “How it behaves?” line in the prompt.',
      q: 'What happens on the site after this line?',
      opts: ['Everything wiggles by itself — a guess', 'Only the button grows on hover', 'The site opens nicely on a phone too', 'Nothing: the AI ignores this line'],
      why: '“Lively” doesn’t say when or what happens. The AI makes everything jump. You need: when + what + what happens.',
    },
  },

  // ── hard ──
  {
    id: 'ai_l08_q17', difficulty: 'hard', tags: ['qanday-ishlaydi', 'formula'], sort: false,
    vis: null,
    uz: {
      ctx: "Kurs sayti uchun to'rtta qator yozildi. Hammasi tugma haqida.",
      q: "Qaysi biri «Qanday ishlaydi?» qatoriga tegishli?",
      opts: ["tugma bosilganda «Rahmat» xabari chiqsin", "tugmalar katta va qizil rangda bo'lsin", "saytda faqat bitta tugma bo'lsin", 'odamlar tugmani bosib, kursga yozilsin'],
      why: "«Qanday ishlaydi?» — qachon nima bo'ladi: bosilganda xabar chiqadi. Rang va o'lcham — «Ko'rinishi?», bitta tugma — «Qoidalar?», yozilsin — «Nega?».",
    },
    ru: {
      ctx: 'Для сайта курса написали четыре строки. Все про кнопку.',
      q: 'Какая из них относится к «Как ведёт себя?»?',
      opts: ['при нажатии кнопки появляется «Спасибо»', 'кнопки большие и красные', 'на сайте только одна кнопка', 'чтобы люди нажимали и записывались'],
      why: '«Как ведёт себя?» — когда что происходит: при нажатии — сообщение. Цвет и размер — «Как выглядит?», одна кнопка — «Какие правила?», записывались — «Зачем?».',
    },
    en: {
      ctx: 'Four lines were written for a course site. All about the button.',
      q: 'Which one belongs to “How it behaves?”?',
      opts: ['on click, a “Thank you” message appears', 'the buttons are big and red', 'the site has only one button', 'get people to click and sign up'],
      why: '“How it behaves?” is when what happens: on click — a message. Colour and size are “How it looks?”, one button is “What rules?”, sign up is “Why?”.',
    },
  },
  {
    id: 'ai_l08_q18', difficulty: 'hard', tags: ['korinishi', 'ikkinchi-prompt'], sort: false,
    vis: { ai: {
      prompt: [
        L(0, T('Futbol akademiyasi sayti', 'Сайт футбольной академии', 'A football academy site')),
        L(2, T('15–17 yoshli futbolchilar', 'футболисты 15–17 лет', 'football players aged 15–17')),
        L(4, T("chiroyli bo'lsin", 'пусть будет красиво', 'make it pretty'), true),
      ],
      site: {
        title: T('Futbol akademiyasi', 'Футбольная академия', 'Football academy'), em: '⚽', c: '#DB2777', c2: '#9D174D', bg: '#FCE7F3',
        nav: [T('Jamoa', 'Команда', 'Team'), T('Jadval', 'Расписание', 'Schedule'), T('Aloqa', 'Контакты', 'Contact')],
        badge: T("O'smirlar uchun", 'Для подростков', 'For teens'), sub: T("Do'stlaringni chaqir, birga zo'rroq! 🔥", 'Зови друзей — вместе круче! 🔥', 'Bring your friends, it’s better together! 🔥'),
        cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
        marks: { hero: GM },
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Mijoz: «Bizning ranglarimiz — ko'k va oq. Qolgani yoqdi.»",
      q: "Qaysi ikkinchi prompt saytni to'g'rilaydi?",
      opts: ["ranglarni ko'k va oq qil, qolganini o'zgartirma", "ranglarni o'zgartir, qolganini o'zgartirma", "chiroyliroq qil, qolganini o'zgartirma", "ranglarni ko'k va oq qil, saytni qayta yoz"],
      why: "«Chiroyli» — taxmin, shuning uchun sayt pushti chiqdi. Ikkinchi promptda nima — ranglar, qanday — ko'k va oq, qolgani esa saqlanadi.",
    },
    ru: {
      ctx: 'Клиент: «Наши цвета — синий и белый. Остальное понравилось».',
      q: 'Какой второй промпт исправит сайт?',
      opts: ['сделай цвета синим и белым, остальное не меняй', 'измени цвета, остальное не меняй', 'сделай красивее, остальное не меняй', 'сделай цвета синим и белым, напиши сайт заново'],
      why: '«Красиво» — догадка, поэтому сайт вышел розовым. Во втором промпте что — цвета, как — синий и белый, а остальное сохраняется.',
    },
    en: {
      ctx: 'The client: “Our colours are blue and white. We like the rest.”',
      q: 'Which second prompt fixes the site?',
      opts: ['make the colours blue and white, keep the rest', 'change the colours, keep the rest', 'make it prettier, keep the rest', 'make the colours blue and white, redo the site'],
      why: '“Pretty” is a guess, so the site came out pink. The second prompt says what — the colours, how — blue and white, and keeps the rest.',
    },
  },
  {
    id: 'ai_l08_q19', difficulty: 'hard', tags: ['korinishi', 'auditoriya'], sort: false,
    vis: null,
    uz: {
      ctx: "«Kim uchun?» — «6–8 yoshli bolalar», «Ko'rinishi?» — «jiddiy, qora va kulrang».",
      q: 'Sayt qanday ranglarda chiqadi?',
      opts: ["Qora va kulrang — promptda shunday yozilgan", 'Yorqin va quvnoq — bolalarga moslab', 'Yarmi qora, yarmi bolalarbop rangli', "Sun'iy intellekt o'zi taxmin qiladi"],
      why: "Yozilgan «Ko'rinishi?» auditoriyadan kuchliroq: sun'iy intellekt aynan shu ranglarni oladi. Bolalarga mos bo'lsin desangiz, ranglarni shunday yozing.",
    },
    ru: {
      ctx: '«Для кого?» — «дети 6–8 лет», «Как выглядит?» — «строгий, чёрный и серый».',
      q: 'В каких цветах выйдет сайт?',
      opts: ['Чёрный и серый — так написано в промпте', 'Яркий и весёлый — под детей', 'Наполовину чёрный, наполовину детский', 'ИИ угадает сам'],
      why: 'Написанный «Как выглядит?» сильнее аудитории: ИИ возьмёт именно эти цвета. Хочешь, чтобы подходило детям, — так и напиши цвета.',
    },
    en: {
      ctx: '“For whom?” is “kids aged 6–8”, “How it looks?” is “serious, black and grey”.',
      q: 'What colours will the site have?',
      opts: ['Black and grey — that’s what the prompt says', 'Bright and cheerful — to suit kids', 'Half black, half kid-style colours', 'The AI will guess by itself'],
      why: 'A written “How it looks?” is stronger than the audience: the AI takes exactly these colours. Want it to suit kids? Write such colours.',
    },
  },
  {
    id: 'ai_l08_q20', difficulty: 'hard', tags: ['qoidalar', 'ichida-nima'], sort: false,
    vis: { ai: {
      prompt: [
        L(0, T('Milliy taomlar kafesi sayti', 'Сайт кафе национальной кухни', 'A national food café site')),
        L(3, T('menyu, narxlar, sharhlar, aloqa', 'меню, цены, отзывы, контакты', 'menu, prices, reviews, contact')),
        L(6, T("ko'pi bilan 2 ta blok", 'не больше 2 блоков', 'no more than 2 blocks'), true),
      ],
      site: {
        title: T('Milliy taomlar kafesi', 'Кафе национальной кухни', 'National food café'), em: '🍲', c: '#EA580C', c2: '#9A3412', bg: '#FFEDD5',
        nav: [T('Menyu', 'Меню', 'Menu'), T('Narxlar', 'Цены', 'Prices'), T('Biz haqimizda', 'О нас', 'About')],
        badge: T('Uydagidek mazali', 'Вкусно, как дома', 'Tasty, like at home'), sub: T('Palov, lagmon va somsa', 'Плов, лагман и самса', 'Plov, lagman and samsa'),
        cta: T('Buyurtma berish', 'Заказать', 'Order'),
        blocks: [
          { h: T('Menyu', 'Меню', 'Menu'), items: [{ ic: '🍛', t: T('Palov', 'Плов', 'Plov') }, { ic: '🍜', t: T('Lagmon', 'Лагман', 'Lagman') }] },
          { h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Palov', 'Плов', 'Plov'), p: T("35 000 so'm", '35 000 сум', '35,000 sum'), guess: G }, { t: T('Lagmon', 'Лагман', 'Lagman'), p: T("30 000 so'm", '30 000 сум', '30,000 sum'), guess: G }] },
        ],
        noFoot: true,
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Sun'iy intellekt shu saytni yaratdi.",
      q: 'Nega sharhlar va aloqa bloklari chiqmadi?',
      opts: ["Qoidada «ko'pi bilan 2 ta blok» deyilgan", "Sun'iy intellekt ularni unutib qo'ydi", 'Sharhlar va aloqa faqat telefonda chiqadi', "«Ichida nima?» qatori noto'g'ri yozilgan"],
      why: "Qoida boshqa qatorlardan ustun: «ko'pi bilan 2 ta blok» bo'lsa, ro'yxatdagi birinchi ikkitasi qoladi — menyu va narxlar.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт.',
      q: 'Почему не появились блоки отзывов и контактов?',
      opts: ['В правилах сказано «не больше 2 блоков»', 'ИИ про них забыл', 'Отзывы и контакты видны только на телефоне', 'Строка «Что внутри?» написана неверно'],
      why: 'Правило сильнее других строк: при «не больше 2 блоков» остаются первые два из списка — меню и цены.',
    },
    en: {
      ctx: 'The AI made this site.',
      q: 'Why didn’t the reviews and contact blocks appear?',
      opts: ['The rules say “no more than 2 blocks”', 'The AI forgot about them', 'Reviews and contact show only on phones', 'The “What’s inside?” line is written wrong'],
      why: 'A rule is stronger than the other lines: with “no more than 2 blocks”, the first two on the list stay — menu and prices.',
    },
  },
  {
    id: 'ai_l08_q21', difficulty: 'hard', tags: ['formula', 'mijoz'], sort: false,
    vis: { ai: {
      msg: { who: CLIENT, text: T("«Salom! Bu Yulduz gimnastika maktabi sayti. Bolalar darsga yozilsin. Sayt 7–12 yoshli bolalar uchun. Ichida jadval va narxlar bo'lsin. Ranglar — ko'k va oq. Reklama bo'lmasin.»", '«Здравствуйте! Это сайт школы гимнастики Юлдуз. Пусть дети записываются на занятия. Сайт для детей 7–12 лет. Внутри — расписание и цены. Цвета — синий и белый. Без рекламы».', '“Hi! This is the Yulduz gymnastics school site. We want kids to sign up for classes. The site is for kids aged 7–12. Inside: a schedule and prices. Colours: blue and white. No ads.”') },
    } },
    uz: {
      ctx: "Mijozning xabarini formulaning yettita savoli bilan solishtiring.",
      q: 'Xabarda qaysi savolga javob yo\'q?',
      opts: fq(5, 2, 4, 6).uz,
      why: "Xabarda nima, nega, kim uchun, ichida nima, ko'rinishi va qoidalar bor. Sayt qanday ishlashi yo'q — buni mijozdan so'raymiz yoki o'zimiz aniq yozamiz.",
    },
    ru: {
      ctx: 'Сверь сообщение клиента с семью вопросами формулы.',
      q: 'На какой вопрос в сообщении нет ответа?',
      opts: fq(5, 2, 4, 6).ru,
      why: 'В сообщении есть что, зачем, для кого, что внутри, как выглядит и правила. Как ведёт себя сайт — нет: спросим клиента или напишем точно сами.',
    },
    en: {
      ctx: 'Compare the client’s message with the formula’s seven questions.',
      q: 'Which question does the message not answer?',
      opts: fq(5, 2, 4, 6).en,
      why: 'The message has the what, why, for whom, what’s inside, how it looks and the rules. How the site behaves is missing: ask the client or write it exactly yourself.',
    },
  },
];
