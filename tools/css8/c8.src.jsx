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
    say: L3("Salom! Men to'garaklarim uchun kartochkalar yasadim. Lekin qarang: ular shunchaki oddiy to'rtburchaklar. Ilovalardagi kartochkalar esa chiroyliroq-ku! «Aylantirish» tugmasini bosing.",
      'Привет! Я сделал карточки для своих кружков. Но смотри: это просто прямоугольники. А в приложениях карточки куда красивее! Нажми «Превратить».',
      'Hi! I made cards for my clubs. But look: they’re just plain rectangles. Cards in apps look much nicer! Tap “Transform”.'),
    magic: L3("Mana! Burchaklar yumaloq bo'ldi, ostida yumshoq soya paydo bo'ldi, chap tomonda esa rangli chiziq. Endi bu haqiqiy kartochka!",
      'Вот! Углы стали круглыми, снизу появилась мягкая тень, а слева — цветная полоса. Теперь это настоящая карточка!',
      'There! The corners got round, a soft shadow appeared underneath, and a colored stripe on the left. Now it’s a real card!'),
    magicP: L3("Buni uchta xususiyat qildi: border-radius, ya'ni burchaklarni yumaloqlash degani, box-shadow, ya'ni soya, va border-left, ya'ni faqat chap tomondagi chegara.",
      'Это сделали три свойства: border-radius, то есть скругление углов, box-shadow, то есть тень, и border-left, то есть рамка только слева.',
      'Three properties did it: border-radius, meaning rounded corners, box-shadow, meaning a shadow, and border-left, meaning a border on the left side only.'),
    done: L3("Bugun kartochkalarni chiroyli qilishni o'rganasiz. Lekin oldin topishmoq. Men dumaloq kartochka qilmoqchiman va border-radius ni juda katta qilaman: yuz piksel. Menimcha, kartochka doira bo'ladi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делать красивые карточки. Но сначала загадка. Я хочу круглую карточку и делаю border-radius очень большим: сто пикселей. По-моему, карточка станет кругом. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make beautiful cards. But first, a riddle. I want a round card, so I make border-radius really big: a hundred pixels. I think the card will become a circle. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("border-radius · box-shadow · border-left", 'border-radius · box-shadow · border-left', 'border-radius · box-shadow · border-left')
  },
  s2: {
    eyebrow: L3("Yumaloq burchaklar", 'Круглые углы', 'Round corners'),
    help: [
      L3("Kartochka burchaklariga qarang: son kattalashgani sari ular yumaloqroq bo'ladi.", 'Посмотри на углы карточки: чем больше число, тем они круглее.', 'Look at the card’s corners: the bigger the number, the rounder they get.'),
      L3("border-radius burchaklarni yumaloq qiladi. Son qancha katta bo'lsa, burchak shuncha yumaloq.", 'border-radius скругляет углы. Чем больше число, тем круглее угол.', 'border-radius rounds the corners. The bigger the number, the rounder the corner.'),
      L3("Telefoningiz burchaklariga qarang: ular o'tkir emas, yumaloq. Ilovalardagi tugma va kartochkalar ham shunday qilingan.", 'Посмотри на углы своего телефона: они не острые, а круглые. Кнопки и карточки в приложениях сделаны так же.', 'Look at your phone’s corners: they’re round, not sharp. Buttons and cards in apps are made the same way.')
    ],
    say: L3("Birinchisi border-radius. U burchaklarni yumaloqlaydi. Son qancha katta bo'lsa, burchak shuncha yumaloq bo'ladi. Hozir burchaklar o'tkir.",
      'Первое — border-radius. Он скругляет углы. Чем больше число, тем круглее угол. Сейчас углы острые.',
      'The first is border-radius. It rounds the corners. The bigger the number, the rounder the corner. Right now the corners are sharp.'),
    sayS: L3("Sakkiz piksel: burchaklar biroz yumshadi, kartochka yoqimliroq ko'rinadi.", 'Восемь пикселей: углы чуть смягчились, карточка выглядит приятнее.', 'Eight pixels: the corners softened a little, the card looks nicer.'),
    sayM: L3("Yigirma to'rt piksel: burchaklar ancha yumaloq.", 'Двадцать четыре пикселя: углы заметно круглые.', 'Twenty-four pixels: the corners are clearly round.'),
    sayL: L3("Ellik piksel: chetlari butunlay yumaloq, kartochka tabletkaga o'xshab qoldi.", 'Пятьдесят пикселей: края совсем круглые, карточка похожа на таблетку.', 'Fifty pixels: the ends are fully round, the card looks like a pill.'),
    done: L3("Demak, border-radius burchaklarni yumaloqlaydi, son esa qanchalik yumaloq ekanini aytadi.", 'Значит, border-radius скругляет углы, а число говорит, насколько сильно.', 'So border-radius rounds the corners, and the number says how much.'),
    askStart: L3("Qarang: burchaklar o'tkir", 'Смотри: углы острые', 'Watch: sharp corners'),
    askS: L3("Qarang: 8px", 'Смотри: 8px', 'Watch: 8px'),
    askM: L3("Qarang: 24px", 'Смотри: 24px', 'Watch: 24px'),
    askL: L3("Qarang: 50px", 'Смотри: 50px', 'Watch: 50px'),
    askDone: L3("border-radius — yumaloq burchaklar", 'border-radius — круглые углы', 'border-radius means round corners')
  },
  s3: {
    eyebrow: L3("Burchaklar", 'Углы', 'Corners'),
    say: L3("Endi navbat sizga. Kartochka burchaklari o'n olti piksel yumaloq bo'lsin: border-radius uchun qiymatni yozing.",
      'Теперь твоя очередь. Пусть углы карточки скруглятся на шестнадцать пикселей: впиши значение для border-radius.',
      'Now it’s your turn. Round the card’s corners by sixteen pixels: type the value for border-radius.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Brauzer uni tashlab yuboradi: son yoniga px qo'shing.", 'Написано только число. Браузер его выбрасывает: добавь к числу px.', 'Only a number. The browser throws it away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Burchaklar yumaloq, lekin boshqacha. O'n olti piksel kerak.", 'Углы круглые, но не так. Нужно шестнадцать пикселей.', 'The corners are round, but not like that. We need sixteen pixels.')
    },
    hints: [
      L3("Qiymat son va o'lcham birligidan iborat.", 'Значение — число и единица.', 'The value is a number and a unit.'),
      L3("Son o'n olti, birlik px.", 'Число шестнадцать, единица px.', 'The number is sixteen, the unit is px.'),
      L3("O'n olti sonini yozing, yoniga px qo'ying va Tekshirishni bosing.", 'Впиши число шестнадцать, допиши px и нажми «Проверить».', 'Type the number sixteen, add px and tap Check.')
    ],
    ok: L3("Zo'r! Burchaklar yumshoq, kartochka chiroyli.", 'Огонь! Углы мягкие, карточка красивая.', 'Awesome! Soft corners, a pretty card.'),
    ask: L3("Burchaklarni 16px yumaloqlang", 'Скругли углы на 16px', 'Round the corners by 16px')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi qiymatlarni shakllar bilan juftlang. Chapdan qiymatni, o'ngdan esa shunday burchakli shaklni bosing.",
      'Теперь соедини значения с фигурами. Нажми значение слева, а потом фигуру с такими углами справа.',
      'Now match the values with the shapes. Tap a value on the left, then the shape with those corners on the right.'),
    why: {
      r4: L3("To'rt piksel juda kichik: burchaklar deyarli o'tkir.", 'Четыре пикселя — совсем мало: углы почти острые.', 'Four pixels is tiny: the corners are almost sharp.'),
      r16: L3("O'n olti piksel o'rtacha: burchaklar sezilarli yumaloq.", 'Шестнадцать пикселей — средне: углы заметно круглые.', 'Sixteen pixels is medium: the corners are noticeably round.'),
      r40: L3("Qirq piksel eng katta: shakl deyarli tabletka.", 'Сорок пикселей — больше всех: фигура почти таблетка.', 'Forty pixels is the biggest: the shape is almost a pill.')
    },
    pairOk: {
      r4: L3("To'g'ri, bu eng o'tkirrog'i.", 'Верно, это самая острая.', 'Right, that’s the sharpest.'),
      r16: L3("To'g'ri, bu o'rtachasi.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      r40: L3("To'g'ri, bu eng yumalog'i.", 'Верно, это самая круглая.', 'Right, that’s the roundest.')
    },
    pickFirst: L3("Oldin chapdan qiymatni tanlang.", 'Сначала выбери значение слева.', 'First pick a value on the left.'),
    hints: [
      L3("Son qancha katta bo'lsa, burchak shuncha yumaloq.", 'Чем больше число, тем круглее угол.', 'The bigger the number, the rounder the corner.'),
      L3("To'rt piksel deyarli o'tkir, qirq eng yumaloq, o'n olti o'rtada.", 'Четыре пикселя — почти острые, сорок — самые круглые, шестнадцать — посередине.', 'Four pixels is almost sharp, forty is the roundest, sixteen is in between.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Yumaloqlikni ko'z bilan chamalaysiz.", 'Отлично! Ты прикидываешь скругление на глаз.', 'Great! You can estimate the rounding by eye.'),
    ask: L3("Qiymatni, keyin shaklni bosing", 'Нажми значение, потом фигуру', 'Tap a value, then a shape'),
    askPlace: L3("Endi shunday shaklni bosing", 'Теперь нажми такую фигуру', 'Now tap that shape')
  },
  s5: {
    eyebrow: L3("Soya", 'Тень', 'Shadow'),
    help: [
      L3("Kodda box-shadow ning to'rtta qismiga qarang va qaysi biri o'zgarganda soya qanday o'zgarishini kuzating.", 'Посмотри на четыре части box-shadow в коде и следи, как меняется тень, когда меняется каждая.', 'Look at the four parts of box-shadow in the code and watch how the shadow changes when each part changes.'),
      L3("box-shadow to'rt qismdan iborat: o'ngga siljishi, pastga siljishi, xiralik va rang. Xiralik katta bo'lsa, soya yumshoq bo'ladi.", 'box-shadow состоит из четырёх частей: сдвиг вправо, сдвиг вниз, размытие и цвет. Чем больше размытие, тем мягче тень.', 'box-shadow has four parts: shift right, shift down, blur and color. The more blur, the softer the shadow.'),
      L3("Quyoshli kunda qo'lingizning soyasiga qarang: chiroq qayerda bo'lsa, soya o'sha tomonga tushadi. CSS soyasini ham siz qayerga tushishini aytasiz.", 'Посмотри на тень от руки в солнечный день: она падает в сторону от света. Тени в CSS ты сам говоришь, куда падать.', 'Look at your hand’s shadow on a sunny day: it falls away from the light. In CSS, you tell the shadow where to fall.')
    ],
    say: L3("Endi soya, ya'ni box-shadow. Uning qiymatida to'rtta qism bor: birinchi son, soya o'ngga qancha siljiydi; ikkinchisi, pastga qancha; uchinchisi, qanchalik xira; oxirida rang.",
      'Теперь тень, то есть box-shadow. В её значении четыре части: первое число — насколько тень сдвинута вправо; второе — насколько вниз; третье — насколько она размыта; в конце — цвет.',
      'Now the shadow, that is box-shadow. Its value has four parts: the first number is how far the shadow moves right; the second, how far down; the third, how blurry it is; and the color at the end.'),
    sayRD: L3("Olti piksel o'ngga, olti piksel pastga, xiralik nol, rangi kulrang. Qarang: kartochka ortida qattiq kulrang soya.", 'Шесть пикселей вправо, шесть вниз, размытие ноль, цвет серый. Смотри: за карточкой резкая серая тень.', 'Six pixels right, six down, zero blur, color gray. Look: a sharp gray shadow behind the card.'),
    sayD: L3("Endi birinchi son nol: soya o'ngga siljimadi, faqat pastda qoldi.", 'Теперь первое число ноль: тень не сдвинулась вправо, осталась только снизу.', 'Now the first number is zero: the shadow didn’t move right, it’s only below.'),
    sayBlur: L3("Uchinchi son o'n olti: soya xiralashdi va yumshoq bo'ldi. Ilovalardagi kartochkalar xuddi shunday.", 'Третье число шестнадцать: тень размылась и стала мягкой. Так выглядят карточки в приложениях.', 'The third number is sixteen: the shadow blurred and became soft. That’s how cards in apps look.'),
    sayColor: L3("Oxirgi qism rang: endi soya to'q sariq, kartochka go'yo nur sochyapti.", 'Последняя часть — цвет: теперь тень оранжевая, карточка будто светится.', 'The last part is the color: now the shadow is orange, the card seems to glow.'),
    done: L3("Demak, box-shadow: o'ngga, pastga, xiralik va rang. Sonlar bo'sh joy bilan yoziladi.", 'Значит, box-shadow: вправо, вниз, размытие и цвет. Числа пишутся через пробел.', 'So box-shadow is: right, down, blur and color. The numbers are separated by spaces.'),
    askStart: L3("Qarang: o'ngga · pastga · xiralik · rang", 'Смотри: вправо · вниз · размытие · цвет', 'Watch: right · down · blur · color'),
    askRD: L3("Qarang: o'ngga va pastga", 'Смотри: вправо и вниз', 'Watch: right and down'),
    askD: L3("Qarang: faqat pastga", 'Смотри: только вниз', 'Watch: only down'),
    askBlur: L3("Qarang: xira soya", 'Смотри: размытая тень', 'Watch: a blurry shadow'),
    askColor: L3("Qarang: rangli soya", 'Смотри: цветная тень', 'Watch: a colored shadow'),
    askDone: L3("box-shadow: o'ngga pastga xiralik rang", 'box-shadow: вправо вниз размытие цвет', 'box-shadow: right down blur color')
  },
  s6: {
    eyebrow: L3("Soya o'ngga", 'Тень вправо', 'Shadow to the right'),
    say: L3("Endi siz. Soya pastga olti piksel tushgan, endi u o'ngga ham olti piksel siljisin. Qaysi son o'ngga siljitadi? Uni yozing.",
      'Теперь ты. Тень уже сдвинута вниз на шесть пикселей, пусть она сдвинется и вправо на шесть. Какое число сдвигает вправо? Впиши его.',
      'Your turn. The shadow already moves six pixels down; now let it move six pixels right too. Which number moves it right? Type it.'),
    msgs: {
      empty: L3("Birinchi sonni yozing: son va px.", 'Впиши первое число: число и px.', 'Type the first number: a number and px.'),
      noUnit: L3("Faqat son yozildi. Son yoniga px qo'shing.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Brauzer soyani tanimadi va uni chizmadi. Bitta son va px yozing.", 'Браузер не узнал тень и не нарисовал её. Напиши одно число и px.', 'The browser didn’t recognize the shadow and didn’t draw it. Type one number and px.'),
      zero: L3("Nol bo'lsa, soya o'ngga siljimaydi. Olti piksel kerak.", 'При нуле тень не сдвигается вправо. Нужно шесть пикселей.', 'With zero the shadow doesn’t move right. We need six pixels.'),
      other: L3("Soya o'ngga siljidi, lekin boshqa masofaga. Olti piksel kerak.", 'Тень сдвинулась вправо, но на другое расстояние. Нужно шесть пикселей.', 'The shadow moved right, but by a different amount. We need six pixels.')
    },
    hints: [
      L3("Esingizdami: birinchi son o'ngga, ikkinchisi pastga.", 'Вспомни: первое число — вправо, второе — вниз.', 'Remember: the first number is right, the second is down.'),
      L3("Birinchi son olti piksel bo'lishi kerak.", 'Первое число должно быть шесть пикселей.', 'The first number should be six pixels.'),
      L3("Olti sonini yozing, yoniga px qo'ying va Tekshirishni bosing.", 'Впиши число шесть, допиши px и нажми «Проверить».', 'Type the number six, add px and tap Check.')
    ],
    ok: L3("Barakalla! Soya o'ngga ham, pastga ham siljidi.", 'Молодец! Тень сдвинулась и вправо, и вниз.', 'Well done! The shadow moved both right and down.'),
    ask: L3("Soya o'ngga ham 6px siljisin", 'Сдвинь тень ещё и вправо на 6px', 'Move the shadow 6px to the right too')
  },
  s7: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men soyali qutini ko'rsataman, siz esa uni qaysi kod chizganini tanlang.",
      'Теперь проверь себя. Я покажу коробку с тенью, а ты выбери, какой код её нарисовал.',
      'Now check yourself. I’ll show a box with a shadow, and you pick which code drew it.'),
    ask: L3("Bu soyani qaysi kod beradi?", 'Какой код даёт эту тень?', 'Which code gives this shadow?'),
    hint1: L3("Soyaga qarang: u qayerga siljigan va xirami?", 'Посмотри на тень: куда она сдвинута и размыта ли?', 'Look at the shadow: where did it move, and is it blurry?'),
    hint2: L3("Birinchi son o'ngga, ikkinchisi pastga, uchinchisi xiralik. Xiralik nol bo'lsa, soya qattiq.", 'Первое число — вправо, второе — вниз, третье — размытие. При нулевом размытии тень резкая.', 'The first number is right, the second is down, the third is blur. With zero blur the shadow is sharp.'),
    rounds: [
      { want: 'box-shadow: 8px 8px 0px gray;', opts: ['box-shadow: 8px 8px 0px gray;', 'box-shadow: 0px 8px 0px gray;', 'box-shadow: 8px 0px 0px gray;'],
        why: L3("Soya o'ngga ham, pastga ham siljigan, qattiq: sakkiz, sakkiz va nol.", 'Тень сдвинута и вправо, и вниз, резкая: восемь, восемь и ноль.', 'The shadow moved both right and down, sharp: eight, eight and zero.') },
      { want: 'box-shadow: 0px 10px 20px gray;', opts: ['box-shadow: 0px 10px 0px gray;', 'box-shadow: 10px 0px 20px gray;', 'box-shadow: 0px 10px 20px gray;'],
        why: L3("Soya faqat pastda va xira: nol, o'n va yigirma.", 'Тень только снизу и размытая: ноль, десять и двадцать.', 'The shadow is only below and blurry: zero, ten and twenty.') },
      { want: 'box-shadow: 0px 0px 16px orange;', opts: ['box-shadow: 0px 16px 0px orange;', 'box-shadow: 0px 0px 16px orange;', 'box-shadow: 16px 0px 0px orange;'],
        why: L3("Soya hech qayerga siljimagan, faqat atrofida xira nur: nol, nol va o'n olti.", 'Тень никуда не сдвинута, только размытое сияние вокруг: ноль, ноль и шестнадцать.', 'The shadow didn’t move anywhere, just a blurry glow around: zero, zero and sixteen.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Soyalarni bir qarashda o'qiysiz.", 'Всё верно! Ты читаешь тени с одного взгляда.', 'All correct! You read shadows at a glance.')
  },
  s8: {
    eyebrow: L3("Bir tomondagi chiziq", 'Полоса с одной стороны', 'A stripe on one side'),
    help: [
      L3("Kartochka tomonlariga qarang: chiziq faqat bitta tomonda paydo bo'ladi, keyin boshqa tomonlarda ham.", 'Посмотри на стороны карточки: линия появляется только с одной стороны, потом и с других.', 'Look at the card’s sides: a line appears on just one side, then on others too.'),
      L3("border hamma tomonga chiziq chizadi. border-left esa faqat chapga, border-top tepaga, border-right o'ngga, border-bottom pastga. Qiymati bir xil: qalinlik, tur va rang.", 'border рисует линию со всех сторон, а border-left — только слева, border-top — сверху, border-right — справа, border-bottom — снизу. Значение то же: толщина, вид и цвет.', 'border draws a line on every side; border-left only on the left, border-top on top, border-right on the right, border-bottom at the bottom. The value is the same: thickness, style and color.'),
      L3("Daftarda hoshiya chizig'i faqat chap tomonda bo'ladi. border-left ham shunday: bitta tomonda chiziq.", 'В тетради линия полей есть только слева. border-left так же: линия с одной стороны.', 'In a notebook the margin line is only on the left. border-left is the same: a line on one side.')
    ],
    say: L3("Chegarani bitta tomonga ham berish mumkin. Buning uchun border so'zidan keyin chiziqcha va tomon nomi yoziladi: top, ya'ni tepa, right, ya'ni o'ng, bottom, ya'ni past, va left, ya'ni chap.",
      'Рамку можно дать и только одной стороне. Для этого после слова border ставят чёрточку и имя стороны: top, то есть верх, right — право, bottom — низ, и left — лево.',
      'You can give a border to just one side. For that, after the word border you add a dash and the side name: top, right, bottom and left.'),
    sayLeft: L3("border-left: chap tomonda olti piksellik to'q sariq chiziq. Kartochkalarda bu juda mashhur bezak.", 'border-left: слева оранжевая полоса в шесть пикселей. На карточках это очень популярное украшение.', 'border-left: a six-pixel orange stripe on the left. It’s a very popular decoration on cards.'),
    sayBottom: L3("border-bottom: endi pastda ham binafsha chiziq paydo bo'ldi.", 'border-bottom: теперь и снизу появилась фиолетовая полоса.', 'border-bottom: now there’s a purple stripe at the bottom too.'),
    sayTop: L3("border-top: tepada esa yashil chiziqchalar. Har bir tomon o'z chizig'iga ega.", 'border-top: а сверху — зелёные чёрточки. У каждой стороны своя линия.', 'border-top: and green dashes on top. Each side has its own line.'),
    done: L3("Demak, border hamma tomonga chiziq chizadi, border-left esa faqat chapga. Qiymat esa o'sha-o'sha: qalinlik, tur va rang.", 'Значит, border рисует линию со всех сторон, а border-left — только слева. Значение то же: толщина, вид и цвет.', 'So border draws a line on all sides, and border-left only on the left. The value is the same: thickness, type and color.'),
    askStart: L3("Qarang: top · right · bottom · left", 'Смотри: top · right · bottom · left', 'Watch: top · right · bottom · left'),
    askLeft: L3("Qarang: border-left", 'Смотри: border-left', 'Watch: border-left'),
    askBottom: L3("Qarang: border-bottom", 'Смотри: border-bottom', 'Watch: border-bottom'),
    askTop: L3("Qarang: border-top", 'Смотри: border-top', 'Watch: border-top'),
    askDone: L3("border-left — faqat chapda", 'border-left — только слева', 'border-left is only on the left')
  },
  s9: {
    eyebrow: L3("Chap tomon", 'Левая сторона', 'The left side'),
    say: L3("Endi siz. Qiymat tayyor: olti piksel, yaxlit, to'q sariq. Xususiyatni yozing, shunda chiziq faqat chap tomonda bo'ladi.",
      'Теперь ты. Значение готово: шесть пикселей, сплошная, оранжевая. Впиши свойство, чтобы полоса была только слева.',
      'Your turn. The value is ready: six pixels, solid, orange. Type the property so the stripe is only on the left.'),
    msgs: {
      empty: L3("Xususiyat nomini yozing.", 'Впиши имя свойства.', 'Type the property name.'),
      all: L3("border hamma tomonga chiziq chizadi. Bizga faqat chap tomon kerak.", 'border рисует линию со всех сторон. А нужна только левая.', 'border draws a line on all sides. We only need the left one.'),
      right: L3("Bu o'ng tomon. Bizga chap tomon kerak.", 'Это правая сторона. А нужна левая.', 'That’s the right side. We need the left one.'),
      side: L3("Bu boshqa tomon. Bizga chap tomon kerak.", 'Это другая сторона. А нужна левая.', 'That’s a different side. We need the left one.'),
      bad: L3("Brauzer bu xususiyatni tanimadi. border, chiziqcha va tomon nomi bo'sh joysiz yoziladi.", 'Браузер не узнал это свойство. border, чёрточка и имя стороны пишутся без пробелов.', 'The browser didn’t recognize that property. border, a dash and the side name are written with no spaces.')
    },
    hints: [
      L3("Xususiyat border so'zidan boshlanadi, keyin chiziqcha va tomon.", 'Свойство начинается со слова border, потом чёрточка и сторона.', 'The property starts with the word border, then a dash and the side.'),
      L3("Chap tomon inglizcha left.", 'Левая сторона по-английски — left.', 'The left side is left.'),
      L3("border-left deb yozing va Tekshirishni bosing.", 'Впиши border-left и нажми «Проверить».', 'Type border-left and tap Check.')
    ],
    ok: L3("Ajoyib! Chiziq faqat chap tomonda.", 'Отлично! Полоса только слева.', 'Great! The stripe is only on the left.'),
    ask: L3("Chiziq faqat chapda bo'lsin", 'Сделай полосу только слева', 'Put the stripe only on the left')
  },
  s10: {
    eyebrow: L3("Qaysi tomon?", 'Какая сторона?', 'Which side?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men chiziqli qutini ko'rsataman, siz esa qaysi xususiyat chizganini tanlang.",
      'Теперь проверь себя. Я покажу коробку с полосой, а ты выбери, какое свойство её нарисовало.',
      'Now check yourself. I’ll show a box with a stripe, and you pick which property drew it.'),
    ask: L3("Bu chiziqni qaysi xususiyat beradi?", 'Какое свойство даёт эту полосу?', 'Which property gives this stripe?'),
    hint1: L3("Chiziq qaysi tomonda: tepada, o'ngda, pastda yoki chapda?", 'На какой стороне полоса: сверху, справа, снизу или слева?', 'Which side is the stripe on: top, right, bottom or left?'),
    hint2: L3("top tepa, right o'ng, bottom past, left chap.", 'top — верх, right — право, bottom — низ, left — лево.', 'top, right, bottom, left.'),
    items: [
      { right: 'border-left', why: L3("Chiziq chapda: border-left.", 'Полоса слева: border-left.', 'The stripe is on the left: border-left.') },
      { right: 'border-bottom', why: L3("Chiziq pastda: border-bottom.", 'Полоса снизу: border-bottom.', 'The stripe is at the bottom: border-bottom.') },
      { right: 'border-top', why: L3("Chiziq tepada: border-top.", 'Полоса сверху: border-top.', 'The stripe is on top: border-top.') },
      { right: 'border-right', why: L3("Chiziq o'ngda: border-right.", 'Полоса справа: border-right.', 'The stripe is on the right: border-right.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Tomonlarni adashtirmaysiz.", 'Всё верно! Ты не путаешь стороны.', 'All correct! You don’t mix up the sides.')
  },
  s11: {
    eyebrow: L3("Qachon buziladi", 'Когда ломается', 'When it breaks'),
    help: [
      L3('Har safar kodga qarang: sonlar yonida nima bor va ular nima bilan ajratilgan? Keyin kartochkaga qarang.', 'Каждый раз смотри на код: что стоит рядом с числами и чем они разделены? Потом смотри на карточку.', 'Each time, look at the code: what’s next to the numbers and what separates them? Then look at the card.'),
      L3("Sonlardan keyin px kerak, qismlar esa vergul bilan emas, bo'sh joy bilan ajratiladi. Aks holda brauzer qoidani tashlab yuboradi.", 'После чисел нужен px, а части разделяют не запятой, а пробелом. Иначе браузер выбросит правило.', 'Numbers need px, and the parts are separated by spaces, not commas. Otherwise the browser throws the rule away.'),
      L3("Telefon raqamiga ortiqcha vergul qo'ysangiz, qo'ng'iroq o'tmaydi. CSS da ham shunday: ortiqcha vergul yoki unutilgan px bo'lsa, brauzer qoidani tashlab yuboradi.", "Если в номере телефона поставить лишнюю запятую, звонок не пройдёт. Так и в CSS: лишняя запятая или забытый px — и браузер выбросит правило.", "Put an extra comma in a phone number and the call won’t go through. Same in CSS: an extra comma or a forgotten px, and the browser throws the rule away.")
    ],
    say: L3("Kartochka bezaklarida ham xatolar bo'ladi. Keling, ikkitasini ko'ramiz. Hozir burchaklar o'n olti piksel yumaloq.",
      'В украшениях карточек тоже бывают ошибки. Давай посмотрим на две. Сейчас углы скруглены на шестнадцать пикселей.',
      'Card decorations have mistakes too. Let’s look at two. Right now the corners are rounded by sixteen pixels.'),
    sayNoUnit: L3("Birinchisi: o'n olti sonidan keyin px yo'q. Brauzer qoidani tashlab yubordi, burchaklar yana o'tkir.", 'Первая: после шестнадцати нет px. Браузер выбросил правило, углы снова острые.', 'The first: there’s no px after sixteen. The browser threw the rule away, the corners are sharp again.'),
    sayComma: L3("Ikkinchisi: soya sonlari vergul bilan yozilgan. Brauzer buni tushunmaydi, soya yo'q.", 'Вторая: числа тени записаны через запятую. Браузер это не понимает, тени нет.', 'The second: the shadow numbers are written with commas. The browser doesn’t understand that, there’s no shadow.'),
    sayFixed: L3("Vergullarni olib tashlasak, sonlar bo'sh joy bilan ajraladi, soya darhol paydo bo'ladi.", 'Уберём запятые: числа разделены пробелами, и тень сразу появилась.', 'Remove the commas: the numbers are separated by spaces, and the shadow appears right away.'),
    done: L3("Demak, sonlar yonida px bo'ladi, qismlar esa vergulsiz, bo'sh joy bilan yoziladi.", 'Значит, у чисел есть px, а части пишутся без запятых, через пробел.', 'So numbers have px, and the parts are written without commas, with spaces.'),
    askStart: L3("Qarang: border-radius 16px", 'Смотри: border-radius 16px', 'Watch: border-radius 16px'),
    askNoUnit: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askComma: L3("Qarang: vergullar", 'Смотри: запятые', 'Watch: commas'),
    askFixed: L3("Qarang: vergulsiz", 'Смотри: без запятых', 'Watch: no commas'),
    askDone: L3("px bilan, vergulsiz", 'С px и без запятых', 'With px, without commas')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men soya yozdim, lekin u chiqmayapti! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating, sonlarni esa o'zgartirmang.",
      'Ой, я написал тень, но её нет! В поле — моё значение. Найди ошибку и исправь, а числа не меняй.',
      'Oops, I wrote a shadow, but it doesn’t show up! My value is in the field. Find the mistake and fix it, but don’t change the numbers.'),
    msgs: {
      empty: L3("Maydon bo'sh. Vergulsiz yozing: 0px 6px 12px gray.", "Поле пустое. Впиши без запятых: 0px 6px 12px gray.", "The field is empty. Type it without commas: 0px 6px 12px gray."),
      comma: L3("Qiymatda hali vergul bor. Vergullarni olib tashlang.", 'В значении ещё есть запятая. Убери запятые.', 'There’s still a comma in the value. Remove the commas.'),
      bad: L3("Brauzer soyani tanimadi. Sonlar va rang bo'sh joy bilan yoziladi.", 'Браузер не узнал тень. Числа и цвет пишутся через пробел.', 'The browser didn’t recognize the shadow. The numbers and the color are separated by spaces.'),
      other: L3("Soya chiqdi, lekin boshqacha. Sonlarni o'zgartirmang, faqat vergullarni olib tashlang.", 'Тень появилась, но другая. Не меняй числа, просто убери запятые.', 'There’s a shadow, but a different one. Don’t change the numbers, just remove the commas.')
    },
    hints: [
      L3("Sonlar orasida nima turibdi?", 'Что стоит между числами?', 'What’s between the numbers?'),
      L3("Vergullar ortiqcha: qismlar faqat bo'sh joy bilan ajraladi.", 'Запятые лишние: части разделяются только пробелами.', 'The commas are extra: the parts are separated only by spaces.'),
      L3("Shunday chiqishi kerak: 0px 6px 12px gray. Namuna kod ostida: uni ko'chirib yozing va Tekshirishni bosing.", "Должно получиться так: 0px 6px 12px gray. Образец под кодом: перепиши его и нажми «Проверить».", "It should look like this: 0px 6px 12px gray. The example is under the code: copy it and tap Check.")
    ],
    ok: L3("Ura, ishladi! Soya joyida.", 'Ура, заработало! Тень на месте.', 'Hooray, it works! The shadow is there.'),
    ask: L3("Soyani tuzating", 'Исправь тень', 'Fix the shadow')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va buzilgan qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми сломанное правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      unit: L3("Topdingiz! Yigirma sonidan keyin px yo'q edi.", 'Есть! После двадцати не было px.', 'Found it! There was no px after twenty.'),
      comma: L3("Topdingiz! Soya sonlari vergul bilan yozilgan edi.", 'Есть! Числа тени были записаны через запятую.', 'Found it! The shadow numbers were written with commas.')
    },
    hint1: L3("Sahifaga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      unit: L3("Kartochka burchaklari yumaloqmi? border-radius qiymatini tekshiring.", 'Углы карточек круглые? Проверь значение border-radius.', 'Are the card corners round? Check the border-radius value.'),
      comma: L3("Kartochkalarda soya bormi? box-shadow qiymatini tekshiring.", 'Есть ли у карточек тень? Проверь значение box-shadow.', 'Do the cards have a shadow? Check the box-shadow value.')
    },
    hint3: {
      unit: L3("Xato birinchi qoidada: px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      comma: L3("Xato ikkinchi qoidada: vergullar. O'sha qatorni bosing.", 'Ошибка во втором правиле: запятые. Нажми эту строку.', 'The bug is in the second rule: commas. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz kartochkalarni haqiqiy dizayner kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь карточки как настоящий дизайнер.', 'Super! Both found. You check cards like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Sarlavha ostida chiziq bo'lsin: faqat pastda, uch piksel, yaxlit, to'q sariq. Selektor h1.",
      'Теперь напиши правило целиком. Пусть под заголовком будет линия: только снизу, три пикселя, сплошная, оранжевая. Селектор — h1.',
      'Now write the whole rule yourself. Put a line under the heading: only at the bottom, three pixels, solid, orange. The selector is h1.'),
    msgs: {
      empty: L3("Qoidani yozing: avval selektor, keyin figurali qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat orasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Sarlavha uchun h1 selektori kerak.", 'Для заголовка нужен селектор h1.', 'The heading needs the h1 selector.'),
      all: L3("border hamma tomonga chiziq chizadi. Faqat past tomon kerak.", 'border рисует линию со всех сторон. Нужна только нижняя.', 'border draws a line on all sides. We only need the bottom one.'),
      prop: L3("Pastki chiziqni border-bottom xususiyati beradi.", 'Нижнюю линию задаёт свойство border-bottom.', 'The border-bottom property sets the bottom line.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Uch qismni bo'sh joy bilan yozing: qalinlik, tur va rang.", 'Браузер не узнал это значение. Напиши три части через пробел: толщина, вид и цвет.', 'The browser didn’t recognize that value. Write three parts with spaces: thickness, type and color.'),
      noStyle: L3("Chiziq turi yo'q, shuning uchun chiziq ko'rinmayapti. solid so'zini qo'shing.", 'Нет вида линии, поэтому её не видно. Добавь слово solid.', 'There’s no line type, so the line isn’t visible. Add the word solid.'),
      other: L3("Chiziq chiqdi, lekin boshqacha. Kerak: uch piksel, solid va orange.", 'Линия есть, но другая. Нужно: три пикселя, solid и orange.', 'There’s a line, but a different one. We need three pixels, solid and orange.')
    },
    hints: [
      L3("Qaysi selektor sarlavhani tanlaydi? Qaysi xususiyat faqat pastga chiziq beradi?", 'Какой селектор выбирает заголовок? Какое свойство даёт линию только снизу?', 'Which selector picks the heading? Which property gives a line only at the bottom?'),
      L3("Selektor h1, xususiyat border-bottom, qiymat: uch piksel, solid, orange.", 'Селектор h1, свойство border-bottom, значение: три пикселя, solid, orange.', 'Selector h1, property border-bottom, value: three pixels, solid, orange.'),
      L3("Namuna kod ostida paydo bo'ldi. Uni maydonga ko'chirib yozing va Tekshirishni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Sarlavha ostida chiroyli chiziq. Qoidani o'zingiz yozdingiz.", 'Отлично! Под заголовком красивая линия. Правило написано тобой целиком.', 'Great! A neat line under the heading. You wrote the whole rule yourself.'),
    ask: L3("Sarlavha ostiga 3px solid orange chiziq bering", 'Дай заголовку линию снизу 3px solid orange', 'Give the heading a 3px solid orange bottom line')
  },
  s14: {
    eyebrow: L3("O'z kartochkangiz", 'Своя карточка', 'Your own card'),
    say: L3("Endi o'z kartochkangizni bezang. Burchaklar, soya va chap chiziq uchun istalgan qiymatni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь укрась свою карточку. Впиши любые значения для углов, тени и полосы слева. Потом нажми «Готово».',
      'Now decorate your own card. Type any values for the corners, the shadow and the left stripe. Then tap “Done”.'),
    msgs: {
      rad: L3("Brauzer {w} qiymatini tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал значение {w}. Напиши число и px без пробела.', 'The browser didn’t recognize {w}. Write a number and px with no space.'),
      shd: L3("Brauzer soyani tanimadi. Uchta son va rang yozing, bo'sh joy bilan.", 'Браузер не узнал тень. Напиши три числа и цвет через пробел.', 'The browser didn’t recognize the shadow. Write three numbers and a color with spaces.'),
      comma: L3("Soyada vergul bor. Qismlarni faqat bo'sh joy bilan ajrating.", 'В тени есть запятая. Разделяй части только пробелами.', 'There’s a comma in the shadow. Separate the parts with spaces only.'),
      left: L3("Brauzer chap chiziqni tanimadi. Uch qism yozing: qalinlik, tur va rang.", 'Браузер не узнал левую полосу. Напиши три части: толщина, вид и цвет.', 'The browser didn’t recognize the left stripe. Write three parts: thickness, type and color.'),
      noStyle: L3("Chap chiziqda tur yo'q: solid, dashed yoki dotted qo'shing.", 'У левой полосы нет вида линии: добавь solid, dashed или dotted.', 'The left stripe has no line type: add solid, dashed or dotted.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Burchak uchun son va px; soya uchun o'ngga, pastga, xiralik va rang; chiziq uchun qalinlik, tur va rang.", 'Для углов — число и px; для тени — вправо, вниз, размытие и цвет; для полосы — толщина, вид и цвет.', 'For the corners, a number and px; for the shadow, right, down, blur and color; for the stripe, thickness, type and color.'),
      L3("Masalan: burchak o'n olti piksel, soya nol, olti, o'n olti piksel va silver, chiziq olti piksel solid purple. Keyin «Tayyor»ni bosing.", 'Например: углы шестнадцать пикселей, тень ноль, шесть, шестнадцать пикселей и silver, полоса шесть пикселей solid purple. Потом нажми «Готово».', 'For example: corners sixteen pixels, a shadow of zero, six, sixteen pixels and silver, a stripe of six pixels solid purple. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning kartochkangiz.", 'Ого, как красиво! Это твоя карточка.', 'Wow, how pretty! This is your card.'),
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
    hint1: L3("Gap qaysi xususiyat haqida: border-radius, box-shadow yoki bir tomondagi chegara?", 'О каком свойстве фраза: border-radius, box-shadow или рамка одной стороны?', 'Which property is the sentence about: border-radius, box-shadow or a one-side border?'),
    hint2: L3("Esingizdami: border-radius burchaklarni yumaloqlaydi, box-shadow da avval o'ngga, keyin pastga, qismlar vergulsiz yoziladi, border-left esa faqat chapda.", 'Вспомни: border-radius скругляет углы, в box-shadow сначала вправо, потом вниз, части без запятых, а border-left — только слева.', 'Remember: border-radius rounds corners, in box-shadow first comes right, then down, parts go without commas, and border-left is only on the left.'),
    items: [
      { t: L3("border-radius kartochka burchaklarini yumaloqlaydi.", 'border-radius скругляет углы карточки.', 'border-radius rounds the card’s corners.'), right: true,
        why: L3("To'g'ri: border-radius burchaklarni yumaloqlaydi.", 'Верно: border-radius скругляет углы.', 'Right: border-radius rounds the corners.') },
      { t: L3("Bu qoidada soya pastga tushadi.", 'В этом правиле тень уходит вниз.', 'In this rule the shadow goes down.'), right: false, code: 'shd',
        why: L3("Aslida birinchi son o'ngga siljitadi, ikkinchisi esa nol: soya faqat o'ngda.", 'На самом деле первое число сдвигает вправо, а второе — ноль: тень только справа.', 'Actually the first number moves it right, and the second is zero: the shadow is only on the right.') },
      { t: L3("border-left chiziqni faqat chap tomonga chizadi.", 'border-left рисует линию только слева.', 'border-left draws a line only on the left.'), right: true,
        why: L3("To'g'ri: left chap degani.", 'Верно: left — это лево.', 'Right: left means the left side.') },
      { t: L3("Bu qoida kartochkaga soya beradi.", 'Это правило даёт карточке тень.', 'This rule gives the card a shadow.'), right: false, code: 'comma',
        why: L3("Aslida vergullar bor, brauzer qoidani tashlab yuboradi, soya yo'q.", 'На самом деле там запятые, браузер выбрасывает правило, тени нет.', 'Actually there are commas, the browser throws the rule away, there’s no shadow.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz kartochkalarni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в карточках.', 'All correct! You know cards really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men border-radius ni yuz piksel qilib, doira kutgan edim? Qarang: kartochka doira emas, tabletka bo'ldi! Men adashibman. Kartochka keng, shuning uchun faqat chetlari yumaloqlandi.",
        'Вернёмся к загадке. Помнишь, я сделал border-radius сто пикселей и ждал круг? Смотри: карточка не круг, а таблетка! Я ошибся. Карточка широкая, поэтому скруглились только края.',
        'Back to our riddle. Remember, I made border-radius a hundred pixels and expected a circle? Look: the card isn’t a circle, it’s a pill! I was wrong. The card is wide, so only the ends got round.'), k: 'riddle' },
      { text: L3("Doira uchun quti kvadrat bo'lishi kerak: kengligi va balandligi bir xil. border-radius esa ellik foiz. Mana, endi haqiqiy doira!",
        'Для круга коробка должна быть квадратной: ширина и высота одинаковые. А border-radius — пятьдесят процентов. Вот, теперь настоящий круг!',
        'For a circle the box has to be square: the same width and height. And border-radius is fifty percent. There, now it’s a real circle!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning kartochkangiz, o'zingiz tanlagan bezaklar bilan!", 'Смотри, это твоя карточка с твоими собственными украшениями!', 'Look, this is your card with the decorations you picked yourself!'), k: 'own' },
      { text: L3("border-radius burchaklarni yumaloqlaydi.", 'border-radius скругляет углы.', 'border-radius rounds the corners.'), k: 'rad' },
      { text: L3("box-shadow: o'ngga, pastga, xiralik va rang, vergulsiz.", 'box-shadow: вправо, вниз, размытие и цвет, без запятых.', 'box-shadow: right, down, blur and color, without commas.'), k: 'shd' },
      { text: L3("border-left, border-top va boshqalar chiziqni bitta tomonga beradi.", 'border-left, border-top и другие дают линию одной стороне.', 'border-left, border-top and the others give a line to one side.'), k: 'side' },
      { text: L3("Doira esa kvadrat quti va ellik foizli border-radius.", 'А круг — это квадратная коробка и border-radius пятьдесят процентов.', 'And a circle is a square box with border-radius fifty percent.'), k: 'circ' },
      { text: L3("Tabriklayman! Endi sizning kartochkalaringiz ilovalardagidek chiroyli. Keyingi darsda elementlar sahifada qanday joylashishini o'rganamiz: ba'zilari butun qatorni egallaydi, ba'zilari esa yonma-yon turadi. Ko'rishguncha!",
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
