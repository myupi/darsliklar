// =============================================================================
// КУРС «CSS» · Урок 16 — «Адаптивность»
// (облик «Редактор», как уроки курса HTML; 07.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css16/build.mjs → lessons/css/16-adaptivnost.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 16 · «Адаптивность» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (07.11.2026). Уроки 1–15: всё основное CSS. Сайт Коди красив на компьютере, а на телефоне баннер шириной
// 700px вылезает за экран, карточки сжимаются. Ученик узнаёт: px — всегда одинаково, % — от ширины окна (width: 100%);
// @media (max-width: 600px) { … } — правила только для узких окон (карточки столбиком, баннер спрятан display: none);
// поломки: условие без скобок, число без px, min-width вместо max-width. Загадка (без имён): Коди пишет @media в самом
// верху кода, до обычных правил. Разгадка: правила одной силы — побеждает нижнее, @media пишут внизу.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (окно сужается до телефона: баннер вылез, карточки тесно → 100% и @media; загадка про @media вверху)
//   %:         s2 показ (700px на компьютере · на телефоне вылез · 100% · и на компьютере) · s3 вписать 100% (Fill) · s4 px или % (Sort)
//   @media:    s5 показ (тесно · @media — столбиком · на компьютере спит) · s6 вписать 600px (Fill) · s7 сработает ли (Sort)
//   что менять: s8 показ (display: none на телефоне · на компьютере на месте) · s9 вписать none (Fill) · s10 в @media или всегда (Sort)
//   поломки:   s11 показ (без скобок, без px, min-width) · s12 исправить условие без скобок (Debug & Fix) · s13 найти правило
//   w1 правило целиком: @media (max-width: 600px) { .banner { display: none; } } · s14 свой сайт («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: ширина окна — настоящая ширина страницы (800 — компьютер, 360 — телефон), страница уменьшается,
//     чтобы влезть в окно урока (как режим устройства в DevTools); ширина меняется плавно, и @media включается ровно на
//     границе. Условие проверяет сам браузер (matchMedia), проценты и прокрутку вбок считает браузер. Ученик сам
//     переключает «Компьютер · Телефон».
//   · Не забегаем: meta viewport (только в артефакте), несколько условий (and), em/rem, vw/vh.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: moslashuvchan sayt — адаптивный сайт; foiz — %; shart — условие; chegara — граница (breakpoint);
// oyna kengligi — ширина окна; uxlaydi — правило «спит». В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-16-adaptivnost',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '16-dars. Moslashuvchan sayt',
    ru: 'Урок 16. Адаптивность',
    en: 'Lesson 16. Responsive design'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Qoida', 'Правило', 'Rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3("Yakuniy loyiha", 'Финальный проект', 'Final project'),
  mainAx: L3("asosiy o'q", 'главная ось', 'main axis'),
  crossAx: L3("ko'ndalang o'q", 'поперечная ось', 'cross axis'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card, site.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт Коди (не звучит).
  site: {
    title: L3("Kodining sayti", 'Сайт Коди', 'Kodi’s site'),
    banner: L3("Yangi o'yin chiqdi! Hoziroq o'ynang va do'stlaringizni chaqiring!", 'Вышла новая игра! Играй прямо сейчас и зови друзей!', 'A new game is out! Play right now and invite your friends!'),
    cards: [L3("Yangi o'yinlar", 'Новые игры', 'New games'), L3('Sevimli musiqa', 'Любимая музыка', 'Favourite music'), L3('Kino va multfilmlar', 'Кино и мультики', 'Movies and cartoons')]
  },
  s1: {
    eyebrow: L3("Telefonda buzilgan sayt", 'Сайт ломается на телефоне', 'A site that breaks on a phone'),
    say: L3("Salom! Mana mening saytim: tepada yangi o'yin haqida banner, pastida uchta karta. Kompyuterda hammasi chiroyli turibdi. Endi oyna telefondek torayadi. Qarang-chi: banner ekrandan chiqib ketdi, kartalar esa siqilib qoldi! Saytni ko'pchilik telefondan ochadi-ku, bunday sayt ularga yoqmaydi. Qani, «Aylantirish» tugmasini bosib, nima bo'lishini ko'ring.",
      'Привет! Смотри, на компьютере мой сайт красивый: сверху баннер, ниже три карточки. Но сейчас окно сузится, как у телефона. Смотри, что будет: баннер вылез за экран, а карточки сжались. А ведь сайты чаще всего открывают с телефона! Нажми «Превратить».',
      'Hi! Look, my site looks great on a computer: a banner on top, three cards below. But now the window will get narrow, like a phone. Watch what happens: the banner sticks out of the screen, and the cards get squeezed. And most people open sites on their phones! Tap “Transform”.'),
    magic: L3("Voy, qarang! Banner endi ekranga to'liq sig'di, kartalar esa telefonda ustma-ust terilib oldi. Ishonmasangiz, pastdagi tugmalar bilan kompyuterni ham, telefonni ham sinab ko'ring-chi.", 'Вот! Теперь баннер помещается в экран, а карточки на телефоне стоят друг под другом. Переключай компьютер и телефон кнопками внизу.', 'There! Now the banner fits the screen, and on a phone the cards stack one under another. Switch between computer and phone with the buttons below.'),
    magicP: L3("Bunga ikkita narsa sabab bo'ldi. Biri foiz: u o'lcham oynaning qancha qismi bo'lishini aytadi. Ikkinchisi media qoidasi: u ekranning o'lchamiga qarab ishlaydi. Shuning uchun sayt ekranga moslashib oldi. Bunday saytni moslashuvchan sayt deyishadi.", 'Это сделали две вещи. Проценты, то есть «какая часть окна», и media, то есть правило, которое смотрит на размер экрана. Сайт подстроился под экран. Это называют адаптивным сайтом.', 'Two things did it. Percent, meaning what part of the window, and media, meaning a rule that looks at the screen size. The site adapted to the screen. That’s called a responsive site.'),
    done: L3("Bugun siz ham saytni har qanday ekranga moslashtirishni o'rganasiz. Endi bir garov o'ynaymiz! Saytimni ilk bor moslashtirganimda, media qoidasini kodning eng tepasiga, oddiy qoidalardan oldin qo'ygandim. Men aytaman: qoidaning joyi muhim emas, u baribir ishlaydi. Siz qaysi tarafdasiz? Kim yutganini darsning so'nggi ekranida ko'ramiz.",
      'Сегодня ты научишься подстраивать сайт под любой экран. Но сначала загадка. В первый раз я написал правило media в самом верху кода, до обычных правил. По-моему, место не важно, всё равно сработает. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to fit a site to any screen. But first, a riddle. The first time, I put the media rule at the very top of the code, before the ordinary rules. I think the place doesn’t matter, it’ll still work. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Foiz va @media", 'Проценты и @media', 'Percent and @media')
  },
  s2: {
    eyebrow: L3("Piksel yoki foiz", 'Пиксели или проценты', 'Pixels or percent'),
    help: [
      L3("Bannerga bir qarang-chi, keyin o'ng tepadagi belgiga ham. Telefonda bu belgi qizarib qoladi: demak, sahifa oynadan kengroq bo'lib ketgan.", 'Посмотри на баннер и на метку справа вверху: на телефоне она краснеет и показывает, что страница шире окна.', 'Look at the banner and the label at the top right: on a phone it turns red and shows the page is wider than the window.'),
      L3("Piksel juda qaysar: u doim bir xil qoladi, yetti yuz piksel telefonda ham yetti yuzligicha turadi. Foiz esa oynaga qarab moslashadi: yuz foiz har doim oynaning butun eniga teng.", 'Пиксели всегда одинаковые, а проценты меняются вместе с окном. Сто процентов — вся ширина.', 'Pixels always stay the same, and percent changes with the window. A hundred percent is the full width.'),
      L3("Stakanga suv quyib ko'rganmisiz? U katta stakanni ham, kichkinasini ham chetigacha to'ldiradi. Yuz foizli banner oynani xuddi suvdek to'ldiradi: oyna keng bo'lsa ham, tor bo'lsa ham.", 'Вода заполняет стакан, большой он или маленький. Баннер в сто процентов так же заполняет любое окно.', 'Water fills a glass, whether it’s big or small. A hundred percent banner fills any window the same way.')
    ],
    say: L3("Keling, oldin bannerni ko'rib chiqamiz. Hozircha uning eni yetti yuz piksel qilib yozilgan. Kompyuter oynasi kengroq, shuning uchun banner bu yerga bemalol sig'ib turibdi.",
      'Сначала посмотрим на баннер. Сейчас его ширина семьсот пикселей. На компьютере он спокойно помещается.',
      'First, the banner. Right now it’s seven hundred pixels wide. On a computer it fits easily.'),
    sayPhone: L3("Endi oyna telefondek torayib, uch yuz oltmish pikselga tushdi. Yetti yuz piksellik banner bunga sig'maydi-ku! Pastda paydo bo'lgan chiziqqa qarang: endi saytni yonga surish kerak.", 'Теперь окно как у телефона: триста шестьдесят пикселей. Семьсот пикселей сюда не влезают, сайт стал прокручиваться вбок. Посмотри на полосу прокрутки внизу.', 'Now the window is like a phone: three hundred sixty pixels. Seven hundred pixels don’t fit, so the site scrolls sideways. Look at the scrollbar at the bottom.'),
    sayPct: L3("Endi yetti yuz piksel o'rniga yuz foiz yozamiz. Yuz foiz oynaning butun eni degani: oyna qancha keng bo'lsa, banner ham shuncha keng bo'ladi. Qarang-chi, telefonda u ekranga roppa-rosa sig'di!", 'Сто процентов — то есть вся ширина. Баннер такой же широкий, как окно. На телефоне он поместился ровно по экрану.', 'A hundred percent means the whole width. The banner is as wide as the window. On a phone it fits the screen exactly.'),
    sayWide: L3("Kompyuterga qaytsak-chi? Qoida o'sha-o'sha, banner esa endi kompyuter oynasining ham butun eniga cho'zildi. Ko'rdingizmi, bitta qoida ikkala ekranga ham mos keldi!", 'И на компьютере то же правило: баннер снова во всю ширину. Одно правило подошло обоим экранам.', 'On a computer, the same rule: the banner is again the full width. One rule fits both screens.'),
    done: L3("Demak, piksel qaysi ekranda bo'lmasin bir xil qoladi, foiz esa oyna bilan birga kengayib, torayadi.", 'Значит, пиксели всегда одинаковые, а проценты меняются вместе с окном.', 'So pixels always stay the same, and percent changes with the window.'),
    askStart: L3("Qarang: kompyuterda 700px", 'Смотри: 700px на компьютере', 'Watch: 700px on a computer'),
    askPhone: L3("Qarang: telefonda sig'madi", 'Смотри: на телефоне не влез', 'Watch: it doesn’t fit on a phone'),
    askPct: L3("Qarang: 100 foiz — butun en", 'Смотри: 100 процентов — вся ширина', 'Watch: 100 percent is the full width'),
    askWide: L3("Qarang: kompyuterda ham", 'Смотри: и на компьютере', 'Watch: on a computer too'),
    askDone: L3("px — doim bir xil, foiz — oynaga qarab", 'px — всегда одинаково, проценты — по окну', 'px stays the same, percent follows the window')
  },
  s3: {
    eyebrow: L3("Butun en bo'ylab", 'Во всю ширину', 'Full width'),
    say: L3("Qani, endi bannerni o'zingiz tuzatib ko'ring! U har qanday ekranda oynaning butun eniga cho'zilib tursin: width uchun qiymat yozing. Keyin pastdagi tugmalar bilan bannerni ikkala ekranda ko'rib chiqing.",
      'Теперь твоя очередь. Пусть баннер на любом экране будет во всю ширину: впиши значение ширины. Потом проверь на компьютере и на телефоне.',
      'Now it’s your turn. Make the banner full width on any screen: type the width value. Then check it on the computer and the phone.'),
    msgs: {
      empty: L3("Maydon hali bo'sh-ku. Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      px: L3("Piksel doim bir xil bo'ladi, shuning uchun u yo telefonga, yo kompyuterga to'g'ri kelmay qoladi. Bu yerga foiz kerak.", 'Пиксели всегда одинаковые: на телефоне или на компьютере они не подойдут. Нужны проценты.', 'Pixels always stay the same: they won’t fit on a phone or a computer. We need percent.'),
      noPct: L3("Son yozilibdi, lekin yonida foiz belgisi yo'q. Usiz brauzer bu sonni tushunmaydi.", 'Число есть, а знака процента нет.', 'There’s a number but no percent sign.'),
      otherPct: L3("Bu oynaning faqat bir qismi bo'ladi. O'ylab ko'ring-chi, butun en necha foiz?", 'Это только часть ширины. Сколько процентов — вся ширина?', 'That’s only part of the width. What percent is the whole width?'),
      bad: L3("Brauzer bunday qiymatni tanimadi. Oldin sonni, keyin foiz belgisini yozing.", 'Браузер не узнал это значение. Напиши число и знак процента.', 'The browser didn’t recognize that value. Write a number and a percent sign.'),
      other: L3("Bunday qiymat bannerni oynaning chetidan chetigacha cho'zmaydi. Oynaning hammasini egallash uchun necha foiz kerak?", 'Это другое значение. Нужна вся ширина в процентах.', 'That’s a different value. We need the whole width in percent.')
    },
    hints: [
      L3("Biror narsaning hammasi necha foiz bo'ladi, esingizdami?", 'Сколько процентов — это всё целиком?', 'How many percent is the whole thing?'),
      L3("Hammasi doim yuz foiz bo'ladi. Oynaning butun eni ham yuz foiz.", 'Всё целиком — это сто процентов.', 'The whole thing is a hundred percent.'),
      L3("Maydonga yuz deb yozing, yoniga pastdagi tugmadan foiz belgisini qo'shing-da, «Tekshirish»ni bosing.", "Впиши сто, потом нажми внизу кнопку со знаком процента и «Проверить».", "Type a hundred, then tap the percent sign button below and Check.")
    ],
    ok: L3("Zo'r! Endi banner qaysi ekranda bo'lmasin, chetidan chetigacha sig'adi. Kompyuter tugmasini bosib, u yerda ham bir ko'rib qo'ying.", 'Огонь! Теперь баннер помещается на любом экране. Переключи телефон и компьютер.', 'Awesome! Now the banner fits any screen. Switch between phone and computer.'),
    ask: L3("Banner butun en bo'ylab", 'Баннер во всю ширину', 'The banner at full width')
  },
  s4: {
    eyebrow: L3("px yoki foiz?", 'px или проценты?', 'px or percent?'),
    say: L3("Saytimga yana bir nechta narsa qo'shmoqchiman. Har bir vazifani o'qing-da, o'lchami uchun nima kerakligini tanlang: piksel yoki foiz.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, что нужно: пиксели или проценты.',
      'Now check yourself. I’ll say a task, and you pick what’s needed: pixels or percent.'),
    ask: L3("Buning uchun nima kerak?", 'Что для этого нужно?', 'What does this need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Vazifada o'lcham haqida nima deyilgan: u doim bir xil qoladimi yoki oynaga qarab o'zgaradimi?", 'Размер всегда один и тот же или меняется вместе с окном?', 'Is the size always the same, or does it change with the window?'),
    hint2: L3("O'lcham doim bir xil bo'lsa, piksel yozamiz. Oynaning bir qismi bo'lsa, foiz kerak bo'ladi.", 'Всегда одинаковый — пиксели. Часть окна — проценты.', 'Always the same: pixels. A part of the window: percent.'),
    items: [
      { t: L3("Logotip har qanday ekranda aynan qirq piksel.", 'Логотип на любом экране ровно сорок пикселей.', 'The logo is exactly forty pixels on any screen.'), right: 'px', why: L3("Logotip qaysi ekranda bo'lmasin, qirq pikselligicha qoladi. O'zgarmaydigan o'lcham piksel bilan yoziladi.", 'Размер всегда одинаковый, значит, пиксели.', 'The size never changes, so pixels.') },
      { t: L3("Rasm oynaning yarmini egallasin.", 'Картинка должна занимать половину окна.', 'The picture should take half the window.'), right: '%', why: L3("Oynaning yarmi ellik foiz bo'ladi: oyna torayadimi, kengayadimi, rasm doim uning yarmini oladi.", 'Половина окна — это пятьдесят процентов.', 'Half the window is fifty percent.') },
      { t: L3("Banner har qanday ekranda butun en bo'ylab tursin.", 'Баннер на любом экране во всю ширину.', 'The banner is full width on any screen.'), right: '%', why: L3("Butun en har qanday ekranda yuz foiz bo'ladi, xuddi biz bannerga yozgandek.", 'Вся ширина — это сто процентов.', 'The whole width is a hundred percent.') },
      { t: L3("Tugma doim bir xil: yuz yigirma piksel.", 'Кнопка всегда одинаковая: сто двадцать пикселей.', 'The button is always the same: a hundred twenty pixels.'), right: 'px', why: L3("Tugma hamma ekranda bir xil bo'lsin degan ekanmiz, uning o'lchamini pikselda yozamiz.", 'Всегда одинаковая, значит, пиксели.', 'Always the same, so pixels.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Logotipdan tugmagacha hammasiga mos o'lcham topdingiz! Qayerda piksel, qayerda foiz kerakligi endi sizga tushunarli.", 'Всё верно! Ты не путаешь пиксели и проценты.', 'All correct! You don’t mix up pixels and percent.')
  },
  s5: {
    eyebrow: L3("@media", '@media', '@media'),
    help: [
      L3("Kartalarga bir qarang-chi, oyna kengligiga ham. Oyna tor bo'lsa, kartalar ustma-ust turadi, keng bo'lsa, yana qatorga tiziladi.", 'Посмотри на карточки и ширину окна: в узком окне они друг под другом, в широком — в ряд.', 'Look at the cards and the window width: in a narrow window they stack, in a wide one they sit in a row.'),
      L3("Hammasi shartga bog'liq: media ichidagi qoidalar faqat shart bajarilgandagina ishlaydi. max-width olti yuz piksel bo'lsa, bu «oyna olti yuz pikseldan keng bo'lmasa», degani.", 'Правила внутри media работают, только когда выполнено условие. max-width шестьсот пикселей — значит, окно не шире шестисот.', 'Rules inside media only work when the condition is met. max-width six hundred pixels means the window is no wider than six hundred.'),
      L3("Soyabonni doim ochib yurmaysiz-ku, faqat yomg'ir yog'sa ochasiz. media qoidasi uchun tor oyna xuddi yomg'irga o'xshaydi: oyna torayishi bilan qoida ishga tushadi, kengayishi bilan to'xtaydi.", 'Зонт открывают, только когда идёт дождь. Правило media так же работает, только когда окно узкое.', 'You open an umbrella only when it rains. A media rule works only when the window is narrow.')
    ],
    say: L3("Banner joyiga keldi, endi kartalarga o'tamiz. Kompyuterda ular qatorda chiroyli turibdi. Telefonda-chi? Qani, ko'ramiz.",
      'Теперь карточки. На компьютере они красиво стоят в ряд. А на телефоне? Давай посмотрим.',
      'Now the cards. On a computer they look nice in a row. And on a phone? Let’s see.'),
    sayTight: L3("Telefonda esa kartalar siqilib qolibdi, yozuvlar ham zo'rg'a sig'yapti. Bunday tor ekranda ularni ustma-ust qo'ysak, ancha yaxshi bo'lardi.", 'На телефоне карточки сжались, надписи еле помещаются. На телефоне лучше поставить их друг под другом.', 'On a phone the cards are squeezed, and the labels barely fit. On a phone it’s better to stack them.'),
    sayMedia: L3("Kodga media qoidasini qo'shdik. Qavslar ichida uning sharti turibdi: max-width olti yuz piksel. max-width inglizchada «eng katta en» degani. Demak, oyna olti yuz pikseldan keng bo'lmasagina, ichidagi qoida ishlaydi. Qarang, telefonda kartalar shu zahoti ustma-ust terilib oldi!", 'Это правило media. В скобках условие: max-width шестьсот пикселей, то есть «если окно не шире шестисот пикселей». Правило внутри работает только тогда. На телефоне карточки встали друг под другом.', 'This is a media rule. In brackets is a condition: max-width six hundred pixels, meaning if the window is no wider than six hundred pixels. The rule inside works only then. On a phone the cards stacked.'),
    sayWide: L3("Kompyuterda-chi? Bu yerda oyna sakkiz yuz piksel, olti yuzdan kengroq. Shart bajarilmadi, shuning uchun qoida uxlab yotibdi, kartalar esa yana qatorda turibdi.", 'На компьютере окно восемьсот пикселей, это больше шестисот. Условие не выполнено, правило спит, карточки снова в ряд.', 'On a computer the window is eight hundred pixels, more than six hundred. The condition isn’t met, the rule sleeps, and the cards are in a row again.'),
    done: L3("Xullas, media ichidagi qoidalar faqat shart bajarilganda uyg'onadi, qolgan paytda esa uxlab yotadi.", 'Значит, правила внутри media работают, только когда выполнено условие.', 'So the rules inside media only work when the condition is met.'),
    askStart: L3("Qarang: kompyuterda qatorda", 'Смотри: на компьютере в ряд', 'Watch: in a row on a computer'),
    askTight: L3("Qarang: telefonda siqildi", 'Смотри: на телефоне тесно', 'Watch: squeezed on a phone'),
    askMedia: L3("Qarang: @media — telefonda ustma-ust", 'Смотри: @media — на телефоне столбиком', 'Watch: @media stacks them on a phone'),
    askWide: L3("Qarang: kompyuterda qoida uxlaydi", 'Смотри: на компьютере правило спит', 'Watch: on a computer the rule sleeps'),
    askDone: L3("@media — shart bajarilsa ishlaydi", '@media — работает, если выполнено условие', '@media works when the condition is met')
  },
  s6: {
    eyebrow: L3("Chegara", 'Граница', 'The breakpoint'),
    say: L3("Bu safar shartni o'zingiz to'ldirasiz. Shartdagi son chegara bo'ladi: oyna undan keng bo'lmasa, qoida ishlaydi. Kartalar olti yuz piksel va undan tor oynalarda ustma-ust tursin: qavs ichidagi bo'sh joyga qiymat yozing.",
      'Теперь ты. Пусть карточки встают друг под другом в окнах шириной шестьсот пикселей и уже: впиши значение в условие.',
      'Your turn. Make the cards stack in windows six hundred pixels wide and narrower: type the value in the condition.'),
    msgs: {
      empty: L3("Shartga hali hech narsa yozilmabdi. Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      noPx: L3("Son yozilibdi, lekin px qolib ketibdi. px bo'lmasa, brauzer shartni tushunmaydi va butun media qoidasini o'tkazib yuboradi.", 'Число есть, а px нет. Без них браузер выбросит всё правило media.', 'There’s a number but no px. Without it the browser throws the whole media rule away.'),
      bad: L3("Bu qiymat brauzerga notanish ekan. Sonni yozing-da, yoniga px qo'shing.", 'Браузер не узнал это значение. Напиши число и px.', 'The browser didn’t recognize that value. Write a number and px.'),
      other: L3("Bu boshqa chegara bo'lib qoldi. Bizga olti yuz piksellik chegara kerak.", 'Это другая граница. Нужно шестьсот пикселей.', 'That’s a different breakpoint. We need six hundred pixels.')
    },
    hints: [
      L3("Vazifani yana bir o'qing-chi: kartalar necha pikselgacha ustma-ust tursin?", 'Граница — шестьсот пикселей.', 'The breakpoint is six hundred pixels.'),
      L3("Bu yerga son bilan px harflari kerak, xuddi oddiy o'lchamdagidek.", 'Нужны число и буквы px.', 'You need the number and the letters px.'),
      L3("Olti yuz deb yozing, yoniga px qo'shing-da, «Tekshirish»ni bosing.", 'Впиши шестьсот и px, потом нажми «Проверить».', 'Type six hundred and px, then tap Check.')
    ],
    ok: L3("Barakalla! Telefonda kartalar ustma-ust terildi. Endi kompyuterda ham bir tekshirib ko'ring.", 'Молодец! На телефоне карточки друг под другом. Проверь и на компьютере.', 'Well done! On a phone the cards stack. Check the computer too.'),
    ask: L3("Kartalar 600 piksel va undan tor oynada ustma-ust tursin", "Карточки столбиком в окнах 600 пикселей и уже", "Cards stacked in windows 600 pixels and narrower")
  },
  s7: {
    eyebrow: L3("Ishlaydimi?", 'Сработает?', 'Will it work?'),
    say: L3("Qani, endi brauzerning ishini o'zingiz qilib ko'ring! Men oyna kengligini va shartni ko'rsataman, siz ularni solishtirasiz: qoida ishlaydimi yoki uxlab qoladimi? Shuni tanlang.",
      'Теперь проверь себя. Я покажу ширину окна и условие media, а ты выбери: правило сработает или будет спать.',
      'Now check yourself. I’ll show the window width and a media condition, and you pick: will the rule work or sleep?'),
    ask: L3("Bu oynada qoida ishlaydimi?", 'Сработает ли правило в этом окне?', 'Will the rule work in this window?'),
    win: L3("Oyna", 'Окно', 'Window'),
    opts: {
      yes: L3("Ishlaydi", 'Сработает', 'It works'),
      no: L3("Uxlaydi", 'Спит', 'It sleeps')
    },
    hint1: L3("Oyna kengligini shartdagi son bilan solishtirib ko'ring-chi: qaysi biri kattaroq?", 'Сравни ширину окна с числом в условии.', 'Compare the window width with the number in the condition.'),
    hint2: L3("max-width oyna shu sondan keng bo'lmaganda ishlaydi. Diqqat qiling: oyna shu songa teng bo'lsa ham, qoida ishlayveradi.", 'max-width — работает, если окно не шире этого числа. Если равно — тоже работает.', 'max-width works if the window is no wider than that number. Equal counts too.'),
    items: [
      { mq: '(max-width: 600px)', vw: 360, right: 'yes', why: L3("Oyna uch yuz oltmish piksel, bu olti yuzdan kichik. Shuning uchun shart bajariladi va qoida ishlaydi.", 'Триста шестьдесят меньше шестисот, правило работает.', 'Three hundred sixty is less than six hundred, so the rule works.') },
      { mq: '(max-width: 600px)', vw: 800, right: 'no', why: L3("Oyna sakkiz yuz piksel, bu olti yuzdan katta-ku! Shart bajarilmaydi, qoida esa uxlab yotadi.", 'Восемьсот больше шестисот, правило спит.', 'Eight hundred is more than six hundred, so the rule sleeps.') },
      { mq: '(max-width: 600px)', vw: 600, right: 'yes', why: L3("Oyna olti yuz piksel, bu chegaraning o'zi. Undan katta emas-ku, shuning uchun qoida ishlaydi.", 'Шестьсот — ровно граница. Не больше, значит, работает.', 'Six hundred is exactly the breakpoint. It’s not more, so it works.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala oynada ham adashmadingiz! media shartini xuddi brauzerdek tekshirasiz.", 'Всё верно! Ты читаешь условие media, как браузер.', 'All correct! You read media conditions like a browser.')
  },
  s8: {
    eyebrow: L3("Telefonda yana nima?", 'Что ещё на телефоне?', 'What else on a phone?'),
    help: [
      L3("Bannerni kuzatib turing: telefonda u g'oyib bo'ladi, kompyuterda esa o'z joyida turaveradi.", 'Посмотри на баннер: на телефоне он пропадает, а на компьютере остаётся.', 'Look at the banner: on a phone it disappears, and on a computer it stays.'),
      L3("Buni media qoidasi qilyapti. Uning ichida telefon uchun istagan narsani o'zgartirsa bo'ladi: joylashuvni ham, o'lchamni ham. Hatto butunlay yashirsa ham bo'ladi, buning uchun display none yoziladi.", 'Внутри media можно писать любые изменения для телефона: расположение, размеры, что спрятать. display none прячет элемент.', 'Inside media you can write any change for a phone: layout, sizes, what to hide. display none hides an element.'),
      L3("Safarga chiqayotganda sumkaga hamma narsani solmaysiz-ku, keraksizini uyda qoldirasiz. display none telefonda aynan shu ishni qiladi: ortiqcha narsani «uyda qoldiradi».", 'В дорогу не берут всё подряд — лишнее оставляют дома. На телефоне лишнее так же прячут через display none.', 'You don’t pack everything for a trip; you leave extras at home. On a phone you hide extras with display none.')
    ],
    say: L3("media qoidasi faqat kartalarni emas, sahifadagi istalgan narsani o'zgartira oladi. Masalan, telefonning ekrani kichkina, banner esa undan ancha joy olib qo'yibdi.",
      'Внутри media можно менять не только карточки, а что угодно. Например, на телефоне экран маленький, а баннер занимает много места.',
      'Inside media you can change anything, not just the cards. For example, a phone screen is small, and the banner takes up a lot of space.'),
    sayHide: L3("Kodga yana bitta media qoidasi qo'shdik, ichida display none turibdi. Esingizdami, to'qqizinchi darsda none narsalarni yashirgan edi? Qarang, telefonda banner g'oyib bo'ldi, kartalarga esa joy ko'payib qoldi!", 'Ещё одно правило media: display none, то есть «спрятать». На телефоне баннер исчез, карточкам стало просторнее.', 'One more media rule: display none, meaning hide. On a phone the banner disappeared, and the cards got more room.'),
    sayWide: L3("Kompyuter oynasiga qaytamiz: banner o'z joyida turibdi, chunki keng oynada shart bajarilmaydi.", 'А на компьютере баннер на месте: там условие не выполняется.', 'On a computer the banner is still there: the condition isn’t met.'),
    done: L3("Shunday qilib, telefonga kerakli hamma o'zgarishni media ichiga yozamiz: joylashuvni ham, o'lchamni ham, yashirishni ham.", 'Значит, внутри media пишут изменения для телефона: расположение, размеры, что спрятать.', 'So inside media you write the changes for a phone: layout, sizes, what to hide.'),
    askStart: L3("Qarang: telefonda banner", 'Смотри: баннер на телефоне', 'Watch: the banner on a phone'),
    askHide: L3("Qarang: display none — yashirildi", 'Смотри: display none — спрятан', 'Watch: display none hides it'),
    askWide: L3("Qarang: kompyuterda joyida", 'Смотри: на компьютере на месте', 'Watch: still there on a computer'),
    askDone: L3("Telefon uchun o'zgarishlar — @media ichida", 'Изменения для телефона — внутри @media', 'Changes for a phone go inside @media')
  },
  s9: {
    eyebrow: L3("Telefonda yashirish", 'Спрятать на телефоне', 'Hide on a phone'),
    say: L3("Telefonda banner ko'rinmasin: buning uchun media ichidagi display qiymatini yozing. Qani, bannerni o'zingiz yashirib ko'ring!",
      'Теперь ты. Пусть на телефоне баннера не видно: впиши значение для display.',
      'Your turn. Make the banner invisible on a phone: type the value for display.'),
    msgs: {
      empty: L3("Bu yer hali bo'm-bo'sh. display uchun qiymat kerak.", 'Впиши значение.', 'Type the value.'),
      shown: L3("Bunday qiymat bilan banner hamon ko'rinib turibdi-ku. Uni yashirish uchun boshqa so'z kerak.", 'С этим значением баннер виден. Чтобы спрятать, нужно другое слово.', 'With that value the banner is still visible. To hide it you need another word.'),
      bad: L3("Brauzer bunday so'zni bilmaydi. display uchun yozgan so'zingizni harfma-harf tekshirib ko'ring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.')
    },
    hints: [
      L3("To'qqizinchi darsda narsalarni qaysi so'z bilan yashirgan edik, esingizdami?", 'Вспомни слово «спрятать» из девятого урока.', 'Remember the word for hiding from lesson nine.'),
      L3("Yashirish uchun display qiymatiga none yoziladi. none inglizchada «hech qaysi» degani.", 'Спрятать — это none.', 'Hiding is none.'),
      L3("Maydonga none deb yozing-da, «Tekshirish»ni bosing.", 'Впиши none и нажми «Проверить».', 'Type none and tap Check.')
    ],
    ok: L3("Ajoyib! Telefonda banner yashirindi, kompyuterda esa o'z joyida qoldi.", 'Отлично! На телефоне баннер спрятан, а на компьютере на месте.', 'Great! The banner is hidden on a phone and still there on a computer.'),
    ask: L3("Telefonda bannerni yashiring", 'Спрячь баннер на телефоне', 'Hide the banner on a phone')
  },
  s10: {
    eyebrow: L3("@media ichidami?", 'Внутри @media?', 'Inside @media?'),
    say: L3("Endi qoidalarni saralaymiz. To'rtta istagim bor: ba'zilari faqat telefonga kerak, ba'zilari hamma ekranga. Qaysi biri media ichiga yoziladi, qaysi biri oddiy qoida bo'ladi?",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, где пишется правило: для всех экранов или внутри media.',
      'Now check yourself. I’ll say a task, and you pick where the rule goes: for all screens or inside media.'),
    ask: L3("Qoida qayerda yoziladi?", 'Где пишется правило?', 'Where does the rule go?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    opts: {
      always: L3("Hamma ekranga", 'Для всех экранов', 'For all screens'),
      media: L3("@media ichida", 'Внутри @media', 'Inside @media')
    },
    hint1: L3("Bu istak faqat telefonga kerakmi yoki hamma ekranga?", 'Это нужно только на телефоне или везде?', 'Is this needed only on a phone, or everywhere?'),
    hint2: L3("Faqat tor ekranda kerak bo'lsa, qoida media ichiga yoziladi. Hamma ekranda kerak bo'lsa, oddiy qoida yetadi.", 'Только на узком экране — внутри media. Везде — обычное правило.', 'Only on a narrow screen: inside media. Everywhere: an ordinary rule.'),
    items: [
      { t: L3("Telefonda kartalar ustma-ust tursin.", 'На телефоне карточки должны стоять друг под другом.', 'On a phone the cards should stack.'), right: 'media', why: L3("Kartalar faqat telefonda ustma-ust turishi kerak, bunday o'zgarish esa media ichiga yoziladi.", 'Только на телефоне — значит, внутри media.', 'Only on a phone, so inside media.') },
      { t: L3("Banner hamma ekranda to'q sariq bo'lsin.", 'Баннер должен быть оранжевым на всех экранах.', 'The banner should be orange on every screen.'), right: 'always', why: L3("Banner har qanday ekranda to'q sariq bo'ladi, shuning uchun bu oddiy qoida, u shartsiz yoziladi.", 'На всех экранах — значит, обычное правило.', 'On every screen, so an ordinary rule.') },
      { t: L3("Telefonda banner yashirinsin.", 'На телефоне баннер должен быть спрятан.', 'On a phone the banner should be hidden.'), right: 'media', why: L3("Banner faqat telefonda yashirinadi, kompyuterda esa ko'rinib turadi. Shuning uchun bu qoida media ichida turadi.", 'Только на телефоне — значит, внутри media.', 'Only on a phone, so inside media.') },
      { t: L3("Kartalar o'rtasida hamma ekranda sakkiz piksel bo'lsin.", 'Между карточками на всех экранах восемь пикселей.', 'There should be eight pixels between the cards on every screen.'), right: 'always', why: L3("Sakkiz piksellik oraliq hamma ekranda bir xil, unga shart kerak emas: oddiy qoida yetadi.", 'Везде одинаково — значит, обычное правило.', 'The same everywhere, so an ordinary rule.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("Qoyil, to'rttala qoida ham o'z joyini topdi! Endi qaysi qoida qayerga yozilishini aniq bilasiz.", 'Всё верно! Ты знаешь, какое правило куда писать.', 'All correct! You know which rule goes where.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Har safar oldin shartga qarang: qavslar joyidami, son yonida px bormi, max yozilganmi yoki min? Keyin kartalarga ko'z tashlang.", 'Каждый раз смотри на условие: есть ли скобки, есть ли px у числа, написано max или min? Потом на карточки.', 'Each time, look at the condition: are there brackets, does the number have px, is it max or min? Then look at the cards.'),
      L3("Har birining o'z sababi bor. Qavs bo'lmasa yoki son yonida px bo'lmasa, brauzer shartni tushunmaydi. Telefon uchun esa max-width kerak, chunki min-width aksincha, keng oynalarda ishlaydi.", 'Условие пишут в скобках, число — с px. Для телефона нужен max-width, а min-width работает на широких окнах.', 'The condition goes in brackets, the number with px. A phone needs max-width; min-width works on wide windows.'),
      L3("Kinoteatrda «o'n ikki yoshgacha» va «o'n ikki yoshdan katta» degan yozuvlarni ko'rganmisiz? Biri kichiklar uchun, ikkinchisi kattalar uchun. max bilan min ham bir-biriga shunaqa teskari: biri tor oynalarni tanlaydi, ikkinchisi keng oynalarni.", 'Надписи «до двенадцати лет» и «от двенадцати лет» значат противоположное. max и min — так же наоборот.', 'Signs saying “under twelve” and “twelve and over” mean opposite things. max and min are opposites the same way.')
    ],
    say: L3("Saytimni moslashtirayotganda media qoidasini bir necha marta buzib qo'ygandim. Keling, o'sha uchta xatoni telefonda birga ko'ramiz. Hozircha hammasi joyida: kartalar ustma-ust turibdi.",
      'И в правиле media бывают ошибки. Давай посмотрим на три на телефоне. Сейчас всё правильно: карточки друг под другом.',
      'Media rules have mistakes too. Let’s look at three on a phone. Right now everything is correct: the cards are stacked.'),
    sayParens: L3("Birinchi xatom: shartni qavssiz yozibman. Brauzer uni tushunmadi va butun media qoidasini o'tkazib yubordi. Ko'rdingizmi, kartalar yana qatorga qaytdi.", 'Первая: условие без скобок. Браузер его не понял и выбросил всё правило media. Карточки снова в ряд.', 'The first: the condition has no brackets. The browser didn’t understand it and threw the whole media rule away. The cards are in a row again.'),
    sayPx: L3("Ikkinchisida olti yuzni yozibman-u, px qolib ketibdi. Brauzer bunday shartni ham tushunmaydi, shuning uchun qoidani yana o'tkazib yubordi.", 'Вторая: написано шестьсот, а px нет. Это тоже ошибка, браузер снова выбросил правило.', 'The second: six hundred is written, but no px. That’s a mistake too, and the browser threw the rule away again.'),
    sayMin: L3("Uchinchisi ayyorroq: max o'rniga min yozibman. min-width inglizchada «eng kichik en» degani: bu shart oyna olti yuz piksel yoki undan keng bo'lsa bajariladi. Natijada qoida telefonda uxlab qoldi, keng kompyuterda esa kartalarni ustma-ust qo'yib qo'ydi. Hammasi teskari bo'lib ketdi!", "Третья — хитрее: min вместо max. min-width — то есть «если окно шестьсот пикселей или шире». Теперь правило спит на телефоне, а на широком компьютере ставит карточки столбиком. Всё наоборот!", "The third is sneakier: min instead of max. min-width means if the window is six hundred pixels or wider. Now the rule sleeps on a phone, and on a wide computer it stacks the cards. Backwards!"),
    done: L3("Demak, shartni doim qavs ichiga olamiz, songa px qo'shamiz, telefon uchun esa max-width yozamiz.", 'Значит, условие пишут в скобках, число — с px, а для телефона нужен max-width.', 'So the condition goes in brackets, the number has px, and a phone needs max-width.'),
    askStart: L3("Qarang: hammasi to'g'ri", 'Смотри: всё правильно', 'Watch: everything is correct'),
    askParens: L3("Qarang: qavssiz", 'Смотри: без скобок', 'Watch: no brackets'),
    askPx: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askMin: L3("Qarang: min-width — teskari", 'Смотри: min-width — наоборот', 'Watch: min-width is backwards'),
    askDone: L3("Qavs · px · max-width", 'Скобки · px · max-width', 'Brackets · px · max-width')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Ana xolos, telefonda kartalar ustma-ust tursin, deb shart yozgandim, ular esa hamon qatorda qolib ketdi! Shartim mana shu maydonda. Unga diqqat bilan qarang-chi, nimasi yetishmayapti? Topsangiz, o'sha yerning o'zida tuzating.",
      'Ой, я написал, чтобы на телефоне карточки стояли друг под другом, а они в ряд! В поле — моё условие. Найди ошибку и исправь.',
      'Oops, I wrote that the cards should stack on a phone, but they’re in a row! My condition is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Maydon bo'shab qoldi. Shartni qaytadan yozing.", 'Впиши условие.', 'Type the condition.'),
      parens: L3("Shart hali ham qavssiz turibdi. Boshiga ochuvchi qavs, oxiriga yopuvchi qavs qo'ying.", 'Условие всё ещё без скобок. Возьми его в открывающую и закрывающую скобки.', 'The condition still has no brackets. Put it inside an opening and a closing bracket.'),
      px: L3("Olti yuzning yonida px yo'q-ku. Usiz brauzer shartni tushunmaydi.", 'После числа нет px.', 'There’s no px after the number.'),
      min: L3("min-width keng oynalarda ishlaydi. Telefondagi tor oynaga esa max-width kerak.", 'Для телефона нужен max-width, а не min-width.', 'A phone needs max-width, not min-width.'),
      bad: L3("Bu shartni brauzer tushunmadi. Uni shu tartibda yozing: qavs, max-width, ikki nuqta, px bilan son va yopuvchi qavs.", 'Браузер не узнал это условие. Скобки, max-width, двоеточие и число с px.', 'The browser didn’t recognize that condition. Brackets, max-width, a colon and a number with px.'),
      other: L3("Chegara o'zgarib qolibdi. Uni olti yuz piksel qoldiring.", 'Граница другая. Пусть останется шестьсот пикселей.', 'The breakpoint is different. Keep it at six hundred pixels.')
    },
    hints: [
      L3("Shartning ikki chetiga bir qarang-chi: boshida va oxirida nima yetishmayapti?", 'Посмотри на края условия.', 'Look at the edges of the condition.'),
      L3("media sharti har doim qavs ichida yoziladi, aks holda brauzer uni o'qimaydi.", 'Условие media всегда пишут в скобках.', 'A media condition is always written in brackets.'),
      L3("Ochuvchi qavs tugmasini bosing, u shartning boshiga borib turadi. Keyin kursorni eng oxiriga qo'ying-da, yopuvchi qavsni bosing. Xohlasangiz, hammasini o'chirib, kod ostidagi namunani ko'chirib yozing.", "Нажми кнопку «(» — скобка встанет в начало. Потом поставь курсор в самый конец и нажми «)». Или сотри всё и перепиши образец под кодом.", "Tap the opening bracket button: it goes to the start. Then put the cursor at the very end and tap the closing one. Or erase everything and copy the example under the code.")
    ],
    ok: L3("Ishladi-ku! Qavslar joyiga kelishi bilan kartalar telefonda ustma-ust terilib oldi.", 'Ура, заработало! На телефоне карточки друг под другом.', 'Hooray, it works! On a phone the cards stack.'),
    ask: L3("Shartni tuzating", 'Исправь условие', 'Fix the condition')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Saytimni telefonda ochdim-u, yana nimadir buzilibdi. Kodda uchta qoida bor, bittasi esa ishlamayapti. Qaysi biri ekan? Sahifaga qarang-da, o'sha qoidani bosing.",
      'Теперь проверь себя. Сайт открыт на телефоне. В коде три правила, но одно не работает. Посмотри на страницу и нажми это правило.',
      'Now check yourself. The site is open on a phone. There are three rules in the code, but one doesn’t work. Look at the page and tap that rule.'),
    say2: L3("Bittasini tuzatdik, lekin telefonda yana bir narsa buzilib qolibdi: kartalar qatorga qaytib ketgan. Endi qaysi qoida ishlamay qoldi, topa olasizmi?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida o'z ishini qilyapti, buni sahifada ko'rib turibmiz. Telefonda kartalarga bir qarang-chi: ustma-ust turibdimi?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      px: L3("Topdingiz! Chegaradagi olti yuzning yonida px yo'q edi, shuning uchun brauzer butun qoidani o'tkazib yuborgan.", 'Есть! У границы не было px.', 'Found it! The breakpoint had no px.'),
      min: L3("Ana, aybdor shu! U yerda min yozilgan edi, telefon uchun esa max kerak.", 'Есть! Для телефона нужен был max, а не min.', 'Found it! A phone needed max, not min.')
    },
    hint1: L3("Kartalarga qarang: telefonda ular ustma-ust turibdimi yoki yo'qmi?", 'Карточки на телефоне стоят друг под другом?', 'Are the cards stacked on the phone?'),
    hint2: {
      px: L3("Kartalar hamon qatorda, demak media qoidasi ishlamayapti. Uning shartidagi sonni tekshirib ko'ring.", 'Карточки в ряд. Проверь число в условии media.', 'The cards are in a row. Check the number in the media condition.'),
      min: L3("Kartalar hamon qatorda. Shartga qarang: unda max-width yozilganmi yoki min-width?", 'Карточки в ряд. В условии max-width или min-width?', 'The cards are in a row. Is the condition max-width or min-width?')
    },
    hint3: {
      px: L3("Buzuq joy media qoidasida: olti yuzdan keyin px yo'q. O'sha qatorni bosing.", 'Ошибка в правиле media: после шестисот нет px. Нажми эту строку.', 'The bug is in the media rule: no px after six hundred. Tap that line.'),
      min: L3("Buzuq joy media qoidasida: u yerda min-width yozilgan. O'sha qatorni bosing.", 'Ошибка в правиле media: min-width. Нажми эту строку.', 'The bug is in the media rule: min-width. Tap that line.')
    },
    ok: L3("Mana, saytim telefonda ham soz! Endi har safar saytni telefonda ham ochib ko'ramiz: buzilish shu yerda tez ko'rinadi.", 'Супер! Обе найдены. Ты проверяешь сайты как настоящий разработчик.', 'Super! Both found. You check sites like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi bilganlaringizni bitta qoidaga yig'amiz! Olti yuz piksel va undan tor oynada banner yashirinsin: buning uchun media qoidasini boshidan oxirigacha o'zingiz yozing. Yozib bo'lgach, banner telefonda yo'qolib, kompyuterda qolayotganini o'zingiz ko'ring.",
      'Теперь напиши правило media целиком. Пусть в окнах шириной шестьсот пикселей и уже баннер прячется. Потом проверь на телефоне и на компьютере.',
      'Now write the whole media rule yourself. Hide the banner in windows six hundred pixels wide and narrower. Then check on the phone and the computer.'),
    msgs: {
      empty: L3("Maydon hali bo'sh. Oldin media so'zi bilan shartni, keyin jingalak qavslar ichiga banner qoidasini yozing.", 'Напиши правило: сначала media и условие, потом в фигурных скобках правило для баннера.', 'Write the rule: first media and the condition, then the banner rule inside curly braces.'),
      start: L3("Bunday qoida kuchukcha belgisi bilan media so'zidan boshlanadi.", 'Правило начинается со знака собачки и слова media.', 'The rule starts with the at sign and the word media.'),
      at: L3("media so'zining oldida kuchukcha belgisi tushib qolibdi.", 'Перед словом media нужен знак собачки.', 'The word media needs the at sign before it.'),
      braces: L3("Jingalak qavslarni sanab ko'ring: media qoidasining o'z qavslari bor, uning ichida esa banner qoidasining qavslari turadi.", 'Проверь фигурные скобки: свои у media и внутри — у правила баннера.', 'Check the curly braces: media’s own, and inside them the banner rule’s.'),
      parens: L3("Shartni oddiy qavs ichiga olish esingizdan chiqibdi.", 'Условие должно быть в скобках.', 'The condition must be in brackets.'),
      px: L3("Sondan keyin px yozilmabdi.", 'После числа нет px.', 'There’s no px after the number.'),
      bad: L3("Brauzer shartni o'qiy olmadi. Qavs ichida max-width, ikki nuqta va px bilan son bo'lishi kerak.", 'Браузер не узнал условие. max-width, двоеточие и число с px.', 'The browser didn’t recognize the condition. max-width, a colon and a number with px.'),
      min: L3("Tor oyna uchun min-width emas, max-width kerak.", 'Для узкого окна нужен max-width.', 'A narrow window needs max-width.'),
      other: L3("Bu chegara vazifadagidan boshqacha. Bizga olti yuz piksel kerak.", 'Граница другая. Нужно шестьсот пикселей.', 'The breakpoint is different. We need six hundred pixels.'),
      sel: L3("Ichkarida banner klassi kerak: oldin nuqta, keyin banner so'zi.", 'Селектор внутри: точка и класс баннера.', 'The selector inside: a dot and the banner’s class.'),
      colon: L3("Ikki nuqta tushib qolibdi-ku: u xususiyat bilan qiymat o'rtasida turadi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      prop: L3("Bu xususiyat narsani yashira olmaydi, buni faqat display qila oladi.", 'Прячет свойство display.', 'The display property does the hiding.'),
      val: L3("Oz qoldi! display to'g'ri, faqat qiymati boshqa: yashirish uchun none kerak.", 'Чтобы спрятать, нужно none.', 'To hide it you need none.')
    },
    hints: [
      L3("Qoida ikki qavatli bo'ladi: tashqarida media va qavs ichidagi shart, uning jingalak qavslari ichida esa banner qoidasi.", 'Сначала media и условие в скобках, потом в фигурных скобках правило для баннера.', 'First media and the condition in brackets, then the banner rule in curly braces.'),
      L3("Shartga max-width olti yuz px yoziladi. Ichkariga esa nuqta banner va display none kerak.", 'Условие: max-width 600px. Внутри: точка banner, display none.', 'Condition: max-width 600px. Inside: dot banner, display none.'),
      L3("Kod ostiga tayyor namunani qo'yib qo'ydim. Uni maydonga harfma-harf ko'chiring-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Zo'r chiqdi! Telefonda banner yashirindi, kompyuterda esa joyida turibdi. Bu media qoidasini boshidan oxirigacha o'zingiz yozdingiz!", 'Отлично! На телефоне баннер спрятан, на компьютере на месте. Правило написано тобой целиком.', 'Great! The banner is hidden on a phone and there on a computer. You wrote the whole rule yourself.'),
    ask: L3("Telefonda bannerni yashiring: @media", 'Спрячь баннер на телефоне: @media', 'Hide the banner on a phone: @media')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Свой сайт', 'Your own site'),
    say: L3("Endi esa o'z saytingizni moslashtirasiz! Chegarani ham, tor oynadagi banner va kartalar rangini ham o'zingiz tanlang. Keyin saytingizni ikkala ekranda ham ko'rib chiqing-da, «Tayyor»ni bosing.",
      'Теперь подстрой свой сайт. Сам выбери границу, цвет баннера и цвет карточек в узком окне. Потом переключи телефон и компьютер и нажми «Готово».',
      'Now make your own site responsive. Choose the breakpoint, the banner color and the card color for a narrow window. Then switch phone and computer and tap “Done”.'),
    msgs: {
      noPx: L3("Chegaraga px qo'shishni unutibsiz.", 'У границы нет px.', 'The breakpoint has no px.'),
      bp: L3("Bunday chegarani brauzer tanimadi: \u2063{w}\u2064. Son yozing-da, yoniga px qo'shing.", 'Браузер не узнал такую границу: \u2063{w}\u2064. Напиши число и px.', 'The browser didn’t recognize this breakpoint: \u2063{w}\u2064. Write a number and px.'),
      range: L3("Chegara kamida uch yuz oltmish piksel, ko'pi bilan ming piksel bo'lsin, aks holda telefon bilan kompyuterning farqini ko'rmaysiz.", 'Напиши границу от трёхсот шестидесяти до тысячи пикселей, иначе разницы не увидишь.', 'Write a breakpoint from three hundred sixty to a thousand pixels, otherwise you won’t see a difference.'),
      color: L3("Bunday rang brauzerga notanish ekan: \u2063{w}\u2064. Rangning nomini yoki kodini yozing.", 'Браузер не узнал такой цвет: \u2063{w}\u2064. Напиши название или код цвета.', 'The browser didn’t recognize this color: \u2063{w}\u2064. Write a color name or code.')
    },
    hints: [
      L3("Uchta maydon bor, har biriga bittadan qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Birinchisiga px bilan chegara yoziladi, qolgan ikkitasiga esa rang nomlari.", 'В первое — граница с px, в следующие — названия цветов.', 'In the first, a breakpoint with px; in the others, color names.'),
      L3("Masalan, olti yuz px, gold va white yozsa bo'ladi. Keyin «Tayyor»ni bosing.", 'Например: 600px, gold и white. Потом нажми «Готово».', 'For example: 600px, gold and white. Then tap “Done”.')
    ],
    ok: L3("Mana bu boshqa gap! Endi saytingiz har qanday ekranga o'zi moslashadi.", 'Ого, классно! Твой сайт теперь подстраивается под любой экран.', 'Wow, great! Your site now adapts to any screen.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Dars tugashiga oz qoldi! Sizga to'rtta gap aytaman, ulardan biri hatto eng tepadagi media qoidamiz haqida. Qani, qaysi biri rost, qaysi biri yo'q?", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3("Fikr", 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Bu fikr nima haqida ekan: foiz haqidami, shart haqidami yoki qoidaning joyi haqidami?", 'О чём фраза: о процентах, об условии или о месте правила?', 'What’s the sentence about: percent, the condition or where the rule goes?'),
    hint2: L3("Esingizdami: foiz oynaga qarab o'zgaradi, media esa faqat shart bajarilsa ishlaydi. Kodli fikrda qoidalarning tartibiga ham bir qarab qo'ying.", 'Вспомни: проценты меняются с окном, media работает только при выполненном условии, побеждает правило, что ниже.', 'Remember: percent changes with the window, media only works when its condition is met, and the lower rule wins.'),
    items: [
      { t: L3("Yuz foizli banner oyna qancha keng bo'lsa, shuncha keng bo'ladi.", 'Баннер шириной сто процентов такой же широкий, как окно.', 'A banner at a hundred percent is as wide as the window.'), right: true,
        why: L3("Ha, shunday: foiz oynaga qarab o'zgaradi, yuz foiz esa doim oynaning butun eni bo'ladi.", 'Верно: проценты меняются вместе с окном.', 'Right: percent changes with the window.') },
      { t: L3("Bu qoida to'rt yuz piksellik oynada ishlaydi.", 'Это правило сработает в окне шириной четыреста пикселей.', 'This rule works in a window four hundred pixels wide.'), right: true, code: 'mq400',
        why: L3("Ha, ishlaydi: to'rt yuz piksel olti yuz pikseldan kichik, shuning uchun shart bajariladi.", 'Верно: четыреста меньше шестисот.', 'Right: four hundred is less than six hundred.') },
      { t: L3("Media ichidagi qoidalar hamma ekranda ishlaydi.", 'Правила внутри media работают на всех экранах.', 'The rules inside media work on every screen.'), right: false,
        why: L3("Yo'q, ular faqat shart bajarilganda ishlaydi, qolgan paytda uxlab yotadi.", 'На самом деле они работают только при выполненном условии.', 'Actually they only work when the condition is met.') },
      { t: L3("Shunday yozilsa, telefonda banner ekranga sig'adi.", 'Если написать так, на телефоне баннер поместится в экран.', 'Written like this, the banner fits the screen on a phone.'), right: false, code: 'order',
        why: L3("Yo'q, banner sig'maydi: pastda yetti yuz piksel turibdi va aynan u yutib chiqadi. Nega shunday ekanini bir daqiqadan keyin bilib olasiz.", 'На самом деле не поместится: оба правила одной силы, а побеждает то, что ниже. А ниже стоит 700px.', 'Actually it won’t fit: both rules are equally strong, and the lower one wins. And the lower one says 700px.') }
    ],
    ok: L3("Qoyil, to'rttasini ham to'g'ri ajratdingiz! Moslashuvchan sayt qanday ishlashini endi yaxshi bilasiz.", 'Всё верно! Ты отлично понимаешь адаптивный сайт.', 'All correct! You understand responsive sites really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Garovimiz esingizdami? Mana o'sha kod: media qoidasi eng tepada turibdi. Qarang-chi, telefonda banner baribir ekrandan chiqib ketdi! Demak, garovni men yutqazdim. Nega shunday bo'ldi? Ikkala qoida ham bannerga bir xil selektor bilan yozilgan, shuning uchun ularning kuchi teng. Kuchi teng bo'lsa, brauzer pastda turganini tanlaydi. Pastda esa yetti yuz piksel turibdi.",
        'Вернёмся к загадке. Помнишь, я написал правило media в самом верху? Смотри: на телефоне баннер всё равно вылез за экран! Я ошибся. Оба правила одной силы, и тогда браузер берёт то, что ниже. А ниже стоит семьсот пикселей.',
        'Back to our riddle. Remember, I put the media rule at the very top? Look: on a phone the banner still sticks out of the screen! I was wrong. Both rules are equally strong, and then the browser takes the lower one. And the lower one says seven hundred pixels.'), k: 'riddle' },
      { text: L3("Endi media qoidasini pastga, oddiy qoidadan keyinga ko'chiramiz. Ana, telefonda endi u yutib chiqdi va banner ekranga sig'ib ketdi!", 'Перенесём правило media вниз — и на телефоне оно победит. Баннер поместился в экран. Вот!', 'Move the media rule to the bottom, and on a phone it wins. The banner fits the screen. There!'), k: 'riddle2' },
      { text: L3("Mana, sizning saytingiz: kompyuterda keng, telefonda ixcham, ranglarini esa o'zingiz tanladingiz!", 'Смотри, это твой адаптивный сайт!', 'Look, this is your responsive site!'), k: 'own' },
      { text: L3("Foiz o'lchamni oynaga moslab beradi.", 'Проценты подстраивают размер под окно.', 'Percent fits the size to the window.'), k: 'pct' },
      { text: L3("media qoidasi faqat shart bajarilganda ishlaydi.", 'Правило media работает, когда выполнено условие.', 'A media rule works when its condition is met.'), k: 'mq' },
      { text: L3("Telefon uchun shartga max-width yozamiz, son esa qavs ichida px bilan turadi.", 'Для телефона — max-width и число с px в скобках.', 'For a phone: max-width and a number with px in brackets.'), k: 'cond' },
      { text: L3("media qoidasini esa doim oddiy qoidalardan keyin, pastga yozamiz.", 'А media пишут после обычных правил, внизу.', 'And media goes after the ordinary rules, at the bottom.'), k: 'order' },
      { text: L3("Endi saytingiz telefonda ham, kompyuterda ham chiroyli ko'rinadi. CSS kursining hamma asosiy mavzularini o'tib bo'ldik! Keyingi darsda esa bir sarguzasht kutyapti: lagerimiz saytining butun dizayni o'chib ketadi, siz esa o'rgangan hamma narsangiz bilan uni qaytarasiz. Ko'rishguncha!",
        'Ура! Теперь твой сайт красивый и на телефоне, и на компьютере. Все главные темы CSS позади. На следующем уроке соберёшь всё вместе и сделаешь свой сайт от начала до конца. До встречи!',
        'Hooray! Now your site looks good on both phone and computer. You’ve covered all the main CSS topics. Next lesson you’ll put it all together and build your own site from start to finish. See you!') }
    ],
    roles: {
      pct: L3("foiz — oynaga qarab", 'проценты — по окну', 'percent — follows the window'),
      mq: L3("@media — shart bilan", '@media — по условию', '@media — with a condition'),
      cond: L3("(max-width: 600px)", '(max-width: 600px)', '(max-width: 600px)'),
      order: L3("@media — pastda", '@media — внизу', '@media — at the bottom')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayPhone: 1, sayPct: 1, sayWide: 1,
  sayTight: 1, sayMedia: 1, sayHide: 1, sayParens: 1, sayPx: 1, sayMin: 1, miss: 1, say2: 1, fine: 1, found: 1,
  items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1, mq: 1, vw: 1 }, rounds: { want: 1, opts: 1, hover: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c16-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c16.css@*/
`;
