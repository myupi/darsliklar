# Урок 1 «Бумажная страница» — все реплики и когда они звучат

Собрано из исходника `tools/kollazh/kollazh.src.jsx` и поведения экранов `tools/kollazh/kollazh-screens.jsx` (27.10.2026, после правок по замечаниям; 17 экранов). Тексты — дословно, как в уроке, на трёх языках. Для каждой реплики: **когда звучит** (что сделал ученик или что случилось перед ней) и **что в этот момент на экране**.

**28.10.2026:** узбекские реплики заменены текстами заказчика. Вкладка по-узбекски теперь — «brauzer varag‘i» (кнопка в игре «Вкладка или окно?» — «Varaq»), перетаскивание — «suring»; русский и английский не менялись.

Общие правила:
- Пока Коди говорит, кнопки задания отдыхают; «Дальше» включается, когда экран решён и реплика договорена.
- Облака с текстом реплики нет — только голос; задание всегда написано строкой на листе.
- «Следом» — реплика идёт сразу за предыдущей.
- Подсказки (лампочка, 3 ступени): по нажатию лампочки Коди читает следующую ступень, она встаёт в строку задания; после двух ошибок подряд ступень поднимается сама (без голоса — только в строке задания).
- Реакция на ошибку звучит и встаёт в строку задания; ученик пробует снова, штрафов нет.
- Строки, помеченные «печатается», не звучат — только появляются в строке задания.
- «Прожектор»: вещь, о которой речь, крупнеет и выделяется (у вкладки и бирок — коралловый круг «от руки», окно — приподнимается и светится бирюзой, у человечка — часть крупнее и светится), остальное притухает.

## Экран 1 · Хук · «Бумажная страница» (`s1`)

**На экране сначала:** Кремовый лист, бумажный браузер: вкладка «Мой сайт», в окне «Привет, мир!», строки, картинка, кнопка «Играть». Внизу кнопка «Превратить» (включится, когда Коди договорит).

### 1. `s1.say`

- **Когда:** Сразу при открытии экрана (голос — после первого касания урока)
- **На экране:** Браузер на листе, ничего не подсвечено. Строка задания: «Смотри: вкладка браузера»
- uz: «Salom! Men Kodi. Qarang, mana bu veb-sahifa.»
- ru: «Привет! Я Коди. Смотри, вот веб-страница.»
- en: «Hi! I’m Kodi. Look, here’s a web page.»

### 2. `s1.sayTab`

- **Когда:** Следом
- **На экране:** «Прожектор» на вкладке: вкладка крупнеет, становится горчичной, вокруг рисуется коралловый круг «от руки»; окно притухает
- uz: «Tepadagi kichkina joyni ko‘ryapsizmi? Bu brauzer varag‘i, unda sahifa nomi yozilgan.»
- ru: «Видишь маленькое место сверху? Это вкладка браузера, на ней написано название страницы.»
- en: «See the little spot at the top? That’s the browser tab. It shows the page name.»

### 3. `s1.sayGo`

- **Когда:** Следом
- **На экране:** Подсветка снята; после реплики включается кнопка «Превратить», строка задания: «Нажми «Превратить»»; через 7 с бездействия на кнопке мигает огонёк
- uz: «Agar veb-sahifa odam bo‘lsa, nima deb o‘ylaysiz, u qanday ko‘rinardi? Keling, shuni ko‘ramiz. «Aylantirish» tugmasini bosing.»
- ru: «А если бы веб-страница была человеком, как думаешь, какой бы она была? Давай проверим! Нажми «Превратить».»
- en: «If a web page were a person, what do you think it would look like? Let’s find out! Tap “Transform”.»

### 4. `s1.magic`

- **Когда:** Ученик нажал «Превратить»: браузер распался на куски и собрался в человечка (≈1,5 с, шорох бумаги)
- **На экране:** Человечек машет рукой; на теле видны кусочки страницы (строки, картинка, кнопка)
- uz: «Voy, qarang! Sahifa jonlanib, odamchaga aylandi!»
- ru: «Ого, смотри! Страница ожила и стала человечком!»
- en: «Whoa, look! The page came alive as a paper buddy!»

### 5. `s1.magicHead`

- **Когда:** Следом
- **На экране:** «Прожектор» на голове: голова крупнее и светится, остальные части притухают; внутри головы бумажка «Мой сайт»
- uz: «Sezdingizmi? Sahifa nomi odamchaning boshiga joylashdi. Boshda sahifa haqidagi ma’lumotlar saqlanadi.»
- ru: «Смотри-ка! Название страницы спряталось у него в голове. В голове хранятся сведения о странице.»
- en: «Did you notice? The page name went into its head. The head keeps information about the page.»

### 6. `s1.magicWin`

- **Когда:** Следом
- **На экране:** «Прожектор» на теле: тело крупнее и светится, на нём строки, картинка и кнопка
- uz: «Tanasi-chi? U sahifada ko‘rinadigan narsalardan yig‘ildi: matn, rasm va tugmadan.»
- ru: «А тело? Оно собралось из того, что видно на странице: текста, картинки и кнопки.»
- en: «And the body? It’s made of what you see on the page: text, a picture and a button.»

### 7. `s1.done`

- **Когда:** Следом
- **На экране:** Подсветка снята; строка задания: «В голове — сведения о странице, в теле — то, что видно»; после реплики включается «Дальше»
- uz: «Bugun o‘z sahifangizni yaratasiz, unga nom berasiz va salomlashish matnini yozasiz! Keling, avval buning kodi qanday ko‘rinishini ko‘rib chiqamiz.»
- ru: «Сегодня ты создашь страницу со своим названием и приветствием! Сначала посмотрим, как выглядит код.»
- en: «Today you’ll create a page with your own page name and greeting! First, let’s see what code looks like.»

## Экран 2 · Объяснение · «Как читают код?» (`rd`)

**На экране сначала:** Слева весь код страницы (9 строк, от <!DOCTYPE html> до </html>, с «Мой сайт» и «Привет, мир!»), справа пусто под коллаж; над кодом бумажная стрелка →, слева ↓ (пока невидимы). Кнопок нет.

### 1. `rd.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Строка задания: «Смотри, как браузер читает код». После реплики браузер сам читает строки по одной (≈0,65 с на строку, щелчок): строка темнеет, по ней слева направо бежит жёлтый маркер, ещё не прочитанные строки бледные; справа по ходу собирается коллаж: DOCTYPE → рамка html → голова с title → тело с текстом
- uz: «Mana, sahifaning kodi! Brauzer shu kod asosida sahifani yaratadi. U kodni qanday o‘qishini kuzating!»
- ru: «Вот это код! Из него браузер и собирает страницу. Смотри, как он его читает!»
- en: «This is code! The browser builds the page from it. Watch how it reads it!»

### 2. `rd.read1`

- **Когда:** Когда все строки прочитаны и страница собрана
- **На экране:** Загораются обе стрелки → и ↓
- uz: «Sezdingizmi? Brauzer kodni xuddi kitob o‘qigandek o‘qiydi.»
- ru: «Смотри-ка: браузер читает код, как книжку.»
- en: «Did you notice? The browser reads code like a book.»

### 3. `rd.read2`

- **Когда:** Следом
- **На экране:** Горит стрелка →; маркер медленно (1,6 с) проходит строку <title>Мой сайт</title> слева направо
- uz: «Har bir qatorni chapdan o‘ngga o‘qiydi.»
- ru: «Каждую строчку — слева направо.»
- en: «Each line from left to right.»

### 4. `rd.read3`

- **Когда:** Следом
- **На экране:** Горит стрелка ↓; маркер шагает по строкам сверху вниз
- uz: «Qatorlarni esa yuqoridan pastga, birin-ketin o‘qiydi.»
- ru: «А строчки — сверху вниз, одну за другой.»
- en: «And the lines from top to bottom, one after another.»

### 5. `rd.done`

- **Когда:** Следом
- **На экране:** Стрелки бледнеют; строка задания: «Слева направо, сверху вниз»; после реплики включается «Дальше»
- uz: «Mana, sahifa tayyor! Endi kodning har bir qismi nimani anglatishini birga bilib olamiz.»
- ru: «Строчка за строчкой — и страница готова! Дальше разберёмся с этим кодом вместе.»
- en: «Line by line, and the page is ready! Next, let’s figure out this code together.»

## Экран 3 · Тройка 1, объяснение · «Что такое тег?» (`s3`)

**На экране сначала:** Бумажный браузер «Мой сайт» в коралловой рамке html (рамка вокруг всего браузера, с вкладкой). На рамке две бирки на скотче: <html> слева сверху, </html> справа снизу. Строка задания «Смотри на теги рамки», «0/2». Кнопок нет.

### 1. `s3.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** «Прожектор» на обеих бирках: бирки крупнее, вокруг коралловые круги, браузер притухает
- uz: «Ramkaga qarang: unda ikkita qiziq yozuv bor. Ular nimani bildiradi?»
- ru: «Посмотри на рамку: на ней две интересные надписи. Что же это такое?»
- en: «Look at the frame: there are two interesting labels on it. What are they?»

### 2. `s3.br`

- **Когда:** Верхняя бирка загорелась и стала жёлтой (счётчик «1/2»)
- **На экране:** «Прожектор» на верхней бирке <html>; внутри неё на тёмной подложке крупно светятся знаки < и >
- uz: «Mana bu belgilarga qarang. Ular burchakli qavslar deyiladi.»
- ru: «Посмотри на эти знаки. Они называются угловыми скобками.»
- en: «Look at these signs. They’re called angle brackets.»

### 3. `s3.nm`

- **Когда:** Следом
- **На экране:** Внутри верхней бирки светится имя html (скобки — обычные)
- uz: «Qavslar orasida html deb yozilgan. Bu — tegning nomi.»
- ru: «Между ними написано html. Это название тега.»
- en: «Between them it says html. That’s the tag’s name.»

### 4. `s3.sayTag`

- **Когда:** Следом
- **На экране:** «Прожектор» на всей верхней бирке <html> целиком
- uz: «Qavslar va ular orasidagi nom birgalikda teg deyiladi. Mana bu — html tegi. Brauzer tegni o‘qiydi, lekin sahifada ko‘rsatmaydi.»
- ru: «Вся запись вместе — тег html. Браузер не показывает тег на странице, а читает его.»
- en: «All together, it’s the html tag. The browser doesn’t show a tag on the page, it reads it.»

### 5. `s3.top`

- **Когда:** Следом
- **На экране:** «Прожектор» остаётся на верхней бирке
- uz: «Yuqoridagi <html> — ochuvchi teg. U brauzerga: «Sahifa shu yerdan boshlanadi», deydi.»
- ru: «Верхний — открывающий тег html. Он говорит браузеру: «Здесь страница начинается».»
- en: «The top one is the opening html tag. It tells the browser: “The page starts here.”»

### 6. `s3.bottom`

- **Когда:** Нижняя бирка загорелась и стала жёлтой («2/2»)
- **На экране:** «Прожектор» на нижней бирке </html>; первая скобка < и косая черта / вместе светятся на тёмной подложке — видно, что черта стоит сразу после скобки
- uz: «Pastdagi yozuvga qarang: birinchi qavsdan keyin qiya chiziq bor. Bu — yopuvchi </html> tegi. U brauzerga: «Sahifa shu yerda tugaydi», deydi.»
- ru: «А на нижнем сразу после первой скобки стоит косая черта. Это закрывающий тег html, он говорит: «Здесь страница заканчивается».»
- en: «On the bottom one, a slash comes right after the first bracket. It’s the closing html tag. It says: “The page ends here.”»

### 7. `s3.pair`

- **Когда:** Следом
- **На экране:** Обе бирки подсвечены, браузер с рамкой виден полностью
- uz: «Ochuvchi teg boshlanishni, yopuvchi teg esa tugashni bildiradi. Sahifaning barcha mazmuni shu ikki teg orasida joylashadi.»
- ru: «Открывающий тег обозначает начало, закрывающий — конец. Всё содержимое страницы стоит между ними.»
- en: «The opening tag marks the start, the closing tag marks the end. Everything on the page goes between them.»

### 8. `s3.done`

- **Когда:** Следом
- **На экране:** Светится коралловая рамка; строка задания: «Открывающий тег начинает, закрывающий (с косой чертой) заканчивает»; после реплики — «Дальше»
- uz: «Bir sirni aytaymi? Bu ramkani tushunish oson bo‘lishi uchun chizdik. Aslida brauzer bu ramkani ko‘rsatmaydi.»
- ru: «Маленький секрет: рамку мы нарисовали для наглядности. В браузере её не увидишь.»
- en: «A little secret: we drew the frame to make it clear. You won’t see it in a browser.»

## Экран 4 · Тройка 1, сделай сам · «Закрой рамку» (`s4`)

**На экране сначала:** Браузер в рамке без нижнего края: на его месте коралловый пунктир с ярлыком «?». Справа (на телефоне — снизу) код: <html>, …, пустое поле. Кнопки набора < / html >, «стереть», «Проверить»; можно печатать с клавиатуры.

### 1. `s4.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Пока звучит фраза, пунктир края и пустая строка кода мигают вместе (и снова мигают после 7 с бездействия)
- uz: «Qarang, ramkaning pastki cheti yo‘q! Kodda yopuvchi html tegi yetishmayapti. Uni bo‘sh qatorga yozing va «Tekshirish» tugmasini bosing.»
- ru: «Смотри: у рамки пропал нижний край! В коде не хватает закрывающего тега html. Напиши его в пустой строке и нажми «Проверить».»
- en: «Look: the frame’s bottom edge is gone! The closing html tag is missing from the code. Type it in the empty line and tap “Check”.»

### 2. `s4.msgs.needSlash`

- **Когда:** Ученик набрал <html> и нажал «Проверить»
- **На экране:** Мягкий звук; причина встаёт в строку задания; поле не стирается
- uz: «Deyarli to‘g‘ri! Bu — ochuvchi teg. Yopuvchi tegda html nomidan oldin qiya chiziq bo‘ladi.»
- ru: «Почти! Это открывающий тег. В закрывающем перед словом html стоит косая черта.»
- en: «Almost! That’s the opening tag. The closing tag has a slash before html.»

### 3. `s4.msgs.needLt`

- **Когда:** Набрано без «<» в начале
- **На экране:** То же
- uz: «Teg boshida chap burchakli qavs yetishmayapti. Uni qo‘shing.»
- ru: «Чего-то не хватает: тег начинается с угловой скобки «<». Добавь её в начало.»
- en: «Something is missing: a tag starts with the angle bracket “<”. Add it at the start.»

### 4. `s4.msgs.needGt`

- **Когда:** Набрано без «>» в конце
- **На экране:** То же
- uz: «Teg oxirida o‘ng burchakli qavs yetishmayapti. Uni qo‘shing.»
- ru: «В конце чего-то не хватает: тег заканчивается угловой скобкой «>». Добавь её в конец.»
- en: «Something is missing at the end: a tag ends with the angle bracket “>”. Add it at the end.»

### 5. `s4.msgs.wrongName`

- **Когда:** Внутри тега другое слово
- **На экране:** То же
- uz: «Teg nomini tekshiring: bu yerda html bo‘lishi kerak.»
- ru: «Посмотри на слово внутри тега: здесь нужен html.»
- en: «Check the word inside the tag: here you need html.»

### 6. `s4.msgs.generic`

- **Когда:** Тег начинается с «<» и кончается «>», но внутри не то (черта не на месте, лишний знак, порядок перепутан) — точную причину назвать нельзя
- **На экране:** Причина в строке задания; опора: на рамке появляется верхний тег <html>, кнопки набора < / html > по очереди загораются в нужном порядке; набранное не стирается
- uz: «Belgilar tartibini tekshiring: avval chap burchakli qavs, keyin qiya chiziq, undan keyin html va oxirida o‘ng burchakli qavs.»
- ru: «Проверь порядок знаков: угловая скобка «<», косая черта «/», слово html и угловая скобка «>».»
- en: «Check the order: angle bracket “<”, slash “/”, the word html, angle bracket “>”.»

### 7. `s4.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** На рамке появляется и подсвечивается верхний тег <html>
- uz: «Ramkaning yuqorisidagi ochuvchi tegga qarang.»
- ru: «Посмотри на верхний тег на рамке.»
- en: «Look at the top tag on the frame.»

### 8. `s4.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Yopuvchi tegning nomi ham html. Faqat nomidan oldin qiya chiziq qo‘yiladi.»
- ru: «Закрывающий тег — то же слово, но с косой чертой.»
- en: «The closing tag is the same word with a slash.»

### 9. `s4.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Строка задания
- uz: «Avval chap burchakli qavsni, keyin qiya chiziqni yozing. So‘ng html deb yozing va oxiriga o‘ng burchakli qavsni qo‘ying.»
- ru: «Начни с угловой скобки, потом поставь косую черту. Дальше html и в конце снова угловая скобка.»
- en: «Start with the angle bracket, then add the slash. Then html, and another angle bracket at the end.»

### 10. `s4.ok`

- **Когда:** Ученик набрал </html> и нажал «Проверить»
- **На экране:** Звук победы; нижний край рамки въезжает слева, бирка </html> штампом клеится в правом нижнем углу, строка кода становится </html>; «Дальше»
- uz: «Zo‘r, ramka yopildi! Endi sahifaning barcha mazmuni ikki html tegi orasida.»
- ru: «Есть! Рамка закрылась: вся страница теперь между двумя тегами html.»
- en: «Yes! The frame is closed: the whole page is between the two html tags now.»

## Экран 5 · Тройка 1, закрепление · «Теги по местам» (`s5`)

**На экране сначала:** Новый лист: браузер в рамке без бирок, на рамке два пунктирных места — сверху слева и снизу справа. Внизу лоток: <html>, <\html> (обратная черта — ловушка), </html>. Строка задания «Перетащи тег на место», «0/2».

### 1. `s5.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Без подсветки
- uz: «Endi teglarni joyiga qo‘ying! Biri ramkaning yuqorisiga, ikkinchisi pastiga qo‘yiladi. Diqqat: uchta tegdan bittasi ortiqcha!»
- ru: «Теперь твоя очередь! Рамке нужны два тега: сверху и снизу. Осторожно, один из трёх тегов внизу лишний.»
- en: «Your turn! The frame needs two tags: top and bottom. Careful, one of the three tags below is extra.»

### 2. `s5.sayHow`

- **Когда:** Следом
- **На экране:** После реплики бумажная рука дважды показывает: берёт <html> из лотка и несёт к верхнему месту (до первого касания ученика)
- uz: «Tegni barmog‘ingiz bilan bosib turing va kerakli joyga suring. Yoki avval tegni, keyin uning joyini bosing.»
- ru: «Хватай тег пальцем и неси на место. Или проще: нажми тег, а потом место.»
- en: «Grab a tag with your finger and carry it into place. Or simply tap the tag, then the place.»

### 3. `s5.top`

- **Когда:** Ученик положил тег с косой чертой на верхнее место
- **На экране:** Тег трясётся, копия возвращается в лоток; причина — в строке задания
- uz: «Deyarli to‘g‘ri! Yuqorida sahifa boshlanadi. Bu yerga qiya chiziqsiz ochuvchi teg kerak.»
- ru: «Почти! Сверху страница начинается, здесь нужен открывающий тег, без косой черты.»
- en: «Almost! The page starts at the top, so it needs the opening tag, without a slash.»

### 4. `s5.bottom`

- **Когда:** Ученик положил тег без косой черты на нижнее место
- **На экране:** То же
- uz: «Yana bir bor urinib ko‘ring! Pastda sahifa tugaydi. Bu yerga qiya chiziqli yopuvchi teg kerak.»
- ru: «Ничего! Снизу страница заканчивается, здесь нужен закрывающий тег, с косой чертой.»
- en: «No worries! The page ends at the bottom, so it needs the closing tag, with a slash.»

### 5. `s5.back`

- **Когда:** Ученик положил <\html> (обратная черта) на любое место
- **На экране:** То же
- uz: «Bu tegdagi chiziqqa qarang: uning yuqori uchi chap tomonda. Yopuvchi tegdagi qiya chiziqning yuqori uchi esa o‘ng tomonda bo‘lishi kerak.»
- ru: «А вот и хитрость! Эта черта наклонена не в ту сторону. В закрывающем теге она наклонена вправо: «/».»
- en: «Here’s the trick! This slash leans the wrong way. In a closing tag it leans right: “/”.»

### 6. `s5.pickFirst` — печатается, не звучит

- **Когда:** Ученик нажал место, не выбрав тег (печатается, не звучит)
- **На экране:** Строка задания
- uz: «Avval tegni tanlang.»
- ru: «Сначала выбери тег.»
- en: «Pick a tag first.»

### 7. `s5.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** Строка задания
- uz: «Qaysi teg sahifaning boshlanishini, qaysi biri tugashini bildiradi?»
- ru: «Какой тег начинает страницу, а какой заканчивает?»
- en: «Which tag starts the page, and which one ends it?»

### 8. `s5.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Yuqoriga qiya chiziqsiz ochuvchi tegni, pastga esa qiya chiziqli yopuvchi tegni qo‘ying.»
- ru: «Сверху — тег без косой черты. Снизу — тег с косой чертой.»
- en: «Top: the tag without a slash. Bottom: the tag with a slash.»

### 9. `s5.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Светятся нужный тег в лотке и нужное место
- uz: «Ochuvchi html tegini ramkaning yuqorisidagi joyga suring.»
- ru: «Перетащи <html> на верхнее место.»
- en: «Drag <html> to the top place.»

### 10. `s5.ok`

- **Когда:** Оба тега на местах (каждый штампом встаёт на место)
- **На экране:** Лишний <\html> остаётся в лотке; «Дальше»
- uz: «Ajoyib, ikkala teg ham joyida! Chizig‘i teskari tomonga qiyalangan teg ortiqcha edi.»
- ru: «Отлично, оба тега на месте! А тег с обратной чертой был лишним.»
- en: «Great, both tags are in place! The one with the backslash was extra.»

## Экран 6 · Тройка 2, объяснение · «head и title» (`s6`)

**На экране сначала:** Слева человечек; справа бумажный браузер (на вкладке index.html, в окне «Привет, мир!») и код <head> · … · </head>. Строка задания «Смотри: голова человечка», «0/2».

### 1. `s6.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** «Прожектор» на голове человечка (остальные части притухают); светятся строки <head> и </head>
- uz: «html ichida ikkita asosiy qism bor. Birinchisi — head. Ingliz tilida head «bosh» degani. Odamchaning boshi bu qismni eslab qolishga yordam beradi.»
- ru: «Внутри html живут две части. Первая — head. Голова человечка как раз про неё.»
- en: «Two parts live inside html. The first is head. The buddy’s head stands for it.»

### 2. `s6.sayInfo`

- **Когда:** Следом
- **На экране:** «Прожектор» на окне браузера: лист окна приподнимается, светло-бирюзовый, с бирюзовой обводкой; вкладка и адресная строка притухают
- uz: «head qismida sahifa haqidagi ma’lumotlar saqlanadi. Bu ma’lumotlar sahifaning asosiy qismida ko‘rinmaydi.»
- ru: «В head — сведения о странице. Посмотри на большое место внизу, на окно браузера: там их не видно.»
- en: «head holds information about the page. Look at the big area below, the browser window: you can’t see it there.»

### 3. `s6.opened`

- **Когда:** Голова загорелась и приподнялась, под ней карточка «Мой сайт»; в коде появилась строка <title>Мой сайт</title> («1/2»)
- **На экране:** Светится строка title; строка задания «Смотри: тег title»
- uz: «head ichida nima bor ekan? Mana, sahifaning nomi! U ochuvchi va yopuvchi title teglari orasiga yoziladi.»
- ru: «А что внутри? Вот, название страницы! Его пишут внутри тега title.»
- en: «What’s inside? Here, the page name! It’s written inside the title tag.»

### 4. `s6.flew`

- **Когда:** Карточка загорелась и ступенчато перелетела из головы на вкладку (0,76 с, шорох); на вкладке штампом «Мой сайт» («2/2»)
- **На экране:** «Прожектор» на вкладке: она крупнее, горчичная, коралловый круг
- uz: «Sahifaning nomi brauzer varag‘iga ko‘chdi! Brauzer title ichidagi nomni shu yerda ko‘rsatadi.»
- ru: «Название перелетело на вкладку! Браузер показывает текст из title именно там.»
- en: «The name flew to the tab! The browser shows the text from title right there.»

### 5. `s6.inHead`

- **Когда:** Следом
- **На экране:** В коде тёмной подсветкой загорается строка <head>, через ~1,7 с — строка </head>
- uz: «Kodga qarang: yuqorida ochuvchi head tegi, pastda esa yopuvchi head tegi bor.»
- ru: «Посмотри на код: сверху открывающий тег head, снизу закрывающий.»
- en: «Look at the code: the opening head tag is at the top, the closing one at the bottom.»

### 6. `s6.done`

- **Когда:** Следом
- **На экране:** Ярко подсвечена строка <title>Мой сайт</title> между ними, строки head — светлой подсветкой; после реплики — «Дальше»
- uz: «title qatori shu ikki teg orasida joylashgan. Demak, title head qismining ichida.»
- ru: «Строка title стоит между ними. Значит, title находится внутри head.»
- en: «The title line sits between them. So title is inside head.»

## Экран 7 · Тройка 2, сделай сам · «Название на вкладке» (`s7`)

**На экране сначала:** Сверху браузер (вкладка подсвечена), под ним код <head> · <title>[поле]</title> · </head>; в поле серый пример «Например: Футбол». Кнопка «Готово».

### 1. `s7.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Пока звучит фраза, поле внутри title мигает
- uz: «Endi sahifangizga nom bering! Ochuvchi va yopuvchi title teglari orasiga o‘zingiz tanlagan nomni yozing. Masalan, «Futbol». Nom darhol brauzer varag‘ida paydo bo‘ladi. So‘ng «Tayyor» tugmasini bosing.»
- ru: «А теперь самое интересное: придумай своей странице название! Напиши его внутри title, например «Футбол». Оно сразу появится на вкладке. Потом нажми «Готово».»
- en: «Now the fun part: name your page! Type it inside title, for example “Football”. It shows up on the tab right away. Then tap “Done”.»

### 2. `UI.noTags` — печатается, не звучит

- **Когда:** Ученик напечатал угловые скобки (печатается, не звучит)
- **На экране:** Строка задания; «Готово» выключена
- uz: «Bu yerga faqat sahifa nomini yozing. Burchakli qavslar kerak emas.»
- ru: «Здесь нужны только слова, без угловых скобок.»
- en: «Only words here, no angle brackets.»

### 3. `s7.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** Строка задания
- uz: «Sahifaning nomi qayerga yoziladi? Kodga qarang.»
- ru: «В каком теге пишут название? Посмотри на код.»
- en: «Which tag holds the name? Look at the code.»

### 4. `s7.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Sahifaning nomi ochuvchi va yopuvchi title teglari orasiga yoziladi.»
- ru: «Название пишут между двумя тегами title.»
- en: «The name goes between the two title tags.»

### 5. `s7.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Строка задания
- uz: «title teglari orasidagi bo‘sh joyni bosing va sahifangizga nom yozing. So‘ng «Tayyor» tugmasini bosing.»
- ru: «Нажми пустое место между тегами title, напиши название и нажми «Готово».»
- en: «Tap the empty spot between the title tags, type a name and tap “Done”.»

### 6. `s7.ok`

- **Когда:** Ученик напечатал название (вкладка меняется сразу по мере набора) и нажал «Готово»
- **На экране:** Вкладка штампом подтверждает название, звук «ok»; «Дальше». Похвала — один раз; правка после засчёта сохраняется молча
- uz: «Zo‘r! Endi brauzer varag‘ida sahifangizning nomi ko‘rinib turibdi.»
- ru: «Класс! Теперь на вкладке видно название твоей страницы.»
- en: «Cool! Your page name is now on the tab.»

## Экран 8 · Тройка 3, объяснение · «Часть body» (`s9`)

**На экране сначала:** Человечек; браузер с названием ученика на вкладке и пустым окном; код <body> · … · </body>. Строка задания «Смотри: тело человечка».

### 1. `s9.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** «Прожектор» на теле человечка (остальное притухает)
- uz: «Sahifangizning nomi tayyor! Endi uning ichini to‘ldiramiz. html ichidagi ikkinchi asosiy qism — body. Ingliz tilida body «tana» degani. Odamchaning tanasiga qarang: undan nimalar chiqarkin?»
- ru: «Название готово. Теперь заполним саму страницу! Вторая часть внутри html — body, как тело человечка. Смотри, что из него вылетит!»
- en: «The name is ready. Now let’s fill the page itself! The second part inside html is body, like the buddy’s body. Watch what comes out of it!»

### 2. `s9.out`

- **Когда:** Тело загорелось, на него штампом клеится бирка body; окно обведено бирюзой, строки body в коде светятся; куски страницы (строка «Привет, мир!», полоски, картинка, кнопка «Играть») выглядывают на теле и по одному лесенкой вылетают в окно (≈1,1 с на кусок, шорох); на окно клеится такая же бирка body, в коде между тегами body появляется только текст «Привет, мир!» (картинка и кнопка — иллюстрация в окне, в коде их нет)
- **На экране:** Окно с кусками и бирка body
- uz: «Mana! Matn, rasm va tugma odamchaning tanasidan uchib chiqib, sahifada paydo bo‘ldi.»
- ru: «Вот это да! Текст, картинка и кнопка вылетели из тела в окно.»
- en: «How about that! The text, the picture and the button flew from the body into the window.»

### 3. `s9.done`

- **Когда:** Следом
- **На экране:** Строка задания — та же фраза; после реплики — «Дальше»
- uz: «Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar body qismida joylashadi.»
- ru: «Текст, картинки и кнопки, которые видны на странице, располагаются внутри body.»
- en: «The text, pictures and buttons you see on the page go inside body.»

## Экран 9 · Тройка 3, сделай сам · «Привет в окне» (`s10`)

**На экране сначала:** Браузер (окно подсвечено), код <body> · [поле] · </body>, пример «Например: Привет!». Кнопка «Готово».

### 1. `s10.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Пока звучит фраза, мигает поле ввода между тегами body (окно не подсвечено)
- uz: «Endi ochuvchi va yopuvchi body teglari orasidagi bo‘sh joyga salomlashish matnini yozing. Masalan, «Salom!».»
- ru: «Теперь напиши приветствие в пустом поле между тегами body. Например, «Привет!».»
- en: «Now type a greeting in the empty field between the body tags. For example, “Hello!”.»

### 2. `s10.sayWin`

- **Когда:** Следом
- **На экране:** «Прожектор» на окне браузера: лист приподнимается и светится бирюзой — здесь появится текст
- uz: «Yozgan matningiz darhol sahifada paydo bo‘ladi. So‘ng «Tayyor» tugmasini bosing.»
- ru: «Текст появится в окне. Потом нажми «Готово».»
- en: «The text will appear in the window. Then tap “Done”.»

### 3. `UI.noTags` — печатается, не звучит

- **Когда:** Ученик напечатал угловые скобки (печатается, не звучит)
- **На экране:** Строка задания; «Готово» выключена
- uz: «Bu yerga faqat matn yozing. Burchakli qavslar kerak emas.»
- ru: «Здесь нужны только слова, без угловых скобок.»
- en: «Only words here, no angle brackets.»

### 4. `s10.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** Строка задания
- uz: «Kodga qarang: body teglari orasidagi bo‘sh joyni toping.»
- ru: «Посмотри на код: между тегами body есть пустое поле.»
- en: «Look at the code: there’s an empty field between the body tags.»

### 5. `s10.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Salomlashish matni ochuvchi va yopuvchi body teglari orasiga yoziladi.»
- ru: «Текст пишут между двумя тегами body.»
- en: «The text goes between the two body tags.»

### 6. `s10.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Строка задания
- uz: «body teglari orasidagi bo‘sh joyni bosing va «Salom!» deb yozing. So‘ng «Tayyor» tugmasini bosing.»
- ru: «Нажми пустое поле между тегами body, напиши текст и нажми «Готово».»
- en: «Tap the empty field between the body tags, type your text and tap “Done”.»

### 7. `s10.ok`

- **Когда:** Ученик напечатал приветствие в поле (окно меняется сразу по мере набора) и нажал «Готово»
- **На экране:** Текст штампом подтверждается в окне; «Дальше»
- uz: «Ajoyib! Siz yozgan salomlashish matni endi sahifada ko‘rinib turibdi.»
- ru: «Отлично! Твоё приветствие уже в окне.»
- en: «Great! Your greeting is in the window.»

## Экран 10 · Закрепление · «Вкладка или окно?» (`s8`)

**На экране сначала:** Браузер (на вкладке название ученика, в окне его приветствие); над ним влетает полоска кода. Внизу кнопки «Вкладка» и «Окно». Счётчик раундов «1/3». Раунды: 1) <title>Космос</title>, 2) <body>Космос</body>, 3) <title>Финал в пятницу!</title>; после промаха — дополнительный раунд того же вида («Музыка» / «Сегодня концерт!»), счётчик «/4».

### 1. `s8.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Полоска кода первого раунда
- uz: «Endi o‘ynaymiz: o‘zingizni brauzer deb tasavvur qiling! Kodga qarang va matn qayerda paydo bo‘lishini toping: brauzer varag‘idami yoki oynadami?»
- ru: «А теперь игра: ты — браузер! Посмотри на строку кода и реши, где появится слово: на вкладке или в окне?»
- en: «Now a game: you’re the browser! Look at the line of code and decide where the word will show: on the tab or in the window?»

### 2. `s8.askTitle`

- **Когда:** Сразу за вступлением (раунд 1), а также в начале раундов 3 и дополнительных title-раундов; {w} — слово раунда (в речи без «!»)
- **На экране:** Кнопки включаются, когда вопрос дочитан
- uz: «title teglari orasida «{w}» deb yozilgan. Bu matn qayerda paydo bo‘ladi?»
- ru: «В title — «{w}». Ну-ка, где оно появится?»
- en: «title says “{w}”. So, where will it show up?»

### 3. `s8.askBody`

- **Когда:** В начале раунда 2 и дополнительного body-раунда
- **На экране:** То же
- uz: «Endi body teglari orasida «{w}» deb yozilgan. Bu safar matn qayerda paydo bo‘ladi?»
- ru: «А теперь в body — «{w}». Где оно появится на этот раз?»
- en: «Now body says “{w}”. Where will it show up this time?»

### 4. `s8.ok.title`

- **Когда:** Ученик верно нажал «Вкладка» в title-раунде
- **На экране:** Слово штампом встаёт на вкладку; «прожектор» на вкладке; кнопка «Вкладка» зеленеет. Через ~1 с — следующий раунд
- uz: «To‘g‘ri! title ichidagi matn brauzer varag‘ida paydo bo‘ldi.»
- ru: «Верно! Слово из title — на вкладке.»
- en: «Right! The word from title is on the tab.»

### 5. `s8.ok.body`

- **Когда:** Ученик верно нажал «Окно» в body-раунде
- **На экране:** Слово встаёт в окно; «прожектор» на окне; кнопка «Окно» зеленеет
- uz: «Topdingiz! body ichidagi matn brauzer oynasida paydo bo‘ldi.»
- ru: «В точку! Слово из body — в окне.»
- en: «Spot on! The word from body is in the window.»

### 6. `s8.miss.title`

- **Когда:** Ученик нажал «Окно» в title-раунде
- **На экране:** Браузер честно показывает слово на вкладке («прожектор» на вкладке), неверная кнопка бледнеет; добавляется дополнительный раунд
- uz: «Yana bir bor urinib ko‘ramiz! Matn title ichida yozilgan, shuning uchun u brauzer varag‘ida paydo bo‘ldi. Keling, yana bir misolni ko‘ramiz.»
- ru: «Ничего! Слово в title, поэтому оно на вкладке. Давай ещё пример.»
- en: «No worries! The word is in title, so it’s on the tab. Let’s try another one.»

### 7. `s8.miss.body`

- **Когда:** Ученик нажал «Вкладка» в body-раунде
- **На экране:** Слово в окне («прожектор» на окне); дополнительный раунд
- uz: «Yana bir bor urinib ko‘ramiz! Matn body ichida yozilgan, shuning uchun u brauzer oynasida paydo bo‘ldi. Keling, yana bir misolni ko‘ramiz.»
- ru: «Почти! Слово в body, поэтому оно в окне. Давай ещё пример.»
- en: «Almost! The word is in body, so it’s in the window. Let’s try another one.»

### 8. `s8.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1 (после двух промахов поднимается сама)
- **На экране:** Строка задания
- uz: «Matn qaysi teglar orasida yozilgan?»
- ru: «Между какими тегами стоит слово?»
- en: «Which tags is the word between?»

### 9. `s8.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «title ichidagi matn brauzer varag‘ida, body ichidagi matn esa brauzer oynasida ko‘rinadi.»
- ru: «Текст из title видно на вкладке, текст из body — в окне.»
- en: «Text from title shows on the tab, text from body in the window.»

### 10. `s8.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Строка кода подсвечена
- uz: «Teg nomiga qarang: title bo‘lsa, «Varaq» tugmasini bosing. body bo‘lsa, «Oyna» tugmasini bosing.»
- ru: «Прочитай имя тега: title — жми «Вкладка», body — жми «Окно».»
- en: «Read the tag name: for title tap “Tab”, for body tap “Window”.»

### 11. `s8.done`

- **Когда:** После ответа в последнем раунде — сразу за ok/miss этого раунда, одной репликой
- **На экране:** Подсвечены и вкладка, и окно; «Дальше»
- uz: «Ajoyib! Endi bilasiz: title ichidagi matn brauzer varag‘ida, body ichidagi matn esa brauzer oynasida ko‘rinadi.»
- ru: «Отличная игра! Текст из title — на вкладке, текст из body — в окне.»
- en: «Great game! Text from title goes on the tab, text from body in the window.»

## Экран 11 · Закрепление · «Разложи вырезки» (`s11`)

**На экране сначала:** Две зоны: горчичная head и бирюзовая body. Под ними 4 вырезки: <title>название ученика</title>, «Привет, мир!», «картинка», «Играть». Строка задания «Перетащи вырезку в head или в body», «0/4».

### 1. `s11.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Без подсветки
- uz: «Keling, har bir bo‘lakni o‘z joyiga qo‘yamiz! Uning joyi qayerda: head qismidami yoki body qismidami? Bo‘lakni kerakli qismga suring. Yoki avval bo‘lakni, keyin kerakli qismni bosing.»
- ru: «Наведём порядок! Где живёт каждая вырезка: в head или в body? Перетащи её или нажми вырезку, а потом часть.»
- en: «Let’s tidy up! Where does each cut-out live: in head or in body? Drag it, or tap a cut-out, then a part.»

### 2. `s11.items[0].why`

- **Когда:** Ученик положил название (в теге title) в body
- **На экране:** Вырезка трясётся, копия возвращается; причина — в строке задания
- uz: «Qarang, bu — title qatori. title head ichida joylashadi. Bu bo‘lakni head qismiga qo‘ying.»
- ru: «Смотри: это строка title. title стоит внутри head, поэтому её место в head.»
- en: «Look: this is the title line. title sits inside head, so it belongs in head.»

### 3. `s11.items[1].why`

- **Когда:** Ученик положил «Привет, мир!» в head
- **На экране:** То же
- uz: «Bu matn sahifada ko‘rinishi kerak. Shuning uchun uni body qismiga qo‘ying.»
- ru: «Почти! Этот текст должен быть виден в окне, значит, он в body.»
- en: «Almost! This text should show in the window, so it goes in body.»

### 4. `s11.items[2].why`

- **Когда:** Ученик положил картинку в head
- **На экране:** То же
- uz: «Rasm ham sahifada ko‘rinadi. Shuning uchun uning joyi body qismida.»
- ru: «Ничего! Картинку мы видим в окне, значит, она в body.»
- en: «No worries! We see the picture in the window, so it goes in body.»

### 5. `s11.items[3].why`

- **Когда:** Ученик положил кнопку в head
- **На экране:** То же
- uz: ««O‘ynash» tugmasi sahifada ko‘rinishi kerak. Demak, uning joyi ham body qismida.»
- ru: «Подумай: где мы нажимаем кнопку? В окне! Значит, она в body.»
- en: «Think: where do we press the button? In the window! So it goes in body.»

### 6. `s11.pickFirst` — печатается, не звучит

- **Когда:** Ученик нажал зону, не выбрав вырезку (печатается, не звучит)
- **На экране:** Строка задания
- uz: «Avval bo‘lakni tanlang.»
- ru: «Сначала выбери вырезку.»
- en: «Pick a cut-out first.»

### 7. `s11.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** Строка задания
- uz: «O‘ylab ko‘ring: bu bo‘lakdagi narsa sahifada ko‘rinadimi yoki brauzer varag‘idami?»
- ru: «Эту вещь видно в окне браузера?»
- en: «Can you see this in the browser window?»

### 8. `s11.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar body qismida joylashadi. title esa head ichida bo‘ladi.»
- ru: «Текст, картинки и кнопки страницы — в body. Строка title — в head.»
- en: «The page’s text, pictures and buttons go in body. The title line goes in head.»

### 9. `s11.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Светятся нужная вырезка и нужная зона
- uz: «Ajratib ko‘rsatilgan bo‘lakni ajratib ko‘rsatilgan joyga suring.»
- ru: «Перетащи светящуюся вырезку в светящееся место.»
- en: «Drag the glowing cut-out to the glowing place.»

### 10. `s11.ok`

- **Когда:** Все 4 вырезки на местах (каждая верная штампом встаёт в зону)
- **На экране:** «Дальше»
- uz: «Ajoyib, hammasi o‘z joyida! title head ichida, matn, rasm va tugma esa body ichida.»
- ru: «Порядок! title — в head, текст, картинка и кнопка — в body.»
- en: «All sorted! title is in head; the text, the picture and the button are in body.»

## Экран 12 · Тройка 4, объяснение · «Сверху вниз» (`s12`)

**На экране сначала:** Слева полный код страницы ученика (9 строк), справа пусто под коллаж. Кнопок нет. Строка задания «Смотри, как читает браузер».

### 1. `s12.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** После реплики браузер сам читает строки по одной (подсветка текущей строки, ~0,6 с, щелчок), справа собирается коллаж страницы ученика
- uz: «Endi sahifangizning to‘liq kodini ko‘rib chiqamiz. Brauzer kodni yuqoridan pastga o‘qib, sahifani yaratadi. Qanday o‘qishini kuzating!»
- ru: «Теперь посмотрим весь код целиком. Как работает браузер? Читает код сверху вниз и собирает страницу. Смотри!»
- en: «Now let’s see all the code. How does the browser work? It reads the code from top to bottom and builds the page. Watch!»

### 2. `s12.parts.doc`

- **Когда:** Когда страница собрана — Коди проходит по частям
- **На экране:** Подсвечены строка DOCTYPE и полоска DOCTYPE в коллаже
- uz: «Birinchi qatorda doctype html deb yozilgan. Bu — maxsus ko‘rsatma. U brauzerga: «Bu HTML hujjati», deb bildiradi. Unga yopuvchi teg kerak emas.»
- ru: «Первая строка <!DOCTYPE html> — особая. Она говорит браузеру: «Это HTML-страница». Пары у неё нет.»
- en: «The first line, <!DOCTYPE html>, is special. It tells the browser: “This is an HTML page.” It has no pair.»

### 3. `s12.parts.html`

- **Когда:** Следом
- **На экране:** Строки <html>/</html> и рамка коллажа
- uz: «Ochuvchi va yopuvchi html teglari orasida sahifaning barcha mazmuni joylashadi. head va body qismlari ham shu yerda.»
- ru: «Тег html обнимает всю страницу: внутри него head и body.»
- en: «The html tag hugs the whole page: head and body are inside it.»

### 4. `s12.parts.head`

- **Когда:** Следом
- **На экране:** Вся группа head (три строки) и голова коллажа
- uz: «Mana, head — sahifaning «boshi». Bu qismda sahifa haqidagi ma’lumotlar saqlanadi.»
- ru: «А вот head, «голова» страницы. В ней сведения о странице.»
- en: «Here’s head, the page’s “head”. It holds information about the page.»

### 5. `s12.parts.title`

- **Когда:** Следом
- **На экране:** Строка title и полоска title
- uz: «head ichida title joylashadi. Ochuvchi va yopuvchi title teglari orasiga sahifaning nomi yoziladi. Brauzer bu nomni brauzer varag‘ida ko‘rsatadi.»
- ru: «Внутри head — title. В нём пишут название страницы, браузер показывает это название на вкладке.»
- en: «Inside head is title. Inside it goes the page name, and the browser shows that name on the tab.»

### 6. `s12.order5`

- **Когда:** Следом
- **На экране:** Строки </head> и <body>, голова и тело коллажа
- uz: «Bu joyga e’tibor bering: avval head qismi yopiladi, keyin body qismi ochiladi.»
- ru: «Внимание, важный момент: сначала закрываем head, потом открываем body.»
- en: «Here’s an important bit: first head closes, then body opens.»

### 7. `s12.parts.body`

- **Когда:** Следом
- **На экране:** Вся группа body и тело коллажа
- uz: «Mana, body — sahifaning «tanasi». Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar shu qismda joylashadi.»
- ru: «А вот body, «тело» страницы. В нём текст, картинки и кнопки, которые видны на странице.»
- en: «And here’s body, the page’s “body”. It holds the text, pictures and buttons you see on the page.»

### 8. `s12.parts.text`

- **Когда:** Следом
- **На экране:** Строка текста и тело
- uz: «Mana, siz yozgan matn! U body ichida yozilgani uchun sahifada ko‘rinadi.»
- ru: «А вот и твой текст! Он внутри body, поэтому в окне.»
- en: «And here’s your text! It’s inside body, so it’s in the window.»

### 9. `s12.tapSay`

- **Когда:** Следом
- **На экране:** Строки и части коллажа становятся нажимаемыми; строка задания «Нажми строку или часть — Коди повторит»; «Дальше» уже доступна. По нажатию строки или части Коди повторяет соответствующую реплику parts.* (подсвечены её строки и блок)
- uz: «Biror qism haqidagi tushuntirishni yana eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi mos qismni bosing. Men yana tushuntirib beraman.»
- ru: «Хочешь услышать какую-то часть ещё раз? Нажми строку кода или часть справа, и я расскажу.»
- en: «Want to hear a part again? Tap a code line or a part on the right, and I’ll tell you.»

## Экран 13 · Тройка 4, сделай сам · «Собери основу страницы» (`s13`)

**На экране сначала:** Слева 9 строк: первая <!DOCTYPE html> на месте, ниже 8 пустых пунктирных (текущая отмечена). Справа лоток из 8 полосок вперемешку. Строка задания «Расставь полоски по порядку», «0/8».

### 1. `s13.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Без подсветки
- uz: «Endi sahifangizning to‘liq kodini o‘zingiz yig‘ing! Birinchi qator allaqachon joyida. O‘ngdagi bo‘laklardan birini bosing — u navbatdagi bo‘sh qatorga joylashadi.»
- ru: «А теперь главное испытание: собери весь код! Первая строка уже стоит. Нажми полоску — она встанет в следующую пустую строку.»
- en: «Now the big challenge: build the whole code! The first line is in place. Tap a strip, and it goes into the next empty line.»

### 2. `s13.sayMove`

- **Когда:** Один раз — после первой поставленной полоски (не значит, что она стоит неверно)
- **На экране:** Стрелки ▲ ▼ у поставленной полоски мигают
- uz: «Tartibni o‘zgartirish uchun bo‘lakni yuqoriga yoki pastga yo‘nalgan strelkalar yordamida suring. Barcha qatorlarni joyiga qo‘ygach, «Tekshirish» tugmasini bosing.»
- ru: «Если нужно изменить порядок, сдвинь полоску стрелками вверх или вниз. Когда всё на местах, нажми «Проверить».»
- en: «If you need to change the order, move a strip up or down with the arrows. When everything’s in place, tap “Check”.»

### 3. `s13.rules.html`

- **Когда:** Все 8 на местах, нажато «Проверить»: открывающий html не сразу после DOCTYPE или закрывающий не в конце
- **На экране:** Мягкий звук; нарушившие правило полоски отмечены; правило — в строке задания
- uz: «doctype qatoridan so‘ng darhol ochuvchi html tegini qo‘ying. Yopuvchi html tegi esa eng oxirida bo‘lishi kerak.»
- ru: «После строки DOCTYPE поставь открывающий тег html. Закрывающий — в самом конце.»
- en: «Put the opening html tag right after the DOCTYPE line. The closing one goes at the very end.»

### 4. `s13.rules.pair`

- **Когда:** …закрывающий тег раньше своего открывающего
- **На экране:** То же
- uz: «Avval ochuvchi teg, undan keyin unga mos yopuvchi teg kelishi kerak.»
- ru: «Закрывающий тег стоит после своего открывающего.»
- en: «A closing tag comes after its opening tag.»

### 5. `s13.rules.order`

- **Когда:** …body раньше head
- **На экране:** То же
- uz: «Avval head qismi, keyin body qismi keladi.»
- ru: «Сначала идёт head, потом body.»
- en: «head comes first, then body.»

### 6. `s13.rules.headClose`

- **Когда:** …head не закрыт до начала body
- **На экране:** То же
- uz: «Avval head qismini yoping, keyin body qismini oching.»
- ru: «head нужно закрыть до того, как начнётся body.»
- en: «Close head before body starts.»

### 7. `s13.rules.title`

- **Когда:** …title вне head
- **На экране:** То же
- uz: «title qatorini ochuvchi va yopuvchi head teglari orasiga qo‘ying.»
- ru: «title стоит внутри head.»
- en: «title goes inside head.»

### 8. `s13.rules.text`

- **Когда:** …текст вне body
- **На экране:** То же
- uz: «Siz yozgan matnni ochuvchi va yopuvchi body teglari orasiga qo‘ying.»
- ru: «Текст страницы стоит внутри body.»
- en: «The page text goes inside body.»

### 9. `s13.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1 (после двух неверных проверок поднимается сама)
- **На экране:** Строка задания
- uz: «doctype qatoridan keyin qaysi teg keladi? Eng oxirida-chi?»
- ru: «Какой тег стоит сразу после DOCTYPE, а какой — в самом конце?»
- en: «Which tag comes right after DOCTYPE, and which one goes at the very end?»

### 10. `s13.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «html ichida avval head, keyin body joylashadi. title qatori head ichida, siz yozgan matn esa body ichida bo‘ladi.»
- ru: «Внутри html сначала head с title, потом body с текстом.»
- en: «Inside html: first head with title, then body with the text.»

### 11. `s13.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Отмеченные полоски светятся. Механика: нажал одну поставленную полоску (она приподнимается), потом другую — они меняются местами (так же работают перетаскивание одной на другую и стрелки ▲ ▼)
- uz: «Belgilangan bo‘laklardan birini, keyin ikkinchisini bosing. Ular o‘rin almashadi.»
- ru: «Нажми одну отмеченную полоску, потом другую — они поменяются местами.»
- en: «Tap one marked strip, then the other: they swap places.»

### 12. `s13.ok`

- **Когда:** Порядок верный, нажато «Проверить»
- **На экране:** Звук победы; «Дальше»
- uz: «Qoyil, kodni to‘g‘ri yig‘dingiz! Sahifaning nomi title teglari orasida, title esa head ichida. Siz yozgan matn body ichida.»
- ru: «Вот это да, код собран верно! Название — в head, текст — в body.»
- en: «Look at that, the code is right! The page name is in head, the text is in body.»

## Экран 14 · Тройка 4, закрепление · «Текст попал на вкладку» (`s14`)

**На экране сначала:** Браузер: на вкладке «название </head> <body> привет </body> </html>», окно пустое. Код: в строке <title>название вместо </title> — пустое место. Лоток: </title>, <title>, </head>.

### 1. `s14.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Вкладка подсвечена
- uz: «Qarang, nimadir noto‘g‘ri! Sahifaning barcha matni brauzer varag‘ida paydo bo‘ldi, oyna esa bo‘sh qoldi. title qatorida bitta teg yetishmayapti.»
- ru: «Ну и дела! На вкладку уехал весь текст страницы, а окно пустое. В строке title не хватает одного тега.»
- en: «Something broke! All the page text went to the tab, and the window is empty. One tag is missing in the title line.»

### 2. `s14.sayHow`

- **Когда:** Следом
- **На экране:** Пустое место в строке title мигает
- uz: «Keling, xatoni tuzatamiz! Kerakli tegni bo‘sh joyga suring yoki tegning o‘zini bosing.»
- ru: «Починим? Перетащи нужный тег в пустое место или просто нажми его.»
- en: «Shall we fix it? Drag the right tag into the empty spot, or just tap it.»

### 3. `s14.why.<title>`

- **Когда:** Ученик выбрал <title> (перетащил или нажал)
- **На экране:** Тег бледнеет и выключается; причина — в строке задания
- uz: «Bu — ochuvchi teg. title allaqachon ochilgan. Endi uni yopish kerak.»
- ru: «Почти! Это открывающий тег, а title уже открыт. Теперь его нужно закрыть.»
- en: «Almost! That’s an opening tag, and title is already open. Now it needs to close.»

### 4. `s14.why.</head>`

- **Когда:** Ученик выбрал </head>
- **На экране:** То же; после двух ошибок светится </title>
- uz: «Bu teg head qismini yopadi. Avval title qismini yopish kerak, keyin head yopiladi.»
- ru: «Не спеши! head закроется позже. Сначала должно закончиться название, поэтому закрой title.»
- en: «Not so fast! head closes later. First the page name has to end, so close title.»

### 5. `s14.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** Строка задания
- uz: «Kodga qarang: qaysi teg ochilgan, lekin hali yopilmagan?»
- ru: «Какой тег открыт, но не закрыт?»
- en: «Which tag is open but not closed?»

### 6. `s14.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «title ochilgan, lekin yopilmagan. Uni yopish uchun qaysi teg kerak?»
- ru: «title открыт. Нужен тег, который его закрывает.»
- en: «title is open. You need the tag that closes it.»

### 7. `s14.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Светятся </title> и пустое место
- uz: «Qiya chiziqli yopuvchi title tegini bo‘sh joyga qo‘ying.»
- ru: «Поставь в пустое место тег title с косой чертой.»
- en: «Put the title tag with a slash into the empty spot.»

### 8. `s14.ok`

- **Когда:** Ученик выбрал </title>
- **На экране:** Звук победы; тег штампом встаёт в строку, на вкладке остаётся название, приветствие падает в окно; «Дальше»
- uz: «Ajoyib, xato tuzatildi! Endi sahifaning nomi brauzer varag‘ida, salomlashish matni esa oynada. Yopuvchi title tegi nom qayerda tugashini bildirdi.»
- ru: «Починили! Название на вкладке, текст в окне. Закрывающий тег title показал, где кончается название.»
- en: «Fixed it! The name is on the tab, the text is in the window. The closing title tag showed where the name ends.»

## Экран 15 · Итоговая проверка · «Вкладка и окно» (`q1`)

**На экране сначала:** Браузер (вкладка index.html, окно пустое) и код: <head> · <title>[место]</title> · </head> · <body> · [место] · </body>. Внизу фразы «Роботы» и «Привет!». До первой попытки места не подсвечены.

### 1. `q1.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Без подсветки
- uz: «Endi o‘zingizni sinab ko‘ring! Yangi sahifada «Robotlar» brauzer varag‘ida, «Salom!» esa oynada ko‘rinishi kerak. Har bir matnni koddagi kerakli joyga suring. Yoki avval matnni, keyin uning joyini bosing.»
- ru: «Теперь проверь себя! Новая страница: на вкладке должно быть «Роботы», в окне — «Привет!». Перетащи каждую фразу на её место в коде. Или нажми фразу, потом место.»
- en: «Now test yourself! A new page: the tab should say “Robots”, the window “Hello!”. Drag each phrase to its place in the code. Or tap a phrase, then the place.»

### 2. `q1.toWin`

- **Когда:** Ученик положил «Роботы» в body ({w} — фраза)
- **На экране:** Браузер на миг показывает фразу в окне («прожектор» на окне), фраза возвращается в лоток; причина — в строке задания
- uz: «Qarang, «{w}» oynada paydo bo‘ldi. Chunki body ichidagi matn oynada ko‘rinadi. Uni brauzer varag‘ida ko‘rsatish uchun title teglari orasiga qo‘yish kerak.»
- ru: «Смотри: «{w}» попало в окно. Текст из body виден в окне, а для вкладки нужен title.»
- en: «Look: “{w}” landed in the window. Text in body shows in the window, and the tab needs title.»

### 3. `q1.toTab`

- **Когда:** Ученик положил «Привет!» в title
- **На экране:** Фраза на миг на вкладке («прожектор» на вкладке), возвращается
- uz: «Qarang, «{w}» brauzer varag‘ida paydo bo‘ldi. Chunki title ichidagi matn varaqda ko‘rinadi. Uni oynada ko‘rsatish uchun body teglari orasiga qo‘yish kerak.»
- ru: «Смотри: «{w}» попало на вкладку. Текст из title виден на вкладке, а для окна нужен body.»
- en: «Look: “{w}” landed on the tab. Text in title shows on the tab, and the window needs body.»

### 4. `q1.pickFirst` — печатается, не звучит

- **Когда:** Ученик нажал место, не выбрав фразу (печатается, не звучит)
- **На экране:** Строка задания
- uz: «Avval matnni tanlang.»
- ru: «Сначала выбери фразу.»
- en: «Pick a phrase first.»

### 5. `q1.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1
- **На экране:** Строка задания
- uz: «Brauzer varag‘ida ko‘rinadigan matn qaysi teglar orasiga yoziladi?»
- ru: «В каком теге текст для вкладки?»
- en: «Which tag holds the text for the tab?»

### 6. `q1.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Brauzer varag‘idagi nom title teglari orasiga, oynadagi matn esa body teglari orasiga yoziladi.»
- ru: «Для вкладки — title, для окна — body.»
- en: «For the tab: title. For the window: body.»

### 7. `q1.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Светятся фраза и её место
- uz: «Ajratib ko‘rsatilgan matnni ajratib ko‘rsatilgan joyga suring.»
- ru: «Перетащи светящуюся фразу в светящееся место.»
- en: «Drag the glowing phrase to the glowing place.»

### 8. `q1.ok`

- **Когда:** Обе фразы на местах (каждая верная штампом встаёт в код и честно появляется на вкладке или в окне)
- **На экране:** «Дальше»
- uz: «Ajoyib! «Robotlar» title ichida, shuning uchun brauzer varag‘ida ko‘rinadi. «Salom!» esa body ichida, shuning uchun oynada ko‘rinadi.»
- ru: «Идеально! «Роботы» в title — поэтому на вкладке. «Привет!» в body — поэтому в окне.»
- en: «Perfect! “Robots” is in title, so it’s on the tab. “Hello!” is in body, so it’s in the window.»

## Экран 16 · Итоговая проверка · «Зачем нужен </title>?» (`q2`)

**На экране сначала:** Строка кода <title>название ученика</title>, закрывающий тег выделен; три варианта: «Показывает название в окне» · «Показывает, где заканчивается название страницы» (верный) · «Начинает новую страницу». До первой попытки ничего не подсвечено.

### 1. `q2.say`

- **Когда:** Сразу при открытии экрана
- **На экране:** Варианты включаются, когда вопрос дочитан
- uz: «Endi oxirgi savol! Yopuvchi title tegi nima uchun kerak? To‘g‘ri javobni tanlang.»
- ru: «И последний вопрос. Как думаешь, зачем нужен закрывающий тег title? Нажми ответ.»
- en: «And the last question. What do you think: why do we need the closing title tag? Tap an answer.»

### 2. `q2.opts[0].why`

- **Когда:** Ученик выбрал «Показывает название в окне»
- **На экране:** Вариант гаснет; причина — в строке задания; можно выбрать снова
- uz: «Yana o‘ylab ko‘ring: sahifaning nomi oynada emas, brauzer varag‘ida ko‘rinadi. Yopuvchi title tegi esa nom qayerda tugashini bildiradi.»
- ru: «Не совсем: закрывающий тег на странице не виден и название в окно не выводит.»
- en: «Not quite: a closing tag doesn’t show on the page and doesn’t put the name in the window.»

### 3. `q2.opts[2].why`

- **Когда:** Ученик выбрал «Начинает новую страницу»
- **На экране:** То же
- uz: «Yana o‘ylab ko‘ring: bu teg yangi sahifani boshlamaydi. U sahifa nomi qayerda tugashini bildiradi.»
- ru: «Не совсем: этот тег не начинает новую страницу. Он показывает, где заканчивается название.»
- en: «Not quite: this tag doesn’t start a new page. It shows where the name ends.»

### 4. `q2.hints[0]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 1 (после двух ошибок поднимается сама)
- **На экране:** Строка задания
- uz: «Sahifa matni brauzer varag‘ida paydo bo‘lgan misolni eslang. O‘shanda qaysi teg yetishmayotgan edi?»
- ru: «Вспомни страницу, где текст попал на вкладку. Какого тега там не хватало?»
- en: «Remember the page where the text ended up on the tab. Which tag was missing there?»

### 5. `q2.hints[1]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 2
- **На экране:** Строка задания
- uz: «Ochuvchi teg boshlanishni, yopuvchi teg esa tugashni bildiradi. title teglari orasiga nima yoziladi?»
- ru: «Тег с косой чертой заканчивает часть. Что стоит внутри title?»
- en: «A tag with a slash ends a part. What’s inside title?»

### 6. `q2.hints[2]`

- **Когда:** Ученик нажал лампочку (или вторая ошибка подряд подняла ступень): Коди читает эту ступень, она встаёт в строку задания — ступень 3
- **На экране:** Подсвечен верный вариант
- uz: «Yopuvchi title tegi sahifa nomi qayerda tugashini bildiradi.»
- ru: «Закрывающий тег title заканчивает название страницы.»
- en: «The closing title tag ends the page name.»

### 7. `q2.ok`

- **Когда:** Ученик выбрал верный вариант
- **На экране:** Вариант зеленеет; звук победы; «Дальше»
- uz: «To‘g‘ri! Yopuvchi title tegi brauzerga sahifa nomi qayerda tugashini bildiradi. Usiz sahifaning qolgan matni ham brauzer varag‘ida paydo bo‘lishi mumkin.»
- ru: «Точно! Он показывает, где кончается название. Без него текст страницы уезжает на вкладку.»
- en: «Exactly! It shows where the name ends. Without it, the page text ends up on the tab.»

## Экран 17 · Вывод (`s15`)

**На экране сначала:** Слева влетает бумажный коллаж страницы ученика (DOCTYPE, рамка html, голова с его title, тело с его приветствием), в углу машет человечек. Справа список ролей html / head / title / body и плашка «Следующий урок: Добавим большой заголовок и абзацы». Через 0,9 с — конфетти и аплодисменты.

### 1. `s15.say[0].text`

- **Когда:** Сразу при открытии экрана
- **На экране:** Без подсветки
- uz: «Mana, siz yaratgan birinchi sahifa!»
- ru: «Вот она, твоя первая страница!»
- en: «Here it is, your very first page!»

### 2. `s15.say[1].text`

- **Когда:** Следом
- **На экране:** Без подсветки
- uz: «Esingizdami? Teg nomi burchakli qavslar orasiga yoziladi. Brauzer tegni o‘qiydi, lekin uni sahifada ko‘rsatmaydi.»
- ru: «Помнишь? Тег — слово в угловых скобках. Браузер его не показывает, а читает.»
- en: «Remember? A tag is a word in angle brackets. The browser doesn’t show it, it reads it.»

### 3. `s15.say[2].text`

- **Когда:** Следом
- **На экране:** Подсвечены рамка html в коллаже и строка «html» в списке
- uz: «html ichida sahifaning ikkita asosiy qismi joylashadi: head va body.»
- ru: «Всю страницу собирает html: и head, и body — внутри него.»
- en: «html holds the whole page: both head and body are inside it.»

### 4. `s15.say[3].text`

- **Когда:** Следом
- **На экране:** Голова и строка «head»
- uz: «head qismida sahifa haqidagi ma’lumotlar saqlanadi.»
- ru: «head хранит сведения о странице.»
- en: «head keeps information about the page.»

### 5. `s15.say[4].text`

- **Когда:** Следом
- **На экране:** title в голове и строка «title»
- uz: «title head ichida joylashadi. title teglari orasiga sahifaning nomi yoziladi. Brauzer bu nomni brauzer varag‘ida ko‘rsatadi.»
- ru: «title стоит внутри head. В нём пишут название страницы, браузер показывает это название на вкладке.»
- en: «title is inside head. Inside it goes the page name, and the browser shows that name on the tab.»

### 6. `s15.say[5].text`

- **Когда:** Следом
- **На экране:** Тело и строка «body»
- uz: «Sahifada ko‘rinadigan matnlar, rasmlar va tugmalar body qismida joylashadi.»
- ru: «Текст, картинки и кнопки, которые видны на странице, располагаются внутри body.»
- en: «The text, pictures and buttons you see on the page go inside body.»

### 7. `s15.say[6].text`

- **Когда:** Следом
- **На экране:** Праздник (поза celebrate); после реплики включается «Завершить урок» → урок один раз вызывает onFinished
- uz: «Tabriklayman! Birinchi HTML sahifangizni yaratdingiz! Keyingi darsda sahifangizga katta sarlavha va matn uchun abzatslar qo‘shamiz.»
- ru: «Ура! Твоя первая HTML-страница готова. Ты на шаг ближе к настоящему веб-программисту!»
- en: «Hooray! Your first HTML page is ready. You’re one step closer to being a real web developer!»
