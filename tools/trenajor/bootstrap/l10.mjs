// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 9 «Menu и Dialog» — 11 вопросов с выбором (q01–q11) + 3 «впиши ответ» (q12–q14).
// Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Меню: menu-header, где на сайте (Components → Menu), пункт без menu-item, черта menu-divider, dropdown-* из старого кода;
// окно: dialog-header, data-bs-backdrop="static", всё на той же странице (загадка урока), свои надписи в примере с сайта,
// свой id — и в кнопке, два окна и data-bs-target. Ситуации тестов урока (tools/webtest/bootstrap/l09.jsx: toggle menu,
// тег dialog, «#» в target, data-bs-dismiss, нет script) не повторяются. Скриптов на странице нет: меню показано открытым
// (menu show position-static), окно — открытым (dialog open position-static). Формат — tools/trenajor/bootstrap/FORMAT.md.
// =============================================================================
export default [
  {
    id: 'bootstrap_l10_q01',
    difficulty: 'easy',
    tags: ['menu-header'],
    mono: true,
    sort: false,
    vis: {
      page: {
        uz: `<div class="menu show position-static"><h6 class="menu-header">Kurslar</h6><a class="menu-item" href="#">Robototexnika</a><a class="menu-item" href="#">Dasturlash</a><hr class="menu-divider"><a class="menu-item" href="#">Aloqa</a></div>`,
        ru: `<div class="menu show position-static"><h6 class="menu-header">Курсы</h6><a class="menu-item" href="#">Робототехника</a><a class="menu-item" href="#">Программирование</a><hr class="menu-divider"><a class="menu-item" href="#">Контакты</a></div>`,
        en: `<div class="menu show position-static"><h6 class="menu-header">Courses</h6><a class="menu-item" href="#">Robotics</a><a class="menu-item" href="#">Coding</a><hr class="menu-divider"><a class="menu-item" href="#">Contacts</a></div>`,
      },
    },
    uz: {
      ctx: "Menyuning tepasida kulrang «Kurslar» yozuvi turibdi, uni bosib bo'lmaydi.",
      q: "Bu yozuvga qaysi class yozilgan?",
      opts: ['menu-header', 'menu-item', 'menu-divider', 'dialog-title'],
      why: "menu-header — menyuning sarlavhasi: kulrang, bosilmaydi. menu-item esa bosiladigan band, menu-divider — bandlar orasidagi chiziq.",
    },
    ru: {
      ctx: 'Вверху меню стоит серая надпись «Курсы», на неё нельзя нажать.',
      q: 'Какой class у этой надписи?',
      opts: ['menu-header', 'menu-item', 'menu-divider', 'dialog-title'],
      why: 'menu-header — заголовок меню: серый, не нажимается. А menu-item — пункт, на который нажимают, menu-divider — черта между пунктами.',
    },
    en: {
      ctx: 'At the top of the menu there is a grey “Courses” label that you can’t tap.',
      q: 'Which class does this label have?',
      opts: ['menu-header', 'menu-item', 'menu-divider', 'dialog-title'],
      why: 'menu-header is the menu’s title: grey and not clickable. menu-item is an item you tap, and menu-divider is the line between items.',
    },
  },
  {
    id: 'bootstrap_l10_q02',
    difficulty: 'easy',
    tags: ['menu', 'docs'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Kutubxona saytiga ochiladigan menyu kerak. Misolni Bootstrap saytidan olamiz.",
      q: "Saytning qaysi bo'limida uni topasiz?",
      opts: ['Components → Menu', 'Utilities → Display', 'Getting started → Install', 'Forms → Select'],
      why: "Menyu, oyna, e'lon kabi tayyor qismlar Components bo'limida turadi. Menyu — Menu sahifasida, tugma va bandlar bilan birga.",
    },
    ru: {
      ctx: 'Сайту библиотеки нужно выпадающее меню. Пример берём с сайта Bootstrap.',
      q: 'В каком разделе сайта его искать?',
      opts: ['Components → Menu', 'Utilities → Display', 'Getting started → Install', 'Forms → Select'],
      why: 'Готовые части — меню, окно, объявление — лежат в разделе Components. Меню — на странице Menu, вместе с кнопкой и пунктами.',
    },
    en: {
      ctx: 'The library site needs a drop-down menu. We take the example from the Bootstrap site.',
      q: 'Which section of the site has it?',
      opts: ['Components → Menu', 'Utilities → Display', 'Getting started → Install', 'Forms → Select'],
      why: 'Ready-made parts like the menu, dialog and alert are in Components. The menu is on the Menu page, with its button and items.',
    },
  },
  {
    id: 'bootstrap_l10_q03',
    difficulty: 'medium',
    tags: ['menu-item'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<div class="menu show position-static">\n  <a class="menu-item" href="#">Ertaklar</a>\n  <a class="menu-item" href="#">She'rlar</a>\n  <a href="#">Komikslar</a>\n</div>`,
        ru: `<div class="menu show position-static">\n  <a class="menu-item" href="#">Сказки</a>\n  <a class="menu-item" href="#">Стихи</a>\n  <a href="#">Комиксы</a>\n</div>`,
        en: `<div class="menu show position-static">\n  <a class="menu-item" href="#">Fairy tales</a>\n  <a class="menu-item" href="#">Poems</a>\n  <a href="#">Comics</a>\n</div>`,
      },
      page: true,
    },
    uz: {
      ctx: "Kutubxona menyusida uchinchi band boshqalariga o'xshamayapti: ko'k va tagiga chizilgan.",
      q: "Uchinchi bandga nima yetishmayapti?",
      opts: ['class="menu-item"', 'class="dropdown-item"', 'class="menu"', 'class="menu-header"'],
      why: "Har bir band o'z menu-item class-ini oladi, shunda u menyu bandi bo'lib chiqadi. Usiz a tegi oddiy havola bo'lib qoladi.",
    },
    ru: {
      ctx: 'В меню библиотеки третий пункт не как другие: синий и подчёркнутый.',
      q: 'Чего не хватает третьему пункту?',
      opts: ['class="menu-item"', 'class="dropdown-item"', 'class="menu"', 'class="menu-header"'],
      why: 'Каждый пункт получает свой class menu-item — тогда он выглядит как пункт меню. Без него тег a остаётся простой ссылкой.',
    },
    en: {
      ctx: 'In the library menu the third item looks different: blue and underlined.',
      q: 'What is the third item missing?',
      opts: ['class="menu-item"', 'class="dropdown-item"', 'class="menu"', 'class="menu-header"'],
      why: 'Each item gets its own menu-item class, and then it looks like a menu item. Without it, the a tag stays a plain link.',
    },
  },
  {
    id: 'bootstrap_l10_q04',
    difficulty: 'medium',
    tags: ['menu-divider'],
    mono: true,
    sort: false,
    vis: {
      code: {
        uz: `<div class="menu">\n  <a class="menu-item" href="#">Robotlar</a>\n  <a class="menu-item" href="#">Musobaqalar</a>\n  ___\n  <a class="menu-item" href="#">Aloqa</a>\n</div>`,
        ru: `<div class="menu">\n  <a class="menu-item" href="#">Роботы</a>\n  <a class="menu-item" href="#">Турниры</a>\n  ___\n  <a class="menu-item" href="#">Контакты</a>\n</div>`,
        en: `<div class="menu">\n  <a class="menu-item" href="#">Robots</a>\n  <a class="menu-item" href="#">Contests</a>\n  ___\n  <a class="menu-item" href="#">Contacts</a>\n</div>`,
      },
      mark: [4],
    },
    uz: {
      ctx: "«Aloqa» bandi boshqalaridan ingichka chiziq bilan ajralib tursin.",
      q: "Bo'sh joyga qaysi qator yoziladi?",
      opts: ['<hr class="menu-divider">', '<hr class="menu-header">', '<a class="menu-divider">', '<br class="menu-line">'],
      why: "Chiziqni hr tegi chizadi, menu-divider esa uni menyuga moslaydi. menu-header — chiziq emas, kulrang sarlavha.",
    },
    ru: {
      ctx: 'Пусть пункт «Контакты» отделяется от остальных тонкой чертой.',
      q: 'Какая строка пишется на пустое место?',
      opts: ['<hr class="menu-divider">', '<hr class="menu-header">', '<a class="menu-divider">', '<br class="menu-line">'],
      why: 'Черту рисует тег hr, а menu-divider подгоняет её под меню. menu-header — не черта, а серый заголовок.',
    },
    en: {
      ctx: 'The “Contacts” item should be set apart from the others by a thin line.',
      q: 'Which line goes in the empty spot?',
      opts: ['<hr class="menu-divider">', '<hr class="menu-header">', '<a class="menu-divider">', '<br class="menu-line">'],
      why: 'The hr tag draws the line, and menu-divider fits it to the menu. menu-header is not a line but a grey title.',
    },
  },
  {
    id: 'bootstrap_l10_q05',
    difficulty: 'easy',
    tags: ['dialog-header'],
    mono: true,
    sort: false,
    vis: {
      code: {
        uz: `<dialog class="dialog" id="qoidalar">\n  <div class="___">\n    <h4 class="dialog-title">Qoidalar</h4>\n    <button class="btn-close" …></button>\n  </div>\n  <div class="dialog-body">…</div>\n</dialog>`,
        ru: `<dialog class="dialog" id="qoidalar">\n  <div class="___">\n    <h4 class="dialog-title">Правила</h4>\n    <button class="btn-close" …></button>\n  </div>\n  <div class="dialog-body">…</div>\n</dialog>`,
        en: `<dialog class="dialog" id="qoidalar">\n  <div class="___">\n    <h4 class="dialog-title">Rules</h4>\n    <button class="btn-close" …></button>\n  </div>\n  <div class="dialog-body">…</div>\n</dialog>`,
      },
      mark: [2],
    },
    uz: {
      ctx: "Oynaning tepa qismida sarlavha va yopish krestigi turadi.",
      q: "Bu qism uchun bo'sh joyga nima yoziladi?",
      opts: ['dialog-header', 'dialog-title', 'dialog-top', 'modal-header'],
      why: "Oyna uch qismdan iborat: tepasi dialog-header, o'rtasi dialog-body, pasti dialog-footer. dialog-title — tepadagi sarlavhaning o'zi.",
    },
    ru: {
      ctx: 'В верхней части окна стоят заголовок и крестик закрытия.',
      q: 'Что пишется на пустое место для этой части?',
      opts: ['dialog-header', 'dialog-title', 'dialog-top', 'modal-header'],
      why: 'Окно из трёх частей: верх — dialog-header, середина — dialog-body, низ — dialog-footer. dialog-title — сам заголовок внутри верха.',
    },
    en: {
      ctx: 'The top part of the dialog holds the title and the close cross.',
      q: 'What goes in the empty spot for this part?',
      opts: ['dialog-header', 'dialog-title', 'dialog-top', 'modal-header'],
      why: 'A dialog has three parts: the top is dialog-header, the middle dialog-body, the bottom dialog-footer. dialog-title is the title itself.',
    },
  },
  {
    id: 'bootstrap_l10_q06',
    difficulty: 'medium',
    tags: ['data-bs-backdrop'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Test oynasi orqadagi xira fon bosilganda yopilib qolmasin, faqat tugma bilan yopilsin.",
      q: "Oynani ochadigan tugmaga qaysi atribut yoziladi?",
      opts: ['data-bs-backdrop="static"', 'data-bs-dismiss="static"', 'class="position-static"', 'data-bs-backdrop="dialog"'],
      why: "Odatda fon bosilsa, oyna yopiladi. data-bs-backdrop static bo'lsa, fon yopmaydi: faqat krestik yoki dismiss tugmasi.",
    },
    ru: {
      ctx: 'Окно с тестом не должно закрываться по нажатию на тёмный фон — только кнопкой.',
      q: 'Какой атрибут пишется у кнопки, которая открывает окно?',
      opts: ['data-bs-backdrop="static"', 'data-bs-dismiss="static"', 'class="position-static"', 'data-bs-backdrop="dialog"'],
      why: 'Обычно нажатие на фон закрывает окно. Если data-bs-backdrop равен static, фон не закрывает: только крестик или кнопка с dismiss.',
    },
    en: {
      ctx: 'The quiz dialog should not close when you tap the dark backdrop, only with a button.',
      q: 'Which attribute goes on the button that opens the dialog?',
      opts: ['data-bs-backdrop="static"', 'data-bs-dismiss="static"', 'class="position-static"', 'data-bs-backdrop="dialog"'],
      why: 'Usually tapping the backdrop closes the dialog. With data-bs-backdrop set to static it doesn’t: only the cross or a dismiss button.',
    },
  },
  {
    id: 'bootstrap_l10_q07',
    difficulty: 'medium',
    tags: ['dialog'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "To'garak saytida «Qoidalar» tugmasi bosilganda qoidalar oynasi ochiladi.",
      q: "Bu oyna qayerda turadi?",
      opts: [
        "Shu sahifaning o'zida, dialog tegida yashirin",
        "Alohida qoidalar.html sahifasida",
        "Bootstrap saytida, script uni olib keladi",
        "Brauzerning yangi yorlig'ida ochiladi",
      ],
      why: "Oyna kodi shu sahifada, dialog tegi ichida yozilgan va bosilguncha yashirin turadi. Tugma uni ko'rsatadi, yangi sahifa kerak emas.",
    },
    ru: {
      ctx: 'На сайте кружка по нажатию «Правила» открывается окно с правилами.',
      q: 'Где находится это окно?',
      opts: [
        'На этой же странице, спрятано в теге dialog',
        'На отдельной странице qoidalar.html',
        'На сайте Bootstrap, script его приносит',
        'Открывается в новой вкладке браузера',
      ],
      why: 'Код окна написан на этой же странице, в теге dialog, и спрятан до нажатия. Кнопка его показывает — новая страница не нужна.',
    },
    en: {
      ctx: 'On the club site, tapping “Rules” opens a dialog with the rules.',
      q: 'Where is this dialog?',
      opts: [
        'On this same page, hidden in a dialog tag',
        'On a separate page, qoidalar.html',
        'On the Bootstrap site, script brings it',
        'It opens in a new browser tab',
      ],
      why: 'The dialog code is written on this same page, inside a dialog tag, and stays hidden until the tap. The button shows it; no new page is needed.',
    },
  },
  {
    id: 'bootstrap_l10_q08',
    difficulty: 'medium',
    tags: ['dropdown', 'menu'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<div class="dropdown-menu show">\n  <a class="dropdown-item" href="#">Pitsa</a>\n  <a class="dropdown-item" href="#">Salat</a>\n  <a class="dropdown-item" href="#">Sharbat</a>\n</div>`,
        ru: `<div class="dropdown-menu show">\n  <a class="dropdown-item" href="#">Пицца</a>\n  <a class="dropdown-item" href="#">Салат</a>\n  <a class="dropdown-item" href="#">Сок</a>\n</div>`,
        en: `<div class="dropdown-menu show">\n  <a class="dropdown-item" href="#">Pizza</a>\n  <a class="dropdown-item" href="#">Salad</a>\n  <a class="dropdown-item" href="#">Juice</a>\n</div>`,
      },
      page: true,
    },
    uz: {
      ctx: "Kafe menyusi eski blogdan ko'chirildi. Bootstrap 6 ulangan, lekin bandlar oddiy havolalar.",
      q: "Nega menyu bezaksiz chiqdi?",
      opts: [
        "dropdown so'zlari — 5-versiya nomlari, 6 da menu",
        "menyu faqat ul va li teglarida ishlaydi",
        "show so'zi menyuni bezaksiz qilib qo'yadi",
        "a teglarida href bo'lsa, bezak berilmaydi",
      ],
      why: "dropdown-menu va dropdown-item — eski nomlar, beshinchi versiyadan. Oltinchisida ro'yxat — menu, bandlar — menu-item.",
    },
    ru: {
      ctx: 'Меню кафе скопировали из старого блога. Bootstrap 6 подключён, но пункты — простые ссылки.',
      q: 'Почему меню вышло без оформления?',
      opts: [
        'dropdown — имена 5-й версии, в 6-й это menu',
        'меню работает только в тегах ul и li',
        'слово show убирает у меню оформление',
        'если у тегов a есть href, оформления нет',
      ],
      why: 'dropdown-menu и dropdown-item — старые имена из пятой версии. В шестой список — menu, пункты — menu-item.',
    },
    en: {
      ctx: 'The café menu was copied from an old blog. Bootstrap 6 is connected, but the items are plain links.',
      q: 'Why does the menu have no styling?',
      opts: [
        'dropdown is a version 5 name; in 6 it’s menu',
        'a menu works only with ul and li tags',
        'the word show removes the menu’s styling',
        'a tags with href get no styling',
      ],
      why: 'dropdown-menu and dropdown-item are old names from version five. In version six the list is menu and the items are menu-item.',
    },
  },
  {
    id: 'bootstrap_l10_q09',
    difficulty: 'hard',
    tags: ['id', 'data-bs-target'],
    mono: false,
    sort: false,
    vis: {
      code: `<button class="btn-solid theme-primary"\n        data-bs-toggle="dialog"\n        data-bs-target="#exampleDialog">\n  Open dialog\n</button>\n<dialog class="dialog" id="qoidalar">\n  …\n</dialog>`,
      mark: [3, 6],
    },
    uz: {
      ctx: "Saytdan olingan oynada id endi exampleDialog emas, qoidalar. Tugma esa oynani ochmayapti.",
      q: "Yana nimani o'zgartirish kerak?",
      opts: [
        "data-bs-target atributiga #qoidalar yozish",
        "dialog-title o'rniga qoidalar yozish",
        "data-bs-toggle o'rniga qoidalar yozish",
        "Hech narsa: Bootstrap oynani o'zi topadi",
      ],
      why: "Tugma oynani data-bs-target dagi id bo'yicha qidiradi. id o'zgarsa, tugmada ham o'sha id panjara bilan yoziladi: #qoidalar.",
    },
    ru: {
      ctx: 'Окно скопировали с сайта и сменили id: вместо exampleDialog — qoidalar. Теперь кнопка окно не открывает.',
      q: 'Что ещё нужно поменять?',
      opts: [
        'В data-bs-target кнопки написать #qoidalar',
        'Вместо dialog-title написать qoidalar',
        'Вместо data-bs-toggle написать qoidalar',
        'Ничего: Bootstrap сам найдёт окно',
      ],
      why: 'Кнопка ищет окно по id в data-bs-target. Сменился id — у кнопки пишется тот же id с решёткой: #qoidalar.',
    },
    en: {
      ctx: 'In the dialog from the site the id is now qoidalar, not exampleDialog. The button won’t open it.',
      q: 'What else needs to change?',
      opts: [
        'Put #qoidalar in the button’s data-bs-target',
        'Write qoidalar instead of dialog-title',
        'Write qoidalar instead of data-bs-toggle',
        'Nothing: Bootstrap finds the dialog itself',
      ],
      why: 'The button looks for the dialog by the id in data-bs-target. If the id changes, the button gets the same id with a hash: #qoidalar.',
    },
  },
  {
    id: 'bootstrap_l10_q10',
    difficulty: 'easy',
    tags: ['dialog-title', 'docs'],
    mono: false,
    sort: false,
    vis: {
      code: `<dialog class="dialog" id="exampleDialog">\n  <div class="dialog-header">\n    <h1 class="dialog-title">Dialog title</h1>\n    <button class="btn-close" …></button>\n  </div>\n  …\n</dialog>`,
      mark: [3],
    },
    uz: {
      ctx: "Saytdan oyna nusxalandi. Sarlavhada inglizcha Dialog title turibdi, kerakli sarlavha — Musobaqa kuni.",
      q: "Uni o'zingizniki qilish uchun nima qilasiz?",
      opts: [
        "Dialog title yozuvini o'zgartiraman",
        "dialog-title class-ini o'zgartiraman",
        "h1 tegini title tegiga almashtiraman",
        "Hech narsa: sarlavha o'zi tarjima bo'ladi",
      ],
      why: "Moslashda faqat yozuv almashadi: teglar orasidagi Dialog title. dialog-title class-i qoladi, aks holda sarlavha bezagi yo'qoladi.",
    },
    ru: {
      ctx: 'С сайта скопировали окно. В заголовке английское Dialog title, а нужно «День турнира».',
      q: 'Что сделать, чтобы заголовок стал своим?',
      opts: [
        'Поменять надпись Dialog title',
        'Поменять class dialog-title',
        'Заменить тег h1 на тег title',
        'Ничего: заголовок переведётся сам',
      ],
      why: 'При настройке меняется только надпись — Dialog title между тегами. class dialog-title остаётся, иначе заголовок потеряет оформление.',
    },
    en: {
      ctx: 'A dialog was copied from the site. The title says Dialog title, but it should be “Contest day”.',
      q: 'What do you do to make the title your own?',
      opts: [
        'Change the text Dialog title',
        'Change the class dialog-title',
        'Swap the h1 tag for a title tag',
        'Nothing: the title translates itself',
      ],
      why: 'When you adapt it, only the text changes: Dialog title between the tags. The dialog-title class stays, or the title loses its styling.',
    },
  },
  {
    id: 'bootstrap_l10_q11',
    difficulty: 'hard',
    tags: ['data-bs-target', 'id'],
    mono: false,
    sort: false,
    vis: {
      code: {
        uz: `<button class="btn-solid theme-info"\n        data-bs-toggle="dialog"\n        data-bs-target="#vaqt">Jadval</button>\n<dialog class="dialog" id="jadval">\n  <h4 class="dialog-title">Qoidalar</h4>\n</dialog>\n<dialog class="dialog" id="vaqt">\n  <h4 class="dialog-title">Dars vaqti</h4>\n</dialog>`,
        ru: `<button class="btn-solid theme-info"\n        data-bs-toggle="dialog"\n        data-bs-target="#vaqt">Расписание</button>\n<dialog class="dialog" id="jadval">\n  <h4 class="dialog-title">Правила</h4>\n</dialog>\n<dialog class="dialog" id="vaqt">\n  <h4 class="dialog-title">Время занятий</h4>\n</dialog>`,
        en: `<button class="btn-solid theme-info"\n        data-bs-toggle="dialog"\n        data-bs-target="#vaqt">Schedule</button>\n<dialog class="dialog" id="jadval">\n  <h4 class="dialog-title">Rules</h4>\n</dialog>\n<dialog class="dialog" id="vaqt">\n  <h4 class="dialog-title">Class times</h4>\n</dialog>`,
      },
    },
    uz: {
      ctx: "Sahifada ikkita oyna bor. script qatori ham joyida.",
      q: "«Jadval» tugmasi bosilganda qaysi oyna ochiladi?",
      opts: [
        "«Dars vaqti» oynasi",
        "«Qoidalar» oynasi",
        "Ikkala oyna birga ochiladi",
        "Hech biri: id tugma yozuviga mos emas",
      ],
      why: "Tugma yozuviga emas, data-bs-target ga qaraydi: #vaqt. Bu id «Dars vaqti» oynasida, shuning uchun o'sha ochiladi.",
    },
    ru: {
      ctx: 'На странице два окна. Строка script тоже на месте.',
      q: 'Какое окно откроется по нажатию «Расписание»?',
      opts: [
        'Окно «Время занятий»',
        'Окно «Правила»',
        'Откроются оба окна сразу',
        'Никакое: id не совпадает с надписью',
      ],
      why: 'Кнопка смотрит не на надпись, а на data-bs-target: #vaqt. Этот id у окна «Время занятий», поэтому откроется оно.',
    },
    en: {
      ctx: 'The page has two dialogs. The script line is in place too.',
      q: 'Which dialog opens when you tap “Schedule”?',
      opts: [
        'The “Class times” dialog',
        'The “Rules” dialog',
        'Both dialogs open at once',
        'None: the id doesn’t match the label',
      ],
      why: 'The button doesn’t look at its label but at data-bs-target: #vaqt. That id belongs to the “Class times” dialog, so that one opens.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'bootstrap_l10_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['menu-item'],
    mono: true,
    answer: ['menu-item'],
    vis: {
      code: {
        uz: `<div class="menu">\n  <a class="menu-item" href="#">Sport</a>\n  <a class="menu-item" href="#">Musiqa</a>\n  <a class="___" href="#">Rasm</a>\n</div>`,
        ru: `<div class="menu">\n  <a class="menu-item" href="#">Спорт</a>\n  <a class="menu-item" href="#">Музыка</a>\n  <a class="___" href="#">Рисование</a>\n</div>`,
        en: `<div class="menu">\n  <a class="menu-item" href="#">Sports</a>\n  <a class="menu-item" href="#">Music</a>\n  <a class="___" href="#">Drawing</a>\n</div>`,
      },
    },
    uz: {
      ctx: "Lager menyusida uchinchi to'garak ham menyu bandi bo'lishi kerak.",
      q: "Bo'sh joyga bitta so'z yozing.",
      why: "Menyuning har bir bandi menu-item class-ini oladi. Qolgan ikki bandda ham xuddi shu so'z turibdi.",
    },
    ru: {
      ctx: 'В меню лагеря третий кружок тоже должен стать пунктом меню.',
      q: 'Впиши на пустое место одно слово.',
      why: 'Каждый пункт меню получает class menu-item. У двух других пунктов стоит то же самое слово.',
    },
    en: {
      ctx: 'In the camp menu, the third club should be a menu item too.',
      q: 'Type one word in the empty spot.',
      why: 'Every menu item gets the menu-item class. The other two items have the same word.',
    },
  },
  {
    id: 'bootstrap_l10_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['dialog-body'],
    mono: true,
    answer: ['dialog-body'],
    vis: {
      code: {
        uz: `<dialog class="dialog" id="yangilik">\n  <div class="dialog-header">\n    <h4 class="dialog-title">Yangilik</h4>\n  </div>\n  <div class="___">\n    <p>Shanba kuni robotlar ko'rgazmasi!</p>\n  </div>\n</dialog>`,
        ru: `<dialog class="dialog" id="yangilik">\n  <div class="dialog-header">\n    <h4 class="dialog-title">Новость</h4>\n  </div>\n  <div class="___">\n    <p>В субботу выставка роботов!</p>\n  </div>\n</dialog>`,
        en: `<dialog class="dialog" id="yangilik">\n  <div class="dialog-header">\n    <h4 class="dialog-title">News</h4>\n  </div>\n  <div class="___">\n    <p>Robot show on Saturday!</p>\n  </div>\n</dialog>`,
      },
    },
    uz: {
      ctx: "Yangilik matni oynaning asosiy, o'rta qismida tursin.",
      q: "Bo'sh joyga bitta class nomini yozing.",
      why: "Oynaning o'rta qismi — dialog-body: matnga joy va chiroyli chekka beradi. Tepasi dialog-header, pasti dialog-footer.",
    },
    ru: {
      ctx: 'Текст новости должен стоять в основной, средней части окна.',
      q: 'Впиши на пустое место одно имя class.',
      why: 'Средняя часть окна — dialog-body: даёт тексту место и аккуратные поля. Верх — dialog-header, низ — dialog-footer.',
    },
    en: {
      ctx: 'The news text should be in the main, middle part of the dialog.',
      q: 'Type one class name in the empty spot.',
      why: 'The middle part of a dialog is dialog-body: it gives the text room and neat padding. The top is dialog-header, the bottom dialog-footer.',
    },
  },
  {
    id: 'bootstrap_l10_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['data-bs-backdrop'],
    mono: true,
    answer: ['static', '"static"'],
    vis: {
      code: {
        uz: `<button class="btn-solid theme-danger"\n        data-bs-toggle="dialog"\n        data-bs-target="#test"\n        data-bs-backdrop="___">\n  Testni boshlash\n</button>`,
        ru: `<button class="btn-solid theme-danger"\n        data-bs-toggle="dialog"\n        data-bs-target="#test"\n        data-bs-backdrop="___">\n  Начать тест\n</button>`,
        en: `<button class="btn-solid theme-danger"\n        data-bs-toggle="dialog"\n        data-bs-target="#test"\n        data-bs-backdrop="___">\n  Start the quiz\n</button>`,
      },
    },
    uz: {
      ctx: "Test oynasi xira fon bosilganda yopilmasin, faqat tugma bilan yopilsin.",
      q: "Bo'sh joyga qo'shtirnoq ichidagi qiymatni yozing.",
      why: "data-bs-backdrop static bo'lsa, fon oynani yopmaydi. Uni faqat krestik yoki data-bs-dismiss tugmasi yopadi.",
    },
    ru: {
      ctx: 'Окно теста не должно закрываться по нажатию на тёмный фон — только кнопкой.',
      q: 'Впиши на пустое место значение, которое стоит в кавычках.',
      why: 'Если data-bs-backdrop равен static, фон окно не закрывает. Закроет только крестик или кнопка с data-bs-dismiss.',
    },
    en: {
      ctx: 'The quiz dialog should not close when you tap the dark backdrop, only with a button.',
      q: 'Type the value that goes inside the quotes.',
      why: 'With data-bs-backdrop set to static, the backdrop doesn’t close the dialog. Only the cross or a data-bs-dismiss button does.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l10_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['menu-item'],
    pieces: ['<a href="#"', ' class="menu-item"', '>', { uz: "G'oliblar", ru: 'Победители', en: 'Winners' }, '</a>'],
    extra: [' class="dropdown"', '<li'],
    vis: {
      code: {
        uz: `<div class="menu">\n  <a href="#" class="menu-item">Qoidalar</a>\n  <a href="#" class="menu-item">Jadval</a>\n  ___\n</div>`,
        ru: `<div class="menu">\n  <a href="#" class="menu-item">Правила</a>\n  <a href="#" class="menu-item">Расписание</a>\n  ___\n</div>`,
        en: `<div class="menu">\n  <a href="#" class="menu-item">Rules</a>\n  <a href="#" class="menu-item">Schedule</a>\n  ___\n</div>`,
      },
    },
    uz: {
      ctx: "Musobaqa menyusiga uchinchi band kerak: «G'oliblar».",
      q: "Bo'laklarni tartib bilan bosib, menyu bandini yig'ing",
      why: "Menyu bandi — a tegi va menu-item class-i, xuddi qolgan ikkitasidek. dropdown — beshinchi versiyaning nomi, li esa menyu bandi emas.",
    },
    ru: {
      ctx: 'В меню турнира нужен третий пункт: «Победители».',
      q: 'Нажимай кусочки по порядку и собери пункт меню',
      why: 'Пункт меню — тег a с class menu-item, как два других. dropdown — имя пятой версии, а li — не пункт меню.',
    },
    en: {
      ctx: 'The contest menu needs a third item: “Winners”.',
      q: 'Tap the pieces in order to build the menu item',
      why: 'A menu item is an a tag with the menu-item class, just like the other two. dropdown is a version 5 name, and li is not a menu item.',
    },
  },
  {
    id: 'bootstrap_l10_q16',
    type: 'build',
    difficulty: 'hard',
    tags: ['btn-close', 'data-bs-dismiss'],
    pieces: ['<button', ' class="btn-close"', ' data-bs-dismiss=', '"dialog">', '</button>'],
    extra: [' data-bs-toggle=', '"modal">'],
    vis: {
      code: {
        uz: `<dialog class="dialog" id="xabar">\n  <div class="dialog-header">\n    <h4 class="dialog-title">Xabar</h4>\n    ___\n  </div>\n</dialog>`,
        ru: `<dialog class="dialog" id="xabar">\n  <div class="dialog-header">\n    <h4 class="dialog-title">Сообщение</h4>\n    ___\n  </div>\n</dialog>`,
        en: `<dialog class="dialog" id="xabar">\n  <div class="dialog-header">\n    <h4 class="dialog-title">Message</h4>\n    ___\n  </div>\n</dialog>`,
      },
    },
    uz: {
      ctx: "Oyna sarlavhasi yonida yopish krestigi bo'lsin, bosilganda oyna yopilsin.",
      q: "Bo'laklarni tartib bilan bosib, krestik tugmasini yig'ing",
      why: "btn-close tugmani krestik qiladi, data-bs-dismiss dialog esa bosilganda oynani yopadi. toggle oynani ochadi, modal — eski nom.",
    },
    ru: {
      ctx: 'Рядом с заголовком окна нужен крестик: по нажатию окно закрывается.',
      q: 'Нажимай кусочки по порядку и собери кнопку-крестик',
      why: 'btn-close делает кнопку крестиком, а data-bs-dismiss="dialog" закрывает окно по нажатию. toggle окно открывает, modal — старое имя.',
    },
    en: {
      ctx: 'Next to the dialog title there should be a cross that closes the dialog.',
      q: 'Tap the pieces in order to build the cross button',
      why: 'btn-close turns the button into a cross, and data-bs-dismiss="dialog" closes the dialog on tap. toggle opens it, and modal is an old name.',
    },
  },
  {
    id: 'bootstrap_l10_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['menu-item', 'dropdown'],
    line: 5,
    vis: {
      code: {
        uz: `<button class="btn-solid theme-primary"\n        data-bs-toggle="menu">Kitoblar</button>\n<div class="menu">\n  <a class="menu-item" href="#">Ertaklar</a>\n  <a class="dropdown-item" href="#">She'rlar</a>\n</div>`,
        ru: `<button class="btn-solid theme-primary"\n        data-bs-toggle="menu">Книги</button>\n<div class="menu">\n  <a class="menu-item" href="#">Сказки</a>\n  <a class="dropdown-item" href="#">Стихи</a>\n</div>`,
        en: `<button class="btn-solid theme-primary"\n        data-bs-toggle="menu">Books</button>\n<div class="menu">\n  <a class="menu-item" href="#">Fairy tales</a>\n  <a class="dropdown-item" href="#">Poems</a>\n</div>`,
      },
      page: {
        uz: `<div class="menu show position-static"><a class="menu-item" href="#">Ertaklar</a><a class="dropdown-item" href="#">She'rlar</a></div>`,
        ru: `<div class="menu show position-static"><a class="menu-item" href="#">Сказки</a><a class="dropdown-item" href="#">Стихи</a></div>`,
        en: `<div class="menu show position-static"><a class="menu-item" href="#">Fairy tales</a><a class="dropdown-item" href="#">Poems</a></div>`,
      },
    },
    uz: {
      ctx: "Kutubxona menyusi ochilganda bitta band oddiy ko'k havola bo'lib qoldi.",
      q: "Qaysi qatorda xato bor? Shu qatorni bosing",
      why: "5-qatorda dropdown-item yozilgan — bu beshinchi versiyaning nomi. Oltinchisida menyu bandi menu-item bo'ladi.",
    },
    ru: {
      ctx: 'В открытом меню библиотеки один пункт остался простой синей ссылкой.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В 5-й строке написано dropdown-item — это имя пятой версии. В шестой пункт меню — menu-item.',
    },
    en: {
      ctx: 'In the open library menu, one item stayed a plain blue link.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 5 says dropdown-item, which is a version 5 name. In version six a menu item is menu-item.',
    },
  },
  {
    id: 'bootstrap_l10_q18',
    type: 'tap',
    difficulty: 'easy',
    tags: ['dialog-footer'],
    answer: 'footer',
    vis: {
      page: {
        uz: `<dialog class="dialog position-static" open><div class="dialog-header" data-t="header"><h4 class="dialog-title">Yozilish</h4><button class="btn-close" aria-label="Close"></button></div><div class="dialog-body" data-t="body"><p>Musobaqa 25-noyabr kuni. Jamoangizni kutamiz!</p></div><div class="dialog-footer" data-t="footer"><button class="btn-solid theme-secondary">Yopish</button><button class="btn-solid theme-success">Yozilish</button></div></dialog>`,
        ru: `<dialog class="dialog position-static" open><div class="dialog-header" data-t="header"><h4 class="dialog-title">Запись</h4><button class="btn-close" aria-label="Close"></button></div><div class="dialog-body" data-t="body"><p>Турнир 25 ноября. Ждём вашу команду!</p></div><div class="dialog-footer" data-t="footer"><button class="btn-solid theme-secondary">Закрыть</button><button class="btn-solid theme-success">Записаться</button></div></dialog>`,
        en: `<dialog class="dialog position-static" open><div class="dialog-header" data-t="header"><h4 class="dialog-title">Sign-up</h4><button class="btn-close" aria-label="Close"></button></div><div class="dialog-body" data-t="body"><p>The contest is on November 25. We’re waiting for your team!</p></div><div class="dialog-footer" data-t="footer"><button class="btn-solid theme-secondary">Close</button><button class="btn-solid theme-success">Sign up</button></div></dialog>`,
      },
    },
    uz: {
      ctx: "Ochilgan yozilish oynasi uch qismdan iborat.",
      q: "Oynada dialog-footer yasagan qismni bosing",
      why: "dialog-footer — oynaning pastki qismi, unda tugmalar turadi. Tepada dialog-header sarlavha bilan, o'rtada dialog-body matn bilan.",
    },
    ru: {
      ctx: 'Открытое окно записи состоит из трёх частей.',
      q: 'Нажми на часть окна, которую сделал dialog-footer',
      why: 'dialog-footer — нижняя часть окна, в ней стоят кнопки. Сверху dialog-header с заголовком, в середине dialog-body с текстом.',
    },
    en: {
      ctx: 'The open sign-up dialog has three parts.',
      q: 'Tap the part of the dialog made by dialog-footer',
      why: 'dialog-footer is the bottom part of the dialog, where the buttons are. On top is dialog-header with the title, in the middle dialog-body with the text.',
    },
  },
];
