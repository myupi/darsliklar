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
  empty: L3("Qator hali bo'm-bo'sh. Yozing-chi: nimani va qanday o'zgartiramiz?", 'Напиши промпт: что и как изменить?', 'Write the prompt: what to change and how?'),
  vague: L3("«Yaxshiroq» deganda nimani nazarda tutganingizni sun'iy intellekt bilmaydi. Aniqroq yozing: nimani va qanday o'zgartirish kerak?", 'Что значит «лучше», ИИ не знает. Напиши точно: что и как изменить.', 'The AI doesn’t know what “better” means. Be precise: what to change and how.'),
  none: L3("Bu so'zlardan sun'iy intellekt nimani tuzatishni tushunmadi. Masalan, shunday yozsa bo'ladi: «tugmani kattaroq qil».", 'ИИ не понял, что исправить. Например: сделай кнопку больше.', 'The AI didn’t understand what to fix. For example: make the button bigger.'),
  guess: L3("Nimani o'zgartirish yozilgan-u, qanday qilish yozilmagan. Shuning uchun sun'iy intellekt o'zicha taxmin qildi. U qanday bo'lishi kerak?", 'Что изменить — написано, а как — нет. ИИ угадал сам. Каким это должно стать?', 'You said what to change, but not how. The AI guessed. How should it be?'),
  keep: L3("Qarang, sun'iy intellekt boshqa narsalarga ham tegib ketibdi: rang, sarlavha, tartib o'zgaribdi! Oxiriga «qolganini o'zgartirma» deb qo'shing.", 'Смотри, ИИ поменял и другое: цвет, заголовок, порядок! Допиши в конце «остальное не меняй».', 'Look, the AI changed other things too: the colour, the title, the order! Add “don’t change anything else” at the end.')
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
    say: L3("Salom! Kayfiyatim zo'r: shirinliklar do'konining sayti birinchi promptdanoq tayyor bo'ldi! Mijozga deyarli hammasi yoqibdi. Faqat narxlar yo'q ekan, buyurtma tugmasi ham juda kichkina. Vaqtni tejash uchun bitta hiyla qildim: ikkinchi promptga ikkita so'z yozdim, «yaxshiroq qil». Nimani tuzatishni sun'iy intellekt o'zi tushunib oladi! Qani, «Yuborish»ni bosing.",
      'Привет! По первому промпту сайт магазина сладостей готов. Клиенту почти всё нравится. Только цен нет и кнопка маленькая. Я написал второй промпт: «сделай лучше». ИИ сам поймёт! Нажми «Отправить».',
      'Hi! The sweets shop site from the first prompt is ready. The client likes almost everything. Only there are no prices and the button is tiny. I wrote a second prompt: “make it better”. The AI will figure it out! Tap “Send”.'),
    magic: L3("Voy, bu nimasi? Sun'iy intellekt saytni boshqatdan yasab qo'yibdi: rangi ham, sarlavhasi ham, bloklarning tartibi ham o'zgaribdi. Narxlar esa hali ham yo'q, tugma ham o'sha-o'sha kichkina! «O'zi o'zgartirdi» degan belgilarni ko'ryapsizmi?",
      'Ого! ИИ сделал сайт заново: поменялись цвет, заголовок и порядок блоков. А цен всё нет, и кнопка всё такая же маленькая! Смотри, метки «Сам поменял».',
      'Whoa! The AI rebuilt the site: the colour, the title and the order of blocks changed. But there are still no prices, and the button is still tiny! Look at the “Changed by itself” labels.'),
    done: L3("Balki shunchaki omadim kelmagandir? Baribir hiylam yaxshi, deb o'ylayman: natija yoqmasa, «yaxshiroq qil» desangiz bas, nima yomonligini sun'iy intellekt o'zi biladi-ku! Siz bo'lsangiz-chi, mening hiylamni ishlatarmidingiz? Bugun natijani qanday yaxshilashni o'rganamiz, hiylam ishlaydimi, yo'qmi, o'shanda bilib olamiz.",
      'По-моему, если результат не нравится, хватит сказать «сделай лучше». ИИ ведь сам знает, что плохо! А ты как думаешь? Сегодня учимся улучшать результат.',
      'I think if you don’t like the result, “make it better” is enough. The AI knows by itself what’s wrong! What do you think? Today we learn how to improve the result.'),
    seen: { h: BUY, t: L3("«Hammasi o'zgarib ketdi! Rangimiz qani? Avvalgisi yoqqan edi. Narxlar esa hali ham yo'q!»", '«Всё стало другим! Где наш цвет? Прежний нам нравился. А цен так и нет!»', '“Everything is different! Where’s our colour? We liked the old one. And there are still no prices!”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("«Yaxshiroq qil» ishlamadi", '«Сделай лучше» не сработало', '“Make it better” didn’t work')
  },
  s2: {
    eyebrow: L3('Natijani tekshirish', 'Проверяем результат', 'Checking the result'),
    help: [
      L3("Buyurtma bilan saytga navbatma-navbat qarang-chi: buyurtmadagi har bir band saytda bormi?", 'Посмотри на пункты заказа и на сайт: каждый пункт есть на сайте?', 'Look at the order’s points and at the site: is each point on the site?'),
      L3("Bunday tekshiruvni tahlil deyishadi: natijani buyurtma bilan band-band solishtirib chiqasiz. Shunda nimani tuzatish kerakligi o'zi ko'rinib qoladi.", 'Анализ — это сравнить результат с заказом по пунктам. Тогда ясно, что именно исправлять.', 'Analysis means comparing the result with the order point by point. Then it’s clear exactly what to fix.'),
      L3("Do'kondan qaytganingizda ham shunday qilasiz-ku: ro'yxatga qarab xaltani tekshirasiz. Non bor, sut esa yo'q, demak, sutga yana borasiz. Tahlil ham xuddi shunday, faqat ro'yxatning o'rnida buyurtma turadi.", 'Вернулся из магазина — сверяешь покупки со списком: хлеб есть, молока нет. За молоком идёшь снова.', 'Back from the shop, you check the bags against the list: bread is there, milk isn’t. So you go back for milk.')
    ],
    say: L3("Hiylamga keyinroq qaytamiz. Oldin eng birinchi qadamdan boshlaylik: natijani tekshirish. Sun'iy intellekt kitob klubiga sayt yasab berdi. Ko'rinishi yaxshi, lekin u rostdan mijoz xohlagandekmi? Keling, buyurtmani band-band tekshirib chiqamiz.",
      'Первая часть — проверяем результат. ИИ сделал сайт книжного клуба. Но такой ли он, как хотел клиент? Проверим заказ по пунктам.',
      'The first part: checking the result. The AI made a book club site. But is it what the client wanted? Let’s check the order point by point.'),
    items: [
      { t: L3('Klub nomi', 'Название клуба', 'The club’s name'), ok: true, sel: '.title' },
      { t: L3('Uchrashuvlar jadvali', 'Расписание встреч', 'The meeting schedule'), ok: true, sel: '.bh1' },
      { t: L3("Asosiy rang ko'k", 'Основной цвет — синий', 'The main colour is blue'), ok: false, sel: '.badge' },
      { t: L3('Narxlar', 'Цены', 'Prices'), ok: false, sel: null }
    ],
    says: [
      L3("Birinchi bandda klubning nomi so'ralgan. Saytga qarang: nomi sarlavhada turibdi! Unga belgi qo'yamiz.", 'Первый пункт — название клуба. На сайте есть. Ставим отметку.', 'The first point: the club’s name. It’s on the site. Tick.'),
      L3("Ikkinchi band uchrashuvlar jadvalini so'raydi. U ham saytda alohida blok bo'lib turibdi, buni ham belgilaymiz.", 'Второй — расписание встреч. Тоже есть.', 'The second: the meeting schedule. That’s there too.'),
      L3("Uchinchi bandda esa asosiy rang ko'k bo'lsin, deyilgan. Lekin saytga bir qarang-chi: u yashil-ku! Bu band bajarilmagan.", 'Третий — основной цвет синий. Смотри, сайт зелёный! Это не выполнено.', 'The third: the main colour should be blue. Look, the site is green! That’s not done.'),
      L3("To'rtinchi bandda narxlar so'ralgan. Saytni oxirigacha ko'zdan kechiramiz-u, narxlar blokini hech qayerda topolmaymiz. Bu band ham bajarilmay qolibdi.", 'Четвёртый — цены. Смотрим сайт до конца: блока цен нет. Это тоже не выполнено.', 'The fourth: prices. We look through the whole site: there’s no prices block. That’s not done either.')
    ],
    done: L3("Ko'rdingizmi, natijani buyurtma bilan band-band solishtirib chiqdik. Endi «sayt yoqmadi» deb o'tirmaymiz, nimani tuzatish kerakligini aniq bilamiz: rang va narxlar.", 'Значит, сравниваем результат с заказом по пунктам. Теперь точно знаем, что исправлять: цвет и цены.', 'So we compare the result with the order point by point. Now we know exactly what to fix: the colour and the prices.'),
    asks: [L3('Qarang: buyurtma va sayt', 'Смотри: заказ и сайт', 'Watch: the order and the site'), L3('Qarang: nomi', 'Смотри: название', 'Watch: the name'), L3('Qarang: jadval', 'Смотри: расписание', 'Watch: the schedule'),
      L3('Qarang: rang', 'Смотри: цвет', 'Watch: the colour'), L3('Qarang: narxlar', 'Смотри: цены', 'Watch: the prices')],
    askDone: L3('Natija buyurtma bilan solishtirildi', 'Результат сверен с заказом', 'The result is checked against the order')
  },
  s3: {
    eyebrow: L3('Natijani tekshirish', 'Проверяем результат', 'Checking the result'),
    say: L3("Endi tekshiruvchi siz bo'lasiz. Rasm to'garagi ham buyurtma bergan edi, sun'iy intellekt ularga sayt yasab qo'ydi. Buyurtmani sayt bilan solishtiring-da, saytda bajarilmagan bandlarni tanlab chiqing. Keyin «Tekshirish»ni bosing.",
      'Теперь ты. Сравни заказ кружка рисования с сайтом. Нажми пункты, которые на сайте не выполнены, потом «Проверить».',
      'Your turn. Compare the art club’s order with the site. Tap the points the site hasn’t done, then “Check”.'),
    items: [
      { t: L3('Bolalar rasmlari galereyasi', 'Галерея детских рисунков', 'A gallery of kids’ drawings'), ok: true,
        why: L3("Galereyaga bir qarang-chi: bolalarning rasmlari o'z joyida turibdi. Bu band bajarilgan-ku.", 'Рисунки на сайте есть: галерея на месте. Этот пункт выполнен.', 'The pictures are on the site: the gallery is there. This point is done.') },
      { t: L3('Narxlar', 'Цены', 'Prices'), ok: false,
        why: L3("Narxlar-chi? Saytni oxirigacha aylantirib ko'ring: narxlar bloki hech qayerda yo'q.", 'Блока цен на сайте нет. Посмотри сайт до конца.', 'There’s no prices block on the site. Look through to the end.') },
      { t: L3('Telefon: +998 90 222 33 44', 'Телефон: +998 90 222 33 44', 'Phone: +998 90 222 33 44'), ok: false,
        why: L3("Telefon raqamiga diqqat qiling: saytdagisi buyurtmadagidan boshqacha. Raqamlarni bittalab solishtirib ko'ring.", 'Номер на сайте не тот, что в заказе. Сравни цифры.', 'The number on the site isn’t the one in the order. Compare the digits.') },
      { t: L3("Ro'yxatdan o'tish tugmasi", 'Кнопка «Записаться»', 'A “Sign up” button'), ok: true,
        why: L3("Ro'yxatdan o'tish tugmasi bor-ku, banner o'rtasida turibdi. Bu band bajarilgan.", 'Кнопка «Записаться» есть: в середине баннера. Этот пункт выполнен.', 'The “Sign up” button is there: in the middle of the banner. This point is done.') }
    ],
    msgs: {
      none: L3("Hali hech qaysi band tanlanmabdi. Saytda nima yetishmasa, o'sha bandni belgilang. Keyin «Tekshirish»ni bosing.", 'Нажми пункты, которых нет на сайте, потом «Проверить».', 'Tap the points the site hasn’t done, then “Check”.'),
      more: L3("Yana bitta band bajarilmay qolgan.", 'Ещё один пункт не выполнен.', 'One more point isn’t done.')
    },
    hints: [
      L3("Bandlarni bittalab o'qing-da, har birini saytdan qidirib ko'ring.", 'Ищи каждый пункт на сайте.', 'Look for each point on the site.'),
      L3("Narxlarga va telefon raqamiga yaxshilab qarang-chi.", 'Присмотрись к ценам и к номеру телефона.', 'Look closely at the prices and the phone number.'),
      L3("«Narxlar» bilan «Telefon» bandlarini tanlang-da, «Tekshirish»ni bosing.", 'Нажми пункты «Цены» и «Телефон».', 'Tap the “Prices” and “Phone” points.')
    ],
    ok: L3("Ko'zingiz o'tkir ekan! Narxlar yo'q, telefon raqami ham boshqa. Endi nimani tuzatishni aniq bilamiz!", 'Огонь! Цен нет, а телефон не тот. Теперь точно знаем, что исправлять!', 'Awesome! No prices, and the phone is wrong. Now we know exactly what to fix!'),
    ask: L3('Bajarilmagan bandlarni bosing', 'Нажми невыполненные пункты', 'Tap the points not done')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Muammoni topdingiz, endi uni aniq aytish ham kerak. Chunki «yoqmadi» desangiz, nimani tuzatish kerakligini hech kim bilmaydi. Har safar ikkita gap chiqadi: qaysi biri muammoni aniqroq aytadi?", 'Проблему тоже надо назвать точно. Какая из двух фраз называет её точнее?', 'A problem has to be named precisely too. Which of the two sentences names it more precisely?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3('Qaysi kuzatuv aniqroq?', 'Какое наблюдение точнее?', 'Which observation is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi gapda aniq bir narsaning nomi bor: blokmi, raqammi yoki rangmi?", 'Где названа конкретная вещь: блок, номер или цвет?', 'Which one names a real thing: a block, a number or a colour?'),
    hint2: L3("«Yoqmadi», «noto'g'ri», «chiroyli emas» kabi so'zlar nimani tuzatish kerakligini aytmaydi.", '«Не нравится», «неправильно», «некрасиво» не говорят, что исправлять.', '“Don’t like it”, “wrong” and “not pretty” don’t say what to fix.'),
    items: [
      { a: L3('Sayt yoqmadi.', 'Сайт не понравился.', 'I don’t like the site.'), b: L3("Narxlar bloki yo'q.", 'Нет блока цен.', 'There’s no prices block.'), right: 'b',
        why: L3("Ikkinchi gapda muammo aniq aytilgan: narxlar yo'q. «Yoqmadi» degan gapdan esa nimani tuzatishni bilib bo'lmaydi.", 'Во втором есть точная проблема — нет цен. Из «не понравился» не понять, что исправлять.', 'The second names the exact problem: no prices. “I don’t like it” doesn’t say what to fix.') },
      { a: L3('Telefon raqami mijozniki emas.', 'Номер телефона не клиента.', 'The phone number isn’t the client’s.'), b: L3("Nimadir noto'g'ri.", 'Что-то не так.', 'Something’s wrong.'), right: 'a',
        why: L3("Birinchi gap aniqroq, chunki unda qaysi narsa joyida emasligi aytilgan: telefon raqami. «Nimadir noto'g'ri» desangiz, nima ekanini hech kim bilmaydi.", 'Первое точное: говорит, что именно не так.', 'The first is precise: it says exactly what’s wrong.') },
      { a: L3('Rangi chiroyli emas.', 'Цвет некрасивый.', 'The colour isn’t pretty.'), b: L3("Sayt yashil, mijoz esa ko'k so'ragan.", 'Сайт зелёный, а клиент просил синий.', 'The site is green, but the client asked for blue.'), right: 'b',
        why: L3("Ikkinchi gap nimani va qanday tuzatishni ham aytadi: yashil rangni ko'kka almashtirish kerak.", 'Второе говорит, что и как исправить: зелёный на синий.', 'The second says what to fix and how: green to blue.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Hammasini topdingiz! Endi muammoni «yoqmadi» demasdan, aniq nomlaysiz.", 'Всё верно! Ты называешь проблему точно.', 'All correct! You name the problem precisely.')
  },
  s5: {
    eyebrow: L3("Qolganini o'zgartirma", 'Остальное не меняй', 'Don’t change the rest'),
    card: { h: BUY, t: L3("«Narxlarni qo'shing. Qolgani zo'r, hech narsani o'zgartirmang!»", '«Добавьте цены. Остальное отлично, ничего не меняйте!»', '“Add the prices. The rest is great, don’t change anything!”') },
    help: [
      L3("Ikkinchi promptni o'qing, keyin saytning rangi, sarlavhasi va bloklariga bir qarang-chi: nimalar o'zgardi?", 'Посмотри на второй промпт и на цвет, заголовок и блоки сайта.', 'Look at the second prompt and at the site’s colour, title and blocks.'),
      L3("Sun'iy intellekt har bir yangi promptdan keyin saytni boshqatdan yozib yuborishi mumkin. «Qolganini o'zgartirma» degan so'zlar unga «Faqat aytilganini o'zgartir, boshqasiga tegma», deb aytadi.", 'ИИ может на каждый новый промпт писать сайт заново. «Остальное не меняй» — значит, меняй только сказанное, другого не трогай.', 'The AI may rewrite the site on every new prompt. “Don’t change anything else” means change only what was asked, leave the rest alone.'),
      L3("Sartaroshga borganingizda «Faqat uchini qisqartiring», deysiz-ku. Aytmasangiz, u butun soch turmagingizni o'zgartirib yuborishi mumkin. Promptdagi «qolganini o'zgartirma» ham xuddi shu ishni qiladi.", 'Парикмахеру говоришь: «только подровняйте кончики». Не скажешь — может поменять всю стрижку.', 'You tell a hairdresser “just trim the ends”. If you don’t, they might change the whole haircut.')
    ],
    say: L3("Endi ikkinchi qadamga o'tamiz. Futbol klubining mijozi bittagina narsa so'radi: narxlar. Qolgani unga yoqqan. Qani, ikkinchi promptni ikki xil yozib, nima bo'lishini ko'ramiz.",
      'Вторая часть — остальное не меняй. Клиент футбольного клуба просил только цены. Напишем второй промпт двумя способами.',
      'The second part: don’t change anything else. The football club’s client only asked for prices. Let’s write the second prompt two ways.'),
    f1: L3("narxlar blokini qo'sh", 'добавь блок цен', 'add a prices block'),
    f2: L3("narxlar blokini qo'sh, qolganini o'zgartirma", 'добавь блок цен, остальное не меняй', 'add a prices block, don’t change anything else'),
    says: [
      L3("Oldin oddiygina yozamiz: «narxlar blokini qo'sh». Ana, narxlar paydo bo'ldi! Lekin rangi ham, sarlavhasi ham, bloklar tartibi ham o'zgarib ketdi. Sun'iy intellekt saytni yana boshqatdan yozibdi.",
        'Сначала пишем так: добавь блок цен. Смотри, цены появились! Но поменялись и цвет, и заголовок, и порядок блоков. ИИ написал сайт заново.',
        'First we write: add a prices block. Look, the prices appeared! But the colour, the title and the order of blocks changed too. The AI rewrote the site.'),
      L3("Endi shu promptning oxiriga «qolganini o'zgartirma» deb qo'shamiz. Bu safar faqat narxlar qo'shildi, rang, sarlavha va tartib esa joyidan ham qimirlamadi!",
        'Теперь допишем в конце: остальное не меняй. Вот, добавились только цены. Цвет, заголовок и порядок — как были!',
        'Now we add at the end: don’t change anything else. There, only the prices were added. The colour, title and order are as before!')
    ],
    done: L3("Demak, ikkinchi promptda oldin nimani o'zgartirishni yozamiz, oxirida esa «qolganini o'zgartirma» deymiz. Shunda mijozga yoqqan narsalar joyida qoladi.", 'Значит, во втором промпте пишем, что изменить, а в конце — «остальное не меняй». Тогда то, что нравилось, останется.', 'So in the second prompt we write what to change, and at the end “don’t change anything else”. Then the good parts stay.'),
    asks: [L3('Qarang: birinchi natija', 'Смотри: первый результат', 'Watch: the first result'), L3("Qarang: hammasi o'zgardi", 'Смотри: поменялось всё', 'Watch: everything changed'), L3('Qarang: faqat narxlar', 'Смотри: только цены', 'Watch: only the prices')],
    askDone: L3("«Qolganini o'zgartirma» yoqqanini saqlaydi", '«Остальное не меняй» сохраняет хорошее', '“Don’t change anything else” keeps the good parts')
  },
  s6: {
    eyebrow: L3("Qolganini o'zgartirma", 'Остальное не меняй', 'Don’t change the rest'),
    card: { h: BUY, t: L3("«Sharhlar blokini qo'shing. Qolgani menga juda yoqdi, hech narsani o'zgartirmang!»", '«Добавьте блок отзывов. Остальное нам очень нравится, ничего не меняйте!»', '“Add a reviews block. We really like the rest, don’t change anything!”') },
    say: L3("Raqs to'garagidan ham xabar keldi: ular sharhlar blokini so'rashyapti, qolgani esa ularga juda yoqibdi. Ikkinchi promptni endi o'zingiz yozing: nima qo'shilsin va qolgani o'zgarmasin.",
      'Теперь ты. Танцевальный кружок попросил отзывы. Напиши второй промпт: что добавить и чтобы остальное не менялось.',
      'Your turn. The dance club asked for reviews. Write the second prompt: what to add, and that the rest stays the same.'),
    ph: L3("nimani o'zgartiramiz?", 'что изменить?', 'what to change?'),
    msgs: { add: L3("Sharhlar qo'shilmay qoldi-ku. Mijoz aynan sharhlar blokini so'ragan edi.", 'Отзывы не добавились. Клиент просил блок отзывов.', 'The reviews weren’t added. The client asked for a reviews block.') },
    hints: [
      L3("Mijozning xabarini qayta o'qing: unda ikki narsa bor. Biri nimani qo'shish, ikkinchisi qolganiga tegmaslik.", 'Клиент сказал две вещи: что добавить и что остальное не трогать.', 'The client said two things: what to add, and to leave the rest alone.'),
      L3("Oldin «sharhlar blokini qo'sh» deb yozing, keyin vergul qo'yib, «qolganini o'zgartirma» deng.", 'Добавь блок отзывов, потом запятая и «остальное не меняй».', 'Add a reviews block, then a comma and “don’t change anything else”.'),
      L3("Promptning tagida namuna paydo bo'ldi. Shu qatorni o'zingiz yozib chiqing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("sharhlar blokini qo'sh, qolganini o'zgartirma", 'добавь блок отзывов, остальное не меняй', 'add a reviews block, don’t change anything else'),
    ok: L3("Ajoyib! Sharhlar qo'shildi, qolgani esa qanday bo'lsa, shundayligicha turibdi. Raqs to'garagi xursand!", 'Класс! Отзывы добавились, остальное как было. Клиент доволен!', 'Great! The reviews were added, and the rest is as before. The client is happy!'),
    ask: L3('Ikkinchi promptni yozing', 'Напиши второй промпт', 'Write the second prompt')
  },
  s7: {
    eyebrow: L3('Qaysi biri yaxshiroq?', 'Какой лучше?', 'Which is better?'),
    say: L3("Qani, bu qoidani qanchalik yaxshi tushunganingizni bir sinab ko'raylik. Har safar ikkita prompt chiqadi: qaysi biri faqat kerakli narsani o'zgartiradi?", 'Теперь проверим. Какой из двух промптов меняет только нужное?', 'Now let’s check. Which of the two prompts changes only what’s needed?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi biri faqat kerakli narsani o'zgartiradi?", 'Какой меняет только нужное?', 'Which one changes only what’s needed?'),
    ask: L3('Tanlang', 'Выбери', 'Choose'),
    hint1: L3("Qaysi promptda «qolganini o'zgartirma» degan so'zlar bor?", 'Где есть «остальное не меняй»?', 'Which one has “don’t change anything else”?'),
    hint2: L3("«Qaytadan yarat» deb yozsangiz yoki o'sha so'zlarni unutsangiz, sun'iy intellekt boshqa narsalarni ham o'zgartirib yuboradi.", 'После «сделай заново» или без этих слов ИИ меняет и другое.', 'After “redo it” or without those words, the AI changes other things too.'),
    items: [
      { a: L3("Telegram tugmasini qo'sh", 'добавь кнопку Telegram', 'add a Telegram button'), b: L3("Telegram tugmasini qo'sh, qolganini o'zgartirma", 'добавь кнопку Telegram, остальное не меняй', 'add a Telegram button, don’t change anything else'), right: 'b',
        why: L3("Ikkinchi prompt qolganini saqlab qoladi. Birinchisidan keyin esa sun'iy intellekt saytni boshqatdan yozib yuborishi mumkin.", 'Второй сохраняет остальное. После первого ИИ может написать сайт заново.', 'The second keeps the rest. After the first, the AI may rewrite the site.') },
      { a: L3("chatni olib tashla, qolganini o'zgartirma", 'убери чат, остальное не меняй', 'remove the chat, don’t change anything else'), b: L3('hammasini qaytadan yarat', 'сделай всё заново', 'redo everything from scratch'), right: 'a',
        why: L3("«Hammasini qaytadan yarat» deyilsa, butun sayt o'zgaradi. Birinchi prompt esa faqat chatni olib tashlaydi.", '«Сделай заново» меняет всё. Первый убирает только чат.', '“Redo everything” changes it all. The first only removes the chat.') },
      { a: L3("sarlavhani kattaroq qil, boshqa hech narsani o'zgartirma", 'сделай заголовок больше, больше ничего не меняй', 'make the title bigger, don’t change anything else'), b: L3('sarlavhani kattaroq qil', 'сделай заголовок больше', 'make the title bigger'), right: 'a',
        why: L3("Birinchi promptda «boshqa hech narsani o'zgartirma» degan so'zlar bor, shuning uchun faqat sarlavha o'zgaradi.", 'В первом есть «больше ничего не меняй». Тогда изменится только заголовок.', 'The first says “don’t change anything else”. Then only the title changes.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("Qoyil! Yoqqan narsalarni asrab qoladigan promptni darrov taniyapsiz.", 'Класс! Ты выбираешь промпт, который бережёт хорошее.', 'Great! You pick the prompt that keeps the good parts.')
  },
  s8: {
    eyebrow: L3('Nima va qanday', 'Что и как', 'What and how'),
    card: { h: BUY, t: L3("«Buyurtma tugmasi ko'rinmayapti! Uni kattaroq va qizil qiling.»", '«Кнопку заказа не видно! Сделайте её больше и красной».', '“You can’t see the order button! Make it bigger and red.”') },
    help: [
      L3("Ikkinchi promptni o'qib, saytdagi tugmaga qarang: u qanday o'zgardi?", 'Посмотри на второй промпт и на кнопку сайта.', 'Look at the second prompt and at the site’s button.'),
      L3("Agar tuzatishda «nima» ham, «qanday» ham yozilgan bo'lsa, uni aniq tuzatish deyishadi. Bittasi tushib qolsa, yetishmaganini sun'iy intellekt o'zicha taxmin qiladi.", 'Точная правка — это сказать, что и как изменить. Не хватает одного — ИИ угадывает сам.', 'A precise fix says what to change and how. If one is missing, the AI guesses.'),
      L3("Yana o'sha sartaroshni eslaylik: unga «Sochimni o'zgartiring» desangiz, nima chiqishini oldindan bilmaysiz. «Ikki santimetr qisqartiring» desangiz, hammasi tushunarli bo'ladi. Promptda ham «nima» bilan «qanday» birga kelsa, natija aniq chiqadi.", 'Скажешь парикмахеру «измените мне причёску» — не знаешь, что получится. Скажешь «короче на два сантиметра» — ясно.', 'Tell a hairdresser “change my hair” and you don’t know what you’ll get. Say “two centimetres shorter”, and it’s clear.')
    ],
    say: L3("Uchinchi qadamimiz «nima va qanday» haqida bo'ladi. Muzqaymoq do'konining mijozi saytdagi tugmani ko'rmayapti, u juda kichkina ekan. Keling, ikkinchi promptni uch xil yozib ko'ramiz-chi, qaysi biri ishlarkin?",
      'Третья часть — что и как. Клиент магазина мороженого не видит кнопку. Попробуем три разных вторых промпта.',
      'The third part: what and how. The ice cream shop’s client can’t see the button. Let’s try three different second prompts.'),
    f1: L3("yaxshiroq qil, qolganini o'zgartirma", 'сделай лучше, остальное не меняй', 'make it better, don’t change anything else'),
    f2: L3("tugmani o'zgartir, qolganini o'zgartirma", 'измени кнопку, остальное не меняй', 'change the button, don’t change anything else'),
    f3: L3("tugmani kattaroq va qizil qil, qolganini o'zgartirma", 'сделай кнопку больше и красной, остальное не меняй', 'make the button bigger and red, don’t change anything else'),
    says: [
      L3("Oldin mening sevimli hiylamni sinaymiz: «yaxshiroq qil». Ko'rdingizmi? Sun'iy intellekt nimani yaxshilashni bilmay, sarlavhaning shriftini almashtiribdi. Tugma esa haliyam o'sha-o'sha kichkina!",
        'Сначала пишем «сделай лучше». ИИ не знал, что улучшать, и поменял шрифт заголовка. А кнопка всё такая же маленькая!',
        'First we write “make it better”. The AI didn’t know what to improve and changed the title’s font. The button is still tiny!'),
      L3("Endi «tugmani o'zgartir» deb yozamiz. Nimani o'zgartirishni u tushundi, lekin qanday qilishni bilmadi va tugmani o'zicha qora-sariq qilib qo'ydi. Mijoz esa qizil tugma so'ragan edi-ku!",
        'Теперь «измени кнопку». Что менять, ИИ понял, а как — нет. Сделал её чёрно-жёлтой. А клиент просил красную!',
        'Now “change the button”. The AI knew what to change, but not how. It made it black and yellow. But the client asked for red!'),
      L3("Nihoyat, aniq yozamiz: «tugmani kattaroq va qizil qil». Tugma xuddi mijoz xohlagandek bo'ldi-ku!", 'А теперь точно: сделай кнопку больше и красной. Вот, как хотел клиент!', 'Now precisely: make the button bigger and red. There, just as the client wanted!')
    ],
    done: L3("Demak, ikkinchi promptga ikkita narsa kerak ekan: nimani o'zgartirish va qanday qilib. «Tugma» so'zi nimani o'zgartirishni aytadi, «kattaroq va qizil» esa qanday qilishni.", 'Значит, во втором промпте нужно двое: что изменить и как. «Кнопка» — это что, «больше и красной» — это как.', 'So the second prompt needs two things: what to change and how. “The button” is what, “bigger and red” is how.'),
    asks: [L3('Qarang: tugma kichkina', 'Смотри: кнопка маленькая', 'Watch: the button is tiny'), L3('Qarang: «yaxshiroq qil»', 'Смотри: «сделай лучше»', 'Watch: “make it better”'),
      L3("Qarang: «tugmani o'zgartir»", 'Смотри: «измени кнопку»', 'Watch: “change the button”'), L3('Qarang: aniq tuzatish', 'Смотри: точная правка', 'Watch: a precise fix')],
    askDone: L3('Nima va qanday: aniq tuzatish', 'Что и как — точная правка', 'What and how: a precise fix')
  },
  s9: {
    eyebrow: L3('Nima va qanday', 'Что и как', 'What and how'),
    card: { h: BUY, t: L3("«Sarlavha juda kichkina, uzoqdan ko'rinmaydi. Uni kattaroq qiling. Qolgani yaxshi.»", '«Заголовок совсем маленький, издалека не видно. Сделайте его больше. Остальное хорошо».', '“The title is tiny, you can’t see it from afar. Make it bigger. The rest is fine.”') },
    say: L3("Velosiped do'konining mijozi ham norozi: sarlavha juda kichkina, uzoqdan ko'rinmayapti. Shu safar ikkinchi promptni siz yozasiz. Nimani va qanday o'zgartirishni aniq ayting.",
      'Теперь ты. Клиент магазина велосипедов не видит заголовок. Напиши во втором промпте точно, что и как изменить.',
      'Your turn. The bike shop’s client can’t see the title. In the second prompt, write precisely what to change and how.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: {
      title: L3("Sarlavha hamon kichkina turibdi, mijoz esa uni uzoqdan ko'rishni xohlaydi. Uni kattaroq qilish kerak.", 'Заголовок всё ещё маленький. Клиент просил сделать его больше.', 'The title is still tiny. The client asked for it to be bigger.'),
      btn: L3("Bu prompt tugmani o'zgartirib qo'ydi. Mijoz esa sarlavha haqida yozgan edi.", 'Это поменяло кнопку. А клиент просил заголовок.', 'That changed the button. But the client asked about the title.')
    },
    hints: [
      L3("Mijozning xabarini o'qing-chi: qaysi narsa haqida yozgan-u, u qanday bo'lishi kerak?", 'Что сказал клиент: что именно и каким оно должно стать?', 'What did the client say: which thing, and how should it be?'),
      L3("O'zgartiradigan narsamiz sarlavha bo'ladi, uni kattaroq qilish kerak. Oxirida esa «qolganini o'zgartirma» deb qo'shing.", 'Что: заголовок. Как: больше. В конце: остальное не меняй.', 'What: the title. How: bigger. At the end: don’t change anything else.'),
      L3("Yordam uchun pastga namuna qo'ydim: unda sarlavha ham, «qolganini o'zgartirma» ham bor. Shuni yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("sarlavhani kattaroq qil, qolganini o'zgartirma", 'сделай заголовок больше, остальное не меняй', 'make the title bigger, don’t change anything else'),
    ok: L3("Zo'r! Endi sarlavha katta, uni uzoqdan ham ko'rsa bo'ladi. Qolgani esa o'z joyida!", 'Огонь! Заголовок большой, видно издалека. Остальное как было!', 'Awesome! The title is big, you can see it from afar. The rest is as before!'),
    ask: L3('Aniq tuzatish yozing', 'Напиши точную правку', 'Write a precise fix')
  },
  s10: {
    eyebrow: L3('Ikkinchi va uchinchi prompt', 'Второй и третий промпт', 'The second and third prompt'),
    card: { h: BUY, t: L3("«Telefonimiz +998 93 100 20 30. Chat kerak emas, javob berishga vaqtimiz yo'q.»", '«Наш телефон +998 93 100 20 30. Чат не нужен, нам некогда отвечать».', '“Our phone is +998 93 100 20 30. We don’t need a chat, we have no time to answer.”') },
    help: [
      L3("Prompt qatorlarini bittalab ko'zdan kechiring: birinchi, ikkinchi, keyin uchinchi.", 'Посмотри на строки промптов: первый, второй, третий.', 'Look at the prompt lines: first, second, third.'),
      L3("Ikkinchi va uchinchi prompt natijani ko'rib bo'lgandan keyin yoziladi, ular qisqa tuzatishlar bo'ladi. Har biridan keyin saytni yana bir bor tekshiramiz.", 'Второй и третий промпт — короткие правки, которые пишут, посмотрев на результат. После каждой сайт проверяют снова.', 'The second and third prompts are short fixes you write after looking at the result. After each one, you check the site again.'),
      L3("Uy vazifasini ham shunday tekshirasiz-ku: kamchilikni topasiz, tuzatasiz, keyin yana bir o'qib chiqasiz. Ikkinchi va uchinchi prompt ham saytni xuddi shunday, qadam-baqadam to'g'rilaydi.", 'Так же проверяешь домашку: находишь ошибку, исправляешь, перечитываешь снова.', 'It’s like checking homework: you find a mistake, fix it, and read it through again.')
    ],
    say: L3("To'rtinchi qadam eng qizig'i: ikkinchi va uchinchi prompt. Basketbol klubining saytida ikkita muammo bor. Telefon raqamini sun'iy intellekt to'qib chiqaribdi, ustiga-ustak keraksiz chat ham qo'yibdi. Ularni birma-bir tuzatamiz.",
      'Четвёртая часть — второй и третий промпт. На сайте баскетбольного клуба две проблемы: номер выдуман, и есть ненужный чат. Исправляем шаг за шагом.',
      'The fourth part: the second and third prompt. The basketball club site has two problems: a made-up number and an unwanted chat. Let’s fix them step by step.'),
    f2: L3("telefon raqamini +998 93 100 20 30 qil, qolganini o'zgartirma", 'поставь номер +998 93 100 20 30, остальное не меняй', 'set the phone number to +998 93 100 20 30, don’t change anything else'),
    f3: L3("chatni olib tashla, qolganini o'zgartirma", 'убери чат, остальное не меняй', 'remove the chat, don’t change anything else'),
    says: [
      L3("Ikkinchi promptda telefon raqamini to'g'irlaymiz va qolganiga tegmaymiz. Mana, banner ostida endi to'g'ri raqam turibdi. Natijani yana tekshiramiz-u, chat hali ham o'z joyida-ku!",
        'Второй промпт: исправляем номер, остальное не меняем. Смотри, под баннером правильный номер. Снова проверяем результат: чат всё ещё на месте!',
        'The second prompt: we fix the phone number and change nothing else. Look, the right number is under the banner. We check the result again: the chat is still there!'),
      L3("Shuning uchun uchinchi prompt yozamiz: «chatni olib tashla, qolganini o'zgartirma». Chat g'oyib bo'ldi, raqam esa joyida qoldi. Endi hammasi buyurtmadagidek!",
        'Третий промпт: убери чат, остальное не меняй. Чат пропал, номер на месте. Теперь всё как в заказе!',
        'The third prompt: remove the chat, don’t change anything else. The chat is gone, the number stays. Now everything matches the order!')
    ],
    done: L3("Shunday qilib, ish tartibi bunday: natijani tekshiramiz, aniq tuzatamiz va yana tekshiramiz. Kerak bo'lsa, ikkinchidan keyin uchinchi, hatto to'rtinchi prompt ham yozamiz.", 'Значит, порядок такой: проверяем результат, точно исправляем и снова проверяем. Второй, третий, а если нужно — и четвёртый промпт.', 'So the order is: check the result, fix precisely, and check again. A second, a third, and a fourth prompt if needed.'),
    asks: [L3('Qarang: ikkita muammo', 'Смотри: две проблемы', 'Watch: two problems'), L3('Qarang: ikkinchi prompt', 'Смотри: второй промпт', 'Watch: the second prompt'), L3('Qarang: uchinchi prompt', 'Смотри: третий промпт', 'Watch: the third prompt')],
    askDone: L3('Tekshiring, tuzating, yana tekshiring', 'Проверь, исправь, проверь снова', 'Check, fix, check again')
  },
  s11: {
    eyebrow: L3('Ikkinchi prompt', 'Второй промпт', 'The second prompt'),
    card: { h: BUY, t: L3("«Buyurtma tugmasi juda kichkina, uni hech kim ko'rmayapti. Kattaroq qiling! Qolgani zo'r.»", '«Кнопка заказа совсем маленькая, её никто не видит. Сделайте больше! Остальное отлично».', '“The order button is tiny, nobody sees it. Make it bigger! The rest is great.”') },
    say: L3("Endi pitsa kafesiga yordam beramiz. Ularning buyurtma tugmasi shunchalik kichkinaki, uni hech kim ko'rmayapti. Qani, ikkinchi promptni yozib ko'ring.", 'Теперь ты. У пиццерии совсем маленькая кнопка. Напиши второй промпт.', 'Your turn. The pizza cafe’s button is tiny. Write the second prompt.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: { big: L3("Tugma hali ham kichkina-ku, mijoz esa uni kattaroq qilishni iltimos qilgan.", 'Кнопка всё ещё маленькая. Клиент просил больше.', 'The button is still tiny. The client asked for it bigger.') },
    hints: [
      L3("Nimani o'zgartiramiz? Tugmani. Qanday qilib? Kattaroq qilib.", 'Что: кнопка. Как: больше.', 'What: the button. How: bigger.'),
      L3("Oxirida «qolganini o'zgartirma» deb qo'shishni unutmang.", 'В конце допиши «остальное не меняй».', 'At the end add “don’t change anything else”.'),
      L3("Namunaga qarang: oldin tugma haqida, keyin «qolganini o'zgartirma». Shu tartibda yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("tugmani kattaroq qil, qolganini o'zgartirma", 'сделай кнопку больше, остальное не меняй', 'make the button bigger, don’t change anything else'),
    ok: L3("Barakalla! Tugma kattalashdi, endi uni hamma ko'radi. Qolgani esa avvalgidek turibdi.", 'Молодец! Кнопка большая, теперь её все видят. Остальное как было!', 'Well done! The button is big, and everyone sees it now. The rest is as before!'),
    ask: L3('Ikkinchi promptni yozing', 'Напиши второй промпт', 'Write the second prompt')
  },
  s12: {
    eyebrow: L3('Uchinchi prompt', 'Третий промпт', 'The third prompt'),
    card: { h: BUY, t: L3("«Endi zo'r! Yana bitta iltimos: Telegram tugmasini ham qo'shing.»", '«Теперь отлично! Ещё одна просьба: добавьте кнопку Telegram».', '“Now it’s great! One more thing: add a Telegram button too.”') },
    say: L3("Pitsa kafesi natijani ko'rib, yana bitta iltimos bilan keldi. Endi uchinchi promptni yozasiz. Qarang, ikkinchi promptingiz ham o'z qatorida turibdi.", 'Клиент посмотрел результат и попросил ещё одно. Напиши третий промпт. Смотри, второй промпт тоже на месте.', 'The client saw the result and asked for one more thing. Write the third prompt. Look, the second prompt is still there.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: { tg: L3("Telegram tugmasi hali yo'q. Mijozning yangi iltimosi aynan shu tugma edi.", 'Кнопки Telegram нет. Клиент просил её.', 'There’s no Telegram button. The client asked for it.') },
    hints: [
      L3("Mijoz nimani so'rayapti? Telegram tugmasini.", 'Что просит клиент? Кнопку Telegram.', 'What does the client want? A Telegram button.'),
      L3("«Telegram tugmasini qo'sh» deb yozing, oxiriga esa «qolganini o'zgartirma»ni qo'shing.", 'Добавь кнопку Telegram, остальное не меняй.', 'Add a Telegram button, don’t change anything else.'),
      L3("Uchinchi promptning namunasi ham tayyor. Telegram so'zini adashtirmay yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Telegram tugmasini qo'sh, qolganini o'zgartirma", 'добавь кнопку Telegram, остальное не меняй', 'add a Telegram button, don’t change anything else'),
    ok: L3("Ajoyib! Telegram tugmasi paydo bo'ldi, katta tugma ham joyida. Uchinchi prompt ham ish berdi!", 'Класс! Кнопка Telegram есть, и большая кнопка на месте. Третий промпт тоже сработал!', 'Great! The Telegram button is there, and the big button stays. The third prompt worked too!'),
    ask: L3('Uchinchi promptni yozing', 'Напиши третий промпт', 'Write the third prompt')
  },
  g1: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("«Bizning rangimiz qizil. Saytning asosiy rangi qizil bo'lsin!»", '«Наш цвет — красный. Пусть основной цвет сайта будет красным!»', '“Our colour is red. Make the site’s main colour red!”') },
    bad: L3("rangini o'zgartir, qolganini o'zgartirma", 'измени цвет, остальное не меняй', 'change the colour, don’t change anything else'),
    say: L3("Voy, men ham shoshib qolibman. Sport klubi uchun ikkinchi promptga «rangini o'zgartir» deb yozibman. Sun'iy intellekt rangni o'zgartirdi-yu, saytni binafsha qilib qo'ydi! Mijoz qaysi rangni so'ragan edi? Qani, mening qatorimni tuzatib bering.",
      'Я написал для спортивного клуба второй промпт: «измени цвет». ИИ поменял цвет, но сделал фиолетовым! А какой цвет просил клиент? Исправь мою строку.',
      'I wrote a second prompt for the sports club: “change the colour”. The AI changed it, but made it purple! Which colour did the client ask for? Fix my line.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: {
      color: L3("Rangni sun'iy intellekt haliyam o'zi tanlayapti. Qanday rang kerakligini yozing: mijoz qizil degan.", 'ИИ всё ещё выбирает цвет сам. Какой цвет? Клиент: красный.', 'The AI is still choosing the colour itself. Which colour? The client says: red.'),
      wrong: L3("Bu boshqa rang bo'lib qoldi. Mijoz qizil rang so'ragan edi.", 'Это другой цвет. Клиент просил красный.', 'That’s a different colour. The client asked for red.'),
      btn: L3("Bu prompt faqat tugmani bo'yadi. Mijoz esa butun saytning asosiy rangini so'ragan.", 'Это покрасило только кнопку. Клиент просил основной цвет сайта.', 'That only coloured the button. The client asked for the site’s main colour.')
    },
    hints: [
      L3("Mening qatorimda «nima» bor-u, «qanday» yo'q.", 'В строке Коди есть «что», но нет «как».', 'Kodi’s line has “what”, but not “how”.'),
      L3("«Rangni» so'zidan keyin qaysi rang ekanini aniq yozing: qizil.", 'После слова «цвет» напиши точный цвет: красный.', 'After the word “colour”, write the exact colour: red.'),
      L3("Mening qatorim qanday bo'lishi kerakligini pastda ko'rsatib qo'ydim. Shuni yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("asosiy rangni qizil qil, qolganini o'zgartirma", 'сделай основной цвет красным, остальное не меняй', 'make the main colour red, don’t change anything else'),
    ok: L3("Rahmat, qatorimni tuzatdingiz! Sayt endi qizil, xuddi mijozning rangidek. Aniq aytilsa, sun'iy intellekt taxmin qilib o'tirmaydi!", 'Огонь! Теперь сайт красный, как цвет клиента. Когда сказано точно, ИИ не гадает!', 'Awesome! Now the site is red, just like the client’s colour. When you say it precisely, the AI doesn’t guess!'),
    ask: L3('Kodining qatorini tuzating', 'Исправь строку Коди', 'Fix Kodi’s line')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi bir oz izquvarlik qilamiz. Futbol klubining mijozi narxlarni so'ragan edi, kimdir unga ikkinchi prompt yuboribdi. Sayt bilan belgilarga qarab toping-chi: qaysi prompt yuborilgan ekan?", 'Теперь побудем детективами. Клиент футбольного клуба просил цены. Посмотри на сайт и на метки: какой второй промпт отправили?', 'Let’s be detectives. The football club’s client asked for prices. Look at the site and the labels: which second prompt was sent?'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3('Qaysi ikkinchi prompt shu saytni berdi?', 'Какой второй промпт дал этот сайт?', 'Which second prompt gave this site?'),
    before: L3('Oldin: yashil sayt, bloklar: Rasmlar, Jadval, Aloqa', 'Было: зелёный сайт, блоки: Фото, Расписание, Контакты', 'Before: a green site, blocks: Photos, Schedule, Contact'),
    hint1: L3("Saytdagi belgilarga qarang: «2-prompt» deyilganmi yoki «O'zi o'zgartirdi»?", 'Посмотри на метки: «Промпт 2» или «Сам поменял».', 'Look at the labels: “Prompt 2” or “Changed by itself”.'),
    hint2: L3("Agar sun'iy intellekt o'zicha o'zgartirgan bo'lsa, «qolganini o'zgartirma» yozilmagan. Narxlar umuman bo'lmasa, prompt noaniq yozilgan.", 'Если ИИ поменял сам — «остальное не меняй» не написали. Если цен нет — промпт неточный.', 'If the AI changed things itself, “don’t change anything else” wasn’t written. If there are no prices, the prompt was vague.'),
    items: [
      { fix: C_FOOT_F1(), a: C_FOOT_F2(), b: C_FOOT_F1(), c: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), right: 'b',
        why: L3("Narxlar bor, lekin rang bilan sarlavha ham o'zgarib ketgan: «qolganini o'zgartirma» yozilmagan ekan.", 'Цены есть, но поменялись и цвет, и заголовок: «остальное не меняй» не написали.', 'The prices are there, but the colour and title changed too: “don’t change anything else” wasn’t written.') },
      { fix: C_FOOT_F2(), a: C_FOOT_F2(), b: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), c: C_FOOT_F1(), right: 'a',
        why: L3("Faqat narxlar qo'shilgan, qolgani esa avvalgidek turibdi.", 'Добавились только цены, остальное как было.', 'Only the prices were added, the rest is as before.') },
      { fix: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), a: C_FOOT_F1(), b: C_FOOT_F2(), c: L3('yaxshiroq qil', 'сделай лучше', 'make it better'), right: 'c',
        why: L3("Hamma narsa o'zgarib ketgan-u, narxlar yo'q: bunisi «yaxshiroq qil» promptining ishi.", 'Поменялось всё, а цен нет: это «сделай лучше».', 'Everything changed, and there are no prices: that’s “make it better”.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Haqiqiy izquvar ekansiz! Saytga bir qarab, qaysi prompt yozilganini aytib beryapsiz.", 'Класс! По сайту ты находишь, какой промпт написали.', 'Great! You can tell from a site which prompt was written.')
  },
  s13: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("«Narxlarni qo'shing va buyurtma tugmasini kattaroq qiling. Qolgani bizga yoqqan edi, o'zgartirmang!»", '«Добавьте цены и сделайте кнопку заказа больше. Остальное нам нравилось, не меняйте!»', '“Add the prices and make the order button bigger. We liked the rest, don’t change it!”') },
    say: L3("Endi shirinliklar do'koniga qaytamiz: mijoz hali ham narxlarni kutyapti! Mening ikki so'zli hiylam o'rniga aniq ikkinchi prompt yozing. Mijoz nimalarni so'ragan edi, esingizdami?",
      'Теперь починим магазин сладостей! Вместо моего «сделай лучше» напиши точный второй промпт. Что просил клиент?',
      'Now let’s fix the sweets shop! Instead of my “make it better”, write a precise second prompt. What did the client ask for?'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    msgs: {
      vague: L3("«Yaxshiroq qil» hali ham turibdi-ku. Uning o'rniga mijoz so'ragan ikkita narsani aniq yozing.", '«Сделай лучше» ещё на месте. Вместо него точно напиши две вещи, которые просил клиент.', '“Make it better” is still there. Instead, write precisely the two things the client asked for.'),
      prices: L3("Narxlar hali ham ko'rinmayapti, mijoz esa ularni birinchi bo'lib so'ragan edi.", 'Цен всё ещё нет. Клиент просил цены.', 'There are still no prices. The client asked for them.'),
      big: L3("Tugma o'zgarmabdi, haliyam mitti. Uni kattaroq qilish ham kerak edi.", 'Кнопка всё ещё маленькая. Клиент просил больше.', 'The button is still tiny. The client asked for it bigger.')
    },
    hints: [
      L3("Mijoz ikkita narsa so'ragan: biri narxlar, biri tugma.", 'Клиент просил две вещи: цены и кнопку.', 'The client asked for two things: prices and the button.'),
      L3("«Narxlar blokini qo'sh», «tugmani kattaroq qil» deb yozing, oxiriga esa «qolganini o'zgartirma»ni qo'shing.", 'Добавь блок цен, сделай кнопку больше, остальное не меняй.', 'Add a prices block, make the button bigger, don’t change anything else.'),
      L3("Pastdagi namunada ikkala tuzatish ham bor. Ularni o'zingiz yozib chiqing, keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("narxlar blokini qo'sh, tugmani kattaroq qil, qolganini o'zgartirma", 'добавь блок цен, сделай кнопку больше, остальное не меняй', 'add a prices block, make the button bigger, don’t change anything else'),
    ok: L3("Ana endi boshqa gap! Narxlar bor, tugma katta, qolgani joy-joyida. Shirinliklar do'konining mijozi nihoyat xursand!", 'Класс! Цены есть, кнопка большая, остальное как было. Теперь клиент доволен!', 'Great! The prices are there, the button is big, and the rest is as before. The client is happy now!'),
    ask: L3("«Yaxshiroq qil»ni tuzating", 'Исправь «сделай лучше»', 'Fix “make it better”')
  },
  s14: {
    eyebrow: L3("O'zingiz yaxshilang", 'Улучши сам', 'Improve it yourself'),
    card: { h: L3('Sizning tanlovingiz', 'Твой выбор', 'Your choice'), t: L3("Saytga qarang. Sizga nima yoqmadi? Bitta-ikkita narsani tanlab, aniq tuzating.", 'Посмотри на сайт. Что тебе не нравится? Выбери одну-две вещи и исправь их точно.', 'Look at the site. What don’t you like? Pick one or two things and fix them precisely.') },
    say: L3("Endi navbat sizga! Mana, Roblox klubimizning sayti. Unga sinchiklab qarang: sizga nimasi yoqmadi? Ikkinchi promptda nimani va qanday o'zgartirishni yozing, qolganini esa saqlab qoling.",
      'Теперь сам! Это сайт Roblox-клуба. Посмотри на него: что тебе не нравится? Напиши во втором промпте, что и как изменить, а остальное сохрани.',
      'Now on your own! This is a Roblox club site. Look at it: what don’t you like? In the second prompt, write what to change and how, and keep the rest.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    hints: [
      L3("Saytdan bitta narsani tanlab oling: rangmi, tugmami, sarlavhami, blokmi yoki reklama oynasimi.", 'Выбери на сайте одну вещь: цвет, кнопку, заголовок, блок или рекламное окно.', 'Pick one thing on the site: the colour, the button, the title, a block or the pop-up window.'),
      L3("Oldin «nima» va «qanday» yozilsin, eng oxirida esa «qolganini o'zgartirma» tursin.", 'Напиши что и как, в конце — «остальное не меняй».', 'Write what and how, and at the end “don’t change anything else”.'),
      L3("Bitta misolni pastga qo'ydim, unda ikkita tuzatish bor. Shunga o'xshatib o'zingiznikini yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("reklama oynasini olib tashla, sarlavhani kattaroq qil, qolganini o'zgartirma", 'убери рекламное окно, сделай заголовок больше, остальное не меняй', 'remove the pop-up window, make the title bigger, don’t change anything else'),
    ok: L3("Zo'r chiqdi! Bu sizning o'zingiz yozgan aniq ikkinchi promptingiz. Uyda haqiqiy sun'iy intellekt bilan ham xuddi shunday qilasiz.", 'Ого, классно! Это твой точный второй промпт. Дома сделаешь так же с настоящим ИИ.', 'Wow, great! That’s your own precise second prompt. At home you’ll do the same with a real AI.'),
    ask: L3("Saytni o'zingiz yaxshilang", 'Улучши сайт сам', 'Improve the site yourself')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor o'yin: kartochkada bittadan gap chiqadi, jami beshta. Har biri to'g'rimi yoki noto'g'rimi, o'zingiz hal qiling.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida ekan: tekshirish haqidami, aniq tuzatish haqidami yoki «qolganini o'zgartirma» haqidami?", 'О чём фраза: о проверке, о точной правке или об «остальное не меняй»?', 'What’s it about: checking, a precise fix, or “don’t change anything else”?'),
    hint2: L3("Esingizdami: nima yoqmaganini sun'iy intellekt bilmaydi, buni unga siz aytasiz.", 'Вспомни: ИИ не знает, что тебе не понравилось, — это говоришь ты.', 'Remember: the AI doesn’t know what you didn’t like — you tell it.'),
    items: [
      { t: L3("«Yaxshiroq qil» desangiz, sun'iy intellekt nima yoqmaganini biladi.", 'Если написать «сделай лучше», ИИ узнает, что тебе не понравилось.', 'If you write “make it better”, the AI knows what you didn’t like.'), right: false,
        why: L3("Aslida u buni bilmaydi: nimani va qanday o'zgartirishni unga siz aytasiz.", 'На самом деле он не знает: что и как изменить, говоришь ты.', 'Actually it doesn’t know: you say what to change and how.') },
      { t: L3("Natijani buyurtma bilan band-band solishtirish kerak.", 'Результат нужно сверять с заказом по пунктам.', 'You should check the result against the order point by point.'), right: true,
        why: L3("Band-band solishtirsangiz, nimani tuzatish kerakligi aniq bilinadi.", 'Верно: тогда ясно, что исправлять.', 'Right: then it’s clear what to fix.') },
      { t: L3("«Qolganini o'zgartirma» yoqqan narsalarni saqlab qoladi.", '«Остальное не меняй» сохраняет то, что нравилось.', '“Don’t change anything else” keeps the parts you liked.'), right: true,
        why: L3("Bu so'zlar bilan sun'iy intellekt faqat aytilganini o'zgartiradi, qolganiga tegmaydi.", 'Верно: ИИ меняет только сказанное.', 'Right: the AI changes only what you asked for.') },
      { t: L3("Natija yoqmasa, birinchi promptni boshidan yozish kerak.", 'Если результат не нравится, первый промпт надо писать с нуля.', 'If you don’t like the result, you must rewrite the first prompt from scratch.'), right: false,
        why: L3("Ko'pincha qisqa ikkinchi prompt yetib qoladi: u faqat kerakli joyni tuzatadi, yoqqan narsalarga tegmaydi.", 'Чаще хватает короткого второго промпта: он исправит только нужное.', 'Usually a short second prompt is enough: it fixes only what’s needed.') },
      { t: L3("Har bir promptdan keyin natijani yana tekshiramiz.", 'После каждого промпта снова проверяем результат.', 'After every prompt, we check the result again.'), right: true,
        why: L3("Har bir promptdan keyin tekshiramiz, tuzatamiz va yana tekshiramiz: shunda hech narsa nazardan chetda qolmaydi.", 'Верно: проверяем, исправляем и снова проверяем.', 'Right: check, fix and check again.') }
    ],
    ok: L3("Beshta gapning hammasini to'g'ri ajratdingiz! Endi natijani qanday yaxshilashni bilasiz.", 'Всё верно! Ты умеешь улучшать результат.', 'All correct! You know how to improve the result.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Xo'sh, ikki so'zli hiylam nima bo'ldi? Men natija yoqmasa, «yaxshiroq qil» desam bas, deb o'ylagandim. Kim o'ylabdi deysiz: sun'iy intellekt nima yoqmaganini umuman bilmas ekan! U saytni boshqatdan yozib yubordi, mijozga yoqqan narsalar ham yo'qolib ketdi. Hiylam vaqtni tejamadi, aksincha, ishni ko'paytirdi. Shuning uchun endi oldin natijani tekshiramiz, keyin aniq yozamiz.",
        'Вернёмся к загадке. Я думал, если результат не нравится, хватит сказать «сделай лучше». Но ИИ не знает, что тебе не понравилось! Он написал сайт заново, и пропало даже хорошее. Поэтому сначала проверяем результат, потом пишем точно. Я ошибся.',
        'Back to the riddle. I thought if you don’t like the result, “make it better” is enough. But the AI doesn’t know what you didn’t like! It rewrote the site, and even the good parts were lost. So first we check the result, then we write precisely. I was wrong.'), k: 'riddle' },
      { text: L3("Mana, shirinliklar do'koni va uni qutqargan ikkinchi promptingiz.", 'Смотри, это магазин сладостей и твой второй промпт.', 'Look, this is the sweets shop and your second prompt.'), k: 'own' },
      { text: L3("Birinchi navbatda natijani buyurtma bilan band-band solishtirib chiqamiz.", 'Сначала сверяем результат с заказом по пунктам.', 'First we check the result against the order point by point.'), k: 'look' },
      { text: L3("Keyin nimani va qanday o'zgartirishni aniq yozamiz.", 'Потом точно пишем, что и как изменить.', 'Then we write precisely what to change and how.'), k: 'fix' },
      { text: L3("Oxirida «qolganini o'zgartirma» deymiz, shunda yoqqan narsalar joyida qoladi.", 'В конце — «остальное не меняй», тогда хорошее останется.', 'At the end, “don’t change anything else”, so the good parts stay.'), k: 'keep' },
      { text: L3("Har bir promptdan keyin esa natijani yana tekshiramiz, kerak bo'lsa, uchinchisini ham yozamiz.", 'И после каждого промпта снова проверяем: второй, третий промпт.', 'And after every prompt we check again: a second, a third prompt.'), k: 'loop' },
      { text: L3("Uyga vazifa ham bor: o'tgan darsda yozgan promptingizni haqiqiy sun'iy intellektga yuboring. Natijani tekshirib chiqing-da, aniq ikkinchi prompt yozing. Keyingi darsda esa yakuniy loyiha bizni kutyapti: butun formula bilan o'z saytingizni yaratasiz. Ko'rishguncha!",
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
