// =============================================================================
// МОДУЛЬ «ИИ» · Урок 4 — «Как должен выглядеть сайт?»
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 12.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai4/build.mjs → lessons/ai/04-kak-vyglyadit.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Как должен выглядеть сайт?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика: каждый урок добавляет в промпт новый кусок; темы урока — стиль, цвета, настроение,
// карточки, тени, шрифты). Коди пишет для киберспортивного турнира «chiroyli bo'lsin», и ИИ делает нежно-розовый
// сайт, «как цветочный магазин». Урок учит пятому вопросу формулы «Ko'rinishi?»: настроение (стиль), цвета (первый —
// главный), форма карточек и тени, шрифт. Загадка (без имён): Коди думает, что «красиво» для всех значит одно и то же.
// Разгадка: «красиво» у каждого своё; ИИ понимает только описание — настроение, цвета, форма, шрифт.
//
// ДУГА (17 экранов):
//   s1 крючок (пять строк, «Ko'rinishi?» = «chiroyli bo'lsin» → розовый сайт для киберспорта, «Taxmin»; загадка)
//   настроение: s2 показ (пусто → современный → минимализм → весёлый) · s3 сам (праздник в детском саду) ·
//               s4 что точнее (раунды)
//   цвета: s5 показ (синий и белый → красный и жёлтый → чёрный и золотой) · s6 сам (цвета пиццерии) ·
//          s7 какой стиль подходит (раунды)
//   форма и шрифт: s8 показ (скругления → большие тени → прямые углы, без теней, шрифт кода) · s9 сам (бабушкины
//          сладости: рукописный шрифт) · s10 сам, перенос (киберспорт: тёмный неон)
//   думать промптом: g1 главный цвет первым (клуб: красный, не жёлтый) · det детектив (какое «Ko'rinishi?» дало сайт;
//          какой это стиль) · s12 почини «chiroyli va zo'r» Коди (олимпиада) · s13 полное описание вида · s14 свой сайт
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт из пяти строк и сайт, домашка.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite с pr.look, lookOf, lookCss): настроение — набор правил облика,
//     первый цвет — главный, второй — кнопки, белый — светлый фон; форма (скругления / прямые углы), тени (большие /
//     без теней), шрифт (рукописный, с засечками, кода, крупный). «Chiroyli» — догадка ИИ: нежно-розовый, «Taxmin».
//     Свой «Ko'rinishi?» важнее облика под аудиторию. Метки «Ko'rinishi?» (зелёные) — у названия, кнопки и карточки.
//   · Промпт ученика уходит ИИ всегда; проверка называет, чего не хватает.
//   · Узбекский — по /uzbekcha; в речи нет символов и цифр через тире.
//
// СИСТЕМА СЛОВ: uslub — стиль (ya'ni «saytning kayfiyati»); kayfiyat — настроение; asosiy rang — главный цвет;
// shrift — шрифт (ya'ni «harflarning ko'rinishi»); soya — тень; burchak — угол.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-04-kak-vyglyadit',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: "4-dars. Sayt qanday ko'rinadi?",
    ru: 'Урок 4. Как должен выглядеть сайт?',
    en: 'Lesson 4. How should the site look?'
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
  next: L3('Sayt qanday ishlaydi?', 'Как сайт должен вести себя?', 'How should the site behave?'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};
// Названия стилей — для выбора и детектива.
const MOOD_L = {
  fun: L3('Quvnoq', 'Весёлый', 'Playful'), serious: L3('Jiddiy', 'Строгий', 'Serious'), neon: L3('Neon', 'Неон', 'Neon'),
  calm: L3('Sokin', 'Спокойный', 'Calm'), minimal: L3('Minimalist', 'Минимализм', 'Minimal'), retro: L3('Retro', 'Ретро', 'Retro'),
  modern: L3('Zamonaviy', 'Современный', 'Modern'), dark: L3("Qorong'i", 'Тёмный', 'Dark')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const BUY = L3('Buyurtma', 'Заказ', 'Request');
// Общие ответы проверки «Ko'rinishi?».
const M = {
  empty: L3("«Ko'rinishi?» qatori hali bo'sh. Sayt qanday ko'rinishi kerakligini shu yerga yozing.", 'Напиши в строку «Как выглядит?»: каким должен быть сайт?', 'Write in the “How it looks?” line: how should the site look?'),
  vague: L3("«Chiroyli» degan so'zdan sun'iy intellekt qanday dizayn kerakligini bilib ololmaydi. Aniqroq yozing: kayfiyati, ranglari, burchaklari va shrifti qanaqa bo'lsin?", '«Красиво» у каждого своё. Опиши точно: настроение, цвета, углы, шрифт.', '“Pretty” means something different to everyone. Be precise: mood, colours, corners, font.'),
  none: L3("Sun'iy intellekt bu so'zlardan dizaynni tushunmadi. Masalan, quvnoq, sokin, minimalist, zamonaviy yoki «qizil va oq» deb yozib ko'ring.", 'ИИ не узнал по этим словам дизайн. Например: весёлый, спокойный, минимализм, современный, красный и белый.', 'The AI didn’t recognise a design. For example: playful, calm, minimal, modern, red and white.')
};
const C = {
  s1: {
    eyebrow: L3("Sayt qanday ko'rinadi?", 'Как выглядит сайт?', 'How does it look?'),
    say: L3("Salom! Qarang, kimdan buyurtma keldi: kibersport turniridan! Promptning to'rtta qatorini yozib qo'ydim: nima, nega, kim uchun va ichida nima. Beshinchi qatorga esa qisqagina qilib «chiroyli bo'lsin» dedim. Bundan ortiq nima kerak? Qani, «Yuborish»ni bosing-chi.",
      'Привет! В моём промпте уже четыре строки: что, зачем, для кого и что внутри. В пятую я написал «пусть будет красиво». Это для киберспортивного турнира! Нажми «Отправить».',
      'Hi! My prompt now has four lines: what, why, who for and what’s inside. In the fifth I wrote “make it pretty”. It’s for an esports tournament! Tap “Send”.'),
    what: L3('Kibersport turniri sayti', 'Сайт киберспортивного турнира', 'An esports tournament site'),
    why: L3("o'yinchilar ro'yxatdan o'tsin", 'чтобы игроки записывались', 'get players to sign up'),
    who: L3("kompyuter o'yinlarini yaxshi ko'radigan o'smirlar", 'подростки, которые любят компьютерные игры', 'teens who love computer games'),
    inside: L3('jadval, qoidalar, aloqa', 'расписание, правила, контакты', 'schedule, rules, contact'),
    look: L3("chiroyli bo'lsin", 'пусть будет красиво', 'make it pretty'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Voy, bu nimasi? Sayt chiroyli-ku, lekin pushti rangda, yumshoqqina, xuddi gul do'koniga o'xshab qolibdi. «Taxmin» belgilarini ko'ryapsizmi? Chiroyli nima ekanini sun'iy intellekt o'zicha hal qilibdi. O'yinchilar esa qorong'i, neon chiroqli kibersport saytini kutgan edi.",
      'Ого! Сайт красивый, но розовый и нежный — как цветочный магазин. Смотри, метки «Догадка»: ИИ сам решил, что такое «красиво». А игроки ждали тёмный неоновый киберспортивный дизайн.',
      'Wow! The site is pretty, but pink and soft, like a flower shop. Look at the “Guess” labels: the AI decided by itself what “pretty” means. The players expected a dark neon esports design.'),
    done: L3("Baribir, menimcha, gap «chiroyli» so'zida emas. «Chiroyli» desam, hamma bir xil narsani tushunadi-ku, chiroyli degani chiroyli-da! Siz-chi, bunga nima deysiz? Bugungi beshinchi savol aynan shu haqda: sayt qanday ko'rinadi? Kim haq ekanini bugun bir nechta buyurtmada sinab ko'ramiz.",
      'По-моему, если сказать «красиво», все поймут одно и то же. Красиво — оно и есть красиво! А ты как думаешь? Сегодня разберём пятый вопрос: как выглядит сайт?',
      'I think if I say “pretty”, everyone understands the same thing. Pretty is pretty! What do you think? Today we learn the fifth question: how does the site look?'),
    seen: { h: L3("O'yinchilar nima dedi", 'Что сказали игроки', 'What the players said'), t: L3("«Bu gul do'konimi? Kibersport qorong'i va neon bo'lishi kerak!»", '«Это что, цветочный магазин? Киберспорт должен быть тёмным и неоновым!»', '“Is this a flower shop? Esports should be dark and neon!”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("«Chiroyli» kibersportga mos chiqmadi", '«Красиво» не подошло киберспорту', '“Pretty” didn’t suit esports')
  },
  s2: {
    eyebrow: L3('Kayfiyat', 'Настроение', 'Mood'),
    help: [
      L3("Promptdagi oxirgi qatorga qarang-chi, keyin saytning ranglariga, burchaklariga va sarlavhasiga ham. Qatordagi bitta so'z o'zgarganda, ular ham birga o'zgaryapti.", 'Посмотри на строку промпта и на цвета, углы и заголовок сайта.', 'Look at the prompt line and at the site’s colours, corners and heading.'),
      L3("Bu so'z saytning uslubini hal qiladi. Uslub esa saytning kayfiyati bo'ladi: quvnoqmi, jiddiymi yoki sokinmi. Shuning uchun bitta so'z butun dizaynni o'zgartirib yuboradi.", 'Стиль — это настроение сайта. Одно слово меняет весь дизайн.', 'Style is the site’s mood. One word changes the whole design.'),
      L3("To'yga bir xil, sport zaliga boshqacha, uyda esa umuman boshqacha kiyinasiz-ku. Sayt ham xuddi shunday: uslubiga qarab kiyinadi.", 'На праздник, на спорт и дома ты одеваешься по-разному. Сайт тоже «одевается» под настроение.', 'You dress differently for a party, for sport and for home. A site dresses for its mood too.')
    ],
    say: L3("Xo'sh, beshinchi savol: sayt qanday ko'rinadi? Bunga javob berishni uslubdan boshlaymiz. Uslub, ya'ni saytning kayfiyati degani. Kitob klubi uchun bu qator hozircha bo'sh, shuning uchun sun'iy intellekt dizaynni o'zicha tanlab qo'ydi.",
      'Пятый вопрос: как выглядит сайт? Первое — стиль, то есть настроение сайта. Смотри, строка пока пустая — и ИИ выбрал дизайн сам.',
      'The fifth question: how does the site look? The first thing is style, that is, the site’s mood. Look, the line is empty for now, so the AI chose the design itself.'),
    what: L3('Kitob klubi sayti', 'Сайт книжного клуба', 'A book club site'),
    why: L3("kitobxonlar klubga yozilsin", 'чтобы читатели записывались в клуб', 'get readers to join the club'),
    who: L3("kitob o'qishni yaxshi ko'radigan o'smirlar", 'подростки, которые любят читать', 'teens who love reading'),
    inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    l1: L3('zamonaviy', 'современный', 'modern'),
    l2: L3('minimalist', 'минимализм', 'minimal'),
    l3: L3('quvnoq va yorqin', 'весёлый и яркий', 'playful and bright'),
    says: [
      L3("Qatorga zamonaviy deb yozdik. Qarang-chi, silliq gradient, yumaloq kartochkalar va yengil soyalar chiqdi.", 'Пишем: современный. Смотри: плавный градиент, скруглённые карточки и мягкие тени.', 'We write: modern. Look: a smooth gradient, rounded cards and soft shadows.'),
      L3("Endi o'rniga minimalist deb yozdik. Ko'rdingizmi? Hamma narsa oppoq va toza bo'lib qoldi, birorta ortiqcha bezak yo'q.", 'Теперь минимализм. Всё стало белым и чистым, ничего лишнего.', 'Now minimal. Everything became white and clean, nothing extra.'),
      L3("Oxirida quvnoq va yorqin deb yozdik. Sayt birdan bayramga aylandi: rang-barang gradient, bayramona harflar, kartochkalar esa o'yinchoqqa o'xshaydi!", 'А «весёлый и яркий» — это разноцветный градиент, праздничный шрифт и карточки как игрушки.', 'And “playful and bright” gives a colourful gradient, a party font and toy-like cards.')
    ],
    done: L3("Demak, «Ko'rinishi?» qatoriga eng oldin saytning kayfiyatini yozamiz: zamonaviymi, minimalistmi, quvnoqmi yoki boshqasimi.", 'Значит, в строку «Как выглядит?» сначала пишем настроение сайта: современный, минимализм, весёлый или другое.', 'So in the “How it looks?” line we first write the site’s mood: modern, minimal, playful or another.'),
    asks: [L3("Qarang: sun'iy intellekt o'zi tanladi", 'Смотри: ИИ выбрал сам', 'Watch: the AI chose itself'), L3('Qarang: zamonaviy', 'Смотри: современный', 'Watch: modern'),
      L3('Qarang: minimalist', 'Смотри: минимализм', 'Watch: minimal'), L3('Qarang: quvnoq', 'Смотри: весёлый', 'Watch: playful')],
    askDone: L3("Bitta so'z butun dizaynni o'zgartiradi", 'Одно слово меняет весь дизайн', 'One word changes the whole design')
  },
  s3: {
    eyebrow: L3('Kayfiyatni yozing', 'Напиши настроение', 'Write the mood'),
    card: { h: BUY, t: L3("Bog'cha bayrami sayti: kichkintoylar uchun, xuddi bayramdek kulgili va rang-barang tuyulsin.", 'Сайт праздника в детском саду: для малышей, пусть ощущается весёлым и разноцветным, как праздник.', 'A kindergarten party site: for little ones, it should feel fun and colourful, like a party.') },
    say: L3("Bog'chadan buyurtma keldi: kichkintoylarning bayrami uchun sayt kerak ekan! To'rtta qatorni men yozib qo'ydim. Bayram qanday tuyulishi kerakligi buyurtmada aytilgan: uni o'qing-da, «Ko'rinishi?» qatoriga saytning kayfiyatini yozing.",
      'Теперь ты. Детский сад попросил сайт праздника. Четыре строки готовы. Прочитай заказ и напиши в строку «Как выглядит?» настроение сайта.',
      'Your turn. A kindergarten asked for a party site. Four lines are ready. Read the request and write the site’s mood in the “How it looks?” line.'),
    what: L3("Bog'cha bayrami sayti", 'Сайт праздника в детском саду', 'A kindergarten party site'),
    why: L3('ota-onalar bayramga kelsin', 'чтобы родители пришли на праздник', 'get parents to come to the party'),
    who: L3('4–6 yoshli bolalar va ularning ota-onalari', 'дети 4–6 лет и их родители', 'kids aged 4–6 and their parents'),
    inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    ph: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    msgs: {
      other: L3("Bunday uslub kichkintoylar bayramiga unchalik to'g'ri kelmaydi. Buyurtmada qanday kayfiyat so'ralganini yana bir o'qing.", 'Этот стиль не очень подходит празднику. Какое настроение просят в заказе?', 'That style doesn’t quite suit a party. What mood does the request ask for?')
    },
    hints: [
      L3("Buyurtmani yana bir o'qing-chi: bayram sayti qanday tuyulishi kerak ekan?", 'В заказе сказано, каким сайт должен ощущаться.', 'The request says how the site should feel.'),
      L3("Kulgili va rang-barang sayt kerak bo'lsa, unga quvnoq va yorqin uslub to'g'ri keladi.", 'Весёлый и разноцветный — это стиль «весёлый и яркий».', 'Fun and colourful is the playful, bright style.'),
      L3("Namuna pastda paydo bo'ldi. Shu so'zlarni «Ko'rinishi?» qatoriga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('quvnoq va yorqin', 'весёлый и яркий', 'playful and bright'),
    ok: L3("Zo'r! Sayt rang-barang gradient, bayramona harflar va quvnoq kartochkalar bilan chiqdi. Kichkintoylar buni ko'rib, xursand bo'lib ketadi!", 'Огонь! Разноцветный градиент, праздничный шрифт, весёлые карточки. Настоящий сайт праздника!', 'Awesome! A colourful gradient, a party font, playful cards. A real party site!'),
    ask: L3("«Ko'rinishi?» qatoriga kayfiyatni yozing", 'Напиши настроение в «Как выглядит?»', 'Write the mood in “How it looks?”')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Endi ikki xil yozilgan «Ko'rinishi?» qatorini solishtiramiz. Har safar ulardan bittasi sun'iy intellektga ko'proq yordam beradi. Shu aniqrog'ini toping.", 'Теперь проверь себя. Какое из двух «Как выглядит?» больше поможет ИИ?', 'Now check yourself. Which of the two “How it looks?” lines helps the AI more?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi «Ko'rinishi?» aniqroq?", 'Какое «Как выглядит?» точнее?', 'Which “How it looks?” is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi variantda kayfiyat, rang yoki shakl aniq aytilgan-u, qaysi birida shunchaki maqtov turibdi?", 'Где точно названы настроение, цвета или форма?', 'Which one names the mood, colours or shape?'),
    hint2: L3("«Chiroyli», «zo'r», «yaxshi» degan so'zlar maqtovga o'xshaydi, lekin sun'iy intellektga hech narsani aniq aytmaydi.", '«Красиво», «круто», «хорошо» ничего точно не говорят.', '“Pretty”, “cool”, “good” say nothing precise.'),
    items: [
      { a: L3("chiroyli bo'lsin", 'пусть будет красиво', 'make it pretty'), b: L3("qorong'i, neon, yashil", 'тёмный, неон, зелёный', 'dark, neon, green'), right: 'b',
        why: L3("Ikkinchi variantda kayfiyat ham, rang ham aniq yozilgan: qorong'i, neon, yashil.", 'Во втором есть и настроение, и цвет.', 'The second has both a mood and a colour.') },
      { a: L3('minimalist, oq va qora', 'минимализм, белый и чёрный', 'minimal, white and black'), b: L3("zo'r dizayn", 'крутой дизайн', 'a cool design'), right: 'a',
        why: L3("Birinchi variantda uslub ham, ikkita rang ham aytilgan. «Zo'r dizayn» esa hech narsani tushuntirmaydi.", 'Первый точный: стиль и два цвета.', 'The first is precise: a style and two colours.') },
      { a: L3("yaxshi ko'rinsin", 'чтобы хорошо выглядел', 'make it look good'), b: L3("sokin, pushti va oq, yumaloq burchaklar", 'спокойный, розовый и белый, скруглённые углы', 'calm, pink and white, rounded corners'), right: 'b',
        why: L3("Ikkinchi variantda kayfiyat, ranglar, hatto burchaklar ham bor. Endi sun'iy intellekt taxmin qilib o'tirmaydi.", 'Во втором — настроение, цвета и углы.', 'The second has the mood, colours and corners.') }
    ],
    right: L3("Ha, aynan shunisi!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala safar ham aniq variantni tanladingiz. Shunchaki maqtovni aniq tavsifdan darrov ajratar ekansiz!", 'Всё верно! Ты отличаешь «красиво» от точного описания.', 'All correct! You can tell “pretty” from a precise description.')
  },
  s5: {
    eyebrow: L3('Ranglar', 'Цвета', 'Colours'),
    help: [
      L3("Promptda ranglar qaysi tartibda yozilganiga qarang. Keyin saytning tepa qismiga va tugmalariga ko'z yugurtiring.", 'Посмотри на цвета в строке промпта и на верх и кнопку сайта.', 'Look at the colours in the prompt line and at the site’s top and button.'),
      L3("Birinchi yozilgan rang asosiy bo'ladi, sayt asosan shu rangga bo'yaladi. Ikkinchi rang esa tugmalarga o'tadi.", 'Первый цвет — главный, то есть сайт будет в этом цвете. Второй уходит на кнопки.', 'The first colour is the main one, that is, the site is in that colour. The second goes to the buttons.'),
      L3("Futbol jamoasining formasi o'z ranglarida bo'ladi: bitta rang asosiy, ikkinchisi esa raqam va chiziqlarda. Sayt ham o'z ranglarida xuddi shunday kiyinsin.", 'У футбольной команды форма своих цветов. Пусть и сайт будет в своих цветах.', 'A football team’s kit has its own colours. Let the site have its own colours too.')
    ],
    say: L3("Uslubni bildik, endi navbat ranglarga. Futbol klubining saytiga qarang: qatorda faqat «zamonaviy» degan so'z turibdi. Ranglarni esa sun'iy intellekt o'zi tanlab olibdi.",
      'После стиля — цвета. Смотри, сейчас написано только «современный», цвета ИИ выбрал сам.',
      'After the style come the colours. Look, right now it only says “modern”, so the AI chose the colours itself.'),
    what: L3('Futbol klubimiz sayti', 'Сайт нашего футбольного клуба', 'Our football club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("futbolni yaxshi ko'radigan 10–12 yoshli bolalar", 'дети 10–12 лет, которые любят футбол', 'kids aged 10–12 who love football'),
    inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    k0: L3('zamonaviy', 'современный', 'modern'),
    k1: L3("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white'),
    k2: L3('zamonaviy, qizil va sariq', 'современный, красный и жёлтый', 'modern, red and yellow'),
    k3: L3('zamonaviy, qora va oltin', 'современный, чёрный и золотой', 'modern, black and gold'),
    says: [
      L3("Zamonaviy so'zidan keyin ko'k va oq deb yozdik. Ko'rdingizmi? Sayt darrov ko'k bo'lib qoldi, chunki ko'k birinchi yozilgan. Demak, u asosiy rang bo'ladi.", 'Пишем: синий и белый. Сайт сразу стал синим: синий написан первым, значит, он главный.', 'We write blue and white. The site turned blue at once: blue comes first, so it’s the main colour.'),
      L3("Endi ranglarni qizil va sariqqa almashtirdik. Qarang-chi, saytning tepasi qizil, tugmalari esa sariq bo'ldi.", 'Скажем «красный и жёлтый» — верх станет красным, а кнопки жёлтыми.', 'Say red and yellow, and the top turns red while the buttons turn yellow.'),
      L3("Oxirida qora va oltin rangni sinab ko'rdik. Sayt birdan jiddiy va qimmatbaho ko'rinib qoldi! Ranglar o'zgarsa, saytning xarakteri ham o'zgarar ekan.", 'Чёрный и золотой — солидно и дорого. Цвета меняют характер сайта.', 'Black and gold looks serious and premium. Colours change a site’s character.')
    ],
    done: L3("Shunday qilib, uslubdan keyin ranglarni ham yozamiz. Esingizda bo'lsin: birinchi rang asosiy bo'ladi, ikkinchisi tugmalarga ketadi.", 'Значит, цвета тоже пишем. Первый цвет — главный, второй — для кнопок.', 'So we write the colours too. The first is the main colour, the second goes to the buttons.'),
    asks: [L3("Qarang: ranglarni sun'iy intellekt tanladi", 'Смотри: цвета выбрал ИИ', 'Watch: the AI picked the colours'), L3("Qarang: ko'k va oq", 'Смотри: синий и белый', 'Watch: blue and white'),
      L3('Qarang: qizil va sariq', 'Смотри: красный и жёлтый', 'Watch: red and yellow'), L3('Qarang: qora va oltin', 'Смотри: чёрный и золотой', 'Watch: black and gold')],
    askDone: L3('Birinchi rang asosiy', 'Первый цвет — главный', 'The first colour is the main one')
  },
  s6: {
    eyebrow: L3('Ranglarni yozing', 'Напиши цвета', 'Write the colours'),
    card: { h: BUY, t: L3("Pitsa do'konining ranglari: qizil va yashil, xuddi Italiya bayrog'idek.", 'Цвета пиццерии: красный и зелёный, как на флаге Италии.', 'The pizza shop’s colours: red and green, like the Italian flag.') },
    say: L3("Pitsa do'koni o'z ranglarini aytibdi, ular Italiya bayrog'ini eslatarkan. «Ko'rinishi?» qatoriga oldin uslubni, keyin shu ranglarni yozing. Qaysi rang birinchi turishi kerakligini ham o'ylab ko'ring.",
      'Теперь ты. Пиццерия назвала свои цвета. Напиши в строку «Как выглядит?» стиль и эти цвета.',
      'Your turn. The pizza shop named its colours. Write a style and those colours in the “How it looks?” line.'),
    what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'),
    why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'),
    who: L3("pitsani yaxshi ko'radigan talabalar", 'студенты, которые любят пиццу', 'students who love pizza'),
    inside: L3('menyu, rasmlar, aloqa', 'меню, фото, контакты', 'menu, photos, contact'),
    ph: L3("uslub va ranglar", 'стиль и цвета', 'style and colours'),
    msgs: {
      noColor: L3("Qatorda hali rang yo'q-ku. Buyurtmada qaysi ranglar aytilgan?", 'Цвета не написаны. Какие цвета в заказе?', 'No colours yet. Which colours are in the request?'),
      other: L3("Bu ranglar do'konniki emas. Do'kon qizil va yashil rangni so'ragan edi.", 'Это другие цвета. Пиццерия просила красный и зелёный.', 'Those are other colours. The shop asked for red and green.'),
      first: L3("Ranglar joyida, lekin hozir asosiy rang boshqasi bo'lib qoldi. Qizil asosiy bo'lishi uchun uni birinchi yozing.", 'Цвета есть, но главным пусть будет красный: напиши его первым.', 'The colours are there, but red should be the main one: write it first.')
    },
    hints: [
      L3("Buyurtmani o'qing-chi: unda ikkita rang aytilgan.", 'В заказе названы два цвета.', 'The request names two colours.'),
      L3("Oldin uslubni yozing, keyin qizil va yashilni. Faqat qizil birinchi tursin, chunki u asosiy rang bo'ladi.", 'Напиши стиль, потом красный и зелёный. Красный первым.', 'Write a style, then red and green. Red first.'),
      L3("Ranglarning to'g'ri tartibi pastdagi namunada turibdi. Xuddi shunday yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('zamonaviy, qizil va yashil', 'современный, красный и зелёный', 'modern, red and green'),
    ok: L3("Ajoyib! Sayt qizil, tugmalari esa yashil bo'ldi. Pitsa do'koni o'z ranglarida yarqirab turibdi!", 'Класс! Сайт красный, кнопки зелёные. Фирменные цвета пиццерии!', 'Great! The site is red with green buttons. The shop’s own colours!'),
    ask: L3('Uslub va ranglarni yozing', 'Напиши стиль и цвета', 'Write a style and colours')
  },
  s7: {
    eyebrow: L3('Qaysi uslub mos?', 'Какой стиль подходит?', 'Which style fits?'),
    say: L3("Uslub saytga xuddi kiyimdek yarashishi kerak. Kartochkadagi saytni o'qing: u kim uchun, nima haqida? Shunga qarab, mos uslubni tanlang.", 'Стиль должен подходить сайту: для кого он и о чём. Я называю сайт, а ты выбираешь подходящий стиль.', 'The style should fit the site: who it’s for and what it’s about. I name a site, and you pick the style that fits.'),
    card: L3('Sayt', 'Сайт', 'Site'),
    ask: L3('Mos uslubni tanlang', 'Выбери подходящий стиль', 'Pick the style that fits'),
    hint1: L3("Saytni kim ochadi va bu qanday tadbir ekan? Shunga bir qarang-chi.", 'Смотри, для кого это и что за событие.', 'Look at who it’s for and what kind of event it is.'),
    hint2: L3("Kichkintoylarga quvnoq uslub yoqadi, rasmiy sahifaga jiddiy uslub kerak bo'ladi. O'yinchilar neonni yaxshi ko'radi, buvi va bobolarga esa sokin uslub mos keladi.", 'Малышам — весёлый, официальному — строгий, игрокам — неон, бабушкам и дедушкам — спокойный.', 'Little kids: playful. Official stuff: serious. Gamers: neon. Grandparents: calm.'),
    items: [
      { t: L3('Yetti yoshli bolalar uchun bayram', 'Праздник для семилетних детей', 'A party for seven-year-olds'), opts: ['fun', 'serious', 'neon'], right: 'fun', why: L3("Yetti yoshli bolalar rang-barang va quvnoq narsalarni yaxshi ko'radi, shuning uchun ularga quvnoq va yorqin uslub mos keladi.", 'Малышам подходит весёлый и яркий стиль.', 'A playful, bright style suits little kids.') },
      { t: L3('Maktab olimpiadasining rasmiy sahifasi', 'Официальная страница школьной олимпиады', 'The official school olympiad page'), opts: ['fun', 'retro', 'serious'], right: 'serious', why: L3("Olimpiadaning rasmiy sahifasida o'yinchoqdek bezaklar kulgili ko'rinadi. Unga jiddiy uslub kerak.", 'Официальной странице нужен строгий стиль.', 'An official page needs a serious style.') },
      { t: L3('Kibersport turniri', 'Киберспортивный турнир', 'An esports tournament'), opts: ['calm', 'neon', 'minimal'], right: 'neon', why: L3("Kibersport o'yinchilari qorong'i fon va yonib turgan neon chiroqlarni yaxshi ko'radi.", 'Игрокам нравится тёмный неон.', 'Gamers love a dark neon style.') },
      { t: L3('Buvijonning shirinliklari', 'Бабушкины сладости', 'Grandma’s sweets'), opts: ['neon', 'calm', 'retro'], right: 'calm', why: L3("Buvijonning shirinliklari iliq va uydagidek tuyulishi kerak, bunga sokin uslub mos keladi.", 'Тепло и по-домашнему: спокойный стиль.', 'Warm and homely: a calm style.') },
      { t: L3("Eski o'yinlar muzeyi", 'Музей старых игр', 'A museum of old games'), opts: ['retro', 'serious', 'calm'], right: 'retro', why: L3("Eski o'yinlar katta piksellardan yasalgan edi. Ularning muzeyiga retro uslub juda yarashadi.", 'Старым играм подходит пиксельный ретро-стиль.', 'Old games suit a pixel retro style.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Beshala saytga ham o'z uslubini topib berdingiz! Sayt kim uchunligini bilsangiz, uslubni tanlash oson ekan.", 'Класс! Ты подбираешь стиль под каждый сайт.', 'Great! You find the right style for every site.')
  },
  s8: {
    eyebrow: L3('Kartochkalar va shrift', 'Карточки и шрифт', 'Cards and font'),
    help: [
      L3("Kartochkalarning burchaklariga bir qarang-chi: ular yumaloqmi yoki o'tkirmi? Soyalarga va harflarga ham ko'z yugurtiring.", 'Посмотри на углы и тени карточек и на буквы.', 'Look at the cards’ corners and shadows and at the letters.'),
      L3("Burchak, soya va shrift saytning mayda qismlari, lekin ular juda muhim. Aynan ular sayt yumshoq, jiddiy yoki texnik bo'lib ko'rinishini hal qiladi.", 'Углы, тени и шрифт — то есть вид букв — мелкие, но важные детали сайта.', 'Corners, shadows and the font, that is, how the letters look, are small but important details.'),
      L3("Ikkita bir xil ko'ylakni tasavvur qiling, faqat tugmalari va choklari har xil. Ular endi butunlay boshqacha ko'rinadi-ku! Burchak, soya va shrift ham sayt uchun xuddi shunday mayda bezaklar.", 'Одна и та же рубашка с другими пуговицами и швами выглядит совсем иначе.', 'The same shirt with different buttons and stitching looks completely different.')
    ],
    say: L3("Endi mayda narsalarga o'tamiz: kartochkalarning burchagi, soyalar va shrift. Shrift, ya'ni harflarning ko'rinishi degani. Mayda bo'lsa ham, ular saytni butunlay o'zgartirib yuboradi. Robot kursining saytida hozircha faqat «zamonaviy» degan so'z turibdi.",
      'Теперь детали: углы карточек, тени и шрифт. Они тоже сильно меняют сайт. Смотри, сейчас только «современный».',
      'Now the details: card corners, shadows and the font. They change a site a lot too. Look, right now it’s just “modern”.'),
    what: L3('Robot kursi sayti', 'Сайт курса роботов', 'A robot course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'),
    inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    f0: L3('zamonaviy', 'современный', 'modern'),
    f1: L3('zamonaviy, yumaloq burchaklar', 'современный, скруглённые углы', 'modern, rounded corners'),
    f2: L3('zamonaviy, yumaloq burchaklar, katta soyalar', 'современный, скруглённые углы, большие тени', 'modern, rounded corners, big shadows'),
    f3: L3("zamonaviy, to'g'ri burchaklar, soyasiz, kod shrifti", 'современный, острые углы, без теней, моноширинный шрифт', 'modern, square corners, no shadows, monospace font'),
    says: [
      L3("Qatorga yumaloq burchaklar deb qo'shdik. Kartochkalar bilan tugmalarning burchagi yumshab, ular do'stona ko'rinib qoldi.", 'Скруглённые углы: карточки и кнопки стали мягкими и дружелюбными.', 'Rounded corners: the cards and buttons became soft and friendly.'),
      L3("Keyin katta soyalar ham qo'shdik. Endi kartochkalar xuddi sahifadan sal ko'tarilib, havoda turgandek bo'ldi.", 'Добавим большие тени. Карточки будто приподнялись над страницей.', 'Let’s add big shadows. The cards seem to lift off the page.'),
      L3("Endi hammasini teskarisiga o'zgartirdik: to'g'ri burchaklar, soyasiz kartochkalar va kod shrifti. Mana, robotlarga juda mos, texnik ko'rinishdagi sayt chiqdi!", 'А теперь наоборот: острые углы, без теней и шрифт как в коде. Получился технический вид — как раз для роботов.', 'Now the opposite: square corners, no shadows and a code font. A technical look, just right for robots.')
    ],
    done: L3("Ana endi bilasiz: «Ko'rinishi?» qatoriga burchaklarni, soyalarni va shriftni ham yozsa bo'ladi. Saytning xarakteri aynan shu mayda narsalardan yasaladi.", 'Значит, в «Как выглядит?» можно писать и углы, и тени, и шрифт. Они задают характер сайта.', 'So in “How it looks?” you can also write corners, shadows and the font. They set the site’s character.'),
    asks: [L3('Qarang: oddiy zamonaviy', 'Смотри: просто современный', 'Watch: plain modern'), L3('Qarang: yumaloq burchaklar', 'Смотри: скруглённые углы', 'Watch: rounded corners'),
      L3('Qarang: katta soyalar', 'Смотри: большие тени', 'Watch: big shadows'), L3('Qarang: kod shrifti', 'Смотри: шрифт как в коде', 'Watch: a code font')],
    askDone: L3('Burchak, soya va shrift ham muhim', 'Углы, тени и шрифт тоже важны', 'Corners, shadows and the font matter too')
  },
  s9: {
    eyebrow: L3('Shrift', 'Шрифт', 'Font'),
    card: { h: BUY, t: L3("Buvijonning shirinliklari: iliq va uydagidek. Harflar qo'lyozmadek bo'lsin, ranglar jigarrang va oltin.", 'Бабушкины сладости: тепло и по-домашнему. Буквы — как написанные от руки, цвета — коричневый и золотой.', 'Grandma’s sweets: warm and homely. Letters that look handwritten, colours brown and gold.') },
    say: L3("Shirinlik pishiradigan buvijon ham sayt so'rabdi. U saytning qanday bo'lishini juda aniq aytib beribdi: buyurtmani o'qing-da, «Ko'rinishi?» qatoriga kayfiyatni, shriftni va ranglarni yozing.",
      'Теперь ты. Бабушкина кондитерская попросила сайт. Прочитай заказ и напиши в строку «Как выглядит?» настроение, шрифт и цвета.',
      'Your turn. Grandma’s sweet kitchen asked for a site. Read the request and write the mood, font and colours in the “How it looks?” line.'),
    what: L3("Shirinliklar oshxonasi sayti", 'Сайт домашней кондитерской', 'A home bakery site'),
    why: L3('odamlar shirinlik buyurtma qilsin', 'чтобы люди заказывали сладости', 'get people to order sweets'),
    who: L3("mahalladagi oilalar", 'семьи нашего района', 'families in our neighbourhood'),
    inside: L3('menyu, rasmlar, aloqa', 'меню, фото, контакты', 'menu, photos, contact'),
    ph: L3("kayfiyat, shrift, ranglar", 'настроение, шрифт, цвета', 'mood, font, colours'),
    msgs: {
      font: L3("Shrift qani? Buvijon harflar qo'lda yozilgandek bo'lsin, degan edi.", 'А шрифт? В заказе сказано: буквы как написанные от руки.', 'What about the font? The request says letters that look handwritten.'),
      color: L3("Ranglar ham kerak-ku! Buyurtmada jigarrang va oltin rang so'ralgan.", 'А цвета? В заказе — коричневый и золотой.', 'Where are the colours? The request says brown and gold.')
    },
    hints: [
      L3("Buyurtmada uchta narsa aytilgan: kayfiyat, harflar va ranglar. Har birini topib chiqing-chi.", 'В заказе три вещи: настроение, буквы и цвета.', 'The request has three things: mood, letters and colours.'),
      L3("Kayfiyati iliq, shrifti qo'lyozma, ranglari esa jigarrang va oltin bo'lsin.", 'Тёплый, рукописный шрифт, коричневый и золотой.', 'Warm, handwritten font, brown and gold.'),
      L3("Pastda namuna turibdi. Shularni vergul bilan ketma-ket yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("iliq, qo'lyozma shrift, jigarrang va oltin", 'тёплый, рукописный шрифт, коричневый и золотой', 'warm, handwritten font, brown and gold'),
    ok: L3("Voy, qanday iliq sayt chiqdi! Harflar qo'lda yozilgandek, ranglari jigarrang va oltin. Xuddi buvijonning uyiga kirgandek bo'ldim!", 'Огонь! Буквы как от руки, цвета коричневый и золотой. Тёплый сайт, как бабушкин дом!', 'Awesome! Handwritten letters in brown and gold. A site as warm as grandma’s house!'),
    ask: L3("Kayfiyat, shrift va ranglarni yozing", 'Напиши настроение, шрифт и цвета', 'Write the mood, font and colours')
  },
  s10: {
    eyebrow: L3('Kibersport uslubi', 'Киберспортивный стиль', 'Esports style'),
    card: { h: BUY, t: L3("O'yinchilar so'raydi: «Qorong'i fon, yashil neon chiroqlar va kompyuter shrifti bo'lsin!»", 'Игроки просят: «Тёмный фон, зелёный неон и компьютерный шрифт!»', 'The players ask: “A dark background, green neon lights and a computer font!”') },
    say: L3("Gul do'koniga o'xshab qolgan kibersport saytimizni unutmadingizmi? Endi uni tuzatish vaqti keldi! O'yinchilar qanday dizayn xohlashini aniq aytishdi. Mening «chiroyli bo'lsin» degan so'zlarim o'rniga aniq «Ko'rinishi?» qatorini yozing.",
      'Теперь починим киберспортивный турнир! Игроки сказали, какой дизайн хотят. Вместо моего «пусть будет красиво» напиши точное «Как выглядит?».',
      'Now let’s fix the esports tournament! The players said what design they want. Instead of my “make it pretty”, write a precise “How it looks?”.'),
    what: L3('Kibersport turniri sayti', 'Сайт киберспортивного турнира', 'An esports tournament site'),
    why: L3("o'yinchilar ro'yxatdan o'tsin", 'чтобы игроки записывались', 'get players to sign up'),
    who: L3("kompyuter o'yinlarini yaxshi ko'radigan o'smirlar", 'подростки, которые любят компьютерные игры', 'teens who love computer games'),
    inside: L3('jadval, qoidalar, aloqa', 'расписание, правила, контакты', 'schedule, rules, contact'),
    ph: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    msgs: {
      neon: L3("Uslub yozilmabdi-ku. O'yinchilar neon yoki qorong'i uslub so'rashgan edi.", 'А стиль? Игроки просили неон или тёмный стиль.', 'What about the style? The players asked for neon or dark.'),
      green: L3("Rang hali yo'q. O'yinchilar neon chiroqlar yashil bo'lsin, deyishgan.", 'Цвет не написан. Игроки просили зелёный неон.', 'No colour yet. The players asked for green neon.')
    },
    hints: [
      L3("O'yinchilar uchta narsa so'rashdi: qanday fon, chiroqlar qaysi rangda va qanday shrift. Ularni buyurtmadan toping.", 'Игроки назвали три вещи: фон, цвет подсветки и шрифт.', 'The players named three things: the background, the light colour and the font.'),
      L3("Ularga qorong'i fon, neon uslub, yashil rang va kod shrifti kerak.", 'Тёмный, неон, зелёный, шрифт как в коде.', 'Dark, neon, green, a code font.'),
      L3("Namuna tayyor: «Chiroyli bo'lsin»ni o'chiring-da, o'rniga pastdagi so'zlarni yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("qorong'i, neon, yashil, kod shrifti", 'тёмный, неон, зелёный, моноширинный шрифт', 'dark, neon, green, monospace font'),
    ok: L3("Mana bu boshqa gap! Qorong'i fon, yashil neon chiroqlar va kod shrifti. Endi o'yinchilar bu saytni gul do'koni bilan adashtirmaydi!", 'Ого, круто! Тёмный фон, зелёный неон и шрифт как в коде. Теперь это настоящий киберспорт!', 'Wow, great! A dark background, green neon and a code font. Now that’s a real esports site!'),
    ask: L3("Kibersport uslubini yozing", 'Опиши киберспортивный стиль', 'Describe the esports style')
  },
  g1: {
    eyebrow: L3('Asosiy rang', 'Главный цвет', 'Main colour'),
    card: { h: BUY, t: L3("Klub murabbiyi: «Bizning rangimiz qizil, sariq esa faqat ozgina, oq esa fonda».", 'Тренер клуба: «Наш цвет — красный, жёлтого совсем чуть-чуть, белый — для фона».', 'The club coach: “Our colour is red, just a bit of yellow, and white for the background.”') },
    say: L3("Futbol klubi uchun men ranglarni «sariq, qizil va oq» deb yozgan edim. Qarang, sayt sap-sariq bo'lib qolibdi! Sun'iy intellekt birinchi rangni asosiy qilib olgan-da. Murabbiy nima deyayotganini o'qing-da, ranglarning tartibini tuzating.",
      'Я написал для сайта клуба «жёлтый, красный и белый». Смотри, сайт стал жёлтым! ИИ сделал главным первый цвет. Что говорит тренер? Исправь порядок цветов.',
      'I wrote “yellow, red and white” for the club site. Look, the site turned yellow! The AI made the first colour the main one. What does the coach say? Fix the colour order.'),
    what: L3('Futbol klubimiz sayti', 'Сайт нашего футбольного клуба', 'Our football club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("futbolni yaxshi ko'radigan 10–12 yoshli bolalar", 'дети 10–12 лет, которые любят футбол', 'kids aged 10–12 who love football'),
    inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    bad: L3('zamonaviy, sariq, qizil va oq', 'современный, жёлтый, красный и белый', 'modern, yellow, red and white'),
    ph: L3("uslub va ranglar", 'стиль и цвета', 'style and colours'),
    msgs: {
      first: L3("Sayt hali ham qizil bo'lmadi. Murabbiy aytgan asosiy rangni eng oldinga qo'ying.", 'Сайт ещё не красный. Напиши главный цвет первым.', 'The site isn’t red yet. Write the main colour first.'),
      noRed: L3("Qizil rang qatordan tushib qolibdi. Murabbiy aytgan ranglarning hammasini yozing.", 'Красный пропал. Напиши цвета, которые назвал тренер.', 'Red is gone. Write the colours the coach named.')
    },
    hints: [
      L3("Esingizdami, sun'iy intellekt qaysi rangni asosiy qiladi: birinchisinimi yoki oxirgisinimi?", 'Какой цвет ИИ делает главным: первый или последний?', 'Which colour does the AI make the main one: the first or the last?'),
      L3("Qizilni eng oldinga qo'ying, sariq bilan oq esa undan keyin kelsin.", 'Напиши красный первым, потом жёлтый и белый.', 'Write red first, then yellow and white.'),
      L3("Namunada qizil eng oldinda turibdi. Siz ham shunday yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('zamonaviy, qizil, sariq va oq', 'современный, красный, жёлтый и белый', 'modern, red, yellow and white'),
    ok: L3("Zo'r! Qizilni oldinga qo'ydingiz, sayt ham qizil bo'ldi. Sariq esa faqat tugmalarda qoldi, xuddi murabbiy aytgandek.", 'Огонь! Теперь сайт красный, а жёлтый — только на кнопках. Главный цвет пишут первым!', 'Awesome! Now the site is red, and yellow is only on the buttons. The main colour goes first!'),
    ask: L3('Ranglar tartibini tuzating', 'Исправь порядок цветов', 'Fix the colour order')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi saytlarni ko'zdan kechiramiz. Har bir saytning prompti yashirin, lekin dizaynning o'zi ko'p narsani aytib beradi. Rangiga, burchaklariga, harflariga qarab, qaysi «Ko'rinishi?» uni yasaganini va bu qanday uslub ekanini toping.",
      'Теперь побудем детективами. По сайту найдём: какое «Как выглядит?» дало этот дизайн и что это за стиль?',
      'Let’s be detectives. From the site we’ll work out which “How it looks?” gave this design and what style it is.'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3("Qaysi «Ko'rinishi?» shu saytni berdi?", 'Какое «Как выглядит?» дало этот сайт?', 'Which “How it looks?” gave this site?'),
    qMood: L3('Bu qanday uslub?', 'Какой это стиль?', 'What style is this?'),
    hint1: L3("Saytning foniga, ranglariga, burchaklariga va harflariga diqqat bilan qarang-chi.", 'Посмотри на фон, цвета, углы и буквы сайта.', 'Look at the site’s background, colours, corners and letters.'),
    hint2: L3("Fon qorong'i bo'lib, chiziqlar yonib tursa, bu neon uslub bo'ladi. Hammasi oppoq va toza bo'lsa, minimalist uslub. Rang-barang va kulgili sayt esa quvnoq uslubda yasalgan.", 'Тёмный фон и светящиеся линии — неон. Белое и чистое — минимализм. Разноцветное и смешное — весёлый.', 'Dark with glowing lines is neon. White and clean is minimal. Colourful and funny is playful.'),
    items: [
      { type: 'which', look: L3('minimalist, yashil', 'минимализм, зелёный', 'minimal, green'),
        a: L3('quvnoq, yashil', 'весёлый, зелёный', 'playful, green'), b: L3('minimalist, yashil', 'минимализм, зелёный', 'minimal, green'), c: L3('minimalist, qizil', 'минимализм, красный', 'minimal, red'),
        right: 'b', why: L3("Sayt oppoq va toza, ortiqcha bezagi yo'q, rangi esa yashil. Bunday sayt B variantdagi qatordan chiqadi.", 'Сайт белый и чистый, цвет зелёный. Это B.', 'The site is white and clean, and green. That’s B.') },
      { type: 'mood', look: L3("neon, binafsha", 'неон, фиолетовый', 'neon, purple'), opts: ['neon', 'calm', 'serious'], right: 'neon',
        why: L3("Qorong'i fonda chiziqlar yonib turibdi. Bunday dizayn neon uslubda bo'ladi.", 'Тёмный фон и светящиеся линии — это неон.', 'A dark background and glowing lines: that’s neon.') },
      { type: 'which', look: L3("retro, to'q sariq", 'ретро, оранжевый', 'retro, orange'),
        a: L3("retro, to'q sariq", 'ретро, оранжевый', 'retro, orange'), b: L3("jiddiy, to'q sariq", 'строгий, оранжевый', 'serious, orange'), c: L3("retro, ko'k", 'ретро, синий', 'retro, blue'),
        right: 'a', why: L3("Qalin qora chiziqlar va piksel harflar eski o'yinlarni eslatadi, demak, uslubi retro. Rangi to'q sariq, bu esa A variant.", 'Толстые чёрные рамки и пиксельный шрифт — ретро. Цвет оранжевый. Это A.', 'Thick black outlines and a pixel font: retro. The colour is orange. That’s A.') },
      { type: 'mood', look: L3("quvnoq, pushti", 'весёлый, розовый', 'playful, pink'), opts: ['minimal', 'fun', 'retro'], right: 'fun',
        why: L3("Rang-barang gradient va o'yinchoqqa o'xshash kartochkalar quvnoq uslubda bo'ladi.", 'Разноцветный градиент и карточки-игрушки: весёлый стиль.', 'A colourful gradient and toy-like cards: the playful style.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Siz dizaynni xuddi kitobdek o'qiyapsiz! Faqat saytga qarab, uning uslubini ham, ranglarini ham topdingiz.", 'Класс! Ты читаешь стиль и цвета сайта по его виду.', 'Great! You can read a site’s style and colours just by looking.')
  },
  s12: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("Direktor: «Bu olimpiadaning rasmiy sahifasi: jiddiy, to'q ko'k va oq, klassik shrift».", 'Директор: «Это официальная страница олимпиады: строгий стиль, синий и белый, классический шрифт».', 'The principal: “This is the official olympiad page: serious, blue and white, a classic font.”') },
    say: L3("Uf, men yana o'sha ishni qilibman! Maktab olimpiadasi uchun «chiroyli va zo'r bo'lsin» deb yozib qo'yibman, sun'iy intellekt esa yana pushti sayt yasabdi. Direktor nima deyayotganini o'qing-da, qatorimni tuzatib bering.",
      'Ой, я написал для сайта олимпиады «пусть будет красиво и круто». ИИ опять сделал розовый сайт! Что говорит директор? Исправь мою строку.',
      'Oops, for the olympiad site I wrote “make it pretty and cool”. The AI made a pink site again! What does the principal say? Fix my line.'),
    what: L3('Maktab olimpiadasi sayti', 'Сайт школьной олимпиады', 'A school olympiad site'),
    why: L3("o'quvchilar olimpiadaga yozilsin", 'чтобы ученики записывались на олимпиаду', 'get students to sign up for the olympiad'),
    who: L3("12–16 yoshli o'quvchilar", 'школьники 12–16 лет', 'students aged 12–16'),
    inside: L3('jadval, qoidalar, aloqa', 'расписание, правила, контакты', 'schedule, rules, contact'),
    bad: L3("chiroyli va zo'r bo'lsin", 'пусть будет красиво и круто', 'make it pretty and cool'),
    ph: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    msgs: {
      vague: L3("«Chiroyli va zo'r bo'lsin» hali ham qatorda turibdi. Uning o'rniga direktor aytgan uslubni va ranglarni yozing.", '«Красиво и круто» ещё на месте. Напиши стиль и цвета, которые назвал директор.', '“Pretty and cool” is still there. Write the style and colours the principal named.'),
      serious: L3("Uslubni unutmang: direktor jiddiy uslub so'ragan edi.", 'А стиль? Директор просил строгий.', 'What about the style? The principal asked for serious.'),
      blue: L3("Ranglar-chi? Direktor to'q ko'k va oq rangni so'radi.", 'А цвета? Директор просил синий и белый.', 'Where are the colours? The principal asked for blue and white.')
    },
    hints: [
      L3("Direktorning gapida uchta narsa bor: uslub, ranglar va shrift. Ularni bittalab toping.", 'Директор назвал три вещи: стиль, цвета и шрифт.', 'The principal named three things: the style, colours and font.'),
      L3("«Chiroyli va zo'r bo'lsin» degan so'zlarni o'chiring-da, o'rniga jiddiy, to'q ko'k va oq deb yozing.", 'Сотри «красиво и круто» и напиши: строгий, синий и белый.', 'Delete “pretty and cool” and write: serious, blue and white.'),
      L3("Pastdagi namunada klassik shrift ham bor. Hammasini shunday yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("jiddiy, to'q ko'k va oq, klassik shrift", 'строгий, синий и белый, классический шрифт', 'serious, blue and white, classic font'),
    ok: L3("Ajoyib! Pushti rang g'oyib bo'ldi, o'rniga jiddiy ko'k va oq, klassik harflar keldi. Endi bu chinakam rasmiy sahifaga o'xshaydi!", 'Класс! Розовый ушёл: строго, синий и белый, классические буквы. Настоящая официальная страница!', 'Great! The pink is gone: serious, blue and white, classic letters. A real official page!'),
    ask: L3("«Chiroyli va zo'r»ni tuzating", 'Исправь «красиво и круто»', 'Fix “pretty and cool”')
  },
  s13: {
    eyebrow: L3("To'liq ko'rinish", 'Полное описание вида', 'The full look'),
    card: { h: BUY, t: L3("Yoshlar musiqa festivali: zamonaviy, binafsha va pushti, yumaloq burchaklar va katta soyalar.", 'Молодёжный музыкальный фестиваль: современный, фиолетовый и розовый, скруглённые углы и большие тени.', 'A youth music festival: modern, purple and pink, rounded corners and big shadows.') },
    say: L3("Bugun o'rganganlarimizning hammasi bitta qatorga sig'adi! Yoshlar musiqa festivali buyurtma berdi. Uni o'qing-da, «Ko'rinishi?» qatoriga uslubni, ranglarni, burchaklarni va soyalarni yozing.",
      'Теперь полное «Как выглядит?»: стиль, цвета, углы и тени. Прочитай заказ музыкального фестиваля.',
      'Now write the full “How it looks?”: style, colours, corners and shadows. Read the music festival’s request.'),
    what: L3('Musiqa festivali sayti', 'Сайт музыкального фестиваля', 'A music festival site'),
    why: L3('yoshlar festivalga kelsin', 'чтобы молодёжь пришла на фестиваль', 'get young people to come to the festival'),
    who: L3("musiqani yaxshi ko'radigan 14–18 yoshli yoshlar", 'молодёжь 14–18 лет, которая любит музыку', 'young people aged 14–18 who love music'),
    inside: L3('rasmlar, jadval, narxlar', 'фото, расписание, цены', 'photos, schedule, prices'),
    ph: L3("uslub, ranglar, burchaklar, soyalar", 'стиль, цвета, углы, тени', 'style, colours, corners, shadows'),
    msgs: {
      mood: L3("Uslubni yozish esdan chiqibdi. Buyurtmada zamonaviy deyilgan.", 'А стиль? В заказе — современный.', 'What about the style? The request says modern.'),
      color: L3("Ranglar hali yo'q. Festival binafsha va pushti rangni so'ragan.", 'А цвета? В заказе — фиолетовый и розовый.', 'Where are the colours? The request says purple and pink.'),
      shape: L3("Burchaklar qanday bo'lsin? Buyurtmada yumaloq burchaklar deyilgan.", 'Напиши углы: в заказе скруглённые.', 'Write the corners: the request says rounded.'),
      shadow: L3("Soyalar qolib ketdi. Buyurtmada katta soyalar so'ralgan.", 'Напиши тени: в заказе большие тени.', 'Write the shadows: the request says big shadows.')
    },
    hints: [
      L3("Buyurtmada nechta narsa so'ralganini sanab chiqing-chi: uslub, ranglar, burchaklar va soyalar.", 'В заказе четыре вещи: стиль, цвета, углы и тени.', 'The request has four things: style, colours, corners and shadows.'),
      L3("Shu to'rtalasini bitta qatorga, vergul bilan ketma-ket yozing.", 'Напиши их через запятую по порядку.', 'Write them one after another, separated by commas.'),
      L3("Namuna pastda. Buyurtmadagi tartibda yozganingizdan keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('zamonaviy, binafsha va pushti, yumaloq burchaklar, katta soyalar', 'современный, фиолетовый и розовый, скруглённые углы, большие тени', 'modern, purple and pink, rounded corners, big shadows'),
    ok: L3("Barakalla! Sayt zamonaviy, binafsha va pushti chiqdi, burchaklari yumaloq, soyalari katta. Festivalga aynan shunday sayt kerak edi!", 'Молодец! Современный, фиолетово-розовый, скруглённый, с тенями. Сайт как раз для фестиваля!', 'Well done! Modern, purple and pink, rounded and with shadows. A site made for a festival!'),
    ask: L3("To'liq ko'rinishni yozing", 'Опиши вид полностью', 'Write the full look')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Endi navbat sizga: o'zingizning saytingizni o'ylab toping! Beshala qatorni ham yozing. «Ko'rinishi?» qatoriga esa saytingizning kayfiyatiga mos uslub va ranglarni tanlang.",
      'А теперь твой сайт! Напиши все пять строк, а в «Как выглядит?» — подходящие твоему сайту стиль и цвета.',
      'Now your own site! Write all five lines, and in “How it looks?” the style and colours that suit your site.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    phLook: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    msgs: {
      noWhat: L3("«Nima?» qatoridan boshlang: qanday sayt yaratmoqchisiz?", 'Напиши строку «Что?»: какой сайт создаёшь?', 'Write the “What?” line: what site are you making?'),
      kind: L3("Bu hali mavzu, xolos. Aniq bir narsani yozing: klub, server, do'kon yoki bayram sayti.", 'Это только тема. Напиши конкретную вещь: сайт клуба, сервера, магазина или праздника.', 'That’s just a topic. Write a specific thing: a club, server, shop or party site.'),
      noWhy: L3("Endi «Nega?» qatori: saytingiz nima qilib berishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      goal: L3("Maqsadni aniqroq yozing: odamlar yozilsinmi, buyurtma qilsinmi yoki kelsinmi?", 'Напиши цель: чтобы записывались, заказывали или приходили?', 'Write the goal: should people sign up, order or come?'),
      noWho: L3("«Kim uchun?» qatori bo'sh qoldi: saytingizni kimlar ochadi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      who: L3("Bu so'zdan sun'iy intellekt saytni kimlar ochishini bilolmadi. Ularning yoshini yoki kim ekanini yozing.", 'ИИ не понял, для кого. Напиши возраст или кто они.', 'The AI couldn’t tell who. Write their age or who they are.'),
      noIn: L3("«Ichida nima?» qatorini ham to'ldiring: saytda qanday bloklar bo'ladi?", 'Теперь напиши строку «Что внутри?»: какие блоки на сайте?', 'Now write the “What’s inside?” line: which blocks?'),
      noLook: L3("Endi bugungi yangi qator, «Ko'rinishi?»: saytingiz qanday ko'rinsin?", 'Теперь напиши строку «Как выглядит?»: каким будет сайт?', 'Now write the “How it looks?” line: how should it look?')
    },
    hints: [
      L3("Beshta savolni eslaymiz: «Nima?», «Nega?», «Kim uchun?», «Ichida nima?» va «Ko'rinishi?». Har biriga bitta qator.", 'Пять вопросов: что, зачем, для кого, что внутри, как выглядит.', 'Five questions: what, why, who for, what’s inside, how it looks.'),
      L3("«Ko'rinishi?» qatoriga bitta uslub va bir-ikkita rang yozsangiz, yetarli.", 'В «Как выглядит?» напиши стиль и один-два цвета.', 'In “How it looks?” write a style and one or two colours.'),
      L3("Namuna sifatida futbol klubining besh qatori pastda turibdi. Siz o'z saytingiz uchun xuddi shunday besh qator yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · 11–13 yoshli bolalar · rasmlar, jadval, aloqa · zamonaviy, yashil va oq", 'Сайт нашего футбольного клуба · чтобы ребята записывались · дети 11–13 лет · фото, расписание, контакты · современный, зелёный и белый', 'Our football club site · get kids to sign up · kids aged 11–13 · photos, schedule, contact · modern, green and white'),
    ok: L3("Qoyil! Besh qatorli prompt tayyor, saytingizning rangi ham, kayfiyati ham o'zingiz xohlagandek. Uyda uni haqiqiy sun'iy intellektga yuborib ko'rasiz.", 'Ого, классно! Это твой промпт из пяти строк. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your five-line prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun beshta qatorni yozing", 'Напиши пять строк для своего сайта', 'Write five lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Kartochkada beshta gap bor, ularning ba'zilari hatto meni ham chalg'itishi mumkin. Har birini o'qing-da, to'g'ri yoki noto'g'ri ekanini aniqlang.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Bu gap nima haqida ekan: uslubmi, rangmi yoki «chiroyli» degan so'zmi?", 'О чём фраза: о стиле, цвете или слове «красиво»?', 'What’s it about: style, colour or the word “pretty”?'),
    hint2: L3("Esingizdami: «chiroyli» degan so'zni sun'iy intellekt o'zicha tushunadi, birinchi yozilgan rang esa asosiy bo'ladi.", 'Вспомни: «красиво» ИИ понимает по-своему, а первый цвет становится главным.', 'Remember: the AI interprets “pretty” its own way, and the first colour becomes the main one.'),
    items: [
      { t: L3("«Chiroyli» degan so'z sun'iy intellektga aniq dizaynni aytadi.", 'Слово «красиво» говорит ИИ точный дизайн.', 'The word “pretty” tells the AI an exact design.'), right: false,
        why: L3("Pushti kibersport sayti yodingizdami? «Chiroyli» deganimizda, sun'iy intellekt o'zicha taxmin qilgan edi. Shuning uchun uslub va ranglarni aniq yozamiz.", 'На самом деле он гадает сам. Пиши стиль и цвета точно.', 'Actually it guesses on its own. Write the style and colours precisely.') },
      { t: L3("Birinchi yozilgan rang saytning asosiy rangi bo'ladi.", 'Первый написанный цвет становится главным цветом сайта.', 'The first colour written becomes the site’s main colour.'), right: true,
        why: L3("Birinchi rang butun saytni bo'yaydi, ikkinchisi esa tugmalarga ketadi.", 'Верно: второй уходит на кнопки.', 'Right: the second goes to the buttons.') },
      { t: L3("Uslub, ranglar, burchaklar va shrift saytning ko'rinishini belgilaydi.", 'Стиль, цвета, углы и шрифт задают вид сайта.', 'Style, colours, corners and the font set how a site looks.'), right: true,
        why: L3("Bularning hammasini «Ko'rinishi?» qatoriga yozsa bo'ladi, sayt ham shunga qarab o'zgaradi.", 'Верно: всё это можно написать в «Как выглядит?».', 'Right: you can write all of them in “How it looks?”.') },
      { t: L3("Kibersport turniri uchun sokin pushti uslub eng yaxshisi.", 'Для киберспортивного турнира лучше всего спокойный розовый стиль.', 'A calm pink style is best for an esports tournament.'), right: false,
        why: L3("Kibersport o'yinchilariga sokin pushti emas, qorong'i neon uslub yoqadi.", 'На самом деле игрокам подходит тёмный неон.', 'Actually gamers suit a dark neon style.') },
      { t: L3("«Ko'rinishi?» yozilmasa, dizaynni sun'iy intellekt o'zi tanlaydi.", 'Если не написать «Как выглядит?», дизайн ИИ выберет сам.', 'If you don’t write “How it looks?”, the AI picks the design itself.'), right: true,
        why: L3("Qator bo'sh qolsa, sun'iy intellekt dizaynni o'zi tanlaydi. Lekin u siz xohlagandek chiqmasligi mumkin.", 'Верно: и он может оказаться не таким, как ты хотел.', 'Right: and it might not be what you wanted.') }
    ],
    ok: L3("Birorta gap ham sizni aldolmadi! Endi saytning ko'rinishini sun'iy intellektga aniq tushuntira olasiz.", 'Всё верно! Ты правильно описываешь дизайн.', 'All correct! You describe design the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Bugun bir narsaga ishonchim komil edi: «chiroyli» desam, hamma bir xil narsani tushunadi. Endi o'zingiz ko'rdingiz: men uchun chiroyli degani neon, buvijon uchun iliq jigarrang, kichkintoylar uchun esa rang-barang bayram. Sun'iy intellekt bo'lsa, pushtini tanladi! Kim o'ylabdi deysiz, chiroyli har kimga har xil ekan. Agar boshidanoq bunga shubha qilgan bo'lsangiz, siz haq chiqdingiz!",
        'Вернёмся к загадке. Я думал, что «красиво» все понимают одинаково. Но мне красиво — неон, бабушке — тёплый коричневый, малышам — разноцветное! А ИИ выбрал розовый. «Красиво» у каждого своё. Я ошибся.',
        'Back to the riddle. I thought everyone understands “pretty” the same way. But to me pretty is neon, to grandma it’s warm brown, to little kids it’s colourful! And the AI picked pink. Pretty is different for everyone. I was wrong.'), k: 'riddle' },
      { text: L3("Bu esa sizning promptingiz: besh qator, sayt ham xuddi siz aytgandek chiqdi.", 'Смотри, это твой промпт из пяти строк и твой сайт.', 'Look, this is your five-line prompt and your site.'), k: 'own' },
      { text: L3("«Nima?», «Nega?», «Kim uchun?» va «Ichida nima?» qatorlari sizga allaqachon tanish.", '«Что», «зачем», «для кого» и «что внутри» ты уже знаешь.', 'You already know what, why, who for and what’s inside.'), k: 'what' },
      { text: L3("Yangi qator «Ko'rinishi?» esa saytning kiyimi bo'ladi: unga uslubni, ranglarni, burchaklarni, soyalarni va shriftni yozamiz. Birinchi yozilgan rang doim asosiy bo'ladi.", '«Как выглядит?» — это стиль, цвета, углы, тени и шрифт. Первый цвет — главный.', '“How it looks?” is the style, colours, corners, shadows and font. The first colour is the main one.'), k: 'look' },
      { text: L3("Uyda promptingizni nusxalab, haqiqiy sun'iy intellektga yuboring-chi, sayt qanaqa chiqarkin? Keyingi darsda oltinchi savolga o'tamiz: sayt qanday ishlaydi? Ko'rishguncha!",
        'Домашнее задание: скопируй свой промпт и отправь настоящему ИИ. На следующем уроке — шестой вопрос: как сайт ведёт себя? До встречи!',
        'Homework: copy your prompt and send it to a real AI. Next lesson: the sixth question — how should the site behave? See you!') }
    ],
    roles: { what: L3("aniq narsa: turnir, klub, do'kon", 'конкретная вещь: турнир, клуб, магазин', 'a specific thing: tournament, club, shop'), why: L3('maqsad: sayt nima qilsin', 'цель: что сделает сайт', 'the goal: what the site should do'),
      who: L3("auditoriya: yoshi, kimligi, nimani yaxshi ko'radi", 'аудитория: возраст, кто они, что любят', 'the audience: age, who they are, what they love'),
      in: L3("bloklar: qaysi, qanday tartibda, haqiqiy ma'lumot bilan", 'блоки: какие, в каком порядке, с настоящими данными', 'blocks: which, in what order, with real details'),
      look: L3("uslub, ranglar, burchaklar, soyalar, shrift", 'стиль, цвета, углы, тени, шрифт', 'style, colours, corners, shadows, font') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring va saytingizni yarating.", 'Отправь свой промпт настоящему ИИ и сделай свой сайт.', 'Send your prompt to a real AI and make your site.'),
    ask: L3('Promptingiz va saytingizga qarang', 'Посмотри на свой промпт и сайт', 'Look at your prompt and your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, look: 1, right: 1, opts: 1, type: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:ai4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:ai4.css@*/
`;
