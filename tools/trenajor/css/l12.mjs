// =============================================================================
// БАНК ТРЕНАЖЁРА CSS · урок 12 «Позиционирование» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: по умолчанию static; relative сдвигает от своего места, старое место пустое, top толкает вниз, bottom —
// вверх, left — вправо, сдвиг 0px — никакого сдвига; сдвиг без px не работает; absolute выходит из потока (соседи
// занимают место) и встаёт от ближайшего родителя с position (якорь — relative), сдвиги — от краёв якоря;
// fixed держится за окно, даже внутри родителя с relative; опечатка positon.
// Ситуации тестов курса (tools/webtest/css/l12.jsx) не повторяются. Формат — FORMAT.md. Апостроф в узбекском — ASCII «'».
// Словарь урока: position, nisbiy (relative), langar, oqim, belgi, siljish, oyna, sahifani aylantirish.
// =============================================================================

// Основа страниц (невидима ученику).
const PHOTO = '.foto{width:160px;border:2px solid #FDBA74;border-radius:8px}img{display:block}'
  + '.belgi{background:#FA4F28;color:#fff;font:bold 13px Arial;padding:4px 8px;border-radius:6px}';
const photo = (src, cls, text) => `<div class="foto">\n  <img src="${src}">\n  <span class="${cls}">${text}</span>\n</div>`;

export default [
  {
    id: 'css_l12_q01',
    difficulty: 'easy',
    tags: ['static'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: 'Sahifadagi elementlarga position umuman yozilmagan.',
      q: 'Ularda position qaysi qiymatda turibdi?',
      opts: ['static', 'relative', 'absolute', 'fixed'],
      why: "position yozilmasa, u odatda static: element oqimda navbat bilan turadi va top, left kabi siljishlarni eshitmaydi.",
    },
    ru: {
      ctx: 'Элементам на странице position вообще не написан.',
      q: 'Какое значение position у них сейчас?',
      opts: ['static', 'relative', 'absolute', 'fixed'],
      why: 'Если position не написан, он по умолчанию static: элемент стоит в потоке по очереди и не слушает сдвиги вроде top и left.',
    },
    en: {
      ctx: 'The elements on the page have no position written at all.',
      q: 'Which position value do they have now?',
      opts: ['static', 'relative', 'absolute', 'fixed'],
      why: 'Without position, it’s static by default: the element stands in the flow in turn and ignores offsets like top and left.',
    },
  },
  {
    id: 'css_l12_q02',
    difficulty: 'easy',
    tags: ['fixed'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Uzun sahifada «Chat» tugmasiga position: fixed va pastki o'ng burchak berilgan.",
      q: 'Sahifani pastga aylantirsangiz, tugma nima qiladi?',
      opts: ['Oyna burchagida qoladi', 'Sahifa bilan tepaga ketadi', 'Sahifa boshiga sakraydi', "Ko'rinmay qoladi"],
      why: "fixed tugma sahifaga emas, brauzer oynasiga yopishadi. Sahifa aylansa ham, u oynaning o'sha burchagida turaveradi.",
    },
    ru: {
      ctx: 'На длинной странице кнопке «Чат» дали position: fixed и правый нижний угол.',
      q: 'Что сделает кнопка, если прокрутить страницу вниз?',
      opts: ['Останется в углу окна', 'Уедет вверх со страницей', 'Прыгнет в начало страницы', 'Пропадёт из виду'],
      why: 'Кнопка с fixed держится не за страницу, а за окно браузера. Страница прокручивается, а кнопка стоит в том же углу окна.',
    },
    en: {
      ctx: 'On a long page, the “Chat” button got position: fixed and the bottom right corner.',
      q: 'What will the button do if you scroll the page down?',
      opts: ['Stay in the window’s corner', 'Go up with the page', 'Jump to the page’s start', 'Disappear from view'],
      why: 'A fixed button holds on to the browser window, not the page. The page scrolls, but the button stays in the same corner of the window.',
    },
  },
  {
    id: 'css_l12_q03',
    difficulty: 'easy',
    tags: ['relative'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Uchta tort kartochkasi ketma-ket turibdi. Ikkinchisiga relative va top: 30px berildi.",
      q: "Ikkinchi kartochkaning eski joyi nima bo'ladi?",
      opts: ["Bo'sh qoladi", 'Uni uchinchisi egallaydi', 'Uni birinchisi egallaydi', 'U yerda nusxasi qoladi'],
      why: "relative element o'z joyidan siljiydi, lekin eski joyi uni kutib bo'sh turadi. Qo'shnilar joyidan qimirlamaydi.",
    },
    ru: {
      ctx: 'Три карточки тортов стоят друг за другом. Второй дали relative и top: 30px.',
      q: 'Что будет со старым местом второй карточки?',
      opts: ['Останется пустым', 'Его займёт третья карточка', 'Его займёт первая карточка', 'Там останется её копия'],
      why: 'relative сдвигает элемент от его места, но старое место остаётся пустым и ждёт его. Соседи не двигаются.',
    },
    en: {
      ctx: 'Three cake cards stand one after another. The second one got relative and top: 30px.',
      q: 'What happens to the second card’s old spot?',
      opts: ['It stays empty', 'The third card takes it', 'The first card takes it', 'A copy of it stays there'],
      why: 'relative moves the element from its spot, but the old spot stays empty and waits for it. The neighbors don’t move.',
    },
  },
  {
    id: 'css_l12_q04',
    difficulty: 'easy',
    tags: ['relative', 'top'],
    mono: false,
    sort: false,
    vis: { css: '.samolyot {\n  position: relative;\n  top: 30px;\n}' },
    uz: {
      ctx: 'Samolyot rasmi sahifada turibdi.',
      q: 'Samolyot qaysi tomonga siljiydi?',
      opts: ['30px pastga', '30px tepaga', "30px o'ngga", 'Hech qayerga: absolute kerak'],
      why: "top — tepadan masofa: samolyot o'z tepasidan 30px uzoqlashadi, ya'ni pastga tushadi.",
    },
    ru: {
      ctx: 'На странице стоит картинка самолёта.',
      q: 'Куда сдвинется самолёт?',
      opts: ['Вниз на 30px', 'Вверх на 30px', 'Вправо на 30px', 'Никуда: нужен absolute'],
      why: 'top — расстояние сверху: самолёт отодвигается от своего верха на 30px, то есть опускается.',
    },
    en: {
      ctx: 'A picture of a plane is on the page.',
      q: 'Which way will the plane move?',
      opts: ['30px down', '30px up', '30px to the right', 'Nowhere: it needs absolute'],
      why: 'top is the distance from the top: the plane moves 30px away from its top edge, which means it goes down.',
    },
  },
  {
    id: 'css_l12_q05',
    difficulty: 'medium',
    tags: ['absolute'],
    mono: false,
    sort: false,
    vis: { css: '.belgi {\n  position: absolute;\n}' },
    uz: {
      ctx: "Qatorda oldin «CHEGIRMA» belgisi, keyin pitsaning nomi turibdi. Belgiga absolute berildi.",
      q: 'Pitsaning nomi nima qiladi?',
      opts: ['Belgining joyini egallaydi', "Joyida qoladi, oldida bo'shliq", "Yangi qatorga tushib qoladi", "Belgi bilan birga o'ngga suriladi"],
      why: "absolute elementni oqimdan chiqaradi: qo'shnilar uni endi ko'rmaydi. Shuning uchun nom darrov belgining joyiga suriladi.",
    },
    ru: {
      ctx: 'В строке сначала метка «СКИДКА», а за ней название пиццы. Метке дали absolute.',
      q: 'Что сделает название пиццы?',
      opts: ['Займёт место метки', 'Останется на месте, перед ним дыра', 'Перейдёт на новую строку', 'Сдвинется вправо вместе с меткой'],
      why: 'absolute выводит элемент из потока: соседи его больше не видят. Поэтому название сразу сдвигается на место метки.',
    },
    en: {
      ctx: 'The line has a “SALE” label first, then the pizza’s name. The label got absolute.',
      q: 'What will the pizza’s name do?',
      opts: ['Take the label’s place', 'Stay put, with a hole before it', 'Drop to a new line', 'Move right together with the label'],
      why: 'absolute takes the element out of the flow: the neighbors don’t see it anymore. So the name moves into the label’s place at once.',
    },
  },
  {
    id: 'css_l12_q06',
    difficulty: 'medium',
    tags: ['relative', 'bottom'],
    mono: true,
    sort: false,
    vis: {
      css: '.ikki {\n  position: relative;\n  ___\n}',
      html: '<div class="start">\n  <div class="r">🚀</div>\n  <div class="r ikki">🚀</div>\n  <div class="r">🚀</div>\n</div>',
      base: '.start{display:flex;gap:12px;padding:28px 8px 0;background:#EEF2FF;border-bottom:5px solid #6366F1}'
        + '.r{width:60px;height:60px;line-height:60px;text-align:center;font-size:30px;background:#C7D2FE;border-radius:10px 10px 0 0}'
        + '.ikki{background:#FDBA74}',
      goal: '.ikki { position: relative; bottom: 20px; }',
    },
    uz: {
      ctx: "O'rtadagi raketa qo'shnilaridan 20px balandroq tursin, rasmdagidek.",
      q: "Bo'sh joyga nima yoziladi?",
      opts: ['bottom: 20px;', 'top: 20px;', 'up: 20px;', 'bottom: 20;'],
      why: "bottom — pastdan masofa: raketa pastidan 20px uzoqlashib, tepaga ko'tariladi. top pastga tushiradi, up degan xususiyat yo'q, son yoniga esa px kerak.",
    },
    ru: {
      ctx: 'Средняя ракета должна стоять на 20px выше соседей, как на картинке.',
      q: 'Что написать на пустое место?',
      opts: ['bottom: 20px;', 'top: 20px;', 'up: 20px;', 'bottom: 20;'],
      why: 'bottom — расстояние снизу: ракета отодвигается от своего низа на 20px и поднимается. top опустит её, свойства up нет, а к числу нужен px.',
    },
    en: {
      ctx: 'The middle rocket should stand 20px higher than its neighbors, like in the picture.',
      q: 'What goes in the empty spot?',
      opts: ['bottom: 20px;', 'top: 20px;', 'up: 20px;', 'bottom: 20;'],
      why: 'bottom is the distance from the bottom: the rocket moves 20px away from its bottom edge and rises. top would lower it, there’s no up property, and the number needs px.',
    },
  },
  {
    id: 'css_l12_q07',
    difficulty: 'medium',
    tags: ['top', 'px'],
    mono: false,
    sort: false,
    vis: { css: '.bulut {\n  position: relative;\n  top: 40;\n}' },
    uz: {
      ctx: "Bulut 40 piksel pastga tushishi kerak edi, lekin joyidan qimirlamadi.",
      q: 'Nega bulut siljimadi?',
      opts: ["Son yonida px yo'q", 'top faqat absolute bilan ishlaydi', 'top emas, bottom kerak edi', 'relative elementni siljitmaydi'],
      why: "Siljish uchun son va birlik kerak: 40px. Birliksiz 40 ni brauzer tanimaydi va bu qatorni tashlab yuboradi.",
    },
    ru: {
      ctx: 'Облако должно было опуститься на 40 пикселей, но не сдвинулось.',
      q: 'Почему облако не сдвинулось?',
      opts: ['У числа нет px', 'top работает только с absolute', 'Нужен bottom, а не top', 'relative не сдвигает элементы'],
      why: 'Для сдвига нужны число и единица: 40px. Голое число 40 браузер не понимает и выбрасывает эту строку.',
    },
    en: {
      ctx: 'The cloud should have gone 40 pixels down, but it didn’t move.',
      q: 'Why didn’t the cloud move?',
      opts: ['The number has no px', 'top only works with absolute', 'It needs bottom, not top', 'relative doesn’t move elements'],
      why: 'An offset needs a number and a unit: 40px. The browser doesn’t understand a bare 40 and throws the line away.',
    },
  },
  {
    id: 'css_l12_q08',
    difficulty: 'medium',
    tags: ['absolute', 'anchor'],
    mono: false,
    sort: false,
    vis: { css: '.xarita {\n  position: relative;\n}\n.xazina {\n  position: absolute;\n  top: 40px;\n  left: 100px;\n}' },
    uz: {
      ctx: 'Xazina belgisi xarita ichida turibdi.',
      q: 'Belgi qayerda turadi?',
      opts: ['Xarita tepasidan 40px, chap chetidan 100px', "O'z joyidan 40px pastda, 100px o'ngda", 'Sahifa tepasidan 40px, chap chetidan 100px', "Xarita pastidan 40px, o'ng chetidan 100px"],
      why: "absolute langar otaga nisbatan turadi. Xaritada relative bor, demak u langar: top va left xaritaning tepasidan va chap chetidan sanaladi.",
    },
    ru: {
      ctx: 'Метка клада лежит внутри карты.',
      q: 'Где встанет метка?',
      opts: ['40px от верха карты, 100px от её левого края', '40px ниже своего места, 100px правее', '40px от верха страницы, 100px от края', '40px от низа карты, 100px от правого края'],
      why: 'absolute встаёт от родителя-якоря. У карты есть relative, значит, она якорь: top и left считаются от верха и левого края карты.',
    },
    en: {
      ctx: 'The treasure marker sits inside the map.',
      q: 'Where will the marker go?',
      opts: ['40px from the map’s top, 100px from its left', '40px below its own spot, 100px to the right', '40px from the page’s top, 100px from its edge', '40px from the map’s bottom, 100px from its right'],
      why: 'absolute is placed from its anchor parent. The map has relative, so it’s the anchor: top and left count from the map’s top and left edges.',
    },
  },
  {
    id: 'css_l12_q09',
    difficulty: 'medium',
    tags: ['fixed', 'relative'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "«Yuqoriga» tugmasida position: fixed, bottom va right bor. U relative berilgan blok ichida turibdi.",
      q: 'bottom va right nimadan sanaladi?',
      opts: ['Brauzer oynasidan', 'relative berilgan blokdan', 'Sahifaning boshidan', 'Tugmaning eski joyidan'],
      why: "fixed doim brauzer oynasiga yopishadi, ota qutiga qaramaydi. relative bilan langar faqat absolute uchun kerak.",
    },
    ru: {
      ctx: 'У кнопки «Наверх» position: fixed, bottom и right. Она лежит внутри блока с relative.',
      q: 'От чего считаются bottom и right?',
      opts: ['От окна браузера', 'От блока с relative', 'От начала страницы', 'От её прежнего места'],
      why: 'fixed всегда держится за окно браузера и на родителя не смотрит. Якорь с relative нужен только для absolute.',
    },
    en: {
      ctx: 'The “Up” button has position: fixed, bottom and right. It sits inside a block with relative.',
      q: 'What are bottom and right counted from?',
      opts: ['The browser window', 'The block with relative', 'The start of the page', 'Its old spot'],
      why: 'fixed always holds on to the browser window and ignores the parent. A relative anchor is only needed for absolute.',
    },
  },
  {
    id: 'css_l12_q10',
    difficulty: 'hard',
    tags: ['absolute', 'anchor'],
    mono: false,
    sort: false,
    vis: { css: '.zal { position: relative; }\n.afisha { position: relative; }\n.belgi {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n}' },
    uz: {
      ctx: 'Belgi afisha ichida, afisha esa kinozal ichida. Ikkalasida ham relative bor.',
      q: 'Belgi kimning burchagiga boradi?',
      opts: ['Afishaning burchagiga', 'Kinozalning burchagiga', 'Sahifaning burchagiga', 'Brauzer oynasining burchagiga'],
      why: "absolute eng yaqin, position berilgan otani qidiradi. Belgini to'g'ridan-to'g'ri afisha o'rab turibdi, u zaldan yaqinroq, demak langar — afisha.",
    },
    ru: {
      ctx: 'Метка лежит в афише, а афиша — в кинозале. И у афиши, и у зала есть relative.',
      q: 'В чей угол встанет метка?',
      opts: ['В угол афиши', 'В угол кинозала', 'В угол страницы', 'В угол окна браузера'],
      why: 'absolute ищет ближайшего родителя с position. Метку прямо обнимает афиша, она ближе зала — значит, якорь — афиша.',
    },
    en: {
      ctx: 'The label is inside the poster, and the poster is inside the cinema hall. Both have relative.',
      q: 'Whose corner will the label go to?',
      opts: ['The poster’s corner', 'The hall’s corner', 'The page’s corner', 'The browser window’s corner'],
      why: 'absolute looks for the nearest parent with position. The poster wraps the label directly and is closer than the hall, so the poster is the anchor.',
    },
  },
  {
    id: 'css_l12_q11',
    difficulty: 'hard',
    tags: ['relative', 'absolute'],
    mono: false,
    sort: false,
    vis: { css: '.belgi {\n  position: relative;\n  top: 0px;\n  right: 0px;\n}' },
    uz: {
      ctx: "Kodi belgini kartochka burchagiga qo'ymoqchi edi, lekin absolute o'rniga relative yozdi.",
      q: 'Belgi qayerda turadi?',
      opts: ["O'z joyida, matn qatorida", "Kartochkaning o'ng yuqori burchagida", "Sahifaning o'ng yuqori burchagida", "Oynaning o'ng yuqori burchagida"],
      why: "relative elementni o'z joyidan siljitadi. 0px siljish — umuman siljimaslik, shuning uchun belgi turgan joyida qoladi. Burchak uchun absolute kerak.",
    },
    ru: {
      ctx: 'Коди хотел поставить метку в угол карточки, но написал relative вместо absolute.',
      q: 'Где окажется метка?',
      opts: ['На своём месте, в строке', 'В правом верхнем углу карточки', 'В правом верхнем углу страницы', 'В правом верхнем углу окна'],
      why: 'relative сдвигает элемент от его собственного места. Сдвиг 0px — это никакого сдвига, метка стоит, где стояла. Для угла нужен absolute.',
    },
    en: {
      ctx: 'Kodi wanted to put the label in the card’s corner, but wrote relative instead of absolute.',
      q: 'Where will the label be?',
      opts: ['In its own spot, in the line', 'In the card’s top right corner', 'In the page’s top right corner', 'In the window’s top right corner'],
      why: 'relative moves an element from its own spot. A 0px offset means no move at all, so the label stays where it was. A corner needs absolute.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'css_l12_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['absolute'],
    mono: true,
    answer: ['absolute'],
    vis: {
      css: '.foto { position: relative; }\n.belgi {\n  position: ___;\n  top: 0px;\n  left: 0px;\n}',
      html: {
        uz: photo('pitsa.png', 'belgi', 'AKSIYA'),
        ru: photo('pitsa.png', 'belgi', 'АКЦИЯ'),
        en: photo('pitsa.png', 'belgi', 'SALE'),
      },
      base: PHOTO,
    },
    uz: {
      ctx: "«AKSIYA» belgisi pitsa rasmining ostida turibdi. U rasmning chap yuqori burchagiga chiqsin.",
      q: 'position uchun qiymatni yozing.',
      why: "absolute belgini oqimdan chiqarib, langar otaning burchagiga qo'yadi. .foto qutisida relative bor, demak belgi rasmning burchagiga boradi.",
    },
    ru: {
      ctx: 'Метка «АКЦИЯ» стоит под картинкой пиццы. Она должна выйти в левый верхний угол картинки.',
      q: 'Впиши значение для position.',
      why: 'absolute выводит метку из потока и ставит в угол родителя-якоря. У коробки .foto есть relative, значит, метка встанет в угол картинки.',
    },
    en: {
      ctx: 'The “SALE” label sits under the pizza picture. It should move to the picture’s top left corner.',
      q: 'Type the value for position.',
      why: 'absolute takes the label out of the flow and puts it in the anchor parent’s corner. The .foto box has relative, so the label goes to the picture’s corner.',
    },
  },
  {
    id: 'css_l12_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['absolute', 'bottom'],
    mono: true,
    answer: ['bottom'],
    vis: {
      css: '.foto { position: relative; }\n.narx {\n  position: absolute;\n  ___: 0px;\n  right: 0px;\n}',
      html: {
        uz: photo('tort.png', 'belgi narx', "25 000 so'm"),
        ru: photo('tort.png', 'belgi narx', '25 000 сум'),
        en: photo('tort.png', 'belgi narx', '25,000 sum'),
      },
      base: PHOTO,
      goal: '.foto { position: relative; }\n.narx { position: absolute; bottom: 0px; right: 0px; }',
    },
    uz: {
      ctx: "Tortning narxi rasmning o'ng pastki burchagida tursin, rasmdagidek.",
      q: "Bo'sh joyga xususiyat nomini yozing.",
      why: "bottom — pastdan masofa: bottom: 0px narxni langar otaning pastki chetiga yopishtiradi, right: 0px esa o'ng chetiga.",
    },
    ru: {
      ctx: 'Цена торта должна стоять в правом нижнем углу картинки, как на рисунке.',
      q: 'Впиши на пустое место имя свойства.',
      why: 'bottom — расстояние снизу: bottom: 0px прижимает цену к нижнему краю якоря, а right: 0px — к правому.',
    },
    en: {
      ctx: 'The cake’s price should sit in the picture’s bottom right corner, like in the image.',
      q: 'Type the property name in the empty spot.',
      why: 'bottom is the distance from the bottom: bottom: 0px presses the price to the anchor’s bottom edge, and right: 0px to its right edge.',
    },
  },
  {
    id: 'css_l12_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['top', 'px'],
    mono: true,
    answer: ['25px'],
    vis: { css: '.yulduz {\n  position: relative;\n  top: ___;\n}' },
    uz: {
      ctx: "Archadagi yulduz juda baland osilgan. U 25 piksel pastga tushsin.",
      q: 'top uchun qiymatni yozing: son va birlik.',
      why: "top — tepadan masofa: 25px yozilsa, yulduz o'z tepasidan 25 piksel uzoqlashib, pastga tushadi. Son va px orasida bo'sh joy bo'lmaydi.",
    },
    ru: {
      ctx: 'Звезда на ёлке висит слишком высоко. Она должна опуститься на 25 пикселей.',
      q: 'Впиши значение для top: число и единицу.',
      why: 'top — расстояние сверху: с 25px звезда отодвигается от своего верха на 25 пикселей и опускается. Между числом и px пробела нет.',
    },
    en: {
      ctx: 'The star on the tree hangs too high. It should go down 25 pixels.',
      q: 'Type the value for top: a number and a unit.',
      why: 'top is the distance from the top: with 25px the star moves 25 pixels away from its top edge and goes down. There’s no space between the number and px.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'css_l12_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['relative', 'anchor'],
    pieces: ['position', ': ', 'relative', ';'],
    extra: ['absolute', 'positon'],
    vis: { css: '.xarita {\n  ___\n}' },
    uz: {
      ctx: "Xazina belgilari sahifa burchagiga uchib ketdi. Xarita ularning langari bo'lsin va o'zi joyida qolsin.",
      q: "Bo'laklarni tartib bilan bosib, xarita qoidasini yig'ing",
      why: "Langar bo'lish uchun otaga position: relative yoziladi: xarita joyida qoladi, belgilar esa uning burchaklariga qaraydi. absolute xaritaning o'zini oqimdan chiqarardi.",
    },
    ru: {
      ctx: 'Метки клада улетели в угол страницы. Карта должна стать их якорем и остаться на месте.',
      q: 'Нажимай кусочки по порядку и собери правило карты',
      why: 'Чтобы родитель стал якорем, ему пишут position: relative: карта остаётся на месте, а метки встают от её углов. absolute вывел бы саму карту из потока.',
    },
    en: {
      ctx: 'The treasure markers flew to the page’s corner. The map should be their anchor and stay in place.',
      q: 'Tap the pieces in order to build the map’s rule',
      why: 'To make a parent an anchor, it gets position: relative: the map stays put, and the markers are placed from its corners. absolute would take the map itself out of the flow.',
    },
  },
  {
    id: 'css_l12_q16',
    type: 'build',
    difficulty: 'medium',
    tags: ['relative', 'left'],
    pieces: ['left', ': ', '50px', ';'],
    extra: ['right', '50 px'],
    vis: { css: '.raketa {\n  position: relative;\n  ___\n}' },
    uz: {
      ctx: "Raketa o'z joyidan 50 piksel o'ngga siljisin.",
      q: "Bo'laklarni tartib bilan bosib, siljishni yig'ing",
      why: "left — chapdan masofa: raketa o'z chap chetidan uzoqlashadi, ya'ni o'ngga siljiydi. right teskari tomonga suradi, «50 px» ni esa brauzer tanimaydi.",
    },
    ru: {
      ctx: 'Ракета должна сдвинуться от своего места на 50 пикселей вправо.',
      q: 'Нажимай кусочки по порядку и собери сдвиг',
      why: 'left — расстояние слева: ракета отодвигается от своего левого края, то есть едет вправо. right двигает в другую сторону, а «50 px» с пробелом браузер не понимает.',
    },
    en: {
      ctx: 'The rocket should move 50 pixels to the right of its spot.',
      q: 'Tap the pieces in order to build the offset',
      why: 'left is the distance from the left: the rocket moves away from its left edge, which means to the right. right pushes the other way, and the browser doesn’t understand “50 px” with a space.',
    },
  },
  {
    id: 'css_l12_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['position'],
    line: 3,
    vis: {
      css: '.foto { position: relative; }\n.belgi {\n  positon: absolute;\n  top: 0px;\n  right: 0px;\n}',
      html: {
        uz: photo('robot.png', 'belgi', 'YANGI'),
        ru: photo('robot.png', 'belgi', 'НОВИНКА'),
        en: photo('robot.png', 'belgi', 'NEW'),
      },
      base: PHOTO,
    },
    uz: {
      ctx: "O'yinchoqlar do'koni: «YANGI» belgisi robot rasmining burchagida turishi kerak, lekin rasm ostida qoldi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "3-qatorda position so'zidan i harfi tushib qolgan. Brauzer positon xususiyatini tanimaydi, belgi oqimda qoladi va top bilan right ishlamaydi.",
    },
    ru: {
      ctx: 'Магазин игрушек: метка «НОВИНКА» должна стоять в углу картинки робота, а осталась под ней.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 3 у слова position пропала буква i. Свойства positon браузер не знает, метка остаётся в потоке, и top с right не работают.',
    },
    en: {
      ctx: 'A toy shop: the “NEW” label should sit in the robot picture’s corner, but it stayed under it.',
      q: 'Which line has the mistake? Tap that line',
      why: 'On line 3 the word position lost its i. The browser doesn’t know a positon property, so the label stays in the flow and top and right don’t work.',
    },
  },
  {
    id: 'css_l12_q18',
    type: 'tap',
    difficulty: 'medium',
    tags: ['absolute', 'bottom'],
    answer: 'br',
    vis: {
      css: '.maydon { position: relative; }\n.burchak {\n  position: absolute;\n  bottom: 10px;\n  right: 10px;\n}',
      html: '<div class="maydon">\n  <div class="t t1" data-t="tl">⚽</div>\n  <div class="t t2" data-t="tr">⚽</div>\n'
        + '  <div class="t t3" data-t="bl">⚽</div>\n  <div class="t burchak" data-t="br">⚽</div>\n</div>',
      base: '.maydon{height:150px;background:#BBF7D0;border:3px solid #fff;outline:3px solid #16A34A;border-radius:8px}'
        + '.t{position:absolute;width:38px;height:38px;line-height:38px;text-align:center;font-size:26px}'
        + '.t1{top:10px;left:10px}.t2{top:10px;right:10px}.t3{bottom:10px;left:10px}',
    },
    uz: {
      ctx: "Futbol maydonida to'rtta to'p, har biri bitta burchakda. Shu qoida ulardan biriga yozilgan.",
      q: "Qoida qaysi to'pni joylashtirdi? Uni bosing",
      why: "bottom: 10px to'pni maydonning pastki chetidan 10px yuqoriga, right: 10px esa o'ng chetidan 10px chapga qo'yadi. Bu o'ng pastki burchak.",
    },
    ru: {
      ctx: 'На футбольном поле четыре мяча, каждый в своём углу. Это правило написано одному из них.',
      q: 'Какой мяч поставило это правило? Нажми на него',
      why: 'bottom: 10px ставит мяч в 10px от нижнего края поля, а right: 10px — в 10px от правого. Это правый нижний угол.',
    },
    en: {
      ctx: 'A football field has four balls, one in each corner. This rule is written for one of them.',
      q: 'Which ball did this rule place? Tap it',
      why: 'bottom: 10px puts the ball 10px from the field’s bottom edge, and right: 10px puts it 10px from the right edge. That’s the bottom right corner.',
    },
  },
];
