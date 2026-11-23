// =============================================================================
// ТЕСТЫ К УРОКУ 8 МОДУЛЯ BOOTSTRAP «Формы» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: поле ввода — form-control; у select в Bootstrap 6 тоже form-control (form-select — имя версии 5);
// подпись — form-label; выбор одного из нескольких — radio; галочка — check (form-check-input — имя версии 5).
// Страница — честная (bs={BS_CSS}). Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'formy';
const b7Name = (T) => T('Ismingiz', 'Ваше имя', 'Your name');
const QS = [
  { id: 'bootstrap-08t1', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'form-control', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<input type="text" class="___"\n       placeholder="${b7Name(T)}">`} html={`<input type="text" class="form-control" placeholder="${b7Name(T)}">`} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Ism maydoni o'ngdagidek bo'lishi kerak: butun kenglikda, yumaloq burchakli.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['form-input', 'input-control', 'form-control', 'form-label'],
      ok: "To'ppa-to'g'ri! form-control maydonni chiroyli qiladi: butun kenglik, ramka, ichki bo'sh joy.", hint: "Darsda bitta so'z barcha maydonlarga yozilgan edi. U form bilan boshlanadi. form-label esa nima uchun edi?", alt: "Chiroyli ism maydoni" },
    ru: { ctx: 'Поле имени должно стать как справа: во всю ширину, со скруглёнными углами.', q: 'Какое слово пишется на пустое место?', opts: ['form-input', 'input-control', 'form-control', 'form-label'],
      ok: 'Верно! form-control делает поле красивым: вся ширина, рамка, отступы внутри.', hint: 'В уроке одно слово писали всем полям. Оно начинается с form. А для чего было form-label?', alt: 'Красивое поле имени' },
    en: { ctx: 'The name field should look like the one on the right: full width, rounded corners.', q: 'Which word goes in the empty spot?', opts: ['form-input', 'input-control', 'form-control', 'form-label'],
      ok: 'Right! form-control makes the field nice: full width, a border and space inside.', hint: 'In the lesson one word went on every field. It starts with form. And what was form-label for?', alt: 'A nice name field' } },
  { id: 'bootstrap-08t2', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'select', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); const opt = (t) => `<option>${t}</option>`; return <WqVis code={`<select class="___">\n  ${opt(T('Dushanba', 'Понедельник', 'Monday'))}\n  ${opt(T('Shanba', 'Суббота', 'Saturday'))}\n</select>`} html={`<select class="form-control">${opt(T('Dushanba', 'Понедельник', 'Monday'))}${opt(T('Shanba', 'Суббота', 'Saturday'))}</select>`} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Kunni tanlash ro'yxati boshqa maydonlar bilan bir xil ko'rinishi kerak.", q: "select-ga qaysi so'z yoziladi?", opts: ['form-control', 'form-select', 'select-control', 'form-option'],
      ok: "Qoyil! Bootstrap 6 da select ham form-control bilan yoziladi: barcha maydonlarga bitta so'z. form-select esa beshinchi versiyadan qolgan.", hint: "Darsdagi topishmoqni eslang: har bir maydon turiga o'z so'zi kerakmi yoki bitta so'z hammasiga yetadimi?", alt: "Chiroyli kun tanlash ro'yxati" },
    ru: { ctx: 'Список выбора дня должен выглядеть так же, как другие поля.', q: 'Какое слово пишется у select?', opts: ['form-control', 'form-select', 'select-control', 'form-option'],
      ok: 'Здорово! В Bootstrap 6 и у select пишут form-control: одно слово для всех полей. А form-select остался от пятой версии.', hint: 'Вспомните загадку урока: каждому виду поля своё слово или одно слово на всех?', alt: 'Красивый список выбора дня' },
    en: { ctx: 'The day picker should look the same as the other fields.', q: 'Which word goes on the select?', opts: ['form-control', 'form-select', 'select-control', 'form-option'],
      ok: 'Nice work! In Bootstrap 6 a select also gets form-control: one word for every field. form-select is left over from version 5.', hint: 'Remember the lesson’s riddle: does each kind of field need its own word, or does one word cover them all?', alt: 'A nice day picker' } },
  { id: 'bootstrap-08t3', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'form-label', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<label for="ism" class="___">\n  ${b7Name(T)}\n</label>\n<input id="ism" class="form-control">`} html={`<label for="ism" class="form-label">${b7Name(T)}</label><input id="ism" class="form-control">`} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Maydon ustidagi yozuv o'ngdagidek: ozgina pastida bo'sh joy bilan turishi kerak.", q: "label-ga qaysi so'z yoziladi?", opts: ['form-text', 'label-control', 'form-control', 'form-label'],
      ok: "Xuddi shunday! form-label — maydon yozuvi uchun. form-control esa maydonning o'ziga yoziladi.", hint: "Maydonning o'ziga form-control yozilgan. Yozuv inglizcha label. Ikkalasini qo'shib ko'ring.", alt: "Yozuvli ism maydoni" },
    ru: { ctx: 'Подпись над полем должна стоять как справа: с небольшим отступом снизу.', q: 'Какое слово пишется у label?', opts: ['form-text', 'label-control', 'form-control', 'form-label'],
      ok: 'Именно! form-label — для подписи поля. А form-control пишут самому полю.', hint: 'У самого поля уже стоит form-control. Подпись по-английски — label. Соедините.', alt: 'Поле имени с подписью' },
    en: { ctx: 'The label above the field should look like on the right: with a little space below.', q: 'Which word goes on the label?', opts: ['form-text', 'label-control', 'form-control', 'form-label'],
      ok: 'Exactly! form-label is for a field’s label. form-control goes on the field itself.', hint: 'The field already has form-control. The caption is a label in English. Put them together.', alt: 'A name field with a label' } },
  { id: 'bootstrap-08t4', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'radio', correct: 1,
    vis: (L) => { const T = aqL(L); const f = (inp, t) => `<div class="form-field">${inp}<label>${t}</label></div>`;
      return <WqVis html={[f('<input type="checkbox" class="check" checked>', 'check'), f('<input type="radio" class="radio" checked>', 'radio'), f('<div class="switch"><input type="checkbox" role="switch" switch checked></div>', 'switch'), `<input class="form-control" placeholder="form-control">`].join('')} bs={BS_CSS} />; },
    uz: { ctx: "Ro'yxatdan o'tish formasida savol bor: «Qaysi kuni kelasiz?» Javob — faqat bitta kun.", q: 'Bunday tanlov uchun qaysi maydon kerak?', opts: ['check — kvadrat, galochka', 'radio — dumaloq tanlov', 'switch — yoqib-o\'chirgich', 'form-control — matn maydoni'],
      ok: "Juda zo'r! radio bir guruhdan faqat bittasini tanlatadi: boshqasini bossangiz, oldingisi o'chadi. check esa bir nechtasini belgilashga ruxsat beradi.", hint: "Galochkalarni bir nechta qo'yish mumkin. Qaysi maydonda biri tanlansa, qolgani o'chadi?", alt: "Uch xil tanlov maydoni va matn maydoni" },
    ru: { ctx: 'В анкете вопрос: «В какой день придёте?» Ответ — только один день.', q: 'Какое поле нужно для такого выбора?', opts: ['check — квадрат с галочкой', 'radio — круглый выбор', 'switch — переключатель', 'form-control — текстовое поле'],
      ok: 'Отлично! radio даёт выбрать в группе только один: нажмёте другой — прежний снимется. А check разрешает отметить несколько.', hint: 'Галочек можно поставить несколько. В каком поле при выборе одного остальные снимаются?', alt: 'Три вида полей выбора и текстовое поле' },
    en: { ctx: 'The sign-up form asks: “Which day will you come?” The answer is only one day.', q: 'Which field is needed for this choice?', opts: ['check — square with a tick', 'radio — round choice', 'switch — on/off toggle', 'form-control — text field'],
      ok: 'Great! radio lets you pick only one in a group: click another and the first is cleared. check lets you tick several.', hint: 'You can tick several checkboxes. In which field does picking one clear the rest?', alt: 'Three kinds of choice fields and a text field' } },
  { id: 'bootstrap-08t5', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'check', correct: 2,
    vis: (L) => { const T = aqL(L); const src = `<div class="form-field">\n  <input type="checkbox" class="form-check-input">\n  <label>${T('Qoidalarga roziman', 'Согласен с правилами', 'I agree to the rules')}</label>\n</div>`; return <WqVis code={src} html={src} bs={BS_CSS} mark={[2]} />; },
    uz: { ctx: "Eski darslikdan olingan galochka Bootstrap ko'rinishini olmadi: oddiy brauzer katakchasi qoldi.", q: 'Nega?', opts: ["checkbox-ga class yozilmaydi", "galochka faqat form ichida ishlaydi", "form-check-input — 5-versiya nomi", "type=\"check\" yozish kerak"],
      ok: "To'ppa-to'g'ri! Bu nom eski. Bootstrap 6 da galochka shunchaki check, dumaloq tanlov — radio.", hint: "Bootstrap ulangan, demak gap class so'zida. Belgilangan so'z qaysi versiyadan?", alt: "Oddiy brauzer galochkasi va uning kodi" },
    ru: { ctx: 'Галочка из старого учебника не получила вид Bootstrap: остался обычный квадратик браузера.', q: 'Почему?', opts: ['у checkbox не бывает class', 'галочка работает только в form', 'form-check-input — имя 5-й версии', 'нужно писать type="check"'],
      ok: 'Верно! Это старое имя. В Bootstrap 6 галочка — просто check, круглый выбор — radio.', hint: 'Bootstrap подключён, значит, дело в слове в class. Из какой версии выделенное слово?', alt: 'Обычная галочка браузера и её код' },
    en: { ctx: 'A checkbox from an old tutorial didn’t get the Bootstrap look: it stayed a plain browser box.', q: 'Why?', opts: ['a checkbox can’t have a class', 'it only works inside a form', 'form-check-input is a v5 name', 'it needs type="check"'],
      ok: 'Right! That name is old. In Bootstrap 6 a checkbox is just check, and the round choice is radio.', hint: 'Bootstrap is connected, so the problem is the class word. Which version is the marked word from?', alt: 'A plain browser checkbox and its code' } }
];
