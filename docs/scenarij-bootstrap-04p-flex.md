# Практика 4 модуля Bootstrap — «Hammasi qatorda» («Всё в ряд»)

К уроку 4 «Flex» (`lessons/bootstrap/04-flex.jsx`). Файл — `lessons/bootstrap/04p-flex.jsx`, данные — `tools/bsp/p04.jsx`,
сборка — `node tools/bsp/build.mjs 04`, автопроверка — `tools/qa/lesson-team/scenarios/bootstrap-04p-flex.qa.mjs`
(`node tools/bsp/mkqa.mjs 04`). Каркас — `tools/bsp` (`README.md`).

## Замысел

Сайт кружка роботов: шапка (логотип, название, кнопка) и ряд роботов — рисунки урока 4 (`logo.png`, `r1–r3.png`). При
обновлении у `div` пропали слова flex — всё встало столбиком. Страница — в окне своей ширины (540 / 600 px, своя страница —
телефон 360 px), как в уроке 4.

Умения урока, которые ученик пишет сам: `d-flex`; главная ось `justify-content-*` (`between`, не CSS-ное `space-between`);
поперечная ось `align-items-*`; промежуток `gap-*` (число — место в таблице 0–12, не пиксели); перенос `flex-wrap`; пример с
сайта (Utilities → Justify content) копируется и настраивается. Опора — уроки 1–3 (link, кнопка, картинки). Будущих тем нет.

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок | «Yangilash» — у div пропали слова flex, всё столбиком | касание |
| 2 | Shapka (т1) | рамка: `justify-content-start` → `justify-content-between` | шапка по краям; `around`/`evenly` — своя причина; доп.: меню `justify-content-end` |
| 3 | Robotlar (т2) | пустой class: `d-flex gap-5` | ряд и промежуток; без gap — «слиплись»; доп.: три коробки |
| 4 | Menyu (т3) | пример Justify content: копировать → «Qo'yish» → `justify-content-center` и свои пункты | меню по центру, три пункта не «Flex item»; доп.: имена `between` |
| 5 | Aloqa (т4) | две ошибки урока: `justify-content-space-between`, `gap-16` | шапка по краям, у роботов промежуток; доп.: `align-items-middle` → `center` |
| 6 | Mening sahifam (т5) | своя страница-телефон: шапка `d-flex between center`, роботы `d-flex gap flex-wrap` | 4 условия «готово» (третий робот не вылезает) |
| 7 | Вывод | своя страница и код, 4 умения, следующий урок «Карточки» | — |

## Разбор (каркас, добавлено для урока 4)

CSS в class (`display: flex;`) — «в class пишут слово, CSS уже внутри Bootstrap»; `justify-content-space-between` — «слово
Bootstrap короче: between»; `gap-16` — «число — место в таблице от нуля до двенадцати».
