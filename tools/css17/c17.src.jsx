// =============================================================================
// КУРС «CSS» · Урок 17 — «Финальный проект»
// (облик «Редактор», как уроки курса HTML; 11.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css17/build.mjs → lessons/css/17-final-proekt.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 17 · «Финальный проект» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (11.11.2026, согласован с заказчиком: «да делай урок»). Повторение всего курса CSS одним сайтом. Сайт летнего
// лагеря Коди красив; сбой стирает весь CSS — остаётся голый HTML. Ученик возвращает стили за 16 станций, по одной на
// урок 1–16: правило целиком, селектор класса, hex из палитры, фон no-repeat и cover, text-align, width 100%, padding,
// border-radius / box-shadow / border-top, inline-block, flex, space-between, absolute, :hover scale, transition,
// animation по имени @keyframes, @media для телефона. Страница честная и растёт: правила прошлых станций остаются.
// Загадка (без имён): Коди думает, что вернуть такой сайт — это «тысяча строк» или чужой готовый шаблон. Разгадка:
// хватило около двадцати коротких правил — счёт на экране.
//
// ДУГА (21 экран; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка, чередуются:
//   s1 крючок (красивый сайт → сбой → «Tuzatish», путь из 16 станций; загадка)
//   k1 сборка правила из кусочков · k2 выбор селектора с живым результатом · k3 hex из палитры (Fill)
//   k4 перетащить no-repeat и cover · k5 text-align (Fill) · k6 исправить 600px → 100% (Debug & Fix)
//   k7 свойство на месте: padding (Fill) · k8 пары «код ↔ вид» · k9 выбор display · k10 display: flex (Fill)
//   k11 выбор justify-content · k12 выбор position · k13 :hover scale (Fill) · k14 transition (Fill)
//   k15 имя анимации (Fill) · k16 @media — column, окно компьютера и телефона (Fill)
//   boss большая проверка: пять поломок в любом порядке · q1 верно или нет · own свой стиль («Готово») · fin вывод.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: настоящий CSS на странице, значения проверяет браузер (CSS.supports, matchMedia, разбор
//     transition и animation); неверный вариант в выборе тоже честно встаёт на страницу — видно, что он делает.
//   · Ничего нового: только темы уроков 1–16. Помощь 1-2-3 — на каждой станции (лампочка), образец — на третьей ступени.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: bekat — станция пути; lager — лагерь; shapka — шапка сайта (класс shapka); karta — карточка.
// В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-17-final-proekt',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '17-dars. Yakuniy loyiha',
    ru: 'Урок 17. Финальный проект',
    en: 'Lesson 17. Final project'
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
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi modul', 'Следующий модуль', 'Next module'),
  next: L3("Sun'iy intellekt", 'Искусственный интеллект', 'Artificial intelligence'),
  fix: L3('Tuzatish', 'Починить', 'Fix it'),
  map: L3("Yo'l", 'Путь', 'Path'),
  doneRules: L3('tayyor: {n} ta qoida', 'готово: правил — {n}', 'done: {n} rules'),
  more: L3('yana {n} ta qoida', 'и ещё {n} правил', 'and {n} more rules'),
  empty: L3("bo'm-bo'sh", 'пусто', 'empty'),
  rulesWord: L3('ta qisqa qoida', 'коротких правил', 'short rules'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  mySite: L3('Mening lagerim', 'Мой лагерь', 'My camp'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broken, fix, done, ok, msgs, hints, why, found, fine, pairOk …; печатаются: eyebrow, ask, card, site.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт лагеря (не звучит).
  site: {
    title: L3('Kodi yozgi lageri', 'Летний лагерь Коди', 'Kodi’s summer camp'),
    menu: [L3('Bosh sahifa', 'Главная', 'Home'), L3("To'garaklar", 'Кружки', 'Clubs'), L3('Aloqa', 'Контакты', 'Contact')],
    alt: L3("Ko'l bo'yidagi chodirlar", 'Палатки у озера', 'Tents by the lake'),
    lead: L3("Yozda yetti kun: suzish, futbol va robotlar!", 'Семь дней лета: плавание, футбол и роботы!', 'Seven summer days: swimming, football and robots!'),
    cards: [L3('Suzish', 'Плавание', 'Swimming'), L3('Futbol', 'Футбол', 'Football'), L3('Robototexnika', 'Робототехника', 'Robotics')],
    badge: L3('Yangi', 'Новое', 'New'),
    button: L3('Yozilish', 'Записаться', 'Sign up')
  },
  s1: {
    eyebrow: L3('Yakuniy loyiha', 'Финальный проект', 'Final project'),
    say: L3("Salom! Qarang, bu yozgi lagerimizning sayti. Tepasi yam-yashil, ostida menyu, ko'l bo'yidagi rasm, kartalar, sichqoncha ustiga kelsa kattalashadigan tugma ham bor. Bularning hammasini CSS chizgan. Hozir saytni do'stlarimga yuboraman...",
      'Привет! Смотри, это сайт нашего летнего лагеря. Зелёная шапка, меню, фото, карточки и кнопка, которая растёт под мышкой. Всё это нарисовал CSS. Сейчас отправлю его друзьям...',
      'Hi! Look, this is our summer camp site. A green header, a menu, a photo, cards and a button that grows under the mouse. CSS drew all of it. I’m about to send it to my friends...'),
    broken: L3("Voy! Nima bo'ldi? Butun CSS o'chib ketibdi! Sayt oq-qora bo'lib qoldi, hamma narsa bir-birining ostiga tushib ketdi, rasm esa oynaga sig'mayapti. Lekin vahima qilmang: siz CSS kursining hamma mavzularini bilasiz-ku. Keling, saytni birga tiklaymiz! «Tuzatish» tugmasini bosing.",
      'Ой! Что случилось? Весь CSS стёрся! Сайт чёрно-белый, всё свалилось друг под друга, фото не влезает в окно. Но ты знаешь все темы CSS. Давай вернём сайт вместе. Нажми «Починить».',
      'Oh no! What happened? All the CSS got erased! The site is black and white, everything is piled up, and the photo doesn’t fit the window. But you know every CSS topic. Let’s bring the site back together. Tap “Fix it”.'),
    fix: L3("Mana, oldimizda o'n olti bekatli yo'l bor, har bir darsimizga bittadan. Har bir bekatda saytning bitta bo'lagini qaytarib berasiz, sayt esa asta-sekin yana chiroyli bo'lib boradi.",
      'Вот наш путь: шестнадцать станций, по одной на каждый урок. На каждой станции ты вернёшь сайту одну часть.',
      'Here’s our path: sixteen stops, one for each lesson. At each stop you’ll bring back one part of the site.'),
    done: L3("Rostini aytsam, biroz xavotirdaman. Menimcha, bunday saytni qaytarish uchun ming qator kod yozish kerak bo'ladi, yo bo'lmasa birovning tayyor shablonini olishga to'g'ri keladi. Siz nima deysiz, shunchalik ko'p kod kerakmi? Bekatlardan o'tib bo'lgach, yozgan qoidalarimizni birga sanab ko'ramiz.",
      'Но сначала загадка. По-моему, чтобы вернуть такой сайт, нужна тысяча строк кода или чужой готовый шаблон. Как думаешь? Ответ посчитаем вместе в конце.',
      'But first, a riddle. I think bringing back a site like this takes a thousand lines of code, or someone else’s ready-made template. What do you think? We’ll count the answer together at the end.'),
    askStart: L3('Qarang: lager sayti', 'Смотри: сайт лагеря', 'Look: the camp site'),
    ask: L3('«Tuzatish» tugmasini bosing', 'Нажми «Починить»', 'Tap “Fix it”'),
    askDone: L3("16 bekat — 16 dars", '16 станций — 16 уроков', '16 stops, 16 lessons')
  },

  // ── СТАНЦИИ ──
  k1: {
    eyebrow: L3('1-bekat · Qoida', 'Станция 1 · Правило', 'Stop 1 · A rule'),
    say: L3("Yo'lni birinchi bekatdan, eng boshidan boshlaymiz. Hozir sahifa oppoq-ku, keling, unga iliq och sariq fon qaytaramiz. Esingizdami, CSS qoidasi qanday tuziladi? Qoidani bo'laklardan yig'ing: ularni tartib bilan bosing yoki kodga olib boring.",
      'Первая станция, с самого начала. Помнишь, как устроено правило CSS? Пусть фон страницы будет светло-жёлтым. Собери правило из кусочков: нажимай их по порядку или перетаскивай в код.',
      'Stop one, from the very start. Remember how a CSS rule is built? Make the page background light yellow. Build the rule from pieces: tap them in order or drag them into the code.'),
    why: [
      L3("Shoshilmang: selektordan keyin oldin ochuvchi jingalak qavs keladi.", 'После селектора сначала идёт открывающая фигурная скобка.', 'After the selector comes the opening curly brace.'),
      L3("Qavs ochildi, endi xususiyat navbati: nimani o'zgartiramiz? Bizga fon rangi kerak.", 'После скобки — свойство: что меняем? Нам нужен цвет фона.', 'After the brace comes the property: what are we changing? We need the background color.'),
      L3("Xususiyat yozildi, endi uning ortidan ikki nuqta keladi.", 'После свойства идёт двоеточие.', 'After the property comes a colon.'),
      L3("Ikki nuqtadan keyin qiymat turadi. Bizga qaysi rang kerak edi?", 'После двоеточия — значение: какой цвет?', 'After the colon comes the value: which color?'),
      L3("Qiymat yozilgach, oxiriga nuqtali vergul qo'yiladi.", 'После значения — точка с запятой.', 'After the value comes a semicolon.'),
      L3("Eng oxirida qoidani jingalak qavs yopadi.", 'В конце правило закрывает фигурная скобка.', 'At the end, a closing curly brace.')
    ],
    hints: [
      L3("Qoida doim bir xil tartibda yoziladi: selektor, qavs, xususiyat, ikki nuqta, qiymat, nuqtali vergul va yopuvchi qavs.", 'Порядок: селектор, скобка, свойство, двоеточие, значение, точка с запятой, скобка.', 'The order: selector, brace, property, colon, value, semicolon, brace.'),
      L3("Kodda yonib turgan bo'sh joyga qarang-chi: hozir qaysi bo'lak navbatda turibdi?", 'Посмотри на горящее пустое место в коде: какой кусочек сейчас на очереди?', 'Look at the glowing empty spot in the code: which piece is next?'),
      L3("Kod ostiga namuna qo'yib qo'ydim. Bo'laklarni xuddi o'sha tartibda joylang.", 'Образец появился под кодом. Ставь кусочки в том же порядке.', 'An example appeared under the code. Place the pieces in the same order.')
    ],
    ok: L3("Zo'r! Sahifaga iliq och sariq fon qaytdi, birinchi bekat ortda qoldi!", 'Огонь! Странице вернулся тёплый фон. Первая станция готова!', 'Awesome! The page has its warm background back. Stop one is done!'),
    ask: L3("Qoidani bo'laklardan yig'ing", 'Собери правило из кусочков', 'Build the rule from pieces')
  },
  k2: {
    eyebrow: L3('2-bekat · Selektor', 'Станция 2 · Селектор', 'Stop 2 · Selector'),
    say: L3("Fon joyiga keldi! Endi kartalardagi yozuvlarni to'q ko'k qilmoqchiman, lekin faqat ularni, boshqa hech narsani emas. Buning uchun to'g'ri selektor kerak. Pastdan selektorni tanlang-da, sahifada nima o'zgarishini kuzating.",
      'Вторая станция — селекторы. Пусть надписи на карточках будут тёмно-синими, и больше ничего. Выбери селектор внизу и посмотри на страницу.',
      'Stop two, selectors. Make the text on the cards dark blue, and nothing else. Pick a selector below and look at the page.'),
    why: {
      div: L3("Teg selektori sahifadagi hamma div teglarini tanlab oldi: saytning tepa qismi ham, menyu ham ko'karib ketdi. Bizga esa faqat kartalar kerak edi.", 'Селектор тега выбрал все div: посинели и шапка, и меню. А нужны только карточки.', 'The tag selector picked every div: the header and the menu turned blue too. We only need the cards.'),
      '#karta': L3("Panjara belgisi id nomini qidiradi, sahifada esa karta degan id yo'q. Shuning uchun hech narsa o'zgarmadi. Kartalarda id emas, klass bor.", 'На странице нет элемента с id karta, поэтому ничего не изменилось. У карточек есть класс.', 'There’s no element with the id karta on the page, so nothing changed. The cards have a class.')
    },
    hints: [
      L3("Kodga qarang-chi: kartalarni boshqa elementlardan nima ajratib turadi?", 'Чем карточки отличаются от остальных элементов?', 'What sets the cards apart from the other elements?'),
      L3("Kartalarning o'z klassi bor, uning nomi karta. Selektor klassni tanlashi uchun esa boshida nuqta turadi.", 'У карточек есть класс karta. Селектор класса начинается с точки.', 'The cards have the class karta. A class selector starts with a dot.'),
      L3("Nuqta karta degan selektorni tanlang.", 'Выбери селектор «точка karta».', 'Pick the selector dot karta.')
    ],
    ok: L3("To'ppa-to'g'ri! Nuqta karta selektori faqat kartalarni topdi, qolgan hamma narsa o'z rangida qoldi.", 'В точку! Селектор класса выбрал только карточки.', 'Spot on! The class selector picked only the cards.'),
    ask: L3("Faqat kartalar yozuvi ko'k bo'lsin", 'Только надписи карточек — синие', 'Only the card text turns blue')
  },
  k3: {
    eyebrow: L3('3-bekat · Rang', 'Станция 3 · Цвет', 'Stop 3 · Color'),
    say: L3("Endi saytning tepa qismiga qarang: u ham oqarib qolibdi-ku! Kodda uning klassi shapka deb yozilgan. Keling, uni yana lagerimizning yashil rangiga bo'yaymiz: palitradagi rang kodini maydonga ko'chirib yozing.",
      'Третья станция — цвета. Пусть шапка будет фирменного зелёного цвета лагеря. Код цвета есть в палитре: перепиши его.',
      'Stop three, colors. Make the header the camp’s green. The color code is in the palette: copy it.'),
    palette: { name: L3('Lager rangi', 'Цвет лагеря', 'Camp color'), hex: '#1E9E72' },
    msgs: {
      empty: L3("Maydon hali bo'sh. Palitradagi rang kodini yozing.", 'Впиши код цвета.', 'Type the color code.'),
      noHash: L3("Oltita belgi yozilibdi, lekin boshida panjara belgisi yo'q. Hex kod doim panjara bilan boshlanadi.", 'Код начинается со знака решётки.', 'The code starts with a hash sign.'),
      len: L3("Belgilarni sanab ko'ring-chi: hex kodda panjaradan keyin aynan oltita belgi bo'ladi.", 'В hex-коде после решётки шесть знаков.', 'A hex code has six characters after the hash.'),
      other: L3("Bu ham rang, lekin lagerimizniki emas. Bizga palitradagi yashil kerak.", 'Это другой цвет. Нужен цвет лагеря из палитры.', 'That’s a different color. We need the camp color from the palette.'),
      bad: L3("Bunday rangni brauzer tanimadi. Palitradagi kodni belgima-belgi ko'chirib ko'ring.", 'Браузер не узнал этот цвет. Перепиши код из палитры знак за знаком.', 'The browser didn’t recognize that color. Copy the palette code character by character.')
    },
    hints: [
      L3("Rang kodi palitrada yozilgan: u panjara va oltita belgidan tuzilgan.", 'Код цвета написан в палитре: решётка и шесть знаков.', 'The color code is in the palette: a hash and six characters.'),
      L3("Oldin panjara belgisini qo'ying, keyin palitradagi oltita belgini ketma-ket yozing.", 'Сначала поставь решётку, потом шесть знаков из палитры.', 'Put the hash first, then the six characters from the palette.'),
      L3("Kod ostidagi namunani ko'chirib yozing-da, «Tekshirish»ni bosing.", 'Перепиши образец под кодом и нажми «Проверить».', 'Copy the example under the code and tap Check.')
    ],
    ok: L3("Ajoyib! Tepa qism yana yam-yashil, ustidagi yozuv esa oppoq. Uchinchi bekatni ham o'tdik.", 'Отлично! Шапка зелёная, надпись белая. Третья станция готова.', 'Great! The header is green and the text is white. Stop three is done.'),
    ask: L3("Tepa qism lager rangida bo'lsin", 'Шапка — цвета лагеря', 'The header in the camp color')
  },
  k4: {
    eyebrow: L3("4-bekat · Fon", 'Станция 4 · Фон', 'Stop 4 · Background'),
    say: L3("Yashil rang qaytdi, endi navbat tog'li rasmga. Uni tepa qismga qo'ydik-u, lekin rasm qayta-qayta takrorlanib, mayda bo'laklarga bo'linib ketibdi. Rasm bitta bo'lsin va butun tepa qismni qoplasin: so'zlarni bo'sh joylarga qo'ying.",
      'Четвёртая станция — фон. В шапку поставили картинку с горами, но она повторяется мелкими плитками. Пусть картинка будет одна и закроет всю шапку. Поставь слова на пустые места.',
      'Stop four, background. We put a mountain picture in the header, but it repeats like small tiles. Make it one picture covering the whole header. Put the words in the empty spots.'),
    why: [
      { repeat: L3("repeat inglizchada «takrorla» degani. Shuning uchun rasm yana mayda bo'laklarga bo'linib ketadi, bizga esa bitta rasm kerak.", 'repeat — то есть «повторяй»: снова будут плитки. Нам нужно «не повторять».', 'repeat means “repeat”: tiles again. We need “don’t repeat”.'),
        cover: L3("cover o'lcham haqida, uning joyi pastdagi background-size qatorida turibdi. Bu bo'sh joyga esa takrorlash haqidagi so'z keladi.", 'cover — слово размера, оно для background-size ниже. Здесь речь о повторе.', 'cover is a size word, it goes in background-size below. This spot is about repeating.') },
      { repeat: L3("repeat takrorlash haqida, o'lcham haqida emas. Bu yerga butun joyni qoplaydigan so'z kerak.", 'repeat — слово повтора, а не размера. Нужно слово «закрыть всё».', 'repeat is a repeating word, not a size. We need the word for covering everything.') }
    ],
    hints: [
      L3("Bo'sh joylar qaysi qatorda turganiga qarang: birinchisi takrorlash haqida, ikkinchisi o'lcham haqida.", 'Первое пустое место — про повтор, второе — про размер.', 'The first empty spot is about repeating, the second is about size.'),
      L3("Takrorlamaslik no-repeat deb yoziladi, butun joyni qoplash esa cover.", '«Не повторять» — no-repeat, «закрыть всё» — cover.', 'Don’t repeat is no-repeat; cover everything is cover.'),
      L3("Namunadagidek oldin no-repeat so'zini, keyin cover so'zini qo'ying.", 'Как в образце: сначала no-repeat, потом cover.', 'Like the example: first no-repeat, then cover.')
    ],
    ok: L3("Mana! Rasm butun tepa qismni qopladi. Yashil rang esa zaxirada turibdi: rasm yuklanmay qolsa, o'sha ko'rinadi.", 'Вот! Картинка закрыла всю шапку. А зелёный остался запасным: если картинка не загрузится, будет виден он.', 'There! The picture covers the whole header. And the green stays as a backup: if the picture doesn’t load, you’ll see it.'),
    ask: L3("Rasm bitta bo'lsin va tepa qismni qoplasin", 'Одна картинка на всю шапку', 'One picture over the whole header')
  },
  k5: {
    eyebrow: L3('5-bekat · Matn', 'Станция 5 · Текст', 'Stop 5 · Text'),
    say: L3("Tog'lar ham joyida! Endi sarlavhaga bir qarang-chi: u chap chetga yopishib qolibdi. Uni o'rtaga qo'yamiz: text-align uchun qiymat yozing.",
      'Пятая станция — текст. Заголовок прилип к левому краю. Поставь его по центру: впиши значение выравнивания.',
      'Stop five, text. The heading is stuck to the left edge. Center it: type the alignment value.'),
    msgs: {
      empty: L3("Hali hech narsa yozilmabdi. text-align uchun qiymat kerak.", 'Впиши значение.', 'Type the value.'),
      other: L3("Bunday qiymat bilan sarlavha o'rtaga kelmaydi. Boshqa so'z kerak.", 'Это значение не ставит заголовок по центру.', 'That value doesn’t center the heading.'),
      bad: L3("Brauzer bunday so'zni bilmaydi. Yozganingizni harfma-harf tekshirib ko'ring.", 'Браузер не узнал это слово. Проверь слово выравнивания.', 'The browser didn’t recognize that word. Check the alignment word.')
    },
    hints: [
      L3("«O'rta» inglizchada qanday deyiladi, esingizdami?", 'Как будет «центр» по-английски?', 'What’s the English word for the middle?'),
      L3("O'rta inglizchada center bo'ladi.", 'Центр — это center.', 'The middle is center.'),
      L3("Maydonga center deb yozing-da, «Tekshirish»ni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Barakalla! Sarlavha endi qoq o'rtada turibdi.", 'Молодец! Заголовок по центру.', 'Well done! The heading is centered.'),
    ask: L3("Sarlavhani o'rtaga qo'ying", 'Поставь заголовок по центру', 'Center the heading')
  },
  k6: {
    eyebrow: L3("6-bekat · O'lcham", 'Станция 6 · Размер', 'Stop 6 · Size'),
    say: L3("Bu safar o'zim chalkashtirib qo'yibman! Rasmga olti yuz piksel yozibman, u esa oynaga sig'mayapti. Rasm oyna qancha keng bo'lsa, shuncha keng bo'lsin: maydondagi qiymatni tuzating.",
      'Шестая станция — размеры. Я написал картинке шестьсот пикселей, и она не влезает в окно. Пусть картинка будет такой же ширины, как окно: исправь значение в поле.',
      'Stop six, sizes. I gave the picture six hundred pixels, and it doesn’t fit the window. Make the picture as wide as the window: fix the value in the field.'),
    msgs: {
      empty: L3("Maydon bo'shab qoldi. Yangi qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      px: L3("Piksel qaysar-ku: oyna torayganda ham o'zgarmaydi. Rasm sig'ishi uchun bu yerga foiz kerak.", 'Пиксели всегда одинаковые: в маленьком окне картинка всё равно не влезет. Нужны проценты.', 'Pixels always stay the same: in a small window the picture still won’t fit. We need percent.'),
      noUnit: L3("Son yozilibdi, lekin yonida birligi yo'q.", 'Число есть, а единицы нет.', 'There’s a number but no unit.'),
      otherPct: L3("Bunday foiz bilan rasm oynaning bir qismini egallaydi, xolos. Butun en uchun necha foiz kerak edi?", 'Это только часть окна. Сколько процентов — вся ширина?', 'That’s only part of the window. What percent is the whole width?'),
      bad: L3("Bu qiymat brauzerga notanish. Son yozing-da, yoniga foiz belgisini qo'ying.", 'Браузер не узнал это значение. Напиши число и знак процента.', 'The browser didn’t recognize that value. Write a number and a percent sign.')
    },
    hints: [
      L3("Qaysi birlik oyna bilan birga kengayib, torayadi?", 'Какая единица меняется вместе с окном?', 'Which unit changes with the window?'),
      L3("Oynaning butun eni yuz foiz bo'ladi.", 'Вся ширина — это сто процентов.', 'The whole width is a hundred percent.'),
      L3("Maydonni tozalang-da, yuz deb yozing, keyin foiz belgisini bosing.", 'Сотри поле, впиши сто и нажми знак процента.', 'Clear the field, type a hundred, then tap the percent sign.')
    ],
    ok: L3("Qoyil! Ko'l bo'yidagi rasm endi oynaga roppa-rosa sig'di.", 'Огонь! Картинка ровно по окну.', 'Awesome! The picture fits the window exactly.'),
    ask: L3("Rasm oyna kengligida bo'lsin", 'Картинка — по ширине окна', 'The picture as wide as the window')
  },
  k7: {
    eyebrow: L3('7-bekat · Box Model', 'Станция 7 · Box Model', 'Stop 7 · Box Model'),
    say: L3("Ko'l bo'yidagi rasm o'z joyida. Endi kartalarga qarang: yozuvlar karta chetiga tegib turibdi, nafas olishga joy yo'q. Bu yerda Box Model yordamga keladi: yozuvlarga ichkaridan joy beramiz. Qaysi xususiyat kerakligini yozing.",
      'Седьмая станция — Box Model. Надпись на карточках прилипла к краю. Дай ей место изнутри: впиши, какое свойство нужно.',
      'Stop seven, Box Model. The text on the cards is stuck to the edge. Give it room on the inside: type which property you need.'),
    msgs: {
      empty: L3("Bu yerga xususiyatning nomi yoziladi.", 'Впиши свойство.', 'Type the property.'),
      margin: L3("margin tashqi bo'shliq beradi: kartalar bir-biridan uzoqlashdi, yozuv esa hamon chetda. Bizga ichki bo'shliq kerak.", 'margin — это отступ снаружи: карточки разошлись, а надпись всё ещё у края. Нужен отступ внутри.', 'margin is the outside space: the cards moved apart, but the text is still at the edge. We need inside space.'),
      border: L3("border kartaga chegara chizadi, lekin ichkaridan joy bermaydi.", 'border — это рамка, места внутри она не даёт.', 'border is a frame, it doesn’t give room inside.'),
      other: L3("Bunday xususiyat yozuvga ichkaridan joy ochib bermaydi.", 'Это свойство не даёт места внутри.', 'That property doesn’t give room inside.'),
      bad: L3("Bu xususiyatni brauzer tanimadi. Nomini harfma-harf tekshirib ko'ring.", 'Браузер не узнал это свойство.', 'The browser didn’t recognize that property.')
    },
    hints: [
      L3("Kartada ichki bo'shliq ham, tashqi bo'shliq ham bor. Yozuvga qaysi biri kerak?", 'Есть отступ внутри и снаружи: какой нужен?', 'There’s inside and outside space: which one do we need?'),
      L3("Ichki bo'shliq padding deyiladi.", 'Отступ внутри — это padding.', 'Inside space is called padding.'),
      L3("padding so'zini yozing, keyin «Tekshirish»ni bosing.", 'Впиши padding и нажми «Проверить».', 'Type padding and tap Check.')
    ],
    ok: L3("Juda soz! Yozuvlar chetdan ajraldi, kartalarning ichida joy paydo bo'ldi.", 'Отлично! У надписи появилось место внутри.', 'Great! The text has room inside now.'),
    ask: L3("Yozuvga ichkaridan joy bering", 'Дай надписи место внутри', 'Give the text room inside')
  },
  k8: {
    eyebrow: L3('8-bekat · Kartalar', 'Станция 8 · Карточки', 'Stop 8 · Cards'),
    say: L3("Kartalarni bezash vaqti keldi, bu sakkizinchi bekat! Ularga uchta bezak kerak, har birining o'z kodi bor. Oldin chapdan kodni bosing, keyin o'ngdan o'sha kod beradigan ko'rinishni toping.",
      'Восьмая станция — красивые карточки. Карточкам нужны три украшения. Сначала нажми код слева, потом найди справа, как он выглядит.',
      'Stop eight, pretty cards. The cards need three decorations. First tap a code on the left, then find on the right what it looks like.'),
    cards: { rad: L3("Yumaloq burchaklar", 'Круглые углы', 'Round corners'), sh: L3('Ostida soya', 'Тень снизу', 'A shadow below'), top: L3('Tepada chiziq', 'Полоса сверху', 'A stripe on top') },
    why: {
      rad: L3("border-radius burchaklarni yumaloqlaydi. Qani, qaysi kartaning burchaklari yumaloq ekan?", 'border-radius скругляет углы. У какой карточки круглые углы?', 'border-radius rounds the corners. Which card has round corners?'),
      sh: L3("box-shadow elementning ostiga soya tushiradi. Soyasi bor kartani toping-chi.", 'box-shadow кладёт тень под элемент. У какой карточки тень?', 'box-shadow puts a shadow under the element. Which card has a shadow?'),
      top: L3("border-top faqat tepaga chiziq tortadi. Qaysi kartaning tepasida chiziq bor?", 'border-top — только полоса сверху. У какой карточки полоса сверху?', 'border-top is only the line on top. Which card has a stripe on top?')
    },
    pickFirst: L3("Oldin chapdagi kodni bosing.", 'Сначала нажми код слева.', 'First tap a code on the left.'),
    pairOk: {
      rad: L3("Ha, burchaklar yumaloqlandi!", 'Да, круглые углы!', 'Yes, round corners!'),
      sh: L3("Ana, soyasi ham tushdi!", 'Да, тень!', 'Yes, a shadow!'),
      top: L3("To'g'ri, tepasida chiziq paydo bo'ldi!", 'Да, полоса сверху!', 'Yes, a stripe on top!')
    },
    hints: [
      L3("Har bir koddagi xususiyat nomining oxirgi so'ziga qarang: u ko'p narsani aytib beradi.", 'Смотри на последнее слово в названии каждого свойства.', 'Look at the last word of each property name.'),
      L3("radius so'zi burchakni yumaloqlashni, shadow soyani, top esa tepani bildiradi.", 'radius — угол, shadow — тень, top — верх.', 'radius is a corner, shadow is a shadow, top is the top.'),
      L3("Yonib turgan kodni, keyin yonib turgan kartani bosing.", 'Нажми горящий код, потом горящую карточку.', 'Tap the glowing code, then the glowing card.')
    ],
    ok: L3("Uchala juft ham topildi! Kartalarning burchagi endi yumaloq, ostida soyasi, tepasida chizig'i ham bor.", 'Все пары собраны! Карточки теперь круглые, с тенью и с полосой сверху.', 'All matched! The cards are now rounded, with a shadow and a stripe on top.'),
    ask: L3("Kodni ko'rinishi bilan juftlang", 'Соедини код с тем, как он выглядит', 'Match each code to its look'),
    askPlace: L3("Endi bu kod beradigan ko'rinishni bosing", 'Теперь нажми, как выглядит этот код', 'Now tap the look this code gives')
  },
  k9: {
    eyebrow: L3('9-bekat · display', 'Станция 9 · display', 'Stop 9 · display'),
    say: L3("Kartalarimiz chiroyli bo'lib qoldi. Endi menyuga qarang-chi: uning bandlari ustma-ust turibdi, har biri butun bir qatorni egallab olgan. Ularni display bilan bir qatorga teramiz. Qaysi qiymat kerak?",
      'Девятая станция — display. Пункты меню стоят друг под другом, каждый занимает всю строку. Пусть они встанут рядом в одну строку. Какое значение нужно?',
      'Stop nine, display. The menu items are stacked, each one taking a whole line. Make them sit side by side on one line. Which value do you need?'),
    why: {
      block: L3("block har bir bandni yangi qatordan boshlaydi, shuning uchun hech narsa o'zgarmadi.", 'block ставит каждый пункт с новой строки: ничего не изменилось.', 'block puts each item on a new line: nothing changed.'),
      none: L3("Ana xolos, none menyuni butunlay yashirib qo'ydi! Menyusiz saytda adashib qolamiz-ku.", 'none совсем спрятал меню! А оно нам нужно.', 'none hid the menu completely! We need it.')
    },
    hints: [
      L3("Qaysi qiymat elementlarni bir qatorga qo'yadi-yu, ularning padding qiymatini ham saqlab qoladi?", 'Какое значение ставит элементы в строку и при этом сохраняет padding?', 'Which value puts elements in a line and still keeps their padding?'),
      L3("Bu so'z inline bilan block so'zlaridan yasalgan.", 'Это смесь inline и block.', 'It’s a mix of inline and block.'),
      L3("inline-block so'zini tanlang.", 'Выбери inline-block.', 'Pick inline-block.')
    ],
    ok: L3("Zo'r! Menyu bandlari bir qatorga terilib oldi.", 'Класс! Меню в одну строку.', 'Great! The menu is on one line.'),
    ask: L3("Menyu bir qatorda tursin", 'Меню — в одну строку', 'The menu on one line')
  },
  k10: {
    eyebrow: L3('10-bekat · Flexbox', 'Станция 10 · Flexbox', 'Stop 10 · Flexbox'),
    say: L3("Menyu joyida, endi yana kartalarga qaytamiz: ular hali ham ustma-ust turibdi. Esingizdami, flex bilan kartalarni ularning ota qutisi boshqaradi. Kodda bu quti «qator» degan klass bilan yozilgan. Unga display qiymatini yozing, kartalar esa yonma-yon tizilsin.",
      'Десятая станция — Flexbox. Карточки стоят друг под другом. Ими управляет родитель, то есть ряд. Пусть карточки встанут рядом: впиши значение display.',
      'Stop ten, Flexbox. The cards are stacked. Their parent, the row, controls them. Make the cards stand side by side: type the value for display.'),
    msgs: {
      empty: L3("Maydon hali bo'm-bo'sh. display uchun qiymat yozing.", 'Впиши значение.', 'Type the value.'),
      flexbox: L3("flexbox degan qiymat yo'q. So'z qisqaroq, oxiridagi box kerak emas.", 'Такого значения нет. Слово короче, без box.', 'There’s no such value. The word is shorter, without box.'),
      other: L3("Bunday qiymat kartalarni yonma-yon terib bermaydi.", 'Это значение не ставит карточки в ряд.', 'That value doesn’t put the cards in a row.'),
      bad: L3("Bu so'zni brauzer tanimadi. display uchun yozganingizni bir tekshirib ko'ring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.')
    },
    hints: [
      L3("O'ninchi darsda narsalarni qatorga tizgan so'z esingizdami?", 'Вспомни слово из десятого урока, которое ставит в ряд.', 'Remember the word from lesson ten that makes a row.'),
      L3("U so'z flex edi.", 'Это слово flex.', 'The word is flex.'),
      L3("flex deb yozing va natijani tekshirib ko'ring.", 'Впиши flex и нажми «Проверить».', 'Type flex and tap Check.')
    ],
    ok: L3("Barakalla! Kartalar yana bir qatorga tizildi.", 'Молодец! Карточки стоят в ряд.', 'Well done! The cards are in a row.'),
    ask: L3("Kartalar yonma-yon tursin", 'Карточки — рядом', 'Cards side by side')
  },
  k11: {
    eyebrow: L3('11-bekat · Tekislash', 'Станция 11 · Выравнивание', 'Stop 11 · Alignment'),
    say: L3("Endi kartalar yonma-yon, lekin hammasi chapga qisilib qolibdi. Ularni tekislash kerak: chetdagi kartalar chetlarga tegib tursin, oralaridagi bo'sh joy esa teng bo'lsin. justify-content uchun qaysi qiymat kerak?",
      'Одиннадцатая станция — выравнивание. Карточки прижались влево. Пусть крайние карточки касаются краёв, а промежутки между ними будут равными. Какое значение?',
      'Stop eleven, alignment. The cards are squeezed to the left. Make the outer cards touch the edges with equal gaps between them. Which value?'),
    why: {
      'flex-start': L3("flex-start hammasini boshiga, chap chetga yig'adi, shuning uchun hech narsa o'zgarmadi.", 'flex-start собирает всё в начале, слева. Ничего не изменилось.', 'flex-start gathers everything at the start, on the left. Nothing changed.'),
      center: L3("center kartalarni o'rtaga yig'ib qo'ydi, chetlarda esa bo'sh joy qolib ketdi.", 'center собрал всё в середине, по краям осталось пусто.', 'center gathered everything in the middle, leaving empty space at the edges.')
    },
    hints: [
      L3("Bo'sh joy qayerda qolishi kerak: chetlardami yoki kartalarning orasidami?", 'Где должно быть пустое место: по краям или между карточками?', 'Where should the empty space go: at the edges or between the cards?'),
      L3("Bo'sh joy faqat kartalarning orasida qoladi. between so'zi inglizchada «orasida» degani.", 'Пустое место только между карточками. between — то есть «между».', 'The space goes only between the cards. between means between.'),
      L3("Demak, space-between kerak, shuni tanlang.", 'Выбери space-between.', 'Pick space-between.')
    ],
    ok: L3("Juda zo'r! Kartalar endi butun qator bo'ylab bir tekis taralib turibdi.", 'Отлично! Карточки ровно стоят по всему ряду.', 'Great! The cards are spread evenly across the row.'),
    ask: L3("Kartalar chetlarga tegsin, oralari teng", 'Карточки до краёв, промежутки равные', 'Cards to the edges, equal gaps')
  },
  k12: {
    eyebrow: L3('12-bekat · position', 'Станция 12 · position', 'Stop 12 · position'),
    say: L3("«Yangi» belgisiga qarang-chi: u birinchi kartada matnning ichida tiqilib turibdi. Uni kartaning o'ng tepa burchagiga chiqaramiz. Kartaga relative allaqachon yozilgan, demak, u belgi uchun langar bo'lib turibdi. Xo'sh, belgiga qaysi position kerak?",
      'Двенадцатая станция — позиционирование. На первой карточке есть значок «Новое», но он стоит внутри текста. Пусть он выйдет в правый верхний угол карточки. У карточки уже relative. Какой position нужен значку?',
      'Stop twelve, positioning. The first card has a “New” badge, but it sits inside the text. Move it to the card’s top right corner. The card is already relative. Which position does the badge need?'),
    why: {
      static: L3("static bo'lsa, belgi oddiy oqimda qoladi: top bilan right unga ta'sir qilmaydi, shuning uchun u joyidan qimirlamadi.", 'static — обычный поток: top и right не работают, значок на месте.', 'static is the normal flow: top and right don’t work, the badge stays put.'),
      relative: L3("relative belgini o'z joyidan sal surdi, xolos. U hamon matnning ichida qolib ketdi.", 'relative только чуть сдвинул значок с его места, он всё ещё в тексте.', 'relative only nudged the badge from its spot, it’s still inside the text.')
    },
    hints: [
      L3("Belgi oddiy oqimdan chiqib, kartaning burchagiga yopishib olishi kerak. Qaysi qiymat shunday qila oladi?", 'Значок должен выйти из потока и прилипнуть к углу карточки.', 'The badge has to leave the flow and stick to the card’s corner.'),
      L3("Belgini oqimdan faqat absolute chiqara oladi. U langar bo'lgan kartaga qarab joy oladi.", 'Значение, которое ставит относительно родителя, — absolute.', 'The value that places it relative to the parent is absolute.'),
      L3("absolute variantini tanlang.", 'Выбери absolute.', 'Pick absolute.')
    ],
    ok: L3("Topdingiz! «Yangi» belgisi kartaning burchagiga xuddi stikerdek yopishib oldi.", 'Класс! Значок в углу, как наклейка.', 'Great! The badge is in the corner, like a sticker.'),
    ask: L3("«Yangi» belgisi burchakka chiqsin", 'Значок «Новое» — в угол', 'The “New” badge into the corner')
  },
  k13: {
    eyebrow: L3('13-bekat · hover', 'Станция 13 · hover', 'Stop 13 · hover'),
    say: L3("Sayt deyarli tayyor! Qolgan bekatlar uni jonlantiradi. Birinchisi hover: sichqoncha «Yozilish» tugmasining ustiga kelganda, tugma biroz kattalashsin. transform uchun qiymat yozing, keyin sichqonchani tugma ustiga olib boring yoki uni bosib ko'ring.",
      'Тринадцатая станция — hover. Когда мышка наводится на кнопку «Записаться», пусть она немного увеличивается. Впиши значение transform. Потом наведи мышку на кнопку или нажми её.',
      'Stop thirteen, hover. When the mouse comes over the “Sign up” button, make it grow a little. Type the value for transform. Then move the mouse over the button or tap it.'),
    sample: 'scale(1.1)',
    msgs: {
      empty: L3("Hali qiymat yo'q. transform uchun qiymat yozing.", 'Впиши значение.', 'Type the value.'),
      noParen: L3("Qavslar tushib qolibdi: oldin scale so'zi, keyin qavs ichida son yoziladi.", 'Нужны скобки: scale, потом число в скобках.', 'You need brackets: scale, then a number in brackets.'),
      small: L3("Bir yoki undan kichik son tugmani kattalashtirmaydi-ku. Birdan sal kattaroq son yozing.", 'Единица и меньше кнопку не увеличат. Напиши число чуть больше единицы.', 'One or less won’t make the button grow. Write a number a little bigger than one.'),
      big: L3("Bu juda katta-ku! Son bir yarimdan oshmasin.", 'Слишком большая! Не больше полутора.', 'Too big! No more than one and a half.'),
      rotate: L3("rotate tugmani aylantiradi, lekin kattalashtirmaydi. Bizga scale kerak.", 'Это поворачивает кнопку, а не увеличивает. Нужен scale.', 'That turns the button, it doesn’t make it bigger. We need scale.'),
      translate: L3("translate tugmani bir chetga suradi, xolos. Kattalashtirish uchun scale kerak.", 'Это сдвигает кнопку, а не увеличивает. Нужен scale.', 'That moves the button, it doesn’t make it bigger. We need scale.'),
      bad: L3("Brauzer bunday qiymatni tushunmadi. scale so'zini yozing-da, qavs ichiga son qo'ying.", 'Браузер не узнал это значение. Напиши scale и число в скобках.', 'The browser didn’t recognize that value. Write scale and a number in brackets.')
    },
    hints: [
      L3("transform so'zlaridan qaysi biri narsani kattalashtirardi?", 'Какое слово transform увеличивает?', 'Which transform word makes things bigger?'),
      L3("Bu so'z scale, qavs ichiga esa birdan sal kattaroq son yoziladi.", 'scale и в скобках число чуть больше единицы.', 'scale with a number a little bigger than one in brackets.'),
      L3("Kod ostidagi namunaga qarab yozing-da, «Tekshirish»ni bosing.", 'Перепиши образец под кодом и нажми «Проверить».', 'Copy the example under the code and tap Check.')
    ],
    ok: L3("Ura! Sichqoncha ustiga kelishi bilan tugma kattalashib qoldi.", 'Ура! Кнопка увеличивается под мышкой.', 'Hooray! The button grows under the mouse.'),
    ask: L3("Tugma sichqoncha ostida kattalashsin", 'Кнопка растёт под мышкой', 'The button grows under the mouse')
  },
  k14: {
    eyebrow: L3("14-bekat · transition", 'Станция 14 · transition', 'Stop 14 · transition'),
    say: L3("Tugma kattalashdi-yu, lekin bir zumda sakrab ketyapti. Keling, buni silliq qilamiz: tugma sekin, yumshoq kattalashsin. Buning uchun transition qatoriga xususiyat va vaqtni yozing.",
      'Четырнадцатая станция — плавный переход. Кнопка увеличивается рывком. Пусть растёт мягко: впиши для transition свойство и время.',
      'Stop fourteen, smooth change. The button jumps bigger in an instant. Make it grow softly: type the property and the time for transition.'),
    sample: 'transform 0.3s',
    msgs: {
      empty: L3("Hali hech narsa yozilmabdi-ku. Xususiyat bilan vaqtni yozing.", 'Впиши свойство и время.', 'Type the property and the time.'),
      noTime: L3("Xususiyat bor, lekin vaqt yozilmabdi. Unga son va s harfi kerak.", 'Нет времени: нужно число и буква s.', 'There’s no time: you need a number and the letter s.'),
      noUnit: L3("Vaqtning birligi tushib qolibdi: son yoniga s yoki ms qo'shing.", 'У времени нет единицы: s или ms.', 'The time has no unit: s or ms.'),
      prop: L3("Bu xususiyat tugmada umuman o'zgarmaydi-ku. Tugmada transform o'zgaryapti, shuni yozing.", 'Это свойство не меняется. У кнопки меняется transform.', 'That property doesn’t change. What changes on the button is transform.'),
      slow: L3("Juda sekin, tugma uxlab qoldi-ku! Vaqt uch soniyadan kam bo'lsin.", 'Слишком медленно, кнопка уснула. Пусть будет меньше трёх секунд.', 'Too slow, the button fell asleep. Keep it under three seconds.'),
      bad: L3("Brauzer bu yozuvni tushunmadi. Oldin xususiyatni, keyin bo'sh joy qoldirib, vaqtni yozing.", 'Браузер это не узнал. Напиши свойство, пробел и время.', 'The browser didn’t recognize that. Write the property, a space and the time.')
    },
    hints: [
      L3("O'ylab ko'ring-chi: tugmada nima o'zgaradi va qancha vaqtda?", 'Что меняется и за какое время?', 'What changes, and how fast?'),
      L3("O'zgaradigan xususiyat transform, vaqt esa soniyada yoziladi, masalan nol butun uch soniya.", 'Свойство — transform, время в секундах, например ноль целых три десятых.', 'The property is transform, the time in seconds, for example zero point three.'),
      L3("Namuna tayyor, u kod ostida turibdi: ko'chirib yozing-da, «Tekshirish»ni bosing.", 'Перепиши образец под кодом и нажми «Проверить».', 'Copy the example under the code and tap Check.')
    ],
    ok: L3("Mana! Tugma endi sakramaydi, asta-sekin, yumshoq kattalashadi.", 'Вот! Теперь кнопка растёт мягко.', 'There! Now the button grows smoothly.'),
    ask: L3("Tugma yumshoq kattalashsin", 'Кнопка растёт плавно', 'The button grows smoothly')
  },
  k15: {
    eyebrow: L3('15-bekat · Animatsiya', 'Станция 15 · Анимация', 'Stop 15 · Animation'),
    say: L3("Endi sarlavhadagi quyoshni ham jonlantiramiz! Kodda keyframes bilan aylanish rejasi yozib qo'yilgan, lekin quyosh hali qimirlamayapti. U to'xtamay aylanib tursin: animation qatoriga o'sha rejaning nomini yozing.",
      'Пятнадцатая станция — анимация. В коде есть рецепт вращения, то есть keyframes. Пусть солнце в заголовке всё время крутится. Впиши в animation имя рецепта.',
      'Stop fifteen, animation. The code has a spinning recipe, that is keyframes. Make the sun in the heading spin all the time. Type the recipe’s name into animation.'),
    msgs: {
      empty: L3("Rejaning nomi hali yozilmagan. Uni maydonga yozing.", 'Впиши имя рецепта.', 'Type the recipe’s name.'),
      miss: L3("Kodda bunday nomli reja yo'q. Nomini keyframes qatoridan harfma-harf ko'chiring.", 'keyframes с таким именем нет. Перепиши имя из строки keyframes буква в букву.', 'There’s no keyframes with that name. Copy the name from the keyframes line letter by letter.'),
      bad: L3("Rejaning nomi bitta so'z bo'ladi, unda belgilar bo'lmaydi.", 'Имя — одно слово, без знаков.', 'A name is one word, with no symbols.')
    },
    hints: [
      L3("keyframes qatoriga qarang: rejaning nomi shu so'zdan keyin yozilgan.", 'Имя рецепта написано после слова keyframes.', 'The recipe’s name is written after the word keyframes.'),
      L3("Rejaning nomi aylan.", 'Его имя — aylan.', 'Its name is aylan.'),
      L3("Maydonga aylan deb yozing, keyin «Tekshirish»ni bosing.", 'Впиши aylan и нажми «Проверить».', 'Type aylan and tap Check.')
    ],
    ok: L3("Voy, qarang, quyosh aylanyapti! Animatsiya ham joyiga qaytdi.", 'Ух ты, солнце крутится! Анимация готова.', 'Wow, the sun is spinning! The animation is ready.'),
    ask: L3("Quyosh aylansin", 'Солнце крутится', 'The sun spins')
  },
  k16: {
    eyebrow: L3('16-bekat · @media', 'Станция 16 · @media', 'Stop 16 · @media'),
    say: L3("Nihoyat, o'n oltinchi bekatga ham yetib keldik, bu eng oxirgisi! Saytni ko'pchilik telefondan ochadi, telefonda esa kartalar siqilib qoladi. Tor oynada ular ustma-ust tursin: flex-direction uchun qiymat yozing. Keyin telefon bilan kompyuterni almashtirib ko'ring.",
      'Шестнадцатая станция, последняя! На телефоне карточки сжимаются. Пусть в узком окне они стоят друг под другом: впиши значение flex-direction. Потом переключи телефон и компьютер.',
      'Stop sixteen, the last one! On a phone the cards get squeezed. Make them stack in a narrow window: type the value for flex-direction. Then switch between phone and computer.'),
    msgs: {
      empty: L3("Bu yer hali bo'sh turibdi. flex-direction uchun qiymat yozing.", 'Впиши значение.', 'Type the value.'),
      row: L3("row qator degani, kartalar hozir ham xuddi shunday turibdi. Ustma-ust qo'yish uchun boshqa so'z kerak.", 'row — это ряд, как сейчас. Для «друг под другом» нужно другое слово.', 'row is a row, just like now. Stacking needs another word.'),
      reverse: L3("Kartalar ustma-ust turdi-yu, lekin tartibi teskari bo'lib qoldi. Bizga oddiy ustun kerak.", 'Порядок стал обратным. Нужен обычный столбик.', 'The order got reversed. We need a plain column.'),
      bad: L3("Bu so'zni brauzer bilmaydi. «Ustun» degan so'zni qanday yozganingizni tekshiring.", 'Браузер не узнал это слово. Проверь слово «столбик».', 'The browser didn’t recognize that word. Check the word for column.')
    },
    hints: [
      L3("«Ustun» inglizchada nima bo'ladi?", 'Как будет «столбик» по-английски?', 'What’s the English word for a column?'),
      L3("Ustun inglizchada column bo'ladi.", 'Столбик — это column.', 'A column is column.'),
      L3("column deb yozing-da, «Tekshirish»ni bosing.", 'Впиши column и нажми «Проверить».', 'Type column and tap Check.')
    ],
    ok: L3("Ajoyib! Telefonda kartalar ustma-ust, kompyuterda esa qatorda turibdi. O'n olti bekatning hammasini bosib o'tdik!", 'Отлично! На телефоне карточки столбиком, на компьютере в ряд. Все шестнадцать станций готовы!', 'Great! On a phone the cards stack, on a computer they’re in a row. All sixteen stops are done!'),
    ask: L3("Telefonda kartalar ustma-ust", 'На телефоне — столбиком', 'Stacked on a phone')
  },

  boss: {
    eyebrow: L3('Katta tekshiruv', 'Большая проверка', 'The big check'),
    say: L3("Sayt to'liq tiklandi! Lekin do'stlarimga yuborishdan oldin bir sinab ko'raylik. Saytning nusxasini oldim-da, kodiga ataylab beshta xato qo'shib qo'ydim. Sahifaga qarang-chi: nimasi buzilgan? Buzilgan qatorlarni bittalab bosing, xohlagan tartibda.",
      'Теперь самое трудное испытание. Я скопировал сайт и сделал в коде пять ошибок. Посмотри на страницу: что сломано? Нажми каждую сломанную строку, в любом порядке.',
      'Now the hardest test. I copied the site and made five mistakes in the code. Look at the page: what’s broken? Tap every broken line, in any order.'),
    fine: L3("Yo'q, bu qator o'z ishini qilyapti: natijasi sahifada ko'rinib turibdi. Boshqa joyga qarang-chi: kartalar, rasm, menyu yoki tugmadan qaysi biri g'alati?", 'Эта строка работает: на странице видно, что она сделала. Что выглядит не так, как сказано в коде?', 'This line works: you can see what it did on the page. What doesn’t look the way the code says?'),
    found: {
      cls: L3("Topdingiz! Kodda klass nomi katta harf bilan yozilgan ekan. Brauzer uchun katta harfli Karta bilan kichik harfli karta ikki xil nom bo'ladi.", 'Есть! Имя класса было с большой буквы. Для браузера Karta и karta — разные имена.', 'Found it! The class name had a capital letter. To the browser, Karta and karta are different names.'),
      unit: L3("Ana, shu yerda ekan! Yuzning yonida o'lchov birligi yo'q edi, shuning uchun brauzer qiymatni tushunmagan.", 'Есть! У числа сто не было единицы.', 'Found it! The hundred had no unit.'),
      flex: L3("Ushladingiz! flexbox degan qiymat yo'q, display uchun flex yoziladi.", 'Есть! Значения flexbox нет, нужен flex.', 'Found it! There’s no value flexbox, it’s flex.'),
      color: L3("Ko'zingiz o'tkir ekan! orang emas, orange bo'lishi kerak edi.", 'Есть! Не orang, а orange.', 'Found it! Not orang, but orange.'),
      colon: L3("Xuddi o'sha! Bu qatorda ikki nuqta tushib qolgan edi.", 'Есть! Пропало двоеточие.', 'Found it! The colon was missing.')
    },
    hint1: L3("Sahifani tepadan pastga ko'zdan kechiring: qaysi joyi lager saytiga o'xshamay qolgan?", 'Что на странице сломано: карточки, фото, меню или кнопка?', 'What’s broken on the page: the cards, the photo, the menu or the button?'),
    hint2: L3("Buzuq joyning qoidasini kodda toping-da, undagi har bir so'z bilan belgini tekshirib chiqing.", 'Найди правило сломанного места и проверь в нём каждое слово и знак.', 'Find the rule for the broken spot and check every word and symbol in it.'),
    hint3: L3("Yonib turgan qatorni bosing.", 'Нажми горящую строку.', 'Tap the glowing line.'),
    ok: L3("Hamma buzuq qatorlar qo'lga tushdi! Endi saytimda bitta ham xato qolmadi.", 'Все пять найдены! Ты находишь ошибки как настоящий разработчик.', 'All five found! You catch bugs like a real developer.'),
    ask: L3('Buzilgan qatorlarni bosing', 'Нажми сломанные строки', 'Tap the broken lines')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Sayt butunlay soz! Do'stlarimga yuborishdan oldin bilimingizni ham tezgina sinab ko'raylik: beshta gap aytaman, har birini o'ylab, to'g'ri yoki noto'g'ri tugmasini bosing.", 'Теперь быстрая проверка по всему курсу. Я говорю фразу, а ты выбираешь: верно или неверно.', 'Now a quick check of the whole course. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3("Fikr", 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    hint1: L3("Bu fikr qaysi mavzu haqida ekan?", 'О какой теме эта фраза?', 'Which topic is this sentence about?'),
    hint2: L3("Bilganlarimizni bir yig'aylik: nuqta klassni bildiradi, padding ichki bo'shliq beradi, flex ota qutiga yoziladi, animation esa rejani nomi bilan chaqiradi.", 'Вспомни: точка — это класс, padding — внутри, flex пишут родителю, animation зовёт рецепт по имени.', 'Remember: a dot is a class, padding is inside, flex goes on the parent, and animation calls a recipe by name.'),
    items: [
      { t: L3("Nuqta bilan boshlangan selektor klassni tanlaydi.", 'Селектор с точкой в начале выбирает класс.', 'A selector starting with a dot picks a class.'), right: true, code: '.karta { color: navy; }',
        why: L3("Bu fikr rost: nuqta klassni, panjara esa id nomini tanlaydi.", 'Верно: точка — это класс, а решётка — id.', 'Right: a dot is a class, and a hash is an id.') },
      { t: L3("padding elementlar orasidagi tashqi bo'shliqni beradi.", 'padding — это отступ снаружи, между элементами.', 'padding is the outside space between elements.'), right: false,
        why: L3("Aslida padding ichki bo'shliq beradi, tashqi bo'shliqni esa margin qo'yadi.", 'На самом деле padding — отступ внутри, а снаружи — margin.', 'Actually padding is the inside space, and the outside one is margin.') },
      { t: L3("display flex kartalarning o'ziga emas, ularning ota qutisiga yoziladi.", 'display flex пишут не самим карточкам, а их родителю.', 'display flex goes on the cards’ parent, not on the cards themselves.'), right: true,
        why: L3("Bu fikr ham rost: ota quti o'z bolalarini qatorga teradi.", 'Верно: родитель выстраивает своих детей в ряд.', 'Right: the parent lines up its children.') },
      { t: L3("keyframes rejasining o'zi elementni harakatga keltiradi, animation shart emas.", 'keyframes сам двигает элемент, animation не нужен.', 'keyframes moves the element by itself, animation isn’t needed.'), right: false,
        why: L3("Aslida reja o'z-o'zidan ishlamaydi: animation uni nomi bilan chaqirishi kerak.", 'На самом деле рецепт сам не работает: animation должен позвать его по имени.', 'Actually the recipe does nothing on its own: animation has to call it by name.') },
      { t: L3("Bu qoida sakkiz yuz piksellik oynada ishlaydi.", 'Это правило сработает в окне шириной восемьсот пикселей.', 'This rule works in a window eight hundred pixels wide.'), right: false, code: '@media (max-width: 600px) { … }',
        why: L3("Aslida ishlamaydi: sakkiz yuz piksel olti yuz pikseldan katta, shuning uchun qoida uxlab yotadi.", 'На самом деле нет: восемьсот больше шестисот, правило спит.', 'Actually no: eight hundred is more than six hundred, so the rule sleeps.') }
    ],
    ok: L3("Selektor, padding, flex, animation va media haqidagi beshala gapda ham adashmadingiz! CSS qanday ishlashini chindan ham yaxshi tushunar ekansiz.", 'Всё верно! Ты по-настоящему понимаешь CSS.', 'All correct! You really understand CSS.')
  },
  own: {
    eyebrow: L3("O'z uslubingiz", 'Свой стиль', 'Your own style'),
    say: L3("Endi lager sayti sizniki! Sahifa fonini, tugma rangini va kartalarning burchaklarini o'zingiz tanlang. Har bir o'zgarish shu zahoti sahifada ko'rinadi. Hammasi tayyor bo'lsa, «Tayyor»ni bosing.",
      'Теперь сайт твой! Сам выбери фон страницы, цвет кнопки и скругление карточек. Результат сразу виден на странице. Потом нажми «Готово».',
      'Now the site is yours! Choose the page background, the button color and the card corners yourself. You’ll see the result right away. Then tap “Done”.'),
    msgs: {
      color: L3("Bunday rang brauzerga notanish ekan: \u2063{w}\u2064. Rangning nomini yoki kodini yozing.", 'Браузер не узнал такой цвет: \u2063{w}\u2064. Напиши название или код цвета.', 'The browser didn’t recognize this color: \u2063{w}\u2064. Write a color name or code.'),
      radius: L3("Burchaklar uchun son yozing-da, yoniga px qo'shing.", 'Для углов напиши число и px.', 'For the corners write a number and px.'),
      range: L3("Qirq pikseldan oshmasin, aks holda karta g'alati ko'rinib qoladi.", 'Не больше сорока пикселей, иначе карточка станет странной.', 'No more than forty pixels, or the card will look odd.')
    },
    hints: [
      L3("Har bir maydonga bittadan qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Birinchi ikkitasiga rang yoziladi, uchinchisiga esa px bilan son.", 'В первые два — цвета, в третье — число в px.', 'Colors in the first two, a number in px in the third.'),
      L3("Masalan, lavender, tomato va o'n olti px yozsa bo'ladi. Keyin «Tayyor»ni bosing.", 'Например: lavender, tomato и 16px. Потом нажми «Готово».', 'For example: lavender, tomato and 16px. Then tap “Done”.')
    ],
    ok: L3("Qoyil, juda chiroyli chiqdi! Bu endi sizning lageringiz sayti!", 'Ого, классно! Теперь это сайт твоего лагеря.', 'Wow, great! Now this is your camp’s site.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Yo'l boshida ming qator kod kerak bo'ladi, deb xavotir olgandim. Keling, endi sanab ko'ramiz: o'n olti bekatda siz atigi yigirmatacha qisqa qoida yozdingiz. Ishonasizmi? Ming qator ham, birovning shabloni ham kerak emas ekan, xavotirim bekor bo'lgan. Har bir qoida nima qilishini tushunsangiz, shuning o'zi yetarli.",
        'Вернёмся к загадке. Помнишь, я думал, что нужна тысяча строк? Давай посчитаем: на шестнадцати станциях ты написал всего около двадцати коротких правил. Я ошибся! Ни тысяча строк, ни чужой шаблон не нужны. Достаточно понимать каждое правило.',
        'Back to our riddle. Remember, I thought it would take a thousand lines? Let’s count: across sixteen stops you wrote only about twenty short rules. I was wrong! No thousand lines, no one else’s template. Understanding each rule is enough.'), k: 'riddle' },
      { text: L3("Ko'ring-chi, lager sayti endi sizning didingizda bezandi. Telefonda ham chiroyli ko'rinyapti-ku!", 'Смотри, это твой сайт, в твоих цветах. И на телефоне красиво!', 'Look, this is your site, in your own colors. It looks good on a phone too!'), k: 'own' },
      { text: L3("Rang, fon va matn saytga kayfiyat beradi.", 'Цвет, фон и текст задают сайту настроение.', 'Color, background and text set the site’s mood.'), k: 'look' },
      { text: L3("O'lcham, padding va bezaklar esa elementlarni chiroyli qiladi.", 'Размеры, padding и украшения делают элементы красивыми.', 'Sizes, padding and decorations make the elements look good.'), k: 'box' },
      { text: L3("display, Flexbox va position har bir narsani o'z joyiga qo'yadi.", 'display, Flexbox и position расставляют всё по местам.', 'display, Flexbox and position put everything in its place.'), k: 'place' },
      { text: L3("hover, transition va animatsiya saytni jonlantiradi, media esa uni telefonga moslaydi.", 'hover, transition и анимация оживляют сайт, а media подстраивает его под телефон.', 'hover, transition and animation bring the site to life, and media fits it to a phone.'), k: 'move' },
      { text: L3("Tabriklayman! Siz CSS kursini tugatdingiz va lager saytini boshidan oxirigacha o'zingiz tiklab berdingiz. Endi uni do'stlarimga bemalol yuboraman! Keyingi modulda sun'iy intellekt bilan tanishasiz va u yozgan kodni ham tushunadigan bo'lasiz. Ko'rishguncha!",
        'Поздравляю! Ты прошёл курс CSS и сам вернул сайт от начала до конца. В следующем модуле познакомишься с искусственным интеллектом и научишься понимать код, который он пишет. До встречи!',
        'Congratulations! You’ve finished the CSS course and brought the site back from start to finish yourself. In the next module you’ll meet artificial intelligence and learn to understand the code it writes. See you!') }
    ],
    roles: {
      look: L3('Rang, fon, matn', 'Цвет, фон, текст', 'Color, background, text'),
      box: L3("O'lcham va bezak", 'Размеры и украшения', 'Sizes and decoration'),
      place: L3('Joylashuv', 'Расположение', 'Layout'),
      move: L3('Harakat va telefon', 'Движение и телефон', 'Motion and phone')
    },
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broken: 1, fix: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, msgs: 1, miss: 1, fine: 1, found: 1,
  items: 1, right: 1, pairOk: 1, pickFirst: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, right: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c17-engine.jsx@*/

/*@FILE:c17-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c17.css@*/
`;
