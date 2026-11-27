// =============================================================================
// ТЕСТЫ К УРОКУ 11 КУРСА HTML (часть 1 урока 6) «Поля ввода: input и type» (27.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: input даёт поле ввода; type="number" — только числа; запись type="text"; type="password" прячет буквы;
// у input нет закрывающего тега. Прежние вопросы 06t1 (password) и 06t5 (</input>) — переехали сюда (код без label и form:
// их в этой части ещё не было). Остальные три — новые. Словарь: maydon. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'formy-vvod';
const QS = [
  { id: 'html-06q1t1', target: 'html-06q1', ptype: 'HTML', tag: 'input', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Klub murabbiyi', 'Тренер клуба', 'Club coach')} text={T("«Sahifada ism yozish uchun bo'sh maydon kerak».", '«На странице нужно пустое поле, чтобы вписать имя».', '“The page needs an empty field to type a name in.”')} />; },
    uz: { ctx: "Murabbiy sahifaga yozish uchun bo'sh maydon so'rayapti.", q: "Qaysi teg maydon yaratadi?", opts: ['p', 'h1', 'img', 'input'],
      ok: "Qoyil! input tegi sahifada yozish uchun maydon chiqaradi. p matn uchun, h1 sarlavha uchun, img rasm uchun.", hint: "Qaysi teg odam o'zi yoza oladigan joy yaratadi? Qolganlari tayyor matn yoki rasm ko'rsatadi.", alt: "Murabbiyning maydon so'ragan xabari" },
    ru: { ctx: 'Тренер просит пустое место, куда можно писать.', q: 'Какой тег создаёт поле?', opts: ['p', 'h1', 'img', 'input'],
      ok: 'Здорово! Тег input рисует на странице поле, куда можно писать. p — для текста, h1 — для заголовка, img — для картинки.', hint: 'Какой тег делает место, где человек пишет сам? Остальные показывают готовый текст или картинку.', alt: 'Сообщение тренера про поле' },
    en: { ctx: 'The coach asks for an empty place to type in.', q: 'Which tag creates a field?', opts: ['p', 'h1', 'img', 'input'],
      ok: 'Nice work! The input tag puts a field on the page where you can type. p is for text, h1 for a heading, img for a picture.', hint: 'Which tag makes a place where a person types? The others show ready-made text or a picture.', alt: 'The coach’s message about a field' } },
  { id: 'html-06q1t2', target: 'html-06q1', ptype: 'HTML', tag: 'type', correct: 0,
    vis: (L) => { const T = aqL(L); const h = `<p>${T('Yoshingiz', 'Твой возраст', 'Your age')}</p>\n<input type="number">`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Maydonning o'ng tomonida kichik strelkalar paydo bo'ldi.", q: "Bu maydonga nima yozish mumkin?", opts: ['Faqat sonlar', 'Faqat harflar', "Harflar ham, sonlar ham", 'Hech narsa yozib bo\'lmaydi'],
      ok: "To'ppa-to'g'ri! type=\"number\" maydoni faqat sonlarni qabul qiladi, strelkalar bilan esa sonni oshirib-kamaytirish mumkin.", hint: "Kodda type qiymati nima deyilgan? Strelkalar nimaga ishora qilyapti?", alt: "Yosh uchun strelkali maydon" },
    ru: { ctx: 'Справа в поле появились маленькие стрелки.', q: 'Что можно написать в это поле?', opts: ['Только числа', 'Только буквы', 'И буквы, и числа', 'Ничего, оно закрыто'],
      ok: 'Верно! Поле type="number" принимает только числа, а стрелками число можно увеличивать и уменьшать.', hint: 'Что сказано в значении type? О чём говорят стрелки?', alt: 'Поле со стрелками для возраста' },
    en: { ctx: 'Small arrows appeared on the right side of the field.', q: 'What can you type into this field?', opts: ['Only numbers', 'Only letters', 'Both letters and numbers', 'Nothing, it’s locked'],
      ok: 'Right! A type="number" field accepts only numbers, and the arrows raise or lower the number.', hint: 'What does the type value say? What do the arrows hint at?', alt: 'A field with arrows for an age' } },
  { id: 'html-06q1t3', target: 'html-06q1', ptype: 'HTML', tag: 'type', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<p>${T('Ismingiz', 'Твоё имя', 'Your name')}</p>\n<input type="text">`; return <WqVis html={h} />; },
    uz: { ctx: "Sahifada ana shunday oddiy maydon chiqishi kerak.", q: "Qaysi yozuv to'g'ri?", opts: ['<input type: "text">', '<input type "text">', '<input type="text">', '<input text="type">'],
      ok: "Juda zo'r! Atribut nomi, tenglik belgisi va qiymat qo'shtirnoqda: type=\"text\". Tenglik belgisisiz yoki aralashtirilsa, brauzer tushunmaydi.", hint: "Atribut qanday yoziladi: nomi, keyin nima, keyin qiymat? Nom bilan qiymat o'rnini almashtirmang.", alt: "Ism uchun oddiy maydon" },
    ru: { ctx: 'На странице должно получиться вот такое обычное поле.', q: 'Какая запись правильная?', opts: ['<input type: "text">', '<input type "text">', '<input type="text">', '<input text="type">'],
      ok: 'Отлично! Имя атрибута, знак равно и значение в кавычках: type="text". Без знака равно или с перепутанными местами браузер не поймёт.', hint: 'Как пишется атрибут: имя, потом что, потом значение? Имя и значение местами не меняй.', alt: 'Обычное поле для имени' },
    en: { ctx: 'The page should end up with an ordinary field like this.', q: 'Which way of writing it is correct?', opts: ['<input type: "text">', '<input type "text">', '<input type="text">', '<input text="type">'],
      ok: 'Great! Attribute name, an equals sign and the value in quotes: type="text". Without the equals sign, or with the parts swapped, the browser won’t understand.', hint: 'How is an attribute written: the name, then what, then the value? Don’t swap the name and the value.', alt: 'An ordinary field for a name' } },
  { id: 'html-06q1t4', target: 'html-06q1', ptype: 'HTML', tag: 'type', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<p>${T('Parol', 'Пароль', 'Password')}</p>\n<input type="___">`} mark={[2]} />; },
    uz: { ctx: "Parol yozilganda harflar nuqtalar bo'lib yashirinishi kerak.", q: "type atributiga nima yozamiz?", opts: ['text', 'password', 'number', 'parol'],
      ok: "Xuddi shunday! type=\"password\" harflarni yashiradi: yonidagi odam parolni ko'rmaydi.", hint: "text harflarni ochiq ko'rsatadi, number faqat son uchun. Qaysi biri parol uchun edi?", alt: "type qiymati bo'sh maydon kodi" },
    ru: { ctx: 'Когда пишешь пароль, буквы должны прятаться за точками.', q: 'Что написать в атрибут type?', opts: ['text', 'password', 'number', 'parol'],
      ok: 'Именно! type="password" прячет буквы: сосед пароль не увидит.', hint: 'text показывает буквы открыто, number — только для чисел. Какой был для пароля?', alt: 'Код поля с пустым значением type' },
    en: { ctx: 'When you type a password, the letters must hide behind dots.', q: 'What goes in the type attribute?', opts: ['text', 'password', 'number', 'parol'],
      ok: 'Exactly! type="password" hides the letters: the person next to you won’t see the password.', hint: 'text shows the letters openly, number is only for numbers. Which one was for passwords?', alt: 'Field code with an empty type value' } },
  { id: 'html-06q1t5', target: 'html-06q1', ptype: 'HTML', tag: 'input', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<h1>${T('Klub', 'Клуб', 'Club')}</h1>\n<p>${T('Parol', 'Пароль', 'Password')}</p>\n<input type="password">\n</input>`} />; },
    uz: { ctx: "Bu kodda bitta qator ortiqcha.", q: "Qaysi qatorni o'chirish kerak?", opts: ['2-qatorni', '3-qatorni', '4-qatorni', '1-qatorni'],
      ok: "To'ppa-to'g'ri! input tegining yopuvchi tegi yo'q, xuddi img kabi. 4-qatordagi </input> ortiqcha.", hint: "Qaysi teg yopuvchi tegsiz yashaydi, xuddi img kabi? Uning yopuvchisi qayerda turibdi?", alt: "To'rt qatorli maydon kodi" },
    ru: { ctx: 'В этом коде одна строка лишняя.', q: 'Какую строку нужно удалить?', opts: ['Строку 2', 'Строку 3', 'Строку 4', 'Строку 1'],
      ok: 'Верно! У тега input нет закрывающего тега, как у img. </input> в строке 4 лишний.', hint: 'Какой тег живёт без закрывающего, как img? Где стоит его «закрывающий»?', alt: 'Код поля из четырёх строк' },
    en: { ctx: 'One line in this code is extra.', q: 'Which line should be deleted?', opts: ['Line 2', 'Line 3', 'Line 4', 'Line 1'],
      ok: 'Right! The input tag has no closing tag, just like img. The </input> on line 4 is extra.', hint: 'Which tag lives without a closing tag, like img? Where is its “closing” one?', alt: 'Four lines of field code' } }
];
