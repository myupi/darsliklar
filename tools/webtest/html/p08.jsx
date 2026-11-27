// =============================================================================
// ТЕСТЫ К УРОКУ 8 КУРСА HTML «Ссылки на другие сайты» (27.11.2026) — 2-я часть старого урока 4 «Ссылки и атрибуты», 5 вопросов, по файлу на вопрос.
// Проверяем: без https:// браузер ищет файл на своём сайте; полный адрес сайта в интернете; свой файл — только имя без https://;
// какой href ведёт в интернет; текст ссылки (виден) и адрес (в href).
// Словарь: havola, manzil, qo'shtirnoq. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'ssylki-i-atributy';
const QS = [
  { id: 'html-04q2t1', target: 'html-04q2', ptype: 'HTML', tag: 'https', correct: 1,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<a href="wikipedia.org">${T('Vikipediya', 'Википедия', 'Wikipedia')}</a>`} />; },
    uz: { ctx: "Havola bosildi, lekin «Fayl topilmadi» chiqdi.", q: "Nega shunday bo'ldi?", opts: ['Havola matni juda uzun', "Boshida https:// yo'q", "href o'rniga src kerak", '</a> tegi ortiqcha'],
      ok: "Xuddi shunday! https:// siz brauzer bu nomni o'z saytidagi fayl deb o'ylaydi va topolmaydi.", hint: "Internetdagi sayt manzili nimadan boshlanadi? Brauzer bu nomni qayerdan qidiryapti?", alt: "Internetdagi saytga havola kodi" },
    ru: { ctx: 'По ссылке нажали, а там «Файл не найден».', q: 'Почему так вышло?', opts: ['Текст ссылки слишком длинный', 'В начале нет https://', 'Вместо href нужен src', 'Тег </a> лишний'],
      ok: 'Именно! Без https:// браузер думает, что это файл на своём сайте, и не находит его.', hint: 'С чего начинается адрес сайта в интернете? Где браузер ищет это имя?', alt: 'Код ссылки на сайт в интернете' },
    en: { ctx: 'The link was clicked, but it says “File not found”.', q: 'Why did that happen?', opts: ['The link text is too long', 'There’s no https:// at the start', 'It needs src instead of href', 'The </a> tag is extra'],
      ok: 'Exactly! Without https:// the browser thinks it’s a file on its own site and can’t find it.', hint: 'What does a website address on the internet start with? Where is the browser looking for this name?', alt: 'The code of a link to a website' } },
  { id: 'html-04q2t2', target: 'html-04q2', ptype: 'HTML', tag: 'https', correct: 3, mono: true,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Друг' : L === 'en' ? 'Friend' : "Do'st"} text={L === 'ru' ? '«Хочу поставить на страницу ссылку на uz.wikipedia.org: <a href="___">Википедия</a>. Что вписать в кавычки, чтобы ссылка открыла этот сайт?»' : L === 'en' ? '“I want a link to uz.wikipedia.org on my page: <a href="___">Wikipedia</a>. What goes inside the quotes so the link opens that site?”' : "«Sahifamga uz.wikipedia.org havolasini qo'ymoqchiman: <a href=\"___\">Vikipediya</a>. Qo'shtirnoq ichiga nima yozay, havola shu saytni ochsin?»"} />,
    uz: { ctx: "Do'stingiz internetdagi saytga havola yasamoqchi.", q: "Qo'shtirnoq ichiga nima yoziladi?", opts: ['wikipedia.html', 'Vikipediya', 'uz.wikipedia.org', 'https://uz.wikipedia.org'],
      ok: "To'g'ri! Internetdagi saytga havolada manzil to'liq yoziladi: https://, keyin saytning nomi.", hint: "Internetdagi sayt manzili nimadan boshlanadi? Havola matni bilan manzilni adashtirmang.", alt: "Do'stdan kelgan xabar: Vikipediyaga havola" },
    ru: { ctx: 'Твой друг хочет сделать ссылку на сайт в интернете.', q: 'Что писать в кавычках?', opts: ['wikipedia.html', 'Википедия', 'uz.wikipedia.org', 'https://uz.wikipedia.org'],
      ok: 'Верно! В ссылке на сайт в интернете адрес пишут полностью: https://, а затем имя сайта.', hint: 'С чего начинается адрес сайта в интернете? Не путай текст ссылки с адресом.', alt: 'Сообщение друга: ссылка на Википедию' },
    en: { ctx: 'Your friend wants to make a link to a website on the internet.', q: 'What goes inside the quotes?', opts: ['wikipedia.html', 'Wikipedia', 'uz.wikipedia.org', 'https://uz.wikipedia.org'],
      ok: 'Right! A link to a website on the internet needs the full address: https://, then the site name.', hint: 'What does a website address on the internet start with? Don’t mix up the link text and the address.', alt: 'A message from a friend: a link to Wikipedia' } },
  { id: 'html-04q2t3', target: 'html-04q2', ptype: 'HTML', tag: 'https', correct: 0, mono: true,
    uz: { ctx: "Sayt papkasida osh.html va mening.html fayllari bor.", q: "Qaysi qiymat havolani internetdagi saytga olib boradi?", opts: ['https://uz.wikipedia.org', 'osh.html', 'mening.html', 'uz.wikipedia.org'],
      ok: "Qoyil! Boshqa saytga faqat to'liq manzil olib boradi. Fayl nomi esa brauzerni o'z sayt papkasiga yo'naltiradi.", hint: "Qaysi qiymat sayt papkasidagi fayl nomiga o'xshaydi, qaysi biri esa boshqa saytning to'liq manzili?", alt: "Havola qiymatining to'rtta varianti" },
    ru: { ctx: 'В папке сайта лежат файлы osh.html и mening.html.', q: 'Какое значение приведёт ссылку на сайт в интернете?', opts: ['https://uz.wikipedia.org', 'osh.html', 'mening.html', 'uz.wikipedia.org'],
      ok: 'Здорово! На другой сайт ведёт только полный адрес. Имя файла отправляет браузер в папку своего сайта.', hint: 'Какое значение похоже на имя файла из папки сайта, а какое — на полный адрес другого сайта?', alt: 'Четыре варианта значения ссылки' },
    en: { ctx: 'The site folder has the files osh.html and mening.html.', q: 'Which value leads to a site on the internet?', opts: ['https://uz.wikipedia.org', 'osh.html', 'mening.html', 'uz.wikipedia.org'],
      ok: 'Nice work! Only a full address leads to another site. A file name sends the browser to its own site folder.', hint: 'Which value looks like a file name from the site folder, and which like the full address of another site?', alt: 'Four versions of a link value' } },
  { id: 'html-04q2t4', target: 'html-04q2', ptype: 'HTML', tag: 'https', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="https://mening.html">${T('Mening sahifam', 'Моя страница', 'My page')}</a></p>`; return <WqVis code={h} mark={[1]} html={h} />; },
    uz: { ctx: "Havolani bosdik, lekin sahifamiz ochilmadi. mening.html — sayt papkamizdagi fayl.", q: "Brauzer nima qilyapti?", opts: ["Havolani oddiy matn deb o'ylayapti", 'Havola matnini qidiryapti', "Internetdan «mening.html» saytini qidiryapti", 'Fayl nomini o\'zi to\'g\'rilayapti'],
      ok: "To'ppa-to'g'ri! https:// brauzerga «bu internetdagi sayt» deydi. O'z sahifamizga havolada esa faqat fayl nomi yoziladi.", hint: "https:// brauzerga nimani bildiradi: o'z papkamizdagi fayl yoki boshqa sayt?", alt: "O'z sahifasiga https:// bilan yozilgan havola" },
    ru: { ctx: 'Ссылку нажали, а наша страница не открылась. mening.html — это файл в папке нашего сайта.', q: 'Что делает браузер?', opts: ['Считает ссылку простым текстом', 'Ищет текст самой ссылки', 'Ищет в интернете сайт «mening.html»', 'Сам исправляет имя файла'],
      ok: 'Именно! https:// говорит браузеру: «это сайт в интернете». А в ссылке на свою страницу пишут только имя файла.', hint: 'Что https:// сообщает браузеру: файл в нашей папке или другой сайт?', alt: 'Ссылка на свою страницу, записанная с https://' },
    en: { ctx: 'The link was clicked, but our page didn’t open. mening.html is a file in our site folder.', q: 'What is the browser doing?', opts: ['Treating the link as plain text', 'Looking for the link text itself', 'Looking for a site “mening.html” on the internet', 'Fixing the file name on its own'],
      ok: 'Exactly! https:// tells the browser “this is a site on the internet”. A link to your own page uses just the file name.', hint: 'What does https:// tell the browser: a file in our folder or another site?', alt: 'A link to your own page written with https://' } },
  { id: 'html-04q2t5', target: 'html-04q2', ptype: 'HTML', tag: 'a', correct: 0,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="mening.html">${T('Mening sahifam', 'Моя страница', 'My page')}</a></p>`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Sahifada havola paydo bo'ldi.", q: "Foydalanuvchi sahifada qaysi so'zlarni ko'radi?", opts: ['Mening sahifam', 'mening.html', 'href', '<a>'],
      ok: "To'g'ri! Teglar orasidagi matn sahifada ko'rinadi, manzil esa href ichida yashirin turadi.", hint: "Sahifada nima yozilgan, kodda esa nima? Manzil qayerda turibdi?", alt: "Havola kodi va sahifadagi havola" },
    ru: { ctx: 'На странице появилась ссылка.', q: 'Какие слова видит человек на странице?', opts: ['Моя страница', 'mening.html', 'href', '<a>'],
      ok: 'Верно! Текст между тегами виден на странице, а адрес спрятан внутри href.', hint: 'Что написано на странице, а что — только в коде? Где лежит адрес?', alt: 'Код ссылки и ссылка на странице' },
    en: { ctx: 'A link appeared on the page.', q: 'Which words does a person see on the page?', opts: ['My page', 'mening.html', 'href', '<a>'],
      ok: 'Right! The text between the tags is shown on the page, and the address is hidden inside href.', hint: 'What is written on the page, and what is only in the code? Where does the address live?', alt: 'The link code and the link on the page' } }
];
