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
    say: L3("Salom! Seans boshlanishiga oz qoldi, kinoteatrimning saytiga bir nazar tashlang. «Chipta olish» tugmasiga sichqonchani olib boring yoki ustiga bosib ko'ring: u sakramaydi, asta-sekin, silliq kattalashadi. Bu ishni transition qilgan. Afisha ham, chiptalar ham, popkorn bilan tomoshabinlar fikrlari ham shu saytda turibdi. Seansdan oldin uni bir yangilab qo'yay: «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кинотеатра. Наведи мышку на кнопку или нажми на неё: она не прыгает, а плавно растёт. Это сделал transition. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my cinema’s website. Move the mouse over the button or tap it: it doesn’t jump, it grows smoothly. transition did that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy, film o'rtasida ekran qotib qolgandek bo'ldi! Effektlar kodi o'chib ketibdi: endi tugmalar sichqoncha kelganda jonlanmay qo'yibdi, tepadagi varaqlar ham qorong'i bo'lib qolibdi.",
      'Ой! Код с эффектами стёрся. Кнопки больше не оживают под мышкой, а вкладки погасли.',
      'Oh no! The effects code got erased. The buttons don’t come alive under the mouse anymore, and the tabs went dark.'),
    done: L3("Ranglar ham, tugmalar ham joyida turibdi, faqat sayt jonliligini yo'qotibdi. O'tgan darsda transition bilan qaysi xususiyat silliq o'zgarishini va bu necha soniya davom etishini yozishni o'rgandik. hover qoidalarini men allaqachon qaytarib qo'ydim, shuning uchun tugmalar o'zgaradi-yu, lekin birdaniga sakraydi. Silliqlikni esa siz qaytarasiz. Beshinchi sahifada sizning kinozalingiz bo'ladi.",
      'Цвета и кнопки на месте, пропала только живость. На прошлом уроке мы разобрали transition: какое свойство меняется плавно и за сколько секунд. Правила с hover я вернул, а плавность вернёшь ты. Пятая страница будет твоей.',
      'The colors and buttons are fine, only the life is gone. Last lesson we learned transition: which property changes smoothly and in how many seconds. I’ve put the hover rules back, and you’ll bring back the smoothness. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Silliqlikni qaytaramiz: kodni siz yozasiz", 'Вернём плавность: код пишешь ты', 'Let’s bring back the smoothness: you write the code')
  },
  t1: {
    eyebrow: L3("Afisha", 'Афиша', 'Showtimes'),
    say: L3("Birinchi bo'lib afishani ochamiz. Bu yerda transition bor, lekin tugma butun uch soniya davomida o'sadi, xuddi toshbaqadek. Tomoshabin uni kutib, seansga kechikib qoladi-ku! Tugma yarim soniyada o'ssin: qoidadagi vaqtni almashtiring.",
      'Первая страница: афиша. Здесь transition есть, но кнопка растёт целых три секунды, как черепаха. Пусть она растёт за полсекунды: замени в правиле время.',
      'The first page is the showtimes. There’s a transition here, but the button takes three whole seconds to grow, like a turtle. Make it grow in half a second: change the time in the rule.'),
    ask: L3("Tugma yarim soniyada o'ssin", 'Пусть кнопка растёт за полсекунды', 'Make the button grow in half a second'),
    ok: L3("Barakalla! Tugma endi yarim soniyada chaqqon va silliq o'syapti, afisha ham jonlanib ketdi.", 'Огонь! Теперь кнопка шустрая и плавная. Афиша ожила!', 'Awesome! Now the button is quick and smooth. The showtimes page is alive!'),
    hints: [
      L3("Qoidaga bir qarang-chi: transform so'zidan keyin nima turibdi? O'zgarish qancha davom etishini aynan o'sha aytib turadi.", 'Посмотри на правило: что стоит после слова transform? Именно оно говорит, сколько длится изменение.', 'Look at the rule: what comes after the word transform? That’s what says how long the change takes.'),
      L3("U yerda uch s turibdi, bu uch soniya degani. Yarim soniya esa nol butun o'ndan besh bo'ladi: kodda uni nuqta bilan yozib, oxiriga s harfini qo'shasiz.", 'Это время: три s, то есть три секунды. А полсекунды пишут как ноль целых пять десятых с буквой s.', 'That’s the time: three s, meaning three seconds. Half a second is written as zero point five with the letter s.'),
      L3("Kod ostidagi namunada tugma nol butun o'ndan ikki soniyada, juda tez o'syapti. Sizning qoidangizda ham faqat vaqt o'zgaradi: uch soniya o'rniga yarim soniya yozing-da, «Tekshirish»ni bosing.", 'Образец под кодом делает кнопку очень быстрой. Так же замени три секунды на полсекунды и нажми «Проверить».', 'The example under the code makes the button very fast. The same way, change three seconds to half a second and tap Check.')
    ],
    no: L3("Tugma hali yarim soniyada o'smayapti. Yarim soniya kodda nol, nuqta, besh va s harfi bilan yoziladi.", 'Кнопка пока растёт не за полсекунды. Полсекунды — это ноль целых пять десятых и буква s.', 'The button doesn’t grow in half a second yet. Half a second is zero point five and the letter s.'),
    prop: L3("Sichqoncha kelganda tugmaning transform xususiyati o'zgaradi, transition qatorida esa boshqa nom turib qolibdi. transform so'zini joyida qoldirib, faqat vaqtni almashtiring.", 'Под мышкой меняется transform, а в transition стоит другое имя. Оставь transform и поменяй только время.', 'Under the mouse, transform changes, but transition has a different name. Keep transform and change only the time.'),
    drill: L3("endi tugma roppa-rosa bir soniyada o'ssin", 'теперь пусть кнопка растёт ровно за одну секунду', 'now make the button grow in exactly one second'),
    drillNo: L3("Tugma hali bir soniyada o'smayapti. Bir soniyani bir raqami va s harfi bilan yozasiz.", 'Кнопка пока растёт не за одну секунду. Одна секунда — это единица и буква s.', 'The button doesn’t grow in one second yet. One second is a one and the letter s.')
  },
  t2: {
    eyebrow: L3("Chiptalar", 'Билеты', 'Tickets'),
    say: L3("Afisha tayyor, endi chipta kassasiga o'tamiz! Chipta kartochkasiga sichqoncha kelsa, u kattalashadi va to'q sariq rangga kiradi, lekin ikkalasi ham birdaniga sakrab o'zgaradi. O'lchami ham, rangi ham yarim soniyada silliq o'zgarishi kerak. Jingalak qavslar ichiga transition yozing.",
      'Афиша готова! Теперь страница билетов. Под мышкой карточка растёт и становится оранжевой, но и то и другое прыгает рывком. Пусть и размер, и цвет меняются плавно за полсекунды: впиши transition в скобки.',
      'The showtimes are done! Now the tickets page. Under the mouse, a card grows and turns orange, but both jump at once. Make both the size and the color change smoothly in half a second: write transition inside the braces.'),
    ask: L3("Kartochkaning o'lchami ham, rangi ham silliq bo'lsin: 0.5s", 'Сделай плавными и размер, и цвет карточки: 0.5s', 'Make the card’s size and color smooth: 0.5s'),
    ok: L3("Ajoyib! Kartochka endi boshdan-oyoq silliq o'zgaradi, chiptalarni bemalol sotsa bo'ladi!", 'Отлично! Теперь карточка меняется плавно целиком. Билеты готовы!', 'Great! Now the whole card changes smoothly. The tickets page is ready!'),
    hints: [
      L3("hover qoidasiga qarang-chi: unda bitta emas, ikkita xususiyat o'zgaryapti. Hammasini birdaniga silliq qiladigan so'z esingizdami?", 'Посмотри на правило с hover: в нём меняются два свойства. Помнишь слово, которое делает плавным всё сразу?', 'Look at the hover rule: two properties change there. Remember the word that makes everything smooth at once?'),
      L3("Bu so'z all, inglizchada «hammasi» degani. Qavslar ichiga transition yozing, ikki nuqtadan keyin all bilan yarim soniyani qo'ying, oxirida esa nuqtali vergul tursin.", 'Это all, то есть «всё». Впиши в скобки transition, двоеточие, all и полсекунды, в конце точка с запятой.', 'It’s all, meaning everything. Inside the braces write transition, a colon, all and half a second, with a semicolon at the end.'),
      L3("Namunaga qarang-chi: u boshqa tugmaning hamma o'zgarishini ikki soniyada silliq qilyapti. Kartochka uchun ham shu qatorni yozing, faqat ikki soniya o'rniga yarim soniya bo'lsin.", 'Образец под кодом делает всё плавным за две секунды. Напиши так же, только с полсекундой.', 'The example under the code makes everything smooth in two seconds. Write the same, only with half a second.')
    ],
    none: L3("Kartochka hali ham sakrab o'zgaryapti, chunki qavslar ichida transition yo'q.", 'Карточка всё ещё прыгает: в скобках нет transition.', 'The card still jumps: there’s no transition inside the braces.'),
    onlyTf: L3("O'lcham silliq bo'ldi-yu, rang hali ham sakrab almashyapti. Ikkalasi ham silliq bo'lishi uchun xususiyat nomi o'rniga all yozing.", 'Размер стал плавным, а цвет всё ещё прыгает. Чтобы плавным было всё, напиши all.', 'The size is smooth now, but the color still jumps. To make everything smooth, write all.'),
    onlyBg: L3("Endi aksincha: rang silliq almashyapti, o'lcham esa hali ham sakrab o'zgaryapti. Ikkalasini birga faqat all silliq qila oladi.", 'Цвет стал плавным, а размер всё ещё прыгает. Чтобы плавным было всё, напиши all.', 'The color is smooth now, but the size still jumps. To make everything smooth, write all.'),
    prop: L3("transition qatorida kartochkada o'zgarmaydigan xususiyat turibdi. Kartochkaning o'lchami bilan rangi o'zgaradi, ikkalasi uchun ham all yozing.", 'В transition стоит другое свойство. У карточки меняются размер и цвет: для всего сразу напиши all.', 'transition names a different property. The card’s size and color change: write all for everything.'),
    time: L3("Hammasi silliq o'zgaryapti, faqat vaqt boshqacha. Bizga yarim soniya kerak: nol, nuqta, besh va s harfi.", 'Всё плавно, но время другое. Нужно полсекунды: ноль целых пять десятых и буква s.', 'Everything is smooth, but the time is different. We need half a second: zero point five and the letter s.'),
    drill: L3("endi kartochka sekin, ikki soniyada o'zgarsin", 'теперь пусть карточка меняется медленно, за две секунды', 'now make the card change slowly, in two seconds'),
    drillNo: L3("Kartochka hali ikki soniyada o'zgarmayapti. Vaqtga ikki raqami bilan s harfini yozing, all so'zi esa joyida qolsin.", 'Карточка пока меняется не за две секунды. Две секунды — это двойка и буква s, и all тоже оставь.', 'The card doesn’t change in two seconds yet. Two seconds is a two and the letter s, and keep all too.')
  },
  t3: {
    eyebrow: L3("Popkorn", 'Попкорн', 'Popcorn'),
    say: L3("Chiptalar ham sotuvga chiqdi! Kino popkornsiz bo'lmaydi-ku, endi popkorn sahifasini ochamiz. Sichqoncha kelganda chelak qiyshayadi, lekin silliqlik kodi yo'qligi uchun birdaniga qiyshayib qoladi. Chelak bir soniya davomida, bir xil tezlikda qiyshaysin. Bu safar qoidani boshidan oxirigacha o'zingiz yozasiz, chelakning klassi esa HTML kodida ko'rinib turibdi.",
      'Две страницы готовы! Третья: попкорн. Под мышкой ведёрко наклоняется, но кода плавности нет, поэтому рывком. Пусть ведёрко наклоняется за одну секунду, с ровной скоростью: напиши правило целиком. Класс ведёрка виден в HTML-коде.',
      'Two pages are done! The third is popcorn. Under the mouse the bucket tilts, but there’s no smoothness code, so it jumps. Make the bucket tilt in one second at an even speed: write the whole rule yourself. The bucket’s class is shown in the HTML code.'),
    ask: L3("Chelak tekis qiyshaysin: 1s", 'Сделай наклон ведёрка ровным: 1s', 'Make the bucket tilt evenly: 1s'),
    ok: L3("Voy, qanday silliq! Chelak bir xil tezlikda qiyshayib, xuddi shunday tekis joyiga qaytyapti. Popkorn ham to'kilmadi!", 'Ого, как плавно! Ведёрко ровно наклоняется и ровно возвращается.', 'Wow, so smooth! The bucket tilts evenly and comes back evenly.'),
    hints: [
      L3("Qoida selektordan, transition xususiyatidan va uning qiymatidan yig'iladi. Qiymatda esa uchta so'z bo'ladi: nima o'zgaradi, qancha vaqt va qanday tezlikda.", 'Правило — это селектор, transition и его значение. А в значении три слова: что, сколько времени и с какой скоростью.', 'The rule is a selector, transition and its value. And the value has three words: what, how long and at what speed.'),
      L3("Selektor nuqta bilan popcorn so'zidan yasaladi. Qiymatga transform, bir soniya va linear yoziladi, linear esa tezlikni boshidan oxirigacha bir xil qiladi.", 'Селектор: точка и слово popcorn, значение: transform, одна секунда и linear. linear — то есть «ровно».', 'The selector is a dot and the word popcorn; the value is transform, one second and linear. linear means even.'),
      L3("Pastga bitta namuna qo'ydim: unda tugma ikki soniya davomida bir xil tezlikda o'zgaradi. Chelak uchun ham qoidani shu tartibda yozing, faqat btn o'rniga popcorn, ikki soniya o'rniga esa bir soniya bo'lsin.", 'Образец под кодом: кнопка ровно меняется за две секунды. Напиши так же для ведёрка, с одной секундой.', 'The example under the code: a button changes evenly in two seconds. Write the same for the bucket, with one second.')
    ],
    none: L3("Chelak yana birdaniga qiyshayib qolyapti: uning qoidasida transition yo'q ekan.", 'Ведёрко всё ещё прыгает: в его правиле нет transition.', 'The bucket still jumps: its rule has no transition.'),
    hover: L3("Darsdagi garov esingizdami? transition hover qoidasiga yozilsa, chelak silliq qiyshayadi-yu, joyiga birdaniga sakrab qaytadi. Uni chelakning o'z qoidasiga yozing.", 'transition стоит в правиле с hover: ведёрко наклонится плавно, а вернётся рывком. Напиши его в правило самого ведёрка.', 'transition is in the hover rule: the bucket tilts smoothly but snaps back. Put it in the bucket’s own rule.'),
    prop: L3("Chelak qiyshayganda uning transform xususiyati o'zgaradi, transition qatorida esa boshqa nom turibdi. O'sha nom o'rniga transform yozing.", 'У ведёрка меняется transform, а в transition стоит другое имя. Напиши transform.', 'The bucket’s transform changes, but transition names something else. Write transform.'),
    time: L3("Chelak silliq qiyshayyapti, faqat vaqti boshqacha. Bizga roppa-rosa bir soniya kerak.", 'Плавно, но время другое. Нужна одна секунда.', 'Smooth, but the time is different. We need one second.'),
    linear: L3("Silliq-ku, lekin tezligi bir xil emas: chelak boshida ham, oxirida ham sekinlashyapti. Tezlik boshidan oxirigacha bir xil bo'lishi uchun linear qo'shing.", 'Плавно, но скорость не ровная: в начале и в конце замедляется. Для ровной скорости допиши linear.', 'Smooth, but the speed isn’t even: it slows at the start and end. Add linear for an even speed.'),
    drill: L3("endi chelak tez, uch yuz millisoniyada qiyshaysin", 'теперь пусть ведёрко наклоняется быстро, за триста миллисекунд', 'now make the bucket tilt fast, in three hundred milliseconds'),
    drillNo: L3("Chelak hali uch yuz millisoniyada qiyshaymayapti. Vaqtga uch yuz sonini, yoniga esa ms harflarini yozing.", 'Ведёрко пока наклоняется не за триста миллисекунд. Это число триста и буквы ms.', 'The bucket doesn’t tilt in three hundred milliseconds yet. That’s the number three hundred and the letters ms.')
  },
  t4: {
    eyebrow: L3("Fikrlar", 'Отзывы', 'Reviews'),
    say: L3("Popkorn ham tayyor, uchta sahifa ishlayapti! Endi tomoshabinlar fikrlarini o'qiymiz. Bu sahifani reklama tugab, film boshlanay deb turganda yozgan edim, tekshirishga vaqt qolmadi. Natijada yurak tugmasi ham, yulduz ham silliq o'zgarish o'rniga sakrab turibdi: kodda ikkita joy buzilgan. Qani, ikkala aybdor qatorni topib, tuzatib qo'ying.",
      'Три страницы готовы! Четвёртая: отзывы зрителей. Этот код я писал в спешке, и в нём две поломки. Поэтому и кнопка с сердечком, и звезда прыгают. Найди и почини обе поломки.',
      'Three pages are done! The fourth is viewer reviews. I wrote this code in a hurry, and it has two broken spots. That’s why both the heart button and the star jump. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Topdingiz-ku! Endi yurak tugmasi ham, yulduz ham sakramay, silliq kattalashyapti.", 'Вот это да! Обе поломки найдены: и сердечко, и звезда плавные.', 'That’s it! Both broken spots are fixed: the heart and the star are smooth.'),
    hints: [
      L3("Ikkala qoidani ham sekin, diqqat bilan o'qib chiqing-chi. Vaqt qanday yozilgan? Xususiyatning nomi-chi?", 'Прочитай каждое правило внимательно: как записано время, а имя свойства?', 'Read each rule carefully: how is the time written, and the property name?'),
      L3("Birinchi qoidada vaqt vergul bilan yozilibdi, CSS esa kasrni faqat nuqta bilan tushunadi. Ikkinchisida esa transform so'zidagi ikki harf o'rin almashib qolibdi.", 'В первом правиле время записано через запятую, а CSS понимает точку. Во втором в слове transform переставлены буквы.', 'In the first rule the time uses a comma, but CSS understands a dot. In the second, letters in the word transform are swapped.'),
      L3("Ikkita to'g'ri qoidani namuna qilib pastga qo'ydim: ularda vaqt ham, xususiyat nomi ham joyida. Ularga qarab, qatorlaringizni harfma-harf tuzating-da, «Tekshirish»ni bosing.", 'Образец под кодом — два верных правила. Запиши время и имя так же и нажми «Проверить».', 'The example under the code has two correct rules. Write the time and the name the same way and tap Check.')
    ],
    like: L3("Yurak tugmasi hali ham sakrab kattalashyapti. Uning qoidasidagi vaqtga qarang-chi: kasr qanday yozilgan?", 'Кнопка с сердечком всё ещё прыгает. Проверь время в её правиле.', 'The heart button still jumps. Check the time in its rule.'),
    typo: L3("Yulduz hali ham sakrayapti. Brauzer qatorni qabul qildi-yu, lekin bunday nomli xususiyatni topolmadi: transform so'zini harfma-harf tekshirib chiqing.", 'Звезда всё ещё прыгает. Браузер принял запись, но такого свойства нет: проверь слово transform буква за буквой.', 'The star still jumps. The browser accepted the entry, but there’s no such property: check the word transform letter by letter.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Yurak tugmasi hali yarim soniyada o'zgarmayapti. Sonning yonida s harfi yo'q, usiz brauzer bu soniyami yoki boshqa narsami, bilmaydi.", 'Сердечко пока меняется не за полсекунды. Времени нужна буква s.', 'The heart doesn’t change in half a second yet. The time needs the letter s.')
  },
  t5: {
    eyebrow: L3("Mening kinozalim", 'Мой кинозал', 'My cinema hall'),
    say: L3("To'rtta sahifa tayyor, kinoteatr tomoshabinlarni kutib turibdi! Oxirgi sahifa esa sizniki: o'zingizning kinozalingiz. Uning «Ko'rish» tugmasini jonlantiring. Oldin hover qoidasida sichqoncha kelganda tugma qanday o'zgarishini yozing, keyin tugmaning o'z qoidasiga transition qo'shing. Oyna ostidagi uchta shart bajarilgan sari bittalab belgilanib boradi.",
      'Четыре страницы горят! Последняя — твоя. Оживи кнопку своего кинозала: в правиле с hover напиши, как она меняется под мышкой, а в правило самой кнопки добавь transition. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours. Bring your cinema hall’s button to life: in the hover rule, write how it changes under the mouse, then add transition to the button’s own rule. Under the window you can see what’s done.'),
    ask: L3("Tugmangizni jonlantiring: hover va transition", 'Оживи свою кнопку: hover и transition', 'Bring your button to life: hover and transition'),
    ok: L3("Kinozalingiz eshiklarini ochdi! «Ko'rish» tugmasi silliq jonlanadi, sichqoncha ketganda ham silliq joyiga qaytadi.", 'Ура! Твой кинозал готов, а кнопка плавно оживает!', 'Hooray! Your cinema hall is ready, and its button comes alive smoothly!'),
    hints: [
      L3("Ikki qoida kerak bo'ladi: biri sichqoncha kelganda tugmada nima o'zgarishini aytadi, ikkinchisi esa shu o'zgarishni silliq qiladi. Qaysi biri qayerda turishini darsdagi garov eslatib turibdi-ku.", 'Нужны два правила: одно говорит, что меняется под мышкой, второе делает это плавным.', 'You need two rules: one says what changes under the mouse, the other makes it smooth.'),
      L3("Birinchi qoidaning selektori btn klassi bilan hover bo'ladi, ichiga, masalan, transform yozasiz. Ikkinchisining selektori faqat btn klassi, ichida esa xususiyat nomi va vaqt bilan transition turadi.", 'Первое правило: селектор точка btn с hover, внутри, например, transform. Второе: точка btn, внутри transition со свойством и временем.', 'The first rule: the selector dot btn with hover, with transform inside, for example. The second: dot btn, with transition, a property and a time inside.'),
      L3("Namunadagi tugma sichqoncha kelganda sal qiyshayadi va silliq joyiga qaytadi. Siz esa o'z tugmangiz uchun boshqa o'zgarish va vaqt o'ylab toping.", 'Образец под кодом: кнопка наклоняется и плавно возвращается. Напиши то, что нравится тебе.', 'The example under the code: the button tilts and smoothly comes back. Write what you like.')
    ],
    needHover: L3("Tugmaning ustiga sichqoncha kelsa ham, hech narsa o'zgarmayapti. Oldin hover qoidasini yozing, masalan, transform bilan.", 'Под мышкой у кнопки ничего не меняется. Напиши правило с hover, например с transform.', 'Nothing changes on the button under the mouse. Write a hover rule, for example with transform.'),
    inHover: L3("Ana, o'sha tuzoq: transition hover qoidasida turibdi. Tugma silliq o'zgaradi-yu, lekin sichqoncha ketganda birdaniga sakrab qaytadi. Uni tugmaning o'z qoidasiga ko'chiring.", 'transition стоит в правиле с hover: кнопка изменится плавно, а вернётся рывком. Перенеси его в правило самой кнопки.', 'transition is in the hover rule: the button changes smoothly but snaps back. Move it to the button’s own rule.'),
    needTr: L3("Tugma baribir sakrab o'zgaryapti, chunki uning o'z qoidasida transition yo'q.", 'Кнопка всё ещё прыгает: в её собственном правиле нет transition.', 'The button still jumps: its own rule has no transition.'),
    prop: L3("transition bitta xususiyatni silliq qilyapti, hover qoidasida esa boshqasi o'zgaryapti. O'sha xususiyatning nomini yozing yoki hammasi uchun all qo'ying.", 'transition делает плавным одно свойство, а под hover меняется другое. Напиши имя того свойства или all.', 'transition smooths one property, but a different one changes on hover. Write that property’s name, or all.'),
    long: L3("Voy, bunchalik sekin bo'lsa, tomoshabin tugmani kutib, filmni o'tkazib yuboradi! Besh soniyadan kamroq vaqt yozing.", 'Это слишком долго: устанешь ждать кнопку. Напиши меньше пяти секунд.', 'That’s too long: you’d get tired waiting for the button. Write less than five seconds.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Seansga ham ulgurdik: kinoteatrimning beshala sahifasi yana jonli! Tugmalar va kartochkalar silliq o'zgaradi, chunki transition kodini siz yozdingiz.", 'Все пять страниц кинотеатра снова живые! Кнопки и карточки меняются плавно, потому что код transition написан тобой.', 'All five cinema pages are alive again! Buttons and cards change smoothly, because you wrote the transition code.') },
      { k: 'a', text: L3("transition qatoriga oldin xususiyatning nomini, keyin vaqtni yozasiz.", 'В transition сначала пишешь свойство, потом время.', 'In transition you write the property first, then the time.') },
      { k: 'b', text: L3("Vaqt soniyada ham, millisoniyada ham yoziladi, linear esa tezlikni boshidan oxirigacha bir xil qiladi.", 'Время пишешь в секундах или миллисекундах, а для ровной скорости добавляешь linear.', 'You write time in seconds or milliseconds, and add linear for an even speed.') },
      { k: 'c', text: L3("all bilan hamma o'zgarishlar birga silliq bo'ladi. transition esa hover qoidasida emas, tugmaning o'z qoidasida turadi, shunda tugma joyiga ham silliq qaytadi.", 'С all плавными становятся все изменения, а transition стоит в правиле самой кнопки.', 'With all, every change becomes smooth, and transition goes in the button’s own rule.') },
      { k: 'd', text: L3("Endi buzilgan joylarni ham ko'rib turasiz: vergul bilan yozilgan vaqtni ham, harflari almashib qolgan transform so'zini ham.", 'И находишь поломки: время с запятой и transform с переставленными буквами.', 'And you find broken spots: a time with a comma and transform with swapped letters.') },
      { k: null, text: L3("Hozircha tugmalarimiz faqat sichqonchani kutib jonlanyapti. Keyingi darsda esa CSS animatsiyalari bilan narsalar o'z-o'zidan harakatlanadi. Ko'rishguncha!", 'На следующем уроке — CSS-анимации: вещи будут двигаться сами, без мышки. До встречи!', 'Next lesson is CSS animations: things will move by themselves, without the mouse. See you!') }
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
