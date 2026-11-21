# Каркас практик модуля Bootstrap (bsp, 21.11.2026)

Заказчик, 21.11.2026: «сегодня должны создать практики для бутстрапа… вот эти jsx». Устройство — как у практик CSS
(`tools/cssp`, см. его README): 7 слайдов (крючок · 5 заданий · вывод), карта-вкладки, помощь 1-2-3, образец, дополнительная
задача, рамка в строке в заданиях 1–2, «✎ Kodni shu yerga yozing». Отличия — ученик пишет **HTML с классами Bootstrap**,
а главное умение модуля — **найти на сайте, скопировать, настроить**.

| Файл | Что | Трогать |
|---|---|---|
| `bp-base.jsx` | `L3`, `fillL`, строки CDN (`BP_LINK`, `BP_SCRIPT` — как на getbootstrap.com 6.0), `UI`, `FB` (причины для HTML и Bootstrap), `CP_DRILL` | нет |
| `bp-kit.jsx` | честная страница `BpPage` (рамка без скриптов; CSS Bootstrap включается только при верной строке `link`), разбор `bpDiagnose`, `BpDoc`, подсветка HTML, пример с сайта `BpDocs` и вставка `bpPaste`, ход задания, крючок, вывод | нет |
| `bp.css` | облик поверх `../cssp/cp.css` | нет |
| `build.mjs` | `node tools/bsp/build.mjs NN` → `lessons/bootstrap/NNp-<slug>.jsx` (кладёт `BS_CSS` в `gen/bs-css.jsx`) | нет |
| `mkqa.mjs` | `node tools/bsp/mkqa.mjs NN` → `tools/qa/lesson-team/scenarios/bootstrap-NNp-<slug>.qa.mjs` | нет |
| `pNN.jsx` | данные практики: `META`, `PR`, `C` | да |

Образец — `p01.jsx` («E'lonlar qaytadi»).

## Задание `bpTask(n, o)`

| Поле | Что |
|---|---|
| `pre`, `post` | готовые строки документа над и под кодом ученика (`<head>`, строка `link`, `<body>`, `<h1>` …): видны тусклыми, адрес CDN и `integrity` свёрнуты |
| `code0`, `answer` | начальный код и верный ответ; в заданиях 1–2 отличие — одно место в строке (рамка: слово в class, текст или значение) |
| `docs: () => ({ page, items })` | пример с сайта под окном браузера: `items` — `{ k, title, code }` (значок копирования) или `{ k, title, chips }` (слова раздела, например Variants) |
| `big: true` | своя страница (задание 5) |
| `goal: (D) => null \| L3` | цель по странице: `D.bs` (Bootstrap подключён), `D.link` / `D.script` (`tag`, `ok`, `why`, `inHead`, `atEnd`), `D.q`, `D.qa`, `D.cs`, `D.text`, `D.theme(el)` (слово цвета без `theme-`), `D.has(el, cls)` |
| `vw` | окно своей ширины (телефон 360 px, урок 3): страница рисуется в этой ширине и уменьшается целиком, что шире — обрезано, черта у края красная; цель — `D.fits(el)`. У крючка — `PR.hook.vw`, у вывода — `PR.ownVw` |
| `sample`, `drill`, `list`, `onSolved` | как в cssp; `drill` наследует `pre`, `post`, `docs` задания; `onSolved` задания 5 кладёт документ в `myDoc` (вывод и артефакт) |

`PR`: `next`, `tabs` (5), `hook.doc(pick, on)` — документ крючка (`on` — со строкой `link`), `ownDefault(pick)` — своя страница по умолчанию, `tasks`, `files` (картинки, если нужны), `ownClasses` (свои слова class, если страница их использует).

## Что видит и что делает ученик

- **Страница честная:** нет строки `link`, другая буква в адресе, чужой `integrity`, нет `rel` — страница голая; слово версии 5 — у e'lon нет цвета. Внешние адреса рамка не грузит.
- **Слова сайта без своих правил** в CSS 6.0.0-alpha.1 (`card-title`, `card-text`, `slide` …) — в `BP_DOC_WORDS`, разбор их не считает неизвестными; новые такие слова — туда же.
- **Разбор** называет одну причину и где она (строка подсвечивается): русские буквы в теге (и в значениях class, id, `data-bs-*`), кавычки, недописанный тег, незакрытый парный тег, строка `link` / `script`, точка в class, имя версии 5, опечатка («Balki alert demoqchisiz?» — по словам самого CSS Bootstrap, переставленные буквы — одна опечатка), неизвестное слово; затем атрибуты `data-bs-*` (08p): `data-bs-ride` — имя версии 5, `data-bs-target` без «#» или с точкой, `data-bs-slide` не `next` / `prev`.
- **Скрипт Bootstrap** (08p) — только при верной строке `script` в документе: карусель встаёт на слайд `active`, кнопки `data-bs-slide` и точки `data-bs-slide-to` листают её по `data-bs-target="#id"` (без «#» или с чужим id — мёртвые), `data-bs-autoplay="true"` листает сама (время — `data-bs-interval` слайда, иначе 5000 мс), `carousel-fade` — смена прозрачностью (`bpCarousels`, `bpSlide`, `bpCarouselClick` в `bp-kit.jsx`; программная прокрутка — без прилипания, как в уроке 8).
- **Копировать и вставить:** значок копирования на карточке сайта → «Nusxalandi», в ряду кнопок появляется «Qo'yish». Вставка — в курсор, который поставил ученик; пока он сам не ставил курсор — в первую пустую строку заготовки, а если их нет — сразу после прошлой вставки (так `link` встаёт в head, e'lon — в body, `script` — за ним).

## Телефон и планшет

- Задания с примером с сайта (`docs`) и своя страница (`big`) — сразу с переключателем «Kod / Natija» на телефоне: в «Kod» — пример с сайта и редактор, в «Natija» — страница и условия «готово». Остальные — как в cssp (переключатель от 7 строк).
- Пример с сайта листается сам (не выше своей доли экрана), окно браузера рядом с ним ниже; на планшете стоя у своей страницы — ещё ниже.

## Проверка

```bash
node tools/bsp/build.mjs NN
node .claude/skills/uzbekcha/scripts/tekshir.mjs tools/bsp/pNN.jsx
node tools/bsp/mkqa.mjs NN
node tools/qa/lesson-team/run.mjs --scenario tools/qa/lesson-team/scenarios/bootstrap-NNp-<slug>.qa.mjs --checks load,scenario --langs ru,uz,en --sizes 1280x720 --voice fast --serve
node tools/bootstrap/sweep.mjs --lessons NNp-<slug> --screens 0-6 --sizes 360x640,390x844,768x1024,1280x720,1440x900 --langs uz,ru,en
```
Вес — до 400 КБ gzip (esbuild, cjs, chrome70, minify): 01p — 379 КБ (весь CSS Bootstrap внутри).
