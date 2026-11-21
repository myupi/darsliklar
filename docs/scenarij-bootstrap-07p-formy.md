# Практика 7 модуля Bootstrap — «Ro'yxat formasi» («Анкета записи»)

К уроку 7 «Формы» (`lessons/bootstrap/07-formy.jsx`). Файл — `lessons/bootstrap/07p-formy.jsx`, данные — `tools/bsp/p07.jsx`,
сборка — `node tools/bsp/build.mjs 07`, автопроверка — `tools/qa/lesson-team/scenarios/bootstrap-07p-formy.qa.mjs`
(`node tools/bsp/mkqa.mjs 07`). Каркас — `tools/bsp` (`README.md`).

## Замысел

Анкета записи в кружок роботов (как в уроке 7). При обновлении у полей пропали слова форм — «каша» браузера. Ученик чинит пять
страниц анкеты, пятая — своя анкета на соревнование. Окно страницы — 480 px. Кнопка отправки в рамке не отправляет (окно без
allow-forms).

Умения урока, которые ученик пишет сам: `form-control` — одно слово для input, textarea и select (загадка урока);
`form-label` у подписи; галочка `check`, кружок `radio`, переключатель `switch` в обёртке `form-field`; пример с сайта
(Forms → Switch / Checkbox) копируется, подпись настраивается; имена версии 5 `form-select`, `form-check`, `form-check-input`
не работают. Опора — урок 2 (кнопка `btn-solid theme-*`).

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок | «Yangilash» — пропали слова форм | касание |
| 2 | Ism (т1) | рамка у подписи: `form-control` → `form-label` (подпись выглядела полем) | у label `form-label`; доп.: подпись телефона |
| 3 | Izoh (т2) | пустой class у textarea: `form-control` | `form-label` — своя причина; доп.: `form-control` у select |
| 4 | Yangiliklar (т3) | Switch с сайта: копировать → «Qo'yish» → своя подпись | переключатель в `form-field`, подпись не «Default switch»; доп.: Checkbox «Qoidalarga roziman» |
| 5 | Guruh (т4) | `form-select` → `form-control`, `form-check` → `form-field`, `form-check-input` → `check` | список и галочка Bootstrap; доп.: radio |
| 6 | Mening formam (т5) | пустые class: `form-label`, `form-control`, кнопка `btn-solid theme-*`; галочка или переключатель с сайта | 4 условия «готово» |
| 7 | Вывод | своя анкета и код, 4 умения, следующий урок «Карусель» | — |
