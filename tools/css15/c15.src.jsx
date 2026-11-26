// =============================================================================
// КУРС «CSS» · Урок 15 — «CSS-анимации»
// (облик «Редактор», как уроки курса HTML; 07.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css15/build.mjs → lessons/css/15-animacii.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 15 · «CSS-анимации» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (07.11.2026). Уроки 1–14: правило, селекторы, цвета, размеры, Box Model, Flexbox, позиционирование, hover,
// transform, transition. Герой игры Коди — оранжевый кубик — застыл, а Коди хочет, чтобы он двигался сам, без мышки.
// Ученик узнаёт @keyframes (план движения: from/to и кадры в процентах) и animation (имя, время, сколько раз —
// число или infinite, linear, alternate), и поломки: имя с опечаткой, нет времени, кадр без %. Загадка (без имён):
// Коди пишет в animation «Sakra» с большой буквы и думает, что это то же слово. Разгадка: имена различают регистр.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (кубик стоит → @keyframes sakra + animation: прыгает сам; загадка про Sakra)
//   основа:   s2 показ (план без animation · один раз · infinite) · s3 вписать имя aylan (Fill) · s4 transition или animation (Sort)
//   кадры:    s5 показ (from/to рывком · 0% 50% 100% · 3 раза) · s6 вписать 50% (Fill) · s7 сколько раз (Sort)
//   скорость: s8 показ (ease · linear · рывок в начало · alternate) · s9 вписать linear (Fill) · s10 что дописать (Sort)
//   поломки:  s11 показ (sakr, без времени, 50 без %) · s12 исправить «sakra infinite» (Debug & Fix) · s13 найти правило
//   w1 правило целиком: .kub { animation: aylan 2s linear infinite; } · s14 своя анимация («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: @keyframes — настоящий <style> на странице (имена со своей приставкой, чтобы две страницы на
//     экране не мешали друг другу); имя в animation без своего @keyframes остаётся как есть — браузер ничего не находит.
//     Полоса анимаций под страницей — по событию animationstart и getComputedStyle; ненайденное имя — серая строка «—».
//     Верная ли запись — решает Chrome (CSS.supports, style.animation).
//   · Не забегаем: animation-delay, fill-mode, steps(), несколько анимаций через запятую.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: harakat rejasi — @keyframes; kalit kadrlar — keyframes; animatsiya — animation; cheksiz — infinite;
// borib-qaytish / navbatma-navbat — alternate; tekis — linear; foiz — %. В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-15-animacii',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '15-dars. CSS animatsiyalar',
    ru: 'Урок 15. CSS-анимации',
    en: 'Lesson 15. CSS animations'
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
  next: L3("Moslashuvchan sayt", 'Адаптивность', 'Responsive design'),
  mainAx: L3("asosiy o'q", 'главная ось', 'main axis'),
  crossAx: L3("ko'ndalang o'q", 'поперечная ось', 'cross axis'),
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
  // Страница игры Коди (не звучит).
  site: {
    title: L3("Kodining o'yini", 'Игра Коди', 'Kodi’s game'),
    p1: L3("Bu kubik o'yinning qahramoni.", 'Этот кубик — герой игры.', 'This cube is the game’s hero.'),
    p2: L3("Rekord: 120 ochko.", 'Рекорд: 120 очков.', 'Record: 120 points.')
  },
  s1: {
    eyebrow: L3("Jonsiz qahramon", 'Неживой герой', 'A lifeless hero'),
    say: L3("Salom! Tanishing, mana bu to'q sariq kubik o'yinimning qahramoni. Lekin u xuddi rasmdek qotib turibdi-ku. O'tgan darsda transition bilan tugmani silliq o'zgartirgandik, u esa sichqonchani kutib turardi. Men esa kubigim hech kim tegmasa ham o'zi sakrab tursin deyman. Uni uyg'otish uchun «Aylantirish» tugmasini bosing.",
      'Привет! Смотри, герой моей игры — оранжевый кубик. Но он застыл, как картинка. На прошлом уроке мы сделали плавное изменение через transition, но ему нужна была мышка. А я хочу, чтобы кубик прыгал сам, даже если его никто не трогает. Нажми «Превратить».',
      'Hi! Look, the hero of my game is an orange cube. But it’s frozen, like a picture. Last lesson we made a smooth change with transition, but it needed the mouse. I want the cube to jump by itself, even when nobody touches it. Tap “Transform”.'),
    magic: L3("Ana, uyg'ondi! Kubik hech kim tegmasa ham, to'xtamasdan sakrab turibdi.", 'Вот! Кубик прыгает сам, без мышки и без остановки.', 'There! The cube jumps by itself, without the mouse and without stopping.'),
    magicP: L3("Kubikni ikki narsa uyg'otdi. Birinchisi keyframes: bu harakat rejasi, unda kubik boshida qayerda, o'rtasida qayerda turishi yozilgan. Ikkinchisi animation: u shu rejani kubikka ulab beradi. Pastdagi vaqt chizig'i esa animatsiyaning nomini va vaqtini ko'rsatib turibdi.", 'Это сделали две вещи. keyframes — план движения, то есть где кубик в начале, где в середине. А animation подключает этот план к кубику. Полоса внизу показывает имя анимации и время.', 'Two things did it. keyframes is a movement plan, meaning where the cube is at the start and where in the middle. animation connects that plan to the cube. The bar below shows the animation’s name and time.'),
    done: L3("Bugun siz ham sahifadagi narsalarni o'zi harakatlanadigan qilishni o'rganasiz. Hozir esa men o'zim bilan bahslashib qoldim. animation qatoriga rejaning nomini bosh harfini katta qilib, Sakra deb yozdim. Ichimdagi bir Kodi «Baribir o'sha so'z-ku, kubik sakraydi!» deyapti, ikkinchisi esa «Brauzer injiq, sakramaydi!» deyapti. Men birinchisiga ishonaman. Siz-chi, qaysi Kodi haq? Buni dars oxirida sinab ko'ramiz.",
      'Сегодня ты научишься двигать вещи сами по себе. Но сначала загадка. В первый раз я написал имя в animation с большой буквы: не sakra, а Sakra. По-моему, это одно и то же слово, всё равно сработает. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make things move by themselves. But first, a riddle. The first time, I wrote the name in animation with a capital letter: Sakra instead of sakra. I think it’s the same word, so it’ll still work. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("@keyframes va animation", '@keyframes и animation', '@keyframes and animation')
  },
  s2: {
    eyebrow: L3("@keyframes va animation", '@keyframes и animation', '@keyframes and animation'),
    help: [
      L3("Kodni kuzatib turing: oldin keyframes rejasi paydo bo'ladi, keyin animation qatori. Kubik qaysi biri paydo bo'lganda qimirlay boshlarkin?", 'Посмотри на код: сначала появляется план keyframes, потом строка animation. Когда кубик начинает двигаться?', 'Look at the code: first the keyframes plan appears, then the animation line. When does the cube start moving?'),
      L3("Kubik faqat animation qatoridan keyin jonlanadi. Chunki keyframes harakatni rejalab qo'yadi xolos: from so'zi bilan boshini, to so'zi bilan oxirini yozadi. animation esa rejani nomi bo'yicha topib, ishga tushiradi va vaqtini aytadi. infinite yozilsa, harakat to'xtamaydi.", 'keyframes записывает план движения: from — начало, to — конец. animation запускает этот план по имени и задаёт время. С infinite он не останавливается.', 'keyframes writes the movement plan: from is the start, to is the end. animation starts that plan by name and sets the time. With infinite it never stops.'),
      L3("Raqs harakatlari yozilgan qog'ozni tasavvur qiling: qog'ozning o'zi raqsga tushmaydi, uni kimdir ijro etishi kerak. keyframes xuddi shu qog'oz bo'ladi, animation esa uni ijro etadigan raqqos.", 'Листок с движениями танца сам не танцует, его должен кто-то исполнить. keyframes — листок, animation — танцор.', 'A sheet with dance moves doesn’t dance by itself; someone has to perform it. keyframes is the sheet, animation is the dancer.')
    ],
    say: L3("Har qanday animatsiyaning ikkita qismi bor: harakat rejasi va shu rejani ishga tushiradigan qoida. Keling, ularni kodga bittalab qo'shib, kubikka nima bo'lishini ko'ramiz.",
      'Анимация состоит из двух частей: плана движения и правила, которое его запускает. Давай добавим по одной.',
      'An animation has two parts: a movement plan and a rule that starts it. Let’s add them one at a time.'),
    sayKf: L3("Mana, kodda keyframes rejasi paydo bo'ldi, uning nomi sakra. Reja ichida ikkita kadr bor: from so'zidan keyingi kadrda kubik joyida turadi, to so'zidan keyingisida esa yigirma piksel tepaga ko'tariladi. Lekin kubik qimirlamadi-ku! Chunki reja yozildi-yu, uni hali hech kim ishga tushirmadi.", 'Это keyframes, то есть «ключевые кадры». sakra — имя плана. from — в начале кубик на месте, to — в конце на двадцать пикселей выше. Но смотри, кубик не двинулся: план есть, а запустить его некому.', 'This is keyframes, meaning key frames. sakra is the plan’s name. from: at the start the cube is in place; to: at the end it’s twenty pixels higher. But look, the cube didn’t move: there’s a plan, but nothing starts it.'),
    sayAnim: L3("Endi kubikning qoidasiga animation qatorini qo'shdik: unda rejaning nomi sakra va vaqti bir soniya. Ana, kubik bir marta sakradi-yu, joyiga qaytib tushdi. Animatsiya tugadi, chunki uni necha marta takrorlashni hali aytmadik.", 'Теперь animation: имя плана sakra и время одна секунда. Кубик прыгнул один раз и вернулся. Анимация закончилась.', 'Now animation: the plan’s name sakra and the time one second. The cube jumped once and came back. The animation ended.'),
    sayInf: L3("Endi oxiriga inglizchada «cheksiz» degan infinite so'zini qo'shamiz. Ko'rdingizmi? Kubik endi to'xtamasdan sakrayapti, vaqt chizig'ida esa cheksizlik belgisi paydo bo'ldi.", 'infinite — то есть «бесконечно». Теперь кубик прыгает без остановки. Посмотри на знак бесконечности на полосе.', 'infinite means endless. Now the cube jumps without stopping. Look at the infinity sign on the bar.'),
    done: L3("Demak, keyframes harakatni rejalab qo'yadi, animation esa shu rejani nomi bilan topib, kubikka ulaydi va qancha vaqt davom etishini aytadi.", 'Значит, keyframes задаёт план движения, а animation подключает его по имени и задаёт время.', 'So keyframes plans the movement, and animation connects it by name and sets the time.'),
    askStart: L3("Qarang: kubik turibdi", 'Смотри: кубик стоит', 'Watch: the cube is still'),
    askKf: L3("Qarang: reja bor, harakat yo'q", 'Смотри: план есть, движения нет', 'Watch: a plan, but no movement'),
    askAnim: L3("Qarang: bir marta sakradi", 'Смотри: прыгнул один раз', 'Watch: it jumped once'),
    askInf: L3("Qarang: infinite — cheksiz", 'Смотри: infinite — бесконечно', 'Watch: infinite is endless'),
    askDone: L3("@keyframes — reja, animation — ishga tushirish", '@keyframes — план, animation — запуск', '@keyframes is the plan, animation starts it')
  },
  s3: {
    eyebrow: L3("Rejaning nomi", 'Имя плана', 'The plan’s name'),
    say: L3("Endi navbat sizga! Kodning tepasida aylanish rejasini tayyorlab qo'ydim. Kubik aylansin: animation qatoriga shu rejaning nomini yozing.",
      'Теперь твоя очередь. Вверху готов план вращения. Пусть кубик крутится: впиши в animation имя плана.',
      'Now it’s your turn. A spinning plan is ready at the top. Make the cube spin: type the plan’s name in animation.'),
    msgs: {
      empty: L3("Maydon hali bo'sh. Bu yerga rejaning nomi kerak.", 'Впиши имя плана.', 'Type the plan’s name.'),
      case: L3("Oz qoldi! Lekin nom keyframes qatorida qanday yozilgan bo'lsa, harfma-harf aynan shunday yozing. Nega bu muhim, dars oxirida bilib olasiz.", 'Большие и маленькие буквы различаются. Напиши имя точно так же, как в keyframes.', 'Capital and small letters are different. Write the name exactly as in keyframes.'),
      word: L3("Bu so'z rejaning nomi emas. Nom keyframes so'zidan keyin, jingalak qavsdan oldin turibdi.", 'Это не имя. Имя стоит сразу после слова keyframes.', 'That’s not the name. The name comes right after the word keyframes.'),
      other: L3("Bunday nomli reja yo'q ekan. Nomni keyframes qatoridan qarab, xuddi o'zini yozing.", 'Такого плана нет. Посмотри имя в строке keyframes.', 'There’s no such plan. Look for the name in the keyframes line.')
    },
    hints: [
      L3("Kodning tepasiga qarang: rejaning nomi keyframes so'zidan keyin yozilgan.", 'Имя плана написано после слова keyframes.', 'The plan’s name is written after the word keyframes.'),
      L3("U yerda aylan degan so'z turibdi. animation qatoriga ham aynan shu so'z kerak.", 'Там написано aylan.', 'It says aylan there.'),
      L3("aylan deb yozing-da, «Tekshirish»ni bosing.", 'Впиши aylan и нажми «Проверить».', 'Type aylan and tap Check.')
    ],
    ok: L3("Zo'r! Kubik aylana boshladi: har ikki soniyada bir marta, to'xtamasdan aylanyapti.", 'Огонь! Кубик делает оборот за две секунды без остановки.', 'Awesome! The cube spins once every two seconds, non-stop.'),
    ask: L3("Rejaning nomini yozing", 'Впиши имя плана', 'Type the plan’s name')
  },
  s4: {
    eyebrow: L3("transition yoki animation?", 'transition или animation?', 'transition or animation?'),
    say: L3("O'yinimga yana bir nechta jonli narsa qo'shmoqchiman. Ularning qaysi biri o'zi harakatlanadi-yu, qaysi biri sichqonchani kutadi? Har biri uchun nima kerak: transition yoki animation, shuni tanlang.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, что нужно: transition или animation.',
      'Now check yourself. I’ll say a task, and you pick what’s needed: transition or animation.'),
    ask: L3("Buning uchun nima kerak?", 'Что для этого нужно?', 'What does this need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("O'ylab ko'ring-chi: bu narsa o'zi harakatlanadimi yoki sichqoncha kelgandagina o'zgaradimi?", 'Вещь движется сама или меняется, когда приходит мышка?', 'Does it move by itself, or change when the mouse comes?'),
    hint2: L3("Narsa hech kim tegmasa ham o'zi harakatlansa, bu animation bo'ladi. Sichqoncha kelganda silliq o'zgarsa, bu transition ishi.", 'Движется сама — animation, плавно меняется под мышкой — transition.', 'Moves by itself: animation. Changes smoothly under the mouse: transition.'),
    items: [
      { t: L3("Yuklanish doirasi to'xtamasdan aylanadi.", 'Кружок загрузки крутится без остановки.', 'A loading circle spins non-stop.'), right: 'animation', why: L3("Yuklanish doirasini hech kim aylantirmaydi, u o'zi aylanaveradi. Bunday harakatni animation qiladi.", 'Он крутится сам, значит, animation.', 'It spins by itself, so it’s animation.') },
      { t: L3("Sichqoncha kelganda tugma silliq kattalashadi.", 'Под мышкой кнопка плавно растёт.', 'The button grows smoothly under the mouse.'), right: 'transition', why: L3("Tugma faqat sichqoncha kelganda o'zgaradi, bunday silliq o'zgarishni esa transition qiladi.", 'Плавное изменение под мышкой — это transition.', 'A smooth change under the mouse is transition.') },
      { t: L3("Yurakcha har soniyada urib turadi.", 'Сердечко бьётся каждую секунду.', 'A heart beats every second.'), right: 'animation', why: L3("Yurakcha hech kimni kutmasdan o'zi urib turadi. Takrorlanib turadigan bunday harakat animation ishi.", 'Оно повторяется само, значит, animation.', 'It repeats by itself, so it’s animation.') },
      { t: L3("Sichqoncha kelganda havola rangi silliq o'zgaradi.", 'Под мышкой цвет ссылки плавно меняется.', 'A link’s color changes smoothly under the mouse.'), right: 'transition', why: L3("Havola ham faqat sichqoncha kelganda rangini o'zgartiradi. Bu xuddi o'tgan darsdagi tugmadek transition ishi.", 'Это тоже плавное изменение под мышкой.', 'That’s a smooth change under the mouse too.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Endi transition bilan animation farqini aniq bilasiz: biriga sichqoncha kerak, ikkinchisi o'zi ishlaydi.", 'Всё верно! Ты не путаешь transition и animation.', 'All correct! You don’t mix up transition and animation.')
  },
  s5: {
    eyebrow: L3("Foizli kadrlar", 'Кадры в процентах', 'Frames in percent'),
    help: [
      L3("Kubik qanday pastga tushayotganini kuzating: oldin birdaniga tushib ketadi, keyin esa silliq tushadi. Oxirida-chi, necha marta sakrab to'xtaydi?", 'Посмотри, как кубик опускается: сначала рывком, потом плавно. А в конце — сколько раз он прыгает?', 'Watch how the cube comes down: first with a jerk, then smoothly. And at the end, how many times does it jump?'),
      L3("Kubik silliq tushishi uchun rejaga o'rtadagi kadrni qo'shdik. Kadrlarni foiz bilan yozsa bo'ladi: nol foiz boshi, ellik foiz o'rtasi, yuz foiz esa oxiri bo'ladi. infinite o'rniga son yozsangiz, animatsiya shuncha marta takrorlanib, to'xtaydi.", 'Кадры можно писать в процентах: ноль — начало, пятьдесят — середина, сто — конец. Вместо infinite можно написать число — столько раз и будет.', 'Frames can be written in percent: zero is the start, fifty the middle, a hundred the end. Instead of infinite you can write a number: that many times.'),
      L3("Multfilm chizuvchilarni tasavvur qiling: ular oldin harakatning boshini, o'rtasini va oxirini chizib olishadi, qolganini keyin to'ldirishadi. keyframes rejasidagi foizli kadrlar ham xuddi shu asosiy rasmlarga o'xshaydi, oraliqni esa brauzer o'zi to'ldiradi.", 'Когда рисуют мультфильм, рисуют первый, средний и последний кадр. keyframes отмечает ключевые кадры так же.', 'When you draw a cartoon, you draw the first, middle and last frame. keyframes marks the key frames the same way.')
    ],
    say: L3("Kubigimga yana bir qarang: tepaga silliq ko'tariladi-yu, pastga esa birdaniga tushib ketadi. Nega bunday bo'larkin? Keling, sababini topib, tuzatamiz.",
      'Смотри, кубик прыгает, но сверху вниз падает рывком. Почему так? Давай исправим.',
      'Look, the cube jumps, but it drops from the top all at once. Why? Let’s fix it.'),
    sayJerk: L3("Gap shundaki, from va to so'zlari faqat boshi bilan oxirini bildiradi. Kubik oxirgi kadrda tepaga chiqib oladi, keyin animatsiya yana boshidan boshlanadi. Shuning uchun u pastga silliq tushmay, birdaniga sakrab tushadi.", 'from и to — это только начало и конец. Дойдя до конца, анимация снова начинается с начала, поэтому кубик падает вниз рывком.', 'from and to are just the start and the end. After reaching the end, the animation starts over, so the cube snaps back down.'),
    sayPct: L3("Endi from bilan to so'zlari o'rniga foizlar yozdik: nol foiz boshi, ellik foiz o'rtasi, yuz foiz esa oxiri bo'ladi. O'rtada kubik tepaga chiqadi, oxirida yana pastga qaytadi. Ana, endi u silliq ko'tarilib, silliq tushyapti!", 'Теперь кадры в процентах: ноль процентов — начало, пятьдесят — середина, сто — конец. В середине кубик наверху, в конце снова внизу. Теперь он плавно поднимается и плавно опускается.', 'Now the frames are in percent: zero percent is the start, fifty is the middle, a hundred is the end. In the middle the cube is up, at the end it’s down again. Now it rises and falls smoothly.'),
    sayThree: L3("Endi infinite o'rniga uch sonini yozamiz. Sanab ko'ring: kubik uch marta sakraydi-yu, keyin to'xtaydi.", 'Вместо infinite число три: кубик прыгнет три раза и остановится.', 'Instead of infinite, the number three: the cube jumps three times and stops.'),
    done: L3("Xullas, foizlar bilan rejaga xohlagancha kadr qo'yish mumkin. infinite o'rnidagi son esa animatsiya necha marta takrorlanishini aytadi.", 'Значит, с процентами можно поставить сколько угодно кадров, а число говорит, сколько раз повторить.', 'So with percentages you can add as many frames as you like, and a number says how many times to repeat.'),
    askStart: L3("Qarang: pastga sakrab tushadi", 'Смотри: падает рывком', 'Watch: it snaps down'),
    askJerk: L3("Qarang: from va to", 'Смотри: from и to', 'Watch: from and to'),
    askPct: L3("Qarang: foizli kadrlar", 'Смотри: кадры в процентах', 'Watch: frames in percent'),
    askThree: L3("Qarang: 3 marta va to'xtadi", 'Смотри: 3 раза и стоп', 'Watch: 3 times, then stop'),
    askDone: L3("Kadrlar foizda · son — necha marta", 'Кадры в процентах · число — сколько раз', 'Frames in percent · a number is how many times')
  },
  s6: {
    eyebrow: L3("O'rtasi", 'Середина', 'The middle'),
    say: L3("Mana, yangi reja yozdim: unda boshi ham, oxiri ham bor, faqat o'rtadagi kadrning foizi tushib qolgan. Kubik harakatning qoq o'rtasida tepada bo'lishi kerak. Shu kadr uchun foizni yozing.",
      'Теперь ты. В плане есть начало и конец, а у кадра посередине нет процента. Кубик должен быть наверху в середине: впиши процент.',
      'Your turn. The plan has a start and an end, but the middle frame has no percent. The cube should be up in the middle: type the percent.'),
    msgs: {
      empty: L3("O'rtadagi kadr hali foizsiz turibdi. Bu yerga uning foizini yozing.", 'Впиши процент.', 'Type the percent.'),
      noPct: L3("Faqat son turibdi, foiz belgisi yo'q. Foiz belgisi bo'lmasa, brauzer bu kadrni tushunmaydi va o'tkazib yuboradi.", 'Число есть, а знака процента нет. Без него браузер выбросит кадр.', 'There’s a number but no percent sign. Without it the browser throws the frame away.'),
      otherPct: L3("Bu kadr harakatning boshqa joyiga tushib qoldi. Bizga esa boshi bilan oxirining qoq o'rtasi kerak.", 'Это другое место. Середина — ровно между началом и концом.', 'That’s a different spot. The middle is exactly between the start and the end.'),
      other: L3("Bu yerga faqat son bilan foiz belgisi yoziladi.", 'Здесь нужно число и знак процента.', 'This needs a number and a percent sign.')
    },
    hints: [
      L3("Rejaning boshi nol foiz, oxiri yuz foiz. O'rtasi-chi, necha foiz bo'larkin?", 'Начало — ноль процентов, конец — сто. А середина?', 'The start is zero percent, the end is a hundred. And the middle?'),
      L3("Noldan yuzgacha yo'lning qoq yarmi ellik bo'ladi, demak, o'rtasi ellik foiz.", 'Середина — пятьдесят процентов.', 'The middle is fifty percent.'),
      L3("Ellik deb yozing, yoniga foiz belgisini qo'ying-da, «Tekshirish»ni bosing.", "Впиши пятьдесят, потом нажми внизу кнопку со знаком процента и «Проверить».", "Type fifty, then tap the percent sign button below and Check.")
    ],
    ok: L3("Barakalla! O'rtadagi kadr joyiga tushdi, kubik ham silliq ko'tarilib, silliq tushyapti.", 'Молодец! Кубик плавно поднимается и плавно опускается.', 'Well done! The cube rises and falls smoothly.'),
    ask: L3("O'rtadagi kadr: necha foiz?", 'Кадр посередине: сколько процентов?', 'The middle frame: what percent?')
  },
  s7: {
    eyebrow: L3("Necha marta?", 'Сколько раз?', 'How many times?'),
    say: L3("Kubigimga har safar boshqacha animation qatori yozaman. Qatorni o'qing-da, kubik necha marta sakrashini toping.",
      'Теперь проверь себя. Я покажу правило, а ты выбери, сколько раз будет анимация.',
      'Now check yourself. I’ll show a rule, and you pick how many times the animation runs.'),
    ask: L3("Animatsiya necha marta bo'ladi?", 'Сколько раз будет анимация?', 'How many times will the animation run?'),
    opts: {
      one: L3("Bir marta", 'Один раз', 'Once'),
      two: L3("Ikki marta", 'Два раза', 'Twice'),
      inf: L3("Cheksiz", 'Без конца', 'Endlessly')
    },
    hint1: L3("animation qatorida vaqtdan keyin nima turibdi?", 'Что написано после времени?', 'What’s written after the time?'),
    hint2: L3("Vaqtdan keyingi son animatsiya necha marta takrorlanishini aytadi. infinite tursa, u to'xtamaydi, hech narsa bo'lmasa, faqat bir marta bo'ladi.", 'Число говорит, сколько раз, infinite — без конца, а если ничего нет — один раз.', 'A number says how many times, infinite means endlessly, and nothing means once.'),
    items: [
      { code: '.kub { animation: sakra 1s 2; }', right: 'two', why: L3("Vaqtdan keyin ikki soni turibdi, shuning uchun kubik ikki marta sakrab, to'xtaydi.", 'Стоит число два: два раза.', 'There’s the number two: twice.') },
      { code: '.kub { animation: sakra 1s infinite; }', right: 'inf', why: L3("infinite turgan ekan, kubik to'xtamasdan, cheksiz sakrayveradi.", 'infinite — без конца.', 'infinite means endlessly.') },
      { code: '.kub { animation: sakra 1s; }', right: 'one', why: L3("Vaqtdan keyin hech qanday son yo'q. Bunday paytda brauzer animatsiyani faqat bir marta ko'rsatadi.", 'Числа нет: анимация будет один раз.', 'No number: the animation runs once.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala qatorni ham o'qib berdingiz! Endi qatorning oxiriga qarab, kubik necha marta sakrashini aytasiz.", 'Всё верно! Ты сразу видишь, сколько повторов.', 'All correct! You read the repeats at a glance.')
  },
  s8: {
    eyebrow: L3("Tezlik va yo'nalish", 'Скорость и направление', 'Speed and direction'),
    help: [
      L3("Kubikni kuzating: aylanayotganda u har safar sekinlab qolyaptimi? O'ngga yurganda-chi, boshiga sakrab qaytyaptimi yoki silliq qaytib kelyaptimi?", 'Посмотри на кубик: при вращении он притормаживает? Когда едет вправо — прыгает в начало или возвращается?', 'Look at the cube: does it slow down while spinning? When it moves right, does it jump back to the start or come back?'),
      L3("Ikkala o'zgarish ham bittadan so'zning ishi: linear va alternate. linear tezlikni boshidan oxirigacha tekis qiladi, alternate esa animatsiyani navbatma-navbat yurgizadi: bir safar oldinga, bir safar orqaga.", 'linear делает скорость ровной. А alternate делает анимацию «туда и обратно»: раз вперёд, раз назад.', 'linear makes the speed even. alternate makes the animation go there and back: once forward, once back.'),
      L3("Devordagi soatning strelkasi hech sekinlamay, tekis aylanadi: linear ham xuddi shunday. Belanchak esa oldinga borib, orqaga qaytadi: alternate kubikni ham shunday yurgizadi.", 'Стрелка часов крутится ровно — это linear. Качели ходят туда и обратно — это alternate.', 'A clock hand turns evenly: that’s linear. A swing goes back and forth: that’s alternate.')
    ],
    say: L3("Animatsiyada ham, xuddi o'tgan darsdagidek, tezlikni tanlasa bo'ladi. Yo'nalishini ham tanlay olamiz. Hozir kubik ikki soniyada bir marta aylanyapti. Sezdingizmi? Har aylanishda u bir lahza to'xtab qolayotgandek bo'lyapti.",
      'В анимации тоже можно выбрать скорость и направление. Сейчас кубик делает оборот за две секунды. Видишь, на каждом обороте он будто притормаживает?',
      'You can choose speed and direction in an animation too. Right now the cube spins once every two seconds. See how it seems to slow down on every turn?'),
    sayLinear: L3("Esingizdami, tezlik yozilmasa, brauzer o'zi ease tanlaydi. Aybdor shu ease: u har aylanishning boshida va oxirida sekinlaydi. Endi linear qo'shdik: aylanish g'ildirakdek tekis bo'lib qoldi.", 'Это был ease: в начале и в конце медленно. А с linear вращение ровное, как у колеса.', 'That was ease: slow at the start and the end. With linear the spinning is even, like a wheel.'),
    sayBack: L3("Endi boshqa harakat: kubik o'ngga yuryapti. Lekin qarang, har safar oxiriga yetishi bilan boshiga sakrab qaytib qolyapti.", 'Теперь кубик едет вправо. Но каждый раз, доехав до конца, прыгает обратно в начало.', 'Now the cube moves right. But every time it reaches the end, it jumps back to the start.'),
    sayAlt: L3("Buni inglizchada «navbatma-navbat» degan alternate so'zi tuzatadi: bir safar oldinga, bir safar orqaga. Ana, endi kubik sakramasdan borib-qaytyapti!", 'alternate — то есть «по очереди»: раз вперёд, раз назад. Теперь кубик ездит туда и обратно, без рывков.', 'alternate means taking turns: once forward, once back. Now the cube goes there and back, without jumps.'),
    done: L3("Shunday qilib, linear tezlikni tekis qiladi, alternate esa kubikni sakratmasdan borib-qaytaradi.", 'Значит, linear делает скорость ровной, а alternate — анимацию «туда и обратно».', 'So linear makes the speed even, and alternate makes the animation go there and back.'),
    askStart: L3("Qarang: aylanish", 'Смотри: вращение', 'Watch: spinning'),
    askLinear: L3("Qarang: linear — tekis", 'Смотри: linear — ровно', 'Watch: linear is even'),
    askBack: L3("Qarang: boshiga sakraydi", 'Смотри: прыгает в начало', 'Watch: it jumps to the start'),
    askAlt: L3("Qarang: alternate — borib-qaytish", 'Смотри: alternate — туда и обратно', 'Watch: alternate goes there and back'),
    askDone: L3("linear — tekis · alternate — borib-qaytish", 'linear — ровно · alternate — туда и обратно', 'linear is even · alternate goes there and back')
  },
  s9: {
    eyebrow: L3("Tekis aylanish", 'Ровное вращение', 'Even spinning'),
    say: L3("Kubigim g'ildirakdek tekis aylanishini xohlayman, har aylanishda sekinlab qolmasin. Buning uchun animation qatoriga tezlik so'zini yozing.",
      'Теперь ты. Пусть кубик крутится ровно, как колесо, без притормаживания: впиши слово скорости.',
      'Your turn. Make the cube spin evenly, like a wheel, without slowing down: type the speed word.'),
    msgs: {
      empty: L3("Hech narsa yozilmabdi-ku. Bu yerga tezlik so'zi kerak.", 'Впиши слово скорости.', 'Type the speed word.'),
      ease: L3("ease bilan kubik baribir boshida va oxirida sekinlab qoladi. Bizga esa boshidan oxirigacha tekis tezlik kerak.", 'ease замедляется в начале и в конце. А нам нужна ровная скорость.', 'ease slows down at the start and the end. We need an even speed.'),
      word: L3("Bu so'z tezlikni bildirmaydi. Bizga kubikni bir xil tezlikda aylantiradigan so'z kerak.", 'Это не скорость. Нужно слово, при котором скорость одинаковая.', 'That’s not a speed. We need the word that keeps the speed the same.'),
      other: L3("Bunday so'zni brauzer bilmaydi. Tekis tezlikni bildiradigan inglizcha so'zni yozing.", 'Браузер не узнал это слово. Впиши слово ровной скорости.', 'The browser didn’t recognize that word. Type the word for an even speed.')
    },
    hints: [
      L3("Tekis tezlikni inglizchada qanday so'z bildiradi?", 'Как по-английски «ровная скорость»?', 'What’s the English word for an even speed?'),
      L3("U linear degan so'z: tezlikni boshidan oxirigacha bir xil qiladi.", 'Это linear.', 'It’s linear.'),
      L3("linear deb yozing-da, «Tekshirish»ni bosing.", 'Впиши linear и нажми «Проверить».', 'Type linear and tap Check.')
    ],
    ok: L3("Ajoyib! Endi kubik hech sekinlamay, g'ildirakdek tekis aylanyapti.", 'Отлично! Кубик крутится ровно, как колесо.', 'Great! The cube spins evenly, like a wheel.'),
    ask: L3("Aylanish tekis bo'lsin", 'Сделай вращение ровным', 'Make the spinning even')
  },
  s10: {
    eyebrow: L3("Nima yozish kerak?", 'Что дописать?', 'What to add?'),
    say: L3("Kubigim yur degan raqsni bir soniyada ijro etyapti. Endi bu raqsni sal boshqacha qilamiz. Kartochkada raqs qanday bo'lishi kerakligi yozilgan: buning uchun animation qatoriga nima qo'shish kerak?",
      'Теперь проверь себя. У кубика стоит анимация yur на одну секунду. Я скажу задачу, а ты выбери, что дописать.',
      'Now check yourself. The cube has the yur animation for one second. I’ll say a task, and you pick what to add.'),
    ask: L3("Nima yozish kerak?", 'Что нужно дописать?', 'What do you need to add?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Raqsning nimasi o'zgarishi kerak: necha marta takrorlanishimi, yo'nalishimi yoki tezligimi?", 'О чём задача: о повторах, о направлении или о скорости?', 'What’s the task about: repeats, direction or speed?'),
    hint2: L3("infinite animatsiyani cheksiz takrorlaydi, son necha marta bo'lishini aytadi. alternate kubikni borib-qaytaradi, linear esa tezlikni tekis qiladi.", 'infinite — без конца, число — сколько раз, alternate — туда и обратно, linear — ровно.', 'infinite is endless, a number is how many times, alternate is there and back, linear is even.'),
    items: [
      { t: L3("Kubik to'xtamasdan yursin.", 'Кубик должен ездить без остановки.', 'The cube should move non-stop.'), right: 'infinite', why: L3("To'xtamasdan yurishi uchun animatsiya cheksiz takrorlanishi kerak, buni infinite qiladi.", 'Без остановки — значит, infinite.', 'Non-stop means infinite.') },
      { t: L3("Kubik roppa-rosa uch marta yursin.", 'Кубик должен проехать ровно три раза.', 'The cube should move exactly three times.'), right: '3', why: L3("Animatsiya necha marta takrorlansin desangiz, xuddi shu sonni yozasiz.", 'Сколько раз — то число и пишут.', 'You write the number of times.') },
      { t: L3("Kubik borib, yana qaytib kelsin.", 'Кубик должен ездить туда и обратно.', 'The cube should go there and come back.'), right: 'alternate', why: L3("Kubikni oldinga yurgizib, keyin orqaga qaytaradigan so'z alternate.", 'Туда и обратно — это alternate.', 'There and back is alternate.') },
      { t: L3("Kubik bir xil tezlikda yursin.", 'Кубик должен ехать с одинаковой скоростью.', 'The cube should move at the same speed.'), right: 'linear', why: L3("Tezlikni boshidan oxirigacha bir xil qiladigan so'z linear.", 'Одинаковая скорость — это linear.', 'The same speed is linear.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("Kubigimning raqsi endi siz xohlagandek: to'xtamaydi, uch marta takrorlanadi, borib-qaytadi, tekis yuradi. animation qatorini istalgan raqsga sozlay olasiz!", 'Всё верно! Ты умеешь настроить animation как хочешь.', 'All correct! You can set up animation however you like.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Kubik muzlab qolsa, oldin vaqt chizig'iga qarang: nom kulrang bo'lib qolmadimi? Keyin kodni o'qib chiqing: vaqt yozilganmi, kadrda foiz belgisi turibdimi?", 'Каждый раз смотри на код и на полосу: имя серое, есть ли время, есть ли знак процента у кадра?', 'Each time, look at the code and the bar: is the name grey, is there a time, does the frame have a percent sign?'),
      L3("Brauzer rejani nomi bo'yicha qidiradi: nomdan bitta harf tushib qolsa ham, uni topolmaydi. Vaqt yozilmasa, animatsiya nol soniyada tugaydi. Kadrda foiz belgisi bo'lmasa, brauzer o'sha kadrni tushunmaydi va o'tkazib yuboradi.", 'Имя в двух местах должно совпадать буква в букву, время должно быть написано, а у кадров нужен знак процента.', 'The name must match letter for letter in both places, the time must be written, and frames need a percent sign.'),
      L3("Do'stingizni boshqa ism bilan chaqirsangiz, u o'girilib ham qaramaydi. Brauzer ham rejani faqat aniq nomi bilan chaqirganda topadi.", 'Если позвать друга не тем именем, он не придёт. Браузер тоже находит план только по точному имени.', 'Call a friend by the wrong name and they won’t come. The browser also finds a plan only by its exact name.')
    ],
    say: L3("Kubik qachon muzlab qoladi? Hozir u bemalol sakrab turibdi, lekin men uni uchta tuzoq bilan muzlatib ko'raman. Har safar nima o'zgarganini kuzatib boring.",
      'И в анимации бывают ошибки. Давай посмотрим на три. Сейчас всё правильно: кубик прыгает.',
      'Animations have mistakes too. Let’s look at three. Right now everything is correct: the cube is jumping.'),
    sayName: L3("Birinchi tuzoq: animation qatoridagi nomdan bitta harfni o'chirdim. Brauzer sakr degan rejani qidirdi-yu, topolmadi, shuning uchun kubik qotib qoldi. Qarang, vaqt chizig'ida nom kulrang bo'lib qolibdi.", 'Первая: в имени в animation не хватает буквы. Браузер не нашёл такого плана, кубик встал. А на полосе имя серое.', 'The first: the name in animation is missing a letter. The browser found no such plan, and the cube stopped. The name on the bar is grey.'),
    sayTime: L3("Ikkinchi tuzoq: nom joyida, lekin vaqtni o'chirib qo'ydim. Vaqt yozilmasa, animatsiya nol soniya davom etadi: boshlanishi bilan tugaydi. Shuning uchun kubikda hech qanday harakat ko'rinmaydi.", 'Вторая: не написано время. Тогда анимация длится ноль секунд, и ничего не видно.', 'The second: no time is written. Then the animation lasts zero seconds, and you see nothing.'),
    sayPct: L3("Uchinchi tuzoq yashirinroq: o'rtadagi kadrdan foiz belgisini olib tashladim. Brauzer bu kadrni tushunmadi va o'tkazib yubordi. Qolgan boshi bilan oxirida esa kubik bir joyda turadi, shuning uchun u qimirlamay qoldi.", 'Третья: у кадра посередине нет знака процента. Браузер выбросил этот кадр, а начало и конец одинаковые, поэтому кубик не двигается.', 'The third: the middle frame has no percent sign. The browser threw that frame away, and the start and end are the same, so the cube doesn’t move.'),
    done: L3("Demak, kubikni uch narsa muzlatadi: nomdagi harf, yozilmay qolgan vaqt va foizsiz kadr. Shularni tekshirsangiz, u yana sakraydi.", 'Значит, имя должно совпадать точно, время должно быть написано, а у кадров должен быть знак процента.', 'So the name must match exactly, the time must be written, and the frames need a percent sign.'),
    askStart: L3("Qarang: hammasi ishlayapti", 'Смотри: всё работает', 'Watch: everything works'),
    askName: L3("Qarang: sakr — boshqa nom", 'Смотри: sakr — другое имя', 'Watch: sakr is a different name'),
    askTime: L3("Qarang: vaqt yo'q", 'Смотри: нет времени', 'Watch: no time'),
    askPct: L3("Qarang: 50 — foizsiz", 'Смотри: 50 — без процента', 'Watch: 50 without percent'),
    askDone: L3("Aniq nom · vaqt · foiz belgisi", 'Точное имя · время · знак процента', 'An exact name · a time · a percent sign')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Kubik yana muzlab qoldi! Men uni har soniyada sakrasin deb yozgandim, lekin qiymatga nimadir yozishni unutib qo'yibman. Nima yetishmayotganini topib, qo'shib bering-chi.",
      'Ой, я хотел, чтобы кубик прыгал каждую секунду, а он не двигается! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wanted the cube to jump every second, but it doesn’t move! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Endi qiymatning hammasi o'chib ketdi. Reja nomini, vaqtni va infinite so'zini qaytadan yozing.", 'Впиши значение.', 'Type the value.'),
      time: L3("Vaqt hali ham yo'q. Kubik har soniyada sakrashi uchun nomdan keyin bir soniya yozing.", 'Времени всё ещё нет. Чтобы прыгать каждую секунду, напиши одну секунду.', 'There’s still no time. To jump every second, write one second.'),
      unit: L3("s harfi tushib qolibdi: brauzer bu sonni soniya deb tushunmaydi. Son yoniga s harfini qo'shing.", 'Число есть, а буквы s нет.', 'There’s a number but no letter s.'),
      comma: L3("Vergul tufayli brauzer vaqtni tushunmaydi: kasr son nuqta bilan yoziladi.", 'В числе запятая. Дробь пишут через точку.', 'There’s a comma in the number. Decimals use a dot.'),
      case: L3("Nom keyframes qatoridagidan boshqacha yozilibdi. Ikkalasini harfma-harf solishtirib ko'ring-chi.", 'Имя написано с большой буквы. Оно должно быть как в keyframes.', 'The name has a capital letter. It must match keyframes.'),
      name: L3("Nom o'zgarib qolibdi-ku. Rejaning nomi sakra, aynan shunday yozing.", 'Имя изменилось. План называется sakra.', 'The name changed. The plan is called sakra.'),
      inf: L3("Kubik to'xtamasdan sakrashi kerak, shuning uchun infinite so'zini o'chirmang.", 'Кубик должен прыгать без остановки: оставь infinite.', 'The cube should jump non-stop: keep infinite.'),
      bad: L3("Bu qiymat brauzerga notanish. Nom, vaqt va infinite so'zini bittalab tekshirib ko'ring.", 'Браузер не узнал это значение. Проверь имя, время и infinite.', 'The browser didn’t recognize that value. Check the name, the time and infinite.'),
      other: L3("Vaqt boshqacha bo'lib qoldi. Har soniyada bir marta sakrashi uchun aynan bir soniya kerak.", 'Время другое. Нужно каждую секунду, то есть одна секунда.', 'The time is different. We need every second, that is one second.')
    },
    hints: [
      L3("animation qatorida nima yetishmayapti: nommi, vaqtmi yoki takrorlashmi?", 'Чего не хватает в animation: имени, времени или повторов?', 'What’s missing in animation: the name, the time or the repeats?'),
      L3("Unda vaqt yo'q ekan. Vaqt rejaning nomidan keyin yoziladi.", 'Нет времени. После имени пишут время.', 'There’s no time. The time goes after the name.'),
      L3("sakra, bo'sh joy, bir va s, yana bo'sh joy, keyin infinite deb yozing-da, «Tekshirish»ni bosing.", 'Впиши sakra, пробел, 1s, пробел, infinite и нажми «Проверить».', 'Type sakra, space, 1s, space, infinite and tap Check.')
    ],
    ok: L3("Muz eridi! Kubik yana har soniyada bir marta sakrayapti.", 'Ура, заработало! Кубик прыгает каждую секунду.', 'Hooray, it works! The cube jumps every second.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi qiyinroq tuzoq: kodda uchta qoida bor, ulardan biri kubikni muzlatib qo'ygan. Kubikka va vaqt chizig'iga qarab, o'sha qoidani toping-da, ustiga bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и на полосу, потом нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and the bar, then tap that rule.'),
    say2: L3("Kubik aylana boshladi! Endi unga yur raqsini berdim, lekin u yana muzlab qoldi. Bu safar qaysi qoida aybdor ekan?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida o'z vazifasini bajaryapti, natijasi sahifada bor. Kubikning o'ziga qarang: u kodda yozilgandek harakatlanyaptimi?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      name: L3("Topdingiz! Nomda ikkita harf o'rin almashib, aylan o'rniga aylna bo'lib qolgan ekan.", 'Есть! В имени были переставлены буквы.', 'Found it! Letters in the name were swapped.'),
      time: L3("Mana u! Bu qatorda vaqt umuman yozilmagan ekan.", 'Есть! Не было написано время.', 'Found it! The time wasn’t written.')
    },
    hint1: L3("Kubik harakatlanyaptimi? Vaqt chizig'idagi yozuvga ham qarab qo'ying.", 'Кубик двигается? Посмотри на полосу.', 'Is the cube moving? Look at the bar.'),
    hint2: {
      name: L3("Vaqt chizig'ida nom kulrang turibdi, demak, brauzer bunday rejani topmadi. animation qatoridagi nomni keyframes qatoridagi nom bilan solishtirib ko'ring.", 'На полосе имя серое: такого плана нет. Сравни имя в animation с keyframes.', 'The name on the bar is grey: there’s no such plan. Compare the name in animation with keyframes.'),
      time: L3("Chiziqda nol soniya: animatsiya boshlanishi bilan tugayapti. animation qatorida vaqt yozilganmi o'zi?", 'На полосе ноль секунд. Есть ли время в animation?', 'The bar shows zero seconds. Is there a time in animation?')
    },
    hint3: {
      name: L3("Tuzoq ikkinchi qoidada: u yerda aylan o'rniga aylna yozilgan. O'sha qatorni bosing.", 'Ошибка во втором правиле: aylna. Нажми эту строку.', 'The bug is in the second rule: aylna. Tap that line.'),
      time: L3("Tuzoq oxirgi qoidada: unda vaqt yo'q. O'sha qatorni bosing.", 'Ошибка в последнем правиле: нет времени. Нажми эту строку.', 'The bug is in the last rule: no time. Tap that line.')
    },
    ok: L3("Kubigim yana harakatga tushdi! Endi animatsiya ishlamasa, nimani tekshirishni bilasiz: nomni, vaqtni va foiz belgisini.", 'Супер! Обе найдены. Ты проверяешь анимации как настоящий разработчик.', 'Super! Both found. You check animations like a real developer.'),
    fineKf: L3("Reja joyida, u faqat harakatni yozib qo'yadi xolos. Rejani ishga tushiradigan animation qatoriga qarang.", "План в порядке: он только описывает движение. Посмотри на строку animation, которая его запускает.", "The plan is fine: it only describes the motion. Look at the animation line that starts it.")
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Kubigimga yangi raqs kerak: aylan rejasini men tayyorlab qo'ydim, qoidani esa siz yozasiz, selektordan boshlab oxirigacha. Kubik aylan rejasi bo'yicha ikki soniyada bir aylansin, tezligi tekis bo'lsin va hech to'xtamasin.",
      'Теперь напиши правило целиком. План aylan уже готов. Напиши правило для кубика: план aylan, две секунды, ровная скорость и без конца.',
      'Now write the whole rule yourself. The aylan plan is ready. Write a rule for the cube: the aylan plan, two seconds, an even speed and endlessly.'),
    msgs: {
      empty: L3("Qoida hali yozilmadi. Boshiga kubikning selektorini, keyin jingalak qavslar ichiga animation va uning qiymatini yozing.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Jingalak qavslar yo'q ekan. animation bilan uning qiymati shu qavslar ichida yashaydi, ularni qo'shing.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("animation so'zidan keyin ikki nuqta tushib qolibdi. Xususiyat bilan qiymatni u ajratib turadi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Selektor nuqta bilan boshlanadi, undan keyin kubikning class nomi keladi.", 'Селектор: точка и класс кубика.', 'The selector: a dot and the cube’s class.'),
      prop: L3("Rejani faqat animation xususiyati ishga tushira oladi.", 'План запускает свойство animation.', 'The animation property starts the plan.'),
      comma: L3("Kasr son vergul bilan emas, nuqta bilan yoziladi.", 'В числе запятая. Дробь пишут через точку.', 'There’s a comma in the number. Decimals use a dot.'),
      bad: L3("Qiymatda nimadir chalkashib ketdi. Nomni, vaqtni va qolgan so'zlarni bittalab tekshiring.", 'Браузер не узнал это значение. Проверь имя, время и слова.', 'The browser didn’t recognize that value. Check the name, the time and the words.'),
      case: L3("Nomni keyframes qatoridagi bilan solishtiring: bitta harfi boshqacha-ku.", 'Имя должно быть маленькими буквами, как в keyframes.', 'The name must be in small letters, as in keyframes.'),
      name: L3("Bunday nomli reja yo'q. Tayyor rejaning nomi aylan, uni harfma-harf yozing.", 'Имя другое. План называется aylan.', 'The name is different. The plan is called aylan.'),
      unit: L3("Ikki sonining yonida s harfi yo'q-ku.", 'Времени нужна буква s.', 'The time needs the letter s.'),
      time: L3("Qiymatda vaqt yo'q-ku. Nomdan keyin ikki soniya yozing.", 'Нет времени. Напиши две секунды.', 'There’s no time. Write two seconds.'),
      other: L3("Vaqt boshqacha chiqdi. Kubik bir aylanishni ikki soniyada qilishi kerak.", 'Время другое. Нужно две секунды.', 'The time is different. We need two seconds.'),
      lin: L3("Kubik g'ildirakdek tekis aylanishi uchun linear so'zini qo'shing.", 'Скорость должна быть ровной: linear.', 'The speed should be even: linear.'),
      inf: L3("Kubik to'xtamasligi uchun oxiriga infinite yozing.", 'Кубик не должен останавливаться: infinite.', 'The cube shouldn’t stop: infinite.')
    },
    hints: [
      L3("Boshiga kubikning class nomi nuqta bilan yoziladi, keyin animation xususiyati keladi. Qiymatga esa reja nomi, vaqt, tezlik va cheksizlik so'zi yoziladi.", 'Селектор — класс кубика, свойство — animation, а в значении — имя, время, скорость и «без конца».', 'The selector is the cube’s class, the property is animation, and the value has the name, time, speed and endlessly.'),
      L3("Qiymatni shu tartibda yozing: aylan, ikki va s harfi, linear, infinite.", 'Значение: aylan, 2s, linear, infinite.', 'The value: aylan, 2s, linear, infinite.'),
      L3("Namunaga qarang, u kod ostida turibdi. Xuddi shunday yozib, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Kubigim yangi raqsini boshladi: to'xtamasdan, g'ildirakdek tekis aylanyapti. Bu qoidaning har bir harfi sizniki!", 'Отлично! Кубик крутится как колесо. Правило написано тобой целиком.', 'Great! The cube spins like a wheel. You wrote the whole rule yourself.'),
    ask: L3("Kubik aylan rejasi bo'yicha aylansin: tekis, cheksiz, bir aylanish ikki soniyada", "Кубик крутится по плану aylan: ровно, без конца, оборот за две секунды", "The cube spins by the aylan plan: evenly, endlessly, one turn in two seconds")
  },
  s14: {
    eyebrow: L3("O'z animatsiyangiz", 'Своя анимация', 'Your own animation'),
    say: L3("Kubigim uchun o'zingiz raqs o'ylab toping! Harakat oxirida u qanday bo'lsin, raqs qancha davom etsin va necha marta takrorlansin? Hammasini tanlab, «Tayyor»ni bosing.",
      'Теперь сделай свою анимацию. Сам выбери, каким кубик станет в конце, сколько это длится и сколько раз повторится. Потом нажми «Готово».',
      'Now make your own animation. Choose what the cube becomes at the end, how long it takes and how many times it repeats. Then tap “Done”.'),
    msgs: {
      tf: L3("Brauzer bu qiymatni tanimadi: \u2063{w}\u2064. Harakat so'zidan keyin qavs ochilib, ichida son turishi kerak, masalan, rotate va qavs ichida qirq besh gradus: kodda gradus deg deb yoziladi.", "Браузер не узнал такое значение: \u2063{w}\u2064. Нужно слово и число в скобках — например, rotate и в скобках сорок пять deg.", "The browser didn’t recognize this value: \u2063{w}\u2064. You need a word and a number in brackets, for example rotate with forty-five deg in brackets."),
      comma: L3("Vaqtdagi vergul brauzerni chalg'itadi. Uni nuqtaga almashtiring.", 'Во времени запятая. Дробь пишут через точку.', 'There’s a comma in the time. Decimals use a dot.'),
      unit: L3("Son yoniga birlik kerak: soniya uchun s, millisoniya uchun ms.", 'Времени нужны s или ms.', 'The time needs s or ms.'),
      time: L3("Bu vaqtni brauzer tanimadi: \u2063{w}\u2064. Son yozib, yoniga s yoki ms qo'shing.", 'Браузер не узнал такое время: \u2063{w}\u2064. Напиши число и s.', 'The browser didn’t recognize this time: \u2063{w}\u2064. Write a number and s.'),
      zero: L3("Nol soniyada animatsiya boshlanmasdan tugaydi, hech narsa ko'rinmaydi. Raqs uchun ozgina bo'lsa ham vaqt kerak.", 'За ноль секунд ничего не видно. Напиши время больше нуля.', 'With zero seconds you see nothing. Write a time greater than zero.'),
      long: L3("Raqs juda cho'zilib ketdi: besh soniyadan ko'p kutish zerikarli. Kamroq vaqt yozing.", 'Это слишком долго. Напиши меньше пяти секунд.', 'That’s too long. Write less than five seconds.'),
      count: L3("Bu takrorlash soniga o'xshamayapti: \u2063{w}\u2064. infinite so'zini yoki oddiy son yozing.", 'Это не число повторов: \u2063{w}\u2064. Впиши infinite или число.', 'This isn’t a repeat count: \u2063{w}\u2064. Type infinite or a number.')
    },
    hints: [
      L3("Har bir maydon raqsning bir qismi: birinchisi harakat, ikkinchisi vaqt, uchinchisi necha marta takrorlanishi.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Harakat uchun scale, rotate yoki translate qavs ichida son bilan yoziladi. Vaqtga son bilan s, takrorlashga esa infinite yoki son kerak.", "В первое — scale, rotate или translate со скобками и числом, во второе — время, в третье — infinite или число.", "In the first, scale, rotate or translate with brackets and a number; in the second, a time; in the third, infinite or a number."),
      L3("Masalan, rotate, qavs ichida qirq besh va gradusni bildiradigan deg so'zi. Keyin bir soniya va infinite yozib ko'ring-da, «Tayyor»ni bosing.", "Например: rotate и в скобках сорок пять deg, потом 1s и infinite. Потом нажми «Готово».", "For example: rotate with forty-five deg in brackets, then 1s and infinite. Then tap “Done”.")
    ],
    ok: L3("Ana, kubigim siz o'ylab topgan raqsga tushyapti! Bunday raqsni hech kim o'rgatmagan, uni o'zingiz yaratdingiz.", 'Ого, кубик ожил! Это твоя собственная анимация.', 'Wow, the cube came alive! This is your very own animation.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Kubigim haqida to'rtta gap tayyorladim, lekin ularning hammasi ham rost emas. Kartochkadagi gapni o'qing: rost bo'lsa «To'g'ri»ni, yolg'on bo'lsa «Noto'g'ri»ni bosing.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapda nima haqida so'z ketyapti: rejami, ishga tushirishmi yoki nom?", 'О чём фраза: о плане, о запуске или об имени?', 'What’s the sentence about: the plan, starting it or the name?'),
    hint2: L3("Esingizdami: keyframes faqat rejani yozadi, uni animation ishga tushiradi. infinite cheksiz degani, nom esa ikki joyda harfma-harf bir xil bo'lishi kerak.", "Вспомни: keyframes — только план, animation его запускает, infinite — без конца, а имя должно совпадать буква в букву, даже большие и маленькие буквы.", "Remember: keyframes is only a plan, animation starts it, infinite is endless, and the name must match letter for letter, even capital and small letters."),
    items: [
      { t: L3("Faqat keyframes rejasining o'zi kubikni harakatlantiradi.", 'Один только keyframes двигает кубик.', 'keyframes alone moves the cube.'), right: false, code: 'kfOnly',
        why: L3("Aslida keyframes faqat rejani yozib qo'yadi. Kubik animation qatori rejani ishga tushirgandagina harakatlanadi.", 'На самом деле keyframes — только план. Запускает его animation.', 'Actually keyframes is only a plan. animation starts it.') },
      { t: L3("infinite bilan animatsiya to'xtamaydi.", 'С infinite анимация не останавливается.', 'With infinite the animation doesn’t stop.'), right: true,
        why: L3("infinite cheksiz degani, shuning uchun kubik hech qachon to'xtamaydi.", 'Верно: infinite значит «без конца».', 'Right: infinite means endless.') },
      { t: L3("Animatsiya sichqonchasiz ham ishlaydi.", 'Анимация работает и без мышки.', 'An animation works without the mouse too.'), right: true,
        why: L3("animation sichqonchani kutmaydi, o'zi ishlayveradi. transition esa sichqoncha kelishini kutadi.", 'Верно: animation работает сама, в отличие от transition.', 'Right: animation runs by itself, unlike transition.') },
      { t: L3("Bu kubik sakraydi.", 'Этот кубик будет прыгать.', 'This cube will jump.'), right: false, code: 'caps',
        why: L3("Aslida bu kubik joyidan qimirlamaydi. Nega shunday, buni dars oxirida birga ko'ramiz.", 'На самом деле для CSS Sakra и sakra — разные имена, как имена классов во втором уроке. Браузер не найдёт план, и кубик будет стоять.', 'Actually, to CSS Sakra and sakra are different names, like the class names in lesson two. The browser won’t find the plan, and the cube will stand still.') }
    ],
    ok: L3("Qaysi gap rost-u, qaysi biri yolg'on ekanini endi bilasiz. Animatsiyalarni ancha yaxshi tushunib oldingiz!", 'Всё верно! Ты отлично разбираешься в анимациях.', 'All correct! You know animations really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi bahsimizni hal qilamiz! animation qatorida bosh harfi katta Sakra turibdi. Natijaga qarang: kubik qimirlamayapti, vaqt chizig'ida esa nom kulrang bo'lib turibdi. Ana, qarang-a: ichimdagi ikkinchi Kodi haq chiqdi, men esa yutqazdim! CSS uchun katta va kichik harf har xil, shuning uchun brauzer bunday rejani topolmadi.",
        'Вернёмся к загадке. Помнишь, я написал имя в animation с большой буквы? Смотри: кубик не двигается, а на полосе имя серое! Я ошибся. Для CSS большие и маленькие буквы — разные, поэтому браузер не нашёл такой план.',
        'Back to our riddle. Remember, I wrote the name in animation with a capital letter? Look: the cube doesn’t move, and the name on the bar is grey! I was wrong. To CSS, capital and small letters are different, so the browser couldn’t find that plan.'), k: 'riddle' },
      { text: L3("Endi nomni xuddi keyframes qatoridagidek, kichik harflar bilan yozamiz. Mana, kubik darrov sakray boshladi!", 'Напишем имя точно как в keyframes — и кубик сразу прыгает. Вот!', 'Write the name exactly as in keyframes, and the cube jumps right away. There!'), k: 'riddle2' },
      { text: L3("Bu esa o'zingiz yasagan animatsiya, qarang!", 'Смотри, это твоя собственная анимация!', 'Look, this is your very own animation!'), k: 'own' },
      { text: L3("keyframes harakatning rejasini yozib qo'yadi.", 'keyframes записывает план движения.', 'keyframes writes the movement plan.'), k: 'kf' },
      { text: L3("animation esa shu rejani nomi bo'yicha topadi va qancha davom etishini aytib, ishga tushiradi.", 'animation запускает этот план по имени и со временем.', 'animation starts that plan by name, with a time.'), k: 'anim' },
      { text: L3("infinite yoki son animatsiya necha marta takrorlanishini aytadi.", 'infinite или число говорят, сколько раз повторить.', 'infinite or a number says how many times to repeat.'), k: 'count' },
      { text: L3("Rejaning nomi esa ikki joyda harfma-harf bir xil yozilishi kerak.", 'А имя в двух местах должно совпадать буква в букву.', 'And the name must match letter for letter in both places.'), k: 'name' },
      { text: L3("Kubigim endi o'zi sakraydi, siz esa sahifadagi istalgan narsani raqsga tushira olasiz! Keyingi darsda saytni telefonga moslashtirishni o'rganamiz, shunda u katta ekranda ham, kichik ekranda ham chiroyli ko'rinadi. Kubigim bilan sizni kutib qolamiz!",
        'Ура! Теперь вещи на твоей странице двигаются сами. На следующем уроке научимся подстраивать сайт под телефон: он будет красивым и на большом экране, и на маленьком. До встречи!',
        'Hooray! Now things on your page move by themselves. Next lesson we’ll learn to fit a site to a phone: it will look good on big and small screens alike. See you!') }
    ],
    roles: {
      kf: L3("@keyframes — harakat rejasi", '@keyframes — план движения', '@keyframes — the movement plan'),
      anim: L3("animation — ishga tushirish", 'animation — запуск', 'animation — starts it'),
      count: L3("infinite yoki son — necha marta", 'infinite или число — сколько раз', 'infinite or a number — how many times'),
      name: L3("nom — harfma-harf bir xil", 'имя — буква в букву', 'the name — letter for letter')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, fineKf: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayKf: 1, sayAnim: 1, sayInf: 1,
  sayJerk: 1, sayPct: 1, sayThree: 1, sayLinear: 1, sayBack: 1, sayAlt: 1, sayName: 1, sayTime: 1, miss: 1, say2: 1, fine: 1, found: 1,
  items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1 }, rounds: { want: 1, opts: 1, hover: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c15-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c15.css@*/
`;
