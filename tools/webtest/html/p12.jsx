// =============================================================================
// ТЕСТЫ К УРОКУ 12 КУРСА HTML (часть 2 урока 6) «Подсказки и подписи: placeholder и label» (27.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: placeholder — серая подсказка, не ответ; опечатка в placeholder — подсказки нет; label связывает подпись с полем;
// form обнимает всю анкету; placeholder пароль не прячет — для этого type="password".
// Прежние вопросы 06t2, 06t3, 06t4 переехали сюда; два вопроса (form, placeholder и пароль) — новые.
// Словарь: maydon, kulrang ishora, anketa, maydon yozuvi. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'formy-vvod';
const QS = [
  { id: 'html-06q2t1', target: 'html-06q2', ptype: 'HTML', tag: 'placeholder', correct: 3,
    vis: (L) => { const T = aqL(L); const h = `<label>\n  ${T('Ism', 'Имя', 'Name')}\n  <input type="text" placeholder="${T('Masalan, Aziz', 'Например, Азиз', 'For example, Aziz')}">\n</label>`; return <WqVis code={h} mark={[3]} html={h} />; },
    uz: { ctx: "Maydon ichida kulrang yozuv turibdi.", q: "Bu kulrang yozuv nima?", opts: ['Maydonning tayyor javobi', 'Maydon yozuvi, ya\'ni label', 'Sahifaning nomi', "Kulrang ishora: javob emas"],
      ok: "Qoyil! placeholder — faqat ishora: odam yozishni boshlashi bilan u yo'qoladi, javob bo'lib qolmaydi.", hint: "Maydonga harf yozsangiz, kulrang yozuv nima bo'ladi? U qaysi atributdan kelyapti?", alt: "Kulrang ishorali maydon" },
    ru: { ctx: 'Внутри поля стоит серая надпись.', q: 'Что это за серая надпись?', opts: ['Готовый ответ поля', 'Подпись поля, то есть label', 'Название страницы', 'Серая подсказка, не ответ'],
      ok: 'Здорово! placeholder — только подсказка: как только начинаешь писать, она исчезает и ответом не становится.', hint: 'Что будет с серой надписью, если начать писать в поле? Из какого атрибута она?', alt: 'Поле с серой подсказкой' },
    en: { ctx: 'There’s grey text inside the field.', q: 'What is this grey text?', opts: ['The field’s ready answer', 'The field’s label', 'The page name', 'A grey hint, not an answer'],
      ok: 'Nice work! placeholder is only a hint: as soon as you start typing it disappears, and it never becomes the answer.', hint: 'What happens to the grey text when you start typing? Which attribute does it come from?', alt: 'A field with a grey hint' } },
  { id: 'html-06q2t2', target: 'html-06q2', ptype: 'HTML', tag: 'placeholder', correct: 0,
    vis: (L) => { const T = aqL(L); const h = `<input type="text" placeholder="${T('Ismingiz', 'Твоё имя', 'Your name')}">\n<input type="number" placehoder="${T('Yoshingiz', 'Твой возраст', 'Your age')}">`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Ikkinchi maydonda kulrang ishora chiqmadi.", q: "Nega shunday bo'ldi?", opts: ["placeholder so'zida harf tushib qolgan", 'type="number" ishorani o\'chiradi', 'input tegi yopilmagan', 'Ishora matni juda uzun'],
      ok: "Xuddi shunday! placehoder deb yozilgan, «l» harfi tushib qolibdi. Brauzer bunday atributni tanimaydi.", hint: "Ikkala qatordagi atribut nomlarini harfma-harf solishtirib ko'ring.", alt: "Biri ishorali, biri ishorasiz ikki maydon" },
    ru: { ctx: 'Во втором поле серой подсказки нет.', q: 'Почему так получилось?', opts: ['В слове placeholder пропала буква', 'type="number" убирает подсказку', 'Тег input не закрыт', 'Текст подсказки слишком длинный'],
      ok: 'Именно! Написано placehoder — пропала буква «l». Браузер такой атрибут не знает.', hint: 'Сравни имена атрибутов в двух строках буква в букву.', alt: 'Два поля: одно с подсказкой, другое без' },
    en: { ctx: 'The second field shows no grey hint.', q: 'Why did that happen?', opts: ['A letter is missing in placeholder', 'type="number" removes the hint', 'The input tag isn’t closed', 'The hint text is too long'],
      ok: 'Exactly! It says placehoder — the letter “l” is missing. The browser doesn’t know that attribute.', hint: 'Compare the attribute names in the two lines letter by letter.', alt: 'Two fields: one with a hint, one without' } },
  { id: 'html-06q2t3', target: 'html-06q2', ptype: 'HTML', tag: 'label', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<form>\n  <___>\n    ${T('Ismingiz', 'Твоё имя', 'Your name')}\n    <input type="text">\n  </___>\n</form>`} mark={[2, 5]} />; },
    uz: { ctx: "Yozuvga bosilganda maydon tanlanib, kursor unda paydo bo'lsin.", q: "Bo'sh joylarga qaysi teg yoziladi?", opts: ['form', 'p', 'label', 'input'],
      ok: "Juda zo'r! label maydon yozuvini maydonga bog'laydi: yozuvga bossangiz, maydon o'zi tanlanadi.", hint: "Qaysi teg yozuv va maydonni bitta qilib o'rab turadi? form esa butun anketani o'raydi.", alt: "Tegi bo'sh maydon kodi" },
    ru: { ctx: 'Пусть при нажатии на подпись выбирается поле и в нём появляется курсор.', q: 'Какой тег пишется на пустые места?', opts: ['form', 'p', 'label', 'input'],
      ok: 'Отлично! label связывает подпись с полем: нажимаешь на подпись — поле выбирается само.', hint: 'Какой тег обнимает подпись и поле вместе? А form обнимает всю анкету.', alt: 'Код поля с пустым тегом' },
    en: { ctx: 'Clicking the label should select the field and put the cursor in it.', q: 'Which tag goes in the empty spots?', opts: ['form', 'p', 'label', 'input'],
      ok: 'Great! label connects the caption to the field: click the caption and the field gets selected.', hint: 'Which tag wraps the caption and the field together? form wraps the whole form.', alt: 'Field code with an empty tag' } },
  { id: 'html-06q2t4', target: 'html-06q2', ptype: 'HTML', tag: 'form', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<___>\n  <label>${T('Ism', 'Имя', 'Name')} <input type="text"></label>\n  <label>${T('Yosh', 'Возраст', 'Age')} <input type="number"></label>\n</___>`} mark={[1, 4]} />; },
    uz: { ctx: "Ikkala maydonni bitta anketaga yig'ib, keyin uni yuboramiz.", q: "Bo'sh joylarga qaysi teg yoziladi?", opts: ['label', 'input', 'body', 'form'],
      ok: "Zo'r! form butun anketani o'rab turadi: shunda hamma maydonlar bitta anketaga yig'iladi.", hint: "Qaysi teg butun anketani o'raydi? label esa faqat bitta yozuvni uning maydoni bilan bog'laydi.", alt: "Ikki maydonli anketa kodi" },
    ru: { ctx: 'Собираем оба поля в одну анкету, чтобы потом её отправить.', q: 'Какой тег пишется на пустые места?', opts: ['label', 'input', 'body', 'form'],
      ok: 'Здорово! form обнимает всю анкету: так все поля собраны в одну анкету.', hint: 'Какой тег обнимает всю анкету? А label связывает только одну подпись с её полем.', alt: 'Код анкеты с двумя полями' },
    en: { ctx: 'We gather both fields into one form so we can send it later.', q: 'Which tag goes in the empty spots?', opts: ['label', 'input', 'body', 'form'],
      ok: 'Nice work! form wraps the whole form, so all the fields end up in one form.', hint: 'Which tag wraps the whole form? label only connects one caption to its field.', alt: 'Code of a form with two fields' } },
  { id: 'html-06q2t5', target: 'html-06q2', ptype: 'HTML', tag: 'placeholder', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T("Do'st", 'Друг', 'Friend')} text={T('«Maydonga placeholder="Parol" yozdim. Endi parolni yozsam, harflar yashirinadi, a?»', '«Я написал в поле placeholder="Пароль". Теперь, когда буду писать пароль, буквы спрячутся, да?»', '“I put placeholder="Password" in the field. Now when I type a password, the letters will hide, right?”')} />; },
    uz: { ctx: "Do'stingiz maydonga kulrang yozuv qo'ydi va parol yashiriladi deb o'ylayapti.", q: "U to'g'ri o'ylayaptimi?", opts: ["Ha, placeholder harflarni nuqtaga aylantiradi", "Yo'q, buning uchun type=\"password\" kerak", "Ha, input tegi hamma narsani yashirib qo'yadi", "Yo'q, buning uchun label tegi kerak bo'ladi"],
      ok: "Aynan shunday! placeholder faqat kulrang ishora, harflarni yashirmaydi. Harflarni nuqtaga aylantirish uchun type=\"password\" kerak.", hint: "Siz yozishni boshlasangiz, placeholder yo'qoladi. Harflarni nuqtaga aylantiradigan narsa boshqa atribut edi.", alt: "Do'stingizning placeholder haqida xabari" },
    ru: { ctx: 'Друг поставил в поле серую надпись и думает, что пароль будет спрятан.', q: 'Он прав?', opts: ['Да, placeholder превращает буквы в точки', 'Нет, для этого нужен type="password"', 'Да, тег input сам прячет любой текст', 'Нет, для этого нужен тег label'],
      ok: 'Именно! placeholder — только серая подсказка, буквы он не прячет. Чтобы превратить буквы в точки, нужен type="password".', hint: 'Когда начнёшь писать, placeholder исчезнет. Буквы в точки превращал другой атрибут.', alt: 'Сообщение друга про placeholder' },
    en: { ctx: 'A friend put grey text in the field and thinks the password will be hidden.', q: 'Is he right?', opts: ['Yes, placeholder turns letters into dots', 'No, that takes type="password"', 'Yes, the input tag hides any text itself', 'No, that takes the label tag'],
      ok: 'Exactly! placeholder is only a grey hint, it never hides the letters. To turn letters into dots you need type="password".', hint: 'When you start typing, the placeholder disappears. A different attribute turned letters into dots.', alt: 'A friend’s message about placeholder' } }
];
