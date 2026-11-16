// =============================================================================
// ВВОДНЫЙ УРОК ВСЕГО КУРСА · «Из чего сделан сайт» (тестовый, вне списка курсов; 16.11.2026).
// Заказчик: «пеееервый урок всего курса, его ученик должен пройти за 5–6 минут… тут не должно быть ни единого кода».
// Облик — эталон «Редактор» (стол в точку, Chrome, оранжевый CoddyCamp, Коди с голосом), сайт в окне — набор модуля
// «ИИ». Дети 11–14, проходят сами.
// Сборка: node tools/kirish/build.mjs → lessons/test/33-kirish-sayt.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ВВОДНЫЙ УРОК · «Из чего сделан сайт» =====
//
// ЗАМЫСЕЛ. Кода нет ни строчки: ученик видит настоящий сайт и разбирает его на понятные части. Сайт «раздевается»
// (без CSS остаётся голый текст) — это скелет, HTML: что есть на странице. Ученик сам «одевает» сайт по частям —
// это одежда, CSS: как выглядит. Потом ученик играет с этим: переодевает сайт, чинит сломанный, делает свой дизайн.
// Загадка: Коди думал, что сайты — волшебство, которое умеют только гении. Разгадка в выводе: любой сайт — из
// понятных частей, и каждой учатся по шагам.
//
// ДУГА (8 экранов, ~5–6 минут; правило «минимум 17» здесь нарочно не действует — вводный урок вне списка):
//   s1 крючок (ученик заглядывает внутрь — одежда сайта осыпается) · s2 показ: рентген (части скелета) ·
//   s3 сам: гардероб — одевает сайт по частям · s4 сам: мозг (JS) — мёртвая кнопка оживает · s5 сам: смена наряда (один скелет,
//   четыре одежды) · s6 сломанный сайт: что сломалось — скелет, одежда или мозг (сайт чинится, мёртвую кнопку можно
//   нажать) · s8 свой дизайн: цвет, шрифт, углы и что делает кнопка · fin вывод: сайт ученика, его кнопка работает.
// О будущем (карта курса, следующие уроки, «научимся потом») не говорим — заказчик, 16.11.2026.
//
// СИСТЕМА СЛОВ: skelet — скелет (HTML), kiyim — одежда (CSS), rentgen — рентген, dizayn — дизайн.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'test-33-kirish-sayt',
  module: 'kirish',
  lessonTitle: {
    uz: 'Kirish. Sayt nimadan yasalgan?',
    ru: 'Введение. Из чего сделан сайт?',
    en: 'Intro. What is a website made of?'
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
  check: L3('Tekshirish', 'Проверить', 'Check'),
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('HTML hujjat tuzilishi', 'Структура HTML-документа', 'HTML document structure'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone')
};

// Сайт урока — сайт школьного футбольного турнира с записью (его собирает симулятор ИИ, aiSite).
const SITE = {
  what: L3('Futbol turniri sayti', 'Футбольный турнир', 'Football tournament'),
  why: L3("o'yinchilar yozilsin", 'чтобы игроки записались', 'get players to sign up')
};

// Сайт-пример экранов 1–4 (заказчик, 16.11.2026: «не обязательно про эпл и телефон, сделай просто интересный для
// ученика»): сайт выдуманной космической игры «Planeta 9» — ночное небо, неон, робот-космонавт над планетой, жёлтая
// кнопка «O'ynash», лента, крупные цифры, выбор героя. Каркас (классы частей) — прежний, экраны 2–4 работают так же.
const ORBIT = {
  logo: '✦ planeta9',
  links: [L3("O'yin", 'Игра', 'Game'), L3('Qahramonlar', 'Герои', 'Heroes'), L3('Reyting', 'Рейтинг', 'Ranking'), L3('Yangiliklar', 'Новости', 'News')],
  buy: L3("O'ynash", 'Играть', 'Play'),
  more: L3('Treyler →', 'Трейлер →', 'Trailer →'),
  eyebrow: L3("— YANGI O'YIN · BEPUL", '— НОВАЯ ИГРА · БЕСПЛАТНО', '— NEW GAME · FREE'),
  sub: L3("Robot bilan galaktika bo'ylab sakrang!", 'Прыгай по галактике вместе с роботом!', 'Jump across the galaxy with your robot!'),
  spec: L3("3 olam · 60 daraja · do'stlar bilan", '3 мира · 60 уровней · с друзьями', '3 worlds · 60 levels · with friends'),
  price: L3('Telefon va kompyuterda', 'На телефоне и компьютере', 'On phone and computer'),
  band: L3("BEPUL ✦ 60 DARAJA ✦ 3 OLAM ✦ ONLAYN JANG ✦ YANGI SKINLAR", 'БЕСПЛАТНО ✦ 60 УРОВНЕЙ ✦ 3 МИРА ✦ ОНЛАЙН-БИТВЫ ✦ НОВЫЕ СКИНЫ', 'FREE ✦ 60 LEVELS ✦ 3 WORLDS ✦ ONLINE BATTLES ✦ NEW SKINS'),
  kicker: L3("O'YIN HAQIDA", 'ОБ ИГРЕ', 'ABOUT THE GAME'),
  feat: L3('Har kuni yangi sarguzasht.', 'Каждый день — новое приключение.', 'A new adventure every day.'),
  cards: [['60', L3('daraja', 'уровней', 'levels'), L3('Har birida yashirin sir', 'В каждом — секрет', 'A secret in each one')],
    ['3', L3('olam', 'мира', 'worlds'), L3("Muz, lava va o'rmon", 'Лёд, лава и лес', 'Ice, lava and forest')],
    ['4', L3("o'yinchi", 'игрока', 'players'), L3("Do'stlar bilan birga", 'Вместе с друзьями', 'Together with friends')]],
  colorsH: L3('Qahramonni tanlang', 'Выбери героя', 'Pick your hero'),
  colors: [['swq', '🤖', 'Bolt'], ['swt', '👾', 'Nova'], ['swo', '🚀', 'Zip']],
  foot: L3('© 2026 Planeta 9. Barcha huquqlar himoyalangan.', '© 2026 Planeta 9. Все права защищены.', '© 2026 Planeta 9. All rights reserved.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, hint1, hint2, why, right, help; печатаются: eyebrow, ask, card, кнопки.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Kirish', 'Введение', 'Intro'),
    say: L3("Salom! Men Kodi. Bu yangi kosmik o'yinning sayti. Zo'r-a? Biz har kuni shunday saytlarni ochamiz. Ularning ichida nima bor ekan? «Ichiga qarash»ni bosing!",
      'Привет! Я Коди. Это сайт новой космической игры. Круто, правда? Каждый день мы открываем такие сайты. А что у них внутри? Нажми «Заглянуть внутрь»!',
      'Hi! I’m Kodi. This is the site of a new space game. Cool, right? We open sites like this every day. But what’s inside them? Tap “Look inside”!'),
    btn: L3('Ichiga qarash', 'Заглянуть внутрь', 'Look inside'),
    magic: L3("Voy! Butun chiroy to'kilib tushdi! Faqat oddiy matn va rasm qoldi.", 'Ого! Вся красота осыпалась! Остались только простой текст и картинка.', 'Whoa! All the beauty fell off! Only plain text and a picture are left.'),
    done: L3("Men saytlarni sehr deb o'ylardim, ularni faqat daholar yasay oladi deb. Siz-chi? Bugun har qanday sayt nimadan yasalganini bilib olamiz.",
      'Я думал, что сайты — это волшебство и делают их только гении. А ты как думаешь? Сегодня узнаем, из чего сделан любой сайт.',
      'I used to think sites were magic that only geniuses could make. What about you? Today we’ll find out what any site is made of.'),
    ask: L3('«Ichiga qarash»ni bosing', 'Нажми «Заглянуть внутрь»', 'Tap “Look inside”'),
    askDone: L3('Sayt nimadan yasalgan?', 'Из чего сделан сайт?', 'What is a site made of?')
  },
  s2: {
    eyebrow: L3('Rentgen', 'Рентген', 'X-ray'),
    help: [
      L3("Rentgen topgan qismlarga qarang: logotip, menyu, sarlavha, matn, tugmalar va rasm. Hammasi joyida qoldi.", 'Посмотри на то, что нашёл рентген: логотип, меню, заголовок, текст, кнопки и картинка. Всё осталось на месте.', 'Look at what the X-ray found: the logo, menu, heading, text, buttons and picture. Everything stayed in place.'),
      L3("Skelet, ya'ni HTML degani, sahifada nima borligini aytadi. Rang va shrift unga kirmaydi.", 'Скелет, то есть HTML, говорит, что есть на странице. Цвета и шрифты в него не входят.', 'The skeleton, that is HTML, says what’s on the page. Colours and fonts aren’t part of it.'),
      L3("Shifokor rentgenda odamning suyaklarini ko'radi, kiyimini emas. Biz ham saytning skeletini ko'ryapmiz.", 'Врач на рентгене видит кости человека, а не его одежду. Так и мы видим скелет сайта.', 'On an X-ray a doctor sees a person’s bones, not their clothes. We’re seeing the site’s skeleton the same way.')
    ],
    say: L3("Keling, saytni rentgen qilamiz! Kiyimsiz sahifada nima qolganini ko'ramiz.", 'Давай просветим сайт рентгеном! Посмотрим, что осталось на странице без одежды.', 'Let’s X-ray the site! We’ll see what’s left on the page without its clothes.'),
    found: L3("Mana: logotip, menyu, sarlavha, matn, tugmalar va rasm. Hammasi joyida qoldi!", 'Вот: логотип, меню, заголовок, текст, кнопки и картинка. Всё на месте!', 'Here they are: the logo, menu, heading, text, buttons and picture. Everything is still there!'),
    done: L3("Bu saytning skeleti, ya'ni HTML degani. Skelet sahifada nima borligini aytadi. Qanday ko'rinishi esa boshqa ish.",
      'Это скелет сайта, то есть HTML. Скелет говорит, что есть на странице. А как это выглядит — уже другое дело.',
      'This is the site’s skeleton, that is, HTML. The skeleton says what’s on the page. How it looks is another matter.'),
    parts: [
      ['.logo', L3('logotip', 'логотип', 'logo')], ['.links', L3('menyu', 'меню', 'menu')], ['.title', L3('sarlavha', 'заголовок', 'heading')],
      ['.sub', L3('matn', 'текст', 'text')], ['.ctas', L3('tugmalar', 'кнопки', 'buttons')], ['.phone', L3('rasm', 'картинка', 'picture')]
    ],
    scan: L3('Skanerlash', 'Сканирую', 'Scanning'),
    foundN: L3('Topildi', 'Найдено', 'Found'),
    asks: [L3('Qarang: rentgen', 'Смотри: рентген', 'Watch: the X-ray'), L3('Qarang: topilgan qismlar', 'Смотри: что нашлось', 'Watch: what was found')],
    askDone: L3('Skelet (HTML) — sahifada nima bor', 'Скелет (HTML) — что есть на странице', 'Skeleton (HTML): what is on the page')
  },
  s3: {
    eyebrow: L3('Kiyim', 'Одежда', 'Clothes'),
    say: L3("Endi saytni kiyintiramiz! Mana kiyim shkafi. Kiyimni bosing, u saytga uchib boradi va o'z qismini kiyintiradi.",
      'А теперь оденем сайт! Вот шкаф с одеждой. Нажми на вещь — она полетит на сайт и оденет свою часть.',
      'Now let’s dress the site! Here’s the wardrobe. Tap a piece of clothing and it will fly to the site and dress its part.'),
    wardrobe: L3('Kiyim shkafi', 'Шкаф с одеждой', 'Wardrobe'),
    worn: L3('Kiyildi', 'Надето', 'Worn'),
    parts: {
      menu: L3('Menyu', 'Меню', 'Menu'), hero: L3('Sarlavha', 'Заголовок', 'Heading'),
      btns: L3('Tugmalar', 'Кнопки', 'Buttons'), cards: L3('Kartochkalar', 'Карточки', 'Cards')
    },
    ok: L3("Chiroy qaytdi! Ranglar, shriftlar, soyalar: bu saytning kiyimi, ya'ni CSS degani. Skelet o'sha-o'sha, faqat kiyim o'zgardi.",
      'Красота вернулась! Цвета, шрифты, тени — это одежда сайта, то есть CSS. Скелет тот же, поменялась только одежда.',
      'The beauty is back! Colours, fonts and shadows are the site’s clothes, that is, CSS. The skeleton is the same, only the clothes changed.'),
    ask: L3('Kiyimni bosing', 'Нажми на вещь', 'Tap a piece of clothing'),
    askDone: L3("Kiyim (CSS) — qanday ko'rinadi", 'Одежда (CSS) — как выглядит', 'Clothes (CSS): how it looks')
  },
  s4: {
    eyebrow: L3('Miya', 'Мозг', 'Brain'),
    say: L3("Saytda yana bitta sir bor. Saytdagi «O'ynash» tugmasini bosing!", 'У сайта есть ещё один секрет. Нажми на сайте кнопку «Играть»!', 'The site has one more secret. Tap the “Play” button on the site!'),
    dead: L3("Hech narsa bo'lmadi! Tugma bor, chiroyli ham, lekin hech narsa qilmayapti. Unga miya kerak, ya'ni JavaScript. Miyani yoqing!",
      'Ничего не произошло! Кнопка есть, она красивая, но ничего не делает. Ей нужен мозг, то есть JavaScript. Включи мозг!',
      'Nothing happened! The button is there and it looks nice, but it does nothing. It needs a brain, that is, JavaScript. Turn on the brain!'),
    on: L3("Miya yoqildi! Endi tugmani yana bosing.", 'Мозг включён! Теперь нажми кнопку ещё раз.', 'The brain is on! Now tap the button again.'),
    ok: L3("Ana! O'yin boshlandi, robot sakradi, ochko qo'shildi. JavaScript saytning miyasi: bosilganda nima bo'lishini aytadi.",
      'Вот! Игра началась, робот прыгнул, очки добавились. JavaScript — мозг сайта: он говорит, что произойдёт при нажатии.',
      'There! The game started, the robot jumped, points were added. JavaScript is the site’s brain: it says what happens when you tap.'),
    toggle: L3('Miya', 'Мозг', 'Brain'),
    off: L3("o'chiq", 'выкл', 'off'),
    onL: L3('yoqilgan', 'вкл', 'on'),
    toast: L3("O'yin boshlandi!", 'Игра началась!', 'Game on!'),
    asks: [L3("Saytdagi «O'ynash»ni bosing", 'Нажми на сайте «Играть»', 'Tap “Play” on the site'), L3('Miyani yoqing', 'Включи мозг', 'Turn on the brain'),
      L3("Yana «O'ynash»ni bosing", 'Снова нажми «Играть»', 'Tap “Play” again')],
    askDone: L3('Miya (JS) — sayt nima qiladi', 'Мозг (JS) — что делает сайт', 'Brain (JS): what the site does')
  },
  s5: {
    eyebrow: L3('Kiyim almashtirish', 'Смена одежды', 'Outfit change'),
    say: L3("Endi sehrli tajriba! Skeletga tegmaymiz, faqat kiyimni almashtiramiz. Kiyimlarni bosib ko'ring!",
      'А теперь магический опыт! Скелет не трогаем, меняем только одежду. Нажимай на наряды!',
      'Now a magic experiment! We won’t touch the skeleton, we’ll only change the clothes. Tap the outfits!'),
    outfits: { neon: L3('Neon', 'Неон', 'Neon'), candy: L3('Konfet', 'Конфета', 'Candy'), retro: L3('Retro', 'Ретро', 'Retro'), forest: L3("O'rmon", 'Лес', 'Forest') },
    ok: L3("Voy! Skelet bitta, lekin har safar butunlay boshqa sayt! Matn va tugmalar o'sha-o'sha, faqat kiyim o'zgardi.",
      'Ого! Скелет один, а сайт каждый раз совсем другой! Текст и кнопки те же, поменялась только одежда.',
      'Whoa! One skeleton, but a totally different site every time! The text and buttons are the same, only the clothes changed.'),
    ask: L3("Uchta kiyimni kiyintirib ko'ring", 'Примерь три наряда', 'Try on three outfits'),
    askDone: L3('Skelet bitta, kiyim har xil', 'Скелет один, одежда разная', 'One skeleton, many outfits')
  },
  s6: {
    eyebrow: L3('Buzilgan sayt', 'Сломанный сайт', 'Broken site'),
    say: L3("Voy, men saytni buzib qo'ydim! Har safar nima buzilganini toping: skeletmi, kiyimmi yoki miyami? To'g'ri topsangiz, sayt tuzaladi.",
      'Ой, я сломал сайт! Каждый раз угадай, что сломалось: скелет, одежда или мозг? Угадаешь — сайт починится.',
      'Oops, I broke the site! Each time, figure out what broke: the skeleton, the clothes or the brain? Get it right and the site gets fixed.'),
    ask: L3('Nima buzilgan?', 'Что сломалось?', 'What broke?'),
    card: L3('Muammo', 'Проблема', 'Problem'),
    skel: L3('Skelet · HTML', 'Скелет · HTML', 'Skeleton · HTML'),
    kiy: L3('Kiyim · CSS', 'Одежда · CSS', 'Clothes · CSS'),
    js: L3('Miya · JS', 'Мозг · JS', 'Brain · JS'),
    right: L3('Tuzaldi!', 'Починил!', 'Fixed!'),
    hint1: L3("Qismning o'zi yo'qmi yoki u joyida-yu, ko'rinishi buzilganmi?", 'Части совсем нет — или она на месте, но выглядит не так?', 'Is the part gone completely, or is it there but looks wrong?'),
    hint2: L3("Qism yo'qolsa, bu skelet. Rangi yoki o'lchami buzilsa, bu kiyim. Bosganda hech narsa bo'lmasa, bu miya.", 'Части нет — скелет. Сломан цвет или размер — одежда. Нажимаешь, а ничего не происходит — мозг.', 'A part is missing: skeleton. Colour or size broken: clothes. You tap and nothing happens: brain.'),
    items: [
      { k: 'title', t: L3("Sarlavha ko'rinmay qoldi", 'Заголовок пропал из вида', 'The heading became invisible'), right: 'kiy',
        why: L3("Sarlavha joyida, faqat rangi fon bilan bir xil bo'lib qoldi. Bu kiyim.", 'Заголовок на месте, просто его цвет совпал с фоном. Это одежда.', 'The heading is there, its colour just matches the background. That’s the clothes.') },
      { k: 'btn', t: L3("«O'ynash» tugmasi yo'qolib qoldi", 'Пропала кнопка «Играть»', 'The “Play” button disappeared'), right: 'skel',
        why: L3("Tugmaning o'zi sahifada yo'q. Bu skelet.", 'Самой кнопки на странице нет. Это скелет.', 'The button itself isn’t on the page. That’s the skeleton.') },
      { k: 'img', t: L3('Robot juda kattalashib ketdi', 'Робот стал огромным', 'The robot became huge'), right: 'kiy',
        why: L3("Rasm joyida, faqat o'lchami buzildi. Bu kiyim.", 'Картинка на месте, сломался только размер. Это одежда.', 'The picture is there, only its size broke. That’s the clothes.') },
      { k: 'click', t: L3("Saytdagi «O'ynash»ni bosib ko'ring: hech narsa bo'lmayapti", 'Нажми на сайте «Играть»: ничего не происходит', 'Tap “Play” on the site: nothing happens'), right: 'js',
        why: L3("Tugma bor va chiroyli, faqat u nima qilishini bilmaydi. Bu miya.", 'Кнопка есть и она красивая, но не знает, что делать. Это мозг.', 'The button is there and looks nice, it just doesn’t know what to do. That’s the brain.') }
    ],
    ok: L3("Zo'r! Sayt butunlay tuzaldi. Siz saytdagi buzilishni ham topa olasiz!", 'Супер! Сайт полностью починен. Ты умеешь находить поломки на сайте!', 'Great! The site is fully fixed. You can find what’s broken on a site!')
  },
  s8: {
    eyebrow: L3("O'z dizayningiz", 'Твой дизайн', 'Your design'),
    say: L3("Endi siz dizaynersiz! Saytga o'z kiyimingizni va miyasini tanlang: rang, shrift, burchaklar va tugma bosilganda nima bo'lishi. Har bir qatordan bittadan bosing.",
      'Теперь ты дизайнер! Подбери сайту свою одежду и мозг: цвет, шрифт, углы и что будет при нажатии кнопки. Выбери по одному в каждой строке.',
      'Now you’re the designer! Pick your site’s clothes and brain: colour, font, corners and what happens when you tap the button. Choose one in each row.'),
    rows: { color: L3('Rang', 'Цвет', 'Colour'), font: L3('Shrift', 'Шрифт', 'Font'), corner: L3('Burchaklar', 'Углы', 'Corners'), act: L3('Bosilganda', 'При нажатии', 'On tap') },
    opts: {
      cyan: L3('Moviy', 'Голубой', 'Cyan'), pink: L3('Pushti', 'Розовый', 'Pink'), green: L3('Yashil', 'Зелёный', 'Green'), orange: L3("To'q sariq", 'Оранжевый', 'Orange'),
      bold: L3('Qalin', 'Жирный', 'Bold'), round: L3('Yumaloq', 'Круглый', 'Rounded'), pixel: L3('Piksel', 'Пиксели', 'Pixel'),
      soft: L3('Dumaloq', 'Круглые', 'Round'), sharp: L3("To'g'ri", 'Прямые', 'Square'),
      jump: L3('Robot sakraydi', 'Робот прыгает', 'Robot jumps'), confetti: L3('Konfetti', 'Конфетти', 'Confetti'), stars: L3('10 ochko', '10 очков', '10 points')
    },
    press: L3("Endi saytdagi «O'ynash»ni bosib ko'ring!", 'А теперь нажми на сайте «Играть»!', 'Now tap “Play” on the site!'),
    ok: L3("Ajoyib! Bu saytning kiyimini ham, miyasini ham siz o'zingiz o'ylab topdingiz.", 'Классно! И одежду, и мозг этого сайта ты придумал сам.', 'Awesome! You came up with both the clothes and the brain of this site yourself.'),
    ask: L3('Har qatordan bittadan tanlang', 'Выбери по одному в каждой строке', 'Pick one in each row'),
    askPress: L3("Saytdagi «O'ynash»ni bosing", 'Нажми на сайте «Играть»', 'Tap “Play” on the site'),
    askDone: L3("Xohlasangiz, yana o'zgartiring va bosing", 'Можно менять и нажимать ещё', 'Change it and tap again if you like')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    skel: L3('Skelet', 'Скелет', 'Skeleton'),
    say: [
      { text: L3("Esingizdami, men saytlarni sehr deb o'ylagandim? Adashibman! Har qanday sayt uch qismdan iborat.",
        'Помнишь, я думал, что сайты — это волшебство? Я ошибся! Любой сайт состоит из трёх частей.',
        'Remember how I thought sites were magic? I was wrong! Every site is made of three parts.'), k: null },
      { text: L3("Skelet, ya'ni HTML: sahifada nima bor.", 'Скелет, то есть HTML: что есть на странице.', 'The skeleton, that is HTML: what’s on the page.'), k: 'html' },
      { text: L3("Kiyim, ya'ni CSS: sayt qanday ko'rinadi.", 'Одежда, то есть CSS: как выглядит сайт.', 'The clothes, that is CSS: how the site looks.'), k: 'css' },
      { text: L3("Miya, ya'ni JavaScript: sayt nima qiladi.", 'Мозг, то есть JavaScript: что делает сайт.', 'The brain, that is JavaScript: what the site does.'), k: 'js' },
      { text: L3("Bugun siz saytni rentgen qildingiz, kiyintirdingiz, unga miya berdingiz, tuzatdingiz va o'z dizayningizni yaratdingiz. Barakalla!",
        'Сегодня ты просветил сайт рентгеном, одел его, дал ему мозг, починил и придумал свой дизайн. Молодец!',
        'Today you X-rayed a site, dressed it, gave it a brain, fixed it and made your own design. Well done!'), k: 'own' }
    ],
    roles: {
      html: L3("skelet: sahifada nima bor", 'скелет: что есть на странице', 'the skeleton: what’s on the page'),
      css: L3("kiyim: qanday ko'rinadi", 'одежда: как выглядит', 'the clothes: how it looks'),
      js: L3('miya: nima qiladi', 'мозг: что делает', 'the brain: what it does'),
      own: L3('siz yaratgan dizayn', 'дизайн, который придумал ты', 'the design you made')
    },
    own: L3('Sizning dizayningiz', 'Твой дизайн', 'Your design'),
    ask: L3("Saytingizdagi «O'ynash»ni bosib ko'ring", 'Нажми «Играть» на своём сайте', 'Tap “Play” on your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, hint1: 1, hint2: 1, why: 1, right: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:kirish-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:kirish.css@*/
`;
