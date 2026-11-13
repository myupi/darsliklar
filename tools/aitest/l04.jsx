// =============================================================================
// ТЕСТЫ К УРОКУ 4 МОДУЛЯ «ИИ» «Как должен выглядеть сайт?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «chiroyli» — догадка ИИ («Taxmin»); стиль под сайт и его аудиторию; первый цвет — главный;
// стиль по просьбе клиента; форма карточек и тени по сайту.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'kak-vyglyadit';
const QS = [
  { id: 'ai-04t1', target: 'ai-04', tag: 'chiroyli', correct: 0,
    // Как в крючке урока 4: «chiroyli bo'lsin» для киберспорта — нежно-розовый сайт, догадка ИИ.
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Kibersport turniri', 'Киберспортивный турнир', 'Esports tournament'), em: '🎮', c: '#EC4899', c2: '#9D174D', bg: '#FCE7F3', radius: 24,
      font: 'Georgia, "Times New Roman", serif', heroBg: 'linear-gradient(135deg, #FBCFE8, #F472B6)',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Jamoalar', 'Команды', 'Teams'), T('Sovrinlar', 'Призы', 'Prizes')],
      badge: T('Bahor turniri · 2026', 'Весенний турнир · 2026', 'Spring tournament · 2026'), sub: T('Eng kuchli jamoalar!', 'Сильнейшие команды!', 'The strongest teams!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      cards: [{ ic: '🌸', h: T('Jadval', 'Расписание', 'Schedule'), p: T("O'yinlar kuni", 'Дни игр', 'Game days') }, { ic: '🌷', h: T('Jamoalar', 'Команды', 'Teams'), p: T('Ishtirokchilar', 'Участники', 'Players') }, { ic: '💐', h: T('Sovrinlar', 'Призы', 'Prizes'), p: T("G'oliblarga", 'Победителям', 'For the winners') }],
      marks: { hero: { t: T('Taxmin', 'Догадка', 'Guess'), c: '#475569' } },
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Promptda «Ko'rinishi?» — «chiroyli bo'lsin».", q: "Nega o'yinchilar uchun sayt pushti bo'lib qoldi?", opts: ["Sun'iy intellekt «chiroyli» ni o'zicha tushundi", "Pushti — o'yinchilarning sevimli rangi", 'Promptda pushti rang yozilgan', 'Sayt buzilib qolgan'],
      ok: "«Chiroyli» har kimda har xil. Sun'iy intellekt o'zi taxmin qildi, shuning uchun «Taxmin» belgisi turibdi.", hint: "Promptda rang yozilganmi? Saytdagi «Taxmin» belgisi nima deydi?", alt: "Pushti kibersport sayti, «Taxmin» belgisi bilan" },
    ru: { ctx: 'В промпте «Как выглядит?» — «чтобы было красиво».', q: 'Почему сайт для игроков стал розовым?', opts: ['ИИ понял «красиво» по-своему', 'Розовый — любимый цвет игроков', 'В промпте написан розовый цвет', 'Сайт сломался'],
      ok: '«Красиво» у каждого своё. ИИ угадал сам — поэтому стоит метка «Догадка».', hint: 'Написан ли в промпте цвет? О чём говорит метка «Догадка» на сайте?', alt: 'Розовый сайт киберспорта с меткой «Догадка»' },
    en: { ctx: 'The “How it looks?” line says “make it pretty”.', q: 'Why did the gamers’ site turn pink?', opts: ['The AI understood “pretty” its own way', 'Pink is gamers’ favourite colour', 'The prompt says pink', 'The site is broken'],
      ok: '“Pretty” means something different to everyone. The AI guessed, which is why there is a “Guess” tag.', hint: 'Does the prompt name a colour? What does the “Guess” tag on the site tell you?', alt: 'A pink esports site with a “Guess” tag' } },

  { id: 'ai-04t2', target: 'ai-04', tag: 'uslub', correct: 2,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T('Kibersport turniri sayti', 'Сайт киберспортивного турнира', 'An esports tournament site') }, { q: 2, t: T("14–17 yoshli o'yinchilar", 'игроки 14–17 лет', 'gamers aged 14–17') }, { q: 4, t: null }]} />; },
    uz: { ctx: "Sayt o'yinchilar uchun. Ko'rinishini yozamiz.", q: "Qaysi «Ko'rinishi?» o'yinchilarga mos?", opts: ['yumshoq pushti, gullar bilan', "issiq jigarrang, qo'lyozma shrift", "qorong'i neon, yashil rang, kod shrifti", "chiroyli va zo'r bo'lsin"],
      ok: "O'yinchilarga qorong'i neon mos keladi. Uslub, rang va shrift aniq yozilgan.", hint: "Sayt kimlar uchun? Ularga qanday uslub yoqadi: o'yin ekrani yoki gullar?", alt: "«Ko'rinishi?» qatori bo'sh prompt" },
    ru: { ctx: 'Сайт для игроков. Пишем, как он выглядит.', q: 'Какая строка «Как выглядит?» подходит игрокам?', opts: ['нежно-розовый, с цветами', 'тёплый коричневый, рукописный шрифт', 'тёмный неон, зелёный цвет, шрифт кода', 'красиво и круто'],
      ok: 'Игрокам подходит тёмный неон. Стиль, цвет и шрифт названы точно.', hint: 'Для кого сайт? Какой стиль им нравится: как в игре или с цветочками?', alt: 'Промпт с пустой строкой «Как выглядит?»' },
    en: { ctx: 'The site is for gamers. We describe how it looks.', q: 'Which “How it looks?” line suits gamers?', opts: ['soft pink, with flowers', 'warm brown, handwritten font', 'dark neon, green, code font', 'pretty and cool'],
      ok: 'Dark neon suits gamers. The style, colour and font are named exactly.', hint: 'Who is the site for? What style do they like: like a game screen, or with flowers?', alt: 'A prompt with an empty “How it looks?” line' } },

  { id: 'ai-04t3', target: 'ai-04', tag: 'asosiy-rang', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Futbol klubi', 'Футбольный клуб', 'Football club'), em: '⚽', c: '#DC2626', c2: '#991B1B', bg: '#FEE2E2', btn: '#FACC15', btnFg: '#1F2937',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T("O'yinchilar", 'Игроки', 'Players'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi mavsum', 'Новый сезон', 'New season'), sub: T("Biz bilan o'ynang!", 'Играй с нами!', 'Play with us!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      goal: { h: T("Ro'yxatdan o'tish", 'Запись', 'Sign up'), fields: [T('Ismingiz', 'Твоё имя', 'Your name')], btn: T('Yuborish', 'Отправить', 'Send') },
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: "Qaysi «Ko'rinishi?» shu saytni bergan?", opts: ['sariq va qizil', 'qizil va sariq', 'faqat oq rang', 'chiroyli ranglar'],
      ok: "Birinchi yozilgan rang asosiy bo'ladi: sayt qizil, tugmalar esa sariq.", hint: "Saytda qaysi rang ko'p: banner qanday, tugmalar qanday? Birinchi yozilgan rang — asosiy.", alt: "Qizil sayt, sariq tugmalar" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Какая строка «Как выглядит?» дала этот сайт?', opts: ['жёлтый и красный', 'красный и жёлтый', 'только белый', 'красивые цвета'],
      ok: 'Первый названный цвет — главный: сайт красный, а кнопки жёлтые.', hint: 'Какого цвета на сайте больше: какой баннер, какие кнопки? Первый цвет — главный.', alt: 'Красный сайт с жёлтыми кнопками' },
    en: { ctx: 'The AI made this site.', q: 'Which “How it looks?” line gave this site?', opts: ['yellow and red', 'red and yellow', 'only white', 'nice colours'],
      ok: 'The first colour written is the main one: the site is red and the buttons are yellow.', hint: 'Which colour is there most of: the banner, the buttons? The first colour is the main one.', alt: 'A red site with yellow buttons' } },

  { id: 'ai-04t4', target: 'ai-04', tag: 'mijoz-uslubi', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mijoz', 'Клиент', 'Client')} text={T("«Do'konimiz — «Buvijonning shirinliklari». Mijozlarimiz bobo va buvilar. Sayt issiq va uydagidek bo'lsin.»", '«Наш магазин — «Бабушкины сладости». Наши покупатели — бабушки и дедушки. Пусть сайт будет тёплым и домашним».', '“Our shop is called Granny’s Sweets. Our customers are grandparents. Make the site warm and homely.”')} />; },
    uz: { ctx: "Mijozning xabarini o'qing.", q: "Qaysi «Ko'rinishi?» mos keladi?", opts: ["qorong'i neon, kod shrifti", 'kulrang, mayda shrift, soyasiz', "yorqin pushti, hammasi miltillasin", "issiq uslub, jigarrang va oltin, qo'lyozma shrift"],
      ok: "Mijoz issiq, uydagidek sayt so'radi: jigarrang va oltin ranglar, qo'lyozma shrift aynan shunday.", hint: "Mijoz qanday kayfiyat so'radi? Shunga mos uslub, rang va shriftni tanlang.", alt: 'Mijozning xabari' },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Какая строка «Как выглядит?» подходит?', opts: ['тёмный неон, шрифт кода', 'серый, мелкий шрифт, без теней', 'ярко-розовый, всё мигает', 'тёплый стиль, коричневый и золотой, рукописный шрифт'],
      ok: 'Клиент просил тёплый, домашний сайт — это коричневый и золотой цвета и рукописный шрифт.', hint: 'Какое настроение просил клиент? Выбери подходящие стиль, цвет и шрифт.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'Which “How it looks?” line fits?', opts: ['dark neon, code font', 'grey, tiny font, no shadows', 'bright pink, everything flashing', 'warm style, brown and gold, handwritten font'],
      ok: 'The client asked for a warm, homely site: brown and gold with a handwritten font is exactly that.', hint: 'What mood did the client ask for? Choose a style, colour and font to match.', alt: 'The client’s message' } },

  { id: 'ai-04t5', target: 'ai-04', tag: 'shakl', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Robot kursi', 'Курс роботов', 'Robot course'), em: '🤖', c: '#7C3AED', c2: '#4C1D95', bg: '#EDE9FE', radius: 30, shadow: 'big', focus: '.cards',
      nav: [T('Darslar', 'Занятия', 'Lessons'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Robot yasashni o'rganing!", 'Научись собирать роботов!', 'Learn to build robots!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      cards: [{ ic: '🔧', h: T("Yig'amiz", 'Собираем', 'We build'), p: T("O'z robotingiz", 'Свой робот', 'Your own robot') }, { ic: '💻', h: T('Dasturlaymiz', 'Программируем', 'We code'), p: T('Oddiy kod', 'Простой код', 'Simple code') }, { ic: '🏆', h: T('Musobaqa', 'Соревнования', 'Contests'), p: T('Sovrinlar', 'Призы', 'Prizes') }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi. Kartochkalarga qarang.", q: "Kartochkalar uchun «Ko'rinishi?» ga nima yozilgan?", opts: ["to'g'ri burchaklar, soyasiz", "yumaloq burchaklar, katta soyalar", 'kod shrifti', 'hech narsa yozilmagan'],
      ok: "Kartochkalarning burchaklari yumaloq, ostida katta soya bor. Promptda aynan shu yozilgan.", hint: "Kartochkalarning burchaklariga va ostidagi soyaga qarang.", alt: "Yumaloq burchakli, katta soyali kartochkalar" },
    ru: { ctx: 'ИИ сделал такой сайт. Посмотри на карточки.', q: 'Что написано про карточки в строке «Как выглядит?»?', opts: ['прямые углы, без теней', 'скруглённые углы, большие тени', 'шрифт кода', 'ничего не написано'],
      ok: 'У карточек скруглённые углы и большая тень снизу. Именно это написано в промпте.', hint: 'Посмотри на углы карточек и на тень под ними.', alt: 'Карточки со скруглёнными углами и большими тенями' },
    en: { ctx: 'The AI made this site. Look at the cards.', q: 'What does the “How it looks?” line say about the cards?', opts: ['square corners, no shadows', 'rounded corners, big shadows', 'code font', 'nothing at all'],
      ok: 'The cards have rounded corners and a big shadow underneath. That is exactly what the prompt says.', hint: 'Look at the corners of the cards and the shadow under them.', alt: 'Cards with rounded corners and big shadows' } }
];
