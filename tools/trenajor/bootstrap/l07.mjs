// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 7 «Navbar и Pagination» (23.11.2026) — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: Navbar — Components → Navbar; navbar-brand — название; nav-link — ссылки; md:navbar-expand — от 768 px ширины
// самого Navbar ссылки в ряд, уже — ☰ и ящик drawer, который открывает строка script; data-bs-target="#id"; тёмный —
// data-bs-theme="dark" (navbar-dark, bg-dark, navbar-expand-lg — имена версии 5); active — текущая страница; Pagination —
// pagination, page-item, page-link, active у page-item, justify-content-center у ul; скопированный пример настраивают.
// Страницы с раскрытым Navbar — vw 800 (Navbar шире 768 px), телефон — 360. Скриптов нет: ящик закрыт.
// Классы сверены с tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css. Ситуации тестов модуля
// (tools/webtest/bootstrap/l07.jsx) не повторяются. Апостроф в узбекском — ASCII «'».
// Словарь урока: menyu satri (Navbar), havola, bo'lim, quti (drawer), sahifa raqamlari (Pagination), faol (active).
// =============================================================================

const L3c = (fn) => ({ uz: fn(0), ru: fn(1), en: fn(2) });
const W = {
  cafe: ['Kodi kafesi', 'Кафе Коди', 'Kodi cafe'],
  home: ['Asosiy', 'Главная', 'Home'],
  menu: ['Taomlar', 'Блюда', 'Dishes'],
  map: ['Manzil', 'Адрес', 'Address'],
  prev: ['Oldingi', 'Назад', 'Previous'],
  next: ['Keyingi', 'Вперёд', 'Next'],
};
// Navbar: o.theme (dark по умолчанию; null — без), o.brand — class названия, o.links — class ссылок, o.t — data-t целям.
const nav = (o) => (i) => {
  const x = o || {};
  const links = x.links || ['nav-link active', 'nav-link', 'nav-link'];
  const t = x.t || {};
  return `<nav class="${x.cls || 'navbar md:navbar-expand bg-1'}"${x.theme === null ? '' : ' data-bs-theme="' + (x.theme || 'dark') + '"'}>\n  <div class="container-fluid">\n`
    + `    <a class="${x.brand || 'navbar-brand'}" href="#"${t.brand ? ' data-t="' + t.brand + '"' : ''}>${W.cafe[i]}</a>\n`
    + '    <button class="btn-icon navbar-toggler" data-bs-toggle="drawer" data-bs-target="#menyu"><span class="navbar-toggler-icon"></span></button>\n'
    + '    <dialog class="drawer drawer-end" id="menyu"><div class="drawer-body">\n      <ul class="nav navbar-nav">\n'
    + ['home', 'menu', 'map'].map((k, n) => `        <li class="nav-item"><a class="${links[n]}" href="#"${t['l' + n] ? ' data-t="' + t['l' + n] + '"' : ''}>${W[k][i]}</a></li>`).join('\n')
    + '\n      </ul>\n    </div></dialog>\n  </div>\n</nav>';
};
// Короткий код Navbar для редактора (8 строк до 52 знаков; container-fluid опущен).
const navCode = (o) => (i) => {
  const x = o || {};
  return `<nav class="${x.cls || 'navbar md:navbar-expand bg-1'}"\n  data-bs-theme="dark">\n`
    + `  <a class="${x.brand || 'navbar-brand'}" href="#">${W.cafe[i]}</a>\n`
    + `  <button class="navbar-toggler"\n    data-bs-toggle="drawer"\n    data-bs-target="${x.target || '#menyu'}">☰</button>\n`
    + `  <dialog class="drawer" id="menyu">…</dialog>\n</nav>`;
};
// Короткий код номеров для редактора: li и a — двумя строками.
const pagCode = (o) => (i) => {
  const x = o || {};
  return `<ul class="${x.ul || 'pagination'}">\n` + ['1', '2', '3'].map((l, n) => `  <li class="${x.li && x.li[n] != null ? x.li[n] : 'page-item'}">\n    <a class="${x.a && x.a[n] != null ? x.a[n] : 'page-link'}" href="#">${l}</a></li>`).join('\n') + '\n</ul>';
};
const pag = (o) => (i) => {
  const x = o || {};
  const labels = [W.prev[i], '1', '2', '3', W.next[i]];
  return `<ul class="${x.ul || 'pagination justify-content-center'}">\n`
    + labels.map((l, n) => `  <li class="${x.li && x.li[n] != null ? x.li[n] : (n === (x.act || 1) ? 'page-item active' : 'page-item')}"><a class="${x.a && x.a[n] != null ? x.a[n] : 'page-link'}" href="#"${x.t && x.t[n] ? ' data-t="' + x.t[n] + '"' : ''}>${l}</a></li>`).join('\n')
    + '\n</ul>';
};

export default [
  {
    id: 'bootstrap_l07_q01',
    difficulty: 'easy',
    tags: ['site', 'navbar'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Kafe saytiga tepada menyu satri kerak. Namunasini Bootstrap saytidan olasiz.",
      q: "Navbar sahifasi qaysi bo'limda?",
      opts: ['Components', 'Layout', 'Utilities', 'Forms'],
      why: "Navbar tayyor qism, shuning uchun u Components bo'limida, Menu, Dialog va Pagination yonida. Layout bo'limida esa to'r: Containers va Grid.",
    },
    ru: {
      ctx: 'Сайту кафе нужна строка меню сверху. Пример берёшь с сайта Bootstrap.',
      q: 'В каком разделе страница Navbar?',
      opts: ['Components', 'Layout', 'Utilities', 'Forms'],
      why: 'Navbar — готовый компонент, поэтому он в разделе Components, рядом с Menu, Dialog и Pagination. А в Layout — сетка: Containers и Grid.',
    },
    en: {
      ctx: 'The cafe site needs a menu bar on top. You take the example from the Bootstrap site.',
      q: 'Which section has the Navbar page?',
      opts: ['Components', 'Layout', 'Utilities', 'Forms'],
      why: 'Navbar is a ready-made component, so it’s in Components, next to Menu, Dialog and Pagination. Layout holds the grid: Containers and Grid.',
    },
  },
  {
    id: 'bootstrap_l07_q02',
    difficulty: 'easy',
    tags: ['navbar-brand'],
    mono: true,
    sort: false,
    vis: { page: L3c(nav()), vw: 800 },
    uz: {
      ctx: "Menyu satrida chapda kafe nomi katta va qalin turibdi.",
      q: "Nomni shunday qilgan class qaysi?",
      opts: ['navbar-brand', 'nav-link', 'navbar-nav', 'nav-item'],
      why: "navbar-brand sayt nomini logotipdek katta va qalin qiladi. nav-link oddiy havolalar uchun, navbar-nav havolalar ro'yxati uchun, nav-item esa ro'yxat bandi.",
    },
    ru: {
      ctx: 'В строке меню слева — название кафе, крупное и жирное.',
      q: 'Какой class так сделал название?',
      opts: ['navbar-brand', 'nav-link', 'navbar-nav', 'nav-item'],
      why: 'navbar-brand делает название сайта крупным и жирным, как логотип. nav-link — для обычных ссылок, navbar-nav — для списка ссылок, nav-item — пункт списка.',
    },
    en: {
      ctx: 'On the left of the menu bar, the cafe’s name is big and bold.',
      q: 'Which class made the name look like that?',
      opts: ['navbar-brand', 'nav-link', 'navbar-nav', 'nav-item'],
      why: 'navbar-brand makes the site name big and bold, like a logo. nav-link is for ordinary links, navbar-nav for the list of links, nav-item for a list item.',
    },
  },
  {
    id: 'bootstrap_l07_q03',
    difficulty: 'medium',
    tags: ['md:navbar-expand'],
    mono: false,
    sort: false,
    vis: { code: L3c(navCode()) },
    uz: {
      ctx: "nav tegida md:navbar-expand yozilgan.",
      q: "Bu so'z nima qiladi?",
      opts: ["Keng ekranda havolalarni qatorga qo'yadi", "Menyu satrini qora rangga bo'yaydi", "Havolalarni sahifa o'rtasiga qo'yadi", "Faqat telefonda menyuni ko'rsatadi"],
      why: "md:navbar-expand menyu satri 768 pikseldan keng bo'lsa, havolalarni qatorga qo'yadi. Torroq ekranda ular ☰ tugmasi ortidagi qutiga yashirinadi. md esa xuddi md:col-4 kabi.",
    },
    ru: {
      ctx: 'У тега nav написано md:navbar-expand.',
      q: 'Что делает это слово?',
      opts: ['На широком экране ставит ссылки в ряд', 'Красит строку меню в тёмный цвет', 'Ставит ссылки посередине страницы', 'Показывает меню только на телефоне'],
      why: 'md:navbar-expand ставит ссылки в ряд, если строка меню шире 768 пикселей. На экране уже они прячутся в ящик за кнопкой ☰. md — как в md:col-4.',
    },
    en: {
      ctx: 'The nav tag has md:navbar-expand.',
      q: 'What does this word do?',
      opts: ['Lines the links up on a wide screen', 'Paints the menu bar a dark color', 'Puts the links in the page’s middle', 'Shows the menu only on a phone'],
      why: 'md:navbar-expand lines the links up when the menu bar is wider than 768 pixels. On a narrower screen they hide in the drawer behind ☰. md is the same as in md:col-4.',
    },
  },
  {
    id: 'bootstrap_l07_q04',
    difficulty: 'medium',
    tags: ['script', 'drawer'],
    mono: false,
    sort: false,
    vis: { page: L3c(nav()), vw: 360 },
    uz: {
      ctx: "Telefonda ☰ ni bosishsa, havolalar qutisi chiqmayapti. Sahifa chiroyli, link qatori bor.",
      q: "Nimasi yetishmayapti?",
      opts: ["body oxirida script qatori", "md:navbar-expand so'zi", "Havolalardagi nav-link", "head-dagi ikkinchi link qatori"],
      why: "Qutini Bootstrap skripti ochadi, uni body oxiridagi script qatori ulaydi. Sahifa chiroyli bo'lsa, CSS ulangan. md:navbar-expand esa keng ekranga oid.",
    },
    ru: {
      ctx: 'На телефоне при нажатии ☰ ящик со ссылками не выезжает. Страница красивая, строка link есть.',
      q: 'Чего не хватает?',
      opts: ['Строки script в конце body', 'Слова md:navbar-expand', 'nav-link у ссылок', 'Второй строки link в head'],
      why: 'Ящик открывает скрипт Bootstrap, а подключает его строка script в конце body. Раз страница красивая, CSS подключён. А md:navbar-expand — про широкий экран.',
    },
    en: {
      ctx: 'On a phone, tapping ☰ doesn’t slide out the links drawer. The page looks nice and has the link line.',
      q: 'What’s missing?',
      opts: ['The script line at the end of body', 'The word md:navbar-expand', 'nav-link on the links', 'A second link line in head'],
      why: 'Bootstrap’s script opens the drawer, and the script line at the end of body connects it. If the page looks nice, the CSS is in. md:navbar-expand is about wide screens.',
    },
  },
  {
    id: 'bootstrap_l07_q05',
    difficulty: 'easy',
    tags: ['dark', 'theme'],
    mono: true,
    sort: false,
    vis: { page: L3c(nav()), vw: 800 },
    uz: {
      ctx: "Menyu satri qora, yozuvlari oq.",
      q: "nav tegida nima yozilgan?",
      opts: ['data-bs-theme="dark"', 'class="navbar-dark"', 'class="bg-dark"', 'style="dark"'],
      why: "Oltinchi versiyada qora satr data-bs-theme=\"dark\" bilan yoziladi, bu saytdagi Dark navbar bo'limida. navbar-dark va bg-dark beshinchi versiyaning eski nomlari, oltinchisida ishlamaydi.",
    },
    ru: {
      ctx: 'Строка меню тёмная, надписи светлые.',
      q: 'Что написано у тега nav?',
      opts: ['data-bs-theme="dark"', 'class="navbar-dark"', 'class="bg-dark"', 'style="dark"'],
      why: 'В шестой версии тёмная строка — это data-bs-theme="dark", раздел Dark navbar на сайте. navbar-dark и bg-dark — старые имена из 5-й версии, в 6-й не работают.',
    },
    en: {
      ctx: 'The menu bar is dark with light labels.',
      q: 'What is written on the nav tag?',
      opts: ['data-bs-theme="dark"', 'class="navbar-dark"', 'class="bg-dark"', 'style="dark"'],
      why: 'In version six a dark bar is data-bs-theme="dark", the Dark navbar section of the site. navbar-dark and bg-dark are old version 5 names; they don’t work in version 6.',
    },
  },
  {
    id: 'bootstrap_l07_q06',
    difficulty: 'hard',
    tags: ['old-name', 'expand'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Eski darslikda: class=\"navbar navbar-expand-lg\". Havolalar 1024 pikseldan qatorga chiqishi kerak.",
      q: "Oltinchi versiyada qanday yoziladi?",
      opts: ['lg:navbar-expand', 'navbar-expand:lg', 'lg-navbar-expand', 'navbar-lg'],
      why: "Oltinchi versiyada ekran o'lchami oldinda, ikki nuqta bilan: lg:navbar-expand. Xuddi lg:col-4 kabi. lg — 1024 piksel, md — 768 piksel.",
    },
    ru: {
      ctx: 'В старом учебнике: class="navbar navbar-expand-lg". Ссылки должны вставать в ряд с 1024 пикселей.',
      q: 'Как это пишется в шестой версии?',
      opts: ['lg:navbar-expand', 'navbar-expand:lg', 'lg-navbar-expand', 'navbar-lg'],
      why: 'В шестой версии размер экрана впереди, через двоеточие: lg:navbar-expand. Как в lg:col-4. lg — 1024 пикселя, md — 768.',
    },
    en: {
      ctx: 'An old tutorial says class="navbar navbar-expand-lg". The links should line up from 1024 pixels.',
      q: 'How is it written in version six?',
      opts: ['lg:navbar-expand', 'navbar-expand:lg', 'lg-navbar-expand', 'navbar-lg'],
      why: 'In version six the screen size comes first, with a colon: lg:navbar-expand. Just like lg:col-4. lg is 1024 pixels, md is 768.',
    },
  },
  {
    id: 'bootstrap_l07_q07',
    difficulty: 'medium',
    tags: ['active', 'nav-link'],
    mono: true,
    sort: false,
    vis: { code: L3c((i) => `<ul class="nav navbar-nav">\n  <li class="nav-item">\n    <a class="nav-link ___" href="#">${W.home[i]}</a>\n  </li>\n  <li class="nav-item">\n    <a class="nav-link" href="#">${W.menu[i]}</a>\n  </li>\n</ul>`) },
    uz: {
      ctx: "Mehmon hozir Asosiy sahifada. Bu havola boshqalardan yorqinroq turishi kerak.",
      q: "Bo'sh joyga nima yoziladi?",
      opts: ['active', 'current', 'selected', 'open'],
      why: "active ochiq sahifa havolasini ajratadi, xuddi xaritadagi «siz shu yerdasiz» belgisi. U nav-link yoniga yoziladi. current, selected va open so'zlarini Bootstrap bilmaydi.",
    },
    ru: {
      ctx: 'Гость сейчас на странице «Главная». Эта ссылка должна быть ярче остальных.',
      q: 'Что пишется на пустое место?',
      opts: ['active', 'current', 'selected', 'open'],
      why: 'active выделяет ссылку открытой страницы, как метка «ты здесь» на карте. Пишется рядом с nav-link. Слов current, selected и open Bootstrap не знает.',
    },
    en: {
      ctx: 'The visitor is on the Home page now. That link should stand out brighter than the others.',
      q: 'What goes in the empty spot?',
      opts: ['active', 'current', 'selected', 'open'],
      why: 'active marks the open page’s link, like a “you are here” map pin. It goes next to nav-link. Bootstrap doesn’t know current, selected or open.',
    },
  },
  {
    id: 'bootstrap_l07_q08',
    difficulty: 'easy',
    tags: ['pagination'],
    mono: true,
    sort: false,
    vis: { code: L3c(pagCode({ ul: '___ justify-content-center' })), page: L3c(pag()), vw: 360 },
    uz: {
      ctx: "Kafe taomlari uch sahifaga bo'lingan. Raqamlar bir qatorda, tugmachalardek turishi kerak.",
      q: "ul tegiga qaysi so'z kerak? (yonida justify-content-center ham bor)",
      opts: ['pagination', 'page-item', 'page-link', 'navbar-nav'],
      why: "pagination raqamlarni bir qatorga, yopishgan tugmachalarga aylantiradi. page-item li tegiga, page-link a tegiga yoziladi. navbar-nav esa menyu satri havolalari uchun.",
    },
    ru: {
      ctx: 'Блюда кафе разбиты на три страницы. Номера должны стоять в один ряд, как кнопочки.',
      q: 'Какое слово нужно тегу ul? (рядом уже есть justify-content-center)',
      opts: ['pagination', 'page-item', 'page-link', 'navbar-nav'],
      why: 'pagination ставит номера в один ряд сомкнутыми кнопочками. page-item пишут тегу li, page-link — тегу a. А navbar-nav — для ссылок строки меню.',
    },
    en: {
      ctx: 'The cafe’s dishes are split into three pages. The numbers should sit in one row like little buttons.',
      q: 'Which word does the ul tag need? (justify-content-center is already there)',
      opts: ['pagination', 'page-item', 'page-link', 'navbar-nav'],
      why: 'pagination puts the numbers in one row of joined buttons. page-item goes on the li tag, page-link on the a tag. navbar-nav is for the menu bar’s links.',
    },
  },
  {
    id: 'bootstrap_l07_q09',
    difficulty: 'medium',
    tags: ['pagination', 'active'],
    mono: false,
    sort: false,
    vis: { page: L3c(pag({ act: 2 })), vw: 360 },
    uz: {
      ctx: "Raqamlarda 2 ko'k: mehmon 2-sahifada. Saytdagi Active misolida active so'zi bitta tegda turibdi.",
      q: "active qaysi tegga yoziladi?",
      opts: ["2-raqamning li tegiga, page-item yoniga", "ul tegiga, pagination yoniga", "Hamma li teglariga birdaniga", "a tegiga, page-link o'rniga"],
      why: "Saytdagi misolda active ochiq sahifaning li tegida: page-item active. ul-ga yozilsa, hech bir raqam ajralmaydi, page-link-ni o'chirsa esa raqam tugmachaligini yo'qotadi.",
    },
    ru: {
      ctx: 'В номерах 2 — синяя: гость на странице 2. В примере Active на сайте слово active стоит у одного тега.',
      q: 'Какому тегу пишут active?',
      opts: ['Тегу li номера 2, рядом с page-item', 'Тегу ul, рядом с pagination', 'Всем тегам li сразу', 'Тегу a вместо page-link'],
      why: 'В примере сайта active стоит у тега li открытой страницы: page-item active. У ul ни один номер не выделится, а без page-link номер перестанет быть кнопочкой.',
    },
    en: {
      ctx: 'Number 2 is blue: the visitor is on page 2. In the site’s Active example the word active sits on one tag.',
      q: 'Which tag gets active?',
      opts: ['The li of number 2, next to page-item', 'The ul tag, next to pagination', 'All the li tags at once', 'The a tag, instead of page-link'],
      why: 'In the site example active sits on the open page’s li tag: page-item active. On the ul no number stands out, and without page-link the number stops being a button.',
    },
  },
  {
    id: 'bootstrap_l07_q10',
    difficulty: 'hard',
    tags: ['data-bs-target', 'drawer'],
    mono: true,
    sort: false,
    vis: { code: L3c(navCode({ target: '___' })) },
    uz: {
      ctx: "☰ tugmasi bosilganda id si menyu bo'lgan quti chiqishi kerak.",
      q: "data-bs-target-ga nima yoziladi?",
      opts: ['#menyu', 'menyu', '.menyu', 'drawer'],
      why: "id-ga ishora qilganda oldiga panjara qo'yiladi: #menyu, xuddi CSS-dagidek. Panjarasiz yoki nuqta bilan tugma qutini topmaydi, drawer esa qutining class-i.",
    },
    ru: {
      ctx: 'По нажатию ☰ должен выезжать ящик с id menyu.',
      q: 'Что пишется в data-bs-target?',
      opts: ['#menyu', 'menyu', '.menyu', 'drawer'],
      why: 'Когда указываешь на id, впереди ставится решётка: #menyu, как в CSS. Без решётки или с точкой кнопка не найдёт ящик, а drawer — это class ящика.',
    },
    en: {
      ctx: 'Tapping ☰ should slide out the drawer whose id is menyu.',
      q: 'What goes in data-bs-target?',
      opts: ['#menyu', 'menyu', '.menyu', 'drawer'],
      why: 'Pointing to an id needs a hash in front: #menyu, as in CSS. Without the hash or with a dot the button won’t find the drawer, and drawer is the drawer’s class.',
    },
  },
  {
    id: 'bootstrap_l07_q11',
    difficulty: 'medium',
    tags: ['site', 'copy-adapt'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Saytdan Navbar namunasini nusxalab qo'ydingiz. Unda Navbar, Home va Link so'zlari bor.",
      q: "Endi nima qilasiz?",
      opts: ["Yozuvlarni o'z nom va bo'limlarimga almashtiraman", "class lardagi navbar so'zlarini o'chiraman", "drawer qatorlarini butunlay o'chiraman", "Hech narsani o'zgartirmayman"],
      why: "Namunadagi yozuvlar faqat misol: ularni o'zingizniki bilan almashtirasiz. class-lar va drawer esa menyu satrini ishlatadi, ularni o'chirsangiz, satr buziladi.",
    },
    ru: {
      ctx: 'Ты вставил пример Navbar с сайта. В нём слова Navbar, Home и Link.',
      q: 'Что делаешь дальше?',
      opts: ['Меняю надписи на название и разделы', 'Удаляю слова navbar из всех class', 'Полностью удаляю строки с drawer', 'Ничего не меняю, оставляю как есть'],
      why: 'Надписи в примере — только образец: их меняют на свои. А class и drawer заставляют строку меню работать; если их удалить, строка сломается.',
    },
    en: {
      ctx: 'You pasted the Navbar example from the site. It has the words Navbar, Home and Link.',
      q: 'What do you do next?',
      opts: ['Swap the labels for the name and sections', 'Delete the navbar words from every class', 'Remove the drawer lines completely', 'Change nothing and leave it as is'],
      why: 'The labels in the example are only samples: you replace them with your own. The classes and drawer make the menu bar work; delete them and the bar breaks.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'bootstrap_l07_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['navbar-brand'],
    mono: true,
    answer: ['navbar-brand'],
    vis: { code: L3c(navCode({ brand: '___' })) },
    uz: {
      ctx: "Kafe nomi menyu satrida oddiy havoladek kichik. U logotipdek katta va qalin bo'lsin.",
      q: "Nomning class-iga bitta so'z yozing.",
      why: "navbar-brand sayt nomini menyu satrida katta va qalin qiladi. Havolalarga esa nav-link yoziladi.",
    },
    ru: {
      ctx: 'Название кафе в строке меню мелкое, как обычная ссылка. Пусть будет крупным и жирным, как логотип.',
      q: 'Впиши одно слово в class названия.',
      why: 'navbar-brand делает название сайта в строке меню крупным и жирным. А ссылкам пишут nav-link.',
    },
    en: {
      ctx: 'The cafe name in the menu bar is small like an ordinary link. Make it big and bold like a logo.',
      q: 'Type one word in the name’s class.',
      why: 'navbar-brand makes the site name in the menu bar big and bold. The links get nav-link.',
    },
  },
  {
    id: 'bootstrap_l07_q13',
    type: 'input',
    difficulty: 'easy',
    tags: ['nav-link'],
    mono: true,
    answer: ['nav-link'],
    vis: { code: L3c((i) => `<ul class="nav navbar-nav">\n  <li class="nav-item">\n    <a class="nav-link" href="#">${W.home[i]}</a></li>\n  <li class="nav-item">\n    <a class="___" href="#">${W.menu[i]}</a></li>\n  <li class="nav-item">\n    <a class="nav-link" href="#">${W.map[i]}</a></li>\n</ul>`) },
    uz: {
      ctx: "Ikkinchi havola ko'k va tagiga chizilgan, boshqalariga o'xshamaydi.",
      q: "Uning class-iga bitta so'z yozing.",
      why: "Menyu satrining har bir havolasiga nav-link yoziladi: u chiziqni olib tashlaydi va havolaga menyu rangini beradi. nav-item esa li tegida.",
    },
    ru: {
      ctx: 'Вторая ссылка синяя и подчёркнутая, не похожа на остальные.',
      q: 'Впиши одно слово в её class.',
      why: 'Каждой ссылке строки меню пишут nav-link: он убирает подчёркивание и даёт цвет меню. А nav-item — у тега li.',
    },
    en: {
      ctx: 'The second link is blue and underlined, unlike the others.',
      q: 'Type one word in its class.',
      why: 'Every menu bar link gets nav-link: it removes the underline and gives it the menu color. nav-item is on the li tag.',
    },
  },
  {
    id: 'bootstrap_l07_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['page-link'],
    mono: true,
    answer: ['page-link'],
    vis: { code: L3c(pagCode({ a: [null, '___', null] })) },
    uz: {
      ctx: "2 raqami tugmacha emas, oddiy ko'k havola bo'lib qoldi.",
      q: "Uning a tegiga bitta so'z yozing.",
      why: "Raqamlar a tegiga page-link yoziladi: u raqamni ramkali tugmachaga aylantiradi. page-item li tegiga, pagination esa ul tegiga.",
    },
    ru: {
      ctx: 'Номер 2 не кнопочка, а простая синяя ссылка.',
      q: 'Впиши одно слово для его тега a.',
      why: 'Тегу a номера пишут page-link: он делает номер кнопочкой в рамке. page-item — тегу li, а pagination — тегу ul.',
    },
    en: {
      ctx: 'Number 2 isn’t a little button, just a plain blue link.',
      q: 'Type one word for its a tag.',
      why: 'The number’s a tag gets page-link: it turns the number into a framed button. page-item goes on li, and pagination on ul.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l07_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['md:navbar-expand'],
    pieces: ['md', ':', 'navbar-expand'],
    extra: ['-', 'navbar-expand-md', 'navbar-dark'],
    vis: { code: L3c((i) => `<nav class="navbar ___ bg-1">\n  <div class="container-fluid">\n    <a class="navbar-brand" href="#">${W.cafe[i]}</a>\n    …\n  </div>\n</nav>`) },
    uz: {
      ctx: "Havolalar 768 pikseldan keng ekranda qatorga chiqsin, torroqda ☰ ortiga yashirinsin.",
      q: "Bo'laklarni bosib, so'zni yig'ing",
      why: "Oldin ekran o'lchami md, keyin ikki nuqta, keyin navbar-expand. navbar-expand-md va navbar-dark beshinchi versiyaning eski nomlari.",
    },
    ru: {
      ctx: 'Ссылки встают в ряд на экране шире 768 пикселей, а на более узком прячутся за ☰.',
      q: 'Нажимай кусочки и собери слово',
      why: 'Сначала размер экрана md, потом двоеточие, потом navbar-expand. navbar-expand-md и navbar-dark — старые имена из 5-й версии.',
    },
    en: {
      ctx: 'The links line up on screens wider than 768 pixels and hide behind ☰ on narrower ones.',
      q: 'Tap the pieces to build the word',
      why: 'First the screen size md, then a colon, then navbar-expand. navbar-expand-md and navbar-dark are old version 5 names.',
    },
  },
  {
    id: 'bootstrap_l07_q16',
    type: 'build',
    difficulty: 'medium',
    tags: ['pagination', 'active'],
    pieces: ['<li', ' class="page-item', ' active"', '>'],
    extra: [' page-link"', ' class="pagination"'],
    vis: { code: L3c(() => `<ul class="pagination">\n  <li class="page-item">\n    <a class="page-link" href="#">1</a></li>\n  ___\n    <a class="page-link" href="#">2</a></li>\n</ul>`) },
    uz: {
      ctx: "Mehmon 2-sahifada. Saytdagi Active misolidagidek, 2 raqami ko'k bo'lsin.",
      q: "Bo'laklarni bosib, 2 raqamining li tegini yig'ing",
      why: "Saytdagi misolda active ochiq sahifaning li tegida, page-item yonida turadi. pagination esa ul uchun.",
    },
    ru: {
      ctx: 'Гость на странице 2. Как в примере Active на сайте, номер 2 должен быть синим.',
      q: 'Нажимай кусочки и собери тег li номера 2',
      why: 'В примере сайта active стоит у тега li открытой страницы, рядом с page-item. А pagination — для ul.',
    },
    en: {
      ctx: 'The visitor is on page 2. Like the site’s Active example, number 2 should be blue.',
      q: 'Tap the pieces to build the li tag for number 2',
      why: 'In the site example active sits on the open page’s li tag, next to page-item. pagination is for the ul.',
    },
  },
  {
    id: 'bootstrap_l07_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['data-bs-target', 'hash'],
    line: 5,
    vis: { code: L3c((i) => `<nav class="navbar md:navbar-expand bg-1"\n  data-bs-theme="dark">\n  <a class="navbar-brand" href="#">${W.cafe[i]}</a>\n  <button class="navbar-toggler" data-bs-toggle="drawer"\n    data-bs-target="menyu">☰</button>\n  <dialog class="drawer" id="menyu">…</dialog>\n</nav>`) },
    uz: {
      ctx: "Telefonda ☰ bosilganda quti chiqmayapti. script qatori joyida.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "5-qatorda data-bs-target=\"menyu\" panjarasiz yozilgan, shuning uchun tugma qutini topmaydi. To'g'risi: #menyu.",
    },
    ru: {
      ctx: 'На телефоне по нажатию ☰ ящик не выезжает. Строка script на месте.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 5 data-bs-target="menyu" написан без решётки, поэтому кнопка не находит ящик. Правильно: #menyu.',
    },
    en: {
      ctx: 'On a phone tapping ☰ doesn’t slide out the drawer. The script line is in place.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 5 has data-bs-target="menyu" without a hash, so the button can’t find the drawer. Correct: #menyu.',
    },
  },
  {
    id: 'bootstrap_l07_q18',
    type: 'tap',
    difficulty: 'easy',
    tags: ['active', 'nav-link'],
    answer: 'b',
    vis: { page: L3c(nav({ links: ['nav-link', 'nav-link active', 'nav-link'], t: { brand: 'a', l0: 'c', l1: 'b', l2: 'd' } })), vw: 800 },
    uz: {
      ctx: "Menyu satrida kafe nomi va uchta havola.",
      q: 'Qaysi havolada active bor? Ustiga bosing',
      why: "active havolani yorqinroq qiladi: mehmon hozir shu sahifada. Qolgan havolalar xiraroq, kafe nomi esa navbar-brand.",
    },
    ru: {
      ctx: 'В строке меню — название кафе и три ссылки.',
      q: 'У какой ссылки active? Нажми на неё',
      why: 'active делает ссылку ярче: гость сейчас на этой странице. Остальные ссылки бледнее, а название кафе — navbar-brand.',
    },
    en: {
      ctx: 'The menu bar has the cafe name and three links.',
      q: 'Which link has active? Tap it',
      why: 'active makes a link brighter: the visitor is on that page now. The other links are dimmer, and the cafe name is navbar-brand.',
    },
  },
];
