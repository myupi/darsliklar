# Практика 9 модуля Bootstrap — «Musobaqa sahifasi» («Страница турнира»)

К уроку 9 «Menu и Dialog» (`lessons/bootstrap/09-menu-i-dialog.jsx`). Файл — `lessons/bootstrap/09p-menu-i-dialog.jsx`, данные —
`tools/bsp/p09.jsx`, сборка — `node tools/bsp/build.mjs 09`, автопроверка —
`tools/qa/lesson-team/scenarios/bootstrap-09p-menu-i-dialog.qa.mjs` (`node tools/bsp/mkqa.mjs 09`). Каркас — `tools/bsp` (`README.md`).

## Замысел

Страница турнира роботов: кнопка «Bo'limlar» открывает меню разделов, кнопка «Yozilish» — окно записи (как в уроке 9). При
обновлении у меню и окна пропали слова — разделы видны всегда простыми ссылками, окно без оформления. Ученик чинит пять страниц,
пятая — своя. Окно страницы — 480 px. Меню и окно работают как со скриптом Bootstrap — только при верной строке `script`
(каркас: `bpUiClick`): меню встаёт под кнопкой и закрывается пунктом или щелчком мимо, окно открывается `showModal()` и
закрывается крестиком, кнопкой `data-bs-dismiss="dialog"`, фоном и Esc; страница подрастает под открытое окно.

Умения урока, которые ученик пишет сам: `data-bs-toggle` (`menu` / `dialog`); `menu` и `menu-item`; окно с сайта (Components →
Dialog) копируется, заголовок и текст настраиваются; `data-bs-target="#id"`; имена версии 5 (`dropdown`, `dropdown-item`) не
работают; своя страница со строкой `script` с сайта (опора — урок 1).

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок | открывает меню и окно; «Yangilash» — пропали слова | касание |
| 2 | Menyu (т1) | рамка: у кнопки меню `data-bs-toggle="dialog"` → `menu` | кнопка ведёт к меню; доп.: у кнопки окна `menu` → `dialog` |
| 3 | Bo'limlar (т2) | пустой class у списка: `menu` | ссылки спрятаны, меню по нажатию; `menu-item` — своя причина; доп.: `menu-item` у второго пункта |
| 4 | Oyna (т3) | пример Dialog: копировать → «Qo'yish» → свой заголовок и текст | окно открывается, текстов сайта нет; доп.: пример Menu со своими разделами |
| 5 | Tuzatish (т4) | `data-bs-toggle="dropdown"` → `menu`, `data-bs-target="yozilish"` → `#yozilish` | меню и окно открываются; доп.: `dropdown-item` → `menu-item` |
| 6 | Mening sahifam (т5) | `data-bs-toggle="menu"`, `menu`, свой текст окна, `data-bs-target="#xabar"`, строка `script` с сайта | 4 условия «готово» |
| 7 | Вывод | своя страница и код, 4 умения, следующий урок «Финальный проект» | — |

## Разбор (каркас, добавлено для урока 9)

`data-bs-toggle` / `data-bs-dismiss` со значением `dropdown` или `modal` — «старое имя из прошлых версий»; другое неизвестное
значение — «data-bs-toggle говорит, что открыть: для меню — menu, для окна — dialog».
