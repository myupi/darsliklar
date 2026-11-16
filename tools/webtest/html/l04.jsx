// =============================================================================
// ТЕСТЫ К УРОКУ 4 КУРСА HTML «Ссылки и атрибуты» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: без href ссылка — простой текст; части атрибута (имя, «=», значение); атрибут — в открывающем теге,
// значение в кавычках; адрес сайта — с https://; забытый </a> делает ссылкой хвост.
// Словарь урока 4: havola, atribut, qiymat, manzil, qo'shtirnoq. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'ssylki-i-atributy';
const QS = [
  { id: 'html-04t1', target: 'html-04', ptype: 'HTML', tag: 'href', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="sport.html">${T('Sport', 'Спорт', 'Sports')}</a></p>\n<p><a>${T("Hayvonot bog'i", 'Зоопарк', 'Zoo')}</a></p>`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Ikkinchi so'z havolaga o'xshamayapti: ko'k emas, chizig'i ham yo'q.", q: "Unga nima yetishmayapti?", opts: ['</a> tegi', '<p> tegi', 'href atributi', 'title tegi'],
      ok: "Qoyil! href atributisiz a tegi qayerga olib borishni bilmaydi, shuning uchun oddiy matn bo'lib qoladi.", hint: "Birinchi havolani ikkinchisi bilan solishtirib ko'ring: ochuvchi tegda nima farq bor?", alt: "Biri havola, biri oddiy matn bo'lgan sahifa" },
    ru: { ctx: 'Второе слово не похоже на ссылку: не синее и без подчёркивания.', q: 'Чего ему не хватает?', opts: ['Тега </a>', 'Тега <p>', 'Атрибута href', 'Тега title'],
      ok: 'Здорово! Без атрибута href тег a не знает, куда вести, поэтому остаётся простым текстом.', hint: 'Сравни первую ссылку со второй: чем отличаются открывающие теги?', alt: 'Страница: одна ссылка и один простой текст' },
    en: { ctx: 'The second word doesn’t look like a link: not blue, no underline.', q: 'What is it missing?', opts: ['The </a> tag', 'The <p> tag', 'The href attribute', 'The title tag'],
      ok: 'Nice work! Without the href attribute the a tag doesn’t know where to go, so it stays plain text.', hint: 'Compare the first link with the second: how are the opening tags different?', alt: 'A page with one link and one plain text' } },
  { id: 'html-04t2', target: 'html-04', ptype: 'HTML', tag: 'atribut', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<a href="sport.html">${T('Sport', 'Спорт', 'Sports')}</a>`} />; },
    uz: { ctx: "Atribut uch qismdan iborat: nom, «=» va qiymat.", q: "Bu koddagi href nima?", opts: ['Atributning nomi', 'Atributning qiymati', 'Tegning nomi', 'Faylning nomi'],
      ok: "To'ppa-to'g'ri! href — atributning nomi, «sport.html» esa qo'shtirnoq ichidagi qiymati.", hint: "«=» belgisidan oldin nima turibdi, keyin-chi? Tegning nomi esa burchakli qavsdan keyin darrov keladi.", alt: "Bitta havola kodi" },
    ru: { ctx: 'У атрибута три части: имя, «=» и значение.', q: 'Что такое href в этом коде?', opts: ['Имя атрибута', 'Значение атрибута', 'Имя тега', 'Имя файла'],
      ok: 'Верно! href — имя атрибута, а «sport.html» — его значение в кавычках.', hint: 'Что стоит перед «=», а что после? А имя тега идёт сразу после угловой скобки.', alt: 'Код одной ссылки' },
    en: { ctx: 'An attribute has three parts: a name, “=” and a value.', q: 'What is href in this code?', opts: ['The attribute name', 'The attribute value', 'The tag name', 'The file name'],
      ok: 'Right! href is the attribute name, and “sport.html” is its value in quotes.', hint: 'What is before “=” and what is after it? The tag name comes right after the angle bracket.', alt: 'The code of one link' } },
  { id: 'html-04t3', target: 'html-04', ptype: 'HTML', tag: 'atribut', correct: 3, mono: true,
    uz: { ctx: "Havola «Sport» sahifasiga olib borishi kerak.", q: "Qaysi qator ishlaydi?", opts: ['<a>Sport</a href="sport.html">', '<a href>Sport</a>', '<a "sport.html">Sport</a>', '<a href="sport.html">Sport</a>'],
      ok: "Juda zo'r! Atribut faqat ochuvchi tegda turadi: nomi, «=» va qo'shtirnoq ichida qiymati.", hint: "Atribut qaysi tegda yashaydi: ochuvchi yoki yopuvchi? Unda nom ham, qiymat ham bo'lishi kerak.", alt: "Havolaning to'rtta varianti" },
    ru: { ctx: 'Ссылка должна вести на страницу «Спорт».', q: 'Какая строка работает?', opts: ['<a>Sport</a href="sport.html">', '<a href>Sport</a>', '<a "sport.html">Sport</a>', '<a href="sport.html">Sport</a>'],
      ok: 'Отлично! Атрибут стоит только в открывающем теге: имя, «=» и значение в кавычках.', hint: 'В каком теге живёт атрибут: в открывающем или закрывающем? У него должны быть и имя, и значение.', alt: 'Четыре варианта ссылки' },
    en: { ctx: 'The link must lead to the “Sports” page.', q: 'Which line works?', opts: ['<a>Sport</a href="sport.html">', '<a href>Sport</a>', '<a "sport.html">Sport</a>', '<a href="sport.html">Sport</a>'],
      ok: 'Great! An attribute goes only in the opening tag: a name, “=” and a value in quotes.', hint: 'Which tag holds an attribute: opening or closing? It needs both a name and a value.', alt: 'Four versions of a link' } },
  { id: 'html-04t4', target: 'html-04', ptype: 'HTML', tag: 'https', correct: 1,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<a href="wikipedia.org">${T('Vikipediya', 'Википедия', 'Wikipedia')}</a>`} />; },
    uz: { ctx: "Havola bosildi, lekin «Fayl topilmadi» chiqdi.", q: "Nega shunday bo'ldi?", opts: ['Havola matni juda uzun', "Boshida https:// yo'q", "href o'rniga src kerak", '</a> tegi ortiqcha'],
      ok: "Xuddi shunday! https:// siz brauzer bu nomni o'z saytidagi fayl deb o'ylaydi va topolmaydi.", hint: "Internetdagi sayt manzili nimadan boshlanadi? Brauzer bu nomni qayerdan qidiryapti?", alt: "Internetdagi saytga havola kodi" },
    ru: { ctx: 'По ссылке нажали, а там «Файл не найден».', q: 'Почему так вышло?', opts: ['Текст ссылки слишком длинный', 'В начале нет https://', 'Вместо href нужен src', 'Тег </a> лишний'],
      ok: 'Именно! Без https:// браузер думает, что это файл на своём сайте, и не находит его.', hint: 'С чего начинается адрес сайта в интернете? Где браузер ищет это имя?', alt: 'Код ссылки на сайт в интернете' },
    en: { ctx: 'The link was clicked, but it says “File not found”.', q: 'Why did that happen?', opts: ['The link text is too long', 'There’s no https:// at the start', 'It needs src instead of href', 'The </a> tag is extra'],
      ok: 'Exactly! Without https:// the browser thinks it’s a file on its own site and can’t find it.', hint: 'What does a website address on the internet start with? Where is the browser looking for this name?', alt: 'The code of a link to a website' } },
  { id: 'html-04t5', target: 'html-04', ptype: 'HTML', tag: 'a', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="oyin.html">${T("O'yinlar", 'Игры', 'Games')}</p>\n<p>${T('Bugun yangi o\'yin chiqdi.', 'Сегодня вышла новая игра.', 'A new game came out today.')}</p>`; return <WqVis code={h} mark={[1]} html={h} />; },
    uz: { ctx: "Voy, ikkinchi abzas ham havolaga aylanib qolibdi!", q: "Kodda nima tushib qolibdi?", opts: ['<a>', 'href', '</a>', '</p>'],
      ok: "To'ppa-to'g'ri! a tegi yopilmagan, shuning uchun brauzer keyingi matnni ham havola qilib ketdi.", hint: "Havola qayerda tugashi kerak edi? Qaysi teg ochilgan-u, lekin yopilmagan?", alt: "Ikki abzasi ham havola bo'lgan sahifa" },
    ru: { ctx: 'Ой, второй абзац тоже стал ссылкой!', q: 'Что потерялось в коде?', opts: ['<a>', 'href', '</a>', '</p>'],
      ok: 'Верно! Тег a не закрыт, поэтому браузер сделал ссылкой и текст дальше.', hint: 'Где должна была закончиться ссылка? Какой тег открыт, но не закрыт?', alt: 'Страница, где оба абзаца — ссылки' },
    en: { ctx: 'Oops, the second paragraph turned into a link too!', q: 'What is missing in the code?', opts: ['<a>', 'href', '</a>', '</p>'],
      ok: 'Right! The a tag isn’t closed, so the browser made the following text a link too.', hint: 'Where should the link have ended? Which tag is opened but not closed?', alt: 'A page where both paragraphs are links' } }
];
