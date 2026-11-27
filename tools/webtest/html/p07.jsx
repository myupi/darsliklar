// =============================================================================
// ТЕСТЫ К УРОКУ 7 КУРСА HTML «Ссылки: a и href» (27.11.2026) — 1-я часть старого урока 4 «Ссылки и атрибуты», 5 вопросов, по файлу на вопрос.
// Проверяем: без href ссылка — простой текст; части атрибута (имя, «=», значение); атрибут — в открывающем теге,
// значение в кавычках; опечатка в имени файла — «Файл не найден»; забытый </a> делает ссылкой хвост.
// Словарь: havola, atribut, qiymat, manzil, qo'shtirnoq. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'ssylki-i-atributy';
const QS = [
  { id: 'html-04q1t1', target: 'html-04q1', ptype: 'HTML', tag: 'href', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="sport.html">${T('Sport', 'Спорт', 'Sports')}</a></p>\n<p><a>${T("Hayvonot bog'i", 'Зоопарк', 'Zoo')}</a></p>`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Ikkinchi so'z havolaga o'xshamayapti: ko'k emas, chizig'i ham yo'q.", q: "Unga nima yetishmayapti?", opts: ['</a> tegi', '<p> tegi', 'href atributi', 'title tegi'],
      ok: "Qoyil! href atributisiz a tegi qayerga olib borishni bilmaydi, shuning uchun oddiy matn bo'lib qoladi.", hint: "Birinchi havolani ikkinchisi bilan solishtirib ko'ring: ochuvchi tegda nima farq bor?", alt: "Biri havola, biri oddiy matn bo'lgan sahifa" },
    ru: { ctx: 'Второе слово не похоже на ссылку: не синее и без подчёркивания.', q: 'Чего ему не хватает?', opts: ['Тега </a>', 'Тега <p>', 'Атрибута href', 'Тега title'],
      ok: 'Здорово! Без атрибута href тег a не знает, куда вести, поэтому остаётся простым текстом.', hint: 'Сравни первую ссылку со второй: чем отличаются открывающие теги?', alt: 'Страница: одна ссылка и один простой текст' },
    en: { ctx: 'The second word doesn’t look like a link: not blue, no underline.', q: 'What is it missing?', opts: ['The </a> tag', 'The <p> tag', 'The href attribute', 'The title tag'],
      ok: 'Nice work! Without the href attribute the a tag doesn’t know where to go, so it stays plain text.', hint: 'Compare the first link with the second: how are the opening tags different?', alt: 'A page with one link and one plain text' } },
  { id: 'html-04q1t2', target: 'html-04q1', ptype: 'HTML', tag: 'atribut', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<a href="sport.html">${T('Sport', 'Спорт', 'Sports')}</a>`} />; },
    uz: { ctx: "Atribut uch qismdan iborat: nom, «=» va qiymat.", q: "Bu koddagi href nima?", opts: ['Atributning nomi', 'Atributning qiymati', 'Tegning nomi', 'Faylning nomi'],
      ok: "To'ppa-to'g'ri! href — atributning nomi, «sport.html» esa qo'shtirnoq ichidagi qiymati.", hint: "«=» belgisidan oldin nima turibdi, keyin-chi? Tegning nomi esa burchakli qavsdan keyin darrov keladi.", alt: "Bitta havola kodi" },
    ru: { ctx: 'У атрибута три части: имя, «=» и значение.', q: 'Что такое href в этом коде?', opts: ['Имя атрибута', 'Значение атрибута', 'Имя тега', 'Имя файла'],
      ok: 'Верно! href — имя атрибута, а «sport.html» — его значение в кавычках.', hint: 'Что стоит перед «=», а что после? А имя тега идёт сразу после угловой скобки.', alt: 'Код одной ссылки' },
    en: { ctx: 'An attribute has three parts: a name, “=” and a value.', q: 'What is href in this code?', opts: ['The attribute name', 'The attribute value', 'The tag name', 'The file name'],
      ok: 'Right! href is the attribute name, and “sport.html” is its value in quotes.', hint: 'What is before “=” and what is after it? The tag name comes right after the angle bracket.', alt: 'The code of one link' } },
  { id: 'html-04q1t3', target: 'html-04q1', ptype: 'HTML', tag: 'atribut', correct: 3, mono: true,
    uz: { ctx: "Havola «Sport» sahifasiga olib borishi kerak.", q: "Qaysi qator ishlaydi?", opts: ['<a>Sport</a href="sport.html">', '<a href>Sport</a>', '<a "sport.html">Sport</a>', '<a href="sport.html">Sport</a>'],
      ok: "Juda zo'r! Atribut faqat ochuvchi tegda turadi: nomi, «=» va qo'shtirnoq ichida qiymati.", hint: "Atribut qaysi tegda yashaydi: ochuvchi yoki yopuvchi? Unda nom ham, qiymat ham bo'lishi kerak.", alt: "Havolaning to'rtta varianti" },
    ru: { ctx: 'Ссылка должна вести на страницу «Спорт».', q: 'Какая строка работает?', opts: ['<a>Sport</a href="sport.html">', '<a href>Sport</a>', '<a "sport.html">Sport</a>', '<a href="sport.html">Sport</a>'],
      ok: 'Отлично! Атрибут стоит только в открывающем теге: имя, «=» и значение в кавычках.', hint: 'В каком теге живёт атрибут: в открывающем или закрывающем? У него должны быть и имя, и значение.', alt: 'Четыре варианта ссылки' },
    en: { ctx: 'The link must lead to the “Sports” page.', q: 'Which line works?', opts: ['<a>Sport</a href="sport.html">', '<a href>Sport</a>', '<a "sport.html">Sport</a>', '<a href="sport.html">Sport</a>'],
      ok: 'Great! An attribute goes only in the opening tag: a name, “=” and a value in quotes.', hint: 'Which tag holds an attribute: opening or closing? It needs both a name and a value.', alt: 'Four versions of a link' } },
  { id: 'html-04q1t4', target: 'html-04q1', ptype: 'HTML', tag: 'href', correct: 1,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="osh.htm">${T('Osh retsepti', 'Рецепт плова', 'Pilaf recipe')}</a></p>`; return <WqVis code={h} mark={[1]} html={h} />; },
    uz: { ctx: "Havolani bosdik, lekin «Fayl topilmadi» chiqdi. Papkada esa osh.html fayli bor.", q: "Xato qayerda?", opts: ['href atributi yozilmay qolgan', 'Fayl nomi xato yozilgan', 'Yopuvchi </a> tegi yozilmagan', "Sayt papkasida bunday fayl yo'q"],
      ok: "Xuddi shunday! Brauzer href ichidagi nomni harfma-harf qidiradi: osh.htm bilan osh.html — ikki xil fayl.", hint: "Kodda yozilgan nomni papkadagi fayl nomi bilan harfma-harf solishtiring.", alt: "Fayl nomi xato yozilgan havola kodi" },
    ru: { ctx: 'Ссылку нажали, а там «Файл не найден». А в папке лежит файл osh.html.', q: 'Где ошибка?', opts: ['Не написан атрибут href', 'Имя файла написано с ошибкой', 'Не написан закрывающий тег </a>', 'В папке сайта нет такого файла'],
      ok: 'Именно! Браузер ищет файл по имени из href буква в букву: osh.htm и osh.html — это два разных файла.', hint: 'Сравни имя в коде с именем файла в папке буква за буквой.', alt: 'Код ссылки с ошибкой в имени файла' },
    en: { ctx: 'The link was clicked, but it says “File not found”. And the folder does have a file called osh.html.', q: 'Where is the mistake?', opts: ['The href attribute is missing', 'The file name is misspelled', 'The closing </a> tag is missing', 'The site folder has no such file'],
      ok: 'Exactly! The browser looks for the file by the name in href, letter for letter: osh.htm and osh.html are two different files.', hint: 'Compare the name in the code with the file name in the folder, letter by letter.', alt: 'The code of a link with a misspelled file name' } },
  { id: 'html-04q1t5', target: 'html-04q1', ptype: 'HTML', tag: 'a', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<p><a href="oyin.html">${T("O'yinlar", 'Игры', 'Games')}</p>\n<p>${T('Bugun yangi o\'yin chiqdi.', 'Сегодня вышла новая игра.', 'A new game came out today.')}</p>`; return <WqVis code={h} mark={[1]} html={h} />; },
    uz: { ctx: "Voy, ikkinchi abzas ham havolaga aylanib qolibdi!", q: "Kodda nima tushib qolibdi?", opts: ['<a>', 'href', '</a>', '</p>'],
      ok: "To'ppa-to'g'ri! a tegi yopilmagan, shuning uchun brauzer keyingi matnni ham havola qilib ketdi.", hint: "Havola qayerda tugashi kerak edi? Qaysi teg ochilgan-u, lekin yopilmagan?", alt: "Ikki abzasi ham havola bo'lgan sahifa" },
    ru: { ctx: 'Ой, второй абзац тоже стал ссылкой!', q: 'Что потерялось в коде?', opts: ['<a>', 'href', '</a>', '</p>'],
      ok: 'Верно! Тег a не закрыт, поэтому браузер сделал ссылкой и текст дальше.', hint: 'Где должна была закончиться ссылка? Какой тег открыт, но не закрыт?', alt: 'Страница, где оба абзаца — ссылки' },
    en: { ctx: 'Oops, the second paragraph turned into a link too!', q: 'What is missing in the code?', opts: ['<a>', 'href', '</a>', '</p>'],
      ok: 'Right! The a tag isn’t closed, so the browser made the following text a link too.', hint: 'Where should the link have ended? Which tag is opened but not closed?', alt: 'A page where both paragraphs are links' } }
];
