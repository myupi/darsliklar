# Урок 3 · «Списки» · курс HTML / модуль 1 «Основы разметки»

Сценарий на утверждение. Код пишется только после «пиши код».

## Паспорт

- lessonId: `html-03-spiski`
- module: `html-m1-osnovy`
- Возраст: 11–14 (по плану курса, как урок 2)
- Цель урока одной фразой: ребёнок сможет оформить перечень как список с точками (`ul`) или с номерами (`ol`), каждый пункт — в `li`, и выбрать вид списка по смыслу: важен порядок или нет.
- Новое понятие: список; `ul` — список с точками, порядок не важен; `ol` — список с номерами, порядок важен, номера браузер ставит сам; `li` — один пункт, живёт только внутри `ul` или `ol`.
- Что уже знает: структура документа (`html`, `head`, `title`, `body`), заголовки `h1`–`h6`, абзац `p`, `b` и `i`, открывающий и закрывающий тег.
- Крючок: Коди готовится к турниру по робофутболу (продолжение урока 2). Он написал «Что взять с собой» одним абзацем через запятые — и сам не может быстро сосчитать вещи.
- Изюминка (главная механика): живой мини-браузер рядом с кодом. Каждое действие в коде сразу меняет точки и номера на странице. Кульминация — «номера сами»: вставил пункт в середину `ol`, и браузер перенумеровал всё сам.
- Артефакт урока: своя страница ученика — `h1` и список (`ul` или `ol` по смыслу темы) из трёх пунктов. `{ type: 'html-page', title, h1, list: 'ul' | 'ol', items: [...], html }`.

## Экраны

Одна новая тема — тройка «показать → повторить → сделать самому»:
- `ul` + `li`: экраны 3 → 4 → 5;
- `ol`: экраны 6 → 7 → 8;
- выбор `ul` / `ol` по смыслу: 9 → 12 → 14.

| # | id | Код | Механика | Одно действие ребёнка | Что видно сразу | voiceTop | store | log type |
|---|----|-----|----------|-----------------------|-----------------|----------|-------|----------|
| 1 | s1 | HOOK | выбор числа + превращение в список | Сосчитать вещи в абзаце и нажать число (4 / 5 / 6) | Ответ подсвечивается; абзац сам превращается в список с точками, вещи видно сразу | нет | s1 | count |
| 2 | s2 | MISSION | карточки плана (как в уроке 2) | Слушает план, карточки открываются по голосу | Три карточки: «Список с точками», «Список с номерами», «Своя страница» | нет | s2 | — |
| 3 | s3 | SHOW | код ↔ браузер, нажатия строк | Нажать каждую строку `<li>` (0/3) | Нажатая строка и её точка на странице загораются одним цветом; `ul` охватывает все | да | s3 | — |
| 4 | s4 | LEVEL-1 | поле в коде (`InlineInput`) | Написать четвёртую вещь в пустой строке `<li>…</li>` | На странице сразу появляется новый пункт с точкой | да | s4 | — |
| 5 | s5 | LEVEL-2 | слова-кнопки → `li` | Нажимать вещи в абзаце по очереди: каждая становится `<li>` (0/4) | Слово уходит из абзаца в список; в коде появляется строка `<li>`, на странице — точка | да | s5 | wrap |
| 6 | s6 | SHOW | переключатель тега `ol` ↔ `ul` | Нажать на открывающий тег — он меняется `ol` ↔ `ul` (увидеть оба вида) | Номера превращаются в точки и обратно; закрывающий тег меняется вместе с открывающим | да | s6 | — |
| 7 | s7 | PREDICT | «угадай, потом посмотри» | Коди вставит новый шаг вторым. Выбрать, какой номер станет у «Включи робота»: 2 / 3 / 4 | После ответа строка вставляется, номера на странице пересчитываются с анимацией | да | s7 | predict |
| 8 | s8 | LEVEL-3 | стереть лишнее (тап по токену) | Нажать каждую цифру, написанную руками внутри `li` (0/3) | Двойные номера «1. 1.» на странице становятся одинарными | да | s8 | erase |
| 9 | s9 | LEVEL-4 | выбор `ul` / `ol` с превью, 4 раунда | Для каждой карточки нажать `ul` или `ol` | Список на карточке сразу рисуется точками или номерами; верный — зеленеет, неверный гаснет; после 2 промахов светится верный | да | s9 | choose-list |
| 10 | s10 | CHECK-1 | панель проверки + перенос строки | Нажать строку `<li>`, стоящую вне списка, потом место внутри `<ul>` | Правило «Каждый li — внутри ul или ol» становится зелёным, пункт встаёт в список | да | s10 | move-li |
| 11 | s11 | LEVEL-5 | набор тега кнопками (`KeyRow`) | Набрать `</ol>` кнопками `<` `/` `o` `u` `l` `>` | Набранный верно — засчитывается сам; список на странице закрыт, ниже снова идёт абзац | да | s11 | type-close |
| 12 | s12 | CHECK-2 | HTML-детектив, 3 дела | В каждом деле нажать одно место в коде, которое стоит не так | Место подсвечивается и исправляется; на странице виден результат | да | s12 | detective |
| 13 | s13 | SANDBOX | пошаговая сборка «Новый раздел» (1/4 … 4/4) | По шагам: нажать «+ h2», написать «Расписание», нажать «+ ol», написать два пункта | Страница справа растёт с каждым шагом | да | s13 | — |
| 14 | s14 | RESULT | свой проект по шагам | Выбрать тему → выбрать `ul` или `ol` (проверяется по смыслу темы) → написать 3 пункта | Своя страница собирается вживую | да | s14 | project |
| 15 | s15 | ACHIEVEMENT | сохранить страницу | Нажать «Сохранить страницу» | Своя страница и её код; «Сохранено» | нет | s15 | — |
| 16 | s16 | PREVIEW | итог | Нажать «Завершить урок» | Три умения с галочками и карточка следующего урока «Ссылки» (`a`, `href`) | нет | — | — |

Жанры чередуются, двух одинаковых механик подряд нет. «Проверить» есть только на экране 11 (набор тега) — для разбора неверного; правильный набор засчитывается сам.

## Тексты по экранам

RU — основной текст; UZ и EN даны полностью. В репликах нет имени ученика, символов `+ / % = ×` и запретных слов. Теги в уголках проговариваются словами (`SpokenTags`).

### 1 · s1 · HOOK — «Что взять?»
- eyebrow: L3('Turnirga tayyorgarlik', 'Сборы на турнир', 'Getting ready')
- На экране абзац в мини-браузере: «Взять с собой: робот, пульт, зарядка, запасные колёса, вода.»
- say:
  - hello — L3('Salom! Yana men, Kodi. Ertaga robofutbol turniri!', 'Привет! Снова я, Коди. Завтра турнир по робофутболу!', 'Hi! Kodi again. The robot football tournament is tomorrow!')
  - curious — L3('Men nimalarni olishimni yozdim. Lekin sanab chiqish qiyin.', 'Я записал, что взять с собой. Но сосчитать вещи трудно.', 'I wrote down what to take. But it is hard to count the things.')
  - point — L3('Sanab ko‘ring: nechta narsa olish kerak?', 'Посчитай: сколько вещей нужно взять?', 'Count them: how many things should I take?')
- ask: L3('Nechta narsa? Sonni bosing', 'Сколько вещей? Нажми число', 'How many things? Tap the number') — варианты 4 / 5 / 6, ответ 5.
- после ответа (любого) абзац превращается в список с точками:
  - верно — L3('To‘g‘ri, beshta! Endi qarang: ro‘yxatda har bir narsa alohida qatorda.', 'Верно, пять! А теперь смотри: в списке каждая вещь на своей строке.', 'Right, five! Now look: in a list, each thing is on its own line.')
  - неверно — L3('Qarang, ro‘yxatda sanash oson: narsalar beshta. Har biri alohida qatorda.', 'Смотри, в списке считать легко: вещей пять. Каждая — на своей строке.', 'Look, a list is easy to count: there are five things. Each is on its own line.')
- askDone: L3('Ro‘yxatda hammasi bir qarashda ko‘rinadi', 'В списке всё видно с первого взгляда', 'In a list, everything is clear at a glance')

### 2 · s2 · MISSION — план
- eyebrow: L3('Reja', 'План', 'Plan')
- say: L3('Bugun ro‘yxatlar qilamiz. Uch qadam.', 'Сегодня делаем списки. Три шага.', 'Today we make lists. Three steps.')
- карточки:
  - «Список с точками» — L3('Avval nuqtali ro‘yxat: tartib muhim bo‘lmaganda.', 'Сначала список с точками — когда порядок не важен.', 'First a bulleted list, for when order does not matter.')
  - «Список с номерами» — L3('Keyin raqamli ro‘yxat: qadamlar tartib bilan bo‘lganda.', 'Потом список с номерами — когда важен порядок шагов.', 'Then a numbered list, for when the order of steps matters.')
  - «Своя страница» — L3('Oxirida o‘z sahifangizni ro‘yxat bilan yasaysiz.', 'А в конце ты сделаешь свою страницу со списком.', 'And at the end you will make your own page with a list.')
- done: L3('Boshladik!', 'Начинаем!', 'Let’s start!')

### 3 · s3 · SHOW — `ul` и `li`
- eyebrow: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list')
- Код: `<ul>` · `<li>Робот</li>` · `<li>Пульт</li>` · `<li>Зарядка</li>` · `</ul>`; рядом браузер с тремя точками.
- say:
  - explain — L3('Bu ro‘yxat kodi. ul — butun ro‘yxat qutisi. U nuqtali ro‘yxatni ochadi va yopadi.', 'Вот код списка. ul — коробка всего списка. Он открывает и закрывает список с точками.', 'Here is the code of a list. ul is the box for the whole list. It opens and closes a bulleted list.')
  - point — L3('Ichida li qatorlari. Har bir li — bitta band. Har bir li qatorini bosing.', 'Внутри — строки li. Каждая li — один пункт. Нажми каждую строку li.', 'Inside are li lines. Each li is one item. Tap each li line.')
- ask: L3('Har bir li qatorini bosing', 'Нажми каждую строку li', 'Tap each li line') — счётчик 0/3
- на каждое нажатие: L3('Bu li — sahifada bitta nuqta va bitta band.', 'Эта li — одна точка и один пункт на странице.', 'This li is one bullet and one item on the page.')
- done: L3('Uchta li — uchta band. Nuqtalarni brauzer o‘zi qo‘yadi.', 'Три li — три пункта. Точки браузер ставит сам.', 'Three li tags make three items. The browser adds the bullets itself.')

### 4 · s4 · LEVEL-1 — допиши пункт
- eyebrow: L3('Yangi band', 'Новый пункт', 'New item')
- say: L3('Suv esdan chiqdi. Bo‘sh li qatoriga yana bitta narsa yozing.', 'Я забыл воду. Напиши ещё одну вещь в пустую строку li.', 'I forgot the water. Write one more thing in the empty li line.')
- ask: L3('Bo‘sh li ichiga narsa yozing', 'Напиши вещь внутри пустой li', 'Write a thing inside the empty li') — засчитывается после паузы в наборе (буквы, без уголков)
- noTags: L3('Bu yerga faqat so‘z, burchaksiz.', 'Здесь только слово, без уголков.', 'Only a word here, no angle brackets.')
- praise: L3('Yangi band sahifada paydo bo‘ldi — nuqtasi bilan.', 'Новый пункт появился на странице — сразу с точкой.', 'The new item appeared on the page, with its bullet.')

### 5 · s5 · LEVEL-2 — каждой вещи свою `li`
- eyebrow: L3('Abzatsdan ro‘yxatga', 'Из абзаца — в список', 'From paragraph to list')
- На экране абзац «Робот, пульт, зарядка, вода»; ниже код `<ul>…</ul>` и браузер.
- say: L3('Endi o‘zingiz. Abzatsdagi har bir narsani bosing — u li ga aylanadi.', 'Теперь сам. Нажимай вещи в абзаце — каждая станет li.', 'Now you. Tap each thing in the paragraph and it becomes an li.')
- ask: L3('Abzatsdagi narsalarni tartib bilan bosing', 'Нажимай вещи в абзаце по порядку', 'Tap the things in the paragraph in order') — 0/4. Порядок слева направо: нажатие не по порядку — Коди мягко просит взять первую оставшуюся (однозначный ответ).
- outOfOrder: L3('Ro‘yxat abzatsdagi tartibni saqlaydi. Chapdagi birinchisini oling.', 'Список сохраняет порядок абзаца. Возьми первую слева.', 'The list keeps the paragraph order. Take the first one on the left.')
- each: L3('Yana bir li!', 'Ещё одна li!', 'One more li!') (ротация похвал канона)
- done: L3('Abzats ro‘yxatga aylandi: to‘rtta narsa — to‘rtta li.', 'Абзац стал списком: четыре вещи — четыре li.', 'The paragraph became a list: four things, four li tags.')

### 6 · s6 · SHOW — `ol`: номера
- eyebrow: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list')
- Код: `<ol>` · `<li>Заряди батарею</li>` · `<li>Включи робота</li>` · `<li>Выйди на поле</li>` · `</ol>`
- say:
  - explain — L3('Robotni tayyorlash — qadamlar. Bu yerda tartib muhim. Buning uchun ol — raqamli ro‘yxat.', 'Подготовка робота — это шаги. Здесь важен порядок. Для этого есть ol — список с номерами.', 'Getting the robot ready is a set of steps. Order matters here. For that there is ol, a numbered list.')
  - point — L3('Ochuvchi tegni bosing: ol va ul almashadi. Ikkala ko‘rinishni ham ko‘ring.', 'Нажми на открывающий тег: ol и ul поменяются. Посмотри оба вида.', 'Tap the opening tag: ol and ul swap. Look at both views.')
- ask: L3('Ochuvchi tegni bosing va ikkala ko‘rinishni ko‘ring', 'Нажми на открывающий тег и посмотри оба вида', 'Tap the opening tag and see both views')
- toUl: L3('ul — nuqtalar. Qadamlar tartibi ko‘rinmay qoldi.', 'ul — точки. Порядок шагов пропал.', 'ul gives bullets. The order of the steps is gone.')
- toOl: L3('ol — raqamlar. Ularni brauzer o‘zi qo‘ydi.', 'ol — номера. Их браузер поставил сам.', 'ol gives numbers. The browser added them itself.')
- done: L3('Tartib muhim bo‘lsa — ol. Muhim bo‘lmasa — ul.', 'Важен порядок — ol. Не важен — ul.', 'If order matters, use ol. If not, use ul.')

### 7 · s7 · PREDICT — номера сами
- eyebrow: L3('Oldindan ayting', 'Угадай', 'Guess')
- say: L3('Men ikkinchi qadamni qo‘shaman: «Pultni tekshiring». U «Robotni yoqing» dan oldin turadi. Endi «Robotni yoqing» qaysi raqamda bo‘ladi?', 'Я добавлю вторым шагом «Проверь пульт» — перед «Включи робота». Какой номер теперь будет у «Включи робота»?', 'I will add “Check the remote” as the second step, before “Turn on the robot”. What number will “Turn on the robot” have now?')
- ask: L3('«Robotni yoqing» qaysi raqamda bo‘ladi?', 'Какой номер будет у «Включи робота»?', 'What number will “Turn on the robot” have?') — варианты 2 / 3 / 4, ответ 3. После ответа строка вставляется, номера пересчитываются.
- right: L3('To‘g‘ri, 3! Raqamlarni o‘zimiz o‘zgartirmadik — brauzer hammasini qayta sanadi.', 'Верно, 3! Мы номера не трогали — браузер пересчитал всё сам.', 'Right, 3! We didn’t touch the numbers. The browser renumbered everything.')
- miss: L3('Qarang: yangi qadam ikkinchi, demak «Robotni yoqing» uchinchi bo‘ldi. Brauzer o‘zi qayta sanadi.', 'Смотри: новый шаг стал вторым, значит «Включи робота» — третий. Браузер пересчитал сам.', 'Look: the new step is second, so “Turn on the robot” is now third. The browser renumbered by itself.')
- Если промах — ещё один раунд того же типа: вставляем шаг первым («Надень форму»), вопрос про «Выйди на поле» (ответ 4).

### 8 · s8 · LEVEL-3 — лишние цифры
- eyebrow: L3('Ortiqcha raqamlar', 'Лишние цифры', 'Extra numbers')
- Код `ol` с пунктами `<li>1. Заряди батарею</li>` и т. д.; на странице «1. 1. Заряди батарею».
- say: L3('Qarang, raqamlar ikki marta! Men ularni li ichiga qo‘lda yozibman. Har bir qo‘lda yozilgan raqamni bosing — u o‘chadi.', 'Смотри, номера двойные! Я написал цифры руками внутри li. Нажми каждую такую цифру — она сотрётся.', 'Look, the numbers are doubled! I typed digits by hand inside li. Tap each typed digit and it will be erased.')
- ask: L3('li ichidagi qo‘lda yozilgan raqamlarni bosing', 'Нажми цифры, написанные руками внутри li', 'Tap the hand-typed numbers inside li') — 0/3; кликабельны все слова пункта, нажатие на слово, а не цифру — «Это часть шага. Ищи цифру в начале».
- notDigit: L3('Bu qadamning so‘zi. Boshidagi raqamni qidiring.', 'Это слово шага. Ищи цифру в начале.', 'That is a word of the step. Look for the digit at the start.')
- done: L3('Endi raqamlar bittadan. ol da raqamlarni yozmaymiz — brauzer o‘zi qo‘yadi.', 'Теперь номера одинарные. В ol цифры не пишем — браузер ставит их сам.', 'Now each number appears once. In ol we don’t type numbers: the browser adds them.')

### 9 · s9 · LEVEL-4 — какой список нужен?
- eyebrow: L3('Qaysi ro‘yxat?', 'Какой список?', 'Which list?')
- say: L3('Har bir kartochka uchun ro‘yxat tanlang. O‘zingizdan so‘rang: tartib muhimmi?', 'Для каждой карточки выбери список. Спроси себя: важен ли порядок?', 'Choose a list for each card. Ask yourself: does the order matter?')
- ask: L3('ul yoki ol? Tartib muhimmi?', 'ul или ol? Важен ли порядок?', 'ul or ol? Does order matter?') — 4 раунда, у каждого один ответ:
  1. «Бутерброд: возьми хлеб → намажь масло → положи сыр» — `ol` (шаги)
  2. «Что взять в поход: фонарик, вода, кепка» — `ul` (набор вещей)
  3. «Итоги турнира: 1 место — Альфа, 2 место — Бета, 3 место — Гамма» — `ol` (места по порядку)
  4. «Мои любимые игры: шахматы, футбол, Minecraft» — `ul` (просто перечень)
- ok/why:
  - ol — L3('To‘g‘ri, ol: bu yerda tartib muhim.', 'Верно, ol: здесь важен порядок.', 'Right, ol: the order matters here.')
  - ul — L3('To‘g‘ri, ul: narsalarni istalgan tartibda yozish mumkin.', 'Верно, ul: вещи можно перечислить в любом порядке.', 'Right, ul: the things can go in any order.')
- miss:
  - нужен ol — L3('Ularni almashtirib ko‘ring: ma’no buziladimi? Buziladi — demak tartib muhim.', 'Попробуй поменять их местами: смысл ломается? Ломается — значит, порядок важен.', 'Try swapping them: does the meaning break? It does, so the order matters.')
  - нужен ul — L3('Bu narsalarni almashtirsa ham hech narsa o‘zgarmaydi. Tartib muhim emas.', 'Эти вещи можно поменять местами — ничего не изменится. Порядок не важен.', 'Swapping these things changes nothing. The order doesn’t matter.')
- После двух промахов в раунде светится верная кнопка (как «Какая цифра?» в уроке 2).

### 10 · s10 · CHECK-1 — пункт сбежал
- eyebrow: L3('Band qochib ketdi', 'Пункт сбежал', 'A runaway item')
- Код: `<ul>` · `<li>Робот</li>` · `<li>Пульт</li>` · `</ul>` · `<li>Зарядка</li>`; панель «Проверка структуры»: «Каждый li — внутри ul или ol».
- say (sorry — ошибся Коди): L3('Voy, shoshib qoldim: bitta li ro‘yxatdan tashqarida qoldi. Tekshiruv paneliga qarang va uni joyiga qo‘ying.', 'Ой, я спешил: одна li осталась за списком. Посмотри на панель проверки и верни её на место.', 'Oops, I rushed: one li ended up outside the list. Look at the check panel and put it back.')
- ask (два касания одного действия «перенести»): L3('Tashqaridagi li qatorini bosing, keyin ul ichidagi joyni', 'Нажми строку li за списком, потом место внутри ul', 'Tap the li line outside the list, then a place inside ul')
- hints: 1) L3('Panelga qarang: qaysi li ul dan tashqarida?', 'Посмотри на панель: какая li стоит вне ul?', 'Look at the panel: which li is outside ul?') 2) L3('</ul> dan keyin turgan li ni toping.', 'Найди li, которая стоит после </ul>.', 'Find the li that comes after </ul>.') 3) L3('«Zaryadka» qatorini bosing, keyin «Pult» qatorini.', 'Нажми строку «Зарядка», потом строку «Пульт».', 'Tap the “Charger” line, then the “Remote” line.')
- why: L3('Endi li ro‘yxat ichida. Har bir band — ul yoki ol ichida yashaydi.', 'Теперь li внутри списка. Каждый пункт живёт внутри ul или ol.', 'Now the li is inside the list. Every item lives inside ul or ol.')

### 11 · s11 · LEVEL-5 — закрой список
- eyebrow: L3('Ro‘yxatni yoping', 'Закрой список', 'Close the list')
- Код `ol` из трёх шагов, последней строки нет; после пустой строки — абзац `<p>Удачи на турнире!</p>`.
- say: L3('Ro‘yxat oxiri yo‘q. Tugmalar bilan yopuvchi tegni tering.', 'У списка нет конца. Набери кнопками закрывающий тег.', 'The list has no end. Type the closing tag with the buttons.')
- ask: L3('Bo‘sh qatorga ro‘yxatning yopuvchi tegini tering', 'Набери в пустой строке закрывающий тег списка', 'Type the list’s closing tag in the empty line')
- hint (голос, без символов): L3('ol ni yopuvchi teg: qiya chiziq va ol nomi.', 'Закрывающий тег для ol: косая черта и имя ol.', 'The closing tag for ol: a slash and the name ol.')
- разбор неверного: `</ul>` — L3('Bu ul ni yopadi. Ro‘yxat esa ol bilan ochilgan.', 'Это закрывает ul. А список открыт тегом ol.', 'That closes ul. But the list was opened with ol.'); `<ol>` — L3('Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Это открывающий тег. В закрывающем есть косая черта.', 'That is an opening tag. A closing tag has a slash.')
- praise: L3('Ro‘yxat yopildi — abzats yana oddiy matn bo‘lib ketdi.', 'Список закрыт — абзац снова обычный текст.', 'The list is closed, and the paragraph is plain text again.')

### 12 · s12 · CHECK-2 — HTML-детектив
- eyebrow: L3('HTML-detektiv', 'HTML-детектив', 'HTML detective')
- say: L3('Uchta ish. Har birida kodda bitta joy boshqacha turishi kerak. Uni toping va bosing.', 'Три дела. В каждом в коде одно место стоит не так. Найди его и нажми.', 'Three cases. In each, one place in the code is not right. Find it and tap it.')
- дела (одно касание по токену, место исправляется само):
  1. Шаги рецепта в `ul` — нажать `<ul>` → становится `ol`. why: L3('Qadamlar — tartib muhim, demak ol.', 'Это шаги — порядок важен, значит ol.', 'These are steps: order matters, so ol.')
  2. В `ol` у пункта «3. Выйди на поле» руками написана цифра — нажать «3.» → стирается. why: L3('ol da raqamni brauzer qo‘yadi.', 'В ol номер ставит браузер.', 'In ol, the browser adds the number.')
  3. Пункт `<li>Вода` без закрывающего тега — нажать место после «Вода» → появляется `</li>`. why: L3('Har bir li yopiladi: </li>.', 'Каждая li закрывается: </li>.', 'Every li is closed with </li>.')
- hints на каждое дело: направление → сужение → почти ответ (как в уроке 2).

### 13 · s13 · SANDBOX — новый раздел
- eyebrow: L3('Yangi bo‘lim', 'Новый раздел', 'New section')
- say: L3('Sahifaga turnir jadvalini qo‘shamiz. To‘rt qadam.', 'Добавим на страницу расписание турнира. Четыре шага.', 'Let’s add the tournament schedule to the page. Four steps.')
- шаги (счётчик «N/4», каждый засчитывается сам):
  1. L3('«h2» tugmasini bosing', 'Нажми кнопку «+ h2»', 'Tap the “+ h2” button') · голос: L3('h2 tugmasini bosing', 'Нажми кнопку h2', 'Tap the h2 button')
  2. L3('Sarlavhaga «Jadval» deb yozing', 'Напиши в заголовок «Расписание»', 'Write “Schedule” in the heading')
  3. L3('«ol» tugmasini bosing', 'Нажми кнопку «+ ol»', 'Tap the “+ ol” button') · голос: L3('ol tugmasini bosing', 'Нажми кнопку ol', 'Tap the ol button')
  4. L3('Ikki bandni yozing: nima birinchi, nima ikkinchi', 'Напиши два пункта: что первым, что вторым', 'Write two items: what comes first, what second')
- done: L3('Bo‘lim tayyor: sarlavha va raqamli ro‘yxat.', 'Раздел готов: заголовок и список с номерами.', 'The section is ready: a heading and a numbered list.')

### 14 · s14 · RESULT — мой проект
- eyebrow: L3('Mening loyiham', 'Мой проект', 'My project')
- say: L3('Endi o‘z sahifangiz. Mavzu tanlang, keyin ro‘yxat turini tanlang va uchta band yozing.', 'Теперь своя страница. Выбери тему, потом вид списка и напиши три пункта.', 'Now your own page. Pick a topic, then the kind of list, and write three items.')
- шаг 1 — тема (каждая с однозначным видом списка):
  - L3('Sayohatga nima olaman', 'Что я возьму в поездку', 'What I’ll take on a trip') → `ul`
  - L3('Mening retseptim', 'Мой рецепт', 'My recipe') → `ol`
  - L3('Mening top-3 o‘yinlarim', 'Мой топ-3 игр', 'My top 3 games') → `ol` (места по порядку)
  - L3('Sevimli hayvonlarim', 'Мои любимые животные', 'My favourite animals') → `ul`
- шаг 2 — выбор `ul` / `ol`: верный ставится, неверный гаснет с объяснением «порядок важен / не важен» (тексты из экрана 9).
- шаг 3 — три пункта в полях `<li>`; страница собирается вживую; засчитывается, когда во всех трёх есть слова.
- done: L3('Ajoyib sahifa! Ro‘yxat to‘g‘ri tanlangan, bandlar o‘zingizniki.', 'Отличная страница! Вид списка выбран по смыслу, а пункты — твои.', 'A great page! The list fits the meaning, and the items are yours.')

### 15 · s15 · ACHIEVEMENT — моя страница
- eyebrow: L3('Mening sahifam', 'Моя страница', 'My page')
- say: L3('Mana sizning sahifangiz! Uni saqlang.', 'Вот твоя страница! Сохрани её.', 'Here is your page! Save it.')
- saved: L3('Saqlandi! Ro‘yxatli birinchi sahifangiz.', 'Сохранено! Твоя первая страница со списком.', 'Saved! Your first page with a list.')

### 16 · s16 · PREVIEW — итог
- eyebrow: L3('Yakun', 'Итог', 'Wrap-up')
- say (bye): L3('Bugun ro‘yxatlar qildik: nuqtali va raqamli. Keyingi darsda havolalar qilamiz — sahifalar bir-biriga bog‘lanadi. Ko‘rishguncha!', 'Сегодня мы сделали списки: с точками и с номерами. На следующем уроке сделаем ссылки — страницы свяжутся друг с другом. Пока!', 'Today we made lists: bulleted and numbered. Next lesson we’ll make links, so pages connect to each other. Bye!')
- skills (печатаются): «ul — список с точками, порядок не важен» · «ol — список с номерами, номера ставит браузер» · «li — один пункт, всегда внутри ul или ol»
- next: L3('Havolalar va atributlar', 'Ссылки и атрибуты', 'Links and attributes') · теги `a · href`

## Арт

- Мини-браузер в виде Chrome в Windows (как в уроках 1–2): вкладка «Робофутбол». Страница рисует список как браузер без CSS: точки — диски, номера — «1.» с отступом.
- Цвета тегов (одной светлоты с остальными): `ul` и `ol` — новый общий цвет списков `#2F6FB0` (стальной синий, отличается от `body` `#1171A0`), `li` — `#5B7F2A` (оливковый). Нужно утверждение: это расширение `TAGC` внутри урока, канон не меняется.
- Экран 1: абзац плавно «рассыпается» на строки с точками (при «меньше движения» — сразу).
- Экран 7: новая строка «въезжает» в код и список, номера на странице пересчитываются с короткой подсветкой.
- Карточки экрана 9: мини-превью списка точками или номерами.

## Особые правила урока

- Нет. Канон не меняется. Помощники (`Tag`, код, `MiniBrowser`, `InlineInput`, `KeyRow`, `SpokenTags`, `SPOKEN`, `heroLines`) берутся из урока 2. Модель страницы урока 2 расширяется блоками `ul` / `ol` с пунктами.
- В `SpokenTags` добавляются произношения: `ul` — «ю-эль», `ol` — «о-эль», `li` — «эль-ай» (RU); UZ — «yu-el», «o-el», «el-ay»; EN — «U L», «O L», «L I». Проверить на голосе и при необходимости заменить на «список», «нумерованный список», «пункт».

## Проверка по чек-листу

Сценарий закрывает все пункты, кроме тех, что проверяются только в коде: раскладка на 360×640 / 375×740 / 1280×720 / 1440×900, клавиатура, однократный `onFinished`, `prefers-reduced-motion`.

Открытые вопросы к заказчику:
1. Цвета `ul`/`ol` и `li` — подходят?
2. Экран 5 требует брать вещи по порядку (иначе у задания нет однозначного ответа) — так нормально?
3. Нужна ли практика `03p` к этому уроку сразу (в плане курса `practice: true`) — или сначала урок?
