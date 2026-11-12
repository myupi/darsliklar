// =============================================================================
// МОДУЛЬ «ИИ» · Урок 7 — «Как улучшить результат ИИ?»
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 12.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai7/build.mjs → lessons/ai/07-uluchshit-rezultat.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 7 · «Как улучшить результат ИИ?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика: темы урока — анализ результата, второй и третий промпт, «не меняй остальное»). Сайт
// магазина сладостей почти готов: клиенту не хватает цен, и кнопка заказа мелкая. Коди пишет второй промпт «yaxshiroq
// qil», и ИИ пишет сайт заново: другой цвет, другое название, блоки в другом порядке, а цен всё нет. Урок учит
// улучшать результат: сверить сайт с заказом по пунктам, назвать точно, что и как поменять, дописать «qolganini
// o'zgartirma» и идти шагами — второй, третий промпт, после каждого проверка.
// Загадка (без имён): Коди думает, что ИИ сам знает, что плохо, — достаточно «сделай лучше». Разгадка: ИИ не знает,
// что тебе не понравилось; «лучше» он понимает по-своему и переписывает всё.
//
// ДУГА (18 экранов):
//   s1 крючок (первый сайт готов; второй промпт Коди «yaxshiroq qil» → всё другое, цен нет; загадка)
//   анализ: s2 показ (заказ по пунктам ✓/✗) · s3 сам (найди невыполненные пункты) · s4 что точнее (раунды)
//   не меняй остальное: s5 показ (без «qolganini o'zgartirma» → всё поменялось; с ним — только цены) · s6 сам (отзывы) ·
//                s7 какой промпт меняет только нужное (раунды)
//   что и как: s8 показ («yaxshiroq qil» → «tugmani o'zgartir» → «tugmani kattaroq va qizil qil») · s9 сам (заголовок)
//   шагами: s10 показ (второй промпт — телефон, третий — чат) · s11 сам (второй промпт) · s12 сам (третий промпт)
//   думать промптом: g1 «rangini o'zgartir» Коди (ИИ угадал цвет) · det детектив (какой второй промпт дал сайт) ·
//                s13 почини «yaxshiroq qil» Коди (магазин сладостей) · s14 улучши сайт сам
//   итог: q1 верно или нет · fin вывод с разгадкой, цепочка промптов и сайт, домашка.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite) и правки поверх него (ai7-fix.jsx: fixOf, fixSite, fixPins):
//     правка меняет только названное; без «qolganini o'zgartirma» ИИ пишет сайт заново (метки «O'zi o'zgartirdi»);
//     «что» без «как» — догадка («Taxmin»); «yaxshiroq qil» — ИИ не знает, что улучшать. Метки «N-prompt» — у того,
//     что изменила правка.
//   · Первый промпт (семь строк) — одна строка «1-prompt» в поле; правки — строки «2-prompt», «3-prompt».
//   · Узбекский — по /uzbekcha; в речи нет цифр и символов (номера только на экране).
//
// СИСТЕМА СЛОВ: natija — результат; tahlil — анализ (ya'ni natijani buyurtma bilan solishtirish); band — пункт;
// ikkinchi prompt — второй промпт; qolganini o'zgartirma — остальное не меняй; aniq tuzatish — точная правка.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-07-uluchshit-rezultat',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '7-dars. Natijani qanday yaxshilaymiz?',
    ru: 'Урок 7. Как улучшить результат ИИ?',
    en: 'Lesson 7. How to improve the AI’s result?'
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
  next: L3('Yakuniy loyiha', 'Финальный ИИ-проект', 'The final AI project'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};
const BUY = L3('Mijoz', 'Клиент', 'Client');
const ORDER = L3('Mijoz buyurtmasi', 'Заказ клиента', 'The client’s order');
const KEEP_T = L3("qolganini o'zgartirma", 'остальное не меняй', 'don’t change anything else');
// Общие строки первого промпта: «Qanday ishlaydi?» и «Qoidalar?» без лишнего (окно, скидка, чат).
const BEH_C = L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover');
const NOX = L3("reklama oynasi, chegirma va chat bo'lmasin", 'без рекламного окна, скидок и чата', 'no pop-up window, discount or chat');
const ruleTel = (tel) => fillL(L3("{n}, majburiy: telefon {t}", '{n}, обязательно: телефон {t}', '{n}, must: phone {t}'), { n: NOX, t: tel });
// Свой CSS первого сайта: то, что ученик будет чинить.
const CSS_SMALL_BTN = ['.cta { font-size: 12px; padding: 6px 12px; border-radius: 8px; }'];
const CSS_SMALL_TITLE = ['.title { font-size: 22px; }', '@media (max-width: 600px) { .title { font-size: 18px; } }'];
// Общие ответы проверки второго промпта.
const M7 = {
  empty: L3("Promptni yozing: nimani va qanday o'zgartirish kerak?", 'Напиши промпт: что и как изменить?', 'Write the prompt: what to change and how?'),
  vague: L3("«Yaxshiroq» nima ekanini sun'iy intellekt bilmaydi. Aniq yozing: nimani va qanday o'zgartirish kerak.", 'Что значит «лучше», ИИ не знает. Напиши точно: что и как изменить.', 'The AI doesn’t know what “better” means. Be precise: what to change and how.'),
  none: L3("Sun'iy intellekt bu so'zlardan tuzatishni tanimadi. Masalan: tugmani kattaroq qil.", 'ИИ не понял, что исправить. Например: сделай кнопку больше.', 'The AI didn’t understand what to fix. For example: make the button bigger.'),
  guess: L3("Nimani o'zgartirish yozilgan, lekin qanday ekani yozilmagan. Sun'iy intellekt o'zi taxmin qildi. Qanday bo'lsin?", 'Что изменить — написано, а как — нет. ИИ угадал сам. Каким это должно стать?', 'You said what to change, but not how. The AI guessed. How should it be?'),
  keep: L3("Qarang, sun'iy intellekt boshqa narsalarni ham o'zgartirdi: rang, sarlavha, tartib! Oxiriga «qolganini o'zgartirma» deb yozing.", 'Смотри, ИИ поменял и другое: цвет, заголовок, порядок! Допиши в конце «остальное не меняй».', 'Look, the AI changed other things too: the colour, the title, the order! Add “don’t change anything else” at the end.')
};
// Сайты экранов: первый промпт из семи строк (+ свой CSS первого сайта).
const PR = {
  sweets: { what: L3("Shirinliklar do'koni sayti", 'Магазин сладостей', 'Sweets shop'), why: L3('odamlar tort buyurtma qilsin', 'чтобы люди заказывали торты', 'get people to order cakes'),
    who: L3('bayramga tayyorlanayotgan oilalar', 'семьи, которые готовятся к празднику', 'families getting ready for a celebration'), inside: L3('rasmlar, sharhlar, aloqa', 'фото, отзывы, контакты', 'photos, reviews, contact'),
    look: L3("iliq, to'q sariq va oq", 'тёплый, оранжевый и белый', 'warm, orange and white'), beh: BEH_C, rules: ruleTel('+998 99 404 50 60'), css: CSS_SMALL_BTN },
  book: { what: L3('Kitob klubi sayti', 'Книжный клуб', 'Book club'), why: L3("o'quvchilar klubga yozilsin", 'чтобы школьники записывались в клуб', 'get students to sign up for the club'),
    who: L3("kitobni yaxshi ko'radigan 12–14 yoshli o'quvchilar", 'школьники 12–14 лет, которые любят книги', 'students aged 12–14 who love books'), inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    look: L3('sokin, yashil va oq', 'спокойный, зелёный и белый', 'calm, green and white'), beh: BEH_C, rules: ruleTel('+998 90 515 25 35') },
  art: { what: L3("Rasm to'garagi sayti", 'Кружок рисования', 'Art club'), why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    who: L3("rasm chizishni yaxshi ko'radigan 8–12 yoshli bolalar", 'дети 8–12 лет, которые любят рисовать', 'kids aged 8–12 who love drawing'), inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    look: L3('quvnoq, pushti va oq', 'весёлый, розовый и белый', 'playful, pink and white'), beh: BEH_C,
    rules: L3("reklama oynasi, chegirma va chat bo'lmasin, majburiy: telefon raqami", 'без рекламного окна, скидок и чата, обязательно: номер телефона', 'no pop-up window, discount or chat, must: phone number') },
  foot: { what: L3('Futbol klubi sayti', 'Футбольный клуб', 'Football club'), why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("futbolni yaxshi ko'radigan 9–12 yoshli bolalar", 'дети 9–12 лет, которые любят футбол', 'kids aged 9–12 who love football'), inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    look: L3('zamonaviy, yashil va oq', 'современный, зелёный и белый', 'modern, green and white'), beh: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'), rules: ruleTel('+998 97 616 17 18') },
  dance: { what: L3("Raqs to'garagi sayti", 'Танцевальный кружок', 'Dance club'), why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    who: L3("raqsga qiziqadigan 10–14 yoshli bolalar", 'дети 10–14 лет, которые любят танцы', 'kids aged 10–14 who love dancing'), inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3('quvnoq, binafsha va oq', 'весёлый, фиолетовый и белый', 'playful, purple and white'), beh: BEH_C, rules: ruleTel('+998 94 700 80 90') },
  ice: { what: L3("Muzqaymoq do'koni sayti", 'Магазин мороженого', 'Ice cream shop'), why: L3('odamlar muzqaymoq buyurtma qilsin', 'чтобы люди заказывали мороженое', 'get people to order ice cream'),
    who: L3("shirinlikni yaxshi ko'radigan bolalar va oilalar", 'дети и семьи, которые любят сладкое', 'kids and families who love sweets'), inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3('sokin, pushti va oq', 'спокойный, розовый и белый', 'calm, pink and white'), beh: BEH_C, rules: ruleTel('+998 91 818 28 38'), css: CSS_SMALL_BTN },
  bike: { what: L3("Velosiped do'koni sayti", 'Магазин велосипедов', 'Bike shop'), why: L3('odamlar velosiped buyurtma qilsin', 'чтобы люди заказывали велосипеды', 'get people to order bikes'),
    who: L3("dam olish kunlari sayr qiladigan yoshlar", 'молодёжь, которая катается по выходным', 'young people who ride at weekends'), inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white'), beh: BEH_C, rules: ruleTel('+998 93 707 70 07'), css: CSS_SMALL_TITLE },
  ball: { what: L3('Basketbol klubi sayti', 'Баскетбольный клуб', 'Basketball club'), why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("basketbolni yaxshi ko'radigan 11–14 yoshli bolalar", 'дети 11–14 лет, которые любят баскетбол', 'kids aged 11–14 who love basketball'), inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    look: L3("zamonaviy, to'q sariq va oq", 'современный, оранжевый и белый', 'modern, orange and white'), beh: BEH_C,
    rules: L3("reklama oynasi va chegirma bo'lmasin, majburiy: telefon raqami", 'без рекламного окна и скидок, обязательно: номер телефона', 'no pop-up window or discount, must: phone number') },
  pizza: { what: L3('Pitsa kafesi sayti', 'Пиццерия', 'Pizza cafe'), why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'),
    who: L3("pitsani yaxshi ko'radigan o'smirlar va oilalar", 'подростки и семьи, которые любят пиццу', 'teens and families who love pizza'), inside: L3('menyu, sharhlar, aloqa', 'меню, отзывы, контакты', 'menu, reviews, contact'),
    look: L3('iliq, qizil va oq', 'тёплый, красный и белый', 'warm, red and white'), beh: BEH_C, rules: ruleTel('+998 95 123 40 50'), css: CSS_SMALL_BTN },
  gym: { what: L3('Sport klubi sayti', 'Спортивный клуб', 'Sports club'), why: L3('odamlar klubga yozilsin', 'чтобы люди записывались в клуб', 'get people to sign up for the club'),
    who: L3("sport bilan shug'ullanadigan kattalar", 'взрослые, которые занимаются спортом', 'adults who do sports'), inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'),
    look: L3("jiddiy, ko'k va oq", 'строгий, синий и белый', 'serious, blue and white'), beh: BEH_C, rules: ruleTel('+998 99 600 60 60') },
  game: { what: L3('Roblox klubimiz sayti', 'Наш Roblox-клуб', 'Our Roblox club'), why: L3("o'yinchilar klubga yozilsin", 'чтобы игроки записывались в клуб', 'get players to sign up for the club'),
    who: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'), inside: L3('rasmlar, qoidalar, aloqa', 'фото, правила, контакты', 'photos, rules, contact'),
    look: L3("qorong'i, neon, binafsha", 'тёмный, неон, фиолетовый', 'dark, neon, purple'), beh: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'),
    rules: L3("majburiy: telefon +998 90 123 00 11, chegirma va chat bo'lmasin", 'обязательно: телефон +998 90 123 00 11, без скидок и чата', 'must: phone +998 90 123 00 11, no discount or chat'), css: CSS_SMALL_TITLE }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// пункты заказа, строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Natijani yaxshilash', 'Улучшаем результат', 'Improving the result'),
    card: { h: BUY, t: L3("«Sayt yoqdi! Faqat narxlar yo'q, buyurtma tugmasi ham juda kichkina.»", '«Сайт понравился! Только цен нет, и кнопка заказа совсем маленькая».', '“We like the site! Only there are no prices, and the order button is tiny.”') },
    bad: L3('yaxshiroq qil', 'сделай лучше', 'make it better'),
    say: L3("Salom! Birinchi promptdan shirinliklar do'koni sayti tayyor. Mijozga deyarli hammasi yoqdi. Faqat narxlar yo'q va tugma kichkina. Men ikkinchi prompt yozdim: «yaxshiroq qil». Sun'iy intellekt o'zi tushunadi! «Yuborish»ni bosing.",
      'Привет! По первому промпту сайт магазина сладостей готов. Клиенту почти всё нравится. Только цен нет и кнопка маленькая. Я написал второй промпт: «сделай лучше». ИИ сам поймёт! Нажми «Отправить».',
      'Hi! The sweets shop site from the first prompt is ready. The client likes almost everything. Only there are no prices and the button is tiny. I wrote a second prompt: “make it better”. The AI will figure it out! Tap “Send”.'),
    magic: L3("Voy! Sun'iy intellekt saytni boshqatdan yasabdi: rang, sarlavha, bloklar tartibi o'zgardi. Narxlar esa hali ham yo'q, tugma ham kichkina! Qarang, «O'zi o'zgartirdi» belgilari.",
      'Ого! ИИ сделал сайт заново: поменялись цвет, заголовок и порядок блоков. А цен всё нет, и кнопка всё такая же маленькая! Смотри, метки «Сам поменял».',
      'Whoa! The AI rebuilt the site: the colour, the title and the order of blocks changed. But there are still no prices, and the button is still tiny! Look at the “Changed by itself” labels.'),
    done: L3("Menimcha, natija yoqmasa, «yaxshiroq qil» deyish kifoya. Sun'iy intellekt nima yomonligini o'zi biladi-ku! Siz nima deb o'ylaysiz? Bugun natijani qanday yaxshilashni o'rganamiz.",
      'По-моему, если результат не нравится, хватит сказать «сделай лучше». ИИ ведь сам знает, что плохо! А ты как думаешь? Сегодня учимся улучшать результат.',
      'I think if you don’t like the result, “make it better” is enough. The AI knows by itself what’s wrong! What do you think? Today we learn how to improve the result.'),
    seen: { h: BUY, t: L3("«Hammasi o'zgarib ketdi! Rangimiz qani? Avvalgisi yoqqan edi. Narxlar esa hali ham yo'q!»", '«Всё стало другим! Где наш цвет? Прежний нам нравился. А цен так и нет!»', '“Everything is different! Where’s our colour? We liked the old one. And there are still no prices!”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("«Yaxshiroq qil» ishlamadi", '«Сделай лучше» не сработало', '“Make it better” didn’t work')
  },
  s2: {
    eyebrow: L3('Natijani tekshirish', 'Проверяем результат', 'Checking the result'),
    help: [
      L3("Buyurtmadagi bandlarga va saytga qarang: har bir band saytda bormi?", 'Посмотри на пункты заказа и на сайт: каждый пункт есть на сайте?', 'Look at the order’s points and at the site: is each point on the site?'),
      L3("Tahlil, ya'ni natijani buyurtma bilan band-band solishtirish degani. Shunda nimani tuzatish kerakligi aniq bo'ladi.", 'Анализ — это сравнить результат с заказом по пунктам. Тогда ясно, что именно исправлять.', 'Analysis means comparing the result with the order point by point. Then it’s clear exactly what to fix.'),
      L3("Do'kondan qaytgach, ro'yxatga qarab xaridni tekshirasiz: non bor, sut yo'q. Sutga yana borasiz.", 'Вернулся из магазина — сверяешь покупки со списком: хлеб есть, молока нет. За молоком идёшь снова.', 'Back from the shop, you check the bags against the list: bread is there, milk isn’t. So you go back for milk.')
    ],
    say: L3("Birinchi qism: natijani tekshirish. Sun'iy intellekt kitob klubi saytini yaratdi. Lekin u mijoz xohlagandekmi? Buyurtmani band-band tekshiramiz.",
      'Первая часть — проверяем результат. ИИ сделал сайт книжного клуба. Но такой ли он, как хотел клиент? Проверим заказ по пунктам.',
      'The first part: checking the result. The AI made a book club site. But is it what the client wanted? Let’s check the order point by point.'),
    items: [
      { t: L3('Klub nomi', 'Название клуба', 'The club’s name'), ok: true, sel: '.title' },
      { t: L3('Uchrashuvlar jadvali', 'Расписание встреч', 'The meeting schedule'), ok: true, sel: '.bh1' },
      { t: L3("Asosiy rang ko'k", 'Основной цвет — синий', 'The main colour is blue'), ok: false, sel: '.badge' },
      { t: L3('Narxlar', 'Цены', 'Prices'), ok: false, sel: null }
    ],
    says: [
      L3("Birinchi band: klub nomi. Saytda bor. Belgi qo'yamiz.", 'Первый пункт — название клуба. На сайте есть. Ставим отметку.', 'The first point: the club’s name. It’s on the site. Tick.'),
      L3("Ikkinchisi: uchrashuvlar jadvali. Bu ham bor.", 'Второй — расписание встреч. Тоже есть.', 'The second: the meeting schedule. That’s there too.'),
      L3("Uchinchisi: asosiy rang ko'k bo'lsin. Qarang, sayt yashil! Bu bajarilmagan.", 'Третий — основной цвет синий. Смотри, сайт зелёный! Это не выполнено.', 'The third: the main colour should be blue. Look, the site is green! That’s not done.'),
      L3("To'rtinchisi: narxlar. Saytni oxirigacha qaraymiz: narxlar bloki yo'q. Bu ham bajarilmagan.", 'Четвёртый — цены. Смотрим сайт до конца: блока цен нет. Это тоже не выполнено.', 'The fourth: prices. We look through the whole site: there’s no prices block. That’s not done either.')
    ],
    done: L3("Demak, natijani buyurtma bilan band-band solishtiramiz. Endi nima tuzatish kerakligini aniq bilamiz: rang va narxlar.", 'Значит, сравниваем результат с заказом по пунктам. Теперь точно знаем, что исправлять: цвет и цены.', 'So we compare the result with the order point by point. Now we know exactly what to fix: the colour and the prices.'),
    asks: [L3('Qarang: buyurtma va sayt', 'Смотри: заказ и сайт', 'Watch: the order and the site'), L3('Qarang: nomi', 'Смотри: название', 'Watch: the name'), L3('Qarang: jadval', 'Смотри: расписание', 'Watch: the schedule'),
      L3('Qarang: rang', 'Смотри: цвет', 'Watch: the colour'), L3('Qarang: narxlar', 'Смотри: цены', 'Watch: the prices')],
    askDone: L3('Natija buyurtma bilan solishtirildi', 'Результат сверен с заказом', 'The result is checked against the order')
  },
  s3: {
    eyebrow: L3('Natijani tekshirish', 'Проверяем результат', 'Checking the result'),
    say: L3("Endi siz. Rasm to'garagi buyurtmasini sayt bilan solishtiring. Saytda bajarilmagan bandlarni bosing, keyin «Tekshirish».",
      'Теперь ты. Сравни заказ кружка рисования с сайтом. Нажми пункты, которые на сайте не выполнены, потом «Проверить».',
      'Your turn. Compare the art club’s order with the site. Tap the points the site hasn’t done, then “Check”.'),
    items: [
      { t: L3('Bolalar rasmlari galereyasi', 'Галерея детских рисунков', 'A gallery of kids’ drawings'), ok: true,
        why: L3("Rasmlar saytda bor: galereya turibdi. Bu band bajarilgan.", 'Рисунки на сайте есть: галерея на месте. Этот пункт выполнен.', 'The pictures are on the site: the gallery is there. This point is done.') },
      { t: L3('Narxlar', 'Цены', 'Prices'), ok: false,
        why: L3("Narxlar bloki saytda yo'q. Saytni oxirigacha qarang.", 'Блока цен на сайте нет. Посмотри сайт до конца.', 'There’s no prices block on the site. Look through to the end.') },
      { t: L3('Telefon: +998 90 222 33 44', 'Телефон: +998 90 222 33 44', 'Phone: +998 90 222 33 44'), ok: false,
        why: L3("Saytdagi telefon raqami buyurtmadagidan boshqa. Raqamlarni solishtiring.", 'Номер на сайте не тот, что в заказе. Сравни цифры.', 'The number on the site isn’t the one in the order. Compare the digits.') },
      { t: L3("Ro'yxatdan o'tish tugmasi", 'Кнопка «Записаться»', 'A “Sign up” button'), ok: true,
        why: L3("Ro'yxatdan o'tish tugmasi bor: banner o'rtasida. Bu band bajarilgan.", 'Кнопка «Записаться» есть: в середине баннера. Этот пункт выполнен.', 'The “Sign up” button is there: in the middle of the banner. This point is done.') }
    ],
    msgs: {
      none: L3("Saytda bajarilmagan bandlarni bosing, keyin «Tekshirish».", 'Нажми пункты, которых нет на сайте, потом «Проверить».', 'Tap the points the site hasn’t done, then “Check”.'),
      more: L3("Yana bitta band bajarilmagan.", 'Ещё один пункт не выполнен.', 'One more point isn’t done.')
    },
    hints: [
      L3("Har bir bandni saytdan qidiring.", 'Ищи каждый пункт на сайте.', 'Look for each point on the site.'),
      L3("Narxlarga va telefon raqamiga diqqat qiling.", 'Присмотрись к ценам и к номеру телефона.', 'Look closely at the prices and the phone number.'),
      L3("Narxlar va telefon bandlarini bosing.", 'Нажми пункты «Цены» и «Телефон».', 'Tap the “Prices” and “Phone” points.')
    ],
    ok: L3("Zo'r! Narxlar yo'q, telefon esa boshqa. Endi nimani tuzatishni aniq bilamiz!", 'Огонь! Цен нет, а телефон не тот. Теперь точно знаем, что исправлять!', 'Awesome! No prices, and the phone is wrong. Now we know exactly what to fix!'),
    ask: L3('Bajarilmagan bandlarni bosing', 'Нажми невыполненные пункты', 'Tap the points not done')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Muammoni ham aniq aytish kerak. Ikki gapdan qaysi biri muammoni aniqroq aytadi?", 'Проблему тоже надо назвать точно. Какая из двух фраз называет её точнее?', 'A problem has to be named precisely too. Which of the two sentences names it more precisely?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3('Qaysi kuzatuv aniqroq?', 'Какое наблюдение точнее?', 'Which observation is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi gapda aniq narsa nomlangan: blok, raqam yoki rang?", 'Где названа конкретная вещь: блок, номер или цвет?', 'Which one names a real thing: a block, a number or a colour?'),
    hint2: L3("«Yoqmadi», «noto'g'ri», «chiroyli emas» nimani tuzatishni aytmaydi.", '«Не нравится», «неправильно», «некрасиво» не говорят, что исправлять.', '“Don’t like it”, “wrong” and “not pretty” don’t say what to fix.'),
    items: [
      { a: L3('Sayt yoqmadi.', 'Сайт не понравился.', 'I don’t like the site.'), b: L3("Narxlar bloki yo'q.", 'Нет блока цен.', 'There’s no prices block.'), right: 'b',
        why: L3("Ikkinchisida aniq muammo bor: narxlar yo'q. «Yoqmadi» dan nimani tuzatishni bilib bo'lmaydi.", 'Во втором есть точная проблема — нет цен. Из «не понравился» не понять, что исправлять.', 'The second names the exact problem: no prices. “I don’t like it” doesn’t say what to fix.') },
      { a: L3('Telefon raqami mijozniki emas.', 'Номер телефона не клиента.', 'The phone number isn’t the client’s.'), b: L3("Nimadir noto'g'ri.", 'Что-то не так.', 'Something’s wrong.'), right: 'a',
        why: L3("Birinchisi aniq: qaysi narsa noto'g'ri ekanini aytadi.", 'Первое точное: говорит, что именно не так.', 'The first is precise: it says exactly what’s wrong.') },
      { a: L3('Rangi chiroyli emas.', 'Цвет некрасивый.', 'The colour isn’t pretty.'), b: L3("Sayt yashil, mijoz esa ko'k so'ragan.", 'Сайт зелёный, а клиент просил синий.', 'The site is green, but the client asked for blue.'), right: 'b',
        why: L3("Ikkinchisi nimani va qanday tuzatishni aytadi: yashilni ko'kka.", 'Второе говорит, что и как исправить: зелёный на синий.', 'The second says what to fix and how: green to blue.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Siz muammoni aniq nomlaysiz.", 'Всё верно! Ты называешь проблему точно.', 'All correct! You name the problem precisely.')
  },
  s5: {
    eyebrow: L3("Qolganini o'zgartirma", 'Остальное не меняй', 'Don’t change the rest'),
    card: { h: BUY, t: L3("«Narxlarni qo'shing. Qolgani zo'r, hech narsani o'zgartirmang!»", '«Добавьте цены. Остальное отлично, ничего не меняйте!»', '“Add the prices. The rest is great, don’t change anything!”') },
    help: [
      L3("Ikkinchi promptga va saytning rangi, sarlavhasi, bloklariga qarang.", 'Посмотри на второй промпт и на цвет, заголовок и блоки сайта.', 'Look at the second prompt and at the site’s colour, title and blocks.'),
      L3("Sun'iy intellekt har bir yangi promptda saytni qaytadan yozishi mumkin. «Qolganini o'zgartirma», ya'ni faqat aytilganini o'zgartir, boshqasiga tegma degani.", 'ИИ может на каждый новый промпт писать сайт заново. «Остальное не меняй» — значит, меняй только сказанное, другого не трогай.', 'The AI may rewrite the site on every new prompt. “Don’t change anything else” means change only what was asked, leave the rest alone.'),
      L3("Sartaroshga «faqat uchini qisqartiring» deysiz. Aytmasangiz, butun soch turmagini o'zgartirib yuborishi mumkin.", 'Парикмахеру говоришь: «только подровняйте кончики». Не скажешь — может поменять всю стрижку.', 'You tell a hairdresser “just trim the ends”. If you don’t, they might change the whole haircut.')
    ],
    say: L3("Ikkinchi qism: qolganini o'zgartirma. Futbol klubi mijozi faqat narxlarni so'radi. Ikkinchi promptni ikki xil yozib ko'ramiz.",
      'Вторая часть — остальное не меняй. Клиент футбольного клуба просил только цены. Напишем второй промпт двумя способами.',
      'The second part: don’t change anything else. The football club’s client only asked for prices. Let’s write the second prompt two ways.'),
    f1: L3("narxlar blokini qo'sh", 'добавь блок цен', 'add a prices block'),
    f2: L3("narxlar blokini qo'sh, qolganini o'zgartirma", 'добавь блок цен, остальное не меняй', 'add a prices block, don’t change anything else'),
    says: [
      L3("Oldin shunday yozamiz: narxlar blokini qo'sh. Qarang, narxlar paydo bo'ldi! Lekin rang, sarlavha va bloklar tartibi ham o'zgardi. Sun'iy intellekt saytni boshqatdan yozdi.",
        'Сначала пишем так: добавь блок цен. Смотри, цены появились! Но поменялись и цвет, и заголовок, и порядок блоков. ИИ написал сайт заново.',
        'First we write: add a prices block. Look, the prices appeared! But the colour, the title and the order of blocks changed too. The AI rewrote the site.'),
      L3("Endi oxiriga qo'shamiz: qolganini o'zgartirma. Mana, faqat narxlar qo'shildi. Rang, sarlavha, tartib avvalgidek!",
        'Теперь допишем в конце: остальное не меняй. Вот, добавились только цены. Цвет, заголовок и порядок — как были!',
        'Now we add at the end: don’t change anything else. There, only the prices were added. The colour, title and order are as before!')
    ],
    done: L3("Demak, ikkinchi promptda nimani o'zgartirishni yozamiz va oxirida «qolganini o'zgartirma» deymiz. Shunda yoqqan narsalar saqlanadi.", 'Значит, во втором промпте пишем, что изменить, а в конце — «остальное не меняй». Тогда то, что нравилось, останется.', 'So in the second prompt we write what to change, and at the end “don’t change anything else”. Then the good parts stay.'),
    asks: [L3('Qarang: birinchi natija', 'Смотри: первый результат', 'Watch: the first result'), L3("Qarang: hammasi o'zgardi", 'Смотри: поменялось всё', 'Watch: everything changed'), L3('Qarang: faqat narxlar', 'Смотри: только цены', 'Watch: only the prices')],
    askDone: L3("«Qolganini o'zgartirma» yoqqanini saqlaydi", '«Остальное не меняй» сохраняет хорошее', '“Don’t change anything else” keeps the good parts')
  },
  s6: {
    eyebrow: L3("Qolganini o'zgartirma", 'Остальное не меняй', 'Don’t change the rest'),
    card: { h: BUY, t: L3("«Sharhlar blokini qo'shing. Qolgani menga juda yoqdi, hech narsani o'zgartirmang!»", '«Добавьте блок отзывов. Остальное нам очень нравится, ничего не меняйте!»', '“Add a reviews block. We really like the rest, don’t change anything!”') },
    say: L3("Endi siz. Raqs to'garagi sharhlarni so'radi. Ikkinchi promptni yozing: nima qo'shilsin va qolgani o'zgarmasin.",
      'Теперь ты. Танцевальный кружок попросил отзывы. Напиши второй промпт: что добавить и чтобы остальное не менялось.',
      'Your turn. The dance club asked for reviews. Write the second prompt: what to add, and that the rest stays the same.'),
    ph: L3("nimani o'zgartiramiz?", 'что изменить?', 'what to change?'),
    msgs: { add: L3("Sharhlar qo'shilmadi. Mijoz sharhlar blokini so'radi.", 'Отзывы не добавились. Клиент просил блок отзывов.', 'The reviews weren’t added. The client asked for a reviews block.') },
    hints: [
      L3("Mijoz ikki narsa aytdi: nimani qo'shish va qolganiga tegmaslik.", 'Клиент сказал две вещи: что добавить и что остальное не трогать.', 'The client said two things: what to add, and to leave the rest alone.'),
      L3("Sharhlar blokini qo'sh, keyin vergul va qolganini o'zgartirma.", 'Добавь блок отзывов, потом запятая и «остальное не меняй».', 'Add a reviews block, then a comma and “don’t change anything else”.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("sharhlar blokini qo'sh, qolganini o'zgartirma", 'добавь блок отзывов, остальное не меняй', 'add a reviews block, don’t change anything else'),
    ok: L3("Ajoyib! Sharhlar qo'shildi, qolgani avvalgidek. Mijoz xursand!", 'Класс! Отзывы добавились, остальное как было. Клиент доволен!', 'Great! The reviews were added, and the rest is as before. The client is happy!'),
    ask: L3('Ikkinchi promptni yozing', 'Напиши второй промпт', 'Write the second prompt')
  },
  s7: {
    eyebrow: L3('Qaysi biri yaxshiroq?', 'Какой лучше?', 'Which is better?'),
    say: L3("Endi tekshiramiz. Ikki promptdan qaysi biri faqat kerakli narsani o'zgartiradi?", 'Теперь проверим. Какой из двух промптов меняет только нужное?', 'Now let’s check. Which of the two prompts changes only what’s needed?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi biri faqat kerakli narsani o'zgartiradi?", 'Какой меняет только нужное?', 'Which one changes only what’s needed?'),
    ask: L3('Tanlang', 'Выбери', 'Choose'),
    hint1: L3("Qaysi birida «qolganini o'zgartirma» bor?", 'Где есть «остальное не меняй»?', 'Which one has “don’t change anything else”?'),
    hint2: L3("«Qaytadan yarat» yoki ortiqcha so'zsiz prompt bo'lsa, sun'iy intellekt boshqa narsalarni ham o'zgartiradi.", 'После «сделай заново» или без этих слов ИИ меняет и другое.', 'After “redo it” or without those words, the AI changes other things too.'),
    items: [
      { a: L3("Telegram tugmasini qo'sh", 'добавь кнопку Telegram', 'add a Telegram button'), b: L3("Telegram tugmasini qo'sh, qolganini o'zgartirma", 'добавь кнопку Telegram, остальное не меняй', 'add a Telegram button, don’t change anything else'), right: 'b',
        why: L3("Ikkinchisi qolganini saqlaydi. Birinchisidan keyin sun'iy intellekt saytni boshqatdan yozishi mumkin.", 'Второй сохраняет остальное. После первого ИИ может написать сайт заново.', 'The second keeps the rest. After the first, the AI may rewrite the site.') },
      { a: L3("chatni olib tashla, qolganini o'zgartirma", 'убери чат, остальное не меняй', 'remove the chat, don’t change anything else'), b: L3('hammasini qaytadan yarat', 'сделай всё заново', 'redo everything from scratch'), right: 'a',
        why: L3("«Qaytadan yarat» hammasini o'zgartiradi. Birinchisi faqat chatni olib tashlaydi.", '«Сделай заново» меняет всё. Первый убирает только чат.', '“Redo everything” changes it all. The first only removes the chat.') },
      { a: L3("sarlavhani kattaroq qil, boshqa hech narsani o'zgartirma", 'сделай заголовок больше, больше ничего не меняй', 'make the title bigger, don’t change anything else'), b: L3('sarlavhani kattaroq qil', 'сделай заголовок больше', 'make the title bigger'), right: 'a',
        why: L3("Birinchisida «boshqa hech narsani o'zgartirma» bor. Shunda faqat sarlavha o'zgaradi.", 'В первом есть «больше ничего не меняй». Тогда изменится только заголовок.', 'The first says “don’t change anything else”. Then only the title changes.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Siz yoqqan narsani saqlaydigan promptni tanlaysiz.", 'Класс! Ты выбираешь промпт, который бережёт хорошее.', 'Great! You pick the prompt that keeps the good parts.')
  },
  s8: {
    eyebrow: L3('Nima va qanday', 'Что и как', 'What and how'),
    card: { h: BUY, t: L3("«Buyurtma tugmasi ko'rinmayapti! Uni kattaroq va qizil qiling.»", '«Кнопку заказа не видно! Сделайте её больше и красной».', '“You can’t see the order button! Make it bigger and red.”') },
    help: [
      L3("Ikkinchi promptga va saytdagi tugmaga qarang.", 'Посмотри на второй промпт и на кнопку сайта.', 'Look at the second prompt and at the site’s button.'),
      L3("Aniq tuzatish, ya'ni nimani va qanday o'zgartirishni aytish degani. Biri yetishmasa, sun'iy intellekt o'zi taxmin qiladi.", 'Точная правка — это сказать, что и как изменить. Не хватает одного — ИИ угадывает сам.', 'A precise fix says what to change and how. If one is missing, the AI guesses.'),
      L3("Sartaroshga «sochimni o'zgartiring» desangiz, nima chiqishini bilmaysiz. «Ikki santimetr qisqartiring» desangiz, aniq bo'ladi.", 'Скажешь парикмахеру «измените мне причёску» — не знаешь, что получится. Скажешь «короче на два сантиметра» — ясно.', 'Tell a hairdresser “change my hair” and you don’t know what you’ll get. Say “two centimetres shorter”, and it’s clear.')
    ],
    say: L3("Uchinchi qism: nima va qanday. Muzqaymoq do'konining mijozi tugmani ko'rmayapti. Uchta ikkinchi promptni sinab ko'ramiz.",
      'Третья часть — что и как. Клиент магазина мороженого не видит кнопку. Попробуем три разных вторых промпта.',
      'The third part: what and how. The ice cream shop’s client can’t see the button. Let’s try three different second prompts.'),
    f1: L3("yaxshiroq qil, qolganini o'zgartirma", 'сделай лучше, остальное не меняй', 'make it better, don’t change anything else'),
    f2: L3("tugmani o'zgartir, qolganini o'zgartirma", 'измени кнопку, остальное не меняй', 'change the button, don’t change anything else'),
    f3: L3("tugmani kattaroq va qizil qil, qolganini o'zgartirma", 'сделай кнопку больше и красной, остальное не меняй', 'make the button bigger and red, don’t change anything else'),
    says: [
      L3("Oldin «yaxshiroq qil» deb yozamiz. Sun'iy intellekt nimani yaxshilashni bilmadi va sarlavha shriftini o'zgartirdi. Tugma esa o'sha-o'sha, kichkina!",
        'Сначала пишем «сделай лучше». ИИ не знал, что улучшать, и поменял шрифт заголовка. А кнопка всё такая же маленькая!',
        'First we write “make it better”. The AI didn’t know what to improve and changed the title’s font. The button is still tiny!'),
      L3("Endi «tugmani o'zgartir». Nimani o'zgartirishni bildi, lekin qanday ekanini bilmaydi. O'zicha qora-sariq qilib qo'ydi. Mijoz esa qizil so'ragan!",
        'Теперь «измени кнопку». Что менять, ИИ понял, а как — нет. Сделал её чёрно-жёлтой. А клиент просил красную!',
        'Now “change the button”. The AI knew what to change, but not how. It made it black and yellow. But the client asked for red!'),
      L3("Endi aniq yozamiz: tugmani kattaroq va qizil qil. Mana, xuddi mijoz xohlagandek!", 'А теперь точно: сделай кнопку больше и красной. Вот, как хотел клиент!', 'Now precisely: make the button bigger and red. There, just as the client wanted!')
    ],
    done: L3("Demak, ikkinchi promptda ikkita narsa kerak: nimani o'zgartirish va qanday qilib. «Tugma» bu nima, «kattaroq va qizil» bu qanday.", 'Значит, во втором промпте нужно двое: что изменить и как. «Кнопка» — это что, «больше и красной» — это как.', 'So the second prompt needs two things: what to change and how. “The button” is what, “bigger and red” is how.'),
    asks: [L3('Qarang: tugma kichkina', 'Смотри: кнопка маленькая', 'Watch: the button is tiny'), L3('Qarang: «yaxshiroq qil»', 'Смотри: «сделай лучше»', 'Watch: “make it better”'),
      L3("Qarang: «tugmani o'zgartir»", 'Смотри: «измени кнопку»', 'Watch: “change the button”'), L3('Qarang: aniq tuzatish', 'Смотри: точная правка', 'Watch: a precise fix')],
    askDone: L3('Nima va qanday: aniq tuzatish', 'Что и как — точная правка', 'What and how: a precise fix')
  },
  s9: {
    eyebrow: L3('Nima va qanday', 'Что и как', 'What and how'),
    card: { h: BUY, t: L3("«Sarlavha juda kichkina, uzoqdan ko'rinmaydi. Uni kattaroq qiling. Qolgani yaxshi.»", '«Заголовок совсем маленький, издалека не видно. Сделайте его больше. Остальное хорошо».', '“The title is tiny, you can’t see it from afar. Make it bigger. The rest is fine.”') },
    say: L3("Endi siz. Velosiped do'konining mijozi sarlavhani ko'rmayapti. Ikkinchi promptda nimani va qanday o'zgartirishni aniq yozing.",
      'Теперь ты. Клиент магазина велосипедов не видит заголовок. Напиши во втором промпте точно, что и как изменить.',
      'Your turn. The bike shop’s client can’t see the title. In the second prompt, write precisely what to change and how.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: {
      title: L3("Sarlavha hali kichkina. Mijoz sarlavhani kattaroq so'radi.", 'Заголовок всё ещё маленький. Клиент просил сделать его больше.', 'The title is still tiny. The client asked for it to be bigger.'),
      btn: L3("Bu tugmani o'zgartirdi. Mijoz esa sarlavhani so'radi.", 'Это поменяло кнопку. А клиент просил заголовок.', 'That changed the button. But the client asked about the title.')
    },
    hints: [
      L3("Mijoz nima dedi: qaysi narsa va qanday bo'lsin?", 'Что сказал клиент: что именно и каким оно должно стать?', 'What did the client say: which thing, and how should it be?'),
      L3("Nima: sarlavha. Qanday: kattaroq. Oxirida: qolganini o'zgartirma.", 'Что: заголовок. Как: больше. В конце: остальное не меняй.', 'What: the title. How: bigger. At the end: don’t change anything else.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("sarlavhani kattaroq qil, qolganini o'zgartirma", 'сделай заголовок больше, остальное не меняй', 'make the title bigger, don’t change anything else'),
    ok: L3("Zo'r! Sarlavha katta, uzoqdan ham ko'rinadi. Qolgani avvalgidek!", 'Огонь! Заголовок большой, видно издалека. Остальное как было!', 'Awesome! The title is big, you can see it from afar. The rest is as before!'),
    ask: L3('Aniq tuzatish yozing', 'Напиши точную правку', 'Write a precise fix')
  },
  s10: {
    eyebrow: L3('Ikkinchi va uchinchi prompt', 'Второй и третий промпт', 'The second and third prompt'),
    card: { h: BUY, t: L3("«Telefonimiz +998 93 100 20 30. Chat kerak emas, javob berishga vaqtimiz yo'q.»", '«Наш телефон +998 93 100 20 30. Чат не нужен, нам некогда отвечать».', '“Our phone is +998 93 100 20 30. We don’t need a chat, we have no time to answer.”') },
    help: [
      L3("Prompt qatorlariga qarang: birinchi, ikkinchi, uchinchi.", 'Посмотри на строки промптов: первый, второй, третий.', 'Look at the prompt lines: first, second, third.'),
      L3("Ikkinchi va uchinchi prompt, ya'ni natijani ko'rib yoziladigan qisqa tuzatishlar degani. Har biridan keyin saytni yana tekshiramiz.", 'Второй и третий промпт — короткие правки, которые пишут, посмотрев на результат. После каждой сайт проверяют снова.', 'The second and third prompts are short fixes you write after looking at the result. After each one, you check the site again.'),
      L3("Uy vazifasini tekshirganda ham shunday: xatoni topasiz, tuzatasiz, yana o'qib chiqasiz.", 'Так же проверяешь домашку: находишь ошибку, исправляешь, перечитываешь снова.', 'It’s like checking homework: you find a mistake, fix it, and read it through again.')
    ],
    say: L3("To'rtinchi qism: ikkinchi va uchinchi prompt. Basketbol klubi saytida ikkita muammo bor: raqam to'qib chiqarilgan va keraksiz chat. Qadam-baqadam tuzatamiz.",
      'Четвёртая часть — второй и третий промпт. На сайте баскетбольного клуба две проблемы: номер выдуман, и есть ненужный чат. Исправляем шаг за шагом.',
      'The fourth part: the second and third prompt. The basketball club site has two problems: a made-up number and an unwanted chat. Let’s fix them step by step.'),
    f2: L3("telefon raqamini +998 93 100 20 30 qil, qolganini o'zgartirma", 'поставь номер +998 93 100 20 30, остальное не меняй', 'set the phone number to +998 93 100 20 30, don’t change anything else'),
    f3: L3("chatni olib tashla, qolganini o'zgartirma", 'убери чат, остальное не меняй', 'remove the chat, don’t change anything else'),
    says: [
      L3("Ikkinchi prompt: telefon raqamini to'g'irlaymiz va qolganini o'zgartirmaymiz. Qarang, banner ostida to'g'ri raqam. Natijani yana tekshiramiz: chat hali ham turibdi!",
        'Второй промпт: исправляем номер, остальное не меняем. Смотри, под баннером правильный номер. Снова проверяем результат: чат всё ещё на месте!',
        'The second prompt: we fix the phone number and change nothing else. Look, the right number is under the banner. We check the result again: the chat is still there!'),
      L3("Uchinchi prompt: chatni olib tashla, qolganini o'zgartirma. Chat ketdi, raqam joyida. Endi hammasi buyurtmadagidek!",
        'Третий промпт: убери чат, остальное не меняй. Чат пропал, номер на месте. Теперь всё как в заказе!',
        'The third prompt: remove the chat, don’t change anything else. The chat is gone, the number stays. Now everything matches the order!')
    ],
    done: L3("Demak, tartib shunday: natijani tekshiramiz, aniq tuzatamiz va yana tekshiramiz. Ikkinchi, uchinchi, kerak bo'lsa to'rtinchi prompt ham.", 'Значит, порядок такой: проверяем результат, точно исправляем и снова проверяем. Второй, третий, а если нужно — и четвёртый промпт.', 'So the order is: check the result, fix precisely, and check again. A second, a third, and a fourth prompt if needed.'),
    asks: [L3('Qarang: ikkita muammo', 'Смотри: две проблемы', 'Watch: two problems'), L3('Qarang: ikkinchi prompt', 'Смотри: второй промпт', 'Watch: the second prompt'), L3('Qarang: uchinchi prompt', 'Смотри: третий промпт', 'Watch: the third prompt')],
    askDone: L3('Tekshiring, tuzating, yana tekshiring', 'Проверь, исправь, проверь снова', 'Check, fix, check again')
  },
  s11: {
    eyebrow: L3('Ikkinchi prompt', 'Второй промпт', 'The second prompt'),
    card: { h: BUY, t: L3("«Buyurtma tugmasi juda kichkina, uni hech kim ko'rmayapti. Kattaroq qiling! Qolgani zo'r.»", '«Кнопка заказа совсем маленькая, её никто не видит. Сделайте больше! Остальное отлично».', '“The order button is tiny, nobody sees it. Make it bigger! The rest is great.”') },
    say: L3("Endi siz. Pitsa kafesining tugmasi juda kichkina. Ikkinchi promptni yozing.", 'Теперь ты. У пиццерии совсем маленькая кнопка. Напиши второй промпт.', 'Your turn. The pizza cafe’s button is tiny. Write the second prompt.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: { big: L3("Tugma hali kichkina. Mijoz kattaroq so'radi.", 'Кнопка всё ещё маленькая. Клиент просил больше.', 'The button is still tiny. The client asked for it bigger.') },
    hints: [
      L3("Nima: tugma. Qanday: kattaroq.", 'Что: кнопка. Как: больше.', 'What: the button. How: bigger.'),
      L3("Oxirida qolganini o'zgartirma deb qo'shing.", 'В конце допиши «остальное не меняй».', 'At the end add “don’t change anything else”.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugmani kattaroq qil, qolganini o'zgartirma", 'сделай кнопку больше, остальное не меняй', 'make the button bigger, don’t change anything else'),
    ok: L3("Barakalla! Tugma katta, endi hamma ko'radi. Qolgani avvalgidek!", 'Молодец! Кнопка большая, теперь её все видят. Остальное как было!', 'Well done! The button is big, and everyone sees it now. The rest is as before!'),
    ask: L3('Ikkinchi promptni yozing', 'Напиши второй промпт', 'Write the second prompt')
  },
  s12: {
    eyebrow: L3('Uchinchi prompt', 'Третий промпт', 'The third prompt'),
    card: { h: BUY, t: L3("«Endi zo'r! Yana bitta iltimos: Telegram tugmasini ham qo'shing.»", '«Теперь отлично! Ещё одна просьба: добавьте кнопку Telegram».', '“Now it’s great! One more thing: add a Telegram button too.”') },
    say: L3("Mijoz natijani ko'rdi va yana bitta narsa so'radi. Uchinchi promptni yozing. Qarang, ikkinchi prompt ham qatorda turibdi.", 'Клиент посмотрел результат и попросил ещё одно. Напиши третий промпт. Смотри, второй промпт тоже на месте.', 'The client saw the result and asked for one more thing. Write the third prompt. Look, the second prompt is still there.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: { tg: L3("Telegram tugmasi yo'q. Mijoz uni so'radi.", 'Кнопки Telegram нет. Клиент просил её.', 'There’s no Telegram button. The client asked for it.') },
    hints: [
      L3("Mijoz nima so'radi? Telegram tugmasini.", 'Что просит клиент? Кнопку Telegram.', 'What does the client want? A Telegram button.'),
      L3("Telegram tugmasini qo'sh, qolganini o'zgartirma.", 'Добавь кнопку Telegram, остальное не меняй.', 'Add a Telegram button, don’t change anything else.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Telegram tugmasini qo'sh, qolganini o'zgartirma", 'добавь кнопку Telegram, остальное не меняй', 'add a Telegram button, don’t change anything else'),
    ok: L3("Ajoyib! Telegram tugmasi bor, katta tugma ham joyida. Uchinchi prompt ham ishladi!", 'Класс! Кнопка Telegram есть, и большая кнопка на месте. Третий промпт тоже сработал!', 'Great! The Telegram button is there, and the big button stays. The third prompt worked too!'),
    ask: L3('Uchinchi promptni yozing', 'Напиши третий промпт', 'Write the third prompt')
  },
  g1: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("«Bizning rangimiz qizil. Saytning asosiy rangi qizil bo'lsin!»", '«Наш цвет — красный. Пусть основной цвет сайта будет красным!»', '“Our colour is red. Make the site’s main colour red!”') },
    bad: L3("rangini o'zgartir, qolganini o'zgartirma", 'измени цвет, остальное не меняй', 'change the colour, don’t change anything else'),
    say: L3("Men sport klubi uchun ikkinchi prompt yozdim: «rangini o'zgartir». Sun'iy intellekt rangni o'zgartirdi, lekin binafsha qildi! Mijoz qaysi rangni so'radi? Mening qatorimni tuzating.",
      'Я написал для спортивного клуба второй промпт: «измени цвет». ИИ поменял цвет, но сделал фиолетовым! А какой цвет просил клиент? Исправь мою строку.',
      'I wrote a second prompt for the sports club: “change the colour”. The AI changed it, but made it purple! Which colour did the client ask for? Fix my line.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: {
      color: L3("Sun'iy intellekt hali ham rangni o'zi tanlayapti. Qanday rang? Mijoz: qizil.", 'ИИ всё ещё выбирает цвет сам. Какой цвет? Клиент: красный.', 'The AI is still choosing the colour itself. Which colour? The client says: red.'),
      wrong: L3("Bu boshqa rang. Mijoz qizil so'radi.", 'Это другой цвет. Клиент просил красный.', 'That’s a different colour. The client asked for red.'),
      btn: L3("Bu faqat tugmani bo'yadi. Mijoz saytning asosiy rangini so'radi.", 'Это покрасило только кнопку. Клиент просил основной цвет сайта.', 'That only coloured the button. The client asked for the site’s main colour.')
    },
    hints: [
      L3("Kodining qatorida «nima» bor, «qanday» yo'q.", 'В строке Коди есть «что», но нет «как».', 'Kodi’s line has “what”, but not “how”.'),
      L3("«Rangni» so'zidan keyin aniq rangni yozing: qizil.", 'После слова «цвет» напиши точный цвет: красный.', 'After the word “colour”, write the exact colour: red.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("asosiy rangni qizil qil, qolganini o'zgartirma", 'сделай основной цвет красным, остальное не меняй', 'make the main colour red, don’t change anything else'),
    ok: L3("Zo'r! Endi sayt qizil, xuddi mijozning rangi. Aniq aytilsa, sun'iy intellekt taxmin qilmaydi!", 'Огонь! Теперь сайт красный, как цвет клиента. Когда сказано точно, ИИ не гадает!', 'Awesome! Now the site is red, just like the client’s colour. When you say it precisely, the AI doesn’t guess!'),
    ask: L3('Kodining qatorini tuzating', 'Исправь строку Коди', 'Fix Kodi’s line')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi detektiv bo'lamiz. Futbol klubi mijozi narxlarni so'radi. Saytga va belgilarga qarang: qaysi ikkinchi prompt yuborilgan?", 'Теперь побудем детективами. Клиент футбольного клуба просил цены. Посмотри на сайт и на метки: какой второй промпт отправили?', 'Let’s be detectives. The football club’s client asked for prices. Look at the site and the labels: which second prompt was sent?'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3('Qaysi ikkinchi prompt shu saytni berdi?', 'Какой второй промпт дал этот сайт?', 'Which second prompt gave this site?'),
    before: L3('Oldin: yashil sayt, bloklar: Rasmlar, Jadval, Aloqa', 'Было: зелёный сайт, блоки: Фото, Расписание, Контакты', 'Before: a green site, blocks: Photos, Schedule, Contact'),
    hint1: L3("Belgilarga qarang: «2-prompt» yoki «O'zi o'zgartirdi».", 'Посмотри на метки: «Промпт 2» или «Сам поменял».', 'Look at the labels: “Prompt 2” or “Changed by itself”.'),
    hint2: L3("O'zi o'zgartirgan bo'lsa, «qolganini o'zgartirma» yozilmagan. Narxlar yo'q bo'lsa, prompt noaniq.", 'Если ИИ поменял сам — «остальное не меняй» не написали. Если цен нет — промпт неточный.', 'If the AI changed things itself, “don’t change anything else” wasn’t written. If there are no prices, the prompt was vague.'),
    items: [
      { fix: C_FOOT_F1(), a: C_FOOT_F2(), b: C_FOOT_F1(), c: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), right: 'b',
        why: L3("Narxlar bor, lekin rang va sarlavha ham o'zgardi: «qolganini o'zgartirma» yozilmagan.", 'Цены есть, но поменялись и цвет, и заголовок: «остальное не меняй» не написали.', 'The prices are there, but the colour and title changed too: “don’t change anything else” wasn’t written.') },
      { fix: C_FOOT_F2(), a: C_FOOT_F2(), b: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), c: C_FOOT_F1(), right: 'a',
        why: L3("Faqat narxlar qo'shildi, qolgani avvalgidek.", 'Добавились только цены, остальное как было.', 'Only the prices were added, the rest is as before.') },
      { fix: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), a: C_FOOT_F1(), b: C_FOOT_F2(), c: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), right: 'c',
        why: L3("Hammasi o'zgardi, narxlar esa yo'q: bu «yaxshiroq qil».", 'Поменялось всё, а цен нет: это «сделай лучше».', 'Everything changed, and there are no prices: that’s “make it better”.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Saytga qarab qaysi prompt yozilganini topasiz.", 'Класс! По сайту ты находишь, какой промпт написали.', 'Great! You can tell from a site which prompt was written.')
  },
  s13: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("«Narxlarni qo'shing va buyurtma tugmasini kattaroq qiling. Qolgani bizga yoqqan edi, o'zgartirmang!»", '«Добавьте цены и сделайте кнопку заказа больше. Остальное нам нравилось, не меняйте!»', '“Add the prices and make the order button bigger. We liked the rest, don’t change it!”') },
    say: L3("Endi shirinliklar do'konini tuzatamiz! Mening «yaxshiroq qil» promptim o'rniga aniq ikkinchi prompt yozing. Mijoz nimani so'radi?",
      'Теперь починим магазин сладостей! Вместо моего «сделай лучше» напиши точный второй промпт. Что просил клиент?',
      'Now let’s fix the sweets shop! Instead of my “make it better”, write a precise second prompt. What did the client ask for?'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: {
      vague: L3("«Yaxshiroq qil» hali turibdi. Uning o'rniga mijoz so'ragan ikkita narsani aniq yozing.", '«Сделай лучше» ещё на месте. Вместо него точно напиши две вещи, которые просил клиент.', '“Make it better” is still there. Instead, write precisely the two things the client asked for.'),
      prices: L3("Narxlar hali yo'q. Mijoz narxlarni so'radi.", 'Цен всё ещё нет. Клиент просил цены.', 'There are still no prices. The client asked for them.'),
      big: L3("Tugma hali kichkina. Mijoz kattaroq so'radi.", 'Кнопка всё ещё маленькая. Клиент просил больше.', 'The button is still tiny. The client asked for it bigger.')
    },
    hints: [
      L3("Mijoz ikkita narsa so'radi: narxlar va tugma.", 'Клиент просил две вещи: цены и кнопку.', 'The client asked for two things: prices and the button.'),
      L3("Narxlar blokini qo'sh, tugmani kattaroq qil, qolganini o'zgartirma.", 'Добавь блок цен, сделай кнопку больше, остальное не меняй.', 'Add a prices block, make the button bigger, don’t change anything else.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("narxlar blokini qo'sh, tugmani kattaroq qil, qolganini o'zgartirma", 'добавь блок цен, сделай кнопку больше, остальное не меняй', 'add a prices block, make the button bigger, don’t change anything else'),
    ok: L3("Ajoyib! Narxlar bor, tugma katta, qolgani avvalgidek. Endi mijoz xursand!", 'Класс! Цены есть, кнопка большая, остальное как было. Теперь клиент доволен!', 'Great! The prices are there, the button is big, and the rest is as before. The client is happy now!'),
    ask: L3("«Yaxshiroq qil» ni tuzating", 'Исправь «сделай лучше»', 'Fix “make it better”')
  },
  s14: {
    eyebrow: L3("O'zingiz yaxshilang", 'Улучши сам', 'Improve it yourself'),
    card: { h: L3('Sizning tanlovingiz', 'Твой выбор', 'Your choice'), t: L3("Saytga qarang. Sizga nima yoqmadi? Bitta-ikkita narsani tanlab, aniq tuzating.", 'Посмотри на сайт. Что тебе не нравится? Выбери одну-две вещи и исправь их точно.', 'Look at the site. What don’t you like? Pick one or two things and fix them precisely.') },
    say: L3("Endi o'zingiz! Bu Roblox klubi sayti. Unga qarang: sizga nima yoqmadi? Ikkinchi promptda nimani va qanday o'zgartirishni yozing, qolganini saqlang.",
      'Теперь сам! Это сайт Roblox-клуба. Посмотри на него: что тебе не нравится? Напиши во втором промпте, что и как изменить, а остальное сохрани.',
      'Now on your own! This is a Roblox club site. Look at it: what don’t you like? In the second prompt, write what to change and how, and keep the rest.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    hints: [
      L3("Saytdan bitta narsani tanlang: rang, tugma, sarlavha, blok yoki reklama oynasi.", 'Выбери на сайте одну вещь: цвет, кнопку, заголовок, блок или рекламное окно.', 'Pick one thing on the site: the colour, the button, the title, a block or the pop-up window.'),
      L3("Nimani va qanday yozing, oxirida qolganini o'zgartirma.", 'Напиши что и как, в конце — «остальное не меняй».', 'Write what and how, and at the end “don’t change anything else”.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("reklama oynasini olib tashla, sarlavhani kattaroq qil, qolganini o'zgartirma", 'убери рекламное окно, сделай заголовок больше, остальное не меняй', 'remove the pop-up window, make the title bigger, don’t change anything else'),
    ok: L3("Voy, zo'r! Bu sizning aniq ikkinchi promptingiz. Uyga vazifada haqiqiy sun'iy intellekt bilan ham shunday qilasiz.", 'Ого, классно! Это твой точный второй промпт. Дома сделаешь так же с настоящим ИИ.', 'Wow, great! That’s your own precise second prompt. At home you’ll do the same with a real AI.'),
    ask: L3("Saytni o'zingiz yaxshilang", 'Улучши сайт сам', 'Improve the site yourself')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor tekshiruv. Men gap aytaman, siz tanlang: to'g'rimi yoki noto'g'rimi?", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida: tekshirish, aniq tuzatish yoki «qolganini o'zgartirma»?", 'О чём фраза: о проверке, о точной правке или об «остальное не меняй»?', 'What’s it about: checking, a precise fix, or “don’t change anything else”?'),
    hint2: L3("Esingizdami: sun'iy intellekt nima yoqmaganini bilmaydi, uni siz aytasiz.", 'Вспомни: ИИ не знает, что тебе не понравилось, — это говоришь ты.', 'Remember: the AI doesn’t know what you didn’t like — you tell it.'),
    items: [
      { t: L3("«Yaxshiroq qil» desangiz, sun'iy intellekt nima yoqmaganini biladi.", 'Если написать «сделай лучше», ИИ узнает, что тебе не понравилось.', 'If you write “make it better”, the AI knows what you didn’t like.'), right: false,
        why: L3("Aslida u bilmaydi: nimani va qanday o'zgartirishni siz aytasiz.", 'На самом деле он не знает: что и как изменить, говоришь ты.', 'Actually it doesn’t know: you say what to change and how.') },
      { t: L3("Natijani buyurtma bilan band-band solishtirish kerak.", 'Результат нужно сверять с заказом по пунктам.', 'You should check the result against the order point by point.'), right: true,
        why: L3("To'g'ri: shunda nimani tuzatish aniq bo'ladi.", 'Верно: тогда ясно, что исправлять.', 'Right: then it’s clear what to fix.') },
      { t: L3("«Qolganini o'zgartirma» yoqqan narsalarni saqlab qoladi.", '«Остальное не меняй» сохраняет то, что нравилось.', '“Don’t change anything else” keeps the parts you liked.'), right: true,
        why: L3("To'g'ri: sun'iy intellekt faqat aytilganini o'zgartiradi.", 'Верно: ИИ меняет только сказанное.', 'Right: the AI changes only what you asked for.') },
      { t: L3("Natija yoqmasa, birinchi promptni boshidan yozish kerak.", 'Если результат не нравится, первый промпт надо писать с нуля.', 'If you don’t like the result, you must rewrite the first prompt from scratch.'), right: false,
        why: L3("Ko'pincha qisqa ikkinchi prompt yetarli: u faqat kerakli narsani tuzatadi.", 'Чаще хватает короткого второго промпта: он исправит только нужное.', 'Usually a short second prompt is enough: it fixes only what’s needed.') },
      { t: L3("Har bir promptdan keyin natijani yana tekshiramiz.", 'После каждого промпта снова проверяем результат.', 'After every prompt, we check the result again.'), right: true,
        why: L3("To'g'ri: tekshiramiz, tuzatamiz va yana tekshiramiz.", 'Верно: проверяем, исправляем и снова проверяем.', 'Right: check, fix and check again.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz natijani yaxshilashni bilasiz.", 'Всё верно! Ты умеешь улучшать результат.', 'All correct! You know how to improve the result.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Men natija yoqmasa «yaxshiroq qil» deyish kifoya deb o'ylagandim. Lekin sun'iy intellekt nima yoqmaganini bilmaydi! U saytni boshqatdan yozdi va yoqqan narsalar ham yo'qoldi. Shuning uchun oldin natijani tekshiramiz, keyin aniq yozamiz. Men adashibman.",
        'Вернёмся к загадке. Я думал, если результат не нравится, хватит сказать «сделай лучше». Но ИИ не знает, что тебе не понравилось! Он написал сайт заново, и пропало даже хорошее. Поэтому сначала проверяем результат, потом пишем точно. Я ошибся.',
        'Back to the riddle. I thought if you don’t like the result, “make it better” is enough. But the AI doesn’t know what you didn’t like! It rewrote the site, and even the good parts were lost. So first we check the result, then we write precisely. I was wrong.'), k: 'riddle' },
      { text: L3("Qarang, bu shirinliklar do'koni va sizning ikkinchi promptingiz.", 'Смотри, это магазин сладостей и твой второй промпт.', 'Look, this is the sweets shop and your second prompt.'), k: 'own' },
      { text: L3("Oldin natijani buyurtma bilan band-band solishtiramiz.", 'Сначала сверяем результат с заказом по пунктам.', 'First we check the result against the order point by point.'), k: 'look' },
      { text: L3("Keyin nimani va qanday o'zgartirishni aniq yozamiz.", 'Потом точно пишем, что и как изменить.', 'Then we write precisely what to change and how.'), k: 'fix' },
      { text: L3("Oxirida «qolganini o'zgartirma» deymiz, shunda yoqqan narsalar saqlanadi.", 'В конце — «остальное не меняй», тогда хорошее останется.', 'At the end, “don’t change anything else”, so the good parts stay.'), k: 'keep' },
      { text: L3("Va har bir promptdan keyin yana tekshiramiz: ikkinchi, uchinchi prompt.", 'И после каждого промпта снова проверяем: второй, третий промпт.', 'And after every prompt we check again: a second, a third prompt.'), k: 'loop' },
      { text: L3("Uyga vazifa: o'tgan darsdagi promptingizni haqiqiy sun'iy intellektga yuboring. Natijani tekshiring va aniq ikkinchi prompt yozing. Keyingi dars yakuniy loyiha: butun formula bilan o'z saytingizni yaratasiz. Ko'rishguncha!",
        'Домашнее задание: отправь свой промпт с прошлого урока настоящему ИИ. Проверь результат и напиши точный второй промпт. Следующий урок — финальный проект: сделаешь свой сайт по всей формуле. До встречи!',
        'Homework: send your prompt from the last lesson to a real AI. Check the result and write a precise second prompt. The next lesson is the final project: you’ll make your own site with the whole formula. See you!') }
    ],
    roles: {
      look: L3('tahlil: buyurtma bilan band-band solishtirish', 'анализ: сверить с заказом по пунктам', 'analysis: compare with the order point by point'),
      fix: L3("aniq tuzatish: nimani va qanday", 'точная правка: что и как', 'a precise fix: what and how'),
      keep: L3("qolganini o'zgartirma: yoqqani saqlanadi", 'остальное не меняй: хорошее остаётся', 'don’t change anything else: the good parts stay'),
      loop: L3('yana tekshirish: ikkinchi, uchinchi prompt', 'проверить снова: второй, третий промпт', 'check again: a second, a third prompt')
    },
    roleH: { look: L3('Tekshiring', 'Проверь', 'Check'), fix: L3('Nima va qanday', 'Что и как', 'What and how'), keep: L3('Qolgani', 'Остальное', 'The rest'), loop: L3('Yana', 'Снова', 'Again') },
    hw: L3("Haqiqiy sun'iy intellektda saytingizni yarating, natijani tekshiring va ikkinchi prompt yozing.", 'Сделай свой сайт с настоящим ИИ, проверь результат и напиши второй промпт.', 'Make your site with a real AI, check the result and write a second prompt.'),
    ask: L3('Promptlaringiz va saytga qarang', 'Посмотри на свои промпты и сайт', 'Look at your prompts and the site')
  }
};
// Детектив: два вторых промпта футбольного клуба (как в показе s5).
function C_FOOT_F1() { return L3("narxlar blokini qo'sh", 'добавь блок цен', 'add a prices block'); }
function C_FOOT_F2() { return L3("narxlar blokini qo'sh, qolganini o'zgartirma", 'добавь блок цен, остальное не меняй', 'add a prices block, don’t change anything else'); }

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, fix: 1, right: 1, ok: 1, sel: 1, opts: 1, type: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:ai7-fix.jsx@*/

/*@FILE:ai7-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:../ai4/ai4.css@*/
/*@FILE:../ai5/ai5.css@*/
/*@FILE:ai7.css@*/
`;
