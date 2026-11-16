// =============================================================================
// ТЕСТЫ К УРОКУ 3 КУРСА CSS «Цвета» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: dark… — темнее (названия цветов); hex — «#» и шесть знаков; rgb: красный + зелёный — жёлтый;
// rgb из трёх 255 — белый; опечатка в названии (gren) — браузер цвет не знает. hsl в уроке только назван — его нет.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — код и/или честная страница (WqVis).
// =============================================================================
const SLUG = 'cveta';
// Короткая страница: style и теги — один и тот же текст для редактора и для честного браузера.
const c3Mini = (css, body) => `<style>\n${css.split('\n').map((l) => '  ' + l).join('\n')}\n</style>\n${body}`;
const QS = [
  { id: 'css-03t1', target: 'css-03', ptype: 'CSS', tag: 'nom', correct: 2, mono: true,
    vis: () => <WqVis code={`h1 {\n  color: ___;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Sarlavha oddiy ko'kdan to'qroq bo'lishi kerak.", q: "Bo'sh joyga qaysi rang nomi yoziladi?", opts: ['lightblue', 'blue-dark', 'darkblue', 'blue'],
      ok: "To'ppa-to'g'ri! dark so'zi rangni to'qroq qiladi, light esa ochroq. Ikkalasi ham nom oldidan, chiziqchasiz yoziladi.", hint: "Ochroq rang uchun light qo'shiladi. To'qroq uchun qaysi so'z va u qayerda turadi?", alt: "Rangi bo'sh qolgan h1 qoidasi" },
    ru: { ctx: 'Заголовок должен быть темнее обычного синего.', q: 'Какое название цвета пишется на пустое место?', opts: ['lightblue', 'blue-dark', 'darkblue', 'blue'],
      ok: 'Верно! Слово dark делает цвет темнее, а light — светлее. Оба пишутся перед названием, без дефиса.', hint: 'Для светлого добавляют light. А какое слово для тёмного и где оно стоит?', alt: 'Правило h1 с пустым цветом' },
    en: { ctx: 'The heading should be darker than plain blue.', q: 'Which colour name goes in the empty spot?', opts: ['lightblue', 'blue-dark', 'darkblue', 'blue'],
      ok: 'Right! The word dark makes a colour darker, light makes it lighter. Both go before the name, with no dash.', hint: 'For lighter you add light. Which word is for darker, and where does it go?', alt: 'An h1 rule with an empty colour' } },
  { id: 'css-03t2', target: 'css-03', ptype: 'CSS', tag: 'hex', correct: 2,
    vis: () => <WqVis code={`h1 { color: FA4F28; }\nh2 { color: #FA4F2; }\nh3 { color: #FA4F28; }\np { color: #FA-4F-28; }`} file="style.css" />,
    uz: { ctx: "Palitradan logotip rangini to'rt xil ko'chirib yozishdi.", q: "Qaysi qatordagi rang ishlaydi?", opts: ['1-qatordagi', '2-qatordagi', '3-qatordagi', '4-qatordagi'],
      ok: "Qoyil! hex kod panjara belgisi va oltita belgidan iborat bo'ladi, o'rtasida chiziqcha yo'q.", hint: "Har bir qatorni sanab chiqing: boshida panjara belgisi bormi? Belgilar nechta? Ortiqcha narsa yo'qmi?", alt: "To'rt xil yozilgan hex kod" },
    ru: { ctx: 'Цвет логотипа из палитры переписали четырьмя способами.', q: 'В какой строке цвет работает?', opts: ['В строке 1', 'В строке 2', 'В строке 3', 'В строке 4'],
      ok: 'Здорово! Hex-код — это решётка и шесть знаков, без дефисов между ними.', hint: 'Проверь каждую строку: есть ли в начале решётка? Сколько знаков? Нет ли лишнего?', alt: 'Hex-код, записанный четырьмя способами' },
    en: { ctx: 'The logo colour from the palette was copied four ways.', q: 'On which line does the colour work?', opts: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
      ok: 'Nice work! A hex code is a hash and six characters, with no dashes in between.', hint: 'Check each line: is there a hash at the start? How many characters? Anything extra?', alt: 'A hex code written four ways' } },
  { id: 'css-03t3', target: 'css-03', ptype: 'CSS', tag: 'rgb', correct: 3,
    vis: () => <WqVis code={`h1 {\n  color: rgb(255, 255, 0);\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Qizil nur va yashil nur to'liq yonib turibdi, ko'k nur o'chgan.", q: "Sarlavha qanday rangda bo'ladi?", opts: ['Qizil', 'Yashil', 'Oq', 'Sariq'],
      ok: "Xuddi shunday! Qizil va yashil nur birga sariq rang beradi.", hint: "rgb dagi uchta son — qizil, yashil va ko'k nurlar. Qaysilari yonib turibdi? Ular qo'shilsa nima chiqadi?", alt: "rgb(255, 255, 0) bilan h1 qoidasi" },
    ru: { ctx: 'Красный и зелёный лучи горят на полную, синий выключен.', q: 'Каким цветом будет заголовок?', opts: ['Красным', 'Зелёным', 'Белым', 'Жёлтым'],
      ok: 'Именно! Красный и зелёный лучи вместе дают жёлтый.', hint: 'Три числа в rgb — красный, зелёный и синий лучи. Какие горят? Что получится, если их сложить?', alt: 'Правило h1 с rgb(255, 255, 0)' },
    en: { ctx: 'The red and green beams are on full, the blue one is off.', q: 'What colour will the heading be?', opts: ['Red', 'Green', 'White', 'Yellow'],
      ok: 'Exactly! Red and green beams together make yellow.', hint: 'The three numbers in rgb are the red, green and blue beams. Which are on? What do they make together?', alt: 'An h1 rule with rgb(255, 255, 0)' } },
  { id: 'css-03t4', target: 'css-03', ptype: 'CSS', tag: 'rgb', correct: 1, mono: true,
    vis: () => <WqVis code={`body {\n  background-color: ___;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Sahifa foni oppoq bo'lishi kerak.", q: "Bo'sh joyga qaysi kod yoziladi?", opts: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
      ok: "Juda zo'r! Uchala nur ham to'liq yonsa — oq. Hammasi o'chsa — qora.", hint: "0 — nur o'chgan, 255 — to'liq yongan. Oq rang uchun nurlar qanday bo'lishi kerak?", alt: "Fon rangi bo'sh qolgan body qoidasi" },
    ru: { ctx: 'Фон страницы должен быть белым.', q: 'Какой код пишется на пустое место?', opts: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
      ok: 'Отлично! Все три луча на полную — белый. Все выключены — чёрный.', hint: '0 — луч выключен, 255 — горит на полную. Какими должны быть лучи для белого?', alt: 'Правило body с пустым цветом фона' },
    en: { ctx: 'The page background should be white.', q: 'Which code goes in the empty spot?', opts: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
      ok: 'Great! All three beams on full make white. All off make black.', hint: '0 means the beam is off, 255 means it is on full. What should the beams be for white?', alt: 'A body rule with an empty background colour' } },
  { id: 'css-03t5', target: 'css-03', ptype: 'CSS', tag: 'buzuq', correct: 0,
    vis: (L) => { const T = aqL(L); const src = c3Mini('p { color: gren; }', `<h1>${T('Kodi bog\'i', 'Сад Коди', 'Kodi garden')}</h1>\n<p>${T('Bu yerda daraxtlar ko\'p.', 'Здесь много деревьев.', 'There are many trees here.')}</p>`); return <WqVis code={src} html={src} mark={[2]} />; },
    uz: { ctx: "Abzas yashil bo'lishi kerak edi, lekin qora qoldi.", q: "Qoida nega ishlamayapti?", opts: ["gren degan rang yo'q: green kerak", 'Rang nomi katta harf bilan yoziladi', "Rang nomi qo'shtirnoqda bo'ladi", "color o'rniga background-color kerak"],
      ok: "Ana, tuzoq shu yerda ekan! Brauzer gren degan rangni bilmaydi, shuning uchun qoidani o'tkazib yuboradi.", hint: "Rang nomini harfma-harf o'qib chiqing. Yashil rang inglizcha qanday yoziladi?", alt: "Qora qolgan abzas va uning qoidasi" },
    ru: { ctx: 'Абзац должен был стать зелёным, но остался чёрным.', q: 'Почему правило не работает?', opts: ['Цвета gren нет: нужно green', 'Название цвета пишут с большой', 'Название цвета берут в кавычки', 'Нужен background-color'],
      ok: 'Вот где ловушка! Браузер не знает цвета gren, поэтому пропускает правило.', hint: 'Прочитай название цвета по буквам. Как пишется зелёный по-английски?', alt: 'Чёрный абзац и его правило' },
    en: { ctx: 'The paragraph should have turned green, but it stayed black.', q: 'Why doesn’t the rule work?', opts: ['There is no colour gren: use green', 'Colour names need a capital', 'Colour names go in quotes', 'It needs background-color'],
      ok: 'That’s the trap! The browser doesn’t know the colour gren, so it skips the rule.', hint: 'Read the colour name letter by letter. How is green spelled?', alt: 'A black paragraph and its rule' } }
];
