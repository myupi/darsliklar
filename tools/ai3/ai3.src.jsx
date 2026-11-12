// =============================================================================
// МОДУЛЬ «ИИ» · Урок 3 — «Что должно быть на сайте?»
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 12.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai3/build.mjs → lessons/ai/03-chto-na-sajte.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Что должно быть на сайте?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика: каждый урок добавляет в промпт новый кусок; темы урока — структура страницы, блоки, контент,
// лендинг). Промпт Коди из трёх строк (пиццерия для студентов) даёт сайт с тремя общими карточками-заглушками, а
// гость ищет фото пицц, отзывы и адрес. Урок учит четвёртому вопросу формулы «Ichida nima?»: какие блоки на странице, в
// каком порядке (лендинг — одна страница, блоки рассказывают по порядку: что есть → доверие → действие) и какой
// контент внутри (настоящие цена и телефон — иначе ИИ придумает свои). Загадка (без имён): Коди думает, что ИИ сам
// знает, какие блоки нужны, — «он видел тысячи сайтов». Разгадка: ИИ ставит общий шаблон и выдумывает цифры; что
// нужно гостю, знаешь ты.
//
// ДУГА (17 экранов):
//   s1 крючок (промпт Коди без «Ichida nima?» → карточки-заглушки; карточка «гость ищет меню, отзывы, адрес»; загадка)
//   блоки: s2 показ (пусто → меню → + фото → + отзывы и адрес) · s3 сам (футбольный клуб: расписание, тренеры, адрес) ·
//          s4 что точнее (раунды «hamma narsa» / конкретные блоки)
//   порядок: s5 показ (адрес первым → по порядку рассказа → + цены; лендинг) · s6 сам — собрать порядок нажатиями
//          (курс плавания) · s7 вопрос гостя → блок (раунды)
//   перенос и контент: s8 сам (сервер Minecraft: фото, правила, вопросы) · s9 показ (ИИ выдумал цену и телефон —
//          «Taxmin» → настоящая цена → настоящий телефон) · s10 сам (кружок роботов: настоящие цена и телефон)
//   думать промптом: g1 лишние блоки (книжный магазин: оставить нужные) · det детектив (какой порядок дал сайт; какого
//          блока не хватает гостю) · s12 почини «hamma narsa» Коди · s13 четыре строки с нуля · s14 свой сайт
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт и сайт, домашка.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite с pr.inside, insOf, blockEl): блоки вместо карточек-заглушек, ровно в
//     написанном порядке; «3 ta sharh» — число; цена и телефон из промпта, иначе придуманные с меткой «Taxmin».
//     Метки «Ichida nima?» (розовые) — у первых трёх блоков.
//   · Промпт ученика уходит ИИ всегда; проверка называет, чего не хватает.
//   · Узбекский — по /uzbekcha; в речи нет символов и цифр через тире.
//
// СИСТЕМА СЛОВ: blok — блок (ya'ni «sahifaning bir bo'limi»); lending — лендинг (ya'ni «bitta sahifali sayt»);
// kontent — контент (ya'ni «bloklar ichidagi ma'lumot»); sharh — отзыв; savol-javob — вопросы и ответы.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-03-chto-na-sajte',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: "3-dars. Saytda nima bo'ladi?",
    ru: 'Урок 3. Что должно быть на сайте?',
    en: 'Lesson 3. What goes on the site?'
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
  clear: L3('Tozalash', 'Очистить', 'Clear'),
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  kodi: L3('Kodi', 'Коди', 'Kodi'),
  hw: L3('Uyga vazifa', 'Домашнее задание', 'Homework'),
  copy: L3('Nusxalash', 'Копировать', 'Copy'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3("Sayt qanday ko'rinadi?", 'Как должен выглядеть сайт?', 'How should the site look?'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const BUY = L3('Buyurtma', 'Заказ', 'Request');
// Общие ответы проверки «Ichida nima?».
const M = {
  empty: L3("«Ichida nima?» qatoriga yozing: saytda qanday bloklar bo'ladi?", 'Напиши в строку «Что внутри?»: какие блоки будут на сайте?', 'Write in the “What’s inside?” line: which blocks go on the site?'),
  vague: L3("«Hamma narsa» desangiz, sun'iy intellekt umumiy shablon qo'yadi. Bloklarni nomma-nom yozing: menyu, rasmlar, aloqa.", 'Если написать «всё», ИИ поставит общий шаблон. Назови блоки по именам: меню, фото, контакты.', 'If you write “everything”, the AI uses a generic template. Name the blocks: menu, photos, contact.'),
  none: L3("Sun'iy intellekt bu so'zlardan blokni tanimadi. Masalan: rasmlar, narxlar, sharhlar, jadval, aloqa.", 'ИИ не узнал по этим словам ни одного блока. Например: фото, цены, отзывы, расписание, контакты.', 'The AI didn’t recognise any blocks. For example: photos, prices, reviews, schedule, contact.')
};
const C = {
  s1: {
    eyebrow: L3("Saytda nima bo'ladi?", 'Что на сайте?', 'What goes on it?'),
    say: L3("Salom! Endi promptimda uchta qator bor: nima, nega va kim uchun. Bu pitsa do'koni uchun prompt. «Yuborish»ni bosing, qani, bu safar sayt zo'r chiqarmikan?",
      'Привет! В моём промпте уже три строки: что, зачем и для кого. Это промпт для пиццерии. Нажми «Отправить» — может, в этот раз сайт выйдет идеальным?',
      'Hi! My prompt now has three lines: what, why and who for. This one is for a pizza shop. Tap “Send” and let’s see if the site is perfect this time!'),
    what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'),
    why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'),
    who: L3("pitsani yaxshi ko'radigan talabalar", 'студенты, которые любят пиццу', 'students who love pizza'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Sayt chiroyli, talabalarga mos. Lekin qarang: unda faqat uchta umumiy kartochka bor. Mehmon esa pitsalar rasmini, boshqalarning fikrini va manzilni qidiryapti, ular yo'q!",
      'Сайт красивый и подходит студентам. Но смотри: в нём только три общие карточки. А гость ищет фото пицц, отзывы и адрес — их нет!',
      'The site looks nice and suits students. But look: it only has three generic cards. The visitor is looking for pizza photos, reviews and the address, and they’re missing!'),
    done: L3("Menimcha, sun'iy intellekt saytda qanday bloklar kerakligini o'zi biladi. U axir minglab saytlarni ko'rgan! Siz nima deb o'ylaysiz? Bugun to'rtinchi savolni o'rganamiz: saytning ichida nima bo'ladi?",
      'По-моему, ИИ сам знает, какие блоки нужны на сайте. Он же видел тысячи сайтов! А ты как думаешь? Сегодня разберём четвёртый вопрос: что будет внутри сайта?',
      'I think the AI knows by itself which blocks a site needs. It’s seen thousands of sites! What do you think? Today we learn the fourth question: what goes inside the site?'),
    seen: { h: L3('Mehmon nima dedi', 'Что сказал гость', 'What the visitor said'), t: L3("Talaba: «Pitsalar qanday ko'rinadi? Boshqalar nima deydi? Do'kon qayerda?»", 'Студент: «Как выглядят пиццы? Что говорят другие? Где пиццерия?»', 'A student: “What do the pizzas look like? What do others say? Where’s the shop?”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("Saytda mehmonga kerakli bloklar yo'q", 'На сайте нет нужных гостю блоков', 'The site lacks the blocks the visitor needs')
  },
  s2: {
    eyebrow: L3('Ichida nima?', 'Что внутри?', 'What’s inside?'),
    help: [
      L3("Prompt qatoriga va saytdagi bloklar sarlavhasiga qarang.", 'Посмотри на строку промпта и на заголовки блоков сайта.', 'Look at the prompt line and at the block titles on the site.'),
      L3("Blok bu sahifaning bir bo'limi. «Ichida nima?» qatoriga qaysi bloklar kerakligini sanab chiqamiz.", 'Блок — это одна часть страницы. В строке «Что внутри?» перечисляем нужные блоки.', 'A block is one part of the page. In the “What’s inside?” line we list the blocks we need.'),
      L3("Kitob mundarijasiga o'xshaydi: boblar ro'yxatidan kitob ichida nima borligi darhol ko'rinadi.", 'Как оглавление книги: по списку глав сразу видно, что внутри.', 'It’s like a book’s table of contents: the chapter list shows what’s inside.')
    ],
    say: L3("To'rtinchi savol: saytning ichida nima bo'ladi? Sayt bloklardan yig'iladi, ya'ni sahifadagi bo'limlardan degani: menyu, rasmlar, sharhlar. Hozir qator bo'sh, shuning uchun sun'iy intellekt o'zidan uchta umumiy kartochka qo'ydi.",
      'Четвёртый вопрос: что будет внутри сайта? Сайт собирается из блоков, то есть из разделов страницы: меню, фото, отзывы. Пока строка пустая — и ИИ поставил от себя три общие карточки.',
      'The fourth question: what goes inside the site? A site is built from blocks, that is, sections of the page: a menu, photos, reviews. The line is empty for now, so the AI put three generic cards of its own.'),
    i1: L3('menyu', 'меню', 'menu'),
    i2: L3('menyu, rasmlar', 'меню, фото', 'menu, photos'),
    i3: L3('menyu, rasmlar, sharhlar va manzil', 'меню, фото, отзывы и адрес', 'menu, photos, reviews and address'),
    says: [
      L3("Yozamiz: menyu. Umumiy kartochkalar o'rniga haqiqiy menyu chiqdi: pitsalar va narxlari.", 'Пишем: меню. Вместо общих карточек появилось настоящее меню: пиццы и цены.', 'We write: menu. Instead of generic cards, a real menu appeared: pizzas and prices.'),
      L3("Rasmlarni qo'shamiz. Menyudan keyin rasmlar bloki paydo bo'ldi.", 'Добавим фото. После меню появился блок с фотографиями.', 'Let’s add photos. A photo block appeared after the menu.'),
      L3("Endi sharhlar va manzil. Har bir so'z saytda yangi blok bo'ldi, aynan yozilgan tartibda.", 'Теперь отзывы и адрес. Каждое слово стало на сайте новым блоком — ровно в том порядке, как написано.', 'Now reviews and the address. Every word became a new block, in exactly the written order.')
    ],
    done: L3("Demak, «Ichida nima?» qatoriga saytda qanday bloklar bo'lishini yozamiz. Sun'iy intellekt ularni yozilgan tartibda qo'yadi.", 'Значит, в строку «Что внутри?» пишем, какие блоки будут на сайте. ИИ ставит их в написанном порядке.', 'So in the “What’s inside?” line we write which blocks the site has. The AI places them in the order written.'),
    asks: [L3("Qarang: umumiy kartochkalar", 'Смотри: общие карточки', 'Watch: generic cards'), L3('Qarang: menyu', 'Смотри: меню', 'Watch: a menu'),
      L3("Qarang: rasmlar qo'shildi", 'Смотри: добавились фото', 'Watch: photos added'), L3('Qarang: sharhlar va manzil', 'Смотри: отзывы и адрес', 'Watch: reviews and address')],
    askDone: L3("«Ichida nima?» — saytning bloklari", '«Что внутри?» — это блоки сайта', '“What’s inside?” is the site’s blocks')
  },
  s3: {
    eyebrow: L3('Qanday bloklar?', 'Какие блоки?', 'Which blocks?'),
    card: { h: BUY, t: L3("Ota-onalar doim so'raydi: «Mashg'ulotlar qachon? Murabbiylar kim? Klub qayerda?»", 'Родители всегда спрашивают: «Когда тренировки? Кто тренеры? Где клуб?»', 'Parents always ask: “When are practices? Who are the coaches? Where’s the club?”') },
    say: L3("Endi siz. Futbol klubi sayt so'radi. Uchta qator tayyor. Buyurtmadagi savollarni o'qing va «Ichida nima?» qatoriga ularga javob beradigan bloklarni yozing.",
      'Теперь ты. Футбольный клуб попросил сайт. Три строки готовы. Прочитай вопросы в заказе и напиши в строку «Что внутри?» блоки, которые на них отвечают.',
      'Your turn. A football club asked for a site. Three lines are ready. Read the questions in the request and write in the “What’s inside?” line the blocks that answer them.'),
    what: L3('Futbol klubimiz sayti', 'Сайт нашего футбольного клуба', 'Our football club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("futbolni yaxshi ko'radigan 10–12 yoshli bolalar", 'дети 10–12 лет, которые любят футбол', 'kids aged 10–12 who love football'),
    ph: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    msgs: {
      schedule: L3("Mashg'ulotlar qachon? Bu savolga jadval javob beradi.", 'Когда тренировки? На это отвечает расписание.', 'When are practices? The schedule answers that.'),
      team: L3("Murabbiylar kim? Ular uchun ham blok kerak.", 'Кто тренеры? Для них тоже нужен блок.', 'Who are the coaches? They need a block too.'),
      contact: L3("Klub qayerda? Manzil yoki aloqa bloki kerak.", 'Где клуб? Нужен блок с адресом или контактами.', 'Where’s the club? You need an address or contact block.')
    },
    hints: [
      L3("Buyurtmada uchta savol bor. Har bir savolga bitta blok.", 'В заказе три вопроса. На каждый — свой блок.', 'The request has three questions. One block for each.'),
      L3("Qachon bu jadval. Kim bu murabbiylar. Qayerda bu manzil.", '«Когда» — это расписание. «Кто» — тренеры. «Где» — адрес.', '“When” is the schedule. “Who” is the coaches. “Where” is the address.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('jadval, murabbiylar, manzil', 'расписание, тренеры, адрес', 'schedule, coaches, address'),
    ok: L3("Zo'r! Saytda jadval, murabbiylar va manzil bloklari chiqdi. Endi ota-onalar har bir savoliga javob topadi.", 'Огонь! На сайте появились расписание, тренеры и адрес. Теперь родители найдут ответ на каждый вопрос.', 'Awesome! The schedule, coaches and address blocks appeared. Now parents can answer every question.'),
    ask: L3("«Ichida nima?» qatorini yozing", 'Напиши строку «Что внутри?»', 'Write the “What’s inside?” line')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Endi o'zingizni sinab ko'ring. Ikki «Ichida nima?» dan qaysi biri sun'iy intellektga ko'proq yordam beradi?", 'Теперь проверь себя. Какое из двух «Что внутри?» больше поможет ИИ?', 'Now check yourself. Which of the two “What’s inside?” lines helps the AI more?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi «Ichida nima?» aniqroq?", 'Какое «Что внутри?» точнее?', 'Which “What’s inside?” is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi birida bloklar nomma-nom aytilgan?", 'Где блоки названы по именам?', 'Which one names the blocks?'),
    hint2: L3("«Hamma narsa», «zo'r bo'limlar» juda umumiy: sun'iy intellekt ulardan blok yasay olmaydi.", '«Всё», «крутые разделы» — слишком общие: из них ИИ блоки не сделает.', '“Everything” or “cool sections” are too general: the AI can’t make blocks from them.'),
    items: [
      { a: L3('hamma narsa', 'всё', 'everything'), b: L3('menyu, narxlar, manzil', 'меню, цены, адрес', 'menu, prices, address'), right: 'b',
        why: L3("Ikkinchisida har bir blok nomi bor.", 'Во втором назван каждый блок.', 'The second one names every block.') },
      { a: L3('rasmlar, sharhlar, aloqa', 'фото, отзывы, контакты', 'photos, reviews, contact'), b: L3("zo'r bo'limlar", 'крутые разделы', 'cool sections'), right: 'a',
        why: L3("Birinchisi aniq: uchta blok sanab o'tilgan.", 'Первый точный: перечислены три блока.', 'The first one is precise: three blocks are listed.') },
      { a: L3('kerakli narsalar', 'всё нужное', 'all the necessary stuff'), b: L3("jadval, ustozlar, savol-javob", 'расписание, наставники, вопросы и ответы', 'schedule, teachers, FAQ'), right: 'b',
        why: L3("Kerakli narsa nima ekanini faqat siz bilasiz. Ikkinchisida u yozilgan.", 'Что именно нужно — знаешь только ты. Во втором это написано.', 'Only you know what’s needed. The second one says it.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Umumiy so'zni aniq bloklardan ajratasiz.", 'Всё верно! Ты отличаешь общее слово от точных блоков.', 'All correct! You can tell a general word from precise blocks.')
  },
  s5: {
    eyebrow: L3('Bloklar tartibi', 'Порядок блоков', 'Block order'),
    help: [
      L3("Prompt qatoridagi so'zlar tartibiga va saytdagi bloklar tartibiga qarang.", 'Посмотри на порядок слов в строке промпта и на порядок блоков на сайте.', 'Look at the word order in the prompt line and the block order on the site.'),
      L3("Lending, ya'ni bitta sahifali sayt degani, hikoyaga o'xshaydi: oldin nima borligi, keyin ishonch, oxirida harakat.", 'Лендинг — одностраничный сайт — похож на рассказ: сначала что у нас есть, потом доверие, в конце действие.', 'A landing page, that is, a one-page site, is like a story: first what we offer, then trust, and finally action.'),
      L3("Do'stingizga kino haqida gapirganda, oxiridan boshlamaysiz. Sayt ham boshidan oxirigacha o'qiladi.", 'Рассказывая другу про фильм, ты не начинаешь с конца. Сайт тоже читают сверху вниз.', 'When you tell a friend about a film, you don’t start at the end. A site is read top to bottom too.')
    ],
    say: L3("Bloklar tartibi ham muhim. Qarang, men aloqani birinchi yozdim. Mehmon hali lagerni ko'rmay turib, telefon raqamini ko'ryapti. G'alati, to'g'rimi?",
      'Порядок блоков тоже важен. Смотри, я написал контакты первыми. Гость ещё не видел лагерь, а ему уже показывают телефон. Странно, правда?',
      'Block order matters too. Look, I wrote the contact first. The visitor sees a phone number before they’ve even seen the camp. Odd, right?'),
    what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'),
    why: L3('bolalar lagerga yozilsin', 'чтобы детей записывали в лагерь', 'get kids signed up for camp'),
    who: L3('8–12 yoshli bolalar', 'дети 8–12 лет', 'kids aged 8–12'),
    o0: L3('aloqa, sharhlar, rasmlar', 'контакты, отзывы, фото', 'contact, reviews, photos'),
    o1: L3('rasmlar, sharhlar, aloqa', 'фото, отзывы, контакты', 'photos, reviews, contact'),
    o2: L3('rasmlar, narxlar, sharhlar, aloqa', 'фото, цены, отзывы, контакты', 'photos, prices, reviews, contact'),
    says: [
      L3("Tartibni o'zgartiramiz: rasmlar, sharhlar, keyin aloqa. Qarang, bloklar ham joy almashdi. Sun'iy intellekt aynan yozilgan tartibni qiladi.", 'Меняем порядок: фото, отзывы, потом контакты. Смотри, блоки тоже поменялись местами. ИИ делает ровно написанный порядок.', 'We change the order: photos, reviews, then contact. Look, the blocks swapped places too. The AI follows exactly the written order.'),
      L3("Narxlarni rasmlardan keyin qo'shamiz. Endi bu hikoyaga o'xshaydi: oldin lagerni ko'ramiz, keyin narx va fikrlar, oxirida bog'lanamiz. Bunday bitta sahifali saytni lending deyishadi.", 'Добавим цены после фото. Теперь это как рассказ: сначала видим лагерь, потом цены и отзывы, в конце связываемся. Такой одностраничный сайт называют лендингом.', 'Let’s add prices after the photos. Now it’s like a story: first we see the camp, then prices and reviews, and finally we get in touch. A one-page site like this is called a landing page.')
    ],
    done: L3("Demak, bloklarni mehmon o'qiydigan tartibda yozing: oldin nima borligini ko'rsating, keyin ishonch, oxirida harakat.", 'Значит, пиши блоки в том порядке, в каком их читает гость: сначала покажи, что есть, потом доверие, в конце действие.', 'So write the blocks in the order a visitor reads them: first show what you offer, then trust, finally action.'),
    asks: [L3('Qarang: aloqa birinchi', 'Смотри: контакты первыми', 'Watch: contact first'), L3("Qarang: to'g'ri tartib", 'Смотри: правильный порядок', 'Watch: the right order'), L3('Qarang: lending', 'Смотри: лендинг', 'Watch: a landing page')],
    askDone: L3('Bloklar yozilgan tartibda chiqadi', 'Блоки идут в написанном порядке', 'Blocks follow the written order')
  },
  s6: {
    eyebrow: L3("Tartibni yig'ing", 'Собери порядок', 'Build the order'),
    card: { h: BUY, t: L3("Mehmon oldin hovuz rasmlarini ko'rsin, keyin narxni bilsin, keyin boshqa ota-onalar fikrini o'qisin, oxirida qo'ng'iroq qilsin.", 'Пусть гость сначала увидит фото бассейна, потом узнает цену, потом прочитает отзывы других родителей, а в конце позвонит.', 'The visitor should first see photos of the pool, then learn the price, then read other parents’ reviews, and finally call.') },
    say: L3("Endi siz. Suzish kursi sayt so'radi. Bloklarni buyurtmadagi tartibda bosing: ular «Ichida nima?» qatoriga tushadi. Keyin «Yuborish»ni bosing.",
      'Теперь ты. Курс плавания попросил сайт. Нажимай блоки в том порядке, как в заказе: они попадут в строку «Что внутри?». Потом нажми «Отправить».',
      'Your turn. A swimming course asked for a site. Tap the blocks in the order from the request: they go into the “What’s inside?” line. Then tap “Send”.'),
    what: L3('Suzish kursi sayti', 'Сайт курса плавания', 'A swimming course site'),
    why: L3('bolalar kursga yozilsin', 'чтобы детей записывали на курс', 'get kids signed up for the course'),
    who: L3('6–9 yoshli bolalar va ularning ota-onalari', 'дети 6–9 лет и их родители', 'kids aged 6–9 and their parents'),
    chips: { reviews: L3('Sharhlar', 'Отзывы', 'Reviews'), contact: L3('Aloqa', 'Контакты', 'Contact'), gallery: L3('Rasmlar', 'Фото', 'Photos'), prices: L3('Narxlar', 'Цены', 'Prices') },
    ph: L3('bloklarni tartib bilan bosing', 'нажимай блоки по порядку', 'tap the blocks in order'),
    msgs: {
      empty: L3("Bloklarni bosing: ular «Ichida nima?» qatoriga tushadi.", 'Нажимай блоки: они попадут в строку «Что внутри?».', 'Tap the blocks: they go into the “What’s inside?” line.'),
      short: L3("Hali hamma blok yo'q: buyurtmada to'rtta narsa bor.", 'Ещё не все блоки: в заказе четыре вещи.', 'Not all the blocks yet: the request has four things.'),
      order: L3("Bloklar bor, lekin tartibi boshqacha. Buyurtmani qayta o'qing: mehmon oldin nimani ko'radi?", 'Блоки есть, но порядок другой. Перечитай заказ: что гость видит сначала?', 'The blocks are there, but the order is different. Re-read the request: what does the visitor see first?')
    },
    hints: [
      L3("Buyurtmadagi so'zlarga qarang: oldin, keyin, oxirida.", 'Смотри на слова в заказе: сначала, потом, в конце.', 'Look at the words in the request: first, then, finally.'),
      L3("Oldin rasmlar, oxirida aloqa. O'rtada narxlar va sharhlar.", 'Сначала фото, в конце контакты. В середине цены и отзывы.', 'Photos first, contact last. Prices and reviews in between.'),
      L3("Namunadagi tartibda bosing va Yuborishni bosing.", 'Нажми блоки как в образце и нажми «Отправить».', 'Tap the blocks in the example’s order and tap Send.')
    ],
    sample: L3('rasmlar, narxlar, sharhlar, aloqa', 'фото, цены, отзывы, контакты', 'photos, prices, reviews, contact'),
    ok: L3("Ajoyib! Bloklar aynan buyurtmadagi tartibda: rasmlar, narxlar, sharhlar va aloqa. Bu haqiqiy lending!", 'Класс! Блоки ровно в порядке заказа: фото, цены, отзывы и контакты. Настоящий лендинг!', 'Great! The blocks are in the exact order of the request: photos, prices, reviews and contact. A real landing page!'),
    ask: L3('Bloklarni tartib bilan bosing', 'Нажми блоки по порядку', 'Tap the blocks in order')
  },
  s7: {
    eyebrow: L3('Qaysi blok?', 'Какой блок?', 'Which block?'),
    say: L3("Har bir blok mehmonning bitta savoliga javob beradi. Men savol aytaman, siz qaysi blok javob berishini tanlang.", 'Каждый блок отвечает на один вопрос гостя. Я говорю вопрос, а ты выбираешь, какой блок на него отвечает.', 'Each block answers one visitor question. I say a question, and you choose which block answers it.'),
    card: L3('Mehmon savoli', 'Вопрос гостя', 'Visitor’s question'),
    ask: L3('Javob beradigan blokni tanlang', 'Выбери блок, который отвечает', 'Pick the block that answers'),
    hint1: L3("Savoldagi so'zga qarang: qancha, qayerda, qachon, kim?", 'Смотри на слово в вопросе: сколько, где, когда, кто?', 'Look at the question word: how much, where, when, who?'),
    hint2: L3("Qancha bu narxlar. Qayerda bu aloqa. Qachon bu jadval. Boshqalar nima deydi bu sharhlar.", '«Сколько» — цены. «Где» — контакты. «Когда» — расписание. «Что говорят другие» — отзывы.', '“How much” is prices. “Where” is contact. “When” is the schedule. “What do others say” is reviews.'),
    items: [
      { t: L3('Qancha turadi?', 'Сколько стоит?', 'How much is it?'), opts: ['prices', 'gallery', 'reviews'], right: 'prices', why: L3("Narxni narxlar bloki aytadi.", 'Цену показывает блок цен.', 'The prices block shows the cost.') },
      { t: L3('Qayerda joylashgan?', 'Где это находится?', 'Where is it?'), opts: ['schedule', 'contact', 'team'], right: 'contact', why: L3("Manzil aloqa blokida bo'ladi.", 'Адрес — в блоке контактов.', 'The address is in the contact block.') },
      { t: L3('Boshqalar nima deydi?', 'Что говорят другие?', 'What do others say?'), opts: ['faq', 'prices', 'reviews'], right: 'reviews', why: L3("Boshqalarning fikri sharhlarda.", 'Мнения других — в отзывах.', 'Other people’s opinions are in the reviews.') },
      { t: L3("Mashg'ulot qachon?", 'Когда занятия?', 'When are the classes?'), opts: ['schedule', 'gallery', 'contact'], right: 'schedule', why: L3("Kun va vaqt jadvalda yoziladi.", 'Дни и время — в расписании.', 'Days and times are in the schedule.') },
      { t: L3("Qanday ko'rinadi?", 'Как это выглядит?', 'What does it look like?'), opts: ['team', 'rules', 'gallery'], right: 'gallery', why: L3("Ko'rinishini rasmlar ko'rsatadi.", 'Как выглядит — показывают фото.', 'Photos show what it looks like.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Har bir savolga kerakli blokni topasiz.", 'Класс! Ты находишь блок на каждый вопрос.', 'Great! You find the right block for every question.')
  },
  s8: {
    eyebrow: L3('Yangi buyurtma', 'Новый заказ', 'A new request'),
    card: { h: BUY, t: L3("Yangi o'yinchilar doim so'raydi: «Server qanday ko'rinadi? Qanday qoidalar bor? Savollarimga javob qayerda?»", 'Новые игроки всегда спрашивают: «Как выглядит сервер? Какие правила? Где ответы на мои вопросы?»', 'New players always ask: “What does the server look like? What are the rules? Where are the answers to my questions?”') },
    say: L3("Yangi buyurtma! Minecraft serveri sayt so'radi. O'yinchilar savollarini o'qing va «Ichida nima?» qatoriga kerakli bloklarni yozing.",
      'Новый заказ! Сервер Minecraft попросил сайт. Прочитай вопросы игроков и напиши в строку «Что внутри?» нужные блоки.',
      'A new request! A Minecraft server asked for a site. Read the players’ questions and write the blocks they need in the “What’s inside?” line.'),
    what: L3('Minecraft serverimiz sayti', 'Сайт нашего сервера Minecraft', 'Our Minecraft server site'),
    why: L3("o'yinchilar serverga qo'shilsin", 'чтобы игроки вступали на сервер', 'get players to join the server'),
    who: L3("qurishni yaxshi ko'radigan 10–13 yoshli o'yinchilar", 'игроки 10–13 лет, которые любят строить', 'players aged 10–13 who love building'),
    ph: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    msgs: {
      gallery: L3("Server qanday ko'rinadi? Buni rasmlar ko'rsatadi.", 'Как выглядит сервер? Это покажут фото.', 'What does the server look like? Photos show that.'),
      rules: L3("Qanday qoidalar bor? Qoidalar bloki kerak.", 'Какие правила? Нужен блок правил.', 'What are the rules? You need a rules block.'),
      faq: L3("Savollarga javob qayerda? Savol-javob bloki kerak.", 'Где ответы на вопросы? Нужен блок вопросов и ответов.', 'Where are the answers? You need an FAQ block.')
    },
    hints: [
      L3("O'yinchilarda uchta savol bor. Har biriga bitta blok.", 'У игроков три вопроса. На каждый — свой блок.', 'The players have three questions. One block for each.'),
      L3("Ko'rinish bu rasmlar. Qoidalar bu qoidalar. Savollar bu savol-javob.", 'Как выглядит — фото. Правила — правила. Вопросы — вопросы и ответы.', 'Looks are photos. Rules are rules. Questions are an FAQ.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('rasmlar, qoidalar, savol-javob', 'фото, правила, вопросы и ответы', 'photos, rules, FAQ'),
    ok: L3("Zo'r! Rasmlar, qoidalar va savol-javob chiqdi. Endi yangi o'yinchi hamma narsani saytdan topadi.", 'Огонь! Появились фото, правила и вопросы с ответами. Теперь новичок найдёт всё на сайте.', 'Awesome! Photos, rules and an FAQ appeared. Now a new player finds everything on the site.'),
    ask: L3("«Ichida nima?» qatorini yozing", 'Напиши строку «Что внутри?»', 'Write the “What’s inside?” line')
  },
  s9: {
    eyebrow: L3('Kontent', 'Контент', 'Content'),
    help: [
      L3("Narx va telefon yonidagi kulrang «Taxmin» belgilariga qarang.", 'Посмотри на серые метки «Догадка» у цены и телефона.', 'Look at the grey “Guess” labels next to the price and phone.'),
      L3("Kontent, ya'ni bloklar ichidagi ma'lumot degani. Yozilmagan raqamlarni sun'iy intellekt o'zi o'ylab topadi.", 'Контент — это то, что внутри блоков. Не написанные цифры ИИ придумывает сам.', 'Content is what’s inside the blocks. Numbers you don’t write, the AI makes up.'),
      L3("Do'stingizga telefon raqamingizni aytmasangiz, u taxmin qilib boshqa raqamga qo'ng'iroq qiladi.", 'Не скажешь другу свой номер — он наберёт наугад и попадёт не туда.', 'If you don’t tell a friend your number, they’ll guess and call the wrong one.')
    ],
    say: L3("Endi kontent haqida, ya'ni bloklar ichidagi ma'lumot degani. Qarang, men faqat «narxlar va aloqa» deb yozdim. Narx ham, telefon ham chiqdi. Lekin ularni sun'iy intellekt o'zi o'ylab topdi! Bu raqamlar haqiqiy emas.",
      'Теперь про контент — то, что внутри блоков. Смотри, я написал только «цены и контакты». И цена, и телефон появились. Но их ИИ придумал сам! Эти цифры не настоящие.',
      'Now about content, that is, what’s inside the blocks. Look, I wrote only “prices and contact”. A price and a phone number appeared. But the AI made them up! These numbers aren’t real.'),
    what: L3('Rasm kursi sayti', 'Сайт курса рисования', 'A drawing course site'),
    why: L3('bolalar kursga yozilsin', 'чтобы дети записывались на курс', 'get kids to sign up for the course'),
    who: L3('9–12 yoshli bolalar', 'дети 9–12 лет', 'kids aged 9–12'),
    c0: L3('narxlar va aloqa', 'цены и контакты', 'prices and contact'),
    c1: L3("narxlar: oyiga 150 000 so'm, aloqa", 'цены: 150 000 сум в месяц, контакты', 'prices: 150,000 sum a month, contact'),
    c2: L3("narxlar: oyiga 150 000 so'm, aloqa: +998 90 555 11 22", 'цены: 150 000 сум в месяц, контакты: +998 90 555 11 22', 'prices: 150,000 sum a month, contact: +998 90 555 11 22'),
    says: [
      L3("Haqiqiy narxni yozamiz: oyiga bir yuz ellik ming so'm. Endi saytda aynan shu narx, taxmin yo'q.", 'Пишем настоящую цену: сто пятьдесят тысяч сумов в месяц. Теперь на сайте именно она, без догадок.', 'We write the real price: one hundred and fifty thousand sum a month. Now the site shows exactly that, no guessing.'),
      L3("Telefon raqamini ham qo'shamiz. Endi hamma ma'lumot haqiqiy: mehmon to'g'ri raqamga qo'ng'iroq qiladi.", 'Добавим и телефон. Теперь всё настоящее: гость позвонит по правильному номеру.', 'Let’s add the phone number too. Now everything is real: the visitor will call the right number.')
    ],
    done: L3("Demak, narx, telefon va manzil kabi aniq ma'lumotlarni promptga o'zingiz yozing. Aks holda sun'iy intellekt ularni o'ylab topadi.", 'Значит, точные данные — цену, телефон, адрес — пиши в промпт сам. Иначе ИИ их придумает.', 'So write exact details like the price, phone and address into the prompt yourself. Otherwise the AI makes them up.'),
    asks: [L3("Qarang: raqamlar o'ylab topilgan", 'Смотри: цифры придуманы', 'Watch: made-up numbers'), L3('Qarang: haqiqiy narx', 'Смотри: настоящая цена', 'Watch: the real price'), L3('Qarang: haqiqiy telefon', 'Смотри: настоящий телефон', 'Watch: the real phone')],
    askDone: L3("Aniq ma'lumotni o'zingiz yozing", 'Точные данные пиши сам', 'Write exact details yourself')
  },
  s10: {
    eyebrow: L3("Haqiqiy ma'lumot", 'Настоящие данные', 'Real details'),
    card: { h: BUY, t: L3("Robot kursi: oyiga 200 000 so'm, telefon +998 91 234 56 78. Saytda narx va aloqa bo'lsin, raqamlar to'g'ri bo'lsin.", 'Курс роботов: 200 000 сум в месяц, телефон +998 91 234 56 78. На сайте нужны цены и контакты — с правильными цифрами.', 'Robot course: 200,000 sum a month, phone +998 91 234 56 78. The site needs prices and contact, with the right numbers.') },
    say: L3("Endi siz. Robot kursi sayt so'radi. «Ichida nima?» qatoriga narx va aloqa bloklarini yozing, ichiga buyurtmadagi haqiqiy narx va telefonni qo'shing.",
      'Теперь ты. Курс роботов попросил сайт. Напиши в строку «Что внутри?» блоки цен и контактов и добавь настоящие цену и телефон из заказа.',
      'Your turn. A robot course asked for a site. In the “What’s inside?” line write the prices and contact blocks, and add the real price and phone from the request.'),
    what: L3('Robot kursi sayti', 'Сайт курса роботов', 'A robot course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'),
    ph: L3('bloklar va ularning ichidagi raqamlar', 'блоки и цифры внутри', 'blocks and the numbers inside'),
    msgs: {
      blocks: L3("Narx va aloqa bloklari kerak: buyurtmani o'qing.", 'Нужны блоки цен и контактов: прочитай заказ.', 'You need prices and contact blocks: read the request.'),
      noPrice: L3("Narx bloki bor, lekin narx yozilmagan: sun'iy intellekt o'zi o'ylab topdi. Buyurtmadagi narxni yozing.", 'Блок цен есть, но цена не написана — ИИ её придумал. Напиши цену из заказа.', 'There’s a prices block, but no price: the AI made one up. Write the price from the request.'),
      badPrice: L3("Bu narx buyurtmadagidan boshqacha. Qayta tekshiring.", 'Эта цена отличается от заказа. Проверь ещё раз.', 'That price doesn’t match the request. Check again.'),
      noPhone: L3("Aloqa bloki bor, lekin telefon yozilmagan: sun'iy intellekt o'zi o'ylab topdi. Buyurtmadagi raqamni yozing.", 'Блок контактов есть, но телефона нет — ИИ его придумал. Напиши номер из заказа.', 'There’s a contact block, but no phone: the AI made one up. Write the number from the request.'),
      badPhone: L3("Telefon raqami buyurtmadagidan boshqacha. Raqamlarni qayta tekshiring.", 'Номер отличается от заказа. Проверь цифры.', 'The number doesn’t match the request. Check the digits.')
    },
    hints: [
      L3("Buyurtmada ikki raqam bor: narx va telefon.", 'В заказе две цифры: цена и телефон.', 'The request has two numbers: the price and the phone.'),
      L3("Blok nomidan keyin ikki nuqta qo'yib, raqamni yozing.", 'После названия блока поставь двоеточие и напиши цифры.', 'After the block name put a colon and write the number.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("narxlar: oyiga 200 000 so'm, aloqa: +998 91 234 56 78", 'цены: 200 000 сум в месяц, контакты: +998 91 234 56 78', 'prices: 200,000 sum a month, contact: +998 91 234 56 78'),
    ok: L3("Barakalla! Saytda haqiqiy narx va telefon, «Taxmin» belgilari yo'q. Endi ota-onalar to'g'ri raqamga qo'ng'iroq qiladi.", 'Молодец! На сайте настоящие цена и телефон, меток «Догадка» нет. Теперь родители позвонят по правильному номеру.', 'Well done! The site shows the real price and phone, with no “Guess” labels. Now parents will call the right number.'),
    ask: L3('Narx va telefonni yozing', 'Напиши цену и телефон', 'Write the price and phone')
  },
  g1: {
    eyebrow: L3('Ortiqcha bloklar', 'Лишние блоки', 'Too many blocks'),
    card: { h: BUY, t: L3("Do'kon egasi: «Juda uzun! Bizda menyu ham, ustozlar ham, jadval ham yo'q. Mehmonga kitob rasmlari, narxlar va manzil kerak, xolos».", 'Владелец магазина: «Слишком длинно! У нас нет ни меню, ни наставников, ни расписания. Гостю нужны только фото книг, цены и адрес».', 'The shop owner: “Way too long! We have no menu, no teachers, no schedule. Visitors only need book photos, prices and the address.”') },
    say: L3("Men kitob do'koni uchun hamma blokni yozib chiqdim: menyu, jadval, ustozlar va yana ko'p narsa. Qarang, sayt juda uzun bo'ldi, keraksiz narsalar ko'p. Do'kon egasi nima deyapti? Ortiqchasini o'chiring.",
      'Я написал для книжного магазина все блоки подряд: меню, расписание, наставников и ещё много всего. Смотри, сайт стал очень длинным, лишнего полно. Что говорит владелец? Удали лишнее.',
      'I wrote every block for the bookshop: a menu, a schedule, teachers and lots more. Look, the site got really long, full of useless stuff. What does the owner say? Delete the extras.'),
    what: L3("Kitob do'koni sayti", 'Сайт книжного магазина', 'A bookshop site'),
    why: L3('odamlar kitob buyurtma qilsin', 'чтобы люди заказывали книги', 'get people to order books'),
    who: L3("kitob o'qishni yaxshi ko'radigan o'smirlar", 'подростки, которые любят читать', 'teens who love reading'),
    bad: L3("menyu, rasmlar, jadval, narxlar, ustozlar, qoidalar, savol-javob, sharhlar, aloqa", 'меню, фото, расписание, цены, наставники, правила, вопросы и ответы, отзывы, контакты', 'menu, photos, schedule, prices, teachers, rules, FAQ, reviews, contact'),
    ph: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    msgs: {
      extra: L3("Hali ortiqcha bloklar bor. Do'kon egasi faqat uchtasini so'radi.", 'Ещё остались лишние блоки. Владелец просил только три.', 'There are still extra blocks. The owner asked for only three.'),
      missing: L3("Kerakli blokni ham o'chirib yubordingiz: rasmlar, narxlar va aloqa qolsin.", 'Ты удалил и нужный блок: пусть останутся фото, цены и контакты.', 'You deleted a needed block too: keep photos, prices and contact.')
    },
    hints: [
      L3("Do'kon egasi qaysi uchta narsa kerakligini aytdi?", 'Какие три вещи назвал владелец?', 'Which three things did the owner name?'),
      L3("Menyu, jadval, ustozlar, qoidalar, savol-javob va sharhlarni o'chiring.", 'Удали меню, расписание, наставников, правила, вопросы и отзывы.', 'Delete the menu, schedule, teachers, rules, FAQ and reviews.'),
      L3("Namunadagidek qoldiring va Yuborishni bosing.", 'Оставь как в образце и нажми «Отправить».', 'Leave it like the example and tap Send.')
    ],
    sample: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    ok: L3("Zo'r! Sayt qisqa va tushunarli bo'ldi: rasmlar, narxlar va aloqa. Mehmon endi adashmaydi.", 'Огонь! Сайт стал коротким и понятным: фото, цены и контакты. Гость больше не запутается.', 'Awesome! The site is short and clear now: photos, prices and contact. Visitors won’t get lost.'),
    ask: L3("Ortiqcha bloklarni o'chiring", 'Удали лишние блоки', 'Delete the extra blocks')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi detektiv bo'lamiz. Saytga qarab topamiz: qaysi «Ichida nima?» shu saytni yaratdi va mehmonga qaysi blok yetishmaydi?",
      'Теперь побудем детективами. По сайту найдём: какое «Что внутри?» дало этот сайт и какого блока не хватает гостю?',
      'Let’s be detectives. From the site we’ll work out which “What’s inside?” made it and which block the visitor is missing.'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3("Qaysi «Ichida nima?» shu saytni yaratdi?", 'Какое «Что внутри?» дало этот сайт?', 'Which “What’s inside?” made this site?'),
    qMiss: L3('Mehmonga qaysi blok yetishmaydi?', 'Какого блока не хватает гостю?', 'Which block is the visitor missing?'),
    wantH: L3('Mehmon savoli', 'Вопрос гостя', 'Visitor’s question'),
    hint1: L3("Bloklar sarlavhasini yuqoridan pastga o'qing.", 'Прочитай заголовки блоков сверху вниз.', 'Read the block titles from top to bottom.'),
    hint2: L3("Saytdagi tartib promptdagi tartib bilan bir xil. Savolga javob bermaydigan blok yo'q bo'lsa, o'shani qo'shish kerak.", 'Порядок на сайте такой же, как в промпте. Если на вопрос гостя нет блока — его и нужно добавить.', 'The order on the site matches the prompt. If no block answers the visitor’s question, that’s the one to add.'),
    items: [
      { type: 'which', site: { what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'), why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'), inside: L3('rasmlar, menyu, aloqa', 'фото, меню, контакты', 'photos, menu, contact') },
        a: L3('menyu, rasmlar, aloqa', 'меню, фото, контакты', 'menu, photos, contact'), b: L3('rasmlar, menyu, aloqa', 'фото, меню, контакты', 'photos, menu, contact'), c: L3('rasmlar, sharhlar, aloqa', 'фото, отзывы, контакты', 'photos, reviews, contact'),
        right: 'b', why: L3("Saytda oldin rasmlar, keyin menyu, oxirida aloqa. Bu B.", 'На сайте сначала фото, потом меню, в конце контакты. Это B.', 'The site has photos first, then the menu, then contact. That’s B.') },
      { type: 'miss', site: { what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'), why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'), inside: L3('menyu, rasmlar', 'меню, фото', 'menu, photos') },
        want: L3("Mijoz: «Do'koningiz qayerda joylashgan?»", 'Клиент: «А где находится пиццерия?»', 'A customer: “Where is your shop?”'), opts: ['contact', 'reviews', 'prices'], right: 'contact',
        why: L3("Manzil yo'q: aloqa blokini qo'shish kerak.", 'Адреса нет: нужно добавить блок контактов.', 'There’s no address: add a contact block.') },
      { type: 'which', site: { what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'), why: L3('bolalar lagerga yozilsin', 'чтобы детей записывали в лагерь', 'get kids signed up for camp'), inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact') },
        a: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'), b: L3('narxlar, jadval, aloqa', 'цены, расписание, контакты', 'prices, schedule, contact'), c: L3('jadval, rasmlar, aloqa', 'расписание, фото, контакты', 'schedule, photos, contact'),
        right: 'a', why: L3("Oldin jadval, keyin narxlar, oxirida aloqa. Bu A.", 'Сначала расписание, потом цены, в конце контакты. Это A.', 'Schedule first, then prices, then contact. That’s A.') },
      { type: 'miss', site: { what: L3('Suzish kursi sayti', 'Сайт курса плавания', 'A swimming course site'), why: L3('bolalar kursga yozilsin', 'чтобы детей записывали на курс', 'get kids signed up for the course'), inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact') },
        want: L3("Ona: «Boshqa ota-onalar bu kurs haqida nima deydi?»", 'Мама: «А что говорят о курсе другие родители?»', 'A mum: “What do other parents say about this course?”'), opts: ['schedule', 'reviews', 'gallery'], right: 'reviews',
        why: L3("Boshqalarning fikri yo'q: sharhlar bloki kerak.", 'Мнений других нет: нужен блок отзывов.', 'There are no opinions from others: a reviews block is needed.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Saytga qarab bloklarni o'qiysiz va nima yetishmasligini topasiz.", 'Класс! Ты читаешь блоки сайта и находишь, чего не хватает.', 'Great! You read a site’s blocks and spot what’s missing.')
  },
  s12: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("Ota-onalar so'raydi: «Lager qanday ko'rinadi? Narxi qancha? Qayerga qo'ng'iroq qilsa bo'ladi?»", 'Родители спрашивают: «Как выглядит лагерь? Сколько стоит? Куда звонить?»', 'Parents ask: “What does the camp look like? How much is it? Who do we call?”') },
    say: L3("Voy, men lager sayti uchun «Ichida nima?» qatoriga «hamma narsa bo'lsin» deb yozdim. Sun'iy intellekt umumiy kartochkalar qo'ydi, xolos. Ota-onalar savollarini o'qing va mening qatorimni tuzating.",
      'Ой, я написал для сайта лагеря в строку «Что внутри?» «пусть будет всё». ИИ поставил только общие карточки. Прочитай вопросы родителей и исправь мою строку.',
      'Oops, for the camp site I wrote “put everything” in the “What’s inside?” line. The AI just added generic cards. Read the parents’ questions and fix my line.'),
    what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'),
    why: L3('bolalar lagerga yozilsin', 'чтобы детей записывали в лагерь', 'get kids signed up for camp'),
    who: L3('8–12 yoshli bolalarning ota-onalari', 'родители детей 8–12 лет', 'parents of kids aged 8–12'),
    bad: L3("hamma narsa bo'lsin", 'пусть будет всё', 'put everything'),
    ph: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    msgs: {
      vague: L3("«Hamma narsa» hali turibdi. Ota-onalarning uchta savoliga uchta blok yozing.", '«Всё» ещё на месте. Напиши три блока на три вопроса родителей.', '“Everything” is still there. Write three blocks for the parents’ three questions.'),
      gallery: L3("Lager qanday ko'rinadi? Buni rasmlar ko'rsatadi.", 'Как выглядит лагерь? Это покажут фото.', 'What does the camp look like? Photos show that.'),
      prices: L3("Narxi qancha? Narxlar bloki kerak.", 'Сколько стоит? Нужен блок цен.', 'How much is it? You need a prices block.'),
      contact: L3("Qayerga qo'ng'iroq qilish kerak? Aloqa bloki kerak.", 'Куда звонить? Нужен блок контактов.', 'Who do they call? You need a contact block.')
    },
    hints: [
      L3("Ota-onalarda uchta savol bor. Har biriga bitta blok.", 'У родителей три вопроса. На каждый — свой блок.', 'The parents have three questions. One block for each.'),
      L3("«Hamma narsa bo'lsin» ni o'chiring va rasmlar, narxlar, aloqa deb yozing.", 'Сотри «пусть будет всё» и напиши: фото, цены, контакты.', 'Delete “put everything” and write: photos, prices, contact.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    ok: L3("Ajoyib! Umumiy kartochkalar ketdi: rasmlar, narxlar va aloqa chiqdi. Ota-onalar endi hammasini topadi.", 'Класс! Общие карточки ушли: появились фото, цены и контакты. Теперь родители найдут всё.', 'Great! The generic cards are gone: photos, prices and contact appeared. Now parents can find everything.'),
    ask: L3("«Hamma narsa» ni tuzating", 'Исправь «всё»', 'Fix “everything”')
  },
  s13: {
    eyebrow: L3("To'rtala qator", 'Все четыре строки', 'All four lines'),
    card: { h: BUY, t: L3("Maktab oshxonasi sayt so'rayapti. O'quvchilar tushlikka buyurtma bersin. Sayt 10–14 yoshli o'quvchilar uchun. Saytda menyu, narxlar va savol-javob bo'lsin.", 'Школьная столовая просит сайт. Пусть ученики заказывают обед. Сайт для школьников 10–14 лет. На нём нужны меню, цены и вопросы с ответами.', 'The school canteen wants a site. Students should order lunch. The site is for students aged 10–14. It needs a menu, prices and an FAQ.') },
    say: L3("Endi to'rtala qatorni o'zingiz yozasiz. Maktab oshxonasi sayt so'radi. Buyurtmani o'qing va har bir savolga javob yozing.",
      'Теперь все четыре строки пишешь ты. Школьная столовая попросила сайт. Прочитай заказ и ответь на каждый вопрос.',
      'Now you write all four lines. The school canteen asked for a site. Read the request and answer each question.'),
    phWhat: L3('nima yaratamiz?', 'что создаём?', 'what are we making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    msgs: {
      noWhat: L3("«Nima?» qatoriga yozing: qanday sayt yaratamiz?", 'Напиши строку «Что?»: какой сайт создаём?', 'Write the “What?” line: what site are we making?'),
      kind: L3("Bu faqat mavzu. Aniq yozing: maktab oshxonasi sayti.", 'Это только тема. Напиши точно: сайт школьной столовой.', 'That’s just a topic. Be specific: a school canteen site.'),
      noWhy: L3("Endi «Nega?» qatorini yozing: sayt nima qilishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      goal: L3("Buyurtmada maqsad bor: o'quvchilar tushlikka buyurtma bersin.", 'В заказе есть цель: чтобы ученики заказывали обед.', 'The request has a goal: students should order lunch.'),
      noWho: L3("Endi «Kim uchun?» qatorini yozing: saytni kimlar ko'radi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      who: L3("Buyurtmada yoshi bor: o'n yoshdan o'n to'rt yoshgacha bo'lgan o'quvchilar.", 'В заказе указан возраст: школьники от десяти до четырнадцати лет.', 'The request gives an age: students from ten to fourteen.'),
      noIn: L3("Endi «Ichida nima?» qatorini yozing: saytda qanday bloklar?", 'Теперь напиши строку «Что внутри?»: какие блоки на сайте?', 'Now write the “What’s inside?” line: which blocks?'),
      inside: L3("Buyurtmada uchta blok bor: menyu, narxlar va savol-javob.", 'В заказе три блока: меню, цены и вопросы с ответами.', 'The request has three blocks: menu, prices and an FAQ.')
    },
    hints: [
      L3("Buyurtmada to'rtala javob bor: nima, nega, kim uchun va ichida nima.", 'В заказе есть все четыре ответа: что, зачем, для кого и что внутри.', 'The request has all four answers: what, why, who for and what’s inside.'),
      L3("Har bir gapni o'z qatoriga yozing.", 'Каждую фразу — в свою строку.', 'Put each phrase in its own line.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Maktab oshxonasi sayti · o'quvchilar tushlikka buyurtma bersin · 10–14 yoshli o'quvchilar · menyu, narxlar, savol-javob", 'Сайт школьной столовой · чтобы ученики заказывали обед · школьники 10–14 лет · меню, цены, вопросы и ответы', 'A school canteen site · get students to order lunch · students aged 10–14 · menu, prices, FAQ'),
    ok: L3("Barakalla! To'rtala qatorni o'zingiz yozdingiz: sayt o'quvchilar uchun, menyu, narxlar va savol-javob bilan.", 'Молодец! Все четыре строки написаны тобой: сайт для школьников, с меню, ценами и вопросами.', 'Well done! You wrote all four lines: a site for students, with a menu, prices and an FAQ.'),
    ask: L3("To'rtala qatorni yozing", 'Напиши все четыре строки', 'Write all four lines')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Endi o'z saytingiz! O'zingiz yaxshi ko'rgan narsa uchun sayt o'ylang. To'rtala qatorni yozing, «Ichida nima?» ga esa mehmonga kerakli bloklarni tartib bilan yozing.",
      'А теперь твой сайт! Придумай сайт для того, что тебе нравится. Напиши все четыре строки, а в «Что внутри?» — нужные гостю блоки по порядку.',
      'Now your own site! Think of a site for something you love. Write all four lines, and in “What’s inside?” list the blocks the visitor needs, in order.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    msgs: {
      noWhat: L3("«Nima?» qatoriga yozing: qanday sayt yaratasiz?", 'Напиши строку «Что?»: какой сайт создаёшь?', 'Write the “What?” line: what site are you making?'),
      kind: L3("Bu faqat mavzu. Aniq narsani yozing: klub, server, do'kon yoki bayram sayti.", 'Это только тема. Напиши конкретную вещь: сайт клуба, сервера, магазина или праздника.', 'That’s just a topic. Write a specific thing: a club, server, shop or party site.'),
      noWhy: L3("Endi «Nega?» qatorini yozing: sayt nima qilishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      pretty: L3("Bu istak, maqsad emas. Sayt mehmon uchun nima qilsin?", 'Это пожелание, а не цель. Что сайт должен сделать для гостя?', 'That’s a wish, not a goal. What should the site do for a visitor?'),
      goal: L3("Maqsadni yozing: odamlar yozilsinmi, buyurtma qilsinmi, kelsinmi?", 'Напиши цель: чтобы записывались, заказывали или приходили?', 'Write the goal: should people sign up, order or come?'),
      noWho: L3("Endi «Kim uchun?» qatorini yozing: saytni kimlar ko'radi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      noIn: L3("Endi «Ichida nima?» qatorini yozing: saytda qanday bloklar?", 'Теперь напиши строку «Что внутри?»: какие блоки на сайте?', 'Now write the “What’s inside?” line: which blocks?'),
      few: L3("Bitta blok kam. Mehmonga kerakli yana bir-ikki blok qo'shing.", 'Одного блока мало. Добавь ещё один-два нужных гостю.', 'One block isn’t enough. Add one or two more the visitor needs.')
    },
    hints: [
      L3("Nima? Nega? Kim uchun? Ichida nima? Har biriga bir qator.", 'Что? Зачем? Для кого? Что внутри? На каждый — строка.', 'What? Why? Who for? What’s inside? One line each.'),
      L3("«Ichida nima?» ga mehmon savollariga javob beradigan bloklarni yozing.", 'В «Что внутри?» напиши блоки, которые отвечают на вопросы гостя.', 'In “What’s inside?” write the blocks that answer the visitor’s questions.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · 11–13 yoshli bolalar · rasmlar, jadval, aloqa", 'Сайт нашего футбольного клуба · чтобы ребята записывались в клуб · дети 11–13 лет · фото, расписание, контакты', 'Our football club site · get kids to sign up for the club · kids aged 11–13 · photos, schedule, contact'),
    ok: L3("Voy, zo'r! Bu sizning to'rt qatorli promptingiz. Uyga vazifada uni haqiqiy sun'iy intellektga yuborasiz.", 'Ого, классно! Это твой промпт из четырёх строк. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your four-line prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun to'rtta qatorni yozing", 'Напиши четыре строки для своего сайта', 'Write four lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor tekshiruv. Men gap aytaman, siz tanlang: to'g'rimi yoki noto'g'rimi?", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida: bloklar, ularning tartibi yoki ichidagi ma'lumot?", 'О чём фраза: о блоках, их порядке или данных внутри?', 'What’s it about: blocks, their order or the details inside?'),
    hint2: L3("Esingizdami: sun'iy intellekt yozilgan bloklarni yozilgan tartibda qo'yadi, yozilmagan raqamlarni esa o'ylab topadi.", 'Вспомни: ИИ ставит написанные блоки в написанном порядке, а ненаписанные цифры придумывает.', 'Remember: the AI places the written blocks in the written order and makes up any numbers you didn’t write.'),
    items: [
      { t: L3("Sun'iy intellekt saytga qanday bloklar kerakligini doim o'zi biladi.", 'ИИ всегда сам знает, какие блоки нужны сайту.', 'The AI always knows by itself which blocks a site needs.'), right: false,
        why: L3("Aslida u umumiy shablon qo'yadi. Bloklarni o'zingiz sanang.", 'На самом деле он ставит общий шаблон. Блоки перечисляй сам.', 'Actually it uses a generic template. List the blocks yourself.') },
      { t: L3("Bloklar promptda qanday tartibda yozilsa, saytda ham shunday chiqadi.", 'В каком порядке блоки написаны в промпте, в таком они и будут на сайте.', 'The blocks appear on the site in the order they’re written in the prompt.'), right: true,
        why: L3("To'g'ri: sun'iy intellekt yozilgan tartibni saqlaydi.", 'Верно: ИИ сохраняет написанный порядок.', 'Right: the AI keeps the written order.') },
      { t: L3("Bloklar qancha ko'p bo'lsa, sayt shuncha yaxshi.", 'Чем больше блоков, тем лучше сайт.', 'The more blocks, the better the site.'), right: false,
        why: L3("Aslida ortiqcha bloklar mehmonni adashtiradi. Faqat keraklisini yozing.", 'На самом деле лишние блоки путают гостя. Пиши только нужные.', 'Actually extra blocks confuse visitors. Write only the ones needed.') },
      { t: L3("Narx yozilmasa, sun'iy intellekt uni o'zi o'ylab topishi mumkin.", 'Если не написать цену, ИИ может придумать её сам.', 'If you don’t write the price, the AI may make one up.'), right: true,
        why: L3("To'g'ri: shuning uchun aniq ma'lumotni o'zingiz yozing.", 'Верно: поэтому точные данные пиши сам.', 'Right: that’s why you write exact details yourself.') },
      { t: L3("Lending bu ko'p sahifali katta sayt.", 'Лендинг — это большой многостраничный сайт.', 'A landing page is a big multi-page site.'), right: false,
        why: L3("Aslida lending bitta sahifa: bloklar ketma-ket keladi.", 'На самом деле лендинг — одна страница, блоки идут друг за другом.', 'Actually a landing page is one page with blocks one after another.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz sayt tuzilishini to'g'ri o'ylaysiz.", 'Всё верно! Ты правильно думаешь о структуре сайта.', 'All correct! You think about site structure the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Men sun'iy intellekt qanday bloklar kerakligini o'zi biladi deb o'ylagandim. Lekin u faqat umumiy shablon qo'yadi, raqamlarni esa o'ylab topadi! Mehmonga nima kerakligini siz bilasiz, demak bloklarni ham siz yozasiz. Men adashibman.",
        'Вернёмся к загадке. Я думал, что ИИ сам знает, какие блоки нужны. Но он ставит общий шаблон, а цифры придумывает! Что нужно гостю, знаешь ты — значит, и блоки пишешь ты. Я ошибся.',
        'Back to the riddle. I thought the AI knew which blocks were needed. But it just uses a generic template and makes up the numbers! You know what the visitor needs, so you write the blocks. I was wrong.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning to'rt qatorli promptingiz va saytingiz.", 'Смотри, это твой промпт из четырёх строк и твой сайт.', 'Look, this is your four-line prompt and your site.'), k: 'own' },
      { text: L3("«Nima?», «Nega?» va «Kim uchun?» sizga tanish.", '«Что?», «Зачем?» и «Для кого?» ты уже знаешь.', 'You already know “What?”, “Why?” and “Who for?”.'), k: 'what' },
      { text: L3("«Ichida nima?» bu bloklar: qaysi bo'limlar, qanday tartibda va ichida haqiqiy ma'lumot bilan.", '«Что внутри?» — это блоки: какие разделы, в каком порядке и с настоящими данными внутри.', '“What’s inside?” is the blocks: which sections, in what order and with real details inside.'), k: 'in' },
      { text: L3("Uyga vazifa: promptingizni nusxalab, haqiqiy sun'iy intellektga yuboring. Keyingi darsda beshinchi savol: sayt qanday ko'rinadi? Ko'rishguncha!",
        'Домашнее задание: скопируй свой промпт и отправь настоящему ИИ. На следующем уроке — пятый вопрос: как выглядит сайт? До встречи!',
        'Homework: copy your prompt and send it to a real AI. Next lesson: the fifth question — how should the site look? See you!') }
    ],
    roles: { what: L3("aniq narsa: turnir, klub, do'kon", 'конкретная вещь: турнир, клуб, магазин', 'a specific thing: tournament, club, shop'), why: L3('maqsad: sayt nima qilsin', 'цель: что сделает сайт', 'the goal: what the site should do'),
      who: L3("auditoriya: yoshi, kimligi, nimani yaxshi ko'radi", 'аудитория: возраст, кто они, что любят', 'the audience: age, who they are, what they love'),
      in: L3("bloklar: qaysi, qanday tartibda, haqiqiy ma'lumot bilan", 'блоки: какие, в каком порядке, с настоящими данными', 'blocks: which, in what order, with real details') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring va saytingizni yarating.", 'Отправь свой промпт настоящему ИИ и сделай свой сайт.', 'Send your prompt to a real AI and make your site.'),
    ask: L3('Promptingiz va saytingizga qarang', 'Посмотри на свой промпт и сайт', 'Look at your prompt and your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, site: 1, right: 1, opts: 1, want: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:ai3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:ai3.css@*/
`;
