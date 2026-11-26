// =============================================================================
// КУРС «JAVASCRIPT» · Урок 5 — «Условия — 1 часть» (26.11.2026, заказчик: «делай следующий урок js»).
// Облик «Редактор», как уроки 1–4. Дети 11–14, проходят сами. Страницы в браузере нет (до DOM): «Память», консоль,
// «Расчёт» и новое — выполнение по шагам с ветками: строка if показывает true / false, пропущенная ветка гаснет.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/js5/build.mjs → lessons/javascript/05-usloviya-1.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · «Условия — 1 часть» · модуль js-m1 =====
//
// ЗАМЫСЕЛ. В игре Коди есть таинственная дверь: она открывается, только если есть ключ. Программа сама решает, какой
// путь выбрать: if (условие) { … } else { … }. Ученик видит, как JavaScript считает условие (true / false), заходит
// в один блок и пропускает другой.
// Загадка: Коди уверен, что при false (и без else) программа останавливается; разгадка — пропускается только блок,
// строки после него работают всегда.
// Дуга (18): крючок «дверь и ключ» → показ if → будет ли сообщение → собери if → напиши условие → показ else →
// какое сообщение → число для else → показ условий (коробка true, пароль) → пароль → показ «после блока» (разгадка) →
// какие строки выполнятся → найди строку → исправь = на === → выбери условие → своя дверь → верно или нет → вывод.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'js-05-usloviya-1',
  module: 'js-m1',
  lessonTitle: {
    uz: '5-dars. Shartlar: 1-qism',
    ru: 'Урок 5. Условия — 1 часть',
    en: 'Lesson 5. Conditions, part 1'
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
  runN: L3('Ishga tushirish', 'Запуск', 'Run'),
  takeKey: L3('Kalitni olish', 'Взять ключ', 'Take the key'),
  haveKey: L3('Kalit sizda', 'Ключ у тебя', 'Key taken'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  yes: L3("To'g'ri", 'Верно', 'True'),
  no: L3("Noto'g'ri", 'Неверно', 'False'),
  err: L3('Xato', 'Ошибка', 'Error'),
  mem: L3('Xotira', 'Память', 'Memory'),
  memEmpty: L3("Hozircha quti yo'q", 'Пока нет ни одной коробки', 'No boxes yet'),
  conEmpty: L3("Konsol hozircha bo'sh", 'Консоль пока пуста', 'The console is empty for now'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Shartlar: 2-qism', 'Условия — 2 часть', 'Conditions, part 2'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  types: { string: L3('matn', 'текст', 'text'), number: L3('son', 'число', 'number'), boolean: L3("ha / yo'q", 'да / нет', 'yes / no') }
};

const YES_NO = L3(['Ha, chiqadi', "Yo'q, chiqmaydi"], ['Да, появится', 'Нет, не появится'], ['Yes, it will', "No, it won't"]);
const BOTH_NO = L3("Ikkalasi hech qachon chiqmaydi: yo if ishlaydi, yo else, faqat bittasi.", 'Оба не появятся никогда: работает либо if, либо else, только один.', 'Both never appear: either if runs or else does, only one.');

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, msgs, hints, help, why, right, wrong, no …; печатаются: eyebrow, ask, q, code, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Sirli eshik', 'Таинственная дверь', 'The mysterious door'),
    code: L3(['if (hasKey) {', '  console.log("Eshik ochildi!");', '} else {', '  console.log("Kalit kerak");', '}'],
      ['if (hasKey) {', '  console.log("Дверь открыта!");', '} else {', '  console.log("Нужен ключ");', '}'],
      ['if (hasKey) {', '  console.log("The door is open!");', '} else {', '  console.log("You need a key");', '}']),
    say: L3("Salom! O'yinimda sirli eshik bor. Kodga qarang: hasKey qutisida false, ya'ni kalit yo'q degani. Kodni ishga tushiring: eshik nima deydi?",
      'Привет! В моей игре есть таинственная дверь. Смотри на код: в коробке hasKey лежит false, то есть ключа нет. Запусти код: что скажет дверь?',
      'Hi! There’s a mysterious door in my game. Look at the code: the hasKey box holds false, meaning there’s no key. Run the code: what will the door say?'),
    locked: L3("Eshik yopiq qoldi: konsolda Kalit kerak. Qarang, birinchi xabar qatori o'chib qoldi, JavaScript uni o'tkazib yubordi. Endi kalitni oling.",
      'Дверь закрыта: в консоли «Нужен ключ». Смотри: первая строка с сообщением погасла, JavaScript её пропустил. Теперь возьми ключ.',
      'The door stayed shut: the console says You need a key. Look: the first message line went grey, JavaScript skipped it. Now take the key.'),
    took: L3("Kalit sizda! Birinchi qatorga qarang: endi hasKey qutisida true. Yana ishga tushiring.", 'Ключ у тебя! Смотри на первую строку: теперь в hasKey лежит true. Запусти ещё раз.', 'You’ve got the key! Look at the first line: now hasKey holds true. Run it again.'),
    works: L3("Eshik ochildi! Kod o'sha-o'sha, faqat qutidagi qiymat o'zgardi, dastur esa boshqa yo'ldan ketdi. Bu if, ya'ni agar degani: dastur shartga qarab o'zi qaror qiladi.",
      'Дверь открылась! Код тот же, изменилось только значение в коробке, а программа пошла другим путём. Это if, то есть «если»: программа сама решает по условию.',
      'The door opened! The code is the same, only the value in the box changed, yet the program took a different path. This is if: the program decides by itself based on a condition.'),
    riddle: L3("Bugun shartlarni o'rganamiz. Lekin oldin topishmoq. Menimcha, shart false bo'lsa va else yo'q bo'lsa, dastur shu joyda to'xtaydi: pastdagi qatorlar endi ishlamaydi. Men haqmanmi? Dars davomida bilib olamiz.",
      'Сегодня изучаем условия. Но сначала загадка. По-моему, если условие false и else нет, программа останавливается прямо там: строки ниже больше не работают. Прав ли я? Узнаем по ходу урока.',
      'Today we learn conditions. But first, a riddle. I think if the condition is false and there’s no else, the program stops right there: the lines below don’t run anymore. Am I right? We’ll find out during the lesson.'),
    ask: L3('Kodni ishga tushiring', 'Запусти код', 'Run the code'),
    askKey: L3('Kalitni oling', 'Возьми ключ', 'Take the key'),
    askAgain: L3('Yana ishga tushiring', 'Запусти ещё раз', 'Run it again'),
    askDone: L3("Topishmoq: shart false bo'lsa, dastur to'xtaydimi?", 'Загадка: если условие false, программа останавливается?', 'Riddle: if the condition is false, does the program stop?')
  },
  s2: {
    eyebrow: L3('if — agar', 'if — «если»', 'if'),
    say: L3("Keling, if qanday ishlashini sekin ko'ramiz. Kod ikki marta ishga tushadi: oldin tanga ko'p, keyin oz.",
      'Давай медленно посмотрим, как работает if. Код запустится дважды: сначала монет много, потом мало.',
      'Let’s slowly see how if works. The code runs twice: first with lots of coins, then with few.'),
    steps: [
      L3("if dan keyin qavs ichida shart turadi, ya'ni savol degani: tanga yuzdan ko'pmi? Hisob qatoriga qarang: bir yuz yigirma yuzdan katta, javob true.",
        'После if в круглых скобках стоит условие — это вопрос: монет больше ста? Смотри на «Расчёт»: сто двадцать больше ста, ответ true.',
        'After if, the condition sits in round brackets: it’s a question, are there more than a hundred coins? Look at the Calculation: a hundred and twenty is greater than a hundred, the answer is true.'),
      L3("Shart true bo'lgani uchun JavaScript jingalak qavslar ichiga kirdi va xabarni chiqardi. Jingalak qavslar ichidagi qatorlar blok deyiladi.",
        'Условие true, поэтому JavaScript зашёл внутрь фигурных скобок и вывел сообщение. Строки внутри фигурных скобок называются блоком.',
        'The condition is true, so JavaScript went inside the curly braces and printed the message. The lines inside curly braces are called a block.'),
      L3("Endi tanga ellikta. Ellik yuzdan katta emas, javob false. JavaScript blokni o'tkazib yubordi: xabar chiqmadi, konsol bo'sh.",
        'Теперь монет пятьдесят. Пятьдесят не больше ста, ответ false. JavaScript пропустил блок: сообщения нет, консоль пуста.',
        'Now there are fifty coins. Fifty isn’t greater than a hundred, the answer is false. JavaScript skipped the block: no message, the console is empty.')
    ],
    help: [
      L3("Qavs ichidagi shartga va Hisob qatoriga qarang.", 'Смотри на условие в скобках и на «Расчёт».', 'Look at the condition in brackets and at the Calculation.'),
      L3("true bo'lsa, blok ishlaydi. false bo'lsa, blok o'tkazib yuboriladi.", 'true — блок выполняется. false — блок пропускается.', 'true: the block runs. false: the block is skipped.'),
      L3("Hayotda ham shunday: agar yomg'ir yog'sa, soyabon olaman. Yog'masa, olmayman.", 'В жизни так же: если идёт дождь, беру зонт. Не идёт — не беру.', 'Same in life: if it’s raining, I take an umbrella. If not, I don’t.')
    ],
    ask: L3('Kuzating: shart true yoki false?', 'Смотри: условие true или false?', 'Watch: is the condition true or false?'),
    askDone: L3("true: blok ishlaydi · false: o'tkazib yuboriladi", 'true — блок работает · false — пропускается', 'true: the block runs · false: it’s skipped')
  },
  s3: {
    eyebrow: L3('Xabar chiqadimi?', 'Будет сообщение?', 'Will there be a message?'),
    say: L3("Endi siz bashorat qiling. Kodga qarang: konsolda xabar chiqadimi yoki yo'qmi?", 'Теперь предскажи. Смотри на код: появится ли сообщение в консоли?', 'Now you predict. Look at the code: will a message appear in the console?'),
    ask: L3('Konsolda xabar chiqadimi?', 'Сообщение появится?', 'Will a message appear?'),
    rounds: [
      { code: L3(['let score = 80;', 'if (score > 50) {', '  console.log("Yulduz oldingiz!");', '}'], ['let score = 80;', 'if (score > 50) {', '  console.log("Звезда твоя!");', '}'], ['let score = 80;', 'if (score > 50) {', '  console.log("You got a star!");', '}']),
        opts: YES_NO, a: 0, why: L3("Sakson ellikdan katta, true: blok ishlaydi.", 'Восемьдесят больше пятидесяти, true: блок работает.', 'Eighty is greater than fifty, true: the block runs.') },
      { code: L3(['let lives = 0;', 'if (lives > 0) {', '  console.log("Yuguring!");', '}'], ['let lives = 0;', 'if (lives > 0) {', '  console.log("Беги!");', '}'], ['let lives = 0;', 'if (lives > 0) {', '  console.log("Run!");', '}']),
        opts: YES_NO, a: 1, why: L3("Nol noldan katta emas, false: blok o'tkazib yuboriladi.", 'Ноль не больше нуля, false: блок пропускается.', 'Zero isn’t greater than zero, false: the block is skipped.') },
      { code: L3(['let level = 3;', 'if (level === 3) {', '  console.log("Boss keldi!");', '}'], ['let level = 3;', 'if (level === 3) {', '  console.log("Пришёл босс!");', '}'], ['let level = 3;', 'if (level === 3) {', '  console.log("The boss is here!");', '}']),
        opts: YES_NO, a: 0, why: L3("Uch uchga teng, true: boss keldi.", 'Три равно трём, true: босс пришёл.', 'Three equals three, true: the boss is here.') },
      { code: L3(['let pin = "5";', 'if (pin === 5) {', '  console.log("Ochildi!");', '}'], ['let pin = "5";', 'if (pin === 5) {', '  console.log("Открыто!");', '}'], ['let pin = "5";', 'if (pin === 5) {', '  console.log("Unlocked!");', '}']),
        opts: YES_NO, a: 1, why: L3("Qo'shtirnoqdagi besh matn, qo'shtirnoqsiz besh esa son. Turlari har xil, false.", 'Пять в кавычках — текст, а пять без кавычек — число. Типы разные, false.', 'Five in quotes is text, five without quotes is a number. Different types, false.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Oldin shartni hisoblang: true yoki false?", 'Сначала посчитай условие: true или false?', 'First work out the condition: true or false?'),
    hint2: L3("true bo'lsa, xabar chiqadi. false bo'lsa, blok o'tkazib yuboriladi.", 'true — сообщение будет. false — блок пропускается.', 'true: the message appears. false: the block is skipped.'),
    ok: L3("Zo'r! Siz shartni xuddi JavaScript kabi o'qiyapsiz.", 'Супер! Ты читаешь условие как JavaScript.', 'Awesome! You read conditions just like JavaScript.')
  },
  s4: {
    eyebrow: L3("if ni yig'ing", 'Собери if', 'Build the if'),
    code: L3(['let score = 80;', 'if (score > 50) {', '  console.log("Yulduz oldingiz!");', '}'], ['let score = 80;', 'if (score > 50) {', '  console.log("Звезда твоя!");', '}'], ['let score = 80;', 'if (score > 50) {', '  console.log("You got a star!");', '}']),
    say: L3("Voy, qatorlar aralashib ketdi! Ularni to'g'ri tartibda bosing va if ni qayta yig'ing.", 'Ой, строки перепутались! Нажимай их в правильном порядке и собери if заново.', 'Oops, the lines got mixed up! Tap them in the right order and rebuild the if.'),
    ask: L3('Qatorlarni tartib bilan bosing', 'Нажимай строки по порядку', 'Tap the lines in order'),
    piece: [
      L3("Oldin quti kerak: if unga qaraydi. let bilan boshlanadigan qatorni toping.", 'Сначала нужна коробка: if будет на неё смотреть. Найди строку с let.', 'First you need the box: if will look at it. Find the line with let.'),
      L3("Endi savol: if va qavs ichida shart, oxirida ochuvchi jingalak qavs.", 'Теперь вопрос: if и условие в скобках, в конце открывающая фигурная скобка.', 'Now the question: if with the condition in brackets, ending with an opening curly brace.'),
      L3("Blok ichida nima bo'ladi? Xabar chiqaradigan qator.", 'Что внутри блока? Строка, которая выводит сообщение.', 'What goes inside the block? The line that prints the message.'),
      L3("Blokni yopish kerak: yopuvchi jingalak qavs.", 'Блок нужно закрыть: закрывающая фигурная скобка.', 'The block needs closing: the closing curly brace.')
    ],
    hints: [
      L3("Dastur tepadan pastga o'qiladi. Shartdan oldin nima bo'lishi kerak?", 'Программа читается сверху вниз. Что должно быть до условия?', 'A program reads top to bottom. What must come before the condition?'),
      L3("Tartib: quti, shart, blok ichi, yopuvchi qavs.", 'Порядок: коробка, условие, внутри блока, закрывающая скобка.', 'Order: box, condition, inside the block, closing brace.'),
      L3("Yonib turgan qatorni bosing.", 'Нажми подсвеченную строку.', 'Tap the highlighted line.')
    ],
    ok: L3("Barakalla! if yig'ildi va ishladi: sakson ellikdan katta, yulduz sizniki!", 'Ура! if собран и сработал: восемьдесят больше пятидесяти, звезда твоя!', 'Hooray! The if is built and it worked: eighty is greater than fifty, the star is yours!')
  },
  s5: {
    eyebrow: L3('Shartni yozing', 'Напиши условие', 'Write the condition'),
    say: L3("Yangi daraja faqat ochko yuzdan ko'p bo'lganda ochilsin. Qavs ichiga shu shartni yozing va ishga tushiring.", 'Новый уровень должен открываться, только когда очков больше ста. Впиши это условие в скобки и запусти.', 'The new level should open only when the score is above a hundred. Type that condition into the brackets and run it.'),
    ask: L3('Shart: score 100 dan katta', 'Условие: score больше 100', 'Condition: score greater than 100'),
    ph: L3('score …', 'score …', 'score …'),
    msgs: {
      empty: L3("Qavs ichiga shart yozing.", 'Впиши условие в скобки.', 'Type a condition into the brackets.'),
      syntax: L3("JavaScript buni tushunmadi. Shakl: quti nomi, belgi, son.", 'JavaScript не понял. Форма: имя коробки, знак, число.', 'JavaScript didn’t understand. The shape: box name, sign, number.'),
      name: L3("Bunday quti yo'q. Quti nomi score, kichik harflar bilan.", 'Такой коробки нет. Имя коробки — score, маленькими буквами.', 'There’s no such box. The box name is score, in lowercase.'),
      assign: L3("Bitta teng belgisi qutiga soladi, solishtirmaydi. Bu yerda katta belgisi kerak.", 'Один знак равно кладёт в коробку, а не сравнивает. Здесь нужен знак «больше».', 'One equals sign puts into a box, it doesn’t compare. Here you need the greater-than sign.'),
      noScore: L3("Shartda score qutisi bo'lishi kerak: biz ochkoni tekshiryapmiz.", 'В условии должна быть коробка score: мы проверяем очки.', 'The condition needs the score box: we’re checking the score.'),
      no100: L3("Ochkoni yuz bilan solishtiring.", 'Сравни очки со ста.', 'Compare the score with a hundred.'),
      dir: L3("Xabar chiqmadi: shart false bo'ldi. Belgi qaysi tomonga qaraganini tekshiring: score kattami?", 'Сообщения нет: условие получилось false. Проверь, куда смотрит знак: score больше?', 'No message: the condition came out false. Check which way the sign points: is score greater?'),
      always: L3("Ochko ellik bo'lsa ham daraja ochilyapti. Shart faqat ochko yuzdan ko'p bo'lganda true bo'lsin.", 'Уровень открывается, даже когда очков пятьдесят. Условие должно быть true, только когда очков больше ста.', 'The level opens even with a score of fifty. The condition must be true only when the score is above a hundred.')
    },
    hints: [
      L3("O'tgan darsdagi katta belgisi esingizdami?", 'Помнишь знак «больше» из прошлого урока?', 'Remember the greater-than sign from the last lesson?'),
      L3("score, katta belgisi, yuz.", 'score, знак «больше», сто.', 'score, the greater-than sign, a hundred.'),
      L3("Namunani ko'chirib yozing.", 'Перепиши образец.', 'Copy the example.')
    ],
    ok: L3("Zo'r! Bir yuz ellik yuzdan katta: yangi daraja ochildi. Ochko ellik bo'lsa, daraja yopiq qolardi.", 'Супер! Сто пятьдесят больше ста: новый уровень открыт. При пятидесяти очках он остался бы закрыт.', 'Awesome! A hundred and fifty is greater than a hundred: the new level is open. With fifty, it would stay locked.')
  },
  s6: {
    eyebrow: L3('else — aks holda', 'else — «иначе»', 'else means otherwise'),
    say: L3("if bilan bitta yo'l bor edi. Shart false bo'lganda boshqa ish qilish kerak bo'lsa-chi? Buning uchun else bor.", 'С if был один путь. А если при false нужно сделать что-то другое? Для этого есть else.', 'With if there was one path. What if something else should happen when it’s false? That’s what else is for.'),
    steps: [
      L3("Jon nolta. Nol noldan katta emas: false.", 'Жизней ноль. Ноль не больше нуля: false.', 'Zero lives. Zero isn’t greater than zero: false.'),
      L3("Shart false bo'lgani uchun JavaScript birinchi blokni o'tkazib yubordi va else blokiga o'tdi: Game over. else, ya'ni aks holda degani.", 'Условие false, поэтому JavaScript пропустил первый блок и перешёл в блок else: Game over. else значит «иначе».', 'The condition is false, so JavaScript skipped the first block and went to the else block: Game over. else means otherwise.'),
      L3("Endi ikki jon: shart true. Birinchi blok ishladi, else esa o'tkazib yuborildi. Ikki yo'ldan har doim faqat bittasi ishlaydi.", 'Теперь две жизни: условие true. Сработал первый блок, а else пропущен. Из двух путей всегда работает только один.', 'Now two lives: the condition is true. The first block ran, and else was skipped. Of the two paths, only one ever runs.')
    ],
    help: [
      L3("Qaysi blok yondi, qaysi biri o'chdi? Qarang.", 'Смотри, какой блок загорелся, а какой погас.', 'See which block lit up and which went grey.'),
      L3("true bo'lsa, if bloki. false bo'lsa, else bloki.", 'true — блок if. false — блок else.', 'true: the if block. false: the else block.'),
      L3("Hayotda: agar qorningiz och bo'lsa, ovqatlanasiz, aks holda o'ynaysiz.", 'В жизни: если хочется есть — обед, иначе — игра.', 'In life: if you’re hungry, you eat; otherwise, you play.')
    ],
    ask: L3('Kuzating: qaysi blok ishlaydi?', 'Смотри: какой блок сработает?', 'Watch: which block runs?'),
    askDone: L3('true: if bloki · false: else bloki', 'true — блок if · false — блок else', 'true: the if block · false: the else block')
  },
  s7: {
    eyebrow: L3('Qaysi xabar?', 'Какое сообщение?', 'Which message?'),
    say: L3("Endi else bilan. Konsolda qaysi xabar chiqadi? Yaxshilab hisoblang.", 'Теперь с else. Какое сообщение появится в консоли? Посчитай внимательно.', 'Now with else. Which message will appear in the console? Work it out carefully.'),
    ask: L3('Konsolda qaysi xabar chiqadi?', 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: L3(['let coins = 70;', 'if (coins > 50) {', '  console.log("Qilich sizniki!");', '} else {', '  console.log("Tanga yetmaydi");', '}'], ['let coins = 70;', 'if (coins > 50) {', '  console.log("Меч твой!");', '} else {', '  console.log("Монет не хватает");', '}'], ['let coins = 70;', 'if (coins > 50) {', '  console.log("The sword is yours!");', '} else {', '  console.log("Not enough coins");', '}']),
        opts: L3(['Qilich sizniki!', 'Tanga yetmaydi', 'Ikkalasi ham'], ['Меч твой!', 'Монет не хватает', 'Оба'], ['The sword is yours!', 'Not enough coins', 'Both']), a: 0, no: { 2: BOTH_NO },
        why: L3("Yetmish ellikdan katta, true: if bloki.", 'Семьдесят больше пятидесяти, true: блок if.', 'Seventy is greater than fifty, true: the if block.') },
      { code: L3(['let hasKey = false;', 'if (hasKey) {', '  console.log("Eshik ochildi!");', '} else {', '  console.log("Kalit kerak");', '}'], ['let hasKey = false;', 'if (hasKey) {', '  console.log("Дверь открыта!");', '} else {', '  console.log("Нужен ключ");', '}'], ['let hasKey = false;', 'if (hasKey) {', '  console.log("The door is open!");', '} else {', '  console.log("You need a key");', '}']),
        opts: L3(['Eshik ochildi!', 'Kalit kerak', 'Ikkalasi ham'], ['Дверь открыта!', 'Нужен ключ', 'Оба'], ['The door is open!', 'You need a key', 'Both']), a: 1, no: { 2: BOTH_NO },
        why: L3("hasKey qutisida false: else bloki ishlaydi.", 'В hasKey лежит false: работает блок else.', 'hasKey holds false: the else block runs.') },
      { code: L3(['let time = 20;', 'if (time < 18) {', '  console.log("Kunduz");', '} else {', '  console.log("Kechqurun");', '}'], ['let time = 20;', 'if (time < 18) {', '  console.log("День");', '} else {', '  console.log("Вечер");', '}'], ['let time = 20;', 'if (time < 18) {', '  console.log("Day");', '} else {', '  console.log("Evening");', '}']),
        opts: L3(['Kunduz', 'Kechqurun', 'Ikkalasi ham'], ['День', 'Вечер', 'Оба'], ['Day', 'Evening', 'Both']), a: 1, no: { 2: BOTH_NO },
        why: L3("Yigirma o'n sakkizdan kichik emas, false: else bloki.", 'Двадцать не меньше восемнадцати, false: блок else.', 'Twenty isn’t less than eighteen, false: the else block.') },
      { code: L3(['let answer = 12;', 'if (answer === 3 * 4) {', '  console.log("To\'g\'ri!");', '} else {', '  console.log("Xato");', '}'], ['let answer = 12;', 'if (answer === 3 * 4) {', '  console.log("Верно!");', '} else {', '  console.log("Ошибка");', '}'], ['let answer = 12;', 'if (answer === 3 * 4) {', '  console.log("Correct!");', '} else {', '  console.log("Wrong");', '}']),
        opts: L3(["To'g'ri!", 'Xato', 'Ikkalasi ham'], ['Верно!', 'Ошибка', 'Оба'], ['Correct!', 'Wrong', 'Both']), a: 0, no: { 2: BOTH_NO },
        why: L3("Oldin uch karra to'rt: o'n ikki. O'n ikki o'n ikkiga teng, true.", 'Сначала три на четыре — двенадцать. Двенадцать равно двенадцати, true.', 'First three times four: twelve. Twelve equals twelve, true.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Oldin shartni hisoblang. Keyin qaysi blokka borishini ayting.", 'Сначала посчитай условие. Потом реши, в какой блок идти.', 'First work out the condition. Then decide which block to go to.'),
    hint2: L3("true bo'lsa, birinchi xabar. false bo'lsa, else dagi xabar.", 'true — первое сообщение. false — сообщение из else.', 'true: the first message. false: the message in else.'),
    ok: L3("Ajoyib! Siz ikki yo'ldan to'g'risini tanlaysiz.", 'Отлично! Ты выбираешь верный путь из двух.', 'Excellent! You pick the right path of the two.')
  },
  s8: {
    eyebrow: L3('Teskarisi', 'Наоборот', 'The other way round'),
    say: L3("Endi teskarisi. Konsolda Tanga yetmaydi chiqishi kerak. Qutiga qancha tanga yozsangiz, else ishlaydi?", 'Теперь наоборот. В консоли должно появиться «Монет не хватает». Сколько монет вписать, чтобы сработал else?', 'Now the other way round. The console must show Not enough coins. How many coins should you type so else runs?'),
    ask: L3("Konsolda «Tanga yetmaydi» chiqsin", 'Пусть в консоли будет «Монет не хватает»', 'Make the console show “Not enough coins”'),
    ph: L3('son', 'число', 'number'),
    msgs: {
      empty: L3("Qutiga son yozing.", 'Впиши число в коробку.', 'Type a number into the box.'),
      num: L3("Faqat raqamlar yozing, qo'shtirnoqsiz.", 'Пиши только цифры, без кавычек.', 'Type digits only, without quotes.'),
      ifRan: L3("Shart true bo'ldi, if bloki ishladi. Siz yozgan son ellikdan katta: {v}.", 'Условие стало true, сработал блок if. Твоё число больше пятидесяти: {v}.', 'The condition came out true, the if block ran. Your number is greater than fifty: {v}.')
    },
    hints: [
      L3("else qachon ishlaydi? Shart false bo'lganda.", 'Когда работает else? Когда условие false.', 'When does else run? When the condition is false.'),
      L3("Ellikdan katta bo'lmagan son yozing.", 'Впиши число, которое не больше пятидесяти.', 'Type a number that isn’t greater than fifty.'),
      L3("Masalan, yigirma yozing.", 'Например, впиши двадцать.', 'For example, type twenty.')
    ],
    ok: L3("Zo'r! Shart false bo'ldi, JavaScript else ga o'tdi: Tanga yetmaydi.", 'Супер! Условие стало false, и JavaScript перешёл в else: «Монет не хватает».', 'Awesome! The condition became false, and JavaScript went to else: Not enough coins.')
  },
  s9: {
    eyebrow: L3("Shart qanday bo'ladi", 'Каким бывает условие', 'What a condition can be'),
    say: L3("Shart faqat katta yoki kichik emas. Qavs ichida true yoki false beradigan har qanday narsa bo'lishi mumkin. Ikkita misolni ko'ramiz.", 'Условие — это не только «больше» или «меньше». В скобках может быть всё, что даёт true или false. Посмотрим два примера.', 'A condition isn’t only greater or less than. Anything that gives true or false can go in the brackets. Let’s see two examples.'),
    steps: [
      L3("Birinchisi oddiy: qavs ichida hasKey qutisining o'zi. Unda true bor, demak shart true.", 'Первый простой: в скобках сама коробка hasKey. В ней true, значит, условие true.', 'The first is simple: the hasKey box itself is in the brackets. It holds true, so the condition is true.'),
      L3("Blok ishladi: eshik ochildi. true yoki false saqlaydigan qutini to'g'ridan-to'g'ri shart qilib yozsa bo'ladi.", 'Блок сработал: дверь открыта. Коробку с true или false можно сразу писать условием.', 'The block ran: the door is open. A box holding true or false can be written as the condition directly.'),
      L3("Ikkinchisi parol. Uchta teng belgisi tekshiradi: parol mos keladimi? Hisob qatoriga qarang: false! Qutida kichik k harfi, shartda esa katta K.", 'Второй — пароль. Три знака равно проверяют, совпадает ли пароль. Смотри на «Расчёт»: false! В коробке маленькая k, а в условии большая K.', 'The second is a password. Three equals signs check whether the password matches. Look at the Calculation: false! The box has a small k, but the condition has a capital K.'),
      L3("Shuning uchun else ishladi: Parol xato. JavaScript uchun katta va kichik harflar har xil.", 'Поэтому сработал else: «Неверный пароль». Для JavaScript большие и маленькие буквы разные.', 'That’s why else ran: Wrong password. To JavaScript, capital and small letters are different.')
    ],
    help: [
      L3("Qavs ichida nima turibdi? Uning javobi true yoki false.", 'Что стоит в скобках? Его ответ — true или false.', 'What’s in the brackets? Its answer is true or false.'),
      L3("Shart bo'lishi mumkin: true yoki false qutisi, solishtirish, uchta teng.", 'Условием может быть: коробка с true или false, сравнение, три знака равно.', 'A condition can be: a box with true or false, a comparison, three equals signs.'),
      L3("Telefon paroli ham shunday: bitta harf noto'g'ri bo'lsa, ochilmaydi.", 'С паролем на телефоне так же: одна неверная буква — и не открывается.', 'A phone password works the same: one wrong letter and it won’t open.')
    ],
    ask: L3('Kuzating: qavs ichida nima bor?', 'Смотри: что стоит в скобках?', 'Watch: what’s in the brackets?'),
    askDone: L3('Shart: true yoki false beradigan narsa', 'Условие — всё, что даёт true или false', 'A condition: anything that gives true or false')
  },
  s10: {
    eyebrow: L3('Parol', 'Пароль', 'Password'),
    say: L3("Endi eshikni siz oching. Qutiga shunday parol yozingki, shart true bo'lsin va eshik ochilsin.", 'Теперь открой дверь. Впиши в коробку такой пароль, чтобы условие стало true и дверь открылась.', 'Now you open the door. Type a password into the box so the condition becomes true and the door opens.'),
    ask: L3("Eshikni oching: to'g'ri parolni yozing", 'Открой дверь: впиши верный пароль', 'Open the door: type the right password'),
    ph: L3('parol', 'пароль', 'password'),
    msgs: {
      empty: L3("Qo'shtirnoq ichiga parol yozing.", 'Впиши пароль в кавычки.', 'Type the password inside the quotes.'),
      caseM: L3("Oz qoldi! Lekin katta va kichik harflarni tekshiring: shartda K katta.", 'Почти! Но проверь большие и маленькие буквы: в условии K большая.', 'Almost! But check capital and small letters: the K in the condition is capital.'),
      space: L3("Ortiqcha bo'sh joy bor. Parol bo'sh joysiz bo'lishi kerak.", 'Есть лишний пробел. Пароль должен быть без пробелов.', 'There’s an extra space. The password must have no spaces.'),
      quote: L3("Qo'shtirnoq allaqachon bor. Ichiga faqat parolni yozing.", 'Кавычки уже есть. Впиши внутрь только пароль.', 'The quotes are already there. Type only the password inside.'),
      other: L3("Parol xato chiqdi. Shartga qarang: qutidagi matn u bilan harfma-harf bir xil bo'lishi kerak.", 'Вышло «Неверный пароль». Смотри на условие: текст в коробке должен совпасть с ним буква в букву.', 'It says Wrong password. Look at the condition: the text in the box must match it letter for letter.')
    },
    hints: [
      L3("Ikkinchi qatordagi shartda parol yozilgan.", 'Пароль написан в условии на второй строке.', 'The password is written in the condition on the second line.'),
      L3("Harfma-harf ko'chiring: katta K, keyin odi, keyin 2026.", 'Перепиши буква в букву: большая K, потом odi, потом 2026.', 'Copy it letter for letter: capital K, then odi, then 2026.'),
      L3("Namunani ko'chirib yozing.", 'Перепиши образец.', 'Copy the example.')
    ],
    ok: L3("Eshik ochildi! Matn harfma-harf bir xil, shart true.", 'Дверь открыта! Текст совпал буква в букву, условие true.', 'The door is open! The text matches letter for letter, the condition is true.')
  },
  s11: {
    eyebrow: L3('Blokdan keyin', 'После блока', 'After the block'),
    say: L3("Topishmoqni yechamiz. Shart false bo'lsa, dastur to'xtaydimi? Blokdan keyin yana bitta qator qo'shdim. Qarang.", 'Разгадаем загадку. Если условие false, программа останавливается? Я добавил после блока ещё одну строку. Смотри.', 'Let’s solve the riddle. If the condition is false, does the program stop? I added one more line after the block. Watch.'),
    steps: [
      L3("Tanga o'ttizta, o'ttiz yuzdan katta emas: false. Endi nima bo'ladi?", 'Монет тридцать, тридцать не больше ста: false. Что же будет?', 'Thirty coins, thirty isn’t greater than a hundred: false. So what happens?'),
      L3("Blok o'tkazib yuborildi, lekin yopuvchi jingalak qavsdan keyingi qator ishladi: Keyingi daraja. Dastur to'xtamadi! Men xato qilibman.", 'Блок пропущен, но строка после закрывающей скобки сработала: «Следующий уровень». Программа не остановилась! Я ошибся.', 'The block was skipped, but the line after the closing brace ran: Next level. The program didn’t stop! I was wrong.'),
      L3("Endi bir yuz ellik: oldin blok ichidagi sovg'a, keyin baribir keyingi daraja. Blokdan keyingi qator har doim ishlaydi.", 'Теперь сто пятьдесят: сначала подарок из блока, а потом всё равно следующий уровень. Строка после блока работает всегда.', 'Now a hundred and fifty: first the gift from the block, then the next level anyway. The line after the block always runs.')
    ],
    help: [
      L3("Oxirgi qatorga qarang: u blokdan tashqarida.", 'Смотри на последнюю строку: она вне блока.', 'Look at the last line: it’s outside the block.'),
      L3("Shart faqat blokni boshqaradi. Blokdan keyin dastur davom etadi.", 'Условие управляет только блоком. После блока программа идёт дальше.', 'The condition only controls the block. After the block, the program carries on.'),
      L3("Yo'lda ko'prik yopiq bo'lsa, uni aylanib o'tasiz, lekin yo'l davom etadi.", 'Если мост закрыт, его объезжают, но дорога продолжается.', 'If a bridge is closed, you go around it, but the road continues.')
    ],
    ask: L3('Kuzating: blokdan keyingi qator ishlaydimi?', 'Смотри: работает ли строка после блока?', 'Watch: does the line after the block run?'),
    askDone: L3('Blokdan keyingi qator har doim ishlaydi', 'Строка после блока работает всегда', 'The line after the block always runs')
  },
  s12: {
    eyebrow: L3('Qaysi qatorlar ishlaydi?', 'Какие строки сработают?', 'Which lines will run?'),
    say: L3("Endi JavaScript siz bo'lasiz. Bajariladigan qatorlarni belgilang va Tekshirish tugmasini bosing. Jingalak qavsli qatorlarni belgilash shart emas.", 'Теперь JavaScript — это ты. Отметь строки, которые выполнятся, и нажми «Проверить». Строки со скобками отмечать не нужно.', 'Now you are JavaScript. Mark the lines that will run and tap Check. You don’t need to mark the brace lines.'),
    ask: L3('Bajariladigan qatorlarni belgilang', 'Отметь строки, которые выполнятся', 'Mark the lines that will run'),
    rounds: [
      { code: L3(['let coins = 30;', 'if (coins > 100) {', '  console.log("Sovg\'a!");', '}', 'console.log("Keyingi daraja");'], ['let coins = 30;', 'if (coins > 100) {', '  console.log("Подарок!");', '}', 'console.log("Следующий уровень");'], ['let coins = 30;', 'if (coins > 100) {', '  console.log("A gift!");', '}', 'console.log("Next level");']),
        why: L3("Birinchi, ikkinchi va beshinchi: shart false, blok o'tkazib yuboriladi, undan keyingi qator esa ishlaydi.", 'Первая, вторая и пятая: условие false, блок пропускается, а строка после него работает.', 'Lines one, two and five: the condition is false, the block is skipped, and the line after it runs.') },
      { code: L3(['let lives = 2;', 'if (lives > 0) {', '  console.log("Yuguring!");', '} else {', '  console.log("Game over");', '}', 'console.log("Ochko: 120");'], ['let lives = 2;', 'if (lives > 0) {', '  console.log("Беги!");', '} else {', '  console.log("Game over");', '}', 'console.log("Очки: 120");'], ['let lives = 2;', 'if (lives > 0) {', '  console.log("Run!");', '} else {', '  console.log("Game over");', '}', 'console.log("Score: 120");']),
        why: L3("Birinchi, ikkinchi, uchinchi va yettinchi: shart true, if bloki ishlaydi, else o'tkazib yuboriladi, oxirgi qator esa har doim ishlaydi.", 'Первая, вторая, третья и седьмая: условие true, блок if работает, else пропускается, а последняя строка работает всегда.', 'Lines one, two, three and seven: the condition is true, the if block runs, else is skipped, and the last line always runs.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    extra: L3("Ortiqcha qator belgilangan: u o'tkazib yuboriladigan blok ichida. Shartni hisoblang.", 'Отмечена лишняя строка: она в блоке, который пропускается. Посчитай условие.', 'An extra line is marked: it’s inside a block that gets skipped. Work out the condition.'),
    miss: L3("Bitta qator yetishmayapti. Shart qatori ham bajariladi, ishlaydigan blok ichini ham unutmang.", 'Не хватает строки. Строка с условием тоже выполняется, и не забудь про блок, который сработает.', 'A line is missing. The condition line runs too, and don’t forget the block that will run.'),
    after: L3("Blokdan keyingi qatorni unutdingiz: u har doim ishlaydi.", 'Забыта строка после блока: она работает всегда.', 'You forgot the line after the block: it always runs.'),
    hint1: L3("Oldin shartni hisoblang: qaysi blok ishlaydi?", 'Сначала посчитай условие: какой блок сработает?', 'First work out the condition: which block will run?'),
    hint2: L3("Quti qatori, shart qatori, bitta blok va blokdan keyingi qator.", 'Строка с коробкой, строка с условием, один блок и строка после блока.', 'The box line, the condition line, one block, and the line after the block.'),
    ok: L3("Zo'r! Siz kodni xuddi JavaScript kabi bajaryapsiz.", 'Супер! Ты выполняешь код как JavaScript.', 'Awesome! You run code just like JavaScript.')
  },
  s13: {
    eyebrow: L3('Buzuq qatorni toping', 'Найди сломанную строку', 'Find the broken line'),
    say: L3("Bu kodlarda xato bor. Konsolga va Xotiraga qarang, buzuq qatorni bosing.", 'В этих кодах ошибки. Смотри на консоль и «Память», нажми сломанную строку.', 'These codes have bugs. Look at the console and the Memory, and tap the broken line.'),
    ask: L3('Buzuq qatorni bosing', 'Нажми сломанную строку', 'Tap the broken line'),
    rounds: [
      { lines: L3(['let coins = 120;', 'if coins > 100 {', '  console.log("Sovg\'a!");', '}'], ['let coins = 120;', 'if coins > 100 {', '  console.log("Подарок!");', '}'], ['let coins = 120;', 'if coins > 100 {', '  console.log("A gift!");', '}']), bad: 1,
        why: L3("Shart qavs ichida bo'lishi kerak. Konsol ham ikkinchi qatorni ko'rsatyapti.", 'Условие должно стоять в скобках. Консоль тоже указывает на вторую строку.', 'The condition must be in brackets. The console points to line two as well.') },
      { lines: L3(['let level = 3;', 'If (level === 3) {', '  console.log("Boss keldi!");', '}'], ['let level = 3;', 'If (level === 3) {', '  console.log("Пришёл босс!");', '}'], ['let level = 3;', 'If (level === 3) {', '  console.log("The boss is here!");', '}']), bad: 1,
        why: L3("If katta harf bilan yozilgan. JavaScript faqat kichik harfli if ni taniydi.", 'If написан с большой буквы. JavaScript знает только if маленькими буквами.', 'If is written with a capital letter. JavaScript only knows if in lowercase.') },
      { lines: L3(['let lives = 3;', 'if (lives = 0) {', '  console.log("Game over");', '} else {', '  console.log("Davom eting");', '}', 'console.log(lives);'], ['let lives = 3;', 'if (lives = 0) {', '  console.log("Game over");', '} else {', '  console.log("Играй дальше");', '}', 'console.log(lives);'], ['let lives = 3;', 'if (lives = 0) {', '  console.log("Game over");', '} else {', '  console.log("Keep playing");', '}', 'console.log(lives);']), bad: 1,
        ask: L3("Xato yo'q, lekin lives nolga aylandi. Qaysi qator aybdor?", 'Ошибки нет, но lives стало нулём. Какая строка виновата?', 'No error, but lives became zero. Which line is to blame?'),
        hint1: L3("Xotiradagi lives qutisiga qarang: unga nolni kim soldi?", 'Смотри на коробку lives в «Памяти»: кто положил туда ноль?', 'Look at the lives box in the Memory: who put zero in it?'),
        why: L3("Shartda bitta teng belgisi: u solishtirmaydi, qutiga nol soladi. Solishtirish uchun uchta teng kerak.", 'В условии один знак равно: он не сравнивает, а кладёт ноль в коробку. Для сравнения нужно три.', 'The condition has one equals sign: it doesn’t compare, it puts zero into the box. Comparing takes three.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    wrong: L3("Bu qator joyida. Konsol va Xotiraga yana qarang.", 'Эта строка в порядке. Посмотри ещё раз на консоль и «Память».', 'This line is fine. Look at the console and the Memory again.'),
    hint1: L3("Konsoldagi qizil xabar oxirida qator raqami bor.", 'В конце красного сообщения в консоли есть номер строки.', 'The red message in the console ends with a line number.'),
    hint2: L3("Shart qatorlarini tekshiring: qavslar, kichik harf, uchta teng.", 'Проверь строки с условием: скобки, маленькие буквы, три знака равно.', 'Check the condition lines: brackets, lowercase, three equals signs.'),
    ok: L3("Ajoyib! Endi if dagi xatolar sizdan yashirina olmaydi.", 'Отлично! Теперь ошибки в if от тебя не спрячутся.', 'Excellent! Now bugs in an if can’t hide from you.')
  },
  s14: {
    eyebrow: L3('Tuzating', 'Исправь', 'Fix it'),
    say: L3("Mana o'sha xato kod: jon uchta edi, lekin shart uni nolga aylantirdi. Shartni tuzating: lives nolga tengmi, deb so'rasin.", 'Вот тот самый ошибочный код: жизней было три, а условие превратило их в ноль. Исправь условие: пусть оно спрашивает, равно ли lives нулю.', 'Here’s that buggy code: there were three lives, but the condition turned them into zero. Fix the condition: make it ask whether lives equals zero.'),
    ask: L3("Shartni tuzating: lives nolga tengmi?", 'Исправь условие: lives равно нулю?', 'Fix the condition: does lives equal zero?'),
    msgs: {
      empty: L3("Qavs ichiga shart yozing.", 'Впиши условие в скобки.', 'Type a condition into the brackets.'),
      still: L3("Hali ham bitta teng belgisi: u qutiga soladi. Solishtirish uchun uchta teng yozing.", 'Всё ещё один знак равно: он кладёт в коробку. Для сравнения напиши три.', 'Still one equals sign: it puts into the box. Write three to compare.'),
      keep: L3("Shart lives nolga tengmi, deb so'rashi kerak: lives, uchta teng, nol.", 'Условие должно спрашивать, равно ли lives нулю: lives, три знака равно, ноль.', 'The condition must ask whether lives equals zero: lives, three equals signs, zero.'),
      syntax: L3("JavaScript buni tushunmadi. Shakl: lives, uchta teng, nol.", 'JavaScript не понял. Форма: lives, три знака равно, ноль.', 'JavaScript didn’t understand. The shape: lives, three equals signs, zero.')
    },
    hints: [
      L3("Bitta teng soladi, uchta teng solishtiradi.", 'Один знак равно кладёт, три — сравнивают.', 'One equals sign puts in, three compare.'),
      L3("Teng belgisiga yana ikkitasini qo'shing.", 'Добавь к знаку равно ещё два.', 'Add two more to the equals sign.'),
      L3("Namunani ko'chirib yozing.", 'Перепиши образец.', 'Copy the example.')
    ],
    ok: L3("Tuzatildi! Jon uchta qoldi va o'yin davom etyapti. Uchta teng faqat so'raydi, hech narsani o'zgartirmaydi.", 'Исправлено! Жизней осталось три, и игра продолжается. Три знака равно только спрашивают и ничего не меняют.', 'Fixed! Three lives remain and the game goes on. Three equals signs only ask, they change nothing.')
  },
  s15: {
    eyebrow: L3('Qaysi shart?', 'Какое условие?', 'Which condition?'),
    say: L3("Qoida yozilgan, shart esa yo'q. Qoidaga mos shartni tanlang.", 'Правило написано, а условия нет. Выбери условие, которое подходит к правилу.', 'The rule is written, but the condition is missing. Pick the condition that matches the rule.'),
    ask: L3('Qoidaga mos shartni tanlang', 'Выбери условие под правило', 'Pick the condition for the rule'),
    fill: true,
    rounds: [
      { q: L3("Qoida: jon qolmasa, Game over.", 'Правило: жизней не осталось — Game over.', 'Rule: no lives left means Game over.'),
        code: ['let lives = 0;', 'if (___) {', '  console.log("Game over");', '}'], opts: ['lives > 0', 'lives = 0', 'lives === 0'], a: 2,
        no: { 1: L3("Bitta teng qutiga nol soladi, so'ramaydi.", 'Один знак равно кладёт ноль в коробку, а не спрашивает.', 'One equals sign puts zero into the box, it doesn’t ask.') },
        why: L3("Jon qolmadi, ya'ni lives nolga teng degani: uchta teng bilan so'raymiz.", 'Жизней не осталось — значит, lives равно нулю: спрашиваем тремя знаками равно.', 'No lives left means lives equals zero: we ask with three equals signs.') },
      { q: L3("Qoida: ochko ellikdan kam bo'lsa, yana urinib ko'ring.", 'Правило: очков меньше пятидесяти — попробуй ещё раз.', 'Rule: a score below fifty means try again.'),
        code: L3(['let score = 30;', 'if (___) {', '  console.log("Yana urinib ko\'ring");', '}'], ['let score = 30;', 'if (___) {', '  console.log("Попробуй ещё раз");', '}'], ['let score = 30;', 'if (___) {', '  console.log("Try again");', '}']), opts: ['score > 50', 'score < 50', 'score === 50'], a: 1,
        why: L3("Kam bo'lsa, kichik belgisi kerak: o'ttiz ellikdan kichik, true.", '«Меньше» — это знак «меньше»: тридцать меньше пятидесяти, true.', 'Below means the less-than sign: thirty is less than fifty, true.') },
      { q: L3("Qoida: javob to'rt bo'lsa, To'g'ri!", 'Правило: ответ четыре — «Верно!»', 'Rule: if the answer is four, Correct!'),
        code: L3(['let answer = 4;', 'if (___) {', '  console.log("To\'g\'ri!");', '}'], ['let answer = 4;', 'if (___) {', '  console.log("Верно!");', '}'], ['let answer = 4;', 'if (___) {', '  console.log("Correct!");', '}']), opts: ['answer === 4', 'answer = 4', '"answer" === 4'], a: 0,
        no: { 1: L3("Bitta teng qutiga to'rtni soladi, so'ramaydi.", 'Один знак равно кладёт четвёрку в коробку, а не спрашивает.', 'One equals sign puts four into the box, it doesn’t ask.'), 2: L3("Qo'shtirnoqdagi answer shunchaki matn, quti emas.", 'answer в кавычках — просто текст, а не коробка.', 'answer in quotes is just text, not the box.') },
        why: L3("Uchta teng qutidagi qiymatni to'rt bilan solishtiradi.", 'Три знака равно сравнивают значение коробки с четвёркой.', 'Three equals signs compare the box’s value with four.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Qoidani o'qing: qaysi so'z belgini aytadi? Kam, ko'p yoki teng?", 'Прочитай правило: какое слово подсказывает знак? Меньше, больше или равно?', 'Read the rule: which word tells you the sign? Below, above, or equals?'),
    hint2: L3("Teng bo'lsa, uchta teng. Kam bo'lsa, kichik belgisi. Bitta teng solishtirmaydi.", 'Равно — три знака равно. Меньше — знак «меньше». Один знак равно не сравнивает.', 'Equals: three equals signs. Below: the less-than sign. One equals sign doesn’t compare.'),
    ok: L3("Zo'r! Siz qoidani shartga aylantirasiz, dasturchilar aynan shunday ishlaydi.", 'Супер! Ты превращаешь правило в условие, именно так работают программисты.', 'Awesome! You turn a rule into a condition, which is exactly what programmers do.')
  },
  s16: {
    eyebrow: L3("O'z eshigingiz", 'Своя дверь', 'Your own door'),
    say: L3("Endi o'z eshigingizni yarating. Qancha ochko borligini, qancha kerakligini va ikkala xabarni yozing. Keyin ishga tushiring: qaysi yo'l ishlaydi?", 'Теперь создай свою дверь. Впиши, сколько очков есть, сколько нужно, и оба сообщения. Потом запусти: какой путь сработает?', 'Now create your own door. Type how many points there are, how many are needed, and both messages. Then run it: which path will run?'),
    ask: L3("Hamma bo'sh joylarni to'ldiring va ishga tushiring", 'Заполни все пропуски и запусти', 'Fill in every gap and run it'),
    ph: [L3('ochko', 'очки', 'score'), L3('kerak', 'нужно', 'needed'), L3('ochilsa', 'если открыто', 'if open'), L3('yopiq bo\'lsa', 'если закрыто', 'if closed')],
    msgs: {
      nums: L3("Ikkala songa ham raqam yozing.", 'Впиши оба числа.', 'Type both numbers.'),
      digits: L3("Sonlarga faqat raqamlar yozing.", 'В числа пиши только цифры.', 'Use digits only for the numbers.'),
      texts: L3("Ikkala xabarni ham yozing: eshik ochilganda va yopiq qolganda.", 'Впиши оба сообщения: когда дверь открылась и когда осталась закрытой.', 'Type both messages: when the door opens and when it stays shut.'),
      quote: L3("Xabar ichida qo'shtirnoq bo'lmasin: ular allaqachon bor.", 'Внутри сообщения не нужны кавычки: они уже есть.', 'No quotes inside the message: they’re already there.')
    },
    hints: [
      L3("Birinchi qatorga ochko, ikkinchisiga kerakli ochko yozing.", 'В первую строку — очки, во вторую — сколько нужно.', 'First line: the score; second line: how many are needed.'),
      L3("Xabarlar qo'shtirnoq ichida, istalgan so'zlar bilan.", 'Сообщения — в кавычках, любыми словами.', 'Messages go inside the quotes, in any words.'),
      L3("Masalan: 120, 100, Ochildi, Yopiq.", 'Например: 120, 100, Открыто, Закрыто.', 'For example: 120, 100, Open, Closed.')
    ],
    example: L3('120 · 100 · "Ochildi!" · "Yopiq"', '120 · 100 · "Открыто!" · "Закрыто"', '120 · 100 · "Open!" · "Closed"'),
    wentIf: L3("Ochko kerakligidan ko'p: eshik ochildi, birinchi xabar chiqdi.", 'Очков больше, чем нужно: дверь открылась, вышло первое сообщение.', 'The score is above what’s needed: the door opened, the first message showed.'),
    wentElse: L3("Ochko yetmadi: else ishladi, ikkinchi xabar chiqdi.", 'Очков не хватило: сработал else, вышло второе сообщение.', 'Not enough points: else ran, the second message showed.'),
    ok: L3("Bu sizning dasturingiz! Endi u o'zi qaror qiladi.", 'Это твоя программа! Теперь она сама принимает решения.', 'This is your program! Now it makes decisions by itself.')
  },
  s17: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Kichik tekshiruv. Har bir gap to'g'rimi yoki noto'g'rimi? Bosing.", 'Маленькая проверка. Каждое утверждение верно или нет? Нажимай.', 'A little check. Is each statement true or false? Tap.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или нет?', 'True or false?'),
    rounds: [
      { q: L3("if blokidagi qatorlar har doim bajariladi.", 'Строки в блоке if выполняются всегда.', 'The lines in an if block always run.'), a: false, why: L3("Yo'q, faqat shart true bo'lganda.", 'Нет, только когда условие true.', 'No, only when the condition is true.') },
      { q: L3("else bloki shart false bo'lganda ishlaydi.", 'Блок else работает, когда условие false.', 'The else block runs when the condition is false.'), a: true, why: L3("Ha, else, ya'ni aks holda degani.", 'Да, else — это «иначе».', 'Yes, else means otherwise.') },
      { q: L3("Shart qavs ichida yoziladi.", 'Условие пишут в круглых скобках.', 'The condition goes in round brackets.'), a: true, why: L3("Ha, if dan keyin qavs ichida.", 'Да, после if в скобках.', 'Yes, after if, in brackets.') },
      { q: L3("if (lives = 0) lives nolga tengmi, deb so'raydi.", 'if (lives = 0) спрашивает, равно ли lives нулю.', 'if (lives = 0) asks whether lives equals zero.'), a: false, why: L3("Yo'q, bitta teng qutiga nol soladi.", 'Нет, один знак равно кладёт ноль в коробку.', 'No, one equals sign puts zero into the box.') },
      { q: L3("Shart false bo'lsa, dastur to'xtaydi.", 'Если условие false, программа останавливается.', 'If the condition is false, the program stops.'), a: false, why: L3("Yo'q, faqat blok o'tkazib yuboriladi, keyingi qatorlar ishlaydi.", 'Нет, пропускается только блок, дальше всё работает.', 'No, only the block is skipped, the rest runs.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Darsda ko'rganlaringiz esingizdami?", 'Вспомни, что было на уроке.', 'Remember what you saw in the lesson.'),
    hint2: L3("true bo'lsa if bloki, false bo'lsa else bloki, blokdan keyin dastur davom etadi.", 'true — блок if, false — блок else, после блока программа идёт дальше.', 'true: the if block, false: the else block, after the block the program carries on.'),
    ok: L3("Ajoyib! Siz shartlarni bilasiz.", 'Отлично! Ты знаешь условия.', 'Excellent! You know conditions.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men shart false bo'lsa, dastur to'xtaydi, degandim? Xato qilibman! Faqat blok o'tkazib yuboriladi, blokdan keyingi qatorlar baribir ishlaydi.",
        'Помнишь, я говорил, что при false программа останавливается? Я ошибся! Пропускается только блок, строки после него всё равно работают.',
        'Remember when I said the program stops when the condition is false? I was wrong! Only the block is skipped, the lines after it still run.') },
      { k: 'if', text: L3("if shart true bo'lsa, jingalak qavslar ichidagi blokni bajaradi.", 'if выполняет блок в фигурных скобках, когда условие true.', 'if runs the block in curly braces when the condition is true.') },
      { k: 'else', text: L3("else shart false bo'lganda ishlaydi. Ikki yo'ldan har doim faqat bittasi.", 'else работает, когда условие false. Из двух путей — всегда только один.', 'else runs when the condition is false. Of the two paths, always just one.') },
      { k: 'cond', text: L3("Shart qavs ichida turadi: solishtirish, uchta teng yoki true va false qutisi.", 'Условие стоит в скобках: сравнение, три знака равно или коробка с true и false.', 'The condition goes in brackets: a comparison, three equals signs, or a box with true and false.') },
      { k: null, text: L3("Barakalla! Endi dasturingiz o'zi qaror qiladi. Keyingi darsda shartlar davom etadi: bir nechta yo'l va ikkita shart birga.",
        'Ура! Теперь твоя программа сама принимает решения. На следующем уроке условия продолжаются: несколько путей и два условия сразу.',
        'Hooray! Now your program makes decisions by itself. Next lesson, conditions continue: several paths and two conditions at once.') }
    ],
    ask: L3('Shartlar: if va else', 'Условия: if и else', 'Conditions: if and else'),
    def: [L3('Ochildi!', 'Открыто!', 'Open!'), L3('Yopiq', 'Закрыто', 'Closed')],
    roles: { riddle: L3("false: faqat blok o'tkaziladi", 'false — пропускается только блок', 'false: only the block is skipped'), if: L3('if (…) { }  →  true', 'if (…) { }  →  true', 'if (…) { }  →  true'),
      else: L3('else { }  →  false', 'else { }  →  false', 'else { }  →  false'), cond: L3('( shart )  →  true / false', '( условие )  →  true / false', '( condition )  →  true / false') }
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, right: 1, rounds: 1, ok: 1, wrong: 1, msgs: 1, works: 1, riddle: 1, locked: 1, took: 1, piece: 1, extra: 1, miss: 1, after: 1, wentIf: 1, wentElse: 1, no: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { q: 1, a: 1, v: 1, code: 1, opts: 1, lines: 1, bad: 1, want: 1, ask: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:j5-engine.jsx@*/

/*@FILE:j5-screens.jsx@*/

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
/*@FILE:../js4/j4.css@*/
/*@FILE:j5.css@*/
`;
