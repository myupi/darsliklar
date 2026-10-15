// =============================================================================
// ===== ТЕСТОВЫЙ УРОК · «HTML: загляни внутрь страницы — эксперимент» =========
//
// ЗАЧЕМ. Проверить, помогает ли объёмная модель документа (навык anatomy)
// ученику 11–14 лет понять, из чего состоит HTML-страница, самому выполнить
// задания и захотеть продолжить. Основа — урок 1 курса (Коди, цвета тегов,
// мини-браузер, код с цветными скобками, озвучка, подсказки), канон курса не
// тронут; урок лежит в разделе тестовых.
//
// МОДЕЛЬ. Открываемая коробка: html — внешняя коробка с крышкой; внутри два
// отделения — head (сведения о странице; в нём карточка title) и body (то,
// что видно на странице; в нём лист с текстом). Передняя стенка отделения —
// его закрывающая граница: так показан закрывающий тег. Модель показывает
// только вложенность; рядом всегда обычный мини-браузер и настоящий код.
//
// ВОСЕМЬ ЭТАПОВ: 1 «Это будет твоя страница» → 2 «Загляни внутрь» →
// 3 «Предскажи изменение» → 4 «Собери документ» → 5 «Помоги Коди
// разобраться» → 6 «Твоя лаборатория» → 7 «Теперь самостоятельно» →
// 8 «Моя первая страница».
//
// ЖУРНАЛ (log канона, строка на screenId): первая попытка, число попыток,
// глубина подсказок (hints), была ли подробная помощь (helped) и результат
// нового примера после неё (followUp). Этап 7 пишет по строке на задачу.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you». Файл собирается скриптом
// tools/anatomy/zaglyani.build.mjs; правится этот исходник и фигура
// tools/anatomy/zaglyani.figures.mjs.
// =============================================================================

const META = {
  lessonId: 'test-html-zaglyani-vnutr',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'HTML: sahifa ichiga qarang — tajriba',
    ru: 'HTML: загляни внутрь страницы — эксперимент',
    en: 'HTML: look inside a page — experiment'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    out[l] = s;
  });
  return out;
};

const SAMPLE = {
  title: L3('Mening saytim', 'Мой первый сайт', 'My first site'),
  text: L3('Salom! Bu mening sahifam.', 'Привет! Это моя страница.', 'Hello! This is my page.')
};

const UI = {
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  page: L3('Sahifa', 'Страница', 'Page'),
  model: L3('Model', 'Модель', 'Model'),
  browser: L3('Brauzer', 'Браузер', 'Browser'),
  inspector: L3('Tuzilma tekshiruvi', 'Проверка структуры', 'Structure check'),
  headInfo: L3('Sahifa haqida ma’lumot — sahifada ko‘rinmaydi', 'Сведения о странице — на странице не видны', 'Information about the page — not shown on the page'),
  reset: L3('Namunani qaytarish', 'Вернуть пример', 'Restore the example'),
  open: L3('Ichiga qarash', 'Заглянуть внутрь', 'Look inside'),
  intoHtml: L3('html ichiga', 'внутрь html', 'into html'),
  intoHead: L3('head ichiga', 'внутрь head', 'into head'),
  intoBody: L3('body ichiga', 'внутрь body', 'into body'),
  pieces: L3('Qismlar', 'Детали', 'Pieces'),
  places: L3('Qayerga?', 'Куда?', 'Where?'),
  pickPiece: L3('Avval qismni tanlang', 'Сначала выбери деталь', 'Choose a piece first'),
  hint: L3('Maslahat', 'Подсказка', 'Hint'),
  ready: L3('Sahifa tayyor', 'Страница готова', 'The page is ready'),
  saveNote: L3('U darsni tugatganingizda saqlanadi.', 'Она сохранится, когда ты завершишь урок.', 'It will be saved when you finish the lesson.'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  step: L3('Vazifa', 'Задача', 'Task'),
  again: L3('Yana bir misol', 'Ещё один пример', 'One more example'),
  piece: {
    head: '<head>…</head>',
    body: '<body>…</body>',
    title: '<title>…</title>'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплики Коди звучат; подписи (eyebrow, ask, hint1, hint2, btn …)
// печатаются. Реплики короткие: понятное действие не ждёт длинной речи.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // ── 1. ЭТО БУДЕТ ТВОЯ СТРАНИЦА ────────────────────────────────────────────
  s1: {
    eyebrow: L3('Sizning sahifangiz', 'Твоя страница', 'Your page'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men Kodiman. Mana oddiy sahifa: yorliqda nomi, sahifada salom.',
        'Привет! Я Коди. Вот простая страница: на вкладке название, на странице приветствие.',
        'Hi! I am Kodi. Here is a simple page: a name on the tab and a greeting on the page.') },
      { pose: 'curious', text: L3('O‘zingiznikini yasashni xohlaysizmi? Avval ichiga qaraymiz va nima nimaga javob berishini bilamiz.',
        'Хочешь сделать свою? Сначала заглянем внутрь и узнаем, что за что отвечает.',
        'Want to make your own? First let us look inside and find out what does what.') }
    ],
    opened: L3('Mana sahifa ichi: katta quti html, ichida head va body bo‘limlari.',
      'Вот что внутри страницы: большая коробка html, а в ней отделения head и body.',
      'This is what is inside the page: a big html box with the head and body sections in it.'),
    ask: L3('Hujjat ichiga qarang', 'Загляни внутрь документа', 'Look inside the document'),
    askDone: L3('Ichi ochildi — keyingi qadamda har bir qismni ko‘ramiz', 'Документ открыт — дальше разберём каждую часть', 'The document is open: next we explore each part')
  },

  // ── 2. ЗАГЛЯНИ ВНУТРЬ ─────────────────────────────────────────────────────
  s2: {
    eyebrow: L3('Ichiga qarang', 'Загляни внутрь', 'Look inside'),
    say: L3('Har bir qismni bosing: modelda, kodda yoki pastdagi tugmada.',
      'Нажимай на части: в модели, в коде или на кнопках внизу.',
      'Tap the parts: in the model, in the code or on the buttons below.'),
    parts: {
      html: L3('html — tashqi quti. U hujjatning barcha qismlarini birlashtiradi: ichida head va body.',
        'html — внешняя коробка. Она объединяет все части документа: внутри неё head и body.',
        'html is the outer box. It holds all parts of the document together: head and body are inside it.'),
      head: L3('head — sahifa haqidagi ma’lumot bo‘limi. Bu ma’lumot sahifaning o‘zida ko‘rinmaydi.',
        'head — отделение сведений о странице. Сами эти сведения на странице не видны.',
        'head is the section with information about the page. That information is not shown on the page itself.'),
      title: L3('title head ichida turadi. Uning matni — brauzer yorlig‘idagi nom.',
        'title лежит внутри head. Его текст — это название на вкладке браузера.',
        'title sits inside head. Its text is the name on the browser tab.'),
      body: L3('body — mazmun bo‘limi. Undagi hamma narsa sahifada ko‘rinadi.',
        'body — отделение содержимого. Всё, что лежит в нём, видно на странице.',
        'body is the content section. Everything in it shows on the page.')
    },
    done: L3('Tushunarli: html ichida head va body, title esa head ichida. Istagan qismni yana bosishingiz mumkin.',
      'Итак: внутри html — head и body, а title — внутри head. Можно нажимать части ещё раз.',
      'So: head and body are inside html, and title is inside head. You can tap the parts again.'),
    ask: L3('html, head, title va body ni oching', 'Открой html, head, title и body', 'Open html, head, title and body')
  },

  // ── 3. ПРЕДСКАЖИ ИЗМЕНЕНИЕ ────────────────────────────────────────────────
  s3: {
    eyebrow: L3('Oldindan ayting', 'Предскажи', 'Predict'),
    rounds: {
      title: { part: 'title', want: 'tab', text: L3('Kosmos', 'Космос', 'Space'), extra: L3('Futbol', 'Футбол', 'Football'),
        say: L3('Men title ichidagi matnni o‘zgartiraman. Yangi nom qayerda paydo bo‘ladi?',
          'Я изменю текст внутри title. Где появится новое название?',
          'I will change the text inside title. Where will the new name appear?') },
      body: { part: 'body', want: 'page', text: L3('Bugun men HTML o‘rganyapman', 'Сегодня я учу HTML', 'Today I am learning HTML'), extra: L3('Men futbolni yaxshi ko‘raman', 'Я люблю футбол', 'I love football'),
        say: L3('Endi body ichidagi matnni o‘zgartiraman. U qayerda paydo bo‘ladi?',
          'Теперь изменю текст внутри body. Где он появится?',
          'Now I will change the text inside body. Where will it appear?') }
    },
    okTab: L3('To‘g‘ri! title yorliqni o‘zgartirdi, sahifa o‘sha-o‘sha qoldi.', 'Верно! title изменил вкладку, а страница осталась прежней.', 'Right! title changed the tab, and the page stayed the same.'),
    okPage: L3('To‘g‘ri! body ichidagi matn sahifada paydo bo‘ldi, yorliq o‘zgarmadi.', 'Верно! Текст из body появился на странице, а вкладка не изменилась.', 'Right! The text from body appeared on the page, and the tab did not change.'),
    missTab: L3('Qarang: title dagi matn yorliqqa tushdi, sahifa o‘zgarmadi. title — yorliq nomi. Yana bir misol bilan tekshiring.',
      'Смотри: текст из title попал на вкладку, а страница не изменилась. title — это название вкладки. Проверь себя ещё на одном примере.',
      'Look: the text from title went to the tab, and the page did not change. title is the tab name. Check yourself with one more example.'),
    missPage: L3('Qarang: body dagi matn sahifada paydo bo‘ldi. body — sahifada ko‘rinadigan narsa. Yana bir misol bilan tekshiring.',
      'Смотри: текст из body появился на странице. body — это то, что видно на странице. Проверь себя ещё на одном примере.',
      'Look: the text from body appeared on the page. body is what you see on the page. Check yourself with one more example.'),
    done: L3('Endi bilasiz: title — yorliq uchun, body — sahifa uchun.', 'Теперь ты знаешь: title — для вкладки, body — для страницы.', 'Now you know: title is for the tab, body is for the page.'),
    askTitle: L3('title ichida «{t}» bo‘ladi. Yangi nom qayerda paydo bo‘ladi?', 'В title будет «{t}». Где появится новое название?', 'title will say “{t}”. Where will the new name appear?'),
    askBody: L3('body ichida «{t}» bo‘ladi. Bu matn qayerda paydo bo‘ladi?', 'В body будет «{t}». Где появится этот текст?', 'body will say “{t}”. Where will this text appear?')
  },

  // ── 4. СОБЕРИ ДОКУМЕНТ ────────────────────────────────────────────────────
  s4: {
    eyebrow: L3('Hujjatni yig‘ing', 'Собери документ', 'Build the document'),
    say: L3('Qismlar tarqalib ketdi. Qismni tanlang, keyin uning joyini tanlang. Qismni sudrab olib borish ham mumkin.',
      'Части рассыпались. Выбери деталь, потом выбери место. Деталь можно и перетащить.',
      'The parts fell apart. Choose a piece, then choose its place. You can also drag a piece.'),
    ok: {
      head: L3('head html ichida. Kodda uning ikki qatori paydo bo‘ldi.', 'head внутри html. В коде появились его строки.', 'head is inside html. Its lines appeared in the code.'),
      body: L3('body ham html ichida. Endi u head dan keyin turibdi.', 'body тоже внутри html. В коде он стоит после head.', 'body is inside html too. In the code it comes after head.'),
      title: L3('title head ichida — kodda ham, modelda ham.', 'title внутри head — и в модели, и в коде.', 'title is inside head, in the model and in the code.')
    },
    titleHtml: L3('title — sahifa haqidagi ma’lumot. U to‘g‘ridan-to‘g‘ri html ga emas, head bo‘limiga qo‘yiladi.', 'title — сведения о странице. Его кладут не прямо в html, а в отделение head.', 'title is information about the page. It goes into the head section, not straight into html.'),
    titleBody: L3('body dagi hamma narsa sahifada ko‘rinadi. title esa yorliq nomi — uning joyi head da.', 'Всё, что в body, видно на странице. А title — название вкладки, его место в head.', 'Everything in body shows on the page. title is the tab name: its place is in head.'),
    nested: L3('head va body — ikki alohida bo‘lim. Ikkalasi ham to‘g‘ridan-to‘g‘ri html ichida turadi.', 'head и body — два отдельных отделения. Оба лежат прямо внутри html.', 'head and body are two separate sections. Both sit right inside html.'),
    noPlace: L3('Bu joy hali yo‘q: avval kerakli bo‘limni qo‘ying.', 'Этого места пока нет: сначала поставь нужное отделение.', 'That place does not exist yet: place the section first.'),
    done: L3('Tuzilma yig‘ildi! Qarang: bo‘limlar qutiga qanday joylashgan bo‘lsa, kod qatorlari ham shunday joylashgan.',
      'Структура собрана! Посмотри: как отделения вложены в коробку, так и строки вложены в код.',
      'The structure is built! Look: the lines in the code are nested just like the sections in the box.'),
    ask: L3('Qismni tanlang, keyin joyini', 'Выбери деталь, потом место', 'Choose a piece, then its place'),
    askDone: L3('Yig‘ildi: model va kodni solishtiring', 'Собрано: сравни модель и код', 'Built: compare the model and the code'),
    askPlace: L3('Endi joyni tanlang', 'Теперь выбери место', 'Now choose the place')
  },

  // ── 5. ПОМОГИ КОДИ РАЗОБРАТЬСЯ ────────────────────────────────────────────
  s5: {
    eyebrow: L3('Kodiga yordam', 'Помоги Коди', 'Help Kodi'),
    say: L3('Men hujjatni shoshib yozdim va nimanidir chalkashtirdim. Tekshiruv paneli qaysi qoida bajarilmaganini ko‘rsatadi.',
      'Я собирал документ в спешке и кое-что перепутал. Панель проверки показывает, какое правило не выполнено.',
      'I built the document in a hurry and mixed something up. The check panel shows which rule is not met.'),
    rules: {
      inHtml: L3('Hamma narsa html ichida', 'Всё лежит внутри html', 'Everything is inside html'),
      titleHead: L3('title — head ichida', 'title — внутри head', 'title is inside head'),
      bodyClosed: L3('body yopilgan', 'body закрыт', 'body is closed'),
      headClosed: L3('head yopilgan', 'head закрыт', 'head is closed')
    },
    move: L3('title ni head ga o‘tkazing: title ni bosing, keyin head ni', 'Перенеси title в head: нажми title, потом head', 'Move title into head: tap title, then head'),
    moveTarget: L3('Endi title qayerga borishi kerak?', 'Теперь — куда должен попасть title?', 'Now, where should title go?'),
    moveOk: L3('title head da. Ikkinchi qoida bajarildi.', 'title в head. Второе правило выполнено.', 'title is in head. The second rule is met.'),
    moveBody: L3('title body da edi — sahifada ko‘rinadigan joyda. Uni head ga o‘tkazamiz.', 'title уже был в body, где всё видно на странице. Его место — head.', 'title was already in body, where everything shows on the page. Its place is head.'),
    moveHtml: L3('To‘g‘ridan-to‘g‘ri html ga emas: title ni head bo‘limiga qo‘yamiz.', 'Не прямо в html: title кладут в отделение head.', 'Not straight into html: title goes into the head section.'),
    pickTitle: L3('Avval title ni tanlang.', 'Сначала выбери title.', 'Choose title first.'),
    type: L3('Endi body yopilmagan: oldingi devori yo‘q. Bo‘sh qatorga body ning yopuvchi tegini yozing.',
      'Теперь видно: у body нет передней стенки — он не закрыт. Допиши закрывающий тег body в пустую строку.',
      'Now you can see that body has no front wall: it is not closed. Type the closing body tag in the empty line.'),
    typeAsk: L3('Bo‘sh qatorga body ning yopuvchi tegini yozing', 'Допиши закрывающий тег body в пустую строку', 'Type the closing body tag in the empty line'),
    typeAskHead: L3('Bo‘sh qatorga head ning yopuvchi tegini yozing', 'Допиши закрывающий тег head в пустую строку', 'Type the closing head tag in the empty line'),
    typeHead: L3('Yana bitta: bu hujjatda head yopilmagan. Yopuvchi tegini yozing.', 'Ещё один: в этом документе не закрыт head. Допиши его закрывающий тег.', 'One more: in this document head is not closed. Type its closing tag.'),
    typeOk: L3('body yopildi! Yopuvchi teg qism qayerda tugashini ko‘rsatadi.', 'body закрыт! Закрывающий тег показывает, где часть заканчивается.', 'body is closed! A closing tag shows where a part ends.'),
    typeOkHead: L3('head ham yopildi. html, head, title va body da yopuvchi teglar bor.', 'head тоже закрыт. У html, head, title и body есть закрывающие теги.', 'head is closed too. html, head, title and body all have closing tags.'),
    noSlash: L3('Bu ochuvchi teg. Yopuvchida «<» dan keyin qiya chiziq turadi.', 'Это открывающий тег. В закрывающем сразу после «<» стоит косая черта.', 'That is an opening tag. In a closing tag a slash comes right after “<”.'),
    wrongName: L3('Chiziq bor, endi teg nomi kerakli bo‘lsin: {tag}.', 'Черта есть, теперь нужно правильное имя тега: {tag}.', 'The slash is there; now the tag name must be right: {tag}.'),
    noGt: L3('Tegni «>» burchagi bilan yoping.', 'Закрой тег уголком «>».', 'Close the tag with “>”.'),
    ask: L3('Panel bo‘yicha xatoni tuzating', 'Исправь то, что показывает панель', 'Fix what the panel shows')
  },

  // ── 6. ТВОЯ ЛАБОРАТОРИЯ ───────────────────────────────────────────────────
  s6: {
    eyebrow: L3('Laboratoriya', 'Лаборатория', 'Lab'),
    say: L3('Bu yerda xohlagancha tajriba qiling. title va body ichidagi matnni o‘zgartiring.',
      'Здесь экспериментируй сколько хочешь. Меняй текст внутри title и внутри body.',
      'Experiment here as much as you like. Change the text inside title and inside body.'),
    sawTitle: L3('Yorliq o‘zgardi — buni title qildi.', 'Вкладка изменилась — это сделал title.', 'The tab changed: title did that.'),
    sawBody: L3('Sahifa o‘zgardi — buni body qildi.', 'Страница изменилась — это сделал body.', 'The page changed: body did that.'),
    done: L3('Ajoyib tajriba! Kod, model va natija bir xil o‘zgaradi.', 'Отличный эксперимент! Код, модель и результат меняются вместе.', 'Great experiment! The code, the model and the result change together.'),
    ask: L3('title va body ichidagi matnni o‘zgartiring', 'Измени текст внутри title и внутри body', 'Change the text inside title and inside body')
  },

  // ── 7. ТЕПЕРЬ САМОСТОЯТЕЛЬНО ──────────────────────────────────────────────
  s7: {
    eyebrow: L3('Mustaqil', 'Самостоятельно', 'On your own'),
    say: L3('Endi o‘zingiz. To‘rtta qisqa vazifa. Maslahat kerak bo‘lsa — chiroqchani bosing.',
      'Теперь сам. Четыре короткие задачи. Если нужна подсказка — нажми лампочку.',
      'Now on your own. Four short tasks. If you need a hint, tap the light bulb.'),
    tasks: {
      goal: {
        ask: L3('Maqsad: yorliqda «Mening mushugim» bo‘lsin. Koddagi qaysi joyni o‘zgartirasiz? Shu joyni bosing.', 'Цель: на вкладке — «Мой кот». Какое место в коде изменить? Нажми на него.', 'Goal: the tab says “My cat”. Which place in the code do you change? Tap it.'),
        askB: L3('Maqsad: sahifada «Mushugim uxlayapti» bo‘lsin. Qaysi joyni o‘zgartirasiz?', 'Цель: на странице — «Мой кот спит». Какое место изменить?', 'Goal: the page says “My cat is sleeping”. Which place do you change?'),
        hint1: L3('Yorliq nomini qaysi teg beradi?', 'Какой тег задаёт название вкладки?', 'Which tag sets the tab name?'),
        hint2: L3('title teglari orasidagi matnni bosing.', 'Нажми на текст между тегами title.', 'Tap the text between the title tags.'),
        hint1B: L3('Sahifada nima ko‘rinadi?', 'Что видно на странице?', 'What shows on the page?'),
        hint2B: L3('body ichidagi matnni bosing.', 'Нажми на текст внутри body.', 'Tap the text inside body.'),
        tag: L3('Bu teg — u qism chegarasini belgilaydi. Teg emas, matn o‘zgaradi.', 'Это тег — он отмечает границу части. Менять нужно текст, а не тег.', 'That is a tag: it marks where a part begins or ends. We change the text, not the tag.'),
        otherText: L3('Bu matn boshqa joyda ko‘rinadi. Maqsadga qarang.', 'Этот текст виден в другом месте. Посмотри на цель.', 'This text shows somewhere else. Look at the goal.'),
        ok: L3('Ha, shu joy.', 'Да, это место.', 'Yes, that place.')
      },
      where: {
        ask: L3('Yangi title kartochkasi. Uni qaysi bo‘limga qo‘yasiz?', 'Новая карточка title. В какое отделение её положить?', 'A new title card. Which section does it go in?'),
        askB: L3('Sahifa matni bo‘lgan varaq. Uni qayerga qo‘yasiz?', 'Лист с текстом страницы. Куда его положить?', 'A sheet with the page text. Where does it go?'),
        hint1: L3('title sahifada emas, yorliqda ko‘rinadi.', 'title виден не на странице, а на вкладке.', 'title shows on the tab, not on the page.'),
        hint2: L3('Sahifa haqidagi ma’lumot bo‘limi — head.', 'Отделение сведений о странице — head.', 'The section with page information is head.'),
        hint1B: L3('Bu matn sahifada ko‘rinishi kerak.', 'Этот текст должен быть виден на странице.', 'This text has to show on the page.'),
        hint2B: L3('Sahifada ko‘rinadigan hamma narsa body da.', 'Всё, что видно на странице, — в body.', 'Everything shown on the page is in body.'),
        ok: L3('To‘g‘ri bo‘lim.', 'Верное отделение.', 'The right section.')
      },
      build: {
        ask: L3('Asosiy tuzilmani tartib bilan yig‘ing: qatorlarni yuqoridan pastga bosing.', 'Собери основную структуру: нажимай строки по порядку, сверху вниз.', 'Build the main structure: tap the lines in order, from top to bottom.'),
        askB: L3('Faqat head qismini yig‘ing.', 'Собери только часть head.', 'Build just the head part.'),
        hint1: L3('Avval tashqi quti ochiladi, oxirida yopiladi.', 'Внешняя коробка открывается первой и закрывается последней.', 'The outer box opens first and closes last.'),
        hint2: L3('html ichida avval head (ochiladi va yopiladi), keyin body.', 'Внутри html сначала head (открыть и закрыть), потом body.', 'Inside html: first head (open and close), then body.'),
        ok: L3('Tuzilma to‘g‘ri.', 'Структура верная.', 'The structure is right.')
      },
      close: {
        ask: L3('body ni qaysi teg yopadi?', 'Какой тег закрывает body?', 'Which tag closes body?'),
        askB: L3('head ni qaysi teg yopadi?', 'Какой тег закрывает head?', 'Which tag closes head?'),
        hint1: L3('Yopuvchi tegda qiya chiziq bor.', 'В закрывающем теге есть косая черта.', 'A closing tag has a slash.'),
        hint2: L3('Qiya chiziq va o‘sha nom: body.', 'Косая черта и то же имя: body.', 'A slash and the same name: body.'),
        hint2B: L3('Qiya chiziq va o‘sha nom: head.', 'Косая черта и то же имя: head.', 'A slash and the same name: head.'),
        ok: L3('Ha, yopuvchi teg.', 'Да, это закрывающий тег.', 'Yes, that is the closing tag.')
      }
    },
    labels: {
      goal: L3('Maqsad bo‘yicha joy', 'Место изменения по цели', 'Place to change for a goal'),
      where: L3('title qayerda', 'Где лежит title', 'Where title lives'),
      build: L3('Asosiy tuzilma', 'Основная структура', 'Main structure'),
      close: L3('Ochuvchi va yopuvchi teg', 'Открывающий и закрывающий тег', 'Opening and closing tag')
    },
    selfNote: L3('★ — maslahatsiz', '★ — без подсказок', '★ — without hints'),
    again: L3('Yaxshi! Endi shunga o‘xshash misolni o‘zingiz bajaring.', 'Хорошо! Теперь похожий пример — сам.', 'Good! Now a similar example on your own.'),
    done: L3('To‘rttala vazifa bajarildi! Siz hujjat tuzilishini tushunasiz.', 'Все четыре задачи решены! Ты разбираешься в структуре документа.', 'All four tasks are done! You understand the document structure.'),
    ask: L3('Mustaqil vazifalar', 'Самостоятельные задачи', 'Tasks on your own')
  },

  // ── 8. МОЯ ПЕРВАЯ СТРАНИЦА ────────────────────────────────────────────────
  s8: {
    eyebrow: L3('Birinchi sahifam', 'Моя первая страница', 'My first page'),
    say: L3('Endi o‘z sahifangiz. O‘z nomingizni va matningizni yozing.', 'Теперь твоя страница. Напиши своё название и свой текст.', 'Now your own page. Write your own name and your own text.'),
    askWrite: L3('Nom va matn yozing', 'Напиши название и текст', 'Write a name and a text'),
    showTitle: L3('Kodda ko‘rsating: yorliq nomi qayerdan keldi?', 'Покажи в коде: откуда взялось название вкладки?', 'Show in the code: where did the tab name come from?'),
    showBody: L3('Sahifa matni-chi? Uni kodda ko‘rsating.', 'А текст страницы? Покажи его в коде.', 'And the page text? Show it in the code.'),
    foundTitle: L3('Siz title ni topdingiz va yorliq nomini o‘zgartirdingiz.', 'Ты нашёл title и изменил название вкладки.', 'You found title and changed the tab name.'),
    foundBody: L3('Sahifa matni body ichida — buni ham o‘zingiz yozdingiz.', 'А текст страницы лежит внутри body — его ты тоже написал сам.', 'And the page text is inside body: you wrote that yourself too.'),
    notTitle: L3('Bu yorliqqa emas. Yorliq nomi qaysi teg ichida?', 'Это не для вкладки. Внутри какого тега название вкладки?', 'That is not for the tab. Which tag holds the tab name?'),
    notBody: L3('Sahifada ko‘rinadigan matnni toping.', 'Найди текст, который виден на странице.', 'Find the text that shows on the page.'),
    bye: L3('Birinchi sahifangiz tayyor. Keyingi darsda unga sarlavha va xatboshilar qo‘shamiz!', 'Твоя первая страница готова. На следующем уроке добавим на неё заголовки и абзацы!', 'Your first page is ready. Next lesson we add headings and paragraphs to it!'),
    next: L3('Sarlavhalar va xatboshilar', 'Заголовки и абзацы', 'Headings and paragraphs'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
    ask: L3('O‘z sahifangizni yarating', 'Сделай свою страницу', 'Make your page')
  }
};

/*@HELPERS@*/

// ═════════════════════════════════════════════════════════════════════════════
// ФИГУРА (навык anatomy): модель документа. SVG посчитан при сборке.
// ═════════════════════════════════════════════════════════════════════════════
/*@FIGURES@*/

const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const tagWord = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const useShake = () => {
  const [shake, setShake] = useState(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const wobble = useCallback((k) => { setShake(k); setTimeout(() => { if (alive.current) setShake(null); }, 420); }, []);
  return [shake, wobble, alive];
};
function useRec(id) {
  const store = useStore();
  const [rec, setRec] = useState(() => store.get(id) || null);
  const put = useCallback((v) => { store.set(id, v); setRec(v); }, [id, store]);
  return [rec, put, store];
}
function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const lab = store.get('lab');
  if (!lab) return null;
  return { type: 'html-page', title: lab.title, text: lab.text, html: buildHtml(lab.title, lab.text) };
}
// Текст листа body — в две строки (на модели лист узкий).
function twoLines(s) {
  const w = String(s || '').trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return [w.join(' '), ''];
  let best = 1, diff = 1e9;
  for (let i = 1; i < w.length; i += 1) {
    const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
    if (d < diff) { diff = d; best = i; }
  }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}
const docTexts = (title, text) => { const [a, b] = twoLines(text); return { title, page1: a, page2: b }; };

// Фигура. Экран задаёт состояние, фигура только рисует:
//   texts · parts { ключ: on|ghost|off } · lit [ключи] · move { ключ: величина } ·
//   led [ключи] · shake { k, n } · onPick(ключ) · pickable [ключи].
function Fig({ texts, parts, lit, move, led, shake, onPick, pickable, cls, label }) {
  const F = FIG;
  const pick = usePick();
  const ref = useRef(null);
  const html = useMemo(() => ({ __html: F.svg }), [F]);
  const pos = useRef(null);
  const want = useRef(move || {});
  want.current = move || {};
  const raf = useRef(0);
  const q = (sel) => (ref.current ? ref.current.querySelectorAll(sel) : []);
  const place = () => {
    Object.keys(pos.current).forEach((k) => {
      const ax = F.axes[k];
      if (!ax) return;
      const v = pos.current[k];
      q('[data-move="' + k + '"]').forEach((g) => g.setAttribute('transform', 'translate(' + (ax[0] * v).toFixed(2) + ' ' + (ax[1] * v).toFixed(2) + ')'));
    });
  };
  useLayoutEffect(() => {
    pos.current = Object.assign({}, move || {});
    place();
    return () => cancelAnimationFrame(raf.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const moveKey = JSON.stringify(move || {});
  useEffect(() => {
    if (!pos.current) return undefined;
    const calm = reduceMotion();
    let last = 0;
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      let moving = false;
      Object.keys(want.current).forEach((k) => {
        const w = want.current[k];
        const v = pos.current[k] === undefined ? w : pos.current[k];
        const nv = calm ? w : v + (w - v) * (1 - Math.exp(-dt / 0.18));
        pos.current[k] = Math.abs(w - nv) < 0.05 ? w : nv;
        if (pos.current[k] !== w) moving = true;
      });
      place();
      raf.current = moving ? requestAnimationFrame(tick) : 0;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [moveKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const textKey = JSON.stringify(texts || {});
  useLayoutEffect(() => {
    const t = texts || {};
    q('[data-t]').forEach((n) => {
      const k = n.getAttribute('data-t');
      if (t[k] === undefined) return;
      n.textContent = t[k];
      // Длинный текст сжимается до ширины карточки, а не вылезает за неё.
      const fit = Number(n.getAttribute('data-fit'));
      n.removeAttribute('textLength');
      n.removeAttribute('lengthAdjust');
      if (fit && t[k] && n.getComputedTextLength && n.getComputedTextLength() > fit) {
        n.setAttribute('textLength', String(fit));
        n.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
  }, [textKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const partKey = JSON.stringify(parts || {});
  useLayoutEffect(() => {
    const ps = parts || {};
    q('[data-part]').forEach((g) => {
      const st = ps[g.getAttribute('data-part')];
      if (st && st !== 'on') g.setAttribute('data-state', st); else g.removeAttribute('data-state');
    });
  }, [partKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const litKey = (lit || []).join(',');
  useLayoutEffect(() => {
    const on = lit || [];
    q('[data-sel]').forEach((g) => {
      const yes = on.indexOf(g.getAttribute('data-sel')) >= 0;
      g.classList.toggle('is-lit', yes);
      const solid = g.querySelector(':scope > .iso-solid');
      if (solid) { if (yes) solid.setAttribute('data-lit', ''); else solid.removeAttribute('data-lit'); }
    });
  }, [litKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const ledKey = (led || []).join(',') + '|' + (pickable || []).join(',') + '|' + !!onPick;
  useLayoutEffect(() => {
    q('[data-hit]').forEach((g) => {
      const k = g.getAttribute('data-hit');
      g.classList.toggle('is-led', (led || []).indexOf(k) >= 0);
      g.classList.toggle('is-pick', !!onPick && (!pickable || pickable.indexOf(k) >= 0));
    });
  }, [ledKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shake || !shake.k) return undefined;
    const els = q('[data-shake="' + shake.k + '"]');
    els.forEach((g) => { g.classList.remove('fx-shake'); void g.getBoundingClientRect(); g.classList.add('fx-shake'); });
    const t = setTimeout(() => els.forEach((g) => g.classList.remove('fx-shake')), 520);
    return () => clearTimeout(t);
  }, [shake && shake.n]); // eslint-disable-line react-hooks/exhaustive-deps

  const click = (e) => {
    if (!onPick) return;
    const g = e.target.closest && e.target.closest('[data-hit]');
    if (!g) return;
    const k = g.getAttribute('data-hit');
    if (pickable && pickable.indexOf(k) < 0) return;
    onPick(k);
  };
  return <div ref={ref} className={'fig iso' + (cls ? ' ' + cls : '')} data-theme="light" style={{ '--ar': F.ar }} role="img"
    aria-label={label ? pick(label) : undefined} onClick={click} dangerouslySetInnerHTML={html} />;
}

// Состояние модели по умолчанию: коробка открыта, всё на месте.
const OPEN_PARTS = { lid: 'off', slots: 'off', 'title-stray': 'off' };
const LID_UP = () => FIG.open.lid;
const DROP = () => FIG.open.drop;

// Кнопки частей: имя тега + цвет + форма. Для клавиатуры и для тех, кому
// неудобно попадать в модель.
function PartChips({ items, onPick, sel, seen, disabled, led, cls }) {
  return (
    <div className={'chips' + (cls ? ' ' + cls : '')} translate="no">
      {items.map((k) => (
        <button key={k} type="button" disabled={disabled} onClick={() => onPick(k)} style={{ '--c': TAGC[k] || T.ink2 }}
          className={'chip mono' + (sel === k ? ' is-sel' : '') + (seen && seen.indexOf(k) >= 0 ? ' is-seen' : '')}>
          <span className="chip-mark" aria-hidden="true">{seen && seen.indexOf(k) >= 0 ? <Icon name="check" size={12} /> : null}</span>
          {k}
          <Led on={!!led && led.indexOf(k) >= 0} />
        </button>
      ))}
    </div>
  );
}

// Строка задания: при затруднении на её место встаёт подсказка.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}

// =============================================================================
// 1. ЭТО БУДЕТ ТВОЯ СТРАНИЦА — готовая страница и закрытая модель.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const opened = !!(rec && rec.open);
  const [speaker, , spoken, sayNow] = useVoice(opened ? [{ text: c.opened, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(opened, spoken);
  const led = useIdleLed(canTap && !opened, 0);
  const [stage, setStage] = useState(opened ? 3 : 0);   // 0 закрыт · 1 крышка · 2 отделения · 3 title
  useEffect(() => {
    if (!opened || stage >= 3) return undefined;
    const t = setTimeout(() => setStage((s) => s + 1), reduceMotion() ? 0 : 520);
    return () => clearTimeout(t);
  }, [opened, stage]);
  const open = () => {
    if (opened || !canTap) return;
    sfx('pop', true);
    put({ open: true });
    setStage(1);
    sayNow(c.opened, 'wonder');
  };
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={opened ? c.askDone : c.ask} />
      <div className="duo">
        <MiniBrowser title={t} page={x} />
        <Fig texts={docTexts(t, x)} onPick={opened ? null : open} led={led ? ['lid'] : []}
          parts={{ lid: stage >= 2 ? 'off' : 'on', slots: 'off', 'title-stray': 'off', head: stage >= 2 ? 'on' : 'off', body: stage >= 2 ? 'on' : 'off', 'title-card': stage >= 3 ? 'on' : 'off' }}
          move={{ lid: stage >= 1 ? LID_UP() : 0, head: stage >= 2 ? 0 : DROP(), body: stage >= 2 ? 0 : DROP(), 'title-card': stage >= 3 ? 0 : DROP() }}
          cls={'fig-s1' + (stage === 1 ? ' is-lifting' : '')} label={c.ask} />
      </div>
      {!opened ? (
        <button type="button" className={'bigbtn' + (led ? ' is-led' : '')} disabled={!canTap} onClick={open}>
          <span className="bigbtn-in"><Icon name="eye" size={20} />{pick(UI.open)}</span>
          <Led on={led} />
        </button>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 2. ЗАГЛЯНИ ВНУТРЬ — исследование: часть ↔ код ↔ браузер.
// =============================================================================
const PARTS4 = ['html', 'head', 'title', 'body'];
const LINE_PART = { doctype: null, 'html-o': 'html', 'html-c': 'html', 'head-o': 'head', 'head-c': 'head', title: 'title', 'body-o': 'body', text: 'body', 'body-c': 'body' };
const HIT_PART = { html: 'html', lid: 'html', head: 'head', body: 'body', title: 'title', page: 'body' };
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const [seen, setSeen] = useState(() => (rec && rec.seen) || []);
  const done = PARTS4.every((k) => seen.indexOf(k) >= 0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [cur, setCur] = useState(null);
  const led = useIdleLed(canTap && !done, seen.length);
  const choose = (k) => {
    if (!canTap || !k) return;
    sfx('tap', true);
    setCur(k);
    const next = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(next);
    if (!done && PARTS4.every((x) => next.indexOf(x) >= 0)) { put({ seen: next }); sayNow(joinL(c.parts[k], c.done), 'cheer'); }
    else sayNow(c.parts[k], k === 'title' ? 'point' : 'explain');
  };
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const lit = cur === 'html' ? ['html', 'html-close'] : cur === 'head' ? ['head', 'head-close'] : cur === 'body' ? ['body', 'body-close', 'page'] : cur === 'title' ? ['title'] : [];
  const left = PARTS4.filter((k) => seen.indexOf(k) < 0);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} n={seen.length + '/4'} />
      <div className="ex">
        <Fig texts={docTexts(t, x)} parts={OPEN_PARTS} lit={lit} onPick={(h) => choose(HIT_PART[h])}
          move={{ lid: LID_UP(), head: cur === 'head' ? 5 : 0, body: cur === 'body' ? 5 : 0, 'title-card': cur === 'title' ? 7 : 0 }}
          led={led ? left.map((k) => (k === 'html' ? 'html' : k)) : []} label={c.ask} />
        <div className="ex-side">
          <MiniBrowser title={t} page={x} compact hl={cur === 'title' ? 'title' : cur === 'body' ? 'body' : cur === 'html' ? 'html' : null} />
          {cur === 'head' ? <p className="note-line"><Icon name="doc" size={15} />{pick(UI.headInfo)}</p> : null}
          <CodeLines lines={buildLines(FULL_DOC, { title: t, text: x })} hl={cur} className="cv-ex"
            lineProps={(ln) => (LINE_PART[ln.id] ? { onTap: () => choose(LINE_PART[ln.id]), disabled: !canTap } : null)} />
        </div>
      </div>
      <PartChips items={PARTS4} onPick={choose} sel={cur} seen={seen} disabled={!canTap} led={led ? left : null} />
    </Stage>
  );
}

// =============================================================================
// 3. ПРЕДСКАЖИ ИЗМЕНЕНИЕ — сначала ответ, потом изменение и «провод».
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  // Очередь раундов: title, body; промах добавляет такой же раунд с новым текстом.
  const [queue, setQueue] = useState(() => (solved ? [] : [{ k: 'title', v: 'text' }, { k: 'body', v: 'text' }]));
  const [doneRounds, setDoneRounds] = useState(0);
  const round = queue[0] || null;
  const R = round ? c.rounds[round.k] : null;
  const [vals, setVals] = useState(() => (solved && rec.vals) || { title: pick(SAMPLE.title), text: pick(SAMPLE.text) });
  const [answered, setAnswered] = useState(null);           // 'tab' | 'page' после ответа
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [wire, setWire] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.rounds.title.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stats = useRef({ title: { tries: 0, miss: 0, extra: null }, body: { tries: 0, miss: 0, extra: null } });
  const wrapRef = useRef(null);
  const tabRef = useRef(null), pageRef = useRef(null);
  const zones = useRef({});
  const regZone = (z, el) => { zones.current[z] = el; };
  const newText = round ? pick(round.v === 'extra' ? R.extra : R.text) : '';

  const answer = (where) => {
    if (!canTap || !round || answered) return;
    const k = round.k;
    const st = stats.current[k];
    st.tries += 1;
    const right = where === R.want;
    setAnswered(where);
    setVals((v) => (k === 'title' ? Object.assign({}, v, { title: newText }) : Object.assign({}, v, { text: newText })));
    setFlash((f) => (R.want === 'tab' ? { tab: f.tab + 1, page: f.page } : { tab: f.tab, page: f.page + 1 }));
    setWire((n) => n + 1);
    if (round.v === 'extra') st.extra = right;
    if (right) {
      sfx('ok', true);
      sayNow(R.want === 'tab' ? c.okTab : c.okPage, 'smile');
    } else {
      st.miss += 1;
      sfx('soft', true);
      sayNow(R.want === 'tab' ? c.missTab : c.missPage, 'rule');
    }
    setTimeout(() => {
      setQueue((q) => {
        const rest = q.slice(1);
        if (!right && round.v !== 'extra') rest.unshift({ k, v: 'extra' });
        if (!rest.length) finish();
        else setTimeout(() => sayNow(c.rounds[rest[0].k].say, 'curious'), 50);
        return rest;
      });
      setDoneRounds((n) => n + 1);
      setAnswered(null);
    }, reduceMotion() ? 1400 : 2600);
  };
  const finish = () => {
    const s = stats.current;
    ['title', 'body'].forEach((k) => log({ screenId: 's3.' + k, type: 'predict', correct: true, firstTry: s[k].miss === 0,
      attempts: s[k].tries, hints: 0, helped: s[k].miss > 0, followUp: s[k].extra }));
    log({ screenId: 's3', type: 'predict', correct: true, firstTry: s.title.miss + s.body.miss === 0, attempts: s.title.tries + s.body.tries });
    put({ done: true, vals });
    setTimeout(() => sayNow(c.done, 'cheer'), 2400);
  };
  const askText = round ? fillL(round.k === 'title' ? c.askTitle : c.askBody, { t: newText }) : c.done;
  const hlLine = round && !answered ? round.k : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={round ? (doneRounds + 1) + '/' + (doneRounds + queue.length) : null} />
      <div className="pr3" ref={wrapRef}>
        <MiniBrowser title={vals.title} page={vals.text} tabRef={tabRef} pageRef={pageRef} flashTab={flash.tab} flashPage={flash.page} typed={!!answered} />
        <CodeLines lines={buildLines(FULL_DOC, vals)} hl={hlLine} regZone={regZone} className="cv-pr" />
        <Fig texts={docTexts(vals.title, vals.text)} parts={OPEN_PARTS} move={{ lid: LID_UP() }} cls="fig-mini"
          lit={answered && round ? (round.k === 'title' ? ['title'] : ['page']) : []} />
        <Wire wrapRef={wrapRef} on={!!answered} nonce={wire} color={round && round.k === 'title' ? TAGC.title : TAGC.body}
          from={() => zones.current[round && round.k === 'title' ? 'title-text' : 'body-text']}
          to={() => (round && R.want === 'tab' ? tabRef.current : pageRef.current)} />
      </div>
      {round ? (
        <div className="where" role="group">
          {['tab', 'page'].map((w) => (
            <button key={w} type="button" disabled={!canTap || !!answered}
              className={'where-b' + (answered === w ? (w === R.want ? ' is-ok' : ' is-miss') : '') + (answered && w === R.want && answered !== w ? ' is-real' : '')}
              onClick={() => answer(w)}>
              <span className={'where-ic where-' + w} aria-hidden="true" />
              {pick(w === 'tab' ? UI.tab : UI.page)}
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 4. СОБЕРИ ДОКУМЕНТ — деталь → место (или перетаскивание).
// =============================================================================
const PIECES = ['head', 'body', 'title'];
function docOf(placed, vals) {
  const has = (k) => placed.indexOf(k) >= 0;
  const order = ['doctype', 'html-o'];
  if (has('head')) { order.push('head-o'); if (has('title')) order.push('title'); order.push('head-c'); }
  if (has('body')) order.push('body-o', 'text', 'body-c');
  order.push('html-c');
  return buildLines(order, vals);
}
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [placed, setPlaced] = useState(solved ? PIECES.slice() : []);
  const placedRef = useRef(placed);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [newest, setNewest] = useState(null);
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [chipShake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !solved, placed.length * 10 + (sel ? 1 : 0));
  const vals = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };
  const has = (k) => placed.indexOf(k) >= 0;

  const placeIt = (piece, place) => {
    if (!canTap || !piece || has(piece)) return;
    if (!place) return;
    tries.current += 1;
    const cur = placedRef.current;
    const ok = (piece === 'head' || piece === 'body') ? place === 'html' : place === 'head';
    let why = null;
    if (!ok) {
      if (piece === 'title') why = place === 'html' ? c.titleHtml : place === 'body' ? c.titleBody : c.noPlace;
      else why = c.nested;
      if ((place === 'head' || place === 'body') && cur.indexOf(place) < 0) why = c.noPlace;
    }
    if (ok) {
      const next = cur.concat(piece);
      placedRef.current = next;
      setPlaced(next); setSel(null); setMsg(null); setNewest(piece);
      sfx('ok', true);
      if (next.length === PIECES.length) {
        put({ done: true });
        log({ screenId: 's4', type: 'assemble', correct: true, firstTry: misses.current === 0, attempts: tries.current, hints: 0 });
        sayNow(joinL(c.ok[piece], c.done), 'cheer');
      } else sayNow(c.ok[piece], 'smile');
      return;
    }
    misses.current += 1;
    sfx('soft', true);
    wobble(piece);
    setShake((s) => ({ k: place === 'html' ? 'body' : place, n: s.n + 1 }));
    setMsg(why);
    sayNow(why, 'think');
  };
  const pickPlace = (place) => { if (!sel) { setMsg(UI.pickPiece); return; } placeIt(sel, place); };
  const hitToPlace = (h) => ({ html: 'html', lid: 'html', head: 'head', body: 'body', title: 'head', page: 'body' }[h] || null);

  // Перетаскивание — дополнительный способ: деталь тянется за пальцем, место
  // определяется по тому, что под ним при отпускании.
  const drag = useRef(null);
  const [ghost, setGhost] = useState(null);
  const onDown = (e, piece) => {
    if (!canTap || has(piece)) return;
    drag.current = { piece, x: e.clientX, y: e.clientY, moved: false };
  };
  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) { d.moved = true; setSel(d.piece); }
      if (d.moved) setGhost({ piece: d.piece, x: e.clientX, y: e.clientY });
    };
    const up = (e) => {
      const d = drag.current;
      drag.current = null;
      if (!d || !d.moved) return;
      setGhost(null);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hit = el && el.closest && el.closest('[data-hit],[data-place]');
      if (!hit) return;
      const place = hit.getAttribute('data-place') || hitToPlace(hit.getAttribute('data-hit'));
      placeIt(d.piece, place);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  });

  const placesNow = ['html'].concat(has('head') ? ['head'] : []).concat(has('body') ? ['body'] : []);
  const ledPieces = led && !sel ? PIECES.filter((k) => !has(k)) : [];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={sel ? c.askPlace : c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.askDone : sel ? c.askPlace : c.ask} hint={solved ? null : msg} n={placed.length + '/3'} />
      <div className="ex">
        <Fig texts={docTexts(vals.title, vals.text)} onPick={(h) => pickPlace(hitToPlace(h))} pickable={sel ? ['html', 'head', 'body', 'title', 'page'] : []}
          parts={{ lid: 'off', 'title-stray': 'off', slots: placed.length < 2 ? 'on' : 'off', head: has('head') ? 'on' : 'off', body: has('body') ? 'on' : 'off', 'title-card': has('title') ? 'on' : 'off' }}
          move={{ lid: LID_UP(), head: has('head') ? 0 : DROP(), body: has('body') ? 0 : DROP(), 'title-card': has('title') ? 0 : DROP() }}
          lit={newest === 'head' ? ['head'] : newest === 'body' ? ['body'] : newest === 'title' ? ['title'] : []}
          shake={shake} led={led && sel ? placesNow : []} label={c.ask} />
        <CodeLines lines={docOf(placed, vals)} className="cv-ex"
          lineProps={(ln) => ({ cls: LINE_PART[ln.id] === newest ? 'is-new' : '' })} />
      </div>
      {!solved ? (
        <div className="build-row">
          <div className="pieces" role="group" aria-label={pick(UI.pieces)}>
            {PIECES.filter((k) => !has(k)).map((k) => (
              <button key={k} type="button" disabled={!canTap} style={{ '--c': TAGC[k] }}
                className={'piece mono' + (sel === k ? ' is-sel' : '') + (chipShake === k ? ' fx-no' : '')}
                onPointerDown={(e) => onDown(e, k)} onClick={() => { setSel(sel === k ? null : k); setMsg(null); }}
                aria-pressed={sel === k}>
                {UI.piece[k]}
                <Led on={ledPieces.indexOf(k) >= 0} />
              </button>
            ))}
          </div>
          <div className={'places' + (sel ? ' is-on' : '')} role="group" aria-label={pick(UI.places)}>
            {['html', 'head', 'body'].map((pl) => (
              <button key={pl} type="button" data-place={pl} disabled={!canTap || !sel || (pl !== 'html' && !has(pl))}
                className="place mono" style={{ '--c': TAGC[pl] }} onClick={() => pickPlace(pl)}>
                {pick(pl === 'html' ? UI.intoHtml : pl === 'head' ? UI.intoHead : UI.intoBody)}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {ghost ? <div className="drag-ghost mono" style={{ left: ghost.x, top: ghost.y, '--c': TAGC[ghost.piece] }}>{UI.piece[ghost.piece]}</div> : null}
    </Stage>
  );
}

// =============================================================================
// 5. ПОМОГИ КОДИ РАЗОБРАТЬСЯ — панель проверки структуры и две починки.
// =============================================================================
function Inspector({ rules }) {
  const pick = usePick();
  const firstOpen = rules.findIndex((r) => !r.ok);
  return (
    <div className={'insp' + (firstOpen < 0 ? ' insp-all' : '')} aria-live="polite">
      <span className="insp-h"><Icon name="listN" size={14} />{pick(UI.inspector)}</span>
      {rules.map((r, i) => (
        <span key={r.id} className={'insp-r' + (r.ok ? ' is-ok' : '') + (i === firstOpen ? ' is-now' : '')}>
          <span className="insp-ic">{r.ok ? <Icon name="check" size={13} /> : null}</span>
          {pick(r.text)}
        </span>
      ))}
    </div>
  );
}
const DOC5_BAD = ['doctype', 'html-o', 'head-o', 'head-c', 'body-o', 'title', 'text', 'html-c'];
const DOC5_GAP = ['doctype', 'html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', null, 'html-c'];
const DOC5_HEAD = ['doctype', 'html-o', 'head-o', 'title', null, 'body-o', 'text', 'body-c', 'html-c'];
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  // phase: move → type → (typeHead, если пришлось сильно помогать) → done
  const [phase, setPhase] = useState(solved ? 'done' : 'move');
  const [picked, setPicked] = useState(false);
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.typeOk : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const st = useRef({ moveTries: 0, typeTries: 0, typeMiss: 0, headExtra: null });
  const led = useIdleLed(canTap && !solved, (phase === 'move' ? (picked ? 1 : 0) : 5) + st.current.typeMiss * 10);
  const vals = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };
  const tag = phase === 'typeHead' ? 'head' : 'body';

  const target = (place) => {
    if (!canTap || phase !== 'move') return;
    if (!picked) { if (place === 'title') { setPicked(true); setMsg(c.moveTarget); sfx('tap', true); } else setMsg(c.pickTitle); return; }
    st.current.moveTries += 1;
    if (place === 'head') {
      sfx('ok', true);
      setPicked(false); setMsg(null);
      setPhase('type');
      sayNow(joinL(c.moveOk, c.type), 'smile');
      return;
    }
    if (place === 'title') return;
    sfx('soft', true);
    const m = place === 'body' ? c.moveBody : c.moveHtml;
    setMsg(m);
    setShake((s) => ({ k: place === 'html' ? 'body' : place, n: s.n + 1 }));
    sayNow(m, 'think');
  };
  const hitMap = { 'title': 'title', head: 'head', body: 'body', html: 'html', lid: 'html', page: 'body' };
  const lineTap = (id) => target({ title: 'title', 'head-o': 'head', 'head-c': 'head', 'body-o': 'body', text: 'body', 'html-o': 'html', 'html-c': 'html' }[id] || null);

  useEffect(() => {
    if (phase !== 'type' && phase !== 'typeHead') return undefined;
    const w = tagWord(val);
    const want = '</' + tag + '>';
    if (w === want) {
      sfx('win', true);
      setMsg(null);
      if (phase === 'typeHead') st.current.headExtra = true;
      if (phase === 'type' && st.current.typeMiss >= 2) {
        // Пришлось сильно помогать — ещё одна такая же починка с другим тегом.
        sayNow(joinL(c.typeOk, c.typeHead), 'smile');
        setTimeout(() => { setVal(''); setPhase('typeHead'); }, 900);
        return undefined;
      }
      setPhase('done');
      put({ done: true });
      const s = st.current;
      log({ screenId: 's5.move', type: 'fix-move', correct: true, firstTry: s.moveTries === 1, attempts: s.moveTries, hints: 0 });
      log({ screenId: 's5.close', type: 'fix-close', correct: true, firstTry: s.typeMiss === 0, attempts: s.typeTries + 1,
        hints: s.typeMiss, helped: s.typeMiss >= 2, followUp: s.headExtra });
      sayNow(phase === 'typeHead' ? c.typeOkHead : c.typeOk, 'cheer');
      return undefined;
    }
    if (!w) { setMsg(null); return undefined; }
    const t = setTimeout(() => {
      let m = null;
      if (w === '<' + tag + '>' || w === tag + '>' || w === '<' + tag) m = c.noSlash;
      else if (/^<\/[a-z]+>$/.test(w)) m = fillL(c.wrongName, { tag: '</' + tag + '>' });
      else if (w === '</' + tag) m = c.noGt;
      if (m) { st.current.typeTries += 1; st.current.typeMiss += 1; setMsg(m); sayNow(m, 'think'); }
    }, 1300);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps

  const moved = phase !== 'move';
  const bodyClosed = phase === 'done' || phase === 'typeHead';
  const headClosed = phase !== 'typeHead';
  const rules = [
    { id: 'in', ok: true, text: c.rules.inHtml },
    { id: 'th', ok: moved, text: c.rules.titleHead },
    { id: 'bc', ok: bodyClosed, text: c.rules.bodyClosed }
  ].concat(phase === 'typeHead' ? [{ id: 'hc', ok: false, text: c.rules.headClosed }] : []);
  const lines = buildLines(phase === 'move' ? DOC5_BAD : phase === 'type' ? DOC5_GAP : phase === 'typeHead' ? DOC5_HEAD : FULL_DOC, vals);
  const askText = phase === 'move' ? (picked ? c.moveTarget : c.move) : phase === 'type' ? c.typeAsk : phase === 'typeHead' ? c.typeAskHead : c.typeOk;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Inspector rules={rules} />
      <Ask text={askText} hint={msg} />
      <div className="ex ex-s5">
        <Fig texts={docTexts(vals.title, vals.text)} onPick={phase === 'move' ? (h) => target(hitMap[h]) : null}
          parts={{ lid: 'off', slots: 'off', 'title-stray': moved ? 'off' : 'on', 'title-card': moved ? 'on' : 'off', 'body-close': bodyClosed ? 'on' : 'ghost', 'head-close': headClosed ? 'on' : 'ghost' }}
          move={{ lid: LID_UP(), 'title-card': moved ? 0 : DROP(), 'title-stray': picked ? 8 : 0 }}
          lit={picked ? ['title'] : phase === 'type' ? ['body'] : phase === 'typeHead' ? ['head'] : []}
          shake={shake} led={led && phase === 'move' ? (picked ? ['head'] : ['title']) : []} label={askText} />
        <CodeLines lines={lines} className="cv-ex"
          lineProps={(ln, i) => {
            // При открытой клавиатуре дальние от пустой строки строки уходят (.is-ctx).
            const ctx = (phase === 'type' && i < 5) || (phase === 'typeHead' && (i < 2 || i > 5)) ? 'is-ctx' : '';
            if (ln.empty) {
              return { cls: 'is-gap', empty: (
                <span className={'gap-in' + (led ? ' is-led' : '')}>
                  <InlineInput value={val} onChange={setVal} placeholder={L3('</…>', '</…>', '</…>')} label={askText} max={10} cls="tk-input-tag" />
                  <Led on={led} />
                </span>) };
            }
            if (phase === 'move' && LINE_PART[ln.id]) return { onTap: () => lineTap(ln.id), disabled: !canTap, cls: ln.id === 'title' && picked ? 'is-picked' : '' };
            return ctx ? { cls: ctx } : null;
          }} />
      </div>
    </Stage>
  );
}

// =============================================================================
// 6. ТВОЯ ЛАБОРАТОРИЯ — модель, код и браузер меняются вместе.
// =============================================================================
function LabCode({ title, text, onTitle, onText, labelT, labelB }) {
  // Поля ввода прямо в строках title и body настоящего кода.
  return (
    <CodeLines lines={buildLines(FULL_DOC, { title, text })} className="cv-ex cv-lab"
      renderText={(t) => (t.z === 'title-text'
        ? <InlineInput value={title} onChange={onTitle} label={labelT} max={40} placeholder={SAMPLE.title} />
        : <InlineInput value={text} onChange={onText} label={labelB} max={60} placeholder={SAMPLE.text} />)} />
  );
}
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put, store] = useRec('s6');
  const solved = !!(rec && rec.done);
  const lab0 = store.get('lab');
  const [title, setTitle] = useState(lab0 ? lab0.title : pick(SAMPLE.title));
  const [text, setText] = useState(lab0 ? lab0.text : pick(SAMPLE.text));
  const [view, setView] = useState('browser');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canGo = useAdvanceGate(solved, spoken);
  const seen = useRef({ title: !!solved, text: !!solved });
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const said = useRef({ title: false, text: false });
  const led = useIdleLed(!solved, 0);
  // Голос — не на каждую букву: одна реплика после паузы в наборе, по разу на поле.
  useEffect(() => {
    const t = setTimeout(() => {
      const okT = hasLetters(title) && !hasTags(title) && title.trim() !== pick(SAMPLE.title);
      const okB = hasLetters(text) && !hasTags(text) && text.trim() !== pick(SAMPLE.text);
      if (okT && !said.current.title) { said.current.title = true; seen.current.title = true; if (!solved) sayNow(c.sawTitle, 'point'); }
      if (okB && !said.current.text) { said.current.text = true; seen.current.text = true; if (!solved) sayNow(c.sawBody, 'point'); }
      if (hasLetters(title) && hasLetters(text) && !hasTags(title + text)) store.set('lab', { title: title.trim(), text: text.trim() });
      if (!solved && seen.current.title && seen.current.text) { put({ done: true }); sayNow(c.done, 'cheer'); }
    }, 1200);
    return () => clearTimeout(t);
  }, [title, text]); // eslint-disable-line react-hooks/exhaustive-deps
  const onTitle = (v) => { setTitle(v); setFlash((f) => ({ tab: f.tab + 1, page: f.page })); };
  const onText = (v) => { setText(v); setFlash((f) => ({ tab: f.tab, page: f.page + 1 })); };
  const reset = () => { setTitle(pick(SAMPLE.title)); setText(pick(SAMPLE.text)); };
  const clean = (s) => (hasTags(s) ? '' : s);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <div className="lab">
        <div className="lab-views">
          <div className="lab-toggle" role="tablist">
            {['browser', 'model'].map((v) => (
              <button key={v} type="button" role="tab" aria-selected={view === v} className={'seg' + (view === v ? ' is-on' : '')} onClick={() => setView(v)}>
                {pick(v === 'browser' ? UI.browser : UI.model)}
              </button>
            ))}
          </div>
          <div className={'lab-b' + (view === 'browser' ? ' is-shown' : '')}>
            <MiniBrowser title={clean(title)} page={clean(text)} flashTab={flash.tab} flashPage={flash.page} />
          </div>
          <div className={'lab-m' + (view === 'model' ? ' is-shown' : '')}>
            <Fig texts={docTexts(clean(title), clean(text))} parts={OPEN_PARTS} move={{ lid: LID_UP() }} cls="fig-lab" />
          </div>
        </div>
        <div className={'lab-c' + (led ? ' is-led' : '')}>
          <LabCode title={title} text={text} onTitle={onTitle} onText={onText} labelT={c.ask} labelB={c.ask} />
          <button type="button" className="btn-ghost lab-reset" onClick={reset}><Icon name="undo" size={16} />{pick(UI.reset)}</button>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// 7. ТЕПЕРЬ САМОСТОЯТЕЛЬНО — четыре задачи, меньше поддержки.
// В первой попытке ответ не подсвечивается и рука не показывает путь.
// Подсказка — по лампочке или после затруднения: 1 — направление, 2 — подробно
// (тогда же загорается место). После подробной помощи — похожий пример.
// =============================================================================
const TASKS7 = ['goal', 'where', 'build', 'close'];
const BUILD7 = ['html-o', 'head-o', 'head-c', 'body-o', 'body-c', 'html-c'];
const BUILD7B = ['head-o', 'title', 'head-c'];
const POOL7 = ['body-o', 'html-c', 'head-o', 'body-c', 'html-o', 'head-c'];
const POOL7B = ['head-c', 'title', 'head-o'];
const BUILD_RULE = {
  'html-o': L3('Tashqi quti birinchi ochiladi: <html>.', 'Внешняя коробка открывается первой: <html>.', 'The outer box opens first: <html>.'),
  'head-o': L3('html ichida avval head ochiladi.', 'Внутри html сначала открывается head.', 'Inside html, head opens first.'),
  'head-c': L3('head ni yopish kerak, body boshlanishidan oldin.', 'head нужно закрыть до того, как начнётся body.', 'head must close before body starts.'),
  'body-o': L3('Endi body ochiladi.', 'Теперь открывается body.', 'Now body opens.'),
  'body-c': L3('body ni yopamiz.', 'Закрываем body.', 'We close body.'),
  'html-c': L3('Oxirida tashqi quti yopiladi: </html>.', 'Последней закрывается внешняя коробка: </html>.', 'Last, the outer box closes: </html>.'),
  title: L3('head ichida title turadi.', 'Внутри head стоит title.', 'title sits inside head.')
};
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [ti, setTi] = useState(solved ? 4 : 0);
  const [variant, setVariant] = useState('A');         // A — основная задача, B — похожая после помощи
  const [hintLv, setHintLv] = useState(0);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(false);
  const [built, setBuilt] = useState([]);
  const builtRef = useRef([]);
  const [chipShake, wobble] = useShake();
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({});
  const task = TASKS7[ti];
  const T7 = task ? c.tasks[task] : null;
  const B = variant === 'B';
  const S = (k) => stat.current[k] || (stat.current[k] = { tries: 0, misses: 0, hints: 0, followUp: null });

  // Подсказка по запросу: лампочка в шапке поднимает ступень подсказки.
  const pulse = useHintPulse();
  const pulse0 = useRef(pulse);
  useEffect(() => {
    if (pulse === pulse0.current || !task || okNow) return;
    pulse0.current = pulse;
    setHintLv((h) => Math.min(2, h + 1));
    S(task).hints += 1;
  }, [pulse]); // eslint-disable-line react-hooks/exhaustive-deps

  const hintText = !T7 ? null : hintLv === 0 ? null : hintLv === 1 ? (B && T7.hint1B ? T7.hint1B : T7.hint1) : (B && T7.hint2B ? T7.hint2B : T7.hint2);
  const vals = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };

  const nextTask = () => {
    setOkNow(false); setMsg(null); setHintLv(0); setMisses(0); setBuilt([]); builtRef.current = [];
    if (ti + 1 >= TASKS7.length) {
      put({ done: true });
      sayNow(c.done, 'celebrate');
      setTi(4);
      return;
    }
    setVariant('A');
    setTi(ti + 1);
    sayNow(c.tasks[TASKS7[ti + 1]].ask, 'explain');
  };
  const success = () => {
    const s = S(task);
    if (B) s.followUp = s.followMiss ? false : true;
    sfx('ok', true);
    setOkNow(true); setMsg(null);
    const helped = s.hints >= 2 || s.misses >= 2;
    if (!B) {
      log({ screenId: 's7.' + task, type: 'independent', correct: true, firstTry: s.misses === 0 && s.hints === 0,
        attempts: s.tries, hints: s.hints, helped, independent: s.misses === 0 && s.hints === 0 });
    } else {
      const row = { screenId: 's7.' + task, type: 'independent', correct: true, firstTry: false, attempts: s.tries, hints: s.hints, helped: true, independent: false, followUp: s.followUp };
      log(row);
    }
    if (!B && helped) {
      // Решено с подробной помощью — похожий пример с другим содержимым, без подсказок сначала.
      sayNow(joinL(T7.ok, c.again), 'smile');
      setTimeout(() => { setOkNow(false); setVariant('B'); setHintLv(0); setMisses(0); setBuilt([]); builtRef.current = []; }, 1600);
      return;
    }
    sayNow(T7.ok, 'smile');
    setTimeout(nextTask, 1500);
  };
  const miss = (m, shakeKey) => {
    const s = S(task);
    s.misses += 1;
    if (B) s.followMiss = true;
    sfx('soft', true);
    setMisses((n) => n + 1);
    setHintLv((h) => Math.min(2, Math.max(h, misses + 1)));
    setMsg(m);
    if (shakeKey) setShake((x) => ({ k: shakeKey, n: x.n + 1 }));
    sayNow(m, 'think');
  };

  // Задача 1: выбрать место в коде по цели.
  const goalTap = (z) => {
    if (!canTap || okNow) return;
    S(task).tries += 1;
    const want = B ? 'body-text' : 'title-text';
    if (z === want) { success(); return; }
    if (z === 'title-text' || z === 'body-text') miss(T7.otherText); else miss(T7.tag);
  };
  // Задача 2: куда положить карточку.
  const whereTap = (place) => {
    if (!canTap || okNow || !place) return;
    S(task).tries += 1;
    const want = B ? 'body' : 'head';
    if (place === want) { success(); return; }
    miss(B ? T7.hint1B : (place === 'body' ? C.s4.titleBody : C.s4.titleHtml), place === 'html' ? 'body' : place);
  };
  // Задача 3: собрать структуру по порядку.
  const order = B ? BUILD7B : BUILD7;
  const pool = (B ? POOL7B : POOL7).filter((id) => builtRef.current.indexOf(id) < 0);
  const buildTap = (id) => {
    if (!canTap || okNow) return;
    S(task).tries += 1;
    const k = builtRef.current.length;
    if (order[k] === id) {
      const next = builtRef.current.concat(id);
      builtRef.current = next;
      setBuilt(next);
      sfx('tap', true);
      if (next.length === order.length) success();
      return;
    }
    wobble(id);
    miss(BUILD_RULE[order[k]]);
  };
  // Задача 4: открывающий или закрывающий.
  const closeOpts = B ? ['</head>', '<head>', '</body>'] : ['<body>', '</head>', '</body>'];
  const closeTap = (o) => {
    if (!canTap || okNow) return;
    S(task).tries += 1;
    const want = B ? '</head>' : '</body>';
    if (o === want) { success(); return; }
    wobble(o);
    miss(o.indexOf('/') < 0 ? C.s5.noSlash : fillL(C.s5.wrongName, { tag: want }));
  };

  const ask = !T7 ? c.done : (B ? T7.askB : T7.ask);
  const showLed = hintLv >= 2;                 // место загорается только после подробной подсказки
  const goalVals = okNow && task === 'goal' ? (B ? Object.assign({}, vals, { text: pick(L3('Mushugim uxlayapti', 'Мой кот спит', 'My cat is sleeping')) }) : Object.assign({}, vals, { title: pick(L3('Mening mushugim', 'Мой кот', 'My cat')) })) : vals;
  const buildLinesNow = buildLines(B ? ['doctype', 'html-o'].concat(built).concat(['body-o', 'text', 'body-c', 'html-c']) : ['doctype'].concat(built), vals);
  const builtHas = (id) => built.indexOf(id) >= 0;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintText || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg && !okNow ? msg : (hintText && !okNow ? hintText : null)}
        n={task ? (ti + 1) + '/4' + (B ? ' · ' + pick(UI.again).toLowerCase() : '') : null} />
      {task === 'goal' ? (
        <div className="work pr">
          <MiniBrowser title={goalVals.title} page={goalVals.text} flashTab={okNow && !B ? 1 : 0} flashPage={okNow && B ? 1 : 0} />
          <CodeLines lines={buildLines(FULL_DOC, goalVals)} className="cv-pr"
            zone={(z, t) => (z ? { tap: true, disabled: !canTap || okNow, led: showLed && z === (B ? 'body-text' : 'title-text') } : null)}
            onZone={(z) => goalTap(z)} />
        </div>
      ) : null}
      {task === 'where' ? (
        <>
          <div className="card-float" translate="no">
            <span className="card-f mono" style={{ '--c': B ? TAGC.body : TAGC.title }}>{B ? pick(SAMPLE.text) : '<title>' + pick(SAMPLE.title) + '</title>'}</span>
          </div>
          <Fig texts={docTexts(vals.title, vals.text)} onPick={(h) => whereTap({ html: 'html', lid: 'html', head: 'head', body: 'body', page: 'body' }[h])}
            pickable={['html', 'head', 'body', 'page']}
            parts={{ lid: 'off', slots: 'off', 'title-stray': 'off', 'title-card': okNow && !B ? 'on' : 'off', 'page-card': B && !okNow ? 'off' : 'on' }}
            move={{ lid: LID_UP() }} shake={shake} led={showLed ? [B ? 'body' : 'head'] : []}
            lit={okNow ? [B ? 'page' : 'title'] : []} label={ask} />
          <PartChips items={['html', 'head', 'body']} onPick={whereTap} disabled={!canTap || okNow} led={showLed ? [B ? 'body' : 'head'] : null} />
        </>
      ) : null}
      {task === 'build' ? (
        <>
          <div className="ex">
            <Fig texts={docTexts(vals.title, vals.text)}
              parts={B
                ? { lid: 'off', slots: 'off', 'title-stray': 'off', 'head-close': builtHas('head-c') ? 'on' : 'ghost', 'title-card': builtHas('title') ? 'on' : 'off', head: builtHas('head-o') ? 'on' : 'ghost' }
                : { lid: 'off', 'title-stray': 'off', 'title-card': 'off', 'page-card': 'off', case: builtHas('html-o') ? 'on' : 'ghost', 'case-near': builtHas('html-o') ? 'on' : 'ghost',
                  'html-close': builtHas('html-c') ? 'on' : 'ghost', slots: builtHas('html-o') && !builtHas('body-o') ? 'on' : 'off',
                  head: builtHas('head-o') ? 'on' : 'off', 'head-close': builtHas('head-c') ? 'on' : 'ghost',
                  body: builtHas('body-o') ? 'on' : 'off', 'body-close': builtHas('body-c') ? 'on' : 'ghost' }}
              move={{ lid: LID_UP(), head: builtHas('head-o') || B ? 0 : DROP(), body: builtHas('body-o') ? 0 : DROP(), 'title-card': builtHas('title') ? 0 : DROP() }} label={ask} />
            <CodeLines lines={buildLinesNow} className="cv-ex" />
          </div>
          {pool.length ? (
            <div className="pool" translate="no">
              {pool.map((id) => {
                const ln = buildLines([id], vals)[0];
                return (
                  <button key={id} type="button" disabled={!canTap || okNow} className={'pool-chip' + (chipShake === id ? ' fx-no' : '')} onClick={() => buildTap(id)}>
                    {ln.toks.map((t, j) => (t.k === 'text' ? <span key={j} className="tk-text">{t.v}</span> : <Tag key={j} tag={t.tag} close={t.k === 'close'} />))}
                    <Led on={showLed && id === order[built.length]} />
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      ) : null}
      {task === 'close' ? (
        <>
          <CodeLines lines={buildLines(FULL_DOC, vals)} className="cv-pr" hl={B ? 'head' : 'body'} />
          <div className="jaws" translate="no">
            {closeOpts.map((o) => (
              <button key={o} type="button" disabled={!canTap || okNow} className={'opt-tag mono' + (chipShake === o ? ' fx-no' : '') + (okNow && o === (B ? '</head>' : '</body>') ? ' is-on' : '')}
                onClick={() => closeTap(o)}>
                {o}<Led on={showLed && o === (B ? '</head>' : '</body>')} />
              </button>
            ))}
          </div>
        </>
      ) : null}
      {!task ? (
        <div className="ticks">
          {TASKS7.map((k) => {
            const s = stat.current[k] || {};
            const self = !s.misses && !s.hints;
            return <span key={k} className="tick is-on"><span className="tick-m"><Icon name="check" size={13} /></span>{pick(c.labels[k])}{self ? ' ★' : ''}</span>;
          })}
          <span className="tick-note">{pick(c.selfNote)}</span>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 8. МОЯ ПЕРВАЯ СТРАНИЦА — своё название и текст, показать в коде, итог.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const lab = store.get('lab');
  const changed = (s, smp) => s && s !== pick(smp);
  const [title, setTitle] = useState(rec ? rec.title : (lab && changed(lab.title, SAMPLE.title) ? lab.title : ''));
  const [text, setText] = useState(rec ? rec.text : (lab && changed(lab.text, SAMPLE.text) ? lab.text : ''));
  const [phase, setPhase] = useState(rec && rec.done ? 'done' : 'write');   // write → showTitle → showBody → done
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec && rec.done ? c.bye : c.say, pose: rec && rec.done ? 'bye' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(phase === 'done', spoken);
  const tries = useRef({ t: 0, b: 0 });
  const led = useIdleLed(canTap && phase !== 'done', phase === 'write' ? 0 : phase === 'showTitle' ? 1 : 2);
  const okT = hasLetters(title) && !hasTags(title);
  const okB = hasLetters(text) && !hasTags(text);
  useEffect(() => {
    if (phase !== 'write' || !okT || !okB) return undefined;
    const t = setTimeout(() => { setPhase('showTitle'); sayNow(c.showTitle, 'point'); }, 1500);
    return () => clearTimeout(t);
  }, [title, text, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const tapZone = (z) => {
    if (!canTap) return;
    if (phase === 'showTitle') {
      tries.current.t += 1;
      if (z === 'title-text' || z === 'title-o' || z === 'title-c') {
        sfx('ok', true); setMsg(null);
        log({ screenId: 's8.title', type: 'explain-source', correct: true, firstTry: tries.current.t === 1, attempts: tries.current.t });
        setPhase('showBody'); sayNow(joinL(c.foundTitle, c.showBody), 'cheer');
      } else { sfx('soft', true); setMsg(c.notTitle); sayNow(c.notTitle, 'think'); }
      return;
    }
    if (phase === 'showBody') {
      tries.current.b += 1;
      if (z === 'body-text') {
        sfx('win', true); setMsg(null);
        log({ screenId: 's8.body', type: 'explain-source', correct: true, firstTry: tries.current.b === 1, attempts: tries.current.b });
        const art = { type: 'html-page', title: title.trim(), text: text.trim(), html: buildHtml(title.trim(), text.trim()) };
        store.set('artifact', art);
        put({ done: true, title: title.trim(), text: text.trim() });
        setPhase('done'); sayNow(joinL(c.foundBody, c.bye), 'celebrate');
      } else { sfx('soft', true); setMsg(c.notBody); sayNow(c.notBody, 'think'); }
    }
  };
  const writing = phase === 'write';
  const askText = phase === 'write' ? c.askWrite : phase === 'showTitle' ? c.showTitle : phase === 'showBody' ? c.showBody : c.bye;
  const shownT = okT ? title : '', shownB = okB ? text : '';
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <Ask text={askText} hint={msg} />
      <div className="work pr">
        <MiniBrowser title={shownT} page={shownB} hl={phase === 'showBody' || phase === 'done' ? null : null} />
        {writing ? (
          <div className={'lab-c' + (led ? ' is-led' : '')}>
            <LabCode title={title} text={text} onTitle={setTitle} onText={setText} labelT={c.askWrite} labelB={c.askWrite} />
          </div>
        ) : (
          <CodeLines lines={buildLines(FULL_DOC, { title: shownT, text: shownB })} className="cv-pr"
            zone={(z) => (z && phase !== 'done' ? { tap: true, disabled: !canTap, led: led && z === (phase === 'showTitle' ? 'title-text' : 'body-text') } : z && phase === 'done' && (z === 'title-text' || z === 'body-text') ? { cls: 'is-found' } : null)}
            onZone={(z) => tapZone(z)} />
        )}
      </div>
      {phase === 'done' ? (
        <div className="final">
          <Fig texts={docTexts(shownT, shownB)} parts={OPEN_PARTS} move={{ lid: LID_UP() }} lit={['title', 'page']} cls="fig-mini" />
          <div className="final-side">
            <div className="ready-stamp"><Icon name="check" size={18} />{pick(UI.ready)}</div>
            <p className="final-note">{pick(UI.saveNote)}</p>
            <div className="bye-next next-card">
              <span className="bye-next-ic"><Icon name="doc" size={24} /></span>
              <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(c.next)}</b></span>
              <span className="next-tags mono" translate="no">h1 · p</span>
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK',    Comp: S1 },
  { id: 's2', code: 'SHOW',    Comp: S2 },
  { id: 's3', code: 'CHECK-1', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 },
  { id: 's5', code: 'CHECK-2', Comp: S5 },
  { id: 's6', code: 'LEVEL-2', Comp: S6 },
  { id: 's7', code: 'RESULT',  Comp: S7 },
  { id: 's8', code: 'ACHIEVEMENT', Comp: S8 }
];
// «Повторить» стирает только этот экран; работу из лаборатории (lab) и
// готовую страницу (artifact) не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'] };

export default function HtmlZaglyaniVnutr({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
.lesson-root { --ind: 1.1em; --gut: 2.2em; --cv-fs: clamp(11.5px, 3.1vw, 14px); --fig-h: min(40dvh, 420px); }
/*@LESSON1_CSS@*/
.cv-empty { display: inline-block; min-width: 4ch; }

/* ══ МОДЕЛЬ ДОКУМЕНТА (навык anatomy) ═══════════════════════════════ */
/*@ISO_CSS@*/
.fig { position: relative; width: 100%; height: auto; aspect-ratio: var(--ar, 1.33); max-height: var(--fig-h); min-height: 110px;
  flex: 0 1 auto; display: flex; justify-content: center; border-radius: 18px; background: #fbfbfa; overflow: hidden;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 14px 30px -18px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px rgba(${T.shadowBase},0.06);
  -webkit-tap-highlight-color: transparent; }
.fig > svg { width: 100%; height: 100%; padding: 4px; box-sizing: border-box; }
.fig.iso[data-theme="light"] { --anatomy-paper: #fbfbfa; --anatomy-lit: ${T.ink}; }
.fig [data-state="ghost"] { opacity: .16; }
.fig [data-state="off"] { opacity: 0; pointer-events: none; }
.fig [data-part] { transition: opacity .45s ease; }
.fig .is-pick { cursor: pointer; }
.fig .is-led { animation: figLed 1.3s ease-in-out infinite; }
@keyframes figLed { 0%, 100% { filter: drop-shadow(0 0 0 rgba(255,79,40,0)); } 50% { filter: drop-shadow(0 0 5px rgba(255,79,40,.95)); } }
.fig .fx-shake { animation: figShake .46s ease; }
@keyframes figShake { 0%, 100% { transform: none; } 20% { transform: translateX(-4px); } 45% { transform: translateX(4px); } 70% { transform: translateX(-2px); } }
/* Материалы: коробка html — графитовая, head — фиолетовая, body — голубая
   (цвета тегов курса, разбавленные до светлого), карточки — белая бумага. */
.fig [data-part="case"], .fig [data-part="case-near"], .fig [data-part="html-close"], .fig [data-part="lid"] {
  --anatomy-top: #f3f5f8; --anatomy-shade-0: #d0d6de; --anatomy-shade-1: #dbe0e7; --anatomy-shade-2: #e5e9ee; --anatomy-shade-3: #eef0f3; }
.fig [data-part="head"] { --anatomy-top: #f6f3fc; --anatomy-shade-0: #d6cdec; --anatomy-shade-1: #e0d9f1; --anatomy-shade-2: #e9e4f6; --anatomy-shade-3: #f1eefa; }
.fig [data-part="body"] { --anatomy-top: #eff7fb; --anatomy-shade-0: #cbdfeb; --anatomy-shade-1: #d6e7f1; --anatomy-shade-2: #e1eef5; --anatomy-shade-3: #ebf4f9; }
.fig [data-part="title-card"], .fig [data-part="page-card"], .fig [data-part="title-stray"] {
  --anatomy-top: #fff; --anatomy-shade-0: #dededb; --anatomy-shade-1: #e7e7e4; --anatomy-shade-2: #efefec; --anatomy-shade-3: #f6f6f3; }
.fig .fg-tint { opacity: .12; transition: opacity .3s; }
.fig .fg-tint[data-tag="html"] { fill: #586A83; } .fig .fg-tint[data-tag="head"] { fill: #6F57AB; } .fig .fg-tint[data-tag="body"] { fill: #1171A0; }
.fig .is-lit > .fg-tint, .fig .is-lit .fg-tint { opacity: .3; }
.fig text[data-tag="html"] { fill: #586A83; } .fig text[data-tag="head"] { fill: #6F57AB; }
.fig text[data-tag="body"] { fill: #1171A0; } .fig text[data-tag="title"] { fill: #9F4471; }
.fig text[data-font="sans"] { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; font-weight: 700; letter-spacing: 0; fill: #1d1d1f; }
.fig .fg-slot { fill: rgba(88,106,131,.06); stroke: #8a95a5; stroke-width: .9; stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; }
/* Подсветка части — цветом её тега (обводка + светлая заливка). */
.fig [data-tag="html"] .iso-solid[data-lit] > .iso-edge, .fig [data-sel="html"].is-lit .iso-edge { stroke: #586A83; }
.fig [data-tag="head"].is-lit > .iso-solid > .iso-edge, .fig [data-tag="head"] .is-lit > .iso-solid > .iso-edge { stroke: #6F57AB; }
.fig [data-tag="body"].is-lit > .iso-solid > .iso-edge, .fig [data-tag="body"] .is-lit > .iso-solid > .iso-edge { stroke: #1171A0; }
.fig [data-tag="title"].is-lit > .iso-solid > .iso-edge { stroke: #9F4471; }
.fig .is-lit > .iso-solid > .iso-edge { stroke-width: 1.6; }
.fig .is-lit > .iso-solid > .iso-top { fill: #fff; }
.fig-s1.is-lifting [data-part="lid"] { opacity: .5; }

/* ══ РАСКЛАДКИ ══════════════════════════════════════════════════════ */
.duo, .ex { display: flex; flex-direction: column; gap: var(--gap-stack); width: 100%; min-height: 0; }
.stack > .duo, .stack > .ex, .stack > .work, .stack > .fig, .stack > .lab, .stack > .final { flex: 0 1 auto; min-height: 0; }
.ex-side { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.cv-ex, .cv-pr { --cv-fs: clamp(11px, 2.9vw, 13.5px); }
.fig-mini { --fig-h: min(22dvh, 220px); }
.ex-side { position: relative; }
/* Плашка head ложится поверх страницы браузера: раскладка не прыгает. */
.note-line { position: absolute; z-index: 3; left: 8px; right: 8px; top: calc(clamp(30px, 4.6dvh, 40px) + 6px); display: flex; align-items: center; gap: 6px;
  margin: 0; padding: 6px 10px; border-radius: 10px; background: #F2EFFF; color: #4E3D86; font: 700 13px 'Manrope', sans-serif;
  box-shadow: inset 0 0 0 1.5px #6F57AB, 0 8px 18px -10px rgba(0,0,0,.35); }
.bigbtn-in { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
@media (max-width: 899px) {
  .ex > .fig { min-height: 150px; }
  .cv-ex, .cv-pr { --cv-fs: 11.5px; }
  .cv-ex .cv-line, .cv-pr .cv-line { min-height: 1.38em; }
  .ex-side .mb-page { min-height: 46px; padding: 6px 10px; }
  .ex-side .mb-doc { font-size: 15px; }
}
@media (min-width: 900px) {
  .duo { flex-direction: row; align-items: center; }
  .duo > * { flex: 1 1 50%; }
  /* Модель берёт высоту ряда (её задаёт код), а не свою: иначе на невысоком
     ноутбуке ряд переполнялся по центру и наезжал на задание и кнопки. */
  .ex { flex-direction: row; align-items: stretch; }
  .ex > .fig { flex: 1 1 54%; height: auto; max-height: none; aspect-ratio: auto; min-height: 0; }
  .ex > .cv, .ex > .ex-side { align-self: center; }
  .cv-ex .cv-line, .cv-ex .cv-tap { min-height: 22px; }
  .ex-side .mb-page { min-height: 38px; padding-block: 6px; }
  .duo > .fig { --fig-h: min(36dvh, 330px); }
  .ex > .cv, .ex > .ex-side { flex: 1 1 46%; }
  .cv-ex, .cv-pr { --cv-fs: clamp(13px, 1.2vw, 15px); }
}

/* Кнопки частей: имя тега, цветная полоса и галочка — не только цвет. */
.chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.chips { flex-wrap: nowrap; }
.chip { position: relative; display: inline-flex; align-items: center; gap: 5px; min-height: 44px; padding: 6px 10px 6px 7px; flex: 0 1 auto; min-width: 0; border: none; border-radius: 12px;
  background: #fff; color: var(--c); font: 700 14px 'JetBrains Mono', ui-monospace, monospace; cursor: pointer;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 35%, #fff), inset 4px 0 0 var(--c), 0 2px 0 rgba(${T.shadowBase},0.08); }
.chip-mark { display: grid; place-items: center; width: 16px; height: 16px; flex: none; border-radius: 6px; background: color-mix(in srgb, var(--c) 12%, #fff); color: #fff; }
.chip.is-seen .chip-mark { background: ${T.success}; }
.chip.is-sel { background: color-mix(in srgb, var(--c) 12%, #fff); box-shadow: inset 0 0 0 2.5px var(--c), 0 2px 0 rgba(${T.shadowBase},0.08); }
.chip:disabled { cursor: default; }
.ask-n { display: inline-block; min-width: 2.4em; padding: 1px 7px; border-radius: 8px; background: ${T.uiSoft}; color: ${T.uiDk};
  font-size: .78em; font-weight: 700; text-align: center; vertical-align: 2px; }

/* 3. Предсказание: браузер, код и модель. На телефоне — в колонку,
   на ноутбуке — в один ряд (рядом с Коди по высоте влезает только ряд). */
.pr3 { position: relative; display: flex; flex-direction: column; gap: var(--gap-stack); width: 100%; min-height: 0; }
.stack > .pr3 { flex: 0 1 auto; min-height: 0; }
@media (min-width: 900px) {
  .pr3 { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.15fr) minmax(0, .95fr); align-items: center; gap: 16px; }
  .pr3 > .fig-mini { --fig-h: min(30dvh, 260px); }
  .cv-pr .cv-line { min-height: 22px; }
}
/* 3. Предсказание — кнопки */
.where { display: flex; gap: 10px; justify-content: center; }
.where-b { display: inline-flex; align-items: center; gap: 8px; min-width: 132px; min-height: 52px; padding: 8px 16px; border: none; border-radius: 14px;
  background: #fff; color: ${T.ink}; font: 800 16px 'Manrope', sans-serif; cursor: pointer;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14), 0 3px 0 rgba(${T.shadowBase},0.12); }
.where-b:disabled { cursor: default; }
.where-b.is-ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
.where-b.is-miss { opacity: .55; }
.where-b.is-real { box-shadow: inset 0 0 0 2px ${T.success}; }
.where-ic { width: 22px; height: 16px; border-radius: 3px; box-shadow: inset 0 0 0 1.6px currentColor; position: relative; }
.where-tab::before { content: ''; position: absolute; left: 2px; top: 2px; width: 9px; height: 3px; border-radius: 1px; background: currentColor; }
.where-page::before { content: ''; position: absolute; left: 3px; right: 3px; top: 6px; height: 1.6px; background: currentColor; box-shadow: 0 3px 0 currentColor; }

/* 4. Сборка */
.build-row { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.pieces, .places { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.piece { position: relative; min-height: 46px; padding: 6px 12px; border: none; border-radius: 12px; background: #fff; color: var(--c); cursor: grab;
  font: 700 14px 'JetBrains Mono', ui-monospace, monospace; touch-action: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 40%, #fff), inset 0 -4px 0 color-mix(in srgb, var(--c) 18%, #fff), 0 3px 0 rgba(${T.shadowBase},0.1); }
.piece.is-sel { transform: translateY(-4px); box-shadow: inset 0 0 0 2.5px var(--c), 0 10px 18px -8px rgba(${T.shadowBase},0.45); }
.place { min-height: 40px; padding: 6px 12px; border: none; border-radius: 11px; background: transparent; color: var(--c); cursor: pointer;
  font: 700 13px 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px currentColor; opacity: .45; transition: opacity .2s, background .2s; }
.places.is-on .place:not(:disabled) { opacity: 1; background: #fff; }
.place:disabled { cursor: default; opacity: .25; }
.drag-ghost { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -120%); padding: 6px 12px; border-radius: 12px; background: #fff;
  color: var(--c); font: 700 14px 'JetBrains Mono', monospace; box-shadow: inset 0 0 0 2px var(--c), 0 12px 24px -10px rgba(0,0,0,.4); }

/* 5. Починка */
.cv-line.is-picked { background: #FCEAF2; box-shadow: inset 0 0 0 2px #9F4471; }
.gap-in { position: relative; display: inline-flex; flex: 1 1 auto; }

/* 6. Лаборатория: на телефоне — браузер или модель (переключатель), под ними
   код с полями; на компьютере — три панели. */
.lab { display: flex; flex-direction: column; gap: var(--gap-stack); width: 100%; min-height: 0; }
.lab-views { display: flex; flex-direction: column; gap: 6px; min-height: 0; }
.lab-toggle { display: flex; align-self: center; padding: 3px; border-radius: 12px; background: rgba(${T.shadowBase},0.07); }
.seg { min-height: 36px; padding: 4px 16px; border: none; border-radius: 9px; background: transparent; color: ${T.ink2}; font: 700 14px 'Manrope', sans-serif; cursor: pointer; }
.seg.is-on { background: #fff; color: ${T.ink}; box-shadow: 0 1px 3px rgba(0,0,0,.12); }
.lab-b, .lab-m { display: none; }
.lab-b.is-shown, .lab-m.is-shown { display: block; }
.fig-lab { --fig-h: min(30dvh, 300px); }
.lab-c { position: relative; display: flex; flex-direction: column; gap: 6px; }
.lab-reset { align-self: center; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 6px 14px; }
.cv-lab .tk-input { min-width: 6ch; }
@media (min-width: 900px) {
  .lab { display: grid; grid-template-columns: 1fr 1fr; align-items: center; }
  .lab-toggle { display: none; }
  .lab-b, .lab-m { display: block; }
  .fig-lab { --fig-h: min(30dvh, 300px); }
}

/* 7. Самостоятельно */
.card-float { display: flex; justify-content: center; }
.card-f { padding: 8px 14px; border-radius: 12px; background: #fff; color: var(--c); font: 700 14px 'JetBrains Mono', monospace;
  box-shadow: inset 0 0 0 2px var(--c), 0 10px 20px -12px rgba(0,0,0,.4); transform: rotate(-1.5deg); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pool { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.pool-chip { position: relative; display: inline-flex; align-items: center; min-height: 42px; padding: 4px 12px; border: none; border-radius: 11px;
  background: #fff; cursor: pointer; font: 600 var(--cv-fs) 'JetBrains Mono', ui-monospace, monospace;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.12), 0 2px 0 rgba(${T.shadowBase},0.12); }
.pool-chip:disabled { cursor: default; }
.jaws { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.opt-tag { position: relative; min-width: 104px; min-height: 52px; padding: 6px 14px; border: none; border-radius: 14px; background: #fff; cursor: pointer;
  color: ${T.ink}; font: 700 18px 'JetBrains Mono', monospace; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14), 0 3px 0 rgba(${T.shadowBase},0.12); }
.opt-tag.is-on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
.opt-tag:disabled { cursor: default; }
.ticks { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 8px; }
.tick { display: inline-flex; align-items: center; gap: 6px; min-height: 34px; padding: 4px 12px 4px 6px; border-radius: 12px; background: ${T.paper};
  color: ${T.ink}; font: 700 14px 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px ${T.success}; }
.tick-note { width: 100%; text-align: center; color: ${T.ink3}; font: 600 12px 'Manrope', sans-serif; }
.tick-m { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 7px; background: ${T.success}; color: #fff; }

/* 8. Итог */
.tk.is-found { background: #E8F6EE; box-shadow: inset 0 0 0 1.5px ${T.success}; }
.final { display: flex; flex-direction: column; gap: var(--gap-stack); align-items: stretch; }
.final-side { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.ready-stamp { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 14px; background: ${T.successSoft}; color: ${T.success}; font: 800 16px 'Manrope', sans-serif; }
.final-note { margin: 0; color: ${T.ink2}; font: 600 13px 'Manrope', sans-serif; text-align: center; }
.bye-next.next-card { width: 100%; max-width: 420px; align-self: center; background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 0 0 0 1.5px ${T.uiSoft}; }
.next-card .bye-next-ic { background: ${T.uiSoft}; color: ${T.uiDk}; border: none; }
.next-card .bye-next-t span { color: ${T.ink2}; }
.next-card .bye-next-t b { color: ${T.ink}; }
.next-tags { margin-left: auto; padding-left: 8px; color: ${T.uiDk}; font-size: 14px; font-weight: 700; }
@media (min-width: 900px) { .final { flex-direction: row; align-items: center; } .final > * { flex: 1 1 50%; } }

/* Низкие экраны и открытая клавиатура: модель уступает место заданию. */
@media (max-height: 700px) {
  .lesson-root { --fig-h: min(30dvh, 300px); }
  .ex > .fig { min-height: 132px; }
  .cv-ex .cv-line, .cv-ex .cv-tap { min-height: 1.3em; }
  .ex-side .mb-page { min-height: 38px; }
  .fig-mini { --fig-h: 16dvh; }
}
.is-kbd .fig, .is-kbd .fig-lab { --fig-h: 18dvh; }
.is-kbd .fig-mini { display: none; }
/* Клавиатура открыта: видно активное поле и результат. Строки кода без полей,
   переключатель, модель и «Вернуть пример» на время ввода уходят. */
.is-kbd .lab-toggle, .is-kbd .lab-m, .is-kbd .lab-reset { display: none !important; }
.is-kbd .lab-b { display: block !important; }
.is-kbd .cv-lab .cv-line:not(:has(input)) { display: none; }
.is-kbd .mb-top { height: 28px; }
.is-kbd .mb-page { min-height: 34px; padding: 4px 10px; }
.is-kbd .ex-s5 > .fig { display: none; }
.is-kbd .insp-h, .is-kbd .insp-r:not(.is-now) { display: none; }
.is-kbd .cv-ex { --cv-fs: 11px; padding-block: 3px; }
.is-kbd .cv-ex .cv-line { min-height: 1.22em; }
.is-kbd .ask { font-size: 15px; }
.is-kbd .cv-line.is-ctx { display: none; }
@media (prefers-reduced-motion: reduce) {
  .fig .is-led, .fig .fx-shake { animation: none; }
  .fig [data-part] { transition: none; }
}
`;
