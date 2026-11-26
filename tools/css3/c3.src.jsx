// =============================================================================
// КУРС «CSS» · Урок 3 — «Цвета»
// (облик «Редактор», как уроки курса HTML; 05.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css3/build.mjs → lessons/css/03-cveta.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Цвета» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (05.11.2026; упрощён 09.11.2026 по просьбе заказчика: «урок Цвета очень сложный»). Уроки 1–2: правило,
// style в head, селекторы, цвет по имени. Коди хочет заголовок ровно цвета своего логотипа, но среди имён такого нет.
// Ученик узнаёт три способа записать цвет: название (red, lightblue, darkblue), hex-код из палитры («#» и шесть
// знаков — код не учат наизусть, его берут из палитры) и rgb (три луча: 0 — выключен, 255 — на полную). hsl только
// назван в выводе. Загадка (без имён): Коди записал код логотипа маленькими буквами и думает, что цвет сломается;
// в выводе — «Совпадает!», регистр в hex неважен.
//
// ДУГА (17 экранов). Типы заданий — по разделу 3а навыка:
//   s1 крючок (имена не попадают в цвет логотипа → код попадает; загадка)
//   названия: s2 показ (red, blue, lightblue, darkblue) · s3 вписать green (Fill) · s4 пятно → название (выбор)
//   hex:      s5 показ (палитра: код под квадратиком) · s6 переписать код фиолетового из палитры (Fill) · s7 код верный или сломан (Sort)
//   rgb:      s8 показ (три луча, жёлтый, чёрный и белый) · s9 зелёный луч на полную — 255 (Fill) · s10 rgb → цвет (выбор)
//   поломки:  s11 показ (нет «#», пять знаков, gren) · s12 поставить «#» (Debug & Fix) · s13 найти сломанное правило
//   w1 правило целиком: абзац синий через rgb (перенос) · s14 свои цвета любым способом (Live, «Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//   На объяснениях (s2, s5, s8, s11) лампочка даёт помощь 1-2-3: на что смотреть, что это значит, пример из жизни.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: принимает ли браузер цвет — решает сам Chrome (CSS.supports): FA4F28 без «#», #FA4F2, gren —
//     не принимаются; #fa4f28 — тот же цвет, что #FA4F28.
//   · Узбекский — по /uzbekcha; в речи нет символов: «panjara belgisi», числа словами.
//
// СИСТЕМА СЛОВ: hex kod — шестнадцатеричный код (draft); palitra — палитра; nur — луч света.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-03-cveta',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '3-dars. Ranglar',
    ru: 'Урок 3. Цвета',
    en: 'Lesson 3. Colors'
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
  next: L3('Fon', 'Фон', 'Background'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
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
  // Страница Коди (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    hello: L3('Salom! Bu mening saytim.', 'Привет! Это мой сайт.', 'Hi! This is my site.'),
    hobby: L3("Men futbol va shaxmatni yaxshi ko'raman.", 'Я люблю футбол и шахматы.', 'I love football and chess.'),
    logo: L3('Logotip rangi', 'Цвет логотипа', 'Logo color'),
    heading: L3('Sarlavha rangi', 'Цвет заголовка', 'Heading color'),
    match: L3('Bir xil!', 'Совпадает!', 'A match!'),
    noMatch: L3('Boshqacha', 'Не тот', 'Different'),
    light: L3('Och', 'Светлый', 'Light'),
    dark: L3("To'q", 'Тёмный', 'Dark'),
    red: L3('qizil', 'красный', 'red'),
    green: L3('yashil', 'зелёный', 'green'),
    blue: L3("ko'k", 'синий', 'blue'),
    names: L3({ red: 'qizil', green: 'yashil', blue: "ko'k", black: 'qora', white: 'oq', yellow: 'sariq', purple: 'binafsha', orange: "to'q sariq" },
      { red: 'красный', green: 'зелёный', blue: 'синий', black: 'чёрный', white: 'белый', yellow: 'жёлтый', purple: 'фиолетовый', orange: 'оранжевый' },
      { red: 'red', green: 'green', blue: 'blue', black: 'black', white: 'white', yellow: 'yellow', purple: 'purple', orange: 'orange' })
  },
  s1: {
    eyebrow: L3('Aynan shu rang', 'Именно этот цвет', 'Exactly this color'),
    say: L3("Salom! Mana bu mening logotipim, rangi juda chiroyli-a? Saytimdagi sarlavha ham roppa-rosa shu rangda bo'lishini xohlayman. Rang nomlarini birma-bir sinab ko'rdim: orange, tomato, orangered. Lekin qarang-chi, hech biri xuddi o'sha rangni bermayapti. Qani, «Aylantirish» tugmasini bosing!",
      'Привет! У меня есть логотип, и цвет у него очень красивый. Хочу, чтобы заголовок на сайте был точно такого же цвета. Я попробовал имена цветов: orange, tomato, orangered. Но смотри, ни один не тот самый. Нажми «Превратить».',
      'Hi! I have a logo, and its color is really nice. I want the heading on my site to be exactly the same color. I tried color names: orange, tomato, orangered. But look, none of them is exactly it. Tap “Transform”.'),
    magic: L3("Voy, qarang! Endi sarlavha logotip bilan aynan bir xil rangda bo'ldi!", 'Вот! Теперь заголовок точно такого же цвета, как логотип.', 'There! Now the heading is exactly the logo’s color.'),
    magicP: L3("Qanday qildim deysizmi? Rangning nomi o'rniga uning kodini yozdim. Kod bilan esa istalgan rangni juda aniq berish mumkin.", 'Вместо имени цвета я написал код цвета. Кодом можно точно задать любой цвет.', 'Instead of a color name I wrote a color code. With a code you can give any color exactly.'),
    done: L3("Bugun siz rangni uch xil usulda yozishni o'rganasiz: nomi bilan, hex kod bilan va rgb bilan. Shu orada siz bilan bir bahslashib olay! Logotipim kodini kichik harflar bilan ham yozib ko'rdim. Mening fikrimcha, endi rang yo boshqacha chiqadi, yo umuman ishlamaydi. Siz-chi, qo'shilasizmi? Kim yutganini dars oxirida logotip yonidagi yozuv ko'rsatadi.",
      'Сегодня ты научишься записывать цвет тремя способами: названием, hex-кодом и через rgb. Но сначала маленькая загадка. Однажды я записал код логотипа маленькими буквами. По-моему, теперь цвет получится другой или вообще не сработает. Как думаешь? Ответ найдём вместе в конце урока.',
      'Today you’ll learn three ways to write a color: by name, with a hex code and with rgb. But first, a little riddle. Once I wrote the logo code in small letters. I think now the color will come out different, or not work at all. What do you think? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Kod bilan rang aniq mos keldi", 'Кодом цвет попал точно', 'The code hit the color exactly')
  },
  s2: {
    eyebrow: L3('Rang nomlari', 'Названия цветов', 'Color names'),
    say: L3("Keling, eng oson usuldan boshlaymiz: rangni nomi bilan yozamiz. Buning uchun color xususiyatiga rangning inglizcha nomini qo'yamiz. Hozir kodda red turibdi. Bu so'z inglizchada «qizil» degani, shuning uchun sarlavha ham qizil bo'lib turibdi.",
      'Начнём с самого простого способа: названия цвета. В свойство color пишем название по-английски. Сейчас у заголовка red, то есть красный.',
      'Let’s start with the easiest way: the color’s name. We write an English name into the color property. Right now the heading has red.'),
    sayBlue: L3("Endi red o'rniga blue yozdik. Ko'rdingizmi? Brauzer bu so'zni darrov tanidi-yu, sarlavhani ko'k rangga bo'yadi.", 'Меняем название на blue. Браузер знает это слово и красит заголовок в синий.', 'We change the name to blue. The browser knows this word and paints the heading blue.'),
    sayLight: L3("Qani, blue so'zining oldiga light qo'shib ko'ramiz. lightblue chiqdi, light esa inglizchada «och» degani. Sarlavha ham och ko'k bo'lib qoldi.", 'Добавим впереди light — получится lightblue, светло-синий.', 'Add light in front and we get lightblue, a light blue.'),
    sayDark: L3("light o'rniga dark qo'ysak-chi? Bu so'z «to'q» degani, shuning uchun darkblue sarlavhani to'q ko'k qilib qo'ydi.", 'А слово dark делает цвет тёмным: darkblue, тёмно-синий.', 'And the word dark makes it dark: darkblue.'),
    done: L3("Demak, rangni nomi bilan yozsa bo'ladi: red, blue, green. Brauzer yuzdan ortiq shunday nomni biladi. Faqat bitta shart bor: nom inglizcha bo'lishi va bo'sh joysiz, bitta so'z qilib yozilishi kerak.",
      'Значит, цвет можно записать названием: red, blue, green. Браузер знает больше ста названий. Только название пишется по-английски и одним словом, без пробелов.',
      'So a color can be written by name: red, blue, green. The browser knows more than a hundred names. The name is just in English and written as one word, without spaces.'),
    askStart: L3("Qarang: red — qizil", 'Смотри: red — красный', 'Watch: red'),
    askBlue: L3("blue — ko'k", 'blue — синий', 'blue'),
    askLight: L3("lightblue — och ko'k", 'lightblue — светло-синий', 'lightblue — light blue'),
    askDark: L3("darkblue — to'q ko'k", 'darkblue — тёмно-синий', 'darkblue — dark blue'),
    askDone: L3("Rangni nomi bilan yozsa bo'ladi", 'Цвет можно записать названием', 'A color can be written by name'),
    help: [
      L3("Kodga bir qarang-chi: har safar unda faqat rang nomi almashyapti, u color so'zidan keyin turadi. Sarlavha ham shu nom bilan birga rangini o'zgartiradi.", 'В коде меняется только одно слово — название цвета после color. Заголовок меняется вместе с ним.', 'Only one word changes in the code: the color name after color. The heading changes with it.'),
      L3("Nega shunday? Chunki brauzer rangni inglizcha nomidan taniydi. light «och», dark esa «to'q» degani, ular rang nomiga qo'shilib, bitta so'z bo'lib yoziladi.", 'Название — английское. light значит «светлый», dark — «тёмный». Они пишутся слитно с цветом, одним словом.', 'The name is English. light means pale, dark means deep. They join the color name as one word.'),
      L3("Rangli qalamlar qutisi bor-ku, har bir qalamda rangining nomi yozilgan. Siz nomini aytasiz, brauzer esa qutidan aynan o'sha qalamni olib, sarlavhani bo'yaydi. Rang nomlari ham xuddi shunday ishlaydi.", 'Это как коробка карандашей: на каждом написано название цвета. Называешь название — браузер берёт этот карандаш.', 'It’s like a box of pencils with a color name on each one. Say the name, and the browser takes that pencil.')
    ]
  },
  s3: {
    eyebrow: L3('Rang nomini yozing', 'Впиши название цвета', 'Type the color name'),
    say: L3("Endi navbat sizga! Sarlavhani yashil rangga bo'yab ko'ring. Yashil inglizchada green bo'ladi. Shu so'zni maydonga yozing-da, «Tekshirish»ni bosing.",
      'Теперь твоя очередь. Сделай заголовок зелёным. Зелёный по-английски — green. Впиши его в поле и нажми «Проверить».',
      'Now it’s your turn. Make the heading green. Type green into the field and tap “Check”.'),
    ask: L3("Sarlavhani yashil qiling", 'Сделай заголовок зелёным', 'Make the heading green'),
    msgs: {
      empty: L3("Maydon hali bo'm-bo'sh-ku. Bu yerga rangning inglizcha nomini yozing.", 'Поле пустое. Впиши название цвета по-английски.', 'The field is empty. Type the color name in English.'),
      notColor: L3("Brauzer bunday rangni bilmas ekan. Nomini inglizcha, harfma-harf to'g'ri yozib ko'ring.", 'Браузер не знает такого цвета. Напиши название по-английски и без ошибок.', 'The browser doesn’t know that color. Write the name in English, without typos.'),
      other: L3("Brauzer bu rangni tanidi, lekin sarlavha yashil bo'lmadi-ku. Yashil inglizchada green bo'ladi.", 'Браузер узнал цвет, но это не зелёный. Зелёный по-английски — green.', 'The browser knew the color, but it isn’t green. Green is green in English.')
    },
    hints: [
      L3("Sarlavha qaysi rangga kirishi kerak edi? Bizga aynan shu rangning inglizcha nomi kerak.", 'Каким должен стать заголовок? Нужно английское название этого цвета.', 'What color should the heading be? You need that color’s English name.'),
      L3("Yashil inglizchada besh harfli so'z bo'ladi, u g harfi bilan boshlanadi.", 'Зелёный по-английски — слово из пяти букв, начинается на g.', 'Green in English is a five-letter word starting with g.'),
      L3("Maydonga green deb yozing-da, «Tekshirish»ni bosing.", 'Впиши в поле green и нажми «Проверить».', 'Type green into the field and tap “Check”.')
    ],
    ok: L3("Zo'r! Sarlavha yam-yashil bo'ldi. Rangni nomi bilan yozishni uddaladingiz.", 'Здорово! Заголовок стал зелёным. Цвет записан названием.', 'Great! The heading turned green. You wrote a color by its name.')
  },
  s4: {
    eyebrow: L3('Qaysi nom?', 'Какое название?', 'Which name?'),
    say: L3("Endi aksincha o'ynaymiz: men rangni ko'rsataman, siz esa uning nomini topasiz. Qani, bu qaysi rang ekan?", 'Теперь наоборот. Я показываю цвет, а ты выбери его название.', 'Now the other way round. I show a color, and you pick its name.'),
    ask: L3("Bu rangning nomini tanlang", 'Выбери название этого цвета', 'Pick this color’s name'),
    right: L3("Topdingiz!", 'Точно!', 'Right!'),
    hint1: L3("Rangga yaxshilab qarang: u qanaqa rang ekan, ochmi yoki to'qmi?", 'Посмотри на цвет: какой он, светлый или тёмный?', 'Look at the color: what is it, light or dark?'),
    hint2: L3("Esingizdami: light «och», dark esa «to'q» degani.", 'Вспомни: light — светлый, dark — тёмный.', 'Remember: light means pale, dark means deep.'),
    rounds: [
      { right: 'green', opts: ['red', 'green', 'blue'], why: L3("Bu yashil rang, inglizchada uni green deyishadi.", 'Это зелёный, по-английски green.', 'This is green.') },
      { right: 'lightblue', opts: ['blue', 'lightblue', 'darkblue'], why: L3("Bu och ko'k, shuning uchun uning nomi light so'zi bilan boshlanadi.", 'Это светло-синий: впереди light.', 'This is a light blue: light in front.') },
      { right: 'darkblue', opts: ['lightblue', 'darkblue', 'black'], why: L3("Rang qorayib, to'q tortibdi-ku, shuning uchun nomining boshida dark turadi.", 'Это тёмно-синий: впереди dark.', 'This is a dark blue: dark in front.') }
    ],
    ok: L3("Barakalla! Rangni ko'rdingiz-u, nomini darrov topdingiz.", 'Молодец! Названия цветов ты знаешь.', 'Well done! You know the color names.')
  },
  s5: {
    eyebrow: L3('Palitradan kod', 'Код из палитры', 'A code from the palette'),
    say: L3("Nomlar qulay-ku, lekin hamma rangning ham nomi bo'lavermaydi. Mana, orange ham logotipdagidan boshqacha chiqdi. Shunday paytda palitra yordam beradi: rasm chizish dasturlarida har bir rangning ostida uning kodi yozib qo'yilgan.",
      'Названия удобны, но не у каждого цвета есть название. Вот orange: не такой, как на логотипе. В программах для рисования есть палитра: под каждым цветом написан его код.',
      'Names are handy, but not every color has a name. Here’s orange: not like the logo. Drawing programs have a palette: each color has its code written under it.'),
    sayLogo: L3("Endi palitradan logotip rangini topib, uning kodini qoidaga qo'ydik. Ana, sarlavha logotip bilan roppa-rosa bir xil bo'ldi!", 'Берём из палитры цвет логотипа и ставим его код в правило. Смотри, заголовок совпал с логотипом!', 'We take the logo color from the palette and put its code in the rule. Look, the heading matches the logo exactly!'),
    sayBlue: L3("Keyin boshqa kvadratchani, ko'kini oldik. Uning kodini yozdik-u, sarlavha ham shu zahoti ko'k bo'ldi.", 'Другой квадратик, синий. Берём его код — заголовок синий.', 'Another square, blue. We take its code, and the heading is blue.'),
    sayParts: L3("Endi kodlarning o'ziga yaqinroq qarang. Sezdingizmi, hammasi bir xil tuzilgan: oldin panjara belgisi, keyin oltita belgi keladi. Bu belgilar raqam yoki oltita harfdan biri bo'ladi: A, B, C, D, E, F. Bunday kodni hex kod deyishadi.",
      'Все коды устроены одинаково: сначала решётка, потом шесть знаков. Знаки — цифры и буквы от A до F. Такой код называется hex-код, то есть точный номер цвета.',
      'All the codes are built the same way: first a hash sign, then six symbols. The symbols are digits and letters A to F. Such a code is called a hex code, that is, the color’s exact number.'),
    done: L3("Xullas, aniq rang kerak bo'lsa, uning kodini palitradan olamiz: panjara belgisi va oltita belgi. Kodni yodlab olish shart emas, faqat belgima-belgi to'g'ri ko'chirsangiz bo'ldi.",
      'Значит, если нужен точный цвет, берём его код из палитры: решётка и шесть знаков. Учить наизусть не нужно — нужно только правильно переписать.',
      'So when you need an exact color, take its code from the palette: a hash sign and six symbols. No need to learn it by heart, just copy it correctly.'),
    askStart: L3("Qarang: orange — boshqacha", 'Смотри: orange — не тот', 'Watch: orange is different'),
    askLogo: L3("Palitradan — logotip rangi", 'Из палитры — цвет логотипа', 'From the palette: the logo color'),
    askBlue: L3("Palitradan — ko'k", 'Из палитры — синий', 'From the palette: blue'),
    askParts: L3("hex kod: # va 6 belgi", 'hex-код: # и 6 знаков', 'Hex code: # and 6 symbols'),
    askDone: L3("Aniq rang — palitradagi hex kod", 'Точный цвет — hex-код из палитры', 'An exact color is a hex code from the palette'),
    help: [
      L3("Palitraga e'tibor bering: har bir kvadratchaning ostida kod yozilgan. Qaysi kvadratchani tanlasak, qoidaga aynan o'shaning kodi borib tushadi.", 'Посмотри на палитру: под каждым квадратиком есть код. В правило попадает именно он.', 'Look at the palette: there’s a code under each square. That code goes into the rule.'),
      L3("Bu kod har doim panjara belgisi bilan boshlanadi, undan keyin oltita belgi keladi. Shuning uchun ko'chirayotganda bitta belgini ham tushirib qoldirmang.", 'Код — всегда решётка и шесть знаков. Нельзя потерять ни одного знака.', 'A code is always a hash sign and six symbols. Not a single symbol can be lost.'),
      L3("Telefon raqamini terayotganingizni tasavvur qiling: bitta raqamni adashtirsangiz, boshqa odamga qo'ng'iroq qilib qo'yasiz. hex kod ham shunday: kod aniq bo'lsa, rang ham aniq chiqadi.", 'Как номер телефона: одна неверная цифра — и попадёшь к другому человеку. Точный код — точный цвет.', 'It’s like a phone number: one wrong digit and you reach someone else. An exact code gives an exact color.')
    ]
  },
  s6: {
    eyebrow: L3('Koddan rang', 'Цвет по коду', 'Color by code'),
    say: L3("Bu safar rangni palitradan o'zingiz olasiz. Sarlavha binafsha bo'lsin: binafsha kvadratchaning ostidagi kodni topib, maydonga ko'chirib yozing. Panjara belgisi tugmasi pastda turibdi.",
      'Теперь возьми цвет из палитры сам. Сделай заголовок фиолетовым. Найди код под фиолетовым квадратиком и перепиши его в поле. Кнопка с решёткой есть внизу.',
      'Now take a color from the palette yourself. Make the heading purple. Find the code under the purple square and copy it into the field. There’s a hash sign button below.'),
    ask: L3("Palitradan binafsha rang kodini yozing", 'Впиши код фиолетового из палитры', 'Type the purple code from the palette'),
    msgs: {
      empty: L3("Maydonga hali hech narsa yozilmabdi. Binafsha kvadratchaning ostidagi kodni ko'chirib yozing.", 'Поле пустое. Перепиши код под фиолетовым квадратиком.', 'The field is empty. Copy the code under the purple square.'),
      noHash: L3("Kodning oldida panjara belgisi tushib qolibdi. Usiz brauzer bu belgilarni rang deb tanimaydi.", 'Перед кодом нет решётки. Без неё браузер не узнаёт цвет.', 'There’s no hash sign before the code. Without it the browser doesn’t know the color.'),
      badHex: L3("Kodda nimadir yetishmayapti shekilli. Palitradagi kod bilan belgima-belgi solishtirib ko'ring: panjaradan keyin oltita belgi bo'lishi kerak.", 'В коде что-то потерялось. Сверь с палитрой знак за знаком: их должно быть шесть.', 'Something got lost in the code. Compare it with the palette symbol by symbol: there should be six.'),
      notColor: L3("Brauzer bu yozuvni rang deb tanimadi. Palitradagi kodni o'zgartirmasdan ko'chirib yozing.", 'Браузер не узнал в этом цвет. Перепиши код из палитры.', 'The browser didn’t recognize this as a color. Copy the code from the palette.'),
      other: L3("Rang chiqdi-yu, lekin binafsha emas-ku. Aynan binafsha kvadratchaning ostidagi kodni oling.", 'Цвет получился, но это не фиолетовый. Возьми код именно под фиолетовым квадратиком.', 'You got a color, but not purple. Take the code under the purple square.'),
      near: L3("Oz qoldi! Faqat bitta belgi palitradagidan boshqacha bo'lib qolibdi. Kodni belgima-belgi solishtirib chiqing.", "Почти! Но один знак отличается от палитры. Сверь код знак за знаком.", "Almost! But one symbol differs from the palette. Compare the code symbol by symbol.")
    },
    hints: [
      L3("Palitrada to'rtta kvadratcha bor. Ulardan qaysi biri binafsha ekan?", 'В палитре четыре квадратика. Какой из них фиолетовый?', 'There are four squares in the palette. Which one is purple?'),
      L3("Binafsha eng oxirgisi. Uning ostidagi kodni panjara belgisi bilan birga ko'chiring.", 'Фиолетовый — последний. Перепиши код под ним вместе с решёткой.', 'Purple is the last one. Copy the code under it, hash sign included.'),
      L3("Panjara belgisi tugmasini bosing-da, keyin 8E44AD deb yozing.", 'Нажми кнопку с решёткой, потом впиши 8E44AD.', 'Tap the hash sign button, then type 8E44AD.')
    ],
    ok: L3("Ajoyib! Sarlavha binafsha rangga kirdi, chunki kodni belgima-belgi aniq ko'chirdingiz.", 'Отлично! Заголовок стал фиолетовым. Код переписан точно.', 'Great! The heading turned purple. You copied the code exactly.')
  },
  s7: {
    eyebrow: L3("Kod to'g'rimi?", 'Код верный?', 'Is the code right?'),
    say: L3("Qani, endi siz tekshiruvchisiz! Har bir qoidaga yaxshilab qarang-chi: undagi hex kod to'g'ri yozilganmi yoki buzilib qolganmi?", 'Теперь проверим коды. Посмотри на каждое правило: hex-код записан верно или сломан?', 'Now let’s check codes. Look at each rule: is the hex code written right, or is it broken?'),
    ask: L3("Kod to'g'rimi yoki buzilganmi?", 'Код верный или сломан?', 'Is the code right or broken?'),
    opts: { ok: L3("To'g'ri", 'Верный', 'Right'), bad: L3('Buzilgan', 'Сломан', 'Broken') },
    right: L3("Xuddi shunday!", 'Точно!', 'Right!'),
    hint1: L3("Oldin kodning boshiga qarang, keyin panjaradan keyingi belgilarni bittalab sanab chiqing.", 'Посмотри на начало кода, потом посчитай знаки.', 'Look at the start of the code, then count the symbols.'),
    hint2: L3("To'g'ri hex kodda panjara belgisi va undan keyin oltita belgi bo'ladi.", 'Верный hex-код — решётка и шесть знаков.', 'A right hex code is a hash sign and six symbols.'),
    items: [
      { code: '#2ECC71', right: 'ok', why: L3("Panjara belgisi joyida turibdi, belgilar ham roppa-rosa oltita, shuning uchun bu kod butun.", 'Решётка есть, знаков шесть. Всё на месте.', 'There’s a hash sign and six symbols. All good.') },
      { code: '2ECC71', right: 'bad', why: L3("Bu kodning boshida panjara belgisi yo'q ekan, usiz brauzer rangni tanimaydi.", 'В начале нет решётки.', 'There’s no hash sign at the start.') },
      { code: '#8E44A', right: 'bad', why: L3("Belgilarni sanab ko'ring-chi: beshta, bittasi tushib qolibdi.", 'Знаков пять, один потерялся.', 'Only five symbols; one got lost.') },
      { code: '#FFFFFF', right: 'ok', why: L3("Panjara ham bor, oltita belgi ham bor, bu oq rangning kodi.", 'Решётка и шесть знаков. Это белый.', 'A hash sign and six symbols. This is white.') }
    ],
    ok: L3("Zo'r! Endi buzilgan kodni bir qarashda taniysiz.", 'Здорово! Теперь сломанный код ты видишь сразу.', 'Great! Now you spot a broken code right away.')
  },
  s8: {
    eyebrow: L3('rgb — uchta nur', 'rgb — три луча', 'rgb: three lights'),
    say: L3("Hex kodni bildik, endi uchinchi usulga o'tamiz. Qiziq, ekran ranglarni qayerdan oladi? U har bir rangni uchta nurdan yig'adi: qizil, yashil va ko'k nurdan. rgb ichida har bir nurga bitta son yozamiz: son qancha katta bo'lsa, nur shuncha kuchli yonadi. Nol bo'lsa, nur o'chiq, ikki yuz ellik besh bo'lsa, to'liq yonadi. Hozir qarang: faqat qizil nur to'liq yonib turibdi.",
      'Цвет можно записать ещё одним способом. Экран собирает каждый цвет из трёх лучей: красного, зелёного и синего. В rgb мы пишем числом, сколько каждого луча. Ноль — луча нет, двести пятьдесят пять — на полную. Сейчас на полную горит только красный.',
      'There’s one more way to write a color. A screen builds every color from three lights: red, green and blue. In rgb we write how much of each light, as a number. Zero means no light, two hundred fifty-five means full. Right now only red is on full.'),
    sayBlue: L3("Endi qizil nurni o'chirib, ko'kini to'liq yoqdik. Ko'rdingizmi? Sarlavha ham ko'k bo'ldi.", 'Гасим красный и зажигаем синий на полную. Заголовок синий.', 'We switch red off and blue on full. The heading is blue.'),
    sayYellow: L3("Keyin qizil bilan yashilni birga yoqdik. Voy, qiziq-ku: ikkalasi qo'shilib, sariq rang chiqdi!", 'Теперь зажжём вместе красный и зелёный. Интересно: вместе они дали жёлтый!', 'Now let’s turn on red and green together. Interesting: together they make yellow!'),
    sayBlack: L3("Uchala nurni ham nolga tushirsak-chi? Ekranda yorug'lik qolmaydi, shuning uchun rang qop-qora chiqadi. Hammasini to'liq yoqsak esa, oppoq rang bo'ladi.", 'Если все лучи на нуле, экран тёмный, то есть чёрный. А если все на полную — белый.', 'If every light is at zero, the screen is dark, that is, black. If all are full, it’s white.'),
    done: L3("Shunday qilib, rgb qavsining ichida uchta son turadi: qizil, yashil va ko'k nur uchun. Har bir son noldan ikki yuz ellik beshgacha bo'ladi.", 'Значит, rgb — это три числа в скобках: красный, зелёный и синий свет. Каждое — от нуля до двухсот пятидесяти пяти.', 'So rgb is three numbers in brackets: red, green and blue light. Each goes from zero to two hundred fifty-five.'),
    askStart: L3("Qarang: qizil to'liq", 'Смотри: красный на полную', 'Watch: full red'),
    askBlue: L3("Ko'k to'liq", 'Синий на полную', 'Full blue'),
    askYellow: L3("Qizil va yashil — sariq", 'Красный и зелёный — жёлтый', 'Red and green make yellow'),
    askBlack: L3("Hammasi 0 — qora", 'Все 0 — чёрный', 'All 0 is black'),
    askDone: L3("rgb: uchta son, 0 dan 255 gacha", 'rgb: три числа от 0 до 255', 'rgb: three numbers from 0 to 255'),
    help: [
      L3("Kod ostidagi uchta rangli yo'lakni ko'ryapsizmi? Kodda ham uchta son bor: birinchisi qizil yo'lakni boshqaradi, ikkinchisi yashilini, uchinchisi esa ko'kini.", 'В коде три числа, а под ним три полосы. Первое число — красная полоса, второе — зелёная, третье — синяя.', 'The code has three numbers, and there are three bars below. The first number is the red bar, the second green, the third blue.'),
      L3("Har bir son nurning qanchalik kuchli yonishini bildiradi: nol bo'lsa, nur o'chiq turadi, ikki yuz ellik besh bo'lsa, to'liq yonadi. Son kattalashgan sari yo'lak ham to'lib boradi.", 'Число — это сила луча: ноль — луч выключен, двести пятьдесят пять — включён на полную.', 'The number is the light’s strength: zero is off, two hundred fifty-five is full on.'),
      L3("Konsert sahnasini ko'z oldingizga keltiring: tepada qizil, yashil va ko'k chiroq bor. Qaysi birini qanchalik yoqsangiz, sahna ham o'sha rangga kiradi. rgb ham ekranda xuddi shu ishni qiladi.", 'Это как сцена с тремя прожекторами: красным, зелёным и синим. Как их включишь, такого цвета и будет сцена.', 'It’s like a stage with three spotlights, red, green and blue. However you switch them on, that’s the stage’s color.')
    ]
  },
  s9: {
    eyebrow: L3('Yashil nurni yoqing', 'Зажги зелёный луч', 'Turn on green light'),
    say: L3("Endi nurlarni o'zingiz boshqarasiz! Qarang, qizil bilan ko'k o'chiq turibdi. Sarlavha yorqin yashil bo'lishi uchun yashil nurni to'liq yoqing: o'rtadagi bo'sh joyga nur uchun eng katta sonni yozing.", "Теперь управляй лучом сам. Красный и синий выключены. Чтобы заголовок стал ярко-зелёным, зажги зелёный луч на полную: в пустое место посередине впиши самое большое число для луча.", "Now you control the light. Red and blue are off. To make the heading bright green, turn green light on full: type the biggest number for a light into the empty spot in the middle."),
    ask: L3("Yashil nurni to'liq yoqing", 'Зажги зелёный на полную', 'Turn green on full'),
    msgs: {
      empty: L3("Yashil nur hali yonmadi, chunki maydon bo'sh. Bu yerga son yozing.", 'Поле пустое. Впиши число для зелёного луча.', 'The field is empty. Type a number for green light.'),
      notNum: L3("Bu yerga faqat son yoziladi, harf ham, belgi ham kerak emas.", 'Здесь нужно только число, без букв и знаков.', 'Only a number goes here, no letters or signs.'),
      big: L3("Bunchalik katta son bo'lmaydi: nur ikki yuz ellik beshdan kuchliroq yonolmaydi.", 'Такого большого числа не бывает: луч не горит сильнее двухсот пятидесяти пяти.', 'No number that big: light can’t go above two hundred fifty-five.'),
      small: L3("Yashil nur yondi, lekin hali to'liq emas: uning yo'lagi oxirigacha to'lmadi.", 'Зелёный горит, но не на полную. Посмотри на полосу: пусть она заполнится до конца.', 'Green is on, but not full. Look at the bar: let it fill all the way.')
    },
    hints: [
      L3("Kod ostidagi yashil yo'lakka qarang: nur to'liq yonsa, u oxirigacha to'ladi.", 'Посмотри на зелёную полосу. Она должна заполниться до конца.', 'Look at the green bar. It should fill all the way.'),
      L3("To'liq yonish uchun rgb yozuvidagi eng katta son kerak, u ikki yuz ellik besh bo'ladi.", 'Полный луч — самое большое число в rgb. Это двести пятьдесят пять.', 'Full light is the biggest number in rgb: two hundred fifty-five.'),
      L3("Maydonga 255 deb yozing-da, «Tekshirish»ni bosing.", 'Впиши в поле 255.', 'Type 255 into the field.')
    ],
    ok: L3("Ura! Yashil nur to'liq yondi, sarlavha ham yorqin yashil bo'ldi!", 'Ура! Заголовок ярко-зелёный. Луч горит на полную.', 'Hooray! The heading is bright green. You turned the light on full.')
  },
  s10: {
    eyebrow: L3('Qaysi rang?', 'Какой цвет?', 'Which color?'),
    say: L3("Endi o'yinni teskari aylantiramiz: kodni o'qib, rangni o'zingiz topasiz. rgb qavsidagi sonlarga qarang-chi, qanday rang chiqarkin?", 'Теперь прочитаем код. Посмотри на числа в rgb и выбери, какой получится цвет.', 'Now let’s read codes. Look at the numbers in rgb and pick which color comes out.'),
    ask: L3("Bu kod qaysi rangni beradi?", 'Какой цвет даст этот код?', 'Which color does this code give?'),
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Right!'),
    hint1: L3("Qaysi nur yonib turgan ekan? Uchta sondan qaysi biri ikki yuz ellik besh?", 'Какой луч горит? Какое число — двести пятьдесят пять?', 'Which light is on? Which number is two hundred fifty-five?'),
    hint2: L3("Sonlar tartibi doim bir xil: qizil, yashil, ko'k. Hammasi nol bo'lsa, qora chiqadi, hammasi to'liq bo'lsa, oq chiqadi.", 'Порядок всегда один: красный, зелёный, синий. Все нули — чёрный, все на полную — белый.', 'The order is always red, green, blue. All zero is black, all full is white.'),
    items: [
      { code: 'rgb(255, 0, 0)', right: 'red', why: L3("Bu yerda faqat birinchi son ikki yuz ellik besh, u esa qizil nurniki.", 'Горит только первый луч, красный.', 'Only the first light, red, is on.') },
      { code: 'rgb(0, 0, 0)', right: 'black', why: L3("Uchala son ham nol, hamma nur o'chiq, shuning uchun rang qora.", 'Все лучи на нуле — значит, чёрный.', 'Every light is zero, so it’s black.') },
      { code: 'rgb(0, 0, 255)', right: 'blue', why: L3("Bu yerda faqat oxirgi son to'liq, u esa ko'k nurniki.", 'Горит только последний луч, синий.', 'Only the last light, blue, is on.') },
      { code: 'rgb(255, 255, 255)', right: 'white', why: L3("Uchala nur ham to'liq yonib turibdi, ular qo'shilsa, oppoq rang chiqadi.", 'Все лучи на полную — значит, белый.', 'Every light is full, so it’s white.') }
    ],
    ok: L3("Barakalla! Endi rgb sonlariga qarab, rangni oldindan aytib bera olasiz.", 'Молодец! Ты умеешь читать rgb-код.', 'Well done! You can read rgb codes.')
  },
  s11: {
    eyebrow: L3('Rang qachon buziladi', 'Когда цвет ломается', 'When a color breaks'),
    say: L3("Rang kodi juda injiq bo'ladi. Bitta belgi o'zgarib qolsa ham, brauzer rangni tanimaydi va qoidani o'tkazib yuboradi. Hozircha hammasi joyida: sarlavha logotip bilan bir xil. Qani, logotip rangini ataylab buzib ko'raylik-chi, nima bo'larkin?",
      'Код — вещь очень точная. Одна ошибка в знаке — и браузер не узнаёт цвет и выбрасывает правило. Сейчас всё на месте: заголовок совпадает с логотипом. Давай нарочно сломаем.',
      'A code is a very exact thing. One wrong symbol and the browser doesn’t know the color and throws the rule away. Right now all is well: the heading matches the logo. Let’s break it on purpose.'),
    sayHash: L3("Oldin panjara belgisini olib tashladik. Voy, sarlavha qop-qora bo'lib qoldi! Chunki brauzer panjarasiz oltita belgini rang deb tanimadi.", 'Убираем решётку. Заголовок стал чёрным: браузер не узнал в шести знаках цвет.', 'We remove the hash sign. The heading went black: the browser didn’t see a color in the six symbols.'),
    sayFive: L3("Endi panjarani qaytardik, lekin bu safar bitta belgini tushirib yubordik, kodda beshta belgi qoldi. Ko'ryapsizmi? Sarlavha yana qora.", 'Решётка вернулась, но один знак потерялся, осталось пять. Опять не работает.', 'The hash sign is back, but one symbol got lost; five are left. It fails again.'),
    sayTypo: L3("Rang nomi bilan ham xuddi shunday bo'ladi. green o'rniga bitta harfi kam gren deb yozsak, brauzer bunday rangni umuman bilmaydi.", 'С названием так же. Напишем gren без одной буквы — браузер такого цвета не знает.', 'Same with names. Write gren with one letter missing, and the browser doesn’t know that color.'),
    done: L3("Demak, rang ishlamay qolsa, uchta narsani tekshiramiz: panjara belgisi bormi, belgilar oltitami, rang nomi harfma-harf to'g'ri yozilganmi.", 'Значит, если цвет не работает, проверяем три вещи: есть ли решётка, шесть ли знаков, без ошибок ли название.', 'So when a color doesn’t work, check three things: is there a hash sign, are there six symbols, is the name spelled right.'),
    askStart: L3("Hozir hammasi joyida", 'Сейчас всё на месте', 'All is well now'),
    askHash: L3("# yo'q — ishlamadi", 'Нет # — не работает', 'No #: it fails'),
    askFive: L3("5 ta belgi — ishlamadi", '5 знаков — не работает', '5 symbols: it fails'),
    askTypo: L3("gren — xato nom", 'gren — ошибка в названии', 'gren: a misspelled name'),
    askDone: L3("Tekshiring: #, 6 belgi, nom", 'Проверь: #, 6 знаков, название', 'Check: #, 6 symbols, the name'),
    help: [
      L3("Logotip yonidagi yozuvga ko'z tashlang: u goh «Bir xil», goh «Boshqacha» deb ko'rsatadi. Har safar kodda faqat bitta narsa o'zgaryapti.", 'Смотри на надпись у логотипа: «Совпадает» или «Не тот». Каждый раз в коде меняется что-то одно.', 'Look at the label by the logo: “A match” or “Different”. Each time one thing changes in the code.'),
      L3("Nega sarlavha qorayib qoladi? Chunki brauzer rangni tanimasa, bu qoidani o'tkazib yuboradi. Shunda sarlavha o'zining oddiy, qora rangida qolaveradi.", 'Цвет, который браузер не узнал, он выбрасывает. Тогда заголовок остаётся обычным, чёрным.', 'The browser throws away a color it doesn’t know. Then the heading stays plain black.'),
      L3("Konvertdagi manzilni o'ylab ko'ring: uy raqamidan bitta raqam tushib qolsa, pochtachi uyni topolmaydi. Brauzer ham kodda bitta belgi yetishmasa, rangni topa olmaydi.", 'Как адрес на письме: пропала одна цифра в номере дома — и почтальон не найдёт дом.', 'It’s like an address on a letter: miss one digit of the house number and the mail carrier can’t find the house.')
    ]
  },
  s12: {
    eyebrow: L3('Tuzating', 'Исправь', 'Fix it'),
    say: L3("Voy, bu mening kodim-ku! Sarlavhani logotip rangiga bo'yamoqchi edim, lekin u qop-qora chiqdi. Qani, kodimni tuzatib bering-da, «Tekshirish»ni bosing.",
      'Ой, это мой код. Заголовок должен был быть цвета логотипа, а получился чёрным. Исправь код и нажми «Проверить».',
      'Oops, this is my code. The heading should be the logo color, but it came out black. Fix the code and tap “Check”.'),
    ask: L3("Kodni tuzating", 'Исправь код', 'Fix the code'),
    msgs: {
      empty: L3("Maydon bo'shab qolibdi. Logotipning kodi FA4F28 edi: oldin panjara belgisini, keyin shu kodni yozing.", "Поле пустое. Код логотипа — FA4F28: впиши решётку и этот код.", "The field is empty. The logo code is FA4F28: type the hash sign and this code."),
      noHash: L3("Kodning oldida hali ham panjara belgisi yo'q-ku. Usiz rang ishlamaydi.", 'Перед кодом всё ещё нет решётки.', 'There’s still no hash sign before the code.'),
      bad: L3("Bu yozuvdan rang chiqmadi. Oltita belgiga tegmang, faqat ularning oldiga panjara belgisini qo'ying.", 'Браузер не узнал цвет. Шесть знаков не меняй, только поставь перед ними решётку.', 'The browser didn’t recognize a color. Don’t change the six symbols, just put a hash sign in front.'),
      other: L3("Rang ishladi-yu, lekin logotipnikidan boshqacha. Belgilarga tegmang, ular to'g'ri edi.", 'Цвет заработал, но не как на логотипе. Знаки не меняй.', 'The color works, but it isn’t the logo’s. Don’t change the symbols.')
    },
    hints: [
      L3("Kodning eng boshiga e'tibor bering: u yerda nimadir yetishmayapti.", 'Посмотри на начало кода. Там чего-то не хватает.', 'Look at the start of the code. Something is missing there.'),
      L3("Har qanday hex kod panjara belgisi bilan boshlanadi.", 'Hex-код всегда начинается с решётки.', 'A hex code always starts with a hash sign.'),
      L3("Namunani kod ostiga qo'yib qo'ydim: boshida panjara belgisi turibdi. Xuddi shunday yozing-da, «Tekshirish»ni bosing.", "В начале кода должна стоять решётка. Образец под кодом: перепиши его и нажми «Проверить».", "The code must start with a hash sign. The example is under the code: copy it and tap Check.")
    ],
    ok: L3("Rahmat! Sarlavha yana logotip bilan bir xil rangda. Ko'rdingizmi, bitta kichkina belgi hammasini hal qildi!", 'Спасибо! Заголовок снова совпал с логотипом. Один знак всё решил.', 'Thanks! The heading matches the logo again. One symbol fixed it all.')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Saytimda yana nimadir buzilibdi! Kodda uchta qoida bor, lekin ulardan birining rangi ishlamayapti. Sahifaga qarang-da, buzilgan qoidani topib, ustiga bosing.", 'Теперь проверь себя. В коде три правила, но цвет одного не работает. Посмотри на страницу и нажми сломанное правило.', 'Now check yourself. There are three rules in the code, but one color doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Birinchisi tuzaldi! Lekin endi saytda boshqa rang buzilibdi. Bu safar qaysi qoida ishlamayapti ekan?", 'Класс, первая ошибка найдена! Теперь сломался другой цвет. Какой?', 'Great, the first bug is found! Now another color broke. Which one?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Yo'q, bu qoida ishlayapti, uning rangi sahifada ko'rinib turibdi-ku. Sahifadagi qaysi narsa bo'yalmay qoldi?", 'Это правило работает: его цвет виден на странице. Что не покрасилось?', 'This rule works: its color shows on the page. What didn’t get colored?'),
    found: {
      typo: L3("Topdingiz! gren so'zida bitta harf tushib qolgan edi, to'g'risi green bo'ladi.", 'Есть! В gren потерялась буква. Правильно — green.', 'Found it! gren is missing a letter. It should be green.'),
      five: L3("Ana, ushladingiz! Bu hex kodda beshta belgi bor ekan, oltita bo'lishi kerak edi.", 'Есть! В hex-коде было пять знаков, а нужно шесть.', 'Found it! The hex code had five symbols, but it needs six.')
    },
    hint1: L3("Sahifaga yaxshilab qarang: qaysi narsa bo'yalmay qolibdi?", 'Посмотри на страницу: что осталось не покрашенным?', 'Look at the page: what stayed uncolored?'),
    hint2: {
      typo: L3("Abzas oddiy qora rangda qolibdi. p qoidasidagi rang nomini harfma-harf o'qib chiqing.", 'Абзац остался обычным, чёрным. Прочитай по буквам название цвета в правиле p.', 'The paragraph stayed plain black. Read the color name in the p rule letter by letter.'),
      five: L3("Sarlavha qora bo'lib qolibdi. h1 qoidasidagi hex kodning belgilarini bittalab sanang.", 'Заголовок остался чёрным. Посчитай знаки в hex-коде правила h1.', 'The heading stayed black. Count the symbols in the h1 rule’s hex code.')
    },
    hint3: {
      typo: L3("Buzilgan joy p qoidasida, gren so'zida. Shu qatorni bosing.", 'Ошибка в правиле p: gren. Нажми эту строку.', 'The bug is in the p rule: gren. Tap that line.'),
      five: L3("h1 qoidasiga qarang: undagi kodda belgilar beshta xolos. Shu qatorni bosing.", 'Ошибка в правиле h1: пять знаков. Нажми эту строку.', 'The bug is in the h1 rule: five symbols. Tap that line.')
    },
    ok: L3("Ana, sarlavha ham ko'karib, saytim yana rang-barang bo'ldi! Endi rang ishlamay qolsa, nima qilishni bilasiz: nomini ham, kodini ham tekshirasiz.", 'Супер! Обе ошибки найдены. Ты проверяешь цвета как настоящий дизайнер.', 'Super! Both bugs are found. You check colors like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi butun qoidani boshidan oxirigacha o'zingiz yozasiz! Abzasni p selektori tanlaydi-ku, uning matni ko'k bo'lsin. Lekin bu safar rangni nomi bilan emas, rgb bilan yozing. Esingizdami: ko'k uchun qizil bilan yashil nur o'chiq turadi, ko'k nur esa to'liq yonadi.",
      'Теперь напиши правило целиком сам. Пусть текст абзаца будет синим, только на этот раз через rgb. Вспомни: для синего красный и зелёный лучи выключены, а синий на полную. Селектор абзаца — p.',
      'Now write the whole rule yourself. Make the paragraph text blue, but this time with rgb. Remember: for blue, red and green light are off and blue is full. The paragraph selector is p.'),
    msgs: {
      empty: L3("Maydon bo'sh turibdi. Qoida bunday yoziladi: oldin selektor, keyin jingalak qavslar ichida xususiyat bilan qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar yetishmayapti: biri ochuvchi, biri yopuvchi bo'lishi kerak.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymatning o'rtasida ikki nuqta tushib qolibdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Abzasni p selektori tanlaydi, qoidani shu harf bilan boshlang.", 'Чтобы выбрать абзац, нужен селектор p.', 'To pick the paragraph you need the p selector.'),
      prop: L3("Matnning rangini color xususiyati beradi, shuni yozing.", 'Цвет текста задаёт свойство color.', 'The color property sets the text color.'),
      notRgb: L3("Abzas ko'k bo'ldi-ku, lekin bu safar rangni rgb bilan yozish kerak edi: rgb so'zi va qavs ichida uchta son.", 'Абзац синий, но в этот раз запиши через rgb: rgb и три числа в скобках.', 'The paragraph is blue, but this time write it with rgb: rgb and three numbers in brackets.'),
      rgbNeed: L3("Qiymatni rgb bilan yozing: oldin rgb so'zi, keyin qavs ichida uchta son keladi.", 'Запиши значение через rgb: слово rgb и три числа в скобках.', 'Write the value with rgb: the word rgb and three numbers in brackets.'),
      notColor: L3("Brauzer bu rgb yozuvini tanimadi. Qavslarni va sonlar o'rtasidagi vergullarni bir tekshirib ko'ring.", 'Браузер не узнал этот rgb. Проверь скобки и запятые между числами.', 'The browser didn’t recognize this rgb. Check the brackets and the commas between numbers.'),
      other: L3("Rang chiqdi, lekin bu ko'k emas. Ko'k uchun faqat ko'k nur to'liq yonadi: oxirgi son ikki yuz ellik besh, qolganlari nol.", 'Цвет получился, но не синий. Для синего на полную только последнее число.', 'You got a color, but not blue. For blue only the last number is full.')
    },
    hints: [
      L3("Abzasni qaysi selektor tanlaydi? Matnning rangi uchun-chi, qaysi xususiyat kerak?", 'Каким селектором выбирают абзац? Какое свойство нужно для цвета текста?', 'Which selector picks the paragraph? Which property sets the text color?'),
      L3("Selektor p bo'ladi, xususiyat esa color. rgb qavsida qizil nol, yashil nol, ko'k esa ikki yuz ellik besh.", 'Селектор p, свойство color. В rgb красный ноль, зелёный ноль, синий двести пятьдесят пять.', 'The selector is p, the property color. In rgb red is zero, green zero, blue two hundred fifty-five.'),
      L3("Kod ostida namuna paydo bo'ldi. Uni maydonga ko'chirib yozing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Qoyil! Abzas ko'k bo'ldi, butun qoidani esa boshidan oxirigacha o'zingiz yozdingiz!", 'Отлично! Абзац синий. Всё правило — целиком твоё.', 'Great! The paragraph is blue. You wrote the whole rule yourself.'),
    ask: L3("Abzasni rgb bilan ko'k qiling", 'Сделай абзац синим через rgb', 'Make the paragraph blue with rgb')
  },
  s14: {
    eyebrow: L3("O'z ranglaringiz", 'Свои цвета', 'Your own colors'),
    say: L3("Endi eng qiziq joyiga keldik: o'z sahifangizga ranglarni o'zingiz tanlaysiz! Xohlagan usulda yozing: nomi bilan, hex bilan yoki rgb bilan. Sarlavha uchun bitta rang, fon uchun esa boshqasini yozing-da, «Tayyor»ni bosing.",
      'Теперь выбери цвета для своей страницы. Можно любым способом: название, hex или rgb. Впиши один цвет для заголовка и другой для фона. Потом нажми «Готово».',
      'Now pick colors for your own page. Any way you like: a name, hex or rgb. Type one color for the heading and another for the background. Then tap “Done”.'),
    msgs: {
      notColor: L3("Brauzer bunday rangni bilmaydi: «\u2063{w}\u2064». Rang nomini harfma-harf tekshiring, hex uchun esa panjara va oltita belgi kerak.", "Браузер не знает такого цвета: «\u2063{w}\u2064». Проверь название, а для hex — решётку и шесть знаков.", "The browser doesn’t know that color: “\u2063{w}\u2064”. Check the name, and for hex a hash sign and six symbols."),
      same: L3("Sarlavha bilan fon bir xil rangda bo'lsa, sarlavha fonga qo'shilib, ko'rinmay qoladi-ku. Ikkalasiga har xil rang tanlang.", 'Если заголовок и фон одного цвета, заголовка не видно. Выбери разные цвета.', 'If the heading and the background are the same color, the heading disappears. Pick different colors.')
    },
    hints: [
      L3("Sizga qaysi rang yoqadi? Uni bilgan usulingizda yozavering.", 'Какой цвет тебе нравится? Запиши его любым способом.', 'Which color do you like? Write it any way.'),
      L3("Masalan, nomi bilan yozsa bo'ladi: red yoki gold. hex bilan yozsangiz, panjara va oltita belgi kerak.", 'Например, названием: red, gold. Или hex: решётка и шесть знаков.', 'For example, a name like red or gold. Or hex: a hash sign and six symbols.'),
      L3("Bir variant: sarlavhaga purple, fonga esa lavender yozing-da, «Tayyor»ni bosing.", 'Например, впиши purple для заголовка и lavender для фона. Потом нажми «Готово».', 'For example, type purple for the heading and lavender for the background. Then tap “Done”.')
    ],
    ok: L3("Sahifangiz qanday chiroyli bo'ldi-ya! Bu ranglarni o'zingiz tanladingiz.", 'Ого, как красиво! Это твои собственные цвета.', 'Wow, how pretty! These are your very own colors.'),
    ask: L3('Ikkita rangni yozing va «Tayyor»ni bosing', 'Впиши два цвета и нажми «Готово»', 'Type two colors and tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi men ranglar haqida bir nechta gap aytaman, lekin ularning hammasi ham rost emas. Qaysi biri to'g'ri, qaysi biri noto'g'ri ekanini siz ajratasiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapni bo'lib-bo'lib o'qing: u rang nomi haqidami, hex haqidami yoki rgb haqidami?", 'Прочитай фразу по частям: она про название, hex или rgb?', 'Read the sentence piece by piece: is it about a name, hex or rgb?'),
    hint2: L3("Darsda nimalarni ko'rganimiz esingizdami? Rang nomi inglizcha so'z bo'ladi, hex kod panjara va oltita belgidan tuziladi. rgb esa uchta nur: nol bo'lsa, nur o'chiq, ikki yuz ellik besh bo'lsa, to'liq yonadi. Gap shunga to'g'ri keladimi?",
      'Вспомни урок: название — английское слово, hex — решётка и шесть знаков, rgb — три луча, ноль — выключен, двести пятьдесят пять — на полную. Фраза с этим совпадает?',
      'Remember the lesson: a name is an English word, hex is a hash sign and six symbols, rgb is three lights, zero is off, two hundred fifty-five is full. Does the sentence match that?'),
    items: [
      { t: L3("red rangning nomi bo'ladi, brauzer uni taniydi.", 'red — это название цвета, браузер его знает.', 'red is a color name, and the browser knows it.'), right: true,
        why: L3("Bu gap rost: red qizil rangning inglizcha nomi, brauzer uni yaxshi biladi.", 'Верно: red — английское название красного.', 'Right: red is the English name for that color.') },
      { t: L3("hex kod panjara belgisi bilan boshlanadi.", 'Hex-код начинается с решётки.', 'A hex code starts with a hash sign.'), right: true,
        why: L3("Bu ham rost: hex kodda oldin panjara belgisi, keyin oltita belgi keladi.", 'Так и есть: решётка, потом шесть знаков.', 'That’s right: a hash sign, then six symbols.') },
      { t: L3("rgb qavsidagi uchala son nol bo'lsa, rang oq bo'ladi.", 'Если в rgb все три числа — ноль, цвет будет белым.', 'If all three numbers in rgb are zero, the color is white.'), right: false, code: 'rgb',
        why: L3("Aslida hamma nur o'chiq bo'lsa, ekran qorong'i bo'ladi, rang ham qora chiqadi.", 'На самом деле, если все лучи выключены, получается чёрный.', 'Actually, with every light off you get black.') },
      { t: L3("Qizil va yashil nur birga yonsa, sariq chiqadi.", 'Если вместе зажечь красный и зелёный луч, выйдет жёлтый.', 'If red and green light shine together, you get yellow.'), right: true, code: 'yel',
        why: L3("Rost, buni o'zimiz ko'rdik: qizil bilan yashil to'liq yonib, ko'k nol bo'lsa, sariq rang chiqadi.", 'Так и есть: в rgb красный и зелёный на полную, синий ноль — получается жёлтый.', 'That’s right: full red and green with zero blue in rgb makes yellow.') }
    ],
    ok: L3("Birorta gap sizni chalg'itmadi! Rang nomi ham, hex ham, rgb ham endi sizga tanish.", 'Всё верно! Ты отлично разбираешься в цветах.', 'All correct! You know colors really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi bahsimizni hal qilamiz! Mana, kichik harflar bilan yozilgan o'sha kod. Logotip yonidagi yozuvga qarang: «Bir xil!». Yutqazdim! Rang o'zgarmaydi, degan bo'lsangiz, siz haq chiqdingiz. hex kodda harflar katta bo'ladimi, kichikmi, farqi yo'q, rang o'sha-o'shaligicha qoladi.",
        'Вернёмся к загадке. Помнишь, я записал код логотипа маленькими буквами и думал, что цвет сломается? Смотри: «Совпадает!». Я ошибся. В hex-коде неважно, большие буквы или маленькие, цвет тот же самый.',
        'Back to our riddle. Remember, I wrote the logo code in small letters and thought the color would break? Look: “A match!”. I was wrong. In a hex code big or small letters don’t matter; the color is the same.'), k: 'riddle' },
      { text: L3("Mana, bu esa sizning sahifangiz, o'zingiz tanlagan ranglar bilan!", 'Смотри, это твоя страница в твоих собственных цветах!', 'Look, this is your page in the colors you picked yourself!'), k: null },
      { text: L3("Birinchi usul eng oson: rangni nomi bilan yozamiz, masalan, red, blue, green.", 'Цвет можно записать названием: red, blue, green.', 'A color can be written by name: red, blue, green.'), k: 'name' },
      { text: L3("Aniq rang kerak bo'lsa, hex kodni olamiz: panjara belgisi va oltita belgi.", 'Для точного цвета — hex-код: решётка и шесть знаков.', 'For an exact color, a hex code: a hash sign and six symbols.'), k: 'hex' },
      { text: L3("rgb esa rangni uchta nurdan yig'adi: qizil, yashil va ko'k nurdan.", 'А rgb — три луча: красный, зелёный и синий.', 'And rgb is three lights: red, green and blue.'), k: 'rgb' },
      { text: L3("Yana bitta usul ham bor, uning nomi hsl. U bilan keyinroq tanishamiz.", 'Есть ещё один способ, hsl. С ним познакомишься позже.', 'There’s one more way, hsl. You’ll meet it later.'), k: 'hsl' },
      { text: L3("Tabriklayman! Endi istalgan rangni, hatto nomi yo'q rangni ham yoza olasiz. Keyingi darsda esa fon bilan ishlaymiz. Ko'rishguncha!", 'Ура! Теперь ты можешь записать любой цвет. На следующем уроке поработаем с фоном. До встречи!', 'Hooray! Now you can write any color. Next time we’ll work with backgrounds. See you!'), k: null }
    ],
    roles: {
      name: L3('nom — red, blue', 'название — red, blue', 'name — red, blue'),
      hex: L3('hex — # va 6 belgi', 'hex — # и 6 знаков', 'hex — # and 6 symbols'),
      rgb: L3('rgb — 3 ta nur', 'rgb — 3 луча', 'rgb — 3 lights'),
      hsl: L3('hsl — keyinroq', 'hsl — позже', 'hsl — later')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayBlue: 1, sayLight: 1, sayDark: 1,
  sayLogo: 1, sayParts: 1, sayYellow: 1, sayBlack: 1, sayHash: 1, sayFive: 1, sayTypo: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, rounds: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 }, rounds: { right: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c3.css@*/
`;
