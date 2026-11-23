# Сценарий: модуль Bootstrap, урок 9 «Menu и Dialog» (20.11.2026)

Файл урока: `lessons/bootstrap/10-menu-i-dialog.jsx`, сборка `node tools/bs9/build.mjs`. Облик «Редактор», канон —
`canon/bootstrap/canon-v1.jsx`. Основа кода — урок 8 (`tools/bs8/`).

Сверено с getbootstrap.com/docs/6.0 (Components → Menu, Dialog — новые в v6) и CSS (20.11.2026):
- меню — `<button data-bs-toggle="menu">` и соседний `<div class="menu">` с `<a class="menu-item">`; `menu-header` (h6),
  `menu-divider` (hr); `.menu` скрыт (`display: none`), открытое — `.menu.show`; на сайте статичные примеры —
  `menu show position-static`; открывает и закрывает скрипт Bootstrap (щелчок по пункту или мимо — закрывает);
- окно — родной `<dialog class="dialog" id="…">` с `dialog-header` (`dialog-title`, `btn-close`), `dialog-body`,
  `dialog-footer`; кнопка `data-bs-toggle="dialog"` + `data-bs-target="#id"`; закрывают `data-bs-dismiss="dialog"`, щелчок по
  фону и Esc; `data-bs-backdrop="static"` — фон не закрывает; размеры `dialog-sm / -lg / -xl`;
- версия 5: Dropdown (`dropdown-menu`, `dropdown-item`) и Modal (`data-bs-toggle="modal"`, `modal-header`) — одной фразой.

## Что ученик уже знает

Уроки 1–8 (CDN и строка script, копирование и настройка примера, кнопки `btn-solid` / `btn-outline`, `data-bs-*` с `#id`
из урока 8), HTML: `id`, `h1`, `h6`, `hr`, ссылки.

## Учебные результаты

1. сделать меню: кнопка `data-bs-toggle="menu"`, `menu`, `menu-item`, `menu-header`, `menu-divider`;
2. сделать окно: `<dialog class="dialog">` из трёх частей, открыть кнопкой с `data-bs-target="#id"`, закрыть
   `data-bs-dismiss="dialog"`, фоном; `data-bs-backdrop="static"`;
3. найти это на сайте: Components → Menu, Dialog; скопировать пример и сменить надписи.

## Затруднения

- «Для окна нужна отдельная страница» — загадка; разгадка: меню и окно на той же странице, спрятаны до нажатия.
- `dropdown-*`, `modal` из старых уроков (t1, t3, q1, t6); `#` в `data-bs-target` (t3, t6); нет строки script (t6).

## Экраны (17)

| # | id | Тип | Что видит и делает ученик |
|---|---|---|---|
| 1 | s1 | крючок | Разделы и правила открыты кучей → «Bootstrap bilan» → две кнопки: меню и окно. Загадка |
| 2 | s2 | показ | `menu` и `menu-item` — список спрятался; `data-bs-toggle="menu"` + script — кнопка открывает; пункт — закрывает |
| 3 | x1 | опыт | Открыть меню и выбрать два разных раздела |
| 4 | g1 | показ «как видео» | Components → Menu → Overview: копирование, свои надписи, меню открывается |
| 5 | t1 | сам | 3 раунда: `menu`, `menu-item`, `data-bs-toggle` = `menu` |
| 6 | s6 | показ | `menu-header`, `menu-divider` (меню открыто на месте) |
| 7 | t2 | сам | 2 раунда по образцу: `menu-divider`, `menu-header` |
| 8 | s8 | показ | `<dialog>` спрятан; кнопка без toggle молчит; с toggle и `#qoidalar` — окно; крестик закрывает |
| 9 | g2 | показ «как видео» | Components → Dialog → Example: копирование, свой заголовок, окно открывается |
| 10 | t3 | сам | 3 раунда: `#qoidalar`, `dialog` в `data-bs-dismiss`, `dialog-body` |
| 11 | s11 | показ | Щелчок по фону закрывает; `data-bs-backdrop="static"` — нет, только кнопка |
| 12 | x2 | опыт | Открыть окно и закрыть тремя способами: крестик, кнопка, фон |
| 13 | t4 | сборка | Кнопка → dialog → header → body → footer → закрыть |
| 14 | q1 | проверка | Картинка → class (4): `menu-item`, `menu-divider`, `dialog-header`, `dialog-footer` |
| 15 | t6 | почему не работает | нет script; `modal` (версия 5); `data-bs-target` без `#` |
| 16 | w1 | своё | Свой раздел меню: название и class, «Tayyor», открыть меню |
| 17 | s18 | вывод | Разгадка: всё на одной странице; следующий урок — финальный проект |

Словарь (draft): menyu — меню; band — пункт меню; oyna — окно (dialog); fon — фон (backdrop); panjara — «#».
