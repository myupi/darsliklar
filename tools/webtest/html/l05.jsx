// =============================================================================
// ТЕСТЫ К УРОКУ 5 КУРСА HTML «Изображения» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: опечатка в имени файла — сломанная картинка; имя файла — в src; alt описывает картинку словами;
// у img нет закрывающего тега, файл — в src; картинка из интернета — с https://.
// Словарь урока 5: rasm, manba, muqobil matn, buzilgan rasm belgisi. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'izobrazheniya';
const QS = [
  { id: 'html-05t1', target: 'html-05', ptype: 'HTML', tag: 'src', correct: 0,
    vis: (L) => { const T = aqL(L); const h = `<h2>${T('Bizning sher', 'Наш лев', 'Our lion')}</h2>\n<img src="shr.png" alt="${T('Sher', 'Лев', 'Lion')}">`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Rasm o'rniga kichkina belgi va «Sher» yozuvi chiqdi.", q: "Nega rasm ochilmadi?", opts: ['Fayl nomida harf tushib qolgan', 'alt atributi ortiqcha', '</img> yozilmagan', 'Rasm juda katta'],
      ok: "Qoyil! Fayl sher.png deb nomlangan, kodda esa shr.png. Brauzer faylni harfma-harf qidiradi va topolmaydi.", hint: "src atributidagi nomni diqqat bilan o'qing. Fayl qanday nomlangan bo'lishi mumkin?", alt: "Buzilgan rasm belgisi bor sahifa" },
    ru: { ctx: 'Вместо картинки — маленький значок и надпись «Лев».', q: 'Почему картинка не открылась?', opts: ['В имени файла пропала буква', 'Атрибут alt лишний', 'Не написан </img>', 'Картинка слишком большая'],
      ok: 'Здорово! Файл называется sher.png, а в коде — shr.png. Браузер ищет файл буква в букву и не находит.', hint: 'Внимательно прочитай имя в атрибуте src. Как мог называться файл?', alt: 'Страница со значком сломанной картинки' },
    en: { ctx: 'Instead of a picture there’s a small icon and the word “Lion”.', q: 'Why didn’t the picture open?', opts: ['A letter is missing in the file name', 'The alt attribute is extra', '</img> isn’t written', 'The picture is too big'],
      ok: 'Nice work! The file is called sher.png, but the code says shr.png. The browser looks for the file letter by letter and can’t find it.', hint: 'Read the name in the src attribute carefully. What might the file be called?', alt: 'A page with a broken picture icon' } },
  { id: 'html-05t2', target: 'html-05', ptype: 'HTML', tag: 'src', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<img ___="pingvin.png" alt="${T('Pingvin', 'Пингвин', 'Penguin')}">`} />; },
    uz: { ctx: "Pingvin rasmi sahifada chiqishi kerak.", q: "Bo'sh joyga qaysi atribut yoziladi?", opts: ['href', 'alt', 'src', 'title'],
      ok: "To'ppa-to'g'ri! src — source so'zidan olingan, ya'ni manba degani: rasm faylining nomi shu yerda turadi.", hint: "Qaysi atribut brauzerga rasm faylini ko'rsatadi? href havolada edi, alt esa rasmni so'z bilan aytadi.", alt: "Atribut nomi bo'sh rasm kodi" },
    ru: { ctx: 'Картинка с пингвином должна появиться на странице.', q: 'Какой атрибут пишется на пустое место?', opts: ['href', 'alt', 'src', 'title'],
      ok: 'Верно! src — от слова source, то есть источник: здесь стоит имя файла картинки.', hint: 'Какой атрибут показывает браузеру файл картинки? href был у ссылки, а alt описывает картинку словами.', alt: 'Код картинки с пустым именем атрибута' },
    en: { ctx: 'The penguin picture must appear on the page.', q: 'Which attribute goes in the empty spot?', opts: ['href', 'alt', 'src', 'title'],
      ok: 'Right! src comes from source: this is where the picture file name goes.', hint: 'Which attribute points the browser to the picture file? href was for links, and alt describes the picture in words.', alt: 'Picture code with an empty attribute name' } },
  { id: 'html-05t3', target: 'html-05', ptype: 'HTML', tag: 'alt', correct: 1,
    vis: (L) => { const T = aqL(L); const h = `<img src="it.png" alt="${T('Kulayotgan it', 'Весёлая собака', 'A happy dog')}">\n<img src="mushk.png" alt="${T('Uxlayotgan mushuk', 'Спящая кошка', 'A sleeping cat')}">`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Ikkinchi rasm ochilmadi, uning o'rnida yozuv turibdi.", q: "alt atributi nimaga kerak?", opts: ["Rasmni chiroyli qiladi", "Rasmni so'z bilan tasvirlaydi", 'Rasmni havolaga aylantiradi', 'Rasmni kattalashtirib beradi'],
      ok: "Xuddi shunday! alt — muqobil matn: rasm ochilmasa, uning o'rnida chiqadi, ko'zi ojiz odamlarga esa dastur uni o'qib beradi.", hint: "Ochilmagan rasm o'rnida nima ko'rinyapti? Bu yozuv kodning qayeridan olingan?", alt: "Bitta rasm ochilgan, ikkinchisi o'rnida yozuv" },
    ru: { ctx: 'Вторая картинка не открылась, на её месте надпись.', q: 'Зачем нужен атрибут alt?', opts: ['Делает картинку красивой', 'Описывает картинку словами', 'Превращает картинку в ссылку', 'Увеличивает картинку'],
      ok: 'Именно! alt — запасной текст: он появляется, если картинка не открылась, а незрячим его читает вслух программа.', hint: 'Что видно на месте неоткрывшейся картинки? Откуда в коде взялась эта надпись?', alt: 'Одна картинка открылась, на месте второй — надпись' },
    en: { ctx: 'The second picture didn’t open; there’s text in its place.', q: 'What is the alt attribute for?', opts: ['Makes the picture pretty', 'Describes the picture in words', 'Turns the picture into a link', 'Makes the picture bigger'],
      ok: 'Exactly! alt is backup text: it shows if the picture doesn’t open, and a program reads it aloud to blind people.', hint: 'What is shown where the picture didn’t open? Where in the code does that text come from?', alt: 'One picture opened, text in place of the second' } },
  { id: 'html-05t4', target: 'html-05', ptype: 'HTML', tag: 'img', correct: 3, mono: true,
    uz: { ctx: "Sahifada mushuk rasmi chiqishi kerak.", q: "Qaysi qator rasmni ko'rsatadi?", opts: ['<img>mushuk.png</img>', '<img href="mushuk.png">', '<img alt="mushuk.png">', '<img src="mushuk.png">'],
      ok: "Juda zo'r! img tegining yopuvchi tegi yo'q, fayl nomi esa src atributida turadi.", hint: "Fayl nomi teglar o'rtasida turadimi yoki atributdami? Qaysi atribut rasm faylini ko'rsatadi?", alt: "Rasm kodining to'rtta varianti" },
    ru: { ctx: 'На странице должна появиться картинка с кошкой.', q: 'Какая строка покажет картинку?', opts: ['<img>mushuk.png</img>', '<img href="mushuk.png">', '<img alt="mushuk.png">', '<img src="mushuk.png">'],
      ok: 'Отлично! У тега img нет закрывающего тега, а имя файла стоит в атрибуте src.', hint: 'Имя файла стоит между тегами или в атрибуте? Какой атрибут показывает файл картинки?', alt: 'Четыре варианта кода картинки' },
    en: { ctx: 'A cat picture must appear on the page.', q: 'Which line shows the picture?', opts: ['<img>mushuk.png</img>', '<img href="mushuk.png">', '<img alt="mushuk.png">', '<img src="mushuk.png">'],
      ok: 'Great! The img tag has no closing tag, and the file name goes in the src attribute.', hint: 'Does the file name go between tags or in an attribute? Which attribute points to the picture file?', alt: 'Four versions of picture code' } },
  { id: 'html-05t5', target: 'html-05', ptype: 'HTML', tag: 'https', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<img src="rasmlar.uz/tog.jpg" alt="${T("Tog'", 'Гора', 'Mountain')}">`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Internetdagi saytdan rasm qo'ydik, lekin u ochilmadi.", q: "Manzilga nima yetishmayapti?", opts: ['alt atributi', 'Yopuvchi teg', 'Boshida https://', 'Fayl nomidagi nuqta'],
      ok: "To'ppa-to'g'ri! https:// siz brauzer rasmni o'z saytidan qidiradi va topolmaydi.", hint: "Internetdagi sayt manzili nimadan boshlanadi? Havolalar darsi esingizdami?", alt: "Ochilmagan rasm va uning manzili" },
    ru: { ctx: 'Поставили картинку с сайта в интернете, но она не открылась.', q: 'Чего не хватает в адресе?', opts: ['Атрибута alt', 'Закрывающего тега', 'https:// в начале', 'Точки в имени файла'],
      ok: 'Верно! Без https:// браузер ищет картинку на своём сайте и не находит.', hint: 'С чего начинается адрес сайта в интернете? Вспомни урок про ссылки.', alt: 'Неоткрывшаяся картинка и её адрес' },
    en: { ctx: 'We added a picture from a website, but it didn’t open.', q: 'What is missing in the address?', opts: ['The alt attribute', 'A closing tag', 'https:// at the start', 'The dot in the file name'],
      ok: 'Right! Without https:// the browser looks for the picture on its own site and can’t find it.', hint: 'What does a website address start with? Remember the lesson about links.', alt: 'A picture that didn’t open and its address' } }
];
