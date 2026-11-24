const C = {
  s1: {
    eyebrow: L3('Kirish', 'Начало', 'Start'),
    say: L3("Salom! Kichik sinov. Agar o'z saytingiz bo'lsa, u nima haqida bo'lardi? O'yin klani, futbol jamoasi, bloger sahifasi yoki robotlar klubi? Bittasini bosing va qarang, nima bo'ladi.",
      'Привет! Маленькая проверка. Если бы у тебя был свой сайт, о чём бы он был? Клан в игре, футбольная команда, страница блогера или клуб роботов? Нажми на одно и смотри, что будет.',
      'Hi! A little test. If you had your own website, what would it be about? A gaming clan, a football team, a blogger page or a robot club? Tap one and watch what happens.'),
    wow: L3("Ana! Bir necha soniyada tayyor sayt: menyu, katta muqova, tugma, kartochkalar. Bitta ham kod yozilmadi. Boshqasini ham bosib ko'ring!",
      'Вот это да! Пара секунд — и готовый сайт: меню, большая обложка, кнопка, карточки. Ни строчки кода. Нажми и на другой!',
      'Wow! A couple of seconds and there’s a ready site: menu, big cover, button, cards. Not a single line of code. Try another one too!'),
    riddle: L3("Bu Tilda: sayt tayyor bloklardan yig'iladi. Bugun xuddi shunday saytni haqiqiy Tilda'da o'zingiz yasaysiz, va u internetda bo'ladi: do'stlaringiz telefonidan ochadi. Faqat bitta narsadan xavotirdaman: internetga chiqarish uchun pul to'lash va dasturchi chaqirish kerak bo'lsa-chi? Bu — bugungi topishmoq. Javobini dars oxirida bilib olamiz.",
      'Это Tilda: сайт собирается из готовых блоков. Сегодня ты сделаешь такой же сайт сам в настоящей Tilda, и он будет в интернете: друзья откроют его с телефона. Меня беспокоит одно: а вдруг чтобы выпустить сайт в интернет, нужно платить и звать программиста? Это сегодняшняя загадка. Ответ узнаем в конце урока.',
      'That’s Tilda: a site is built from ready blocks. Today you’ll make a site like this yourself in the real Tilda, and it’ll be online: your friends will open it on their phones. Only one thing worries me: what if going online means paying money and calling a programmer? That’s today’s riddle. We’ll find the answer at the end of the lesson.'),
    themes: [
      { k: 'game', chip: L3("O'yin klani", 'Клан в игре', 'Gaming clan'), name: 'Dragon Clan', h: L3("Bizning klanga qo'shil!", 'Вступай в наш клан!', 'Join our clan!'),
        btn: L3("Qo'shilish", 'Вступить', 'Join'), cards: [L3('Turnirlar', 'Турниры', 'Tournaments'), L3("O'yinchilar", 'Игроки', 'Players'), L3('Yutuqlar', 'Победы', 'Wins')] },
      { k: 'ball', chip: L3('Futbol jamoasi', 'Футбольная команда', 'Football team'), name: 'Chilonzor FC', h: L3("Har shanba — o'yin!", 'Каждую субботу — игра!', 'A match every Saturday!'),
        btn: L3('Jadval', 'Расписание', 'Schedule'), cards: [L3('Jamoa', 'Команда', 'Team'), L3('Hisoblar', 'Счёт', 'Scores'), L3('Rasmlar', 'Фото', 'Photos')] },
      { k: 'blog', chip: L3('Bloger sahifasi', 'Страница блогера', 'Blogger page'), name: 'Malika Vlog', h: L3("Har kuni yangi video", 'Каждый день новое видео', 'A new video every day'),
        btn: L3('Obuna bo\'lish', 'Подписаться', 'Subscribe'), cards: [L3('Videolar', 'Видео', 'Videos'), L3('Men haqimda', 'Обо мне', 'About me'), L3('Aloqa', 'Связь', 'Contact')] },
      { k: 'robot', chip: L3('Robotlar klubi', 'Клуб роботов', 'Robot club'), name: 'RoboKlub', h: L3("Robot yasashni o'rgan", 'Научись собирать роботов', 'Learn to build robots'),
        btn: L3('Yozilish', 'Записаться', 'Sign up'), cards: [L3("Mashg'ulotlar", 'Занятия', 'Classes'), L3('Robotlar', 'Роботы', 'Robots'), L3('Murabbiy', 'Тренер', 'Coach')] }
    ],
    likes: L3("{n} kishi ko'rdi", '{n} просмотров', '{n} views'),
    ask: L3("Qaysi sayt kerak? Bosing", 'Какой сайт нужен? Нажми', 'Which site do you need? Tap one'),
    askMore: L3("Boshqasini ham bosib ko'ring", 'Нажми и на другой', 'Try another one'),
    askDone: L3('Topishmoq: saytni internetga chiqarish pullikmi?', 'Загадка: выпустить сайт в интернет — платно?', 'Riddle: is putting a site online paid?')
  },
  s2: {
    eyebrow: L3('Tilda nima?', 'Что такое Tilda?', 'What is Tilda?'),
    say: L3("Tilda — sayt konstruktori, ya'ni saytni tayyor bo'laklardan yig'adigan joy. Bu bo'laklar bloklar deyiladi. Qarang, robotlar maktabi sayti qanday bo'laklarga ajraladi.",
      'Tilda — конструктор сайтов, то есть место, где сайт собирают из готовых частей. Эти части называются блоками. Смотри, на какие части распадается сайт школы роботов.',
      'Tilda is a website builder, that is, a place where a site is put together from ready parts. These parts are called blocks. Watch how the robot school site splits into parts.'),
    steps: [
      L3("Tepada menyu, keyin katta muqova, keyin matn, rasmlar, forma va eng pastda podval. Har bir blok — saytning bitta qismi.",
        'Сверху меню, потом большая обложка, потом текст, картинки, форма и в самом низу подвал. Каждый блок — одна часть сайта.',
        'At the top a menu, then a big cover, then text, pictures, a form and at the very bottom a footer. Each block is one part of the site.'),
      L3("Siz tayyor blokni kutubxonadan olasiz, ichidagi matn va rasmni o'zgartirasiz. Kodni Tilda o'zi yozadi, siz uni ko'rmaysiz ham.",
        'Ты берёшь готовый блок из библиотеки и меняешь в нём текст и картинку. Код Tilda пишет сама, ты его даже не видишь.',
        'You take a ready block from the library and change its text and picture. Tilda writes the code itself; you don’t even see it.')
    ],
    help: [
      L3("Saytga qarang: u bir-birining ostidagi bloklardan iborat.", 'Посмотри на сайт: он сложен из блоков друг под другом.', 'Look at the site: it’s made of blocks stacked one under another.'),
      L3("Blok — saytning tayyor qismi: menyu, muqova, matn, forma.", 'Блок — готовая часть сайта: меню, обложка, текст, форма.', 'A block is a ready part of a site: a menu, cover, text, form.'),
      L3("Xuddi konstruktor kabi: tayyor detallardan uy quriladi.", 'Как конструктор: дом собирают из готовых деталей.', 'Like a building set: you build a house from ready pieces.')
    ],
    ask: L3("Sayt bloklarga qanday ajralishini kuzating", 'Смотри, как сайт делится на блоки', 'Watch how the site splits into blocks'),
    askDone: L3("Sayt — bloklardan", 'Сайт — из блоков', 'A site is made of blocks')
  },
  s4: {
    eyebrow: L3("Tilda'ni topamiz", 'Находим Tilda', 'Finding Tilda'),
    say: L3("Avval Tilda'ni topamiz. Telefonda yoki kompyuterda brauzerni ochasiz, masalan Chrome. Qidiruv qatorini bosib, tilda deb yozamiz. Kuzating.",
      'Сначала найдём Tilda. Открываешь браузер на телефоне или компьютере, например Chrome. Нажимаем на строку поиска и пишем tilda. Смотри.',
      'First let’s find Tilda. You open a browser on your phone or computer, for example Chrome. We tap the search bar and type tilda. Watch.'),
    steps: [
      L3("tilda deb yozdik. Endi «Qidirish» ni bosamiz.", 'Написали tilda. Теперь нажимаем «Найти».', 'We typed tilda. Now we tap “Search”.'),
      L3("Mana natijalar. Bizga birinchisi kerak: Tilda Publishing, manzili tilda.cc. Manzilga qarang: aynan tilda.cc bo'lsin. Shuni bosamiz.",
        'Вот результаты. Нам нужен первый: Tilda Publishing, адрес tilda.cc. Смотри на адрес: должен быть именно tilda.cc. Нажимаем его.',
        'Here are the results. We need the first one: Tilda Publishing, address tilda.cc. Check the address: it must be exactly tilda.cc. We tap it.'),
      L3("Mana Tilda sayti! Telefonda menyu ustma-ust turadi, kompyuterda esa tepada bir qatorda. Lekin ikkalasida ham ikki kerakli tugma bor: «Войти» — kirish va «Регистрация» — ro'yxatdan o'tish. Tilda rus yoki ingliz tilida, so'zlar tarjimasini har bir topshiriqda beraman.",
        'Вот сайт Tilda! На телефоне меню идёт столбиком, а на компьютере — в одну строку вверху. Но и там, и там есть две нужные кнопки: «Войти» и «Регистрация».',
        'Here’s the Tilda site! On a phone the menu is stacked, on a computer it’s one row at the top. But both have the two buttons we need: “Log in” and “Sign up”.'),
      L3("Keyingi safar qidirmasdan, manzil qatoriga darhol tilda.cc yozsangiz ham bo'ladi. Hech narsa o'rnatilmaydi, faqat elektron pochta kerak.",
        'В следующий раз можно не искать, а сразу написать tilda.cc в строке адреса. Ничего не устанавливается, нужна только электронная почта.',
        'Next time you can skip the search and type tilda.cc straight into the address bar. Nothing gets installed; you only need an email address.')
    ],
    help: [
      L3("Kuzating: qidiruv → tilda → «Qidirish» → birinchi natija.", 'Следи: поиск → tilda → «Найти» → первый результат.', 'Watch: search → tilda → “Search” → the first result.'),
      L3("Kerakli manzil — tilda.cc. Boshqa manzilli saytlar Tilda emas.", 'Нужный адрес — tilda.cc. Сайты с другим адресом — не Tilda.', 'The right address is tilda.cc. Sites with other addresses aren’t Tilda.'),
      L3("Xuddi YouTube'ni qidirgandek: nomini yozasiz va birinchi natijani bosasiz.", 'Как найти YouTube: пишешь название и жмёшь первый результат.', 'Like finding YouTube: type the name and tap the first result.')
    ],
    ask: L3("Tilda qanday topilishini kuzating", 'Смотри, как найти Tilda', 'Watch how to find Tilda'),
    askDone: L3('Qidiruv → tilda → tilda.cc', 'Поиск → tilda → tilda.cc', 'Search → tilda → tilda.cc')
  },
  s5: {
    eyebrow: L3('Cookie oynasi', 'Окно cookies', 'The cookie window'),
    say: L3("Saytga birinchi kirganda pastda shunday oyna chiqadi. Bu cookie haqida, ya'ni sayt brauzeringizda saqlaydigan kichik ma'lumotlar. Qaysi tugmani bossangiz ham, sayt ishlaydi. Ortiqcha ma'lumot bermaslik uchun «Отклонить все», ya'ni hammasini rad etishni tanlash yaxshiroq. Oynani yoping.",
      'Когда впервые заходишь на сайт, внизу появляется такое окно. Оно про cookies, то есть маленькие данные, которые сайт хранит в браузере. Какую кнопку ни нажми, сайт будет работать. Чтобы не отдавать лишнего, лучше выбрать «Отклонить все». Закрой окно.',
      'The first time you visit the site, a window like this appears at the bottom. It’s about cookies, that is, small bits of data the site keeps in your browser. Whichever button you tap, the site works. To share less, it’s better to choose “Decline all”. Close the window.'),
    ask: L3("Cookie oynasini yoping", 'Закрой окно cookies', 'Close the cookie window'),
    hints: [
      L3("Oyna sahifaning pastida.", 'Окно внизу страницы.', 'The window is at the bottom of the page.'),
      L3("Unda qora tugmalar bor.", 'В нём чёрные кнопки.', 'It has black buttons.'),
      L3("«Отклонить все» ni bosing.", 'Нажми «Отклонить все».', 'Tap “Decline all”.')
    ],
    okDecline: L3("To'g'ri tanlov! Sayt ishlayveradi, ortiqcha ma'lumot esa ketmaydi.", 'Верный выбор! Сайт работает, а лишние данные не уходят.', 'Good choice! The site works and no extra data is shared.'),
    okAccept: L3("Mayli, sayt ishlaydi. Keyingi safar «Отклонить все» ni bossangiz, ortiqcha ma'lumot ketmaydi.", 'Ладно, сайт работает. В следующий раз нажми «Отклонить все» — тогда лишние данные не уйдут.', 'Okay, the site works. Next time tap “Decline all” and no extra data will be shared.')
  },
  s6: {
    eyebrow: L3("Ro'yxatdan o'tish", 'Регистрация', 'Signing up'),
    say: L3("Endi akkaunt ochamiz. Tepadagi «Регистрация» tugmasini bosing.", 'Теперь заведём аккаунт. Нажми вверху «Регистрация».', 'Now let’s make an account. Tap “Sign up” at the top.'),
    ask: L3("«Регистрация» (ro'yxatdan o'tish) ni bosing", 'Нажми «Регистрация»', 'Tap “Sign up”'),
    wrong: L3("«Войти» — bor akkauntga kirish uchun. Bizda hali akkaunt yo'q: «Регистрация» kerak.", '«Войти» — чтобы войти в уже готовый аккаунт. У нас его пока нет: нужна «Регистрация».', '“Log in” is for an account you already have. We don’t have one yet: we need “Sign up”.'),
    hints: [
      L3("Tugma sahifaning tepasida, o'ngda.", 'Кнопка вверху страницы, справа.', 'The button is at the top of the page, on the right.'),
      L3("U ramkali, ikkinchi tugma.", 'Она в рамке, вторая.', 'It’s the second one, with a frame.'),
      L3("«Регистрация» ni bosing.", 'Нажми «Регистрация».', 'Tap “Sign up”.')
    ],
    ok: L3("Barakalla! Ro'yxatdan o'tish formasi ochildi.", 'Точно! Открылась форма регистрации.', 'Exactly! The sign-up form opened.')
  },
  s7: {
    eyebrow: L3('Forma', 'Форма', 'The form'),
    say: L3("Formada uchta maydon bor: ism, elektron pochta va parol. Bu yerda — mashq, shuning uchun haqiqiy parolingizni yozmang, o'ylab toping. Parol ishonchli bo'lishi uchun pastdagi uchta shart yashil bo'lsin. Keyin «Зарегистрироваться» ni bosing.",
      'В форме три поля: имя, электронная почта и пароль. Здесь тренировка, поэтому настоящий пароль не пиши, придумай. Чтобы пароль был надёжным, пусть три условия внизу станут зелёными. Потом нажми «Зарегистрироваться».',
      'The form has three fields: name, email and password. This is practice, so don’t type your real password; make one up. For a safe password, get the three conditions below to turn green. Then tap “Sign up”.'),
    ask: L3("Formani to'ldiring va «Зарегистрироваться» ni bosing", 'Заполни форму и нажми «Зарегистрироваться»', 'Fill in the form and tap “Sign up”'),
    practice: L3("Mashq: haqiqiy parolingizni yozmang", 'Тренировка: настоящий пароль не пиши', 'Practice: don’t type your real password'),
    rules: [L3('Kamida 8 belgi', 'Не меньше 8 знаков', 'At least 8 characters'), L3('Harf va raqam bor', 'Есть буквы и цифры', 'Has letters and numbers'), L3('Belgi bor: ! _ ? #', 'Есть знак: ! _ ? #', 'Has a symbol: ! _ ? #')],
    msgs: {
      name: L3("Ism maydoni bo'sh. Ismingizni yozing.", 'Поле имени пустое. Напиши имя.', 'The name field is empty. Type your name.'),
      mail: L3("Pochta noto'g'ri. To'g'ri pochtada @ belgisi va nuqtali nom bor, masalan kodi@gmail.com.", 'Почта неправильная. В правильной почте есть значок @ и название с точкой, например kodi@gmail.com.', 'The email is wrong. A correct email has an @ sign and a name with a dot, like kodi@gmail.com.'),
      pass: L3("Parol hali ishonchsiz. Pastdagi uchta shart yashil bo'lsin.", 'Пароль пока ненадёжный. Пусть все три условия внизу станут зелёными.', 'The password isn’t safe yet. Get all three conditions below to turn green.')
    },
    hints: [
      L3("Uchta maydonni tepadan pastga to'ldiring.", 'Заполни три поля сверху вниз.', 'Fill in the three fields from top to bottom.'),
      L3("Pochta @ bilan bo'ladi, parol esa uzun, harf, raqam va belgi bilan.", 'В почте есть @, а пароль длинный, с буквами, цифрами и знаком.', 'The email has @, and the password is long, with letters, numbers and a symbol.'),
      L3("Masalan: ism Kodi, pochta kodi@gmail.com, parol Robot_Klub27. Keyin «Зарегистрироваться».", 'Например: имя Коди, почта kodi@gmail.com, пароль Robot_Klub27. Потом «Зарегистрироваться».', 'For example: name Kodi, email kodi@gmail.com, password Robot_Klub27. Then “Sign up”.')
    ],
    ok: L3("Ajoyib, akkaunt tayyor! Bitta qoida: parolni hech kimga aytmang va hech qayerga yubormang, hatto chatga ham. Tilda darhol birinchi saytni yaratishni taklif qiladi.",
      'Отлично, аккаунт готов! Одно правило: пароль никому не говори и никуда не отправляй, даже в чат. Tilda сразу предлагает создать первый сайт.',
      'Great, the account is ready! One rule: never tell anyone your password and never send it anywhere, not even in a chat. Tilda right away offers to create your first site.')
  },
  s8: {
    eyebrow: L3('Loyiha yaratamiz', 'Создаём проект', 'Creating a project'),
    say: L3("Ro'yxatdan o'tgach, Tilda shu oynani ochadi. Tilda'da sayt loyiha deyiladi. «Заголовок» maydoniga loyiha nomini yozing, masalan, «Robotlar klubi». Keyin «Создать» ni bosing.",
      'После регистрации Tilda открывает такое окно. Сайт в Tilda называется проектом. Напиши в поле «Заголовок» название проекта, например «Клуб роботов». Потом нажми «Создать».',
      'After signing up, Tilda opens this window. In Tilda a site is called a project. Type the project name in the “Title” field, for example “Robot club”. Then tap “Create”.'),
    ask: L3("Loyiha nomini yozing va «Создать» (yaratish) ni bosing", 'Напиши название проекта и нажми «Создать»', 'Type the project name and tap “Create”'),
    empty: L3("Nom bo'sh qoldi. Loyiha nomini yozing.", 'Название пустое. Напиши название проекта.', 'The name is empty. Type the project name.'),
    hints: [
      L3("«Заголовок» ostidagi chiziqqa yozing.", 'Пиши на линии под «Заголовок».', 'Type on the line under “Title”.'),
      L3("Nom faqat Tilda ichida ko'rinadi, istalganini yozsa bo'ladi.", 'Название видно только внутри Tilda, можно написать любое.', 'The name is only seen inside Tilda; you can type any.'),
      L3("Masalan, «Robotlar klubi» deb yozing va «Создать» ni bosing.", 'Например, напиши «Клуб роботов» и нажми «Создать».', 'For example, type “Robot club” and tap “Create”.')
    ],
    ph: L3('Robotlar klubi', 'Клуб роботов', 'Robot club'),
    ok: L3("Loyiha tayyor! Loyiha — bu butun sayt, ya'ni papka kabi: ichiga sahifalar qo'shiladi. Qarang, Tilda unga o'zi internet manzil berdi. Lekin ichida hali bitta ham sahifa yo'q.", 'Проект готов! Проект — это весь сайт, как папка: внутрь добавляются страницы. Смотри, Tilda сама дала ему адрес в интернете. Но внутри пока ни одной страницы.', 'The project is ready! A project is the whole site, like a folder: pages go inside it. Look, Tilda gave it an internet address itself. But there isn’t a single page inside yet.')
  },
  s10: {
    eyebrow: L3('Birinchi sahifa', 'Первая страница', 'The first page'),
    say: L3("Loyihada hali sahifa yo'q. «Создать новую страницу», ya'ni yangi sahifa yaratish tugmasini bosing.", 'В проекте пока нет страниц. Нажми «Создать новую страницу».', 'The project has no pages yet. Tap “Create new page”.'),
    sayPick: L3("Tilda uch yo'l taklif qiladi: sun'iy intellekt, tayyor shablonlar yoki bo'sh sahifa. Bugun hammasini o'zimiz yig'amiz, shuning uchun «Пустая страница», ya'ni bo'sh sahifani tanlang.",
      'Tilda предлагает три пути: искусственный интеллект, готовые шаблоны или пустую страницу. Сегодня собираем всё сами, поэтому выбери «Пустая страница».',
      'Tilda offers three ways: artificial intelligence, ready templates or a blank page. Today we build everything ourselves, so pick “Blank page”.'),
    ask: L3("«Создать новую страницу» (yangi sahifa) ni bosing", 'Нажми «Создать новую страницу»', 'Tap “Create new page”'),
    askPick: L3("«Пустая страница» (bo'sh sahifa) ni tanlang", 'Выбери «Пустая страница»', 'Pick “Blank page”'),
    notAi: L3("Sun'iy intellekt bilan sahifani keyinroq sinab ko'ramiz. Hozir «Пустая страница» kerak.", 'Страницу с ИИ попробуем позже. Сейчас нужна «Пустая страница».', 'We’ll try a page with AI later. Right now we need “Blank page”.'),
    notTpl: L3("Bu tayyor bloklar to'plami. Bugun o'zimiz yig'amiz: «Пустая страница» ni tanlang.", 'Это набор готовых блоков. Сегодня собираем сами: выбери «Пустая страница».', 'That’s a set of ready blocks. Today we build ourselves: pick “Blank page”.'),
    hints: [
      L3("Loyihada sahifa yo'q. Yangi sahifa yaratadigan tugmani qidiring.", 'В проекте нет страниц. Найди кнопку, которая создаёт новую страницу.', 'The project has no pages. Find the button that creates a new page.'),
      L3("U to'q sariq va «+» belgisi bilan boshlanadi.", 'Она оранжевая и начинается со знака «+».', 'It’s orange and starts with a “+” sign.'),
      L3("«+ Создать новую страницу» ni bosing.", 'Нажми «+ Создать новую страницу».', 'Tap “+ Create new page”.')
    ],
    hintsB: [
      L3("Bugun sahifani o'zimiz yig'amiz: bo'shini tanlang.", 'Сегодня собираем страницу сами: выбери пустую.', 'Today we build the page ourselves: pick the empty one.'),
      L3("Bo'sh sahifa — chapdagi kartochka, ichida Tilda belgisi bor.", 'Пустая страница — левая карточка, в ней значок Tilda.', 'The blank page is the left card, with the Tilda sign in it.'),
      L3("«Пустая страница» kartochkasini bosing.", 'Нажми на карточку «Пустая страница».', 'Tap the “Blank page” card.')
    ],
    ok: L3("Barakalla! Bo'sh sahifa ochildi — bu Tilda muharriri. Telefonda tepada so'zlar o'rniga belgilar: uycha — loyihaga qaytish, uchburchak — sahifani ko'rish, strelkali bulut — internetga chiqarish. Pastda «ВСЕ БЛОКИ» — bloklar kutubxonasi.",
      'Точно! Открылась пустая страница — это редактор Tilda. На телефоне вверху вместо слов значки: домик — назад к проекту, треугольник — посмотреть страницу, облако со стрелкой — выпустить в интернет. Внизу «ВСЕ БЛОКИ» — библиотека блоков.',
      'Exactly! A blank page opened: this is the Tilda editor. On a phone, icons replace words at the top: the house goes back to the project, the triangle previews the page, the cloud with an arrow publishes. At the bottom, “All blocks” is the block library.')
  },
  s12: {
    eyebrow: L3("Muqova qo'yamiz", 'Ставим обложку', 'Adding a cover'),
    say: L3("Saytning birinchi qismi — muqova, ya'ni katta sarlavhali birinchi ekran. Uni kutubxonadan olamiz. «ВСЕ БЛОКИ» ni bosing.",
      'Первая часть сайта — обложка, то есть первый экран с большим заголовком. Возьмём её из библиотеки. Нажми «ВСЕ БЛОКИ».',
      'The first part of a site is the cover, that is, the first screen with a big title. We’ll take it from the library. Tap “All blocks”.'),
    sayCat: L3("Mana kutubxona. Chapda bo'limlar. «Обложка», ya'ni muqova bo'limini oching.", 'Вот библиотека. Слева разделы. Открой «Обложка».', 'Here’s the library. Sections are on the left. Open “Cover”.'),
    ask: L3("«ВСЕ БЛОКИ» (hamma bloklar) ni bosing", 'Нажми «ВСЕ БЛОКИ»', 'Tap “All blocks”'),
    askCat: L3("«Обложка» (muqova) bo'limini oching", 'Открой раздел «Обложка»', 'Open the “Cover” section'),
    wrongCat: L3("Bu bo'lim boshqa bloklar uchun. Bizga muqova kerak — «Обложка».", 'Этот раздел для других блоков. Нам нужна обложка — «Обложка».', 'That section is for other blocks. We need a cover: “Cover”.'),
    hints: [
      L3("Bloklar kutubxonasini ochadigan tugma sahifaning pastida.", 'Кнопка, которая открывает библиотеку блоков, — внизу страницы.', 'The button that opens the block library is at the bottom of the page.'),
      L3("U qora, ichida uch chiziq belgisi bor.", 'Она чёрная, в ней значок из трёх полосок.', 'It’s black, with a three-line icon.'),
      L3("«ВСЕ БЛОКИ» ni bosing.", 'Нажми «ВСЕ БЛОКИ».', 'Tap “All blocks”.')
    ],
    hintsB: [
      L3("Chapdagi ro'yxatda muqova bo'limini qidiring.", 'В списке слева найди раздел обложек.', 'In the list on the left, find the cover section.'),
      L3("Muqova — ro'yxatda birinchi.", 'Обложка — первая в списке.', 'Cover is first in the list.'),
      L3("«Обложка» ni bosing.", 'Нажми «Обложка».', 'Tap “Cover”.')
    ],
    ok: L3("Barakalla! Mana, muqovalar ro'yxati.", 'Точно! Вот список обложек.', 'Exactly! Here’s the list of covers.')
  },
  s13: {
    eyebrow: L3('Qulf nima degani?', 'Что значит замок?', 'What does the lock mean?'),
    say: L3("Qarang, ba'zi bloklarda qulf bor va ular xira. Qulf — bu blok faqat pullik tarifda, degani. Bepul akkauntda qulfsiz blokni olamiz. Qulfsiz muqovani tanlang.",
      'Смотри, у некоторых блоков замок, и они бледные. Замок значит, что блок есть только на платном тарифе. На бесплатном аккаунте берём блок без замка. Выбери обложку без замка.',
      'Look, some blocks have a lock and look pale. A lock means the block is only on a paid plan. On a free account we take a block without a lock. Pick a cover without a lock.'),
    ask: L3('Qulfsiz muqovani tanlang', 'Выбери обложку без замка', 'Pick a cover without a lock'),
    locked: L3("Bu blokda qulf bor — u faqat pullik tarifda. Qulfsiz muqovani tanlang.", 'У этого блока замок: он только на платном тарифе. Выбери обложку без замка.', 'This block has a lock: it’s only on a paid plan. Pick a cover without a lock.'),
    hints: [
      L3("Kartochkalar yozuviga qarang: qaysilarida «Доступно на платном тарифе» yo'q?", 'Посмотри на подписи карточек: у каких нет «Доступно на платном тарифе»?', 'Look at the card captions: which don’t say “Available on a paid plan”?'),
      L3("Qulfsiz bloklar yorqin, qulflilari xira.", 'Блоки без замка яркие, с замком — бледные.', 'Blocks without a lock are bright; locked ones are pale.'),
      L3("CR28 yoki CR31 ni tanlang — ularda qulf yo'q.", 'Выбери CR28 или CR31 — у них замка нет.', 'Pick CR28 or CR31: they have no lock.')
    ],
    ok: L3("Ajoyib, muqova sahifaga tushdi! Bitta blok bilan sahifa allaqachon saytga o'xshayapti.", 'Отлично, обложка встала на страницу! С одним блоком страница уже похожа на сайт.', 'Great, the cover is on the page! With one block the page already looks like a site.')
  },
  s14: {
    eyebrow: L3("Matnni o'zgartiramiz", 'Меняем текст', 'Changing the text'),
    say: L3("Lekin sarlavha hali birovniki, inglizcha. Tilda'da matnni to'g'ridan-to'g'ri sahifaning o'zida o'zgartirsa bo'ladi. Sarlavhani bosing va sayt nomini yozing.",
      'Но заголовок пока чужой, на английском. В Tilda текст меняют прямо на самой странице. Нажми на заголовок и напиши название сайта.',
      'But the title is still someone else’s, in English. In Tilda you change text right on the page itself. Tap the title and type the site’s name.'),
    ask: L3('Sarlavhani bosing va sayt nomini yozing', 'Нажми на заголовок и напиши название сайта', 'Tap the title and type the site name'),
    empty: L3("Sarlavha bo'sh qoldi. Sayt nomini yozing.", 'Заголовок пустой. Напиши название сайта.', 'The title is empty. Type the site’s name.'),
    same: L3("Bu hali eski inglizcha sarlavha. O'zingiznikini yozing.", 'Это всё ещё старый английский заголовок. Напиши свой.', 'That’s still the old English title. Type your own.'),
    ph: L3('Masalan: Robotlar klubi', 'Например: Клуб роботов', 'For example: Robot club'),
    hints: [
      L3("Muqovadagi katta yozuv atrofida punktir chiziq bor — uni bosing.", 'Вокруг большой надписи на обложке пунктир — нажми на неё.', 'There’s a dashed line around the big text on the cover: tap it.'),
      L3("Eski matnni o'chirib, o'z nomingizni yozing.", 'Сотри старый текст и напиши своё название.', 'Erase the old text and type your own name.'),
      L3("Masalan, «Robotlar klubi» deb yozing va «Tayyor» ni bosing.", 'Например, напиши «Клуб роботов» и нажми «Готово».', 'For example, type “Robot club” and tap “Done”.')
    ],
    ok: L3("Zo'r nom! Endi bu — sizning saytingiz.", 'Классное название! Теперь это твой сайт.', 'Cool name! Now this is your site.')
  },
  s15: {
    eyebrow: L3('Internetga chiqaramiz', 'Выпускаем в интернет', 'Going online'),
    say: L3("Eng qiziq joyi keldi. Esingizdami, men saytni internetga chiqarish uchun pul va dasturchi kerak deb qo'rqqan edim? Qani, tekshiramiz. Strelkali bulutni, ya'ni «Опубликовать» ni bosing.",
      'Настал самый интересный момент. Помнишь, я боялся, что для выпуска сайта в интернет нужны деньги и программист? Давай проверим. Нажми облако со стрелкой — «Опубликовать».',
      'Here comes the best part. Remember, I was afraid that putting a site online needs money and a programmer? Let’s check. Tap the cloud with an arrow: “Publish”.'),
    sayOpen: L3("Ana xolos! Na pul, na dasturchi kerak bo'ldi. Tilda saytga bepul manzil berdi. «Открыть страницу», ya'ni sahifani ochish tugmasini bosing.",
      'Вот и всё! Не понадобились ни деньги, ни программист. Tilda дала сайту бесплатный адрес. Нажми «Открыть страницу».',
      'That’s it! No money and no programmer needed. Tilda gave the site a free address. Tap “Open page”.'),
    ask: L3("«Опубликовать» (internetga chiqarish) ni bosing", 'Нажми «Опубликовать»', 'Tap “Publish”'),
    askOpen: L3("«Открыть страницу» (sahifani ochish) ni bosing", 'Нажми «Открыть страницу»', 'Tap “Open page”'),
    hints: [
      L3("Internetga chiqaradigan tugma muharrirning tepasida.", 'Кнопка, которая выпускает сайт в интернет, — вверху редактора.', 'The button that puts the site online is at the top of the editor.'),
      L3("U o'ng tomonda, to'q sariq; telefonda — strelkali bulut.", 'Она справа, оранжевая; на телефоне — облако со стрелкой.', 'It’s on the right, orange; on a phone it’s a cloud with an arrow.'),
      L3("«Опубликовать» ni bosing.", 'Нажми «Опубликовать».', 'Tap “Publish”.')
    ],
    hintsB: [
      L3("Oynada saytni ochadigan tugma bor.", 'В окне есть кнопка, которая открывает сайт.', 'The window has a button that opens the site.'),
      L3("U to'q sariq, manzil ostida.", 'Она оранжевая, под адресом.', 'It’s orange, under the address.'),
      L3("«Открыть страницу» ni bosing.", 'Нажми «Открыть страницу».', 'Tap “Open page”.')
    ],
    ok: L3("Mana u — sizning saytingiz, haqiqiy internet manzili bilan! Pastdagi «Made on Tilda» yozuvini ko'ryapsizmi? Bepul tarifda Tilda uni o'zi qo'shadi. Bu manzilni do'stlaringizga yuborsangiz, ular ham saytingizni ko'radi!",
      'Вот он — твой сайт с настоящим адресом в интернете! Видишь внизу надпись «Made on Tilda»? На бесплатном тарифе Tilda добавляет её сама. Отправь этот адрес друзьям — и они тоже увидят твой сайт!',
      'There it is, your site with a real internet address! See “Made on Tilda” at the bottom? On the free plan Tilda adds it itself. Send this address to your friends, and they’ll see your site too!'),
    askDone: L3('Sayt internetda!', 'Сайт в интернете!', 'The site is online!')
  },
  s16: {
    eyebrow: L3('Keyingi safar kirish', 'Как войти в следующий раз', 'Logging in next time'),
    say: L3("Ertaga saytni davom ettirmoqchi bo'lsangiz, tilda.cc ga kirib «Войти» ni bosasiz va pochta bilan parolni yozasiz. Ba'zan Tilda «Я не робот», ya'ni men robot emasman degan katakchani so'raydi. Pochta va parol yozilgan. Katakchani belgilang va «Войти» ni bosing.",
      'Если завтра захочешь продолжить сайт, зайдёшь на tilda.cc, нажмёшь «Войти» и напишешь почту и пароль. Иногда Tilda просит отметить «Я не робот». Почта и пароль уже введены. Отметь галочку и нажми «Войти».',
      'If you want to continue your site tomorrow, you go to tilda.cc, tap “Log in” and type your email and password. Sometimes Tilda asks you to tick “I’m not a robot”. The email and password are already typed. Tick the box and tap “Log in”.'),
    ask: L3("«Я не робот» ni belgilang va «Войти» (kirish) ni bosing", 'Отметь «Я не робот» и нажми «Войти»', 'Tick “I’m not a robot” and tap “Log in”'),
    noTick: L3("Avval «Я не робот» katakchasini belgilang.", 'Сначала отметь галочку «Я не робот».', 'First tick the “I’m not a robot” box.'),
    hints: [
      L3("Pochta va parol tayyor. Ularning ostida katakcha bor.", 'Почта и пароль готовы. Под ними квадратик.', 'The email and password are ready. There’s a box under them.'),
      L3("Katakchani bosing, keyin pastdagi tugmani.", 'Нажми на квадратик, потом на кнопку внизу.', 'Tap the box, then the button below.'),
      L3("«Я не робот» ni belgilang, keyin «Войти» ni bosing.", 'Отметь «Я не робот», потом нажми «Войти».', 'Tick “I’m not a robot”, then tap “Log in”.')
    ],
    ok: L3("Barakalla! Siz yana Tilda ichidasiz, loyihangiz o'z joyida. Parolni unutsangiz, «Забыли пароль?» havolasi yordam beradi.", 'Точно! Ты снова в Tilda, проект на месте. Если забудешь пароль, поможет ссылка «Забыли пароль?».', 'Exactly! You’re back in Tilda and your project is where you left it. If you forget your password, the “Forgot password?” link helps.')
  },
  s18: {
    eyebrow: L3("Haqiqiy Tilda'da", 'В настоящей Tilda', 'In the real Tilda'),
    say: L3("Endi eng muhimi: hammasini haqiqiy Tilda'da o'zingiz qiling. Pastdagi qadamlar bo'yicha boring. Sayt chiqqach, uning manzilini shu yerga yozing yoki qo'ying. Hozir imkon bo'lmasa, keyinroq qilasiz.",
      'Теперь самое главное: сделай всё сам в настоящей Tilda. Иди по шагам ниже. Когда сайт выйдет, напиши или вставь сюда его адрес. Если сейчас нет возможности, сделаешь позже.',
      'Now the most important part: do it all yourself in the real Tilda. Follow the steps below. When the site is out, type or paste its address here. If you can’t right now, you’ll do it later.'),
    steps: [
      L3("tilda.cc ni oching va «Регистрация» ni bosing.", 'Открой tilda.cc и нажми «Регистрация».', 'Open tilda.cc and tap “Sign up”.'),
      L3("Ism, pochta va ishonchli parol yozing.", 'Напиши имя, почту и надёжный пароль.', 'Type a name, email and safe password.'),
      L3("Loyiha yarating, keyin «Пустая страница».", 'Создай проект, потом «Пустая страница».', 'Create a project, then “Blank page”.'),
      L3("«ВСЕ БЛОКИ» → «Обложка» → qulfsiz blok.", '«ВСЕ БЛОКИ» → «Обложка» → блок без замка.', '“All blocks” → “Cover” → a block without a lock.'),
      L3("Sarlavhaga sayt nomini yozing.", 'Напиши в заголовке название сайта.', 'Type the site name in the title.'),
      L3("«Опубликовать» va manzilni ko'chirib oling.", '«Опубликовать» — и скопируй адрес.', '“Publish”, then copy the address.')
    ],
    ph: L3('masalan: brave-orange-robot.tilda.ws', 'например: brave-orange-robot.tilda.ws', 'for example: brave-orange-robot.tilda.ws'),
    check: L3('Tekshirish', 'Проверить', 'Check'),
    later: L3('Keyinroq qilaman', 'Сделаю позже', 'I’ll do it later'),
    ask: L3("Haqiqiy Tilda'da sayt chiqaring va manzilini yozing", 'Выпусти сайт в настоящей Tilda и напиши его адрес', 'Publish a site in the real Tilda and type its address'),
    bad: L3("Bu Tilda manziliga o'xshamaydi. Tilda manzili .tilda.ws bilan tugaydi, masalan brave-orange-robot.tilda.ws.", 'Это не похоже на адрес Tilda. Адрес Tilda заканчивается на .tilda.ws, например brave-orange-robot.tilda.ws.', 'That doesn’t look like a Tilda address. A Tilda address ends in .tilda.ws, like brave-orange-robot.tilda.ws.'),
    demo: L3("Bu darsdagi namuna manzil. O'zingiz chiqargan saytning manzilini yozing.", 'Это адрес-пример из урока. Напиши адрес сайта, который выпустил сам.', 'That’s the example address from the lesson. Type the address of the site you published yourself.'),
    ok: L3("Zo'r! Endi sizning haqiqiy saytingiz bor. Uni o'qituvchingizga va do'stlaringizga ko'rsating!", 'Супер! Теперь у тебя есть настоящий сайт. Покажи его учителю и друзьям!', 'Awesome! Now you have a real website. Show it to your teacher and friends!'),
    okLater: L3("Mayli. Uyda shu qadamlar bo'yicha qilib ko'ring: ular dars xulosasida ham bor.", 'Хорошо. Сделай дома по этим шагам: они есть и в выводе урока.', 'Okay. Try it at home with these steps: they’re also in the lesson summary.')
  },
  s19: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Topishmoqqa qaytamiz. Men saytni internetga chiqarish uchun pul va dasturchi kerak deb o'ylagan edim. Adashibman! «Опубликовать» ni bosish yetdi: Tilda bepul manzil berdi, sayt bir zumda internetda.",
        'Вернёмся к загадке. Я думал, что для выпуска сайта в интернет нужны деньги и программист. Ошибся! Хватило нажать «Опубликовать»: Tilda дала бесплатный адрес, и сайт сразу в интернете.',
        'Back to the riddle. I thought putting a site online needed money and a programmer. I was wrong! Tapping “Publish” was enough: Tilda gave a free address and the site was online instantly.') },
      { k: 'blocks', text: L3("Tilda — sayt konstruktori: sahifa tayyor bloklardan yig'iladi, matnni sahifaning o'zida o'zgartiramiz.", 'Tilda — конструктор сайтов: страницу собирают из готовых блоков, текст меняют прямо на странице.', 'Tilda is a website builder: a page is built from ready blocks, and text is changed right on the page.') },
      { k: 'account', text: L3("tilda.cc da «Регистрация» qilamiz, keyingi safar «Войти» bilan kiramiz. Parolni hech kimga aytmaymiz.", 'На tilda.cc делаем «Регистрацию», в следующий раз входим через «Войти». Пароль никому не говорим.', 'On tilda.cc we “Sign up”, and next time we “Log in”. We never tell anyone the password.') },
      { k: 'project', text: L3("Loyiha — butun sayt, sahifalar uning ichida. Qulfli bloklar — pullik, biz qulfsizlarini olamiz.", 'Проект — весь сайт, страницы внутри него. Блоки с замком — платные, мы берём без замка.', 'A project is the whole site; pages are inside it. Locked blocks are paid; we take the ones without a lock.') },
      { k: 'next', text: L3("Keyingi darsda bloklar bilan yaqinroq tanishamiz va saytni to'ldiramiz. Ko'rishguncha!", 'На следующем уроке поближе познакомимся с блоками и наполним сайт. До встречи!', 'Next lesson we’ll get to know blocks better and fill up the site. See you!') }
    ],
    roles: {
      blocks: L3("Sayt — bloklardan", 'Сайт — из блоков', 'A site is made of blocks'),
      account: L3("«Регистрация», keyin «Войти»", '«Регистрация», потом «Войти»', '“Sign up”, then “Log in”'),
      project: L3("Loyiha — papka, sahifa — varaq", 'Проект — папка, страница — лист', 'Project = folder, page = sheet'),
      riddle: L3("«Опубликовать» — bepul manzil", '«Опубликовать» — бесплатный адрес', '“Publish” gives a free address')
    },
    hw: L3("Haqiqiy Tilda'da birinchi sahifangizni chiqaring va manzilini o'qituvchiga yuboring", 'Выпусти первую страницу в настоящей Tilda и отправь адрес учителю', 'Publish your first page in the real Tilda and send the address to your teacher'),
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your site')
  }
};
