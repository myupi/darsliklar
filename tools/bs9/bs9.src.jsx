// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 10 — «Menu и Dialog»
// (облик «Редактор», как уроки 1–8 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs9/build.mjs → lessons/bootstrap/10-menu-i-dialog.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 9 · «Menu и Dialog» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). На странице кружка ссылки разделов и правила стоят кучей. Ученик прячет их в меню и окно Bootstrap 6:
// кнопка data-bs-toggle="menu" и соседний <div class="menu"> с menu-item (menu-header, menu-divider); родной
// <dialog class="dialog" id="qoidalar"> с dialog-header / dialog-body / dialog-footer, кнопка data-bs-toggle="dialog" +
// data-bs-target="#qoidalar", закрытие data-bs-dismiss="dialog", щелчок по фону, data-bs-backdrop="static". Открывает и
// закрывает скрипт Bootstrap (строка script урока 1). В версии 5 — Dropdown и Modal (dropdown-item, data-bs-toggle="modal") —
// одной фразой. Загадка (без имён): Коди думает, что для окна нужна отдельная страница; разгадка — окно в той же странице.
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-10-menu-i-dialog.md.
//
// СИСТЕМА СЛОВ: menu, menu-item, dialog, dialog-header, data-bs-toggle — по-английски; menyu — меню; oyna — окно (dialog);
// bo'lim — раздел; fon — фон (backdrop); yopish — закрыть.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-10-menu-i-dialog',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '10-dars. Menu va Dialog',
    ru: 'Урок 10. Menu и Dialog',
    en: 'Lesson 10. Menu and Dialog'
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
  next: L3('Yakuniy loyiha', 'Финальный проект', 'Final project'),
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
    sections: L3("Bo'limlar", 'Разделы', 'Sections'),
    g1: L3('Robototexnika', 'Робототехника', 'Robotics'),
    g2: L3('Dasturlash', 'Программирование', 'Coding'),
    g3: L3('3D modellash', '3D-моделирование', '3D modeling'),
    courses: L3('Kurslar', 'Курсы', 'Courses'),
    contact: L3('Aloqa', 'Контакты', 'Contacts'),
    rulesBtn: L3('Qoidalar', 'Правила', 'Rules'),
    rulesTitle: L3("To'garak qoidalari", 'Правила кружка', 'Club rules'),
    rulesText: L3("Darsga 5 daqiqa oldin keling. Robotlarni ehtiyot qiling.", 'Приходи за 5 минут до занятия. Береги роботов.', 'Come 5 minutes before class. Take care of the robots.'),
    ok: L3('Tushunarli', 'Понятно', 'Got it')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga yozing.", 'Впиши в пустое место.', 'Type into the empty spot.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские.', 'Latin letters are needed here. Bootstrap’s words are English.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      native: L3("Bootstrap o'z so'zlarini biladi. Inglizcha so'zni saytdan oling.", 'Bootstrap знает свои слова. Возьми английское слово с сайта.', 'Bootstrap knows its own words. Take the English word from the site.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      typo: L3("Harflarni tekshiring. To'g'risi: {w}.", 'Проверь буквы. Правильно: {w}.', 'Check the letters. It’s spelled {w}.'),
      old: L3("Bu eski nom, beshinchi versiyadan. Oltinchisida: {w}.", 'Это старое имя из пятой версии. В шестой: {w}.', 'That’s an old name from version five. In version six: {w}.'),
      fam: L3("{w} boshqa narsa uchun. Bu yerga boshqa so'z kerak.", '{w} — для другой вещи. Сюда нужно другое слово.', '{w} is for something else. This spot needs another word.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas.", 'Bootstrap это слово знает, но результат не как в образце.', 'Bootstrap knows that word, but the result isn’t like the goal.'),
      unknown: L3("Bootstrap {w} so'zini bilmaydi, shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает слова {w}, поэтому ничего не изменилось.', 'Bootstrap doesn’t know the word {w}, so nothing changed.'),
      noHash: L3("id-ga ishora qilganda oldiga panjara qo'yiladi: {w}. Busiz tugma oynani topmaydi.", 'Когда указываешь на id, впереди ставится решётка: {w}. Без неё кнопка не найдёт окно.', 'Pointing to an id needs a hash in front: {w}. Without it the button won’t find the window.'),
      otherId: L3("Bunday id yo'q. Oynaning id-si dialog qatorida: {w}.", 'Такого id нет. id окна — в строке dialog: {w}.', 'There’s no such id. The window’s id is on the dialog line: {w}.'),
      dotTarget: L3("Nuqta class uchun. id-ga panjara bilan ishora qilinadi: {w}.", 'Точка — для class. На id указывают решёткой: {w}.', 'A dot is for class. An id is pointed to with a hash: {w}.'),
      otherUi: L3("Bu boshqa narsani ochadi. Bu yerga kerakli so'z: {w}.", 'Это слово открывает другую вещь. Сюда нужно: {w}.', 'That word opens something else. This spot needs: {w}.'),
      uiWord: L3("Bootstrap qisqa inglizcha so'zni kutadi: {w}.", 'Bootstrap ждёт короткое английское слово: {w}.', 'Bootstrap expects a short English word: {w}.')
    }
  },
  s1: {
    eyebrow: L3("Tartibsiz sahifa", 'Беспорядок на странице', 'A messy page'),
    say: L3("Salom! Sahifada bo'limlar ro'yxati va to'garak qoidalari hammasi ochiq turibdi. Sahifa tiqilib qoldi, kerakli narsani topish qiyin. Saytlarda bunday narsalar odatda yashirin turadi va tugmani bossangiz chiqadi. «Bootstrap bilan» tugmasini bosing.",
      'Привет! На странице открыты и список разделов, и правила кружка. Всё в куче, нужное найти трудно. На сайтах такое обычно спрятано и появляется по нажатию кнопки. Нажми «С Bootstrap».',
      'Hi! The page shows the section list and the club rules all at once. It’s cluttered and hard to find things. Websites usually hide such things until you tap a button. Tap “With Bootstrap”.'),
    magic: L3("Voy! Endi sahifada faqat ikkita tugma. Bo'limlar tugmasi menyuni ochadi, Qoidalar tugmasi esa oynani. Bosib ko'ring!",
      'Ого! Теперь на странице только две кнопки. «Разделы» открывает меню, а «Правила» — окно. Нажми и проверь!',
      'Whoa! Now the page has just two buttons. Sections opens a menu, and Rules opens a window. Tap them and see!'),
    done: L3("Bugun menyu va oyna yasaymiz. Lekin oldin topishmoq. Menimcha, oyna ochilishi uchun alohida yangi sahifa yasash kerak, xuddi boshqa saytga o'tgandek. Siz nima deb o'ylaysiz? Javobni dars oxirida topamiz.",
      'Сегодня делаем меню и окно. Но сначала загадка. По-моему, чтобы открылось окно, нужно делать отдельную новую страницу, будто переходишь на другой сайт. Как думаешь? Ответ найдём в конце урока.',
      'Today we make a menu and a window. But first, a riddle. I think for a window to open you need a separate new page, as if going to another site. What do you think? We’ll find out at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('Menu · Dialog', 'Menu · Dialog', 'Menu · Dialog')
  },
  s2: {
    eyebrow: L3('Menyu', 'Меню', 'Menu'),
    help: [
      L3("Kodda menu va menu-item so'zlariga, keyin tugmadagi data-bs-toggle-ga qarang.", 'Посмотри на слова menu и menu-item в коде, потом на data-bs-toggle у кнопки.', 'Look at menu and menu-item in the code, then data-bs-toggle on the button.'),
      L3("menu ro'yxatni yashiradi. Tugmada data-bs-toggle menu bo'lsa, Bootstrap skripti ro'yxatni tugma ostida ochadi. Bo'limni tanlasangiz, menyu yopiladi.", 'menu прячет список. Если у кнопки data-bs-toggle равен menu, скрипт Bootstrap открывает список под кнопкой. Выбрал раздел — меню закрылось.', 'menu hides the list. If the button has data-bs-toggle menu, Bootstrap’s script opens the list under the button. Pick a section and the menu closes.'),
      L3("Bu oshxonadagi menyuga o'xshaydi: kerak bo'lganda ochasiz, tanlaysiz va yopasiz.", 'Это как меню в кафе: открыл, выбрал, закрыл.', 'It’s like a café menu: open it, choose, close it.')
    ],
    say: L3("Avval menyu. Hozir bo'limlar ro'yxati sahifada ochiq. Qarang.", 'Сначала меню. Сейчас список разделов открыт прямо на странице. Смотри.', 'First the menu. Right now the section list is open on the page. Watch.'),
    sayMenu: L3("Ro'yxatga menu, har bir bo'limga menu-item yozdim. Ro'yxat yashirindi! menu uni yashirib turadi, kerak bo'lganda ochiladi.", 'Списку написал menu, каждому разделу — menu-item. Список спрятался! menu держит его скрытым, пока он не понадобится.', 'I gave the list menu and each section menu-item. The list hid! menu keeps it hidden until it’s needed.'),
    sayOpen: L3("Tugmaga data-bs-toggle menu yozdim va pastga script qatorini qo'ydim. Tugmani bosdim, menyu tugma ostida ochildi!", 'Кнопке написал data-bs-toggle menu, а внизу добавил строку script. Нажал кнопку — меню открылось под ней!', 'I gave the button data-bs-toggle menu and added the script line at the bottom. I tapped the button and the menu opened under it!'),
    sayPick: L3("Dasturlash bo'limini tanladim, menyu o'zi yopildi.", 'Выбрал раздел «Программирование» — меню само закрылось.', 'I picked Coding, and the menu closed by itself.'),
    done: L3("Eslab qoling: tugmaga data-bs-toggle menu, ro'yxatga menu, bo'limlarga menu-item.", 'Запомни: кнопке — data-bs-toggle menu, списку — menu, разделам — menu-item.', 'Remember: the button gets data-bs-toggle menu, the list gets menu, the items get menu-item.'),
    askStart: L3("Qarang: ro'yxat ochiq", 'Смотри: список открыт', 'Watch: the list is open'),
    askMenu: L3('Qarang: menu · menu-item', 'Смотри: menu · menu-item', 'Watch: menu · menu-item'),
    askOpen: L3('Qarang: data-bs-toggle', 'Смотри: data-bs-toggle', 'Watch: data-bs-toggle'),
    askPick: L3("Qarang: bo'lim tanlandi", 'Смотри: раздел выбран', 'Watch: a section is picked'),
    askDone: L3('data-bs-toggle menu · menu · menu-item', 'data-bs-toggle menu · menu · menu-item', 'data-bs-toggle menu · menu · menu-item')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz. Sahifadagi Bo'limlar tugmasini bosing va ikkita har xil bo'limni tanlang.", 'Теперь сам. Нажми на странице кнопку «Разделы» и выбери два разных раздела.', 'Now you. Tap Sections on the page and pick two different sections.'),
    picked: L3("{w} tanlandi.", 'Выбран раздел «{w}».', '{w} picked.'),
    other: L3("Boshqa bo'limni tanlab ko'ring.", 'Попробуй другой раздел.', 'Try another section.'),
    more: L3("Menyuni yana oching va boshqa bo'limni tanlang.", 'Открой меню ещё раз и выбери другой раздел.', 'Open the menu again and pick another section.'),
    ok: L3("Ajoyib! Menyu ochiladi, tanlanadi va o'zi yopiladi.", 'Отлично! Меню открывается, выбираешь — и оно само закрывается.', 'Great! The menu opens, you pick, and it closes by itself.'),
    done: L3("Endi menyuni Bootstrap saytidan olamiz.", 'Теперь возьмём меню с сайта Bootstrap.', 'Now let’s take a menu from the Bootstrap site.'),
    hints: [
      L3("Sahifadagi ko'k Bo'limlar tugmasini bosing.", 'Нажми синюю кнопку «Разделы» на странице.', 'Tap the blue Sections button on the page.'),
      L3("Ochilgan ro'yxatdan bitta bo'limni bosing.", 'В открывшемся списке нажми раздел.', 'Tap a section in the list that opens.'),
      L3("Keyin yana oching va boshqasini bosing.", 'Потом открой снова и нажми другой.', 'Then open it again and tap another.')
    ],
    ask: L3("Bo'limlar tugmasini bosing va ikkita bo'limni tanlang", 'Нажми «Разделы» и выбери два раздела', 'Tap Sections and pick two sections'),
    askDone: L3("Menyu ishlaydi", 'Меню работает', 'The menu works')
  },
  g1: {
    eyebrow: L3('Menu sahifasi', 'Страница Menu', 'The Menu page'),
    help: [
      L3("Menyudagi Components bo'limiga, Menu sahifasiga va nusxa olish belgisiga qarang.", 'Посмотри на раздел Components, страницу Menu и значок копирования.', 'Look at Components, the Menu page and the copy icon.'),
      L3("Misolda tugma va ro'yxat. Nusxalagach, tugma va bo'limlar yozuvini o'zimizga moslaymiz.", 'В примере — кнопка и список. После копирования меняем надписи кнопки и разделов под себя.', 'The example has a button and a list. After copying we change the button and item labels.'),
      L3("Bu tayyor shkafga o'xshaydi: tortmalarga o'z narsalaringizni joylaysiz.", 'Это как готовый шкаф: раскладываешь по ящикам свои вещи.', 'It’s like a ready-made cabinet: you put your own things in the drawers.')
    ],
    say: L3("Menyuni saytdan olamiz. U Components bo'limida. Qarang.", 'Меню возьмём с сайта. Оно в разделе Components. Смотри.', 'Let’s take the menu from the site. It’s in Components. Watch.'),
    sayPage: L3("Menu sahifasi. Overview misoli: tugma va uchta bo'lim. Nusxa olamiz.", 'Страница Menu. Пример Overview: кнопка и три пункта. Копируем.', 'The Menu page. The Overview example: a button and three items. Let’s copy it.'),
    sayPaste: L3("Kodni body ichiga qo'ydim. Yozuvlar inglizcha: Toggle menu va Menu item.", 'Вставил код в body. Надписи английские: Toggle menu и Menu item.', 'I pasted the code into body. The labels are English: Toggle menu and Menu item.'),
    sayText: L3("Yozuvlarni o'zimiznikiga almashtirdim: Bo'limlar, Robototexnika, Dasturlash va 3D modellash.", 'Поменял надписи на свои: Разделы, Робототехника, Программирование и 3D-моделирование.', 'I changed the labels to ours: Sections, Robotics, Coding and 3D modeling.'),
    sayOpen: L3("Tugmani bosdim, menyu ochildi! Pastda birinchi darsdagi script qatori bor, shuning uchun ishlaydi.", 'Нажал кнопку — меню открылось! Внизу есть строка script с первого урока, поэтому работает.', 'I tapped the button and the menu opened! The script line from lesson one is at the bottom, so it works.'),
    done: L3("Eslab qoling: menyu Components bo'limida, Menu sahifasida.", 'Запомни: меню — в разделе Components, на странице Menu.', 'Remember: the menu is in Components, on the Menu page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Menu', 'Смотри: Components → Menu', 'Watch: Components → Menu'),
    askPage: L3('Qarang: Overview', 'Смотри: Overview', 'Watch: Overview'),
    askPaste: L3("Qarang: body ichiga qo'yildi", 'Смотри: вставлено в body', 'Watch: pasted into body'),
    askText: L3("Qarang: o'z yozuvlarimiz", 'Смотри: свои надписи', 'Watch: our own labels'),
    askOpen: L3("Qarang: menyu ochildi", 'Смотри: меню открылось', 'Watch: the menu opened'),
    askDone: L3('Components → Menu', 'Components → Menu', 'Components → Menu')
  },
  t1: {
    eyebrow: L3("Menyuni yig'ing", 'Собери меню', 'Build the menu'),
    say: L3("Endi o'zingiz. Kodga qarang va bo'sh joyga kerakli so'zni yozing. Keyin sahifada tugmani bosib tekshiring.", 'Теперь сам. Посмотри на код и впиши в пустое место нужное слово. Потом проверь кнопку на странице.', 'Now you. Look at the code and type the right word into the empty spot. Then test the button on the page.'),
    ask1: L3("Ro'yxat yashirinsin", 'Спрячь список', 'Hide the list'),
    ask2: L3("Uchinchi bo'lim ham menyu bandi bo'lsin", 'Третий раздел — тоже пункт меню', 'Make the third section a menu item too'),
    ask3: L3("Tugma menyuni ochsin", 'Кнопка открывает меню', 'Make the button open the menu'),
    hints1: [
      L3("Ro'yxatni qaysi so'z yashiradi?", 'Какое слово прячет список?', 'Which word hides the list?'),
      L3("Menyu inglizcha ham shunday.", 'Меню по-английски так же.', 'Menu is the same in English.'),
      L3("Yozing: menu", 'Впиши: menu', 'Type: menu')
    ],
    hints2: [
      L3("Qolgan ikki bo'limda qaysi so'z bor?", 'Какое слово у двух других разделов?', 'Which word do the other two sections have?'),
      L3("menu va item, ya'ni band degani.", 'menu и item, то есть «пункт».', 'menu and item.'),
      L3("Yozing: menu-item", 'Впиши: menu-item', 'Type: menu-item')
    ],
    hints3: [
      L3("Tugma nimani ochishi kerak?", 'Что должна открыть кнопка?', 'What should the button open?'),
      L3("Menyuni. Inglizchasi ham menu.", 'Меню. По-английски тоже menu.', 'The menu. In English it’s menu too.'),
      L3("Yozing: menu", 'Впиши: menu', 'Type: menu')
    ],
    why1: L3("menu ro'yxatni yashirdi.", 'menu спрятал список.', 'menu hid the list.'),
    why2: L3("menu-item uchinchi bo'limni ham menyu bandi qildi.", 'menu-item сделал и третий раздел пунктом меню.', 'menu-item made the third section a menu item too.'),
    why3: L3("data-bs-toggle menu tugmaga menyuni ochishni o'rgatdi.", 'data-bs-toggle menu научил кнопку открывать меню.', 'data-bs-toggle menu taught the button to open the menu.'),
    done: L3("Qoyil! Menyu tayyor. Sahifada tugmani bosib ko'ring.", 'Класс! Меню готово. Нажми кнопку на странице.', 'Nice! The menu is ready. Tap the button on the page.')
  },
  s6: {
    eyebrow: L3('Sarlavha va chiziq', 'Заголовок и черта', 'Header and divider'),
    help: [
      L3("Menyudagi menu-header va menu-divider qatorlariga qarang.", 'Посмотри на строки menu-header и menu-divider в меню.', 'Look at the menu-header and menu-divider lines.'),
      L3("menu-header — menyu ichidagi kichik kulrang sarlavha. menu-divider — bo'limlar orasidagi chiziq.", 'menu-header — маленький серый заголовок внутри меню. menu-divider — черта между пунктами.', 'menu-header is a small gray title inside the menu. menu-divider is a line between items.'),
      L3("Bu kitob mundarijasiga o'xshaydi: boblar sarlavhasi bor, qismlar chiziq bilan ajratilgan.", 'Это как оглавление книги: есть названия глав, части разделены чертой.', 'It’s like a book’s contents: chapter titles, and parts split by lines.')
    ],
    say: L3("Menyuni chiroyliroq qilamiz. Ko'rish oson bo'lishi uchun uni ochiq qoldirdik: show va position-static, xuddi saytdagi misollardek. Qarang.", 'Сделаем меню красивее. Чтобы было видно, оставили его открытым: show и position-static, как в примерах на сайте. Смотри.', 'Let’s make the menu nicer. To see it, we left it open with show and position-static, like the site examples. Watch.'),
    sayHdr: L3("Tepaga h6 qatorini qo'shdim, class-i menu-header. Bu menyuning sarlavhasi: Kurslar.", 'Сверху добавил строку h6 с class menu-header. Это заголовок меню: Курсы.', 'I added an h6 on top with class menu-header. It’s the menu’s title: Courses.'),
    sayDiv: L3("Pastga hr qatorini qo'shdim, class-i menu-divider. U chiziq tortdi, undan keyin Aloqa bandi.", 'Снизу добавил строку hr с class menu-divider. Она провела черту, а за ней — пункт «Контакты».', 'I added an hr with class menu-divider. It drew a line, followed by the Contacts item.'),
    done: L3("Eslab qoling: menu-header — sarlavha, menu-divider — chiziq.", 'Запомни: menu-header — заголовок, menu-divider — черта.', 'Remember: menu-header is a title, menu-divider is a line.'),
    askStart: L3('Qarang: ochiq menyu', 'Смотри: открытое меню', 'Watch: an open menu'),
    askHdr: L3('Qarang: menu-header', 'Смотри: menu-header', 'Watch: menu-header'),
    askDiv: L3('Qarang: menu-divider', 'Смотри: menu-divider', 'Watch: menu-divider'),
    askDone: L3('menu-header · menu-divider', 'menu-header · menu-divider', 'menu-header · menu-divider')
  },
  t2: {
    eyebrow: L3('Menyuni bezang', 'Укрась меню', 'Style the menu'),
    say: L3("Namunaga qarang va bo'sh joyga kerakli so'zni yozing.", 'Посмотри на образец и впиши в пустое место нужное слово.', 'Look at the goal and type the right word into the empty spot.'),
    ask1: L3("Kurslar sarlavha bo'lsin", '«Курсы» — заголовок', 'Make Courses a header'),
    ask2: L3("Aloqa ham menyu bandi bo'lsin", '«Контакты» — тоже пункт меню', 'Make Contacts a menu item too'),
    hints1: [
      L3("h6 menyuning sarlavhasi. Uning class-i qanday?", 'h6 — заголовок меню. Какой у него class?', 'h6 is the menu’s title. What’s its class?'),
      L3("menu va header, ya'ni sarlavha degani.", 'menu и header, то есть «заголовок».', 'menu and header.'),
      L3("Yozing: menu-header", 'Впиши: menu-header', 'Type: menu-header')
    ],
    hints2: [
      L3("Qolgan bandlarda qaysi class bor?", 'Какой class у других пунктов?', 'Which class do the other items have?'),
      L3("menu va item, ya'ni band degani.", 'menu и item, то есть «пункт».', 'menu and item.'),
      L3("Yozing: menu-item", 'Впиши: menu-item', 'Type: menu-item')
    ],
    why1: L3("menu-header Kurslarni sarlavha qildi.", 'menu-header сделал «Курсы» заголовком.', 'menu-header made Courses a header.'),
    why2: L3("menu-item Aloqani ham menyu bandi qildi.", 'menu-item сделал «Контакты» пунктом меню.', 'menu-item made Contacts a menu item.'),
    done: L3("Zo'r! Menyuda sarlavha ham, chiziq ham, barcha bandlar ham bor.", 'Огонь! В меню есть заголовок, черта и все пункты.', 'Awesome! The menu has a header, a line and all the items.')
  },
  s8: {
    eyebrow: L3('Oyna', 'Окно', 'Dialog'),
    help: [
      L3("Kodda dialog qatoriga, tugmadagi data-bs-toggle va data-bs-target-ga qarang.", 'Посмотри на строку dialog и на data-bs-toggle и data-bs-target у кнопки.', 'Look at the dialog line and data-bs-toggle and data-bs-target on the button.'),
      L3("dialog — brauzerning o'z oynasi, u yopiq turadi. Tugmada data-bs-toggle dialog va data-bs-target panjara bilan id bo'lsa, Bootstrap oynani ochadi. Krestik data-bs-dismiss bilan yopadi.", 'dialog — собственное окно браузера, оно закрыто. Если у кнопки data-bs-toggle dialog и data-bs-target с решёткой и id, Bootstrap открывает окно. Крестик с data-bs-dismiss закрывает.', 'dialog is the browser’s own window, closed by default. If the button has data-bs-toggle dialog and data-bs-target with a hash and the id, Bootstrap opens it. The cross with data-bs-dismiss closes it.'),
      L3("Bu muzlatkichga o'xshaydi: ovqat ichida bor, eshikni ochsangiz ko'rinadi.", 'Это как холодильник: еда внутри есть, видно её, когда откроешь дверцу.', 'It’s like a fridge: the food is inside, you see it when you open the door.')
    ],
    say: L3("Endi oyna. Qoidalar matni dialog ichida. Sahifada esa faqat tugma. Qarang.", 'Теперь окно. Текст правил внутри dialog. А на странице только кнопка. Смотри.', 'Now the window. The rules are inside dialog. The page shows only a button. Watch.'),
    sayDead: L3("Tugmani bosdim, hech narsa bo'lmadi. Oyna sahifada bor, lekin tugma uni bilmaydi.", 'Нажал кнопку — ничего. Окно на странице есть, но кнопка о нём не знает.', 'I tapped the button and nothing happened. The window is on the page, but the button doesn’t know about it.'),
    sayOpen: L3("Tugmaga data-bs-toggle dialog va data-bs-target qoidalar yozdim, panjara bilan. Bosdim, oyna ochildi, orqasi xiralashdi!", 'Кнопке написал data-bs-toggle dialog и data-bs-target qoidalar, с решёткой. Нажал — окно открылось, фон затемнился!', 'I gave the button data-bs-toggle dialog and data-bs-target qoidalar, with a hash. I tapped it, the window opened and the background dimmed!'),
    sayClose: L3("Krestikni bosdim, oyna yopildi. Krestikda data-bs-dismiss dialog yozilgan, ya'ni oynani yop degani.", 'Нажал крестик — окно закрылось. У крестика data-bs-dismiss dialog, то есть «закрой окно».', 'I tapped the cross and the window closed. The cross has data-bs-dismiss dialog, meaning close the window.'),
    done: L3("Eslab qoling: tugmaga data-bs-toggle dialog va data-bs-target, yopishga data-bs-dismiss dialog.", 'Запомни: кнопке — data-bs-toggle dialog и data-bs-target, для закрытия — data-bs-dismiss dialog.', 'Remember: the button gets data-bs-toggle dialog and data-bs-target, closing uses data-bs-dismiss dialog.'),
    askStart: L3('Qarang: dialog yopiq', 'Смотри: dialog закрыт', 'Watch: dialog is closed'),
    askDead: L3('Qarang: tugma ishlamadi', 'Смотри: кнопка молчит', 'Watch: the button is dead'),
    askOpen: L3('Qarang: oyna ochildi', 'Смотри: окно открылось', 'Watch: the window opened'),
    askClose: L3('Qarang: data-bs-dismiss', 'Смотри: data-bs-dismiss', 'Watch: data-bs-dismiss'),
    askDone: L3('data-bs-toggle dialog · data-bs-target', 'data-bs-toggle dialog · data-bs-target', 'data-bs-toggle dialog · data-bs-target')
  },
  g2: {
    eyebrow: L3('Dialog sahifasi', 'Страница Dialog', 'The Dialog page'),
    help: [
      L3("Components bo'limidagi Dialog sahifasiga va Example misoliga qarang.", 'Посмотри на страницу Dialog в разделе Components и на пример Example.', 'Look at the Dialog page in Components and the Example.'),
      L3("Misolda tugma va dialog: sarlavha, matn, pastda tugmalar. Nusxalagach, sarlavhani o'zimiznikiga almashtiramiz.", 'В примере — кнопка и dialog: заголовок, текст, кнопки внизу. После копирования меняем заголовок на свой.', 'The example has a button and a dialog: a title, text and buttons below. After copying we change the title to ours.'),
      L3("Bu tayyor xat konvertiga o'xshaydi: o'z xatingizni yozasiz.", 'Это как готовый конверт: пишешь своё письмо.', 'It’s like a ready envelope: you write your own letter.')
    ],
    say: L3("Oynani ham saytdan olamiz. Qarang.", 'Окно тоже возьмём с сайта. Смотри.', 'Let’s take the window from the site too. Watch.'),
    sayPage: L3("Dialog sahifasi. Example misoli: tugma va oyna. Oltinchi versiyada oyna brauzerning o'z dialog teg ida qurilgan. Nusxa olamiz.", 'Страница Dialog. Пример Example: кнопка и окно. В шестой версии окно построено на собственном теге браузера dialog. Копируем.', 'The Dialog page. The Example: a button and a window. In version six the window is built on the browser’s own dialog tag. Let’s copy it.'),
    sayPaste: L3("Kodni body ichiga qo'ydim. Sarlavha inglizcha: Dialog title.", 'Вставил код в body. Заголовок английский: Dialog title.', 'I pasted the code into body. The title is English: Dialog title.'),
    sayTitle: L3("Dialog title so'zlarini belgilab, o'rniga yozdim: To'garak qoidalari.", 'Выделил Dialog title и написал вместо этого: Правила кружка.', 'I selected Dialog title and typed instead: Club rules.'),
    sayOpen: L3("Tugmani bosdim, oyna ochildi, sarlavha bizniki!", 'Нажал кнопку — окно открылось, заголовок наш!', 'I tapped the button: the window opened with our title!'),
    done: L3("Eslab qoling: oyna Components bo'limida, Dialog sahifasida. Eski darslarda u Modal deb atalgan.", 'Запомни: окно — в разделе Components, на странице Dialog. В старых уроках оно называлось Modal.', 'Remember: the window is in Components, on the Dialog page. Old tutorials call it Modal.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Dialog', 'Смотри: Components → Dialog', 'Watch: Components → Dialog'),
    askPage: L3('Qarang: Example', 'Смотри: Example', 'Watch: Example'),
    askPaste: L3("Qarang: body ichiga qo'yildi", 'Смотри: вставлено в body', 'Watch: pasted into body'),
    askTitle: L3("Qarang: o'z sarlavhamiz", 'Смотри: свой заголовок', 'Watch: our own title'),
    askOpen: L3("Qarang: oyna ochildi", 'Смотри: окно открылось', 'Watch: the window opened'),
    askDone: L3('Components → Dialog', 'Components → Dialog', 'Components → Dialog')
  },
  t3: {
    eyebrow: L3('Oynani sozlang', 'Настрой окно', 'Set up the window'),
    say: L3("Kodga qarang va bo'sh joyga kerakli so'zni yozing. Keyin sahifada tugmani bosib tekshiring.", 'Посмотри на код и впиши в пустое место нужное слово. Потом проверь на странице.', 'Look at the code and type the right word into the empty spot. Then test it on the page.'),
    ask1: L3("Tugma Qoidalar oynasini ochsin", 'Кнопка открывает окно правил', 'Make the button open the rules window'),
    ask2: L3("Krestik oynani yopsin", 'Крестик закрывает окно', 'The cross closes the window'),
    ask3: L3("Matn oyna chetiga yopishmasin", 'Текст не прилипает к краю окна', 'Keep the text off the window’s edge'),
    hints1: [
      L3("Oynaning id-si qanday?", 'Какой id у окна?', 'What’s the window’s id?'),
      L3("Panjara va id: #qoidalar.", 'Решётка и id: #qoidalar.', 'A hash and the id: #qoidalar.'),
      L3("Yozing: #qoidalar", 'Впиши: #qoidalar', 'Type: #qoidalar')
    ],
    hints2: [
      L3("Pastki tugmada data-bs-dismiss nima?", 'Что у нижней кнопки в data-bs-dismiss?', 'What does the bottom button have in data-bs-dismiss?'),
      L3("Nimani yopadi? Oynani, ya'ni dialog.", 'Что закрываем? Окно, то есть dialog.', 'What do we close? The window, the dialog.'),
      L3("Yozing: dialog", 'Впиши: dialog', 'Type: dialog')
    ],
    hints3: [
      L3("Oynaning uch qismi: header, body va footer.", 'У окна три части: header, body и footer.', 'The window has three parts: header, body and footer.'),
      L3("Asosiy qism inglizcha body, oldida dialog.", 'Основная часть — body, впереди dialog.', 'The main part is body, with dialog in front.'),
      L3("Yozing: dialog-body", 'Впиши: dialog-body', 'Type: dialog-body')
    ],
    why1: L3("#qoidalar tugmaga oynani ko'rsatdi.", '#qoidalar показал кнопке окно.', '#qoidalar pointed the button at the window.'),
    why2: L3("data-bs-dismiss dialog krestikka oynani yopishni o'rgatdi.", 'data-bs-dismiss dialog научил крестик закрывать окно.', 'data-bs-dismiss dialog taught the cross to close the window.'),
    why3: L3("dialog-body matnga joy va chiroyli chekka berdi.", 'dialog-body дал тексту место и аккуратные поля.', 'dialog-body gave the text room and neat padding.'),
    done: L3("Ajoyib! Oyna ochiladi va yopiladi. Sahifada sinab ko'ring.", 'Отлично! Окно открывается и закрывается. Проверь на странице.', 'Great! The window opens and closes. Try it on the page.')
  },
  s11: {
    eyebrow: L3('Fon', 'Фон', 'Backdrop'),
    help: [
      L3("Oyna ochilganda orqadagi xira fonga va data-bs-backdrop-ga qarang.", 'Посмотри на затемнённый фон за окном и на data-bs-backdrop.', 'Look at the dimmed backdrop and data-bs-backdrop.'),
      L3("Odatda fonni bossangiz oyna yopiladi. data-bs-backdrop static bo'lsa, fon yopmaydi, faqat tugma yoki krestik.", 'Обычно нажатие на фон закрывает окно. Если data-bs-backdrop равен static, фон не закрывает — только кнопка или крестик.', 'Usually tapping the backdrop closes the window. With data-bs-backdrop static it doesn’t; only a button or the cross does.'),
      L3("Bu muhim xatga o'xshaydi: o'qimaguncha yopib bo'lmaydi.", 'Это как важное письмо: пока не прочитаешь, не закроешь.', 'It’s like an important letter: you can’t close it before reading.')
    ],
    say: L3("Oynani yana qanday yopsa bo'ladi? Qarang.", 'Как ещё можно закрыть окно? Смотри.', 'How else can you close the window? Watch.'),
    sayBack: L3("Oynani ochdim va orqadagi xira fonni bosdim. Oyna yopildi!", 'Открыл окно и нажал на затемнённый фон. Окно закрылось!', 'I opened the window and tapped the dim backdrop. It closed!'),
    sayStatic: L3("Tugmaga data-bs-backdrop static yozdim. Endi fonni bossam ham, oyna yopilmayapti.", 'Кнопке написал data-bs-backdrop static. Теперь нажимаю на фон — окно не закрывается.', 'I gave the button data-bs-backdrop static. Now tapping the backdrop doesn’t close the window.'),
    sayBtn: L3("Bunday oynani faqat tugma yoki krestik yopadi. Tushunarli tugmasini bosdim, yopildi.", 'Такое окно закрывает только кнопка или крестик. Нажал «Понятно» — закрылось.', 'Such a window closes only with a button or the cross. I tapped Got it, and it closed.'),
    done: L3("Eslab qoling: fon oynani yopadi, data-bs-backdrop static esa yopishga qo'ymaydi.", 'Запомни: фон закрывает окно, а data-bs-backdrop static не даёт.', 'Remember: the backdrop closes the window, and data-bs-backdrop static prevents it.'),
    askStart: L3('Qarang: oyna', 'Смотри: окно', 'Watch: the window'),
    askBack: L3('Qarang: fon bosildi', 'Смотри: нажали на фон', 'Watch: tapping the backdrop'),
    askStatic: L3('Qarang: static', 'Смотри: static', 'Watch: static'),
    askBtn: L3('Qarang: tugma yopdi', 'Смотри: закрыла кнопка', 'Watch: the button closed it'),
    askDone: L3('data-bs-backdrop static', 'data-bs-backdrop static', 'data-bs-backdrop static')
  },
  x2: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Oynani yopishning uch yo'li bor. Keling, birma-bir sinab ko'ramiz. Avval Qoidalar tugmasini bosing, oyna ochiladi. Keyin to'q sariq ramkadagi krestikni bosing.",
      'У окна есть три способа закрыться. Попробуем по очереди. Сначала нажми «Правила», окно откроется. Потом нажми крестик в оранжевой рамке.',
      'A window can be closed three ways. Let’s try them one by one. First tap Rules, and the window opens. Then tap the cross in the orange frame.'),
    title: L3("Oynani yopishning 3 yo'li", '3 способа закрыть окно', '3 ways to close the window'),
    ways: {
      x: L3("Krestik ✕", 'Крестик ✕', 'The cross ✕'),
      btn: L3("«Tushunarli» tugmasi", 'Кнопка «Понятно»', 'The Got it button'),
      backdrop: L3("Oyna tashqarisi", 'Место вне окна', 'Outside the window')
    },
    open: L3("Qoidalar tugmasini bosing", 'Нажми «Правила»', 'Tap Rules'),
    step: {
      x: L3("✕ krestikni bosing", 'Нажми крестик ✕', 'Tap the cross ✕'),
      btn: L3("«Tushunarli» tugmasini bosing", 'Нажми кнопку «Понятно»', 'Tap the Got it button'),
      backdrop: L3("Oynadan tashqaridagi to'q sariq joyni bosing", 'Нажми на оранжевое место вне окна', 'Tap the orange area outside the window')
    },
    how: {
      x: L3("Krestik bilan yopildi.", 'Закрыто крестиком.', 'Closed with the cross.'),
      btn: L3("Tushunarli tugmasi bilan yopildi.", 'Закрыто кнопкой «Понятно».', 'Closed with the Got it button.'),
      backdrop: L3("Oyna tashqarisini bosdingiz, yopildi.", 'Нажал мимо окна — закрылось.', 'You tapped outside, and it closed.')
    },
    next: {
      x: L3("Endi yana oching va krestikni bosing.", 'Теперь открой снова и нажми крестик.', 'Now open it again and tap the cross.'),
      btn: L3("Endi yana oching va pastdagi Tushunarli tugmasini bosing.", 'Теперь открой снова и нажми внизу «Понятно».', 'Now open it again and tap Got it at the bottom.'),
      backdrop: L3("Endi yana oching va oynadan tashqaridagi to'q sariq joyni bosing.", 'Теперь открой снова и нажми на оранжевое место вне окна.', 'Now open it again and tap the orange area outside the window.')
    },
    same: L3("Bu yo'l bor edi. To'q sariq ramkadagini bosing.", 'Этот способ уже был. Нажми то, что в оранжевой рамке.', 'You’ve done that one. Tap what’s in the orange frame.'),
    ok: L3("Ajoyib! Oynani uch xil yo'l bilan yopa olasiz.", 'Отлично! Ты закрываешь окно тремя способами.', 'Great! You can close the window three ways.'),
    done: L3("Endi oyna kodini tartib bilan yig'amiz.", 'Теперь соберём код окна по порядку.', 'Now let’s build the window code in order.'),
    hints: [
      L3("Sahifadagi Qoidalar tugmasini bosing, oyna ochiladi.", 'Нажми на странице «Правила» — окно откроется.', 'Tap Rules on the page, and the window opens.'),
      L3("Oynada to'q sariq ramkadagi narsani bosing.", 'В окне нажми то, что в оранжевой рамке.', 'In the window, tap what’s in the orange frame.'),
      L3("Chapdagi ro'yxatga qarang: galochkasiz yo'lni sinang.", 'Посмотри на список слева: попробуй способ без галочки.', 'Look at the list: try a way without a tick.')
    ],
    ask: L3("Qoidalarni oching va oynani yoping", 'Открой «Правила» и закрой окно', 'Open Rules and close the window'),
    askDone: L3("Uch yo'l — tayyor", 'Три способа — готово', 'Three ways: done')
  },
  t4: {
    eyebrow: L3("Tartib bilan yig'ing", 'Собери по порядку', 'Build in order'),
    say: L3("Oyna kodini tartib bilan yig'ing: avval ochadigan tugma, keyin oyna. Oyna ichida tepadan pastga: sarlavha, matn, tugmalar.", 'Собери код окна по порядку: сначала кнопка, которая открывает, потом окно. Внутри окна сверху вниз: заголовок, текст, кнопки.', 'Build the window code in order: first the button that opens it, then the window. Inside, top to bottom: header, text, buttons.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order'),
    msgs: {
      tbtn: L3("Oldin oynani ochadigan tugma.", 'Сначала кнопка, которая открывает окно.', 'First the button that opens the window.'),
      dlg: L3("Endi oynaning o'zi: dialog.", 'Теперь само окно: dialog.', 'Now the window itself: dialog.'),
      hdr: L3("Oyna ichida eng tepada sarlavha qismi.", 'Внутри окна сверху — шапка.', 'Inside the window, the header goes on top.'),
      body: L3("Sarlavhadan keyin matn qismi.", 'После шапки — текст.', 'After the header comes the text.'),
      foot: L3("Pastda tugmalar qismi.", 'Внизу — часть с кнопками.', 'At the bottom, the buttons part.'),
      dlgc: L3("Oxirida oynani yopamiz.", 'В конце закрываем окно.', 'Last, close the window.')
    },
    hints: [
      L3("Tugmadan boshlang.", 'Начни с кнопки.', 'Start with the button.'),
      L3("Tartib: tugma, dialog, header, body, footer, yopish.", 'Порядок: кнопка, dialog, header, body, footer, закрытие.', 'The order: button, dialog, header, body, footer, close.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! Oynani sahifada ochib ko'ring.", 'В точку! Открой окно на странице.', 'Spot on! Open the window on the page.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna. Qaysi class shunday chizadi? Variantni tanlang, natija o'ngda chiqadi.", 'Маленькое испытание. Слева образец. Какой class так рисует? Выбери вариант, результат появится справа.', 'A little test. The goal is on the left. Which class draws it? Pick an option, the result shows on the right.'),
    ask: L3('Qaysi class namunani chizadi?', 'Какой class рисует образец?', 'Which class draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Menyu bandlari: menu-item.", 'Пункты меню: menu-item.', 'Menu items: menu-item.'),
      L3("Menyu sarlavhasi: menu-header.", 'Заголовок меню: menu-header.', 'The menu header: menu-header.'),
      L3("Oyna sarlavhasi: dialog-header.", 'Шапка окна: dialog-header.', 'The window header: dialog-header.'),
      L3("Oyna pasti: dialog-footer.", 'Низ окна: dialog-footer.', 'The window footer: dialog-footer.')
    ],
    no: {
      'dropdown-item': L3("Bu eski nom, beshinchi versiyadan: bandlar oddiy havola bo'lib qoldi.", 'Это старое имя из пятой версии: пункты остались простыми ссылками.', 'That’s an old name from version five: the items stayed plain links.'),
      'menu-link': L3("Bunday class yo'q: bandlar oddiy havola bo'lib qoldi.", 'Такого class нет: пункты остались простыми ссылками.', 'There’s no such class: the items stayed plain links.'),
      item: L3("Oldida menu so'zi kerak: bandlar oddiy havola bo'lib qoldi.", 'Впереди нужно слово menu: пункты остались простыми ссылками.', 'It needs menu in front: the items stayed plain links.'),
      'dropdown-header': L3("Bu eski nom, beshinchi versiyadan: sarlavha qora bo'lib, chetga yopishib qoldi.", 'Это старое имя из пятой версии: заголовок остался тёмным и прижался к краю.', 'That’s an old name from version five: the header stayed dark and stuck to the edge.'),
      'menu-title': L3("Bunday class yo'q: sarlavha qora bo'lib, chetga yopishib qoldi.", 'Такого class нет: заголовок остался тёмным и прижался к краю.', 'There’s no such class: the header stayed dark and stuck to the edge.'),
      title: L3("Oldida menu so'zi kerak: sarlavha qora bo'lib, chetga yopishib qoldi.", 'Впереди нужно слово menu: заголовок остался тёмным и прижался к краю.', 'It needs menu in front: the header stayed dark and stuck to the edge.'),
      'modal-header': L3("Bu eski nom, beshinchi versiyadan: sarlavha oddiy bo'lib qoldi.", 'Это старое имя из пятой версии: шапка осталась простой.', 'That’s an old name from version five: the header stayed plain.'),
      'dialog-top': L3("Bunday class yo'q: sarlavha oddiy bo'lib qoldi.", 'Такого class нет: шапка осталась простой.', 'There’s no such class: the header stayed plain.'),
      header: L3("Oldida dialog so'zi kerak: sarlavha oddiy bo'lib qoldi.", 'Впереди нужно слово dialog: шапка осталась простой.', 'It needs dialog in front: the header stayed plain.'),
      'dialog-bottom': L3("Bunday class yo'q: tugma o'ngga surilmadi.", 'Такого class нет: кнопка не прижалась вправо.', 'There’s no such class: the button didn’t move right.'),
      footer: L3("Oldida dialog so'zi kerak: tugma o'ngga surilmadi.", 'Впереди нужно слово dialog: кнопка не прижалась вправо.', 'It needs dialog in front: the button didn’t move right.'),
      'modal-footer': L3("Bu eski nom, beshinchi versiyadan: tugma o'ngga surilmadi.", 'Это старое имя из пятой версии: кнопка не прижалась вправо.', 'That’s an old name from version five: the button didn’t move right.')
    },
    hint1: L3("Namunaga qarang: bu menyumi yoki oynami? Qaysi qismi?", 'Посмотри на образец: это меню или окно? Какая часть?', 'Look at the goal: is it a menu or a window? Which part?'),
    hint2: L3("Oltinchi versiyada so'zlar menu va dialog bilan boshlanadi.", 'В шестой версии слова начинаются с menu и dialog.', 'In version six the words start with menu and dialog.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Menyu va oyna so'zlarini bilasiz.", 'Всё верно! Ты знаешь слова меню и окна.', 'All correct! You know the menu and window words.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta tugma ishlamayapti, har birida sabab boshqa. Sahifada bosib ko'ring, kodga qarang va sababini tanlang.", 'Последнее испытание. Три кнопки не работают, у каждой своя причина. Понажимай на странице, посмотри на код и выбери причину.', 'The last test. Three buttons don’t work, each for a different reason. Try them on the page, look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    asks: [
      L3("Bo'limlar tugmasini bosing: menyu ochilmayapti. Nega?", 'Нажми «Разделы»: меню не открывается. Почему?', 'Tap Sections: the menu won’t open. Why?'),
      L3("Qoidalar tugmasini bosing: oyna ochilmayapti. Nega?", 'Нажми «Правила»: окно не открывается. Почему?', 'Tap Rules: the window won’t open. Why?'),
      L3("Qoidalar tugmasini bosing: oyna yana ochilmayapti. Nega?", 'Нажми «Правила»: окно снова не открывается. Почему?', 'Tap Rules: the window still won’t open. Why?')
    ],
    opts: {
      noScript: L3("script qatori yo'q", 'Нет строки script', 'No script line'),
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5'),
      noHash: L3("Panjara # yo'q", 'Нет решётки #', 'No hash #')
    },
    rounds: [
      L3("Kod oxirida script qatori yo'q. Bootstrap skriptisiz menyu ochilmaydi.", 'В конце кода нет строки script. Без скрипта Bootstrap меню не открывается.', 'There’s no script line at the end. Without Bootstrap’s script the menu won’t open.'),
      L3("modal beshinchi versiyaning nomi. Oltinchisida data-bs-toggle dialog.", 'modal — имя пятой версии. В шестой — data-bs-toggle dialog.', 'modal is a version five name. In version six it’s data-bs-toggle dialog.'),
      L3("data-bs-target-da panjara yo'q: qoidalar emas, #qoidalar bo'lishi kerak.", 'В data-bs-target нет решётки: нужно не qoidalar, а #qoidalar.', 'data-bs-target has no hash: it must be #qoidalar, not qoidalar.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the site example.'),
    hint2: L3("script qatori bormi? So'z yangi versiyadanmi? # bormi?", 'Есть ли строка script? Слово из новой версии? Есть ли #?', 'Is there a script line? Is the word from the new version? Is there a #?'),
    ok: L3("Hammasi to'g'ri! Endi menyu yoki oyna buzilsa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если меню или окно сломается, причину найдёшь сам.', 'All correct! Now if a menu or window breaks, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z bo'limingiz", 'Свой раздел', 'Your own section'),
    say: L3("Endi menyuga o'z bo'limingizni qo'shing. Nomini o'zingiz o'ylab toping va kerakli class-ni yozing. Keyin «Tayyor»ni bosing va menyuni ochib ko'ring.",
      'Теперь добавь в меню свой раздел. Придумай название и впиши нужный class. Потом нажми «Готово» и открой меню.',
      'Now add your own section to the menu. Come up with a name and type the right class. Then tap “Done” and open the menu.'),
    ask: L3("Bo'lim nomi va class-ini yozing", 'Впиши название и class раздела', 'Type the section name and class'),
    askText: L3("Bo'lim nomi", 'Название раздела', 'Section name'),
    askCls: L3('Bandning class-i', 'class пункта', 'The item’s class'),
    ph: L3('Shaxmat', 'Шахматы', 'Chess'),
    noText: L3("Bo'lim nomi bo'sh. Nom yozing, masalan: Shaxmat.", 'Название пустое. Напиши его, например: Шахматы.', 'The name is empty. Type one, for example: Chess.'),
    hints: [
      L3("Avval bo'lim nomini yozing.", 'Сначала впиши название.', 'First type the name.'),
      L3("Boshqa bandlarda qaysi class bor?", 'Какой class у других пунктов?', 'Which class do the other items have?'),
      L3("Yozing: menu-item. Keyin «Tayyor»ni bosing.", 'Впиши: menu-item. Потом нажми «Готово».', 'Type: menu-item. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Menyuda sizning bo'limingiz bor. Ochib ko'ring!", 'Класс! В меню есть твой раздел. Открой и посмотри!', 'Nice! The menu has your section. Open it and see!')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men oyna uchun alohida sahifa kerak deb o'ylagandim? Afsuski, adashibman. Qarang: menyu ham, oyna ham shu sahifaning o'zida, faqat yashirin turadi. Tugmani bossangiz, Bootstrap ularni ochadi.",
        'Вернёмся к загадке. Помнишь, я думал, что для окна нужна отдельная страница? Увы, я ошибся. Смотри: и меню, и окно — на этой же странице, просто спрятаны. Нажимаешь кнопку — Bootstrap их открывает.',
        'Back to our riddle. Remember, I thought a window needed a separate page? Sadly, I was wrong. Look: the menu and the window are on this same page, just hidden. Tap a button and Bootstrap opens them.'), k: 'riddle' },
      { text: L3("Qarang, mana sizning sahifangiz!", 'Смотри, вот твоя страница!', 'Look, here’s your page!'), k: null },
      { text: L3("Menyu: tugmaga data-bs-toggle menu, ro'yxatga menu, bandlarga menu-item.", 'Меню: кнопке — data-bs-toggle menu, списку — menu, пунктам — menu-item.', 'Menu: the button gets data-bs-toggle menu, the list menu, the items menu-item.'), k: 'menu' },
      { text: L3("Oyna: dialog ichida dialog-header, dialog-body va dialog-footer.", 'Окно: в dialog — dialog-header, dialog-body и dialog-footer.', 'Window: dialog-header, dialog-body and dialog-footer inside dialog.'), k: 'dlg' },
      { text: L3("Oynani data-bs-toggle dialog va panjara bilan data-bs-target ochadi, data-bs-dismiss yopadi.", 'Окно открывают data-bs-toggle dialog и data-bs-target с решёткой, закрывает data-bs-dismiss.', 'data-bs-toggle dialog and data-bs-target with a hash open the window, data-bs-dismiss closes it.'), k: 'tgl' },
      { text: L3("Ularni birinchi darsdagi script qatori ishlatadi. Hammasi saytda, Components bo'limida.", 'Работает всё благодаря строке script с первого урока. Всё это — на сайте, в разделе Components.', 'The script line from lesson one makes it all work. It’s all on the site, in Components.'), k: 'site' },
      { text: L3("Tabriklayman! Siz o'ninchi darsni tugatdingiz. Keyingi dars — yakuniy loyiha: o'rgangan hamma narsadan bitta sayt yasaymiz. Ko'rishguncha!", 'Ура! Ты прошёл десятый урок. Следующий урок — финальный проект: соберём сайт из всего, что изучили. До встречи!', 'Hooray! You finished the tenth lesson. Next comes the final project: we’ll build one site from everything we learned. See you!'), k: null }
    ],
    roles: {
      menu: L3('menu · menu-item', 'menu · menu-item', 'menu · menu-item'),
      dlg: L3('dialog · header · body · footer', 'dialog · header · body · footer', 'dialog · header · body · footer'),
      tgl: L3('data-bs-toggle · data-bs-dismiss', 'data-bs-toggle · data-bs-dismiss', 'data-bs-toggle · data-bs-dismiss'),
      site: L3("So'zlar — Components bo'limida", 'Слова — в Components', 'Words are in Components')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1, ok: 1, more: 1, how: 1, same: 1, other: 1,
  sayMenu: 1, sayOpen: 1, sayPick: 1, sayPage: 1, sayPaste: 1, sayText: 1, sayHdr: 1, sayDiv: 1, sayDead: 1, sayClose: 1, sayTitle: 1, sayBack: 1, sayStatic: 1, sayBtn: 1,
  noText: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs9-kit.jsx@*/

/*@FILE:bs9-site.jsx@*/

/*@FILE:bs9-head.jsx@*/

/*@FILE:bs9-common.jsx@*/

/*@FILE:bs9-screens.jsx@*/

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
/*@FILE:bs9.css@*/
`;
