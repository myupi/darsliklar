// =============================================================================
// МОДУЛЬ «ИИ» · Урок 1 — «Что создаём и зачем?»
// (облик «промпт в редакторе» поверх рамки CoddyCamp; 11.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai1/build.mjs → lessons/ai/01-chto-i-zachem.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 · «Что создаём и зачем?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика 11.11.2026: каждый урок добавляет в промпт новый кусок, в конце — готовый сайт; заказчик:
// «не обязательно чтобы код был… ученик научился писать правильный промпт и увидеть его результат, думать правильно»).
// Коди пишет ИИ «Futbol haqida sayt qil» — выходит сайт ни о чём, а хотел он сайт турнира с записью. Урок учит двум
// первым вопросам формулы модуля: «Nima?» — что создаём (не тема, а конкретная вещь: турнир, кружок, магазин) и
// «Nega?» — зачем, то есть что сайт должен сделать для гостя (рассказать, записать, позвонить, заказать). Загадка (без
// имён): Коди думает, что ИИ умный и сам догадается. Разгадка: ИИ не читает мысли — делает то, что написано.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026; 11.11.2026 по мнению «пары цель ↔ кнопка» и два детектива заменены
// на «ИИ угадал не то» и «одна строка — две цели» — заказчик: «да, делай замену»):
//   s1 крючок («Yuborish» промпта Коди → красивый, но «не тот» сайт; карточка «что хотел Коди»; загадка)
//   «Nima?»: s2 показ (тема → турнир, клуб, магазин) · s3 сам (шахматный кружок) · s4 что точнее (раунды)
//   «Nega?»: s5 показ (нет цели · рассказать · записаться · позвонить) · s6 сам (кружок: записаться) ·
//            s7 цель или пожелание (раунды) · s8 сам, перенос (пиццерия: заказать) · s8b две цели в одной строке
//   думать промптом: s9 показ (каждая строка оставляет след) · g1 ИИ угадал не то (без «Nega?» ИИ додумал «билеты») ·
//            det детектив (какой промпт дал сайт · какой строки не хватает) · s12 почини промпт Коди («chiroyli bo'lsin») ·
//            s13 обе строки с нуля (выставка книг) · s14 свой сайт
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт и сайт, домашка (скопировать в настоящий ИИ).
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор: честно собирает сайт из того, что написано в промпте (ai1-kit.jsx, aiSite); метки «Nima?» и
//     «Nega?» у частей сайта показывают, какая строка что дала. Кода ИИ в уроке нет (заказчик, 11.11.2026).
//   · Промпт ученика уходит ИИ всегда — даже неверный: ученик видит, что вышло, проверка называет, чего не хватает.
//   · Ученик пишет на языке урока; проверка ищет смысл (вид продукта, тип цели) по словам на uz / ru / en.
//   · Узбекский — по /uzbekcha; в речи нет символов.
//
// СИСТЕМА СЛОВ: prompt — промпт (ya'ni «sun'iy intellektga topshiriq»); sun'iy intellekt — ИИ; maqsad — цель;
// mavzu — тема; buyurtma — заказ (карточка «что хочет заказчик»).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-01-chto-i-zachem',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '1-dars. Nima yaratamiz va nega?',
    ru: 'Урок 1. Что создаём и зачем?',
    en: 'Lesson 1. What are we making and why?'
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
  next: L3('Kim uchun yaratamiz?', 'Для кого создаём?', 'Who is it for?'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, pairOk, pickFirst …; печатаются: eyebrow, ask,
// card, примеры промптов.
// ─────────────────────────────────────────────────────────────────────────────
const BUY = L3('Buyurtma', 'Заказ', 'Request');
const C = {
  s1: {
    eyebrow: L3('Nima va nega?', 'Что и зачем?', 'What and why?'),
    say: L3("Salom! Bugundan boshlab saytlarni sun'iy intellekt bilan birga yaratamiz. Buning uchun unga topshiriq yozib beramiz, bunday topshiriqni prompt deyishadi. Men birinchi promptimni yozib qo'ydim: «Futbol haqida sayt qil». Qani, «Yuborish»ni bosing-chi, nima chiqarkin?",
      'Привет! С сегодняшнего дня делаем сайты вместе с ИИ. Мы пишем ему задание, то есть промпт. Я уже написал свой первый промпт: «Сделай сайт про футбол». Нажми «Отправить» — посмотрим, что выйдет!',
      'Hi! From today we build sites together with AI. We write it a task, that is, a prompt. I’ve written my first prompt: “Make a site about football.” Tap “Send” and let’s see what comes out!'),
    vague: L3('Futbol haqida sayt qil.', 'Сделай сайт про футбол.', 'Make a site about football.'),
    topic: L3('Futbol', 'Футбол', 'Football'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Voy, sayt chiroyli chiqibdi-ku! Lekin bir qarang: bu shunchaki futbol haqidagi sahifa, unda tarix bilan qoidalar bor, xolos. Men esa maktabimizdagi futbol turniri uchun sayt xohlagandim, o'yinchilar unda ro'yxatdan o'tishi kerak edi. Bu yerda na turnir bor, na ro'yxatdan o'tish!",
      'Ого, сайт получился красивым! Но смотри: это просто страница про футбол — история и правила. А я хотел сайт школьного футбольного турнира, чтобы игроки записывались. Тут нет ни турнира, ни записи!',
      'Wow, the site looks great! But look: it’s just a page about football, its history and rules. I wanted a site for our school football tournament, where players sign up. There’s no tournament and no sign-up here!'),
    done: L3("Baribir sun'iy intellekt aqlli-ku! Menga nima kerakligini o'zi topib olishi kerak edi, deb o'ylayman. Sizningcha, kim aybdor: menmi yoki u? Bugun shuni tekshirib ko'ramiz va to'g'ri prompt yozishni o'rganamiz: nima yaratamiz va nega.",
      'По-моему, ИИ умный — он сам должен был догадаться, что мне нужно. Как думаешь? Сегодня это проверим и научимся писать правильный промпт: что создаём и зачем.',
      'I think the AI is smart, it should have guessed what I needed. What do you think? Today we’ll check that and learn to write a proper prompt: what we’re making and why.'),
    wanted: { h: L3('Kodi aslida nimani xohlagan edi', 'Что на самом деле хотел Коди', 'What Kodi actually wanted'), t: L3("Maktab futbol turniri sayti. O'yinchilar ro'yxatdan o'tsin.", 'Сайт школьного футбольного турнира. Чтобы игроки записывались.', 'A site for the school football tournament. Players should sign up.') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3('Bu Kodi xohlagan sayt emas', 'Это не тот сайт, что хотел Коди', 'This isn’t the site Kodi wanted')
  },
  s2: {
    eyebrow: L3('Nima?', 'Что?', 'What?'),
    help: [
      L3("Prompt qatoriga bir qarang-chi, keyin sayt nomi bilan kartochkalarga ham. Sezdingizmi? Qatordagi so'zlar o'zgarishi bilan ular ham o'zgarib qoladi.", 'Посмотри на строку промпта, название сайта и карточки: меняется строка — меняются и они.', 'Look at the prompt line, the site name and the cards: when the line changes, they change too.'),
      L3("Nega shunday bo'lyapti? Chunki «Nima?» qatori sun'iy intellektga saytimiz aynan nima ekanini aytadi: turnirmi, klubmi yoki do'konmi. Shuning uchun faqat mavzuni yozish yetmaydi.", '«Что?» — это для чего сайт: турнир, клуб или магазин. Одной темы мало.', '“What?” is the thing the site is for: a tournament, a club or a shop. A topic alone isn’t enough.'),
      L3("Novvoyxonaga kirib «Non bering» desangiz, sotuvchi qaysi nonni berishini bilmay qoladi. «Bitta patir bering» desangiz, darrov tushunadi. Sun'iy intellektga ham nima kerakligini «Nima?» qatorida shunday aniq aytamiz.", 'Скажешь продавцу «дайте хлеб» — он не знает, какой. Скажешь «один чёрный хлеб» — всё понятно.', 'Tell a shopkeeper “give me bread” and they don’t know which. Say “one loaf of rye bread” and it’s clear.')
    ],
    say: L3("Birinchi savoldan boshlaymiz: nima yaratamiz? Promptimga qarang-chi: men unga faqat mavzuni, futbolni yozibman, xolos. Shuning uchun sun'iy intellekt chiroyli, lekin umumiy sahifa yasab qo'ydi: tarix, qoidalar, qiziq faktlar.",
      'Первый вопрос: что создаём? Смотри, я написал только тему — футбол. ИИ сделал красивую, но общую страницу: история, правила, факты.',
      'First question: what are we making? Look, I wrote only the topic: football. The AI made a nice but general page: history, rules, facts.'),
    p0: L3('Futbol haqida sayt', 'Сайт про футбол', 'A site about football'),
    p1: L3('Futbol turniri sayti', 'Сайт футбольного турнира', 'A football tournament site'),
    p2: L3('Futbol klubi sayti', 'Сайт футбольного клуба', 'A football club site'),
    p3: L3("Futbol formasi do'koni sayti", 'Сайт магазина футбольной формы', 'A football kit shop site'),
    says: [
      L3("Endi aniqroq yozdik: futbol turniri sayti. Ana, saytning nomi ham, bo'limlari ham o'zgarib qoldi: o'yinlar jadvali, jamoalar, sovrinlar chiqdi!", 'Теперь пишем точно: сайт футбольного турнира. Смотри, изменились и название, и разделы: расписание, команды, призы.', 'Now we write precisely: a football tournament site. Look, the name and the sections changed: schedule, teams, prizes.'),
      L3("Endi «futbol klubi sayti» deb yozdik. Qarang-chi, butunlay boshqa sayt chiqdi: mashg'ulotlar, ustoz, yutuqlar.", 'Скажем «сайт футбольного клуба» — выйдет другой сайт: занятия, тренер, достижения.', 'Say “a football club site” and you get a different site: classes, coach, wins.'),
      L3("Futbol formasi do'koni-chi? Bu safar yana boshqacha sayt chiqdi: mahsulotlar, narxlar, yetkazib berish. Ko'rdingizmi? Mavzu bitta, lekin saytlar uch xil bo'ldi!", 'А магазин футбольной формы — снова другой: товары, цены, доставка. Тема одна, а сайты разные!', 'And a football kit shop is different again: products, prices, delivery. One topic, but different sites!')
    ],
    done: L3("Demak, «Nima?» qatoriga faqat mavzuni yozish kam. U yerga aniq narsani yozamiz: turnir saytimi, klub saytimi yoki do'kon saytimi.", 'Значит, на вопрос «Что?» пишут не тему, а конкретную вещь: сайт турнира, клуба или магазина.', 'So for “What?” you write not a topic but a specific thing: a tournament, club or shop site.'),
    asks: [L3('Qarang: faqat mavzu', 'Смотри: только тема', 'Watch: just a topic'), L3('Qarang: turnir sayti', 'Смотри: сайт турнира', 'Watch: a tournament site'),
      L3('Qarang: klub sayti', 'Смотри: сайт клуба', 'Watch: a club site'), L3("Qarang: do'kon sayti", 'Смотри: сайт магазина', 'Watch: a shop site')],
    askDone: L3("«Nima?» — aniq narsa, faqat mavzu emas", '«Что?» — конкретная вещь, а не только тема', '“What?” is a specific thing, not just a topic')
  },
  s3: {
    eyebrow: L3('Nima yaratamiz?', 'Что создаём?', 'What are we making?'),
    card: { h: BUY, t: L3("Maktabimizdagi shaxmat to'garagi sayt so'rayapti. Bolalar to'garakka yozilsin.", 'Шахматный кружок нашей школы просит сайт. Чтобы дети записывались в кружок.', 'Our school chess club wants a site. Kids should sign up for the club.') },
    say: L3("Mana, birinchi haqiqiy buyurtma keldi: maktabimizdagi shaxmat to'garagi sayt so'rayapti! «Nega?» qatorini men yozib qo'ydim. Siz «Nima?» qatoriga nima yaratishimizni aniq yozing-da, «Yuborish»ni bosing.",
      'Теперь ты. Шахматный кружок школы попросил сайт. Строка «Зачем?» готова. В строку «Что?» точно напиши, что создаём, и нажми «Отправить».',
      'Your turn. The school chess club asked for a site. The “Why?” line is ready. In the “What?” line write exactly what we’re making and tap “Send”.'),
    why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    ph: L3('nima yaratamiz?', 'что создаём?', 'what are we making?'),
    msgs: {
      empty: L3("«Nima?» qatori hali bo'm-bo'sh-ku. Qanday sayt yaratamiz, shuni yozing.", 'Напиши в строку «Что?»: какой сайт создаём?', 'Write in the “What?” line: what site are we making?'),
      topic: L3("Buyurtmaga bir qarang-chi: bu shaxmat to'garagi-ku. Demak, sayt ham shaxmat haqida bo'lishi kerak.", 'Сайт должен быть про шахматы: прочитай заказ.', 'The site should be about chess: read the request.'),
      kind: L3("Hozircha faqat mavzuni yozibsiz. Shaxmatning nimasi: turnirmi, to'garakmi yoki do'konmi? Shuni aniq yozing.", 'Это только тема. Что именно про шахматы: турнир, кружок, магазин? Напиши точно.', 'That’s just a topic. What exactly about chess: a tournament, a club, a shop? Be specific.'),
      other: L3("Buyurtmada to'garak haqida gap ketyapti-ku. Shuning uchun sayt ham aynan to'garakniki bo'lishi kerak.", 'В заказе сказано «кружок». Пусть сайт будет именно кружка.', 'The request says club. Make it the club’s site.')
    },
    hints: [
      L3("Buyurtmani o'qib chiqing-chi: saytni kim so'rayapti?", 'Прочитай заказ: кто просит сайт?', 'Read the request: who is asking for the site?'),
      L3("Shaxmat faqat mavzu bo'ladi. Sayt esa shaxmat to'garagi uchun kerak.", 'Шахматы — тема. А сайт — для шахматного кружка.', 'Chess is the topic. The site is for the chess club.'),
      L3("Pastdagi namunani «Nima?» qatoriga ko'chirib yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Shaxmat to'garagi sayti", 'Сайт шахматного кружка', 'Chess club website'),
    ok: L3("Zo'r! Mana endi bu haqiqiy to'garak sayti: nomi ham, mashg'ulotlar ham, ustoz ham bor. Sun'iy intellekt nima yaratishni aniq bilib oldi.", 'Огонь! Теперь это сайт кружка: название, занятия, наставник. ИИ точно понял, что создавать.', 'Awesome! Now it’s a club site: the name, classes, a coach. The AI knew exactly what to make.'),
    ask: L3("«Nima?» qatoriga aniq yozing", 'Точно напиши строку «Что?»', 'Write the “What?” line precisely')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Endi har gal ikkita prompt ko'rsataman. Qani, toping-chi: qaysi biridan sun'iy intellekt nima yaratishni darrov tushunadi?",
      'Теперь проверь себя. Какой из двух промптов точнее, то есть по какому ИИ поймёт, что создавать?',
      'Now check yourself. Which of the two prompts is clearer, that is, which one tells the AI what to make?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi «Nima?» aniqroq?", 'Какое «Что?» точнее?', 'Which “What?” is clearer?'),
    ask: L3('Aniqroq promptni tanlang', 'Выбери более точный промпт', 'Pick the clearer prompt'),
    hint1: L3("Qaysi birida faqat mavzu turibdi-yu, qaysi birida aniq narsa bor?", 'Где только тема, а где конкретная вещь?', 'Which one is just a topic, and which one is a specific thing?'),
    hint2: L3("Aniq narsa deganda turnir, do'kon, server yoki to'garakni tushunamiz.", 'Конкретная вещь — турнир, магазин, сервер, кружок.', 'A specific thing: a tournament, a shop, a server, a club.'),
    items: [
      { a: L3("O'yin haqida sayt", 'Сайт про игры', 'A site about games'), b: L3('Minecraft serverimiz sayti', 'Сайт нашего сервера Minecraft', 'Our Minecraft server site'), right: 'b',
        why: L3("Ikkinchisida aniq narsa turibdi: bizning Minecraft serverimiz. «O'yin» esa shunchaki mavzu, xolos.", 'Во втором есть конкретная вещь: сервер Minecraft.', 'The second one has a specific thing: a Minecraft server.') },
      { a: L3("Oyimning pitsa do'koni sayti", 'Сайт маминой пиццерии', 'My mum’s pizza shop site'), b: L3('Ovqat haqida sayt', 'Сайт про еду', 'A site about food'), right: 'a',
        why: L3("Birinchisi aniqroq, chunki unda oyimning pitsa do'koni aytilgan. «Ovqat» esa juda keng mavzu.", 'Первый точный: пиццерия.', 'The first one is specific: a pizza shop.') },
      { a: L3('Sport haqida sayt', 'Сайт про спорт', 'A site about sport'), b: L3('Maktab futbol turniri sayti', 'Сайт школьного футбольного турнира', 'A school football tournament site'), right: 'b',
        why: L3("Maktab futbol turniri aniq narsa bo'ladi, «sport» esa faqat mavzu.", 'Турнир — конкретная вещь, а спорт — только тема.', 'A tournament is a specific thing; sport is just a topic.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Server, pitsa do'koni, futbol turniri: har safar aniq narsani topdingiz! Endi mavzu qayerda-yu, aniq narsa qayerda, bir qarashda ajratasiz.", 'Всё верно! Ты отличаешь тему от конкретной вещи.', 'All correct! You can tell a topic from a specific thing.')
  },
  s5: {
    eyebrow: L3('Nega?', 'Зачем?', 'Why?'),
    help: [
      L3("«Nega?» qatorini kuzatib turing, keyin saytdagi katta tugmaga va eng pastki bo'limga qarang. Qator o'zgarsa, ular ham boshqacha bo'lib qoladi.", 'Посмотри на строку «Зачем?», на большую кнопку сайта и на нижний раздел.', 'Look at the “Why?” line, the big button on the site and the section at the bottom.'),
      L3("Bu qator saytning maqsadini aytadi: sayt mehmon uchun nima qiladi? Biror narsani aytib beradimi, ro'yxatga yozib oladimi yoki qo'ng'iroq qilishga chaqiradimi?", 'Цель — что сайт делает для гостя: рассказывает, записывает или просит позвонить.', 'The goal is what the site does for a visitor: tells them something, signs them up or gets them to call.'),
      L3("Do'kon eshigiga «Marhamat, kiring!» deb yozib qo'yishadi. Bu yozuvning maqsadi bor: odam ichkariga kirsin. Saytda bunday yozuv qaysi? Albatta, katta tugma: u mehmonni kerakli ishga chaqiradi.", 'Надпись «Входите!» на двери магазина — тоже цель: чтобы человек вошёл. Сайт — так же.', 'A “Come in!” sign on a shop door is a goal too: so people walk in. A site works the same way.')
    ],
    say: L3("Endi ikkinchi savol: nega? Bu savol saytimiz mehmon uchun nima qilishi kerakligini so'raydi. Hozircha promptda maqsad yo'q, shuning uchun sun'iy intellekt «Batafsil» degan umumiy tugma qo'yib qo'ydi. U hech qayerga olib bormaydi-ku!",
      'Второй вопрос: зачем? То есть что сайт должен сделать для гостя. Сейчас цели нет: ИИ поставил общую кнопку «Подробнее», которая никуда не ведёт.',
      'Second question: why? That means what the site should do for a visitor. Right now there’s no goal: the AI added a generic “Learn more” button that leads nowhere.'),
    what: L3('Futbol turniri sayti', 'Сайт футбольного турнира', 'A football tournament site'),
    g0: null,
    g1: L3('turnir haqida aytib bersin', 'рассказать о турнире', 'tell about the tournament'),
    g2: L3("o'yinchilar ro'yxatdan o'tsin", 'чтобы игроки записались', 'get players to sign up'),
    g3: L3("ota-onalar tashkilotchiga qo'ng'iroq qilsin", 'чтобы родители позвонили организатору', 'get parents to call the organiser'),
    says: [
      L3("«Nega?» qatoriga «turnir haqida aytib bersin» deb yozdik. Qarang, sun'iy intellekt pastga «Qachon va qayerda» degan bo'lim qo'shibdi.", 'Цель: рассказать о турнире. Смотри, ИИ добавил внизу раздел «Когда и где».', 'Goal: tell about the tournament. Look, the AI added a “When and where” section at the bottom.'),
      L3("Endi maqsadni almashtirdik: o'yinchilar ro'yxatdan o'tsin. Voy, katta tugmaning yozuvi «Ro'yxatdan o'tish» bo'lib qoldi, pastda esa yozilish formasi paydo bo'ldi!", 'Меняем цель: чтобы игроки записались. Теперь большая кнопка — «Записаться», а внизу форма записи!', 'Change the goal: get players to sign up. Now the big button says “Sign up”, and there’s a sign-up form below!'),
      L3("Maqsad «ota-onalar qo'ng'iroq qilsin» bo'lsa-chi? Tugma yana o'zgardi: endi unda «Qo'ng'iroq qilish» deb yozilgan, pastda esa telefon raqami turibdi. Ko'rdingizmi, sayt nima ish qilishini aynan maqsad hal qiladi.", 'Цель: чтобы родители позвонили. И кнопка изменилась: «Позвонить», а внизу — номер телефона. Цель решает, что сайт делает.', 'Goal: get parents to call. The button changed too: “Call us”, with a phone number below. The goal decides what the site does.')
    ],
    done: L3("Shunday qilib, «Nega?» qatori saytning vazifasini aytadi. Sun'iy intellekt esa shu vazifaga qarab kerakli tugma va bo'limni qo'yadi.", 'Значит, «Зачем?» говорит, какая у сайта задача, а ИИ по ней ставит разделы и кнопки.', 'So “Why?” states the site’s job, and the AI adds sections and buttons to match.'),
    asks: [L3("Qarang: maqsad yo'q", 'Смотри: цели нет', 'Watch: no goal'), L3('Qarang: aytib bersin', 'Смотри: рассказать', 'Watch: tell about it'),
      L3("Qarang: ro'yxatdan o'tsin", 'Смотри: записаться', 'Watch: sign up'), L3("Qarang: qo'ng'iroq qilsin", 'Смотри: позвонить', 'Watch: call')],
    askDone: L3("«Nega?» — sayt nima qilishi kerak", '«Зачем?» — что должен сделать сайт', '“Why?” is what the site should do')
  },
  s6: {
    eyebrow: L3('Nega kerak?', 'Зачем нужен?', 'Why is it needed?'),
    card: { h: BUY, t: L3("To'garak rahbari: «Bolalar to'garakka yozilsin».", 'Руководитель кружка: «Пусть дети записываются в кружок».', 'The club leader: “Kids should sign up for the club.”') },
    say: L3("Shaxmat to'garagimiz esingizdami? Uning rahbari bizga yana xabar yubordi: u bolalar to'garakka yozilishini xohlaydi. Shu maqsadni o'z so'zlaringiz bilan «Nega?» qatoriga yozing-da, «Yuborish»ni bosing.",
      'Теперь «Зачем?». Руководитель кружка хочет, чтобы дети записывались. Напиши эту цель своими словами и нажми «Отправить».',
      'Now “Why?”. The club leader wants kids to sign up. Write that goal in your own words and tap “Send”.'),
    what: L3("Shaxmat to'garagi sayti", 'Сайт шахматного кружка', 'Chess club website'),
    ph: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      empty: L3("«Nega?» qatori hali bo'sh turibdi. Sayt mehmon uchun nima qilishi kerak, shuni yozing.", 'Напиши в строку «Зачем?»: что должен сделать сайт?', 'Write in the “Why?” line: what should the site do?'),
      pretty: L3("«Chiroyli bo'lsin» saytning ko'rinishi haqida gapiradi, maqsadi haqida emas. Sayt mehmon uchun nima qilishi kerak?", '«Чтобы было красиво» — это внешний вид, а не цель. Что сайт должен сделать для гостя?', '“Make it pretty” is a look, not a goal. What should the site do for a visitor?'),
      other: L3("Bu ham maqsad bo'la oladi, lekin rahbar boshqa narsani xohlayapti: bolalar to'garakka yozilsin.", 'Это тоже цель, но руководитель хочет другого: чтобы дети записывались.', 'That’s a goal too, but the leader wants something else: kids signing up.'),
      vague: L3("Sun'iy intellekt bu so'zlardan sayt nima qilishi kerakligini tushunmadi. Kim nima qilsin, shuni aniq yozing.", 'ИИ не понял: что должен сделать сайт? Напиши, кто что должен сделать.', 'The AI didn’t get it: what should the site do? Write who should do what.')
    },
    hints: [
      L3("Buyurtmaga qarang-chi: rahbar nima deb yozibdi?", 'Прочитай слова руководителя в заказе.', 'Read the leader’s words in the request.'),
      L3("Rahbarning maqsadi oddiy: bolalar to'garakka yozilsin, ro'yxatdan o'tsin.", 'Цель: чтобы дети записывались в кружок, то есть регистрировались.', 'The goal: kids sign up for the club, that is, register.'),
      L3("Pastdagi namunaga qarab «Nega?» qatorini yozing, keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    ok: L3("Ajoyib! Saytda ro'yxatdan o'tish tugmasi ham, formasi ham paydo bo'ldi. Ularni siz yozgan maqsad olib keldi.", 'Отлично! На сайте появились кнопка и форма записи. Их поставила цель.', 'Great! A sign-up button and form appeared on the site. The goal put them there.'),
    ask: L3("«Nega?» qatoriga maqsadni yozing", 'Напиши цель в строку «Зачем?»', 'Write the goal in the “Why?” line')
  },
  s7: {
    eyebrow: L3('Maqsadmi?', 'Это цель?', 'Is it a goal?'),
    say: L3("Odamlar sayt so'raganda har xil narsa aytishadi. Kartochkadagi gapni o'qing-da, toping-chi: bu saytning maqsadimi yoki shunchaki istakmi?",
      'Теперь проверь себя. Я говорю фразу, а ты выбираешь: это цель сайта или просто пожелание?',
      'Now check yourself. I say a phrase, and you choose: is it the site’s goal or just a wish?'),
    card: L3('Gap', 'Фраза', 'Phrase'),
    ask: L3('Maqsadmi yoki istak?', 'Цель или пожелание?', 'Goal or wish?'),
    opts: { goal: L3('Maqsad', 'Цель', 'Goal'), wish: L3('Istak', 'Пожелание', 'Wish') },
    hint1: L3("Bu gap sayt mehmon uchun nima qilishini aytyaptimi?", 'Говорит ли фраза, что сайт делает для гостя?', 'Does the phrase say what the site does for a visitor?'),
    hint2: L3("Maqsad «kim nima qilsin?» degan savolga javob beradi. Istak esa faqat sayt qanaqa bo'lsin, deydi.", 'Цель — кто что должен сделать. Пожелание — каким быть сайту.', 'A goal is who should do what. A wish is what the site should be like.'),
    items: [
      { t: L3("o'yinchilar turnirga yozilsin", 'чтобы игроки записались на турнир', 'players sign up for the tournament'), right: 'goal', why: L3("Bu gapda sayt bajaradigan ish bor: o'yinchilar turnirga yozilsin. Bu maqsad bo'ladi.", 'Это цель: чтобы игроки записались.', 'That’s a goal: players sign up.') },
      { t: L3("sayt chiroyli bo'lsin", 'чтобы сайт был красивым', 'the site should be pretty'), right: 'wish', why: L3("«Chiroyli» so'zi faqat ko'rinish haqida gapiradi. Sayt mehmon uchun nima qilishini u aytmaydi-ku.", 'Красивый — это внешний вид. Он не говорит, что сайт делает для гостя.', 'Pretty is a look. It doesn’t say what the site does for a visitor.') },
      { t: L3("mijozlar pitsa buyurtma qilsin", 'чтобы клиенты заказывали пиццу', 'customers order pizza'), right: 'goal', why: L3("Bu yerda ham aniq ish bor: mijozlar sayt orqali pitsa buyurtma qilsin. Shuning uchun bu maqsad bo'ladi.", 'Это цель: чтобы клиенты заказывали.', 'That’s a goal: customers place orders.') },
      { t: L3("zo'r sayt bo'lsin", 'чтобы сайт был крутым', 'it should be a cool site'), right: 'wish', why: L3("«Zo'r sayt» degan gap shunchaki istak, xolos. Sayt nima qilishi kerakligi unda aytilmagan.", '«Крутой» — пожелание. Что делать — не сказано.', '“Cool” is a wish. It doesn’t say what to do.') },
      { t: L3("ko'rgazma qachon va qayerdaligini aytsin", 'рассказать, когда и где выставка', 'tell when and where the fair is'), right: 'goal', why: L3("Bu gap saytga vazifa beryapti: odamlarga ko'rgazmaning vaqti va joyini aytib bersin.", 'Это цель: рассказать людям время и место.', 'That’s a goal: tell people the time and place.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Endi «chiroyli bo'lsin» kabi istak maqsadga o'xshab ko'rinsa ham, sizni aldolmaydi.", 'Всё верно! Ты отличаешь цель от пожелания.', 'All correct! You can tell a goal from a wish.')
  },
  s8: {
    eyebrow: L3('Yangi buyurtma', 'Новый заказ', 'New request'),
    card: { h: BUY, t: L3("Oyim: «Odamlar saytdan pitsa buyurtma qilsin».", 'Мама: «Пусть люди заказывают пиццу через сайт».', 'Mum: “People should order pizza through the site.”') },
    say: L3("Uyimizdan ham buyurtma keldi! Oyim pitsa do'koni uchun sayt xohlayapti. Oyimning maqsadini «Nega?» qatoriga yozing-da, sayt qanday chiqishini ko'ring.",
      'Новый заказ! Мама хочет сайт для пиццерии. Напиши её цель в строку «Зачем?» и посмотри на результат.',
      'A new request! Mum wants a site for her pizza shop. Write her goal in the “Why?” line and see the result.'),
    what: L3("Oyimning pitsa do'koni sayti", 'Сайт маминой пиццерии', 'My mum’s pizza shop site'),
    ph: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      empty: L3("Oyimning maqsadi hali yozilmabdi-ku. «Nega?» qatoriga sayt nima qilishi kerakligini yozing.", 'Напиши в строку «Зачем?»: что должен сделать сайт?', 'Write in the “Why?” line: what should the site do?'),
      pretty: L3("Saytning chiroyli bo'lishi ko'rinishga kiradi, maqsadga emas. Oyim aslida nimani xohlayapti?", '«Красиво» — это внешний вид, а не цель. Чего хочет мама?', '“Pretty” is a look, not a goal. What does Mum want?'),
      other: L3("Bunday maqsad ham bo'ladi, lekin oyimga boshqa narsa kerak: odamlar pitsa buyurtma qilishsin.", 'Это тоже цель, но мама хочет другого: чтобы заказывали.', 'That’s a goal too, but Mum wants something else: orders.'),
      vague: L3("Sun'iy intellekt bu gapdan hech narsa tushunmadi: kim nima qilishi kerak? Oyimning so'zlarini o'qib ko'ring.", 'ИИ не понял: кто что должен сделать? Прочитай заказ.', 'The AI didn’t get it: who should do what? Read the request.')
    },
    hints: [
      L3("Oyim buyurtmada nima deb yozganini o'qing-chi.", 'Прочитай слова мамы в заказе.', 'Read Mum’s words in the request.'),
      L3("Oyimning maqsadi bitta: odamlar saytdan pitsa buyurtma qilsin.", 'Цель: чтобы люди заказывали пиццу.', 'The goal: people order pizza.'),
      L3("Namunadagi gapni «Nega?» qatoriga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("odamlar pitsa buyurtma qilsin", 'чтобы люди заказывали пиццу', 'get people to order pizza'),
    ok: L3("Mana, oyim xursand bo'ladi! Sun'iy intellekt buyurtma tugmasini ham, pitsalar ro'yxatini ham qo'ydi. Maqsad aniq yozilsa, sayt ham kerakli ishni qiladi.", 'Огонь! ИИ поставил кнопку заказа и список пицц. Цель написана верно — и сайт работает верно.', 'Awesome! The AI added an order button and a pizza list. Write the goal right, and the site works right.'),
    ask: L3("Oyimning maqsadini yozing", 'Напиши цель мамы', 'Write Mum’s goal')
  },
  s8b: {
    eyebrow: L3('Ikki maqsad', 'Две цели', 'Two goals'),
    card: { h: BUY, t: L3("Turnir tashkilotchisi: «Hamma turnir qachon va qayerda bo'lishini bilsin. O'yinchilar esa ro'yxatdan o'tsin».", 'Организатор турнира: «Пусть все знают, когда и где турнир. А игроки пусть записываются».', 'The tournament organiser: “Everyone should know when and where the tournament is. And players should sign up.”') },
    say: L3("Ba'zan maqsad bitta emas, ikkita bo'ladi. Maktab futbol turnirining tashkilotchisi ham ikki narsani xohlayapti: hamma turnir qachon va qayerda bo'lishini bilsin, o'yinchilar esa ro'yxatdan o'tsin. Qani, ikkalasini bitta «Nega?» qatoriga sig'dira olasizmi?",
      'Иногда цель не одна, а две. Организатор хочет двух вещей: чтобы все знали время и место турнира, а игроки записывались. Напиши обе в одну строку «Зачем?».',
      'Sometimes there isn’t one goal but two. The organiser wants two things: everyone should know the time and place, and players should sign up. Write both in one “Why?” line.'),
    what: L3('Maktab futbol turniri sayti', 'Сайт школьного футбольного турнира', 'School football tournament site'),
    ph: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      empty: L3("Qator bo'sh qolibdi. Tashkilotchining ikkala istagini ham «Nega?» qatoriga yozing.", 'Напиши в строку «Зачем?»: что должен сделать сайт?', 'Write in the “Why?” line: what should the site do?'),
      pretty: L3("Bu shunchaki istak bo'lib qoldi. Tashkilotchi aslida nimani so'rayapti?", 'Это пожелание, а не цель. Чего хочет организатор?', 'That’s a wish, not a goal. What does the organiser want?'),
      noJoin: L3("Vaqt bilan joy bor ekan, lekin o'yinchilar qayerda ro'yxatdan o'tadi? Ikkinchi maqsadni ham qo'shing.", 'Время и место есть, а записи игроков нет. Добавь и вторую цель.', 'The time and place are there, but not the sign-up. Add the second goal too.'),
      noTell: L3("Ro'yxatdan o'tish bor ekan, lekin turnir qachon va qayerda bo'lishini hech kim bilmaydi-ku. Shu maqsadni ham qo'shing.", 'Запись есть, а цели «рассказать время и место» нет. Добавь и её.', 'Sign-up is there, but not “tell the time and place”. Add it too.'),
      vague: L3("Bu gapdan sun'iy intellekt kim nima qilishini bilolmadi. Buyurtmada tashkilotchi nima deganiga qarang.", 'ИИ не понял: кто что должен сделать? Прочитай заказ.', 'The AI didn’t get it: who should do what? Read the request.')
    },
    hints: [
      L3("Buyurtmada tashkilotchi ikki narsani so'rayapti: hamma bilsin va o'yinchilar yozilsin.", 'В заказе две просьбы: узнать и записаться.', 'The request asks two things: know and sign up.'),
      L3("Birinchisi, sayt turnir qachon va qayerda bo'lishini aytsin. Ikkinchisi, o'yinchilar ro'yxatdan o'tsin.", 'Первое: рассказать, когда и где турнир. Второе: чтобы игроки записались.', 'First: tell when and where the tournament is. Second: get players to sign up.'),
      L3("Namunadagidek ikkala maqsadni bitta qatorga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("turnir qachon va qayerdaligini aytsin, o'yinchilar ro'yxatdan o'tsin", 'рассказать, когда и где турнир, и чтобы игроки записались', 'tell when and where the tournament is, and get players to sign up'),
    ok: L3("Qoyil! Saytda ikkalasi ham chiqdi: «Qachon va qayerda» bo'limi ham, ro'yxatdan o'tish formasi ham. Ko'rdingizmi, bitta qatorga ikkita maqsad bemalol sig'di.", 'Отлично! На сайте есть и то и другое: «Когда и где» и форма записи. Две цели поместились в одну строку.', 'Great! The site has both: “When and where” and a sign-up form. Two goals fit in one line.'),
    ask: L3("Ikki maqsadni «Nega?» qatoriga yozing", 'Впиши обе цели в «Зачем?»', 'Write both goals in “Why?”')
  },
  s9: {
    eyebrow: L3('Har bir qator — iz', 'Каждая строка — след', 'Every line leaves a mark'),
    help: [
      L3("Prompt qatorlari yonidagi rangli belgilarga qarang-chi. Saytda ham xuddi shunday belgilar bor.", 'Посмотри на метки у строк промпта и такие же метки на сайте.', 'Look at the labels next to the prompt lines and the matching labels on the site.'),
      L3("Bu belgilar saytning har bir qismi qaysi qatordan kelganini ko'rsatib turadi.", 'Каждая метка показывает, какая часть сайта пришла из какой строки.', 'Each label shows which part of the site came from which line.'),
      L3("Tort retseptidan shakarni olib tashlasangiz, tort shirin chiqmaydi. Promptdan bitta qatorni olib tashlasangiz ham, saytdan nimadir yo'qolib qoladi.", 'Убери из рецепта сахар — и торт не будет сладким. Убери строку из промпта — и с сайта что-то пропадёт.', 'Take sugar out of a recipe and the cake isn’t sweet. Take a line out of a prompt and something disappears from the site.')
    ],
    say: L3("Endi sizga bir sirni ochaman: promptning har bir qatori saytda o'z izini qoldiradi. Mana, rasm chizish kursi uchun ikki qatorli prompt va undan chiqqan sayt.",
      'Покажу один секрет. Каждая строка промпта оставляет на сайте след. Смотри: промпт из двух строк и его сайт.',
      'Let me show you a secret. Every line of a prompt leaves a mark on the site. Look: a two-line prompt and its site.'),
    what: L3('Rasm chizish kursi sayti', 'Сайт курса рисования', 'A drawing course site'),
    why: L3("bolalar kursga yozilsin", 'чтобы дети записывались на курс', 'get kids to sign up for the course'),
    says: [
      L3("Belgilarga bir qarang-chi: sayt nomi bilan kartochkalar «Nima?» qatoridan kelibdi. Yozilish tugmasi bilan formasi esa «Nega?» qatoridan.", 'Посмотри на метки: название и карточки пришли из «Что?», а кнопка и форма записи — из «Зачем?».', 'Look at the labels: the name and cards came from “What?”, the sign-up button and form from “Why?”.'),
      L3("Endi «Nega?» qatorini olib tashladik. Voy, yozilish tugmasi ham, formasi ham g'oyib bo'ldi! Ularning o'rnida yana o'sha umumiy «Batafsil» turibdi.", 'Теперь уберём строку «Зачем?». Кнопка и форма записи пропали, вместо них — общее «Подробнее».', 'Now let’s remove the “Why?” line. The sign-up button and form vanished, replaced by a generic “Learn more”.'),
      L3("Endi aksincha, «Nima?» qatorini olib tashladik. Sayt umumiy shablonga aylanib qoldi, chunki sun'iy intellekt nima yaratayotganini bilmay qoldi.", 'Уберём строку «Что?» — и сайт превратился в общий шаблон: ИИ не знает, что создаёт.', 'Remove the “What?” line and the site turns into a generic template: the AI doesn’t know what it’s making.'),
      L3("Ikkala qatorni joyiga qaytardik, sayt ham yana butun bo'ldi. Bittasi ham ortiqcha emas ekan!", 'Обе строки вернулись — сайт снова целый. Нужна каждая строка!', 'Both lines are back, and the site is whole again. Every line matters!')
    ],
    done: L3("Xullas, promptdagi har bir qator saytda o'z izini qoldiradi. Qator bo'lmasa, iz ham bo'lmaydi.", 'Значит, каждая строка промпта оставляет на сайте свой след. Нет строки — нет и следа.', 'So every line of a prompt leaves its own mark on the site. No line, no mark.'),
    asks: [L3("Qarang: ikki qatorli prompt", 'Смотри: промпт из двух строк', 'Watch: a two-line prompt'), L3('Qarang: qayerdan keldi', 'Смотри: что откуда', 'Watch: where it came from'),
      L3("Qarang: «Nega?» siz", 'Смотри: без «Зачем?»', 'Watch: without “Why?”'), L3("Qarang: «Nima?» siz", 'Смотри: без «Что?»', 'Watch: without “What?”'), L3('Qarang: ikkalasi bilan', 'Смотри: с обеими', 'Watch: with both')],
    askDone: L3("Har bir qator — saytda iz", 'Каждая строка — след на сайте', 'Every line leaves a mark on the site')
  },
  g1: {
    eyebrow: L3('Taxmin', 'Догадка ИИ', 'The AI’s guess'),
    card: { h: BUY, t: L3("Murabbiy: «Bolalar jamoaga yozilsin».", 'Тренер: «Пусть ребята записываются в команду».', 'The coach: “Kids should sign up for the team.”') },
    say: L3("Futbol jamoamiz uchun shoshib faqat «Nima?» qatorini yozibman. Qarang, sun'iy intellekt maqsadni o'zi o'ylab topibdi: chipta sotish! Haqiqiy sun'iy intellekt ham shunday qiladi: aytilmagan narsani o'zicha taxmin qiladi. Murabbiyimiz esa bolalar jamoaga yozilishini xohlaydi. «Nega?» qatorini yozing, shunda taxminga hojat qolmaydi.",
      'Я написал для сайта команды только «Что?». Смотри, ИИ сам придумал цель — продавать билеты! Так бывает и у настоящего ИИ: чего не сказали, то он додумывает. А тренер хочет, чтобы ребята записывались в команду. Напиши «Зачем?», чтобы угадывать не пришлось.',
      'I wrote only “What?” for the team site. Look, the AI invented the goal itself: selling tickets! Real AI does this too: whatever you don’t say, it guesses. But the coach wants kids to sign up for the team. Write “Why?” so it doesn’t have to guess.'),
    what: L3('Futbol jamoamiz sayti', 'Сайт нашей футбольной команды', 'Our football team site'),
    guess: L3('muxlislar chipta buyurtma qilsin', 'чтобы болельщики заказывали билеты', 'get fans to order tickets'),
    guessTag: L3('Taxmin', 'Догадка', 'Guess'),
    ph: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      empty: L3("«Nega?» qatori bo'sh qolsa, sun'iy intellekt yana taxmin qiladi. Murabbiyning maqsadini yozing.", 'Напиши в строку «Зачем?»: что должен сделать сайт?', 'Write in the “Why?” line: what should the site do?'),
      pretty: L3("Bu gap faqat istak bo'ldi. Murabbiyning o'zi nima deyapti?", 'Это пожелание, а не цель. Чего хочет тренер?', 'That’s a wish, not a goal. What does the coach want?'),
      guess: L3("Chipta sotishni sun'iy intellektning o'zi taxmin qilgan edi-ku. Murabbiy esa boshqa narsani so'rayapti.", 'Это была догадка ИИ — билеты. А тренер хочет другого.', 'That was the AI’s guess: tickets. The coach wants something else.'),
      other: L3("Bunaqa maqsad ham bor, lekin murabbiy bolalar jamoaga yozilishini istayapti.", 'Это тоже цель, но тренер хочет, чтобы ребята записывались в команду.', 'That’s a goal too, but the coach wants kids to sign up for the team.'),
      vague: L3("Bu so'zlardan kim nima qilishi kerakligi chiqmayapti. Murabbiyning so'zlarini o'qing-chi.", 'ИИ не понял: кто что должен сделать? Прочитай заказ.', 'The AI didn’t get it: who should do what? Read the request.')
    },
    hints: [
      L3("Sun'iy intellekt nimani taxmin qildi-yu, murabbiy aslida nimani xohlaydi?", 'Что додумал ИИ? А чего хочет тренер?', 'What did the AI guess? And what does the coach want?'),
      L3("Murabbiy bitta narsani so'rayapti: bolalar jamoaga yozilsin.", 'Цель: чтобы ребята записывались в команду.', 'The goal: kids sign up for the team.'),
      L3("Taxmin o'rniga namunadagi maqsadni yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("bolalar jamoaga yozilsin", 'чтобы ребята записывались в команду', 'get kids to sign up for the team'),
    ok: L3("Mana bu boshqa gap! Chipta g'oyib bo'ldi, o'rniga jamoaga yozilish chiqdi. Maqsadni o'zingiz aytsangiz, sun'iy intellekt taxmin qilib o'tirmaydi.", 'Огонь! Билеты пропали, теперь есть запись в команду. Скажи цель — и ИИ не будет гадать.', 'Awesome! The tickets are gone, now there’s team sign-up. State the goal and the AI won’t guess.'),
    ask: L3("Taxminni to'g'ri maqsad bilan almashtiring", 'Замени догадку ИИ настоящей целью', 'Replace the AI’s guess with the real goal')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Qani, bir detektivlik qilib ko'raylik! Oldimizda tayyor saytlar turibdi, ularning promptlari esa yashirilgan. Saytning o'ziga qarab topamiz: uni qaysi prompt yaratgan va promptda qaysi qator tushib qolgan?",
      'Теперь побудем детективами. По сайту найдём промпт: какой промпт создал этот сайт и какой строки в промпте не хватает?',
      'Let’s be detectives. We’ll work out the prompt from the site: which prompt made it, and which line is missing?'),
    ask: L3('Saytga qarab promptni toping', 'Найди промпт по сайту', 'Work out the prompt from the site'),
    qWhich: L3('Qaysi prompt shu saytni yaratdi?', 'Какой промпт создал этот сайт?', 'Which prompt made this site?'),
    qMiss: L3('Promptda qaysi qator yetishmaydi?', 'Какой строки не хватает в промпте?', 'Which line is missing from the prompt?'),
    wantH: BUY,
    hint1: L3("Saytning nomiga, kartochkalariga va katta tugmasiga diqqat bilan qarang.", 'Посмотри на название, карточки и большую кнопку.', 'Look at the name, the cards and the big button.'),
    hint2: L3("Nom bilan kartochkalar «Nima?» qatoridan keladi, tugma bilan pastki bo'lim esa «Nega?» qatoridan. Sayt umumiy shablonga o'xshasa, promptda «Nima?» qatori yo'q degani.", 'Название и карточки — из «Что?», кнопка и нижний раздел — из «Зачем?». Сайт — общий шаблон: нет «Что?».', 'The name and cards come from “What?”, the button and bottom section from “Why?”. A generic template means no “What?”.'),
    items: [
      { type: 'which', site: { what: L3("Robot to'garagi sayti", 'Сайт кружка робототехники', 'Robotics club site'), why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') },
        a: { what: L3("Robot to'garagi sayti", 'Сайт кружка робототехники', 'Robotics club site'), why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') },
        b: { what: L3("Robot to'garagi sayti", 'Сайт кружка робототехники', 'Robotics club site'), why: L3("ota-onalar qo'ng'iroq qilsin", 'чтобы родители позвонили', 'get parents to call us') },
        c: { what: L3("Robot do'koni sayti", 'Сайт магазина роботов', 'Robot shop site'), why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') },
        right: 'a', why: L3("Saytning nomi bilan kartochkalari to'garakniki, tugmasi esa ro'yxatga yozadi. Bu ikkalasi faqat A variantida birga keladi.", 'Название и карточки — кружка, кнопка — запись. Оба — в A.', 'The name and cards are the club’s, the button is sign-up. Both are in A.') },
      { type: 'miss', want: L3("Futbol jamoasi: «O'yinchilar jamoaga yozilsin».", 'Футбольная команда: «Пусть игроки записываются в команду».', 'Football team: “Players should sign up for the team.”'),
        pr: { what: L3('Futbol jamoasi sayti', 'Сайт футбольной команды', 'Football team site'), why: null }, right: 'why',
        why: L3("Saytda yozilish tugmasi ham, formasi ham yo'q, faqat umumiy «Batafsil» turibdi. Maqsad yozilmasa, ana shunday bo'ladi.", 'На сайте нет кнопки и формы записи, только «Подробнее»: цель не написана.', 'There’s no sign-up button or form, just “Learn more”: the goal wasn’t written.') },
      { type: 'which', site: { what: L3("Kitob ko'rgazmasi sayti", 'Сайт книжной выставки', 'Book fair site'), why: L3("ko'rgazma qachon va qayerdaligini aytsin", 'рассказать, когда и где выставка', 'tell when and where the fair is') },
        a: { what: L3("Kitob do'koni sayti", 'Сайт книжного магазина', 'Bookshop site'), why: L3("ko'rgazma qachon va qayerdaligini aytsin", 'рассказать, когда и где выставка', 'tell when and where the fair is') },
        b: { what: L3("Kitob ko'rgazmasi sayti", 'Сайт книжной выставки', 'Book fair site'), why: L3("mehmonlar chipta buyurtma qilsin", 'чтобы гости заказали билеты', 'get visitors to order tickets') },
        c: { what: L3("Kitob ko'rgazmasi sayti", 'Сайт книжной выставки', 'Book fair site'), why: L3("ko'rgazma qachon va qayerdaligini aytsin", 'рассказать, когда и где выставка', 'tell when and where the fair is') },
        right: 'c', why: L3("Saytning nomida kitob ko'rgazmasi turibdi, pastida «Qachon va qayerda» bo'limi bor, buyurtma tugmasi esa yo'q. Bu sayt faqat aytib beradi. Aynan shu maqsad C variantida yozilgan.", 'Название — книжная выставка, внизу раздел «Когда и где», заказа нет: цель — рассказать. Это C.', 'The name is the book fair, there’s a “When and where” section and no ordering: the goal is to tell. That’s C.') },
      { type: 'miss', want: L3("Kafe: «Mijozlar stol buyurtma qilsin».", 'Кафе: «Пусть клиенты бронируют столик».', 'Café: “Customers should book a table.”'),
        pr: { what: null, why: L3('mijozlar stol buyurtma qilsin', 'чтобы клиенты заказывали столик', 'get customers to order a table') }, right: 'what',
        why: L3("Sayt umumiy shablonga o'xshab qolgan: unda kafening nomi ham, menyusi ham yo'q. Sun'iy intellekt bu kafe ekanini bilmagan.", 'Сайт — общий шаблон, нет названия кафе и меню: ИИ не знает, что это кафе.', 'The site is a generic template with no café name or menu: the AI doesn’t know it’s a café.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Haqiqiy detektiv ekansiz! Saytga bir qarab, uning promptini topa olyapsiz. Demak, prompt bilan sayt qanday bog'langanini yaxshi tushunasiz.", 'Класс! Ты находишь промпт по сайту — значит, понимаешь, как они связаны.', 'Great! You can work out the prompt from the site, so you understand how they’re connected.')
  },
  s12: {
    eyebrow: L3('Promptni tuzating', 'Почини промпт', 'Fix the prompt'),
    card: { h: BUY, t: L3("To'garak rahbari: «Bolalar to'garakka yozilsin».", 'Руководитель кружка: «Пусть дети записываются в кружок».', 'The club leader: “Kids should sign up for the club.”') },
    say: L3("Voy, robot to'garagi uchun prompt yozgandim: «Robot to'garagi sayti. Chiroyli bo'lsin». Sayt chiroyli chiqdi-yu, yozilish tugmasi yo'q! Rahbar esa bolalar to'garakka yozilsin, deyapti. Mening «Nega?» qatorimni tuzatib bering-chi.",
      'Ой, я написал промпт для кружка робототехники: «Сайт кружка робототехники. Чтобы было красиво». Сайт вышел, а кнопки нет! А руководитель хочет, чтобы дети записывались. Исправь строку «Зачем?».',
      'Oops, I wrote a prompt for the robotics club: “Robotics club site. Make it pretty.” The site came out, but there’s no button! And the leader wants kids to sign up. Fix the “Why?” line.'),
    what: L3("Robot to'garagi sayti", 'Сайт кружка робототехники', 'Robotics club site'),
    bad: L3("chiroyli bo'lsin", 'чтобы было красиво', 'make it pretty'),
    ph: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      empty: L3("Qator bo'shab qoldi-ku. Endi u yerga rahbarning maqsadini yozing: sayt nima qilishi kerak?", 'Напиши в строку «Зачем?»: что должен сделать сайт?', 'Write in the “Why?” line: what should the site do?'),
      pretty: L3("Qatorda hali ham o'sha istak turibdi: «chiroyli bo'lsin». Rahbarga esa nima kerak?", 'Это всё ещё пожелание: «чтобы было красиво». Чего хочет руководитель?', 'That’s still a wish: “make it pretty”. What does the leader want?'),
      other: L3("Maqsad-ku, lekin rahbar buni so'ramagan. Unga bolalar to'garakka yozilishi kerak.", 'Это тоже цель, но руководитель хочет другого: чтобы дети записывались.', 'That’s a goal too, but the leader wants something else: kids signing up.'),
      vague: L3("Sun'iy intellekt baribir tushunmadi: kim nima qilsin? Rahbar buyurtmada nima deganiga qarang-chi.", 'ИИ не понял: кто что должен сделать? Прочитай заказ.', 'The AI didn’t get it: who should do what? Read the request.')
    },
    hints: [
      L3("O'ylab ko'ring-chi, «chiroyli bo'lsin» maqsadmi? Sayt mehmon uchun nima qilishi kerak?", '«Чтобы было красиво» — это цель? Что сайт должен сделать для гостя?', 'Is “make it pretty” a goal? What should the site do for a visitor?'),
      L3("Qatordagi «chiroyli bo'lsin»ni o'chiring-da, o'rniga rahbarning maqsadini yozing.", 'Сотри слова в поле и напиши цель руководителя.', 'Erase the words in the field and write the leader’s goal.'),
      L3("Namunani ko'chirib yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    ok: L3("Ura, yozilish tugmasi ham, formasi ham joyida! Qarang, sayt baribir chiroyli bo'lib qoldi, buni sun'iy intellekt o'zi qiladi. «Chiroyli bo'lsin» maqsad emas ekan, men esa uni maqsad deb o'ylabman.", 'Ура! Теперь есть кнопка и форма записи. ИИ и так делает красиво: «красиво» — это не цель. Я ошибся.', 'Hooray! Now there’s a sign-up button and form. The AI makes it pretty anyway: “pretty” isn’t a goal. I was wrong.'),
    ask: L3("«Nega?» qatorini tuzating", 'Исправь строку «Зачем?»', 'Fix the “Why?” line')
  },
  s13: {
    eyebrow: L3('Ikkala qator', 'Обе строки', 'Both lines'),
    card: { h: BUY, t: L3("Maktab kutubxonasi: «Hamma kitob ko'rgazmasi qachon va qayerda bo'lishini bilsin va kelsin».", 'Школьная библиотека: «Пусть все узнают, когда и где книжная выставка, и придут».', 'School library: “Everyone should know when and where the book fair is, and come.”') },
    say: L3("Bu safar ikkala qatorni ham o'zingiz yozasiz, men faqat kuzatib turaman. Maktab kutubxonasi kitob ko'rgazmasi uchun sayt so'rayapti. Buyurtmani o'qing-da, «Nima?» bilan «Nega?» qatorlarini to'ldiring.",
      'Теперь обе строки пишешь ты. Школьная библиотека попросила сайт для книжной выставки. Прочитай заказ и напиши «Что?» и «Зачем?».',
      'Now you write both lines. The school library asked for a book fair site. Read the request and write “What?” and “Why?”.'),
    phWhat: L3('nima yaratamiz?', 'что создаём?', 'what are we making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      noWhat: L3("Oldin «Nima?» qatorini yozing: qanday sayt yaratamiz?", 'Напиши строку «Что?»: какой сайт создаём?', 'Write the “What?” line: what site are we making?'),
      topic: L3("Buyurtmani qayta o'qing: kutubxona kitob ko'rgazmasi uchun sayt so'rayapti.", 'В заказе просят сайт книжной выставки.', 'The request is for a book fair site.'),
      kind: L3("Kitob shunchaki mavzu bo'ladi. Aniq nima kerak: ko'rgazma saytimi, do'kon saytimi yoki klub saytimi?", 'Книги — это тема. Что именно: выставка, магазин или клуб?', 'Books are a topic. What exactly: a fair, a shop or a club?'),
      noWhy: L3("«Nima?» tayyor bo'ldi. Endi «Nega?» qatori qoldi: sayt nima qilishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      pretty: L3("Bu istakka o'xshaydi, maqsadga emas. Kutubxona nimani so'rayapti?", 'Это пожелание, а не цель. Чего хочет библиотека?', 'That’s a wish, not a goal. What does the library want?'),
      goal: L3("Kutubxona ikki narsani xohlayapti: odamlar ko'rgazma qachon va qayerda bo'lishini bilsin, keyin kelsin. Ikkalasini ham yozing.", 'Библиотека хочет, чтобы люди узнали время и место и пришли.', 'The library wants people to know the time and place, and to come.')
    },
    hints: [
      L3("Buyurtmani diqqat bilan o'qing: unda ikkala javob ham yashiringan, nima ham, nega ham.", 'В заказе есть оба ответа: что и зачем.', 'The request has both answers: what and why.'),
      L3("«Nima?» qatoriga kitob ko'rgazmasi sayti kerak. «Nega?» qatoriga esa sayt qachon va qayerdaligini aytsin, odamlar kelsin, deb yozasiz.", 'Что: сайт книжной выставки. Зачем: рассказать, когда и где, чтобы люди пришли.', 'What: a book fair site. Why: tell when and where, so people come.'),
      L3("Namunadagi ikki qatorni o'z joyiga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Kitob ko'rgazmasi sayti · qachon va qayerdaligini aytsin, odamlar kelsin", 'Сайт книжной выставки · рассказать, когда и где, чтобы люди пришли', 'Book fair site · tell when and where, so people come'),
    ok: L3("Barakalla! Ikkala qatorni ham o'zingiz yozdingiz, sayt esa kutubxona so'raganday chiqdi.", 'Молодец! Обе строки написаны тобой, и сайт подходит под заказ.', 'Well done! You wrote both lines, and the site matches the request.'),
    ask: L3("Ikkala qatorni o'zingiz yozing", 'Напиши «Что?» и «Зачем?»', 'Write “What?” and “Why?”')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Свой сайт', 'Your own site'),
    say: L3("Endi navbat sizning saytingizga! Nima haqida bo'lishini o'zingiz tanlaysiz: o'yin, klub, bayram yoki o'zingizning kanalingiz. «Nima?» bilan «Nega?» qatorlarini yozing-da, natijaga qarang.",
      'А теперь свой сайт! Любая тема: игра, клуб, праздник или твой канал. Напиши «Что?» и «Зачем?» и посмотри на результат.',
      'Now your own site! Any topic: a game, a club, a party or your own channel. Write “What?” and “Why?” and see the result.'),
    phWhat: L3('nima yaratamiz?', 'что создаём?', 'what are we making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    msgs: {
      noWhat: L3("Saytingiz nima bo'ladi? Shuni «Nima?» qatoriga yozing.", 'Напиши строку «Что?»: какой сайт?', 'Write the “What?” line: what site?'),
      kind: L3("Hozircha bu mavzu, xolos. Aniqroq qilib yozing: turnir saytimi, klub, do'kon yoki server saytimi?", 'Это только тема. Напиши точнее: сайт турнира, клуба, магазина или сервера.', 'That’s just a topic. Be more specific: a tournament, club, shop or server site.'),
      noWhy: L3("Saytingiz mehmon uchun nima qiladi? Buni «Nega?» qatoriga yozing.", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      pretty: L3("Bu istak bo'lib qoldi. Saytingizga kelgan mehmon nima qilsin?", 'Это пожелание, а не цель. Что сайт должен сделать для гостя?', 'That’s a wish, not a goal. What should the site do for a visitor?'),
      goal: L3("Maqsad hali tushunarsiz. Sayt nima qilsin: biror narsani aytib bersinmi, ro'yxatga yozib olsinmi, qo'ng'iroq qilishga chaqirsinmi yoki buyurtma olsinmi?", 'Цель неясна. Что делает сайт: рассказывает, записывает, просит позвонить или принимает заказы?', 'The goal isn’t clear. Should the site tell, sign people up, get them to call or take orders?')
    },
    hints: [
      L3("Oldin o'zingizga yoqqan mavzuni tanlang, keyin aniq narsani: turnirmi, klubmi yoki do'konmi.", 'Сначала выбери тему, потом конкретную вещь: турнир, клуб или магазин.', 'First pick a topic, then a specific thing: a tournament, club or shop.'),
      L3("Maqsadda kim nima qilishini yozasiz: masalan, yozilsin, kelsin yoki buyurtma qilsin.", 'Цель: кто что сделает — например, запишется, придёт или закажет.', 'The goal: who does what — sign up, come or place an order.'),
      L3("Namunadagi kabi yozsangiz ham bo'ladi, o'zingiznikini yozsangiz ham. Keyin «Yuborish»ni bosing.", 'Напиши как в образце или своё и нажми «Отправить».', 'Write it like the example or your own, and tap Send.')
    ],
    sample: L3("Roblox klubimiz sayti · o'yinchilar klubga yozilsin", 'Сайт нашего Roblox-клуба · чтобы игроки записывались в клуб', 'Our Roblox club site · get players to join the club'),
    ok: L3("Voy-voy, qanday zo'r sayt chiqdi! Mavzuni ham, maqsadni ham o'zingiz o'ylab topdingiz. Bu endi butunlay sizning promptingiz!", 'Ого, классно! Это твой первый правильный промпт. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your first proper prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun ikki qatorni yozing", 'Напиши две строки для своего сайта', 'Write two lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor viktorina! Kartochkadagi gapni o'qing-da, ayting-chi: u to'g'rimi yoki noto'g'rimi?", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    hint1: L3("Bu gap nima haqida ekan: sun'iy intellekt haqidami, «Nima?» haqidami yoki «Nega?» haqidami?", 'О чём фраза: об ИИ, о «Что?» или о «Зачем?»?', 'What’s it about: the AI, “What?” or “Why?”?'),
    hint2: L3("Esingizdami? Sun'iy intellekt faqat yozilgan narsani biladi. «Nima?» qatoriga aniq narsa yoziladi, «Nega?» qatoriga esa sayt nima qilishi.", 'Вспомни: ИИ знает только то, что написано; «Что?» — конкретная вещь; «Зачем?» — что делает сайт.', 'Remember: the AI only knows what’s written; “What?” is a specific thing; “Why?” is what the site does.'),
    items: [
      { t: L3("Sun'iy intellekt fikrimizni o'qiy oladi.", 'ИИ умеет читать наши мысли.', 'The AI can read our minds.'), right: false,
        why: L3("Yo'q, u fikr o'qiy olmaydi, faqat promptda yozilgan narsani biladi. Dars boshidagi savolimga ham shu yerda javob bor, uni xulosada aytaman.", 'На самом деле он знает только то, что написано в промпте.', 'Actually it only knows what’s written in the prompt.') },
      { t: L3("«Futbol haqida sayt» faqat mavzuni aytadi, nima yaratishimiz esa aniq emas.", '«Сайт про футбол» — это тема, но что создаём, непонятно.', '“A site about football” is a topic, but what we’re making isn’t clear.'), right: true,
        why: L3("Bu gap to'g'ri: turnirmi, klubmi yoki do'konmi, promptda aytilmagan.", 'Верно: турнир, клуб или магазин — не сказано.', 'Right: tournament, club or shop — it doesn’t say.') },
      { t: L3("«Chiroyli bo'lsin» saytning maqsadi bo'ladi.", '«Чтобы было красиво» — это цель сайта.', '“Make it pretty” is the site’s goal.'), right: false,
        why: L3("Unday emas: bu so'zlar saytning ko'rinishi haqida gapiradi. Maqsad esa sayt mehmon uchun nima qilishini aytadi.", 'На самом деле это внешний вид. А цель — что сайт делает для гостя.', 'Actually that’s a look. The goal is what the site does for a visitor.') },
      { t: L3("Maqsad yozilsa, sun'iy intellekt saytga kerakli tugmani qo'yadi.", 'Если написать цель, ИИ поставит на сайт нужную кнопку.', 'If you write the goal, the AI adds the right button to the site.'), right: true,
        why: L3("Rost: «yozilsin» desangiz, yozilish tugmasi bilan formasi chiqadi, «buyurtma qilsin» desangiz, buyurtma tugmasi chiqadi.", 'Верно: «записаться» — кнопка и форма записи, «заказать» — кнопка заказа.', 'Right: “sign up” gives a sign-up button and form, “order” gives an order button.') },
      { t: L3("Promptdan bitta qatorni olib tashlasak, sayt o'zgarmaydi.", 'Если убрать из промпта одну строку, сайт не изменится.', 'If you remove one line from the prompt, the site won’t change.'), right: false,
        why: L3("Unday emas: har bir qator saytda iz qoldiradi. Qator ketsa, izi ham birga ketadi.", 'На самом деле каждая строка оставляет след: уходит строка — уходит и след.', 'Actually every line leaves a mark: remove the line and the mark goes too.') }
    ],
    ok: L3("Viktorina ham tugadi! Endi prompt qanday ishlashini o'zingiz boshqalarga tushuntirib bera olasiz.", 'Всё верно! Ты правильно думаешь о промпте.', 'All correct! You think about prompts the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Xo'sh, kim aybdor ekan: menmi yoki sun'iy intellekt? Men uni aqlli, o'zi topib oladi, deb o'ylagandim. Lekin u fikrimni o'qiy olmaydi! U faqat promptda yozilgan narsani qiladi: men «futbol haqida» dedim, u futbol haqida yozdi, xolos. Demak, aybdor o'zim ekanman!",
        'Вернёмся к загадке. Я думал, что ИИ умный и сам догадается. Но он не умеет читать мысли! Он делает только то, что написано в промпте. Я сказал «про футбол» — он и написал про футбол. Я ошибся.',
        'Back to the riddle. I thought the AI was smart and would guess by itself. But it can’t read minds! It only does what’s written in the prompt. I said “about football”, so it wrote about football. I was wrong.'), k: 'riddle' },
      { text: L3("Endi o'zingizning promptingiz bilan saytingizga qarang. Ikkalasi ham sizniki!", 'Смотри, это твой промпт и твой сайт.', 'Look, this is your prompt and your site.'), k: 'own' },
      { text: L3("«Nima?» qatori aniq narsani aytadi: turnir saytimi, klubmi yoki do'konmi.", '«Что?» — это конкретная вещь: сайт турнира, клуба или магазина.', '“What?” is a specific thing: a tournament, club or shop site.'), k: 'what' },
      { text: L3("«Nega?» qatorida esa maqsad turadi: sayt mehmon uchun nima qilishi kerak.", '«Зачем?» — это цель: что сайт должен сделать для гостя.', '“Why?” is the goal: what the site should do for a visitor.'), k: 'why' },
      { text: L3("Uyga vazifa ham bor: promptingizni nusxalab oling-da, haqiqiy sun'iy intellektga yuborib, o'z saytingizni yarating. Keyingi darsda uchinchi savolga o'tamiz: sayt kim uchun? Ko'rishguncha!",
        'Домашнее задание: скопируй свой промпт, отправь его настоящему ИИ и сделай свой сайт. На следующем уроке — третий вопрос: для кого сайт? До встречи!',
        'Homework: copy your prompt, send it to a real AI and make your site. Next lesson: the third question — who is the site for? See you!') }
    ],
    roles: { what: L3("aniq narsa: turnir, klub, do'kon", 'конкретная вещь: турнир, клуб, магазин', 'a specific thing: tournament, club, shop'), why: L3('maqsad: sayt nima qilsin', 'цель: что сделает сайт', 'the goal: what the site should do') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring va saytingizni yarating.", 'Отправь свой промпт настоящему ИИ и сделай свой сайт.', 'Send your prompt to a real AI and make your site.'),
    ask: L3('Promptingiz va saytingizga qarang', 'Посмотри на свой промпт и сайт', 'Look at your prompt and your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1, pairOk: 1, pickFirst: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, site: 1, pr: 1, want: 1, right: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:ai1-engine.jsx@*/

/*@FILE:ai1-kit.jsx@*/

/*@FILE:ai-common.jsx@*/

/*@FILE:ai1-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:ai1.css@*/
`;
