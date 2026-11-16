// =============================================================================
// ТЕСТЫ К УРОКУ 7 КУРСА HTML «Формы, часть 2: выбор и отправка» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: слово в select без option в список не попадает; незакрытый textarea проглатывает код; надпись кнопки —
// между тегами; большое поле — textarea; в select пункты — option, а не li.
// Словарь урока 7: ochiladigan ro'yxat, variant, katta matn maydoni, tugma. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'formy-vybor';
const QS = [
  { id: 'html-07t1', target: 'html-07', ptype: 'HTML', tag: 'option', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<select>\n  <option>${T('Palov', 'Плов', 'Pilaf')}</option>\n  ${T("Sho'rva", 'Суп', 'Soup')}\n  <option>${T('Manti', 'Манты', 'Manti')}</option>\n</select>`} mark={[3]} />; },
    uz: { ctx: "Ro'yxat ochildi: unda Palov va Manti bor, Sho'rva esa yo'q.", q: "Nega Sho'rva chiqmadi?", opts: ['select tegi yopilmagan', "Sho'rva juda uzun so'z", 'U option ichida emas', 'Manti oxirida turibdi'],
      ok: "Qoyil! Ochiladigan ro'yxatda har bir variant o'zining option tegida turadi. option siz so'z ro'yxatga tushmaydi.", hint: "Palov va Manti qaysi teg ichida turibdi? Sho'rva-chi?", alt: "Bitta so'zi option siz select kodi" },
    ru: { ctx: 'Список открылся: в нём Плов и Манты, а Супа нет.', q: 'Почему Суп не появился?', opts: ['Тег select не закрыт', 'Слово «Суп» слишком длинное', 'Он не внутри option', 'Манты стоят в конце'],
      ok: 'Здорово! В выпадающем списке каждый пункт стоит в своём теге option. Слово без option в список не попадает.', hint: 'В каком теге стоят Плов и Манты? А Суп?', alt: 'Код select, где одно слово без option' },
    en: { ctx: 'The list opened: Pilaf and Manti are there, but Soup is not.', q: 'Why didn’t Soup show up?', opts: ['The select tag isn’t closed', 'The word “Soup” is too long', 'It isn’t inside option', 'Manti is at the end'],
      ok: 'Nice work! In a dropdown list each choice sits in its own option tag. A word without option doesn’t get into the list.', hint: 'Which tag are Pilaf and Manti inside? And Soup?', alt: 'Select code with one word outside option' } },
  { id: 'html-07t2', target: 'html-07', ptype: 'HTML', tag: 'textarea', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<form>\n  <textarea>\n  <button>${T('Yuborish', 'Отправить', 'Send')}</button>\n</form>`; return <WqVis code={h} mark={[2]} html={h} />; },
    uz: { ctx: "Voy, tugma yo'q, katta maydonning ichida esa kod turibdi!", q: "Kodda nima tushib qolibdi?", opts: ['</textarea>', '</button>', '<form>', '</select>'],
      ok: "Xuddi shunday! textarea yopilmagan, shuning uchun brauzer keyingi hamma kodni maydon ichidagi matn deb o'yladi.", hint: "Maydon ichida qaysi kod ko'rinyapti? Undan oldin qaysi teg ochilgan-u, lekin yopilmagan?", alt: "Tugmasiz, ichida kod turgan katta maydon" },
    ru: { ctx: 'Ой, кнопки нет, а внутри большого поля — код!', q: 'Что потерялось в коде?', opts: ['</textarea>', '</button>', '<form>', '</select>'],
      ok: 'Именно! textarea не закрыт, поэтому браузер решил, что весь код дальше — текст внутри поля.', hint: 'Какой код виден внутри поля? Какой тег перед ним открыт, но не закрыт?', alt: 'Большое поле с кодом внутри и без кнопки' },
    en: { ctx: 'Oops, there’s no button, and there’s code inside the big field!', q: 'What is missing in the code?', opts: ['</textarea>', '</button>', '<form>', '</select>'],
      ok: 'Exactly! textarea isn’t closed, so the browser thought all the code after it was text inside the field.', hint: 'What code shows inside the field? Which tag before it is opened but not closed?', alt: 'A big field with code inside and no button' } },
  { id: 'html-07t3', target: 'html-07', ptype: 'HTML', tag: 'button', correct: 3, mono: true,
    uz: { ctx: "Tugmada «Yuborish» yozuvi chiqishi kerak.", q: "Qaysi qator to'g'ri?", opts: ['<button="Yuborish">', '<button>Yuborish', '<button text="Yuborish">', '<button>Yuborish</button>'],
      ok: "Juda zo'r! Tugmaning yozuvi ochuvchi va yopuvchi teglar o'rtasida turadi. button input emas: uning yopuvchi tegi bor.", hint: "Tugma yozuvi qayerda turadi: atributdami yoki teglar o'rtasida? button tegining yopuvchisi bormi?", alt: "Tugma kodining to'rtta varianti" },
    ru: { ctx: 'На кнопке должна быть надпись «Отправить».', q: 'Какая строка правильная?', opts: ['<button="Yuborish">', '<button>Yuborish', '<button text="Yuborish">', '<button>Yuborish</button>'],
      ok: 'Отлично! Надпись кнопки стоит между открывающим и закрывающим тегами. button — не input: у него есть закрывающий тег.', hint: 'Где стоит надпись кнопки: в атрибуте или между тегами? Есть ли у button закрывающий тег?', alt: 'Четыре варианта кода кнопки' },
    en: { ctx: 'The button must say “Send”.', q: 'Which line is correct?', opts: ['<button="Yuborish">', '<button>Yuborish', '<button text="Yuborish">', '<button>Yuborish</button>'],
      ok: 'Great! The button text goes between the opening and closing tags. button isn’t input: it has a closing tag.', hint: 'Where does the button text go: in an attribute or between tags? Does button have a closing tag?', alt: 'Four versions of button code' } },
  { id: 'html-07t4', target: 'html-07', ptype: 'HTML', tag: 'textarea', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<label>\n  ${T('Fikringiz', 'Твой отзыв', 'Your feedback')}\n  <___></___>\n</label>`} mark={[3]} />; },
    uz: { ctx: "Mehmon bir necha qatorli uzun fikr yozishi kerak.", q: "Bo'sh joylarga qaysi teg mos?", opts: ['input', 'textarea', 'select', 'option'],
      ok: "To'ppa-to'g'ri! textarea — katta matn maydoni: unga bir necha qator yozsa bo'ladi. input esa bitta qatorli.", hint: "input bitta qator uchun, select tayyor variantlardan tanlash uchun. Uzun matn uchun qaysi biri edi?", alt: "Tegi bo'sh maydon kodi" },
    ru: { ctx: 'Гость должен написать длинный отзыв в несколько строк.', q: 'Какой тег подходит на пустые места?', opts: ['input', 'textarea', 'select', 'option'],
      ok: 'Верно! textarea — большое поле для текста: в нём можно писать несколько строк. А input — в одну строку.', hint: 'input — для одной строки, select — для выбора из готовых пунктов. Какой был для длинного текста?', alt: 'Код поля с пустым тегом' },
    en: { ctx: 'A guest must write long feedback over several lines.', q: 'Which tag fits the empty spots?', opts: ['input', 'textarea', 'select', 'option'],
      ok: 'Right! textarea is a big text field: you can write several lines in it. input is just one line.', hint: 'input is for one line, select is for picking ready choices. Which one was for long text?', alt: 'Field code with an empty tag' } },
  { id: 'html-07t5', target: 'html-07', ptype: 'HTML', tag: 'option', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<select>\n  <li>${T('Futbol', 'Футбол', 'Football')}</li>\n  <li>${T('Shaxmat', 'Шахматы', 'Chess')}</li>\n</select>`; return <WqVis code={h} mark={[2, 3]} html={h} />; },
    uz: { ctx: "Ochiladigan ro'yxat bo'm-bo'sh chiqdi.", q: "Qaysi almashtirish uni tuzatadi?", opts: ['li → ul', 'select → ol', 'li → option', 'select → form'],
      ok: "Qoyil! li — oddiy ro'yxatning bandi. Ochiladigan ro'yxatning variantlari esa option tegida turadi.", hint: "li qaysi ro'yxatlarda yashaydi: ul va ol ichida. select ichida variantlar qaysi tegda bo'ladi?", alt: "Bo'sh ochiladigan ro'yxat" },
    ru: { ctx: 'Выпадающий список получился пустым.', q: 'Какая замена его починит?', opts: ['li → ul', 'select → ol', 'li → option', 'select → form'],
      ok: 'Здорово! li — пункт обычного списка. А пункты выпадающего списка стоят в теге option.', hint: 'li — из каких списков: из ul и ol. В каком теге пункты внутри select?', alt: 'Пустой выпадающий список' },
    en: { ctx: 'The dropdown list came out empty.', q: 'Which swap fixes it?', opts: ['li → ul', 'select → ol', 'li → option', 'select → form'],
      ok: 'Nice work! li is an item of a regular list. Dropdown choices go in the option tag.', hint: 'li is from which lists: ul and ol. Which tag holds the choices inside select?', alt: 'An empty dropdown list' } }
];
