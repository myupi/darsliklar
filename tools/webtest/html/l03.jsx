// =============================================================================
// ТЕСТЫ К УРОКУ 3 КУРСА HTML «Списки» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: номера в ol ставит браузер (не писать руками); каждый пункт — свой li; ol — когда порядок важен;
// у ul — точки; ul — когда порядок не важен.
// Словарь урока 3: nuqtali ro'yxat (ul), raqamli ro'yxat (ol), band (li). Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'spiski';
const QS = [
  { id: 'html-03t1', target: 'html-03', ptype: 'HTML', tag: 'ol', correct: 1,
    vis: (L) => { const T = aqL(L); const a = T("Uyg'onaman", 'Просыпаюсь', 'Wake up'); const b = T('Yuvinaman', 'Умываюсь', 'Wash'); const c = T('Nonushta qilaman', 'Завтракаю', 'Have breakfast');
      const h = `<ol>\n  <li>1. ${a}</li>\n  <li>2. ${b}</li>\n  <li>3. ${c}</li>\n</ol>`; return <WqVis code={h} mark={[2, 3, 4]} html={h} />; },
    uz: { ctx: "Ertalabki qadamlar ro'yxatida raqamlar ikki marta chiqibdi.", q: "Nega shunday bo'ldi?", opts: ['ol tegi yopilmagan', "Raqamlarni qo'lda ham yozibdi", "li o'rniga ul yozilgan", 'Brauzer adashib qoldi'],
      ok: "To'ppa-to'g'ri! Raqamli ro'yxatda raqamlarni brauzer o'zi qo'yadi. Qo'lda yozilgan raqam ikkinchi marta chiqadi.", hint: "Har bir li ichida nima yozilgan? Raqamlarni yana kim qo'yishi mumkin?", alt: "Raqamlari ikki marta chiqqan ro'yxat" },
    ru: { ctx: 'В списке утренних дел номера вышли дважды.', q: 'Почему так получилось?', opts: ['Тег ol не закрыт', 'Номера ещё и написаны руками', 'Вместо li написан ul', 'Браузер ошибся'],
      ok: 'Верно! В нумерованном списке номера ставит сам браузер. Номер, написанный руками, выходит второй раз.', hint: 'Что написано внутри каждого li? Кто ещё может ставить номера?', alt: 'Список, где номера вышли дважды' },
    en: { ctx: 'In the morning list the numbers showed up twice.', q: 'Why did that happen?', opts: ['The ol tag isn’t closed', 'The numbers are also typed by hand', 'ul is written instead of li', 'The browser made a mistake'],
      ok: 'Right! In a numbered list the browser adds the numbers itself. A number typed by hand shows up a second time.', hint: 'What is written inside each li? Who else could be adding numbers?', alt: 'A list where the numbers appear twice' } },
  { id: 'html-03t2', target: 'html-03', ptype: 'HTML', tag: 'li', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<ul>\n  <li>${T('Daftar', 'Тетрадь', 'Notebook')}</li>\n  ${T('Ruchka', 'Ручка', 'Pen')}\n  <li>${T("Chizg'ich", 'Линейка', 'Ruler')}</li>\n</ul>`; return <WqVis code={h} mark={[3]} html={h} />; },
    uz: { ctx: "Maktab sumkasi ro'yxatida bitta bandda nuqta yo'q.", q: "Qaysi teg tushib qolibdi?", opts: ['<ul>', '<ol>', '<p>', '<li>'],
      ok: "Qoyil! Har bir band o'zining li tegida turadi. li siz matn ro'yxat bandi bo'lmaydi, shuning uchun nuqtasi ham yo'q.", hint: "Nuqtali bandlar qaysi teg ichida turibdi? «Ruchka» so'zi esa nimaning ichida?", alt: "Bitta bandi nuqtasiz ro'yxat" },
    ru: { ctx: 'В списке для рюкзака у одного пункта нет точки.', q: 'Какой тег потерялся?', opts: ['<ul>', '<ol>', '<p>', '<li>'],
      ok: 'Здорово! Каждый пункт живёт в своём теге li. Без li текст — не пункт списка, поэтому и точки нет.', hint: 'В каком теге стоят пункты с точками? А внутри чего слово «Ручка»?', alt: 'Список, где у одного пункта нет точки' },
    en: { ctx: 'In the school bag list one item has no dot.', q: 'Which tag is missing?', opts: ['<ul>', '<ol>', '<p>', '<li>'],
      ok: 'Nice work! Every item lives in its own li tag. Without li, text isn’t a list item, so it gets no dot.', hint: 'Which tag holds the items with dots? And what is the word “Pen” inside?', alt: 'A list where one item has no dot' } },
  { id: 'html-03t3', target: 'html-03', ptype: 'HTML', tag: 'ol-ul', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<___>\n  <li>${T('Tuxumni chaqing', 'Разбей яйца', 'Crack the eggs')}</li>\n  <li>${T("Un qo'shing", 'Добавь муку', 'Add flour')}</li>\n  <li>${T("Pechga qo'ying", 'Поставь в духовку', 'Put it in the oven')}</li>\n</___>`} mark={[1, 5]} />; },
    uz: { ctx: "Tort retsepti: qadamlar almashsa, tort chiqmaydi.", q: "Bo'sh joylarga qaysi teg mos?", opts: ['ol', 'ul', 'li', 'p'],
      ok: "Xuddi shunday! Qadamlarning tartibi muhim, demak, raqamli ro'yxat kerak, ya'ni ol degani.", hint: "Bandlarni almashtirsangiz, ma'no buziladimi? Buzilsa, ro'yxatga raqamlar kerak.", alt: "Tegi bo'sh ro'yxat kodi" },
    ru: { ctx: 'Рецепт торта: если шаги поменять, торт не получится.', q: 'Какой тег подходит на пустые места?', opts: ['ol', 'ul', 'li', 'p'],
      ok: 'Именно! Порядок шагов важен, значит, нужен нумерованный список, то есть ol.', hint: 'Если поменять пункты местами, смысл сломается? Если да — списку нужны номера.', alt: 'Код списка с пустым тегом' },
    en: { ctx: 'A cake recipe: if you swap the steps, the cake fails.', q: 'Which tag fits the empty spots?', opts: ['ol', 'ul', 'li', 'p'],
      ok: 'Exactly! The order of the steps matters, so you need a numbered list, that is, ol.', hint: 'If you swap the items, does the meaning break? If so, the list needs numbers.', alt: 'List code with an empty tag' } },
  { id: 'html-03t4', target: 'html-03', ptype: 'HTML', tag: 'ul', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<ul>\n  <li>${T('Olma', 'Яблоко', 'Apple')}</li>\n  <li>${T('Banan', 'Банан', 'Banana')}</li>\n  <li>${T('Uzum', 'Виноград', 'Grapes')}</li>\n</ul>`} />; },
    uz: { ctx: "Brauzer bu kodni o'qiydi.", q: "Bandlarning oldida nima chiqadi?", opts: ['Raqamlar: 1, 2, 3', 'Hech narsa chiqmaydi', 'Nuqtalar', 'Harflar: a, b, c'],
      ok: "Juda zo'r! ul — nuqtali ro'yxat: har bir band oldida nuqta turadi. Raqamlarni ol beradi.", hint: "Bu ul yoki ol? Qaysi biri nuqtali, qaysi biri raqamli ro'yxat edi?", alt: "ul tegidagi ro'yxat kodi" },
    ru: { ctx: 'Браузер читает этот код.', q: 'Что появится перед пунктами?', opts: ['Номера: 1, 2, 3', 'Ничего', 'Точки', 'Буквы: a, b, c'],
      ok: 'Отлично! ul — список с точками: перед каждым пунктом стоит точка. Номера даёт ol.', hint: 'Это ul или ol? Какой из них с точками, а какой с номерами?', alt: 'Код списка в теге ul' },
    en: { ctx: 'The browser reads this code.', q: 'What will appear before the items?', opts: ['Numbers: 1, 2, 3', 'Nothing', 'Dots', 'Letters: a, b, c'],
      ok: 'Great! ul is a list with dots: there is a dot before each item. Numbers come from ol.', hint: 'Is this ul or ol? Which one has dots and which one has numbers?', alt: 'List code in a ul tag' } },
  { id: 'html-03t5', target: 'html-03', ptype: 'HTML', tag: 'ul-ol', correct: 1,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Мама' : L === 'en' ? 'Mom' : 'Oyim'} text={L === 'ru' ? '«Купи в магазине хлеб, молоко и яблоки. Что первым — неважно».' : L === 'en' ? '“Buy bread, milk and apples at the shop. The order doesn’t matter.”' : "«Do'kondan non, sut va olma olib kel. Qaysi biri birinchi — farqi yo'q.»"} />,
    uz: { ctx: "Xarid ro'yxatini sahifaga qo'yamiz.", q: "Qaysi ro'yxat mos keladi?", opts: ['ol: raqamlar kerak', "ul: tartib muhim emas", "Ro'yxat kerak emas", 'Bandlarni li siz yozamiz'],
      ok: "To'ppa-to'g'ri! Non, sut va olmaning o'rni almashsa, ma'no buzilmaydi. Demak, nuqtali ro'yxat kerak, ya'ni ul degani.", hint: "Bandlarni almashtirsangiz, biror narsa buziladimi? Oyingiz nima degan edi?", alt: "Xarid haqida xabar" },
    ru: { ctx: 'Ставим список покупок на страницу.', q: 'Какой список подходит?', opts: ['ol: нужны номера', 'ul: порядок неважен', 'Список не нужен', 'Пункты пишем без li'],
      ok: 'Верно! Если поменять хлеб, молоко и яблоки местами, смысл не сломается. Значит, список с точками — ul.', hint: 'Если поменять пункты, что-нибудь сломается? Что сказала мама?', alt: 'Сообщение про покупки' },
    en: { ctx: 'We put a shopping list on the page.', q: 'Which list fits?', opts: ['ol: numbers needed', 'ul: order doesn’t matter', 'No list needed', 'Write items without li'],
      ok: 'Right! Swapping bread, milk and apples doesn’t break the meaning. So it’s a list with dots, ul.', hint: 'If you swap the items, does anything break? What did Mom say?', alt: 'A message about shopping' } }
];
