// =============================================================================
// ТЕСТЫ К УРОКУ 6 МОДУЛЯ BOOTSTRAP «Контейнер и сетка» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: col-4 — 4 доли из 12; на телефоне столбиком, на компьютере в ряд — md:col-4 (col-md-4 — имя версии 5);
// колонки встают в ряд только внутри row; container собирает содержимое посередине и ограничивает ширину; col — поровну.
// Страница — честная (bs={BS_CSS}), компьютер — vw 800 (срабатывает md). Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'kontejner-i-setka';
const B6_CSS = '[class*="col"]{outline:2px solid #fff;background:#FDE68A;padding-block:12px;text-align:center;font-weight:600}';
const B6_TALL = '[class*="col"]{min-height:90px;display:flex;align-items:center;justify-content:center}';
const b6Wrap = (cls, kids) => `<div class="${cls}">\n${kids.map((k) => '  ' + k).join('\n')}\n</div>`;
const b6Cols = (T, cls) => [T('Robo-futbol', 'Робофутбол', 'Robo-football'), T('Sumo', 'Сумо', 'Sumo'), T('Labirint', 'Лабиринт', 'Maze')].map((t) => `<div class="${cls}">${t}</div>`);
const QS = [
  { id: 'bootstrap-06t1', target: 'bootstrap-06', ptype: 'Bootstrap', tag: 'col-n', correct: 1,
    vis: () => { const src = b6Wrap('row', ['<div class="col-4">A</div>', '<div class="col-8">B</div>']); return <WqVis code={src} html={src} css={B6_CSS} bs={BS_CSS} vw={560} mark={[2]} />; },
    uz: { ctx: "Qatorda ikkita ustun: col-4 va col-8.", q: "col-4 qatorning qancha qismini egallaydi?", opts: ["Qatorning to'rtdan birini", "12 dan 4 bo'lakni, ya'ni uchdan birini", "Har doim 4 piksel kenglikni", "4 ta ustunning o'rnini birdaniga"],
      ok: "To'ppa-to'g'ri! Bootstrap qatorni 12 bo'lakka bo'ladi. col-4 — 4 bo'lak, ya'ni uchdan bir; col-8 qolgan 8 bo'lakni oladi.", hint: "Bootstrap qatorni nechta bo'lakka bo'lar edi? 4 va 8 ni qo'shib ko'ring.", alt: "col-4 va col-8 ustunli qator" },
    ru: { ctx: 'В строке две колонки: col-4 и col-8.', q: 'Какую часть строки занимает col-4?', opts: ['Ровно четверть всей строки', '4 доли из 12, то есть треть', 'Всегда 4 пикселя в ширину на любом экране', 'Место четырёх колонок строки'],
      ok: 'Верно! Bootstrap делит строку на 12 долей. col-4 — 4 доли, то есть треть; col-8 берёт остальные 8.', hint: 'На сколько долей Bootstrap делит строку? Сложите 4 и 8.', alt: 'Строка с колонками col-4 и col-8' },
    en: { ctx: 'The row has two columns: col-4 and col-8.', q: 'How much of the row does col-4 take?', opts: ['Exactly a quarter of the whole row', '4 parts out of 12, that is a third', 'Always 4 pixels wide on any screen', 'The space of four columns in the row'],
      ok: 'Right! Bootstrap splits a row into 12 parts. col-4 is 4 parts, a third; col-8 takes the other 8.', hint: 'How many parts does Bootstrap split a row into? Add 4 and 8.', alt: 'A row with col-4 and col-8 columns' } },
  { id: 'bootstrap-06t2', target: 'bootstrap-06', ptype: 'Bootstrap', tag: 'md:col', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b6Wrap('row', ['A', 'B', 'C'].map((t) => `<div class="___">${t}…</div>`))} html={b6Wrap('row', ['A', 'B', 'C'].map((t) => `<div class="md:col-4">${t}</div>`))} css={B6_CSS + B6_TALL} bs={BS_CSS} vw={800} mark={[2, 3, 4]} />; },
    uz: { ctx: "Telefonda ustma-ust, kompyuterda esa o'ngdagidek yonma-yon tursin.", q: "Bo'sh joylarga nima yoziladi?", opts: ['col-md-4', 'md-col-4', 'md:col-4', 'col-4:md'],
      ok: "Xuddi shunday! md:col-4 — «ekran md dan katta bo'lsa, col-4». Telefonda ustunlar butun qatorni egallaydi. col-md-4 esa beshinchi versiyaning nomi.", hint: "Bootstrap 6 da ekran o'lchami so'z oldidan yoziladi. Ular orasida qanday belgi turar edi?", alt: "Kompyuterda yonma-yon turgan uchta bo'lim" },
    ru: { ctx: 'На телефоне — друг под другом, на компьютере — в ряд, как справа.', q: 'Что пишется на пустые места?', opts: ['col-md-4', 'md-col-4', 'md:col-4', 'col-4:md'],
      ok: 'Именно! md:col-4 значит «если экран не меньше md — col-4». На телефоне колонки занимают всю строку. А col-md-4 — имя пятой версии.', hint: 'В Bootstrap 6 размер экрана пишут перед словом. Какой знак стоял между ними?', alt: 'Три раздела в ряд на компьютере' },
    en: { ctx: 'Stacked on a phone, in a row on a computer, like on the right.', q: 'What goes in the empty spots?', opts: ['col-md-4', 'md-col-4', 'md:col-4', 'col-4:md'],
      ok: 'Exactly! md:col-4 means “if the screen is at least md, col-4”. On a phone the columns take the whole row. col-md-4 is a version 5 name.', hint: 'In Bootstrap 6 the screen size goes before the word. Which sign stood between them?', alt: 'Three sections in a row on a computer' } },
  { id: 'bootstrap-06t3', target: 'bootstrap-06', ptype: 'Bootstrap', tag: 'row', correct: 0, mono: true,
    vis: () => { const src = b6Wrap('container', ['<div class="col-6">A</div>', '<div class="col-6">B</div>']); return <WqVis code={src} html={src} css={B6_CSS} bs={BS_CSS} vw={560} mark={[1]} />; },
    uz: { ctx: "Ikkita col-6 yonma-yon turishi kerak edi, lekin ustma-ust qoldi.", q: "Ustunlarni o'rab turgan div-ga qaysi class kerak?", opts: ['row', 'cols', 'col-12', 'd-block'],
      ok: "Qoyil! Ustunlar faqat row ichida qatorga tizilib, 12 bo'lakni bo'lishadi. Tartib: container, ichida row, uning ichida ustunlar.", hint: "Darsdagi tartibni eslang: container, keyin nima, keyin ustunlar?", alt: "row-siz ustma-ust qolgan ikki ustun" },
    ru: { ctx: 'Две col-6 должны были стоять рядом, но встали друг под другом.', q: 'Какой class нужен div вокруг колонок?', opts: ['row', 'cols', 'col-12', 'd-block'],
      ok: 'Здорово! Колонки встают в ряд и делят 12 долей только внутри row. Порядок: container, в нём row, в нём колонки.', hint: 'Вспомните порядок из урока: container, потом что, потом колонки?', alt: 'Две колонки без row друг под другом' },
    en: { ctx: 'Two col-6 columns should stand side by side, but they stacked.', q: 'Which class does the div around the columns need?', opts: ['row', 'cols', 'col-12', 'd-block'],
      ok: 'Nice work! Columns line up and share the 12 parts only inside row. The order: container, row inside it, columns inside that.', hint: 'Remember the order from the lesson: container, then what, then columns?', alt: 'Two columns without row, stacked' } },
  { id: 'bootstrap-06t4', target: 'bootstrap-06', ptype: 'Bootstrap', tag: 'container', correct: 3,
    vis: (L) => { const T = aqL(L); const src = `<div class="container bg-warning p-9">\n  <h2>${T("Robot to'garagi", 'Кружок роботов', 'Robot club')}</h2>\n  <p>${T('Har shanba soat 10:00 da', 'Каждую субботу в 10:00', 'Every Saturday at 10:00')}</p>\n</div>`; return <WqVis code={src} html={src} css=".container{min-height:200px}" bs={BS_CSS} vw={700} mark={[1]} />; },
    uz: { ctx: "Sahifa keng. Sariq blokda container yozilgan.", q: 'container nima qildi?', opts: ["Blokni butun ekran kengligiga cho'zib qo'ydi", "Ichidagi narsalarni yonma-yon qatorga qo'ydi", "Blok atrofiga ingichka ramka chizib qo'ydi", "Mazmunni o'rtaga yig'ib, kengligini chekladi"],
      ok: "Juda zo'r! container mazmunni sahifa o'rtasiga yig'adi va ekran o'lchamiga qarab eng katta kenglikni beradi. Shunda keng ekranda matn tarqalib ketmaydi.", hint: "Sahifaga qarang: sariq blokning ikki yonida nima bor? U butun kenglikni egallaganmi?", alt: "O'rtada turgan sariq container" },
    ru: { ctx: 'Страница широкая. У жёлтого блока написан container.', q: 'Что сделал container?', opts: ['Растянул блок на всю ширину окна браузера', 'Поставил всё, что внутри, в один ряд', 'Нарисовал вокруг блока тонкую рамку', 'Собрал всё посередине и ограничил ширину'],
      ok: 'Отлично! container собирает содержимое посередине страницы и даёт наибольшую ширину по размеру экрана. На широком экране текст не расползается.', hint: 'Посмотрите на страницу: что по бокам жёлтого блока? Он занял всю ширину?', alt: 'Жёлтый container посередине' },
    en: { ctx: 'The page is wide. The yellow block has container.', q: 'What did container do?', opts: ['Stretched the block to the full screen width', 'Put everything inside it in a single row', 'Drew a thin border around the whole block', 'Centered the content and limited its width'],
      ok: 'Great! container gathers the content in the middle and sets a maximum width for the screen size, so text doesn’t spread out on wide screens.', hint: 'Look at the page: what is on both sides of the yellow block? Did it take the full width?', alt: 'A yellow container in the middle' } },
  { id: 'bootstrap-06t5', target: 'bootstrap-06', ptype: 'Bootstrap', tag: 'col', correct: 2,
    vis: () => <WqVis code={b6Wrap('row', ['<div class="col">A</div>', '<div class="col">B</div>', '<div class="col">C</div>'])} mark={[2, 3, 4]} />,
    uz: { ctx: "Qatordagi uchta ustunda faqat col yozilgan, raqam yo'q.", q: 'Ustunlar qanday kenglikda bo\'ladi?', opts: ["Birinchisi kengroq, qolganlari torroq", "Har biri butun qatorni o'zi egallaydi", "Teng: har biri qatorning uchdan biri", "Matni uzunroq ustun kengroq bo'ladi"],
      ok: "To'ppa-to'g'ri! Raqamsiz col qatorni ustunlar orasida teng bo'ladi: uchta bo'lsa — har biriga uchdan bir.", hint: "Raqam bo'lmasa, Bootstrap ustunlarga qancha joy beradi: hammasigami yoki teng bo'lib?", alt: "Uchta col ustunli qator kodi" },
    ru: { ctx: 'У трёх колонок в строке написано только col, без числа.', q: 'Какой ширины будут колонки?', opts: ['Первая шире, а остальные уже', 'Каждая займёт всю строку целиком', 'Поровну: каждая — треть строки', 'Та, где текст длиннее, будет шире'],
      ok: 'Верно! col без числа делит строку поровну: три колонки — по трети.', hint: 'Если числа нет, сколько места Bootstrap даёт колонкам: всем всё или поровну?', alt: 'Код строки с тремя колонками col' },
    en: { ctx: 'The three columns in the row only have col, no number.', q: 'How wide will the columns be?', opts: ['The first is wider, the others narrower', 'Each one takes up the whole row', 'Equal: each is a third of the row', 'The one with longer text is wider'],
      ok: 'Right! col without a number splits the row equally: three columns get a third each.', hint: 'With no number, how much space does Bootstrap give the columns: everything to each, or equal shares?', alt: 'Code of a row with three col columns' } }
];
