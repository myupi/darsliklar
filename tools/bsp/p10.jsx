// =============================================================================
// ===== ПРАКТИКА 9 · «Musobaqa sahifasi» · к уроку 10 «Menu и Dialog» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Страница турнира роботов: кнопка «Bo'limlar» открывает меню разделов, кнопка «Yozilish» — окно
// записи (как в уроке 9). При обновлении у меню и окна пропали слова — меню видно всегда простыми ссылками, окно без
// оформления, вкладки погасли. Ученик чинит пять страниц: значение data-bs-toggle у кнопки меню (dialog → menu) → вписать
// menu в пустой class → взять окно с сайта (Components → Dialog), вставить и настроить заголовок и текст → починить имя
// версии 5 (data-bs-toggle="dropdown") и data-bs-target без «#» → своя страница: меню, текст окна, data-bs-target, строка
// script с сайта. Окно страницы — 480 px. Меню и окно в окне страницы работают, как со скриптом Bootstrap, только при
// верной строке script (bp-kit: bpUiClick). 7 слайдов: крючок · пять заданий · вывод. Сценарий —
// docs/scenarij-bootstrap-10p-menu-i-dialog.md. Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-10p-menu-i-dialog',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "10-amaliyot. Musobaqa sahifasi", ru: 'Практика 10. Страница турнира', en: 'Practice 10. The contest page' }
};

const P9 = {
  club: L3("Robotlar musobaqasi", 'Турнир роботов', 'Robot contest'),
  sec: L3("Bo'limlar", 'Разделы', 'Sections'),
  i1: L3("Qoidalar", 'Правила', 'Rules'), i2: L3("Jadval", 'Расписание', 'Schedule'), i3: L3("G'oliblar", 'Победители', 'Winners'),
  join: L3("Yozilish", 'Записаться', 'Sign up'), close: L3("Yopish", 'Закрыть', 'Close'),
  dT: L3("Yozilish", 'Запись', 'Sign-up'),
  dB: L3("Musobaqa 25-noyabr kuni. Jamoangizni kutamiz!", 'Турнир 25 ноября. Ждём вашу команду!', 'The contest is on November 25. We’re waiting for your team!'),
  t1: L3("Menyu", 'Меню', 'Menu'), t2: L3("Bo'limlar", 'Разделы', 'Sections'), t3: L3("Oyna", 'Окно', 'Dialog'), t4: L3("Tuzatish", 'Починка', 'Fix'),
  h3: L3("Musobaqa kuni", 'День турнира', 'Contest day'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'), myH: L3("Mening musobaqam", 'Мой турнир', 'My contest'),
  myD: L3("Xabar", 'Сообщение', 'Message')
};
const P9_PRE = (pk, h) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h4>' + pk(h || P9.club) + '</h4>'];
const P9_POST = ['  ' + BP_SCRIPT, '</body>'];
const p9c = (v) => (v === false ? '' : ' class="' + v + '"');
// Кнопка меню и меню. o: { btn — class кнопки, toggle — data-bs-toggle, menu — class меню, items — [class пункта], texts }
const p9MenuBtn = (pk, o) => { const x = o || {}; return '  <button' + p9c(x.btn != null ? x.btn : 'btn-solid theme-primary') + ' type="button" data-bs-toggle="' + (x.toggle != null ? x.toggle : 'menu') + '">' + pk(P9.sec) + '</button>'; };
const p9Menu = (pk, o) => {
  const x = o || {};
  const texts = x.texts || [P9.i1, P9.i2, P9.i3];
  return ['  <div' + p9c(x.menu != null ? x.menu : 'menu') + '>'].concat(texts.map((t, i) => '    <a' + p9c(x.items ? x.items[i] : 'menu-item') + ' href="#">' + pk(t) + '</a>'), ['  </div>']);
};
// Кнопка окна и окно. o: { btn, toggle, target, dlg — class окна, id, title, body, hdr, bodyCls, foot }
const p9DlgBtn = (pk, o) => { const x = o || {}; return '  <button' + p9c(x.btn != null ? x.btn : 'btn-solid theme-success') + ' type="button" data-bs-toggle="' + (x.toggle != null ? x.toggle : 'dialog') + '" data-bs-target="' + (x.target != null ? x.target : '#yozilish') + '">' + pk(P9.join) + '</button>'; };
const p9Dlg = (pk, o) => {
  const x = o || {};
  return ['  <dialog' + p9c(x.dlg != null ? x.dlg : 'dialog') + ' id="' + (x.id || 'yozilish') + '">',
    '    <div' + p9c(x.hdr != null ? x.hdr : 'dialog-header') + '>',
    '      <h4' + p9c(x.hdr === false ? false : 'dialog-title') + '>' + (x.title != null ? x.title : pk(P9.dT)) + '</h4>',
    '      <button type="button"' + p9c(x.hdr === false ? false : 'btn-close') + ' data-bs-dismiss="dialog" aria-label="Close"></button>',
    '    </div>',
    '    <div' + p9c(x.bodyCls != null ? x.bodyCls : 'dialog-body') + '>',
    '      <p>' + (x.body != null ? x.body : pk(P9.dB)) + '</p>',
    '    </div>'].concat(x.foot === false ? [] : ['    <div' + p9c(x.hdr === false ? false : 'dialog-footer') + '>',
    '      <button type="button"' + p9c(x.hdr === false ? false : 'btn-solid theme-secondary') + ' data-bs-dismiss="dialog">' + pk(P9.close) + '</button>',
    '    </div>'], ['  </dialog>']);
};
// Пример с сайта (Components → Menu, Dialog) — как в уроке 9.
const P9_SITE_DLG = ['<button type="button" class="btn-solid theme-primary" data-bs-toggle="dialog" data-bs-target="#exampleDialog">', '  Open dialog', '</button>', '',
  '<dialog class="dialog" id="exampleDialog">', '  <div class="dialog-header">', '    <h1 class="dialog-title">Dialog title</h1>',
  '    <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>', '  </div>', '  <div class="dialog-body">',
  '    <p>This is a native dialog element. It uses the browser’s built-in modal behavior for accessibility and focus management.</p>', '  </div>', '  <div class="dialog-footer">',
  '    <button type="button" class="btn-solid theme-secondary" data-bs-dismiss="dialog">Close</button>', '    <button type="button" class="btn-solid theme-primary">Save changes</button>', '  </div>', '</dialog>'].join('\n');
const P9_SITE_MENU = ['<button class="btn-solid theme-primary" type="button" data-bs-toggle="menu" aria-expanded="false">', '  Toggle menu', '</button>', '<div class="menu">',
  '  <a class="menu-item" href="#">Menu item 1</a>', '  <a class="menu-item" href="#">Menu item 2</a>', '  <a class="menu-item" href="#">Menu item 3</a>', '</div>'].join('\n');
const P9_DOCS_SITE = { page: L3("Components · Dialog · Menu", 'Components · Dialog · Menu', 'Components · Dialog · Menu'), items: [
  { k: 'dlg', title: 'Dialog · HTML', code: P9_SITE_DLG }, { k: 'menu', title: 'Menu · HTML', code: P9_SITE_MENU }
] };
const P9_DOCS_FIX = { page: L3("Components · Menu · Dialog", 'Components · Menu · Dialog', 'Components · Menu · Dialog'), items: [
  { k: 'm', title: 'Menu', chips: ['data-bs-toggle="menu"', 'menu', 'menu-item'], copy: false },
  { k: 'd', title: 'Dialog', chips: ['data-bs-toggle="dialog"', 'data-bs-target="#…"', 'data-bs-dismiss="dialog"'], copy: false }
] };
const P9_DOCS_OWN = { page: L3("Install · Menu · Dialog", 'Install · Menu · Dialog', 'Install · Menu · Dialog'), items: [
  { k: 'js', title: 'CDN · JS', code: BP_SCRIPT },
  { k: 'm', title: 'Menu', chips: ['data-bs-toggle="menu"', 'menu', 'menu-item'], copy: false },
  { k: 'd', title: 'Dialog', chips: ['data-bs-toggle="dialog"', 'data-bs-target="#xabar"'], copy: false }
] };
const P9_SAMPLES = ['Dialog title', 'This is a native dialog', 'Menu item'];
const p9Sample = (el) => !!el && P9_SAMPLES.some((t) => el.textContent.indexOf(t) >= 0);
// Проверки страницы (по коду, не по нажатию): кнопка меню ведёт к соседнему .menu с пунктами, кнопка окна — к <dialog id>.
const p9MenuOk = (D) => D.qa('[data-bs-toggle="menu"]').some((b) => { let m = b.nextElementSibling; while (m && !(m.classList && m.classList.contains('menu'))) m = m.nextElementSibling; return !!m && m.querySelectorAll('.menu-item').length >= 2; });
const p9DlgOk = (D) => D.qa('[data-bs-toggle="dialog"]').some((b) => { const t = b.getAttribute('data-bs-target') || ''; const d = /^#[\w-]+$/.test(t) ? D.q(t) : null; return !!d && d.tagName === 'DIALOG'; });

const PR = {
  next: L3("Yakuniy loyiha", 'Финальный проект', 'Final project'),
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P9.t1, file: 'menyu.html' },
    { ico: 'book', c: '#0FA38E', name: P9.t2, file: 'bolimlar.html' },
    { ico: 'mail', c: '#7C5CFA', name: P9.t3, file: 'oyna.html' },
    { ico: 'leaf', c: '#F59E0B', name: P9.t4, file: 'tuzatish.html' },
    { ico: 'heart', c: '#E44D8A', name: P9.mine, file: 'my.html' }
  ],
  // Крючок: меню и окно работают; после «Yangilash» слов нет — меню видно ссылками, окно без оформления.
  hook: {
    vw: 480,
    doc: (pk, on) => P9_PRE(pk).concat(on ? [p9MenuBtn(pk)] : [p9MenuBtn(pk, { btn: false })], p9Menu(pk, on ? {} : { menu: false, items: [false, false, false] }),
      [p9DlgBtn(pk, on ? {} : { btn: false })], p9Dlg(pk, on ? {} : { dlg: false, hdr: false, bodyCls: false }), P9_POST).join('\n')
  },
  ownVw: 480,
  ownDefault: (pk) => P9_PRE(pk, P9.myH).concat([p9MenuBtn(pk)], p9Menu(pk), [p9DlgBtn(pk, { target: '#xabar' })], p9Dlg(pk, { id: 'xabar', title: pk(P9.myD), foot: false }), P9_POST).join('\n'),
  tasks: [
    // Т1 · значение data-bs-toggle у кнопки меню: она звала окно (dialog → menu).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 480, pre: P9_PRE(pk), post: [p9DlgBtn(pk)].concat(p9Dlg(pk), P9_POST),
      code0: [p9MenuBtn(pk, { toggle: 'dialog' })].concat(p9Menu(pk)).join('\n'), answer: [p9MenuBtn(pk)].concat(p9Menu(pk)).join('\n'),
      goal: (D) => (p9MenuOk(D) ? null : C.t1.no),
      sample: ['<button … data-bs-toggle="menu">'],
      drill: { pre: P9_PRE(pk).concat([p9MenuBtn(pk)], p9Menu(pk)), post: p9Dlg(pk).concat(P9_POST),
        code0: p9DlgBtn(pk, { toggle: 'menu' }), answer: p9DlgBtn(pk),
        goal: (D) => (p9DlgOk(D) ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class у списка разделов: menu (без него ссылки видны всегда).
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 480, pre: P9_PRE(pk).concat([p9MenuBtn(pk)]), post: [p9DlgBtn(pk)].concat(p9Dlg(pk), P9_POST),
      code0: p9Menu(pk, { menu: '' }).join('\n'), answer: p9Menu(pk).join('\n'),
      goal: (D) => {
        if (p9MenuOk(D)) return null;
        if (D.q('div.menu-item')) return C.t2.item;
        return C.t2.no;
      },
      sample: ['<div class="menu">', '  <a class="menu-item" href="#">…</a>'],
      drill: { code0: p9Menu(pk, { items: ['menu-item', '', 'menu-item'] }).join('\n'), answer: p9Menu(pk).join('\n'),
        goal: (D) => (D.qa('.menu > .menu-item').length === 3 ? null : C.t2.drillNo) }
    }),
    // Т3 · окно с сайта (Components → Dialog): скопировать, вставить, свой заголовок и текст.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 480, pre: P9_PRE(pk, P9.h3), post: P9_POST, docs: () => P9_DOCS_SITE,
      code0: '', answer: P9_SITE_DLG.split('\n').map((l) => '  ' + l).join('\n').replace('Dialog title', pk(P9.dT)).replace(/This is a native dialog[^<]*/, pk(P9.dB)),
      goal: (D) => {
        const dlg = D.q('dialog.dialog');
        if (!dlg) return C.t3.noDlg;
        if (!p9DlgOk(D)) return C.t3.tgt;
        const t = dlg.querySelector('.dialog-title'), b = dlg.querySelector('.dialog-body');
        if (p9Sample(t) || p9Sample(b)) return C.t3.sample;
        return t && t.textContent.trim().length > 1 && b && b.textContent.trim().length > 3 ? null : C.t3.noText;
      },
      sample: ['<dialog class="dialog" id="exampleDialog">', '  <h1 class="dialog-title">…</h1>', '  <div class="dialog-body"><p>…</p></div>'],
      drill: { code0: '', answer: P9_SITE_MENU.split('\n').map((l) => '  ' + l).join('\n').replace('Menu item 1', pk(P9.i1)).replace('Menu item 2', pk(P9.i2)).replace('Menu item 3', pk(P9.i3)),
        goal: (D) => (p9MenuOk(D) && !p9Sample(D.q('.menu')) ? null : C.t3.drillNo) }
    }),
    // Т4 · имя версии 5 и пропущенная решётка: data-bs-toggle="dropdown" → "menu", data-bs-target="yozilish" → "#yozilish".
    (pk) => bpTask(4, {
      kind: 'fix', vw: 480, pre: P9_PRE(pk), post: P9_POST, docs: () => P9_DOCS_FIX,
      code0: [p9MenuBtn(pk, { toggle: 'dropdown' })].concat(p9Menu(pk), [p9DlgBtn(pk, { target: 'yozilish' })], p9Dlg(pk)).join('\n'),
      answer: [p9MenuBtn(pk)].concat(p9Menu(pk), [p9DlgBtn(pk)], p9Dlg(pk)).join('\n'),
      goal: (D) => {
        if (!p9MenuOk(D)) return C.t4.menu;
        return p9DlgOk(D) ? null : C.t4.tgt;
      },
      sample: ['<button … data-bs-toggle="menu">', '<button … data-bs-target="#yozilish">'],
      drill: { code0: [p9MenuBtn(pk)].concat(p9Menu(pk, { items: ['dropdown-item', 'dropdown-item', 'dropdown-item'] })).join('\n'), answer: [p9MenuBtn(pk)].concat(p9Menu(pk)).join('\n'),
        pre: P9_PRE(pk), post: P9_POST,
        goal: (D) => (D.qa('.menu > .menu-item').length === 3 ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: меню (data-bs-toggle и menu), свой текст окна, data-bs-target кнопки окна, строка script с сайта.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 480, pre: P9_PRE(pk, P9.myH), post: ['</body>'], docs: () => P9_DOCS_OWN,
      code0: [p9MenuBtn(pk, { toggle: '' })].concat(p9Menu(pk, { menu: '', texts: [P9.i1, P9.i2] }), [p9DlgBtn(pk, { target: '' })], p9Dlg(pk, { id: 'xabar', title: pk(P9.myD), body: '', foot: false }), ['  ']).join('\n'),
      answer: [p9MenuBtn(pk)].concat(p9Menu(pk, { texts: [P9.i1, P9.i2] }), [p9DlgBtn(pk, { target: '#xabar' })], p9Dlg(pk, { id: 'xabar', title: pk(P9.myD), body: pk(P9.dB), foot: false }), ['  ' + BP_SCRIPT]).join('\n'),
      list: [
        { t: L3("menyu: menu va data-bs-toggle", 'меню: menu и data-bs-toggle', 'menu: menu and data-bs-toggle'), ok: (D) => p9MenuOk(D) },
        { t: L3("oynada o'z matningiz", 'свой текст в окне', 'your own text in the dialog'), ok: (D) => { const b = D.q('dialog .dialog-body'); return !!b && b.textContent.trim().length > 3; } },
        { t: L3("tugma: data-bs-target", 'кнопка: data-bs-target', 'button: data-bs-target'), ok: (D) => p9DlgOk(D) },
        { t: L3("script: body oxirida", 'script: в конце body', 'script: end of body'), ok: (D) => D.script.ok && D.script.atEnd }
      ],
      goal: (D) => {
        if (!D.q('[data-bs-toggle="menu"]')) return C.t5.toggle;
        if (!p9MenuOk(D)) return C.t5.menu;
        const b = D.q('dialog .dialog-body');
        if (!b || b.textContent.trim().length <= 3) return C.t5.text;
        if (!p9DlgOk(D)) return C.t5.tgt;
        if (!D.script.tag) return FB.noScript;
        if (!D.script.atEnd) return FB.scriptPlace;
        return null;
      },
      sample: ['<button … data-bs-toggle="menu">…</button>', '<div class="menu">…</div>', '<button … data-bs-target="#xabar">…</button>', '<div class="dialog-body"><p>…</p></div>', BP_SCRIPT],
      onSolved: (st) => store.set('myDoc', P9_PRE(pk, P9.myH).concat([st.code.replace(/\s+$/, '')], ['</body>']).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Musobaqa sahifasi", 'Страница турнира', 'The contest page'),
    say: L3("Salom! Bu robotlar musobaqasining sahifasi. Bo'limlar tugmasini bosing: menyu ochiladi. Yozilish tugmasini bosing: sahifa ustida oyna chiqadi. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это страница турнира роботов. Нажми «Разделы»: откроется меню. Нажми «Записаться»: поверх страницы появится окно. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is the robot contest page. Tap “Sections”: a menu opens. Tap “Sign up”: a dialog appears over the page. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda menyu va oynaning so'zlari o'chib ketdi. Bo'limlar oddiy havolalar bo'lib, doim ko'rinib qoldi, oyna esa bezaksiz. Varaqlar ham o'chdi.",
      'Ой! При обновлении стёрлись слова меню и окна. Разделы стали простыми ссылками и видны всегда, а окно без оформления. Вкладки погасли.',
      'Oh no! The update erased the menu and dialog words. The sections turned into plain links that are always visible, and the dialog has no styling. The tabs went dark.'),
    done: L3("Kodga qarang: teglar joyida, lekin so'zlar yo'q. Darsdagi topishmoq esingizdami? Oyna uchun alohida sahifa kerak emas: hammasi shu sahifada, tugma bosilguncha yashirin turadi. Beshta sahifani birma-bir tuzatamiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: теги на месте, а слов нет. Помнишь загадку урока? Для окна не нужна отдельная страница: всё на этой же странице и спрятано до нажатия. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the tags are in place, but the words are gone. Remember the lesson’s riddle? A dialog doesn’t need its own page: everything is on this page, hidden until you tap. Let’s fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifada menyu va oynani tiklaymiz", 'Восстановим меню и окно на пяти страницах', 'Let’s restore the menu and dialog on five pages')
  },
  t1: {
    eyebrow: L3("Menyu", 'Меню', 'Menu'),
    say: L3("Birinchi sahifa: menyu. Bo'limlar tugmasini bosib ko'ring: hech narsa ochilmaydi! Men tugmaga oyna so'zini yozib qo'yibman, lekin bu yerda oyna yo'q, menyu bor. So'zni almashtiring.",
      'Первая страница: меню. Нажми «Разделы»: ничего не открывается! Я написал кнопке слово окна, а здесь не окно, а меню. Замени слово.',
      'The first page is the menu. Tap “Sections”: nothing opens! I gave the button the dialog word, but there’s a menu here, not a dialog. Change the word.'),
    ask: L3("Tugma menyuni ochsin", 'Пусть кнопка открывает меню', 'Make the button open the menu'),
    ok: L3("Zo'r! Tugma endi menyuni ochadi. Bosib ko'ring!", 'Здорово! Теперь кнопка открывает меню. Нажми!', 'Great! Now the button opens the menu. Give it a tap!'),
    hints: [
      L3("Bo'limlar tugmasining data-bs-toggle qiymatiga qarang. U nima ochilishini aytadi.", 'Посмотри на data-bs-toggle у кнопки «Разделы». Он говорит, что открыть.', 'Look at data-bs-toggle on the Sections button. It says what to open.'),
      L3("dialog oyna uchun. Menyu uchun menu deb yozing.", 'dialog — для окна. Для меню напиши menu.', 'dialog is for a dialog. For a menu, write menu.'),
      L3("Namuna kod ostida. Xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши так же и нажми «Проверить».', 'The example is under the code. Write it the same way and tap Check.')
    ],
    no: L3("Tugma hali menyuni ochmaydi. Uning data-bs-toggle qiymati menu bo'lsin.", 'Кнопка пока не открывает меню. Пусть её data-bs-toggle будет menu.', 'The button doesn’t open the menu yet. Make its data-bs-toggle menu.'),
    drill: L3("endi Yozilish tugmasini tuzating", 'теперь почини кнопку «Записаться»', 'now fix the Sign up button'),
    drillNo: L3("Yozilish tugmasi oyna ochishi kerak: uning data-bs-toggle qiymati dialog bo'lsin.", 'Кнопка «Записаться» должна открывать окно: пусть её data-bs-toggle будет dialog.', 'The Sign up button should open a dialog: make its data-bs-toggle dialog.')
  },
  t2: {
    eyebrow: L3("Bo'limlar", 'Разделы', 'Sections'),
    say: L3("Ikkinchi sahifa: bo'limlar. Havolalar doim ko'rinib turibdi, tugma esa ishlamaydi. Ularni o'rab turgan qutining class qiymati bo'sh. Darsda havolalarni yashirib, tugma bosilganda ko'rsatgan so'z qaysi edi?",
      'Вторая страница: разделы. Ссылки видны всегда, а кнопка не работает. У коробки, которая их обнимает, пустой class. Какое слово на уроке прятало ссылки и показывало их по нажатию?',
      'The second page is the sections. The links are always visible, and the button doesn’t work. The box around them has an empty class. Which word in the lesson hid the links and showed them on a tap?'),
    ask: L3("Havolalar menyuga aylansin", 'Пусть ссылки станут меню', 'Turn the links into a menu'),
    ok: L3("Ajoyib! Havolalar yashirindi, tugma bosilganda menyu ochiladi!", 'Отлично! Ссылки спрятались, а по нажатию открывается меню!', 'Great! The links are hidden, and the menu opens on a tap!'),
    hints: [
      L3("Havolalarni o'rab turgan div tegiga qarang: unda so'z yo'q.", 'Посмотри на div, который обнимает ссылки: в нём нет слова.', 'Look at the div around the links: it has no word.'),
      L3("Bu quti menyuning o'zi. Unga menu so'zini yozing.", 'Эта коробка и есть меню. Напиши ей слово menu.', 'That box is the menu itself. Write the word menu on it.'),
      L3("Namuna kod ostida. Xuddi shunday so'zni yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такое же слово и нажми «Проверить».', 'The example is under the code. Write the same word and tap Check.')
    ],
    no: L3("Havolalar hali menyu emas. Ularni o'rab turgan qutiga menu kerak.", 'Ссылки ещё не меню. Коробке вокруг них нужно menu.', 'The links aren’t a menu yet. The box around them needs menu.'),
    item: L3("menu-item bitta havola uchun. Ularni o'rab turgan quti esa menu.", 'menu-item — это один пункт. А коробка вокруг пунктов — menu.', 'menu-item is one item. The box around the items is menu.'),
    drill: L3("endi ikkinchi havolani tuzating", 'теперь почини второй пункт', 'now fix the second item'),
    drillNo: L3("Ikkinchi havolaning class qiymati bo'sh. Har bir havolaga menu-item kerak.", 'У второго пункта пустой class. Каждому пункту нужно menu-item.', 'The second item’s class is empty. Every item needs menu-item.')
  },
  t3: {
    eyebrow: L3("Oyna", 'Окно', 'Dialog'),
    say: L3("Uchinchi sahifa: musobaqa kuni. Bu yerda oyna umuman yo'q. Bootstrap saytidagi Dialog namunasini nusxalang va qo'ying. Keyin moslang: Dialog title o'rniga o'z sarlavhangizni, inglizcha matn o'rniga musobaqa haqida o'z matningizni yozing.",
      'Третья страница: день турнира. Здесь окна совсем нет. Скопируй пример Dialog с сайта Bootstrap и вставь. Потом подгони: вместо Dialog title — свой заголовок, вместо английского текста — свой текст о турнире.',
      'The third page is the contest day. There’s no dialog here at all. Copy the Dialog example from the Bootstrap site and paste it. Then adapt it: your own heading instead of Dialog title, and your own text about the contest instead of the English one.'),
    ask: L3("Saytdan oyna oling va moslang", 'Возьми окно с сайта и подгони', 'Take a dialog from the site and adapt it'),
    ok: L3("Qoyil! Saytdagi oyna endi sizning matningiz bilan ochiladi!", 'Вот это да! Окно с сайта теперь открывается с твоим текстом!', 'Wow! The site’s dialog now opens with your text!'),
    hints: [
      L3("Saytdagi Dialog kodi yonida nusxalash belgisi bor. Uni bosing, keyin Qo'yish tugmasini.", 'Рядом с кодом Dialog на сайте есть значок копирования. Нажми его, потом «Вставить».', 'Next to the Dialog code on the site there’s a copy icon. Tap it, then Paste.'),
      L3("Qo'yilgan kodda dialog-title ichida Dialog title, dialog-body ichida inglizcha matn bor. Ikkalasini o'zingizniki bilan almashtiring.", 'Во вставленном коде в dialog-title стоит Dialog title, а в dialog-body — английский текст. Замени оба на свои.', 'In the pasted code, dialog-title says Dialog title and dialog-body has English text. Replace both with your own.'),
      L3("Namuna kod ostida. Xuddi shunday o'z matningizni yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши свой текст и нажми «Проверить».', 'The example is under the code. Write your own text the same way and tap Check.')
    ],
    noDlg: L3("Sahifada oyna hali yo'q. Saytdan Dialog namunasini nusxalang va qo'ying.", 'На странице пока нет окна. Скопируй пример Dialog с сайта и вставь.', 'There’s no dialog on the page yet. Copy the Dialog example from the site and paste it.'),
    tgt: L3("Tugma oynani topmayapti. data-bs-target da panjara va oyna id si turishi kerak.", 'Кнопка не находит окно. В data-bs-target должны стоять решётка и id окна.', 'The button can’t find the dialog. data-bs-target needs a hash and the dialog’s id.'),
    sample: L3("Oynada hali saytdagi inglizcha matn turibdi. Sarlavha va matnni o'zingizniki bilan almashtiring.", 'В окне ещё английский текст с сайта. Замени заголовок и текст на свои.', 'The dialog still has the site’s English text. Replace the heading and text with your own.'),
    noText: L3("Oynaning sarlavhasi yoki matni bo'sh. Ikkalasini yozing.", 'У окна пустой заголовок или текст. Напиши оба.', 'The dialog’s heading or text is empty. Write both.'),
    drill: L3("endi saytdan menyu oling va bo'limlarni yozing", 'теперь возьми с сайта меню и напиши разделы', 'now take a menu from the site and write the sections'),
    drillNo: L3("Menu namunasini nusxalang, qo'ying va Menu item o'rniga bo'limlar nomini yozing.", 'Скопируй пример Menu, вставь и напиши вместо Menu item названия разделов.', 'Copy the Menu example, paste it and write section names instead of Menu item.')
  },
  t4: {
    eyebrow: L3("Tuzatish", 'Починка', 'Fix'),
    say: L3("To'rtinchi sahifani eski darslikdan ko'chiribman: menyu ham, oyna ham ochilmaydi. Kodda ikkita xato bor: bittasi beshinchi versiyaning nomi, ikkinchisi tushib qolgan belgi. Topib, tuzating.",
      'Четвёртую страницу я списал из старого учебника: не открывается ни меню, ни окно. В коде две ошибки: одна — имя пятой версии, другая — пропущенный знак. Найди и почини.',
      'I copied the fourth page from an old tutorial: neither the menu nor the dialog opens. There are two mistakes in the code: one is a version 5 name, the other is a missing symbol. Find and fix them.'),
    ask: L3("Menyu va oyna ochilsin", 'Пусть открываются меню и окно', 'Make the menu and dialog open'),
    ok: L3("Zo'r ish! Menyu ham, oyna ham ochilyapti!", 'Отличная работа! Открываются и меню, и окно!', 'Nice work! Both the menu and the dialog open!'),
    hints: [
      L3("Ikkala tugmaga qarang: data-bs-toggle va data-bs-target qiymatlariga.", 'Посмотри на обе кнопки: на значения data-bs-toggle и data-bs-target.', 'Look at both buttons: at the data-bs-toggle and data-bs-target values.'),
      L3("dropdown eski nom, oltinchi versiyada menu. Oyna tugmasida esa id oldiga panjara qo'ying.", 'dropdown — старое имя, в шестой версии — menu. А кнопке окна поставь решётку перед id.', 'dropdown is an old name; in version 6 it’s menu. And put a hash before the id on the dialog button.'),
      L3("Namuna kod ostida. Xuddi shunday ikkala xatoni tuzating va Tekshirishni bosing.", 'Образец под кодом. Так же исправь обе ошибки и нажми «Проверить».', 'The example is under the code. Fix both mistakes the same way and tap Check.')
    ],
    menu: L3("Menyu hali ochilmaydi. Bootstrap 6 da menyu tugmasiga data-bs-toggle qiymati menu.", 'Меню пока не открывается. В Bootstrap 6 у кнопки меню data-bs-toggle — menu.', 'The menu doesn’t open yet. In Bootstrap 6 the menu button’s data-bs-toggle is menu.'),
    tgt: L3("Oyna hali ochilmaydi. data-bs-target da panjara va oyna id si turishi kerak.", 'Окно пока не открывается. В data-bs-target должны стоять решётка и id окна.', 'The dialog doesn’t open yet. data-bs-target needs a hash and the dialog’s id.'),
    drill: L3("endi havolalarning eski so'zini tuzating", 'теперь почини старое слово у пунктов', 'now fix the items’ old word'),
    drillNo: L3("dropdown-item eski nom. Har bir havolaga menu-item yozing.", 'dropdown-item — старое имя. Напиши каждому пункту menu-item.', 'dropdown-item is an old name. Write menu-item on each item.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki: o'z musobaqangiz sahifasi! Unda menyu va oyna bor, lekin yig'ilmagan: menyu tugmasi va qutisida so'z yo'q, oynada matn yo'q, oyna tugmasi oynani bilmaydi, script qatori ham yo'q. Ro'yxatdagi to'rtta shartni bajaring.",
      'Пятая страница твоя: страница твоего турнира! В ней есть меню и окно, но они не собраны: у кнопки и коробки меню нет слов, в окне нет текста, кнопка окна не знает окно, и строки script нет. Выполни четыре условия из списка.',
      'The fifth page is yours: your own contest page! It has a menu and a dialog, but they aren’t put together: the menu button and box have no words, the dialog has no text, the dialog button doesn’t know the dialog, and there’s no script line. Meet the four conditions on the list.'),
    ask: L3("O'z sahifangizni yig'ing", 'Собери свою страницу', 'Build your own page'),
    ok: L3("Vau, menyu ham, oyna ham sizniki! Endi istalgan saytga ularni qo'sha olasiz!", 'Вау, и меню, и окно твои! Теперь ты добавишь их на любой сайт!', 'Wow, the menu and the dialog are yours! Now you can add them to any site!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Oldin menyu tugmasiga data-bs-toggle qiymatini, qutisiga menu so'zini yozing.", 'Посмотри на список: четыре условия. Сначала напиши кнопке меню значение data-bs-toggle, а коробке — слово menu.', 'Look at the list: four conditions. First give the menu button its data-bs-toggle value and the box the word menu.'),
      L3("Keyin oyna ichidagi bo'sh p tegiga o'z matningizni yozing, tugmaga data-bs-target: panjara va xabar. Oxirida saytdan script qatorini nusxalab, bo'sh qatorga qo'ying.", 'Потом напиши свой текст в пустом теге p в окне, кнопке — data-bs-target: решётка и xabar. В конце скопируй с сайта строку script и вставь в пустую строку.', 'Then write your own text in the empty p tag in the dialog, and give the button data-bs-target: a hash and xabar. Finally, copy the script line from the site and paste it into the empty line.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda o'z sahifangizni yig'ing va Tekshirishni bosing.", 'Образец под кодом. Собери свою страницу в таком же порядке и нажми «Проверить».', 'The example is under the code. Build your page in the same order and tap Check.')
    ],
    toggle: L3("Menyu tugmasiga data-bs-toggle qiymati kerak: menu.", 'Кнопке меню нужно значение data-bs-toggle: menu.', 'The menu button needs a data-bs-toggle value: menu.'),
    menu: L3("Havolalarni o'rab turgan qutiga menu so'zi kerak.", 'Коробке вокруг ссылок нужно слово menu.', 'The box around the links needs the word menu.'),
    text: L3("Oynada matn yo'q. dialog-body ichidagi p tegiga o'z matningizni yozing.", 'В окне нет текста. Напиши свой текст в тег p внутри dialog-body.', 'The dialog has no text. Write your own text in the p tag inside dialog-body.'),
    tgt: L3("Tugma oynani topmayapti. data-bs-target ga panjara va xabar deb yozing.", 'Кнопка не находит окно. Напиши в data-bs-target решётку и xabar.', 'The button can’t find the dialog. Write a hash and xabar in data-bs-target.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma menyu va oynalar yana ochilyapti! Qarang, bu sizning sahifangiz.", 'Все меню и окна снова открываются! Смотри, это твоя страница.', 'All the menus and dialogs open again! Look, this is your page.') },
      { k: 'a', text: L3("Menyu tugmasiga data-bs-toggle qiymati menu, yonidagi qutiga menu, havolalarga menu-item.", 'Кнопке меню — data-bs-toggle со значением menu, коробке рядом — menu, ссылкам — menu-item.', 'The menu button gets data-bs-toggle menu, the box next to it gets menu, and the links get menu-item.') },
      { k: 'b', text: L3("Oyna, ya'ni dialog tegi degani, sahifaning o'zida yashirin turadi.", 'Окно, то есть тег dialog, спрятано на этой же странице.', 'The dialog, that is, the dialog tag, sits hidden on the same page.') },
      { k: 'c', text: L3("Oynani tugma ochadi: data-bs-toggle qiymati dialog, data-bs-target da esa panjara va oyna id si.", 'Окно открывает кнопка: data-bs-toggle со значением dialog, а в data-bs-target — решётка и id окна.', 'A button opens the dialog: data-bs-toggle dialog, and data-bs-target holds a hash and the dialog’s id.') },
      { k: 'd', text: L3("Ularni script qatori ishlatadi. dropdown va modal esa eski nomlar.", 'Оживляет их строка script. А dropdown и modal — старые имена.', 'The script line brings them to life. And dropdown and modal are old names.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda yakuniy loyiha: butun Bootstrapni bitta saytda takrorlaymiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке финальный проект: повторим весь Bootstrap на одном сайте. До встречи!', 'Congratulations! Next lesson is the final project: we’ll review all of Bootstrap on one site. See you!') }
    ],
    roles: {
      a: L3("menu · menu-item", 'menu · menu-item', 'menu · menu-item'),
      b: L3("dialog: yashirin oyna", 'dialog: спрятанное окно', 'dialog: a hidden window'),
      c: L3("data-bs-target: #id", 'data-bs-target: #id', 'data-bs-target: #id'),
      d: L3("script, eski nomlar yo'q", 'script, без старых имён', 'script, no old names')
    },
    ask: L3("Menyu va oynani ochib ko'ring", 'Открой меню и окно', 'Open the menu and the dialog')
  }
};
