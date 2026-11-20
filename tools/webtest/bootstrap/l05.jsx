// =============================================================================
// ТЕСТЫ К УРОКУ 5 МОДУЛЯ BOOTSTRAP «Карточки» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: рамку и углы даёт card; отступы внутри — card-body (card-title и card-text в CSS 6.0 правил не имеют);
// после копирования примера src="..." надо заменить именем файла; цвет карточки — card theme-*; ряд карточек — d-flex gap-*.
// Страница — честная (bs={BS_CSS}). Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'kartochki';
const b5Card = (T, o) => [
  `<section class="${o.card || 'card'}" style="max-width: 240px">`,
  ...(o.img === false ? [] : [`  <img src="${o.src || 'robot1.jpg'}" class="card-img-top" alt="${T('Robot', 'Робот', 'Robot')}">`]),
  ...(o.body === false
    ? [`  <h4>${T('Robo-futbol', 'Робофутбол', 'Robo-football')}</h4>`, `  <p>${T('Shanba, 10:00', 'Суббота, 10:00', 'Saturday, 10:00')}</p>`]
    : ['  <div class="card-body">', `    <h4 class="card-title">${T('Robo-futbol', 'Робофутбол', 'Robo-football')}</h4>`, ...(o.text === false ? [] : [`    <p class="card-text">${T('Shanba, 10:00', 'Суббота, 10:00', 'Saturday, 10:00')}</p>`]), '  </div>']),
  '</section>'].join('\n');
const QS = [
  { id: 'bootstrap-05t1', target: 'bootstrap-05', ptype: 'Bootstrap', tag: 'card', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const src = b5Card(T, { img: false }); return <WqVis code={src} html={src} bs={BS_CSS} />; },
    uz: { ctx: "Kartochkaning atrofida ramka bor, burchaklari yumaloq.", q: "Ramka va yumaloq burchaklarni qaysi class beradi?", opts: ['card-body', 'card', 'card-title', 'card-text'],
      ok: "Qoyil! card — kartochkaning o'zi: ramka, burchaklar va fon. card-body esa ichidagi bo'sh joyni beradi.", hint: "Ramka butun kartochka atrofida. Kodning qaysi tegi butun kartochkani o'rab turibdi?", alt: "Ramkali kartochka va uning kodi" },
    ru: { ctx: 'Вокруг карточки рамка, углы скруглены.', q: 'Какой class даёт рамку и скруглённые углы?', opts: ['card-body', 'card', 'card-title', 'card-text'],
      ok: 'Здорово! card — сама карточка: рамка, углы и фон. А card-body даёт отступы внутри.', hint: 'Рамка идёт вокруг всей карточки. Какой тег в коде обнимает всю карточку?', alt: 'Карточка с рамкой и её код' },
    en: { ctx: 'The card has a border and rounded corners.', q: 'Which class gives the border and rounded corners?', opts: ['card-body', 'card', 'card-title', 'card-text'],
      ok: 'Nice work! card is the card itself: border, corners and background. card-body gives the space inside.', hint: 'The border goes around the whole card. Which tag in the code wraps the whole card?', alt: 'A bordered card and its code' } },
  { id: 'bootstrap-05t2', target: 'bootstrap-05', ptype: 'Bootstrap', tag: 'card-body', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const src = b5Card(T, { body: false }); return <WqVis code={src} html={src} bs={BS_CSS} />; },
    uz: { ctx: "Kartochkadagi yozuvlar chetga yopishib qoldi.", q: "Qaysi class bilan o'ralgan div yetishmayapti?", opts: ['card-title', 'card-text', 'card-img-top', 'card-body'],
      ok: "To'ppa-to'g'ri! card-body yozuvlarni o'rab, ularga ichki bo'sh joy beradi. card-title va card-text esa faqat nom: Bootstrap 6 da ularning qoidasi yo'q.", hint: "Rasm ham chetga taqaladi, demak gap yozuvlarda. Darsda yozuvlarni qaysi div o'rab turar edi?", alt: "Yozuvlari chetga yopishgan kartochka" },
    ru: { ctx: 'Надписи в карточке прилипли к краю.', q: 'Какого div с class не хватает вокруг надписей?', opts: ['card-title', 'card-text', 'card-img-top', 'card-body'],
      ok: 'Верно! card-body обнимает надписи и даёт им отступ внутри. А card-title и card-text — просто имена: в Bootstrap 6 правил у них нет.', hint: 'Картинка и должна касаться краёв, значит, дело в надписях. Какой div в уроке обнимал надписи?', alt: 'Карточка с прилипшими к краю надписями' },
    en: { ctx: 'The text in the card is stuck to the edge.', q: 'Which class is missing on a div around the text?', opts: ['card-title', 'card-text', 'card-img-top', 'card-body'],
      ok: 'Right! card-body wraps the text and gives it space inside. card-title and card-text are just names: Bootstrap 6 has no rules for them.', hint: 'The picture is meant to touch the edges, so the text is the problem. Which div wrapped the text in the lesson?', alt: 'A card with text stuck to the edge' } },
  { id: 'bootstrap-05t3', target: 'bootstrap-05', ptype: 'Bootstrap', tag: 'src', correct: 0,
    vis: (L) => { const T = aqL(L); const src = b5Card(T, { src: '...', text: false }); return <WqVis code={src} html={src} bs={BS_CSS} mark={[2]} />; },
    uz: { ctx: "Kartochka saytdan nusxalandi. Rasm o'rnida singan belgi turibdi.", q: 'Nimani tuzatish kerak?', opts: ["src ichidagi ... o'rniga rasm fayli nomini", "alt ichiga rasm faylining nomini yozish", "card-img-top so'zini class-dan o'chirish", "img tegini card-body ichiga ko'chirish"],
      ok: "Xuddi shunday! Saytdagi namunada src=\"...\" — bu bo'sh joy. O'rniga o'z faylingiz nomini yozasiz, masalan robot1.jpg.", hint: "Belgilangan qatordagi src-ga qarang. Brauzer ... degan faylni topa oladimi?", alt: "Rasmi singan kartochka" },
    ru: { ctx: 'Карточку скопировали с сайта. На месте картинки — значок сломанной картинки.', q: 'Что нужно исправить?', opts: ['Вместо ... в src написать имя файла', 'Написать имя файла картинки в alt', 'Убрать слово card-img-top из class', 'Перенести тег img внутрь card-body'],
      ok: 'Именно! В примере на сайте src="..." — это пустое место. Вместо него пишут имя своего файла, например robot1.jpg.', hint: 'Посмотрите на src в выделенной строке. Найдёт ли браузер файл с именем ...?', alt: 'Карточка со сломанной картинкой' },
    en: { ctx: 'The card was copied from the site. There’s a broken image icon instead of the picture.', q: 'What must be fixed?', opts: ['Replace ... in src with the file name', 'Put the file name in alt', 'Remove card-img-top from class', 'Move img inside card-body'],
      ok: 'Exactly! In the site example src="..." is a blank to fill. You write your own file name there, for example robot1.jpg.', hint: 'Look at src in the marked line. Can the browser find a file called ...?', alt: 'A card with a broken picture' } },
  { id: 'bootstrap-05t4', target: 'bootstrap-05', ptype: 'Bootstrap', tag: 'card-theme', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); const code = b5Card(T, { card: 'card ___', img: false }); const page = b5Card(T, { card: 'card theme-success', img: false }); return <WqVis code={code} html={page} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Kartochka o'ngdagidek yashil bo'lishi kerak.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['card-success', 'bg-card-success', 'theme-success', 'btn-success'],
      ok: "Juda zo'r! Kartochka rangi tugma va e'londagi kabi theme so'zi bilan beriladi: card theme-success.", hint: "2-darsda tugma va e'lon rangini qaysi so'zlar oilasi bergan edi? Kartochkada ham o'sha oila.", alt: "Yashil kartochka" },
    ru: { ctx: 'Карточка должна стать зелёной, как справа.', q: 'Какое слово пишется на пустое место?', opts: ['card-success', 'bg-card-success', 'theme-success', 'btn-success'],
      ok: 'Отлично! Цвет карточки задаётся, как у кнопки и объявления, словом theme: card theme-success.', hint: 'Какая семья слов давала цвет кнопке и объявлению в уроке 2? У карточки — та же.', alt: 'Зелёная карточка' },
    en: { ctx: 'The card should be green, like on the right.', q: 'Which word goes in the empty spot?', opts: ['card-success', 'bg-card-success', 'theme-success', 'btn-success'],
      ok: 'Great! A card’s color is set like a button’s or an alert’s, with a theme word: card theme-success.', hint: 'Which word family colored buttons and alerts in lesson 2? Cards use the same one.', alt: 'A green card' } },
  { id: 'bootstrap-05t5', target: 'bootstrap-05', ptype: 'Bootstrap', tag: 'card-row', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const c = (t) => `<section class="card"><div class="card-body">${t}</div></section>`; const kids = [c(T('Robo-futbol', 'Робофутбол', 'Robo-football')), c(T('Sumo', 'Сумо', 'Sumo')), c(T('Labirint', 'Лабиринт', 'Maze'))]; return <WqVis code={b5Wrap('___', kids.map(() => '<section class="card">…</section>'))} html={b5Wrap('d-flex gap-5', kids)} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Uchta kartochka o'ngdagidek yonma-yon, orasida bo'sh joy bilan turishi kerak.", q: "Ota div-ning class-iga nima yoziladi?", opts: ['card-group-row', 'd-flex gap-5', 'd-flex card-row', 'row card-group'],
      ok: "Qoyil! Kartochkalarni qatorga 4-darsdagi d-flex qo'yadi, gap-5 esa ular orasini ochadi.", hint: "4-darsni eslang: elementlarni yonma-yon nima qo'yadi va ular orasidagi bo'sh joyni nima beradi?", alt: "Yonma-yon turgan uchta kartochka" },
    ru: { ctx: 'Три карточки — в ряд с промежутками, как справа.', q: 'Что пишется в class родителя?', opts: ['card-group-row', 'd-flex gap-5', 'd-flex card-row', 'row card-group'],
      ok: 'Здорово! В ряд карточки ставит d-flex из урока 4, а gap-5 раздвигает их.', hint: 'Вспомните урок 4: что ставит элементы в ряд и что даёт промежуток между ними?', alt: 'Три карточки в ряд' },
    en: { ctx: 'Three cards should stand in a row with gaps, like on the right.', q: 'What goes in the parent div’s class?', opts: ['card-group-row', 'd-flex gap-5', 'd-flex card-row', 'row card-group'],
      ok: 'Nice work! d-flex from lesson 4 puts the cards in a row, and gap-5 spaces them out.', hint: 'Remember lesson 4: what puts items in a row, and what gives the space between them?', alt: 'Three cards in a row' } }
];
function b5Wrap(cls, kids) { return `<div class="${cls}">\n${kids.map((k) => '  ' + k).join('\n')}\n</div>`; }
