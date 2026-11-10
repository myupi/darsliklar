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
    say: L3("Salom! Bu mening kosmik saytim. Qarang: yangi sayohat kartochkasining burchagida YANGI belgisi turibdi, xuddi haqiqiy do'konlardagidek. Uni o'sha yerga position qo'ygan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это мой космический сайт. Смотри: в углу карточки нового путешествия стоит метка «НОВОЕ», как в настоящих магазинах. Её поставил туда position. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my space website. Look: the NEW badge sits in the corner of the new trip card, just like in real stores. position put it there. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Belgi matn qatoriga tushib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Метка упала в строку текста, а вкладки погасли.', 'Oh no! The CSS code got erased. The badge fell into the line of text, and the tabs went dark.'),
    done: L3("HTML joyida, faqat elementlarning joyi yo'qoldi. O'tgan darsda position xususiyatini o'rgandik: relative, absolute va fixed, hamda top, right, bottom va left siljishlarini. Endi beshta sahifada hamma narsani joy-joyiga qo'yamiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, пропали только места элементов. На прошлом уроке мы разобрали position: relative, absolute и fixed, и сдвиги top, right, bottom и left. Теперь расставим всё по местам на пяти страницах, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, only the elements’ places are gone. Last lesson we learned position: relative, absolute and fixed, and the offsets top, right, bottom and left. Now let’s put everything in its place on five pages, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Hamma narsani joy-joyiga qo'yamiz", 'Расставим всё по местам', 'Let’s put everything in its place')
  },
  t1: {
    eyebrow: L3("Sayohatlar", 'Путешествия', 'Trips'),
    say: L3("Birinchi sahifa: sayohatlar. Belgiga absolute va burchak yozilgan, lekin qarang: u kartochka burchagiga emas, butun sahifa burchagiga uchib ketgan. Chunki kartochkada position static turibdi, u langar emas. Qiymatni almashtiring: kartochka langar bo'lsin.",
      'Первая страница: путешествия. У метки есть absolute и угол, но смотри: она улетела не в угол карточки, а в угол всей страницы. Потому что у карточки position static, она не якорь. Замени значение: пусть карточка станет якорем.',
      'The first page is trips. The badge has absolute and a corner, but look: it flew not to the card’s corner but to the whole page’s corner. That’s because the card has position static, so it isn’t an anchor. Change the value: make the card the anchor.'),
    ask: L3("Belgini kartochka burchagiga qaytaring", 'Верни метку в угол карточки', 'Bring the badge back to the card’s corner'),
    ok: L3("Zo'r! Kartochka langar bo'ldi va belgi uning burchagiga qaytdi.", 'Огонь! Карточка стала якорем, и метка вернулась в её угол.', 'Awesome! The card became the anchor, and the badge came back to its corner.'),
    hints: [
      L3("Qaysi position qiymati kartochkani langar qiladi va uni o'z joyida qoldiradi?", 'Какое значение position делает карточку якорем и оставляет её на своём месте?', 'Which position value makes the card an anchor and keeps it in its place?'),
      L3("Langar relative bo'ladi. static so'zini o'chirib, relative deb yozing.", 'Якорь — relative. Сотри static и напиши relative.', 'The anchor is relative. Erase static and write relative.'),
      L3("Namuna kod ostida: u rasmni langar qiladi. Xuddi shunday, kartochka uchun relative yozing va «Tekshirish»ni bosing.", 'Образец под кодом делает якорем картинку. Так же напиши relative для карточки и нажми «Проверить».', 'The example under the code makes a picture the anchor. Write relative for the card the same way and tap Check.')
    ],
    no: L3("Belgi hali kartochka burchagida emas. Kartochkaga langar qiymati kerak: relative.", 'Метка пока не в углу карточки. Карточке нужно значение-якорь: relative.', 'The badge isn’t in the card’s corner yet. The card needs the anchor value: relative.'),
    abs: L3("Kartochka langar bo'ldi, lekin o'zi joyidan chiqib ketdi. Langarga relative kerak: u o'z joyida qoladi.", 'Карточка стала якорем, но сама ушла со своего места. Якорю нужен relative: он остаётся на месте.', 'The card became an anchor, but it left its own place. An anchor needs relative: it stays in place.'),
    drill: L3("endi yulduzni koinot qutisining burchagiga qaytaring", 'теперь верни звезду в угол космической коробки', 'now bring the star back to the corner of the space box'),
    drillNo: L3("Yulduz hali quti burchagida emas. Qutiga langar kerak: relative.", 'Звезда пока не в углу коробки. Коробке нужен якорь: relative.', 'The star isn’t in the box’s corner yet. The box needs to be an anchor: relative.')
  },
  t2: {
    eyebrow: L3("Raketa", 'Ракета', 'Rocket'),
    say: L3("Bitta sahifa yondi! Ikkinchisi: raketa. Raketada relative bor, lekin u hali startda turibdi. Qoidaga siljishni yozing: raketa qirq piksel tepaga ko'tarilsin. Esingizdami, qaysi siljish tepaga suradi?",
      'Одна страница горит! Вторая: ракета. У ракеты есть relative, но она пока стоит на старте. Впиши в правило сдвиг: пусть ракета поднимется на сорок пикселей вверх. Помнишь, какой сдвиг толкает вверх?',
      'One page is lit! The second is the rocket. The rocket has relative, but it’s still on the launch pad. Write an offset in the rule: let the rocket rise forty pixels up. Remember which offset pushes up?'),
    ask: L3("Raketani 40px tepaga ko'taring", 'Подними ракету на 40px вверх', 'Lift the rocket 40px up'),
    ok: L3("Uchdi! Raketa startdan qirq piksel tepaga ko'tarildi.", 'Взлетела! Ракета поднялась над стартом на сорок пикселей.', 'Liftoff! The rocket rose forty pixels above the pad.'),
    hints: [
      L3("Siljish bu o'sha tomondan masofa. Tepaga chiqish uchun qaysi tomondan uzoqlashamiz: tepadanmi yoki pastdanmi?", 'Сдвиг — это отступ от той стороны. Чтобы поехать вверх, от какой стороны отодвигаемся: от верха или от низа?', 'An offset is a distance from that side. To move up, which side do we move away from: the top or the bottom?'),
      L3("Pastdan bottom uzoqlashtiradi. Qirq piksel: son va px.", 'От низа отодвигает bottom. Сорок пикселей: число и px.', 'bottom moves it away from the bottom. Forty pixels: a number and px.'),
      L3("Namuna kod ostida: u Oyni o'ngga suradi. Xuddi shunday yozing, faqat bottom va qirq piksel bilan.", 'Образец под кодом сдвигает Луну вправо. Напиши так же, только bottom и сорок пикселей.', 'The example under the code moves the Moon right. Write the same, only with bottom and forty pixels.')
    ],
    down: L3("Voy, raketa pastga tushib ketdi! top tepadan masofa beradi, shuning uchun pastga suradi. Tepaga bottom suradi.", 'Ой, ракета ушла вниз! top — отступ сверху, поэтому он толкает вниз. Вверх толкает bottom.', 'Whoa, the rocket went down! top is the distance from the top, so it pushes down. bottom pushes up.'),
    amount: L3("Raketa ko'tarildi, lekin qirq piksel emas. Qirq piksel yozing.", 'Ракета поднялась, но не на сорок пикселей. Напиши сорок пикселей.', 'The rocket rose, but not by forty pixels. Write forty pixels.'),
    pos: L3("Raketada position relative qolishi kerak, usiz siljish ishlamaydi.", 'У ракеты должен остаться position relative, без него сдвиг не работает.', 'The rocket needs to keep position relative, without it the offset doesn’t work.'),
    no: L3("Raketa hali startda turibdi. Tepaga ko'tarish uchun bottom yozing.", 'Ракета пока стоит на старте. Чтобы поднять её, напиши bottom.', 'The rocket is still on the pad. To lift it, write bottom.'),
    drill: L3("endi raketani o'ngga 50px suring", 'теперь сдвинь ракету на 50px вправо', 'now move the rocket 50px to the right'),
    drillNo: L3("Raketa hali o'ngga ellik piksel surilmadi. O'ngga chapdan masofa suradi, ya'ni left degani.", 'Ракета пока не сдвинулась вправо на пятьдесят пикселей. Вправо толкает отступ слева, то есть left.', 'The rocket hasn’t moved fifty pixels right yet. The distance from the left, that is left, pushes right.')
  },
  t3: {
    eyebrow: L3("Kundalik", 'Дневник', 'Diary'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: kosmik kundalik. Bu uzun sahifa, Yuqoriga tugmasi esa eng pastda yashiringan. Sahifani aylantirib ko'ring. Tugma doim oynaning o'ng pastki burchagida tursin, sahifa qanchalik aylanmasin. Qoidani o'zingiz yozing.",
      'Две страницы горят! Третья: космический дневник. Это длинная страница, а кнопка «Наверх» спряталась в самом низу. Прокрути страницу и посмотри. Пусть кнопка всегда стоит в правом нижнем углу окна, как ни прокручивай. Напиши правило.',
      'Two pages are lit! The third is the space diary. It’s a long page, and the To top button is hiding at the very bottom. Scroll the page and see. Let the button always stay in the bottom right corner of the window, however you scroll. Write the rule yourself.'),
    ask: L3("Tugmani oynaning o'ng pastki burchagiga mahkamlang", 'Закрепи кнопку в правом нижнем углу окна', 'Pin the button to the window’s bottom right corner'),
    ok: L3("Ajoyib! Tugma oyna burchagiga yopishdi. Sahifani aylantirib ko'ring: u joyidan qimirlamaydi!", 'Отлично! Кнопка прилипла к углу окна. Прокрути страницу: она не сдвинется с места!', 'Great! The button stuck to the window’s corner. Scroll the page: it won’t budge!'),
    hints: [
      L3("Qaysi position qiymati elementni sahifaga emas, oynaga yopishtiradi?", 'Какое значение position приклеивает элемент не к странице, а к окну?', 'Which position value sticks an element to the window rather than the page?'),
      L3("Bu fixed bo'ladi. Keyin burchak: bottom va right, masalan o'n piksel.", 'Это fixed. Потом угол: bottom и right, например десять пикселей.', 'That’s fixed. Then the corner: bottom and right, for example ten pixels.'),
      L3("Namuna kod ostida: u chatni chap tepa burchakka mahkamlaydi. Xuddi shunday yozing, faqat tugma uchun, bottom va right bilan.", 'Образец под кодом закрепляет чат в левом верхнем углу. Напиши так же, только для кнопки, с bottom и right.', 'The example under the code pins a chat to the top left corner. Write the same, only for the button, with bottom and right.')
    ],
    abs: L3("Tugma burchakka chiqdi, lekin absolute sahifaga yopishadi: aylantirsangiz, u ham ketadi. Oynaga fixed yopishadi.", 'Кнопка вышла в угол, но absolute держится за страницу: прокрутишь — уедет. К окну приклеивает fixed.', 'The button went to a corner, but absolute holds on to the page: scroll and it leaves. fixed sticks to the window.'),
    rel: L3("relative tugmani faqat o'z joyidan siljitadi, u hali sahifaning eng pastida. Oynaga fixed yopishtiradi.", 'relative только сдвигает кнопку от её места, она всё ещё внизу страницы. К окну приклеивает fixed.', 'relative only moves the button from its own place; it’s still at the bottom of the page. fixed sticks it to the window.'),
    noPos: L3("Siljishlar yozilgan, lekin position yo'q, shuning uchun ular ishlamaydi. Tugmaga position fixed kerak.", 'Сдвиги есть, а position нет, поэтому они не работают. Кнопке нужен position fixed.', 'The offsets are there, but there’s no position, so they don’t work. The button needs position fixed.'),
    corner: L3("Tugma oynaga yopishdi, endi burchakni ayting: bottom va right.", 'Кнопка прилипла к окну, теперь задай угол: bottom и right.', 'The button stuck to the window; now set the corner: bottom and right.'),
    no: L3("Tugma hali sahifaning eng pastida yashiringan. Uni oynaga mahkamlang: position fixed.", 'Кнопка всё ещё прячется внизу страницы. Закрепи её в окне: position fixed.', 'The button is still hiding at the bottom of the page. Pin it to the window: position fixed.'),
    drill: L3("endi tugmani oynaning chap pastki burchagiga mahkamlang", 'теперь закрепи кнопку в левом нижнем углу окна', 'now pin the button to the window’s bottom left corner'),
    drillNo: L3("Tugma hali chap pastki burchakda emas. fixed, bottom va left kerak.", 'Кнопка пока не в левом нижнем углу. Нужны fixed, bottom и left.', 'The button isn’t in the bottom left corner yet. You need fixed, bottom and left.')
  },
  t4: {
    eyebrow: L3("Sayyoralar", 'Планеты', 'Planets'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: sayyoralar. Bu kodni men shoshib yozgan edim. Oy Yerdan o'ngga va pastga siljishi kerak edi, yulduz esa koinot qutisining burchagida turishi kerak edi. Kodda ikkita joy buzilgan: ularni toping va tuzating.",
      'Три страницы готовы! Четвёртая: планеты. Этот код я писал в спешке. Луна должна была сдвинуться вправо и вниз от Земли, а звезда — стоять в углу космической коробки. В коде две поломки: найди и почини их.',
      'Three pages are done! The fourth is the planets. I wrote this code in a hurry. The Moon was supposed to move right and down from the Earth, and the star was supposed to sit in the corner of the space box. There are two broken spots in the code: find and fix them.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Oy siljidi, yulduz esa burchakda porlayapti.", 'Вот это да! Луна сдвинулась, а звезда сияет в углу.', 'That’s it! The Moon moved, and the star is shining in the corner.'),
    hints: [
      L3("Har bir qoidaga qarang: siljishlar position bo'lmasa ishlaydimi? So'zlar harfma-harf to'g'ri yozilganmi?", 'Посмотри на каждое правило: работают ли сдвиги без position? Все ли слова написаны верно, буква в букву?', 'Look at each rule: do offsets work without position? Is every word spelled right, letter by letter?'),
      L3("Oyda position yo'q, unga relative kerak. Yulduzda esa absolute so'zining oxirgi harfi tushib qolgan.", 'У Луны нет position, ей нужен relative. А у звезды в слове absolute пропала последняя буква.', 'The Moon has no position, it needs relative. And the star’s absolute is missing its last letter.'),
      L3("Namuna kod ostida: ikkita to'g'ri qoida. So'zlarni xuddi shunday yozing va «Tekshirish»ni bosing.", 'Образец под кодом — два верных правила. Напиши так же и нажми «Проверить».', 'The example under the code has two correct rules. Write yours the same way and tap Check.')
    ],
    noPos: L3("Yulduz joyida, lekin Oy qimirlamadi. top va left siljishlari faqat position bilan ishlaydi: Oyga relative yozing.", 'Звезда на месте, а Луна не сдвинулась. Сдвиги top и left работают только с position: допиши Луне relative.', 'The star is in place, but the Moon didn’t move. The top and left offsets only work with position: give the Moon relative.'),
    moonRel: L3("Oy o'z joyidan siljishi kerak, buni relative qila oladi.", 'Луна должна сдвинуться от своего места — это умеет relative.', 'The Moon should move from its own place, and relative does that.'),
    star: L3("Yulduz hali burchakda emas. U oqimdan chiqib, burchakka o'tishi kerak: absolute.", 'Звезда пока не в углу. Ей нужно выйти из потока и встать в угол: absolute.', 'The star isn’t in the corner yet. It needs to leave the flow and go to the corner: absolute.'),
    drill: L3("endi raketani tuzating: u qirq piksel tepaga ko'tarilsin", 'теперь почини ракету: пусть поднимется на сорок пикселей', 'now fix the rocket: let it rise forty pixels'),
    drillNo: L3("Raketa hali startda. Siljish faqat position bilan ishlaydi: relative qo'shing.", 'Ракета пока на старте. Сдвиг работает только с position: добавь relative.', 'The rocket is still on the pad. An offset only works with position: add relative.')
  },
  t5: {
    eyebrow: L3("Mening sayohatim", 'Моё путешествие', 'My trip'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z sayohatingiz kartochkasi. Kartochka allaqachon langar. Belgini o'zingiz joylang: istalgan burchakka qo'ying va rangini tanlang. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: карточка твоего путешествия. Карточка уже якорь. Размести метку: поставь её в любой угол и выбери цвет. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: a card for your own trip. The card is already an anchor. Place the badge yourself: put it in any corner and pick its color. Under the window you can see what’s done.'),
    ask: L3("Belgini joylang: to'rtta shart", 'Размести метку: четыре условия', 'Place the badge: four conditions'),
    ok: L3("Ura! Sizning kartochkangiz tayyor, belgi o'z burchagida!", 'Ура! Твоя карточка готова, метка в своём углу!', 'Hooray! Your card is ready, and the badge is in its corner!'),
    hints: [
      L3("belgi klassiga bitta qoida yozing: oldin position, keyin ikkita siljish va rang.", 'Напиши одно правило для класса belgi: сначала position, потом два сдвига и цвет.', 'Write one rule for the belgi class: first position, then two offsets and a color.'),
      L3("position absolute, top yoki bottom, left yoki right, va background-color.", 'position absolute, top или bottom, left или right и background-color.', 'position absolute, top or bottom, left or right, and background-color.'),
      L3("Namuna kod ostida: chap pastki burchakdagi belgi. O'zingizga yoqqan burchak va rangni tanlang.", 'Образец под кодом — метка в левом нижнем углу. Выбери свой угол и цвет.', 'The example under the code is a badge in the bottom left corner. Pick your own corner and color.')
    ],
    needAbs: L3("Belgi hali matn qatorida turibdi. Uni oqimdan chiqaring: position absolute.", 'Метка пока стоит в строке текста. Вынь её из потока: position absolute.', 'The badge is still in the line of text. Take it out of the flow: position absolute.'),
    needV: L3("Belgi qaysi balandlikda tursin? top yoki bottom yozing.", 'На какой высоте стоять метке? Напиши top или bottom.', 'At what height should the badge stand? Write top or bottom.'),
    needH: L3("Belgi qaysi tomonda tursin? left yoki right yozing.", 'С какой стороны стоять метке? Напиши left или right.', 'Which side should the badge be on? Write left or right.'),
    needBg: L3("Belgining foni yo'q. background-color uchun rang yozing.", 'У метки нет фона. Напиши цвет для background-color.', 'The badge has no background. Write a color for background-color.'),
    out: L3("Belgi kartochkadan chiqib ketdi. Siljishlarni kichikroq qiling, masalan o'n piksel.", 'Метка вылетела за карточку. Возьми сдвиги поменьше, например десять пикселей.', 'The badge flew out of the card. Use smaller offsets, for example ten pixels.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kosmik saytning beshta sahifasi ham joy-joyida! Hammasini siz o'zingiz yozgan CSS joylashtirdi.", 'Все пять страниц космического сайта на местах! И всё расставил CSS, написанный твоими руками.', 'All five pages of the space site are in place! And the CSS you wrote yourself put everything there.') },
      { k: 'a', text: L3("relative elementni o'z joyidan siljitadi: bottom tepaga, top esa pastga suradi.", 'relative сдвигает элемент от его места: bottom толкает вверх, а top — вниз.', 'relative moves an element from its own place: bottom pushes up, and top pushes down.') },
      { k: 'b', text: L3("absolute burchakka qo'yadi, uning langari esa relative yozilgan ota bo'ladi.", 'absolute ставит в угол, а его якорь — родитель с relative.', 'absolute puts it in a corner, and its anchor is a parent with relative.') },
      { k: 'c', text: L3("fixed oynaga yopishadi va sahifa bilan birga aylanmaydi.", 'fixed прилипает к окну и не прокручивается вместе со страницей.', 'fixed sticks to the window and doesn’t scroll with the page.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: position yozilmagan siljishni va harfi tushib qolgan absolut so'zini.", 'И находишь поломки: сдвиг без position и absolut без последней буквы.', 'And you find broken spots: an offset without position, and absolut missing its last letter.') },
      { k: null, text: L3("Keyingi darsda sichqoncha bilan jonlanadigan tugmalar yasaymiz: hover va transform. Ko'rishguncha!", 'На следующем уроке сделаем кнопки, которые оживают под мышкой: hover и transform. До встречи!', 'Next lesson we’ll make buttons that come alive under the mouse: hover and transform. See you!') }
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
