const C = {
  s1: {
    eyebrow: L3('Kirish', 'Начало', 'Start'),
    say: L3("Salom! RoboKlub yana yozdi. Saytimizda hozir faqat muqova bor, ular esa ko'proq narsa so'rayapti. Qarang, xabarni o'qing. Nima deb o'ylaysiz, qo'shilgan blokni keyin boshqa joyga ko'chirsa bo'ladimi?",
      'Привет! RoboKlub снова написал. На нашем сайте пока только обложка, а им нужно больше. Смотри, прочитай сообщение. Как думаешь, добавленный блок можно потом переставить в другое место?',
      'Hi! RoboKlub wrote again. Our site has only a cover so far, and they want more. Look, read the message. What do you think: can you move an added block somewhere else later?'),
    msg: L3("Kodi, sayt zo'r! Lekin bitta muqova kam. Muqovadan keyin sarlavha, keyin rasm, keyin klub haqida matn qo'ying, iltimos!",
      'Коди, сайт классный! Но одной обложки мало. После обложки поставь заголовок, потом картинку, потом текст о клубе, пожалуйста!',
      'Kodi, the site is great! But one cover isn’t enough. After the cover, please add a title, then a picture, then text about the club!'),
    from: L3('RoboKlub', 'RoboKlub', 'RoboKlub'),
    opts: { yes: L3("Ha, ko'chirsa bo'ladi", 'Да, можно', 'Yes, you can'), no: L3("Yo'q, qaytadan qilish kerak", 'Нет, придётся заново', 'No, you have to start over') },
    reply: {
      yes: L3("Siz shunday o'ylaysizmi? Men esa ishonmayman.", 'Ты так думаешь? А я вот сомневаюсь.', 'You think so? I’m not so sure.'),
      no: L3("Men ham shunday o'ylayman.", 'Я тоже так думаю.', 'I think so too.')
    },
    riddle: L3("Mening fikrim: Tilda'da yangi blok faqat eng pastga tushadi va keyin uni ko'chirib bo'lmaydi. Xato qilsak, hammasini boshidan qilish kerak. Bugungi topishmoq shu: men haqmanmi? Dars oxirida bilamiz.",
      'Моё мнение: в Tilda новый блок встаёт только в самый низ, и переставить его потом нельзя. Ошибёмся — придётся делать всё заново. Сегодняшняя загадка: прав ли я? Узнаем в конце урока.',
      'My opinion: in Tilda a new block always lands at the very bottom, and you can’t move it later. If we make a mistake, we start over. Today’s riddle: am I right? We’ll find out at the end of the lesson.'),
    ask: L3("Blokni keyin ko'chirsa bo'ladimi?", 'Можно ли потом переставить блок?', 'Can you move a block later?'),
    askDone: L3("Topishmoq: blokni ko'chirib bo'lmaydimi?", 'Загадка: блок нельзя переставить?', 'Riddle: a block can’t be moved?')
  },
  s2: {
    eyebrow: L3('Blok nima?', 'Что такое блок?', 'What is a block?'),
    say: L3("Oldin bloklarni yaqinroq ko'raylik. Mana tayyor sayt. Kursor yoki barmoq har bir blokka boradi.",
      'Сначала рассмотрим блоки поближе. Вот готовый сайт. Курсор или палец подходит к каждому блоку.',
      'First, let’s look at blocks up close. Here’s a ready site. The cursor or finger moves to each block.'),
    steps: [
      L3("Bu muqova. Chapda kichik kod bor: CR28. Har bir blokning o'z kodi bor, xuddi pasport kabi.", 'Это обложка. Слева маленький код: CR28. У каждого блока свой код, как паспорт.', 'This is the cover. On the left there’s a small code: CR28. Every block has its own code, like a passport.'),
      L3("Bu sarlavha bloki, kodi TL bilan boshlanadi.", 'Это блок заголовка, его код начинается с TL.', 'This is a title block; its code starts with TL.'),
      L3("Bu rasm bloki, kodi IM bilan boshlanadi.", 'Это блок картинки, код начинается с IM.', 'This is an image block; its code starts with IM.'),
      L3("Bu matn bloki, kodi TX bilan boshlanadi. Kodning harflari bo'limni bildiradi, shuning uchun kutubxonada bloklar bo'limlarga bo'lingan.", 'Это блок текста, код начинается с TX. Буквы кода — это раздел, поэтому в библиотеке блоки разложены по разделам.', 'This is a text block; its code starts with TX. The letters of the code show the section, which is why the library sorts blocks into sections.')
    ],
    help: [
      L3("Kursor qaysi blokda bo'lsa, o'shaning chegarasi va kodi ko'rinadi.", 'Где курсор, у того блока видны рамка и код.', 'Wherever the cursor is, that block shows its frame and code.'),
      L3("CR: muqova, TL: sarlavha, IM: rasm, TX: matn.", 'CR — обложка, TL — заголовок, IM — картинка, TX — текст.', 'CR is a cover, TL a title, IM an image, TX text.'),
      L3("Xuddi kutubxonadagi kitob raqami kabi: raqamdan qaysi javonda turganini bilasiz.", 'Как номер книги в библиотеке: по номеру знаешь, на какой полке она стоит.', 'Like a library book number: from the number you know which shelf it’s on.')
    ],
    ask: L3("Bloklarni va ularning kodini kuzating", 'Смотри на блоки и их коды', 'Watch the blocks and their codes'),
    askDone: L3("Har bir blokning o'z kodi bor", 'У каждого блока свой код', 'Every block has its own code')
  },
  s3: {
    eyebrow: L3("Blok qo'shish", 'Добавляем блок', 'Adding a block'),
    say: L3("Endi blok qanday qo'shilishini ko'raylik. Kuzating: «ВСЕ БЛОКИ», ya'ni hamma bloklar degani, keyin bo'lim, keyin kerakli blok.",
      'Теперь посмотрим, как добавить блок. Смотри: «ВСЕ БЛОКИ», потом раздел, потом нужный блок.',
      'Now let’s see how to add a block. Watch: “All blocks”, then a section, then the block you need.'),
    steps: [
      L3("«ВСЕ БЛОКИ» ni bosamiz va kutubxona ochiladi.", 'Нажимаем «ВСЕ БЛОКИ» — открывается библиотека.', 'We tap “All blocks”, and the library opens.'),
      L3("Chapdan «Заголовок» bo'limini tanlaymiz, ya'ni sarlavha degani.", 'Слева выбираем раздел «Заголовок».', 'On the left we pick the “Title” section.'),
      L3("O'ngda sarlavha bloklari. Bittasini bosamiz.", 'Справа блоки заголовков. Нажимаем на один.', 'On the right are title blocks. We tap one.'),
      L3("Blok sahifaning pastiga, muqovadan keyin tushdi. Kompyuterda pastda tezkor tugmalar ham bor, lekin «ВСЕ БЛОКИ» hamma joyda ishlaydi.",
        'Блок встал внизу страницы, после обложки. На компьютере внизу есть и быстрые кнопки, но «ВСЕ БЛОКИ» работает везде.',
        'The block landed at the bottom of the page, after the cover. On a computer there are quick buttons at the bottom too, but “All blocks” works everywhere.')
    ],
    help: [
      L3("Kuzating: oldin «ВСЕ БЛОКИ», keyin bo'lim, keyin blok.", 'Следи: сначала «ВСЕ БЛОКИ», потом раздел, потом блок.', 'Watch: first “All blocks”, then a section, then a block.'),
      L3("Bo'lim bu blok turi: sarlavha, matn yoki rasm.", 'Раздел — вид блока: заголовок, текст, картинка.', 'A section is a type of block: title, text, image.'),
      L3("Xuddi do'konda: oldin bo'lim, keyin kerakli mahsulot.", 'Как в магазине: сначала отдел, потом нужный товар.', 'Like in a store: first the department, then the item.')
    ],
    ask: L3("Blok qanday qo'shilishini kuzating", 'Смотри, как добавляют блок', 'Watch how a block is added'),
    askDone: L3("«ВСЕ БЛОКИ» → bo'lim → blok", '«ВСЕ БЛОКИ» → раздел → блок', '“All blocks” → section → block')
  },
  s4: {
    eyebrow: L3("Sarlavha qo'shamiz", 'Добавляем заголовок', 'Adding a title'),
    say: L3("Endi o'zingiz. Muqovadan keyin sarlavha kerak. «ВСЕ БЛОКИ», keyin «Заголовок» bo'limi, keyin istalgan sarlavha bloki.",
      'Теперь сам. После обложки нужен заголовок. «ВСЕ БЛОКИ», потом раздел «Заголовок», потом любой блок заголовка.',
      'Now you. After the cover we need a title. “All blocks”, then the “Title” section, then any title block.'),
    ask: L3("Sarlavha blokini qo'shing", 'Добавь блок заголовка', 'Add a title block'),
    hints: [
      L3("Oldin kutubxonani oching: pastdagi qora tugma.", 'Сначала открой библиотеку: чёрная кнопка внизу.', 'First open the library: the black button at the bottom.'),
      L3("Chapdagi ro'yxatdan «Заголовок» ni tanlang.", 'В списке слева выбери «Заголовок».', 'Pick “Title” in the list on the left.'),
      L3("O'ngdagi istalgan sarlavha kartochkasini bosing.", 'Нажми любую карточку заголовка справа.', 'Tap any title card on the right.')
    ],
    wrongCat: L3("Bu bo'lim boshqa bloklar uchun. Bizga sarlavha kerak, u «Заголовок» bo'limida.", 'Этот раздел для других блоков. Нам нужен заголовок — «Заголовок».', 'That section is for other blocks. We need a title: “Title”.'),
    ok: L3("Barakalla! Sarlavha muqovadan keyin tushdi.", 'Точно! Заголовок встал после обложки.', 'Exactly! The title landed after the cover.')
  },
  s5: {
    eyebrow: L3("Matn qo'shamiz", 'Добавляем текст', 'Adding text'),
    say: L3("Endi klub haqida matn kerak. «Текстовый блок», ya'ni matn bo'limi degani, undan oddiy matn blokini oling. Ehtiyot bo'ling: u yerda iqtibos bloki ham bor.",
      'Теперь нужен текст о клубе. Возьми обычный текстовый блок из раздела «Текстовый блок». Осторожно: там есть и блок цитаты.',
      'Now we need text about the club. Take a plain text block from the “Text block” section. Careful: there’s a quote block there too.'),
    ask: L3("Oddiy matn blokini qo'shing", 'Добавь обычный текстовый блок', 'Add a plain text block'),
    hints: [
      L3("Kutubxonani oching va matn bo'limini toping.", 'Открой библиотеку и найди раздел текста.', 'Open the library and find the text section.'),
      L3("Bo'lim nomi: «Текстовый блок».", 'Раздел называется «Текстовый блок».', 'The section is called “Text block”.'),
      L3("«TX01 Текст» kartochkasini bosing.", 'Нажми карточку TX01 — «Текст».', 'Tap the TX01 “Text” card.')
    ],
    wrongCat: L3("Bu bo'lim boshqa bloklar uchun. Bizga matn kerak, u «Текстовый блок» bo'limida.", 'Этот раздел для других блоков. Нам нужен текст — «Текстовый блок».', 'That section is for other blocks. We need text: “Text block”.'),
    quote: L3("Bu iqtibos bloki: odamning rasmi va uning gapi. Bizga oddiy matn kerak: TX01 yoki TX02.", 'Это блок цитаты: фото человека и его слова. Нам нужен обычный текст — TX01 или TX02.', 'That’s a quote block: a person’s photo and their words. We need plain text: TX01 or TX02.'),
    ok: L3("Ajoyib, matn bloki tushdi! Faqat matn hali inglizcha.", 'Отлично, текстовый блок встал! Только текст пока на английском.', 'Great, the text block is in! Only the text is still in English.')
  },
  s6: {
    eyebrow: L3("Matnni yozamiz", 'Пишем текст', 'Writing the text'),
    say: L3("Matnni o'zingizniki bilan almashtiring. O'tgan darsdagidek: matnni bosing, klub haqida bir-ikki gap yozing va «Tayyor» ni bosing.",
      'Замени текст своим. Как на прошлом уроке: нажми на текст, напиши пару фраз о клубе и нажми «Готово».',
      'Replace the text with your own. Like last lesson: tap the text, write a sentence or two about the club and tap “Done”.'),
    ask: L3("Matnni bosing va klub haqida yozing", 'Нажми на текст и напиши о клубе', 'Tap the text and write about the club'),
    ph: L3("Masalan: Biz har shanba robot yasaymiz!", 'Например: Каждую субботу мы собираем роботов!', 'For example: We build robots every Saturday!'),
    empty: L3("Matn bo'sh qoldi. Klub haqida bir gap yozing.", 'Текст пустой. Напиши хоть одну фразу о клубе.', 'The text is empty. Write at least one sentence about the club.'),
    same: L3("Bu hali eski inglizcha matn. O'zingiznikini yozing.", 'Это всё ещё старый английский текст. Напиши свой.', 'That’s still the old English text. Write your own.'),
    hints: [
      L3("Matn blokidagi yozuvni bosing.", 'Нажми на надпись в текстовом блоке.', 'Tap the words in the text block.'),
      L3("Eski matnni o'chirib, o'zingiznikini yozing.", 'Сотри старый текст и напиши свой.', 'Erase the old text and write your own.'),
      L3("Masalan: «Biz har shanba robot yasaymiz!» va «Tayyor».", 'Например: «Каждую субботу мы собираем роботов!» и «Готово».', 'For example: “We build robots every Saturday!” and “Done”.')
    ],
    ok: L3("Zo'r! Endi bu sizning matningiz.", 'Классно! Теперь это твой текст.', 'Cool! Now it’s your text.')
  },
  s7: {
    eyebrow: L3('Blok tugmalari', 'Кнопки блока', 'Block buttons'),
    say: L3("Blokni bosganda tepasida tugmalar paydo bo'ladi. Ular bilan blokni boshqarasiz. Kuzating.",
      'Когда нажимаешь на блок, над ним появляются кнопки. Ими управляешь блоком. Смотри.',
      'When you tap a block, buttons appear above it. They let you control the block. Watch.'),
    steps: [
      L3("Ikki to'rtburchak: nusxa olish. Xuddi shunday blok yana bittasi paydo bo'ladi.", 'Два квадратика — копировать. Появится ещё один такой же блок.', 'Two squares: copy. Another identical block appears.'),
      L3("Savat: o'chirish. Blok darrov o'chadi, Tilda hech narsa so'ramaydi.", 'Корзина — удалить. Блок удаляется сразу, Tilda не переспрашивает.', 'The bin: delete. The block is deleted at once; Tilda doesn’t ask.'),
      L3("Aylana: yashirish. Blok saytda ko'rinmaydi, lekin yo'qolmaydi.", 'Кружок — скрыть. Блок не виден на сайте, но не пропадает.', 'The circle: hide. The block isn’t shown on the site but isn’t lost.'),
      L3("Strelkalar: blokni yuqoriga yoki pastga ko'chirish.", 'Стрелки — переставить блок выше или ниже.', 'The arrows: move the block up or down.'),
      L3("Bloklar orasidagi «plyus» esa yangi blokni aynan shu joyga qo'shadi.", 'А «плюс» между блоками добавляет новый блок ровно в это место.', 'And the “plus” between blocks adds a new block exactly there.')
    ],
    help: [
      L3("Kursor qaysi tugmada bo'lsa, Kodi o'shani tushuntiradi.", 'Где курсор — ту кнопку и объясняет Коди.', 'Kodi explains whichever button the cursor is on.'),
      L3("To'rtburchaklar: nusxa. Savat: o'chirish. Aylana: yashirish. Strelkalar: ko'chirish. «plyus»: shu yerga qo'shish.", 'Квадратики — копия, корзина — удалить, кружок — скрыть, стрелки — переставить, «плюс» — добавить сюда.', 'Squares: copy; bin: delete; circle: hide; arrows: move; “plus”: add here.'),
      L3("Xuddi telefondagi suratlar kabi: nusxa, o'chirish, tartibini o'zgartirish.", 'Как с фото в телефоне: копировать, удалить, поменять порядок.', 'Like photos on your phone: copy, delete, reorder.')
    ],
    ask: L3("Blok tugmalarini kuzating", 'Смотри на кнопки блока', 'Watch the block buttons'),
    askDone: L3("Nusxa, o'chirish, yashirish, ko'chirish, «+»", 'Копия, удалить, скрыть, переставить, «+»', 'Copy, delete, hide, move, “+”')
  },
  s8: {
    eyebrow: L3("Rasm qo'shamiz", 'Добавляем картинку', 'Adding a picture'),
    say: L3("Klub rasmni xohlayapti. Matn ostidagi «plyus» ni bosing va «Изображение», ya'ni rasm bo'limi degani, undan blok oling.",
      'Клуб хочет картинку. Нажми «плюс» под текстом и возьми блок из раздела «Изображение».',
      'The club wants a picture. Tap the “plus” under the text and take a block from the “Image” section.'),
    ask: L3("Matn ostidagi «+» bilan rasm blokini qo'shing", 'Добавь картинку через «+» под текстом', 'Add an image block with the “+” under the text'),
    hints: [
      L3("Matn blokining pastida qora plyus tugmasi bor.", 'Под текстовым блоком чёрная кнопка «плюс».', 'There’s a black plus button under the text block.'),
      L3("Kutubxonada «Изображение» bo'limini oching.", 'В библиотеке открой раздел «Изображение».', 'In the library open the “Image” section.'),
      L3("«IM01 Изображение» kartochkasini bosing.", 'Нажми карточку IM01 — «Изображение».', 'Tap the IM01 “Image” card.')
    ],
    wrongCat: L3("Bu bo'lim boshqa bloklar uchun. Bizga rasm kerak, u «Изображение» bo'limida.", 'Этот раздел для других блоков. Нам нужна картинка — «Изображение».', 'That section is for other blocks. We need a picture: “Image”.'),
    wrongPlus: L3("Bu «plyus» boshqa blok ostida. Rasm matndan keyin tushsin, shuning uchun matn ostidagi «plyus» ni bosing.", 'Этот «плюс» под другим блоком. Пусть картинка встанет после текста — нажми «плюс» под текстом.', 'That “plus” is under another block. Let the picture go after the text: tap the “plus” under the text.'),
    ok: L3("Rasm tushdi! Lekin klub rasm matndan oldin bo'lsin degan edi.", 'Картинка встала! Но клуб просил картинку перед текстом.', 'The picture is in! But the club asked for the picture before the text.')
  },
  s9: {
    eyebrow: L3("Ko'chiramiz", 'Переставляем', 'Moving'),
    say: L3("Klub tartibi: muqova, sarlavha, rasm, matn. Rasm hozir eng pastda. Rasm blokini bosing va yuqoriga strelkani bosing.",
      'Порядок клуба: обложка, заголовок, картинка, текст. Картинка сейчас в самом низу. Нажми на блок картинки и нажми стрелку вверх.',
      'The club’s order: cover, title, picture, text. The picture is at the very bottom now. Tap the picture block and tap the up arrow.'),
    ask: L3("Rasmni matndan yuqoriga ko'chiring", 'Подними картинку выше текста', 'Move the picture above the text'),
    wrongDown: L3("Pastga strelka blokni pastga tushiradi. Rasm esa yuqoriga chiqishi kerak.", 'Стрелка вниз опускает блок. А картинке нужно наверх.', 'The down arrow moves the block down. The picture needs to go up.'),
    wrongBlock: L3("Bu boshqa blok. Rasm blokini ko'chiring.", 'Это другой блок. Переставь блок картинки.', 'That’s another block. Move the picture block.'),
    wrongTool: L3("Bu tugma blokni ko'chirmaydi. Bizga strelka kerak.", 'Эта кнопка не переставляет блок. Нам нужна стрелка.', 'That button doesn’t move the block. We need an arrow.'),
    hints: [
      L3("Oldin rasm blokini bosing, tepasida tugmalar chiqadi.", 'Сначала нажми на блок картинки — над ним появятся кнопки.', 'First tap the picture block; buttons appear above it.'),
      L3("O'ng tomonda ikki strelka bor: yuqoriga va pastga.", 'Справа две стрелки: вверх и вниз.', 'On the right there are two arrows: up and down.'),
      L3("Rasm blokida yuqoriga strelkani bosing.", 'Нажми стрелку вверх у блока картинки.', 'Tap the up arrow on the picture block.')
    ],
    ok: L3("Barakalla! Tartib endi to'g'ri: muqova, sarlavha, rasm, matn.", 'Точно! Теперь порядок верный: обложка, заголовок, картинка, текст.', 'Exactly! Now the order is right: cover, title, picture, text.')
  },
  s10: {
    eyebrow: L3("O'chiramiz", 'Удаляем', 'Deleting'),
    say: L3("Voy, men adashib sarlavhaning nusxasini olib qo'ydim. Endi ikkita bir xil sarlavha! Ortiqchasini savat bilan o'chiring.",
      'Ой, я случайно скопировал заголовок. Теперь два одинаковых заголовка! Удали лишний корзиной.',
      'Oops, I copied the title by accident. Now there are two identical titles! Delete the extra one with the bin.'),
    ask: L3("Ortiqcha sarlavhani o'chiring", 'Удали лишний заголовок', 'Delete the extra title'),
    wrong: L3("Bu blok kerak. Faqat ikkinchi, ortiqcha sarlavhani o'chiring.", 'Этот блок нужен. Удали только второй, лишний заголовок.', 'This block is needed. Delete only the second, extra title.'),
    wrongTool: L3("Bu tugma o'chirmaydi. O'chiradigan tugma: savat.", 'Эта кнопка не удаляет. Удаляет корзина.', 'That button doesn’t delete. The bin deletes.'),
    hints: [
      L3("Ikkita bir xil sarlavha yonma-yon turibdi.", 'Два одинаковых заголовка стоят рядом.', 'Two identical titles are next to each other.'),
      L3("Ikkinchisini bosing, tepasida savat chiqadi.", 'Нажми на второй — над ним появится корзина.', 'Tap the second one; a bin appears above it.'),
      L3("Ikkinchi sarlavhada savatni bosing.", 'Нажми корзину у второго заголовка.', 'Tap the bin on the second title.')
    ],
    ok: L3("Barakalla! Ortiqcha sarlavha yo'q.", 'Точно! Лишнего заголовка нет.', 'Exactly! The extra title is gone.')
  },
  s11: {
    eyebrow: L3('Qaytarish', 'Отменить', 'Undo'),
    say: L3("Oh yo'q! Men yana adashdim va matn blokini o'chirib yubordim. Unda klub haqidagi gapingiz bor edi! Qo'rqmang: tepadagi orqaga strelka oxirgi ishni bekor qiladi. Bosing!",
      'Ой нет! Я опять ошибся и удалил текстовый блок. А там был твой текст о клубе! Не бойся: стрелка назад вверху отменяет последнее действие. Жми!',
      'Oh no! I made a mistake again and deleted the text block. Your text about the club was in it! Don’t worry: the back arrow at the top undoes the last action. Tap it!'),
    ask: L3("Orqaga strelka bilan matnni qaytaring", 'Верни текст стрелкой «отменить»', 'Bring the text back with the undo arrow'),
    hints: [
      L3("Muharrirning tepasiga qarang.", 'Посмотри вверх редактора.', 'Look at the top of the editor.'),
      L3("U yerda chapga qayrilgan strelka bor: bekor qilish.", 'Там стрелка, загнутая влево: «отменить».', 'There’s an arrow curving left: “undo”.'),
      L3("Orqaga strelkani bosing.", 'Нажми стрелку назад.', 'Tap the back arrow.')
    ],
    wrongRedo: L3("Bu strelka bekor qilingan ishni yana qiladi. Bizga orqaga strelka kerak, u chapda turibdi.", 'Эта стрелка повторяет отменённое. Нам нужна стрелка назад — левая.', 'That arrow redoes what was undone. We need the back arrow, the left one.'),
    ok: L3("Uf! Matn joyida. Esingizda bo'lsin: orqaga strelka xatoni tuzatadigan sehrli tugma.", 'Фух! Текст на месте. Запомни: стрелка назад — волшебная кнопка, которая исправляет ошибки.', 'Phew! The text is back. Remember: the back arrow is the magic button that fixes mistakes.')
  },
  s12: {
    eyebrow: L3('Tekshiramiz', 'Проверка', 'Check'),
    say: L3("Endi tugmalarni bilasizmi, tekshiramiz. Har bir savolga to'g'ri tugmani bosing.", 'Теперь проверим, знаешь ли ты кнопки. На каждый вопрос нажми нужную кнопку.', 'Now let’s check whether you know the buttons. Tap the right button for each question.'),
    ask: L3("Kerakli tugmani bosing", 'Нажми нужную кнопку', 'Tap the right button'),
    rounds: [
      { a: 'up', q: L3("Blokni yuqoriga ko'chirish uchun qaysi tugma?", 'Какая кнопка поднимает блок выше?', 'Which button moves a block up?'),
        why: L3("Yuqoriga strelka blokni bitta yuqoriga ko'taradi.", 'Стрелка вверх поднимает блок на одно место выше.', 'The up arrow moves the block one place up.') },
      { a: 'del', q: L3("Blokni o'chirish uchun?", 'Чтобы удалить блок?', 'To delete a block?'),
        why: L3("Savat blokni darrov o'chiradi.", 'Корзина удаляет блок сразу.', 'The bin deletes the block at once.') },
      { a: 'undo', q: L3("Adashib o'chirgan blokni qaytarish uchun?", 'Чтобы вернуть случайно удалённый блок?', 'To bring back a block deleted by mistake?'),
        why: L3("Orqaga strelka oxirgi ishni bekor qiladi.", 'Стрелка назад отменяет последнее действие.', 'The back arrow undoes the last action.') },
      { a: 'copy', q: L3("Xuddi shunday blokdan yana bittasini olish uchun?", 'Чтобы получить ещё один такой же блок?', 'To get another identical block?'),
        why: L3("Ikki to'rtburchak: nusxa olish.", 'Два квадратика — копировать.', 'Two squares: copy.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Bugun nimalarni bosgandingiz, esingizdami?", 'Вспомни, что ты сегодня нажимал.', 'Remember what you tapped today.'),
    hint2: L3("Strelka ko'chiradi, savat o'chiradi, orqaga strelka qaytaradi, to'rtburchaklar nusxa oladi.", 'Стрелка — переставить, корзина — удалить, стрелка назад — отменить, квадратики — копия.', 'Arrow: move; bin: delete; back arrow: undo; squares: copy.'),
    ok: L3("Hammasi to'g'ri! Siz blok tugmalarini bilasiz.", 'Всё верно! Ты знаешь кнопки блока.', 'All correct! You know the block buttons.'),
    names: { up: L3('Yuqoriga', 'Вверх', 'Up'), down: L3('Pastga', 'Вниз', 'Down'), del: L3("O'chirish", 'Удалить', 'Delete'), copy: L3('Nusxa', 'Копия', 'Copy'), undo: L3('Bekor qilish', 'Отменить', 'Undo'), off: L3('Yashirish', 'Скрыть', 'Hide') }
  },
  s13: {
    eyebrow: L3("Haqiqiy Tilda'da", 'В настоящей Tilda', 'In the real Tilda'),
    say: L3("Endi hammasini haqiqiy Tilda'dagi saytingizda qiling. Pastdagi qadamlar bo'yicha boring va oxirida «Опубликовать» ni bosing. Tayyor bo'lsa, saytingiz manzilini yozing. Hozir imkon bo'lmasa, keyinroq qilasiz.",
      'Теперь сделай всё на своём сайте в настоящей Tilda. Иди по шагам ниже и в конце нажми «Опубликовать». Готово — напиши адрес своего сайта, нет возможности сейчас — сделаешь позже.',
      'Now do it all on your site in the real Tilda. Follow the steps below and tap “Publish” at the end. When it’s done, type your site’s address; if you can’t right now, do it later.'),
    steps: [
      L3("tilda.cc da «Войти» va loyihangizni oching.", 'На tilda.cc нажми «Войти» и открой свой проект.', 'On tilda.cc tap “Log in” and open your project.'),
      L3("Sahifani oching: «Редактировать».", 'Открой страницу для редактирования.', 'Open the page for editing.'),
      L3("Muqovadan keyin sarlavha qo'shing.", 'После обложки добавь заголовок.', 'After the cover add a title.'),
      L3("Matn bloki qo'shing va o'z matningizni yozing.", 'Добавь текстовый блок и напиши свой текст.', 'Add a text block and write your text.'),
      L3("Plyus tugmasi bilan rasm qo'shing va uni yuqoriga strelka bilan joyiga qo'ying.", 'Добавь картинку кнопкой «плюс» и подними её стрелкой вверх.', 'Add a picture with the plus button and move it up with the up arrow.'),
      L3("«Опубликовать» ni bosing.", 'Нажми «Опубликовать».', 'Tap “Publish”.')
    ],
    ph: L3('masalan: brave-orange-robot.tilda.ws', 'например: brave-orange-robot.tilda.ws', 'for example: brave-orange-robot.tilda.ws'),
    check: L3('Tekshirish', 'Проверить', 'Check'),
    later: L3('Keyinroq qilaman', 'Сделаю позже', 'I’ll do it later'),
    ask: L3("Haqiqiy saytingizga bloklar qo'shing va manzilini yozing", 'Добавь блоки на свой настоящий сайт и напиши адрес', 'Add blocks to your real site and type its address'),
    bad: L3("Bu Tilda manziliga o'xshamaydi. Tilda manzili .tilda.ws bilan tugaydi.", 'Это не похоже на адрес Tilda. Адрес Tilda заканчивается на .tilda.ws.', 'That doesn’t look like a Tilda address. A Tilda address ends in .tilda.ws.'),
    demo: L3("Bu darsdagi namuna manzil. O'z saytingiz manzilini yozing.", 'Это адрес-пример из урока. Напиши адрес своего сайта.', 'That’s the example address from the lesson. Type your own site’s address.'),
    ok: L3("Zo'r! Saytingiz o'sib bormoqda!", 'Супер! Твой сайт растёт!', 'Awesome! Your site is growing!'),
    okLater: L3("Mayli. Uyda shu qadamlar bo'yicha qiling.", 'Хорошо. Сделай дома по этим шагам.', 'Okay. Do it at home with these steps.')
  },
  s14: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Topishmoqqa qaytamiz. Men blokni ko'chirib bo'lmaydi, yangi blok faqat pastga tushadi deb o'ylagandim. Adashibman! «plyus» blokni xohlagan joyga qo'yadi, strelkalar ko'chiradi, orqaga strelka esa xatoni qaytaradi.",
        'Вернёмся к загадке. Я думал, что блок нельзя переставить, а новый встаёт только вниз. Ошибся! «плюс» ставит блок куда угодно, стрелки переставляют, а стрелка назад исправляет ошибку.',
        'Back to the riddle. I thought a block couldn’t be moved and a new one only goes to the bottom. I was wrong! “plus” puts a block anywhere, the arrows move it, and the back arrow fixes a mistake.') },
      { k: 'code', text: L3("Har bir blokning kodi bor. CR bu muqova, TL sarlavha, TX matn, IM rasm.", 'У каждого блока есть код: CR — обложка, TL — заголовок, TX — текст, IM — картинка.', 'Every block has a code: CR cover, TL title, TX text, IM image.') },
      { k: 'add', text: L3("Blokni «ВСЕ БЛОКИ» yoki «plyus» orqali qo'shamiz: bo'lim, keyin blok.", 'Блок добавляем через «ВСЕ БЛОКИ» или «плюс»: раздел, потом блок.', 'We add a block through “All blocks” or “plus”: section, then block.') },
      { k: 'tools', text: L3("Blok tugmalari: nusxa, o'chirish, yashirish, yuqoriga, pastga.", 'Кнопки блока: копия, удалить, скрыть, вверх, вниз.', 'Block buttons: copy, delete, hide, up, down.') },
      { k: 'next', text: L3("Keyingi darsda matn va tugma bloklarini chuqurroq o'rganamiz. Ko'rishguncha!", 'На следующем уроке глубже изучим блоки текста и кнопок. До встречи!', 'Next lesson we’ll dig into text and button blocks. See you!') }
    ],
    roles: {
      riddle: L3("«+», strelkalar, bekor qilish", '«+», стрелки, отмена', '“+”, arrows, undo'),
      code: L3("CR · TL · TX · IM", 'CR · TL · TX · IM', 'CR · TL · TX · IM'),
      add: L3("«ВСЕ БЛОКИ» → bo'lim → blok", '«ВСЕ БЛОКИ» → раздел → блок', '“All blocks” → section → block'),
      tools: L3("Nusxa, o'chirish, yashirish", 'Копия, удалить, скрыть', 'Copy, delete, hide')
    },
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your site')
  }
};
