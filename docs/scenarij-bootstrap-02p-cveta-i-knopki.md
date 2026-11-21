# Практика 2 модуля Bootstrap — «Ranglar qaytadi» («Цвета возвращаются»)

К уроку 2 «Цвета и кнопки» (`lessons/bootstrap/02-cveta-i-knopki.jsx`). Файл — `lessons/bootstrap/02p-cveta-i-knopki.jsx`,
данные — `tools/bsp/p02.jsx`, сборка — `node tools/bsp/build.mjs 02`, автопроверка — `tools/qa/lesson-team/scenarios/bootstrap-02p-cveta-i-knopki.qa.mjs`
(`node tools/bsp/mkqa.mjs 02`). Каркас — `tools/bsp` (`README.md`).

## Замысел

Сайт турнира Robo-futbol кружка роботов: синий заголовок, жёлтый фон у строки, зелёные кнопки. Коди обновил сайт кодом из
старого учебника (имена версии 5: `btn btn-success`, `btn btn-outline-success`, `text-primary`) — кнопки серые, цвет заголовка
пропал, а фон остался (слова `bg-*` не менялись). Ученик возвращает цвета пяти страниц, пятая — своя.

Умения урока, которые ученик пишет сам: кнопка — два слова (стиль `btn-solid` / `btn-outline` и цвет `theme-*`); цвет текста —
`fg-*`; фон — `bg-*`; кнопку берут с сайта (Button → Variants) и настраивают; имена версии 5 (`btn-success`, `text-danger`)
не работают. Опора — урок 1 (строка `link` в готовых строках head, сайт Bootstrap). Будущих тем нет.

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок «Robo-futbol» | «Yangilash» — имена версии 5: кнопки серые, заголовок без цвета, вкладки гаснут | касание |
| 2 | Ro'yxat (т1) | рамка в class второй кнопки: `btn-solid` → `btn-outline` («Batafsil» — только рамка) | у второй кнопки `btn-outline` и прежний `theme-primary`; доп.: «Bekor qilish» тоже с рамкой |
| 3 | Yangiliklar (т2) | пустой class абзаца: `bg-warning` (фон новости жёлтый) | `bg-warning`; `fg-*` и `theme-*` — своя причина; доп.: `bg-success` |
| 4 | O'yin (т3) | кнопка с сайта: копировать → «Qo'yish» → `theme-success` и своя надпись | залитая зелёная кнопка, надпись не «Primary»; доп.: красная с рамкой «Bekor qilish» |
| 5 | Sovrinlar (т4) | два старых имени: `text-danger` → `fg-danger`, `btn btn-success` → `btn-solid theme-success` | заголовок красный, кнопка зелёная залитая; доп.: `text-success` → `fg-success` |
| 6 | Mening sahifam (т5) | своя страница команды: `h1` с `fg-*`, `p` с `bg-*`, кнопки `btn-solid` и `btn-outline` с `theme-*` | 4 условия «готово» |
| 7 | Вывод | своя страница и код, 4 умения, следующий урок «Загрузка и изображения» | — |

## Разбор

Общий каркаса (`bpDiagnose`) + в 02p особенно: имя версии 5 (`btn-success`, `btn-outline-success`, `text-danger`), цвет своим
словом (`theme-green`, `fg-red` — «Bootstrap называет цвета своими словами»), опечатка в слове. Цели: `fg-*` на месте фона и
`theme-*` у абзаца — свои фразы («fg красит буквы, а не фон», «theme — для кнопок и объявлений»).
