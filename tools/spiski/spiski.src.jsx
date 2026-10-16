// =============================================================================
// ===== УРОК 3 · «Списки» · модуль 1 «Основы разметки» · ТЕСТОВАЯ ВЕРСИЯ =====
//
// Возраст 11–14. Сценарий утверждён: docs/scenarij-03-spiski.md.
//
// ЗАМЫСЕЛ. Продолжение урока 2: Коди собирается на турнир по робофутболу.
// Перечень вещей, записанный абзацем, трудно читать — его превращаем в список.
// ul — список с точками (порядок не важен), ol — с номерами (порядок важен,
// номера ставит браузер), li — один пункт, живёт только внутри ul или ol.
//
// ДУГА. Крючок (сосчитай вещи) → план → ul/li: показ → допиши пункт → из
// абзаца в список → ol: переключи ol/ul → угадай номер → лишние цифры →
// какой список нужен → пункт сбежал → закрой список → HTML-детектив → новый
// раздел → свой проект → моя страница → итог.
//
// МОДЕЛЬ. Страница — список узлов: { kind: 'p'|'h1'|'h2', id, v },
// { kind: 'list', id, tag: 'ul'|'ol', items: [{ id, v, noClose? }] },
// { kind: 'li', id, v } (пункт вне списка). Из неё строятся и строки кода, и
// страница в мини-браузере: там настоящие <ul>/<ol>, номера ставит браузер.
//
// Помощники и стили урока 2 вставляются при сборке (tools/spiski/spiski.build.mjs).
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
  save: L3('Sahifani saqlash', 'Сохранить страницу', 'Save the page'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  item: L3('band', 'пункт', 'item'),
  caseN: L3('Ish', 'Дело', 'Case'),
  step: L3('Qadam', 'Шаг', 'Step')
};

// Данные урока: вещи на турнир и шаги подготовки робота — на языке ученика.
const D = {
  title: L3('Robofutbol', 'Робофутбол', 'Robot Football'),
  take: L3('Olib ketish kerak:', 'Взять с собой:', 'Take with me:'),
  things: [L3('robot', 'робот', 'robot'), L3('pult', 'пульт', 'remote'), L3('zaryadka', 'зарядка', 'charger'),
    L3('zaxira g‘ildiraklar', 'запасные колёса', 'spare wheels'), L3('suv', 'вода', 'water')],
  steps: [L3('Batareyani zaryadlang', 'Заряди батарею', 'Charge the battery'), L3('Robotni yoqing', 'Включи робота', 'Turn on the robot'),
    L3('Maydonga chiqing', 'Выйди на поле', 'Go onto the field')],
  stepIns: L3('Pultni tekshiring', 'Проверь пульт', 'Check the remote'),
  stepIns2: L3('Formani kiying', 'Надень форму', 'Put on the uniform'),
  good: L3('Turnirda omad!', 'Удачи на турнире!', 'Good luck at the tournament!'),
  h1: L3('Robofutbol turniri', 'Турнир по робофутболу', 'Robot Football Tournament'),
  intro: L3('Turnir shanba kuni bo‘ladi.', 'Турнир пройдёт в субботу.', 'The tournament is on Saturday.')
};
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики героя звучат; подписи (eyebrow, ask, подписи)
// печатаются. Тексты — из утверждённого сценария.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Turnirga tayyorgarlik', 'Сборы на турнир', 'Getting ready'),
    cast: [
      { pose: 'hello', text: L3('Salom! Yana men, Kodi. Ertaga robofutbol turniri!', 'Привет! Снова я, Коди. Завтра турнир по робофутболу!', 'Hi! Kodi again. The robot football tournament is tomorrow!') },
      { pose: 'curious', text: L3('Men nimalarni olishimni yozdim. Lekin sanab chiqish qiyin.', 'Я записал, что взять с собой. Но сосчитать вещи трудно.', 'I wrote down what to take. But it is hard to count the things.') },
      { pose: 'point', text: L3('Sanab ko‘ring: nechta narsa olish kerak?', 'Посчитай: сколько вещей нужно взять?', 'Count them: how many things should I take?') }
    ],
    ok: L3('To‘g‘ri, beshta! Endi qarang: ro‘yxatda har bir narsa alohida qatorda.', 'Верно, пять! А теперь смотри: в списке каждая вещь на своей строке.', 'Right, five! Now look: in a list, each thing is on its own line.'),
    miss: L3('Qarang, ro‘yxatda sanash oson: narsalar beshta. Har biri alohida qatorda.', 'Смотри, в списке считать легко: вещей пять. Каждая — на своей строке.', 'Look, a list is easy to count: there are five things. Each is on its own line.'),
    ask: L3('Nechta narsa? Sonni bosing', 'Сколько вещей? Нажми число', 'How many things? Tap the number'),
    askDone: L3('Ro‘yxatda hammasi bir qarashda ko‘rinadi', 'В списке всё видно с первого взгляда', 'In a list, everything is clear at a glance')
  },

  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Bugun ro‘yxatlar qilamiz. Uch qadam.', 'Сегодня делаем списки. Три шага.', 'Today we make lists. Three steps.'),
    steps: [
      { icon: 'list', text: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list'),
        say: L3('Avval nuqtali ro‘yxat: tartib muhim bo‘lmaganda.', 'Сначала список с точками — когда порядок не важен.', 'First a bulleted list, for when order does not matter.') },
      { icon: 'listN', text: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
        say: L3('Keyin raqamli ro‘yxat: qadamlar tartib bilan bo‘lganda.', 'Потом список с номерами — когда важен порядок шагов.', 'Then a numbered list, for when the order of steps matters.') },
      { icon: 'browser', text: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
        say: L3('Oxirida o‘z sahifangizni ro‘yxat bilan yasaysiz.', 'А в конце ты сделаешь свою страницу со списком.', 'And at the end you will make your own page with a list.') }
    ],
    done: L3('Boshladik!', 'Начинаем!', 'Let’s start!')
  },

  s3: {
    eyebrow: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list'),
    cast: [
      { pose: 'explain', text: L3('Bu ro‘yxat kodi. <ul> — butun ro‘yxat qutisi. U nuqtali ro‘yxatni ochadi va yopadi.', 'Вот код списка. <ul> — коробка всего списка. Он открывает и закрывает список с точками.', 'Here is the code of a list. <ul> is the box for the whole list. It opens and closes a bulleted list.') },
      { pose: 'point', text: L3('Ichida <li> qatorlari. Har bir <li> — bitta band. Har bir <li> qatorini bosing.', 'Внутри — строки <li>. Каждая <li> — один пункт. Нажми каждую строку <li>.', 'Inside are <li> lines. Each <li> is one item. Tap each <li> line.') }
    ],
    each: L3('Bu <li> — sahifada bitta nuqta va bitta band.', 'Эта <li> — одна точка и один пункт на странице.', 'This <li> is one bullet and one item on the page.'),
    done: L3('Uchta <li> — uchta band. Nuqtalarni brauzer o‘zi qo‘yadi.', 'Три <li> — три пункта. Точки браузер ставит сам.', 'Three <li> tags make three items. The browser adds the bullets itself.'),
    ask: L3('Har bir li qatorini bosing', 'Нажми каждую строку li', 'Tap each li line')
  },

  s4: {
    eyebrow: L3('Yangi band', 'Новый пункт', 'New item'),
    say: L3('Suv esdan chiqdi. Bo‘sh <li> qatoriga yana bitta narsa yozing.', 'Я забыл воду. Напиши ещё одну вещь в пустую строку <li>.', 'I forgot the water. Write one more thing in the empty <li> line.'),
    noTags: L3('Bu yerga faqat so‘z, burchaksiz.', 'Здесь только слово, без уголков.', 'Only a word here, no angle brackets.'),
    praise: L3('Yangi band sahifada paydo bo‘ldi — nuqtasi bilan.', 'Новый пункт появился на странице — сразу с точкой.', 'The new item appeared on the page, with its bullet.'),
    ask: L3('Bo‘sh li ichiga narsa yozing', 'Напиши вещь внутри пустой li', 'Write a thing inside the empty li')
  },

  s5: {
    eyebrow: L3('Abzatsdan ro‘yxatga', 'Из абзаца — в список', 'From paragraph to list'),
    say: L3('Endi o‘zingiz. Abzatsdagi har bir narsani bosing — u <li> ga aylanadi.', 'Теперь сам. Нажимай вещи в абзаце — каждая станет <li>.', 'Now you. Tap each thing in the paragraph and it becomes an <li>.'),
    outOfOrder: L3('Ro‘yxat abzatsdagi tartibni saqlaydi. Chapdagi birinchisini oling.', 'Список сохраняет порядок абзаца. Возьми первую слева.', 'The list keeps the paragraph order. Take the first one on the left.'),
    done: L3('Abzats ro‘yxatga aylandi: to‘rtta narsa — to‘rtta <li>.', 'Абзац стал списком: четыре вещи — четыре <li>.', 'The paragraph became a list: four things, four <li> tags.'),
    ask: L3('Abzatsdagi narsalarni tartib bilan bosing', 'Нажимай вещи в абзаце по порядку', 'Tap the things in the paragraph in order')
  },

  s6: {
    eyebrow: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
    cast: [
      { pose: 'explain', text: L3('Robotni tayyorlash — qadamlar. Bu yerda tartib muhim. Buning uchun <ol> — raqamli ro‘yxat.', 'Подготовка робота — это шаги. Здесь важен порядок. Для этого есть <ol> — список с номерами.', 'Getting the robot ready is a set of steps. Order matters here. For that there is <ol>, a numbered list.') },
      { pose: 'point', text: L3('Ochuvchi tegni bosing: ol va ul almashadi. Ikkala ko‘rinishni ham ko‘ring.', 'Нажми на открывающий тег: ol и ul поменяются. Посмотри оба вида.', 'Tap the opening tag: ol and ul swap. Look at both views.') }
    ],
    toUl: L3('<ul> — nuqtalar. Qadamlar tartibi ko‘rinmay qoldi.', '<ul> — точки. Порядок шагов пропал.', '<ul> gives bullets. The order of the steps is gone.'),
    toOl: L3('<ol> — raqamlar. Ularni brauzer o‘zi qo‘ydi.', '<ol> — номера. Их браузер поставил сам.', '<ol> gives numbers. The browser added them itself.'),
    done: L3('Tartib muhim bo‘lsa — <ol>. Muhim bo‘lmasa — <ul>.', 'Важен порядок — <ol>. Не важен — <ul>.', 'If order matters, use <ol>. If not, use <ul>.'),
    ask: L3('Ochuvchi tegni bosing va ikkala ko‘rinishni ko‘ring', 'Нажми на открывающий тег и посмотри оба вида', 'Tap the opening tag and see both views')
  },

  s7: {
    eyebrow: L3('Oldindan ayting', 'Угадай', 'Guess'),
    rounds: [
      { at: 1, ins: 'stepIns', target: 1, opts: [2, 3, 4], want: 3,
        say: L3('Men ikkinchi qadamni qo‘shaman: «Pultni tekshiring». U «Robotni yoqing» dan oldin turadi. Endi «Robotni yoqing» qaysi raqamda bo‘ladi?',
          'Я добавлю вторым шагом «Проверь пульт» — перед «Включи робота». Какой номер теперь будет у «Включи робота»?',
          'I will add “Check the remote” as the second step, before “Turn on the robot”. What number will “Turn on the robot” have now?'),
        ask: L3('«Robotni yoqing» qaysi raqamda bo‘ladi?', 'Какой номер будет у «Включи робота»?', 'What number will “Turn on the robot” have?') },
      { at: 0, ins: 'stepIns2', target: 2, opts: [3, 4, 5], want: 4,
        say: L3('Yana bir marta. Birinchi qadam qilib «Formani kiying» ni qo‘shaman. Endi «Maydonga chiqing» qaysi raqamda bo‘ladi?',
          'Ещё раз. Первым шагом добавлю «Надень форму». Какой номер теперь будет у «Выйди на поле»?',
          'Once more. I will add “Put on the uniform” as the first step. What number will “Go onto the field” have now?'),
        ask: L3('«Maydonga chiqing» qaysi raqamda bo‘ladi?', 'Какой номер будет у «Выйди на поле»?', 'What number will “Go onto the field” have?') }
    ],
    right: L3('To‘g‘ri! Raqamlarni o‘zimiz o‘zgartirmadik — brauzer hammasini qayta sanadi.', 'Верно! Мы номера не трогали — браузер пересчитал всё сам.', 'Right! We didn’t touch the numbers. The browser renumbered everything.'),
    miss: L3('Qarang: yangi qadam qo‘shildi, keyingilari bittaga suriladi. Brauzer o‘zi qayta sanadi.', 'Смотри: добавился новый шаг, и следующие сдвинулись на один. Браузер пересчитал сам.', 'Look: a new step was added, and the next ones moved down by one. The browser renumbered by itself.'),
    done: L3('ol da raqamlarni yozmaymiz — brauzer ularni o‘zi qo‘yadi va qayta sanaydi.', 'В ol номера не пишем — браузер ставит и пересчитывает их сам.', 'In ol we don’t type numbers: the browser adds and recounts them.')
  },

  s8: {
    eyebrow: L3('Ortiqcha raqamlar', 'Лишние цифры', 'Extra numbers'),
    say: L3('Qarang, raqamlar ikki marta! Men ularni <li> ichiga qo‘lda yozibman. Har bir qo‘lda yozilgan raqamni bosing — u o‘chadi.', 'Смотри, номера двойные! Я написал цифры руками внутри <li>. Нажми каждую такую цифру — она сотрётся.', 'Look, the numbers are doubled! I typed digits by hand inside <li>. Tap each typed digit and it will be erased.'),
    notDigit: L3('Bu qadamning so‘zi. Boshidagi raqamni qidiring.', 'Это слово шага. Ищи цифру в начале.', 'That is a word of the step. Look for the digit at the start.'),
    done: L3('Endi raqamlar bittadan. <ol> da raqamlarni yozmaymiz — brauzer o‘zi qo‘yadi.', 'Теперь номера одинарные. В <ol> цифры не пишем — браузер ставит их сам.', 'Now each number appears once. In <ol> we don’t type numbers: the browser adds them.'),
    ask: L3('li ichidagi qo‘lda yozilgan raqamlarni bosing', 'Нажми цифры, написанные руками внутри li', 'Tap the hand-typed numbers inside li')
  },

  s9: {
    eyebrow: L3('Qaysi ro‘yxat?', 'Какой список?', 'Which list?'),
    say: L3('Har bir kartochka uchun ro‘yxat tanlang. O‘zingizdan so‘rang: tartib muhimmi?', 'Для каждой карточки выбери список. Спроси себя: важен ли порядок?', 'Choose a list for each card. Ask yourself: does the order matter?'),
    rounds: [
      { want: 'ol', title: L3('Buterbrod', 'Бутерброд', 'A sandwich'),
        items: [L3('Nonni oling', 'Возьми хлеб', 'Take the bread'), L3('Sariyog‘ surting', 'Намажь масло', 'Spread the butter'), L3('Pishloq qo‘ying', 'Положи сыр', 'Add the cheese')] },
      { want: 'ul', title: L3('Sayohatga nima olaman', 'Что взять в поход', 'What to take on a hike'),
        items: [L3('fonar', 'фонарик', 'flashlight'), L3('suv', 'вода', 'water'), L3('kepka', 'кепка', 'cap')] },
      { want: 'ol', title: L3('Turnirdagi o‘rinlar: birinchidan uchinchigacha', 'Места в турнире: с первого по третье', 'Tournament places: first to third'),
        items: [L3('Alfa', 'Альфа', 'Alpha'), L3('Beta', 'Бета', 'Beta'), L3('Gamma', 'Гамма', 'Gamma')] },
      { want: 'ul', title: L3('Sevimli o‘yinlarim', 'Мои любимые игры', 'My favourite games'),
        items: [L3('shaxmat', 'шахматы', 'chess'), L3('futbol', 'футбол', 'football'), L3('Minecraft', 'Minecraft', 'Minecraft')] }
    ],
    okOl: L3('To‘g‘ri, <ol>: bu yerda tartib muhim.', 'Верно, <ol>: здесь важен порядок.', 'Right, <ol>: the order matters here.'),
    okUl: L3('To‘g‘ri, <ul>: narsalarni istalgan tartibda yozish mumkin.', 'Верно, <ul>: вещи можно перечислить в любом порядке.', 'Right, <ul>: the things can go in any order.'),
    missOl: L3('Ularni almashtirib ko‘ring: ma’no buziladimi? Buziladi — demak tartib muhim.', 'Попробуй поменять их местами: смысл ломается? Ломается — значит, порядок важен.', 'Try swapping them: does the meaning break? It does, so the order matters.'),
    missUl: L3('Bu narsalarni almashtirsa ham hech narsa o‘zgarmaydi. Tartib muhim emas.', 'Эти вещи можно поменять местами — ничего не изменится. Порядок не важен.', 'Swapping these things changes nothing. The order doesn’t matter.'),
    done: L3('To‘rttasi ham to‘g‘ri! Tartib muhim — ol, muhim emas — ul.', 'Все четыре верно! Порядок важен — ol, не важен — ul.', 'All four right! Order matters: ol. It doesn’t: ul.'),
    ask: L3('ul yoki ol? Tartib muhimmi?', 'ul или ol? Важен ли порядок?', 'ul or ol? Does order matter?')
  },

  s10: {
    eyebrow: L3('Band qochib ketdi', 'Пункт сбежал', 'A runaway item'),
    say: L3('Voy, shoshib qoldim: bitta <li> ro‘yxatdan tashqarida qoldi. Tekshiruv paneliga qarang va uni joyiga qo‘ying.', 'Ой, я спешил: одна <li> осталась за списком. Посмотри на панель проверки и верни её на место.', 'Oops, I rushed: one <li> ended up outside the list. Look at the check panel and put it back.'),
    rule: L3('Har bir li — ul yoki ol ichida', 'Каждый li — внутри ul или ol', 'Every li is inside ul or ol'),
    pickFirst: L3('Avval tashqaridagi li qatorini bosing.', 'Сначала нажми строку li за списком.', 'First tap the li line outside the list.'),
    wrongSpot: L3('Bu joy ro‘yxatdan tashqarida. ul ichidagi qatorni bosing.', 'Это место вне списка. Нажми строку внутри ul.', 'That place is outside the list. Tap a line inside ul.'),
    hints: [L3('Panelga qarang: qaysi li ul dan tashqarida?', 'Посмотри на панель: какая li стоит вне ul?', 'Look at the panel: which li is outside ul?'),
      L3('</ul> dan keyin turgan li ni toping.', 'Найди li, которая стоит после </ul>.', 'Find the li that comes after </ul>.'),
      L3('Oxirgi li qatorini bosing, keyin ul ichidagi istalgan qatorni.', 'Нажми последнюю строку li, потом любую строку внутри ul.', 'Tap the last li line, then any line inside ul.')],
    why: L3('Endi <li> ro‘yxat ichida. Har bir band ul yoki ol ichida yashaydi.', 'Теперь <li> внутри списка. Каждый пункт живёт внутри ul или ol.', 'Now the <li> is inside the list. Every item lives inside ul or ol.'),
    askPick: L3('Tashqaridagi li qatorini bosing', 'Нажми строку li за списком', 'Tap the li line outside the list'),
    askPlace: L3('Endi ul ichidagi qatorni bosing', 'Теперь нажми строку внутри ul', 'Now tap a line inside ul')
  },

  s11: {
    eyebrow: L3('Ro‘yxatni yoping', 'Закрой список', 'Close the list'),
    say: L3('Ro‘yxat oxiri yo‘q. Tugmalar bilan yopuvchi tegni tering.', 'У списка нет конца. Набери кнопками закрывающий тег.', 'The list has no end. Type the closing tag with the buttons.'),
    typeMsg: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Это открывающий тег. В закрывающем есть косая черта.', 'That is an opening tag. A closing tag has a slash.'),
      needLt: L3('Teg burchakdan boshlanadi.', 'Тег начинается с уголка.', 'A tag starts with an angle bracket.'),
      needGt: L3('Tegni burchak bilan yoping.', 'Закрой тег уголком.', 'Close the tag with an angle bracket.'),
      wrongName: L3('Bu boshqa tegni yopadi. Ro‘yxat ol bilan ochilgan.', 'Это закрывает другой тег. А список открыт тегом ol.', 'That closes another tag. But the list was opened with ol.'),
      generic: L3('ol ning yopuvchi tegini tering.', 'Набери закрывающий тег для ol.', 'Type the closing tag for ol.')
    },
    praise: L3('Ro‘yxat yopildi — abzats yana oddiy matn bo‘lib ketdi.', 'Список закрыт — абзац снова обычный текст.', 'The list is closed, and the paragraph is plain text again.'),
    hintSay: L3('ol ni yopuvchi teg: qiya chiziq va ol nomi.', 'Закрывающий тег для ol: косая черта и имя ol.', 'The closing tag for ol: a slash and the name ol.'),
    ask: L3('Bo‘sh qatorga ro‘yxatning yopuvchi tegini tering', 'Набери в пустой строке закрывающий тег списка', 'Type the list’s closing tag in the empty line')
  },

  s12: {
    eyebrow: L3('HTML-detektiv', 'HTML-детектив', 'HTML detective'),
    say: L3('Uchta ish. Har birida kodda bitta joy boshqacha turishi kerak. Uni toping va bosing.', 'Три дела. В каждом в коде одно место стоит не так. Найди его и нажми.', 'Three cases. In each, one place in the code is not right. Find it and tap it.'),
    cases: [
      { goal: L3('Bu — qadamlar bo‘yicha retsept', 'Это рецепт по шагам', 'This is a recipe in steps'),
        hints: [L3('Qadamlar uchun qanday ro‘yxat kerak?', 'Какой список нужен для шагов?', 'Which list do steps need?'),
          L3('Ro‘yxat tegiga qarang.', 'Посмотри на тег списка.', 'Look at the list tag.'),
          L3('Birinchi qatordagi <ul> ni bosing.', 'Нажми строку с <ul> в начале.', 'Tap the line with <ul> at the start.')],
        why: L3('Qadamlar — tartib muhim, demak <ol>.', 'Это шаги — порядок важен, значит <ol>.', 'These are steps: order matters, so <ol>.') },
      { goal: L3('Raqamli ro‘yxat', 'Список с номерами', 'A numbered list'),
        hints: [L3('Sahifada raqamlarga qarang.', 'Посмотри на номера на странице.', 'Look at the numbers on the page.'),
          L3('Bitta bandda raqam ikki marta.', 'В одном пункте номер дважды.', 'One item has its number twice.'),
          L3('Ichida raqam yozilgan li qatorini bosing.', 'Нажми строку li, где внутри написана цифра.', 'Tap the li line with a digit inside.')],
        why: L3('<ol> da raqamni brauzer qo‘yadi.', 'В <ol> номер ставит браузер.', 'In <ol>, the browser adds the number.') },
      { goal: L3('Narsalar ro‘yxati', 'Список вещей', 'A list of things'),
        hints: [L3('Har bir bandning oxiriga qarang.', 'Посмотри на конец каждого пункта.', 'Look at the end of each item.'),
          L3('Bitta li yopilmagan.', 'Одна li не закрыта.', 'One li is not closed.'),
          L3('Oxirida </li> yo‘q qatorni bosing.', 'Нажми строку, где в конце нет </li>.', 'Tap the line with no </li> at the end.')],
        why: L3('Har bir li yopiladi: </li>.', 'Каждая li закрывается: </li>.', 'Every li is closed with </li>.') }
    ],
    other: L3('Bu qator joyida. Qidirishda davom eting.', 'Эта строка в порядке. Ищи дальше.', 'This line is fine. Keep looking.'),
    done: L3('Uchala ish yechildi! Siz haqiqiy HTML-detektivsiz.', 'Все три дела раскрыты! Настоящий HTML-детектив.', 'All three cases solved! A real HTML detective.'),
    ask: L3('Boshqacha turgan qatorni bosing', 'Нажми строку, где что-то не так', 'Tap the line where something is off')
  },

  s13: {
    eyebrow: L3('Yangi bo‘lim', 'Новый раздел', 'New section'),
    say: L3('Sahifaga turnir jadvalini qo‘shamiz. To‘rt qadam.', 'Добавим на страницу расписание турнира. Четыре шага.', 'Let’s add the tournament schedule to the page. Four steps.'),
    tasks: [
      { ask: L3('«+ h2» tugmasini bosing', 'Нажми кнопку «+ h2»', 'Tap the “+ h2” button'), hint: L3('h2 tugmasini bosing', 'Нажми кнопку h2', 'Tap the h2 button') },
      { ask: L3('Sarlavhaga «Jadval» deb yozing', 'Напиши в заголовок «Расписание»', 'Write “Schedule” in the heading'), hint: L3('Sarlavhaga jadval deb yozing', 'Напиши в заголовок слово расписание', 'Write the word schedule in the heading') },
      { ask: L3('«+ ol» tugmasini bosing', 'Нажми кнопку «+ ol»', 'Tap the “+ ol” button'), hint: L3('ol tugmasini bosing', 'Нажми кнопку ol', 'Tap the ol button') },
      { ask: L3('Ikki bandni yozing: nima birinchi, nima ikkinchi', 'Напиши два пункта: что первым, что вторым', 'Write two items: what comes first, what second'), hint: L3('Ikkala li ga nimadir yozing', 'Напиши что-нибудь в обе li', 'Write something in both li lines') }
    ],
    ph: [L3('Jadval', 'Расписание', 'Schedule'), L3('Masalan: Ochilish', 'Например: Открытие', 'For example: Opening'), L3('Masalan: Birinchi o‘yin', 'Например: Первый матч', 'For example: First match')],
    noTags: L3('Bu yerga faqat so‘zlar.', 'Здесь только слова.', 'Only words here.'),
    added: L3('Yaxshi! Davom etamiz.', 'Хорошо! Дальше.', 'Good! Next.'),
    done: L3('Bo‘lim tayyor: sarlavha va raqamli ro‘yxat.', 'Раздел готов: заголовок и список с номерами.', 'The section is ready: a heading and a numbered list.')
  },

  s14: {
    eyebrow: L3('Mening loyiham', 'Мой проект', 'My project'),
    say: L3('Endi o‘z sahifangiz. Mavzu tanlang, keyin ro‘yxat turini tanlang va uchta band yozing.', 'Теперь своя страница. Выбери тему, потом вид списка и напиши три пункта.', 'Now your own page. Pick a topic, then the kind of list, and write three items.'),
    topics: [
      { id: 'trip', want: 'ul', label: L3('Sayohatga nima olaman', 'Что я возьму в поездку', 'What I’ll take on a trip'),
        ex: L3('Masalan: ryukzak', 'Например: рюкзак', 'For example: backpack') },
      { id: 'recipe', want: 'ol', label: L3('Mening retseptim', 'Мой рецепт', 'My recipe'),
        ex: L3('Masalan: sut quying', 'Например: налей молоко', 'For example: pour the milk') },
      { id: 'top', want: 'ol', label: L3('Mening top-3 o‘yinlarim', 'Мой топ-3 игр', 'My top 3 games'),
        ex: L3('Birinchi o‘rindagi o‘yin', 'Игра на первом месте', 'The game in first place') },
      { id: 'pets', want: 'ul', label: L3('Sevimli hayvonlarim', 'Мои любимые животные', 'My favourite animals'),
        ex: L3('Masalan: mushuk', 'Например: кошка', 'For example: cat') }
    ],
    askTopic: L3('Mavzu tanlang', 'Выбери тему', 'Pick a topic'),
    askList: L3('Bu mavzu uchun ul yoki ol?', 'Для этой темы — ul или ol?', 'For this topic: ul or ol?'),
    askItems: L3('Uchta bandni yozing', 'Напиши три пункта', 'Write three items'),
    okList: L3('To‘g‘ri tanlov! Endi uchta band yozing.', 'Верный выбор! Теперь напиши три пункта.', 'Good choice! Now write three items.'),
    noTags: L3('Bu yerga faqat so‘zlar.', 'Здесь только слова.', 'Only words here.'),
    done: L3('Ajoyib sahifa! Ro‘yxat to‘g‘ri tanlangan, bandlar o‘zingizniki.', 'Отличная страница! Вид списка выбран по смыслу, а пункты — твои.', 'A great page! The list fits the meaning, and the items are yours.')
  },

  s15: {
    eyebrow: L3('Mening sahifam', 'Моя страница', 'My page'),
    say: L3('Mana sizning sahifangiz! Uni saqlang.', 'Вот твоя страница! Сохрани её.', 'Here is your page! Save it.'),
    saved: L3('Saqlandi! Ro‘yxatli birinchi sahifangiz.', 'Сохранено! Твоя первая страница со списком.', 'Saved! Your first page with a list.'),
    ask: L3('Sahifani saqlang', 'Сохрани страницу', 'Save the page')
  },

  s16: {
    eyebrow: L3('Yakun', 'Итог', 'Wrap-up'),
    say: L3('Bugun ro‘yxatlar qildik: nuqtali va raqamli. Keyingi darsda havolalar qilamiz — sahifalar bir-biriga bog‘lanadi. Ko‘rishguncha!', 'Сегодня мы сделали списки: с точками и с номерами. На следующем уроке сделаем ссылки — страницы свяжутся друг с другом. Пока!', 'Today we made lists: bulleted and numbered. Next lesson we’ll make links, so pages connect to each other. Bye!'),
    skills: [
      L3('ul — nuqtali ro‘yxat, tartib muhim emas', 'ul — список с точками, порядок не важен', 'ul is a bulleted list; order doesn’t matter'),
      L3('ol — raqamli ro‘yxat, raqamlarni brauzer qo‘yadi', 'ol — список с номерами, номера ставит браузер', 'ol is a numbered list; the browser adds the numbers'),
      L3('li — bitta band, doim ul yoki ol ichida', 'li — один пункт, всегда внутри ul или ol', 'li is one item, always inside ul or ol')
    ],
    next: L3('Havolalar va atributlar', 'Ссылки и атрибуты', 'Links and attributes'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
  }
};

/*@L2_HELPERS@*/

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2 ДЛЯ СПИСКОВ
// ═════════════════════════════════════════════════════════════════════════════
// Цвета новых тегов той же светлоты: ul и ol — стальной синий (отличается от
// body), li — оливковый. Оранжевый, жёлтый и зелёный теги не красят.
TAGC.ul = '#2F6FB0'; TAGC.ol = '#2F6FB0'; TAGC.li = '#5B7F2A';
// Произношение новых тегов.
Object.assign(TAG_SAY.ru, { ul: 'ю-эль', ol: 'о-эль', li: 'эль-ай' });
Object.assign(TAG_SAY.uz, { ul: 'yu-el', ol: 'o-el', li: 'el-ay' });
Object.assign(TAG_SAY.en, { ul: 'U L', ol: 'O L', li: 'L I' });
// Ключи реплик урока 3, которых не было в уроке 2 (для прогрева озвучки).
Object.assign(SPOKEN, { each: 1, outOfOrder: 1, toUl: 1, toOl: 1, right: 1, miss: 1, notDigit: 1, okOl: 1, okUl: 1,
  missOl: 1, missUl: 1, okList: 1, hintSay: 1, rounds: 1, cases: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { ask: 1, title: 1, items: 1, opts: 1, want: 1, at: 1, ins: 1, target: 1 }, cases: { goal: 1, hints: 1 } });
// Озвучка: голые ul, ol, li и их теги — словами, затем общий разбор урока 2.
function spokenList(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const s = String(text || '')
    .replace(/<\s*\/\s*(ul|ol|li)\s*>/gi, (a, t) => ' ' + m.close + ' ' + m[t.toLowerCase()] + ' ')
    .replace(/<\s*(ul|ol|li)\s*>/gi, (a, t) => ' ' + m[t.toLowerCase()] + ' ')
    .replace(/(^|[^A-Za-z])(ul|ol|li)(?=[^A-Za-z]|$)/g, (a, pre, t) => pre + m[t]);
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

// МОДЕЛЬ СТРАНИЦЫ СО СПИСКАМИ → строки кода (Src урока 2).
// opts.zone — какие токены кликабельны решает экран; renderText(it) — поле вместо текста.
const li = (id, v, more) => Object.assign({ id, v: String(v == null ? '' : v) }, more || {});
function spLines(nodes, opts) {
  const o = opts || {};
  const L = [];
  const d0 = o.d0 || 0;
  nodes.forEach((n) => {
    if (n.kind === 'list') {
      L.push({ key: n.id + '-o', id: n.id + ':o', d: d0, tag: n.tag, toks: [{ k: 'open', tag: n.tag, z: n.id + ':o' }] });
      n.items.forEach((it) => {
        const toks = [{ k: 'open', tag: 'li', z: it.id + ':o' }];
        if (it.node) toks.push({ k: 'node', node: it.node, z: it.id + ':t' });
        else toks.push({ k: 'text', v: it.v, z: it.id + ':t' });
        if (!it.noClose) toks.push({ k: 'close', tag: 'li', z: it.id + ':c' });
        L.push({ key: it.id, id: it.id, d: d0 + 1, tag: 'li', toks, li: it });
      });
      if (!n.noClose) L.push({ key: n.id + '-c', id: n.id + ':c', d: d0, tag: n.tag, toks: [{ k: 'close', tag: n.tag, z: n.id + ':c' }] });
    } else if (n.kind === 'li') {
      L.push({ key: n.id, id: n.id, d: d0, tag: 'li', stray: true, toks: [{ k: 'open', tag: 'li', z: n.id + ':o' }, { k: 'text', v: n.v, z: n.id + ':t' }, { k: 'close', tag: 'li', z: n.id + ':c' }] });
    } else if (n.kind === 'gap') {
      L.push({ key: n.id, id: n.id, d: d0, gap: true, toks: [{ k: 'node', node: n.node || <span className="sp-gap" />, z: n.id }] });
    } else {
      const toks = [{ k: 'open', tag: n.kind, z: n.id + ':o' }];
      if (n.node) toks.push({ k: 'node', node: n.node, z: n.id + ':t' }); else toks.push({ k: 'text', v: n.v, z: n.id + ':t' });
      toks.push({ k: 'close', tag: n.kind, z: n.id + ':c' });
      L.push({ key: n.id, id: n.id, d: d0, tag: n.kind, toks });
    }
  });
  return L;
}
// Страница: настоящие <ul>/<ol>/<li> — номера и точки рисует сам браузер.
function SpPage({ nodes, hl, fresh, flashIds }) {
  const has = (arr, id) => !!arr && arr.indexOf(id) >= 0;
  const cls = (id) => (has(hl, id) ? ' is-hl' : '') + (has(fresh, id) ? ' is-new' : '') + (has(flashIds, id) ? ' is-flash' : '');
  return (
    <div className="pg sp-pg">
      {nodes.map((n) => {
        if (n.kind === 'list') {
          const Tg = n.tag === 'ol' ? 'ol' : 'ul';
          return (
            <Tg key={n.id} className={'sp-list sp-' + Tg + cls(n.id)} style={{ '--c': TAGC[Tg] }}>
              {n.items.map((it) => (
                <li key={it.id} className={'sp-li' + cls(it.id)}>
                  {it.v || '\u00a0'}{it.sub ? <p className="sp-sub">{it.sub}</p> : null}
                </li>
              ))}
            </Tg>
          );
        }
        // li вне списка браузер всё равно рисует пунктом, но без отступа списка.
        if (n.kind === 'li') return <li key={n.id} className={'sp-li sp-stray' + cls(n.id)}>{n.v}</li>;
        if (n.kind === 'gap') return null;
        const Tg = n.kind === 'h1' ? 'h1' : n.kind === 'h2' ? 'h2' : 'p';
        return <Tg key={n.id} className={'sp-' + Tg + cls(n.id)}>{n.v}</Tg>;
      })}
    </div>
  );
}
const listHtml = (title, h1, tag, items) => buildHtml(title, [blk('h1', 'h1', h1)])
  .replace('  </body>', '    <' + tag + '>\n' + items.map((x) => '      <li>' + escHtml(x) + '</li>').join('\n') + '\n    </' + tag + '>\n  </body>');
function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const own = store.get('s14');
  if (!own || !own.done) return null;
  return { type: 'html-page', topic: own.topic, title: own.title, h1: own.title, list: own.list, items: own.items, html: listHtml(own.title, own.title, own.list, own.items) };
}
const okText = (s) => hasLetters(s) && !hasTags(s);
// Строка задания: подсказка встаёт на её место (ask-hint), а не отдельной плашкой.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
// Ступени подсказки урока по числу промахов: 1 — направление, 2 — сужение, 3 — почти ответ.
const stepHint = (hints, misses) => (misses > 0 && hints ? hints[Math.min(hints.length, misses) - 1] : null);

// =============================================================================
// ЭКРАНЫ
// =============================================================================
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const thingsOf = (pick, n) => D.things.slice(0, n).map((x, i) => li('t' + i, cap(pick(x))));
const stepsOf = (pick) => D.steps.map((x, i) => li('st' + i, pick(x)));

// ── 1. HOOK. Сосчитать вещи в абзаце — абзац превращается в список.
function S1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const done = !!rec;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.askDone, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const answer = (n) => {
    if (!canTap || done) return;
    const right = n === 5;
    sfx(right ? 'ok' : 'soft', true);
    put({ n });
    log({ screenId: 's1', type: 'count', correct: right, firstTry: right, attempts: 1 });
    sayNow(right ? c.ok : c.miss, right ? 'cheer' : 'explain');
  };
  const para = pick(D.take) + ' ' + D.things.map((x) => pick(x)).join(', ') + '.';
  const nodes = done
    ? [{ kind: 'p', id: 'take', v: pick(D.take) }, { kind: 'list', id: 'L', tag: 'ul', items: thingsOf(pick, 5) }]
    : [{ kind: 'p', id: 'para', v: para }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={done ? c.askDone : c.ask} />
      <div className="sp-hook">
        <MiniBrowser title={pick(D.title)} page={<SpPage nodes={nodes} fresh={done ? ['L'].concat(thingsOf(pick, 5).map((x) => x.id)) : null} />} cls="mb-tall" />
      </div>
      <div className="sp-count" role="group">
        {[4, 5, 6].map((n) => (
          <button key={n} type="button" disabled={!canTap || done}
            className={'sp-num mono' + (done && n === 5 ? ' is-ok' : '') + (done && rec.n === n && n !== 5 ? ' is-off' : '')}
            onClick={() => answer(n)}>
            {n}<Led on={led} />
          </button>
        ))}
      </div>
    </Stage>
  );
}

// ── 2. MISSION. План урока карточками (канон).
const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;

// ── 3. SHOW. ul и li: строка кода ↔ пункт на странице.
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const [seen, setSeen] = useState(() => (rec && rec.seen) || []);
  const done = seen.length >= 3;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [cur, setCur] = useState(null);
  const led = useIdleLed(canTap && !done, seen.length);
  const items = thingsOf(pick, 3);
  const nodes = [{ kind: 'list', id: 'L', tag: 'ul', items }];
  const tap = (id) => {
    if (!canTap) return;
    sfx('tap', true);
    setCur(id);
    const next = seen.indexOf(id) >= 0 ? seen : seen.concat(id);
    setSeen(next);
    if (next.length >= 3 && !done) { put({ seen: next }); sayNow(joinL(c.each, c.done), 'cheer'); } else sayNow(c.each, 'point');
  };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} n={seen.length + '/3'} />
      <Work
        browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={nodes} hl={cur ? [cur] : null} />} />}
        code={<Src lines={spLines(nodes)} className="sp-src"
          lineProps={(ln) => (ln.li ? { onTap: () => tap(ln.id), disabled: !canTap, led: led && seen.indexOf(ln.id) < 0,
            cls: (cur === ln.id ? 'is-cur' : '') + (seen.indexOf(ln.id) >= 0 ? ' is-seen' : '') } : { cls: cur ? 'is-box' : '' })} />} />
    </Stage>
  );
}

// ── 4. LEVEL-1. Допиши пункт в пустую li — страница сразу показывает новую точку.
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const done = !!(rec && rec.done);
  const [val, setVal] = useState(rec ? rec.v : '');
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.praise : c.say, pose: done ? 'smile' : 'point' }]);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(!done && !val, 0);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (done) return undefined;
    if (hasTags(val)) { setMsg(c.noTags); return undefined; }
    setMsg(null);
    if (!hasLetters(val)) return undefined;
    const t = setTimeout(() => {
      put({ done: true, v: val.trim() });
      log({ screenId: 's4', type: 'write-li', correct: true, firstTry: true, attempts: 1 });
      sfx('ok', true); sayNow(c.praise, 'cheer');
    }, 1000);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = okText(val) ? cap(val.trim()) : '';
  const base = thingsOf(pick, 4);
  const pageNodes = [{ kind: 'list', id: 'L', tag: 'ul', items: base.concat(shown ? [li('new', shown)] : []) }];
  const codeNodes = [{ kind: 'list', id: 'L', tag: 'ul', items: base.concat([li('new', '', {
    node: <span className={'sp-in' + (led ? ' is-led' : '')}><InlineInput value={val} onChange={setVal} placeholder={L3(cap(pick(D.things[4])), cap(pick(D.things[4])), cap(pick(D.things[4])))} label={c.ask} max={30} /><Led on={led} /></span> })]) }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={msg} />
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={pageNodes} fresh={shown ? ['new'] : null} />} />}
        code={<Src lines={spLines(codeNodes)} className="sp-src" lineProps={(ln) => (ln.id === 'new' ? { cls: 'is-cur' } : null)} />} />
    </Stage>
  );
}

// ── 5. LEVEL-2. Из абзаца в список: каждая вещь по порядку становится li.
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const all = [0, 1, 2, 4].map((i) => cap(pick(D.things[i])));
  const [taken, setTaken] = useState(rec ? all.length : 0);
  const takenRef = useRef(rec ? all.length : 0);
  const done = taken >= all.length;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !done, taken);
  const tap = (i) => {
    if (!canTap || done || i < takenRef.current) return;
    tries.current += 1;
    if (i !== takenRef.current) { misses.current += 1; sfx('soft', true); wobble(i); setMsg(c.outOfOrder); sayNow(c.outOfOrder, 'think'); return; }
    const n = takenRef.current + 1;
    takenRef.current = n;
    setTaken(n); setMsg(null);
    sfx('pop', true);
    if (n >= all.length) {
      put({ done: true });
      log({ screenId: 's5', type: 'wrap', correct: true, firstTry: misses.current === 0, attempts: tries.current });
      sayNow(c.done, 'cheer');
    }
    // Промежуточные шаги — только звук: голос запер бы касания на полторы секунды.
  };
  const items = all.slice(0, taken).map((v, i) => li('w' + i, v));
  const nodes = [{ kind: 'list', id: 'L', tag: 'ul', items }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={msg} n={taken + '/' + all.length} />
      <div className="sp-para" translate="no">
        <span className="sp-para-l">{pick(D.take)}</span>
        {all.map((v, i) => (
          <span key={i} className="sp-word-w">
            <button type="button" disabled={!canTap || i < taken}
              className={'sp-word' + (i < taken ? ' is-taken' : '') + (shake === i ? ' fx-no' : '')} onClick={() => tap(i)}>
              {v.toLowerCase()}<Led on={led && i === taken} />
            </button>{i < all.length - 1 ? ',' : '.'}
          </span>
        ))}
      </div>
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={nodes} fresh={items.length ? [items[items.length - 1].id] : null} />} compact />}
        code={<Src lines={spLines(nodes)} className="sp-src" lineProps={(ln, i) => (ln.li && ln.id === 'w' + (taken - 1) ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 6. SHOW. ol ↔ ul: нажатие на открывающий тег меняет вид списка.
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const done = !!rec;
  const [tag, setTag] = useState('ol');
  const [seenUl, setSeenUl] = useState(done);
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (tag === 'ul' ? 1 : 0) + (seenUl ? 2 : 0));
  const flip = () => {
    if (!canTap) return;
    sfx('tap', true);
    const nt = tag === 'ol' ? 'ul' : 'ol';
    setTag(nt);
    if (nt === 'ul') { setSeenUl(true); sayNow(c.toUl, 'explain'); return; }
    if (seenUl && !done) { put({ done: true }); sayNow(joinL(c.toOl, c.done), 'cheer'); } else sayNow(c.toOl, 'explain');
  };
  const nodes = [{ kind: 'list', id: 'L', tag, items: stepsOf(pick) }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={nodes} />} />}
        code={<Src lines={spLines(nodes)} className="sp-src"
          zone={(z) => (z === 'L:o' ? { tap: true, disabled: !canTap, led, cls: 'sp-flip' } : z === 'L:c' ? { cls: 'sp-flip-c' } : null)}
          onZone={(z) => { if (z === 'L:o') flip(); }} />} />
    </Stage>
  );
}

// ── 7. PREDICT. Угадай номер после вставки шага — браузер пересчитает сам.
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!rec;
  const [r, setR] = useState(0);
  const [extra, setExtra] = useState(false);
  const R = c.rounds[r];
  const [answered, setAnswered] = useState(solved ? R.want : null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : R.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const first = useRef(null);
  const [pending, setPending] = useState(false);
  const base = stepsOf(pick);
  // В коде новый шаг уже стоит, браузер покажет его только после ответа.
  const items = (() => { const out = base.slice(); out.splice(R.at, 0, li('ins', pick(D[R.ins]))); return out; })();
  const shown = answered || solved ? items : base;
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => { setPending(false); setR(1); setExtra(true); setAnswered(null); sayNow(c.rounds[1].say, 'curious'); }, 700);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const targetId = base[R.target].id;
  const answer = (n) => {
    if (!canTap || answered) return;
    const right = n === R.want;
    if (first.current === null) first.current = right;
    setAnswered(n);
    sfx(right ? 'ok' : 'soft', true);
    if (right || extra) {
      put({ done: true });
      log({ screenId: 's7', type: 'predict', correct: right, firstTry: first.current, attempts: extra ? 2 : 1, followUp: extra ? right : null });
      sayNow(joinL(right ? c.right : c.miss, c.done), right ? 'cheer' : 'explain');
      return;
    }
    sayNow(c.miss, 'explain');
    setPending(true);
  };
  const nodes = [{ kind: 'list', id: 'L', tag: 'ol', items }];
  const pageNodes = [{ kind: 'list', id: 'L', tag: 'ol', items: shown }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={R.ask} nav={navOf(p, canGo)}>
      <Ask text={R.ask} n={extra ? '2/2' : null} />
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={pageNodes} fresh={answered ? ['ins'] : null} hl={answered ? [targetId] : null} />} />}
        code={<Src lines={spLines(nodes)} className="sp-src" lineProps={(ln) => (ln.id === 'ins' ? { cls: answered ? 'is-new' : 'is-ins' } : ln.id === targetId ? { cls: 'is-cur' } : null)} />} />
      <div className="sp-count" role="group">
        {R.opts.map((n) => (
          <button key={n} type="button" disabled={!canTap || !!answered || pending}
            className={'sp-num mono' + (answered === n ? (n === R.want ? ' is-ok' : ' is-off') : '') + (answered && n === R.want && answered !== n ? ' is-real' : '')}
            onClick={() => answer(n)}>{n}</button>
        ))}
      </div>
    </Stage>
  );
}

// ── 8. LEVEL-3. Лишние цифры: стереть номера, написанные руками внутри li.
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const base = stepsOf(pick);
  const [gone, setGone] = useState(rec ? base.map((x) => x.id) : []);
  const done = gone.length >= base.length;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [msg, setMsg] = useState(null);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !done, gone.length);
  const tapNum = (id) => {
    if (!canTap || gone.indexOf(id) >= 0) return;
    tries.current += 1;
    sfx('pop', true);
    const next = gone.concat(id);
    setGone(next); setMsg(null);
    if (next.length >= base.length) {
      put({ done: true });
      log({ screenId: 's8', type: 'erase', correct: true, firstTry: misses.current === 0, attempts: tries.current });
      sayNow(c.done, 'cheer');
    }
  };
  const tapWord = () => { if (!canTap || done) return; misses.current += 1; sfx('soft', true); setMsg(c.notDigit); sayNow(c.notDigit, 'think'); };
  const pageItems = base.map((x, i) => li(x.id, (gone.indexOf(x.id) >= 0 ? '' : (i + 1) + '. ') + x.v));
  const codeItems = base.map((x, i) => li(x.id, '', {
    node: (
      <span className="sp-dig">
        {gone.indexOf(x.id) < 0 ? (
          <button type="button" className="sp-dig-n mono" disabled={!canTap} onClick={() => tapNum(x.id)}>{(i + 1) + '.'}<Led on={led} /></button>
        ) : null}
        <button type="button" className="sp-dig-w" disabled={!canTap || done} onClick={tapWord}>{x.v}</button>
      </span>)
  }));
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={msg} n={gone.length + '/3'} />
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={[{ kind: 'list', id: 'L', tag: 'ol', items: pageItems }]} />} />}
        code={<Src lines={spLines([{ kind: 'list', id: 'L', tag: 'ol', items: codeItems }])} className="sp-src" />} />
    </Stage>
  );
}

// ── 9. LEVEL-4. Какой список нужен: ul или ol — 4 раунда.
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!rec;
  const [r, setR] = useState(solved ? 3 : 0);
  const R = c.rounds[r];
  const [got, setGot] = useState(solved);
  const [tried, setTried] = useState([]);
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
      sfx('ok', true); setGot(true); setMsg(null);
      const ok = t === 'ol' ? c.okOl : c.okUl;
      if (r === c.rounds.length - 1) {
        put({ done: true });
        log({ screenId: 's9', type: 'choose-list', correct: true, firstTry: misses.current === 0, attempts: tries.current });
        sayNow(joinL(ok, c.done), 'cheer');
        return;
      }
      sayNow(ok, 'smile');
      setTimeout(() => { if (!alive.current) return; setR((v) => v + 1); setGot(false); setTried([]); }, reduceMotion() ? 900 : 1700);
      return;
    }
    misses.current += 1;
    sfx('soft', true); wobble(t);
    setTried((x) => x.concat(t));
    const m = R.want === 'ol' ? c.missOl : c.missUl;
    setMsg(m); sayNow(m, 'think');
  };
  const shownTag = got ? R.want : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={got ? null : msg} n={(r + 1) + '/' + c.rounds.length} />
      <div className="sp-card" key={r}>
        <b className="sp-card-t">{pick(R.title)}</b>
        {shownTag ? (
          React.createElement(shownTag, { className: 'sp-card-l sp-' + shownTag }, R.items.map((x, i) => <li key={i}>{pick(x)}</li>))
        ) : (
          <div className="sp-card-l is-plain">{R.items.map((x, i) => <div key={i}>{pick(x)}</div>)}</div>
        )}
      </div>
      <div className="sp-pick" translate="no">
        {['ul', 'ol'].map((t) => {
          const off = tried.indexOf(t) >= 0;
          const tip = !got && tried.length >= 1 && t === R.want;
          return (
            <button key={t} type="button" disabled={!canTap || got || off} style={{ '--c': TAGC[t] }}
              className={'sp-pick-b mono' + (got && t === R.want ? ' is-on' : '') + (off ? ' is-off' : '') + (shake === t ? ' fx-no' : '')}
              onClick={() => choose(t)}>
              <span className={'sp-pick-ic sp-ic-' + t} aria-hidden="true"><i /><i /><i /></span>{'<' + t + '>'}
              <Led on={!got && !off && (tip || led)} />
            </button>
          );
        })}
      </div>
    </Stage>
  );
}

// ── 10. CHECK-1. Пункт сбежал: перенести li внутрь ul (панель проверки).
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!rec;
  const [picked, setPicked] = useState(false);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.why : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved && misses >= 2, picked ? 1 : 0);
  const items = thingsOf(pick, 3);
  const nodes = solved
    ? [{ kind: 'list', id: 'L', tag: 'ul', items }]
    : [{ kind: 'list', id: 'L', tag: 'ul', items: items.slice(0, 2) }, { kind: 'li', id: items[2].id, v: items[2].v }];
  const strayId = items[2].id;
  const tapLine = (ln) => {
    if (!canTap || solved) return;
    if (!picked) {
      if (ln.id === strayId) { setPicked(true); setMsg(null); setShowHint(false); sfx('tap', true); return; }
      tries.current += 1; setMisses((m) => m + 1); setShowHint(true); setMsg(c.pickFirst); sayNow(c.pickFirst, 'think'); return;
    }
    if (ln.id === strayId) { setPicked(false); return; }
    tries.current += 1;
    const inside = ln.li || ln.id === 'L:o';
    if (inside) {
      sfx('ok', true);
      put({ done: true });
      log({ screenId: 's10', type: 'move-li', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
      sayNow(c.why, 'cheer');
      return;
    }
    setMisses((m) => m + 1); setShowHint(true); sfx('soft', true); setMsg(c.wrongSpot); sayNow(c.wrongSpot, 'think');
  };
  // Первый промах — точная реплика; со второго — ступени подсказки.
  const hint = misses >= 2 ? stepHint(c.hints, misses - 1) : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={picked ? c.askPlace : c.askPick} nav={navOf(p, canGo)}>
      <Inspector rules={[{ id: 'in', ok: solved, text: c.rule }]} />
      <Ask text={solved ? c.why : picked ? c.askPlace : c.askPick} hint={solved || !showHint ? null : (hint || msg)} />
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={nodes} fresh={solved ? [strayId] : null} />} />}
        code={<Src lines={spLines(nodes)} className="sp-src"
          lineProps={(ln) => (solved ? (ln.id === strayId ? { cls: 'is-new' } : null) : {
            onTap: () => tapLine(ln), disabled: !canTap,
            cls: (ln.id === strayId && picked ? 'is-picked' : '') + (ln.stray ? ' is-stray' : ''),
            led: led && (picked ? !!ln.li : ln.id === strayId)
          })} />} />
    </Stage>
  );
}

// ── 11. LEVEL-5. Закрой список: набрать </ol> кнопками.
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
    sfx('win', true); setMsg(null);
    put({ done: true });
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
  const steps = stepsOf(pick);
  const listNode = { kind: 'list', id: 'L', tag: 'ol', items: steps, noClose: !solved };
  const codeNodes = solved ? [listNode, { kind: 'p', id: 'pp', v: pick(D.good) }]
    : [listNode, { kind: 'gap', id: 'gap', node: <span className={'sp-in' + (led ? ' is-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('</…>', '</…>', '</…>')} label={c.ask} max={8} cls="tk-input-tag" /><Led on={led} /></span> }, { kind: 'p', id: 'pp', v: pick(D.good) }];
  // Без </ol> браузер считает абзац частью последнего пункта — он «тонет» в списке.
  const pageNodes = solved ? [{ kind: 'list', id: 'L', tag: 'ol', items: steps }, { kind: 'p', id: 'pp', v: pick(D.good) }]
    : [{ kind: 'list', id: 'L', tag: 'ol', items: steps.map((x, i) => (i === steps.length - 1 ? li(x.id, x.v, { sub: pick(D.good) }) : x)) }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.hintSay} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="sp-typing" browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={pageNodes} hl={solved ? ['pp'] : null} />} />}
        code={<Src lines={spLines(codeNodes)} className="sp-src" lineProps={(ln) => (ln.gap ? { cls: 'is-gap' } : null)} />} />
      {!solved ? <KeyRow keys={['<', '/', 'o', 'u', 'l', '>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 12. CHECK-2. HTML-детектив: в каждом деле одна строка стоит не так.
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!rec;
  const [k, setK] = useState(solved ? 3 : 0);
  const [fixed, setFixed] = useState(false);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !solved && !fixed && misses >= 3, k * 10 + misses);
  const steps = stepsOf(pick);
  const things = thingsOf(pick, 3);
  const recipe = C.s9.rounds[0].items.map((x, i) => li('r' + i, pick(x)));
  // Дело → узлы до/после исправления и id строки, которую надо нажать.
  const CASES = [
    { bad: [{ kind: 'list', id: 'L', tag: 'ul', items: recipe }], good: [{ kind: 'list', id: 'L', tag: 'ol', items: recipe }], target: 'L:o', alt: 'L:c' },
    { bad: [{ kind: 'list', id: 'L', tag: 'ol', items: steps.map((x, i) => (i === 2 ? li(x.id, '3. ' + x.v) : x)) }], good: [{ kind: 'list', id: 'L', tag: 'ol', items: steps }], target: steps[2].id },
    { bad: [{ kind: 'list', id: 'L', tag: 'ul', items: things.map((x, i) => (i === 1 ? li(x.id, x.v, { noClose: true }) : x)) }], good: [{ kind: 'list', id: 'L', tag: 'ul', items: things }], target: things[1].id }
  ];
  const cs = CASES[Math.min(k, 2)];
  const caseC = c.cases[Math.min(k, 2)];
  const tapLine = (ln) => {
    if (!canTap || solved || fixed) return;
    stat.current.tries += 1;
    if (ln.id === cs.target || ln.id === cs.alt) {
      sfx('ok', true); setFixed(true); setMsg(null);
      if (k === 2) {
        put({ done: true });
        log({ screenId: 's12', type: 'detective', correct: true, firstTry: stat.current.misses === 0, attempts: stat.current.tries, hints: stat.current.misses });
        sayNow(joinL(caseC.why, c.done), 'cheer');
        return;
      }
      sayNow(caseC.why, 'smile');
      setTimeout(() => { setK((v) => v + 1); setFixed(false); setMisses(0); }, reduceMotion() ? 1000 : 2000);
      return;
    }
    stat.current.misses += 1;
    sfx('soft', true);
    const n = misses + 1;
    setMisses(n);
    const h = stepHint(caseC.hints, n);
    setMsg(h || c.other);
    sayNow(h ? joinL(c.other, h) : c.other, 'think');
  };
  const nodes = solved || fixed ? cs.good : cs.bad;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="sp-case"><span className="sp-case-l mono">{pick(UI.caseN)} {Math.min(k, 2) + 1}/3</span><b>{pick(caseC.goal)}</b></div>
      <Ask text={solved ? c.done : c.ask} hint={solved || fixed ? null : msg} />
      <Work browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={nodes} />} />}
        code={<Src lines={spLines(nodes)} className="sp-src"
          lineProps={(ln) => (solved || fixed ? (ln.id === cs.target ? { cls: 'is-new' } : null)
            : { onTap: () => tapLine(ln), disabled: !canTap, led: led && ln.id === cs.target })} />} />
    </Stage>
  );
}

// ── 13. SANDBOX. Новый раздел по шагам: + h2 → «Расписание» → + ol → два пункта.
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const [step, setStep] = useState(rec ? 4 : 0);
  const [h2, setH2] = useState(rec ? rec.h2 : '');
  const [a, setA] = useState(rec ? rec.a : '');
  const [b, setB] = useState(rec ? rec.b : '');
  const done = step >= 4;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, step);
  useEffect(() => {
    if (step !== 1 || !okText(h2)) return undefined;
    const t = setTimeout(() => { setStep(2); sfx('ok', true); sayNow(c.added, 'smile'); }, 1000);
    return () => clearTimeout(t);
  }, [h2, step]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step !== 3 || !okText(a) || !okText(b)) return undefined;
    const t = setTimeout(() => {
      setStep(4); put({ h2: h2.trim(), a: a.trim(), b: b.trim() });
      log({ screenId: 's13', type: 'section', correct: true, firstTry: true, attempts: 1 });
      sfx('win', true); sayNow(c.done, 'cheer');
    }, 1000);
    return () => clearTimeout(t);
  }, [a, b, step]); // eslint-disable-line react-hooks/exhaustive-deps
  const task = c.tasks[Math.min(step, 3)];
  const inp = (val, set, ph, cls) => <span className={'sp-in' + (led ? ' is-led' : '')}><InlineInput value={val} onChange={set} placeholder={ph} label={task.ask} max={30} cls={cls} /></span>;
  const codeNodes = [{ kind: 'h1', id: 'h1', v: pick(D.h1) }, { kind: 'p', id: 'pi', v: pick(D.intro) }];
  const pageNodes = codeNodes.slice();
  if (step >= 1) {
    codeNodes.push({ kind: 'h2', id: 'h2', node: step === 1 ? inp(h2, setH2, c.ph[0]) : null, v: h2 });
    pageNodes.push({ kind: 'h2', id: 'h2', v: okText(h2) ? h2 : '' });
  }
  if (step >= 3) {
    codeNodes.push({ kind: 'list', id: 'L', tag: 'ol', items: [li('a', a, { node: step === 3 ? inp(a, setA, c.ph[1]) : null }), li('b', b, { node: step === 3 ? inp(b, setB, c.ph[2]) : null })] });
    pageNodes.push({ kind: 'list', id: 'L', tag: 'ol', items: [li('a', okText(a) ? a : ''), li('b', okText(b) ? b : '')] });
  }
  const tagMsg = (step === 1 && hasTags(h2)) || (step === 3 && (hasTags(a) || hasTags(b))) ? c.noTags : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={task.hint} nav={navOf(p, canGo)}>
      <Ask text={done ? c.done : task.ask} hint={tagMsg} n={Math.min(step + 1, 4) + '/4'} />
      <Work cls="sp-typing" browser={<MiniBrowser title={pick(D.title)} page={<SpPage nodes={pageNodes} fresh={['h2', 'L']} />} />}
        code={<Src lines={spLines(codeNodes)} className="sp-src sp-src-sm" />} />
      {step === 0 || step === 2 ? (
        <div className="sp-add" translate="no">
          <button type="button" className={'sp-add-b' + (led ? ' is-led' : '')} disabled={!canTap}
            onClick={() => { sfx('pop', true); setStep(step + 1); }}>
            {'+ ' + (step === 0 ? 'h2' : 'ol')}<Led on={led} />
          </button>
        </div>
      ) : null}
    </Stage>
  );
}

// ── 14. RESULT. Свой проект: тема → ul или ol по смыслу → три пункта.
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const [rec, put] = useRec('s14');
  const [topic, setTopic] = useState(rec ? rec.topic : null);
  const [list, setList] = useState(rec ? rec.list : null);
  const [items, setItems] = useState(rec ? rec.items : ['', '', '']);
  const [msg, setMsg] = useState(null);
  const [tried, setTried] = useState([]);
  const done = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const T0 = c.topics.find((t) => t.id === topic);
  const phase = !topic ? 'topic' : !list ? 'list' : done ? 'done' : 'items';
  const led = useIdleLed(canTap && !done, phase === 'topic' ? 0 : phase === 'list' ? 1 : 2);
  const tries = useRef(0);
  const chooseList = (t) => {
    if (!canTap || list || tried.indexOf(t) >= 0) return;
    tries.current += 1;
    if (t === T0.want) { sfx('ok', true); setList(t); setMsg(null); sayNow(c.okList, 'smile'); return; }
    sfx('soft', true); setTried((x) => x.concat(t));
    const m = T0.want === 'ol' ? C.s9.missOl : C.s9.missUl;
    setMsg(m); sayNow(m, 'think');
  };
  useEffect(() => {
    if (phase !== 'items' || !items.every(okText)) return undefined;
    const t = setTimeout(() => {
      const title = pick(T0.label);
      put({ done: true, topic, list, items: items.map((x) => x.trim()), title });
      log({ screenId: 's14', type: 'project', correct: true, firstTry: tries.current === 1, attempts: tries.current });
      sfx('win', true); sayNow(c.done, 'cheer');
    }, 1000);
    return () => clearTimeout(t);
  }, [items, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const setAt = (i, v) => setItems((xs) => xs.map((x, j) => (j === i ? v : x)));
  const title = T0 ? pick(T0.label) : '';
  const tag = list || 'ul';
  const pageNodes = T0 ? [{ kind: 'h1', id: 'h1', v: title }].concat(list ? [{ kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, okText(x) ? x : '')) }] : []) : [];
  const codeNodes = T0 ? [{ kind: 'h1', id: 'h1', v: title }].concat(list ? [{ kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, x, {
    node: phase === 'items' ? <span className="sp-in"><InlineInput value={x} onChange={(v) => setAt(i, v)} label={c.askItems} max={30} placeholder={i === 0 ? T0.ex : L3('…', '…', '…')} /></span> : null })) }] : []) : [];
  const askText = phase === 'topic' ? c.askTopic : phase === 'list' ? c.askList : phase === 'items' ? c.askItems : c.done;
  const tagMsg = phase === 'items' && items.some(hasTags) ? c.noTags : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={phase === 'list' ? msg : tagMsg} />
      {phase === 'topic' ? (
        <div className="sp-topics">
          {c.topics.map((t) => (
            <button key={t.id} type="button" className="sp-topic" disabled={!canTap} onClick={() => { sfx('tap', true); setTopic(t.id); }}>
              {pick(t.label)}<Led on={led} />
            </button>
          ))}
        </div>
      ) : (
        <>
          <Work cls="sp-typing" browser={<MiniBrowser title={title} page={<SpPage nodes={pageNodes} />} />}
            code={<Src lines={spLines(codeNodes)} className="sp-src" />} />
          {phase === 'list' ? (
            <div className="sp-pick" translate="no">
              {['ul', 'ol'].map((t) => (
                <button key={t} type="button" disabled={!canTap || tried.indexOf(t) >= 0} style={{ '--c': TAGC[t] }}
                  className={'sp-pick-b mono' + (tried.indexOf(t) >= 0 ? ' is-off' : '')} onClick={() => chooseList(t)}>
                  <span className={'sp-pick-ic sp-ic-' + t} aria-hidden="true"><i /><i /><i /></span>{'<' + t + '>'}
                  <Led on={led && (tried.length ? t === T0.want : true)} />
                </button>
              ))}
            </div>
          ) : null}
        </>
      )}
    </Stage>
  );
}

// ── 15. ACHIEVEMENT. Своя страница и её код — сохранить.
function S15({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s15;
  const [rec, put] = useRec('s15');
  const saved = !!(rec && rec.saved);
  const own = store.get('s14');
  const title = own ? own.title : pick(D.h1);
  const tag = own ? own.list : 'ul';
  const items = own ? own.items : D.things.slice(0, 3).map((x) => cap(pick(x)));
  const [speaker, , spoken, sayNow] = useVoice([{ text: saved ? c.saved : c.say, pose: saved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(saved, spoken);
  const [view, setView] = useState('result');
  const led = useIdleLed(canTap && !saved, 0);
  const save = () => {
    if (!canTap || saved) return;
    sfx('win', true);
    store.set('artifact', { type: 'html-page', topic: own ? own.topic : null, title, h1: title, list: tag, items, html: listHtml(title, title, tag, items) });
    put({ saved: true });
    sayNow(c.saved, 'cheer');
  };
  const nodes = [{ kind: 'h1', id: 'h1', v: title }, { kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, x)) }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="site-top">
        <span className="site-author">{pick(UI.author)}: <b>{p.name}</b></span>
        <div className="only-narrow">
          <SegToggle value={view} onChange={setView} options={[{ v: 'result', label: UI.result }, { v: 'code', label: UI.code }]} />
        </div>
      </div>
      <div className={'site view-' + view}>
        <div className="site-b"><MiniBrowser title={title} page={<SpPage nodes={nodes} />} cls="mb-site" /></div>
        <div className="site-c"><Src lines={spLines(nodes)} className="src-site sp-src" /></div>
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
        <div className="sp-recap" aria-hidden="true" translate="no">
          <ul className="sp-list sp-ul"><li>ul</li><li>li</li></ul>
          <ol className="sp-list sp-ol"><li>ol</li><li>li</li></ol>
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
  { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'SHOW', Comp: S6 },
  { id: 's7', code: 'PREDICT', Comp: S7 }, { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's9', code: 'LEVEL-4', Comp: S9 },
  { id: 's10', code: 'CHECK-1', Comp: S10 }, { id: 's11', code: 'LEVEL-5', Comp: S11 }, { id: 's12', code: 'CHECK-2', Comp: S12 },
  { id: 's13', code: 'SANDBOX', Comp: S13 }, { id: 's14', code: 'RESULT', Comp: S14 }, { id: 's15', code: 'ACHIEVEMENT', Comp: S15 },
  { id: 's16', code: 'PREVIEW', Comp: S16 }
];
// «Повторить» стирает только этот экран; проект ученика (s14) и сохранённую
// страницу (artifact) повтор других экранов не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], s15: ['s15'] };

export default function HtmlLesson03({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
// CSS УРОКА: стили урока 2 (код, браузер, клавиши, проверка …) + свои (sp-…).
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@OWN_CSS@*/
`;
