# Практика 8 модуля Bootstrap — «Robotlar ko'rgazmasi» («Выставка роботов»)

К уроку 8 «Карусель» (`lessons/bootstrap/08-karusel.jsx`). Файл — `lessons/bootstrap/08p-karusel.jsx`, данные — `tools/bsp/p08.jsx`,
сборка — `node tools/bsp/build.mjs 08`, автопроверка — `tools/qa/lesson-team/scenarios/bootstrap-08p-karusel.qa.mjs`
(`node tools/bsp/mkqa.mjs 08`). Каркас — `tools/bsp` (`README.md`).

## Замысел

Страница выставки роботов кружка: фото выставки в карусели — баннеры урока 8 (`slayd1–3.jpg`, 480×200). При обновлении у
карусели пропали слова — три фото встали столбиком, кнопки опустели. Ученик чинит пять страниц, пятая — свой альбом. Окно
страницы — 480 px. Карусель в окне работает как со скриптом Bootstrap — только при верной строке `script` (каркас: `bpCarousels`):
слайд `active`, кнопки и точки по `data-bs-target="#id"`, `data-bs-autoplay`.

Умения урока, которые ученик пишет сам: `data-bs-slide` (`next` / `prev`) и `data-bs-slide-to` (с нуля); обёртка слайдов
`carousel-inner` и слайд `carousel-item`; пример с сайта (Components → Carousel → Bottom controls, Crossfade) копируется,
`src="..."` → свои файлы; `data-bs-autoplay="true"` вместо имени версии 5 `data-bs-ride`; `data-bs-target` с решёткой; имена
версии 5 `carousel-control-prev` / `-next` → `btn-icon btn-sm`; своя карусель: `carousel slide`, `carousel-inner`, один
`active`, `data-bs-target="#albom"`, строка `script` с сайта в конце body (опора — урок 1). Слово `slide` из примеров сайта
своих правил в CSS 6.0 не имеет — разбор его знает (`BP_DOC_WORDS`).

## Семь слайдов

| № | Слайд | Что делает ученик | Готово, когда |
|---|---|---|---|
| 1 | Крючок | листает карусель кнопками и точками; «Yangilash» — пропали слова карусели | касание |
| 2 | Tugmalar (т1) | рамка: у правой кнопки `data-bs-slide="prev"` → `next` (листала назад) | правая кнопка вперёд; доп.: третья точка `data-bs-slide-to="3"` → `2` (с нуля) |
| 3 | Slaydlar (т2) | пустой class обёртки слайдов: `carousel-inner` | фото в ряд, видно одно; `carousel-item` / `carousel` — своя причина; доп.: пустой class второго слайда → `carousel-item` |
| 4 | Ko'rgazma (т3) | пример Bottom controls: копировать → «Qo'yish» → `src="..."` → `slayd1–3.jpg` | три фото на месте; «...» и неполное имя — своя причина; доп.: пример Crossfade |
| 5 | Avtomat (т4) | `data-bs-ride="carousel"` → `data-bs-autoplay="true"`, `data-bs-target="korgazma"` → `#korgazma` | листается сама, кнопки работают; доп.: `carousel-control-prev/next` → `btn-icon btn-sm` |
| 6 | Mening albomim (т5) | пустые class: `carousel slide`, `carousel-inner`; `active` на любом фото; `data-bs-target="#albom"`; строка `script` с сайта | 4 условия «готово» |
| 7 | Вывод | свой альбом и код, 4 умения, следующий урок «Menu и Dialog» | — |

## Разбор (каркас, добавлено для урока 8)

`data-bs-ride` — «старое имя из прошлых версий»; `data-bs-target` без «#» — «когда указываешь на id, впереди ставится решётка»;
с точкой — «точка для class, на id указывают решёткой»; `data-bs-slide` не `next` / `prev` — «знает только два слова»; русские
буквы — и в значениях class, id, `data-bs-*`.
