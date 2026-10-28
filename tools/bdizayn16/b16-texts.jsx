// ─────────────────────────────────────────────────────────────────────────────
// РЕПЛИКИ УРОКА 16 (заказчик, 28.10.2026): русский и английский — по
// «urok-01-repliki-v2.md» (версия 2), узбекский — по «urok-01-uz.md» (3-я версия,
// разговорный стиль). Подменяют тексты урока 1 (C и UI из tools/kollazh/kollazh.src.jsx)
// при сборке; урок 1 курса не меняется. Строки задания, которых нет в файлах
// заказчика (новые «Нажми…» на экранах 3 и 6), написаны по их смыслу.
// Знаки < и > в речи — в кавычках «<», «>»: так движок произносит их названия.
// ─────────────────────────────────────────────────────────────────────────────
function b16Merge(dst, src) {
  Object.keys(src).forEach((k) => {
    const v = src[k];
    const deep = v && typeof v === 'object' && !Array.isArray(v) && !('ru' in v) && dst[k] && typeof dst[k] === 'object' && !Array.isArray(dst[k]);
    if (deep) b16Merge(dst[k], v); else dst[k] = v;
  });
}

b16Merge(UI, {
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslar kerak emas.', 'Здесь пиши только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  next: L3('Veb-sahifamizga katta sarlavha va xatboshilar qo‘shishni o‘rganamiz', 'Добавим большой заголовок и абзацы', 'Adding a big heading and paragraphs')
});

b16Merge(C, {
  s1: {
    say: L3('Hammaga salom! Mening ismim Kodi. Hozir sizlarga bitta veb-sahifani ko‘rsataman. Nimaga deysizmi? Buni dars davomida bilib olasiz!',
      'Привет! Я Коди. Смотри, это веб-страница.',
      'Hi! I’m Kodi. Look, here’s a web page.'),
    sayTab: L3('Tepadagi mana bu kichkina joyni ko‘ryapsizmi? Bu yorliq deyiladi. Unga sahifaning nomi yozib qo‘yilgan.',
      'Видишь маленькую полоску сверху? Это вкладка. На ней написано название страницы.',
      'See the little strip at the top? That’s the tab. It shows the page name.'),
    sayGo: L3('Endi bir narsani tasavvur qiling: shu sahifa odam bo‘lib qolsa, qanaqa bo‘larkin? Qani, ko‘ramiz! «Aylantirish» tugmasini bosing.',
      'А если бы страница была человеком, какой бы она была? Давай проверим! Нажми «Превратить».',
      'If a web page were a person, what would it look like? Let’s find out! Tap “Transform”.'),
    magic: L3('Voy-voy, qarang! Sahifa jonlanib, odamchaga aylanib qoldi!',
      'Ого! Страница ожила и стала человечком!',
      'Whoa! The page came alive and turned into a paper buddy!'),
    magicHead: L3('Sezdingizmi? Sahifaning nomi endi uning boshida turibdi. Chunki boshda sahifa haqidagi ma’lumotlar saqlanadi.',
      'Смотри: название страницы спряталось у него в голове. В голове хранится информация о странице.',
      'Look: the page name went into its head. The head keeps information about the page.'),
    magicWin: L3('Tanasi-chi? U sahifada ko‘rinib turgan narsalardan yasalgan: matndan, rasmdan va tugmadan.',
      'А тело собрано из того, что видно на странице: из текста, картинки и кнопки.',
      'And the body is made of what you see on the page: text, a picture and a button.'),
    done: L3('Bugun siz ham o‘zingizning sahifangizni yasaysiz: unga nom qo‘yasiz, salom ham yozasiz. Lekin oldin kod degani qanaqa bo‘lishini ko‘rib olamiz.',
      'Сегодня ты сделаешь свою страницу: придумаешь ей название и напишешь приветствие. Но сначала посмотрим, как выглядит код.',
      'Today you’ll make your own page: you’ll name it and write a greeting. But first, let’s see what code looks like.'),
    askLook: L3('Qarang: brauzer yorlig‘i', 'Смотри: вкладка браузера', 'Look: the browser tab'),
    askDone: L3('Boshda — sahifa haqida ma’lumot, tanada — ko‘rinadigan narsalar',
      'В голове — информация о странице, в теле — то, что видно',
      'The head keeps page info, the body is what you see')
  },
  rd: {
    say: L3('Mana, bu kod. Brauzer sahifani aynan shundan yig‘adi. Qani, qanday o‘qishini kuzatib turing!',
      'Это код. По нему браузер собирает страницу. Смотри, как он его читает!',
      'This is code. The browser builds the page from it. Watch how it reads it!'),
    read1: L3('Sezdingizmi? Brauzer kodni xuddi biz kitob o‘qigandek o‘qiyapti.',
      'Заметил? Браузер читает код так же, как ты читаешь книжку.',
      'Did you notice? The browser reads code the way you read a book.'),
    read2: L3('Har bir qatorni chapdan o‘ngga qarab o‘qiydi.', 'Каждую строчку — слева направо.', 'Each line from left to right.'),
    read3: L3('Qatorlarni esa tepadan pastga, bittalab o‘qiydi.', 'А строчки — сверху вниз, одну за другой.', 'And the lines from top to bottom, one after another.'),
    done: L3('Brauzer kodni oxirigacha o‘qib chiqdi — mana, sahifa ham tayyor! Endi bu kodda nimalar yozilganini birga ko‘rib chiqamiz.',
      'Строчка за строчкой — и страница готова! Сейчас разберёмся, что написано в этом коде.',
      'Line by line, and the page is ready! Now let’s find out what this code says.')
  },
  s3: {
    say: L3('Ramkaga bir qarang-chi: unda ikkita yozuv bor. Tepadagisini bosib ko‘ring.',
      'Посмотри на рамку: на ней две надписи. Нажми на верхнюю.',
      'Look at the frame: it has two labels. Tap the top one.'),
    br: L3('Mana bu «<» va «>» belgilarini ko‘ryapsizmi? Ularni burchakli qavslar deyishadi.',
      'Видишь знаки «<» и «>»? Это угловые скобки.',
      'See these two marks: “<” and “>”? They’re called angle brackets.'),
    nm: L3('Ularning o‘rtasida html degan so‘z turibdi. Bu tegning nomi.', 'Между ними слово html. Это имя тега.', 'Between them is the word html. That’s the tag’s name.'),
    sayTag: L3('Mana shu yozuv butunligicha teg deyiladi. Brauzer tegni sahifada ko‘rsatmaydi, faqat o‘qiydi.',
      'Скобки и имя вместе — это тег. Тег — подсказка для браузера. Браузер не показывает тег на странице, а только читает его.',
      'The brackets and the name together make a tag. A tag is a note for the browser. The browser doesn’t show tags on the page, it just reads them.'),
    top: L3('Bunisi ochuvchi html tegi. U brauzerga «Sahifa shu yerdan boshlanadi», deb aytadi. Endi pastdagisini bosing.',
      'Это открывающий тег html. Он говорит браузеру: «Здесь страница начинается». Теперь нажми на нижнюю надпись.',
      'This is the opening html tag. It tells the browser: “The page starts here.” Now tap the bottom label.'),
    bottom: L3('Farqini sezdingizmi? Bunda birinchi qavsdan keyin qiya chiziq bor. Bu yopuvchi html tegi. U «Sahifa shu yerda tugaydi», deydi.',
      'Видишь разницу? Сразу после первой скобки стоит косая черта. Это закрывающий тег html. Он говорит: «Здесь страница заканчивается».',
      'See the difference? Right after the first bracket there’s a slash. This is the closing html tag. It says: “The page ends here.”'),
    pair: L3('Demak, ochuvchi teg boshlaydi, yopuvchi teg tugatadi. Sahifadagi hamma narsa shu ikkalasining o‘rtasida turadi.',
      'Открывающий тег — начало, закрывающий — конец. Всё, что есть на странице, стоит между ними.',
      'Opening tag: the start. Closing tag: the end. Everything on the page goes between them.'),
    done: L3('Sizga bir sir aytaymi? Bu ramkani tushunarli bo‘lsin deb o‘zimiz chizdik. Haqiqiy brauzerda uni ko‘rmaysiz.',
      'Маленький секрет: рамку мы нарисовали, чтобы было понятнее. В настоящем браузере её нет.',
      'A little secret: we drew the frame to make things clearer. A real browser doesn’t have it.'),
    ask: L3('Tepadagi yozuvni bosing', 'Нажми на верхнюю надпись', 'Tap the top label'),
    askBot: L3('Pastdagi yozuvni bosing', 'Нажми на нижнюю надпись', 'Tap the bottom label')
  },
  s4: {
    say: L3('Voy, ramkaning pastki cheti qayoqqa ketdi? Kodda yopuvchi html tegi yo‘q ekan. Uni bo‘sh qatorga yozing-da, «Tekshirish»ni bosing.',
      'Ой, у рамки пропал нижний край! В коде не хватает закрывающего тега html. Напиши его в пустой строке и нажми «Проверить».',
      'Oops, the frame’s bottom edge is gone! The code is missing the closing html tag. Type it in the empty line and tap “Check”.'),
    msgs: {
      needSlash: L3('Oz qoldi! Bu ochuvchi teg-ku. Yopuvchi tegda html so‘zidan oldin qiya chiziq bo‘ladi.',
        'Почти! Это открывающий тег. В закрывающем перед словом html стоит косая черта.',
        'Almost! That’s the opening tag. The closing tag has a slash before html.'),
      needLt: L3('Boshi tushib qolibdi: teg doim «<» qavsi bilan boshlanadi.', 'Не хватает начала: тег начинается со скобки «<».', 'The start is missing: a tag begins with “<”.'),
      needGt: L3('Oxiri tushib qolibdi: teg doim «>» qavsi bilan tugaydi.', 'Не хватает конца: тег заканчивается скобкой «>».', 'The end is missing: a tag ends with “>”.'),
      wrongName: L3('Teg ichidagi so‘zga qarang-chi: bu yerga html yozilishi kerak.', 'Посмотри на слово внутри тега: здесь нужно html.', 'Check the word inside the tag: you need html here.'),
      generic: L3('Nimadir chalkashib ketdi. Tepadagi teg bilan solishtirib ko‘ring: qavs, qiya chiziq, html, qavs.',
        'Что-то перепуталось. Сравни с верхним тегом: скобка, косая черта, html, скобка.',
        'Something’s mixed up. Compare it with the top tag: bracket, slash, html, bracket.')
    },
    hints: [L3('Ramkaning tepasidagi tegga qarang. Pastdagisi unga juda o‘xshaydi.', 'Посмотри на верхний тег на рамке. Нижний очень на него похож.', 'Look at the top tag on the frame. The bottom one looks very similar.'),
      L3('Yopuvchi teg ham xuddi o‘sha, faqat qiya chizig‘i bor.', 'Закрывающий тег — тот же самый, только с косой чертой.', 'The closing tag is the same tag, just with a slash.'),
      L3('Tugmalarni ketma-ket bosing: qavs, qiya chiziq, html, keyin yana qavs.', 'Нажимай кнопки по порядку: скобка, косая черта, html и снова скобка.', 'Tap the buttons in order: bracket, slash, html, and bracket again.')],
    ok: L3('Zo‘r! Ramka yopildi. Endi butun sahifa ikkita html tegining o‘rtasida.', 'Есть! Рамка закрылась. Теперь вся страница стоит между двумя тегами html.', 'Yes! The frame is closed. Now the whole page is between the two html tags.')
  },
  s5: {
    say: L3('Endi navbat sizga! Ramkaga ikkita teg kerak: biri tepaga, biri pastga. Faqat ehtiyot bo‘ling: pastdagi uchta tegdan bittasi ortiqcha.',
      'Теперь сам! Рамке нужны два тега: сверху и снизу. Осторожно: один из трёх тегов внизу — лишний.',
      'Your turn! The frame needs two tags: one on top, one at the bottom. Careful: one of the three tags below is extra.'),
    sayHow: L3('Tegni ushlab, joyiga olib boring. Yoki oldin tegni, keyin joyni bosing.', 'Перетащи тег на место. Или нажми тег, а потом место.', 'Drag a tag into place. Or tap a tag, then the place.'),
    top: L3('Oz qoldi! Tepada sahifa boshlanadi, shuning uchun bu yerga qiya chiziqsiz ochuvchi teg kerak.',
      'Почти! Сверху страница начинается. Здесь нужен открывающий тег — без косой черты.',
      'Almost! The page starts at the top, so it needs the opening tag, without a slash.'),
    bottom: L3('Hechqisi yo‘q! Pastda sahifa tugaydi, bu yerga qiya chiziqli yopuvchi teg kerak.',
      'Ничего страшного! Снизу страница заканчивается. Здесь нужен закрывающий тег — с косой чертой.',
      'No worries! The page ends at the bottom, so it needs the closing tag, with a slash.'),
    back: L3('Ana, tuzoq shu yerda ekan! Bu chiziq teskari tomonga qiyshaygan. Yopuvchi tegda chiziq o‘ngga qarab qiyshaygan bo‘ladi.',
      'Вот она, ловушка! Эта черта наклонена не в ту сторону. В закрывающем теге черта наклонена вправо.',
      'There’s the trap! This slash leans the wrong way. In a closing tag it leans to the right.'),
    pickFirst: L3('Oldin tegni tanlang.', 'Сначала выбери тег.', 'Pick a tag first.'),
    hints: [L3('Qaysi teg sahifani boshlaydi-yu, qaysi biri tugatadi?', 'Какой тег начинает страницу, а какой заканчивает?', 'Which tag starts the page, and which one ends it?'),
      L3('Tepaga qiya chiziqsiz teg, pastga qiya chiziqli teg qo‘yiladi.', 'Сверху — тег без косой черты. Снизу — тег с косой чертой.', 'Top: the tag without a slash. Bottom: the tag with a slash.'),
      L3('Yonib turgan tegni yonib turgan joyga olib boring.', 'Перетащи светящийся тег на светящееся место.', 'Drag the glowing tag to the glowing place.')],
    ok: L3('Barakalla, ikkala teg ham joyida! Teskari chiziqli teg esa ortiqcha edi.', 'Отлично, оба тега на месте! А тег с неправильной чертой был лишним.', 'Great, both tags are in place! The one with the wrong slash was extra.'),
    ask: L3('Tegni joyiga olib boring', 'Перетащи тег на место', 'Drag a tag into place')
  },
  s6: {
    say: L3('html ichida ikkita qism yashaydi. Birinchisining nomi head, inglizchada «bosh» degani. Odamchaning boshi xuddi shu head.',
      'Внутри html есть две части. Первая называется head — по-английски «голова». Голова человечка — это и есть head.',
      'There are two parts inside html. The first is called head. The buddy’s head stands for it.'),
    sayInfo: L3('head ichida sahifa haqidagi ma’lumotlar turadi. Pastdagi katta joy — brauzer oynasiga qarang: u yerda ular ko‘rinmaydi. Qani, boshni bosib, ichida nima borligini ko‘ring.',
      'В head лежит информация о странице. В окне браузера, в этой большой части внизу, её не видно. Нажми на голову и посмотри, что там.',
      'head holds information about the page. You can’t see it in the browser window, this big area below. Tap the head and see what’s inside.'),
    opened: L3('Ana, ichida nima ekan: sahifaning nomi! U title tegining ichiga yoziladi. Endi nom yozilgan qog‘ozchani bosing.',
      'Вот что внутри: название страницы! Его пишут в теге title. Нажми на бумажку с названием.',
      'Here’s what’s inside: the page name! It goes in the title tag. Tap the paper with the name.'),
    flew: L3('Nom uchib, yorliqqa o‘tib oldi! Brauzer title tegidagi matnni mana shu yerda, tepada ko‘rsatadi. Oynada esa u yo‘q.',
      'Название перелетело на вкладку! Вот где браузер показывает текст из title: наверху, на вкладке. А в окне его нет.',
      'The name flew to the tab! That’s where the browser shows the text from title: up on the tab. It’s not in the window.'),
    inHead: L3('Endi kodga qarang: tepada ochuvchi head tegi, pastda yopuvchi head tegi turibdi.', 'Теперь посмотри на код: сверху открывающий тег head, снизу закрывающий.', 'Now look at the code: the opening head tag is at the top, the closing one at the bottom.'),
    done: L3('title qatori ularning o‘rtasida. Demak, title head ichida yashaydi.', 'Строка title стоит между ними. Значит, title живёт внутри head.', 'The title line sits between them. So title lives inside head.'),
    askLook: L3('Qarang: odamchaning boshi', 'Смотри: голова человечка', 'Watch: the buddy’s head'),
    ask: L3('Odamchaning boshini bosing', 'Нажми на голову человечка', 'Tap the buddy’s head'),
    askCard: L3('Nom yozilgan qog‘ozchani bosing', 'Нажми на бумажку с названием', 'Tap the paper with the name'),
    askDone: L3('title head ichida yashaydi', 'title живёт внутри head', 'title lives inside head')
  },
  s7: {
    say: L3('Endi eng qiziq joyiga keldik: sahifangizga o‘zingiz nom qo‘ying! Uni title teglarining o‘rtasiga yozing, masalan, «Futbol». Nom shu zahoti yorliqda chiqadi. Keyin «Tayyor»ni bosing.',
      'А теперь самое интересное: придумай название для своей страницы! Напиши его между тегами title, например «Футбол». Название сразу появится на вкладке. Потом нажми «Готово».',
      'Now the fun part: come up with a name for your page! Type it between the title tags, for example “Football”. It’ll show up on the tab right away. Then tap “Done”.'),
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslar kerak emas.', 'Здесь пиши только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
    hints: [L3('Nom qayerga yoziladi? Kodga qarang: u yerda bo‘sh joy bor.', 'Куда пишется название? Посмотри на код: там есть пустое место.', 'Where does the name go? Look at the code: there’s an empty spot.'),
      L3('Nom ikkita title tegining o‘rtasiga yoziladi.', 'Название пишут между двумя тегами title.', 'The name goes between the two title tags.'),
      L3('Ikkita title tegi o‘rtasidagi bo‘sh joyni bosing, nom yozing va «Tayyor»ni bosing.', 'Нажми на пустое место между тегами title, напиши название и нажми «Готово».', 'Tap the empty spot between the title tags, type a name and tap “Done”.')],
    ok: L3('Zo‘r! Endi yorliqda sahifangizning nomi turibdi.', 'Класс! Теперь на вкладке название твоей страницы.', 'Cool! Now your page name is on the tab.'),
    eyebrow: L3('Yorliqdagi nom', 'Название на вкладке', 'The name on the tab')
  },
  s9: {
    say: L3('Nom tayyor. Endi sahifaning o‘zini to‘ldiramiz! html ichidagi ikkinchi qismning nomi body, inglizchada «tana» degani. Qani, odamchaning tanasidan nima uchib chiqarkin?',
      'Название готово. Теперь заполним саму страницу! Вторая часть внутри html — body, по-английски «тело». Смотри, что вылетит из тела человечка!',
      'The name is ready. Now let’s fill the page itself! The second part inside html is body. Watch what flies out of the buddy’s body!'),
    out: L3('Voy, qarang! Matn, rasm, tugma — hammasi tanadan uchib chiqib, to‘ppa-to‘g‘ri oynaga tushdi.',
      'Вот это да! Текст, картинка и кнопка вылетели из тела прямо в окно.',
      'Wow! The text, the picture and the button flew out of the body right into the window.'),
    done: L3('Oynada nima ko‘rinsa — matnmi, rasmmi, tugmami — hammasi body ichida turadi. Bugun body ichiga matn yozamiz, rasm bilan tugmani keyingi darslarda qo‘shamiz.',
      'Всё, что видно в окне, — текст, картинки, кнопки — живёт внутри body. Сегодня мы напишем в body текст, а картинки и кнопки добавим на следующих уроках.',
      'Everything you see in the window, text, pictures, buttons, lives inside body. Today we’ll write text in body; pictures and buttons come in later lessons.')
  },
  s10: {
    say: L3('Endi body teglarining o‘rtasiga «Salom» so‘zini yozing.', 'Теперь напиши приветствие между тегами body. Например, «Привет!».', 'Now type a greeting between the body tags. For example, “Hello!”.'),
    sayWin: L3('U shu zahoti oynada paydo bo‘ladi. Keyin «Tayyor»ni bosing.', 'Оно сразу появится в окне. Потом нажми «Готово».', 'It’ll show up in the window right away. Then tap “Done”.'),
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslar kerak emas.', 'Здесь пиши только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
    hints: [L3('Oyna uchun matn qayerga yoziladi? Kodga qarang.', 'Куда пишется текст для окна? Посмотри на код.', 'Where does the text for the window go? Look at the code.'),
      L3('Matn ikkita body tegining o‘rtasiga yoziladi.', 'Текст пишут между двумя тегами body.', 'The text goes between the two body tags.'),
      L3('Ikkita body tegi o‘rtasidagi bo‘sh joyni bosing, matn yozing va «Tayyor»ni bosing.', 'Нажми на пустое место между тегами body, напиши текст и нажми «Готово».', 'Tap the empty spot between the body tags, type your text and tap “Done”.')],
    ok: L3('Ajoyib! Salomingiz oynada turibdi.', 'Отлично! Твоё приветствие уже в окне.', 'Great! Your greeting is in the window.')
  },
  s8: {
    eyebrow: L3('Yorliqmi yoki oyna?', 'Вкладка или окно?', 'Tab or window?'),
    say: L3('Endi bir o‘yin o‘ynaymiz: siz brauzersiz! Kod qatoriga qarab, so‘z qayerda chiqishini toping: yorliqdami yoki oynada?',
      'А теперь игра: ты — браузер! Смотри на строку кода и решай, где появится слово: на вкладке или в окне?',
      'Now a game: you’re the browser! Look at the line of code and decide where the word will show: on the tab or in the window?'),
    rounds: [
      { kind: 'title', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'tab' },
      { kind: 'body', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'win' },
      { kind: 'title', word: L3('Juma kuni final!', 'Финал в пятницу!', 'The final is on Friday!'), extra: L3('Bugun konsert!', 'Сегодня концерт!', 'Concert today!'), want: 'tab' }
    ],
    askTitle: L3('title tegida «{w}» deb yozilgan. Qani, u qayerda chiqadi?', 'В title написано «{w}». Где оно появится?', 'title says “{w}”. Where will it show up?'),
    askBody: L3('Endi body tegida «{w}» deb yozilgan. Bu safar qayerda chiqadi?', 'А теперь в body написано «{w}». Где оно появится?', 'Now body says “{w}”. Where will it show up?'),
    ok: {
      title: L3('To‘ppa-to‘g‘ri! title tegidagi so‘z yorliqqa chiqdi.', 'Верно! Слово из title — на вкладке.', 'Right! The word from title is on the tab.'),
      body: L3('Topdingiz! body tegidagi so‘z oynaga chiqdi.', 'В точку! Слово из body — в окне.', 'Spot on! The word from body is in the window.')
    },
    miss: {
      title: L3('Hechqisi yo‘q! So‘z title tegida turgan edi, shuning uchun yorliqqa chiqdi.', 'Ничего страшного! Слово стоит в title, поэтому оно на вкладке.', 'No worries! The word is in title, so it’s on the tab.'),
      body: L3('Bu safar adashdingiz! So‘z body tegida turgan edi, shuning uchun oynaga chiqdi.', 'Почти! Слово стоит в body, поэтому оно в окне.', 'Almost! The word is in body, so it’s in the window.')
    },
    more: L3('Keling, yana bittasini ko‘ramiz.', 'Давай ещё один пример.', 'Let’s try one more.'),
    hints: [L3('So‘z qaysi teglarning o‘rtasida turibdi?', 'Между какими тегами стоит слово?', 'Which tags is the word between?'),
      L3('title tegidagi matn yorliqda, body tegidagi matn oynada ko‘rinadi.', 'Текст из title видно на вкладке, текст из body — в окне.', 'Text from title shows on the tab, text from body in the window.'),
      L3('Teg nomini o‘qing: title bo‘lsa «Yorliq»ni, body bo‘lsa «Oyna»ni bosing.', 'Прочитай имя тега: title — жми «Вкладка», body — жми «Окно».', 'Read the tag name: for title tap “Tab”, for body tap “Window”.')],
    done: L3('Mana, o‘yin tugadi! Esingizda bo‘lsin: title tegidagi matn yorliqda, body tegidagi matn oynada chiqadi.',
      'Вот и всё! Запомни: текст из title — на вкладке, текст из body — в окне.',
      'That’s it! Remember: text from title goes on the tab, text from body in the window.')
  },
  s11: {
    say: L3('Keling, endi hammasini joy-joyiga qo‘yamiz! Har bir bo‘lakning o‘z uyi bor. Qani, toping-chi: uyi head ichidami yoki body ichidami? Bo‘lakni olib boring yoki oldin bo‘lakni, keyin kerakli qismni bosing.',
      'Наведём порядок! Куда положить каждую вырезку: в head или в body? Перетащи её. Или нажми вырезку, а потом нужную часть.',
      'Let’s tidy up! Where does each cut-out go: in head or in body? Drag it. Or tap a cut-out, then the right part.'),
    items: [
      { id: 'name', want: 'head', why: L3('Qarang: bu title qatori-ku. title esa head ichida yashaydi, demak, uning joyi head.', 'Смотри: это строка title. А title живёт внутри head. Значит, её место в head.', 'Look: this is the title line. title lives inside head, so this goes in head.') },
      { id: 'hello', want: 'body', why: L3('Yo‘q, bunisining uyi boshqa joyda! Salomingiz oynada ko‘rinadi-ku, demak, u body ichida yashaydi.', 'Почти! Твоё приветствие видно в окне. Значит, оно в body.', 'Almost! Your greeting shows in the window, so it goes in body.') },
      { id: 'pic', want: 'body', why: L3('Hechqisi yo‘q! Rasmni oynada ko‘ramiz-ku, demak, u body ichida.', 'Ничего страшного! Картинку мы видим в окне. Значит, она в body.', 'No worries! We see the picture in the window, so it goes in body.') },
      { id: 'btn', want: 'body', why: L3('O‘ylab ko‘ring-chi: tugmani qayerda bosamiz? Oynada! Demak, u body ichida.', 'Подумай: где мы нажимаем кнопку? В окне! Значит, она в body.', 'Think: where do we press the button? In the window! So it goes in body.') }
    ],
    pickFirst: L3('Oldin bo‘lakni tanlang.', 'Сначала выбери вырезку.', 'Pick a cut-out first.'),
    hints: [L3('O‘ylab ko‘ring: bu narsa brauzer oynasida ko‘rinadimi?', 'Подумай: эту вещь видно в окне браузера?', 'Think: can you see this in the browser window?'),
      L3('Oynada ko‘rinadigan hamma narsa body ichida. title qatori esa head ichida.', 'Всё, что видно в окне, — в body. Строка title — в head.', 'Everything you see in the window goes in body. The title line goes in head.'),
      L3('Yonib turgan bo‘lakni yonib turgan joyga olib boring.', 'Перетащи светящуюся вырезку в светящееся место.', 'Drag the glowing cut-out to the glowing place.')],
    ok: L3('Hammasi joy-joyida! title head ichida, salom, rasm va tugma esa body ichida.', 'Порядок! title — в head, а приветствие, картинка и кнопка — в body.', 'All sorted! title is in head; the greeting, the picture and the button are in body.'),
    ask: L3('Bo‘lakni head yoki body ichiga olib boring', 'Перетащи вырезку в head или в body', 'Drag a cut-out into head or body')
  },
  s12: {
    say: L3('Endi siz hamma qismlarni bilasiz. Keling, brauzer sizning kodingizni qanday o‘qishini yana bir marta ko‘ramiz va har bir qatorni tushunib olamiz.',
      'Теперь ты знаешь все части. Давай ещё раз посмотрим, как браузер читает твой код, и разберём каждую строчку.',
      'Now you know all the parts. Let’s watch the browser read your code once more and go through each line.'),
    order5: L3('Mana bu joyi muhim: oldin head yopiladi, keyin body ochiladi. Ular bir-birining ichida emas, ketma-ket turadi.',
      'Важный момент: сначала head закрывается, и только потом открывается body. Они стоят друг за другом, а не друг в друге.',
      'Important: head closes first, and only then body opens. They go one after the other, not one inside the other.'),
    tapSay: L3('Yana bir marta eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi qismni bosing, men aytib beraman.', 'Хочешь послушать ещё раз? Нажми на строку кода или на часть справа.', 'Want to hear it again? Tap a code line or a part on the right.'),
    parts: {
      doc: L3('Birinchi qator — <!DOCTYPE html>. U brauzerga «Bu HTML sahifa», deb aytadi. Uning jufti yo‘q, shuning uchun uni yopish shart emas.',
        'Первая строка — <!DOCTYPE html>. Она говорит браузеру: «Это HTML-страница». Пары у неё нет, закрывать её не нужно.',
        'The first line is <!DOCTYPE html>. It tells the browser: “This is an HTML page.” It has no pair, so you don’t close it.'),
      html: L3('html tegi butun sahifani quchoqlab turadi. head ham, body ham uning ichida.', 'Тег html обнимает всю страницу. Внутри него — head и body.', 'The html tag hugs the whole page. Inside it are head and body.'),
      head: L3('Mana bu head, sahifaning «boshi». Bu yerda sahifa haqidagi ma’lumotlar turadi.', 'Это head, «голова» страницы. Здесь хранится информация о странице.', 'This is head, the page’s “head”. It keeps information about the page.'),
      title: L3('head ichida title bor, unda sahifaning nomi yozilgan. Brauzer shu nomni yorliqda ko‘rsatadi.', 'Внутри head — title с названием страницы. Это название браузер показывает на вкладке.', 'Inside head is title, with the page name. The browser shows that name on the tab.'),
      body: L3('Mana bu body, sahifaning «tanasi». Oynada ko‘rinadigan hamma narsa shu yerda.', 'Это body, «тело» страницы. Здесь всё, что видно в окне.', 'This is body, the page’s “body”. Everything you see in the window is here.'),
      text: L3('Mana, sizning salomingiz! U body ichida, shuning uchun oynada ko‘rinyapti.', 'А вот и твоё приветствие! Оно внутри body, поэтому его видно в окне.', 'And here’s your greeting! It’s inside body, so it shows in the window.')
    }
  },
  s13: {
    say: L3('Mana, eng qiziq joyi keldi: endi butun kodni o‘zingiz yig‘asiz! Birinchi qatorni men qo‘yib qo‘ydim, qolgani sizdan. Qatorchani bossangiz, o‘zi keyingi bo‘sh joyga borib tushadi.',
      'А теперь главное испытание: собери весь код сам! Первая строка уже стоит. Нажми на полоску — она встанет в следующую пустую строку.',
      'Now the big challenge: build the whole code yourself! The first line is already there. Tap a strip, and it goes into the next empty line.'),
    sayMove: L3('Tartibni adashtirib qo‘ysangiz, qo‘rqmang: qatorchalarni o‘qchalar bilan tepaga yoki pastga suring. Hammasi tayyor bo‘lsa, «Tekshirish»ni bosing.',
      'Ошибся с порядком — не беда: двигай полоски стрелками вверх и вниз. Когда всё готово, нажми «Проверить».',
      'Mixed up the order? No problem: move strips up and down with the arrows. When it’s all set, tap “Check”.'),
    rules: {
      html: L3('DOCTYPE qatoridan keyin darrov ochuvchi html tegi keladi. Yopuvchi html tegi esa eng oxirida turadi.', 'Сразу после DOCTYPE идёт открывающий тег html. А закрывающий html — в самом конце.', 'The opening html tag comes right after DOCTYPE. The closing html tag goes at the very end.'),
      pair: L3('Yopuvchi teg doim o‘zining ochuvchi tegidan keyin keladi.', 'Закрывающий тег стоит после своего открывающего.', 'A closing tag comes after its opening tag.'),
      order: L3('Oldin head keladi, keyin body.', 'Сначала идёт head, потом body.', 'head comes first, then body.'),
      headClose: L3('Oldin head tegini yoping, keyin body tegini oching.', 'Сначала закрой head, потом открывай body.', 'Close head first, then open body.'),
      title: L3('title head ichida turishi kerak.', 'title должен стоять внутри head.', 'title must be inside head.'),
      text: L3('Salom body ichida turishi kerak.', 'Приветствие должно стоять внутри body.', 'The greeting must be inside body.')
    },
    hints: [L3('DOCTYPE qatoridan keyin qaysi teg keladi, eng oxirida-chi?', 'Какой тег идёт сразу после DOCTYPE, а какой стоит в самом конце?', 'Which tag comes right after DOCTYPE, and which one goes at the very end?'),
      L3('html ichida oldin title bilan head, keyin salom bilan body keladi.', 'Внутри html сначала head с title, потом body с приветствием.', 'Inside html: first head with title, then body with the greeting.'),
      L3('Belgilangan qatorlardan birini bosing, keyin boshqasini. Ular joyini almashtiradi.', 'Нажми одну отмеченную полоску, потом другую — они поменяются местами.', 'Tap one marked strip, then the other: they’ll swap places.')],
    ok: L3('Qoyil! Kod to‘g‘ri yig‘ildi. Nom head ichida, salom body ichida.', 'Супер, код собран верно! Название — в head, приветствие — в body.', 'Awesome, the code is right! The name is in head, the greeting is in body.')
  },
  s14: {
    eyebrow: L3('Matn yorliqqa chiqib ketdi', 'Текст попал на вкладку', 'Text on the tab'),
    say: L3('Voy, nimadir buzilib qolibdi! Sahifadagi hamma matn yorliqqa chiqib ketibdi, oyna bo‘m-bo‘sh. title qatorida bitta teg yetishmayapti.',
      'Ой, что-то сломалось! Весь текст страницы уехал на вкладку, а окно пустое. В строке title не хватает одного тега.',
      'Uh-oh, something broke! All the page text went onto the tab, and the window is empty. One tag is missing in the title line.'),
    sayHow: L3('Keling, birga tuzatamiz! Kerakli tegni bo‘sh joyga olib boring yoki ustiga bir bosing.', 'Починим? Перетащи нужный тег в пустое место или просто нажми на него.', 'Shall we fix it? Drag the right tag into the empty spot, or just tap it.'),
    why: {
      '<title>': L3('Yo‘q, bu ochuvchi teg-ku! title allaqachon ochilgan, endi uni yopadigan teg kerak.', 'Почти! Это открывающий тег, а title уже открыт. Теперь его нужно закрыть.', 'Almost! That’s an opening tag, and title is already open. Now it needs to close.'),
      '</head>': L3('Shoshilmang! head keyinroq yopiladi. Oldin nom tugashi kerak, ya’ni title tegini yopamiz.', 'Не спеши! head закроется чуть позже. Сначала нужно закончить название — закрыть title.', 'Not so fast! head closes a bit later. First the name has to end, so close title.')
    },
    hints: [L3('Qaysi teg ochilgan-u, lekin yopilmagan?', 'Какой тег открыт, но не закрыт?', 'Which tag is open but not closed?'),
      L3('title ochilgan. Uni yopadigan teg kerak.', 'title открыт. Нужен тег, который его закроет.', 'title is open. You need the tag that closes it.'),
      L3('Qiya chiziqli title tegini bo‘sh joyga qo‘ying.', 'Поставь в пустое место тег title с косой чертой.', 'Put the title tag with a slash into the empty spot.')],
    ok: L3('Mana, tuzaldi! Nom yorliqda, salom oynada. Yopuvchi title tegi brauzerga nom qayerda tugashini ko‘rsatib berdi.',
      'Починили! Название на вкладке, приветствие в окне. Закрывающий тег title показал браузеру, где кончается название.',
      'Fixed it! The name is on the tab, the greeting is in the window. The closing title tag showed the browser where the name ends.'),
    ask: L3('Yetishmayotgan tegni bo‘sh joyga olib boring', 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty place')
  },
  q1: {
    eyebrow: L3('Yorliq va oyna', 'Вкладка и окно', 'Tab and window'),
    say: L3('Endi o‘zingizni sinab ko‘ring! Mana yangi sahifa. Yorliqda «Robotlar», oynada esa «Salom!» chiqishi kerak. Har bir so‘zni koddagi o‘z joyiga olib boring.',
      'Теперь проверь себя! Вот новая страница. На вкладке должно быть «Роботы», а в окне — «Привет!». Перетащи каждую фразу на её место в коде.',
      'Now test yourself! Here’s a new page. The tab should say “Robots”, and the window “Hello!”. Drag each phrase to its place in the code.'),
    toWin: L3('Qarang: «{w}» oynaga tushib qoldi. body tegidagi matn oynada chiqadi, yorliq uchun esa title kerak.', 'Смотри: «{w}» попало в окно. Всё, что в body, видно в окне. А для вкладки нужен title.', 'Look: “{w}” landed in the window. Whatever is in body shows in the window. The tab needs title.'),
    toTab: L3('Qarang: «{w}» yorliqqa chiqib qoldi. title tegidagi matn yorliqda chiqadi, oyna uchun esa body kerak.', 'Смотри: «{w}» попало на вкладку. Всё, что в title, видно на вкладке. А для окна нужен body.', 'Look: “{w}” landed on the tab. Whatever is in title shows on the tab. The window needs body.'),
    pickFirst: L3('Oldin so‘zni tanlang.', 'Сначала выбери фразу.', 'Pick a phrase first.'),
    hints: [L3('Yorliqdagi matn qaysi tegga yoziladi?', 'В какой тег пишут текст для вкладки?', 'Which tag holds the text for the tab?'),
      L3('Yorliq uchun title, oyna uchun body.', 'Для вкладки — title, для окна — body.', 'For the tab: title. For the window: body.'),
      L3('Yonib turgan so‘zni yonib turgan joyga olib boring.', 'Перетащи светящуюся фразу в светящееся место.', 'Drag the glowing phrase to the glowing place.')],
    ok: L3('Juda zo‘r! «Robotlar» title tegida, shuning uchun yorliqda. «Salom!» body tegida, shuning uchun oynada.', 'Идеально! «Роботы» стоит в title — поэтому на вкладке. «Привет!» стоит в body — поэтому в окне.', 'Perfect! “Robots” is in title, so it’s on the tab. “Hello!” is in body, so it’s in the window.'),
    ask: L3('Har bir so‘zni o‘z joyiga olib boring', 'Перетащи каждую фразу на её место', 'Drag each phrase into its place')
  },
  q2: {
    eyebrow: L3('</title> nimaga kerak?', 'Зачем нужен </title>?', 'Why </title>?'),
    say: L3('Va oxirgi savol. Sizningcha, yopuvchi title tegi nimaga kerak? Javobni tanlang.', 'И последний вопрос. Как думаешь, зачем нужен закрывающий тег title? Выбери ответ.', 'And the last question. What do you think: why do we need the closing title tag? Pick an answer.'),
    opts: [
      { id: 'win', t: L3('Nomni oynada ko‘rsatadi', 'Показывает название в окне', 'Shows the name in the window'),
        why: L3('Unday emas: yopuvchi teg sahifada ko‘rinmaydi, oynaga ham hech narsa chiqarmaydi.', 'Не совсем: закрывающий тег на странице не виден и ничего не выводит в окно.', 'Not quite: a closing tag doesn’t show on the page and doesn’t put anything in the window.') },
      { id: 'end', right: true, t: L3('Nom qayerda tugashini ko‘rsatadi', 'Показывает, где кончается название', 'Shows where the name ends') },
      { id: 'page', t: L3('Sahifa qayerda tugashini ko‘rsatadi', 'Показывает, где кончается страница', 'Shows where the page ends'),
        why: L3('Unday emas: sahifa qayerda tugashini yopuvchi html tegi ko‘rsatadi. Yopuvchi title tegi faqat title tegini yopadi.', 'Не совсем: где кончается страница, показывает закрывающий тег html. А закрывающий title закрывает только title.', 'Not quite: the closing html tag shows where the page ends. The closing title tag only closes title.') }
    ],
    hints: [L3('Matn yorliqqa chiqib ketgan sahifa esingizdami? U yerda qaysi teg yetishmagan edi?', 'Вспомни страницу, где весь текст уехал на вкладку. Какого тега там не хватало?', 'Remember the page where all the text ended up on the tab. Which tag was missing there?'),
      L3('Qiya chiziqli teg o‘z qismini yopadi. title ichida nima turadi?', 'Тег с косой чертой закрывает свою часть. Что стоит внутри title?', 'A tag with a slash closes its own part. What’s inside title?'),
      L3('Yopuvchi title tegi sahifa nomini tugatadi.', 'Закрывающий тег title заканчивает название страницы.', 'The closing title tag ends the page name.')],
    ok: L3('Xuddi shunday! U nom qayerda tugashini ko‘rsatadi. U bo‘lmasa, sahifadagi hamma matn yorliqqa chiqib ketadi.', 'Точно! Он показывает, где кончается название. Без него весь текст страницы уезжает на вкладку.', 'Exactly! It shows where the name ends. Without it, all the page text ends up on the tab.')
  },
  s15: {
    say: [
      { text: L3('Mana, sizning birinchi sahifangiz!', 'Вот она, твоя первая страница!', 'Here it is, your very first page!'), k: null },
      { text: L3('Esingizdami? Teg — bu burchakli qavs ichidagi so‘z. Brauzer uni ko‘rsatmaydi, faqat o‘qiydi.', 'Помнишь? Тег — это слово в угловых скобках. Браузер его не показывает, а только читает.', 'Remember? A tag is a word in angle brackets. The browser doesn’t show it, it just reads it.'), k: null },
      { text: L3('html butun sahifani o‘rab turadi: head ham, body ham uning ichida.', 'html обнимает всю страницу: и head, и body — внутри него.', 'html wraps the whole page: both head and body are inside it.'), k: 'html' },
      { text: L3('head sahifa haqidagi ma’lumotlarni saqlaydi.', 'head хранит информацию о странице.', 'head keeps information about the page.'), k: 'head' },
      { text: L3('title head ichida yashaydi. Unga sahifa nomi yoziladi, brauzer esa shu nomni yorliqda ko‘rsatadi.', 'title живёт внутри head. В нём пишут название страницы, а браузер показывает его на вкладке.', 'title lives inside head. It holds the page name, and the browser shows that name on the tab.'), k: 'title' },
      { text: L3('Oynada nima ko‘rinsa, hammasi body ichida turadi.', 'Всё, что видно в окне, живёт внутри body.', 'Everything you see in the window lives inside body.'), k: 'body' },
      { text: L3('Barakalla! Birinchi HTML sahifangiz tayyor. Endi siz haqiqiy veb-dasturchi bo‘lishga bir qadam yaqinlashdingiz!', 'Ура! Твоя первая HTML-страница готова. Ты на шаг ближе к тому, чтобы стать настоящим веб-разработчиком!', 'Hooray! Your first HTML page is ready. You’re one step closer to becoming a real web developer!'), k: null }
    ]
  }
});
