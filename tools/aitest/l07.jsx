// =============================================================================
// ТЕСТЫ К УРОКУ 7 МОДУЛЯ «ИИ» «Как улучшить результат ИИ?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: проверка результата по пунктам заказа и точное наблюдение; второй промпт с «qolganini o'zgartirma»;
// «что + как» (не просто «o'zgartir»); без «qolganini o'zgartirma» ИИ пишет сайт заново («O'zi o'zgartirdi»);
// после правки — снова проверка.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'uluchshit-rezultat';
const AQ7_P = { c: '#334155', bg: '#F1F5F9' };   // метки «1-prompt», «2-prompt» — тёмно-серые, как в уроке 7
const QS = [
  { id: 'ai-07t1', target: 'ai-07', tag: 'tekshirish', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Kitob klubi', 'Книжный клуб', 'Book club'), em: '📚', c: '#16A34A', c2: '#15803D', bg: '#DCFCE7',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Kitoblar', 'Книги', 'Books'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T("Har hafta uchrashuv", 'Встречи каждую неделю', 'Weekly meetings'), sub: T("Birga o'qiymiz va gaplashamiz!", 'Читаем и обсуждаем вместе!', 'We read and talk together!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      blocks: [{ h: T('Jadval', 'Расписание', 'Schedule'), items: [{ t: T('Shanba · 11:00', 'Суббота · 11:00', 'Saturday · 11:00') }, { t: T('Yakshanba · 11:00', 'Воскресенье · 11:00', 'Sunday · 11:00') }] }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Mijoz buyurtmasi: nomi, jadval, ko'k rang va narxlar.", q: 'Qaysi kuzatuv aniq?', opts: ['Sayt menga yoqmadi', "Rang ko'k emas va narxlar bloki yo'q", 'Hammasi yomon chiqdi', "Yaxshiroq bo'lishi mumkin edi"],
      ok: "Buyurtmani band-band tekshirdik: nomi bor, jadval bor, rang ko'k emas, narxlar yo'q. Muammo aniq aytilgan, endi uni tuzatish oson.", hint: "Buyurtmadagi har bir bandni saytdan qidiring. Qaysilari yo'q?", alt: "Yashil kitob klubi sayti, faqat jadval bloki bilan" },
    ru: { ctx: 'Заказ клиента: название, расписание, синий цвет и цены.', q: 'Какое наблюдение точное?', opts: ['Мне не нравится сайт', 'Цвет не синий, и нет блока цен', 'Всё получилось плохо', 'Могло быть и лучше'],
      ok: 'Мы проверили заказ по пунктам: название есть, расписание есть, цвет не синий, цен нет. Проблема названа точно — её легко исправить.', hint: 'Найди на сайте каждый пункт заказа. Каких нет?', alt: 'Зелёный сайт книжного клуба только с расписанием' },
    en: { ctx: 'The client’s order: the name, a schedule, blue colour and prices.', q: 'Which observation is exact?', opts: ['I don’t like the site', 'The colour isn’t blue and there is no prices block', 'It all came out badly', 'It could be better'],
      ok: 'We checked the order point by point: the name is there, the schedule is there, the colour isn’t blue, there are no prices. The problem is named exactly, so it’s easy to fix.', hint: 'Look for each point of the order on the site. Which ones are missing?', alt: 'A green book club site with only a schedule block' } },

  { id: 'ai-07t2', target: 'ai-07', tag: 'qolganini', correct: 2,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[Object.assign({ lab: '1-prompt', t: T('Futbol klubi sayti… (7 qator)', 'Сайт футбольного клуба… (7 строк)', 'A football club site… (7 lines)') }, AQ7_P), Object.assign({ lab: '2-prompt', t: null }, AQ7_P)]} />; },
    uz: { ctx: "Sayt mijozga yoqdi, faqat narxlar yetishmaydi.", q: "Qaysi ikkinchi prompt faqat kerakli narsani o'zgartiradi?", opts: ['yaxshiroq qil', "narxlar blokini qo'sh", "narxlar blokini qo'sh, qolganini o'zgartirma", 'saytni qaytadan yarat'],
      ok: "Nima qilish aniq aytilgan va «qolganini o'zgartirma» bor. Shunda yoqqan narsalar saqlanadi.", hint: "Qaysi promptda ham nima qilish, ham qolganini saqlash bor?", alt: "Birinchi prompt va bo'sh ikkinchi prompt" },
    ru: { ctx: 'Сайт клиенту понравился, не хватает только цен.', q: 'Какой второй промпт меняет только нужное?', opts: ['сделай лучше', 'добавь блок цен', 'добавь блок цен, остальное не меняй', 'создай сайт заново'],
      ok: 'Сказано точно, что сделать, и есть «остальное не меняй». Тогда всё, что понравилось, сохранится.', hint: 'В каком промпте есть и что сделать, и просьба сохранить остальное?', alt: 'Первый промпт и пустой второй промпт' },
    en: { ctx: 'The client liked the site; only the prices are missing.', q: 'Which second prompt changes only what’s needed?', opts: ['make it better', 'add a prices block', 'add a prices block, don’t change anything else', 'create the site again'],
      ok: 'It says exactly what to do, and it has “don’t change anything else”. Then everything the client liked stays.', hint: 'Which prompt has both what to do and a request to keep the rest?', alt: 'The first prompt and an empty second prompt' } },

  { id: 'ai-07t3', target: 'ai-07', tag: 'nima-qanday', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mijoz', 'Клиент', 'Client')} text={T("«Tugma juda kichkina. U kattaroq va qizil bo'lsin.»", '«Кнопка слишком маленькая. Пусть будет больше и красной».', '“The button is too small. Make it bigger and red.”')} />; },
    uz: { ctx: "Mijozning xabarini o'qing.", q: "Qaysi ikkinchi prompt to'g'ri?", opts: ["tugmani o'zgartir, qolganini o'zgartirma", "tugmani kattaroq va qizil qil, qolganini o'zgartirma", "tugma rangini o'zgartir, qolganini o'zgartirma", 'saytni yaxshiroq qil, tugmani ham'],
      ok: "Nima — tugma, qanday — kattaroq va qizil, qolgani esa saqlanadi. Faqat «o'zgartir» desangiz, sun'iy intellekt qanday qilishni o'zi taxmin qiladi.", hint: "Faqat «o'zgartir» desangiz, sun'iy intellekt qanday qilishni o'zi taxmin qiladi. Qaysi promptda «qanday» bor?", alt: 'Mijozning xabari' },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Какой второй промпт правильный?', opts: ['измени кнопку, остальное не меняй', 'сделай кнопку больше и красной, остальное не меняй', 'измени цвет кнопки, остальное не меняй', 'сделай сайт лучше, и кнопку тоже'],
      ok: 'Что — кнопка, как — больше и красной, а остальное сохраняется.', hint: 'Если написать только «измени», ИИ сам угадает, каким это сделать. В каком промпте есть «как»?', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'Which second prompt is right?', opts: ['change the button, don’t change anything else', 'make the button bigger and red, don’t change anything else', 'change the button colour, don’t change anything else', 'make the site better, the button too'],
      ok: 'What — the button, how — bigger and red, and the rest stays.', hint: 'If you only say “change”, the AI guesses how. Which prompt has the “how”?', alt: 'The client’s message' } },

  { id: 'ai-07t4', target: 'ai-07', tag: 'ozi-ozgartirdi', correct: 0,
    // Как s5 урока 7: «narxlar blokini qo'sh» без «qolganini o'zgartirma» — ИИ переписал сайт: свой цвет, своё название.
    vis: (L) => { const T = aqL(L); const OZ = { t: T("O'zi o'zgartirdi", 'Изменил сам', 'Changed by itself'), c: '#BE123C' }; return <AqSite site={{
      title: T("Futbol klubi — eng zo'r tanlov!", 'Футбольный клуб — лучший выбор!', 'Football club — the best choice!'), em: '⚽', c: '#9333EA', c2: '#6B21A8', bg: '#F3E8FF',
      nav: [T('Narxlar', 'Цены', 'Prices'), T('Jadval', 'Расписание', 'Schedule'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi mavsum', 'Новый сезон', 'New season'), sub: T("Biz bilan o'ynang!", 'Играй с нами!', 'Play with us!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      marks: { hero: OZ },
      blocks: [{ h: T('Narxlar', 'Цены', 'Prices'), items: [{ t: T('Bir oy', 'Месяц', 'One month'), p: T("200 000 so'm", '200 000 сум', '200,000 sum') }], mark: { t: '2-prompt', c: '#334155' } },
        { h: T('Jadval', 'Расписание', 'Schedule'), items: [{ t: T('Seshanba · 18:00', 'Вторник · 18:00', 'Tuesday · 18:00') }], mark: OZ }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Oldin sayt ko'k edi va nomi «Futbol klubi» edi. Ikkinchi prompt: «narxlar blokini qo'sh».", q: "Nega rang va nom ham o'zgarib ketdi?", opts: ["«Qolganini o'zgartirma» yozilmagan", "Narxlar juda ko'p joy oldi", "Mijoz shunday so'ragan", 'Sayt eskirib qolgan'],
      ok: "«Qolganini o'zgartirma» bo'lmasa, sun'iy intellekt saytni boshqatdan yozadi: o'z rangi, o'z nomi, boshqa tartib.", hint: "Belgilarga qarang: nimani sun'iy intellekt o'zi o'zgartirdi? Promptda bunga yo'l qo'ymaydigan so'z bormidi?", alt: "«O'zi o'zgartirdi» belgilari bor binafsha sayt" },
    ru: { ctx: 'Раньше сайт был синим и назывался «Футбольный клуб». Второй промпт: «добавь блок цен».', q: 'Почему поменялись и цвет, и название?', opts: ['Не написано «остальное не меняй»', 'Цены заняли много места', 'Так попросил клиент', 'Сайт устарел'],
      ok: 'Без «остальное не меняй» ИИ пишет сайт заново: свой цвет, своё название, другой порядок.', hint: 'Посмотри на метки: что ИИ поменял сам? Было ли в промпте слово, которое это запрещает?', alt: 'Фиолетовый сайт с метками «Изменил сам»' },
    en: { ctx: 'Before, the site was blue and called “Football club”. The second prompt: “add a prices block”.', q: 'Why did the colour and the name change too?', opts: ['“Don’t change anything else” wasn’t written', 'The prices took up too much space', 'The client asked for it', 'The site is outdated'],
      ok: 'Without “don’t change anything else”, the AI rewrites the site: its own colour, its own name, a different order.', hint: 'Look at the tags: what did the AI change by itself? Did the prompt have words that forbid this?', alt: 'A purple site with “Changed by itself” tags' } },

  { id: 'ai-07t5', target: 'ai-07', tag: 'yana-tekshir', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[Object.assign({ lab: '1-prompt', t: T('Basketbol klubi sayti… (7 qator)', 'Сайт баскетбольного клуба… (7 строк)', 'A basketball club site… (7 lines)') }, AQ7_P), Object.assign({ lab: '2-prompt', t: T("telefon raqamini +998 90 777 11 22 qil, qolganini o'zgartirma", 'поставь номер +998 90 777 11 22, остальное не меняй', 'set the phone to +998 90 777 11 22, don’t change anything else') }, AQ7_P)]} />; },
    uz: { ctx: "Ikkinchi prompt yuborildi, sun'iy intellekt saytni o'zgartirdi.", q: 'Endi nima qilamiz?', opts: ['Darhol mijozga yuborib, javobini kutamiz', "Saytni o'chirib, hammasini qaytadan boshlaymiz", "«Yaxshiroq qil» deb yana bir prompt yozamiz", 'Natijani yana buyurtma bilan band-band solishtiramiz'],
      ok: "Har bir promptdan keyin tekshiramiz. Yana nimadir yetishmasa, uchinchi prompt yozamiz.", hint: "Ikkinchi prompt hammasini tuzatdimi? Buni qanday bilamiz?", alt: 'Birinchi va ikkinchi prompt' },
    ru: { ctx: 'Второй промпт отправлен, ИИ изменил сайт.', q: 'Что делаем теперь?', opts: ['Сразу отправляем клиенту и ждём ответа', 'Удаляем сайт и начинаем всё заново', 'Пишем ещё один промпт «сделай лучше»', 'Снова сверяем результат с заказом по пунктам'],
      ok: 'После каждого промпта проверяем. Если чего-то ещё не хватает, пишем третий промпт.', hint: 'Исправил ли второй промпт всё? Как это узнать?', alt: 'Первый и второй промпт' },
    en: { ctx: 'The second prompt was sent, and the AI changed the site.', q: 'What do we do now?', opts: ['Send it to the client right away and wait', 'Delete the site and start everything again', 'Write another prompt: “make it better”', 'Check the result against the order again, point by point'],
      ok: 'We check after every prompt. If something is still missing, we write a third prompt.', hint: 'Did the second prompt fix everything? How do we find out?', alt: 'The first and second prompts' } }
];
