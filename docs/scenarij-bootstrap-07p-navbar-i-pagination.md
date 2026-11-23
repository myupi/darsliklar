# Практика 7 модуля Bootstrap — «Sayt menyusi» («Навигация сайта»)

К уроку 7 «Navbar и Pagination» (`lessons/bootstrap/07-navbar-i-pagination.jsx`). Файл — `lessons/bootstrap/07p-navbar-i-pagination.jsx`,
данные — `tools/bsp/p07.jsx`, сборка — `node tools/bsp/build.mjs 07`, автопроверка —
`tools/qa/lesson-team/scenarios/bootstrap-07p-navbar-i-pagination.qa.mjs` (`node tools/bsp/mkqa.mjs 07`). Каркас — `tools/bsp` (`README.md`).

## Замысел

Сайт новостей кружка: сверху тёмная строка меню (Navbar), внизу номера страниц (Pagination). После обновления у строки и у номеров
пропали слова Bootstrap: вместо строки меню и кнопок номеров — простые списки ссылок. Окно страницы шириной 800 px, как планшет
лёжа. Строка меню — во всю ширину окна: `md:navbar-expand` раскрывает ссылки по ширине самой строки (`@container`).

Умения урока, которые ученик пишет сам: `navbar-brand` — название сайта, `nav-link` — ссылки, `data-bs-theme="dark"` — тёмная строка,
`md:navbar-expand` (`navbar-expand-lg` — имя версии 5), `data-bs-target="#id"` у ☰ с решёткой, `pagination` → `page-item` → `page-link`,
`active` у `li`, `justify-content-center`; примеры Navbar и Pagination копируются с сайта и настраиваются. Опора — урок 4 (flex),
урок 1 (строки `link` и `script`).

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок | «Yangilash» — пропали слова строки меню и номеров | касание |
| 2 | Qora satr (т1) | рамка: `data-bs-theme="light"` → `dark` | строка тёмная; доп.: у названия `nav-link` → `navbar-brand` |
| 3 | Havolalar (т2) | пустой class третьей ссылки: `nav-link` | четыре ссылки `nav-link` (`nav-item` у `a` — своя причина); доп.: `pagination` в пустой class у `ul` |
| 4 | Saytdan (т3) | пример Navbar: копировать → «Qo'yish» → своё название и ссылки | строка меню с сайта, слова примера заменены (Navbar, Link, Disabled); доп.: пример Pagination |
| 5 | Tuzatish (т4) | `navbar-expand-lg` → `md:navbar-expand`, `data-bs-target="menyu"` → `"#menyu"` | ссылки в ряд на 800 px, ☰ находит панель; доп.: перепутанные `page-item` / `page-link` |
| 6 | Mening saytim (т5) | своя страница: `link` и `script` с сайта, Navbar с четырьмя ссылками и ☰, номера страниц по центру | условия «готово» |
| 7 | Вывод | своя страница и код, умения урока, следующий урок «Формы» | — |

## Что проверено

Автопроверка ru / uz / en на 1280×720: основной путь, ветки всех пяти заданий (русские буквы, пусто, три ступени, образец,
дополнительная задача), «Назад» хранит код и карту, `onFinished` один раз — passed. `tekshir.mjs` — ошибок 0. Вес — 373 КБ gzip.

Найдено при проверке: редактор практик держал 1600 знаков — длинная своя страница теряла строку `script` (`CP_MAX` стал 3200,
практики 01p–10p пересобраны); английские «Home», «Previous», «Next» совпадали со словами ученика и считались «текстом с сайта» —
образцами сайта остались только Navbar, Link, Disabled (`P7_SAMPLES`).
