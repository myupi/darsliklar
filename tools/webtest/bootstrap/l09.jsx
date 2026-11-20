// =============================================================================
// ТЕСТЫ К УРОКУ 9 МОДУЛЯ BOOTSTRAP «Menu и Dialog» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: кнопка меню — data-bs-toggle="menu" (dropdown — имя версии 5); окно — тег dialog с class="dialog"
// (modal — версия 5); кнопка открывает окно по id с «#»; закрывает — data-bs-dismiss="dialog"; без строки script кнопки мёртвые.
// Страница — честная (bs={BS_CSS}): меню показано открытым (menu show position-static), окно — открытым (open).
// Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'menu-i-dialog';
const b9Menu = (T, toggle) => [
  `<button class="btn-solid theme-primary" data-bs-toggle="${toggle}">`,
  `  ${T("Guruhlar", 'Группы', 'Groups')}`,
  '</button>',
  '<div class="menu">',
  `  <a class="menu-item" href="#">${T('Boshlovchilar', 'Новички', 'Beginners')}</a>`,
  `  <a class="menu-item" href="#">${T('Ustalar', 'Мастера', 'Masters')}</a>`,
  '</div>'].join('\n');
const b9MenuPage = (T) => `<button class="btn-solid theme-primary">${T("Guruhlar", 'Группы', 'Groups')}</button><div class="menu show position-static mt-3"><a class="menu-item" href="#">${T('Boshlovchilar', 'Новички', 'Beginners')}</a><a class="menu-item" href="#">${T('Ustalar', 'Мастера', 'Masters')}</a></div>`;
const QS = [
  { id: 'bootstrap-09t1', target: 'bootstrap-09', ptype: 'Bootstrap', tag: 'menu', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b9Menu(T, '___')} html={b9MenuPage(T)} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "«Guruhlar» tugmasi bosilganda o'ngdagidek menyu ochilishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['dropdown', 'dialog', 'menu', 'modal'],
      ok: "Qoyil! data-bs-toggle=\"menu\" — «bosilganda menyuni och». Menyu tugmaning yonidagi menu div-i. dropdown esa beshinchi versiyaning nomi.", hint: "Bootstrap 6 da ochiladigan ro'yxat qanday ataladi? Kodda tugmaning ostidagi div-ga qarang.", alt: "Ochilgan menyu va uning kodi" },
    ru: { ctx: 'При нажатии «Группы» должно открываться меню, как справа.', q: 'Что пишется на пустое место?', opts: ['dropdown', 'dialog', 'menu', 'modal'],
      ok: 'Здорово! data-bs-toggle="menu" значит «по нажатию открой меню». Меню — соседний div с class menu. А dropdown — имя пятой версии.', hint: 'Как в Bootstrap 6 называется выпадающий список? Посмотрите на div под кнопкой в коде.', alt: 'Открытое меню и его код' },
    en: { ctx: 'Clicking “Groups” should open a menu, like on the right.', q: 'What goes in the empty spot?', opts: ['dropdown', 'dialog', 'menu', 'modal'],
      ok: 'Nice work! data-bs-toggle="menu" means “open the menu on click”. The menu is the next div with class menu. dropdown is a version 5 name.', hint: 'What is a drop-down list called in Bootstrap 6? Look at the div below the button in the code.', alt: 'An open menu and its code' } },
  { id: 'bootstrap-09t2', target: 'bootstrap-09', ptype: 'Bootstrap', tag: 'dialog', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis html={`<dialog open class="dialog position-static"><div class="dialog-header"><h5 class="dialog-title">${T("Yozilish", 'Запись', 'Sign up')}</h5></div><div class="dialog-body">${T("Joylar soni cheklangan!", 'Мест мало!', 'Places are limited!')}</div></dialog>`} bs={BS_CSS} />; },
    uz: { ctx: "Sahifa ustida shunday oyna ochilishi kerak.", q: 'Bootstrap 6 da oyna qaysi teg bilan boshlanadi?', opts: ['<dialog class="dialog">', '<div class="modal">', '<window class="dialog">', '<div class="popup-window">'],
      ok: "To'ppa-to'g'ri! Bootstrap 6 oyna uchun brauzerning o'z dialog tegini oladi. modal esa beshinchi versiyadan qolgan.", hint: "Dars nomini eslang: Menu va ... . Bu so'z ham teg, ham class bo'lib yozilgan edi.", alt: "Sahifadagi ochiq oyna" },
    ru: { ctx: 'Над страницей должно открываться такое окно.', q: 'С какого тега начинается окно в Bootstrap 6?', opts: ['<dialog class="dialog">', '<div class="modal">', '<window class="dialog">', '<div class="popup-window">'],
      ok: 'Верно! Для окна Bootstrap 6 берёт родной тег браузера dialog. А modal остался от пятой версии.', hint: 'Вспомните название урока: Menu и ... . Это слово было и тегом, и class.', alt: 'Открытое окно на странице' },
    en: { ctx: 'A window like this should open over the page.', q: 'Which tag starts a window in Bootstrap 6?', opts: ['<dialog class="dialog">', '<div class="modal">', '<window class="dialog">', '<div class="popup-window">'],
      ok: 'Right! For a window Bootstrap 6 uses the browser’s own dialog tag. modal is left over from version 5.', hint: 'Remember the lesson title: Menu and ... . That word was both the tag and the class.', alt: 'An open window on the page' } },
  { id: 'bootstrap-09t3', target: 'bootstrap-09', ptype: 'Bootstrap', tag: 'target', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<button class="btn-solid theme-primary"\n        data-bs-toggle="dialog"\n        data-bs-target="___">\n  ${T("Yozilish", 'Записаться', 'Sign up')}\n</button>\n<dialog class="dialog" id="yozilish">\n  …\n</dialog>`} mark={[3, 6]} />; },
    uz: { ctx: "Tugma bosilganda aynan shu oyna ochilishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['yozilish', '.yozilish', 'dialog', '#yozilish'],
      ok: "Xuddi shunday! data-bs-target oynani id bo'yicha topadi, id oldida esa # turadi: #yozilish. Karuseldagi tugmalar ham xuddi shunday edi.", hint: "Oynaning id-si nima? 8-darsdagi karusel tugmalarida id oldiga qanday belgi qo'yilardi?", alt: "Oyna tugmasi va oyna kodi" },
    ru: { ctx: 'По нажатию кнопки должно открываться именно это окно.', q: 'Что пишется на пустое место?', opts: ['yozilish', '.yozilish', 'dialog', '#yozilish'],
      ok: 'Именно! data-bs-target находит окно по id, а перед id стоит #: #yozilish. Так же было у кнопок карусели.', hint: 'Какой id у окна? Какой знак ставили перед id у кнопок карусели в уроке 8?', alt: 'Кнопка окна и код окна' },
    en: { ctx: 'Clicking the button should open exactly this window.', q: 'What goes in the empty spot?', opts: ['yozilish', '.yozilish', 'dialog', '#yozilish'],
      ok: 'Exactly! data-bs-target finds the window by its id, with # in front: #yozilish. The carousel buttons worked the same way.', hint: 'What is the window’s id? Which sign went before the id on the carousel buttons in lesson 8?', alt: 'A window button and the window code' } },
  { id: 'bootstrap-09t4', target: 'bootstrap-09', ptype: 'Bootstrap', tag: 'dismiss', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<dialog class="dialog" id="yozilish">\n  <div class="dialog-body">\n    ${T("Joylar soni cheklangan!", 'Мест мало!', 'Places are limited!')}\n  </div>\n  <div class="dialog-footer">\n    <button class="btn-solid theme-secondary"\n            ___>${T('Yopish', 'Закрыть', 'Close')}</button>\n  </div>\n</dialog>`} mark={[7]} />; },
    uz: { ctx: "«Yopish» tugmasi oynani yopishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['data-bs-toggle="dialog"', 'data-bs-dismiss="dialog"', 'data-bs-close="dialog"', 'data-bs-target="#close"'],
      ok: "Juda zo'r! data-bs-dismiss — «yop, olib tashla». toggle oynani ochadi, dismiss esa yopadi.", hint: "Ochish uchun toggle bor edi. Yopish uchun-chi? Bu so'z 1-darsdagi e'lonning yopish tugmasida ham bor edi.", alt: "Oynaning Yopish tugmasi kodi" },
    ru: { ctx: 'Кнопка «Закрыть» должна закрывать окно.', q: 'Что пишется на пустое место?', opts: ['data-bs-toggle="dialog"', 'data-bs-dismiss="dialog"', 'data-bs-close="dialog"', 'data-bs-target="#close"'],
      ok: 'Отлично! data-bs-dismiss значит «закрой, убери». toggle окно открывает, а dismiss закрывает.', hint: 'Для открытия было toggle. А для закрытия? Это слово было и у крестика объявления в уроке 1.', alt: 'Код кнопки «Закрыть» в окне' },
    en: { ctx: 'The “Close” button should close the window.', q: 'What goes in the empty spot?', opts: ['data-bs-toggle="dialog"', 'data-bs-dismiss="dialog"', 'data-bs-close="dialog"', 'data-bs-target="#close"'],
      ok: 'Great! data-bs-dismiss means “close, remove”. toggle opens the window, and dismiss closes it.', hint: 'Opening used toggle. What about closing? That word was also on the alert’s close button in lesson 1.', alt: 'The code of the window’s Close button' } },
  { id: 'bootstrap-09t5', target: 'bootstrap-09', ptype: 'Bootstrap', tag: 'script', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<head>\n  <link href="…/bootstrap.min.css" rel="stylesheet">\n</head>\n<body>\n${b9Menu(T, 'menu').split('\n').filter((l, i) => i !== 5).map((l) => '  ' + l).join('\n')}\n</body>`} mark={[11]} />; },
    uz: { ctx: "Tugma chiroyli, lekin bosilganda menyu ochilmayapti.", q: 'Nima yetishmayapti?', opts: ["menu o'rniga dropdown yozilishi kerak edi", "menyu bandlarining hech biriga menu-item yozilmagan", "body oxirida Bootstrapning script qatori", "tugmaning class-iga btn-solid yozilmagan"],
      ok: "To'ppa-to'g'ri! CSS menyuni chiroyli qiladi, lekin ochib-yopishni script qiladi. Usiz tugma bosilsa ham hech narsa bo'lmaydi.", hint: "1-darsni eslang: saytdan ikkita qator olingan edi. link nima qiladi, ikkinchisi-chi? Kodning oxiriga qarang.", alt: "script qatorisiz menyu kodi" },
    ru: { ctx: 'Кнопка красивая, но по нажатию меню не открывается.', q: 'Чего не хватает?', opts: ['вместо menu нужно было написать dropdown', 'у пунктов меню не написано menu-item', 'строки script Bootstrap в конце body', 'у кнопки в class не написано btn-solid'],
      ok: 'Верно! CSS делает меню красивым, а открывает и закрывает его script. Без него кнопка жмётся, но ничего не происходит.', hint: 'Вспомните урок 1: с сайта брали две строки. Что делает link, а что вторая? Посмотрите на конец кода.', alt: 'Код меню без строки script' },
    en: { ctx: 'The button looks nice, but clicking it doesn’t open the menu.', q: 'What is missing?', opts: ['it should say dropdown instead of menu', 'the menu items don’t have menu-item', 'the script line at the end of body', 'the button’s class doesn’t have btn-solid'],
      ok: 'Right! CSS makes the menu look nice, but script opens and closes it. Without it the button clicks, but nothing happens.', hint: 'Remember lesson 1: two lines were taken from the site. What does link do, and the other one? Look at the end of the code.', alt: 'Menu code without the script line' } }
];
