// =============================================================================
// ===== ПРАКТИКА 4 · «Hammasi qatorda» · к уроку 4 «Flex» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Сайт кружка роботов: шапка (логотип, название, кнопка) и ряд роботов. При обновлении у блоков
// пропали слова flex — всё встало столбиком, вкладки погасли. Ученик расставляет пять страниц: поменять слово
// главной оси в готовом class (justify-content-start → between) → вписать в пустой class ряд и промежуток (d-flex gap-5) →
// взять пример с сайта (Utilities → Justify content) и настроить: меню по центру, свои пункты → починить две типичные
// ошибки урока (justify-content-space-between, gap-16) → своя страница на телефоне: шапка в ряд по краям и по центру
// высоты, ряд роботов с промежутком, который переносится (flex-wrap). Окно страницы — своей ширины, как в уроке 4.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-04p-flex.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-04p-flex',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "4-amaliyot. Hammasi qatorda", ru: 'Практика 4. Всё в ряд', en: 'Practice 4. All in a row' }
};

// Картинки сайта (те же рисунки, что в уроке 4: tools/bs4/bs4-kit.jsx).
const P4_SVG_NS = 'http:' + '\u002F\u002F' + 'www.w3.org/2000/svg';
const p4Svg = (w, h, inner) => 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='" + P4_SVG_NS + "' width='" + w + "' height='" + h + "' viewBox='0 0 " + w + ' ' + h + "'>" + inner + '</svg>');
const P4_ROBOT = (x, y, k, c) => "<g transform='translate(" + x + ' ' + y + ') scale(' + k + ")'><line x1='60' y1='-6' x2='60' y2='-30' stroke='#475569' stroke-width='6'/><circle cx='60' cy='-34' r='9' fill='" + c + "'/>"
  + "<rect x='0' y='0' width='120' height='92' rx='22' fill='#E2E8F0' stroke='#475569' stroke-width='6'/><rect x='18' y='20' width='84' height='44' rx='14' fill='#1E293B'/><circle cx='42' cy='42' r='9' fill='#38BDF8'/><circle cx='78' cy='42' r='9' fill='#38BDF8'/>"
  + "<rect x='10' y='102' width='100' height='86' rx='18' fill='" + c + "' stroke='#475569' stroke-width='6'/><rect x='38' y='124' width='44' height='26' rx='6' fill='#FDE68A'/><circle cx='30' cy='202' r='16' fill='#334155'/><circle cx='90' cy='202' r='16' fill='#334155'/></g>";
const P4_FILES = {
  'logo.png': p4Svg(56, 56, "<rect width='56' height='56' rx='14' fill='#FA4F28'/>" + P4_ROBOT(16, 10, 0.2, '#FDE68A')),
  'r1.png': p4Svg(150, 150, "<rect width='150' height='150' fill='#E0F2FE'/>" + P4_ROBOT(42, 22, 0.55, '#0FA38E')),
  'r2.png': p4Svg(150, 150, "<rect width='150' height='150' fill='#F3E8FF'/>" + P4_ROBOT(42, 22, 0.55, '#7c3aed')),
  'r3.png': p4Svg(150, 150, "<rect width='150' height='150' fill='#FFEDD5'/>" + P4_ROBOT(42, 22, 0.55, '#FA4F28')),
};

const P4 = {
  club: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
  headT: L3("Shapka", 'Шапка', 'Header'),
  rowT: L3("Robotlar", 'Роботы', 'Robots'),
  menuT: L3("Menyu", 'Меню', 'Menu'),
  fixT: L3("Aloqa", 'Контакты', 'Contacts'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'),
  join: L3("Yozilish", 'Записаться', 'Join'),
  m1: L3("Bosh sahifa", 'Главная', 'Home'), m2: L3("Jadval", 'Расписание', 'Schedule'), m3: L3("Aloqa", 'Контакты', 'Contacts'),
  ali: L3("Ali", 'Али', 'Ali'), vali: L3("Vali", 'Вали', 'Vali'), lola: L3("Lola", 'Лола', 'Lola'),
  myTeam: L3("Mening jamoam", 'Моя команда', 'My team')
};
const P4_ITEM = 'Flex item';
const p4Wrap = (cls, kids, ind) => { const s = ind == null ? '  ' : ind; return s + '<div class="' + cls + '">\n' + kids.map((k) => s + '  ' + k).join('\n') + '\n' + s + '</div>'; };
const p4Head = (pk) => ['<img src="logo.png" alt="Logo">', '<h4>' + pk(P4.club) + '</h4>', '<button class="btn-solid theme-success">' + pk(P4.join) + '</button>'];
const P4_ROBOTS = ['<img src="r1.png" alt="Robot">', '<img src="r2.png" alt="Robot">', '<img src="r3.png" alt="Robot">'];
const p4Menu = (pk, a) => (a || [P4.m1, P4.m2, P4.m3]).map((x) => '<div>' + (typeof x === 'string' ? x : pk(x)) + '</div>');
const p4Pre = ['<head>', '  ' + BP_LINK, '</head>', '<body>'];
const P4_POST = ['</body>'];
// Сайт: пример Justify content и слова разделов Flex.
const P4_SITE = '<div class="d-flex justify-content-start gap-3">\n  <div>' + P4_ITEM + '</div>\n  <div>' + P4_ITEM + '</div>\n  <div>' + P4_ITEM + '</div>\n</div>';
const P4_JC = ['justify-content-start', 'justify-content-center', 'justify-content-end', 'justify-content-between'];
const P4_DOCS_JC = { page: L3("Utilities · Justify content", 'Utilities · Justify content', 'Utilities · Justify content'), items: [
  { k: 'jc', title: 'Justify content · HTML', code: P4_SITE },
  { k: 'w', title: 'Justify content', chips: P4_JC, copy: false }
] };
const P4_DOCS_FIX = { page: L3("Utilities · Justify content · Gap", 'Utilities · Justify content · Gap', 'Utilities · Justify content · Gap'), items: [
  { k: 'jc', title: 'Justify content', chips: P4_JC, copy: false },
  { k: 'gap', title: 'Gap: 0 … 12', chips: ['gap-3', 'gap-5', 'gap-9'], copy: false }
] };
const P4_DOCS_OWN = { page: L3("Utilities · Flex", 'Utilities · Flex', 'Utilities · Flex'), items: [
  { k: 'f', title: 'Flex', chips: ['d-flex', 'flex-wrap'], copy: false },
  { k: 'jc', title: 'Justify content', chips: P4_JC, copy: false },
  { k: 'ai', title: 'Align items', chips: ['align-items-start', 'align-items-center', 'align-items-end'], copy: false },
  { k: 'gap', title: 'Gap', chips: ['gap-3', 'gap-5', 'gap-9'], copy: false }
] };
const p4Row = (D) => D.q('body > div');
const p4Rows = (D) => D.qa('body > div');
const p4Gap = (e) => !!e && Array.from(e.classList).some((c) => /^gap-\d+$/.test(c) && c !== 'gap-0');
const p4Items = (D, e) => (e ? Array.from(e.children) : []);

const PR = {
  next: L3("Kartochkalar", 'Карточки', 'Cards'),
  files: P4_FILES,
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P4.headT, file: 'shapka.html' },
    { ico: 'heart', c: '#0FA38E', name: P4.rowT, file: 'robotlar.html' },
    { ico: 'book', c: '#7C5CFA', name: P4.menuT, file: 'menyu.html' },
    { ico: 'mail', c: '#F59E0B', name: P4.fixT, file: 'aloqa.html' },
    { ico: 'rocket', c: '#E44D8A', name: P4.mine, file: 'my.html' }
  ],
  // Крючок: шапка в ряд и ряд роботов; после «Yangilash» слов flex нет — всё столбиком.
  hook: {
    vw: 540,
    doc: (pk, on) => p4Pre.concat([p4Wrap(on ? 'd-flex justify-content-between align-items-center' : '', p4Head(pk).slice(0, 2)),
      p4Wrap(on ? 'd-flex gap-5 mt-5' : 'mt-5', P4_ROBOTS), '</body>']).join('\n').replace(/ class=""/g, '')
  },
  ownVw: 360,
  ownDefault: (pk) => p4Pre.concat([p4Wrap('d-flex justify-content-between align-items-center', p4Head(pk).slice(0, 2).concat([])).replace(pk(P4.club), pk(P4.myTeam)),
    p4Wrap('d-flex flex-wrap gap-5 mt-5', P4_ROBOTS), '</body>']).join('\n'),
  tasks: [
    // Т1 · слово главной оси в готовом class: шапка по краям (justify-content-start → justify-content-between).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 540, pre: p4Pre, post: P4_POST,
      code0: p4Wrap('d-flex justify-content-start align-items-center', p4Head(pk)), answer: p4Wrap('d-flex justify-content-between align-items-center', p4Head(pk)),
      goal: (D) => (D.has(p4Row(D), 'justify-content-between') ? null : D.has(p4Row(D), 'justify-content-around') || D.has(p4Row(D), 'justify-content-evenly') ? C.t1.around : C.t1.no),
      sample: ['<div class="d-flex justify-content-center">'],
      drill: { code0: p4Wrap('d-flex justify-content-start gap-3', p4Menu(pk)), answer: p4Wrap('d-flex justify-content-end gap-3', p4Menu(pk)),
        goal: (D) => (D.has(p4Row(D), 'justify-content-end') ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class: роботы в ряд с промежутком (d-flex gap-5).
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 600, pre: p4Pre.concat(['  <h4>' + pk(P4.rowT) + '</h4>']), post: P4_POST,
      code0: p4Wrap('', P4_ROBOTS), answer: p4Wrap('d-flex gap-5', P4_ROBOTS),
      goal: (D) => { const e = p4Row(D); if (!D.has(e, 'd-flex')) return C.t2.noFlex; return p4Gap(e) ? null : C.t2.noGap; },
      sample: ['<div class="d-flex gap-9">'],
      drill: { code0: p4Wrap('', ['<div class="p-3 bg-warning">' + pk(P4.ali) + '</div>', '<div class="p-3 bg-warning">' + pk(P4.vali) + '</div>', '<div class="p-3 bg-warning">' + pk(P4.lola) + '</div>']),
        answer: p4Wrap('d-flex gap-3', ['<div class="p-3 bg-warning">' + pk(P4.ali) + '</div>', '<div class="p-3 bg-warning">' + pk(P4.vali) + '</div>', '<div class="p-3 bg-warning">' + pk(P4.lola) + '</div>']),
        goal: (D) => { const e = p4Row(D); return D.has(e, 'd-flex') && p4Gap(e) ? null : C.t2.drillNo; } }
    }),
    // Т3 · пример с сайта (Justify content): скопировать, вставить, меню по центру и свои пункты.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 540, pre: p4Pre.concat(['  <h4>' + pk(P4.club) + '</h4>']), post: P4_POST, docs: () => P4_DOCS_JC,
      code0: '', answer: p4Wrap('d-flex justify-content-center gap-3', p4Menu(pk)),
      goal: (D) => {
        const e = p4Row(D);
        if (!e) return C.t3.noRow;
        if (!D.has(e, 'd-flex')) return C.t3.noFlex;
        if (p4Items(D, e).some((x) => x.textContent.trim() === P4_ITEM)) return C.t3.sample;
        if (p4Items(D, e).length < 3) return C.t3.three;
        return D.has(e, 'justify-content-center') ? null : C.t3.notCenter;
      },
      sample: ['<div class="d-flex justify-content-end gap-3">', '  <div>…</div>', '</div>'],
      drill: { code0: '', answer: p4Wrap('d-flex justify-content-between', p4Menu(pk, ['Ali', 'Vali', 'Lola'])),
        goal: (D) => { const e = p4Row(D); return e && D.has(e, 'd-flex') && D.has(e, 'justify-content-between') && !p4Items(D, e).some((x) => x.textContent.trim() === P4_ITEM) ? null : C.t3.drillNo; } }
    }),
    // Т4 · две ошибки урока: justify-content-space-between (значение CSS) и gap-16 (пиксели вместо номера).
    (pk) => bpTask(4, {
      kind: 'fix', vw: 540, pre: p4Pre, post: P4_POST, docs: () => P4_DOCS_FIX,
      code0: [p4Wrap('d-flex justify-content-space-between align-items-center', p4Head(pk)), p4Wrap('d-flex gap-16 mt-5', P4_ROBOTS)].join('\n'),
      answer: [p4Wrap('d-flex justify-content-between align-items-center', p4Head(pk)), p4Wrap('d-flex gap-5 mt-5', P4_ROBOTS)].join('\n'),
      goal: (D) => {
        const r = p4Rows(D);
        if (!D.has(r[0], 'justify-content-between')) return C.t4.head;
        return D.has(r[1], 'd-flex') && p4Gap(r[1]) ? null : C.t4.gap;
      },
      sample: ['<div class="d-flex justify-content-between">', '<div class="d-flex gap-9">'],
      drill: { code0: p4Wrap('d-flex justify-content-between align-items-middle', p4Head(pk)), answer: p4Wrap('d-flex justify-content-between align-items-center', p4Head(pk)),
        goal: (D) => (D.has(p4Row(D), 'align-items-center') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница на телефоне: шапка в ряд (по краям, по центру высоты), роботы в ряд с промежутком и переносом.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 360, pre: p4Pre, post: P4_POST, docs: () => P4_DOCS_OWN,
      code0: [p4Wrap('', ['<img src="logo.png" alt="Logo">', '<h4>' + pk(P4.myTeam) + '</h4>']), p4Wrap('mt-5', P4_ROBOTS)].join('\n'),
      answer: [p4Wrap('d-flex justify-content-between align-items-center', ['<img src="logo.png" alt="Logo">', '<h4>' + pk(P4.myTeam) + '</h4>']),
        p4Wrap('d-flex flex-wrap gap-5 mt-5', P4_ROBOTS)].join('\n'),
      list: [
        { t: L3("shapka: d-flex va between", 'шапка: d-flex и between', 'header: d-flex and between'), ok: (D) => D.has(p4Rows(D)[0], 'd-flex') && D.has(p4Rows(D)[0], 'justify-content-between') },
        { t: L3("shapka: align-items-center", 'шапка: align-items-center', 'header: align-items-center'), ok: (D) => D.has(p4Rows(D)[0], 'align-items-center') },
        { t: L3("robotlar: d-flex va gap", 'роботы: d-flex и gap', 'robots: d-flex and gap'), ok: (D) => D.has(p4Rows(D)[1], 'd-flex') && p4Gap(p4Rows(D)[1]) },
        { t: L3("robotlar sig'adi: flex-wrap", 'роботы помещаются: flex-wrap', 'robots fit: flex-wrap'), ok: (D) => D.has(p4Rows(D)[1], 'd-flex') && D.qa('img').every((i) => D.fits(i)) }
      ],
      goal: (D) => {
        const r = p4Rows(D);
        if (r.length < 2) return C.t5.blocks;
        if (!D.has(r[0], 'd-flex')) return C.t5.headFlex;
        if (!D.has(r[0], 'justify-content-between')) return C.t5.headBetween;
        if (!D.has(r[0], 'align-items-center')) return C.t5.headAlign;
        if (!D.has(r[1], 'd-flex')) return C.t5.rowFlex;
        if (!p4Gap(r[1])) return C.t5.rowGap;
        if (!D.qa('img').every((i) => D.fits(i))) return C.t5.wrap;
        return null;
      },
      sample: ['<div class="d-flex justify-content-between align-items-center">', '  …', '</div>', '<div class="d-flex flex-wrap gap-9">', '  …', '</div>'],
      onSolved: (st) => store.set('myDoc', p4Pre.concat([st.code.replace(/\s+$/, ''), '</body>']).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    say: L3("Salom! Bu robot to'garagi saytining boshi. Qarang: logotip, nom va tugma bir qatorda, robotlar ham yonma-yon turibdi. Buni Bootstrapning flex so'zlari qildi. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это верх сайта кружка роботов. Смотри: логотип, название и кнопка в одном ряду, роботы тоже стоят рядом. Это сделали слова flex из Bootstrap. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is the top of the robot club website. Look: the logo, the name and the button sit in one row, and the robots stand side by side too. Bootstrap’s flex words did that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda div teglarining class so'zlari o'chib ketdi. Hamma narsa ustma-ust tushib qoldi, varaqlar o'chdi.",
      'Ой! При обновлении у тегов div стёрлись слова в class. Всё встало друг под другом, вкладки погасли.',
      'Oh no! The update erased the class words of the div tags. Everything stacked up, and the tabs went dark.'),
    done: L3("Kodga qarang: div teglarida class yo'q. Flex bo'lmasa, bloklar o'z-o'zidan ustma-ust turadi. Beshta sahifadagi qatorlarni birma-bir tiklaymiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: у тегов div нет class. Без flex блоки сами встают друг под другом. Вернём ряды на пяти страницах по одной, а последняя будет твоей.',
      'Look at the code: the div tags have no class. Without flex, blocks stack on their own. Let’s bring the rows back on five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi qatorlarni tiklaymiz", 'Вернём ряды на пяти страницах', 'Let’s bring back the rows on five pages')
  },
  t1: {
    eyebrow: L3("Shapka", 'Шапка', 'Header'),
    say: L3("Birinchi sahifa: shapka. Qator qaytdi, lekin hammasi chap tomonga yopishib qolgan. O'ng tomon bo'm-bo'sh. Logotip chap chetda, tugma esa o'ng chetda tursin. Asosiy o'q bo'yicha joylash so'zini almashtiring.",
      'Первая страница: шапка. Ряд вернулся, но всё прижалось влево, а справа пусто. Пусть логотип стоит у левого края, а кнопка — у правого. Замени слово расстановки по главной оси.',
      'The first page is the header. The row is back, but everything is pressed to the left, and the right is empty. Let the logo stand at the left edge and the button at the right edge. Change the main axis placement word.'),
    ask: L3("Logotip chapda, tugma o'ng chetda tursin", 'Логотип слева, кнопка у правого края', 'Logo on the left, button at the right edge'),
    ok: L3("Zo'r! Shapka endi butun kenglikda, xuddi haqiqiy saytlardagidek!", 'Здорово! Шапка теперь на всю ширину, как на настоящих сайтах!', 'Great! The header spans the whole width now, just like real websites!'),
    hints: [
      L3("class ichida justify-content-start turibdi: u hammasini boshiga yig'adi, ya'ni chapga degani. Chetlarga tarqatadigan boshqa so'z kerak.", 'В class стоит justify-content-start: он собирает всё в начало, то есть влево. Нужно другое слово — разводящее по краям.', 'class has justify-content-start: it gathers everything at the start, the left. You need another word that spreads things to the edges.'),
      L3("Chetlarga tarqatish CSS da space-between edi. Bootstrapda u qisqaroq: justify-content-between.", 'Развести по краям в CSS — это space-between. В Bootstrap короче: justify-content-between.', 'Spreading to the edges in CSS was space-between. In Bootstrap it’s shorter: justify-content-between.'),
      L3("Namuna kod ostida: u bolalarni o'rtaga yig'adi. Xuddi shunday joylash so'zini almashtiring va Tekshirishni bosing.", 'Образец под кодом собирает детей по центру. Так же замени слово расстановки и нажми «Проверить».', 'The example under the code gathers the children in the middle. Change the placement word the same way and tap Check.')
    ],
    no: L3("Tugma hali o'ng chetda emas. Chetlarga tarqatish uchun justify-content-between kerak.", 'Кнопка ещё не у правого края. Чтобы развести по краям, нужно justify-content-between.', 'The button isn’t at the right edge yet. To spread things to the edges, you need justify-content-between.'),
    around: L3("Bu so'z ham tarqatadi, lekin chetlarda ham bo'sh joy qoldiradi. Logotip aynan chetda tursin: between.", 'Это слово тоже разводит, но оставляет место и у краёв. Пусть логотип стоит прямо у края: between.', 'This word spreads things too, but leaves space at the edges. Let the logo sit right at the edge: between.'),
    drill: L3("endi menyu o'ng tomonga yig'ilsin", 'теперь пусть меню соберётся справа', 'now gather the menu on the right'),
    drillNo: L3("Menyu hali o'ngda emas. Oxiriga yig'ish so'zi justify-content-end.", 'Меню ещё не справа. Слово «собрать в конец» — justify-content-end.', 'The menu isn’t on the right yet. The word for gathering at the end is justify-content-end.')
  },
  t2: {
    eyebrow: L3("Robotlar", 'Роботы', 'Robots'),
    say: L3("Ikkinchi sahifa: robotlar. Uchta robot ustma-ust turibdi, sahifa esa juda uzun bo'lib ketdi. Ular yonma-yon tursin va bir-biriga yopishmasin. div tegining class qiymatiga ikki so'z kerak: biri qator yasaydi, ikkinchisi oraliq beradi.",
      'Вторая страница: роботы. Три робота стоят друг под другом, и страница стала очень длинной. Пусть они встанут в ряд и не слипаются. В class тега div нужны два слова: одно делает ряд, второе даёт промежуток.',
      'The second page is the robots. Three robots are stacked, and the page got very long. Let them stand in a row without sticking together. The div’s class needs two words: one makes the row, the other adds the gap.'),
    ask: L3("Robotlar yonma-yon tursin, bir-biriga yopishmasin", 'Пусть роботы стоят в ряд с промежутками', 'Put the robots in a row with gaps'),
    ok: L3("Ajoyib! Uchala robot qatorda, oralari ham chiroyli!", 'Отлично! Все три робота в ряд, и промежутки красивые!', 'Great! All three robots are in a row with nice gaps!'),
    hints: [
      L3("Darsdagi pult esingizdami? Qatorni qaysi so'z yasar edi? Oraliqni esa qaysi so'z berar edi?", 'Вспомни пульт из урока: какое слово делало ряд? А какое давало промежуток?', 'Remember the panel from the lesson: which word made the row? And which one gave the gap?'),
      L3("Qator so'zi d-flex, ya'ni display flex degani. Oraliq so'zi gap va jadvaldagi raqam, masalan gap-5. Ularni bo'sh joy bilan yozing.", 'Слово ряда — d-flex, то есть display flex. Слово промежутка — gap и номер из таблицы, например gap-5. Напиши их через пробел.', 'The row word is d-flex, short for display flex. The gap word is gap plus a number from the table, for example gap-5. Write them with a space.'),
      L3("Namuna kod ostida. Xuddi shunday ikki so'zni robotlar uchun yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши два слова для роботов и нажми «Проверить».', 'The example is under the code. Write the two words for the robots the same way and tap Check.')
    ],
    noFlex: L3("Robotlar hali ustma-ust. Qator uchun d-flex so'zi kerak.", 'Роботы всё ещё друг под другом. Для ряда нужно слово d-flex.', 'The robots are still stacked. A row needs the word d-flex.'),
    noGap: L3("Qator chiqdi, lekin robotlar bir-biriga yopishib qoldi. gap so'zini raqami bilan qo'shing.", 'Ряд есть, но роботы слиплись. Добавь слово gap с номером.', 'The row is there, but the robots are stuck together. Add the word gap with a number.'),
    drill: L3("endi bu uchta qutini ham yonma-yon, oraliq bilan qo'ying", 'теперь поставь и эти три коробки в ряд с промежутками', 'now put these three boxes in a row with gaps too'),
    drillNo: L3("Qutilar uchun ham ikki so'z kerak: d-flex va gap raqami bilan.", 'Коробкам тоже нужны два слова: d-flex и gap с номером.', 'The boxes also need two words: d-flex and gap with a number.')
  },
  t3: {
    eyebrow: L3("Menyu", 'Меню', 'Menu'),
    say: L3("Uchinchi sahifa: menyu. Bu yerda menyu umuman yo'q. Bootstrap saytining Justify content sahifasida tayyor misol bor: nusxalang va qo'ying. Keyin moslang: menyu o'rtada tursin, uchta bandi esa saytimizniki bo'lsin: Bosh sahifa, Jadval, Aloqa.",
      'Третья страница: меню. Здесь меню нет совсем. На странице Justify content сайта Bootstrap есть готовый пример: скопируй и вставь. Потом настрой: меню по центру, а три пункта — наши: Главная, Расписание, Контакты.',
      'The third page is the menu. There’s no menu here at all. The Justify content page of the Bootstrap site has a ready example: copy and paste it. Then adjust it: center the menu and make the three items ours: Home, Schedule, Contacts.'),
    ask: L3("Saytdan misol oling: menyu o'rtada, bandlari bizniki", 'Возьми пример с сайта: меню по центру, пункты наши', 'Take the site’s example: menu centered, items ours'),
    ok: L3("Qoyil! Saytdagi misol haqiqiy menyuga aylandi!", 'Вот это да! Пример с сайта стал настоящим меню!', 'Wow! The site’s example became a real menu!'),
    hints: [
      L3("Ish ikki qadamda: oldin misolni nusxalab, Qo'yish tugmasi bilan qo'ying, keyin uni moslang: joylash so'zini va uchta yozuvni.", 'Работа в два шага: сначала скопируй пример и вставь кнопкой «Вставить», потом настрой: слово расстановки и три надписи.', 'It’s two steps: first copy the example and paste it with the Paste button, then adjust it: the placement word and the three labels.'),
      L3("O'rtaga yig'ish so'zi justify-content-center: uni start o'rniga yozing. Flex item yozuvlari o'rniga esa menyu bandlarini yozing.", 'Слово «собрать по центру» — justify-content-center: напиши его вместо start. А вместо надписей Flex item напиши пункты меню.', 'The word for centering is justify-content-center: write it instead of start. And write the menu items instead of the Flex item labels.'),
      L3("Namuna kod ostida. Xuddi shunday menyuni o'rtada, o'z bandlaringiz bilan yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такое же меню по центру и со своими пунктами и нажми «Проверить».', 'The example is under the code. Write the same menu, centered and with your own items, and tap Check.')
    ],
    noRow: L3("Sahifada menyu hali yo'q. Saytdan misolni nusxalang va Qo'yish tugmasini bosing.", 'На странице пока нет меню. Скопируй пример с сайта и нажми «Вставить».', 'There’s no menu on the page yet. Copy the example from the site and tap Paste.'),
    noFlex: L3("Bandlar ustma-ust turibdi. Ota div tegiga d-flex so'zi kerak.", 'Пункты стоят друг под другом. Родительскому div нужно слово d-flex.', 'The items are stacked. The parent div needs the word d-flex.'),
    sample: L3("Menyu bor, lekin bandlari hali saytdagidek Flex item. Ularning o'rniga Bosh sahifa, Jadval va Aloqa deb yozing.", 'Меню есть, но пункты ещё Flex item, как на сайте. Напиши вместо них Главная, Расписание и Контакты.', 'The menu is there, but the items still say Flex item, as on the site. Write Home, Schedule and Contacts instead.'),
    three: L3("Menyuda uchta band bo'lishi kerak. Ichki div teglaridan uchtasini qoldiring.", 'В меню должно быть три пункта. Оставь три внутренних тега div.', 'The menu needs three items. Keep three inner div tags.'),
    notCenter: L3("Menyu hali o'rtada emas. O'rtaga yig'ish so'zi justify-content-center.", 'Меню ещё не по центру. Слово «собрать по центру» — justify-content-center.', 'The menu isn’t centered yet. The centering word is justify-content-center.'),
    drill: L3("endi bu misoldan ism ro'yxati yasang: Ali, Vali, Lola — chetlarga tarqalib", 'теперь сделай из примера список имён: Али, Вали, Лола — по краям', 'now make a list of names from the example: Ali, Vali, Lola — spread to the edges'),
    drillNo: L3("Misolni yana nusxalang, joylash so'zini justify-content-between qiling va Flex item o'rniga ismlarni yozing.", 'Скопируй пример ещё раз, слово расстановки сделай justify-content-between, а вместо Flex item напиши имена.', 'Copy the example again, make the placement word justify-content-between, and write the names instead of Flex item.')
  },
  t4: {
    eyebrow: L3("Aloqa", 'Контакты', 'Contacts'),
    say: L3("To'rtinchi sahifa: aloqa. Bu yerni men o'zim CSS dan eslab yozibman, va ikki joyda adashibman. Shapka chetlarga tarqalmadi. Robotlar esa bir-biriga yopishib qoldi. Ikkala so'zni ham saytdagidek tuzating.",
      'Четвёртая страница: контакты. Здесь я писал сам, вспоминая CSS, и ошибся в двух местах. Шапка не разошлась по краям, а между роботами нет промежутка. Почини оба слова, как на сайте.',
      'The fourth page is contacts. I wrote it myself from what I remember of CSS, and slipped up in two places. The header didn’t spread to the edges, and the robots have no gap. Fix both words as on the site.'),
    ask: L3("Shapka chetlarga, robotlar oraliq bilan", 'Шапка — по краям, роботы — с промежутками', 'Header to the edges, robots with gaps'),
    ok: L3("Zo'r ish! Endi bilasiz: Bootstrap so'zlari CSS ga o'xshaydi, lekin qisqaroq!", 'Отличная работа! Теперь ты знаешь: слова Bootstrap похожи на CSS, но короче!', 'Nice work! Now you know: Bootstrap words look like CSS, but shorter!'),
    hints: [
      L3("Ikkita so'zga qarang: shapkadagi justify-content-space-between va robotlardagi gap-16. Ikkalasi ham CSS dan eslab yozilgan.", 'Посмотри на два слова: justify-content-space-between у шапки и gap-16 у роботов. Оба написаны по памяти о CSS.', 'Look at two words: justify-content-space-between on the header and gap-16 on the robots. Both were written from CSS memory.'),
      L3("Bootstrapda space qismi yo'q: justify-content-between. gap dagi son esa piksel emas, jadvaldagi o'rin: o'n oltilik piksel oraliq gap-5 bo'ladi.", 'В Bootstrap нет части space: justify-content-between. А число в gap — не пиксели, а место в таблице: промежуток в шестнадцать пикселей — это gap-5.', 'Bootstrap has no space part: justify-content-between. And the number in gap isn’t pixels but a place in the table: a sixteen-pixel gap is gap-5.'),
      L3("Namuna kod ostida. Xuddi shunday ikkala so'zni tuzating va Tekshirishni bosing.", 'Образец под кодом. Так же почини оба слова и нажми «Проверить».', 'The example is under the code. Fix both words the same way and tap Check.')
    ],
    head: L3("Shapka hali chetlarga tarqalmadi. Unga justify-content-between kerak.", 'Шапка ещё не разошлась по краям. Ей нужно justify-content-between.', 'The header hasn’t spread to the edges yet. It needs justify-content-between.'),
    gap: L3("Robotlar hali bir-biriga yopishgan. gap ga jadvaldagi raqamni bering, masalan gap-5.", 'Между роботами ещё нет промежутка. Дай gap номер из таблицы, например gap-5.', 'There’s no gap between the robots yet. Give gap a number from the table, for example gap-5.'),
    drill: L3("endi shapkada logotip va nom bo'yi bo'yicha o'rtada tursin", 'теперь пусть в шапке логотип и название стоят по центру по высоте', 'now center the logo and the name by height in the header'),
    drillNo: L3("Bootstrapda middle so'zi yo'q. Bo'yi bo'yicha o'rtaga align-items-center qo'yadi.", 'В Bootstrap нет слова middle. По центру по высоте ставит align-items-center.', 'Bootstrap has no middle word. align-items-center centers things by height.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki, va u telefonda ochiladi! Shapkada logotip va jamoangiz nomi bor, pastda uchta robot. Shapka chetlarga tarqalsin va bo'yi bo'yicha o'rtada tursin. Robotlar qatorda, oraliq bilan tursin, sig'masa, pastga tushsin.",
      'Пятая страница твоя, и она открывается на телефоне! В шапке логотип и название твоей команды, ниже три робота. Шапка пусть разойдётся по краям и встанет по центру по высоте. Роботы — в ряд с промежутками, а если не помещаются, пусть переносятся вниз.',
      'The fifth page is yours, and it opens on a phone! The header has the logo and your team’s name, with three robots below. Spread the header to the edges and center it by height. Put the robots in a row with gaps, and if they don’t fit, let them move down.'),
    ask: L3("Telefon uchun o'z sahifangizni joylang", 'Расставь страницу под телефон', 'Lay out your page for a phone'),
    ok: L3("Vau! Telefonda ham hammasi o'z joyida, robotlar esa chiroyli pastga tushdi!", 'Вау! На телефоне всё на месте, а роботы красиво перенеслись вниз!', 'Wow! Everything’s in place on a phone, and the robots wrapped down nicely!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Oldin birinchi div tegiga shapka so'zlarini yozing: qator, chetlarga tarqatish va o'rtaga.", 'Посмотри на список: четыре условия. Сначала напиши первому div слова шапки: ряд, по краям и по центру.', 'Look at the list: four conditions. First give the first div the header words: row, spread to the edges and center.'),
      L3("Shapkaga d-flex, justify-content-between va align-items-center. Robotlarga d-flex, gap raqam bilan va flex-wrap, ya'ni sig'masa pastga o'tkaz degani.", 'Шапке — d-flex, justify-content-between и align-items-center. Роботам — d-flex, gap с номером и flex-wrap, то есть «не помещается — переноси вниз».', 'The header gets d-flex, justify-content-between and align-items-center. The robots get d-flex, gap with a number and flex-wrap, meaning “move down if it doesn’t fit”.'),
      L3("Namuna kod ostida. Xuddi shunday so'zlarni o'z sahifangizga yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такие же слова на своей странице и нажми «Проверить».', 'The example is under the code. Write the same words on your page and tap Check.')
    ],
    blocks: L3("Sahifada ikkita div bo'lishi kerak: shapka va robotlar. Ularni o'chirmang.", 'На странице должны быть два div: шапка и роботы. Не удаляй их.', 'The page needs two divs: the header and the robots. Don’t delete them.'),
    headFlex: L3("Shapka hali ustma-ust. Birinchi div tegiga d-flex so'zini bering.", 'Шапка ещё столбиком. Дай первому div слово d-flex.', 'The header is still stacked. Give the first div the word d-flex.'),
    headBetween: L3("Shapka qatorda, lekin chetlarga tarqalmagan. justify-content-between qo'shing.", 'Шапка в ряд, но не разошлась по краям. Добавь justify-content-between.', 'The header is a row, but it didn’t spread to the edges. Add justify-content-between.'),
    headAlign: L3("Logotip va nom bo'yi bo'yicha o'rtada emas. align-items-center qo'shing.", 'Логотип и название не по центру по высоте. Добавь align-items-center.', 'The logo and the name aren’t centered by height. Add align-items-center.'),
    rowFlex: L3("Robotlar hali ustma-ust. Ikkinchi div tegiga d-flex bering.", 'Роботы ещё столбиком. Дай второму div слово d-flex.', 'The robots are still stacked. Give the second div d-flex.'),
    rowGap: L3("Robotlar yopishib qoldi. gap so'zini raqami bilan qo'shing.", 'Роботы слиплись. Добавь gap с номером.', 'The robots are stuck together. Add gap with a number.'),
    wrap: L3("Uchinchi robot telefonga sig'madi va chetdan chiqib ketdi. Sig'magan narsani pastga o'tkazadigan so'z kerak: flex-wrap.", 'Третий робот не поместился в телефон и вылез за край. Нужно слово, которое переносит лишнее вниз: flex-wrap.', 'The third robot doesn’t fit the phone and sticks out. You need the word that moves things down: flex-wrap.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma sahifalarda qatorlar qaytdi! Qarang, bu sizning telefon uchun sahifangiz.", 'На всех страницах снова ряды! Смотри, это твоя страница для телефона.', 'The rows are back on every page! Look, this is your page for a phone.') },
      { k: 'a', text: L3("d-flex bolalarni bir qatorga qo'yadi.", 'd-flex ставит детей в один ряд.', 'd-flex puts the children in one row.') },
      { k: 'b', text: L3("justify-content chapdan o'ngga joylaydi, align-items esa tepadan pastga.", 'justify-content расставляет слева направо, а align-items — сверху вниз.', 'justify-content places things left to right, and align-items top to bottom.') },
      { k: 'c', text: L3("gap oraliq beradi, raqami esa jadvaldagi o'rin. flex-wrap sig'maganini pastga tushiradi.", 'gap даёт промежуток, а его число — место в таблице. flex-wrap переносит то, что не поместилось.', 'gap adds space, and its number is a place in the table. flex-wrap moves what doesn’t fit.') },
      { k: 'd', text: L3("So'zlar saytning Utilities bo'limida: ular CSS ga o'xshaydi, lekin qisqaroq.", 'Слова — в разделе Utilities на сайте: они похожи на CSS, но короче.', 'The words are in the Utilities section of the site: they look like CSS, but shorter.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda Bootstrap kartochkalarini yasaymiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке соберём карточки Bootstrap. До встречи!', 'Congratulations! Next lesson we’ll build Bootstrap cards. See you!') }
    ],
    roles: {
      a: L3("d-flex: qator", 'd-flex: ряд', 'd-flex: a row'),
      b: L3("justify va align: ikki o'q", 'justify и align: две оси', 'justify and align: two axes'),
      c: L3("gap va flex-wrap", 'gap и flex-wrap', 'gap and flex-wrap'),
      d: L3("So'zlar Utilities da", 'Слова в Utilities', 'Words are in Utilities')
    },
    ask: L3("Sahifangizga qarang", 'Посмотри на свою страницу', 'Look at your page')
  }
};
