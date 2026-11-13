// =============================================================================
// ТЕСТЫ К УРОКУ 6 МОДУЛЯ «ИИ» «Как дать ИИ точные требования?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: точное правило вместо «hammasi tushunarli»; без правил ИИ сам добавляет окно, скидку и чат («Taxmin»);
// правила из сообщения клиента (majburiy с настоящим номером, mumkin emas); номер без цифр — догадка ИИ; ограничения
// (одна кнопка, не больше N блоков) по сайту.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'tochnye-trebovaniya';
const QS = [
  { id: 'ai-06t1', target: 'ai-06', tag: 'aniq-qoida', correct: 2,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T("Gul do'koni sayti", 'Сайт цветочного магазина', 'A flower shop site') }, { q: 1, t: T('odamlar buyurtma qilsin', 'чтобы люди заказывали', 'get people to order') }, { q: 6, t: null }]} />; },
    uz: { ctx: "Mijoz: obuna oynasi, chegirma va chat kerak emas.", q: "«Qoidalar?» qatoriga qaysi biri aniqroq?", opts: ['hammasi tushunarli', "saytda ortiqcha va keraksiz narsalar bo'lmasin", 'mumkin emas: obuna oynasi, chegirma, chat', "mijozga yoqadigan yaxshi sayt bo'lsin"],
      ok: "Nima bo'lmasligi nomi bilan aytilgan. Sun'iy intellekt ularning birortasini ham qo'shmaydi.", hint: "Qaysi javobda aniq narsalar nomi bor? «Tushunarli» va «ortiqcha» sun'iy intellektga hech narsa demaydi.", alt: "«Qoidalar?» qatori bo'sh prompt" },
    ru: { ctx: 'Клиент: окно подписки, скидка и чат не нужны.', q: 'Что точнее подходит в строку «Какие правила?»?', opts: ['всё понятно', 'чтобы на сайте не было лишнего и ненужного', 'нельзя: окно подписки, скидка, чат', 'чтобы сайт был хорошим и понравился клиенту'],
      ok: 'То, чего быть не должно, названо по имени. ИИ не добавит ничего из этого.', hint: 'В каком ответе вещи названы по имени? «Понятно» и «лишнее» ничего не говорят ИИ.', alt: 'Промпт с пустой строкой «Какие правила?»' },
    en: { ctx: 'Client: no subscription pop-up, no discount, no chat.', q: 'Which fits the “What rules?” line best?', opts: ['it’s all clear', 'nothing extra or unneeded on the site', 'not allowed: subscription pop-up, discount, chat', 'a good site the client will like'],
      ok: 'What must not be there is named. The AI won’t add any of it.', hint: 'Which answer names actual things? “Clear” and “extra” tell the AI nothing.', alt: 'A prompt with an empty “What rules?” line' } },

  { id: 'ai-06t2', target: 'ai-06', tag: 'ozicha', correct: 1,
    // Как крючок урока 6: «hammasi tushunarli» — ИИ сам добавил окно, «−50%», чат и выдумал телефон.
    vis: (L) => { const T = aqL(L); const G = T('Taxmin', 'Догадка', 'Guess'); return <AqSite site={{
      title: T("Gul do'koni", 'Цветочный магазин', 'Flower shop'), em: '🌷', c: '#DB2777', c2: '#9D174D', bg: '#FCE7F3',
      nav: [T('Guldastalar', 'Букеты', 'Bouquets'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guldastalar', 'Новые букеты', 'New bouquets'), sub: T('Har kuni yangi gullar!', 'Свежие цветы каждый день!', 'Fresh flowers every day!'), cta: T('Buyurtma berish', 'Заказать', 'Order'),
      info: [{ t: '📞 +998 00 000 00 00', guess: G }],
      extras: { popup: T("Obuna bo'ling!", 'Подпишись!', 'Subscribe!'), sale: '−50%', chat: true },
      marks: { extras: { t: G, c: '#475569' }, hero: { t: G, c: '#475569' } },
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Promptda «Qoidalar?» — «hammasi tushunarli».", q: "Nega saytda chegirma, obuna oynasi va chat paydo bo'ldi?", opts: ["Mijoz ularni sotuv uchun o'zi so'ragan", "Qoidalar aniq yozilmagan, sun'iy intellekt o'zicha qo'shdi", "Ular har bir saytda albatta bo'lishi shart", 'Sayt eskirib qolgan, shuning uchun yangilandi'],
      ok: "Sun'iy intellekt mijozni tanimaydi. Qoidalar aniq bo'lmasa, o'zicha qo'shadi. Kerak bo'lmasa: «mumkin emas: obuna oynasi, chegirma, chat».", hint: "«Hammasi tushunarli» sun'iy intellektga nima mumkin emasligini aytdimi? «Taxmin» belgilariga qarang.", alt: "Obuna oynasi, −50% va chat qo'shilgan sayt" },
    ru: { ctx: 'В промпте «Какие правила?» — «всё понятно».', q: 'Почему на сайте появились скидка, окно подписки и чат?', opts: ['Их сам попросил клиент, чтобы больше продавать', 'Правила не написаны точно, ИИ добавил сам', 'Они обязательно должны быть на каждом сайте', 'Сайт устарел, поэтому его обновили'],
      ok: 'ИИ не знает клиента. Если правила не точные, он добавляет от себя. Не нужно — пиши: «нельзя: окно подписки, скидка, чат».', hint: 'Сказало ли «всё понятно» ИИ, чего нельзя? Посмотри на метки «Догадка».', alt: 'Сайт с окном подписки, −50% и чатом' },
    en: { ctx: 'The “What rules?” line says “it’s all clear”.', q: 'Why did a discount, a pop-up and a chat appear on the site?', opts: ['The client asked for them to sell more', 'The rules weren’t exact, so the AI added them itself', 'Every single site must have them', 'The site was outdated, so it got updated'],
      ok: 'The AI doesn’t know the client. If the rules aren’t exact, it adds things itself. If they’re not wanted, write: “not allowed: subscription pop-up, discount, chat”.', hint: 'Did “it’s all clear” tell the AI what is not allowed? Look at the “Guess” tags.', alt: 'A site with a pop-up, −50% and a chat' } },

  { id: 'ai-06t3', target: 'ai-06', tag: 'mijoz-qoidalari', correct: 0,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mijoz', 'Клиент', 'Client')} text={T('«Telefonimiz +998 90 123 45 67. Biz chegirma qilmaymiz.»', '«Наш телефон +998 90 123 45 67. Скидок мы не делаем».', '“Our phone is +998 90 123 45 67. We don’t do discounts.”')} />; },
    uz: { ctx: "Kafe mijozining xabarini o'qing.", q: 'Bu xabardan qaysi qoidalar chiqadi?', opts: ['majburiy: telefon +998 90 123 45 67; mumkin emas: chegirma', 'majburiy: chegirma; mumkin emas: telefon', 'majburiy: telefon raqami; mumkin emas: chegirma', 'mijoz hammasini aytdi, hammasi tushunarli'],
      ok: "Mijozda ikki qoida bor: raqam albatta bo'lsin, chegirma bo'lmasin. Raqam ham aniq yozilgan.", hint: "Xabarda nima albatta bo'lishi va nima bo'lmasligi aytilgan? Raqamning o'zini ham unutmang.", alt: 'Mijozning xabari' },
    ru: { ctx: 'Прочитай сообщение клиента кафе.', q: 'Какие правила следуют из этого сообщения?', opts: ['обязательно: телефон +998 90 123 45 67; нельзя: скидки', 'обязательно: скидки; нельзя: телефон', 'обязательно: номер телефона; нельзя: скидки', 'клиент всё сказал, всё понятно'],
      ok: 'У клиента два правила: номер обязательно, скидок нет. И сам номер написан точно.', hint: 'Что в сообщении должно быть обязательно, а чего быть не должно? Не забудь сам номер.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the cafe client’s message.', q: 'Which rules come from this message?', opts: ['required: phone +998 90 123 45 67; not allowed: discounts', 'required: discounts; not allowed: phone', 'required: a phone number; not allowed: discounts', 'the client said it all, it’s all clear'],
      ok: 'The client has two rules: the number must be there, discounts must not. And the number itself is written exactly.', hint: 'What must be there and what must not, according to the message? Don’t forget the number itself.', alt: 'The client’s message' } },

  { id: 'ai-06t4', target: 'ai-06', tag: 'raqamsiz', correct: 3,
    vis: (L) => { const T = aqL(L); const G = T('Taxmin', 'Догадка', 'Guess'); return <AqSite site={{
      title: T('Basketbol klubi', 'Баскетбольный клуб', 'Basketball club'), em: '🏀', c: '#EA580C', c2: '#C2410C', bg: '#FFEDD5', focus: '.info',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Murabbiy', 'Тренер', 'Coach'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi mavsum', 'Новый сезон', 'New season'), sub: T("Biz bilan o'ynang!", 'Играй с нами!', 'Play with us!'), cta: T("Qo'ng'iroq qilish", 'Позвонить', 'Call'),
      info: [{ t: '📞 +998 11 222 33 44', guess: G }],
      marks: { info: { t: T('Qoidalar?', 'Какие правила?', 'What rules?'), c: '#BE123C' } },
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Promptda «Qoidalar?» — «majburiy: telefon raqami».", q: "Nega telefon yonida «Taxmin» turibdi?", opts: ["Telefon saytda bo'lishi mumkin emas", 'Raqam juda uzun, sayt uni qisqartirdi', "Bunday saytlar telefonni ko'rsatmaydi", "Raqamning o'zi yozilmagan, sun'iy intellekt uni o'ylab topdi"],
      ok: "Sun'iy intellekt murabbiyning raqamini bilmaydi. Haqiqiy raqamni qoidaga o'zingiz yozasiz: «majburiy: telefon +998 …».", hint: "Promptda raqamning o'zi bormi yoki faqat «telefon raqami» degan so'z?", alt: "Telefon yonida «Taxmin» belgisi bor sayt" },
    ru: { ctx: 'В промпте «Какие правила?» — «обязательно: номер телефона».', q: 'Почему рядом с телефоном стоит «Догадка»?', opts: ['Телефона на сайте быть не должно', 'Номер слишком длинный, сайт его сократил', 'Такие сайты не показывают телефон', 'Сам номер не написан, ИИ его придумал'],
      ok: 'ИИ не знает номер тренера. Настоящий номер пишешь в правило сам: «обязательно: телефон +998 …».', hint: 'В промпте есть сам номер или только слова «номер телефона»?', alt: 'Сайт с меткой «Догадка» у телефона' },
    en: { ctx: 'The “What rules?” line says “required: a phone number”.', q: 'Why is there a “Guess” tag next to the phone?', opts: ['A phone isn’t allowed on the site', 'The number is too long, so the site shortened it', 'Sites like this don’t show phones', 'The number itself wasn’t written, so the AI made it up'],
      ok: 'The AI doesn’t know the coach’s number. You write the real number in the rule yourself: “required: phone +998 …”.', hint: 'Does the prompt have the number itself, or just the words “a phone number”?', alt: 'A site with a “Guess” tag next to the phone' } },

  { id: 'ai-06t5', target: 'ai-06', tag: 'chegara', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T("Rasmlar ko'rgazmasi", 'Выставка рисунков', 'Art exhibition'), em: '🎨', c: '#7C3AED', c2: '#5B21B6', bg: '#EDE9FE', oneBtn: true, noFoot: true,
      nav: [T('Rasmlar', 'Рисунки', 'Pictures'), T('Manzil', 'Адрес', 'Address'), T('Biz haqimizda', 'О нас', 'About')],
      badge: T('Faqat 3 kun', 'Только 3 дня', 'Only 3 days'), sub: T("Bolalar rasmlari ko'rgazmasi", 'Выставка детских рисунков', 'An exhibition of kids’ drawings'), cta: T('Kelaman', 'Я приду', 'I’ll come'),
      blocks: [{ h: T('Rasmlar', 'Рисунки', 'Pictures'), items: [{ t: T("🖼️ Tog'lar", '🖼️ Горы', '🖼️ Mountains') }, { t: T('🖼️ Dengiz', '🖼️ Море', '🖼️ The sea') }, { t: T('🖼️ Shahar', '🖼️ Город', '🖼️ The city') }] },
        { h: T('Manzil', 'Адрес', 'Address'), items: [{ t: T('📍 Yunusobod, 12', '📍 Юнусабад, 12', '📍 Yunusabad, 12'), wide: true }] }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi. Tugmalar va bloklarni sanang.", q: 'Qaysi qoidalar shu saytni bergan?', opts: ['mumkin emas: chat', "faqat bitta tugma, ko'pi bilan 2 ta blok", 'majburiy: Telegram', 'hammasi tushunarli'],
      ok: "Saytda bitta tugma va ikkita blok bor. Bu chegara qoidalari: «faqat bitta tugma, ko'pi bilan 2 ta blok».", hint: "Saytdagi tugmalarni va bloklarni sanang. Qaysi qoida aynan shuni aytadi?", alt: "Bitta tugmali, ikki blokli sayt" },
    ru: { ctx: 'ИИ сделал такой сайт. Посчитай кнопки и блоки.', q: 'Какие правила дали этот сайт?', opts: ['нельзя: чат', 'только одна кнопка, не больше 2 блоков', 'обязательно: Telegram', 'всё понятно'],
      ok: 'На сайте одна кнопка и два блока. Это правила-ограничения: «только одна кнопка, не больше 2 блоков».', hint: 'Посчитай кнопки и блоки на сайте. Какое правило говорит именно это?', alt: 'Сайт с одной кнопкой и двумя блоками' },
    en: { ctx: 'The AI made this site. Count the buttons and blocks.', q: 'Which rules gave this site?', opts: ['not allowed: chat', 'only one button, no more than 2 blocks', 'required: Telegram', 'it’s all clear'],
      ok: 'The site has one button and two blocks. These are limit rules: “only one button, no more than 2 blocks”.', hint: 'Count the buttons and blocks on the site. Which rule says exactly that?', alt: 'A site with one button and two blocks' } }
];
