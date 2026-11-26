// =============================================================================
// МОДУЛЬ «ИИ» · Урок 5 — «Как сайт должен вести себя?»
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 12.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai5/build.mjs → lessons/ai/05-kak-vedet-sebya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · «Как сайт должен вести себя?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика: каждый урок добавляет в промпт новый кусок; темы урока — hover, анимации, адаптивность,
// реакции элементов). Коди пишет для семейного кафе «jonli va qiziqarli bo'lsin», и ИИ делает сайт, где всё прыгает и
// крутится, а кнопка «Заказать» убегает от мыши. Урок учит шестому вопросу формулы «Qanday ishlaydi?»: поведение =
// когда (ustiga kelganda, bosilganda, sahifa ochilganda, telefonda) + что + что делает. Загадка (без имён): Коди думает,
// что чем больше движения, тем сайт живее и лучше. Разгадка: движение должно помогать — кнопка говорит «нажми меня»,
// после нажатия сайт отвечает, на телефоне меню находится; когда прыгает всё, глаза устают и кнопку не нажать.
//
// ДУГА (18 экранов):
//   s1 крючок (шесть строк, «Qanday ishlaydi?» = «jonli va qiziqarli bo'lsin» → всё прыгает, кнопка убегает; загадка)
//   наведение: s2 показ (пусто → цвет → цвет и рост → карточки поднимаются) · s3 сам (пиццерия: карточки меню растут) ·
//              s4 что точнее (раунды)
//   нажатие: s5 показ (пусто → «Rahmat» → вопрос раскрывается) · s6 сам (книжный: «Savatga qo'shildi») ·
//            s7 когда это сработало (раунды)
//   открытие и телефон: s8 показ (сразу → по очереди → заголовок сверху → кнопка мигает) · s9 сам (выставка) ·
//            s10 показ (компьютер → телефон: меню пропало → ☰ → кнопка внизу) · s11 сам (лагерь: ☰)
//   думать промптом: g1 «когда?» (Коди: «tugma kattalashsin» → кнопка всегда большая) · det детектив (какая строка дала
//            поведение) · s12 почини «jonli va qiziqarli» Коди (кафе) · s13 три поведения · s14 свой сайт
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт из шести строк и сайт, домашка.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite с pr.beh, behOf, behCss, behEls): настоящие :hover, transition,
//     @keyframes, @media на странице. Курсор показа (одобрен заказчиком 07.11.2026) сам наводит, нажимает, окно
//     сужается до телефона — сайт честно отвечает; без поведения — ничего не происходит. Нет «когда» — просто вид
//     (кнопка всегда большая); нет «что делает» — догадка ИИ («Taxmin»); «jonli» — всё прыгает. Метки «Qanday ishlaydi?»
//     (янтарные) — у того, что ведёт себя.
//   · Промпт ученика уходит ИИ всегда; проверка называет, чего не хватает.
//   · Узбекский — по /uzbekcha; в речи нет символов (☰ — «uch chiziqli tugma»).
//
// СИСТЕМА СЛОВ: ustiga kelganda — при наведении (hover, ya'ni sichqoncha ustiga kelganda); bosilganda — при нажатии;
// sahifa ochilganda — при открытии страницы; telefonda — на телефоне; animatsiya (ya'ni silliq harakat); moslashuvchan
// sayt (ya'ni telefon ekraniga moslashadi); xabar — сообщение.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-05-kak-vedet-sebya',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '5-dars. Sayt qanday ishlaydi?',
    ru: 'Урок 5. Как сайт должен вести себя?',
    en: 'Lesson 5. How should the site behave?'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  kodi: L3('Kodi', 'Коди', 'Kodi'),
  hw: L3('Uyga vazifa', 'Домашнее задание', 'Homework'),
  copy: L3('Nusxalash', 'Копировать', 'Copy'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Aniq talablar qanday beriladi?', 'Как дать ИИ точные требования?', 'How to give the AI exact requirements?'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};
// «Когда» — для выбора по раундам.
const TRIG_L = {
  hover: L3('Ustiga kelganda', 'При наведении', 'On hover'),
  click: L3('Bosilganda', 'При нажатии', 'On click'),
  load: L3('Sahifa ochilganda', 'При открытии страницы', 'When the page opens'),
  phone: L3('Telefonda', 'На телефоне', 'On a phone')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const BUY = L3('Buyurtma', 'Заказ', 'Request');
// Общие ответы проверки «Qanday ishlaydi?».
const M = {
  empty: L3("«Qanday ishlaydi?» qatori hali bo'm-bo'sh-ku. Unga uch narsani yozing: qachon, nima va nima bo'ladi.", 'Напиши в строку «Как ведёт себя?»: когда, что и что происходит?', 'Write in the “How it behaves?” line: when, what and what happens?'),
  vague: L3("«Jonli», «qiziqarli» degan so'zlarni har kim har xil tushunadi-da. Aniqroq yozing: qachon bo'lsin, masalan, ustiga kelgandami yoki bosilgandami, keyin nima va u bilan nima bo'lsin.", '«Живой», «интересный» каждый понимает по-своему. Напиши точно: когда (например, при наведении или нажатии), что и что происходит.', '“Lively” and “fun” mean different things to everyone. Be precise: when (for example on hover or on click), what and what happens.'),
  chaos: L3("Hamma narsa birdan sakrasa, ko'z tez charchaydi, tugmani esa bosib bo'lmaydi. Shuning uchun faqat kerakli harakatning o'zini yozing.", 'Если прыгает всё, глаза устают, а кнопку не нажать. Напиши только нужное движение.', 'If everything jumps, eyes get tired and the button can’t be pressed. Write only the movement that’s needed.'),
  none: L3("Sun'iy intellekt bu so'zlardan qanaqa harakat kerakligini tushunmadi. Masalan, shunday yozib ko'ring: tugma ustiga kelganda rangi o'zgarsin.", 'ИИ не узнал по этим словам поведение. Например: кнопка меняет цвет при наведении.', 'The AI didn’t recognise a behaviour. For example: the button changes colour on hover.'),
  still: L3("Qatorda «qachon?» yo'q ekan, shuning uchun sun'iy intellekt tugmani doim shunday qilib qo'ydi. Qachon ishlashini ham yozing: ustiga kelgandami yoki bosilgandami.", 'Нет «когда?» — и ИИ просто сделал кнопку такой всегда. Напиши, когда это происходит: при наведении или при нажатии.', 'There’s no “when?”, so the AI simply made the button like that all the time. Write when it happens: on hover or on click.')
};
const C = {
  s1: {
    eyebrow: L3('Sayt qanday ishlaydi?', 'Как ведёт себя сайт?', 'How does it behave?'),
    say: L3("Qalaysiz? Bugun men oilaviy kafe uchun sayt qilyapman. Promptimning beshta qatori sizga tanish, oltinchisi esa yangi: sayt qanday ishlaydi. Men unga «jonli va qiziqarli bo'lsin» deb yozdim. Oilaviy kafe-ku, hammaga qiziq bo'lsin-da! Qani, «Yuborish»ni bosing.",
      'Привет! В моём промпте пять строк. Шестая — новая: как ведёт себя сайт. Я написал «пусть будет живым и интересным». Это для семейного кафе! Нажми «Отправить».',
      'Hi! My prompt has five lines. The sixth is new: how the site behaves. I wrote “make it lively and fun”. It’s for a family cafe! Tap “Send”.'),
    what: L3('Oilaviy kafe sayti', 'Сайт семейного кафе', 'A family cafe site'),
    why: L3('odamlar ovqat buyurtma qilsin', 'чтобы люди заказывали еду', 'get people to order food'),
    who: L3('mahalladagi oilalar', 'семьи нашего района', 'families in our neighbourhood'),
    inside: L3('menyu, narxlar, aloqa', 'меню, цены, контакты', 'menu, prices, contact'),
    look: L3("iliq, to'q sariq va oq", 'тёплый, оранжевый и белый', 'warm, orange and white'),
    beh: L3("jonli va qiziqarli bo'lsin", 'пусть будет живым и интересным', 'make it lively and fun'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Voy-voy, bu nimasi? Saytdagi hamma narsa sakrab, aylanib yuribdi! «Buyurtma berish» tugmasi esa sichqonchadan qochib ketyapti, uni bosib bo'lmaydi-ku! «Taxmin» belgilarini ko'ryapsizmi? Demak, «jonli» degan so'zni sun'iy intellekt o'zicha tushunibdi.",
      'Ого! Всё прыгает и крутится. А кнопка «Заказать» убегает, её не нажать! Смотри, метки «Догадка»: слово «живой» ИИ понял по-своему.',
      'Whoa! Everything is jumping and spinning. And the “Order now” button runs away, you can’t press it! Look at the “Guess” labels: the AI understood “lively” its own way.'),
    done: L3("Mijozlardan biri «Boshim aylanib ketdi», deb yozibdi. Menimcha, u hali bunaqa jonli saytni ko'rmagan, xolos. Sayt qancha ko'p qimirlasa, shuncha jonli va zo'r bo'ladi-da! Sizningcha, kim haq: mijozmi yoki menmi? Bugun oltinchi savolni, sayt qanday ishlashini o'rganamiz, shunda kim haqligi ham ma'lum bo'ladi.",
      'По-моему, чем больше на сайте движения, тем он живее и круче! А ты как думаешь? Сегодня разберём шестой вопрос: как ведёт себя сайт?',
      'I think the more a site moves, the livelier and cooler it is! What do you think? Today we learn the sixth question: how does the site behave?'),
    seen: { h: L3('Mijozlar nima dedi', 'Что сказали посетители', 'What the customers said'), t: L3("«Boshim aylanib ketdi! Buyurtma tugmasi qochib yuribdi, bosolmadim!»", '«У меня закружилась голова! Кнопка заказа убегает, я не смог нажать!»', '“My head is spinning! The order button keeps running away, I couldn’t press it!”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("«Jonli» degan so'z kafega mos chiqmadi", '«Живой» кафе не подошёл', '“Lively” didn’t suit the cafe')
  },
  s2: {
    eyebrow: L3('Ustiga kelganda', 'При наведении', 'On hover'),
    help: [
      L3("Oltinchi qatorga bir qarang-chi, keyin sichqoncha ustiga kelgan tugmaga ham. Qator o'zgargan sari tugma ham sichqonchaga boshqacha javob beryapti.", 'Посмотри на строку промпта и на кнопку под мышкой.', 'Look at the prompt line and at the button under the mouse.'),
      L3("Sichqoncha ustiga kelgan bu payt hover deyiladi, ya'ni ustiga kelish degani. Shu payt tugma o'zgarsa, odam «Buni bosish mumkin ekan», deb darrov tushunadi.", 'Hover — это когда мышь наведена на элемент. Кнопка меняется — и человек понимает, что её можно нажать.', 'Hover means the mouse is over an element. When the button changes, people understand it can be pressed.'),
      L3("O'yinda qahramon tanlaydigan menyu esingizdami? Qahramon ustiga borsangiz, u yorishib, kattalashib ketadi, siz esa kimni tanlayotganingizni darrov bilasiz. Saytdagi hover ham xuddi shunday ishlaydi.", 'В меню игры выбранный герой подсвечивается и становится больше. Ты сразу видишь, кого выбираешь.', 'In a game menu the hero you point at lights up and grows. You see at once who you’re picking.')
    ],
    say: L3("Oltinchi savol shunday: sayt qanday ishlaydi? Boshqacha aytganda, odam saytda biror narsa qilsa, sayt unga qanday javob berishini yozamiz. Hozircha bu qator bo'm-bo'sh. Qarang: sichqoncha tugma ustiga keldi, uni bosdi ham, lekin hech narsa bo'lmadi. Xo'sh, bu tugmami yoki shunchaki yozuvmi, bilib bo'ladimi?",
      'Шестой вопрос: как ведёт себя сайт? То есть что делает сайт, когда человек что-то делает. Смотри, строка пока пустая. Мышь навелась на кнопку, нажала — и ничего. Это кнопка или просто надпись?',
      'The sixth question: how does the site behave? That is, what the site does when a person does something. Look, the line is empty for now. The mouse went over the button and clicked, and nothing happened. Is it a button or just text?'),
    what: L3('Suzish klubi sayti', 'Сайт клуба плавания', 'A swimming club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3('8–12 yoshli bolalar', 'дети 8–12 лет', 'kids aged 8–12'),
    inside: L3('narxlar, rasmlar, aloqa', 'цены, фото, контакты', 'prices, photos, contact'),
    look: L3("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white'),
    b1: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении мыши', 'the button changes colour when the mouse is over it'),
    b2: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin va kattalashsin", 'кнопка меняет цвет и увеличивается при наведении мыши', 'the button changes colour and grows when the mouse is over it'),
    b3: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin va kattalashsin, kartochkalar ustiga kelganda ko'tarilsin", 'кнопка меняет цвет и увеличивается при наведении мыши, карточки приподнимаются при наведении', 'the button changes colour and grows when the mouse is over it, cards lift up on hover'),
    says: [
      L3("Qatorga yozdik: tugma ustiga sichqoncha kelganda rangi o'zgarsin. Qarang-chi: sichqoncha kelishi bilan tugma sap-sariq bo'ldi! U go'yo «Meni bosing!» deb chaqirayotganday.", 'Пишем: кнопка меняет цвет при наведении. Смотри: мышь навелась — кнопка стала жёлтой! Теперь она говорит: «нажми меня».', 'We write: the button changes colour on hover. Look: the mouse came over and the button turned yellow! Now it says “press me”.'),
      L3("Keyin yana bitta so'z qo'shdik: kattalashsin. Ko'rdingizmi? Endi tugma ham rangini o'zgartiryapti, ham kattalashyapti. Buni payqamay o'tib ketish qiyin!", 'Добавим: и увеличивается. Кнопка и цвет меняет, и растёт. Такое трудно не заметить.', 'Let’s add: and grows. The button changes colour and gets bigger. That’s hard to miss.'),
      L3("Faqat tugma emas, kartochkalar ham javob bera oladi. Sichqoncha kelgan kartochka sal tepaga ko'tarilyapti, sezdingizmi? Shunda odam sichqonchasi qayerda turganini doim ko'rib turadi.", 'Карточки тоже могут отвечать: при наведении они приподнимаются. Человек всегда видит, где сейчас мышь.', 'Cards can respond too: they lift up on hover. People always see where the mouse is.')
    ],
    done: L3("Shunday qilib, birinchi holat sichqoncha ustiga kelgan payt ekan. Ingliz tilida uni hover deyishadi. Qatorga esa uch narsani yozamiz: qachon, nima va nima bo'ladi.", 'Итак, первый случай — при наведении мыши. По-английски это hover. В строку пишем: когда, что и что происходит.', 'So, the first case is when the mouse is over something. In English it’s called hover. In the line we write: when, what and what happens.'),
    asks: [L3("Qarang: hozir hech narsa bo'lmaydi", 'Смотри: сейчас ничего не происходит', 'Watch: nothing happens now'), L3("Qarang: rangi o'zgaradi", 'Смотри: меняется цвет', 'Watch: the colour changes'),
      L3('Qarang: kattalashadi', 'Смотри: растёт', 'Watch: it grows'), L3("Qarang: kartochka ko'tariladi", 'Смотри: карточка приподнимается', 'Watch: the card lifts')],
    askDone: L3('Ustiga kelganda sayt javob beradi', 'При наведении сайт отвечает', 'The site responds on hover')
  },
  s3: {
    eyebrow: L3('Ustiga kelganda', 'При наведении', 'On hover'),
    card: { h: BUY, t: L3("Pitsa do'koni: menyu kartochkasi ustiga sichqoncha kelganda u kattalashsin. Mijoz qaysi pitsani tanlayotganini ko'rsin.", 'Пиццерия: пусть карточка меню увеличивается при наведении мыши. Пусть покупатель видит, какую пиццу выбирает.', 'Pizza shop: let a menu card grow when the mouse is over it, so customers see which pizza they’re choosing.') },
    say: L3("Mana, birinchi buyurtma ham keldi: pitsa do'koni sayt so'rayapti. Beshta qatorni men yozib qo'ydim, oltinchisi sizdan. Buyurtmani o'qib chiqing-da, «Qanday ishlaydi?» qatoriga yozing: qachon, nima va nima bo'ladi.",
      'Теперь ты. Пиццерия попросила сайт. Пять строк готовы. Прочитай заказ и напиши в строку «Как ведёт себя?»: когда, что и что происходит.',
      'Your turn. A pizza shop asked for a site. Five lines are ready. Read the request and write in the “How it behaves?” line: when, what and what happens.'),
    what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'),
    why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'),
    who: L3("pitsani yaxshi ko'radigan talabalar", 'студенты, которые любят пиццу', 'students who love pizza'),
    inside: L3('menyu, narxlar, aloqa', 'меню, цены, контакты', 'menu, prices, contact'),
    look: L3('zamonaviy, qizil va oq', 'современный, красный и белый', 'modern, red and white'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noHover: L3("Qachon bo'lishi yozilmabdi-ku. Buyurtmaga qarang: kartochka sichqoncha ustiga kelganda o'zgarishi kerak.", 'Когда? В заказе: при наведении мыши.', 'When? The request says: when the mouse is over it.'),
      notCard: L3("Bu harakat tugmada ishlab ketdi. Buyurtmada esa tugma emas, menyu kartochkasi so'ralgan.", 'Это сработало на кнопке. А в заказе — карточка меню.', 'That worked on the button. The request is about the menu cards.'),
      noGrow: L3("Kartochka nima qilishi kerak? Buyurtmani yana bir o'qing-chi: u kattalashishi kerak ekan.", 'Что делает карточка? В заказе: увеличивается.', 'What should the card do? The request says: grow.')
    },
    hints: [
      L3("Buyurtmani sekin o'qib chiqing: unda qachon, nima va nima bo'lishi yozilgan.", 'В заказе три вещи: когда, что и что происходит.', 'The request has three things: when, what and what happens.'),
      L3("Qachon? Sichqoncha ustiga kelganda. Nima? Menyu kartochkasi. Nima bo'ladi? Kattalashadi. Shularni bitta qatorga yozing.", 'При наведении мыши карточка меню увеличивается.', 'When the mouse is over it, the menu card grows.'),
      L3("Pastda namuna chiqdi. Shuni qatorga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('menyu kartochkasi ustiga sichqoncha kelganda kattalashsin', 'карточка меню увеличивается при наведении мыши', 'menu cards grow when the mouse is over them'),
    ok: L3("Ishlayapti! Sichqoncha kelishi bilan kartochka kattalashdi. Endi mijoz qaysi pitsani tanlayotganini darrov ko'radi.", 'Огонь! Мышь навелась — карточка выросла. Покупатель видит, какую пиццу выбирает!', 'Awesome! The mouse came over and the card grew. Customers see which pizza they’re choosing!'),
    ask: L3("«Qanday ishlaydi?»ga yozing", 'Напиши в «Как ведёт себя?»', 'Write in “How it behaves?”')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Endi ikkita «Qanday ishlaydi?» qatorini solishtiramiz. Ulardan qaysi biri sun'iy intellektga ko'proq yordam berarkin? O'ylab ko'ring-da, tanlang.", 'Теперь проверь себя. Какое из двух «Как ведёт себя?» больше поможет ИИ?', 'Now check yourself. Which of the two “How it behaves?” lines helps the AI more?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi «Qanday ishlaydi?» aniqroq?", 'Какое «Как ведёт себя?» точнее?', 'Which “How it behaves?” is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Ikkalasini ham o'qib chiqing-chi: qaysi birida qachon, nima va nima bo'lishi aytilgan?", 'Где сказано, когда, что и что происходит?', 'Which one says when, what and what happens?'),
    hint2: L3("«Jonli», «qiziqarli» degan so'zlar hech narsani aniq aytmaydi. «Qachon?» yozilmasa esa harakat ham bo'lmaydi.", '«Живой», «интересный» ничего точно не говорят. Без «когда?» нет и движения.', '“Lively” and “fun” say nothing precise. Without “when?” there’s no behaviour.'),
    items: [
      { a: L3("jonli bo'lsin", 'пусть будет живым', 'make it lively'), b: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'), right: 'b',
        why: L3("Ikkinchi qatorda hammasi bor: qachon, nima va nima bo'lishi.", 'Во втором есть «когда», «что» и «что происходит».', 'The second has when, what and what happens.') },
      { a: L3("kartochkalar ustiga kelganda ko'tarilsin", 'карточки приподнимаются при наведении', 'cards lift up on hover'), b: L3('qiziqarli ishlasin', 'пусть интересно работает', 'make it work in a fun way'), right: 'a',
        why: L3("Birinchi qatorda hammasi aniq yozilgan: kartochkalar ustiga kelganda ko'tariladi.", 'Первый точный: карточки, при наведении, приподнимаются.', 'The first is precise: cards, on hover, lift up.') },
      { a: L3('tugma kattalashsin', 'кнопка увеличивается', 'the button grows'), b: L3('tugma ustiga sichqoncha kelganda kattalashsin', 'кнопка увеличивается при наведении мыши', 'the button grows when the mouse is over it'), right: 'b',
        why: L3("Birinchi qatorda «qachon?» yo'q, shuning uchun tugma doim katta bo'lib qolaveradi.", 'В первом нет «когда?»: кнопка просто всегда будет большой.', 'The first has no “when?”: the button would just stay big all the time.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala safar ham aniq qatorni topdingiz! Endi bo'sh so'zni aniq harakatdan bemalol ajratasiz.", 'Всё верно! Ты отличаешь «живой» от точного поведения.', 'All correct! You can tell “lively” from a precise behaviour.')
  },
  s5: {
    eyebrow: L3('Bosilganda', 'При нажатии', 'On click'),
    help: [
      L3("Tugma bilan sichqonchaga diqqat qiling-chi: sichqoncha bosgandan keyin ekranda nima paydo bo'lyapti?", 'Посмотри на кнопку и мышь: что появляется после нажатия?', 'Look at the button and the mouse: what appears after the click?'),
      L3("Bu payt «bosilganda» deyiladi: odam sichqoncha bilan bosadimi yoki telefonda barmog'ini tekkizadimi, farqi yo'q. Shunda sayt javob qaytarsa, odam hammasi ishlaganini biladi.", 'При нажатии — то есть когда щёлкают мышью или касаются пальцем на телефоне. Сайт ответил — и человек знает, что всё сработало.', 'On click means pressing with the mouse or tapping with a finger on a phone. When the site answers, people know it worked.'),
      L3("Liftning tugmasini bossangiz, u darrov yonib qoladi-ku. Demak, lift sizni eshitdi. Saytdagi tugma ham bosilganda xuddi shunday javob berishi kerak.", 'Нажимаешь кнопку лифта — она загорается. Значит, лифт тебя услышал.', 'Press a lift button and it lights up. That means the lift heard you.')
    ],
    say: L3("Endi ikkinchi holatga o'tamiz: bosilganda. Qarang, sichqoncha «Ro'yxatdan o'tish» tugmasini bosdi, lekin hech narsa chiqmadi. Odam yozildimi yoki yo'qmi? O'zi ham bilmaydi, shuning uchun tugmani yana-yana bosaveradi.",
      'Второй случай — при нажатии. Смотри, сейчас мышь нажала «Записаться», но ничего не появилось. Записался или нет? Человек не знает и жмёт снова и снова.',
      'The second case is on click. Look, the mouse just pressed “Sign up”, but nothing appeared. Signed up or not? People don’t know, so they press again and again.'),
    what: L3("Shaxmat to'garagi sayti", 'Сайт шахматного кружка', 'A chess club site'),
    why: L3("o'quvchilar to'garakka yozilsin", 'чтобы школьники записывались в кружок', 'get students to sign up for the club'),
    who: L3("10–14 yoshli o'quvchilar", 'школьники 10–14 лет', 'students aged 10–14'),
    inside: L3('jadval, savol-javob, aloqa', 'расписание, вопросы и ответы, контакты', 'schedule, FAQ, contact'),
    look: L3('minimalist, qora va oq', 'минимализм, чёрный и белый', 'minimal, black and white'),
    c1: L3("tugma bosilganda «Rahmat, siz yozildingiz!» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Спасибо, ты записан!»', 'when the button is pressed, show the message “Thanks, you’re signed up!”'),
    c2: L3("tugma bosilganda «Rahmat, siz yozildingiz!» xabari chiqsin, savol bosilganda javob ochilsin", 'при нажатии на кнопку появляется сообщение «Спасибо, ты записан!», при нажатии на вопрос открывается ответ', 'when the button is pressed, show the message “Thanks, you’re signed up!”, clicking a question opens its answer'),
    says: [
      L3("Bu safar qatorga boshqa narsa yozdik: tugma bosilganda «Rahmat» degan xabar chiqsin. Ana, sichqoncha tugmani bosdi, pastda esa xabar paydo bo'ldi! Endi odam yozilganini aniq biladi.", 'Пишем: при нажатии появляется сообщение «Спасибо». Смотри: нажала — и внизу появилось сообщение! Теперь человек знает, что записался.', 'We write: when pressed, show a thank-you message. Look: a click, and a message popped up at the bottom! Now people know they signed up.'),
      L3("Savollar ham bosilganda ochila oladi. Mana, sichqoncha savolni bosdi, ostidan uning javobi ochildi. Sahifa ortiqcha yozuvsiz, toza turadi, javob esa faqat kerak bo'lganda chiqadi.", 'Вопросы тоже могут открываться по нажатию. Смотри: нажала на вопрос — открылся ответ. Страница остаётся чистой, а ответ появляется, когда нужен.', 'Questions can open on click too. Look: a click on the question, and its answer opened. The page stays tidy, and the answer shows up when it’s needed.')
    ],
    done: L3("Demak, odam bosganda sayt jim turmasligi kerak: yo xabar chiqarsin, yo biror narsani ochsin. Shunda odam hammasi ishlaganini biladi.", 'Значит, при нажатии сайт должен отвечать: показать сообщение или что-то открыть. Тогда человек знает, что всё сработало.', 'So on click the site should answer: show a message or open something. Then people know it worked.'),
    asks: [L3("Qarang: bosildi, lekin javob yo'q", 'Смотри: нажали, а ответа нет', 'Watch: clicked, but no answer'), L3('Qarang: «Rahmat» xabari', 'Смотри: сообщение «Спасибо»', 'Watch: the thank-you message'),
      L3('Qarang: savol ochiladi', 'Смотри: вопрос раскрывается', 'Watch: the question opens')],
    askDone: L3('Bosilganda sayt javob beradi', 'При нажатии сайт отвечает', 'The site answers on click')
  },
  s6: {
    eyebrow: L3('Bosilganda', 'При нажатии', 'On click'),
    card: { h: BUY, t: L3("Kitob do'koni: tugma bosilganda «Savatga qo'shildi» degan xabar chiqsin. Shunda mijoz kitob qo'shilganini biladi.", 'Книжный магазин: при нажатии на кнопку пусть появляется сообщение «Добавлено в корзину». Тогда покупатель знает, что книга добавлена.', 'Book shop: when the button is pressed, show the message “Added to the cart”. Then customers know the book was added.') },
    say: L3("Kitob do'konidan ham buyurtma keldi. Ularning mijozlari tugmani bosadi-yu, kitob qo'shildimi yoki yo'qmi, bilmay qolyapti. Buyurtmani o'qing-da, «Qanday ishlaydi?» qatoriga yozing.",
      'Теперь ты. Покупатели книжного жмут кнопку и не понимают, добавилась книга или нет. Прочитай заказ и напиши в «Как ведёт себя?».',
      'Your turn. Book shop customers press the button and can’t tell if the book was added. Read the request and write in “How it behaves?”.'),
    what: L3("Kitob do'koni sayti", 'Сайт книжного магазина', 'A book shop site'),
    why: L3('odamlar kitob buyurtma qilsin', 'чтобы люди заказывали книги', 'get people to order books'),
    who: L3("kitob o'qishni yaxshi ko'radigan o'smirlar", 'подростки, которые любят читать', 'teens who love reading'),
    inside: L3('narxlar, sharhlar, aloqa', 'цены, отзывы, контакты', 'prices, reviews, contact'),
    look: L3('sokin, binafsha va oq', 'спокойный, фиолетовый и белый', 'calm, purple and white'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noClick: L3("Tugma qachon ishlashi aytilmadi. Buyurtmada esa aniq yozilgan: tugma bosilganda.", 'Когда? В заказе: при нажатии на кнопку.', 'When? The request says: when the button is pressed.'),
      hover: L3("Bunisi sichqoncha ustiga kelganda ishlaydi-ku. Buyurtmada esa bosilgandagi harakat so'ralgan.", 'Это сработает при наведении. А в заказе — при нажатии.', 'That works on hover. The request says: on click.'),
      noMsg: L3("Tugma bosildi, keyin-chi? Buyurtmaga qarang: xabar chiqishi kerak.", 'Что происходит при нажатии? В заказе: появляется сообщение.', 'What happens on click? The request says: show a message.')
    },
    hints: [
      L3("Bu safar buyurtmada qachon ishlashi ham, nima bo'lishi ham yozilgan: tugma bosilganda xabar chiqadi.", 'В заказе: когда (при нажатии) и что происходит (появляется сообщение).', 'The request has: when (on click) and what happens (a message appears).'),
      L3("Qatorga shunday yozish mumkin: tugma bosilganda «Savatga qo'shildi» xabari chiqsin.", 'При нажатии на кнопку появляется сообщение «Добавлено в корзину».', 'When the button is pressed, show the message “Added to the cart”.'),
      L3("Tayyor qatorni namunada ko'rasiz. Uni oltinchi qatorga yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugma bosilganda «Savatga qo'shildi» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Добавлено в корзину»', 'when the button is pressed, show the message “Added to the cart”'),
    ok: L3("Ajoyib! Sichqoncha bosishi bilan «Savatga qo'shildi» degan xabar chiqdi. Endi mijoz kitob qo'shilganini aniq biladi!", 'Класс! Нажали — и появилось «Добавлено в корзину». Теперь покупатель точно знает, что книга добавлена!', 'Great! A click, and “Added to the cart” appeared. Now customers know for sure the book was added!'),
    ask: L3("Bosilganda nima bo'lishini yozing", 'Напиши, что происходит при нажатии', 'Write what happens on click')
  },
  s7: {
    eyebrow: L3('Qachon ishladi?', 'Когда сработало?', 'When did it work?'),
    say: L3("Endi «qachon?» savoliga javob qidiramiz. Kartochkada saytda nima bo'lgani yozilgan. O'qing-da, tanlang: bu harakat qachon ishlagan?", 'Теперь найдём «когда?». Я рассказываю, что случилось на сайте, а ты выбираешь: когда это сработало?', 'Now let’s find the “when?”. I tell you what happened on the site, and you choose: when did it work?'),
    card: L3('Saytda', 'На сайте', 'On the site'),
    ask: L3('Qachon ishladi?', 'Когда сработало?', 'When did it work?'),
    hint1: L3("Odam aynan nima qildi-chi? Sichqonchani olib keldimi, bosdimi yoki saytni endigina ochdimi?", 'Что сделал человек: навёл мышь, нажал или только открыл сайт?', 'What did the person do: move the mouse over, click, or just open the site?'),
    hint2: L3("Odam faqat sichqonchani olib kelsa, bu ustiga kelganda bo'ladi, bossa, bosilganda. Hech narsa qilmasa-yu, sayt o'zi o'zgarsa, sahifa ochilganda. Ekran kichkina bo'lsa, telefonda.", 'Только навёл — при наведении. Нажал — при нажатии. Ничего не делал — при открытии страницы. Маленький экран — на телефоне.', 'Only moved over: on hover. Pressed: on click. Did nothing: when the page opens. A small screen: on a phone.'),
    items: [
      { t: L3("Odam kartochkaga sichqonchani olib keldi, hali bosmadi. Kartochka ko'tarildi.", 'Человек навёл мышь на карточку, но ещё не нажал. Карточка приподнялась.', 'Someone moved the mouse over a card but didn’t click. The card lifted up.'), opts: ['hover', 'click', 'load'], right: 'hover',
        why: L3("Odam hali bosmadi, sichqonchani faqat ustiga olib keldi, xolos. Bunday paytni «ustiga kelganda» deymiz.", 'Не нажимал, только навёл. Это при наведении.', 'No click, just moved over. That’s on hover.') },
      { t: L3("Odam «Yuborish» ni bosdi va «Rahmat!» chiqdi.", 'Человек нажал «Отправить», и появилось «Спасибо!».', 'Someone pressed “Send” and “Thank you!” appeared.'), opts: ['load', 'click', 'phone'], right: 'click',
        why: L3("«Rahmat!» yozuvi odam bosgandan keyingina chiqdi. Bu esa «bosilganda» bo'ladi.", 'Появилось после нажатия. Это при нажатии.', 'It appeared after the press. That’s on click.') },
      { t: L3("Saytga kirishingiz bilan bloklar bittalab paydo bo'ldi.", 'Как только открыл сайт, блоки появились по очереди.', 'As soon as you opened the site, the blocks appeared one by one.'), opts: ['click', 'hover', 'load'], right: 'load',
        why: L3("Odam hech narsani bosmadi, sahifa shunchaki ochildi, xolos. Bloklar aynan shu payt, sahifa ochilganda chiqdi.", 'Ничего не нажимали, страница просто открылась. Это при открытии страницы.', 'Nothing was pressed, the page just opened. That’s when the page opens.') },
      { t: L3("Kichkina ekranda menyu uch chiziqli tugmaga yig'ildi.", 'На маленьком экране меню свернулось в кнопку с тремя полосками.', 'On a small screen the menu folded into a three-line button.'), opts: ['phone', 'hover', 'load'], right: 'phone',
        why: L3("Kichkina ekran telefonda bo'ladi-ku. Menyu ham aynan telefonda shunday yig'iladi.", 'Маленький экран — значит, телефон. Это на телефоне.', 'A small screen means a phone. That’s on a phone.') },
      { t: L3("Savolni bosdingiz va uning javobi ochildi.", 'Ты нажал на вопрос, и открылся ответ.', 'You clicked a question and its answer opened.'), opts: ['hover', 'click', 'phone'], right: 'click',
        why: L3("Javob faqat savolni bosganingizdan keyin ochildi-ku. Bu yana o'sha «bosilganda» bo'ladi.", 'Нажал — и открылось. Это при нажатии.', 'You clicked, then it opened. That’s on click.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Endi har bir harakat qachon ishlashini bir qarashda topasiz!", 'Класс! Ты находишь, когда срабатывает каждое поведение.', 'Great! You can tell when each behaviour works.')
  },
  s8: {
    eyebrow: L3('Sahifa ochilganda', 'При открытии страницы', 'When the page opens'),
    help: [
      L3("Sahifa ochilayotgan paytni kuzating-chi: sarlavha bilan bloklar qanday chiqib kelyapti?", 'Посмотри на момент открытия страницы: как появляются заголовок и блоки?', 'Watch the moment the page opens: how do the heading and blocks appear?'),
      L3("Bunday silliq harakatni animatsiya deyishadi. U ko'zni kerakli joyga boshlab boradi: oldin sarlavhaga, keyin bloklarga, oxirida tugmaga.", 'Анимация — это плавное движение. Она ведёт взгляд: сначала заголовок, потом блоки, потом кнопка.', 'Animation means smooth movement. It guides the eyes: first the heading, then the blocks, then the button.'),
      L3("Teatrda parda birdan emas, asta-sekin ochiladi-ku. Sayt ham animatsiya bilan xuddi shunday ochilsa, ko'zga yoqimli bo'ladi.", 'В театре занавес открывается медленно, а не рывком. Если сайт открывается так же — это приятно.', 'In a theatre the curtain opens slowly, not all at once. When a site opens like that, it feels nice.')
    ],
    say: L3("Uchinchi holat esa sahifa ochilgan payt. Hozir qarang: sayt bir zumda, birdaniga paydo bo'ldi, hech qanday harakat yo'q. Buni qanday chiroyli qilsa bo'larkin?", 'Третий случай — при открытии страницы. Смотри, сейчас сайт появляется весь сразу, в одно мгновение. Никакого движения.', 'The third case is when the page opens. Look, right now the site appears all at once, in an instant. No movement at all.'),
    what: L3('Musiqa festivali sayti', 'Сайт музыкального фестиваля', 'A music festival site'),
    why: L3('yoshlar festivalga kelsin', 'чтобы молодёжь пришла на фестиваль', 'get young people to come to the festival'),
    who: L3('14–18 yoshli yoshlar', 'молодёжь 14–18 лет', 'young people aged 14–18'),
    inside: L3('rasmlar, jadval, narxlar', 'фото, расписание, цены', 'photos, schedule, prices'),
    look: L3('zamonaviy, binafsha va pushti', 'современный, фиолетовый и розовый', 'modern, purple and pink'),
    l1: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются по очереди', 'when the page opens, blocks fade in one by one'),
    l2: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin, sarlavha tepadan sirpanib tushsin", 'при открытии страницы блоки плавно появляются по очереди, заголовок выезжает сверху', 'when the page opens, blocks fade in one by one, the title slides in from the top'),
    l3: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin, sarlavha tepadan sirpanib tushsin, asosiy tugma lipillab tursin", 'при открытии страницы блоки плавно появляются по очереди, заголовок выезжает сверху, главная кнопка мигает', 'when the page opens, blocks fade in one by one, the title slides in from the top, the main button pulses'),
    says: [
      L3("Oltinchi qatorga shunday yozdik: sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin. Ko'ryapsizmi? Oldin sarlavha chiqdi, keyin matn, undan keyin bloklar. Ko'z ham ularning ortidan o'zi kerakli joyga boryapti.", 'Пишем: при открытии страницы блоки плавно появляются по очереди. Смотри: сначала заголовок, потом текст, потом блоки. Взгляд сам идёт куда нужно.', 'We write: when the page opens, blocks fade in one by one. Look: first the heading, then the text, then the blocks. The eyes go where they should.'),
      L3("Endi sarlavha tepadan sirpanib tushsin, deb qo'shdik. Ana, u xuddi sahnaga chiqqan qo'shiqchidek hammadan oldin kirib keldi.", 'Заголовок выезжает сверху. Он выходит первым, как певец на сцену.', 'The title slides in from the top. It arrives first, like a singer coming on stage.'),
      L3("Oxirida asosiy tugmaga lipillab tursin, dedik. Endi u doim «Meni bosing!» deb chaqirib turadi. Lekin faqat bitta tugma lipillaydi, hammasi emas!", 'Главная кнопка мигает. Теперь она всё время зовёт: «нажми меня». Но только одна кнопка, а не всё подряд!', 'The main button pulses. Now it keeps calling “press me”. But only one button, not everything!')
    ],
    done: L3("Sezdingizmi? Sahifa ochilganda ham sayt jim turmaydi: bloklar silliq chiqadi, asosiy tugma esa odamni chaqiradi. Bunday harakat animatsiya deyiladi, ya'ni silliq harakat degani.", 'Значит, и при открытии страницы сайт работает: блоки появляются плавно, главная кнопка зовёт. Это анимация — плавное движение.', 'So the site works when the page opens too: blocks appear smoothly, and the main button calls. That’s animation, smooth movement.'),
    asks: [L3('Qarang: sayt birdan chiqadi', 'Смотри: сайт появляется сразу', 'Watch: the site appears at once'), L3('Qarang: birin-ketin', 'Смотри: по очереди', 'Watch: one by one'),
      L3('Qarang: sarlavha sirpanadi', 'Смотри: заголовок выезжает', 'Watch: the title slides in'), L3('Qarang: tugma lipillaydi', 'Смотри: кнопка мигает', 'Watch: the button pulses')],
    askDone: L3('Ochilganda sayt silliq chiqadi', 'При открытии сайт появляется плавно', 'The site appears smoothly when it opens')
  },
  s9: {
    eyebrow: L3('Sahifa ochilganda', 'При открытии страницы', 'When the page opens'),
    card: { h: BUY, t: L3("Rasm ko'rgazmasi: saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin, xuddi ko'rgazmada chiroqlar yonganday.", 'Выставка рисунков: при открытии сайта картинки плавно появляются по очереди, как будто на выставке зажигается свет.', 'Art exhibition: when the site opens, the pictures fade in one by one, as if the lights were coming on at the show.') },
    say: L3("Navbatdagi buyurtma rasm ko'rgazmasidan. Ular sayt ochilgan paytning o'zi o'zgacha bo'lishini xohlashyapti. Buyurtmani o'qing-chi, keyin «Qanday ishlaydi?» qatoriga yozing.",
      'Теперь ты. Выставка рисунков попросила сайт. Они хотят, чтобы открытие сайта было особенным. Прочитай заказ и напиши в «Как ведёт себя?».',
      'Your turn. An art exhibition asked for a site. They want the site’s opening to be special. Read the request and write in “How it behaves?”.'),
    what: L3("Rasm ko'rgazmasi sayti", 'Сайт выставки рисунков', 'An art exhibition site'),
    why: L3("odamlar ko'rgazmaga kelsin", 'чтобы люди пришли на выставку', 'get people to come to the exhibition'),
    who: L3("san'atni yaxshi ko'radigan oilalar", 'семьи, которые любят искусство', 'families who love art'),
    inside: L3('rasmlar, jadval, aloqa', 'картины, расписание, контакты', 'pictures, schedule, contact'),
    look: L3('minimalist, qora va oq', 'минимализм, чёрный и белый', 'minimal, black and white'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noLoad: L3("Qachon bo'lishi-chi? Buyurtmada «saytga kirganda» deyilgan, bu sahifa ochilgan payt bo'ladi.", 'Когда? В заказе: при открытии сайта, то есть при открытии страницы.', 'When? The request says: when the site opens, that is, when the page opens.'),
      noFx: L3("Rasmlar qanday paydo bo'lishi kerak? Buyurtmada aytilgan: birin-ketin va silliq.", 'Как появляются? В заказе: плавно, по очереди.', 'How should they appear? The request says: smoothly, one by one.')
    },
    hints: [
      L3("Uchala javob ham buyurtmaning o'zida turibdi: qachon chiqishi, nima chiqishi va qanday chiqishi.", 'В заказе: когда (при открытии сайта), что (картинки) и как (плавно, по очереди).', 'The request has: when (the site opens), what (the pictures) and how (smoothly, one by one).'),
      L3("Masalan, shunday yozing: saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin.", 'При открытии страницы картинки плавно появляются по очереди.', 'When the page opens, the pictures fade in one by one.'),
      L3("Endi namunani o'qing-da, xuddi shunday yozing. Keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin", 'при открытии страницы картинки плавно появляются по очереди', 'when the page opens, pictures fade in one by one'),
    ok: L3("Qoyil! Rasmlar bittalab, silliq chiqib kelyapti, go'yo ko'rgazma zalida chiroqlar yonayotganday!", 'Класс! Картинки появились по очереди, плавно. Как будто на выставке зажёгся свет!', 'Great! The pictures appeared one by one, smoothly. Just like the lights coming on at the show!'),
    ask: L3('Ochilgandagi harakatni yozing', 'Опиши, что происходит при открытии', 'Describe what happens when it opens')
  },
  s10: {
    eyebrow: L3('Telefonda', 'На телефоне', 'On a phone'),
    help: [
      L3("Oynaning eniga qarang-chi, keyin saytning menyusiga ham. Oyna torayganda menyu qayoqqa ketyapti?", 'Посмотри на ширину окна и на меню сайта.', 'Look at the window width and at the site’s menu.'),
      L3("Bunday sayt moslashuvchan sayt deyiladi, ya'ni telefon ekraniga moslasha oladigan sayt degani. Unda menyu uch chiziqli tugmaga yig'iladi, kerakli tugma esa doim qo'l ostida turadi.", 'Адаптивный сайт подстраивается под экран телефона: меню сворачивается в кнопку с тремя полосками, нужная кнопка всегда под рукой.', 'A responsive site adapts to a phone screen: the menu folds into a three-line button, and the key button is always at hand.'),
      L3("Kiyimni ham har kimning bo'yiga moslab tikishadi-ku, aks holda u yo tor, yo keng keladi. Moslashuvchan sayt ham har bir ekranga xuddi shunday mos keladi.", 'Одежду шьют по росту. Пусть и сайт подходит каждому экрану.', 'Clothes are made to fit. Let a site fit every screen too.')
    ],
    say: L3("To'rtinchi holat telefonda bo'ladi. Hozircha sayt kompyuterda ochilgan: menyu tepada turibdi, tugma esa sichqoncha kelganda rangini o'zgartiryapti. Lekin ko'pchilik saytni telefondan ochadi-ku!", 'Четвёртый случай — на телефоне. Сейчас сайт на компьютере. Меню наверху, кнопка меняет цвет при наведении. Но многие открывают сайт с телефона.', 'The fourth case is on a phone. Right now the site is on a computer. The menu is at the top, and the button changes colour on hover. But lots of people open sites on a phone.'),
    what: L3('Robot kursi sayti', 'Сайт курса роботов', 'A robot course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'),
    inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'),
    look: L3('zamonaviy, yashil va oq', 'современный, зелёный и белый', 'modern, green and white'),
    p0: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении мыши', 'the button changes colour when the mouse is over it'),
    p2: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin, telefonda menyu ☰ tugmasiga yig'ilsin", 'кнопка меняет цвет при наведении мыши, на телефоне меню сворачивается в кнопку ☰', 'the button changes colour when the mouse is over it, on a phone the menu collapses into a ☰ button'),
    p3: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin, telefonda menyu ☰ tugmasiga yig'ilsin, telefonda yozilish tugmasi pastda doim ko'rinib tursin", 'кнопка меняет цвет при наведении мыши, на телефоне меню сворачивается в кнопку ☰, на телефоне кнопка записи всегда видна внизу', 'the button changes colour when the mouse is over it, on a phone the menu collapses into a ☰ button, on a phone the sign-up button always stays at the bottom'),
    says: [
      L3("Endi shu saytni telefonda ochdik, oyna ham torayib qoldi. Voy, menyu qayoqqa ketdi? Endi jadval bilan narxlarga qanday o'tamiz?", 'Теперь откроем этот сайт на телефоне. Окно стало узким. Ой, меню пропало! Как попасть в расписание и цены?', 'Now let’s open the site on a phone. The window got narrow. Oops, the menu is gone! How do we get to the schedule and prices?'),
      L3("Shuning uchun qatorga qo'shdik: telefonda menyu uch chiziqli tugmaga yig'ilsin. Qarang, tepada shunday tugma paydo bo'ldi! Barmoq uni bosishi bilan menyu ochilib ketdi.", 'Пишем: на телефоне меню сворачивается в кнопку с тремя полосками. Смотри: наверху появилась такая кнопка. Палец нажал — и меню открылось!', 'We write: on a phone the menu folds into a three-line button. Look: that button appeared at the top. A finger tapped it, and the menu opened!'),
      L3("Yana bitta qism qo'shdik: yozilish tugmasi doim pastda tursin. Endi sahifani qancha pastga tushirsangiz ham, barmog'ingiz uni darrov topadi.", 'А кнопка записи пусть всегда будет внизу. Как бы далеко ни листал страницу, палец сразу её находит.', 'And let the sign-up button always stay at the bottom. However far you scroll, your finger finds it at once.')
    ],
    done: L3("Demak, telefonda sayt boshqacha ishlaydi, chunki u yerda sichqoncha yo'q, ekran ham tor. Shuning uchun promptga telefonda nima bo'lishini ham alohida yozamiz.", 'Значит, на телефоне сайт ведёт себя иначе: мыши нет, экран узкий. Поэтому пишем и то, что происходит на телефоне.', 'So on a phone a site behaves differently: there’s no mouse and the screen is narrow. That’s why we also write what happens on a phone.'),
    asks: [L3('Qarang: kompyuterda', 'Смотри: на компьютере', 'Watch: on a computer'), L3("Qarang: telefonda menyu yo'q", 'Смотри: на телефоне меню нет', 'Watch: no menu on the phone'),
      L3('Qarang: menyu ☰ tugmada', 'Смотри: меню в кнопке ☰', 'Watch: the menu is in the ☰ button'), L3('Qarang: tugma pastda', 'Смотри: кнопка внизу', 'Watch: the button at the bottom')],
    askDone: L3('Telefonda ham sayt qulay', 'И на телефоне сайт удобный', 'The site is easy to use on a phone too')
  },
  s11: {
    eyebrow: L3('Telefonda', 'На телефоне', 'On a phone'),
    card: { h: BUY, t: L3("Lager: ota-onalar saytni ko'pincha telefondan ochadi. Telefonda menyu ☰ tugmasiga yig'ilsin.", 'Лагерь: родители чаще открывают сайт с телефона. Пусть на телефоне меню сворачивается в кнопку ☰.', 'Camp: parents usually open the site on a phone. On a phone, let the menu collapse into a ☰ button.') },
    say: L3("Yozgi lagerning saytida ham shu muammo bor ekan: telefonda menyu yo'qolib qolyapti. Buyurtmani o'qing-da, telefonda nima bo'lishini yozing.",
      'Теперь ты. На сайте лагеря меню на телефоне пропадает. Прочитай заказ и напиши, что происходит на телефоне.',
      'Your turn. On the camp site the menu disappears on a phone. Read the request and write what happens on a phone.'),
    what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'),
    why: L3('bolalar lagerga yozilsin', 'чтобы дети записывались в лагерь', 'get kids to sign up for the camp'),
    who: L3('10–14 yoshli bolalar va ularning ota-onalari', 'дети 10–14 лет и их родители', 'kids aged 10–14 and their parents'),
    inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3('quvnoq, yashil va sariq', 'весёлый, зелёный и жёлтый', 'playful, green and yellow'),
    ph: L3("qayerda? nima? nima bo'ladi?", 'где? что? что происходит?', 'where? what? what happens?'),
    msgs: {
      noPhone: L3("Bu harakat qayerda bo'lishi kerak? Buyurtmada gap telefon haqida ketyapti-ku.", 'Где? В заказе: на телефоне.', 'Where? The request says: on a phone.'),
      noMenu: L3("Telefonda nima bo'lishi kerak? Buyurtmada menyu uch chiziqli tugmaga yig'ilsin, deyilgan.", 'Что происходит на телефоне? В заказе: меню сворачивается в кнопку ☰.', 'What happens on a phone? The request says: the menu collapses into a ☰ button.')
    },
    hints: [
      L3("Buyurtmaga yana bir qarang: gap telefon haqida, u yerda menyu uch chiziqli tugmaga yig'ilishi kerak.", 'В заказе: где (на телефоне), что (меню) и что происходит (сворачивается в кнопку).', 'The request has: where (on a phone), what (the menu) and what happens (it folds into a button).'),
      L3("Qatorga shunday deb yozsa bo'ladi: telefonda menyu uch chiziqli tugmaga yig'ilsin.", 'На телефоне меню сворачивается в кнопку ☰.', 'On a phone the menu collapses into a ☰ button.'),
      L3("Kerakli so'zlar namunada turibdi. Ularni qatorga ko'chirib yozing-da, yuboring.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("telefonda menyu ☰ tugmasiga yig'ilsin", 'на телефоне меню сворачивается в кнопку ☰', 'on a phone the menu collapses into a ☰ button'),
    ok: L3("Zo'r chiqdi! Telefonda menyu uch chiziqli tugmaga yig'ildi, barmoq bosishi bilan ochilib ham ketdi. Endi ota-onalar kerakli narsani bemalol topishadi!", 'Огонь! На телефоне меню свернулось в кнопку с тремя полосками. Нажали — открылось. Родители всё найдут!', 'Awesome! On a phone the menu folded into a three-line button. A tap, and it opened. Parents will find everything!'),
    ask: L3("Telefonda nima bo'lishini yozing", 'Напиши, что происходит на телефоне', 'Write what happens on a phone')
  },
  g1: {
    eyebrow: L3('Qachon?', 'Когда?', 'When?'),
    card: { h: BUY, t: L3("Murabbiy: «Tugma doim katta bo'lib turmasin. Faqat sichqoncha ustiga kelganda kattalashsin.»", 'Тренер: «Пусть кнопка не будет всё время огромной. Пусть растёт только при наведении мыши».', 'The coach: “The button shouldn’t be huge all the time. It should only grow when the mouse is over it.”') },
    say: L3("Futbol klubimizning saytiga men «tugma kattalashsin» deb yozgandim. Qarang-chi, tugma doim katta bo'lib qolibdi! Sichqoncha ustiga keldi, lekin hech narsa o'zgarmadi. «Qachon?» degan savolni yozishni unutibman-da. Murabbiy nima deyapti, o'qing-chi? Keyin qatorimni tuzatib bering.",
      'Я написал для сайта клуба «кнопка увеличивается». Смотри, кнопка просто всё время огромная! Мышь навелась, но ничего не изменилось. Я не написал «когда?». Что говорит тренер? Исправь мою строку.',
      'I wrote “the button grows” for the club site. Look, the button is just huge all the time! The mouse came over, but nothing changed. I didn’t write “when?”. What does the coach say? Fix my line.'),
    what: L3('Futbol klubimiz sayti', 'Сайт нашего футбольного клуба', 'Our football club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("futbolni yaxshi ko'radigan 10–12 yoshli bolalar", 'дети 10–12 лет, которые любят футбол', 'kids aged 10–12 who love football'),
    inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    look: L3('zamonaviy, yashil va oq', 'современный, зелёный и белый', 'modern, green and white'),
    bad: L3('tugma kattalashsin', 'кнопка увеличивается', 'the button grows'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      still: L3("Tugma hali ham doim katta bo'lib turibdi. Qatorga «qachon?» savolining javobini qo'shing: sichqoncha ustiga kelganda.", 'Кнопка всё ещё всегда огромная. Добавь «когда?»: при наведении мыши.', 'The button is still huge all the time. Add the “when?”: when the mouse is over it.'),
      noGrow: L3("Sichqoncha ustiga kelganda tugma nima qilsin? Murabbiy «kattalashsin», deyapti.", 'Что происходит при наведении? Тренер: кнопка увеличивается.', 'What happens on hover? The coach says: it grows.')
    },
    hints: [
      L3("Mening qatorimni o'qing-chi: unda «qachon?» savolining javobi yo'q.", 'В строке Коди нет «когда?».', 'Kodi’s line has no “when?”.'),
      L3("Qatorga shu so'zlarni qo'shing: tugma ustiga sichqoncha kelganda.", 'Добавь: при наведении мыши на кнопку.', 'Add: when the mouse is over the button.'),
      L3("Qatorimni namunadagidek tuzating-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('tugma ustiga sichqoncha kelganda kattalashsin', 'кнопка увеличивается при наведении мыши', 'the button grows when the mouse is over it'),
    ok: L3("Rahmat, qatorimni tuzatdingiz! Endi tugma oddiy turadi, sichqoncha kelgandagina kattalashadi. Ko'rdingizmi, «qachon?» qanchalik muhim ekan!", 'Огонь! Теперь кнопка обычная, а при наведении мыши растёт. «Когда?» очень важно!', 'Awesome! Now the button is normal and only grows on hover. The “when?” really matters!'),
    ask: L3("«Qachon?»ni qo'shing", 'Добавь «когда?»', 'Add the “when?”')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi biroz detektivlik qilamiz! Sichqoncha saytda nima qilayotganini, sayt esa unga qanday javob berayotganini kuzating. Xo'sh, bunday saytni qaysi «Qanday ishlaydi?» qatori bergan ekan?", 'Теперь побудем детективами. Смотри на мышь и на сайт. Какое «Как ведёт себя?» дало такой сайт?', 'Let’s be detectives. Watch the mouse and the site. Which “How it behaves?” gave this site?'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3("Qaysi «Qanday ishlaydi?» shu saytni berdi?", 'Какое «Как ведёт себя?» дало этот сайт?', 'Which “How it behaves?” gave this site?'),
    hint1: L3("Saytga yaxshilab qarang-chi: sichqoncha nima qildi-yu, sayt unga nima qildi?", 'Смотри на сайт: что сделала мышь и что сделал сайт?', 'Watch the site: what did the mouse do, and what did the site do?'),
    hint2: L3("Sayt nimaga javob beryapti, shunga qarang: sichqonchaning kelishigami, bosishigami, sahifaning ochilishigami yoki tor oynagami?", 'Только навели — при наведении. Нажали — при нажатии. Появилось само — при открытии страницы. Узкое окно — на телефоне.', 'Only moved over: on hover. Clicked: on click. Appeared by itself: when the page opens. A narrow window: on a phone.'),
    items: [
      { beh: L3("tugma bosilganda «Rahmat!» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Спасибо!»', 'when the button is pressed, show the message “Thank you!”'),
        a: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'), b: L3("tugma bosilganda «Rahmat!» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Спасибо!»', 'when the button is pressed, show the message “Thank you!”'),
        c: L3("sahifa ochilganda bloklar silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются', 'when the page opens, blocks fade in'),
        right: 'b', why: L3("Sichqoncha tugmani bosgandan keyingina «Rahmat!» xabari chiqdi. Bu B qatoridagi harakat.", 'Мышь нажала — и появилось «Спасибо!». Это B.', 'The mouse clicked and “Thank you!” appeared. That’s B.') },
      { beh: L3("kartochkalar ustiga kelganda ko'tarilsin", 'карточки приподнимаются при наведении', 'cards lift up on hover'),
        a: L3("kartochkalar ustiga kelganda ko'tarilsin", 'карточки приподнимаются при наведении', 'cards lift up on hover'), b: L3("kartochkalar sahifa ochilganda paydo bo'lsin", 'карточки появляются при открытии страницы', 'cards appear when the page opens'),
        c: L3('tugma lipillab tursin', 'кнопка мигает', 'the button pulses'),
        right: 'a', why: L3("Sichqoncha kartochkani bosmadi ham, faqat ustiga keldi, kartochka esa ko'tarildi. Buni A qatori so'ragan.", 'Мышь навелась — карточка приподнялась, даже без нажатия. Это A.', 'The mouse came over and the card lifted, without a click. That’s A.') },
      { beh: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются по очереди', 'when the page opens, blocks fade in one by one'),
        a: L3("tugma bosilganda xabar chiqsin", 'при нажатии на кнопку появляется сообщение', 'when the button is pressed, show a message'), b: L3('kartochkalar ustiga kelganda kattalashsin', 'карточки увеличиваются при наведении', 'cards grow on hover'),
        c: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются по очереди', 'when the page opens, blocks fade in one by one'),
        right: 'c', why: L3("Hech kim hech narsani bosmadi, bloklar esa o'zi bittalab chiqib keldi. Bunday harakat C qatorida yozilgan.", 'Ничего не нажимали, блоки сами появились по очереди. Это C.', 'Nothing was pressed, the blocks appeared one by one by themselves. That’s C.') },
      { beh: L3("telefonda menyu ☰ tugmasiga yig'ilsin", 'на телефоне меню сворачивается в кнопку ☰', 'on a phone the menu collapses into a ☰ button'),
        a: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'), b: L3("telefonda menyu ☰ tugmasiga yig'ilsin", 'на телефоне меню сворачивается в кнопку ☰', 'on a phone the menu collapses into a ☰ button'),
        c: L3('savol bosilganda javob ochilsin', 'при нажатии на вопрос открывается ответ', 'clicking a question opens its answer'),
        right: 'b', why: L3("Oyna telefonnikidek tor, menyu esa uch chiziqli tugmaga yig'ilib olgan. Buni B qatori qilgan.", 'Окно узкое, как телефон, а меню — в кнопке с тремя полосками. Это B.', 'The window is narrow like a phone, and the menu is in the three-line button. That’s B.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("Haqiqiy detektiv bo'ldingiz! Endi saytga bir qarashda qaysi qator ishlaganini topa olasiz.", 'Класс! По сайту ты находишь, какая строка сработала.', 'Great! You can tell from the site which line did the work.')
  },
  s12: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: L3('Mijozlar', 'Посетители', 'Customers'), t: L3("Hech narsa sakramasin va aylanmasin. Tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin.", 'Пусть ничего не прыгает и не крутится. Кнопка меняет цвет при наведении, а при нажатии появляется сообщение «Спасибо!».', 'Nothing should jump or spin. The button changes colour on hover, and when pressed shows the message “Thank you!”.') },
    say: L3("Endi kafening saytiga qaytamiz! Mijozlar nima xohlashlarini aniq yozib yuborishibdi. Mening «jonli va qiziqarli» qatorim o'rniga o'shalarni yozing-chi.",
      'Теперь починим сайт кафе! Посетители сказали, чего хотят. Вместо моего «живым и интересным» напиши точное поведение.',
      'Now let’s fix the cafe site! The customers said what they want. Instead of my “lively and fun”, write the exact behaviour.'),
    msgs: {
      vague: L3("Mening «jonli va qiziqarli» degan so'zlarim hali ham turibdi-ku. Ularni o'chirib, mijozlar aytgan aniq harakatlarni yozing.", '«Живым и интересным» всё ещё на месте. Напиши точное поведение, о котором просят посетители.', '“Lively and fun” is still there. Write the exact behaviour the customers asked for.'),
      noHover: L3("Sichqoncha tugma ustiga kelganda nima bo'lishi kerak? Mijozlar «rangi o'zgarsin», deyishgan.", 'Что происходит при наведении? Посетители: кнопка меняет цвет.', 'What happens on hover? The customers say: the colour changes.'),
      noClick: L3("Tugma bosilganda-chi? Mijozlar u yerda «Rahmat!» xabari chiqishini so'rashgan.", 'Что происходит при нажатии? Посетители: появляется «Спасибо!».', 'What happens on click? The customers say: show “Thank you!”.')
    },
    hints: [
      L3("Mijozlarning gapini o'qing-chi: ular ikkita holatni aytishgan, ustiga kelganda va bosilganda.", 'Посетители назвали два случая: при наведении и при нажатии.', 'The customers named two cases: on hover and on click.'),
      L3("Oldin «jonli va qiziqarli» degan so'zlarni o'chiring. O'rniga yozing: tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin.", 'Сотри «живым и интересным». Напиши: кнопка меняет цвет при наведении, при нажатии появляется «Спасибо!».', 'Delete “lively and fun”. Write: the button changes colour on hover, and when pressed shows “Thank you!”.'),
      L3("Mijozlar so'ragan qator namunada tayyor. Uni yozing va «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin", 'кнопка меняет цвет при наведении, при нажатии появляется сообщение «Спасибо!»', 'the button changes colour on hover, and when pressed shows the message “Thank you!”'),
    ok: L3("Ana endi boshqa gap! Hech narsa sakramayapti, sichqoncha kelganda tugma rangini o'zgartiryapti, bosilganda esa «Rahmat!» chiqyapti. Mijozlar ham xursand!", 'Класс! Ничего не прыгает. При наведении кнопка меняет цвет, при нажатии появляется «Спасибо!». Посетители довольны!', 'Great! Nothing jumps. On hover the button changes colour, and on click “Thank you!” appears. The customers are happy!'),
    ask: L3("«Jonli va qiziqarli»ni tuzating", 'Исправь «живым и интересным»', 'Fix “lively and fun”')
  },
  s13: {
    eyebrow: L3("To'liq «Qanday ishlaydi?»", 'Всё поведение', 'The full behaviour'),
    card: { h: BUY, t: L3("Sport musobaqasi: tugma ustiga kelganda kattalashsin; savol bosilganda javob ochilsin; telefonda menyu ☰ tugmasiga yig'ilsin.", 'Спортивные соревнования: кнопка увеличивается при наведении; при нажатии на вопрос открывается ответ; на телефоне меню сворачивается в кнопку ☰.', 'Sports contest: the button grows on hover; clicking a question opens its answer; on a phone the menu collapses into a ☰ button.') },
    say: L3("Endi kattaroq ish: sport musobaqasi sayti uchun to'liq «Qanday ishlaydi?» qatorini yozasiz, unda uchta holat bo'ladi. Oldin buyurtmani diqqat bilan o'qib chiqing.", 'Теперь полное «Как ведёт себя?»: три случая. Прочитай заказ спортивных соревнований.', 'Now write the full “How it behaves?”: three cases. Read the sports contest’s request.'),
    what: L3('Sport musobaqasi sayti', 'Сайт спортивных соревнований', 'A sports contest site'),
    why: L3("o'quvchilar musobaqaga yozilsin", 'чтобы школьники записывались на соревнования', 'get students to sign up for the contest'),
    who: L3("11–14 yoshli o'quvchilar", 'школьники 11–14 лет', 'students aged 11–14'),
    inside: L3('jadval, savol-javob, aloqa', 'расписание, вопросы и ответы, контакты', 'schedule, FAQ, contact'),
    look: L3("zamonaviy, to'q sariq va oq", 'современный, оранжевый и белый', 'modern, orange and white'),
    ph: L3('uchta holatni yozing', 'напиши три случая', 'write the three cases'),
    msgs: {
      hover: L3("Buyurtmaga ko'ra, sichqoncha ustiga kelganda tugma kattalashishi kerak. Shu holatni ham yozing.", 'Что происходит при наведении? В заказе: кнопка увеличивается.', 'What happens on hover? The request says: the button grows.'),
      faq: L3("Savol bosilganda nima bo'lishi kerak? Buyurtmaga qarasangiz, uning javobi ochilishi kerak ekan.", 'Что происходит при нажатии на вопрос? В заказе: открывается ответ.', 'What happens when a question is clicked? The request says: its answer opens.'),
      phone: L3("Telefonda nima bo'lsin? Buyurtmada menyu uch chiziqli tugmaga yig'ilishi so'ralgan.", 'Что происходит на телефоне? В заказе: меню сворачивается в кнопку ☰.', 'What happens on a phone? The request says: the menu collapses into a ☰ button.')
    },
    hints: [
      L3("Bu buyurtmada uchta holat yashiringan: ustiga kelganda, bosilganda va telefonda.", 'В заказе три случая: при наведении, при нажатии и на телефоне.', 'The request has three cases: on hover, on click and on a phone.'),
      L3("Uchalasini vergul bilan ketma-ket yozing. Har birida qachon, nima va nima bo'lishi turishi kerak.", 'Напиши их через запятую: в каждом — когда, что и что происходит.', 'Write them one after another with commas: each with when, what and what happens.'),
      L3("Uchala holat namunada vergul bilan yozilgan. Xuddi shunday yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugma ustiga kelganda kattalashsin, savol bosilganda javob ochilsin, telefonda menyu ☰ tugmasiga yig'ilsin", 'кнопка увеличивается при наведении, при нажатии на вопрос открывается ответ, на телефоне меню сворачивается в кнопку ☰', 'the button grows on hover, clicking a question opens its answer, on a phone the menu collapses into a ☰ button'),
    ok: L3("Barakalla! Uchta holatga uchta javob yozdingiz. Endi sayt sichqonchaga ham, barmoqqa ham, telefonga ham javob qaytaradi!", 'Молодец! Три случая — три ответа. Сайт отвечает и мыши, и пальцу, и телефону!', 'Well done! Three cases, three answers. The site responds to the mouse, a finger and a phone!'),
    ask: L3('Uchta holatni yozing', 'Напиши три случая', 'Write the three cases')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Endi navbat sizga: o'zingiz xohlagan sayt uchun prompt yozasiz! Oltita qatorning hammasini o'zingiz to'ldiring. «Qanday ishlaydi?» qatoriga esa bir-ikkita holat kifoya: qachon, nima va nima bo'ladi.",
      'А теперь твой сайт! Напиши все шесть строк, а в «Как ведёт себя?» — один-два случая: когда, что и что происходит.',
      'Now your own site! Write all six lines, and in “How it behaves?” one or two cases: when, what and what happens.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    phLook: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    phBeh: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noWhat: L3("Oldin «Nima?» qatorini to'ldiring: qanday sayt yaratmoqchisiz?", 'Напиши строку «Что?»: какой сайт создаёшь?', 'Write the “What?” line: what site are you making?'),
      kind: L3("Bu hali faqat mavzu-ku. Aniq narsani yozing: masalan, klub, server, do'kon yoki bayram sayti.", 'Это только тема. Напиши конкретную вещь: сайт клуба, сервера, магазина или праздника.', 'That’s just a topic. Write a specific thing: a club, server, shop or party site.'),
      noWhy: L3("Endi «Nega?» qatoriga o'ting: bu sayt nima qilishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      goal: L3("Saytning maqsadi hali ko'rinmayapti. Odamlar nima qilsin: yozilsinmi, buyurtma qilsinmi yoki kelsinmi?", 'Напиши цель: чтобы записывались, заказывали или приходили?', 'Write the goal: should people sign up, order or come?'),
      noWho: L3("«Kim uchun?» qatori bo'sh qolibdi. Saytni kimlar ko'radi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      who: L3("Sun'iy intellekt sayt kimlar uchunligini tushunmadi. Ularning yoshini yoki kimligini yozing.", 'ИИ не понял, для кого. Напиши возраст или кто они.', 'The AI couldn’t tell who. Write their age or who they are.'),
      noIn: L3("«Ichida nima?» qatori qoldi: saytda qanaqa bloklar bo'ladi?", 'Теперь напиши строку «Что внутри?»: какие блоки на сайте?', 'Now write the “What’s inside?” line: which blocks?'),
      inNone: L3("«Ichida nima?» qatorida sun'iy intellekt bitta ham blok topmadi. Masalan, shunday yozing: rasmlar, narxlar, aloqa.", 'В «Что внутри?» не найдено блоков. Например: фото, цены, контакты.', 'No blocks found in “What’s inside?”. For example: photos, prices, contact.'),
      noLook: L3("«Ko'rinishi?» qatorini ham yozing: sayt qanaqa ko'rinishda bo'lsin?", 'Теперь напиши строку «Как выглядит?»: каким будет сайт?', 'Now write the “How it looks?” line: how should it look?'),
      look: L3("«Ko'rinishi?» qatoriga uslub bilan ranglarni yozing. Masalan: zamonaviy, ko'k va oq.", 'В «Как выглядит?» напиши стиль и цвета. Например: современный, синий и белый.', 'In “How it looks?” write a style and colours. For example: modern, blue and white.'),
      noBeh: L3("Oxirgi qator, «Qanday ishlaydi?» qoldi: qachon, nima va nima bo'ladi?", 'Теперь напиши строку «Как ведёт себя?»: когда, что и что происходит?', 'Now write the “How it behaves?” line: when, what and what happens?')
    },
    hints: [
      L3("Har bir qator o'z savoliga javob beradi: nima, nega, kim uchun, ichida nima, ko'rinishi va qanday ishlaydi.", 'Шесть вопросов: что, зачем, для кого, что внутри, как выглядит, как ведёт себя.', 'Six questions: what, why, who for, what’s inside, how it looks, how it behaves.'),
      L3("«Qanday ishlaydi?» qatoriga bir-ikkita holat yetadi. Masalan: tugma ustiga kelganda kattalashsin.", 'В «Как ведёт себя?» напиши один-два случая. Например: кнопка увеличивается при наведении.', 'In “How it behaves?” write one or two cases. For example: the button grows on hover.'),
      L3("Pastdagi namunada futbol klubining sayti bor. Siz ham o'z saytingiz uchun xuddi shunday oltita qator yozing-da, yuboring.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · 11–13 yoshli bolalar · rasmlar, jadval, aloqa · zamonaviy, yashil va oq · tugma ustiga kelganda kattalashsin, bosilganda «Rahmat!» chiqsin",
      'Сайт нашего футбольного клуба · чтобы ребята записывались · дети 11–13 лет · фото, расписание, контакты · современный, зелёный и белый · кнопка увеличивается при наведении, при нажатии появляется «Спасибо!»',
      'Our football club site · get kids to sign up · kids aged 11–13 · photos, schedule, contact · modern, green and white · the button grows on hover, and when pressed shows “Thank you!”'),
    ok: L3("Voy, zo'r chiqibdi! Mana, sizning olti qatorli promptingiz tayyor. Uyda uni haqiqiy sun'iy intellektga yuborib ko'rasiz.", 'Ого, классно! Это твой промпт из шести строк. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your six-line prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun oltita qatorni yozing", 'Напиши шесть строк для своего сайта', 'Write six lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Keling, o'rganganlarimizni tez bir tekshirib olamiz. Kartochkaga harakat haqida gaplar chiqadi: har birini o'qing-da, to'g'rimi yoki noto'g'rimi, tanlang.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Oldin o'ylab ko'ring-chi, bu gap nima haqida: «qachon?» haqidami, harakatning foydasi haqidami yoki «jonli» degan so'z haqidami?", 'О чём фраза: о «когда?», о пользе движения или о слове «живой»?', 'What’s it about: the “when?”, why movement helps, or the word “lively”?'),
    hint2: L3("Esingizdami? «Jonli» degan so'zni sun'iy intellekt o'zicha tushunadi, «qachon?» yozilmasa esa harakat umuman bo'lmaydi.", 'Вспомни: «живой» ИИ понимает по-своему, а без «когда?» поведения нет.', 'Remember: the AI interprets “lively” its own way, and without “when?” there’s no behaviour.'),
    items: [
      { t: L3("«Jonli bo'lsin» desangiz, sun'iy intellekt aniq nima qilishni biladi.", 'Если написать «пусть будет живым», ИИ точно знает, что делать.', 'If you write “make it lively”, the AI knows exactly what to do.'), right: false,
        why: L3("Sun'iy intellekt «jonli» so'zidan nima kerakligini o'zicha taxmin qiladi, kafening saytidagidek hammasini sakratib yuborishi ham mumkin.", 'На самом деле он гадает сам и может заставить прыгать всё подряд.', 'Actually it guesses on its own and might make everything jump.') },
      { t: L3("Yaxshi harakat odamga yordam beradi: tugma «meni bosing» deydi.", 'Хорошее движение помогает человеку: кнопка говорит «нажми меня».', 'Good movement helps people: the button says “press me”.'), right: true,
        why: L3("Bu gap rost: yaxshi harakat odamga qayerga qarash kerakligini ko'rsatib turadi.", 'Верно: движение показывает, куда смотреть.', 'Right: movement shows where to look.') },
      { t: L3("«Tugma kattalashsin» desangiz, u faqat sichqoncha kelganda kattalashadi.", 'Если написать «кнопка увеличивается», она растёт только при наведении мыши.', 'If you write “the button grows”, it only grows when the mouse is over it.'), right: false,
        why: L3("Unday bo'lmaydi: «qachon?» yozilmagani uchun tugma sichqonchani kutmaydi, doim katta bo'lib turaveradi.", 'Нет «когда?» — и кнопка просто всё время большая.', 'There’s no “when?”, so the button just stays big all the time.') },
      { t: L3("Telefonda sayt boshqacha ishlashi mumkin, buni ham yozish kerak.", 'На телефоне сайт может вести себя иначе, и это тоже нужно написать.', 'On a phone a site can behave differently, and you should write that too.'), right: true,
        why: L3("Haqiqatan ham shunday: telefonda sichqoncha yo'q, ekran esa tor.", 'Верно: на телефоне нет мыши, а экран узкий.', 'Right: a phone has no mouse, and the screen is narrow.') },
      { t: L3("Hamma narsa sakrab tursa, sayt eng qulay bo'ladi.", 'Если всё прыгает, сайт самый удобный.', 'If everything jumps, the site is easiest to use.'), right: false,
        why: L3("Aslida bunday saytda ko'z tez charchaydi, tugmani esa bosib bo'lmaydi.", 'На самом деле глаза устают, а кнопку не нажать.', 'Actually the eyes get tired and the button can’t be pressed.') }
    ],
    ok: L3("Beshala gapda ham adashmadingiz! Saytning harakatini endi aniq tasvirlay olasiz.", 'Всё верно! Ты правильно описываешь поведение сайта.', 'All correct! You describe a site’s behaviour the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Kafe mijozi «Boshim aylanib ketdi» deganida, men unga ishonmagandim. Sayt qancha ko'p qimirlasa, shuncha zo'r, deb o'ylardim. Kim o'ylabdi deysiz, mijoz haq chiqdi! Hamma narsa sakrasa, ko'z charchaydi, tugmani esa bosib bo'lmaydi. Yaxshi harakat esa odamga yordam beradi: tugma «Meni bosing!» deydi, bosilganda sayt javob beradi, telefonda menyu ham topiladi.",
        'Вернёмся к загадке. Я думал: чем больше движения, тем круче. Но когда прыгает всё, глаза устают, а кнопку не нажать! Хорошее движение помогает: кнопка говорит «нажми меня», после нажатия сайт отвечает, на телефоне меню находится. Я ошибся.',
        'Back to the riddle. I thought the more movement, the cooler. But when everything jumps, eyes get tired and the button can’t be pressed! Good movement helps: the button says “press me”, the site answers a click, and the menu is easy to find on a phone. I was wrong.'), k: 'riddle' },
      { text: L3("Ekranda sizning olti qatorli promptingiz turibdi, yonida esa shu promptdan chiqqan sayt.", 'Смотри, это твой промпт из шести строк и твой сайт.', 'Look, this is your six-line prompt and your site.'), k: 'own' },
      { text: L3("Nima, nega, kim uchun, ichida nima va ko'rinishi degan savollar sizga oldingi darslardan tanish.", '«Что», «зачем», «для кого», «что внутри» и «как выглядит» ты уже знаешь.', 'You already know what, why, who for, what’s inside and how it looks.'), k: 'what' },
      { text: L3("Bugun esa «Qanday ishlaydi?» savolini o'rgandik. Unga qachon, nima va nima bo'lishini yozamiz: ustiga kelganda, bosilganda, sahifa ochilganda va telefonda.", '«Как ведёт себя?» — это когда, что и что происходит: при наведении, при нажатии, при открытии страницы и на телефоне.', '“How it behaves?” is when, what and what happens: on hover, on click, when the page opens and on a phone.'), k: 'beh' },
      { text: L3("Uyda promptingizni nusxalab, haqiqiy sun'iy intellektga yuboring-chi, u qanaqa sayt yasarkin? Keyingi darsda esa yettinchi savol bilan tanishamiz: qanday qoidalar? Ko'rishguncha!",
        'Домашнее задание: скопируй свой промпт и отправь настоящему ИИ. На следующем уроке — седьмой вопрос: какие правила? До встречи!',
        'Homework: copy your prompt and send it to a real AI. Next lesson: the seventh question — what rules? See you!') }
    ],
    roles: { what: L3("aniq narsa: kafe, klub, do'kon", 'конкретная вещь: кафе, клуб, магазин', 'a specific thing: cafe, club, shop'), why: L3('maqsad: sayt nima qilsin', 'цель: что сделает сайт', 'the goal: what the site should do'),
      who: L3("auditoriya: yoshi, kimligi, nimani yaxshi ko'radi", 'аудитория: возраст, кто они, что любят', 'the audience: age, who they are, what they love'),
      in: L3("bloklar: qaysi, qanday tartibda, haqiqiy ma'lumot bilan", 'блоки: какие, в каком порядке, с настоящими данными', 'blocks: which, in what order, with real details'),
      look: L3('uslub, ranglar, burchaklar, soyalar, shrift', 'стиль, цвета, углы, тени, шрифт', 'style, colours, corners, shadows, font'),
      beh: L3("qachon, nima, nima bo'ladi: ustiga kelganda, bosilganda, telefonda", 'когда, что, что происходит: при наведении, при нажатии, на телефоне', 'when, what, what happens: on hover, on click, on a phone') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring va saytingizni yarating.", 'Отправь свой промпт настоящему ИИ и сделай свой сайт.', 'Send your prompt to a real AI and make your site.'),
    ask: L3('Promptingiz va saytingizga qarang', 'Посмотри на свой промпт и сайт', 'Look at your prompt and your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, beh: 1, right: 1, opts: 1, type: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:ai5-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:../ai4/ai4.css@*/
/*@FILE:ai5.css@*/
`;
