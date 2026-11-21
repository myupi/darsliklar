// =============================================================================
// ===== ПРАКТИКА 6 · «Sahifa to'ri» · к уроку 6 «Контейнер и сетка» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Сайт кружка роботов разложен по сетке: контейнер, ряд, колонки с блоками-карточками (как в уроке 6:
// card card-body с заголовком). При обновлении у тегов пропали слова сетки — блоки встали во всю ширину, вкладки погасли.
// Ученик раскладывает пять страниц: поменять долю колонки в готовом class (col-4 → col-8) → вписать row в пустой class
// (колонки встали в ряд) → взять пример Grid с сайта и настроить: свои блоки и md:col-4 (на телефоне — столбиком) →
// починить ошибки урока (rows, col-md-6) → своя страница: container, row, три колонки md:col-4. Окно страницы — своей
// ширины (телефон 360, планшет 768, ноутбук 1024): @media срабатывают честно.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-06p-kontejner-i-setka.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-06p-kontejner-i-setka',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "6-amaliyot. Sahifa to'ri", ru: 'Практика 6. Сетка страницы', en: 'Practice 6. The page grid' }
};

const P6 = {
  robots: L3("Robotlar", 'Роботы', 'Robots'), plan: L3("Jadval", 'Расписание', 'Schedule'), contact: L3("Aloqa", 'Контакты', 'Contacts'),
  news: L3("Yangiliklar", 'Новости', 'News'), team: L3("Jamoa", 'Команда', 'Team'), cup: L3("Musobaqa", 'Соревнование', 'Contest'),
  colT: L3("Ustunlar", 'Колонки', 'Columns'), rowT: L3("Qator", 'Ряд', 'Row'), phoneT: L3("Telefon", 'Телефон', 'Phone'), fixT: L3("Tuzatish", 'Починка', 'Fix'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'),
  my1: L3("Robotim", 'Мой робот', 'My robot'), my2: L3("Do'stlarim", 'Мои друзья', 'My friends'), my3: L3("Sovrinlar", 'Призы', 'Prizes')
};
const P6_PRE = ['<head>', '  ' + BP_LINK, '</head>', '<body>'];
const P6_POST = ['</body>'];
// Блок урока 6: карточка только с заголовком. Колонка: class и блок; ind — отступ.
const p6Blk = (t) => '<div class="card card-body">' + t + '</div>';
const p6Col = (cls, t, ind) => { const s = ind == null ? '      ' : ind; return s + '<div' + (cls == null ? '' : ' class="' + cls + '"') + '>\n' + s + '  ' + p6Blk(t) + '\n' + s + '</div>'; };
// Сетка: o.cont — class контейнера (не задан — container, false — без контейнера, '' — пустой class), o.row — class ряда (не задан — row).
const p6Grid = (o, cols) => {
  const c0 = o.cont === false ? null : (o.cont == null ? 'container' : o.cont);
  const r0 = o.row == null ? 'row' : o.row;
  const a = c0 === null ? '' : '  ';
  const lines = [];
  if (c0 !== null) lines.push('  <div class="' + c0 + '">');
  lines.push(a + '  <div class="' + r0 + '">');
  cols.forEach((x) => lines.push(p6Col(x[0], x[1], a + '    ')));
  lines.push(a + '  </div>');
  if (c0 !== null) lines.push('  </div>');
  return lines.join('\n');
};
const P6_SITE = '<div class="container text-center">\n  <div class="row">\n    <div class="col">Column</div>\n    <div class="col">Column</div>\n    <div class="col">Column</div>\n  </div>\n</div>';
const P6_DOCS_GRID = { page: L3("Layout · Grid", 'Layout · Grid', 'Layout · Grid'), items: [
  { k: 'grid', title: 'Grid · HTML', code: P6_SITE },
  { k: 'bp', title: 'Breakpoints: sm 576 · md 768 · lg 1024', chips: ['sm:col-4', 'md:col-4', 'lg:col-4'], copy: false }
] };
const P6_DOCS_FIX = { page: L3("Layout · Grid · Breakpoints", 'Layout · Grid · Breakpoints', 'Layout · Grid · Breakpoints'), items: [
  { k: 'g', title: 'Grid', chips: ['container', 'row', 'col', 'col-6'], copy: false },
  { k: 'bp', title: 'Breakpoints', chips: ['sm:col-6', 'md:col-6', 'lg:col-6'], copy: false }
] };
const P6_DOCS_OWN = { page: L3("Layout · Containers · Grid", 'Layout · Containers · Grid', 'Layout · Containers · Grid'), items: [
  { k: 'g', title: 'Containers · Grid', chips: ['container', 'row', 'col'], copy: false },
  { k: 'bp', title: 'Breakpoints: md 768', chips: ['md:col-4', 'md:col-6', 'md:col-12'], copy: false }
] };
const p6Cols = (D) => D.qa('.row > div');
const p6Side = (D) => { const c = p6Cols(D); return c.length >= 2 && Math.abs(c[0].getBoundingClientRect().top - c[1].getBoundingClientRect().top) < 2; };

const PR = {
  next: L3("Formalar", 'Формы', 'Forms'),
  tabs: [
    { ico: 'book', c: '#FA4F28', name: P6.colT, file: 'ustunlar.html' },
    { ico: 'star', c: '#0FA38E', name: P6.rowT, file: 'qator.html' },
    { ico: 'pin', c: '#7C5CFA', name: P6.phoneT, file: 'telefon.html' },
    { ico: 'rocket', c: '#F59E0B', name: P6.fixT, file: 'tuzatish.html' },
    { ico: 'heart', c: '#E44D8A', name: P6.mine, file: 'my.html' }
  ],
  // Крючок: на ноутбуке три колонки в ряд; после «Yangilash» слов сетки нет — блоки во всю ширину, друг под другом.
  hook: {
    vw: 1024,
    doc: (pk, on) => P6_PRE.concat([p6Grid(on ? {} : { cont: '', row: '' }, [[on ? 'md:col-4' : null, pk(P6.robots)], [on ? 'md:col-4' : null, pk(P6.plan)], [on ? 'md:col-4' : null, pk(P6.contact)]]), '</body>']).join('\n').replace(/ class=""/g, '')
  },
  ownVw: 768,
  ownDefault: (pk) => P6_PRE.concat([p6Grid({}, [['md:col-4', pk(P6.my1)], ['md:col-4', pk(P6.my2)], ['md:col-4', pk(P6.my3)]]), '</body>']).join('\n'),
  tasks: [
    // Т1 · доля колонки в готовом class: новости шире (col-4 → col-8).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 768, pre: P6_PRE, post: P6_POST,
      code0: p6Grid({}, [['col-4', pk(P6.robots)], ['col-4', pk(P6.news)]]), answer: p6Grid({}, [['col-4', pk(P6.robots)], ['col-8', pk(P6.news)]]),
      goal: (D) => (D.has(p6Cols(D)[1], 'col-8') ? null : C.t1.no),
      sample: ['<div class="col-6">…</div>'],
      drill: { code0: p6Grid({}, [['col-6', pk(P6.team)], ['col-6', pk(P6.contact)]]), answer: p6Grid({}, [['col-9', pk(P6.team)], ['col-3', pk(P6.contact)]]).replace('col-9', 'col-6'),
        goal: (D) => (D.has(p6Cols(D)[1], 'col-3') ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class у ряда: колонки встали в ряд (row).
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 768, pre: P6_PRE, post: P6_POST,
      code0: p6Grid({ row: '' }, [['col-6', pk(P6.robots)], ['col-6', pk(P6.plan)]]), answer: p6Grid({}, [['col-6', pk(P6.robots)], ['col-6', pk(P6.plan)]]),
      goal: (D) => (D.q('.container > .row') && p6Side(D) ? null : D.q('.container > .d-flex') ? C.t2.flex : C.t2.no),
      sample: ['<div class="row">', '  <div class="col-4">…</div>', '</div>'],
      drill: { code0: p6Grid({ cont: '' }, [['col-4', pk(P6.robots)], ['col-4', pk(P6.plan)], ['col-4', pk(P6.contact)]]),
        answer: p6Grid({}, [['col-4', pk(P6.robots)], ['col-4', pk(P6.plan)], ['col-4', pk(P6.contact)]]), vw: 1024,
        goal: (D) => (D.q('body > .container') ? null : D.q('body > .container-fluid') ? C.t2.fluid : C.t2.drillNo) }
    }),
    // Т3 · пример Grid с сайта на телефоне: свои блоки и md:col-4 — на телефоне столбиком, на компьютере в ряд.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 360, pre: P6_PRE, post: P6_POST, docs: () => P6_DOCS_GRID,
      code0: '', answer: ['<div class="container text-center">', '  <div class="row">', '    <div class="md:col-4">' + pk(P6.robots) + '</div>', '    <div class="md:col-4">' + pk(P6.plan) + '</div>',
        '    <div class="md:col-4">' + pk(P6.contact) + '</div>', '  </div>', '</div>'].join('\n'),
      goal: (D) => {
        const c = p6Cols(D);
        if (c.length < 3) return D.q('.row') ? C.t3.three : C.t3.noGrid;
        if (c.some((x) => x.textContent.trim() === 'Column')) return C.t3.sample;
        return c.every((x) => D.has(x, 'md:col-4')) && !p6Side(D) ? null : C.t3.md;
      },
      sample: ['<div class="row">', '  <div class="md:col-6">…</div>', '  <div class="md:col-6">…</div>', '</div>'],
      drill: { code0: '', answer: ['<div class="container">', '  <div class="row">', '    <div class="md:col-6">' + pk(P6.team) + '</div>', '    <div class="md:col-6">' + pk(P6.cup) + '</div>', '  </div>', '</div>'].join('\n'),
        goal: (D) => { const c = p6Cols(D); return c.length >= 2 && c.every((x) => D.has(x, 'md:col-6')) && !c.some((x) => x.textContent.trim() === 'Column') ? null : C.t3.drillNo; } }
    }),
    // Т4 · ошибки урока: rows вместо row, col-md-6 (имя версии 5) вместо md:col-6.
    (pk) => bpTask(4, {
      kind: 'fix', vw: 768, pre: P6_PRE, post: P6_POST, docs: () => P6_DOCS_FIX,
      code0: p6Grid({ row: 'rows' }, [['col-md-6', pk(P6.news)], ['col-md-6', pk(P6.cup)]]), answer: p6Grid({}, [['md:col-6', pk(P6.news)], ['md:col-6', pk(P6.cup)]]),
      goal: (D) => {
        if (!D.q('.container > .row')) return C.t4.row;
        return p6Cols(D).length === 2 && p6Cols(D).every((x) => D.has(x, 'md:col-6')) && p6Side(D) ? null : C.t4.cols;
      },
      sample: ['<div class="row">', '  <div class="md:col-4">…</div>', '</div>'],
      drill: { code0: p6Grid({}, [['md-col-4', pk(P6.robots)], ['md:col-4', pk(P6.plan)], ['md:col-4', pk(P6.contact)]]),
        answer: p6Grid({}, [['md:col-4', pk(P6.robots)], ['md:col-4', pk(P6.plan)], ['md:col-4', pk(P6.contact)]]),
        goal: (D) => (p6Cols(D).every((x) => D.has(x, 'md:col-4')) ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: container, row, три колонки md:col-4 со своими блоками (класс — в пустые class).
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 768, pre: P6_PRE, post: P6_POST, docs: () => P6_DOCS_OWN,
      code0: p6Grid({ cont: '', row: '' }, [['', pk(P6.my1)], ['', pk(P6.my2)], ['', pk(P6.my3)]]),
      answer: p6Grid({}, [['md:col-4', pk(P6.my1)], ['md:col-4', pk(P6.my2)], ['md:col-4', pk(P6.my3)]]),
      list: [
        { t: L3("container", 'container', 'container'), ok: (D) => !!D.q('body > .container') },
        { t: L3("row", 'row', 'row'), ok: (D) => !!D.q('.container > .row') },
        { t: L3("3 ta ustun yonma-yon", '3 колонки в ряд', '3 columns in a row'), ok: (D) => p6Cols(D).length === 3 && p6Side(D) },
        { t: L3("md: telefonda ustma-ust", 'md: на телефоне столбиком', 'md: stacked on a phone'), ok: (D) => p6Cols(D).length === 3 && p6Cols(D).every((x) => /^(sm|md|lg):col/.test(x.className.trim())) }
      ],
      goal: (D) => {
        if (!D.q('body > .container')) return C.t5.cont;
        if (!D.q('.container > .row')) return C.t5.row;
        const c = p6Cols(D);
        if (c.length !== 3 || !p6Side(D)) return C.t5.cols;
        if (!c.every((x) => /^(sm|md|lg):col/.test(x.className.trim()))) return C.t5.md;
        return null;
      },
      sample: ['<div class="container">', '  <div class="row">', '    <div class="md:col-6">…</div>', '    <div class="md:col-6">…</div>', '  </div>', '</div>'],
      onSolved: (st) => store.set('myDoc', P6_PRE.concat([st.code.replace(/\s+$/, ''), '</body>']).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Sahifa to'ri", 'Сетка страницы', 'The page grid'),
    say: L3("Salom! Bu to'garak saytining kompyuterdagi ko'rinishi. Uchta bo'lim yonma-yon, ustun bo'lib turibdi, butun sahifa esa o'rtada. Buni Bootstrapning to'ri qildi: container, row va col. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Так сайт кружка выглядит на компьютере. Три раздела стоят рядом колонками, а вся страница — посередине. Это сделала сетка Bootstrap: container, row и col. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is how the club website looks on a computer. Three sections stand side by side as columns, and the whole page is centered. Bootstrap’s grid did that: container, row and col. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda to'r so'zlari o'chib ketdi. Bo'limlar butun kenglikka cho'zilib, ustma-ust tushdi, varaqlar o'chdi.",
      'Ой! При обновлении стёрлись слова сетки. Разделы растянулись на всю ширину и встали друг под другом, вкладки погасли.',
      'Oh no! The update erased the grid words. The sections stretched to the full width and stacked up, and the tabs went dark.'),
    done: L3("Kodga qarang: div teglarida class yo'q. To'rni uch so'z quradi: container sahifani o'rtaga yig'adi, row qator yasaydi, col esa ustunlar. Beshta sahifani birma-bir tuzatamiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: у тегов div нет class. Сетку строят три слова: container собирает страницу посередине, row делает ряд, а col — колонки. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the div tags have no class. Three words build the grid: container centers the page, row makes a row, and col makes columns. Let’s fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifaning to'rini tiklaymiz", 'Восстановим сетку пяти страниц', 'Let’s restore the grid on five pages')
  },
  t1: {
    eyebrow: L3("Ustunlar", 'Колонки', 'Columns'),
    say: L3("Birinchi sahifa: ustunlar. Qatorda ikkita ustun, ikkalasi col-4, ya'ni har biri qatorning uchdan biri degani. O'ngda esa bo'sh joy qolgan. Yangiliklar ustuni qolgan joyni egallasin. Qator o'n ikki bo'lak ekanini eslang.",
      'Первая страница: колонки. В ряду две колонки, обе col-4, то есть каждая — треть ряда. А справа осталось пустое место. Пусть колонка новостей займёт оставшееся место. Помни: ряд — это двенадцать частей.',
      'The first page is columns. The row has two columns, both col-4, meaning each is a third of the row. There’s empty space on the right. Let the news column take the remaining space. Remember: a row is twelve parts.'),
    ask: L3("Yangiliklar ustuni qolgan joyni egallasin", 'Пусть колонка новостей займёт оставшееся место', 'Let the news column take the remaining space'),
    ok: L3("Zo'r! To'rt va sakkiz, jami o'n ikki: qator to'ldi!", 'Здорово! Четыре и восемь — ровно двенадцать: ряд заполнен!', 'Great! Four plus eight makes twelve: the row is full!'),
    hints: [
      L3("Birinchi ustun to'rt bo'lak oladi. Qator o'n ikki bo'lak bo'lsa, ikkinchisiga nechta qoladi?", 'Первая колонка берёт четыре части. Если в ряду двенадцать частей, сколько остаётся второй?', 'The first column takes four parts. If a row has twelve parts, how many are left for the second?'),
      L3("O'n ikkidan to'rt ayirsak, sakkiz qoladi. Ikkinchi ustundagi col-4 o'rniga col-8 yozing.", 'Двенадцать минус четыре — восемь. У второй колонки вместо col-4 напиши col-8.', 'Twelve minus four is eight. On the second column, write col-8 instead of col-4.'),
      L3("Namuna kod ostida: col-6 qatorning yarmi. Xuddi shunday kerakli sonni yozing va Tekshirishni bosing.", 'Образец под кодом: col-6 — половина ряда. Так же напиши нужное число и нажми «Проверить».', 'The example under the code: col-6 is half a row. Write the right number the same way and tap Check.')
    ],
    no: L3("Ustunlar hali qatorni to'ldirmadi. Ikkinchi ustunga qolgan sakkiz bo'lakni bering: col-8.", 'Колонки ещё не заполнили ряд. Дай второй колонке оставшиеся восемь частей: col-8.', 'The columns don’t fill the row yet. Give the second column the remaining eight parts: col-8.'),
    drill: L3("endi Aloqa ustuni torroq bo'lsin: qatorning to'rtdan biri", 'теперь пусть колонка контактов будет уже: четверть ряда', 'now make the contacts column narrower: a quarter of the row'),
    drillNo: L3("Qatorning to'rtdan biri o'n ikkining to'rtdan biri, ya'ni uch bo'lak degani: col-3.", 'Четверть ряда — это четверть от двенадцати, то есть три части: col-3.', 'A quarter of the row is a quarter of twelve, which means three parts: col-3.')
  },
  t2: {
    eyebrow: L3("Qator", 'Ряд', 'Row'),
    say: L3("Ikkinchi sahifa: qator. Bu yerda ustunlar ustma-ust turibdi, chunki ularni o'rab turgan div tegining class qiymati bo'sh. Ustunlar faqat bitta so'zning ichida qatorga tiziladi. O'sha so'zni yozing.",
      'Вторая страница: ряд. Здесь колонки стоят друг под другом, потому что у div, который их обнимает, пустой class. Колонки встают в ряд только внутри одного слова. Напиши это слово.',
      'The second page is the row. Here the columns are stacked, because the div around them has an empty class. Columns line up only inside one particular word. Write that word.'),
    ask: L3("Ustunlar qatorga tizilsin", 'Поставь колонки в ряд', 'Line the columns up in a row'),
    ok: L3("Ajoyib! Ustunlar qatorga turdi, har biri yarim kenglikda!", 'Отлично! Колонки встали в ряд, каждая на половину ширины!', 'Great! The columns lined up, each half the width!'),
    hints: [
      L3("Darsdagi tartib esingizdami? Container, uning ichida nima, ichida esa ustunlar?", 'Помнишь порядок из урока? Container, внутри него что, а внутри — колонки?', 'Remember the order from the lesson? Container, inside it what, and inside that the columns?'),
      L3("Qator inglizcha row. Bo'sh class ichiga row deb yozing.", 'Ряд по-английски — row. Впиши row в пустой class.', 'A row is row. Write row in the empty class.'),
      L3("Namuna kod ostida. Xuddi shunday so'zni ustunlarni o'rab turgan div tegiga yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши слово тегу div, который обнимает колонки, и нажми «Проверить».', 'The example is under the code. Write the same word on the div around the columns and tap Check.')
    ],
    no: L3("Ustunlar hali ustma-ust. Ularni o'rab turgan div tegiga row so'zi kerak.", 'Колонки ещё друг под другом. Тегу div вокруг них нужно слово row.', 'The columns are still stacked. The div around them needs the word row.'),
    flex: L3("d-flex ham qator yasaydi, lekin to'r ustunlari o'n ikki bo'lakni faqat row ichida bo'lishadi.", 'd-flex тоже делает ряд, но колонки сетки делят двенадцать частей только внутри row.', 'd-flex makes a row too, but grid columns share the twelve parts only inside row.'),
    drill: L3("endi butun sahifa kompyuterda o'rtaga yig'ilsin", 'теперь пусть вся страница на компьютере соберётся посередине', 'now gather the whole page in the middle on a computer'),
    drillNo: L3("Sahifani o'rtaga yig'ib, kengligini cheklaydigan so'z container. Tashqi div tegiga uni yozing.", 'Слово, которое собирает страницу посередине и ограничивает ширину, — container. Напиши его внешнему div.', 'The word that centers the page and limits its width is container. Write it on the outer div.'),
    fluid: L3("container-fluid butun kenglikka cho'ziladi. O'rtaga yig'ish uchun oddiy container kerak.", 'container-fluid растягивается на всю ширину. Чтобы собрать посередине, нужен обычный container.', 'container-fluid stretches to the full width. To center the page you need a plain container.')
  },
  t3: {
    eyebrow: L3("Telefon", 'Телефон', 'Phone'),
    say: L3("Uchinchi sahifa telefonda ochildi. Bu yerda to'r umuman yo'q. Bootstrap saytining Grid sahifasidan misolni nusxalang va qo'ying. Keyin moslang: Column o'rniga bizning bo'limlar, ustunlar esa telefonda ustma-ust, kompyuterda yonma-yon tursin.",
      'Третья страница открылась на телефоне. Здесь сетки нет совсем. Скопируй пример со страницы Grid сайта Bootstrap и вставь. Потом настрой: вместо Column — наши разделы, а колонки на телефоне друг под другом, на компьютере рядом.',
      'The third page opened on a phone. There’s no grid here at all. Copy the example from the Grid page of the Bootstrap site and paste it. Then adjust it: our sections instead of Column, and the columns stacked on a phone but side by side on a computer.'),
    ask: L3("Saytdan to'r oling: telefonda ustma-ust", 'Возьми сетку с сайта: на телефоне — столбиком', 'Take the grid from the site: stacked on a phone'),
    ok: L3("Qoyil! Bitta kod: telefonda ustma-ust, kompyuterda yonma-yon!", 'Вот это да! Один код: на телефоне столбиком, на компьютере в ряд!', 'Wow! One code: stacked on a phone, side by side on a computer!'),
    hints: [
      L3("Oldin misolni nusxalab, Qo'yish tugmasi bilan qo'ying. Telefonda uchta ustun juda tor: ular faqat katta ekranda yonma-yon tursin.", 'Сначала скопируй пример и вставь кнопкой «Вставить». На телефоне три колонки слишком узкие: пусть они стоят рядом только на большом экране.', 'First copy the example and paste it with the Paste button. On a phone three columns are too narrow: let them sit side by side only on a big screen.'),
      L3("Ekran o'lchami so'z oldidan ikki nuqta bilan yoziladi: col o'rniga md:col-4. Column yozuvlari o'rniga esa Robotlar, Jadval va Aloqa deb yozing.", 'Размер экрана пишут перед словом через двоеточие: вместо col — md:col-4. А вместо надписей Column напиши Роботы, Расписание и Контакты.', 'The screen size goes before the word with a colon: md:col-4 instead of col. And write Robots, Schedule and Contacts instead of Column.'),
      L3("Namuna kod ostida. Xuddi shunday ustunlarga md bilan so'z bering va Tekshirishni bosing.", 'Образец под кодом. Так же дай колонкам слово с md и нажми «Проверить».', 'The example is under the code. Give the columns a word with md the same way and tap Check.')
    ],
    noGrid: L3("Sahifada to'r hali yo'q. Saytdan misolni nusxalang va Qo'yish tugmasini bosing.", 'На странице пока нет сетки. Скопируй пример с сайта и нажми «Вставить».', 'There’s no grid on the page yet. Copy the example from the site and tap Paste.'),
    three: L3("Qatorda uchta ustun bo'lishi kerak: Robotlar, Jadval va Aloqa.", 'В ряду должно быть три колонки: Роботы, Расписание и Контакты.', 'The row needs three columns: Robots, Schedule and Contacts.'),
    sample: L3("Ustunlarda hali saytdagidek Column yozuvi turibdi. Bo'limlarimiz nomini yozing.", 'В колонках ещё Column, как на сайте. Напиши названия наших разделов.', 'The columns still say Column, as on the site. Write our section names.'),
    md: L3("Telefonda ustunlar hali yonma-yon va juda tor. Har biriga md:col-4 bering: shunda ular faqat kompyuterda yonma-yon turadi.", 'На телефоне колонки ещё рядом и слишком узкие. Дай каждой md:col-4: тогда рядом они встанут только на компьютере.', 'On a phone the columns are still side by side and too narrow. Give each md:col-4: then they sit side by side only on a computer.'),
    drill: L3("endi ikki bo'lim: kompyuterda har biri yarim kenglikda", 'теперь два раздела: на компьютере каждый на половину ширины', 'now two sections: each half the width on a computer'),
    drillNo: L3("Misolni yana nusxalang, ikkita ustun qoldiring va har biriga md:col-6 bering.", 'Скопируй пример ещё раз, оставь две колонки и дай каждой md:col-6.', 'Copy the example again, keep two columns, and give each one md:col-6.')
  },
  t4: {
    eyebrow: L3("Tuzatish", 'Починка', 'Fix'),
    say: L3("To'rtinchi sahifa: bu yerni men shoshib yozibman. Planshetda ikki bo'lim yonma-yon turishi kerak edi, lekin ular ustma-ust. Kodda ikki xil xato bor: biri qator so'zida, ikkinchisi ustun so'zida.",
      'Четвёртая страница: здесь я писал в спешке. На планшете два раздела должны стоять рядом, а они друг под другом. В коде два вида ошибок: одна в слове ряда, другая в слове колонок.',
      'The fourth page: I wrote it in a hurry. On a tablet two sections should sit side by side, but they’re stacked. The code has two kinds of mistakes: one in the row word, the other in the column word.'),
    ask: L3("Planshetda ikki bo'lim yonma-yon tursin", 'На планшете два раздела должны стоять рядом', 'On a tablet, put the two sections side by side'),
    ok: L3("Zo'r ish! Endi eski nomlarni darrov taniysiz!", 'Отличная работа! Теперь старые имена ты узнаёшь сразу!', 'Nice work! Now you spot old names right away!'),
    hints: [
      L3("Ikki joyga qarang: qatorning class qiymati va ustunlarning class qiymati.", 'Посмотри в два места: class ряда и class колонок.', 'Look at two places: the row’s class and the columns’ class.'),
      L3("rows so'zida ortiqcha harf bor: row. col-md-6 esa beshinchi versiya nomi, oltinchisida md:col-6.", 'В слове rows лишняя буква: row. А col-md-6 — имя пятой версии, в шестой — md:col-6.', 'rows has an extra letter: row. And col-md-6 is a version 5 name; in version 6 it’s md:col-6.'),
      L3("Namuna kod ostida. Xuddi shunday qator va ustun so'zlarini tuzating va Tekshirishni bosing.", 'Образец под кодом. Так же почини слова ряда и колонок и нажми «Проверить».', 'The example is under the code. Fix the row and column words the same way and tap Check.')
    ],
    row: L3("Ustunlarni o'rab turgan div tegiga row so'zi kerak.", 'Тегу div вокруг колонок нужно слово row.', 'The div around the columns needs the word row.'),
    cols: L3("Bo'limlar hali yonma-yon emas. Har bir ustunga md:col-6 bering.", 'Разделы ещё не рядом. Дай каждой колонке md:col-6.', 'The sections aren’t side by side yet. Give each column md:col-6.'),
    drill: L3("endi birinchi ustundagi so'zni tuzating", 'теперь почини слово у первой колонки', 'now fix the word on the first column'),
    drillNo: L3("md va col o'rtasida chiziqcha emas, ikki nuqta turadi: md:col-4.", 'Между md и col не чёрточка, а двоеточие: md:col-4.', 'Between md and col there’s a colon, not a dash: md:col-4.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki! Unda uchta bo'lim bor, lekin class qiymatlari bo'sh. To'rni o'zingiz quring: tashqi div sahifani o'rtaga yig'sin, keyingisi qator bo'lsin, uchta ustun esa planshet va kompyuterda yonma-yon, telefonda ustma-ust tursin.",
      'Пятая страница твоя! В ней три раздела, но class пустые. Построй сетку сам: внешний div собирает страницу посередине, следующий — ряд, а три колонки на планшете и компьютере стоят рядом, а на телефоне — друг под другом.',
      'The fifth page is yours! It has three sections, but the classes are empty. Build the grid yourself: the outer div centers the page, the next one is a row, and the three columns sit side by side on a tablet and computer but stack on a phone.'),
    ask: L3("O'z sahifangizning to'rini quring", 'Построй сетку своей страницы', 'Build your page’s grid'),
    ok: L3("Vau, haqiqiy to'r! Bu sahifa har qanday ekranga moslashadi!", 'Вау, настоящая сетка! Эта страница подстроится под любой экран!', 'Wow, a real grid! This page adapts to any screen!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Tashqi div tegidan boshlang: unga sahifani o'rtaga yig'adigan so'z kerak.", 'Посмотри на список: четыре условия. Начни с внешнего div: ему нужно слово, которое собирает страницу посередине.', 'Look at the list: four conditions. Start with the outer div: it needs the word that centers the page.'),
      L3("Tashqi div tegiga container, keyingisiga row, uchta ustunga esa md:col-4 yozing.", 'Внешнему div — container, следующему — row, а трём колонкам — md:col-4.', 'Give the outer div container, the next one row, and the three columns md:col-4.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda o'z sahifangizga yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши в таком же порядке на своей странице и нажми «Проверить».', 'The example is under the code. Write it in the same order on your page and tap Check.')
    ],
    cont: L3("Tashqi div tegiga container so'zi kerak: u sahifani o'rtaga yig'adi.", 'Внешнему div нужно слово container: оно собирает страницу посередине.', 'The outer div needs the word container: it centers the page.'),
    row: L3("Ustunlarni o'rab turgan div tegiga row so'zi kerak.", 'Тегу div вокруг колонок нужно слово row.', 'The div around the columns needs the word row.'),
    cols: L3("Uchta ustun hali yonma-yon emas. Har biriga ustun so'zini bering.", 'Три колонки ещё не рядом. Дай каждой слово колонки.', 'The three columns aren’t side by side yet. Give each one a column word.'),
    md: L3("Ustunlar telefonda ham yonma-yon qoladi va tor bo'ladi. Ularga md bilan so'z bering: md:col-4.", 'Колонки останутся рядом и на телефоне — там они будут узкими. Дай им слово с md: md:col-4.', 'The columns will stay side by side on a phone too, where they’re narrow. Give them a word with md: md:col-4.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma sahifalar to'rga tushdi! Qarang, bu sizning sahifangiz.", 'Все страницы снова в сетке! Смотри, это твоя страница.', 'All the pages are on the grid again! Look, this is your page.') },
      { k: 'a', text: L3("container sahifani o'rtaga yig'adi va kengligini cheklaydi.", 'container собирает страницу посередине и ограничивает ширину.', 'container centers the page and limits its width.') },
      { k: 'b', text: L3("row qator yasaydi, ustunlar esa uning o'n ikki bo'lagini bo'lishadi.", 'row делает ряд, а колонки делят его двенадцать частей.', 'row makes a row, and the columns share its twelve parts.') },
      { k: 'c', text: L3("md:col-4 kabi so'z ekranga qarab ishlaydi: telefonda ustma-ust, kompyuterda yonma-yon.", 'Слово вроде md:col-4 работает по экрану: на телефоне столбиком, на компьютере рядом.', 'A word like md:col-4 depends on the screen: stacked on a phone, side by side on a computer.') },
      { k: 'd', text: L3("So'zlar saytning Layout bo'limida, eski col-md nomlari esa ishlamaydi.", 'Слова — в разделе Layout на сайте, а старые имена col-md не работают.', 'The words are in the Layout section of the site, and old col-md names don’t work.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda Bootstrap formalarini yasaymiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке соберём формы Bootstrap. До встречи!', 'Congratulations! Next lesson we’ll build Bootstrap forms. See you!') }
    ],
    roles: {
      a: L3("container: o'rtada", 'container: посередине', 'container: centered'),
      b: L3("row · col: 12 bo'lak", 'row · col: 12 частей', 'row · col: 12 parts'),
      c: L3("md:col-4: ekranga qarab", 'md:col-4: по экрану', 'md:col-4: by screen'),
      d: L3("So'zlar Layout da", 'Слова в Layout', 'Words are in Layout')
    },
    ask: L3("Sahifangizga qarang", 'Посмотри на свою страницу', 'Look at your page')
  }
};
