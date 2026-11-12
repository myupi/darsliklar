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
  empty: L3("«Qanday ishlaydi?» qatoriga yozing: qachon, nima va nima bo'ladi?", 'Напиши в строку «Как ведёт себя?»: когда, что и что происходит?', 'Write in the “How it behaves?” line: when, what and what happens?'),
  vague: L3("«Jonli», «qiziqarli» har kimga har xil. Aniq yozing: qachon, masalan ustiga kelganda yoki bosilganda, nima va nima bo'ladi.", '«Живой», «интересный» каждый понимает по-своему. Напиши точно: когда (например, при наведении или нажатии), что и что происходит.', '“Lively” and “fun” mean different things to everyone. Be precise: when (for example on hover or on click), what and what happens.'),
  chaos: L3("Hamma narsa sakrasa, ko'z charchaydi va tugmani bosib bo'lmaydi. Faqat kerakli harakatni yozing.", 'Если прыгает всё, глаза устают, а кнопку не нажать. Напиши только нужное движение.', 'If everything jumps, eyes get tired and the button can’t be pressed. Write only the movement that’s needed.'),
  none: L3("Sun'iy intellekt bu so'zlardan harakatni tanimadi. Masalan: tugma ustiga kelganda rangi o'zgarsin.", 'ИИ не узнал по этим словам поведение. Например: кнопка меняет цвет при наведении.', 'The AI didn’t recognise a behaviour. For example: the button changes colour on hover.'),
  still: L3("«Qachon?» yo'q, shuning uchun sun'iy intellekt tugmani shunchaki doim shunday qildi. Qachon ishlashini yozing: ustiga kelganda yoki bosilganda.", 'Нет «когда?» — и ИИ просто сделал кнопку такой всегда. Напиши, когда это происходит: при наведении или при нажатии.', 'There’s no “when?”, so the AI simply made the button like that all the time. Write when it happens: on hover or on click.')
};
const C = {
  s1: {
    eyebrow: L3('Sayt qanday ishlaydi?', 'Как ведёт себя сайт?', 'How does it behave?'),
    say: L3("Salom! Promptimda beshta qator bor. Oltinchisi yangi: sayt qanday ishlaydi. Men «jonli va qiziqarli bo'lsin» deb yozdim. Bu oilaviy kafe uchun! «Yuborish»ni bosing.",
      'Привет! В моём промпте пять строк. Шестая — новая: как ведёт себя сайт. Я написал «пусть будет живым и интересным». Это для семейного кафе! Нажми «Отправить».',
      'Hi! My prompt has five lines. The sixth is new: how the site behaves. I wrote “make it lively and fun”. It’s for a family cafe! Tap “Send”.'),
    what: L3('Oilaviy kafe sayti', 'Сайт семейного кафе', 'A family cafe site'),
    why: L3('odamlar ovqat buyurtma qilsin', 'чтобы люди заказывали еду', 'get people to order food'),
    who: L3('mahalladagi oilalar', 'семьи нашего района', 'families in our neighbourhood'),
    inside: L3('menyu, narxlar, aloqa', 'меню, цены, контакты', 'menu, prices, contact'),
    look: L3("iliq, to'q sariq va oq", 'тёплый, оранжевый и белый', 'warm, orange and white'),
    beh: L3("jonli va qiziqarli bo'lsin", 'пусть будет живым и интересным', 'make it lively and fun'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Voy! Hamma narsa sakrayapti va aylanyapti. «Buyurtma berish» tugmasi esa qochib yuribdi, uni bosib bo'lmaydi! Qarang, «Taxmin» belgilari: «jonli» degan so'zni sun'iy intellekt o'zicha tushundi.",
      'Ого! Всё прыгает и крутится. А кнопка «Заказать» убегает, её не нажать! Смотри, метки «Догадка»: слово «живой» ИИ понял по-своему.',
      'Whoa! Everything is jumping and spinning. And the “Order now” button runs away, you can’t press it! Look at the “Guess” labels: the AI understood “lively” its own way.'),
    done: L3("Menimcha, sayt qancha ko'p harakat qilsa, shuncha jonli va zo'r bo'ladi! Siz nima deb o'ylaysiz? Bugun oltinchi savolni o'rganamiz: sayt qanday ishlaydi?",
      'По-моему, чем больше на сайте движения, тем он живее и круче! А ты как думаешь? Сегодня разберём шестой вопрос: как ведёт себя сайт?',
      'I think the more a site moves, the livelier and cooler it is! What do you think? Today we learn the sixth question: how does the site behave?'),
    seen: { h: L3('Mijozlar nima dedi', 'Что сказали посетители', 'What the customers said'), t: L3("«Boshim aylanib ketdi! Buyurtma tugmasi qochib yuribdi, bosolmadim!»", '«У меня закружилась голова! Кнопка заказа убегает, я не смог нажать!»', '“My head is spinning! The order button keeps running away, I couldn’t press it!”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("«Jonli» degan so'z kafega mos chiqmadi", '«Живой» кафе не подошёл', '“Lively” didn’t suit the cafe')
  },
  s2: {
    eyebrow: L3('Ustiga kelganda', 'При наведении', 'On hover'),
    help: [
      L3("Prompt qatoriga va sichqoncha ustiga kelgan tugmaga qarang.", 'Посмотри на строку промпта и на кнопку под мышкой.', 'Look at the prompt line and at the button under the mouse.'),
      L3("Hover, ya'ni sichqoncha ustiga kelganda degani. Tugma o'zgarsa, odam uni bosish mumkinligini tushunadi.", 'Hover — это когда мышь наведена на элемент. Кнопка меняется — и человек понимает, что её можно нажать.', 'Hover means the mouse is over an element. When the button changes, people understand it can be pressed.'),
      L3("O'yin menyusida tanlangan qahramon yorishib, kattalashadi. Siz kimni tanlayotganingizni darrov bilasiz.", 'В меню игры выбранный герой подсвечивается и становится больше. Ты сразу видишь, кого выбираешь.', 'In a game menu the hero you point at lights up and grows. You see at once who you’re picking.')
    ],
    say: L3("Oltinchi savol: sayt qanday ishlaydi? Ya'ni odam biror narsa qilganda sayt nima qiladi. Qarang, hozir qator bo'sh. Sichqoncha tugma ustiga keldi, bosdi, lekin hech narsa bo'lmadi. Bu tugmami yoki oddiy yozuvmi?",
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
      L3("Yozamiz: tugma ustiga sichqoncha kelganda rangi o'zgarsin. Qarang: sichqoncha keldi, tugma sariq bo'ldi! Endi u «meni bosing» deyapti.", 'Пишем: кнопка меняет цвет при наведении. Смотри: мышь навелась — кнопка стала жёлтой! Теперь она говорит: «нажми меня».', 'We write: the button changes colour on hover. Look: the mouse came over and the button turned yellow! Now it says “press me”.'),
      L3("Yana qo'shamiz: kattalashsin. Tugma ham rangini o'zgartiradi, ham kattalashadi. Buni payqamaslik qiyin.", 'Добавим: и увеличивается. Кнопка и цвет меняет, и растёт. Такое трудно не заметить.', 'Let’s add: and grows. The button changes colour and gets bigger. That’s hard to miss.'),
      L3("Kartochkalar ham javob berishi mumkin: ustiga kelganda ko'tariladi. Odam sichqoncha qayerda turganini doim ko'radi.", 'Карточки тоже могут отвечать: при наведении они приподнимаются. Человек всегда видит, где сейчас мышь.', 'Cards can respond too: they lift up on hover. People always see where the mouse is.')
    ],
    done: L3("Demak, birinchi holat: sichqoncha ustiga kelganda. Ingliz tilida bu hover deyiladi. Qatorga yozamiz: qachon, nima va nima bo'ladi.", 'Итак, первый случай — при наведении мыши. По-английски это hover. В строку пишем: когда, что и что происходит.', 'So, the first case is when the mouse is over something. In English it’s called hover. In the line we write: when, what and what happens.'),
    asks: [L3("Qarang: hozir hech narsa bo'lmaydi", 'Смотри: сейчас ничего не происходит', 'Watch: nothing happens now'), L3("Qarang: rangi o'zgaradi", 'Смотри: меняется цвет', 'Watch: the colour changes'),
      L3('Qarang: kattalashadi', 'Смотри: растёт', 'Watch: it grows'), L3("Qarang: kartochka ko'tariladi", 'Смотри: карточка приподнимается', 'Watch: the card lifts')],
    askDone: L3('Ustiga kelganda sayt javob beradi', 'При наведении сайт отвечает', 'The site responds on hover')
  },
  s3: {
    eyebrow: L3('Ustiga kelganda', 'При наведении', 'On hover'),
    card: { h: BUY, t: L3("Pitsa do'koni: menyu kartochkasi ustiga sichqoncha kelganda u kattalashsin. Mijoz qaysi pitsani tanlayotganini ko'rsin.", 'Пиццерия: пусть карточка меню увеличивается при наведении мыши. Пусть покупатель видит, какую пиццу выбирает.', 'Pizza shop: let a menu card grow when the mouse is over it, so customers see which pizza they’re choosing.') },
    say: L3("Endi siz. Pitsa do'koni sayt so'radi. Beshta qator tayyor. Buyurtmani o'qing va «Qanday ishlaydi?» qatoriga yozing: qachon, nima va nima bo'ladi.",
      'Теперь ты. Пиццерия попросила сайт. Пять строк готовы. Прочитай заказ и напиши в строку «Как ведёт себя?»: когда, что и что происходит.',
      'Your turn. A pizza shop asked for a site. Five lines are ready. Read the request and write in the “How it behaves?” line: when, what and what happens.'),
    what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'),
    why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'),
    who: L3("pitsani yaxshi ko'radigan talabalar", 'студенты, которые любят пиццу', 'students who love pizza'),
    inside: L3('menyu, narxlar, aloqa', 'меню, цены, контакты', 'menu, prices, contact'),
    look: L3('zamonaviy, qizil va oq', 'современный, красный и белый', 'modern, red and white'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noHover: L3('Qachon? Buyurtmada: sichqoncha ustiga kelganda.', 'Когда? В заказе: при наведении мыши.', 'When? The request says: when the mouse is over it.'),
      notCard: L3("Bu tugmaga ishladi. Buyurtmada esa menyu kartochkasi.", 'Это сработало на кнопке. А в заказе — карточка меню.', 'That worked on the button. The request is about the menu cards.'),
      noGrow: L3("Kartochka nima qilsin? Buyurtmada: kattalashsin.", 'Что делает карточка? В заказе: увеличивается.', 'What should the card do? The request says: grow.')
    },
    hints: [
      L3("Buyurtmada uch narsa bor: qachon, nima va nima bo'ladi.", 'В заказе три вещи: когда, что и что происходит.', 'The request has three things: when, what and what happens.'),
      L3('Sichqoncha ustiga kelganda, menyu kartochkasi kattalashsin.', 'При наведении мыши карточка меню увеличивается.', 'When the mouse is over it, the menu card grows.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('menyu kartochkasi ustiga sichqoncha kelganda kattalashsin', 'карточка меню увеличивается при наведении мыши', 'menu cards grow when the mouse is over them'),
    ok: L3("Zo'r! Sichqoncha keldi, kartochka kattalashdi. Mijoz qaysi pitsani tanlayotganini ko'radi!", 'Огонь! Мышь навелась — карточка выросла. Покупатель видит, какую пиццу выбирает!', 'Awesome! The mouse came over and the card grew. Customers see which pizza they’re choosing!'),
    ask: L3('«Qanday ishlaydi?» ga yozing', 'Напиши в «Как ведёт себя?»', 'Write in “How it behaves?”')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Endi o'zingizni sinab ko'ring. Ikki «Qanday ishlaydi?» dan qaysi biri sun'iy intellektga ko'proq yordam beradi?", 'Теперь проверь себя. Какое из двух «Как ведёт себя?» больше поможет ИИ?', 'Now check yourself. Which of the two “How it behaves?” lines helps the AI more?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi «Qanday ishlaydi?» aniqroq?", 'Какое «Как ведёт себя?» точнее?', 'Which “How it behaves?” is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi birida qachon, nima va nima bo'lishi aytilgan?", 'Где сказано, когда, что и что происходит?', 'Which one says when, what and what happens?'),
    hint2: L3("«Jonli», «qiziqarli» hech narsani aniq aytmaydi. «Qachon?» bo'lmasa, harakat ham bo'lmaydi.", '«Живой», «интересный» ничего точно не говорят. Без «когда?» нет и движения.', '“Lively” and “fun” say nothing precise. Without “when?” there’s no behaviour.'),
    items: [
      { a: L3("jonli bo'lsin", 'пусть будет живым', 'make it lively'), b: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'), right: 'b',
        why: L3("Ikkinchisida qachon, nima va nima bo'lishi bor.", 'Во втором есть «когда», «что» и «что происходит».', 'The second has when, what and what happens.') },
      { a: L3("kartochkalar ustiga kelganda ko'tarilsin", 'карточки приподнимаются при наведении', 'cards lift up on hover'), b: L3('qiziqarli ishlasin', 'пусть интересно работает', 'make it work in a fun way'), right: 'a',
        why: L3("Birinchisi aniq: kartochkalar, ustiga kelganda, ko'tariladi.", 'Первый точный: карточки, при наведении, приподнимаются.', 'The first is precise: cards, on hover, lift up.') },
      { a: L3('tugma kattalashsin', 'кнопка увеличивается', 'the button grows'), b: L3('tugma ustiga sichqoncha kelganda kattalashsin', 'кнопка увеличивается при наведении мыши', 'the button grows when the mouse is over it'), right: 'b',
        why: L3("Birinchisida «qachon?» yo'q: tugma doim katta bo'lib qoladi.", 'В первом нет «когда?»: кнопка просто всегда будет большой.', 'The first has no “when?”: the button would just stay big all the time.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! «Jonli» ni aniq harakatdan ajratasiz.", 'Всё верно! Ты отличаешь «живой» от точного поведения.', 'All correct! You can tell “lively” from a precise behaviour.')
  },
  s5: {
    eyebrow: L3('Bosilganda', 'При нажатии', 'On click'),
    help: [
      L3("Tugmaga va sichqonchaga qarang: bosilgandan keyin nima chiqadi?", 'Посмотри на кнопку и мышь: что появляется после нажатия?', 'Look at the button and the mouse: what appears after the click?'),
      L3("Bosilganda, ya'ni sichqoncha bilan bosganda yoki telefonda barmoq tekkanda degani. Sayt javob bersa, odam hammasi ishlaganini biladi.", 'При нажатии — то есть когда щёлкают мышью или касаются пальцем на телефоне. Сайт ответил — и человек знает, что всё сработало.', 'On click means pressing with the mouse or tapping with a finger on a phone. When the site answers, people know it worked.'),
      L3("Lift tugmasini bossangiz, u yonadi. Demak, lift sizni eshitdi.", 'Нажимаешь кнопку лифта — она загорается. Значит, лифт тебя услышал.', 'Press a lift button and it lights up. That means the lift heard you.')
    ],
    say: L3("Ikkinchi holat: bosilganda. Qarang, hozir «Ro'yxatdan o'tish» tugmasini bosdi, lekin hech narsa chiqmadi. Yozildimi yoki yo'qmi? Odam bilmaydi va yana-yana bosadi.",
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
      L3("Yozamiz: tugma bosilganda «Rahmat» xabari chiqsin. Qarang: bosdi va pastda xabar chiqdi! Endi odam yozilganini biladi.", 'Пишем: при нажатии появляется сообщение «Спасибо». Смотри: нажала — и внизу появилось сообщение! Теперь человек знает, что записался.', 'We write: when pressed, show a thank-you message. Look: a click, and a message popped up at the bottom! Now people know they signed up.'),
      L3("Savollar ham bosilganda ochilishi mumkin. Qarang: savolni bosdi, javobi ochildi. Sahifa toza turadi, javob esa kerak bo'lganda chiqadi.", 'Вопросы тоже могут открываться по нажатию. Смотри: нажала на вопрос — открылся ответ. Страница остаётся чистой, а ответ появляется, когда нужен.', 'Questions can open on click too. Look: a click on the question, and its answer opened. The page stays tidy, and the answer shows up when it’s needed.')
    ],
    done: L3("Demak, bosilganda sayt javob berishi kerak: xabar chiqsin yoki narsa ochilsin. Shunda odam hammasi ishlaganini biladi.", 'Значит, при нажатии сайт должен отвечать: показать сообщение или что-то открыть. Тогда человек знает, что всё сработало.', 'So on click the site should answer: show a message or open something. Then people know it worked.'),
    asks: [L3("Qarang: bosildi, lekin javob yo'q", 'Смотри: нажали, а ответа нет', 'Watch: clicked, but no answer'), L3('Qarang: «Rahmat» xabari', 'Смотри: сообщение «Спасибо»', 'Watch: the thank-you message'),
      L3('Qarang: savol ochiladi', 'Смотри: вопрос раскрывается', 'Watch: the question opens')],
    askDone: L3('Bosilganda sayt javob beradi', 'При нажатии сайт отвечает', 'The site answers on click')
  },
  s6: {
    eyebrow: L3('Bosilganda', 'При нажатии', 'On click'),
    card: { h: BUY, t: L3("Kitob do'koni: tugma bosilganda «Savatga qo'shildi» degan xabar chiqsin. Shunda mijoz kitob qo'shilganini biladi.", 'Книжный магазин: при нажатии на кнопку пусть появляется сообщение «Добавлено в корзину». Тогда покупатель знает, что книга добавлена.', 'Book shop: when the button is pressed, show the message “Added to the cart”. Then customers know the book was added.') },
    say: L3("Endi siz. Kitob do'koni mijozlari tugmani bosib, kitob qo'shildimi yoki yo'qmi, bilmay qolyapti. Buyurtmani o'qing va «Qanday ishlaydi?» ga yozing.",
      'Теперь ты. Покупатели книжного жмут кнопку и не понимают, добавилась книга или нет. Прочитай заказ и напиши в «Как ведёт себя?».',
      'Your turn. Book shop customers press the button and can’t tell if the book was added. Read the request and write in “How it behaves?”.'),
    what: L3("Kitob do'koni sayti", 'Сайт книжного магазина', 'A book shop site'),
    why: L3('odamlar kitob buyurtma qilsin', 'чтобы люди заказывали книги', 'get people to order books'),
    who: L3("kitob o'qishni yaxshi ko'radigan o'smirlar", 'подростки, которые любят читать', 'teens who love reading'),
    inside: L3('narxlar, sharhlar, aloqa', 'цены, отзывы, контакты', 'prices, reviews, contact'),
    look: L3('sokin, binafsha va oq', 'спокойный, фиолетовый и белый', 'calm, purple and white'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noClick: L3('Qachon? Buyurtmada: tugma bosilganda.', 'Когда? В заказе: при нажатии на кнопку.', 'When? The request says: when the button is pressed.'),
      hover: L3("Bu sichqoncha ustiga kelganda ishlaydi. Buyurtmada esa: bosilganda.", 'Это сработает при наведении. А в заказе — при нажатии.', 'That works on hover. The request says: on click.'),
      noMsg: L3("Bosilganda nima bo'lsin? Buyurtmada: xabar chiqsin.", 'Что происходит при нажатии? В заказе: появляется сообщение.', 'What happens on click? The request says: show a message.')
    },
    hints: [
      L3("Buyurtmada qachon ham, nima bo'lishi ham bor: bosilganda xabar chiqadi.", 'В заказе: когда (при нажатии) и что происходит (появляется сообщение).', 'The request has: when (on click) and what happens (a message appears).'),
      L3("Tugma bosilganda, «Savatga qo'shildi» xabari chiqsin.", 'При нажатии на кнопку появляется сообщение «Добавлено в корзину».', 'When the button is pressed, show the message “Added to the cart”.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugma bosilganda «Savatga qo'shildi» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Добавлено в корзину»', 'when the button is pressed, show the message “Added to the cart”'),
    ok: L3("Ajoyib! Bosdi va «Savatga qo'shildi» chiqdi. Endi mijoz kitob qo'shilganini aniq biladi!", 'Класс! Нажали — и появилось «Добавлено в корзину». Теперь покупатель точно знает, что книга добавлена!', 'Great! A click, and “Added to the cart” appeared. Now customers know for sure the book was added!'),
    ask: L3("Bosilganda nima bo'lishini yozing", 'Напиши, что происходит при нажатии', 'Write what happens on click')
  },
  s7: {
    eyebrow: L3('Qachon ishladi?', 'Когда сработало?', 'When did it work?'),
    say: L3("Endi «qachon?» ni topamiz. Men saytda nima bo'lganini aytaman, siz tanlang: bu qachon ishladi?", 'Теперь найдём «когда?». Я рассказываю, что случилось на сайте, а ты выбираешь: когда это сработало?', 'Now let’s find the “when?”. I tell you what happened on the site, and you choose: when did it work?'),
    card: L3('Saytda', 'На сайте', 'On the site'),
    ask: L3('Qachon ishladi?', 'Когда сработало?', 'When did it work?'),
    hint1: L3("Odam nima qildi: sichqonchani olib keldi, bosdi yoki saytni endi ochdi?", 'Что сделал человек: навёл мышь, нажал или только открыл сайт?', 'What did the person do: move the mouse over, click, or just open the site?'),
    hint2: L3("Faqat ustiga keldi: ustiga kelganda. Bosdi: bosilganda. Hech narsa qilmadi: sahifa ochilganda. Kichik ekran: telefonda.", 'Только навёл — при наведении. Нажал — при нажатии. Ничего не делал — при открытии страницы. Маленький экран — на телефоне.', 'Only moved over: on hover. Pressed: on click. Did nothing: when the page opens. A small screen: on a phone.'),
    items: [
      { t: L3("Odam kartochkaga sichqonchani olib keldi, hali bosmadi. Kartochka ko'tarildi.", 'Человек навёл мышь на карточку, но ещё не нажал. Карточка приподнялась.', 'Someone moved the mouse over a card but didn’t click. The card lifted up.'), opts: ['hover', 'click', 'load'], right: 'hover',
        why: L3("Bosmadi, faqat ustiga keldi. Bu ustiga kelganda.", 'Не нажимал, только навёл. Это при наведении.', 'No click, just moved over. That’s on hover.') },
      { t: L3("Odam «Yuborish» ni bosdi va «Rahmat!» chiqdi.", 'Человек нажал «Отправить», и появилось «Спасибо!».', 'Someone pressed “Send” and “Thank you!” appeared.'), opts: ['load', 'click', 'phone'], right: 'click',
        why: L3("Bosgandan keyin chiqdi. Bu bosilganda.", 'Появилось после нажатия. Это при нажатии.', 'It appeared after the press. That’s on click.') },
      { t: L3("Saytga kirishingiz bilan bloklar birin-ketin paydo bo'ldi.", 'Как только открыл сайт, блоки появились по очереди.', 'As soon as you opened the site, the blocks appeared one by one.'), opts: ['click', 'hover', 'load'], right: 'load',
        why: L3("Hech narsa bosilmadi, sahifa ochildi xolos. Bu sahifa ochilganda.", 'Ничего не нажимали, страница просто открылась. Это при открытии страницы.', 'Nothing was pressed, the page just opened. That’s when the page opens.') },
      { t: L3("Kichkina ekranda menyu uch chiziqli tugmaga yig'ildi.", 'На маленьком экране меню свернулось в кнопку с тремя полосками.', 'On a small screen the menu folded into a three-line button.'), opts: ['phone', 'hover', 'load'], right: 'phone',
        why: L3("Kichkina ekran bu telefon. Demak, telefonda.", 'Маленький экран — значит, телефон. Это на телефоне.', 'A small screen means a phone. That’s on a phone.') },
      { t: L3("Savolni bosdingiz va uning javobi ochildi.", 'Ты нажал на вопрос, и открылся ответ.', 'You clicked a question and its answer opened.'), opts: ['hover', 'click', 'phone'], right: 'click',
        why: L3("Bosdingiz, keyin ochildi. Bu bosilganda.", 'Нажал — и открылось. Это при нажатии.', 'You clicked, then it opened. That’s on click.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Har bir harakat qachon ishlashini topasiz.", 'Класс! Ты находишь, когда срабатывает каждое поведение.', 'Great! You can tell when each behaviour works.')
  },
  s8: {
    eyebrow: L3('Sahifa ochilganda', 'При открытии страницы', 'When the page opens'),
    help: [
      L3("Sahifa ochilgan paytga qarang: sarlavha va bloklar qanday chiqadi?", 'Посмотри на момент открытия страницы: как появляются заголовок и блоки?', 'Watch the moment the page opens: how do the heading and blocks appear?'),
      L3("Animatsiya, ya'ni silliq harakat degani. U ko'zni kerakli joyga olib boradi: oldin sarlavha, keyin bloklar, keyin tugma.", 'Анимация — это плавное движение. Она ведёт взгляд: сначала заголовок, потом блоки, потом кнопка.', 'Animation means smooth movement. It guides the eyes: first the heading, then the blocks, then the button.'),
      L3("Teatrda parda asta ochiladi, birdan emas. Sayt ham shunday ochilsa, yoqimli.", 'В театре занавес открывается медленно, а не рывком. Если сайт открывается так же — это приятно.', 'In a theatre the curtain opens slowly, not all at once. When a site opens like that, it feels nice.')
    ],
    say: L3("Uchinchi holat: sahifa ochilganda. Qarang, hozir sayt bir zumda, birdaniga paydo bo'ldi. Hech qanday harakat yo'q.", 'Третий случай — при открытии страницы. Смотри, сейчас сайт появляется весь сразу, в одно мгновение. Никакого движения.', 'The third case is when the page opens. Look, right now the site appears all at once, in an instant. No movement at all.'),
    what: L3('Musiqa festivali sayti', 'Сайт музыкального фестиваля', 'A music festival site'),
    why: L3('yoshlar festivalga kelsin', 'чтобы молодёжь пришла на фестиваль', 'get young people to come to the festival'),
    who: L3('14–18 yoshli yoshlar', 'молодёжь 14–18 лет', 'young people aged 14–18'),
    inside: L3('rasmlar, jadval, narxlar', 'фото, расписание, цены', 'photos, schedule, prices'),
    look: L3('zamonaviy, binafsha va pushti', 'современный, фиолетовый и розовый', 'modern, purple and pink'),
    l1: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются по очереди', 'when the page opens, blocks fade in one by one'),
    l2: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin, sarlavha tepadan sirpanib tushsin", 'при открытии страницы блоки плавно появляются по очереди, заголовок выезжает сверху', 'when the page opens, blocks fade in one by one, the title slides in from the top'),
    l3: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin, sarlavha tepadan sirpanib tushsin, asosiy tugma lipillab tursin", 'при открытии страницы блоки плавно появляются по очереди, заголовок выезжает сверху, главная кнопка мигает', 'when the page opens, blocks fade in one by one, the title slides in from the top, the main button pulses'),
    says: [
      L3("Yozamiz: sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin. Qarang: oldin sarlavha, keyin matn, keyin bloklar. Ko'z o'zi kerakli joyga boradi.", 'Пишем: при открытии страницы блоки плавно появляются по очереди. Смотри: сначала заголовок, потом текст, потом блоки. Взгляд сам идёт куда нужно.', 'We write: when the page opens, blocks fade in one by one. Look: first the heading, then the text, then the blocks. The eyes go where they should.'),
      L3("Sarlavha tepadan sirpanib tushsin. U sahnaga chiqqan qo'shiqchidek birinchi bo'lib keladi.", 'Заголовок выезжает сверху. Он выходит первым, как певец на сцену.', 'The title slides in from the top. It arrives first, like a singer coming on stage.'),
      L3("Asosiy tugma lipillab tursin. Endi u doim «meni bosing» deb chaqiradi. Lekin faqat bitta tugma, hammasi emas!", 'Главная кнопка мигает. Теперь она всё время зовёт: «нажми меня». Но только одна кнопка, а не всё подряд!', 'The main button pulses. Now it keeps calling “press me”. But only one button, not everything!')
    ],
    done: L3("Demak, sahifa ochilganda ham sayt ishlaydi: bloklar silliq chiqadi, asosiy tugma chaqiradi. Bu animatsiya, ya'ni silliq harakat degani.", 'Значит, и при открытии страницы сайт работает: блоки появляются плавно, главная кнопка зовёт. Это анимация — плавное движение.', 'So the site works when the page opens too: blocks appear smoothly, and the main button calls. That’s animation, smooth movement.'),
    asks: [L3('Qarang: sayt birdan chiqadi', 'Смотри: сайт появляется сразу', 'Watch: the site appears at once'), L3('Qarang: birin-ketin', 'Смотри: по очереди', 'Watch: one by one'),
      L3('Qarang: sarlavha sirpanadi', 'Смотри: заголовок выезжает', 'Watch: the title slides in'), L3('Qarang: tugma lipillaydi', 'Смотри: кнопка мигает', 'Watch: the button pulses')],
    askDone: L3('Ochilganda sayt silliq chiqadi', 'При открытии сайт появляется плавно', 'The site appears smoothly when it opens')
  },
  s9: {
    eyebrow: L3('Sahifa ochilganda', 'При открытии страницы', 'When the page opens'),
    card: { h: BUY, t: L3("Rasm ko'rgazmasi: saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin, xuddi ko'rgazmada chiroqlar yonganday.", 'Выставка рисунков: при открытии сайта картинки плавно появляются по очереди, как будто на выставке зажигается свет.', 'Art exhibition: when the site opens, the pictures fade in one by one, as if the lights were coming on at the show.') },
    say: L3("Endi siz. Rasm ko'rgazmasi sayt so'radi. Ular sayt ochilganda o'zgacha bo'lishini xohlaydi. Buyurtmani o'qing va «Qanday ishlaydi?» ga yozing.",
      'Теперь ты. Выставка рисунков попросила сайт. Они хотят, чтобы открытие сайта было особенным. Прочитай заказ и напиши в «Как ведёт себя?».',
      'Your turn. An art exhibition asked for a site. They want the site’s opening to be special. Read the request and write in “How it behaves?”.'),
    what: L3("Rasm ko'rgazmasi sayti", 'Сайт выставки рисунков', 'An art exhibition site'),
    why: L3("odamlar ko'rgazmaga kelsin", 'чтобы люди пришли на выставку', 'get people to come to the exhibition'),
    who: L3("san'atni yaxshi ko'radigan oilalar", 'семьи, которые любят искусство', 'families who love art'),
    inside: L3('rasmlar, jadval, aloqa', 'картины, расписание, контакты', 'pictures, schedule, contact'),
    look: L3('minimalist, qora va oq', 'минимализм, чёрный и белый', 'minimal, black and white'),
    ph: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noLoad: L3("Qachon? Buyurtmada: saytga kirganda, ya'ni sahifa ochilganda degani.", 'Когда? В заказе: при открытии сайта, то есть при открытии страницы.', 'When? The request says: when the site opens, that is, when the page opens.'),
      noFx: L3("Qanday paydo bo'lsin? Buyurtmada: birin-ketin, silliq.", 'Как появляются? В заказе: плавно, по очереди.', 'How should they appear? The request says: smoothly, one by one.')
    },
    hints: [
      L3("Buyurtmada uch narsa bor: saytga kirganda, rasmlar, birin-ketin silliq paydo bo'ladi.", 'В заказе: когда (при открытии сайта), что (картинки) и как (плавно, по очереди).', 'The request has: when (the site opens), what (the pictures) and how (smoothly, one by one).'),
      L3("Saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin.", 'При открытии страницы картинки плавно появляются по очереди.', 'When the page opens, the pictures fade in one by one.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin", 'при открытии страницы картинки плавно появляются по очереди', 'when the page opens, pictures fade in one by one'),
    ok: L3("Ajoyib! Rasmlar birin-ketin, silliq chiqdi. Xuddi ko'rgazmada chiroq yonganday!", 'Класс! Картинки появились по очереди, плавно. Как будто на выставке зажёгся свет!', 'Great! The pictures appeared one by one, smoothly. Just like the lights coming on at the show!'),
    ask: L3('Ochilgandagi harakatni yozing', 'Опиши, что происходит при открытии', 'Describe what happens when it opens')
  },
  s10: {
    eyebrow: L3('Telefonda', 'На телефоне', 'On a phone'),
    help: [
      L3("Oynaning kengligiga va saytning menyusiga qarang.", 'Посмотри на ширину окна и на меню сайта.', 'Look at the window width and at the site’s menu.'),
      L3("Moslashuvchan sayt, ya'ni telefon ekraniga moslashadigan sayt degani: menyu uch chiziqli tugmaga yig'iladi, kerakli tugma qo'l ostida turadi.", 'Адаптивный сайт подстраивается под экран телефона: меню сворачивается в кнопку с тремя полосками, нужная кнопка всегда под рукой.', 'A responsive site adapts to a phone screen: the menu folds into a three-line button, and the key button is always at hand.'),
      L3("Kiyim bolaning bo'yiga moslab tikiladi. Sayt ham har bir ekranga mos bo'lsin.", 'Одежду шьют по росту. Пусть и сайт подходит каждому экрану.', 'Clothes are made to fit. Let a site fit every screen too.')
    ],
    say: L3("To'rtinchi holat: telefonda. Hozir sayt kompyuterda. Menyu tepada, tugma ustiga kelganda rangini o'zgartiradi. Lekin ko'pchilik saytni telefondan ochadi.", 'Четвёртый случай — на телефоне. Сейчас сайт на компьютере. Меню наверху, кнопка меняет цвет при наведении. Но многие открывают сайт с телефона.', 'The fourth case is on a phone. Right now the site is on a computer. The menu is at the top, and the button changes colour on hover. But lots of people open sites on a phone.'),
    what: L3('Robot kursi sayti', 'Сайт курса роботов', 'A robot course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'),
    inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'),
    look: L3('zamonaviy, yashil va oq', 'современный, зелёный и белый', 'modern, green and white'),
    p0: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении мыши', 'the button changes colour when the mouse is over it'),
    p2: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin, telefonda menyu ☰ tugmasiga yig'ilsin", 'кнопка меняет цвет при наведении мыши, на телефоне меню сворачивается в кнопку ☰', 'the button changes colour when the mouse is over it, on a phone the menu collapses into a ☰ button'),
    p3: L3("tugma ustiga sichqoncha kelganda rangi o'zgarsin, telefonda menyu ☰ tugmasiga yig'ilsin, telefonda yozilish tugmasi pastda doim ko'rinib tursin", 'кнопка меняет цвет при наведении мыши, на телефоне меню сворачивается в кнопку ☰, на телефоне кнопка записи всегда видна внизу', 'the button changes colour when the mouse is over it, on a phone the menu collapses into a ☰ button, on a phone the sign-up button always stays at the bottom'),
    says: [
      L3("Endi shu saytni telefonda ochamiz. Oyna torayib qoldi. Voy, menyu yo'qolib qoldi! Jadval va narxlarga qanday o'tamiz?", 'Теперь откроем этот сайт на телефоне. Окно стало узким. Ой, меню пропало! Как попасть в расписание и цены?', 'Now let’s open the site on a phone. The window got narrow. Oops, the menu is gone! How do we get to the schedule and prices?'),
      L3("Yozamiz: telefonda menyu uch chiziqli tugmaga yig'ilsin. Qarang: tepada shunday tugma chiqdi. Barmoq bosdi va menyu ochildi!", 'Пишем: на телефоне меню сворачивается в кнопку с тремя полосками. Смотри: наверху появилась такая кнопка. Палец нажал — и меню открылось!', 'We write: on a phone the menu folds into a three-line button. Look: that button appeared at the top. A finger tapped it, and the menu opened!'),
      L3("Yozilish tugmasi esa pastda doim tursin. Sahifani qancha pastga tushirsangiz ham, barmoq uni darrov topadi.", 'А кнопка записи пусть всегда будет внизу. Как бы далеко ни листал страницу, палец сразу её находит.', 'And let the sign-up button always stay at the bottom. However far you scroll, your finger finds it at once.')
    ],
    done: L3("Demak, telefonda sayt boshqacha ishlaydi: sichqoncha yo'q, ekran tor. Shuning uchun telefonda nima bo'lishini ham yozamiz.", 'Значит, на телефоне сайт ведёт себя иначе: мыши нет, экран узкий. Поэтому пишем и то, что происходит на телефоне.', 'So on a phone a site behaves differently: there’s no mouse and the screen is narrow. That’s why we also write what happens on a phone.'),
    asks: [L3('Qarang: kompyuterda', 'Смотри: на компьютере', 'Watch: on a computer'), L3("Qarang: telefonda menyu yo'q", 'Смотри: на телефоне меню нет', 'Watch: no menu on the phone'),
      L3('Qarang: menyu ☰ tugmada', 'Смотри: меню в кнопке ☰', 'Watch: the menu is in the ☰ button'), L3('Qarang: tugma pastda', 'Смотри: кнопка внизу', 'Watch: the button at the bottom')],
    askDone: L3('Telefonda ham sayt qulay', 'И на телефоне сайт удобный', 'The site is easy to use on a phone too')
  },
  s11: {
    eyebrow: L3('Telefonda', 'На телефоне', 'On a phone'),
    card: { h: BUY, t: L3("Lager: ota-onalar saytni ko'pincha telefondan ochadi. Telefonda menyu ☰ tugmasiga yig'ilsin.", 'Лагерь: родители чаще открывают сайт с телефона. Пусть на телефоне меню сворачивается в кнопку ☰.', 'Camp: parents usually open the site on a phone. On a phone, let the menu collapse into a ☰ button.') },
    say: L3("Endi siz. Lager saytida telefonda menyu yo'qolib qolyapti. Buyurtmani o'qing va telefonda nima bo'lishini yozing.",
      'Теперь ты. На сайте лагеря меню на телефоне пропадает. Прочитай заказ и напиши, что происходит на телефоне.',
      'Your turn. On the camp site the menu disappears on a phone. Read the request and write what happens on a phone.'),
    what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'),
    why: L3('bolalar lagerga yozilsin', 'чтобы дети записывались в лагерь', 'get kids to sign up for the camp'),
    who: L3('10–14 yoshli bolalar va ularning ota-onalari', 'дети 10–14 лет и их родители', 'kids aged 10–14 and their parents'),
    inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3('quvnoq, yashil va sariq', 'весёлый, зелёный и жёлтый', 'playful, green and yellow'),
    ph: L3("qayerda? nima? nima bo'ladi?", 'где? что? что происходит?', 'where? what? what happens?'),
    msgs: {
      noPhone: L3('Qayerda? Buyurtmada: telefonda.', 'Где? В заказе: на телефоне.', 'Where? The request says: on a phone.'),
      noMenu: L3("Telefonda nima bo'lsin? Buyurtmada: menyu ☰ tugmasiga yig'ilsin.", 'Что происходит на телефоне? В заказе: меню сворачивается в кнопку ☰.', 'What happens on a phone? The request says: the menu collapses into a ☰ button.')
    },
    hints: [
      L3("Buyurtmada uch narsa bor: telefonda, menyu, uch chiziqli tugmaga yig'iladi.", 'В заказе: где (на телефоне), что (меню) и что происходит (сворачивается в кнопку).', 'The request has: where (on a phone), what (the menu) and what happens (it folds into a button).'),
      L3("Telefonda menyu ☰ tugmasiga yig'ilsin.", 'На телефоне меню сворачивается в кнопку ☰.', 'On a phone the menu collapses into a ☰ button.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("telefonda menyu ☰ tugmasiga yig'ilsin", 'на телефоне меню сворачивается в кнопку ☰', 'on a phone the menu collapses into a ☰ button'),
    ok: L3("Zo'r! Telefonda menyu uch chiziqli tugmaga yig'ildi. Bosdi va ochildi. Ota-onalar hammasini topadi!", 'Огонь! На телефоне меню свернулось в кнопку с тремя полосками. Нажали — открылось. Родители всё найдут!', 'Awesome! On a phone the menu folded into a three-line button. A tap, and it opened. Parents will find everything!'),
    ask: L3("Telefonda nima bo'lishini yozing", 'Напиши, что происходит на телефоне', 'Write what happens on a phone')
  },
  g1: {
    eyebrow: L3('Qachon?', 'Когда?', 'When?'),
    card: { h: BUY, t: L3("Murabbiy: «Tugma doim katta bo'lib turmasin. Faqat sichqoncha ustiga kelganda kattalashsin.»", 'Тренер: «Пусть кнопка не будет всё время огромной. Пусть растёт только при наведении мыши».', 'The coach: “The button shouldn’t be huge all the time. It should only grow when the mouse is over it.”') },
    say: L3("Men klub sayti uchun «tugma kattalashsin» deb yozdim. Qarang, tugma doim katta bo'lib qoldi! Sichqoncha keldi, lekin hech narsa o'zgarmadi. «Qachon?» ni yozmabman. Murabbiy nima deyapti? Qatorimni tuzating.",
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
      still: L3("Tugma hali ham doim katta. «Qachon?» ni qo'shing: sichqoncha ustiga kelganda.", 'Кнопка всё ещё всегда огромная. Добавь «когда?»: при наведении мыши.', 'The button is still huge all the time. Add the “when?”: when the mouse is over it.'),
      noGrow: L3("Ustiga kelganda nima bo'lsin? Murabbiy: kattalashsin.", 'Что происходит при наведении? Тренер: кнопка увеличивается.', 'What happens on hover? The coach says: it grows.')
    },
    hints: [
      L3("Kodining qatorida «qachon?» yo'q.", 'В строке Коди нет «когда?».', 'Kodi’s line has no “when?”.'),
      L3("Qo'shing: tugma ustiga sichqoncha kelganda.", 'Добавь: при наведении мыши на кнопку.', 'Add: when the mouse is over the button.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('tugma ustiga sichqoncha kelganda kattalashsin', 'кнопка увеличивается при наведении мыши', 'the button grows when the mouse is over it'),
    ok: L3("Zo'r! Endi tugma oddiy turadi, sichqoncha kelganda esa kattalashadi. «Qachon?» juda muhim!", 'Огонь! Теперь кнопка обычная, а при наведении мыши растёт. «Когда?» очень важно!', 'Awesome! Now the button is normal and only grows on hover. The “when?” really matters!'),
    ask: L3("«Qachon?» ni qo'shing", 'Добавь «когда?»', 'Add the “when?”')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi detektiv bo'lamiz. Sichqonchaga va saytga qarang. Qaysi «Qanday ishlaydi?» shunday saytni berdi?", 'Теперь побудем детективами. Смотри на мышь и на сайт. Какое «Как ведёт себя?» дало такой сайт?', 'Let’s be detectives. Watch the mouse and the site. Which “How it behaves?” gave this site?'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3("Qaysi «Qanday ishlaydi?» shu saytni berdi?", 'Какое «Как ведёт себя?» дало этот сайт?', 'Which “How it behaves?” gave this site?'),
    hint1: L3("Saytga qarang: sichqoncha nima qildi va sayt nima qildi?", 'Смотри на сайт: что сделала мышь и что сделал сайт?', 'Watch the site: what did the mouse do, and what did the site do?'),
    hint2: L3("Faqat ustiga keldi: ustiga kelganda. Bosdi: bosilganda. O'zi chiqdi: sahifa ochilganda. Tor oyna: telefonda.", 'Только навели — при наведении. Нажали — при нажатии. Появилось само — при открытии страницы. Узкое окно — на телефоне.', 'Only moved over: on hover. Clicked: on click. Appeared by itself: when the page opens. A narrow window: on a phone.'),
    items: [
      { beh: L3("tugma bosilganda «Rahmat!» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Спасибо!»', 'when the button is pressed, show the message “Thank you!”'),
        a: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'), b: L3("tugma bosilganda «Rahmat!» xabari chiqsin", 'при нажатии на кнопку появляется сообщение «Спасибо!»', 'when the button is pressed, show the message “Thank you!”'),
        c: L3("sahifa ochilganda bloklar silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются', 'when the page opens, blocks fade in'),
        right: 'b', why: L3("Sichqoncha bosdi va «Rahmat!» chiqdi. Bu B.", 'Мышь нажала — и появилось «Спасибо!». Это B.', 'The mouse clicked and “Thank you!” appeared. That’s B.') },
      { beh: L3("kartochkalar ustiga kelganda ko'tarilsin", 'карточки приподнимаются при наведении', 'cards lift up on hover'),
        a: L3("kartochkalar ustiga kelganda ko'tarilsin", 'карточки приподнимаются при наведении', 'cards lift up on hover'), b: L3("kartochkalar sahifa ochilganda paydo bo'lsin", 'карточки появляются при открытии страницы', 'cards appear when the page opens'),
        c: L3('tugma lipillab tursin', 'кнопка мигает', 'the button pulses'),
        right: 'a', why: L3("Sichqoncha kelganda kartochka ko'tarildi, bosmadi ham. Bu A.", 'Мышь навелась — карточка приподнялась, даже без нажатия. Это A.', 'The mouse came over and the card lifted, without a click. That’s A.') },
      { beh: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются по очереди', 'when the page opens, blocks fade in one by one'),
        a: L3("tugma bosilganda xabar chiqsin", 'при нажатии на кнопку появляется сообщение', 'when the button is pressed, show a message'), b: L3('kartochkalar ustiga kelganda kattalashsin', 'карточки увеличиваются при наведении', 'cards grow on hover'),
        c: L3("sahifa ochilganda bloklar birin-ketin silliq paydo bo'lsin", 'при открытии страницы блоки плавно появляются по очереди', 'when the page opens, blocks fade in one by one'),
        right: 'c', why: L3("Hech narsa bosilmadi, bloklar o'zi birin-ketin chiqdi. Bu C.", 'Ничего не нажимали, блоки сами появились по очереди. Это C.', 'Nothing was pressed, the blocks appeared one by one by themselves. That’s C.') },
      { beh: L3("telefonda menyu ☰ tugmasiga yig'ilsin", 'на телефоне меню сворачивается в кнопку ☰', 'on a phone the menu collapses into a ☰ button'),
        a: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'), b: L3("telefonda menyu ☰ tugmasiga yig'ilsin", 'на телефоне меню сворачивается в кнопку ☰', 'on a phone the menu collapses into a ☰ button'),
        c: L3('savol bosilganda javob ochilsin', 'при нажатии на вопрос открывается ответ', 'clicking a question opens its answer'),
        right: 'b', why: L3("Oyna telefondek tor, menyu uch chiziqli tugmada. Bu B.", 'Окно узкое, как телефон, а меню — в кнопке с тремя полосками. Это B.', 'The window is narrow like a phone, and the menu is in the three-line button. That’s B.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Saytga qarab qaysi qator ishlaganini topasiz.", 'Класс! По сайту ты находишь, какая строка сработала.', 'Great! You can tell from the site which line did the work.')
  },
  s12: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: L3('Mijozlar', 'Посетители', 'Customers'), t: L3("Hech narsa sakramasin va aylanmasin. Tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin.", 'Пусть ничего не прыгает и не крутится. Кнопка меняет цвет при наведении, а при нажатии появляется сообщение «Спасибо!».', 'Nothing should jump or spin. The button changes colour on hover, and when pressed shows the message “Thank you!”.') },
    say: L3("Endi kafe saytini tuzatamiz! Mijozlar nima xohlashini aytdi. Mening «jonli va qiziqarli» qatorim o'rniga aniq harakatlarni yozing.",
      'Теперь починим сайт кафе! Посетители сказали, чего хотят. Вместо моего «живым и интересным» напиши точное поведение.',
      'Now let’s fix the cafe site! The customers said what they want. Instead of my “lively and fun”, write the exact behaviour.'),
    msgs: {
      vague: L3("«Jonli va qiziqarli» hali turibdi. Mijozlar aytgan aniq harakatlarni yozing.", '«Живым и интересным» всё ещё на месте. Напиши точное поведение, о котором просят посетители.', '“Lively and fun” is still there. Write the exact behaviour the customers asked for.'),
      noHover: L3("Ustiga kelganda nima bo'lsin? Mijozlar: rangi o'zgarsin.", 'Что происходит при наведении? Посетители: кнопка меняет цвет.', 'What happens on hover? The customers say: the colour changes.'),
      noClick: L3("Bosilganda nima bo'lsin? Mijozlar: «Rahmat!» xabari chiqsin.", 'Что происходит при нажатии? Посетители: появляется «Спасибо!».', 'What happens on click? The customers say: show “Thank you!”.')
    },
    hints: [
      L3("Mijozlar ikki holat aytdi: ustiga kelganda va bosilganda.", 'Посетители назвали два случая: при наведении и при нажатии.', 'The customers named two cases: on hover and on click.'),
      L3("«Jonli va qiziqarli» ni o'chiring. Yozing: tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin.", 'Сотри «живым и интересным». Напиши: кнопка меняет цвет при наведении, при нажатии появляется «Спасибо!».', 'Delete “lively and fun”. Write: the button changes colour on hover, and when pressed shows “Thank you!”.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin", 'кнопка меняет цвет при наведении, при нажатии появляется сообщение «Спасибо!»', 'the button changes colour on hover, and when pressed shows the message “Thank you!”'),
    ok: L3("Ajoyib! Hech narsa sakramaydi. Sichqoncha kelganda tugma rangini o'zgartiradi, bosganda «Rahmat!» chiqadi. Mijozlar xursand!", 'Класс! Ничего не прыгает. При наведении кнопка меняет цвет, при нажатии появляется «Спасибо!». Посетители довольны!', 'Great! Nothing jumps. On hover the button changes colour, and on click “Thank you!” appears. The customers are happy!'),
    ask: L3('«Jonli va qiziqarli» ni tuzating', 'Исправь «живым и интересным»', 'Fix “lively and fun”')
  },
  s13: {
    eyebrow: L3("To'liq «Qanday ishlaydi?»", 'Всё поведение', 'The full behaviour'),
    card: { h: BUY, t: L3("Sport musobaqasi: tugma ustiga kelganda kattalashsin; savol bosilganda javob ochilsin; telefonda menyu ☰ tugmasiga yig'ilsin.", 'Спортивные соревнования: кнопка увеличивается при наведении; при нажатии на вопрос открывается ответ; на телефоне меню сворачивается в кнопку ☰.', 'Sports contest: the button grows on hover; clicking a question opens its answer; on a phone the menu collapses into a ☰ button.') },
    say: L3("Endi to'liq «Qanday ishlaydi?» ni yozasiz: uchta holat. Sport musobaqasi buyurtmasini o'qing.", 'Теперь полное «Как ведёт себя?»: три случая. Прочитай заказ спортивных соревнований.', 'Now write the full “How it behaves?”: three cases. Read the sports contest’s request.'),
    what: L3('Sport musobaqasi sayti', 'Сайт спортивных соревнований', 'A sports contest site'),
    why: L3("o'quvchilar musobaqaga yozilsin", 'чтобы школьники записывались на соревнования', 'get students to sign up for the contest'),
    who: L3("11–14 yoshli o'quvchilar", 'школьники 11–14 лет', 'students aged 11–14'),
    inside: L3('jadval, savol-javob, aloqa', 'расписание, вопросы и ответы, контакты', 'schedule, FAQ, contact'),
    look: L3("zamonaviy, to'q sariq va oq", 'современный, оранжевый и белый', 'modern, orange and white'),
    ph: L3('uchta holatni yozing', 'напиши три случая', 'write the three cases'),
    msgs: {
      hover: L3("Ustiga kelganda nima bo'lsin? Buyurtmada: tugma kattalashsin.", 'Что происходит при наведении? В заказе: кнопка увеличивается.', 'What happens on hover? The request says: the button grows.'),
      faq: L3("Savol bosilganda nima bo'lsin? Buyurtmada: javob ochilsin.", 'Что происходит при нажатии на вопрос? В заказе: открывается ответ.', 'What happens when a question is clicked? The request says: its answer opens.'),
      phone: L3("Telefonda nima bo'lsin? Buyurtmada: menyu ☰ tugmasiga yig'ilsin.", 'Что происходит на телефоне? В заказе: меню сворачивается в кнопку ☰.', 'What happens on a phone? The request says: the menu collapses into a ☰ button.')
    },
    hints: [
      L3("Buyurtmada uchta holat bor: ustiga kelganda, bosilganda va telefonda.", 'В заказе три случая: при наведении, при нажатии и на телефоне.', 'The request has three cases: on hover, on click and on a phone.'),
      L3("Ularni vergul bilan ketma-ket yozing: har birida qachon, nima va nima bo'ladi.", 'Напиши их через запятую: в каждом — когда, что и что происходит.', 'Write them one after another with commas: each with when, what and what happens.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugma ustiga kelganda kattalashsin, savol bosilganda javob ochilsin, telefonda menyu ☰ tugmasiga yig'ilsin", 'кнопка увеличивается при наведении, при нажатии на вопрос открывается ответ, на телефоне меню сворачивается в кнопку ☰', 'the button grows on hover, clicking a question opens its answer, on a phone the menu collapses into a ☰ button'),
    ok: L3("Barakalla! Uch holat, uch javob. Sayt sichqonchaga ham, barmoqqa ham, telefonga ham javob beradi!", 'Молодец! Три случая — три ответа. Сайт отвечает и мыши, и пальцу, и телефону!', 'Well done! Three cases, three answers. The site responds to the mouse, a finger and a phone!'),
    ask: L3('Uchta holatni yozing', 'Напиши три случая', 'Write the three cases')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Endi o'z saytingiz! Oltita qatorni yozing. «Qanday ishlaydi?» ga esa bir yoki ikki holat yozing: qachon, nima va nima bo'ladi.",
      'А теперь твой сайт! Напиши все шесть строк, а в «Как ведёт себя?» — один-два случая: когда, что и что происходит.',
      'Now your own site! Write all six lines, and in “How it behaves?” one or two cases: when, what and what happens.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    phLook: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    phBeh: L3("qachon? nima? nima bo'ladi?", 'когда? что? что происходит?', 'when? what? what happens?'),
    msgs: {
      noWhat: L3("«Nima?» qatoriga yozing: qanday sayt yaratasiz?", 'Напиши строку «Что?»: какой сайт создаёшь?', 'Write the “What?” line: what site are you making?'),
      kind: L3("Bu faqat mavzu. Aniq narsani yozing: klub, server, do'kon yoki bayram sayti.", 'Это только тема. Напиши конкретную вещь: сайт клуба, сервера, магазина или праздника.', 'That’s just a topic. Write a specific thing: a club, server, shop or party site.'),
      noWhy: L3("Endi «Nega?» qatorini yozing: sayt nima qilishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      goal: L3("Maqsadni yozing: odamlar yozilsinmi, buyurtma qilsinmi, kelsinmi?", 'Напиши цель: чтобы записывались, заказывали или приходили?', 'Write the goal: should people sign up, order or come?'),
      noWho: L3("Endi «Kim uchun?» qatorini yozing: saytni kimlar ko'radi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      who: L3("Sun'iy intellekt kimligini tushunmadi. Yoshini yoki kimligini yozing.", 'ИИ не понял, для кого. Напиши возраст или кто они.', 'The AI couldn’t tell who. Write their age or who they are.'),
      noIn: L3("Endi «Ichida nima?» qatorini yozing: saytda qanday bloklar?", 'Теперь напиши строку «Что внутри?»: какие блоки на сайте?', 'Now write the “What’s inside?” line: which blocks?'),
      inNone: L3("«Ichida nima?» da blok topilmadi. Masalan: rasmlar, narxlar, aloqa.", 'В «Что внутри?» не найдено блоков. Например: фото, цены, контакты.', 'No blocks found in “What’s inside?”. For example: photos, prices, contact.'),
      noLook: L3("Endi «Ko'rinishi?» qatorini yozing: sayt qanday ko'rinsin?", 'Теперь напиши строку «Как выглядит?»: каким будет сайт?', 'Now write the “How it looks?” line: how should it look?'),
      look: L3("«Ko'rinishi?» ga uslub va ranglarni yozing. Masalan: zamonaviy, ko'k va oq.", 'В «Как выглядит?» напиши стиль и цвета. Например: современный, синий и белый.', 'In “How it looks?” write a style and colours. For example: modern, blue and white.'),
      noBeh: L3("Endi «Qanday ishlaydi?» qatorini yozing: qachon, nima va nima bo'ladi?", 'Теперь напиши строку «Как ведёт себя?»: когда, что и что происходит?', 'Now write the “How it behaves?” line: when, what and what happens?')
    },
    hints: [
      L3("Oltita savol: nima, nega, kim uchun, ichida nima, ko'rinishi, qanday ishlaydi.", 'Шесть вопросов: что, зачем, для кого, что внутри, как выглядит, как ведёт себя.', 'Six questions: what, why, who for, what’s inside, how it looks, how it behaves.'),
      L3("«Qanday ishlaydi?» ga bir-ikki holat yozing. Masalan: tugma ustiga kelganda kattalashsin.", 'В «Как ведёт себя?» напиши один-два случая. Например: кнопка увеличивается при наведении.', 'In “How it behaves?” write one or two cases. For example: the button grows on hover.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · 11–13 yoshli bolalar · rasmlar, jadval, aloqa · zamonaviy, yashil va oq · tugma ustiga kelganda kattalashsin, bosilganda «Rahmat!» chiqsin",
      'Сайт нашего футбольного клуба · чтобы ребята записывались · дети 11–13 лет · фото, расписание, контакты · современный, зелёный и белый · кнопка увеличивается при наведении, при нажатии появляется «Спасибо!»',
      'Our football club site · get kids to sign up · kids aged 11–13 · photos, schedule, contact · modern, green and white · the button grows on hover, and when pressed shows “Thank you!”'),
    ok: L3("Voy, zo'r! Bu sizning olti qatorli promptingiz. Uyga vazifada uni haqiqiy sun'iy intellektga yuborasiz.", 'Ого, классно! Это твой промпт из шести строк. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your six-line prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun oltita qatorni yozing", 'Напиши шесть строк для своего сайта', 'Write six lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor tekshiruv. Men gap aytaman, siz tanlang: to'g'rimi yoki noto'g'rimi?", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida: «qachon?», harakatning foydasi yoki «jonli» so'zi?", 'О чём фраза: о «когда?», о пользе движения или о слове «живой»?', 'What’s it about: the “when?”, why movement helps, or the word “lively”?'),
    hint2: L3("Esingizdami: «jonli» ni sun'iy intellekt o'zicha tushunadi, «qachon?» siz harakat bo'lmaydi.", 'Вспомни: «живой» ИИ понимает по-своему, а без «когда?» поведения нет.', 'Remember: the AI interprets “lively” its own way, and without “when?” there’s no behaviour.'),
    items: [
      { t: L3("«Jonli bo'lsin» desangiz, sun'iy intellekt aniq nima qilishni biladi.", 'Если написать «пусть будет живым», ИИ точно знает, что делать.', 'If you write “make it lively”, the AI knows exactly what to do.'), right: false,
        why: L3("Aslida u o'zicha taxmin qiladi va hammasini sakratib yuborishi mumkin.", 'На самом деле он гадает сам и может заставить прыгать всё подряд.', 'Actually it guesses on its own and might make everything jump.') },
      { t: L3("Yaxshi harakat odamga yordam beradi: tugma «meni bosing» deydi.", 'Хорошее движение помогает человеку: кнопка говорит «нажми меня».', 'Good movement helps people: the button says “press me”.'), right: true,
        why: L3("To'g'ri: harakat kerakli joyni ko'rsatadi.", 'Верно: движение показывает, куда смотреть.', 'Right: movement shows where to look.') },
      { t: L3("«Tugma kattalashsin» desangiz, u faqat sichqoncha kelganda kattalashadi.", 'Если написать «кнопка увеличивается», она растёт только при наведении мыши.', 'If you write “the button grows”, it only grows when the mouse is over it.'), right: false,
        why: L3("«Qachon?» yo'q, shuning uchun tugma doim katta bo'lib qoladi.", 'Нет «когда?» — и кнопка просто всё время большая.', 'There’s no “when?”, so the button just stays big all the time.') },
      { t: L3("Telefonda sayt boshqacha ishlashi mumkin, buni ham yozish kerak.", 'На телефоне сайт может вести себя иначе, и это тоже нужно написать.', 'On a phone a site can behave differently, and you should write that too.'), right: true,
        why: L3("To'g'ri: telefonda sichqoncha yo'q, ekran esa tor.", 'Верно: на телефоне нет мыши, а экран узкий.', 'Right: a phone has no mouse, and the screen is narrow.') },
      { t: L3("Hamma narsa sakrab tursa, sayt eng qulay bo'ladi.", 'Если всё прыгает, сайт самый удобный.', 'If everything jumps, the site is easiest to use.'), right: false,
        why: L3("Aslida ko'z charchaydi va tugmani bosib bo'lmaydi.", 'На самом деле глаза устают, а кнопку не нажать.', 'Actually the eyes get tired and the button can’t be pressed.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz saytning harakatini to'g'ri tasvirlaysiz.", 'Всё верно! Ты правильно описываешь поведение сайта.', 'All correct! You describe a site’s behaviour the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Men sayt qancha ko'p harakat qilsa, shuncha zo'r deb o'ylagandim. Lekin hammasi sakrasa, ko'z charchaydi va tugmani bosib bo'lmaydi! Yaxshi harakat yordam beradi: tugma «meni bosing» deydi, bosganda javob beradi, telefonda menyu topiladi. Men adashibman.",
        'Вернёмся к загадке. Я думал: чем больше движения, тем круче. Но когда прыгает всё, глаза устают, а кнопку не нажать! Хорошее движение помогает: кнопка говорит «нажми меня», после нажатия сайт отвечает, на телефоне меню находится. Я ошибся.',
        'Back to the riddle. I thought the more movement, the cooler. But when everything jumps, eyes get tired and the button can’t be pressed! Good movement helps: the button says “press me”, the site answers a click, and the menu is easy to find on a phone. I was wrong.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning olti qatorli promptingiz va saytingiz.", 'Смотри, это твой промпт из шести строк и твой сайт.', 'Look, this is your six-line prompt and your site.'), k: 'own' },
      { text: L3("Nima, nega, kim uchun, ichida nima va ko'rinishi sizga tanish.", '«Что», «зачем», «для кого», «что внутри» и «как выглядит» ты уже знаешь.', 'You already know what, why, who for, what’s inside and how it looks.'), k: 'what' },
      { text: L3("«Qanday ishlaydi?» bu qachon, nima va nima bo'ladi: ustiga kelganda, bosilganda, sahifa ochilganda va telefonda.", '«Как ведёт себя?» — это когда, что и что происходит: при наведении, при нажатии, при открытии страницы и на телефоне.', '“How it behaves?” is when, what and what happens: on hover, on click, when the page opens and on a phone.'), k: 'beh' },
      { text: L3("Uyga vazifa: promptingizni nusxalab, haqiqiy sun'iy intellektga yuboring. Keyingi darsda yettinchi savol: qanday qoidalar? Ko'rishguncha!",
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
