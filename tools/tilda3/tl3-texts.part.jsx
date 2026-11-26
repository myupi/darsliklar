// Тексты урока 3 модуля Tilda «Блоки Text и Button». Узбекский — первым, «Siz»; апостроф ASCII. RU — «ты» без рода; EN — «you».
// Текст сайта клуба (заголовок, лид, шесть предложений) — на языке урока: сайт делает ученик для своего клуба.
const PAGE3 = {
  title: L3("RoboKlub: o'z robotingizni yasang!", 'RoboKlub: собери своего робота!', 'RoboKlub: build your own robot!'),
  lead: L3("Har shanba robot yig'amiz va dasturlaymiz.", 'Каждую субботу собираем и программируем роботов.', 'Every Saturday we build and program robots.'),
  sents: [
    L3("RoboKlub — maktab o'quvchilari uchun robototexnika to'garagi.", 'RoboKlub — кружок робототехники для школьников.', 'RoboKlub is a robotics club for school students.'),
    L3("Biz 2020-yildan beri ishlaymiz.", 'Мы работаем с 2020 года.', 'We have been running since 2020.'),
    L3("Darslarda robot yig'amiz va uni dasturlaymiz.", 'На занятиях мы собираем робота и программируем его.', 'In class we build a robot and program it.'),
    L3("Har kim o'z robotini uyga olib ketadi.", 'Каждый уносит своего робота домой.', 'Everyone takes their robot home.'),
    L3("Darslar har shanba soat 10:00 da.", 'Занятия — каждую субботу в 10:00.', 'Classes are every Saturday at 10:00.'),
    L3("Birinchi dars bepul.", 'Первое занятие бесплатное.', 'The first class is free.')
  ],
  key: L3('bepul', 'бесплатное', 'free'),
  time: L3('10:00', '10:00', '10:00'),
  quote: L3("«Bu yerda birinchi robotimni yasadim!»", '«Здесь я собрал своего первого робота!»', '“I built my first robot here!”'),
  quoteWho: L3('Aziz, 12 yosh', 'Азиз, 12 лет', 'Aziz, age 12')
};

const C = {
  s1: {
    eyebrow: L3("Sayt o'qilmayapti", 'Сайт не читают', 'Nobody reads the site'),
    from: L3('RoboKlub', 'RoboKlub', 'RoboKlub'),
    msg: L3("Kodi, saytimizni ochishyapti-yu, o'qishmayapti. Klubga yozilish tugmasi ham yo'q. Yordam bering!",
      'Коди, сайт открывают, но не читают. И кнопки записи в клуб нет. Помоги!',
      'Kodi, people open our site but don’t read it. And there’s no button to join the club. Help!'),
    say: L3("RoboKlubdan yangi xabar! Saytga qarang: hamma matn bitta katta qalin devorga o'xshaydi, yozilish tugmasi ham yo'q. Sizningcha, odamlar o'qishi uchun nima qilish kerak?",
      'Новое сообщение от RoboKlub! Посмотри на сайт: весь текст — одна большая жирная стена, и кнопки записи нет. Как думаешь, что сделать, чтобы сайт читали?',
      'A new message from RoboKlub! Look at the site: all the text is one big bold wall, and there’s no sign-up button. What do you think we should do so people read it?'),
    ask: L3("Odamlar o'qishi uchun nima qilamiz?", 'Что сделать, чтобы сайт читали?', 'What should we do so people read it?'),
    opts: { big: L3("Hammasini qalin va katta qilamiz", 'Сделаем всё жирным и крупным', 'Make everything bold and big'), split: L3("Matnni bo'laklarga bo'lamiz", 'Разобьём текст на части', 'Split the text into parts') },
    reply: {
      big: L3("Men ham shunday o'ylayman!", 'Я тоже так думаю!', 'I think so too!'),
      split: L3("Qiziq fikr. Lekin menda boshqa reja bor.", 'Интересная мысль. Но у меня другой план.', 'Interesting idea. But I have another plan.')
    },
    riddle: L3("Menimcha, hamma matnni qalin va katta qilsak, hamma o'qiydi. Tugmani esa sahifaning qayeriga qo'ysak ham, baribir bosishadi. Bugungi topishmoq shu: men haqmanmi? Dars oxirida bilamiz.",
      'По-моему, если сделать весь текст жирным и крупным, его прочитают все. А кнопку нажмут, где бы она ни стояла. Сегодняшняя загадка: прав ли я? Узнаем в конце урока.',
      'I think if we make all the text bold and big, everyone will read it. And people will press the button wherever it is on the page. Today’s riddle: am I right? We’ll find out at the end of the lesson.'),
    askDone: L3("Topishmoq: hammasi qalin bo'lsa, o'qishadimi?", 'Загадка: если всё жирное, будут читать?', 'Riddle: if it’s all bold, will people read it?')
  },
  s2: {
    eyebrow: L3('Matn turlari', 'Виды текста', 'Kinds of text'),
    say: L3("Saytdagi matn bir xil emas. Har bir turning o'z ishi bor. Kuzating: kursor har bir blokka boradi.",
      'Текст на сайте бывает разный. У каждого вида своя работа. Смотри: курсор подходит к каждому блоку.',
      'Text on a site comes in different kinds. Each kind has its own job. Watch: the cursor goes to each block.'),
    steps: [
      L3("Bu sarlavha, ya'ni eng katta va qisqa matn degani. U sahifa nima haqida ekanini bir qarashda aytadi.", 'Это заголовок — самый крупный и короткий текст. Он с одного взгляда говорит, о чём страница.', 'This is the title, the biggest and shortest text. In one glance it tells what the page is about.'),
      L3("Bu lid, ya'ni sarlavha ostidagi bitta qisqa gap degani. U asosiy fikrni beradi.", 'Это лид — одно короткое предложение под заголовком. Он даёт главную мысль.', 'This is the lead, one short sentence under the title. It gives the main idea.'),
      L3("Bu oddiy matn, ya'ni batafsil ma'lumot degani. U qisqa abzaslarga bo'linadi, shunda oson o'qiladi.", 'Это обычный текст — подробности. Его делят на короткие абзацы, так его легко читать.', 'This is the body text, the details. It’s split into short paragraphs so it’s easy to read.'),
      L3("Bu iqtibos, ya'ni kimningdir so'zi degani. U ajralib turadi va saytga ishonch qo'shadi.", 'Это цитата — чьи-то слова. Она выделяется и добавляет сайту доверия.', 'This is a quote, someone’s words. It stands out and makes the site more trustworthy.')
    ],
    help: [
      L3("Kursor qaysi blokda bo'lsa, o'shaning nomi ko'rinadi.", 'Где курсор, у того блока видно название.', 'Wherever the cursor is, that block shows its name.'),
      L3("Sarlavha bu mavzu, lid asosiy fikr, matn tafsilot, iqtibos esa kimningdir so'zi.", 'Заголовок — тема, лид — главная мысль, текст — подробности, цитата — чьи-то слова.', 'Title is the topic, lead the main idea, text the details, quote someone’s words.'),
      L3("Xuddi gazetadagidek: katta sarlavha, ostida qisqa gap, keyin maqola.", 'Как в газете: крупный заголовок, под ним короткая фраза, потом статья.', 'Just like a newspaper: a big headline, a short line under it, then the article.')
    ],
    names: { title: L3('Sarlavha', 'Заголовок', 'Title'), lead: L3('Lid', 'Лид', 'Lead'), text: L3('Matn', 'Текст', 'Text'), quote: L3('Iqtibos', 'Цитата', 'Quote') },
    ask: L3("Matn turlarini kuzating", 'Смотри на виды текста', 'Watch the kinds of text'),
    askDone: L3("Sarlavha, lid, matn, iqtibos", 'Заголовок, лид, текст, цитата', 'Title, lead, text, quote')
  },
  s3: {
    eyebrow: L3('Qaysi blok?', 'Какой блок?', 'Which block?'),
    say: L3("Endi siz tanlang. Klub matn yubordi: u qaysi blokka yoziladi? To'g'ri turini bosing.",
      'Теперь выбираешь ты. Клуб прислал текст: в какой блок его писать? Нажми нужный вид.',
      'Now you choose. The club sent some text: which block does it go in? Tap the right kind.'),
    ask: L3("Bu matn qaysi blokka?", 'В какой блок этот текст?', 'Which block is this text for?'),
    rounds: [
      { q: L3("RoboKlub: o'z robotingizni yasang!", 'RoboKlub: собери своего робота!', 'RoboKlub: build your own robot!'), a: 'title',
        why: L3("Qisqa va asosiy gap. Bu sarlavha.", 'Короткая главная фраза. Это заголовок.', 'Short and main. That’s a title.') },
      { q: L3("Har shanba robot yig'amiz va dasturlaymiz.", 'Каждую субботу собираем и программируем роботов.', 'Every Saturday we build and program robots.'), a: 'lead',
        why: L3("Sarlavha ostidagi bitta qisqa asosiy fikr. Bu lid.", 'Одна короткая главная мысль под заголовком. Это лид.', 'One short main idea under the title. That’s a lead.') },
      { q: L3("Darslar maktab binosida bo'ladi. O'zingiz bilan hech narsa olib kelish shart emas: robotlar va noutbuklar klubda bor. Darsdan keyin robotingizni uyga olib ketasiz.",
        'Занятия проходят в здании школы. Ничего приносить не нужно: роботы и ноутбуки есть в клубе. После занятия робота можно забрать домой.',
        'Classes are held in the school building. You don’t need to bring anything: the club has robots and laptops. After class you take your robot home.'), a: 'text',
        why: L3("Uzun, batafsil ma'lumot. Bu oddiy matn.", 'Длинные подробности. Это обычный текст.', 'Long details. That’s body text.') },
      { q: L3("«Bu yerda birinchi robotimni yasadim!» — Aziz, 12 yosh", '«Здесь я собрал своего первого робота!» — Азиз, 12 лет', '“I built my first robot here!” — Aziz, age 12'), a: 'quote',
        why: L3("Kimningdir so'zi va ismi. Bu iqtibos.", 'Чьи-то слова и имя. Это цитата.', 'Someone’s words and name. That’s a quote.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Matnning uzunligiga va kim gapirayotganiga qarang.", 'Посмотри, длинный ли текст и кто говорит.', 'Look at how long the text is and who is speaking.'),
    hint2: L3("Qisqa asosiy gap bu sarlavha. Uning ostidagi qisqa fikr bu lid. Uzun tushuntirish bu matn. Kimningdir so'zi esa iqtibos.",
      'Короткая главная фраза — заголовок. Короткая мысль под ним — лид. Длинное объяснение — текст. Чьи-то слова — цитата.',
      'A short main line is a title. A short idea under it is a lead. A long explanation is text. Someone’s words are a quote.'),
    ok: L3("Barakalla! Endi har bir matnning o'z bloki bor.", 'Молодец! Теперь у каждого текста свой блок.', 'Well done! Now every text has its own block.')
  },
  s4: {
    eyebrow: L3("Devorni bo'ling", 'Разбей стену', 'Break the wall'),
    say: L3("Klub matni bitta devorga o'xshaydi. Unda uchta mavzu bor: klub haqida, darslarda nima qilamiz va qachon. Mavzu almashgan joyni qaychi bilan kesing.",
      'Текст клуба похож на одну стену. В нём три темы: о клубе, что делаем на занятиях и когда. Разрежь ножницами там, где меняется тема.',
      'The club’s text looks like one wall. It has three topics: about the club, what we do in class, and when. Cut with the scissors where the topic changes.'),
    ask: L3("Mavzu almashgan joyni kesing", 'Разрежь там, где меняется тема', 'Cut where the topic changes'),
    wrong: L3("Bu ikki gap bitta mavzu haqida. Ularni ajratmaymiz. Mavzu qayerda almashishiga qarang.", 'Эти два предложения — об одной теме. Их не разделяем. Посмотри, где меняется тема.', 'These two sentences are about one topic. We don’t split them. Look for where the topic changes.'),
    half: L3("Zo'r, bitta kesish tayyor! Yana bitta mavzu almashadigan joy bor.", 'Отлично, один разрез есть! Есть ещё одно место, где меняется тема.', 'Great, one cut done! There’s one more place where the topic changes.'),
    hints: [
      L3("Har bir gap nima haqida ekanini o'qing: klub, darslar yoki vaqt.", 'Прочитай, о чём каждое предложение: клуб, занятия или время.', 'Read what each sentence is about: the club, the classes, or the time.'),
      L3("Birinchi kesish klub haqidagi gaplardan keyin. Ikkinchisi darslarda nima qilishimizdan keyin.", 'Первый разрез — после предложений о клубе. Второй — после того, что делаем на занятиях.', 'The first cut goes after the sentences about the club. The second goes after what we do in class.'),
      L3("Ikkinchi gapdan keyin va to'rtinchi gapdan keyin kesing.", 'Режь после второго и после четвёртого предложения.', 'Cut after the second sentence and after the fourth.')
    ],
    ok: L3("Ajoyib! Endi bitta devor o'rniga uchta qisqa abzas. Ko'zga yengil, o'qish oson.", 'Здорово! Вместо одной стены — три коротких абзаца. Глазам легко, читать просто.', 'Awesome! Instead of one wall there are three short paragraphs. Easy on the eyes, easy to read.')
  },
  s5: {
    eyebrow: L3('Matn uslubi', 'Стиль текста', 'Text style'),
    say: L3("Tildada matnni bevosita sahifada bezash mumkin. So'zni bosasiz, tepada panel chiqadi. Kuzating.",
      'В Tilda текст можно оформлять прямо на странице. Нажимаешь на слово — сверху появляется панель. Смотри.',
      'In Tilda you can style text right on the page. Tap a word, and a panel appears above. Watch.'),
    steps: [
      L3("So'zni bosdim, panel chiqdi: qalin, qiya, tagiga chizilgan, havola, rang va o'lcham.", 'Нажал на слово — появилась панель: жирный, курсив, подчёркнутый, ссылка, цвет и размер.', 'I tapped a word and the panel appeared: bold, italic, underline, link, color and size.'),
      L3("B tugmasi so'zni qalin qiladi. Qalin so'z darrov ko'zga tashlanadi.", 'Кнопка B делает слово жирным. Жирное слово сразу бросается в глаза.', 'The B button makes the word bold. A bold word catches the eye right away.'),
      L3("Lekin hamma so'z qalin bo'lsa-chi? Qarang: endi hech narsa ajralmay qoldi. Shuning uchun faqat eng muhim bir-ikki so'zni ajratamiz.", 'А если жирным будет всё? Смотри: теперь ничего не выделяется. Поэтому выделяем только одно-два самых важных слова.', 'But what if everything is bold? Look: now nothing stands out. That’s why we highlight only one or two of the most important words.')
    ],
    help: [
      L3("Kuzating: so'zni bosish, panel, B tugmasi.", 'Следи: нажатие на слово, панель, кнопка B.', 'Watch: tap a word, the panel, the B button.'),
      L3("Qalin so'z ko'zni tortadi, lekin faqat u yolg'iz bo'lsa.", 'Жирное слово притягивает взгляд, но только если оно одно.', 'A bold word draws the eye, but only if it’s alone.'),
      L3("Xuddi daftardagi marker kabi: hamma narsani bo'yasangiz, muhimini topib bo'lmaydi.", 'Как маркер в тетради: если закрасить всё, главное не найти.', 'Like a highlighter in a notebook: color everything and you can’t find what matters.')
    ],
    ask: L3("Matn uslubini kuzating", 'Смотри, как оформляют текст', 'Watch how text is styled'),
    askDone: L3("Faqat muhim so'zni ajratamiz", 'Выделяем только главное', 'Highlight only what matters')
  },
  s6: {
    eyebrow: L3("Muhim so'z", 'Главное слово', 'The key word'),
    say: L3("Klub so'radi: eng muhimi, birinchi dars bepul ekanini hamma ko'rsin. Shu so'zni bosing va uni qalin qiling.",
      'Клуб просит: главное — чтобы все видели, что первое занятие бесплатное. Нажми на это слово и сделай его жирным.',
      'The club asks: most importantly, everyone should see that the first class is free. Tap that word and make it bold.'),
    ask: L3("«bepul» so'zini qalin qiling", 'Сделай слово «бесплатное» жирным', 'Make the word “free” bold'),
    wrongWord: L3("Bu so'z emas. Klub «bepul» so'zini ajratishni so'radi.", 'Не то слово. Клуб просил выделить слово «бесплатное».', 'Not that word. The club asked to highlight the word “free”.'),
    wrongTool: L3("Bu tugma so'zni qalin qilmaydi. B harfli tugmani bosing.", 'Эта кнопка не делает слово жирным. Нажми кнопку с буквой B.', 'This button doesn’t make the word bold. Tap the button with the letter B.'),
    hints: [
      L3("Oxirgi abzasdagi «bepul» so'zini toping.", 'Найди слово «бесплатное» в последнем абзаце.', 'Find the word “free” in the last paragraph.'),
      L3("So'zni bosing, tepada panel chiqadi.", 'Нажми на слово — сверху появится панель.', 'Tap the word, and a panel appears above.'),
      L3("Panelda B tugmasini bosing.", 'На панели нажми кнопку B.', 'On the panel, tap the B button.')
    ],
    ok: L3("Mana! «bepul» endi darrov ko'zga tashlanadi.", 'Вот! Слово «бесплатное» теперь сразу видно.', 'There! The word “free” now catches the eye right away.')
  },
  s7: {
    eyebrow: L3('Solishtiring', 'Сравни', 'Compare'),
    say: L3("Endi solishtiring. Ikkala sayt bir xil matnda. Qaysi birini o'qish osonroq? Bosing.",
      'Теперь сравни. На обоих сайтах один и тот же текст. Какой читать легче? Нажми.',
      'Now compare. Both sites have the same text. Which one is easier to read? Tap it.'),
    ask: L3("Qaysi birini o'qish oson?", 'Какой читать легче?', 'Which one is easier to read?'),
    wrong: L3("Bunda hamma so'z qalin, ko'z nimaga qarashni bilmaydi. Ikkinchisiga qarang: sarlavha, qisqa abzaslar va bitta qalin so'z.",
      'Здесь всё жирное, глаз не знает, куда смотреть. Посмотри на второй: заголовок, короткие абзацы и одно жирное слово.',
      'Here everything is bold, so the eye doesn’t know where to look. Look at the other one: a title, short paragraphs and one bold word.'),
    ok: L3("To'g'ri! Qisqa abzaslar va bitta ajratilgan so'z o'qishni osonlashtiradi. Demak, hammasini qalin qilish yordam bermas ekan.",
      'Верно! Короткие абзацы и одно выделенное слово облегчают чтение. Значит, делать всё жирным не помогает.',
      'Right! Short paragraphs and one highlighted word make reading easier. So making everything bold doesn’t help.')
  },
  s8: {
    eyebrow: L3('Tugma', 'Кнопка', 'Button'),
    say: L3("Endi tugma. Tugma, ya'ni bosiladigan blok degani. U odamga keyingi qadamni aytadi: yozilish, sotib olish, bog'lanish. Kuzating.",
      'Теперь кнопка. Кнопка — это блок, на который нажимают. Она говорит человеку, какой следующий шаг: записаться, купить, связаться. Смотри.',
      'Now the button. A button is a block you press. It tells a person the next step: sign up, buy, get in touch. Watch.'),
    steps: [
      L3("«ВСЕ БЛОКИ», keyin «Кнопка» bo'limi. Qulfi yo'q bepul blokni tanlayman: BF101.", '«ВСЕ БЛОКИ», потом раздел «Кнопка». Выбираю бесплатный блок без замка: BF101.', '“All blocks”, then the “Button” section. I pick the free block without a lock: BF101.'),
      L3("Tugma paydo bo'ldi. Lekin unda inglizcha «Let's go!» deb yozilgan, ya'ni «Ketdik!» degani. Qayerga ketamiz? Bu hech narsa aytmaydi.", 'Кнопка появилась. Но на ней по-английски написано «Let’s go!», то есть «Поехали!». Куда поехали? Это ничего не говорит.', 'The button appeared. But it says “Let’s go!”. Go where? That tells nobody anything.'),
      L3("«Контент» ni bosaman. Bu yerda tugma matnini almashtiraman. Tugma bosilganda nima bo'lishini aytishi kerak.", 'Нажимаю «Контент». Здесь меняю текст кнопки. Он должен говорить, что будет, если нажать.', 'I tap “Content”. Here I change the button text. It should say what happens when you press it.')
    ],
    help: [
      L3("Kuzating: kutubxona, «Кнопка» bo'limi, BF101, keyin «Контент».", 'Следи: библиотека, раздел «Кнопка», BF101, потом «Контент».', 'Watch: the library, the “Button” section, BF101, then “Content”.'),
      L3("Tugma keyingi qadamni aytadi. Uning matni «Bosing» emas, nima bo'lishi.", 'Кнопка говорит следующий шаг. Её текст — не «Нажми», а что произойдёт.', 'A button says the next step. Its text isn’t “Click”, it’s what will happen.'),
      L3("Xuddi lift tugmalari kabi: har birida qaysi qavatga borishingiz yozilgan.", 'Как кнопки в лифте: на каждой написано, на какой этаж поедешь.', 'Like elevator buttons: each one says which floor you’ll go to.')
    ],
    demoText: L3('Batafsil', 'Подробнее', 'Learn more'),
    ask: L3("Tugma qanday qo'shilishini kuzating", 'Смотри, как добавить кнопку', 'Watch how to add a button'),
    askDone: L3("Tugma keyingi qadamni aytadi", 'Кнопка говорит следующий шаг', 'A button says the next step')
  },
  s9: {
    eyebrow: L3("Tugma qo'shing", 'Добавь кнопку', 'Add a button'),
    say: L3("Endi o'zingiz qo'shing: matndan keyin tugma kerak. «ВСЕ БЛОКИ» ni bosing va «Кнопка» bo'limidan bepul blokni tanlang.",
      'Теперь добавь сам: после текста нужна кнопка. Нажми «ВСЕ БЛОКИ» и выбери бесплатный блок в разделе «Кнопка».',
      'Now add it yourself: a button is needed after the text. Tap “All blocks” and pick the free block in the “Button” section.'),
    ask: L3("Tugma qo'shing: «Кнопка» bo'limi", 'Добавь кнопку: раздел «Кнопка»', 'Add a button: the “Button” section'),
    wrongCat: L3("Bu bo'limda tugma yo'q. «Кнопка» bo'limini toping.", 'В этом разделе кнопки нет. Найди раздел «Кнопка».', 'There’s no button in this section. Find the “Button” section.'),
    locked: L3("Bu blok qulf bilan, ya'ni pullik degani. Bepul blokni tanlang: BF101.", 'У этого блока замок — он платный. Выбери бесплатный: BF101.', 'This block has a lock, so it’s paid. Pick the free one: BF101.'),
    hints: [
      L3("Sahifa ostidagi «ВСЕ БЛОКИ» ni bosing.", 'Нажми «ВСЕ БЛОКИ» под страницей.', 'Tap “All blocks” under the page.'),
      L3("Bo'limlar ro'yxatidan «Кнопка» ni toping.", 'Найди в списке разделов «Кнопка».', 'Find “Button” in the list of sections.'),
      L3("Qulfi yo'q kartani bosing: BF101.", 'Нажми карточку без замка: BF101.', 'Tap the card without a lock: BF101.')
    ],
    ok: L3("Tugma joyida! Faqat unda hali «Let's go!» deb yozilgan.", 'Кнопка на месте! Только на ней пока написано «Let’s go!».', 'The button is in place! It just says “Let’s go!” for now.')
  },
  s10: {
    eyebrow: L3('Tugma matni', 'Текст кнопки', 'Button text'),
    say: L3("«Let's go!» hech narsa aytmaydi: qayerga ketamiz? Tugmani bosing, keyin «Контент» ni oching va eng yaxshi matnni tanlang.",
      '«Let’s go!» ничего не говорит: куда поехали? Нажми на кнопку, потом открой «Контент» и выбери лучший текст.',
      '“Let’s go!” says nothing: go where? Tap the button, then open “Content” and pick the best text.'),
    ask: L3("Tugmaga yaxshi matn tanlang", 'Выбери кнопке хороший текст', 'Pick good text for the button'),
    opts: { go: L3('Bosing', 'Нажми', 'Click'), en: L3("Let's go!", 'Let’s go!', 'Let’s go!'), join: L3("Klubga yozilish", 'Записаться в клуб', 'Join the club') },
    wrongGo: L3("«Bosing» nima bo'lishini aytmaydi. Tugma matni keyingi qadamni aytishi kerak.", '«Нажми» не говорит, что произойдёт. Текст кнопки должен называть следующий шаг.', '“Click” doesn’t say what will happen. Button text should name the next step.'),
    wrongEn: L3("Bu Tildaning inglizcha namunasi. U qayerga ketishimizni aytmaydi, sayt esa sizning tilingizda.", 'Это английский образец Tilda. Он не говорит, куда мы поедем, а сайт на твоём языке.', 'That’s Tilda’s default text. It doesn’t say where we’re going. Say what happens when you press it.'),
    hints: [
      L3("Tugma blokini bosing, keyin «Контент» ni.", 'Нажми на блок кнопки, потом «Контент».', 'Tap the button block, then “Content”.'),
      L3("Odam tugmani bosganda nima bo'ladi? Shuni aytgan matnni tanlang.", 'Что будет, когда человек нажмёт? Выбери текст, который это говорит.', 'What happens when a person presses it? Pick the text that says so.'),
      L3("«Klubga yozilish» ni tanlang.", 'Выбери «Записаться в клуб».', 'Pick “Join the club”.')
    ],
    ok: L3("Zo'r! Endi tugma nima bo'lishini aniq aytadi.", 'Супер! Теперь кнопка ясно говорит, что будет.', 'Awesome! Now the button says clearly what will happen.')
  },
  s11: {
    eyebrow: L3("Tugma joyi", 'Место кнопки', 'Where the button goes'),
    say: L3("Voy! Men tugmani eng tepaga, muqova ostiga ko'chirdim: hamma ko'rsin dedim. Lekin odam hali klub haqida o'qimadi-ku. Tugmani matndan keyinga qaytaring.",
      'Ой! Я передвинул кнопку на самый верх, под обложку: пусть все видят. Но человек ещё ничего не прочитал о клубе. Верни кнопку после текста.',
      'Oops! I moved the button to the very top, under the cover, so everyone sees it. But people haven’t read about the club yet. Move the button back after the text.'),
    ask: L3("Tugmani matndan keyinga tushiring", 'Опусти кнопку под текст', 'Move the button below the text'),
    wrongUp: L3("Tugma tepaga emas, pastga kerak: matndan keyin.", 'Кнопке нужно не вверх, а вниз: после текста.', 'The button needs to go down, not up: after the text.'),
    wrongBlock: L3("Bu blok o'z joyida. Tugmani tanlang.", 'Этот блок на своём месте. Выбери кнопку.', 'This block is in its place. Select the button.'),
    wrongTool: L3("Bu boshqa tugma. Pastga strelkani bosing.", 'Это другая кнопка. Нажми стрелку вниз.', 'That’s a different button. Tap the down arrow.'),
    step: L3("Yaxshi, yana pastga!", 'Хорошо, ещё ниже!', 'Good, further down!'),
    hints: [
      L3("Tugma blokini bosing.", 'Нажми на блок кнопки.', 'Tap the button block.'),
      L3("Panelning o'ng tomonida pastga strelka bor.", 'Справа на панели есть стрелка вниз.', 'On the right of the panel there’s a down arrow.'),
      L3("Pastga strelkani tugma matndan keyin turguncha bosing.", 'Жми стрелку вниз, пока кнопка не встанет после текста.', 'Keep tapping the down arrow until the button sits after the text.')
    ],
    ok: L3("Endi to'g'ri! Oldin odam o'qiydi, keyin tugmani bosadi.", 'Теперь правильно! Сначала человек читает, потом нажимает кнопку.', 'Now it’s right! First people read, then they press the button.')
  },
  s12: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Endi kichik tekshiruv. Har bir savolda ikkita variant bor. Yaxshisini bosing.",
      'Теперь маленькая проверка. В каждом вопросе два варианта. Нажми лучший.',
      'Now a little check. Each question has two options. Tap the better one.'),
    ask: L3("Yaxshisini tanlang", 'Выбери лучший вариант', 'Pick the better option'),
    rounds: [
      { q: L3('Qaysi tugma yaxshi?', 'Какая кнопка лучше?', 'Which button is better?'), kind: 'btn', a: 'b',
        A: L3('Bosing', 'Нажми', 'Click'), B: L3("Klubga yozilish", 'Записаться в клуб', 'Join the club'),
        why: L3("Tugma keyingi qadamni aytadi.", 'Кнопка называет следующий шаг.', 'A button names the next step.') },
      { q: L3("Qaysi so'z qalin bo'lishi kerak?", 'Какое слово выделить жирным?', 'Which word should be bold?'), kind: 'bold', a: 'a',
        A: L3("Birinchi dars ||bepul||.", 'Первое занятие ||бесплатное||.', 'The first class is ||free||.'),
        B: L3("||Birinchi|| dars bepul.", '||Первое|| занятие бесплатное.', '||The|| first class is free.'),
        why: L3("Faqat eng muhim so'z ajratiladi.", 'Выделяют только самое важное слово.', 'Only the most important word is highlighted.') },
      { q: L3('Tugma qayerda turishi kerak?', 'Где должна стоять кнопка?', 'Where should the button go?'), kind: 'pos', a: 'b',
        A: L3('Matndan oldin', 'Перед текстом', 'Before the text'), B: L3('Matndan keyin', 'После текста', 'After the text'),
        why: L3("Oldin odam o'qiydi, keyin bosadi.", 'Сначала читают, потом нажимают.', 'First people read, then they press.') },
      { q: L3('Qaysi sarlavha yaxshi?', 'Какой заголовок лучше?', 'Which title is better?'), kind: 'title', a: 'a',
        A: L3('Robot yasaymiz!', 'Собираем роботов!', 'We build robots!'),
        B: L3("Bizning klubimizda har shanba robot yig'amiz va ularni dasturlaymiz", 'В нашем клубе каждую субботу мы собираем роботов и программируем их', 'In our club every Saturday we build robots and program them'),
        why: L3("Sarlavha qisqa, tafsilot esa matnda.", 'Заголовок короткий, подробности — в тексте.', 'A title is short; the details go in the text.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("O'quvchi o'rniga o'zingizni qo'ying: qaysi biri tezroq tushunarli?", 'Представь себя читателем: что понятнее с первого взгляда?', 'Imagine you’re the reader: which is clearer at a glance?'),
    hint2: L3("Esingizda bo'lsin: sarlavha qisqa, qalin faqat muhim so'z, tugma esa keyingi qadamni aytadi va matndan keyin turadi.", 'Помни: заголовок короткий, жирное — только главное слово, кнопка — следующий шаг и после текста.', 'Remember: a short title, bold only for the key word, a button that names the next step and sits after the text.'),
    ok: L3("Ajoyib! Siz yaxshi sayt qoidalarini bilasiz.", 'Отлично! Ты знаешь правила хорошего сайта.', 'Excellent! You know the rules of a good site.')
  },
  s13: {
    eyebrow: L3("Haqiqiy Tildada", 'В настоящей Tilda', 'In the real Tilda'),
    say: L3("Endi hammasini haqiqiy Tildadagi saytingizda qiling. Pastdagi qadamlar bo'yicha boring va oxirida «Опубликовать» ni bosing. Tayyor bo'lsa, saytingiz manzilini yozing. Hozir imkon bo'lmasa, keyinroq qilasiz.",
      'Теперь сделай всё на своём сайте в настоящей Tilda. Иди по шагам ниже и в конце нажми «Опубликовать». Готово — напиши адрес своего сайта; нет возможности сейчас — сделаешь позже.',
      'Now do it all on your site in the real Tilda. Follow the steps below and tap “Publish” at the end. When it’s done, type your site’s address; if you can’t right now, do it later.'),
    steps: [
      L3("tilda.cc da «Войти» va saytingiz sahifasini oching.", 'На tilda.cc нажми «Войти» и открой страницу своего сайта.', 'On tilda.cc tap “Log in” and open your site’s page.'),
      L3("Matnni qisqa abzaslarga bo'ling.", 'Разбей текст на короткие абзацы.', 'Split the text into short paragraphs.'),
      L3("Eng muhim so'zni bosing va B bilan qalin qiling.", 'Нажми на самое важное слово и сделай его жирным кнопкой B.', 'Tap the most important word and make it bold with B.'),
      L3("«ВСЕ БЛОКИ» → «Кнопка» → BF101.", '«ВСЕ БЛОКИ» → «Кнопка» → BF101.', '“All blocks” → “Button” → BF101.'),
      L3("«Контент» da tugmaga keyingi qadamni yozing.", 'В «Контенте» напиши на кнопке следующий шаг.', 'In “Content”, write the next step on the button.'),
      L3("Tugmani matndan keyin qo'ying va «Опубликовать» ni bosing.", 'Поставь кнопку после текста и нажми «Опубликовать».', 'Put the button after the text and tap “Publish”.')
    ],
    ph: L3('masalan: brave-orange-robot.tilda.ws', 'например: brave-orange-robot.tilda.ws', 'for example: brave-orange-robot.tilda.ws'),
    check: L3('Tekshirish', 'Проверить', 'Check'),
    later: L3('Keyinroq qilaman', 'Сделаю позже', 'I’ll do it later'),
    ask: L3("Saytingizga matn va tugma qo'shing va manzilini yozing", 'Добавь текст и кнопку на свой сайт и напиши адрес', 'Add text and a button to your site and type its address'),
    bad: L3("Bu Tilda manziliga o'xshamaydi. Tilda manzili .tilda.ws bilan tugaydi.", 'Это не похоже на адрес Tilda. Адрес Tilda заканчивается на .tilda.ws.', 'That doesn’t look like a Tilda address. A Tilda address ends in .tilda.ws.'),
    demo: L3("Bu darsdagi namuna manzil. O'z saytingiz manzilini yozing.", 'Это адрес-пример из урока. Напиши адрес своего сайта.', 'That’s the example address from the lesson. Type your own site’s address.'),
    ok: L3("Zo'r! Saytingizni endi o'qishadi va tugmani bosishadi!", 'Супер! Твой сайт теперь будут читать и нажимать кнопку!', 'Awesome! Now people will read your site and press the button!'),
    okLater: L3("Mayli. Uyda shu qadamlar bo'yicha qiling.", 'Хорошо. Сделай дома по этим шагам.', 'Okay. Do it at home with these steps.')
  },
  s14: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men hammasini qalin qilsak, hamma o'qiydi degandim? Xato qilibman! Hammasi qalin bo'lsa, hech narsa ajralmaydi. Tugma ham istalgan joyda emas, matndan keyin turadi.",
        'Помнишь, я говорил, что если всё сделать жирным, все прочитают? Я ошибся! Когда всё жирное, ничего не выделяется. И кнопка стоит не где угодно, а после текста.',
        'Remember when I said that if everything is bold, everyone will read it? I was wrong! When everything is bold, nothing stands out. And a button doesn’t go just anywhere; it goes after the text.') },
      { k: 'kinds', text: L3("Matnning turlari bor: sarlavha, lid, matn va iqtibos. Uzun matnni esa qisqa abzaslarga bo'lamiz.",
        'У текста есть виды: заголовок, лид, текст и цитата. А длинный текст делим на короткие абзацы.',
        'Text comes in kinds: title, lead, text and quote. And we split long text into short paragraphs.') },
      { k: 'bold', text: L3("Faqat eng muhim so'zni qalin qilamiz.", 'Жирным выделяем только самое важное слово.', 'We make only the most important word bold.') },
      { k: 'button', text: L3("Tugma keyingi qadamni aytadi va o'zi haqida gapirgan matndan keyin turadi.", 'Кнопка называет следующий шаг и стоит после текста, о котором она.', 'A button names the next step and sits after the text it’s about.') },
      { k: null, text: L3("Barakalla! RoboKlub sayti endi o'qiladi va unga yozilish mumkin. Keyingi darsda saytga chiroyli rasm va muqova qo'shamiz!",
        'Ура! Сайт RoboKlub теперь читают, и в клуб можно записаться. На следующем уроке добавим красивые картинки и обложку!',
        'Hooray! The RoboKlub site is easy to read now, and you can sign up for the club. Next lesson we’ll add beautiful pictures and a cover!') }
    ],
    ask: L3("Sayt o'qiladi va tugma ishlaydi", 'Сайт читают, кнопка работает', 'The site is readable and the button works'),
    roles: { riddle: L3("Hammasi qalin emas", 'Не всё жирным', 'Not everything bold'), kinds: L3('Matn turlari va abzaslar', 'Виды текста и абзацы', 'Kinds of text and paragraphs'),
      bold: L3("Qalin — faqat muhim so'z", 'Жирное — только главное', 'Bold only for the key word'), button: L3("Tugma — keyingi qadam, matndan keyin", 'Кнопка — следующий шаг, после текста', 'Button: the next step, after the text') }
  }
};
