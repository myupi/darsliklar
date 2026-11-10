// =============================================================================
// ===== ПРАКТИКА 14 · «Кинотеатр Коди» · к уроку 14 «Плавные эффекты» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). На сайте кинотеатра Коди кнопки и карточки под мышкой плавно оживали. После обновления код
// эффектов стёрся: правила с hover Коди вернул сам, а плавность (transition) возвращает ученик, страница за страницей:
// заменить время в готовом правиле (3s → полсекунды) → вписать transition в пустое правило карточки (меняются размер
// и цвет — all) → правило целиком: ведёрко попкорна наклоняется ровно за секунду (transform 1s linear) → починить две
// поломки урока («0,5s» с запятой, transfrom) → своя кнопка: hover и transition в правиле самой кнопки (разгадка
// урока: transition внутри hover — обратно рывком). Опора: :hover и transform (урок 13), классы (урок 2).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-14p-transition.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-14p-transition',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "14-amaliyot. Kinoning silliq effektlari", ru: 'Практика 14. Плавные эффекты кино', en: 'Practice 14. Smooth cinema effects' }
};

// Страницы кинотеатра (тексты на языке урока).
const P14 = {
  title: L3("Kino Kodi", 'Кино Коди', 'Kodi Cinema'),
  today: L3("Bugun: «Kosmik mushuk», soat 18:00 da", 'Сегодня: «Космический кот» в 18:00', 'Today: “Space Cat” at 18:00'),
  buy: L3("Chipta olish", 'Купить билет', 'Buy a ticket'),
  afisha: L3("Afisha", 'Афиша', 'Showtimes'),
  film1: L3("«Kosmik mushuk», 18:00", '«Космический кот», 18:00', '“Space Cat”, 18:00'),
  film2: L3("«Robot do'stim», 20:00", '«Мой друг робот», 20:00', '“My Robot Friend”, 20:00'),
  tickets: L3("Chiptalar", 'Билеты', 'Tickets'),
  hall1: L3("1-zal · 30 000 so'm", 'Зал 1 · 30 000 сумов', 'Hall 1 · 30,000 sum'),
  hall2: L3("VIP zal · 60 000 so'm", 'VIP-зал · 60 000 сумов', 'VIP hall · 60,000 sum'),
  popcorn: L3("Popkorn", 'Попкорн', 'Popcorn'),
  bucket: L3("Katta chelak: 20 000 so'm", 'Большое ведёрко: 20 000 сумов', 'Big bucket: 20,000 sum'),
  reviews: L3("Fikrlar", 'Отзывы', 'Reviews'),
  review: L3("«Yilning eng zo'r filmi!»", '«Лучший фильм года!»', '“The best film of the year!”'),
  mine: L3("Mening kinozalim", 'Мой кинозал', 'My cinema hall'),
  mine1: L3("Bugun zalda mening sevimli filmim!", 'Сегодня в зале мой любимый фильм!', 'My favorite film is on today!'),
  watch: L3("Ko'rish", 'Смотреть', 'Watch')
};
// Свои стили сайта (ученику не видны): тёмный зал, золотой заголовок, оранжевые кнопки.
const P14_BASE = 'html{background:#1E1B3A}body{background:#1E1B3A;color:#F1F0FF;font-family:Arial,Helvetica,sans-serif;text-align:center}' +
  'h1{color:#FFC93C;font-size:26px}p{color:#D9D6F5}' +
  '.btn,.like{background:#FA4F28;color:#fff;border:0;border-radius:10px;padding:10px 20px;font:700 16px Arial,Helvetica,sans-serif;cursor:pointer;margin:8px}' +
  '.card{display:inline-block;background:#3B3570;color:#fff;border-radius:12px;padding:12px 16px;margin:8px;font-weight:700}' +
  '.popcorn{display:inline-block;font-size:52px;margin:6px;cursor:pointer}' +
  '.star{display:inline-block;font-size:26px;font-weight:700;color:#FFC93C;margin:8px;cursor:pointer}';
const p14Page = (h, a, btn) => (pk) => '<h1>' + pk(h) + '</h1><p>' + pk(a) + '</p><button class="btn">' + pk(btn) + '</button>';
const p14Afisha = (pk) => '<h1>' + pk(P14.afisha) + '</h1><p>' + pk(P14.film1) + '</p><p>' + pk(P14.film2) + '</p><button class="btn">' + pk(P14.buy) + '</button>';
const p14Tickets = (pk) => '<h1>' + pk(P14.tickets) + '</h1><div class="card">' + pk(P14.hall1) + '</div><div class="card">' + pk(P14.hall2) + '</div>';
const p14Popcorn = (pk) => '<h1>' + pk(P14.popcorn) + '</h1><p>' + pk(P14.bucket) + '</p><div class="popcorn">🍿</div>';
const p14Reviews = (pk) => '<h1>' + pk(P14.reviews) + '</h1><p>' + pk(P14.review) + '</p><button class="like">♥ 125</button><span class="star">★ 4.9</span>';

// Проверка по живой странице: время (computed — всегда в s), плавные свойства, правила с hover.
const p14Sec = (v) => Math.max(0, ...String(v || '').split(',').map((x) => { const t = x.trim(); const n = parseFloat(t); return isNaN(n) ? 0 : /ms$/.test(t) ? n / 1000 : n; }));
const p14Eq = (a, b) => Math.abs(a - b) < 0.001;
const p14Dur = (D, sel) => p14Sec(D.cs(sel, 'transition-duration'));
// Свойства, которые у элемента меняются плавно (время больше нуля); список времён повторяется, как в CSS.
const p14Props = (D, sel) => {
  const pr = D.cs(sel, 'transition-property').split(',').map((s) => s.trim());
  const du = D.cs(sel, 'transition-duration').split(',').map((s) => p14Sec(s));
  return pr.filter((p, i) => (du[i % du.length] || 0) > 0);
};
const p14Smooth = (D, sel, prop) => p14Props(D, sel).some((p) => p === 'all' || p === prop || prop.indexOf(p + '-') === 0);
// Правила с :hover, которые выбирают элемент; что в них меняется (без самого transition).
const p14Hovers = (D, sel) => {
  const el = D.q(sel);
  return D.rules.filter((r) => {
    if (!el || !r.sel || !/:hover/.test(r.sel)) return false;
    try { return el.matches(r.sel.replace(/:hover/g, '')); } catch (e) { return false; }
  });
};
const p14Changed = (D, sel) => {
  const out = [];
  p14Hovers(D, sel).forEach((r) => { for (let i = 0; i < r.style.length; i += 1) { const p = r.style[i]; if (!/^transition/.test(p) && out.indexOf(p) < 0) out.push(p); } });
  return out;
};
// transition только внутри hover: туда плавно, обратно рывком (разгадка урока 14).
const p14InHover = (D, sel) => !p14Dur(D, sel) && p14Hovers(D, sel).some((r) => p14Sec(r.style.getPropertyValue('transition-duration')) > 0);

const PR = {
  next: L3("CSS animatsiyalar", 'CSS-анимации', 'CSS animations'),
  base: P14_BASE,
  tabs: [
    { ico: 'film', c: '#FA4F28', name: P14.afisha, file: 'afisha.html' },
    { ico: 'cart', c: '#7C5CFA', name: P14.tickets, file: 'chiptalar.html' },
    { ico: 'cup', c: '#F59E0B', name: P14.popcorn, file: 'popkorn.html' },
    { ico: 'star', c: '#0FA38E', name: P14.reviews, file: 'fikrlar.html' },
    { ico: 'heart', c: '#E44D8A', name: P14.mine, file: 'my.html' }
  ],
  hook: {
    page: p14Page(P14.title, P14.today, P14.buy),
    css: ['  .btn { transition: all 0.4s; }', '  .btn:hover { transform: scale(1.2); }']
  },
  ownPage: p14Page(P14.mine, P14.mine1, P14.watch),
  ownDefault: '.btn:hover {\n  transform: scale(1.2);\n  background-color: purple;\n}\n.btn {\n  transition: all 0.5s;\n}',
  tasks: [
    // Т1 · заменить значение в готовом правиле: кнопка растёт не за 3s, а за полсекунды.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.btn { transition: transform 3s; }', answer: '.btn { transition: transform 0.5s; }',
      page: p14Afisha, given: ['.btn:hover { transform: scale(1.2); }'],
      goal: (D) => {
        const s = p14Dur(D, '.btn');
        if (s && !p14Smooth(D, '.btn', 'transform')) return C.t1.prop;
        return p14Eq(s, 0.5) ? null : C.t1.no;
      },
      sample: ['.btn { transition: transform 0.2s; }'],
      drill: { single: true, code0: '.btn { transition: transform 3s; }', answer: '.btn { transition: transform 1s; }',
        goal: (D) => (p14Smooth(D, '.btn', 'transform') && p14Eq(p14Dur(D, '.btn'), 1) ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать transition в пустое правило: под мышкой меняются размер и цвет — плавно всё (all).
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: '.card {\n  \n}', answer: '.card {\n  transition: all 0.5s;\n}',
      page: p14Tickets, given: ['.card:hover { transform: scale(1.1); background-color: orange; }'],
      goal: (D) => {
        if (!p14Dur(D, '.card')) return C.t2.none;
        const tf = p14Smooth(D, '.card', 'transform'), bg = p14Smooth(D, '.card', 'background-color');
        if (!tf || !bg) return tf ? C.t2.onlyTf : bg ? C.t2.onlyBg : C.t2.prop;
        return p14Eq(p14Dur(D, '.card'), 0.5) ? null : C.t2.time;
      },
      sample: ['.btn {', '  transition: all 2s;', '}'],
      drill: { code0: '.card {\n  \n}', answer: '.card {\n  transition: all 2s;\n}',
        goal: (D) => (p14Smooth(D, '.card', 'transform') && p14Smooth(D, '.card', 'background-color') && p14Eq(p14Dur(D, '.card'), 2) ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: ведёрко наклоняется ровно (linear) за одну секунду; класс — из HTML.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.popcorn {\n  transition: transform 1s linear;\n}',
      page: p14Popcorn, given: ['.popcorn:hover { transform: rotate(-20deg); }'],
      htmlAid: () => ['<div class="popcorn">🍿</div>'],
      goal: (D) => {
        if (p14InHover(D, '.popcorn')) return C.t3.hover;
        if (!p14Dur(D, '.popcorn')) return C.t3.none;
        if (!p14Smooth(D, '.popcorn', 'transform')) return C.t3.prop;
        if (!p14Eq(p14Dur(D, '.popcorn'), 1)) return C.t3.time;
        return /linear/.test(D.cs('.popcorn', 'transition-timing-function')) ? null : C.t3.linear;
      },
      sample: ['.btn {', '  transition: transform 2s linear;', '}'],
      drill: { code0: '', answer: '.popcorn {\n  transition: transform 300ms;\n}',
        goal: (D) => (p14Smooth(D, '.popcorn', 'transform') && p14Eq(p14Dur(D, '.popcorn'), 0.3) ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: «0,5s» с запятой и transfrom (браузер его принимает, но плавным не
    // становится ничего). Дополнительная — время без s.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.like { transition: transform 0,5s; }\n.star { transition: transfrom 0.5s; }',
      answer: '.like { transition: transform 0.5s; }\n.star { transition: transform 0.5s; }',
      page: p14Reviews, given: ['.like:hover { transform: scale(1.2); }', '.star:hover { transform: scale(1.4); }'],
      goal: (D) => {
        if (!p14Smooth(D, '.like', 'transform')) return C.t4.like;
        if (!p14Smooth(D, '.star', 'transform')) return C.t4.typo;
        return null;
      },
      sample: ['.btn { transition: transform 0.3s; }', '.card { transition: background-color 1s; }'],
      drill: { single: true, code0: '.like { transition: transform 0.5; }', answer: '.like { transition: transform 0.5s; }',
        goal: (D) => (p14Smooth(D, '.like', 'transform') && p14Eq(p14Dur(D, '.like'), 0.5) ? null : C.t4.drillNo) }
    }),
    // Т5 · своя кнопка: что меняется под мышкой (hover) и transition в правиле самой кнопки.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '',
      answer: '.btn:hover {\n  transform: scale(1.2);\n  background-color: purple;\n}\n.btn {\n  transition: all 0.5s;\n}',
      page: p14Page(P14.mine, P14.mine1, P14.watch),
      list: [
        { t: L3(".btn:hover", '.btn:hover', '.btn:hover'), ok: (D) => p14Changed(D, '.btn').length > 0 },
        { t: L3(".btn — transition", '.btn — transition', '.btn — transition'), ok: (D) => p14Dur(D, '.btn') > 0 },
        { t: L3("o'sha xususiyat yoki all", 'то же свойство или all', 'same property or all'),
          ok: (D) => { const ch = p14Changed(D, '.btn'); return ch.length > 0 && ch.some((p) => p14Smooth(D, '.btn', p)); } }
      ],
      goal: (D) => {
        const ch = p14Changed(D, '.btn');
        if (!ch.length) return C.t5.needHover;
        if (p14InHover(D, '.btn')) return C.t5.inHover;
        if (!p14Dur(D, '.btn')) return C.t5.needTr;
        if (!ch.some((p) => p14Smooth(D, '.btn', p))) return C.t5.prop;
        if (p14Dur(D, '.btn') > 5) return C.t5.long;
        return null;
      },
      sample: ['.btn:hover {', '  transform: rotate(-5deg);', '}', '.btn {', '  transition: transform 0.3s ease;', '}'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы goal, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// Реплики сцеплены в одну историю: каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining kinoteatri", 'Кинотеатр Коди', 'Kodi’s cinema'),
    say: L3("Salom! Bu mening kinoteatrimning sayti. Tugmaga sichqonchani olib boring yoki bosib ko'ring: u sakramaydi, silliq kattalashadi. Buni transition qilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кинотеатра. Наведи мышку на кнопку или нажми на неё: она не прыгает, а плавно растёт. Это сделал transition. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my cinema’s website. Move the mouse over the button or tap it: it doesn’t jump, it grows smoothly. transition did that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Effektlar kodi o'chib ketdi. Tugmalar endi sichqoncha kelganda jonlanmaydi, varaqlar esa o'chdi.",
      'Ой! Код с эффектами стёрся. Кнопки больше не оживают под мышкой, а вкладки погасли.',
      'Oh no! The effects code got erased. The buttons don’t come alive under the mouse anymore, and the tabs went dark.'),
    done: L3("Ranglar va tugmalar joyida turibdi, faqat jonlilik yo'qoldi. O'tgan darsda transition xususiyatini o'rgandik: qaysi xususiyat silliq o'zgaradi va necha soniyada. Hover qoidalarini men qaytardim, silliqlikni esa siz qaytarasiz. Beshinchi sahifa sizniki bo'ladi.",
      'Цвета и кнопки на месте, пропала только живость. На прошлом уроке мы разобрали transition: какое свойство меняется плавно и за сколько секунд. Правила с hover я вернул, а плавность вернёшь ты. Пятая страница будет твоей.',
      'The colors and buttons are fine, only the life is gone. Last lesson we learned transition: which property changes smoothly and in how many seconds. I’ve put the hover rules back, and you’ll bring back the smoothness. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Silliqlikni qaytaramiz: kodni siz yozasiz", 'Вернём плавность: код пишешь ты', 'Let’s bring back the smoothness: you write the code')
  },
  t1: {
    eyebrow: L3("Afisha", 'Афиша', 'Showtimes'),
    say: L3("Birinchi sahifa: afisha. Bu yerda transition bor, lekin tugma uch soniya davomida o'sadi, xuddi toshbaqadek. Tugma yarim soniyada o'ssin: qoidadagi vaqtni almashtiring.",
      'Первая страница: афиша. Здесь transition есть, но кнопка растёт целых три секунды, как черепаха. Пусть она растёт за полсекунды: замени в правиле время.',
      'The first page is the showtimes. There’s a transition here, but the button takes three whole seconds to grow, like a turtle. Make it grow in half a second: change the time in the rule.'),
    ask: L3("Tugma yarim soniyada o'ssin", 'Пусть кнопка растёт за полсекунды', 'Make the button grow in half a second'),
    ok: L3("Zo'r! Endi tugma chaqqon va silliq. Afisha jonlandi!", 'Огонь! Теперь кнопка шустрая и плавная. Афиша ожила!', 'Awesome! Now the button is quick and smooth. The showtimes page is alive!'),
    hints: [
      L3("Qoidaga qarang: transform so'zidan keyin nima turibdi? Aynan u o'zgarish qancha davom etishini aytadi.", 'Посмотри на правило: что стоит после слова transform? Именно оно говорит, сколько длится изменение.', 'Look at the rule: what comes after the word transform? That’s what says how long the change takes.'),
      L3("Bu vaqt: uch s, ya'ni uch soniya degani. Yarim soniya esa nol butun o'ndan besh va s harfi bilan yoziladi.", 'Это время: три s, то есть три секунды. А полсекунды пишут как ноль целых пять десятых с буквой s.', 'That’s the time: three s, meaning three seconds. Half a second is written as zero point five with the letter s.'),
      L3("Namuna kod ostida: u tugmani juda tez qiladi. Xuddi shunday, uch soniya o'rniga yarim soniya yozing va Tekshirishni bosing.", 'Образец под кодом делает кнопку очень быстрой. Так же замени три секунды на полсекунды и нажми «Проверить».', 'The example under the code makes the button very fast. The same way, change three seconds to half a second and tap Check.')
    ],
    no: L3("Tugma hali yarim soniyada o'smayapti. Yarim soniya bu nol butun o'ndan besh va s harfi.", 'Кнопка пока растёт не за полсекунды. Полсекунды — это ноль целых пять десятых и буква s.', 'The button doesn’t grow in half a second yet. Half a second is zero point five and the letter s.'),
    prop: L3("Sichqoncha kelganda transform o'zgaradi, transition qoidasida esa boshqa nom turibdi. transform so'zini qoldiring, faqat vaqtni almashtiring.", 'Под мышкой меняется transform, а в transition стоит другое имя. Оставь transform и поменяй только время.', 'Under the mouse, transform changes, but transition has a different name. Keep transform and change only the time.'),
    drill: L3("endi tugma roppa-rosa bir soniyada o'ssin", 'теперь пусть кнопка растёт ровно за одну секунду', 'now make the button grow in exactly one second'),
    drillNo: L3("Tugma hali bir soniyada o'smayapti. Bir soniya bu bir raqami va s harfi.", 'Кнопка пока растёт не за одну секунду. Одна секунда — это единица и буква s.', 'The button doesn’t grow in one second yet. One second is a one and the letter s.')
  },
  t2: {
    eyebrow: L3("Chiptalar", 'Билеты', 'Tickets'),
    say: L3("Afisha tayyor! Endi chiptalar sahifasi. Sichqoncha kelganda karta kattalashadi va to'q sariq rangga kiradi, lekin ikkalasi ham birdaniga sakraydi. O'lchami ham, rangi ham yarim soniyada silliq o'zgarsin: qavslar ichiga transition yozing.",
      'Афиша готова! Теперь страница билетов. Под мышкой карточка растёт и становится оранжевой, но и то и другое прыгает рывком. Пусть и размер, и цвет меняются плавно за полсекунды: впиши transition в скобки.',
      'The showtimes are done! Now the tickets page. Under the mouse, a card grows and turns orange, but both jump at once. Make both the size and the color change smoothly in half a second: write transition inside the braces.'),
    ask: L3("Kartaning o'lchami ham, rangi ham silliq bo'lsin: 0.5s", 'Сделай плавными и размер, и цвет карточки: 0.5s', 'Make the card’s size and color smooth: 0.5s'),
    ok: L3("Ajoyib! Karta endi butunlay silliq o'zgaradi. Chiptalar tayyor!", 'Отлично! Теперь карточка меняется плавно целиком. Билеты готовы!', 'Great! Now the whole card changes smoothly. The tickets page is ready!'),
    hints: [
      L3("Hover qoidasiga qarang: unda ikkita xususiyat o'zgaryapti. Hammasini silliq qiladigan so'z esingizdami?", 'Посмотри на правило с hover: в нём меняются два свойства. Помнишь слово, которое делает плавным всё сразу?', 'Look at the hover rule: two properties change there. Remember the word that makes everything smooth at once?'),
      L3("Bu all, ya'ni hammasi degani. Qavslar ichiga transition, ikki nuqta, all va yarim soniya yozing, oxirida nuqtali vergul.", 'Это all, то есть «всё». Впиши в скобки transition, двоеточие, all и полсекунды, в конце точка с запятой.', 'It’s all, meaning everything. Inside the braces write transition, a colon, all and half a second, with a semicolon at the end.'),
      L3("Namuna kod ostida: u hammasini ikki soniyada silliq qiladi. Xuddi shunday yozing, faqat yarim soniya bilan.", 'Образец под кодом делает всё плавным за две секунды. Напиши так же, только с полсекундой.', 'The example under the code makes everything smooth in two seconds. Write the same, only with half a second.')
    ],
    none: L3("Karta hali ham sakraydi: qavslar ichida transition yo'q.", 'Карточка всё ещё прыгает: в скобках нет transition.', 'The card still jumps: there’s no transition inside the braces.'),
    onlyTf: L3("O'lcham silliq bo'ldi, lekin rang hali sakraydi. Hammasi silliq bo'lishi uchun all yozing.", 'Размер стал плавным, а цвет всё ещё прыгает. Чтобы плавным было всё, напиши all.', 'The size is smooth now, but the color still jumps. To make everything smooth, write all.'),
    onlyBg: L3("Rang silliq bo'ldi, lekin o'lcham hali sakraydi. Hammasi silliq bo'lishi uchun all yozing.", 'Цвет стал плавным, а размер всё ещё прыгает. Чтобы плавным было всё, напиши all.', 'The color is smooth now, but the size still jumps. To make everything smooth, write all.'),
    prop: L3("transition qoidasida boshqa xususiyat turibdi. Kartada o'lcham va rang o'zgaradi: hammasi uchun all yozing.", 'В transition стоит другое свойство. У карточки меняются размер и цвет: для всего сразу напиши all.', 'transition names a different property. The card’s size and color change: write all for everything.'),
    time: L3("Hammasi silliq, lekin vaqt boshqa. Yarim soniya kerak: nol butun o'ndan besh va s harfi.", 'Всё плавно, но время другое. Нужно полсекунды: ноль целых пять десятых и буква s.', 'Everything is smooth, but the time is different. We need half a second: zero point five and the letter s.'),
    drill: L3("endi karta sekin, ikki soniyada o'zgarsin", 'теперь пусть карточка меняется медленно, за две секунды', 'now make the card change slowly, in two seconds'),
    drillNo: L3("Karta hali ikki soniyada o'zgarmayapti. Ikki soniya bu ikki raqami va s harfi, all so'zi ham qolsin.", 'Карточка пока меняется не за две секунды. Две секунды — это двойка и буква s, и all тоже оставь.', 'The card doesn’t change in two seconds yet. Two seconds is a two and the letter s, and keep all too.')
  },
  t3: {
    eyebrow: L3("Popkorn", 'Попкорн', 'Popcorn'),
    say: L3("Ikkita sahifa tayyor! Uchinchisi: popkorn. Sichqoncha kelganda chelak qiyshayadi, lekin silliqlik kodi yo'q, shuning uchun birdaniga. Chelak bir soniyada, tekis tezlikda qiyshaysin: qoidani boshidan oxirigacha o'zingiz yozing. Chelakning klassi HTML kodda ko'rinib turibdi.",
      'Две страницы готовы! Третья: попкорн. Под мышкой ведёрко наклоняется, но кода плавности нет, поэтому рывком. Пусть ведёрко наклоняется за одну секунду, с ровной скоростью: напиши правило целиком. Класс ведёрка виден в HTML-коде.',
      'Two pages are done! The third is popcorn. Under the mouse the bucket tilts, but there’s no smoothness code, so it jumps. Make the bucket tilt in one second at an even speed: write the whole rule yourself. The bucket’s class is shown in the HTML code.'),
    ask: L3("Chelak tekis qiyshaysin: 1s", 'Сделай наклон ведёрка ровным: 1s', 'Make the bucket tilt evenly: 1s'),
    ok: L3("Voy, qanday silliq! Chelak tekis qiyshayadi va tekis qaytadi.", 'Ого, как плавно! Ведёрко ровно наклоняется и ровно возвращается.', 'Wow, so smooth! The bucket tilts evenly and comes back evenly.'),
    hints: [
      L3("Qoida bu selektor, transition va uning qiymati. Qiymatda esa uchta so'z bor: nima, qancha vaqt va qanday tezlikda.", 'Правило — это селектор, transition и его значение. А в значении три слова: что, сколько времени и с какой скоростью.', 'The rule is a selector, transition and its value. And the value has three words: what, how long and at what speed.'),
      L3("Selektor nuqta va popcorn so'zi, qiymat esa transform, bir soniya va linear. linear ya'ni tekis degani.", 'Селектор: точка и слово popcorn, значение: transform, одна секунда и linear. linear — то есть «ровно».', 'The selector is a dot and the word popcorn; the value is transform, one second and linear. linear means even.'),
      L3("Namuna kod ostida: tugma ikki soniyada tekis o'zgaradi. Xuddi shunday, chelak uchun bir soniya bilan yozing.", 'Образец под кодом: кнопка ровно меняется за две секунды. Напиши так же для ведёрка, с одной секундой.', 'The example under the code: a button changes evenly in two seconds. Write the same for the bucket, with one second.')
    ],
    none: L3("Chelak hali sakraydi: uning qoidasida transition yo'q.", 'Ведёрко всё ещё прыгает: в его правиле нет transition.', 'The bucket still jumps: its rule has no transition.'),
    hover: L3("transition hover qoidasida turibdi: chelak silliq qiyshayadi, lekin birdaniga qaytadi. Uni chelakning o'z qoidasiga yozing.", 'transition стоит в правиле с hover: ведёрко наклонится плавно, а вернётся рывком. Напиши его в правило самого ведёрка.', 'transition is in the hover rule: the bucket tilts smoothly but snaps back. Put it in the bucket’s own rule.'),
    prop: L3("Chelakda transform o'zgaradi, transition qoidasida esa boshqa nom turibdi. transform yozing.", 'У ведёрка меняется transform, а в transition стоит другое имя. Напиши transform.', 'The bucket’s transform changes, but transition names something else. Write transform.'),
    time: L3("Silliq, lekin vaqt boshqa. Bir soniya kerak.", 'Плавно, но время другое. Нужна одна секунда.', 'Smooth, but the time is different. We need one second.'),
    linear: L3("Silliq, lekin tezlik bir xil emas: boshida va oxirida sekinlashadi. Tekis tezlik uchun linear qo'shing.", 'Плавно, но скорость не ровная: в начале и в конце замедляется. Для ровной скорости допиши linear.', 'Smooth, but the speed isn’t even: it slows at the start and end. Add linear for an even speed.'),
    drill: L3("endi chelak tez, uch yuz millisoniyada qiyshaysin", 'теперь пусть ведёрко наклоняется быстро, за триста миллисекунд', 'now make the bucket tilt fast, in three hundred milliseconds'),
    drillNo: L3("Chelak hali uch yuz millisoniyada qiyshaymayapti. Bu uch yuz soni va ms harflari.", 'Ведёрко пока наклоняется не за триста миллисекунд. Это число триста и буквы ms.', 'The bucket doesn’t tilt in three hundred milliseconds yet. That’s the number three hundred and the letters ms.')
  },
  t4: {
    eyebrow: L3("Fikrlar", 'Отзывы', 'Reviews'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: tomoshabinlar fikrlari. Bu kodni men shoshib yozgan edim, unda ikkita joy buzilgan. Shuning uchun yurakcha tugma ham, yulduz ham sakraydi. Ikkala buzilgan joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: отзывы зрителей. Этот код я писал в спешке, и в нём две поломки. Поэтому и кнопка с сердечком, и звезда прыгают. Найди и почини обе поломки.',
      'Three pages are done! The fourth is viewer reviews. I wrote this code in a hurry, and it has two broken spots. That’s why both the heart button and the star jump. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Ikkala buzilgan joy topildi: yurakcha ham, yulduz ham silliq.", 'Вот это да! Обе поломки найдены: и сердечко, и звезда плавные.', 'That’s it! Both broken spots are fixed: the heart and the star are smooth.'),
    hints: [
      L3("Har bir qoidani diqqat bilan o'qing: vaqt qanday yozilgan, xususiyat nomi-chi?", 'Прочитай каждое правило внимательно: как записано время, а имя свойства?', 'Read each rule carefully: how is the time written, and the property name?'),
      L3("Birinchi qoidada vaqt vergul bilan yozilgan, CSS esa nuqtani tushunadi. Ikkinchisida transform so'zida harflar almashib qolgan.", 'В первом правиле время записано через запятую, а CSS понимает точку. Во втором в слове transform переставлены буквы.', 'In the first rule the time uses a comma, but CSS understands a dot. In the second, letters in the word transform are swapped.'),
      L3("Namuna kod ostida: ikkita to'g'ri qoida. Vaqtni va nomni xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом — два верных правила. Запиши время и имя так же и нажми «Проверить».', 'The example under the code has two correct rules. Write the time and the name the same way and tap Check.')
    ],
    like: L3("Yurakcha tugma hali sakraydi. Uning qoidasidagi vaqtni tekshiring.", 'Кнопка с сердечком всё ещё прыгает. Проверь время в её правиле.', 'The heart button still jumps. Check the time in its rule.'),
    typo: L3("Yulduz hali sakraydi. Brauzer yozuvni qabul qildi, lekin bunday xususiyat yo'q: transform so'zini harfma-harf tekshiring.", 'Звезда всё ещё прыгает. Браузер принял запись, но такого свойства нет: проверь слово transform буква за буквой.', 'The star still jumps. The browser accepted the entry, but there’s no such property: check the word transform letter by letter.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Yurakcha hali yarim soniyada o'zgarmayapti. Vaqtga s harfi kerak.", 'Сердечко пока меняется не за полсекунды. Времени нужна буква s.', 'The heart doesn’t change in half a second yet. The time needs the letter s.')
  },
  t5: {
    eyebrow: L3("Mening kinozalim", 'Мой кинозал', 'My cinema hall'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki. Kinozalingiz tugmasini jonlantiring: sichqoncha kelganda u qanday o'zgarishini hover qoidasida yozing, keyin tugmaning o'z qoidasiga transition qo'shing. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя. Оживи кнопку своего кинозала: в правиле с hover напиши, как она меняется под мышкой, а в правило самой кнопки добавь transition. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours. Bring your cinema hall’s button to life: in the hover rule, write how it changes under the mouse, then add transition to the button’s own rule. Under the window you can see what’s done.'),
    ask: L3("Tugmangizni jonlantiring: hover va transition", 'Оживи свою кнопку: hover и transition', 'Bring your button to life: hover and transition'),
    ok: L3("Ura! Kinozalingiz tayyor, tugmasi esa silliq jonlanadi!", 'Ура! Твой кинозал готов, а кнопка плавно оживает!', 'Hooray! Your cinema hall is ready, and its button comes alive smoothly!'),
    hints: [
      L3("Ikkita qoida kerak: biri sichqoncha kelganda nima o'zgarishini aytadi, ikkinchisi buni silliq qiladi.", 'Нужны два правила: одно говорит, что меняется под мышкой, второе делает это плавным.', 'You need two rules: one says what changes under the mouse, the other makes it smooth.'),
      L3("Birinchi qoidaning selektori nuqta btn va hover, ichida masalan transform. Ikkinchisi nuqta btn, ichida transition: xususiyat va vaqt.", 'Первое правило: селектор точка btn с hover, внутри, например, transform. Второе: точка btn, внутри transition со свойством и временем.', 'The first rule: the selector dot btn with hover, with transform inside, for example. The second: dot btn, with transition, a property and a time inside.'),
      L3("Namuna kod ostida: tugma qiyshayadi va silliq qaytadi. O'zingizga yoqqanini yozing.", 'Образец под кодом: кнопка наклоняется и плавно возвращается. Напиши то, что нравится тебе.', 'The example under the code: the button tilts and smoothly comes back. Write what you like.')
    ],
    needHover: L3("Sichqoncha kelganda tugmada hech narsa o'zgarmaydi. hover qoidasini yozing, masalan transform bilan.", 'Под мышкой у кнопки ничего не меняется. Напиши правило с hover, например с transform.', 'Nothing changes on the button under the mouse. Write a hover rule, for example with transform.'),
    inHover: L3("transition hover qoidasida turibdi: tugma silliq o'zgaradi, lekin birdaniga qaytadi. Uni tugmaning o'z qoidasiga ko'chiring.", 'transition стоит в правиле с hover: кнопка изменится плавно, а вернётся рывком. Перенеси его в правило самой кнопки.', 'transition is in the hover rule: the button changes smoothly but snaps back. Move it to the button’s own rule.'),
    needTr: L3("Tugma hali sakraydi: uning o'z qoidasida transition yo'q.", 'Кнопка всё ещё прыгает: в её собственном правиле нет transition.', 'The button still jumps: its own rule has no transition.'),
    prop: L3("transition bir xususiyatni silliq qiladi, hover qoidasida esa boshqasi o'zgaradi. O'sha xususiyat nomini yoki all yozing.", 'transition делает плавным одно свойство, а под hover меняется другое. Напиши имя того свойства или all.', 'transition smooths one property, but a different one changes on hover. Write that property’s name, or all.'),
    long: L3("Bu juda uzoq: tugmani kutib charchab qolasiz. Besh soniyadan kam vaqt yozing.", 'Это слишком долго: устанешь ждать кнопку. Напиши меньше пяти секунд.', 'That’s too long: you’d get tired waiting for the button. Write less than five seconds.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kinoteatrning beshta sahifasi ham yana jonli! Tugmalar va kartalar silliq o'zgaradi, chunki transition kodini siz yozdingiz.", 'Все пять страниц кинотеатра снова живые! Кнопки и карточки меняются плавно, потому что код transition написан тобой.', 'All five cinema pages are alive again! Buttons and cards change smoothly, because you wrote the transition code.') },
      { k: 'a', text: L3("transition qoidasida oldin xususiyat, keyin vaqt yoziladi.", 'В transition сначала пишешь свойство, потом время.', 'In transition you write the property first, then the time.') },
      { k: 'b', text: L3("Vaqtni soniyada yoki millisoniyada yozasiz, tekis tezlik uchun esa linear qo'shasiz.", 'Время пишешь в секундах или миллисекундах, а для ровной скорости добавляешь linear.', 'You write time in seconds or milliseconds, and add linear for an even speed.') },
      { k: 'c', text: L3("all bilan hamma o'zgarishlar silliq bo'ladi, transition esa tugmaning o'z qoidasida turadi.", 'С all плавными становятся все изменения, а transition стоит в правиле самой кнопки.', 'With all, every change becomes smooth, and transition goes in the button’s own rule.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: vergulli vaqtni va harflari almashgan transform so'zini.", 'И находишь поломки: время с запятой и transform с переставленными буквами.', 'And you find broken spots: a time with a comma and transform with swapped letters.') },
      { k: null, text: L3("Keyingi darsda CSS animatsiyalarni o'rganamiz: narsalar sichqonchasiz, o'zi harakatlanadi. Ko'rishguncha!", 'На следующем уроке — CSS-анимации: вещи будут двигаться сами, без мышки. До встречи!', 'Next lesson is CSS animations: things will move by themselves, without the mouse. See you!') }
    ],
    roles: {
      a: L3("transition: xususiyat va vaqt", 'transition: свойство и время', 'transition: property and time'),
      b: L3("s va ms · linear", 's и ms · linear', 's and ms · linear'),
      c: L3("all · tugmaning o'z qoidasida", 'all · в правиле самой кнопки', 'all · in the button’s own rule'),
      d: L3("tuzatish: «0,5s» va transfrom", 'починка: «0,5s» и transfrom', 'fixing: “0,5s” and transfrom')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
