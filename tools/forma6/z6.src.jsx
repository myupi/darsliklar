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
    say: L3("Klub ochdim, lekin bittayam a'zo yozilmadi! Sababi shu: yozilish sahifasida faqat yozuvlar turibdi, javob yozadigan joyning o'zi yo'q. Bunaqa sahifaga hech kim hech narsa yoza olmaydi-ku! Qani, «Aylantirish»ni bosing-chi, sahifaga nima bo'larkin?",
      'Привет! Я открыл на сайте клуб игр и сделал страницу, чтобы в него записаться. Но смотри: на странице одни подписи, а места, куда писать ответ, нет. На такой странице никто ничего не напишет. Давай это исправим. Нажми «Превратить».',
      'Hi! I opened a games club on my site and made a page to join it. But look: the page only has captions, and there’s nowhere to type an answer. Nobody can write anything on a page like this. Let’s fix that. Tap “Transform”.'),
    magic: L3("Har bir yozuvning yonida bittadan maydon chiqdi! Sahifamiz endi haqiqiy anketaga aylandi.", 'Ого, смотри! Рядом с каждой подписью появилось поле. Теперь это настоящая анкета.', 'Whoa, look! A field appeared next to each caption. Now this page is a real form.'),
    magicP: L3("Men maydonlarni to'ldirib ko'rdim: o'yin nomini, yoshimni, parolimni yozdim. Sezdingizmi? Parolning harflari nuqtalarga aylanib ketdi!", 'Я заполнил поля: игра, возраст и пароль. Смотри, а пароль спрятался за точками.', 'I filled in the fields: the game, the age and the password. Look, the password is hidden behind dots.'),
    done: L3("Bugun o'z anketangizni tuzasiz, maydonlarni qanday qo'yishni esa hozir o'rganamiz. Kecha ukam so'radi: «Parol yozganda harflar nega nuqtaga aylanadi?» Men shoshilib javob berdim: parol maydonida placeholder bor, shuning uchun harflar nuqtaga aylanadi, dedim. Ukam jim qoldi-yu, o'zim tinchimay yuribman: haqiqatan shundaymi? Dars oxirida ukamning oldiga javob bilan boraman.",
      'Сегодня ты научишься делать такие поля и сделаешь свою анкету. Но сначала маленькая загадка. Я сделал поле для пароля на другой странице, добавил ему атрибут placeholder и написал в нём слово «Пароль». По-моему, теперь пароль сам спрячется за точками. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make fields like these, and you’ll make your own form. But first, a little riddle. On another page I made a password field, added the placeholder attribute to it and wrote the word “Password” in it. I think the password will now hide behind dots by itself. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Endi sahifaga yozish mumkin", 'Теперь на странице можно писать', 'Now you can type on the page')
  },
  s2: {
    eyebrow: L3('input tegi', 'Тег input', 'The input tag'),
    say: L3("Qani, birinchi maydonni birga yasab ko'ramiz! Mana, klubning sahifasi: tepada sarlavha, uning ostida o'yin haqidagi yozuv turibdi. Endi shu yozuvdan keyin bitta yangi teg qo'yamiz.",
      'Давай сделаем первое поле вместе. Вот страница клуба: заголовок и подпись про игру. После подписи ставим один новый тег.',
      'Let’s make the first field together. Here’s the club page: a heading and a caption about the game. After the caption we add one new tag.'),
    sayInput: L3("Ana, yozuvning ostida ramkali kichkina quti chiqdi! Uni input tegi qo'ydi. input inglizchada «kiritish» degani, ichiga yozsa bo'ladigan bunday qutini esa maydon deymiz. Bu teg ham xuddi img kabi yopuvchi tegsiz yoziladi.",
      'Это тег input. input — английское слово, то есть «ввод». Он ставит на страницу поле: маленькую рамку, в которую можно писать. Смотри, под подписью появилось поле. Обрати внимание: input, как и img, пишут без закрывающего тега.',
      'This is the input tag. input is an English word that means putting something in. It puts a field on the page: a small box you can type in. Look, a field appeared under the caption. Note: like img, input has no closing tag.'),
    sayTyped: L3("Endi maydonga Minecraft deb yozib ko'rdim. Qarang-chi: so'z sahifada paydo bo'ldi, kodda esa u yo'q! Nega shunday? Chunki maydonni kod to'ldirmaydi, uni sahifaga kirgan odamning o'zi to'ldiradi.",
      'Теперь я написал в поле слово Minecraft. Смотри: слово появилось на странице, а в коде его нет. Потому что поле заполняет не код, а человек, который открыл страницу.',
      'Now I typed the word Minecraft in the field. Look: the word showed up on the page, but it isn’t in the code. That’s because the field isn’t filled by the code, but by the person who opens the page.'),
    sayType: L3("Endi tegga yana bitta narsa qo'shamiz: type atributini. type inglizchada «tur» degani: u brauzerga bu qanaqa maydon ekanini aytib turadi. Qiymati text bo'lsa, oddiy yozuv uchun maydon bo'ladi. Sezdingizmi, maydon o'zgarmadi? Chunki type yozilmasa ham, brauzer maydonni baribir text deb biladi.",
      'В конце добавляем атрибут type. type — английское слово, то есть «вид»: он говорит, какое это поле. Значение text — поле для обычного текста. Вид не изменился: обычно поле такое и есть.',
      'Finally we add the type attribute. type is an English word for kind: it says what kind of field this is. The value text means a field for ordinary text. Nothing changed on screen, because that’s what a field is by default.'),
    done: L3("Eslab qoling: input sahifaga maydon qo'yadi, type esa bu maydonning turini aytadi.", 'Запомни: input ставит на страницу поле, а type говорит, какое это поле.', 'Remember: input puts a field on the page, and type says what kind of field it is.'),
    askInput: L3('Qarang: input tegi', 'Смотри: тег input', 'Watch: the input tag'),
    askTyped: L3('Qarang: maydonga yozildi', 'Смотри: в поле написали', 'Watch: someone typed in the field'),
    askType: L3('Qarang: type atributi', 'Смотри: атрибут type', 'Watch: the type attribute'),
    askDone: L3('input — maydon, type — uning turi', 'input — поле, type — его вид', 'input — a field, type — its kind')
  },
  s3: {
    eyebrow: L3('Teg nomini yozing', 'Впиши имя тега', 'Type the tag name'),
    say: L3("Endi maydonni o'zingiz qo'yib ko'ring! Kodga qarang: burchakli qavsdan keyin teg nomi tushib qolibdi. Shuning uchun brauzer sahifaga hech narsa chiqarmadi. Maydon yasaydigan teg nomini yozing-da, «Tekshirish»ni bosing.",
      'Теперь твоя очередь. В коде после уголка нет имени тега. Поэтому браузер ничего не вывел. Впиши имя тега, который делает поле, и нажми «Проверить».',
      'Now it’s your turn. In the code there’s no tag name after the bracket, so the browser shows nothing. Type the name of the tag that makes a field and tap “Check”.'),
    msgs: {
      empty: L3("Hali hech narsa yozilmabdi-ku. Burchakli qavsdan keyin teg nomini yozing.", 'Впиши имя тега после уголка.', 'Type the tag name after the bracket.'),
      brackets: L3("Qavslarni qayta yozish shart emas, ular allaqachon joyida turibdi. Bu yerga faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      other: L3("Bu teg ham bor, lekin u maydon yasamaydi. Bizga ichiga yozsa bo'ladigan quti kerak.", 'Этот тег делает другое. Нам нужно поле, в которое можно писать.', 'That tag does something else. We need a field you can type in.'),
      typo: L3("Brauzer bunaqa tegni tanimadi, shuning uchun hech narsa chiqarmadi. Teg nomini harfma-harf tekshirib ko'ring.", 'Такого тега нет, поэтому браузер ничего не вывел. Напиши имя буква в букву.', 'There’s no such tag, so the browser shows nothing. Type the name letter by letter.')
    },
    hints: [
      L3("Hozirgina ko'rdik-ku: qaysi teg sahifaga maydon qo'yadi?", 'Какой тег ставит на страницу поле?', 'Which tag puts a field on the page?'),
      L3("Uning nomi inglizcha «kiritish» degan so'z, u i harfi bilan boshlanadi.", 'Его имя английское, то есть «ввод». Оно начинается с буквы i.', 'Its name is English for putting something in. It starts with the letter i.'),
      L3("Bu teg input deyiladi. Uni burchakli qavsdan keyin yozing-da, «Tekshirish»ni bosing.", 'Имя тега — input. Впиши его после уголка.', 'The tag name is input. Type it after the bracket.')
    ],
    ok: L3("Ana, maydon chiqdi! Endi klub sahifasiga o'yin nomini bemalol yozsa bo'ladi.", 'Огонь! Поле появилось. Теперь на этой странице можно написать название игры.', 'Awesome! The field appeared. Now you can type a game name on this page.'),
    ask: L3('Maydon yasaydigan teg nomini yozing', 'Впиши имя тега, который делает поле', 'Type the name of the tag that makes a field')
  },
  s4: {
    eyebrow: L3('Kod va sahifa', 'Код и страница', 'Code and page'),
    say: L3("Bir qator sahifada nimani chiqaradi: yozuvnimi yoki maydonnimi? Mana, sahifada ikkita yozuv va ikkita maydon bor, kodda esa ularning qatorlari turibdi. Endi bir o'yin: sahifada bitta narsa yonib turadi, siz esa uni chiqargan qatorni kodda topasiz. Qani, boshladik!",
      'На странице две подписи и два поля. А в коде пять строк. На странице загорается одна вещь. А ты нажми в коде строку, которая её выводит.',
      'The page has two captions and two fields, and the code has five lines. One thing lights up on the page. Tap the line in the code that shows it.'),
    askQ: L3("Yonib turgan narsani qaysi qator chiqaradi?", 'Какая строка выводит то, что горит?', 'Which line shows what’s lit up?'),
    rounds: [
      null,
      L3("Endi sahifada yozuv yonib turibdi. Bu safar-chi, uni qaysi qator chiqaradi?", 'Теперь горит подпись. Какая строка её выводит?', 'Now a caption is lit. Which line shows it?'),
      L3("Va nihoyat, birinchi maydon yondi. Kodda ikkita bir xil qator bor-ku, shulardan qaysi biri aynan shu maydonni chiqaradi?", 'Последняя. Теперь горит первое поле. В коде две одинаковые строки. Какая из них выводит это поле?', 'The last one. Now the first field is lit. The code has two identical lines. Which one shows this field?')
    ],
    ok: [
      L3("Ikkinchi maydon topildi! Pastdagi input qatori uni chiqaradi.", 'Верно! Нижняя строка input выводит второе поле.', 'Right! The lower input line shows the second field.'),
      L3("Yozuv ham, maydon ham o'z qatorini topdi: yozuvni p tegi chiqaradi, maydonni esa input.", 'Верно! Подпись выводит тег p, а поле — input.', 'Right! The p tag shows the caption, and input shows the field.'),
      L3("Tartib saqlandi! Brauzer kodni tepadan pastga o'qiydi, shuning uchun birinchi input sahifada birinchi maydon bo'lib chiqadi.", 'Верно! Браузер читает код сверху вниз: первый input — первое поле.', 'Right! The browser reads the code top to bottom: the first input is the first field.')
    ],
    miss: {
      fld: L3("Bu qator maydon chiqarmaydi: maydonni faqat input qatori chiqaradi. Tartibiga ham bir qarang: brauzer kodni tepadan pastga qarab o'qiydi.", 'Эта строка выводит другое. Поле выводит строка input. Смотри на порядок: браузер читает код сверху вниз.', 'This line shows something else. A field comes from an input line. Watch the order: the browser reads the code top to bottom.'),
      cap: L3("Bu qatordan boshqa narsa chiqadi. Yozuvni esa p tegi chiqaradi. Qani, qaysi p qatorida aynan shu so'zlar yozilgan?", 'Эта строка выводит другое. Подпись выводит тег p. В какой строке p именно эти слова?', 'This line shows something else. A caption comes from a p tag. Which p line has exactly these words?')
    },
    done: L3("Demak, maydonni input qatori chiqaradi, yozuvni p qatori. Qaysi biri tepada turishini esa kodning tartibi hal qiladi.", 'Молодец! Теперь ты знаешь, какая строка делает поле, а какая — подпись.', 'Well done! Now you know which line makes a field and which makes a caption.'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило раунда, 3 — какую строку нажать (она загорается).
    hint1: L3("Sahifaga bir qarang-chi: nima yonib turibdi, yozuvmi yoki maydonmi?", 'Посмотри, что горит на странице: подпись или поле?', 'Look at what’s lit on the page: a caption or a field?'),
    hint2: {
      fld: L3("Maydonni input qatori chiqaradi. Kodda input ikkita: birinchisi tepadagi maydonni, ikkinchisi pastdagisini.", 'Поле выводит строка input. В коде их две: первая — верхнее поле, вторая — нижнее.', 'A field comes from an input line. The code has two: the first is the top field, the second is the bottom one.'),
      cap: L3("Yozuv bo'lsa, p qatorini izlang: sahifadagi so'zlarni p ichidagi so'zlar bilan solishtirib ko'ring.", 'Подпись выводит тег p. Сравни слова на странице со словами в строках p.', 'A caption comes from a p tag. Compare the words on the page with the words in the p lines.')
    },
    hint3: [
      L3("Yonib turgan maydon pastda-ku. Kodda eng oxirgi input qatorini bosing.", 'Горящее поле — нижнее. Нажми в коде самую последнюю строку input.', 'The lit field is the bottom one. Tap the very last input line in the code.'),
      L3("Yonib turgan yozuv tepada turibdi. Kodda shu so'zlar yozilgan birinchi p qatorini toping-da, ustiga bosing.", 'Горящая подпись — верхняя. Нажми в коде первую строку p с этими словами.', 'The lit caption is the top one. Tap the first p line with these words in the code.'),
      L3("Bu safar yonib turgan maydon tepada. Kodda birinchi input qatorini bosing: u ikkinchi p qatoridan oldin keladi.", 'Горящее поле — верхнее. Нажми в коде первую строку input, она стоит перед второй строкой p.', 'The lit field is the top one. Tap the first input line in the code; it comes before the second p line.')
    ]
  },
  s5: {
    eyebrow: L3('Maydon turlari', 'Виды полей', 'Kinds of fields'),
    say: L3("Maydonlar har xil bo'ladi, ularning turini esa type atributi tanlaydi. Qani, bitta maydonning turini almashtirib ko'ramiz-chi, nima bo'larkin?",
      'Поля бывают разные. Их вид выбирает атрибут type. Давай поменяем вид одного поля и посмотрим.',
      'Fields come in different kinds. The type attribute chooses the kind. Let’s change the kind of one field and see.'),
    sayText: L3("Qarang, bu parol maydoni. Lekin bu yerda type qiymati text bo'lib turibdi, shuning uchun parol hammaga ochiq ko'rinadi. Yoningizda o'tirgan odam ham uni bemalol o'qib oladi.",
      'Вот поле пароля. Но значение type — text, поэтому пароль виден всем. Его прочтёт даже тот, кто сидит рядом.',
      'Here’s a password field. But the type value is text, so the password is visible to everyone. Even the person sitting next to you can read it.'),
    sayPass: L3("Endi text o'rniga password qo'yamiz. Ana, qarang: harflar nuqtaga aylandi! Maydonga yozilgan parol o'zgarmadi, u shunchaki ko'rinmay qoldi.",
      'Теперь ставим значение password, то есть «пароль». Смотри, буквы спрятались за точками. То, что написано в поле, не изменилось, просто не видно.',
      'Now we set the value to password. Look, the letters are hidden behind dots. What’s typed in the field didn’t change; you just can’t see it.'),
    sayNum: L3("Keyin yosh uchun maydon yasaymiz va type qiymatiga number qo'yamiz. Bunaqa maydonga faqat son yozsa bo'ladi, harflar esa yozilmaydi. Yoniga ham qarang-chi: kichkina strelkalar chiqibdi! Ular sonni bittaga oshiradi yoki kamaytiradi.",
      'А теперь поле для возраста со значением number, то есть «число». В такое поле пишутся только цифры, буквы не вводятся. А справа появились маленькие стрелки: они прибавляют или убавляют число на один.',
      'Now a field for age with the value number. Only digits can be typed in a field like this; letters won’t go in. And small arrows appeared on the right: they make the number one bigger or smaller.'),
    done: L3("Demak, maydonning turini type tanlaydi: text oddiy yozuv uchun, password parol uchun, number esa son uchun kerak bo'ladi.", 'Значит, type выбирает вид поля: text — для обычного текста, password — для пароля, а number — для числа.', 'So type chooses the kind of field: text for ordinary text, password for passwords, and number for numbers.'),
    asks: {
      text: L3('Qarang: type text', 'Смотри: type text', 'Watch: type text'),
      password: L3('Qarang: type password', 'Смотри: type password', 'Watch: type password'),
      number: L3('Qarang: type number', 'Смотри: type number', 'Watch: type number')
    },
    askDone: L3('text, password, number', 'text, password, number', 'text, password, number')
  },
  s6: {
    eyebrow: L3("Parol maydonini yig'ing", 'Собери поле пароля', 'Build the password field'),
    say: L3("Parol maydonini ham o'zingiz yig'asiz! Kodda beshta bo'sh joy bor. Bo'laklarni tegning o'z tartibida qo'ying: teg nimadan boshlanadi-yu, keyin nima keladi? Orasida bitta ayyor bo'lak ham yashiringan, uni payqaysizmi?",
      'Теперь собери поле пароля сам. В коде пять пустых мест. Ставь куски по порядку: начало тега, имя атрибута, знак «равно», значение в кавычках и в конце уголок. А один кусок лишний.',
      'Now build the password field yourself. The code has five empty spots. Put the pieces in order: the start of the tag, the attribute name, the equals sign, the value in quotes, and a bracket at the end. And one piece isn’t needed.'),
    why: {
      close: L3("Bu bo'lak ortiqcha: input yopuvchi tegsiz yoziladi-ku.", 'У input нет закрывающего тега. Этот кусок лишний.', 'input has no closing tag. This piece isn’t needed.'),
      open: L3("Atribut uchun hali erta: teg ochilmay turib, atribut qayerga o'tirsin? Oldin input boshini qo'ying.", 'Тег всегда начинается с уголка и имени. Сначала поставь начало input.', 'A tag always starts with a bracket and its name. Put the start of input first.'),
      type: L3("Teg boshidan keyin atribut turadi. Qaysi atribut ekanini eslang-chi: maydonning turini aytadigan type.", 'После имени тега идёт имя атрибута: type.', 'After the tag name comes the attribute name: type.'),
      eq: L3("Oz qoldi! Atribut nomining yonida teng belgisi turadi, qiymat esa undan keyin.", 'После имени атрибута идёт знак «равно».', 'After the attribute name comes the equals sign.'),
      val: L3("Teng belgisidan keyin qiymat so'raladi. Uni qo'shtirnoq ichiga yozamiz.", 'После знака «равно» идёт значение в кавычках.', 'After the equals sign comes the value in quotes.'),
      gt: L3("Hammasi joyida, faqat oxiri qoldi: burchakli qavs tegni tugatadi.", 'Всё на месте. В конце тег закрывается уголком.', 'Everything’s in place. At the end the tag closes with a bracket.')
    },
    hints: [
      L3("Har qanday teg nimadan boshlanardi, esingizdami?", 'С чего начинается тег?', 'What does a tag start with?'),
      L3("Teg boshidan boshlang: oldin input, keyin type va teng belgisi.", 'Сначала начало input, потом type и знак «равно».', 'First the start of input, then type and the equals sign.'),
      L3("Tartib bunday: input boshi, type, teng belgisi, password qiymati, burchakli qavs. Yopuvchi tegga tegmang.", 'Порядок такой: начало input, type, знак «равно», значение password и уголок. Закрывающий тег не нужен.', 'The order is: the start of input, type, the equals sign, the value password and the bracket. No closing tag.')
    ],
    ok: L3("Parol maydoni tayyor, parol ham ko'rinmay qoldi! Yopuvchi tegga esa aldanmadingiz: input uni kutmaydi.", 'Отлично! Поле пароля готово, а пароль спрятался за точками. И лишний кусок ты правильно не взял.', 'Great! The password field is ready, and the password is hidden behind dots. And you were right to leave the extra piece.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Bu yerda uchta maydon bor, har birining turi boshqacha. Qaysi maydonga qaysi type qiymati yozilganini bir qarashda bila olasizmi? Qani, sinab ko'ramiz: oldin qiymatni, keyin unga mos maydonni bosing.",
      'Вот три поля разного вида. Соедини значение type с самим полем. Сначала нажми значение, потом поле.',
      'Here are three fields of different kinds. Match each type value with its field. Tap a value first, then a field.'),
    cards: {
      text: L3("Yozuv ochiq ko'rinadi", 'Текст виден', 'The text is visible'),
      password: L3('Harflar nuqta bilan yashiringan', 'Буквы спрятаны за точками', 'The letters are hidden behind dots'),
      number: L3('Faqat son va strelkalar', 'Только число и стрелки', 'Only a number and arrows')
    },
    pairOk: {
      text: L3("Topdingiz: text bo'lsa, harflar ochiq turadi.", 'Верно! С text текст виден.', 'Right! With text, the text is visible.'),
      password: L3("Nuqtalar topildi! password parolni ko'rinmas qiladi: harflar nuqtaga aylanadi.", 'Верно! password прячет пароль за точками.', 'Right! password hides the password behind dots.'),
      number: L3("Son maydoni topildi! number maydoniga faqat son yozsa bo'ladi.", 'Верно! number принимает только число.', 'Right! number only takes a number.')
    },
    why: {
      text: L3("Hechqisi yo'q! text oddiy maydon yasaydi, unda yozuv hammaga ochiq ko'rinib turadi.", 'text — обычное поле: текст в нём виден.', 'text is an ordinary field: the text in it is visible.'),
      password: L3("Bu maydonda harflar ochiq turibdi-ku, password esa ularni nuqtalarga aylantirardi.", 'password — для пароля: он прячет буквы за точками.', 'password is for passwords: it hides the letters behind dots.'),
      number: L3("Unday emas: number son uchun bo'ladi, uning yonida kichkina strelkalar turadi.", 'number — для числа: справа у него стрелки.', 'number is for numbers: it has arrows on the right.')
    },
    hints: [
      L3("Har bir maydonga diqqat bilan qarang-chi: ichida nima bor?", 'Посмотри на каждое поле: что в нём?', 'Look at each field: what’s in it?'),
      L3("Nuqtalarga qarang: ular turgan maydon password bo'ladi.", 'Поле с точками — password.', 'The field with dots is password.'),
      L3("Nuqtalarni ko'rsangiz, password; strelkalarni ko'rsangiz, number; yozuv ochiq tursa, text. Qiymatni olib, mos maydonga qo'ying.", 'Точки — password, стрелки — number, а видимый текст — text.', 'Dots are password, arrows are number, and visible text is text.')
    ],
    ok: L3("Maydonga qarab, uning turini bir qarashda ayta olyapsiz!", 'Класс! Ты различаешь виды полей с первого взгляда.', 'Brilliant! You can tell the kinds of fields apart at a glance.'),
    ask: L3('type qiymatini maydon bilan juftlang', 'Соедини значение type с полем', 'Match each type value with a field'),
    askPlace: L3('Endi maydonni bosing', 'Теперь нажми поле', 'Now tap a field'),
    pickFirst: L3('Oldin qiymatni bosing.', 'Сначала нажми значение.', 'Tap a value first.')
  },
  s8: {
    eyebrow: L3('Kulrang ishora', 'Серая подсказка', 'The grey hint'),
    say: L3("Bo'sh maydonga bir qarang-chi. Sahifaga kirgan odam unga nima yozish kerakligini qayerdan bilarkin? Buning uchun maxsus atribut bor.",
      'Посмотри на пустое поле. Откуда человек на странице узнает, что в него писать? Для этого есть особый атрибут.',
      'Look at the empty field. How does someone on the page know what to type in it? There’s a special attribute for that.'),
    sayPh: L3("Bu atribut placeholder deyiladi. Maydon bo'sh turganda, u ichiga kulrang ishora yozib qo'yadi, masalan, Minecraft. Shu ishoraga qarab, odam nima yozishni darrov tushunadi.",
      'Это атрибут placeholder. placeholder — английское слово, то есть «то, что держит место». Пока поле пустое, внутри видна серая подсказка: например, Minecraft. Она показывает, что писать.',
      'This is the placeholder attribute. placeholder is an English word for something that holds a place. While the field is empty, a grey hint shows inside: for example, Minecraft. It shows what to type.'),
    sayTyped: L3("Endi maydonga Futbol deb yozdim, kulrang ishora esa darrov g'oyib bo'ldi. Sezdingizmi? placeholder javobning o'zi emas, u faqat maslahat beradi, xolos.",
      'Теперь я написал в поле слово Футбол. Смотри, серая подсказка исчезла. Значит, placeholder — не сам ответ, а только подсказка.',
      'Now I typed the word Football in the field. Look, the grey hint disappeared. So placeholder isn’t the answer itself, just a hint.'),
    sayBack: L3("Endi yozganimni o'chirib tashladim. Qarang-chi: maydon yana bo'shadi, kulrang ishora ham joyiga qaytib keldi.", 'Если стереть текст, поле снова пустое, и серая подсказка возвращается.', 'If we erase the text, the field is empty again and the grey hint comes back.'),
    done: L3("Xullas, placeholder bo'sh maydonda kulrang ishora ko'rsatib turadi, yozishni boshlashingiz bilan esa u yo'qoladi.", 'Запомни: placeholder показывает серую подсказку в пустом поле, а когда начинаешь писать, она исчезает.', 'Remember: placeholder shows a grey hint in an empty field, and it disappears when you start typing.'),
    askPh: L3('Qarang: placeholder', 'Смотри: placeholder', 'Watch: placeholder'),
    askTyped: L3("Qarang: yozilganda ishora yo'qoladi", 'Смотри: когда пишешь, подсказка исчезает', 'Watch: the hint disappears as you type'),
    askBack: L3('Qarang: ishora qaytdi', 'Смотри: подсказка вернулась', 'Watch: the hint is back'),
    askDone: L3("placeholder — bo'sh maydondagi ishora", 'placeholder — подсказка в пустом поле', 'placeholder — a hint in an empty field')
  },
  s9: {
    eyebrow: L3('Atribut nomini yozing', 'Впиши имя атрибута', 'Type the attribute name'),
    say: L3("Endi yosh maydoniga qarang. Kodda ishora matni bor-u, lekin atribut nomi tushib qolibdi. Shuning uchun maydon bo'm-bo'sh, ishorasiz turibdi. Kulrang ishora chiqaradigan atribut nomini yozing-da, «Tekshirish»ni bosing.",
      'У поля возраста есть текст подсказки, но нет имени атрибута. Поэтому поле пустое, без подсказки. Впиши имя атрибута, который показывает серую подсказку, и нажми «Проверить».',
      'The age field has the hint text, but no attribute name. That’s why the field is empty, with no hint. Type the name of the attribute that shows the grey hint and tap “Check”.'),
    msgs: {
      empty: L3("Bo'sh joyga hali hech narsa yozilmadi. Atribut nomini shu yerga yozing.", 'Впиши имя атрибута в пустое место.', 'Type the attribute name in the empty spot.'),
      extra: L3("Teng belgisi bilan qo'shtirnoq kodda allaqachon turibdi. Bu yerga faqat atribut nomini yozing.", 'Знак «равно» и кавычки уже на месте. Здесь нужно только имя атрибута.', 'The equals sign and the quotes are already there. Only the attribute name goes here.'),
      type: L3("type kodda allaqachon bor, u maydonning turini aytadi. Bizga esa kulrang ishora chiqaradigan atribut kerak.", 'type задаёт вид поля, и он в коде уже есть. Нам нужен атрибут серой подсказки.', 'type gives the kind of field, and it’s already in the code. We need the attribute for the grey hint.'),
      typo: L3("Bunaqa atribut yo'q, brauzer uni tanimadi va ishorani ko'rsatmadi. Atribut nomini harfma-harf tekshirib chiqing.", 'Такого атрибута нет, поэтому браузер не показал подсказку. Напиши имя буква в букву.', 'There’s no such attribute, so the browser didn’t show the hint. Type the name letter by letter.')
    },
    hints: [
      L3("Esingizdami, bo'sh maydonda kulrang ishorani qaysi atribut chiqarardi?", 'Какой атрибут показывает серую подсказку?', 'Which attribute shows the grey hint?'),
      L3("Uning nomi uzun inglizcha so'z, u p harfi bilan boshlanadi.", 'Он английский, то есть «то, что держит место». Начинается с буквы p.', 'It’s English for something that holds a place. It starts with the letter p.'),
      L3("Bu atribut placeholder deyiladi. Uni harfma-harf yozing-da, «Tekshirish»ni bosing.", 'Имя атрибута — placeholder. Напиши его буква в букву.', 'The attribute name is placeholder. Type it letter by letter.')
    ],
    ok: L3("Juda zo'r! Kulrang ishora chiqdi. Endi bu yerga yosh yozilishini hamma bir qarashda tushunadi.", 'Огонь! Серая подсказка появилась. Теперь каждый поймёт, что здесь пишут возраст.', 'Awesome! The grey hint appeared. Now everyone will understand that this is where the age goes.'),
    ask: L3('Kulrang ishora atributi nomini yozing', 'Впиши имя атрибута серой подсказки', 'Type the name of the grey hint attribute')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Bu safar ikkita kartochka bor: «Oldin» va «Keyin». Kodda bor-yo'g'i bitta narsa o'zgargan, maydon esa butunlay boshqacha bo'lib qolibdi. Qani, o'sha narsani topa olasizmi?",
      'Теперь посмотри на два состояния: до и после. В коде изменилась одна вещь, и поле стало другим. Ну и что изменилось?',
      'Now look at two states: before and after. One thing changed in the code, and the field changed. So what changed?'),
    askQ: L3("Kodda nima o'zgardi?", 'Что изменилось в коде?', 'What changed in the code?'),
    ok: {
      pass: L3("Harflar nuqtalarga aylandi! Demak, type qiymati password bo'lgan.", 'Верно! type стал password, буквы превратились в точки.', 'Right! type became password, so the letters turned into dots.'),
      ph: L3("Kulrang ishora kelib qoldi: placeholder qo'shilgani uchun bo'sh maydonda maslahat paydo bo'ldi.", 'Верно! Добавили placeholder — в пустом поле появилась серая подсказка.', 'Right! placeholder was added, so a grey hint showed up in the empty field.'),
      num: L3("Strelkalar chiqdi! Demak, type qiymati number bo'lgan.", 'Верно! type стал number — справа появились стрелки.', 'Right! type became number, so arrows appeared on the right.')
    },
    miss: {
      pass: L3("Qarang: oldin harflar ochiq turgan edi, keyin nuqtalarga aylandi. Harflarni esa type password yashiradi.", 'Смотри: сначала буквы были видны, потом стали точками. Буквы прячет type password.', 'Look: first the letters were visible, then they became dots. type password hides letters.'),
      ph: L3("Bir solishtiring-chi: oldin maydon bo'm-bo'sh edi, keyin ichida kulrang ishora paydo bo'ldi. Ishorani esa placeholder beradi.", 'Смотри: сначала поле было пустым, потом в нём появилась серая подсказка. Подсказку даёт placeholder.', 'Look: first the field was empty, then a grey hint appeared in it. placeholder gives the hint.'),
      num: L3("E'tibor bering: son o'sha-o'sha qoldi, lekin yonida strelkalar paydo bo'ldi. Strelkalar type number bilan chiqadi.", 'Смотри: число то же самое, но после справа появились стрелки. Стрелки бывают у type number.', 'Look: the number is the same, but after, arrows appeared on the right. Arrows come with type number.')
    },
    done: L3("Endi maydon nega boshqacha ko'rinishini o'zingiz tushuntirib bera olasiz: buni kodning o'zi aytib turadi. Yozuvni maydonga bog'lash esa hali oldinda.", 'Теперь ты по коду понимаешь, почему поле выглядит так. Дальше свяжем подпись с полем.', 'Now you can tell from the code why a field looks the way it does. Next, let’s connect a caption to a field.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After'),
    // Ступени подсказки (лампочка): 1 — куда смотреть, 2 — по виду раунда, 3 — причина и какой ответ выбрать.
    hint1: L3("«Oldin» va «Keyin» kartochkalaridagi maydonni solishtirib ko'ring: harflar, ishora yoki strelkalar, qaysi biri o'zgardi?", 'Сравни поле «до» и «после»: что в нём изменилось?', 'Compare the field before and after: what changed in it?'),
    hint2: {
      pass: L3("Yozilgan harflar ko'rinib turibdimi yoki nuqtalarga aylanganmi?", 'Посмотри на буквы: они видны или спрятались? Вспомни, какой type прячет буквы.', 'Look at the letters: can you see them, or are they hidden? Remember which type hides letters.'),
      ph: L3("Bo'sh maydonda kulrang so'zlar paydo bo'ldimi? Bunday ishorani qaysi atribut berardi?", 'В пустом поле появились серые слова? Вспомни, какой атрибут даёт подсказку в пустом поле.', 'Did grey words appear in the empty field? Remember which attribute gives a hint in an empty field.'),
      num: L3("Son o'zgarmadi-ku. Maydonning o'ng tomonida nima paydo bo'ldi, qarang-chi?", 'Число не изменилось. Посмотри на правый край поля: что там появилось? Вспомни, с каким type бывают стрелки.', 'The number didn’t change. Look at the right edge of the field: what appeared there? Remember which type comes with arrows.')
    },
    // Как назвать кнопку в третьей ступени — словами, без кавычек и знаков (подсказка звучит).
    pick: { pass: L3('password', 'password', 'password'), ph: L3('placeholder', 'placeholder', 'placeholder'), num: L3('number', 'number', 'number') }
  },
  s11: {
    eyebrow: L3('label va form', 'label и form', 'label and form'),
    say: L3("Hozir yozuv bilan maydon alohida-alohida yashaydi: yozuv p tegida, maydon esa uning ostida turibdi. Telefonning kichkina ekranida maydonga barmoq tekkizish ancha qiyin-ku. Yozuvni bossak, maydon o'zi tanlansa, qulay bo'lardi. Qani, bosib ko'raylik-chi!",
      'Сейчас подпись и поле живут отдельно: подпись в теге p, а поле под ней. На маленьком экране попасть в поле трудно. Давай нажмём на подпись.',
      'Right now the caption and the field are separate: the caption is in a p tag, and the field is under it. On a small screen the field is hard to hit. Let’s tap the caption.'),
    sayNoLabel: L3("Yozuvni bosdik, lekin hech narsa bo'lmadi. Maydon tanlanmadi, chunki brauzer bu yozuv aynan shu maydonniki ekanini bilmaydi.",
      'Подпись нажата, но ничего не случилось. Поле не выбралось, потому что браузер не знает, что подпись относится к этому полю.',
      'The caption was tapped, but nothing happened. The field wasn’t selected, because the browser doesn’t know the caption belongs to this field.'),
    sayLabel: L3("Endi yozuvni ham, maydonni ham label tegi ichiga olamiz. Bu teg yozuvni maydonga bog'lab qo'yadi, xuddi quti ustiga yopishtirilgan nom kabi. Qarang, yozuv bilan maydon bitta qatorga chiqib oldi!",
      'Теперь обернём подпись и поле в тег label. label — английское слово, то есть «подпись». Он связывает подпись с полем. Смотри, подпись и поле встали в одну строку.',
      'Now let’s wrap the caption and the field in the label tag. label is an English word for a caption or name tag. It ties the caption to the field. Look, the caption and the field are now on one line.'),
    sayFocus: L3("Yozuvni yana bir bosib ko'ramiz. Voy, qarang: maydon o'zi tanlandi, yozishga tayyor turibdi! Endi kichkina maydonni nishonga olish shart emas, yozuvga tegsangiz ham yetarli.",
      'Нажмём на подпись ещё раз. Смотри, поле само выбралось и готово к вводу. Теперь не нужно целиться в маленькое поле: достаточно коснуться подписи.',
      'Let’s tap the caption again. Look, the field got selected by itself and is ready for typing. Now you don’t have to aim for the small field: touching the caption is enough.'),
    sayForm: L3("Oxirida maydonlarning hammasini form tegi bilan o'rab qo'yamiz: form anketaning o'zi, u hamma maydonlarni bitta anketaga yig'ib turadi. Sahifada uni ko'rmaysiz, lekin tugma bilan anketani yuborganimizda aynan form kerak bo'ladi.",
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
    say: L3("Klub anketasini tuzatdik, endi o'zingizning anketangizni yasash vaqti keldi! Kodda form, label va maydon tayyor turibdi, faqat yozuvi yo'q. Sahifangizga kirgan odamdan nima so'ramoqchisiz? Shu savolni label ichiga yozing-da, «Tayyor»ni bosing.",
      'Теперь сделай свою анкету. В коде уже есть form, label и поле, нет только подписи. О чём ты хочешь спросить того, кто откроет страницу? Напиши этот вопрос внутри label. Потом нажми «Готово».',
      'Now make your own form. The code already has form, label and a field; only the caption is missing. What do you want to ask the person who opens the page? Write that question inside label. Then tap “Done”.'),
    ok: L3("Savolingiz ma'qul! Endi shu maydonga kulrang ishora ham qo'shamiz.", 'Классный вопрос! Теперь добавим полю серую подсказку.', 'Great question! Now let’s add a grey hint to the field.'),
    hints: [
      L3("Anketangizni ochgan odamdan nimani bilmoqchisiz? Shuni yozing.", 'О чём ты хочешь спросить? Это и напиши.', 'What do you want to ask? Write that.'),
      L3("Teglar tayyor turibdi, savolning o'zini yozish sizdan.", 'Пиши только слова — теги на месте.', 'Type only words: the tags are in place.'),
      L3("Masalan, «Sevimli taomingiz» deb yozing, keyin «Tayyor»ni bosing.", 'Например: Любимая еда. Потом нажми «Готово».', 'For example: Favorite food. Then tap “Done”.')
    ],
    ask: L3('Yozuvni yozing va «Tayyor»ni bosing', 'Напиши подпись и нажми «Готово»', 'Type the caption and tap “Done”'),
    ph: L3('Masalan: Sevimli taomingiz', 'Например: Любимая еда', 'For example: Favorite food'),
    sample: L3('Sevimli taomingiz:', 'Любимая еда:', 'Favorite food:')
  },
  s13: {
    eyebrow: L3('Anketangiz ishorasi', 'Подсказка своей анкеты', 'Your form’s hint'),
    say: L3("Endi maydoningizga kulrang ishora yozib qo'ying: odam bu yerga nima yozsa bo'lishini bitta misol bilan ko'rsating. Ishorani placeholder atributidagi qo'shtirnoq ichiga yozing. Yozib bo'lsangiz, «Tayyor»ni bosing.",
      'Теперь напиши своему полю серую подсказку: покажи примером, что сюда можно написать. Подсказка пишется в кавычках placeholder. Потом нажми «Готово».',
      'Now write a grey hint for your field: show with an example what can be typed here. The hint goes in the placeholder quotes. Then tap “Done”.'),
    ok: L3("Endi anketangizni ochgan har kim nima yozish kerakligini darrov tushunadi.", 'Отлично! Теперь любой, кто откроет твою анкету, сразу поймёт, что писать.', 'Great! Now anyone who opens your form will instantly know what to type.'),
    hints: [
      L3("Savolingizga qanaqa javob yozish mumkin? Shundan bitta misol yozing.", 'Какой ответ можно сюда написать? Напиши один пример.', 'What answer could go here? Write one example.'),
      L3("Qo'shtirnoqlar allaqachon joyida turibdi, ularning ichiga faqat so'z yozing.", 'Пиши только слова — кавычки на месте.', 'Type only words: the quotes are in place.'),
      L3("Masalan, savol taom haqida bo'lsa, «Osh» deb yozing, keyin «Tayyor»ni bosing.", 'Например: Плов. Потом нажми «Готово».', 'For example: Plov. Then tap “Done”.')
    ],
    ask: L3("Ishora yozing va «Tayyor»ni bosing", 'Напиши подсказку и нажми «Готово»', 'Type the hint and tap “Done”'),
    ph: L3('Masalan: Osh', 'Например: Плов', 'For example: Plov'),
    sample: L3('Masalan, osh', 'Например, плов', 'For example, plov')
  },
  s14: {
    eyebrow: L3("Parol ochiq qoldi", 'Пароль виден всем', 'The password is showing'),
    say: L3("Anketangizdagi parol maydoni qiziq ahvolda: harflari hammaga ochiq ko'rinib turibdi! Sababi shuki, type qiymatini yozishni unutibman, qiymat bo'lmasa esa brauzer maydonni oddiy deb biladi. Kerakli qiymatni bo'sh joyga qo'ying.",
      'Я добавил в твою анкету поле пароля, но забыл написать значение type. Без значения браузер считает поле обычным. Смотри, пароль виден всем! Перетащи нужное значение в пустое место.',
      'I added a password field to your form, but forgot to write the type value. Without a value, the browser treats it as an ordinary field. Look, the password is visible to everyone! Drag the right value into the empty spot.'),
    why: {
      text: L3("Qarang: text bilan maydon oddiyligicha qoladi, parol ham hammaga ko'rinib turaveradi.", 'С text поле обычное, и пароль остаётся виден.', 'With text the field is ordinary, and the password stays visible.'),
      number: L3("Unday emas: number faqat son uchun kerak, u parolni yashira olmaydi.", 'number — только для числа. Пароль он не прячет.', 'number is only for numbers. It doesn’t hide the password.')
    },
    ok: L3("Ana endi joyida! Parol endi ko'rinmaydi.", 'Вот теперь порядок! Пароль спрятался за точками.', 'That’s it! The password is hidden behind dots.'),
    ask: L3("Kerakli qiymatni bo'sh joyga olib boring", 'Перетащи нужное значение в пустое место', 'Drag the right value into the empty spot'),
    // Ступени подсказки: 1 — куда смотреть, 2 — правило, 3 — какой кусок взять (он загорается).
    hints: [
      L3("Parolning harflari hammaga ko'rinib turibdi. Maydonga qanaqa qiymat kerak?", 'Посмотри на браузер: буквы пароля видны всем. Какое значение нужно полю?', 'Look at the browser: the password letters are visible to everyone. What value does the field need?'),
      L3("text oddiy maydon yasaydi, number esa son uchun kerak. Parolga qaysisi mos keladi?", 'Значение type задаёт вид поля: text — обычное поле, number — для числа. Какое значение превращает буквы в точки?', 'The type value sets the kind of field: text is an ordinary field, number is for numbers. Which value turns letters into dots?'),
      L3("Bo'laklar ichidan password so'zini oling-da, bo'sh joyga qo'ying.", 'Возьми кусок password и перетащи его в пустое место.', 'Take the password piece and drag it into the empty spot.')
    ]
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Klub anketasi g'alati ishlayapti: bir maydon boshqalardek emas. Avval sahifadan topib oling-chi, qaysi biri o'zini boshqacha tutyapti? Keyin kodda o'sha maydonning qatorini bosing.",
      'Теперь проверь себя. Вот анкета клуба, но в ней ошибка. Посмотри на браузер: какое поле работает не так? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the club form, but it has a bug. Look at the browser: which field isn’t working right? Find the line with the bug and tap it.'),
    say2: L3("Parol yashirindi, anketa esa hali tinchimadi: o'yin maydonidagi kulrang ishora g'oyib bo'libdi. Buning sababi nimada?", 'Класс, первая ошибка найдена! Теперь у другого поля пропала серая подсказка. Что сломано здесь?', 'Great, the first bug is found! Now another field lost its grey hint. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qatordagi maydon odatdagidek ishlayapti. Boshqacha ishlayotgan maydon qaysi, sahifadan yana izlang.", 'Эта строка в порядке. Посмотри на браузер: какое поле ведёт себя не так?', 'This line is fine. Look at the browser: which field is behaving differently?'),
    found: {
      type: L3("Mana, parolning dushmani! Parol maydonida type text turgan, shuning uchun hamma uni o'qiy olardi.", 'Есть! У поля пароля был type text. Поэтому пароль был виден всем.', 'Found it! The password field had type text. That’s why the password was visible to everyone.'),
      ph: L3("Topildi! placeholder so'zidan bitta harf tushib qolgan, brauzer esa bunaqa atributni tanimaydi, shuning uchun ishora chiqmagan edi.", 'Есть! В слове placeholder пропала буква. Браузер не знает такого атрибута, поэтому подсказки не было.', 'Found it! A letter was missing from the word placeholder. The browser doesn’t know an attribute like that, so there was no hint.')
    },
    hints: {
      type: [
        L3("Sahifadagi maydonlarga qarang-chi: qaysi birining yozuvi hech kimga ko'rinmasligi kerak edi?", 'Посмотри на браузер: в каком поле текст не должен быть виден?', 'Look at the browser: in which field shouldn’t the text be visible?'),
        L3("Parolni type atributi yashiradi. Parol qatorida type qiymati nima, bir qarang.", 'Пароль прячет атрибут type. Посмотри на значение type в строке пароля.', 'The type attribute hides a password. Look at the type value in the password line.'),
        L3("Uchinchi qatorga qarang-chi: u yerda type qiymati qanaqa?", 'Посмотри на третью строку: какое там значение type?', 'Look at the third line: what’s the type value?')
      ],
      ph: [
        L3("Sahifadagi maydonlarga qarang: qaysi birida kulrang ishora ko'rinmayapti?", 'Посмотри на браузер: у какого поля нет серой подсказки?', 'Look at the browser: which field has no grey hint?'),
        L3("Ishorani placeholder beradi. Shu atribut nomini harfma-harf o'qib chiqing.", 'Подсказку даёт placeholder. Прочитай имя атрибута буква за буквой.', 'placeholder gives the hint. Read the attribute name letter by letter.'),
        L3("Birinchi qatorga qarang: placeholder to'liq yozilganmikan?", 'Посмотри на первую строку: placeholder написан полностью?', 'Look at the first line: is placeholder spelled in full?')
      ]
    },
    ok: L3("Qoyil, anketa endi butunlay soz: parol yashirin, ishora joyida! Klubga yozilmoqchi bo'lganlar uni bemalol to'ldiraveradi.", 'Супер! Обе ошибки найдены. Ты проверяешь анкеты как настоящий программист.', 'Super! Both bugs are found. You check forms like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Anketalar haqida uchta fikrni kartochkaga yozib qo'ydim, ehtiyot bo'ling, birortasi yolg'on bo'lishi mumkin! Har birini o'qing-da, «Rost» yoki «Yolg'on»ni tanlang.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("Rostmi yoki yolg'onmi?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки: 1 — как читать фразу, 2 — правило урока, 3 — причина и ответ (choiceHints).
    hint1: L3("Fikrdagi asosiy so'zni toping: u type, placeholder yoki label haqidami?", 'Прочитай фразу по частям: о каком теге или атрибуте она?', 'Read the sentence piece by piece: which tag or attribute is it about?'),
    hint2: L3("Fikr harflarni yashirish, kulrang ishora yoki yozuvni bog'lash haqidami? Shu ishning egasini eslang.",
      'Вспомни: type password прячет буквы за точками. placeholder — серая подсказка в пустом поле. А label связывает подпись с полем. Фраза с этим совпадает?',
      'Remember: type password hides letters behind dots. placeholder is a grey hint in an empty field. And label ties the caption to the field. Does the sentence match that?'),
    yes: L3("Rost", 'Верно', 'True'),
    no: L3("Yolg'on", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3("type password bo'lsa, maydonga yozilgan harflar nuqtaga aylanadi.", 'Если type — password, введённые буквы прячутся за точками.', 'If type is password, the typed letters hide behind dots.'), right: true, code: 'pass',
        why: L3("Parol maydoniga doim type password yozib qo'yiladi, shunda parolni yoningizdagi odam ham o'qiy olmaydi.", 'Поэтому в поле пароля всегда пишут type password.', 'That’s why a password field always gets type password.') },
      { t: L3("placeholder maydonga yozilgan javobning o'zi bo'ladi.", 'placeholder — это сам ответ, написанный в поле.', 'placeholder is the answer typed into the field.'), right: false, code: 'ph',
        why: L3("placeholder javob emas, u faqat kulrang ishora bo'ladi. Yozishni boshlashingiz bilan u g'oyib bo'ladi.", 'placeholder — только серая подсказка. Когда начинаешь писать, она исчезает.', 'placeholder is only a grey hint. It disappears when you start typing.') },
      { t: L3("label ichidagi yozuvni bossangiz, maydon yozishga tayyor bo'ladi.", 'Если нажать на подпись внутри label, поле готово к вводу.', 'If you tap the caption inside label, the field is ready for typing.'), right: true, code: 'label',
        why: L3("label yozuvni maydonga bog'lab qo'yadi, shuning uchun yozuvga tegsangiz ham maydon tanlanadi.", 'label связывает подпись с полем, поэтому достаточно коснуться подписи.', 'label ties the caption to the field, so touching the caption is enough.') }
    ],
    ok: L3("Parol, ishora va yozuv haqidagi fikrlarning tagiga yetdingiz!", 'Всё верно! Ты отлично знаешь поля, их виды, подсказки и подписи.', 'All correct! You know fields, their kinds, hints and captions really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Ukamga to'g'ri javob aytdim: «Harflarni nuqtalarga type password aylantiradi, placeholder esa faqat kulrang ishora». Mana, o'sha sahifa: parol maydonida placeholder turibdi, ichida Parol degan so'z. Yozishni boshlashim bilan so'z yo'qoldi, parolning o'zi esa hammaga ochiq ko'rinib qoldi. Ukam bilib oldi, men ham.",
        'Вернёмся к загадке. Помнишь, я добавил полю пароля placeholder со словом «Пароль»? Увы, я ошибся. placeholder — только серая подсказка. Когда я начал вводить пароль, подсказка исчезла, а пароль остался виден всем. Спрятать пароль за точками может только type password.',
        'Back to our riddle. Remember, I added placeholder with the word “Password” to a password field? Sadly, I was wrong. placeholder is only a grey hint. When I started typing the password, the hint disappeared and the password stayed visible to everyone. Only type password can hide a password behind dots.'), k: 'riddle' },
      { text: L3("Endi sizning anketangizga qarang! Unda o'zingiz o'ylab topgan savol ham, kulrang ishorangiz ham turibdi.", 'Смотри, это твоя анкета! В ней твой вопрос и твоя подсказка.', 'Look, this is your form! It has your question and your hint.'), k: null },
      { text: L3("Anketaning poydevori input: u sahifaga maydon qo'yadi.", 'Тег input ставит на страницу поле.', 'The input tag puts a field on the page.'), k: 'input' },
      { text: L3("Maydonning qiyofasini type tanlaydi: oddiymi, parolmi yoki son.", 'Атрибут type выбирает вид поля.', 'The type attribute chooses the kind of field.'), k: 'type' },
      { text: L3("Bo'sh maydonda nima yozishni placeholder pichirlab turadi, yozishni boshlasangiz, indamay yo'qoladi.", 'placeholder показывает серую подсказку в пустом поле.', 'placeholder shows a grey hint in an empty field.'), k: 'placeholder' },
      { text: L3("label yozuvni maydonga ulaydi, shuning uchun yozuvni bossangiz ham maydon tanlanadi. form esa hammasini bitta anketaga yig'adi.", 'А label связывает подпись с полем, а form собирает всё в одну анкету.', 'label ties a caption to its field, and form gathers everything into one form.'), k: 'label' },
      { text: L3("Endi sahifangiz odamlardan savol so'rab, javob ham ola oladi. Ukam esa boshqa narsadan tashvishda: o'yin nomini hamma har xil yozib yuborsa-chi? Unga ro'yxat va tugma yordam beradi.", 'Ура! Теперь твоя страница умеет спрашивать людей. На следующем уроке добавим выбор из списка и кнопку и отправим анкету. До встречи!', 'Hooray! Now your page can ask people questions. Next time we’ll add choosing from a list and a button, and send the form. See you!'), k: null }
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
