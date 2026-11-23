# Сценарий: модуль Bootstrap, урок 8 «Карусель» (20.11.2026)

Файл урока: `lessons/bootstrap/09-karusel.jsx`, сборка `node tools/bs8/build.mjs`. Облик «Редактор», канон —
`canon/bootstrap/canon-v1.jsx`. Основа кода — урок 7 (`tools/bs7/`): честная страница с настоящим `bootstrap.min.css`,
похожий сайт, курсор показов, задания с полем раундами, сборка по порядку.

Сверено с getbootstrap.com/docs/6.0 (Components → Carousel, «New in v6») и CSS (20.11.2026):
- карусель Bootstrap 6 построена на прокрутке браузера (scroll-snap): листание пальцем работает без скрипта; кнопки,
  точки, автопрокрутку и синхронизацию `active` ведёт скрипт Bootstrap (строка `script` из урока 1);
- разметка: `<div id="…" class="carousel slide">` → `carousel-inner` → `carousel-item` (+ `active` — начальный слайд),
  картинка `<img class="d-block w-100">`;
- кнопки — `<button class="btn-icon btn-sm" data-bs-target="#id" data-bs-slide="prev|next">` со значком
  `carousel-icon-prev/next`; без обёртки карусель растягивает их на всю ширину (на сайте — `<div>`);
- точки — `<div class="carousel-indicators">` с кнопками `data-bs-slide-to="0…"` (счёт с нуля);
- автопрокрутка — `data-bs-autoplay="true"` у карусели, время — `data-bs-interval` у слайда (мс, по умолчанию 5000);
- смена растворением — `carousel-fade` вместо `slide`;
- имена версии 5 (`data-bs-ride`, `carousel-control-prev/next`, `carousel-caption`) — одной фразой, в шестой их нет.

## Что ученик уже знает

Уроки 1–7 (CDN и строка script, копирование и настройка примера, `d-flex`, `gap`, `align-items`, фото `img`), HTML: `id`,
атрибуты.

## Учебные результаты

1. собрать карусель: `carousel` → `carousel-inner` → `carousel-item`, начальный слайд `active`;
2. подключить кнопки и точки (`data-bs-slide`, `data-bs-target="#id"`, `carousel-indicators`) и понять, что их ведёт
   скрипт Bootstrap;
3. включить автопрокрутку и время в миллисекундах, сменить эффект на `carousel-fade`;
4. найти это на сайте: Components → Carousel (Bottom controls, Autoplay, Individual intervals, Crossfade).

## Затруднения

- «Для карусели нужно писать свой JavaScript» — загадка; разгадка: классы, `data-bs-*` и одна строка `script`.
- Нет строки `script` — кнопки молчат (s6, t6); `data-bs-target` без `#` (t2, t6).
- Время в секундах («3», «3s») вместо миллисекунд (t3, w1).
- `data-bs-ride` из старых уроков (q1, t6).

## Образ и сюжет

Три фото кружка стоят друг под другом — страница длинная. Ученик делает из них карусель: листается пальцем, кнопками,
точками и сама. Слайды — широкие баннеры 480×200 (`slayd1–3.jpg`): фото и кнопки помещаются в окне телефона.

## Экраны (17)

| # | id | Тип | Что видит и делает ученик |
|---|---|---|---|
| 1 | s1 | крючок | Три фото друг под другом → «Bootstrap bilan» → карусель с кнопками. Загадка |
| 2 | s2 | показ | `carousel-inner` — фото в ряд; `carousel-item` — по одному; курсор листает |
| 3 | x1 | опыт | Листать самому пальцем (мышью — перетаскиванием): увидеть все три фото |
| 4 | g1 | показ «как видео» | Components → Carousel → Bottom controls: копирование, вставка, «...» → свои фото, щелчок «›» |
| 5 | t1 | сам | По образцу (3 раунда): `carousel-inner`, `carousel-item`, `active` (начать со второго фото) |
| 6 | s6 | показ | Кнопка без `script` молчит → строка `script` → листает; `data-bs-slide`, `data-bs-target` |
| 7 | t2 | сам | 2 раунда: `next`, `#galereya` (без `#`, чужой id) |
| 8 | s8 | показ | Точки `carousel-indicators`, `data-bs-slide-to` с нуля; щелчок по третьей |
| 9 | g2 | показ «как видео» | Autoplay: строка с `data-bs-autoplay="true"` → своя карусель листается сама; Individual intervals |
| 10 | t3 | сам | 2 раунда: `true`; `3000` (не «3», не «3s») |
| 11 | s11 | показ | `slide` → `carousel-fade` |
| 12 | x2 | опыт | Эффект (slide / carousel-fade) и время (1000 / 3000) |
| 13 | t4 | сборка | Код по порядку: carousel → inner → три слайда → закрыть |
| 14 | q1 | проверка | Картинка → код (4): `carousel-item`, `carousel-fade`, `data-bs-autoplay="true"`, `carousel-indicators` |
| 15 | t6 | почему не работает | нет `script`; нет `#`; `data-bs-ride` (версия 5) |
| 16 | w1 | своё | Эффект и время слайда (1000–10000 мс), «Tayyor» |
| 17 | s18 | вывод | Разгадка: своего JavaScript нет; что умеем; следующий урок — Menu и Dialog |

Словарь (draft): karusel — карусель; slayd — слайд; nuqtalar — точки (indicators); panjara — решётка «#»;
millisekund — миллисекунда; xiralashib almashish — смена растворением.
