# Сценарий: модуль Bootstrap, урок 4 «Flex» (20.11.2026)

Файл урока: `lessons/bootstrap/04-flex.jsx`, сборка `node tools/bs4/build.mjs`. Облик «Редактор», канон —
`canon/bootstrap/canon-v1.jsx`. Основа кода — урок 3 (`tools/bs3/`): честная страница с настоящим `bootstrap.min.css`
6.0.0-alpha.1, экран телефона 360 px, картинки `FILES`, похожий сайт Bootstrap, курсор показов, задания с полем раундами.

Классы сверены с getbootstrap.com/docs/6.0 (Utilities → Flex & Grid: Align items, Flex, Gap, Justify content) и CSS:
- `d-flex` — `display: flex`; `flex-column`, `flex-wrap`;
- `justify-content-start | end | center | between | around | evenly` — главная ось;
- `align-items-start | end | center | baseline | stretch` — поперечная ось (по умолчанию stretch);
- `gap-0` … `gap-12`: в версии 6 шкала своя — `gap-3` = 0.5rem (8 px), `gap-5` = 1rem (16 px), `gap-9` = 2rem (32 px).

## Что ученик уже знает

Уроки CSS 10–11: `display: flex`, главная и поперечная оси, `justify-content`, `align-items`, `gap`, `flex-wrap`.
Уроки Bootstrap 1–3: сайт, слово с сайта в class, кнопки `btn-solid theme-*`, `img-fluid`, экран телефона 360 px.

## Учебные результаты

После урока ученик сможет:
1. выстроить блоки в ряд классом `d-flex` и объяснить, что это тот же `display: flex` из CSS;
2. расставить блоки по главной оси (`justify-content-*`) и по поперечной (`align-items-*`);
3. задать расстояние между блоками `gap-*`, выбрав число по таблице на сайте;
4. найти всё это на сайте: Utilities → Flex, Justify content, Align items, Gap.

## Затруднения и где они разобраны

- «Bootstrap flex — что-то новое, CSS не пригодится» — загадка в крючке, разгадка в выводе (таблица «CSS ↔ класс»).
- `justify-content-*` без `d-flex` не работает — показ s2, t6.
- Пишут значение CSS (`justify-content-space-between`) — t1, t6.
- Путают оси (justify / align) — показ s6, сборка t4.
- Число в `gap-N` — не пиксели (`gap-16`) — показ s9, t3, t6.

## Образ и сюжет

Шапка сайта «Robot to'garagi»: логотип, название и кнопка «Yozilish» стоят друг под другом — некрасиво. Ученик с Коди
выстраивает шапку в ряд, расставляет по краям и по центру, раздвигает карточки роботов. Загадка (Коди ошибается, без имён):
«в Bootstrap flex свой, всё, что учили в CSS, можно забыть». Разгадка: это тот же CSS — `d-flex` внутри просто
`display: flex`, Bootstrap дал ему короткое имя.

## Экраны (17)

| # | id | Тип | Что видит и делает ученик | Успех |
|---|---|---|---|---|
| 1 | s1 | крючок | Шапка — логотип, название, кнопка друг под другом. «Bootstrap bilan» → три слова class, шапка в ряд. Загадка | нажал |
| 2 | s2 | показ | `d-flex` = `display: flex` (карточка «внутри Bootstrap»); без `d-flex` остальные слова не работают | показ |
| 3 | x1 | опыт | Пульт главной оси: start, center, end, between, around, evenly — шапка меняется; карточка CSS-значения | 4 разных |
| 4 | g1 | показ «как видео» | Меню → Utilities → Justify content: шесть рядов примера, двойной щелчок по `justify-content-between` → в class | показ |
| 5 | t1 | сам | Шапка по образцу (3 раунда): center, end, between | 3 раунда |
| 6 | s6 | показ | Поперечная ось: start → end → center (логотип высокий, кнопка низкая) | показ |
| 7 | g2 | показ «как видео» | Align items: `align-items-center` → в class | показ |
| 8 | t2 | сам | По образцу (2 раунда): end, center | 2 раунда |
| 9 | s9 | показ | Карточки роботов: `d-flex` — вплотную → `gap-3` → `gap-5` → `gap-9`; число — размер по таблице | показ |
| 10 | g3 | показ «как видео» | Gap: таблица размеров, слово `gap-4` → в class; 12 px | показ |
| 11 | t3 | сам | Расстояние по образцу (2 раунда): 16 px → `gap-5`, 32 px → `gap-9` | 2 раунда |
| 12 | s12 | показ | Телефон 360 px: три карточки не помещаются → `flex-wrap` — переносятся | показ |
| 13 | t4 | сборка | Шапка из кусочков class (d-flex, flex-column, justify…, align…) по образцу | верно |
| 14 | q1 | проверка | Картинка → код (4 раунда) | 4 раунда |
| 15 | t6 | почему не работает | нет `d-flex`; значение CSS вместо класса; `gap-16` — такого размера нет | 3 раунда |
| 16 | w1 | своё | Своя шапка: главная ось и расстояние словами с сайта, «Tayyor» | «Tayyor» |
| 17 | s18 | вывод | Разгадка: таблица «CSS ↔ Bootstrap»; своя шапка; следующий урок — карточки | — |

Словарь (draft): qator — ряд; ustun — колонка (flex-column); bosh o'q / ko'ndalang o'q — главная / поперечная ось (как в CSS 10);
oraliq — расстояние (gap); chetlarga — по краям (between).
