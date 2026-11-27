// =============================================================================
// ТЕСТЫ К УРОКУ 6 КУРСА HTML (часть 2 урока 3) «ul или ol: свой список» (27.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: выбор ul или ol по смыслу (поменять пункты местами — ломается ли смысл); новый пункт — свой li внутри списка;
// порядок мест (рейтинг) — нумерованный; список с точками в нумерованный меняют только внешним тегом.
// Словарь урока: nuqtali ro'yxat (ul), raqamli ro'yxat (ol), band (li). Апостроф — только ASCII «'».
// Из прежнего l03: t5 → 1, t3 → 3; новые — 2, 4 и 5.
// =============================================================================
const SLUG = 'spiski';
const QS = [
  { id: 'html-03q2t1', target: 'html-03q2', ptype: 'HTML', tag: 'ul-ol', correct: 1,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Мама' : L === 'en' ? 'Mom' : 'Oyim'} text={L === 'ru' ? '«Купи в магазине хлеб, молоко и яблоки. Что первым — неважно».' : L === 'en' ? '“Buy bread, milk and apples at the shop. The order doesn’t matter.”' : "«Do'kondan non, sut va olma olib kel. Qaysi biri birinchi — farqi yo'q.»"} />,
    uz: { ctx: "Xarid ro'yxatini sahifaga qo'yamiz.", q: "Qaysi ro'yxat mos keladi?", opts: ['ol: raqamlar kerak', "ul: tartib muhim emas", "Ro'yxat kerak emas", 'Bandlarni li siz yozamiz'],
      ok: "To'ppa-to'g'ri! Non, sut va olmaning o'rni almashsa, ma'no buzilmaydi. Demak, nuqtali ro'yxat kerak, ya'ni ul degani.", hint: "Bandlarni almashtirsangiz, biror narsa buziladimi? Oyingiz nima degan edi?", alt: "Xarid haqida xabar" },
    ru: { ctx: 'Ставим список покупок на страницу.', q: 'Какой список подходит?', opts: ['ol: нужны номера', 'ul: порядок неважен', 'Список не нужен', 'Пункты пишем без li'],
      ok: 'Верно! Если поменять хлеб, молоко и яблоки местами, смысл не сломается. Значит, список с точками — ul.', hint: 'Если поменять пункты, что-нибудь сломается? Что сказала мама?', alt: 'Сообщение про покупки' },
    en: { ctx: 'We put a shopping list on the page.', q: 'Which list fits?', opts: ['ol: numbers needed', 'ul: order doesn’t matter', 'No list needed', 'Write items without li'],
      ok: 'Right! Swapping bread, milk and apples doesn’t break the meaning. So it’s a list with dots, ul.', hint: 'If you swap the items, does anything break? What did Mom say?', alt: 'A message about shopping' } },
  { id: 'html-03q2t2', target: 'html-03q2', ptype: 'HTML', tag: 'li-add', correct: 3,
    vis: (L) => { const T = aqL(L); const h = `<ul>\n  <li>${T('Qizil', 'Красный', 'Red')}</li>\n  <li>${T("Ko'k", 'Синий', 'Blue')}</li>\n  <li>${T('Yashil', 'Зелёный', 'Green')}</li>\n</ul>`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Sevimli ranglar ro'yxatiga yana bitta band qo'shamiz: sariq.", q: "Yangi bandni qayerga yozamiz?", opts: ["</ul> dan keyin, alohida matn qilib", "ul tegidan oldin, ro'yxat tepasiga", "Oxirgi li ichiga, vergul qo'yib yozamiz", "ul ichiga, o'zining li tegi bilan"],
      ok: "Aniq! Har bir yangi band ul ichida, o'zining li tegida turadi. li ni ro'yxatdan tashqariga qo'ymaymiz.", hint: "Hozirgi bandlar qayerda turibdi? Yangisi ham ularga o'xshab qayerda turishi kerak?", alt: "Uchta bandli nuqtali ro'yxat" },
    ru: { ctx: 'Добавим в список любимых цветов ещё один пункт: жёлтый.', q: 'Куда напишем новый пункт?', opts: ['После </ul>, отдельным текстом', 'Перед ul, над списком', 'Внутрь последнего li, через запятую', 'Внутрь ul, в свой тег li'],
      ok: 'Точно! Каждый новый пункт стоит внутри ul в своём теге li. li за пределы списка не выносим.', hint: 'Где стоят сегодняшние пункты? Где должен стоять новый, как и они?', alt: 'Список с точками из трёх пунктов' },
    en: { ctx: 'We add one more item to the list of favorite colors: yellow.', q: 'Where do we write the new item?', opts: ['After </ul>, as separate text', 'Before ul, above the list', 'Inside the last li, after a comma', 'Inside ul, in its own li tag'],
      ok: 'Exactly! Every new item goes inside ul, in its own li tag. We never put li outside the list.', hint: 'Where do the current items sit? Where should the new one sit, like them?', alt: 'A dotted list with three items' } },
  { id: 'html-03q2t3', target: 'html-03q2', ptype: 'HTML', tag: 'ol-ul', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<___>\n  <li>${T('Tuxumni chaqing', 'Разбей яйца', 'Crack the eggs')}</li>\n  <li>${T("Un qo'shing", 'Добавь муку', 'Add flour')}</li>\n  <li>${T("Pechga qo'ying", 'Поставь в духовку', 'Put it in the oven')}</li>\n</___>`} mark={[1, 5]} />; },
    uz: { ctx: "Tort retsepti: qadamlar almashsa, tort chiqmaydi.", q: "Bo'sh joylarga qaysi teg mos?", opts: ['ol', 'ul', 'li', 'p'],
      ok: "Xuddi shunday! Qadamlarning tartibi muhim, demak, raqamli ro'yxat kerak, ya'ni ol degani.", hint: "Bandlarni almashtirsangiz, ma'no buziladimi? Buzilsa, ro'yxatga raqamlar kerak.", alt: "Tegi bo'sh ro'yxat kodi" },
    ru: { ctx: 'Рецепт торта: если шаги поменять, торт не получится.', q: 'Какой тег подходит на пустые места?', opts: ['ol', 'ul', 'li', 'p'],
      ok: 'Именно! Порядок шагов важен, значит, нужен нумерованный список, то есть ol.', hint: 'Если поменять пункты местами, смысл сломается? Если да — списку нужны номера.', alt: 'Код списка с пустым тегом' },
    en: { ctx: 'A cake recipe: if you swap the steps, the cake fails.', q: 'Which tag fits the empty spots?', opts: ['ol', 'ul', 'li', 'p'],
      ok: 'Exactly! The order of the steps matters, so you need a numbered list, that is, ol.', hint: 'If you swap the items, does the meaning break? If so, the list needs numbers.', alt: 'List code with an empty tag' } },
  { id: 'html-03q2t4', target: 'html-03q2', ptype: 'HTML', tag: 'ul-rank', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<ul>\n  <li>Minecraft</li>\n  <li>Roblox</li>\n  <li>FIFA</li>\n</ul>`; return <WqVis html={h} />; },
    uz: { ctx: "Sinfdoshingiz o'yinlarni 1-, 2- va 3-o'rin bilan so'radi. Kodi shu ro'yxatni yozdi.", q: "Bu ro'yxat nega topshiriqqa mos emas?", opts: ["Sarlavhani p bilan yozish kerak", "li o'rniga p yozish kerak edi", "Nuqta o'rinni ko'rsatmaydi", "Bandlar kamida beshta bo'lsin"],
      ok: "To'g'ri! O'rinlar tartibi muhim bo'lsa, ol kerak: brauzer 1, 2, 3 raqamlarini o'zi qo'yadi.", hint: "Nuqtalarga qarab, qaysi o'yin birinchi ekanini ayta olasizmi? Buni qaysi ro'yxat ko'rsatadi?", alt: "Nuqtali top-3 ro'yxati" },
    ru: { ctx: 'Одноклассник попросил игры с местами: 1, 2 и 3. Коди написал такой список.', q: 'Почему этот список не подходит к заданию?', opts: ['Заголовок надо писать в p', 'Вместо li нужен тег p', 'Точки не показывают место', 'Пунктов должно быть пять'],
      ok: 'Верно! Если важен порядок мест, нужен ol: номера 1, 2, 3 браузер поставит сам.', hint: 'Можешь ли ты по точкам сказать, какая игра первая? Какой список это покажет?', alt: 'Список топ-3 с точками' },
    en: { ctx: 'A classmate asked for games with places: 1st, 2nd and 3rd. Kodi wrote this list.', q: 'Why doesn’t this list fit the task?', opts: ['The heading should be a p', 'Use p instead of li', 'Dots don’t show places', 'There should be five items'],
      ok: 'Right! If the order of places matters, you need ol: the browser adds the numbers 1, 2, 3 itself.', hint: 'Can you tell from the dots which game is first? Which list would show that?', alt: 'A top 3 list with dots' } },
  { id: 'html-03q2t5', target: 'html-03q2', ptype: 'HTML', tag: 'ul-ol', correct: 1,
    vis: (L) => { const T = aqL(L); const h = `<ul>\n  <li>${T("Qog'ozni ikkiga buking", 'Сложи лист пополам', 'Fold the paper in half')}</li>\n  <li>${T('Qanotlarini buking', 'Загни крылья', 'Fold the wings')}</li>\n  <li>${T('Samolyotni uchiring', 'Запусти самолётик', 'Launch the plane')}</li>\n</ul>`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Kodi qadamlar ro'yxatini ul bilan yozdi, sahifada nuqtalar chiqdi. Raqamlar kerak edi.", q: "Kodda nimani almashtiramiz?", opts: ["Har bir li ni ol ga almashtiramiz", "Faqat ul va /ul ni ol va /ol ga", "Raqamlarni har bir li ichiga yozamiz", "li larni o'chirib, faqat ol qoldiramiz"],
      ok: "Aynan! Faqat o'rab turgan tegni almashtiramiz, li lar o'z joyida qoladi. Raqamlarni brauzer o'zi qo'yadi.", hint: "Nuqtani nima beradi: li mi yoki uni o'rab turgan teg? Bandlarning o'zi o'zgaradimi?", alt: "Qadamlar nuqtali ro'yxatda" },
    ru: { ctx: 'Коди написал шаги в ul, и на странице вышли точки. А нужны были номера.', q: 'Что заменим в коде?', opts: ['Каждый li заменим на ol', 'Только ul и /ul на ol и /ol', 'Номера впишем внутрь каждого li', 'Уберём все li и оставим один ol'],
      ok: 'Точно! Заменяем только внешний тег, а li остаются на месте. Номера поставит браузер.', hint: 'Что даёт точку: li или тег, который его обнимает? Меняются ли сами пункты?', alt: 'Шаги в списке с точками' },
    en: { ctx: 'Kodi wrote the steps in ul, and the page shows dots. But numbers were needed.', q: 'What do we replace in the code?', opts: ['Replace every li with ol', 'Only ul and /ul with ol and /ol', 'Type the numbers inside every li', 'Remove all li and leave one ol'],
      ok: 'Exactly! We replace only the outer tag, and the li items stay put. The browser adds the numbers.', hint: 'What gives the dot: li or the tag that wraps it? Do the items themselves change?', alt: 'Steps in a list with dots' } }
];
