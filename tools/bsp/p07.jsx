// =============================================================================
// ===== ПРАКТИКА 7 · «Sayt menyusi» · к уроку 7 «Navbar и Pagination» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (23.11.2026). Сайт новостей кружка роботов: тёмный Navbar сверху (название, ссылки разделов; на телефоне ☰ и ящик)
// и номера страниц новостей внизу. При обновлении у Navbar и номеров пропали слова. Ученик чинит пять страниц: значение
// data-bs-theme (light → dark) → вписать nav-link в пустой class третьей ссылки → взять Navbar с сайта (Components → Navbar),
// вставить и настроить название и ссылки → починить имя версии 5 (navbar-expand-lg) и data-bs-target без «#» → своя страница:
// Navbar, номера страниц с active, строка script с сайта. Окно страницы — 800 px (ссылки в ряд: md:navbar-expand — от 768 px
// ширины самого Navbar). Ящик ☰ работает, как со скриптом Bootstrap, только при верной строке script (bp-kit: bpUiClick).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-07p-navbar-i-pagination.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-07p-navbar-i-pagination',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "7-amaliyot. Sayt menyusi", ru: 'Практика 7. Навигация сайта', en: 'Practice 7. Site navigation' }
};

const P7 = {
  club: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
  l1: L3("Asosiy", 'Главная', 'Home'), l2: L3("Kurslar", 'Курсы', 'Courses'), l3: L3("Yangiliklar", 'Новости', 'News'), l4: L3("Aloqa", 'Контакты', 'Contacts'),
  menu: L3("Menyu", 'Меню', 'Menu'), prev: L3("Oldingi", 'Назад', 'Previous'), next: L3("Keyingi", 'Вперёд', 'Next'),
  news: L3("Yangi guruhga yozilish boshlandi!", 'Открыта запись в новую группу!', 'Sign-up for a new group is open!'),
  t1: L3("Rang", 'Цвет', 'Color'), t2: L3("Havolalar", 'Ссылки', 'Links'), t3: L3("Navbar", 'Navbar', 'Navbar'), t4: L3("Tuzatish", 'Починка', 'Fix'),
  mine: L3("Mening saytim", 'Мой сайт', 'My site'), myH: L3("Mening saytim", 'Мой сайт', 'My site')
};
const P7_PRE = ['<head>', '  ' + BP_LINK, '</head>', '<body>'];
const P7_NEWS = (pk) => ['  <p>' + pk(P7.news) + '</p>'];
const P7_POST = ['  ' + BP_SCRIPT, '</body>'];
const p7c = (v) => (v === false ? '' : ' class="' + v + '"');
// Navbar. o: { nav — class у nav, theme — data-bs-theme (false — без), brand — class названия, brandText, target — data-bs-target у ☰,
// links — [class ссылок], texts — подписи, extra — пункт Menu и форма поиска (пример сайта), id — id ящика }
const p7Nav = (pk, o) => {
  const x = o || {};
  const texts = x.texts || [P7.l1, P7.l2, P7.l3, P7.l4].map((t) => pk(t));
  const links = x.links || texts.map((t, i) => (i ? 'nav-link' : 'nav-link active'));
  const id = x.id || 'menyu';
  return ['  <nav' + p7c(x.nav != null ? x.nav : 'navbar md:navbar-expand bg-1') + (x.theme === false ? '' : ' data-bs-theme="' + (x.theme != null ? x.theme : 'dark') + '"') + '>',
    '    <div class="container-fluid">',
    '      <a' + p7c(x.brand != null ? x.brand : 'navbar-brand') + ' href="#">' + (x.brandText != null ? x.brandText : pk(P7.club)) + '</a>',
    '      <button class="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer" data-bs-target="' + (x.target != null ? x.target : '#' + id) + '" aria-label="Menu">',
    '        <span class="navbar-toggler-icon" aria-hidden="true"></span>',
    '      </button>',
    '      <dialog class="drawer drawer-end" id="' + id + '">',
    '        <div class="drawer-header">',
    '          <h5 class="drawer-title">' + pk(P7.menu) + '</h5>',
    '          <button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>',
    '        </div>',
    '        <div class="drawer-body">',
    '          <ul class="nav navbar-nav">']
    .concat(texts.map((t, i) => '            <li class="nav-item"><a' + p7c(links[i]) + ' href="#">' + t + '</a></li>'),
      x.extra ? ['            <li class="nav-item"><button class="nav-link" type="button" data-bs-toggle="menu">Menu</button><div class="menu"><a class="menu-item" href="#">Action</a></div></li>'] : [],
      ['          </ul>'], x.extra ? ['          <form class="hstack gap-2" role="search"><input class="form-control" type="search" placeholder="Search"></form>'] : [],
      ['        </div>', '      </dialog>', '    </div>', '  </nav>']);
};
// Номера страниц. o: { ul, li — [class пунктов], a — [class ссылок], act — номер активного (1…3), texts — [Oldingi, Keyingi] }
const p7Pag = (pk, o) => {
  const x = o || {};
  const labels = [x.prevText || pk(P7.prev), '1', '2', '3', x.nextText || pk(P7.next)];
  return ['  <ul' + p7c(x.ul != null ? x.ul : 'pagination justify-content-center') + '>']
    .concat(labels.map((t, i) => '    <li' + p7c(x.li ? x.li[i] : (i === (x.act || 1) ? 'page-item active' : 'page-item')) + '><a' + p7c(x.a ? x.a[i] : 'page-link') + ' href="#">' + t + '</a></li>'), ['  </ul>']);
};
// Пример с сайта (Components → Navbar, Pagination) — как в уроке 7.
const P7_SITE_NAV = p7Nav((x) => x.en, { theme: false, brandText: 'Navbar', texts: ['Home', 'Link', 'Disabled'], links: ['nav-link active', 'nav-link', 'nav-link disabled'], extra: true, id: 'navbarDrawer' })
  .map((l) => l.slice(2)).join('\n').replace('aria-label="Menu"', 'aria-label="Toggle navigation"').replace('<h5 class="drawer-title">Menu</h5>', '<h5 class="drawer-title">Menu</h5>');
const P7_SITE_PAG = ['<nav aria-label="Page navigation example">', '  <ul class="pagination">', '    <li class="page-item"><a class="page-link" href="#">Previous</a></li>', '    <li class="page-item"><a class="page-link" href="#">1</a></li>',
  '    <li class="page-item"><a class="page-link" href="#">2</a></li>', '    <li class="page-item"><a class="page-link" href="#">3</a></li>', '    <li class="page-item"><a class="page-link" href="#">Next</a></li>', '  </ul>', '</nav>'].join('\n');
const P7_DOCS_SITE = { page: L3("Components · Navbar · Pagination", 'Components · Navbar · Pagination', 'Components · Navbar · Pagination'), items: [
  { k: 'nav', title: 'Navbar · HTML', code: P7_SITE_NAV }, { k: 'pag', title: 'Pagination · HTML', code: P7_SITE_PAG }
] };
const P7_DOCS_FIX = { page: L3("Components · Navbar", 'Components · Navbar', 'Components · Navbar'), items: [
  { k: 'n', title: 'Navbar', chips: ['navbar md:navbar-expand', 'data-bs-toggle="drawer"', 'data-bs-target="#…"'], copy: false },
  { k: 'p', title: 'Pagination', chips: ['pagination', 'page-item', 'page-link'], copy: false }
] };
const P7_DOCS_OWN = { page: L3("Install · Navbar · Pagination", 'Install · Navbar · Pagination', 'Install · Navbar · Pagination'), items: [
  { k: 'js', title: 'CDN · JS', code: BP_SCRIPT },
  { k: 'n', title: 'Navbar', chips: ['data-bs-theme="dark"', 'navbar-brand', 'nav-link'], copy: false },
  { k: 'p', title: 'Pagination', chips: ['page-item active', 'page-link'], copy: false }
] };
// Слова примера сайта, которые ученик меняет на свои (Home, Previous, Next не берём: в английской версии это и есть свои слова).
const P7_SAMPLES = ['Navbar', 'Link', 'Disabled'];
const p7Sample = (el) => !!el && P7_SAMPLES.some((t) => el.textContent.trim() === t);
// Проверки страницы (по коду): ☰ ведёт к ящику <dialog id>; Navbar раскрывается от md; номера — pagination и page-link.
const p7TogOk = (D) => D.qa('[data-bs-toggle="drawer"]').some((b) => { const t = b.getAttribute('data-bs-target') || ''; const d = /^#[\w-]+$/.test(t) ? D.q(t) : null; return !!d && d.tagName === 'DIALOG'; });
const p7Dark = (D) => { const n = D.q('nav.navbar'); return !!n && n.getAttribute('data-bs-theme') === 'dark'; };
const p7Expand = (D) => D.has(D.q('nav.navbar'), 'md:navbar-expand');
const p7Pager = (D) => !!D.q('ul.pagination') && D.qa('ul.pagination > li.page-item > a.page-link').length >= 3;

const PR = {
  next: L3("Formalar", 'Формы', 'Forms'),
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P7.t1, file: 'rang.html' },
    { ico: 'book', c: '#0FA38E', name: P7.t2, file: 'havolalar.html' },
    { ico: 'mail', c: '#7C5CFA', name: P7.t3, file: 'navbar.html' },
    { ico: 'leaf', c: '#F59E0B', name: P7.t4, file: 'tuzatish.html' },
    { ico: 'heart', c: '#E44D8A', name: P7.mine, file: 'my.html' }
  ],
  // Крючок: тёмный Navbar и номера страниц; после «Yangilash» слов нет — ссылки и номера простыми списками.
  hook: {
    vw: 800,
    doc: (pk, on) => P7_PRE.concat(on ? p7Nav(pk) : p7Nav(pk, { nav: false, theme: false, brand: false, links: [false, false, false, false] }), P7_NEWS(pk),
      on ? p7Pag(pk) : p7Pag(pk, { ul: false, li: [false, false, false, false, false], a: [false, false, false, false, false] }), P7_POST).join('\n')
  },
  ownVw: 800,
  ownDefault: (pk) => P7_PRE.concat(p7Nav(pk, { brandText: pk(P7.myH) }), P7_NEWS(pk), p7Pag(pk), P7_POST).join('\n'),
  tasks: [
    // Т1 · значение data-bs-theme: light → dark (тёмная строка меню).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 800, pre: P7_PRE, post: P7_NEWS(pk).concat(P7_POST),
      code0: p7Nav(pk, { theme: 'light' }).join('\n'), answer: p7Nav(pk).join('\n'),
      goal: (D) => (p7Dark(D) ? null : C.t1.no),
      sample: ['<nav class="navbar …" data-bs-theme="dark">'],
      drill: { pre: P7_PRE, post: P7_NEWS(pk).concat(P7_POST), code0: p7Nav(pk, { brand: 'nav-link' }).join('\n'), answer: p7Nav(pk).join('\n'),
        goal: (D) => (D.q('a.navbar-brand') ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class у третьей ссылки: nav-link.
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 800, pre: P7_PRE, post: P7_NEWS(pk).concat(P7_POST),
      code0: p7Nav(pk, { links: ['nav-link active', 'nav-link', '', 'nav-link'] }).join('\n'), answer: p7Nav(pk).join('\n'),
      goal: (D) => {
        if (D.qa('.navbar-nav .nav-link').length === 4) return null;
        if (D.q('.navbar-nav .nav-item > a.nav-item')) return C.t2.item;
        return C.t2.no;
      },
      sample: ['<li class="nav-item"><a class="nav-link" href="#">…</a></li>'],
      drill: { pre: P7_PRE.concat(P7_NEWS(pk)), post: P7_POST, code0: p7Pag(pk, { ul: '' }).join('\n'), answer: p7Pag(pk, { ul: 'pagination' }).join('\n'),
        goal: (D) => (p7Pager(D) ? null : C.t2.drillNo) }
    }),
    // Т3 · Navbar с сайта (Components → Navbar): скопировать, вставить, своё название и ссылки.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 800, pre: P7_PRE, post: P7_NEWS(pk).concat(P7_POST), docs: () => P7_DOCS_SITE,
      code0: '', answer: P7_SITE_NAV.split('\n').map((l) => '  ' + l).join('\n').replace('>Navbar<', '>' + pk(P7.club) + '<').replace('>Home<', '>' + pk(P7.l1) + '<').replace('>Link<', '>' + pk(P7.l2) + '<').replace('>Disabled<', '>' + pk(P7.l4) + '<'),
      goal: (D) => {
        const nav = D.q('nav.navbar');
        if (!nav) return C.t3.noNav;
        const brand = nav.querySelector('.navbar-brand');
        if (p7Sample(brand) || D.qa('.nav-link').some((a) => p7Sample(a))) return C.t3.sample;
        if (!p7TogOk(D)) return C.t3.tgt;
        return brand && brand.textContent.trim().length > 1 ? null : C.t3.noText;
      },
      sample: ['<nav class="navbar md:navbar-expand bg-1">', '  <a class="navbar-brand" href="#">…</a>', '  <a class="nav-link" href="#">…</a>'],
      drill: { pre: P7_PRE.concat(P7_NEWS(pk)), post: P7_POST, code0: '', answer: P7_SITE_PAG.split('\n').map((l) => '  ' + l).join('\n').replace('Previous', pk(P7.prev)).replace('Next', pk(P7.next)),
        goal: (D) => (p7Pager(D) ? null : C.t3.drillNo) }
    }),
    // Т4 · имя версии 5 и пропущенная решётка: navbar-expand-lg → md:navbar-expand, data-bs-target="menyu" → "#menyu".
    (pk) => bpTask(4, {
      kind: 'fix', vw: 800, pre: P7_PRE, post: P7_NEWS(pk).concat(P7_POST), docs: () => P7_DOCS_FIX,
      code0: p7Nav(pk, { nav: 'navbar navbar-expand-lg bg-1', target: 'menyu' }).join('\n'), answer: p7Nav(pk).join('\n'),
      goal: (D) => {
        if (!p7Expand(D)) return C.t4.expand;
        return p7TogOk(D) ? null : C.t4.tgt;
      },
      sample: ['<nav class="navbar md:navbar-expand bg-1" …>', '<button … data-bs-target="#menyu">'],
      drill: { pre: P7_PRE.concat(P7_NEWS(pk)), post: P7_POST, code0: p7Pag(pk, { li: ['page-link', 'page-link', 'page-link active', 'page-link', 'page-link'], a: ['page-item', 'page-item', 'page-item', 'page-item', 'page-item'] }).join('\n'),
        answer: p7Pag(pk).join('\n'), goal: (D) => (p7Pager(D) ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: Navbar (название, nav-link, тёмный), номера страниц с active, строка script с сайта.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 800, pre: P7_PRE, post: ['</body>'], docs: () => P7_DOCS_OWN,
      code0: p7Nav(pk, { theme: '', brand: '', brandText: pk(P7.myH), links: ['', '', '', ''] }).concat(P7_NEWS(pk), p7Pag(pk, { ul: 'pagination justify-content-center', li: ['page-item', '', 'page-item', 'page-item', 'page-item'], a: ['', '', '', '', ''] }), ['  ']).join('\n'),
      answer: p7Nav(pk, { brandText: pk(P7.myH) }).concat(P7_NEWS(pk), p7Pag(pk), ['  ' + BP_SCRIPT]).join('\n'),
      list: [
        { t: L3("Navbar: navbar-brand va nav-link", 'Navbar: navbar-brand и nav-link', 'Navbar: navbar-brand and nav-link'), ok: (D) => !!D.q('.navbar-brand') && D.qa('.navbar-nav .nav-link').length >= 3 },
        { t: L3("satr qora: dark", 'строка тёмная: dark', 'a dark bar: dark'), ok: (D) => p7Dark(D) },
        { t: L3("raqamlar: page-link va active", 'номера: page-link и active', 'numbers: page-link and active'), ok: (D) => p7Pager(D) && !!D.q('li.page-item.active') },
        { t: L3("script: body oxirida", 'script: в конце body', 'script: end of body'), ok: (D) => D.script.ok && D.script.atEnd }
      ],
      goal: (D) => {
        if (!D.q('.navbar-brand') || D.qa('.navbar-nav .nav-link').length < 3) return C.t5.nav;
        if (!p7Dark(D)) return C.t5.dark;
        if (!p7Pager(D)) return C.t5.pag;
        if (!D.q('li.page-item.active')) return C.t5.act;
        if (!D.script.tag) return FB.noScript;
        if (!D.script.atEnd) return FB.scriptPlace;
        return null;
      },
      sample: ['<nav class="navbar md:navbar-expand bg-1" data-bs-theme="dark">', '<a class="navbar-brand" …>', '<a class="nav-link" …>', '<li class="page-item active"><a class="page-link" …>', BP_SCRIPT],
      onSolved: (st) => store.set('myDoc', P7_PRE.concat([st.code.replace(/\s+$/, '')], ['</body>']).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Sayt menyusi", 'Навигация сайта', 'Site navigation'),
    say: L3("Salom! Bu to'garakning yangiliklar sayti. Tepada qora menyu satri: nom va bo'limlar havolalari. Pastda sahifa raqamlari. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт новостей кружка. Сверху тёмная строка меню: название и ссылки разделов. Внизу номера страниц. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is the club’s news site. On top is a dark menu bar: the name and section links. At the bottom are page numbers. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda menyu satri va raqamlarning so'zlari o'chib ketdi. Havolalar oddiy ro'yxat bo'lib qoldi, raqamlar ham ustma-ust. Varaqlar ham o'chdi.",
      'Ой! При обновлении стёрлись слова строки меню и номеров. Ссылки стали простым списком, номера тоже друг под другом. Вкладки погасли.',
      'Oh no! The update erased the menu bar and number words. The links turned into a plain list, and the numbers are stacked too. The tabs went dark.'),
    done: L3("Kodga qarang: teglar joyida, lekin so'zlar yo'q. Darsdagi topishmoq esingizdami? Telefon va noutbuk uchun ikki xil menyu kerak emas: bitta Navbar o'zi o'zgaradi. Beshta sahifani birma-bir tuzatamiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: теги на месте, а слов нет. Помнишь загадку урока? Для телефона и ноутбука не нужны два меню: один Navbar меняется сам. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the tags are in place, but the words are gone. Remember the lesson’s riddle? A phone and a laptop don’t need two menus: one Navbar changes by itself. Let’s fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifada menyu va raqamlarni tiklaymiz", 'Восстановим меню и номера на пяти страницах', 'Let’s restore the menu and numbers on five pages')
  },
  t1: {
    eyebrow: L3("Rang", 'Цвет', 'Color'),
    say: L3("Birinchi sahifa: menyu satri oq bo'lib qolgan, yozuvlari ham qorayib ketgan. nav tegidagi data-bs-theme qiymatiga qarang va satrni qora qiling.",
      'Первая страница: строка меню стала белой. Посмотри на значение data-bs-theme у тега nav и сделай строку тёмной.',
      'The first page: the menu bar turned white. Look at the data-bs-theme value on the nav tag and make the bar dark.'),
    ask: L3("Menyu satri qora bo'lsin", 'Пусть строка меню будет тёмной', 'Make the menu bar dark'),
    ok: L3("Zo'r! Menyu satri yana qora, yozuvlari oq.", 'Здорово! Строка меню снова тёмная, надписи светлые.', 'Great! The menu bar is dark again, with light labels.'),
    hints: [
      L3("nav tegidagi data-bs-theme qiymatiga qarang.", 'Посмотри на значение data-bs-theme у тега nav.', 'Look at the data-bs-theme value on the nav tag.'),
      L3("light yorug' degani. Qorasi dark.", 'light — светлая. Тёмная — dark.', 'light means light. Dark is dark.'),
      L3("Namuna kod ostida. Xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши так же и нажми «Проверить».', 'The example is under the code. Write it the same way and tap Check.')
    ],
    no: L3("Satr hali qora emas. data-bs-theme qiymati dark bo'lsin.", 'Строка ещё не тёмная. Пусть значение data-bs-theme будет dark.', 'The bar isn’t dark yet. Make the data-bs-theme value dark.'),
    drill: L3("endi sayt nomini tuzating", 'теперь почини название сайта', 'now fix the site name'),
    drillNo: L3("Sayt nomi menyu havolasidek kichik. Uning class qiymati navbar-brand bo'lsin.", 'Название сайта мелкое, как ссылка меню. Пусть его class будет navbar-brand.', 'The site name is small like a menu link. Make its class navbar-brand.')
  },
  t2: {
    eyebrow: L3("Havolalar", 'Ссылки', 'Links'),
    say: L3("Ikkinchi sahifa: uchinchi havola boshqalardan ajralib turibdi, u ko'k va tagiga chizilgan. Uning class qiymati bo'sh. Darsda menyu havolalariga qaysi so'z yozilgan edi?",
      'Вторая страница: третья ссылка выбивается из ряда, она синяя и подчёркнутая. У неё пустой class. Какое слово на уроке писали ссылкам меню?',
      'The second page: the third link stands out, blue and underlined. Its class is empty. Which word did the lesson give menu links?'),
    ask: L3("Uchinchi havola ham menyu havolasi bo'lsin", 'Пусть третья ссылка тоже будет ссылкой меню', 'Make the third link a menu link too'),
    ok: L3("Ajoyib! Barcha havolalar bir xil, menyu satri tartibli.", 'Отлично! Все ссылки одинаковые, строка меню аккуратная.', 'Great! All the links match, and the menu bar is neat.'),
    hints: [
      L3("Uchinchi havolaning class qiymatiga qarang: u bo'sh.", 'Посмотри на class третьей ссылки: он пустой.', 'Look at the third link’s class: it’s empty.'),
      L3("Qolgan havolalarda nav-link yozilgan.", 'У остальных ссылок написано nav-link.', 'The other links say nav-link.'),
      L3("Namuna kod ostida. Xuddi shunday so'zni yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такое же слово и нажми «Проверить».', 'The example is under the code. Write the same word and tap Check.')
    ],
    no: L3("Uchinchi havola hali oddiy. Unga nav-link kerak.", 'Третья ссылка пока простая. Ей нужно nav-link.', 'The third link is still plain. It needs nav-link.'),
    item: L3("nav-item band uchun, li tegiga yoziladi. Havolaning o'ziga esa nav-link.", 'nav-item — для пункта, пишется тегу li. А самой ссылке — nav-link.', 'nav-item is for the item, on the li tag. The link itself gets nav-link.'),
    drill: L3("endi sahifa raqamlarini tuzating", 'теперь почини номера страниц', 'now fix the page numbers'),
    drillNo: L3("Raqamlar hali ustma-ust. ul tegiga pagination kerak.", 'Номера ещё друг под другом. Тегу ul нужно pagination.', 'The numbers are still stacked. The ul tag needs pagination.')
  },
  t3: {
    eyebrow: L3("Navbar", 'Navbar', 'Navbar'),
    say: L3("Uchinchi sahifada menyu satri umuman yo'q. Bootstrap saytidagi Navbar namunasini nusxalang va qo'ying. Keyin moslang: Navbar o'rniga to'garak nomini, Home va Link o'rniga o'z bo'limlaringizni yozing.",
      'На третьей странице строки меню совсем нет. Скопируй пример Navbar с сайта Bootstrap и вставь. Потом подгони: вместо Navbar — название кружка, вместо Home и Link — свои разделы.',
      'The third page has no menu bar at all. Copy the Navbar example from the Bootstrap site and paste it. Then adapt it: the club name instead of Navbar, and your own sections instead of Home and Link.'),
    ask: L3("Saytdan Navbar oling va moslang", 'Возьми Navbar с сайта и подгони', 'Take a Navbar from the site and adapt it'),
    ok: L3("Qoyil! Saytdagi menyu satri endi to'garakniki!", 'Вот это да! Строка меню с сайта теперь у кружка!', 'Wow! The site’s menu bar now belongs to the club!'),
    hints: [
      L3("Saytdagi Navbar kodi yonida nusxalash belgisi bor. Uni bosing, keyin Qo'yish tugmasini.", 'Рядом с кодом Navbar на сайте есть значок копирования. Нажми его, потом «Вставить».', 'Next to the Navbar code on the site there’s a copy icon. Tap it, then Paste.'),
      L3("Qo'yilgan kodda navbar-brand ichida Navbar so'zi, nav-link larda Home, Link va Disabled bor. Ularni o'zingizniki bilan almashtiring.", 'Во вставленном коде в navbar-brand стоит Navbar, а в nav-link — Home, Link и Disabled. Замени их на свои.', 'In the pasted code, navbar-brand says Navbar and the nav-links say Home, Link and Disabled. Replace them with your own.'),
      L3("Namuna kod ostida. Xuddi shunday o'z matningizni yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши свой текст и нажми «Проверить».', 'The example is under the code. Write your own text the same way and tap Check.')
    ],
    noNav: L3("Sahifada menyu satri hali yo'q. Saytdan Navbar namunasini nusxalang va qo'ying.", 'На странице пока нет строки меню. Скопируй пример Navbar с сайта и вставь.', 'There’s no menu bar on the page yet. Copy the Navbar example from the site and paste it.'),
    sample: L3("Menyu satrida hali saytdagi inglizcha so'zlar turibdi. Nom va havolalarni o'zingizniki bilan almashtiring.", 'В строке меню ещё английские слова с сайта. Замени название и ссылки на свои.', 'The menu bar still has the site’s English words. Replace the name and links with your own.'),
    tgt: L3("☰ tugmasi qutini topmayapti. data-bs-target-da panjara va quti id si turishi kerak.", 'Кнопка ☰ не находит ящик. В data-bs-target должны стоять решётка и id ящика.', 'The ☰ button can’t find the drawer. data-bs-target needs a hash and the drawer’s id.'),
    noText: L3("Sayt nomi bo'sh. navbar-brand ichiga nom yozing.", 'Название сайта пустое. Напиши его в navbar-brand.', 'The site name is empty. Write it in navbar-brand.'),
    drill: L3("endi saytdan sahifa raqamlarini oling", 'теперь возьми с сайта номера страниц', 'now take the page numbers from the site'),
    drillNo: L3("Pagination namunasini nusxalang, qo'ying va Previous hamda Next o'rniga o'z so'zlaringizni yozing.", 'Скопируй пример Pagination, вставь и напиши вместо Previous и Next свои слова.', 'Copy the Pagination example, paste it and write your own words instead of Previous and Next.')
  },
  t4: {
    eyebrow: L3("Tuzatish", 'Починка', 'Fix'),
    say: L3("To'rtinchi sahifani eski darslikdan ko'chiribman: noutbukda ham havolalar ☰ ortida qolgan, telefonda esa ☰ ishlamaydi. Kodda ikkita xato bor: bittasi beshinchi versiyaning nomi, ikkinchisi tushib qolgan belgi. Topib, tuzating.",
      'Четвёртую страницу я списал из старого учебника: даже на ноутбуке ссылки спрятаны за ☰, а на телефоне ☰ не работает. В коде две ошибки: одна — имя пятой версии, другая — пропущенный знак. Найди и почини.',
      'I copied the fourth page from an old tutorial: even on a laptop the links hide behind ☰, and on a phone ☰ doesn’t work. There are two mistakes in the code: one is a version 5 name, the other is a missing symbol. Find and fix them.'),
    ask: L3("Havolalar qatorga chiqsin, ☰ ishlasin", 'Пусть ссылки встанут в ряд, а ☰ работает', 'Make the links line up and ☰ work'),
    ok: L3("Zo'r ish! Havolalar qatorda, ☰ ham qutini topadi.", 'Отличная работа! Ссылки в ряд, и ☰ находит ящик.', 'Nice work! The links are in a row, and ☰ finds the drawer.'),
    hints: [
      L3("nav tegidagi class qiymatiga va ☰ tugmasidagi data-bs-target-ga qarang.", 'Посмотри на class у тега nav и на data-bs-target у кнопки ☰.', 'Look at the class on the nav tag and data-bs-target on the ☰ button.'),
      L3("navbar-expand-lg eski nom, oltinchi versiyada md:navbar-expand. id oldiga esa panjara qo'ying.", 'navbar-expand-lg — старое имя, в шестой версии — md:navbar-expand. А перед id поставь решётку.', 'navbar-expand-lg is an old name; in version 6 it’s md:navbar-expand. And put a hash before the id.'),
      L3("Namuna kod ostida. Xuddi shunday ikkala xatoni tuzating va Tekshirishni bosing.", 'Образец под кодом. Так же исправь обе ошибки и нажми «Проверить».', 'The example is under the code. Fix both mistakes the same way and tap Check.')
    ],
    expand: L3("Havolalar hali qatorga chiqmaydi. Oltinchi versiyada nav tegiga md:navbar-expand yoziladi.", 'Ссылки пока не встают в ряд. В шестой версии тегу nav пишут md:navbar-expand.', 'The links don’t line up yet. In version 6 the nav tag gets md:navbar-expand.'),
    tgt: L3("☰ hali qutini topmaydi. data-bs-target-da panjara va quti id si turishi kerak.", '☰ пока не находит ящик. В data-bs-target должны стоять решётка и id ящика.', '☰ can’t find the drawer yet. data-bs-target needs a hash and the drawer’s id.'),
    drill: L3("endi aralashib ketgan raqam so'zlarini tuzating", 'теперь почини перепутанные слова номеров', 'now fix the mixed-up number words'),
    drillNo: L3("li tegiga page-item, a tegiga page-link yoziladi. Bu yerda ular o'rin almashgan.", 'Тегу li пишут page-item, а тегу a — page-link. Здесь они поменялись местами.', 'The li tag gets page-item and the a tag gets page-link. Here they swapped places.')
  },
  t5: {
    eyebrow: L3("Mening saytim", 'Мой сайт', 'My site'),
    say: L3("Beshinchi sahifa sizniki: o'z saytingiz! Unda menyu satri va raqamlar bor, lekin so'zlar yo'q: satr rangsiz, nomda va havolalarda class bo'sh, raqamlar oddiy, script qatori ham yo'q. Ro'yxatdagi to'rtta shartni bajaring.",
      'Пятая страница твоя: твой сайт! В ней есть строка меню и номера, но нет слов: строка без цвета, у названия и ссылок пустой class, номера простые, и строки script нет. Выполни четыре условия из списка.',
      'The fifth page is yours: your own site! It has a menu bar and numbers, but no words: the bar has no color, the name and links have empty classes, the numbers are plain, and there’s no script line. Meet the four conditions on the list.'),
    ask: L3("O'z saytingizni yig'ing", 'Собери свой сайт', 'Build your own site'),
    ok: L3("Vau, menyu satri ham, raqamlar ham sizniki! Endi istalgan saytga Navbar qo'sha olasiz!", 'Вау, и строка меню, и номера твои! Теперь ты добавишь Navbar на любой сайт!', 'Wow, the menu bar and the numbers are yours! Now you can add a Navbar to any site!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Oldin nomga navbar-brand, havolalarga nav-link, data-bs-theme-ga dark yozing.", 'Посмотри на список: четыре условия. Сначала напиши названию navbar-brand, ссылкам — nav-link, а в data-bs-theme — dark.', 'Look at the list: four conditions. First give the name navbar-brand, the links nav-link, and data-bs-theme dark.'),
      L3("Keyin raqamlarga page-link, ikkinchi bandga page-item active yozing. Oxirida saytdan script qatorini nusxalab, bo'sh qatorga qo'ying.", 'Потом напиши номерам page-link, второму пункту — page-item active. В конце скопируй с сайта строку script и вставь в пустую строку.', 'Then give the numbers page-link and the second item page-item active. Finally copy the script line from the site and paste it into the empty line.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda o'z saytingizni yig'ing va Tekshirishni bosing.", 'Образец под кодом. Собери свой сайт в таком же порядке и нажми «Проверить».', 'The example is under the code. Build your site in the same order and tap Check.')
    ],
    nav: L3("Nomga navbar-brand, havolalarga nav-link kerak.", 'Названию нужно navbar-brand, ссылкам — nav-link.', 'The name needs navbar-brand, and the links need nav-link.'),
    dark: L3("Satr hali qora emas. data-bs-theme qiymati dark bo'lsin.", 'Строка ещё не тёмная. Пусть data-bs-theme будет dark.', 'The bar isn’t dark yet. Make data-bs-theme dark.'),
    pag: L3("Raqamlar hali oddiy. Har bir raqamga page-link yozing.", 'Номера пока простые. Напиши каждому номеру page-link.', 'The numbers are still plain. Give every number page-link.'),
    act: L3("Ochiq sahifa belgilanmagan. Ikkinchi bandga page-item active yozing.", 'Открытая страница не отмечена. Напиши второму пункту page-item active.', 'The open page isn’t marked. Give the second item page-item active.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Menyu satri va raqamlar yana joyida! Qarang, bu sizning saytingiz.", 'Строка меню и номера снова на месте! Смотри, это твой сайт.', 'The menu bar and the numbers are back! Look, this is your site.') },
      { k: 'a', text: L3("Menyu satri: navbar, ichida nom navbar-brand va havolalar nav-link.", 'Строка меню: navbar, внутри название navbar-brand и ссылки nav-link.', 'The menu bar: navbar, with the name navbar-brand and the links nav-link inside.') },
      { k: 'b', text: L3("data-bs-theme dark uni qora qiladi, md:navbar-expand esa keng ekranda qatorga qo'yadi.", 'data-bs-theme dark делает её тёмной, а md:navbar-expand ставит ссылки в ряд на широком экране.', 'data-bs-theme dark makes it dark, and md:navbar-expand lines the links up on wide screens.') },
      { k: 'c', text: L3("Raqamlar: pagination, page-item va page-link, ochiq sahifada active.", 'Номера: pagination, page-item и page-link, у открытой страницы — active.', 'The numbers: pagination, page-item and page-link, with active on the open page.') },
      { k: 'd', text: L3("Telefondagi ☰ qutisini script qatori ochadi. navbar-expand-lg esa eski nom.", 'Ящик ☰ на телефоне открывает строка script. А navbar-expand-lg — старое имя.', 'The script line opens the ☰ drawer on a phone. And navbar-expand-lg is an old name.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda Bootstrap formalarini yasaymiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке соберём формы Bootstrap. До встречи!', 'Congratulations! Next lesson we’ll build Bootstrap forms. See you!') }
    ],
    roles: {
      a: L3("navbar · navbar-brand · nav-link", 'navbar · navbar-brand · nav-link', 'navbar · navbar-brand · nav-link'),
      b: L3("dark · md:navbar-expand", 'dark · md:navbar-expand', 'dark · md:navbar-expand'),
      c: L3("pagination · page-link · active", 'pagination · page-link · active', 'pagination · page-link · active'),
      d: L3("script, eski nomlar yo'q", 'script, без старых имён', 'script, no old names')
    },
    ask: L3("Saytingizga qarang", 'Посмотри на свой сайт', 'Look at your site')
  }
};
