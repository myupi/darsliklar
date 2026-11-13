// =============================================================================
// ТЕСТЫ К УРОКУ 1 МОДУЛЯ «ИИ» «Что создаём и зачем?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «Nima?» — конкретная вещь; «Nega?» — цель сайта, видна на сайте (кнопка, раздел); «chiroyli bo'lsin»
// — не цель; строки промпта — из сообщения клиента.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'chto-i-zachem';
const QS = [
  { id: 'ai-01t1', target: 'ai-01', tag: 'nima', correct: 1,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: null }, { q: 1, t: L === 'ru' ? 'чтобы команды записывались' : L === 'en' ? 'get teams to sign up' : "jamoalar yozilsin" }]} />,
    uz: { ctx: "Sun'iy intellektga nima yaratishni aytamiz.", q: "«Nima?» qatoriga qaysi biri aniqroq?", opts: ['Sayt', 'Futbol turniri sayti', "Zo'r narsa", 'Bir narsa qil'],
      ok: "«Futbol turniri sayti» aniq narsani aytadi: qanday sayt kerakligini.", hint: "Qaysi javobdan sun'iy intellekt qanday sayt kerakligini biladi? Mavzu va sayt turi bo'lsin.", alt: "«Nima?» qatori bo'sh promptda" },
    ru: { ctx: 'Говорим ИИ, что создать.', q: 'Что точнее подходит в строку «Что?»?', opts: ['Сайт', 'Сайт футбольного турнира', 'Что-нибудь крутое', 'Сделай что-нибудь'],
      ok: '«Сайт футбольного турнира» называет конкретную вещь: какой нужен сайт.', hint: 'По какому ответу ИИ поймёт, какой именно нужен сайт? Нужны тема и вид сайта.', alt: 'Пустая строка «Что?» в промпте' },
    en: { ctx: 'We tell the AI what to make.', q: 'Which fits the “What?” line best?', opts: ['A site', 'A football tournament site', 'Something cool', 'Make something'],
      ok: '“A football tournament site” names a real thing: exactly what site is needed.', hint: 'Which answer tells the AI exactly what site is needed? It needs a topic and a kind of site.', alt: 'An empty “What?” line in a prompt' } },
  { id: 'ai-01t2', target: 'ai-01', tag: 'nega', correct: 2,
    // Сайт — как его собрал бы ИИ урока 1 из «Shaxmat turniri sayti» + «o'yinchilar turnirga yozilsin» (тема шахмат, вид «турнир»);
    // карточки не показаны: форма записи — главная подсказка вопроса — должна быть видна сразу под баннером.
    vis: (L) => { const T3 = (uz, ru, en) => (L === 'ru' ? ru : L === 'en' ? en : uz); return <AqSite site={{
      title: T3('Shaxmat turniri', 'Шахматный турнир', 'Chess tournament'), em: '♟️', focus: '.goal', c: '#334155', c2: '#0F172A', bg: '#E2E8F0',
      nav: [T3('Jadval', 'Расписание', 'Schedule'), T3('Jamoalar', 'Команды', 'Teams'), T3('Sovrinlar', 'Призы', 'Prizes')],
      badge: T3('Bahor turniri · 2026', 'Весенний турнир · 2026', 'Spring tournament · 2026'),
      sub: T3("Hoziroq ro'yxatdan o'ting: joylar soni cheklangan!", 'Запишись прямо сейчас: мест немного!', 'Sign up now: places are limited!'),
      cta: T3("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      goal: { h: T3("Ro'yxatdan o'tish", 'Запись', 'Sign up'), fields: [T3('Ismingiz', 'Твоё имя', 'Your name'), T3('Sinfingiz', 'Твой класс', 'Your class')], btn: T3('Yuborish', 'Отправить', 'Send') },
      foot: T3('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: "Qaysi «Nega?» qatori shu saytni bergan?", opts: ['odamlar turnir qachon va qayerdaligini bilsin', "odamlar bizga qo'ng'iroq qilsin", "o'yinchilar turnirga yozilsin", "sayt chiroyli bo'lsin"],
      ok: "Saytda ro'yxatdan o'tish tugmasi va formasi bor: maqsad yozilish.", hint: "Saytdagi katta tugmaga va formaga qarang: ular odamlardan nima qilishni so'rayapti?", alt: "Ro'yxatdan o'tish tugmasi va formasi bor sayt" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Какая строка «Зачем?» дала этот сайт?', opts: ['чтобы люди узнали, когда и где турнир', 'чтобы люди нам звонили', 'чтобы игроки записывались на турнир', 'чтобы сайт был красивым'],
      ok: 'На сайте кнопка и форма записи: цель — запись.', hint: 'Посмотри на большую кнопку и форму: что они просят сделать?', alt: 'Сайт с кнопкой и формой записи' },
    en: { ctx: 'The AI made this site.', q: 'Which “Why?” line gave this site?', opts: ['people learn when and where the tournament is', 'get people to call us', 'get players to sign up for the tournament', 'make the site pretty'],
      ok: 'The site has a sign-up button and form: the goal is sign-ups.', hint: 'Look at the big button and the form: what do they ask people to do?', alt: 'A site with a sign-up button and form' } },
  { id: 'ai-01t3', target: 'ai-01', tag: 'nega', correct: 1,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: L === 'ru' ? 'Пиццерия' : L === 'en' ? 'Pizza cafe' : 'Pitsa kafesi sayti' }, { q: 1, t: L === 'ru' ? 'чтобы было красиво' : L === 'en' ? 'make it pretty' : "chiroyli bo'lsin" }]} />,
    uz: { ctx: "Pitsa kafesi buyurtmalar olmoqchi.", q: "Qaysi qator sun'iy intellektga hech narsa demaydi?", opts: ["«Nima?» qatori", "«Nega?» qatori", 'Ikkalasi ham aniq', "Ikkalasi ham noaniq"],
      ok: "«Chiroyli bo'lsin» maqsad emas: sayt nima qilishi kerakligini aytmaydi. Shuning uchun buyurtma tugmasi chiqmaydi.", hint: "Qaysi qator sayt nima qilishi kerakligini aytmayapti? Kafe buyurtma olmoqchi edi.", alt: "Pitsa kafesi uchun ikki qatorli prompt" },
    ru: { ctx: 'Пиццерия хочет принимать заказы.', q: 'Какая строка ничего не говорит ИИ?', opts: ['Строка «Что?»', 'Строка «Зачем?»', 'Обе точные', 'Обе неточные'],
      ok: '«Чтобы было красиво» — не цель: не сказано, что должен сделать сайт. Поэтому кнопки заказа не будет.', hint: 'Какая строка не говорит, что должен сделать сайт? Кафе хотело принимать заказы.', alt: 'Промпт из двух строк для пиццерии' },
    en: { ctx: 'A pizza cafe wants to take orders.', q: 'Which line tells the AI nothing?', opts: ['The “What?” line', 'The “Why?” line', 'Both are clear', 'Both are vague'],
      ok: '“Make it pretty” isn’t a goal: it doesn’t say what the site should do. So there won’t be an order button.', hint: 'Which line doesn’t say what the site should do? The cafe wanted to take orders.', alt: 'A two-line prompt for a pizza cafe' } },
  { id: 'ai-01t4', target: 'ai-01', tag: 'mijoz', correct: 0,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Клиент' : L === 'en' ? 'Client' : 'Mijoz'} text={L === 'ru' ? '«В нашей школе открылся шахматный кружок. Хотим, чтобы дети в него записывались».' : L === 'en' ? '“Our school has opened a chess club. We want kids to sign up for it.”' : "«Maktabimizda shaxmat to'garagi ochildi. Bolalar to'garakka yozilishini xohlaymiz.»"} />,
    uz: { ctx: "Mijozning xabarini o'qing.", q: 'Unga qaysi prompt mos?', opts: ["Shaxmat to'garagi sayti. Maqsad: bolalar yozilsin", "Shaxmat haqida sayt. Maqsad: chiroyli bo'lsin", 'Pitsa kafesi sayti. Maqsad: buyurtma qilsin', "Shaxmat to'garagi sayti. Maqsad: qo'ng'iroq qilsin"],
      ok: "Mijoz shaxmat to'garagi haqida yozdi va bolalar yozilishini xohlaydi: ikkala qator ham xabardan olingan.", hint: "Xabarda ikki narsa bor: qanday sayt va odamlar nima qilsin. Ikkalasi ham mos kelsin.", alt: "Mijozning xabari" },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Какой промпт ему подходит?', opts: ['Сайт шахматного кружка. Цель: чтобы дети записывались', 'Сайт про шахматы. Цель: чтобы было красиво', 'Сайт пиццерии. Цель: чтобы заказывали', 'Сайт шахматного кружка. Цель: чтобы звонили'],
      ok: 'Клиент пишет про шахматный кружок и хочет, чтобы дети записывались: обе строки взяты из сообщения.', hint: 'В сообщении две вещи: какой сайт и что должны делать люди. Нужно, чтобы совпали обе.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'Which prompt fits it?', opts: ['A chess club site. Goal: get kids to sign up', 'A site about chess. Goal: make it pretty', 'A pizza cafe site. Goal: get orders', 'A chess club site. Goal: get people to call'],
      ok: 'The client writes about a chess club and wants kids to sign up: both lines come from the message.', hint: 'The message has two things: what site, and what people should do. Both must match.', alt: 'The client’s message' } },
  { id: 'ai-01t5', target: 'ai-01', tag: 'nega', correct: 3,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: L === 'ru' ? 'Пекарня' : L === 'en' ? 'Bakery' : 'Novvoyxona sayti' }, { q: 1, t: null }]} />,
    uz: { ctx: "Novvoyxona odamlar tort buyurtma qilishini xohlaydi.", q: "«Nega?» qatoriga nima yozamiz?", opts: ["sayt shirin bo'lsin", 'tortlar haqida', 'hamma uchun', 'odamlar tort buyurtma qilsin'],
      ok: "Maqsad: buyurtma qilish. Shunda saytda buyurtma tugmasi va bo'limi paydo bo'ladi.", hint: "«Nega?» qatori sayt odamlardan nima qilishni so'rashini aytadi. Novvoyxona nimani xohlaydi?", alt: "«Nega?» qatori bo'sh prompt" },
    ru: { ctx: 'Пекарня хочет, чтобы люди заказывали торты.', q: 'Что написать в строку «Зачем?»?', opts: ['чтобы сайт был вкусным', 'про торты', 'для всех', 'чтобы люди заказывали торты'],
      ok: 'Цель — заказ. Тогда на сайте появятся кнопка и раздел заказа.', hint: 'Строка «Зачем?» говорит, что сайт просит сделать людей. Чего хочет пекарня?', alt: 'Промпт с пустой строкой «Зачем?»' },
    en: { ctx: 'A bakery wants people to order cakes.', q: 'What goes in the “Why?” line?', opts: ['make the site tasty', 'about cakes', 'for everyone', 'get people to order cakes'],
      ok: 'The goal is ordering. Then the site gets an order button and section.', hint: 'The “Why?” line says what the site asks people to do. What does the bakery want?', alt: 'A prompt with an empty “Why?” line' } }
];
