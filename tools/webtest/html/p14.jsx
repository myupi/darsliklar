// =============================================================================
// ТЕСТЫ К УРОКУ 14 КУРСА HTML «Кнопка и своя анкета» (27.11.2026) — 5 вопросов, по файлу на вопрос. Урок 7 разделён на две части; это часть 2.
// Проверяем: надпись кнопки — между тегами; без button анкету не отправить; незакрытый textarea проглатывает кнопку; кнопка вне form не
// отправляет; кнопка в form отправляет, а без сервера страница открывается заново. (Прежние t3, t2 урока 7 + 3 новых.)
// Словарь урока 7: ochiladigan ro'yxat, variant, katta matn maydoni, tugma. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'formy-vybor';
const QS = [
  { id: 'html-07q2t1', target: 'html-07q2', ptype: 'HTML', tag: 'button', correct: 3, mono: true,
    uz: { ctx: "Tugmada «Yuborish» yozuvi chiqishi kerak.", q: "Qaysi qator to'g'ri?", opts: ['<button="Yuborish">', '<button>Yuborish', '<button text="Yuborish">', '<button>Yuborish</button>'],
      ok: "Juda zo'r! Tugmaning yozuvi ochuvchi va yopuvchi teglar o'rtasida turadi. button input emas: uning yopuvchi tegi bor.", hint: "Tugma yozuvi qayerda turadi: atributdami yoki teglar o'rtasida? button tegining yopuvchisi bormi?", alt: "Tugma kodining to'rtta varianti" },
    ru: { ctx: 'На кнопке должна быть надпись «Отправить».', q: 'Какая строка правильная?', opts: ['<button="Отправить">', '<button>Отправить', '<button text="Отправить">', '<button>Отправить</button>'],
      ok: 'Отлично! Надпись кнопки стоит между открывающим и закрывающим тегами. button — не input: у него есть закрывающий тег.', hint: 'Где стоит надпись кнопки: в атрибуте или между тегами? Есть ли у button закрывающий тег?', alt: 'Четыре варианта кода кнопки' },
    en: { ctx: 'The button must say “Send”.', q: 'Which line is correct?', opts: ['<button="Send">', '<button>Send', '<button text="Send">', '<button>Send</button>'],
      ok: 'Great! The button text goes between the opening and closing tags. button isn’t input: it has a closing tag.', hint: 'Where does the button text go: in an attribute or between tags? Does button have a closing tag?', alt: 'Four versions of button code' } },
  { id: 'html-07q2t2', target: 'html-07q2', ptype: 'HTML', tag: 'button', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<form>\n  <select>\n    <option>${T('Futbol', 'Футбол', 'Football')}</option>\n  </select>\n  <textarea></textarea>\n</form>`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Mehmon ro'yxatdan tanladi, maydonni ham to'ldirdi, lekin anketani yuboradigan joy yo'q.", q: "Anketada qaysi teg yetishmayapti?", opts: ['option', 'button', 'label', 'input'],
      ok: "Xuddi shunday! Anketani yuboradigan tugmani button tegi yasaydi. Tugma form ichiga qo'yiladi.", hint: "Ro'yxat ham bor, katta maydon ham. Mehmon oxirida nimani bosishi kerak?", alt: "Tugmasiz anketa" },
    ru: { ctx: 'Гость выбрал в списке, заполнил поле, но отправить анкету нечем.', q: 'Какого тега не хватает в анкете?', opts: ['option', 'button', 'label', 'input'],
      ok: 'Именно! Кнопку, которая отправляет анкету, делает тег button. Её ставят внутрь form.', hint: 'Список есть, большое поле есть. Что гость должен нажать в конце?', alt: 'Анкета без кнопки' },
    en: { ctx: 'The guest picked from the list and filled the field, but there’s nothing to send the form with.', q: 'Which tag is missing in the form?', opts: ['option', 'button', 'label', 'input'],
      ok: 'Exactly! The button that sends the form is made by the button tag. It goes inside form.', hint: 'There’s a list and a big field. What must the guest tap at the end?', alt: 'A form without a button' } },
  { id: 'html-07q2t3', target: 'html-07q2', ptype: 'HTML', tag: 'textarea', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<form>\n  <textarea>\n  <button>${T('Yuborish', 'Отправить', 'Send')}</button>\n</form>`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Voy, tugma yo'q, katta maydonning ichida esa kod turibdi!", q: "Kodda nima tushib qolibdi?", opts: ['</textarea>', '</button>', '<form>', '</select>'],
      ok: "Xuddi shunday! textarea yopilmagan, shuning uchun brauzer keyingi hamma kodni maydon ichidagi matn deb o'yladi.", hint: "Maydon ichida qaysi kod ko'rinyapti? Undan oldin qaysi teg ochilgan-u, lekin yopilmagan?", alt: "Tugmasiz, ichida kod turgan katta maydon" },
    ru: { ctx: 'Ой, кнопки нет, а внутри большого поля — код!', q: 'Что потерялось в коде?', opts: ['</textarea>', '</button>', '<form>', '</select>'],
      ok: 'Именно! textarea не закрыт, поэтому браузер решил, что весь код дальше — текст внутри поля.', hint: 'Какой код виден внутри поля? Какой тег перед ним открыт, но не закрыт?', alt: 'Большое поле с кодом внутри и без кнопки' },
    en: { ctx: 'Oops, there’s no button, and there’s code inside the big field!', q: 'What is missing in the code?', opts: ['</textarea>', '</button>', '<form>', '</select>'],
      ok: 'Exactly! textarea isn’t closed, so the browser thought all the code after it was text inside the field.', hint: 'What code shows inside the field? Which tag before it is opened but not closed?', alt: 'A big field with code inside and no button' } },
  { id: 'html-07q2t4', target: 'html-07q2', ptype: 'HTML', tag: 'form', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<form>\n  <textarea></textarea>\n</form>\n<button>${T('Yuborish', 'Отправить', 'Send')}</button>`} mark={[4]} />; },
    uz: { ctx: "Mehmon tugmani bosdi, lekin anketa yuborilmadi.", q: "Nega yuborilmadi?", opts: ['textarea yopuvchi tegi yozilmagan', 'Tugma yozuvi atributga yozilgan', 'Tugma form tashqarisida turibdi', "Katta maydon ichi bo'sh qoldirilgan"],
      ok: "To'g'ri! Anketani faqat form ichidagi tugma yuboradi. Bu tugma esa </form> dan keyin turibdi.", hint: "Tugma qaysi teglar o'rtasida turibdi? U form ichidami?", alt: "Tugmasi form tashqarisida turgan kod" },
    ru: { ctx: 'Гость нажал кнопку, но анкета не отправилась.', q: 'Почему она не отправилась?', opts: ['У textarea не записан закрывающий тег', 'Надпись кнопки записана в атрибуте', 'Кнопка стоит снаружи тега form', 'Большое поле оставили совсем пустым'],
      ok: 'Верно! Анкету отправляет только кнопка внутри form. А эта кнопка стоит после </form>.', hint: 'Между какими тегами стоит кнопка? Она внутри form?', alt: 'Код, где кнопка стоит вне form' },
    en: { ctx: 'The guest tapped the button, but the form wasn’t sent.', q: 'Why wasn’t it sent?', opts: ['textarea has no closing tag written', 'The button label sits in an attribute', 'The button is outside the form tag', 'The big field was left completely empty'],
      ok: 'Right! Only a button inside form sends the form. And this button is after </form>.', hint: 'Between which tags is the button? Is it inside form?', alt: 'Code with the button outside form' } },
  { id: 'html-07q2t5', target: 'html-07q2', ptype: 'HTML', tag: 'button', correct: 1,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Гость' : L === 'en' ? 'Guest' : 'Mehmon'} text={L === 'ru' ? '«Нажал кнопку, страница открылась заново, поля пустые. Моя анкета пропала?»' : L === 'en' ? '“I tapped the button, the page opened again, the fields are empty. Did my form disappear?”' : "«Tugmani bosdim, sahifa qaytadan ochildi, maydonlar bo'sh. Anketam yo'qoldimi?»"} />,
    uz: { ctx: "Tugma form ichida turibdi.", q: "Nima bo'ldi?", opts: ["Brauzer buzilib, anketani o'chirib yubordi", 'Anketa yuborildi, sahifa qaytadan ochildi', "Tugma maydonlarni shunchaki tozalab qo'ydi", "textarea yopilmagani uchun hammasi o'chdi"],
      ok: "Xuddi shunday! Tugma form ichida turgani uchun anketa yuborildi. Serverimiz hali yo'q, shuning uchun sahifa qaytadan ochilib, maydonlar tozalandi.", hint: "Tugma form ichida. Anketa bilan nima bo'lishi kerak edi? Uni qabul qiladigan joyimiz bormi?", alt: "Mehmonning xabari" },
    ru: { ctx: 'Кнопка стоит внутри form.', q: 'Что произошло?', opts: ['Браузер сломался и стёр всю твою анкету', 'Анкета ушла, страница открылась заново', 'Кнопка всегда просто очищает все поля анкеты', 'Из-за незакрытого textarea всё стёрлось'],
      ok: 'Именно! Кнопка стоит внутри form, поэтому анкета отправилась. Сервера у нас пока нет, поэтому страница открылась заново, а поля очистились.', hint: 'Кнопка внутри form. Что должно случиться с анкетой? Есть ли у нас место, которое её принимает?', alt: 'Сообщение гостя' },
    en: { ctx: 'The button is inside form.', q: 'What happened?', opts: ['The browser broke and erased your whole form', 'The form was sent and the page reopened', 'The button simply clears all the fields', 'Everything vanished because textarea is not closed'],
      ok: 'Exactly! The button is inside form, so the form was sent. We don’t have a server yet, so the page opened again and the fields were cleared.', hint: 'The button is inside form. What should happen to the form? Do we have a place that receives it?', alt: 'The guest’s message' } }
];
