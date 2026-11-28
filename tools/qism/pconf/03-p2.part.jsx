// Практика 3 «Праздник Коди», ЧАСТЬ 2: ul или ol и свой список (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Перемешать»: у гостей смысл тот же, у программы сломался), три новых задания по темам части 2
// урока (t1 поменять ul на ol в готовом коде, t2 обернуть пункты списком по смыслу, t3 найти пункт без li) и
// прежнее «своё» (t4, бывшее t5: h1 и ul или ol). Вывод — прежний Fin с четырьмя вкладками (правки в build-prac).

// ── Карта части 2: четыре страницы (вкладки). Содержимое страниц — поля events / names / items. ──
Object.assign(A3_ICO, {
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.2c3 .3 5 2.4 5 5.3" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M12 9v11M4 13h16" /><path d="M12 9C10.5 5.5 7 5.5 7 7.8 7 9.2 9 9 12 9zM12 9c1.5-3.5 5-3.5 5-1.2C17 9.2 15 9 12 9z" /></>
});
TABS.splice(0, TABS.length,
  { id: 'plan', ico: 'list', c: '#0FA38E', name: L3("Dastur", 'Программа', 'Program'),
    events: [L3("Mehmonlar keladi", 'Приходят гости', 'Guests arrive'), L3("Tort kesiladi", 'Режем торт', 'We cut the cake'), L3("O'yinlar boshlanadi", 'Начинаем игры', 'The games begin')] },
  { id: 'guests', ico: 'people', c: '#FA4F28', name: L3("Mehmonlar", 'Гости', 'Guests'),
    names: [L3("Do'stlar", 'Друзья', 'Friends'), L3("Qarindoshlar", 'Родственники', 'Relatives'), L3("Qo'shnilar", 'Соседи', 'Neighbours')] },
  { id: 'gifts', ico: 'gift', c: '#7C5CFA', name: L3("Sovg'alar", 'Подарки', 'Gifts'),
    items: [L3("Konstruktor", 'Конструктор', 'Construction set'), L3("Kitob", 'Книга', 'Book'), L3("To'p", 'Мяч', 'Ball')], bad: 1 },
  { id: 'mine', ico: 'star', c: '#E44D26', name: L3("Mening ro'yxatim", 'Мой список', 'My list') }
);
// Содержимое дополнительных задач, образцов и хука (другое, чем в заданиях).
const XTRA2 = {
  candles: { h: L3("Sham", 'Свечи', 'Candles'), steps: [L3("Tortni stolga qo'ying", 'Поставь торт на стол', 'Put the cake on the table'),
    L3("Shamlarni yoqing", 'Зажги свечи', 'Light the candles'), L3("Tilak tilab, o'chiring", 'Загадай желание и задуй', 'Make a wish and blow them out')] },
  morning: [L3("Uyg'onaman", 'Просыпаюсь', 'I wake up'), L3("Yuvinaman", 'Умываюсь', 'I wash'), L3("Nonushta qilaman", 'Завтракаю', 'I have breakfast')],
  shop: [L3("Non", 'Хлеб', 'Bread'), L3("Sut", 'Молоко', 'Milk'), L3("Olma", 'Яблоки', 'Apples')],
  wrap: { h: L3("Sovg'a o'rash", 'Упаковка подарка', 'Gift wrapping'), steps: [L3("Qog'oz oling", 'Возьми бумагу', 'Take the paper'),
    L3("Sovg'ani o'rang", 'Заверни подарок', 'Wrap the gift'), L3("Lenta bog'lang", 'Завяжи ленту', 'Tie the ribbon')] },
  greet: { h: L3("Kutib olish", 'Встреча гостей', 'Welcoming'), items: [L3("Eshikni oching", 'Открой дверь', 'Open the door'),
    L3("Salomlashing", 'Поздоровайся', 'Say hello'), L3("Kiyimni osib qo'ying", 'Повесь пальто', 'Hang up the coat')], bad: 1 },
  hook: { title: L3("Bayram", 'Праздник', 'Party'), gh: L3("Mehmonlar", 'Гости', 'Guests'), ph: L3("Dastur", 'Программа', 'Program'),
    guests: [L3("Do'stlar", 'Друзья', 'Friends'), L3("Qarindoshlar", 'Родственники', 'Relatives')],
    prog: [L3("Mehmonlar keladi", 'Приходят гости', 'Guests arrive'), L3("Tort kesiladi", 'Режем торт', 'We cut the cake')] }
};

Object.assign(UI, {
  shuffle: L3("Aralashtirish", 'Перемешать', 'Shuffle'),
  ruleQ: L3("O'rnini almashtirsak, ma'no buzilsami?", 'Если поменять местами, смысл сломается?', 'If we swap the items, does the meaning break?'),
  yes: L3("Ha", 'Да', 'Yes'),
  no: L3("Yo'q", 'Нет', 'No'),
  ruleOl: L3("raqamli ro'yxat", 'список с номерами', 'numbered list'),
  ruleUl: L3("nuqtali ro'yxat", 'список с точками', 'bulleted list')
});

// ── Фразы проверки новых заданий. ──
Object.assign(FB, {
  orderNeed: L3("Bu yerda tartib muhim: bandlar ketma-ket keladi. Nuqtalar tartibni ko'rsatmaydi, raqamlar esa ko'rsatadi.",
    'Здесь важен порядок: пункты идут друг за другом. Точки порядок не показывают, а номера показывают.',
    'The order matters here: the items follow one another. Bullets don’t show the order, numbers do.'),
  ulNeed: L3("Do'stlar bilan qo'shnining o'rnini almashtirsak, ma'no buzilmaydi: baribir hamma keladi. Raqamlar kerak emas, bu yerga ul yarashadi.",
    'Друзей и соседей можно поменять местами, и смысл не сломается: придут все. Номера не нужны, здесь подходит ul.',
    'You can swap the friends and the neighbours and nothing breaks: everyone comes anyway. Numbers aren’t needed, ul fits here.'),
  keepWords: L3("So'zlar o'sha-o'sha qolsin. O'zgaradigani faqat ro'yxat tegi.", 'Слова пусть остаются прежними. Меняется только тег списка.', 'Keep the words as they were. Only the list tag changes.'),
  keepItem: L3("So'zga tegmang, u «{want}» bo'lib qolsin. Faqat uni li ichiga soling.", 'Слово пусть остаётся прежним: «{want}». Нужно только поставить его в li.', 'Keep the word as it was: “{want}”. Just put it inside li.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
const FIN_OLD = C.fin;   // подписи плашек и строка задания вывода — прежние
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! Bayram saytining to'rtta sahifasini tuzatdik, yana to'rttasi navbatda: dastur, mehmonlar, sovg'alar va sizning ro'yxatingiz. Lekin oldin bitta sinov o'tkazamiz. Mana ikkita ro'yxat: mehmonlar va bayram dasturi. «Aralashtirish»ni bosing, bandlarning o'rni almashadi. Nima o'zgarishini ko'ramiz.",
      'Привет! Четыре страницы сайта мы починили, ещё четыре ждут: программа, гости, подарки и твой список. Но сначала маленький опыт. Вот два списка: гости и программа праздника. Нажми «Перемешать»: пункты поменяются местами. Посмотрим, что изменится.',
      'Hi! We fixed four pages of the site, and four more are waiting: the program, the guests, the gifts and your own list. But first, a little experiment. Here are two lists: the guests and the party program. Tap “Shuffle”: the items will swap places. Let’s see what changes.'),
    broke: L3("Ko'rdingizmi? Mehmonlarda hech narsa o'zgarmadi: do'stlar oldin kelsa ham, qarindoshlar oldin kelsa ham, baribir hamma keladi. Dasturda esa hammasi chalkashdi: tort mehmonlar kelmasdan oldin kesilib ketibdi!",
      'Видишь? У гостей ничего не изменилось: друзья первые или родственники, всё равно придут все. А в программе всё запуталось: торт режут ещё до прихода гостей!',
      'See? Nothing changed for the guests: friends first or relatives first, everybody comes anyway. But the program got mixed up: the cake is cut before the guests arrive!'),
    done: L3("Demak, hamma gap bandlarning tartibida. O'rnini almashtirsak, ma'no buzilsa, raqamli ro'yxat kerak: ol tegi. Buzilmasa, nuqtali ul yetadi. Endi shu qoidani to'rtta sahifada sinab ko'ramiz, oxirgisida esa o'z ro'yxatingizni yozasiz.",
      'Выходит, всё дело в порядке пунктов. Если от перестановки смысл ломается, нужен список с номерами, то есть ol. Если нет, хватит ul с точками. Проверим это правило на четырёх страницах, а на последней ты напишешь свой список.',
      'So it all comes down to the order of the items. If swapping them breaks the meaning, you need a numbered list, that is, ol. If not, ul with bullets is enough. We’ll try this rule on four pages, and on the last one you’ll write your own list.'),
    ask: L3("«Aralashtirish»ni bosing", 'Нажми «Перемешать»', 'Tap “Shuffle”'),
    askDone: L3("Mehmonlar o'zgarmadi, dastur buzildi", 'Гости не изменились, программа сломалась', 'The guests stayed the same, the program broke')
  },
  t1: {
    eyebrow: L3("Dastur", 'Программа', 'Program'),
    say: L3("Dasturdan boshlaymiz. Unda hammasi tartib bilan: oldin mehmonlar keladi, keyin tort kesiladi, undan keyin o'yinlar boshlanadi. Lekin saytda nuqtalar turibdi, nuqtalar esa tartibni ko'rsatmaydi. Bandlarning o'rnini almashtirsak, ma'no buzilib ketadi-ku! Ro'yxat turini o'zgartiring, tartib ko'rinib tursin.",
      'Начнём с программы. В ней всё идёт по порядку: сначала приходят гости, потом режут торт, потом начинаются игры. Но на сайте стоят точки, а они порядок не показывают. Поменяй пункты местами, и смысл сломается! Измени тип списка, чтобы порядок стал виден.',
      'Let’s start with the program. Everything goes in order: first the guests arrive, then we cut the cake, then the games begin. But the site shows bullets, and bullets don’t show the order. Swap the items and the meaning breaks! Change the type of the list so the order is visible.'),
    ask: L3("Tartib ko'rinsin: ro'yxat tegini o'zgartiring", 'Сделай порядок видимым: поменяй тег списка', 'Make the order visible: change the list tag'),
    ok: L3("Dasturda raqamlar paydo bo'ldi, endi tartib hammaga ko'rinadi. Raqamlarni brauzerning o'zi qo'ydi!",
      'Огонь! В программе появились номера, и порядок теперь виден всем. Их поставил сам браузер!',
      'Awesome! Numbers appeared in the program, and now everyone can see the order. The browser added them!'),
    hints: [
      L3("Qaysi ro'yxatda raqamlar bor: nuqtalimi yoki raqamlimi? Tartib muhim bo'lsa, qaysi birini tanlaymiz?", 'В каком списке есть номера: с точками или с номерами? Какой выбрать, когда важен порядок?', 'Which list has numbers: the bulleted one or the numbered one? Which one do you pick when order matters?'),
      L3("Ro'yxatning birinchi qatorida ul turibdi, oxirgi qatorida ham ul. Ikkalasini ham o'zgartiring, aks holda ro'yxat bitta tegda ochilib, boshqasida yopiladi.", 'В первой строке списка стоит ul, и в последней тоже ul. Поменяй оба, иначе список откроется одним тегом, а закроется другим.', 'The first line of the list has ul, and the last line has ul too. Change both, otherwise the list opens with one tag and closes with another.'),
      L3("Mana, ertalabki ishlar ol bilan shunday yoziladi: ochilishida ol, yopilishida ham ol. Siz ham dastur uchun shunday qiling.", 'Вот так выглядит список утренних дел с ol: ol при открытии и ol при закрытии. Сделай так же для программы.', 'Here’s how the morning routine looks with ol: ol when it opens and ol when it closes. Do the same for the program.')
    ],
    drill: L3("Endi shamlar ro'yxati: tartib bu yerda ham muhim", 'Теперь список со свечами: порядок тут тоже важен', 'Now the candles list: the order matters here too')
  },
  t2: {
    eyebrow: L3("Mehmonlar", 'Гости', 'Guests'),
    say: L3("Dastur tayyor! Endi mehmonlar sahifasi: do'stlar, qarindoshlar va qo'shnilar. Voy, bandlar ro'yxatsiz qolib ketibdi: ular li ichida turibdi-yu, ularni o'rab turadigan ro'yxat yo'q. Ro'yxat tegini o'zingiz yozing. Faqat oldin o'ylab ko'ring: do'stlar bilan qo'shnilarning o'rnini almashtirsak, ma'no buzilarmikan?",
      'Программа готова! Теперь страница гостей: друзья, родственники и соседи. Ой, пункты остались без списка: они лежат в li, а обнимающего их списка нет. Тег списка напиши сам. Но сначала подумай: если поменять друзей и соседей местами, смысл сломается?',
      'The program is done! Now the guests page: friends, relatives and neighbours. Oops, the items are left without a list: they sit in li, but there’s no list around them. Write the list tag yourself. But first think: if we swap the friends and the neighbours, will the meaning break?'),
    ask: L3("Bandlarni ro'yxatga soling: ul yoki ol", 'Оберни пункты списком: ul или ol', 'Wrap the items in a list: ul or ol'),
    ok: L3("Mehmonlarning o'rni farq qilmaydi, shuning uchun nuqtali ul yarashdi. Hammani kutib olamiz!",
      'Вот это да! Порядок гостей не важен, поэтому подошёл ul с точками. Всех встретим!',
      'Wow! The order of the guests doesn’t matter, so ul with bullets fits. We’ll welcome everyone!'),
    hints: [
      L3("O'ylab ko'ring-chi: ikki mehmonning o'rnini almashtirsak, biror narsa buzilarmikan? Tort retseptidagi qadamlarni almashtirsak-chi?", 'Подумай: если поменять двух гостей местами, что-нибудь сломается? А если поменять шаги рецепта?', 'Think: if you swap two guests, will anything break? What about swapping the steps of a recipe?'),
      L3("Mehmonlar uchun tartib muhim emas, demak, raqamlar kerak emas. Ro'yxatni ul tegi bilan oching, li qatorlaridan keyin esa ul tegi bilan yoping.", 'Для гостей порядок не важен, значит, номера не нужны. Открой список тегом ul, а после строк li закрой его тегом ul.', 'The order of the guests doesn’t matter, so numbers aren’t needed. Open the list with ul and close it with ul after the li lines.'),
      L3("Mana xaridlar ro'yxati: ul tegi li qatorlarini o'rab turibdi. Siz ham mehmonlarni shunday o'rang.", 'Вот список покупок: ul обнимает строки li. Обними так же и гостей.', 'Here’s a shopping list: ul wraps the li lines. Wrap the guests the same way.')
    ],
    drill: L3("Endi sovg'a o'rash qadamlari: ularga ham ro'yxat tegi kerak", 'Теперь шаги, как упаковать подарок: им тоже нужен тег списка', 'Now the steps to wrap a gift: they need a list tag too')
  },
  t3: {
    eyebrow: L3("Sovg'alar", 'Подарки', 'Gifts'),
    say: L3("Mehmonlar tayyor! Endi sovg'alar sahifasi. Bu yerda g'alati narsa bor: bitta sovg'aning oldida nuqta yo'q. Demak, kodda bir qator buzilgan. Oldin o'sha qatorni toping-da, ustiga bosing.",
      'Гости готовы! Теперь страница подарков. Здесь странность: у одного подарка нет точки. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'The guests are done! Now the gifts page. Something’s odd here: one gift has no bullet. So one line of code is broken. First find that line and tap it.'),
    ask: L3("Nuqtasiz band qatorini bosing", 'Нажми строку пункта без точки', 'Tap the line of the item with no bullet'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Bu bandda li teglari yo'q, shuning uchun oldida nuqta ham yo'q. Uni li ichiga soling.",
      'Нашлась! У этого пункта нет li, поэтому нет и точки. Поставь слово внутрь li.',
      'Found it! This item has no li, so it has no bullet. Put the word inside li.'),
    ok: L3("Tuzaldi! Endi hamma sovg'aning oldida nuqta bor. Qatorda nima yetishmasligini topish haqiqiy dasturchining ishi!",
      'Ура, заработало! Теперь у каждого подарка есть точка. Найти, чего не хватает в строке, это работа настоящего программиста!',
      'Yes, it works! Now every gift has a bullet. Spotting what a line is missing is a real developer’s job!'),
    why: {
      0: L3("Bu body qatori, unda hammasi joyida. Sahifaga qarang: qaysi sovg'aning oldida nuqta yo'q?", 'Здесь открывается body, строка в порядке. Посмотри на страницу: у какого подарка нет точки?', 'body opens here, this line is fine. Look at the page: which gift has no bullet?'),
      1: L3("Sarlavha o'z teglari ichida turibdi, qator butun. Nuqtasiz bandni sovg'alar orasidan qidiring.", 'Заголовок h1 открыт и закрыт как надо. Ищи пункт без точки среди подарков.', 'The h1 heading opens and closes just right. Look for the item with no bullet among the gifts.'),
      2: L3("Bu yerda ul ochilyapti, qator butun. Qaysi sovg'aning oldida nuqta yo'q?", 'Здесь открывается ul, строка в порядке. У какого подарка нет точки?', 'ul opens here, this line is fine. Which gift has no bullet?'),
      step: L3("Bu bandning oldida nuqta bor, demak, aybi yo'q. Nuqtasiz bandni qidiring.", 'У этого пункта есть точка, он в порядке. Ищи пункт без точки.', 'This item has a bullet, so it’s fine. Look for the item with no bullet.'),
      6: L3("Bu yerda ul yopilyapti, qator butun.", 'Здесь закрывается ul, строка в порядке.', 'ul closes here, this line is fine.'),
      7: L3("Pastda body yopiladi, bu qator ham butun.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Sahifaga qarang: qaysi sovg'aning oldida nuqta yo'q?", 'Посмотри на страницу: у какого подарка нет точки?', 'Look at the page: which gift has no bullet?'),
      L3("Endi o'sha sovg'aning qatorini koddan toping. So'zning ikki yonida nima yetishmayapti?", 'Теперь найди в коде строку этого подарка. Чего не хватает по бокам от слова?', 'Now find that gift’s line in the code. What’s missing on both sides of the word?'),
      L3("Mana to'g'ri yozilgan band: so'z ikkita li tegining o'rtasida turibdi. Siz ham so'zni li ichiga soling.", 'Вот правильный пункт: слово стоит между двумя тегами li. Поставь и ты слово между li.', 'Here’s a proper item: the word sits between two li tags. Put your word between li tags too.')
    ],
    drill: L3("Mana yana bitta sahifa: raqamsiz qadamni toping va tuzating", 'Здесь то же самое: найди шаг без номера и почини', 'Same thing here: find the step with no number and fix it'),
    d: {
      ask: L3("Raqamsiz qadam qatorini bosing", 'Нажми строку шага без номера', 'Tap the line of the step with no number'),
      found: L3("Topdingiz! Bu qadamda li teglari yo'q, shuning uchun raqami ham yo'q. Uni li ichiga soling.", 'Нашлась! У этого шага нет li, поэтому нет и номера. Поставь слова внутрь li.', 'Found it! This step has no li, so it has no number. Put the words inside li.'),
      why: {
        0: L3("Bu body qatori, unda hammasi joyida. Sahifaga qarang: qaysi qadamning raqami yo'q?", 'Здесь открывается body, строка в порядке. Посмотри на страницу: у какого шага нет номера?', 'body opens here, this line is fine. Look at the page: which step has no number?'),
        1: L3("Sarlavha o'z teglari ichida turibdi, qator butun. Raqamsiz qadamni qidiring.", 'Заголовок h1 открыт и закрыт как надо. Ищи шаг без номера.', 'The h1 heading opens and closes just right. Look for the step with no number.'),
        2: L3("Bu yerda ol ochilyapti, qator butun. Qaysi qadamning raqami yo'q?", 'Здесь открывается ol, строка в порядке. У какого шага нет номера?', 'ol opens here, this line is fine. Which step has no number?'),
        step: L3("Bu qadamning raqami bor, demak, aybi yo'q. Raqamsiz qadamni qidiring.", 'У этого шага есть номер, он в порядке. Ищи шаг без номера.', 'This step has a number, so it’s fine. Look for the step with no number.'),
        6: L3("Bu yerda ol yopilyapti, qator butun.", 'Здесь закрывается ol, строка в порядке.', 'ol closes here, this line is fine.'),
        7: L3("Pastda body yopiladi, bu qator ham butun.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
      }
    }
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, bayram saytining qolgan sahifalari ham tayyor: dastur, mehmonlar, sovg'alar va sizning ro'yxatingiz. Endi mehmonlarni kutsak bo'ladi!",
        'Смотри, и остальные страницы праздничного сайта готовы: программа, гости, подарки и твой список. Теперь можно ждать гостей!',
        'Look, the other pages of the party site are ready too: the program, the guests, the gifts and your list. Now we can wait for the guests!') },
      { k: 'ol', text: L3("Dasturda bandlarning o'rnini almashtirsak, ma'no buzilar edi. Shuning uchun ol tanladingiz, raqamlarni esa brauzerga topshirdingiz.",
        'В программе от перестановки пунктов смысл ломался. Поэтому выбран ol, а номера оставлены браузеру.',
        'In the program, swapping the items would break the meaning. So you chose ol and left the numbers to the browser.') },
      { k: 'ul', text: L3("Mehmonlar bilan sovg'alarda esa o'rin farq qilmaydi, ularga ul yetdi va nuqtalar chiqdi.",
        'А у гостей и подарков порядок не важен, им хватило ul, и появились точки.',
        'For the guests and the gifts the order doesn’t matter, so ul was enough and bullets appeared.') },
      { k: 'li', text: L3("Sovg'alar sahifasida li tegisiz qolgan bandni ham topdingiz: har bir band o'z li tegida turishi kerak.",
        'А на странице подарков нашёлся пункт без li: каждый пункт должен стоять в своём li.',
        'And on the gifts page you found the item without li: each item has to sit in its own li.') },
      { k: 'own', text: L3("To'rtinchi sahifada o'z ro'yxatingiz turibdi, bu bayramdagi eng yaxshi sovg'a bo'ldi! Mehmonlar bir sahifadan boshqasiga qanday o'tadi, o'ylab ko'rdingizmi? Buni havolalar hal qiladi.",
        'А в конце весь список составлен твоими руками. Это было мощно! На следующем уроке познакомимся со ссылками.',
        'And at the end you made a whole list yourself. That was awesome! Next lesson we’ll meet links.') }
    ],
    roles: FIN_OLD.roles,
    ask: FIN_OLD.ask
  }
});
// Своё — бывшее задание 5: тексты те же, номер страницы и первая фраза — четвёртые.
C.t4 = Object.assign({}, C.t5, {
  say: L3("Uchta sahifa ham joyida, bayramga ozgina qoldi! To'rtinchi bo'sh sahifa sizniki: unga o'z ro'yxatingizni yozasiz, masalan, sevimli o'yinlar yoki bayram taomlari haqida. Eng tepaga h1 tegini qo'ying, tagiga esa ro'yxat yozing, ichida kamida uchta band bo'lsin. Tartib muhim bo'lsa ol, muhim bo'lmasa ul. Chizma yo'lingizni ko'rsatadi.",
    'Три страницы горят! Теперь четвёртая: твой список. Здесь есть только body. В самом верху напиши заголовок в теге h1, а под ним список с тремя пунктами и больше. Если порядок важен, бери ol с номерами, а если нет, то ul с точками. Тему выбирай сам: любимые игры или праздничные блюда. Схема подскажет дорогу.',
    'Three pages are lit! Now the fourth: your list. There’s only body here. At the very top, write a heading in the h1 tag, and under it a list with at least three items. If the order matters, use a numbered ol, and if not, a bulleted ul. Pick the topic yourself: favourite games or party food. The plan will show you the way.')
});

// ─────────────────────────────────────────────────────────────────────────────
// ПРАВИЛО «если поменять местами, смысл сломается?» — помощь, видная сразу (t1, t2).
// ─────────────────────────────────────────────────────────────────────────────
function A3Rule() {
  const pick = usePick();
  return (
    <div className="a3-rule" translate="no">
      <span className="a3-rule-q">{pick(UI.ruleQ)}</span>
      <span className="a3-rc" style={{ '--pc': A3_COL.ol }}><i>{pick(UI.yes)}</i><code>ol</code><em>{pick(UI.ruleOl)}</em></span>
      <span className="a3-rc" style={{ '--pc': A3_COL.ul }}><i>{pick(UI.no)}</i><code>ul</code><em>{pick(UI.ruleUl)}</em></span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Т1 и Т2 · один вид: h1 и </body> готовы, список (или одни li) — в редакторе. Проверка одна: список нужного тега
// с теми же словами. Т1 — поменять ul на ol в готовом коде, Т2 — обернуть пункты списком по смыслу.
// ─────────────────────────────────────────────────────────────────────────────
const a3ListCode = (tag, words) => ['  <' + tag + '>'].concat(words.map((t) => '    <li>' + t + '</li>'), ['  </' + tag + '>']).join('\n');
const a3LiCode = (words) => words.map((t) => '    <li>' + t + '</li>').join('\n');
const a3ListLines = (tag, words) => ['<' + tag + '>'].concat(words.map((t) => '  <li>' + t + '</li>'), ['</' + tag + '>']);
function a3ListCheck(code, words, want, wrongMsg) {
  const r = a3Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const L = B[0];
  if (L.kind !== 'list' || B.length > 1) return { ok: false, msg: FB.keepWords };
  if (L.tag !== want) return { ok: false, msg: wrongMsg };
  if (L.items.length !== words.length || L.items.some((it, i) => a3Norm(it.text) !== a3Norm(words[i]))) return { ok: false, msg: FB.keepWords };
  return { ok: true };
}
function a3ListView(head, tabNo) {
  return (st, x) => {
    const before = ['<body>', '  <h1>' + x.pick(head) + '</h1>'];
    const after = ['</body>'];
    return {
      title: x.pick(TABS[tabNo].name), blocks: a3Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A3Rule />,
      editor: <A3Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgU1 = (pick) => {
  const words = TABS[0].events.map(pick);
  const dr = XTRA2.candles.steps.map(pick);
  return {
    id: 't1', num: 1, kind: 'swap-list', C: C.t1,
    init: () => ({ code: a3ListCode('ul', words) }),
    check: (st) => a3ListCheck(st.code, words, 'ol', FB.orderNeed),
    view: a3ListView(TABS[0].name, 0),
    sample: (pk) => a3ListLines('ol', XTRA2.morning.map(pk)),
    drill: { init: () => ({ code: a3ListCode('ul', dr) }), check: (st) => a3ListCheck(st.code, dr, 'ol', FB.orderNeed), view: a3ListView(XTRA2.candles.h, 0) }
  };
};
const cfgU2 = (pick) => {
  const words = TABS[1].names.map(pick);
  const dr = XTRA2.wrap.steps.map(pick);
  return {
    id: 't2', num: 2, kind: 'wrap-list', C: C.t2,
    init: () => ({ code: a3LiCode(words) }),
    check: (st) => a3ListCheck(st.code, words, 'ul', FB.ulNeed),
    view: a3ListView(TABS[1].name, 1),
    sample: (pk) => a3ListLines('ul', XTRA2.shop.map(pk)),
    drill: { init: () => ({ code: a3LiCode(dr) }), check: (st) => a3ListCheck(st.code, dr, 'ol', FB.olNeeded), view: a3ListView(XTRA2.wrap.h, 1) }
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Т3 · найти строку и исправить: у одного пункта нет li — на странице он без точки (в ol — без номера).
// Нажать строку, потом написать её целиком: <li>слово</li>, слово не менять.
// ─────────────────────────────────────────────────────────────────────────────
function a3BareView(D, tag, V) {
  return (st, x) => {
    const words = D.items.map((t) => x.pick(t));
    const BAD = 3 + D.bad;
    const name = x.pick(D.h);
    const lines = a3Body(['<h1>' + name + '</h1>', '<' + tag + '>'].concat(words.map((t, n) => (n === D.bad ? '  ' + t : '  <li>' + t + '</li>')), ['</' + tag + '>']));
    const title = x.pick(TABS[2].name);
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(V.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(V.why[i] || V.why.step);
    };
    if (st.at == null) {
      return {
        title, blocks: a3Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: V.ask,
        editor: <A3Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title, blocks: a3Page(before.concat([st.code], after).join('\n')).blocks, ask: C.t3.ask2,
      editor: <A3Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a3BareCheck(st, word, V) {
  if (st.at == null) return { ok: false, msg: V.ask };
  const r = a3Plan(st.code, A3_LI);
  if (!r.ok) return r;
  if (a3Norm(r.texts.li) !== a3Norm(word)) return { ok: false, msg: fillL(FB.keepItem, { want: word }) };
  return { ok: true };
}
const cfgU3 = (pick) => {
  const T = TABS[2];
  const G = XTRA2.greet;
  return {
    id: 't3', num: 3, kind: 'find-fix-li', C: C.t3,
    init: () => ({ at: null, code: '' }),
    check: (st) => a3BareCheck(st, pick(T.items[T.bad]), C.t3),
    view: a3BareView({ h: T.name, items: T.items, bad: T.bad }, 'ul', C.t3),
    sample: (pk) => ['<li>' + pk(XTRA2.shop[1]) + '</li>'],
    drill: { init: () => ({ at: null, code: '' }), check: (st) => a3BareCheck(st, pick(G.items[G.bad]), C.t3.d), view: a3BareView(G, 'ol', C.t3.d) }
  };
};

// Т4 · своё — прежнее задание 5 (h1 и ul или ol с тремя li): номер 4, тексты C.t4; страница в целой практике — пятая,
// здесь четвёртая (TABS[4] → TABS[3] правит build-prac).
const cfgU4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, C: C.t4 });

const U1 = ({ p }) => <A3Task p={p} make={cfgU1} />;
const U2 = ({ p }) => <A3Task p={p} make={cfgU2} />;
const U3 = ({ p }) => <A3Task p={p} make={cfgU3} />;
const U4 = ({ p }) => <A3Task p={p} make={cfgU4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: два списка — гости (ul) и программа (ol). «Перемешать»: у гостей смысл тот же, у программы
// сломался (торт режут до прихода гостей). Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const H = XTRA2.hook;
  const [rec, put] = useRec('h2');
  const mixed = !!(rec && rec.done);
  const [flash, setFlash] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: mixed ? c.done : c.say, pose: mixed ? 'point' : 'hello' }]);
  const canGo = useAdvanceGate(mixed, spoken);
  const led = useIdleLed(!mixed, 0);
  const tabs = useA3Tabs(true);
  const tap = () => {
    if (mixed) return;
    sfx('off', true);
    setFlash(1);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const rev = (list) => (mixed ? list.slice().reverse() : list);
  const li = (t) => '<li>' + t + '</li>';
  const code = ['<h2>' + pick(H.gh) + '</h2>', '<ul>'].concat(rev(H.guests.map(pick)).map(li), ['</ul>', '<h2>' + pick(H.ph) + '</h2>', '<ol>'], rev(H.prog.map(pick)).map(li), ['</ol>']).join('\n');
  const lines = a3Body(a3Lines(code, false));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a3-sheet a3-fin a3-h2">
        <KzAsk text={mixed ? c.askDone : c.ask} />
        <div className="a3-work">
          <div className="a3-side">
            <A3Browser tabs={tabs} cur={0} title={pick(H.title)}><A3Doc blocks={a3Page(code).blocks} flash={flash} /></A3Browser>
          </div>
          <div className="a3-main">
            <A3Code lines={lines} />
            {!mixed ? (
              <div className="kz-row a3-row">
                <button type="button" className="kz-btn is-coral a3-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
                  {pick(UI.shuffle)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
