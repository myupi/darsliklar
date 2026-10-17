// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Списки» — урок 3 курса HTML, проба 2 («Гайд по игре»)
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node .claude/skills/novyy-urok/scripts/sobrat.mjs
//   tools/spiski2/spiski2.src.jsx lessons/test/05-spiski-2.jsx
// Правится исходник tools/spiski2/ (spiski2.src.jsx, ls-own.css), а не этот файл.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Списки» · модуль 1 «Основы разметки» · ТЕСТОВАЯ ВЕРСИЯ 2 ====
//
// ЗАМЫСЕЛ. Коди пишет гайд по игре «Пиксельный остров». Игроки жалуются: в
// гайде ничего не найти, шаги перепутаны, разделы «уехали». Ученик — редактор
// гайда: каждое задание закрывает чью-то жалобу. Сценарий:
// docs/scenarij-03-spiski-v2.md.
//
// ДУГА. Крючок (третий шаг в абзаце → список с номерами) → план → ul и li:
// пункт ↔ строка кода (показ) → собрать li (повтор) → разрезать пункт по
// запятым (сам) → прогноз «переносы не делают пунктов» → ol: пара ul→ol
// (показ) → вставить шаг, номера пересчитываются (повтор) → ul или ol с
// экспериментом «перемешай» (сам) → место для </ul> → набрать </ol> →
// детектив по жалобам → строка li целиком → свой раздел → сохранить → итог.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · СИСТЕМА СЛОВ: ul — список с точками, ol — список с номерами, li — пункт,
//     «закрыть список» — </ul> или </ol>.
//   · ПРЕВЬЮ ЧЕСТНОЕ: номера ol ставит браузер; h2 и p внутри незакрытого
//     списка рисуются со сдвигом и без точки; li вне списка — с точкой, но
//     без отступа; переносы строк без li склеиваются в одну строку.
//   · ТЕГИ ВСЛУХ: ul, ol, li — словами (spokenList поверх spokenHtml урока 2).
//   · ЖАЛОБЫ ИГРОКОВ — печатные карточки (имя и строка), суть озвучивает Коди.
//   · ЛЕСЕНКА: направить → сузить → опора; после решения на третьей ступени
//     на экране 4 — ещё одна строка с новым словом (followUp).
//   · АРТЕФАКТ: свой раздел гайда (тема, вид списка, пункты, готовый HTML).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you».
// =============================================================================

const META = {
  lessonId: 'html-03-spiski',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '3-dars. Ro‘yxatlar',
    ru: 'Урок 3. Списки',
    en: 'Lesson 3. Lists'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
// Подстановка в трёхъязычную строку; значение — строка или объект языков.
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      const sv = v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : String(v);
      s = s.split('{' + k + '}').join(sv);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Tuzilma tekshiruvi', 'Проверка структуры', 'Structure check'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  save: L3('Bo‘limni saqlash', 'Сохранить раздел', 'Save the section'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  here: L3('shu yerga', 'сюда', 'here'),
  shuffled: L3('aralashtirildi', 'перемешали', 'shuffled'),
  complaint: L3('Shikoyat', 'Жалоба', 'Complaint')
};

// Игроки — авторы жалоб (печатные карточки, не новые герои).
const PL = {
  sardor: L3('Sardor', 'Сардор', 'Sardor'),
  madina: L3('Madina', 'Мадина', 'Madina'),
  aziz: L3('Aziz', 'Азиз', 'Aziz')
};

// Данные гайда на языке ученика.
const G = {
  title: L3('Piksel orol', 'Пиксельный остров', 'Pixel Island'),
  bridgeH: L3('Daryodan qanday o‘tiladi', 'Как перейти реку', 'How to cross the river'),
  steps: [L3('Daraxt kesing', 'Сруби дерево', 'Chop a tree'), L3('Taxta yasang', 'Сделай доски', 'Make planks'),
    L3('Ko‘prik quring', 'Построй мост', 'Build a bridge'), L3('Daryodan o‘ting', 'Перейди реку', 'Cross the river')],
  tie: L3('Taxtalarni arqon bilan bog‘lang', 'Скрепи доски верёвкой', 'Tie the planks with rope'),
  caveH: L3('G‘orga nima olish kerak', 'Что взять в пещеру', 'What to take to the cave'),
  cave: [L3('Kirka', 'Кирка', 'Pickaxe'), L3('Mash’al', 'Факел', 'Torch'), L3('Non', 'Хлеб', 'Bread')],
  rope: L3('Arqon', 'Верёвка', 'Rope'),
  map: L3('Xarita', 'Карта', 'Map'),
  whoH: L3('Orolda kim yashaydi', 'Кто живёт на острове', 'Who lives on the island'),
  animals: [L3('tulki', 'лис', 'fox'), L3('qisqichbaqa', 'краб', 'crab'), L3('boyqush', 'сова', 'owl'), L3('ajdar', 'дракон', 'dragon')],
  beastsH: L3('Orol hayvonlari', 'Звери острова', 'Island animals'),
  beastsP: L3('Orolda tulkilar va boyqushlar yashaydi.', 'На острове живут лисы и совы.', 'Foxes and owls live on the island.'),
  tipsH: L3('Maslahatlar', 'Советы', 'Tips'),
  topH: L3('Hafta turniridagi o‘rinlar', 'Места в турнире недели', 'Places in this week’s tournament')
};
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const low = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики героя звучат; подписи и жалобы игроков печатаются.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Qo‘llanma', 'Гайд', 'The guide'),
    msg: L3('Uchinchi navbatda nima qilinadi? Adashib, daryoga yiqildim.', 'Что делать третьим? Я запутался и упал в реку.', 'What do I do third? I got confused and fell into the river.'),
    cast: [
      { pose: 'hello', text: L3('Salom! Bu Kodi. Men «Piksel orol» o‘yini bo‘yicha qo‘llanma yozyapman.', 'Привет! Это Коди. Я пишу гайд по игре «Пиксельный остров».', 'Hi! It’s Kodi. I’m writing a guide to the game Pixel Island.') },
      { pose: 'curious', text: L3('Lekin o‘yinchilar shikoyat qilyapti: qo‘llanmada hech narsa topib bo‘lmaydi. Mana, Sardor yozibdi.', 'Но игроки жалуются: в гайде ничего не найти. Вот, Сардор пишет.', 'But players complain they can’t find anything in it. Look, Sardor wrote.') },
      { pose: 'point', text: L3('Abzatsdan uchinchi navbatda nima qilishni toping va bosing.', 'Найди в абзаце, что делать третьим, и нажми.', 'Find in the paragraph what to do third, and tap it.') }
    ],
    para: {
      pre: L3('Daryodan o‘tish uchun avval ', 'Чтобы перейти реку, сначала ', 'To cross the river, first '),
      sep: [L3(', keyin ', ', потом ', ', then '), L3(', shundan so‘ng ', ', после этого ', ', after that '), L3(' va faqat shunda ', ' и только тогда ', ', and only then ')],
      end: L3('.', '.', '.')
    },
    ask: L3('Uchinchi qadamni bosing', 'Нажми третий шаг', 'Tap the third step'),
    askDone: L3('Raqamli ro‘yxatda uchinchi qadam darrov ko‘rinadi', 'В списке с номерами третий шаг виден сразу', 'In a numbered list, the third step is easy to see'),
    hints: [
      L3('Abzats boshidan qadamlarni tartib bilan sanang.', 'Считай шаги по порядку с начала абзаца.', 'Count the steps in order from the start.'),
      L3('Birinchisi — daraxt, ikkinchisi — taxta.', 'Первый — дерево, второй — доски.', 'The first is the tree, the second is the planks.'),
      L3('Taxtadan keyingi qadamni bosing.', 'Нажми шаг, который идёт после досок.', 'Tap the step that comes after the planks.')
    ],
    ok: L3('To‘g‘ri, uchinchisi — ko‘prik qurish. Lekin diqqat bilan o‘qishga to‘g‘ri keldi. Qarang, raqamli ro‘yxatda hammasi darrov ko‘rinadi.',
      'Верно, третий — построить мост. Но пришлось вчитываться. Смотри: в списке с номерами всё видно сразу.',
      'Right, the third is to build a bridge. But you had to read carefully. Look: in a numbered list, it’s all clear at once.')
  },

  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Bugun qo‘llanmani tartibga keltiramiz. Uch qadam.', 'Сегодня наведём порядок в гайде. Три шага.', 'Today we’ll put the guide in order. Three steps.'),
    steps: [
      { icon: 'list', text: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list'),
        say: L3('Avval nuqtali ro‘yxat: tartib muhim bo‘lmagan narsalar uchun.', 'Сначала список с точками — для вещей, где порядок не важен.', 'First a bulleted list, for things where order doesn’t matter.') },
      { icon: 'listN', text: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
        say: L3('Keyin raqamli ro‘yxat: tartib bilan bajariladigan qadamlar uchun.', 'Потом список с номерами — для шагов по порядку.', 'Then a numbered list, for steps in order.') },
      { icon: 'browser', text: L3('O‘z bo‘limingiz', 'Свой раздел гайда', 'Your own guide section'),
        say: L3('Oxirida qo‘llanmaga o‘z bo‘limingizni yozasiz.', 'А в конце ты напишешь свой раздел гайда.', 'And at the end you’ll write your own guide section.') }
    ],
    done: L3('Boshladik!', 'Поехали!', 'Let’s go!')
  },

  s3: {
    eyebrow: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list'),
    cast: [
      { pose: 'point', text: L3('Mana «G‘orga nima olish kerak» bo‘limi. Sahifadagi bandlarni bosing va qaysi kod qatori ularni yasashini kuzating.',
        'Вот раздел «Что взять в пещеру». Нажимай пункты на странице и смотри, какая строка кода их делает.',
        'Here’s the section What to take to the cave. Tap the items on the page and watch which line of code makes each one.') }
    ],
    each: L3('Bu bandni <li> qatori yasaydi. Bitta li — nuqtali bitta band.', 'Этот пункт делает строка <li>. Один li — один пункт с точкой.', 'An <li> line makes this item. One li is one bulleted item.'),
    done: L3('Uchta li — uchta band. <ul> esa butun ro‘yxat qutisi: nuqtalarni u qo‘yadi.', 'Три li — три пункта. А <ul> — коробка всего списка: она ставит точки.', 'Three li tags, three items. And <ul> is the box for the whole list: it adds the bullets.'),
    ask: L3('Sahifadagi har bir bandni bosing', 'Нажми каждый пункт на странице', 'Tap each item on the page')
  },

  s4: {
    eyebrow: L3('Yangi band', 'Новый пункт', 'New item'),
    msg: L3('Arqonsiz g‘ordan chiqib bo‘lmaydi! Uni qo‘shing.', 'Без верёвки из пещеры не вылезти! Добавьте её.', 'You can’t climb out of the cave without a rope! Add it.'),
    say: L3('Madina haq. Yangi qatorni yig‘ing: bo‘laklarni tartib bilan bosing.', 'Мадина права. Собери новую строку: нажимай детали по порядку.', 'Madina is right. Build the new line: tap the pieces in order.'),
    ask: L3('Yangi band qatorini yig‘ing', 'Собери строку нового пункта', 'Build the line for the new item'),
    err: {
      ul: L3('<ul> — butun ro‘yxat qutisi, u allaqachon bor. Bandga li kerak.', '<ul> — коробка всего списка, она уже есть. Пункту нужен li.', '<ul> is the box for the whole list, and it’s already there. An item needs li.'),
      order: L3('Avval ochuvchi teg, o‘rtada matn, oxirida yopuvchi teg.', 'Сначала открывающий тег, в середине текст, в конце закрывающий.', 'Opening tag first, text in the middle, closing tag last.')
    },
    hints: [
      L3('Yangi qator qo‘shni qatorlarga o‘xshash bo‘ladi.', 'Новая строка будет такой же, как соседние.', 'The new line looks like the ones next to it.'),
      L3('Qator band tegi bilan boshlanadi.', 'Строка начинается с тега пункта.', 'The line starts with the item tag.'),
      L3('Keyingi bo‘lak — {x}.', 'Следующая деталь — {x}.', 'The next piece is {x}.')
    ],
    praise: L3('Voy! Yangi band darhol nuqtasini oldi!', 'Вау! Новый пункт сразу получил точку!', 'Wow! The new item got its bullet right away!'),
    more: L3('Yana bittasi — xarita bilan. Endi o‘zingiz.', 'Ещё одна строка — с картой. Теперь сам.', 'One more line, with a map. Now on your own.'),
    why: L3('Band shunday yoziladi: <li>, matn, </li>.', 'Пункт пишется так: <li>, текст, </li>.', 'An item is written like this: <li>, text, </li>.')
  },

  s5: {
    eyebrow: L3('Bandni qirqing', 'Разрежь пункт', 'Cut the item'),
    say: L3('Bu yerda hamma hayvonlar bitta bandga tushib qolgan. Uni vergullardan qirqing — har bir hayvon o‘z li siga aylanadi.',
      'Здесь все звери попали в один пункт. Разрежь его на запятых — каждый зверь станет своим li.',
      'Here all the animals ended up in one item. Cut it at the commas, and each animal becomes its own li.'),
    ask: L3('Banddagi vergullarni bosing', 'Нажимай запятые в пункте', 'Tap the commas in the item'),
    word: L3('Hayvonlar orasidan qirqing — vergulda.', 'Режь между зверями — на запятой.', 'Cut between the animals, at a comma.'),
    done: L3('To‘rtta hayvon — to‘rtta li. Har bir band — bitta narsa.', 'Четыре зверя — четыре li. Каждый пункт — одна вещь.', 'Four animals, four li tags. Each item is one thing.')
  },

  s6: {
    eyebrow: L3('Oldindan ayting', 'Угадай', 'Guess'),
    say: L3('Hayvonlarni har birini yangi qatorga yozaman, li siz. Sizningcha, brauzer nimani ko‘rsatadi?',
      'А если просто написать каждого зверя с новой строки, без li? Как думаешь, что покажет браузер?',
      'What if I just write each animal on a new line, with no li? What do you think the browser will show?'),
    ask: L3('Brauzer nimani ko‘rsatadi?', 'Что покажет браузер?', 'What will the browser show?'),
    opts: {
      dots: L3('Nuqtali ustun', 'Столбик с точками', 'A column with bullets'),
      col: L3('Nuqtasiz ustun', 'Столбик без точек', 'A column with no bullets'),
      line: L3('Hammasi bitta qatorda', 'Всё в одну строку', 'All on one line')
    },
    right: L3('Aynan! Koddagi qator ko‘chishlarini brauzer birlashtiradi. Bandlarni faqat li yasaydi.', 'Точно! Переносы строк в коде браузер склеивает. Пункты делает только li.', 'Exactly! The browser joins line breaks in the code. Only li makes items.'),
    miss: L3('Qarang: brauzer hammasini bitta qatorga yopishtirdi. Koddagi ko‘chishlar band yasamaydi — ularni li yasaydi.', 'Смотри: браузер склеил всё в одну строку. Переносы в коде не делают пунктов — их делает li.', 'Look: the browser glued everything into one line. Line breaks in the code don’t make items; li does.'),
    wrap: L3('Endi har birini ul ichida li ga o‘raymiz — bandlar qaytdi.', 'А теперь обернём каждого в li внутри ul — и пункты вернулись.', 'Now we wrap each one in li inside ul, and the items are back.')
  },

  s7: {
    eyebrow: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
    cast: [
      { pose: 'explain', text: L3('Ko‘prik qadamlarini nuqtali ro‘yxat qilib yozdim. Lekin bu yerda tartib muhim. Qadamlar uchun <ol> — raqamli ro‘yxat bor.',
        'Я записал шаги про мост списком с точками. Но тут важен порядок. Для шагов есть <ol> — список с номерами.',
        'I wrote the bridge steps as a bulleted list. But order matters here. For steps there’s <ol>, a numbered list.') },
      { pose: 'point', text: L3('Ikkala ul tegini bosing — ular ol ga aylanadi.', 'Нажми на оба тега ul — они станут ol.', 'Tap both ul tags, and they’ll become ol.') }
    ],
    ask: L3('Ikkala ul tegini ol ga almashtiring', 'Поменяй оба тега ul на ol', 'Change both ul tags to ol'),
    rule: L3('Teglar jufti mos', 'Пара тегов совпадает', 'The tag pair matches'),
    openFirst: L3('Raqamlar paydo bo‘ldi! Ro‘yxat ko‘rinishini ochuvchi teg belgilaydi. Endi yopuvchisini almashtiring — juft mos bo‘lishi kerak.',
      'Номера появились! Вид списка задаёт открывающий тег. Теперь поменяй закрывающий — пара должна совпадать.',
      'Numbers appeared! The opening tag sets the kind of list. Now change the closing one: the pair must match.'),
    closeFirst: L3('Yopuvchi o‘zgardi, nuqtalar esa qoldi: ro‘yxat ko‘rinishini ochuvchi teg belgilaydi. Uni ham almashtiring.',
      'Закрывающий поменялся, а точки остались: вид списка задаёт открывающий тег. Поменяй и его.',
      'The closing tag changed, but the bullets stayed: the opening tag sets the kind of list. Change it too.'),
    done: L3('<ol> va </ol> jufti — qadamlar raqamli. Raqamlarni brauzer o‘zi qo‘yadi.', 'Пара <ol> и </ol> — и шаги с номерами. Номера браузер ставит сам.', 'An <ol> and </ol> pair, and the steps are numbered. The browser adds the numbers itself.')
  },

  s8: {
    eyebrow: L3('Yangi qadam', 'Новый шаг', 'New step'),
    msg: L3('Ko‘prik qurdim — qulab tushdi! Taxtalar hech narsa bilan bog‘lanmagan-ku.', 'Построил мост — он развалился! Доски же ничем не скреплены.', 'I built the bridge and it fell apart! The planks aren’t tied together.'),
    say: L3('Yangi qadam kerak: «Taxtalarni arqon bilan bog‘lang». Ro‘yxatda u turishi kerak bo‘lgan joyni bosing.',
      'Нужен новый шаг: «Скрепи доски верёвкой». Нажми место в списке, где он должен стоять.',
      'We need a new step: Tie the planks with rope. Tap the place in the list where it belongs.'),
    ask: L3('Yangi qadam uchun joyni bosing', 'Нажми место для нового шага', 'Tap the place for the new step'),
    early: L3('Bu yerda hali taxta yo‘q — bog‘laydigan narsa yo‘q.', 'Здесь досок ещё нет — скреплять нечего.', 'There are no planks here yet, nothing to tie.'),
    late: L3('Bu yerda ko‘prik allaqachon qurilgan — bog‘lash kech.', 'Здесь мост уже построен — скреплять поздно.', 'The bridge is already built here, it’s too late to tie.'),
    hints: [
      L3('Bog‘lash uchun avval nima bo‘lishi kerak?', 'Что должно появиться, чтобы было что скреплять?', 'What has to exist before you can tie it?'),
      L3('Taxta 2-qadamda paydo bo‘ladi, ko‘prik — 3-qadamda.', 'Доски появляются на шаге 2, мост — на шаге 3.', 'The planks appear at step 2, the bridge at step 3.'),
      L3('«Taxta yasang» va «Ko‘prik quring» orasidagi joyni bosing.', 'Нажми место между «Сделай доски» и «Построй мост».', 'Tap the place between Make planks and Build a bridge.')
    ],
    ok: L3('Yangi qadam uchinchi bo‘ldi, ko‘prik esa to‘rtinchi. Raqamlarni brauzer o‘zi qayta sanadi — biz ularga tegmadik.',
      'Новый шаг встал третьим, а мост стал четвёртым. Номера браузер пересчитал сам — мы их не трогали.',
      'The new step became third, and the bridge became fourth. The browser renumbered everything itself; we didn’t touch the numbers.')
  },

  s9: {
    eyebrow: L3('ul yoki ol?', 'ul или ol?', 'ul or ol?'),
    say: L3('Qo‘llanmaning yangi bo‘limlari. Har biri uchun ro‘yxat tanlang. Ikkilansangiz — bandlar aralashib ketganini tasavvur qiling.',
      'Новые разделы гайда. Для каждого выбери список. Сомневаешься — представь, что пункты перемешались.',
      'New guide sections. Pick a list for each one. Not sure? Imagine the items got shuffled.'),
    rounds: [
      { want: 'ol', title: L3('Iksir qanday tayyorlanadi', 'Как сварить зелье', 'How to brew a potion'),
        items: [L3('Suv quying', 'Налей воду', 'Pour water'), L3('O‘t tashlang', 'Брось траву', 'Add herbs'), L3('Aralashtiring', 'Помешай', 'Stir')] },
      { want: 'ul', title: L3('Sandiqda nima bor', 'Что лежит в сундуке', 'What’s in the chest'),
        items: [L3('Tangalar', 'Монеты', 'Coins'), L3('Kalit', 'Ключ', 'Key'), L3('Olma', 'Яблоко', 'Apple')] },
      { want: 'ol', title: L3('Hafta turniridagi o‘rinlar', 'Места в турнире недели', 'Places in this week’s tournament'),
        items: [L3('Madina', 'Мадина', 'Madina'), L3('Sardor', 'Сардор', 'Sardor'), L3('Aziz', 'Азиз', 'Aziz')] },
      { want: 'ul', title: L3('Ajdar ranglari', 'Цвета дракона', 'Dragon colours'),
        items: [L3('Qizil', 'Красный', 'Red'), L3('Yashil', 'Зелёный', 'Green'), L3('Oltin', 'Золотой', 'Gold')] }
    ],
    ask: L3('ul yoki ol? Tartib muhimmi?', 'ul или ol? Важен ли порядок?', 'ul or ol? Does order matter?'),
    okOl: L3('To‘g‘ri, ol: bandlarni aralashtirsangiz, hech narsa chiqmaydi.', 'Верно, ol: перемешай пункты — и ничего не выйдет.', 'Right, ol: shuffle the items and nothing works.'),
    okUl: L3('To‘g‘ri, ul: istalgan tartibda ma’no bir xil.', 'Верно, ul: в любом порядке смысл тот же.', 'Right, ul: in any order, the meaning is the same.'),
    missOl: L3('Qarang, aralashtirdik — ma’no buzildi. Tartib muhim, demak ol.', 'Смотри, перемешали — и смысл сломался. Порядок важен, значит ol.', 'Look, we shuffled them and the meaning broke. Order matters, so ol.'),
    missUl: L3('Qarang, aralashtirdik — hech narsa o‘zgarmadi. Tartib muhim emas, demak ul.', 'Смотри, перемешали — ничего не изменилось. Порядок не важен, значит ul.', 'Look, we shuffled them and nothing changed. Order doesn’t matter, so ul.'),
    done: L3('To‘rttasi ham to‘g‘ri! Tartib muhim — ol. Muhim emas — ul.', 'Все четыре верно! Порядок важен — ol. Не важен — ul.', 'All four right! Order matters: ol. It doesn’t: ul.')
  },

  s10: {
    eyebrow: L3('Ro‘yxat oxiri', 'Конец списка', 'End of the list'),
    msg: L3('Nega «Orol hayvonlari» bo‘limi o‘ngga surilib ketdi?', 'Почему раздел «Звери острова» уехал вправо?', 'Why did the Island animals section slide to the right?'),
    say: L3('Ro‘yxatni tugatishni unutibman — pastdagi hammasi unga tushib qoldi. Ro‘yxat tugashi kerak bo‘lgan joyni bosing.',
      'Я забыл закончить список — и всё, что ниже, попало в него. Нажми место, где список должен закончиться.',
      'I forgot to end the list, so everything below fell into it. Tap the place where the list should end.'),
    ask: L3('</ul> turishi kerak bo‘lgan joyni bosing', 'Нажми место, где должен стоять </ul>', 'Tap the place where </ul> should go'),
    inside: L3('Bu yerda ro‘yxat hali davom etadi: pastda yana li bor.', 'Здесь список ещё идёт: ниже есть пункт li.', 'The list still goes on here: there’s another li below.'),
    late: L3('Bu yerda «Orol hayvonlari» allaqachon ro‘yxat ichida. Oldinroq tugating.', 'Здесь «Звери острова» уже внутри списка. Закончи раньше.', 'Here Island animals is already inside the list. End it earlier.'),
    hints: [
      L3('li bandlari qayerda tugaydi?', 'Где кончаются пункты li?', 'Where do the li items end?'),
      L3('Oxirgi band — «Mash’al».', 'Последний пункт — «Факел».', 'The last item is Torch.'),
      L3('«Mash’al» qatoridan keyingi joyni bosing.', 'Нажми место сразу после строки «Факел».', 'Tap the place right after the Torch line.')
    ],
    ok: L3('Ro‘yxat tugadi — «Orol hayvonlari» joyiga qaytdi. Har bir ro‘yxat oxirgi li dan keyin yopiladi.',
      'Список закончился — «Звери острова» вернулись на место. Каждый список закрывается после последнего li.',
      'The list ended, and Island animals is back in place. Every list is closed after its last li.')
  },

  s11: {
    eyebrow: L3('Ro‘yxatni yoping', 'Закрой список', 'Close the list'),
    say: L3('Ko‘prik qadamlarida ham oxiri yo‘q. Ro‘yxatni o‘zingiz yoping: tegni tugmalar bilan tering.',
      'В шагах про мост тоже нет конца. Закрой список сам: набери тег кнопками.',
      'The bridge steps have no end either. Close the list yourself: type the tag with the buttons.'),
    ask: L3('Bo‘sh qatorga ro‘yxatni yopuvchi tegni tering', 'Набери в пустой строке закрывающий тег списка', 'Type the list’s closing tag in the empty line'),
    typeMsg: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Это открывающий тег. В закрывающем есть косая черта.', 'That’s an opening tag. A closing tag has a slash.'),
      needLt: L3('Teg burchakdan boshlanadi.', 'Тег начинается с уголка.', 'A tag starts with an angle bracket.'),
      needGt: L3('Tegni burchak bilan yoping.', 'Закрой тег уголком.', 'Close the tag with an angle bracket.'),
      wrongName: L3('Bu boshqa ro‘yxatni yopadi. Bu ro‘yxat ol bilan ochilgan.', 'Это закрывает другой список. Этот открыт тегом ol.', 'That closes another kind of list. This one was opened with ol.'),
      generic: L3('ol ni yopuvchi tegni tering.', 'Набери закрывающий тег для ol.', 'Type the closing tag for ol.')
    },
    praise: L3('Ro‘yxat yopildi — «Maslahatlar» bo‘limi yana o‘z joyida.', 'Список закрыт — раздел «Советы» снова на своём месте.', 'The list is closed, and the Tips section is back in place.'),
    hintSay: L3('ol ni yopuvchi teg: qiya chiziq va ol nomi.', 'Закрывающий тег для ol: косая черта и имя ol.', 'The closing tag for ol: a slash and the name ol.')
  },

  s12: {
    eyebrow: L3('Shikoyatlar', 'Жалобы игроков', 'Player complaints'),
    say: L3('O‘yinchilar uchta shikoyat yuborishdi. Har birida bitta kod qatori boshqacha turibdi. Uni toping va bosing.',
      'Игроки прислали три жалобы. В каждой одна строка кода стоит не так. Найди её и нажми.',
      'Players sent three complaints. In each, one line of code is not right. Find it and tap it.'),
    ask: L3('Boshqacha turgan qatorni bosing', 'Нажми строку, которая стоит не так', 'Tap the line that is not right'),
    cases: [
      { from: 'sardor', msg: L3('«Non» bandi qiyshiq turibdi, chekinishsiz.', 'Пункт «Хлеб» стоит криво, без отступа.', 'The Bread item is crooked, with no indent.'),
        hints: [L3('Non bilan li qayerda turibdi — ul ichidami?', 'Где стоит li с хлебом — внутри ul?', 'Where is the li with bread: inside ul?'),
          L3('</ul> dan keyin nima turganiga qarang.', 'Посмотри, что идёт после </ul>.', 'Look at what comes after </ul>.'),
          L3('<li>Non</li> qatorini bosing.', 'Нажми строку <li>Хлеб</li>.', 'Tap the <li>Bread</li> line.')],
        why: L3('Har bir li ul yoki ol ichida yashaydi.', 'Каждый li живёт внутри ul или ol.', 'Every li lives inside ul or ol.') },
      { from: 'aziz', msg: L3('Nega raqamlar ikki marta: «1. 1.»?', 'Почему номера двойные: «1. 1.»?', 'Why are the numbers doubled: 1. 1.?'),
        hints: [L3('Ikkinchi raqam qayerdan paydo bo‘ldi?', 'Откуда взялся второй номер?', 'Where did the second number come from?'),
          L3('ol da raqamni brauzer qo‘yadi. Bu yerda ularni qo‘lda ham yozishgan.', 'В ol номера ставит браузер. А тут их ещё и написали руками.', 'In ol the browser adds the numbers. Here someone also typed them by hand.'),
          L3('Ichida raqam yozilgan istalgan li qatorini bosing.', 'Нажми любую строку li, где внутри написана цифра.', 'Tap any li line with a digit inside.')],
        why: L3('ol da raqamlarni yozmaymiz — brauzer ularni o‘zi qo‘yadi.', 'В ol номера не пишем — браузер ставит их сам.', 'In ol we don’t type numbers: the browser adds them itself.') },
      { from: 'madina', msg: L3('Iksir qadamlari raqamsiz — tartibni adashtirib yubordim!', 'Шаги зелья без номеров — я перепутала порядок!', 'The potion steps have no numbers, and I mixed up the order!'),
        hints: [L3('Qadamlar uchun qanday ro‘yxat kerak?', 'Какой список нужен для шагов?', 'Which list do steps need?'),
          L3('Ro‘yxatni ochuvchi tegga qarang.', 'Посмотри на тег, который открывает список.', 'Look at the tag that opens the list.'),
          L3('<ul> qatorini bosing.', 'Нажми строку <ul>.', 'Tap the <ul> line.')],
        why: L3('Qadamlar — tartib muhim, demak ol.', 'Это шаги — порядок важен, значит ol.', 'These are steps: order matters, so ol.') }
    ],
    other: L3('Bu qator joyida. Qidirishda davom eting.', 'Эта строка в порядке. Ищи дальше.', 'This line is fine. Keep looking.'),
    done: L3('Uchala shikoyat yopildi! O‘yinchilar xursand.', 'Все три жалобы закрыты! Игроки довольны.', 'All three complaints are closed! The players are happy.')
  },

  s13: {
    eyebrow: L3('Qatorni yozing', 'Напиши строку', 'Write the line'),
    msg: L3('Men uchinchi o‘rinni oldim! Meni ham yozib qo‘ying, iltimos.', 'Я занял третье место! Допишите меня, пожалуйста.', 'I got third place! Please add me.'),
    say: L3('Azizni o‘zingiz yozing. Qatorni to‘liq tering: ochuvchi teg, ism, yopuvchi teg.', 'Азиза впиши сам. Напиши строку целиком: открывающий тег, имя, закрывающий тег.', 'Add Aziz yourself. Write the whole line: opening tag, name, closing tag.'),
    ask: L3('Aziz uchun <li> qatorini yozing', 'Напиши строку <li> для Азиза', 'Write the <li> line for Aziz'),
    msgs: {
      noOpen: L3('Ochuvchi <li> tegidan boshlang.', 'Начни с открывающего тега <li>.', 'Start with the opening tag <li>.'),
      noText: L3('Teglar orasiga ismni yozing.', 'Между тегами напиши имя.', 'Write the name between the tags.'),
      noClose: L3('Bandni </li> tegi bilan yoping.', 'Закрой пункт тегом </li>.', 'Close the item with </li>.'),
      needSlash: L3('Yopuvchi tegda qiya chiziq kerak.', 'В закрывающем теге нужна косая черта.', 'The closing tag needs a slash.'),
      wrongTag: L3('Band li tegi bilan yoziladi.', 'Пункт пишется тегом li.', 'An item is written with the li tag.')
    },
    hints: [
      L3('Yuqoridagi qatorlarga qarang — sizniki ham xuddi shunday.', 'Посмотри на строки выше — твоя такая же.', 'Look at the lines above: yours is the same.'),
      L3('Qator: <li>, keyin ism, keyin </li>.', 'Строка: <li>, потом имя, потом </li>.', 'The line: <li>, then the name, then </li>.'),
      L3('Shunday yozing: <li>Aziz</li>.', 'Напиши так: <li>Азиз</li>.', 'Write it like this: <li>Aziz</li>.')
    ],
    praise: L3('Qator to‘liq yozildi — Aziz ro‘yxatda uchinchi.', 'Строка написана целиком — Азиз в списке третьим.', 'The whole line is written: Aziz is third on the list.')
  },

  s14: {
    eyebrow: L3('Mening bo‘limim', 'Мой раздел', 'My section'),
    say: L3('Endi qo‘llanmadagi o‘z bo‘limingiz. Mavzu tanlang, keyin ro‘yxat turini va bandlarni yozing.',
      'Теперь твой раздел гайда. Выбери тему, потом вид списка и напиши пункты.',
      'Now your own guide section. Pick a topic, then the kind of list, and write the items.'),
    topics: [
      { id: 'inv', want: 'ul', label: L3('Mening inventarim', 'Мой инвентарь', 'My inventory'), ex: L3('Masalan: qilich', 'Например: меч', 'For example: sword') },
      { id: 'craft', want: 'ol', label: L3('Mash’al qanday yasaladi', 'Как сделать факел', 'How to make a torch'), ex: L3('Masalan: tayoq toping', 'Например: найди палку', 'For example: find a stick') },
      { id: 'top', want: 'ol', label: L3('Mening top-3 o‘yinlarim', 'Мой топ-3 игр', 'My top 3 games'), ex: L3('Birinchi o‘rindagi o‘yin', 'Игра на первом месте', 'The game in first place') },
      { id: 'pets', want: 'ul', label: L3('O‘yindagi uy hayvonlarim', 'Мои питомцы в игре', 'My pets in the game'), ex: L3('Masalan: mushuk', 'Например: кот', 'For example: cat') }
    ],
    askTopic: L3('Mavzu tanlang', 'Выбери тему', 'Pick a topic'),
    askList: L3('Bu mavzu uchun ul yoki ol?', 'Для этой темы — ul или ol?', 'For this topic: ul or ol?'),
    askItems: L3('«+ li» ni bosing va bandni yozing — uchta kerak', 'Нажми «+ li» и напиши пункт — нужно три', 'Tap “+ li” and write an item, three in all'),
    hintItems: L3('li tugmasini bosing va bandni yozing. Uchta band kerak.', 'Нажми кнопку li и напиши пункт. Нужно три пункта.', 'Tap the li button and write an item. You need three items.'),
    okList: L3('To‘g‘ri tanlov! Endi bandlarni li tugmasi bilan qo‘shing.', 'Верный выбор! Теперь добавляй пункты кнопкой li.', 'Good choice! Now add items with the li button.'),
    missOl: L3('Bandlarni aralashtirib ko‘ring: ma’no buziladi. Demak tartib muhim.', 'Представь, что пункты перемешались: смысл ломается. Значит, порядок важен.', 'Imagine the items shuffled: the meaning breaks. So order matters.'),
    missUl: L3('Bandlarni aralashtirib ko‘ring: hech narsa o‘zgarmaydi. Tartib muhim emas.', 'Представь, что пункты перемешались: ничего не меняется. Порядок не важен.', 'Imagine the items shuffled: nothing changes. Order doesn’t matter.'),
    noTags: L3('Bu yerga faqat so‘zlar, teglar allaqachon bor.', 'Здесь только слова — теги уже стоят.', 'Only words here; the tags are already there.'),
    done: L3('Bo‘lim tayyor: ro‘yxat turi ma’noga mos, bandlar o‘zingizniki.', 'Раздел готов: вид списка по смыслу, а пункты — твои.', 'The section is ready: the list fits the meaning, and the items are yours.')
  },

  s15: {
    eyebrow: L3('Mening bo‘limim', 'Мой раздел', 'My section'),
    say: L3('Mana qo‘llanmadagi bo‘limingiz va uning kodi. Uni saqlang.', 'Вот твой раздел гайда и его код. Сохрани его.', 'Here’s your guide section and its code. Save it.'),
    saved: L3('Ura, saqlandi! O‘yinchilar bo‘limingizdan xursand bo‘ladi!', 'Ура, сохранено! Игроки будут в восторге от твоего раздела!', 'Hooray, saved! The players will love your section!'),
    ask: L3('Bo‘limni saqlang', 'Сохрани раздел', 'Save the section')
  },

  s16: {
    eyebrow: L3('Yakun', 'Итог', 'Wrap-up'),
    say: L3('Bugun qo‘llanma tushunarli bo‘ldi: nuqtali va raqamli ro‘yxatlar. Keyingi darsda havolalar qilamiz — qo‘llanma bo‘limlari bir-biriga bog‘lanadi. Ko‘rishguncha!',
      'Сегодня гайд стал понятным: списки с точками и с номерами. На следующем уроке сделаем ссылки — разделы гайда свяжутся между собой. Пока!',
      'Today the guide became clear: bulleted and numbered lists. Next lesson we’ll make links, so the guide’s sections connect to each other. Bye!'),
    skills: [
      L3('ul — nuqtali ro‘yxat: tartib muhim emas', 'ul — список с точками: порядок не важен', 'ul is a bulleted list: order doesn’t matter'),
      L3('ol — raqamli ro‘yxat: raqamlarni brauzer qo‘yadi', 'ol — список с номерами: номера ставит браузер', 'ol is a numbered list: the browser adds the numbers'),
      L3('li — bitta band, doim ul yoki ol ichida', 'li — один пункт, всегда внутри ul или ol', 'li is one item, always inside ul or ol'),
      L3('Ro‘yxat oxirgi li dan keyin yopiladi', 'Список закрывается после последнего li', 'A list is closed after its last li')
    ],
    next: L3('Havolalar va atributlar', 'Ссылки и атрибуты', 'Links and attributes'),
    btn: L3('Darsni yakunlash', 'Завершить урок', 'Finish the lesson')
  }
};

/*@L2_HELPERS@*/

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2 ДЛЯ СПИСКОВ
// ═════════════════════════════════════════════════════════════════════════════
// Цвет списков — один на семейство (как h1–h6 в уроке 2): ul, ol и li — стальной
// синий той же светлоты. Зелёный тегам не даём — он значит «верно».
TAGC.ul = '#2F6FB0'; TAGC.ol = '#2F6FB0'; TAGC.li = '#2F6FB0';
// Теги вслух — по-английски во всех языках (заказчик, 17.10.2026).
Object.assign(TAG_SAY.ru, { ul: 'U L', ol: 'O L', li: 'L I' });
Object.assign(TAG_SAY.uz, { ul: 'U L', ol: 'O L', li: 'L I' });
Object.assign(TAG_SAY.en, { ul: 'U L', ol: 'O L', li: 'L I' });
// Ключи реплик урока 3, которых нет в уроке 2 (для прогрева озвучки).
Object.assign(SPOKEN, { each: 1, early: 1, late: 1, openFirst: 1, closeFirst: 1, right: 1, miss: 1, wrap: 1, okOl: 1, okUl: 1,
  missOl: 1, missUl: 1, inside: 1, okList: 1, hintSay: 1, msgs: 1, word: 1, cases: 1 });
Object.assign(NOT_SPOKEN_IN, { cases: { msg: 1, from: 1 } });
// Озвучка: теги и голые имена ul, ol, li — словами, затем общий разбор урока 2.
function spokenList(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const s = String(text || '')
    .replace(/<\s*\/\s*(ul|ol|li)\s*>/gi, (a, t) => ' ' + m.close + ' ' + m[t.toLowerCase()] + ' ')
    .replace(/<\s*(ul|ol|li)\s*>/gi, (a, t) => ' ' + m[t.toLowerCase()] + ' ')
    .replace(/(^|[^A-Za-zА-Яа-яЁё])(ul|ol|li)(?=[^A-Za-zА-Яа-яЁё]|$)/g, (a, pre, t) => pre + m[t]);
  return spokenHtml(s, lang);
}
function SpokenList({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenList(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ СТРАНИЦЫ СО СПИСКАМИ. Узлы:
//   { kind: 'h2' | 'p', id, v | node }       — блок;
//   { kind: 'raw', id, v }                   — текст без тега (строка кода);
//   { kind: 'list', id, tag, items, tail?, noClose?, openTag?, closeTag? }
//        items: [{ id, v | node, noClose? }]; tail — узлы, попавшие внутрь
//        незакрытого списка (рисуются со сдвигом, без точки);
//   { kind: 'li', id, v }                    — пункт вне списка.
// ─────────────────────────────────────────────────────────────────────────────
const li = (id, v, more) => Object.assign({ id, v: String(v == null ? '' : v) }, more || {});
function lsLines(nodes) {
  const L = [];
  const block = (n, d) => {
    if (n.kind === 'raw') { L.push({ key: n.id, id: n.id, d, toks: [{ k: 'text', v: n.v, z: n.id }] }); return; }
    if (n.kind === 'li') {
      L.push({ key: n.id, id: n.id, d, tag: 'li', stray: true,
        toks: [{ k: 'open', tag: 'li', z: n.id + ':o' }, { k: 'text', v: n.v, z: n.id + ':t' }, { k: 'close', tag: 'li', z: n.id + ':c' }] });
      return;
    }
    if (n.kind === 'list') {
      const ot = n.openTag || n.tag, ct = n.closeTag || n.tag;
      L.push({ key: n.id + '-o', id: n.id + ':o', d, tag: ot, toks: [{ k: 'open', tag: ot, z: n.id + ':o' }] });
      n.items.forEach((it) => {
        // bare — строка, которую ученик собирает сам: без готовых тегов li.
        if (it.bare) { L.push({ key: it.id, id: it.id, d: d + 1, toks: [{ k: 'node', node: it.node, z: it.id + ':t' }], li: it }); return; }
        const toks = [{ k: 'open', tag: 'li', z: it.id + ':o' }];
        toks.push(it.node ? { k: 'node', node: it.node, z: it.id + ':t' } : { k: 'text', v: it.v, z: it.id + ':t' });
        if (!it.noClose) toks.push({ k: 'close', tag: 'li', z: it.id + ':c' });
        L.push({ key: it.id, id: it.id, d: d + 1, tag: 'li', toks, li: it });
      });
      (n.tail || []).forEach((t) => block(t, d));
      if (!n.noClose) L.push({ key: n.id + '-c', id: n.id + ':c', d, tag: ct, toks: [{ k: 'close', tag: ct, z: n.id + ':c' }], fresh: n.freshClose });
      return;
    }
    if (n.kind === 'line') { L.push({ key: n.id, id: n.id, d, gap: true, toks: [{ k: 'node', node: n.node, z: n.id }] }); return; }
    const toks = [{ k: 'open', tag: n.kind, z: n.id + ':o' }];
    toks.push(n.node ? { k: 'node', node: n.node, z: n.id + ':t' } : { k: 'text', v: n.v, z: n.id + ':t' });
    toks.push({ k: 'close', tag: n.kind, z: n.id + ':c' });
    L.push({ key: n.id, id: n.id, d, tag: n.kind, toks });
  };
  nodes.forEach((n) => block(n, 0));
  return L;
}
// Места между строками кода: «сюда» после строки с id из afterIds.
function withSlots(lines, afterIds) {
  const out = [];
  lines.forEach((ln) => {
    out.push(ln);
    if (afterIds.indexOf(ln.id) >= 0) out.push({ key: 'slot-' + ln.id, id: 'slot:' + ln.id, d: ln.li ? ln.d : ln.d + 1, slot: true, after: ln.id, toks: [] });
  });
  return out;
}

// Страница: настоящие ul/ol — точки и номера рисует сам браузер.
function LsPage({ nodes, hl, fresh, flash, onItem, ledIds, canTap }) {
  const has = (arr, id) => !!arr && arr.indexOf(id) >= 0;
  const cls = (id) => (has(hl, id) ? ' is-hl' : '') + (has(fresh, id) ? ' is-new' : '') + (has(flash, id) ? ' is-flash' : '');
  const block = (n) => {
    if (n.kind === 'raw') return null;
    if (n.kind === 'li') return <div key={n.id} className={'ls-stray' + cls(n.id)}>{n.v}</div>;
    if (n.kind === 'list') {
      const Tg = (n.openTag || n.tag) === 'ol' ? 'ol' : 'ul';
      return (
        <Tg key={n.id + Tg} className={'ls-list ls-' + Tg + cls(n.id)}>
          {n.items.map((it) => (
            <li key={it.id} className={'ls-li' + cls(it.id)}>
              {onItem ? (
                <button type="button" className="ls-li-b" disabled={!canTap} onClick={() => onItem(it.id)}>
                  {it.v}<Led on={has(ledIds, it.id)} />
                </button>
              ) : (it.v || ' ')}
            </li>
          ))}
          {n.tail && n.tail.length ? <li className="ls-tail">{n.tail.map(block)}</li> : null}
        </Tg>
      );
    }
    if (n.kind === 'line') return null;
    const Tg = n.kind === 'h2' ? 'h2' : n.kind === 'h1' ? 'h1' : 'p';
    return <Tg key={n.id} className={'ls-' + Tg + cls(n.id)}>{n.v}</Tg>;
  };
  // Строки без тегов браузер склеивает в один текст.
  const out = [];
  let raw = [];
  const flush = () => { if (raw.length) { out.push(<p key={'raw' + out.length} className="ls-raw">{raw.join(' ')}</p>); raw = []; } };
  nodes.forEach((n) => { if (n.kind === 'raw') raw.push(n.v); else { flush(); out.push(block(n)); } });
  flush();
  return <div className="pg ls-pg">{out}</div>;
}

// Жалоба игрока — печатная карточка.
// done — жалоба закрыта: галочка, как отметка продвижения миссии.
function Msg({ from, text, done }) {
  const pick = usePick();
  const name = pick(PL[from]);
  return (
    <div className={'ls-msg' + (done ? ' is-done' : '')} aria-live="polite">
      <span className="ls-ava" aria-hidden="true">{name.charAt(0)}</span>
      <span className="ls-msg-b"><b>{name}</b> {pick(text)}</span>
      {done ? <span className="ls-msg-ok"><Icon name="check" size={14} /></span> : null}
    </div>
  );
}
// Строка задания: подсказка встаёт на её место.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
const stepHint = (hints, misses) => (misses > 0 && hints ? hints[Math.min(hints.length, misses) - 1] : null);
const okText = (s) => hasLetters(s) && !hasTags(s);
const listHtml = (title, tag, items) => buildHtml(title, [blk('h1', 'h1', title)])
  .replace('  </body>', '    <' + tag + '>\n' + items.map((x) => '      <li>' + escHtml(x) + '</li>').join('\n') + '\n    </' + tag + '>\n  </body>');
function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const own = store.get('s14');
  if (!own || !own.done) return null;
  return { type: 'html-page', topic: own.topic, title: own.title, list: own.list, items: own.items, html: listHtml(own.title, own.list, own.items) };
}
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const stepsOf = (pick) => G.steps.map((x, i) => li('st' + i, pick(x)));
const caveOf = (pick, n) => G.cave.slice(0, n).map((x, i) => li('cv' + i, pick(x)));

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. HOOK. Третий шаг в абзаце — потом тот же гайд списком с номерами.
function S1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const done = !!rec;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.ok, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [misses, setMisses] = useState(0);
  const [shake, wobble] = useShake();
  const tries = useRef(0);
  const led = useIdleLed(canTap && !done, misses);
  const tap = (i) => {
    if (!canTap || done) return;
    tries.current += 1;
    if (i === 2) {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's1', type: 'find', correct: true, firstTry: misses === 0, attempts: tries.current });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(i);
    sayNow(stepHint(c.hints, n), 'think');
  };
  const steps = stepsOf(pick);
  const P = c.para;
  const page = done ? (
    <LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.bridgeH) }, { kind: 'list', id: 'L', tag: 'ol', items: steps }]} hl={['st2']} fresh={['L']} />
  ) : (
    <div className="pg ls-pg">
      <p className="ls-para">
        {pick(P.pre)}
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <button type="button" className={'ls-phr' + (shake === i ? ' fx-no' : '')} disabled={!canTap} onClick={() => tap(i)}>
              {low(s.v)}{i === 0 ? <Led on={led} /> : null}
            </button>
            {i < 3 ? pick(P.sep[i]) : pick(P.end)}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="sardor" text={c.msg} done={done} />
      <Ask text={done ? c.askDone : c.ask} hint={done ? null : stepHint(c.hints, misses)} />
      <div className="ls-hook"><MiniBrowser title={pick(G.title)} page={page} cls="mb-tall" /></div>
    </Stage>
  );
}

// ── 2. MISSION.
const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;

// ── 3. SHOW. Пункт на странице ↔ строка li в коде.
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const [seen, setSeen] = useState(() => (rec ? ['cv0', 'cv1', 'cv2'] : []));
  const done = seen.length >= 3;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [cur, setCur] = useState(null);
  const led = useIdleLed(canTap && !done, seen.length);
  const items = caveOf(pick, 3);
  const nodes = [{ kind: 'h2', id: 'h', v: pick(G.caveH) }, { kind: 'list', id: 'L', tag: 'ul', items }];
  const tap = (id) => {
    if (!canTap) return;
    sfx('tap', true);
    setCur(id);
    const next = seen.indexOf(id) >= 0 ? seen : seen.concat(id);
    setSeen(next);
    if (next.length >= 3 && !done) { put({ done: true }); sayNow(c.done, 'cheer'); } else if (seen.length === 0) sayNow(c.each, 'point');
  };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} n={seen.length + '/3'} />
      <Work
        browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} onItem={tap} canTap={canTap} hl={cur ? [cur] : null}
          ledIds={led ? items.filter((x) => seen.indexOf(x.id) < 0).map((x) => x.id) : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src"
          lineProps={(ln) => (ln.id === cur ? { cls: 'is-cur' } : ln.li && seen.indexOf(ln.id) >= 0 ? { cls: 'is-seen' }
            : done && (ln.id === 'L:o' || ln.id === 'L:c') ? { cls: 'is-box' } : null)} />} />
    </Stage>
  );
}

// ── 4. LEVEL-1. Собрать строку <li>Верёвка</li> из деталей.
const PIECES = ['c', 't', 'u', 'o'];
const NEED = ['o', 't', 'c'];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!rec;
  const [round, setRound] = useState(solved ? 1 : 0);
  const [placed, setPlaced] = useState(solved ? NEED : []);
  const [extra, setExtra] = useState(solved && rec.extra);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.why : c.say, pose: solved ? 'rule' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), first = useRef(null);
  const led = useIdleLed(canTap && !solved, round * 10 + placed.length);
  const word = pick(round === 0 ? G.rope : G.map);
  const label = (k) => (k === 'o' ? '<li>' : k === 'c' ? '</li>' : k === 'u' ? '<ul>' : word);
  const tapPiece = (k) => {
    if (!canTap || solved || placed.indexOf(k) >= 0) return;
    tries.current += 1;
    const want = NEED[placed.length];
    if (k === want) {
      sfx('pop', true);
      const np = placed.concat(k);
      setPlaced(np); setMsg(null);
      if (np.length < 3) return;
      // Строка готова. После подробной помощи — ещё одна строка с новым словом.
      if (round === 0 && misses >= 3) {
        if (first.current === null) first.current = false;
        sayNow(joinL(c.praise, c.more), 'cheer');
        setTimeout(() => { setRound(1); setPlaced([]); setMisses(0); setExtra(true); }, reduceMotion() ? 600 : 1500);
        return;
      }
      put({ done: true, extra: round === 1 });
      log({ screenId: 's4', type: 'build-li', correct: true, firstTry: round === 0 && misses === 0, attempts: tries.current,
        followUp: round === 1 ? misses === 0 : null });
      sayNow(joinL(c.praise, c.why), 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(k);
    const m = k === 'u' ? c.err.ul : n >= 3 ? fillL(c.hints[2], { x: label(want) }) : n === 2 ? c.hints[1] : c.err.order;
    setMsg(m); sayNow(m, 'think');
  };
  const items = caveOf(pick, 3);
  const built = placed.length >= 3;
  const ropeItems = round === 1 ? [li('rp', pick(G.rope))] : [];
  const pageItems = items.concat(ropeItems, built ? [li('nw', word)] : []);
  const buildNode = (
    <span className="ls-build">
      {[0, 1, 2].map((i) => {
        const k = placed[i];
        if (!k) return <span key={i} className={'ls-ph' + (i === placed.length ? ' is-next' : '')} aria-hidden="true" />;
        return k === 't' ? <span key={i} className="tk-tx ls-in">{word}</span> : <span key={i} className="ls-in"><Tag tag="li" close={k === 'c'} /></span>;
      })}
    </span>
  );
  const codeItems = items.concat(ropeItems, [li('nw', '', { node: built ? null : buildNode, v: built ? word : '', bare: !built })]);
  const nodes = [{ kind: 'list', id: 'L', tag: 'ul', items: codeItems }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      {round === 0 ? <Msg from="madina" text={c.msg} done={placed.length >= 3} /> : null}
      <Ask text={c.ask} hint={solved ? null : msg} n={extra ? '2/2' : null} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.caveH) }, { kind: 'list', id: 'L', tag: 'ul', items: pageItems }]} fresh={built ? ['nw'] : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src" lineProps={(ln) => (ln.id === 'nw' ? { cls: built ? 'is-new' : 'is-cur' } : null)} />} />
      {!solved ? (
        <div className="ls-pieces" translate="no">
          {PIECES.map((k) => (
            <button key={k + round} type="button" disabled={!canTap || placed.indexOf(k) >= 0}
              className={'ls-piece' + (placed.indexOf(k) >= 0 ? ' is-used' : '') + (shake === k ? ' fx-no' : '')} onClick={() => tapPiece(k)}>
              {k === 't' ? <span className="tk-tx">{word}</span> : <Tag tag={k === 'u' ? 'ul' : 'li'} close={k === 'c'} />}
              <Led on={led && k === NEED[placed.length]} />
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// ── 5. LEVEL-2. Разрезать пункт на запятых: каждый зверь — свой li.
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const [cuts, setCuts] = useState(() => (rec ? [0, 1, 2] : []));
  const done = cuts.length >= 3;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [msg, setMsg] = useState(null);
  const tries = useRef(0), misses = useRef(0);
  const [lastCut, setLastCut] = useState(null);
  const led = useIdleLed(canTap && !done, cuts.length);
  const animals = G.animals.map((x) => pick(x));
  const cut = (i) => {
    if (!canTap || done || cuts.indexOf(i) >= 0) return;
    tries.current += 1;
    sfx('pop', true);
    const nc = cuts.concat(i).sort();
    setCuts(nc); setMsg(null); setLastCut(i);
    if (nc.length >= 3) {
      put({ done: true });
      log({ screenId: 's5', type: 'cut', correct: true, firstTry: misses.current === 0, attempts: tries.current });
      sayNow(c.done, 'cheer');
    }
  };
  const tapWord = () => { if (!canTap || done) return; misses.current += 1; sfx('soft', true); setMsg(c.word); sayNow(c.word, 'think'); };
  // Пункты по разрезам: зверь i начинает новый пункт, если перед ним разрез.
  const segs = [];
  animals.forEach((a, i) => { if (i === 0 || cuts.indexOf(i - 1) >= 0) segs.push([a]); else segs[segs.length - 1].push(a); });
  const items = segs.map((s, i) => li('a' + i, cap(s.join(', '))));
  const nodes = [{ kind: 'list', id: 'L', tag: 'ul', items }];
  const freshId = lastCut !== null ? 'a' + (segs.findIndex((s, k) => k > 0 && animals.indexOf(s[0]) === lastCut + 1)) : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={done ? null : msg} n={cuts.length + '/3'} />
      <div className="ls-strip" translate="no">
        {animals.map((a, i) => (
          <React.Fragment key={i}>
            <button type="button" className="ls-word" disabled={!canTap || done} onClick={tapWord}>{i === 0 ? cap(a) : a}</button>
            {i < 3 ? (
              cuts.indexOf(i) >= 0 ? <span className="ls-cut" aria-hidden="true" /> : (
                <button type="button" className="ls-comma" disabled={!canTap} onClick={() => cut(i)} aria-label=",">
                  ,<Led on={led} />
                </button>
              )
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.whoH) }].concat(nodes)} fresh={freshId ? [freshId] : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src" lineProps={(ln) => (ln.id === freshId ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 6. PREDICT. Строки без li браузер склеивает в одну.
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const [ans, setAns] = useState(rec ? rec.ans : null);
  const [wrapped, setWrapped] = useState(!!rec);
  const done = !!rec;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.wrap : c.say, pose: done ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done && wrapped, spoken);
  const [shown, setShown] = useState(!!rec);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const led = useIdleLed(canTap && !ans, 0);
  const pickAns = (k) => {
    if (!canTap || ans) return;
    const right = k === 'line';
    setAns(k); setShown(true);
    sfx(right ? 'ok' : 'soft', true);
    put({ ans: k });
    log({ screenId: 's6', type: 'predict', correct: right, firstTry: right, attempts: 1 });
    sayNow(joinL(right ? c.right : c.miss, c.wrap), right ? 'cheer' : 'explain');
    setTimeout(() => { if (alive.current) setWrapped(true); }, reduceMotion() ? 800 : 3200);
  };
  const animals = G.animals.map((x) => cap(pick(x)));
  const rawNodes = animals.map((a, i) => ({ kind: 'raw', id: 'r' + i, v: a }));
  const listNodes = [{ kind: 'list', id: 'L', tag: 'ul', items: animals.map((a, i) => li('r' + i, a)) }];
  const nodes = wrapped ? listNodes : rawNodes;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <Work
        browser={<MiniBrowser title={pick(G.title)} page={shown ? <LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.whoH) }].concat(nodes)} fresh={wrapped ? ['L'] : ['h']} /> : (
          <div className="pg ls-pg"><h2 className="ls-h2">{pick(G.whoH)}</h2><p className="ls-q mono">?</p></div>)} />}
        code={<Src lines={lsLines([{ kind: 'h2', id: 'h', v: pick(G.whoH) }].concat(nodes))} className="ls-src"
          lineProps={(ln) => (wrapped && ln.li ? { cls: 'is-new' } : null)} />} />
      <div className="ls-opts" role="group">
        {['dots', 'col', 'line'].map((k) => (
          <button key={k} type="button" disabled={!canTap || !!ans}
            className={'ls-opt' + (ans === k ? (k === 'line' ? ' is-ok' : ' is-off') : '') + (ans && ans !== k && k === 'line' ? ' is-real' : '')}
            onClick={() => pickAns(k)}>
            <span className={'ls-art is-' + k} aria-hidden="true"><i /><i /><i /></span>
            <span>{pick(c.opts[k])}</span>
            <Led on={led} />
          </button>
        ))}
      </div>
    </Stage>
  );
}

// ── 7. SHOW. Пара ul → ol: вид списка задаёт открывающий тег.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const [open, setOpen] = useState(rec ? 'ol' : 'ul');
  const [close, setClose] = useState(rec ? 'ol' : 'ul');
  const done = open === 'ol' && close === 'ol';
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (open === 'ol' ? 1 : 0) + (close === 'ol' ? 2 : 0));
  const flip = (which) => {
    if (!canTap || done) return;
    sfx('tap', true);
    const no = which === 'o' ? 'ol' : open, nc = which === 'c' ? 'ol' : close;
    if (which === 'o') setOpen('ol'); else setClose('ol');
    if (no === 'ol' && nc === 'ol') { put({ done: true }); sayNow(c.done, 'cheer'); return; }
    sayNow(which === 'o' ? c.openFirst : c.closeFirst, 'explain');
  };
  const steps = stepsOf(pick);
  const nodes = [{ kind: 'h2', id: 'h', v: pick(G.bridgeH) }, { kind: 'list', id: 'L', tag: open, openTag: open, closeTag: close, items: steps }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Inspector rules={[{ id: 'pair', ok: open === close, text: c.rule }]} />
      <Ask text={c.ask} n={(open === 'ol' ? 1 : 0) + (close === 'ol' ? 1 : 0) + '/2'} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src"
          zone={(z) => (z === 'L:o' && open === 'ul' ? { tap: true, disabled: !canTap, led, cls: 'ls-flip' }
            : z === 'L:c' && close === 'ul' ? { tap: true, disabled: !canTap, led, cls: 'ls-flip' } : null)}
          onZone={(z) => flip(z === 'L:o' ? 'o' : 'c')} />} />
    </Stage>
  );
}

// ── 8. LEVEL-3. Вставить шаг в нужное место — номера пересчитает браузер.
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!rec;
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, misses);
  const steps = stepsOf(pick);
  const items = solved ? steps.slice(0, 2).concat([li('tie', pick(G.tie))], steps.slice(2)) : steps;
  const nodes = [{ kind: 'list', id: 'L', tag: 'ol', items }];
  // Три места: рано (после дерева), верно (после досок), поздно (после моста).
  const slotIds = ['st0', 'st1', 'st2'];
  const place = (after) => {
    if (!canTap || solved) return;
    tries.current += 1;
    if (after === 'st1') {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's8', type: 'insert', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(after);
    const early = after === 'st0';
    const m = n >= 2 ? stepHint(c.hints, n - 1) : (early ? c.early : c.late);
    setMsg(early ? c.early : c.late);
    sayNow(n >= 2 ? joinL(early ? c.early : c.late, m) : m, 'think');
  };
  const shownHint = solved ? null : (misses >= 2 ? stepHint(c.hints, misses - 1) : msg);
  const lines = solved ? lsLines(nodes) : withSlots(lsLines(nodes), slotIds);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="aziz" text={c.msg} done={solved} />
      <Ask text={c.ask} hint={shownHint} />
      {!solved ? <div className="ls-card-new mono" translate="no"><Tag tag="li" />{pick(G.tie)}<Tag tag="li" close /></div> : null}
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes}
        fresh={solved ? ['tie'] : null} flash={solved ? ['st2', 'st3'] : null} />} />}
        code={<Src lines={lines} className="ls-src" numbers={solved}
          lineProps={(ln) => (ln.slot ? {
            onTap: () => place(ln.after), disabled: !canTap, led: led && misses >= 3 && ln.after === 'st1',
            cls: 'ls-slot' + (shake === ln.after ? ' fx-no' : ''), content: <span className="ls-slot-l">{pick(UI.here)}</span>
          } : ln.id === 'tie' ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 9. LEVEL-4. ul или ol: промах — пункты перемешиваются на глазах.
const SHUF = [2, 0, 1];
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!rec;
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const R = c.rounds[r];
  const [got, setGot] = useState(solved);
  const [tried, setTried] = useState([]);
  const [shuf, setShuf] = useState(false);
  const [msg, setMsg] = useState(null);
  const [shake, wobble, alive] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !got, r * 10 + tried.length);
  const choose = (t) => {
    if (!canTap || got || tried.indexOf(t) >= 0) return;
    tries.current += 1;
    if (t === R.want) {
      sfx('ok', true); setGot(true); setMsg(null); setShuf(false);
      const ok = t === 'ol' ? c.okOl : c.okUl;
      if (r === c.rounds.length - 1) {
        put({ done: true });
        log({ screenId: 's9', type: 'choose-list', correct: true, firstTry: misses.current === 0, attempts: tries.current });
        sayNow(joinL(ok, c.done), 'cheer');
        return;
      }
      sayNow(ok, 'smile');
      setTimeout(() => { if (!alive.current) return; setR((v) => v + 1); setGot(false); setTried([]); }, reduceMotion() ? 900 : 1800);
      return;
    }
    misses.current += 1;
    sfx('soft', true); wobble(t);
    setTried((x) => x.concat(t)); setShuf(true);
    const m = R.want === 'ol' ? c.missOl : c.missUl;
    setMsg(m); sayNow(m, 'think');
  };
  const order = shuf && !got ? SHUF : [0, 1, 2];
  const Tg = got ? R.want : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={got ? null : msg} n={(r + 1) + '/' + c.rounds.length} />
      <div className="ls-card" key={r}>
        <b className="ls-card-t">{pick(R.title)}</b>
        {Tg ? React.createElement(Tg, { className: 'ls-card-l ls-' + Tg }, R.items.map((x, i) => <li key={i}>{pick(x)}</li>)) : (
          <div className={'ls-card-l is-plain' + (shuf ? ' is-shuf' : '')}>
            {order.map((k) => <div key={k + (shuf ? 's' : '')} className="ls-card-i">{pick(R.items[k])}</div>)}
            {shuf ? <span className="ls-shuf-l">{pick(UI.shuffled)}</span> : null}
          </div>
        )}
      </div>
      <div className="ls-pick" translate="no">
        {['ul', 'ol'].map((t) => {
          const off = tried.indexOf(t) >= 0;
          return (
            <button key={t} type="button" disabled={!canTap || got || off} style={{ '--c': TAGC[t] }}
              className={'ls-pick-b mono' + (got && t === R.want ? ' is-on' : '') + (off ? ' is-off' : '') + (shake === t ? ' fx-no' : '')}
              onClick={() => choose(t)}>
              <span className={'ls-ic ls-ic-' + t} aria-hidden="true"><i /><i /><i /></span>{'<' + t + '>'}
              <Led on={!got && !off && (tried.length > 0 || led)} />
            </button>
          );
        })}
      </div>
    </Stage>
  );
}

// ── 10. CHECK-1. Где кончается список: нажать место для </ul>.
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!rec;
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, misses);
  const items = caveOf(pick, 2);
  const tail = [{ kind: 'h2', id: 'bh', v: pick(G.beastsH) }, { kind: 'p', id: 'bp', v: pick(G.beastsP) }];
  const head = { kind: 'h2', id: 'h', v: pick(G.caveH) };
  const nodes = solved ? [head, { kind: 'list', id: 'L', tag: 'ul', items, freshClose: true }].concat(tail)
    : [head, { kind: 'list', id: 'L', tag: 'ul', items, tail, noClose: true }];
  const place = (after) => {
    if (!canTap || solved) return;
    tries.current += 1;
    if (after === 'cv1') {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's10', type: 'close-place', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(after);
    const inside = after === 'cv0';
    const base = inside ? c.inside : c.late;
    setMsg(base);
    const h = n >= 2 ? stepHint(c.hints, n - 1) : null;
    sayNow(h ? joinL(base, h) : base, 'think');
  };
  const shownHint = solved ? null : (misses >= 2 ? stepHint(c.hints, misses - 1) : msg);
  const lines = solved ? lsLines(nodes) : withSlots(lsLines(nodes), ['cv0', 'cv1', 'bh']);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="madina" text={c.msg} done={solved} />
      <Ask text={c.ask} hint={shownHint} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} fresh={solved ? ['bh', 'bp'] : null} />} />}
        code={<Src lines={lines} className="ls-src" numbers={solved}
          lineProps={(ln) => (ln.slot ? {
            onTap: () => place(ln.after), disabled: !canTap, led: led && misses >= 3 && ln.after === 'cv1',
            cls: 'ls-slot' + (shake === ln.after ? ' fx-no' : ''), content: <span className="ls-slot-l">{pick(UI.here)}</span>
          } : ln.fresh ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 11. LEVEL-5. Набрать </ol>: раздел «Советы» выходит из списка.
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!rec;
  const ty = useTagTyping({ max: 8 });
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.praise : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !solved && !ty.val, 0);
  const win = () => {
    sfx('win', true); setMsg(null); put({ done: true });
    log({ screenId: 's11', type: 'type-close', correct: true, firstTry: misses.current === 0, attempts: tries.current + 1 });
    sayNow(c.praise, 'cheer');
  };
  useEffect(() => { if (!solved && normTag(ty.val) === '</ol>') win(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const issue = tagTypingIssue(ty.val, 'ol', c.typeMsg);
    if (!issue) { win(); return; }
    misses.current += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
  };
  const steps = stepsOf(pick).slice(0, 3);
  const tips = { kind: 'h2', id: 'tp', v: pick(G.tipsH) };
  const input = (
    <span className={'ls-inp' + (led ? ' is-led' : '')}>
      <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check}
        placeholder={L3('</…>', '</…>', '</…>')} label={c.ask} max={8} cls="tk-input-tag" /><Led on={led} />
    </span>
  );
  const codeNodes = solved ? [{ kind: 'list', id: 'L', tag: 'ol', items: steps }, tips]
    : [{ kind: 'list', id: 'L', tag: 'ol', items: steps, noClose: true }, { kind: 'line', id: 'gap', node: input }, tips];
  const pageNodes = solved ? [{ kind: 'list', id: 'L', tag: 'ol', items: steps }, tips]
    : [{ kind: 'list', id: 'L', tag: 'ol', items: steps, tail: [tips] }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.hintSay} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="ls-typing" browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={pageNodes} fresh={solved ? ['tp'] : null} />} />}
        code={<Src lines={lsLines(codeNodes)} className="ls-src" lineProps={(ln) => (ln.gap ? { cls: 'is-gap' } : null)} />} />
      {!solved ? <KeyRow keys={['<', '/', 'o', 'u', 'l', '>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 12. CHECK-2. Жалобы игроков: найти строку, которая стоит не так.
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!rec;
  const [k, setK] = useState(solved ? 2 : 0);
  const [fixed, setFixed] = useState(solved);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble, alive] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !fixed && misses >= 3, k * 10 + misses);
  const cave = caveOf(pick, 3);
  const steps = stepsOf(pick).slice(0, 3);
  const potion = C.s9.rounds[0].items.map((x, i) => li('po' + i, pick(x)));
  const CASES = [
    { bad: [{ kind: 'list', id: 'L', tag: 'ul', items: cave.slice(0, 2) }, { kind: 'li', id: 'cv2', v: cave[2].v }],
      good: [{ kind: 'list', id: 'L', tag: 'ul', items: cave }], hit: (id) => id === 'cv2', fix: 'cv2' },
    { bad: [{ kind: 'list', id: 'L', tag: 'ol', items: steps.map((x, i) => li(x.id, (i + 1) + '. ' + x.v)) }],
      good: [{ kind: 'list', id: 'L', tag: 'ol', items: steps }], hit: (id) => /^st/.test(id), fix: 'L' },
    { bad: [{ kind: 'list', id: 'L', tag: 'ul', items: potion }], good: [{ kind: 'list', id: 'L', tag: 'ol', items: potion }],
      hit: (id) => id === 'L:o' || id === 'L:c', fix: 'L:o' }
  ];
  const cs = CASES[k];
  const cc = c.cases[k];
  const tapLine = (ln) => {
    if (!canTap || fixed) return;
    stat.current.tries += 1;
    if (cs.hit(ln.id)) {
      sfx('ok', true); setFixed(true); setMsg(null);
      if (k === 2) {
        put({ done: true });
        log({ screenId: 's12', type: 'detective', correct: true, firstTry: stat.current.misses === 0, attempts: stat.current.tries, hints: stat.current.misses });
        sayNow(joinL(cc.why, c.done), 'cheer');
        return;
      }
      sayNow(cc.why, 'smile');
      setTimeout(() => { if (!alive.current) return; setK((v) => v + 1); setFixed(false); setMisses(0); }, reduceMotion() ? 1200 : 2400);
      return;
    }
    stat.current.misses += 1;
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(ln.id);
    const h = stepHint(cc.hints, n);
    setMsg(h);
    sayNow(joinL(c.other, h), 'think');
  };
  const nodes = fixed ? cs.good : cs.bad;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="ls-case">
        <span className="ls-case-n mono">{pick(UI.complaint)} {k + 1}/3</span>
        <Msg from={cc.from} text={cc.msg} done={fixed} />
      </div>
      <Ask text={solved ? c.done : c.ask} hint={fixed ? null : msg} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} flash={fixed ? ['L', 'cv2'] : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src"
          lineProps={(ln) => (fixed ? (ln.id === cs.fix || (cs.fix === 'L' && ln.li) ? { cls: 'is-new' } : null)
            : { onTap: () => tapLine(ln), disabled: !canTap, led: led && cs.hit(ln.id), cls: (shake === ln.id ? 'fx-no' : '') + (ln.stray ? ' is-stray' : '') })} />} />
    </Stage>
  );
}

// ── 13. TRANSFER. Написать строку <li>Азиз</li> целиком.
// Разбор строки: пробелы у уголков и регистр не важны.
const normLine = (s) => String(s || '').trim().replace(/<\s*\/\s*/g, '</').replace(/<\s+/g, '<').replace(/\s+>/g, '>');
function liIssue(raw, msgs) {
  const s = normLine(raw);
  const m = s.match(/^<li>(.*)<\/li>$/i);
  if (m && okText(m[1].trim())) return null;
  if (!/^<li>/i.test(s)) return /^<\/?[a-z]+>/i.test(s) && !/^<\/?li>/i.test(s) ? msgs.wrongTag : msgs.noOpen;
  const rest = s.slice(4);
  const textPart = rest.split('<')[0];
  if (!okText(textPart.trim())) return msgs.noText;
  const tail = rest.slice(textPart.length);
  if (!tail) return msgs.noClose;
  if (/^<li>/i.test(tail)) return msgs.needSlash;
  if (/^<\/[a-z]*>?$/i.test(tail) && !/^<\/li>$/i.test(tail)) return /^<\/li/i.test(tail) ? msgs.noClose : msgs.wrongTag;
  return msgs.noClose;
}
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const solved = !!rec;
  const ty = useTagTyping({ max: 30 });
  const [msg, setMsg] = useState(null);
  const [misses, setMisses] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.praise : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved && !ty.val, 0);
  const win = (text) => {
    sfx('win', true); setMsg(null); put({ done: true, v: text });
    log({ screenId: 's13', type: 'write-li', correct: true, firstTry: misses === 0, attempts: tries.current + 1, hints: misses });
    sayNow(c.praise, 'cheer');
  };
  useEffect(() => {
    if (solved) return;
    const m = normLine(ty.val).match(/^<li>(.*)<\/li>$/i);
    if (m && okText(m[1].trim())) win(m[1].trim());
  }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const issue = liIssue(ty.val, c.msgs);
    if (!issue) return;
    const n = misses + 1;
    setMisses(n); sfx('soft', true);
    const h = n >= 2 ? stepHint(c.hints, n - 1) : null;
    setMsg(h ? joinL(issue, h) : issue);
    sayNow(h ? joinL(issue, h) : issue, 'think');
  };
  // Превью растёт по мере набора: после <li> на странице появляется пункт.
  const s = normLine(ty.val);
  const live = solved ? rec.v : (/^<li>/i.test(s) ? s.slice(4).split('<')[0] : '');
  const top = C.s9.rounds[2].items.map((x, i) => li('tp' + i, pick(x)));
  const input = (
    <span className={'ls-inp ls-inp-wide' + (led ? ' is-led' : '')}>
      <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check}
        placeholder={L3('<li>…</li>', '<li>…</li>', '<li>…</li>')} label={c.ask} max={30} cls="tk-input-tag" /><Led on={led} />
    </span>
  );
  const codeNodes = [{ kind: 'h2', id: 'h', v: pick(G.topH) }, { kind: 'list', id: 'L', tag: 'ol',
    items: top.slice(0, 2), tail: solved ? [] : [{ kind: 'line', id: 'gap', node: input }] }];
  if (solved) codeNodes[1].items = top.slice(0, 2).concat([li('me', rec.v)]);
  const pageNodes = [{ kind: 'h2', id: 'h', v: pick(G.topH) }, { kind: 'list', id: 'L', tag: 'ol',
    items: top.slice(0, 2).concat(live ? [li('me', live)] : []) }];
  // Строка ввода стоит внутри ol — с отступом пункта.
  const lines = lsLines(codeNodes).map((ln) => (ln.gap ? Object.assign({}, ln, { d: 1 }) : ln));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="aziz" text={c.msg} done={solved} />
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="ls-typing" browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={pageNodes} fresh={live ? ['me'] : null} />} />}
        code={<Src lines={lines} className="ls-src" lineProps={(ln) => (ln.gap ? { cls: 'is-gap' } : ln.id === 'me' ? { cls: 'is-new' } : null)} />} />
      {!solved ? <KeyRow keys={['<', '/', 'l', 'i', '>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 14. RESULT. Свой раздел гайда: тема → ul или ol → «+ li» и три пункта.
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const [rec, put] = useRec('s14');
  const [topic, setTopic] = useState(rec ? rec.topic : null);
  const [list, setList] = useState(rec ? rec.list : null);
  const [items, setItems] = useState(rec ? rec.items : []);
  const [tried, setTried] = useState([]);
  const [msg, setMsg] = useState(null);
  const done = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const T0 = c.topics.find((t) => t.id === topic);
  const phase = !topic ? 'topic' : !list ? 'list' : done ? 'done' : 'items';
  const filled = items.filter(okText).length;
  const led = useIdleLed(canTap && !done, phase === 'items' ? 10 + items.length : phase === 'list' ? 1 : 0);
  const tries = useRef(0);
  const chooseList = (t) => {
    if (!canTap || list || tried.indexOf(t) >= 0) return;
    tries.current += 1;
    if (t === T0.want) { sfx('ok', true); setList(t); setMsg(null); sayNow(c.okList, 'smile'); return; }
    sfx('soft', true); setTried((x) => x.concat(t));
    const m = T0.want === 'ol' ? c.missOl : c.missUl;
    setMsg(m); sayNow(m, 'think');
  };
  const addLi = () => { if (!canTap || items.length >= 5) return; sfx('pop', true); setItems((xs) => xs.concat('')); };
  useEffect(() => {
    if (phase !== 'items' || filled < 3 || items.some(hasTags)) return undefined;
    const t = setTimeout(() => {
      const title = pick(T0.label);
      const own = items.filter(okText).map((x) => x.trim());
      put({ done: true, topic, list, items: own, title });
      log({ screenId: 's14', type: 'project', correct: true, firstTry: tries.current === 1, attempts: tries.current });
      sfx('win', true); sayNow(c.done, 'cheer');
    }, 1000);
    return () => clearTimeout(t);
  }, [items, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const setAt = (i, v) => setItems((xs) => xs.map((x, j) => (j === i ? v : x)));
  const title = T0 ? pick(T0.label) : '';
  const tag = list || 'ul';
  const pageNodes = T0 ? [{ kind: 'h2', id: 'h', v: title }].concat(list ? [{ kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, okText(x) ? x : '')) }] : []) : [];
  const codeNodes = T0 ? [{ kind: 'h2', id: 'h', v: title }].concat(list ? [{ kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, x, {
    node: phase === 'items' ? <span className="ls-inp"><InlineInput value={x} onChange={(v) => setAt(i, v)} label={c.askItems} max={30} placeholder={i === 0 ? T0.ex : L3('…', '…', '…')} /></span> : null })) }] : []) : [];
  const askText = phase === 'topic' ? c.askTopic : phase === 'list' ? c.askList : phase === 'items' ? c.askItems : c.done;
  const hintVoice = phase === 'items' ? c.hintItems : askText;
  const tagMsg = phase === 'items' && items.some(hasTags) ? c.noTags : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintVoice} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={phase === 'list' ? msg : tagMsg} n={phase === 'items' ? Math.min(filled, 3) + '/3' : null} />
      {phase === 'topic' ? (
        <div className="ls-topics">
          {c.topics.map((t) => (
            <button key={t.id} type="button" className="ls-topic" disabled={!canTap} onClick={() => { sfx('tap', true); setTopic(t.id); }}>
              {pick(t.label)}<Led on={led} />
            </button>
          ))}
        </div>
      ) : (
        <>
          <Work cls="ls-typing" browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={pageNodes} />} />}
            code={<Src lines={lsLines(codeNodes)} className="ls-src" />} />
          {phase === 'list' ? (
            <div className="ls-pick" translate="no">
              {['ul', 'ol'].map((t) => (
                <button key={t} type="button" disabled={!canTap || tried.indexOf(t) >= 0} style={{ '--c': TAGC[t] }}
                  className={'ls-pick-b mono' + (tried.indexOf(t) >= 0 ? ' is-off' : '')} onClick={() => chooseList(t)}>
                  <span className={'ls-ic ls-ic-' + t} aria-hidden="true"><i /><i /><i /></span>{'<' + t + '>'}
                  <Led on={led && (tried.length ? t === T0.want : true)} />
                </button>
              ))}
            </div>
          ) : null}
          {phase === 'items' ? (
            <div className="ls-add" translate="no">
              <button type="button" className={'ls-add-b' + (led && filled >= items.length ? ' is-led' : '')} disabled={!canTap || items.length >= 5}
                onClick={addLi}>{'+ li'}<Led on={led && filled >= items.length} /></button>
            </div>
          ) : null}
        </>
      )}
    </Stage>
  );
}

// ── 15. ACHIEVEMENT. Свой раздел и его код — сохранить.
function S15({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s15;
  const [rec, put] = useRec('s15');
  const saved = !!(rec && rec.saved);
  const own = store.get('s14');
  const title = own ? own.title : pick(G.caveH);
  const tag = own ? own.list : 'ul';
  const items = own ? own.items : G.cave.map((x) => pick(x));
  const [speaker, , spoken, sayNow] = useVoice([{ text: saved ? c.saved : c.say, pose: saved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(saved, spoken);
  const [view, setView] = useState('result');
  const led = useIdleLed(canTap && !saved, 0);
  const save = () => {
    if (!canTap || saved) return;
    sfx('win', true);
    store.set('artifact', { type: 'html-page', topic: own ? own.topic : null, title, list: tag, items, html: listHtml(title, tag, items) });
    put({ saved: true });
    sayNow(c.saved, 'cheer');
  };
  const nodes = [{ kind: 'h2', id: 'h', v: title }, { kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, x)) }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="site-top">
        <span className="site-author">{pick(UI.author)}: <b>{p.name}</b></span>
        <div className="only-narrow">
          <SegToggle value={view} onChange={setView} options={[{ v: 'result', label: UI.result }, { v: 'code', label: UI.code }]} />
        </div>
      </div>
      <div className={'site view-' + view}>
        <div className="site-b"><MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} />} cls="mb-site" /></div>
        <div className="site-c"><Src lines={lsLines(nodes)} className="src-site ls-src" /></div>
      </div>
      {saved ? (
        <div className="saved-stamp fx-ok"><Icon name="check" size={18} />{pick(UI.saved)}</div>
      ) : (
        <button type="button" className={'bigbtn' + (led ? ' is-led' : '')} disabled={!canTap} onClick={save}>
          <span className="bigbtn-in"><Icon name="save" size={20} />{pick(UI.save)}</span>
          <Led on={led} />
        </button>
      )}
    </Stage>
  );
}

// ── 16. PREVIEW. Итог и мостик к уроку о ссылках.
function S16({ p }) {
  const pick = usePick();
  const c = C.s16;
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'bye' }]);
  const canGo = useAdvanceGate(true, spoken);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.say}
      nav={<NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} />}>
      <div className="recap">
        <div className="ls-recap" aria-hidden="true" translate="no">
          <ul className="ls-list ls-ul"><li>ul</li><li>li</li></ul>
          <ol className="ls-list ls-ol"><li>ol</li><li>li</li></ol>
        </div>
        <div className="skills">
          {c.skills.map((sk, i) => (
            <div className="skill-row" key={i} style={{ animationDelay: (0.2 + i * 0.12) + 's' }}>
              <span className="skill-tick"><Icon name="check" size={14} /></span>
              {pick(sk)}
            </div>
          ))}
        </div>
        <div className="bye-next next-card">
          <span className="bye-next-ic"><Icon name="browser" size={26} /></span>
          <span className="bye-next-t">
            <span>{pick(UI.nextLesson)}</span>
            <b>{pick(c.next)}</b>
          </span>
          <span className="next-tags mono" translate="no">a · href</span>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'PREDICT', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's9', code: 'LEVEL-4', Comp: S9 },
  { id: 's10', code: 'CHECK-1', Comp: S10 }, { id: 's11', code: 'LEVEL-5', Comp: S11 }, { id: 's12', code: 'CHECK-2', Comp: S12 },
  { id: 's13', code: 'TRANSFER', Comp: S13 }, { id: 's14', code: 'RESULT', Comp: S14 }, { id: 's15', code: 'ACHIEVEMENT', Comp: S15 },
  { id: 's16', code: 'PREVIEW', Comp: S16 }
];
// «Повторить» стирает только этот экран; свой раздел (s14) и сохранённую
// страницу (artifact) повтор других экранов не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], s15: ['s15'] };

export default function HtmlLesson03v2({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store) })
  });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenList(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenList>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenList>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА: стили урока 2 (код, браузер, клавиши, проверка …) + свои (ls-…).
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:ls-own.css@*/
`;
