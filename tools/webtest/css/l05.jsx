// =============================================================================
// ТЕСТЫ К УРОКУ 5 КУРСА CSS «Текст и шрифты» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: font-size без px не действует; по центру — center (middle не работает); черту ссылки убирает
// text-decoration: none; жирный — font-weight; запасной шрифт после запятой.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — код и/или честная страница (WqVis).
// =============================================================================
const SLUG = 'tekst-i-shrifty';
// Короткая страница: style и теги — один и тот же текст для редактора и для честного браузера.
const c5Mini = (css, body) => `<style>\n${css.split('\n').map((l) => '  ' + l).join('\n')}\n</style>\n${body}`;
const QS = [
  { id: 'css-05t1', target: 'css-05', ptype: 'CSS', tag: 'font-size', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const src = c5Mini('h1 { font-size: 40; }', `<h1>${T('Kodi blogi', 'Блог Коди', 'Kodi blog')}</h1>\n<p>${T('Bugun nima o\'rgandim?', 'Что я узнал сегодня?', 'What did I learn today?')}</p>`); return <WqVis code={src} html={src} mark={[2]} />; },
    uz: { ctx: "Sarlavha 40 piksel bo'lishi kerak edi, lekin kattalashmadi.", q: "Qiymatga nima qo'shish kerak?", opts: [';', 'px', '#', '%'],
      ok: "To'ppa-to'g'ri! Son yolg'iz turmaydi: brauzer o'lchov birligini ham bilishi kerak: px.", hint: "40 nima: 40 metrmi, 40 santimetrmi? Darsda harf o'lchami qaysi birlikda yozilgan edi?", alt: "Kattalashmagan sarlavha va uning qoidasi" },
    ru: { ctx: 'Заголовок должен был стать 40 пикселей, но не вырос.', q: 'Что нужно добавить к значению?', opts: [';', 'px', '#', '%'],
      ok: 'Верно! Число не бывает само по себе: браузеру нужна единица измерения, то есть px.', hint: '40 чего: метров, сантиметров? В какой единице в уроке писали размер букв?', alt: 'Невыросший заголовок и его правило' },
    en: { ctx: 'The heading should have been 40 pixels, but it didn’t grow.', q: 'What must be added to the value?', opts: [';', 'px', '#', '%'],
      ok: 'Right! A number can’t stand alone: the browser needs a unit, that is px.', hint: '40 of what: metres, centimetres? Which unit did the lesson use for letter size?', alt: 'A heading that didn’t grow and its rule' } },
  { id: 'css-05t2', target: 'css-05', ptype: 'CSS', tag: 'text-align', correct: 3, mono: true,
    vis: () => <WqVis code={`h1 {\n  text-align: ___;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Sarlavha sahifaning o'rtasida turishi kerak.", q: "Bo'sh joyga qaysi qiymat yoziladi?", opts: ['middle', 'left', 'centre', 'center'],
      ok: "Qoyil! O'rtaga qo'yish uchun center yoziladi. middle so'zini esa brauzer tushunmaydi.", hint: "Chapga — left, o'ngga — right. O'rta uchun inglizcha qaysi so'z va u qanday yoziladi?", alt: "Qiymati bo'sh qolgan text-align qoidasi" },
    ru: { ctx: 'Заголовок должен стоять по центру страницы.', q: 'Какое значение пишется на пустое место?', opts: ['middle', 'left', 'centre', 'center'],
      ok: 'Здорово! По центру ставит center. middle браузер не понимает.', hint: 'Влево — left, вправо — right. Каким словом в CSS ставят по центру и как оно пишется?', alt: 'Правило text-align с пустым значением' },
    en: { ctx: 'The heading should be in the centre of the page.', q: 'Which value goes in the empty spot?', opts: ['middle', 'left', 'centre', 'center'],
      ok: 'Nice work! center puts it in the middle. The browser doesn’t understand middle.', hint: 'Left is left, right is right. Which word centres text in CSS, and how is it spelled there?', alt: 'A text-align rule with an empty value' } },
  { id: 'css-05t3', target: 'css-05', ptype: 'CSS', tag: 'text-decoration', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); const src = `<h1>${T('Kodi blogi', 'Блог Коди', 'Kodi blog')}</h1>\n<a href="#">${T('Hammasini o\'qish', 'Читать всё', 'Read more')}</a>`; return <WqVis code={src} html={src} mark={[2]} />; },
    uz: { ctx: "Havolaning tagidagi chiziqni olib tashlash kerak.", q: "Qaysi qoida yoziladi?", opts: ['a { text-decoration: none; }', 'a { font-weight: none; }', 'a { text-decoration: underline; }', 'a { text-align: none; }'],
      ok: "Xuddi shunday! Chiziqni text-decoration boshqaradi, none esa uni olib tashlaydi.", hint: "Tagiga chiziq qaysi xususiyatdan keladi? underline chiziq qo'yadi — olib tashlash uchun-chi?", alt: "Tagi chizilgan havola" },
    ru: { ctx: 'У ссылки нужно убрать черту снизу.', q: 'Какое правило написать?', opts: ['a { text-decoration: none; }', 'a { font-weight: none; }', 'a { text-decoration: underline; }', 'a { text-align: none; }'],
      ok: 'Именно! Черту задаёт text-decoration, а none её убирает.', hint: 'От какого свойства черта снизу? underline ставит черту, а чтобы убрать?', alt: 'Подчёркнутая ссылка' },
    en: { ctx: 'The line under the link has to go.', q: 'Which rule do we write?', opts: ['a { text-decoration: none; }', 'a { font-weight: none; }', 'a { text-decoration: underline; }', 'a { text-align: none; }'],
      ok: 'Exactly! The line comes from text-decoration, and none removes it.', hint: 'Which property gives the line underneath? underline adds it — and to remove it?', alt: 'An underlined link' } },
  { id: 'css-05t4', target: 'css-05', ptype: 'CSS', tag: 'font-weight', correct: 2, mono: true,
    vis: () => <WqVis code={`p {\n  ___: bold;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Abzas harflari qalin bo'lishi kerak.", q: "Bo'sh joyga qaysi xususiyat yoziladi?", opts: ['font-size', 'text-decoration', 'font-weight', 'font-bold'],
      ok: "Juda zo'r! font-weight harflarning qalinligini beradi: bold — qalin, normal — oddiy.", hint: "font-size — o'lcham, text-decoration — chiziq. Qalinlik uchun-chi? font-bold degan xususiyat bormi?", alt: "Xususiyati bo'sh qolgan p qoidasi" },
    ru: { ctx: 'Буквы абзаца должны быть жирными.', q: 'Какое свойство пишется на пустое место?', opts: ['font-size', 'text-decoration', 'font-weight', 'font-bold'],
      ok: 'Отлично! font-weight задаёт толщину букв: bold — жирный, normal — обычный.', hint: 'font-size — размер, text-decoration — черта. А толщина? Есть ли свойство font-bold?', alt: 'Правило p с пустым свойством' },
    en: { ctx: 'The paragraph letters should be bold.', q: 'Which property goes in the empty spot?', opts: ['font-size', 'text-decoration', 'font-weight', 'font-bold'],
      ok: 'Great! font-weight sets letter thickness: bold is thick, normal is regular.', hint: 'font-size is size, text-decoration is lines. What about thickness? Is there a font-bold property?', alt: 'A p rule with an empty property' } },
  { id: 'css-05t5', target: 'css-05', ptype: 'CSS', tag: 'font-family', correct: 1,
    vis: () => <WqVis code={`p {\n  font-family: "Courier New", monospace;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Ba'zi kompyuterlarda Courier New shrifti yo'q.", q: "Shunday kompyuterda abzas qanday ko'rinadi?", opts: ["Abzas yo'qolib qoladi", 'Brauzer monospace shriftini oladi', "Butun qoida ishlamaydi", "Sahifa bo'm-bo'sh qoladi"],
      ok: "To'ppa-to'g'ri! Verguldan keyingisi — zaxira shrift: birinchisi topilmasa, brauzer shuni oladi.", hint: "Vergul nimaga turibdi? Birinchi shrift topilmasa, brauzer qayerga qaraydi?", alt: "Ikki shriftli font-family qoidasi" },
    ru: { ctx: 'На некоторых компьютерах нет шрифта Courier New.', q: 'Как будет выглядеть абзац на таком компьютере?', opts: ['Абзац исчезнет', 'Браузер возьмёт шрифт monospace', 'Всё правило не сработает', 'Страница будет пустой'],
      ok: 'Верно! После запятой — запасной шрифт: если первого нет, браузер возьмёт его.', hint: 'Зачем стоит запятая? Куда посмотрит браузер, если первого шрифта нет?', alt: 'Правило font-family с двумя шрифтами' },
    en: { ctx: 'Some computers don’t have the Courier New font.', q: 'How will the paragraph look on such a computer?', opts: ['The paragraph disappears', 'The browser uses monospace', 'The whole rule fails', 'The page goes blank'],
      ok: 'Right! After the comma comes the backup font: if the first one is missing, the browser takes it.', hint: 'Why is the comma there? Where does the browser look if the first font is missing?', alt: 'A font-family rule with two fonts' } }
];
