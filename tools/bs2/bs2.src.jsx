// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 2 — «Цвета и кнопки»
// (облик «Редактор», как урок 1 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs2/build.mjs → lessons/bootstrap/02-cveta-i-knopki.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Цвета и кнопки» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Урок 1 пройден: Bootstrap — готовый CSS, сайт getbootstrap.com, CDN, Alert и theme-*. Теперь
// сайт кружка роботов получает кнопки и цвета. Кнопка Bootstrap 6 — два слова: стиль (btn-solid — с заливкой,
// btn-outline — с рамкой) и цвет (theme-*); цвет текста — fg-*, фон — bg-* (в версии 5 — btn-primary, text-success:
// в 6 не работают). Ученик учится находить на сайте страницу Button, по картинке примера находить строку кода,
// копировать её и настраивать; Utilities → Colors и Background. Загадка (без имён): Коди думает, что у каждой вещи
// свои слова цвета и их надо зубрить; разгадка перед выводом — слова цвета одна семья (success, danger…).
// Решения заказчика — CLAUDE.md, «Модуль Bootstrap»; 20.11.2026: «с первого урока берём как на видео, но слайдов как
// обычно не меньше 17».
//
// ДУГА (18 экранов; экрана плана нет). Сценарий — docs/scenarij-bootstrap-02-cveta-i-knopki.md.
//   s1 крючок (серая кнопка, Yozildi: 0 → два слова class) · кнопки: s2 показ (стиль + цвет) · x1 пульт · r1 читаем код ·
//   g1 показ «как видео» (Button, Variants) · s6 показ «как видео» (строку — в код, свой текст, имя версии 5) ·
//   t1 сам (найти и взять) · t2 по образцу (3 раунда) · одно слово везде: s8 показ · t3 в цвет объявления ·
//   текст и фон: s10 показ «как видео» (Colors, fg-*) · t4 · s12 показ «как видео» (Background, bg-*) · t5 ·
//   итог: q1 картинка → код · t6 почему не красится · w1 своя кнопка · s18 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честная страница: iframe без скриптов, настоящий bootstrap.min.css 6.0.0-alpha.1; class — как набран.
//   · Сайт Bootstrap — похожая страница в окне Chrome (светлая): страницы Button, Colors, Background сверены с docs 6.0.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы; в речи нет символов.
//
// СИСТЕМА СЛОВ: Bootstrap, class, btn-solid, btn-outline, theme-*, fg-*, bg-*, Button, Utilities, Colors, Background,
// Variants — по-английски (правка речи в build.mjs); tugma — кнопка; uslub — стиль (draft); ichi to'la — с заливкой;
// chegarali — с рамкой; rang so'zi — слово цвета; matn rangi — цвет текста; fon — фон; namuna — образец.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-02-cveta-i-knopki',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '2-dars. Ranglar va tugmalar',
    ru: 'Урок 2. Цвета и кнопки',
    en: 'Lesson 2. Colors and buttons'
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
  goal: L3('Vazifa', 'Задание', 'Task'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Yuklanish va rasmlar', 'Загрузка и изображения', 'Loading and images'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  need: L3('Kerak', 'Нужно', 'Goal'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, … ; печатаются: eyebrow, ask, site.
// ───────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт кружка — содержимое страницы (не звучит).
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    h1: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    when: L3('Shanba kuni, soat 10:00', 'В субботу, в 10:00', 'Saturday, 10:00'),
    notice: L3("Joylar soni cheklangan!", 'Мест мало!', 'Places are limited!'),
    btn: L3("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
    more: L3('Batafsil', 'Подробнее', 'More')
  },
  // Поля в class (t2–t5, w1): причины промахов — общие.
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga bitta so'z yozing.", 'Впиши в пустое место одно слово.', 'Type one word into the empty spot.'),
      dot: L3("Nuqta kerak emas. Nuqta CSS faylida turadi, class ichida esa so'z nuqtasiz yoziladi.", 'Точка не нужна. Точка бывает в файле CSS, а в class слово пишется без точки.', 'No dot needed. The dot lives in a CSS file; inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha, ularni saytdan oling.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские, бери их с сайта.', 'Latin letters are needed here. Bootstrap’s words are English: take them from the site.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      native: L3("Bootstrap rangni oddiy nomi bilan emas, o'z so'zi bilan ataydi. So'zni saytdan oling.", 'Bootstrap называет цвет не обычным словом, а своим. Возьми слово с сайта.', 'Bootstrap doesn’t call a color by its plain name but by its own word. Take the word from the site.'),
      v5: L3("Bu eski nom, Bootstrapning beshinchi versiyasidan. Oltinchisida u ishlamaydi, so'zni saytdan oling.", 'Это старое имя из пятой версии Bootstrap. В шестой оно не работает, возьми слово с сайта.', 'That’s an old name from Bootstrap version five. It doesn’t work in version six: take the word from the site.'),
      isShape: L3("Bu uslub so'zi. Bu joyga esa rang so'zi kerak.", 'Это слово стиля. А сюда нужно слово цвета.', 'That’s a style word. This spot needs a color word.'),
      isColor: L3("Bu rang so'zi. Bu joyga esa uslub kerak: ichi to'la yoki chegarali.", 'Это слово цвета. А сюда нужен стиль: с заливкой или с рамкой.', 'That’s a color word. This spot needs a style: filled or outlined.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      noColor: L3("Bootstrap bunday so'zni bilmaydi: \u2063{w}\u2064. Shuning uchun rang chiqmadi. Saytdagi so'zlardan birini oling.", 'Bootstrap не знает такого слова: \u2063{w}\u2064. Поэтому цвета нет. Возьми одно из слов на сайте.', 'Bootstrap doesn’t know this word: \u2063{w}\u2064. So there’s no color. Take one of the words from the site.'),
      noShape: L3("Bunday uslub yo'q: \u2063{w}\u2064. Tugma uslubi ikkita: btn-solid va btn-outline.", 'Такого стиля нет: \u2063{w}\u2064. У кнопки два стиля: btn-solid и btn-outline.', 'There’s no such style: \u2063{w}\u2064. A button has two styles: btn-solid and btn-outline.'),
      otherShape: L3("Uslub boshqa chiqdi. Namunaga qarang: tugmaning ichi to'lami yoki faqat chegarasi bormi?", 'Стиль получился другой. Посмотри на образец: кнопка залита цветом или у неё только рамка?', 'The style came out different. Look at the goal: is the button filled, or does it just have a border?'),
      other: L3("Bootstrap bu so'zni bildi, lekin rang namunadagidan boshqa. Sahifani namuna bilan solishtiring va saytdan o'sha rangni toping.", 'Bootstrap это слово знает, но цвет не как в образце. Сравни страницу с образцом и найди этот цвет на сайте.', 'Bootstrap knows that word, but the color isn’t the one in the goal. Compare the page with the goal and find that color on the site.'),
      fam_theme: L3("Bu so'z boshqa narsa uchun: \u2063{w}\u2064. Tugma va e'lon rangi theme so'zi bilan boshlanadi.", 'Это слово для другого: \u2063{w}\u2064. Цвет кнопки и объявления начинается со слова theme.', 'This word is for something else: \u2063{w}\u2064. A button’s or notice’s color starts with theme.'),
      fam_fg: L3("Bu matn rangi emas: \u2063{w}\u2064. Matn rangi fg bilan boshlanadi.", 'Это не цвет текста: \u2063{w}\u2064. Цвет текста начинается с fg.', 'That’s not a text color: \u2063{w}\u2064. Text color starts with fg.'),
      fam_bg: L3("Bu fon emas: \u2063{w}\u2064. Fon rangi bg bilan boshlanadi, fg esa matn rangi.", 'Это не фон: \u2063{w}\u2064. Фон начинается с bg, а fg — это цвет текста.', 'That’s not a background: \u2063{w}\u2064. Background starts with bg, and fg is the text color.')
    }
  },
  s1: {
    eyebrow: L3("Kulrang tugma", 'Серая кнопка', 'A gray button'),
    say: L3("Salom! Robot to'garagining sayti tayyor, pastida ro'yxatdan o'tish tugmasi bor. Lekin hech kim yozilmadi, qarang, nol! Tugma kulrang va zerikarli, uni hech kim payqamayapti. Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Сайт кружка роботов готов, внизу есть кнопка записи. Но никто не записался, смотри, ноль! Кнопка серая и скучная, её никто не замечает. Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! The robot club site is ready, with a sign-up button at the bottom. But nobody signed up, look, zero! The button is gray and dull, nobody notices it. Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Tugma yashil bo'ldi va darrov ko'zga tashlanyapti. Odamlar yozila boshladi! Kodga qarang: class ichida atigi ikkita so'z.",
      'Ого! Кнопка стала зелёной и сразу бросается в глаза. Люди начали записываться! Посмотри на код: в class всего два слова.',
      'Whoa! The button turned green and stands out right away. People started signing up! Look at the code: just two words in class.'),
    done: L3("Bugun tugmalar va ranglar bilan ishlaymiz: saytdan kerakli tugmani topasiz, nusxalaysiz va o'zingizga moslaysiz. Lekin oldin topishmoq. Menimcha, Bootstrapda har bir narsaning o'z rang so'zlari bor: yashil tugma uchun bitta so'z, yashil e'lon uchun boshqasi, yashil matn uchun yana boshqasi. Demak, yuzlab so'zni yodlash kerak. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня работаем с кнопками и цветами: найдёшь нужную кнопку на сайте, скопируешь и настроишь под себя. Но сначала загадка. По-моему, в Bootstrap у каждой вещи свои слова цвета: для зелёной кнопки одно слово, для зелёного объявления другое, для зелёного текста третье. Значит, учить сотни слов. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today we work with buttons and colors: you’ll find the button you need on the site, copy it and make it your own. But first, a riddle. I think in Bootstrap every thing has its own color words: one word for a green button, another for a green notice, a third for green text. So you’d have to learn hundreds of words. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3("Tugma — class ichida ikkita so'z", 'Кнопка — два слова в class', 'A button is two words in class'),
    count: L3('Yozildi', 'Записались', 'Signed up')
  },
  s2: {
    eyebrow: L3('Tugma nimadan iborat', 'Из чего кнопка', 'What a button is made of'),
    help: [
      L3("Koddagi class so'zlariga va ularning tagidagi ikkita belgiga qarang: uslub va rang.", 'Посмотри на слова в class и на две метки под ними: стиль и цвет.', 'Look at the words in class and the two labels under them: style and color.'),
      L3("Birinchi so'z tugmaning uslubini beradi, ikkinchisi rangini. Rangni almashtirsangiz, faqat ikkinchi so'z o'zgaradi.", 'Первое слово даёт кнопке стиль, второе — цвет. Чтобы поменять цвет, меняешь только второе слово.', 'The first word gives the button its style, the second its color. To change the color, you change only the second word.'),
      L3("Bu futbolka buyurtma qilishga o'xshaydi: oldin modelni tanlaysiz, keyin rangini.", 'Это как заказать футболку: сначала выбираешь модель, потом цвет.', 'It’s like ordering a T-shirt: first you pick the model, then the color.')
    ],
    say: L3("Keling, bu ikki so'zning sirini ochamiz. Hozir tugmada class umuman yo'q, shuning uchun u oddiy brauzer tugmasi. Qarang.",
      'Давай раскроем секрет этих двух слов. Сейчас у кнопки нет class совсем, поэтому она — обычная кнопка браузера. Смотри.',
      'Let’s uncover the secret of these two words. Right now the button has no class at all, so it’s a plain browser button. Watch.'),
    sayShape: L3("Birinchi so'z btn-solid. Bu uslub, ya'ni tugma qanday ko'rinishi degani: ichi to'la, burchaklari yumaloq. Lekin rangi hali yo'q, tugma kulrang.",
      'Первое слово — btn-solid. Это стиль, то есть какой будет кнопка: залитая, со скруглёнными углами. Но цвета пока нет, кнопка серая.',
      'The first word is btn-solid. That’s the style, meaning how the button looks: filled, with rounded corners. But there’s no color yet, the button is gray.'),
    sayColor: L3("Ikkinchi so'z theme-success. Bu rang. success, ya'ni muvaffaqiyat degani, shuning uchun u yashil.",
      'Второе слово — theme-success. Это цвет. success значит «успех», поэтому он зелёный.',
      'The second word is theme-success. That’s the color. success means, well, success, so it’s green.'),
    sayMore: L3("Endi faqat ikkinchi so'zni almashtiraman: danger qizil, primary esa ko'k. Uslub joyida qoldi, rang o'zgardi.",
      'А теперь меняю только второе слово: danger — красный, а primary — синий. Стиль остался, цвет поменялся.',
      'Now I change only the second word: danger is red, and primary is blue. The style stayed, the color changed.'),
    done: L3("Eslab qoling: Bootstrap tugmasi bu ikki so'z. Birinchisi uslub, ikkinchisi rang.",
      'Запомни: кнопка Bootstrap — это два слова. Первое — стиль, второе — цвет.',
      'Remember: a Bootstrap button is two words. The first is the style, the second is the color.'),
    askStart: L3('Qarang: oddiy tugma', 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askShape: L3("Qarang: birinchi so'z — uslub", 'Смотри: первое слово — стиль', 'Watch: the first word is the style'),
    askColor: L3("Qarang: ikkinchi so'z — rang", 'Смотри: второе слово — цвет', 'Watch: the second word is the color'),
    askDone: L3('Tugma: uslub va rang', 'Кнопка: стиль и цвет', 'Button: style and color'),
    shapeL: L3('uslub', 'стиль', 'style'),
    colorL: L3('rang', 'цвет', 'color')
  },
  x1: {
    eyebrow: L3('Rang pulti', 'Пульт цветов', 'The color remote'),
    say: L3("Endi pult sizda. Pastda ikkita uslub va sakkizta rang bor. Bosib ko'ring: ikkala uslubni va kamida uchta rangni sinang.",
      'Теперь пульт у тебя. Внизу два стиля и восемь цветов. Понажимай: попробуй оба стиля и хотя бы три цвета.',
      'Now the remote is yours. Below are two styles and eight colors. Try them: test both styles and at least three colors.'),
    solid: L3("btn-solid: tugmaning ichi rang bilan to'la.", 'btn-solid: кнопка залита цветом.', 'btn-solid: the button is filled with color.'),
    outline: L3("btn-outline: faqat chegara va yozuv rangli, ichi oq. Bunday tugma asosiy tugmadan keyin turadi.", 'btn-outline: цветные только рамка и надпись, внутри белое. Такая кнопка обычно идёт после главной.', 'btn-outline: only the border and the text are colored, inside is white. This kind usually comes after the main button.'),
    mean: {
      primary: L3("primary, ya'ni asosiy degani. Ko'k rang.", 'primary — значит «главный». Синий.', 'primary means main. Blue.'),
      accent: L3("accent, ya'ni urg'u degani. Binafsha rang.", 'accent — значит «акцент». Фиолетовый.', 'accent means emphasis. Purple.'),
      success: L3("success, ya'ni muvaffaqiyat degani. Yashil.", 'success — «успех». Зелёный.', 'success means success. Green.'),
      danger: L3("danger, ya'ni xavf degani. Qizil.", 'danger — «опасность». Красный.', 'danger means danger. Red.'),
      warning: L3("warning, ya'ni ogohlantirish degani. Sariq.", 'warning — «предупреждение». Жёлтый.', 'warning means warning. Yellow.'),
      info: L3("info, ya'ni ma'lumot degani. Havorang.", 'info — «информация». Голубой.', 'info means information. Light blue.'),
      inverse: L3("inverse, ya'ni teskari degani. Qora.", 'inverse — «наоборот». Чёрный.', 'inverse means reversed. Black.'),
      secondary: L3("secondary, ya'ni ikkinchi darajali degani. Och kulrang.", 'secondary — «второстепенный». Светло-серый.', 'secondary means secondary. Light gray.')
    },
    ok: L3("Ajoyib! Sezdingizmi, Bootstrap rangni qizil yoki yashil deb atamaydi. U rangni ma'nosi bilan ataydi: danger xavf uchun, success muvaffaqiyat uchun.",
      'Отлично! Заметил? Bootstrap не называет цвет «красный» или «зелёный». Он называет цвет по смыслу: danger — для опасного, success — для удачного.',
      'Great! Notice that Bootstrap doesn’t call a color red or green. It names the color by its meaning: danger for something risky, success for something good.'),
    done: L3("Masalan, o'chirish tugmasi qizil, danger bo'ladi. Saqlash tugmasi esa yashil, success.",
      'Например, кнопка «Удалить» — красная, danger. А кнопка «Сохранить» — зелёная, success.',
      'For example, a delete button is red, danger. And a save button is green, success.'),
    hints: [
      L3("Pastdagi tugmalarni bosing: yuqori qatorda uslub, pastda rang.", 'Нажимай кнопки внизу: в верхнем ряду стиль, в нижнем цвет.', 'Tap the buttons below: style on the top row, color on the bottom.'),
      L3("Ikkala uslubni bosing, keyin uchta har xil rangni.", 'Нажми оба стиля, потом три разных цвета.', 'Tap both styles, then three different colors.'),
      L3("Masalan: btn-outline, keyin success, danger va warning.", 'Например: btn-outline, потом success, danger и warning.', 'For example: btn-outline, then success, danger and warning.')
    ],
    ask: L3("Ikkala uslubni va uchta rangni sinang", 'Попробуй оба стиля и три цвета', 'Try both styles and three colors'),
    askDone: L3("Rang nomi — ma'nosi bo'yicha", 'Имя цвета — по смыслу', 'A color is named by its meaning'),
    shapeH: L3('Uslub', 'Стиль', 'Style'),
    colorH: L3('Rang', 'Цвет', 'Color')
  },
  r1: {
    eyebrow: L3("Kodni o'qiymiz", 'Читаем код', 'Reading the code'),
    say: L3("Endi teskarisi. Kodda bitta qator, sahifada esa to'rtta tugma. Qaysi tugmani aynan shu qator chizadi? Sahifada o'sha tugmani bosing.",
      'Теперь наоборот. В коде одна строка, а на странице четыре кнопки. Какую кнопку рисует именно эта строка? Нажми её на странице.',
      'Now the other way around. There’s one line of code and four buttons on the page. Which button does this exact line draw? Tap it on the page.'),
    ask: L3("Shu kod chizgan tugmani sahifada bosing", 'Нажми на странице кнопку из этого кода', 'Tap the button this code draws'),
    btnT: L3('Batafsil', 'Подробнее', 'More'),
    both: L3("Bu tugmada uslub ham, rang ham boshqa. Kodda ikkala so'zni o'qing.", 'У этой кнопки другие и стиль, и цвет. Прочитай в коде оба слова.', 'This button has a different style and color. Read both words in the code.'),
    shape: L3("Rang to'g'ri, lekin uslub boshqa. Kodda solidmi yoki outline?", 'Цвет верный, а стиль другой. В коде solid или outline?', 'The color is right, but the style is different. Does the code say solid or outline?'),
    color: L3("Uslub to'g'ri, lekin rang boshqa. Kodda qaysi rang so'zi turibdi?", 'Стиль верный, а цвет другой. Какое слово цвета стоит в коде?', 'The style is right, but the color is different. Which color word is in the code?'),
    right: L3("To'ppa-to'g'ri!", 'В точку!', 'Spot on!'),
    done: L3("Zo'r! Endi kodni o'qib, tugma qanday chiqishini oldindan bilasiz.", 'Огонь! Теперь по коду ты заранее знаешь, какой будет кнопка.', 'Awesome! Now you can read the code and know in advance what the button will look like.'),
    hints: [
      L3("Kodda ikkita so'z bor: birinchisi uslub, ikkinchisi rang.", 'В коде два слова: первое — стиль, второе — цвет.', 'There are two words in the code: the first is the style, the second the color.'),
      L3("outline bo'lsa, tugmaning faqat chegarasi rangli. solid bo'lsa, ichi to'la.", 'Если outline — у кнопки цветная только рамка. Если solid — она залита.', 'If it’s outline, only the border is colored. If it’s solid, the button is filled.'),
      L3("Rang so'zining ma'nosi esingizdami? danger qizil, warning sariq, accent binafsha.", 'Вспомни смысл слов: danger — красный, warning — жёлтый, accent — фиолетовый.', 'Remember what the words mean: danger is red, warning is yellow, accent is purple.')
    ]
  },
  g1: {
    eyebrow: L3('Button sahifasi', 'Страница Button', 'The Button page'),
    help: [
      L3("Menyudagi Button bandiga, keyin Variants bo'limidagi misol va kodga qarang.", 'Посмотри на пункт Button в меню, потом на пример и код в разделе Variants.', 'Look at the Button item in the menu, then at the example and code in Variants.'),
      L3("Misolda tugmalar, pastdagi kodda esa har biri uchun bitta qator. Qator tartibi misoldagi tartib bilan bir xil.", 'В примере кнопки, а в коде под ним — по строке на каждую. Порядок строк — как в примере.', 'The example shows the buttons, and the code below has one line for each. The lines go in the same order as the example.'),
      L3("Bu do'kon katalogiga o'xshaydi: rasmga qarab tanlaysiz, tagidagi raqam bilan buyurtma berasiz.", 'Это как каталог в магазине: выбираешь по картинке, заказываешь по номеру под ней.', 'It’s like a shop catalog: you pick by the picture and order by the number under it.')
    ],
    say: L3("Tugmalar qayerdan olinadi? Albatta, Bootstrap saytidan. O'tgan safar Alert sahifasida to'xtagan edik. Endi tugmalar sahifasini topamiz.",
      'Откуда берут кнопки? Конечно, с сайта Bootstrap. В прошлый раз мы остановились на странице Alert. Теперь найдём страницу кнопок.',
      'Where do buttons come from? From the Bootstrap site, of course. Last time we stopped on the Alert page. Now let’s find the buttons page.'),
    sayPage: L3("Components bo'limidan Button bandini bosdim, ya'ni tugma degani. Tepada sahifa nomi va qisqa izoh, pastda esa misollar.",
      'Нажал пункт Button в разделе Components, то есть «кнопка». Наверху название страницы и короткое описание, ниже — примеры.',
      'I tapped Button in Components, which means, well, button. At the top is the page name and a short description, below are the examples.'),
    sayVariants: L3("Mana, Variants bo'limi. Tepada misol: birinchi qatorda ichi to'la tugmalar, ikkinchisida chegarali tugmalar. Pastda esa ularning kodi.",
      'Вот раздел Variants. Наверху пример: в первом ряду залитые кнопки, во втором — с рамкой. А ниже их код.',
      'Here’s the Variants section. At the top is the example: filled buttons in the first row, outlined ones in the second. And their code below.'),
    sayLine: L3("Kodning har bir qatori bitta tugma. Mana, yashil tugmaning qatori: btn-solid va theme-success. Tanish so'zlar, to'g'rimi?",
      'Каждая строка кода — одна кнопка. Вот строка зелёной кнопки: btn-solid и theme-success. Знакомые слова, правда?',
      'Each line of code is one button. Here’s the green button’s line: btn-solid and theme-success. Familiar words, right?'),
    sayOutline: L3("Pastroqda chegarali tugmalarning qatorlari. Rang so'zi o'sha, faqat birinchi so'z btn-outline.",
      'Ниже — строки кнопок с рамкой. Слово цвета то же, только первое слово — btn-outline.',
      'Further down are the outlined buttons’ lines. The color word is the same, only the first word is btn-outline.'),
    done: L3("Eslab qoling: tugmalar Components bo'limida, Button sahifasida. Variants bo'limida rasmga qarab tanlaysiz, kodini esa tagidan olasiz.",
      'Запомни: кнопки — в разделе Components, на странице Button. В Variants выбираешь по картинке, а код берёшь под ней.',
      'Remember: buttons live in Components, on the Button page. In Variants you pick by the picture and take the code from under it.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Button', 'Смотри: Components → Button', 'Watch: Components → Button'),
    askPage: L3('Qarang: Button sahifasi', 'Смотри: страница Button', 'Watch: the Button page'),
    askVariants: L3("Qarang: Variants bo'limi", 'Смотри: раздел Variants', 'Watch: the Variants section'),
    askLine: L3('Qarang: bitta qator — bitta tugma', 'Смотри: одна строка — одна кнопка', 'Watch: one line, one button'),
    askDone: L3('Components → Button → Variants', 'Components → Button → Variants', 'Components → Button → Variants')
  },
  s6: {
    eyebrow: L3('Bitta qatorni olamiz', 'Берём одну строку', 'Taking one line'),
    help: [
      L3("Saytdagi belgilangan qatorga, keyin koddagi body ichiga va sahifadagi tugmaga qarang.", 'Посмотри на выделенную строку на сайте, потом на body в коде и на кнопку на странице.', 'Look at the selected line on the site, then at body in the code and the button on the page.'),
      L3("Bizga hamma tugma emas, bittasi kerak. Shuning uchun butun blokni emas, bitta qatorni belgilab olamiz.", 'Нам нужны не все кнопки, а одна. Поэтому выделяем не весь блок, а одну строку.', 'We don’t need all the buttons, just one. So we select one line, not the whole block.'),
      L3("Bu kitobdan butun bobni emas, bitta jumlani ko'chirib olishga o'xshaydi.", 'Это как выписать из книги не всю главу, а одно предложение.', 'It’s like copying one sentence from a book instead of the whole chapter.')
    ],
    say: L3("Bizga sakkizta tugma kerak emas, faqat bitta yashil tugma kerak. Qarang, bitta qatorni qanday olamiz.",
      'Нам не нужны все кнопки, нужна только одна зелёная. Смотри, как берут одну строку.',
      'We don’t need all those buttons, just one green one. Watch how to take one line.'),
    sayCopy: L3("Sichqonchani bosib turib, qator ustidan suraman: qator belgilandi. Keyin Ctrl va C tugmalarini bosaman. Telefonda esa barmoqni bosib turasiz va Copy ni tanlaysiz.",
      'Зажимаю мышку и веду по строке: строка выделена. Потом нажимаю Ctrl и C. На телефоне держишь палец на тексте и выбираешь Copy.',
      'I hold the mouse button and drag along the line: it’s selected. Then I press Ctrl and C. On a phone, you hold your finger on the text and choose Copy.'),
    sayPaste: L3("Qatorni body ichidagi bo'sh joyga qo'yaman. Mana, sahifada yashil tugma paydo bo'ldi!",
      'Вставляю строку в пустое место внутри body. Вот, на странице появилась зелёная кнопка!',
      'I paste the line into the empty spot inside body. There, a green button appeared on the page!'),
    sayText: L3("Lekin tugmada inglizcha Success yozilgan. Uni belgilab, o'z yozuvimizni yozamiz. Tugma ichidagi matnni xohlagancha o'zgartirsa bo'ladi.",
      'Но на кнопке написано английское Success. Выделяем его и пишем свою надпись. Текст внутри кнопки можно менять как угодно.',
      'But the button says Success in English. We select it and type our own label. You can change the text inside a button however you like.'),
    sayOld: L3("Diqqat qiling: eski darslarda btn-success degan nomni ko'rasiz. Bu Bootstrapning beshinchi versiyasi. Qarang, oltinchisida tugma oddiy kulrang tugmaga aylandi. So'zni doim shu saytdan oling.",
      'Внимание: в старых уроках ты увидишь имя btn-success. Это пятая версия Bootstrap. Смотри, в шестой кнопка стала обычной серой. Слово всегда бери с этого сайта.',
      'Heads up: in old tutorials you’ll see the name btn-success. That’s Bootstrap version five. Look, in version six the button turned into a plain gray one. Always take the word from this site.'),
    done: L3("Eslab qoling: kerakli qatorni belgilaymiz, nusxalaymiz, body ichiga qo'yamiz va yozuvini o'zgartiramiz.",
      'Запомни: выделяем нужную строку, копируем, вставляем в body и меняем надпись.',
      'Remember: select the line you need, copy it, paste it into body and change the label.'),
    askStart: L3('Qarang: kerakli qator', 'Смотри: нужная строка', 'Watch: the line we need'),
    askCopy: L3('Qarang: qator belgilandi', 'Смотри: строка выделена', 'Watch: the line is selected'),
    askPaste: L3("Qarang: body ichiga qo'yildi", 'Смотри: вставлено в body', 'Watch: pasted into body'),
    askText: L3("Qarang: o'z yozuvimiz", 'Смотри: своя надпись', 'Watch: our own label'),
    askOld: L3('Qarang: eski nom ishlamaydi', 'Смотри: старое имя не работает', 'Watch: the old name doesn’t work'),
    askBack: L3("Qarang: to'g'ri nom", 'Смотри: верное имя', 'Watch: the right name'),
    askDone: L3("Qatorni belgilang → nusxa → body → yozuv", 'Выдели строку → копия → body → надпись', 'Select the line → copy → body → label')
  },
  t1: {
    eyebrow: L3('Tugmani oling', 'Возьми кнопку', 'Take a button'),
    say: L3("Endi o'zingiz. Yuqorida namuna bor: yashil, chegarali tugma. Saytdan Button sahifasini toping, shu tugmaning qatorini bosing, keyin uni body ichiga qo'ying.",
      'Теперь сам. Наверху образец: зелёная кнопка с рамкой. Найди на сайте страницу Button, нажми строку этой кнопки, потом вставь её в body.',
      'Now it’s your turn. The goal is at the top: a green outlined button. Find the Button page on the site, tap this button’s line, then paste it into body.'),
    ask: L3("Namunadagi tugmaning qatorini bosing", 'Нажми строку кнопки из образца', 'Tap the line of the goal button'),
    // Меню сайта в узком окне спрятано за ☰ — строка задания и первая подсказка называют её (23.11.2026); меню слева — askFindSide.
    askFind: L3("☰ tugmasini bosing va Components → Button sahifasini toping", 'Нажми ☰ и найди Components → Button', 'Tap ☰ and find Components → Button'),
    askFindSide: L3("Chapdagi menyudan Components → Button sahifasini toping", 'Найди в меню слева Components → Button', 'Find Components → Button in the menu on the left'),
    hintMenu: L3("Menyu yashiringan. Sayt oynasining yuqori o'ng burchagidagi uch chiziqli tugmani bosing.", 'Меню спрятано. Нажми кнопку с тремя полосками в правом верхнем углу окна сайта.', 'The menu is hidden. Tap the three-line button in the top right corner of the site window.'),
    copied: L3("Nusxalandi! Endi body ichidagi bo'sh joyni bosing.", 'Скопировано! Теперь нажми пустое место в body.', 'Copied! Now tap the empty spot in body.'),
    msgs: {
      wrongPage: L3("Bu {w} sahifasi. Tugmalar Button sahifasida turadi.", 'Это страница {w}. Кнопки — на странице Button.', 'This is the {w} page. Buttons are on the Button page.'),
      color: L3("Bu ham chegarali tugma, lekin rangi boshqa. Namunada yashil rang.", 'Это тоже кнопка с рамкой, но цвет другой. В образце — зелёный.', 'This is also an outlined button, but the color is different. The goal is green.'),
      shape: L3("Rang to'g'ri, lekin bu tugmaning ichi to'la. Namunada faqat chegarasi bor.", 'Цвет верный, но эта кнопка залита. В образце только рамка.', 'The color is right, but this button is filled. The goal only has a border.'),
      both: L3("Bu boshqa tugma. Namunada yashil, chegarali tugma.", 'Это другая кнопка. В образце — зелёная кнопка с рамкой.', 'That’s a different button. The goal is a green outlined button.'),
      noClip: L3("Oldin saytdagi kerakli qatorni bosing.", 'Сначала нажми нужную строку на сайте.', 'First tap the right line on the site.')
    },
    hints: [
      L3("Tugmalar qaysi bo'limda turadi? Menyuni oching.", 'В каком разделе лежат кнопки? Открой меню.', 'Which section holds the buttons? Open the menu.'),
      L3("Components, keyin Button. Variants bo'limida pastki qatorlar chegarali tugmalar.", 'Components, потом Button. В Variants нижние строки — кнопки с рамкой.', 'Components, then Button. In Variants the lower lines are the outlined buttons.'),
      L3("btn-outline va theme-success yozilgan qatorni bosing, keyin body ichidagi bo'sh joyni.", 'Нажми строку с btn-outline и theme-success, потом пустое место в body.', 'Tap the line with btn-outline and theme-success, then the empty spot in body.')
    ],
    ok: L3("Ajoyib! Saytdan kerakli tugmani o'zingiz topib oldingiz.", 'Отлично! Нужную кнопку на сайте ты нашёл сам.', 'Great! You found the right button on the site yourself.')
  },
  t2: {
    eyebrow: L3("Namunaga moslang", 'Подгони под образец', 'Match the goal'),
    say: L3("Nusxalangan tugmani o'zimizga moslaymiz. Har safar namuna boshqa bo'ladi. Bo'sh joyga kerakli so'zni yozing, so'zlar saytda turibdi.",
      'Подгоним скопированную кнопку под себя. Каждый раз образец другой. Впиши в пустое место нужное слово, слова есть на сайте.',
      'Let’s adapt the copied button. Each time the goal is different. Type the right word into the empty spot; the words are on the site.'),
    ask1: L3("Tugma qizil bo'lsin", 'Сделай кнопку красной', 'Make the button red'),
    ask2: L3("Endi tugmaning ichi to'la bo'lsin", 'Теперь кнопка — залитая', 'Now make the button filled'),
    ask3: L3("Endi tugma ko'k bo'lsin", 'Теперь кнопка — синяя', 'Now make the button blue'),
    hints1: [
      L3("Rang so'zini almashtiramiz. Saytdagi misoldan qizil tugmani toping.", 'Меняем слово цвета. Найди в примере на сайте красную кнопку.', 'We change the color word. Find the red button in the site’s example.'),
      L3("Qizil bu xavf rangi. Uning qatorida theme bilan boshlanadigan so'zga qarang.", 'Красный — цвет опасности. Посмотри в её строке на слово, которое начинается с theme.', 'Red is the danger color. Look at the word starting with theme on its line.'),
      L3("Yozing: theme-danger", 'Впиши: theme-danger', 'Type: theme-danger')
    ],
    hints2: [
      L3("Endi rang emas, uslub o'zgaradi.", 'Теперь меняется не цвет, а стиль.', 'This time the style changes, not the color.'),
      L3("Ichi to'la tugmalar saytda birinchi qatorda. Ularning birinchi so'ziga qarang.", 'Залитые кнопки — в первом ряду на сайте. Посмотри на их первое слово.', 'Filled buttons are in the first row on the site. Look at their first word.'),
      L3("Yozing: btn-solid", 'Впиши: btn-solid', 'Type: btn-solid')
    ],
    hints3: [
      L3("Rang so'zini almashtiramiz. Saytdagi misolda ko'k tugmani toping.", 'Меняем слово цвета. Найди в примере на сайте синюю кнопку.', 'We change the color word. Find the blue button in the site’s example.'),
      L3("Ko'k tugma qatorda birinchi turadi. Diqqat qiling: info havorang, accent binafsha.", 'Синяя кнопка стоит в ряду первой. Внимание: info — голубой, accent — фиолетовый.', 'The blue button is first in the row. Careful: info is light blue, accent is purple.'),
      L3("Yozing: theme-primary", 'Впиши: theme-primary', 'Type: theme-primary')
    ],
    why1: L3("theme-danger qizil, chegara joyida qoldi.", 'theme-danger — красный, рамка осталась.', 'theme-danger is red, and the border stayed.'),
    why2: L3("btn-solid bilan tugma rangga to'ldi.", 'С btn-solid кнопка залилась цветом.', 'With btn-solid the button filled with color.'),
    why3: L3("primary asosiy rang, ko'k.", 'primary — главный цвет, синий.', 'primary is the main color, blue.'),
    done: L3("Qoyil! Endi istalgan tugmani namunaga moslay olasiz: uslub alohida, rang alohida.", 'Класс! Теперь любую кнопку подгонишь под образец: стиль отдельно, цвет отдельно.', 'Nice! Now you can match any button to a goal: the style separately, the color separately.')
  },
  s8: {
    eyebrow: L3("Bitta so'z — hamma joyda", 'Одно слово — везде', 'One word everywhere'),
    help: [
      L3("Koddagi ikkita belgilangan so'zga qarang: biri e'londa, biri tugmada.", 'Посмотри на два выделенных слова в коде: одно у объявления, другое у кнопки.', 'Look at the two highlighted words in the code: one on the notice, one on the button.'),
      L3("Rang so'zi hamma bo'lak uchun bir xil: theme-warning e'lonni ham, tugmani ham sariq qiladi.", 'Слово цвета одно для всех деталей: theme-warning красит в жёлтый и объявление, и кнопку.', 'A color word is the same for every piece: theme-warning makes both the notice and the button yellow.'),
      L3("Bu maktab formasiga o'xshaydi: ko'ylak ham, shim ham bir xil rangda, nomi esa bitta.", 'Это как школьная форма: и рубашка, и брюки одного цвета, и название у цвета одно.', 'It’s like a school uniform: the shirt and trousers are the same color, and the color has one name.')
    ],
    say: L3("Saytda e'lon ham, tugma ham bor. Ikkalasida rang so'zi qanday yozilgan? Qarang.",
      'На сайте есть и объявление, и кнопка. Как у них записано слово цвета? Смотри.',
      'The site has both a notice and a button. How is the color word written on each? Watch.'),
    sayBoth: L3("E'londa theme-success, tugmada ham theme-success. So'z bitta!", 'У объявления theme-success, у кнопки тоже theme-success. Слово одно!', 'The notice has theme-success, and so does the button. It’s one word!'),
    sayAlert: L3("E'londa so'zni theme-warning ga almashtirdim. E'lon sariq bo'ldi.", 'У объявления поменял слово на theme-warning. Объявление стало жёлтым.', 'I changed the notice’s word to theme-warning. The notice turned yellow.'),
    sayButton: L3("Tugmada ham xuddi shu so'zni yozdim. Endi ikkalasi bir xil rangda, bir-biriga mos!", 'И у кнопки написал то же слово. Теперь оба одного цвета и подходят друг другу!', 'I wrote the same word on the button. Now both are the same color and match each other!'),
    done: L3("Demak, rang so'zlarini har bir bo'lak uchun alohida yodlash shart emas. theme-warning e'londa ham, tugmada ham sariq.",
      'Значит, слова цвета не надо учить для каждой детали отдельно. theme-warning — жёлтый и у объявления, и у кнопки.',
      'So you don’t have to learn color words separately for each piece. theme-warning is yellow on the notice and on the button.'),
    askStart: L3("Qarang: e'lon va tugma", 'Смотри: объявление и кнопка', 'Watch: the notice and the button'),
    askBoth: L3("Qarang: so'z bir xil", 'Смотри: слово одинаковое', 'Watch: the word is the same'),
    askAlert: L3("Qarang: e'lon sariq", 'Смотри: объявление жёлтое', 'Watch: the notice is yellow'),
    askButton: L3('Qarang: tugma ham sariq', 'Смотри: кнопка тоже жёлтая', 'Watch: the button is yellow too'),
    askDone: L3("Rang so'zi hamma joyda bitta", 'Слово цвета — одно везде', 'One color word everywhere')
  },
  t3: {
    eyebrow: L3("E'lonning rangida", 'В цвет объявления', 'Matching the notice'),
    say: L3("Tugma e'lon bilan bir xil rangda bo'lsin. E'lonning rang so'zi kodda yozilgan. Uni toping va tugmaga yozing.",
      'Пусть кнопка будет того же цвета, что и объявление. Слово цвета объявления есть в коде. Найди его и впиши кнопке.',
      'Let’s make the button the same color as the notice. The notice’s color word is in the code. Find it and give it to the button.'),
    ask: L3("Tugmaga e'lonning rang so'zini yozing", 'Впиши кнопке слово цвета объявления', 'Give the button the notice’s color word'),
    hints: [
      L3("E'lon kodining birinchi qatoriga qarang.", 'Посмотри на первую строку кода объявления.', 'Look at the first line of the notice’s code.'),
      L3("class ichida alert dan keyin rang so'zi turibdi.", 'В class после alert стоит слово цвета.', 'In class, the color word comes after alert.'),
      L3("Yozing: theme-accent", 'Впиши: theme-accent', 'Type: theme-accent')
    ],
    why: L3("theme-accent e'londa ham, tugmada ham binafsha.", 'theme-accent — фиолетовый и у объявления, и у кнопки.', 'theme-accent is purple on the notice and on the button.'),
    done: L3("Endi tugma va e'lon bir-biriga mos. Sayt chiroyli va tartibli ko'rinadi.", 'Теперь кнопка и объявление подходят друг другу. Сайт выглядит красиво и аккуратно.', 'Now the button and the notice match. The site looks neat and tidy.')
  },
  s10: {
    eyebrow: L3('Matn rangi', 'Цвет текста', 'Text color'),
    help: [
      L3("Menyudagi Utilities bo'limiga, Colors sahifasiga va belgilangan so'zga qarang.", 'Посмотри на раздел Utilities в меню, на страницу Colors и на выделенное слово.', 'Look at Utilities in the menu, the Colors page and the selected word.'),
      L3("fg bilan boshlanadigan so'z matnni bo'yaydi. Rang qismi tanish: success, danger, warning.", 'Слово, которое начинается с fg, красит текст. Часть с цветом знакомая: success, danger, warning.', 'A word starting with fg colors the text. The color part is familiar: success, danger, warning.'),
      L3("Bu flomasterga o'xshaydi: qog'oz oq qoladi, faqat yozuv rangli bo'ladi.", 'Это как фломастер: бумага остаётся белой, цветной становится только надпись.', 'It’s like a marker pen: the paper stays white, only the writing gets colored.')
    ],
    say: L3("Tugmalar tayyor. Endi sarlavhani yashil qilamiz. Buning uchun saytda boshqa bo'lim bor: Utilities. Qarang.",
      'Кнопки готовы. Теперь сделаем заголовок зелёным. Для этого на сайте есть другой раздел: Utilities. Смотри.',
      'The buttons are done. Now let’s make the heading green. There’s another section on the site for that: Utilities. Watch.'),
    sayPage: L3("Utilities bo'limida Colors sahifasini ochdim. Bu yerda matn ranglari. Har bir so'z fg bilan boshlanadi. fg, ya'ni foreground, oldingi rang degani, bu matn rangi.",
      'В разделе Utilities открыл страницу Colors. Здесь цвета текста. Каждое слово начинается с fg. fg — это foreground, передний цвет, то есть цвет текста.',
      'In Utilities I opened the Colors page. These are text colors. Every word starts with fg. fg means foreground, the front color, which is the text color.'),
    sayApply: L3("Ikki marta bosib, fg-success so'zini belgiladim va nusxaladim. Uni h1 tegining class qismiga qo'ydim. Sarlavha yashil bo'ldi!",
      'Двойным щелчком выделил слово fg-success и скопировал. Вставил его в class тега h1. Заголовок стал зелёным!',
      'I double-clicked to select fg-success and copied it. I put it in the h1 tag’s class. The heading turned green!'),
    sayOld: L3("Eski darslarda text-success degan nom uchraydi. Bu beshinchi versiya. Oltinchisida matn rangi fg bilan boshlanadi.",
      'В старых уроках встречается имя text-success. Это пятая версия. В шестой цвет текста начинается с fg.',
      'In old tutorials you’ll find the name text-success. That’s version five. In version six, text color starts with fg.'),
    done: L3("Eslab qoling: matn rangi Utilities bo'limida, Colors sahifasida. So'z fg va rang nomidan iborat.",
      'Запомни: цвет текста — в разделе Utilities, на странице Colors. Слово — это fg и имя цвета.',
      'Remember: text color is in Utilities, on the Colors page. The word is fg plus the color name.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Utilities → Colors', 'Смотри: Utilities → Colors', 'Watch: Utilities → Colors'),
    askPage: L3("Qarang: fg so'zlari", 'Смотри: слова fg', 'Watch: the fg words'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3('Qarang: sarlavha yashil', 'Смотри: заголовок зелёный', 'Watch: the heading is green'),
    askDone: L3('fg — matn rangi', 'fg — цвет текста', 'fg is the text color')
  },
  t4: {
    eyebrow: L3("Sarlavhani bo'yang", 'Покрась заголовок', 'Color the heading'),
    say: L3("Endi sarlavhani o'zingiz bo'yaysiz. Namunaga qarang va h1 tegiga kerakli so'zni yozing. So'zlar saytdagi Colors sahifasida.",
      'Теперь заголовок красишь ты. Посмотри на образец и впиши тегу h1 нужное слово. Слова — на странице Colors на сайте.',
      'Now you color the heading. Look at the goal and give the h1 tag the right word. The words are on the Colors page.'),
    ask1: L3('Sarlavha qizil bo\'lsin', 'Заголовок — красный', 'Make the heading red'),
    ask2: L3("Endi sarlavha binafsha bo'lsin", 'Теперь заголовок — фиолетовый', 'Now make the heading purple'),
    hints1: [
      L3("Matn rangi so'zi fg bilan boshlanadi.", 'Слово цвета текста начинается с fg.', 'A text color word starts with fg.'),
      L3("Qizil bu xavf rangi. Saytdagi ro'yxatdan uni toping.", 'Красный — цвет опасности. Найди его в списке на сайте.', 'Red is the danger color. Find it in the list on the site.'),
      L3("Yozing: fg-danger", 'Впиши: fg-danger', 'Type: fg-danger')
    ],
    hints2: [
      L3("Binafsha rangning so'zi esingizdami? U tugmalarda ham bor edi.", 'Вспомни слово фиолетового: оно было и у кнопок.', 'Remember the purple word: the buttons had it too.'),
      L3("Binafsha bu urg'u rangi. Saytdagi ro'yxatda ikkinchi turibdi.", 'Фиолетовый — цвет акцента. В списке на сайте он второй.', 'Purple is the emphasis color. It’s second in the site’s list.'),
      L3("Yozing: fg-accent", 'Впиши: fg-accent', 'Type: fg-accent')
    ],
    why1: L3("fg-danger matnni qizil qiladi.", 'fg-danger делает текст красным.', 'fg-danger makes the text red.'),
    why2: L3("fg-accent binafsha, xuddi tugmadagi accent kabi.", 'fg-accent — фиолетовый, как accent у кнопки.', 'fg-accent is purple, just like accent on the button.'),
    done: L3("Ajoyib! Sezdingizmi, rang nomlari tugmadagi bilan bir xil, faqat oldida fg turibdi.", 'Отлично! Заметил? Имена цветов те же, что у кнопки, только впереди fg.', 'Great! Notice that the color names are the same as for buttons, just with fg in front.')
  },
  s12: {
    eyebrow: L3('Fon rangi', 'Цвет фона', 'Background color'),
    help: [
      L3("Menyudagi Background sahifasiga, belgilangan so'zga va sahifadagi abzasga qarang.", 'Посмотри на страницу Background в меню, на выделенное слово и на абзац на странице.', 'Look at the Background page in the menu, the selected word and the paragraph on the page.'),
      L3("bg bilan boshlanadigan so'z fonni bo'yaydi, matn esa o'z rangida qoladi.", 'Слово, которое начинается с bg, красит фон, а текст остаётся своего цвета.', 'A word starting with bg colors the background, and the text keeps its color.'),
      L3("Bu marker bilan chizishga o'xshaydi: so'z ostidagi joy rangli bo'ladi.", 'Это как выделить маркером: цветным становится место под словами.', 'It’s like a highlighter: the space under the words gets colored.')
    ],
    say: L3("Matnni bo'yashni bildik. Endi vaqt yozilgan qatorni ajratib ko'rsatamiz: uning foni sariq bo'lsin. Fon ham Utilities bo'limida.",
      'Красить текст мы умеем. Теперь выделим строку со временем: пусть у неё будет жёлтый фон. Фон тоже в разделе Utilities.',
      'We know how to color text. Now let’s make the line with the time stand out: give it a yellow background. Background is in Utilities too.'),
    sayPage: L3("Background sahifasini ochdim. Bu yerda so'zlar bg bilan boshlanadi. bg, ya'ni background, fon degani.",
      'Открыл страницу Background. Здесь слова начинаются с bg. bg — это background, то есть фон.',
      'I opened the Background page. Here the words start with bg. bg means background.'),
    sayApply: L3("bg-warning so'zini belgilab, nusxaladim va p tegining class qismiga qo'ydim. Vaqt sariq fonda turibdi!",
      'Выделил слово bg-warning, скопировал и вставил в class тега p. Время теперь на жёлтом фоне!',
      'I selected bg-warning, copied it and put it in the p tag’s class. The time is on a yellow background now!'),
    sayOld: L3("Diqqat qiling: fg matnni bo'yaydi, bg esa fonni. Harf bitta, lekin natija boshqa.",
      'Внимание: fg красит текст, а bg — фон. Разница в одной букве, а результат другой.',
      'Heads up: fg colors the text, and bg the background. One letter apart, but a different result.'),
    done: L3("Eslab qoling: fon rangi Utilities bo'limida, Background sahifasida. So'z bg va rang nomidan iborat.",
      'Запомни: цвет фона — в разделе Utilities, на странице Background. Слово — это bg и имя цвета.',
      'Remember: background color is in Utilities, on the Background page. The word is bg plus the color name.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Utilities → Background', 'Смотри: Utilities → Background', 'Watch: Utilities → Background'),
    askPage: L3("Qarang: bg so'zlari", 'Смотри: слова bg', 'Watch: the bg words'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3('Qarang: sariq fon', 'Смотри: жёлтый фон', 'Watch: a yellow background'),
    askDone: L3('fg — matn, bg — fon', 'fg — текст, bg — фон', 'fg is text, bg is background')
  },
  t5: {
    eyebrow: L3('Fonni tanlang', 'Выбери фон', 'Pick a background'),
    say: L3("Endi fonni o'zingiz tanlaysiz. Namunaga qarang va p tegiga kerakli so'zni yozing. So'zlar saytdagi Background sahifasida.",
      'Теперь фон выбираешь ты. Посмотри на образец и впиши тегу p нужное слово. Слова — на странице Background на сайте.',
      'Now you pick the background. Look at the goal and give the p tag the right word. The words are on the Background page.'),
    ask1: L3("Fon yashil bo'lsin", 'Фон — зелёный', 'Make the background green'),
    ask2: L3("Endi fon havorang bo'lsin", 'Теперь фон — голубой', 'Now make the background light blue'),
    hints1: [
      L3("Fon so'zi bg bilan boshlanadi.", 'Слово фона начинается с bg.', 'A background word starts with bg.'),
      L3("Yashil bu muvaffaqiyat rangi.", 'Зелёный — цвет успеха.', 'Green is the success color.'),
      L3("Yozing: bg-success", 'Впиши: bg-success', 'Type: bg-success')
    ],
    hints2: [
      L3("Havorang qaysi so'z edi? Ma'lumot rangi.", 'Какое слово у голубого? Цвет информации.', 'Which word is light blue? The information color.'),
      L3("Saytdagi ro'yxatda havorang fon oltinchi turibdi.", 'В списке на сайте голубой фон — шестой.', 'In the site’s list, the light blue background is sixth.'),
      L3("Yozing: bg-info", 'Впиши: bg-info', 'Type: bg-info')
    ],
    why1: L3("bg-success fonni yashil qiladi.", 'bg-success делает фон зелёным.', 'bg-success makes the background green.'),
    why2: L3("bg-info havorang fon beradi.", 'bg-info даёт голубой фон.', 'bg-info gives a light blue background.'),
    done: L3("Zo'r! Endi matn rangini ham, fonni ham saytdan olib qo'yasiz.", 'Огонь! Теперь и цвет текста, и фон ты берёшь с сайта.', 'Awesome! Now you take both text color and background from the site.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna bor. Uni qaysi kod chizadi? Variantni bosing, o'ngda uning natijasi chiqadi.",
      'Маленькое испытание. Слева образец. Какой код его рисует? Нажми вариант, справа появится его результат.',
      'A little test. The goal is on the left. Which code draws it? Tap an option and its result appears on the right.'),
    ask: L3('Namunani qaysi kod chizadi?', 'Какой код рисует образец?', 'Which code draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Ichi to'la qizil tugma: btn-solid va theme-danger.", 'Залитая красная кнопка: btn-solid и theme-danger.', 'A filled red button: btn-solid and theme-danger.'),
      L3("Yashil matn: fg-success.", 'Зелёный текст: fg-success.', 'Green text: fg-success.'),
      L3("Sariq fon: bg-warning.", 'Жёлтый фон: bg-warning.', 'A yellow background: bg-warning.'),
      L3("Chegarali binafsha tugma: btn-outline va theme-accent.", 'Фиолетовая кнопка с рамкой: btn-outline и theme-accent.', 'An outlined purple button: btn-outline and theme-accent.')
    ],
    no: {
      'btn-danger': L3("Bu eski nom, beshinchi versiyadan. Oltinchisida tugma oddiy bo'lib qoladi.", 'Это старое имя из пятой версии. В шестой кнопка становится обычной.', 'That’s an old name from version five. In version six the button turns plain.'),
      'btn-outline theme-danger': L3("Rang to'g'ri, lekin bu chegarali tugma. Namunada ichi to'la.", 'Цвет верный, но это кнопка с рамкой. В образце она залита.', 'The color is right, but this is an outlined button. The goal is filled.'),
      'btn-solid theme-red': L3("Bootstrapda theme-red degan so'z yo'q, tugma kulrang qoldi.", 'В Bootstrap нет слова theme-red, кнопка осталась серой.', 'Bootstrap has no theme-red word, so the button stayed gray.'),
      'text-success': L3("Bu eski nom, beshinchi versiyadan. Oltinchisida matn rangi fg bilan boshlanadi.", 'Это старое имя из пятой версии. В шестой цвет текста начинается с fg.', 'That’s an old name from version five. In version six, text color starts with fg.'),
      'bg-success': L3("bg fonni bo'yaydi, matnni emas. Natijaga qarang.", 'bg красит фон, а не текст. Посмотри на результат.', 'bg colors the background, not the text. Look at the result.'),
      'theme-green': L3("theme-green degan so'z yo'q. Yashil rangning nomi success.", 'Слова theme-green нет. Зелёный называется success.', 'There’s no theme-green word. Green is called success.'),
      'fg-warning': L3("fg matnni bo'yaydi, fonni emas.", 'fg красит текст, а не фон.', 'fg colors the text, not the background.'),
      'bg-yellow': L3("bg-yellow degan so'z yo'q. Sariq rangning nomi warning.", 'Слова bg-yellow нет. Жёлтый называется warning.', 'There’s no bg-yellow word. Yellow is called warning.'),
      'theme-warning': L3("theme so'zi faqat rangni tanlaydi, o'zi fon bermaydi. Fon uchun bg kerak.", 'Слово theme только выбирает цвет, само фон не даёт. Для фона нужно bg.', 'theme only picks a color, it doesn’t give a background by itself. For a background you need bg.'),
      'btn-solid theme-accent': L3("Rang to'g'ri, lekin bu tugmaning ichi to'la. Namunada faqat chegara.", 'Цвет верный, но эта кнопка залита. В образце только рамка.', 'The color is right, but this button is filled. The goal has only a border.'),
      'btn-outline theme-purple': L3("theme-purple degan so'z yo'q. Binafsha rangning nomi accent.", 'Слова theme-purple нет. Фиолетовый называется accent.', 'There’s no theme-purple word. Purple is called accent.'),
      'btn-outline theme-primary': L3("primary ko'k rang, namunada esa binafsha.", 'primary — синий, а в образце фиолетовый.', 'primary is blue, but the goal is purple.')
    },
    hint1: L3("Namunaga qarang: bu tugmami, matnmi yoki fonmi?", 'Посмотри на образец: это кнопка, текст или фон?', 'Look at the goal: is it a button, text or a background?'),
    hint2: L3("Eski nomlar va o'ylab topilgan ranglar ishlamaydi. Saytdagi so'zlar esingizdami?", 'Старые имена и выдуманные цвета не работают. Вспомни слова с сайта.', 'Old names and made-up colors don’t work. Remember the words from the site.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Rasmga qarab, kerakli kodni o'zingiz topasiz.", 'Всё верно! По картинке ты сам находишь нужный код.', 'All correct! You find the right code from a picture yourself.')
  },
  t6: {
    eyebrow: L3("Nega bo'yalmadi?", 'Почему не покрасилось?', 'Why no color?'),
    say: L3("Oxirgi sinov. Uchta tugma bo'yalmay qoldi, har birida sabab boshqa. Kodga qarang va sababini tanlang.",
      'Последнее испытание. Три кнопки не покрасились, и у каждой своя причина. Посмотри на код и выбери причину.',
      'The last test. Three buttons didn’t get their color, and each has a different reason. Look at the code and pick the reason.'),
    ask: L3('Nega tugma bo\'yalmadi? Sababini tanlang', 'Почему кнопка не покрасилась? Выбери причину', 'Why didn’t the button get its color? Pick the reason'),
    opts: {
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5'),
      noColor: L3("Bunday rang so'zi yo'q", 'Такого слова цвета нет', 'There’s no such color word'),
      noShape: L3("Rang bor, uslub so'zi yo'q", 'Цвет есть, а слова стиля нет', 'There’s a color, but no style word')
    },
    rounds: [
      L3("btn-success eski nom, beshinchi versiyadan. Oltinchisida btn-solid va theme-success.", 'btn-success — старое имя из пятой версии. В шестой — btn-solid и theme-success.', 'btn-success is an old name from version five. In version six it’s btn-solid and theme-success.'),
      L3("theme-green degan so'z yo'q. Yashil rangning so'zi theme-success.", 'Слова theme-green нет. Зелёный — это theme-success.', 'There’s no theme-green word. Green is theme-success.'),
      L3("Rang bor, lekin uslub yo'q. Oldiga btn-solid yoki btn-outline kerak.", 'Цвет есть, а стиля нет. Впереди нужен btn-solid или btn-outline.', 'There’s a color but no style. It needs btn-solid or btn-outline in front.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi qatorlar bilan solishtiring.", 'Сравни код со строками на сайте.', 'Compare the code with the lines on the site.'),
    hint2: L3("Tugmaga ikkita so'z kerak: uslub va rang. Ikkalasi ham saytdagidek yozilganmi?", 'Кнопке нужны два слова: стиль и цвет. Оба записаны как на сайте?', 'A button needs two words: style and color. Are both written like on the site?'),
    ok: L3("Hammasi to'g'ri! Endi tugma bo'yalmasa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если кнопка не покрасилась, причину найдёшь сам.', 'All correct! Now if a button doesn’t get its color, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z tugmangiz", 'Своя кнопка', 'Your own button'),
    say: L3("Endi saytga o'z tugmangizni yasang. Uslubni, rangni va yozuvni o'zingiz tanlaysiz. So'zlar saytdagi Variants bo'limida. Hammasi tayyor bo'lsa, «Tayyor»ni bosing.",
      'Теперь сделай для сайта свою кнопку. Стиль, цвет и надпись выбираешь сам. Слова — в разделе Variants на сайте. Когда всё готово, нажми «Готово».',
      'Now make your own button for the site. You pick the style, the color and the label. The words are in the Variants section on the site. When everything’s ready, tap “Done”.'),
    ask: L3("Uslub, rang va yozuvni yozing", 'Впиши стиль, цвет и надпись', 'Type the style, color and label'),
    msgs: {
      text: L3("Tugmaga yozuv yozing, kamida bitta so'z.", 'Напиши на кнопке надпись, хотя бы одно слово.', 'Write a label on the button, at least one word.'),
      same: L3("Bu hali saytdagi inglizcha yozuv. O'z yozuvingizni yozing.", 'Это ещё английская надпись с сайта. Напиши свою.', 'That’s still the English label from the site. Write your own.'),
      // «Tayyor» с пустым полем — причина, а не молча (23.11.2026).
      emptyAll: L3("Kodda uchta bo'sh joy bor: uslub, rang va yozuv. Hammasini yozing.", 'В коде три пустых места: стиль, цвет и надпись. Заполни все.', 'The code has three empty spots: style, color and label. Fill them all.'),
      emptyText: L3("Tugmaga o'z yozuvingizni 2-qatorga yozing", 'Впиши свою надпись — строка 2', 'Type your own label — line 2'),
      emptyShape: L3("Uslub so'zini 1-qatorga yozing", 'Впиши слово стиля — строка 1', 'Type the style word — line 1'),
      emptyColor: L3("Rang so'zini 1-qatorga yozing", 'Впиши слово цвета — строка 1', 'Type the color word — line 1')
    },
    hints: [
      L3("Kodda uchta bo'sh joy bor: uslub, rang va yozuv.", 'В коде три пустых места: стиль, цвет и надпись.', 'The code has three empty spots: style, color and label.'),
      L3("Uslub btn bilan, rang theme bilan boshlanadi. Ikkalasini saytdagi qatorlardan oling.", 'Стиль начинается с btn, цвет — с theme. Возьми оба из строк на сайте.', 'The style starts with btn, the color with theme. Take both from the lines on the site.'),
      L3("Masalan: btn-outline, theme-info va yozuv: Savol berish. Keyin «Tayyor»ni bosing.", 'Например: btn-outline, theme-info и надпись: Задать вопрос. Потом нажми «Готово».', 'For example: btn-outline, theme-info and the label: Ask a question. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning birinchi Bootstrap tugmangiz.", 'Класс! Это твоя первая кнопка на Bootstrap.', 'Nice! This is your first Bootstrap button.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men har bir narsaning o'z rang so'zlari bor, yuzlab so'zni yodlash kerak deb o'ylagandim? Afsuski, adashibman. Rang so'zlari bitta oila: success, danger, warning va boshqalar. theme-success tugmada ham, e'londa ham yashil.",
        'Вернёмся к загадке. Помнишь, я думал, что у каждой вещи свои слова цвета и учить надо сотни слов? Увы, я ошибся. Слова цвета — одна семья: success, danger, warning и другие. theme-success — зелёный и у кнопки, и у объявления.',
        'Back to our riddle. Remember, I thought every thing had its own color words and you’d have to learn hundreds? Sadly, I was wrong. Color words are one family: success, danger, warning and the rest. theme-success is green on a button and on a notice.'), k: 'riddle' },
      { text: L3("Matn va fon uchun esa oldiga fg yoki bg qo'yamiz, rang nomi o'sha qoladi.", 'А для текста и фона ставим впереди fg или bg, имя цвета остаётся тем же.', 'And for text and background we put fg or bg in front; the color name stays the same.'), k: 'fg' },
      { text: L3("Qarang, mana sizning tugmangiz, saytda turibdi!", 'Смотри, вот твоя кнопка, она на сайте!', 'Look, here’s your button, right on the site!'), k: null },
      { text: L3("Bootstrap tugmasi ikki so'zdan iborat: uslub va rang.", 'Кнопка Bootstrap — это два слова: стиль и цвет.', 'A Bootstrap button is two words: style and color.'), k: 'btn' },
      { text: L3("Hamma so'zni saytdan olamiz: tugmalar Components bo'limida, matn va fon ranglari Utilities bo'limida.", 'Все слова берём с сайта: кнопки — в разделе Components, цвета текста и фона — в Utilities.', 'We take every word from the site: buttons are in Components, text and background colors in Utilities.'), k: 'site' },
      { text: L3("Tabriklayman! Siz ikkinchi darsni tugatdingiz. Keyingi darsda yuklanish belgisi va rasmlar bilan ishlaymiz. Ko'rishguncha!", 'Ура! Ты прошёл второй урок. На следующем уроке поработаем со значком загрузки и картинками. До встречи!', 'Hooray! You finished the second lesson. Next time we’ll work with a loading indicator and images. See you!'), k: null }
    ],
    roles: {
      btn: L3("Tugma: uslub va rang", 'Кнопка: стиль и цвет', 'Button: style and color'),
      theme: L3("Rang so'zi hamma joyda bitta", 'Слово цвета — одно везде', 'One color word everywhere'),
      fg: L3('fg — matn, bg — fon', 'fg — текст, bg — фон', 'fg — text, bg — background'),
      site: L3("So'zlar — saytdan", 'Слова — с сайта', 'Words come from the site')
    },
    ask: L3('Tugmangizga qarang', 'Посмотри на свою кнопку', 'Look at your button')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, hintMenu: 1, msgs: 1, magic: 1,
  sayShape: 1, sayColor: 1, sayMore: 1, solid: 1, outline: 1, mean: 1, both: 1, shape: 1, color: 1, right: 1, sayPage: 1, sayVariants: 1, sayLine: 1, sayOutline: 1,
  sayCopy: 1, sayPaste: 1, sayText: 1, sayOld: 1, copied: 1, sayBoth: 1, sayAlert: 1, sayButton: 1, sayApply: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs2-kit.jsx@*/

/*@FILE:bs2-site.jsx@*/

/*@FILE:bs2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:../bs1/bs1.css@*/
/*@FILE:bs2.css@*/
`;
