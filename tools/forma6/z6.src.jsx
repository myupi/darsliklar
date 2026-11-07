// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 6 — «Формы, часть 1: ввод данных»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/forma6/build.mjs → lessons/html/06-formy-vvod.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 6 · «Формы, часть 1: ввод данных» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Урок с нуля; основа кода — уроки 2–5. Облик — эталона «Редактор» (naborRedaktor);
// бумаги нет нигде. Коди открывает «Клуб игр», но на странице записи нельзя ничего написать — одни
// подписи. Ученик ставит поля (input), выбирает их вид (type: text, password, number), добавляет серые
// подсказки (placeholder), связывает подпись с полем (label) и собирает поля в анкету (form).
// Загадка (без имён): Коди написал полю пароля placeholder="Parol" и уверен, что пароль спрячется;
// в выводе признаёт ошибку — прячет type="password".
//
// ДУГА (17 экранов; экрана плана нет). Типы заданий — по разделу 3а навыка:
//   s1 крючок (подписи без полей → анкета с полями, загадка)
//   input:        s2 показ · s3 вписать имя тега (Fill in the Blanks) · s4 вещь на странице ↔ строка кода (Visual Code Mapping)
//   type:         s5 показ text → password → number · s6 собрать поле пароля (Code Builder) · s7 значение type ↔ вид поля (Matching Pairs)
//   placeholder:  s8 показ · s9 вписать имя атрибута (Fill in the Blanks) · s10 до и после (Before / After)
//   label и form: s11 показ · s12 своя подпись, s13 своя подсказка (Live Code Preview) · s14 вернуть "password" (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер (как Chrome): поле с рамкой; password — точки; number — цифры и стрелки; незнакомый
//     type — обычное поле; placeholder — серая подсказка, пока поле пустое; p над полем — подпись на своей
//     строке, label — подпись и поле в одну строку, нажатие на подпись выбирает поле; form не видна.
//   · Что пишет посетитель (значение в поле), в коде не появляется.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ: maydon — поле (draft); turi — вид поля; kulrang ishora — серая подсказка (draft);
// anketa — анкета (form, draft); parol, son. В речи input, type, placeholder, label, form, text,
// password, number — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-06-formy-vvod',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: "6-dars. Formalar, 1-qism: ma'lumot kiritish",
    ru: 'Урок 6. Формы, часть 1: ввод данных',
    en: 'Lesson 6. Forms, part 1: entering data'
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
  next: L3('Formalar, 2-qism', 'Формы, часть 2', 'Forms, part 2'),
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
    join: L3('Klubga yoziling!', 'Запишись в клуб!', 'Join the club!'),
    capGame: L3("Sevimli o'yiningiz:", 'Любимая игра:', 'Favorite game:'),
    capAge: L3('Yoshingiz:', 'Возраст:', 'Age:'),
    capPass: L3('Parol:', 'Пароль:', 'Password:'),
    capCity: L3('Shahringiz:', 'Город:', 'City:'),
    phGame: L3('Masalan, Minecraft', 'Например, Minecraft', 'For example, Minecraft'),
    phAge: L3('Masalan, 12', 'Например, 12', 'For example, 12'),
    phCity: L3('Masalan, Toshkent', 'Например, Ташкент', 'For example, Tashkent'),
    phPass: L3('Parol', 'Пароль', 'Password')
  },
  s1: {
    eyebrow: L3('Yozib bo\'lmaydi', 'Писать некуда', 'Nowhere to type'),
    say: L3("Salom! Men saytimda o'yinlar klubini ochdim. Klubga yozilish uchun sahifa ham yasadim. Lekin qarang: sahifada faqat yozuvlar bor, javob yozadigan joy esa yo'q. Bunday sahifaga hech kim hech narsa yoza olmaydi. Keling, buni to'g'rilaymiz. «Aylantirish» tugmasini bosing.",
      'Привет! Я открыл на сайте клуб игр и сделал страницу, чтобы в него записаться. Но смотри: на странице одни подписи, а места, куда писать ответ, нет. На такой странице никто ничего не напишет. Давай это исправим. Нажми «Превратить».',
      'Hi! I opened a games club on my site and made a page to join it. But look: the page only has captions, and there’s nowhere to type an answer. Nobody can write anything on a page like this. Let’s fix that. Tap “Transform”.'),
    magic: L3("Voy, qarang! Har bir yozuv yonida maydon paydo bo'ldi. Endi bu sahifa haqiqiy anketa bo'ldi.", 'Ого, смотри! Рядом с каждой подписью появилось поле. Теперь это настоящая анкета.', 'Whoa, look! A field appeared next to each caption. Now this page is a real form.'),
    magicP: L3("Men maydonlarni to'ldirib ko'rdim: o'yin nomi, yosh va parol. Qarang, parol esa nuqtalar bilan yashirindi.", 'Я заполнил поля: игра, возраст и пароль. Смотри, а пароль спрятался за точками.', 'I filled in the fields: the game, the age and the password. Look, the password is hidden behind dots.'),
    done: L3("Bugun shunday maydonlar yasashni o'rganasiz va o'zingizning anketangizni yasaysiz. Lekin oldin kichik topishmoq. Men boshqa sahifada parol maydonini yasadim va unga placeholder atributini qo'shib, Parol deb yozib qo'ydim. Menimcha, endi parol yozilganda u o'zi nuqtalar bilan yashirinadi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делать такие поля и сделаешь свою анкету. Но сначала маленькая загадка. Я сделал поле для пароля на другой странице, добавил ему атрибут placeholder и написал в нём слово «Пароль». По-моему, теперь пароль сам спрячется за точками. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make fields like these, and you’ll make your own form. But first, a little riddle. On another page I made a password field, added the placeholder attribute to it and wrote the word “Password” in it. I think the password will now hide behind dots by itself. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Endi sahifaga yozish mumkin", 'Теперь на странице можно писать', 'Now you can type on the page')
  },
  s2: {
    eyebrow: L3('input tegi', 'Тег input', 'The input tag'),
    say: L3("Keling, birinchi maydonni birga yasaymiz. Mana, klub sahifasi: sarlavha va o'yin haqidagi yozuv bor. Yozuvdan keyin bitta yangi teg qo'yamiz.",
      'Давай сделаем первое поле вместе. Вот страница клуба: заголовок и подпись про игру. После подписи ставим один новый тег.',
      'Let’s make the first field together. Here’s the club page: a heading and a caption about the game. After the caption we add one new tag.'),
    sayInput: L3("Bu input tegi. input inglizcha so'z, ya'ni kiritish degani. U sahifaga maydon qo'yadi: ramkali kichik quti, unga yozish mumkin. Qarang, yozuv ostida maydon chiqdi. Diqqat qiling: input ham img kabi yopuvchi tegsiz yoziladi.",
      'Это тег input. input — английское слово, то есть «ввод». Он ставит на страницу поле: маленькую рамку, в которую можно писать. Смотри, под подписью появилось поле. Обрати внимание: input, как и img, пишут без закрывающего тега.',
      'This is the input tag. input is an English word that means putting something in. It puts a field on the page: a small box you can type in. Look, a field appeared under the caption. Note: like img, input has no closing tag.'),
    sayTyped: L3("Endi maydonga Minecraft deb yozdim. Qarang, so'z sahifada paydo bo'ldi, lekin kodda u yo'q. Chunki maydonni kod emas, sahifaga kirgan odam to'ldiradi.",
      'Теперь я написал в поле слово Minecraft. Смотри: слово появилось на странице, а в коде его нет. Потому что поле заполняет не код, а человек, который открыл страницу.',
      'Now I typed the word Minecraft in the field. Look: the word showed up on the page, but it isn’t in the code. That’s because the field isn’t filled by the code, but by the person who opens the page.'),
    sayType: L3("Oxirida type atributini qo'shamiz. type inglizcha so'z, ya'ni tur degani: u maydon qanday maydon ekanini aytadi. Qiymati text bo'lsa, oddiy yozuv uchun maydon bo'ladi. Ko'rinishi o'zgarmadi, chunki maydon odatda shunday bo'ladi.",
      'В конце добавляем атрибут type. type — английское слово, то есть «вид»: он говорит, какое это поле. Значение text — поле для обычного текста. Вид не изменился: обычно поле такое и есть.',
      'Finally we add the type attribute. type is an English word for kind: it says what kind of field this is. The value text means a field for ordinary text. Nothing changed on screen, because that’s what a field is by default.'),
    done: L3("Eslab qoling: input sahifaga maydon qo'yadi, type esa maydon turini aytadi.", 'Запомни: input ставит на страницу поле, а type говорит, какое это поле.', 'Remember: input puts a field on the page, and type says what kind of field it is.'),
    askInput: L3('Qarang: input tegi', 'Смотри: тег input', 'Watch: the input tag'),
    askTyped: L3('Qarang: maydonga yozildi', 'Смотри: в поле написали', 'Watch: someone typed in the field'),
    askType: L3('Qarang: type atributi', 'Смотри: атрибут type', 'Watch: the type attribute'),
    askDone: L3('input — maydon, type — uning turi', 'input — поле, type — его вид', 'input — a field, type — its kind')
  },
  s3: {
    eyebrow: L3('Teg nomini yozing', 'Впиши имя тега', 'Type the tag name'),
    say: L3("Endi navbat sizga. Kodda burchakli qavsdan keyin teg nomi yo'q. Shuning uchun brauzer hech narsa chiqarmadi. Maydon yasaydigan teg nomini yozing va «Tekshirish»ni bosing.",
      'Теперь твоя очередь. В коде после уголка нет имени тега. Поэтому браузер ничего не вывел. Впиши имя тега, который делает поле, и нажми «Проверить».',
      'Now it’s your turn. In the code there’s no tag name after the bracket, so the browser shows nothing. Type the name of the tag that makes a field and tap “Check”.'),
    msgs: {
      empty: L3('Burchakli qavsdan keyin teg nomini yozing.', 'Впиши имя тега после уголка.', 'Type the tag name after the bracket.'),
      brackets: L3("Qavslar joyida turibdi. Bu yerga faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      other: L3("Bu teg boshqa ish qiladi. Bizga yozish mumkin bo'lgan maydon kerak.", 'Этот тег делает другое. Нам нужно поле, в которое можно писать.', 'That tag does something else. We need a field you can type in.'),
      typo: L3("Bunday teg yo'q, shuning uchun brauzer hech narsa chiqarmadi. Nomni harfma-harf yozing.", 'Такого тега нет, поэтому браузер ничего не вывел. Напиши имя буква в букву.', 'There’s no such tag, so the browser shows nothing. Type the name letter by letter.')
    },
    hints: [
      L3("Qaysi teg sahifaga maydon qo'yadi?", 'Какой тег ставит на страницу поле?', 'Which tag puts a field on the page?'),
      L3("Uning nomi inglizcha, ya'ni kiritish degani. U i harfi bilan boshlanadi.", 'Его имя английское, то есть «ввод». Оно начинается с буквы i.', 'Its name is English for putting something in. It starts with the letter i.'),
      L3("Teg nomi input bo'ladi. Uni burchakli qavsdan keyin yozing.", 'Имя тега — input. Впиши его после уголка.', 'The tag name is input. Type it after the bracket.')
    ],
    ok: L3("Zo'r! Maydon chiqdi. Endi bu sahifaga o'yin nomini yozish mumkin.", 'Огонь! Поле появилось. Теперь на этой странице можно написать название игры.', 'Awesome! The field appeared. Now you can type a game name on this page.'),
    ask: L3('Maydon yasaydigan teg nomini yozing', 'Впиши имя тега, который делает поле', 'Type the name of the tag that makes a field')
  },
  s4: {
    eyebrow: L3('Kod va sahifa', 'Код и страница', 'Code and page'),
    say: L3("Sahifada ikkita yozuv va ikkita maydon bor. Kodda esa beshta qator. Sahifada bitta narsa yonadi. Siz kodda uni chiqargan qatorni bosing.",
      'На странице две подписи и два поля. А в коде пять строк. На странице загорается одна вещь. А ты нажми в коде строку, которая её выводит.',
      'The page has two captions and two fields, and the code has five lines. One thing lights up on the page. Tap the line in the code that shows it.'),
    askQ: L3("Yongan narsani qaysi qator chiqaradi?", 'Какая строка выводит то, что горит?', 'Which line shows what’s lit up?'),
    rounds: [
      null,
      L3("Endi sahifada yozuv yondi. Uni qaysi qator chiqaradi?", 'Теперь горит подпись. Какая строка её выводит?', 'Now a caption is lit. Which line shows it?'),
      L3("Oxirgisi. Endi birinchi maydon yondi. Kodda ikkita bir xil qator bor. Qaysi biri bu maydonni chiqaradi?", 'Последняя. Теперь горит первое поле. В коде две одинаковые строки. Какая из них выводит это поле?', 'The last one. Now the first field is lit. The code has two identical lines. Which one shows this field?')
    ],
    ok: [
      L3("To'g'ri! Pastki input qatori ikkinchi maydonni chiqaradi.", 'Верно! Нижняя строка input выводит второе поле.', 'Right! The lower input line shows the second field.'),
      L3("To'g'ri! Yozuvni p tegi chiqaradi, maydonni esa input.", 'Верно! Подпись выводит тег p, а поле — input.', 'Right! The p tag shows the caption, and input shows the field.'),
      L3("To'g'ri! Brauzer kodni tepadan pastga o'qiydi: birinchi input birinchi maydon bo'ladi.", 'Верно! Браузер читает код сверху вниз: первый input — первое поле.', 'Right! The browser reads the code top to bottom: the first input is the first field.')
    ],
    miss: {
      fld: L3("Bu qator boshqa narsani chiqaradi. Maydonni input qatori chiqaradi. Tartibga qarang: brauzer kodni tepadan pastga o'qiydi.", 'Эта строка выводит другое. Поле выводит строка input. Смотри на порядок: браузер читает код сверху вниз.', 'This line shows something else. A field comes from an input line. Watch the order: the browser reads the code top to bottom.'),
      cap: L3("Bu qator boshqa narsani chiqaradi. Yozuvni p tegi chiqaradi. Qaysi p qatorida aynan shu so'zlar bor?", 'Эта строка выводит другое. Подпись выводит тег p. В какой строке p именно эти слова?', 'This line shows something else. A caption comes from a p tag. Which p line has exactly these words?')
    },
    done: L3("Barakalla! Endi qaysi qator maydon, qaysi qator yozuv chiqarishini bilasiz.", 'Молодец! Теперь ты знаешь, какая строка делает поле, а какая — подпись.', 'Well done! Now you know which line makes a field and which makes a caption.'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило раунда, 3 — какую строку нажать (она загорается).
    hint1: L3("Sahifada nima yonayotganiga qarang: yozuvmi yoki maydonmi?", 'Посмотри, что горит на странице: подпись или поле?', 'Look at what’s lit on the page: a caption or a field?'),
    hint2: {
      fld: L3("Maydonni input qatori chiqaradi. Kodda ikkita input bor: birinchisi tepadagi maydon, ikkinchisi pastdagi maydon bo'ladi.", 'Поле выводит строка input. В коде их две: первая — верхнее поле, вторая — нижнее.', 'A field comes from an input line. The code has two: the first is the top field, the second is the bottom one.'),
      cap: L3("Yozuvni p tegi chiqaradi. Sahifadagi so'zlarni p qatorlaridagi so'zlar bilan solishtiring.", 'Подпись выводит тег p. Сравни слова на странице со словами в строках p.', 'A caption comes from a p tag. Compare the words on the page with the words in the p lines.')
    },
    hint3: [
      L3("Yongan maydon pastda turibdi. Kodda eng oxirgi input qatorini bosing.", 'Горящее поле — нижнее. Нажми в коде самую последнюю строку input.', 'The lit field is the bottom one. Tap the very last input line in the code.'),
      L3("Yongan yozuv tepada turibdi. Kodda shu so'zlar yozilgan birinchi p qatorini bosing.", 'Горящая подпись — верхняя. Нажми в коде первую строку p с этими словами.', 'The lit caption is the top one. Tap the first p line with these words in the code.'),
      L3("Yongan maydon tepada turibdi. Kodda birinchi input qatorini bosing, u ikkinchi p qatoridan oldin keladi.", 'Горящее поле — верхнее. Нажми в коде первую строку input, она стоит перед второй строкой p.', 'The lit field is the top one. Tap the first input line in the code; it comes before the second p line.')
    ]
  },
  s5: {
    eyebrow: L3('Maydon turlari', 'Виды полей', 'Kinds of fields'),
    say: L3("Maydonlar har xil bo'ladi. Ularning turini type atributi tanlaydi. Keling, bitta maydonning turini almashtirib ko'ramiz.",
      'Поля бывают разные. Их вид выбирает атрибут type. Давай поменяем вид одного поля и посмотрим.',
      'Fields come in different kinds. The type attribute chooses the kind. Let’s change the kind of one field and see.'),
    sayText: L3("Mana, parol maydoni. Lekin type qiymati text bo'lgani uchun, parol hammaga ochiq ko'rinib turibdi. Yoningizda o'tirgan odam ham uni o'qib oladi.",
      'Вот поле пароля. Но значение type — text, поэтому пароль виден всем. Его прочтёт даже тот, кто сидит рядом.',
      'Here’s a password field. But the type value is text, so the password is visible to everyone. Even the person sitting next to you can read it.'),
    sayPass: L3("Endi qiymatni password qilamiz. password ya'ni parol degani. Qarang, harflar nuqtalar bilan yashirindi. Maydonga yozilgan narsa o'zgarmadi, faqat ko'rinmay qoldi.",
      'Теперь ставим значение password, то есть «пароль». Смотри, буквы спрятались за точками. То, что написано в поле, не изменилось, просто не видно.',
      'Now we set the value to password. Look, the letters are hidden behind dots. What’s typed in the field didn’t change; you just can’t see it.'),
    sayNum: L3("Endi yosh uchun maydon yasaymiz va qiymatni number qilamiz. number ya'ni son degani. Bunday maydonga faqat son yoziladi, harflar yozilmaydi. Yonida esa kichik strelkalar chiqdi: ular sonni bittaga oshiradi yoki kamaytiradi.",
      'А теперь поле для возраста со значением number, то есть «число». В такое поле пишутся только цифры, буквы не вводятся. А справа появились маленькие стрелки: они прибавляют или убавляют число на один.',
      'Now a field for age with the value number. Only digits can be typed in a field like this; letters won’t go in. And small arrows appeared on the right: they make the number one bigger or smaller.'),
    done: L3("Demak, type maydon turini tanlaydi: text oddiy yozuv uchun, password parol uchun, number esa son uchun bo'ladi.", 'Значит, type выбирает вид поля: text — для обычного текста, password — для пароля, а number — для числа.', 'So type chooses the kind of field: text for ordinary text, password for passwords, and number for numbers.'),
    asks: {
      text: L3('Qarang: type text', 'Смотри: type text', 'Watch: type text'),
      password: L3('Qarang: type password', 'Смотри: type password', 'Watch: type password'),
      number: L3('Qarang: type number', 'Смотри: type number', 'Watch: type number')
    },
    askDone: L3('text, password, number', 'text, password, number', 'text, password, number')
  },
  s6: {
    eyebrow: L3("Parol maydonini yig'ing", 'Собери поле пароля', 'Build the password field'),
    say: L3("Endi parol maydonini o'zingiz yig'ing. Kodda beshta bo'sh joy bor. Bo'laklarni tartib bilan qo'ying: teg boshi, atribut nomi, teng belgisi, qo'shtirnoq ichida qiymat va oxirida burchakli qavs. Bitta bo'lak esa ortiqcha.",
      'Теперь собери поле пароля сам. В коде пять пустых мест. Ставь куски по порядку: начало тега, имя атрибута, знак «равно», значение в кавычках и в конце уголок. А один кусок лишний.',
      'Now build the password field yourself. The code has five empty spots. Put the pieces in order: the start of the tag, the attribute name, the equals sign, the value in quotes, and a bracket at the end. And one piece isn’t needed.'),
    why: {
      close: L3("input tegida yopuvchi teg bo'lmaydi. Bu bo'lak ortiqcha.", 'У input нет закрывающего тега. Этот кусок лишний.', 'input has no closing tag. This piece isn’t needed.'),
      open: L3("Teg doim burchakli qavs va nomi bilan boshlanadi. Oldin input boshini qo'ying.", 'Тег всегда начинается с уголка и имени. Сначала поставь начало input.', 'A tag always starts with a bracket and its name. Put the start of input first.'),
      type: L3("Teg nomidan keyin atribut nomi keladi: type.", 'После имени тега идёт имя атрибута: type.', 'After the tag name comes the attribute name: type.'),
      eq: L3("Atribut nomidan keyin teng belgisi keladi.", 'После имени атрибута идёт знак «равно».', 'After the attribute name comes the equals sign.'),
      val: L3("Teng belgisidan keyin qo'shtirnoq ichida qiymat keladi.", 'После знака «равно» идёт значение в кавычках.', 'After the equals sign comes the value in quotes.'),
      gt: L3("Hammasi joyida. Oxirida teg burchakli qavs bilan yopiladi.", 'Всё на месте. В конце тег закрывается уголком.', 'Everything’s in place. At the end the tag closes with a bracket.')
    },
    hints: [
      L3('Teg nima bilan boshlanadi?', 'С чего начинается тег?', 'What does a tag start with?'),
      L3("Birinchi bo'lib input boshi, keyin type va teng belgisi keladi.", 'Сначала начало input, потом type и знак «равно».', 'First the start of input, then type and the equals sign.'),
      L3("Tartib shunday bo'ladi: input boshi, type, teng belgisi, password qiymati va burchakli qavs. Yopuvchi teg kerak emas.", 'Порядок такой: начало input, type, знак «равно», значение password и уголок. Закрывающий тег не нужен.', 'The order is: the start of input, type, the equals sign, the value password and the bracket. No closing tag.')
    ],
    ok: L3("Ajoyib! Parol maydoni tayyor, parol esa nuqtalar ortida yashirindi. Ortiqcha bo'lakni ham to'g'ri tashlab ketdingiz.", 'Отлично! Поле пароля готово, а пароль спрятался за точками. И лишний кусок ты правильно не взял.', 'Great! The password field is ready, and the password is hidden behind dots. And you were right to leave the extra piece.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Mana, uchta maydon. Ularning turi har xil. type qiymatini maydonning o'zi bilan juftlang. Oldin qiymatni bosing, keyin maydonni bosing.",
      'Вот три поля разного вида. Соедини значение type с самим полем. Сначала нажми значение, потом поле.',
      'Here are three fields of different kinds. Match each type value with its field. Tap a value first, then a field.'),
    cards: {
      text: L3("Yozuv ochiq ko'rinadi", 'Текст виден', 'The text is visible'),
      password: L3('Harflar nuqta bilan yashiringan', 'Буквы спрятаны за точками', 'The letters are hidden behind dots'),
      number: L3('Faqat son va strelkalar', 'Только число и стрелки', 'Only a number and arrows')
    },
    pairOk: {
      text: L3("To'g'ri! text bilan yozuv ochiq ko'rinadi.", 'Верно! С text текст виден.', 'Right! With text, the text is visible.'),
      password: L3("To'g'ri! password parolni nuqtalar bilan yashiradi.", 'Верно! password прячет пароль за точками.', 'Right! password hides the password behind dots.'),
      number: L3("To'g'ri! number faqat son qabul qiladi.", 'Верно! number принимает только число.', 'Right! number only takes a number.')
    },
    why: {
      text: L3("text oddiy maydon bo'ladi: unda yozuv ochiq ko'rinadi.", 'text — обычное поле: текст в нём виден.', 'text is an ordinary field: the text in it is visible.'),
      password: L3("password parol uchun bo'ladi: u harflarni nuqtalar bilan yashiradi.", 'password — для пароля: он прячет буквы за точками.', 'password is for passwords: it hides the letters behind dots.'),
      number: L3("number son uchun bo'ladi: yonida strelkalar chiqadi.", 'number — для числа: справа у него стрелки.', 'number is for numbers: it has arrows on the right.')
    },
    hints: [
      L3('Har bir maydonga qarang: unda nima bor?', 'Посмотри на каждое поле: что в нём?', 'Look at each field: what’s in it?'),
      L3("Nuqtalar bor maydon password bo'ladi.", 'Поле с точками — password.', 'The field with dots is password.'),
      L3("Nuqtalar password, strelkalar number, ochiq yozuv esa text bo'ladi.", 'Точки — password, стрелки — number, а видимый текст — text.', 'Dots are password, arrows are number, and visible text is text.')
    ],
    ok: L3("Qoyil! Maydon turlarini ko'rib turib ajratyapsiz.", 'Класс! Ты различаешь виды полей с первого взгляда.', 'Brilliant! You can tell the kinds of fields apart at a glance.'),
    ask: L3('type qiymatini maydon bilan juftlang', 'Соедини значение type с полем', 'Match each type value with a field'),
    askPlace: L3('Endi maydonni bosing', 'Теперь нажми поле', 'Now tap a field'),
    pickFirst: L3('Oldin qiymatni bosing.', 'Сначала нажми значение.', 'Tap a value first.')
  },
  s8: {
    eyebrow: L3('Kulrang ishora', 'Серая подсказка', 'The grey hint'),
    say: L3("Bo'sh maydonga qarang. Sahifaga kirgan odam unga nima yozishni qayerdan biladi? Buning uchun maxsus atribut bor.",
      'Посмотри на пустое поле. Откуда человек на странице узнает, что в него писать? Для этого есть особый атрибут.',
      'Look at the empty field. How does someone on the page know what to type in it? There’s a special attribute for that.'),
    sayPh: L3("Bu placeholder atributi. placeholder inglizcha so'z, ya'ni joy egallab turuvchi degani. Maydon bo'sh turganda ichida kulrang ishora ko'rinadi: masalan, Minecraft. U nima yozishni ko'rsatib turadi.",
      'Это атрибут placeholder. placeholder — английское слово, то есть «то, что держит место». Пока поле пустое, внутри видна серая подсказка: например, Minecraft. Она показывает, что писать.',
      'This is the placeholder attribute. placeholder is an English word for something that holds a place. While the field is empty, a grey hint shows inside: for example, Minecraft. It shows what to type.'),
    sayTyped: L3("Endi maydonga Futbol deb yozdim. Qarang, kulrang ishora yo'qoldi. Demak, placeholder javobning o'zi emas, faqat maslahat bo'ladi.",
      'Теперь я написал в поле слово Футбол. Смотри, серая подсказка исчезла. Значит, placeholder — не сам ответ, а только подсказка.',
      'Now I typed the word Football in the field. Look, the grey hint disappeared. So placeholder isn’t the answer itself, just a hint.'),
    sayBack: L3("Yozuvni o'chirsak, maydon yana bo'sh qoladi va kulrang ishora qaytib keladi.", 'Если стереть текст, поле снова пустое, и серая подсказка возвращается.', 'If we erase the text, the field is empty again and the grey hint comes back.'),
    done: L3("Eslab qoling: placeholder bo'sh maydonda kulrang ishora ko'rsatadi, yozishni boshlasangiz, u yo'qoladi.", 'Запомни: placeholder показывает серую подсказку в пустом поле, а когда начинаешь писать, она исчезает.', 'Remember: placeholder shows a grey hint in an empty field, and it disappears when you start typing.'),
    askPh: L3('Qarang: placeholder', 'Смотри: placeholder', 'Watch: placeholder'),
    askTyped: L3("Qarang: yozilganda ishora yo'qoladi", 'Смотри: когда пишешь, подсказка исчезает', 'Watch: the hint disappears as you type'),
    askBack: L3('Qarang: ishora qaytdi', 'Смотри: подсказка вернулась', 'Watch: the hint is back'),
    askDone: L3("placeholder — bo'sh maydondagi ishora", 'placeholder — подсказка в пустом поле', 'placeholder — a hint in an empty field')
  },
  s9: {
    eyebrow: L3('Atribut nomini yozing', 'Впиши имя атрибута', 'Type the attribute name'),
    say: L3("Yosh maydonida ishora matni bor, lekin atribut nomi yo'q. Shuning uchun maydon bo'sh va ishorasiz turibdi. Kulrang ishora chiqaradigan atribut nomini yozing va «Tekshirish»ni bosing.",
      'У поля возраста есть текст подсказки, но нет имени атрибута. Поэтому поле пустое, без подсказки. Впиши имя атрибута, который показывает серую подсказку, и нажми «Проверить».',
      'The age field has the hint text, but no attribute name. That’s why the field is empty, with no hint. Type the name of the attribute that shows the grey hint and tap “Check”.'),
    msgs: {
      empty: L3('Bo\'sh joyga atribut nomini yozing.', 'Впиши имя атрибута в пустое место.', 'Type the attribute name in the empty spot.'),
      extra: L3("Teng belgisi va qo'shtirnoq joyida turibdi. Bu yerga faqat atribut nomini yozing.", 'Знак «равно» и кавычки уже на месте. Здесь нужно только имя атрибута.', 'The equals sign and the quotes are already there. Only the attribute name goes here.'),
      type: L3("type maydon turini aytadi va u kodda bor. Bizga kulrang ishora chiqaradigan atribut kerak.", 'type задаёт вид поля, и он в коде уже есть. Нам нужен атрибут серой подсказки.', 'type gives the kind of field, and it’s already in the code. We need the attribute for the grey hint.'),
      typo: L3("Bunday atribut yo'q, shuning uchun brauzer ishorani ko'rsatmadi. Nomni harfma-harf yozing.", 'Такого атрибута нет, поэтому браузер не показал подсказку. Напиши имя буква в букву.', 'There’s no such attribute, so the browser didn’t show the hint. Type the name letter by letter.')
    },
    hints: [
      L3("Qaysi atribut kulrang ishora chiqaradi?", 'Какой атрибут показывает серую подсказку?', 'Which attribute shows the grey hint?'),
      L3("U inglizcha, ya'ni joy egallab turuvchi degani. p harfi bilan boshlanadi.", 'Он английский, то есть «то, что держит место». Начинается с буквы p.', 'It’s English for something that holds a place. It starts with the letter p.'),
      L3("Atribut nomi placeholder bo'ladi. Uni harfma-harf yozing.", 'Имя атрибута — placeholder. Напиши его буква в букву.', 'The attribute name is placeholder. Type it letter by letter.')
    ],
    ok: L3("Zo'r! Kulrang ishora chiqdi. Endi har kim bu yerga yoshini yozish kerakligini tushunadi.", 'Огонь! Серая подсказка появилась. Теперь каждый поймёт, что здесь пишут возраст.', 'Awesome! The grey hint appeared. Now everyone will understand that this is where the age goes.'),
    ask: L3('Kulrang ishora atributi nomini yozing', 'Впиши имя атрибута серой подсказки', 'Type the name of the grey hint attribute')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Endi ikkita holatga qarang: oldin va keyin. Kodda bitta narsa o'zgardi va maydon boshqacha bo'lib qoldi. Xo'sh, nima o'zgardi?",
      'Теперь посмотри на два состояния: до и после. В коде изменилась одна вещь, и поле стало другим. Ну и что изменилось?',
      'Now look at two states: before and after. One thing changed in the code, and the field changed. So what changed?'),
    askQ: L3("Kodda nima o'zgardi?", 'Что изменилось в коде?', 'What changed in the code?'),
    ok: {
      pass: L3("To'g'ri! type password bo'ldi, harflar nuqtalarga aylandi.", 'Верно! type стал password, буквы превратились в точки.', 'Right! type became password, so the letters turned into dots.'),
      ph: L3("To'g'ri! placeholder qo'shildi, bo'sh maydonda kulrang ishora chiqdi.", 'Верно! Добавили placeholder — в пустом поле появилась серая подсказка.', 'Right! placeholder was added, so a grey hint showed up in the empty field.'),
      num: L3("To'g'ri! type number bo'ldi, yonida strelkalar chiqdi.", 'Верно! type стал number — справа появились стрелки.', 'Right! type became number, so arrows appeared on the right.')
    },
    miss: {
      pass: L3("Qarang: oldin harflar ochiq edi, keyin nuqtalar bo'ldi. Harflarni type password yashiradi.", 'Смотри: сначала буквы были видны, потом стали точками. Буквы прячет type password.', 'Look: first the letters were visible, then they became dots. type password hides letters.'),
      ph: L3("Qarang: oldin maydon bo'sh edi, keyin unda kulrang ishora chiqdi. Ishorani placeholder beradi.", 'Смотри: сначала поле было пустым, потом в нём появилась серая подсказка. Подсказку даёт placeholder.', 'Look: first the field was empty, then a grey hint appeared in it. placeholder gives the hint.'),
      num: L3("Qarang: son o'sha-o'sha, lekin keyin yonida strelkalar chiqdi. Strelkalar type number bilan chiqadi.", 'Смотри: число то же самое, но после справа появились стрелки. Стрелки бывают у type number.', 'Look: the number is the same, but after, arrows appeared on the right. Arrows come with type number.')
    },
    done: L3("Endi maydon nimaga boshqacha ko'rinishini kodga qarab bilasiz. Keyin yozuvni maydonga bog'laymiz.", 'Теперь ты по коду понимаешь, почему поле выглядит так. Дальше свяжем подпись с полем.', 'Now you can tell from the code why a field looks the way it does. Next, let’s connect a caption to a field.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After'),
    // Ступени подсказки (лампочка): 1 — куда смотреть, 2 — по виду раунда, 3 — причина и какой ответ выбрать.
    hint1: L3("Oldingi va keyingi maydonni solishtiring: maydonda nima o'zgardi?", 'Сравни поле «до» и «после»: что в нём изменилось?', 'Compare the field before and after: what changed in it?'),
    hint2: {
      pass: L3("Yozilgan harflarga qarang: ular ko'rinib turibdimi yoki yashirindimi? Harflarni qaysi type yashiradi, esingizdami?", 'Посмотри на буквы: они видны или спрятались? Вспомни, какой type прячет буквы.', 'Look at the letters: can you see them, or are they hidden? Remember which type hides letters.'),
      ph: L3("Bo'sh maydonda kulrang so'zlar paydo bo'ldimi? Bo'sh maydonga ishorani qaysi atribut beradi, esingizdami?", 'В пустом поле появились серые слова? Вспомни, какой атрибут даёт подсказку в пустом поле.', 'Did grey words appear in the empty field? Remember which attribute gives a hint in an empty field.'),
      num: L3("Son o'zgarmadi. Maydonning o'ng tomoniga qarang: u yerda nima paydo bo'ldi? Strelkalar qaysi type bilan chiqadi, esingizdami?", 'Число не изменилось. Посмотри на правый край поля: что там появилось? Вспомни, с каким type бывают стрелки.', 'The number didn’t change. Look at the right edge of the field: what appeared there? Remember which type comes with arrows.')
    },
    // Как назвать кнопку в третьей ступени — словами, без кавычек и знаков (подсказка звучит).
    pick: { pass: L3('password', 'password', 'password'), ph: L3('placeholder', 'placeholder', 'placeholder'), num: L3('number', 'number', 'number') }
  },
  s11: {
    eyebrow: L3('label va form', 'label и form', 'label and form'),
    say: L3("Hozir yozuv va maydon alohida turibdi: yozuv p tegida, maydon esa uning ostida. Kichik ekranda maydonga tegish qiyin. Keling, yozuvni bosib ko'ramiz.",
      'Сейчас подпись и поле живут отдельно: подпись в теге p, а поле под ней. На маленьком экране попасть в поле трудно. Давай нажмём на подпись.',
      'Right now the caption and the field are separate: the caption is in a p tag, and the field is under it. On a small screen the field is hard to hit. Let’s tap the caption.'),
    sayNoLabel: L3("Yozuv bosildi, lekin hech narsa bo'lmadi. Maydon tanlanmadi, chunki brauzer yozuv aynan shu maydonniki ekanini bilmaydi.",
      'Подпись нажата, но ничего не случилось. Поле не выбралось, потому что браузер не знает, что подпись относится к этому полю.',
      'The caption was tapped, but nothing happened. The field wasn’t selected, because the browser doesn’t know the caption belongs to this field.'),
    sayLabel: L3("Endi yozuv bilan maydonni label tegiga o'raymiz. label inglizcha so'z, ya'ni yozuv yoki nom degani. U yozuvni maydonga bog'laydi. Qarang, yozuv va maydon bitta qatorga o'tdi.",
      'Теперь обернём подпись и поле в тег label. label — английское слово, то есть «подпись». Он связывает подпись с полем. Смотри, подпись и поле встали в одну строку.',
      'Now let’s wrap the caption and the field in the label tag. label is an English word for a caption or name tag. It ties the caption to the field. Look, the caption and the field are now on one line.'),
    sayFocus: L3("Yozuvni yana bosamiz. Qarang, maydon o'zi tanlandi va yozishga tayyor bo'ldi. Endi kichik maydonni qidirish shart emas: yozuvga tegish ham yetadi.",
      'Нажмём на подпись ещё раз. Смотри, поле само выбралось и готово к вводу. Теперь не нужно целиться в маленькое поле: достаточно коснуться подписи.',
      'Let’s tap the caption again. Look, the field got selected by itself and is ready for typing. Now you don’t have to aim for the small field: touching the caption is enough.'),
    sayForm: L3("Oxirida hamma maydonlarni form tegiga o'raymiz. form ya'ni anketa degani: u maydonlarni bitta anketaga yig'adi. Sahifada u ko'rinmaydi. Lekin keyingi darsda tugma bilan anketani yuborganimizda, aynan form kerak bo'ladi.",
      'В конце обернём все поля в тег form, то есть «анкета». Он собирает поля в одну анкету. На странице его не видно. Но на следующем уроке, когда будем отправлять анкету кнопкой, понадобится именно form.',
      'Finally we wrap all the fields in the form tag. form gathers the fields into one form. You can’t see it on the page. But next lesson, when we send the form with a button, form is exactly what we’ll need.'),
    done: L3("Demak, label yozuvni maydonga bog'laydi, form esa hamma maydonlarni bitta anketaga yig'adi.", 'Значит, label связывает подпись с полем, а form собирает все поля в одну анкету.', 'So label ties a caption to its field, and form gathers all the fields into one form.'),
    asks: [
      L3("Qarang: yozuv alohida", 'Смотри: подпись отдельно', 'Watch: the caption is separate'),
      L3("Qarang: yozuv bosildi", 'Смотри: нажали подпись', 'Watch: the caption is tapped'),
      L3('Qarang: label tegi', 'Смотри: тег label', 'Watch: the label tag'),
      L3('Qarang: maydon tanlandi', 'Смотри: поле выбралось', 'Watch: the field is selected'),
      L3('Qarang: form tegi', 'Смотри: тег form', 'Watch: the form tag')
    ],
    askDone: L3('label — yozuv, form — anketa', 'label — подпись, form — анкета', 'label — caption, form — the whole form')
  },
  // Своя анкета — два экрана по «Готово»: подпись поля (label), потом серая подсказка (placeholder).
  s12: {
    eyebrow: L3('Anketangiz yozuvi', 'Подпись своей анкеты', 'Your form’s caption'),
    say: L3("Endi o'zingizning anketangizni yasang. Kodda form, label va maydon tayyor turibdi, faqat yozuv yo'q. Sahifaga kirgan odamdan nima so'ramoqchisiz? Shu savolni label ichiga yozing. Keyin «Tayyor»ni bosing.",
      'Теперь сделай свою анкету. В коде уже есть form, label и поле, нет только подписи. О чём ты хочешь спросить того, кто откроет страницу? Напиши этот вопрос внутри label. Потом нажми «Готово».',
      'Now make your own form. The code already has form, label and a field; only the caption is missing. What do you want to ask the person who opens the page? Write that question inside label. Then tap “Done”.'),
    ok: L3("Zo'r savol! Endi maydonga kulrang ishora qo'shamiz.", 'Классный вопрос! Теперь добавим полю серую подсказку.', 'Great question! Now let’s add a grey hint to the field.'),
    hints: [
      L3("Odamdan nima so'ramoqchisiz? Shuni yozing.", 'О чём ты хочешь спросить? Это и напиши.', 'What do you want to ask? Write that.'),
      L3("Faqat so'z yozing, teglar joyida turibdi.", 'Пиши только слова — теги на месте.', 'Type only words: the tags are in place.'),
      L3("Masalan: Sevimli taomingiz. Keyin «Tayyor»ni bosing.", 'Например: Любимая еда. Потом нажми «Готово».', 'For example: Favorite food. Then tap “Done”.')
    ],
    ask: L3('Yozuvni yozing va «Tayyor»ni bosing', 'Напиши подпись и нажми «Готово»', 'Type the caption and tap “Done”'),
    ph: L3('Masalan: Sevimli taomingiz', 'Например: Любимая еда', 'For example: Favorite food'),
    sample: L3('Sevimli taomingiz:', 'Любимая еда:', 'Favorite food:')
  },
  s13: {
    eyebrow: L3('Anketangiz ishorasi', 'Подсказка своей анкеты', 'Your form’s hint'),
    say: L3("Endi maydoningizga kulrang ishora yozing: odam bu yerga nima yozishi mumkinligini misol bilan ko'rsating. Ishora placeholder qo'shtirnog'i ichiga yoziladi. Keyin «Tayyor»ni bosing.",
      'Теперь напиши своему полю серую подсказку: покажи примером, что сюда можно написать. Подсказка пишется в кавычках placeholder. Потом нажми «Готово».',
      'Now write a grey hint for your field: show with an example what can be typed here. The hint goes in the placeholder quotes. Then tap “Done”.'),
    ok: L3("Ajoyib! Endi anketangizni ochgan har bir odam nima yozishni darrov tushunadi.", 'Отлично! Теперь любой, кто откроет твою анкету, сразу поймёт, что писать.', 'Great! Now anyone who opens your form will instantly know what to type.'),
    hints: [
      L3("Bu maydonga qanday javob yozish mumkin? Bitta misol yozing.", 'Какой ответ можно сюда написать? Напиши один пример.', 'What answer could go here? Write one example.'),
      L3("Faqat so'z yozing, qo'shtirnoq joyida turibdi.", 'Пиши только слова — кавычки на месте.', 'Type only words: the quotes are in place.'),
      L3("Masalan: Osh. Keyin «Tayyor»ni bosing.", 'Например: Плов. Потом нажми «Готово».', 'For example: Plov. Then tap “Done”.')
    ],
    ask: L3("Ishora yozing va «Tayyor»ni bosing", 'Напиши подсказку и нажми «Готово»', 'Type the hint and tap “Done”'),
    ph: L3('Masalan: Osh', 'Например: Плов', 'For example: Plov'),
    sample: L3('Masalan, osh', 'Например, плов', 'For example, plov')
  },
  s14: {
    eyebrow: L3("Parol ochiq qoldi", 'Пароль виден всем', 'The password is showing'),
    say: L3("Men anketangizga parol maydonini qo'shdim, lekin type qiymatini yozishni unutibman. Qiymat bo'lmasa, brauzer maydonni oddiy maydon deb biladi. Qarang, parol hammaga ochiq ko'rinib turibdi! Kerakli qiymatni bo'sh joyga olib boring.",
      'Я добавил в твою анкету поле пароля, но забыл написать значение type. Без значения браузер считает поле обычным. Смотри, пароль виден всем! Перетащи нужное значение в пустое место.',
      'I added a password field to your form, but forgot to write the type value. Without a value, the browser treats it as an ordinary field. Look, the password is visible to everyone! Drag the right value into the empty spot.'),
    why: {
      text: L3("text bilan maydon oddiy bo'ladi va parol ochiq qoladi.", 'С text поле обычное, и пароль остаётся виден.', 'With text the field is ordinary, and the password stays visible.'),
      number: L3("number faqat son uchun bo'ladi. U parolni yashirmaydi.", 'number — только для числа. Пароль он не прячет.', 'number is only for numbers. It doesn’t hide the password.')
    },
    ok: L3("Ana endi joyida! Parol nuqtalar ortiga yashirindi.", 'Вот теперь порядок! Пароль спрятался за точками.', 'That’s it! The password is hidden behind dots.'),
    ask: L3("Kerakli qiymatni bo'sh joyga olib boring", 'Перетащи нужное значение в пустое место', 'Drag the right value into the empty spot'),
    // Ступени подсказки: 1 — куда смотреть, 2 — правило, 3 — какой кусок взять (он загорается).
    hints: [
      L3("Brauzerga qarang: parol harflari hammaga ko'rinib turibdi. Maydonga qanday qiymat kerak?", 'Посмотри на браузер: буквы пароля видны всем. Какое значение нужно полю?', 'Look at the browser: the password letters are visible to everyone. What value does the field need?'),
      L3("type qiymati maydon turini aytadi: text oddiy maydon, number son uchun. Harflarni nuqtalarga qaysi qiymat aylantiradi?", 'Значение type задаёт вид поля: text — обычное поле, number — для числа. Какое значение превращает буквы в точки?', 'The type value sets the kind of field: text is an ordinary field, number is for numbers. Which value turns letters into dots?'),
      L3("Bo'laklardan password so'zini oling va bo'sh joyga olib boring.", 'Возьми кусок password и перетащи его в пустое место.', 'Take the password piece and drag it into the empty spot.')
    ]
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, klub anketasi, lekin unda xato bor. Brauzerga qarang: qaysi maydon noto'g'ri ishlayapti? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот анкета клуба, но в ней ошибка. Посмотри на браузер: какое поле работает не так? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the club form, but it has a bug. Look at the browser: which field isn’t working right? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi boshqa maydonda kulrang ishora yo'qoldi. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Теперь у другого поля пропала серая подсказка. Что сломано здесь?', 'Great, the first bug is found! Now another field lost its grey hint. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan. Brauzerga qarang: qaysi maydon boshqacha ishlayapti?", 'Эта строка в порядке. Посмотри на браузер: какое поле ведёт себя не так?', 'This line is fine. Look at the browser: which field is behaving differently?'),
    found: {
      type: L3("Topdingiz! Parol maydonida type text edi. Shuning uchun parol hammaga ochiq ko'rinib turgan edi.", 'Есть! У поля пароля был type text. Поэтому пароль был виден всем.', 'Found it! The password field had type text. That’s why the password was visible to everyone.'),
      ph: L3("Topdingiz! placeholder so'zida bitta harf tushib qolgan edi. Brauzer bunday atributni bilmaydi, shuning uchun ishora chiqmagan edi.", 'Есть! В слове placeholder пропала буква. Браузер не знает такого атрибута, поэтому подсказки не было.', 'Found it! A letter was missing from the word placeholder. The browser doesn’t know an attribute like that, so there was no hint.')
    },
    hints: {
      type: [
        L3("Brauzerga qarang: qaysi maydonda yozuv ochiq ko'rinmasligi kerak edi?", 'Посмотри на браузер: в каком поле текст не должен быть виден?', 'Look at the browser: in which field shouldn’t the text be visible?'),
        L3("Parolni type atributi yashiradi. Parol qatoridagi type qiymatiga qarang.", 'Пароль прячет атрибут type. Посмотри на значение type в строке пароля.', 'The type attribute hides a password. Look at the type value in the password line.'),
        L3("Uchinchi qatorga qarang: type qiymati qanday?", 'Посмотри на третью строку: какое там значение type?', 'Look at the third line: what’s the type value?')
      ],
      ph: [
        L3("Brauzerga qarang: qaysi maydonda kulrang ishora yo'q?", 'Посмотри на браузер: у какого поля нет серой подсказки?', 'Look at the browser: which field has no grey hint?'),
        L3("Ishorani placeholder beradi. Atribut nomini harfma-harf o'qing.", 'Подсказку даёт placeholder. Прочитай имя атрибута буква за буквой.', 'placeholder gives the hint. Read the attribute name letter by letter.'),
        L3("Birinchi qatorga qarang: placeholder to'liq yozilganmi?", 'Посмотри на первую строку: placeholder написан полностью?', 'Look at the first line: is placeholder spelled in full?')
      ]
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz anketalarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь анкеты как настоящий программист.', 'Super! Both bugs are found. You check forms like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки: 1 — как читать фразу, 2 — правило урока, 3 — причина и ответ (choiceHints).
    hint1: L3("Gapni bo'laklab o'qing: u qaysi teg yoki atribut haqida?", 'Прочитай фразу по частям: о каком теге или атрибуте она?', 'Read the sentence piece by piece: which tag or attribute is it about?'),
    hint2: L3("Esingizdami? type password harflarni nuqtalar bilan yashiradi. placeholder bo'sh maydondagi kulrang ishora bo'ladi. label esa yozuvni maydonga bog'laydi. Gap shunga mos keladimi?",
      'Вспомни: type password прячет буквы за точками. placeholder — серая подсказка в пустом поле. А label связывает подпись с полем. Фраза с этим совпадает?',
      'Remember: type password hides letters behind dots. placeholder is a grey hint in an empty field. And label ties the caption to the field. Does the sentence match that?'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3("type password bo'lsa, yozilgan harflar nuqtalar bilan yashirinadi.", 'Если type — password, введённые буквы прячутся за точками.', 'If type is password, the typed letters hide behind dots.'), right: true, code: 'pass',
        why: L3("Shuning uchun parol maydoniga doim type password yoziladi.", 'Поэтому в поле пароля всегда пишут type password.', 'That’s why a password field always gets type password.') },
      { t: L3("placeholder maydonga yozilgan javobning o'zi bo'ladi.", 'placeholder — это сам ответ, написанный в поле.', 'placeholder is the answer typed into the field.'), right: false, code: 'ph',
        why: L3("placeholder faqat kulrang ishora bo'ladi. Yozishni boshlasangiz, u yo'qoladi.", 'placeholder — только серая подсказка. Когда начинаешь писать, она исчезает.', 'placeholder is only a grey hint. It disappears when you start typing.') },
      { t: L3("label ichidagi yozuvni bossangiz, maydon yozishga tayyor bo'ladi.", 'Если нажать на подпись внутри label, поле готово к вводу.', 'If you tap the caption inside label, the field is ready for typing.'), right: true, code: 'label',
        why: L3("label yozuvni maydonga bog'laydi, shuning uchun yozuvga tegish ham yetadi.", 'label связывает подпись с полем, поэтому достаточно коснуться подписи.', 'label ties the caption to the field, so touching the caption is enough.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz maydonlar, ularning turlari, ishoralari va yozuvlarini yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь поля, их виды, подсказки и подписи.', 'All correct! You know fields, their kinds, hints and captions really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men parol maydoniga placeholder qo'shib, Parol deb yozgan edim? Afsuski, men adashibman. placeholder faqat kulrang ishora bo'ladi. Parolni yozishni boshlaganimda, ishora yo'qoldi, parol esa hammaga ochiq ko'rinib qoldi. Parolni nuqtalar bilan faqat type password yashira oladi.",
        'Вернёмся к загадке. Помнишь, я добавил полю пароля placeholder со словом «Пароль»? Увы, я ошибся. placeholder — только серая подсказка. Когда я начал вводить пароль, подсказка исчезла, а пароль остался виден всем. Спрятать пароль за точками может только type password.',
        'Back to our riddle. Remember, I added placeholder with the word “Password” to a password field? Sadly, I was wrong. placeholder is only a grey hint. When I started typing the password, the hint disappeared and the password stayed visible to everyone. Only type password can hide a password behind dots.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning anketangiz! Unda sizning savolingiz va ishorangiz bor.", 'Смотри, это твоя анкета! В ней твой вопрос и твоя подсказка.', 'Look, this is your form! It has your question and your hint.'), k: null },
      { text: L3("input tegi sahifaga maydon qo'yadi.", 'Тег input ставит на страницу поле.', 'The input tag puts a field on the page.'), k: 'input' },
      { text: L3('type atributi maydon turini tanlaydi.', 'Атрибут type выбирает вид поля.', 'The type attribute chooses the kind of field.'), k: 'type' },
      { text: L3("placeholder bo'sh maydonda kulrang ishora ko'rsatadi.", 'placeholder показывает серую подсказку в пустом поле.', 'placeholder shows a grey hint in an empty field.'), k: 'placeholder' },
      { text: L3("label esa yozuvni maydonga bog'laydi, form esa hammasini bitta anketaga yig'adi.", 'А label связывает подпись с полем, а form собирает всё в одну анкету.', 'label ties a caption to its field, and form gathers everything into one form.'), k: 'label' },
      { text: L3("Tabriklayman! Endi sahifangiz odamlardan javob so'ray oladi. Keyingi darsda ro'yxatdan tanlash maydonlari va tugma qo'shib, anketani yuboramiz. Ko'rishguncha!", 'Ура! Теперь твоя страница умеет спрашивать людей. На следующем уроке добавим выбор из списка и кнопку и отправим анкету. До встречи!', 'Hooray! Now your page can ask people questions. Next time we’ll add choosing from a list and a button, and send the form. See you!'), k: null }
    ],
    roles: {
      input: L3('input — maydon', 'input — поле', 'input — a field'),
      type: L3('type — maydon turi', 'type — вид поля', 'type — kind of field'),
      placeholder: L3('placeholder — kulrang ishora', 'placeholder — серая подсказка', 'placeholder — grey hint'),
      label: L3("label — maydon yozuvi", 'label — подпись поля', 'label — field caption')
    },
    ask: L3('Anketangizga qarang', 'Посмотри на свою анкету', 'Look at your form')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayInput: 1, sayTyped: 1, sayType: 1, sayText: 1, sayPass: 1, sayNum: 1,
  sayPh: 1, sayBack: 1, sayNoLabel: 1, sayLabel: 1, sayFocus: 1, sayForm: 1, askQ: 1, rounds: 1, miss: 1, say2: 1, fine: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:z6-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:z6.css@*/
`;
