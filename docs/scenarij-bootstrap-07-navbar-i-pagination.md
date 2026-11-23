# Урок 7 модуля Bootstrap — «Navbar и Pagination» («Navbar va Pagination»)

Новый урок (заказчик, 23.11.2026: «что если добавим один урок по navbar и pagination», «давай после сетки поставим»). Прежние
уроки 7–10 стали 8–11. Файл — `lessons/bootstrap/07-navbar-i-pagination.jsx`, исходник — `tools/bsnav/` (копия набора урока
«Menu и Dialog» + ящик `drawer`), сборка — `node tools/bsnav/build.mjs`. 17 экранов.

## Замысел

Сайт кружка роботов на телефоне: ссылки разделов стоят столбиком, номера страниц новостей — тоже списком. Ученик ставит
**Navbar** Bootstrap 6 и **Pagination**, берёт оба с сайта (Components) и настраивает под себя.

Navbar 6.0 (сверено с getbootstrap.com/docs/6.0/components/navbar): `<nav class="navbar md:navbar-expand bg-1">`,
`container-fluid`, `navbar-brand`, кнопка `btn-icon navbar-toggler` с `data-bs-toggle="drawer"` и `data-bs-target="#id"`,
ящик `<dialog class="drawer drawer-end">` с `drawer-header` и `drawer-body`, список `nav navbar-nav`, `nav-item`, `nav-link`,
`active`; тёмный — `data-bs-theme="dark"`, цветной — `bg-primary`. От 768 px (`md`, как `md:col-4` урока 6) ссылки в ряд, уже —
кнопка ☰ и ящик, который открывает строка `script` урока 1. Версия 5: `navbar-expand-lg`, `navbar-dark`, `bg-dark` — одной фразой.

Pagination (сверено с …/components/pagination): `ul.pagination`, `li.page-item`, `a.page-link`, `active` — у `li`,
по центру — `justify-content-center` у `ul` (слово урока 4).

**Загадка** (без имён): Коди думает, что для телефона и ноутбука нужны два разных меню. **Разгадка**: меню одно —
`md:navbar-expand` меняет его по ширине экрана.

## Умения

1. Взять Navbar с сайта (Components → Navbar → Example), убрать лишнее (пункт Menu, форму поиска), поставить своё название и ссылки.
2. Назвать части: `navbar`, `navbar-brand`, `nav-link`, `md:navbar-expand`; ☰ и ящик работают со строкой `script`.
3. Окрасить: `data-bs-theme="dark"`, `bg-primary`; отметить текущую страницу `active`.
4. Pagination с сайта: `pagination`, `page-item`, `page-link`, `active`, `justify-content-center`.
5. Найти причину поломки: нет `script`, имя версии 5 (`navbar-expand-lg`), `data-bs-target` без «#».

## Экраны

| № | id | Тип | Что происходит |
|---|---|---|---|
| 1 | s1 | крючок | телефон: всё столбиком → «Bootstrap bilan» — тёмный Navbar с ☰, номера страниц в ряд; загадка |
| 2 | s2 | показ | планшет 768: список → `navbar` + `container-fluid` → `navbar-brand` → `nav-link` и `md:navbar-expand` (ряд) |
| 3 | x1 | опыт | один Navbar на телефоне, планшете и ноутбуке (три кнопки ширины) |
| 4 | s4 | показ | телефон: ☰ без `script` молчит → со `script` ящик выезжает → крестик `data-bs-dismiss="drawer"` |
| 5 | g1 | показ «как на видео» | Components → Navbar → Example → копировать → вставить → удалить Menu и поиск → свои слова → ☰ на телефоне |
| 6 | t1 | впиши (3) | `navbar-brand`; `nav-link` у третьей ссылки; `md:navbar-expand` (на планшете ряд) |
| 7 | s7 | показ | `data-bs-theme="dark"` → `bg-primary` → `active` у «Asosiy» |
| 8 | t2 | впиши (3) | `dark`; `active` у «Kurslar»; `#menyu` в `data-bs-target` (телефон, ☰ работает) |
| 9 | t3 | собери по порядку | nav → container-fluid → название → ☰ → ящик со ссылками → `</div>` → `</nav>` |
| 10 | s10 | показ | номера списком → `pagination`/`page-item`/`page-link` → `active` → `justify-content-center` |
| 11 | g2 | показ «как на видео» | Components → Pagination → Overview → копировать → вставить → «Oldingi / Keyingi» → Alignment: слово `justify-content-center` |
| 12 | x3 | опыт | нажать номера 2 и 3: новости меняются, `active` переходит |
| 13 | t4 | впиши (4) | `pagination`; `page-link` у 2; `active` у `page-item` 2; `justify-content-center` |
| 14 | q1 | картинка → class (4) | `nav-link`, `navbar-brand`, `page-link`, `active` (неверные — свои причины) |
| 15 | t6 | почему не работает (3) | нет `script`; `navbar-expand-lg`; `data-bs-target` без «#» |
| 16 | w1 | своё | своя ссылка в Navbar: название и `nav-link`, «Tayyor»; ширину можно переключить |
| 17 | s17 | вывод | разгадка; сайт ученика (телефон и планшет), роли, следующий урок — «Формы» |

Помощь 1-2-3 — на показах (s2, s4, g1, s7, s10, g2). Подсказки в три ступени — во всех заданиях.

## Ошибки и причины (`wordIssue`)

Точка, русские буквы, пробел, своё слово, без приставки (`brand`, `link`), опечатка, имя версии 5 (`navbar-dark`, `bg-dark`),
`navbar-expand-lg` / `navbar-expand` без `md:` — «размер впереди, через двоеточие, как `md:col-4`», `light` вместо `dark`,
`menyu` без «#», чужое слово в `data-bs-toggle`.
