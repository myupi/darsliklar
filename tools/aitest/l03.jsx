// =============================================================================
// ТЕСТЫ К УРОКУ 3 МОДУЛЯ «ИИ» «Что должно быть на сайте?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «Ichida nima?» — блоки по названию, а не «hamma narsa»; порядок блоков на сайте — как в промпте;
// какой блок отвечает на вопрос гостя; ненаписанные цена и телефон — догадка ИИ («Taxmin»); какого блока не хватает.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'chto-na-sajte';
const QS = [
  { id: 'ai-03t1', target: 'ai-03', tag: 'bloklar', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T('Pitsa kafesi sayti', 'Сайт пиццерии', 'A pizza cafe site') }, { q: 1, t: T('odamlar buyurtma qilsin', 'чтобы люди заказывали', 'get people to order') }, { q: 2, t: T('oilalar', 'семьи', 'families') }, { q: 3, t: null }]} />; },
    uz: { ctx: "Mehmon so'raydi: qanday pitsalar bor, ular qanaqa, boshqalar nima deydi, kafe qayerda?", q: "«Ichida nima?» qatoriga qaysi biri aniqroq?", opts: ["hamma narsa bo'lsin", 'menyu, pitsalar rasmi, sharhlar, manzil', "eng zo'r va chiroyli bo'limlar bo'lsin", "mehmonlarga kerak bo'ladigan hamma narsa"],
      ok: "Bloklar nomi bilan aytilgan va mehmonning har bir savoliga javob beradi. Sun'iy intellekt aynan shularni qo'yadi.", hint: "Mehmonning to'rtta savoli bor. Har biriga javob beradigan blokni nomi bilan yozing.", alt: "«Ichida nima?» qatori bo'sh prompt" },
    ru: { ctx: 'Гость спрашивает: какие есть пиццы, как они выглядят, что говорят другие, где кафе?', q: 'Что точнее подходит в строку «Что внутри?»?', opts: ['пусть будет всё', 'меню, фото пицц, отзывы, адрес', 'самые крутые и красивые разделы', 'всё, что может понадобиться гостю'],
      ok: 'Блоки названы по имени и отвечают на каждый вопрос гостя. ИИ поставит именно их.', hint: 'У гостя четыре вопроса. Напиши по имени блок, который отвечает на каждый.', alt: 'Промпт с пустой строкой «Что внутри?»' },
    en: { ctx: 'A guest asks: what pizzas are there, what do they look like, what do others say, where is the cafe?', q: 'Which fits the “What’s inside?” line best?', opts: ['everything', 'menu, pizza photos, reviews, address', 'the coolest, prettiest sections', 'everything a guest might need'],
      ok: 'The blocks are named, and each answers one of the guest’s questions. The AI will put exactly these.', hint: 'The guest has four questions. Name a block that answers each one.', alt: 'A prompt with an empty “What’s inside?” line' } },

  { id: 'ai-03t2', target: 'ai-03', tag: 'tartib', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Suzish kursi', 'Курс плавания', 'Swimming course'), em: '🏊', focus: '.blk', noFoot: true, c: '#0284C7', c2: '#075985', bg: '#E0F2FE',
      nav: [T('Rasmlar', 'Фото', 'Photos'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yozgi kurs · 2026', 'Летний курс · 2026', 'Summer course · 2026'), sub: T("Suzishni birga o'rganamiz!", 'Учимся плавать вместе!', 'Let’s learn to swim together!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      blocks: [{ h: T('Rasmlar', 'Фото', 'Photos'), items: [{ t: T('🏊 Hovuz', '🏊 Бассейн', '🏊 The pool') }, { t: T('👧 Darslar', '👧 Занятия', '👧 Lessons') }, { t: T('🏅 Musobaqa', '🏅 Соревнования', '🏅 Contests') }] },
        { h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Bir oy', 'Месяц', 'One month'), p: T("300 000 so'm", '300 000 сум', '300,000 sum') }, { t: T('Bir dars', 'Одно занятие', 'One lesson'), p: T("40 000 so'm", '40 000 сум', '40,000 sum') }] },
        { h: T('Sharhlar', 'Отзывы', 'Reviews'), items: [{ t: T("«Qizim suzishni o'rgandi!»", '«Дочка научилась плавать!»', '“My daughter learned to swim!”'), wide: true }] },
        { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 90 555 12 34' }, { t: T('📍 Chilonzor, 5', '📍 Чиланзар, 5', '📍 Chilanzar, 5') }] }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: "Qaysi «Ichida nima?» shu saytni bergan?", opts: ['aloqa, sharhlar, narxlar, rasmlar', 'narxlar va aloqa', "hamma narsa bo'lsin", 'rasmlar, narxlar, sharhlar, aloqa'],
      ok: "Bloklar saytda promptdagi tartibda turadi: rasmlar, narxlar, sharhlar, aloqa.", hint: "Saytdagi bloklarni yuqoridan pastga sanang va xuddi shu tartibni qidiring.", alt: "To'rt blokli sayt: rasmlar, narxlar, sharhlar, aloqa" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Какая строка «Что внутри?» дала этот сайт?', opts: ['контакты, отзывы, цены, фото', 'цены и контакты', 'пусть будет всё', 'фото, цены, отзывы, контакты'],
      ok: 'Блоки стоят на сайте в том же порядке, что в промпте: фото, цены, отзывы, контакты.', hint: 'Посчитай блоки сайта сверху вниз и найди такой же порядок.', alt: 'Сайт из четырёх блоков: фото, цены, отзывы, контакты' },
    en: { ctx: 'The AI made this site.', q: 'Which “What’s inside?” line gave this site?', opts: ['contact, reviews, prices, photos', 'prices and contact', 'everything', 'photos, prices, reviews, contact'],
      ok: 'The blocks are on the site in the same order as in the prompt: photos, prices, reviews, contact.', hint: 'List the site’s blocks from top to bottom and find the same order.', alt: 'A site with four blocks: photos, prices, reviews, contact' } },

  { id: 'ai-03t3', target: 'ai-03', tag: 'mehmon-savoli', correct: 0,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mehmon', 'Гость', 'Guest')} text={T('«Bu kurs qancha turadi?»', '«Сколько стоит этот курс?»', '“How much does this course cost?”')} />; },
    uz: { ctx: "Robot kursi saytiga mehmon kirdi.", q: 'Qaysi blok bu savolga javob beradi?', opts: ['Narxlar', 'Sharhlar', 'Rasmlar', 'Aloqa'],
      ok: "Narx haqidagi savolga narxlar bloki javob beradi. Uni «Ichida nima?» qatoriga yozamiz.", hint: "Mehmon pul haqida so'rayapti. Qaysi blokda raqamlar bo'ladi?", alt: 'Mehmonning savoli' },
    ru: { ctx: 'На сайт курса роботов зашёл гость.', q: 'Какой блок отвечает на этот вопрос?', opts: ['Цены', 'Отзывы', 'Фото', 'Контакты'],
      ok: 'На вопрос о цене отвечает блок цен. Его пишем в строку «Что внутри?».', hint: 'Гость спрашивает про деньги. В каком блоке будут суммы?', alt: 'Вопрос гостя' },
    en: { ctx: 'A guest visits the robot course site.', q: 'Which block answers this question?', opts: ['Prices', 'Reviews', 'Photos', 'Contact'],
      ok: 'A question about cost is answered by the prices block. We write it in the “What’s inside?” line.', hint: 'The guest is asking about money. Which block has the amounts?', alt: 'The guest’s question' } },

  { id: 'ai-03t4', target: 'ai-03', tag: 'raqamlar', correct: 2,
    vis: (L) => { const T = aqL(L); const G = T('Taxmin', 'Догадка', 'Guess'); return <AqSite site={{
      title: T('Robot kursi', 'Курс роботов', 'Robot course'), em: '🤖', focus: '.blk', noFoot: true, c: '#0D9488', c2: '#0F766E', bg: '#CCFBF1',
      nav: [T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact'), T('Biz haqimizda', 'О нас', 'About')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Robot yasashni o'rganing!", 'Научись собирать роботов!', 'Learn to build robots!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      blocks: [{ h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Bir oy', 'Месяц', 'One month'), p: T("99 000 so'm", '99 000 сум', '99,000 sum'), guess: G }, { t: T('Uch oy', 'Три месяца', 'Three months'), p: T("250 000 so'm", '250 000 сум', '250,000 sum'), guess: G }] },
        { h: T('Aloqa', 'Контакты', 'Contact'), items: [{ t: '📞 +998 00 000 00 00', guess: G, wide: true }] }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Promptda «Ichida nima?» — «narxlar, aloqa». Raqamlar yozilmagan.", q: "Nega narx va telefon yonida «Taxmin» turibdi?", opts: ["Narxlar juda qimmat, shuning uchun belgi qo'yilgan", "Sayt hali to'liq yuklanmagan, raqamlar keyin chiqadi", "Sun'iy intellekt narx va telefonni o'zi o'ylab topdi", "Mijoz narx va telefonni taxminiy qilib so'ragan"],
      ok: "Raqamlar yozilmasa, sun'iy intellekt ularni o'ylab topadi. Haqiqiy narx va telefonni promptga o'zingiz yozasiz.", hint: "Bu raqamlarni kim yozdi: siz yoki sun'iy intellekt? Promptda ular bormidi?", alt: "Narx va telefon yonida «Taxmin» belgisi bor sayt" },
    ru: { ctx: 'В промпте «Что внутри?» — «цены, контакты». Цифр нет.', q: 'Почему рядом с ценой и телефоном стоит «Догадка»?', opts: ['Цены слишком высокие, поэтому их отметили', 'Сайт ещё не загрузился, цифры появятся позже', 'ИИ сам придумал цену и телефон', 'Клиент попросил примерные цену и телефон'],
      ok: 'Если цифры не написаны, ИИ их придумывает. Настоящие цену и телефон пишешь в промпт ты сам.', hint: 'Кто написал эти цифры: ты или ИИ? Были ли они в промпте?', alt: 'Сайт с меткой «Догадка» у цены и телефона' },
    en: { ctx: 'The “What’s inside?” line says “prices, contact”. No numbers are given.', q: 'Why is there a “Guess” tag next to the price and phone?', opts: ['The prices are too high, so they were tagged', 'The site hasn’t finished loading; the numbers come later', 'The AI made up the price and phone itself', 'The client asked for a rough price and phone'],
      ok: 'If the numbers aren’t written, the AI makes them up. You write the real price and phone in the prompt yourself.', hint: 'Who wrote these numbers: you or the AI? Were they in the prompt?', alt: 'A site with a “Guess” tag next to the price and phone' } },

  { id: 'ai-03t5', target: 'ai-03', tag: 'yetishmaydi', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Futbol klubi', 'Футбольный клуб', 'Football club'), em: '⚽', focus: '.blk', c: '#16A34A', c2: '#15803D', bg: '#DCFCE7',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Murabbiylar', 'Тренеры', 'Coaches'), T('Rasmlar', 'Фото', 'Photos')],
      badge: T("Bolalar uchun to'garak", 'Секция для детей', 'A club for kids'), sub: T("Futbol o'ynashni o'rganamiz!", 'Учимся играть в футбол!', 'Let’s learn to play football!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      blocks: [{ h: T('Jadval', 'Расписание', 'Schedule'), items: [{ t: T('Dushanba · 17:00', 'Понедельник · 17:00', 'Monday · 17:00') }, { t: T('Payshanba · 17:00', 'Четверг · 17:00', 'Thursday · 17:00') }] },
        { h: T('Murabbiylar', 'Тренеры', 'Coaches'), items: [{ t: T('👨‍🏫 Aziz aka', '👨‍🏫 Азиз', '👨‍🏫 Aziz') }, { t: T('👩‍🏫 Malika opa', '👩‍🏫 Малика', '👩‍🏫 Malika') }] }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Ota-ona so'rayapti: «Mashg'ulotlar qayerda bo'ladi?»", q: "Saytga qaysi blokni qo'shish kerak?", opts: ['Sharhlar', 'Aloqa va manzil', 'Rasmlar', 'Narxlar'],
      ok: "«Qayerda?» degan savolga manzil javob beradi. Saytda esa aloqa bloki yo'q.", hint: "Savol joy haqida. Saytdagi bloklar orasida manzil bormi?", alt: "Jadval va murabbiylar bloki bor sayt" },
    ru: { ctx: 'Родитель спрашивает: «Где проходят занятия?»', q: 'Какой блок нужно добавить на сайт?', opts: ['Отзывы', 'Контакты и адрес', 'Фото', 'Цены'],
      ok: 'На вопрос «где?» отвечает адрес. А блока контактов на сайте нет.', hint: 'Вопрос про место. Есть ли среди блоков сайта адрес?', alt: 'Сайт с блоками расписания и тренеров' },
    en: { ctx: 'A parent asks: “Where are the practices held?”', q: 'Which block should be added to the site?', opts: ['Reviews', 'Contact and address', 'Photos', 'Prices'],
      ok: 'A “where?” question is answered by the address. And the site has no contact block.', hint: 'The question is about a place. Is there an address among the site’s blocks?', alt: 'A site with schedule and coaches blocks' } }
];
