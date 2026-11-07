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
    say: L3("Salom! Qarang, kompyuterda saytim chiroyli: tepada banner, pastda uchta karta. Lekin hozir oyna telefondek torayadi. Qarang, nima bo'ladi: banner ekrandan chiqib ketdi, kartalar esa siqilib qoldi. Saytni ko'pchilik telefondan ochadi-ku! «Aylantirish» tugmasini bosing.",
      'Привет! Смотри, на компьютере мой сайт красивый: сверху баннер, ниже три карточки. Но сейчас окно сузится, как у телефона. Смотри, что будет: баннер вылез за экран, а карточки сжались. А ведь сайты чаще всего открывают с телефона! Нажми «Превратить».',
      'Hi! Look, my site looks great on a computer: a banner on top, three cards below. But now the window will get narrow, like a phone. Watch what happens: the banner sticks out of the screen, and the cards get squeezed. And most people open sites on their phones! Tap “Transform”.'),
    magic: L3("Mana! Endi banner ekranga to'liq sig'di, kartalar esa telefonda ustma-ust turibdi. Pastdagi tugmalar bilan kompyuter va telefonni almashtirib ko'ring.", 'Вот! Теперь баннер помещается в экран, а карточки на телефоне стоят друг под другом. Переключай компьютер и телефон кнопками внизу.', 'There! Now the banner fits the screen, and on a phone the cards stack one under another. Switch between computer and phone with the buttons below.'),
    magicP: L3("Buni ikki narsa qildi. Birinchisi foiz, ya'ni oynaning qancha qismi degani. Ikkinchisi media, ya'ni ekran o'lchamiga qarab ishlaydigan qoida degani. Sayt ekranga moslashdi. Buni moslashuvchan sayt deyishadi.", 'Это сделали две вещи. Проценты, то есть «какая часть окна», и media, то есть правило, которое смотрит на размер экрана. Сайт подстроился под экран. Это называют адаптивным сайтом.', 'Two things did it. Percent, meaning what part of the window, and media, meaning a rule that looks at the screen size. The site adapted to the screen. That’s called a responsive site.'),
    done: L3("Bugun saytni har qanday ekranga moslashni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta media qoidasini kodning eng tepasiga yozgan edim, oddiy qoidalardan oldin. Menimcha, joyi muhim emas, baribir ishlaydi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься подстраивать сайт под любой экран. Но сначала загадка. В первый раз я написал правило media в самом верху кода, до обычных правил. По-моему, место не важно, всё равно сработает. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to fit a site to any screen. But first, a riddle. The first time, I put the media rule at the very top of the code, before the ordinary rules. I think the place doesn’t matter, it’ll still work. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Foiz va @media", 'Проценты и @media', 'Percent and @media')
  },
  s2: {
    eyebrow: L3("Piksel yoki foiz", 'Пиксели или проценты', 'Pixels or percent'),
    say: L3("Oldin bannerni ko'ramiz. Hozir uning eni yetti yuz piksel. Kompyuterda u bemalol sig'adi.",
      'Сначала посмотрим на баннер. Сейчас его ширина семьсот пикселей. На компьютере он спокойно помещается.',
      'First, the banner. Right now it’s seven hundred pixels wide. On a computer it fits easily.'),
    sayPhone: L3("Endi oyna telefondek: uch yuz oltmish piksel. Yetti yuz piksel bunga sig'maydi, sayt yon tomonga suriladigan bo'lib qoldi. Pastdagi aylantirish chizig'iga qarang.", 'Теперь окно как у телефона: триста шестьдесят пикселей. Семьсот пикселей сюда не влезают, сайт стал прокручиваться вбок. Посмотри на полосу прокрутки внизу.', 'Now the window is like a phone: three hundred sixty pixels. Seven hundred pixels don’t fit, so the site scrolls sideways. Look at the scrollbar at the bottom.'),
    sayPct: L3("Yuz foiz ya'ni butun en degani. Banner oyna qancha keng bo'lsa, shuncha bo'ladi. Telefonda u ekranga roppa-rosa sig'di.", 'Сто процентов — то есть вся ширина. Баннер такой же широкий, как окно. На телефоне он поместился ровно по экрану.', 'A hundred percent means the whole width. The banner is as wide as the window. On a phone it fits the screen exactly.'),
    sayWide: L3("Kompyuterda ham xuddi shu qoida: banner yana butun en bo'ylab. Bitta qoida ikki ekranga ham mos keldi.", 'И на компьютере то же правило: баннер снова во всю ширину. Одно правило подошло обоим экранам.', 'On a computer, the same rule: the banner is again the full width. One rule fits both screens.'),
    done: L3("Demak, piksel doim bir xil, foiz esa oynaga qarab o'zgaradi.", 'Значит, пиксели всегда одинаковые, а проценты меняются вместе с окном.', 'So pixels always stay the same, and percent changes with the window.'),
    askStart: L3("Qarang: kompyuterda 700px", 'Смотри: 700px на компьютере', 'Watch: 700px on a computer'),
    askPhone: L3("Qarang: telefonda sig'madi", 'Смотри: на телефоне не влез', 'Watch: it doesn’t fit on a phone'),
    askPct: L3("Qarang: 100 foiz — butun en", 'Смотри: 100 процентов — вся ширина', 'Watch: 100 percent is the full width'),
    askWide: L3("Qarang: kompyuterda ham", 'Смотри: и на компьютере', 'Watch: on a computer too'),
    askDone: L3("px — doim bir xil, foiz — oynaga qarab", 'px — всегда одинаково, проценты — по окну', 'px stays the same, percent follows the window')
  },
  s3: {
    eyebrow: L3("Butun en bo'ylab", 'Во всю ширину', 'Full width'),
    say: L3("Endi navbat sizga. Banner har qanday ekranda butun en bo'ylab tursin: eni uchun qiymat yozing. Keyin kompyuter va telefonni almashtirib tekshiring.",
      'Теперь твоя очередь. Пусть баннер на любом экране будет во всю ширину: впиши значение ширины. Потом проверь на компьютере и на телефоне.',
      'Now it’s your turn. Make the banner full width on any screen: type the width value. Then check it on the computer and the phone.'),
    msgs: {
      empty: L3("Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      px: L3("Piksel doim bir xil: telefonda yoki kompyuterda u mos kelmaydi. Foiz kerak.", 'Пиксели всегда одинаковые: на телефоне или на компьютере они не подойдут. Нужны проценты.', 'Pixels always stay the same: they won’t fit on a phone or a computer. We need percent.'),
      noPct: L3("Son bor, lekin foiz belgisi yo'q.", 'Число есть, а знака процента нет.', 'There’s a number but no percent sign.'),
      otherPct: L3("Bu enning bir qismi. Butun en necha foiz?", 'Это только часть ширины. Сколько процентов — вся ширина?', 'That’s only part of the width. What percent is the whole width?'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va foiz belgisini yozing.", 'Браузер не узнал это значение. Напиши число и знак процента.', 'The browser didn’t recognize that value. Write a number and a percent sign.'),
      other: L3("Bu boshqa qiymat. Butun en foizda kerak.", 'Это другое значение. Нужна вся ширина в процентах.', 'That’s a different value. We need the whole width in percent.')
    },
    hints: [
      L3("Butun narsa necha foiz bo'ladi?", 'Сколько процентов — это всё целиком?', 'How many percent is the whole thing?'),
      L3("Butun narsa yuz foiz.", 'Всё целиком — это сто процентов.', 'The whole thing is a hundred percent.'),
      L3("Yuz va foiz belgisini yozing, keyin Tekshirishni bosing.", 'Впиши сто и знак процента, потом нажми «Проверить».', 'Type a hundred and a percent sign, then tap Check.')
    ],
    ok: L3("Zo'r! Banner endi har qanday ekranga sig'adi. Telefon va kompyuterni almashtirib ko'ring.", 'Огонь! Теперь баннер помещается на любом экране. Переключи телефон и компьютер.', 'Awesome! Now the banner fits any screen. Switch between phone and computer.'),
    ask: L3("Banner butun en bo'ylab", 'Баннер во всю ширину', 'The banner at full width')
  },
  s4: {
    eyebrow: L3("px yoki foiz?", 'px или проценты?', 'px or percent?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men vazifani aytaman, siz esa nima kerakligini tanlang: piksel yoki foiz.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, что нужно: пиксели или проценты.',
      'Now check yourself. I’ll say a task, and you pick what’s needed: pixels or percent.'),
    ask: L3("Buning uchun nima kerak?", 'Что для этого нужно?', 'What does this need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Kattalik doim bir xilmi yoki oynaga qarab o'zgaradimi?", 'Размер всегда один и тот же или меняется вместе с окном?', 'Is the size always the same, or does it change with the window?'),
    hint2: L3("Doim bir xil bo'lsa, piksel. Oynaning qismi bo'lsa, foiz.", 'Всегда одинаковый — пиксели. Часть окна — проценты.', 'Always the same: pixels. A part of the window: percent.'),
    items: [
      { t: L3("Logotip har qanday ekranda roppa-rosa qirq piksel.", 'Логотип на любом экране ровно сорок пикселей.', 'The logo is exactly forty pixels on any screen.'), right: 'px', why: L3("Doim bir xil o'lcham, demak piksel.", 'Размер всегда одинаковый, значит, пиксели.', 'The size never changes, so pixels.') },
      { t: L3("Rasm oynaning yarmini egallasin.", 'Картинка должна занимать половину окна.', 'The picture should take half the window.'), right: '%', why: L3("Oynaning yarmi bu ellik foiz.", 'Половина окна — это пятьдесят процентов.', 'Half the window is fifty percent.') },
      { t: L3("Banner har qanday ekranda butun en bo'ylab tursin.", 'Баннер на любом экране во всю ширину.', 'The banner is full width on any screen.'), right: '%', why: L3("Butun en bu yuz foiz.", 'Вся ширина — это сто процентов.', 'The whole width is a hundred percent.') },
      { t: L3("Tugma doim bir xil: yuz yigirma piksel.", 'Кнопка всегда одинаковая: сто двадцать пикселей.', 'The button is always the same: a hundred twenty pixels.'), right: 'px', why: L3("Doim bir xil, demak piksel.", 'Всегда одинаковая, значит, пиксели.', 'Always the same, so pixels.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Piksel va foizni adashtirmaysiz.", 'Всё верно! Ты не путаешь пиксели и проценты.', 'All correct! You don’t mix up pixels and percent.')
  },
  s5: {
    eyebrow: L3("@media", '@media', '@media'),
    say: L3("Endi kartalar. Kompyuterda ular qatorda chiroyli turibdi. Telefonda-chi? Keling, ko'ramiz.",
      'Теперь карточки. На компьютере они красиво стоят в ряд. А на телефоне? Давай посмотрим.',
      'Now the cards. On a computer they look nice in a row. And on a phone? Let’s see.'),
    sayTight: L3("Telefonda kartalar siqilib qoldi, yozuvlar zo'rg'a sig'yapti. Telefonda ularni ustma-ust qo'ysak yaxshi bo'lardi.", 'На телефоне карточки сжались, надписи еле помещаются. На телефоне лучше поставить их друг под другом.', 'On a phone the cards are squeezed, and the labels barely fit. On a phone it’s better to stack them.'),
    sayMedia: L3("Bu media qoidasi. Qavs ichida shart: max-width olti yuz piksel, ya'ni oyna olti yuz pikseldan katta bo'lmasa degani. Ichidagi qoida faqat shunda ishlaydi. Telefonda kartalar ustma-ust turdi.", 'Это правило media. В скобках условие: max-width шестьсот пикселей, то есть «если окно не шире шестисот пикселей». Правило внутри работает только тогда. На телефоне карточки встали друг под другом.', 'This is a media rule. In brackets is a condition: max-width six hundred pixels, meaning if the window is no wider than six hundred pixels. The rule inside works only then. On a phone the cards stacked.'),
    sayWide: L3("Kompyuterda oyna sakkiz yuz piksel, bu olti yuzdan katta. Shart bajarilmadi, qoida uxlab yotibdi, kartalar yana qatorda.", 'На компьютере окно восемьсот пикселей, это больше шестисот. Условие не выполнено, правило спит, карточки снова в ряд.', 'On a computer the window is eight hundred pixels, more than six hundred. The condition isn’t met, the rule sleeps, and the cards are in a row again.'),
    done: L3("Demak, media ichidagi qoidalar faqat shart bajarilganda ishlaydi.", 'Значит, правила внутри media работают, только когда выполнено условие.', 'So the rules inside media only work when the condition is met.'),
    askStart: L3("Qarang: kompyuterda qatorda", 'Смотри: на компьютере в ряд', 'Watch: in a row on a computer'),
    askTight: L3("Qarang: telefonda siqildi", 'Смотри: на телефоне тесно', 'Watch: squeezed on a phone'),
    askMedia: L3("Qarang: @media — telefonda ustma-ust", 'Смотри: @media — на телефоне столбиком', 'Watch: @media stacks them on a phone'),
    askWide: L3("Qarang: kompyuterda qoida uxlaydi", 'Смотри: на компьютере правило спит', 'Watch: on a computer the rule sleeps'),
    askDone: L3("@media — shart bajarilsa ishlaydi", '@media — работает, если выполнено условие', '@media works when the condition is met')
  },
  s6: {
    eyebrow: L3("Chegara", 'Граница', 'The breakpoint'),
    say: L3("Endi siz. Kartalar olti yuz piksel va undan tor oynalarda ustma-ust tursin: shartdagi qiymatni yozing.",
      'Теперь ты. Пусть карточки встают друг под другом в окнах шириной шестьсот пикселей и уже: впиши значение в условие.',
      'Your turn. Make the cards stack in windows six hundred pixels wide and narrower: type the value in the condition.'),
    msgs: {
      empty: L3("Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      noPx: L3("Son bor, lekin px yo'q. Busiz brauzer butun media qoidasini tashlab yuboradi.", 'Число есть, а px нет. Без них браузер выбросит всё правило media.', 'There’s a number but no px. Without it the browser throws the whole media rule away.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing.", 'Браузер не узнал это значение. Напиши число и px.', 'The browser didn’t recognize that value. Write a number and px.'),
      other: L3("Bu boshqa chegara. Olti yuz piksel kerak.", 'Это другая граница. Нужно шестьсот пикселей.', 'That’s a different breakpoint. We need six hundred pixels.')
    },
    hints: [
      L3("Chegara olti yuz piksel.", 'Граница — шестьсот пикселей.', 'The breakpoint is six hundred pixels.'),
      L3("Son va px harflari kerak.", 'Нужны число и буквы px.', 'You need the number and the letters px.'),
      L3("Olti yuz va px deb yozing, keyin Tekshirishni bosing.", 'Впиши шестьсот и px, потом нажми «Проверить».', 'Type six hundred and px, then tap Check.')
    ],
    ok: L3("Barakalla! Telefonda kartalar ustma-ust. Kompyuterni ham tekshirib ko'ring.", 'Молодец! На телефоне карточки друг под другом. Проверь и на компьютере.', 'Well done! On a phone the cards stack. Check the computer too.'),
    ask: L3("Chegara: 600 piksel", 'Граница: 600 пикселей', 'Breakpoint: 600 pixels')
  },
  s7: {
    eyebrow: L3("Ishlaydimi?", 'Сработает?', 'Will it work?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men oyna kengligini va media shartini ko'rsataman, siz esa qoida ishlaydimi yoki uxlaydimi, shuni tanlang.",
      'Теперь проверь себя. Я покажу ширину окна и условие media, а ты выбери: правило сработает или будет спать.',
      'Now check yourself. I’ll show the window width and a media condition, and you pick: will the rule work or sleep?'),
    ask: L3("Bu oynada qoida ishlaydimi?", 'Сработает ли правило в этом окне?', 'Will the rule work in this window?'),
    win: L3("Oyna", 'Окно', 'Window'),
    opts: {
      yes: L3("Ishlaydi", 'Сработает', 'It works'),
      no: L3("Uxlaydi", 'Спит', 'It sleeps')
    },
    hint1: L3("Oyna kengligini shartdagi son bilan solishtiring.", 'Сравни ширину окна с числом в условии.', 'Compare the window width with the number in the condition.'),
    hint2: L3("max-width bo'lsa, oyna shu sondan katta bo'lmaganda ishlaydi. Teng bo'lsa ham ishlaydi.", 'max-width — работает, если окно не шире этого числа. Если равно — тоже работает.', 'max-width works if the window is no wider than that number. Equal counts too.'),
    items: [
      { mq: '(max-width: 600px)', vw: 360, right: 'yes', why: L3("Uch yuz oltmish olti yuzdan kichik, qoida ishlaydi.", 'Триста шестьдесят меньше шестисот, правило работает.', 'Three hundred sixty is less than six hundred, so the rule works.') },
      { mq: '(max-width: 600px)', vw: 800, right: 'no', why: L3("Sakkiz yuz olti yuzdan katta, qoida uxlaydi.", 'Восемьсот больше шестисот, правило спит.', 'Eight hundred is more than six hundred, so the rule sleeps.') },
      { mq: '(max-width: 600px)', vw: 600, right: 'yes', why: L3("Olti yuz roppa-rosa chegarada. Katta emas, demak ishlaydi.", 'Шестьсот — ровно граница. Не больше, значит, работает.', 'Six hundred is exactly the breakpoint. It’s not more, so it works.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Media shartini brauzerdek o'qiysiz.", 'Всё верно! Ты читаешь условие media, как браузер.', 'All correct! You read media conditions like a browser.')
  },
  s8: {
    eyebrow: L3("Telefonda yana nima?", 'Что ещё на телефоне?', 'What else on a phone?'),
    say: L3("Media ichida faqat kartalar emas, istalgan narsani o'zgartirish mumkin. Masalan, telefonda ekran kichik, banner esa ko'p joy egallaydi.",
      'Внутри media можно менять не только карточки, а что угодно. Например, на телефоне экран маленький, а баннер занимает много места.',
      'Inside media you can change anything, not just the cards. For example, a phone screen is small, and the banner takes up a lot of space.'),
    sayHide: L3("Yana bitta media qoidasi: display none, ya'ni yashirish degani. Telefonda banner g'oyib bo'ldi, kartalarga joy ko'paydi.", 'Ещё одно правило media: display none, то есть «спрятать». На телефоне баннер исчез, карточкам стало просторнее.', 'One more media rule: display none, meaning hide. On a phone the banner disappeared, and the cards got more room.'),
    sayWide: L3("Kompyuterda esa banner joyida: u yerda shart bajarilmaydi.", 'А на компьютере баннер на месте: там условие не выполняется.', 'On a computer the banner is still there: the condition isn’t met.'),
    done: L3("Demak, media ichida telefon uchun o'zgarishlar yoziladi: joylashuv, o'lcham, yashirish.", 'Значит, внутри media пишут изменения для телефона: расположение, размеры, что спрятать.', 'So inside media you write the changes for a phone: layout, sizes, what to hide.'),
    askStart: L3("Qarang: telefonda banner", 'Смотри: баннер на телефоне', 'Watch: the banner on a phone'),
    askHide: L3("Qarang: display none — yashirildi", 'Смотри: display none — спрятан', 'Watch: display none hides it'),
    askWide: L3("Qarang: kompyuterda joyida", 'Смотри: на компьютере на месте', 'Watch: still there on a computer'),
    askDone: L3("Telefon uchun o'zgarishlar — @media ichida", 'Изменения для телефона — внутри @media', 'Changes for a phone go inside @media')
  },
  s9: {
    eyebrow: L3("Telefonda yashirish", 'Спрятать на телефоне', 'Hide on a phone'),
    say: L3("Endi siz. Telefonda banner ko'rinmasin: display uchun qiymat yozing.",
      'Теперь ты. Пусть на телефоне баннера не видно: впиши значение для display.',
      'Your turn. Make the banner invisible on a phone: type the value for display.'),
    msgs: {
      empty: L3("Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      shown: L3("Bu qiymat bilan banner ko'rinib turibdi. Yashirish uchun boshqa so'z kerak.", 'С этим значением баннер виден. Чтобы спрятать, нужно другое слово.', 'With that value the banner is still visible. To hide it you need another word.'),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.')
    },
    hints: [
      L3("To'qqizinchi darsdagi yashirish so'zini eslang.", 'Вспомни слово «спрятать» из девятого урока.', 'Remember the word for hiding from lesson nine.'),
      L3("Yashirish none deyiladi.", 'Спрятать — это none.', 'Hiding is none.'),
      L3("none deb yozing va Tekshirishni bosing.", 'Впиши none и нажми «Проверить».', 'Type none and tap Check.')
    ],
    ok: L3("Ajoyib! Telefonda banner yashirindi, kompyuterda esa joyida.", 'Отлично! На телефоне баннер спрятан, а на компьютере на месте.', 'Great! The banner is hidden on a phone and still there on a computer.'),
    ask: L3("Telefonda bannerni yashiring", 'Спрячь баннер на телефоне', 'Hide the banner on a phone')
  },
  s10: {
    eyebrow: L3("@media ichidami?", 'Внутри @media?', 'Inside @media?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men vazifani aytaman, siz esa qoida qayerda yozilishini tanlang: hamma ekranlar uchunmi yoki media ichidami.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, где пишется правило: для всех экранов или внутри media.',
      'Now check yourself. I’ll say a task, and you pick where the rule goes: for all screens or inside media.'),
    ask: L3("Qoida qayerda yoziladi?", 'Где пишется правило?', 'Where does the rule go?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    opts: {
      always: L3("Hamma ekranga", 'Для всех экранов', 'For all screens'),
      media: L3("@media ichida", 'Внутри @media', 'Inside @media')
    },
    hint1: L3("Bu faqat telefonda kerakmi yoki hamma joyda?", 'Это нужно только на телефоне или везде?', 'Is this needed only on a phone, or everywhere?'),
    hint2: L3("Faqat tor ekranda bo'lsa, media ichida. Hamma joyda bo'lsa, oddiy qoida.", 'Только на узком экране — внутри media. Везде — обычное правило.', 'Only on a narrow screen: inside media. Everywhere: an ordinary rule.'),
    items: [
      { t: L3("Telefonda kartalar ustma-ust tursin.", 'На телефоне карточки должны стоять друг под другом.', 'On a phone the cards should stack.'), right: 'media', why: L3("Faqat telefonda, demak media ichida.", 'Только на телефоне — значит, внутри media.', 'Only on a phone, so inside media.') },
      { t: L3("Banner hamma ekranda to'q sariq bo'lsin.", 'Баннер должен быть оранжевым на всех экранах.', 'The banner should be orange on every screen.'), right: 'always', why: L3("Hamma ekranda, demak oddiy qoida.", 'На всех экранах — значит, обычное правило.', 'On every screen, so an ordinary rule.') },
      { t: L3("Telefonda banner yashirinsin.", 'На телефоне баннер должен быть спрятан.', 'On a phone the banner should be hidden.'), right: 'media', why: L3("Faqat telefonda, demak media ichida.", 'Только на телефоне — значит, внутри media.', 'Only on a phone, so inside media.') },
      { t: L3("Kartalar o'rtasida hamma ekranda sakkiz piksel bo'lsin.", 'Между карточками на всех экранах восемь пикселей.', 'There should be eight pixels between the cards on every screen.'), right: 'always', why: L3("Hamma ekranda bir xil, demak oddiy qoida.", 'Везде одинаково — значит, обычное правило.', 'The same everywhere, so an ordinary rule.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Qaysi qoida qayerga yozilishini bilasiz.", 'Всё верно! Ты знаешь, какое правило куда писать.', 'All correct! You know which rule goes where.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    say: L3("Media qoidasida ham xatolar bo'ladi. Keling, uchtasini telefonda ko'ramiz. Hozir hammasi to'g'ri: kartalar ustma-ust.",
      'И в правиле media бывают ошибки. Давай посмотрим на три на телефоне. Сейчас всё правильно: карточки друг под другом.',
      'Media rules have mistakes too. Let’s look at three on a phone. Right now everything is correct: the cards are stacked.'),
    sayParens: L3("Birinchisi: shart qavssiz yozilgan. Brauzer uni tushunmadi va butun media qoidasini tashlab yubordi. Kartalar yana qatorda.", 'Первая: условие без скобок. Браузер его не понял и выбросил всё правило media. Карточки снова в ряд.', 'The first: the condition has no brackets. The browser didn’t understand it and threw the whole media rule away. The cards are in a row again.'),
    sayPx: L3("Ikkinchisi: olti yuz yozilgan, lekin px yo'q. Bu ham xato, brauzer qoidani yana tashlab yubordi.", 'Вторая: написано шестьсот, а px нет. Это тоже ошибка, браузер снова выбросил правило.', 'The second: six hundred is written, but no px. That’s a mistake too, and the browser threw the rule away again.'),
    sayMin: L3("Uchinchisi ayyorroq: max o'rniga min. min-width ya'ni olti yuzdan kam bo'lmasa degani. Endi qoida telefonda uxlaydi, keng kompyuterda esa kartalarni ustma-ust qo'yadi. Teskari bo'lib qoldi!", 'Третья — хитрее: min вместо max. min-width — то есть «если окно не уже шестисот». Теперь правило спит на телефоне, а на широком компьютере ставит карточки столбиком. Всё наоборот!', 'The third is sneakier: min instead of max. min-width means if the window is at least six hundred. Now the rule sleeps on a phone, and on a wide computer it stacks the cards. Backwards!'),
    done: L3("Demak, shart qavs ichida, son px bilan yoziladi, telefon uchun esa max-width kerak.", 'Значит, условие пишут в скобках, число — с px, а для телефона нужен max-width.', 'So the condition goes in brackets, the number has px, and a phone needs max-width.'),
    askStart: L3("Qarang: hammasi to'g'ri", 'Смотри: всё правильно', 'Watch: everything is correct'),
    askParens: L3("Qarang: qavssiz", 'Смотри: без скобок', 'Watch: no brackets'),
    askPx: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askMin: L3("Qarang: min-width — teskari", 'Смотри: min-width — наоборот', 'Watch: min-width is backwards'),
    askDone: L3("Qavs · px · max-width", 'Скобки · px · max-width', 'Brackets · px · max-width')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men telefonda kartalar ustma-ust tursin deb yozdim, lekin ular qatorda turibdi! Maydonda mening shartim turibdi. Xatoni toping va tuzating.",
      'Ой, я написал, чтобы на телефоне карточки стояли друг под другом, а они в ряд! В поле — моё условие. Найди ошибку и исправь.',
      'Oops, I wrote that the cards should stack on a phone, but they’re in a row! My condition is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Shartni yozing.", 'Впиши условие.', 'Type the condition.'),
      parens: L3("Shart hali qavssiz. Uni ochuvchi va yopuvchi qavs ichiga oling.", 'Условие всё ещё без скобок. Возьми его в открывающую и закрывающую скобки.', 'The condition still has no brackets. Put it inside an opening and a closing bracket.'),
      px: L3("Sondan keyin px yo'q.", 'После числа нет px.', 'There’s no px after the number.'),
      min: L3("Telefon uchun max-width kerak, min-width emas.", 'Для телефона нужен max-width, а не min-width.', 'A phone needs max-width, not min-width.'),
      bad: L3("Brauzer bu shartni tanimadi. Qavs, max-width, ikki nuqta va son px bilan.", 'Браузер не узнал это условие. Скобки, max-width, двоеточие и число с px.', 'The browser didn’t recognize that condition. Brackets, max-width, a colon and a number with px.'),
      other: L3("Chegara boshqa. Olti yuz piksel qolsin.", 'Граница другая. Пусть останется шестьсот пикселей.', 'The breakpoint is different. Keep it at six hundred pixels.')
    },
    hints: [
      L3("Shartning chetlariga qarang.", 'Посмотри на края условия.', 'Look at the edges of the condition.'),
      L3("Media sharti doim qavs ichida yoziladi.", 'Условие media всегда пишут в скобках.', 'A media condition is always written in brackets.'),
      L3("Ochuvchi qavs, max-width ikki nuqta olti yuz px, yopuvchi qavs deb yozing va Tekshirishni bosing.", 'Впиши открывающую скобку, max-width двоеточие 600px, закрывающую скобку и нажми «Проверить».', 'Type an opening bracket, max-width colon 600px, a closing bracket, then tap Check.')
    ],
    ok: L3("Ura, ishladi! Telefonda kartalar ustma-ust.", 'Ура, заработало! На телефоне карточки друг под другом.', 'Hooray, it works! On a phone the cards stack.'),
    ask: L3("Shartni tuzating", 'Исправь условие', 'Fix the condition')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Sayt telefonda ochilgan. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va o'sha qoidani bosing.",
      'Теперь проверь себя. Сайт открыт на телефоне. В коде три правила, но одно не работает. Посмотри на страницу и нажми это правило.',
      'Now check yourself. The site is open on a phone. There are three rules in the code, but one doesn’t work. Look at the page and tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      px: L3("Topdingiz! Chegarada px yo'q edi.", 'Есть! У границы не было px.', 'Found it! The breakpoint had no px.'),
      min: L3("Topdingiz! Telefon uchun min emas, max kerak edi.", 'Есть! Для телефона нужен был max, а не min.', 'Found it! A phone needed max, not min.')
    },
    hint1: L3("Kartalar telefonda ustma-ust turibdimi?", 'Карточки на телефоне стоят друг под другом?', 'Are the cards stacked on the phone?'),
    hint2: {
      px: L3("Kartalar qatorda. Media shartidagi sonni tekshiring.", 'Карточки в ряд. Проверь число в условии media.', 'The cards are in a row. Check the number in the media condition.'),
      min: L3("Kartalar qatorda. Shart max-width mi yoki min-width mi?", 'Карточки в ряд. В условии max-width или min-width?', 'The cards are in a row. Is the condition max-width or min-width?')
    },
    hint3: {
      px: L3("Xato media qoidasida: olti yuzdan keyin px yo'q. O'sha qatorni bosing.", 'Ошибка в правиле media: после шестисот нет px. Нажми эту строку.', 'The bug is in the media rule: no px after six hundred. Tap that line.'),
      min: L3("Xato media qoidasida: min-width. O'sha qatorni bosing.", 'Ошибка в правиле media: min-width. Нажми эту строку.', 'The bug is in the media rule: min-width. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz saytlarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь сайты как настоящий разработчик.', 'Super! Both found. You check sites like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi media qoidasini boshidan oxirigacha o'zingiz yozing. Olti yuz piksel va undan tor oynada banner yashirinsin. Keyin telefon va kompyuterni almashtirib tekshiring.",
      'Теперь напиши правило media целиком. Пусть в окнах шириной шестьсот пикселей и уже баннер прячется. Потом проверь на телефоне и на компьютере.',
      'Now write the whole media rule yourself. Hide the banner in windows six hundred pixels wide and narrower. Then check on the phone and the computer.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin media va shart, keyin figurali qavslar ichida banner qoidasi.", 'Напиши правило: сначала media и условие, потом в фигурных скобках правило для баннера.', 'Write the rule: first media and the condition, then the banner rule inside curly braces.'),
      start: L3("Qoida kuchukcha belgisi va media so'zidan boshlanadi.", 'Правило начинается со знака собачки и слова media.', 'The rule starts with the at sign and the word media.'),
      at: L3("media so'zidan oldin kuchukcha belgisi kerak.", 'Перед словом media нужен знак собачки.', 'The word media needs the at sign before it.'),
      braces: L3("Figurali qavslarni tekshiring: media ning o'z qavslari va ichida banner qoidasining qavslari.", 'Проверь фигурные скобки: свои у media и внутри — у правила баннера.', 'Check the curly braces: media’s own, and inside them the banner rule’s.'),
      parens: L3("Shart qavs ichida bo'lishi kerak.", 'Условие должно быть в скобках.', 'The condition must be in brackets.'),
      px: L3("Sondan keyin px yo'q.", 'После числа нет px.', 'There’s no px after the number.'),
      bad: L3("Brauzer shartni tanimadi. max-width, ikki nuqta va son px bilan.", 'Браузер не узнал условие. max-width, двоеточие и число с px.', 'The browser didn’t recognize the condition. max-width, a colon and a number with px.'),
      min: L3("Tor oyna uchun max-width kerak.", 'Для узкого окна нужен max-width.', 'A narrow window needs max-width.'),
      other: L3("Chegara boshqa. Olti yuz piksel kerak.", 'Граница другая. Нужно шестьсот пикселей.', 'The breakpoint is different. We need six hundred pixels.'),
      sel: L3("Ichkaridagi selektor: nuqta va banner klassi.", 'Селектор внутри: точка и класс баннера.', 'The selector inside: a dot and the banner’s class.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      prop: L3("Yashirishni display xususiyati beradi.", 'Прячет свойство display.', 'The display property does the hiding.'),
      val: L3("Yashirish uchun none kerak.", 'Чтобы спрятать, нужно none.', 'To hide it you need none.')
    },
    hints: [
      L3("Oldin media va qavs ichida shart, keyin figurali qavs ichida banner qoidasi.", 'Сначала media и условие в скобках, потом в фигурных скобках правило для баннера.', 'First media and the condition in brackets, then the banner rule in curly braces.'),
      L3("Shart: max-width olti yuz px. Ichida: nuqta banner, display none.", 'Условие: max-width 600px. Внутри: точка banner, display none.', 'Condition: max-width 600px. Inside: dot banner, display none.'),
      L3("Shunday yozing: kuchukcha media, qavs max-width ikki nuqta olti yuz px qavs, figurali qavs, nuqta banner figurali qavs display ikki nuqta none nuqtali vergul, ikkita yopuvchi figurali qavs.", 'Напиши так: собачка media, скобка max-width двоеточие 600px скобка, фигурная скобка, точка banner фигурная скобка display двоеточие none точка с запятой, две закрывающие фигурные скобки.', 'Write it like this: at media, bracket max-width colon 600px bracket, curly brace, dot banner curly brace display colon none semicolon, two closing curly braces.')
    ],
    ok: L3("Ajoyib! Telefonda banner yashirin, kompyuterda joyida. Qoidani o'zingiz yozdingiz.", 'Отлично! На телефоне баннер спрятан, на компьютере на месте. Правило написано тобой целиком.', 'Great! The banner is hidden on a phone and there on a computer. You wrote the whole rule yourself.'),
    ask: L3("Telefonda bannerni yashiring: @media", 'Спрячь баннер на телефоне: @media', 'Hide the banner on a phone: @media')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Свой сайт', 'Your own site'),
    say: L3("Endi o'z saytingizni moslashtiring. Chegarani, tor oynadagi banner rangini va kartalar rangini o'zingiz tanlang. Keyin telefon va kompyuterni almashtirib, «Tayyor»ni bosing.",
      'Теперь подстрой свой сайт. Сам выбери границу, цвет баннера и цвет карточек в узком окне. Потом переключи телефон и компьютер и нажми «Готово».',
      'Now make your own site responsive. Choose the breakpoint, the banner color and the card color for a narrow window. Then switch phone and computer and tap “Done”.'),
    msgs: {
      noPx: L3("Chegarada px yo'q.", 'У границы нет px.', 'The breakpoint has no px.'),
      bp: L3("Brauzer {w} chegarasini tanimadi. Son va px yozing.", 'Браузер не узнал границу {w}. Напиши число и px.', 'The browser didn’t recognize the breakpoint {w}. Write a number and px.'),
      range: L3("Uch yuz oltmishdan ming pikselgacha bo'lgan chegarani yozing, aks holda farqni ko'rmaysiz.", 'Напиши границу от трёхсот шестидесяти до тысячи пикселей, иначе разницы не увидишь.', 'Write a breakpoint from three hundred sixty to a thousand pixels, otherwise you won’t see a difference.'),
      color: L3("Brauzer {w} rangini tanimadi. Rang nomini yoki kodini yozing.", 'Браузер не узнал цвет {w}. Напиши название или код цвета.', 'The browser didn’t recognize the color {w}. Write a color name or code.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Birinchisiga chegara px bilan, keyingilariga rang nomlari.", 'В первое — граница с px, в следующие — названия цветов.', 'In the first, a breakpoint with px; in the others, color names.'),
      L3("Masalan: olti yuz px, gold va white. Keyin «Tayyor»ni bosing.", 'Например: 600px, gold и white. Потом нажми «Готово».', 'For example: 600px, gold and white. Then tap “Done”.')
    ],
    ok: L3("Voy, zo'r! Saytingiz endi har qanday ekranga moslashadi.", 'Ого, классно! Твой сайт теперь подстраивается под любой экран.', 'Wow, great! Your site now adapts to any screen.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor tekshiruv. Men gap aytaman, siz esa to'g'rimi yoki noto'g'rimi, shuni tanlang.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida: foiz, shart yoki qoidaning joyi?", 'О чём фраза: о процентах, об условии или о месте правила?', 'What’s the sentence about: percent, the condition or where the rule goes?'),
    hint2: L3("Esingizdami: foiz oynaga qarab o'zgaradi, media faqat shart bajarilsa ishlaydi, pastdagi qoida g'olib.", 'Вспомни: проценты меняются с окном, media работает только при выполненном условии, побеждает правило, что ниже.', 'Remember: percent changes with the window, media only works when its condition is met, and the lower rule wins.'),
    items: [
      { t: L3("Yuz foizli banner oyna qancha keng bo'lsa, shuncha keng bo'ladi.", 'Баннер шириной сто процентов такой же широкий, как окно.', 'A banner at a hundred percent is as wide as the window.'), right: true,
        why: L3("To'g'ri: foiz oynaga qarab o'zgaradi.", 'Верно: проценты меняются вместе с окном.', 'Right: percent changes with the window.') },
      { t: L3("Bu qoida to'rt yuz piksellik oynada ishlaydi.", 'Это правило сработает в окне шириной четыреста пикселей.', 'This rule works in a window four hundred pixels wide.'), right: true, code: 'mq400',
        why: L3("To'g'ri: to'rt yuz olti yuzdan kichik.", 'Верно: четыреста меньше шестисот.', 'Right: four hundred is less than six hundred.') },
      { t: L3("Media ichidagi qoidalar hamma ekranda ishlaydi.", 'Правила внутри media работают на всех экранах.', 'The rules inside media work on every screen.'), right: false,
        why: L3("Aslida ular faqat shart bajarilganda ishlaydi.", 'На самом деле они работают только при выполненном условии.', 'Actually they only work when the condition is met.') },
      { t: L3("Shunday yozilsa, telefonda banner ekranga sig'adi.", 'Если написать так, на телефоне баннер поместится в экран.', 'Written like this, the banner fits the screen on a phone.'), right: false, code: 'order',
        why: L3("Aslida banner sig'maydi. Nega, hozir ko'ramiz.", 'На самом деле баннер не поместится. Почему — сейчас увидим.', 'Actually the banner won’t fit. We’ll see why in a moment.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz moslashuvchan saytni yaxshi tushunasiz.", 'Всё верно! Ты отлично понимаешь адаптивный сайт.', 'All correct! You understand responsive sites really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men media qoidasini eng tepaga yozgan edim? Qarang: telefonda banner baribir ekrandan chiqib ketdi! Men adashibman. Ikkala qoida bir xil kuchli, bunday paytda brauzer pastdagisini oladi. Pastda esa yetti yuz piksel turibdi.",
        'Вернёмся к загадке. Помнишь, я написал правило media в самом верху? Смотри: на телефоне баннер всё равно вылез за экран! Я ошибся. Оба правила одной силы, и тогда браузер берёт то, что ниже. А ниже стоит семьсот пикселей.',
        'Back to our riddle. Remember, I put the media rule at the very top? Look: on a phone the banner still sticks out of the screen! I was wrong. Both rules are equally strong, and then the browser takes the lower one. And the lower one says seven hundred pixels.'), k: 'riddle' },
      { text: L3("Media qoidasini pastga ko'chirsak, telefonda u g'olib bo'ladi. Banner ekranga sig'di. Mana!", 'Перенесём правило media вниз — и на телефоне оно победит. Баннер поместился в экран. Вот!', 'Move the media rule to the bottom, and on a phone it wins. The banner fits the screen. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning moslashuvchan saytingiz!", 'Смотри, это твой адаптивный сайт!', 'Look, this is your responsive site!'), k: 'own' },
      { text: L3("Foiz o'lchamni oynaga moslaydi.", 'Проценты подстраивают размер под окно.', 'Percent fits the size to the window.'), k: 'pct' },
      { text: L3("Media qoidasi shart bajarilganda ishlaydi.", 'Правило media работает, когда выполнено условие.', 'A media rule works when its condition is met.'), k: 'mq' },
      { text: L3("Telefon uchun max-width va qavs ichidagi son px bilan.", 'Для телефона — max-width и число с px в скобках.', 'For a phone: max-width and a number with px in brackets.'), k: 'cond' },
      { text: L3("Media esa oddiy qoidalardan keyin, pastda yoziladi.", 'А media пишут после обычных правил, внизу.', 'And media goes after the ordinary rules, at the bottom.'), k: 'order' },
      { text: L3("Tabriklayman! Endi saytingiz telefonda ham, kompyuterda ham chiroyli. Siz CSS ning hamma asosiy mavzularini o'tdingiz. Keyingi darsda hammasini birlashtirib, o'z saytingizni boshidan oxirigacha yaratasiz. Ko'rishguncha!",
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
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayPhone: 1, sayPct: 1, sayWide: 1,
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
