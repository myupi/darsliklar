# Практика 3 модуля Bootstrap — «Galereya» («Галерея»)

К уроку 3 «Загрузка и изображения» (`lessons/bootstrap/03-zagruzka-i-izobrazheniya.jsx`). Файл —
`lessons/bootstrap/03p-zagruzka-i-izobrazheniya.jsx`, данные — `tools/bsp/p03.jsx`, сборка — `node tools/bsp/build.mjs 03`,
автопроверка — `tools/qa/lesson-team/scenarios/bootstrap-03p-zagruzka-i-izobrazheniya.qa.mjs` (`node tools/bsp/mkqa.mjs 03`).
Каркас — `tools/bsp` (`README.md`).

## Замысел

Галерея кружка роботов на телефоне — страница рисуется в окне шириной 360 px (как в уроке 3), уменьшенная целиком; что шире
телефона, обрезано краем, черта красная. При обновлении у фото пропали классы: фото робота вылезает за край, тренер квадратный.
Картинки — те же рисунки, что в уроке 3 (`robot.jpg`, `murabbiy.jpg`, `jamoa.jpg`).

Умения урока, которые ученик пишет сам: `img-fluid` (Bootstrap 6 сам фото не сжимает), углы `rounded` / `rounded-circle` /
`rounded-pill`, спиннер с `role="status"` и цветом `fg-*`, заглушка `placeholder` с шириной `col-*` в `placeholder-wave`;
старые имена `img-responsive`, `img-circle` не работают. Опора — уроки 1–2 (строка `link`, `fg-*`). Будущих тем нет.

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок «Galereya» | «Yangilash» — у фото пропали классы | касание |
| 2 | Murabbiy (т1) | рамка в class: `rounded` → `rounded-circle` | фото тренера — круг; `rounded-pill` — своя причина; доп.: фото команды `rounded-pill` |
| 3 | Jamoa (т2) | пустой class: `img-fluid` | фото помещается в телефон; `img-thumbnail` — своя причина; доп.: фото робота |
| 4 | Yuklanish (т3) | спиннер с сайта: копировать → «Qo'yish» → `fg-success` | `spinner-*`, `role="status"`, зелёный; доп.: красный `spinner-grow` |
| 5 | Yangiliklar (т4) | `img-responsive` → `img-fluid`, `placeholder` без ширины → `col-6` | фото помещается, полоска видна; доп.: `img-circle` → `rounded-circle` |
| 6 | Mening sahifam (т5) | фото `img-fluid` с углами, спиннер с сайта, заглушка с сайта | 4 условия «готово» |
| 7 | Вывод | своя страница-телефон и код, 4 умения, следующий урок «Flex» | — |
