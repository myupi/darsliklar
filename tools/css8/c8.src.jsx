// =============================================================================
// КУРС «CSS» · Урок 8 — «Красивые карточки»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css8/build.mjs → lessons/css/08-kartochki.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 8 · «Красивые карточки» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–7: правило, селекторы, цвета, фон, текст, размеры, Box Model. Коди сделал карточки
// кружков — простые сиреневые прямоугольники. Ученик узнаёт border-radius (скругление углов), box-shadow
// (тень: вправо, вниз, размытие, цвет — через пробел, без запятых) и рамку одной стороны (border-top / right / bottom /
// left). Загадка (без имён): Коди даёт широкой карточке border-radius 100px и ждёт круг. Разгадка: получается таблетка;
// круг — квадратная коробка (width = height) и border-radius 50% (уроки 6 и 7).
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (белые прямоугольники → радиус, тень, полоса слева; загадка про круг)
//   радиус: s2 показ (8 → 24 → 50px) · s3 вписать 16px (Fill) · s4 радиус ↔ фигура (Matching)
//   тень:   s5 показ (вправо и вниз → только вниз → размытие → цвет) · s6 вписать сдвиг вправо (Fill) · s7 какой код у тени (выбор)
//   сторона: s8 показ (left → bottom → top) · s9 вписать свойство border-left (Fill) · s10 какая сторона (Sort)
//   поломки: s11 показ (радиус без px, тень с запятыми, без запятых) · s12 исправить тень (Debug & Fix) · s13 найти сломанное правило
//   w1 правило целиком: h1 { border-bottom: 3px solid orange; } (перенос) · s14 своя карточка: радиус, тень, полоса («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: верная ли запись — решает Chrome (CSS.supports): «16» без px и тень с запятыми не принимаются.
//   · Основа страницы — тусклая строка: сиреневый фон карточек и padding (уроки 4 и 7).
//   · Узбекский — по /uzbekcha; в речи нет символов: «piksel», «foiz», числа словами.
//
// СИСТЕМА СЛОВ: border-radius — burchaklarni yumaloqlash / скругление углов; box-shadow — soya / тень; xiralik — размытие;
// tomon — сторона; kartochka — карточка; doira — круг; kvadrat — квадрат. В речи названия свойств — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-08-kartochki',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '8-dars. Chiroyli kartochkalar',
    ru: 'Урок 8. Красивые карточки',
    en: 'Lesson 8. Beautiful cards'
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
  next: L3("Elementlar sahifada qanday turadi", 'Как элементы ведут себя на странице', 'How elements behave on a page'),
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
  // Страница кружков Коди (не звучит).
  site: {
    title: L3("Kodining to'garaklari", 'Кружки Коди', 'Kodi’s clubs'),
    n1: L3("Futbol: seshanba", 'Футбол: вторник', 'Football: Tuesday'),
    n2: L3("Shaxmat: juma", 'Шахматы: пятница', 'Chess: Friday')
  },
  s1: {
    eyebrow: L3("Kartochkalar", 'Карточки', 'Cards'),
    say: L3("Salom! Men to'garaklarim uchun kartochkalar yasadim. Lekin bir qarang-chi: ular oddiygina to'rtburchak bo'lib qolibdi. Telefondagi ilovalarda kartochkalar ancha chiroyli-ku! Qani, «Aylantirish» tugmasini bosib ko'ring.",
      'Привет! Я сделал карточки для своих кружков. Но смотри: это просто прямоугольники. А в приложениях карточки куда красивее! Нажми «Превратить».',
      'Hi! I made cards for my clubs. But look: they’re just plain rectangles. Cards in apps look much nicer! Tap “Transform”.'),
    magic: L3("Ko'rdingizmi? Burchaklar yumaloqlanib, ostida yumshoq soya paydo bo'ldi, chap tomonida esa rangli chiziq chiqdi. Endi bu haqiqiy kartochkaga o'xshayapti!",
      'Вот! Углы стали круглыми, снизу появилась мягкая тень, а слева — цветная полоса. Теперь это настоящая карточка!',
      'There! The corners got round, a soft shadow appeared underneath, and a colored stripe on the left. Now it’s a real card!'),
    magicP: L3("Bu o'zgarishlarning har biri ortida bitta xususiyat turibdi: burchaklarni border-radius yumaloqladi, soyani box-shadow tushirdi, chap tomondagi chiziqni esa border-left chizdi.",
      'Это сделали три свойства: border-radius, то есть скругление углов, box-shadow, то есть тень, и border-left, то есть рамка только слева.',
      'Three properties did it: border-radius, meaning rounded corners, box-shadow, meaning a shadow, and border-left, meaning a border on the left side only.'),
    done: L3("Ana shunday kartochkalarni bugun o'zingiz yasaysiz. Menda esa siz uchun bitta savol bor. Men tangadek dumaloq kartochka yasamoqchiman. Rejam oddiy: border-radius qiymatini juda katta qilaman, yuz piksel! Burchaklar shuncha yumaloqlansa, kartochka doiraga aylanmay qayoqqa borardi? Siz bo'lsangiz, shunday qilarmidingiz? Bu rejani dars oxirida sinab ko'ramiz.",
      'Сегодня ты научишься делать красивые карточки. Но сначала загадка. Я хочу круглую карточку и делаю border-radius очень большим: сто пикселей. По-моему, карточка станет кругом. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make beautiful cards. But first, a riddle. I want a round card, so I make border-radius really big: a hundred pixels. I think the card will become a circle. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("border-radius · box-shadow · border-left", 'border-radius · box-shadow · border-left', 'border-radius · box-shadow · border-left')
  },
  s2: {
    eyebrow: L3("Yumaloq burchaklar", 'Круглые углы', 'Round corners'),
    help: [
      L3("Kartochkaning burchaklariga bir qarang-chi: kodda son kattalashgani sari ular tobora yumaloqlanib boradi.", 'Посмотри на углы карточки: чем больше число, тем они круглее.', 'Look at the card’s corners: the bigger the number, the rounder they get.'),
      L3("Buni border-radius qiladi. U har bir burchakni yumaloqlaydi, son qancha katta bo'lsa, burchak ham shuncha yumaloq bo'ladi.", 'border-radius скругляет углы. Чем больше число, тем круглее угол.', 'border-radius rounds the corners. The bigger the number, the rounder the corner.'),
      L3("Telefoningizning burchaklariga qarang: ular o'tkir emas, yumaloq-ku. Ilovalardagi tugma va kartochkalar ham xuddi shunday yumaloq qilingan, border-radius ham shu ishni qiladi.", 'Посмотри на углы своего телефона: они не острые, а круглые. Кнопки и карточки в приложениях сделаны так же.', 'Look at your phone’s corners: they’re round, not sharp. Buttons and cards in apps are made the same way.')
    ],
    say: L3("Keling, birinchisidan boshlaymiz: border-radius. U kartochkaning burchaklarini yumaloqlaydi. Son qancha katta bo'lsa, burchak ham shuncha yumaloq bo'ladi. Hozircha esa burchaklar o'tkir turibdi.",
      'Первое — border-radius. Он скругляет углы. Чем больше число, тем круглее угол. Сейчас углы острые.',
      'The first is border-radius. It rounds the corners. The bigger the number, the rounder the corner. Right now the corners are sharp.'),
    sayS: L3("Endi sakkiz piksel yozdik. Sezdingizmi? Burchaklar sal yumshab, kartochka ancha yoqimli ko'rinib qoldi.", 'Восемь пикселей: углы чуть смягчились, карточка выглядит приятнее.', 'Eight pixels: the corners softened a little, the card looks nicer.'),
    sayM: L3("Yigirma to'rt piksel qo'ysak-chi? Qarang, burchaklar ancha yumaloqlandi, xuddi telefondagi ilova tugmalaridek!", 'Двадцать четыре пикселя: углы заметно круглые.', 'Twenty-four pixels: the corners are clearly round.'),
    sayL: L3("Ellik pikselda esa kartochkaning chetlari butunlay yumaloqlanib ketdi. Qarang, u xuddi dori tabletkasiga o'xshab qoldi!", 'Пятьдесят пикселей: края совсем круглые, карточка похожа на таблетку.', 'Fifty pixels: the ends are fully round, the card looks like a pill.'),
    done: L3("Demak, border-radius burchaklarni yumaloqlaydi, son esa qanchalik yumaloq bo'lishini aytib turadi.", 'Значит, border-radius скругляет углы, а число говорит, насколько сильно.', 'So border-radius rounds the corners, and the number says how much.'),
    askStart: L3("Qarang: burchaklar o'tkir", 'Смотри: углы острые', 'Watch: sharp corners'),
    askS: L3("Qarang: 8px", 'Смотри: 8px', 'Watch: 8px'),
    askM: L3("Qarang: 24px", 'Смотри: 24px', 'Watch: 24px'),
    askL: L3("Qarang: 50px", 'Смотри: 50px', 'Watch: 50px'),
    askDone: L3("border-radius — yumaloq burchaklar", 'border-radius — круглые углы', 'border-radius means round corners')
  },
  s3: {
    eyebrow: L3("Burchaklar", 'Углы', 'Corners'),
    say: L3("Qani, burchaklarni endi o'zingiz yumaloqlang! Kartochkaning burchaklari o'n olti piksel yumaloq bo'lsin: buning uchun border-radius qiymatini yozing.",
      'Теперь твоя очередь. Пусть углы карточки скруглятся на шестнадцать пикселей: впиши значение для border-radius.',
      'Now it’s your turn. Round the card’s corners by sixteen pixels: type the value for border-radius.'),
    msgs: {
      empty: L3("Maydon hali bo'sh. Bu yerga son yozasiz, yoniga esa px qo'shasiz.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Son bor-u, px tushib qolibdi. Busiz brauzer qoidani o'tkazib yuboradi, burchaklar o'tkirligicha qoladi. Son yoniga px qo'shing.", 'Написано только число. Браузер его выбрасывает: добавь к числу px.', 'Only a number. The browser throws it away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi, shuning uchun burchaklar o'zgarmadi. Sonni yozing-da, unga bo'sh joysiz px ulang.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Burchaklar yumaloqlandi, lekin biz kutgandek emas. Bizga roppa-rosa o'n olti piksel kerak.", 'Углы круглые, но не так. Нужно шестнадцать пикселей.', 'The corners are round, but not like that. We need sixteen pixels.')
    },
    hints: [
      L3("border-radius qiymati ikki bo'lakdan yasaladi: son va o'lchov birligi.", 'Значение — число и единица.', 'The value is a number and a unit.'),
      L3("Son o'n olti bo'ladi, o'lchov birligi esa px.", 'Число шестнадцать, единица px.', 'The number is sixteen, the unit is px.'),
      L3("O'n olti sonini yozing, yoniga px qo'shing-da, «Tekshirish»ni bosing.", 'Впиши число шестнадцать, допиши px и нажми «Проверить».', 'Type the number sixteen, add px and tap Check.')
    ],
    ok: L3("Zo'r! Burchaklar yumshoq bo'ldi, kartochka ham birdan chiroyli ko'rinib qoldi.", 'Огонь! Углы мягкие, карточка красивая.', 'Awesome! Soft corners, a pretty card.'),
    ask: L3("Burchaklarni 16px yumaloqlang", 'Скругли углы на 16px', 'Round the corners by 16px')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("O'ngda uchta shakl turibdi, burchaklari har xil yumaloq. Qaysi shaklga qancha border-radius berilganini ko'z bilan topa olasizmi? Har bir qiymatni bosib, o'sha qiymatli shaklni o'ng tomondan qidiring.",
      'Теперь соедини значения с фигурами. Нажми значение слева, а потом фигуру с такими углами справа.',
      'Now match the values with the shapes. Tap a value on the left, then the shape with those corners on the right.'),
    why: {
      r4: L3("Hechqisi yo'q! To'rt piksel juda oz, bunday shaklning burchaklari deyarli o'tkir bo'ladi.", 'Четыре пикселя — совсем мало: углы почти острые.', 'Four pixels is tiny: the corners are almost sharp.'),
      r16: L3("Unday emas: o'n olti piksel o'rtacha yumaloqlik beradi. Burchaklari sezilarli yumaloq, lekin tabletka emas, shunday shaklni qidiring.", 'Шестнадцать пикселей — средне: углы заметно круглые.', 'Sixteen pixels is medium: the corners are noticeably round.'),
      r40: L3("Yana bir qarang-chi: qirq piksel eng katta qiymat, demak, shakl ham deyarli tabletkaga aylangan bo'ladi.", 'Сорок пикселей — больше всех: фигура почти таблетка.', 'Forty pixels is the biggest: the shape is almost a pill.')
    },
    pairOk: {
      r4: L3("Ana, burchaklari eng o'tkiri shu ekan!", 'Верно, это самая острая.', 'Right, that’s the sharpest.'),
      r16: L3("Ha, o'rtacha yumalog'i aynan shu.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      r40: L3("Barakalla, eng yumalog'i shu!", 'Верно, это самая круглая.', 'Right, that’s the roundest.')
    },
    pickFirst: L3("Oldin chapdan qiymatni tanlang.", 'Сначала выбери значение слева.', 'First pick a value on the left.'),
    hints: [
      L3("Shakllarning burchaklarini solishtirib ko'ring: son qancha katta bo'lsa, burchak ham shuncha yumaloq bo'ladi.", 'Чем больше число, тем круглее угол.', 'The bigger the number, the rounder the corner.'),
      L3("Demak, to'rt pikselda burchaklar deyarli o'tkir, qirqda eng yumaloq, o'n oltida esa o'rtacha bo'ladi.", 'Четыре пикселя — почти острые, сорок — самые круглые, шестнадцать — посередине.', 'Four pixels is almost sharp, forty is the roundest, sixteen is in between.'),
      L3("Oldin yonib turgan qiymatni, keyin yonib turgan shaklni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Uchala shakl ham o'z juftini topdi! Burchaklarning yumaloqligini ko'z bilan chamalash sizga qiyin emas ekan.", 'Отлично! Ты прикидываешь скругление на глаз.', 'Great! You can estimate the rounding by eye.'),
    ask: L3("Qiymatni, keyin shaklni bosing", 'Нажми значение, потом фигуру', 'Tap a value, then a shape'),
    askPlace: L3("Endi shunday shaklni bosing", 'Теперь нажми такую фигуру', 'Now tap that shape')
  },
  s5: {
    eyebrow: L3("Soya", 'Тень', 'Shadow'),
    help: [
      L3("Kodda box-shadow qiymatiga qarang: unda to'rtta bo'lak bor. Qaysi bo'lak o'zgarganda soya qanday o'zgarayotganini kuzatib turing.", 'Посмотри на четыре части box-shadow в коде и следи, как меняется тень, когда меняется каждая.', 'Look at the four parts of box-shadow in the code and watch how the shadow changes when each part changes.'),
      L3("Birinchi son soyani o'ngga, ikkinchisi pastga suradi, uchinchisi uni xiralashtiradi, oxirida esa rangi keladi. Xiralik qancha katta bo'lsa, soya shuncha yumshoq ko'rinadi.", 'box-shadow состоит из четырёх частей: сдвиг вправо, сдвиг вниз, размытие и цвет. Чем больше размытие, тем мягче тень.', 'box-shadow has four parts: shift right, shift down, blur and color. The more blur, the softer the shadow.'),
      L3("Quyoshli kunda qo'lingizning soyasiga qarang: u doim quyoshning teskari tomoniga tushadi. CSS kodida esa soya qayerga tushishini o'zingiz aytasiz.", 'Посмотри на тень от руки в солнечный день: она падает в сторону от света. Тени в CSS ты сам говоришь, куда падать.', 'Look at your hand’s shadow on a sunny day: it falls away from the light. In CSS, you tell the shadow where to fall.')
    ],
    say: L3("Endi kartochkaga soya beramiz. Buni box-shadow qiladi, shadow inglizchada «soya» degani. Uning qiymatida to'rtta bo'lak bor. Birinchi son soyani o'ngga suradi, ikkinchisi pastga. Uchinchisi-chi? U soyani xiralashtiradi, oxirida esa rangi keladi. Qani, bittalab ko'ramiz!",
      'Теперь тень, то есть box-shadow. В её значении четыре части: первое число — насколько тень сдвинута вправо; второе — насколько вниз; третье — насколько она размыта; в конце — цвет.',
      'Now the shadow, that is box-shadow. Its value has four parts: the first number is how far the shadow moves right; the second, how far down; the third, how blurry it is; and the color at the end.'),
    sayRD: L3("Mana, birinchi soya: olti piksel o'ngga, olti piksel pastga, xiraligi nol, rangi kulrang. Qarang-chi, kartochka ortida chetlari aniq kulrang soya paydo bo'ldi.", 'Шесть пикселей вправо, шесть вниз, размытие ноль, цвет серый. Смотри: за карточкой резкая серая тень.', 'Six pixels right, six down, zero blur, color gray. Look: a sharp gray shadow behind the card.'),
    sayD: L3("Endi birinchi sonni nol qildik. Ko'rdingizmi? Soya o'ngga chiqmay qoldi, faqat pastdagisi turibdi.", 'Теперь первое число ноль: тень не сдвинулась вправо, осталась только снизу.', 'Now the first number is zero: the shadow didn’t move right, it’s only below.'),
    sayBlur: L3("Keyin uchinchi sonni o'n olti qildik. Soya xiralashib, yumshoq bo'lib qoldi. Ilovalardagi kartochkalarning soyasi ham xuddi shunaqa bo'ladi.", 'Третье число шестнадцать: тень размылась и стала мягкой. Так выглядят карточки в приложениях.', 'The third number is sixteen: the shadow blurred and became soft. That’s how cards in apps look.'),
    sayColor: L3("Oxirgi bo'lak rang edi. Uni orange qildik, endi soya to'q sariq, kartochka go'yo nur sochib turibdi!", 'Последняя часть — цвет: теперь тень оранжевая, карточка будто светится.', 'The last part is the color: now the shadow is orange, the card seems to glow.'),
    done: L3("Demak, box-shadow qiymatida tartib shunday: oldin o'ngga qancha, keyin pastga qancha, keyin xiraligi, oxirida rangi. Bo'laklarni bo'sh joy bilan ajratib yozamiz.", 'Значит, box-shadow: вправо, вниз, размытие и цвет. Числа пишутся через пробел.', 'So box-shadow is: right, down, blur and color. The numbers are separated by spaces.'),
    askStart: L3("Qarang: o'ngga · pastga · xiralik · rang", 'Смотри: вправо · вниз · размытие · цвет', 'Watch: right · down · blur · color'),
    askRD: L3("Qarang: o'ngga va pastga", 'Смотри: вправо и вниз', 'Watch: right and down'),
    askD: L3("Qarang: faqat pastga", 'Смотри: только вниз', 'Watch: only down'),
    askBlur: L3("Qarang: xira soya", 'Смотри: размытая тень', 'Watch: a blurry shadow'),
    askColor: L3("Qarang: rangli soya", 'Смотри: цветная тень', 'Watch: a colored shadow'),
    askDone: L3("box-shadow: o'ngga pastga xiralik rang", 'box-shadow: вправо вниз размытие цвет', 'box-shadow: right down blur color')
  },
  s6: {
    eyebrow: L3("Soya o'ngga", 'Тень вправо', 'Shadow to the right'),
    say: L3("Mana, soya pastga olti piksel tushib turibdi. Endi u o'ngga ham olti piksel chiqsin. Esingizdami, soyani o'ngga qaysi son suradi? O'sha sonni yozing.",
      'Теперь ты. Тень уже сдвинута вниз на шесть пикселей, пусть она сдвинется и вправо на шесть. Какое число сдвигает вправо? Впиши его.',
      'Your turn. The shadow already moves six pixels down; now let it move six pixels right too. Which number moves it right? Type it.'),
    msgs: {
      empty: L3("Maydon bo'sh qoldi. Bu yerga birinchi son kerak: son bilan px.", 'Впиши первое число: число и px.', 'Type the first number: a number and px.'),
      noUnit: L3("Sonning o'zi yozilibdi, yonida px yo'q. Son yoniga px qo'shib qo'ying.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Brauzer soyani tushunmadi va uni umuman chizmadi. Bu maydonga bitta son bilan px yozing, xolos.", 'Браузер не узнал тень и не нарисовал её. Напиши одно число и px.', 'The browser didn’t recognize the shadow and didn’t draw it. Type one number and px.'),
      zero: L3("Nol yozsak, soya o'ngga umuman chiqmaydi-ku. Bizga olti piksel kerak.", 'При нуле тень не сдвигается вправо. Нужно шесть пикселей.', 'With zero the shadow doesn’t move right. We need six pixels.'),
      other: L3("Soya o'ngga surildi, lekin kerakli joyga emas. Bizga aynan olti piksel kerak.", 'Тень сдвинулась вправо, но на другое расстояние. Нужно шесть пикселей.', 'The shadow moved right, but by a different amount. We need six pixels.')
    },
    hints: [
      L3("Esingizdami? Birinchi son soyani o'ngga suradi, ikkinchisi esa pastga.", 'Вспомни: первое число — вправо, второе — вниз.', 'Remember: the first number is right, the second is down.'),
      L3("Demak, birinchi son olti piksel bo'lishi kerak.", 'Первое число должно быть шесть пикселей.', 'The first number should be six pixels.'),
      L3("Olti sonini yozing, yoniga px qo'shing-da, «Tekshirish»ni bosing.", 'Впиши число шесть, допиши px и нажми «Проверить».', 'Type the number six, add px and tap Check.')
    ],
    ok: L3("Barakalla! Endi soya o'ngga ham, pastga ham chiqib turibdi.", 'Молодец! Тень сдвинулась и вправо, и вниз.', 'Well done! The shadow moved both right and down.'),
    ask: L3("Soya o'ngga ham 6px siljisin", 'Сдвинь тень ещё и вправо на 6px', 'Move the shadow 6px to the right too')
  },
  s7: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Bu safar men kartochkaga soya berib qo'ydim, siz esa detektiv bo'lasiz. Soya qayerga tushganiga qarang-da, uni qaysi kod chizganini toping.",
      'Теперь проверь себя. Я покажу коробку с тенью, а ты выбери, какой код её нарисовал.',
      'Now check yourself. I’ll show a box with a shadow, and you pick which code drew it.'),
    ask: L3("Bu soyani qaysi kod beradi?", 'Какой код даёт эту тень?', 'Which code gives this shadow?'),
    hint1: L3("Soyaga bir qarang-chi: u qaysi tomonga surilgan, chetlari xirami yoki aniqmi?", 'Посмотри на тень: куда она сдвинута и размыта ли?', 'Look at the shadow: where did it move, and is it blurry?'),
    hint2: L3("Birinchi son soyani o'ngga, ikkinchisi pastga suradi, uchinchisi xiralashtiradi. Xiralik nol bo'lsa, soyaning chetlari aniq bo'ladi.", 'Первое число — вправо, второе — вниз, третье — размытие. При нулевом размытии тень резкая.', 'The first number is right, the second is down, the third is blur. With zero blur the shadow is sharp.'),
    rounds: [
      { want: 'box-shadow: 8px 8px 0px gray;', opts: ['box-shadow: 8px 8px 0px gray;', 'box-shadow: 0px 8px 0px gray;', 'box-shadow: 8px 0px 0px gray;'],
        why: L3("Soya o'ngga ham, pastga ham surilibdi, chetlari esa aniq. Buni sakkiz, sakkiz va nol qiladi.", 'Тень сдвинута и вправо, и вниз, резкая: восемь, восемь и ноль.', 'The shadow moved both right and down, sharp: eight, eight and zero.') },
      { want: 'box-shadow: 0px 10px 20px gray;', opts: ['box-shadow: 0px 10px 0px gray;', 'box-shadow: 10px 0px 20px gray;', 'box-shadow: 0px 10px 20px gray;'],
        why: L3("Soya faqat pastga tushibdi, o'zi ham xira. Bu nol, o'n va yigirma sonlarining ishi.", 'Тень только снизу и размытая: ноль, десять и двадцать.', 'The shadow is only below and blurry: zero, ten and twenty.') },
      { want: 'box-shadow: 0px 0px 16px orange;', opts: ['box-shadow: 0px 16px 0px orange;', 'box-shadow: 0px 0px 16px orange;', 'box-shadow: 16px 0px 0px orange;'],
        why: L3("Soya hech qayerga surilmagan, kartochka atrofida faqat xira nur turibdi. Bunday nurni nol, nol va o'n olti beradi.", 'Тень никуда не сдвинута, только размытое сияние вокруг: ноль, ноль и шестнадцать.', 'The shadow didn’t move anywhere, just a blurry glow around: zero, zero and sixteen.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("Uch marta soyaga qaradingiz, uch marta to'g'ri kodni topdingiz! Endi har qanday soyaning sonlarini taxmin qila olasiz.", 'Всё верно! Ты читаешь тени с одного взгляда.', 'All correct! You read shadows at a glance.')
  },
  s8: {
    eyebrow: L3("Bir tomondagi chiziq", 'Полоса с одной стороны', 'A stripe on one side'),
    help: [
      L3("Kartochkaning tomonlariga qarang: oldin chiziq faqat bitta tomonda paydo bo'ladi, keyin boshqa tomonlarda ham chiqadi.", 'Посмотри на стороны карточки: линия появляется только с одной стороны, потом и с других.', 'Look at the card’s sides: a line appears on just one side, then on others too.'),
      L3("Nega bunday? Oddiy border to'rttala tomonga birdan chiziq chizadi. Agar border so'zidan keyin tomon nomini qo'shsangiz, chiziq faqat o'sha tomonda chiqadi: border-left chapda, border-top tepada, border-right o'ngda, border-bottom esa pastda. Qiymati esa o'sha-o'sha: qalinlik, tur va rang.", 'border рисует линию со всех сторон, а border-left — только слева, border-top — сверху, border-right — справа, border-bottom — снизу. Значение то же: толщина, вид и цвет.', 'border draws a line on every side; border-left only on the left, border-top on top, border-right on the right, border-bottom at the bottom. The value is the same: thickness, style and color.'),
      L3("Daftardagi qizil hoshiya chizig'i esingizdami? U varaqning faqat bir chetida chiziladi, butun varaq atrofida emas. border-left ham xuddi shunday, chiziqni faqat chap tomonga chizadi.", 'В тетради линия полей есть только слева. border-left так же: линия с одной стороны.', 'In a notebook the margin line is only on the left. border-left is the same: a line on one side.')
    ],
    say: L3("Esingizdami, border chegarani to'rttala tomonga birdan chizardi. Faqat bitta tomonga-chi? Buning ham yo'li bor: border so'zidan keyin chiziqcha qo'yib, tomonning inglizcha nomini yozamiz. Masalan, o'ng tomon uchun border-right bo'ladi, chunki right «o'ng» degani. Qolgan tomonlarni hozir kartochkaning o'zida ko'ramiz.",
      'Рамку можно дать и только одной стороне. Для этого после слова border ставят чёрточку и имя стороны: top, то есть верх, right — право, bottom — низ, и left — лево.',
      'You can give a border to just one side. For that, after the word border you add a dash and the side name: top, right, bottom and left.'),
    sayLeft: L3("Birinchi bo'lib border-left yozdik. Qarang-chi, to'q sariq chiziq kartochkaning chap tomonida paydo bo'ldi, demak, left chap tomon ekan. Kartochkalarda bu juda mashhur bezak.", 'border-left: слева оранжевая полоса в шесть пикселей. На карточках это очень популярное украшение.', 'border-left: a six-pixel orange stripe on the left. It’s a very popular decoration on cards.'),
    sayBottom: L3("Keyin border-bottom qo'shdik. Bu safar chiziq qayerda chiqdi? Ana, pastda, binafsha rangda! Demak, bottom pastki tomonning nomi ekan.", 'border-bottom: теперь и снизу появилась фиолетовая полоса.', 'border-bottom: now there’s a purple stripe at the bottom too.'),
    sayTop: L3("Oxirida border-top yozdik, endi tepada yashil chiziqchalar turibdi. Sezgan bo'lsangiz kerak, top tepa tomonning nomi. Ko'rdingizmi, har bir tomonga o'z chizig'ini berish mumkin.", 'border-top: а сверху — зелёные чёрточки. У каждой стороны своя линия.', 'border-top: and green dashes on top. Each side has its own line.'),
    done: L3("Demak, oddiy border to'rttala tomonga chiziq chizadi, border-left esa faqat chap tomonga. Qiymati esa o'zgarmaydi: qalinlik, tur va rang.", 'Значит, border рисует линию со всех сторон, а border-left — только слева. Значение то же: толщина, вид и цвет.', 'So border draws a line on all sides, and border-left only on the left. The value is the same: thickness, type and color.'),
    askStart: L3("Qarang: top · right · bottom · left", 'Смотри: top · right · bottom · left', 'Watch: top · right · bottom · left'),
    askLeft: L3("Qarang: border-left", 'Смотри: border-left', 'Watch: border-left'),
    askBottom: L3("Qarang: border-bottom", 'Смотри: border-bottom', 'Watch: border-bottom'),
    askTop: L3("Qarang: border-top", 'Смотри: border-top', 'Watch: border-top'),
    askDone: L3("border-left — faqat chapda", 'border-left — только слева', 'border-left is only on the left')
  },
  s9: {
    eyebrow: L3("Chap tomon", 'Левая сторона', 'The left side'),
    say: L3("Bu safar qiymat tayyor turibdi: olti piksel, yaxlit, to'q sariq. Siz esa xususiyat nomini yozing, shunda chiziq faqat kartochkaning chap tomonida chiqadi.",
      'Теперь ты. Значение готово: шесть пикселей, сплошная, оранжевая. Впиши свойство, чтобы полоса была только слева.',
      'Your turn. The value is ready: six pixels, solid, orange. Type the property so the stripe is only on the left.'),
    msgs: {
      empty: L3("Maydon hali bo'sh. Bu yerga xususiyatning nomi kerak.", 'Впиши имя свойства.', 'Type the property name.'),
      all: L3("Oddiy border chiziqni to'rttala tomonga ham chizib qo'ydi-ku. Bizga esa faqat chap tomon kerak.", 'border рисует линию со всех сторон. А нужна только левая.', 'border draws a line on all sides. We only need the left one.'),
      right: L3("right o'ng tomon degani, shuning uchun chiziq o'ngda chiqdi. Bizga esa chap tomon kerak.", 'Это правая сторона. А нужна левая.', 'That’s the right side. We need the left one.'),
      side: L3("Chiziq boshqa tomonda chiqib qoldi. Bizga chap tomon kerak edi.", 'Это другая сторона. А нужна левая.', 'That’s a different side. We need the left one.'),
      bad: L3("Brauzer bu xususiyatni tanimadi. border so'zi, chiziqcha va tomonning nomi bir-biriga bo'sh joysiz ulanib yoziladi.", 'Браузер не узнал это свойство. border, чёрточка и имя стороны пишутся без пробелов.', 'The browser didn’t recognize that property. border, a dash and the side name are written with no spaces.')
    },
    hints: [
      L3("Xususiyat border so'zidan boshlanadi, undan keyin chiziqcha va tomonning nomi keladi.", 'Свойство начинается со слова border, потом чёрточка и сторона.', 'The property starts with the word border, then a dash and the side.'),
      L3("Chap tomon inglizchada left bo'ladi.", 'Левая сторона по-английски — left.', 'The left side is left.'),
      L3("border-left deb yozing-da, «Tekshirish»ni bosing.", 'Впиши border-left и нажми «Проверить».', 'Type border-left and tap Check.')
    ],
    ok: L3("Ajoyib! Chiziq endi faqat chap tomonda turibdi.", 'Отлично! Полоса только слева.', 'Great! The stripe is only on the left.'),
    ask: L3("Chiziq faqat chapda bo'lsin", 'Сделай полосу только слева', 'Put the stripe only on the left')
  },
  s10: {
    eyebrow: L3("Qaysi tomon?", 'Какая сторона?', 'Which side?'),
    say: L3("Endi kartochkalarni birma-bir ko'rsataman: har birida chiziq faqat bitta tomonda turadi. Chiziqqa qarab, uni qaysi xususiyat chizganini tanlang.",
      'Теперь проверь себя. Я покажу коробку с полосой, а ты выбери, какое свойство её нарисовало.',
      'Now check yourself. I’ll show a box with a stripe, and you pick which property drew it.'),
    ask: L3("Bu chiziqni qaysi xususiyat beradi?", 'Какое свойство даёт эту полосу?', 'Which property gives this stripe?'),
    hint1: L3("Chiziq qaysi tomonda turibdi-chi: tepadami, o'ngdami, pastdami yoki chapda?", 'На какой стороне полоса: сверху, справа, снизу или слева?', 'Which side is the stripe on: top, right, bottom or left?'),
    hint2: L3("Tomonlarning nomlari esingizdami? Tepa tomon inglizchada top deyiladi, o'ng tomon right, past tomon bottom, chap tomon esa left.", 'top — верх, right — право, bottom — низ, left — лево.', 'top, right, bottom, left.'),
    items: [
      { right: 'border-left', why: L3("Chiziq chap tomonda turibdi, uni border-left chizgan.", 'Полоса слева: border-left.', 'The stripe is on the left: border-left.') },
      { right: 'border-bottom', why: L3("Chiziq pastda turibdi, demak, bu border-bottom.", 'Полоса снизу: border-bottom.', 'The stripe is at the bottom: border-bottom.') },
      { right: 'border-top', why: L3("Chiziq tepada chiqibdi, bu border-top ishi.", 'Полоса сверху: border-top.', 'The stripe is on top: border-top.') },
      { right: 'border-right', why: L3("Chiziq o'ng tomonda, uni border-right chizadi.", 'Полоса справа: border-right.', 'The stripe is on the right: border-right.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("To'rttala tomonni ham adashtirmadingiz! Chiziq qayerda bo'lsa, uning nomini darrov ayta olasiz.", 'Всё верно! Ты не путаешь стороны.', 'All correct! You don’t mix up the sides.')
  },
  s11: {
    eyebrow: L3("Qachon buziladi", 'Когда ломается', 'When it breaks'),
    help: [
      L3("Har safar oldin kodga qarang: sonlar yonida nima turibdi, ular nima bilan ajratilgan? Keyin kartochkaga ko'z tashlang.", 'Каждый раз смотри на код: что стоит рядом с числами и чем они разделены? Потом смотри на карточку.', 'Each time, look at the code: what’s next to the numbers and what separates them? Then look at the card.'),
      L3("Sonlardan keyin px kelishi shart, bo'laklar esa vergul bilan emas, bo'sh joy bilan ajratiladi. Shunday bo'lmasa, brauzer qoidani tushunmaydi va o'tkazib yuboradi.", 'После чисел нужен px, а части разделяют не запятой, а пробелом. Иначе браузер выбросит правило.', 'Numbers need px, and the parts are separated by spaces, not commas. Otherwise the browser throws the rule away.'),
      L3("Telefon raqami o'rtasiga vergul qo'yib yuborsangiz, qo'ng'iroq o'tmaydi-ku. CSS kodi ham xuddi shunday injiq: ortiqcha vergul yoki unutilgan px bo'lsa, brauzer qoidani o'tkazib yuboradi.", "Если в номере телефона поставить лишнюю запятую, звонок не пройдёт. Так и в CSS: лишняя запятая или забытый px — и браузер выбросит правило.", "Put an extra comma in a phone number and the call won’t go through. Same in CSS: an extra comma or a forgotten px, and the browser throws the rule away.")
    ],
    say: L3("Kartochkalarni bezayotganimda men ham ikki marta qoqilganman. Qani, o'sha ikki holatni birga ko'ramiz. Hozircha hammasi joyida: burchaklar o'n olti piksel yumaloq.",
      'В украшениях карточек тоже бывают ошибки. Давай посмотрим на две. Сейчас углы скруглены на шестнадцать пикселей.',
      'Card decorations have mistakes too. Let’s look at two. Right now the corners are rounded by sixteen pixels.'),
    sayNoUnit: L3("Birinchi marta men o'n oltidan keyin px yozishni unutibman. Brauzer qoidani tushunmay, o'tkazib yubordi, burchaklar yana o'tkir bo'lib qoldi.", 'Первая: после шестнадцати нет px. Браузер выбросил правило, углы снова острые.', 'The first: there’s no px after sixteen. The browser threw the rule away, the corners are sharp again.'),
    sayComma: L3("Ikkinchi marta soya sonlarini vergul bilan ajratib yozibman. Qarang-chi, brauzer buni ham tushunmadi va soya umuman chiqmadi.", 'Вторая: числа тени записаны через запятую. Браузер это не понимает, тени нет.', 'The second: the shadow numbers are written with commas. The browser doesn’t understand that, there’s no shadow.'),
    sayFixed: L3("Endi vergullarni olib tashladik, sonlar faqat bo'sh joy bilan ajralib turibdi. Ana, soya shu zahoti paydo bo'ldi!", 'Уберём запятые: числа разделены пробелами, и тень сразу появилась.', 'Remove the commas: the numbers are separated by spaces, and the shadow appears right away.'),
    done: L3("Demak, sonlarning yonida px turadi, bo'laklarni esa vergulsiz, bo'sh joy bilan ajratib yozamiz.", 'Значит, у чисел есть px, а части пишутся без запятых, через пробел.', 'So numbers have px, and the parts are written without commas, with spaces.'),
    askStart: L3("Qarang: border-radius 16px", 'Смотри: border-radius 16px', 'Watch: border-radius 16px'),
    askNoUnit: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askComma: L3("Qarang: vergullar", 'Смотри: запятые', 'Watch: commas'),
    askFixed: L3("Qarang: vergulsiz", 'Смотри: без запятых', 'Watch: no commas'),
    askDone: L3("px bilan, vergulsiz", 'С px и без запятых', 'With px, without commas')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men kartochkaga soya yozgandim, lekin u chiqmayapti! Maydonda mening qiymatim turibdi. Nima buzilganini toping-da, tuzatib qo'ying, faqat sonlarga tegmang.",
      'Ой, я написал тень, но её нет! В поле — моё значение. Найди ошибку и исправь, а числа не меняй.',
      'Oops, I wrote a shadow, but it doesn’t show up! My value is in the field. Find the mistake and fix it, but don’t change the numbers.'),
    msgs: {
      empty: L3("Maydon bo'shab qoldi-ku. Qiymatni vergulsiz qayta yozing: nol, olti va o'n ikki piksel, keyin gray rang.", "Поле пустое. Впиши без запятых: 0px 6px 12px gray.", "The field is empty. Type it without commas: 0px 6px 12px gray."),
      comma: L3("Qiymatda hali ham vergul qolibdi. Hamma vergullarni olib tashlang.", 'В значении ещё есть запятая. Убери запятые.', 'There’s still a comma in the value. Remove the commas.'),
      bad: L3("Brauzer bu soyani tanimadi. Sonlar bilan rangni bo'sh joy bilan ajratib yozing.", 'Браузер не узнал тень. Числа и цвет пишутся через пробел.', 'The browser didn’t recognize the shadow. The numbers and the color are separated by spaces.'),
      other: L3("Soya chiqdi-yu, lekin men yozgandek emas. Sonlarga tegmang, faqat vergullarni olib tashlang.", 'Тень появилась, но другая. Не меняй числа, просто убери запятые.', 'There’s a shadow, but a different one. Don’t change the numbers, just remove the commas.')
    },
    hints: [
      L3("Sonlar o'rtasiga bir qarang-chi: u yerda nima turibdi?", 'Что стоит между числами?', 'What’s between the numbers?'),
      L3("Vergullar bu yerda ortiqcha, chunki box-shadow bo'laklarini faqat bo'sh joy ajratadi.", 'Запятые лишние: части разделяются только пробелами.', 'The commas are extra: the parts are separated only by spaces.'),
      L3("Kod ostiga qarang: u yerda to'g'ri yozuv chiqdi. Unda nol, olti va o'n ikki piksel, keyin gray rang turibdi, hammasi vergulsiz. Maydondagi vergullarni o'chiring-da, «Tekshirish»ni bosing.", "Должно получиться так: 0px 6px 12px gray. Образец под кодом: перепиши его и нажми «Проверить».", "It should look like this: 0px 6px 12px gray. The example is under the code: copy it and tap Check.")
    ],
    ok: L3("Ura, ishladi! Soya kartochka ostiga qaytib keldi.", 'Ура, заработало! Тень на месте.', 'Hooray, it works! The shadow is there.'),
    ask: L3("Soyani tuzating", 'Исправь тень', 'Fix the shadow')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi kodda uchta qoida bor, lekin kartochkalarda faqat ikkitasining izi ko'rinyapti. Qaysi biri ishlamayapti ekan? Kartochkalarga qarang-da, o'sha qoidani topib bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми сломанное правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Bittasi tuzaldi! Lekin qarang-chi, kartochkalarda yana bir bezak ko'rinmayapti. Bu safar qaysi qatorda muammo bor?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoidaning ishi kartochkada ko'rinib turibdi, demak, u joyida. Kodda yozilgan qaysi bezak kartochkada yo'q ekan?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      unit: L3("Ha, aynan shu! Yigirmadan keyin px yo'q edi, shuning uchun burchaklar yumaloqlanmagan.", 'Есть! После двадцати не было px.', 'Found it! There was no px after twenty.'),
      comma: L3("Topdingiz! Soya sonlari vergul bilan yozilgan ekan, brauzer bunday soyani chizmaydi.", 'Есть! Числа тени были записаны через запятую.', 'Found it! The shadow numbers were written with commas.')
    },
    hint1: L3("Kartochkalarga qarang-chi: kodda yozilgan qaysi bezak ularda ko'rinmayapti?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      unit: L3("Kartochkalarning burchaklari yumaloqmi o'zi? border-radius qiymatini bir tekshirib ko'ring.", 'Углы карточек круглые? Проверь значение border-radius.', 'Are the card corners round? Check the border-radius value.'),
      comma: L3("Kartochkalar ostida soya bormi? box-shadow qiymatiga yaxshilab qarang.", 'Есть ли у карточек тень? Проверь значение box-shadow.', 'Do the cards have a shadow? Check the box-shadow value.')
    },
    hint3: {
      unit: L3("Muammo birinchi qoidada: unda px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      comma: L3("Bu safar ikkinchi qoidada vergullar turibdi. O'sha qatorni bosing.", 'Ошибка во втором правиле: запятые. Нажми эту строку.', 'The bug is in the second rule: commas. Tap that line.')
    },
    ok: L3("Endi kartochkalarimning burchaklari ham yumaloq, soyasi ham joyida. Bitta yo'qolgan px bilan ortiqcha vergulni ham ilg'ab oldingiz, juda diqqatli ekansiz!", 'Супер! Обе найдены. Ты проверяешь карточки как настоящий дизайнер.', 'Super! Both found. You check cards like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi butun qoidani o'zingiz yozib ko'ring. Sarlavham ostida chiziq bo'lsin: faqat pastda, qalinligi uch piksel, yaxlit va to'q sariq. Selektor esa h1 bo'ladi.",
      'Теперь напиши правило целиком. Пусть под заголовком будет линия: только снизу, три пикселя, сплошная, оранжевая. Селектор — h1.',
      'Now write the whole rule yourself. Put a line under the heading: only at the bottom, three pixels, solid, orange. The selector is h1.'),
    msgs: {
      empty: L3("Hali hech narsa yozilmagan. Qoida selektordan boshlanadi, keyin jingalak qavslar ichida xususiyat bilan qiymat keladi.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidada jingalak qavslar ko'rinmayapti. Selektordan keyin ochuvchi qavs, oxirida esa yopuvchi qavs turishi kerak.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymatning o'rtasiga ikki nuqta qo'yishni unutibsiz.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Bu selektor sarlavhani tanlamaydi. Sarlavhaga h1 selektori kerak.", 'Для заголовка нужен селектор h1.', 'The heading needs the h1 selector.'),
      all: L3("Oddiy border sarlavhani to'rttala tomondan o'rab oldi-ku. Bizga faqat pastki chiziq kerak.", 'border рисует линию со всех сторон. Нужна только нижняя.', 'border draws a line on all sides. We only need the bottom one.'),
      prop: L3("Bu xususiyat pastki chiziq chizmaydi. Pastki chiziqni border-bottom chizadi.", 'Нижнюю линию задаёт свойство border-bottom.', 'The border-bottom property sets the bottom line.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Chiziq uchun uchta bo'lak kerak: qalinlik, tur va rang, ularning o'rtasiga bo'sh joy qo'yiladi.", 'Браузер не узнал это значение. Напиши три части через пробел: толщина, вид и цвет.', 'The browser didn’t recognize that value. Write three parts with spaces: thickness, type and color.'),
      noStyle: L3("Chiziq turi yozilmagani uchun brauzer chiziqni chizmayapti. Qiymatga solid so'zini qo'shing.", 'Нет вида линии, поэтому её не видно. Добавь слово solid.', 'There’s no line type, so the line isn’t visible. Add the word solid.'),
      other: L3("Chiziq chiqdi, lekin boshqacharoq. Bizga uch piksel, solid va orange kerak.", 'Линия есть, но другая. Нужно: три пикселя, solid и orange.', 'There’s a line, but a different one. We need three pixels, solid and orange.')
    },
    hints: [
      L3("Oldin o'ylab oling: sarlavhani qaysi selektor tanlaydi? Pastki chiziqni-chi, qaysi xususiyat chizadi?", 'Какой селектор выбирает заголовок? Какое свойство даёт линию только снизу?', 'Which selector picks the heading? Which property gives a line only at the bottom?'),
      L3("Selektor h1, xususiyat border-bottom bo'ladi, qiymati esa uch piksel, solid va orange.", 'Селектор h1, свойство border-bottom, значение: три пикселя, solid, orange.', 'Selector h1, property border-bottom, value: three pixels, solid, orange.'),
      L3("Endi kod ostida butun qoida ko'rinib turibdi. O'shani maydonga yozib chiqing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Sarlavha ostida chiroyli to'q sariq chiziq paydo bo'ldi. Butun qoidani o'zingiz yozdingiz-a!", 'Отлично! Под заголовком красивая линия. Правило написано тобой целиком.', 'Great! A neat line under the heading. You wrote the whole rule yourself.'),
    ask: L3("Sarlavha ostiga 3px solid orange chiziq bering", 'Дай заголовку линию снизу 3px solid orange', 'Give the heading a 3px solid orange bottom line')
  },
  s14: {
    eyebrow: L3("O'z kartochkangiz", 'Своя карточка', 'Your own card'),
    say: L3("Mana, sizning kartochkangiz, hozircha bezaksiz. Burchaklariga, soyasiga va chap chizig'iga o'zingiz qiymat tanlang. Hammasi yoqqanida «Tayyor»ni bosing.",
      'Теперь укрась свою карточку. Впиши любые значения для углов, тени и полосы слева. Потом нажми «Готово».',
      'Now decorate your own card. Type any values for the corners, the shadow and the left stripe. Then tap “Done”.'),
    msgs: {
      rad: L3("Brauzer burchak uchun yozilgan qiymatni tanimadi: \u2063{w}\u2064. Son yozing-da, unga bo'sh joysiz px ulang.", 'Браузер не узнал такое значение: \u2063{w}\u2064. Напиши число и px без пробела.', 'The browser didn’t recognize this value: \u2063{w}\u2064. Write a number and px with no space.'),
      shd: L3("Brauzer bu soyani tanimadi. Uchta son bilan rangni bo'sh joy bilan ajratib yozing.", 'Браузер не узнал тень. Напиши три числа и цвет через пробел.', 'The browser didn’t recognize the shadow. Write three numbers and a color with spaces.'),
      comma: L3("Soyangizda vergul qolib ketibdi. Bo'laklarni faqat bo'sh joy bilan ajrating.", 'В тени есть запятая. Разделяй части только пробелами.', 'There’s a comma in the shadow. Separate the parts with spaces only.'),
      left: L3("Brauzer chap chiziqni tushunmadi. Unga uchta bo'lak kerak: qalinlik, tur va rang.", 'Браузер не узнал левую полосу. Напиши три части: толщина, вид и цвет.', 'The browser didn’t recognize the left stripe. Write three parts: thickness, type and color.'),
      noStyle: L3("Chap chiziqqa chiziq turi yetishmayapti: solid, dashed yoki dotted so'zidan birini qo'shing.", 'У левой полосы нет вида линии: добавь solid, dashed или dotted.', 'The left stripe has no line type: add solid, dashed or dotted.')
    },
    hints: [
      L3("Har bir maydon o'z qiymatini kutyapti: burchak, soya va chiziq.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Burchakka son va px yetadi. Soyaga to'rt narsa kerak: o'ngga qancha, pastga qancha, xiraligi va rangi. Chiziqqa esa qalinlik, tur va rang kerak bo'ladi.", 'Для углов — число и px; для тени — вправо, вниз, размытие и цвет; для полосы — толщина, вид и цвет.', 'For the corners, a number and px; for the shadow, right, down, blur and color; for the stripe, thickness, type and color.'),
      L3("Masalan, burchak o'n olti piksel, soya nol, olti, o'n olti piksel va silver, chiziq esa olti piksel solid purple bo'lsin. Keyin «Tayyor»ni bosing.", 'Например: углы шестнадцать пикселей, тень ноль, шесть, шестнадцать пикселей и silver, полоса шесть пикселей solid purple. Потом нажми «Готово».', 'For example: corners sixteen pixels, a shadow of zero, six, sixteen pixels and silver, a stripe of six pixels solid purple. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Sizning kartochkangiz xuddi haqiqiy ilovadagidek chiqdi.", 'Ого, как красиво! Это твоя карточка.', 'Wow, how pretty! This is your card.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Kartochkalar haqida men to'rtta gap tayyorladim, lekin ular orasida tuzoqlar ham bor. Har birini eshiting-da, to'g'ri yoki noto'g'ri ekanini tanlang. Mana, birinchisi.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Bu gap qaysi xususiyat haqida ekan: border-radius, box-shadow yoki bir tomondagi chiziq?", 'О каком свойстве фраза: border-radius, box-shadow или рамка одной стороны?', 'Which property is the sentence about: border-radius, box-shadow or a one-side border?'),
    hint2: L3("Esingizdami? border-radius burchaklarni yumaloqlaydi. box-shadow qiymatida oldin o'ngga, keyin pastga surish keladi, bo'laklar vergulsiz yoziladi. border-left esa chiziqni faqat chapga chizadi.", 'Вспомни: border-radius скругляет углы, в box-shadow сначала вправо, потом вниз, части без запятых, а border-left — только слева.', 'Remember: border-radius rounds corners, in box-shadow first comes right, then down, parts go without commas, and border-left is only on the left.'),
    items: [
      { t: L3("border-radius kartochka burchaklarini yumaloqlaydi.", 'border-radius скругляет углы карточки.', 'border-radius rounds the card’s corners.'), right: true,
        why: L3("Haqiqatan ham, burchaklarni aynan border-radius yumaloqlaydi: son qancha katta bo'lsa, burchak shuncha yumaloq bo'ladi.", 'Верно: border-radius скругляет углы.', 'Right: border-radius rounds the corners.') },
      { t: L3("Bu qoidada soya pastga tushadi.", 'В этом правиле тень уходит вниз.', 'In this rule the shadow goes down.'), right: false, code: 'shd',
        why: L3("Aslida birinchi son soyani o'ngga suradi, ikkinchisi esa nol. Shuning uchun soya faqat o'ng tomonda chiqadi.", 'На самом деле первое число сдвигает вправо, а второе — ноль: тень только справа.', 'Actually the first number moves it right, and the second is zero: the shadow is only on the right.') },
      { t: L3("border-left chiziqni faqat chap tomonga chizadi.", 'border-left рисует линию только слева.', 'border-left draws a line only on the left.'), right: true,
        why: L3("Ha, left inglizchada «chap» degani, chiziq faqat o'sha tomonda bo'ladi.", 'Верно: left — это лево.', 'Right: left means the left side.') },
      { t: L3("Bu qoida kartochkaga soya beradi.", 'Это правило даёт карточке тень.', 'This rule gives the card a shadow.'), right: false, code: 'comma',
        why: L3("Bu qoidada vergullar bor-ku, shuning uchun brauzer uni o'tkazib yuboradi va soya chiqmaydi.", 'На самом деле там запятые, браузер выбрасывает правило, тени нет.', 'Actually there are commas, the browser throws the rule away, there’s no shadow.') }
    ],
    ok: L3("Birorta tuzoqqa ham ilinmadingiz! Kartochka bezaklarini endi har qanday ilovada ko'rib taniysiz.", 'Всё верно! Ты отлично разбираешься в карточках.', 'All correct! You know cards really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Qani, rejamni sinab ko'ramiz: border-radius yuz piksel. Kim o'ylabdi deysiz, kartochka doira emas, tabletka bo'lib chiqdi! Esingizdami, ellik pikselda ham u tabletkaga o'xshab qolgandi. Kartochka keng, shuning uchun son qancha katta bo'lmasin, faqat chetlari yumaloqlanadi.",
        'Вернёмся к загадке. Помнишь, я сделал border-radius сто пикселей и ждал круг? Смотри: карточка не круг, а таблетка! Я ошибся. Карточка широкая, поэтому скруглились только края.',
        'Back to our riddle. Remember, I made border-radius a hundred pixels and expected a circle? Look: the card isn’t a circle, it’s a pill! I was wrong. The card is wide, so only the ends got round.'), k: 'riddle' },
      { text: L3("Doira chiqishi uchun esa quti kvadrat bo'lishi kerak ekan: eni bilan bo'yi bir xil bo'ladi. Keyin border-radius qiymatini ellik foiz qilamiz. Mana, endi haqiqiy doira chiqdi!",
        'Для круга коробка должна быть квадратной: ширина и высота одинаковые. А border-radius — пятьдесят процентов. Вот, теперь настоящий круг!',
        'For a circle the box has to be square: the same width and height. And border-radius is fifty percent. There, now it’s a real circle!'), k: 'riddle2' },
      { text: L3("Endi o'zingizning kartochkangizga qarang, har bir bezagini o'zingiz tanlagansiz!", 'Смотри, это твоя карточка с твоими собственными украшениями!', 'Look, this is your card with the decorations you picked yourself!'), k: 'own' },
      { text: L3("border-radius burchaklarni yumaloqlaydi.", 'border-radius скругляет углы.', 'border-radius rounds the corners.'), k: 'rad' },
      { text: L3("box-shadow uchun to'rt narsa kerak: o'ngga qancha, pastga qancha, xiraligi va rangi, hammasi vergulsiz.", 'box-shadow: вправо, вниз, размытие и цвет, без запятых.', 'box-shadow: right, down, blur and color, without commas.'), k: 'shd' },
      { text: L3("border-left, border-top va ularning sheriklari chiziqni faqat bitta tomonga chizadi.", 'border-left, border-top и другие дают линию одной стороне.', 'border-left, border-top and the others give a line to one side.'), k: 'side' },
      { text: L3("Doira olish uchun esa kvadrat quti bilan ellik foizli border-radius kerak bo'ladi.", 'А круг — это квадратная коробка и border-radius пятьдесят процентов.', 'And a circle is a square box with border-radius fifty percent.'), k: 'circ' },
      { text: L3("Qoyil! Endi sizning kartochkalaringiz ham ilovalardagidek chiroyli. Keyingi darsda elementlar sahifada o'zini qanday tutishini bilib olamiz: ba'zilari butun qatorga cho'zilib oladi, ba'zilari esa yonma-yon turadi. Ko'rishguncha!",
        'Ура! Теперь твои карточки красивые, как в приложениях. На следующем уроке узнаем, как элементы ведут себя на странице: одни занимают всю строку, а другие стоят рядом. До встречи!',
        'Hooray! Now your cards are as pretty as in apps. Next lesson we’ll learn how elements behave on a page: some take the whole line, others sit side by side. See you!') }
    ],
    roles: {
      rad: L3("border-radius — burchaklar", 'border-radius — углы', 'border-radius — corners'),
      shd: L3("box-shadow — soya", 'box-shadow — тень', 'box-shadow — shadow'),
      side: L3("border-left — bitta tomon", 'border-left — одна сторона', 'border-left — one side'),
      circ: L3("doira — kvadrat quti", 'круг — квадратная коробка', 'circle — a square box')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayS: 1, sayM: 1, sayL: 1, sayRD: 1, sayD: 1,
  sayBlur: 1, sayColor: 1, sayLeft: 1, sayBottom: 1, sayTop: 1, sayNoUnit: 1, sayComma: 1, sayFixed: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1,
  right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c8-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c8.css@*/
`;
