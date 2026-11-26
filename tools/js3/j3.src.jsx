// =============================================================================
// КУРС «JAVASCRIPT» · Урок 3 — «Типы данных» (26.11.2026, заказчик: «делай следующий урок js»).
// Облик «Редактор», как уроки 1–2. Дети 11–14, проходят сами. Страницы в браузере нет (до DOM): «Память» и консоль.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/js3/build.mjs → lessons/javascript/03-tipy-dannyh.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Типы данных» · модуль js-m1 =====
//
// ЗАМЫСЕЛ. Коди сохраняет игру «Kodi Run»: имя героя, монеты, есть ли ключ — три вида данных: string (текст в кавычках),
// number (число, считается), boolean (true / false). В «Памяти» коробки окрашены по типу; typeof называет тип.
// Загадка: Коди уверен, что "10" плюс 5 — пятнадцать; разгадка — текст и число склеиваются: 105.
// Дуга (17): крючок → показ string → какой тип → показ number → что в консоли → показ boolean → положи true →
// показ typeof → что скажет typeof → показ «плюс склеивает» → исправь 5010 → что в консоли → найди строку →
// строка целиком → сохранение игры → верно или нет → вывод.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'js-03-tipy-dannyh',
  module: 'js-m1',
  lessonTitle: {
    uz: "3-dars. Ma'lumot turlari",
    ru: 'Урок 3. Типы данных',
    en: 'Lesson 3. Data types'
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
  save: L3("O'yinni saqlash", 'Сохранить игру', 'Save the game'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  yes: L3("To'g'ri", 'Верно', 'True'),
  no: L3("Noto'g'ri", 'Неверно', 'False'),
  err: L3('Xato', 'Ошибка', 'Error'),
  mem: L3('Xotira', 'Память', 'Memory'),
  memEmpty: L3("Hozircha quti yo'q", 'Пока нет ни одной коробки', 'No boxes yet'),
  conEmpty: L3("Konsol hozircha bo'sh", 'Консоль пока пуста', 'The console is empty for now'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Operatorlar', 'Операторы', 'Operators'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  types: { string: L3('matn', 'текст', 'text'), number: L3('son', 'число', 'number'), boolean: L3("ha / yo'q", 'да / нет', 'yes / no') }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, msgs, hints, help, why, right, wrong …; печатаются: eyebrow, ask, q, code, opts, v.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("O'yinni saqlash", 'Сохранение игры', 'Saving the game'),
    say: L3("Salom! «Kodi Run» o'yinini saqlashim kerak: qahramon ismi, tangalar soni va kalit bormi, yo'qmi. Kodga qarang va «O'yinni saqlash» tugmasini bosing.",
      'Привет! Мне нужно сохранить игру «Kodi Run»: имя героя, сколько монет и есть ли ключ. Посмотри на код и нажми «Сохранить игру».',
      'Hi! I need to save “Kodi Run”: the hero’s name, how many coins, and whether there’s a key. Look at the code and tap “Save the game”.'),
    works: L3("Saqlandi! Xotirada uchta quti, lekin ular har xil rangda. Ichidagi narsalar ham har xil: matn, son va ha yoki yo'q. Bular ma'lumot turlari.",
      'Сохранено! В памяти три коробки, но они разного цвета. И внутри разное: текст, число и «да» или «нет». Это типы данных.',
      'Saved! Memory has three boxes, but they’re different colors. What’s inside is different too: text, a number, and yes or no. These are data types.'),
    riddle: L3("Bugun ma'lumot turlarini o'rganamiz. Lekin oldin topishmoq. Men ishonaman: qo'shtirnoqdagi o'n plyus besh, bu o'n besh. Men haqmanmi? Dars oxirida bilamiz.",
      'Сегодня изучаем типы данных. Но сначала загадка. Я уверен: десять в кавычках плюс пять — это пятнадцать. Прав ли я? Узнаем в конце урока.',
      'Today we learn data types. But first, a riddle. I’m sure that ten in quotes plus five is fifteen. Am I right? We’ll find out at the end of the lesson.'),
    ask: L3("«O'yinni saqlash» ni bosing", 'Нажми «Сохранить игру»', 'Tap “Save the game”'),
    askDone: L3("Topishmoq: qo'shtirnoqdagi o'n plyus besh, nechchi?", 'Загадка: десять в кавычках плюс пять — сколько?', 'Riddle: ten in quotes plus five, how much?')
  },
  s2: {
    eyebrow: L3('string — matn', 'string — текст', 'string is text'),
    say: L3("Birinchi tur: string, ya'ni matn degani. Kuzating.", 'Первый тип — string, то есть текст. Смотри.', 'The first type: string, which means text. Watch.'),
    steps: [
      L3("Qo'shtirnoq ichidagi hamma narsa matn: so'z, harf, hatto raqam ham. Quti to'q sariq rangda, ostida string yozuvi.", 'Всё, что в кавычках, — текст: слово, буква, даже цифры. Коробка оранжевая, под значением написано string.', 'Everything in quotes is text: a word, a letter, even digits. The box is orange, and string is written under the value.'),
      L3("Qo'shtirnoq ikki xil bo'ladi: qo'sh va yakka. Ikkalasi ham matn. Faqat boshida va oxirida bir xil bo'lsin.", 'Кавычки бывают двойные и одинарные. Обе дают текст. Главное — в начале и в конце одинаковые.', 'Quotes can be double or single. Both make text. Just keep the same kind at the start and the end.'),
      L3("Matnlarni plyus bilan yopishtirsa bo'ladi. O'rtadagi bo'sh joy ham matn, aks holda so'zlar yopishib qoladi.", 'Тексты можно склеить плюсом. Пробел посередине — тоже текст, иначе слова слипнутся.', 'Texts can be glued with a plus. The space in the middle is text too, otherwise the words stick together.')
    ],
    help: [
      L3("Qo'shtirnoqlarga va to'q sariq qutilarga qarang.", 'Смотри на кавычки и оранжевые коробки.', 'Look at the quotes and the orange boxes.'),
      L3("string bu qo'shtirnoq ichidagi matn. Plyus matnlarni yopishtiradi.", 'string — текст в кавычках. Плюс склеивает тексты.', 'string is text in quotes. A plus glues texts together.'),
      L3("Xuddi telefondagi xabar kabi: harflar, so'zlar va hatto raqamlar ham bitta matn.", 'Как сообщение в телефоне: буквы, слова и даже цифры — всё один текст.', 'Like a message on your phone: letters, words and even digits are all one text.')
    ],
    ask: L3("string qanday ishlashini kuzating", 'Смотри, как работает string', 'Watch how string works'),
    askDone: L3("string — qo'shtirnoqdagi matn", 'string — текст в кавычках', 'string is text in quotes')
  },
  s3: {
    eyebrow: L3('Qaysi tur?', 'Какой тип?', 'Which type?'),
    say: L3("Har bir qiymatning turini toping: matn, son yoki ha-yo'q. Qo'shtirnoqlarga diqqat qiling!",
      'Найди тип каждого значения: текст, число или «да-нет». Следи за кавычками!',
      'Find the type of each value: text, number, or yes-no. Watch the quotes!'),
    ask: L3("Bu qiymat qaysi turda?", 'Какого типа это значение?', 'What type is this value?'),
    rounds: [
      { v: '"Kodi"', a: 'string', why: L3("Qo'shtirnoqda, demak matn.", 'В кавычках — значит текст.', 'It’s in quotes, so it’s text.') },
      { v: '42', a: 'number', why: L3("Qo'shtirnoqsiz raqam, demak son.", 'Цифры без кавычек — значит число.', 'Digits without quotes, so it’s a number.') },
      { v: 'true', a: 'boolean', why: L3("true qo'shtirnoqsiz, demak ha-yo'q turi.", 'true без кавычек — значит тип «да-нет».', 'true without quotes, so it’s the yes-no type.') },
      { v: '"42"', a: 'string', why: L3("Raqam, lekin qo'shtirnoqda. Demak bu matn.", 'Цифры, но в кавычках. Значит, это текст.', 'Digits, but in quotes. So it’s text.') },
      { v: '3.5', a: 'number', why: L3("Kasr son ham son. Nuqta bilan yoziladi.", 'Дробь — тоже число. Пишется через точку.', 'A decimal is a number too. It’s written with a dot.') },
      { v: '"false"', a: 'string', why: L3("false, lekin qo'shtirnoqda. Demak bu matn.", 'false, но в кавычках. Значит, это текст.', 'false, but in quotes. So it’s text.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Oldin qo'shtirnoqqa qarang: ular bormi?", 'Сначала посмотри на кавычки: они есть?', 'First look at the quotes: are they there?'),
    hint2: L3("Qo'shtirnoq bor bo'lsa, matn. Yo'q bo'lsa: raqam bu son, true yoki false bu ha-yo'q.", 'Есть кавычки — текст. Нет: цифры — число, true или false — «да-нет».', 'Quotes mean text. No quotes: digits are a number, true or false is yes-no.'),
    ok: L3("Barakalla! Siz uchta turni qo'shtirnoqqa qarab ajratasiz.", 'Молодец! Ты различаешь три типа по кавычкам.', 'Well done! You can tell the three types apart by the quotes.')
  },
  s4: {
    eyebrow: L3('number — son', 'number — число', 'number is a number'),
    say: L3("Ikkinchi tur: number, ya'ni son degani. Sonlar bilan JavaScript hisoblaydi. Kuzating.", 'Второй тип — number, то есть число. С числами JavaScript считает. Смотри.', 'The second type: number. JavaScript does math with numbers. Watch.'),
    steps: [
      L3("Son qo'shtirnoqsiz yoziladi. Qutilar yashil, ostida number.", 'Число пишут без кавычек. Коробки зелёные, под значением number.', 'A number is written without quotes. The boxes are green, with number under the value.'),
      L3("Sonlar bilan hisoblash mumkin: bir yuz yigirmadan qirq beshni ayiramiz, qoladi yetmish besh. Konsolda son ko'k rangda.", 'С числами можно считать: из ста двадцати вычитаем сорок пять, остаётся семьдесят пять. В консоли число синее.', 'You can do math with numbers: one hundred twenty minus forty-five leaves seventy-five. In the console the number is blue.'),
      L3("Kasr son nuqta bilan yoziladi: ikki butun o'ndan besh. Vergul emas, nuqta! Ikkiga ko'paytirsak, besh.", 'Дробное число пишут через точку: два и пять десятых. Не запятая, а точка! Умножим на два — пять.', 'A decimal is written with a dot: two point five. Not a comma, a dot! Times two is five.')
    ],
    help: [
      L3("Yashil qutilarga va konsoldagi ko'k sonlarga qarang.", 'Смотри на зелёные коробки и синие числа в консоли.', 'Look at the green boxes and the blue numbers in the console.'),
      L3("number bu qo'shtirnoqsiz son. U bilan qo'shish, ayirish, ko'paytirish va bo'lish mumkin.", 'number — число без кавычек. Его можно складывать, вычитать, умножать и делить.', 'number is a number without quotes. You can add, subtract, multiply and divide it.'),
      L3("Xuddi do'kondagi kassa kabi: narxlarni qo'shadi va qaytimni hisoblaydi.", 'Как касса в магазине: складывает цены и считает сдачу.', 'Like a shop’s cash register: it adds up prices and works out the change.')
    ],
    ask: L3("number qanday ishlashini kuzating", 'Смотри, как работает number', 'Watch how number works'),
    askDone: L3("number — qo'shtirnoqsiz son, hisoblanadi", 'number — число без кавычек, считается', 'number: no quotes, it gets calculated')
  },
  s5: {
    eyebrow: L3('Konsolda nima?', 'Что в консоли?', 'What’s in the console?'),
    say: L3("Konsolda nima chiqishini taxmin qiling. Qutilarning turiga qarang.", 'Угадай, что появится в консоли. Смотри на типы коробок.', 'Guess what the console will show. Look at the types of the boxes.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['let a = 7;', 'let b = 3;', 'console.log(a + b);'], opts: ['73', '10', 'a + b'], a: 1,
        why: L3("Ikkalasi ham son, plyus ularni qo'shadi: o'n.", 'Оба — числа, плюс их складывает: десять.', 'Both are numbers, so the plus adds them: ten.') },
      { code: ['let first = "Kodi";', 'let last = "Run";', 'console.log(first + last);'], opts: ['KodiRun', 'Kodi Run', 'err'], a: 0,
        why: L3("Ikki matn yopishdi. Bo'sh joyni JavaScript o'zi qo'ymaydi.", 'Два текста склеились. Пробел JavaScript сам не ставит.', 'Two texts got glued. JavaScript doesn’t add a space by itself.') },
      { code: ['let half = 2.5;', 'console.log(half * 2);'], opts: ['5', '2.52.5', '4'], a: 0,
        why: L3("Kasr son ham son: ikki butun o'ndan besh ikki marta, besh.", 'Дробь — тоже число: два с половиной дважды — пять.', 'A decimal is a number too: two point five twice is five.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Xotiradagi qutilarning rangiga qarang: son yoki matn?", 'Посмотри на цвет коробок в памяти: число или текст?', 'Look at the box colors in memory: number or text?'),
    hint2: L3("Son plyus son qo'shiladi. Matn plyus matn yopishadi.", 'Число плюс число — складываются. Текст плюс текст — склеиваются.', 'Number plus number adds up. Text plus text glues together.'),
    ok: L3("Ajoyib! Son hisoblanadi, matn yopishadi.", 'Отлично! Числа считаются, тексты склеиваются.', 'Excellent! Numbers get calculated, texts get glued.')
  },
  s6: {
    eyebrow: L3("boolean — ha yoki yo'q", 'boolean — да или нет', 'boolean is yes or no'),
    say: L3("Uchinchi tur eng oddiysi: boolean, ya'ni faqat ikki javob, ha yoki yo'q degani. Kuzating.", 'Третий тип самый простой: boolean — всего два ответа, «да» или «нет». Смотри.', 'The third type is the simplest: boolean, just two answers, yes or no. Watch.'),
    steps: [
      L3("true bu ha degani. hasKey, ya'ni kalit bormi? Ha. Quti ko'k rangda.", 'true — это «да». hasKey: ключ есть? Да. Коробка синяя.', 'true means yes. hasKey: is there a key? Yes. The box is blue.'),
      L3("false bu yo'q degani. isGameOver: o'yin tugadimi? Yo'q. true va false qo'shtirnoqsiz yoziladi.", 'false — это «нет». isGameOver: игра закончилась? Нет. true и false пишут без кавычек.', 'false means no. isGameOver: is the game over? No. true and false are written without quotes.'),
      L3("Diqqat qiling: qo'shtirnoqdagi true endi boolean emas, oddiy matn. Qutining rangiga qarang: to'q sariq.", 'Внимание: true в кавычках — уже не boolean, а обычный текст. Посмотри на цвет коробки: оранжевая.', 'Careful: true in quotes isn’t a boolean anymore, it’s plain text. Look at the box color: orange.')
    ],
    help: [
      L3("Ko'k qutilarga va to'q sariq qutiga qarang.", 'Смотри на синие коробки и на оранжевую.', 'Look at the blue boxes and the orange one.'),
      L3("boolean faqat ikki qiymat: true va false, qo'shtirnoqsiz.", 'boolean — всего два значения: true и false, без кавычек.', 'boolean has only two values: true and false, without quotes.'),
      L3("Xuddi chiroq tugmasi kabi: yoqilgan yoki o'chirilgan, uchinchisi yo'q.", 'Как выключатель света: включён или выключен, третьего нет.', 'Like a light switch: on or off, there’s no third option.')
    ],
    ask: L3("boolean qanday ishlashini kuzating", 'Смотри, как работает boolean', 'Watch how boolean works'),
    askDone: L3("boolean — true yoki false, qo'shtirnoqsiz", 'boolean — true или false, без кавычек', 'boolean: true or false, no quotes')
  },
  s7: {
    eyebrow: L3("Ha deb yozing", 'Запиши «да»', 'Write “yes”'),
    say: L3("Qahramon poygada yutdi! isWinner qutisiga «ha» qiymatini soling. Esingizdami, JavaScript'da ha qanday yoziladi?",
      'Герой выиграл гонку! Положи в коробку isWinner значение «да». Помнишь, как в JavaScript пишется «да»?',
      'The hero won the race! Put the value “yes” into the isWinner box. Remember how JavaScript writes yes?'),
    ask: L3("isWinner qutisiga «ha» soling", 'Положи в isWinner «да»', 'Put “yes” into isWinner'),
    msgs: {
      empty: L3("Bo'sh joyga qiymat yozing.", 'Впиши значение в пропуск.', 'Type a value into the gap.'),
      quoted: L3("Qutiga qarang: u to'q sariq, ya'ni matn. Qo'shtirnoqsiz yozing, shunda boolean bo'ladi.", 'Посмотри на коробку: она оранжевая, значит, текст. Напиши без кавычек — тогда будет boolean.', 'Look at the box: it’s orange, so it’s text. Write it without quotes so it becomes a boolean.'),
      cap: L3("JavaScript katta harfni boshqa so'z deb o'ylaydi. true kichik harflar bilan yoziladi.", 'JavaScript считает большую букву другим словом. true пишут маленькими буквами.', 'JavaScript sees a capital letter as a different word. true is written in lowercase.'),
      word: L3("JavaScript bu so'zni tanimaydi. U faqat inglizcha ikki so'zni biladi: true va false.", 'JavaScript не знает это слово. Он знает только два английских слова: true и false.', 'JavaScript doesn’t know this word. It only knows two English words: true and false.'),
      no: L3("false bu yo'q degani. Qahramon yutdi, demak ha kerak.", 'false — это «нет». Герой выиграл, значит нужно «да».', 'false means no. The hero won, so we need yes.'),
      other: L3("Bu boolean emas. Ha uchun bitta so'z bor, qo'shtirnoqsiz.", 'Это не boolean. Для «да» есть одно слово, без кавычек.', 'That’s not a boolean. There’s one word for yes, without quotes.')
    },
    hints: [
      L3("Ha va yo'q uchun JavaScript'da ikkita inglizcha so'z bor.", 'Для «да» и «нет» в JavaScript есть два английских слова.', 'JavaScript has two English words for yes and no.'),
      L3("Ha bu true, yo'q bu false. Qo'shtirnoqsiz va kichik harflar bilan.", '«Да» — true, «нет» — false. Без кавычек и маленькими буквами.', 'Yes is true, no is false. No quotes, lowercase.'),
      L3("true deb yozing va ishga tushiring.", 'Напиши true и запусти.', 'Type true and run.')
    ],
    ok: L3("Zo'r! Quti ko'k: isWinner ichida true. Qahramon g'olib!", 'Супер! Коробка синяя: в isWinner лежит true. Герой — победитель!', 'Awesome! The box is blue: isWinner holds true. The hero is a winner!')
  },
  s8: {
    eyebrow: L3('typeof — tur qanday?', 'typeof — какой тип?', 'typeof: which type?'),
    say: L3("Qutidagi qiymatning turini JavaScript'ning o'zidan so'rash mumkin. Buning uchun typeof so'zi bor. Kuzating.", 'Тип значения в коробке можно спросить у самого JavaScript. Для этого есть слово typeof. Смотри.', 'You can ask JavaScript itself what type a value is. There’s a word for that: typeof. Watch.'),
    steps: [
      L3("typeof hero, ya'ni hero ning turi qanday degani. Konsol javob beradi: string.", 'typeof hero — «какого типа hero?». Консоль отвечает: string.', 'typeof hero means “what type is hero?”. The console answers: string.'),
      L3("typeof coins: number. Qutidagi rang bilan bir xil javob.", 'typeof coins — number. Тот же ответ, что и цвет коробки.', 'typeof coins: number. The same answer as the box color.'),
      L3("typeof hasKey: boolean. typeof dasturchining lupasi: tur noma'lum bo'lsa, tekshirib ko'ramiz.", 'typeof hasKey — boolean. typeof — лупа программиста: не знаешь тип — проверь.', 'typeof hasKey: boolean. typeof is the programmer’s magnifying glass: if you don’t know the type, check it.')
    ],
    help: [
      L3("Konsoldagi har bir javobni xotiradagi qutining rangi bilan solishtiring.", 'Сравни каждый ответ в консоли с цветом коробки в памяти.', 'Compare each answer in the console with the box color in memory.'),
      L3("typeof qiymatning turini so'z bilan aytadi: string, number yoki boolean.", 'typeof называет тип словом: string, number или boolean.', 'typeof names the type in a word: string, number or boolean.'),
      L3("Xuddi do'kondagi narx yorlig'i kabi: qaysi bo'limdan ekanini darhol aytadi.", 'Как ярлык в магазине: сразу говорит, из какого отдела вещь.', 'Like a shop label: it tells you straight away which department the item is from.')
    ],
    ask: L3("typeof qanday ishlashini kuzating", 'Смотри, как работает typeof', 'Watch how typeof works'),
    askDone: L3("typeof qiymatning turini aytadi", 'typeof называет тип значения', 'typeof names the value’s type')
  },
  s9: {
    eyebrow: L3('typeof nima deydi?', 'Что скажет typeof?', 'What will typeof say?'),
    say: L3("typeof nima deyishini taxmin qiling. Qo'shtirnoqlarni unutmang!", 'Угадай, что скажет typeof. Не забывай про кавычки!', 'Guess what typeof will say. Don’t forget the quotes!'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['console.log(typeof 42);'], opts: ['number', 'string', '42'], a: 0, why: L3("Qo'shtirnoqsiz qirq ikki son: number.", 'Сорок два без кавычек — число: number.', 'Forty-two without quotes is a number: number.') },
      { code: ['console.log(typeof "42");'], opts: ['number', 'string', 'boolean'], a: 1, why: L3("Qo'shtirnoqda, demak matn: string.", 'В кавычках — значит текст: string.', 'In quotes, so it’s text: string.') },
      { code: ['let ok = false;', 'console.log(typeof ok);'], opts: ['false', 'boolean', 'string'], a: 1, why: L3("typeof qiymatni emas, uning turini aytadi: boolean.", 'typeof называет не значение, а его тип: boolean.', 'typeof doesn’t give the value, it gives its type: boolean.') },
      { code: ['console.log(typeof "false");'], opts: ['boolean', 'string', 'false'], a: 1, why: L3("false qo'shtirnoqda, demak bu matn: string.", 'false в кавычках — значит текст: string.', 'false in quotes is text: string.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("typeof qiymatni emas, uning turini aytadi.", 'typeof называет не значение, а тип.', 'typeof gives the type, not the value.'),
    hint2: L3("Javob har doim uch so'zdan biri: string, number yoki boolean. Qo'shtirnoq bor bo'lsa, string.", 'Ответ всегда одно из трёх слов: string, number или boolean. Есть кавычки — string.', 'The answer is always one of three words: string, number or boolean. Quotes mean string.'),
    ok: L3("Barakalla! typeof bilan har qanday turni tekshira olasiz.", 'Молодец! С typeof ты проверишь любой тип.', 'Well done! With typeof you can check any type.')
  },
  s10: {
    eyebrow: L3('Plyus sirlari', 'Секрет плюса', 'The secret of plus'),
    say: L3("Endi eng qiziq joy: plyus belgisi turga qarab har xil ishlaydi. Kuzating va konsoldagi rangga qarang.", 'А теперь самое интересное: плюс работает по-разному в зависимости от типа. Смотри и следи за цветом в консоли.', 'Now the most interesting part: plus works differently depending on the type. Watch the colors in the console.'),
    steps: [
      L3("Son plyus son: o'n plyus besh, o'n besh. Konsolda ko'k, ya'ni son degani.", 'Число плюс число: десять плюс пять — пятнадцать. В консоли синее — значит число.', 'Number plus number: ten plus five is fifteen. Blue in the console, so it’s a number.'),
      L3("Endi o'n qo'shtirnoqda. Matn plyus son: plyus endi qo'shmaydi, yopishtiradi! Bir, nol va besh: bir yuz besh. Konsolda qora, ya'ni matn.", 'Теперь десять в кавычках. Текст плюс число: плюс уже не складывает, а склеивает! Один, ноль и пять — сто пять. В консоли чёрное — значит текст.', 'Now ten is in quotes. Text plus number: the plus no longer adds, it glues! One, zero and five: one hundred five. Black in the console, so it’s text.'),
      L3("Yopishtirish foydali ham: matn va sonni birlashtirib, chiroyli xabar chiqaramiz.", 'Склейка бывает и полезной: соединяем текст и число и получаем понятное сообщение.', 'Gluing is useful too: we join text and a number and get a nice message.')
    ],
    help: [
      L3("Uchta qatorni va konsoldagi ranglarni solishtiring.", 'Сравни три строки и цвета в консоли.', 'Compare the three lines and the colors in the console.'),
      L3("Ikki son qo'shiladi. Agar bittasi matn bo'lsa, plyus yopishtiradi.", 'Два числа складываются. Если хоть одно — текст, плюс склеивает.', 'Two numbers add up. If either one is text, plus glues.'),
      L3("Xuddi lego kabi: sonlarni qo'shsangiz, ko'p bo'ladi. Yozuvlarni yopishtirsangiz, uzun yozuv bo'ladi.", 'Как с конструктором: числа сложишь — станет больше; надписи склеишь — получится длинная надпись.', 'Like building blocks: add numbers and you get more; glue words and you get a longer word.')
    ],
    ask: L3("Plyus qanday ishlashini kuzating", 'Смотри, как работает плюс', 'Watch how plus works'),
    askDone: L3("Son plyus son qo'shiladi, matn bilan yopishadi", 'Число плюс число складываются, с текстом — склеиваются', 'Numbers add up; with text, they glue')
  },
  s11: {
    eyebrow: L3('Tuzating', 'Исправь', 'Fix it'),
    say: L3("Kodi tangalarga o'nta qo'shdi, lekin konsolda besh ming o'n! Tangalar soni qo'shtirnoqda qolib ketgan. Birinchi qatorni tuzating va ishga tushiring.",
      'Коди добавил к монетам десять, а в консоли пять тысяч десять! Количество монет осталось в кавычках. Исправь первую строку и запусти.',
      'Kodi added ten to the coins, but the console shows five thousand ten! The coin count was left in quotes. Fix the first line and run.'),
    ask: L3("coins qutisiga son soling", 'Положи в coins число', 'Put a number into coins'),
    msgs: {
      still: L3("Konsolda yana yopishgan javob: quti to'q sariq, ya'ni matn. Qo'shtirnoqlarni olib tashlang.", 'В консоли снова склейка: коробка оранжевая, значит текст. Убери кавычки.', 'The console glued it again: the box is orange, so it’s text. Remove the quotes.'),
      value: L3("Endi son, lekin tangalar ellikta edi. Ellikni qoldiring.", 'Теперь это число, но монет было пятьдесят. Оставь пятьдесят.', 'Now it’s a number, but there were fifty coins. Keep fifty.'),
      empty: L3("Qiymat o'chib qoldi. Ellik yozing.", 'Значение стёрто. Впиши пятьдесят.', 'The value is gone. Type fifty.'),
      other: L3("JavaScript buni tushunmadi. Faqat ellik raqamini qoldiring.", 'JavaScript этого не понял. Оставь только цифры пятьдесят.', 'JavaScript didn’t understand that. Leave just the digits fifty.')
    },
    hints: [
      L3("Xotiradagi coins qutisiga qarang: uning rangi qanday?", 'Посмотри на коробку coins в памяти: какого она цвета?', 'Look at the coins box in memory: what color is it?'),
      L3("To'q sariq bu matn. Son bo'lishi uchun qo'shtirnoq kerak emas.", 'Оранжевый — это текст. Чтобы было число, кавычки не нужны.', 'Orange is text. To be a number, it needs no quotes.'),
      L3("Qo'shtirnoqlarni o'chiring: faqat ellik qolsin.", 'Сотри кавычки: пусть останется только пятьдесят.', 'Erase the quotes: leave only fifty.')
    ],
    ok: L3("Tuzatildi! Quti yashil, ellik plyus o'n, oltmish. Endi hisob to'g'ri.", 'Исправлено! Коробка зелёная, пятьдесят плюс десять — шестьдесят. Теперь счёт верный.', 'Fixed! The box is green, fifty plus ten is sixty. Now the count is right.')
  },
  s12: {
    eyebrow: L3('Qo\'shadimi, yopishtiradimi?', 'Сложит или склеит?', 'Add or glue?'),
    say: L3("Plyus qo'shadimi yoki yopishtiradimi? Taxmin qiling.", 'Плюс сложит или склеит? Угадай.', 'Will the plus add or glue? Guess.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['console.log("2" + "2");'], opts: ['4', '22', 'err'], a: 1, why: L3("Ikkalasi ham matn: yopishib, ikki-ikki bo'ldi.", 'Оба — текст: склеились, вышло «22».', 'Both are text: they glued into twenty-two.') },
      { code: ['console.log(2 + 2);'], opts: ['4', '22', '2 + 2'], a: 0, why: L3("Ikkalasi ham son: to'rt.", 'Оба — числа: четыре.', 'Both are numbers: four.') },
      { code: L3(['let level = 3;', 'console.log("Daraja: " + level);'], ['let level = 3;', 'console.log("Уровень: " + level);'], ['let level = 3;', 'console.log("Level: " + level);']),
        opts: L3(['Daraja: level', 'Daraja: 3', '3'], ['Уровень: level', 'Уровень: 3', '3'], ['Level: level', 'Level: 3', '3']), a: 1,
        why: L3("Matnga qutidagi uch yopishdi.", 'К тексту приклеилась тройка из коробки.', 'The three from the box got glued to the text.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Qo'shtirnoqlarni sanang: matn bormi?", 'Посчитай кавычки: есть ли текст?', 'Count the quotes: is there any text?'),
    hint2: L3("Faqat sonlar bo'lsa, qo'shadi. Matn bo'lsa, yopishtiradi.", 'Только числа — складывает. Есть текст — склеивает.', 'Only numbers: it adds. Any text: it glues.'),
    ok: L3("Ajoyib! Endi plyus sizni aldolmaydi.", 'Отлично! Теперь плюс тебя не обманет.', 'Excellent! Now plus can’t fool you.')
  },
  s13: {
    eyebrow: L3('Buzilgan qator', 'Сломанная строка', 'The broken line'),
    say: L3("Qizil xabarga va o'ng tomondagi raqamga qarang, keyin buzilgan qatorni bosing.", 'Посмотри на красное сообщение и номер справа, потом нажми сломанную строку.', 'Look at the red message and the number on the right, then tap the broken line.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    rounds: [
      { lines: ['let hero = "Kodi";', 'let hasKey = True;', 'console.log(hero);'], bad: 1, why: L3("Ikkinchi qatorda True bosh harf bilan. To'g'risi true.", 'Во второй строке True с большой буквы. Правильно — true.', 'On the second line True has a capital letter. The right way is true.') },
      { lines: L3(['let coins = 120;', 'let city = Toshkent;', 'console.log(coins);'], ['let coins = 120;', 'let city = Москва;', 'console.log(coins);'], ['let coins = 120;', 'let city = London;', 'console.log(coins);']), bad: 1,
        why: L3("Ikkinchi qatorda shahar nomi qo'shtirnoqsiz. JavaScript uni quti nomi deb qidirdi.", 'Во второй строке название города без кавычек. JavaScript искал его как имя коробки.', 'On the second line the city name has no quotes. JavaScript looked for it as a box name.') }
    ],
    wrong: L3("Bu qator xatosiz ishladi. Qizil xabar yonidagi raqamga qarang.", 'Эта строка сработала без ошибки. Посмотри на номер у красного сообщения.', 'This line ran fine. Look at the number next to the red message.'),
    right: L3("Topildi!", 'Есть!', 'Found it!'),
    hint1: L3("Qizil xabarning o'ng tomonida raqam bor. U qator raqami.", 'Справа у красного сообщения есть число. Это номер строки.', 'There’s a number on the right of the red message. It’s the line number.'),
    hint2: L3("Raqamni toping va koddagi o'sha qatorni bosing.", 'Найди число и нажми эту строку в коде.', 'Find the number and tap that line in the code.'),
    ok: L3("Ajoyib! Tur xatolarini ham topa olasiz.", 'Здорово! Ты находишь и ошибки с типами.', 'Awesome! You can find type mistakes too.')
  },
  s14: {
    eyebrow: L3('Butun qator', 'Целая строка', 'A whole line'),
    say: L3("Qahramon kalitni topdi! Butun qatorni o'zingiz yozing: hasKey nomli quti oching va unga «ha» soling. Pastdagi qator turini tekshiradi.",
      'Герой нашёл ключ! Напиши всю строку целиком: открой коробку hasKey и положи в неё «да». Строка ниже проверит тип.',
      'The hero found the key! Write the whole line yourself: open a box named hasKey and put “yes” in it. The line below checks the type.'),
    ask: L3("hasKey qutisini oching va unga «ha» soling", 'Открой коробку hasKey и положи в неё «да»', 'Open the hasKey box and put “yes” in it'),
    msgs: {
      empty: L3("Qator bo'sh. let dan boshlang.", 'Строка пустая. Начни с let.', 'The line is empty. Start with let.'),
      noKw: L3("Kod ishladi, lekin qutini let bilan oching.", 'Код сработал, но открой коробку через let.', 'The code ran, but open the box with let.'),
      name: L3("Pastdagi qator hasKey qutisini qidiradi, lekin bunday quti yo'q. Nom aynan hasKey bo'lsin: K bosh harf bilan.", 'Строка ниже ищет коробку hasKey, а её нет. Имя должно быть точно hasKey — с большой K.', 'The line below looks for the hasKey box, but there isn’t one. The name must be exactly hasKey, with a capital K.'),
      quoted: L3("typeof string dedi: qiymat qo'shtirnoqda. Ha qo'shtirnoqsiz yoziladi.", 'typeof сказал string: значение в кавычках. «Да» пишут без кавычек.', 'typeof said string: the value is in quotes. Yes is written without quotes.'),
      no: L3("false bu yo'q degani. Kalit bor, demak ha.", 'false — это «нет». Ключ есть, значит «да».', 'false means no. There is a key, so yes.'),
      cap: L3("true kichik harflar bilan yoziladi.", 'true пишут маленькими буквами.', 'true is written in lowercase.'),
      notBool: L3("Qutida boolean emas. Ha uchun true yozing.", 'В коробке не boolean. Для «да» напиши true.', 'The box doesn’t hold a boolean. Write true for yes.'),
      syntax: L3("JavaScript bu qatorni tushunmadi. Shakl: let, nom, teng belgisi, qiymat, nuqtali vergul.", 'JavaScript не понял строку. Форма: let, имя, знак равно, значение, точка с запятой.', 'JavaScript didn’t understand the line. The shape: let, name, equals sign, value, semicolon.')
    },
    hints: [
      L3("Qator let bilan boshlanadi, keyin nom hasKey.", 'Строка начинается с let, потом имя hasKey.', 'The line starts with let, then the name hasKey.'),
      L3("Teng belgisidan keyin ha, ya'ni true, qo'shtirnoqsiz.", 'После знака равно — «да», то есть true, без кавычек.', 'After the equals sign comes yes, that is true, without quotes.'),
      L3("Namunani ko'chirib yozing va ishga tushiring.", 'Перепиши образец и запусти.', 'Copy the example and run it.')
    ],
    ok: L3("Ajoyib! Quti ko'k, typeof boolean dedi. Butun qatorni o'zingiz yozdingiz!", 'Отлично! Коробка синяя, typeof сказал boolean. Вся строка написана тобой!', 'Excellent! The box is blue, typeof said boolean. You wrote the whole line!')
  },
  s15: {
    eyebrow: L3("Sizning saqlashingiz", 'Твоё сохранение', 'Your save'),
    say: L3("Endi o'z o'yiningizni saqlang. Uchta bo'sh joy: qahramon ismi, tangalar soni va kalit bormi. Har biriga o'z turini yozing!",
      'Теперь сохрани свою игру. Три пропуска: имя героя, количество монет и есть ли ключ. В каждый — свой тип!',
      'Now save your own game. Three gaps: the hero’s name, the number of coins, and whether there’s a key. Each gets its own type!'),
    ask: L3("Uchta bo'sh joyni to'ldiring va ishga tushiring", 'Заполни три пропуска и запусти', 'Fill in the three gaps and run'),
    ph: [L3('ism', 'имя', 'name'), L3('son', 'число', 'number'), L3("true / false", 'true / false', 'true / false')],
    pre: L3('Ism: ', 'Имя: ', 'Name: '),
    msgs: {
      empty: L3("Hamma bo'sh joylarni to'ldiring.", 'Заполни все пропуски.', 'Fill in all the gaps.'),
      quote: L3("Qo'shtirnoqlar allaqachon bor. Birinchi joyga faqat ism yozing.", 'Кавычки уже есть. В первый пропуск пиши только имя.', 'The quotes are already there. Just type a name in the first gap.'),
      num: L3("Tangalar soni: faqat raqamlar, qo'shtirnoqsiz.", 'Количество монет — только цифры, без кавычек.', 'The number of coins: digits only, no quotes.'),
      bool: L3("Oxirgi joyga true yoki false yozing, kichik harflar bilan va qo'shtirnoqsiz.", 'В последний пропуск напиши true или false — маленькими буквами и без кавычек.', 'In the last gap write true or false, lowercase and without quotes.')
    },
    hints: [
      L3("Birinchi joyga matn, ikkinchisiga son, uchinchisiga true yoki false.", 'В первый — текст, во второй — число, в третий — true или false.', 'Text in the first, a number in the second, true or false in the third.'),
      L3("Son va boolean qo'shtirnoqsiz yoziladi.", 'Число и boolean пишут без кавычек.', 'Numbers and booleans are written without quotes.'),
      L3("Masalan: Robo, keyin yuz, keyin true.", 'Например: Robo, потом сто, потом true.', 'For example: Robo, then a hundred, then true.')
    ],
    ok: L3("Zo'r! O'yin saqlandi: uchta quti, uchta rang, uchta tur!", 'Супер! Игра сохранена: три коробки, три цвета, три типа!', 'Awesome! The game is saved: three boxes, three colors, three types!')
  },
  s16: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Kichik tekshiruv. Har bir gap to'g'rimi yoki noto'g'rimi? Bosing.", 'Маленькая проверка. Каждое утверждение верно или нет? Нажимай.', 'A little check. Is each statement true or false? Tap.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или нет?', 'True or false?'),
    rounds: [
      { q: L3('"25" bu son, ya\'ni number.', '"25" — это число, number.', '"25" is a number.'), a: false, why: L3("Yo'q, qo'shtirnoqda, demak matn.", 'Нет, в кавычках — значит текст.', 'No, it’s in quotes, so it’s text.') },
      { q: L3("Qo'shtirnoqsiz true bu boolean.", 'true без кавычек — это boolean.', 'true without quotes is a boolean.'), a: true, why: L3("Ha, true va false bu boolean.", 'Да, true и false — boolean.', 'Yes, true and false are booleans.') },
      { q: L3('"10" + 5 konsolda 15 chiqaradi.', '"10" + 5 выведет в консоль 15.', '"10" + 5 shows 15 in the console.'), a: false, why: L3("Yo'q, matn va son yopishadi: bir yuz besh.", 'Нет, текст и число склеятся: сто пять.', 'No, text and a number glue: one hundred five.') },
      { q: L3("typeof qiymatning turini aytadi.", 'typeof называет тип значения.', 'typeof names the value’s type.'), a: true, why: L3("Ha, string, number yoki boolean.", 'Да: string, number или boolean.', 'Yes: string, number or boolean.') },
      { q: L3("Kasr son vergul bilan yoziladi: 2,5.", 'Дробное число пишут через запятую: 2,5.', 'A decimal is written with a comma: 2,5.'), a: false, why: L3("Yo'q, nuqta bilan: ikki nuqta besh.", 'Нет, через точку: 2.5.', 'No, with a dot: 2.5.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Darsda ko'rganlaringiz esingizdami?", 'Вспомни, что было на уроке.', 'Remember what you saw in the lesson.'),
    hint2: L3("Qo'shtirnoq bu matn, true va false bu boolean, matn bilan plyus yopishtiradi.", 'Кавычки — текст, true и false — boolean, с текстом плюс склеивает.', 'Quotes mean text, true and false are booleans, plus glues with text.'),
    ok: L3("Ajoyib! Siz ma'lumot turlarini bilasiz.", 'Отлично! Ты знаешь типы данных.', 'Excellent! You know the data types.')
  },
  s17: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men qo'shtirnoqdagi o'n plyus besh o'n besh degandim? Xato qilibman! Qo'shtirnoqdagi o'n bu matn, matn va son esa yopishadi: bir yuz besh.",
        'Помнишь, я говорил, что десять в кавычках плюс пять — пятнадцать? Я ошибся! Десять в кавычках — это текст, а текст и число склеиваются: сто пять.',
        'Remember when I said ten in quotes plus five is fifteen? I was wrong! Ten in quotes is text, and text and a number glue together: one hundred five.') },
      { k: 'string', text: L3("string bu qo'shtirnoqdagi matn.", 'string — текст в кавычках.', 'string is text in quotes.') },
      { k: 'number', text: L3("number bu qo'shtirnoqsiz son, u hisoblanadi.", 'number — число без кавычек, оно считается.', 'number is a number without quotes, and it gets calculated.') },
      { k: 'boolean', text: L3("boolean bu true yoki false, ha yoki yo'q. typeof esa istalgan turni aytadi.", 'boolean — true или false, «да» или «нет». А typeof называет любой тип.', 'boolean is true or false, yes or no. And typeof names any type.') },
      { k: null, text: L3("Barakalla! Endi JavaScript'ning uchta asosiy turini bilasiz. Keyingi darsda operatorlar: hisoblaymiz va solishtiramiz!",
        'Ура! Теперь ты знаешь три главных типа JavaScript. На следующем уроке — операторы: будем считать и сравнивать!',
        'Hooray! Now you know JavaScript’s three main types. Next lesson: operators, we’ll calculate and compare!') }
    ],
    ask: L3("Uchta tur: string, number, boolean", 'Три типа: string, number, boolean', 'Three types: string, number, boolean'),
    roles: { riddle: L3('Matn va son yopishadi', 'Текст и число склеиваются', 'Text and a number glue'), string: L3("string: qo'shtirnoqda", 'string: в кавычках', 'string: in quotes'),
      number: L3('number: hisoblanadi', 'number: считается', 'number: gets calculated'), boolean: L3('boolean: true yoki false', 'boolean: true или false', 'boolean: true or false') }
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, right: 1, rounds: 1, ok: 1, wrong: 1, msgs: 1, works: 1, riddle: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { q: 1, a: 1, v: 1, code: 1, opts: 1, lines: 1, bad: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:j3-engine.jsx@*/

/*@FILE:j3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css1/c1.css@*/
/*@FILE:../js1/j1.css@*/
/*@FILE:../js2/j2.css@*/
/*@FILE:j3.css@*/
`;
