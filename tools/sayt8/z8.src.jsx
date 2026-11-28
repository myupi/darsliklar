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
    say: L3("Saytim ancha kattalashib ketdi: sarlavha ham, menyu ham, o'yinlar bilan retseptlar ham bor, eng pastida esa kichkina yozuv turibdi. Lekin kodini ochsam, hammasi bir uyum bo'lib yotibdi. Qayeri sayt boshi, qayeri asosiy qismi, qayeri oxiri, o'zim ham adashib qoldim. «Aylantirish» tugmasi kodni tartibga soladi, bosib ko'ring.",
      'Привет! Мой сайт разросся: заголовок, меню, игры, рецепты, а в самом низу маленькая подпись. Но посмотри на код: всё лежит одной кучей. Где у сайта верх, где главная часть, где низ — не понять. Давай наведём в коде порядок. Нажми «Превратить».',
      'Hi! My site has grown: a heading, a menu, games, recipes, and a small line at the very bottom. But look at the code: it’s all one big pile. You can’t tell where the top of the site is, where the main part is, or where the bottom is. Let’s tidy up the code. Tap “Transform”.'),
    magic: L3("Uyum yoyilib, har narsa o'z joyiga tushdi: sayt boshi, menyu, asosiy qism, bo'limlar va oxiri. Endi kodni o'qish ancha oson bo'ldi.", 'Ого, смотри! Код разложен по частям: верх, меню, главная часть, разделы и низ. Теперь код читать гораздо проще.', 'Whoa, look! The code is split into parts: the top, the menu, the main part, sections and the bottom. Now the code is much easier to read.'),
    magicP: L3("Lekin brauzerdagi sahifa-chi? U umuman o'zgarmadi! Bu rangli ramkalarni Inspektor chizdi. Inspektor brauzerning yordamchisi: u har bir qismni ramkaga olib ko'rsatadi, saytning o'zida esa bu ramkalar yo'q.", 'Посмотри на браузер: страница совсем не изменилась. А цветные рамки я включил Инспектором, на самом сайте их нет.', 'Look at the browser: the page didn’t change at all. I turned on the colored frames with the Inspector; they aren’t part of the site.'),
    done: L3("Boshqa bir saytimda tepadagi sarlavha bilan menyuni header tegiga o'radim, rang esa yozmadim: brauzer sayt boshiga o'zi rang berib, chiroyli qilib qo'yadi, deb o'yladim. Sizningcha, to'g'ri qildimmi? Buni dars oxirida o'sha saytni ochib tekshiramiz.",
      'Сегодня ты научишься делить сайт на такие части и сделаешь части своего сайта. Но сначала маленькая загадка. На другом своём сайте я обернул верх в тег header. По-моему, теперь верх сайта сам станет цветным и красивым. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to split a site into parts like these, and you’ll make the parts of your own site. But first, a little riddle. On my other site I wrapped the top in the header tag. I think the top of the site will now become colorful and pretty by itself. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Kod qismlarga bo'lindi, sahifa o'sha-o'sha", 'Код разложен по частям, страница та же', 'The code is in parts, the page is the same')
  },
  s2: {
    eyebrow: L3('header, main, footer', 'header, main, footer', 'header, main, footer'),
    say: L3("Har bir saytda uchta katta qism bor: boshi, asosiy qismi va oxiri. Keling, ularni bittalab o'rab chiqamiz. Ramkalarni Inspektor chizib beradi, sahifaning o'zi esa o'zgarmay turaveradi.",
      'У каждого сайта три большие части: верх, главная часть и низ. Обернём их по очереди. Рамки показывает Инспектор, а сама страница не меняется.',
      'Every site has three big parts: the top, the main part and the bottom. Let’s wrap them one by one. The Inspector shows the frames; the page itself doesn’t change.'),
    sayHeader: L3("Oldin tepadagi sarlavha bilan menyuni header tegiga o'radik, bu so'z inglizchada «tepa qism» degani. Saytning nomi ham, menyusi ham odatda aynan shu yerda bo'ladi.",
      'Заголовок и меню обернули в тег header, то есть «верх сайта». Обычно там название сайта и меню.',
      'We wrapped the heading and the menu in the header tag. header means the top of the site. It usually holds the site’s name and the menu.'),
    sayMain: L3("O'yinlar bilan retseptlar saytning eng muhim qismi, shuning uchun ularni main tegiga o'radik: main inglizchada «asosiy» degani. Faqat bir narsani unutmang: bitta sahifada main bittadan ortiq bo'lmaydi.",
      'Теперь игры и рецепты обернём в тег main, то есть «главный». Здесь самое важное на странице, и main на странице бывает только один.',
      'Now we wrap the games and the recipes in the main tag. main means the main part. The most important things on the page go here, and a page has only one main.'),
    sayFooter: L3("Pastdagi kichkina yozuv-chi? Uni footer tegiga o'radik: bu teg sayt oxirini bildiradi. Saytlarning pastida odatda saytni kim yasagani, telefon yoki pochta, yana bir-ikkita havola turadi.",
      'И в конце нижнюю подпись обернём в тег footer, то есть «низ сайта». Там обычно авторские права, контакты и дополнительные ссылки.',
      'Finally we wrap the bottom line in the footer tag. footer means the bottom of the site. It usually has the copyright, contacts and extra links.'),
    done: L3("Demak, tepada header, o'rtada main, eng pastda footer turibdi. Sezdingizmi? Sahifa o'zgarmadi, bu teglar faqat har bir qism nima ekanini aytib turibdi.", 'Запомни: header — верх сайта, main — главная часть, footer — низ. Они не меняют вид страницы, а только говорят, что это за часть.', 'Remember: header is the top, main is the main part, and footer is the bottom. They don’t change how the page looks; they only say what each part is.'),
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
    say: L3("Endi sayt oxirini o'zingiz tuzatasiz: pastki qatorda ochuvchi tegning nomi o'chib qolgan, Inspektor esa sayt oxirini ko'rmayapti. Sayt oxirini bildiradigan teg nomini yozing-da, «Tekshirish»ni bosing.",
      'Теперь твоя очередь. В нижней строке у открывающего тега нет имени. Поэтому Инспектор не видит низ сайта. Впиши имя тега, который означает низ сайта, и нажми «Проверить».',
      'Now it’s your turn. In the bottom line the opening tag has no name, so the Inspector can’t see the bottom of the site. Type the name of the tag for the bottom of the site and tap “Check”.'),
    msgs: {
      empty: L3("Qani, qavslarning o'rtasi hali bo'm-bo'sh turibdi. U yerga teg nomini yozing.", 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslar joyida, ularga tegmang. Bo'sh qatorga faqat teg nomi kerak.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      top: L3("Bu teg saytning boshiga qo'yiladi, biz esa pastki qatorni, sayt oxirini tuzatyapmiz.", 'Это для верха сайта. А нам нужен низ.', 'That’s for the top of the site. We need the bottom.'),
      other: L3("Bu teg sayt oxirini o'ramaydi. Sayt oxirini qaysi teg bildirishini o'ylab ko'ring-chi?", 'Этот тег делает другое. Нужен тег для низа сайта.', 'That tag does something else. We need the tag for the bottom of the site.'),
      typo: L3("Brauzer bunday tegni tanimaydi, shuning uchun Inspektor sayt oxirini ko'rmadi. Nomini qayta o'qib, to'g'rilab yozing.", 'Такого тега нет, поэтому Инспектор не увидел низ сайта. Напиши имя буква в букву.', 'There’s no such tag, so the Inspector didn’t see the bottom of the site. Type the name letter by letter.')
    },
    hints: [
      L3("Yopuvchi teg pastroqda turibdi. Kerakli nom o'sha yerda yozib qo'yilgan.", 'Посмотри на закрывающий тег: имя написано там.', 'Look at the closing tag: the name is written there.'),
      L3("Kerakli so'z f harfidan boshlanadi, xuddi yopuvchi tegdagidek.", 'Оно английское — «нижняя часть». Начинается с буквы f.', 'It’s English for the bottom part. It starts with the letter f.'),
      L3("Kerakli nom footer bo'ladi. Uni qavslarning o'rtasiga yozing-da, «Tekshirish»ni bosing.", 'Имя тега — footer. Впиши его между уголками.', 'The tag name is footer. Type it between the brackets.')
    ],
    ok: L3("Inspektor sayt oxirini ko'rib qoldi! Sahifa esa o'zgarmadi, xuddi shunday bo'lishi kerak edi.", 'Огонь! Инспектор увидел низ сайта. А страница не изменилась — так и должно быть.', 'Awesome! The Inspector sees the bottom of the site. And the page didn’t change, which is exactly right.'),
    ask: L3('Pastki qatorga teg nomini yozing', 'Впиши имя тега в нижнюю строку', 'Type the tag name in the bottom line')
  },
  s4: {
    eyebrow: L3('Ramka va kod', 'Рамка и код', 'Frame and code'),
    say: L3("Inspektorda bitta ramka yonadi. Qani, kodda uning teglarini toping-da, shu qatorni bosing.",
      'В Инспекторе загорается одна рамка. А ты нажми в коде строку, которая открывает или закрывает эту часть.',
      'One frame lights up in the Inspector. Tap the line in the code that opens or closes this part.'),
    askQ: L3("Yonib turgan qism kodning qaysi qatorida?", 'В какой строке кода горящая часть?', 'Which code line is the lit part on?'),
    rounds: [
      null,
      L3("Endi saytning boshi yondi. Qani, uni kodda qayerdan topasiz?", 'Теперь горит верх страницы. Где он в коде?', 'Now the top of the page is lit. Where is it in the code?'),
      L3("Mana, oxirgisi: endi o'rtadagi katta qism yonib turibdi. Bu safar qaysi qatorni bosasiz?", 'Последняя. Теперь горит большая часть посередине. В какой она строке?', 'The last one. Now the big part in the middle is lit. Which line is it on?')
    ],
    ok: [
      L3("Pastki ramkaga tegishli qator shu: sayt oxirini footer o'rab turadi. Kodda u eng oxirida yozilgan, shuning uchun sahifada ham pastda chiqdi.", 'Верно! Низ сайта — строка footer. В коде она стоит последней, поэтому и на странице оказалась внизу.', 'Right! The bottom of the site is the footer line. It comes last in the code, so it ends up at the bottom of the page too.'),
      L3("Tepadagi ramkani o'zingiz topdingiz: header sayt boshini o'raydi.", 'Верно! Верх сайта лежит внутри header.', 'Right! The top of the site is inside header.'),
      L3("O'rtadagi katta ramka main tegidan chiqdi, ichida o'yinlar bilan retseptlar turibdi.", 'Верно! Главная часть — внутри main, игры и рецепты тоже там.', 'Right! The main part is inside main, with the games and recipes.')
    ],
    miss: L3("Hechqisi yo'q: bu qator boshqa qismni o'raydi. Yonib turgan ramkaning nomini o'qing-da, kodda xuddi shunday nomli tegni toping.", 'Эта строка от другой части. Посмотри на имя горящей рамки и найди в коде тег с таким именем.', 'This line belongs to another part. Look at the lit frame’s name and find the tag with that name in the code.'),
    // Ступени подсказки (05.11.2026): 1 — куда смотреть, 2 — правило, 3 — какую строку нажать (верные строки загораются).
    hint1: L3("Inspektorda qaysi ramka yonib turibdi? Uning burchagidagi kichkina yozuvni o'qib ko'ring.", 'Какая рамка горит в Инспекторе? Прочитай ярлычок в её углу.', 'Which frame is lit in the Inspector? Read the label in its corner.'),
    hint2: L3("Ramka burchagidagi nom aynan teg nomi. Qism shu teg ochilgan joyda boshlanib, yopilgan joyda tugaydi.", 'На ярлычке написано имя тега. Часть начинается там, где этот тег открыт, и кончается там, где он закрыт.', 'The label shows the tag name. The part starts where that tag opens and ends where it closes.'),
    hint3: L3("Kodda {t} tegi turgan qatorni bosing. Ochuvchi tegini bossangiz ham, yopuvchisini bossangiz ham bo'laveradi.", 'Нажми в коде строку с тегом {t}. Подойдёт и открывающий, и закрывающий тег.', 'Tap the code line with the {t} tag. Both the opening and the closing tag will do.'),
    done: L3("Ko'rdingizmi, ramkani topish qiyin emas: uning nomini o'qiysiz-u, kodda xuddi shu nomli tegni qidirasiz.", 'Молодец! Теперь ты знаешь, где в коде каждая часть страницы.', 'Well done! Now you know where each part of the page is in the code.')
  },
  s5: {
    eyebrow: L3('nav va head', 'nav и head', 'nav and head'),
    say: L3("Sayt boshiga yana bir qarang-chi: unda menyu ham bor. Menyu boshqa sahifalarga olib boradigan havolalar. Ular uchun ham alohida teg bor.", 'В верху сайта есть меню: ссылки на другие страницы. Для них есть отдельный тег.', 'At the top of the site there’s a menu: links to other pages. There’s a special tag for them.'),
    sayNav: L3("Menyuni nav tegiga o'radik. Bu nom inglizcha navigation so'zidan qisqartirilgan, «yo'l ko'rsatish» degani: menyu ham boshqa sahifalarga yo'l ko'rsatadi! Sezdingizmi? nav header ichiga kirib oldi.",
      'Меню обернули в тег nav — от английского navigation, то есть «навигация». Здесь главные ссылки сайта. Смотри, nav встал внутрь header.',
      'We wrapped the menu in the nav tag, from the word navigation. The site’s main links go here. Look, nav sits inside header.'),
    sayHead: L3("Diqqat qiling: nomlari o'xshab ketsa ham, head bilan header boshqa-boshqa teglar. head bilan birinchi darsdayoq tanishgan edik, esingizdami? U sahifa haqidagi ko'rinmas ma'lumotlarni saqlaydi. header esa sahifaning ko'rinadigan boshi bo'ladi va body ichida turadi.",
      'Обрати внимание: head и header — разные теги. head мы видели на первом уроке — это невидимые сведения о странице. А header — видимый верх страницы, и он стоит внутри body.',
      'Note: head and header are different tags. head is the part we saw in the first lesson: invisible information about the page. header is the visible top of the page, and it goes inside body.'),
    done: L3("Farqini endi aniq ko'rdingiz: header saytning ko'rinadigan boshi bo'ladi, nav esa uning ichidagi menyu. head bo'lsa butunlay boshqa joyda yashaydi: body ichida emas, undan oldin.", 'Значит, nav — для меню, header — для верха сайта, а head — для невидимых сведений о странице.', 'So nav is for the menu, header is for the top of the site, and head is for invisible information about the page.'),
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
    eyebrow: L3("Sayt asosi", 'Собери каркас', 'Build the frame'),
    say: L3("Endi saytning asosini o'zingiz yig'ib ko'ring! body ichida uchta bo'sh joy bor, qismlarni tepadan pastga qarab joylang. Lekin bo'laklar ichiga bitta begonasi ham aralashib qolgan.",
      'Теперь собери каркас сайта сам. Внутри body три пустых места: ставь части сверху вниз. А один кусок лишний.',
      'Now build the site’s frame yourself. There are three empty spots inside body: put the parts in from top to bottom. And one piece isn’t needed.'),
    why: {
      head: L3("Mana, begona bo'lak! head body ichiga kirmaydi, chunki uning joyi body boshlanishidan oldin. Sayt boshi uchun boshqa teg kerak.", 'head не ставят внутрь body: это невидимые сведения о странице. Для верха сайта нужен другой тег.', 'head doesn’t go inside body: it’s invisible information about the page. The top of the site needs a different tag.'),
      header: L3("Shoshilmang! Tepadan boshlaymiz: eng birinchi bo'lib sayt boshi keladi.", 'Начни сверху: первым идёт верх сайта.', 'Start at the top: the top of the site comes first.'),
      main: L3("Bu joy sayt boshidan keyin turibdi, shuning uchun bu yerga asosiy qism keladi.", 'После верха сайта идёт главная часть.', 'After the top of the site comes the main part.'),
      footer: L3("Bu joy eng pastda turibdi, demak, bu yerga sayt oxiri keladi.", 'В конце — низ сайта.', 'At the end comes the bottom of the site.')
    },
    hints: [
      L3("Saytni tepadan pastga o'qisak, eng birinchi nima keladi?", 'С чего начинается сайт?', 'What does a site start with?'),
      L3("Eng tepada header turadi, undan keyin main keladi.", 'Сначала header, потом main.', 'First header, then main.'),
      L3("Tepadan pastga: header, main, footer. head esa bu yerda begona.", 'Порядок такой: header, main и footer. head не нужен.', 'The order is: header, main and footer. No head.')
    ],
    ok: L3("Sayt asosi tayyor: header, main va footer o'z joyida turibdi! Begona head tegiga aldanmadingiz.", 'Отлично! Каркас сайта готов: верх, главная часть и низ. И лишний head ты правильно не взял.', 'Great! The site’s frame is ready: the top, the main part and the bottom. And you were right to leave out the extra head.'),
    ask: L3("Qismlarni tepadan pastga qo'ying", 'Поставь части сверху вниз', 'Put the parts from top to bottom')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("To'rtta kichkina sayt sxemasi tayyor, har birida bitta qism yonib turibdi. Qaysi teg qaysi qismni o'rashini topib bering: oldin tegni, keyin sxemani bosing.",
      'Вот четыре схемы сайта. На каждой горит одна часть. Соедини каждый тег со своей частью. Сначала нажми тег, потом схему.',
      'Here are four diagrams of a site. One part is lit on each. Match each tag with its part. Tap a tag first, then a diagram.'),
    cards: {
      header: L3('Sayt boshi', 'Верх сайта', 'The top of the site'),
      nav: L3('Menyu havolalari', 'Ссылки меню', 'The menu links'),
      main: L3('Asosiy qism', 'Главная часть', 'The main part'),
      footer: L3('Sayt oxiri', 'Низ сайта', 'The bottom of the site')
    },
    pairOk: {
      header: L3("Ramka sayt boshiga tushdi: header sayt boshini o'rab turadi.", 'Верно! header — верх сайта.', 'Right! header is the top of the site.'),
      nav: L3("Menyu ham o'z ramkasini topdi: nav ichida menyu yashaydi.", 'Верно! nav — меню.', 'Right! nav is the menu.'),
      main: L3("O'rtadagi katta ramka egasini topdi: main asosiy qismni o'raydi.", 'Верно! main — главная часть.', 'Right! main is the main part.'),
      footer: L3("Pastki ramka ham joyida: footer eng pastda, sayt oxirida turadi.", 'Верно! footer — низ сайта.', 'Right! footer is the bottom of the site.')
    },
    why: {
      header: L3("header butun sayt boshini o'rab turadi: tepadagi keng qismni qidiring.", 'header — весь верх сайта: широкая полоса наверху.', 'header is the whole top of the site: the wide strip at the top.'),
      nav: L3("nav butun boshni emas, faqat menyuni o'raydi, ya'ni sayt boshidagi havolalarni. Kichikroq qismni qidiring.", 'nav — только меню: ссылки в верху сайта.', 'nav is only the menu: the links at the top.'),
      main: L3("Hali emas: main o'rtada turadigan eng katta qismni o'raydi. Qaysi sxemada o'rtasi yonib turibdi, shuni toping.", 'main — самая большая часть посередине.', 'main is the biggest part in the middle.'),
      footer: L3("footer sayt oxirini bildiradi. Uni odatda kodning eng oxirida yozishadi, shuning uchun u pastda ko'rinadi. Pastki qismi yongan sxemani qidiring.", 'footer — низ сайта. Его обычно пишут в самом конце кода, поэтому он и оказывается внизу.', 'footer is the bottom of the site. It is usually written at the very end of the code, so it ends up at the bottom.')
    },
    hints: [
      L3("Har bir sxemada qayeri yonib turibdi: tepasimi, o'rtasimi yoki pasti?", 'Что горит на каждой схеме: верх, середина или низ?', 'What’s lit on each diagram: the top, the middle or the bottom?'),
      L3("Tepadagi keng qism header bo'ladi. Uning ichidagi kichkina qism esa nav bo'ladi.", 'Широкий верх — header, а маленькая часть внутри него — nav.', 'The wide top is header, and the small part inside it is nav.'),
      L3("Tepadagi keng qism header, uning ichidagi menyu nav, o'rtadagisi main, eng pastdagisi esa footer bo'ladi.", 'Верх — header, меню в нём — nav, середина — main, низ — footer.', 'The top is header, the menu in it is nav, the middle is main, and the bottom is footer.')
    ],
    ok: L3("Hammasi o'z ramkasini topdi: endi header, nav, main va footer sizga tanish.", 'Класс! Ты знаешь все части сайта.', 'Brilliant! You know every part of a site.'),
    ask: L3("Tegni o'z qismi bilan juftlang", 'Соедини тег с его частью', 'Match each tag with its part'),
    askPlace: L3('Endi sxemani bosing', 'Теперь нажми схему', 'Now tap a diagram'),
    pickFirst: L3('Oldin tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.')
  },
  s8: {
    eyebrow: L3("Bo'limlar", 'Разделы', 'Sections'),
    say: L3("Endi asosiy qismning ichiga kiramiz. Unda ikki xil mavzu bor: o'yinlar va retseptlar. Ular bir-biriga aralashib ketmasin-chi? Hozir ajratib qo'yamiz.", 'В главной части два разных рассказа: про игры и про рецепты. Их тоже можно разделить.', 'The main part has two different topics: games and recipes. We can separate them too.'),
    saySec: L3("Endi o'yinlar alohida bo'limga ajraldi: ularni section tegiga o'radik. Har bir bo'lim bitta mavzu haqida bo'ladi va odatda o'z sarlavhasi bilan boshlanadi.",
      'Часть про игры обернули в тег section, то есть «раздел». В одном разделе одна тема, и обычно он начинается со своего заголовка.',
      'We wrapped the games part in the section tag. section means a section: one topic, usually starting with its own heading.'),
    sayTwo: L3("Retseptlar ham alohida bo'limga aylandi. Endi farqiga e'tibor bering: main sahifada faqat bitta bo'ladi, section esa xohlagancha bo'lishi mumkin.",
      'Рецепты — тоже отдельный раздел. Обрати внимание: main на странице только один, а section — сколько угодно.',
      'The recipes became a separate section too. Note: a page has only one main, but it can have as many sections as you like.'),
    done: L3("Demak, har bir mavzuga bitta section ajratamiz, ularning hammasi esa bitta main ichida turadi.", 'Запомни: section — раздел на одну тему, внутри main их может быть несколько.', 'Remember: section is a part about one topic, and main can hold several of them.'),
    askMain: L3("Qarang: asosiy qism", 'Смотри: главная часть', 'Watch: the main part'),
    askSec: L3("Qarang: section — bo'lim", 'Смотри: section — раздел', 'Watch: section — a section'),
    askDone: L3("main bitta, section ko'p", 'main один, section много', 'One main, many sections')
  },
  s9: {
    eyebrow: L3('Teg nomini yozing', 'Впиши имя тега', 'Type the tag name'),
    say: L3("Retseptlar bo'limida ochuvchi tegning nomi o'chib ketibdi, shuning uchun Inspektor faqat bitta bo'limni ko'ryapti. Bo'lim tegining nomini yozib, «Tekshirish»ni bosing.",
      'У раздела с рецептами у открывающего тега нет имени. Поэтому Инспектор видит только один раздел. Впиши имя тега раздела и нажми «Проверить».',
      'The recipes section’s opening tag has no name, so the Inspector sees only one section. Type the section tag’s name and tap “Check”.'),
    msgs: {
      empty: L3("Bo'sh joyga hali hech narsa yozilmagan. U yerga bo'lim tegining nomini yozing.", 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslarni qayta yozish shart emas, ular joyida turibdi. Faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      main: L3("Shoshilmang! main sahifada faqat bitta bo'ladi, u esa allaqachon bor. Bu yerga bo'lim tegi kerak.", 'main на странице один, и он уже есть. Здесь нужен тег раздела.', 'A page has only one main, and it’s already there. Here you need the section tag.'),
      other: L3("Bu teg bo'lim yasamaydi, uning ishi boshqa. Bitta mavzuni o'rab turadigan tegni topa olasizmi?", 'Этот тег делает другое. Нужен тег для раздела на одну тему.', 'That tag does something else. You need the tag for a section about one topic.'),
      typo: L3("Bunaqa teg yo'q, Inspektor ham bo'limni ko'rmadi. Har bir harfini tekshirib, qayta yozing.", 'Такого тега нет, поэтому Инспектор не увидел раздел. Напиши имя буква в букву.', 'There’s no such tag, so the Inspector didn’t see the section. Type the name letter by letter.')
    },
    hints: [
      L3("O'yinlar bo'limi qaysi teg bilan boshlangan edi? Tepadagi qatorni o'qib ko'ring.", 'С какого тега начинается раздел про игры?', 'What tag does the games section start with?'),
      L3("Retseptlarning yopuvchi tegida ham shu nom yozilgan.", 'Посмотри на закрывающий тег: имя написано там.', 'Look at the closing tag: the name is written there.'),
      L3("Bo'lim tegining nomi section bo'ladi. Uni qavslarning o'rtasiga yozib qo'ying.", 'Имя тега — section. Впиши его между уголками.', 'The tag name is section. Type it between the brackets.')
    ],
    ok: L3("Retseptlar ham o'z ramkasini oldi! Asosiy qism endi o'yinlar va retseptlarga aniq bo'linib turibdi.", 'Огонь! Теперь в главной части два раздела: игры и рецепты.', 'Awesome! Now the main part has two sections: games and recipes.'),
    ask: L3('Retseptlar qatoriga teg nomini yozing', 'Впиши имя тега в строку Рецепты', 'Type the tag name in the Recipes line')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Inspektorning ikki holatiga qarang: «Oldin» va «Keyin». Sahifa o'sha-o'shaligicha turibdi, lekin «Keyin»da yangi ramka chiqib qolibdi. Demak, kodga bitta teg qo'shilgan. Qaysi teg bo'lishi mumkin?",
      'Теперь посмотри на два состояния: до и после. В код добавили один тег. Страница не изменилась, но в Инспекторе появилась новая рамка. Ну и какой тег добавили?',
      'Now look at two states: before and after. One tag was added to the code. The page didn’t change, but a new frame appeared in the Inspector. So which tag was added?'),
    askQ: L3("Qaysi teg qo'shildi?", 'Какой тег добавили?', 'Which tag was added?'),
    ok: {
      nav: L3("Menyu atrofida yangi ramka yondi, uni nav chizdi!", 'Верно! Вокруг меню появилась рамка nav.', 'Right! A nav frame appeared around the menu.'),
      section: L3("Asosiy qism ikkiga bo'lindi! Bo'limlarni section tegi qiladi.", 'Верно! Главная часть разделилась на два раздела.', 'Right! The main part split into two sections.'),
      footer: L3("Pastdagi yozuv ham o'z ramkasini topdi: u footer ichida turibdi.", 'Верно! Нижняя подпись стала footer.', 'Right! The bottom line became footer.')
    },
    miss: {
      nav: L3("Yangi ramka menyu havolalarini o'rab olgan, qarang-chi. Menyuni esa nav o'raydi.", 'Смотри: новая рамка появилась вокруг ссылок меню. Меню оборачивает nav.', 'Look: the new frame appeared around the menu links. nav wraps the menu.'),
      section: L3("Yangi ramkalar asosiy qismning ichida, ikkita bo'lib chiqdi. Bo'limlarni esa section yasaydi.", 'Смотри: внутри главной части появились две новые рамки. Разделы делает section.', 'Look: two new frames appeared inside the main part. section makes sections.'),
      footer: L3("Pastga qarang-chi: yangi ramka sahifaning eng pastida chiqdi. Sayt oxirini esa footer bildiradi.", 'Смотри: новая рамка появилась в самом низу. Низ сайта — это footer.', 'Look: the new frame appeared at the very bottom. footer marks the bottom of the site.')
    },
    // Ступени подсказки (05.11.2026): 1 — сравнить Инспектор, 2 — где новая рамка и какой тег так делает, 3 — причина и какую кнопку выбрать.
    hint1: L3("Inspektorning «Oldin» va «Keyin» holatlarini solishtirib ko'ring: yangi ramka qayerda paydo bo'ldi?", 'Сравни Инспектор «До» и «После»: где появилась новая рамка?', 'Compare the Inspector “Before” and “After”: where did a new frame appear?'),
    hint2: {
      nav: L3("Yangi ramka aynan menyuning atrofida. Menyu uchun qaysi teg bor edi?", 'Новая рамка обводит ссылки меню. Вспомни, какой тег оборачивает меню.', 'The new frame goes around the menu links. Remember which tag wraps the menu.'),
      section: L3("Asosiy qismning ichida ikkita ramka chiqibdi. Bo'limlarni qaysi teg yasaydi?", 'Внутри главной части появились две новые рамки. Вспомни, какой тег делает разделы.', 'Two new frames appeared inside the main part. Remember which tag makes sections.'),
      footer: L3("Yangi ramka eng pastda turibdi. Sayt oxirini qaysi teg bildirardi?", 'Новая рамка появилась в самом низу страницы. Вспомни, какой тег обозначает низ сайта.', 'The new frame appeared at the very bottom of the page. Remember which tag marks the bottom of the site.')
    },
    pick3: L3("Demak, {t} tegi yozilgan tugmani tanlang.", 'Значит, выбери кнопку с тегом {t}.', 'So choose the button with the {t} tag.'),
    done: L3("Inspektorga qarab, kodga qaysi qism qo'shilganini endi o'zingiz aytib bera olasiz. Endi bu qismlar nimaga kerakligini bilib olamiz.", 'Теперь по Инспектору ты понимаешь, какую часть добавили в код. Дальше посмотрим, зачем вообще нужны эти части.', 'Now you can tell from the Inspector which part was added to the code. Next, let’s see why these parts are needed at all.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After')
  },
  s11: {
    eyebrow: L3('Nimaga kerak?', 'Зачем это?', 'Why bother?'),
    say: L3("Sahifaning ko'rinishi o'zgarmasa, bu teglar nimaga kerak o'zi? Ko'zi ko'rmaydigan odam sahifani qanday eshitishini bir tinglab ko'ramiz. Unga sahifani maxsus dastur ovoz chiqarib o'qib beradi.",
      'Если вид страницы не меняется, зачем эти теги? Давай посмотрим на сайт так, как его видит человек с плохим зрением. Ему страницу читает вслух специальная программа.',
      'If the page doesn’t look any different, why do we need these tags? Let’s look at the site the way a person who can’t see well does. A special program reads the page aloud to them.'),
    sayList: L3("Eshitdingizmi? Dastur sahifani qismlarga bo'lib aytib chiqdi: sayt boshi, menyu, asosiy qism va sayt oxiri. Bularning hammasini u aynan biz qo'ygan teglardan bilib oldi.",
      'Смотри, программа называет страницу по частям: верх сайта, меню, главная часть и низ. Всё это она узнаёт именно по этим тегам.',
      'Look, the program names the page’s parts: the top, the menu, the main part and the bottom. It knows all of them from exactly these tags.'),
    sayJump: L3("Endi odam bitta tugmani bosib, to'ppa-to'g'ri asosiy qismga sakrab o'ta oladi. Har safar menyuni boshidan eshitib o'tirishi shart emas.",
      'Теперь человек одной кнопкой может перейти прямо к главной части. Не нужно каждый раз заново слушать меню.',
      'Now the person can jump straight to the main part with one key. They don’t have to listen to the menu from the start every time.'),
    sayWhy: L3("Yana bir foydasi bor: Google ham saytni shu teglar orqali yaxshiroq tushunadi va asosiy matn main ichida ekanini darrov biladi. Siz ham kodni ochsangiz, qayeri nima ekanini bir qarashda ko'rasiz.",
      'Поисковики вроде Google тоже лучше понимают главный текст внутри main. А другие программисты быстрее читают такой код.',
      'Search engines like Google also understand the main text inside main better. And other programmers can read the code faster.'),
    done: L3("Demak, bu teglar saytni odamlar uchun ham, dasturlar uchun ham, Google uchun ham tushunarli qiladi.", 'Значит, эти теги делают сайт понятным для людей, программ и поисковиков.', 'So these tags make a site clear for people, programs and search engines.'),
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
    say: L3("Endi o'z saytingizga o'tamiz! Uning asosi tayyor: header, main va footer joyida turibdi. Oldin sayt oxiriga bitta yozuv yozing, masalan, yil va saytingizning nomini. Keyin «Tayyor»ni bosing.",
      'Теперь сделай части своего сайта. Каркас готов: header, main и footer. Сначала напиши подпись для низа сайта: например, год и название сайта. Потом нажми «Готово».',
      'Now make the parts of your own site. The frame is ready: header, main and footer. First write a line for the bottom of the site: for example, the year and your site’s name. Then tap “Done”.'),
    ok: L3("Saytingizning oxiri tayyor bo'ldi! Endi asosiy qismga o'z bo'limingizni qo'shamiz.", 'Огонь! Низ сайта готов. Теперь добавим свой раздел.', 'Awesome! Your site’s bottom is ready. Now let’s add your own section.'),
    hints: [
      L3("Saytlarning eng pastida odatda nima yozilgan bo'ladi? Shunga o'xshash narsa yozing.", 'Что обычно пишут в самом низу сайта? Это и напиши.', 'What usually goes at the very bottom of a site? Write that.'),
      L3("Ikkala footer tegi tayyor, ularning o'rtasiga o'zingiz yozasiz.", 'Пиши только слова — теги footer на месте.', 'Type only words: the footer tags are in place.'),
      L3("Masalan, «2026, Mening saytim» deb yozing-da, «Tayyor»ni bosing.", 'Например: 2026, Мой сайт. Потом нажми «Готово».', 'For example: 2026, My site. Then tap “Done”.')
    ],
    ask: L3("Sayt oxiri yozuvini yozing va «Tayyor»ni bosing", 'Напиши подпись низа и нажми «Готово»', 'Type the bottom line and tap “Done”'),
    ph: L3('Masalan: 2026, Mening saytim', 'Например: 2026, Мой сайт', 'For example: 2026, My site'),
    sample: L3('© 2026 Mening saytim', '© 2026 Мой сайт', '© 2026 My site')
  },
  s13: {
    eyebrow: L3("Bo'limingiz", 'Свой раздел', 'Your section'),
    say: L3("Asosiy qismda sizning bo'limingiz uchun joy tayyor. U nima haqida bo'larkin? Bo'limning sarlavhasini h2 ichiga yozing, keyin «Tayyor»ni bosing.",
      'Теперь добавь в главную часть свой раздел. О чём он будет? Впиши его заголовок в h2. Потом нажми «Готово».',
      'Now add your own section to the main part. What will it be about? Type its heading into h2. Then tap “Done”.'),
    ok: L3("Saytingizda o'z bo'limingiz paydo bo'ldi, Inspektor ham uni ramkaga oldi!", 'Отлично! На твоём сайте появился новый раздел.', 'Great! A new section appeared on your site.'),
    hints: [
      L3("Saytingizda nima haqida gapirib bermoqchisiz? O'sha mavzu bo'limning sarlavhasi bo'ladi.", 'О чём хочешь рассказать на сайте? Это и будет заголовком.', 'What do you want to write about on your site? Make that the heading.'),
      L3("h2 teglari allaqachon joyida, ularni yozmang. Faqat sarlavhaning so'zlarini yozing.", 'Пиши только слова — теги на месте.', 'Type only words: the tags are in place.'),
      L3("Masalan, «Mening sevimli kitoblarim» deb yozing-da, «Tayyor»ni bosing.", 'Например: Мои любимые книги. Потом нажми «Готово».', 'For example: My favorite books. Then tap “Done”.')
    ],
    ask: L3("Bo'lim sarlavhasini yozing va «Tayyor»ni bosing", 'Напиши заголовок раздела и нажми «Готово»', 'Type the section heading and tap “Done”'),
    ph: L3('Masalan: Kitoblarim', 'Например: Мои книги', 'For example: My books'),
    sample: L3('Kitoblarim', 'Мои книги', 'My books')
  },
  s14: {
    eyebrow: L3("Sayt boshi yo'qoldi", 'Пропал верх сайта', 'The top is missing'),
    say: L3("Inspektor saytingizning boshini ko'rmayapti, sahifa esa avvalgidek turibdi! Sababi shu: men sayt boshiga boshqa tegni qo'yib yuboribman, shekilli. To'g'ri tegni ushlab, bo'sh joyga olib boring.",
      'Я правил верх твоего сайта и по ошибке написал другой тег. Страница как раньше, но Инспектор не видит верх сайта! Перетащи правильный тег в пустое место.',
      'I was editing the top of your site and wrote the wrong tag by mistake. The page looks the same, but the Inspector can’t see the top of the site! Drag the right tag into the empty spot.'),
    why: {
      head: L3("Voy, men ham aynan shuni yozib qo'ygan edim-ku! head sahifa haqidagi ko'rinmas ma'lumotlar uchun kerak, uni body ichiga qo'yib bo'lmaydi.", 'head — для невидимых сведений о странице, внутрь body его не ставят.', 'head is for invisible information about the page and doesn’t go inside body.'),
      h1: L3("h1 bor-yo'g'i bitta sarlavha yasaydi, u esa ichkarida allaqachon turibdi. Butun sayt boshini o'rash uchun boshqa teg kerak.", 'h1 — это заголовок, он уже внутри. Для всего верха сайта нужен другой тег.', 'h1 is a heading, and it’s already inside. The whole top of the site needs a different tag.')
    },
    // Ступени подсказки (05.11.2026): 1 — посмотреть на Инспектор, 2 — правило, 3 — какой кусок тащить (он загорается).
    hints: [
      L3("Sayt boshida Inspektor ramkasi bormi? Sarlavha bilan menyuni qaysi teg o'rab turishi kerak edi?", 'Посмотри на Инспектор: есть ли рамка у верха сайта? Какой тег должен обернуть заголовок и меню?', 'Look at the Inspector: is there a frame around the top of the site? Which tag should wrap the heading and the menu?'),
      L3("Bizga sahifaning ko'rinadigan boshi kerak: sarlavha bilan menyu turgan joy. head esa ko'rinmas ma'lumotlar uchun bo'ladi.", 'Нам нужен видимый верх страницы, то есть заголовок и меню. А head — для невидимых сведений о странице.', 'We need the visible top of the page, that is, the heading and the menu. head is for invisible information about the page.'),
      L3("Sayt boshini header tegi bildiradi. Yonib turgan header bo'lagini bo'sh joyga qo'ying.", 'Перетащи тег header в пустое место: он обозначает верх сайта.', 'Drag the header tag into the empty spot: it marks the top of the site.')
    ],
    ok: L3("Inspektor sayt boshini yana ko'ra boshladi! Adashganimni tuzatib berdingiz, rahmat!", 'Вот теперь порядок! Инспектор снова видит верх сайта.', 'That’s it! The Inspector sees the top of the site again.'),
    ask: L3("To'g'ri tegni bo'sh joyga olib boring", 'Перетащи правильный тег в пустое место', 'Drag the right tag into the empty spot')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Sizga butunlay yangi sayt tayyorladim, Inspektor ham yoqilgan, lekin kodida bir joy qiyshiq. Ramkalarni sanab chiqing-chi, qaysi biri o'z joyida emas? Buzilgan qatorni topib, ustiga bosing.",
      'Теперь проверь себя. Вот сайт и Инспектор, но в коде ошибка. Посмотри на Инспектор: какая рамка не на своём месте? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the site and the Inspector, but the code has a bug. Look at the Inspector: which frame is in the wrong place? Find the line with the bug and tap it.'),
    say2: L3("Menyu ramkasi qaytdi! Lekin Inspektorda boshqa bitta ramka butunlay yo'q. Buning sababi kodning qayerida?", 'Класс, первая ошибка найдена! Теперь в Инспекторе одной рамки нет совсем. Что сломано здесь?', 'Great, the first bug is found! Now one frame is missing from the Inspector entirely. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator joyida, undan ramka yaxshi chizilyapti. Inspektordagi boshqa ramkalarga qarang: qaysi biri o'z o'rnida emas?", 'Эта строка в порядке. Посмотри на Инспектор: какая рамка не на месте?', 'This line is fine. Look at the Inspector: which frame is out of place?'),
    found: {
      nav: L3("Mana, adashgan nav! U menyuni emas, sarlavhani o'rab olgan. Menyu atrofida nav umuman yo'q edi.", 'Есть! nav обернули вокруг заголовка, а не меню. А меню осталось без nav.', 'Found it! nav was wrapped around the heading instead of the menu. And the menu was left without nav.'),
      typo: L3("Ushladingiz! footer so'zi chala yozilgan. Brauzer bunday tegni tanimaydi, shuning uchun sayt oxirining ramkasi chiqmagan edi.", 'Есть! В слове footer пропала буква. Браузер не знает такого тега, поэтому низа сайта не было видно.', 'Found it! A letter was missing from the word footer. The browser doesn’t know that tag, so the bottom of the site wasn’t visible.')
    },
    hints: {
      nav: [
        L3("nav ramkasini topdingizmi? U Inspektorda nimani o'rab turibdi?", 'Посмотри на Инспектор: что обведено рамкой nav?', 'Look at the Inspector: what does the nav frame go around?'),
        L3("nav faqat menyu havolalarini o'raydi. Sarlavha esa uning ishi emas.", 'nav — для ссылок меню. А заголовок — не nav.', 'nav is for the menu links. The heading isn’t nav.'),
        L3("Sarlavha yozilgan qatorga qarang: uni qaysi teg o'rab turibdi?", 'Посмотри на строку заголовка: какой тег вокруг него?', 'Look at the heading line: which tag is around it?')
      ],
      typo: [
        L3("Inspektordagi ramkalarni bittalab sanab chiqing: qaysi qismda ramka yo'q?", 'Посмотри на Инспектор: у какой части нет рамки?', 'Look at the Inspector: which part has no frame?'),
        L3("Endi sayt oxiri tegini sekin, harfma-harf o'qib chiqing.", 'Прочитай тег низа сайта буква за буквой.', 'Read the bottom-of-the-site tag letter by letter.'),
        L3("Oxirgi qatorni ko'ryapsizmi? footer so'zi u yerda to'liq yozilganmi?", 'Посмотри на последнюю строку: footer написан полностью?', 'Look at the last line: is footer spelled in full?')
      ]
    },
    ok: L3("Sayt oxiri ham o'z ramkasini topdi! Endi har qanday saytni Inspektor bilan o'zingiz tekshira olasiz.", 'Супер! Обе ошибки найдены. Ты проверяешь сайты как настоящий программист.', 'Super! Both bugs are found. You check sites like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi o'zingiz hakam bo'lasiz! Sayt qismlari haqida uchta gap aytaman, ularning hammasi ham rost emas. Eshiting-da, «Rost» yoki «Yolg'on»ni bosing.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("Rostmi yoki yolg'onmi?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки (05.11.2026): 1 — как читать фразу, 2 — правила урока, 3 — причина и ответ (choiceHints).
    hint1: L3("Fikrni o'qing-da, qaysi qism haqida gap ketayotganini toping: header, head yoki main? Pastdagi kodga ham bir qarang.", 'Прочитай фразу по частям: о каком она теге? Посмотри и на код ниже.', 'Read the sentence piece by piece: which tag is it about? Look at the code below too.'),
    hint2: L3("Bu teglar sahifaning ko'rinishiga tegadimi yoki faqat qismlarni nomlaydimi? Fikr shunga mosmi?",
      'Вспомни: части сайта не меняют вид страницы, они только говорят, где какая часть. А head — для невидимых сведений, и main на странице один. Фраза с этим совпадает?',
      'Remember: the parts of a site don’t change how the page looks; they only say which part is where. head is for invisible information, and a page has only one main. Does the sentence match that?'),
    yes: L3("Rost", 'Верно', 'True'),
    no: L3("Yolg'on", 'Неверно', 'False'),
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    items: [
      { t: L3("header tegi sayt boshini rangli qilib qo'yadi.", 'Тег header делает верх сайта цветным.', 'The header tag makes the top of the site colorful.'), right: false, code: 'header',
        why: L3("header saytning ko'rinishiga tegmaydi, u faqat «Bu sayt boshi», deb aytib turadi.", 'header не меняет вид. Он только говорит, что это верх сайта.', 'header doesn’t change how things look. It only says this is the top of the site.') },
      { t: L3("head bilan header bir xil teg bo'ladi.", 'head и header — один и тот же тег.', 'head and header are the same tag.'), right: false, code: 'head',
        why: L3("Nomlari o'xshasa ham, ular boshqa-boshqa teglar: head sahifaning nomi kabi ko'rinmas narsalarni saqlaydi, header esa sahifaning ko'rinadigan boshini o'raydi.", 'head — невидимые сведения о странице, а header — видимый верх страницы.', 'head is invisible information about the page, and header is the visible top of the page.') },
      { t: L3("Sahifada main bitta bo'ladi, section esa bir nechta bo'lishi mumkin.", 'На странице один main, а section может быть несколько.', 'A page has one main, but it can have several sections.'), right: true, code: 'main',
        why: L3("main sahifaning yagona asosiy qismi bo'ladi, uning ichida esa bo'limlar xohlagancha bo'lishi mumkin.", 'main — главная часть страницы, она одна. А разделов внутри может быть много.', 'main is the page’s main part, and there’s only one. But it can hold many sections.') }
    ],
    ok: L3("Uchala fikrning ham tagiga yetdingiz! Endi sayt qismlarini bir-biridan bemalol ajrata olasiz.", 'Всё верно! Ты отлично знаешь части сайта.', 'All correct! You know the parts of a site really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Rang berish kimning ishi edi? Men brauzer o'zi chiroy beradi, deb o'ylagandim, lekin bu safar yanglishibman. Mana, o'sha saytim: sayt boshi rangli bo'lmabdi, sahifa umuman o'zgarmabdi. Siz ham dars davomida ko'rdingiz: header faqat «Bu sayt boshi», deb aytib turadi. Rangni brauzer bermaydi, uni kodga yozish kerak. Bu ishni CSS qiladi, uni keyingi kursda o'rganasiz.",
        'Вернёмся к загадке. Помнишь, я обернул верх сайта в header и думал, что он сам станет цветным? Увы, я ошибся. Смотри, страница совсем не изменилась. header только говорит, что это верх сайта. А цвет и красоту даёт CSS — его ты изучишь в следующем курсе.',
        'Back to our riddle. Remember, I wrapped the top of the site in header and thought it would become colorful by itself? Sadly, I was wrong. Look, the page didn’t change at all. header only says this is the top of the site. Color and style come from CSS, which you’ll learn in the next course.'), k: 'riddle' },
      { text: L3("Mana, endi sizning saytingiz! Unda o'zingiz qo'shgan bo'lim ham, sayt oxiriga yozgan yozuvingiz ham turibdi.", 'Смотри, это твой сайт! В нём твой раздел и твой низ сайта.', 'Look, this is your site! It has your section and your bottom line.'), k: null },
      { text: L3("Esingizdami? header saytning boshini o'rab turadi: unda sarlavha bilan menyu bo'ladi.", 'header — верх сайта.', 'header is the top of the site.'), k: 'header' },
      { text: L3("Menyuni esa nav o'raydi, u header ichida yashaydi.", 'nav — для ссылок меню.', 'nav is for the menu links.'), k: 'nav' },
      { text: L3("O'rtada main turadi: u sahifada faqat bitta bo'ladi va eng muhim narsalarni saqlaydi.", 'main — единственная главная часть страницы.', 'main is the page’s one main part.'), k: 'main' },
      { text: L3("main ichida esa section bo'limlari turadi, har birida bitta mavzu bor.", 'section — раздел на одну тему.', 'section is a part about one topic.'), k: 'section' },
      { text: L3("Eng pastda footer: u sayt oxirini bildiradi.", 'А footer — низ сайта.', 'And footer is the bottom of the site.'), k: 'footer' },
      { text: L3("Barakalla, siz saytning hamma qismini o'rganib oldingiz! Tepada header, ichida nav, o'rtada main va bo'limlar, pastda footer: saytingizning kodi endi uyumga o'xshamaydi. Oxirgi darsda shu bilimlarning hammasini bitta loyihaga yig'amiz.", 'Ура! Теперь ты знаешь, как устроены настоящие сайты. На следующем уроке соберёшь всё, что знаешь, в свой финальный проект. До встречи!', 'Hooray! Now you know how real websites are built. Next time you’ll put everything you know together into your own final project. See you!'), k: null }
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
