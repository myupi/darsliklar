// =============================================================================
// МОДУЛЬ «ИИ» · Урок 6 — «Как дать ИИ точные требования?»
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 12.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai6/build.mjs → lessons/ai/06-tochnye-trebovaniya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 6 · «Как дать ИИ точные требования?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика: каждый урок добавляет в промпт новый кусок; темы урока — обязательно, нельзя, должно быть,
// заказ клиента). Коди пишет в седьмую строку «hammasi tushunarli», и ИИ сам добавляет на сайт цветочного магазина
// окно подписки, «−50%» и чат, а телефон выдумывает. Клиент: «Мы не даём скидок! Что за окно? И номер не наш!». Урок
// учит седьмому вопросу формулы «Qoidalar?»: majburiy (обязательно — с настоящими данными), mumkin emas (нельзя),
// ограничения (faqat bitta tugma, ko'pi bilan 3 ta blok), и как превратить сообщение клиента в правила.
// Загадка (без имён): Коди думает, что ИИ сам знает, что можно и что нельзя. Разгадка: ИИ не знает клиента — его
// правила знаешь только ты, их нужно написать.
//
// ДУГА (18 экранов):
//   s1 крючок (семь строк, «Qoidalar?» = «hammasi tushunarli» → окно, «−50%», чат, выдуманный телефон; загадка)
//   нельзя: s2 показ (пусто → без окна → без скидки → без чата) · s3 сам (клуб плавания) · s4 что точнее (раунды)
//   обязательно: s5 показ (телефон → адрес → Telegram) · s6 сам (курс роботов: телефон и адрес) ·
//                s7 обязательно или нельзя (раунды)
//   ограничения и заказ: s8 показ (одна кнопка → не больше 3 блоков) · s9 сам (выставка) · s10 показ (сообщение
//                клиента → правила) · s11 сам (сообщение директора лагеря)
//   думать промптом: g1 «телефон» без номера (ИИ выдумал) · det детектив · s12 почини «hammasi tushunarli» Коди
//                (цветы) · s13 все правила (курс гитары) · s14 свой сайт из семи строк
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт из семи строк и сайт, домашка.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite с pr.rules, rulesOf, ruleEls, ruleCss): без правил или с «hammasi
//     tushunarli» ИИ добавляет окно подписки, «−50%», чат («Taxmin»); «mumkin emas» убирает их по одному; «majburiy» —
//     строка сведений под баннером (телефон, адрес, часы, Telegram); без номера — выдуманный телефон («Taxmin»);
//     «faqat bitta tugma», «ko'pi bilan N ta blok». Метки «Qoidalar?» (малиновые) — у строки сведений.
//   · Узбекский — по /uzbekcha; в речи нет цифр и символов (номера только на экране).
//
// СИСТЕМА СЛОВ: qoida — правило; majburiy — обязательно (ya'ni albatta bo'lishi kerak); mumkin emas — нельзя;
// mijoz — клиент; buyurtma — заказ; chegirma — скидка; obuna oynasi — окно подписки.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-06-tochnye-trebovaniya',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '6-dars. Aniq talablar qanday beriladi?',
    ru: 'Урок 6. Как дать ИИ точные требования?',
    en: 'Lesson 6. How to give the AI exact requirements?'
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
  next: L3('Natijani qanday yaxshilaymiz?', 'Как улучшить результат ИИ?', 'How to improve the AI’s result?'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};
const SIDE_L = { must: L3('Majburiy', 'Обязательно', 'Must have'), no: L3('Mumkin emas', 'Нельзя', 'Not allowed') };

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const BUY = L3('Mijoz', 'Клиент', 'Client');
const NOX = L3("reklama oynasi, chegirma va chat bo'lmasin", 'без рекламного окна, скидок и чата', 'no pop-up window, discount or chat');
// Общие ответы проверки «Qoidalar?».
const M = {
  empty: L3("«Qoidalar?» qatoriga yozing: nima majburiy va nima mumkin emas?", 'Напиши в строку «Какие правила?»: что обязательно и что нельзя?', 'Write in the “What rules?” line: what is a must and what is not allowed?'),
  vague: L3("Bu so'zlar sun'iy intellektga hech narsa demaydi. Aniq yozing: nima majburiy va nima mumkin emas.", 'Эти слова ничего не говорят ИИ. Напиши точно: что обязательно и что нельзя.', 'Those words tell the AI nothing. Be precise: what is a must and what is not allowed.'),
  none: L3("Sun'iy intellekt bu so'zlardan qoidani tanimadi. Masalan: chegirma bo'lmasin, telefon raqami albatta bo'lsin.", 'ИИ не узнал по этим словам правило. Например: без скидок, телефон обязательно.', 'The AI didn’t recognise a rule. For example: no discount, the phone number is a must.')
};
const C = {
  s1: {
    eyebrow: L3('Qoidalar', 'Правила', 'Rules'),
    say: L3("Salom! Promptimda oltita qator bor. Yettinchisi yangi: qoidalar. Men «hammasi tushunarli» deb yozdim. Bu gul do'koni uchun! «Yuborish»ni bosing.",
      'Привет! В моём промпте шесть строк. Седьмая — новая: правила. Я написал «и так всё понятно». Это для цветочного магазина! Нажми «Отправить».',
      'Hi! My prompt has six lines. The seventh is new: rules. I wrote “it’s all obvious”. It’s for a flower shop! Tap “Send”.'),
    what: L3("Gul do'koni sayti", 'Сайт цветочного магазина', 'A flower shop site'),
    why: L3("odamlar bizga qo'ng'iroq qilsin", 'чтобы люди нам звонили', 'get people to call us'),
    who: L3("sovg'a qidirayotgan kattalar", 'взрослые, которые ищут подарок', 'adults looking for a gift'),
    inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3('sokin, pushti va oq', 'спокойный, розовый и белый', 'calm, pink and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    rules: L3('hammasi tushunarli', 'и так всё понятно', 'it’s all obvious'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Voy! Sun'iy intellekt o'zicha obuna oynasini, katta chegirmani va chatni qo'shibdi. Telefon raqamini ham o'zi to'qib chiqaribdi! Qarang, «Taxmin» belgilari.",
      'Ого! ИИ сам добавил окно подписки, огромную скидку и чат. И номер телефона тоже выдумал! Смотри, метки «Догадка».',
      'Whoa! The AI added a subscribe window, a huge discount and a chat by itself. It even made up the phone number! Look at the “Guess” labels.'),
    done: L3("Menimcha, sun'iy intellekt nima mumkin, nima mumkin emasligini o'zi biladi. Bu hammaga tushunarli-ku! Siz nima deb o'ylaysiz? Bugun yettinchi savol: qanday qoidalar?",
      'По-моему, ИИ сам знает, что можно и что нельзя. Это же всем понятно! А ты как думаешь? Сегодня — седьмой вопрос: какие правила?',
      'I think the AI knows by itself what is allowed and what isn’t. Everyone knows that! What do you think? Today: the seventh question — what rules?'),
    seen: { h: L3("Mijoz nima dedi", 'Что сказал клиент', 'What the client said'), t: L3("«Biz chegirma bermaymiz! Bu obuna oynasi nima? Telefon raqami ham bizniki emas!»", '«Мы не даём скидок! Что это за окно подписки? И номер телефона не наш!»', '“We don’t give discounts! What’s this subscribe window? And that’s not our phone number!”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3("«Hammasi tushunarli» ishlamadi", '«И так всё понятно» не сработало', '“It’s all obvious” didn’t work')
  },
  s2: {
    eyebrow: L3('Mumkin emas', 'Нельзя', 'Not allowed'),
    help: [
      L3("Qoidalar qatoriga va sayt burchaklaridagi qo'shimchalarga qarang.", 'Посмотри на строку правил и на добавки по углам сайта.', 'Look at the rules line and at the extras in the site’s corners.'),
      L3("Mumkin emas, ya'ni saytda bo'lmasligi kerak bo'lgan narsa degani. Aytilmasa, sun'iy intellekt uni o'zicha qo'shishi mumkin.", 'Нельзя — это то, чего на сайте быть не должно. Если не сказать, ИИ может добавить это сам.', 'Not allowed means things that must not be on the site. If you don’t say so, the AI may add them itself.'),
      L3("Oshpazga «yong'oq solmang» deysiz. Aytmasangiz, u bilmaydi va solib yuboradi.", 'Повару говоришь: «без орехов». Не скажешь — он не узнает и положит.', 'You tell a cook “no nuts”. If you don’t, they won’t know and will add them.')
    ],
    say: L3("Birinchi qism: mumkin emas. Qarang, qoidalar qatori bo'sh. Sun'iy intellekt o'zicha obuna oynasi, chegirma va chat qo'shdi. Mijoz esa ularni so'ramagan edi.",
      'Первая часть — нельзя. Смотри, строка правил пустая. ИИ сам добавил окно подписки, скидку и чат. А клиент их не просил.',
      'The first part: not allowed. Look, the rules line is empty. The AI added a subscribe window, a discount and a chat by itself. The client never asked for them.'),
    what: L3("Raqs to'garagi sayti", 'Сайт кружка танцев', 'A dance club site'),
    why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    who: L3('8–12 yoshli bolalar', 'дети 8–12 лет', 'kids aged 8–12'),
    inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'),
    look: L3('quvnoq, pushti va sariq', 'весёлый, розовый и жёлтый', 'playful, pink and yellow'),
    beh: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'),
    r1: L3("reklama oynasi bo'lmasin", 'без рекламного окна', 'no pop-up window'),
    r2: L3("reklama oynasi va chegirma bo'lmasin", 'без рекламного окна и скидок', 'no pop-up window or discount'),
    r3: NOX,
    says: [
      L3("Yozamiz: reklama oynasi bo'lmasin. Qarang, pastdagi obuna oynasi yo'qoldi!", 'Пишем: без рекламного окна. Смотри, окно подписки внизу исчезло!', 'We write: no pop-up window. Look, the subscribe window at the bottom is gone!'),
      L3("Chegirma ham bo'lmasin. Qizil «chegirma» yozuvi ketdi. Endi sayt yolg'on va'da bermaydi.", 'И без скидок. Красная надпись про скидку ушла. Теперь сайт не обещает неправду.', 'No discount either. The red discount sign is gone. Now the site doesn’t promise anything untrue.'),
      L3("Va chat bo'lmasin. Burchakdagi chat tugmasi ham yo'qoldi. Sayt toza qoldi.", 'И без чата. Кнопка чата в углу тоже пропала. Сайт стал чистым.', 'And no chat. The chat button in the corner is gone too. The site is clean.')
    ],
    done: L3("Demak, «mumkin emas» ga saytda bo'lmasligi kerak narsalarni aniq nomlaymiz. Har birini alohida.", 'Значит, в «нельзя» точно называем то, чего не должно быть на сайте. Каждую вещь отдельно.', 'So under “not allowed” we name exactly what must not be on the site. Each thing separately.'),
    asks: [L3("Qarang: sun'iy intellekt o'zi qo'shdi", 'Смотри: ИИ добавил сам', 'Watch: the AI added things itself'), L3("Qarang: oyna yo'q", 'Смотри: окна нет', 'Watch: no window'),
      L3("Qarang: chegirma yo'q", 'Смотри: скидки нет', 'Watch: no discount'), L3("Qarang: chat yo'q", 'Смотри: чата нет', 'Watch: no chat')],
    askDone: L3("«Mumkin emas» ortiqchani olib tashlaydi", '«Нельзя» убирает лишнее', '“Not allowed” removes the extras')
  },
  s3: {
    eyebrow: L3('Mumkin emas', 'Нельзя', 'Not allowed'),
    card: { h: BUY, t: L3("Suzish klubi: «Saytda reklama oynasi ham, chegirma ham bo'lmasin. Bizda chegirma yo'q.»", 'Клуб плавания: «На сайте не должно быть ни рекламного окна, ни скидок. У нас скидок нет».', 'Swimming club: “No pop-up window and no discount on the site. We don’t do discounts.”') },
    say: L3("Endi siz. Suzish klubi nima bo'lmasligini aytdi. Mijozning gapini o'qing va «Qoidalar?» qatoriga yozing.",
      'Теперь ты. Клуб плавания сказал, чего быть не должно. Прочитай слова клиента и напиши в строку «Какие правила?».',
      'Your turn. The swimming club said what must not be there. Read the client’s words and write in the “What rules?” line.'),
    what: L3('Suzish klubi sayti', 'Сайт клуба плавания', 'A swimming club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3('8–12 yoshli bolalar', 'дети 8–12 лет', 'kids aged 8–12'),
    inside: L3('narxlar, rasmlar, aloqa', 'цены, фото, контакты', 'prices, photos, contact'),
    look: L3("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    ph: L3("nima bo'lmasin?", 'чего быть не должно?', 'what must not be there?'),
    msgs: {
      popup: L3("Reklama oynasi hali turibdi. Mijoz: reklama oynasi bo'lmasin.", 'Рекламное окно ещё на месте. Клиент: без рекламного окна.', 'The pop-up window is still there. The client says: no pop-up window.'),
      sale: L3("Chegirma hali turibdi. Mijoz: chegirma bo'lmasin.", 'Скидка ещё на месте. Клиент: без скидок.', 'The discount is still there. The client says: no discount.')
    },
    hints: [
      L3("Mijoz ikki narsani taqiqladi.", 'Клиент запретил две вещи.', 'The client banned two things.'),
      L3("Reklama oynasi va chegirma bo'lmasin.", 'Без рекламного окна и скидок.', 'No pop-up window and no discount.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("reklama oynasi va chegirma bo'lmasin", 'без рекламного окна и скидок', 'no pop-up window or discount'),
    ok: L3("Zo'r! Oyna ham, chegirma ham yo'q. Sayt mijoz xohlaganidek!", 'Огонь! Ни окна, ни скидки. Сайт такой, как хотел клиент!', 'Awesome! No window, no discount. The site is just what the client wanted!'),
    ask: L3("Nima bo'lmasligini yozing", 'Напиши, чего быть не должно', 'Write what must not be there')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Endi o'zingizni sinab ko'ring. Ikki qoidadan qaysi biri sun'iy intellektga aniqroq?", 'Теперь проверь себя. Какое из двух правил понятнее ИИ?', 'Now check yourself. Which of the two rules is clearer for the AI?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi qoida aniqroq?", 'Какое правило точнее?', 'Which rule is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi birida aniq narsa nomlangan: oyna, chegirma, chat yoki telefon?", 'Где названа конкретная вещь: окно, скидка, чат или телефон?', 'Which one names a real thing: a window, discount, chat or phone?'),
    hint2: L3("«Ortiqcha», «tushunarli», «yaxshi» hech narsani aniq aytmaydi.", '«Лишнее», «понятно», «хорошо» ничего точно не говорят.', '“Extra”, “obvious” and “good” say nothing precise.'),
    items: [
      { a: L3("ortiqcha narsa bo'lmasin", 'ничего лишнего', 'nothing extra'), b: L3("chegirma bo'lmasin", 'без скидок', 'no discount'), right: 'b',
        why: L3("Ikkinchisida aniq narsa bor: chegirma. «Ortiqcha» nimaligini sun'iy intellekt bilmaydi.", 'Во втором названа вещь — скидка. Что такое «лишнее», ИИ не знает.', 'The second names a real thing: a discount. The AI doesn’t know what “extra” means.') },
      { a: L3("reklama oynasi bo'lmasin", 'без рекламного окна', 'no pop-up window'), b: L3("yaxshi bo'lsin", 'пусть будет хорошо', 'make it good'), right: 'a',
        why: L3("Birinchisi aniq: reklama oynasi bo'lmaydi.", 'Первое точное: рекламного окна не будет.', 'The first is precise: no pop-up window.') },
      { a: L3('hammasi tushunarli', 'и так всё понятно', 'it’s all obvious'), b: L3("chat tugmasi bo'lmasin", 'без кнопки чата', 'no chat button'), right: 'b',
        why: L3("«Hammasi tushunarli» faqat sizga tushunarli. Sun'iy intellektga aniq yozing.", '«Всё понятно» понятно только тебе. ИИ нужно написать точно.', '“It’s all obvious” is only obvious to you. Tell the AI precisely.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Siz aniq qoidani noaniqdan ajratasiz.", 'Всё верно! Ты отличаешь точное правило от размытого.', 'All correct! You can tell a precise rule from a vague one.')
  },
  s5: {
    eyebrow: L3('Majburiy', 'Обязательно', 'Must have'),
    help: [
      L3("Qoidalar qatoriga va sayt banneri ostidagi qatorga qarang.", 'Посмотри на строку правил и на строку под баннером сайта.', 'Look at the rules line and at the row under the site’s banner.'),
      L3("Majburiy, ya'ni saytda albatta bo'lishi kerak narsa degani. Aniq ma'lumotni o'zingiz yozasiz, sun'iy intellekt uni bilmaydi.", 'Обязательно — то, что на сайте должно быть всегда. Точные данные пишешь ты сам: ИИ их не знает.', 'Must have means things that have to be on the site. You write the exact details yourself: the AI doesn’t know them.'),
      L3("Do'stingizga sovg'a yuborsangiz, manzilni aniq yozasiz. «Qayerdadir» desangiz, sovg'a yetib bormaydi.", 'Отправляешь другу подарок — пишешь точный адрес. Скажешь «где-нибудь» — подарок не дойдёт.', 'When you send a friend a gift, you write the exact address. Say “somewhere”, and the gift won’t arrive.')
    ],
    say: L3("Ikkinchi qism: majburiy. Qarang, ortiqcha narsalar yo'q, lekin telefon raqamini sun'iy intellekt o'zi to'qib chiqardi. Mijozlar boshqa odamga qo'ng'iroq qiladi!",
      'Вторая часть — обязательно. Смотри, лишнего уже нет, но номер телефона ИИ выдумал сам. Клиенты будут звонить чужому человеку!',
      'The second part: must have. Look, there are no extras now, but the AI made up the phone number. Customers will call a stranger!'),
    what: L3('Milliy taomlar kafesi sayti', 'Сайт кафе национальной кухни', 'A national food cafe site'),
    why: L3("odamlar bizga qo'ng'iroq qilsin", 'чтобы люди нам звонили', 'get people to call us'),
    who: L3('mahalladagi oilalar', 'семьи нашего района', 'families in our neighbourhood'),
    inside: L3('menyu, narxlar, aloqa', 'меню, цены, контакты', 'menu, prices, contact'),
    look: L3("iliq, to'q sariq va oq", 'тёплый, оранжевый и белый', 'warm, orange and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    r0: NOX,
    r1: L3("reklama oynasi, chegirma va chat bo'lmasin, majburiy: telefon +998 93 555 44 33", 'без рекламного окна, скидок и чата, обязательно: телефон +998 93 555 44 33', 'no pop-up window, discount or chat, must: phone +998 93 555 44 33'),
    r2: L3("reklama oynasi, chegirma va chat bo'lmasin, majburiy: telefon +998 93 555 44 33, manzil: Chilonzor 5", 'без рекламного окна, скидок и чата, обязательно: телефон +998 93 555 44 33, адрес: Чиланзар 5', 'no pop-up window, discount or chat, must: phone +998 93 555 44 33, address: Chilonzor 5'),
    r3: L3("reklama oynasi, chegirma va chat bo'lmasin, majburiy: telefon +998 93 555 44 33, manzil: Chilonzor 5, Telegram tugmasi", 'без рекламного окна, скидок и чата, обязательно: телефон +998 93 555 44 33, адрес: Чиланзар 5, кнопка Telegram', 'no pop-up window, discount or chat, must: phone +998 93 555 44 33, address: Chilonzor 5, a Telegram button'),
    says: [
      L3("Yozamiz: majburiy, telefon va kafening haqiqiy raqami. Qarang, banner ostida to'g'ri raqam chiqdi, «Taxmin» yo'qoldi!", 'Пишем: обязательно — телефон и настоящий номер кафе. Смотри, под баннером появился правильный номер, «Догадка» исчезла!', 'We write: must have, the phone and the cafe’s real number. Look, the right number appeared under the banner, and the “Guess” is gone!'),
      L3("Manzilni ham qo'shamiz. Endi mehmonlar kafeni oson topadi.", 'Добавим и адрес. Теперь гости легко найдут кафе.', 'Let’s add the address too. Now guests will easily find the cafe.'),
      L3("Va Telegram tugmasi. Mijozlar u yerda ham yozishi mumkin.", 'И кнопку Telegram. Клиенты смогут писать и туда.', 'And a Telegram button. Customers can message there too.')
    ],
    done: L3("Demak, «majburiy» ga saytda albatta bo'lishi kerak narsani yozamiz. Raqam va manzilni esa aniq, o'zimiz yozamiz.", 'Значит, в «обязательно» пишем то, что на сайте должно быть всегда. А номер и адрес — точно, своими руками.', 'So under “must have” we write what has to be on the site. And the number and address we write exactly, ourselves.'),
    asks: [L3("Qarang: raqam to'qib chiqarilgan", 'Смотри: номер выдуман', 'Watch: the number is made up'), L3("Qarang: haqiqiy raqam", 'Смотри: настоящий номер', 'Watch: the real number'),
      L3('Qarang: manzil', 'Смотри: адрес', 'Watch: the address'), L3('Qarang: Telegram', 'Смотри: Telegram', 'Watch: Telegram')],
    askDone: L3("«Majburiy» kerakli narsani qo'shadi", '«Обязательно» добавляет нужное', '“Must have” adds what’s needed')
  },
  s6: {
    eyebrow: L3('Majburiy', 'Обязательно', 'Must have'),
    card: { h: BUY, t: L3("Robot kursi: «Telefonimiz +998 90 777 88 99, manzilimiz Yunusobod 12. Ular saytda albatta bo'lsin.»", 'Курс роботов: «Наш телефон +998 90 777 88 99, адрес — Юнусабад 12. Они обязательно должны быть на сайте».', 'Robot course: “Our phone is +998 90 777 88 99, our address is Yunusobod 12. They must be on the site.”') },
    say: L3("Endi siz. Robot kursi o'z telefoni va manzilini aytdi. Ularni «Qoidalar?» qatoriga majburiy qilib yozing.",
      'Теперь ты. Курс роботов назвал свой телефон и адрес. Напиши их в строку «Какие правила?» как обязательные.',
      'Your turn. The robot course gave its phone and address. Write them in the “What rules?” line as must-haves.'),
    what: L3('Robot kursi sayti', 'Сайт курса роботов', 'A robot course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'),
    inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'),
    look: L3('zamonaviy, yashil va oq', 'современный, зелёный и белый', 'modern, green and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    ph: L3("nima majburiy?", 'что обязательно?', 'what is a must?'),
    msgs: {
      phone: L3("Telefon raqami yo'q yoki boshqa. Mijozning raqamini aniq yozing.", 'Номера нет или он другой. Напиши номер клиента точно.', 'The number is missing or different. Write the client’s number exactly.'),
      addr: L3("Manzil yo'q yoki boshqa. Mijoz: Yunusobod 12.", 'Адреса нет или он другой. Клиент: Юнусабад 12.', 'The address is missing or different. The client says: Yunusobod 12.')
    },
    hints: [
      L3("Mijoz ikki narsani aytdi: telefon va manzil.", 'Клиент назвал две вещи: телефон и адрес.', 'The client named two things: the phone and the address.'),
      L3("Majburiy so'zidan keyin telefon raqamini va manzilni ko'chirib yozing.", 'После «обязательно» перепиши номер телефона и адрес.', 'After “must” copy the phone number and the address.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('majburiy: telefon +998 90 777 88 99, manzil: Yunusobod 12', 'обязательно: телефон +998 90 777 88 99, адрес: Юнусабад 12', 'must: phone +998 90 777 88 99, address: Yunusobod 12'),
    ok: L3("Ajoyib! Banner ostida haqiqiy raqam va manzil. Endi o'quvchilar to'g'ri joyga qo'ng'iroq qiladi!", 'Класс! Под баннером настоящий номер и адрес. Теперь ученики позвонят куда нужно!', 'Great! The real number and address are under the banner. Now students will call the right place!'),
    ask: L3('Majburiy narsalarni yozing', 'Напиши, что обязательно', 'Write the must-haves')
  },
  s7: {
    eyebrow: L3('Majburiy yoki mumkin emas?', 'Обязательно или нельзя?', 'Must or not allowed?'),
    say: L3("Mijozlar o'z so'zlari bilan gapiradi. Men mijozning gapini aytaman, siz tanlang: bu majburiymi yoki mumkin emasmi?", 'Клиенты говорят своими словами. Я говорю фразу клиента, а ты выбираешь: это обязательно или нельзя?', 'Clients speak in their own words. I say what a client said, and you choose: is it a must or not allowed?'),
    card: L3('Mijoz', 'Клиент', 'Client'),
    ask: L3('Majburiymi yoki mumkin emasmi?', 'Обязательно или нельзя?', 'Must or not allowed?'),
    hint1: L3("Mijoz bu narsani saytda ko'rishni xohlaydimi yoki yo'qmi?", 'Клиент хочет видеть это на сайте или нет?', 'Does the client want this on the site or not?'),
    hint2: L3("«Albatta», «kerak» bu majburiy. «Kerak emas», «bo'lmasin» bu mumkin emas.", '«Обязательно», «нужно» — это обязательно. «Не надо», «чтобы не было» — это нельзя.', '“Definitely”, “we need” means must. “Don’t need”, “no” means not allowed.'),
    items: [
      { t: L3("«Manzilimiz albatta ko'rinib tursin.»", '«Наш адрес обязательно должен быть виден».', '“Our address must be visible.”'), right: 'must',
        why: L3("«Albatta» bu majburiy.", '«Обязательно» — значит обязательно.', '“Must” means must have.') },
      { t: L3("«Bizga chat kerak emas, javob berishga vaqtimiz yo'q.»", '«Чат нам не нужен, нам некогда отвечать».', '“We don’t need a chat, we have no time to answer.”'), right: 'no',
        why: L3("«Kerak emas» bu mumkin emas.", '«Не нужен» — значит нельзя.', '“Don’t need” means not allowed.') },
      { t: L3("«Telegramimizga tugma qo'yinglar.»", '«Поставьте кнопку на наш Telegram».', '“Put a button to our Telegram.”'), right: 'must',
        why: L3("Mijoz tugmani so'rayapti: majburiy.", 'Клиент просит кнопку: обязательно.', 'The client asks for the button: must have.') },
      { t: L3("«Hech qanday chegirma va aksiya yozmang.»", '«Не пишите никаких скидок и акций».', '“Don’t write any discounts or sales.”'), right: 'no',
        why: L3("«Yozmang» bu mumkin emas.", '«Не пишите» — значит нельзя.', '“Don’t write” means not allowed.') },
      { t: L3("«Mijozlarni har xil oynalar bilan bezovta qilmang.»", '«Не беспокойте клиентов всякими окнами».', '“Don’t bother customers with pop-up windows.”'), right: 'no',
        why: L3("Oynalar bo'lmasin: mumkin emas.", 'Окон быть не должно: нельзя.', 'No windows: not allowed.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Mijozning gapidan qoidani topasiz.", 'Класс! Ты находишь правило в словах клиента.', 'Great! You find the rule in what the client says.')
  },
  s8: {
    eyebrow: L3('Chegaralar', 'Ограничения', 'Limits'),
    help: [
      L3("Qoidalar qatoriga, saytdagi tugmalarga va bloklar soniga qarang.", 'Посмотри на строку правил, на кнопки сайта и на число блоков.', 'Look at the rules line, at the site’s buttons and at how many blocks there are.'),
      L3("Chegara, ya'ni nechta bo'lishi mumkinligi degani: faqat bitta tugma yoki ko'pi bilan uchta blok.", 'Ограничение — это сколько чего может быть: только одна кнопка или не больше трёх блоков.', 'A limit says how many of something there can be: only one button or no more than three blocks.'),
      L3("Futbol maydonida bir jamoada faqat o'n bir o'yinchi bo'ladi. Bu ham chegara.", 'На футбольном поле в одной команде только одиннадцать игроков. Это тоже ограничение.', 'On a football pitch a team has only eleven players. That’s a limit too.')
    ],
    say: L3("Uchinchi qism: chegaralar. Qarang, saytda tugmalar ko'p va bloklar ham beshta. O'quvchi qaysi tugmani bosishni bilmay qoladi.", 'Третья часть — ограничения. Смотри, на сайте много кнопок и целых пять блоков. Ученик не знает, какую кнопку нажать.', 'The third part: limits. Look, the site has lots of buttons and five blocks. A student won’t know which button to press.'),
    what: L3("Shaxmat to'garagi sayti", 'Сайт шахматного кружка', 'A chess club site'),
    why: L3("o'quvchilar to'garakka yozilsin", 'чтобы школьники записывались в кружок', 'get students to sign up for the club'),
    who: L3("10–14 yoshli o'quvchilar", 'школьники 10–14 лет', 'students aged 10–14'),
    inside: L3('rasmlar, jadval, narxlar, sharhlar, aloqa', 'фото, расписание, цены, отзывы, контакты', 'photos, schedule, prices, reviews, contact'),
    look: L3('minimalist, qora va oq', 'минимализм, чёрный и белый', 'minimal, black and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    r0: NOX,
    r1: L3("reklama oynasi, chegirma va chat bo'lmasin, faqat bitta tugma bo'lsin", 'без рекламного окна, скидок и чата, только одна кнопка', 'no pop-up window, discount or chat, only one button'),
    r2: L3("reklama oynasi, chegirma va chat bo'lmasin, faqat bitta tugma bo'lsin, ko'pi bilan 3 ta blok", 'без рекламного окна, скидок и чата, только одна кнопка, не больше 3 блоков', 'no pop-up window, discount or chat, only one button, at most 3 blocks'),
    says: [
      L3("Yozamiz: faqat bitta tugma bo'lsin. Qarang, menyudagi va pastdagi tugmalar ketdi. Endi bitta asosiy tugma qoldi.", 'Пишем: только одна кнопка. Смотри, кнопки в меню и внизу ушли. Осталась одна главная.', 'We write: only one button. Look, the buttons in the menu and at the bottom are gone. One main button is left.'),
      L3("Va ko'pi bilan uchta blok. Sayt qisqa va tushunarli bo'ldi: rasmlar, jadval va narxlar.", 'И не больше трёх блоков. Сайт стал коротким и понятным: фото, расписание и цены.', 'And at most three blocks. The site got short and clear: photos, schedule and prices.')
    ],
    done: L3("Demak, qoidaga chegarani ham yozish mumkin: nechta tugma, nechta blok. Shunda sayt keraksiz narsalar bilan to'lib ketmaydi.", 'Значит, в правило можно написать и ограничение: сколько кнопок, сколько блоков. Тогда сайт не завалят ненужным.', 'So a rule can also be a limit: how many buttons, how many blocks. Then the site doesn’t fill up with things nobody needs.'),
    asks: [L3("Qarang: tugma va blok ko'p", 'Смотри: кнопок и блоков много', 'Watch: lots of buttons and blocks'), L3('Qarang: bitta tugma', 'Смотри: одна кнопка', 'Watch: one button'),
      L3('Qarang: uchta blok', 'Смотри: три блока', 'Watch: three blocks')],
    askDone: L3('Chegara saytni ixcham qiladi', 'Ограничение делает сайт компактным', 'A limit keeps the site compact')
  },
  s9: {
    eyebrow: L3('Chegaralar', 'Ограничения', 'Limits'),
    card: { h: BUY, t: L3("Rasm ko'rgazmasi: «Sayt juda uzun. Ko'pi bilan 2 ta blok bo'lsin va faqat bitta tugma.»", 'Выставка рисунков: «Сайт слишком длинный. Не больше 2 блоков и только одна кнопка».', 'Art exhibition: “The site is too long. At most 2 blocks and only one button.”') },
    say: L3("Endi siz. Ko'rgazma sayti juda uzun bo'lib ketdi. Mijozning chegaralarini «Qoidalar?» qatoriga yozing.",
      'Теперь ты. Сайт выставки получился слишком длинным. Напиши ограничения клиента в строку «Какие правила?».',
      'Your turn. The exhibition site got too long. Write the client’s limits in the “What rules?” line.'),
    what: L3("Rasm ko'rgazmasi sayti", 'Сайт выставки рисунков', 'An art exhibition site'),
    why: L3("odamlar ko'rgazmaga kelsin", 'чтобы люди пришли на выставку', 'get people to come to the exhibition'),
    who: L3("san'atni yaxshi ko'radigan oilalar", 'семьи, которые любят искусство', 'families who love art'),
    inside: L3('rasmlar, jadval, narxlar, sharhlar, aloqa', 'картины, расписание, цены, отзывы, контакты', 'pictures, schedule, prices, reviews, contact'),
    look: L3('minimalist, qora va oq', 'минимализм, чёрный и белый', 'minimal, black and white'),
    beh: L3("tugma ustiga kelganda kattalashsin", 'кнопка увеличивается при наведении', 'the button grows on hover'),
    ph: L3('qanday chegaralar?', 'какие ограничения?', 'which limits?'),
    msgs: {
      max: L3("Bloklar hali ko'p. Mijoz: ko'pi bilan 2 ta blok.", 'Блоков ещё много. Клиент: не больше 2 блоков.', 'Still too many blocks. The client says: at most 2 blocks.'),
      one: L3("Tugmalar hali ko'p. Mijoz: faqat bitta tugma.", 'Кнопок ещё много. Клиент: только одна кнопка.', 'Still too many buttons. The client says: only one button.')
    },
    hints: [
      L3("Mijoz ikki chegara aytdi: bloklar soni va tugmalar soni.", 'Клиент назвал два ограничения: число блоков и число кнопок.', 'The client named two limits: the number of blocks and of buttons.'),
      L3("Ko'pi bilan 2 ta blok, faqat bitta tugma.", 'Не больше 2 блоков, только одна кнопка.', 'At most 2 blocks, only one button.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("ko'pi bilan 2 ta blok, faqat bitta tugma", 'не больше 2 блоков, только одна кнопка', 'at most 2 blocks, only one button'),
    ok: L3("Zo'r! Ikki blok va bitta tugma. Sayt qisqa, mehmon darrov tushunadi!", 'Огонь! Два блока и одна кнопка. Сайт короткий, гость сразу всё понимает!', 'Awesome! Two blocks and one button. The site is short, and visitors get it at once!'),
    ask: L3('Chegaralarni yozing', 'Напиши ограничения', 'Write the limits')
  },
  s10: {
    eyebrow: L3('Mijoz buyurtmasi', 'Заказ клиента', 'The client’s order'),
    card: { h: L3('Mijoz xabari', 'Сообщение клиента', 'Client’s message'), t: L3("«Salom! Sayt kerak. Telefonimiz +998 99 111 22 33, manzil Sergeli 7. Chegirma yozmang, bizda yo'q. Har xil oynalar ham chiqmasin.»", '«Здравствуйте! Нужен сайт. Наш телефон +998 99 111 22 33, адрес Сергели 7. Скидок не пишите, у нас их нет. И чтобы никаких окон не выскакивало».', '“Hello! We need a site. Our phone is +998 99 111 22 33, address Sergeli 7. Don’t write discounts, we don’t have any. And no pop-up windows, please.”') },
    help: [
      L3("Mijoz xabariga va qoidalar qatoriga qarang: xabardagi har bir istak qatorga o'tadi.", 'Посмотри на сообщение клиента и строку правил: каждое желание из сообщения переходит в строку.', 'Look at the client’s message and the rules line: every wish in the message goes into the line.'),
      L3("Mijoz buyurtmasi, ya'ni mijoz o'z so'zlari bilan yozgan xabari degani. Undan majburiy va mumkin emas narsalarni topamiz.", 'Заказ клиента — это его сообщение своими словами. В нём ищем, что обязательно и что нельзя.', 'The client’s order is their message in their own words. In it we find the must-haves and the not-alloweds.'),
      L3("Do'konga ro'yxat bilan borasiz: nima olish kerak, nima kerak emas. Qoidalar ham shunday ro'yxat.", 'В магазин идёшь со списком: что купить и что не надо. Правила — такой же список.', 'You go shopping with a list: what to buy and what not to. Rules are a list like that.')
    ],
    say: L3("To'rtinchi qism: mijoz buyurtmasi. Mijozlar qoidani qator qilib yozmaydi, oddiy gapiradi. Qarang, ingliz tili kursi xabar yubordi. Undan qoidalarni topamiz.",
      'Четвёртая часть — заказ клиента. Клиенты не пишут правила строчкой, они просто говорят. Смотри, курс английского прислал сообщение. Найдём в нём правила.',
      'The fourth part: the client’s order. Clients don’t write rules as a line, they just talk. Look, an English course sent a message. Let’s find the rules in it.'),
    what: L3('Ingliz tili kursi sayti', 'Сайт курса английского', 'An English course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("12–16 yoshli o'quvchilar", 'школьники 12–16 лет', 'students aged 12–16'),
    inside: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'),
    look: L3("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    r1: L3('majburiy: telefon +998 99 111 22 33', 'обязательно: телефон +998 99 111 22 33', 'must: phone +998 99 111 22 33'),
    r2: L3('majburiy: telefon +998 99 111 22 33, manzil: Sergeli 7', 'обязательно: телефон +998 99 111 22 33, адрес: Сергели 7', 'must: phone +998 99 111 22 33, address: Sergeli 7'),
    r3: L3('majburiy: telefon +998 99 111 22 33, manzil: Sergeli 7, mumkin emas: chegirma, reklama oynasi', 'обязательно: телефон +998 99 111 22 33, адрес: Сергели 7, нельзя: скидки, рекламное окно', 'must: phone +998 99 111 22 33, address: Sergeli 7, not allowed: discount, pop-up window'),
    says: [
      L3("Xabarda telefon bor. Bu majburiy. Qatorga ko'chiramiz va sayt to'g'ri raqamni oladi.", 'В сообщении есть телефон. Это обязательно. Переносим в строку — и сайт получает правильный номер.', 'The message has a phone number. That’s a must. We copy it into the line, and the site gets the right number.'),
      L3("Manzil ham bor. Uni ham majburiy qilib yozamiz.", 'Есть и адрес. Его тоже пишем как обязательный.', 'There’s an address too. We write it as a must as well.'),
      L3("«Chegirma yozmang» va «oynalar chiqmasin» bu mumkin emas. Qarang, chegirma va oyna ketdi. Xabardagi hamma istak bajarildi!", '«Скидок не пишите» и «чтобы окон не было» — это нельзя. Смотри, скидка и окно ушли. Все пожелания из сообщения выполнены!', '“Don’t write discounts” and “no pop-up windows” are not allowed. Look, the discount and the window are gone. Every wish in the message is done!')
    ],
    done: L3("Demak, mijoz xabarini o'qiymiz va undan qoidalarni topamiz: nima majburiy, nima mumkin emas. Hech birini tashlab ketmaymiz.", 'Значит, читаем сообщение клиента и находим в нём правила: что обязательно и что нельзя. Ничего не теряем.', 'So we read the client’s message and find the rules in it: what’s a must and what’s not allowed. We don’t skip any.'),
    asks: [L3('Qarang: mijoz xabari', 'Смотри: сообщение клиента', 'Watch: the client’s message'), L3('Qarang: telefon', 'Смотри: телефон', 'Watch: the phone'),
      L3('Qarang: manzil', 'Смотри: адрес', 'Watch: the address'), L3("Qarang: chegirma va oyna yo'q", 'Смотри: ни скидки, ни окна', 'Watch: no discount, no window')],
    askDone: L3('Xabardagi istaklar qoidaga aylandi', 'Пожелания из сообщения стали правилами', 'The wishes in the message became rules')
  },
  s11: {
    eyebrow: L3('Mijoz buyurtmasi', 'Заказ клиента', 'The client’s order'),
    card: { h: L3('Lager direktori', 'Директор лагеря', 'Camp director'), t: L3("«Raqamimiz +998 95 200 30 40, uni albatta yozing. Chegirma ham, chat ham kerak emas. Saytda faqat bitta tugma bo'lsin.»", '«Наш номер +998 95 200 30 40, обязательно напишите его. Скидки и чат не нужны. На сайте только одна кнопка».', '“Our number is +998 95 200 30 40, be sure to write it. We don’t need a discount or a chat. Only one button on the site.”') },
    say: L3("Endi siz. Lager direktori xabar yubordi. Xabardan hamma qoidalarni topib, «Qoidalar?» qatoriga yozing.",
      'Теперь ты. Директор лагеря прислал сообщение. Найди в нём все правила и напиши их в строку «Какие правила?».',
      'Your turn. The camp director sent a message. Find all the rules in it and write them in the “What rules?” line.'),
    what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'),
    why: L3('bolalar lagerga yozilsin', 'чтобы дети записывались в лагерь', 'get kids to sign up for the camp'),
    who: L3('10–14 yoshli bolalar va ularning ota-onalari', 'дети 10–14 лет и их родители', 'kids aged 10–14 and their parents'),
    inside: L3('rasmlar, narxlar, aloqa', 'фото, цены, контакты', 'photos, prices, contact'),
    look: L3('quvnoq, yashil va sariq', 'весёлый, зелёный и жёлтый', 'playful, green and yellow'),
    beh: L3("tugma ustiga kelganda kattalashsin", 'кнопка увеличивается при наведении', 'the button grows on hover'),
    ph: L3("majburiy? mumkin emas?", 'обязательно? нельзя?', 'must? not allowed?'),
    msgs: {
      phone: L3("Telefon raqami yo'q yoki boshqa. Direktorning raqamini aniq yozing.", 'Номера нет или он другой. Напиши номер директора точно.', 'The number is missing or different. Write the director’s number exactly.'),
      sale: L3("Chegirma hali turibdi. Direktor: chegirma kerak emas.", 'Скидка ещё на месте. Директор: скидки не нужны.', 'The discount is still there. The director says: no discount.'),
      chat: L3("Chat hali turibdi. Direktor: chat kerak emas.", 'Чат ещё на месте. Директор: чат не нужен.', 'The chat is still there. The director says: no chat.'),
      one: L3("Tugmalar hali ko'p. Direktor: faqat bitta tugma.", 'Кнопок ещё много. Директор: только одна кнопка.', 'Still too many buttons. The director says: only one button.')
    },
    hints: [
      L3("Xabarda to'rt narsa bor: raqam, chegirma, chat va tugmalar soni.", 'В сообщении четыре вещи: номер, скидка, чат и число кнопок.', 'The message has four things: the number, the discount, the chat and the number of buttons.'),
      L3("Raqam majburiy. Chegirma va chat mumkin emas. Faqat bitta tugma.", 'Номер — обязательно. Скидка и чат — нельзя. Только одна кнопка.', 'The number is a must. The discount and chat are not allowed. Only one button.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("majburiy: telefon +998 95 200 30 40, chegirma va chat bo'lmasin, faqat bitta tugma", 'обязательно: телефон +998 95 200 30 40, без скидок и чата, только одна кнопка', 'must: phone +998 95 200 30 40, no discount or chat, only one button'),
    ok: L3("Barakalla! Raqam to'g'ri, chegirma va chat yo'q, bitta tugma. Direktor xursand!", 'Молодец! Номер правильный, ни скидки, ни чата, одна кнопка. Директор доволен!', 'Well done! The right number, no discount or chat, one button. The director is happy!'),
    ask: L3('Xabardagi qoidalarni yozing', 'Напиши правила из сообщения', 'Write the rules from the message')
  },
  g1: {
    eyebrow: L3("To'qib chiqarilgan raqam", 'Выдуманный номер', 'A made-up number'),
    card: { h: L3('Murabbiy', 'Тренер', 'Coach'), t: L3("«Bizning raqam +998 93 777 12 12. Saytda boshqa raqam yozilmasin!»", '«Наш номер +998 93 777 12 12. Другого номера на сайте быть не должно!»', '“Our number is +998 93 777 12 12. No other number on the site!”') },
    say: L3("Men klub sayti uchun «majburiy: telefon raqami» deb yozdim. Lekin raqamning o'zini yozmabman! Sun'iy intellekt raqamni o'zi to'qib chiqardi. Murabbiy nima deyapti? Qatorimni tuzating.",
      'Я написал для сайта клуба «обязательно: номер телефона». Но сам номер не написал! ИИ выдумал его сам. Что говорит тренер? Исправь мою строку.',
      'I wrote “must: phone number” for the club site. But I didn’t write the number itself! The AI made it up. What does the coach say? Fix my line.'),
    what: L3('Futbol klubimiz sayti', 'Сайт нашего футбольного клуба', 'Our football club site'),
    why: L3('bolalar klubga yozilsin', 'чтобы дети записывались в клуб', 'get kids to sign up for the club'),
    who: L3("futbolni yaxshi ko'radigan 10–12 yoshli bolalar", 'дети 10–12 лет, которые любят футбол', 'kids aged 10–12 who love football'),
    inside: L3('rasmlar, jadval, aloqa', 'фото, расписание, контакты', 'photos, schedule, contact'),
    look: L3('zamonaviy, yashil va oq', 'современный, зелёный и белый', 'modern, green and white'),
    beh: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'),
    bad: L3('majburiy: telefon raqami', 'обязательно: номер телефона', 'must: phone number'),
    ph: L3("nima majburiy?", 'что обязательно?', 'what is a must?'),
    msgs: {
      phone: L3("Raqam hali to'qib chiqarilgan. Murabbiyning raqamini aniq yozing.", 'Номер всё ещё выдуманный. Напиши номер тренера точно.', 'The number is still made up. Write the coach’s number exactly.')
    },
    hints: [
      L3("Kodining qatorida raqamning o'zi yo'q.", 'В строке Коди нет самого номера.', 'Kodi’s line doesn’t have the number itself.'),
      L3("«Telefon» so'zidan keyin murabbiyning raqamini yozing.", 'После слова «телефон» напиши номер тренера.', 'After the word “phone”, write the coach’s number.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('majburiy: telefon +998 93 777 12 12', 'обязательно: телефон +998 93 777 12 12', 'must: phone +998 93 777 12 12'),
    ok: L3("Zo'r! Endi saytda murabbiyning haqiqiy raqami. Aniq ma'lumotni sun'iy intellekt o'zi bilmaydi, uni siz yozasiz!", 'Огонь! Теперь на сайте настоящий номер тренера. Точные данные ИИ сам не знает — их пишешь ты!', 'Awesome! Now the site has the coach’s real number. The AI can’t know exact details — you write them!'),
    ask: L3('Haqiqiy raqamni yozing', 'Напиши настоящий номер', 'Write the real number')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Endi detektiv bo'lamiz. Saytga qarang: qaysi qoidalar shunday saytni berdi?", 'Теперь побудем детективами. Посмотри на сайт: какие правила дали такой сайт?', 'Let’s be detectives. Look at the site: which rules gave this site?'),
    ask: L3('Saytga qarab toping', 'Найди по сайту', 'Work it out from the site'),
    qWhich: L3("Qaysi «Qoidalar?» shu saytni berdi?", 'Какие «правила» дали этот сайт?', 'Which “What rules?” gave this site?'),
    hint1: L3("Saytda nima bor va nima yo'q: oyna, chegirma, chat, raqam?", 'Что на сайте есть и чего нет: окно, скидка, чат, номер?', 'What’s on the site and what isn’t: a window, discount, chat, number?'),
    hint2: L3("Bor narsa majburiy yoki aytilmagan. Yo'q narsa mumkin emas qilib yozilgan.", 'Что есть — обязательно или не запрещено. Чего нет — записано как «нельзя».', 'What’s there was a must or wasn’t banned. What’s missing was written as not allowed.'),
    items: [
      { rules: L3("chegirma va chat bo'lmasin", 'без скидок и чата', 'no discount or chat'),
        a: L3("reklama oynasi bo'lmasin", 'без рекламного окна', 'no pop-up window'), b: L3("chegirma va chat bo'lmasin", 'без скидок и чата', 'no discount or chat'), c: L3('hammasi tushunarli', 'и так всё понятно', 'it’s all obvious'),
        right: 'b', why: L3("Oyna bor, chegirma va chat esa yo'q. Bu B.", 'Окно есть, а скидки и чата нет. Это B.', 'The window is there, but no discount or chat. That’s B.') },
      { rules: L3("reklama oynasi, chegirma va chat bo'lmasin, majburiy: telefon +998 90 444 55 66, Telegram tugmasi", 'без рекламного окна, скидок и чата, обязательно: телефон +998 90 444 55 66, кнопка Telegram', 'no pop-up window, discount or chat, must: phone +998 90 444 55 66, a Telegram button'),
        a: L3("majburiy: telefon raqami", 'обязательно: номер телефона', 'must: phone number'), b: L3("majburiy: manzil Chilonzor 5", 'обязательно: адрес Чиланзар 5', 'must: address Chilonzor 5'),
        c: L3("reklama oynasi, chegirma va chat bo'lmasin, majburiy: telefon +998 90 444 55 66, Telegram tugmasi", 'без рекламного окна, скидок и чата, обязательно: телефон +998 90 444 55 66, кнопка Telegram', 'no pop-up window, discount or chat, must: phone +998 90 444 55 66, a Telegram button'),
        right: 'c', why: L3("Ortiqcha narsa yo'q, haqiqiy raqam va Telegram tugmasi bor. Bu C.", 'Лишнего нет, есть настоящий номер и кнопка Telegram. Это C.', 'No extras, and there’s a real number and a Telegram button. That’s C.') },
      { rules: L3("reklama oynasi, chegirma va chat bo'lmasin, faqat bitta tugma, ko'pi bilan 2 ta blok", 'без рекламного окна, скидок и чата, только одна кнопка, не больше 2 блоков', 'no pop-up window, discount or chat, only one button, at most 2 blocks'),
        a: L3("reklama oynasi, chegirma va chat bo'lmasin, faqat bitta tugma, ko'pi bilan 2 ta blok", 'без рекламного окна, скидок и чата, только одна кнопка, не больше 2 блоков', 'no pop-up window, discount or chat, only one button, at most 2 blocks'),
        b: L3("reklama oynasi bo'lmasin", 'без рекламного окна', 'no pop-up window'), c: L3("ortiqcha narsa bo'lmasin", 'ничего лишнего', 'nothing extra'),
        right: 'a', why: L3("Sayt qisqa: ikkita blok va bitta tugma, ortiqcha narsa yo'q. Bu A.", 'Сайт короткий: два блока и одна кнопка, ничего лишнего. Это A.', 'The site is short: two blocks and one button, no extras. That’s A.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Zo'r! Saytga qarab qaysi qoidalar yozilganini topasiz.", 'Класс! По сайту ты находишь, какие правила были написаны.', 'Great! You can tell from a site which rules were written.')
  },
  s12: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("Gul do'koni: «Chegirma ham, obuna oynasi ham bo'lmasin. Telefonimiz +998 97 300 40 50 albatta bo'lsin.»", 'Цветочный магазин: «Ни скидок, ни окна подписки. Наш телефон +998 97 300 40 50 — обязательно».', 'Flower shop: “No discount and no subscribe window. Our phone +998 97 300 40 50 is a must.”') },
    say: L3("Endi gul do'konini tuzatamiz! Mijoz nima xohlashini aytdi. Mening «hammasi tushunarli» qatorim o'rniga aniq qoidalarni yozing.",
      'Теперь починим цветочный магазин! Клиент сказал, чего хочет. Вместо моего «и так всё понятно» напиши точные правила.',
      'Now let’s fix the flower shop! The client said what they want. Instead of my “it’s all obvious”, write exact rules.'),
    msgs: {
      vague: L3("«Hammasi tushunarli» hali turibdi. Mijoz aytgan aniq qoidalarni yozing.", '«И так всё понятно» ещё на месте. Напиши точные правила, которые назвал клиент.', '“It’s all obvious” is still there. Write the exact rules the client named.'),
      sale: L3("Chegirma hali turibdi. Mijoz: chegirma bo'lmasin.", 'Скидка ещё на месте. Клиент: без скидок.', 'The discount is still there. The client says: no discount.'),
      popup: L3("Obuna oynasi hali turibdi. Mijoz: oyna bo'lmasin.", 'Окно подписки ещё на месте. Клиент: без окна.', 'The subscribe window is still there. The client says: no window.'),
      phone: L3("Raqam yo'q yoki boshqa. Mijozning raqamini aniq yozing.", 'Номера нет или он другой. Напиши номер клиента точно.', 'The number is missing or different. Write the client’s number exactly.')
    },
    hints: [
      L3("Mijoz uch narsa aytdi: chegirma, oyna va telefon.", 'Клиент назвал три вещи: скидку, окно и телефон.', 'The client named three things: the discount, the window and the phone.'),
      L3("«Hammasi tushunarli» ni o'chiring. Chegirma va obuna oynasi bo'lmasin, telefon raqami majburiy.", 'Сотри «и так всё понятно». Без скидок и окна подписки, номер телефона — обязательно.', 'Delete “it’s all obvious”. No discount or subscribe window, the phone number is a must.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("chegirma va obuna oynasi bo'lmasin, majburiy: telefon +998 97 300 40 50", 'без скидок и окна подписки, обязательно: телефон +998 97 300 40 50', 'no discount or subscribe window, must: phone +998 97 300 40 50'),
    ok: L3("Ajoyib! Chegirma va oyna yo'q, raqam haqiqiy. Mijoz endi xursand!", 'Класс! Ни скидки, ни окна, номер настоящий. Теперь клиент доволен!', 'Great! No discount, no window, and the number is real. The client is happy now!'),
    ask: L3("«Hammasi tushunarli» ni tuzating", 'Исправь «и так всё понятно»', 'Fix “it’s all obvious”')
  },
  s13: {
    eyebrow: L3("To'liq qoidalar", 'Все правила', 'All the rules'),
    card: { h: BUY, t: L3("Gitara kursi: «Telefon +998 91 600 70 80 va Telegram tugmasi albatta bo'lsin. Chat va chegirma bo'lmasin. Ko'pi bilan 3 ta blok.»", 'Курс гитары: «Телефон +998 91 600 70 80 и кнопка Telegram — обязательно. Без чата и скидок. Не больше 3 блоков».', 'Guitar course: “The phone +998 91 600 70 80 and a Telegram button are a must. No chat and no discount. At most 3 blocks.”') },
    say: L3("Endi to'liq qoidalarni yozasiz: majburiy, mumkin emas va chegara. Gitara kursi xabarini o'qing.", 'Теперь полные правила: обязательно, нельзя и ограничение. Прочитай сообщение курса гитары.', 'Now write the full rules: must have, not allowed and a limit. Read the guitar course’s message.'),
    what: L3('Gitara kursi sayti', 'Сайт курса гитары', 'A guitar course site'),
    why: L3("o'quvchilar kursga yozilsin", 'чтобы школьники записывались на курс', 'get students to sign up for the course'),
    who: L3("11–15 yoshli o'quvchilar", 'школьники 11–15 лет', 'students aged 11–15'),
    inside: L3('jadval, narxlar, ustozlar, sharhlar, aloqa', 'расписание, цены, наставники, отзывы, контакты', 'schedule, prices, coaches, reviews, contact'),
    look: L3("zamonaviy, to'q sariq va oq", 'современный, оранжевый и белый', 'modern, orange and white'),
    beh: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'),
    ph: L3('majburiy, mumkin emas, chegara', 'обязательно, нельзя, ограничение', 'must, not allowed, limit'),
    msgs: {
      phone: L3("Telefon raqami yo'q yoki boshqa. Kursning raqamini aniq yozing.", 'Номера нет или он другой. Напиши номер курса точно.', 'The number is missing or different. Write the course’s number exactly.'),
      tg: L3("Telegram tugmasi yo'q. Kurs: Telegram tugmasi albatta bo'lsin.", 'Нет кнопки Telegram. Курс: кнопка Telegram обязательно.', 'There’s no Telegram button. The course says: a Telegram button is a must.'),
      no: L3("Chat yoki chegirma hali turibdi. Kurs: ular bo'lmasin.", 'Чат или скидка ещё на месте. Курс: их быть не должно.', 'The chat or the discount is still there. The course says: no chat, no discount.'),
      max: L3("Bloklar hali ko'p. Kurs: ko'pi bilan 3 ta blok.", 'Блоков ещё много. Курс: не больше 3 блоков.', 'Still too many blocks. The course says: at most 3 blocks.')
    },
    hints: [
      L3("Xabarda uch xil qoida bor: majburiy, mumkin emas va chegara.", 'В сообщении три вида правил: обязательно, нельзя и ограничение.', 'The message has three kinds of rules: must, not allowed and a limit.'),
      L3("Ularni vergul bilan ketma-ket yozing.", 'Напиши их через запятую.', 'Write them one after another with commas.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("majburiy: telefon +998 91 600 70 80, Telegram tugmasi, chat va chegirma bo'lmasin, ko'pi bilan 3 ta blok", 'обязательно: телефон +998 91 600 70 80, кнопка Telegram, без чата и скидок, не больше 3 блоков', 'must: phone +998 91 600 70 80, a Telegram button, no chat or discount, at most 3 blocks'),
    ok: L3("Barakalla! Hamma qoida bajarildi: raqam, Telegram, ortiqcha narsa yo'q, uchta blok!", 'Молодец! Все правила выполнены: номер, Telegram, ничего лишнего, три блока!', 'Well done! Every rule is followed: the number, Telegram, no extras, three blocks!'),
    ask: L3("To'liq qoidalarni yozing", 'Напиши все правила', 'Write all the rules')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Endi o'z saytingiz! Yettita qatorni yozing. «Qoidalar?» ga esa nima majburiy va nima mumkin emasligini yozing.",
      'А теперь твой сайт! Напиши все семь строк, а в «Какие правила?» — что обязательно и что нельзя.',
      'Now your own site! Write all seven lines, and in “What rules?” what is a must and what is not allowed.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    phLook: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    phBeh: L3("nima bo'ladi?", 'что происходит?', 'what happens?'),
    phRules: L3('majburiy? mumkin emas?', 'обязательно? нельзя?', 'must? not allowed?'),
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
      noBeh: L3("Endi «Qanday ishlaydi?» qatorini yozing: qachon, nima va nima bo'ladi?", 'Теперь напиши строку «Как ведёт себя?»: когда, что и что происходит?', 'Now write the “How it behaves?” line: when, what and what happens?'),
      beh: L3("«Qanday ishlaydi?» ga aniq holat yozing. Masalan: tugma ustiga kelganda kattalashsin.", 'В «Как ведёт себя?» напиши точный случай. Например: кнопка увеличивается при наведении.', 'In “How it behaves?” write an exact case. For example: the button grows on hover.'),
      noRules: L3("Endi «Qoidalar?» qatorini yozing: nima majburiy va nima mumkin emas?", 'Теперь напиши строку «Какие правила?»: что обязательно и что нельзя?', 'Now write the “What rules?” line: what is a must and what is not allowed?')
    },
    hints: [
      L3("Yettita savol: nima, nega, kim uchun, ichida nima, ko'rinishi, qanday ishlaydi, qoidalar.", 'Семь вопросов: что, зачем, для кого, что внутри, как выглядит, как ведёт себя, какие правила.', 'Seven questions: what, why, who for, what’s inside, how it looks, how it behaves, what rules.'),
      L3("«Qoidalar?» ga bitta majburiy va bitta mumkin emas narsa yozing.", 'В «Какие правила?» напиши одну обязательную вещь и одну запретную.', 'In “What rules?” write one must-have and one not-allowed.'),
      L3("Namunadagidek yozing va Yuborishni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · 11–13 yoshli bolalar · rasmlar, jadval, aloqa · zamonaviy, yashil va oq · tugma ustiga kelganda kattalashsin · majburiy: telefon +998 90 123 00 11, chegirma va chat bo'lmasin",
      'Сайт нашего футбольного клуба · чтобы ребята записывались · дети 11–13 лет · фото, расписание, контакты · современный, зелёный и белый · кнопка увеличивается при наведении · обязательно: телефон +998 90 123 00 11, без скидок и чата',
      'Our football club site · get kids to sign up · kids aged 11–13 · photos, schedule, contact · modern, green and white · the button grows on hover · must: phone +998 90 123 00 11, no discount or chat'),
    ok: L3("Voy, zo'r! Bu sizning yetti qatorli promptingiz. Uyga vazifada uni haqiqiy sun'iy intellektga yuborasiz.", 'Ого, классно! Это твой промпт из семи строк. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your seven-line prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun yettita qatorni yozing", 'Напиши семь строк для своего сайта', 'Write seven lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor tekshiruv. Men gap aytaman, siz tanlang: to'g'rimi yoki noto'g'rimi?", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida: majburiy, mumkin emas yoki «tushunarli» so'zi?", 'О чём фраза: об «обязательно», «нельзя» или о слове «понятно»?', 'What’s it about: must, not allowed, or the word “obvious”?'),
    hint2: L3("Esingizdami: sun'iy intellekt mijozni tanimaydi, aniq ma'lumotni siz yozasiz.", 'Вспомни: ИИ не знает клиента, точные данные пишешь ты.', 'Remember: the AI doesn’t know the client, you write the exact details.'),
    items: [
      { t: L3("«Hammasi tushunarli» desangiz, sun'iy intellekt mijozning qoidalarini biladi.", 'Если написать «и так всё понятно», ИИ узнает правила клиента.', 'If you write “it’s all obvious”, the AI knows the client’s rules.'), right: false,
        why: L3("Aslida u mijozni tanimaydi va o'zicha qo'shadi.", 'На самом деле он не знает клиента и добавляет своё.', 'Actually it doesn’t know the client and adds its own things.') },
      { t: L3("«Mumkin emas» qatoriga saytda bo'lmasligi kerak narsalarni yozamiz.", 'В «нельзя» пишем то, чего на сайте быть не должно.', 'Under “not allowed” we write what must not be on the site.'), right: true,
        why: L3("To'g'ri: masalan, chegirma yoki reklama oynasi.", 'Верно: например, скидку или рекламное окно.', 'Right: for example a discount or a pop-up window.') },
      { t: L3("Telefon raqamini yozmasangiz, sun'iy intellekt uni o'zi to'qib chiqarishi mumkin.", 'Если не написать номер телефона, ИИ может его выдумать.', 'If you don’t write the phone number, the AI may make it up.'), right: true,
        why: L3("To'g'ri: aniq ma'lumotni o'zingiz yozing.", 'Верно: точные данные пиши сам.', 'Right: write the exact details yourself.') },
      { t: L3("«Ortiqcha narsa bo'lmasin» bu aniq qoida.", '«Ничего лишнего» — это точное правило.', '“Nothing extra” is a precise rule.'), right: false,
        why: L3("Aslida nima ortiqcha ekanini sun'iy intellekt bilmaydi.", 'На самом деле ИИ не знает, что для тебя лишнее.', 'Actually the AI doesn’t know what’s extra for you.') },
      { t: L3("Mijozning xabaridan qoidalarni topib, promptga yozamiz.", 'Правила находим в сообщении клиента и пишем в промпт.', 'We find the rules in the client’s message and write them in the prompt.'), right: true,
        why: L3("To'g'ri: har bir istak qoidaga aylanadi.", 'Верно: каждое пожелание становится правилом.', 'Right: every wish becomes a rule.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz qoidalarni aniq yozasiz.", 'Всё верно! Ты пишешь правила точно.', 'All correct! You write rules precisely.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Men sun'iy intellekt nima mumkin emasligini o'zi biladi deb o'ylagandim. Lekin u mijozni tanimaydi! Chegirma yo'qligini, haqiqiy telefon raqamini, oyna kerak emasligini faqat siz bilasiz. Shuning uchun qoidalarni aniq yozamiz. Men adashibman.",
        'Вернёмся к загадке. Я думал, ИИ сам знает, что нельзя. Но он не знает клиента! Что скидок нет, какой настоящий номер, что окно не нужно — знаешь только ты. Поэтому правила пишем точно. Я ошибся.',
        'Back to the riddle. I thought the AI knows by itself what isn’t allowed. But it doesn’t know the client! That there are no discounts, the real phone number, that no window is wanted — only you know that. So we write rules precisely. I was wrong.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning yetti qatorli promptingiz va saytingiz.", 'Смотри, это твой промпт из семи строк и твой сайт.', 'Look, this is your seven-line prompt and your site.'), k: 'own' },
      { text: L3("Oldingi oltita savol sizga tanish.", 'Первые шесть вопросов ты уже знаешь.', 'You already know the first six questions.'), k: 'what' },
      { text: L3("«Qoidalar?» bu majburiy, mumkin emas va chegaralar. Ularni mijozning xabaridan topamiz.", '«Какие правила?» — это обязательно, нельзя и ограничения. Их находим в сообщении клиента.', '“What rules?” is must have, not allowed and limits. We find them in the client’s message.'), k: 'rules' },
      { text: L3("Uyga vazifa: promptingizni nusxalab, haqiqiy sun'iy intellektga yuboring. Keyingi darsda sun'iy intellekt natijasini qanday yaxshilashni o'rganamiz. Ko'rishguncha!",
        'Домашнее задание: скопируй свой промпт и отправь настоящему ИИ. На следующем уроке научимся улучшать результат ИИ. До встречи!',
        'Homework: copy your prompt and send it to a real AI. Next lesson we’ll learn how to improve the AI’s result. See you!') }
    ],
    roles: { what: L3("aniq narsa: do'kon, klub, kurs", 'конкретная вещь: магазин, клуб, курс', 'a specific thing: shop, club, course'), why: L3('maqsad: sayt nima qilsin', 'цель: что сделает сайт', 'the goal: what the site should do'),
      who: L3("auditoriya: yoshi, kimligi, nimani yaxshi ko'radi", 'аудитория: возраст, кто они, что любят', 'the audience: age, who they are, what they love'),
      in: L3("bloklar: qaysi, qanday tartibda", 'блоки: какие, в каком порядке', 'blocks: which, in what order'),
      look: L3('uslub, ranglar, burchaklar, shrift', 'стиль, цвета, углы, шрифт', 'style, colours, corners, font'),
      beh: L3("qachon, nima, nima bo'ladi", 'когда, что, что происходит', 'when, what, what happens'),
      rules: L3('majburiy, mumkin emas, chegaralar', 'обязательно, нельзя, ограничения', 'must have, not allowed, limits') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring va saytingizni yarating.", 'Отправь свой промпт настоящему ИИ и сделай свой сайт.', 'Send your prompt to a real AI and make your site.'),
    ask: L3('Promptingiz va saytingizga qarang', 'Посмотри на свой промпт и сайт', 'Look at your prompt and your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, rules: 1, right: 1, opts: 1, type: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:ai6-screens.jsx@*/

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
/*@FILE:ai6.css@*/
`;
