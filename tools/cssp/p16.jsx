// =============================================================================
// ===== ПРАКТИКА 16 · «Футбольный клуб Коди» · к уроку 16 «Адаптивность» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). Сайт клуба Коди сделан для компьютера (баннер 700px, карточки в ряд); CSS для телефона
// стёрся — на телефоне баннер вылез, карточки сжались. Все задания — в окне телефона 360px (vw: 360, @media работает
// по ширине рамки). Ученик чинит: баннер во всю ширину (700px → 100%) → в готовое @media вписать flex-direction:
// column (карточки столбиком, урок 10) → правило @media целиком: реклама прячется только на телефоне (display: none) →
// две поломки урока (условие без скобок, min-width вместо max-width; дополнительная — 600 без px) → свой сайт: в @media
// карточки столбиком и свой цвет баннера (разгадка урока: обычное правило ниже @media его перебивает).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-16p-adaptivnost.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-16p-adaptivnost',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "16-amaliyot. Kodining futbol klubi", ru: 'Практика 16. Футбольный клуб Коди', en: 'Practice 16. Kodi’s football club' }
};

// Страницы клуба (тексты на языке урока).
const P16 = {
  season: L3("Yangi mavsum boshlandi! Birinchi o'yinga chipta oling!", 'Новый сезон начался! Купи билет на первый матч!', 'The new season has started! Get a ticket for the first match!'),
  home: L3("Bosh sahifa", 'Главная', 'Home'),
  train: L3("Mashg'ulotlar har kuni soat 16:00 da", 'Тренировки каждый день в 16:00', 'Practice every day at 16:00'),
  plan: L3("Jadval: dushanba, chorshanba, juma", 'Расписание: понедельник, среда, пятница', 'Schedule: Monday, Wednesday, Friday'),
  team: L3("Jamoa", 'Команда', 'Team'),
  gk: L3("Darvozabon", 'Вратарь', 'Goalkeeper'),
  def: L3("Himoyachi", 'Защитник', 'Defender'),
  fw: L3("Hujumchi", 'Нападающий', 'Forward'),
  matches: L3("O'yinlar", 'Матчи', 'Matches'),
  sat: L3("Shanba: Kodi va Robotlar", 'Суббота: Коди против Роботов', 'Saturday: Kodi vs Robots'),
  ad: L3("Reklama: yangi to'plar chegirmada!", 'Реклама: новые мячи со скидкой!', 'Ad: new balls on sale!'),
  kassa: L3("Chiptalar kassada, soat 9:00 dan", 'Билеты в кассе с 9:00', 'Tickets at the box office from 9:00'),
  shop: L3("Do'kon", 'Магазин', 'Shop'),
  sale: L3("Chegirmalar yakshanbagacha!", 'Скидки до воскресенья!', 'Sale until Sunday!'),
  ball: L3("To'p", 'Мяч', 'Ball'),
  shirt: L3("Forma", 'Форма', 'Kit'),
  scarf: L3("Sharf", 'Шарф', 'Scarf'),
  mine: L3("Mening klubim", 'Мой клуб', 'My club'),
  best: L3("Bizning jamoa eng zo'ri!", 'Наша команда лучшая!', 'Our team is the best!'),
  cup: L3("Kubok", 'Кубок', 'Cup'),
  medal: L3("Medal", 'Медаль', 'Medal'),
  record: L3("Rekord", 'Рекорд', 'Record')
};
// Свои стили сайта (ученику не видны) — «компьютерная» вёрстка: баннер 700px, расписание 500px, карточки в ряд.
// Страницы короткие: в окне телефона видна только верхняя часть; сверху отступ под ярлык ширины окна (360px).
const P16_BASE = 'html{background:#F3F8F1}body{background:#F3F8F1;color:#1F2937;font-family:Arial,Helvetica,sans-serif;margin:24px 10px 8px}p{margin:6px 0}' +
  '.banner{width:700px;box-sizing:border-box;padding:9px 12px;background:#16A34A;color:#fff;border-radius:10px;font-weight:700;font-size:15px}' +
  '.jadval{width:500px;box-sizing:border-box;margin-top:8px;padding:8px 10px;background:#14532D;color:#fff;border-radius:8px;font-size:14px}' +
  '.qator{display:flex;gap:6px;margin-top:8px}' +
  '.karta{flex:1;background:#fff;border:2px solid #86EFAC;border-radius:10px;padding:5px 4px;text-align:center;font-weight:700;font-size:14px}' +
  '.reklama{background:#FDE68A;color:#78350F;padding:8px 10px;border-radius:8px;margin:6px 0;font-weight:700;font-size:14px}' +
  '.kassa{color:#6B7280;font-size:14px}';
const p16Cards = (pk, a, b, c) => '<div class="qator"><div class="karta">' + pk(a) + '</div><div class="karta">' + pk(b) + '</div><div class="karta">' + pk(c) + '</div></div>';
const p16Hook = (pk) => '<div class="banner">' + pk(P16.season) + '</div>' + p16Cards(pk, P16.gk, P16.def, P16.fw);
const p16Home = (pk) => '<div class="banner">' + pk(P16.season) + '</div><p>' + pk(P16.train) + '</p>';
const p16Plan = (pk) => '<p>' + pk(P16.train) + '</p><div class="jadval">' + pk(P16.plan) + '</div>';
const p16Team = (pk) => p16Cards(pk, P16.gk, P16.def, P16.fw);
const p16Matches = (pk) => '<p>' + pk(P16.sat) + '</p><div class="reklama">' + pk(P16.ad) + '</div><p class="kassa">' + pk(P16.kassa) + '</p>';
const p16Shop = (pk) => '<div class="banner">' + pk(P16.sale) + '</div>' + p16Cards(pk, P16.ball, P16.shirt, P16.scarf);
const p16Own = (pk) => '<div class="banner">' + pk(P16.best) + '</div>' + p16Cards(pk, P16.cup, P16.medal, P16.record);
const P16_SYMS = ['{', '}', '(', ')', ':', ';'];

// Проверка по живой странице в окне телефона: вылезает ли элемент, стоят ли карточки столбиком, правила @media.
const p16Last = (D, re, prop) => { const all = D.rules.filter((r) => r.sel && re.test(r.sel) && r.style.getPropertyValue(prop)); return all.length ? all[all.length - 1] : null; };
const p16Out = (D, sel) => { const e = D.q(sel); if (!e) return false; return e.getBoundingClientRect().right > D.win.innerWidth + 0.5 || D.doc.documentElement.scrollWidth > D.win.innerWidth + 1; };
const p16Stacked = (D) => {
  const ks = D.qa('.karta').map((e) => e.getBoundingClientRect());
  return ks.length > 1 && ks.every((r, i) => i === 0 || r.top >= ks[i - 1].bottom - 1);
};
// Условие подходит телефону, но не компьютеру (800px): max-width меньше 800.
const p16Narrow = (media) => { const m = /max-width\s*:\s*(\d+(?:\.\d+)?)px/i.exec(String(media || '')); return !!m && parseFloat(m[1]) < 800; };
const p16Live = (D, media) => { try { return !!media && D.win.matchMedia(media).matches; } catch (e) { return false; } };
// Почему @media не сработало: нет скобок, число без px, min-width вместо max-width.
const p16Why = (D) => {
  const code = D.code;
  if (/@media\s+(?!\()[^{]*-width/i.test(code)) return P16_WHY.parens;
  if (/-width\s*:\s*\d+(\.\d+)?\s*\)/i.test(code)) return P16_WHY.px;
  if (/min-width/i.test(code)) return P16_WHY.min;
  return null;
};

const PR = {
  next: L3("Yakuniy loyiha", 'Финальный проект', 'Final project'),
  base: P16_BASE,
  tabs: [
    { ico: 'ball', c: '#16A34A', name: P16.home, file: 'index.html' },
    { ico: 'star', c: '#F59E0B', name: P16.team, file: 'jamoa.html' },
    { ico: 'pin', c: '#FA4F28', name: P16.matches, file: 'oyinlar.html' },
    { ico: 'cart', c: '#7C5CFA', name: P16.shop, file: 'dokon.html' },
    { ico: 'heart', c: '#E44D8A', name: P16.mine, file: 'my.html' }
  ],
  hook: {
    page: p16Hook, vw: 360,
    css: ['  .banner { width: 100%; }', '  @media (max-width: 600px) {', '    .qator { flex-direction: column; }', '  }']
  },
  ownPage: p16Own,
  ownGiven: ['.banner { width: 100%; }'],
  ownVw: 360,
  ownDefault: '@media (max-width: 600px) {\n  .qator { flex-direction: column; }\n  .banner { background-color: purple; }\n}',
  tasks: [
    // Т1 · заменить значение в готовом правиле: баннер 700px вылез — во всю ширину окна (100%).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, vw: 360, code0: '.banner { width: 700px; }', answer: '.banner { width: 100%; }',
      page: p16Home,
      goal: (D) => {
        if (p16Out(D, '.banner')) return C.t1.out;
        const r = p16Last(D, /banner/, 'width');
        const v = r ? r.style.getPropertyValue('width').trim() : '';
        if (v === '100%') return null;
        return /px$/.test(v) ? C.t1.px : C.t1.no;
      },
      sample: ['.menyu { width: 100%; }'],
      drill: { single: true, page: p16Plan, code0: '.jadval { width: 500px; }', answer: '.jadval { width: 100%; }',
        goal: (D) => { const r = p16Last(D, /jadval/, 'width'); return !p16Out(D, '.jadval') && r && r.style.getPropertyValue('width').trim() === '100%' ? null : C.t1.drillNo; } }
    }),
    // Т2 · вписать в готовое правило внутри @media: карточки на телефоне столбиком (flex-direction: column).
    (pk) => cpTask(2, {
      kind: 'write-declaration', vw: 360, code0: '@media (max-width: 600px) {\n  .qator {\n    \n  }\n}',
      answer: '@media (max-width: 600px) {\n  .qator {\n    flex-direction: column;\n  }\n}',
      page: p16Team,
      goal: (D) => {
        if (p16Stacked(D)) return D.rules.some((r) => r.sel && !r.media && /qator|karta/.test(r.sel)) ? C.t2.everywhere : null;
        return p16Why(D) || C.t2.no;
      },
      sample: ['@media (max-width: 600px) {', '  .menyu {', '    flex-direction: column;', '  }', '}'],
      drill: { code0: '@media (max-width: 600px) {\n  .karta {\n    \n  }\n}', answer: '@media (max-width: 600px) {\n  .karta {\n    background-color: orange;\n  }\n}',
        goal: (D) => {
          const r = p16Last(D, /karta/, 'background-color');
          return r && r.media && p16Live(D, r.media) && D.same(D.cs('.karta', 'background-color'), 'orange') ? null : C.t2.drillNo;
        } }
    }),
    // Т3 · правило @media целиком: реклама прячется только на телефоне (display: none); класс — из HTML.
    (pk) => cpTask(3, {
      kind: 'write-rule', vw: 360, code0: '', syms: P16_SYMS,
      answer: '@media (max-width: 600px) {\n  .reklama {\n    display: none;\n  }\n}',
      page: p16Matches,
      htmlAid: () => ['<div class="reklama">…</div>', '<p class="kassa">…</p>'],
      goal: (D) => {
        if (D.cs('.reklama', 'display') !== 'none') return p16Why(D) || C.t3.no;
        const hide = D.rules.filter((r) => r.sel && /reklama/.test(r.sel) && r.style.getPropertyValue('display') === 'none');
        if (hide.some((r) => !r.media)) return C.t3.everywhere;
        return hide.some((r) => p16Narrow(r.media)) ? null : C.t3.wide;
      },
      sample: ['@media (max-width: 600px) {', '  .menyu {', '    display: none;', '  }', '}'],
      drill: { code0: '', syms: P16_SYMS, answer: '@media (max-width: 600px) {\n  .kassa {\n    display: none;\n  }\n}',
        goal: (D) => {
          if (D.cs('.kassa', 'display') !== 'none') return p16Why(D) || C.t3.drillNo;
          const hide = D.rules.filter((r) => r.sel && /kassa/.test(r.sel) && r.style.getPropertyValue('display') === 'none');
          return hide.length && hide.every((r) => p16Narrow(r.media)) ? null : C.t3.drillNo;
        } }
    }),
    // Т4 · найти и починить две поломки урока: условие без скобок и min-width вместо max-width. Дополнительная —
    // 600 без px (на странице команды).
    (pk) => cpTask(4, {
      kind: 'fix', vw: 360,
      code0: '@media max-width: 600px {\n  .qator { flex-direction: column; }\n}\n@media (min-width: 600px) {\n  .banner { display: none; }\n}',
      answer: '@media (max-width: 600px) {\n  .qator { flex-direction: column; }\n}\n@media (max-width: 600px) {\n  .banner { display: none; }\n}',
      page: p16Shop,
      goal: (D) => {
        if (!p16Stacked(D)) return /@media\s+(?!\()[^{]*-width/i.test(D.code) ? P16_WHY.parens : (p16Why(D) || C.t4.cards);
        if (D.cs('.banner', 'display') !== 'none') return /min-width/i.test(D.code) ? P16_WHY.min : (p16Why(D) || C.t4.banner);
        if (D.rules.some((r) => r.sel && !r.media && /qator|karta|banner/.test(r.sel))) return C.t4.everywhere;
        return null;
      },
      sample: ['@media (max-width: 600px) {', '  .menyu { flex-direction: column; }', '}', '@media (max-width: 600px) {', '  .reklama { display: none; }', '}'],
      drill: { page: p16Team, code0: '@media (max-width: 600) {\n  .qator { flex-direction: column; }\n}', answer: '@media (max-width: 600px) {\n  .qator { flex-direction: column; }\n}',
        goal: (D) => (p16Stacked(D) ? null : C.t4.drillNo) }
    }),
    // Т5 · свой сайт: внутри @media — карточки столбиком и свой цвет баннера; граница — своя.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, vw: 360, code0: '@media (max-width: 600px) {\n  \n}',
      answer: '@media (max-width: 600px) {\n  .qator { flex-direction: column; }\n  .banner { background-color: purple; }\n}',
      page: p16Own, given: ['.banner { width: 100%; }'],
      list: [
        { t: L3("@media (max-width: …px)", '@media (max-width: …px)', '@media (max-width: …px)'), ok: (D) => D.rules.some((r) => r.media && /max-width/i.test(r.media) && p16Live(D, r.media)) },
        { t: L3(".qator — telefonda ustma-ust", '.qator — столбиком на телефоне', '.qator — stacked on a phone'), ok: (D) => p16Stacked(D) },
        { t: L3(".banner — telefonda o'z rangi", '.banner — свой цвет на телефоне', '.banner — its own color on a phone'),
          ok: (D) => D.rules.some((r) => r.media && p16Live(D, r.media) && /banner/.test(r.sel) && (r.style.getPropertyValue('background-color') || r.style.getPropertyValue('background-image'))) }
      ],
      goal: (D) => {
        const mq = D.rules.filter((r) => r.media);
        if (!mq.length) return /@media/i.test(D.code) ? (p16Why(D) || C.t5.empty) : C.t5.needMedia;
        if (!mq.some((r) => p16Live(D, r.media))) return p16Why(D) || C.t5.wide;
        if (!p16Stacked(D)) {
          const col = mq.some((r) => /qator/.test(r.sel) && /column/.test(r.style.getPropertyValue('flex-direction')) && p16Live(D, r.media));
          return col ? C.t5.order : C.t5.needCards;
        }
        const bg = mq.some((r) => p16Live(D, r.media) && /banner/.test(r.sel) && (r.style.getPropertyValue('background-color') || r.style.getPropertyValue('background-image')));
        return bg ? null : C.t5.needBanner;
      },
      sample: ['@media (max-width: 700px) {', '  .menyu { flex-direction: column; }', '  .sarlavha { background-color: navy; }', '}'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// Почему @media не сработало — общие фразы заданий 2–5 (звучат).
const P16_WHY = {
  parens: L3("Shart qavssiz yozilgan: brauzer uni tushunmadi va butun media qoidasini tashlab yubordi. Shartni dumaloq qavslarga oling.",
    'Условие без скобок: браузер его не понял и выбросил всё правило media. Возьми условие в круглые скобки.',
    'The condition has no brackets: the browser didn’t understand it and threw the whole media rule away. Put the condition in round brackets.'),
  px: L3("Shartdagi sonda px yo'q: brauzer qoidani tashlab yubordi. Sonni px bilan yozing.",
    'В условии число без px: браузер выбросил правило. Напиши число вместе с px.',
    'The number in the condition has no px: the browser threw the rule away. Write the number with px.'),
  min: L3("Bu yerda min-width turibdi: qoida keng oynalarda ishlaydi, telefonda uxlaydi. Telefon uchun max-width kerak.",
    'Здесь стоит min-width: правило работает в широких окнах, а на телефоне спит. Для телефона нужен max-width.',
    'This says min-width: the rule works in wide windows and sleeps on a phone. A phone needs max-width.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы goal, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// Реплики сцеплены в одну историю: каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining klubi", 'Клуб Коди', 'Kodi’s club'),
    say: L3("Salom! Bu mening futbol klubimning sayti, uni telefonda ochdim. Qarang: banner ekranga roppa-rosa sig'di, kartalar esa ustma-ust turibdi. Buni foiz va media qoidasi qilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего футбольного клуба, я открыл его на телефоне. Смотри: баннер ровно по экрану, а карточки стоят друг под другом. Это сделали проценты и правило media. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my football club’s website, opened on a phone. Look: the banner fits the screen exactly, and the cards are stacked. Percent and a media rule did that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Telefon uchun CSS o'chib ketdi. Banner ekrandan chiqib ketdi, kartalar siqilib qoldi, varaqlar esa o'chdi.",
      'Ой! CSS для телефона стёрся. Баннер вылез за экран, карточки сжались, а вкладки погасли.',
      'Oh no! The phone CSS got erased. The banner sticks out of the screen, the cards got squeezed, and the tabs went dark.'),
    done: L3("Kompyuterda sayt joyida, faqat telefonda buzildi. O'tgan darsda foizni va media qoidasini o'rgandik. Endi beshta sahifani telefon uchun birma-bir tuzatamiz, kodni esa o'zingiz yozasiz. Oynaga qarang: u telefondek, eni uch yuz oltmish piksel. Beshinchi sahifa sizniki bo'ladi.",
      'На компьютере сайт в порядке, сломался только телефон. На прошлом уроке мы разобрали проценты и правило media. Теперь починим пять страниц для телефона по одной, а код будешь писать ты. Посмотри на окно: оно как телефон, шириной триста шестьдесят пикселей. Пятая страница будет твоей.',
      'On a computer the site is fine; only the phone broke. Last lesson we learned percent and the media rule. Now let’s fix the five pages for a phone one by one, and you’ll write the code. Look at the window: it’s like a phone, three hundred sixty pixels wide. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Telefon uchun tuzatamiz: kodni siz yozasiz", 'Починим для телефона: код пишешь ты', 'Let’s fix it for phones: you write the code')
  },
  t1: {
    eyebrow: L3("Bosh sahifa", 'Главная', 'Home'),
    say: L3("Birinchi sahifa: bosh sahifa. Banner kompyuter uchun yozilgan, eni yetti yuz piksel. Telefonda u sig'maydi va ekrandan chiqib ketadi. Banner har qanday oynada butun en bo'ylab tursin: qoidadagi qiymatni almashtiring.",
      'Первая страница: главная. Баннер написан для компьютера, ширина семьсот пикселей. На телефоне он не помещается и вылезает за экран. Пусть баннер в любом окне будет во всю ширину: замени в правиле значение.',
      'The first page is home. The banner was written for a computer, seven hundred pixels wide. On a phone it doesn’t fit and sticks out of the screen. Make the banner full width in any window: change the value in the rule.'),
    ask: L3("Banner butun en bo'ylab tursin", 'Сделай баннер во всю ширину окна', 'Make the banner as wide as the window'),
    ok: L3("Zo'r! Banner ekranga roppa-rosa sig'di. Kompyuterda ham u butun en bo'ylab turadi.", 'Огонь! Баннер ровно поместился в экран. И на компьютере он тоже будет во всю ширину.', 'Awesome! The banner fits the screen exactly. On a computer it will be full width too.'),
    hints: [
      L3("Piksel doim bir xil bo'ladi. Qaysi o'lchov oyna kengligiga qarab o'zgaradi?", 'Пиксели всегда одинаковые. А какая единица меняется вместе с шириной окна?', 'Pixels are always the same. Which unit changes with the window’s width?'),
      L3("Bu foiz. Butun en bu yuz foiz: oyna qancha keng bo'lsa, banner ham shuncha bo'ladi.", 'Это проценты. Вся ширина — сто процентов: баннер такой же широкий, как окно.', 'It’s percent. The full width is a hundred percent: the banner is as wide as the window.'),
      L3("Namuna kod ostida: menyu butun en bo'ylab turadi. Xuddi shunday, yetti yuz piksel o'rniga yuz foiz yozing.", 'Образец под кодом: меню во всю ширину. Так же замени семьсот пикселей на сто процентов.', 'The example under the code: the menu is full width. The same way, change seven hundred pixels to a hundred percent.')
    ],
    out: L3("Banner hali ekrandan chiqib turibdi. Oynaga moslashadigan o'lchov kerak: foiz.", 'Баннер всё ещё вылезает за экран. Нужна единица, которая подстраивается под окно: проценты.', 'The banner still sticks out of the screen. You need a unit that fits the window: percent.'),
    px: L3("Banner sig'di, lekin piksel doim bir xil: kompyuterda banner tor bo'lib qoladi. Butun en uchun yuz foiz yozing.", 'Баннер поместился, но пиксели всегда одинаковые: на компьютере он останется узким. Для всей ширины напиши сто процентов.', 'The banner fits, but pixels never change: on a computer it would stay narrow. For the full width, write a hundred percent.'),
    no: L3("Banner sig'di, lekin butun en bo'ylab emas. Butun en bu yuz foiz.", 'Баннер поместился, но не во всю ширину. Вся ширина — сто процентов.', 'The banner fits, but not the full width. The full width is a hundred percent.'),
    drill: L3("endi jadval ham telefonga sig'sin", 'теперь пусть и расписание влезет в телефон', 'now make the schedule fit the phone too'),
    drillNo: L3("Jadval hali butun en bo'ylab emas. Unga ham yuz foiz kerak.", 'Расписание пока не во всю ширину. Ему тоже нужны сто процентов.', 'The schedule isn’t full width yet. It needs a hundred percent too.')
  },
  t2: {
    eyebrow: L3("Jamoa", 'Команда', 'Team'),
    say: L3("Banner tayyor! Endi jamoa sahifasi. Telefonda o'yinchilar kartalari bir qatorga siqilib qoldi. Media qoidasi tayyor, ichida kartalar qatori uchun qoida ham bor, lekin u bo'm-bo'sh. Telefonda kartalar ustma-ust tursin: qavslar ichiga xususiyat va qiymatni yozing.",
      'Баннер готов! Теперь страница команды. На телефоне карточки игроков сжались в один ряд. Правило media готово, внутри есть правило для ряда карточек, но оно пустое. Пусть на телефоне карточки стоят друг под другом: впиши в скобки свойство и значение.',
      'The banner is done! Now the team page. On a phone the player cards got squeezed into one row. The media rule is ready, and inside it there’s a rule for the row of cards, but it’s empty. Make the cards stack on a phone: write a property and value inside the braces.'),
    ask: L3("Telefonda kartalar ustma-ust tursin", 'На телефоне поставь карточки друг под другом', 'Stack the cards on a phone'),
    ok: L3("Ajoyib! Telefonda kartalar ustma-ust turibdi, kompyuterda esa avvalgidek qatorda.", 'Отлично! На телефоне карточки друг под другом, а на компьютере по-прежнему в ряд.', 'Great! On a phone the cards are stacked, and on a computer they stay in a row.'),
    hints: [
      L3("Kartalar qatorda, chunki qator display flex bilan yasalgan. Flexbox tizimida yo'nalishni qaysi xususiyat o'zgartiradi?", 'Карточки в ряд, потому что у ряда display flex. Какое свойство во Flexbox меняет направление?', 'The cards are in a row because the row has display flex. Which Flexbox property changes the direction?'),
      L3("Bu flex-direction. column qiymati hamma narsani ustun qilib, ustma-ust qo'yadi.", 'Это flex-direction. Значение column ставит всё столбиком, друг под другом.', 'It’s flex-direction. The value column stacks everything in a column.'),
      L3("Namuna kod ostida: menyu telefonda ustun bo'ladi. Xuddi shunday, kartalar qatori uchun yozing.", 'Образец под кодом: меню на телефоне становится столбиком. Напиши так же для ряда карточек.', 'The example under the code: the menu becomes a column on a phone. Write the same for the row of cards.')
    ],
    no: L3("Kartalar hali qatorda turibdi. Ularni flex-direction va column qiymati ustma-ust qo'yadi.", 'Карточки всё ещё в ряд. Друг под другом их ставит flex-direction со значением column.', 'The cards are still in a row. flex-direction with the value column stacks them.'),
    everywhere: L3("Kartalar hamma joyda, kompyuterda ham ustma-ust bo'lib qoldi. Faqat media qoidasining ichiga yozing.", 'Карточки встали столбиком везде, и на компьютере тоже. Пиши только внутри правила media.', 'The cards stacked everywhere, on a computer too. Write only inside the media rule.'),
    drill: L3("endi telefonda kartalar to'q sariq bo'lsin", 'теперь на телефоне сделай карточки оранжевыми', 'now make the cards orange on a phone'),
    drillNo: L3("Telefonda kartalar hali to'q sariq emas. Qavslar ichiga background-color va orange yozing.", 'На телефоне карточки пока не оранжевые. Впиши в скобки background-color и orange.', 'The cards aren’t orange on a phone yet. Write background-color and orange inside the braces.')
  },
  t3: {
    eyebrow: L3("O'yinlar", 'Матчи', 'Matches'),
    say: L3("Ikkita sahifa tayyor! Uchinchisi: o'yinlar jadvali. Telefonda ekran kichik, reklama esa ko'p joy egallaydi. Reklama telefonda ko'rinmasin, kompyuterda qolsin: media qoidasini boshidan oxirigacha o'zingiz yozing. Reklamaning klassi HTML kodda ko'rinib turibdi.",
      'Две страницы готовы! Третья: расписание матчей. На телефоне экран маленький, а реклама занимает много места. Пусть на телефоне рекламы не будет, а на компьютере она останется: напиши правило media целиком сам. Класс рекламы виден в HTML-коде.',
      'Two pages are done! The third is the match schedule. A phone screen is small, and the ad takes up a lot of room. Hide the ad on a phone but keep it on a computer: write the whole media rule yourself. The ad’s class is shown in the HTML code.'),
    ask: L3("Reklamani faqat telefonda yashiring", 'Спрячь рекламу только на телефоне', 'Hide the ad on phones only'),
    ok: L3("Voy, qanday toza! Telefonda reklama yo'q, kompyuterda esa u joyida.", 'Ого, как чисто! На телефоне рекламы нет, а на компьютере она на месте.', 'Wow, so clean! No ad on a phone, and it’s still there on a computer.'),
    hints: [
      L3("Ikki qism kerak: media sharti va uning ichida reklama uchun qoida.", 'Нужны две части: условие media и внутри него правило для рекламы.', 'You need two parts: a media condition and, inside it, a rule for the ad.'),
      L3("Shart qavs ichida: max-width olti yuz piksel. Ichida nuqta reklama, display va none. none ya'ni yashirish degani.", 'Условие в скобках: max-width шестьсот пикселей. Внутри: точка reklama, display и none. none — то есть «спрятать».', 'The condition in brackets: max-width six hundred pixels. Inside: dot reklama, display and none. none means hide.'),
      L3("Namuna kod ostida: telefonda menyu yashirinadi. Xuddi shunday, reklama uchun yozing.", 'Образец под кодом прячет меню на телефоне. Напиши так же для рекламы.', 'The example under the code hides the menu on a phone. Write the same for the ad.')
    ],
    no: L3("Reklama hali joyida turibdi. Uni media qoidasi ichidagi display va none yashiradi.", 'Реклама всё ещё на месте. Её спрячет display со значением none внутри правила media.', 'The ad is still there. display none inside a media rule will hide it.'),
    everywhere: L3("Reklama hamma joyda, kompyuterda ham yashirindi. Uni faqat telefonda yashiring: media qoidasining ichida.", 'Реклама спряталась везде, и на компьютере тоже. Спрячь её только на телефоне: внутри правила media.', 'The ad is hidden everywhere, on a computer too. Hide it on phones only: inside a media rule.'),
    wide: L3("Bu shart kompyuterga ham mos keladi: u yerda oyna sakkiz yuz piksel. Kichikroq chegara oling, masalan olti yuz piksel.", 'Это условие подходит и компьютеру: там окно восемьсот пикселей. Возьми границу поменьше, например шестьсот пикселей.', 'That condition fits a computer too: its window is eight hundred pixels. Pick a smaller limit, for example six hundred pixels.'),
    drill: L3("endi telefonda kassa haqidagi qatorni ham yashiring", 'теперь на телефоне спрячь и строку про кассу', 'now hide the box office line on a phone too'),
    drillNo: L3("Kassa haqidagi qator hali ko'rinib turibdi yoki u kompyuterda ham yashirindi. Uni media qoidasining ichida yashiring.", 'Строка про кассу всё ещё видна или спряталась и на компьютере. Спрячь её внутри правила media.', 'The box office line is still visible, or it’s hidden on a computer too. Hide it inside a media rule.')
  },
  t4: {
    eyebrow: L3("Do'kon", 'Магазин', 'Shop'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: klub do'koni. Bu kodni men shoshib yozgan edim, unda ikkita joy buzilgan. Shuning uchun telefonda banner ekrandan chiqib turibdi, kartalar esa qatorda siqilgan. Ikkala buzilgan joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: магазин клуба. Этот код я писал в спешке, и в нём две поломки. Поэтому на телефоне баннер вылезает за экран, а карточки сжаты в ряд. Найди и почини обе поломки.',
      'Three pages are done! The fourth is the club shop. I wrote this code in a hurry, and it has two broken spots. That’s why on a phone the banner sticks out and the cards are squeezed in a row. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Telefonda kartalar ustma-ust, banner esa yashirindi.", 'Вот это да! На телефоне карточки друг под другом, а баннер спрятан.', 'That’s it! On a phone the cards are stacked and the banner is hidden.'),
    hints: [
      L3("Shartlarni darsdagi qoida bilan solishtiring: qavslar bormi, max-width yozilganmi yoki min-width?", 'Сравни условия с правилом из урока: есть ли скобки, что написано — max-width или min-width?', 'Compare the conditions with the rule from the lesson: are there brackets, does it say max-width or min-width?'),
      L3("Birinchi qoidada shart dumaloq qavslarsiz yozilgan. Ikkinchisida min-width turibdi: u keng oynalar uchun, telefonga esa max-width kerak.", 'В первом правиле условие без круглых скобок. Во втором стоит min-width: оно для широких окон, а телефону нужен max-width.', 'In the first rule the condition has no round brackets. The second says min-width: that’s for wide windows, and a phone needs max-width.'),
      L3("Namuna kod ostida: ikkita to'g'ri media qoidasi. Xuddi shunday tuzating va Tekshirishni bosing.", 'Образец под кодом — два верных правила media. Почини так же и нажми «Проверить».', 'The example under the code has two correct media rules. Fix yours the same way and tap Check.')
    ],
    cards: L3("Kartalar hali qatorda turibdi. Birinchi media qoidasini tekshiring.", 'Карточки всё ещё в ряд. Проверь первое правило media.', 'The cards are still in a row. Check the first media rule.'),
    banner: L3("Banner hali telefonda ko'rinib turibdi. Ikkinchi media qoidasini tekshiring.", 'Баннер всё ещё виден на телефоне. Проверь второе правило media.', 'The banner is still visible on a phone. Check the second media rule.'),
    everywhere: L3("Bu qoida media qoidasidan tashqarida turibdi va kompyuterda ham ishlaydi. Uni media qoidasining ichiga qaytaring.", 'Это правило стоит вне media и сработает и на компьютере. Верни его внутрь правила media.', 'This rule is outside media and will work on a computer too. Put it back inside the media rule.'),
    drill: L3("yana bitta shartni tuzating", 'почини ещё одно условие', 'fix one more condition'),
    drillNo: L3("Kartalar hali qatorda turibdi: shartdagi sonda px yo'q.", 'Карточки всё ещё в ряд: у числа в условии нет px.', 'The cards are still in a row: the number in the condition has no px.')
  },
  t5: {
    eyebrow: L3("Mening klubim", 'Мой клуб', 'My club'),
    say: L3("To'rtta sahifa tayyor! Oxirgisi sizniki. O'z klubingiz saytini telefonga moslang: media qoidasi ichida kartalarni ustma-ust qo'ying va bannerga telefon uchun o'z rangingizni bering. Chegarani ham o'zingiz tanlashingiz mumkin. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы готовы! Последняя — твоя. Подстрой сайт своего клуба под телефон: внутри правила media поставь карточки друг под другом и дай баннеру свой цвет для телефона. Границу тоже можешь выбрать сам. Под окном видно, что уже готово.',
      'Four pages are done! The last one is yours. Fit your club’s site to a phone: inside the media rule, stack the cards and give the banner its own phone color. You can choose the limit yourself too. Under the window you can see what’s done.'),
    ask: L3("Saytingizni telefonga moslang", 'Подстрой свой сайт под телефон', 'Fit your site to a phone'),
    ok: L3("Ura! Klubingiz sayti telefonda ham chiroyli. Bu sizning moslashuvchan saytingiz!", 'Ура! Сайт твоего клуба красив и на телефоне. Это твой адаптивный сайт!', 'Hooray! Your club’s site looks great on a phone too. This is your responsive site!'),
    hints: [
      L3("Hamma qoidalar media qavslari ichida turadi: biri kartalar qatori uchun, biri banner uchun.", 'Все правила стоят внутри скобок media: одно для ряда карточек, одно для баннера.', 'All the rules go inside the media braces: one for the row of cards, one for the banner.'),
      L3("Kartalar qatoriga flex-direction va column yozing. Bannerga esa background-color va o'zingiz yoqtirgan rang.", 'Ряду карточек напиши flex-direction и column. А баннеру — background-color и любой цвет, какой нравится.', 'Give the row of cards flex-direction column. And give the banner background-color with any color you like.'),
      L3("Namuna kod ostida: boshqa sayt uchun ikkita qoida. O'zingizga yoqqan rangni tanlang.", 'Образец под кодом — два правила для другого сайта. Выбери свой цвет.', 'The example under the code has two rules for another site. Pick your own color.')
    ],
    empty: L3("Media qoidasining ichi hali bo'sh. U yerga telefon uchun qoidalarni yozing.", 'Внутри правила media пока пусто. Напиши там правила для телефона.', 'The media rule is still empty inside. Write the phone rules there.'),
    needMedia: L3("Media qoidasi yo'q. Telefon uchun qoidalarni media ichiga yozing.", 'Нет правила media. Правила для телефона пиши внутри media.', 'There’s no media rule. Write the phone rules inside media.'),
    wide: L3("Shart telefonga mos kelmayapti: oyna uch yuz oltmish piksel. Chegarani kattaroq oling, masalan olti yuz piksel.", 'Условие не подходит телефону: окно триста шестьдесят пикселей. Возьми границу побольше, например шестьсот пикселей.', 'The condition doesn’t fit a phone: the window is three hundred sixty pixels. Pick a bigger limit, for example six hundred pixels.'),
    needCards: L3("Telefonda kartalar hali qatorda turibdi. Kartalar qatoriga flex-direction va column yozing.", 'На телефоне карточки всё ещё в ряд. Напиши ряду карточек flex-direction и column.', 'On a phone the cards are still in a row. Give the row of cards flex-direction column.'),
    order: L3("Media qoidasi bor, lekin pastdagi oddiy qoida uni yengib qo'ydi. Media qoidasini eng pastga ko'chiring.", 'Правило media есть, но обычное правило ниже его перебило. Перенеси media в самый низ.', 'The media rule is there, but an ordinary rule below it wins. Move media to the very bottom.'),
    needBanner: L3("Telefonda bannerning o'z rangi hali yo'q. Media ichida bannerga background-color yozing.", 'На телефоне у баннера пока нет своего цвета. Напиши баннеру background-color внутри media.', 'The banner doesn’t have its own phone color yet. Give it background-color inside media.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Klubning beshta sahifasi ham endi telefonda chiroyli! Bularning hammasini foiz va media qoidalari qildi, kodni esa siz yozdingiz.", 'Все пять страниц клуба теперь красивые и на телефоне! Это сделали проценты и правила media, и весь этот код — твой.', 'All five club pages look great on a phone now! Percent and media rules did that, and all that code is yours.') },
      { k: 'a', text: L3("Foiz o'lchamni oynaga moslaydi: yuz foiz bu butun en.", 'Проценты подстраивают размер под окно: сто процентов — вся ширина.', 'Percent fits the size to the window: a hundred percent is the full width.') },
      { k: 'b', text: L3("Media qoidasi faqat shart bajarilganda ishlaydi, masalan telefonda.", 'Правило media работает, только когда выполнено условие, например на телефоне.', 'A media rule works only when its condition is met, for example on a phone.') },
      { k: 'c', text: L3("Telefonda kartalarni ustma-ust qo'yasiz, ortiqchasini esa display none bilan yashirasiz.", 'На телефоне ставишь карточки друг под другом, а лишнее прячешь через display none.', 'On a phone you stack the cards and hide the extras with display none.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: qavssiz shartni, px yozilmagan sonni va max o'rniga yozilgan min so'zini.", 'И находишь поломки: условие без скобок, число без px и min вместо max.', 'And you find broken spots: a condition without brackets, a number without px, and min instead of max.') },
      { k: null, text: L3("Siz CSS ning hamma asosiy mavzularini o'tdingiz! Keyingi darsda hammasini birlashtirib, o'z saytingizni boshidan oxirigacha yaratasiz. Ko'rishguncha!", 'Все главные темы CSS позади! На следующем уроке соберёшь всё вместе и сделаешь свой сайт от начала до конца. До встречи!', 'You’ve covered all the main CSS topics! Next lesson you’ll put it all together and build your own site from start to finish. See you!') }
    ],
    roles: {
      a: L3("foiz: «100%» — butun en", 'проценты: «100%» — вся ширина', 'percent: “100%” — the full width'),
      b: L3("@media (max-width: 600px)", '@media (max-width: 600px)', '@media (max-width: 600px)'),
      c: L3("column · display: none", 'column · display: none', 'column · display: none'),
      d: L3("tuzatish: qavslar, px, max-width", 'починка: скобки, px, max-width', 'fixing: brackets, px, max-width')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
