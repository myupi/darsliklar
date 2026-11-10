// =============================================================================
// ===== ПРАКТИКА 15 · «Космос Коди» · к уроку 15 «CSS-анимации» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). На космическом сайте Коди ракета, звёзды и планеты двигались сами. После обновления CSS
// стёрся — всё замерло. Ученик оживляет пять страниц: заменить число повторов на infinite в готовом правиле (ракета) →
// вписать средний кадр 50% в готовый план (звезда растёт) → правило целиком: планета крутится по плану aylan ровно и
// без конца (animation: aylan 4s linear infinite) → починить две поломки урока (имя с опечаткой, нет времени;
// дополнительная — кадр «50» без %) → своя анимация летающей тарелки: кадр to, animation с именем, временем и повторами.
// Опора: transform (урок 13), классы (урок 2), transition — не нужен. Будущих тем нет.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-15p-animacii.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-15p-animacii',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "15-amaliyot. Koinotga parvoz", ru: 'Практика 15. Полёт в космос', en: 'Practice 15. Flight to space' }
};

// Страницы космического сайта (тексты на языке урока).
const P15 = {
  title: L3("Kodining koinoti", 'Космос Коди', 'Kodi’s space'),
  go: L3("Yulduzlar sari uchdik!", 'Летим к звёздам!', 'Off to the stars!'),
  rocket: L3("Raketa", 'Ракета', 'Rocket'),
  soon: L3("Start yaqinda!", 'Скоро старт!', 'Launch is coming soon!'),
  stars: L3("Yulduzlar", 'Звёзды', 'Stars'),
  wish: L3("Bir tilak tilang!", 'Загадай желание!', 'Make a wish!'),
  planets: L3("Sayyoralar", 'Планеты', 'Planets'),
  rings: L3("Saturnning halqalari bor", 'У Сатурна есть кольца', 'Saturn has rings'),
  signals: L3("Signallar", 'Сигналы', 'Signals'),
  write: L3("Bizga koinotdan yozishyapti!", 'Нам пишут из космоса!', 'Space is writing to us!'),
  mine: L3("Mening koinotim", 'Мой космос', 'My space'),
  mine1: L3("Likopcham yulduzlar sari uchadi!", 'Моя тарелка летит к звёздам!', 'My saucer flies to the stars!')
};
// Свои стили сайта (ученику не видны): ночное небо, крупные значки.
const P15_BASE = 'html{background:#0B1026}body{background:#0B1026;color:#E8EAF6;font-family:Arial,Helvetica,sans-serif;text-align:center}' +
  'h1{color:#8AB4FF;font-size:26px}p{color:#C5CAE9}' +
  '.raketa,.yulduz,.sayyora,.antenna,.yoldosh,.qahramon{display:inline-block;font-size:46px;line-height:1;margin:10px 16px}' +
  '.yulduz{font-size:34px;margin:10px}';
const p15Page = (h, a, body) => (pk) => '<h1>' + pk(h) + '</h1><p>' + pk(a) + '</p>' + body;
const p15Hook = p15Page(P15.title, P15.go, '<div class="raketa">🚀</div>');
const p15Rocket = p15Page(P15.rocket, P15.soon, '<div class="raketa">🚀</div>');
const p15Stars = p15Page(P15.stars, P15.wish, '<div class="yulduz">⭐</div><div class="yulduz">⭐</div><div class="yulduz">⭐</div>');
const p15Planets = p15Page(P15.planets, P15.rings, '<div class="sayyora">🪐</div>');
const p15Signals = p15Page(P15.signals, P15.write, '<div class="antenna">📡</div><div class="yoldosh">🛰️</div>');
const p15Own = p15Page(P15.mine, P15.mine1, '<div class="qahramon">🛸</div>');

// Проверка по живой странице: вычисленные animation-*, план — последний @keyframes с этим именем (как у браузера).
const p15Sec = (v) => Math.max(0, ...String(v || '').split(',').map((x) => { const t = x.trim(); const n = parseFloat(t); return isNaN(n) ? 0 : /ms$/.test(t) ? n / 1000 : n; }));
const p15Eq = (a, b) => Math.abs(a - b) < 0.001;
const p15Name = (D, sel) => D.cs(sel, 'animation-name');
const p15Dur = (D, sel) => p15Sec(D.cs(sel, 'animation-duration'));
const p15Count = (D, sel) => D.cs(sel, 'animation-iteration-count');
const p15Kf = (D, name) => { const all = D.rules.filter((r) => r.kf && r.kf === name); return all.length ? all[all.length - 1] : null; };
const p15Frames = (k) => (k && k.rule && k.rule.cssRules ? Array.from(k.rule.cssRules) : []);
const p15Frame = (D, name, key) => p15Frames(p15Kf(D, name)).find((f) => f.keyText === key) || null;
const p15Scale = (tf) => { const m = /scale\(\s*([\d.]+)/.exec(String(tf || '')); return m ? parseFloat(m[1]) : 1; };
const p15Up = (tf) => /translateY\(\s*-\s*\d/.test(String(tf || '')) || /translate\([^,)]+,\s*-\s*\d/.test(String(tf || ''));
// Своя анимация (т5): есть ли план, кадр конца не пустой, имя совпало с планом.
const p15Plans = (D) => D.rules.filter((r) => r.kf);
const p15HasEnd = (D) => p15Plans(D).some((k) => p15Frames(k).some((f) => f.keyText !== '0%' && f.style.length > 0));
const p15OwnPlan = (D) => { const n = p15Name(D, '.qahramon'); return n && n !== 'none' ? p15Kf(D, n) : null; };
const p15Repeats = (D, sel) => { const c = p15Count(D, sel); return c === 'infinite' || parseFloat(c) >= 2; };

const PR = {
  next: L3("Moslashuvchan sayt", 'Адаптивность', 'Responsive design'),
  base: P15_BASE,
  tabs: [
    { ico: 'rocket', c: '#FA4F28', name: P15.rocket, file: 'raketa.html' },
    { ico: 'star', c: '#F59E0B', name: P15.stars, file: 'yulduzlar.html' },
    { ico: 'sun', c: '#7C5CFA', name: P15.planets, file: 'sayyoralar.html' },
    { ico: 'mail', c: '#0FA38E', name: P15.signals, file: 'signallar.html' },
    { ico: 'heart', c: '#E44D8A', name: P15.mine, file: 'my.html' }
  ],
  hook: {
    page: p15Hook,
    css: ['  @keyframes parvoz {', '    from { transform: translateY(0); }', '    to { transform: translateY(-20px); }', '  }',
      '  .raketa { animation: parvoz 1s alternate infinite; }']
  },
  ownPage: p15Own,
  ownDefault: '@keyframes sayohat {\n  from { transform: translateX(0); }\n  to { transform: translateX(120px); }\n}\n.qahramon { animation: sayohat 2s alternate infinite; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: ракета взлетает один раз → без конца (infinite).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.raketa { animation: parvoz 2s 1; }', answer: '.raketa { animation: parvoz 2s infinite; }',
      page: p15Rocket,
      given: ['@keyframes parvoz {', '  0% { transform: translateY(0); }', '  50% { transform: translateY(-30px); }', '  100% { transform: translateY(0); }', '}'],
      goal: (D) => {
        if (p15Name(D, '.raketa') !== 'parvoz') return C.t1.name;
        if (!p15Dur(D, '.raketa')) return C.t1.time;
        return p15Count(D, '.raketa') === 'infinite' ? null : C.t1.no;
      },
      sample: ['.kub { animation: sakra 1s infinite; }'],
      drill: { single: true, code0: '.raketa { animation: parvoz 2s 1; }', answer: '.raketa { animation: parvoz 2s 3; }',
        goal: (D) => (p15Name(D, '.raketa') === 'parvoz' && p15Dur(D, '.raketa') > 0 && p15Count(D, '.raketa') === '3' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать в готовый средний кадр 50%: звезда в середине растёт (scale больше 1).
    (pk) => cpTask(2, {
      kind: 'write-declaration',
      code0: '@keyframes miltilla {\n  0% { transform: scale(1); }\n  50% {\n    \n  }\n  100% { transform: scale(1); }\n}',
      answer: '@keyframes miltilla {\n  0% { transform: scale(1); }\n  50% {\n    transform: scale(1.5);\n  }\n  100% { transform: scale(1); }\n}',
      page: p15Stars, given: ['.yulduz { animation: miltilla 1s infinite; }'],
      goal: (D) => {
        if (!p15Kf(D, 'miltilla')) return C.t2.name;
        const f = p15Frame(D, 'miltilla', '50%');
        if (!f) return C.t2.no50;
        if (!f.style.length) return C.t2.empty;
        return p15Scale(f.style.transform) > 1 ? null : C.t2.small;
      },
      sample: ['@keyframes aylan {', '  50% {', '    transform: rotate(45deg);', '  }', '}'],
      drill: { code0: '@keyframes miltilla {\n  0% { transform: scale(1); }\n  50% {\n    \n  }\n  100% { transform: scale(1); }\n}',
        answer: '@keyframes miltilla {\n  0% { transform: scale(1); }\n  50% {\n    transform: translateY(-20px);\n  }\n  100% { transform: scale(1); }\n}',
        goal: (D) => { const f = p15Frame(D, 'miltilla', '50%'); return f && p15Up(f.style.transform) ? null : C.t2.drillNo; } }
    }),
    // Т3 · правило целиком: планета крутится по плану aylan ровно и без конца, оборот за 4s; класс — из HTML.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.sayyora {\n  animation: aylan 4s linear infinite;\n}',
      page: p15Planets, given: ['@keyframes aylan {', '  from { transform: rotate(0deg); }', '  to { transform: rotate(360deg); }', '}'],
      htmlAid: () => ['<div class="sayyora">🪐</div>'],
      goal: (D) => {
        const n = p15Name(D, '.sayyora');
        if (!n || n === 'none') return C.t3.none;
        if (n !== 'aylan') return C.t3.name;
        if (!p15Dur(D, '.sayyora')) return C.t3.time0;
        if (!p15Eq(p15Dur(D, '.sayyora'), 4)) return C.t3.time;
        if (p15Count(D, '.sayyora') !== 'infinite') return C.t3.inf;
        return /linear/.test(D.cs('.sayyora', 'animation-timing-function')) ? null : C.t3.linear;
      },
      sample: ['.kub {', '  animation: aylan 2s linear infinite;', '}'],
      drill: { code0: '', answer: '.sayyora {\n  animation: aylan 1s 2;\n}',
        goal: (D) => (p15Name(D, '.sayyora') === 'aylan' && p15Eq(p15Dur(D, '.sayyora'), 1) && p15Count(D, '.sayyora') === '2' ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: имя плана с опечаткой (aylna) и нет времени. Дополнительная — кадр
    // «50» без % (браузер его выбрасывает), на странице звёзд.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.antenna { animation: aylna 3s linear infinite; }\n.yoldosh { animation: aylan linear infinite; }',
      answer: '.antenna { animation: aylan 3s linear infinite; }\n.yoldosh { animation: aylan 3s linear infinite; }',
      page: p15Signals, given: ['@keyframes aylan {', '  from { transform: rotate(0deg); }', '  to { transform: rotate(360deg); }', '}'],
      goal: (D) => {
        if (p15Name(D, '.antenna') !== 'aylan') return C.t4.name;
        if (!p15Dur(D, '.antenna')) return C.t4.time;
        if (p15Name(D, '.yoldosh') !== 'aylan') return C.t4.name;
        if (!p15Dur(D, '.yoldosh')) return C.t4.time;
        return null;
      },
      sample: ['.raketa { animation: parvoz 2s infinite; }', '.kub { animation: sakra 1s linear infinite; }'],
      drill: { page: p15Stars, given: ['.yulduz { animation: miltilla 1s infinite; }'], syms: ['{', '}', ':', ';', '%'],
        code0: '@keyframes miltilla {\n  0% { transform: scale(1); }\n  50 { transform: scale(1.5); }\n  100% { transform: scale(1); }\n}',
        answer: '@keyframes miltilla {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.5); }\n  100% { transform: scale(1); }\n}',
        goal: (D) => { const f = p15Frame(D, 'miltilla', '50%'); return f && f.style.length ? null : C.t4.drillNo; } }
    }),
    // Т5 · своя анимация: начало плана готово; кадр to, animation с именем плана, временем и повторами.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '@keyframes sayohat {\n  from { transform: translateX(0); }\n  to {  }\n}\n.qahramon {  }',
      answer: '@keyframes sayohat {\n  from { transform: translateX(0); }\n  to { transform: translateX(120px); }\n}\n.qahramon { animation: sayohat 2s alternate infinite; }',
      page: p15Own,
      list: [
        { t: L3("to kadri", 'кадр to', 'to frame'), ok: (D) => p15HasEnd(D) },
        { t: L3(".qahramon: animation", '.qahramon: animation', '.qahramon: animation'), ok: (D) => !!p15OwnPlan(D) && p15Dur(D, '.qahramon') > 0 },
        { t: L3("takrorlar", 'повторы', 'repeats'), ok: (D) => !!p15OwnPlan(D) && p15Repeats(D, '.qahramon') }
      ],
      goal: (D) => {
        if (!p15Plans(D).length) return C.t5.needKf;
        if (!p15HasEnd(D)) return C.t5.needTo;
        const n = p15Name(D, '.qahramon');
        if (!n || n === 'none') return C.t5.needAnim;
        const k = p15OwnPlan(D);
        if (!k) return C.t5.name;
        if (!p15Dur(D, '.qahramon')) return C.t5.time;
        if (!p15Repeats(D, '.qahramon')) return C.t5.count;
        const fr = p15Frames(k);
        if (fr.length > 1 && fr.every((f) => f.style.cssText === fr[0].style.cssText)) return C.t5.same;
        return null;
      },
      sample: ['@keyframes sakra {', '  from { transform: translateY(0); }', '  to { transform: translateY(-40px); }', '}', '.kub { animation: sakra 1s alternate infinite; }'],
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
    eyebrow: L3("Kodining koinoti", 'Космос Коди', 'Kodi’s space'),
    say: L3("Salom! Bu mening kosmik saytim. Qarang: raketa o'zi tepaga-pastga uchib turibdi, hech qanday sichqonchasiz. Bu animatsiya. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это мой космический сайт. Смотри: ракета сама летает вверх-вниз, безо всякой мышки. Это анимация. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my space website. Look: the rocket flies up and down by itself, without any mouse. That’s animation. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Raketa qotib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Ракета замерла, а вкладки погасли.', 'Oh no! The CSS code got erased. The rocket froze, and the tabs went dark.'),
    done: L3("Rasmlar va matnlar joyida turibdi, faqat harakat yo'qoldi. O'tgan darsda animatsiyani o'rgandik: keyframes harakat rejasini yozadi, animation esa uni ishga tushiradi. Endi beshta sahifani birma-bir jonlantiramiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'Картинки и тексты на месте, пропало только движение. На прошлом уроке мы разобрали анимацию: keyframes записывает план движения, а animation его запускает. Теперь оживим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The pictures and texts are fine, only the movement is gone. Last lesson we learned animation: keyframes writes the movement plan, and animation starts it. Now let’s bring the five pages to life one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani jonlantiramiz: kodni siz yozasiz", 'Оживим пять страниц: код пишешь ты', 'Let’s bring five pages to life: you write the code')
  },
  t1: {
    eyebrow: L3("Raketa", 'Ракета', 'Rocket'),
    say: L3("Birinchi sahifa: raketa. Parvoz rejasi tayyor, animation ham bor, lekin raketa bir marta uchadi-yu, to'xtab qoladi. Raketa to'xtamasdan uchsin: qoidadagi takrorlar sonini almashtiring.",
      'Первая страница: ракета. План полёта готов, animation тоже есть, но ракета взлетает один раз и останавливается. Пусть она летает без остановки: замени в правиле число повторов.',
      'The first page is the rocket. The flight plan is ready and there’s animation too, but the rocket flies once and stops. Make it fly without stopping: change the number of repeats in the rule.'),
    ask: L3("Raketa to'xtamasdan uchsin", 'Пусть ракета летает без остановки', 'Make the rocket fly without stopping'),
    ok: L3("Zo'r! Raketa endi to'xtamasdan uchyapti. Birinchi sahifa jonlandi!", 'Огонь! Теперь ракета летает без остановки. Первая страница ожила!', 'Awesome! The rocket flies nonstop now. The first page is alive!'),
    hints: [
      L3("Qoidaga qarang: vaqtdan keyin bir soni turibdi. U nimani aytadi?", 'Посмотри на правило: после времени стоит единица. Что она говорит?', 'Look at the rule: there’s a one after the time. What does it say?'),
      L3("Bu son necha marta takrorlanishini aytadi. To'xtamasdan uchish uchun infinite kerak, ya'ni cheksiz degani.", 'Это число говорит, сколько раз повторить. Чтобы без остановки, нужен infinite, то есть «бесконечно».', 'That number says how many times to repeat. For nonstop you need infinite, meaning endlessly.'),
      L3("Namuna kod ostida: kubik cheksiz sakraydi. Xuddi shunday, bir o'rniga infinite yozing va Tekshirishni bosing.", 'Образец под кодом: кубик прыгает без конца. Так же замени единицу на infinite и нажми «Проверить».', 'The example under the code: a cube jumps endlessly. The same way, replace the one with infinite and tap Check.')
    ],
    name: L3("Raketa qotib qoldi: animation qoidasidagi nom rejaning nomi bilan bir xil bo'lishi kerak. Reja parvoz deb nomlangan.", 'Ракета замерла: имя в animation должно совпадать с именем плана. План называется parvoz.', 'The rocket froze: the name in animation must match the plan’s name. The plan is called parvoz.'),
    time: L3("Vaqt yo'qolib qoldi: usiz animatsiya nol soniya davom etadi. Ikki soniyani qaytaring.", 'Пропало время: без него анимация длится ноль секунд. Верни две секунды.', 'The time is gone: without it the animation lasts zero seconds. Put the two seconds back.'),
    no: L3("Raketa hali to'xtab qolyapti. Cheksiz uchishi uchun takrorlar soni o'rniga infinite yozing.", 'Ракета всё ещё останавливается. Чтобы она летала без конца, вместо числа повторов напиши infinite.', 'The rocket still stops. To make it fly endlessly, write infinite instead of the number of repeats.'),
    drill: L3("endi raketa roppa-rosa uch marta uchsin", 'теперь пусть ракета взлетит ровно три раза', 'now make the rocket fly exactly three times'),
    drillNo: L3("Raketa hali uch marta uchmayapti. Takrorlar soni o'rniga uch raqamini yozing.", 'Ракета пока взлетает не три раза. Вместо числа повторов напиши тройку.', 'The rocket doesn’t fly three times yet. Write a three as the number of repeats.')
  },
  t2: {
    eyebrow: L3("Yulduzlar", 'Звёзды', 'Stars'),
    say: L3("Raketa uchyapti! Endi yulduzlar sahifasi. Yulduzlarda animation bor, lekin ular qimirlamaydi. Rejaga qarang: boshida ham, oxirida ham yulduz bir xil, o'rtadagi kadr esa bo'm-bo'sh. Yulduz o'rtada kattalashsin: o'rtadagi kadrga yozing.",
      'Ракета летает! Теперь страница звёзд. У звёзд есть animation, но они не двигаются. Посмотри на план: в начале и в конце звезда одинаковая, а кадр посередине пустой. Пусть в середине звезда вырастет: впиши это в средний кадр.',
      'The rocket flies! Now the stars page. The stars have animation, but they don’t move. Look at the plan: the star is the same at the start and the end, and the middle frame is empty. Make the star grow in the middle: write it in the middle frame.'),
    ask: L3("Yulduz o'rtada kattalashsin", 'Пусть звезда в середине вырастет', 'Make the star grow in the middle'),
    ok: L3("Ajoyib! Yulduzlar miltillab turibdi: kattalashadi va yana kichrayadi.", 'Отлично! Звёзды мерцают: растут и снова уменьшаются.', 'Great! The stars twinkle: they grow and shrink again.'),
    hints: [
      L3("Ellik foizli kadr bu animatsiyaning o'rtasi. U yerda yulduz qanday bo'lsin?", 'Кадр пятьдесят процентов — это середина анимации. Какой там должна быть звезда?', 'The fifty percent frame is the middle of the animation. What should the star be like there?'),
      L3("O'lchamni transform va scale o'zgartiradi. Birdan katta son kattalashtiradi, masalan bir butun o'ndan besh.", 'Размер меняет transform со scale. Число больше единицы увеличивает, например одна целая пять десятых.', 'transform with scale changes the size. A number above one makes it bigger, for example one point five.'),
      L3("Namuna kod ostida: o'rtadagi kadrda kubik buriladi. Xuddi shunday yozing, faqat scale bilan.", 'Образец под кодом: в среднем кадре кубик поворачивается. Напиши так же, только со scale.', 'The example under the code: the cube turns in the middle frame. Write the same, only with scale.')
    ],
    name: L3("Reja topilmadi: keyframes so'zidan keyin miltilla nomi turishi kerak.", 'План не найден: после keyframes должно стоять имя miltilla.', 'The plan wasn’t found: the name miltilla must come after keyframes.'),
    no50: L3("O'rtadagi kadr yo'qolib qoldi. O'rtasi bu ellik foiz, foiz belgisi ham kerak.", 'Кадр посередине пропал. Середина — это пятьдесят процентов, и знак процента нужен.', 'The middle frame is gone. The middle is fifty percent, and the percent sign is needed.'),
    empty: L3("O'rtadagi kadr hali bo'sh, yulduz o'zgarmaydi. Uning qavslari ichiga transform yozing.", 'Средний кадр пока пустой, звезда не меняется. Впиши в его скобки transform.', 'The middle frame is still empty, so the star doesn’t change. Write transform inside its braces.'),
    small: L3("Yulduz o'rtada kattalashmayapti. scale ichiga birdan katta son yozing.", 'Звезда в середине не растёт. Внутри scale напиши число больше единицы.', 'The star doesn’t grow in the middle. Write a number bigger than one inside scale.'),
    drill: L3("endi yulduz o'rtada tepaga sakrasin", 'теперь пусть звезда в середине подпрыгнет вверх', 'now make the star jump up in the middle'),
    drillNo: L3("Yulduz hali tepaga sakramayapti. Tepaga translateY olib chiqadi, son esa minus bilan, masalan minus yigirma piksel.", 'Звезда пока не подпрыгивает. Вверх поднимает translateY с минусом, например минус двадцать пикселей.', 'The star doesn’t jump yet. translateY with a minus lifts it up, for example minus twenty pixels.')
  },
  t3: {
    eyebrow: L3("Sayyoralar", 'Планеты', 'Planets'),
    say: L3("Ikkita sahifa jonlandi! Uchinchisi: sayyoralar. Aylanish rejasi tayyor, lekin uni hech kim ishga tushirmagan. Sayyora tekis va to'xtamasdan aylansin, bir aylanish to'rt soniyada: qoidani boshidan oxirigacha o'zingiz yozing. Sayyoraning klassi HTML kodda ko'rinib turibdi.",
      'Две страницы ожили! Третья: планеты. План вращения готов, но его никто не запустил. Пусть планета крутится ровно и без остановки, один оборот за четыре секунды: напиши правило целиком. Класс планеты виден в HTML-коде.',
      'Two pages are alive! The third is planets. The spinning plan is ready, but nothing starts it. Make the planet spin evenly and nonstop, one turn every four seconds: write the whole rule yourself. The planet’s class is shown in the HTML code.'),
    ask: L3("Sayyora tekis va to'xtamasdan aylansin: 4s", 'Пусть планета крутится ровно и без конца: 4s', 'Make the planet spin evenly and endlessly: 4s'),
    ok: L3("Voy, aylanyapti! Xuddi haqiqiy sayyoradek, tekis va to'xtamasdan.", 'Ого, крутится! Как настоящая планета: ровно и без остановки.', 'Wow, it spins! Just like a real planet: evenly and nonstop.'),
    hints: [
      L3("animation qiymatida to'rtta narsa bor: rejaning nomi, vaqt, tezlik va necha marta.", 'В значении animation четыре вещи: имя плана, время, скорость и сколько раз.', 'The animation value has four things: the plan’s name, the time, the speed and how many times.'),
      L3("Selektor nuqta va sayyora so'zi. Qiymat esa aylan, to'rt soniya, linear va infinite.", 'Селектор: точка и слово sayyora. Значение: aylan, четыре секунды, linear и infinite.', 'The selector is a dot and the word sayyora. The value is aylan, four seconds, linear and infinite.'),
      L3("Namuna kod ostida: kubik ikki soniyada tekis aylanadi. Xuddi shunday, sayyora uchun to'rt soniya bilan yozing.", 'Образец под кодом: кубик ровно крутится за две секунды. Напиши так же для планеты, с четырьмя секундами.', 'The example under the code: a cube spins evenly in two seconds. Write the same for the planet, with four seconds.')
    ],
    none: L3("Sayyora hali turibdi: unda animation yo'q.", 'Планета пока стоит: у неё нет animation.', 'The planet is still: it has no animation.'),
    name: L3("Bunday reja yo'q. Tepadagi rejaning nomi aylan, uni harfma-harf yozing.", 'Такого плана нет. План сверху называется aylan, напиши его буква в букву.', 'There’s no such plan. The plan above is called aylan; write it letter for letter.'),
    time0: L3("Vaqt yozilmagan: usiz animatsiya nol soniya davom etadi.", 'Не написано время: без него анимация длится ноль секунд.', 'No time is written: without it the animation lasts zero seconds.'),
    time: L3("Aylanyapti, lekin vaqt boshqa. Bir aylanish to'rt soniya bo'lsin.", 'Крутится, но время другое. Пусть один оборот длится четыре секунды.', 'It spins, but the time is different. One turn should take four seconds.'),
    inf: L3("Sayyora aylanadi-yu, to'xtab qoladi. To'xtamasligi uchun infinite yozing.", 'Планета крутится и останавливается. Чтобы не останавливалась, допиши infinite.', 'The planet spins and then stops. To keep it going, add infinite.'),
    linear: L3("Aylanyapti, lekin har aylanishda sekinlashib qoladi. Tekis aylanishi uchun linear qo'shing.", 'Крутится, но на каждом обороте притормаживает. Для ровного вращения допиши linear.', 'It spins, but slows down on every turn. Add linear for even spinning.'),
    drill: L3("endi sayyora ikki marta aylansin, har biri bir soniyada, keyin to'xtasin", 'теперь пусть планета сделает два оборота по одной секунде и остановится', 'now make the planet do two one-second turns and stop'),
    drillNo: L3("Sayyora hali ikki marta, bir soniyadan aylanmayapti. Vaqt bir soniya, takrorlar soni esa ikki bo'lsin.", 'Планета пока не делает два оборота по секунде. Время — одна секунда, число повторов — два.', 'The planet doesn’t do two one-second turns yet. The time is one second, the number of repeats two.')
  },
  t4: {
    eyebrow: L3("Signallar", 'Сигналы', 'Signals'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: koinotdan kelgan signallar. Antenna ham, yo'ldosh ham aylanishi kerak edi, lekin men kodni shoshib yozdim va ikkita joy buzildi. Shuning uchun ikkalasi ham qimirlamaydi. Ikkala buzilgan joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: сигналы из космоса. И антенна, и спутник должны крутиться, но я писал код в спешке, и в нём две поломки. Поэтому оба стоят. Найди и почини обе поломки.',
      'Three pages are done! The fourth is signals from space. Both the antenna and the satellite should spin, but I wrote the code in a hurry, and it has two broken spots. That’s why both stand still. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Antenna ham, yo'ldosh ham aylanyapti. Signal keldi!", 'Вот это да! И антенна, и спутник крутятся. Сигнал пошёл!', 'That’s it! Both the antenna and the satellite spin. The signal is coming in!'),
    hints: [
      L3("Har bir qoidani rejaga solishtiring: nom bir xilmi, vaqt yozilganmi?", 'Сравни каждое правило с планом: имя совпадает, время написано?', 'Compare each rule with the plan: does the name match, is the time written?'),
      L3("Birinchi qoidada nomdagi harflar almashib qolgan: reja aylan deb nomlangan. Ikkinchisida vaqt yo'q.", 'В первом правиле в имени переставлены буквы: план называется aylan. Во втором нет времени.', 'In the first rule, letters in the name are swapped: the plan is called aylan. The second has no time.'),
      L3("Namuna kod ostida: nomi va vaqti joyida turgan ikkita qoida. Xuddi shunday tuzating va Tekshirishni bosing.", 'Образец под кодом — два правила, где имя и время на месте. Почини так же и нажми «Проверить».', 'The example under the code has two rules with the name and time in place. Fix yours the same way and tap Check.')
    ],
    name: L3("Antenna hali turibdi: brauzer bunday nomli rejani topmadi. Nomni rejadagidek, harfma-harf yozing.", 'Антенна всё ещё стоит: браузер не нашёл план с таким именем. Напиши имя как в плане, буква в букву.', 'The antenna still stands: the browser found no plan with that name. Write the name exactly as in the plan.'),
    time: L3("Yo'ldosh hali turibdi: vaqt yozilmagan, animatsiya nol soniya davom etadi. Vaqt qo'shing.", 'Спутник всё ещё стоит: не написано время, анимация длится ноль секунд. Добавь время.', 'The satellite still stands: no time is written, so the animation lasts zero seconds. Add a time.'),
    drill: L3("endi yulduz rejasini tuzating", 'теперь почини план звезды', 'now fix the star’s plan'),
    drillNo: L3("Brauzer o'rtadagi kadrni hali tashlab yuboryapti. Ellik sonidan keyin foiz belgisi kerak.", 'Браузер всё ещё выбрасывает средний кадр. После числа пятьдесят нужен знак процента.', 'The browser still throws the middle frame away. The number fifty needs a percent sign.')
  },
  t5: {
    eyebrow: L3("Mening koinotim", 'Мой космос', 'My space'),
    say: L3("To'rtta sahifa jonlandi! Oxirgisi sizniki. Uchar likopchangiz uchun o'z animatsiyangizni yarating. Rejaning boshi tayyor: to kadriga likopcha qayerga uchishini yozing, keyin rejani animation bilan ishga tushiring. Vaqtni va necha marta takrorlanishini o'zingiz tanlang. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы ожили! Последняя — твоя. Сделай свою анимацию для летающей тарелки. Начало плана готово: в кадр to напиши, куда летит тарелка, а потом запусти план через animation. Время и число повторов выбери сам. Под окном видно, что уже готово.',
      'Four pages are alive! The last one is yours. Make your own animation for the flying saucer. The start of the plan is ready: in the to frame, write where the saucer flies, then start the plan with animation. Choose the time and the number of repeats yourself. Under the window you can see what’s done.'),
    ask: L3("Likopchani uchiring: to kadri va animation", 'Запусти тарелку: кадр to и animation', 'Launch the saucer: the to frame and animation'),
    ok: L3("Ura! Uchar likopchangiz o'zi uchyapti. Bu sizning animatsiyangiz!", 'Ура! Твоя тарелка летает сама. Это твоя анимация!', 'Hooray! Your saucer flies by itself. That’s your animation!'),
    hints: [
      L3("Ikkita bo'sh joy bor: to kadri va likopchaning qoidasi. Oldin kadrni to'ldiring.", 'Есть два пустых места: кадр to и правило тарелки. Сначала заполни кадр.', 'There are two empty spots: the to frame and the saucer’s rule. Fill in the frame first.'),
      L3("to kadriga masalan transform va translateX yozing. Likopcha qoidasiga esa animation yozing: sayohat, vaqt va takrorlar.", 'В кадр to напиши, например, transform с translateX. А в правило тарелки — animation: sayohat, время и повторы.', 'In the to frame write, for example, transform with translateX. And in the saucer’s rule write animation: sayohat, a time and repeats.'),
      L3("Namuna kod ostida: kubikning sakrash animatsiyasi. O'zingizga yoqqanini yozing.", 'Образец под кодом — анимация прыжка кубика. Напиши то, что нравится тебе.', 'The example under the code is a cube’s jump animation. Write what you like.')
    ],
    needKf: L3("Reja yo'q: keyframes bilan harakat rejasini yozing.", 'Плана нет: напиши план движения с keyframes.', 'There’s no plan: write a movement plan with keyframes.'),
    needTo: L3("to kadri bo'sh: likopcha oxirida qayerda bo'lishini yozing, masalan translateX bilan.", 'Кадр to пустой: напиши, где тарелка будет в конце, например через translateX.', 'The to frame is empty: write where the saucer ends up, for example with translateX.'),
    needAnim: L3("Reja bor, lekin uni hech kim ishga tushirmagan. Likopcha qoidasiga animation yozing.", 'План есть, но его никто не запустил. Напиши animation в правило тарелки.', 'There’s a plan, but nothing starts it. Write animation in the saucer’s rule.'),
    name: L3("Likopcha turibdi: animation qoidasidagi nom rejaning nomi bilan harfma-harf bir xil bo'lishi kerak.", 'Тарелка стоит: имя в animation должно совпадать с именем плана буква в букву.', 'The saucer stands still: the name in animation must match the plan’s name letter for letter.'),
    time: L3("Vaqt yo'q: usiz animatsiya nol soniya davom etadi.", 'Нет времени: без него анимация длится ноль секунд.', 'There’s no time: without it the animation lasts zero seconds.'),
    count: L3("Likopcha bir marta uchadi-yu, to'xtaydi. Takrorlar sonini yoki infinite yozing.", 'Тарелка пролетит один раз и остановится. Допиши число повторов или infinite.', 'The saucer flies once and stops. Add a number of repeats or infinite.'),
    same: L3("Boshi va oxiri bir xil, likopcha joyidan qimirlamaydi. to kadriga boshqa qiymat yozing.", 'Начало и конец одинаковые, тарелка не двигается с места. Напиши в кадр to другое значение.', 'The start and end are the same, so the saucer doesn’t move. Write a different value in the to frame.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Koinotning beshta sahifasi ham yana harakatda! Raketa, yulduzlar va sayyoralar o'zi qimirlaydi, chunki animatsiya kodini siz yozdingiz.", 'Все пять страниц космоса снова в движении! Ракета, звёзды и планеты двигаются сами, потому что код анимации написан тобой.', 'All five space pages are moving again! The rocket, stars and planets move by themselves, because you wrote the animation code.') },
      { k: 'a', text: L3("keyframes bilan harakat rejasini yozasiz: boshi, o'rtasi va oxiri.", 'С keyframes ты пишешь план движения: начало, середину и конец.', 'With keyframes you write the movement plan: the start, the middle and the end.') },
      { k: 'b', text: L3("animation shu rejani nom va vaqt bilan ishga tushiradi.", 'animation запускает этот план по имени и со временем.', 'animation starts that plan by name, with a time.') },
      { k: 'c', text: L3("infinite yoki son necha marta takrorlanishini aytadi, linear esa tezlikni tekis qiladi.", 'infinite или число говорят, сколько раз повторить, а linear делает скорость ровной.', 'infinite or a number says how many times to repeat, and linear makes the speed even.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: nomdagi almashgan harflarni, yozilmagan vaqtni va foiz belgisisiz kadrni.", 'И находишь поломки: переставленные буквы в имени, забытое время и кадр без знака процента.', 'And you find broken spots: swapped letters in a name, a missing time and a frame without a percent sign.') },
      { k: null, text: L3("Keyingi darsda saytni telefonga moslashni o'rganamiz: u katta ekranda ham, kichik ekranda ham chiroyli bo'ladi. Ko'rishguncha!", 'На следующем уроке научимся подстраивать сайт под телефон: он будет красивым и на большом экране, и на маленьком. До встречи!', 'Next lesson we’ll learn to fit a site to a phone: it will look good on big and small screens alike. See you!') }
    ],
    roles: {
      a: L3("@keyframes — harakat rejasi", '@keyframes — план движения', '@keyframes — the movement plan'),
      b: L3("animation: nom va vaqt", 'animation: имя и время', 'animation: name and time'),
      c: L3("infinite yoki son · linear", 'infinite или число · linear', 'infinite or a number · linear'),
      d: L3("tuzatish: nom, vaqt, «%»", 'починка: имя, время, «%»', 'fixing: name, time, “%”')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
