// =============================================================================
// ТЕСТЫ К УРОКУ 5 КУРСА HTML (часть 1 урока 3) «Списки: ul, ol и li» (27.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: у ul — точки; каждый пункт — свой li; ol даёт номера; номера в ol считает браузер (новый пункт — всё пересчитывается);
// номер, вписанный руками, выходит второй раз.
// Словарь урока: nuqtali ro'yxat (ul), raqamli ro'yxat (ol), band (li). Апостроф — только ASCII «'».
// Из прежнего l03: t4 → 1, t2 → 2, t1 → 5; новые — 3 и 4.
// =============================================================================
const SLUG = 'spiski';
const QS = [
  { id: 'html-03q1t1', target: 'html-03q1', ptype: 'HTML', tag: 'ul', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<ul>\n  <li>${T('Olma', 'Яблоко', 'Apple')}</li>\n  <li>${T('Banan', 'Банан', 'Banana')}</li>\n  <li>${T('Uzum', 'Виноград', 'Grapes')}</li>\n</ul>`} />; },
    uz: { ctx: "Brauzer bu kodni o'qiydi.", q: "Bandlarning oldida nima chiqadi?", opts: ['Raqamlar: 1, 2, 3', 'Hech narsa chiqmaydi', 'Nuqtalar', 'Harflar: a, b, c'],
      ok: "Juda zo'r! ul — nuqtali ro'yxat: har bir band oldida nuqta turadi. Raqamlarni ol beradi.", hint: "Bu ul yoki ol? Qaysi biri nuqtali, qaysi biri raqamli ro'yxat edi?", alt: "ul tegidagi ro'yxat kodi" },
    ru: { ctx: 'Браузер читает этот код.', q: 'Что появится перед пунктами?', opts: ['Номера: 1, 2, 3', 'Ничего', 'Точки', 'Буквы: a, b, c'],
      ok: 'Отлично! ul — список с точками: перед каждым пунктом стоит точка. Номера даёт ol.', hint: 'Это ul или ol? Какой из них с точками, а какой с номерами?', alt: 'Код списка в теге ul' },
    en: { ctx: 'The browser reads this code.', q: 'What will appear before the items?', opts: ['Numbers: 1, 2, 3', 'Nothing', 'Dots', 'Letters: a, b, c'],
      ok: 'Great! ul is a list with dots: there is a dot before each item. Numbers come from ol.', hint: 'Is this ul or ol? Which one has dots and which one has numbers?', alt: 'List code in a ul tag' } },
  { id: 'html-03q1t2', target: 'html-03q1', ptype: 'HTML', tag: 'li', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<ul>\n  <li>${T('Daftar', 'Тетрадь', 'Notebook')}</li>\n  ${T('Ruchka', 'Ручка', 'Pen')}\n  <li>${T("Chizg'ich", 'Линейка', 'Ruler')}</li>\n</ul>`; return <WqVis code={h} mark={[3]} html={h} />; },
    uz: { ctx: "Maktab sumkasi ro'yxatida bitta bandda nuqta yo'q.", q: "Qaysi teg tushib qolibdi?", opts: ['<ul>', '<ol>', '<p>', '<li>'],
      ok: "Qoyil! Har bir band o'zining li tegida turadi. li siz matn ro'yxat bandi bo'lmaydi, shuning uchun nuqtasi ham yo'q.", hint: "Nuqtali bandlar qaysi teg ichida turibdi? «Ruchka» so'zi esa nimaning ichida?", alt: "Bitta bandi nuqtasiz ro'yxat" },
    ru: { ctx: 'В списке для рюкзака у одного пункта нет точки.', q: 'Какой тег потерялся?', opts: ['<ul>', '<ol>', '<p>', '<li>'],
      ok: 'Здорово! Каждый пункт живёт в своём теге li. Без li текст — не пункт списка, поэтому и точки нет.', hint: 'В каком теге стоят пункты с точками? А внутри чего слово «Ручка»?', alt: 'Список, где у одного пункта нет точки' },
    en: { ctx: 'In the school bag list one item has no dot.', q: 'Which tag is missing?', opts: ['<ul>', '<ol>', '<p>', '<li>'],
      ok: 'Nice work! Every item lives in its own li tag. Without li, text isn’t a list item, so it gets no dot.', hint: 'Which tag holds the items with dots? And what is the word “Pen” inside?', alt: 'A list where one item has no dot' } },
  { id: 'html-03q1t3', target: 'html-03q1', ptype: 'HTML', tag: 'ol', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<ol>\n  <li>${T("Batareya qo'ying", 'Вставь батарейку', 'Insert the battery')}</li>\n  <li>${T('Tugmani bosing', 'Нажми кнопку', 'Press the button')}</li>\n  <li>${T('Robot yuradi', 'Робот идёт', 'The robot walks')}</li>\n</ol>`; return <WqVis html={h} />; },
    uz: { ctx: "Sahifada qadamlar 1, 2, 3 raqamlari bilan chiqdi.", q: "Raqamlarni qaysi teg qo'ygan?", opts: ['<ol>', '<ul>', '<li>', '<p>'],
      ok: "Aynan shunday! Raqamli ro'yxatni ol tegi yasaydi. Nuqtalarni esa ul beradi.", hint: "Nuqtali ro'yxatni qaysi teg yasaydi? Raqamli ro'yxatni-chi?", alt: "Raqamli ro'yxat tushirilgan sahifa" },
    ru: { ctx: 'На странице шаги вышли с номерами 1, 2, 3.', q: 'Какой тег поставил номера?', opts: ['<ol>', '<ul>', '<li>', '<p>'],
      ok: 'Именно так! Нумерованный список делает тег ol. А точки даёт ul.', hint: 'Какой тег делает список с точками? А с номерами?', alt: 'Страница с нумерованным списком' },
    en: { ctx: 'On the page the steps came out numbered 1, 2, 3.', q: 'Which tag added the numbers?', opts: ['<ol>', '<ul>', '<li>', '<p>'],
      ok: 'Exactly! The ol tag makes a numbered list. Dots come from ul.', hint: 'Which tag makes a list with dots? And which one with numbers?', alt: 'A page with a numbered list' } },
  { id: 'html-03q1t4', target: 'html-03q1', ptype: 'HTML', tag: 'ol-count', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<ol>\n  <li>${T("Qismlarni yig'ing", 'Собери детали', 'Assemble the parts')}</li>\n  <li>${T('Simlarni ulang', 'Соедини провода', 'Connect the wires')}</li>\n  <li>${T("Batareya qo'ying", 'Вставь батарейку', 'Insert the battery')}</li>\n</ol>`; return <WqVis code={h} mark={[3]} html={h} />; },
    uz: { ctx: "Qadamlar ro'yxatining o'rtasiga yangi band qo'shdik.", q: "Raqamlar bilan nima bo'ladi?", opts: ["Yangi raqamni qo'lda yozamiz", "Eski raqamlar o'zgarmay qoladi", "Brauzer o'zi qayta sanaydi", "Raqam o'rniga nuqta chiqadi"],
      ok: "Qoyil! Raqamlarni brauzer o'zi sanaydi. Band qo'shsangiz yoki olib tashlasangiz, qolganlari o'zi qayta raqamlanadi.", hint: "Raqamlarni kim qo'yadi: Siz yoki brauzer? Sahifada yangi bandning raqami nechta?", alt: "O'rtasiga band qo'shilgan raqamli ro'yxat" },
    ru: { ctx: 'В середину списка шагов мы добавили новый пункт.', q: 'Что станет с номерами?', opts: ['Номер придётся писать руками', 'Остальные номера не изменятся', 'Браузер сам пересчитает', 'Вместо номеров будут точки'],
      ok: 'Здорово! Номера считает браузер. Добавишь или уберёшь пункт, остальные пересчитаются сами.', hint: 'Кто ставит номера: ты или браузер? Какой номер у нового пункта на странице?', alt: 'Нумерованный список с пунктом посередине' },
    en: { ctx: 'We added a new item in the middle of the list of steps.', q: 'What happens to the numbers?', opts: ['You type the new number by hand', 'The old numbers stay the same', 'The browser renumbers them', 'Dots appear instead of numbers'],
      ok: 'Great job! The browser does the counting. Add or remove an item and the rest renumber themselves.', hint: 'Who adds the numbers: you or the browser? What number does the new item get on the page?', alt: 'A numbered list with an item in the middle' } },
  { id: 'html-03q1t5', target: 'html-03q1', ptype: 'HTML', tag: 'ol', correct: 1,
    vis: (L) => { const T = aqL(L); const a = T("Uyg'onaman", 'Просыпаюсь', 'Wake up'); const b = T('Yuvinaman', 'Умываюсь', 'Wash'); const c = T('Nonushta qilaman', 'Завтракаю', 'Have breakfast');
      const h = `<ol>\n  <li>1. ${a}</li>\n  <li>2. ${b}</li>\n  <li>3. ${c}</li>\n</ol>`; return <WqVis code={h} mark={[2, 3, 4]} html={h} />; },
    uz: { ctx: "Ertalabki qadamlar ro'yxatida raqamlar ikki marta chiqibdi.", q: "Nega shunday bo'ldi?", opts: ['ol tegi yopilmagan', "Raqamlarni qo'lda ham yozibdi", "li o'rniga ul yozilgan", 'Brauzer adashib qoldi'],
      ok: "To'ppa-to'g'ri! Raqamli ro'yxatda raqamlarni brauzer o'zi qo'yadi. Qo'lda yozilgan raqam ikkinchi marta chiqadi.", hint: "Har bir li ichida nima yozilgan? Raqamlarni yana kim qo'yishi mumkin?", alt: "Raqamlari ikki marta chiqqan ro'yxat" },
    ru: { ctx: 'В списке утренних дел номера вышли дважды.', q: 'Почему так получилось?', opts: ['Тег ol не закрыт', 'Номера ещё и написаны руками', 'Вместо li написан ul', 'Браузер ошибся'],
      ok: 'Верно! В нумерованном списке номера ставит сам браузер. Номер, написанный руками, выходит второй раз.', hint: 'Что написано внутри каждого li? Кто ещё может ставить номера?', alt: 'Список, где номера вышли дважды' },
    en: { ctx: 'In the morning list the numbers showed up twice.', q: 'Why did that happen?', opts: ['The ol tag isn’t closed', 'The numbers are also typed by hand', 'ul is written instead of li', 'The browser made a mistake'],
      ok: 'Right! In a numbered list the browser adds the numbers itself. A number typed by hand shows up a second time.', hint: 'What is written inside each li? Who else could be adding numbers?', alt: 'A list where the numbers appear twice' } }
];
