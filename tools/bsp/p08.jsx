// =============================================================================
// ===== ПРАКТИКА 7 · «Ro'yxat formasi» · к уроку 8 «Формы» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Анкета записи в кружок роботов (как в уроке 7). При обновлении у полей пропали слова форм —
// анкета стала «кашей» браузера, вкладки погасли. Ученик чинит пять страниц: поменять слово у подписи (form-control →
// form-label: подпись выглядела полем) → вписать form-control в пустой class у textarea (одно слово для всех полей) →
// взять переключатель с сайта (Forms → Switch) и настроить подпись → починить имена версии 5 (form-select, form-check,
// form-check-input) → своя анкета: подпись form-label, поле form-control, галочка или переключатель с сайта, кнопка.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-08p-formy.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-08p-formy',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "8-amaliyot. Ro'yxat formasi", ru: 'Практика 8. Анкета записи', en: 'Practice 8. The sign-up form' }
};

const P7 = {
  club: L3("Robot to'garagiga yozilish", 'Запись в кружок роботов', 'Robot club sign-up'),
  name: L3("Ism", 'Имя', 'Name'), phone: L3("Telefon", 'Телефон', 'Phone'), note: L3("Izoh", 'Комментарий', 'Comment'),
  group: L3("Guruh", 'Группа', 'Group'), g1: L3("Robototexnika", 'Робототехника', 'Robotics'), g2: L3("Dasturlash", 'Программирование', 'Coding'),
  agree: L3("Qoidalarga roziman", 'Согласен с правилами', 'I agree to the rules'), news: L3("Yangiliklarni olish", 'Получать новости', 'Get the news'),
  morning: L3("Ertalab", 'Утром', 'Morning'), send: L3("Yuborish", 'Отправить', 'Send'),
  t1: L3("Ism", 'Имя', 'Name'), t2: L3("Izoh", 'Комментарий', 'Comment'), t3: L3("Yangiliklar", 'Новости', 'News'), t4: L3("Guruh", 'Группа', 'Group'),
  mine: L3("Mening formam", 'Моя анкета', 'My form'), myH: L3("Musobaqaga yozilish", 'Запись на соревнование', 'Contest sign-up'),
  team: L3("Jamoa nomi", 'Название команды', 'Team name')
};
const P7_PRE = (pk, h) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h4>' + pk(h || P7.club) + '</h4>', '  <form>'];
const P7_POST = ['  </form>', '</body>'];
const p7L = (id, t, cls) => '    <label for="' + id + '"' + (cls == null ? ' class="form-label"' : cls === false ? '' : ' class="' + cls + '"') + '>' + t + '</label>';
const p7I = (type, id, cls) => '    <input type="' + type + '" id="' + id + '"' + (cls == null ? ' class="form-control"' : cls === false ? '' : ' class="' + cls + '"') + '>';
const p7Note = (cls) => '    <textarea id="izoh" rows="2"' + (cls == null ? ' class="form-control"' : cls === false ? '' : ' class="' + cls + '"') + '></textarea>';
const p7Sel = (pk, cls) => '    <select id="guruh"' + (cls == null ? ' class="form-control"' : cls === false ? '' : ' class="' + cls + '"') + '>\n      <option>' + pk(P7.g1) + '</option>\n      <option>' + pk(P7.g2) + '</option>\n    </select>';
const p7Chk = (t, o) => { const x = o || {}; return '    <div' + (x.f === false ? '' : ' class="' + (x.f || 'form-field') + '"') + '>\n      <input type="' + (x.type || 'checkbox') + '" id="' + (x.id || 'rozi') + '"' + (x.c === false ? '' : ' class="' + (x.c || 'check') + '"') + '>\n      <label for="' + (x.id || 'rozi') + '">' + t + '</label>\n    </div>'; };
const p7Btn = (pk, cls) => '    <button type="submit"' + (cls === false ? '' : ' class="' + (cls || 'btn-solid theme-primary') + '"') + '>' + pk(P7.send) + '</button>';
// Сайт: примеры Forms (как в уроке 7).
const P7_SW = '<div class="form-field">\n  <div class="switch">\n    <input type="checkbox" value="" id="switchMdLabel" role="switch" switch>\n  </div>\n  <label for="switchMdLabel">Default switch</label>\n</div>';
const P7_CHK = '<div class="form-field">\n  <input type="checkbox" id="checkLabel" class="check" />\n  <label for="checkLabel">Example new checkbox</label>\n</div>';
const P7_FC = '<label for="exampleFormControlInput" class="form-label mb-2">Email address</label>\n<input type="email" class="form-control" id="exampleFormControlInput" placeholder="name@example.com">';
const P7_DOCS_SW = { page: L3("Forms · Switch · Checkbox", 'Forms · Switch · Checkbox', 'Forms · Switch · Checkbox'), items: [
  { k: 'sw', title: 'Switch · HTML', code: P7_SW }, { k: 'chk', title: 'Checkbox · HTML', code: P7_CHK }
] };
const P7_DOCS_FIX = { page: L3("Forms", 'Forms', 'Forms'), items: [
  { k: 'w', title: 'Form control · Select', chips: ['form-label', 'form-control'], copy: false },
  { k: 'c', title: 'Checkbox · Radio · Switch', chips: ['form-field', 'check', 'radio', 'switch'], copy: false }
] };
const P7_DOCS_OWN = { page: L3("Forms", 'Forms', 'Forms'), items: [
  { k: 'fc', title: 'Form control · HTML', code: P7_FC }, { k: 'chk', title: 'Checkbox · HTML', code: P7_CHK }, { k: 'sw', title: 'Switch · HTML', code: P7_SW },
  { k: 'btn', title: 'Button', chips: ['btn-solid', 'theme-primary', 'theme-success'], copy: false }
] };
const P7_SAMPLES = ['Default switch', 'Example new checkbox', 'Email address'];
const p7Sample = (D) => P7_SAMPLES.some((t) => D.doc.body.textContent.indexOf(t) >= 0);

const PR = {
  next: L3("Karusel", 'Карусель', 'Carousel'),
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P7.t1, file: 'ism.html' },
    { ico: 'mail', c: '#0FA38E', name: P7.t2, file: 'izoh.html' },
    { ico: 'book', c: '#7C5CFA', name: P7.t3, file: 'yangiliklar.html' },
    { ico: 'leaf', c: '#F59E0B', name: P7.t4, file: 'guruh.html' },
    { ico: 'heart', c: '#E44D8A', name: P7.mine, file: 'my.html' }
  ],
  // Крючок: красивая анкета; после «Yangilash» у полей нет слов форм — «каша» браузера.
  hook: {
    vw: 480,
    doc: (pk, on) => P7_PRE(pk).concat([p7L('ism', pk(P7.name), on ? null : false), p7I('text', 'ism', on ? null : false), p7L('guruh', pk(P7.group), on ? null : false),
      p7Sel(pk, on ? null : false), p7Chk(pk(P7.agree), on ? {} : { f: false, c: false }), p7Btn(pk, on ? null : false)], P7_POST).join('\n')
  },
  ownVw: 480,
  ownDefault: (pk) => P7_PRE(pk, P7.myH).concat([p7L('jamoa', pk(P7.team)), p7I('text', 'jamoa'), p7Chk(pk(P7.agree)), p7Btn(pk, 'btn-solid theme-success')], P7_POST).join('\n'),
  tasks: [
    // Т1 · слово у подписи в готовом class: подпись выглядела полем (form-control → form-label).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 480, pre: P7_PRE(pk), post: P7_POST,
      code0: p7L('ism', pk(P7.name), 'form-control') + '\n' + p7I('text', 'ism'), answer: p7L('ism', pk(P7.name)) + '\n' + p7I('text', 'ism'),
      goal: (D) => (D.has('label', 'form-label') ? null : C.t1.no),
      sample: ['<label for="tel" class="form-label">…</label>'],
      drill: { code0: p7L('tel', pk(P7.phone), 'form-control') + '\n' + p7I('tel', 'tel'), answer: p7L('tel', pk(P7.phone)) + '\n' + p7I('tel', 'tel'),
        goal: (D) => (D.has('label', 'form-label') ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class у textarea: одно слово для всех полей (form-control).
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 480, pre: P7_PRE(pk), post: P7_POST,
      code0: p7L('izoh', pk(P7.note)) + '\n' + p7Note(''), answer: p7L('izoh', pk(P7.note)) + '\n' + p7Note(),
      goal: (D) => (D.has('textarea', 'form-control') ? null : D.has('textarea', 'form-label') ? C.t2.label : C.t2.no),
      sample: ['<input type="text" id="ism" class="form-control">'],
      drill: { code0: p7L('guruh', pk(P7.group)) + '\n' + p7Sel(pk, ''), answer: p7L('guruh', pk(P7.group)) + '\n' + p7Sel(pk),
        goal: (D) => (D.has('select', 'form-control') ? null : C.t2.drillNo) }
    }),
    // Т3 · переключатель с сайта (Forms → Switch): скопировать, вставить, своя подпись.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 480, pre: P7_PRE(pk), post: P7_POST, docs: () => P7_DOCS_SW,
      code0: '', answer: '    <div class="form-field">\n      <div class="switch">\n        <input type="checkbox" value="" id="yangi" role="switch" switch>\n      </div>\n      <label for="yangi">' + pk(P7.news) + '</label>\n    </div>',
      goal: (D) => {
        const sw = D.q('.switch input[switch], .switch input[role="switch"]');
        if (!sw) return D.q('.check') ? C.t3.check : C.t3.noSw;
        if (!sw.closest('.form-field')) return C.t3.field;
        if (p7Sample(D)) return C.t3.sample;
        return D.text('.form-field label').length > 2 ? null : C.t3.noText;
      },
      sample: ['<div class="form-field">', '  <div class="switch">…</div>', '  <label for="…">…</label>', '</div>'],
      drill: { code0: '', answer: p7Chk(pk(P7.agree)),
        goal: (D) => (D.q('.form-field > input.check') && !p7Sample(D) && D.text('.form-field label').length > 2 ? null : C.t3.drillNo) }
    }),
    // Т4 · имена версии 5: form-select → form-control, form-check → form-field, form-check-input → check.
    (pk) => bpTask(4, {
      kind: 'fix', vw: 480, pre: P7_PRE(pk), post: P7_POST, docs: () => P7_DOCS_FIX,
      code0: [p7L('guruh', pk(P7.group)), p7Sel(pk, 'form-select'), p7Chk(pk(P7.agree), { f: 'form-check', c: 'form-check-input' })].join('\n'),
      answer: [p7L('guruh', pk(P7.group)), p7Sel(pk), p7Chk(pk(P7.agree))].join('\n'),
      goal: (D) => {
        if (!D.has('select', 'form-control')) return C.t4.sel;
        return D.q('.form-field > input.check') ? null : C.t4.chk;
      },
      sample: ['<select class="form-control">…</select>', '<div class="form-field">', '  <input type="checkbox" class="check">'],
      drill: { code0: p7Chk(pk(P7.morning), { type: 'radio', id: 'v1', c: 'form-check-input' }), answer: p7Chk(pk(P7.morning), { type: 'radio', id: 'v1', c: 'radio' }),
        goal: (D) => (D.q('input.radio') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя анкета: подпись form-label, поле form-control, галочка или переключатель с сайта, кнопка с цветом.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 480, pre: P7_PRE(pk, P7.myH), post: P7_POST, docs: () => P7_DOCS_OWN,
      code0: [p7L('jamoa', pk(P7.team), ''), p7I('text', 'jamoa', ''), '    ', '    <button type="submit" class="">' + pk(P7.send) + '</button>'].join('\n'),
      answer: [p7L('jamoa', pk(P7.team)), p7I('text', 'jamoa'), p7Chk(pk(P7.agree)), p7Btn(pk, 'btn-solid theme-success')].join('\n'),
      list: [
        { t: L3("label: form-label", 'label: form-label', 'label: form-label'), ok: (D) => D.has('label', 'form-label') },
        { t: L3("input: form-control", 'input: form-control', 'input: form-control'), ok: (D) => D.has('input[type="text"]', 'form-control') },
        { t: L3("check, radio yoki switch", 'check, radio или switch', 'check, radio or switch'), ok: (D) => !!D.q('.form-field input.check, .form-field input.radio, .form-field .switch input') && !p7Sample(D) },
        { t: L3("tugma: btn-solid va theme-…", 'кнопка: btn-solid и theme-…', 'button: btn-solid and theme-…'), ok: (D) => D.has('button', 'btn-solid') && !!D.theme('button') }
      ],
      goal: (D) => {
        if (!D.has('label', 'form-label')) return C.t5.label;
        if (!D.has('input[type="text"]', 'form-control')) return C.t5.input;
        if (!D.q('.form-field input.check, .form-field input.radio, .form-field .switch input')) return C.t5.choice;
        if (p7Sample(D)) return C.t5.sample;
        if (!(D.has('button', 'btn-solid') && D.theme('button'))) return C.t5.btn;
        return null;
      },
      sample: ['<label for="ism" class="form-label">…</label>', '<input type="text" id="ism" class="form-control">', '<div class="form-field">…</div>', '<button type="submit" class="btn-solid theme-danger">…</button>'],
      onSolved: (st) => store.set('myDoc', P7_PRE(pk, P7.myH).concat([st.code.replace(/\s+$/, '')], P7_POST).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Ro'yxat formasi", 'Анкета записи', 'Sign-up form'),
    say: L3("Salom! Bu to'garakka yozilish formasi. Qarang: yozuvlar maydon ustida, maydonlar butun kenglikda, galochka chiroyli, tugma rangli. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это анкета записи в кружок. Смотри: подписи над полями, поля во всю ширину, красивая галочка, цветная кнопка. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is the club sign-up form. Look: labels above the fields, full-width fields, a neat checkbox, a colorful button. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda formaning so'zlari o'chib ketdi. Maydonlar kichrayib, bir qatorga tiqilib qoldi, varaqlar o'chdi.",
      'Ой! При обновлении стёрлись слова формы. Поля сжались и сбились в одну строку, вкладки погасли.',
      'Oh no! The update erased the form words. The fields shrank and got crammed into one line, and the tabs went dark.'),
    done: L3("Kodga qarang: label, input va select teglarida class yo'q. Darsdagi topishmoq esingizdami? Har bir maydon turiga alohida so'z kerak emas: hammasiga bitta form-control. Beshta sahifani birma-bir tuzatamiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: у тегов label, input и select нет class. Помнишь загадку урока? Каждому виду поля не нужно своё слово: всем — одно form-control. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the label, input and select tags have no class. Remember the lesson’s riddle? Each kind of field doesn’t need its own word: one form-control for all. Let’s fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi formani tiklaymiz", 'Восстановим анкету на пяти страницах', 'Let’s restore the form on five pages')
  },
  t1: {
    eyebrow: L3("Ism", 'Имя', 'Name'),
    say: L3("Birinchi sahifa: ism. Bu yerda ikkita maydon chiqib qoldi, lekin ulardan biri aslida yozuv! Men yozuvga maydon so'zini berib qo'yibman. Yozuvning so'zini almashtiring.",
      'Первая страница: имя. Тут видно два поля, но одно из них на самом деле подпись! Я дал подписи слово поля. Замени слово у подписи.',
      'The first page is the name. There are two fields here, but one of them is actually a label! I gave the label a field word. Change the label’s word.'),
    ask: L3("Yozuv maydonga o'xshamasin", 'Пусть подпись не выглядит полем', 'Stop the label from looking like a field'),
    ok: L3("Zo'r! Endi yozuv yozuvdek, maydon esa maydondek!", 'Здорово! Теперь подпись — подпись, а поле — поле!', 'Great! Now the label looks like a label and the field like a field!'),
    hints: [
      L3("label tegining class qiymatiga qarang: unda maydon so'zi turibdi. Yozuv uchun boshqa so'z bor.", 'Посмотри на class тега label: там слово для поля. Для подписи есть другое слово.', 'Look at the label tag’s class: it has the field word. Labels have another word.'),
      L3("Yozuv inglizcha label: form-label. form-control o'rniga form-label yozing.", 'Подпись по-английски — label: form-label. Вместо form-control напиши form-label.', 'A label is form-label. Write form-label instead of form-control.'),
      L3("Namuna kod ostida. Xuddi shunday yozuv so'zini almashtiring va Tekshirishni bosing.", 'Образец под кодом. Так же замени слово подписи и нажми «Проверить».', 'The example is under the code. Change the label word the same way and tap Check.')
    ],
    no: L3("Yozuv hali maydonga o'xshaydi. label tegiga form-label kerak.", 'Подпись всё ещё похожа на поле. Тегу label нужно form-label.', 'The label still looks like a field. The label tag needs form-label.'),
    drill: L3("endi telefon yozuvini ham tuzating", 'теперь почини и подпись телефона', 'now fix the phone label too'),
    drillNo: L3("Telefon yozuviga ham form-label kerak.", 'Подписи телефона тоже нужно form-label.', 'The phone label needs form-label too.')
  },
  t2: {
    eyebrow: L3("Izoh", 'Комментарий', 'Comment'),
    say: L3("Ikkinchi sahifa: izoh. Katta matn maydoni kichkina va kulrang bo'lib qolibdi. Uning class qiymati bo'sh. Darsdagi topishmoq esingizdami? Katta maydon uchun alohida so'z kerakmi?",
      'Вторая страница: комментарий. Большое текстовое поле стало маленьким и серым. У него пустой class. Вспомни загадку урока: нужно ли большому полю своё слово?',
      'The second page is the comment. The big text field turned small and grey. Its class is empty. Remember the lesson’s riddle: does a big field need its own word?'),
    ask: L3("Izoh maydoni boshqalardek bo'lsin", 'Пусть поле комментария будет как остальные', 'Make the comment field like the others'),
    ok: L3("Ajoyib! Bitta so'z, va katta maydon ham chiroyli!", 'Отлично! Одно слово — и большое поле тоже красивое!', 'Great! One word, and the big field looks nice too!'),
    hints: [
      L3("textarea ham maydon. Oddiy maydonlarga qaysi so'z berilardi?", 'textarea — тоже поле. Какое слово давали обычным полям?', 'A textarea is a field too. Which word did ordinary fields get?'),
      L3("Barcha maydonlarga bitta so'z: form-control. Uni bo'sh class ichiga yozing.", 'Одно слово для всех полей: form-control. Впиши его в пустой class.', 'One word for all fields: form-control. Write it in the empty class.'),
      L3("Namuna kod ostida: oddiy maydon. Xuddi shunday so'zni textarea tegiga yozing va Tekshirishni bosing.", 'Образец под кодом — обычное поле. Так же напиши слово для textarea и нажми «Проверить».', 'The example under the code is an ordinary field. Write the same word on the textarea and tap Check.')
    ],
    no: L3("Izoh maydoni hali oddiy. textarea tegiga form-control bering.", 'Поле комментария ещё обычное. Дай textarea слово form-control.', 'The comment field is still plain. Give the textarea form-control.'),
    label: L3("form-label yozuv uchun. Maydonning o'zi form-control bilan bo'yaladi.", 'form-label — для подписи. Само поле оформляет form-control.', 'form-label is for labels. The field itself uses form-control.'),
    drill: L3("endi guruh ro'yxatini ham chiroyli qiling", 'теперь сделай красивым и список групп', 'now make the group list nice too'),
    drillNo: L3("Bootstrap 6 da select ham form-control bilan yoziladi.", 'В Bootstrap 6 и select оформляют словом form-control.', 'In Bootstrap 6 a select also uses form-control.')
  },
  t3: {
    eyebrow: L3("Yangiliklar", 'Новости', 'News'),
    say: L3("Uchinchi sahifa: yangiliklar. Bu yerda yoqib-o'chirgich yo'q. Bootstrap saytining Switch sahifasidan namunani nusxalang va qo'ying. Keyin yozuvini moslang: Default switch o'rniga Yangiliklarni olish deb yozing.",
      'Третья страница: новости. Здесь нет переключателя. Скопируй пример со страницы Switch сайта Bootstrap и вставь. Потом подгони подпись: вместо Default switch напиши «Получать новости».',
      'The third page is the news. There’s no switch here. Copy the example from the Switch page of the Bootstrap site and paste it. Then change the label: write “Get the news” instead of Default switch.'),
    ask: L3("Saytdan switch oling va yozuvini moslang", 'Возьми switch с сайта и подгони подпись', 'Take a switch from the site and change its label'),
    ok: L3("Qoyil! Yoqib-o'chirgich tayyor, xuddi telefondagidek!", 'Вот это да! Переключатель готов, совсем как в телефоне!', 'Wow! The switch is ready, just like on a phone!'),
    hints: [
      L3("Saytdagi Switch kodi yonida nusxalash belgisi bor. Uni bosing, keyin Qo'yish tugmasini.", 'Рядом с кодом Switch на сайте есть значок копирования. Нажми его, потом «Вставить».', 'Next to the Switch code on the site there’s a copy icon. Tap it, then Paste.'),
      L3("Qo'yilgan kodda label ichida Default switch yozuvi bor. Uning o'rniga Yangiliklarni olish deb yozing.", 'В вставленном коде внутри label написано Default switch. Напиши вместо этого «Получать новости».', 'In the pasted code, the label says Default switch. Write “Get the news” instead.'),
      L3("Namuna kod ostida. Xuddi shunday tuzilish va o'z yozuvingiz bilan yozing va Tekshirishni bosing.", 'Образец под кодом. Сделай так же, со своей подписью, и нажми «Проверить».', 'The example is under the code. Do it the same way with your own label and tap Check.')
    ],
    noSw: L3("Sahifada yoqib-o'chirgich hali yo'q. Saytdan Switch namunasini nusxalang va qo'ying.", 'На странице пока нет переключателя. Скопируй пример Switch с сайта и вставь.', 'There’s no switch on the page yet. Copy the Switch example from the site and paste it.'),
    check: L3("Bu galochka. Bu sahifaga yoqib-o'chirgich kerak: Switch namunasini oling.", 'Это галочка. А здесь нужен переключатель: возьми пример Switch.', 'That’s a checkbox. This page needs a switch: take the Switch example.'),
    field: L3("Yoqib-o'chirgich yozuvdan alohida turibdi. Saytdagidek form-field ichida qoldiring.", 'Переключатель стоит отдельно от подписи. Оставь его внутри form-field, как на сайте.', 'The switch stands apart from its label. Keep it inside form-field, as on the site.'),
    sample: L3("Yozuv hali saytdagidek inglizcha. Yangiliklarni olish deb yozing.", 'Подпись ещё английская, как на сайте. Напиши «Получать новости».', 'The label is still the site’s English text. Write “Get the news”.'),
    noText: L3("Yoqib-o'chirgichning yozuvi yo'q. label ichiga yozing.", 'У переключателя нет подписи. Напиши её внутри label.', 'The switch has no label. Write it inside label.'),
    drill: L3("endi saytdan galochka oling: «Qoidalarga roziman»", 'теперь возьми с сайта галочку: «Согласен с правилами»', 'now take a checkbox from the site: “I agree to the rules”'),
    drillNo: L3("Checkbox namunasini nusxalang, qo'ying va yozuvini Qoidalarga roziman qiling.", 'Скопируй пример Checkbox, вставь и сделай подпись «Согласен с правилами».', 'Copy the Checkbox example, paste it and make the label “I agree to the rules”.')
  },
  t4: {
    eyebrow: L3("Guruh", 'Группа', 'Group'),
    say: L3("To'rtinchi sahifa: guruh tanlash. Bu yerni eski darslikdan ko'chiribman: ro'yxat ham, galochka ham oddiy bo'lib qolgan. Kodda beshinchi versiyaning uchta nomi bor. Ularni oltinchi versiya so'zlariga almashtiring.",
      'Четвёртая страница: выбор группы. Её я списал из старого учебника: и список, и галочка стали обычными. В коде три имени пятой версии. Замени их на слова шестой версии.',
      'The fourth page is choosing a group. I copied it from an old tutorial: both the list and the checkbox turned plain. The code has three version 5 names. Replace them with version six words.'),
    ask: L3("Ro'yxat va galochka chiroyli bo'lsin", 'Сделай список и галочку красивыми', 'Make the list and the checkbox nice'),
    ok: L3("Zo'r ish! Uchta eski nom ketdi, forma yana chiroyli!", 'Отличная работа! Три старых имени ушли, анкета снова красивая!', 'Nice work! Three old names gone, and the form looks great again!'),
    hints: [
      L3("Uchta so'zga qarang: form-select, form-check va form-check-input. Ularning hammasi eski.", 'Посмотри на три слова: form-select, form-check и form-check-input. Все они старые.', 'Look at three words: form-select, form-check and form-check-input. They’re all old.'),
      L3("select ham form-control oladi. Galochka o'ramiga form-field, galochkaning o'ziga esa check.", 'select тоже получает form-control. Обёртке галочки — form-field, а самой галочке — check.', 'A select gets form-control too. The checkbox wrapper gets form-field, and the checkbox itself gets check.'),
      L3("Namuna kod ostida. Xuddi shunday uchala so'zni almashtiring va Tekshirishni bosing.", 'Образец под кодом. Так же замени все три слова и нажми «Проверить».', 'The example is under the code. Replace all three words the same way and tap Check.')
    ],
    sel: L3("Ro'yxat hali oddiy. select tegiga form-control bering.", 'Список ещё обычный. Дай select слово form-control.', 'The list is still plain. Give the select form-control.'),
    chk: L3("Galochka hali oddiy. O'ramiga form-field, galochkaga check bering.", 'Галочка ещё обычная. Дай обёртке form-field, а галочке — check.', 'The checkbox is still plain. Give the wrapper form-field and the checkbox check.'),
    drill: L3("endi bu dumaloq tanlovni ham tuzating", 'теперь почини и этот круглый выбор', 'now fix this round choice too'),
    drillNo: L3("form-check-input eski nom. Dumaloq tanlov uchun radio yozing.", 'form-check-input — старое имя. Для круглого выбора напиши radio.', 'form-check-input is an old name. For a round choice, write radio.')
  },
  t5: {
    eyebrow: L3("Mening formam", 'Моя анкета', 'My form'),
    say: L3("Beshinchi sahifa sizniki: musobaqaga yozilish formasi! Unda yozuv, maydon va tugma bor, lekin class qiymatlari bo'sh. Ularni to'ldiring, bo'sh qatorga esa saytdan galochka yoki yoqib-o'chirgich qo'ying va yozuvini o'zingiz yozing.",
      'Пятая страница твоя: анкета записи на соревнование! В ней есть подпись, поле и кнопка, но class пустые. Заполни их, а в пустую строку вставь с сайта галочку или переключатель и напиши свою подпись.',
      'The fifth page is yours: a contest sign-up form! It has a label, a field and a button, but the classes are empty. Fill them in, and paste a checkbox or switch from the site into the empty line with your own label.'),
    ask: L3("O'z formangizni yig'ing", 'Собери свою анкету', 'Build your own form'),
    ok: L3("Vau, haqiqiy yozilish formasi! Endi har qanday formani Bootstrap bilan yasay olasiz!", 'Вау, настоящая анкета! Теперь любую форму ты соберёшь на Bootstrap!', 'Wow, a real sign-up form! Now you can build any form with Bootstrap!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Oldin label tegiga form-label, input tegiga form-control bering.", 'Посмотри на список: четыре условия. Сначала дай label слово form-label, а input — form-control.', 'Look at the list: four conditions. First give label form-label and input form-control.'),
      L3("Keyin saytdan Checkbox yoki Switch namunasini nusxalab, bo'sh qatorga qo'ying va yozuvini almashtiring. Tugmaga btn-solid va rang so'zi.", 'Потом скопируй с сайта пример Checkbox или Switch, вставь в пустую строку и замени подпись. Кнопке — btn-solid и слово цвета.', 'Then copy a Checkbox or Switch example from the site, paste it into the empty line and change its label. The button gets btn-solid and a color word.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda o'z formangizni yozing va Tekshirishni bosing.", 'Образец под кодом. Собери свою анкету в таком же порядке и нажми «Проверить».', 'The example is under the code. Build your form in the same order and tap Check.')
    ],
    label: L3("Yozuvga form-label so'zi kerak.", 'Подписи нужно слово form-label.', 'The label needs the word form-label.'),
    input: L3("Maydonga form-control so'zi kerak.", 'Полю нужно слово form-control.', 'The field needs the word form-control.'),
    choice: L3("Formada galochka yoki yoqib-o'chirgich yo'q. Saytdan namunani nusxalab, bo'sh qatorga qo'ying.", 'В анкете нет галочки или переключателя. Скопируй пример с сайта и вставь в пустую строку.', 'The form has no checkbox or switch. Copy an example from the site and paste it into the empty line.'),
    sample: L3("Yozuv hali saytdagidek inglizcha. O'z yozuvingizni yozing.", 'Подпись ещё английская, как на сайте. Напиши свою.', 'The label is still the site’s English text. Write your own.'),
    btn: L3("Tugma hali oddiy. Unga btn-solid va rang so'zini bering.", 'Кнопка ещё обычная. Дай ей btn-solid и слово цвета.', 'The button is still plain. Give it btn-solid and a color word.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma formalar yana chiroyli! Qarang, bu sizning formangiz.", 'Все анкеты снова красивые! Смотри, это твоя анкета.', 'All the forms look great again! Look, this is your form.') },
      { k: 'a', text: L3("Barcha maydonlarga bitta so'z: form-control, hatto select tegiga ham.", 'Одно слово для всех полей: form-control, даже для select.', 'One word for all fields: form-control, even for a select.') },
      { k: 'b', text: L3("Yozuvga esa form-label beriladi.", 'А подписи дают form-label.', 'And labels get form-label.') },
      { k: 'c', text: L3("Galochka check, dumaloq tanlov radio, yoqib-o'chirgich switch, ularni form-field o'raydi.", 'Галочка — check, круглый выбор — radio, переключатель — switch, а обнимает их form-field.', 'A checkbox is check, a round choice is radio, a switch is switch, and form-field wraps them.') },
      { k: 'd', text: L3("So'zlarni saytning Forms bo'limidan olamiz. form-select va form-check eski nomlar.", 'Слова берём в разделе Forms на сайте. form-select и form-check — старые имена.', 'We take the words from the Forms section of the site. form-select and form-check are old names.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda karusel yasaymiz, ya'ni aylanuvchi rasmlar degani. Ko'rishguncha!", 'Поздравляю! На следующем уроке сделаем карусель, то есть листающиеся картинки. До встречи!', 'Congratulations! Next lesson we’ll build a carousel, a set of sliding pictures. See you!') }
    ],
    roles: {
      a: L3("form-control: maydonlar", 'form-control: поля', 'form-control: fields'),
      b: L3("form-label: yozuv", 'form-label: подпись', 'form-label: label'),
      c: L3("check · radio · switch", 'check · radio · switch', 'check · radio · switch'),
      d: L3("So'zlar Forms da", 'Слова в Forms', 'Words are in Forms')
    },
    ask: L3("Formangizga qarang", 'Посмотри на свою анкету', 'Look at your form')
  }
};
