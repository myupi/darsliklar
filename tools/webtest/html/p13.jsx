// =============================================================================
// ТЕСТЫ К УРОКУ 13 КУРСА HTML «Список выбора и большое поле» (27.11.2026) — 5 вопросов, по файлу на вопрос. Урок 7 разделён на две части; это часть 1.
// Проверяем: select даёт выбрать готовый вариант; слово без option в список не попадает; текст между тегами textarea — внутри поля;
// textarea — для длинного текста; в select пункты — option, а не li. (Прежние t1, t4, t5 урока 7 + 2 новых.)
// Словарь урока 7: ochiladigan ro'yxat, variant, katta matn maydoni, tugma. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'formy-vybor';
const QS = [
  { id: 'html-07q1t1', target: 'html-07q1', ptype: 'HTML', tag: 'select', correct: 3,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Тренер' : L === 'en' ? 'Coach' : 'Murabbiy'} text={L === 'ru' ? '«Одни пишут игру Minecraft, другие mainkraft, третьи MINECRAFT. Пусть все пишут одинаково».' : L === 'en' ? '“Some write Minecraft, others write mainkraft, others MINECRAFT. Let everyone write it the same way.”' : "«Kimdir Minecraft, kimdir mainkraft, kimdir MINECRAFT deb yozyapti. Hamma bir xil yozsin»."} />,
    uz: { ctx: "Anketadagi o'yin nomlari chalkashib ketdi.", q: "Qaysi teg mehmonga tayyor variantlardan birini tanlatadi?", opts: ['textarea', 'label', 'placeholder', 'select'],
      ok: "Qoyil! select mehmonga yozdirmaydi, tayyor variantlardan birini tanlatadi. Shuning uchun hamma o'yin nomini bir xil qilib topshiradi.", hint: "Mehmon o'zi yozmasligi kerak, ro'yxatdan tanlashi kerak. Qaysi teg ochiladigan ro'yxat yasaydi?", alt: "Murabbiyning xabari" },
    ru: { ctx: 'Названия игр в анкете перепутались.', q: 'Какой тег даёт гостю выбрать один из готовых вариантов?', opts: ['textarea', 'label', 'placeholder', 'select'],
      ok: 'Здорово! select не даёт гостю писать самому, а предлагает выбрать готовый вариант. Поэтому все присылают название игры одинаково.', hint: 'Гостю не нужно писать самому, ему нужно выбрать из списка. Какой тег делает выпадающий список?', alt: 'Сообщение тренера' },
    en: { ctx: 'The game names in the form got mixed up.', q: 'Which tag lets a guest pick one of the ready choices?', opts: ['textarea', 'label', 'placeholder', 'select'],
      ok: 'Nice work! select doesn’t let the guest type, it offers ready choices to pick from. That’s why everyone sends the game name the same way.', hint: 'The guest shouldn’t type, they should pick from a list. Which tag makes a dropdown list?', alt: 'The coach’s message' } },
  { id: 'html-07q1t2', target: 'html-07q1', ptype: 'HTML', tag: 'option', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<select>\n  <option>${T('Palov', 'Плов', 'Pilaf')}</option>\n  ${T("Sho'rva", 'Суп', 'Soup')}\n  <option>${T('Manti', 'Манты', 'Manti')}</option>\n</select>`} mark={[3]} />; },
    uz: { ctx: "Ro'yxat ochildi: unda Palov va Manti bor, Sho'rva esa yo'q.", q: "Nega Sho'rva chiqmadi?", opts: ['select tegi yopilmagan', "Sho'rva juda uzun so'z", 'U option ichida emas', 'Manti oxirida turibdi'],
      ok: "Qoyil! Ochiladigan ro'yxatda har bir variant o'zining option tegida turadi. option siz so'z ro'yxatga tushmaydi.", hint: "Palov va Manti qaysi teg ichida turibdi? Sho'rva-chi?", alt: "Bitta so'zi option siz select kodi" },
    ru: { ctx: 'Список открылся: в нём Плов и Манты, а Супа нет.', q: 'Почему Суп не появился?', opts: ['Тег select не закрыт', 'Слово «Суп» слишком длинное', 'Он не внутри option', 'Манты стоят в конце'],
      ok: 'Здорово! В выпадающем списке каждый пункт стоит в своём теге option. Слово без option в список не попадает.', hint: 'В каком теге стоят Плов и Манты? А Суп?', alt: 'Код select, где одно слово без option' },
    en: { ctx: 'The list opened: Pilaf and Manti are there, but Soup is not.', q: 'Why didn’t Soup show up?', opts: ['The select tag isn’t closed', 'The word “Soup” is too long', 'It isn’t inside option', 'Manti is at the end'],
      ok: 'Nice work! In a dropdown list each choice sits in its own option tag. A word without option doesn’t get into the list.', hint: 'Which tag are Pilaf and Manti inside? And Soup?', alt: 'Select code with one word outside option' } },
  { id: 'html-07q1t3', target: 'html-07q1', ptype: 'HTML', tag: 'textarea', correct: 0, mono: true,
    vis: () => <WqVis html={`<textarea rows="3" cols="24">Salom!</textarea>`} />,
    uz: { ctx: "Sahifa ochilishi bilan katta maydon ichida «Salom!» yozuvi turibdi.", q: "Bu maydonning kodi qaysi?", opts: ['<textarea>Salom!</textarea>', '<textarea="Salom!"></textarea>', '<textarea></textarea>Salom!', '<textarea text="Salom!"></textarea>'],
      ok: "To'g'ri! Maydon ichidagi tayyor yozuv textarea ochuvchi va yopuvchi teglari o'rtasiga yoziladi.", hint: "Yozuv maydonning ichida chiqishi kerak. Uni teglar o'rtasiga yozamizmi yoki ularning tashqarisigami?", alt: "Ichida yozuvi bor katta maydon" },
    ru: { ctx: 'Когда страница открылась, внутри большого поля уже стоит надпись «Salom!».', q: 'Какой код у этого поля?', opts: ['<textarea>Salom!</textarea>', '<textarea="Salom!"></textarea>', '<textarea></textarea>Salom!', '<textarea text="Salom!"></textarea>'],
      ok: 'Верно! Готовый текст внутри поля пишут между открывающим и закрывающим тегами textarea.', hint: 'Текст должен появиться внутри поля. Его пишут между тегами или снаружи?', alt: 'Большое поле с готовым текстом внутри' },
    en: { ctx: 'When the page opened, the big field already has “Salom!” inside.', q: 'Which code makes this field?', opts: ['<textarea>Salom!</textarea>', '<textarea="Salom!"></textarea>', '<textarea></textarea>Salom!', '<textarea text="Salom!"></textarea>'],
      ok: 'Right! Ready text inside the field goes between the opening and closing textarea tags.', hint: 'The text must appear inside the field. Does it go between the tags or outside them?', alt: 'A big field with ready text inside' } },
  { id: 'html-07q1t4', target: 'html-07q1', ptype: 'HTML', tag: 'textarea', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<label>\n  ${T('Fikringiz', 'Твой отзыв', 'Your feedback')}\n  <___></___>\n</label>`} mark={[3]} />; },
    uz: { ctx: "Mehmon bir necha qatorli uzun fikr yozishi kerak.", q: "Bo'sh joylarga qaysi teg mos?", opts: ['input', 'textarea', 'select', 'option'],
      ok: "To'ppa-to'g'ri! textarea — katta matn maydoni: unga bir necha qator yozsa bo'ladi. input esa bitta qatorli.", hint: "input bitta qator uchun, select tayyor variantlardan tanlash uchun. Uzun matn uchun qaysi biri edi?", alt: "Tegi bo'sh maydon kodi" },
    ru: { ctx: 'Гость должен написать длинный отзыв в несколько строк.', q: 'Какой тег подходит на пустые места?', opts: ['input', 'textarea', 'select', 'option'],
      ok: 'Верно! textarea — большое поле для текста: в нём можно писать несколько строк. А input — в одну строку.', hint: 'input — для одной строки, select — для выбора из готовых пунктов. Какой был для длинного текста?', alt: 'Код поля с пустым тегом' },
    en: { ctx: 'A guest must write long feedback over several lines.', q: 'Which tag fits the empty spots?', opts: ['input', 'textarea', 'select', 'option'],
      ok: 'Right! textarea is a big text field: you can write several lines in it. input is just one line.', hint: 'input is for one line, select is for picking ready choices. Which one was for long text?', alt: 'Field code with an empty tag' } },
  { id: 'html-07q1t5', target: 'html-07q1', ptype: 'HTML', tag: 'option', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<select>\n  <li>${T('Futbol', 'Футбол', 'Football')}</li>\n  <li>${T('Shaxmat', 'Шахматы', 'Chess')}</li>\n</select>`; return <WqVis code={h} mark={[2, 3]} html={h} />; },
    uz: { ctx: "Ochiladigan ro'yxat bo'm-bo'sh chiqdi.", q: "Qaysi almashtirish uni tuzatadi?", opts: ['li → ul', 'select → ol', 'li → option', 'select → form'],
      ok: "Qoyil! li — oddiy ro'yxatning bandi. Ochiladigan ro'yxatning variantlari esa option tegida turadi.", hint: "li qaysi ro'yxatlarda yashaydi: ul va ol ichida. select ichida variantlar qaysi tegda bo'ladi?", alt: "Bo'sh ochiladigan ro'yxat" },
    ru: { ctx: 'Выпадающий список получился пустым.', q: 'Какая замена его починит?', opts: ['li → ul', 'select → ol', 'li → option', 'select → form'],
      ok: 'Здорово! li — пункт обычного списка. А пункты выпадающего списка стоят в теге option.', hint: 'li — из каких списков: из ul и ol. В каком теге пункты внутри select?', alt: 'Пустой выпадающий список' },
    en: { ctx: 'The dropdown list came out empty.', q: 'Which swap fixes it?', opts: ['li → ul', 'select → ol', 'li → option', 'select → form'],
      ok: 'Nice work! li is an item of a regular list. Dropdown choices go in the option tag.', hint: 'li is from which lists: ul and ol. Which tag holds the choices inside select?', alt: 'An empty dropdown list' } }
];
