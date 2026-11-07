// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 7 — «Формы, часть 2: выбор и отправка»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/forma7/build.mjs → lessons/html/07-formy-vybor.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 7 · «Формы, часть 2: выбор и отправка» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Урок с нуля; основа кода — уроки 2–6. Облик — эталона «Редактор» (naborRedaktor);
// бумаги нет нигде. Анкета клуба из урока 6 работает плохо: игру пишут кто как («mainkraft»), длинный
// рассказ о себе не влезает в одну строку, отправить анкету нечем. Ученик делает список выбора
// (select и option), большое поле (textarea) и кнопку (button), а в конце — свою анкету.
// Загадка (без имён): Коди написал названия игр прямо внутри select, без option, и уверен, что список
// заполнится; в выводе признаёт ошибку — каждому пункту нужен option.
//
// ДУГА (17 экранов; экрана плана нет). Типы заданий — по разделу 3а навыка:
//   s1 крючок (поля вразнобой → список, большое поле, кнопка; загадка)
//   select/option: s2 показ · s3 вписать имя тега пункта (Fill in the Blanks) · s4 строка option ↔ пункт списка (Visual Code Mapping)
//   textarea:      s5 показ input → textarea · s6 собрать textarea (Code Builder) · s7 тег ↔ вещь (Matching Pairs)
//   button:        s8 показ «кнопка отправляет» · s9 вписать </textarea> (Fill in the Blanks) · s10 до и после (Before / After)
//   своя анкета:   s11 показ «анкета целиком» · s12 своя кнопка, s13 свой пункт (Live Code Preview) · s14 вернуть option (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер (как Chrome): select — поле со стрелкой, виден первый или выбранный пункт; текст без
//     option в список не попадает; textarea — большое поле с уголком, текст между тегами — внутри поля;
//     без </textarea> всё, что дальше, стало текстом в поле; button — серая кнопка; кнопка в form отправляет
//     анкету, а раз сервера нет — страница открывается заново и поля пустеют.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ: ochiladigan ro'yxat — выпадающий список (draft); variant — пункт списка (draft);
// katta matn maydoni — большое поле (draft); tugma — кнопка; server — сервер (draft).
// В речи select, option, textarea, button, form, input, placeholder — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-07-formy-vybor',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '7-dars. Formalar, 2-qism: tanlash va yuborish',
    ru: 'Урок 7. Формы, часть 2: выбор и отправка',
    en: 'Lesson 7. Forms, part 2: choosing and sending'
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
  next: L3('Haqiqiy sayt tuzilishi', 'Структура настоящего сайта', 'The structure of a real site'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  myForm: L3('Mening anketam', 'Моя анкета', 'My form'),
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
  // Сайт Коди — содержимое страниц в браузере (не звучит).
  site: {
    club: L3("O'yinlar klubi", 'Клуб игр', 'Games club'),
    capGame: L3("Sevimli o'yiningiz:", 'Любимая игра:', 'Favorite game:'),
    capAbout: L3("O'zingiz haqida:", 'О себе:', 'About you:'),
    games: L3(['Minecraft', 'Futbol', 'Shaxmat'], ['Minecraft', 'Футбол', 'Шахматы'], ['Minecraft', 'Football', 'Chess']),
    games4: L3(['Minecraft', 'Futbol', 'Shaxmat', 'Basketbol'], ['Minecraft', 'Футбол', 'Шахматы', 'Баскетбол'], ['Minecraft', 'Football', 'Chess', 'Basketball']),
    extraGame: L3('Basketbol', 'Баскетбол', 'Basketball'),
    about: L3("Men 12 yoshdaman, futbol o'ynashni va o'yinlar yasashni yaxshi ko'raman.", 'Мне 12 лет, я люблю играть в футбол и делать игры.', 'I’m 12, and I love playing football and making games.'),
    hello: L3("Salom! Men futbolni yaxshi ko'raman.", 'Привет! Я люблю футбол.', 'Hi! I love football.'),
    phAbout: L3("O'zingiz haqida yozing", 'Напиши о себе', 'Write about yourself'),
    send: L3('Yuborish', 'Отправить', 'Send'),
    join: L3("Klubga qo'shilish", 'Вступить в клуб', 'Join the club')
  },
  s1: {
    eyebrow: L3('Anketa chalkash', 'Анкета путается', 'A messy form'),
    say: L3("Salom! O'tgan darsda klub anketasini yasadik. Lekin javoblar chalkash bo'lib ketdi. Bir kishi Minecraft deb yozibdi, boshqasi mainkraft, uchinchisi esa katta harflar bilan yozibdi. O'zi haqidagi uzun gap bitta qatorga sig'madi. Anketani yuboradigan tugma esa umuman yo'q. Keling, buni to'g'rilaymiz. «Aylantirish» tugmasini bosing.",
      'Привет! На прошлом уроке мы сделали анкету клуба. Но ответы пришли вразнобой. Один написал Minecraft, другой mainkraft, третий большими буквами. Длинный рассказ о себе не влез в одну строку. А кнопки, чтобы отправить анкету, нет совсем. Давай исправим. Нажми «Превратить».',
      'Hi! Last time we made the club form. But the answers came in all over the place. One person wrote Minecraft, another wrote mainkraft, a third wrote it in capitals. A long story about yourself didn’t fit on one line. And there’s no button to send the form at all. Let’s fix this. Tap “Transform”.'),
    magic: L3("Voy, qarang! O'yinni endi yozish shart emas: uni ro'yxatdan tanlaysiz. O'zingiz haqida yozish uchun katta maydon chiqdi.", 'Ого, смотри! Игру теперь не надо писать: её выбирают из списка. А для рассказа о себе появилось большое поле.', 'Whoa, look! Now you don’t type the game, you pick it from a list. And a big field appeared for writing about yourself.'),
    magicP: L3("Pastda esa tugma paydo bo'ldi. Uni bosib, anketani yuborish mumkin.", 'А внизу появилась кнопка. Нажмёшь её — и анкета отправится.', 'And a button appeared at the bottom. Tap it to send the form.'),
    done: L3("Bugun shunday ro'yxat, katta maydon va tugma yasashni o'rganasiz va o'zingizning anketangizni yasaysiz. Lekin oldin kichik topishmoq. Men boshqa sahifada o'yinlar ro'yxatini yasadim: select tegini ochdim va ichiga Minecraft, Futbol, Shaxmat deb yozdim, xolos. Menimcha, endi ro'yxatda uchta o'yin chiqadi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делать такой список, большое поле и кнопку и сделаешь свою анкету. Но сначала маленькая загадка. Я сделал на другой странице список игр: открыл тег select и просто написал внутри Minecraft, Футбол, Шахматы. По-моему, теперь в списке будут три игры. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make a list like this, a big field and a button, and you’ll make your own form. But first, a little riddle. On another page I made a list of games: I opened the select tag and simply wrote Minecraft, Football, Chess inside it. I think the list will now have three games. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Ro'yxat, katta maydon va tugma", 'Список, большое поле и кнопка', 'A list, a big field and a button')
  },
  s2: {
    eyebrow: L3("select va option", 'select и option', 'select and option'),
    say: L3("Keling, o'yinlar ro'yxatini birga yasaymiz. O'yin yozuvidan keyin yangi teg qo'yamiz.", 'Давай сделаем список игр вместе. После подписи про игру ставим новый тег.', 'Let’s make the list of games together. After the game caption we add a new tag.'),
    saySel: L3("Bu select tegi. select inglizcha so'z, ya'ni tanlash degani. U ochiladigan ro'yxat yasaydi: yonida kichik strelka bor. Lekin hozir ro'yxat bo'sh, chunki ichida hali hech qanday variant yo'q.",
      'Это тег select. select — английское слово, то есть «выбрать». Он делает выпадающий список: справа маленькая стрелка. Но сейчас список пустой, потому что внутри ещё нет ни одного варианта.',
      'This is the select tag. select is an English word for choosing. It makes a drop-down list with a small arrow on the right. But right now the list is empty, because there are no choices inside it yet.'),
    sayOpt: L3("Har bir variant option tegida yoziladi. option ya'ni variant degani. Uchta o'yinni uchta option ichiga yozdik. Qarang, birinchi variant maydonda o'zi ko'rinib turibdi.",
      'Каждый вариант пишут в теге option, то есть «вариант». Три игры — три option. Смотри, первый вариант сам виден в поле.',
      'Each choice goes in an option tag. option means a choice. Three games, three options. Look, the first choice shows up in the field by itself.'),
    sayPick: L3("Ro'yxatni bosganda u ochiladi va hamma variantlar ko'rinadi. Futbolni tanladik, endi maydonda Futbol turibdi. Endi har kim o'yin nomini bir xil yozadi, harf xatosi bo'lmaydi.",
      'Нажмёшь на список — он раскроется, и видны все варианты. Выбрали Футбол — теперь в поле Футбол. Теперь у всех название игры одинаковое, без опечаток.',
      'Tap the list and it opens, showing all the choices. We picked Football, so now the field shows Football. Now everyone writes the game name the same way, with no typos.'),
    done: L3("Eslab qoling: select ro'yxat yasaydi, uning ichidagi har bir option esa bitta variant bo'ladi. Ikkalasi ham yopuvchi teg bilan yoziladi.", 'Запомни: select делает список, а каждый option внутри — один вариант. Оба пишут с закрывающим тегом.', 'Remember: select makes the list, and each option inside it is one choice. Both have a closing tag.'),
    askSel: L3('Qarang: select tegi', 'Смотри: тег select', 'Watch: the select tag'),
    askOpt: L3('Qarang: option teglari', 'Смотри: теги option', 'Watch: the option tags'),
    askPick: L3("Qarang: ro'yxatdan tanlash", 'Смотри: выбор из списка', 'Watch: picking from the list'),
    askDone: L3("select — ro'yxat, option — variant", 'select — список, option — вариант', 'select — the list, option — a choice')
  },
  s3: {
    eyebrow: L3('Teg nomini yozing', 'Впиши имя тега', 'Type the tag name'),
    say: L3("Endi navbat sizga. Ro'yxatda faqat ikkita o'yin bor, Shaxmat esa yo'q. Kodga qarang: Shaxmat qatorida ochuvchi teg nomi yo'q. Shuning uchun brauzer uni ro'yxatga qo'shmadi. Teg nomini yozing va «Tekshirish»ni bosing.",
      'Теперь твоя очередь. В списке только две игры, а Шахмат нет. Посмотри на код: в строке Шахмат у открывающего тега нет имени. Поэтому браузер не добавил её в список. Впиши имя тега и нажми «Проверить».',
      'Now it’s your turn. The list has only two games, and Chess is missing. Look at the code: in the Chess line the opening tag has no name. That’s why the browser didn’t add it to the list. Type the tag name and tap “Check”.'),
    msgs: {
      empty: L3("Burchakli qavslar o'rtasiga teg nomini yozing.", 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslar joyida turibdi. Bu yerga faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      li: L3("li oddiy ro'yxat uchun bo'ladi: u ul va ol ichida turadi. select ichida boshqa teg kerak.", 'li — для обычных списков ul и ol. Внутри select нужен другой тег.', 'li is for ordinary ul and ol lists. Inside select you need a different tag.'),
      other: L3("Bu teg boshqa ish qiladi. Ro'yxatning bitta varianti uchun teg kerak.", 'Этот тег делает другое. Нужен тег для одного варианта списка.', 'That tag does something else. You need the tag for one choice in the list.'),
      typo: L3("Bunday teg yo'q, shuning uchun Shaxmat ro'yxatga chiqmadi. Nomni harfma-harf yozing.", 'Такого тега нет, поэтому Шахматы не попали в список. Напиши имя буква в букву.', 'There’s no such tag, so Chess didn’t make it into the list. Type the name letter by letter.')
    },
    hints: [
      L3("Boshqa ikkita qatorda qaysi teg bor?", 'Какой тег в двух других строках?', 'What tag is in the other two lines?'),
      L3("Yopuvchi tegga qarang: nomi o'sha yerda yozilgan.", 'Посмотри на закрывающий тег: имя написано там.', 'Look at the closing tag: the name is written there.'),
      L3("Teg nomi option bo'ladi. Uni burchakli qavslar o'rtasiga yozing.", 'Имя тега — option. Впиши его между уголками.', 'The tag name is option. Type it between the brackets.')
    ],
    ok: L3("Zo'r! Shaxmat ro'yxatga qo'shildi. Endi ro'yxatda uchta o'yin bor.", 'Огонь! Шахматы попали в список. Теперь в нём три игры.', 'Awesome! Chess is in the list. Now there are three games.'),
    ask: L3('Shaxmat qatoriga teg nomini yozing', 'Впиши имя тега в строку Шахмат', 'Type the tag name in the Chess line')
  },
  s4: {
    eyebrow: L3("Kod va ro'yxat", 'Код и список', 'Code and list'),
    say: L3("Ro'yxat ochiq turibdi. Kodda bitta option qatori yonadi. Siz ro'yxatda shu qator chiqargan variantni bosing.",
      'Список раскрыт. В коде горит одна строка option. А ты нажми в списке вариант, который она выводит.',
      'The list is open. One option line lights up in the code. Tap the choice in the list that this line shows.'),
    askQ: L3("Yongan qator qaysi variantni chiqaradi?", 'Какой вариант выводит горящая строка?', 'Which choice does the lit line show?'),
    rounds: [
      null,
      L3("Endi men qatorlarni almashtirdim. Qarang, ro'yxatda ham tartib o'zgardi. Yongan qator qaysi variantni chiqaradi?", 'Теперь я поменял строки местами. Смотри, порядок в списке тоже поменялся. Какой вариант выводит горящая строка?', 'Now I swapped the lines. Look, the order in the list changed too. Which choice does the lit line show?'),
      L3("Oxirgisi. Men yangi qator qo'shdim. U ro'yxatda qayerda chiqdi?", 'Последняя. Я добавил новую строку. Где она появилась в списке?', 'The last one. I added a new line. Where did it show up in the list?')
    ],
    ok: [
      L3("To'g'ri! Bu option qatori Futbol variantini chiqaradi.", 'Верно! Эта строка option выводит вариант Футбол.', 'Right! This option line shows the Football choice.'),
      L3("To'g'ri! Variantlar kod qatorlari tartibida turadi.", 'Верно! Варианты стоят в порядке строк кода.', 'Right! The choices are in the same order as the code lines.'),
      L3("To'g'ri! Oxirgi option ro'yxatning oxirida chiqadi.", 'Верно! Последний option — в конце списка.', 'Right! The last option is at the end of the list.')
    ],
    miss: L3("Bu boshqa variant. Ro'yxatda variantlar kod qatorlari tartibida turadi: yongan qator nechanchi o'rinda turibdi?", 'Это другой вариант. В списке варианты идут в порядке строк кода: какая по счёту горящая строка?', 'That’s a different choice. The choices in the list follow the order of the code lines: which position is the lit line in?'),
    // Ступени подсказки (05.11.2026): 1 — куда смотреть, 2 — правило, 3 — что написано в горящей строке и какой вариант выбрать.
    hint1: L3("Oldin kodda yongan qatorni toping, keyin ochiq ro'yxatga qarang.", 'Сначала найди горящую строку в коде, потом посмотри на раскрытый список.', 'First find the lit line in the code, then look at the open list.'),
    hint2: L3("Har bir option qatori ro'yxatda bitta variant bo'ladi. option ichida qaysi so'z yozilgan bo'lsa, ro'yxatda ham o'sha so'z chiqadi.", 'Каждая строка option — один вариант в списке. Какое слово написано внутри option, такое и появится в списке.', 'Each option line is one choice in the list. Whatever word is inside option, that word shows up in the list.'),
    why3: L3("Yongan qatorda option ichida {a} yozilgan.", 'В горящей строке внутри option написано {a}.', 'The lit line has {a} inside option.'),
    done: L3("Barakalla! Endi har bir option qatori qaysi variantni chiqarishini bilasiz.", 'Молодец! Теперь ты знаешь, какой вариант выводит каждая строка option.', 'Well done! Now you know which choice each option line shows.')
  },
  s5: {
    eyebrow: L3('Katta maydon', 'Большое поле', 'A big field'),
    say: L3("Endi o'zingiz haqidagi maydonga qaraymiz. Bu yerga odatda bir nechta gap yoziladi.", 'Теперь посмотрим на поле «О себе». Сюда обычно пишут несколько предложений.', 'Now let’s look at the About you field. People usually write several sentences here.'),
    sayInput: L3("Hozir bu oddiy input. U bitta qator bo'ladi, shuning uchun uzun gap sig'madi: oxiri yashirinib qoldi. O'qish ham, tekshirish ham noqulay.",
      'Сейчас это обычный input. Он в одну строку, поэтому длинное предложение не влезло: конец спрятался. Неудобно ни читать, ни проверять.',
      'Right now it’s an ordinary input. It’s one line, so the long sentence didn’t fit: the end is hidden. It’s hard to read and to check.'),
    sayTa: L3("Endi input o'rniga textarea qo'yamiz. textarea ya'ni matn maydoni degani. Qarang, maydon katta bo'ldi va gap keyingi qatorga o'tdi. Burchagidagi chiziqlardan tortib, maydonni yana kattalashtirish mumkin.",
      'Теперь вместо input ставим textarea, то есть «текстовое поле». Смотри, поле стало большим, и предложение перешло на следующую строку. А за уголок в углу поле можно растянуть ещё.',
      'Now we put textarea instead of input. textarea means a text area. Look, the field got bigger and the sentence moved onto the next line. You can drag the little corner to make the field even bigger.'),
    sayClose: L3("Diqqat qiling: input'dan farqli, textarea yopuvchi teg bilan yoziladi. Teglar o'rtasiga yozilgan matn esa maydon ichida tayyor holda chiqadi. Qarang, Salom degan gap maydonning ichida turibdi.",
      'Обрати внимание: в отличие от input, textarea пишут с закрывающим тегом. А текст между тегами сразу появляется внутри поля. Смотри, приветствие уже стоит внутри.',
      'Note: unlike input, textarea has a closing tag. And the text between the tags appears inside the field right away. Look, the greeting is already inside.'),
    done: L3("Demak, textarea bir nechta qatorli katta maydon yasaydi va doim yopuvchi teg bilan yoziladi.", 'Значит, textarea делает большое поле на несколько строк и всегда пишется с закрывающим тегом.', 'So textarea makes a big field for several lines, and it always has a closing tag.'),
    asks: [
      L3("Qarang: input bitta qator", 'Смотри: input — одна строка', 'Watch: input is one line'),
      L3('Qarang: textarea tegi', 'Смотри: тег textarea', 'Watch: the textarea tag'),
      L3("Qarang: teglar o'rtasidagi matn", 'Смотри: текст между тегами', 'Watch: text between the tags')
    ],
    askDone: L3("textarea — katta maydon, yopuvchi teg bilan", 'textarea — большое поле, с закрывающим тегом', 'textarea — a big field, with a closing tag')
  },
  s6: {
    eyebrow: L3("Katta maydonni yig'ing", 'Собери большое поле', 'Build the big field'),
    say: L3("Endi katta maydonni o'zingiz yig'ing. Kodda to'rtta bo'sh joy bor: teg boshi, kulrang ishora, burchakli qavs va yopuvchi teg. Bitta bo'lak esa ortiqcha.",
      'Теперь собери большое поле сам. В коде четыре пустых места: начало тега, серая подсказка, уголок и закрывающий тег. А один кусок лишний.',
      'Now build the big field yourself. The code has four empty spots: the start of the tag, the grey hint, the bracket and the closing tag. And one piece isn’t needed.'),
    why: {
      type: L3("type atributi input uchun bo'ladi. textarea doim katta matn maydoni, unga type kerak emas.", 'Атрибут type — для input. textarea и так большое текстовое поле, type ему не нужен.', 'The type attribute is for input. textarea is always a big text field, so it doesn’t need type.'),
      open: L3("Teg doim burchakli qavs va nomi bilan boshlanadi. Oldin textarea boshini qo'ying.", 'Тег всегда начинается с уголка и имени. Сначала поставь начало textarea.', 'A tag always starts with a bracket and its name. Put the start of textarea first.'),
      ph: L3("Teg nomidan keyin atribut keladi: kulrang ishora.", 'После имени тега идёт атрибут — серая подсказка.', 'After the tag name comes the attribute: the grey hint.'),
      gt: L3("Atributdan keyin ochuvchi teg burchakli qavs bilan yopiladi.", 'После атрибута открывающий тег закрывается уголком.', 'After the attribute, the opening tag ends with a bracket.'),
      close: L3("Oxirida yopuvchi teg keladi. textarea'ga u albatta kerak bo'ladi.", 'В конце — закрывающий тег. textarea без него нельзя.', 'At the end comes the closing tag. textarea must have it.')
    },
    hints: [
      L3('Teg nima bilan boshlanadi?', 'С чего начинается тег?', 'What does a tag start with?'),
      L3("Birinchi bo'lib textarea boshi, keyin placeholder keladi.", 'Сначала начало textarea, потом placeholder.', 'First the start of textarea, then placeholder.'),
      L3("Tartib shunday bo'ladi: textarea boshi, placeholder, burchakli qavs va yopuvchi teg. type kerak emas.", 'Порядок такой: начало textarea, placeholder, уголок и закрывающий тег. type не нужен.', 'The order is: the start of textarea, placeholder, the bracket and the closing tag. No type.')
    ],
    ok: L3("Ajoyib! Katta maydon tayyor, ichida kulrang ishora turibdi. Ortiqcha bo'lakni ham to'g'ri tashlab ketdingiz.", 'Отлично! Большое поле готово, в нём серая подсказка. И лишний кусок ты правильно не взял.', 'Great! The big field is ready, with a grey hint inside. And you were right to leave the extra piece.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Bugun uchta yangi tegni ko'rdik: select, option va textarea. Har bir tegni sahifada u chiqaradigan narsa bilan juftlang. Oldin tegni bosing, keyin narsani bosing.",
      'Сегодня у нас три новых тега: select, option и textarea. Соедини каждый тег с тем, что он выводит на странице. Сначала нажми тег, потом вещь.',
      'Today we met three new tags: select, option and textarea. Match each tag with the thing it shows on the page. Tap a tag first, then the thing.'),
    cards: {
      select: L3("Ochiladigan ro'yxat", 'Выпадающий список', 'A drop-down list'),
      option: L3("Ro'yxatdagi bitta variant", 'Один вариант в списке', 'One choice in the list'),
      textarea: L3("Bir nechta qatorli katta maydon", 'Большое поле на несколько строк', 'A big field for several lines')
    },
    pairOk: {
      select: L3("To'g'ri! select ro'yxat yasaydi.", 'Верно! select делает список.', 'Right! select makes the list.'),
      option: L3("To'g'ri! option ro'yxatdagi bitta variant bo'ladi.", 'Верно! option — один вариант в списке.', 'Right! option is one choice in the list.'),
      textarea: L3("To'g'ri! textarea katta maydon yasaydi.", 'Верно! textarea делает большое поле.', 'Right! textarea makes a big field.')
    },
    why: {
      select: L3("select butun ro'yxatni yasaydi: yonida strelkasi bor maydon.", 'select делает весь список: поле со стрелкой.', 'select makes the whole list: a field with an arrow.'),
      option: L3("option ro'yxat ichidagi bitta qator bo'ladi.", 'option — одна строка внутри списка.', 'option is one line inside the list.'),
      textarea: L3("textarea bir nechta qatorli maydon bo'ladi.", 'textarea — поле на несколько строк.', 'textarea is a field for several lines.')
    },
    hints: [
      L3("Har bir narsaga qarang: u ro'yxatmi yoki maydonmi?", 'Посмотри на каждую вещь: это список или поле?', 'Look at each thing: is it a list or a field?'),
      L3("Strelkali maydon butun ro'yxat bo'ladi, ya'ni select degani.", 'Поле со стрелкой — весь список, то есть select.', 'The field with an arrow is the whole list: select.'),
      L3("Strelkali maydon select, bitta variant option, katta maydon esa textarea bo'ladi.", 'Поле со стрелкой — select, один вариант — option, большое поле — textarea.', 'The field with an arrow is select, one choice is option, and the big field is textarea.')
    ],
    ok: L3("Qoyil! Uchala tegni ham ko'rib turib ajratyapsiz.", 'Класс! Ты различаешь все три тега с первого взгляда.', 'Brilliant! You can tell all three tags apart at a glance.'),
    ask: L3("Tegni u chiqaradigan narsa bilan juftlang", 'Соедини тег с тем, что он выводит', 'Match each tag with what it shows'),
    askPlace: L3('Endi narsani bosing', 'Теперь нажми вещь', 'Now tap the thing'),
    pickFirst: L3('Oldin tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.')
  },
  s8: {
    eyebrow: L3('Tugma', 'Кнопка', 'The button'),
    say: L3("Anketa deyarli tayyor, faqat uni yuboradigan tugma yo'q. Keling, form ichiga tugma qo'shamiz.", 'Анкета почти готова, не хватает только кнопки, чтобы её отправить. Добавим кнопку внутрь form.', 'The form is almost ready; it only needs a button to send it. Let’s add a button inside form.'),
    sayBtn: L3("Bu button tegi. button inglizcha so'z, ya'ni tugma degani. Tugmaning yozuvi ochuvchi va yopuvchi teglar o'rtasiga yoziladi: Yuborish. Qarang, anketa ostida kulrang tugma chiqdi.",
      'Это тег button, то есть «кнопка». Надпись кнопки пишут между открывающим и закрывающим тегом: Отправить. Смотри, под анкетой появилась серая кнопка.',
      'This is the button tag. button means a button. The button’s label goes between the opening and closing tags: Send. Look, a grey button appeared under the form.'),
    saySent: L3("Tugmani bosdim. Tugma form ichida turgani uchun anketa yuborildi. Lekin bizda hali server yo'q. Server, ya'ni javoblarni qabul qiladigan kompyuter degani. Shuning uchun sahifa shunchaki qaytadan ochildi va maydonlar tozalandi. Haqiqiy saytlarda bu javoblar serverga boradi.",
      'Я нажал кнопку. Кнопка стоит внутри form, поэтому анкета отправилась. Но у нас пока нет места, которое принимает ответы, то есть сервера. Поэтому страница просто открылась заново, а поля очистились. На настоящих сайтах ответы уходят на сервер.',
      'I tapped the button. The button is inside form, so the form was sent. But we don’t have a place that receives the answers yet, a server. So the page just opened again and the fields were cleared. On real sites the answers go to a server.'),
    done: L3("Eslab qoling: button tugma yasaydi, form ichidagi tugma esa anketani yuboradi.", 'Запомни: button делает кнопку, а кнопка внутри form отправляет анкету.', 'Remember: button makes a button, and a button inside form sends the form.'),
    askBtn: L3('Qarang: button tegi', 'Смотри: тег button', 'Watch: the button tag'),
    askSent: L3('Qarang: anketa yuborildi', 'Смотри: анкета отправилась', 'Watch: the form is sent'),
    askDone: L3('button — tugma, form ichida — yuboradi', 'button — кнопка, в form — отправляет', 'button — a button; inside form it sends')
  },
  s9: {
    eyebrow: L3('Maydonni yoping', 'Закрой поле', 'Close the field'),
    say: L3("Voy, men textarea'ni yopishni unutibman! Qarang, brauzer tugma kodini ham maydon ichidagi matn deb o'yladi. Tugma esa yo'qoldi. textarea'dan keyin yopuvchi tegni yozing va «Tekshirish»ni bosing.",
      'Ой, я забыл закрыть textarea! Смотри, браузер решил, что код кнопки — тоже текст внутри поля. А сама кнопка пропала. Напиши закрывающий тег после textarea и нажми «Проверить».',
      'Oops, I forgot to close textarea! Look, the browser thought the button’s code was text inside the field too. And the button itself is gone. Type the closing tag after textarea and tap “Check”.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda nomdan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед именем стоит косая черта «/».', 'That’s the opening tag. The closing one has a slash “/” before the name.'),
      needLt: L3("Teg chap «<» qavs bilan boshlanadi. Uni boshiga qo'shing.", 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      needGt: L3("Teg oxirida o'ng «>» qavs turadi. Uni oxiriga qo'shing.", 'В конце тега нужен уголок «>». Добавь его в конец.', 'A tag ends with the bracket “>”. Add it at the end.'),
      wrongName: L3("Teg ichida boshqa nom yozilgan. Bu yerda textarea kerak bo'ladi.", 'Внутри тега другое имя. Здесь нужен textarea.', 'There’s a different name inside the tag. Here you need textarea.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darrov turadi.', 'Косая черта «/» стоит сразу после первого уголка.', 'The slash “/” goes right after the first bracket.')
    },
    hints: [
      L3('Maydon qayerda tugashi kerak?', 'Где должно кончаться поле?', 'Where should the field end?'),
      L3("Yopuvchi teg o'sha nom bo'ladi, faqat qiya chiziq bilan.", 'Закрывающий тег — то же имя, но с косой чертой.', 'The closing tag is the same name with a slash.'),
      L3("Oldin burchakli qavs, keyin qiya chiziq, keyin textarea va oxirida yana burchakli qavs qo'ying.", 'Сначала уголок, потом косая черта, потом textarea и в конце снова уголок.', 'First a bracket, then the slash, then textarea, and another bracket at the end.')
    ],
    ok: L3("Zo'r! Maydon yopildi va tugma joyiga qaytdi.", 'Огонь! Поле закрыто, и кнопка вернулась на место.', 'Awesome! The field is closed, and the button is back.'),
    ask: L3("textarea'ni yopuvchi teg bilan yoping", 'Закрой textarea закрывающим тегом', 'Close textarea with its closing tag')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Endi ikkita holatga qarang: oldin va keyin. Kodda bitta narsa qo'shildi va anketa boshqacha bo'lib qoldi. Xo'sh, nima qo'shildi?",
      'Теперь посмотри на два состояния: до и после. В код добавили одну вещь, и анкета изменилась. Ну и что добавили?',
      'Now look at two states: before and after. One thing was added to the code, and the form changed. So what was added?'),
    askQ: L3("Kodga nima qo'shildi?", 'Что добавили в код?', 'What was added to the code?'),
    ok: {
      opt: L3("To'g'ri! Yangi option qo'shildi, ro'yxatda bitta variant ko'paydi.", 'Верно! Добавили option — в списке стало на вариант больше.', 'Right! A new option was added, so the list has one more choice.'),
      close: L3("To'g'ri! Yopuvchi textarea qo'shildi, tugma maydondan chiqdi.", 'Верно! Добавили закрывающий textarea — кнопка вышла из поля.', 'Right! The closing textarea was added, so the button came out of the field.'),
      btn: L3("To'g'ri! button qo'shildi, anketa ostida tugma chiqdi.", 'Верно! Добавили button — под анкетой появилась кнопка.', 'Right! button was added, so a button appeared under the form.')
    },
    miss: {
      opt: L3("Qarang: oldin ro'yxatda kamroq variant bor edi, keyin bittasi qo'shildi. Variantni option qo'shadi.", 'Смотри: сначала вариантов было меньше, потом добавился ещё один. Вариант добавляет option.', 'Look: first there were fewer choices, then one more appeared. option adds a choice.'),
      close: L3("Qarang: oldin tugma kodi maydon ichida matn bo'lib turgan edi, keyin tugma chiqdi. Buni yopuvchi textarea qiladi.", 'Смотри: сначала код кнопки был текстом внутри поля, потом появилась кнопка. Это делает закрывающий textarea.', 'Look: first the button’s code was text inside the field, then the button appeared. The closing textarea does that.'),
      btn: L3("Qarang: oldin anketada tugma yo'q edi, keyin paydo bo'ldi. Tugmani button yasaydi.", 'Смотри: сначала кнопки не было, потом она появилась. Кнопку делает button.', 'Look: first there was no button, then it appeared. button makes a button.')
    },
    // Ступени подсказки (05.11.2026): 1 — сравнить карточки, 2 — что изменилось и какой тег это делает, 3 — причина и какую кнопку выбрать.
    hint1: L3("Oldin va keyin kartochkalarini solishtiring: anketada nima o'zgardi?", 'Сравни карточки «До» и «После»: что изменилось в анкете?', 'Compare the “Before” and “After” cards: what changed in the form?'),
    hint2: {
      opt: L3("Ro'yxatda nechta variant bor edi va nechta bo'ldi? Ro'yxatga variantni qaysi teg qo'shadi, esingizdami?", 'Сколько вариантов было в списке и сколько стало? Вспомни, какой тег добавляет вариант в список.', 'How many choices were in the list, and how many are there now? Remember which tag adds a choice to the list.'),
      close: L3("Oldin tugma kodi maydon ichida matn edi, keyin tugma chiqdi. Maydonni qaysi teg tugatadi, esingizdami?", 'Сначала код кнопки был текстом в поле, потом появилась кнопка. Вспомни, какой тег заканчивает поле.', 'First the button’s code was text in the field, then the button appeared. Remember which tag ends the field.'),
      btn: L3("Oldin anketa ostida hech narsa yo'q edi, keyin tugma chiqdi. Tugmani qaysi teg yasaydi, esingizdami?", 'Сначала под анкетой ничего не было, потом появилась кнопка. Вспомни, какой тег делает кнопку.', 'First there was nothing under the form, then a button appeared. Remember which tag makes a button.')
    },
    pick3: {
      opt: L3("Demak, option tegi yozilgan tugmani tanlang.", 'Значит, выбери кнопку с тегом option.', 'So choose the button with the option tag.'),
      close: L3("Demak, yopuvchi textarea tegi yozilgan tugmani tanlang.", 'Значит, выбери кнопку с закрывающим тегом textarea.', 'So choose the button with the closing textarea tag.'),
      btn: L3("Demak, button tegi yozilgan tugmani tanlang.", 'Значит, выбери кнопку с тегом button.', 'So choose the button with the button tag.')
    },
    done: L3("Endi anketa nimaga boshqacha ko'rinishini kodga qarab bilasiz. Keyin butun anketani birga o'qib chiqamiz.", 'Теперь ты по коду понимаешь, почему анкета выглядит так. Дальше прочитаем всю анкету вместе.', 'Now you can tell from the code why the form looks the way it does. Next, let’s read the whole form together.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After')
  },
  s11: {
    eyebrow: L3('Anketa butunlay', 'Анкета целиком', 'The whole form'),
    say: L3("Mana, butun anketa tayyor. Keling, brauzer uni qanday o'qishini ko'ramiz. Brauzer kodni har doimgidek tepadan pastga o'qiydi.", 'Вот вся анкета готова. Посмотрим, как браузер её читает: как всегда, сверху вниз.', 'Here’s the whole form, all done. Let’s see how the browser reads it: as always, from top to bottom.'),
    order1: L3("Oldin o'yin yozuvi va ochiladigan ro'yxat chiqdi. Bu yerda o'yin tanlanadi.", 'Сначала подпись про игру и выпадающий список. Здесь выбирают игру.', 'First the game caption and the drop-down list. This is where you pick the game.'),
    order2: L3("Keyin o'zingiz haqidagi yozuv va katta maydon chiqdi. Bu yerga bir nechta gap yoziladi.", 'Потом подпись «О себе» и большое поле. Сюда пишут несколько предложений.', 'Then the About you caption and the big field. This is where you write a few sentences.'),
    order3: L3("Eng oxirida tugma chiqdi. Hammasi form ichida, shuning uchun tugma butun anketani yuboradi.", 'И в самом конце — кнопка. Всё внутри form, поэтому кнопка отправляет всю анкету.', 'And at the very end, the button. Everything is inside form, so the button sends the whole form.'),
    ask: L3("Brauzer qanday o'qishini kuzating", 'Смотри, как читает браузер', 'Watch how the browser reads'),
    askDone: L3("Ro'yxat, katta maydon, tugma", 'Список, большое поле, кнопка', 'List, big field, button')
  },
  // Своя анкета — два экрана по «Готово»: надпись на кнопке, потом свой вариант в списке.
  s12: {
    eyebrow: L3('Tugmangiz yozuvi', 'Надпись своей кнопки', 'Your button’s label'),
    say: L3("Endi o'zingizning anketangizni yasang. Kodda form, katta maydon va tugma tayyor turibdi, faqat tugma yozuvi yo'q. Tugmada nima deb yozilsin? Shuni button teglari o'rtasiga yozing. Keyin «Tayyor»ni bosing.",
      'Теперь сделай свою анкету. В коде уже есть form, большое поле и кнопка, нет только надписи на кнопке. Что на ней написать? Впиши это между тегами button. Потом нажми «Готово».',
      'Now make your own form. The code already has form, a big field and a button; only the button’s label is missing. What should it say? Type it between the button tags. Then tap “Done”.'),
    ok: L3("Zo'r tugma! Endi ro'yxatingizga o'z variantingizni qo'shamiz.", 'Классная кнопка! Теперь добавим в список свой вариант.', 'Great button! Now let’s add your own choice to the list.'),
    hints: [
      L3("Tugmani bosganda nima bo'ladi? Shuni yozing.", 'Что будет, когда нажмут кнопку? Это и напиши.', 'What happens when someone taps the button? Write that.'),
      L3("Faqat so'z yozing, teglar joyida turibdi.", 'Пиши только слова — теги на месте.', 'Type only words: the tags are in place.'),
      L3("Masalan: Jo'natish. Keyin «Tayyor»ni bosing.", 'Например: Записаться. Потом нажми «Готово».', 'For example: Sign up. Then tap “Done”.')
    ],
    ask: L3("Tugma yozuvini yozing va «Tayyor»ni bosing", 'Напиши надпись кнопки и нажми «Готово»', 'Type the button label and tap “Done”'),
    ph: L3("Masalan: Jo'natish", 'Например: Записаться', 'For example: Sign up'),
    sample: L3("Jo'natish", 'Записаться', 'Sign up')
  },
  s13: {
    eyebrow: L3('Variantingiz', 'Свой вариант', 'Your choice'),
    say: L3("Endi ro'yxatga o'zingizning variantingizni qo'shing. Sizga qaysi o'yin yoqadi? Uni yangi option ichiga yozing va ro'yxatda u qanday chiqqanini ko'ring. Keyin «Tayyor»ni bosing.",
      'Теперь добавь в список свой вариант. Какая игра нравится тебе? Впиши её в новый option и посмотри, как она появилась в списке. Потом нажми «Готово».',
      'Now add your own choice to the list. What game do you like? Type it into the new option and see how it shows up in the list. Then tap “Done”.'),
    ok: L3("Ajoyib! Variantingiz ro'yxatga qo'shildi. Endi anketangizni ochgan odam uni tanlay oladi.", 'Отлично! Твой вариант в списке. Теперь его сможет выбрать любой, кто откроет анкету.', 'Great! Your choice is in the list. Now anyone who opens your form can pick it.'),
    hints: [
      L3("Sevimli o'yiningiz qaysi? Shuni yozing.", 'Какая твоя любимая игра? Это и напиши.', 'What’s your favorite game? Write that.'),
      L3("Faqat so'z yozing, option teglari joyida turibdi.", 'Пиши только слова — теги option на месте.', 'Type only words: the option tags are in place.'),
      L3("Masalan: Voleybol. Keyin «Tayyor»ni bosing.", 'Например: Волейбол. Потом нажми «Готово».', 'For example: Volleyball. Then tap “Done”.')
    ],
    ask: L3("Variantingizni yozing va «Tayyor»ni bosing", 'Напиши свой вариант и нажми «Готово»', 'Type your choice and tap “Done”'),
    ph: L3('Masalan: Voleybol', 'Например: Волейбол', 'For example: Volleyball'),
    sample: L3('Voleybol', 'Волейбол', 'Volleyball')
  },
  s14: {
    eyebrow: L3("Variant yo'qoldi", 'Пропал вариант', 'A choice is missing'),
    say: L3("Men ro'yxatingizga Basketbolni qo'shmoqchi edim va uni select ichiga shunchaki yozib qo'ydim. Lekin qarang, ro'yxatda u yo'q! To'g'ri qatorni bo'sh joyga olib boring.",
      'Я хотел добавить в твой список Баскетбол и просто написал его внутри select. Но смотри, в списке его нет! Перетащи правильную строку в пустое место.',
      'I wanted to add Basketball to your list and just wrote it inside select. But look, it’s not in the list! Drag the right line into the empty spot.'),
    why: {
      li: L3("li oddiy ro'yxat uchun bo'ladi: u ul va ol ichida turadi. select ichida u ishlamaydi.", 'li — для обычных списков ul и ol. Внутри select он не работает.', 'li is for ordinary ul and ol lists. It doesn’t work inside select.'),
      p: L3("p abzas yasaydi. Ochiladigan ro'yxatga u variant qo'shmaydi.", 'p делает абзац. В выпадающий список он вариант не добавит.', 'p makes a paragraph. It won’t add a choice to a drop-down list.')
    },
    // Ступени подсказки (05.11.2026): 1 — посмотреть на список, 2 — правило (как строки выше), 3 — какой кусок тащить (он загорается).
    hints: [
      L3("Brauzerga qarang: Basketbol ro'yxatga chiqdimi? Kodda unga nima yetishmayapti?", 'Посмотри на браузер: Баскетбол попал в список? Чего ему не хватает в коде?', 'Look at the browser: did Basketball make it into the list? What is it missing in the code?'),
      L3("Ochiladigan ro'yxatga variantni faqat bitta teg qo'sha oladi. Tepadagi qatorlarga qarang: o'yinlar qaysi teg ichida turibdi?", 'Вариант в выпадающий список может добавить только один тег. Посмотри на строки выше: в каком теге стоят игры?', 'Only one tag can add a choice to a drop-down list. Look at the lines above: which tag are the games in?'),
      L3("Tepadagi qatorlar kabi option tegi bilan yozilgan bo'lakni bo'sh joyga olib boring.", 'Перетащи в пустое место кусок с тегом option — как в строках выше.', 'Drag the piece with the option tag into the empty spot, just like the lines above.')
    ],
    ok: L3("Ana endi joyida! Basketbol ro'yxatga qo'shildi.", 'Вот теперь порядок! Баскетбол в списке.', 'That’s it! Basketball is in the list.'),
    ask: L3("To'g'ri qatorni bo'sh joyga olib boring", 'Перетащи правильную строку в пустое место', 'Drag the right line into the empty spot')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, klub anketasi, lekin unda xato bor. Brauzerga qarang: nima noto'g'ri ko'rinyapti? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот анкета клуба, но в ней ошибка. Посмотри на браузер: что выглядит не так? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the club form, but it has a bug. Look at the browser: what looks wrong? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi ro'yxatdan bitta o'yin yo'qoldi. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Теперь из списка пропала одна игра. Что сломано здесь?', 'Great, the first bug is found! Now one game is missing from the list. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan. Brauzerga qarang: nima joyida emas?", 'Эта строка в порядке. Посмотри на браузер: что не на месте?', 'This line is fine. Look at the browser: what’s out of place?'),
    found: {
      close: L3("Topdingiz! textarea yopilmagan edi. Shuning uchun tugma kodi maydon ichida matn bo'lib qolgan edi.", 'Есть! textarea не был закрыт. Поэтому код кнопки оказался текстом внутри поля.', 'Found it! textarea wasn’t closed. That’s why the button’s code ended up as text inside the field.'),
      opt: L3("Topdingiz! option so'zida bitta harf tushib qolgan edi. Brauzer bunday tegni bilmaydi, shuning uchun Futbol ro'yxatga chiqmagan edi.", 'Есть! В слове option пропала буква. Браузер не знает такого тега, поэтому Футбол не попал в список.', 'Found it! A letter was missing from the word option. The browser doesn’t know that tag, so Football didn’t make it into the list.')
    },
    hints: {
      close: [
        L3("Brauzerga qarang: tugma qayerda?", 'Посмотри на браузер: где кнопка?', 'Look at the browser: where’s the button?'),
        L3("Tugma kodi maydon ichida turibdi. Qaysi teg yopilmagan?", 'Код кнопки стоит внутри поля. Какой тег не закрыт?', 'The button’s code is inside the field. Which tag isn’t closed?'),
        L3("textarea qatoriga qarang: yopuvchi teg bormi?", 'Посмотри на строку textarea: есть закрывающий тег?', 'Look at the textarea line: is there a closing tag?')
      ],
      opt: [
        L3("Brauzerga qarang: ro'yxatda qaysi o'yin yo'q?", 'Посмотри на браузер: какой игры нет в списке?', 'Look at the browser: which game is missing from the list?'),
        L3("Futbol qatoriga qarang va teg nomini harfma-harf o'qing.", 'Посмотри на строку Футбол и прочитай имя тега по буквам.', 'Look at the Football line and read the tag name letter by letter.'),
        L3("Ikkinchi qatorga qarang: option to'liq yozilganmi?", 'Посмотри на вторую строку: option написан полностью?', 'Look at the second line: is option spelled in full?')
      ]
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz anketalarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь анкеты как настоящий программист.', 'Super! Both bugs are found. You check forms like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки (05.11.2026): 1 — как читать фразу, 2 — правила урока, 3 — причина и ответ (choiceHints).
    hint1: L3("Gapni bo'laklab o'qing: u qaysi teg haqida? Pastdagi kodga ham qarang.", 'Прочитай фразу по частям: о каком она теге? Посмотри и на код ниже.', 'Read the sentence piece by piece: which tag is it about? Look at the code below too.'),
    hint2: L3("select ichida har bir variant option tegida turadi, esingizdami? textarea va button esa yopuvchi teg bilan yoziladi. Gap shunga mos keladimi?",
      'Вспомни: в select каждый вариант стоит в теге option. А textarea и button пишут с закрывающим тегом. Фраза с этим совпадает?',
      'Remember: inside select, every choice sits in an option tag. And textarea and button are written with a closing tag. Does the sentence match that?'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3('textarea yopuvchi teg bilan yoziladi.', 'textarea пишут с закрывающим тегом.', 'textarea is written with a closing tag.'), right: true, code: 'ta',
        why: L3("Yopuvchi teg bo'lmasa, keyingi kod ham maydon ichidagi matnga aylanadi.", 'Без закрывающего тега и следующий код станет текстом внутри поля.', 'Without the closing tag, the code after it turns into text inside the field.') },
      { t: L3('button ham input kabi yopuvchi tegsiz yoziladi.', 'button, как и input, пишут без закрывающего тега.', 'Like input, button has no closing tag.'), right: false, code: 'btn',
        why: L3("button yopuvchi teg bilan yoziladi: tugma yozuvi teglar o'rtasida turadi.", 'button пишут с закрывающим тегом: надпись кнопки стоит между тегами.', 'button has a closing tag: the button’s label goes between the tags.') },
      { t: L3("select ichiga option tegisiz yozilgan so'z ham ro'yxatda chiqadi.", 'Слово внутри select без тега option тоже появится в списке.', 'A word inside select without an option tag still shows up in the list.'), right: false, code: 'bare',
        why: L3("option tegisiz so'zni brauzer ro'yxatga qo'shmaydi. Har bir variant option ichida bo'lishi kerak.", 'Без option браузер не добавит слово в список. Каждый вариант должен быть внутри option.', 'Without option the browser won’t add the word to the list. Each choice must be inside option.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz ro'yxat, katta maydon va tugmani yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь список, большое поле и кнопку.', 'All correct! You know the list, the big field and the button really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men select ichiga o'yinlar nomini shunchaki yozib qo'ygan edim? Afsuski, men adashibman. option tegisiz so'zlarni brauzer ro'yxatga qo'shmaydi, shuning uchun ro'yxat bo'm-bo'sh qoldi. Demak, har bir variantni option ichiga yozish kerak.",
        'Вернёмся к загадке. Помнишь, я просто написал названия игр внутри select? Увы, я ошибся. Без тега option браузер не добавляет слова в список, поэтому список остался совсем пустым. Значит, каждый вариант нужно писать внутри option.',
        'Back to our riddle. Remember, I just wrote the game names inside select? Sadly, I was wrong. Without the option tag the browser doesn’t add words to the list, so the list stayed completely empty. So every choice has to go inside option.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning anketangiz! Unda sizning variantingiz va sizning tugmangiz bor.", 'Смотри, это твоя анкета! В ней твой вариант и твоя кнопка.', 'Look, this is your form! It has your choice and your button.'), k: null },
      { text: L3("select ochiladigan ro'yxat yasaydi.", 'select делает выпадающий список.', 'select makes a drop-down list.'), k: 'select' },
      { text: L3("option ro'yxatdagi bitta variant bo'ladi.", 'option — один вариант в списке.', 'option is one choice in the list.'), k: 'option' },
      { text: L3("textarea bir nechta qatorli katta maydon yasaydi.", 'textarea делает большое поле на несколько строк.', 'textarea makes a big field for several lines.'), k: 'textarea' },
      { text: L3("button esa tugma yasaydi va form ichida anketani yuboradi.", 'А button делает кнопку, которая внутри form отправляет анкету.', 'And button makes a button that sends the form when it’s inside form.'), k: 'button' },
      { text: L3("Tabriklayman! Endi sahifangiz savol bera oladi, javob tanlata oladi va anketani yubora oladi. Keyingi darsda haqiqiy saytlar qanday qismlardan tuzilganini ko'ramiz. Ko'rishguncha!", 'Ура! Теперь твоя страница умеет спрашивать, предлагать выбор и отправлять анкету. На следующем уроке посмотрим, из каких частей состоят настоящие сайты. До встречи!', 'Hooray! Now your page can ask questions, offer choices and send a form. Next time we’ll see what parts real websites are made of. See you!'), k: null }
    ],
    roles: {
      select: L3("select — ro'yxat", 'select — список', 'select — list'),
      option: L3('option — variant', 'option — вариант', 'option — a choice'),
      textarea: L3('textarea — katta maydon', 'textarea — большое поле', 'textarea — big field'),
      button: L3('button — tugma', 'button — кнопка', 'button — a button')
    },
    ask: L3('Anketangizga qarang', 'Посмотри на свою анкету', 'Look at your form')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, why3: 1, pick3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, saySel: 1, sayOpt: 1, sayPick: 1, sayInput: 1, sayTa: 1, sayClose: 1,
  sayBtn: 1, saySent: 1, askQ: 1, rounds: 1, miss: 1, order1: 1, order2: 1, order3: 1, say2: 1, fine: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:z7-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:z7.css@*/
`;
