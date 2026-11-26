// Тексты урока 5 модуля Tilda «Цвета и шрифты». Узбекский — первым, «Siz»; апостроф ASCII. RU — «ты» без рода; EN — «you».
// Слова интерфейса Tilda — TW (у uz — русские, как увидит ученик). Цвета в речи — словами, HEX — только на экране.
const PAGE5 = {
  title: L3("RoboKlub: o'z robotingizni yasang!", 'RoboKlub: собери своего робота!', 'RoboKlub: build your own robot!'),
  text: L3("Har shanba robot yig'amiz va dasturlaymiz. Birinchi dars ||bepul||.", 'Каждую субботу собираем и программируем роботов. Первое занятие ||бесплатное||.', 'Every Saturday we build and program robots. The first class is ||free||.'),
  sub: L3('Har shanba — robotlar!', 'Каждую субботу — роботы!', 'Robots every Saturday!'),
  btn: L3("Klubga yozilish", 'Записаться в клуб', 'Join the club')
};
// Названия цветов (печатаются в палитре; в речи — словами).
const COLOR_N = {
  blue: L3("To'q ko'k", 'Тёмно-синий', 'Dark blue'), orange: L3("To'q sariq", 'Оранжевый', 'Orange'), cream: L3('Krem', 'Кремовый', 'Cream'),
  yellow: L3('Och sariq', 'Бледно-жёлтый', 'Pale yellow'), pink: L3('Pushti', 'Розовый', 'Pink'), gray: L3('Och kulrang', 'Светло-серый', 'Light gray'),
  white: L3('Oq', 'Белый', 'White'), black: L3('Qora', 'Чёрный', 'Black')
};

const C = {
  s1: {
    eyebrow: L3('Rang kerak', 'Нужен цвет', 'We need color'),
    from: L3('RoboKlub', 'RoboKlub', 'RoboKlub'),
    msg: L3("Kodi, sayt zo'r, lekin oq-qora, hammanikiga o'xshaydi. Uni klubimiz ranglarida qiling: to'q ko'k va to'q sariq. Shrift ham juda oddiy.",
      'Коди, сайт отличный, но чёрно-белый, как у всех. Сделай его в цветах нашего клуба: тёмно-синий и оранжевый. И шрифт какой-то обычный.',
      'Kodi, the site is great, but it’s black and white like everyone else’s. Make it in our club colors: dark blue and orange. And the font is so plain.'),
    say: L3("RoboKlubdan yangi xabar! Sayt oq-qora, klub esa o'z ranglarini xohlaydi. Sizningcha, saytni qanday bo'yaymiz?",
      'Новое сообщение от RoboKlub! Сайт чёрно-белый, а клуб хочет свои цвета. Как думаешь, как покрасим сайт?',
      'A new message from RoboKlub! The site is black and white, and the club wants its own colors. What do you think, how should we color the site?'),
    ask: L3("Saytni qanday bo'yaymiz?", 'Как покрасим сайт?', 'How should we color the site?'),
    opts: { rainbow: L3("Ko'p rang va har xil shrift", 'Много цветов и разных шрифтов', 'Lots of colors and different fonts'), club: L3("Klubning ikki rangi", 'Два цвета клуба', 'The club’s two colors') },
    reply: {
      rainbow: L3("Men ham shunday o'ylayman!", 'Я тоже так думаю!', 'I think so too!'),
      club: L3("Qiziq fikr. Lekin menda boshqa reja bor.", 'Интересная мысль. Но у меня другой план.', 'Interesting idea. But I have another plan.')
    },
    riddle: L3("Menimcha, rang va shrift qancha ko'p bo'lsa, sayt shuncha yorqin va qiziq bo'ladi. Bugungi topishmoq shu: men haqmanmi? Dars oxirida bilamiz.",
      'По-моему, чем больше цветов и разных шрифтов, тем ярче и интереснее сайт. Сегодняшняя загадка: прав ли я? Узнаем в конце урока.',
      'I think the more colors and different fonts, the brighter and more interesting the site. Today’s riddle: am I right? We’ll find out at the end of the lesson.'),
    askDone: L3("Topishmoq: rang qancha ko'p, shuncha yaxshimi?", 'Загадка: чем больше цветов, тем лучше?', 'Riddle: the more colors, the better?')
  },
  s2: {
    eyebrow: L3('Rang nima uchun', 'Зачем цвет', 'Why color'),
    say: L3("Rang shunchaki chiroy emas. U ko'zni eng muhim joyga olib boradi. Bitta saytni uch xil ko'rinishda solishtiring.",
      'Цвет — не просто украшение. Он ведёт взгляд к самому важному. Сравни один и тот же сайт в трёх видах.',
      'Color isn’t just decoration. It leads the eye to what matters most. Compare the same site in three looks.'),
    steps: [
      L3("Oq-qora sayt. Hammasi bir xil, ko'z hech narsaga to'xtamaydi.", 'Чёрно-белый сайт. Всё одинаковое, взгляду не за что зацепиться.', 'A black and white site. Everything is the same, and the eye has nothing to stop on.'),
      L3("Endi kamalak: har bir blok o'z rangida. Yorqin, lekin ko'z qayerga qarashni bilmaydi. Tugma rang-barang olomonda yo'qolib qoldi.", 'Теперь радуга: у каждого блока свой цвет. Ярко, но глаз не знает, куда смотреть. Кнопка потерялась в пестроте.', 'Now a rainbow: every block in its own color. Bright, but the eye doesn’t know where to look. The button got lost in the crowd.'),
      L3("Endi klubning ikki rangi: sarlavha to'q ko'k, tugma to'q sariq, fon tinch. Ko'z darrov tugmaga boradi! Asosiy rang, ya'ni eng muhim narsaning rangi degani.", 'А теперь два цвета клуба: заголовок тёмно-синий, кнопка оранжевая, фон спокойный. Взгляд сразу идёт на кнопку! Главный цвет — это цвет самого важного.', 'And now the club’s two colors: a dark blue title, an orange button, a calm background. The eye goes straight to the button! The main color is the color of the most important thing.')
    ],
    help: [
      L3("Uchta saytga qarang: qaysi birida ko'z darrov tugmani topadi?", 'Посмотри на три сайта: где взгляд сразу находит кнопку?', 'Look at the three sites: where does the eye find the button right away?'),
      L3("Bir-ikki rang yetadi. Eng yorqin rang eng muhim narsaga beriladi.", 'Хватает одного-двух цветов. Самый яркий — самому важному.', 'One or two colors are enough. The brightest goes to the most important thing.'),
      L3("Xuddi svetofor kabi: uchta rang, har birining o'z ma'nosi bor. O'nta rang bo'lsa, hech kim tushunmasdi.", 'Как светофор: три цвета, у каждого свой смысл. Будь их десять — никто бы не понял.', 'Like a traffic light: three colors, each with a meaning. If there were ten, nobody would understand.')
    ],
    ask: L3("Uchta saytni solishtiring", 'Сравни три сайта', 'Compare the three sites'),
    askDone: L3("Bir-ikki rang, eng yorqini muhim narsada", 'Один-два цвета, самый яркий — у главного', 'One or two colors, the brightest on the main thing')
  },
  s3: {
    eyebrow: L3("O'qiladimi?", 'Читается?', 'Readable?'),
    say: L3("Rangni tanlashda yana bir qoida bor: kontrast, ya'ni matn va fon bir-biridan qanchalik farq qilishi degani. Qaysi birida matn yaxshi o'qiladi? Bosing.",
      'Есть ещё одно правило выбора цвета: контраст — насколько текст отличается от фона. Где текст читается лучше? Нажми.',
      'There’s one more rule for picking colors: contrast, how much the text differs from the background. Where is the text easier to read? Tap it.'),
    ask: L3("Qaysi birida matn yaxshi o'qiladi?", 'Где текст читается лучше?', 'Where is the text easier to read?'),
    rounds: [
      { a: 'b', A: { fg: '#FDE68A', bg: '#FFFFFF' }, B: { fg: '#1E3A8A', bg: '#FFFFFF' },
        why: L3("Och sariq matn oq fonda deyarli ko'rinmaydi. To'q ko'k esa aniq.", 'Бледно-жёлтый текст на белом почти не виден. А тёмно-синий — чётко.', 'Pale yellow text on white is almost invisible. Dark blue is crisp.') },
      { a: 'a', A: { fg: '#FFFFFF', bg: '#1E3A8A' }, B: { fg: '#FFFFFF', bg: '#D1D5DB' },
        why: L3("Oq matnga to'q fon kerak. Och kulrangda u yo'qolib qoladi.", 'Белому тексту нужен тёмный фон. На светло-сером он теряется.', 'White text needs a dark background. On light gray it gets lost.') },
      { a: 'b', A: { fg: '#9CA3AF', bg: '#F3F4F6' }, B: { fg: '#111827', bg: '#F3F4F6' },
        why: L3("Kulrang ustida kulrang, ikkalasi bir-biriga yaqin. Qora matn esa ajralib turadi.", 'Серый на сером — слишком похожи. А тёмный текст выделяется.', 'Gray on gray is too similar. Dark text stands out.') }
    ],
    sample: L3("Har shanba robotlar!", 'Каждую субботу — роботы!', 'Robots every Saturday!'),
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Ko'zingizni qisib qarang: qaysi so'z birinchi ko'rinadi?", 'Прищурься: какое слово видно первым?', 'Squint: which word do you see first?'),
    hint2: L3("Och fonga to'q matn, to'q fonga och matn. Ranglar bir-biriga yaqin bo'lsa, matn yo'qoladi.", 'На светлом фоне — тёмный текст, на тёмном — светлый. Если цвета похожи, текст теряется.', 'Dark text on a light background, light text on a dark one. If the colors are close, the text gets lost.'),
    ok: L3("Barakalla! Siz kontrastni ko'radigan bo'ldingiz.", 'Молодец! Ты теперь видишь контраст.', 'Well done! You can see contrast now.')
  },
  s4: {
    eyebrow: L3('Sayt ranglari', 'Цвета сайта', 'Site colors'),
    say: L3("Tildada saytning ranglari bir joyda sozlanadi: «Настройки сайта». Bir marta tanlaysiz, hamma bloklarga o'zi tushadi. Kuzating.",
      'В Tilda цвета сайта настраиваются в одном месте: «Настройки сайта». Выбираешь один раз — и они сами подключаются ко всем блокам. Смотри.',
      'In Tilda, the site’s colors are set in one place: “Website settings”. You choose once, and they apply to all blocks by themselves. Watch.'),
    steps: [
      L3("Tepadagi loyiha nomini bosaman, loyiha sahifasi ochiladi. Keyin «Настройки сайта».", 'Нажимаю название проекта вверху — открывается страница проекта. Потом «Настройки сайта».', 'I tap the project name at the top, and the project page opens. Then “Website settings”.'),
      L3("Chapda bo'limlar. «Цвета и стили» ni ochaman. Bu yerda to'rtta rang bor: sarlavhalar, matn, havolalar va sahifa foni.", 'Слева разделы. Открываю «Цвета и стили». Здесь четыре цвета: заголовки, текст, ссылки и фон страницы.', 'Sections are on the left. I open “Colors and styles”. There are four colors here: titles, text, links and the page background.'),
      L3("Fon rangining doirachasini bosaman, palitra ochiladi. Pastda saqlangan ranglar bor. Krem rangini tanlayman va «Сохранить изменения». Qarang, fon yumshoq bo'ldi!", 'Нажимаю кружок цвета фона — открывается палитра. Внизу сохранённые цвета. Выбираю кремовый и «Сохранить изменения». Смотри, фон стал мягким!', 'I tap the background color circle, and the palette opens. Saved colors are at the bottom. I pick cream and “Save changes”. Look, the background became soft!')
    ],
    help: [
      L3("Kuzating: loyiha nomi, «Настройки сайта», «Цвета и стили».", 'Следи: название проекта, «Настройки сайта», «Цвета и стили».', 'Watch: the project name, “Website settings”, “Colors and styles”.'),
      L3("Bu yerda tanlangan rang butun saytga birdan tushadi, har blokni alohida bo'yash shart emas.", 'Цвет, выбранный здесь, сразу ложится на весь сайт — не нужно красить каждый блок отдельно.', 'A color chosen here goes onto the whole site at once; you don’t need to paint every block separately.'),
      L3("Xuddi maktab formasi kabi: bir marta kelishasiz, hamma bir xil kiyinadi.", 'Как школьная форма: договорились один раз — и все одеты одинаково.', 'Like a school uniform: you agree once, and everyone dresses the same.')
    ],
    ask: L3("Sayt ranglari qayerda sozlanishini kuzating", 'Смотри, где настраиваются цвета сайта', 'Watch where the site colors are set'),
    askDone: L3("«Настройки сайта» → «Цвета и стили»", '«Настройки сайта» → «Цвета и стили»', '“Website settings” → “Colors and styles”')
  },
  s5: {
    eyebrow: L3('Sarlavha rangi', 'Цвет заголовков', 'Title color'),
    say: L3("Endi o'zingiz. Klub sarlavhalarni to'q ko'k qilishni so'radi. «Цвета и стили» ni oching, sarlavhalar rangini tanlang va saqlang.",
      'Теперь сам. Клуб просил тёмно-синие заголовки. Открой «Цвета и стили», выбери цвет заголовков и сохрани.',
      'Now you. The club asked for dark blue titles. Open “Colors and styles”, choose the title color and save.'),
    ask: L3("Sarlavhalarni to'q ko'k qiling", 'Сделай заголовки тёмно-синими', 'Make the titles dark blue'),
    wrongTab: L3("Bu bo'limda rang yo'q. «Цвета и стили» ni toping.", 'В этом разделе нет цветов. Найди «Цвета и стили».', 'There are no colors in this section. Find “Colors and styles”.'),
    wrongRow: L3("Bu boshqa rang. Bizga «ЦВЕТ ЗАГОЛОВКОВ», ya'ni sarlavhalar rangi kerak.", 'Это другой цвет. Нам нужен «ЦВЕТ ЗАГОЛОВКОВ».', 'That’s a different color. We need the title color.'),
    wrong: {
      yellow: L3("Och sariq oq fonda ko'rinmaydi va klub rangi ham emas.", 'Бледно-жёлтый не виден на белом, и это не цвет клуба.', 'Pale yellow can’t be seen on white, and it isn’t the club’s color.'),
      pink: L3("Pushti chiroyli, lekin klub rangi emas. Klub to'q ko'k so'radi.", 'Розовый красивый, но это не цвет клуба. Клуб просил тёмно-синий.', 'Pink is pretty, but it isn’t the club’s color. The club asked for dark blue.'),
      orange: L3("To'q sariq klub rangi, lekin uni tugma uchun saqlaymiz. Sarlavhaga to'q ko'k.", 'Оранжевый — цвет клуба, но его бережём для кнопки. Заголовкам — тёмно-синий.', 'Orange is a club color, but we save it for the button. Titles get dark blue.')
    },
    hints: [
      L3("Chapdan «Цвета и стили» ni oching.", 'Открой слева «Цвета и стили».', 'Open “Colors and styles” on the left.'),
      L3("«ЦВЕТ ЗАГОЛОВКОВ» doirachasini bosing va saqlangan ranglardan to'q ko'kni tanlang.", 'Нажми кружок «ЦВЕТ ЗАГОЛОВКОВ» и выбери тёмно-синий в сохранённых цветах.', 'Tap the title color circle and choose dark blue from the saved colors.'),
      L3("To'q ko'kni bosing, keyin «Сохранить изменения» ni.", 'Нажми тёмно-синий, потом «Сохранить изменения».', 'Tap dark blue, then “Save changes”.')
    ],
    picked: L3("Aynan shu! Endi «Сохранить изменения» ni bosing.", 'Он самый! Теперь нажми «Сохранить изменения».', 'That’s the one! Now tap “Save changes”.'),
    ok: L3("Zo'r! Sarlavha endi klub rangida.", 'Супер! Заголовок теперь в цвете клуба.', 'Awesome! The title is in the club’s color now.')
  },
  s6: {
    eyebrow: L3('Tugma rangi', 'Цвет кнопки', 'Button color'),
    say: L3("Eng yorqin rang eng muhim narsaga, ya'ni tugmaga. Tugma blokini bosing, «Настройки» ni oching, «КНОПКА» bo'limida fonini to'q sariq, matnini oq qiling.",
      'Самый яркий цвет — самому важному, кнопке. Нажми на блок кнопки, открой «Настройки» и в разделе «КНОПКА» сделай фон оранжевым, а текст белым.',
      'The brightest color goes to the most important thing: the button. Tap the button block, open “Settings”, and in the “Button” section make the background orange and the text white.'),
    ask: L3("Tugmani to'q sariq qiling, matni oq", 'Сделай кнопку оранжевой, текст белым', 'Make the button orange with white text'),
    wrongSec: L3("Bu bo'lim tugma haqida emas. «КНОПКА» ni oching.", 'Этот раздел не про кнопку. Открой «КНОПКА».', 'This section isn’t about the button. Open “Button”.'),
    wrong: {
      gray: L3("Kulrang tugma ko'zga tashlanmaydi. Unga eng yorqin rang kerak.", 'Серая кнопка не бросается в глаза. Ей нужен самый яркий цвет.', 'A gray button doesn’t catch the eye. It needs the brightest color.'),
      blue: L3("To'q ko'k sarlavhalarda bor. Tugma ajralib turishi uchun to'q sariq kerak.", 'Тёмно-синий уже у заголовков. Чтобы кнопка выделялась, нужен оранжевый.', 'Dark blue is already on the titles. For the button to stand out, it needs orange.'),
      fgOrange: L3("To'q sariq fonda to'q sariq matn ko'rinmaydi. Oqni tanlang.", 'Оранжевый текст на оранжевом фоне не виден. Выбери белый.', 'Orange text on an orange background can’t be seen. Pick white.'),
      fgYellow: L3("Och sariq to'q sariq fonda yaxshi o'qilmaydi. Oqni tanlang.", 'Бледно-жёлтый плохо читается на оранжевом. Выбери белый.', 'Pale yellow is hard to read on orange. Pick white.')
    },
    half: L3("Fon tayyor! Endi «ЦВЕТ ТЕКСТА» ni oq qiling.", 'Фон готов! Теперь сделай «ЦВЕТ ТЕКСТА» белым.', 'The background is done! Now make the text color white.'),
    hints: [
      L3("Tugma blokini bosing, keyin «Настройки» ni.", 'Нажми на блок кнопки, потом «Настройки».', 'Tap the button block, then “Settings”.'),
      L3("«КНОПКА» bo'limini oching. U yerda «ЦВЕТ ФОНА» va «ЦВЕТ ТЕКСТА» bor.", 'Открой раздел «КНОПКА». Там «ЦВЕТ ФОНА» и «ЦВЕТ ТЕКСТА».', 'Open the “Button” section. It has the background color and the text color.'),
      L3("Fonga to'q sariq, matnga oq, keyin «Сохранить и закрыть».", 'Фону — оранжевый, тексту — белый, потом «Сохранить и закрыть».', 'Orange for the background, white for the text, then “Save and close”.')
    ],
    picked: L3("Tayyor! Endi «Сохранить и закрыть» ni bosing.", 'Готово! Теперь нажми «Сохранить и закрыть».', 'Done! Now tap “Save and close”.'),
    ok: L3("Ajoyib! Endi ko'z darrov tugmaga boradi.", 'Здорово! Теперь взгляд сразу идёт на кнопку.', 'Awesome! Now the eye goes straight to the button.')
  },
  s7: {
    eyebrow: L3('Solishtiring', 'Сравни', 'Compare'),
    say: L3("Men saytingizni yanada yorqinroq qildim: har bir blokka o'z rangini berdim! Ikkalasini solishtiring. Qaysi biri yaxshiroq? Bosing.",
      'Я сделал твой сайт ещё ярче: дал каждому блоку свой цвет! Сравни оба. Какой лучше? Нажми.',
      'I made your site even brighter: I gave every block its own color! Compare both. Which is better? Tap it.'),
    ask: L3("Qaysi sayt yaxshiroq?", 'Какой сайт лучше?', 'Which site is better?'),
    wrong: L3("Bu kamalak: ko'z qayerga qarashni bilmaydi, tugma yo'qoldi. Ikkinchisiga qarang.", 'Это радуга: глаз не знает, куда смотреть, кнопка потерялась. Посмотри на второй.', 'That’s a rainbow: the eye doesn’t know where to look, and the button got lost. Look at the other one.'),
    ok: L3("To'g'ri! Ikki rang va tinch fon. Demak, rang ko'p bo'lsa yaxshi emas ekan.", 'Верно! Два цвета и спокойный фон. Значит, много цветов — не лучше.', 'Right! Two colors and a calm background. So more colors isn’t better.')
  },
  s8: {
    eyebrow: L3('Shrift', 'Шрифт', 'Font'),
    say: L3("Endi shrift, ya'ni harflarning shakli degani. Bu saytning dastxati, uning ham o'z xarakteri bor. Bitta so'zni turli shriftlarda kuzating.",
      'Теперь шрифт — это форма букв. Это почерк сайта, и у него есть характер. Смотри одно слово в разных шрифтах.',
      'Now the font, the shape of the letters. It’s the site’s handwriting, and it has a character. Watch one word in different fonts.'),
    steps: [
      L3("Montserrat: keng va qalin, zamonaviy. Texnika, sport va robotlar uchun mos.", 'Montserrat — широкий и плотный, современный. Подходит технике, спорту, роботам.', 'Montserrat: wide and solid, modern. It suits tech, sports and robots.'),
      L3("Playfair Display: nozik va bayramona. Gul do'koni yoki to'y uchun.", 'Playfair Display — тонкий и нарядный. Для цветочного магазина или свадьбы.', 'Playfair Display: elegant and festive. For a flower shop or a wedding.'),
      L3("Comfortaa: yumaloq va yumshoq. Bolalar va o'yinchoqlar uchun.", 'Comfortaa — круглый и мягкий. Для детей и игрушек.', 'Comfortaa: round and soft. For kids and toys.'),
      L3("Oswald: tor va baland, xuddi gazeta sarlavhasi. Source Code Pro esa kod uchun, uni oddiy saytga qo'ymaymiz.", 'Oswald — узкий и высокий, как газетный заголовок. А Source Code Pro — для кода, на обычный сайт его не ставят.', 'Oswald: narrow and tall, like a newspaper headline. And Source Code Pro is for code; we don’t put it on a regular site.')
    ],
    help: [
      L3("Bitta so'zga qarang: har bir shriftda u boshqacha his beradi.", 'Посмотри на одно слово: в каждом шрифте оно ощущается по-разному.', 'Look at one word: in each font it feels different.'),
      L3("Shrift sayt mavzusiga mos bo'lsin. Bir saytga bitta shrift yetadi.", 'Шрифт подбирают под тему сайта. На один сайт хватает одного шрифта.', 'The font should fit the site’s topic. One font is enough for one site.'),
      L3("Xuddi kiyim kabi: futbolga kostyumda, to'yga sport formasida bormaysiz.", 'Как одежда: на футбол не идут в костюме, а на свадьбу — в спортивной форме.', 'Like clothes: you don’t play football in a suit or go to a wedding in a sports kit.')
    ],
    ask: L3("Shriftlarni kuzating", 'Смотри на шрифты', 'Watch the fonts'),
    askDone: L3("Shrift sayt mavzusiga mos bo'lsin", 'Шрифт — под тему сайта', 'The font fits the site’s topic')
  },
  s9: {
    eyebrow: L3('Qaysi shrift?', 'Какой шрифт?', 'Which font?'),
    say: L3("Har bir sayt uchun mos shriftni tanlang. Shriftning xarakteriga qarang.",
      'Выбери каждому сайту подходящий шрифт. Смотри на характер шрифта.',
      'Pick the right font for each site. Look at the font’s character.'),
    ask: L3("Bu saytga qaysi shrift mos?", 'Какой шрифт подходит этому сайту?', 'Which font suits this site?'),
    rounds: [
      { q: L3("Robototexnika klubi", 'Кружок робототехники', 'Robotics club'), word: 'RoboKlub', a: 'montserrat',
        why: L3("Robotlarga zamonaviy va qalin shrift mos.", 'Роботам подходит современный плотный шрифт.', 'Robots suit a modern, solid font.') },
      { q: L3("Gul do'koni", 'Цветочный магазин', 'Flower shop'), word: 'Lola', a: 'playfair',
        why: L3("Gullarga nozik, bayramona shrift mos.", 'Цветам подходит тонкий нарядный шрифт.', 'Flowers suit an elegant, festive font.') },
      { q: L3("Bolalar bog'chasi", 'Детский сад', 'Kindergarten'), word: 'Quyoshcha', a: 'comfortaa',
        why: L3("Bolalarga yumaloq, yumshoq shrift mos.", 'Детям подходит круглый мягкий шрифт.', 'Kids suit a round, soft font.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Sayt kim uchun? Shrift ham o'sha odamlarga mos bo'lsin.", 'Для кого сайт? Шрифт должен подходить этим людям.', 'Who is the site for? The font should suit those people.'),
    hint2: L3("Texnika uchun qalin va zamonaviy, gullar uchun nozik, bolalar uchun yumaloq.", 'Технике — плотный современный, цветам — тонкий, детям — круглый.', 'Solid and modern for tech, elegant for flowers, round for kids.'),
    ok: L3("Barakalla! Siz shriftning xarakterini ko'rasiz.", 'Молодец! Ты видишь характер шрифта.', 'Well done! You can see a font’s character.')
  },
  s10: {
    eyebrow: L3('Shriftni almashtiring', 'Смени шрифт', 'Change the font'),
    say: L3("Endi RoboKlub saytiga mos shrift qo'yamiz. «Настройки сайта» da «Шрифты» ni oching, strelkalar bilan Montserrat ni toping va «Выбрать» ni bosing.",
      'Теперь поставим сайту RoboKlub подходящий шрифт. В «Настройки сайта» открой «Шрифты», стрелками найди Montserrat и нажми «Выбрать».',
      'Now let’s give the RoboKlub site a fitting font. In “Website settings” open “Fonts”, find Montserrat with the arrows and tap “Choose”.'),
    ask: L3("Saytga Montserrat shriftini qo'ying", 'Поставь сайту шрифт Montserrat', 'Set the site font to Montserrat'),
    wrongTab: L3("Bu bo'limda shrift yo'q. «Шрифты» ni toping.", 'В этом разделе нет шрифтов. Найди «Шрифты».', 'There are no fonts in this section. Find “Fonts”.'),
    wrong: {
      roboto: L3("Roboto oddiy va tinch. Robotlar klubiga qalinroq va zamonaviyroq shrift kerak: Montserrat.", 'Roboto — простой и спокойный. Кружку роботов нужен плотнее и современнее: Montserrat.', 'Roboto is plain and calm. A robot club needs something bolder and more modern: Montserrat.'),
      playfair: L3("Playfair Display gullar va to'y uchun. Robotlarga Montserrat mos.", 'Playfair Display — для цветов и свадьбы. Роботам подходит Montserrat.', 'Playfair Display is for flowers and weddings. Montserrat suits robots.'),
      oswald: L3("Oswald gazeta sarlavhasiga o'xshaydi, uzun matnda o'qish qiyin. Montserrat ni toping.", 'Oswald похож на газетный заголовок, длинный текст им читать трудно. Найди Montserrat.', 'Oswald looks like a newspaper headline and is hard to read in long text. Find Montserrat.'),
      comfortaa: L3("Comfortaa bolalar uchun. Klub o'smirlar uchun, unga Montserrat mos.", 'Comfortaa — для малышей. Кружок для подростков, ему подходит Montserrat.', 'Comfortaa is for little kids. The club is for teens; Montserrat suits it.'),
      code: L3("Source Code Pro kod uchun. Oddiy saytda u g'alati ko'rinadi.", 'Source Code Pro — для кода. На обычном сайте он выглядит странно.', 'Source Code Pro is for code. On a regular site it looks odd.')
    },
    hints: [
      L3("Chapdan «Шрифты» ni oching.", 'Открой слева «Шрифты».', 'Open “Fonts” on the left.'),
      L3("O'ngga strelkani bosing: har bosishda boshqa shrift chiqadi.", 'Нажимай стрелку вправо: каждый раз появляется другой шрифт.', 'Tap the right arrow: each time a different font appears.'),
      L3("Montserrat ga yetganda «Выбрать» ni, keyin «Сохранить изменения» ni bosing.", 'Дойдя до Montserrat, нажми «Выбрать», потом «Сохранить изменения».', 'When you reach Montserrat, tap “Choose”, then “Save changes”.')
    ],
    picked: L3("Tanlandi! Endi «Сохранить изменения» ni bosing.", 'Выбрано! Теперь нажми «Сохранить изменения».', 'Chosen! Now tap “Save changes”.'),
    ok: L3("Zo'r! Sayt endi zamonaviy va robotlarga mos.", 'Супер! Сайт теперь современный и подходит роботам.', 'Awesome! The site is modern now and suits robots.')
  },
  s11: {
    eyebrow: L3("Xatolarni toping", 'Найди ошибки', 'Find the mistakes'),
    say: L3("Do'stingiz o'z saytini ko'rsatdi. Unda uchta xato bor: rang va shrift bilan bog'liq. Xato joyni bosing, u to'g'rilanadi.",
      'Друг показал свой сайт. В нём три ошибки с цветом и шрифтом. Нажми на ошибку — она исправится.',
      'A friend showed their site. It has three mistakes with color and font. Tap a mistake and it gets fixed.'),
    ask: L3("Uchta xatoni toping", 'Найди три ошибки', 'Find three mistakes'),
    fix: {
      pale: L3("Topdingiz! Och sariq matn oq fonda o'qilmaydi. Endi to'q.", 'Есть! Бледно-жёлтый текст на белом не читается. Теперь тёмный.', 'Found it! Pale yellow text on white can’t be read. It’s dark now.'),
      font: L3("Topdingiz! Bu uchinchi shrift edi. Bir saytga bitta shrift yetadi.", 'Есть! Это был третий шрифт. На один сайт хватает одного.', 'Found it! That was a third font. One font is enough for one site.'),
      rainbow: L3("Topdingiz! Har blok o'z rangida edi. Endi fon tinch, tugma ajralib turadi.", 'Есть! У каждого блока был свой цвет. Теперь фон спокойный, кнопка выделяется.', 'Found it! Every block had its own color. Now the background is calm and the button stands out.')
    },
    site: { title: L3("Futbol maktabi «Gol»", 'Футбольная школа «Гол»', 'Football school “Goal”'), sub: L3("Har kuni mashg'ulot, 7 yoshdan", 'Тренировки каждый день, с 7 лет', 'Training every day, from age 7'),
      blocks: [L3('Murabbiylar', 'Тренеры', 'Coaches'), L3('Jadval', 'Расписание', 'Schedule'), L3('Narxlar', 'Цены', 'Prices')], btn: L3('Yozilish', 'Записаться', 'Sign up') },
    good: L3("Bu joy to'g'ri. Boshqa joyga qarang.", 'Здесь всё хорошо. Посмотри в другом месте.', 'This part is fine. Look somewhere else.'),
    hints: [
      L3("Matn, shrift va ranglarga qarang: qayerda nimadir noqulay?", 'Посмотри на текст, шрифт и цвета: где что-то неудобно?', 'Look at the text, the font and the colors: where is something awkward?'),
      L3("Bitta matn deyarli ko'rinmaydi. Bitta sarlavha boshqa shriftda. Pastdagi bloklar har xil rangda.", 'Один текст почти не виден. Один заголовок другим шрифтом. Нижние блоки разного цвета.', 'One text is almost invisible. One title is in another font. The lower blocks are in different colors.'),
      L3("Och sariq matnni, egri harfli sarlavhani va rang-barang bloklarni bosing.", 'Нажми бледно-жёлтый текст, заголовок с кривыми буквами и пёстрые блоки.', 'Tap the pale yellow text, the title with curly letters and the multicolored blocks.')
    ],
    ok: L3("Ajoyib! Hammasini topdingiz. Endi sayt toza va o'qiladi.", 'Отлично! Все ошибки найдены. Теперь сайт чистый и читается.', 'Excellent! You found them all. Now the site is clean and readable.')
  },
  s12: {
    eyebrow: L3("Haqiqiy Tildada", 'В настоящей Tilda', 'In the real Tilda'),
    say: L3("Endi hammasini haqiqiy Tildadagi saytingizda qiling. Pastdagi qadamlar bo'yicha boring va oxirida «Опубликовать» ni bosing. Tayyor bo'lsa, saytingiz manzilini yozing. Hozir imkon bo'lmasa, keyinroq qilasiz.",
      'Теперь сделай всё на своём сайте в настоящей Tilda. Иди по шагам ниже и в конце нажми «Опубликовать». Готово — напиши адрес своего сайта; нет возможности сейчас — сделаешь позже.',
      'Now do it all on your site in the real Tilda. Follow the steps below and tap “Publish” at the end. When it’s done, type your site’s address; if you can’t right now, do it later.'),
    todo: [
      L3("tilda.cc da «Войти», keyin loyihangiz sahifasida «Настройки сайта».", 'На tilda.cc нажми «Войти», потом на странице проекта — «Настройки сайта».', 'On tilda.cc tap “Log in”, then “Website settings” on your project page.'),
      L3("Saytingiz uchun 1–2 rang tanlang: biri asosiy, biri yordamchi.", 'Выбери для сайта 1–2 цвета: главный и помощник.', 'Pick 1–2 colors for your site: a main one and a helper.'),
      L3("«Цвета и стили»: sarlavha va matn rangi, kerak bo'lsa fon.", '«Цвета и стили»: цвет заголовков и текста, если нужно — фон.', '“Colors and styles”: the title and text colors, the background if needed.'),
      L3("«Шрифты»: mavzuga mos bitta shriftni «Выбрать», keyin «Сохранить изменения».", '«Шрифты»: «Выбрать» один шрифт под тему, потом «Сохранить изменения».', '“Fonts”: “Choose” one font that fits the topic, then “Save changes”.'),
      L3("Tugma blokida «Настройки» → «КНОПКА»: fon — asosiy rang, matn — oq.", 'В блоке кнопки «Настройки» → «КНОПКА»: фон — главный цвет, текст — белый.', 'In the button block, “Settings” → “Button”: background in the main color, white text.'),
      L3("Matn o'qilishini tekshiring va «Опубликовать» ni bosing.", 'Проверь, что текст читается, и нажми «Опубликовать».', 'Check that the text is readable and tap “Publish”.')
    ],
    ph: L3('masalan: brave-orange-robot.tilda.ws', 'например: brave-orange-robot.tilda.ws', 'for example: brave-orange-robot.tilda.ws'),
    check: L3('Tekshirish', 'Проверить', 'Check'),
    later: L3('Keyinroq qilaman', 'Сделаю позже', 'I’ll do it later'),
    ask: L3("Saytingizga rang va shrift bering va manzilini yozing", 'Дай своему сайту цвета и шрифт и напиши адрес', 'Give your site colors and a font and type its address'),
    bad: L3("Bu Tilda manziliga o'xshamaydi. Tilda manzili .tilda.ws bilan tugaydi.", 'Это не похоже на адрес Tilda. Адрес Tilda заканчивается на .tilda.ws.', 'That doesn’t look like a Tilda address. A Tilda address ends in .tilda.ws.'),
    demo: L3("Bu darsdagi namuna manzil. O'z saytingiz manzilini yozing.", 'Это адрес-пример из урока. Напиши адрес своего сайта.', 'That’s the example address from the lesson. Type your own site’s address.'),
    ok: L3("Zo'r! Saytingiz endi o'z ranglari va shrifti bilan!", 'Супер! У твоего сайта теперь свои цвета и шрифт!', 'Awesome! Your site has its own colors and font now!'),
    okLater: L3("Mayli. Uyda shu qadamlar bo'yicha qiling.", 'Хорошо. Сделай дома по этим шагам.', 'Okay. Do it at home with these steps.')
  },
  s13: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men rang va shrift qancha ko'p bo'lsa, shuncha yaxshi degandim? Xato qilibman! Rang ko'p bo'lsa, hech narsa ajralmaydi, shrift ko'p bo'lsa, sayt tartibsiz bo'ladi.",
        'Помнишь, я говорил, что чем больше цветов и шрифтов, тем лучше? Я ошибся! Когда цветов много, ничего не выделяется, а много шрифтов делает сайт неряшливым.',
        'Remember when I said the more colors and fonts, the better? I was wrong! With many colors nothing stands out, and many fonts make a site messy.') },
      { k: 'color', text: L3("Bir-ikki rang yetadi: eng yorqini eng muhim narsada, ya'ni tugmada.", 'Хватает одного-двух цветов: самый яркий — у самого важного, у кнопки.', 'One or two colors are enough: the brightest on the most important thing, the button.') },
      { k: 'contrast', text: L3("Matn va fon bir-biridan aniq farq qilsin, shunda matn o'qiladi.", 'Текст и фон должны заметно отличаться — тогда текст читается.', 'Text and background should differ clearly; then the text is readable.') },
      { k: 'font', text: L3("Bitta shrift, sayt mavzusiga mos. Hammasi «Настройки сайта» da sozlanadi.", 'Один шрифт, под тему сайта. Всё это настраивается в «Настройки сайта».', 'One font that fits the topic. It’s all set in “Website settings”.') },
      { k: null, text: L3("Barakalla! RoboKlub sayti endi klub ranglarida va o'z shriftida. Keyingi darsda saytni o'qish uchun qulay qilamiz!",
        'Ура! Сайт RoboKlub теперь в цветах клуба и со своим шрифтом. На следующем уроке сделаем сайт удобным для чтения!',
        'Hooray! The RoboKlub site is now in the club’s colors with its own font. Next lesson we’ll make the site easy to read!') }
    ],
    ask: L3("Sayt klub ranglarida va o'z shriftida", 'Сайт в цветах клуба и со своим шрифтом', 'The site is in the club’s colors with its own font'),
    roles: { riddle: L3("Ko'p rang — yaxshi emas", 'Много цветов — не лучше', 'More colors isn’t better'), color: L3("Asosiy rang — tugmada", 'Главный цвет — у кнопки', 'Main color on the button'),
      contrast: L3("Matn o'qilsin: kontrast", 'Контраст: текст читается', 'Contrast: text is readable'), font: L3("Bitta shrift, mavzuga mos", 'Один шрифт под тему', 'One font that fits') }
  }
};
