# Курс CSS · Урок 11 · «Flexbox: выравнивание» (облик «Редактор»)

Файл: `lessons/css/11-flexbox-vyravnivanie.jsx` · сборка `node tools/css11/build.mjs` · исходник `tools/css11/` (`c11.src.jsx` — тексты, `c11-screens.jsx` — экраны и CSS-движок урока, `c11.css` — облик) · автопроверка `tools/qa/lesson-team/scenarios/css-11-flexbox-vyravnivanie.qa.mjs`.

Сделан 06.11.2026 по просьбе заказчика: «создай следующий урок css». Минимум 17 экранов.
- Облик — эталон «Редактор» курса HTML, канон — `canon/css/canon-v1.jsx`.
- Основа кода — урок 10 курса CSS (`tools/css10/`): стрелки осей у полки остаются. По ним видно, вдоль чего выравнивает каждое свойство: `justify-content` — вдоль оранжевой (главной), `align-items` — вдоль фиолетовой (поперечной).
- Новое:
  - страница `many` — шесть карточек для `gap` и `flex-wrap`;
  - мини-полки для задания «найди пару» (`MiniShelf`).
- Тексты — по `/uzbekcha`: апостроф ASCII, «ya'ni … degani», загадка без имён.

## Паспорт

- **Ученик:** 11–14 лет, проходит сам, чаще с телефона. Уже знает `display: flex`, `flex-direction`, главную и поперечную оси (урок 10).
- **После урока ученик сможет:**
  1. выровнять по главной оси: `justify-content` — `flex-start`, `center`, `flex-end`, `space-between`;
  2. выровнять по поперечной оси: `align-items` — `stretch` (как есть), `flex-start`, `center`, `flex-end`;
  3. поставить промежутки (`gap`) и перенести то, что не поместилось (`flex-wrap: wrap`);
  4. выбрать нужное свойство по задаче и найти поломку: `centre`, `middle`, `gap` без `px`.
- **Не забегаем:** `space-around` и `space-evenly`, `align-content`, `align-self`, `flex-grow`, `order`, `position` (урок 12).
- **Новые слова (черновые):** `tekislash` (выравнивание), `o'rta` (середина), `boshi` и `oxiri` (начало и конец), `oraliq` (промежуток), `yangi qator` (новая строка).

## Дуга (17 экранов; плана нет)

| # | Экран | Роль | Тип (раздел 3а) | Что делает ученик |
|---|---|---|---|---|
| 1 | s1 | крючок | — («Превратить») | карточки прижаты к левому краю и слиплись → `justify-content: center`, `align-items: center`, `gap: 12px`; загадка: чтобы поставить карточки по центру сверху вниз, Коди пишет `justify-content: center` |
| 2 | s2 | объяснение | показ | `justify-content`: `center` → `flex-end` → `space-between` |
| 3 | s3 | сам | **Fill in the Blanks** | `.javon { justify-content: ▢; }` → `center` (`centre` и `middle` — не слова CSS) |
| 4 | s4 | закрепление | **Matching Pairs** | `flex-start`, `center`, `space-between` ↔ мини-полки |
| 5 | s5 | объяснение | показ | `align-items`: `stretch` (как есть) → `flex-start` → `center` → `flex-end` |
| 6 | s6 | сам | **Fill in the Blanks** | `.javon { align-items: ▢; }` → `flex-end` (`bottom` и `end` — подсказки по причине) |
| 7 | s7 | закрепление | выбор (по одному) | полка со стрелками — какой код: `justify-content: center`, `align-items: center`, `align-items: flex-start` |
| 8 | s8 | объяснение | показ | шесть карточек: `gap: 12px` → `width: 90px` (сжались) → `flex-wrap: wrap` (новая строка, снова полной ширины) |
| 9 | s9 | сам | **Fill in the Blanks** | `.javon { gap: ▢; }` → `20px` |
| 10 | s10 | закрепление | **Sort** (по одному) | задача словами → `justify-content`, `align-items`, `gap` или `flex-wrap` |
| 11 | s11 | объяснение | показ | `centre` (британское написание), `middle` (нет такого), ловушка: в `column` `justify-content: center` центрует сверху вниз |
| 12 | s12 | сам | **Debug & Fix** | в поле «middle» — `center` |
| 13 | s13 | закрепление | **Error Detective** | правило, которое не работает: `centre`, потом `gap: 20` без `px` |
| 14 | w1 | сам | **Code Writing** (перенос) | правило из двух свойств: `nav { display: flex; justify-content: space-between; }` |
| 15 | s14 | сам | **Live Code Preview** | своя полка: `justify-content`, `align-items`, `gap` — любые настоящие, «Готово» |
| 16 | q1 | итог | **True / False** | «justify — главная ось» (да), «`align-items: center` в ряду центрует слева направо» (нет), «gap — промежутки» (да), «wrap уменьшает карточки» (нет) |
| 17 | s15 | вывод | — | разгадка: `justify-content: center` в ряду — слева направо, сверху вниз — `align-items: center`; своя полка; роли; дальше — «Позиционирование» |

Подсказки:
- в заданиях с набором — три ступени по лампочке, со второй ошибки подсказка открывается сама;
- в заданиях на выбор (s7, s10, s13, q1) — общий помощник `useChoiceHints`;
- в s4 — ступени, как в уроке 2.

## Особые правила урока

- **Честный браузер.**
  - Верная ли запись — решает сам Chrome (`CSS.supports`): `centre`, `middle` и `gap: 20` не принимаются.
  - Сжатие карточек и перенос на новую строку — поведение самого браузера, «Инспектор» показывает их настоящую ширину: `90px` и `padding` — 102.
- **Основа страницы** — тусклые строки `.javon { display: flex; height: 110px; }` и `.karta { background-color: lavender; padding: 6px; }`.
- **На крючке и в заданиях** пунктир «Инспектора» отделяет слипшиеся карточки друг от друга.
- **Экран s7:** окно браузера выше, чтобы полку было видно на всю высоту (для `align-items`).
- В речи названия свойств и значений — по-английски (правка речи в `build.mjs`).
