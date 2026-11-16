// =============================================================================
// ТЕСТЫ К УРОКУ 6 КУРСА HTML «Формы, часть 1: ввод данных» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: password прячет буквы; placeholder — серая подсказка, а не ответ; опечатка в placeholder — подсказки нет;
// label связывает подпись с полем; у input нет закрывающего тега.
// Словарь урока 6: maydon, kulrang ishora, anketa, maydon yozuvi. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'formy-vvod';
const QS = [
  { id: 'html-06t1', target: 'html-06', ptype: 'HTML', tag: 'type', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<label>\n  ${T('Parol', 'Пароль', 'Password')}\n  <input type="___">\n</label>`} mark={[3]} />; },
    uz: { ctx: "Parol yozilganda harflar nuqtalar bo'lib yashirinishi kerak.", q: "type atributiga nima yozamiz?", opts: ['text', 'password', 'number', 'parol'],
      ok: "To'ppa-to'g'ri! type=\"password\" harflarni yashiradi: yonidagi odam parolni ko'rmaydi.", hint: "text harflarni ochiq ko'rsatadi, number faqat son uchun. Qaysi biri parol uchun edi?", alt: "type qiymati bo'sh maydon kodi" },
    ru: { ctx: 'Когда пишешь пароль, буквы должны прятаться за точками.', q: 'Что написать в атрибут type?', opts: ['text', 'password', 'number', 'parol'],
      ok: 'Верно! type="password" прячет буквы: сосед пароль не увидит.', hint: 'text показывает буквы открыто, number — только для чисел. Какой был для пароля?', alt: 'Код поля с пустым значением type' },
    en: { ctx: 'When you type a password, the letters must hide behind dots.', q: 'What goes in the type attribute?', opts: ['text', 'password', 'number', 'parol'],
      ok: 'Right! type="password" hides the letters: the person next to you won’t see the password.', hint: 'text shows the letters openly, number is only for numbers. Which one was for passwords?', alt: 'Field code with an empty type value' } },
  { id: 'html-06t2', target: 'html-06', ptype: 'HTML', tag: 'placeholder', correct: 3,
    vis: (L) => { const T = aqL(L); const h = `<label>\n  ${T('Ism', 'Имя', 'Name')}\n  <input type="text" placeholder="${T('Masalan, Aziz', 'Например, Азиз', 'For example, Aziz')}">\n</label>`; return <WqVis code={h} mark={[3]} html={h} />; },
    uz: { ctx: "Maydon ichida kulrang yozuv turibdi.", q: "Bu kulrang yozuv nima?", opts: ['Maydonning tayyor javobi', 'Maydon yozuvi, ya\'ni label', 'Sahifaning nomi', "Kulrang ishora: javob emas"],
      ok: "Qoyil! placeholder — faqat ishora: odam yozishni boshlashi bilan u yo'qoladi, javob bo'lib qolmaydi.", hint: "Maydonga harf yozsangiz, kulrang yozuv nima bo'ladi? U qaysi atributdan kelyapti?", alt: "Kulrang ishorali maydon" },
    ru: { ctx: 'Внутри поля стоит серая надпись.', q: 'Что это за серая надпись?', opts: ['Готовый ответ поля', 'Подпись поля, то есть label', 'Название страницы', 'Серая подсказка, не ответ'],
      ok: 'Здорово! placeholder — только подсказка: как только начинаешь писать, она исчезает и ответом не становится.', hint: 'Что будет с серой надписью, если начать писать в поле? Из какого атрибута она?', alt: 'Поле с серой подсказкой' },
    en: { ctx: 'There’s grey text inside the field.', q: 'What is this grey text?', opts: ['The field’s ready answer', 'The field’s label', 'The page name', 'A grey hint, not an answer'],
      ok: 'Nice work! placeholder is only a hint: as soon as you start typing it disappears, and it never becomes the answer.', hint: 'What happens to the grey text when you start typing? Which attribute does it come from?', alt: 'A field with a grey hint' } },
  { id: 'html-06t3', target: 'html-06', ptype: 'HTML', tag: 'placeholder', correct: 0,
    vis: (L) => { const T = aqL(L); const h = `<input type="text" placeholder="${T('Ismingiz', 'Твоё имя', 'Your name')}">\n<input type="number" placehoder="${T('Yoshingiz', 'Твой возраст', 'Your age')}">`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Ikkinchi maydonda kulrang ishora chiqmadi.", q: "Nega shunday bo'ldi?", opts: ["placeholder so'zida harf tushib qolgan", 'type="number" ishorani o\'chiradi', 'input tegi yopilmagan', 'Ishora matni juda uzun'],
      ok: "Xuddi shunday! placehoder deb yozilgan, «l» harfi tushib qolibdi. Brauzer bunday atributni tanimaydi.", hint: "Ikkala qatordagi atribut nomlarini harfma-harf solishtirib ko'ring.", alt: "Biri ishorali, biri ishorasiz ikki maydon" },
    ru: { ctx: 'Во втором поле серой подсказки нет.', q: 'Почему так получилось?', opts: ['В слове placeholder пропала буква', 'type="number" убирает подсказку', 'Тег input не закрыт', 'Текст подсказки слишком длинный'],
      ok: 'Именно! Написано placehoder — пропала буква «l». Браузер такой атрибут не знает.', hint: 'Сравни имена атрибутов в двух строках буква в букву.', alt: 'Два поля: одно с подсказкой, другое без' },
    en: { ctx: 'The second field shows no grey hint.', q: 'Why did that happen?', opts: ['A letter is missing in placeholder', 'type="number" removes the hint', 'The input tag isn’t closed', 'The hint text is too long'],
      ok: 'Exactly! It says placehoder — the letter “l” is missing. The browser doesn’t know that attribute.', hint: 'Compare the attribute names in the two lines letter by letter.', alt: 'Two fields: one with a hint, one without' } },
  { id: 'html-06t4', target: 'html-06', ptype: 'HTML', tag: 'label', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<form>\n  <___>\n    ${T('Ismingiz', 'Твоё имя', 'Your name')}\n    <input type="text">\n  </___>\n</form>`} mark={[2, 5]} />; },
    uz: { ctx: "Yozuvga bosilganda maydon tanlanib, kursor unda paydo bo'lsin.", q: "Bo'sh joylarga qaysi teg yoziladi?", opts: ['form', 'p', 'label', 'input'],
      ok: "Juda zo'r! label maydon yozuvini maydonga bog'laydi: yozuvga bossangiz, maydon o'zi tanlanadi.", hint: "Qaysi teg yozuv va maydonni bitta qilib o'rab turadi? form esa butun anketani o'raydi.", alt: "Tegi bo'sh maydon kodi" },
    ru: { ctx: 'Пусть при нажатии на подпись выбирается поле и в нём появляется курсор.', q: 'Какой тег пишется на пустые места?', opts: ['form', 'p', 'label', 'input'],
      ok: 'Отлично! label связывает подпись с полем: нажимаешь на подпись — поле выбирается само.', hint: 'Какой тег обнимает подпись и поле вместе? А form обнимает всю анкету.', alt: 'Код поля с пустым тегом' },
    en: { ctx: 'Clicking the label should select the field and put the cursor in it.', q: 'Which tag goes in the empty spots?', opts: ['form', 'p', 'label', 'input'],
      ok: 'Great! label connects the caption to the field: click the caption and the field gets selected.', hint: 'Which tag wraps the caption and the field together? form wraps the whole form.', alt: 'Field code with an empty tag' } },
  { id: 'html-06t5', target: 'html-06', ptype: 'HTML', tag: 'input', correct: 1,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<form>\n  <label>\n    ${T('Parol', 'Пароль', 'Password')}\n    <input type="password">\n    </input>\n  </label>\n</form>`} />; },
    uz: { ctx: "Bu kodda bitta qator ortiqcha.", q: "Qaysi qatorni o'chirish kerak?", opts: ['4-qatorni', '5-qatorni', '6-qatorni', '2-qatorni'],
      ok: "To'ppa-to'g'ri! input tegining yopuvchi tegi yo'q, xuddi img kabi. 5-qatordagi </input> ortiqcha.", hint: "Qaysi teg yopuvchi tegsiz yashaydi, xuddi img kabi? Uning yopuvchisi qayerda turibdi?", alt: "Yetti qatorli anketa kodi" },
    ru: { ctx: 'В этом коде одна строка лишняя.', q: 'Какую строку нужно удалить?', opts: ['Строку 4', 'Строку 5', 'Строку 6', 'Строку 2'],
      ok: 'Верно! У тега input нет закрывающего тега, как у img. </input> в строке 5 лишний.', hint: 'Какой тег живёт без закрывающего, как img? Где стоит его «закрывающий»?', alt: 'Код анкеты из семи строк' },
    en: { ctx: 'One line in this code is extra.', q: 'Which line should be deleted?', opts: ['Line 4', 'Line 5', 'Line 6', 'Line 2'],
      ok: 'Right! The input tag has no closing tag, just like img. The </input> on line 5 is extra.', hint: 'Which tag lives without a closing tag, like img? Where is its “closing” one?', alt: 'Seven lines of form code' } }
];
