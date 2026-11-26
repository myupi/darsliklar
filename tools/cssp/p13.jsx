// =============================================================================
// ===== ПРАКТИКА 13 · «Музыкальный сайт Коди» · к уроку 13 «Hover и transform» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении музыкального сайта Коди стёрся CSS: кнопки больше не оживают под мышкой,
// вкладки погасли. Ученик оживляет кнопки на пяти страницах: заменить серый на оранжевый в правиле с :hover →
// вписать transform: scale(1.5) в пустое правило .albom:hover → правило целиком: сердечко под мышкой поворачивается
// на 10deg → починить две поломки урока (пробел перед :hover, translate без запятой) → своя кнопка: цвет под
// мышкой, transform и cursor: pointer, условия «готово» видны.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-13p-hover-transform.md.
// Проверка цели — по правилу с :hover (что ученик написал, браузер принял), а не по тому, где сейчас мышь: навести
// мышь (на телефоне — коснуться) ученик может сам, страница в рамке честная. Значение transform браузер переводит
// в матрицу — по ней видно, увеличил, повернул или сдвинул (p13Mx).
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-13p-hover-transform',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "13-amaliyot. Kodining musiqa sayti", ru: 'Практика 13. Музыкальный сайт Коди', en: 'Practice 13. Kodi’s music site' }
};

// Страницы музыкального сайта (тексты на языке урока).
const P13 = {
  player: L3("Pleyer", 'Плеер', 'Player'),
  now: L3("Hozir: «Bahor qo'shig'i»", 'Сейчас играет: «Весенняя песня»', 'Now playing: “Spring Song”'),
  listen: L3("▶ Tinglash", '▶ Слушать', '▶ Listen'),
  albums: L3("Albomlar", 'Альбомы', 'Albums'),
  fav: L3("Yoqtirganlar", 'Любимое', 'Favourites'),
  favP: L3("Qo'shiq yoqdimi? Yurakni bosing!", 'Понравилась песня? Жми сердечко!', 'Like the song? Tap the heart!'),
  like: L3("❤ Yoqdi", '❤ Нравится', '❤ Like'),
  next: L3("Navbatda", 'Очередь', 'Up next'),
  nextP: L3("Keyingisi: «Yozgi kuy»", 'Следующая: «Летняя мелодия»', 'Next: “Summer Tune”'),
  nextBtn: L3("Keyingi ▶", 'Дальше ▶', 'Next ▶'),
  mine: L3("Mening pleyerim", 'Мой плеер', 'My player'),
  mineP: L3("Sevimli qo'shiqlarim shu yerda!", 'Здесь мои любимые песни!', 'My favourite songs live here!'),
  start: L3("▶ Boshlash", '▶ Старт', '▶ Start')
};
const p13Btn = (h1, p, btn, cls) => (pk) => '<h1>' + pk(h1) + '</h1><p>' + pk(p) + '</p><button class="' + (cls || 'tugma') + '">' + pk(btn) + '</button>';
const p13Player = p13Btn(P13.player, P13.now, P13.listen);
const p13Albums = (pk) => '<h1>' + pk(P13.albums) + '</h1><div class="albom">🎸</div><div class="albom">🎹</div><div class="albom">🥁</div>';
const p13Fav = p13Btn(P13.fav, P13.favP, P13.like, 'yurak');
const p13Next = p13Btn(P13.next, P13.nextP, P13.nextBtn);
const p13Mine = p13Btn(P13.mine, P13.mineP, P13.start);
// Что ученик написал для селектора (последнее правило с этим селектором; готовые правила с тем же селектором не мешают).
const p13Decl = (D, sel, p) => {
  let v = '';
  D.rules.forEach((r) => { if (r.style && cpNormSel(r.sel) === cpNormSel(sel)) { const x = r.style.getPropertyValue(p).trim(); if (x) v = x; } });
  return v;
};
// Пробел перед :hover — «.tugma :hover» (браузер принимает, но ищет элемент внутри кнопки).
const p13Space = (D) => D.rules.some((r) => r.sel && /\s:hover/.test(r.sel));
// Значение transform — в матрицу браузера: во сколько раз, на сколько градусов, куда сдвинут.
const p13Mx = (D, v) => {
  if (!v || v === 'none') return null;
  const e = D.doc.createElement('div');
  e.style.cssText = 'position:absolute;visibility:hidden;width:10px;height:10px';
  e.style.transform = v;
  D.doc.body.appendChild(e);
  const t = D.win.getComputedStyle(e).transform;
  e.remove();
  const n = /matrix\(([^)]+)\)/.exec(t || '');
  if (!n) return null;
  const [a, b, c, d, x, y] = n[1].split(',').map(Number);
  return { sx: Math.hypot(a, b), sy: Math.hypot(c, d), deg: Math.atan2(b, a) * 180 / Math.PI, x, y };
};
const p13Is = (m, o) => !!m && Math.abs(m.sx - (o.s || 1)) < 0.01 && Math.abs(m.sy - (o.s || 1)) < 0.01 && Math.abs(m.deg - (o.deg || 0)) < 0.5 &&
  Math.abs(m.x - (o.x || 0)) < 0.5 && Math.abs(m.y - (o.y || 0)) < 0.5;
// Пробел перед :hover в любом задании — одна фраза.
const P13_SPACE = L3("Selektorga bir qarang-chi: tugma bilan hover o'rtasida bo'sh joy qolib ketibdi. Bo'sh joyni ko'rsa, brauzer tugmaning ichidan boshqa element qidiradi, shuning uchun hover ishlamay qoladi. O'sha bo'sh joyni o'chiring.",
  'Смотри: в селекторе между кнопкой и hover стоит пробел. С пробелом браузер ищет что-то внутри кнопки, поэтому hover не работает. Убери пробел.',
  'Look: in the selector there’s a space between the button and hover. With a space, the browser looks for something inside the button, so hover doesn’t work. Remove the space.');

const PR = {
  next: L3("Silliq effektlar", 'Плавные эффекты', 'Smooth effects'),
  // Вид сайта «по умолчанию» (ученику не виден): шрифт и углы кнопок, квадраты обложек.
  base: '.tugma,.yurak{font:600 16px Arial,Helvetica,sans-serif;border:0;border-radius:10px}' +
    '.albom{display:inline-block;width:64px;height:64px;line-height:64px;margin:6px;text-align:center;font-size:34px;border-radius:12px}',
  tabs: [
    { ico: 'music', c: '#FA4F28', name: P13.player, file: 'pleyer.html' },
    { ico: 'palette', c: '#7C5CFA', name: P13.albums, file: 'albomlar.html' },
    { ico: 'heart', c: '#E44D8A', name: P13.fav, file: 'yoqtirgan.html' },
    { ico: 'rocket', c: '#0FA38E', name: P13.next, file: 'navbat.html' },
    { ico: 'star', c: '#F59E0B', name: P13.mine, file: 'my.html' }
  ],
  hook: {
    page: p13Player,
    css: ['  .tugma {', '    background-color: lavender;', '    padding: 10px;', '    cursor: pointer;', '  }', '  .tugma:hover {', '    background-color: orange;',
      '    transform: scale(1.1);', '  }']
  },
  ownPage: p13Mine,
  ownGiven: ['.tugma { background-color: lavender; padding: 10px; }'],
  ownDefault: '.tugma {\n  cursor: pointer;\n}\n.tugma:hover {\n  background-color: orange;\n  transform: scale(1.2);\n}',
  tasks: [
    // Т1 · заменить значение в правиле с :hover: под мышкой кнопка оранжевая (gray → orange).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.tugma:hover { background-color: gray; }', answer: '.tugma:hover { background-color: orange; }',
      page: p13Player, given: ['.tugma { background-color: lavender; padding: 10px; }'],
      goal: (D) => {
        const v = p13Decl(D, '.tugma:hover', 'background-color');
        if (v) return D.same(v, 'orange') ? null : C.t1.no;
        if (p13Space(D)) return P13_SPACE;
        return D.same(p13Decl(D, '.tugma', 'background-color'), 'orange') ? C.t1.always : C.t1.no;
      },
      sample: ['.havola:hover { color: red; }'],
      drill: { single: true, code0: '.tugma:hover { color: black; }', answer: '.tugma:hover { color: white; }',
        goal: (D) => (D.same(p13Decl(D, '.tugma:hover', 'color') || 'black', 'white') ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в пустое правило с :hover: обложка растёт в полтора раза.
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: '.albom:hover {\n  \n}', answer: '.albom:hover {\n  transform: scale(1.5);\n}',
      page: p13Albums, given: ['.albom { background-color: khaki; }'],
      goal: (D) => {
        const v = p13Decl(D, '.albom:hover', 'transform');
        if (!v) {
          if (p13Space(D)) return P13_SPACE;
          return p13Decl(D, '.albom', 'transform') ? C.t2.always : C.t2.no;
        }
        const m = p13Mx(D, v);
        if (p13Is(m, { s: 1.5 })) return null;
        if (!m || Math.abs(m.deg) > 0.5 || Math.abs(m.x) > 0.5 || Math.abs(m.y) > 0.5) return C.t2.notScale;
        return C.t2.amount;
      },
      sample: ['.rasm:hover {', '  transform: scale(1.2);', '}'],
      drill: { code0: '.albom:hover {\n  \n}', answer: '.albom:hover {\n  transform: scale(2);\n}',
        goal: (D) => (p13Is(p13Mx(D, p13Decl(D, '.albom:hover', 'transform')), { s: 2 }) ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: сердечко под мышкой поворачивается на 10deg.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.yurak:hover {\n  transform: rotate(10deg);\n}',
      page: p13Fav, given: ['.yurak { background-color: pink; padding: 10px; }'],
      htmlAid: (pick) => ['<button class="yurak">' + pick(P13.like) + '</button>'],
      goal: (D) => {
        const v = p13Decl(D, '.yurak:hover', 'transform');
        if (!v) {
          if (p13Space(D)) return P13_SPACE;
          return p13Decl(D, '.yurak', 'transform') ? C.t3.always : C.t3.no;
        }
        const m = p13Mx(D, v);
        if (p13Is(m, { deg: 10 })) return null;
        if (!m || Math.abs(m.sx - 1) > 0.01 || Math.abs(m.x) > 0.5 || Math.abs(m.y) > 0.5) return C.t3.notRotate;
        return Math.abs(m.deg + 10) < 0.5 ? C.t3.other : C.t3.amount;
      },
      sample: ['.havola:hover {', '  transform: rotate(20deg);', '}'],
      drill: { code0: '', answer: '.tugma:hover {\n  transform: rotate(5deg);\n}', page: p13Player, given: ['.tugma { background-color: lavender; padding: 10px; }'],
        htmlAid: (pick) => ['<button class="tugma">' + pick(P13.listen) + '</button>'],
        goal: (D) => (p13Is(p13Mx(D, p13Decl(D, '.tugma:hover', 'transform')), { deg: 5 }) ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: пробел перед :hover и translate без запятой.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.tugma :hover {\n  transform: translate(20px 0px);\n}', answer: '.tugma:hover {\n  transform: translate(20px, 0px);\n}',
      page: p13Next, given: ['.tugma { background-color: lightblue; padding: 10px; }'],
      goal: (D) => {
        const v = p13Decl(D, '.tugma:hover', 'transform');
        if (!v) return p13Space(D) ? C.t4.space : C.t4.no;
        return p13Is(p13Mx(D, v), { x: 20 }) ? null : C.t4.no;
      },
      sample: ['.havola:hover {', '  transform: translate(0px, 10px);', '}'],
      drill: { single: true, code0: '.tugma:hover { transform: scale(1.2px); }', answer: '.tugma:hover { transform: scale(1.2); }',
        goal: (D) => (p13Is(p13Mx(D, p13Decl(D, '.tugma:hover', 'transform')), { s: 1.2 }) ? null : C.t4.drillNo) }
    }),
    // Т5 · своя кнопка: цвет под мышкой (не как обычно), transform под мышкой, cursor: pointer.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: '.tugma {\n  cursor: pointer;\n}\n.tugma:hover {\n  background-color: orange;\n  transform: scale(1.2);\n}',
      page: p13Mine, given: ['.tugma { background-color: lavender; padding: 10px; }'],
      list: [
        { t: L3(":hover — fon rangi", ':hover — цвет фона', ':hover — background'),
          ok: (D) => { const v = p13Decl(D, '.tugma:hover', 'background-color'); return !!v && !D.same(v, p13Decl(D, '.tugma', 'background-color')); } },
        { t: L3(":hover — transform", ':hover — transform', ':hover — transform'), ok: (D) => !!p13Mx(D, p13Decl(D, '.tugma:hover', 'transform')) },
        { t: L3("cursor: pointer", 'cursor: pointer', 'cursor: pointer'), ok: (D) => D.cs('.tugma', 'cursor') === 'pointer' || p13Decl(D, '.tugma:hover', 'cursor') === 'pointer' }
      ],
      goal: (D) => {
        const bg = p13Decl(D, '.tugma:hover', 'background-color');
        if (!bg) return p13Space(D) ? P13_SPACE : C.t5.needBg;
        if (D.same(bg, p13Decl(D, '.tugma', 'background-color'))) return C.t5.sameBg;
        if (!p13Mx(D, p13Decl(D, '.tugma:hover', 'transform'))) return C.t5.needTf;
        if (D.cs('.tugma', 'cursor') !== 'pointer' && p13Decl(D, '.tugma:hover', 'cursor') !== 'pointer') return C.t5.needCur;
        return null;
      },
      sample: ['.tugma {', '  cursor: pointer;', '}', '.tugma:hover {', '  background-color: tomato;', '  transform: rotate(-5deg);', '}'],
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
    eyebrow: L3("Kodining musiqa sayti", 'Музыкальный сайт Коди', 'Kodi’s music site'),
    say: L3("Salom! Musiqa saytimga xush kelibsiz! «Tinglash» tugmasiga sichqonchani olib borib ko'ring-chi: u to'q sariq rangga kiradi, sal kattalashadi, ko'rsatkich esa qo'lga aylanadi. Bu jonlilikni hover, transform va cursor qilgan. Pleyerdan tashqari saytimda yana to'rtta sahifa bor. Musiqani boshlashdan oldin saytni bir yangilab olaylik: «Yangilash» tugmasini bosing.",
      'Привет! Это мой музыкальный сайт. Наведи мышку на кнопку «Слушать»: она становится оранжевой и чуть растёт, а указатель превращается в руку. Это сделали hover, transform и cursor. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my music website. Point the mouse at the Listen button: it turns orange and grows a little, and the pointer turns into a hand. hover, transform and cursor did that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Eh, musiqa to'xtab qoldi! Yangilanishda CSS kodi o'chib ketibdi: tugmalar endi sichqonchaga javob bermaydi, tepadagi varaqlar ham xiralashib qoldi.", 'Ой! CSS-код стёрся. Кнопки больше не оживают, а вкладки погасли.', 'Oh no! The CSS code got erased. The buttons don’t come alive anymore, and the tabs went dark.'),
    done: L3("HTML kodi butun: qo'shiqlar ham, tugmalar ham joyida, faqat tugmalar jonsiz bo'lib qolgan. Ularni qanday jonlantirishni o'tgan darsda o'rgandik: hover qoidasi sichqoncha ustida ishlaydi, transform kattalashtiradi, buradi va suradi, cursor pointer esa ko'rsatkichni qo'lga aylantiradi. Keling, sahifama-sahifa yurib, har bir tugmaga jon kiritamiz. Kodni siz yozasiz, men esa qayerga nima kerakligini aytib turaman. Oxirgi sahifada o'zingizning pleyeringiz bo'ladi.",
      'HTML на месте, но кнопки неживые. На прошлом уроке мы разобрали правило с hover, которое работает под мышкой, transform, чтобы увеличить, повернуть и сдвинуть, и cursor pointer с рукой. Теперь оживим кнопки на пяти страницах, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, but the buttons are lifeless. Last lesson we learned the hover rule that works under the mouse, transform to scale, rotate and move, and cursor pointer with its hand. Now let’s bring the buttons to life on five pages, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi tugmalarni jonlantiramiz", 'Оживим кнопки на пяти страницах', 'Let’s bring the buttons to life on five pages')
  },
  t1: {
    eyebrow: L3("Pleyer", 'Плеер', 'Player'),
    say: L3("Pleyerdan boshlaymiz. Bu yerda hover qoidasi omon qolibdi, lekin unda kulrang yozilgan: sichqoncha kelganda tugma quvonish o'rniga zerikarli tusga kiradi. Keling, sichqoncha ustida u to'q sariq bo'lsin: qoidadagi rangni almashtiring. Keyin sichqonchani tugmaga olib borib ko'ring, telefonda esa unga barmoq tekkizing.",
      'Первая страница: плеер. Здесь осталось правило с hover, но в нём серый: под мышкой кнопка становится скучной. Пусть под мышкой кнопка будет оранжевой: замени цвет в правиле. Потом наведи мышку на кнопку, а на телефоне — коснись её.',
      'The first page is the player. A hover rule is left here, but it says gray: under the mouse the button turns dull. Let the button turn orange under the mouse: change the color in the rule. Then point the mouse at the button, or tap it on a phone.'),
    ask: L3("Sichqoncha ustida tugma to'q sariq bo'lsin", 'Сделай кнопку оранжевой под мышкой', 'Make the button orange on hover'),
    ok: L3("Mana, pleyer jonlandi! Sichqonchani tugmaga olib keling-chi: u to'q sariq bo'lib, sizni tinglashga chaqiradi.", 'Огонь! Теперь наведи мышку на кнопку: она загорается оранжевым.', 'Awesome! Now point the mouse at the button: it lights up orange.'),
    hints: [
      L3("Qoidaning selektoriga qarang-chi: unda hover bor, demak, qoida faqat sichqoncha ustida ishlaydi. Endi ichiga qarang: rangni qaysi so'z beryapti?", 'Посмотри на правило: в селекторе есть hover, значит, оно работает под мышкой. Какое слово задаёт цвет?', 'Look at the rule: the selector has hover, so it works under the mouse. Which word sets the color?'),
      L3("Hozir u yerda gray turibdi, inglizchada «kulrang» degani. To'q sariq esa inglizchada orange bo'ladi: gray so'zini o'chiring-da, o'rniga orange yozing.", 'Оранжевый по-английски — orange. Сотри gray и напиши orange.', 'Orange is orange. Erase gray and write orange.'),
      L3("Kod ostiga havolaning qoidasini namuna qilib qo'ydim: sichqoncha kelsa, havola qizarib ketadi. Tugmaning qoidasida ham faqat rang so'zini almashtirasiz: gray o'rniga orange yozing-da, «Tekshirish»ni bosing.", 'Образец под кодом делает ссылку красной под мышкой. Так же напиши orange для кнопки и нажми «Проверить».', 'The example under the code makes a link red on hover. Write orange for the button the same way and tap Check.')
    ],
    no: L3("Tugma hali ham sichqoncha ustida to'q sariqqa kirmayapti. To'q sariqni inglizchada orange deyishadi.", 'Цвет под мышкой пока не оранжевый. Оранжевый по-английски — orange.', 'The hover color isn’t orange yet. Use the word orange.'),
    always: L3("Qarang-chi, tugma endi sichqonchasiz ham doim to'q sariq bo'lib turibdi. Selektorga hover so'zini qaytaring, shunda rang faqat sichqoncha ustida o'zgaradi.", 'Смотри: кнопка теперь оранжевая всегда, даже без мышки. Верни в селектор hover: пусть цвет меняется только под мышкой.', 'Look: the button is orange all the time now, even without the mouse. Put hover back in the selector: the color should change only under the mouse.'),
    drill: L3("endi sichqoncha ustida tugma matni oq bo'lsin", 'теперь пусть под мышкой текст кнопки становится белым', 'now make the button text white on hover'),
    drillNo: L3("Tugmaning yozuvi sichqoncha ustida hali oqarmayapti. Matn rangini color beradi, oq rang esa white bo'ladi.", 'Текст под мышкой пока не белый. Цвет текста задаёт color, а белый — white.', 'The hover text isn’t white yet. color sets the text color, and white is white.')
  },
  t2: {
    eyebrow: L3("Albomlar", 'Альбомы', 'Albums'),
    say: L3("Pleyer chalinyapti, endi albomlarga o'tamiz! Albomlar sahifasida ham hover qoidasi bor-u, lekin ichi bo'm-bo'sh. Muqovaga sichqoncha kelsa, u bir yarim barobar kattalashsin, xuddi «Meni tanlang!» deyayotgandek. Jingalak qavslar ichiga xususiyat bilan qiymatni yozing.",
      'Плеер горит! Теперь альбомы. Здесь есть правило с hover, но оно пустое. Пусть под мышкой обложка альбома вырастает в полтора раза: впиши в скобки свойство и значение.',
      'The player is lit! Now the albums. There’s a hover rule here, but it’s empty. Let an album cover grow one and a half times under the mouse: write a property and a value inside the braces.'),
    ask: L3("Sichqoncha ustida muqova 1.5 barobar kattalashsin", 'Пусть обложка под мышкой растёт в 1.5 раза', 'Make a cover grow 1.5 times on hover'),
    ok: L3("Ajoyib! Sichqonchani muqovaga olib borib ko'ring: u kattalashib, darrov ko'zga tashlanadi, qo'shnilari esa joyidan jilmaydi.", 'Отлично! Наведи мышку на обложку: она растёт, а соседи остаются на месте.', 'Great! Point the mouse at a cover: it grows, and its neighbours stay put.'),
    hints: [
      L3("Darsda tugmani nima bilan kattalashtirgan edik, esingizdami? O'sha xususiyatning ichida kattalashtirish uchun alohida so'z bor edi.", 'Каким свойством элемент увеличивают? И какое слово внутри него значит «увеличить»?', 'Which property makes an element bigger? And which word inside it means scale?'),
      L3("Xususiyat transform bo'ladi, uning ichida esa scale ishlaydi. Bir yarimni CSS kodida nuqta bilan yozamiz: bir, nuqta, besh. px esa kerak emas, chunki scale faqat necha barobar ekanini so'raydi.", 'Нужны transform и scale. Полтора в CSS пишут через точку: один, точка, пять. Единица не нужна.', 'You need transform and scale. One and a half is written with a dot in CSS: one, dot, five. No unit.'),
      L3("Pastdagi namunada rasm bir butun o'ndan ikki barobar kattalashyapti, bu juda oz. Muqova uchun ham shu qatorni yozing, faqat son bir yarim bo'lsin.", 'Образец под кодом чуть-чуть увеличивает картинку. Напиши так же, только полтора.', 'The example under the code makes a picture a little bigger. Write the same, only one and a half.')
    ],
    no: L3("Sichqoncha kelsa ham, muqova hali o'sha-o'sha kattalikda turibdi. Uni transform ichidagi scale kattalashtiradi.", 'Обложка под мышкой пока не растёт. Увеличивают transform и scale.', 'The cover doesn’t grow on hover yet. transform with scale makes it bigger.'),
    amount: L3("Muqova kattalashdi-yu, lekin bir yarim barobar emas. scale qavslari ichiga bir, nuqta, besh deb yozing.", 'Обложка растёт, но не в полтора раза. Впиши в scale один точка пять.', 'The cover grows, but not one and a half times. Put one point five in scale.'),
    notScale: L3("Muqova burildi yoki surildi-ku, bizga esa u kattalashishi kerak edi. Kattalashtirishni scale qiladi.", 'Обложка повернулась или сдвинулась, а должна вырасти: scale.', 'The cover turned or moved, but it should grow: scale.'),
    always: L3("Endi muqovalar sichqonchasiz ham doim katta bo'lib turibdi. Kattalashtirishni faqat hover qoidasiga yozing, shunda u sichqoncha kelgandagina ishlaydi.", 'Смотри: обложки теперь большие всегда, даже без мышки. Увеличение должно быть только в правиле с hover.', 'Look: the covers are big all the time now, even without the mouse. The growing should only be in the hover rule.'),
    drill: L3("endi sichqoncha ustida muqova ikki barobar kattalashsin", 'теперь пусть под мышкой обложка вырастает вдвое', 'now make a cover grow twice as big on hover'),
    drillNo: L3("Muqova hali ikki barobar kattalashmayapti. scale qavslariga ikki sonini yozing, nuqta ham, px ham kerak emas.", 'Обложка пока не растёт вдвое. Впиши в scale два.', 'The cover doesn’t double yet. Put two in scale.')
  },
  t3: {
    eyebrow: L3("Yoqtirganlar", 'Любимое', 'Favourites'),
    say: L3("Albomlar ham jonlandi! Endi eng yoqqan qo'shiqlar sahifasini ochamiz. Bu yerda yurak tugmasi bor, lekin unga birorta ham qoida yozilmagan. Sichqoncha kelganda yurak o'n gradusga burilsin, xuddi quvonib ketgandek. Qoidani boshidan oxirigacha o'zingiz yozasiz, tugmaning klassini esa pastdagi HTML kodidan topasiz.",
      'Две страницы горят! Третья: любимое. Здесь есть кнопка-сердечко, но кода нет. Пусть под мышкой сердечко поворачивается на десять градусов, будто радуется. Напиши правило целиком: класс кнопки — в HTML-коде.',
      'Two pages are lit! The third is favourites. There’s a heart button here, but no code. Let the heart turn ten degrees under the mouse, as if it’s happy. Write the whole rule yourself: the button’s class is in the HTML code.'),
    ask: L3("Sichqoncha ustida yurak 10 gradusga burilsin", 'Пусть сердечко под мышкой поворачивается на 10 градусов', 'Make the heart turn 10 degrees on hover'),
    ok: L3("Qoyil! Sichqonchani yurakka olib boring-chi: u xuddi raqsga tushgandek quvonib buriladi.", 'Класс! Наведи мышку на сердечко: оно радостно поворачивается.', 'Nice! Point the mouse at the heart: it turns happily.'),
    hints: [
      L3("Qoidani uch bo'lakdan yig'asiz: hover qo'shilgan selektor, transform xususiyati va burish qiymati. Xo'sh, qaysi biridan boshlaymiz?", 'Правило из трёх частей: селектор с hover, свойство transform и значение-поворот.', 'The rule has three parts: a selector with hover, the transform property and a turning value.'),
      L3("Selektor yurak klassidan va hover so'zidan yasaladi, ular bo'sh joysiz yonma-yon turadi. Qiymati esa rotate bo'ladi, qavs ichiga o'n sonini deg bilan yozasiz.", 'Селектор — класс yurak и hover, без пробела между ними. Значение — rotate, внутри десять и deg.', 'The selector is the yurak class and hover, with no space between. The value is rotate with ten and deg inside.'),
      L3("Kod ostidagi namunada havola sichqoncha ustida yigirma gradusga buriladi. Siz ham shunday qoida yozasiz, faqat havola o'rniga yurak klassi, yigirma o'rniga esa o'n turadi.", 'Образец под кодом поворачивает ссылку под мышкой. Напиши такое же правило, только для yurak и на десять градусов.', 'The example under the code turns a link on hover. Write the same rule, only for yurak and ten degrees.')
    ],
    no: L3("Yurak hali sichqonchaga parvo ham qilmayapti. Unga yurak klassi bilan hover yozilgan selektor, ichida esa rotate bilan transform kerak.", 'Сердечко под мышкой пока не поворачивается. Нужны класс yurak, hover, transform и rotate.', 'The heart doesn’t turn on hover yet. You need the yurak class, hover, transform and rotate.'),
    always: L3("Voy, yurak endi sichqonchasiz ham doim qiyshayib turibdi-ku! Selektorga hover qo'shing, shunda u faqat sichqoncha kelganda buriladi.", 'Смотри: сердечко повёрнуто всегда, даже без мышки. Добавь в селектор hover.', 'Look: the heart is turned all the time, even without the mouse. Add hover to the selector.'),
    notRotate: L3("Yurak kattalashdi yoki surildi, lekin bizga burilishi kerak edi. Burishni rotate qiladi.", 'Сердечко выросло или сдвинулось, а должно повернуться: rotate.', 'The heart grew or moved, but it should turn: rotate.'),
    other: L3("Yurak teskari tomonga burilib ketdi, chunki sonning oldida minus turibdi. Minusni olib tashlab, oddiy o'n deg yozing.", 'Сердечко повернулось в другую сторону. Напиши просто десять deg, без минуса.', 'The heart turned the other way. Write just ten deg, without the minus.'),
    amount: L3("Yurak burildi-yu, lekin o'n gradusga emas. rotate qavslari ichida o'n soni bilan deg tursin.", 'Сердечко повернулось, но не на десять градусов. Впиши в rotate десять deg.', 'The heart turned, but not ten degrees. Put ten deg in rotate.'),
    drill: L3("endi sichqoncha ustida Tinglash tugmasi 5 gradusga burilsin", 'теперь пусть под мышкой кнопка «Слушать» поворачивается на 5 градусов', 'now make the Listen button turn 5 degrees on hover'),
    drillNo: L3("«Tinglash» tugmasi hali besh gradusga burilmayapti. Qoidani tugma klassi va hover uchun yozing, rotate ichiga esa besh deg qo'ying.", 'Кнопка под мышкой пока не поворачивается на пять градусов. Нужны класс tugma, hover и rotate с пятью deg.', 'The button doesn’t turn five degrees on hover yet. You need the tugma class, hover and rotate with five deg.')
  },
  t4: {
    eyebrow: L3("Navbatda", 'Очередь', 'Up next'),
    say: L3("Yurak ham raqsga tushdi, uchta sahifa tayyor! To'rtinchisida navbatdagi qo'shiq turibdi. Sichqoncha kelganda «Keyingi» tugmasi yigirma piksel o'ngga surilishi kerak edi, xuddi «Qani, oldinga!» deb chaqirayotgandek. Bu kodni qo'shiq tugab qolmasin deb, shoshib yozgandim, natijada ikki joyda kod buzilibdi. Ikkalasini topib, tuzatib bering-chi.",
      'Три страницы готовы! Четвёртая: следующая песня. Кнопка «Дальше» под мышкой должна была сдвигаться на двадцать пикселей вправо, будто зовёт вперёд. Но этот код я писал в спешке, и в нём две поломки. Найди и почини их.',
      'Three pages are done! The fourth is the next song. Under the mouse, the Next button was supposed to move twenty pixels right, as if calling you forward. But I wrote this code in a hurry, and it has two broken spots. Find and fix them.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Ana, ishladi! Sichqonchani «Keyingi» tugmasiga olib boring: u o'ngga surilib, sizni navbatdagi qo'shiqqa chaqiradi.", 'Вот это да! Наведи мышку на кнопку: она сдвигается вперёд и зовёт тебя.', 'That’s it! Point the mouse at the button: it slides forward and calls you.'),
    hints: [
      L3("Selektorga bir qarang-chi: tugma bilan hover o'rtasida nima turibdi? translate ichidagi ikki sonning o'rtasida-chi?", 'Посмотри на селектор: что стоит между кнопкой и hover? А между двумя числами в translate?', 'Look at the selector: what’s between the button and hover? And between the two numbers in translate?'),
      L3("Tugma bilan hover o'rtasida ortiqcha bo'sh joy bor, uni o'chirish kerak. translate esa ikki sonni vergulsiz tushunmaydi, ularning o'rtasiga vergul qo'ying.", 'Между кнопкой и hover лишний пробел: убери его. Между числами translate поставь запятую.', 'There’s an extra space between the button and hover: remove it. Put a comma between translate’s numbers.'),
      L3("Pastdagi namunaga qarang-chi: havola pastga surilyapti, selektor ham, vergul ham o'z joyida. Ikkala qatoringizni shunga qarab to'g'rilang-da, «Tekshirish»ni bosing.", 'Образец под кодом — верно записанное правило. Поставь пробелы и запятую так же и нажми «Проверить».', 'The example under the code is a correctly written rule. Place the spaces and the comma the same way and tap Check.')
    ],
    space: L3("Birinchi buzilgan joy selektorda ekan: tugma bilan hover o'rtasida bo'sh joy turibdi. Shu bo'sh joy tufayli brauzer tugmaning ichidan boshqa element qidiryapti. Uni o'chiring-da, vergulni ham tekshirib qo'ying.", 'Смотри: между кнопкой и hover стоит пробел. С пробелом браузер ищет что-то внутри кнопки. Убери пробел.', 'Look: there’s a space between the button and hover. With a space, the browser looks for something inside the button. Remove the space.'),
    no: L3("Tugma hali sichqoncha ustida yigirma piksel o'ngga surilmayapti. translate qavslari ichida yigirma piksel bilan nol piksel tursin, o'rtasida esa vergul bo'lsin.", 'Код работает, но кнопка под мышкой не сдвигается на двадцать пикселей вправо. В translate нужны двадцать пикселей и ноль пикселей.', 'The code works, but the button doesn’t move twenty pixels right on hover. translate needs twenty pixels and zero pixels.'),
    drill: L3("yana bitta qoidani tuzating: sichqoncha ustida tugma biroz kattalashsin", 'почини ещё одно правило: под мышкой кнопка должна чуть-чуть вырасти', 'fix one more rule: the button should grow a little on hover'),
    drillNo: L3("Tugma hali kerakli darajada kattalashmayapti. scale birlikni yoqtirmaydi: px so'zini o'chiring, qavs ichida faqat bir, nuqta, ikki qolsin.", 'Кнопка пока растёт не так. В scale оставь только число: один точка два.', 'The button doesn’t grow the right way yet. Leave just the number in scale: one point two.')
  },
  t5: {
    eyebrow: L3("Mening pleyerim", 'Мой плеер', 'My player'),
    say: L3("To'rtta sahifa yana jaranglayapti! Oxirgisi esa sizning pleyeringiz. «Boshlash» tugmasini o'zingiz jonlantirasiz: sichqoncha kelganda rangi o'zgarsin, transform bilan qimirlasin, ko'rsatkich esa qo'lga aylansin. Qiymatlarni xohlaganingizcha tanlang. Nima tayyor bo'lgani oyna ostida ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: свой плеер. Оживи кнопку «Старт»: цвет под мышкой, transform и курсор-рука. Значения выбирай любые. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: your own player. Bring the Start button to life yourself: a hover color, a transform and a hand pointer. Pick any values. Under the window you can see what’s done.'),
    ask: L3("Tugmangizni jonlantiring: uchta shart", 'Оживи свою кнопку: три условия', 'Bring your button to life: three conditions'),
    ok: L3("Pleyeringiz tayyor, endi bemalol tinglasa bo'ladi! Sichqonchani «Boshlash» tugmasiga olib boring-chi, u sizni kutib turibdi.", 'Ура! Твоя кнопка живая! Наведи на неё мышку.', 'Hooray! Your button is alive! Point the mouse at it.'),
    hints: [
      L3("Sizga ikkita qoida kerak bo'ladi. Biri tugmaning o'zi uchun, ikkinchisi esa hover bilan, sichqoncha kelgan payt uchun.", 'Нужны два правила: одно для самой кнопки, второе с hover.', 'You need two rules: one for the button itself, and one with hover.'),
      L3("Ko'rsatkichni qo'lga cursor pointer aylantiradi, uni tugma klassining qoidasiga yozing. hover qoidasiga esa background-color bilan transform qo'shasiz.", 'Классу tugma — cursor pointer. А в правило с hover — background-color и transform.', 'The tugma class gets cursor pointer. The hover rule gets background-color and transform.'),
      L3("Kod ostida namuna sifatida ikkita qoida turibdi, ulardagi tugma tomato rangga kirib, sal qiyshayadi. Siz esa o'zingizga yoqqan rang va transform tanlang.", 'Образец под кодом — два правила с другими значениями. Выбери свой цвет и transform.', 'The example under the code has two rules with other values. Pick your own color and transform.')
    ],
    needBg: L3("Tugmaning rangi sichqoncha ustida hali o'zgarmayapti. Buning uchun hover qoidasida background-color bo'lishi kerak.", 'Под мышкой цвет кнопки не меняется. Напиши в правило с hover background-color.', 'The button’s color doesn’t change on hover. Write background-color in the hover rule.'),
    sameBg: L3("Sichqoncha ustidagi rang oddiy rangning xuddi o'zi bo'lib qoldi, farqini hech kim sezmaydi. Boshqaroq rang tanlang.", 'Цвет под мышкой такой же, как обычный, — разницы не видно. Выбери другой цвет.', 'The hover color is the same as the normal one, so there’s no difference. Pick another color.'),
    needTf: L3("Tugma sichqonchani ko'rib ham qotib turibdi. hover qoidasiga transform qo'shing: kattalashtirish uchun scale, burish uchun rotate, surish uchun translate.", 'Под мышкой кнопка стоит на месте. Напиши в правило с hover transform: scale, rotate или translate.', 'The button stays still on hover. Write a transform in the hover rule: scale, rotate or translate.'),
    needCur: L3("Ko'rsatkich hali ham oddiy strelka bo'lib turibdi. Tugmaga cursor pointer yozing, shunda u qo'lga aylanadi.", 'Указатель пока стрелка. Напиши для кнопки cursor pointer.', 'The pointer is still an arrow. Write cursor pointer for the button.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Musiqa saytim yana jaranglab ketdi! Beshala sahifadagi tugmalarga siz yozgan CSS jon kiritdi.", 'Кнопки на всех пяти страницах музыкального сайта ожили! Их оживил CSS, написанный твоими руками.', 'The buttons on all five pages of the music site came alive! The CSS you wrote yourself did it.') },
      { k: 'a', text: L3("hover qoidasi faqat sichqoncha element ustiga kelganda ishlaydi, telefonda esa barmoq tekkanda.", 'Правило с hover работает только под мышкой, а на телефоне — при касании.', 'A hover rule only works under the mouse, and on a phone when you tap.') },
      { k: 'b', text: L3("transform elementni o'zgartiradi: scale bilan kattalashtiradi, rotate bilan buradi, translate bilan esa suradi.", 'transform увеличивает, поворачивает и сдвигает: scale, rotate и translate.', 'transform scales, turns and moves: scale, rotate and translate.') },
      { k: 'c', text: L3("cursor pointer ko'rsatkichni qo'lga aylantiradi va «Buni bosish mumkin», deb aytadi.", 'cursor pointer превращает указатель в руку: на это можно нажать.', 'cursor pointer turns the pointer into a hand: you can press this.') },
      { k: 'd', text: L3("Buzilgan joylarni ham endi bir qarashda topasiz: hover oldidagi ortiqcha bo'sh joyni, scale ichida keraksiz turgan px birligini, translate sonlari o'rtasida tushib qolgan vergulni ham.", 'И находишь поломки: пробел перед hover, лишний px в scale и забытую запятую в translate.', 'And you find broken spots: a space before hover, an extra px in scale, and a forgotten comma in translate.') },
      { k: null, text: L3("Sezdingizmi, hozircha tugmalar birdaniga o'zgaryapti. Keyingi darsda ularni silliq qilamiz, o'zgarish asta-sekin bo'ladi. Ko'rishguncha!", 'На следующем уроке сделаем кнопки плавными: изменения будут не сразу, а постепенно. До встречи!', 'Next lesson we’ll make buttons smooth: changes will happen gradually, not all at once. See you!') }
    ],
    roles: {
      a: L3(":hover — sichqoncha ustida", ':hover — под мышкой', ':hover — under the mouse'),
      b: L3("transform: scale, rotate, translate", 'transform: scale, rotate, translate', 'transform: scale, rotate, translate'),
      c: L3("cursor: pointer", 'cursor: pointer', 'cursor: pointer'),
      d: L3("tuzatish: bo'sh joy, px, vergul", 'починка: пробел, px, запятая', 'fixing: space, px, comma')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
