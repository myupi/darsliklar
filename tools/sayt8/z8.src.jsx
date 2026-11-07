// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 8 — «Структура настоящего сайта»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/sayt8/build.mjs → lessons/html/08-struktura-sajta.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 8 · «Структура настоящего сайта» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Урок с нуля; основа кода — уроки 2–7. Облик — эталона «Редактор» (naborRedaktor);
// бумаги нет нигде. У Коди сайт, но в коде всё лежит одной кучей: заголовок, меню, разделы, подвал подряд.
// Ученик раскладывает страницу по частям: header (верх), nav (меню), main (главное), section (разделы),
// footer (низ). Эти теги честно НЕ меняют вид страницы — части видны в «Инспекторе» (цветные рамки с именем
// тега, как в инструментах разработчика) и в списке частей у программы чтения с экрана.
// Загадка (без имён): Коди обернул верх сайта в header и уверен, что шапка сама станет цветной; в выводе
// признаёт ошибку — header говорит, ЧТО это за часть, а вид задаёт CSS (следующий курс).
//
// ДУГА (17 экранов; экрана плана нет). Типы заданий — по разделу 3а навыка:
//   s1 крючок (код кучей → по частям; страница та же; загадка)
//   header/main/footer: s2 показ · s3 вписать footer (Fill in the Blanks) · s4 рамка в инспекторе ↔ строка кода (Visual Code Mapping)
//   nav и head≠header:  s5 показ · s6 собрать каркас body, лишний head (Code Builder) · s7 тег ↔ часть схемы сайта (Matching Pairs)
//   section:            s8 показ · s9 вписать section (Fill in the Blanks) · s10 до и после (Before / After)
//   свой сайт:          s11 показ «зачем: программа чтения, поисковик» · s12 свой footer, s13 свой раздел (Live Code Preview) · s14 head → header (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честно: страница с этими тегами выглядит так же; инспектор — подсветка поверх (значок «Inspektor»), а не вид
//     сайта; Коди говорит об этом на s2. Опечатка в имени тега — рамки нет (такой части браузер не знает).
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ: sayt boshi — верх (header); menyu (nav); asosiy qism (main); bo'lim (section); sayt oxiri (footer);
// Inspektor (draft); ekrandan o'qib beruvchi dastur — программа чтения с экрана (draft); qidiruv tizimi (draft).
// В речи header, nav, main, section, footer, head — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-08-struktura-sajta',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '8-dars. Haqiqiy sayt tuzilishi',
    ru: 'Урок 8. Структура настоящего сайта',
    en: 'Lesson 8. The structure of a real site'
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
  insp: L3('Inspektor', 'Инспектор', 'Inspector'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Yakuniy HTML loyiha', 'Финальный HTML-проект', 'The final HTML project'),
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
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card, site, lands.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт Коди — содержимое страниц в браузере (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    myTitle: L3('Mening saytim', 'Мой сайт', 'My site'),
    menu: L3(['Bosh sahifa', "O'yinlar", 'Retseptlar'], ['Главная', 'Игры', 'Рецепты'], ['Home', 'Games', 'Recipes']),
    sec1h: L3("O'yinlar", 'Игры', 'Games'),
    sec1p: L3('Futbol, shaxmat va Minecraft.', 'Футбол, шахматы и Minecraft.', 'Football, chess and Minecraft.'),
    sec2h: L3('Retseptlar', 'Рецепты', 'Recipes'),
    sec2p: L3('Osh va somsa.', 'Плов и самса.', 'Plov and samsa.'),
    foot: L3('© 2026 Kodining sayti', '© 2026 Сайт Коди', '© 2026 Kodi’s site'),
    myFoot: L3('© 2026 Mening saytim', '© 2026 Мой сайт', '© 2026 My site')
  },
  s1: {
    eyebrow: L3('Kod uyumi', 'Код кучей', 'A pile of code'),
    say: L3("Salom! Saytim kattalashib ketdi: sarlavha, menyu, o'yinlar, retseptlar va eng pastda kichik yozuv bor. Lekin kodga qarang: hammasi bitta uyum bo'lib turibdi. Qayerda saytning boshi, qayerda asosiy qismi, qayerda oxiri, tushunib bo'lmaydi. Keling, kodni tartibga solamiz. «Aylantirish» tugmasini bosing.",
      'Привет! Мой сайт разросся: заголовок, меню, игры, рецепты, а в самом низу маленькая подпись. Но посмотри на код: всё лежит одной кучей. Где у сайта верх, где главная часть, где низ — не понять. Давай наведём в коде порядок. Нажми «Превратить».',
      'Hi! My site has grown: a heading, a menu, games, recipes, and a small line at the very bottom. But look at the code: it’s all one big pile. You can’t tell where the top of the site is, where the main part is, or where the bottom is. Let’s tidy up the code. Tap “Transform”.'),
    magic: L3("Voy, qarang! Kod bo'laklarga bo'lindi: boshi, menyu, asosiy qism, bo'limlar va oxiri. Endi kodni o'qish ancha oson.", 'Ого, смотри! Код разложен по частям: верх, меню, главная часть, разделы и низ. Теперь код читать гораздо проще.', 'Whoa, look! The code is split into parts: the top, the menu, the main part, sections and the bottom. Now the code is much easier to read.'),
    magicP: L3("Brauzerga qarang: sahifa umuman o'zgarmadi. Rangli ramkalarni esa men Inspektor bilan yoqib qo'ydim, ular saytning bir qismi emas.", 'Посмотри на браузер: страница совсем не изменилась. А цветные рамки я включил Инспектором, на самом сайте их нет.', 'Look at the browser: the page didn’t change at all. I turned on the colored frames with the Inspector; they aren’t part of the site.'),
    done: L3("Bugun saytni shunday qismlarga bo'lishni o'rganasiz va o'z saytingizning qismlarini yasaysiz. Lekin oldin kichik topishmoq. Men boshqa saytimning tepasini header tegiga o'rab qo'ydim. Menimcha, endi sayt tepasi o'zi rangli, chiroyli bo'lib qoladi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делить сайт на такие части и сделаешь части своего сайта. Но сначала маленькая загадка. На другом своём сайте я обернул верх в тег header. По-моему, теперь верх сайта сам станет цветным и красивым. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to split a site into parts like these, and you’ll make the parts of your own site. But first, a little riddle. On my other site I wrapped the top in the header tag. I think the top of the site will now become colorful and pretty by itself. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Kod qismlarga bo'lindi, sahifa o'sha-o'sha", 'Код разложен по частям, страница та же', 'The code is in parts, the page is the same')
  },
  s2: {
    eyebrow: L3('header, main, footer', 'header, main, footer', 'header, main, footer'),
    say: L3("Har bir saytning uchta katta qismi bor: boshi, asosiy qismi va oxiri. Keling, ularni bittalab o'raymiz. Ramkalarni Inspektor ko'rsatadi, sahifaning o'zi esa o'zgarmaydi.",
      'У каждого сайта три большие части: верх, главная часть и низ. Обернём их по очереди. Рамки показывает Инспектор, а сама страница не меняется.',
      'Every site has three big parts: the top, the main part and the bottom. Let’s wrap them one by one. The Inspector shows the frames; the page itself doesn’t change.'),
    sayHeader: L3("Sarlavha va menyuni header tegiga o'radik. header inglizcha so'z, ya'ni sayt boshi degani. Odatda unda sayt nomi va menyu turadi.",
      'Заголовок и меню обернули в тег header, то есть «верх сайта». Обычно там название сайта и меню.',
      'We wrapped the heading and the menu in the header tag. header means the top of the site. It usually holds the site’s name and the menu.'),
    sayMain: L3("Endi o'yinlar va retseptlarni main tegiga o'raymiz. main ya'ni asosiy degani. Sahifaning eng muhim qismi shu yerda turadi va sahifada main faqat bitta bo'ladi.",
      'Теперь игры и рецепты обернём в тег main, то есть «главный». Здесь самое важное на странице, и main на странице бывает только один.',
      'Now we wrap the games and the recipes in the main tag. main means the main part. The most important things on the page go here, and a page has only one main.'),
    sayFooter: L3("Oxirida pastdagi yozuvni footer tegiga o'raymiz. footer ya'ni sayt oxiri degani. Unda odatda mualliflik huquqi, aloqa va qo'shimcha havolalar bo'ladi.",
      'И в конце нижнюю подпись обернём в тег footer, то есть «низ сайта». Там обычно авторские права, контакты и дополнительные ссылки.',
      'Finally we wrap the bottom line in the footer tag. footer means the bottom of the site. It usually has the copyright, contacts and extra links.'),
    done: L3("Eslab qoling: header sayt boshi, main asosiy qism, footer esa sayt oxiri bo'ladi. Ular sahifa ko'rinishini o'zgartirmaydi, faqat qaysi qism ekanini aytadi.", 'Запомни: header — верх сайта, main — главная часть, footer — низ. Они не меняют вид страницы, а только говорят, что это за часть.', 'Remember: header is the top, main is the main part, and footer is the bottom. They don’t change how the page looks; they only say what each part is.'),
    asks: [
      L3("Qarang: kod bir uyum", 'Смотри: код кучей', 'Watch: the code is a pile'),
      L3('Qarang: header — sayt boshi', 'Смотри: header — верх сайта', 'Watch: header — the top'),
      L3('Qarang: main — asosiy qism', 'Смотри: main — главная часть', 'Watch: main — the main part'),
      L3('Qarang: footer — sayt oxiri', 'Смотри: footer — низ сайта', 'Watch: footer — the bottom')
    ],
    askDone: L3("header, main, footer — boshi, asosiysi, oxiri", 'header, main, footer — верх, главное, низ', 'header, main, footer — top, main, bottom')
  },
  s3: {
    eyebrow: L3('Teg nomini yozing', 'Впиши имя тега', 'Type the tag name'),
    say: L3("Endi navbat sizga. Pastki qatorda ochuvchi teg nomi yo'q. Shuning uchun Inspektor sayt oxirini ko'rmayapti. Sayt oxirini bildiradigan teg nomini yozing va «Tekshirish»ni bosing.",
      'Теперь твоя очередь. В нижней строке у открывающего тега нет имени. Поэтому Инспектор не видит низ сайта. Впиши имя тега, который означает низ сайта, и нажми «Проверить».',
      'Now it’s your turn. In the bottom line the opening tag has no name, so the Inspector can’t see the bottom of the site. Type the name of the tag for the bottom of the site and tap “Check”.'),
    msgs: {
      empty: L3("Burchakli qavslar o'rtasiga teg nomini yozing.", 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslar joyida turibdi. Bu yerga faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      top: L3("Bu sayt boshi uchun bo'ladi. Bizga sayt oxiri kerak.", 'Это для верха сайта. А нам нужен низ.', 'That’s for the top of the site. We need the bottom.'),
      other: L3("Bu teg boshqa ish qiladi. Sayt oxirini bildiradigan teg kerak.", 'Этот тег делает другое. Нужен тег для низа сайта.', 'That tag does something else. We need the tag for the bottom of the site.'),
      typo: L3("Bunday teg yo'q, shuning uchun Inspektor sayt oxirini ko'rmadi. Nomni harfma-harf yozing.", 'Такого тега нет, поэтому Инспектор не увидел низ сайта. Напиши имя буква в букву.', 'There’s no such tag, so the Inspector didn’t see the bottom of the site. Type the name letter by letter.')
    },
    hints: [
      L3("Yopuvchi tegga qarang: nomi o'sha yerda yozilgan.", 'Посмотри на закрывающий тег: имя написано там.', 'Look at the closing tag: the name is written there.'),
      L3("U inglizcha, ya'ni oyoq tomoni, pastki qism degani. f harfi bilan boshlanadi.", 'Оно английское — «нижняя часть». Начинается с буквы f.', 'It’s English for the bottom part. It starts with the letter f.'),
      L3("Teg nomi footer bo'ladi. Uni burchakli qavslar o'rtasiga yozing.", 'Имя тега — footer. Впиши его между уголками.', 'The tag name is footer. Type it between the brackets.')
    ],
    ok: L3("Zo'r! Inspektor sayt oxirini ko'rdi. Sahifa esa o'zgarmadi, xuddi shunday bo'lishi kerak.", 'Огонь! Инспектор увидел низ сайта. А страница не изменилась — так и должно быть.', 'Awesome! The Inspector sees the bottom of the site. And the page didn’t change, which is exactly right.'),
    ask: L3('Pastki qatorga teg nomini yozing', 'Впиши имя тега в нижнюю строку', 'Type the tag name in the bottom line')
  },
  s4: {
    eyebrow: L3('Ramka va kod', 'Рамка и код', 'Frame and code'),
    say: L3("Inspektorda bitta ramka yonadi. Siz kodda shu qismni ochadigan yoki yopadigan qatorni bosing.",
      'В Инспекторе загорается одна рамка. А ты нажми в коде строку, которая открывает или закрывает эту часть.',
      'One frame lights up in the Inspector. Tap the line in the code that opens or closes this part.'),
    askQ: L3("Yongan qism kodning qaysi qatorida?", 'В какой строке кода горящая часть?', 'Which code line is the lit part on?'),
    rounds: [
      null,
      L3("Endi sahifaning tepasi yondi. U kodda qayerda?", 'Теперь горит верх страницы. Где он в коде?', 'Now the top of the page is lit. Where is it in the code?'),
      L3("Oxirgisi. Endi o'rtadagi katta qism yondi. U qaysi qatorda?", 'Последняя. Теперь горит большая часть посередине. В какой она строке?', 'The last one. Now the big part in the middle is lit. Which line is it on?')
    ],
    ok: [
      L3("To'g'ri! Sayt oxirini footer qatori yasaydi.", 'Верно! Низ сайта делает строка footer.', 'Right! The footer line makes the bottom of the site.'),
      L3("To'g'ri! Sayt boshi header ichida turibdi.", 'Верно! Верх сайта лежит внутри header.', 'Right! The top of the site is inside header.'),
      L3("To'g'ri! Asosiy qism main ichida, o'yinlar va retseptlar ham shu yerda.", 'Верно! Главная часть — внутри main, игры и рецепты тоже там.', 'Right! The main part is inside main, with the games and recipes.')
    ],
    miss: L3("Bu qator boshqa qismniki. Yongan ramkaning nomiga qarang va kodda xuddi shu nomli tegni toping.", 'Эта строка от другой части. Посмотри на имя горящей рамки и найди в коде тег с таким именем.', 'This line belongs to another part. Look at the lit frame’s name and find the tag with that name in the code.'),
    // Ступени подсказки (05.11.2026): 1 — куда смотреть, 2 — правило, 3 — какую строку нажать (верные строки загораются).
    hint1: L3("Inspektorda qaysi ramka yonyapti? Uning burchagidagi yorliqni o'qing.", 'Какая рамка горит в Инспекторе? Прочитай ярлычок в её углу.', 'Which frame is lit in the Inspector? Read the label in its corner.'),
    hint2: L3("Yorliqda teg nomi yozilgan. Qism shu teg ochilgan joyda boshlanadi va yopilgan joyda tugaydi.", 'На ярлычке написано имя тега. Часть начинается там, где этот тег открыт, и кончается там, где он закрыт.', 'The label shows the tag name. The part starts where that tag opens and ends where it closes.'),
    hint3: L3("Kodda {t} tegi yozilgan qatorni bosing. Ochuvchi tegi ham, yopuvchi tegi ham bo'ladi.", 'Нажми в коде строку с тегом {t}. Подойдёт и открывающий, и закрывающий тег.', 'Tap the code line with the {t} tag. Both the opening and the closing tag will do.'),
    done: L3("Barakalla! Endi sahifaning har bir qismi kodning qayerida ekanini bilasiz.", 'Молодец! Теперь ты знаешь, где в коде каждая часть страницы.', 'Well done! Now you know where each part of the page is in the code.')
  },
  s5: {
    eyebrow: L3('nav va head', 'nav и head', 'nav and head'),
    say: L3("Sayt boshida menyu bor: boshqa sahifalarga olib boradigan havolalar. Ular uchun alohida teg bor.", 'В верху сайта есть меню: ссылки на другие страницы. Для них есть отдельный тег.', 'At the top of the site there’s a menu: links to other pages. There’s a special tag for them.'),
    sayNav: L3("Menyuni nav tegiga o'radik. nav inglizcha navigation so'zidan olingan, ya'ni yo'l ko'rsatish degani. Saytning asosiy havolalari shu yerda turadi. Qarang, nav header ichida joylashdi.",
      'Меню обернули в тег nav — от английского navigation, то есть «навигация». Здесь главные ссылки сайта. Смотри, nav встал внутрь header.',
      'We wrapped the menu in the nav tag, from the word navigation. The site’s main links go here. Look, nav sits inside header.'),
    sayHead: L3("Diqqat qiling: head va header boshqa-boshqa teglar. head birinchi darsda ko'rgan qismimiz, ya'ni sahifa haqidagi ko'rinmas ma'lumotlar degani. header esa sahifaning ko'rinadigan tepasi bo'ladi va u body ichida turadi.",
      'Обрати внимание: head и header — разные теги. head мы видели на первом уроке — это невидимые сведения о странице. А header — видимый верх страницы, и он стоит внутри body.',
      'Note: head and header are different tags. head is the part we saw in the first lesson: invisible information about the page. header is the visible top of the page, and it goes inside body.'),
    done: L3("Demak, nav menyu uchun, header sayt boshi uchun, head esa sahifa haqidagi ko'rinmas ma'lumot uchun bo'ladi.", 'Значит, nav — для меню, header — для верха сайта, а head — для невидимых сведений о странице.', 'So nav is for the menu, header is for the top of the site, and head is for invisible information about the page.'),
    headIs: L3("ko'rinmas ma'lumot, body tashqarisida", 'невидимые сведения, вне body', 'invisible info, outside body'),
    headerIs: L3("sayt boshi, body ichida", 'верх сайта, внутри body', 'the top of the site, inside body'),
    asks: [
      L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
      L3('Qarang: nav tegi', 'Смотри: тег nav', 'Watch: the nav tag'),
      L3('Qarang: head va header', 'Смотри: head и header', 'Watch: head and header')
    ],
    askDone: L3("nav — menyu, header — sayt boshi", 'nav — меню, header — верх сайта', 'nav — the menu, header — the top')
  },
  s6: {
    eyebrow: L3("Karkasni yig'ing", 'Собери каркас', 'Build the frame'),
    say: L3("Endi saytning karkasini o'zingiz yig'ing. body ichida uchta bo'sh joy bor: tepadan pastga qarab qismlarni joylang. Bitta bo'lak esa ortiqcha.",
      'Теперь собери каркас сайта сам. Внутри body три пустых места: ставь части сверху вниз. А один кусок лишний.',
      'Now build the site’s frame yourself. There are three empty spots inside body: put the parts in from top to bottom. And one piece isn’t needed.'),
    why: {
      head: L3("head body ichiga qo'yilmaydi: u sahifa haqidagi ko'rinmas ma'lumot. Sayt boshi uchun boshqa teg kerak.", 'head не ставят внутрь body: это невидимые сведения о странице. Для верха сайта нужен другой тег.', 'head doesn’t go inside body: it’s invisible information about the page. The top of the site needs a different tag.'),
      header: L3("Tepadan boshlang: birinchi bo'lib sayt boshi keladi.", 'Начни сверху: первым идёт верх сайта.', 'Start at the top: the top of the site comes first.'),
      main: L3("Sayt boshidan keyin asosiy qism keladi.", 'После верха сайта идёт главная часть.', 'After the top of the site comes the main part.'),
      footer: L3("Oxirida sayt oxiri keladi.", 'В конце — низ сайта.', 'At the end comes the bottom of the site.')
    },
    hints: [
      L3('Sayt nimadan boshlanadi?', 'С чего начинается сайт?', 'What does a site start with?'),
      L3("Birinchi bo'lib header, keyin main keladi.", 'Сначала header, потом main.', 'First header, then main.'),
      L3("Tartib shunday bo'ladi: header, main va footer. head kerak emas.", 'Порядок такой: header, main и footer. head не нужен.', 'The order is: header, main and footer. No head.')
    ],
    ok: L3("Ajoyib! Saytning karkasi tayyor: boshi, asosiy qismi va oxiri. Ortiqcha head'ni ham to'g'ri tashlab ketdingiz.", 'Отлично! Каркас сайта готов: верх, главная часть и низ. И лишний head ты правильно не взял.', 'Great! The site’s frame is ready: the top, the main part and the bottom. And you were right to leave out the extra head.'),
    ask: L3("Qismlarni tepadan pastga qo'ying", 'Поставь части сверху вниз', 'Put the parts from top to bottom')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Mana, to'rtta sayt sxemasi. Har birida bitta qism yonib turibdi. Har bir tegni o'z qismi bilan juftlang. Oldin tegni bosing, keyin sxemani bosing.",
      'Вот четыре схемы сайта. На каждой горит одна часть. Соедини каждый тег со своей частью. Сначала нажми тег, потом схему.',
      'Here are four diagrams of a site. One part is lit on each. Match each tag with its part. Tap a tag first, then a diagram.'),
    cards: {
      header: L3('Sayt boshi', 'Верх сайта', 'The top of the site'),
      nav: L3('Menyu havolalari', 'Ссылки меню', 'The menu links'),
      main: L3('Asosiy qism', 'Главная часть', 'The main part'),
      footer: L3('Sayt oxiri', 'Низ сайта', 'The bottom of the site')
    },
    pairOk: {
      header: L3("To'g'ri! header sayt boshi bo'ladi.", 'Верно! header — верх сайта.', 'Right! header is the top of the site.'),
      nav: L3("To'g'ri! nav menyu bo'ladi.", 'Верно! nav — меню.', 'Right! nav is the menu.'),
      main: L3("To'g'ri! main asosiy qism bo'ladi.", 'Верно! main — главная часть.', 'Right! main is the main part.'),
      footer: L3("To'g'ri! footer sayt oxiri bo'ladi.", 'Верно! footer — низ сайта.', 'Right! footer is the bottom of the site.')
    },
    why: {
      header: L3("header butun sayt boshi bo'ladi: tepadagi keng qism.", 'header — весь верх сайта: широкая полоса наверху.', 'header is the whole top of the site: the wide strip at the top.'),
      nav: L3("nav faqat menyu bo'ladi: sayt boshidagi havolalar.", 'nav — только меню: ссылки в верху сайта.', 'nav is only the menu: the links at the top.'),
      main: L3("main o'rtadagi eng katta qism bo'ladi.", 'main — самая большая часть посередине.', 'main is the biggest part in the middle.'),
      footer: L3("footer eng pastdagi qism bo'ladi.", 'footer — самая нижняя часть.', 'footer is the part at the very bottom.')
    },
    hints: [
      L3("Har bir sxemada qaysi joy yonib turibdi: tepa, o'rta yoki past?", 'Что горит на каждой схеме: верх, середина или низ?', 'What’s lit on each diagram: the top, the middle or the bottom?'),
      L3("Tepadagi keng qism header, uning ichidagi kichik qism esa nav bo'ladi.", 'Широкий верх — header, а маленькая часть внутри него — nav.', 'The wide top is header, and the small part inside it is nav.'),
      L3("Tepa header, ichidagi menyu nav, o'rta main, past esa footer bo'ladi.", 'Верх — header, меню в нём — nav, середина — main, низ — footer.', 'The top is header, the menu in it is nav, the middle is main, and the bottom is footer.')
    ],
    ok: L3("Qoyil! Saytning hamma qismini bilasiz.", 'Класс! Ты знаешь все части сайта.', 'Brilliant! You know every part of a site.'),
    ask: L3("Tegni o'z qismi bilan juftlang", 'Соедини тег с его частью', 'Match each tag with its part'),
    askPlace: L3('Endi sxemani bosing', 'Теперь нажми схему', 'Now tap a diagram'),
    pickFirst: L3('Oldin tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.')
  },
  s8: {
    eyebrow: L3("Bo'limlar", 'Разделы', 'Sections'),
    say: L3("Asosiy qismda ikki xil narsa bor: o'yinlar va retseptlar. Ularni ham ajratib qo'yish mumkin.", 'В главной части два разных рассказа: про игры и про рецепты. Их тоже можно разделить.', 'The main part has two different topics: games and recipes. We can separate them too.'),
    saySec: L3("O'yinlar haqidagi qismni section tegiga o'radik. section ya'ni bo'lim degani. Bitta bo'limda bitta mavzu bo'ladi va odatda u o'z sarlavhasi bilan boshlanadi.",
      'Часть про игры обернули в тег section, то есть «раздел». В одном разделе одна тема, и обычно он начинается со своего заголовка.',
      'We wrapped the games part in the section tag. section means a section: one topic, usually starting with its own heading.'),
    sayTwo: L3("Retseptlar ham alohida bo'lim bo'ldi. Diqqat qiling: main sahifada faqat bitta bo'ladi, section esa xohlagancha bo'lishi mumkin.",
      'Рецепты — тоже отдельный раздел. Обрати внимание: main на странице только один, а section — сколько угодно.',
      'The recipes became a separate section too. Note: a page has only one main, but it can have as many sections as you like.'),
    done: L3("Eslab qoling: section bitta mavzuli bo'lim bo'ladi, ular main ichida bir nechta bo'lishi mumkin.", 'Запомни: section — раздел на одну тему, внутри main их может быть несколько.', 'Remember: section is a part about one topic, and main can hold several of them.'),
    askMain: L3("Qarang: asosiy qism", 'Смотри: главная часть', 'Watch: the main part'),
    askSec: L3("Qarang: section — bo'lim", 'Смотри: section — раздел', 'Watch: section — a section'),
    askDone: L3("main bitta, section ko'p", 'main один, section много', 'One main, many sections')
  },
  s9: {
    eyebrow: L3('Teg nomini yozing', 'Впиши имя тега', 'Type the tag name'),
    say: L3("Retseptlar bo'limida ochuvchi teg nomi yo'q. Shuning uchun Inspektor faqat bitta bo'limni ko'ryapti. Bo'lim tegining nomini yozing va «Tekshirish»ni bosing.",
      'У раздела с рецептами у открывающего тега нет имени. Поэтому Инспектор видит только один раздел. Впиши имя тега раздела и нажми «Проверить».',
      'The recipes section’s opening tag has no name, so the Inspector sees only one section. Type the section tag’s name and tap “Check”.'),
    msgs: {
      empty: L3("Burchakli qavslar o'rtasiga teg nomini yozing.", 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslar joyida turibdi. Bu yerga faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      main: L3("main sahifada faqat bitta bo'ladi va u allaqachon bor. Bu yerga bo'lim tegi kerak.", 'main на странице один, и он уже есть. Здесь нужен тег раздела.', 'A page has only one main, and it’s already there. Here you need the section tag.'),
      other: L3("Bu teg boshqa ish qiladi. Bitta mavzuli bo'lim uchun teg kerak.", 'Этот тег делает другое. Нужен тег для раздела на одну тему.', 'That tag does something else. You need the tag for a section about one topic.'),
      typo: L3("Bunday teg yo'q, shuning uchun Inspektor bo'limni ko'rmadi. Nomni harfma-harf yozing.", 'Такого тега нет, поэтому Инспектор не увидел раздел. Напиши имя буква в букву.', 'There’s no such tag, so the Inspector didn’t see the section. Type the name letter by letter.')
    },
    hints: [
      L3("O'yinlar bo'limi qaysi teg bilan boshlanadi?", 'С какого тега начинается раздел про игры?', 'What tag does the games section start with?'),
      L3("Yopuvchi tegga qarang: nomi o'sha yerda yozilgan.", 'Посмотри на закрывающий тег: имя написано там.', 'Look at the closing tag: the name is written there.'),
      L3("Teg nomi section bo'ladi. Uni burchakli qavslar o'rtasiga yozing.", 'Имя тега — section. Впиши его между уголками.', 'The tag name is section. Type it between the brackets.')
    ],
    ok: L3("Zo'r! Endi asosiy qismda ikkita bo'lim bor: o'yinlar va retseptlar.", 'Огонь! Теперь в главной части два раздела: игры и рецепты.', 'Awesome! Now the main part has two sections: games and recipes.'),
    ask: L3('Retseptlar qatoriga teg nomini yozing', 'Впиши имя тега в строку Рецепты', 'Type the tag name in the Recipes line')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Endi ikkita holatga qarang: oldin va keyin. Kodga bitta teg qo'shildi. Sahifa o'zgarmadi, lekin Inspektorda yangi ramka chiqdi. Xo'sh, qaysi teg qo'shildi?",
      'Теперь посмотри на два состояния: до и после. В код добавили один тег. Страница не изменилась, но в Инспекторе появилась новая рамка. Ну и какой тег добавили?',
      'Now look at two states: before and after. One tag was added to the code. The page didn’t change, but a new frame appeared in the Inspector. So which tag was added?'),
    askQ: L3("Qaysi teg qo'shildi?", 'Какой тег добавили?', 'Which tag was added?'),
    ok: {
      nav: L3("To'g'ri! Menyu atrofida nav ramkasi chiqdi.", 'Верно! Вокруг меню появилась рамка nav.', 'Right! A nav frame appeared around the menu.'),
      section: L3("To'g'ri! Asosiy qism ikkita bo'limga bo'lindi.", 'Верно! Главная часть разделилась на два раздела.', 'Right! The main part split into two sections.'),
      footer: L3("To'g'ri! Pastdagi yozuv footer bo'ldi.", 'Верно! Нижняя подпись стала footer.', 'Right! The bottom line became footer.')
    },
    miss: {
      nav: L3("Qarang: yangi ramka menyu havolalari atrofida chiqdi. Menyuni nav o'raydi.", 'Смотри: новая рамка появилась вокруг ссылок меню. Меню оборачивает nav.', 'Look: the new frame appeared around the menu links. nav wraps the menu.'),
      section: L3("Qarang: asosiy qism ichida ikkita yangi ramka chiqdi. Bo'limlarni section yasaydi.", 'Смотри: внутри главной части появились две новые рамки. Разделы делает section.', 'Look: two new frames appeared inside the main part. section makes sections.'),
      footer: L3("Qarang: yangi ramka eng pastda chiqdi. Sayt oxirini footer bildiradi.", 'Смотри: новая рамка появилась в самом низу. Низ сайта — это footer.', 'Look: the new frame appeared at the very bottom. footer marks the bottom of the site.')
    },
    // Ступени подсказки (05.11.2026): 1 — сравнить Инспектор, 2 — где новая рамка и какой тег так делает, 3 — причина и какую кнопку выбрать.
    hint1: L3("Oldin va keyin Inspektorini solishtiring: qayerda yangi ramka chiqdi?", 'Сравни Инспектор «До» и «После»: где появилась новая рамка?', 'Compare the Inspector “Before” and “After”: where did a new frame appear?'),
    hint2: {
      nav: L3("Yangi ramka menyu havolalarini o'rab turibdi. Menyuni qaysi teg o'raydi, esingizdami?", 'Новая рамка обводит ссылки меню. Вспомни, какой тег оборачивает меню.', 'The new frame goes around the menu links. Remember which tag wraps the menu.'),
      section: L3("Asosiy qism ichida ikkita yangi ramka chiqdi. Bo'limlarni qaysi teg yasaydi, esingizdami?", 'Внутри главной части появились две новые рамки. Вспомни, какой тег делает разделы.', 'Two new frames appeared inside the main part. Remember which tag makes sections.'),
      footer: L3("Yangi ramka sahifaning eng pastida chiqdi. Sayt oxirini qaysi teg bildiradi, esingizdami?", 'Новая рамка появилась в самом низу страницы. Вспомни, какой тег обозначает низ сайта.', 'The new frame appeared at the very bottom of the page. Remember which tag marks the bottom of the site.')
    },
    pick3: L3("Demak, {t} tegi yozilgan tugmani tanlang.", 'Значит, выбери кнопку с тегом {t}.', 'So choose the button with the {t} tag.'),
    done: L3("Endi Inspektorga qarab, kodga qaysi qism qo'shilganini bilasiz. Keyin bu qismlar nimaga kerakligini ko'ramiz.", 'Теперь по Инспектору ты понимаешь, какую часть добавили в код. Дальше посмотрим, зачем вообще нужны эти части.', 'Now you can tell from the Inspector which part was added to the code. Next, let’s see why these parts are needed at all.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After')
  },
  s11: {
    eyebrow: L3('Nimaga kerak?', 'Зачем это?', 'Why bother?'),
    say: L3("Sahifa ko'rinishi o'zgarmasa, bu teglar nimaga kerak? Keling, saytni ko'rish qiyin bo'lgan odam kabi ko'rib chiqamiz. Uning uchun sahifani ekrandan o'qib beruvchi dastur o'qiydi.",
      'Если вид страницы не меняется, зачем эти теги? Давай посмотрим на сайт так, как его видит человек с плохим зрением. Ему страницу читает вслух специальная программа.',
      'If the page doesn’t look any different, why do we need these tags? Let’s look at the site the way a person who can’t see well does. A special program reads the page aloud to them.'),
    sayList: L3("Qarang, dastur sahifani qismlarga bo'lib aytadi: sayt boshi, menyu, asosiy qism va sayt oxiri. Bularning hammasini u aynan shu teglardan biladi.",
      'Смотри, программа называет страницу по частям: верх сайта, меню, главная часть и низ. Всё это она узнаёт именно по этим тегам.',
      'Look, the program names the page’s parts: the top, the menu, the main part and the bottom. It knows all of them from exactly these tags.'),
    sayJump: L3("Endi odam bitta tugma bilan to'g'ri asosiy qismga o'ta oladi. Menyuni har safar boshidan eshitib o'tirishi shart emas.",
      'Теперь человек одной кнопкой может перейти прямо к главной части. Не нужно каждый раз заново слушать меню.',
      'Now the person can jump straight to the main part with one key. They don’t have to listen to the menu from the start every time.'),
    sayWhy: L3("Google kabi qidiruv tizimlari ham main ichidagi asosiy matnni yaxshiroq tushunadi. Boshqa dasturchilar esa kodni tez o'qiydi.",
      'Поисковики вроде Google тоже лучше понимают главный текст внутри main. А другие программисты быстрее читают такой код.',
      'Search engines like Google also understand the main text inside main better. And other programmers can read the code faster.'),
    done: L3("Demak, bu teglar saytni odamlar, dasturlar va qidiruv tizimlari uchun tushunarli qiladi.", 'Значит, эти теги делают сайт понятным для людей, программ и поисковиков.', 'So these tags make a site clear for people, programs and search engines.'),
    ask: L3("Dastur sahifani qanday o'qishini kuzating", 'Смотри, как программа читает страницу', 'Watch how the program reads the page'),
    askDone: L3("Qismlar ro'yxati", 'Список частей', 'The list of parts'),
    askJump: L3("Qarang: to'g'ri asosiy qismga", 'Смотри: сразу к главной части', 'Watch: straight to the main part'),
    readerH: L3("Ekrandan o'qib beruvchi dastur", 'Программа чтения с экрана', 'Screen reader'),
    lands: {
      header: L3('sayt boshi', 'верх сайта', 'top of the site'),
      nav: L3('menyu', 'меню', 'menu'),
      main: L3('asosiy qism', 'главная часть', 'main part'),
      footer: L3('sayt oxiri', 'низ сайта', 'bottom of the site')
    }
  },
  // Свой сайт — два экрана по «Готово»: текст подвала (footer), потом заголовок своего раздела (section).
  s12: {
    eyebrow: L3('Saytingiz oxiri', 'Низ своего сайта', 'Your site’s bottom'),
    say: L3("Endi o'z saytingizning qismlarini yasang. Karkas tayyor: header, main va footer. Oldin sayt oxiriga yozuv yozing: masalan, yil va saytingiz nomi. Keyin «Tayyor»ni bosing.",
      'Теперь сделай части своего сайта. Каркас готов: header, main и footer. Сначала напиши подпись для низа сайта: например, год и название сайта. Потом нажми «Готово».',
      'Now make the parts of your own site. The frame is ready: header, main and footer. First write a line for the bottom of the site: for example, the year and your site’s name. Then tap “Done”.'),
    ok: L3("Zo'r! Saytingiz oxiri tayyor. Endi o'z bo'limingizni qo'shamiz.", 'Огонь! Низ сайта готов. Теперь добавим свой раздел.', 'Awesome! Your site’s bottom is ready. Now let’s add your own section.'),
    hints: [
      L3("Sayt oxirida odatda nima yoziladi? Shuni yozing.", 'Что обычно пишут в самом низу сайта? Это и напиши.', 'What usually goes at the very bottom of a site? Write that.'),
      L3("Faqat so'z yozing, footer teglari joyida turibdi.", 'Пиши только слова — теги footer на месте.', 'Type only words: the footer tags are in place.'),
      L3("Masalan: 2026, Mening saytim. Keyin «Tayyor»ni bosing.", 'Например: 2026, Мой сайт. Потом нажми «Готово».', 'For example: 2026, My site. Then tap “Done”.')
    ],
    ask: L3("Sayt oxiri yozuvini yozing va «Tayyor»ni bosing", 'Напиши подпись низа и нажми «Готово»', 'Type the bottom line and tap “Done”'),
    ph: L3('Masalan: 2026, Mening saytim', 'Например: 2026, Мой сайт', 'For example: 2026, My site'),
    sample: L3('© 2026 Mening saytim', '© 2026 Мой сайт', '© 2026 My site')
  },
  s13: {
    eyebrow: L3("Bo'limingiz", 'Свой раздел', 'Your section'),
    say: L3("Endi asosiy qismga o'z bo'limingizni qo'shing. Bo'lim nima haqida bo'ladi? Uning sarlavhasini h2 ichiga yozing. Keyin «Tayyor»ni bosing.",
      'Теперь добавь в главную часть свой раздел. О чём он будет? Впиши его заголовок в h2. Потом нажми «Готово».',
      'Now add your own section to the main part. What will it be about? Type its heading into h2. Then tap “Done”.'),
    ok: L3("Ajoyib! Saytingizda yangi bo'lim paydo bo'ldi.", 'Отлично! На твоём сайте появился новый раздел.', 'Great! A new section appeared on your site.'),
    hints: [
      L3("Saytingizda nima haqida yozmoqchisiz? Shuni sarlavha qiling.", 'О чём хочешь рассказать на сайте? Это и будет заголовком.', 'What do you want to write about on your site? Make that the heading.'),
      L3("Faqat so'z yozing, teglar joyida turibdi.", 'Пиши только слова — теги на месте.', 'Type only words: the tags are in place.'),
      L3("Masalan: Mening sevimli kitoblarim. Keyin «Tayyor»ni bosing.", 'Например: Мои любимые книги. Потом нажми «Готово».', 'For example: My favorite books. Then tap “Done”.')
    ],
    ask: L3("Bo'lim sarlavhasini yozing va «Tayyor»ni bosing", 'Напиши заголовок раздела и нажми «Готово»', 'Type the section heading and tap “Done”'),
    ph: L3('Masalan: Kitoblarim', 'Например: Мои книги', 'For example: My books'),
    sample: L3('Kitoblarim', 'Мои книги', 'My books')
  },
  s14: {
    eyebrow: L3("Sayt boshi yo'qoldi", 'Пропал верх сайта', 'The top is missing'),
    say: L3("Men saytingiz tepasini tahrirladim va adashib boshqa teg yozib qo'ydim. Sahifa xuddi avvalgidek, lekin Inspektor sayt boshini ko'rmayapti! To'g'ri tegni bo'sh joyga olib boring.",
      'Я правил верх твоего сайта и по ошибке написал другой тег. Страница как раньше, но Инспектор не видит верх сайта! Перетащи правильный тег в пустое место.',
      'I was editing the top of your site and wrote the wrong tag by mistake. The page looks the same, but the Inspector can’t see the top of the site! Drag the right tag into the empty spot.'),
    why: {
      head: L3("head sahifa haqidagi ko'rinmas ma'lumot uchun bo'ladi va body ichiga qo'yilmaydi.", 'head — для невидимых сведений о странице, внутрь body его не ставят.', 'head is for invisible information about the page and doesn’t go inside body.'),
      h1: L3("h1 bu sarlavha, u ichkarida allaqachon bor. Butun sayt boshi uchun boshqa teg kerak.", 'h1 — это заголовок, он уже внутри. Для всего верха сайта нужен другой тег.', 'h1 is a heading, and it’s already inside. The whole top of the site needs a different tag.')
    },
    // Ступени подсказки (05.11.2026): 1 — посмотреть на Инспектор, 2 — правило, 3 — какой кусок тащить (он загорается).
    hints: [
      L3("Inspektorga qarang: sayt tepasida ramka bormi? Sarlavha va menyuni qaysi teg o'rashi kerak?", 'Посмотри на Инспектор: есть ли рамка у верха сайта? Какой тег должен обернуть заголовок и меню?', 'Look at the Inspector: is there a frame around the top of the site? Which tag should wrap the heading and the menu?'),
      L3("Bizga sahifaning ko'rinadigan tepasi kerak: sarlavha va menyu. head esa sahifa haqidagi ko'rinmas ma'lumot uchun bo'ladi.", 'Нам нужен видимый верх страницы, то есть заголовок и меню. А head — для невидимых сведений о странице.', 'We need the visible top of the page, that is, the heading and the menu. head is for invisible information about the page.'),
      L3("header tegini bo'sh joyga olib boring: u sayt boshini bildiradi.", 'Перетащи тег header в пустое место: он обозначает верх сайта.', 'Drag the header tag into the empty spot: it marks the top of the site.')
    ],
    ok: L3("Ana endi joyida! Inspektor sayt boshini yana ko'rdi.", 'Вот теперь порядок! Инспектор снова видит верх сайта.', 'That’s it! The Inspector sees the top of the site again.'),
    ask: L3("To'g'ri tegni bo'sh joyga olib boring", 'Перетащи правильный тег в пустое место', 'Drag the right tag into the empty spot')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, sayt va Inspektor, lekin kodda xato bor. Inspektorga qarang: qaysi ramka noto'g'ri joyda? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот сайт и Инспектор, но в коде ошибка. Посмотри на Инспектор: какая рамка не на своём месте? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the site and the Inspector, but the code has a bug. Look at the Inspector: which frame is in the wrong place? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi Inspektorda bitta ramka umuman yo'q. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Теперь в Инспекторе одной рамки нет совсем. Что сломано здесь?', 'Great, the first bug is found! Now one frame is missing from the Inspector entirely. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan. Inspektorga qarang: qaysi ramka joyida emas?", 'Эта строка в порядке. Посмотри на Инспектор: какая рамка не на месте?', 'This line is fine. Look at the Inspector: which frame is out of place?'),
    found: {
      nav: L3("Topdingiz! nav menyu o'rniga sarlavhaga o'ralgan edi. Menyu esa nav'siz qolgan edi.", 'Есть! nav обернули вокруг заголовка, а не меню. А меню осталось без nav.', 'Found it! nav was wrapped around the heading instead of the menu. And the menu was left without nav.'),
      typo: L3("Topdingiz! footer so'zida bitta harf tushib qolgan edi. Brauzer bunday tegni bilmaydi, shuning uchun sayt oxiri ko'rinmagan edi.", 'Есть! В слове footer пропала буква. Браузер не знает такого тега, поэтому низа сайта не было видно.', 'Found it! A letter was missing from the word footer. The browser doesn’t know that tag, so the bottom of the site wasn’t visible.')
    },
    hints: {
      nav: [
        L3("Inspektorga qarang: nav ramkasi nimani o'rab turibdi?", 'Посмотри на Инспектор: что обведено рамкой nav?', 'Look at the Inspector: what does the nav frame go around?'),
        L3("nav menyu havolalari uchun bo'ladi. Sarlavha esa nav emas.", 'nav — для ссылок меню. А заголовок — не nav.', 'nav is for the menu links. The heading isn’t nav.'),
        L3("Sarlavha qatoriga qarang: uni qaysi teg o'rab turibdi?", 'Посмотри на строку заголовка: какой тег вокруг него?', 'Look at the heading line: which tag is around it?')
      ],
      typo: [
        L3("Inspektorga qarang: qaysi qismning ramkasi yo'q?", 'Посмотри на Инспектор: у какой части нет рамки?', 'Look at the Inspector: which part has no frame?'),
        L3("Sayt oxirining tegini harfma-harf o'qing.", 'Прочитай тег низа сайта буква за буквой.', 'Read the bottom-of-the-site tag letter by letter.'),
        L3("Oxirgi qatorga qarang: footer to'liq yozilganmi?", 'Посмотри на последнюю строку: footer написан полностью?', 'Look at the last line: is footer spelled in full?')
      ]
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz saytlarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь сайты как настоящий программист.', 'Super! Both bugs are found. You check sites like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки (05.11.2026): 1 — как читать фразу, 2 — правила урока, 3 — причина и ответ (choiceHints).
    hint1: L3("Gapni bo'laklab o'qing: u qaysi teg haqida? Pastdagi kodga ham qarang.", 'Прочитай фразу по частям: о каком она теге? Посмотри и на код ниже.', 'Read the sentence piece by piece: which tag is it about? Look at the code below too.'),
    hint2: L3("Saytning qismlari sahifa ko'rinishini o'zgartirmaydi, esingizdami? Ular faqat qaysi qism qayerda ekanini aytadi. head esa ko'rinmas ma'lumot uchun bo'ladi. main sahifada faqat bitta bo'ladi. Gap shunga mos keladimi?",
      'Вспомни: части сайта не меняют вид страницы, они только говорят, где какая часть. А head — для невидимых сведений, и main на странице один. Фраза с этим совпадает?',
      'Remember: the parts of a site don’t change how the page looks; they only say which part is where. head is for invisible information, and a page has only one main. Does the sentence match that?'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3('header tegi sayt tepasini rangli qiladi.', 'Тег header делает верх сайта цветным.', 'The header tag makes the top of the site colorful.'), right: false, code: 'header',
        why: L3("header ko'rinishni o'zgartirmaydi. U faqat bu sayt boshi ekanini aytadi.", 'header не меняет вид. Он только говорит, что это верх сайта.', 'header doesn’t change how things look. It only says this is the top of the site.') },
      { t: L3('head va header bitta teg bo\'ladi.', 'head и header — один и тот же тег.', 'head and header are the same tag.'), right: false, code: 'head',
        why: L3("head sahifa haqidagi ko'rinmas ma'lumot, header esa sahifaning ko'rinadigan tepasi bo'ladi.", 'head — невидимые сведения о странице, а header — видимый верх страницы.', 'head is invisible information about the page, and header is the visible top of the page.') },
      { t: L3("Sahifada main bitta bo'ladi, section esa bir nechta bo'lishi mumkin.", 'На странице один main, а section может быть несколько.', 'A page has one main, but it can have several sections.'), right: true, code: 'main',
        why: L3("main sahifaning asosiy qismi, u bitta. Uning ichida esa bo'limlar ko'p bo'lishi mumkin.", 'main — главная часть страницы, она одна. А разделов внутри может быть много.', 'main is the page’s main part, and there’s only one. But it can hold many sections.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz saytning qismlarini yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь части сайта.', 'All correct! You know the parts of a site really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men sayt tepasini header tegiga o'rab, u o'zi rangli bo'ladi deb o'ylagan edim? Afsuski, men adashibman. Qarang, sahifa umuman o'zgarmadi. header faqat bu sayt boshi ekanini aytadi. Rang va chiroyni esa CSS beradi, uni keyingi kursda o'rganasiz.",
        'Вернёмся к загадке. Помнишь, я обернул верх сайта в header и думал, что он сам станет цветным? Увы, я ошибся. Смотри, страница совсем не изменилась. header только говорит, что это верх сайта. А цвет и красоту даёт CSS — его ты изучишь в следующем курсе.',
        'Back to our riddle. Remember, I wrapped the top of the site in header and thought it would become colorful by itself? Sadly, I was wrong. Look, the page didn’t change at all. header only says this is the top of the site. Color and style come from CSS, which you’ll learn in the next course.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning saytingiz! Unda sizning bo'limingiz va sizning sayt oxiringiz bor.", 'Смотри, это твой сайт! В нём твой раздел и твой низ сайта.', 'Look, this is your site! It has your section and your bottom line.'), k: null },
      { text: L3("header sayt boshi bo'ladi.", 'header — верх сайта.', 'header is the top of the site.'), k: 'header' },
      { text: L3("nav menyu havolalari uchun bo'ladi.", 'nav — для ссылок меню.', 'nav is for the menu links.'), k: 'nav' },
      { text: L3("main sahifaning yagona asosiy qismi bo'ladi.", 'main — единственная главная часть страницы.', 'main is the page’s one main part.'), k: 'main' },
      { text: L3("section bitta mavzuli bo'lim bo'ladi.", 'section — раздел на одну тему.', 'section is a part about one topic.'), k: 'section' },
      { text: L3("footer esa sayt oxiri bo'ladi.", 'А footer — низ сайта.', 'And footer is the bottom of the site.'), k: 'footer' },
      { text: L3("Tabriklayman! Endi siz haqiqiy saytlar qanday tuzilganini bilasiz. Keyingi darsda hamma bilganlaringizni yig'ib, o'zingizning yakuniy loyihangizni yasaysiz. Ko'rishguncha!", 'Ура! Теперь ты знаешь, как устроены настоящие сайты. На следующем уроке соберёшь всё, что знаешь, в свой финальный проект. До встречи!', 'Hooray! Now you know how real websites are built. Next time you’ll put everything you know together into your own final project. See you!'), k: null }
    ],
    roles: {
      header: L3('header — sayt boshi', 'header — верх сайта', 'header — the top'),
      nav: L3('nav — menyu', 'nav — меню', 'nav — the menu'),
      main: L3('main — asosiy qism', 'main — главная часть', 'main — the main part'),
      section: L3("section — bo'lim", 'section — раздел', 'section — a section'),
      footer: L3('footer — sayt oxiri', 'footer — низ сайта', 'footer — the bottom')
    },
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, pick3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayHeader: 1, sayMain: 1, sayFooter: 1, sayNav: 1, sayHead: 1, saySec: 1, sayTwo: 1,
  sayList: 1, sayJump: 1, sayWhy: 1, askQ: 1, rounds: 1, miss: 1, say2: 1, fine: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:z8-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:z8.css@*/
`;
