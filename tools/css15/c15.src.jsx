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
    say: L3("Salom! Qarang, o'yinimning qahramoni to'q sariq kubik. Lekin u qotib turibdi, xuddi rasmdek. O'tgan darsda biz transition bilan silliq o'zgarish qildik, lekin unga sichqoncha kerak edi. Men esa kubik o'zi, hech kim tegmasa ham sakrab tursin deyman. «Aylantirish» tugmasini bosing.",
      'Привет! Смотри, герой моей игры — оранжевый кубик. Но он застыл, как картинка. На прошлом уроке мы сделали плавное изменение через transition, но ему нужна была мышка. А я хочу, чтобы кубик прыгал сам, даже если его никто не трогает. Нажми «Превратить».',
      'Hi! Look, the hero of my game is an orange cube. But it’s frozen, like a picture. Last lesson we made a smooth change with transition, but it needed the mouse. I want the cube to jump by itself, even when nobody touches it. Tap “Transform”.'),
    magic: L3("Mana! Kubik o'zi sakrayapti, sichqonchasiz ham, to'xtamasdan.", 'Вот! Кубик прыгает сам, без мышки и без остановки.', 'There! The cube jumps by itself, without the mouse and without stopping.'),
    magicP: L3("Buni ikki narsa qildi. Birinchisi keyframes, ya'ni harakat rejasi degani: kubik boshida qayerda, o'rtada qayerda turadi. animation esa shu rejani kubikka ulaydi. Pastdagi chiziq animatsiyaning nomini va vaqtini ko'rsatadi.", 'Это сделали две вещи. keyframes — план движения, то есть где кубик в начале, где в середине. А animation подключает этот план к кубику. Полоса внизу показывает имя анимации и время.', 'Two things did it. keyframes is a movement plan, meaning where the cube is at the start and where in the middle. animation connects that plan to the cube. The bar below shows the animation’s name and time.'),
    done: L3("Bugun narsalarni o'zi harakatlantirishni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta animation da nomni katta harf bilan yozgan edim: sakra emas, Sakra. Menimcha, bu bir xil so'z, baribir ishlaydi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься двигать вещи сами по себе. Но сначала загадка. В первый раз я написал имя в animation с большой буквы: не sakra, а Sakra. По-моему, это одно и то же слово, всё равно сработает. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make things move by themselves. But first, a riddle. The first time, I wrote the name in animation with a capital letter: Sakra instead of sakra. I think it’s the same word, so it’ll still work. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("@keyframes va animation", '@keyframes и animation', '@keyframes and animation')
  },
  s2: {
    eyebrow: L3("@keyframes va animation", '@keyframes и animation', '@keyframes and animation'),
    say: L3("Animatsiya ikki qismdan iborat: harakat rejasi va uni ishga tushiradigan qoida. Keling, bittadan qo'shamiz.",
      'Анимация состоит из двух частей: плана движения и правила, которое его запускает. Давай добавим по одной.',
      'An animation has two parts: a movement plan and a rule that starts it. Let’s add them one at a time.'),
    sayKf: L3("Bu keyframes, ya'ni kalit kadrlar degani. sakra bu rejaning nomi. from bo'yicha boshida kubik joyida, to bo'yicha oxirida yigirma piksel yuqorida. Lekin qarang, kubik qimirlamadi: reja bor, uni hech kim ishga tushirmadi.", 'Это keyframes, то есть «ключевые кадры». sakra — имя плана. from — в начале кубик на месте, to — в конце на двадцать пикселей выше. Но смотри, кубик не двинулся: план есть, а запустить его некому.', 'This is keyframes, meaning key frames. sakra is the plan’s name. from: at the start the cube is in place; to: at the end it’s twenty pixels higher. But look, the cube didn’t move: there’s a plan, but nothing starts it.'),
    sayAnim: L3("Endi animation: rejaning nomi sakra va vaqt bir soniya. Kubik bir marta sakradi va joyiga qaytdi. Animatsiya tugadi.", 'Теперь animation: имя плана sakra и время одна секунда. Кубик прыгнул один раз и вернулся. Анимация закончилась.', 'Now animation: the plan’s name sakra and the time one second. The cube jumped once and came back. The animation ended.'),
    sayInf: L3("infinite ya'ni cheksiz degani. Endi kubik to'xtamasdan sakraydi. Chiziqdagi cheksizlik belgisiga qarang.", 'infinite — то есть «бесконечно». Теперь кубик прыгает без остановки. Посмотри на знак бесконечности на полосе.', 'infinite means endless. Now the cube jumps without stopping. Look at the infinity sign on the bar.'),
    done: L3("Demak, keyframes harakatni rejalaydi, animation esa uni nom bilan ulaydi va vaqtini aytadi.", 'Значит, keyframes задаёт план движения, а animation подключает его по имени и задаёт время.', 'So keyframes plans the movement, and animation connects it by name and sets the time.'),
    askStart: L3("Qarang: kubik turibdi", 'Смотри: кубик стоит', 'Watch: the cube is still'),
    askKf: L3("Qarang: reja bor, harakat yo'q", 'Смотри: план есть, движения нет', 'Watch: a plan, but no movement'),
    askAnim: L3("Qarang: bir marta sakradi", 'Смотри: прыгнул один раз', 'Watch: it jumped once'),
    askInf: L3("Qarang: infinite — cheksiz", 'Смотри: infinite — бесконечно', 'Watch: infinite is endless'),
    askDone: L3("@keyframes — reja, animation — ishga tushirish", '@keyframes — план, animation — запуск', '@keyframes is the plan, animation starts it')
  },
  s3: {
    eyebrow: L3("Rejaning nomi", 'Имя плана', 'The plan’s name'),
    say: L3("Endi navbat sizga. Tepada aylanish rejasi tayyor. Kubik aylansin: animation ga rejaning nomini yozing.",
      'Теперь твоя очередь. Вверху готов план вращения. Пусть кубик крутится: впиши в animation имя плана.',
      'Now it’s your turn. A spinning plan is ready at the top. Make the cube spin: type the plan’s name in animation.'),
    msgs: {
      empty: L3("Rejaning nomini yozing.", 'Впиши имя плана.', 'Type the plan’s name.'),
      case: L3("Harflar katta-kichikligi bilan farq qiladi. Nomni keyframes dagidek, aynan bir xil yozing.", 'Большие и маленькие буквы различаются. Напиши имя точно так же, как в keyframes.', 'Capital and small letters are different. Write the name exactly as in keyframes.'),
      word: L3("Bu nom emas. Nom keyframes so'zidan keyin turibdi.", 'Это не имя. Имя стоит сразу после слова keyframes.', 'That’s not the name. The name comes right after the word keyframes.'),
      other: L3("Bunday reja yo'q. Nomni keyframes qatoridan qarang.", 'Такого плана нет. Посмотри имя в строке keyframes.', 'There’s no such plan. Look for the name in the keyframes line.')
    },
    hints: [
      L3("Rejaning nomi keyframes so'zidan keyin yozilgan.", 'Имя плана написано после слова keyframes.', 'The plan’s name is written after the word keyframes.'),
      L3("U yerda aylan deb yozilgan.", 'Там написано aylan.', 'It says aylan there.'),
      L3("aylan deb yozing va Tekshirishni bosing.", 'Впиши aylan и нажми «Проверить».', 'Type aylan and tap Check.')
    ],
    ok: L3("Zo'r! Kubik ikki soniyada bir marta aylanyapti, to'xtamasdan.", 'Огонь! Кубик делает оборот за две секунды без остановки.', 'Awesome! The cube spins once every two seconds, non-stop.'),
    ask: L3("Rejaning nomini yozing", 'Впиши имя плана', 'Type the plan’s name')
  },
  s4: {
    eyebrow: L3("transition yoki animation?", 'transition или animation?', 'transition or animation?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men vazifani aytaman, siz esa nima kerakligini tanlang: transition yoki animation.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, что нужно: transition или animation.',
      'Now check yourself. I’ll say a task, and you pick what’s needed: transition or animation.'),
    ask: L3("Buning uchun nima kerak?", 'Что для этого нужно?', 'What does this need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Narsa o'zi harakatlanadimi yoki sichqoncha kelganda o'zgaradimi?", 'Вещь движется сама или меняется, когда приходит мышка?', 'Does it move by itself, or change when the mouse comes?'),
    hint2: L3("O'zi harakatlansa, bu animation. Sichqoncha bilan silliq o'zgarsa, bu transition.", 'Движется сама — animation, плавно меняется под мышкой — transition.', 'Moves by itself: animation. Changes smoothly under the mouse: transition.'),
    items: [
      { t: L3("Yuklanish doirasi to'xtamasdan aylanadi.", 'Кружок загрузки крутится без остановки.', 'A loading circle spins non-stop.'), right: 'animation', why: L3("U o'zi aylanadi, demak animation.", 'Он крутится сам, значит, animation.', 'It spins by itself, so it’s animation.') },
      { t: L3("Sichqoncha kelganda tugma silliq kattalashadi.", 'Под мышкой кнопка плавно растёт.', 'The button grows smoothly under the mouse.'), right: 'transition', why: L3("Sichqoncha bilan silliq o'zgarish, demak transition.", 'Плавное изменение под мышкой — это transition.', 'A smooth change under the mouse is transition.') },
      { t: L3("Yurakcha har soniyada urib turadi.", 'Сердечко бьётся каждую секунду.', 'A heart beats every second.'), right: 'animation', why: L3("U o'zi takrorlanadi, demak animation.", 'Оно повторяется само, значит, animation.', 'It repeats by itself, so it’s animation.') },
      { t: L3("Sichqoncha kelganda havola rangi silliq o'zgaradi.", 'Под мышкой цвет ссылки плавно меняется.', 'A link’s color changes smoothly under the mouse.'), right: 'transition', why: L3("Bu ham sichqoncha bilan silliq o'zgarish.", 'Это тоже плавное изменение под мышкой.', 'That’s a smooth change under the mouse too.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! transition va animation ni adashtirmaysiz.", 'Всё верно! Ты не путаешь transition и animation.', 'All correct! You don’t mix up transition and animation.')
  },
  s5: {
    eyebrow: L3("Foizli kadrlar", 'Кадры в процентах', 'Frames in percent'),
    say: L3("Qarang, kubik sakraydi, lekin yuqoridan pastga birdaniga tushadi. Nega shunday? Keling, tuzatamiz.",
      'Смотри, кубик прыгает, но сверху вниз падает рывком. Почему так? Давай исправим.',
      'Look, the cube jumps, but it drops from the top all at once. Why? Let’s fix it.'),
    sayJerk: L3("from va to faqat boshi va oxiri. Oxiriga yetgach, animatsiya yana boshidan boshlanadi, shuning uchun kubik pastga sakrab tushadi.", 'from и to — это только начало и конец. Дойдя до конца, анимация снова начинается с начала, поэтому кубик падает вниз рывком.', 'from and to are just the start and the end. After reaching the end, the animation starts over, so the cube snaps back down.'),
    sayPct: L3("Endi kadrlar foizda: nol foiz bu boshi, ellik foiz bu o'rtasi, yuz foiz bu oxiri. O'rtada kubik tepada, oxirida yana pastda. Endi u silliq ko'tariladi va silliq tushadi.", 'Теперь кадры в процентах: ноль процентов — начало, пятьдесят — середина, сто — конец. В середине кубик наверху, в конце снова внизу. Теперь он плавно поднимается и плавно опускается.', 'Now the frames are in percent: zero percent is the start, fifty is the middle, a hundred is the end. In the middle the cube is up, at the end it’s down again. Now it rises and falls smoothly.'),
    sayThree: L3("infinite o'rniga uch soni: kubik uch marta sakraydi va to'xtaydi.", 'Вместо infinite число три: кубик прыгнет три раза и остановится.', 'Instead of infinite, the number three: the cube jumps three times and stops.'),
    done: L3("Demak, foizlar bilan istalgan miqdorda kadr qo'yish mumkin, son esa necha marta takrorlanishini aytadi.", 'Значит, с процентами можно поставить сколько угодно кадров, а число говорит, сколько раз повторить.', 'So with percentages you can add as many frames as you like, and a number says how many times to repeat.'),
    askStart: L3("Qarang: pastga sakrab tushadi", 'Смотри: падает рывком', 'Watch: it snaps down'),
    askJerk: L3("Qarang: from va to", 'Смотри: from и to', 'Watch: from and to'),
    askPct: L3("Qarang: foizli kadrlar", 'Смотри: кадры в процентах', 'Watch: frames in percent'),
    askThree: L3("Qarang: 3 marta va to'xtadi", 'Смотри: 3 раза и стоп', 'Watch: 3 times, then stop'),
    askDone: L3("Kadrlar foizda · son — necha marta", 'Кадры в процентах · число — сколько раз', 'Frames in percent · a number is how many times')
  },
  s6: {
    eyebrow: L3("O'rtasi", 'Середина', 'The middle'),
    say: L3("Endi siz. Rejada boshi va oxiri bor, o'rtadagi kadrning foizi esa yo'q. Kubik o'rtada tepada bo'lishi kerak: foizni yozing.",
      'Теперь ты. В плане есть начало и конец, а у кадра посередине нет процента. Кубик должен быть наверху в середине: впиши процент.',
      'Your turn. The plan has a start and an end, but the middle frame has no percent. The cube should be up in the middle: type the percent.'),
    msgs: {
      empty: L3("Foizni yozing.", 'Впиши процент.', 'Type the percent.'),
      noPct: L3("Son bor, lekin foiz belgisi yo'q. Busiz brauzer kadrni tashlab yuboradi.", 'Число есть, а знака процента нет. Без него браузер выбросит кадр.', 'There’s a number but no percent sign. Without it the browser throws the frame away.'),
      otherPct: L3("Bu boshqa joy. O'rtasi boshi va oxirining qoq o'rtasida.", 'Это другое место. Середина — ровно между началом и концом.', 'That’s a different spot. The middle is exactly between the start and the end.'),
      other: L3("Bu yerga son va foiz belgisi kerak.", 'Здесь нужно число и знак процента.', 'This needs a number and a percent sign.')
    },
    hints: [
      L3("Boshi nol foiz, oxiri yuz foiz. O'rtasi-chi?", 'Начало — ноль процентов, конец — сто. А середина?', 'The start is zero percent, the end is a hundred. And the middle?'),
      L3("O'rtasi ellik foiz.", 'Середина — пятьдесят процентов.', 'The middle is fifty percent.'),
      L3("Ellik va foiz belgisini yozing, keyin Tekshirishni bosing.", 'Впиши пятьдесят и знак процента, потом нажми «Проверить».', 'Type fifty and the percent sign, then tap Check.')
    ],
    ok: L3("Barakalla! Kubik silliq ko'tarilib, silliq tushyapti.", 'Молодец! Кубик плавно поднимается и плавно опускается.', 'Well done! The cube rises and falls smoothly.'),
    ask: L3("O'rtadagi kadr: necha foiz?", 'Кадр посередине: сколько процентов?', 'The middle frame: what percent?')
  },
  s7: {
    eyebrow: L3("Necha marta?", 'Сколько раз?', 'How many times?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men qoida ko'rsataman, siz esa animatsiya necha marta bo'lishini tanlang.",
      'Теперь проверь себя. Я покажу правило, а ты выбери, сколько раз будет анимация.',
      'Now check yourself. I’ll show a rule, and you pick how many times the animation runs.'),
    ask: L3("Animatsiya necha marta bo'ladi?", 'Сколько раз будет анимация?', 'How many times will the animation run?'),
    opts: {
      one: L3("Bir marta", 'Один раз', 'Once'),
      two: L3("Ikki marta", 'Два раза', 'Twice'),
      inf: L3("Cheksiz", 'Без конца', 'Endlessly')
    },
    hint1: L3("Vaqtdan keyin nima yozilgan?", 'Что написано после времени?', 'What’s written after the time?'),
    hint2: L3("Son necha marta ekanini aytadi. infinite bo'lsa cheksiz, hech narsa bo'lmasa bir marta.", 'Число говорит, сколько раз, infinite — без конца, а если ничего нет — один раз.', 'A number says how many times, infinite means endlessly, and nothing means once.'),
    items: [
      { code: '.kub { animation: sakra 1s 2; }', right: 'two', why: L3("Ikki soni turibdi: ikki marta.", 'Стоит число два: два раза.', 'There’s the number two: twice.') },
      { code: '.kub { animation: sakra 1s infinite; }', right: 'inf', why: L3("infinite bu cheksiz degani.", 'infinite — без конца.', 'infinite means endlessly.') },
      { code: '.kub { animation: sakra 1s; }', right: 'one', why: L3("Son yo'q: animatsiya bir marta bo'ladi.", 'Числа нет: анимация будет один раз.', 'No number: the animation runs once.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Takrorlanishni bir qarashda o'qiysiz.", 'Всё верно! Ты сразу видишь, сколько повторов.', 'All correct! You read the repeats at a glance.')
  },
  s8: {
    eyebrow: L3("Tezlik va yo'nalish", 'Скорость и направление', 'Speed and direction'),
    say: L3("Animatsiyada ham tezlikni va yo'nalishni tanlash mumkin. Hozir kubik ikki soniyada bir marta aylanadi. Har aylanishda u biroz to'xtab qolayotganini ko'ryapsizmi?",
      'В анимации тоже можно выбрать скорость и направление. Сейчас кубик делает оборот за две секунды. Видишь, на каждом обороте он будто притормаживает?',
      'You can choose speed and direction in an animation too. Right now the cube spins once every two seconds. See how it seems to slow down on every turn?'),
    sayLinear: L3("Bu ease edi: boshida va oxirida sekin. linear bilan esa aylanish tekis, xuddi g'ildirakdek.", 'Это был ease: в начале и в конце медленно. А с linear вращение ровное, как у колеса.', 'That was ease: slow at the start and the end. With linear the spinning is even, like a wheel.'),
    sayBack: L3("Endi kubik o'ngga yuradi. Lekin har safar oxiriga yetgach, boshiga sakrab qaytadi.", 'Теперь кубик едет вправо. Но каждый раз, доехав до конца, прыгает обратно в начало.', 'Now the cube moves right. But every time it reaches the end, it jumps back to the start.'),
    sayAlt: L3("alternate ya'ni navbatma-navbat degani: bir safar oldinga, bir safar orqaga. Endi kubik borib-qaytadi, sakramasdan.", 'alternate — то есть «по очереди»: раз вперёд, раз назад. Теперь кубик ездит туда и обратно, без рывков.', 'alternate means taking turns: once forward, once back. Now the cube goes there and back, without jumps.'),
    done: L3("Demak, linear tezlikni tekis qiladi, alternate esa animatsiyani borib-qaytadigan qiladi.", 'Значит, linear делает скорость ровной, а alternate — анимацию «туда и обратно».', 'So linear makes the speed even, and alternate makes the animation go there and back.'),
    askStart: L3("Qarang: aylanish", 'Смотри: вращение', 'Watch: spinning'),
    askLinear: L3("Qarang: linear — tekis", 'Смотри: linear — ровно', 'Watch: linear is even'),
    askBack: L3("Qarang: boshiga sakraydi", 'Смотри: прыгает в начало', 'Watch: it jumps to the start'),
    askAlt: L3("Qarang: alternate — borib-qaytish", 'Смотри: alternate — туда и обратно', 'Watch: alternate goes there and back'),
    askDone: L3("linear — tekis · alternate — borib-qaytish", 'linear — ровно · alternate — туда и обратно', 'linear is even · alternate goes there and back')
  },
  s9: {
    eyebrow: L3("Tekis aylanish", 'Ровное вращение', 'Even spinning'),
    say: L3("Endi siz. Kubik g'ildirakdek tekis aylansin, to'xtab qolmasin: tezlik so'zini yozing.",
      'Теперь ты. Пусть кубик крутится ровно, как колесо, без притормаживания: впиши слово скорости.',
      'Your turn. Make the cube spin evenly, like a wheel, without slowing down: type the speed word.'),
    msgs: {
      empty: L3("Tezlik so'zini yozing.", 'Впиши слово скорости.', 'Type the speed word.'),
      ease: L3("ease boshida va oxirida sekinlashadi. Bizga tekis tezlik kerak.", 'ease замедляется в начале и в конце. А нам нужна ровная скорость.', 'ease slows down at the start and the end. We need an even speed.'),
      word: L3("Bu tezlik emas. Tezlik bir xil bo'ladigan so'z kerak.", 'Это не скорость. Нужно слово, при котором скорость одинаковая.', 'That’s not a speed. We need the word that keeps the speed the same.'),
      other: L3("Brauzer bu so'zni tanimadi. Tekis tezlik so'zini yozing.", 'Браузер не узнал это слово. Впиши слово ровной скорости.', 'The browser didn’t recognize that word. Type the word for an even speed.')
    },
    hints: [
      L3("Tekis tezlik inglizcha qanday?", 'Как по-английски «ровная скорость»?', 'What’s the English word for an even speed?'),
      L3("Bu linear.", 'Это linear.', 'It’s linear.'),
      L3("linear deb yozing va Tekshirishni bosing.", 'Впиши linear и нажми «Проверить».', 'Type linear and tap Check.')
    ],
    ok: L3("Ajoyib! Kubik g'ildirakdek tekis aylanyapti.", 'Отлично! Кубик крутится ровно, как колесо.', 'Great! The cube spins evenly, like a wheel.'),
    ask: L3("Aylanish tekis bo'lsin", 'Сделай вращение ровным', 'Make the spinning even')
  },
  s10: {
    eyebrow: L3("Nima yozish kerak?", 'Что дописать?', 'What to add?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kubikda yur animatsiyasi bir soniya turibdi. Men vazifani aytaman, siz esa nima yozish kerakligini tanlang.",
      'Теперь проверь себя. У кубика стоит анимация yur на одну секунду. Я скажу задачу, а ты выбери, что дописать.',
      'Now check yourself. The cube has the yur animation for one second. I’ll say a task, and you pick what to add.'),
    ask: L3("Nima yozish kerak?", 'Что нужно дописать?', 'What do you need to add?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Vazifa nima haqida: takrorlashmi, yo'nalishmi yoki tezlikmi?", 'О чём задача: о повторах, о направлении или о скорости?', 'What’s the task about: repeats, direction or speed?'),
    hint2: L3("infinite bu cheksiz, son bu necha marta, alternate bu borib-qaytish, linear bu tekis tezlik.", 'infinite — без конца, число — сколько раз, alternate — туда и обратно, linear — ровно.', 'infinite is endless, a number is how many times, alternate is there and back, linear is even.'),
    items: [
      { t: L3("Kubik to'xtamasdan yursin.", 'Кубик должен ездить без остановки.', 'The cube should move non-stop.'), right: 'infinite', why: L3("To'xtamasdan, ya'ni cheksiz degani.", 'Без остановки — значит, infinite.', 'Non-stop means infinite.') },
      { t: L3("Kubik roppa-rosa uch marta yursin.", 'Кубик должен проехать ровно три раза.', 'The cube should move exactly three times.'), right: '3', why: L3("Necha marta bo'lsa, o'sha son yoziladi.", 'Сколько раз — то число и пишут.', 'You write the number of times.') },
      { t: L3("Kubik borib, yana qaytib kelsin.", 'Кубик должен ездить туда и обратно.', 'The cube should go there and come back.'), right: 'alternate', why: L3("Borib-qaytish bu alternate.", 'Туда и обратно — это alternate.', 'There and back is alternate.') },
      { t: L3("Kubik bir xil tezlikda yursin.", 'Кубик должен ехать с одинаковой скоростью.', 'The cube should move at the same speed.'), right: 'linear', why: L3("Bir xil tezlik bu linear.", 'Одинаковая скорость — это linear.', 'The same speed is linear.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! animation ni xohlaganingizdek sozlay olasiz.", 'Всё верно! Ты умеешь настроить animation как хочешь.', 'All correct! You can set up animation however you like.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    say: L3("Animatsiyada ham xatolar bo'ladi. Keling, uchtasini ko'ramiz. Hozir hammasi to'g'ri: kubik sakrayapti.",
      'И в анимации бывают ошибки. Давай посмотрим на три. Сейчас всё правильно: кубик прыгает.',
      'Animations have mistakes too. Let’s look at three. Right now everything is correct: the cube is jumping.'),
    sayName: L3("Birinchisi: animation da nomda bitta harf yo'q. Brauzer bunday rejani topmadi, kubik to'xtadi. Chiziqda esa nom kulrang.", 'Первая: в имени в animation не хватает буквы. Браузер не нашёл такого плана, кубик встал. А на полосе имя серое.', 'The first: the name in animation is missing a letter. The browser found no such plan, and the cube stopped. The name on the bar is grey.'),
    sayTime: L3("Ikkinchisi: vaqt yozilmagan. Unda animatsiya nol soniya davom etadi va hech narsa ko'rinmaydi.", 'Вторая: не написано время. Тогда анимация длится ноль секунд, и ничего не видно.', 'The second: no time is written. Then the animation lasts zero seconds, and you see nothing.'),
    sayPct: L3("Uchinchisi: o'rtadagi kadrda foiz belgisi yo'q. Brauzer bu kadrni tashlab yubordi, boshi va oxiri esa bir xil, shuning uchun kubik qimirlamaydi.", 'Третья: у кадра посередине нет знака процента. Браузер выбросил этот кадр, а начало и конец одинаковые, поэтому кубик не двигается.', 'The third: the middle frame has no percent sign. The browser threw that frame away, and the start and end are the same, so the cube doesn’t move.'),
    done: L3("Demak, nom aynan bir xil bo'lishi, vaqt yozilishi va kadrlarda foiz belgisi turishi kerak.", 'Значит, имя должно совпадать точно, время должно быть написано, а у кадров должен быть знак процента.', 'So the name must match exactly, the time must be written, and the frames need a percent sign.'),
    askStart: L3("Qarang: hammasi ishlayapti", 'Смотри: всё работает', 'Watch: everything works'),
    askName: L3("Qarang: sakr — boshqa nom", 'Смотри: sakr — другое имя', 'Watch: sakr is a different name'),
    askTime: L3("Qarang: vaqt yo'q", 'Смотри: нет времени', 'Watch: no time'),
    askPct: L3("Qarang: 50 — foizsiz", 'Смотри: 50 — без процента', 'Watch: 50 without percent'),
    askDone: L3("Aniq nom · vaqt · foiz belgisi", 'Точное имя · время · знак процента', 'An exact name · a time · a percent sign')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men kubik har soniyada sakrasin deb yozdim, lekin u qimirlamayapti! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я хотел, чтобы кубик прыгал каждую секунду, а он не двигается! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wanted the cube to jump every second, but it doesn’t move! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      time: L3("Vaqt hali yo'q. Har soniyada sakrashi uchun bir soniya yozing.", 'Времени всё ещё нет. Чтобы прыгать каждую секунду, напиши одну секунду.', 'There’s still no time. To jump every second, write one second.'),
      unit: L3("Son bor, lekin s harfi yo'q.", 'Число есть, а буквы s нет.', 'There’s a number but no letter s.'),
      comma: L3("Sonda vergul bor. Kasr nuqta bilan yoziladi.", 'В числе запятая. Дробь пишут через точку.', 'There’s a comma in the number. Decimals use a dot.'),
      case: L3("Nom katta harf bilan yozilgan. U keyframes dagidek bo'lishi kerak.", 'Имя написано с большой буквы. Оно должно быть как в keyframes.', 'The name has a capital letter. It must match keyframes.'),
      name: L3("Nom o'zgarib qoldi. Reja sakra deb nomlangan.", 'Имя изменилось. План называется sakra.', 'The name changed. The plan is called sakra.'),
      inf: L3("Kubik to'xtamasdan sakrashi kerak: infinite qolsin.", 'Кубик должен прыгать без остановки: оставь infinite.', 'The cube should jump non-stop: keep infinite.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Nom, vaqt va infinite ni tekshiring.", 'Браузер не узнал это значение. Проверь имя, время и infinite.', 'The browser didn’t recognize that value. Check the name, the time and infinite.'),
      other: L3("Vaqt boshqa. Har soniyada sakrashi uchun bir soniya kerak.", 'Время другое. Нужно каждую секунду, то есть одна секунда.', 'The time is different. We need every second, that is one second.')
    },
    hints: [
      L3("animation da nima yetishmayapti: nom, vaqt yoki takrorlash?", 'Чего не хватает в animation: имени, времени или повторов?', 'What’s missing in animation: the name, the time or the repeats?'),
      L3("Vaqt yo'q. Nomdan keyin vaqt yoziladi.", 'Нет времени. После имени пишут время.', 'There’s no time. The time goes after the name.'),
      L3("sakra, bo'sh joy, bir s, bo'sh joy, infinite deb yozing va Tekshirishni bosing.", 'Впиши sakra, пробел, 1s, пробел, infinite и нажми «Проверить».', 'Type sakra, space, 1s, space, infinite and tap Check.')
    ],
    ok: L3("Ura, ishladi! Kubik har soniyada sakrayapti.", 'Ура, заработало! Кубик прыгает каждую секунду.', 'Hooray, it works! The cube jumps every second.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga va chiziqqa qarang, keyin o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и на полосу, потом нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and the bar, then tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      name: L3("Topdingiz! Nomda harflar almashgan edi.", 'Есть! В имени были переставлены буквы.', 'Found it! Letters in the name were swapped.'),
      time: L3("Topdingiz! Vaqt yozilmagan edi.", 'Есть! Не было написано время.', 'Found it! The time wasn’t written.')
    },
    hint1: L3("Kubik harakatlanyaptimi? Chiziqqa qarang.", 'Кубик двигается? Посмотри на полосу.', 'Is the cube moving? Look at the bar.'),
    hint2: {
      name: L3("Chiziqda nom kulrang: bunday reja yo'q. animation dagi nomni keyframes bilan solishtiring.", 'На полосе имя серое: такого плана нет. Сравни имя в animation с keyframes.', 'The name on the bar is grey: there’s no such plan. Compare the name in animation with keyframes.'),
      time: L3("Chiziqda nol soniya. animation da vaqt bormi?", 'На полосе ноль секунд. Есть ли время в animation?', 'The bar shows zero seconds. Is there a time in animation?')
    },
    hint3: {
      name: L3("Xato ikkinchi qoidada: aylna. O'sha qatorni bosing.", 'Ошибка во втором правиле: aylna. Нажми эту строку.', 'The bug is in the second rule: aylna. Tap that line.'),
      time: L3("Xato oxirgi qoidada: vaqt yo'q. O'sha qatorni bosing.", 'Ошибка в последнем правиле: нет времени. Нажми эту строку.', 'The bug is in the last rule: no time. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz animatsiyalarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь анимации как настоящий разработчик.', 'Super! Both found. You check animations like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. aylan rejasi tayyor. Kubik uchun qoida yozing: aylan rejasi, ikki soniya, tekis tezlik va cheksiz.",
      'Теперь напиши правило целиком. План aylan уже готов. Напиши правило для кубика: план aylan, две секунды, ровная скорость и без конца.',
      'Now write the whole rule yourself. The aylan plan is ready. Write a rule for the cube: the aylan plan, two seconds, an even speed and endlessly.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin figurali qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Selektor: nuqta va kubik klassi.", 'Селектор: точка и класс кубика.', 'The selector: a dot and the cube’s class.'),
      prop: L3("Rejani animation xususiyati ishga tushiradi.", 'План запускает свойство animation.', 'The animation property starts the plan.'),
      comma: L3("Sonda vergul bor. Kasr nuqta bilan yoziladi.", 'В числе запятая. Дробь пишут через точку.', 'There’s a comma in the number. Decimals use a dot.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Nom, vaqt va so'zlarni tekshiring.", 'Браузер не узнал это значение. Проверь имя, время и слова.', 'The browser didn’t recognize that value. Check the name, the time and the words.'),
      case: L3("Nom keyframes dagidek kichik harflar bilan bo'lishi kerak.", 'Имя должно быть маленькими буквами, как в keyframes.', 'The name must be in small letters, as in keyframes.'),
      name: L3("Nom boshqa. Reja aylan deb nomlangan.", 'Имя другое. План называется aylan.', 'The name is different. The plan is called aylan.'),
      unit: L3("Vaqtga s harfi kerak.", 'Времени нужна буква s.', 'The time needs the letter s.'),
      time: L3("Vaqt yo'q. Ikki soniya yozing.", 'Нет времени. Напиши две секунды.', 'There’s no time. Write two seconds.'),
      other: L3("Vaqt boshqa. Ikki soniya kerak.", 'Время другое. Нужно две секунды.', 'The time is different. We need two seconds.'),
      lin: L3("Tezlik tekis bo'lishi kerak: linear.", 'Скорость должна быть ровной: linear.', 'The speed should be even: linear.'),
      inf: L3("Kubik to'xtamasligi kerak: infinite.", 'Кубик не должен останавливаться: infinite.', 'The cube shouldn’t stop: infinite.')
    },
    hints: [
      L3("Selektor kubik klassi, xususiyat animation, qiymatda esa nom, vaqt, tezlik va cheksiz.", 'Селектор — класс кубика, свойство — animation, а в значении — имя, время, скорость и «без конца».', 'The selector is the cube’s class, the property is animation, and the value has the name, time, speed and endlessly.'),
      L3("Qiymat: aylan, ikki s, linear, infinite.", 'Значение: aylan, 2s, linear, infinite.', 'The value: aylan, 2s, linear, infinite.'),
      L3("Shunday yozing: nuqta kub, figurali qavs, animation ikki nuqta aylan ikki s linear infinite, nuqtali vergul, yopuvchi qavs.", 'Напиши так: точка kub, фигурная скобка, animation двоеточие aylan 2s linear infinite, точка с запятой, закрывающая скобка.', 'Write it like this: dot kub, curly brace, animation colon aylan 2s linear infinite, semicolon, closing brace.')
    ],
    ok: L3("Ajoyib! Kubik g'ildirakdek aylanyapti. Qoidani o'zingiz yozdingiz.", 'Отлично! Кубик крутится как колесо. Правило написано тобой целиком.', 'Great! The cube spins like a wheel. You wrote the whole rule yourself.'),
    ask: L3("aylan · 2s · linear · infinite", 'aylan · 2s · linear · infinite', 'aylan · 2s · linear · infinite')
  },
  s14: {
    eyebrow: L3("O'z animatsiyangiz", 'Своя анимация', 'Your own animation'),
    say: L3("Endi o'z animatsiyangizni yarating. Oxirida kubik qanday bo'lishini, qancha vaqt davom etishini va necha marta takrorlanishini o'zingiz tanlang. Keyin «Tayyor»ni bosing.",
      'Теперь сделай свою анимацию. Сам выбери, каким кубик станет в конце, сколько это длится и сколько раз повторится. Потом нажми «Готово».',
      'Now make your own animation. Choose what the cube becomes at the end, how long it takes and how many times it repeats. Then tap “Done”.'),
    msgs: {
      tf: L3("Brauzer {w} qiymatini tanimadi. Masalan, scale, rotate yoki translate yozing.", 'Браузер не узнал значение {w}. Впиши, например, scale, rotate или translate.', 'The browser didn’t recognize {w}. Type, for example, scale, rotate or translate.'),
      comma: L3("Vaqtda vergul bor. Kasr nuqta bilan yoziladi.", 'Во времени запятая. Дробь пишут через точку.', 'There’s a comma in the time. Decimals use a dot.'),
      unit: L3("Vaqtga s yoki ms kerak.", 'Времени нужны s или ms.', 'The time needs s or ms.'),
      time: L3("Brauzer {w} vaqtini tanimadi. Son va s yozing.", 'Браузер не узнал время {w}. Напиши число и s.', 'The browser didn’t recognize the time {w}. Write a number and s.'),
      zero: L3("Nol soniyada hech narsa ko'rinmaydi. Noldan katta vaqt yozing.", 'За ноль секунд ничего не видно. Напиши время больше нуля.', 'With zero seconds you see nothing. Write a time greater than zero.'),
      long: L3("Bu juda uzoq. Besh soniyadan kam yozing.", 'Это слишком долго. Напиши меньше пяти секунд.', 'That’s too long. Write less than five seconds.'),
      count: L3("{w} bu takrorlash emas. infinite yoki son yozing.", '{w} — это не повторы. Впиши infinite или число.', '{w} isn’t a repeat count. Type infinite or a number.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Birinchisiga scale, rotate yoki translate, ikkinchisiga vaqt, uchinchisiga infinite yoki son.", 'В первое — scale, rotate или translate, во второе — время, в третье — infinite или число.', 'In the first, scale, rotate or translate; in the second, a time; in the third, infinite or a number.'),
      L3("Masalan: rotate qirq besh deg, bir s va infinite. Keyin «Tayyor»ni bosing.", 'Например: rotate сорок пять deg, 1s и infinite. Потом нажми «Готово».', 'For example: rotate forty-five deg, 1s and infinite. Then tap “Done”.')
    ],
    ok: L3("Voy, kubik jonlandi! Bu sizning o'z animatsiyangiz.", 'Ого, кубик ожил! Это твоя собственная анимация.', 'Wow, the cube came alive! This is your very own animation.'),
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
    hint1: L3("Gap nima haqida: reja, ishga tushirish yoki nom?", 'О чём фраза: о плане, о запуске или об имени?', 'What’s the sentence about: the plan, starting it or the name?'),
    hint2: L3("Esingizdami: keyframes faqat reja, animation uni ishga tushiradi, infinite cheksiz degani, nom aynan bir xil bo'lishi kerak.", 'Вспомни: keyframes — только план, animation его запускает, infinite — без конца, а имя должно совпадать точно.', 'Remember: keyframes is only a plan, animation starts it, infinite is endless, and the name must match exactly.'),
    items: [
      { t: L3("Faqat keyframes ning o'zi kubikni harakatlantiradi.", 'Один только keyframes двигает кубик.', 'keyframes alone moves the cube.'), right: false, code: 'kfOnly',
        why: L3("Aslida keyframes faqat reja. Uni animation ishga tushiradi.", 'На самом деле keyframes — только план. Запускает его animation.', 'Actually keyframes is only a plan. animation starts it.') },
      { t: L3("infinite bilan animatsiya to'xtamaydi.", 'С infinite анимация не останавливается.', 'With infinite the animation doesn’t stop.'), right: true,
        why: L3("To'g'ri: infinite cheksiz degani.", 'Верно: infinite значит «без конца».', 'Right: infinite means endless.') },
      { t: L3("Animatsiya sichqonchasiz ham ishlaydi.", 'Анимация работает и без мышки.', 'An animation works without the mouse too.'), right: true,
        why: L3("To'g'ri: animation o'zi ishlaydi, transition dan farqli.", 'Верно: animation работает сама, в отличие от transition.', 'Right: animation runs by itself, unlike transition.') },
      { t: L3("Bu kubik sakraydi.", 'Этот кубик будет прыгать.', 'This cube will jump.'), right: false, code: 'caps',
        why: L3("Aslida nom boshqacha yozilgan: katta harf bilan. Nega bu muhim, hozir ko'ramiz.", 'На самом деле имя написано по-другому: с большой буквы. Почему это важно — сейчас увидим.', 'Actually the name is written differently: with a capital letter. We’ll see why it matters in a moment.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz animatsiyalarni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в анимациях.', 'All correct! You know animations really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men animation da nomni katta harf bilan yozgan edim? Qarang: kubik qimirlamayapti, chiziqda esa nom kulrang! Men adashibman. CSS uchun katta va kichik harflar har xil, shuning uchun brauzer bunday rejani topmadi.",
        'Вернёмся к загадке. Помнишь, я написал имя в animation с большой буквы? Смотри: кубик не двигается, а на полосе имя серое! Я ошибся. Для CSS большие и маленькие буквы — разные, поэтому браузер не нашёл такой план.',
        'Back to our riddle. Remember, I wrote the name in animation with a capital letter? Look: the cube doesn’t move, and the name on the bar is grey! I was wrong. To CSS, capital and small letters are different, so the browser couldn’t find that plan.'), k: 'riddle' },
      { text: L3("Nomni aynan keyframes dagidek yozsak, kubik darrov sakraydi. Mana!", 'Напишем имя точно как в keyframes — и кубик сразу прыгает. Вот!', 'Write the name exactly as in keyframes, and the cube jumps right away. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning o'z animatsiyangiz!", 'Смотри, это твоя собственная анимация!', 'Look, this is your very own animation!'), k: 'own' },
      { text: L3("keyframes harakat rejasini yozadi.", 'keyframes записывает план движения.', 'keyframes writes the movement plan.'), k: 'kf' },
      { text: L3("animation shu rejani nom va vaqt bilan ishga tushiradi.", 'animation запускает этот план по имени и со временем.', 'animation starts that plan by name, with a time.'), k: 'anim' },
      { text: L3("infinite yoki son necha marta takrorlanishini aytadi.", 'infinite или число говорят, сколько раз повторить.', 'infinite or a number says how many times to repeat.'), k: 'count' },
      { text: L3("Nom esa ikki joyda harfma-harf bir xil bo'lishi kerak.", 'А имя в двух местах должно совпадать буква в букву.', 'And the name must match letter for letter in both places.'), k: 'name' },
      { text: L3("Tabriklayman! Endi sahifangizdagi narsalar o'zi harakatlanadi. Keyingi darsda saytni telefonga moslashni o'rganamiz: katta ekranda ham, kichik ekranda ham chiroyli bo'ladi. Ko'rishguncha!",
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
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayKf: 1, sayAnim: 1, sayInf: 1,
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
