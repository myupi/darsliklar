# Сценарий: модуль Bootstrap, урок 7 «Формы» (20.11.2026)

Файл урока: `lessons/bootstrap/07-formy.jsx`, сборка `node tools/bs7/build.mjs`. Облик «Редактор», канон —
`canon/bootstrap/canon-v1.jsx`. Основа кода — урок 6 (`tools/bs6/`): честная страница с настоящим `bootstrap.min.css`,
похожий сайт, курсор показов, задания с полем раундами, сборка по порядку.

Сверено с getbootstrap.com/docs/6.0 (Forms → Overview, Form control, Checkbox, Radio, Switch) и CSS (20.11.2026):
- `form-control` — на `<input>`, `<textarea>` **и `<select>`**: на странице Form control выноска «Heads up! `<select>`
  elements are now styled with `.form-control`»; класса `form-select` в CSS 6.0.0-alpha.1 нет (имя версии 5);
- `form-label` — подпись над полем (отступ снизу), `form-text` — серая подсказка под полем (назван, не задание);
- галочка — `<input type="checkbox" class="check">`, кружок — `class="radio"`, переключатель —
  `<div class="switch"><input type="checkbox" role="switch" switch></div>`; подпись рядом — обёртка `<div class="form-field">`;
  `form-check`, `form-check-input` — имена версии 5, в шестой правил нет (одной фразой);
- кнопка формы — `btn-solid theme-primary` (урок 2);
- меню сайта Forms: Overview, Field, Form control, Checkbox, Radio, Switch, Range, Input group, Floating labels, Form adorn,
  Chips, Combobox, Datepicker, OTP input, Password strength, Layout, Validation.

Тема плана «form-select, form-check» — имена версии 5; в уроке они звучат как старые имена, учим имена шестой.

## Что ученик уже знает

Уроки HTML 6–7 (`form`, `label for`, `input type`, `placeholder`, `select`, `option`, `textarea`, `button`), уроки
Bootstrap 1–6 (сайт, копирование и настройка примера, `btn-solid theme-*`, `alert theme-*`, d-flex, карточки, сетка).

## Учебные результаты

1. сделать текстовое поле, большое поле и список выбора красивыми одним словом `form-control`; подпись — `form-label`;
2. сделать галочку, кружок и переключатель (`check`, `radio`, `switch`) и поставить подпись рядом (`form-field`);
3. найти это на сайте: Forms → Form control, Checkbox, Switch; скопировать пример и поменять подпись и placeholder;
4. собрать форму записи по порядку и заполнить её на странице.

## Затруднения

- «Каждому виду поля — своё слово» — загадка; разгадка: одно `form-control` на input, select и textarea.
- `form-select`, `form-check` из старых уроков — в шестой версии не работают (g2, t2, t3, q1, t6).
- class не на том теге (на `label`, а не на `input`) — t6.
- опечатка `form-contol` — Bootstrap слова не знает (t6).

## Образ и сюжет

Кнопка «Yozilish» на сайте кружка ведёт на форму записи. Форма без Bootstrap — всё в одну кашу: подписи и поля в строку,
крошечная галочка, серая кнопка. Ученик делает её красивой и удобной, а в конце сам заполняет и отправляет — над формой
появляется e'lon «Rahmat!» из урока 1. Загадка (Коди ошибается, без имён): «у каждого вида поля своё слово, три слова
учить». Разгадка: одно `form-control` на всех трёх.

## Экраны (17)

| # | id | Тип | Что видит и делает ученик |
|---|---|---|---|
| 1 | s1 | крючок | Форма записи без классов — каша → «Bootstrap bilan» → аккуратная форма. Загадка |
| 2 | s2 | показ | `form-control` у поля «Ism»: поле на всю ширину, рамка, углы; `form-label` у подписи; «внутри Bootstrap» |
| 3 | x1 | опыт | Переключатели `form-label`, `form-control`, `check`, `btn-solid`: по одному — что меняет каждое |
| 4 | g1 | показ «как видео» | Forms → Form control → копирование примера → вставка → «Email address» → «Telefon», свой placeholder |
| 5 | t1 | сам | По образцу (3 раунда): `form-control` у поля, `form-label` у подписи, `form-control` у textarea |
| 6 | g2 | показ «как видео» | `form-select` из старого урока — ничего; сайт: раздел Select, выноска «Heads up!» → `form-control` |
| 7 | t2 | сам | По образцу (2 раунда): список «Guruh», поле даты «Tug'ilgan kun» — тоже `form-control` |
| 8 | s8 | показ | Галочка: `check` → `form-field` с подписью рядом; `radio` и `switch` — та же семья |
| 9 | g3 | показ «как видео» | Forms → Switch → копирование «With form field» → своя подпись «Yangiliklarni olish» |
| 10 | t3 | сам | По образцу (3 раунда): `check`, `radio`, `switch` |
| 11 | s11 | показ | Как работает форма: курсор пишет имя, выбирает группу, ставит галочку, жмёт «Yuborish» — e'lon «Rahmat!» |
| 12 | x2 | своё действие | Ученик сам заполняет форму на странице и отправляет; без имени или галочки — Коди говорит, чего не хватает |
| 13 | t4 | сборка | Код формы по порядку: form → подпись → поле → подпись → список → кнопка → закрыть |
| 14 | q1 | проверка | Картинка → class (4 раунда): поле, список, галочка, кнопка |
| 15 | t6 | почему не работает | `form-select` (версия 5); class на label; опечатка `form-contol` |
| 16 | w1 | своё | Свой вопрос в форме: текст подписи, вид поля (текст, дата, число), class поля; «Tayyor» |
| 17 | s18 | вывод | Разгадка: одно `form-control` — три вида полей; что умеем; следующий урок — карусель |

Словарь (draft): forma — форма; maydon — поле; yozuv — подпись (label); ro'yxat — список выбора (select); katta maydon —
большое поле (textarea); belgi katakchasi / galochka — галочка (checkbox); doiracha — кружок (radio); o'tkazgich —
переключатель (switch); yuborish — отправить.
