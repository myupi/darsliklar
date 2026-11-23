// =============================================================================
// ТЕСТЫ К УРОКУ 7 МОДУЛЯ BOOTSTRAP «Navbar и Pagination» (23.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: navbar-brand — название сайта; md:navbar-expand — от 768 px ссылки в ряд (navbar-expand-lg — имя версии 5);
// ☰ открывает ящик только со строкой script; active у page-item — открытая страница; тёмный Navbar — data-bs-theme="dark"
// (navbar-dark, bg-dark — имена версии 5). Страница — честная (bs={BS_CSS}); скрипта нет — ящик закрыт. Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'navbar-i-pagination';
const b7Nav = (T, o) => {
  const O = o || {};
  const links = [T('Asosiy', 'Главная', 'Home'), T('Kurslar', 'Курсы', 'Courses'), T('Aloqa', 'Контакты', 'Contacts')];
  return `<nav class="${O.navCls || 'navbar md:navbar-expand bg-1'}"${O.theme === false ? '' : ' data-bs-theme="dark"'}>\n  <div class="container-fluid">\n    <a class="${O.brand || 'navbar-brand'}" href="#">${T("Robot to'garagi", 'Кружок роботов', 'Robot club')}</a>\n`
    + `    <button class="btn-icon navbar-toggler" data-bs-toggle="drawer" data-bs-target="#menyu"><span class="navbar-toggler-icon"></span></button>\n`
    + `    <dialog class="drawer drawer-end" id="menyu">\n      <div class="drawer-body">\n        <ul class="nav navbar-nav">\n`
    + links.map((t, i) => `          <li class="nav-item"><a class="nav-link${i ? '' : ' active'}" href="#">${t}</a></li>`).join('\n')
    + `\n        </ul>\n      </div>\n    </dialog>\n  </div>\n</nav>`;
};
const b7Short = (T, navCls, extra) => `<nav class="${navCls}"${extra || ''}>\n  <div class="container-fluid">\n    <a class="navbar-brand" href="#">${T("Robot to'garagi", 'Кружок роботов', 'Robot club')}</a>\n    <button class="btn-icon navbar-toggler">☰</button>\n    <dialog class="drawer">…</dialog>\n  </div>\n</nav>`;
const b7Pag = (li2) => `<ul class="pagination justify-content-center">\n  <li class="page-item"><a class="page-link" href="#">1</a></li>\n  <li class="${li2}"><a class="page-link" href="#">2</a></li>\n  <li class="page-item"><a class="page-link" href="#">3</a></li>\n</ul>`;
const QS = [
  { id: 'bootstrap-07t1', target: 'bootstrap-07', ptype: 'Bootstrap', tag: 'navbar-brand', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b7Short(T, 'navbar md:navbar-expand bg-1', ' data-bs-theme="dark"').replace('class="navbar-brand"', 'class="___"')} html={b7Nav(T)} bs={BS_CSS} vw={800} mark={[2]} />; },
    uz: { ctx: "Sayt nomi menyu satrida logotipdek katta va qalin turibdi.", q: "Sayt nomidagi bo'sh joyga qaysi class yoziladi?", opts: ['nav-link', 'brand', 'navbar-brand', 'navbar-logo'],
      ok: "Xuddi shunday! navbar-brand sayt nomini kattaroq va qalinroq qiladi. nav-link esa oddiy havolalar uchun.", hint: "So'z navbar bilan boshlanadi, keyin «brend», ya'ni nom degani.", alt: "Qora menyu satri: chapda sayt nomi, yonida havolalar" },
    ru: { ctx: 'Название сайта в строке меню — крупное и жирное, как логотип.', q: 'Какой class пишется на пустое место у названия?', opts: ['nav-link', 'brand', 'navbar-brand', 'navbar-logo'],
      ok: 'Именно! navbar-brand делает название сайта крупнее и жирнее. А nav-link — для обычных ссылок.', hint: 'Слово начинается с navbar, а потом «бренд», то есть название.', alt: 'Тёмная строка меню: слева название, рядом ссылки' },
    en: { ctx: 'The site name in the menu bar is big and bold, like a logo.', q: 'Which class goes in the empty spot on the name?', opts: ['nav-link', 'brand', 'navbar-brand', 'navbar-logo'],
      ok: 'Exactly! navbar-brand makes the site name bigger and bolder. nav-link is for the ordinary links.', hint: 'The word starts with navbar, then “brand”, meaning the name.', alt: 'A dark menu bar: the site name on the left, links next to it' } },
  { id: 'bootstrap-07t2', target: 'bootstrap-07', ptype: 'Bootstrap', tag: 'md:navbar-expand', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b7Short(T, 'navbar ___ bg-1', ' data-bs-theme="dark"')} html={b7Nav(T, { navCls: 'navbar bg-1' })} bs={BS_CSS} vw={800} mark={[0]} />; },
    uz: { ctx: "Planshetda havolalar o'rniga faqat ☰ tugmasi ko'rinyapti.", q: "Havolalar keng ekranda qatorga chiqishi uchun nima yoziladi?", opts: ['md:navbar-expand', 'navbar-expand-lg', 'md-navbar-expand', 'navbar-md'],
      ok: "To'ppa-to'g'ri! md:navbar-expand 768 pikseldan keng ekranda havolalarni qatorga qo'yadi. navbar-expand-lg — beshinchi versiya nomi.", hint: "Oltinchi versiyada ekran o'lchami so'z oldidan, ikki nuqta bilan yoziladi.", alt: "Planshetda faqat ☰ tugmasi ko'rinayotgan menyu satri" },
    ru: { ctx: 'На экране планшета вместо ссылок видна только кнопка ☰.', q: 'Что написать, чтобы на широком экране ссылки встали в ряд?', opts: ['md:navbar-expand', 'navbar-expand-lg', 'md-navbar-expand', 'navbar-md'],
      ok: 'Верно! md:navbar-expand ставит ссылки в ряд на экране шире 768 пикселей, как md:col-4. А navbar-expand-lg — имя пятой версии.', hint: 'В шестой версии размер экрана пишется перед словом, через двоеточие.', alt: 'Строка меню на планшете: видна только кнопка ☰' },
    en: { ctx: 'On a tablet screen only the ☰ button shows instead of the links.', q: 'What do you write so the links line up on a wide screen?', opts: ['md:navbar-expand', 'navbar-expand-lg', 'md-navbar-expand', 'navbar-md'],
      ok: 'Right! md:navbar-expand puts the links in a row on screens wider than 768 pixels, like md:col-4. navbar-expand-lg is a version 5 name.', hint: 'In version six the screen size goes before the word, with a colon.', alt: 'A menu bar on a tablet showing only the ☰ button' } },
  { id: 'bootstrap-07t3', target: 'bootstrap-07', ptype: 'Bootstrap', tag: 'script', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis code={'<link href="…bootstrap.min.css" rel="stylesheet">\n<body>\n  <nav class="navbar md:navbar-expand bg-1" data-bs-theme="dark">\n    <div class="container-fluid">\n      <a class="navbar-brand" href="#">…</a>\n      <button class="btn-icon navbar-toggler">☰</button>\n      <dialog class="drawer">…</dialog>\n  </div></nav>\n</body>'} html={b7Nav(T)} bs={BS_CSS} vw={360} mark={[8]} />; },
    uz: { ctx: "Telefonda ☰ tugmasini bosishsa ham havolalar qutisi chiqmayapti. Sahifaning o'zi chiroyli.", q: "Nega ☰ ishlamayapti?", opts: ["head ichida link qatori yo'q", "☰ telefonda umuman ishlamaydi", "Havolalarda nav-link yo'q", "body oxirida script yo'q"],
      ok: "Qoyil! Sahifa chiroyli, demak link bor. Qutini esa Bootstrap skripti ochadi, script qatori bo'lmasa, ☰ jim turadi.", hint: "Sahifa bezalganmi? Unda CSS bor. Qutini nima ochar edi?", alt: "Telefonda qora menyu satri va ☰ tugmasi" },
    ru: { ctx: 'На телефоне при нажатии на ☰ ящик со ссылками не выезжает. Сама страница красивая.', q: 'Почему ☰ не работает?', opts: ['В head нет строки link', '☰ не работает на телефоне', 'У ссылок нет nav-link', 'В конце body нет script'],
      ok: 'Здорово! Страница красивая — значит, link есть. А ящик открывает скрипт Bootstrap: без строки script кнопка ☰ молчит.', hint: 'Страница оформлена? Значит, CSS есть. А что открывает ящик?', alt: 'Телефон: тёмная строка меню и кнопка ☰' },
    en: { ctx: 'On a phone, tapping ☰ doesn’t slide out the drawer with links. The page itself looks nice.', q: 'Why doesn’t ☰ work?', opts: ['No link line in head', '☰ never works on phones', 'The links lack nav-link', 'No script at the end of body'],
      ok: 'Nice work! The page is styled, so link is there. The drawer is opened by Bootstrap’s script: without the script line, ☰ stays silent.', hint: 'Is the page styled? Then the CSS is there. What opens the drawer?', alt: 'A phone: a dark menu bar and the ☰ button' } },
  { id: 'bootstrap-07t4', target: 'bootstrap-07', ptype: 'Bootstrap', tag: 'active', correct: 1, mono: true,
    vis: () => <WqVis code={b7Pag('page-item ___')} html={b7Pag('page-item active')} bs={BS_CSS} vw={360} mark={[2]} />,
    uz: { ctx: "Sahifa raqamlarida 2 ko'k: biz hozir 2-sahifadamiz.", q: "2-raqam bandidagi bo'sh joyga nima yoziladi?", opts: ['selected', 'active', 'page-active', 'current'],
      ok: "Ajoyib! active ochiq sahifani bo'yaydi. U li tegidagi page-item yoniga yoziladi, xuddi menyudagi faol havola kabi.", hint: "Faol so'zi inglizchada qanday? Menyu satrida ham shu so'z bor edi.", alt: "1, 2, 3 raqamlari, 2 ko'k rangda" },
    ru: { ctx: 'В номерах страниц 2 — синяя: мы сейчас на странице 2.', q: 'Что пишется на пустое место у пункта с номером 2?', opts: ['selected', 'active', 'page-active', 'current'],
      ok: 'Отлично! active красит открытую страницу. Он пишется рядом с page-item у тега li — как у активной ссылки в меню.', hint: 'Как по-английски «активный»? Это слово было и в строке меню.', alt: 'Номера 1, 2, 3, номер 2 — синий' },
    en: { ctx: 'In the page numbers, 2 is blue: we’re on page 2 now.', q: 'What goes in the empty spot on the item with number 2?', opts: ['selected', 'active', 'page-active', 'current'],
      ok: 'Great! active colors the open page. It goes next to page-item on the li tag, just like the active link in the menu.', hint: 'What’s the English word for the current, active one? It was in the menu bar too.', alt: 'Numbers 1, 2, 3 with 2 in blue' } },
  { id: 'bootstrap-07t5', target: 'bootstrap-07', ptype: 'Bootstrap', tag: 'data-bs-theme', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b7Short(T, 'navbar md:navbar-expand bg-1', ' ___')} html={b7Nav(T)} bs={BS_CSS} vw={800} mark={[0]} />; },
    uz: { ctx: "Menyu satri qora, yozuvlari esa oq bo'lishi kerak.", q: "nav tegidagi bo'sh joyga nima yoziladi?", opts: ['class="navbar-dark"', 'class="bg-dark"', 'data-bs-theme="dark"', 'style="dark"'],
      ok: "Xuddi shunday! Oltinchi versiyada qora satr data-bs-theme=\"dark\" bilan yoziladi. navbar-dark va bg-dark — beshinchi versiyaning nomlari.", hint: "Saytdagi Dark navbar bo'limini eslang: u class emas, data-bs bilan boshlanadi.", alt: "Qora menyu satri, oq yozuvlar" },
    ru: { ctx: 'Строка меню должна быть тёмной, а надписи — светлыми.', q: 'Что пишется на пустое место у тега nav?', opts: ['class="navbar-dark"', 'class="bg-dark"', 'data-bs-theme="dark"', 'style="dark"'],
      ok: 'Именно! В шестой версии тёмная строка — это data-bs-theme="dark". navbar-dark и bg-dark — имена пятой версии.', hint: 'Вспомните раздел Dark navbar на сайте: это не class, а атрибут, начинающийся с data-bs.', alt: 'Тёмная строка меню, светлые надписи' },
    en: { ctx: 'The menu bar must be dark, with light labels.', q: 'What goes in the empty spot on the nav tag?', opts: ['class="navbar-dark"', 'class="bg-dark"', 'data-bs-theme="dark"', 'style="dark"'],
      ok: 'Exactly! In version six a dark bar is data-bs-theme="dark". navbar-dark and bg-dark are version 5 names.', hint: 'Remember the Dark navbar section of the site: it isn’t a class but an attribute starting with data-bs.', alt: 'A dark menu bar with light labels' } }
];
