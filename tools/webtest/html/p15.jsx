// =============================================================================
// ТЕСТЫ К УРОКУ 15 (часть 1 урока 8 курса HTML) «Части сайта: header, nav, main, footer» (27.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: header — видимый верх (не head); меню — в nav; footer — низ с правами и контактами; порядок header → main → footer;
// теги не меняют вид, их понимают программы и поисковики. Вопросы 1, 2, 4, 5 — прежние из l08.jsx, вопрос 3 — новый.
// Словарь урока 8: sayt boshi, asosiy qism, sayt oxiri, qidiruv tizimi. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'struktura-sajta';
const QS = [
  { id: 'html-08q1t1', target: 'html-08q1', ptype: 'HTML', tag: 'header', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const h = `<head>\n  <title>${T('Kodi maktabi', 'Школа Коди', 'Kodi school')}</title>\n</head>\n<body>\n  <___>\n    <h1>${T('Kodi maktabi', 'Школа Коди', 'Kodi school')}</h1>\n  </___>\n</body>`; return <WqVis code={h} mark={[5, 7]} />; },
    uz: { ctx: "Sahifaning tepasida, hamma ko'radigan joyda sayt nomi tursin.", q: "Bo'sh joylarga qaysi teg yoziladi?", opts: ['head', 'header', 'title', 'footer'],
      ok: "To'ppa-to'g'ri! header — saytning ko'rinadigan boshi. head esa ko'rinmaydigan ma'lumotlar uchun, u body tegidan tashqarida turadi.", hint: "head va header — bir xil teg emas. Qaysi biri body ichida, ko'rinadigan joyda turadi?", alt: "body ichida tegi bo'sh kod" },
    ru: { ctx: 'Пусть вверху страницы, на виду у всех, стоит название сайта.', q: 'Какой тег пишется на пустые места?', opts: ['head', 'header', 'title', 'footer'],
      ok: 'Верно! header — видимый верх сайта. А head — для невидимых сведений, он стоит вне body.', hint: 'head и header — не один тег. Какой из них стоит внутри body, на виду?', alt: 'Код с пустым тегом внутри body' },
    en: { ctx: 'The site name should sit at the top of the page, where everyone sees it.', q: 'Which tag goes in the empty spots?', opts: ['head', 'header', 'title', 'footer'],
      ok: 'Right! header is the visible top of the site. head is for invisible info and sits outside body.', hint: 'head and header aren’t the same tag. Which one goes inside body, where it’s visible?', alt: 'Code with an empty tag inside body' } },
  { id: 'html-08q1t2', target: 'html-08q1', ptype: 'HTML', tag: 'nav', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<header>\n  <h1>${T('Kodi maktabi', 'Школа Коди', 'Kodi school')}</h1>\n  <___>\n    <a href="darslar.html">${T('Darslar', 'Уроки', 'Lessons')}</a>\n    <a href="ustozlar.html">${T('Ustozlar', 'Учителя', 'Teachers')}</a>\n  </___>\n</header>`} mark={[3, 6]} />; },
    uz: { ctx: "Sayt boshida bo'limlarga olib boradigan havolalar turibdi.", q: "Ularni qaysi teg bilan o'raymiz?", opts: ['nav', 'main', 'footer', 'section'],
      ok: "Qoyil! nav — navigation so'zidan, ya'ni menyu degani: sayt bo'ylab yuradigan havolalar shu yerda turadi.", hint: "Bu havolalar nima: sayt menyusimi yoki asosiy matnmi? Menyu uchun qaysi teg edi?", alt: "Havolalari tegi bo'sh o'ralgan kod" },
    ru: { ctx: 'В шапке сайта стоят ссылки на разделы.', q: 'Каким тегом их обернуть?', opts: ['nav', 'main', 'footer', 'section'],
      ok: 'Здорово! nav — от слова navigation, то есть меню: здесь живут ссылки для прогулки по сайту.', hint: 'Что это за ссылки: меню сайта или главный текст? Какой тег был для меню?', alt: 'Код, где ссылки обёрнуты пустым тегом' },
    en: { ctx: 'The site header has links to the sections.', q: 'Which tag should wrap them?', opts: ['nav', 'main', 'footer', 'section'],
      ok: 'Nice work! nav comes from navigation, meaning the menu: links for moving around the site live here.', hint: 'What are these links: the site menu or the main text? Which tag was for the menu?', alt: 'Code where links are wrapped in an empty tag' } },
  { id: 'html-08q1t3', target: 'html-08q1', ptype: 'HTML', tag: 'footer', correct: 2,
    vis: (L) => { const T = aqL(L); const h = `<footer>\n  <p>© 2026 ${T('Kodi maktabi', 'Школа Коди', 'Kodi school')}</p>\n  <p>${T('Telefon', 'Телефон', 'Phone')}: 123-45-67</p>\n</footer>`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "Saytning eng pastida kichkina yozuv turibdi: yil, sayt nomi va telefon raqami.", q: "Odatda footer ichiga nimani yozishadi?", opts: ["Bosh sarlavha va menyu", "Darslar va narxlar matni", "Mualliflik huquqi, aloqa", "Sahifaning yashirin ma'lumoti"],
      ok: "To'g'ri! footer — sayt oxiri: odatda u yerda mualliflik huquqi, telefon yoki pochta turadi.", hint: "Biror saytning eng pastiga bir qarab ko'ring: u yerda odatda nima yozib qo'yilgan bo'ladi?", alt: "Sayt oxiri tegi va uning ko'rinishi" },
    ru: { ctx: 'Внизу сайта стоит маленькая подпись: год, название сайта и телефон.', q: 'Что обычно пишут внутри footer?', opts: ['Главный заголовок и меню сайта', 'Основной текст про уроки и цены', 'Авторские права и контакты', 'Невидимые сведения о странице'],
      ok: 'Верно! footer — низ сайта: обычно там авторские права, телефон или почта.', hint: 'Загляни в самый низ любого сайта: что там обычно написано?', alt: 'Тег низа сайта и его вид' },
    en: { ctx: 'At the very bottom of the site there’s a small line: the year, the site name and a phone number.', q: 'What do people usually write inside footer?', opts: ['The main heading and the site menu', 'The main text about lessons and prices', 'Copyright and contact details', 'Invisible information about the page'],
      ok: 'Right! footer is the bottom of the site: it usually holds the copyright, a phone or an email.', hint: 'Look at the very bottom of any site: what is usually written there?', alt: 'The bottom-of-the-site tag and how it looks' } },
  { id: 'html-08q1t4', target: 'html-08q1', ptype: 'HTML', tag: 'tartib', correct: 3, mono: true,
    uz: { ctx: "body ichida saytning uchta qismi bor.", q: "Ular qaysi tartibda keladi?", opts: ['footer → main → header', 'main → header → footer', 'header → footer → main', 'header → main → footer'],
      ok: "Xuddi shunday! Tepada sayt boshi header, o'rtada asosiy qism main, eng pastda sayt oxiri footer.", hint: "Brauzer sahifani tepadan pastga o'qiydi. Sayt boshi qayerda, sayt oxiri qayerda bo'ladi?", alt: "Uch qismning to'rtta tartibi" },
    ru: { ctx: 'Внутри body три части сайта.', q: 'В каком порядке они идут?', opts: ['footer → main → header', 'main → header → footer', 'header → footer → main', 'header → main → footer'],
      ok: 'Именно! Вверху — шапка header, в середине — главная часть main, в самом низу — подвал footer.', hint: 'Браузер читает страницу сверху вниз. Где у сайта верх, а где низ?', alt: 'Четыре порядка трёх частей' },
    en: { ctx: 'There are three parts of a site inside body.', q: 'In what order do they go?', opts: ['footer → main → header', 'main → header → footer', 'header → footer → main', 'header → main → footer'],
      ok: 'Exactly! At the top is header, in the middle is main, and at the very bottom is footer.', hint: 'The browser reads a page top to bottom. Where is the top of a site, and where is the bottom?', alt: 'Four orders of three parts' } },
  { id: 'html-08q1t5', target: 'html-08q1', ptype: 'HTML', tag: 'nega', correct: 1,
    vis: (L) => { const T = aqL(L); const h = `<header><h1>${T('Kodi maktabi', 'Школа Коди', 'Kodi school')}</h1></header>\n<main><p>${T('Bizda dasturlash darslari.', 'У нас уроки программирования.', 'We teach coding.')}</p></main>\n<footer><p>© 2026</p></footer>`; return <WqVis code={h} html={h} />; },
    uz: { ctx: "header, main va footer qo'shildi, lekin sahifa umuman o'zgarmadi.", q: "Unda bu teglar nimaga kerak?", opts: ["Sahifa rangli va chiroyli bo'ladi", 'Dasturlar sayt qismlarini taniydi', 'Sahifa ikki barobar tez ochiladi', "Matn o'z-o'zidan kattalashadi"],
      ok: "To'ppa-to'g'ri! Ekrandan o'qib beruvchi dastur va qidiruv tizimi qaysi qism nima ekanini biladi. Ko'rinishni esa CSS beradi.", hint: "Sahifada nima o'zgardi? Hech narsa. Demak, bu teglar ko'z uchun emas. Ularni yana kim o'qiydi?", alt: "Oddiy ko'rinishdagi sahifa va uning kodi" },
    ru: { ctx: 'Добавили header, main и footer, а страница совсем не изменилась.', q: 'Зачем тогда эти теги?', opts: ['Страница станет яркой и красивой', 'Программы узнают части сайта', 'Страница откроется вдвое быстрее', 'Текст сам станет крупнее'],
      ok: 'Верно! Программа чтения с экрана и поисковик понимают, какая часть что значит. А вид даёт CSS.', hint: 'Что изменилось на странице? Ничего. Значит, эти теги не для глаз. Кто ещё их читает?', alt: 'Простая страница и её код' },
    en: { ctx: 'We added header, main and footer, but the page didn’t change at all.', q: 'Then what are these tags for?', opts: ['The page gets bright and pretty', 'Programs recognize the site parts', 'The page opens twice as fast', 'The text gets bigger by itself'],
      ok: 'Right! A screen reader and a search engine know which part is which. The look comes from CSS.', hint: 'What changed on the page? Nothing. So these tags aren’t for the eyes. Who else reads them?', alt: 'A plain page and its code' } }
];
