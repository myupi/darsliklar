# Банк вопросов тренажёра Bootstrap — как писать вопросы

Тренажёр модуля Bootstrap (заказчик, 21.11.2026: «делай тренажёр для бутстрапа») — тот же тренажёр, что у HTML, CSS и «ИИ»
(`tools/trenajor/trenajor.jsx`). **Прочитать целиком `tools/trenajor/html/FORMAT.md`** — всё оттуда действует (поля вопроса,
длины, типы `input` / `build` / `bug` / `tap`, языки, `why` без похвалы), если ниже не сказано иначе.
LMS берёт вопросы модуля и случайно выбирает 15 на попытку; у вопроса — номер урока (`lesson`), чтобы брать только пройденные.
Миссия — «Сайт одевается» (как у CSS): верный ответ даёт части сайта слово Bootstrap.

Файл урока: `tools/trenajor/bootstrap/lNN.mjs` (NN = 01…10). Обычный JS-модуль, **без JSX**, `export default [ … ]`.
Проверка: `node tools/trenajor/build.mjs --check --draft bootstrap` (пока готовы не все уроки — `--draft`).

## Сколько

- Уроки 1–9 — по **18**: **11** с выбором (`q01`…`q11`), **3** «впиши ответ» (`q12`…`q14`), **2** «собери» (`q15`, `q16`),
  **1** «найди ошибку» (`q17`), **1** «нажми на странице» (`q18`).
- Урок 10 (финальный проект, повторение всего модуля) — **21**: 12 с выбором (`q01`…`q12`), 4 «впиши» (`q13`…`q16`),
  2 «собери» (`q17`, `q18`), 2 «найди ошибку» (`q19`, `q20`), 1 «нажми» (`q21`).
- id — `bootstrap_lNN_qKK`. Сложность вопросов с выбором: примерно 4 `easy`, 5 `medium`, 2 `hard`.

## Картинка вопроса `vis` — HTML-вид с настоящим CSS Bootstrap 6

Как в тренажёре HTML: `vis: { code, page, mark }` — тёмный редактор (`index.html`) и/или окно Chrome со страницей.
**Страница рисуется с настоящим CSS Bootstrap 6.0.0-alpha.1** (тот же файл, что в уроках), светлая тема. Это делает сборщик
сам (`vis.bs = true`); если вопрос про страницу **без** подключённого Bootstrap (нет строки `link`, опечатка в адресе) —
поставить `bs: false`: страница будет голой, как в браузере.

```js
vis: { code: '<button class="btn-solid theme-success">Yuborish</button>', page: true }   // код и страница с Bootstrap
vis: { code: '<div class="alert ___" role="alert">…</div>' }                             // только код; ___ — пустое место
vis: { page: '<div class="d-flex gap-5">…</div>' }                                        // только страница
vis: { code: '…', page: true, bs: false }                                                  // страница БЕЗ CSS Bootstrap
vis: { code: '…', page: true, vw: 360 }                                                    // ширина страницы (телефон 360, ноутбук 800)
```

- Код — кусок `body` (без `<!DOCTYPE>`, `head`), **кроме** вопросов про подключение (урок 1, 11): там можно `head` со строкой `link`.
  Строку `link` / `script` в коде писать **короче**, как в уроках: `<link href="…/bootstrap.min.css" rel="stylesheet">`,
  `<script src="…/bootstrap.bundle.min.js"></script>` (длинный адрес и integrity не нужны — в редакторе всё равно свернутся).
- Код: **до 8 строк**, если рядом страница; **до 10**, если только код. Строки до ~44 знаков, отступ 2 пробела.
- Тексты страницы — на языке ученика (`code` / `page` объектом `{ uz, ru, en }`), классы и атрибуты — всегда латиницей.
- **Скриптов на странице нет**: меню, окно, карусель не открываются и не листаются. Поэтому на странице показывать их так, как
  делает сайт Bootstrap в статичных примерах: меню — `<div class="menu show position-static">`, окно — `<dialog class="dialog" open>`
  (страница покажет окно на месте, без затемнения), карусель — первый слайд (`active`). Вопросы про то, что делает скрипт
  («что будет по нажатию», «почему кнопка не работает»), — кодом без страницы или страницей «как сейчас» + вопрос.
- `@media` и сетка `md:col-4` срабатывают по ширине страницы — в вопросах про сетку **всегда** ставить `vw` (360 / 800).
- Картинки: `src` с именами `sher.png 🦁, mushuk.png 🐱, it.png 🐶, pingvin.png 🐧, robot.png 🤖, pitsa.png 🍕, tort.png 🎂, top.png ⚽`
  (160×120), `logo.png 🏕️` (90×90), `tog.png 🏔️` (320×180), **`banner.png 🏟️` (800×300 — шире страницы: для `img-fluid`)**.
  Любое другое имя (`robot1.jpg`, `...`) — сломанная картинка с alt. Bootstrap 6 **сам картинку не сжимает** — это делает `img-fluid`.
- Цвета `theme-*` на странице — настоящие цвета Bootstrap 6. Не давать в вариантах цвета, которые на глаз не различить.
- Ссылки не открываются, формы не отправляются, `:hover` нет.

## Что проверяем — материал модуля (Bootstrap 6, сверено с getbootstrap.com/docs/6.0 и самим CSS)

**Только Bootstrap 6.** Имя из версии 5 можно дать **неверным вариантом** или ошибкой в коде, а в `why` — одной фразой «… — старое имя
из 5-й версии, в 6-й не работает». Главное умение модуля — **найти нужное на сайте Bootstrap, скопировать пример и настроить под себя**
(текст, цвет `theme-*`, размер) — вопросы про это обязательны в каждом уроке (где на сайте искать, что в скопированном примере поменять,
что значит `src="..."` в примере, что оставить как есть).

| Урок | Материал (то, что ученик знает) | Типичные ошибки (неверные варианты) |
|---|---|---|
| 1 Введение | Bootstrap — готовые классы (CSS уже написан); сайт getbootstrap.com: Docs → Getting started → Install, Components → Alert; подключение CDN: строка `link` в `head` (href, `rel="stylesheet"`, integrity, crossorigin) и `script type="module"` в конце `body`; нет `link` или буква в адресе — страница голая; e'lon `class="alert theme-warning" role="alert"`; крестик закрытия работает только со `script` | строка link в body; script в head; `alert-danger` (версия 5); опечатка в адресе; класс с точкой `.alert` |
| 2 Цвета и кнопки | кнопка — два слова: стиль `btn-solid` / `btn-outline` + цвет `theme-primary` (синий), `accent` (фиолетовый), `success`, `danger`, `warning`, `info` (голубой), `inverse`, `secondary`; цвет текста `fg-*`, фон `bg-*` (Utilities → Colors / Background); раздел Components → Button → Variants | `btn-primary`, `btn-success` (версия 5); `text-danger` (версия 5); `theme-green` (цвет своим словом); `btn-solid` без `theme-*`; `fg-` у фона, `bg-` у текста |
| 3 Загрузка и изображения | `img-fluid` (картинка не шире родителя; в 6 сама не сжимается), `img-thumbnail`, `rounded`, `rounded-circle`, `rounded-pill`; спиннер `spinner-border` / `spinner-grow` + `role="status"` + скрытый `<span class="visually-hidden">Loading...</span>`; цвет спиннера `fg-*`; заглушка `placeholder col-6` (без `col-…` не видна), `placeholder-wave` у родителя | `img-responsive`, `img-circle` (версия 3); `spinner` без `-border`; `placeholder` без ширины |
| 4 Flex | `d-flex`; главная ось `justify-content-start / end / center / between / around / evenly`; поперечная `align-items-start / end / center`; `gap-0…12` — номер в таблице (`gap-3` = 8px, `gap-5` = 16px, `gap-9` = 32px), не пиксели; `flex-wrap` | `justify-content-space-between` (CSS-значение); `gap-16` (пиксели); `align-items-middle`; `display: flex;` в class |
| 5 Карточки | `card` (рамка), `card-body` (отступы внутри), `card-img-top` (фото сверху), `card-title` и `card-text` — имена частей (своих правил в 6.0 нет, держат `card` и `card-body`); цвет `card theme-*`, мягкий — `card card-subtle theme-*`; ряд карточек `d-flex gap-*`; в примере сайта `src="..."` — поставить свой файл | `card-success` (нет такого); `bg-*` вместо `theme-*`; файл без окончания `robot`; `card-header` вместо `card-body` |
| 6 Контейнер и сетка | `container` (посередине, max-width 540 / 720 / 960 / 1200 / 1440); `row`; `col`, `col-1…12` — доля из 12; адаптивно — **через двоеточие** `md:col-4` (sm 576, md 768, lg 1024, xl 1280, 2xl 1536 px): на телефоне колонки друг под другом, с md — рядом | `col-md-4` (версия 5); `md-col-4` (дефис); `col-13`; `rows`; `d-flex` вместо `row`; сумма больше 12 |
| 7 Navbar и Pagination | `<nav class="navbar md:navbar-expand bg-1">` → `container-fluid` → `navbar-brand`; ☰ `btn-icon navbar-toggler` с `data-bs-toggle="drawer"` и `data-bs-target="#id"`; панель `<dialog class="drawer drawer-end">` (`drawer-header`, `drawer-body`); ссылки `ul.nav navbar-nav` → `nav-item` → `nav-link` (+ `active`); тёмная строка — `data-bs-theme="dark"`; `md:navbar-expand` — от 768 px ссылки в ряд (по ширине самой строки); номера страниц `ul.pagination` → `li.page-item` → `a.page-link`, `active` — у `li`, по центру — `justify-content-center` у `ul` | `navbar-expand-lg`, `navbar-dark`, `bg-dark` (версия 5); `data-bs-target="menyu"` без `#`; `active` у `ul`; `page-link` у `li` |
| 8 Формы | одно слово `form-control` — у `input`, `textarea` **и `select`**; подпись `form-label`; галочка `check`, кружок `radio`, переключатель `<div class="switch"><input type="checkbox" role="switch" switch></div>`; подпись рядом — обёртка `form-field`; кнопка `btn-solid theme-*` | `form-select`, `form-check`, `form-check-input` (версия 5); `form-label` у поля; `form-control` у подписи |
| 9 Карусель | `carousel slide` → `carousel-inner` → `carousel-item` (+ `active` — начальный слайд); кнопки `btn-icon btn-sm` с `data-bs-slide="prev"` / `"next"` и `data-bs-target="#id"`; точки `carousel-indicators` с `data-bs-slide-to` (с **нуля**); `data-bs-autoplay="true"`, `data-bs-interval` (мс, по умолчанию 5000); `carousel-fade`; без строки `script` кнопки мёртвые | `data-bs-ride` (версия 5); `data-bs-target="galereya"` без `#`; `carousel-control-prev` (версия 5); `data-bs-slide-to="3"` у третьего слайда |
| 10 Menu и Dialog | меню: кнопка `data-bs-toggle="menu"` и соседний `<div class="menu">` с `<a class="menu-item">` (`menu-header`, `menu-divider`); окно: `<dialog class="dialog" id="…">` с `dialog-header` (`dialog-title`, `btn-close`), `dialog-body`, `dialog-footer`; кнопка `data-bs-toggle="dialog"` + `data-bs-target="#id"`; закрытие `data-bs-dismiss="dialog"`, фон, Esc; `data-bs-backdrop="static"` — фоном не закрыть; всё на той же странице, спрятано до нажатия | `dropdown`, `dropdown-item`, `modal`, `data-bs-toggle="modal"` (версия 5); нет `#`; `menu` у кнопки |
| 11 Финальный | всё сразу: сайт кружка (link → шапка `d-flex` → карусель → карточки в сетке → номера страниц `pagination` → форма → меню/окно → script); найти на сайте забытое, скопировать, настроить; «почему не работает» (нет link, `btn-primary`, нет script) | ошибки из всех уроков |

- Только материал этого урока **и прошлых уроков Bootstrap** (весь HTML и CSS ученик знает: можно сравнить «на CSS это было бы …»).
- Не повторять вопросы тестов модуля (`tools/webtest/bootstrap/lNN.jsx`, по 5 на урок) — тема та же, ситуация и код другие.
- Ситуации из жизни курса: сайт кружка роботов, турнир Robo-futbol, лагерь, кафе, библиотека, выставка — как в уроках и практиках.
- Классы сверять **с самим CSS** `tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css` (есть ли `.имя`), не по памяти о версии 5.
  `card-title`, `card-text`, `slide` — слова сайта без своих правил (их можно писать, они не ошибка).

## Словарь (узбекский, как в уроках модуля)

**sayt** (getbootstrap.com — «Bootstrap sayti»), **bo'lim** (раздел сайта), **namuna** (пример на сайте), **nusxalash** / **nusxalang**
(копировать), **qo'yish** (вставить), **moslash** (настроить под себя), **ulash** (подключить), **qator** (строка `link`, строка кода;
ряд — тоже qator), **tugma**, **rang so'zi** (слово цвета `theme-*`), **fon**, **e'lon** (Alert), **rasm**, **kartochka**, **to'r**
(сетка), **ustun** (колонка), **forma**, **maydon** (поле), **yozuv** (подпись label), **galochka** (check), **o'tkazgich** (switch, как в уроке 7),
**karusel**, **slayd**, **menyu**, **oyna** (dialog), **panjara** («#»), **eski nom** (имя версии 5), **oltinchi versiya**.
Классы и атрибуты — латиницей как в коде: `card-body` so'zi, `data-bs-target` atributi. Обращение — «Siz». Апостроф — только ASCII `'`.

## «Впиши ответ» в Bootstrap

Ответ — **одно слово кода**: класс (`img-fluid`, `form-control`, `card-body`, `md:col-4`), значение атрибута (`menu`, `dialog`, `next`),
число (`12`, `0`), селектор id (`#galereya`). Сравнение LMS мягкое (регистр, пробелы по краям, «;» в конце), но пробелы внутри
не убираются. `answer` — все честные записи: для двух слов кнопки — `['btn-solid theme-success']`; если просим одно слово —
просить именно одно («Bo'sh joyga bitta so'z yozing»). `mono: true`.

## «Собери» в Bootstrap

Собирается строка или тег на месте `___` в `code`: кусочки классов и атрибутов — `['<button', ' class="', 'btn-solid', ' theme-danger', '">']`
и т. п. Кусочки уникальны, порядок единственный (два класса, которые можно поменять местами, — одним кусочком или задать порядок
смыслом: «сначала стиль, потом цвет» — так нельзя, порядок классов в class не важен! — поэтому **классы одного class — одним кусочком**
или собирать вложенность: `<div class="card">` → `<div class="card-body">` → `<h4 …>`). Лишние кусочки — имена версии 5, чужие слова.

## «Найди ошибку» в Bootstrap

Ошибка — в одной строке: имя версии 5, класс с точкой, `md-col-4`, `data-bs-target` без `#`, строка `link` в `body`, `script` в `head`,
`form-select`, `justify-content-space-between`, `gap-16`. `page: true` — страница показывает сломанный результат (честно: класса нет — нет
оформления).

## «Нажми на странице» в Bootstrap

`data-t` — у 3–5 частей страницы (кнопки, карточки, e'lon, картинки, колонки); вопрос — что сделал класс: «Какая кнопка `btn-outline`?»,
«Какая картинка `rounded-circle`?», «Какая колонка `col-8`?». Цели не вложены друг в друга.
