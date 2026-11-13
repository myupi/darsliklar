// =============================================================================
// ТЕСТЫ К УРОКУ 5 МОДУЛЯ «ИИ» «Как сайт должен вести себя?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: поведение = когда + что + что происходит; без «когда» — просто вид (кнопка всегда огромная);
// «когда» по картинке (нажатие — кольцо щелчка и сообщение); телефон (☰ и кнопка внизу); движение помогает, а не мешает.
// Поведение в тесте не оживает: картинка показывает состояние (курсор, кольцо, сообщение).
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'kak-vedet-sebya';
const QS = [
  { id: 'ai-05t1', target: 'ai-05', tag: 'qachon', correct: 2,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T('Suzish klubi sayti', 'Сайт клуба плавания', 'A swimming club site') }, { q: 5, t: null }]} />; },
    uz: { ctx: "Sayt qanday ishlashini yozamiz.", q: "Qaysi qator aniq: qachon, nima va nima bo'ladi?", opts: ["tugma katta, yorqin va chiroyli bo'lib tursin", "jonli va qiziqarli bo'lsin", "tugma ustiga sichqoncha kelganda u kattalashsin", 'sahifadagi hamma narsa sakrab, aylanib tursin'],
      ok: "Uchala narsa ham bor: qachon — sichqoncha ustiga kelganda, nima — tugma, nima bo'ladi — kattalashadi.", hint: "Qaysi qatorda «qachon?» bor? Qolganlarida faqat nima bo'lishi yozilgan.", alt: "«Qanday ishlaydi?» qatori bo'sh prompt" },
    ru: { ctx: 'Пишем, как ведёт себя сайт.', q: 'Какая строка точная: когда, что и что происходит?', opts: ['пусть кнопка будет большой, яркой и красивой', 'пусть будет живым и интересным', 'когда мышка наводится на кнопку, она увеличивается', 'пусть всё на странице прыгает и крутится'],
      ok: 'Есть все три части: когда — при наведении мышки, что — кнопка, что происходит — увеличивается.', hint: 'В какой строке есть «когда?»? В остальных написано только, что происходит.', alt: 'Промпт с пустой строкой «Как ведёт себя?»' },
    en: { ctx: 'We describe how the site behaves.', q: 'Which line is exact: when, what, and what happens?', opts: ['make the button big, bright and pretty', 'make it lively and fun', 'when the mouse is over the button, it grows', 'make everything on the page jump and spin'],
      ok: 'All three parts are there: when — the mouse is over it, what — the button, what happens — it grows.', hint: 'Which line has a “when?”. The others only say what happens.', alt: 'A prompt with an empty “How it behaves?” line' } },

  { id: 'ai-05t2', target: 'ai-05', tag: 'qachonsiz', correct: 0,
    // Как g1 урока 5: «tugma kattalashsin» без «когда» — кнопка всегда огромная, мышки нет.
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T("Shaxmat to'garagi", 'Шахматный кружок', 'Chess club'), em: '♟️', c: '#334155', c2: '#0F172A', bg: '#E2E8F0', ctaBig: true,
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Shaxmatni birga o'rganamiz!", 'Учимся шахматам вместе!', 'Let’s learn chess together!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Promptda «Qanday ishlaydi?» — «tugma kattalashsin». Sichqoncha hali tegmagan.", q: "Nega tugma doim katta bo'lib qoldi?", opts: ["«Qachon?» yozilmagan", 'Tugma buzilgan', 'Telefon ekrani kichik', 'Rang yozilmagan'],
      ok: "«Qachon?» bo'lmasa, bu harakat emas, oddiy ko'rinish: tugma doim katta. To'g'risi: «tugma ustiga sichqoncha kelganda kattalashsin».", hint: "Promptda tugma qachon kattalashishi aytilganmi?", alt: 'Doim katta tugmali sayt' },
    ru: { ctx: 'В промпте «Как ведёт себя?» — «пусть кнопка увеличивается». Мышка ещё не наводилась.', q: 'Почему кнопка всегда огромная?', opts: ['Не написано «когда?»', 'Кнопка сломалась', 'Экран телефона маленький', 'Не написан цвет'],
      ok: 'Без «когда?» это не поведение, а просто вид: кнопка всегда большая. Правильно: «когда мышка наводится на кнопку, она увеличивается».', hint: 'Сказано ли в промпте, когда кнопка должна увеличиваться?', alt: 'Сайт с всегда огромной кнопкой' },
    en: { ctx: 'The “How it behaves?” line says “make the button grow”. The mouse hasn’t touched it yet.', q: 'Why is the button always huge?', opts: ['There is no “when?”', 'The button is broken', 'The phone screen is small', 'No colour was given'],
      ok: 'Without “when?” it isn’t behaviour, just a look: the button is always big. Correct: “when the mouse is over the button, it grows”.', hint: 'Does the prompt say when the button should grow?', alt: 'A site with an always-huge button' } },

  { id: 'ai-05t3', target: 'ai-05', tag: 'bosilganda', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T("Shaxmat to'garagi", 'Шахматный кружок', 'Chess club'), em: '♟️', c: '#334155', c2: '#0F172A', bg: '#E2E8F0', cursor: 'click',
      toast: T("✅ Rahmat, siz yozildingiz!", '✅ Спасибо, ты записан!', '✅ Thanks, you’re signed up!'),
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Shaxmatni birga o'rganamiz!", 'Учимся шахматам вместе!', 'Let’s learn chess together!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      cards: [{ ic: '🗓️', h: T('Jadval', 'Расписание', 'Schedule'), p: T('Seshanba, juma', 'Вторник, пятница', 'Tue, Fri') }, { ic: '👨‍🏫', h: T('Ustozlar', 'Учителя', 'Teachers'), p: T('Tajribali', 'Опытные', 'Experienced') }, { ic: '🏆', h: T('Turnirlar', 'Турниры', 'Tournaments'), p: T('Har oy', 'Каждый месяц', 'Every month') }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sichqonchaga va pastdagi xabarga qarang.", q: 'Bu xabar qachon chiqdi?', opts: ['Ustiga kelganda', 'Bosilganda', 'Sahifa ochilganda', 'Telefonda'],
      ok: "Sichqoncha tugmani bosdi, keyin xabar chiqdi. Bu bosilganda: sayt javob berdi, odam hammasi ishlaganini biladi.", hint: "Sichqoncha yonidagi sariq halqaga qarang: u faqat ustiga keldimi yoki bosdimi?", alt: "Tugma bosilgan, pastda «Rahmat» xabari" },
    ru: { ctx: 'Посмотри на мышку и сообщение внизу.', q: 'Когда появилось это сообщение?', opts: ['При наведении', 'При нажатии', 'При открытии страницы', 'На телефоне'],
      ok: 'Мышка нажала на кнопку, и появилось сообщение. Это при нажатии: сайт ответил, и человек знает, что всё сработало.', hint: 'Посмотри на жёлтое кольцо у мышки: она просто навелась или нажала?', alt: 'Кнопка нажата, внизу сообщение «Спасибо»' },
    en: { ctx: 'Look at the mouse and the message at the bottom.', q: 'When did this message appear?', opts: ['On hover', 'On click', 'When the page opened', 'On a phone'],
      ok: 'The mouse clicked the button, and then the message appeared. That’s on click: the site answered, so the person knows it worked.', hint: 'Look at the yellow ring by the mouse: did it just hover, or did it click?', alt: 'The button was clicked, a “Thanks” message at the bottom' } },

  { id: 'ai-05t4', target: 'ai-05', tag: 'telefon', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Robot kursi', 'Курс роботов', 'Robot course'), em: '🤖', c: '#0D9488', c2: '#0F766E', bg: '#CCFBF1', mobile: true, noFoot: true,
      bottomBtn: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      nav: [T('Darslar', 'Занятия', 'Lessons'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Robot yasashni o'rganing!", 'Научись собирать роботов!', 'Learn to build robots!'), cta: T('Batafsil', 'Подробнее', 'Learn more'),
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sayt telefonda shunday ochildi.", q: "Qaysi «Qanday ishlaydi?» shu natijani bergan?", opts: ["sichqoncha menyu ustiga kelganda menyu kattalashib, rangi o'zgarsin", 'sahifa ochilganda bloklar birin-ketin sakrab chiqsin', "jonli va qiziqarli bo'lsin, hamma narsa harakatlansin", "telefonda menyu ☰ ga yig'ilsin, yozilish tugmasi pastda tursin"],
      ok: "Telefonda menyu ☰ ga yig'ildi, yozilish tugmasi pastda turibdi. «Qachon?» bu yerda — telefonda.", hint: "Bu telefon ekrani. Menyu qayerga ketdi, tugma qayerda turibdi?", alt: "Telefondagi sayt: ☰ va pastda tugma" },
    ru: { ctx: 'Так сайт открылся на телефоне.', q: 'Какая строка «Как ведёт себя?» дала такой результат?', opts: ['когда мышка наводится на меню, оно увеличивается и меняет цвет', 'при открытии страницы блоки по очереди выпрыгивают', 'пусть будет живым и интересным, пусть всё двигается', 'на телефоне меню сворачивается в ☰, кнопка записи стоит внизу'],
      ok: 'На телефоне меню свернулось в ☰, а кнопка записи стоит внизу. «Когда?» здесь — на телефоне.', hint: 'Это экран телефона. Куда делось меню и где стоит кнопка?', alt: 'Сайт на телефоне: ☰ и кнопка внизу' },
    en: { ctx: 'This is how the site opened on a phone.', q: 'Which “How it behaves?” line gave this result?', opts: ['when the mouse is over the menu, it grows and changes colour', 'when the page opens, the blocks jump out one by one', 'make it lively and fun, make everything move', 'on a phone the menu folds into ☰ and the sign-up button stays at the bottom'],
      ok: 'On the phone the menu folded into ☰ and the sign-up button sits at the bottom. The “when?” here is “on a phone”.', hint: 'This is a phone screen. Where did the menu go, and where is the button?', alt: 'The site on a phone: ☰ and a button at the bottom' } },

  { id: 'ai-05t5', target: 'ai-05', tag: 'foyda', correct: 2,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mehmonlar', 'Посетители', 'Visitors')} text={T("«Boshim aylanib ketdi! Hamma narsa sakraydi, buyurtma tugmasi esa qochib ketadi.»", '«Голова кружится! Всё прыгает, а кнопка заказа убегает».', '“My head is spinning! Everything jumps, and the order button runs away.”')} />; },
    uz: { ctx: "Oilaviy kafe saytiga mehmonlar shunday yozdi.", q: "Qaysi «Qanday ishlaydi?» saytni yaxshilaydi?", opts: ['hamma narsa sakrasin, aylansin va miltillab tursin', 'sichqoncha kelganda buyurtma tugmasi boshqa joyga qochsin', "tugma ustiga sichqoncha kelganda rangi o'zgarsin, hech narsa sakramasin", "jonli va qiziqarli bo'lsin"],
      ok: "Yaxshi harakat odamga yordam beradi: tugma «meni bosing» deydi, boshqa hech narsa sakramaydi.", hint: "Qaysi harakat mehmonga yordam beradi, qaysisi xalaqit beradi?", alt: 'Mehmonlarning xabari' },
    ru: { ctx: 'Посетители семейного кафе написали так.', q: 'Какая строка «Как ведёт себя?» сделает сайт лучше?', opts: ['пусть всё прыгает, крутится и мигает', 'когда мышка наводится, кнопка заказа убегает в другое место', 'когда мышка наводится на кнопку, меняется её цвет, ничего не прыгает', 'пусть будет живым и интересным'],
      ok: 'Хорошее движение помогает: кнопка говорит «нажми меня», а больше ничего не прыгает.', hint: 'Какое движение помогает посетителю, а какое мешает?', alt: 'Сообщение посетителей' },
    en: { ctx: 'Visitors of a family cafe site wrote this.', q: 'Which “How it behaves?” line makes the site better?', opts: ['make everything jump, spin and flash', 'when the mouse comes near, the order button runs somewhere else', 'when the mouse is over the button, its colour changes; nothing jumps', 'make it lively and fun'],
      ok: 'Good motion helps: the button says “click me”, and nothing else jumps.', hint: 'Which motion helps the visitor, and which gets in the way?', alt: 'The visitors’ message' } }
];
