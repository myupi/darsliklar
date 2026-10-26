# Урок 1 «Бумажная страница» — редактура реплик (сценарий для обновления)

26.10.2026. **Внесено в урок 26.10.2026** (по «делай» заказчика): реплики, порядок экранов (П1–П3) и изменения визуала В1, В4–В11 сделаны; В3 (рамка только вокруг окна) пробовали — заказчик вернул рамку вокруг всего браузера, «как раньше» в `tools/kollazh/`, урок пересобран; В2 (подсветка всего браузера на `s1.say`) не делалась. Ниже — исходный документ, каким он был предложен; номера экранов в нём — прежние (1–18), в уроке теперь 17 экранов (соответствие — раздел 2).

Исходная пометка: это предложение, код, механика и анимации урока **не менялись**. Сценарий опирается на текущую реализацию:
- тексты — `tools/kollazh/kollazh.src.jsx` (объекты `C`, `UI`);
- порядок и поведение экранов — `tools/kollazh/kollazh-screens.jsx`;
- показ и озвучка — `tools/kollazh/kollazh-kit.jsx`: `useKzDemo`, а для узбекского слова «teg» в озвучке — `kzTagWord`.

Если новая реплика требует другого показа, это отмечено как **[нужно]**. Всё, что уже работает в уроке, помечено **[есть]**.

Номера экранов — исходные (1–18), рядом ключ экрана (`s1`, `tg1` …). Ключ каждой реплики сохранён. Новые ключи помечены **(новый)**, удалённые и объединённые перечислены в разделе 6.

Значки:
- ▶ — обязательная реплика: звучит у каждого ученика;
- ✖ — реакция на ошибку;
- 💡 — ступень подсказки по лампочке;
- ✔ — подтверждение результата.

---

## 1. Главные проблемы нынешних реплик

1. **Начало перегружено, а хук не вызывает вопроса.**
   - До превращения звучат четыре реплики (`s1.say`, `s1.sayTab`, `s1.sayWin`, `s1.sayGo`). Две из них — объяснение вкладки и окна, раньше, чем ученику это стало интересно.
   - Сам хук обещает «секрет» («Теперь нажми «Превратить» — покажу секрет»), но не ставит вопроса, на который превращение отвечает.
   - Сразу за превращением идёт план из шести реплик (экран 2): ещё ~25 секунд слушания до первого объяснения.
2. **Абстрактные фразы без видимого объекта.**
   - `s3.say` «Браузер узнаёт части страницы по тегам» звучит, пока подсвечена вся рамка: абстракция, к которой не привязан объект.
   - `tg1.pair` «он помогает браузеру узнавать части страницы» — непонятно, какие части: ученик видит одно слово.
   - `s12.parts.doc` «показывать страницу по современным правилам HTML» — 10-летнему ни о чём не говорит.
3. **В одной реплике несколько мыслей.**
   - `tg1.slash`: «Косая черта стоит сразу после первой скобки — это закрывающий тег. Открывающий начинает, закрывающий заканчивает, а текст — между ними» — три мысли.
   - `s9.say`: метафора тела, правило body и команда «Смотри» в одной реплике.
4. **Слова опережают картинку.**
   - На экране 3 подпись «открывающий» появляется под тегом в момент `tg1.pair`, а слово «открывающий» звучит только в следующей реплике.
   - На экране 7 `s6.sayInfo` говорит об окне раньше, чем окно было названо и показано (сейчас оно объяснено в хуке, который мы облегчаем).
5. **Действие не всегда названо.**
   - `s5.say` (экран 6) не говорит, как переносить теги: это показывает только рука.
   - `s11.say` говорит «перетащи», но не про запасное нажатие.
   - `s13.say` (экран 14) не объясняет новую механику — нажать полоску, двигать ▲ ▼, «Проверить».
   - `s4.say` не называет кнопку «Проверить».
6. **Порядок «вкладка/окно» до body.** Экран 9 (`s8`) спрашивает «где появится слово», когда body ещё не объяснён. Отсюда понадобилось правило «текст без тегов — в окно». Оно верно только для показанного примера и расходится с методическим ограничением.
7. **Повторы и канцелярит.**
   - «Здесь документ заканчивается» и «документ не закрыт» — слово «документ» рядом со «страницей».
   - «Всё верно» после каждого раунда.
   - «Твоё название уже на вкладке!» и «Твой текст уже виден в окне!» — восклицания там, где достаточно подтверждения.
8. **Смыслы, которые подсказывает картинка.** На экранах 4–6 рамка `html` обнимает весь бумажный браузер вместе с вкладкой и адресной строкой. Картинка подсказывает «html = интерфейс браузера» (раздел 5, зависимость В3).

**Что сильное и сохраняется — экран 5 (`s4`).** Он понятен, потому что идёт по четырём шагам:
1. **Видимая задача:** у рамки нет нижнего края, на его месте пунктир.
2. **Конкретная инструкция с местом:** «Напиши в пустую строку…», и пунктир со строкой мигают вместе, пока Коди говорит.
3. **Действие** маленькое и одно.
4. **Результат заметный и тот же, что был задачей:** край въезжает, тег штампом встаёт в угол.

Каждая ошибка называет одну конкретную причину («Это открывающий тег. В закрывающем перед словом html стоит косая черта»). Этот же порядок «видно → сказано где → одно действие → видно то же место изменённым» положен в основу всех заданий ниже. Реплики экрана 5 почти не меняются: только вместо «документ не закрыт» прямо сказано, чего не хватает, и названа кнопка «Проверить».

## 2. Новый порядок блоков

Экран 2 (`s2`, план) удалён. Экран 9 (`s8`) перенесён после практики с body и проверяет оба правила сразу: title → вкладка, body → окно. Строки без тегов из него убраны.

| Шаг | Исходный экран | Ключ | Роль |
|---|---|---|---|
| 1 | 1 | `s1` | Хук: «Если бы страница была человеком?» → превращение → короткая цель |
| 2 | 3 | `tg1` | Объяснение: что такое тег, открывающий и закрывающий |
| 3 | 4 | `s3` | Объяснение: пара тегов html |
| 4 | 5 | `s4` | Сам делает: закрыть `</html>` |
| 5 | 6 | `s5` | Закрепление: теги по местам |
| 6 | 7 | `s6` | Объяснение: head и title, название на вкладке |
| 7 | 8 | `s7` | Сам делает: своё название в title |
| 8 | 10 | `s9` | Объяснение: body, содержимое в окне |
| 9 | 11 | `s10` | Сам делает: своё приветствие в body |
| 10 | 9 | `s8` | Закрепление (перенесено): по строке кода — вкладка или окно (title / body) |
| 11 | 12 | `s11` | Закрепление: разложить вырезки по head и body |
| 12 | 13 | `s12` | Объяснение: весь код сверху вниз, DOCTYPE |
| 13 | 14 | `s13` | Сам делает: собрать основу |
| 14 | 15 | `s14` | Закрепление: починить пропущенный `</title>` |
| 15 | 16 | `q1` | Итоговая проверка: «Роботы» и «Привет!» по местам |
| 16 | 17 | `q2` | Итоговая проверка: зачем `</title>` |
| 17 | 18 | `s15` | Вывод |

**Почему экран 9 стоит после экрана 11.**
- **Ученик уже знает обе части.** К этому месту он видел title и вкладку (экраны 7–8) и body и окно (экраны 10–11), так что выбор «вкладка или окно» опирается на изученное.
- **Не нужно правило «текст без тегов — в окно».** Оно больше не требуется, и спорное утверждение уходит из урока.
- **Пересечения с итоговым экраном 16 нет.** Экран 9 проверяет **чтение**: по готовой строке кода предсказать результат. Экран 16 проверяет **запись**: самому поставить текст в нужный тег. Разные умения, полезны обе проверки.

**Зависимости этого порядка:**
- **[нужно] П1.** Удалить `S2` из `SCREENS` и `SCREEN_RESET`, обновить автопроверку (экранов станет 17).
- **[нужно] П2.** Переставить `S8` после `S10`.
- **[нужно] П3.** В данных `C.s8.rounds` второй раунд `kind: 'raw'` заменить на раунд с body: строка кода `<body>Космос</body>`, верный ответ «Окно». Дополнительный раунд — с «Музыка». Браузер в этом раунде ставит слово в окно, а на вкладке остаётся название ученика.

## 3. Три варианта хука и выбор

1. **«Если бы веб-страница была человеком, как бы она выглядела? Нажми «Превратить».»** Прямой вопрос, на который превращение тут же отвечает. Говорит только о странице.
2. «У каждой веб-страницы есть голова и тело. Не веришь? Нажми «Превратить».» Живо, но ответ выдан до действия, и «голова» звучит раньше, чем её видно.
3. «Представь: страница ожила. Где у неё голова? Нажми «Превратить».» Интересно, но вопрос «где голова» уводит к поиску, а не к превращению.

**Выбран вариант 1.** Он вызывает вопрос, превращение на него отвечает, и до ответа не нужно ни одного нового слова.

---

## 4. Полный сценарий

### Шаг 1 · исходный экран 1 · `s1` · Хук

**Цель.** Удивить, показать вкладку на её месте и ответить на вопрос «если бы страница была человеком».

▶ **`s1.say`** · акцент: весь бумажный браузер **[нужно: мягкая подсветка всего браузера; сейчас реплика без подсветки]**
- uz: «Salom! Men Kodi. Mana bu veb-sahifa.»
- ru: «Привет! Я Коди. Вот веб-страница.»
- en: «Hi! I’m Kodi. Here’s a web page.»

▶ **`s1.sayTab`** · акцент: вкладка **[есть]**
- uz: «Tepadagi kichik joyga qarang. Bu brauzer yorlig‘i, unda sahifa nomi yozilgan.»
- ru: «Посмотри на маленькое место сверху. Это вкладка браузера, на ней название страницы.»
- en: «Look at the small spot at the top. That’s the browser tab. It shows the page name.»

▶ **`s1.sayGo`** · акцент: кнопка «Превратить», огонёк **[есть]**
- uz: «Agar veb-sahifa odam bo‘lsa, qanday ko‘rinardi? «Aylantirish» tugmasini bosing.»
- ru: «А если бы веб-страница была человеком, как бы она выглядела? Нажми «Превратить».»
- en: «What if a web page were a person? What would it look like? Tap “Transform”.»

**Действие:** нажать «Превратить» → браузер разбирается и собирается в человечка **[есть]**.

▶ **`s1.magic`** · акцент: человечек машет **[есть]**
- uz: «Mana! Sahifa odamchaga aylandi.»
- ru: «Вот! Страница превратилась в человечка.»
- en: «There! The page turned into a paper buddy.»

▶ **`s1.magicHead`** · акцент: голова **[есть]**
- uz: «Sahifa nomi uning boshiga kirib ketdi. Boshda sahifa haqidagi ma’lumotlar turadi.»
- ru: «Название страницы спряталось у него в голове. В голове хранятся сведения о странице.»
- en: «The page name went into its head. The head keeps information about the page.»

▶ **`s1.magicWin`** · акцент: тело **[есть]**
- uz: «Tanasi esa sahifada ko‘rinadigan narsalardan yasaldi: matn, rasm va tugma.»
- ru: «А тело собралось из того, что видно на странице: текста, картинки и кнопки.»
- en: «And the body is made of what you see on the page: text, a picture and a button.»

▶ **`s1.done`** · акцент: человечек целиком
- uz: «Bugun shunday sahifani kod bilan o‘zingiz yig‘asiz. Avval brauzer kodni qanday o‘qishini ko‘ramiz.»
- ru: «Сегодня ты соберёшь такую страницу кодом. Сначала посмотрим, как браузер читает код.»
- en: «Today you’ll build a page like this with code. First, let’s see how the browser reads code.»

**Надписи**
- `s1.askLook`:
  - uz «Qarang: brauzer yorlig‘i»
  - ru «Смотри: вкладка браузера»
  - en «Look: the browser tab»
- `s1.ask`: без изменений — «Aylantirish» tugmasini bosing / Нажми «Превратить» / Tap “Transform”.
- `s1.askDone`:
  - uz «Boshda — sahifa haqida ma’lumot, tanada — ko‘rinadigan narsalar»
  - ru «В голове — сведения о странице, в теле — то, что видно»
  - en «The head keeps page info, the body is what you see»

**Изменения визуала и механики**
- **В1.** `s1.sayWin` удалена из очереди реплик в `S1`: окно объясняется на шаге 6, когда его видно.
- **В2.** Подсветка всего браузера на `s1.say` — по желанию.

### Шаг 2 · исходный экран 3 · `tg1` · Что такое тег

**Цель.** Тег отличается от текста: браузер его не показывает. Открывающий тег начинает часть, закрывающий (с косой чертой) заканчивает.

▶ **`tg1.say`** · акцент: слово html в коде и «html» в окне **[есть]**
- uz: «Kodga html so‘zini yozdik. Brauzer uni oddiy matn qilib ko‘rsatdi.»
- ru: «Мы написали в коде слово html. Браузер показал его как обычный текст.»
- en: «We wrote the word html in the code. The browser showed it as plain text.»

▶ **`tg1.askPair`** · акцент: слово загорается, к нему слетаются угловые скобки **[есть]**
- uz: «Endi so‘zni burchakli qavslarga olamiz.»
- ru: «Теперь поставим слово в угловые скобки.»
- en: «Now let’s put the word in angle brackets.»

▶ **`tg1.pair`** · акцент: окно (слово исчезло) → тег в коде **[есть]**; подпись «открывающий» в этот момент **не показывать** **[нужно]**
- uz: «Qarang, so‘z sahifadan yo‘qoldi. Burchakli qavsdagi so‘z teg deyiladi. Brauzer tegni ko‘rsatmaydi, uni o‘qib oladi.»
- ru: «Смотри, слово исчезло со страницы. Слово в угловых скобках называется тег. Браузер не показывает тег, а читает его.»
- en: «Look, the word disappeared from the page. A word in angle brackets is called a tag. The browser doesn’t show a tag. It reads it.»

▶ **`tg1.askSlash`** · акцент: первый тег, подпись «открывающий» **[нужно: показывать подпись здесь, а не на прошлой реплике]**
- uz: «Bu ochuvchi teg. U qism shu yerda boshlanishini bildiradi.»
- ru: «Это открывающий тег. Он отмечает, где часть начинается.»
- en: «This is an opening tag. It marks where a part begins.»

▶ **`tg1.slash`** · акцент: влетает `</html>`, крупная косая черта, подпись «закрывающий» **[есть]**
- uz: «Qism qayerda tugashini qiya chiziqli teg bildiradi. Qiya chiziq birinchi qavsdan keyin turadi. Bu yopuvchi teg.»
- ru: «Где часть заканчивается, отмечает тег с косой чертой. Черта стоит сразу после первой скобки. Это закрывающий тег.»
- en: «A tag with a slash marks where a part ends. The slash goes right after the first bracket. This is a closing tag.»

▶ **`tg1.done`** · акцент: текст «Привет, мир!» между двумя тегами и в окне **[нужно: подсветка текста между тегами и в окне]**
- uz: «Ochuvchi va yopuvchi teg juft bo‘lib keladi. Matn ularning orasida turadi.»
- ru: «Открывающий и закрывающий теги идут парой. Текст стоит между ними.»
- en: «Opening and closing tags come as a pair. The text goes between them.»

**Надписи:** `tg1.aPair`, `tg1.aSlash`, `tg1.aDone`, `tg1.open`, `tg1.close` — без изменений.

**Изменения**
- **В4.** Подпись «открывающий» появляется на `tg1.askSlash` (сейчас — вместе со скобками, раньше слова).
- **В5.** Подсветка текста между тегами на `tg1.done`.
- В описании урока есть повтор «под тегом подпись «открывающий»» — это опечатка документа, не урока.

### Шаг 3 · исходный экран 4 · `s3` · Пара тегов html

**Цель.** html объединяет все части; открывающий тег сверху, закрывающий снизу; рамка — только рисунок.

▶ **`s3.say`** · акцент: оба тега на рамке **[нужно: сейчас на этой реплике подсвечена вся рамка — подсветить два тега]**
- uz: «Endi birinchi juft tegni ko‘ramiz: html.»
- ru: «Теперь первая пара тегов — html.»
- en: «Now the first pair of tags: html.»

▶ **`s3.sayTag`** · акцент: оба тега **[есть]**
- uz: «html tegi sahifaning hamma qismlarini birlashtiradi. Ular shu ikki teg orasida turadi.»
- ru: «Тег html объединяет все части страницы. Они стоят между этими двумя тегами.»
- en: «The html tag holds all the parts of the page together. They go between these two tags.»

▶ **`s3.top`** · акцент: верхний тег желтеет **[есть]**
- uz: «Tepadagisi ochuvchi html tegi. Sahifa shundan boshlanadi.»
- ru: «Верхний — открывающий тег html. С него начинается страница.»
- en: «The top one is the opening html tag. The page starts here.»

▶ **`s3.bottom`** · акцент: нижний тег желтеет **[есть]**
- uz: «Pastdagisi yopuvchi html tegi, unda qiya chiziq bor. Sahifa shu yerda tugaydi.»
- ru: «Нижний — закрывающий тег html, с косой чертой. Здесь страница заканчивается.»
- en: «The bottom one is the closing html tag, with a slash. The page ends here.»

▶ **`s3.done`** · акцент: рамка **[есть]**
- uz: «Ramkani tushunarli bo‘lsin deb chizdik. Brauzer uni ko‘rsatmaydi.»
- ru: «Рамку мы нарисовали для наглядности. Браузер её не показывает.»
- en: «We drew the frame to make it clear. The browser doesn’t show it.»

**Надписи**
- `s3.ask` — без изменений.
- `s3.askDone`:
  - uz «Butun sahifa ikki html tegi orasida»
  - ru «Вся страница — между двумя тегами html»
  - en «The whole page is between the two html tags»

**Изменения**
- **В3 (важно).** На экранах 4–6 коралловая рамка обнимает весь бумажный браузер — вкладку, кнопки окна, адресную строку. Картинка закрепляет неверное «html = интерфейс браузера». Нужно, чтобы рамка обнимала только саму страницу (кремовый лист в окне), а вкладка и полоса браузера оставались снаружи. Реплики выше написаны под такой вариант и не противоречат нынешнему, но нынешний рисунок им противоречит.
- **В6.** Подсветка двух тегов на `s3.say` вместо всей рамки.

### Шаг 4 · исходный экран 5 · `s4` · Закрой рамку

**Цель.** Написать закрывающий тег самому. Экран-образец: реплики почти без изменений.

▶ **`s4.say`** · акцент: пунктир нижнего края и пустая строка мигают вместе **[есть]**
- uz: «Ramkaning pastki cheti yo‘q: kodda yopuvchi html tegi yetishmayapti. Uni bo‘sh qatorga yozing va «Tekshirish»ni bosing.»
- ru: «У рамки нет нижнего края: в коде не хватает закрывающего тега html. Напиши его в пустой строке и нажми «Проверить».»
- en: «The frame has no bottom edge: the closing html tag is missing from the code. Type it in the empty line and tap “Check”.»

**Действие:** набрать тег (кнопки `<` `/` `html` `>` или клавиатура) → «Проверить».

✔ **`s4.ok`** · акцент: край въезжает, тег штампом встаёт в угол **[есть]** — без изменений
- uz: «Ramka yopildi: endi butun sahifa ikki html tegi orasida!»
- ru: «Рамка закрылась: вся страница теперь между двумя тегами html!»
- en: «The frame is closed: the whole page is now between the two html tags!»

✖ **`s4.msgs.needSlash`** — без изменений
- uz: «Bu ochuvchi teg. Yopuvchi tegda html so‘zidan oldin qiya chiziq turadi.»
- ru: «Это открывающий тег. В закрывающем перед словом html стоит косая черта.»
- en: «That’s the opening tag. The closing tag has a slash before html.»

✖ **`s4.msgs.needLt`**
- uz: «Teg chap burchakli qavs «<» bilan boshlanadi. Uni boshiga qo‘shing.»
- ru: «Тег начинается с угловой скобки «<». Добавь её в начало.»
- en: «A tag starts with the angle bracket “<”. Add it at the start.»

✖ **`s4.msgs.needGt`**
- uz: «Teg oxirida o‘ng burchakli qavs «>» turadi. Uni oxiriga qo‘shing.»
- ru: «В конце тега нужна угловая скобка «>». Добавь её в конец.»
- en: «A tag ends with the angle bracket “>”. Add it at the end.»

✖ **`s4.msgs.wrongName`** — без изменений
- uz: «Teg ichida boshqa so‘z yozilgan. Bu yerda html kerak.»
- ru: «Внутри тега другое слово. Здесь нужен html.»
- en: «There’s a different word inside the tag. Here you need html.»

✖ **`s4.msgs.generic`** — без изменений
- uz: «Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.»
- ru: «Косая черта «/» стоит сразу после первой угловой скобки.»
- en: «The slash “/” goes right after the first angle bracket.»

💡 **`s4.hints[0]`** · акцент: верхний тег на рамке **[есть]** — без изменений
- uz: «Ramkaning tepasidagi tegga qarang.»
- ru: «Посмотри на верхний тег на рамке.»
- en: «Look at the top tag on the frame.»

💡 **`s4.hints[1]`** — без изменений
- uz: «Yopuvchi teg o‘sha so‘z, faqat qiya chiziq bilan.»
- ru: «Закрывающий тег — то же слово, но с косой чертой.»
- en: «The closing tag is the same word with a slash.»

💡 **`s4.hints[2]`** — без изменений
- uz: «Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin html va oxirida yana burchakli qavs.»
- ru: «Начни с угловой скобки, потом поставь косую черту. Дальше html и в конце снова угловая скобка.»
- en: «Start with the angle bracket, then add the slash. Then html, and another angle bracket at the end.»

**Надписи:** `s4.ask`
- uz «Bo‘sh qatorga yopuvchi html tegini yozing va «Tekshirish»ni bosing»
- ru «Напиши закрывающий тег html в пустой строке и нажми «Проверить»»
- en «Type the closing html tag in the empty line and tap “Check”»

### Шаг 5 · исходный экран 6 · `s5` · Теги по местам

**Цель.** Отличить открывающий тег от закрывающего; ловушка — обратная черта.

▶ **`s5.say`** · акцент: два пунктирных места на рамке, потом лоток **[есть]**
- uz: «Endi navbat sizda. Ramkaga ikkita teg kerak: tepaga va pastga. Pastdagi uchta tegdan bittasi ortiqcha.»
- ru: «Теперь твоя очередь. Рамке нужны два тега: сверху и снизу. Один из трёх тегов внизу лишний.»
- en: «Your turn. The frame needs two tags: one at the top and one at the bottom. One of the three tags below is extra.»

▶ **`s5.sayHow`** (новый) · акцент: рука-показ несёт `<html>` к верхнему месту **[есть: рука; нужно: реплика]**
- uz: «Tegni barmoq bilan joyiga torting. Yoki avval tegni, keyin joyni bosing.»
- ru: «Перетащи тег пальцем на место. Или нажми тег, а потом место.»
- en: «Drag a tag into place with your finger. Or tap the tag, then the place.»

**Действие:** перетащить или «нажать тег → место».

✔ **`s5.ok`**
- uz: «Ikkala teg joyida. Teskari chiziqli teg ortiqcha edi.»
- ru: «Оба тега на месте. Лишним был тег с обратной чертой.»
- en: «Both tags are in place. The one with the backslash was extra.»

✖ **`s5.top`** (тег с косой чертой — наверх)
- uz: «Tepada sahifa boshlanadi. Bu yerga qiya chiziqsiz ochuvchi teg kerak.»
- ru: «Сверху страница начинается. Здесь нужен открывающий тег, без косой черты.»
- en: «The page starts at the top. It needs the opening tag, without a slash.»

✖ **`s5.bottom`** (тег без черты — вниз)
- uz: «Pastda sahifa tugaydi. Bu yerga qiya chiziqli yopuvchi teg kerak.»
- ru: «Снизу страница заканчивается. Здесь нужен закрывающий тег, с косой чертой.»
- en: «The page ends at the bottom. It needs the closing tag, with a slash.»

✖ **`s5.back`** (выбран `<\html>`)
- uz: «Bu chiziq teskari tomonga egilgan. Yopuvchi tegda u o‘ngga egilgan: «/».»
- ru: «Эта черта наклонена не в ту сторону. В закрывающем теге она наклонена вправо: «/».»
- en: «This slash leans the wrong way. In a closing tag it leans right: “/”.»

✖ **`s5.pickFirst`** (нажато место без тега) — без изменений: Avval tegni tanlang. / Сначала выбери тег. / Pick a tag first.

💡 **`s5.hints[0]`**
- uz: «Qaysi teg sahifani boshlaydi, qaysi biri tugatadi?»
- ru: «Какой тег начинает страницу, а какой заканчивает?»
- en: «Which tag starts the page, and which one ends it?»

💡 **`s5.hints[1]`** — без изменений
- uz: «Tepaga qiya chiziqsiz teg, pastga qiya chiziqli teg qo‘yiladi.»
- ru: «Сверху — тег без косой черты. Снизу — тег с косой чертой.»
- en: «Top: the tag without a slash. Bottom: the tag with a slash.»

💡 **`s5.hints[2]`** · светятся нужный тег и место **[есть]** — без изменений
- uz: «<html> tegini tepadagi joyga torting.»
- ru: «Перетащи <html> на верхнее место.»
- en: «Drag <html> to the top place.»

**Надписи:** `s5.ask`, `s5.askPlace` — без изменений.

**Изменения**
- **В7.** Новая реплика `s5.sayHow` добавляется в очередь `S5` после `s5.say`. Рука-показ идёт как сейчас — после последней реплики.

### Шаг 6 · исходный экран 7 · `s6` · head и title

**Цель.**
- Внутри html две части; первая — head.
- В head — сведения о странице, в окне их не видно.
- Одно из сведений — название в title, его видно на вкладке.

Здесь впервые объясняется окно браузера — через видимое место.

▶ **`s6.say`** · акцент: голова человечка и строки `<head>`/`</head>` **[есть]**
- uz: «html ichida ikki qism bor. Birinchisi head. Odamchaning boshi shu qismni eslatadi.»
- ru: «Внутри html две части. Первая — head. Голова человечка напоминает эту часть.»
- en: «Inside html there are two parts. The first is head. The buddy’s head stands for it.»

▶ **`s6.sayInfo`** · акцент: окно браузера **[есть]**
- uz: «head ichida sahifa haqidagi ma’lumotlar turadi. Pastdagi katta joyda, brauzer oynasida, ular ko‘rinmaydi.»
- ru: «В head — сведения о странице. В окне браузера, на этом большом месте внизу, их не видно.»
- en: «head holds information about the page. You don’t see it in the browser window, the big area below.»

▶ **`s6.opened`** · акцент: голова приподнялась, под ней карточка, строка `<title>` **[есть]**
- uz: «Ulardan biri sahifa nomi. U title tegi ichiga yoziladi.»
- ru: «Одно из этих сведений — название страницы. Его пишут внутри тега title.»
- en: «One of them is the page name. It’s written inside the title tag.»

▶ **`s6.flew`** · акцент: карточка перелетает на вкладку **[есть]**
- uz: «Brauzer title ichidagi nomni yorliqda ko‘rsatadi.»
- ru: «Браузер показывает название из title на вкладке.»
- en: «The browser shows the name from title on the tab.»

▶ **`s6.done`** · акцент: строки head с title внутри **[нужно: общая подсветка трёх строк; сейчас без подсветки]**
- uz: «Demak, title head ichida turadi. title dagi nom esa yorliqda chiqadi.»
- ru: «Итак, title стоит внутри head. А название из title видно на вкладке.»
- en: «So title sits inside head, and the name in title shows on the tab.»

**Надписи:** `s6.ask`, `s6.askCard` — без изменений.

### Шаг 7 · исходный экран 8 · `s7` · Своё название

**Цель.** Написать название внутри title и увидеть его на вкладке.

▶ **`s7.say`** · акцент: поле внутри title (мигает) и вкладка **[есть: поле мигает при бездействии; нужно: мигание поля и подсветка вкладки на время реплики]**
- uz: «Endi sahifangizga nom bering. title ichiga yozing, masalan, «Futbol». Nom darhol yorliqda chiqadi. Keyin «Tayyor»ni bosing.»
- ru: «Теперь дай странице название. Напиши его внутри title, например «Футбол». Оно сразу появится на вкладке. Потом нажми «Готово».»
- en: «Now give your page a name. Type it inside title, for example “Football”. It shows up on the tab right away. Then tap “Done”.»

**Действие:** напечатать → вкладка меняется сразу → «Готово».

✔ **`s7.ok`** · акцент: вкладка штампом **[есть]**
- uz: «Siz yozgan nom yorliqda turibdi.»
- ru: «Твоё название уже на вкладке.»
- en: «Your page name is on the tab.»

✖ **`UI.noTags`** (напечатаны угловые скобки) — без изменений
- uz: «Bu yerga faqat so‘z yozing, burchakli qavslarsiz.»
- ru: «Здесь нужны только слова, без угловых скобок.»
- en: «Only words here, no angle brackets.»

💡 **`s7.hints[0]`**
- uz: «Nom qaysi teg ichiga yoziladi? Kodga qarang.»
- ru: «В каком теге пишут название? Посмотри на код.»
- en: «Which tag holds the name? Look at the code.»

💡 **`s7.hints[1]`**
- uz: «Nom ikki title tegi orasiga yoziladi.»
- ru: «Название пишут между двумя тегами title.»
- en: «The name goes between the two title tags.»

💡 **`s7.hints[2]`**
- uz: «Ikki title tegi orasidagi bo‘sh joyni bosing, nom yozing va «Tayyor»ni bosing.»
- ru: «Нажми пустое место между тегами title, напиши название и нажми «Готово».»
- en: «Tap the empty spot between the title tags, type a name and tap “Done”.»

**Надписи:** `s7.ask` — без изменений.

### Шаг 8 · исходный экран 10 · `s9` · body

**Цель.**
- Вторая часть внутри html — body.
- Всё, что в ней записано, видно в окне.

Здесь же переход от названия к содержимому.

▶ **`s9.say`** · акцент: тело человечка и строки `<body>`/`</body>` **[есть]**
- uz: «Nom yorliqda bor. Endi sahifaning o‘zini to‘ldiramiz. html ichidagi ikkinchi qism body. Odamchaning tanasi shu qismni eslatadi.»
- ru: «Название уже на вкладке. Теперь заполним саму страницу. Вторая часть внутри html — body. Тело человечка напоминает её.»
- en: «The name is on the tab. Now let’s fill the page itself. The second part inside html is body. The buddy’s body stands for it.»

**Показ:** куски страницы вылетают из тела в окно **[есть]**.

▶ **`s9.out`** · акцент: окно с вылетевшими кусками, бирка body **[есть]**
- uz: «Matn, rasm va tugma tanadan chiqib, oynaga tushdi. Ular body ichida yozilgan.»
- ru: «Текст, картинка и кнопка вылетели из тела в окно. Они записаны внутри body.»
- en: «The text, the picture and the button flew from the body into the window. They’re written inside body.»

▶ **`s9.done`** · акцент: окно и строки body **[есть]**
- uz: «body ichidagi narsalar oynada ko‘rinadi.»
- ru: «То, что внутри body, видно в окне.»
- en: «What’s inside body shows in the window.»

**Надписи:** `s9.ask` — без изменений.

### Шаг 9 · исходный экран 11 · `s10` · Своё приветствие

**Цель.** Написать текст внутри body и увидеть его в окне.

▶ **`s10.say`** · акцент: поле внутри body и окно **[нужно, как на шаге 7]**
- uz: «Endi sahifangizga salom yozing. body ichiga yozing, masalan, «Salom!». Matn darhol oynada chiqadi. Keyin «Tayyor»ni bosing.»
- ru: «Теперь напиши на странице приветствие. Пиши внутри body, например «Привет!». Текст сразу появится в окне. Потом нажми «Готово».»
- en: «Now write a greeting on your page. Type it inside body, for example “Hello!”. It shows up in the window right away. Then tap “Done”.»

✔ **`s10.ok`** · акцент: текст штампом в окне **[есть]**
- uz: «Matningiz oynada turibdi.»
- ru: «Твой текст уже в окне.»
- en: «Your text is in the window.»

✖ **`UI.noTags`** — как на шаге 7.

💡 **`s10.hints[0]`**
- uz: «Oynadagi matn qaysi teg ichida bo‘ladi? Kodga qarang.»
- ru: «В каком теге текст для окна? Посмотри на код.»
- en: «Which tag holds the text for the window? Look at the code.»

💡 **`s10.hints[1]`**
- uz: «Matn ikki body tegi orasiga yoziladi.»
- ru: «Текст пишут между двумя тегами body.»
- en: «The text goes between the two body tags.»

💡 **`s10.hints[2]`**
- uz: «Ikki body tegi orasidagi bo‘sh joyni bosing, matn yozing va «Tayyor»ni bosing.»
- ru: «Нажми пустое место между тегами body, напиши текст и нажми «Готово».»
- en: «Tap the empty spot between the body tags, type your text and tap “Done”.»

**Надписи:** `s10.ask` — без изменений.

### Шаг 10 · исходный экран 9 · `s8` · Вкладка или окно (перенесён)

**Цель.** По строке кода предсказать: текст из title — на вкладке, из body — в окне.

Раунды:
1. `<title>Космос</title>`;
2. `<body>Космос</body>` **[нужно: П3, вместо строки без тегов]**;
3. `<title>Финал в пятницу!</title>` — длинная фраза в title.

Дополнительные раунды — с «Музыка» и «Сегодня концерт!».

▶ **`s8.say`** · акцент: строка кода над браузером, две кнопки **[есть]**
- uz: «Endi brauzer bo‘lib o‘ylang. Kod qatoriga qarang va so‘z qayerda chiqishini tanlang: yorliqdami yoki oynadami.»
- ru: «Теперь подумай как браузер. Посмотри на строку кода и выбери, где появится слово: на вкладке или в окне.»
- en: «Now think like a browser. Look at the line of code and pick where the word will show: on the tab or in the window.»

▶ **`s8.askTitle`** (раунды 1, 3) · акцент: строка кода **[есть]**
- uz: «title ichida «{w}». U qayerda chiqadi?»
- ru: «В title — «{w}». Где оно появится?»
- en: «title says “{w}”. Where will it show up?»

▶ **`s8.askBody`** (новый, заменяет `s8.askRaw`; раунд 2) · акцент: строка кода
- uz: «body ichida «{w}». U qayerda chiqadi?»
- ru: «В body — «{w}». Где оно появится?»
- en: «body says “{w}”. Where will it show up?»

✔ **`s8.ok.title`** · акцент: слово штампом на вкладке **[есть]**
- uz: «To‘g‘ri: title dagi so‘z yorliqqa chiqdi.»
- ru: «Верно: слово из title появилось на вкладке.»
- en: «Right: the word from title is on the tab.»

✔ **`s8.ok.body`** (новый, заменяет `s8.ok.raw`) · акцент: слово падает в окно **[есть: падение в окно]**
- uz: «To‘g‘ri: body dagi so‘z oynaga chiqdi.»
- ru: «Верно: слово из body появилось в окне.»
- en: «Right: the word from body is in the window.»

✖ **`s8.miss.title`** · акцент: вкладка **[есть]**; дальше дополнительный раунд
- uz: «Qarang: so‘z title ichida, shuning uchun yorliqqa chiqdi. Yana bir misol.»
- ru: «Смотри: слово в title, поэтому оно на вкладке. Ещё пример.»
- en: «Look: the word is in title, so it’s on the tab. Another example.»

✖ **`s8.miss.body`** (новый, заменяет `s8.miss.raw`) · акцент: окно
- uz: «Qarang: so‘z body ichida, shuning uchun oynaga chiqdi. Yana bir misol.»
- ru: «Смотри: слово в body, поэтому оно в окне. Ещё пример.»
- en: «Look: the word is in body, so it’s in the window. Another example.»

▶ **`s8.done`** · акцент: вкладка, потом окно **[нужно: две подсветки по очереди]**
- uz: «Demak, title dagi matn yorliqda, body dagi matn oynada ko‘rinadi.»
- ru: «Итак: текст из title — на вкладке, текст из body — в окне.»
- en: «So: text from title is on the tab, text from body is in the window.»

💡 **`s8.hints[0]`** (новый)
- uz: «So‘z qaysi teglar orasida turibdi?»
- ru: «Между какими тегами стоит слово?»
- en: «Which tags is the word between?»

💡 **`s8.hints[1]`** (новый)
- uz: «title dagi matn yorliqda, body dagi matn oynada ko‘rinadi.»
- ru: «Текст из title видно на вкладке, текст из body — в окне.»
- en: «Text from title shows on the tab, text from body in the window.»

💡 **`s8.hints[2]`** (новый) · светятся имена тегов в строке кода **[нужно]**
- uz: «Teg nomini o‘qing: title bo‘lsa «Yorliq», body bo‘lsa «Oyna»ni bosing.»
- ru: «Прочитай имя тега: title — жми «Вкладка», body — жми «Окно».»
- en: «Read the tag name: for title tap “Tab”, for body tap “Window”.»

**Надписи:** `s8.eyebrow`
- uz «Yorliqmi yoki oyna?»
- ru «Вкладка или окно?»
- en «Tab or window?»

**Изменения**
- **П2, П3.**
- **В8.** Лесенка подсказок на экране 9: сейчас лампочка показывает только строку задания.

### Шаг 11 · исходный экран 12 · `s11` · Разложи вырезки

**Цель.** Применить правило head / body к разным вещам.

▶ **`s11.say`** · акцент: зоны head и body, потом лоток **[есть]**
- uz: «Endi narsalarni qismlarga ajrating. Har bir bo‘lakni head yoki body ga torting. Yoki avval bo‘lakni, keyin qismni bosing.»
- ru: «Теперь разложи вещи по частям. Перетащи каждую вырезку в head или в body. Или нажми вырезку, а потом часть.»
- en: «Now sort the things into parts. Drag each cut-out into head or body. Or tap a cut-out, then a part.»

✔ **`s11.ok`**
- uz: «Hammasi joyida: sahifa nomi head ichida, ko‘rinadigan narsalar body ichida.»
- ru: «Всё на местах: название — в head, всё, что видно, — в body.»
- en: «All in place: the page name is in head, everything you see is in body.»

✖ **`s11.items[0].why`** (название — в body)
- uz: «Bu title ichidagi sahifa nomi. U yorliqda ko‘rinadi, shuning uchun head ichida turadi.»
- ru: «Это название в теге title. Его видно на вкладке, поэтому оно в head.»
- en: «This is the page name in title. It shows on the tab, so it goes in head.»

✖ **`s11.items[1].why`** («Привет, мир!» — в head)
- uz: «Bu matn oynada ko‘rinishi kerak. Demak, u body ichida.»
- ru: «Этот текст должен быть виден в окне. Значит, он в body.»
- en: «This text should show in the window. So it goes in body.»

✖ **`s11.items[2].why`** (картинка — в head)
- uz: «Rasm oynada ko‘rinadi. Demak, u body ichida.»
- ru: «Картинку видно в окне. Значит, она в body.»
- en: «You see the picture in the window. So it goes in body.»

✖ **`s11.items[3].why`** (кнопка — в head)
- uz: «Tugma oynada bosiladi. Demak, u body ichida.»
- ru: «Кнопку нажимают в окне. Значит, она в body.»
- en: «You press the button in the window. So it goes in body.»

✖ **`s11.pickFirst`** — без изменений: Avval bo‘lakni tanlang. / Сначала выбери вырезку. / Pick a cut-out first.

💡 **`s11.hints[0]`** — без изменений
- uz: «Bu narsa brauzer oynasida ko‘rinadimi?»
- ru: «Эту вещь видно в окне браузера?»
- en: «Can you see this in the browser window?»

💡 **`s11.hints[1]`**
- uz: «Oynada ko‘rinadigan narsalar body ichida. Sahifa nomi head ichida.»
- ru: «То, что видно в окне, — в body. Название страницы — в head.»
- en: «What you see in the window goes in body. The page name goes in head.»

💡 **`s11.hints[2]`** · светятся вырезка и место **[есть]** — без изменений
- uz: «Yonib turgan bo‘lakni yonib turgan joyga torting.»
- ru: «Перетащи светящуюся вырезку в светящееся место.»
- en: «Drag the glowing cut-out to the glowing place.»

**Надписи:** `s11.ask`, `s11.askPlace` — без изменений.

### Шаг 12 · исходный экран 13 · `s12` · Весь код сверху вниз

**Цель.**
- Увидеть основу целиком.
- Браузер читает код сверху вниз.
- DOCTYPE — особая первая строка без пары.
- Вложенность: title в head, текст в body.

▶ **`s12.say`** · акцент: весь код **[есть]**; потом браузер сам читает строки, коллаж собирается **[есть]**
- uz: «Endi butun kodni ko‘ramiz. Brauzer uni yuqoridan pastga o‘qiydi va sahifani yig‘adi.»
- ru: «Теперь посмотрим весь код. Браузер читает его сверху вниз и собирает страницу.»
- en: «Now let’s see all the code. The browser reads it from top to bottom and builds the page.»

▶ **`s12.parts.doc`** · акцент: строка DOCTYPE и полоска DOCTYPE **[есть]**
- uz: «Birinchi qator <!DOCTYPE html> maxsus qator. U brauzerga bu HTML sahifa ekanini aytadi. Uning jufti yo‘q.»
- ru: «Первая строка <!DOCTYPE html> — особая. Она говорит браузеру, что это HTML-страница. Пары у неё нет.»
- en: «The first line, <!DOCTYPE html>, is special. It tells the browser this is an HTML page. It has no pair.»

▶ **`s12.parts.html`** · акцент: строки html и рамка **[есть]**
- uz: «html tegi butun sahifani birlashtiradi. Ichida head va body bor.»
- ru: «Тег html объединяет всю страницу. Внутри него head и body.»
- en: «The html tag holds the whole page. Inside it are head and body.»

▶ **`s12.parts.head`** · акцент: группа head и голова коллажа **[есть]**
- uz: «Bu head qismi. Unda sahifa haqidagi ma’lumotlar bor.»
- ru: «Это часть head. В ней сведения о странице.»
- en: «This is the head part. It holds information about the page.»

▶ **`s12.parts.title`** · акцент: строка title **[есть]**
- uz: «head ichida title. Undagi nom yorliqda ko‘rinadi.»
- ru: «Внутри head — title. Название из него видно на вкладке.»
- en: «Inside head is title. Its name shows on the tab.»

▶ **`s12.order5`** · акцент: строки `</head>` и `<body>` **[есть]**
- uz: «Avval head yopiladi, keyin body ochiladi.»
- ru: «Сначала закрываем head, потом открываем body.»
- en: «First head closes, then body opens.»

▶ **`s12.parts.body`** · акцент: группа body и тело коллажа **[есть]**
- uz: «Bu body qismi. Undagi narsalar oynada ko‘rinadi.»
- ru: «Это часть body. То, что в ней, видно в окне.»
- en: «This is the body part. What’s in it shows in the window.»

▶ **`s12.parts.text`** · акцент: строка текста **[есть]**
- uz: «Bu siz yozgan matn. U body ichida, shuning uchun oynada.»
- ru: «Это твой текст. Он внутри body, поэтому в окне.»
- en: «This is your text. It’s inside body, so it’s in the window.»

▶ **`s12.tapSay`** · акцент: строки кода и части коллажа становятся нажимаемыми **[есть]**
- uz: «Biror qismni yana eshitmoqchi bo‘lsangiz, kod qatorini yoki o‘ngdagi qismni bosing.»
- ru: «Хочешь услышать часть ещё раз — нажми строку кода или часть справа.»
- en: «Want to hear a part again? Tap a code line or a part on the right.»

**Надписи:** `s12.ask`, `s12.askTap` — без изменений. `s12.askDone`:
- uz «html ichida: avval head (unda title), keyin body (unda matn)»
- ru «В html: сначала head с title, потом body с текстом»
- en «In html: first head with title, then body with the text»

### Шаг 13 · исходный экран 14 · `s13` · Собери основу

**Цель.** Расставить 8 строк по порядку. Механика новая — её нужно назвать.

▶ **`s13.say`** · акцент: первая пустая строка и полоски **[нужно: подсветка текущей пустой строки на время реплики; сейчас она отмечена постоянно]**
- uz: «Endi butun kodni o‘zingiz yig‘ing. Birinchi qator joyida. Qolgan qatorlardan birini bossangiz, u navbatdagi bo‘sh joyga tushadi.»
- ru: «Теперь собери весь код. Первая строка уже стоит. Нажми полоску — она встанет в следующую пустую строку.»
- en: «Now build the whole code. The first line is in place. Tap a strip, and it goes into the next empty line.»

▶ **`s13.sayMove`** (новый) · акцент: кнопки ▲ ▼ у поставленной полоски **[нужно: реплика и подсветка стрелок — после первой поставленной полоски]**
- uz: «Qator noto‘g‘ri joyga tushsa, uni o‘qchalar bilan yuqoriga yoki pastga suring. Hammasi joyida bo‘lsa, «Tekshirish»ni bosing.»
- ru: «Если полоска встала не туда, сдвинь её стрелками вверх или вниз. Когда всё на местах, нажми «Проверить».»
- en: «If a strip lands in the wrong spot, move it up or down with the arrows. When everything is in place, tap “Check”.»

✔ **`s13.ok`**
- uz: «Kod to‘g‘ri yig‘ildi: sahifa nomi head ichida, matn body ichida.»
- ru: «Код собран верно: название — в head, текст — в body.»
- en: «The code is right: the page name is in head, the text is in body.»

✖ **`s13.rules.html`** — без изменений
- uz: «html birinchi ochiladi va oxirida yopiladi: butun sahifa uning ichida.»
- ru: «html открывается первым и закрывается последним: внутри него вся страница.»
- en: «html opens first and closes last: the whole page is inside it.»

✖ **`s13.rules.pair`**
- uz: «Yopuvchi teg o‘z ochuvchi tegidan keyin turadi.»
- ru: «Закрывающий тег стоит после своего открывающего.»
- en: «A closing tag comes after its opening tag.»

✖ **`s13.rules.order`**
- uz: «Avval head, keyin body keladi.»
- ru: «Сначала идёт head, потом body.»
- en: «head comes first, then body.»

✖ **`s13.rules.headClose`** — без изменений
- uz: «body boshlanishidan oldin head yopilishi kerak.»
- ru: «head нужно закрыть до того, как начнётся body.»
- en: «Close head before body starts.»

✖ **`s13.rules.title`**
- uz: «title head ichida turadi.»
- ru: «title стоит внутри head.»
- en: «title goes inside head.»

✖ **`s13.rules.text`**
- uz: «Sahifa matni body ichida turadi.»
- ru: «Текст страницы стоит внутри body.»
- en: «The page text goes inside body.»

💡 **`s13.hints[0]`** — без изменений
- uz: «Qaysi teg birinchi ochilib, oxirida yopiladi?»
- ru: «Какой тег открывается первым и закрывается последним?»
- en: «Which tag opens first and closes last?»

💡 **`s13.hints[1]`** — без изменений
- uz: «html ichida avval title bilan head, keyin matn bilan body keladi.»
- ru: «Внутри html сначала head с title, потом body с текстом.»
- en: «Inside html: first head with title, then body with the text.»

💡 **`s13.hints[2]`** · отмеченные полоски светятся **[есть]** — без изменений
- uz: «Belgilangan ikki qatorning o‘rnini almashtiring.»
- ru: «Поменяй местами две отмеченные полоски.»
- en: «Swap the two marked strips.»

**Надписи:** `s13.ask`, `UI.swap` — без изменений.

**Изменения**
- **В9.** Новая реплика `s13.sayMove` и подсветка ▲ ▼. Лучше — один раз после первой поставленной полоски, а не сразу после `s13.say`.

### Шаг 14 · исходный экран 15 · `s14` · Не хватает `</title>`

**Цель.** Увидеть, что без `</title>` текст страницы уходит на вкладку, и починить.

▶ **`s14.say`** · акцент: вкладка с длинным текстом **[есть]** → пустое место в строке title **[нужно: подсветка пустого места во второй фразе]**
- uz: «Qarang, yorliqqa butun sahifa matni chiqib ketdi, oyna esa bo‘sh. title qatorida bitta teg yetishmayapti.»
- ru: «Смотри: на вкладку уехал весь текст страницы, а окно пустое. В строке title не хватает одного тега.»
- en: «Look: all the page text went to the tab, and the window is empty. One tag is missing in the title line.»

▶ **`s14.sayHow`** (новый) · акцент: лоток с тегами
- uz: «Kerakli tegni bo‘sh joyga torting yoki shunchaki bosing.»
- ru: «Перетащи нужный тег в пустое место или просто нажми его.»
- en: «Drag the right tag into the empty spot, or just tap it.»

✔ **`s14.ok`** · акцент: название на вкладке, текст падает в окно **[есть]**
- uz: «Tuzaldi: nom yorliqda, matn oynada. Yopuvchi title tegi nom qayerda tugashini ko‘rsatdi.»
- ru: «Исправлено: название на вкладке, текст в окне. Закрывающий тег title показал, где кончается название.»
- en: «Fixed: the name is on the tab, the text is in the window. The closing title tag showed where the name ends.»

✖ **`s14.why.<title>`** — без изменений
- uz: «Bu ochuvchi teg. title allaqachon ochilgan, endi uni yopish kerak.»
- ru: «Это открывающий тег. title уже открыт, теперь его нужно закрыть.»
- en: «That’s an opening tag. title is already open. Now it needs to be closed.»

✖ **`s14.why.</head>`**
- uz: «head keyinroq yopiladi. Avval sahifa nomi tugashi kerak, shuning uchun title ni yoping.»
- ru: «head закроется позже. Сначала должно закончиться название, поэтому закрой title.»
- en: «head closes later. First the page name has to end, so close title.»

💡 **`s14.hints[0]`** (новый)
- uz: «Qaysi teg ochilgan, lekin yopilmagan?»
- ru: «Какой тег открыт, но не закрыт?»
- en: «Which tag is open but not closed?»

💡 **`s14.hints[1]`** (новый)
- uz: «title ochilgan. Uni yopadigan teg kerak.»
- ru: «title открыт. Нужен тег, который его закрывает.»
- en: «title is open. You need the tag that closes it.»

💡 **`s14.hints[2]`** (новый) · светятся `</title>` и пустое место **[есть: после двух ошибок `</title>` светится]**
- uz: «Qiya chiziqli title tegini bo‘sh joyga qo‘ying.»
- ru: «Поставь в пустое место тег title с косой чертой.»
- en: «Put the title tag with a slash into the empty spot.»

**Надписи:** `s14.ask` — без изменений.

**Изменения**
- **В10.** Лесенка подсказок на экране 15 (сейчас лампочка показывает строку задания).
- **В11.** Подсветка пустого места на второй фразе `s14.say`.
- Новая реплика `s14.sayHow` — в очередь.

### Шаг 15 · исходный экран 16 · `q1` · Итоговая проверка: вкладка и окно

**Цель.** Без образца поставить текст в нужный тег. До первой попытки места не подсвечиваются **[есть]**, и реплика ответа не выдаёт.

▶ **`q1.say`** · акцент: две фразы в лотке **[есть]**; места в коде без подсветки
- uz: «Yangi sahifa. Yorliqda «Robotlar», oynada «Salom!» chiqishi kerak. Har bir so‘zni koddagi o‘z joyiga torting yoki avval so‘zni, keyin joyni bosing.»
- ru: «Новая страница. На вкладке должно быть «Роботы», в окне — «Привет!». Перетащи каждую фразу на её место в коде. Или нажми фразу, потом место.»
- en: «A new page. The tab should say “Robots”, the window “Hello!”. Drag each phrase to its place in the code. Or tap a phrase, then the place.»

✔ **`q1.ok`**
- uz: «To‘g‘ri! «Robotlar» title ichida, shuning uchun yorliqda. «Salom!» body ichida, shuning uchun oynada.»
- ru: «Верно! «Роботы» в title — поэтому на вкладке. «Привет!» в body — поэтому в окне.»
- en: «Right! “Robots” is in title, so it’s on the tab. “Hello!” is in body, so it’s in the window.»

✖ **`q1.toWin`** · акцент: окно на миг **[есть]**
- uz: «Qarang: «{w}» oynaga chiqdi. body dagi matn oynada ko‘rinadi. Yorliq uchun title kerak.»
- ru: «Смотри: «{w}» попало в окно. Текст из body видно в окне. Для вкладки нужен title.»
- en: «Look: “{w}” went to the window. Text in body shows in the window. The tab needs title.»

✖ **`q1.toTab`** · акцент: вкладка на миг **[есть]**
- uz: «Qarang: «{w}» yorliqqa chiqdi. title dagi matn yorliqda ko‘rinadi. Oyna uchun body kerak.»
- ru: «Смотри: «{w}» попало на вкладку. Текст из title видно на вкладке. Для окна нужен body.»
- en: «Look: “{w}” went to the tab. Text in title shows on the tab. The window needs body.»

✖ **`q1.pickFirst`** — без изменений: Avval so‘zni tanlang. / Сначала выбери фразу. / Pick a phrase first.

💡 **`q1.hints[0]`** — без изменений
- uz: «Yorliqdagi matn qaysi teg ichida bo‘ladi?»
- ru: «В каком теге текст для вкладки?»
- en: «Which tag holds the text for the tab?»

💡 **`q1.hints[1]`**
- uz: «Yorliq uchun title, oyna uchun body.»
- ru: «Для вкладки — title, для окна — body.»
- en: «For the tab: title. For the window: body.»

💡 **`q1.hints[2]`** · светятся фраза и место **[есть]** — без изменений
- uz: «Yonib turgan so‘zni yonib turgan joyga torting.»
- ru: «Перетащи светящуюся фразу в светящееся место.»
- en: «Drag the glowing phrase to the glowing place.»

**Надписи:** `q1.ask`, `q1.askPlace`, `q1.tabWord`, `q1.winWord` — без изменений.

### Шаг 16 · исходный экран 17 · `q2` · Итоговая проверка: зачем `</title>`

**Цель.** Проверить, что закрывающий тег отмечает конец названия. Верный вариант не первый, до попытки ничего не подсвечено **[есть]**.

▶ **`q2.say`** · акцент: строка кода, закрывающий тег выделен **[есть]**
- uz: «Oxirgi savol. Yopuvchi title tegi nima uchun kerak? Javobni bosing.»
- ru: «Последний вопрос. Зачем нужен закрывающий тег title? Нажми ответ.»
- en: «Last question. Why do we need the closing title tag? Tap an answer.»

**Варианты (надписи, `q2.opts[*].t`)** — без изменений:
1. «Sahifa nomini oynada ko‘rsatadi» / «Показывает название в окне» / «It shows the name in the window»;
2. «Sahifa nomi qayerda tugashini ko‘rsatadi» / «Показывает, где заканчивается название страницы» / «It shows where the page name ends» — верный;
3. «Yangi sahifani boshlaydi» / «Начинает новую страницу» / «It starts a new page».

✔ **`q2.ok`**
- uz: «To‘g‘ri! U nom qayerda tugashini ko‘rsatadi. Usiz sahifa matni yorliqqa chiqib ketadi.»
- ru: «Верно! Он показывает, где кончается название. Без него текст страницы уезжает на вкладку.»
- en: «Right! It shows where the name ends. Without it, the page text ends up on the tab.»

✖ **`q2.opts[0].why`** — без изменений
- uz: «Yo‘q: yopuvchi teg sahifada ko‘rinmaydi va nomni oynaga chiqarmaydi.»
- ru: «Нет: закрывающий тег на странице не виден и название в окно не выводит.»
- en: «No: a closing tag doesn’t show on the page and doesn’t put the name in the window.»

✖ **`q2.opts[2].why`**
- uz: «Yo‘q: sahifa html tegi bilan boshlanadi. Yopuvchi title tegi esa nomni tugatadi.»
- ru: «Нет: страница начинается с тега html. А закрывающий тег title заканчивает название.»
- en: «No: a page starts with the html tag. The closing title tag ends the name.»

💡 **`q2.hints[0]`** — без изменений
- uz: «Oldingi ekranni eslang: u yerda yopuvchi title tegi yo‘q edi.»
- ru: «Вспомни прошлый экран: там не было закрывающего тега title.»
- en: «Remember the last screen: the closing title tag was missing.»

💡 **`q2.hints[1]`**
- uz: «Qiya chiziqli teg biror qismni tugatadi. title ichida nima turadi?»
- ru: «Тег с косой чертой заканчивает часть. Что стоит внутри title?»
- en: «A tag with a slash ends a part. What’s inside title?»

💡 **`q2.hints[2]`** · подсвечен верный вариант **[есть]** — без изменений
- uz: «Yopuvchi title tegi sahifa nomini tugatadi.»
- ru: «Закрывающий тег title заканчивает название страницы.»
- en: «The closing title tag ends the page name.»

**Надписи:** `q2.ask` — без изменений.

### Шаг 17 · исходный экран 18 · `s15` · Вывод

**Цель.** Короткий итог по частям на странице ученика и праздник.

▶ **`s15.say[0].text`** · акцент: коллаж страницы ученика **[есть]**
- uz: «Mana sizning sahifangiz!»
- ru: «Вот твоя страница!»
- en: «Here’s your page!»

▶ **`s15.say[1].text`** · акцент: бирки тегов **[есть]**
- uz: «Teg burchakli qavsdagi so‘z. Brauzer uni ko‘rsatmaydi, o‘qiydi.»
- ru: «Тег — слово в угловых скобках. Браузер его не показывает, а читает.»
- en: «A tag is a word in angle brackets. The browser doesn’t show it, it reads it.»

▶ **`s15.say[2].text`** · акцент: рамка и строка «html» в списке **[есть]**
- uz: «html sahifaning hamma qismlarini birlashtiradi: head va body.»
- ru: «html объединяет все части страницы: head и body.»
- en: «html holds all the parts of the page: head and body.»

▶ **`s15.say[3].text`** · акцент: голова и строка «head» **[есть]**
- uz: «head ichida sahifa haqidagi ma’lumotlar turadi.»
- ru: «В head — сведения о странице.»
- en: «head holds information about the page.»

▶ **`s15.say[4].text`** · акцент: title в голове и строка «title» **[есть]**
- uz: «title head ichida turadi. Undagi nom yorliqda chiqadi.»
- ru: «title стоит внутри head. Название из него видно на вкладке.»
- en: «title is inside head. Its name shows on the tab.»

▶ **`s15.say[5].text`** · акцент: тело и строка «body» **[есть]**
- uz: «body ichidagi narsalar oynada ko‘rinadi.»
- ru: «То, что внутри body, видно в окне.»
- en: «What’s inside body shows in the window.»

▶ **`s15.say[6].text`** · праздник **[есть]**
- uz: «Tabriklayman! Birinchi HTML sahifangiz tayyor.»
- ru: «Ура! Твоя первая HTML-страница готова!»
- en: «Hooray! Your first HTML page is ready!»

**Надписи:** `s15.ask`, роли `s15.roles`, `UI.next` — без изменений.

---

## 5. Сводка изменений визуала и механики

| Код | Экран | Что нужно | Важность |
|---|---|---|---|
| П1 | 2 | Удалить экран плана `S2` (`SCREENS`, `SCREEN_RESET`, автопроверка, счётчик 17) | обязательно |
| П2 | 9 | Переставить `S8` после `S10` | обязательно |
| П3 | 9 | Раунд «без тегов» заменить раундом `<body>…</body>` (данные `C.s8.rounds`, ключи `askBody`, `ok.body`, `miss.body`) | обязательно |
| В1 | 1 | Убрать `s1.sayWin` из очереди `S1` | обязательно |
| В2 | 1 | Подсветка всего браузера на `s1.say` | по желанию |
| В3 | 4–6 | Рамка `html` — вокруг страницы (листа в окне), а не вокруг всего браузера с вкладкой | важно |
| В4 | 3 | Подпись «открывающий» — на `tg1.askSlash`, не раньше | важно |
| В5 | 3 | Подсветка текста между тегами и в окне на `tg1.done` | по желанию |
| В6 | 4 | На `s3.say` подсвечивать два тега, а не всю рамку | важно |
| В7 | 6 | Новая реплика `s5.sayHow` перед рукой-показом | обязательно |
| В8 | 9 | Лесенка подсказок `s8.hints` | важно |
| В9 | 14 | Реплика `s13.sayMove` и подсветка ▲ ▼ после первой полоски | обязательно |
| В10 | 15 | Лесенка подсказок `s14.hints` | важно |
| В11 | 15 | Подсветка пустого места во второй фразе `s14.say`; реплика `s14.sayHow` | по желанию |
| — | 7, 8, 11 | На время реплики-задания: подсветка вкладки или окна и мигание поля (`s7.say`, `s10.say`); общая подсветка строк head на `s6.done` | по желанию |

**Лишние визуальные детали, мешающие пониманию:**
- **Рамка вокруг всего браузера** — В3.
- **На экране 1 после превращения** нет окна, к которому можно привязать слово «окно». Поэтому слово «окно» вводится на экране 7.
- **На экране 10 строка кода** «Привет, мир! + картинка + Играть» — условная запись, а не настоящий HTML. Реплика её не называет кодом, и подпись этого экрана тоже лучше не называть кодом.
- **На экране 13 у бирки html** две метки (на коде и на коллаже). Не мешает, в речи не упоминается.

## 6. Удалённые, объединённые и заменённые реплики

| Ключ | Что с ним |
|---|---|
| `s1.sayWin` | удалена: окно объясняется на экране 7 (`s6.sayInfo`) у видимого окна |
| `s2.say`, `s2.cards[0–3].say`, `s2.done` | удалены вместе с экраном плана |
| `s2.eyebrow`, `s2.ask`, `s2.cards[0–3].title` | удалены вместе с экраном плана |
| `s8.askRaw`, `s8.ok.raw`, `s8.miss.raw` | заменены на `s8.askBody`, `s8.ok.body`, `s8.miss.body` |
| смысл `s3.say` «Браузер узнаёт части страницы по тегам» | убран из речи; ключ `s3.say` получил новую короткую связку |
| смысл `s8.done` «текст без тегов в этих примерах попал в окно» | убран вместе с раундом без тегов |
| смысл `s8.miss.title` «длинная фраза тоже попадёт туда» | убран: реплика звучит и в раунде 1, где длинной фразы нет |

**Новые ключи:**
- `s5.sayHow`;
- `s8.askBody`, `s8.ok.body`, `s8.miss.body`, `s8.hints[0–2]`;
- `s13.sayMove`;
- `s14.sayHow`, `s14.hints[0–2]`.

## 7. Слово «teg» и названия тегов в озвучке

**Что на экране (не меняется):** «teg», «tegi», «teglar», «yopuvchi title tegi»; в коде — точные `html`, `head`, `title`, `body`, `<!DOCTYPE html>`.

**Что уходит в озвучку** (так работает урок сейчас; `kzTagWord` и `spokenHtml` в `kollazh-kit.jsx` и помощниках урока 2):
- `teg` → `tag`; окончание — через дефис: `tegi` → `tag-i`, `teglar` → `tag-lar`, `tegni` → `tag-ni`, `tegidan` → `tag-idan`. Другие слова с «teg» (например, «tegishli») не трогаются.
- `</title>` в узбекской реплике → «yopuvchi title tegi» → «yopuvchi title tag-i».
- `html` → «HTML» (в узбекском и русском), «H T M L» (в английском); `head`, `title`, `body` — английскими словами; `<!DOCTYPE html>` → «doctype HTML».
- Знаки в кавычках («<», «/», «>», «=») в речь не идут: реплика называет их словами.
- Узбекские апострофы `‘ ’` уходят как `'`, тире — как точка. Поэтому в новых узбекских звучащих репликах тире нет.

**Рекомендация.** Оставить английское «tag» в речи, как решил заказчик 23.10.2026. Но **правильность произношения не подтверждена**: локально нет настоящего ElevenLabs, ни одна фраза не прослушана.

**Фразы для проверки на настоящем голосе** (узбекский):
1. «Burchakli qavsdagi so‘z teg deyiladi.» → «… tag deyiladi.»
2. «Bu ochuvchi teg.» / «Bu yopuvchi teg.»
3. «html tegi sahifaning hamma qismlarini birlashtiradi.» → «HTML tag-i …»
4. «Yopuvchi html tegini yozing.» → «… HTML tag-ini …»
5. «Teglar juft bo‘lib keladi.» → «Tag-lar …»
6. «Tegni barmoq bilan joyiga torting.» → «Tag-ni …»
7. «head ichida sahifa haqidagi ma’lumotlar turadi.»
8. «Brauzer title ichidagi nomni yorliqda ko‘rsatadi.»
9. «body ichidagi narsalar oynada ko‘rinadi.»
10. «Birinchi qator <!DOCTYPE html> maxsus qator.» → «doctype HTML»
11. «Yopuvchi title tegi nima uchun kerak?» → «yopuvchi title tag-i»
12. «Qiya chiziqli title tegini bo‘sh joyga qo‘ying.»

**Что слушать:**
- звучит ли «tag» по-английски, а окончание «-i», «-ni», «-lar» — по-узбекски, без паузы на месте дефиса;
- не читается ли «HTML» по буквам по-русски;
- произносятся ли head, title, body как английские слова;
- не съедается ли «doctype».

## 8. Самопроверка

- **Необъяснённых слов нет.**
  - «Тег» объяснён на экране 3 до первого использования в задании.
  - «Вкладка» объяснена в хуке через место («маленькое место сверху»), «окно» — на экране 7 («большое место внизу»).
  - head и body появляются только вместе с показом.
  - DOCTYPE — только на экране 13, с пояснением «особая строка без пары».
  - Слова «документ», «сведения» в русском и «ma’lumot» в узбекском остались. «Сведения» каждый раз объяснены примером: название.
- **Что делать без учителя — понятно.** На всех заданиях реплика называет объект, место и подтверждение:
  - экран 5 — «Проверить»;
  - экраны 8 и 11 — «Готово»;
  - экраны 6, 12, 15, 16 — «перетащи или нажми»;
  - экран 14 — нажатие, стрелки, «Проверить»;
  - экран 17 — «нажми ответ».
- **Слова и изображение.** Расхождения сняты там, где их можно снять репликой. Остаётся рамка вокруг всего браузера (В3) — исправляется только в рисунке.
- **Связки между блоками есть:**
  - хук → «как браузер читает код» (экран 3);
  - тег → «первая пара тегов — html» (4);
  - html → «внутри html две части, первая — head» (7);
  - название → «название уже на вкладке, теперь заполним страницу» (10);
  - body → «теперь подумай как браузер» (9);
  - части → «теперь посмотрим весь код» (13);
  - весь код → «теперь собери весь код» (14).
- **Итоговая проверка ответа не подсказывает.** `q1.say` называет цель (что должно быть на вкладке и в окне), но не теги. Места не подсвечены до первой попытки. `q2.say` не намекает на верный вариант.
- **Объём речи.** Обязательная речь — реплики, которые звучат у каждого ученика (▶), без ошибок и подсказок. Подсчёт слов по русскому тексту:
  - **было:** около 610 слов, из них экран плана — около 60;
  - **стало:** около 560 слов, плюс три реплики об управлении (`s5.sayHow`, `s13.sayMove`, `s14.sayHow`) — около 50 слов;
  - итог примерно на 8–10 % меньше при большем числе понятных инструкций.

  Узбекские реплики длиннее русских примерно на 15–20 %, как и раньше. Длительность без настоящего аудио — только оценка: около 4–5 минут обязательной речи вместо 5–5,5. Подсчёт приблизительный, по тексту, без замера.
