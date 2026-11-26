// =============================================================================
// КУРС «JAVASCRIPT» · Урок 4 — «Операторы» (26.11.2026, заказчик: «делай следующий урок js»).
// Облик «Редактор», как уроки 1–3. Дети 11–14, проходят сами. Страницы в браузере нет (до DOM): «Память», консоль
// и новая полоса «Расчёт» — выражение по шагам. Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/js4/build.mjs → lessons/javascript/04-operatory.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Операторы» · модуль js-m1 =====
//
// ЗАМЫСЕЛ. В игре Коди открылся магазин: монеты тратятся (+ - * /), нужно сравнивать — хватит ли на покупку (> <),
// проверять равенство (===, а не =). Полоса «Расчёт» показывает, как JavaScript считает выражение шаг за шагом.
// Загадка: Коди уверен, что 2 + 3 * 4 = 20; разгадка — умножение раньше: 14, а 20 — только со скобками.
// Дуга (18): крючок «магазин» → показ + - * / → какой знак → что в консоли → показ > < → true или false →
// сравнение целиком → показ === → = или === → что в консоли → показ порядка действий → поставь скобки →
// что в консоли → найди строку → выражение целиком → бой с боссом → верно или нет → вывод.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'js-04-operatory',
  module: 'js-m1',
  lessonTitle: {
    uz: '4-dars. Operatorlar',
    ru: 'Урок 4. Операторы',
    en: 'Lesson 4. Operators'
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
  run: L3('Ishga tushirish', 'Запустить', 'Run'),
  buy: L3('Qilich sotib olish', 'Купить меч', 'Buy a sword'),
  poor: L3('Tanga yetmaydi', 'Монет не хватает', 'Not enough coins'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  yes: L3("To'g'ri", 'Верно', 'True'),
  no: L3("Noto'g'ri", 'Неверно', 'False'),
  err: L3('Xato', 'Ошибка', 'Error'),
  mem: L3('Xotira', 'Память', 'Memory'),
  memEmpty: L3("Hozircha quti yo'q", 'Пока нет ни одной коробки', 'No boxes yet'),
  conEmpty: L3("Konsol hozircha bo'sh", 'Консоль пока пуста', 'The console is empty for now'),
  want: L3('Konsolda kerak:', 'В консоли нужно:', 'The console should show:'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Shartlar', 'Условия', 'Conditions'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  types: { string: L3('matn', 'текст', 'text'), number: L3('son', 'число', 'number'), boolean: L3("ha / yo'q", 'да / нет', 'yes / no') }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, msgs, hints, help, why, right, wrong …; печатаются: eyebrow, ask, q, code, opts, v.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Do'kon", 'Магазин', 'The shop'),
    say: L3("Salom! O'yinimda do'kon ochildi. Menda yuz tanga bor, qilich o'ttiz tanga turadi. Qilich sotib oling va kodga qarang: JavaScript nima hisoblayapti?",
      'Привет! В моей игре открылся магазин. У меня сто монет, меч стоит тридцать. Купи меч и смотри на код: что считает JavaScript?',
      'Hi! A shop opened in my game. I have a hundred coins, and a sword costs thirty. Buy a sword and watch the code: what is JavaScript calculating?'),
    buy: L3("Yana bitta sotib oling. Pastdagi Hisob qatoriga qarang.", 'Купи ещё один. Смотри на полосу «Расчёт» под кодом.', 'Buy one more. Watch the Calculation strip under the code.'),
    works: L3("Ko'rdingizmi? Minus tangalarni kamaytirdi, katta belgisi esa tanga yetadimi, deb so'radi. Oxirida javob false: o'n tanga o'ttizdan kichik. Bu belgilar operatorlar deyiladi.",
      'Видишь? Минус уменьшил монеты, а знак «больше» спросил, хватит ли монет. В конце ответ false: десять меньше тридцати. Такие знаки называются операторами.',
      'See? The minus reduced the coins, and the greater-than sign asked whether there are enough. At the end the answer is false: ten is less than thirty. These signs are called operators.'),
    riddle: L3("Bugun operatorlarni o'rganamiz. Lekin oldin topishmoq. Ikki plyus uch, ko'paytirish to'rt. Menimcha, javob yigirma. Men haqmanmi? Dars oxirida bilamiz.",
      'Сегодня изучаем операторы. Но сначала загадка. Два плюс три, умножить на четыре. По-моему, ответ — двадцать. Прав ли я? Узнаем в конце урока.',
      'Today we learn operators. But first, a riddle. Two plus three times four. I think the answer is twenty. Am I right? We’ll find out at the end of the lesson.'),
    ask: L3("Qilich sotib oling", 'Купи меч', 'Buy a sword'),
    askMore: L3("Yana sotib oling", 'Купи ещё', 'Buy another'),
    askDone: L3("Topishmoq: ikki plyus uch ko'paytirish to'rt, nechchi?", 'Загадка: два плюс три умножить на четыре — сколько?', 'Riddle: two plus three times four, how much?')
  },
  s2: {
    eyebrow: L3('Hisoblash', 'Считаем', 'Calculating'),
    say: L3("JavaScript kalkulyatordek hisoblaydi. To'rtta belgi bor. Kuzating, Hisob qatori har bir qadamni ko'rsatadi.",
      'JavaScript считает как калькулятор. Знаков четыре. Смотри: полоса «Расчёт» показывает каждый шаг.',
      'JavaScript calculates like a calculator. There are four signs. Watch: the Calculation strip shows every step.'),
    steps: [
      L3("Plyus qo'shadi. Oldin JavaScript a o'rniga qutidagi o'nni qo'yadi, keyin besh qo'shadi: o'n besh.", 'Плюс складывает. Сначала JavaScript ставит вместо a десять из коробки, потом прибавляет пять: пятнадцать.', 'Plus adds. First JavaScript puts the ten from the box in place of a, then adds five: fifteen.'),
      L3("Minus ayiradi: yetti. Ko'paytirish esa yulduzcha bilan yoziladi, x harfi bilan emas: yigirma.", 'Минус вычитает: семь. А умножение пишут звёздочкой, не буквой x: двадцать.', 'Minus subtracts: seven. And multiplication is written with a star, not the letter x: twenty.'),
      L3("Bo'lish qiya chiziq bilan yoziladi. O'nni to'rtga bo'lsak, ikki butun o'ndan besh.", 'Деление пишут косой чертой. Десять разделить на четыре — два с половиной.', 'Division is written with a slash. Ten divided by four is two point five.')
    ],
    help: [
      L3("Hisob qatoriga qarang: qadam-baqadam javob chiqadi.", 'Смотри на полосу «Расчёт»: ответ получается шаг за шагом.', 'Watch the Calculation strip: the answer comes step by step.'),
      L3("Plyus, minus, yulduzcha ko'paytirish, qiya chiziq bo'lish. Quti nomi o'rniga uning qiymati qo'yiladi.", 'Плюс, минус, звёздочка — умножить, косая черта — разделить. Вместо имени коробки подставляется её значение.', 'Plus, minus, star for multiply, slash for divide. A box’s name is replaced with its value.'),
      L3("Xuddi telefondagi kalkulyator kabi, faqat endi siz unga buyruq yozasiz.", 'Как калькулятор в телефоне, только теперь команды пишешь ты.', 'Like the calculator on your phone, only now you write the commands.')
    ],
    ask: L3("JavaScript qanday hisoblashini kuzating", 'Смотри, как считает JavaScript', 'Watch how JavaScript calculates'),
    askDone: L3("Plyus, minus, yulduzcha, qiya chiziq", 'Плюс, минус, звёздочка, косая черта', 'Plus, minus, star, slash')
  },
  s3: {
    eyebrow: L3('Qaysi belgi?', 'Какой знак?', 'Which sign?'),
    say: L3("O'n ikki va uch orasiga qaysi belgi qo'yilsa, konsolda kerakli son chiqadi? Belgini bosing.",
      'Какой знак поставить между двенадцатью и тремя, чтобы в консоли вышло нужное число? Нажми знак.',
      'Which sign between twelve and three gives the number we need in the console? Tap the sign.'),
    ask: L3("Kerakli son chiqadigan belgini tanlang", 'Выбери знак, чтобы вышло нужное число', 'Pick the sign that gives the number'),
    rounds: [
      { want: 4, a: '/', why: L3("O'n ikkini uchga bo'lsak, to'rt.", 'Двенадцать разделить на три — четыре.', 'Twelve divided by three is four.') },
      { want: 15, a: '+', why: L3("O'n ikki plyus uch, o'n besh.", 'Двенадцать плюс три — пятнадцать.', 'Twelve plus three is fifteen.') },
      { want: 36, a: '*', why: L3("O'n ikki karra uch, o'ttiz olti.", 'Двенадцать умножить на три — тридцать шесть.', 'Twelve times three is thirty-six.') }
    ],
    wrong: L3("Konsolda boshqa son chiqdi: {got}. Bizga {want} kerak.", 'В консоли вышло другое число: {got}. Нам нужно {want}.', 'The console showed a different number: {got}. We need {want}.'),
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Kerakli son o'n ikkidan kattami yoki kichikmi?", 'Нужное число больше двенадцати или меньше?', 'Is the number we need bigger or smaller than twelve?'),
    hint2: L3("Kattaroq bo'lsa, plyus yoki ko'paytirish. Kichikroq bo'lsa, minus yoki bo'lish.", 'Больше — плюс или умножение. Меньше — минус или деление.', 'Bigger: plus or multiply. Smaller: minus or divide.'),
    ok: L3("Barakalla! Siz to'rtta belgini bilasiz.", 'Молодец! Ты знаешь все четыре знака.', 'Well done! You know all four signs.')
  },
  s4: {
    eyebrow: L3('Konsolda nima?', 'Что в консоли?', 'What’s in the console?'),
    say: L3("Konsolda nima chiqishini taxmin qiling. Qutilardagi sonlarga qarang.", 'Угадай, что появится в консоли. Смотри на числа в коробках.', 'Guess what the console will show. Look at the numbers in the boxes.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['let price = 20;', 'let count = 3;', 'console.log(price * count);'], opts: ['23', '60', '203'], a: 1,
        why: L3("Yigirma karra uch, oltmish.", 'Двадцать умножить на три — шестьдесят.', 'Twenty times three is sixty.') },
      { code: ['let total = 100;', 'total = total - 35;', 'console.log(total);'], opts: ['135', '65', '100'], a: 1,
        why: L3("Yuzdan o'ttiz beshni ayirdik: oltmish besh.", 'Из ста вычли тридцать пять: шестьдесят пять.', 'A hundred minus thirty-five: sixty-five.') },
      { code: ['let pizza = 8;', 'console.log(pizza / 2);'], opts: ['4', '16', '82'], a: 0,
        why: L3("Sakkizni ikkiga bo'lsak, to'rt.", 'Восемь разделить на два — четыре.', 'Eight divided by two is four.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Quti nomi o'rniga uning qiymatini qo'yib ko'ring.", 'Подставь вместо имени коробки её значение.', 'Put the box’s value in place of its name.'),
    hint2: L3("Yulduzcha ko'paytiradi, qiya chiziq bo'ladi, minus ayiradi.", 'Звёздочка умножает, косая черта делит, минус вычитает.', 'The star multiplies, the slash divides, minus subtracts.'),
    ok: L3("Ajoyib! Siz qutilar bilan hisoblaysiz.", 'Отлично! Ты считаешь с коробками.', 'Excellent! You calculate with boxes.')
  },
  s5: {
    eyebrow: L3('Katta yoki kichik', 'Больше или меньше', 'Greater or less'),
    say: L3("Endi solishtiramiz. JavaScript ikki sonni solishtirib, ha yoki yo'q deb javob beradi. Kuzating.",
      'Теперь сравниваем. JavaScript сравнивает два числа и отвечает «да» или «нет». Смотри.',
      'Now we compare. JavaScript compares two numbers and answers yes or no. Watch.'),
    steps: [
      L3("Katta belgisi so'raydi: chapdagi katta mi? Bir yuz yigirma yuzdan katta. Javob true, ya'ni ha degani.", 'Знак «больше» спрашивает: левое больше? Сто двадцать больше ста. Ответ true — «да».', 'The greater-than sign asks: is the left one bigger? A hundred twenty is bigger than a hundred. The answer is true, yes.'),
      L3("Kichik belgisi: chapdagi kichikmi? Bir yuz yigirma ellikdan kichik emas. Javob false. Belgining o'tkir uchi kichik songa qaraydi.", 'Знак «меньше»: левое меньше? Сто двадцать не меньше пятидесяти. Ответ false. Острый угол знака смотрит на меньшее число.', 'The less-than sign: is the left one smaller? A hundred twenty isn’t smaller than fifty. The answer is false. The sharp tip points at the smaller number.'),
      L3("Diqqat qiling: uch uchdan katta emas, ular teng. Shuning uchun javob false.", 'Внимание: три не больше трёх, они равны. Поэтому ответ false.', 'Careful: three isn’t bigger than three, they’re equal. So the answer is false.')
    ],
    help: [
      L3("Konsoldagi ko'k javoblarga qarang: true yoki false.", 'Смотри на синие ответы в консоли: true или false.', 'Look at the blue answers in the console: true or false.'),
      L3("Solishtirish javobi har doim boolean: true yoki false.", 'Ответ сравнения всегда boolean: true или false.', 'A comparison always answers with a boolean: true or false.'),
      L3("Xuddi o'yindagi rekord kabi: ochkoing rekorddan kattami? Ha yoki yo'q.", 'Как рекорд в игре: твои очки больше рекорда? Да или нет.', 'Like a high score: is your score bigger than the record? Yes or no.')
    ],
    ask: L3("Solishtirishni kuzating", 'Смотри, как сравнивают', 'Watch the comparison'),
    askDone: L3("Solishtirish javobi: true yoki false", 'Ответ сравнения — true или false', 'A comparison answers true or false')
  },
  s6: {
    eyebrow: L3('true yoki false?', 'true или false?', 'true or false?'),
    say: L3("Konsolda true chiqadimi yoki false? Taxmin qiling.", 'В консоли будет true или false? Угадай.', 'Will the console show true or false? Guess.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['console.log(7 > 3);'], opts: ['true', 'false', 'err'], a: 0, why: L3("Yetti uchdan katta: true.", 'Семь больше трёх: true.', 'Seven is bigger than three: true.') },
      { code: ['console.log(5 < 2);'], opts: ['true', 'false', 'err'], a: 1, why: L3("Besh ikkidan kichik emas: false.", 'Пять не меньше двух: false.', 'Five isn’t smaller than two: false.') },
      { code: ['let lives = 0;', 'console.log(lives > 0);'], opts: ['true', 'false', 'err'], a: 1, why: L3("Nol noldan katta emas: false. Hayot qolmadi.", 'Ноль не больше нуля: false. Жизней не осталось.', 'Zero isn’t bigger than zero: false. No lives left.') },
      { code: ['console.log(10 > 10);'], opts: ['true', 'false', 'err'], a: 1, why: L3("Teng sonlar: biri ikkinchisidan katta emas, false.", 'Числа равны: одно не больше другого, false.', 'The numbers are equal: neither is bigger, false.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Belgini o'qing: katta yoki kichik?", 'Прочитай знак: больше или меньше?', 'Read the sign: greater or less?'),
    hint2: L3("Teng sonlar uchun katta ham, kichik ham false beradi.", 'Для равных чисел и «больше», и «меньше» дают false.', 'For equal numbers both greater and less give false.'),
    ok: L3("Barakalla! Solishtirishni JavaScript'dek bajarasiz.", 'Молодец! Ты сравниваешь как JavaScript.', 'Well done! You compare like JavaScript.')
  },
  s7: {
    eyebrow: L3('Daraja ochiladimi?', 'Уровень откроется?', 'Will the level unlock?'),
    say: L3("Yangi daraja ochko yuzdan katta bo'lsa ochiladi. Ikkinchi qatorga shuni tekshiradigan solishtirishni yozing.",
      'Новый уровень открывается, если очков больше ста. Напиши во второй строке сравнение, которое это проверяет.',
      'The new level unlocks if the score is bigger than a hundred. Write the comparison that checks it on the second line.'),
    ask: L3("score 100 dan kattami? Tekshiring", 'Проверь: score больше 100?', 'Check: is score bigger than 100?'),
    msgs: {
      empty: L3("Bo'sh joyga solishtirish yozing.", 'Впиши сравнение в пропуск.', 'Type a comparison into the gap.'),
      notBool: L3("Qutiga son yoki matn tushdi. Solishtirish kerak: u true yoki false beradi.", 'В коробку попало число или текст. Нужно сравнение — оно даёт true или false.', 'A number or text landed in the box. We need a comparison: it gives true or false.'),
      noScore: L3("Solishtirishda score qutisi bo'lsin.", 'В сравнении должна быть коробка score.', 'The comparison must use the score box.'),
      no100: L3("Biz score ni yuz bilan solishtiramiz.", 'Сравниваем score со ста.', 'We compare score with a hundred.'),
      dir: L3("Javob false chiqdi. Belgi teskari: kichik belgisi «kichikmi» deb so'raydi.", 'Вышло false. Знак наоборот: «меньше» спрашивает «меньше ли?».', 'It came out false. The sign is backwards: less-than asks “is it smaller?”.'),
      eq: L3("Bu tenglikni tekshiradi. Bizga «kattami» kerak.", 'Это проверка на равенство. Нам нужно «больше ли».', 'That checks equality. We need “is it bigger”.'),
      syntax: L3("JavaScript buni tushunmadi. Shakl: quti nomi, belgi, son.", 'JavaScript не понял. Форма: имя коробки, знак, число.', 'JavaScript didn’t understand. The shape: box name, sign, number.')
    },
    hints: [
      L3("Solishtirishda uch qism bor: score, belgi va yuz.", 'В сравнении три части: score, знак и сто.', 'A comparison has three parts: score, a sign and a hundred.'),
      L3("Katta belgisi kerak: o'tkir uchi kichik songa, yuzga qaraydi.", 'Нужен знак «больше»: острым углом к меньшему числу, к ста.', 'We need greater-than: its sharp tip points at the smaller number, a hundred.'),
      L3("Namunani ko'chirib yozing.", 'Перепиши образец.', 'Copy the example.')
    ],
    ok: L3("Zo'r! Qutida true: yangi daraja ochildi!", 'Супер! В коробке true: новый уровень открыт!', 'Awesome! The box holds true: the new level is unlocked!')
  },
  s8: {
    eyebrow: L3('Tengmi?', 'Равно?', 'Equal?'),
    say: L3("Ikki narsa tengmi? Buning uchun uchta teng belgisi bor. Kuzating.", 'Равны ли две вещи? Для этого есть три знака равно подряд. Смотри.', 'Are two things equal? There are three equals signs in a row for that. Watch.'),
    steps: [
      L3("Uchta teng belgisi so'raydi: ikkalasi bir xilmi? Qutida besh, besh bilan bir xil: true.", 'Три знака равно спрашивают: одинаковы ли? В коробке пять, с пятью одинаково: true.', 'Three equals signs ask: are they the same? The box holds five, same as five: true.'),
      L3("Besh yettiga teng emas: false.", 'Пять не равно семи: false.', 'Five isn’t equal to seven: false.'),
      L3("Qiziq joy: qo'shtirnoqdagi besh va oddiy besh. Biri matn, biri son. Uchta teng turni ham tekshiradi, shuning uchun false.", 'Интересно: пять в кавычках и просто пять. Одно — текст, другое — число. Три знака равно проверяют и тип, поэтому false.', 'Here’s the catch: five in quotes and plain five. One is text, the other a number. Triple equals checks the type too, so false.'),
      L3("Esda tuting: bitta teng belgisi qutiga soladi, uchta teng belgisi solishtiradi.", 'Запомни: один знак равно кладёт в коробку, три знака равно — сравнивают.', 'Remember: one equals sign puts into a box, three equals signs compare.')
    ],
    help: [
      L3("Har bir qatorni konsoldagi javob bilan solishtiring.", 'Сравни каждую строку с ответом в консоли.', 'Compare each line with its answer in the console.'),
      L3("Uchta teng: qiymat ham, tur ham bir xil bo'lsa, true.", 'Три знака равно: true, если совпадает и значение, и тип.', 'Triple equals: true when both the value and the type match.'),
      L3("Xuddi parol kabi: bitta harf yoki belgi farq qilsa, kirolmaysiz.", 'Как пароль: отличается одна буква или знак — не войдёшь.', 'Like a password: one letter or symbol off and you can’t get in.')
    ],
    ask: L3("Tenglik tekshiruvini kuzating", 'Смотри, как проверяют равенство', 'Watch how equality is checked'),
    askDone: L3("Bitta teng — sol, uchta teng — solishtir", 'Один знак равно — положить, три — сравнить', 'One equals: put in. Three: compare')
  },
  s9: {
    eyebrow: L3('Bitta yoki uchta?', 'Один или три?', 'One or three?'),
    say: L3("Har bir vazifaga qaysi belgi kerak: bitta teng yoki uchta teng?", 'Какой знак нужен в каждой задаче: один знак равно или три?', 'Which sign does each job need: one equals sign or three?'),
    ask: L3("Qaysi belgi kerak?", 'Какой знак нужен?', 'Which sign is needed?'),
    rounds: [
      { q: L3("score qutisiga 10 ni soling", 'Положи в коробку score число 10', 'Put 10 into the score box'), a: '=', why: L3("Qutiga solish: bitta teng.", 'Положить в коробку — один знак равно.', 'Putting into a box: one equals sign.') },
      { q: L3("score 10 ga tengmi? Tekshiring", 'Проверь: score равно 10?', 'Check: is score equal to 10?'), a: '===', why: L3("Tekshirish: uchta teng.", 'Проверка — три знака равно.', 'Checking: three equals signs.') },
      { q: L3("lives qutisiga 3 ni soling", 'Положи в коробку lives число 3', 'Put 3 into the lives box'), a: '=', why: L3("Bu ham qutiga solish.", 'Это тоже «положить в коробку».', 'This is putting into a box too.') },
      { q: L3("Javob 42 ga tengmi?", 'Ответ равен 42?', 'Is the answer equal to 42?'), a: '===', why: L3("Savol: tengmi? Demak, uchta teng.", 'Вопрос «равно ли?» — значит, три знака.', 'The question is “is it equal?”, so three signs.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Vazifani o'qing: biror narsa solinyaptimi yoki so'ralyaptimi?", 'Прочитай задачу: что-то кладут или спрашивают?', 'Read the job: is something being put in or asked?'),
    hint2: L3("Solish — bitta teng. Tengmi, deb so'rash — uchta teng.", 'Положить — один знак. Спросить «равно ли?» — три.', 'Putting in: one sign. Asking “is it equal?”: three.'),
    ok: L3("Ajoyib! Endi bitta va uchta tengni adashtirmaysiz.", 'Отлично! Теперь один и три знака равно не перепутать.', 'Excellent! Now you won’t mix up one and three equals signs.')
  },
  s10: {
    eyebrow: L3('Konsolda nima?', 'Что в консоли?', 'What’s in the console?'),
    say: L3("Uchta teng nima deydi? Tur va harflarga diqqat qiling.", 'Что скажут три знака равно? Следи за типами и буквами.', 'What will triple equals say? Watch the types and letters.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['console.log("5" === 5);'], opts: ['true', 'false', 'err'], a: 1, why: L3("Matn va son: turlari har xil, false.", 'Текст и число: типы разные, false.', 'Text and a number: different types, false.') },
      { code: ['console.log(3 + 2 === 5);'], opts: ['true', 'false', 'err'], a: 0, why: L3("Oldin uch plyus ikki, besh. Keyin besh beshga teng: true.", 'Сначала три плюс два — пять. Потом пять равно пяти: true.', 'First three plus two is five. Then five equals five: true.') },
      { code: ['console.log("Kodi" === "kodi");'], opts: ['true', 'false', 'err'], a: 1, why: L3("Katta va kichik harf farq qiladi: false.", 'Большая и маленькая буква различаются: false.', 'A capital and a small letter differ: false.') },
      { code: ['let x = 10;', 'console.log(x === 10);'], opts: ['true', 'false', 'err'], a: 0, why: L3("Qutida o'n, o'n bilan bir xil: true.", 'В коробке десять, совпадает с десятью: true.', 'The box holds ten, the same as ten: true.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Turi bir xilmi? Harflar bir xilmi?", 'Типы одинаковые? Буквы одинаковые?', 'Same type? Same letters?'),
    hint2: L3("Uchta teng hamma narsa bir xil bo'lsagina true beradi.", 'Три знака равно дают true, только если всё совпадает.', 'Triple equals gives true only if everything matches.'),
    ok: L3("Barakalla! Tenglikni aniq tekshirasiz.", 'Молодец! Ты точно проверяешь равенство.', 'Well done! You check equality precisely.')
  },
  s11: {
    eyebrow: L3('Qaysi biri oldin?', 'Что сначала?', 'What goes first?'),
    say: L3("Bir qatorda bir nechta belgi bo'lsa, qaysi biri oldin bajariladi? Kuzating, Hisob qatoriga qarang.",
      'Если в строке несколько знаков, что выполняется первым? Смотри на полосу «Расчёт».',
      'If a line has several signs, which runs first? Watch the Calculation strip.'),
    steps: [
      L3("Ko'paytirish va bo'lish oldin bajariladi, keyin qo'shish va ayirish. Uch karra to'rt, o'n ikki. Keyin ikki qo'shiladi: o'n to'rt.", 'Умножение и деление выполняются раньше, потом сложение и вычитание. Три на четыре — двенадцать. Потом прибавляем два: четырнадцать.', 'Multiplication and division go first, then addition and subtraction. Three times four is twelve. Then add two: fourteen.'),
      L3("Qavs tartibni o'zgartiradi: qavs ichi birinchi. Ikki plyus uch, besh. Keyin besh karra to'rt: yigirma.", 'Скобки меняют порядок: сначала то, что в скобках. Два плюс три — пять. Потом пять на четыре — двадцать.', 'Brackets change the order: inside the brackets goes first. Two plus three is five. Then five times four: twenty.'),
      L3("Xuddi matematika darsidagidek. Kerakli tartib bo'lsa, qavs qo'ying.", 'Как на уроке математики. Нужен свой порядок — ставь скобки.', 'Just like in math class. If you need a different order, add brackets.')
    ],
    help: [
      L3("Hisob qatorida qaysi qism birinchi hisoblanganiga qarang.", 'Смотри в полосе «Расчёт», что посчитано первым.', 'See in the Calculation strip what was worked out first.'),
      L3("Avval qavslar, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish.", 'Сначала скобки, потом умножение и деление, в конце сложение и вычитание.', 'First brackets, then multiplication and division, last addition and subtraction.'),
      L3("Xuddi ovqat tayyorlash kabi: tartib boshqa bo'lsa, natija ham boshqa.", 'Как в готовке: другой порядок — другой результат.', 'Like cooking: a different order gives a different result.')
    ],
    ask: L3("Amallar tartibini kuzating", 'Смотри на порядок действий', 'Watch the order of operations'),
    askDone: L3("Oldin qavs, keyin ko'paytirish, oxirida plyus", 'Сначала скобки, потом умножение, в конце плюс', 'Brackets, then multiply, then plus')
  },
  s12: {
    eyebrow: L3("Qavs qo'ying", 'Поставь скобки', 'Add brackets'),
    say: L3("Kodi ikkita qilich va uchta qalqon oldi, har biri to'rt tangadan. Jami yigirma bo'lishi kerak, lekin JavaScript o'n to'rt hisobladi. Qavs qo'ying, raqamlarni o'zgartirmang.",
      'Коди купил два меча и три щита, каждый по четыре монеты. Всего должно быть двадцать, а JavaScript насчитал четырнадцать. Поставь скобки, числа не меняй.',
      'Kodi bought two swords and three shields, four coins each. The total should be twenty, but JavaScript got fourteen. Add brackets, don’t change the numbers.'),
    ask: L3("total da 20 bo'lsin: qavs qo'ying", 'Пусть в total будет 20: поставь скобки', 'Make total 20: add brackets'),
    msgs: {
      still: L3("Yana o'n to'rt: ko'paytirish birinchi bajarildi. Ikki plyus uchni qavsga oling.", 'Снова четырнадцать: умножение выполнилось первым. Возьми два плюс три в скобки.', 'Fourteen again: multiplication went first. Put two plus three in brackets.'),
      nums: L3("Raqamlarni o'zgartirmang: ikki, uch va to'rt qolsin. Faqat qavs qo'ying.", 'Числа не меняй: пусть останутся два, три и четыре. Только поставь скобки.', 'Don’t change the numbers: keep two, three and four. Just add brackets.'),
      other: L3("Yigirma chiqmadi. Qavs qaysi qismni o'rashini tekshiring.", 'Двадцать не вышло. Проверь, что именно взято в скобки.', 'Twenty didn’t come out. Check what the brackets go around.'),
      syntax: L3("JavaScript buni tushunmadi. Qavslar juft bo'lsin: ochuvchi va yopuvchi.", 'JavaScript не понял. Скобки должны быть парой: открывающая и закрывающая.', 'JavaScript didn’t understand. Brackets come in pairs: opening and closing.')
    },
    hints: [
      L3("Qaysi qism birinchi hisoblanishi kerak?", 'Какую часть нужно посчитать первой?', 'Which part should be worked out first?'),
      L3("Ikki plyus uch birinchi bo'lishi kerak.", 'Первым должно быть два плюс три.', 'Two plus three should go first.'),
      L3("Ikki plyus uchni qavsga oling.", 'Возьми два плюс три в скобки.', 'Put two plus three in brackets.')
    ],
    ok: L3("Ajoyib! Qavs tartibni o'zgartirdi: yigirma tanga.", 'Отлично! Скобки изменили порядок: двадцать монет.', 'Excellent! The brackets changed the order: twenty coins.')
  },
  s13: {
    eyebrow: L3('Tartibni hisoblang', 'Посчитай по порядку', 'Work it out in order'),
    say: L3("Amallar tartibini eslab, konsolda nima chiqishini toping.", 'Вспомни порядок действий и найди, что выйдет в консоли.', 'Remember the order of operations and find what the console shows.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['console.log(10 - 2 * 3);'], opts: ['24', '4', '14'], a: 1, why: L3("Oldin ikki karra uch, olti. O'ndan olti: to'rt.", 'Сначала два на три — шесть. Десять минус шесть — четыре.', 'First two times three is six. Ten minus six is four.') },
      { code: ['console.log((10 - 2) * 3);'], opts: ['24', '4', '16'], a: 0, why: L3("Qavs birinchi: sakkiz. Sakkiz karra uch: yigirma to'rt.", 'Скобки первыми: восемь. Восемь на три — двадцать четыре.', 'Brackets first: eight. Eight times three: twenty-four.') },
      { code: ['console.log(8 / 2 + 2);'], opts: ['2', '6', '8'], a: 1, why: L3("Oldin bo'lish: to'rt. Keyin ikki qo'shamiz: olti.", 'Сначала деление: четыре. Потом прибавляем два: шесть.', 'Division first: four. Then add two: six.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Qavs bormi? Ko'paytirish yoki bo'lish bormi?", 'Есть скобки? Есть умножение или деление?', 'Are there brackets? Any multiply or divide?'),
    hint2: L3("Qavs, keyin ko'paytirish va bo'lish, keyin plyus va minus.", 'Скобки, потом умножение и деление, потом плюс и минус.', 'Brackets, then multiply and divide, then plus and minus.'),
    ok: L3("Barakalla! Amallar tartibi sizga tanish.", 'Молодец! Порядок действий тебе знаком.', 'Well done! You know the order of operations.')
  },
  s14: {
    eyebrow: L3('Buzilgan qator', 'Сломанная строка', 'The broken line'),
    say: L3("Qizil xabarga va o'ng tomondagi raqamga qarang, keyin buzilgan qatorni bosing.", 'Посмотри на красное сообщение и номер справа, потом нажми сломанную строку.', 'Look at the red message and the number on the right, then tap the broken line.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    rounds: [
      { lines: ['let price = 20;', 'let total = price x 2;', 'console.log(total);'], bad: 1, why: L3("Ikkinchi qatorda ko'paytirish x harfi bilan yozilgan. JavaScript'da yulduzcha kerak.", 'Во второй строке умножение написано буквой x. В JavaScript нужна звёздочка.', 'On the second line multiplication is written with the letter x. JavaScript needs a star.') },
      { lines: ['let lives = 3;', 'lives = lives - 1;', 'console.log(lives > );'], bad: 2, why: L3("Uchinchi qatorda katta belgisidan keyin son yo'q.", 'В третьей строке после знака «больше» нет числа.', 'On the third line there’s no number after the greater-than sign.') }
    ],
    wrong: L3("Bu qatorda xato yo'q. Qizil xabardagi raqam boshqa qatorni ko'rsatyapti.", 'В этой строке ошибки нет. Номер в красном сообщении указывает на другую строку.', 'This line has no mistake. The number in the red message points to another line.'),
    right: L3("Topildi!", 'Есть!', 'Found it!'),
    hint1: L3("Qizil xabarning o'ng tomonida raqam bor. U qator raqami.", 'Справа у красного сообщения есть число. Это номер строки.', 'There’s a number on the right of the red message. It’s the line number.'),
    hint2: L3("Raqamni toping va koddagi o'sha qatorni bosing.", 'Найди число и нажми эту строку в коде.', 'Find the number and tap that line in the code.'),
    ok: L3("Ajoyib! Operator xatolarini ham topa olasiz.", 'Здорово! Ты находишь и ошибки в операторах.', 'Awesome! You can find operator mistakes too.')
  },
  s15: {
    eyebrow: L3('Jami narx', 'Итоговая цена', 'The total'),
    say: L3("Uchta qilich, har biri yigirma besh tanga. Jami narxni hisoblang: price va count qutilari bilan ifoda yozing.",
      'Три меча, каждый по двадцать пять монет. Посчитай итоговую цену: напиши выражение с коробками price и count.',
      'Three swords, twenty-five coins each. Work out the total: write an expression with the price and count boxes.'),
    ask: L3("Jami narxni price va count bilan hisoblang", 'Посчитай итог через price и count', 'Work out the total with price and count'),
    msgs: {
      empty: L3("Bo'sh joyga ifoda yozing.", 'Впиши выражение в пропуск.', 'Type an expression into the gap.'),
      names: L3("Javob to'g'ri, lekin raqamlarni emas, quti nomlarini yozing: price va count.", 'Ответ верный, но пиши не числа, а имена коробок: price и count.', 'The answer is right, but write the box names, not the numbers: price and count.'),
      value: L3("Qutiga {got} tushdi. Har bir qilich yigirma besh, ular uchta: qaysi belgi kerak?", 'В коробку попало {got}. Каждый меч двадцать пять, их три: какой знак нужен?', '{got} landed in the box. Each sword is twenty-five and there are three: which sign is needed?'),
      name: L3("Bunday quti yo'q. Nomlar: price va count, kichik harflar bilan.", 'Такой коробки нет. Имена: price и count, маленькими буквами.', 'There’s no such box. The names are price and count, in lowercase.'),
      syntax: L3("JavaScript buni tushunmadi. Shakl: quti nomi, belgi, quti nomi.", 'JavaScript не понял. Форма: имя коробки, знак, имя коробки.', 'JavaScript didn’t understand. The shape: box name, sign, box name.')
    },
    hints: [
      L3("Narx va son: ularni ko'paytirish kerak.", 'Цена и количество: их нужно умножить.', 'Price and count: they need to be multiplied.'),
      L3("price, yulduzcha, count.", 'price, звёздочка, count.', 'price, star, count.'),
      L3("Namunani ko'chirib yozing.", 'Перепиши образец.', 'Copy the example.')
    ],
    ok: L3("Zo'r! Yetmish besh tanga. Narx o'zgarsa ham, ifoda o'zi qayta hisoblaydi!", 'Супер! Семьдесят пять монет. Даже если цена изменится, выражение пересчитает само!', 'Awesome! Seventy-five coins. Even if the price changes, the expression recalculates by itself!')
  },
  s16: {
    eyebrow: L3('Boss jangi', 'Бой с боссом', 'Boss fight'),
    say: L3("Bossda yuz jon bor. Zarba kuchi va zarbalar sonini yozing, shunda boss yengilsin: oxirgi qatorda false chiqsin, ya'ni boss tirik emas degani.",
      'У босса сто жизней. Впиши силу удара и число ударов так, чтобы босс был побеждён: в последней строке должно выйти false — босс больше не жив.',
      'The boss has a hundred health. Type the hit power and the number of hits so the boss is defeated: the last line must show false, meaning the boss isn’t alive.'),
    ask: L3("Bossni yenging: oxirida false chiqsin", 'Победи босса: в конце должно выйти false', 'Defeat the boss: false at the end'),
    ph: [L3('kuch', 'сила', 'power'), L3('son', 'число', 'number')],
    msgs: {
      empty: L3("Ikkala bo'sh joyni to'ldiring.", 'Заполни оба пропуска.', 'Fill in both gaps.'),
      num: L3("Faqat raqamlar yozing, qo'shtirnoqsiz.", 'Пиши только цифры, без кавычек.', 'Type digits only, without quotes.'),
      alive: L3("Boss hali tirik: unda {hp} jon qoldi. Kuch yoki zarbalar sonini oshiring.", 'Босс ещё жив: у него осталось {hp}. Увеличь силу или число ударов.', 'The boss is still alive: {hp} health left. Increase the power or the number of hits.')
    },
    hints: [
      L3("Zarba kuchi karra zarbalar soni yuzdan kam bo'lmasin.", 'Сила удара на число ударов должно быть не меньше ста.', 'Hit power times number of hits must be at least a hundred.'),
      L3("Masalan, yigirma beshtadan to'rt marta.", 'Например, по двадцать пять четыре раза.', 'For example, twenty-five, four times.'),
      L3("Birinchi joyga 25, ikkinchisiga 4 yozing.", 'Впиши 25 в первый пропуск и 4 во второй.', 'Type 25 in the first gap and 4 in the second.')
    ],
    ok: L3("G'alaba! Bossning joni nolga tushdi, false: boss yengildi!", 'Победа! Жизни босса упали до нуля, false — босс побеждён!', 'Victory! The boss’s health hit zero, false: the boss is defeated!')
  },
  s17: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Kichik tekshiruv. Har bir gap to'g'rimi yoki noto'g'rimi? Bosing.", 'Маленькая проверка. Каждое утверждение верно или нет? Нажимай.', 'A little check. Is each statement true or false? Tap.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или нет?', 'True or false?'),
    rounds: [
      { q: L3("2 + 3 * 4 natijasi 20.", '2 + 3 * 4 даёт 20.', '2 + 3 * 4 gives 20.'), a: false, why: L3("Yo'q, ko'paytirish oldin: o'n to'rt.", 'Нет, умножение первым: четырнадцать.', 'No, multiplication first: fourteen.') },
      { q: L3("Solishtirish javobi true yoki false bo'ladi.", 'Ответ сравнения — true или false.', 'A comparison answers true or false.'), a: true, why: L3("Ha, bu boolean.", 'Да, это boolean.', 'Yes, it’s a boolean.') },
      { q: L3("Bitta teng belgisi ikki narsani solishtiradi.", 'Один знак равно сравнивает две вещи.', 'One equals sign compares two things.'), a: false, why: L3("Yo'q, u qutiga soladi. Solishtirish uchun uchta teng.", 'Нет, он кладёт в коробку. Сравнивают три знака равно.', 'No, it puts into a box. Comparing takes three.') },
      { q: L3('"5" === 5 natijasi false.', '"5" === 5 даёт false.', '"5" === 5 gives false.'), a: true, why: L3("Ha, turlari har xil.", 'Да, типы разные.', 'Yes, the types differ.') },
      { q: L3("Ko'paytirish x harfi bilan yoziladi.", 'Умножение пишут буквой x.', 'Multiplication is written with the letter x.'), a: false, why: L3("Yo'q, yulduzcha bilan.", 'Нет, звёздочкой.', 'No, with a star.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Darsda ko'rganlaringiz esingizdami?", 'Вспомни, что было на уроке.', 'Remember what you saw in the lesson.'),
    hint2: L3("Ko'paytirish oldin, solishtirish true yoki false, bitta teng soladi, uchta teng solishtiradi.", 'Умножение первым, сравнение даёт true или false, один знак равно кладёт, три — сравнивают.', 'Multiply first, comparisons give true or false, one equals puts in, three compare.'),
    ok: L3("Ajoyib! Siz operatorlarni bilasiz.", 'Отлично! Ты знаешь операторы.', 'Excellent! You know the operators.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men ikki plyus uch ko'paytirish to'rt yigirma degandim? Xato qilibman! Ko'paytirish oldin bajariladi: o'n to'rt. Yigirma faqat qavs bilan chiqadi.",
        'Помнишь, я говорил, что два плюс три умножить на четыре — двадцать? Я ошибся! Умножение выполняется первым: четырнадцать. Двадцать выйдет только со скобками.',
        'Remember when I said two plus three times four is twenty? I was wrong! Multiplication goes first: fourteen. Twenty only comes with brackets.') },
      { k: 'math', text: L3("Plyus, minus, yulduzcha va qiya chiziq bilan JavaScript hisoblaydi.", 'С плюсом, минусом, звёздочкой и косой чертой JavaScript считает.', 'With plus, minus, star and slash, JavaScript calculates.') },
      { k: 'cmp', text: L3("Katta va kichik belgilari solishtiradi va true yoki false beradi.", 'Знаки «больше» и «меньше» сравнивают и дают true или false.', 'Greater-than and less-than compare and give true or false.') },
      { k: 'eq', text: L3("Uchta teng belgisi tenglikni tekshiradi, bitta teng esa qutiga soladi.", 'Три знака равно проверяют равенство, а один — кладёт в коробку.', 'Three equals signs check equality, while one puts into a box.') },
      { k: null, text: L3("Barakalla! Endi JavaScript siz uchun hisoblaydi va solishtiradi. Keyingi darsda shartlar: true yoki false ga qarab, dastur o'zi qaror qiladi!",
        'Ура! Теперь JavaScript считает и сравнивает для тебя. На следующем уроке — условия: по true или false программа сама принимает решение!',
        'Hooray! Now JavaScript calculates and compares for you. Next lesson: conditions, the program decides by itself based on true or false!') }
    ],
    ask: L3("Operatorlar: hisob va solishtirish", 'Операторы: счёт и сравнение', 'Operators: math and comparison'),
    roles: { riddle: L3("Ko'paytirish plyusdan oldin", 'Умножение раньше плюса', 'Multiply before plus'), math: L3('+ - * /', '+ - * /', '+ - * /'),
      cmp: L3('> <  →  true / false', '> <  →  true / false', '> <  →  true / false'), eq: L3('===  tengmi?', '===  равно?', '===  equal?') }
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, right: 1, rounds: 1, ok: 1, wrong: 1, msgs: 1, works: 1, riddle: 1, poor: 1, buy: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { q: 1, a: 1, v: 1, code: 1, opts: 1, lines: 1, bad: 1, want: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:j4-engine.jsx@*/

/*@FILE:j4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css1/c1.css@*/
/*@FILE:../js1/j1.css@*/
/*@FILE:../js2/j2.css@*/
/*@FILE:../js3/j3.css@*/
/*@FILE:j4.css@*/
`;
