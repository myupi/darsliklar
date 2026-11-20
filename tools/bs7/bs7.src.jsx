// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 7 — «Формы»
// (облик «Редактор», как уроки 1–6 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs7/build.mjs → lessons/bootstrap/07-formy.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 7 · «Формы» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Кнопка «Yozilish» ведёт на форму записи в кружок. Без Bootstrap форма — каша: подписи и поля в
// строку, крошечная галочка, серая кнопка. Ученик ставит form-control (поле, список, большое поле — одно слово; в Bootstrap 6
// select тоже с form-control, form-select — имя версии 5), form-label (подпись над полем), check / radio / switch и
// form-field, берёт примеры с сайта (Forms → Form control, Switch) и меняет их подписи, а в конце сам заполняет форму на
// честной странице и отправляет — над формой e'lon «Rahmat!». Загадка (без имён): Коди думает, что каждому виду поля
// нужно своё слово; разгадка — одно form-control.
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-07-formy.md.
//
// СИСТЕМА СЛОВ: form-control, form-label, check, radio, switch, form-field, Forms — по-английски; forma — форма;
// maydon — поле; yozuv — подпись (label); ro'yxat — список (select); katta maydon — textarea; galochka — checkbox;
// doiracha — radio; o'tkazgich — switch.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-07-formy',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '7-dars. Formalar',
    ru: 'Урок 7. Формы',
    en: 'Lesson 7. Forms'
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
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Karusel', 'Карусель', 'Carousel'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  need: L3('Kerak', 'Нужно', 'Goal'),
  yours: L3('Sizning kodingiz', 'Твой код', 'Your code'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  phone: L3('Telefon · 360 px', 'Телефон · 360 px', 'Phone · 360 px'),
  tablet: L3('Planshet · 768 px', 'Планшет · 768 px', 'Tablet · 768 px'),
  laptop: L3('Noutbuk · 1024 px', 'Ноутбук · 1024 px', 'Laptop · 1024 px'),
  wide: L3("Ekranga sig'madi", 'Не помещается', 'Doesn’t fit'),
  fit: L3("Sig'di ✓", 'Помещается ✓', 'Fits ✓'),
  inside: L3('Bootstrap ichida', 'Внутри Bootstrap', 'Inside Bootstrap'),
  files: L3('Fayllar', 'Файлы', 'Files'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
const C = {
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    h1: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    name: L3('Ism', 'Имя', 'Name'),
    phone: L3('Telefon', 'Телефон', 'Phone'),
    date: L3("Tug'ilgan kun", 'День рождения', 'Birthday'),
    age: L3('Yosh', 'Возраст', 'Age'),
    note: L3('Izoh', 'Комментарий', 'Comment'),
    group: L3('Guruh', 'Группа', 'Group'),
    groups: [L3('Robototexnika', 'Робототехника', 'Robotics'), L3('Dasturlash', 'Программирование', 'Coding'), L3('3D modellash', '3D-моделирование', '3D modeling')],
    agree: L3('Qoidalarga roziman', 'Согласен с правилами', 'I agree to the rules'),
    photo: L3('Rasmga tushishga roziman', 'Можно фотографировать', 'Photos are OK'),
    morning: L3('Ertalab', 'Утром', 'Morning'),
    evening: L3('Kechqurun', 'Вечером', 'Evening'),
    news: L3('Yangiliklarni olish', 'Получать новости', 'Get the news'),
    send: L3('Yuborish', 'Отправить', 'Send'),
    thanks: L3("Rahmat! Siz to'garakka yozildingiz.", 'Спасибо! Ты записан в кружок.', 'Thank you! You’re signed up.'),
    email: L3('Ota-onangiz emaili', 'Email родителей', 'Parent’s email'),
    demoName: L3('Ali', 'Ali', 'Ali')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga bitta so'z yozing.", 'Впиши в пустое место одно слово.', 'Type one word into the empty spot.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские.', 'Latin letters are needed here. Bootstrap’s words are English.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      native: L3("Bootstrap o'z so'zlarini biladi. Inglizcha so'zni saytdan oling.", 'Bootstrap знает свои слова. Возьми английское слово с сайта.', 'Bootstrap knows its own words. Take the English word from the site.'),
      old: L3("Bu eski nom, beshinchi versiyadan. Oltinchisida bu yerga {w} yoziladi.", 'Это старое имя из пятой версии. В шестой сюда пишут {w}.', 'That’s an old name from version five. In version six this spot takes {w}.'),
      typo: L3("Harflarni tekshiring. To'g'risi: {w}.", 'Проверь буквы. Правильно: {w}.', 'Check the letters. It’s spelled {w}.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      checkbox: L3("checkbox — bu type qiymati. class uchun Bootstrapda qisqaroq so'z bor: {w}.", 'checkbox — это значение type. Для class у Bootstrap слово короче: {w}.', 'checkbox is the type value. For class Bootstrap has a shorter word: {w}.'),
      tagName: L3("{w} — teg nomi. class ga esa Bootstrap so'zi yoziladi.", '{w} — имя тега. А в class пишется слово Bootstrap.', '{w} is a tag name. class needs a Bootstrap word.'),
      fam: L3("{w} boshqa narsa uchun. Bu yerga boshqa so'z kerak.", '{w} — для другой вещи. Сюда нужно другое слово.', '{w} is for something else. This spot needs another word.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas. Sahifani namuna bilan solishtiring.", 'Bootstrap это слово знает, но результат не как в образце. Сравни страницу с образцом.', 'Bootstrap knows that word, but the result isn’t like the goal. Compare the page with the goal.'),
      unknown: L3("Bootstrap {w} so'zini bilmaydi, shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает слова {w}, поэтому ничего не изменилось.', 'Bootstrap doesn’t know the word {w}, so nothing changed.')
    }
  },
  s1: {
    eyebrow: L3('Yozilish formasi', 'Форма записи', 'The sign-up form'),
    say: L3("Salom! Saytdagi «Yozilish» tugmasi shu formaga olib keladi. Lekin qarang: hammasi bir qatorga tiqilib qolgan, galochka juda mitti, tugma kulrang. Bunday formani to'ldirgingiz kelmaydi. Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Кнопка «Записаться» на сайте ведёт на эту форму. Но посмотри: всё набилось в одну строку, галочка крошечная, кнопка серая. Такую форму заполнять не хочется. Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! The site’s “Join” button leads to this form. But look: everything is crammed into one line, the checkbox is tiny, the button is gray. Nobody wants to fill in a form like this. Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Har bir yozuv o'z maydoni ustida, maydonlar keng, galochka katta, tugma ko'k. Kodga qarang: yangi so'zlar paydo bo'ldi.",
      'Ого! Каждая подпись над своим полем, поля широкие, галочка крупная, кнопка синяя. Посмотри на код: появились новые слова.',
      'Whoa! Every label sits above its field, the fields are wide, the checkbox is big, the button is blue. Look at the code: new words appeared.'),
    done: L3("Bugun formalarni chiroyli qilamiz, oxirida esa formani o'zingiz to'ldirib yuborasiz. Lekin oldin topishmoq. Menimcha, maydonlar har xil: oddiy maydon, ro'yxat, katta maydon. Har biriga o'z so'zi kerak, demak uchta so'z yodlaymiz. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida topamiz.",
      'Сегодня делаем формы красивыми, а в конце ты сам заполнишь и отправишь форму. Но сначала загадка. По-моему, поля бывают разные: обычное поле, список, большое поле. Каждому нужно своё слово, значит, учим три слова. Как думаешь, я прав? Ответ найдём в конце урока.',
      'Today we make forms look good, and at the end you’ll fill in and send a form yourself. But first, a riddle. I think fields come in different kinds: a plain field, a list, a big field. Each needs its own word, so we learn three words. What do you think, am I right? We’ll find out at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('form-control · form-label · check', 'form-control · form-label · check', 'form-control · form-label · check')
  },
  s2: {
    eyebrow: L3('Maydon va yozuv', 'Поле и подпись', 'Field and label'),
    help: [
      L3("Ism maydoniga, keyin yozuvlarga qarang.", 'Посмотри на поле «Имя», потом на подписи.', 'Look at the Name field, then at the labels.'),
      L3("form-control maydonni butun kenglikka cho'zadi, ramka va yumaloq burchak beradi. form-label yozuvni maydon ustiga qo'yadi.", 'form-control растягивает поле на всю ширину, даёт рамку и круглые углы. form-label ставит подпись над полем.', 'form-control stretches the field to full width and gives it a border and round corners. form-label puts the label above the field.'),
      L3("Bu anketaga o'xshaydi: savol tepada, javob uchun keng chiziq pastda.", 'Это как анкета: вопрос сверху, широкая строка для ответа снизу.', 'It’s like a questionnaire: the question on top, a wide line for the answer below.')
    ],
    say: L3("Birinchi so'z form-control. Hozir kodda class yo'q: Ism maydoni kichkina va yozuv bilan bir qatorda. Qarang.", 'Первое слово — form-control. Сейчас в коде нет class: поле «Имя» маленькое и стоит в одной строке с подписью. Смотри.', 'The first word is form-control. Right now the code has no class: the Name field is small and shares a line with its label. Watch.'),
    sayCtl: L3("Ism maydoniga form-control yozdim. Maydon butun kenglikka cho'zildi, ramkasi va yumaloq burchaklari bor, ichida yozish uchun joy ko'p.", 'Полю «Имя» написал form-control. Поле растянулось на всю ширину, у него рамка и круглые углы, внутри много места для текста.', 'I gave the Name field form-control. It stretched to full width, got a border and round corners, and has plenty of room inside.'),
    sayTwo: L3("Telefon maydoniga ham xuddi shu so'z. Endi ikkala maydon bir xil.", 'Полю «Телефон» — то же слово. Теперь оба поля одинаковые.', 'The Phone field gets the same word. Now both fields match.'),
    sayLab: L3("Endi yozuvlarga form-label. U yozuvni maydon ustiga qo'yadi va pastidan ozgina joy qoldiradi.", 'А теперь подписям — form-label. Она ставит подпись над полем и оставляет снизу немного места.', 'Now the labels get form-label. It puts the label above the field and leaves a little space below.'),
    done: L3("Eslab qoling: maydonga form-control, yozuvga form-label.", 'Запомни: полю — form-control, подписи — form-label.', 'Remember: the field gets form-control, the label gets form-label.'),
    askStart: L3("Qarang: class yo'q", 'Смотри: class нет', 'Watch: no class'),
    askCtl: L3('Qarang: form-control', 'Смотри: form-control', 'Watch: form-control'),
    askTwo: L3('Qarang: ikkinchi maydon', 'Смотри: второе поле', 'Watch: the second field'),
    askLab: L3('Qarang: form-label', 'Смотри: form-label', 'Watch: form-label'),
    askDone: L3('form-control · form-label', 'form-control · form-label', 'form-control · form-label')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz sinab ko'ring. Pastda to'rtta so'z yoqilgan. Har birini o'chirib ko'ring va sahifada nima o'zgarganiga qarang.",
      'Теперь попробуй сам. Внизу включены четыре слова. Выключи каждое и посмотри, что изменилось на странице.',
      'Now try it yourself. Four words are switched on below. Switch each one off and watch what changes on the page.'),
    what: {
      'form-label': { off: L3("form-label o'chdi: yozuv maydon yoniga qochdi.", 'form-label выключен: подпись убежала вбок от поля.', 'form-label is off: the label ran off beside the field.'), on: L3("form-label qaytdi: yozuv yana maydon ustida.", 'form-label вернулся: подпись снова над полем.', 'form-label is back: the label is above the field again.') },
      'form-control': { off: L3("form-control o'chdi: maydon kichkina va oddiy bo'lib qoldi.", 'form-control выключен: поле стало маленьким и простым.', 'form-control is off: the field turned small and plain.'), on: L3("form-control qaytdi: maydon yana keng.", 'form-control вернулся: поле снова широкое.', 'form-control is back: the field is wide again.') },
      check: { off: L3("check o'chdi: galochka yana mitti, brauzerning o'zinikidek.", 'check выключен: галочка опять крошечная, как у браузера.', 'check is off: the checkbox is tiny again, the browser’s own.'), on: L3("check qaytdi: galochka yana katta.", 'check вернулся: галочка снова крупная.', 'check is back: the checkbox is big again.') },
      'btn-solid': { off: L3("btn-solid o'chdi: tugma kulrang va oddiy.", 'btn-solid выключен: кнопка серая и простая.', 'btn-solid is off: the button is gray and plain.'), on: L3("btn-solid qaytdi: tugma yana ko'k.", 'btn-solid вернулся: кнопка снова синяя.', 'btn-solid is back: the button is blue again.') }
    },
    ok: L3("Ajoyib! Har bir so'z o'z ishini qiladi.", 'Отлично! Каждое слово делает своё дело.', 'Great! Each word does its own job.'),
    done: L3("Endi bunday maydonni Bootstrap saytidan qanday olishni ko'ramiz.", 'Теперь посмотрим, как взять такое поле с сайта Bootstrap.', 'Now let’s see how to take a field like this from the Bootstrap site.'),
    hints: [
      L3("Pastdagi so'zlarni bosing.", 'Нажимай слова внизу.', 'Tap the words below.'),
      L3("Har bir so'zni bir marta o'chiring.", 'Выключи каждое слово хотя бы раз.', 'Switch each word off at least once.'),
      L3("Yonib turgan so'zni bosing.", 'Нажми слово, которое светится.', 'Tap the glowing word.')
    ],
    ask: L3("Har bir so'zni o'chirib ko'ring", 'Выключи по очереди каждое слово', 'Switch each word off'),
    askDone: L3("Har bir so'z — o'z ishi", 'У каждого слова своё дело', 'Each word, its own job')
  },
  g1: {
    eyebrow: L3('Form control sahifasi', 'Страница Form control', 'The Form control page'),
    help: [
      L3("Menyudagi Forms bo'limiga, misolga va nusxa olish belgisiga qarang.", 'Посмотри на раздел Forms в меню, на пример и на значок копирования.', 'Look at Forms in the menu, the example and the copy icon.'),
      L3("Maydonlar Forms bo'limida, Form control sahifasida. Misolni nusxalaymiz, keyin yozuvini va placeholder ni o'zimizga moslaymiz.", 'Поля — в разделе Forms, на странице Form control. Копируем пример, потом меняем под себя подпись и placeholder.', 'Fields are in Forms, on the Form control page. We copy the example, then change its label and placeholder to suit us.'),
      L3("Bu tayyor ko'ylakka o'xshaydi: olasiz, keyin o'zingizga tikib olasiz.", 'Это как готовая рубашка: берёшь и подгоняешь под себя.', 'It’s like a ready-made shirt: you take it and tailor it to fit you.')
    ],
    say: L3("Yangi maydonni saytdan olamiz. Formalar alohida bo'limda: Forms. Qarang.", 'Новое поле возьмём с сайта. Формы — в отдельном разделе: Forms. Смотри.', 'Let’s take a new field from the site. Forms have their own section: Forms. Watch.'),
    sayPage: L3("Forms bo'limida Form control sahifasi. Birinchi misol: yozuv va email maydoni. Nusxa olamiz.", 'В разделе Forms — страница Form control. Первый пример: подпись и поле email. Копируем.', 'In Forms there’s the Form control page. The first example: a label and an email field. Let’s copy it.'),
    sayPaste: L3("Kodni formamizga qo'ydim. Lekin yozuv inglizcha: Email address. Uni o'zimizga moslaymiz.", 'Вставил код в нашу форму. Но подпись английская: Email address. Подгоним её под себя.', 'I pasted the code into our form. But the label is in English: Email address. Let’s make it ours.'),
    sayLab: L3("Email address so'zlarini belgilab, o'rniga yozdim: Ota-onangiz emaili.", 'Выделил слова Email address и написал вместо них: Email родителей.', 'I selected Email address and typed instead: Parent’s email.'),
    sayPh: L3("Maydon ichidagi xira yozuv, ya'ni placeholder ham o'zimizniki bo'ldi. Mana, misol endi bizning formada.", 'Бледная надпись в поле, то есть placeholder, тоже стала нашей. Вот, пример теперь в нашей форме.', 'The faint text in the field, the placeholder, is ours now too. There, the example is part of our form.'),
    done: L3("Eslab qoling: misolni nusxalaymiz, keyin yozuvini o'zimizga moslaymiz.", 'Запомни: копируем пример, потом подгоняем подпись под себя.', 'Remember: copy the example, then make the label your own.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Forms → Form control', 'Смотри: Forms → Form control', 'Watch: Forms → Form control'),
    askPage: L3('Qarang: misol', 'Смотри: пример', 'Watch: the example'),
    askPaste: L3("Qarang: formaga qo'yildi", 'Смотри: вставлено в форму', 'Watch: pasted into the form'),
    askLab: L3("Qarang: o'z yozuvimiz", 'Смотри: своя подпись', 'Watch: our own label'),
    askPh: L3("Qarang: o'z placeholder", 'Смотри: свой placeholder', 'Watch: our own placeholder'),
    askDone: L3('Forms → Form control', 'Forms → Form control', 'Forms → Form control')
  },
  t1: {
    eyebrow: L3('Maydonni bezang', 'Укрась поле', 'Style the field'),
    say: L3("Endi o'zingiz. Namunaga qarang va bo'sh joyga kerakli so'zni yozing.", 'Теперь сам. Посмотри на образец и впиши в пустое место нужное слово.', 'Now you. Look at the goal and type the right word into the empty spot.'),
    ask1: L3("Telefon maydoni ham chiroyli bo'lsin", 'Поле «Телефон» — тоже красивое', 'Make the Phone field look good too'),
    ask2: L3("Telefon yozuvi maydon ustida tursin", 'Подпись «Телефон» — над полем', 'Put the Phone label above its field'),
    ask3: L3("Izoh maydoni ham chiroyli bo'lsin", 'Поле «Комментарий» — тоже красивое', 'Make the Comment field look good too'),
    hints1: [
      L3("Ism maydonida qaysi so'z bor?", 'Какое слово у поля «Имя»?', 'Which word does the Name field have?'),
      L3("form bilan boshlanadi, keyin control.", 'Начинается с form, потом control.', 'It starts with form, then control.'),
      L3("Yozing: form-control", 'Впиши: form-control', 'Type: form-control')
    ],
    hints2: [
      L3("Ism yozuvida qaysi so'z bor?", 'Какое слово у подписи «Имя»?', 'Which word does the Name label have?'),
      L3("Yozuv inglizcha label.", 'Подпись по-английски — label.', 'A label in English is label.'),
      L3("Yozing: form-label", 'Впиши: form-label', 'Type: form-label')
    ],
    hints3: [
      L3("Bu katta maydon, textarea. Oddiy maydondagi so'z unga ham mos keladimi?", 'Это большое поле, textarea. Подойдёт ли ему слово обычного поля?', 'This is a big field, a textarea. Will the plain field’s word fit it too?'),
      L3("Ism maydonidagi so'zni yozib ko'ring.", 'Попробуй слово из поля «Имя».', 'Try the word from the Name field.'),
      L3("Yozing: form-control", 'Впиши: form-control', 'Type: form-control')
    ],
    why1: L3("form-control maydonni keng va chiroyli qildi.", 'form-control сделал поле широким и красивым.', 'form-control made the field wide and neat.'),
    why2: L3("form-label yozuvni maydon ustiga qo'ydi.", 'form-label поставил подпись над полем.', 'form-label put the label above the field.'),
    why3: L3("Katta maydonga ham form-control mos keldi.", 'Большому полю тоже подошёл form-control.', 'form-control fit the big field too.'),
    done: L3("Qoyil! form-control oddiy maydonga ham, katta maydonga ham ishladi.", 'Класс! form-control сработал и у обычного, и у большого поля.', 'Nice! form-control worked on the plain field and the big one.')
  },
  g2: {
    eyebrow: L3("Ro'yxat", 'Список', 'The list'),
    help: [
      L3("Kodda select qatoriga, saytda Heads up yozuviga qarang.", 'Посмотри на строку select в коде и на надпись Heads up на сайте.', 'Look at the select line in the code and the Heads up note on the site.'),
      L3("Oltinchi versiyada ro'yxat ham form-control bilan bezaladi. form-select — beshinchi versiyaning nomi, endi ishlamaydi.", 'В шестой версии список тоже украшается form-control. form-select — имя пятой версии, оно больше не работает.', 'In version six the list is styled with form-control too. form-select is a version five name and no longer works.'),
      L3("Bu eski xaritaga o'xshaydi: ko'chaning nomi o'zgargan bo'lsa, yangi xaritaga qaraysiz.", 'Это как старая карта: если улицу переименовали, смотришь новую карту.', 'It’s like an old map: if a street was renamed, you check the new map.')
    ],
    say: L3("Endi ro'yxat, ya'ni select degani. Eski bir darsda shunday yozilgan edi: form-select. Lekin qarang, ro'yxat umuman o'zgarmadi! Nega? Saytdan qidiramiz.", 'Теперь список, то есть select. В одном старом уроке написано так: form-select. Но смотри, список совсем не изменился! Почему? Ищем на сайте.', 'Now the list, the select. An old tutorial wrote it like this: form-select. But look, the list didn’t change at all! Why? Let’s check the site.'),
    sayCallout: L3("Mana! Form control sahifasida Select bo'limi bor. Tepada ogohlantirish: Heads up, ya'ni diqqat qiling degani. Unda yozilgan: select endi form-control bilan bezaladi. form-select esa beshinchi versiyaning nomi.", 'Вот! На странице Form control есть раздел Select. Сверху предупреждение: Heads up, то есть «внимание». Там написано: select теперь украшается form-control. А form-select — имя пятой версии.', 'There! The Form control page has a Select section. On top there’s a note: Heads up, meaning pay attention. It says select is now styled with form-control. form-select is the version five name.'),
    sayApply: L3("form-select o'rniga form-control yozdim. Ro'yxat boshqa maydonlarga o'xshab qoldi!", 'Вместо form-select написал form-control. Список стал как остальные поля!', 'I wrote form-control instead of form-select. The list now matches the other fields!'),
    done: L3("Eslab qoling: ro'yxatga ham form-control.", 'Запомни: списку тоже form-control.', 'Remember: the list gets form-control too.'),
    askStart: L3('Qarang: form-select ishlamadi', 'Смотри: form-select не сработал', 'Watch: form-select didn’t work'),
    askMenu: L3('Qarang: Forms → Form control', 'Смотри: Forms → Form control', 'Watch: Forms → Form control'),
    askPage: L3('Qarang: Heads up!', 'Смотри: Heads up!', 'Watch: Heads up!'),
    askApply: L3('Qarang: form-control', 'Смотри: form-control', 'Watch: form-control'),
    askDone: L3('select — form-control', 'select — form-control', 'select: form-control')
  },
  t2: {
    eyebrow: L3("Ro'yxat va sana", 'Список и дата', 'List and date'),
    say: L3("Saytdagi Select bo'limiga qarang va bo'sh joyga kerakli so'zni yozing. Keyin sana maydoni.", 'Посмотри на раздел Select на сайте и впиши в пустое место нужное слово. Потом — поле даты.', 'Look at the Select section on the site and type the right word into the empty spot. Then the date field.'),
    ask1: L3("Guruh ro'yxati chiroyli bo'lsin", 'Список «Группа» — красивый', 'Make the Group list look good'),
    ask2: L3("Tug'ilgan kun maydoni ham chiroyli bo'lsin", 'Поле «День рождения» — тоже красивое', 'Make the Birthday field look good too'),
    hints1: [
      L3("Saytdagi Heads up yozuvini o'qing.", 'Прочитай надпись Heads up на сайте.', 'Read the Heads up note on the site.'),
      L3("Ro'yxat ham oddiy maydon so'zi bilan bezaladi.", 'Список украшается тем же словом, что и обычное поле.', 'The list takes the same word as a plain field.'),
      L3("Yozing: form-control", 'Впиши: form-control', 'Type: form-control')
    ],
    hints2: [
      L3("Sana maydoni ham input, faqat type boshqa.", 'Поле даты — тоже input, просто другой type.', 'A date field is an input too, just a different type.'),
      L3("Oddiy maydonga qaysi so'z yozilardi?", 'Какое слово пишут обычному полю?', 'Which word does a plain field get?'),
      L3("Yozing: form-control", 'Впиши: form-control', 'Type: form-control')
    ],
    why1: L3("Ro'yxat ham form-control bilan chiroyli.", 'Список тоже красивый с form-control.', 'The list looks good with form-control too.'),
    why2: L3("type date bo'lsa ham, bu input: form-control.", 'Хоть type и date, это input: form-control.', 'Even with type date, it’s an input: form-control.'),
    done: L3("Zo'r! Har qanday maydon form-control bilan bezaladi.", 'Огонь! Любое поле украшается form-control.', 'Awesome! Any field gets styled with form-control.')
  },
  s8: {
    eyebrow: L3('Galochka', 'Галочка', 'Checkbox'),
    help: [
      L3("Galochkaga, keyin doiracha va o'tkazgichga qarang.", 'Посмотри на галочку, потом на кружок и переключатель.', 'Look at the checkbox, then the radio and the switch.'),
      L3("Galochka — check, doiracha — radio, o'tkazgich — switch. Yozuv yonida chiroyli tursin desangiz, form-field bilan o'raymiz.", 'Галочка — check, кружок — radio, переключатель — switch. Чтобы подпись красиво стояла рядом, оборачиваем в form-field.', 'Checkbox is check, radio is radio, switch is switch. To keep the label neatly beside it, wrap them in form-field.'),
      L3("Bu chiroqqa o'xshaydi: tugmasi bosiladi, belgisi esa yonib turadi.", 'Это как выключатель света: нажимаешь, и видно, включено или нет.', 'It’s like a light switch: you press it and can see if it’s on.')
    ],
    say: L3("Endi galochka, ya'ni checkbox degani. Hozir u mitti, brauzerning o'zinikidek. Qarang.", 'Теперь галочка, то есть checkbox. Сейчас она крошечная, как у браузера. Смотри.', 'Now the checkbox. Right now it’s tiny, the browser’s own. Watch.'),
    sayCheck: L3("Galochkaga check yozdim. U kattalashdi, burchaklari yumaloq bo'ldi. Bosilganda ko'k bo'lib, belgi chiqadi.", 'Галочке написал check. Она стала крупнее, с круглыми углами. Когда её нажмёшь, она синеет и появляется отметка.', 'I gave the checkbox check. It grew bigger, with round corners. When you tap it, it turns blue and shows a tick.'),
    sayField: L3("Galochka va yozuvni form-field bilan o'radim. Endi ular bir qatorda, oralarida chiroyli joy bor.", 'Обернул галочку и подпись в form-field. Теперь они в одной строке, с красивым промежутком.', 'I wrapped the checkbox and label in form-field. Now they share a line with a neat gap.'),
    sayRadio: L3("Bir nechtadan bittasini tanlash uchun doiracha bor, ya'ni radio degani. Uning so'zi ham radio.", 'Чтобы выбрать одно из нескольких, есть кружок, то есть radio. Его слово тоже radio.', 'To pick one of several, there’s the radio button. Its word is radio too.'),
    saySwitch: L3("Bu esa yoqib-o'chiriladigan o'tkazgich, ya'ni switch degani. Uning so'zi ham switch, lekin u input tegini o'rab turgan div tegiga yoziladi.", 'А это переключатель, то есть switch. Его слово — switch, но пишется оно у div, который обёрнут вокруг input.', 'And this is a toggle switch. Its word is switch, but it goes on the div wrapped around the input.'),
    done: L3("Eslab qoling: galochka check, doiracha radio, o'tkazgich switch.", 'Запомни: галочка — check, кружок — radio, переключатель — switch.', 'Remember: checkbox is check, radio is radio, switch is switch.'),
    askStart: L3('Qarang: mitti galochka', 'Смотри: крошечная галочка', 'Watch: a tiny checkbox'),
    askCheck: L3('Qarang: check', 'Смотри: check', 'Watch: check'),
    askField: L3('Qarang: form-field', 'Смотри: form-field', 'Watch: form-field'),
    askRadio: L3('Qarang: radio', 'Смотри: radio', 'Watch: radio'),
    askSwitch: L3('Qarang: switch', 'Смотри: switch', 'Watch: switch'),
    askDone: L3('check · radio · switch', 'check · radio · switch', 'check · radio · switch')
  },
  g3: {
    eyebrow: L3('Switch sahifasi', 'Страница Switch', 'The Switch page'),
    help: [
      L3("Menyudagi Switch sahifasiga va With form field misoliga qarang.", 'Посмотри на страницу Switch в меню и на пример With form field.', 'Look at the Switch page in the menu and the With form field example.'),
      L3("With form field — o'tkazgich yozuvi bilan birga. Nusxalab, yozuvini o'zimizga moslaymiz.", 'With form field — переключатель вместе с подписью. Копируем и меняем подпись под себя.', 'With form field is the switch together with its label. We copy it and change the label.'),
      L3("Bu tayyor detalga o'xshaydi: konstruktorga qo'yasiz va o'z stikeringizni yopishtirasiz.", 'Это как готовая деталь: ставишь в конструктор и клеишь свою наклейку.', 'It’s like a ready-made part: you snap it into the set and add your own sticker.')
    ],
    say: L3("Formaga yana bir narsa qo'shamiz: yangiliklarni olish uchun o'tkazgich. Uni ham saytdan olamiz. Qarang.", 'Добавим в форму ещё кое-что: переключатель, чтобы получать новости. Его тоже возьмём с сайта. Смотри.', 'Let’s add one more thing: a switch for getting the news. We’ll take it from the site too. Watch.'),
    sayPage: L3("Forms bo'limida Switch sahifasi. With form field misoli: o'tkazgich va yonida yozuv. Nusxa olamiz.", 'В разделе Forms — страница Switch. Пример With form field: переключатель и подпись рядом. Копируем.', 'In Forms there’s the Switch page. The With form field example: a switch with a label beside it. Let’s copy it.'),
    sayPaste: L3("Kodni galochkadan keyin qo'ydim. O'tkazgich chiqdi, lekin yozuvi inglizcha: Default switch.", 'Вставил код после галочки. Переключатель появился, но подпись английская: Default switch.', 'I pasted the code after the checkbox. The switch appeared, but its label is English: Default switch.'),
    sayLab: L3("Default switch so'zlarini belgilab, o'rniga yozdim: Yangiliklarni olish.", 'Выделил Default switch и написал вместо этого: Получать новости.', 'I selected Default switch and typed instead: Get the news.'),
    done: L3("Eslab qoling: galochka, doiracha va o'tkazgich — Forms bo'limida, har biri o'z sahifasida.", 'Запомни: галочка, кружок и переключатель — в разделе Forms, у каждого своя страница.', 'Remember: checkbox, radio and switch are in Forms, each on its own page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Forms → Switch', 'Смотри: Forms → Switch', 'Watch: Forms → Switch'),
    askPage: L3('Qarang: With form field', 'Смотри: With form field', 'Watch: With form field'),
    askPaste: L3("Qarang: formaga qo'yildi", 'Смотри: вставлено в форму', 'Watch: pasted into the form'),
    askLab: L3("Qarang: o'z yozuvimiz", 'Смотри: своя подпись', 'Watch: our own label'),
    askDone: L3('Forms → Switch', 'Forms → Switch', 'Forms → Switch')
  },
  t3: {
    eyebrow: L3('Galochka va doiracha', 'Галочка и кружок', 'Checkbox and radio'),
    say: L3("Namunaga qarang va bo'sh joyga kerakli so'zni yozing. Har biriga o'z so'zi.", 'Посмотри на образец и впиши в пустое место нужное слово. У каждого своё слово.', 'Look at the goal and type the right word into the empty spot. Each has its own word.'),
    ask1: L3("Galochka chiroyli bo'lsin", 'Галочка — красивая', 'Make the checkbox look good'),
    ask2: L3("Doiracha chiroyli bo'lsin", 'Кружок — красивый', 'Make the radio look good'),
    ask3: L3("O'tkazgich paydo bo'lsin", 'Пусть появится переключатель', 'Make the switch appear'),
    hints1: [
      L3("Galochkaning so'zi qisqa, besh harf.", 'Слово галочки короткое, пять букв.', 'The checkbox word is short, five letters.'),
      L3("checkbox emas, undan qisqaroq.", 'Не checkbox, короче.', 'Not checkbox, shorter.'),
      L3("Yozing: check", 'Впиши: check', 'Type: check')
    ],
    hints2: [
      L3("Doiracha inglizcha radio button.", 'Кружок по-английски — radio button.', 'A round option in English is a radio button.'),
      L3("Bu so'z type qiymati bilan bir xil.", 'Это слово такое же, как значение type.', 'The word is the same as the type value.'),
      L3("Yozing: radio", 'Впиши: radio', 'Type: radio')
    ],
    hints3: [
      L3("Bu div o'tkazgichni chizadi.", 'Этот div рисует переключатель.', 'This div draws the switch.'),
      L3("O'tkazgich inglizcha switch.", 'Переключатель по-английски — switch.', 'A toggle in English is a switch.'),
      L3("Yozing: switch", 'Впиши: switch', 'Type: switch')
    ],
    why1: L3("check galochkani chiroyli qildi.", 'check сделал галочку красивой.', 'check made the checkbox neat.'),
    why2: L3("radio doirachani chiroyli qildi.", 'radio сделал кружок красивым.', 'radio made the radio button neat.'),
    why3: L3("switch div tegini o'tkazgichga aylantirdi.", 'switch превратил div в переключатель.', 'switch turned the div into a toggle.'),
    done: L3("Ajoyib! check, radio va switch — bir oila.", 'Отлично! check, radio и switch — одна семья.', 'Great! check, radio and switch are one family.')
  },
  s11: {
    eyebrow: L3('Forma ishlaydi', 'Форма работает', 'The form works'),
    help: [
      L3("Kursorga va sahifadagi maydonlarga qarang.", 'Смотри на курсор и на поля страницы.', 'Watch the cursor and the fields on the page.'),
      L3("Maydonga bosib yoziladi, ro'yxatdan tanlanadi, galochka bosib qo'yiladi, tugma esa formani yuboradi.", 'В поле нажимают и пишут, из списка выбирают, галочку ставят нажатием, а кнопка отправляет форму.', 'You tap a field and type, pick from the list, tick the checkbox, and the button sends the form.'),
      L3("Bu konvertga o'xshaydi: ichini to'ldirasiz, yopasiz va jo'natasiz.", 'Это как конверт: заполняешь, заклеиваешь и отправляешь.', 'It’s like an envelope: you fill it, seal it and send it.')
    ],
    say: L3("Forma tayyor. Keling, uni to'ldirib ko'ramiz. Qarang.", 'Форма готова. Давай её заполним. Смотри.', 'The form is ready. Let’s fill it in. Watch.'),
    sayName: L3("Ism maydoniga bosdim: atrofida ko'k ramka chiqdi, ya'ni maydon yozishga tayyor. Ismni yozdim.", 'Нажал на поле «Имя»: вокруг появилась синяя рамка, то есть поле готово к вводу. Написал имя.', 'I tapped the Name field: a blue ring appeared, meaning it’s ready for typing. I typed a name.'),
    sayGroup: L3("Guruh ro'yxatidan Dasturlashni tanladim.", 'В списке «Группа» выбрал «Программирование».', 'In the Group list I picked Coding.'),
    sayAgree: L3("Qoidalarga roziman galochkasini qo'ydim.", 'Поставил галочку «Согласен с правилами».', 'I ticked “I agree to the rules”.'),
    saySent: L3("Yuborish tugmasini bosdim. Tepada e'lon chiqdi: Rahmat! Bu birinchi darsdagi e'lon, esingizdami?", 'Нажал «Отправить». Сверху появилось объявление: Спасибо! Это объявление с первого урока, помнишь?', 'I tapped Send. A notice appeared on top: Thank you! That’s the alert from lesson one, remember?'),
    done: L3("Eslab qoling: forma to'ldiriladi va tugma bilan yuboriladi.", 'Запомни: форму заполняют и отправляют кнопкой.', 'Remember: a form is filled in and sent with a button.'),
    askStart: L3('Qarang: forma', 'Смотри: форма', 'Watch: the form'),
    askName: L3('Qarang: ism yozilmoqda', 'Смотри: пишем имя', 'Watch: typing a name'),
    askGroup: L3('Qarang: guruh tanlandi', 'Смотри: выбрана группа', 'Watch: a group is picked'),
    askAgree: L3('Qarang: galochka', 'Смотри: галочка', 'Watch: the checkbox'),
    askSent: L3('Qarang: yuborildi', 'Смотри: отправлено', 'Watch: sent'),
    askDone: L3("To'ldirildi va yuborildi", 'Заполнено и отправлено', 'Filled in and sent')
  },
  x2: {
    eyebrow: L3("O'zingiz to'ldiring", 'Заполни сам', 'Fill it in yourself'),
    say: L3("Endi siz to'ldiring. Sahifadagi formaga ismingizni yozing, guruhni tanlang, galochkani qo'ying va Yuborish tugmasini bosing.", 'Теперь заполни сам. Напиши в форме на странице своё имя, выбери группу, поставь галочку и нажми «Отправить».', 'Now you fill it in. Type your name in the form on the page, pick a group, tick the checkbox and tap Send.'),
    ask: L3("Formani to'ldiring va Yuborishni bosing", 'Заполни форму и нажми «Отправить»', 'Fill in the form and tap Send'),
    noName: L3("Ism maydoni bo'sh. Avval maydonga bosib, ismingizni yozing.", 'Поле «Имя» пустое. Сначала нажми на поле и напиши имя.', 'The Name field is empty. First tap the field and type your name.'),
    noAgree: L3("Galochka qo'yilmagan. Qoidalarga roziman yozuvini bosing.", 'Галочка не стоит. Нажми на «Согласен с правилами».', 'The checkbox isn’t ticked. Tap “I agree to the rules”.'),
    hints: [
      L3("Sahifadagi Ism maydoniga bosing va yozing.", 'Нажми на поле «Имя» на странице и напиши.', 'Tap the Name field on the page and type.'),
      L3("Keyin galochkani qo'ying.", 'Потом поставь галочку.', 'Then tick the checkbox.'),
      L3("Oxirida ko'k Yuborish tugmasini bosing.", 'В конце нажми синюю кнопку «Отправить».', 'Finally tap the blue Send button.')
    ],
    ok: L3("Barakalla! Forma yuborildi. Endi siz haqiqiy formadan foydalandingiz.", 'Молодец! Форма отправлена. Ты воспользовался настоящей формой.', 'Well done! The form was sent. You just used a real form.')
  },
  t4: {
    eyebrow: L3("Tartib bilan yig'ing", 'Собери по порядку', 'Build in order'),
    say: L3("Forma kodini tartib bilan yig'ing: oldin Ism, keyin Guruh, oxirida tugma. Har bir maydondan oldin uning yozuvi turadi.", 'Собери код формы по порядку: сначала «Имя», потом «Группа», в конце кнопка. Перед каждым полем стоит его подпись.', 'Build the form code in order: Name first, then Group, the button last. Each field’s label comes before it.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order'),
    msgs: {
      form: L3("Oldin forma ochiladi: form.", 'Сначала открывается форма: form.', 'First the form opens: form.'),
      lab1: L3("Har bir maydondan oldin uning yozuvi: avval Ism yozuvi.", 'Перед каждым полем — его подпись: сначала подпись «Имя».', 'Each field’s label comes first: the Name label.'),
      inp1: L3("Yozuvdan keyin uning maydoni.", 'После подписи — её поле.', 'After the label comes its field.'),
      lab2: L3("Endi keyingi yozuv: Guruh.", 'Теперь следующая подпись: «Группа».', 'Now the next label: Group.'),
      sel: L3("Guruh yozuvidan keyin uning ro'yxati.", 'После подписи «Группа» — её список.', 'After the Group label comes its list.'),
      btn: L3("Maydonlardan keyin tugma.", 'После полей — кнопка.', 'After the fields comes the button.'),
      formc: L3("Oxirida forma yopiladi.", 'В конце форма закрывается.', 'Last, the form closes.')
    },
    hints: [
      L3("Forma ochilishidan boshlang.", 'Начни с открытия формы.', 'Start by opening the form.'),
      L3("Tartib: form, yozuv, maydon, yozuv, ro'yxat, tugma, yopish.", 'Порядок: form, подпись, поле, подпись, список, кнопка, закрытие.', 'The order: form, label, field, label, list, button, close.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! Yozuv maydon ustida, tugma esa oxirida.", 'В точку! Подпись над полем, а кнопка в конце.', 'Spot on! The label sits above the field, the button comes last.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna. Qaysi class shunday chizadi? Variantni tanlang, natija o'ngda chiqadi.", 'Маленькое испытание. Слева образец. Какой class так рисует? Выбери вариант, результат появится справа.', 'A little test. The goal is on the left. Which class draws it? Pick an option, the result shows on the right.'),
    ask: L3('Qaysi class namunani chizadi?', 'Какой class рисует образец?', 'Which class draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Oddiy maydon: form-control.", 'Обычное поле: form-control.', 'A plain field: form-control.'),
      L3("Ro'yxat ham: form-control.", 'Список тоже: form-control.', 'The list too: form-control.'),
      L3("Galochka: check.", 'Галочка: check.', 'The checkbox: check.'),
      L3("Ko'k tugma: btn-solid va theme-primary.", 'Синяя кнопка: btn-solid и theme-primary.', 'The blue button: btn-solid and theme-primary.')
    ],
    no: {
      'form-input': L3("Bunday class yo'q: maydon oddiyligicha qoldi.", 'Такого class нет: поле осталось простым.', 'There’s no such class: the field stayed plain.'),
      input: L3("input — teg nomi, class emas: maydon o'zgarmadi.", 'input — имя тега, а не class: поле не изменилось.', 'input is a tag name, not a class: the field didn’t change.'),
      'form-text': L3("form-text maydon ostidagi kichik izoh uchun: maydon chiroyli bo'lmadi.", 'form-text — для мелкой подсказки под полем: поле не стало красивым.', 'form-text is for a small hint under a field: the field didn’t get styled.'),
      'form-select': L3("Bu eski nom, beshinchi versiyadan: ro'yxat o'zgarmadi.", 'Это старое имя из пятой версии: список не изменился.', 'That’s an old name from version five: the list didn’t change.'),
      select: L3("select — teg nomi: ro'yxat o'zgarmadi.", 'select — имя тега: список не изменился.', 'select is a tag name: the list didn’t change.'),
      'form-option': L3("Bunday class yo'q: ro'yxat o'zgarmadi.", 'Такого class нет: список не изменился.', 'There’s no such class: the list didn’t change.'),
      'form-check': L3("Bu eski nom, beshinchi versiyadan: galochka mitti qoldi.", 'Это старое имя из пятой версии: галочка осталась крошечной.', 'That’s an old name from version five: the checkbox stayed tiny.'),
      checkbox: L3("checkbox — type qiymati, class emas: galochka mitti qoldi.", 'checkbox — значение type, а не class: галочка осталась крошечной.', 'checkbox is the type value, not a class: the checkbox stayed tiny.'),
      'check-input': L3("Bunday class yo'q: galochka mitti qoldi.", 'Такого class нет: галочка осталась крошечной.', 'There’s no such class: the checkbox stayed tiny.'),
      'btn-primary': L3("Bu eski nom, beshinchi versiyadan: tugma kulrang qoldi.", 'Это старое имя из пятой версии: кнопка осталась серой.', 'That’s an old name from version five: the button stayed gray.'),
      button: L3("button — teg nomi: tugma kulrang qoldi.", 'button — имя тега: кнопка осталась серой.', 'button is a tag name: the button stayed gray.'),
      'btn-form': L3("Bunday class yo'q: tugma kulrang qoldi.", 'Такого class нет: кнопка осталась серой.', 'There’s no such class: the button stayed gray.')
    },
    hint1: L3("Namunaga qarang: bu nima — maydon, ro'yxat, galochka yoki tugma?", 'Посмотри на образец: что это — поле, список, галочка или кнопка?', 'Look at the goal: is it a field, a list, a checkbox or a button?'),
    hint2: L3("Teg nomi class emas. Eski nomlar oltinchi versiyada ishlamaydi.", 'Имя тега — не class. Старые имена в шестой версии не работают.', 'A tag name isn’t a class. Old names don’t work in version six.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Formaning so'zlarini bilasiz.", 'Всё верно! Ты знаешь слова формы.', 'All correct! You know the form words.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta formada xato bor, har birida sabab boshqa. Kodga qarang va sababini tanlang.", 'Последнее испытание. В трёх формах ошибка, у каждой своя причина. Посмотри на код и выбери причину.', 'The last test. Three forms have a mistake, each for a different reason. Look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    opts: {
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5'),
      tag: L3('class boshqa tegda', 'class не у того тега', 'class on the wrong tag'),
      typo: L3("So'zda harf xatosi", 'Опечатка в слове', 'A typo in the word')
    },
    rounds: [
      L3("form-select eski nom, beshinchi versiyadan. Oltinchisida ro'yxatga ham form-control.", 'form-select — старое имя из пятой версии. В шестой списку тоже пишут form-control.', 'form-select is an old name from version five. In version six the list gets form-control too.'),
      L3("form-control yozuvga, ya'ni label tegiga yozilgan. Yozuv maydonga o'xshab qoldi, maydon esa oddiy.", 'form-control написан у подписи, то есть у label. Подпись стала похожа на поле, а само поле простое.', 'form-control is on the label. The label now looks like a field, and the field itself is plain.'),
      L3("form-contol so'zida r harfi tushib qolgan. Bootstrap bunday so'zni bilmaydi.", 'В слове form-contol пропала буква r. Bootstrap такого слова не знает.', 'The word form-contol is missing an r. Bootstrap doesn’t know that word.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the site example.'),
    hint2: L3("So'z yangi versiyadanmi? To'g'ri tegdami? Harflari to'g'rimi?", 'Слово из новой версии? У того тега? Буквы верные?', 'Is the word from the new version? On the right tag? Spelled right?'),
    ok: L3("Hammasi to'g'ri! Endi forma buzilsa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если форма сломается, причину найдёшь сам.', 'All correct! Now if a form breaks, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z savolingiz", 'Свой вопрос', 'Your own question'),
    say: L3("Endi formaga o'z savolingizni qo'shing. Yozuvni o'zingiz o'ylab toping, maydon turini tanlang va maydonga kerakli class ni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь добавь в форму свой вопрос. Придумай подпись, выбери вид поля и впиши полю нужный class. Потом нажми «Готово».',
      'Now add your own question to the form. Come up with a label, pick the field type and give the field the right class. Then tap “Done”.'),
    ask: L3('Yozuv va class ni yozing', 'Впиши подпись и class', 'Type the label and the class'),
    askLab: L3('Yozuv matni', 'Текст подписи', 'Label text'),
    askCls: L3('Maydon class i', 'class поля', 'The field’s class'),
    labPh: L3('Sevimli robotingiz', 'Любимый робот', 'Favorite robot'),
    noLabel: L3("Yozuv bo'sh. Savolingizni yozing, masalan: Sevimli robotingiz.", 'Подпись пустая. Напиши свой вопрос, например: Любимый робот.', 'The label is empty. Type your question, for example: Favorite robot.'),
    kinds: { text: L3('Matn', 'Текст', 'Text'), date: L3('Sana', 'Дата', 'Date'), number: L3('Raqam', 'Число', 'Number'), textarea: L3('Katta maydon', 'Большое поле', 'Big field') },
    hints: [
      L3("Yozuvga savolingizni yozing.", 'Напиши в подписи свой вопрос.', 'Type your question into the label.'),
      L3("Maydonga Bootstrap so'zi kerak: form bilan boshlanadi.", 'Полю нужно слово Bootstrap: начинается с form.', 'The field needs a Bootstrap word: it starts with form.'),
      L3("Yozing: form-control. Keyin «Tayyor»ni bosing.", 'Впиши: form-control. Потом нажми «Готово».', 'Type: form-control. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Formada endi sizning savolingiz bor.", 'Класс! Теперь в форме есть твой вопрос.', 'Nice! Now the form has your question.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men har bir maydon turiga o'z so'zi kerak deb o'ylagandim? Afsuski, adashibman. Qarang: oddiy maydon, ro'yxat va katta maydon — uchalasida bitta so'z, form-control. Yodlash uchun bitta so'z!",
        'Вернёмся к загадке. Помнишь, я думал, что каждому виду поля нужно своё слово? Увы, я ошибся. Смотри: у обычного поля, списка и большого поля одно слово — form-control. Учить одно слово!',
        'Back to our riddle. Remember, I thought each kind of field needed its own word? Sadly, I was wrong. Look: the plain field, the list and the big field all use one word, form-control. Just one word to learn!'), k: 'riddle' },
      { text: L3("Qarang, mana sizning formangiz!", 'Смотри, вот твоя форма!', 'Look, here’s your form!'), k: null },
      { text: L3("form-control maydonni, ro'yxatni va katta maydonni chiroyli qiladi.", 'form-control делает красивыми поле, список и большое поле.', 'form-control styles the field, the list and the big field.'), k: 'ctl' },
      { text: L3("form-label yozuvni maydon ustiga qo'yadi.", 'form-label ставит подпись над полем.', 'form-label puts the label above the field.'), k: 'lab' },
      { text: L3("check, radio va switch — galochka, doiracha va o'tkazgich. Yozuv yonida tursin desangiz, form-field.", 'check, radio и switch — галочка, кружок и переключатель. Чтобы подпись была рядом — form-field.', 'check, radio and switch are the checkbox, radio and toggle. To keep the label beside them, use form-field.'), k: 'chk' },
      { text: L3("Hammasi saytda, Forms bo'limida. Misolni nusxalaysiz va yozuvini o'zingizga moslaysiz.", 'Всё это — на сайте, в разделе Forms. Копируешь пример и подгоняешь подпись под себя.', 'It’s all on the site, in Forms. You copy the example and make the label your own.'), k: 'site' },
      { text: L3("Tabriklayman! Siz yettinchi darsni tugatdingiz. Keyingi darsda karusel yasaymiz, ya'ni o'zi aylanadigan rasmlar degani. Ko'rishguncha!", 'Ура! Ты прошёл седьмой урок. На следующем уроке сделаем карусель — картинки, которые листаются сами. До встречи!', 'Hooray! You finished the seventh lesson. Next time we’ll make a carousel, pictures that slide by themselves. See you!'), k: null }
    ],
    roles: {
      ctl: L3('form-control — maydonlar', 'form-control — поля', 'form-control — fields'),
      lab: L3('form-label — yozuv', 'form-label — подпись', 'form-label — label'),
      chk: L3('check · radio · switch', 'check · radio · switch', 'check · radio · switch'),
      site: L3("So'zlar — Forms da", 'Слова — в Forms', 'Words are in Forms')
    },
    ask: L3('Formangizga qarang', 'Посмотри на свою форму', 'Look at your form')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1, what: 1, ok: 1,
  sayCtl: 1, sayTwo: 1, sayLab: 1, sayPage: 1, sayPaste: 1, sayPh: 1, sayCallout: 1, sayApply: 1, sayCheck: 1, sayField: 1, sayRadio: 1, saySwitch: 1,
  sayName: 1, sayGroup: 1, sayAgree: 1, saySent: 1, noName: 1, noAgree: 1, noLabel: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs7-kit.jsx@*/

/*@FILE:bs7-site.jsx@*/

/*@FILE:bs7-head.jsx@*/

/*@FILE:bs7-common.jsx@*/

/*@FILE:bs7-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:../bs1/bs1.css@*/
/*@FILE:../bs2/bs2.css@*/
/*@FILE:../bs3/bs3.css@*/
/*@FILE:../bs4/bs4.css@*/
/*@FILE:../bs5/bs5.css@*/
/*@FILE:../bs6/bs6.css@*/
/*@FILE:bs7.css@*/
`;
