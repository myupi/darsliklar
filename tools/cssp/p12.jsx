// =============================================================================
// ===== ПРАКТИКА 12 · «Космический сайт Коди» · к уроку 12 «Позиционирование» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении космического сайта Коди стёрся CSS: метка «НОВОЕ» упала в строку текста,
// вкладки погасли. Ученик расставляет всё по местам на пяти страницах: заменить static на relative — карточка
// становится якорем, метка возвращается из угла страницы в угол карточки → вписать сдвиг bottom: 40px в правило
// ракеты (bottom толкает вверх) → правило целиком: кнопка «Наверх» position: fixed в правом нижнем углу окна
// длинного дневника → починить две поломки урока (сдвиг без position у Луны, absolut у звезды) → своя карточка:
// метка absolute в любом углу и своего цвета, условия «готово» видны.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-12p-pozicionirovanie.md.
// Честный fixed: страница практики — рамка со своим окном; длинный дневник не ужимается под рамку
// (html:has(.kundalik) — zoom 1 в base), поэтому прокручивается, а fixed-кнопка стоит в углу окна рамки.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-12p-pozicionirovanie',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "12-amaliyot. Belgilar va raketalar", ru: 'Практика 12. Метки и ракеты', en: 'Practice 12. Badges and rockets' }
};

// Страницы космического сайта (тексты на языке урока).
const P12 = {
  trips: L3("Sayohatlar", 'Путешествия', 'Trips'),
  mars: L3("Marsga sayohat", 'Полёт на Марс', 'Trip to Mars'),
  marsP: L3("Qizil sayyorani o'z ko'zingiz bilan ko'ring!", 'Увидь красную планету своими глазами!', 'See the red planet with your own eyes!'),
  badge: L3("YANGI", 'НОВОЕ', 'NEW'),
  rocket: L3("Raketa", 'Ракета', 'Rocket'),
  diaryTab: L3("Kundalik", 'Дневник', 'Diary'),
  diary: L3("Kosmik kundalik", 'Космический дневник', 'Space diary'),
  d1: L3("1-kun. Raketa koinotga uchdi. Derazadan Yer juda kichkina ko'rinyapti.", 'День 1. Ракета улетела в космос. Из окна Земля кажется совсем маленькой.', 'Day 1. The rocket flew into space. From the window, Earth looks tiny.'),
  d2: L3("2-kun. Oyga qo'ndik. Bu yerda hamma narsa juda yengil, men baland sakrayman!", 'День 2. Сели на Луну. Здесь всё очень лёгкое, я прыгаю высоко!', 'Day 2. We landed on the Moon. Everything is so light here, I jump really high!'),
  d3: L3("3-kun. Marsga yo'l oldik. Qizil sayyora borgan sari kattalashyapti.", 'День 3. Летим к Марсу. Красная планета всё больше и больше.', 'Day 3. We’re heading to Mars. The red planet keeps getting bigger.'),
  d4: L3("4-kun. Yulduzlarni sanadim, lekin adashib ketdim. Ular juda ko'p!", 'День 4. Считал звёзды, но сбился. Их очень много!', 'Day 4. I counted the stars, but lost count. There are so many!'),
  d5: L3("5-kun. Uyga qaytish vaqti keldi. Ertaga yana yozaman!", 'День 5. Пора домой. Завтра напишу ещё!', 'Day 5. Time to go home. I’ll write more tomorrow!'),
  up: L3("↑ Yuqoriga", '↑ Наверх', '↑ To top'),
  planets: L3("Sayyoralar", 'Планеты', 'Planets'),
  mine: L3("Mening sayohatim", 'Моё путешествие', 'My trip'),
  saturn: L3("Saturn halqalari", 'Кольца Сатурна', 'Saturn’s rings'),
  saturnP: L3("Halqalar ustidan uchib o'tamiz!", 'Пролетим над кольцами!', 'We’ll fly over the rings!'),
  super: L3("SUPER", 'СУПЕР', 'SUPER')
};
const p12Card = (h1, h2, p, badge) => (pk) => '<h1>' + pk(h1) + '</h1><div class="karta"><h2>' + pk(h2) + ' <span class="belgi">' + pk(badge) + '</span></h2><p>' + pk(p) + '</p></div>';
const p12Trips = p12Card(P12.trips, P12.mars, P12.marsP, P12.badge);
const p12Mine = p12Card(P12.mine, P12.saturn, P12.saturnP, P12.super);
const p12Rocket = (pk) => '<h1>' + pk(P12.rocket) + '</h1><div class="osmon"><div class="raketa">🚀</div></div>';
const p12Space = (pk) => '<h1>' + pk(P12.planets) + '</h1><div class="kosmos"><div class="yer">🌍</div><div class="oy">🌕</div><span class="yulduz">⭐</span></div>';
const p12Diary = (pk) => '<div class="kundalik" data-nofit><h1>' + pk(P12.diary) + '</h1>' + [P12.d1, P12.d2, P12.d3, P12.d4, P12.d5].map((x) => '<p>' + pk(x) + '</p>').join('') +
  '<button class="tugma">' + pk(P12.up) + '</button></div>';
// Что ученик написал для селектора (последнее правило с этим селектором; готовые правила с тем же селектором не мешают).
const p12Decl = (D, sel, p) => {
  let v = '';
  D.rules.forEach((r) => { if (r.style && cpNormSel(r.sel) === cpNormSel(sel)) { const x = r.style.getPropertyValue(p).trim(); if (x) v = x; } });
  return v;
};
// Сдвиг relative по вертикали: вычисленный top (bottom: 40px даёт top -40px).
const p12Top = (D, sel) => parseFloat(D.cs(sel, 'top')) || 0;
// Метка внутри карточки (по рамкам на странице).
const p12Inside = (D, a, b) => {
  const x = D.q(a), y = D.q(b);
  if (!x || !y) return true;
  const r = x.getBoundingClientRect(), q = y.getBoundingClientRect();
  return r.left >= q.left - 1 && r.right <= q.right + 1 && r.top >= q.top - 1 && r.bottom <= q.bottom + 1;
};
const P12_ROCKET = ['.osmon { background-color: midnightblue; }'];

const PR = {
  next: L3("Hover va transform", 'Hover и transform', 'Hover and transform'),
  // Вид сайта «по умолчанию» (ученику не виден): отступы и шрифт метки и карточки, небо и земля ракеты, космос,
  // размеры значков. Длинный дневник не ужимается под рамку — прокручивается, как настоящая страница (для fixed).
  base: 'html:has(.kundalik){zoom:1!important}' +
    '.karta{padding:12px;border-radius:10px}.belgi{padding:3px 8px;font:700 12px/1.4 Arial,Helvetica,sans-serif;border-radius:6px}' +
    '.osmon{padding-top:48px;border-bottom:12px solid #65A30D;border-radius:10px 10px 0 0}.raketa{font-size:40px;line-height:1.1;text-align:center}' +
    '.kosmos{padding:10px 10px 28px;border-radius:10px}.yer{font-size:44px;line-height:1.1}.oy{font-size:26px;line-height:1.1}.yulduz{font-size:24px;line-height:1}' +
    '.kundalik h1{font-size:1.4em}.kundalik p{margin:.5em 0}.tugma{font:600 14px Arial,Helvetica,sans-serif;border:0;border-radius:8px}',
  tabs: [
    { ico: 'pin', c: '#FA4F28', name: P12.trips, file: 'sayohat.html' },
    { ico: 'rocket', c: '#7C5CFA', name: P12.rocket, file: 'raketa.html' },
    { ico: 'book', c: '#0FA38E', name: P12.diaryTab, file: 'kundalik.html' },
    { ico: 'sun', c: '#F59E0B', name: P12.planets, file: 'sayyora.html' },
    { ico: 'star', c: '#E44D8A', name: P12.mine, file: 'my.html' }
  ],
  hook: {
    page: p12Trips,
    css: ['  .karta {', '    position: relative;', '    background-color: lavender;', '  }', '  .belgi {', '    position: absolute;', '    top: 0px;', '    right: 0px;',
      '    background-color: gold;', '  }']
  },
  ownPage: p12Mine,
  ownGiven: ['.karta { position: relative; background-color: lavender; }'],
  ownDefault: '.belgi {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  background-color: gold;\n}',
  tasks: [
    // Т1 · заменить значение: карточка становится якорем (static → relative), метка из угла страницы — в угол карточки.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.karta { position: static; }', answer: '.karta { position: relative; }',
      page: p12Trips, given: ['.karta { background-color: lavender; }', '.belgi { background-color: gold; }', '.belgi { position: absolute; top: 0px; right: 0px; }'],
      goal: (D) => {
        const p = D.cs('.karta', 'position');
        if (p === 'relative') return null;
        return p === 'absolute' || p === 'fixed' ? C.t1.abs : C.t1.no;
      },
      sample: ['.rasm { position: relative; }'],
      drill: { single: true, code0: '.kosmos { position: static; }', answer: '.kosmos { position: relative; }',
        page: p12Space, given: ['.kosmos { background-color: midnightblue; }', '.yulduz { position: absolute; top: 0px; right: 0px; }'],
        goal: (D) => (D.cs('.kosmos', 'position') === 'relative' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение: ракета поднимается на 40px (bottom толкает вверх).
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: '.raketa {\n  position: relative;\n  \n}', answer: '.raketa {\n  position: relative;\n  bottom: 40px;\n}',
      page: p12Rocket, given: P12_ROCKET,
      goal: (D) => {
        if (D.cs('.raketa', 'position') !== 'relative') return C.t2.pos;
        const t = p12Top(D, '.raketa');
        if (Math.abs(t + 40) < 1) return null;
        if (t > 0) return C.t2.down;
        if (t < 0) return C.t2.amount;
        return C.t2.no;
      },
      sample: ['.oy {', '  position: relative;', '  left: 30px;', '}'],
      drill: { code0: '.raketa {\n  position: relative;\n  \n}', answer: '.raketa {\n  position: relative;\n  left: 50px;\n}',
        goal: (D) => (D.cs('.raketa', 'left') === '50px' ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: кнопка «Наверх» — fixed в правом нижнем углу окна длинного дневника.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.tugma {\n  position: fixed;\n  bottom: 10px;\n  right: 10px;\n}',
      page: p12Diary, given: ['.tugma { background-color: gold; padding: 8px; }'],
      htmlAid: (pick) => ['<button class="tugma">' + pick(P12.up) + '</button>'],
      goal: (D) => {
        const pos = D.cs('.tugma', 'position');
        if (pos === 'fixed') return p12Decl(D, '.tugma', 'bottom') && p12Decl(D, '.tugma', 'right') ? null : C.t3.corner;
        if (pos === 'absolute') return C.t3.abs;
        if (pos === 'relative') return C.t3.rel;
        if (['top', 'right', 'bottom', 'left'].some((x) => p12Decl(D, '.tugma', x))) return C.t3.noPos;
        return C.t3.no;
      },
      sample: ['.chat {', '  position: fixed;', '  top: 10px;', '  left: 10px;', '}'],
      drill: { code0: '', answer: '.tugma {\n  position: fixed;\n  bottom: 10px;\n  left: 10px;\n}', page: p12Diary, given: ['.tugma { background-color: gold; padding: 8px; }'],
        goal: (D) => (D.cs('.tugma', 'position') === 'fixed' && p12Decl(D, '.tugma', 'bottom') && p12Decl(D, '.tugma', 'left') ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: сдвиг без position (Луна) и absolut (звезда).
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.oy { top: 20px; left: 60px; }\n.yulduz { position: absolut; top: 0px; right: 0px; }',
      answer: '.oy { position: relative; top: 20px; left: 60px; }\n.yulduz { position: absolute; top: 0px; right: 0px; }',
      page: p12Space, given: ['.kosmos { position: relative; background-color: midnightblue; }'],
      goal: (D) => {
        if (D.cs('.yulduz', 'position') !== 'absolute') return C.t4.star;
        const m = D.cs('.oy', 'position');
        if (m === 'static') return C.t4.noPos;
        return m === 'relative' ? null : C.t4.moonRel;
      },
      sample: ['.raketa { position: relative; bottom: 30px; }', '.belgi { position: absolute; bottom: 0px; left: 0px; }'],
      drill: { single: true, code0: '.raketa { bottom: 40px; }', answer: '.raketa { position: relative; bottom: 40px; }', page: p12Rocket, given: P12_ROCKET,
        goal: (D) => (D.cs('.raketa', 'position') === 'relative' && Math.abs(p12Top(D, '.raketa') + 40) < 1 ? null : C.t4.drillNo) }
    }),
    // Т5 · своя карточка: метка absolute, сдвиг по вертикали и по горизонтали, цвет фона; метка внутри карточки.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: '.belgi {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  background-color: gold;\n}',
      page: p12Mine, given: ['.karta { position: relative; background-color: lavender; }'],
      list: [
        { t: L3("belgi — absolute", 'метка — absolute', 'badge — absolute'), ok: (D) => D.cs('.belgi', 'position') === 'absolute' },
        { t: L3("top yoki bottom", 'top или bottom', 'top or bottom'), ok: (D) => !!(p12Decl(D, '.belgi', 'top') || p12Decl(D, '.belgi', 'bottom')) },
        { t: L3("left yoki right", 'left или right', 'left or right'), ok: (D) => !!(p12Decl(D, '.belgi', 'left') || p12Decl(D, '.belgi', 'right')) },
        { t: L3("belgi foni — rang", 'фон метки — цвет', 'badge background'), ok: (D) => !!p12Decl(D, '.belgi', 'background-color') }
      ],
      goal: (D) => {
        if (D.cs('.belgi', 'position') !== 'absolute') return C.t5.needAbs;
        if (!p12Decl(D, '.belgi', 'top') && !p12Decl(D, '.belgi', 'bottom')) return C.t5.needV;
        if (!p12Decl(D, '.belgi', 'left') && !p12Decl(D, '.belgi', 'right')) return C.t5.needH;
        if (!p12Decl(D, '.belgi', 'background-color')) return C.t5.needBg;
        if (!p12Inside(D, '.belgi', '.karta')) return C.t5.out;
        return null;
      },
      sample: ['.belgi {', '  position: absolute;', '  bottom: 6px;', '  left: 6px;', '  background-color: tomato;', '}'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы цели, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// Реплики сцеплены в одну историю: каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining kosmik sayti", 'Космический сайт Коди', 'Kodi’s space site'),
    say: L3("Salom! Mana, mening kosmik sayohatlar saytim. Marsga sayohat kartochkasiga bir qarang-chi: burchagida YANGI degan belgi yarqirab turibdi, xuddi o'yin do'konlaridagidek. Uni o'sha burchakka position olib borib qo'ygan. Saytimning beshala sahifasi tepadagi varaqlarda turibdi. Hozir saytni yangilab, yangi sayohatlarni chiqaraman. Uchishga tayyormisiz? Unda «Yangilash» tugmasini bosing!",
      'Привет! Это мой космический сайт. Смотри: в углу карточки нового путешествия стоит метка «НОВОЕ», как в настоящих магазинах. Её поставил туда position. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my space website. Look: the NEW badge sits in the corner of the new trip card, just like in real stores. position put it there. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy-bo'y, saytimda avariya! Yangilanish paytida CSS kodi o'chib ketibdi. YANGI belgisi burchakdan sirg'alib, matn qatoriga tushib qolibdi, tepadagi varaqlar ham so'nib qolibdi.", 'Ой! CSS-код стёрся. Метка упала в строку текста, а вкладки погасли.', 'Oh no! The CSS code got erased. The badge fell into the line of text, and the tabs went dark.'),
    done: L3("Lekin vahima qilmang: HTML kodiga hech narsa bo'lmabdi, faqat elementlar o'z joyini yo'qotib qo'yibdi. Ularni joyiga qaytarishni o'tgan darsda o'rganganmiz. position xususiyatining relative, absolute va fixed qiymatlari bor, top, right, bottom va left esa elementni siljitadi. Endi beshala sahifani bittalab qutqaramiz: qayerda nima buzilganini men ko'rsataman, kodni esa siz yozasiz. Beshinchi sahifada o'zingizning sayohatingiz kartochkasi bo'ladi.",
      'HTML на месте, пропали только места элементов. На прошлом уроке мы разобрали position: relative, absolute и fixed, и сдвиги top, right, bottom и left. Теперь расставим всё по местам на пяти страницах, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, only the elements’ places are gone. Last lesson we learned position: relative, absolute and fixed, and the offsets top, right, bottom and left. Now let’s put everything in its place on five pages, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Hamma narsani joy-joyiga qo'yamiz", 'Расставим всё по местам', 'Let’s put everything in its place')
  },
  t1: {
    eyebrow: L3("Sayohatlar", 'Путешествия', 'Trips'),
    say: L3("Qutqaruvni sayohatlar sahifasidan boshlaymiz. Belgiga absolute ham, burchak ham yozilgan, lekin qarang-chi: u kartochkaning emas, butun sahifaning burchagiga uchib ketibdi. Nega shunday? Chunki kartochkada position static turibdi, static esa langar bo'la olmaydi. Qiymatni almashtiring-da, kartochkani belgiga langar qilib qo'ying.",
      'Первая страница: путешествия. У метки есть absolute и угол, но смотри: она улетела не в угол карточки, а в угол всей страницы. Потому что у карточки position static, она не якорь. Замени значение: пусть карточка станет якорем.',
      'The first page is trips. The badge has absolute and a corner, but look: it flew not to the card’s corner but to the whole page’s corner. That’s because the card has position static, so it isn’t an anchor. Change the value: make the card the anchor.'),
    ask: L3("Belgini kartochka burchagiga qaytaring", 'Верни метку в угол карточки', 'Bring the badge back to the card’s corner'),
    ok: L3("Ana endi boshqa gap! Kartochka langarga aylandi, YANGI belgisi ham darrov uning burchagiga qaytib keldi.", 'Огонь! Карточка стала якорем, и метка вернулась в её угол.', 'Awesome! The card became the anchor, and the badge came back to its corner.'),
    hints: [
      L3("Esingizdami, darsda kartochkani qanday qilib langarga aylantirgan edik? Qaysi position qiymati uni o'z joyida qoldiradi-yu, belgiga langar qiladi?", 'Какое значение position делает карточку якорем и оставляет её на своём месте?', 'Which position value makes the card an anchor and keeps it in its place?'),
      L3("Bu relative qiymati: kartochka joyidan qimirlamaydi, faqat belgini o'ziga bog'lab oladi. static so'zini o'chiring-da, o'rniga relative yozing.", 'Якорь — relative. Сотри static и напиши relative.', 'The anchor is relative. Erase static and write relative.'),
      L3("Kod ostiga kichkina namuna qo'yib qo'ydim: unda rasm xuddi shu so'z bilan langarga aylanyapti. Kartochka qoidasida ham static o'rniga o'sha so'zni yozing-da, «Tekshirish»ni bosing.", 'Образец под кодом делает якорем картинку. Так же напиши relative для карточки и нажми «Проверить».', 'The example under the code makes a picture the anchor. Write relative for the card the same way and tap Check.')
    ],
    no: L3("Belgi hali ham kartochkaning burchagiga qaytmadi. Kartochka langar bo'lishi uchun unga relative kerak.", 'Метка пока не в углу карточки. Карточке нужно значение-якорь: relative.', 'The badge isn’t in the card’s corner yet. The card needs the anchor value: relative.'),
    abs: L3("Kartochka langar bo'ldi-yu, lekin o'zi ham oqimdan chiqib, joyini tashlab ketdi-ku. relative bilan esa u o'z joyida qoladi.", 'Карточка стала якорем, но сама ушла со своего места. Якорю нужен relative: он остаётся на месте.', 'The card became an anchor, but it left its own place. An anchor needs relative: it stays in place.'),
    drill: L3("endi yulduzni koinot qutisining burchagiga qaytaring", 'теперь верни звезду в угол космической коробки', 'now bring the star back to the corner of the space box'),
    drillNo: L3("Yulduz hali koinot qutisining burchagiga chiqmadi. Oldin quti langar bo'lishi kerak, buni esa relative qiladi.", 'Звезда пока не в углу коробки. Коробке нужен якорь: relative.', 'The star isn’t in the box’s corner yet. The box needs to be an anchor: relative.')
  },
  t2: {
    eyebrow: L3("Raketa", 'Ракета', 'Rocket'),
    say: L3("Sayohatlar sahifasi qutqarildi, endi raketaga o'tamiz! Raketada relative bor-u, lekin u hali ham start maydonchasida jim turibdi. Uni qirq piksel tepaga uchiring: buning uchun qoidaga bitta siljish qo'shsangiz bas. Faqat oldin o'ylab ko'ring-chi, raketani qaysi siljish tepaga ko'taradi?",
      'Одна страница горит! Вторая: ракета. У ракеты есть relative, но она пока стоит на старте. Впиши в правило сдвиг: пусть ракета поднимется на сорок пикселей вверх. Помнишь, какой сдвиг толкает вверх?',
      'One page is lit! The second is the rocket. The rocket has relative, but it’s still on the launch pad. Write an offset in the rule: let the rocket rise forty pixels up. Remember which offset pushes up?'),
    ask: L3("Raketani 40px tepaga ko'taring", 'Подними ракету на 40px вверх', 'Lift the rocket 40px up'),
    ok: L3("Parvoz boshlandi! Raketa start maydonchasidan roppa-rosa qirq piksel tepaga ko'tarildi.", 'Взлетела! Ракета поднялась над стартом на сорок пикселей.', 'Liftoff! The rocket rose forty pixels above the pad.'),
    hints: [
      L3("Har bir siljish o'z tomonidan masofa beradi, esingizdami? Raketa tepaga ko'tarilishi uchun u qaysi tomondan uzoqlashishi kerak: tepadanmi yoki pastdanmi?", 'Сдвиг — это отступ от той стороны. Чтобы поехать вверх, от какой стороны отодвигаемся: от верха или от низа?', 'An offset is a distance from that side. To move up, which side do we move away from: the top or the bottom?'),
      L3("Pastdan bottom uzoqlashtiradi, shuning uchun raketani aynan u tepaga ko'taradi. Qiymatiga qirq sonini px bilan birga yozing.", 'От низа отодвигает bottom. Сорок пикселей: число и px.', 'bottom moves it away from the bottom. Forty pixels: a number and px.'),
      L3("Pastdagi namunada Oy left bilan chap tomondan o'ttiz piksel uzoqlashib, o'ngga surilyapti. Raketaga ham xuddi shunday qator kerak, faqat left o'rniga bottom, o'ttiz o'rniga esa qirq bo'ladi.", 'Образец под кодом сдвигает Луну вправо. Напиши так же, только bottom и сорок пикселей.', 'The example under the code moves the Moon right. Write the same, only with bottom and forty pixels.')
    ],
    down: L3("Voy, raketa uchish o'rniga pastga tushib ketibdi-ku! top tepadan masofa beradi, shuning uchun raketani pastga itaradi. Tepaga esa uni bottom ko'taradi.", 'Ой, ракета ушла вниз! top — отступ сверху, поэтому он толкает вниз. Вверх толкает bottom.', 'Whoa, the rocket went down! top is the distance from the top, so it pushes down. bottom pushes up.'),
    amount: L3("Raketa ko'tarildi, lekin balandligi boshqacha chiqdi. Bizga qirq piksel kerak edi, sonni bir tekshirib ko'ring.", 'Ракета поднялась, но не на сорок пикселей. Напиши сорок пикселей.', 'The rocket rose, but not by forty pixels. Write forty pixels.'),
    pos: L3("Raketaning position relative qatori joyida qolsin: usiz siljish ishlamaydi, raketa esa startdan jilmaydi.", 'У ракеты должен остаться position relative, без него сдвиг не работает.', 'The rocket needs to keep position relative, without it the offset doesn’t work.'),
    no: L3("Raketa hali ham startda kutib turibdi. Uni tepaga bottom ko'taradi, shu siljishni qo'shing.", 'Ракета пока стоит на старте. Чтобы поднять её, напиши bottom.', 'The rocket is still on the pad. To lift it, write bottom.'),
    drill: L3("endi raketani o'ngga 50px suring", 'теперь сдвинь ракету на 50px вправо', 'now move the rocket 50px to the right'),
    drillNo: L3("Raketa hali o'ngga ellik piksel surilmadi. O'ngga surilishi uchun u chap chetdan uzoqlashishi kerak, buni esa left qiladi.", 'Ракета пока не сдвинулась вправо на пятьдесят пикселей. Вправо толкает отступ слева, то есть left.', 'The rocket hasn’t moved fifty pixels right yet. The distance from the left, that is left, pushes right.')
  },
  t3: {
    eyebrow: L3("Kundalik", 'Дневник', 'Diary'),
    say: L3("Raketa ham osmonda! Endi kosmik kundaligimni ochamiz. Kundalik uzun chiqdi, «Yuqoriga» tugmasi esa uning eng tagida yashirinib qolibdi: sahifani pastga aylantirsangiz, topasiz. Men tugma doim oynaning o'ng pastki burchagida tursin deyman, sahifa qancha aylansa ham. Bu safar qoidani boshidan oxirigacha o'zingiz yozasiz.",
      'Две страницы горят! Третья: космический дневник. Это длинная страница, а кнопка «Наверх» спряталась в самом низу. Прокрути страницу и посмотри. Пусть кнопка всегда стоит в правом нижнем углу окна, как ни прокручивай. Напиши правило.',
      'Two pages are lit! The third is the space diary. It’s a long page, and the To top button is hiding at the very bottom. Scroll the page and see. Let the button always stay in the bottom right corner of the window, however you scroll. Write the rule yourself.'),
    ask: L3("Tugmani oynaning o'ng pastki burchagiga mahkamlang", 'Закрепи кнопку в правом нижнем углу окна', 'Pin the button to the window’s bottom right corner'),
    ok: L3("Ajoyib! Tugma oynaning burchagiga yopishib oldi. Kundalikni aylantirib ko'ring-chi: sahifa yuradi, tugma esa qimir etmaydi!", 'Отлично! Кнопка прилипла к углу окна. Прокрути страницу: она не сдвинется с места!', 'Great! The button stuck to the window’s corner. Scroll the page: it won’t budge!'),
    hints: [
      L3("Darsdagi mashina oynasiga yopishtirilgan stiker esingizdami? Qaysi position qiymati elementni sahifaga emas, oynaning o'ziga yopishtiradi?", 'Какое значение position приклеивает элемент не к странице, а к окну?', 'Which position value sticks an element to the window rather than the page?'),
      L3("Bu fixed qiymati. Keyin burchakni ko'rsatamiz: bottom tugmani pastki chetdan, right esa o'ng chetdan uzoqlashtiradi. Ikkalasiga ham, masalan, o'n piksel yozing.", 'Это fixed. Потом угол: bottom и right, например десять пикселей.', 'That’s fixed. Then the corner: bottom and right, for example ten pixels.'),
      L3("Namunadagi chat oynaning chap tepa burchagiga mahkamlangan. Siz esa qoidani tugma klassi uchun yozasiz va uni qarama-qarshi burchakka, o'ng pastga qo'yasiz: top o'rniga bottom, left o'rniga right bo'ladi.", 'Образец под кодом закрепляет чат в левом верхнем углу. Напиши так же, только для кнопки, с bottom и right.', 'The example under the code pins a chat to the top left corner. Write the same, only for the button, with bottom and right.')
    ],
    abs: L3("Tugma burchakka chiqdi-ku, lekin absolute uni sahifaga bog'lab qo'ydi: kundalikni aylantirsangiz, tugma ham sahifa bilan birga ketib qoladi. Oynaga esa fixed yopishtiradi.", 'Кнопка вышла в угол, но absolute держится за страницу: прокрутишь — уедет. К окну приклеивает fixed.', 'The button went to a corner, but absolute holds on to the page: scroll and it leaves. fixed sticks to the window.'),
    rel: L3("relative tugmani faqat o'z joyidan siljitadi, shuning uchun u hali ham sahifaning eng tagida qolib ketdi. Oynaga uni fixed mahkamlaydi.", 'relative только сдвигает кнопку от её места, она всё ещё внизу страницы. К окну приклеивает fixed.', 'relative only moves the button from its own place; it’s still at the bottom of the page. fixed sticks it to the window.'),
    noPos: L3("Siljishlarni yozibsiz-u, lekin position yo'q ekan, shuning uchun tugma ularga quloq ham solmayapti. Unga position fixed kerak.", 'Сдвиги есть, а position нет, поэтому они не работают. Кнопке нужен position fixed.', 'The offsets are there, but there’s no position, so they don’t work. The button needs position fixed.'),
    corner: L3("Tugma oynaga yopishdi, endi qaysi burchakda turishini aytish qoldi. Buning uchun bottom bilan right yozing.", 'Кнопка прилипла к окну, теперь задай угол: bottom и right.', 'The button stuck to the window; now set the corner: bottom and right.'),
    no: L3("Tugma hali ham kundalikning eng tagida yashirinib yotibdi. Uni oynaga position fixed mahkamlaydi.", 'Кнопка всё ещё прячется внизу страницы. Закрепи её в окне: position fixed.', 'The button is still hiding at the bottom of the page. Pin it to the window: position fixed.'),
    drill: L3("endi tugmani oynaning chap pastki burchagiga mahkamlang", 'теперь закрепи кнопку в левом нижнем углу окна', 'now pin the button to the window’s bottom left corner'),
    drillNo: L3("Tugma hali chap pastki burchakka o'tmadi. Unga fixed bilan birga bottom va left ham kerak bo'ladi.", 'Кнопка пока не в левом нижнем углу. Нужны fixed, bottom и left.', 'The button isn’t in the bottom left corner yet. You need fixed, bottom and left.')
  },
  t4: {
    eyebrow: L3("Sayyoralar", 'Планеты', 'Planets'),
    say: L3("Kundalik ham joyiga keldi, navbat sayyoralarga! Bu sahifaning kodini start oldidan, sanoq boshlanib qolganda apil-tapil yozgan edim. Oy Yerdan o'ngga va pastga siljishi kerak edi, yulduz esa koinot qutisining burchagida charaqlab turishi kerak edi. Lekin shoshganimdan kodning ikki joyini buzib qo'yibman. Qani, ikkalasini topib, tuzatib bering-chi.",
      'Три страницы готовы! Четвёртая: планеты. Этот код я писал в спешке. Луна должна была сдвинуться вправо и вниз от Земли, а звезда — стоять в углу космической коробки. В коде две поломки: найди и почини их.',
      'Three pages are done! The fourth is the planets. I wrote this code in a hurry. The Moon was supposed to move right and down from the Earth, and the star was supposed to sit in the corner of the space box. There are two broken spots in the code: find and fix them.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Qoyil! Oy Yerdan nariroqqa siljidi, yulduz esa burchakda yana charaqlab turibdi.", 'Вот это да! Луна сдвинулась, а звезда сияет в углу.', 'That’s it! The Moon moved, and the star is shining in the corner.'),
    hints: [
      L3("Ikkala qoidani ham bir-bir ko'zdan kechiring-chi. Oy qoidasidagi siljishlar position bo'lmasa ishlarmikan? Yulduz qoidasidagi so'zlar-chi, harfma-harf to'g'ri yozilganmi?", 'Посмотри на каждое правило: работают ли сдвиги без position? Все ли слова написаны верно, буква в букву?', 'Look at each rule: do offsets work without position? Is every word spelled right, letter by letter?'),
      L3("Oy qoidasida position umuman yo'q ekan, unga relative qo'shish kerak. Yulduzda esa absolute so'zining oxirgi harfi tushib qolibdi.", 'У Луны нет position, ей нужен relative. А у звезды в слове absolute пропала последняя буква.', 'The Moon has no position, it needs relative. And the star’s absolute is missing its last letter.'),
      L3("Kod ostida ikkita ishlab turgan qoida bor: ularda raketa ham, belgi ham o'z joyida turibdi. O'zingizning Oy va yulduz qoidalaringizni ular bilan qatorma-qator solishtirib chiqing, farqni darrov ko'rasiz.", 'Образец под кодом — два верных правила. Напиши так же и нажми «Проверить».', 'The example under the code has two correct rules. Write yours the same way and tap Check.')
    ],
    noPos: L3("Yulduz o'z burchagiga chiqdi, Oy esa hali ham Yerning yonida turibdi. top bilan left faqat position bilan ishlaydi, shuning uchun Oyga relative yozing.", 'Звезда на месте, а Луна не сдвинулась. Сдвиги top и left работают только с position: допиши Луне relative.', 'The star is in place, but the Moon didn’t move. The top and left offsets only work with position: give the Moon relative.'),
    moonRel: L3("Oy o'z joyini tashlab, uchib ketdi-ku! U faqat o'z joyidan sal nariga siljishi kerak edi, buni esa relative qiladi.", 'Луна должна сдвинуться от своего места — это умеет relative.', 'The Moon should move from its own place, and relative does that.'),
    star: L3("Yulduz hali burchakka chiqmadi. U oqimdan chiqib, qutining burchagiga o'tishi uchun absolute kerak: so'zni harfma-harf tekshirib ko'ring.", 'Звезда пока не в углу. Ей нужно выйти из потока и встать в угол: absolute.', 'The star isn’t in the corner yet. It needs to leave the flow and go to the corner: absolute.'),
    drill: L3("endi raketani tuzating: u qirq piksel tepaga ko'tarilsin", 'теперь почини ракету: пусть поднимется на сорок пикселей', 'now fix the rocket: let it rise forty pixels'),
    drillNo: L3("Raketa baribir startdan qo'zg'almayapti. bottom yozilgan-u, lekin position bo'lmasa, siljish ishlamaydi: relative qo'shing.", 'Ракета пока на старте. Сдвиг работает только с position: добавь relative.', 'The rocket is still on the pad. An offset only works with position: add relative.')
  },
  t5: {
    eyebrow: L3("Mening sayohatim", 'Моё путешествие', 'My trip'),
    say: L3("To'rtta sahifa qutqarildi! Beshinchisi esa sizniki: unda o'zingizning sayohatingiz kartochkasi turadi. Kartochkani men allaqachon langar qilib qo'ydim. Siz esa belgini joylashtirasiz: uni xohlagan burchakka qo'ying, rangini ham o'zingiz tanlang. Qaysi shart bajarilganini oyna ostidagi ro'yxatdan ko'rib turasiz.",
      'Четыре страницы горят! Последняя — твоя: карточка твоего путешествия. Карточка уже якорь. Размести метку: поставь её в любой угол и выбери цвет. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: a card for your own trip. The card is already an anchor. Place the badge yourself: put it in any corner and pick its color. Under the window you can see what’s done.'),
    ask: L3("Belgini joylang: to'rtta shart", 'Размести метку: четыре условия', 'Place the badge: four conditions'),
    ok: L3("Ura! Saturnga sayohatingiz kartochkasi tayyor, SUPER belgisi ham o'zingiz tanlagan burchakda yarqirab turibdi!", 'Ура! Твоя карточка готова, метка в своём углу!', 'Hooray! Your card is ready, and the badge is in its corner!'),
    hints: [
      L3("Bitta qoida yetadi, u belgi klassi uchun bo'ladi. Oldin position qatorini qo'ying, keyin ikkita siljish bilan rangni qo'shib boring.", 'Напиши одно правило для класса belgi: сначала position, потом два сдвига и цвет.', 'Write one rule for the belgi class: first position, then two offsets and a color.'),
      L3("Belgini oqimdan position absolute chiqaradi. Balandlikni top yoki bottom bilan, tomonni left yoki right bilan tanlaysiz, rangni esa background-color beradi.", 'position absolute, top или bottom, left или right и background-color.', 'position absolute, top or bottom, left or right, and background-color.'),
      L3("Namunadagi belgi tomato rangida, chap pastki burchakda o'tiribdi. Undan faqat qoidaning tuzilishini oling, burchak bilan rangni esa o'zingiz tanlang.", 'Образец под кодом — метка в левом нижнем углу. Выбери свой угол и цвет.', 'The example under the code is a badge in the bottom left corner. Pick your own corner and color.')
    ],
    needAbs: L3("Belgi haligacha matn qatoriga tiqilib turibdi. Uni oqimdan position absolute chiqarib oladi.", 'Метка пока стоит в строке текста. Вынь её из потока: position absolute.', 'The badge is still in the line of text. Take it out of the flow: position absolute.'),
    needV: L3("Belgi tepada tursinmi yoki pastda? Buni top yoki bottom bilan ayting.", 'На какой высоте стоять метке? Напиши top или bottom.', 'At what height should the badge stand? Write top or bottom.'),
    needH: L3("Endi tomonini tanlang: chapdami yoki o'ngda? Buning uchun left yoki right yozing.", 'С какой стороны стоять метке? Напиши left или right.', 'Which side should the badge be on? Write left or right.'),
    needBg: L3("Belgi hali rangsiz turibdi. background-color yozib, unga o'zingizga yoqqan rang bering.", 'У метки нет фона. Напиши цвет для background-color.', 'The badge has no background. Write a color for background-color.'),
    out: L3("Voy, belgi kartochkadan chiqib, ochiq koinotga uchib ketdi! Siljishlarni kichikroq qiling, masalan, o'n piksel.", 'Метка вылетела за карточку. Возьми сдвиги поменьше, например десять пикселей.', 'The badge flew out of the card. Use smaller offsets, for example ten pixels.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Mana, kosmik saytim yana uchishga tayyor! Beshala sahifadagi har bir belgi, raketa va tugmani siz yozgan CSS o'z o'rniga qaytardi.", 'Все пять страниц космического сайта на местах! И всё расставил CSS, написанный твоими руками.', 'All five pages of the space site are in place! And the CSS you wrote yourself put everything there.') },
      { k: 'a', text: L3("relative elementni o'z joyidan siljitadi. Raketani tepaga bottom ko'targan edi, top esa aksincha pastga itaradi.", 'relative сдвигает элемент от его места: bottom толкает вверх, а top — вниз.', 'relative moves an element from its own place: bottom pushes up, and top pushes down.') },
      { k: 'b', text: L3("absolute elementni burchakka olib boradi, qaysi burchakka ekanini esa langar hal qiladi. Langar relative yozilgan ota quti bo'ladi.", 'absolute ставит в угол, а его якорь — родитель с relative.', 'absolute puts it in a corner, and its anchor is a parent with relative.') },
      { k: 'c', text: L3("fixed elementni oynaga yopishtiradi. Kundalik pastga aylanib ketaverdi, «Yuqoriga» tugmasi esa burchakdan bir piksel ham jilmadi.", 'fixed прилипает к окну и не прокручивается вместе со страницей.', 'fixed sticks to the window and doesn’t scroll with the page.') },
      { k: 'd', text: L3("Endi buzilgan joylarni ham darrov topasiz: position yozilmagan siljishni ham, oxirgi harfi tushib qolgan absolute so'zini ham.", 'И находишь поломки: сдвиг без position и absolut без последней буквы.', 'And you find broken spots: an offset without position, and absolut missing its last letter.') },
      { k: null, text: L3("Keyingi darsda sichqoncha ustiga kelganda jonlanadigan tugmalar yasaymiz, ularni hover bilan transform jonlantiradi. Ko'rishguncha!", 'На следующем уроке сделаем кнопки, которые оживают под мышкой: hover и transform. До встречи!', 'Next lesson we’ll make buttons that come alive under the mouse: hover and transform. See you!') }
    ],
    roles: {
      a: L3("relative — o'z joyidan", 'relative — от своего места', 'relative — from its own place'),
      b: L3("absolute va langar", 'absolute и якорь', 'absolute and the anchor'),
      c: L3("fixed — oynaga", 'fixed — к окну', 'fixed — to the window'),
      d: L3("tuzatish: absolut, position", 'починка: absolut, position', 'fixing: absolut, position')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
