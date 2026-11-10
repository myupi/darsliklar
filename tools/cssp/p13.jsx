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
const P13_SPACE = L3("Qarang: selektorda tugma va hover o'rtasida bo'sh joy turibdi. Bo'sh joy bilan brauzer tugma ichidan qidiradi, shuning uchun hover ishlamaydi. Bo'sh joyni olib tashlang.",
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
    say: L3("Salom! Bu mening musiqa saytim. Tinglash tugmasiga sichqonchani olib kelib ko'ring: u to'q sariq bo'ladi va biroz kattalashadi, ko'rsatkich esa qo'lga aylanadi. Bularni hover, transform va cursor qilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это мой музыкальный сайт. Наведи мышку на кнопку «Слушать»: она становится оранжевой и чуть растёт, а указатель превращается в руку. Это сделали hover, transform и cursor. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my music website. Point the mouse at the Listen button: it turns orange and grows a little, and the pointer turns into a hand. hover, transform and cursor did that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Tugmalar jonsiz bo'lib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Кнопки больше не оживают, а вкладки погасли.', 'Oh no! The CSS code got erased. The buttons don’t come alive anymore, and the tabs went dark.'),
    done: L3("HTML joyida, faqat tugmalar jonsiz. O'tgan darsda sichqoncha ustida ishlaydigan hover qoidasini, transform bilan kattalashtirish, burish va surishni, cursor pointer bilan esa qo'l ko'rsatkichni o'rgandik. Endi beshta sahifadagi tugmalarni jonlantiramiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, но кнопки неживые. На прошлом уроке мы разобрали правило с hover, которое работает под мышкой, transform, чтобы увеличить, повернуть и сдвинуть, и cursor pointer с рукой. Теперь оживим кнопки на пяти страницах, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, but the buttons are lifeless. Last lesson we learned the hover rule that works under the mouse, transform to scale, rotate and move, and cursor pointer with its hand. Now let’s bring the buttons to life on five pages, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi tugmalarni jonlantiramiz", 'Оживим кнопки на пяти страницах', 'Let’s bring the buttons to life on five pages')
  },
  t1: {
    eyebrow: L3("Pleyer", 'Плеер', 'Player'),
    say: L3("Birinchi sahifa: pleyer. Bu yerda hover qoidasi qolgan, lekin unda kulrang turibdi: sichqoncha ustida tugma zerikarli bo'lib qoladi. Sichqoncha ustida tugma to'q sariq bo'lsin: qoidadagi rangni almashtiring. Keyin tugmaga sichqonchani olib borib ko'ring, telefonda esa bosing.",
      'Первая страница: плеер. Здесь осталось правило с hover, но в нём серый: под мышкой кнопка становится скучной. Пусть под мышкой кнопка будет оранжевой: замени цвет в правиле. Потом наведи мышку на кнопку, а на телефоне — коснись её.',
      'The first page is the player. A hover rule is left here, but it says gray: under the mouse the button turns dull. Let the button turn orange under the mouse: change the color in the rule. Then point the mouse at the button, or tap it on a phone.'),
    ask: L3("Sichqoncha ustida tugma to'q sariq bo'lsin", 'Сделай кнопку оранжевой под мышкой', 'Make the button orange on hover'),
    ok: L3("Zo'r! Endi sichqonchani tugmaga olib keling: u to'q sariq bo'lib yonadi.", 'Огонь! Теперь наведи мышку на кнопку: она загорается оранжевым.', 'Awesome! Now point the mouse at the button: it lights up orange.'),
    hints: [
      L3("Qoidaga qarang: selektorda hover bor, demak u sichqoncha ustida ishlaydi. Qaysi so'z rangni beradi?", 'Посмотри на правило: в селекторе есть hover, значит, оно работает под мышкой. Какое слово задаёт цвет?', 'Look at the rule: the selector has hover, so it works under the mouse. Which word sets the color?'),
      L3("To'q sariq inglizcha orange bo'ladi. gray so'zini o'chirib, orange deb yozing.", 'Оранжевый по-английски — orange. Сотри gray и напиши orange.', 'Orange is orange. Erase gray and write orange.'),
      L3("Namuna kod ostida: u havolani sichqoncha ustida qizil qiladi. Xuddi shunday, tugma uchun orange yozing va «Tekshirish»ni bosing.", 'Образец под кодом делает ссылку красной под мышкой. Так же напиши orange для кнопки и нажми «Проверить».', 'The example under the code makes a link red on hover. Write orange for the button the same way and tap Check.')
    ],
    no: L3("Sichqoncha ustidagi rang hali to'q sariq emas. To'q sariq inglizcha orange.", 'Цвет под мышкой пока не оранжевый. Оранжевый по-английски — orange.', 'The hover color isn’t orange yet. Use the word orange.'),
    always: L3("Qarang: tugma endi doim to'q sariq, sichqonchasiz ham. Selektorga yana hover qo'shing: rang faqat sichqoncha ustida o'zgarsin.", 'Смотри: кнопка теперь оранжевая всегда, даже без мышки. Верни в селектор hover: пусть цвет меняется только под мышкой.', 'Look: the button is orange all the time now, even without the mouse. Put hover back in the selector: the color should change only under the mouse.'),
    drill: L3("endi sichqoncha ustida tugma matni oq bo'lsin", 'теперь пусть под мышкой текст кнопки становится белым', 'now make the button text white on hover'),
    drillNo: L3("Sichqoncha ustidagi matn hali oq emas. Matn rangini color beradi, oq esa white.", 'Текст под мышкой пока не белый. Цвет текста задаёт color, а белый — white.', 'The hover text isn’t white yet. color sets the text color, and white is white.')
  },
  t2: {
    eyebrow: L3("Albomlar", 'Альбомы', 'Albums'),
    say: L3("Pleyer yondi! Endi albomlar. Bu yerda hover qoidasi bor, lekin ichi bo'm-bo'sh. Sichqoncha ustida albom muqovasi bir yarim barobar kattalashsin: qavslar ichiga xususiyat va qiymatni yozing.",
      'Плеер горит! Теперь альбомы. Здесь есть правило с hover, но оно пустое. Пусть под мышкой обложка альбома вырастает в полтора раза: впиши в скобки свойство и значение.',
      'The player is lit! Now the albums. There’s a hover rule here, but it’s empty. Let an album cover grow one and a half times under the mouse: write a property and a value inside the braces.'),
    ask: L3("Sichqoncha ustida muqova 1.5 barobar kattalashsin", 'Пусть обложка под мышкой растёт в 1.5 раза', 'Make a cover grow 1.5 times on hover'),
    ok: L3("Ajoyib! Sichqonchani muqovaga olib keling: u kattalashadi, qo'shnilari esa joyida qoladi.", 'Отлично! Наведи мышку на обложку: она растёт, а соседи остаются на месте.', 'Great! Point the mouse at a cover: it grows, and its neighbours stay put.'),
    hints: [
      L3("Elementni qaysi xususiyat kattalashtiradi? Uning ichida qaysi so'z kattalashtirish degani?", 'Каким свойством элемент увеличивают? И какое слово внутри него значит «увеличить»?', 'Which property makes an element bigger? And which word inside it means scale?'),
      L3("transform va scale kerak. Bir yarim CSS tilida nuqta bilan yoziladi: bir, nuqta, besh. Birlik kerak emas.", 'Нужны transform и scale. Полтора в CSS пишут через точку: один, точка, пять. Единица не нужна.', 'You need transform and scale. One and a half is written with a dot in CSS: one, dot, five. No unit.'),
      L3("Namuna kod ostida: u rasmni biroz kattalashtiradi. Xuddi shunday yozing, faqat bir yarim bilan.", 'Образец под кодом чуть-чуть увеличивает картинку. Напиши так же, только полтора.', 'The example under the code makes a picture a little bigger. Write the same, only one and a half.')
    ],
    no: L3("Muqova sichqoncha ustida hali kattalashmayapti. Kattalashtirishni transform va scale qiladi.", 'Обложка под мышкой пока не растёт. Увеличивают transform и scale.', 'The cover doesn’t grow on hover yet. transform with scale makes it bigger.'),
    amount: L3("Muqova kattalashdi, lekin bir yarim barobar emas. scale ichiga bir nuqta besh yozing.", 'Обложка растёт, но не в полтора раза. Впиши в scale один точка пять.', 'The cover grows, but not one and a half times. Put one point five in scale.'),
    notScale: L3("Muqova burildi yoki surildi, lekin u kattalashishi kerak: scale.", 'Обложка повернулась или сдвинулась, а должна вырасти: scale.', 'The cover turned or moved, but it should grow: scale.'),
    always: L3("Qarang: muqovalar endi doim katta, sichqonchasiz ham. Kattalashtirish faqat hover qoidasida bo'lsin.", 'Смотри: обложки теперь большие всегда, даже без мышки. Увеличение должно быть только в правиле с hover.', 'Look: the covers are big all the time now, even without the mouse. The growing should only be in the hover rule.'),
    drill: L3("endi sichqoncha ustida muqova ikki barobar kattalashsin", 'теперь пусть под мышкой обложка вырастает вдвое', 'now make a cover grow twice as big on hover'),
    drillNo: L3("Muqova hali ikki barobar kattalashmayapti. scale ichiga ikki yozing.", 'Обложка пока не растёт вдвое. Впиши в scale два.', 'The cover doesn’t double yet. Put two in scale.')
  },
  t3: {
    eyebrow: L3("Yoqtirganlar", 'Любимое', 'Favourites'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: yoqtirganlar. Bu yerda yurak tugmasi bor, lekin kod yo'q. Sichqoncha ustida yurak o'n gradusga burilsin, xuddi quvonib ketgandek. Qoidani boshidan oxirigacha o'zingiz yozing: tugmaning klassi HTML kodda turibdi.",
      'Две страницы горят! Третья: любимое. Здесь есть кнопка-сердечко, но кода нет. Пусть под мышкой сердечко поворачивается на десять градусов, будто радуется. Напиши правило целиком: класс кнопки — в HTML-коде.',
      'Two pages are lit! The third is favourites. There’s a heart button here, but no code. Let the heart turn ten degrees under the mouse, as if it’s happy. Write the whole rule yourself: the button’s class is in the HTML code.'),
    ask: L3("Sichqoncha ustida yurak 10 gradusga burilsin", 'Пусть сердечко под мышкой поворачивается на 10 градусов', 'Make the heart turn 10 degrees on hover'),
    ok: L3("Qoyil! Sichqonchani yurakka olib keling: u quvonib burilib ketadi.", 'Класс! Наведи мышку на сердечко: оно радостно поворачивается.', 'Nice! Point the mouse at the heart: it turns happily.'),
    hints: [
      L3("Qoida uch qismdan iborat: hover bilan selektor, transform xususiyati va burish qiymati.", 'Правило из трёх частей: селектор с hover, свойство transform и значение-поворот.', 'The rule has three parts: a selector with hover, the transform property and a turning value.'),
      L3("Selektor yurak klassi va hover, ular o'rtasida bo'sh joy yo'q. Qiymat rotate, ichida o'n va deg.", 'Селектор — класс yurak и hover, без пробела между ними. Значение — rotate, внутри десять и deg.', 'The selector is the yurak class and hover, with no space between. The value is rotate with ten and deg inside.'),
      L3("Namuna kod ostida: u havolani sichqoncha ustida buradi. Xuddi shunday qoida yozing, faqat yurak uchun va o'n gradus bilan.", 'Образец под кодом поворачивает ссылку под мышкой. Напиши такое же правило, только для yurak и на десять градусов.', 'The example under the code turns a link on hover. Write the same rule, only for yurak and ten degrees.')
    ],
    no: L3("Yurak sichqoncha ustida hali burilmayapti. Kerak: yurak klassi, hover, transform va rotate.", 'Сердечко под мышкой пока не поворачивается. Нужны класс yurak, hover, transform и rotate.', 'The heart doesn’t turn on hover yet. You need the yurak class, hover, transform and rotate.'),
    always: L3("Qarang: yurak endi doim burilgan, sichqonchasiz ham. Selektorga hover qo'shing.", 'Смотри: сердечко повёрнуто всегда, даже без мышки. Добавь в селектор hover.', 'Look: the heart is turned all the time, even without the mouse. Add hover to the selector.'),
    notRotate: L3("Yurak kattalashdi yoki surildi, lekin u burilishi kerak: rotate.", 'Сердечко выросло или сдвинулось, а должно повернуться: rotate.', 'The heart grew or moved, but it should turn: rotate.'),
    other: L3("Yurak boshqa tomonga burildi. Minussiz, oddiy o'n deg yozing.", 'Сердечко повернулось в другую сторону. Напиши просто десять deg, без минуса.', 'The heart turned the other way. Write just ten deg, without the minus.'),
    amount: L3("Yurak burildi, lekin o'n gradusga emas. rotate ichiga o'n deg yozing.", 'Сердечко повернулось, но не на десять градусов. Впиши в rotate десять deg.', 'The heart turned, but not ten degrees. Put ten deg in rotate.'),
    drill: L3("endi sichqoncha ustida Tinglash tugmasi 5 gradusga burilsin", 'теперь пусть под мышкой кнопка «Слушать» поворачивается на 5 градусов', 'now make the Listen button turn 5 degrees on hover'),
    drillNo: L3("Tugma sichqoncha ustida hali besh gradusga burilmayapti. tugma klassi, hover va rotate ichida besh deg kerak.", 'Кнопка под мышкой пока не поворачивается на пять градусов. Нужны класс tugma, hover и rotate с пятью deg.', 'The button doesn’t turn five degrees on hover yet. You need the tugma class, hover and rotate with five deg.')
  },
  t4: {
    eyebrow: L3("Navbatda", 'Очередь', 'Up next'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: navbatdagi qo'shiq. Keyingi tugmasi sichqoncha ustida yigirma piksel o'ngga surilishi kerak edi, xuddi oldinga chaqirayotgandek. Lekin bu kodni men shoshib yozgan edim va unda ikkita joy buzilgan. Ularni toping va tuzating.",
      'Три страницы готовы! Четвёртая: следующая песня. Кнопка «Дальше» под мышкой должна была сдвигаться на двадцать пикселей вправо, будто зовёт вперёд. Но этот код я писал в спешке, и в нём две поломки. Найди и почини их.',
      'Three pages are done! The fourth is the next song. Under the mouse, the Next button was supposed to move twenty pixels right, as if calling you forward. But I wrote this code in a hurry, and it has two broken spots. Find and fix them.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Sichqonchani tugmaga olib keling: u oldinga surilib, sizni chaqiradi.", 'Вот это да! Наведи мышку на кнопку: она сдвигается вперёд и зовёт тебя.', 'That’s it! Point the mouse at the button: it slides forward and calls you.'),
    hints: [
      L3("Selektorga qarang: tugma va hover o'rtasida nima turibdi? translate ichidagi ikki son o'rtasida-chi?", 'Посмотри на селектор: что стоит между кнопкой и hover? А между двумя числами в translate?', 'Look at the selector: what’s between the button and hover? And between the two numbers in translate?'),
      L3("Tugma va hover o'rtasida ortiqcha bo'sh joy bor, uni olib tashlang. translate sonlari o'rtasiga vergul qo'ying.", 'Между кнопкой и hover лишний пробел: убери его. Между числами translate поставь запятую.', 'There’s an extra space between the button and hover: remove it. Put a comma between translate’s numbers.'),
      L3("Namuna kod ostida: to'g'ri yozilgan qoida. Bo'sh joy va vergulni xuddi shunday qo'ying va «Tekshirish»ni bosing.", 'Образец под кодом — верно записанное правило. Поставь пробелы и запятую так же и нажми «Проверить».', 'The example under the code is a correctly written rule. Place the spaces and the comma the same way and tap Check.')
    ],
    space: L3("Qarang: tugma va hover o'rtasida bo'sh joy turibdi. Bo'sh joy bilan brauzer tugma ichidan boshqa elementni qidiradi. Bo'sh joyni olib tashlang.", 'Смотри: между кнопкой и hover стоит пробел. С пробелом браузер ищет что-то внутри кнопки. Убери пробел.', 'Look: there’s a space between the button and hover. With a space, the browser looks for something inside the button. Remove the space.'),
    no: L3("Kod ishlayapti, lekin tugma sichqoncha ustida yigirma piksel o'ngga surilmayapti. translate ichida yigirma piksel va nol piksel bo'lsin.", 'Код работает, но кнопка под мышкой не сдвигается на двадцать пикселей вправо. В translate нужны двадцать пикселей и ноль пикселей.', 'The code works, but the button doesn’t move twenty pixels right on hover. translate needs twenty pixels and zero pixels.'),
    drill: L3("yana bitta qoidani tuzating: sichqoncha ustida tugma biroz kattalashsin", 'почини ещё одно правило: под мышкой кнопка должна чуть-чуть вырасти', 'fix one more rule: the button should grow a little on hover'),
    drillNo: L3("Tugma hali kerakli darajada kattalashmayapti. scale ichida faqat son qolsin: bir nuqta ikki.", 'Кнопка пока растёт не так. В scale оставь только число: один точка два.', 'The button doesn’t grow the right way yet. Leave just the number in scale: one point two.')
  },
  t5: {
    eyebrow: L3("Mening pleyerim", 'Мой плеер', 'My player'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z pleyeringiz. Boshlash tugmasini o'zingiz jonlantiring: sichqoncha ustidagi rang, transform va qo'l ko'rsatkich. Qiymatlarni istalganicha tanlang. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: свой плеер. Оживи кнопку «Старт»: цвет под мышкой, transform и курсор-рука. Значения выбирай любые. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: your own player. Bring the Start button to life yourself: a hover color, a transform and a hand pointer. Pick any values. Under the window you can see what’s done.'),
    ask: L3("Tugmangizni jonlantiring: uchta shart", 'Оживи свою кнопку: три условия', 'Bring your button to life: three conditions'),
    ok: L3("Ura! Sizning tugmangiz jonli! Sichqonchani olib kelib ko'ring.", 'Ура! Твоя кнопка живая! Наведи на неё мышку.', 'Hooray! Your button is alive! Point the mouse at it.'),
    hints: [
      L3("Ikkita qoida kerak: biri tugmaning o'ziga, ikkinchisi hover bilan.", 'Нужны два правила: одно для самой кнопки, второе с hover.', 'You need two rules: one for the button itself, and one with hover.'),
      L3("tugma klassiga cursor pointer. hover qoidasiga esa background-color va transform.", 'Классу tugma — cursor pointer. А в правило с hover — background-color и transform.', 'The tugma class gets cursor pointer. The hover rule gets background-color and transform.'),
      L3("Namuna kod ostida: boshqa qiymatli ikkita qoida. O'zingizga yoqqan rang va transform tanlang.", 'Образец под кодом — два правила с другими значениями. Выбери свой цвет и transform.', 'The example under the code has two rules with other values. Pick your own color and transform.')
    ],
    needBg: L3("Sichqoncha ustida tugma rangi o'zgarmayapti. hover qoidasiga background-color yozing.", 'Под мышкой цвет кнопки не меняется. Напиши в правило с hover background-color.', 'The button’s color doesn’t change on hover. Write background-color in the hover rule.'),
    sameBg: L3("Sichqoncha ustidagi rang oddiy rang bilan bir xil, farqi ko'rinmaydi. Boshqa rang tanlang.", 'Цвет под мышкой такой же, как обычный, — разницы не видно. Выбери другой цвет.', 'The hover color is the same as the normal one, so there’s no difference. Pick another color.'),
    needTf: L3("Tugma sichqoncha ustida joyida qotib turibdi. hover qoidasiga transform yozing: scale, rotate yoki translate.", 'Под мышкой кнопка стоит на месте. Напиши в правило с hover transform: scale, rotate или translate.', 'The button stays still on hover. Write a transform in the hover rule: scale, rotate or translate.'),
    needCur: L3("Ko'rsatkich hali strelka. Tugmaga cursor pointer yozing.", 'Указатель пока стрелка. Напиши для кнопки cursor pointer.', 'The pointer is still an arrow. Write cursor pointer for the button.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Musiqa saytining beshta sahifasidagi tugmalar ham jonlandi! Ularni siz o'zingiz yozgan CSS jonlantirdi.", 'Кнопки на всех пяти страницах музыкального сайта ожили! Их оживил CSS, написанный твоими руками.', 'The buttons on all five pages of the music site came alive! The CSS you wrote yourself did it.') },
      { k: 'a', text: L3("hover qoidasi faqat sichqoncha ustida ishlaydi, telefonda esa tegilganda.", 'Правило с hover работает только под мышкой, а на телефоне — при касании.', 'A hover rule only works under the mouse, and on a phone when you tap.') },
      { k: 'b', text: L3("transform kattalashtiradi, buradi va suradi: scale, rotate va translate.", 'transform увеличивает, поворачивает и сдвигает: scale, rotate и translate.', 'transform scales, turns and moves: scale, rotate and translate.') },
      { k: 'c', text: L3("cursor pointer ko'rsatkichni qo'lga aylantiradi: bu narsani bosish mumkin.", 'cursor pointer превращает указатель в руку: на это можно нажать.', 'cursor pointer turns the pointer into a hand: you can press this.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: hover oldidagi bo'sh joyni, scale ichidagi ortiqcha px birligini va translate sonlari o'rtasidagi tushib qolgan vergulni.", 'И находишь поломки: пробел перед hover, лишний px в scale и забытую запятую в translate.', 'And you find broken spots: a space before hover, an extra px in scale, and a forgotten comma in translate.') },
      { k: null, text: L3("Keyingi darsda tugmalarni silliq qilamiz: o'zgarish birdaniga emas, asta-sekin bo'ladi. Ko'rishguncha!", 'На следующем уроке сделаем кнопки плавными: изменения будут не сразу, а постепенно. До встречи!', 'Next lesson we’ll make buttons smooth: changes will happen gradually, not all at once. See you!') }
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
