// =============================================================================
// ===== ПРАКТИКА 5 · «Robotlar kartochkalari» · к уроку 5 «Карточки» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Страница роботов кружка — карточки (фото, имя, описание, кнопка). При обновлении у тегов
// пропали слова card — фото и текст рассыпались, вкладки погасли. Ученик восстанавливает пять страниц: поменять слово
// цвета в готовом class карточки (theme-primary → theme-success) → вписать card-body в пустой class (текст прилип к
// краям) → взять карточку с сайта (Components → Card): скопировать, вставить, настроить — фото robot3.jpg вместо "...",
// имя, описание, надпись кнопки → починить ошибки урока (файл без окончания, card-success) → своя страница: ряд из двух
// карточек d-flex gap-* (урок 4), у каждой фото, card-body, свой текст. Фото — рисунки урока 5 (robot1–3.jpg).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-05p-kartochki.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-05p-kartochki',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "5-amaliyot. Robotlar kartochkalari", ru: 'Практика 5. Карточки роботов', en: 'Practice 5. Robot cards' }
};

// Фото роботов (те же рисунки, что в уроке 5: tools/bs5/bs5-kit.jsx).
const P5_SVG_NS = 'http:' + '\u002F\u002F' + 'www.w3.org/2000/svg';
const p5Svg = (w, h, inner) => 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='" + P5_SVG_NS + "' width='" + w + "' height='" + h + "' viewBox='0 0 " + w + ' ' + h + "'>" + inner + '</svg>');
const P5_ROBOT = (x, y, k, c) => "<g transform='translate(" + x + ' ' + y + ') scale(' + k + ")'><line x1='60' y1='-6' x2='60' y2='-30' stroke='#475569' stroke-width='6'/><circle cx='60' cy='-34' r='9' fill='" + c + "'/>"
  + "<rect x='0' y='0' width='120' height='92' rx='22' fill='#E2E8F0' stroke='#475569' stroke-width='6'/><rect x='18' y='20' width='84' height='44' rx='14' fill='#1E293B'/><circle cx='42' cy='42' r='9' fill='#38BDF8'/><circle cx='78' cy='42' r='9' fill='#38BDF8'/>"
  + "<rect x='10' y='102' width='100' height='86' rx='18' fill='" + c + "' stroke='#475569' stroke-width='6'/><rect x='38' y='124' width='44' height='26' rx='6' fill='#FDE68A'/><circle cx='30' cy='202' r='16' fill='#334155'/><circle cx='90' cy='202' r='16' fill='#334155'/></g>";
const P5_FILES = {
  'robot1.jpg': p5Svg(320, 180, "<rect width='320' height='180' fill='#CFFAFE'/><rect y='150' width='320' height='30' fill='#86EFAC'/><circle cx='270' cy='40' r='20' fill='#FDE68A'/>" + P5_ROBOT(125, 22, 0.55, '#0FA38E')),
  'robot2.jpg': p5Svg(320, 180, "<rect width='320' height='180' fill='#EDE9FE'/><rect y='150' width='320' height='30' fill='#C4B5FD'/><circle cx='50' cy='40' r='16' fill='#fff'/>" + P5_ROBOT(125, 22, 0.55, '#7c3aed')),
  'robot3.jpg': p5Svg(320, 180, "<rect width='320' height='180' fill='#FFEDD5'/><rect y='150' width='320' height='30' fill='#FDBA74'/><circle cx='270' cy='36' r='18' fill='#fff7ed'/>" + P5_ROBOT(125, 22, 0.55, '#FA4F28')),
};

const P5 = {
  club: L3("Robotlarimiz", 'Наши роботы', 'Our robots'),
  n1: L3("Yashil chaqqon", 'Зелёный шустрик', 'Green Speedy'), d1: L3("Chiziq bo'ylab yuguradi.", 'Бегает по линии.', 'Runs along a line.'),
  n2: L3("Binafsha aqlli", 'Фиолетовый умник', 'Purple Brain'), d2: L3("To'siqni aylanib o'tadi.", 'Объезжает препятствия.', 'Drives around obstacles.'),
  n3: L3("To'q sariq kuchli", 'Оранжевый силач', 'Orange Strongman'), d3: L3("Yuk ko'taradi.", 'Поднимает грузы.', 'Lifts loads.'),
  more: L3("Batafsil", 'Подробнее', 'More'),
  t1: L3("Chaqqon", 'Шустрик', 'Speedy'), t2: L3("Aqlli", 'Умник', 'Brain'), t3: L3("Kuchli", 'Силач', 'Strongman'), t4: L3("Galereya", 'Галерея', 'Gallery'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'),
  my1: L3("Mening robotim", 'Мой робот', 'My robot'), myd: L3("U raqsga tusha oladi.", 'Он умеет танцевать.', 'It can dance.'),
  my2: L3("Do'stimning roboti", 'Робот моего друга', 'My friend’s robot'), myd2: L3("U qo'shiq aytadi.", 'Он поёт песни.', 'It sings songs.')
};
// Пример карточки с сайта (Components → Card, How it works) — как в уроке 5: src="..." — пустое место для своего файла.
const P5_T = 'Card title', P5_X = 'Some quick example text to build on the card title and make up the bulk of the card’s content.', P5_B = 'Go somewhere';
const P5_SITE = ['<section class="card" style="max-width: 320px">', '  <img src="..." class="card-img-top" alt="...">', '  <div class="card-body">',
  '    <h4 class="card-title">' + P5_T + '</h4>', '    <p class="card-text">' + P5_X + '</p>', '    <a href="#" class="btn-solid theme-primary">' + P5_B + '</a>', '  </div>', '</section>'].join('\n');
const p5Ind = (txt, ind) => txt.split('\n').map((l) => ind + l).join('\n');
// Карточка урока: max-width 240px, фото, card-body с именем, описанием и кнопкой. o: { card, img, body, src, file }.
const p5Card = (pk, n, d, o) => {
  const x = o || {};
  return ['<section class="' + (x.card != null ? x.card : 'card') + '" style="max-width: 240px">',
    '  <img src="' + (x.src || 'robot1.jpg') + '"' + (x.img === false ? '' : ' class="' + (x.img != null ? x.img : 'card-img-top') + '"') + ' alt="Robot">',
    '  <div' + (x.body === false ? '' : ' class="' + (x.body != null ? x.body : 'card-body') + '"') + '>',
    '    <h4 class="card-title">' + pk(n) + '</h4>', '    <p class="card-text">' + pk(d) + '</p>',
    '    <a href="#" class="btn-solid theme-primary">' + pk(P5.more) + '</a>', '  </div>', '</section>'].join('\n');
};
const P5_PRE = ['<head>', '  ' + BP_LINK, '</head>', '<body>'];
const P5_POST = ['</body>'];
const P5_FILES_CHIPS = { k: 'files', title: L3("Sizning fayllaringiz", 'Твои файлы', 'Your files'), chips: ['robot1.jpg', 'robot2.jpg', 'robot3.jpg'], copy: false };
const P5_DOCS_CARD = { page: L3("Components · Card", 'Components · Card', 'Components · Card'), items: [
  { k: 'card', title: 'Card · HTML', code: P5_SITE }, P5_FILES_CHIPS
] };
const P5_DOCS_FIX = { page: L3("Components · Card · Theme variants", 'Components · Card · Theme variants', 'Components · Card · Theme variants'), items: [
  { k: 'th', title: 'Theme variants', chips: ['card theme-primary', 'card theme-success', 'card theme-danger', 'card theme-warning'], copy: false }, P5_FILES_CHIPS
] };
const P5_DOCS_OWN = { page: L3("Components · Card", 'Components · Card', 'Components · Card'), items: [
  { k: 'card', title: 'Card · HTML', code: P5_SITE }, P5_FILES_CHIPS,
  { k: 'row', title: 'Flex · Gap', chips: ['d-flex', 'gap-5', 'gap-9'], copy: false }
] };
const p5Cards = (D) => D.qa('.card');
const p5Broken = (img) => !img || !img.naturalWidth;
const p5Sample = (D, c) => { const t = c.textContent; return t.indexOf(P5_T) >= 0 || t.indexOf('Some quick example') >= 0 || t.indexOf(P5_B) >= 0; };

const PR = {
  next: L3("Konteyner va to'r", 'Контейнер и сетка', 'Container and grid'),
  files: P5_FILES,
  tabs: [
    { ico: 'leaf', c: '#0FA38E', name: P5.t1, file: 'chaqqon.html' },
    { ico: 'star', c: '#7C5CFA', name: P5.t2, file: 'aqlli.html' },
    { ico: 'rocket', c: '#FA4F28', name: P5.t3, file: 'kuchli.html' },
    { ico: 'heart', c: '#F59E0B', name: P5.t4, file: 'galereya.html' },
    { ico: 'pin', c: '#E44D8A', name: P5.mine, file: 'my.html' }
  ],
  // Крючок: ряд из трёх карточек; после «Yangilash» у тегов нет слов card — фото и текст рассыпались.
  hook: {
    vw: 800,
    doc: (pk, on) => P5_PRE.concat(['  <div class="d-flex gap-5">',
      p5Ind(p5Card(pk, P5.n1, P5.d1, on ? { src: 'robot1.jpg' } : { src: 'robot1.jpg', card: '', img: false, body: false }), '    '),
      p5Ind(p5Card(pk, P5.n2, P5.d2, on ? { src: 'robot2.jpg' } : { src: 'robot2.jpg', card: '', img: false, body: false }), '    '),
      '  </div>', '</body>']).join('\n').replace(/ class=""/g, '')
  },
  ownVw: 800,
  ownDefault: (pk) => P5_PRE.concat(['  <div class="d-flex gap-5">', p5Ind(p5Card(pk, P5.my1, P5.myd, { src: 'robot1.jpg', card: 'card theme-success' }), '    '),
    p5Ind(p5Card(pk, P5.my2, P5.myd2, { src: 'robot2.jpg' }), '    '), '  </div>', '</body>']).join('\n'),
  tasks: [
    // Т1 · слово цвета карточки в готовом class: theme-primary → theme-success (Yashil chaqqon — зелёная).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 600, pre: P5_PRE, post: P5_POST,
      code0: p5Ind(p5Card(pk, P5.n1, P5.d1, { card: 'card theme-primary' }), '  '), answer: p5Ind(p5Card(pk, P5.n1, P5.d1, { card: 'card theme-success' }), '  '),
      goal: (D) => (D.theme('.card') === 'success' ? null : D.bg('.card') ? C.t1.bg : C.t1.no),
      sample: ['<section class="card theme-danger" style="max-width: 240px">'],
      drill: { code0: p5Ind(p5Card(pk, P5.n2, P5.d2, { src: 'robot2.jpg', card: 'card theme-primary' }), '  '), answer: p5Ind(p5Card(pk, P5.n2, P5.d2, { src: 'robot2.jpg', card: 'card theme-accent' }), '  '),
        goal: (D) => (D.theme('.card') === 'accent' ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class: текст прилип к краям — div с card-body.
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 600, pre: P5_PRE, post: P5_POST,
      code0: p5Ind(p5Card(pk, P5.n2, P5.d2, { src: 'robot2.jpg', body: '' }), '  '), answer: p5Ind(p5Card(pk, P5.n2, P5.d2, { src: 'robot2.jpg' }), '  '),
      goal: (D) => (D.q('.card > .card-body') ? null : D.q('.card-title') && D.q('.card > div').className ? C.t2.other : C.t2.no),
      sample: ['<div class="card-body">', '  …', '</div>'],
      drill: { code0: p5Ind(p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg', img: '' }), '  '), answer: p5Ind(p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg' }), '  '),
        goal: (D) => (D.q('img.card-img-top') ? null : C.t2.drillNo) }
    }),
    // Т3 · карточка с сайта: скопировать, вставить, настроить — фото robot3.jpg, имя, описание, надпись кнопки.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 600, pre: P5_PRE, post: P5_POST, docs: () => P5_DOCS_CARD,
      code0: '', answer: p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg' }).replace('max-width: 240px', 'max-width: 320px'),
      goal: (D) => {
        const c = D.q('.card');
        if (!c) return C.t3.noCard;
        if (p5Broken(c.querySelector('img'))) return C.t3.src;
        if (c.textContent.indexOf(P5_T) >= 0) return C.t3.title;
        if (c.textContent.indexOf('Some quick example') >= 0) return C.t3.text;
        if (c.textContent.indexOf(P5_B) >= 0) return C.t3.btn;
        return null;
      },
      sample: ['<img src="robot1.jpg" class="card-img-top" alt="Robot">', '<h4 class="card-title">…</h4>'],
      drill: { code0: p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg' }), answer: p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg', card: 'card theme-warning' }),
        goal: (D) => (D.theme('.card') === 'warning' ? null : C.t3.drillNo) }
    }),
    // Т4 · ошибки урока: файл без окончания (robot2) и card-success вместо card theme-success.
    (pk) => bpTask(4, {
      kind: 'fix', vw: 800, pre: P5_PRE.concat(['  <div class="d-flex gap-5">']), post: ['  </div>', '</body>'], docs: () => P5_DOCS_FIX,
      code0: [p5Ind(p5Card(pk, P5.n1, P5.d1, { src: 'robot1.jpg', card: 'card card-success' }), '    '), p5Ind(p5Card(pk, P5.n2, P5.d2, { src: 'robot2' }), '    ')].join('\n'),
      answer: [p5Ind(p5Card(pk, P5.n1, P5.d1, { src: 'robot1.jpg', card: 'card theme-success' }), '    '), p5Ind(p5Card(pk, P5.n2, P5.d2, { src: 'robot2.jpg' }), '    ')].join('\n'),
      goal: (D) => {
        const cs = p5Cards(D);
        if (D.theme(cs[0]) !== 'success') return C.t4.color;
        return cs[1] && !p5Broken(cs[1].querySelector('img')) ? null : C.t4.src;
      },
      sample: ['<section class="card theme-danger" style="max-width: 240px">', '  <img src="robot3.jpg" class="card-img-top" alt="Robot">'],
      drill: { code0: p5Ind(p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg', card: 'card bg-warning' }), '    '), answer: p5Ind(p5Card(pk, P5.n3, P5.d3, { src: 'robot3.jpg', card: 'card theme-warning' }), '    '),
        goal: (D) => (D.theme('.card') === 'warning' ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: ряд из двух карточек (d-flex gap-*), у каждой фото, card-body и свой текст; одна — цветная.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 800, pre: P5_PRE, post: P5_POST, docs: () => P5_DOCS_OWN,
      code0: ['  <div class="">', '    ', '  </div>'].join('\n'),
      answer: ['  <div class="d-flex gap-5">', p5Ind(p5Card(pk, P5.my1, P5.myd, { src: 'robot1.jpg', card: 'card theme-success' }), '    '),
        p5Ind(p5Card(pk, P5.my2, P5.myd2, { src: 'robot2.jpg' }), '    '), '  </div>'].join('\n'),
      list: [
        { t: L3("2 ta card", '2 карточки card', '2 cards'), ok: (D) => p5Cards(D).length >= 2 },
        { t: L3("rasmlar chiqdi", 'фото на месте', 'photos show'), ok: (D) => p5Cards(D).length >= 2 && p5Cards(D).every((c) => !p5Broken(c.querySelector('img'))) },
        { t: L3("o'z matningiz", 'свой текст', 'your own text'), ok: (D) => p5Cards(D).length >= 2 && p5Cards(D).every((c) => !p5Sample(D, c)) },
        { t: L3("qatorda: d-flex va gap", 'в ряд: d-flex и gap', 'in a row: d-flex and gap'), ok: (D) => { const r = D.q('body > div'); return D.has(r, 'd-flex') && !!r && Array.from(r.classList).some((c) => /^gap-\d+$/.test(c)); } }
      ],
      goal: (D) => {
        const cs = p5Cards(D);
        if (cs.length < 2) return C.t5.two;
        if (!cs.every((c) => !p5Broken(c.querySelector('img')))) return C.t5.src;
        if (!cs.every((c) => !p5Sample(D, c))) return C.t5.text;
        const r = D.q('body > div');
        if (!D.has(r, 'd-flex')) return C.t5.row;
        if (!Array.from(r.classList).some((c) => /^gap-\d+$/.test(c))) return C.t5.gap;
        return null;
      },
      sample: ['<div class="d-flex gap-9">', '  <section class="card" …>', '    <img src="robot3.jpg" class="card-img-top" alt="Robot">', '    …', '  </section>', '  <section class="card" …>…</section>', '</div>'],
      onSolved: (st) => store.set('myDoc', P5_PRE.concat([st.code.replace(/\s+$/, ''), '</body>']).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Robotlarimiz", 'Наши роботы', 'Our robots'),
    say: L3("Salom! Bu sahifada to'garagimiz robotlari bor. Har bir robotning o'z kartochkasi: rasm, ism, qisqa ta'rif va tugma. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! На этой странице роботы нашего кружка. У каждого робота своя карточка: фото, имя, короткое описание и кнопка. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This page shows our club’s robots. Each robot has its own card: a photo, a name, a short description and a button. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda card so'zlari o'chib ketdi. Rasmlar va matnlar sochilib ketdi, varaqlar o'chdi.",
      'Ой! При обновлении стёрлись слова card. Фото и тексты рассыпались, вкладки погасли.',
      'Oh no! The update erased the card words. The photos and texts scattered, and the tabs went dark.'),
    done: L3("Kodga qarang: section, img va div teglarida class yo'q. Kartochkani card so'zlari yig'adi: card, card-img-top va card-body. Beshta sahifani birma-bir tiklaymiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: у тегов section, img и div нет class. Карточку собирают слова card: card, card-img-top и card-body. Восстановим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the section, img and div tags have no class. The card words build a card: card, card-img-top and card-body. Let’s restore five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi kartochkalarni tiklaymiz", 'Восстановим карточки на пяти страницах', 'Let’s restore the cards on five pages')
  },
  t1: {
    eyebrow: L3("Chaqqon", 'Шустрик', 'Speedy'),
    say: L3("Birinchi sahifa: Yashil chaqqon. Kartochka qaytdi, lekin u ko'k bo'lib qolibdi. Robotning ismi esa yashil! Kartochkaning rang so'zini almashtiring.",
      'Первая страница: Зелёный шустрик. Карточка вернулась, но стала синей. А робот-то зелёный! Замени слово цвета у карточки.',
      'The first page is Green Speedy. The card is back, but it turned blue. And the robot is green! Change the card’s color word.'),
    ask: L3("Kartochka yashil bo'lsin", 'Сделай карточку зелёной', 'Make the card green'),
    ok: L3("Zo'r! Yashil chaqqon endi yashil kartochkada!", 'Здорово! Зелёный шустрик теперь в зелёной карточке!', 'Great! Green Speedy is in a green card now!'),
    hints: [
      L3("section tegining class qiymatiga qarang: card dan keyin rang so'zi turibdi. U theme bilan boshlanadi.", 'Посмотри на class тега section: после card стоит слово цвета. Оно начинается с theme.', 'Look at the section tag’s class: after card comes a color word. It starts with theme.'),
      L3("Yashil rang success. theme-primary o'rniga theme-success yozing.", 'Зелёный — success. Вместо theme-primary напиши theme-success.', 'Green is success. Write theme-success instead of theme-primary.'),
      L3("Namuna kod ostida: u kartochkani qizil qiladi. Xuddi shunday rang so'zini almashtiring va Tekshirishni bosing.", 'Образец под кодом делает карточку красной. Так же замени слово цвета и нажми «Проверить».', 'The example under the code makes a card red. Change the color word the same way and tap Check.')
    ],
    no: L3("Kartochka hali yashil emas. Yashil rang so'zi theme-success.", 'Карточка ещё не зелёная. Слово зелёного цвета — theme-success.', 'The card isn’t green yet. The green color word is theme-success.'),
    bg: L3("bg so'zi faqat fonni bo'yaydi. Kartochkaning rangini theme so'zi beradi.", 'Слово bg красит только фон. Цвет карточки задаёт слово theme.', 'A bg word colors only the background. A card’s color comes from a theme word.'),
    drill: L3("endi Binafsha aqlli kartochkasi binafsha bo'lsin", 'теперь сделай карточку Фиолетового умника фиолетовой', 'now make Purple Brain’s card purple'),
    drillNo: L3("Binafsha rang Bootstrapda accent: theme-accent.", 'Фиолетовый в Bootstrap — accent: theme-accent.', 'Purple in Bootstrap is accent: theme-accent.')
  },
  t2: {
    eyebrow: L3("Aqlli", 'Умник', 'Brain'),
    say: L3("Ikkinchi sahifa: Binafsha aqlli. Bu kartochkada matn chetlarga yopishib qolibdi. Darsdagi topishmoq esingizdami? Kartochkani ikkita so'z ushlab turadi: biri tashqi ramka, ikkinchisi ichki bo'sh joy. Ichki div tegiga kerakli so'zni yozing.",
      'Вторая страница: Фиолетовый умник. Здесь текст в карточке прилип к краям. Помнишь загадку урока? Карточку держат два слова: одно — внешняя рамка, второе — отступы внутри. Впиши нужное слово внутреннему div.',
      'The second page is Purple Brain. Here the card’s text is stuck to the edges. Remember the lesson’s riddle? Two words hold a card: one is the outer frame, the other is the inner space. Give the inner div the right word.'),
    ask: L3("Matn chetdan uzoqlashsin", 'Отодвинь текст от краёв', 'Move the text away from the edges'),
    ok: L3("Ajoyib! Matn endi chiroyli ichki bo'shliq bilan turibdi!", 'Отлично! Текст теперь стоит с красивыми отступами!', 'Great! The text now has nice space around it!'),
    hints: [
      L3("Ism, ta'rif va tugmani o'rab turgan div tegining class qiymati bo'sh. Kartochka ichi uchun qaysi so'z bor edi?", 'У div, который обнимает имя, описание и кнопку, пустой class. Какое слово было для внутренности карточки?', 'The div around the name, description and button has an empty class. Which word was for the inside of a card?'),
      L3("Kartochka tanasi inglizcha body: card-body. card-title va card-text esa faqat nomlar, ular joy bermaydi.", 'Тело карточки по-английски — body: card-body. А card-title и card-text — только имена, отступов они не дают.', 'The card’s body is card-body. card-title and card-text are just names; they don’t add space.'),
      L3("Namuna kod ostida. Xuddi shunday so'zni ichki div tegiga yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши слово внутреннему div и нажми «Проверить».', 'The example is under the code. Write the same word for the inner div and tap Check.')
    ],
    no: L3("Matn hali chetga yopishgan. Ichki div tegiga card-body so'zi kerak.", 'Текст всё ещё у краёв. Внутреннему div нужно слово card-body.', 'The text is still at the edges. The inner div needs the word card-body.'),
    other: L3("Bu so'z joy bermaydi. Kartochka ichidagi bo'sh joyni card-body beradi.", 'Это слово отступов не даёт. Отступы внутри карточки даёт card-body.', 'That word doesn’t add space. card-body adds the space inside a card.'),
    drill: L3("endi Kuchli kartochkasidagi rasm tepaga chiroyli yopishsin", 'теперь пусть фото в карточке Силача красиво встанет сверху', 'now make the photo in Strongman’s card sit neatly at the top'),
    drillNo: L3("Kartochka tepasidagi rasm uchun card-img-top so'zi bor: img tegiga uni yozing.", 'Для фото сверху карточки есть слово card-img-top: напиши его тегу img.', 'For a photo at the top of a card there’s the word card-img-top: write it on the img tag.')
  },
  t3: {
    eyebrow: L3("Kuchli", 'Силач', 'Strongman'),
    say: L3("Uchinchi sahifa: To'q sariq kuchli. Bu yerda kartochka umuman yo'q. Bootstrap saytidagi Card sahifasidan namunani nusxalang va qo'ying. Keyin uni moslang: rasm o'rnida uch nuqta turibdi, u yerga robot3.jpg faylini yozing. Ism, ta'rif va tugma yozuvi ham robotimizniki bo'lsin.",
      'Третья страница: Оранжевый силач. Здесь карточки нет совсем. Скопируй пример со страницы Card сайта Bootstrap и вставь. Потом настрой: вместо фото там три точки — впиши туда файл robot3.jpg. А имя, описание и надпись на кнопке пусть будут про нашего робота.',
      'The third page is Orange Strongman. There’s no card here at all. Copy the example from the Card page of the Bootstrap site and paste it. Then adjust it: where the photo should be there are three dots, write the file robot3.jpg there. And make the name, description and button label about our robot.'),
    ask: L3("Saytdan kartochka oling va robotga moslang", 'Возьми карточку с сайта и подгони под робота', 'Take a card from the site and fit it to the robot'),
    ok: L3("Qoyil! Saytdagi namuna haqiqiy robot kartochkasiga aylandi!", 'Вот это да! Пример с сайта стал настоящей карточкой робота!', 'Wow! The site’s example became a real robot card!'),
    hints: [
      L3("Oldin namunani nusxalab qo'ying. Keyin to'rtta joyni moslang: rasm fayli, ism, ta'rif va tugma yozuvi.", 'Сначала скопируй и вставь пример. Потом подгони четыре места: файл фото, имя, описание и надпись на кнопке.', 'First copy and paste the example. Then adjust four places: the photo file, the name, the description and the button label.'),
      L3("src ichidagi uch nuqta o'rniga robot3.jpg yozing. Card title, inglizcha matn va Go somewhere o'rniga esa o'z so'zlaringizni yozing.", 'Вместо трёх точек в src напиши robot3.jpg. А вместо Card title, английского текста и Go somewhere — свои слова.', 'Write robot3.jpg instead of the three dots in src. And write your own words instead of Card title, the English text and Go somewhere.'),
      L3("Namuna kod ostida. Xuddi shunday rasm faylini va matnlarni moslang va Tekshirishni bosing.", 'Образец под кодом. Так же подгони файл фото и тексты и нажми «Проверить».', 'The example is under the code. Adjust the photo file and the texts the same way and tap Check.')
    ],
    noCard: L3("Sahifada kartochka hali yo'q. Saytdan namunani nusxalang va Qo'yish tugmasini bosing.", 'На странице пока нет карточки. Скопируй пример с сайта и нажми «Вставить».', 'There’s no card on the page yet. Copy the example from the site and tap Paste.'),
    src: L3("Rasm chiqmadi: src ichida fayl nomi yo'q. Uch nuqta o'rniga robot3.jpg deb yozing.", 'Фото не появилось: в src нет имени файла. Вместо трёх точек напиши robot3.jpg.', 'The photo didn’t show: src has no file name. Write robot3.jpg instead of the three dots.'),
    title: L3("Ism hali saytdagidek Card title. Robotning ismini yozing.", 'Имя ещё Card title, как на сайте. Напиши имя робота.', 'The name still says Card title, as on the site. Write the robot’s name.'),
    text: L3("Ta'rif hali saytdagi inglizcha matn. Robot nima qila olishini yozing.", 'Описание — ещё английский текст с сайта. Напиши, что умеет робот.', 'The description is still the site’s English text. Write what the robot can do.'),
    btn: L3("Tugmada hali Go somewhere yozuvi turibdi. O'z yozuvingizni yozing, masalan Batafsil.", 'На кнопке ещё Go somewhere. Напиши свою надпись, например «Подробнее».', 'The button still says Go somewhere. Write your own label, for example More.'),
    drill: L3("endi bu kartochka sariq bo'lsin", 'теперь сделай эту карточку жёлтой', 'now make this card yellow'),
    drillNo: L3("section tegining class qiymatiga sariq rang so'zini qo'shing: theme-warning.", 'Добавь в class тега section слово жёлтого цвета: theme-warning.', 'Add the yellow color word to the section tag’s class: theme-warning.')
  },
  t4: {
    eyebrow: L3("Galereya", 'Галерея', 'Gallery'),
    say: L3("To'rtinchi sahifa: galereya. Bu yerda ikki kartochkani shoshib yozibman. Birinchisi yashil bo'lishi kerak edi, lekin rangi chiqmadi. Ikkinchisida esa rasm yo'q. Ikkalasini tuzating.",
      'Четвёртая страница: галерея. Здесь я в спешке написал две карточки. Первая должна была стать зелёной, но цвета нет. А у второй нет фото. Почини обе.',
      'The fourth page is the gallery. I wrote two cards here in a hurry. The first should have been green, but there’s no color. And the second has no photo. Fix both.'),
    ask: L3("Birinchi kartochka yashil, ikkinchisida rasm", 'Первая карточка зелёная, у второй фото', 'First card green, second with a photo'),
    ok: L3("Zo'r ish! Ikkala kartochka ham tayyor, galereya to'ldi!", 'Отличная работа! Обе карточки готовы, галерея заполнена!', 'Nice work! Both cards are ready, and the gallery is full!'),
    hints: [
      L3("Ikkita joyga qarang: birinchi section tegining class qiymati va ikkinchi rasmning src qiymati.", 'Посмотри в два места: class первого тега section и src второго фото.', 'Look at two places: the first section tag’s class and the second photo’s src.'),
      L3("card-success degan so'z yo'q: rang alohida so'z, theme-success. Fayl nomi esa oxirigacha yoziladi: robot2.jpg.", 'Слова card-success нет: цвет — отдельное слово, theme-success. А имя файла пишут до конца: robot2.jpg.', 'There’s no word card-success: the color is a separate word, theme-success. And a file name is written in full: robot2.jpg.'),
      L3("Namuna kod ostida. Xuddi shunday rang so'zini va fayl nomini yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши слово цвета и имя файла и нажми «Проверить».', 'The example is under the code. Write the color word and the file name the same way and tap Check.')
    ],
    color: L3("Birinchi kartochka hali yashil emas. card dan keyin alohida rang so'zini yozing: theme-success.", 'Первая карточка ещё не зелёная. После card напиши отдельное слово цвета: theme-success.', 'The first card isn’t green yet. After card, write a separate color word: theme-success.'),
    src: L3("Ikkinchi rasm chiqmadi: fayl nomi to'liq emas. Fayllar ro'yxatiga qarang: robot2.jpg.", 'Второе фото не появилось: имя файла неполное. Посмотри в список файлов: robot2.jpg.', 'The second photo didn’t show: the file name is incomplete. Check the file list: robot2.jpg.'),
    drill: L3("endi bu kartochka rangini ham tuzating: u sariq bo'lishi kerak", 'теперь почини цвет и этой карточки: она должна быть жёлтой', 'now fix this card’s color too: it should be yellow'),
    drillNo: L3("bg-warning faqat fonni bo'yaydi. Kartochka rangi uchun theme-warning yozing.", 'bg-warning красит только фон. Для цвета карточки напиши theme-warning.', 'bg-warning colors only the background. For the card’s color, write theme-warning.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki! Unda ikkita robot kartochkasi yonma-yon tursin. Kartochkani saytdan ikki marta nusxalang, har biriga rasm faylini va o'z matningizni yozing. Ularni qatorga qo'yish esa to'rtinchi darsdan tanish: d-flex va gap.",
      'Пятая страница твоя! Пусть на ней стоят рядом две карточки роботов. Скопируй карточку с сайта два раза и впиши в каждую файл фото и свой текст. А поставить их в ряд ты уже умеешь с четвёртого урока: d-flex и gap.',
      'The fifth page is yours! Put two robot cards side by side on it. Copy the card from the site twice and give each one a photo file and your own text. You already know how to put them in a row from lesson four: d-flex and gap.'),
    ask: L3("Ikki kartochkani yonma-yon qo'ying", 'Поставь две карточки рядом', 'Put two cards side by side'),
    ok: L3("Vau, haqiqiy robotlar galereyasi! Bu siz yasagan kartochkalar!", 'Вау, настоящая галерея роботов! Это твои карточки!', 'Wow, a real robot gallery! These are your cards!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Oldin kartochkani nusxalab, Qo'yish tugmasini ikki marta bosing.", 'Посмотри на список: четыре условия. Сначала скопируй карточку и нажми «Вставить» два раза.', 'Look at the list: four conditions. First copy the card and tap Paste twice.'),
      L3("Har bir kartochkada src ichiga fayl nomini yozing va inglizcha matnlarni o'zingiznikiga almashtiring. Tashqi div tegiga d-flex va gap raqami bilan yozing.", 'В каждой карточке впиши в src имя файла и замени английские тексты своими. Внешнему div напиши d-flex и gap с номером.', 'In each card, write a file name in src and replace the English texts with your own. Give the outer div d-flex and gap with a number.'),
      L3("Namuna kod ostida. Xuddi shunday ikki kartochkani qatorga qo'ying va Tekshirishni bosing.", 'Образец под кодом. Поставь так же две карточки в ряд и нажми «Проверить».', 'The example is under the code. Put two cards in a row the same way and tap Check.')
    ],
    two: L3("Sahifada ikkita kartochka bo'lishi kerak. Saytdan namunani nusxalab, yana qo'ying.", 'На странице должно быть две карточки. Скопируй пример с сайта и вставь ещё раз.', 'The page needs two cards. Copy the example from the site and paste it again.'),
    src: L3("Bitta rasm chiqmadi: src ichida fayl nomi kerak, masalan robot1.jpg.", 'Одно фото не появилось: в src нужно имя файла, например robot1.jpg.', 'One photo didn’t show: src needs a file name, for example robot1.jpg.'),
    text: L3("Kartochkada hali saytdagi inglizcha matn qolgan. Ism, ta'rif va tugma yozuvini o'zingiznikiga almashtiring.", 'В карточке ещё остался английский текст с сайта. Замени имя, описание и надпись на кнопке своими.', 'A card still has the site’s English text. Replace the name, description and button label with your own.'),
    row: L3("Kartochkalar ustma-ust turibdi. Tashqi div tegiga d-flex so'zini bering.", 'Карточки стоят друг под другом. Дай внешнему div слово d-flex.', 'The cards are stacked. Give the outer div the word d-flex.'),
    gap: L3("Kartochkalar bir-biriga yopishib qoldi. gap so'zini raqami bilan qo'shing.", 'Карточки слиплись. Добавь gap с номером.', 'The cards are stuck together. Add gap with a number.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma kartochkalar o'z joyida! Qarang, bu sizning galereyangiz.", 'Все карточки на месте! Смотри, это твоя галерея.', 'All the cards are in place! Look, this is your gallery.') },
      { k: 'a', text: L3("Kartochkani ikki so'z ushlab turadi: card ramka beradi, card-body esa ichki bo'sh joy.", 'Карточку держат два слова: card даёт рамку, а card-body — отступы внутри.', 'Two words hold a card: card gives the frame, and card-body gives the inner space.') },
      { k: 'b', text: L3("Saytdan nusxa olgandan keyin rasm faylini, matnni va tugmani moslaymiz.", 'После копирования с сайта подгоняем файл фото, текст и кнопку.', 'After copying from the site, we adjust the photo file, the text and the button.') },
      { k: 'c', text: L3("Kartochka rangi theme so'zi bilan beriladi, xuddi tugma va e'londagidek.", 'Цвет карточки задаёт слово theme, как у кнопки и объявления.', 'A card’s color comes from a theme word, just like buttons and alerts.') },
      { k: 'd', text: L3("Kartochkalarni qatorga d-flex va gap qo'yadi.", 'В ряд карточки ставят d-flex и gap.', 'd-flex and gap put cards in a row.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda konteyner va to'r bilan sahifani ustunlarga bo'lamiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке разделим страницу на колонки: контейнер и сетка. До встречи!', 'Congratulations! Next lesson we’ll split the page into columns with a container and grid. See you!') }
    ],
    roles: {
      a: L3("card · card-img-top · card-body", 'card · card-img-top · card-body', 'card · card-img-top · card-body'),
      b: L3("Saytdan nusxa, keyin moslash", 'С сайта, потом подогнать', 'Copy from the site, then adapt'),
      c: L3("theme: rang", 'theme: цвет', 'theme: color'),
      d: L3("d-flex gap: qator", 'd-flex gap: ряд', 'd-flex gap: a row')
    },
    ask: L3("Galereyangizga qarang", 'Посмотри на свою галерею', 'Look at your gallery')
  }
};
