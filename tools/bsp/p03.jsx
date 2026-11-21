// =============================================================================
// ===== ПРАКТИКА 3 · «Galereya» · к уроку 3 «Загрузка и изображения» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Галерея кружка роботов на телефоне (окно 360 px, как в уроке 3). При обновлении у фото
// пропали классы: на телефоне фото вылезают за край, круглое фото тренера стало квадратным, вкладки погасли.
// Ученик чинит пять страниц: поменять слово угла в готовом class (rounded → rounded-circle) → вписать в пустой
// class img-fluid (фото команды помещается в телефон) → взять спиннер с сайта (Spinner) и настроить цвет
// (role="status" — как на сайте) → починить два старых и неполных места (img-responsive → img-fluid, placeholder без
// ширины → col-6) → своя страница: фото img-fluid с углами, спиннер, заглушка. Слова — с сайта (Images, Border radius,
// Spinner, Placeholder). 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-03p-zagruzka-i-izobrazheniya.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-03p-zagruzka-i-izobrazheniya',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "3-amaliyot. Galereya", ru: 'Практика 3. Галерея', en: 'Practice 3. The gallery' }
};

// Картинки сайта (те же рисунки, что в уроке 3: tools/bs3/bs3-kit.jsx). В коде — имена файлов.
const P3_SVG_NS = 'http:' + '\u002F\u002F' + 'www.w3.org/2000/svg';
const p3Svg = (w, h, inner) => 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='" + P3_SVG_NS + "' width='" + w + "' height='" + h + "' viewBox='0 0 " + w + ' ' + h + "'>" + inner + '</svg>');
const P3_ROBOT = (x, y, k, c) => "<g transform='translate(" + x + ' ' + y + ') scale(' + k + ")'><line x1='60' y1='-6' x2='60' y2='-30' stroke='#475569' stroke-width='6'/><circle cx='60' cy='-34' r='9' fill='" + c + "'/>"
  + "<rect x='0' y='0' width='120' height='92' rx='22' fill='#E2E8F0' stroke='#475569' stroke-width='6'/><rect x='18' y='20' width='84' height='44' rx='14' fill='#1E293B'/><circle cx='42' cy='42' r='9' fill='#38BDF8'/><circle cx='78' cy='42' r='9' fill='#38BDF8'/>"
  + "<rect x='10' y='102' width='100' height='86' rx='18' fill='" + c + "' stroke='#475569' stroke-width='6'/><rect x='38' y='124' width='44' height='26' rx='6' fill='#FDE68A'/><circle cx='30' cy='202' r='16' fill='#334155'/><circle cx='90' cy='202' r='16' fill='#334155'/></g>";
const P3_FILES = {
  'robot.jpg': p3Svg(800, 500, "<rect width='800' height='500' fill='#BFE3FF'/><rect y='380' width='800' height='120' fill='#C08A5B'/><rect y='372' width='800' height='14' fill='#9A6A42'/>"
    + "<circle cx='690' cy='90' r='46' fill='#FDE68A'/>" + P3_ROBOT(300, 120, 1.15, '#FA4F28') + "<rect x='560' y='300' width='120' height='76' rx='10' fill='#64748B'/><rect x='572' y='312' width='96' height='52' rx='6' fill='#22C55E'/>"),
  'murabbiy.jpg': p3Svg(400, 400, "<rect width='400' height='400' fill='#FDE7DC'/><circle cx='200' cy='420' r='170' fill='#FA4F28'/><rect x='170' y='230' width='60' height='50' fill='#E8B48A'/>"
    + "<circle cx='200' cy='170' r='88' fill='#F1C49B'/><path d='M112 160 Q120 70 200 72 Q285 70 290 165 Q262 112 200 112 Q140 112 112 160Z' fill='#3F2A1D'/><circle cx='168' cy='178' r='9' fill='#1F2937'/><circle cx='232' cy='178' r='9' fill='#1F2937'/><path d='M170 216 Q200 238 230 216' fill='none' stroke='#9A3412' stroke-width='7' stroke-linecap='round'/>"),
  'jamoa.jpg': p3Svg(900, 400, "<rect width='900' height='400' fill='#DCFCE7'/><rect y='300' width='900' height='100' fill='#86EFAC'/>" + P3_ROBOT(90, 70, 0.95, '#0FA38E') + P3_ROBOT(390, 60, 1, '#7c3aed') + P3_ROBOT(690, 70, 0.95, '#FA4F28'))
};

const P3 = {
  club: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
  coachT: L3("Murabbiy", 'Тренер', 'Coach'),
  teamT: L3("Jamoa", 'Команда', 'Team'),
  loadT: L3("Yuklanish", 'Загрузка', 'Loading'),
  newsT: L3("Yangiliklar", 'Новости', 'News'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'),
  coach: L3("Murabbiyimiz", 'Наш тренер', 'Our coach'),
  team: L3("Jamoamiz", 'Наша команда', 'Our team'),
  won: L3("Jamoamiz musobaqada g'olib bo'ldi!", 'Наша команда победила на соревнованиях!', 'Our team won the contest!'),
  wait: L3("Rasmlar yuklanmoqda", 'Фото загружаются', 'Photos are loading'),
  robots: L3("Bizning robotlar", 'Наши роботы', 'Our robots'),
  news: L3("Yangiliklar", 'Новости', 'News'),
  myH1: L3("Mening robotim", 'Мой робот', 'My robot'),
  myText: L3("U shanba kuni musobaqada qatnashadi.", 'Он участвует в соревновании в субботу.', 'It competes on Saturday.')
};
const P3_VW = 360;
const P3_SPIN = '<div class="spinner-border" role="status">\n  <span class="visually-hidden">Loading...</span>\n</div>';
const P3_PH = '<p class="placeholder-wave">\n  <span class="placeholder col-6"></span>\n</p>';
const p3Img = (src, cls, alt, more, ind) => (ind == null ? '  ' : ind) + '<img src="' + src + '"' + (cls == null ? '' : ' class="' + cls + '"') + (more || '') + ' alt="' + alt + '">';
const p3Pre = (pk, h1) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(h1) + '</h1>'];
const P3_POST = ['</body>'];
const p3Spin = (cls, ind) => P3_SPIN.replace('spinner-border', cls).split('\n').map((l) => (ind == null ? '  ' : ind) + l).join('\n');
const p3Spinner = (D) => D.q('.spinner-border, .spinner-grow');
const p3Ph = (D) => { const e = D.q('.placeholder'); return e ? e.getBoundingClientRect().width : 0; };
// Сайт: примеры и слова разделов.
const P3_RADIUS = ['rounded', 'rounded-circle', 'rounded-pill'];
const P3_DOCS_SPIN = { page: L3("Components · Spinner", 'Components · Spinner', 'Components · Spinner'), items: [
  { k: 'spin', title: 'Border spinner · HTML', code: P3_SPIN },
  { k: 'kind', title: 'Spinner', chips: ['spinner-border', 'spinner-grow'], copy: false },
  { k: 'fg', title: 'Colors', chips: ['fg-primary', 'fg-success', 'fg-danger', 'fg-warning'], copy: false }
] };
const P3_DOCS_FIX = { page: L3("Images · Placeholder", 'Images · Placeholder', 'Images · Placeholder'), items: [
  { k: 'img', title: 'Images', chips: ['img-fluid', 'img-thumbnail'], copy: false },
  { k: 'ph', title: 'Placeholder · HTML', code: P3_PH }
] };
const P3_DOCS_OWN = { page: L3("Images · Spinner · Placeholder", 'Images · Spinner · Placeholder', 'Images · Spinner · Placeholder'), items: [
  { k: 'r', title: 'Images · Border radius', chips: ['img-fluid'].concat(P3_RADIUS), copy: false },
  { k: 'spin', title: 'Spinner · HTML', code: P3_SPIN },
  { k: 'ph', title: 'Placeholder · HTML', code: P3_PH }
] };

const PR = {
  next: L3("Flex", 'Flex', 'Flex'),
  files: P3_FILES,
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P3.coachT, file: 'murabbiy.html' },
    { ico: 'heart', c: '#0FA38E', name: P3.teamT, file: 'jamoa.html' },
    { ico: 'rocket', c: '#7C5CFA', name: P3.loadT, file: 'yuklanish.html' },
    { ico: 'book', c: '#F59E0B', name: P3.newsT, file: 'yangiliklar.html' },
    { ico: 'pin', c: '#E44D8A', name: P3.mine, file: 'my.html' }
  ],
  // Крючок: галерея на телефоне; после «Yangilash» у фото нет классов — фото вылезают за край, тренер квадратный.
  hook: {
    vw: P3_VW,
    doc: (pk, on) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(P3.club) + '</h1>',
      p3Img('robot.jpg', on ? 'img-fluid rounded' : null, 'Robot'), '  <p>' + pk(P3.coach) + '</p>',
      p3Img('murabbiy.jpg', on ? 'rounded-circle' : null, 'Murabbiy', ' width="120"'), '</body>'].join('\n')
  },
  ownVw: P3_VW,
  ownDefault: (pk) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(P3.myH1) + '</h1>',
    p3Img('robot.jpg', 'img-fluid rounded', 'Robot'), p3Spin('spinner-grow fg-success'), '  <p>' + pk(P3.myText) + '</p>',
    '  <p class="placeholder-wave">', '    <span class="placeholder col-6"></span>', '  </p>', '</body>'].join('\n'),
  tasks: [
    // Т1 · слово угла в готовом class: фото тренера круглое (rounded → rounded-circle).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: P3_VW, pre: p3Pre(pk, P3.coach), post: P3_POST,
      code0: p3Img('murabbiy.jpg', 'rounded', 'Murabbiy', ' width="140"'), answer: p3Img('murabbiy.jpg', 'rounded-circle', 'Murabbiy', ' width="140"'),
      goal: (D) => (D.has('img', 'rounded-circle') ? null : D.has('img', 'rounded-pill') ? C.t1.pill : C.t1.no),
      sample: [p3Img('robot.jpg', 'rounded-pill', 'Robot', ' width="200"', '')],
      drill: { code0: p3Img('jamoa.jpg', 'img-fluid rounded', 'Jamoa'), answer: p3Img('jamoa.jpg', 'img-fluid rounded-pill', 'Jamoa'),
        goal: (D) => (D.has('img', 'rounded-pill') ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class: фото команды помещается в телефон (img-fluid).
    (pk) => bpTask(2, {
      kind: 'write-class', vw: P3_VW, pre: p3Pre(pk, P3.team), post: ['  <p>' + pk(P3.won) + '</p>', '</body>'],
      code0: p3Img('jamoa.jpg', '', 'Jamoa'), answer: p3Img('jamoa.jpg', 'img-fluid', 'Jamoa'),
      goal: (D) => (D.has('img', 'img-fluid') && D.fits('img') ? null : D.has('img', 'img-thumbnail') ? C.t2.thumb : C.t2.no),
      sample: [p3Img('robot.jpg', 'img-fluid', 'Robot', '', '')],
      drill: { code0: p3Img('robot.jpg', '', 'Robot'), answer: p3Img('robot.jpg', 'img-fluid', 'Robot'),
        goal: (D) => (D.has('img', 'img-fluid') && D.fits('img') ? null : C.t2.drillNo) }
    }),
    // Т3 · спиннер с сайта: скопировать, вставить, сделать зелёным (fg-success); role="status" — как на сайте.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: P3_VW, pre: p3Pre(pk, P3.wait), post: P3_POST, docs: () => P3_DOCS_SPIN,
      code0: '', answer: p3Spin('spinner-border fg-success'),
      goal: (D) => {
        const e = p3Spinner(D);
        if (!e) return D.q('[role="status"]') ? C.t3.noCls : C.t3.noSpin;
        if (e.getAttribute('role') !== 'status') return C.t3.noRole;
        if (!D.fg(e)) return D.theme(e) ? C.t3.theme : C.t3.noColor;
        return D.fg(e) === 'success' ? null : C.t3.other;
      },
      sample: p3Spin('spinner-border fg-warning', '').split('\n'),
      drill: { code0: '', answer: p3Spin('spinner-grow fg-danger'),
        goal: (D) => { const e = D.q('.spinner-grow'); return e && e.getAttribute('role') === 'status' && D.fg(e) === 'danger' ? null : C.t3.drillNo; } }
    }),
    // Т4 · починить: старое имя img-responsive → img-fluid; заглушка без ширины → col-6.
    (pk) => bpTask(4, {
      kind: 'fix', vw: P3_VW, pre: p3Pre(pk, P3.news), post: P3_POST, docs: () => P3_DOCS_FIX,
      code0: [p3Img('robot.jpg', 'img-responsive', 'Robot'), '  <p class="placeholder-wave">', '    <span class="placeholder"></span>', '  </p>'].join('\n'),
      answer: [p3Img('robot.jpg', 'img-fluid', 'Robot'), '  <p class="placeholder-wave">', '    <span class="placeholder col-6"></span>', '  </p>'].join('\n'),
      goal: (D) => {
        if (!(D.has('img', 'img-fluid') && D.fits('img'))) return C.t4.img;
        return p3Ph(D) > 4 ? null : C.t4.ph;
      },
      sample: [p3Img('jamoa.jpg', 'img-fluid', 'Jamoa', '', ''), '<p class="placeholder-wave">', '  <span class="placeholder col-12"></span>', '</p>'],
      drill: { code0: p3Img('murabbiy.jpg', 'img-circle', 'Murabbiy', ' width="140"'), answer: p3Img('murabbiy.jpg', 'rounded-circle', 'Murabbiy', ' width="140"'),
        goal: (D) => (D.has('img', 'rounded-circle') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: фото img-fluid с углами, спиннер с role="status", заглушка с шириной (всё — с сайта).
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: P3_VW, pre: ['<head>', '  ' + BP_LINK, '</head>', '<body>'], post: P3_POST, docs: () => P3_DOCS_OWN,
      code0: ['  <h1>' + pk(P3.myH1) + '</h1>', p3Img('robot.jpg', null, 'Robot'), '  ', '  <p>' + pk(P3.myText) + '</p>'].join('\n'),
      answer: ['  <h1>' + pk(P3.myH1) + '</h1>', p3Img('robot.jpg', 'img-fluid rounded', 'Robot'), p3Spin('spinner-grow fg-success'),
        '  <p>' + pk(P3.myText) + '</p>', '  <p class="placeholder-wave">', '    <span class="placeholder col-6"></span>', '  </p>'].join('\n'),
      list: [
        { t: L3("img-fluid: sig'adi", 'img-fluid: помещается', 'img-fluid: fits'), ok: (D) => D.has('img', 'img-fluid') && D.fits('img') },
        { t: L3("rounded… burchaklar", 'rounded… углы', 'rounded… corners'), ok: (D) => !!D.q('img') && Array.from(D.q('img').classList).some((c) => /^rounded/.test(c)) },
        { t: L3("spinner va role", 'spinner и role', 'spinner and role'), ok: (D) => { const e = p3Spinner(D); return !!e && e.getAttribute('role') === 'status'; } },
        { t: L3("placeholder va col-…", 'placeholder и col-…', 'placeholder and col-…'), ok: (D) => p3Ph(D) > 4 }
      ],
      goal: (D) => {
        if (!D.q('img')) return C.t5.needImg;
        if (!(D.has('img', 'img-fluid') && D.fits('img'))) return C.t5.needFluid;
        if (!Array.from(D.q('img').classList).some((c) => /^rounded/.test(c))) return C.t5.needRound;
        const e = p3Spinner(D);
        if (!e) return C.t5.needSpin;
        if (e.getAttribute('role') !== 'status') return C.t5.needRole;
        if (!D.q('.placeholder')) return C.t5.needPh;
        if (p3Ph(D) <= 4) return C.t5.phWidth;
        return null;
      },
      sample: ['<img src="jamoa.jpg" class="img-fluid rounded-pill" alt="Jamoa">', '<div class="spinner-border fg-danger" role="status">', '  <span class="visually-hidden">Loading...</span>', '</div>',
        '<p class="placeholder-wave">', '  <span class="placeholder col-12"></span>', '</p>'],
      onSolved: (st) => store.set('myDoc', ['<head>', '  ' + BP_LINK, '</head>', '<body>', st.code.replace(/\s+$/, ''), '</body>'].join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Galereya", 'Галерея', 'Gallery'),
    say: L3("Salom! Bu robot to'garagining galereyasi, telefonda qanday ko'rinishiga qarang. Robot rasmi ekranga sig'ib turibdi, burchaklari yumaloq, murabbiyning surati esa doira. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это галерея кружка роботов — смотри, как она выглядит на телефоне. Фото робота помещается в экран, углы скруглены, а фото тренера — круг. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is the robot club gallery: look how it shows on a phone. The robot photo fits the screen with rounded corners, and the coach’s photo is a circle. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda rasmlarning class so'zlari o'chib ketdi. Robot rasmi telefon ekranidan chiqib ketdi, murabbiy esa kvadrat bo'lib qoldi.",
      'Ой! При обновлении у фото стёрлись слова в class. Фото робота вылезло за экран телефона, а тренер стал квадратным.',
      'Oh no! The update erased the photos’ class words. The robot photo sticks out of the phone screen, and the coach turned square.'),
    done: L3("Kodga qarang: img tegida class yo'q. Bootstrap 6 rasmni o'zi kichraytirmaydi, buning uchun so'z kerak. Beshta sahifani birma-bir tuzatamiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: у тега img нет class. Bootstrap 6 сам фото не уменьшает, для этого нужно слово. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the img tag has no class. Bootstrap 6 doesn’t shrink photos by itself; that needs a word. Let’s fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi rasmlarni tuzatamiz", 'Починим фото на пяти страницах', 'Let’s fix the photos on five pages')
  },
  t1: {
    eyebrow: L3("Murabbiy", 'Тренер', 'Coach'),
    say: L3("Birinchi sahifa: murabbiy. Uning surati yana chiqdi, lekin burchaklari biroz yumaloq, xolos. Bizga esa avvalgidek to'liq doira kerak. Burchak so'zini almashtiring.",
      'Первая страница: тренер. Его фото снова на месте, но углы лишь чуть скруглены. А нам нужен полный круг, как раньше. Замени слово для углов.',
      'The first page is the coach. His photo is back, but the corners are only slightly rounded. We need a full circle, like before. Change the corner word.'),
    ask: L3("Murabbiy surati doira bo'lsin", 'Сделай фото тренера кругом', 'Make the coach’s photo a circle'),
    ok: L3("Zo'r! Murabbiy yana doira ichida, xuddi profil rasmidek!", 'Здорово! Тренер снова в круге, как на аватарке!', 'Great! The coach is in a circle again, just like a profile picture!'),
    hints: [
      L3("class ichida bitta so'z bor: rounded. U burchaklarni biroz yumaloq qiladi. Doira uchun boshqa so'z kerak.", 'В class одно слово: rounded. Оно чуть скругляет углы. Для круга нужно другое слово.', 'class has one word: rounded. It rounds the corners a little. A circle needs another word.'),
      L3("Doira inglizcha circle. Burchak so'zlari rounded bilan boshlanadi: rounded o'rniga rounded-circle yozing.", 'Круг по-английски — circle. Слова для углов начинаются с rounded: вместо rounded напиши rounded-circle.', 'Circle is the word. Corner words start with rounded: write rounded-circle instead of rounded.'),
      L3("Namuna kod ostida: u rasmni kapsula qiladi. Xuddi shunday burchak so'zini almashtiring va Tekshirishni bosing.", 'Образец под кодом делает фото капсулой. Так же замени слово для углов и нажми «Проверить».', 'The example under the code makes a photo a capsule. Change the corner word the same way and tap Check.')
    ],
    no: L3("Surat hali doira emas. Doira uchun rounded-circle so'zi kerak.", 'Фото ещё не круг. Для круга нужно слово rounded-circle.', 'The photo isn’t a circle yet. A circle needs the word rounded-circle.'),
    pill: L3("rounded-pill rasmni kapsula qiladi. Kvadrat suratdan doira chiqishi uchun rounded-circle kerak.", 'rounded-pill делает из фото капсулу. Чтобы квадратное фото стало кругом, нужно rounded-circle.', 'rounded-pill makes a capsule. To turn a square photo into a circle, you need rounded-circle.'),
    drill: L3("endi jamoa rasmi kapsula shaklida bo'lsin", 'теперь пусть фото команды будет капсулой', 'now make the team photo a capsule'),
    drillNo: L3("Rasm hali kapsula emas. Kapsula inglizcha pill: rounded-pill.", 'Фото ещё не капсула. Капсула по-английски — pill: rounded-pill.', 'The photo isn’t a capsule yet. A capsule is a pill: rounded-pill.')
  },
  t2: {
    eyebrow: L3("Jamoa", 'Команда', 'Team'),
    say: L3("Ikkinchi sahifa: jamoa. Bu rasm keng, telefonda esa ekrandan chiqib ketyapti: o'ng tomoni ko'rinmaydi. Darsni eslaysizmi? Bootstrap 6 rasmni o'zi kichraytirmaydi. Rasmga bitta so'z bering, shunda u har qanday ekranga sig'adi.",
      'Вторая страница: команда. Фото широкое и на телефоне вылезает за экран: правой части не видно. Помнишь урок? Bootstrap 6 сам фото не уменьшает. Дай фото одно слово — и оно поместится в любой экран.',
      'The second page is the team. The photo is wide and sticks out of the phone screen: its right side is cut off. Remember the lesson? Bootstrap 6 doesn’t shrink photos by itself. Give the photo one word, and it will fit any screen.'),
    ask: L3("Jamoa rasmi telefonga sig'sin", 'Пусть фото команды поместится в телефон', 'Make the team photo fit the phone'),
    ok: L3("Ajoyib! Rasm ekranga sig'di, uchala robot ham ko'rinib turibdi!", 'Отлично! Фото поместилось, видно всех трёх роботов!', 'Great! The photo fits, and all three robots are visible!'),
    hints: [
      L3("img tegining class qiymati bo'sh. Bu yerga rasmni ekran kengligiga moslaydigan bitta so'z kerak.", 'У тега img пустой class. Сюда нужно одно слово, которое подгоняет фото под ширину экрана.', 'The img tag’s class is empty. It needs one word that fits the photo to the screen width.'),
      L3("Bu so'z img bilan boshlanadi, ikkinchi qismi fluid, ya'ni moslashuvchan degani: img-fluid.", 'Это слово начинается с img, вторая часть — fluid, то есть гибкий: img-fluid.', 'The word starts with img, and the second part is fluid, meaning flexible: img-fluid.'),
      L3("Namuna kod ostida. Xuddi shunday so'zni jamoa rasmiga yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши слово для фото команды и нажми «Проверить».', 'The example is under the code. Write the same word for the team photo and tap Check.')
    ],
    no: L3("Rasm hali ekrandan chiqib turibdi. Unga img-fluid so'zi kerak.", 'Фото всё ещё вылезает за экран. Ему нужно слово img-fluid.', 'The photo still sticks out. It needs the word img-fluid.'),
    thumb: L3("img-thumbnail rasmga ramka beradi. Ekranga sig'dirish uchun esa img-fluid kerak.", 'img-thumbnail даёт фото рамку. А чтобы фото поместилось, нужно img-fluid.', 'img-thumbnail gives the photo a frame. To make it fit, you need img-fluid.'),
    drill: L3("endi robot rasmini ham telefonga sig'diring", 'теперь помести в телефон и фото робота', 'now make the robot photo fit the phone too'),
    drillNo: L3("Robot rasmi hali sig'madi. Unga ham img-fluid so'zini bering.", 'Фото робота ещё не помещается. Дай и ему слово img-fluid.', 'The robot photo still doesn’t fit. Give it the word img-fluid too.')
  },
  t3: {
    eyebrow: L3("Yuklanish", 'Загрузка', 'Loading'),
    say: L3("Uchinchi sahifa: yuklanish. Rasmlar sekin internetda kech chiqadi, shu vaqtda odam bo'sh sahifani ko'radi. Unga spinner kerak, ya'ni aylanib turadigan belgi. Bootstrap saytining Spinner sahifasidan uni nusxalang, qo'ying va yashil qiling.",
      'Третья страница: загрузка. На медленном интернете фото появляются не сразу, и человек видит пустую страницу. Ей нужен спиннер, то есть крутящийся значок. Скопируй его со страницы Spinner сайта Bootstrap, вставь и сделай зелёным.',
      'The third page is loading. On slow internet the photos appear late, and people see an empty page. It needs a spinner, a spinning sign. Copy it from the Spinner page of the Bootstrap site, paste it, and make it green.'),
    ask: L3("Saytdan spinner oling va uni yashil qiling", 'Возьми спиннер с сайта и сделай его зелёным', 'Take a spinner from the site and make it green'),
    ok: L3("Qoyil! Spinner aylanyapti, odam endi kutishni biladi!", 'Вот это да! Спиннер крутится — теперь понятно, что надо подождать!', 'Wow! The spinner spins, so people know to wait!'),
    hints: [
      L3("Oldin saytdagi spinnerni nusxalab, Qo'yish tugmasi bilan kodga qo'ying. Keyin unga rang so'zini qo'shing.", 'Сначала скопируй спиннер с сайта и вставь его кнопкой «Вставить». Потом добавь ему слово цвета.', 'First copy the spinner from the site and paste it with the Paste button. Then add a color word to it.'),
      L3("Spinnerning chizig'i matn rangida bo'ladi, matn rangi esa fg bilan boshlanadi. class ichiga fg-success qo'shing.", 'Линия спиннера рисуется цветом текста, а цвет текста начинается с fg. Добавь в class fg-success.', 'The spinner line uses the text color, and text color starts with fg. Add fg-success to class.'),
      L3("Namuna kod ostida. Xuddi shunday spinnerni yashil rangda yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такой же спиннер, но зелёный, и нажми «Проверить».', 'The example is under the code. Write the same spinner, but green, and tap Check.')
    ],
    noSpin: L3("Sahifada spinner hali yo'q. Saytdan namunani nusxalang va Qo'yish tugmasini bosing.", 'На странице пока нет спиннера. Скопируй пример с сайта и нажми «Вставить».', 'There’s no spinner on the page yet. Copy the example from the site and tap Paste.'),
    noCls: L3("Teg bor, lekin class ichida spinner-border so'zi yo'q. Saytdagi namunadagidek qoldiring.", 'Тег есть, но в class нет слова spinner-border. Оставь его, как в примере с сайта.', 'The tag is there, but class has no spinner-border. Keep it as in the site’s example.'),
    noRole: L3("Spinnerda role status yo'q. Ekranni o'qib beradigan dastur shu bo'yicha yuklanishni tushunadi: saytdagidek qoldiring.", 'У спиннера нет role status. По нему программа, которая читает экран вслух, понимает, что идёт загрузка: оставь, как на сайте.', 'The spinner has no role status. Screen readers use it to know something is loading: keep it as on the site.'),
    noColor: L3("Spinner aylanyapti, lekin rangi oddiy. class ichiga yashil rang so'zini qo'shing: u fg bilan boshlanadi.", 'Спиннер крутится, но цвет обычный. Добавь в class слово зелёного цвета: оно начинается с fg.', 'The spinner spins, but the color is plain. Add the green color word to class: it starts with fg.'),
    theme: L3("theme so'zlari tugma va e'lon uchun. Spinner rangi matn rangi kabi fg bilan beriladi.", 'Слова theme — для кнопок и объявлений. Цвет спиннера задаётся, как цвет текста, словом с fg.', 'theme words are for buttons and alerts. A spinner’s color is set like text color, with an fg word.'),
    other: L3("Spinner yashil emas. Yashil rang success, demak fg-success.", 'Спиннер не зелёный. Зелёный — success, значит fg-success.', 'The spinner isn’t green. Green is success, so fg-success.'),
    drill: L3("endi qizil spinner-grow qo'ying: u aylanmaydi, o'sib-kichrayadi", 'теперь поставь красный spinner-grow: он не крутится, а пульсирует', 'now add a red spinner-grow: it doesn’t spin, it pulses'),
    drillNo: L3("Spinnerni yana nusxalang, spinner-border o'rniga spinner-grow yozing va qizil rang so'zini qo'shing: fg-danger.", 'Скопируй спиннер ещё раз, вместо spinner-border напиши spinner-grow и добавь слово красного цвета: fg-danger.', 'Copy the spinner again, write spinner-grow instead of spinner-border, and add the red color word: fg-danger.')
  },
  t4: {
    eyebrow: L3("Yangiliklar", 'Новости', 'News'),
    say: L3("To'rtinchi sahifa: yangiliklar. Bu yerda ikki muammo bor. Robot rasmi ekrandan chiqib ketgan, chunki uning class so'zi juda eski darslikdan. Pastda esa matn yuklanguncha kulrang chiziq turishi kerak edi, lekin u ko'rinmayapti. Ikkalasini tuzating.",
      'Четвёртая страница: новости. Здесь две проблемы. Фото робота вылезает за экран: его слово в class из совсем старого учебника. А ниже, пока грузится текст, должна стоять серая полоска, но её не видно. Почини обе.',
      'The fourth page is the news. There are two problems here. The robot photo sticks out, because its class word comes from a very old tutorial. And below, a grey bar should stand in while the text loads, but it isn’t visible. Fix both.'),
    ask: L3("Rasm sig'sin, kulrang chiziq ko'rinsin", 'Пусть фото поместится, а серая полоска появится', 'Make the photo fit and the grey bar show'),
    ok: L3("Zo'r ish! Rasm sig'di, chiziq esa to'lqin bo'lib yuguryapti!", 'Отличная работа! Фото поместилось, а полоска бежит волной!', 'Nice work! The photo fits, and the bar runs like a wave!'),
    hints: [
      L3("Ikkita joyga qarang: rasmning class qiymati va placeholder so'zi turgan span. Ularni birma-bir tuzating.", 'Посмотри в два места: class у фото и span со словом placeholder. Почини их по очереди.', 'Look at two places: the photo’s class and the span with the word placeholder. Fix them one by one.'),
      L3("img-responsive eski nom, oltinchi versiyada img-fluid. placeholder ning esa kengligi yo'q: unga col-6 so'zini qo'shing.", 'img-responsive — старое имя, в шестой версии — img-fluid. А у placeholder нет ширины: добавь ему слово col-6.', 'img-responsive is an old name; in version six it’s img-fluid. And the placeholder has no width: add the word col-6 to it.'),
      L3("Namuna kod ostida. Xuddi shunday rasmga va placeholder ga kerakli so'zlarni yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши нужные слова для фото и для placeholder и нажми «Проверить».', 'The example is under the code. Write the needed words for the photo and the placeholder the same way and tap Check.')
    ],
    img: L3("Robot rasmi hali ekrandan chiqib turibdi. Unga oltinchi versiya so'zi kerak: img-fluid.", 'Фото робота ещё вылезает за экран. Ему нужно слово шестой версии: img-fluid.', 'The robot photo still sticks out. It needs the version six word: img-fluid.'),
    ph: L3("Rasm joyida, lekin kulrang chiziq hali ko'rinmayapti. placeholder ga kenglik kerak, masalan col-6, ya'ni yarim qator degani.", 'Фото на месте, а серой полоски ещё не видно. Заглушке нужна ширина, например col-6, то есть половина строки.', 'The photo is fine, but the grey bar still isn’t visible. The placeholder needs a width, for example col-6, meaning half a line.'),
    drill: L3("endi murabbiy suratidagi eski nomni tuzating: u doira bo'lishi kerak", 'теперь почини старое имя у фото тренера: оно должно быть кругом', 'now fix the old name on the coach’s photo: it should be a circle'),
    drillNo: L3("img-circle eski nom. Doira uchun rounded-circle yozing.", 'img-circle — старое имя. Для круга напиши rounded-circle.', 'img-circle is an old name. For a circle, write rounded-circle.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki! Unda sarlavha, robot rasmi va matn bor. Rasmni telefonga sig'diring va burchaklarini yumaloq qiling. Rasm kutilayotganda spinner aylansin, pastda esa kulrang chiziq tursin. Kerakli kod saytda bor: nusxalang, qo'ying va moslang.",
      'Пятая страница твоя! В ней есть заголовок, фото робота и текст. Помести фото в телефон и скругли ему углы. Пока фото грузится, пусть крутится спиннер, а внизу стоит серая полоска. Нужный код есть на сайте: копируй, вставляй и настраивай.',
      'The fifth page is yours! It has a heading, a robot photo and some text. Make the photo fit the phone and round its corners. While the photo loads, let a spinner spin, and put a grey bar below. The code you need is on the site: copy, paste and adjust.'),
    ask: L3("O'z galereya sahifangizni yasang", 'Собери свою страницу галереи', 'Build your own gallery page'),
    ok: L3("Vau, haqiqiy galereya sahifasi! Telefonda ham chiroyli!", 'Вау, настоящая страница галереи! И на телефоне красиво!', 'Wow, a real gallery page! It looks great on a phone too!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart bor. Oldin img tegiga class yozing: img-fluid va rounded bilan boshlanadigan so'z.", 'Посмотри на список: четыре условия. Сначала напиши тегу img class: img-fluid и слово, которое начинается с rounded.', 'Look at the list: four conditions. First give the img tag a class: img-fluid and a word starting with rounded.'),
      L3("Keyin saytdan spinnerni nusxalab, rasmdan keyingi bo'sh qatorga qo'ying. Placeholder namunasini ham nusxalab, eng pastga qo'ying.", 'Потом скопируй с сайта спиннер и вставь в пустую строку после фото. Пример заглушки тоже скопируй и вставь в самый низ.', 'Then copy the spinner from the site and paste it into the empty line after the photo. Copy the placeholder example too and paste it at the very bottom.'),
      L3("Namuna kod ostida. Xuddi shunday o'z sahifangizni to'ldiring va Tekshirishni bosing.", 'Образец под кодом. Дополни свою страницу так же и нажми «Проверить».', 'The example is under the code. Fill in your page the same way and tap Check.')
    ],
    needImg: L3("Sahifada rasm yo'q. img tegini qaytaring: src ichida robot.jpg.", 'На странице нет фото. Верни тег img: в src — robot.jpg.', 'There’s no photo on the page. Bring back the img tag with robot.jpg in src.'),
    needFluid: L3("Rasm telefonga sig'mayapti. img tegiga img-fluid so'zini bering.", 'Фото не помещается в телефон. Дай тегу img слово img-fluid.', 'The photo doesn’t fit the phone. Give the img tag the word img-fluid.'),
    needRound: L3("Rasmning burchaklari to'g'ri burchak. rounded bilan boshlanadigan so'zni qo'shing.", 'У фото острые углы. Добавь слово, которое начинается с rounded.', 'The photo has sharp corners. Add a word starting with rounded.'),
    needSpin: L3("Sahifada spinner yo'q. Saytdan uni nusxalab, qo'ying.", 'На странице нет спиннера. Скопируй его с сайта и вставь.', 'There’s no spinner on the page. Copy it from the site and paste it.'),
    needRole: L3("Spinnerda role status yo'q. Saytdagi namunadagidek qoldiring.", 'У спиннера нет role status. Оставь, как в примере с сайта.', 'The spinner has no role status. Keep it as in the site’s example.'),
    needPh: L3("Kulrang chiziq yo'q. Saytdan placeholder namunasini nusxalab, eng pastga qo'ying.", 'Серой полоски нет. Скопируй пример placeholder с сайта и вставь в самый низ.', 'There’s no grey bar. Copy the placeholder example from the site and paste it at the very bottom.'),
    phWidth: L3("placeholder bor, lekin kengligi yo'q, shuning uchun ko'rinmayapti. Unga col bilan boshlanadigan so'z bering.", 'Заглушка есть, но без ширины, поэтому её не видно. Дай ей слово, которое начинается с col.', 'The placeholder is there but has no width, so it’s invisible. Give it a word starting with col.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Galereya yana chiroyli, telefonda ham! Qarang, bu sizning sahifangiz.", 'Галерея снова красивая, и на телефоне тоже! Смотри, это твоя страница.', 'The gallery looks great again, on a phone too! Look, this is your page.') },
      { k: 'a', text: L3("Bootstrap 6 rasmni o'zi kichraytirmaydi. img-fluid bitta rasmni har qanday ekranga sig'diradi.", 'Bootstrap 6 сам фото не уменьшает. img-fluid вписывает одно фото в любой экран.', 'Bootstrap 6 doesn’t shrink photos by itself. img-fluid fits one photo into any screen.') },
      { k: 'b', text: L3("Burchak so'zlari rounded bilan boshlanadi: circle doira beradi, pill kapsula.", 'Слова для углов начинаются с rounded: circle даёт круг, pill — капсулу.', 'Corner words start with rounded: circle makes a circle, pill a capsule.') },
      { k: 'c', text: L3("Spinner va placeholder odamga kutish kerakligini aytadi.", 'Спиннер и заглушка говорят человеку, что нужно немного подождать.', 'A spinner and a placeholder tell people to wait a moment.') },
      { k: 'd', text: L3("So'zlarni saytdan olamiz: img-responsive va img-circle kabi eski nomlar ishlamaydi.", 'Слова берём с сайта: старые имена вроде img-responsive и img-circle не работают.', 'We take words from the site: old names like img-responsive and img-circle don’t work.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda Flex bilan ishlaymiz: narsalarni yonma-yon qo'yamiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке поработаем с Flex: будем ставить вещи в ряд. До встречи!', 'Congratulations! Next lesson we’ll work with Flex and put things in a row. See you!') }
    ],
    roles: {
      a: L3("img-fluid: ekranga sig'adi", 'img-fluid: помещается в экран', 'img-fluid: fits the screen'),
      b: L3("rounded: yumaloq burchak", 'rounded: круглые углы', 'rounded: round corners'),
      c: L3("spinner, placeholder: yuklanish", 'spinner, placeholder: загрузка', 'spinner, placeholder: loading'),
      d: L3("So'zlar saytdan", 'Слова с сайта', 'Words from the site')
    },
    ask: L3("Sahifangizga qarang", 'Посмотри на свою страницу', 'Look at your page')
  }
};
