// Тексты урока 4 модуля Tilda «Картинки и Cover». Узбекский — первым, «Siz»; апостроф ASCII. RU — «ты» без рода; EN — «you».
// Слова интерфейса Tilda — TW (у uz — русские, как увидит ученик). Проценты на экране — цифрами, в речи — словами.
const PAGE4 = {
  title: L3("RoboKlub: o'z robotingizni yasang!", 'RoboKlub: собери своего робота!', 'RoboKlub: build your own robot!'),
  text: L3("Har shanba robot yig'amiz va dasturlaymiz. Birinchi dars ||bepul||.", 'Каждую субботу собираем и программируем роботов. Первое занятие ||бесплатное||.', 'Every Saturday we build and program robots. The first class is ||free||.'),
  sub: L3('Har shanba — robotlar!', 'Каждую субботу — роботы!', 'Robots every Saturday!'),
  btn: L3("Klubga yozilish", 'Записаться в клуб', 'Join the club')
};

const C = {
  s1: {
    eyebrow: L3('Sayt zerikarli', 'Сайт скучный', 'The site is boring'),
    from: L3('RoboKlub', 'RoboKlub', 'RoboKlub'),
    msg: L3("Kodi, rahmat, saytni endi o'qishyapti! Lekin u zerikarli: faqat harflar. Muqovada esa qandaydir begona tog'lar. Rasm kerak!",
      'Коди, спасибо, сайт теперь читают! Но он скучный: одни буквы. А на обложке какие-то чужие горы. Нужны картинки!',
      'Kodi, thanks, people read the site now! But it’s boring: only letters. And the cover shows some random mountains. We need pictures!'),
    say: L3("RoboKlubdan yangi xabar! Saytga qarang: faqat matn, muqovada esa klubga aloqasi yo'q tog'lar. Sizningcha, qanday rasm qo'shamiz?",
      'Новое сообщение от RoboKlub! Посмотри на сайт: только текст, а на обложке горы, которые к клубу отношения не имеют. Как думаешь, какие картинки добавим?',
      'A new message from RoboKlub! Look at the site: only text, and the cover shows mountains that have nothing to do with the club. What do you think, which pictures should we add?'),
    ask: L3("Qanday rasm qo'shamiz?", 'Какие картинки добавим?', 'Which pictures should we add?'),
    opts: { many: L3("Ko'p chiroyli rasm", 'Много красивых картинок', 'Lots of pretty pictures'), club: L3("Klubimiz rasmi", 'Фото нашего клуба', 'A photo of our club') },
    reply: {
      many: L3("Men ham shunday o'ylayman!", 'Я тоже так думаю!', 'I think so too!'),
      club: L3("Qiziq fikr. Lekin menda boshqa reja bor.", 'Интересная мысль. Но у меня другой план.', 'Interesting idea. But I have another plan.')
    },
    riddle: L3("Menimcha, rasm qancha ko'p va qancha yorqin bo'lsa, shuncha yaxshi. Chiroyli bo'lsa bas, istalgan rasm yaraydi. Bugungi topishmoq shu: men haqmanmi? Dars oxirida bilamiz.",
      'По-моему, чем больше картинок и чем они ярче, тем лучше. Подойдёт любая, лишь бы красивая. Сегодняшняя загадка: прав ли я? Узнаем в конце урока.',
      'I think the more pictures and the brighter they are, the better. Any picture will do, as long as it’s pretty. Today’s riddle: am I right? We’ll find out at the end of the lesson.'),
    askDone: L3("Topishmoq: istalgan chiroyli rasm yaraydimi?", 'Загадка: подойдёт любая красивая картинка?', 'Riddle: will any pretty picture do?')
  },
  s2: {
    eyebrow: L3('Rasm bloki', 'Блок картинки', 'Image block'),
    say: L3("Rasm ham blok. Uni kutubxonadan olamiz, keyin ichiga fotosurat qo'yamiz. Kuzating: kursor hammasini ko'rsatadi.",
      'Картинка — тоже блок. Берём его из библиотеки, а потом ставим в него фото. Смотри: курсор всё покажет.',
      'A picture is a block too. We take it from the library, then put a photo in it. Watch: the cursor will show everything.'),
    steps: [
      L3("Matn blokini bosaman, ostida qora plyus chiqadi. Plyus, keyin «Изображение» bo'limi va IM01 bloki. Matndan keyin kulrang joy paydo bo'ldi, ya'ni rasm uchun bo'sh o'rin degani.", 'Нажимаю на блок текста — под ним появляется чёрный плюс. Плюс, потом раздел «Изображение» и блок IM01. После текста появилось серое место — пустое место для фото.', 'I tap the text block, and a black plus appears under it. The plus, then the “Image” section and block IM01. A grey area appeared after the text: an empty place for a photo.'),
      L3("Endi «Контент». O'z rasmingizni «Загрузить файл» bilan yuklash mumkin. Lekin Tildada bepul rasmlar kutubxonasi ham bor: «Искать в библиотеке».", 'Теперь «Контент». Своё фото можно загрузить кнопкой «Загрузить файл». Но в Tilda есть и библиотека бесплатных фото: «Искать в библиотеке».', 'Now “Content”. You can upload your own photo with “Upload file”. But Tilda also has a library of free photos: “Search in library”.'),
      L3("Qidiruvga inglizcha yozamiz: robot. Mana, robotlar rasmlari. Bittasini bossangiz, u darrov blokka tushadi, keyin «Сохранить и закрыть». Qaysi rasm kerakligini esa o'zingiz tanlaysiz.", 'В поиске пишем по-английски: robot. Вот фото роботов. Нажмёшь одно — оно сразу встанет в блок, потом «Сохранить и закрыть». А какое фото нужно, выберешь сам.', 'In the search we type in English: robot. Here are robot photos. Tap one and it goes straight into the block, then “Save and close”. Which photo is needed, you’ll choose yourself.')
    ],
    help: [
      L3("Kuzating: plyus, «Изображение», IM01, keyin «Контент».", 'Следи: плюс, «Изображение», IM01, потом «Контент».', 'Watch: the plus, “Image”, IM01, then “Content”.'),
      L3("Blok bu rasm uchun ramka. Fotoni esa «Контент» da tanlaymiz.", 'Блок — рамка для картинки, а само фото выбираем в «Контенте».', 'The block is a frame for a picture; the photo itself is chosen in “Content”.'),
      L3("Xuddi fotoalbom kabi: oldin bo'sh ramka, keyin unga surat qo'yasiz.", 'Как фотоальбом: сначала пустая рамка, потом в неё вставляешь снимок.', 'Like a photo album: first an empty frame, then you put a picture in it.')
    ],
    ask: L3("Rasm qanday qo'shilishini kuzating", 'Смотри, как добавить картинку', 'Watch how to add a picture'),
    askDone: L3("Blok, keyin «Контент» da fotosurat", 'Блок, потом фото в «Контенте»', 'A block, then a photo in “Content”')
  },
  s3: {
    eyebrow: L3("Rasm qo'shing", 'Добавь картинку', 'Add a picture'),
    say: L3("Endi o'zingiz. Matndan keyin rasm kerak. Matn blokini bosing, ostidagi plyusni bosing va «Изображение» bo'limidan bepul blokni tanlang.",
      'Теперь сам. После текста нужна картинка. Нажми на блок текста, потом на плюс под ним и выбери бесплатный блок в разделе «Изображение».',
      'Now you. A picture is needed after the text. Tap the text block, then the plus under it, and pick the free block in the “Image” section.'),
    ask: L3("Matndan keyin rasm qo'shing: plyus, «Изображение», IM01", 'Добавь картинку после текста: плюс, «Изображение», IM01', 'Add a picture after the text: plus, “Image”, IM01'),
    wrongPlace: L3("Rasm matndan keyin kerak. Matn blokini tanlang va uning plyusini bosing.", 'Картинка нужна после текста. Выбери блок текста и нажми его плюс.', 'The picture goes after the text. Select the text block and tap its plus.'),
    wrongCat: L3("Bu bo'limda rasm bloki yo'q. «Изображение» bo'limini toping.", 'В этом разделе нет блока картинки. Найди раздел «Изображение».', 'There’s no image block in this section. Find the “Image” section.'),
    locked: L3("Bu blok qulf bilan, ya'ni pullik degani. Bepul blokni tanlang: IM01.", 'У этого блока замок — он платный. Выбери бесплатный: IM01.', 'This block has a lock, so it’s paid. Pick the free one: IM01.'),
    hints: [
      L3("Klub haqidagi matn blokini bosing.", 'Нажми на блок с текстом о клубе.', 'Tap the block with the text about the club.'),
      L3("Blok ostida qora plyus bor. Uni bosing, keyin «Изображение» bo'limini toping.", 'Под блоком есть чёрный плюс. Нажми его, потом найди раздел «Изображение».', 'There’s a black plus under the block. Tap it, then find the “Image” section.'),
      L3("Qulfi yo'q kartani bosing: IM01.", 'Нажми карточку без замка: IM01.', 'Tap the card without a lock: IM01.')
    ],
    ok: L3("Blok joyida! Hozircha u kulrang, ichida fotosurat yo'q.", 'Блок на месте! Пока он серый, фото в нём нет.', 'The block is in place! It’s grey for now; there’s no photo in it.')
  },
  s4: {
    eyebrow: L3('Fotosurat tanlang', 'Выбери фото', 'Pick a photo'),
    say: L3("Kulrang blokka fotosurat qo'yamiz. «Контент» ni oching, keyin «Искать в библиотеке» ni bosing. Qidiruvda robot deb yozilgan. Klubda nima qilinishini ko'rsatadigan rasmni tanlang.",
      'Поставим фото в серый блок. Открой «Контент», потом нажми «Искать в библиотеке». В поиске уже написано robot. Выбери фото, где видно, чем занимаются в клубе.',
      'Let’s put a photo in the grey block. Open “Content”, then tap “Search in library”. The search already says robot. Pick the photo that shows what people do in the club.'),
    ask: L3("Klubda nima qilinishini ko'rsatadigan rasmni tanlang", 'Выбери фото, где видно, чем занимаются в клубе', 'Pick the photo that shows what people do in the club'),
    wrong: {
      movie: L3("Bu kinodagi robot. Klubda esa bolalar robot yig'ishadi, shunday rasmni qidiring.", 'Это робот из кино. А в клубе дети собирают роботов — ищи такое фото.', 'That’s a robot from a movie. In the club, kids build robots, so look for a photo like that.'),
      vacuum: L3("Bu robot-changyutgich. U uyni tozalaydi, klub haqida emas.", 'Это робот-пылесос. Он убирает дом, а не рассказывает о клубе.', 'That’s a robot vacuum. It cleans a house; it’s not about the club.'),
      factory: L3("Bu zavod. Klub saytiga dars rasmi kerak.", 'Это завод. Сайту клуба нужно фото занятия.', 'That’s a factory. The club’s site needs a photo of a class.')
    },
    hints: [
      L3("Rasm blokini bosing, keyin «Контент» ni.", 'Нажми на блок картинки, потом «Контент».', 'Tap the image block, then “Content”.'),
      L3("«Искать в библиотеке» ni bosing va rasmlarga qarang: qaysi birida bolalar robot yig'yapti?", 'Нажми «Искать в библиотеке» и посмотри на фото: на каком дети собирают робота?', 'Tap “Search in library” and look at the photos: in which one are kids building a robot?'),
      L3("Stol atrofida bolalar va robot bor rasmni bosing, keyin «Сохранить и закрыть» ni.", 'Нажми фото, где за столом дети и робот, потом «Сохранить и закрыть».', 'Tap the photo with kids and a robot at a table, then “Save and close”.')
    ],
    picked: L3("To'g'ri rasm! Endi «Сохранить и закрыть» ni bosing.", 'То самое фото! Теперь нажми «Сохранить и закрыть».', 'That’s the one! Now tap “Save and close”.'),
    ok: L3("Ajoyib! Rasmga qarab, klubda nima qilinishini darrov tushunasiz.", 'Здорово! Смотришь на фото и сразу понимаешь, чем занимаются в клубе.', 'Awesome! One look at the photo and you know what people do in the club.')
  },
  s5: {
    eyebrow: L3('Alt-matn', 'Альт-текст', 'Alt text'),
    say: L3("Rasmning yana bitta sozlamasi bor: alt-matn, ya'ni rasmning so'z bilan tavsifi degani. Rasm ochilmasa yoki odam ko'rmasa, telefon shu matnni o'qib beradi. HTML darsidagi alt esingizdami? Bu o'sha. Fayl qatoridagi uch nuqtani bosing va eng yaxshi tavsifni tanlang.",
      'У картинки есть ещё одна настройка: альт-текст — описание картинки словами. Если фото не открылось или человек не видит, телефон прочитает этот текст вслух. Помнишь alt из урока HTML? Это он. Нажми три точки в строке файла и выбери лучшее описание.',
      'A picture has one more setting: alt text, a description of the picture in words. If the photo doesn’t load or a person can’t see, the phone reads this text aloud. Remember alt from the HTML lesson? This is it. Tap the three dots in the file row and pick the best description.'),
    ask: L3("Rasmga eng yaxshi tavsifni tanlang", 'Выбери картинке лучшее описание', 'Pick the best description for the picture'),
    opts: { file: L3('photo-1527430253228.jpg', 'photo-1527430253228.jpg', 'photo-1527430253228.jpg'), pic: L3('Rasm', 'Картинка', 'Picture'),
      kids: L3("Bolalar robot yig'yapti", 'Дети собирают робота', 'Kids are building a robot') },
    wrong: {
      file: L3("Bu fayl nomi. U rasmda nima borligini aytmaydi.", 'Это имя файла. Оно не говорит, что на картинке.', 'That’s the file name. It doesn’t say what’s in the picture.'),
      pic: L3("«Rasm» juda umumiy. Rasmda aynan nima borligini ayting.", '«Картинка» — слишком общее слово. Скажи, что именно на ней.', '“Picture” is too general. Say what exactly is in it.')
    },
    hints: [
      L3("Fayl nomi yonidagi uch nuqtani bosing.", 'Нажми три точки рядом с именем файла.', 'Tap the three dots next to the file name.'),
      L3("Ko'rmaydigan odamga rasmni so'z bilan tasvirlab bering: unda nima bor?", 'Опиши картинку словами для того, кто её не видит: что на ней?', 'Describe the picture in words for someone who can’t see it: what’s in it?'),
      L3("Rasmda nima bo'layotganini aytgan tavsifni tanlang.", 'Выбери описание, которое говорит, что происходит на фото.', 'Pick the description that says what’s happening in the photo.')
    ],
    picked: L3("Aniq tavsif! Endi «Сохранить и закрыть» ni bosing.", 'Точное описание! Теперь нажми «Сохранить и закрыть».', 'A precise description! Now tap “Save and close”.'),
    ok: L3("Zo'r! Endi rasmni ko'rmagan odam ham undagi narsani biladi.", 'Супер! Теперь даже тот, кто не видит фото, знает, что на нём.', 'Awesome! Now even someone who can’t see the photo knows what’s in it.')
  },
  s6: {
    eyebrow: L3('Ortiqcha rasmlar', 'Лишние картинки', 'Extra pictures'),
    say: L3("Men yana rasm qo'shdim: mushuk, quyosh botishi va pitsa. Rasm qancha ko'p bo'lsa, shuncha yaxshi-ku! Lekin ular klub haqidami? Ortiqchalarini savat bilan o'chiring. Klub rasmini qoldiring.",
      'Я добавил ещё картинок: кота, закат и пиццу. Чем больше, тем лучше, правда? Но они про клуб? Удали лишние корзиной. Фото клуба оставь.',
      'I added more pictures: a cat, a sunset and a pizza. The more the better, right? But are they about the club? Delete the extra ones with the trash can. Keep the club photo.'),
    ask: L3("Klubga aloqasi yo'q rasmlarni o'chiring", 'Удали картинки, которые не про клуб', 'Delete the pictures that aren’t about the club'),
    keep: L3("Bu klub rasmi, uni qoldiramiz. Klubga aloqasi yo'q rasmni o'chiring.", 'Это фото клуба, его оставляем. Удали картинку, которая не про клуб.', 'That’s the club photo; we keep it. Delete a picture that isn’t about the club.'),
    wrongTool: L3("Bu boshqa tugma. Savatni bosing.", 'Это другая кнопка. Нажми корзину.', 'That’s a different button. Tap the trash can.'),
    notImg: L3("Bu blok kerak. Rasmlardan ortiqchasini toping.", 'Этот блок нужен. Найди лишнюю среди картинок.', 'This block is needed. Find the extra one among the pictures.'),
    half: L3("Ketdi! Yana ortiqcha rasm bor.", 'Убрали! Есть ещё лишняя картинка.', 'Gone! There’s another extra picture.'),
    hints: [
      L3("Har bir rasmga qarang: u klub haqidami?", 'Посмотри на каждую картинку: она про клуб?', 'Look at each picture: is it about the club?'),
      L3("Mushuk, quyosh botishi va pitsa klubga aloqasi yo'q. Rasmni bosing, panelda savat bor.", 'Кот, закат и пицца к клубу не относятся. Нажми на картинку — на панели есть корзина.', 'The cat, the sunset and the pizza have nothing to do with the club. Tap a picture; the panel has a trash can.'),
      L3("Mushuk rasmini bosing, keyin savatni. Keyin quyosh botishi va pitsa bilan ham shunday qiling.", 'Нажми картинку с котом, потом корзину. Потом так же с закатом и пиццей.', 'Tap the cat picture, then the trash can. Then do the same with the sunset and the pizza.')
    ],
    ok: L3("Ana! Bitta mos rasm beshta tasodifiy rasmdan yaxshiroq. Demak, rasm ko'p bo'lishi shart emas ekan.", 'Вот! Одна картинка по делу лучше пяти случайных. Значит, много картинок — не значит хорошо.', 'There! One fitting picture is better than five random ones. So more pictures doesn’t mean better.')
  },
  s7: {
    eyebrow: L3('Muqova', 'Обложка', 'Cover'),
    say: L3("Endi muqova, ya'ni saytning birinchi ekrani degani: katta fon rasmi va ustida sarlavha. Odam saytni ochganda birinchi bo'lib shuni ko'radi. Kuzating.",
      'Теперь обложка — первый экран сайта: большое фоновое фото и на нём заголовок. Это первое, что человек видит, когда открывает сайт. Смотри.',
      'Now the cover, the first screen of the site: a big background photo with a title on it. It’s the first thing a person sees when they open the site. Watch.'),
    steps: [
      L3("Muqovani bosaman, keyin «Контент». Bu yerda sarlavha, tavsif va «ФОНОВОЕ ИЗОБРАЖЕНИЕ», ya'ni fon rasmi degani.", 'Нажимаю на обложку, потом «Контент». Здесь заголовок, описание и «ФОНОВОЕ ИЗОБРАЖЕНИЕ» — фоновое фото.', 'I tap the cover, then “Content”. Here are the title, the description and the background image.'),
      L3("Kutubxonadan tik robot rasmini qo'ydim. Qarang: muqova keng, rasm esa tor va baland. Uning tepasi va pasti kesilib qoldi, robotning boshi yo'q!", 'Ставлю из библиотеки вертикальное фото робота. Смотри: обложка широкая, а фото узкое и высокое. Верх и низ обрезались — у робота пропала голова!', 'I put a vertical robot photo from the library. Look: the cover is wide, but the photo is narrow and tall. The top and bottom got cut off, and the robot lost its head!'),
      L3("Shuning uchun muqovaga keng, yotiq rasm olamiz. Kutubxonada shunday rasmlar uchun alohida tugma bor. Mana keng rasm: hammasi ko'rinadi. Faqat bu quyosh botishi, klub haqida emas. Klub rasmini esa o'zingiz qo'yasiz.", 'Поэтому для обложки берём широкое, горизонтальное фото. В библиотеке для них есть отдельная кнопка. Вот широкое фото — всё видно. Только это закат, а не клуб. Фото клуба поставишь сам.', 'That’s why we take a wide, horizontal photo for the cover. The library has a separate button for those. Here’s a wide photo: everything is visible. But it’s a sunset, not the club. You’ll put the club photo yourself.')
    ],
    help: [
      L3("Kuzating: muqova, «Контент», fon rasmi.", 'Следи: обложка, «Контент», фоновое фото.', 'Watch: the cover, “Content”, the background photo.'),
      L3("Muqova keng. Tik rasmning tepasi va pasti kesiladi, keng rasm esa to'liq ko'rinadi.", 'Обложка широкая. У вертикального фото обрезаются верх и низ, а широкое видно целиком.', 'The cover is wide. A vertical photo loses its top and bottom; a wide one shows completely.'),
      L3("Xuddi televizor kabi: tik videoni ko'rsatsa, chetlari bo'sh yoki kesik bo'ladi.", 'Как телевизор: если показать на нём вертикальное видео, края будут пустые или обрезанные.', 'Like a TV: show a vertical video on it and the edges end up empty or cut off.')
    ],
    ask: L3("Muqova qanday sozlanishini kuzating", 'Смотри, как настроить обложку', 'Watch how to set up the cover'),
    askDone: L3("Muqovaga — keng rasm", 'Для обложки — широкое фото', 'A wide photo for the cover')
  },
  s8: {
    eyebrow: L3('Muqova rasmi', 'Фон обложки', 'Cover photo'),
    say: L3("Endi muqovadagi begona tog'larni almashtiramiz. Muqovani bosing, «Контент» ni oching, keyin «Искать в библиотеке». Klub haqidagi keng rasmni tanlang.",
      'Теперь заменим чужие горы на обложке. Нажми на обложку, открой «Контент», потом «Искать в библиотеке». Выбери широкое фото про клуб.',
      'Now let’s replace the random mountains on the cover. Tap the cover, open “Content”, then “Search in library”. Pick a wide photo about the club.'),
    ask: L3("Muqovaga klub haqidagi keng rasmni qo'ying", 'Поставь на обложку широкое фото про клуб', 'Put a wide photo about the club on the cover'),
    wrong: {
      tall: L3("Bu rasm tik. Muqovada uning tepasi va pasti kesiladi, robotning boshi ko'rinmaydi. Keng rasm kerak.", 'Это фото вертикальное. На обложке у него обрежутся верх и низ — голову робота не будет видно. Нужно широкое.', 'This photo is vertical. On the cover its top and bottom get cut off, and the robot’s head won’t show. A wide one is needed.'),
      mount: L3("Bu o'sha begona tog'lar. Rasm klub haqida bo'lishi kerak.", 'Это те же чужие горы. Фото должно быть про клуб.', 'Those are the same random mountains. The photo should be about the club.'),
      sunset: L3("Chiroyli, lekin klub haqida emas. Rasm sayt nima haqida ekanini ko'rsatsin.", 'Красиво, но не про клуб. Фото должно показывать, о чём сайт.', 'Pretty, but not about the club. The photo should show what the site is about.')
    },
    hints: [
      L3("Muqovani bosing, keyin «Контент» ni.", 'Нажми на обложку, потом «Контент».', 'Tap the cover, then “Content”.'),
      L3("«Искать в библиотеке» ni bosing. Bizga ham klub haqida, ham keng rasm kerak.", 'Нажми «Искать в библиотеке». Нужно фото и про клуб, и широкое.', 'Tap “Search in library”. We need a photo that’s both about the club and wide.'),
      L3("Bolalar va robot bor keng rasmni bosing, keyin «Сохранить и закрыть» ni.", 'Нажми широкое фото с детьми и роботом, потом «Сохранить и закрыть».', 'Tap the wide photo with kids and a robot, then “Save and close”.')
    ],
    picked: L3("Aynan shu! Endi «Сохранить и закрыть» ni bosing.", 'Оно! Теперь нажми «Сохранить и закрыть».', 'That’s it! Now tap “Save and close”.'),
    ok: L3("Zo'r! Muqova endi klub haqida gapiradi. Faqat sarlavhaga qarang: yorqin rasmda u yaxshi o'qilyaptimi?", 'Супер! Обложка теперь про клуб. Только посмотри на заголовок: хорошо ли он читается на светлом фото?', 'Awesome! The cover is about the club now. But look at the title: is it easy to read on the bright photo?')
  },
  s9: {
    eyebrow: L3('Filtr', 'Фильтр', 'Filter'),
    say: L3("Yorqin rasmda oq matn yo'qolib qoladi. Buni filtr tuzatadi. Filtr, ya'ni rasm ustidagi yarim shaffof rang degani. U rasmni qoraytiradi va matn ajralib turadi. Kuzating.",
      'На светлом фото белый текст теряется. Это исправляет фильтр. Фильтр — полупрозрачный цвет поверх фото. Он затемняет фото, и текст начинает выделяться. Смотри.',
      'On a bright photo, white text gets lost. A filter fixes that. A filter is a see-through color over the photo. It darkens the photo so the text stands out. Watch.'),
    steps: [
      L3("Muqovani bosaman, keyin «Настройки». Mana «ЦВЕТ ФИЛЬТРА», ya'ni filtr rangi degani: qora. Yonida «НЕПРОЗРАЧНОСТЬ», ya'ni rasm qanchalik qorayishi degani. Hozir o'n foiz, deyarli hech narsa.", 'Нажимаю на обложку, потом «Настройки». Вот «ЦВЕТ ФИЛЬТРА» — чёрный. Рядом «НЕПРОЗРАЧНОСТЬ» — насколько затемнить фото. Сейчас десять процентов, почти ничего.', 'I tap the cover, then “Settings”. Here’s the filter color: black. Next to it, “Opacity”: how much to darken the photo. Right now it’s ten percent, almost nothing.'),
      L3("Yuz foiz qo'ysam-chi? Matn aniq ko'rinadi, lekin rasm butunlay yo'qoldi, faqat qora fon qoldi.", 'А если поставить сто процентов? Текст виден чётко, но фото совсем пропало — остался чёрный фон.', 'What if I set one hundred percent? The text is crisp, but the photo is completely gone; only a black background is left.'),
      L3("Yetmish foiz: rasm ham ko'rinadi, matn ham oson o'qiladi. Filtr tepasi va pastida bor, ikkalasini ham bir xil qilaman.", 'Семьдесят процентов: и фото видно, и текст легко читается. Фильтр есть вверху и внизу — ставлю обоим одинаково.', 'Seventy percent: you can see the photo and read the text easily. The filter has a top and a bottom; I set both the same.')
    ],
    help: [
      L3("Kuzating: «Настройки», keyin «НЕПРОЗРАЧНОСТЬ».", 'Следи: «Настройки», потом «НЕПРОЗРАЧНОСТЬ».', 'Watch: “Settings”, then “Opacity”.'),
      L3("Kam bo'lsa matn yo'qoladi, juda ko'p bo'lsa rasm yo'qoladi. O'rtasi kerak.", 'Мало — теряется текст, слишком много — пропадает фото. Нужна середина.', 'Too little and the text gets lost; too much and the photo disappears. You need the middle.'),
      L3("Xuddi quyoshdan ko'zoynak kabi: ko'rish oson, lekin hammasi qop-qora emas.", 'Как солнечные очки: смотреть легче, но всё не становится чёрным.', 'Like sunglasses: easier to see, but everything doesn’t turn black.')
    ],
    ask: L3("Filtr qanday ishlashini kuzating", 'Смотри, как работает фильтр', 'Watch how the filter works'),
    askDone: L3("Ham rasm, ham matn ko'rinsin", 'Видно и фото, и текст', 'Both the photo and the text are visible')
  },
  s10: {
    eyebrow: L3('Filtrni sozlang', 'Настрой фильтр', 'Set the filter'),
    say: L3("Endi o'zingiz. Muqovani bosing va «Настройки» ni oching. Filtrning tepasiga ham, pastiga ham shunday qorong'ilik tanlangki, rasm ham, matn ham ko'rinsin.",
      'Теперь сам. Нажми на обложку и открой «Настройки». Выбери фильтру вверху и внизу такое затемнение, чтобы было видно и фото, и текст.',
      'Now you. Tap the cover and open “Settings”. Choose a darkness for the filter at the top and at the bottom so both the photo and the text are visible.'),
    ask: L3("Filtrni sozlang: rasm ham, matn ham ko'rinsin", 'Настрой фильтр: видно и фото, и текст', 'Set the filter: both photo and text are visible'),
    wrongLow: L3("Kam. Yorqin rasmda matn hali ham yo'qolyapti.", 'Мало. На светлом фото текст всё ещё теряется.', 'Too little. The text still gets lost on the bright photo.'),
    wrongHigh: L3("Juda ko'p. Rasm butunlay yo'qoldi, faqat qora fon qoldi.", 'Слишком много. Фото совсем пропало, остался только чёрный фон.', 'Too much. The photo is completely gone; only black is left.'),
    half: L3("Tepasi tayyor! Endi pastini ham shunday qiling: «ЦВЕТ ФИЛЬТРА В КОНЦЕ».", 'Верх готов! Теперь так же низ: «ЦВЕТ ФИЛЬТРА В КОНЦЕ».', 'The top is done! Now do the same for the bottom: “Filter color at the end”.'),
    hints: [
      L3("Muqovani bosing, keyin «Настройки» ni.", 'Нажми на обложку, потом «Настройки».', 'Tap the cover, then “Settings”.'),
      L3("Har bir variantni bosib, muqovaga qarang: matn o'qilyaptimi, rasm ko'rinyaptimi?", 'Нажимай варианты и смотри на обложку: текст читается, фото видно?', 'Tap the options and look at the cover: is the text readable, is the photo visible?'),
      L3("Tepasiga ham, pastiga ham yetmish foiz qo'ying.", 'Поставь семьдесят процентов и вверху, и внизу.', 'Set seventy percent at both the top and the bottom.')
    ],
    ok: L3("Ajoyib! Rasm ham ko'rinadi, sarlavha ham darrov o'qiladi.", 'Отлично! И фото видно, и заголовок сразу читается.', 'Excellent! The photo shows and the title reads right away.')
  },
  s11: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Endi kichik tekshiruv. Har bir savolda ikkita muqova bor. Yaxshisini bosing.",
      'Теперь маленькая проверка. В каждом вопросе две обложки. Нажми лучшую.',
      'Now a little check. Each question has two covers. Tap the better one.'),
    ask: L3("Yaxshi muqovani tanlang", 'Выбери лучшую обложку', 'Pick the better cover'),
    rounds: [
      { q: L3("Qaysi muqova klub sayti uchun yaxshi?", 'Какая обложка лучше для сайта клуба?', 'Which cover is better for the club’s site?'), a: 'b',
        A: { foto: 'mount', f: 70 }, B: { foto: 'club', f: 70 },
        why: L3("Rasm sayt nima haqida ekanini ko'rsatadi.", 'Фото показывает, о чём сайт.', 'The photo shows what the site is about.') },
      { q: L3("Qaysi birida sarlavha yaxshi o'qiladi?", 'Где заголовок читается лучше?', 'Where is the title easier to read?'), a: 'a',
        A: { foto: 'club', f: 70 }, B: { foto: 'club', f: 0 },
        why: L3("Filtr rasmni qoraytiradi, oq matn ajralib turadi.", 'Фильтр затемняет фото, и белый текст выделяется.', 'The filter darkens the photo so the white text stands out.') },
      { q: L3("Qaysi sarlavha muqovaga mos?", 'Какой заголовок подходит обложке?', 'Which title suits a cover?'), a: 'a',
        A: { foto: 'club', f: 70, t: L3('RoboKlub', 'RoboKlub', 'RoboKlub') },
        B: { foto: 'club', f: 70, t: L3("Bizning klubimizda har shanba robot yig'amiz va dasturlaymiz, birinchi dars bepul", 'В нашем клубе каждую субботу собираем и программируем роботов, первое занятие бесплатное', 'In our club every Saturday we build and program robots, the first class is free'), long: true },
        why: L3("Muqovada sarlavha qisqa, tafsilot esa pastda.", 'На обложке заголовок короткий, подробности — ниже.', 'On a cover the title is short; the details go below.') },
      { q: L3("Qaysi muqovada rasm yaxshi turibdi?", 'На какой обложке фото подходит лучше?', 'On which cover does the photo fit better?'), a: 'b',
        A: { foto: 'tall', f: 70 }, B: { foto: 'club', f: 70 },
        why: L3("Muqova keng, unga keng rasm kerak. Tik rasm kesilib qoladi.", 'Обложка широкая, ей нужно широкое фото. Вертикальное обрезается.', 'A cover is wide and needs a wide photo. A vertical one gets cut off.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Saytga birinchi marta kirgan odam o'rniga o'zingizni qo'ying: qaysi biri tezroq tushunarli?", 'Представь, что открываешь сайт впервые: что понятнее с первого взгляда?', 'Imagine you’re opening the site for the first time: which is clearer at a glance?'),
    hint2: L3("Esingizda bo'lsin: rasm sayt haqida, keng, matn esa filtr bilan o'qiladi va qisqa.", 'Помни: фото про сайт и широкое, а текст короткий и читается благодаря фильтру.', 'Remember: a photo about the site and wide; the text short and readable thanks to the filter.'),
    ok: L3("Ajoyib! Siz yaxshi muqova qoidalarini bilasiz.", 'Отлично! Ты знаешь правила хорошей обложки.', 'Excellent! You know the rules of a good cover.')
  },
  s12: {
    eyebrow: L3("Haqiqiy Tildada", 'В настоящей Tilda', 'In the real Tilda'),
    say: L3("Endi hammasini haqiqiy Tildadagi saytingizda qiling. Pastdagi qadamlar bo'yicha boring va oxirida «Опубликовать» ni bosing. Tayyor bo'lsa, saytingiz manzilini yozing. Hozir imkon bo'lmasa, keyinroq qilasiz.",
      'Теперь сделай всё на своём сайте в настоящей Tilda. Иди по шагам ниже и в конце нажми «Опубликовать». Готово — напиши адрес своего сайта; нет возможности сейчас — сделаешь позже.',
      'Now do it all on your site in the real Tilda. Follow the steps below and tap “Publish” at the end. When it’s done, type your site’s address; if you can’t right now, do it later.'),
    todo: [
      L3("tilda.cc da «Войти» va saytingiz sahifasini oching.", 'На tilda.cc нажми «Войти» и открой страницу своего сайта.', 'On tilda.cc tap “Log in” and open your site’s page.'),
      L3("«ВСЕ БЛОКИ» → «Изображение» → IM01.", '«ВСЕ БЛОКИ» → «Изображение» → IM01.', '“All blocks” → “Image” → IM01.'),
      L3("«Контент» → «Искать в библиотеке»: saytingiz mavzusidagi rasmni tanlang. Inglizcha qidiring: robot, football, music…", '«Контент» → «Искать в библиотеке»: выбери фото по теме своего сайта. Ищи по-английски: robot, football, music…', '“Content” → “Search in library”: pick a photo on your site’s topic. Search in English: robot, football, music…'),
      L3("Uch nuqta → «SEO: АЛЬТ-ТЕКСТ»: rasmda nima borligini yozing.", 'Три точки → «SEO: АЛЬТ-ТЕКСТ»: напиши, что на фото.', 'Three dots → “SEO: Alt text”: write what’s in the photo.'),
      L3("Muqova → «Контент» → «ФОНОВОЕ ИЗОБРАЖЕНИЕ»: keng rasm qo'ying.", 'Обложка → «Контент» → «ФОНОВОЕ ИЗОБРАЖЕНИЕ»: поставь широкое фото.', 'Cover → “Content” → “Background image”: put a wide photo.'),
      L3("Muqova → «Настройки» → «НЕПРОЗРАЧНОСТЬ» tepada va pastda 70%. Keyin «Опубликовать».", 'Обложка → «Настройки» → «НЕПРОЗРАЧНОСТЬ» вверху и внизу 70%. Потом «Опубликовать».', 'Cover → “Settings” → “Opacity” at the top and bottom 70%. Then “Publish”.')
    ],
    ph: L3('masalan: brave-orange-robot.tilda.ws', 'например: brave-orange-robot.tilda.ws', 'for example: brave-orange-robot.tilda.ws'),
    check: L3('Tekshirish', 'Проверить', 'Check'),
    later: L3('Keyinroq qilaman', 'Сделаю позже', 'I’ll do it later'),
    ask: L3("Saytingizga rasm va muqova qo'ying va manzilini yozing", 'Поставь на свой сайт картинку и обложку и напиши адрес', 'Add a picture and a cover to your site and type its address'),
    bad: L3("Bu Tilda manziliga o'xshamaydi. Tilda manzili .tilda.ws bilan tugaydi.", 'Это не похоже на адрес Tilda. Адрес Tilda заканчивается на .tilda.ws.', 'That doesn’t look like a Tilda address. A Tilda address ends in .tilda.ws.'),
    demo: L3("Bu darsdagi namuna manzil. O'z saytingiz manzilini yozing.", 'Это адрес-пример из урока. Напиши адрес своего сайта.', 'That’s the example address from the lesson. Type your own site’s address.'),
    ok: L3("Zo'r! Saytingiz endi chiroyli va tushunarli!", 'Супер! Твой сайт теперь красивый и понятный!', 'Awesome! Your site is now beautiful and clear!'),
    okLater: L3("Mayli. Uyda shu qadamlar bo'yicha qiling.", 'Хорошо. Сделай дома по этим шагам.', 'Okay. Do it at home with these steps.')
  },
  s13: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men istalgan chiroyli rasm yaraydi, qancha ko'p bo'lsa shuncha yaxshi degandim? Xato qilibman! Rasm sayt nima haqida ekanini ko'rsatadi. Bitta mos rasm beshta tasodifiy rasmdan yaxshiroq.",
        'Помнишь, я говорил, что подойдёт любая красивая картинка, и чем больше, тем лучше? Я ошибся! Картинка показывает, о чём сайт. Одна картинка по делу лучше пяти случайных.',
        'Remember when I said any pretty picture will do, and the more the better? I was wrong! A picture shows what the site is about. One fitting picture beats five random ones.') },
      { k: 'img', text: L3("Rasm bloki IM01: fotosuratni kutubxonadan olamiz va unga alt-matn yozamiz, ya'ni so'z bilan tavsif degani.",
        'Блок картинки IM01: фото берём из библиотеки и пишем ему альт-текст — описание.',
        'Image block IM01: we take the photo from the library and give it alt text, a description.') },
      { k: 'cover', text: L3("Muqovaga keng rasm kerak, aks holda u kesilib qoladi.", 'Обложке нужно широкое фото, иначе оно обрежется.', 'A cover needs a wide photo, otherwise it gets cut off.') },
      { k: 'filter', text: L3("Filtr rasmni qoraytiradi, shunda sarlavha o'qiladi, rasm ham ko'rinadi.", 'Фильтр затемняет фото: заголовок читается, и фото видно.', 'The filter darkens the photo: the title reads, and the photo still shows.') },
      { k: null, text: L3("Barakalla! RoboKlub sayti endi jonli: haqiqiy klub rasmi va chiroyli muqova. Keyingi darsda saytga o'z ranglari va shriftlarini beramiz!",
        'Ура! Сайт RoboKlub ожил: настоящее фото клуба и красивая обложка. На следующем уроке дадим сайту свои цвета и шрифты!',
        'Hooray! The RoboKlub site came alive: a real club photo and a beautiful cover. Next lesson we’ll give the site its own colors and fonts!') }
    ],
    ask: L3("Saytda mos rasm va chiroyli muqova", 'На сайте картинка по делу и красивая обложка', 'The site has a fitting picture and a beautiful cover'),
    roles: { riddle: L3("Rasm — sayt haqida", 'Картинка — про сайт', 'A picture about the site'), img: L3('IM01, kutubxona, alt-matn', 'IM01, библиотека, альт-текст', 'IM01, library, alt text'),
      cover: L3("Muqovaga — keng rasm", 'Обложке — широкое фото', 'A wide photo for the cover'), filter: L3("Filtr: matn o'qiladi", 'Фильтр: текст читается', 'Filter: the text reads') }
  }
};
