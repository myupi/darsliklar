// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 7 «Формы» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard) + 3 «впиши ответ» (q12–q14)
// + игровые: 2 «собери» (q15, q16), 1 «найди ошибку» (q17), 1 «нажми на странице» (q18).
// Проверяем: одно слово form-control — у input (и type date), textarea и select; подпись — form-label (отступ снизу);
// галочка check (checkbox — значение type), кружок radio, переключатель switch — у div вокруг input; подпись рядом — form-field;
// кнопка формы — btn-solid theme-*; form-select, form-check, form-check-input — имена версии 5; опечатка — Bootstrap слова
// не знает; class меняет только свой тег (form-control у label, у form); сайт: Forms → Form control, Switch; в скопированном
// примере меняют подпись, placeholder и id/for, слова Bootstrap оставляют.
// Не повторяет тесты урока (tools/webtest/bootstrap/l07.jsx): пустой class у input, select, label; radio на один ответ;
// form-check-input у галочки.
// Словарь урока 7: forma, maydon, yozuv (label), ro'yxat (select), katta maydon (textarea), galochka, doiracha, o'tkazgich.
// Апостроф в узбекском — только ASCII «'».
// =============================================================================
const t3 = (uz, ru, en) => ({ uz, ru, en });

export default [
  {
    id: 'bootstrap_l08_q01',
    difficulty: 'easy',
    tags: ['form-control', 'date'],
    mono: true,
    sort: false,
    vis: {
      code: t3(
        '<label for="kun" class="form-label">\n  Tug\'ilgan kun\n</label>\n<input type="date" id="kun" class="___">',
        '<label for="kun" class="form-label">\n  День рождения\n</label>\n<input type="date" id="kun" class="___">',
        '<label for="kun" class="form-label">\n  Birthday\n</label>\n<input type="date" id="kun" class="___">',
      ),
    },
    uz: {
      ctx: "Anketada tug'ilgan kun maydoni bor, type date. U Ism maydoni kabi keng va chiroyli bo'lsin.",
      q: "Bo'sh joyga qaysi so'z yoziladi?",
      opts: ['form-control', 'form-date', 'date-control', 'form-label'],
      why: "type date bo'lsa ham, bu baribir input, demak form-control. Bootstrap 6 da har bir maydon turiga alohida so'z yo'q, form-label esa yozuv uchun.",
    },
    ru: {
      ctx: 'В анкете есть поле даты рождения, type date. Оно должно быть широким и красивым, как поле «Имя».',
      q: 'Какое слово вписать на пустое место?',
      opts: ['form-control', 'form-date', 'date-control', 'form-label'],
      why: 'Даже с type date это всё равно input, значит — form-control. Отдельных слов для каждого вида поля в Bootstrap 6 нет, а form-label — для подписи.',
    },
    en: {
      ctx: 'The form has a birthday field, type date. It should be wide and nice, like the Name field.',
      q: 'Which word goes in the empty spot?',
      opts: ['form-control', 'form-date', 'date-control', 'form-label'],
      why: 'Even with type date it is still an input, so it gets form-control. Bootstrap 6 has no separate word for each kind of field, and form-label is for the caption.',
    },
  },
  {
    id: 'bootstrap_l08_q02',
    difficulty: 'easy',
    tags: ['check'],
    mono: true,
    sort: false,
    vis: {
      code: t3(
        '<div class="form-field">\n  <input type="checkbox" class="___">\n  <label>Qoidalarga roziman</label>\n</div>',
        '<div class="form-field">\n  <input type="checkbox" class="___">\n  <label>Принимаю правила</label>\n</div>',
        '<div class="form-field">\n  <input type="checkbox" class="___">\n  <label>I accept the rules</label>\n</div>',
      ),
    },
    uz: {
      ctx: "Galochka mitti, xuddi brauzerning o'zinikidek. U Bootstrap galochkasi kabi katta va yumaloq burchakli bo'lsin.",
      q: "Bo'sh joyga qaysi so'z yoziladi?",
      opts: ['check', 'checkbox', 'form-check', 'form-checkbox'],
      why: "Galochkaning so'zi qisqa: check. checkbox — type qiymati, class emas. form-check esa beshinchi versiyaning nomi, oltinchisida ishlamaydi.",
    },
    ru: {
      ctx: 'Галочка крошечная, как у самого браузера. Она должна стать крупной и со скруглёнными углами, как в Bootstrap.',
      q: 'Какое слово вписать на пустое место?',
      opts: ['check', 'checkbox', 'form-check', 'form-checkbox'],
      why: 'Слово галочки короткое: check. checkbox — это значение type, а не class. А form-check — старое имя из 5-й версии, в 6-й не работает.',
    },
    en: {
      ctx: 'The checkbox is tiny, like the browser’s own. It should be big with rounded corners, like in Bootstrap.',
      q: 'Which word goes in the empty spot?',
      opts: ['check', 'checkbox', 'form-check', 'form-checkbox'],
      why: 'The checkbox word is short: check. checkbox is the type value, not a class. form-check is an old name from version 5; it does not work in version 6.',
    },
  },
  {
    id: 'bootstrap_l08_q03',
    difficulty: 'easy',
    tags: ['sayt', 'switch'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Formaga «Yangiliklarni olish» o'tkazgichi kerak. Uni Bootstrap saytidan olamiz.",
      q: "Saytning qaysi joyida o'tkazgich namunasi bor?",
      opts: ['Forms → Switch', 'Components → Button', 'Forms → Form control', 'Utilities → Colors'],
      why: "Formaning hamma qismi Forms bo'limida: maydonlar Form control sahifasida, o'tkazgich esa o'z sahifasida — Switch. Components → Button tugmalar uchun.",
    },
    ru: {
      ctx: 'В анкету нужен переключатель «Получать новости». Берём его с сайта Bootstrap.',
      q: 'Где на сайте пример переключателя?',
      opts: ['Forms → Switch', 'Components → Button', 'Forms → Form control', 'Utilities → Colors'],
      why: 'Всё для форм — в разделе Forms: поля на странице Form control, а у переключателя своя страница — Switch. Components → Button — для кнопок.',
    },
    en: {
      ctx: 'The form needs a “Get the news” switch. We take it from the Bootstrap site.',
      q: 'Where on the site is the switch example?',
      opts: ['Forms → Switch', 'Components → Button', 'Forms → Form control', 'Utilities → Colors'],
      why: 'Everything for forms is in the Forms section: fields are on the Form control page, and the switch has its own page, Switch. Components → Button is for buttons.',
    },
  },
  {
    id: 'bootstrap_l08_q04',
    difficulty: 'easy',
    tags: ['btn-solid', 'theme-primary'],
    mono: true,
    sort: false,
    vis: {
      code: t3(
        '<button type="submit" class="___">\n  Yuborish\n</button>',
        '<button type="submit" class="___">\n  Отправить\n</button>',
        '<button type="submit" class="___">\n  Send\n</button>',
      ),
      page: t3(
        '<button type="submit" class="btn-solid theme-primary">Yuborish</button>',
        '<button type="submit" class="btn-solid theme-primary">Отправить</button>',
        '<button type="submit" class="btn-solid theme-primary">Send</button>',
      ),
    },
    uz: {
      ctx: "Formaning «Yuborish» tugmasi sahifadagidek ko'k bo'lsin.",
      q: "Bo'sh joyga nima yoziladi?",
      opts: ['btn-solid theme-primary', 'btn btn-primary', 'form-control', 'theme-primary'],
      why: "Formadagi tugma ham oddiy Bootstrap tugmasi: ikki so'z, uslub btn-solid va rang theme-primary. btn-primary — beshinchi versiyaning nomi, form-control esa maydonlar uchun.",
    },
    ru: {
      ctx: 'Кнопка «Отправить» в анкете должна стать синей, как на странице.',
      q: 'Что вписать на пустое место?',
      opts: ['btn-solid theme-primary', 'btn btn-primary', 'form-control', 'theme-primary'],
      why: 'Кнопка формы — обычная кнопка Bootstrap: два слова, стиль btn-solid и цвет theme-primary. btn-primary — старое имя из 5-й версии, а form-control — для полей.',
    },
    en: {
      ctx: 'The form’s “Send” button should be blue, like on the page.',
      q: 'What goes in the empty spot?',
      opts: ['btn-solid theme-primary', 'btn btn-primary', 'form-control', 'theme-primary'],
      why: 'A form button is a normal Bootstrap button: two words, the style btn-solid and the color theme-primary. btn-primary is a version 5 name, and form-control is for fields.',
    },
  },
  {
    id: 'bootstrap_l08_q05',
    difficulty: 'medium',
    tags: ['form-control', 'label'],
    mono: false,
    sort: false,
    vis: {
      code: t3(
        '<label for="ism" class="form-control">\n  Ism\n</label>\n<input type="text" id="ism">',
        '<label for="ism" class="form-control">\n  Имя\n</label>\n<input type="text" id="ism">',
        '<label for="ism" class="form-control">\n  Name\n</label>\n<input type="text" id="ism">',
      ),
      page: true,
    },
    uz: {
      ctx: "Sahifaga qarang: Ism yozuvi ramkaga tushib, maydonga o'xshab qoldi, maydonning o'zi esa mitti.",
      q: 'Nega shunday bo\'ldi?',
      opts: [
        'form-control maydonga emas, yozuvga yozilgan',
        "label tegiga class yozib bo'lmaydi",
        "input tegida placeholder yo'q",
        'Bootstrap saytga ulanmagan',
      ],
      why: "class qaysi tegda tursa, o'sha narsa o'zgaradi. form-control label tegida, shuning uchun yozuv ramkali bo'ldi. Uning joyi input tegida, yozuvga esa form-label kerak.",
    },
    ru: {
      ctx: 'Посмотри на страницу: подпись «Имя» попала в рамку и стала похожа на поле, а само поле крошечное.',
      q: 'Почему так вышло?',
      opts: [
        'form-control стоит у подписи, а не у поля',
        'у тега label не бывает class',
        'у тега input нет placeholder',
        'Bootstrap не подключён к сайту',
      ],
      why: 'Меняется то, у какого тега стоит class. form-control у label — вот подпись и получила рамку. Его место — у input, а подписи нужен form-label.',
    },
    en: {
      ctx: 'Look at the page: the “Name” caption got a border and looks like a field, while the field itself is tiny.',
      q: 'Why did this happen?',
      opts: [
        'form-control is on the caption, not the field',
        'a label tag can’t have a class',
        'the input tag has no placeholder',
        'Bootstrap is not connected to the site',
      ],
      why: 'The tag with the class is the one that changes. form-control is on the label, so the caption got the border. It belongs on the input, and the caption needs form-label.',
    },
  },
  {
    id: 'bootstrap_l08_q06',
    difficulty: 'medium',
    tags: ['sayt', 'moslash'],
    mono: false,
    sort: false,
    vis: {
      code: '<label for="email" class="form-label">\n  Email address\n</label>\n<input type="email" id="email"\n  class="form-control"\n  placeholder="name@example.com">',
    },
    uz: {
      ctx: "Saytdagi Form control namunasi nusxalanib, formaga qo'yildi. Endi uni ota-onaning emaili uchun moslaymiz.",
      q: "Namunadagi qaysi narsa o'zgarmay qoladi?",
      opts: [
        "form-label va form-control so'zlari",
        'Email address degan yozuv',
        'name@example.com namunasi',
        "Hech narsa: hammasi o'zgaradi",
      ],
      why: "Namunadan Bootstrap so'zlari qoladi: ular maydonni chiroyli qiladi. Inglizcha yozuv va placeholder ichidagi namuna esa o'zimiznikiga almashtiriladi.",
    },
    ru: {
      ctx: 'Пример Form control с сайта скопировали в анкету. Теперь настраиваем его под почту родителей.',
      q: 'Что в примере остаётся без изменений?',
      opts: [
        'слова form-label и form-control',
        'подпись Email address',
        'образец name@example.com',
        'ничего: меняется всё',
      ],
      why: 'Из примера остаются слова Bootstrap: они делают поле красивым. Английскую подпись и образец в placeholder меняют на свои.',
    },
    en: {
      ctx: 'The Form control example from the site was copied into the form. Now we adapt it for a parent’s email.',
      q: 'What in the example stays the same?',
      opts: [
        'the words form-label and form-control',
        'the caption Email address',
        'the sample name@example.com',
        'nothing: everything changes',
      ],
      why: 'The Bootstrap words stay: they make the field look nice. The English caption and the sample in placeholder are replaced with our own.',
    },
  },
  {
    id: 'bootstrap_l08_q07',
    difficulty: 'medium',
    tags: ['form-control', 'select'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Formada uch xil maydon bor: ism (input), guruh ro'yxati (select) va izoh uchun katta maydon (textarea).",
      q: "Ularni chiroyli qilish uchun Bootstrap 6 da nechta so'z kerak?",
      opts: [
        'Bitta: form-control uchalasiga',
        "Uchta: har bir maydonga o'z so'zi",
        'Ikkita: select uchun form-select',
        'Bitta: form tegiga form-control',
      ],
      why: "Oltinchi versiyada input, select va textarea — uchalasi ham form-control bilan bezaladi. form-select — eski nom. form tegiga yozilsa, faqat formaning o'zi ramkaga tushadi.",
    },
    ru: {
      ctx: 'В анкете три вида полей: имя (input), список групп (select) и большое поле для комментария (textarea).',
      q: 'Сколько слов нужно в Bootstrap 6, чтобы сделать их красивыми?',
      opts: [
        'одно: form-control для всех трёх',
        'три: каждому полю своё слово',
        'два: для select отдельно form-select',
        'одно: form-control у тега form',
      ],
      why: 'В 6-й версии input, select и textarea украшает одно слово form-control. form-select — старое имя. А у тега form оно дало бы рамку только самой форме.',
    },
    en: {
      ctx: 'The form has three kinds of fields: a name (input), a group list (select) and a big comment field (textarea).',
      q: 'How many words does Bootstrap 6 need to make them nice?',
      opts: [
        'one: form-control for all three',
        'three: each field has its own word',
        'two: form-select just for select',
        'one: form-control on the form tag',
      ],
      why: 'In version 6, input, select and textarea all get one word: form-control. form-select is an old name. On the form tag it would only put a border around the form itself.',
    },
  },
  {
    id: 'bootstrap_l08_q08',
    difficulty: 'medium',
    tags: ['form-control', 'xato'],
    mono: false,
    sort: false,
    vis: {
      code: t3(
        '<label for="ism" class="form-label">Ism</label>\n<input type="text" id="ism" class="form-control">\n<label for="tel" class="form-label">Telefon</label>\n<input type="tel" id="tel" class="form-contol">',
        '<label for="ism" class="form-label">Имя</label>\n<input type="text" id="ism" class="form-control">\n<label for="tel" class="form-label">Телефон</label>\n<input type="tel" id="tel" class="form-contol">',
        '<label for="ism" class="form-label">Name</label>\n<input type="text" id="ism" class="form-control">\n<label for="tel" class="form-label">Phone</label>\n<input type="tel" id="tel" class="form-contol">',
      ),
      page: true,
    },
    uz: {
      ctx: "Ism maydoni chiroyli chiqdi, Telefon maydoni esa oddiyligicha qoldi.",
      q: "Telefon maydoniga nima bo'ldi?",
      opts: [
        "form-contol so'zida r harfi tushib qolgan",
        'type tel Bootstrapda ishlamaydi',
        'Bootstrap faqat birinchi maydonni bezaydi',
        "Ikki maydonga bitta so'z yozib bo'lmaydi",
      ],
      why: "Bootstrap so'zni harfma-harf taniydi: form-contol unga notanish, shuning uchun maydon o'zgarmadi. To'g'risi — form-control. Shubha bo'lsa, so'zni saytdan nusxalang.",
    },
    ru: {
      ctx: 'Поле «Имя» получилось красивым, а поле «Телефон» осталось простым.',
      q: 'Что случилось с полем «Телефон»?',
      opts: [
        'в слове form-contol пропала буква r',
        'type tel не работает в Bootstrap',
        'Bootstrap украшает только первое поле',
        'одно слово нельзя дать двум полям',
      ],
      why: 'Bootstrap узнаёт слово буква в букву: form-contol ему незнакомо, поэтому поле не изменилось. Правильно — form-control. Если сомневаешься, скопируй слово с сайта.',
    },
    en: {
      ctx: 'The Name field came out nice, but the Phone field stayed plain.',
      q: 'What happened to the Phone field?',
      opts: [
        'form-contol is missing the letter r',
        'type tel does not work in Bootstrap',
        'Bootstrap styles only the first field',
        'two fields can’t share one word',
      ],
      why: 'Bootstrap knows a word letter by letter: form-contol is unknown to it, so the field did not change. The right word is form-control. If unsure, copy the word from the site.',
    },
  },
  {
    id: 'bootstrap_l08_q09',
    difficulty: 'medium',
    tags: ['form-label'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Maydon ustidagi yozuv label tegida turadi. Unga form-label so'zi yozildi.",
      q: 'form-label yozuv bilan nima qiladi?',
      opts: [
        "Yozuv va maydon o'rtasiga ozgina joy qo'yadi",
        'Yozuvni maydondek keng va ramkali qiladi',
        "Yozuvni galochka bilan bir qatorga qo'yadi",
        'Yozuvni qizil rangli va katta harfli qiladi',
      ],
      why: "form-label — yozuv uchun: uni maydon ustida chiroyli qiladi va pastidan ozgina joy qoldiradi. Ramka va kenglikni form-control beradi, galochka bilan bir qatorni esa form-field.",
    },
    ru: {
      ctx: 'Подписи над полем, то есть тегу label, дали слово form-label.',
      q: 'Что form-label делает с подписью?',
      opts: [
        'оставляет немного места между подписью и полем',
        'делает подпись широкой и с рамкой, как поле',
        'ставит подпись в одну строку с галочкой',
        'делает подпись красной и с крупными буквами',
      ],
      why: 'form-label — для подписи: делает её аккуратной над полем и оставляет немного места снизу. Рамку и ширину даёт form-control, а строку с галочкой — form-field.',
    },
    en: {
      ctx: 'The caption above the field, the label tag, got the word form-label.',
      q: 'What does form-label do to the caption?',
      opts: [
        'leaves a little space between caption and field',
        'makes the caption wide and boxed like a field',
        'puts the caption in one row with a checkbox',
        'makes the caption red with big letters',
      ],
      why: 'form-label is for captions: it makes the caption neat above the field and leaves a little space below. The border and width come from form-control, the row with a checkbox from form-field.',
    },
  },
  {
    id: 'bootstrap_l08_q10',
    difficulty: 'hard',
    tags: ['form-control', 'form'],
    mono: false,
    sort: false,
    vis: {
      code: t3(
        '<form class="form-control">\n  <label for="ism">Ism</label>\n  <input type="text" id="ism">\n  <label for="tel">Telefon</label>\n  <input type="tel" id="tel">\n</form>',
        '<form class="form-control">\n  <label for="ism">Имя</label>\n  <input type="text" id="ism">\n  <label for="tel">Телефон</label>\n  <input type="tel" id="tel">\n</form>',
        '<form class="form-control">\n  <label for="ism">Name</label>\n  <input type="text" id="ism">\n  <label for="tel">Phone</label>\n  <input type="tel" id="tel">\n</form>',
      ),
      page: true,
    },
    uz: {
      ctx: "Hamma maydon birdan chiroyli bo'lsin deb, form-control form tegiga bir marta yozildi.",
      q: 'Nega maydonlar oddiyligicha qoldi?',
      opts: [
        "form-control har bir maydonning o'ziga yoziladi",
        'form tegiga form-label yozish kerak edi',
        "Maydonlar form-field ichida bo'lishi kerak",
        'form-control faqat textarea uchun ishlaydi',
      ],
      why: "form-control faqat o'zi turgan tegni bezaydi, ichkariga o'tmaydi. Shuning uchun ramka butun formaga tushdi. Har bir input, select va textarea tegiga u alohida yoziladi.",
    },
    ru: {
      ctx: 'Чтобы все поля сразу стали красивыми, form-control один раз написали у тега form.',
      q: 'Почему поля остались простыми?',
      opts: [
        'form-control пишут каждому полю отдельно',
        'у тега form должен быть form-label',
        'поля должны быть внутри form-field',
        'form-control работает только у textarea',
      ],
      why: 'form-control украшает только свой тег и не переходит внутрь. Поэтому рамку получила вся форма. Каждому input, select и textarea его пишут отдельно.',
    },
    en: {
      ctx: 'To make all fields nice at once, form-control was written once on the form tag.',
      q: 'Why did the fields stay plain?',
      opts: [
        'form-control goes on each field itself',
        'the form tag needs form-label instead',
        'the fields must be inside form-field',
        'form-control works only on textarea',
      ],
      why: 'form-control styles only its own tag and does not pass inside. So the whole form got the border. Each input, select and textarea gets it separately.',
    },
  },
  {
    id: 'bootstrap_l08_q11',
    difficulty: 'hard',
    tags: ['moslash', 'id'],
    mono: false,
    sort: false,
    vis: {
      code: t3(
        '<div class="form-field">\n  <input type="checkbox" id="rozi" class="check">\n  <label for="rozi">Qoidalarga roziman</label>\n</div>\n<div class="form-field">\n  <input type="checkbox" id="rozi" class="check">\n  <label for="rozi">Yangiliklarni olish</label>\n</div>',
        '<div class="form-field">\n  <input type="checkbox" id="rozi" class="check">\n  <label for="rozi">Принимаю правила</label>\n</div>\n<div class="form-field">\n  <input type="checkbox" id="rozi" class="check">\n  <label for="rozi">Получать новости</label>\n</div>',
        '<div class="form-field">\n  <input type="checkbox" id="rozi" class="check">\n  <label for="rozi">I accept the rules</label>\n</div>\n<div class="form-field">\n  <input type="checkbox" id="rozi" class="check">\n  <label for="rozi">Get the news</label>\n</div>',
      ),
    },
    uz: {
      ctx: "Galochka nusxalanib, ikkinchi savolga ham qo'yildi. Pastki yozuv bosilsa, tepadagi galochka belgilanyapti.",
      q: 'Nega shunday?',
      opts: [
        'Ikkala galochkada bir xil id: rozi',
        "Galochkaga form-check so'zi kerak edi",
        'label galochkadan oldin turishi kerak',
        "Sahifada faqat bitta form-field bo'ladi",
      ],
      why: "label o'z galochkasini id bo'yicha topadi. id bir xil bo'lsa, ikkala yozuv birinchisini bosadi. Nusxalangan kodda id va for atributlarini ham moslang: masalan, yangilik.",
    },
    ru: {
      ctx: 'Галочку скопировали и поставили ко второму вопросу. Нажимаешь нижнюю подпись — отмечается верхняя галочка.',
      q: 'Почему так?',
      opts: [
        'у обеих галочек одинаковый id: rozi',
        'галочке нужно слово form-check',
        'label должен стоять перед галочкой',
        'на странице бывает только один form-field',
      ],
      why: 'label находит свою галочку по id. Если id одинаковый, обе подписи отмечают первую. В скопированном коде настраивай и id с for: например, yangilik.',
    },
    en: {
      ctx: 'The checkbox was copied for a second question. Clicking the lower caption ticks the upper checkbox.',
      q: 'Why?',
      opts: [
        'both checkboxes have the same id: rozi',
        'the checkbox needs the word form-check',
        'the label must come before the checkbox',
        'a page can have only one form-field',
      ],
      why: 'A label finds its checkbox by id. If the ids are the same, both captions tick the first one. In copied code, adapt id and for too: for example, yangilik.',
    },
  },
  // ---- «Впиши ответ» (q12–q14) ----
  {
    id: 'bootstrap_l08_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['form-control', 'textarea'],
    mono: true,
    answer: ['form-control'],
    vis: {
      code: t3(
        '<label for="izoh" class="form-label">\n  Izoh\n</label>\n<textarea id="izoh" rows="3"\n  class="___"></textarea>',
        '<label for="izoh" class="form-label">\n  Комментарий\n</label>\n<textarea id="izoh" rows="3"\n  class="___"></textarea>',
        '<label for="izoh" class="form-label">\n  Comment\n</label>\n<textarea id="izoh" rows="3"\n  class="___"></textarea>',
      ),
    },
    uz: {
      ctx: "Izoh uchun katta maydon ham Ism maydoni kabi keng va chiroyli bo'lsin.",
      q: "Bo'sh joyga bitta so'z yozing.",
      why: "Katta maydon ham maydon: textarea tegiga ham form-control yoziladi. Bootstrap 6 da input, select va textarea uchun so'z bitta.",
    },
    ru: {
      ctx: 'Большое поле для комментария тоже должно быть широким и красивым, как поле «Имя».',
      q: 'Впиши на пустое место одно слово.',
      why: 'Большое поле — тоже поле: textarea тоже получает form-control. В Bootstrap 6 у input, select и textarea слово одно.',
    },
    en: {
      ctx: 'The big comment field should also be wide and nice, like the Name field.',
      q: 'Type one word in the empty spot.',
      why: 'A big field is still a field: textarea also gets form-control. In Bootstrap 6, input, select and textarea share one word.',
    },
  },
  {
    id: 'bootstrap_l08_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['switch'],
    mono: true,
    answer: ['switch'],
    vis: {
      code: t3(
        '<div class="form-field">\n  <div class="___">\n    <input type="checkbox" role="switch" switch>\n  </div>\n  <label>Yangiliklarni olish</label>\n</div>',
        '<div class="form-field">\n  <div class="___">\n    <input type="checkbox" role="switch" switch>\n  </div>\n  <label>Получать новости</label>\n</div>',
        '<div class="form-field">\n  <div class="___">\n    <input type="checkbox" role="switch" switch>\n  </div>\n  <label>Get the news</label>\n</div>',
      ),
    },
    uz: {
      ctx: "Galochka emas, yoqib-o'chiriladigan o'tkazgich kerak: «Yangiliklarni olish».",
      q: "Bo'sh joyga o'tkazgichning so'zini yozing.",
      why: "O'tkazgichning so'zi switch. U input tegiga emas, uni o'rab turgan div tegiga yoziladi: o'tkazgichni shu div chizadi.",
    },
    ru: {
      ctx: 'Нужна не галочка, а переключатель, который включают и выключают: «Получать новости».',
      q: 'Впиши на пустое место слово переключателя.',
      why: 'Слово переключателя — switch. Его пишут не у input, а у div вокруг него: переключатель рисует этот div.',
    },
    en: {
      ctx: 'We need an on/off switch, not a checkbox: “Get the news”.',
      q: 'Type the switch word in the empty spot.',
      why: 'The switch word is switch. It goes not on the input but on the div around it: that div draws the switch.',
    },
  },
  {
    id: 'bootstrap_l08_q14',
    type: 'input',
    difficulty: 'hard',
    tags: ['form-field', 'radio'],
    mono: true,
    answer: ['form-field'],
    vis: {
      code: t3(
        '<div class="___">\n  <input type="radio" id="v1" class="radio">\n  <label for="v1">Ertalab</label>\n</div>',
        '<div class="___">\n  <input type="radio" id="v1" class="radio">\n  <label for="v1">Утром</label>\n</div>',
        '<div class="___">\n  <input type="radio" id="v1" class="radio">\n  <label for="v1">Morning</label>\n</div>',
      ),
    },
    uz: {
      ctx: "Doiracha va «Ertalab» yozuvi bir qatorda, oralarida chiroyli joy bilan tursin.",
      q: "Ularni o'rab turgan div tegiga qaysi so'z yoziladi?",
      why: "Galochka, doiracha yoki o'tkazgichni yozuvi bilan yonma-yon form-field qo'yadi. Eski darsliklardagi form-check — beshinchi versiyaning nomi.",
    },
    ru: {
      ctx: 'Кружок и подпись «Утром» должны стоять в одной строке, с аккуратным промежутком.',
      q: 'Какое слово пишется у div вокруг них?',
      why: 'Галочку, кружок или переключатель ставит рядом с подписью form-field. А form-check из старых учебников — имя 5-й версии.',
    },
    en: {
      ctx: 'The radio and the “Morning” caption should sit in one row with a neat gap.',
      q: 'Which word goes on the div around them?',
      why: 'form-field puts a checkbox, radio or switch next to its caption. form-check from old tutorials is a version 5 name.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l08_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['form-control', 'select'],
    pieces: ['<select', ' class="', 'form-control', '">'],
    extra: ['form-select', '<input'],
    vis: {
      code: t3(
        '<label class="form-label">Guruh</label>\n___\n  <option>Robototexnika</option>\n  <option>Dasturlash</option>\n</select>',
        '<label class="form-label">Группа</label>\n___\n  <option>Робототехника</option>\n  <option>Программирование</option>\n</select>',
        '<label class="form-label">Group</label>\n___\n  <option>Robotics</option>\n  <option>Coding</option>\n</select>',
      ),
    },
    uz: {
      ctx: "Guruh ro'yxati ham boshqa maydonlar kabi chiroyli bo'lsin.",
      q: "Bo'laklarni tartib bilan bosib, ro'yxatning ochuvchi tegini yig'ing",
      why: "Ro'yxat — select tegi, Bootstrap 6 da u ham form-control bilan bezaladi. form-select — beshinchi versiyadan qolgan nom, input esa ro'yxat emas.",
    },
    ru: {
      ctx: 'Список групп тоже должен быть красивым, как другие поля.',
      q: 'Нажимай кусочки по порядку и собери открывающий тег списка',
      why: 'Список — это тег select, и в Bootstrap 6 его тоже украшает form-control. form-select — имя из 5-й версии, а input — не список.',
    },
    en: {
      ctx: 'The group list should look nice too, like the other fields.',
      q: 'Tap the pieces in order to build the opening tag of the list',
      why: 'A list is the select tag, and in Bootstrap 6 it also gets form-control. form-select is a version 5 name, and input is not a list.',
    },
  },
  {
    id: 'bootstrap_l08_q16',
    type: 'build',
    difficulty: 'hard',
    tags: ['check', 'form-field'],
    pieces: ['<input', ' type="checkbox"', ' class="check">', '<label>', t3('Qoidalarga roziman', 'Принимаю правила', 'I accept the rules'), '</label>'],
    extra: [' class="form-check">', '</input>'],
    vis: { code: '<div class="form-field">\n  ___\n</div>' },
    uz: {
      ctx: "Forma oxirida «Qoidalarga roziman» galochkasi kerak: galochka va yozuv yonma-yon.",
      q: "Bo'laklarni tartib bilan bosing: oldin galochka, keyin yozuv",
      why: "Galochka — type checkbox bo'lgan input, uning so'zi check. Keyin label tegidagi yozuv. form-check — eski nom, input tegining esa yopuvchi tegi yo'q.",
    },
    ru: {
      ctx: 'В конце анкеты нужна галочка «Принимаю правила»: галочка и подпись рядом.',
      q: 'Нажимай кусочки по порядку: сначала галочка, потом подпись',
      why: 'Галочка — input с type checkbox и словом check. Потом подпись в теге label. form-check — старое имя, а у input нет закрывающего тега.',
    },
    en: {
      ctx: 'The end of the form needs an “I accept the rules” checkbox, with the box and caption side by side.',
      q: 'Tap the pieces in order: first the checkbox, then the caption',
      why: 'A checkbox is an input with type checkbox and the word check. Then comes the caption in a label tag. form-check is an old name, and input has no closing tag.',
    },
  },
  {
    id: 'bootstrap_l08_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['form-select', 'eski nom'],
    line: 4,
    vis: {
      code: t3(
        '<label class="form-label">Ism</label>\n<input type="text" class="form-control">\n<label class="form-label">Guruh</label>\n<select class="form-select">\n  <option>Robototexnika</option>\n</select>',
        '<label class="form-label">Имя</label>\n<input type="text" class="form-control">\n<label class="form-label">Группа</label>\n<select class="form-select">\n  <option>Робототехника</option>\n</select>',
        '<label class="form-label">Name</label>\n<input type="text" class="form-control">\n<label class="form-label">Group</label>\n<select class="form-select">\n  <option>Robotics</option>\n</select>',
      ),
      page: true,
    },
    uz: {
      ctx: "Forma eski darslikdagi kod bilan yozildi: Ism maydoni chiroyli, Guruh ro'yxati esa oddiy.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "4-qatorda form-select turibdi — bu beshinchi versiyaning nomi, oltinchisida bunday so'z yo'q. Bootstrap 6 da ro'yxat ham form-control bilan bezaladi.",
    },
    ru: {
      ctx: 'Анкету написали по коду из старого учебника: поле «Имя» красивое, а список «Группа» — простой.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 4 стоит form-select — это имя из 5-й версии, в 6-й такого слова нет. В Bootstrap 6 список тоже украшает form-control.',
    },
    en: {
      ctx: 'The form was written with code from an old tutorial: the Name field is nice, but the Group list is plain.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 4 has form-select, a version 5 name; version 6 has no such word. In Bootstrap 6 a list also gets form-control.',
    },
  },
  {
    id: 'bootstrap_l08_q18',
    type: 'tap',
    difficulty: 'medium',
    tags: ['form-control', 'eski nom'],
    answer: 'izoh',
    vis: {
      code: t3(
        '<label class="form-label">Ism</label>\n<input type="text" class="form-input">\n<label class="form-label">Guruh</label>\n<select class="form-select">…</select>\n<label class="form-label">Izoh</label>\n<textarea class="form-control"></textarea>',
        '<label class="form-label">Имя</label>\n<input type="text" class="form-input">\n<label class="form-label">Группа</label>\n<select class="form-select">…</select>\n<label class="form-label">Комментарий</label>\n<textarea class="form-control"></textarea>',
        '<label class="form-label">Name</label>\n<input type="text" class="form-input">\n<label class="form-label">Group</label>\n<select class="form-select">…</select>\n<label class="form-label">Comment</label>\n<textarea class="form-control"></textarea>',
      ),
      page: t3(
        '<div><label class="form-label">Ism</label></div>\n<input type="text" class="form-input" data-t="ism">\n<div><label class="form-label">Guruh</label></div>\n<select class="form-select" data-t="guruh"><option>Robototexnika</option></select>\n<div><label class="form-label">Izoh</label></div>\n<textarea class="form-control" data-t="izoh"></textarea>',
        '<div><label class="form-label">Имя</label></div>\n<input type="text" class="form-input" data-t="ism">\n<div><label class="form-label">Группа</label></div>\n<select class="form-select" data-t="guruh"><option>Робототехника</option></select>\n<div><label class="form-label">Комментарий</label></div>\n<textarea class="form-control" data-t="izoh"></textarea>',
        '<div><label class="form-label">Name</label></div>\n<input type="text" class="form-input" data-t="ism">\n<div><label class="form-label">Group</label></div>\n<select class="form-select" data-t="guruh"><option>Robotics</option></select>\n<div><label class="form-label">Comment</label></div>\n<textarea class="form-control" data-t="izoh"></textarea>',
      ),
    },
    uz: {
      ctx: "Kod eski va yangi darsliklardan aralash olingan. Faqat bitta maydon Bootstrap ko'rinishini oldi.",
      q: 'Qaysi maydonni Bootstrap bezadi? Ustiga bosing',
      why: "Bootstrap 6 maydonlar uchun faqat form-control so'zini taniydi — u Izoh maydonida. form-input degan so'z yo'q, form-select esa beshinchi versiyaning nomi.",
    },
    ru: {
      ctx: 'Код собран из старого и нового учебников. Только одно поле получило вид Bootstrap.',
      q: 'Какое поле украсил Bootstrap? Нажми на него',
      why: 'Для полей Bootstrap 6 знает только слово form-control — оно у поля «Комментарий». Слова form-input нет, а form-select — имя из 5-й версии.',
    },
    en: {
      ctx: 'The code is mixed from an old and a new tutorial. Only one field got the Bootstrap look.',
      q: 'Which field did Bootstrap style? Tap it',
      why: 'For fields, Bootstrap 6 knows only the word form-control, and it is on the Comment field. There is no form-input, and form-select is a version 5 name.',
    },
  },
];
