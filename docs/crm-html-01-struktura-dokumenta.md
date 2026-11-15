# Урок 1 HTML «Структура HTML-документа» — загрузка в CRM

14.11.2026. Подготовка по пакету IT `dars-mashina-2026-11-11.zip` (инструкция `IT-yoriqnoma/JSX-YUKLASH-VA-AKTIVLASHTIRISH-UZ-2026-11-11.md`).
Сборка: `node tools/redaktor28/build.mjs`. С 15.11.2026 правки под LMS — во всех уроках (канон и общий набор);
общая памятка для всех уроков — `docs/crm-zagruzka-urokov.md`.

## Что загружать

| Поле CRM | Значение |
|---|---|
| Тип | **JSX dars (Lesson Runner)** |
| JSX dars fayli (.jsx) | `lessons/html/01-struktura-dokumenta.jsx` (1,07 МБ) |
| Формат завершения JSX | **Контракт v1** |
| Til | **Umumiy** — uz и ru в одном файле, язык из `lang` |
| Шрифты (блок WOFF2) | 4 файла из `lessons/html/assets/01-struktura-dokumenta/`: `inter_latin_400`, `inter_latin_600`, `inter_cyrillic_400`, `inter_cyrillic_600` (ключ = имя файла без `.woff2`) |
| Dars rasmlari | нет (картинок-файлов в уроке нет) |
| Birinchi ekran rasmlari | пусто |

Без файлов шрифтов урок работает, текст будет системным шрифтом.

## Проверка валидатором IT (jsx-tekshir, тот же, что в CRM)

`node jsx-tekshir/jsx-tekshir.mjs 01-struktura-dokumenta.jsx --assets assets --kontrakt v1 --brauzer`:
**xato 0**, ogoh 2, tekshirilmadi 4–5 (14.11.2026, после перехода на озвучку как в Dars001). Код в gzip (как считает сервер:
esbuild 0.21.5, cjs, chrome70, minify) — 323 КБ (норма IT: 250 рекомендуемо / 400 верхний порог). Открытый файл 1,07 МБ (норма 1 / 2 МБ).

Было до правок: ogoh 11, код в gzip 462 КБ (выше порога 400). Исправлено:
- шрифты не base64 в CSS (R06): Nunito не используется — убран; Inter — ресурсы WOFF2 через `useResources().loadFont`;
- `markFirstScreenReady` один раз за открытие (Y01, B03);
- шапка начинается с 52 px — ярлык раздела не под кнопкой «X» LMS (B09);
- `_bAskSet` помечен `// jsx-tekshir: ataylab` (сбрасывается при размонтировании, Y09);
- в каноне (для всех уроков) так же помечены `_botUid`, `_hintText`, `_ttsFirstLogged` (Y09).

Оставшиеся предупреждения (объяснение для поля «Izoh»):
- **M01 `.at`** (строка 554) — ложное срабатывание: это поле объекта `c.at`, не метод `Array.at()`.
- **M02** — современный CSS (`gap` у flex, `dvh`, `:has()`, `inset` и др.): на Chromium/WebView 79 раскладка может отличаться. Облик курса построен на нём, запасных правил нет.

Не проверено автоматически (проверить в Preview и тестовым учеником): Finish до конца (B10), перезагрузка страницы и
`passed:false` (B19), открытие следующего урока и коины (Q01), озвучка (Q02), настоящий телефон (Q03).

## Озвучка — как в Dars001 (14.11.2026)

`LESSON_AUDIO` в уроке больше нет. Урок сам заказывает каждую реплику у сервиса платформы по пропсу `ttsApiBase`:
`{ttsApiBase}/api/tts?text=…&g=m&lesson_id=…&lesson_name=…&student_uuid=…&voice_id=agoC45V78njTIxYzwmSb&k=<ttsKey>`
(`student_uuid` и `k` — если LMS передала `studentUuid` / `ttsKey`). Нет `ttsApiBase` или сервис не ответил — голос браузера.
Лимиты студии IT (300 записей, 25 000 знаков) уроку не нужны. Правила IT-пакета требуют `useAudio` + `LESSON_AUDIO` — это решение заказчика.

## Замечание по пакету

`tekshir.sh` не запускается на стандартном bash macOS (3.2): «unexpected EOF while looking for matching `''»
(строка 264). Валидатор `jsx-tekshir` запускается напрямую, `mashina.sh` и `ornat.sh` работают. Pillow в `ornat.sh`
через `pip install --user` не ставится на Python из Homebrew (PEP 668) — ставили в отдельное окружение.
