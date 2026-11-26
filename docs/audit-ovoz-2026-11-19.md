# Проверка озвучки по «ovoz-kontrakt» (редакция 19.11.2026)

Дата: 19.11.2026. Что проверено: все уроки, практики и тесты курсов HTML, CSS, «ИИ» и Bootstrap. Всего 215 файлов:
35 уроков, 25 практик, 155 тестов.

Охват. Проверялись **итоговые JSX для LMS** (`lessons/<курс>/…jsx`), только по коду (статически). Сеть не
использовалась, уроки не запускались, ElevenLabs не вызывался. Настройка CRM «Формат завершения JSX» взята из
`docs/crm-zagruzka-urokov.md` («Контракт v1»), в самой CRM она не сверялась.

## Итог

| Группа | Файлов | Итог |
|---|---|---|
| Уроки и практики (HTML, CSS, «ИИ», Bootstrap) | 60 | **НАЙДЕНЫ НАРУШЕНИЯ** — одно, C3: без звука объяснения Коди не видны текстом (облако реплик убрано по решению заказчика 26.10.2026). Контракт озвучки и прохождение без звука нарушений не имеют |
| Тесты (HTML, CSS, «ИИ»; `--tur savol`) | 155 | **НАРУШЕНИЙ НЕ НАЙДЕНО** — речи нет, скрытых вызовов озвучки нет |

Этот итог не подтверждает публикацию, работу голоса в LMS и звучание.

## 1. Способ озвучки

**Уроки и практики — способ А, legacy TTS по запросу.** Признаки:
- свой движок канона: `buildTtsUrl` → `GET {ttsApiBase}/api/tts?…`, `<audio>` (`new Audio`), прогрев `fetch(…, {method: 'HEAD'})`;
- запасной голос браузера (`speechSynthesis`);
- `LESSON_AUDIO` нет, заголовка `@lesson-audio-v1` нет;
- это решение заказчика от 14.11.2026 («как в Dars001»).

Подготовленной публикации нет — проверять её нечего.

**Тесты — без речи.** В файлах нет `/api/tts`, `speechSynthesis`, `new Audio`, `fetch`. Импортируется только `react`.

**Канон один на всех.** Движок во всех 60 уроках и практиках — дословная копия канона:
- `node tools/check-canon.mjs`: html 18, css 33, ai 8, bootstrap 1 — совпадает, расхождений 0;
- каноны четырёх курсов одинаковы, SHA-256 `2126662071b986faa54eda1654523b238c2cc3baae6e84e02089cd4d77e128bb`.

Поэтому разбор движка ниже относится к каждому уроку и практике.

## 2. Таблица статических проверок

| id | Требование | Статус | Подробности |
|---|---|---|---|
| A1 | Путь «вызов → обёртка → запрос» | OK | `useVoice` → `audio.speak` → `buildTtsUrl` (`canon-v1.jsx:945–966`). Параметры запроса: `text` (маркер языка + тег эмоции + реплика), `g=m`, `lesson_id`, `lesson_name`, `student_uuid` (если LMS его дала), `voice_id`, `voice`, `k` (если есть `ttsKey`) |
| A2 | Голос передаётся полем `voice` | OK | `voice=agoC45V78njTIxYzwmSb` (голос Davronbek). `voice_id` сервер не читает — это лишний параметр, вреда нет |
| A3 | Неизвестные параметры | WARN | Параметр `k` (ключ `ttsKey`) по коду сервиса ai-tts не подтверждён: обработчик не открывали. Сервис может его просто не читать |
| A4 | Предел одного запроса legacy — 25 000 знаков | OK | Обёртка сама обрезает текст до 1000 знаков (`String(text).slice(0, 1000)`, `canon-v1.jsx:950`). Самая длинная реплика вместе с маркером — 429 знаков (`lessons/html/05-izobrazheniya.jsx:6905`). Склейка «похвала + разбор» (`joinL`) даёт меньше 500. До обрезки далеко |
| A5 | Обрезка в обёртке молчаливая | WARN | Если реплика когда-нибудь превысит ~950 знаков (1000 минус маркер и тег эмоции), конец оборвётся без предупреждения. Сейчас таких нет. Стоит добавить проверку длины в сборку |
| A6 | Прогрев запускает синтез | WARN | При открытии экрана движок заранее шлёт HEAD-запросы на реплики этого и следующего экрана (`warm`, `canon-v1.jsx:1562–1583`). Если фразы нет в кеше сервиса, она синтезируется платно, даже если так и не прозвучит (ветка ошибки, подсказка, которую не открыли). Выключенный звук прогрев не отменяет |
| A7 | Импорты | OK | Только `react` и `@lesson/runtime` (у тестов — только `react`). Динамических `import()` нет |
| V1 | Объём текста (справочно, общего лимита нет) | OK | Строк на трёх языках в уроке — от 220 до 390 на язык. Всего знаков на язык — 14–26 тыс. Подробно — в приложении |
| C2 | Ответ не требует исправного звука | OK | Кнопки открываются сами: ответ — через 9 с тишины (`useCanAnswer`, `ANSWER_SAFETY_MS = 9000`), «Дальше» после верного ответа — через 20 с (`useAdvanceGate`). Нет сервиса или он вернул ошибку → две повторные попытки → голос браузера → иначе реплика «проживается» по таймеру длины (`waitThen(est)`). Звук выключен → реплика проживается по таймеру. Автозапуск запрещён → тихая проба, потом таймер (`waitGesture`) |
| C2a | Зависание при обрыве потока | WARN (теоретически) | Если поток звука застрял посреди реплики (`playing` = true, `paused` = false, длительность известна), страховка на `est + 4000` мс реплику не закрывает (`canon-v1.jsx:1481–1485`), а предохранитель кнопок считает только тишину. Выход — нажать на Коди: реплика начнётся заново. В браузере не воспроизводилось |
| C3 | Задания и нужные объяснения видны текстом | **FAIL (решение заказчика)** | Строка задания видна всегда — путь до конца без звука есть. Но рассказ Коди на экранах-объяснениях не печатается: облако реплик убрано (`swapNoBubble`, заказчик, 26.10.2026). Текст есть только для экранного диктора (`.sv-sr`). Без звука ученик видит показ, но не слышит объяснения. Частичная замена — помощь 1-2-3 на показах в уроках CSS 1–16; в HTML, «ИИ» и Bootstrap её нет |
| Q | Очередь, повтор, пауза, язык | OK по коду | Новый экран останавливает прошлую реплику (`stop` при открытии, `dead` в `useVoice`). Повтор — `replayNonce`. Пауза держит реплику и страховки. Язык входит в ключ реплики и адрес. Параллельный запуск исключён: одна дорожка `<audio>` |
| T | Тесты без речи | OK | Прохождение от звука не зависит |

## 3. Официальный валидатор

Валидатор `jsx-tekshir` 0.1.0 из пакета IT `dars-mashina-2026-11-11.zip`. Запускался из временной папки,
зависимости — esbuild 0.21.5 из локального кеша npm. Проверялся только исходный код (без `--brauzer`).

Параметры:
- уроки и практики — `--tur dars --kontrakt v1 --assets <шрифты урока>`;
- тесты — `--tur savol --kontrakt auto`;
- язык отчёта — `--til ru`.

**Результат: 215 из 215 — «OGOH», ошибок 0, код выхода 0.**

| Находка | Где | Смысл |
|---|---|---|
| M01 `at` | уроки, практики | Ложное срабатывание: это поле `c.at`, а не `Array.at()` (как и 15.11) |
| M02 | все | Современный CSS (`gap`, `dvh`, `:has()`, `color-mix()`…) на Chromium 79 может выглядеть иначе. В уроке Bootstrap к этому добавляется CSS самого Bootstrap 6 (`oklch()`, `subgrid`) |
| K07 | все | Размер файла, справочно. Сырой файл в gzip: уроки HTML и CSS 388–418 КБ, «ИИ» до 477 КБ, Bootstrap 458 КБ. Скомпилированный код (как считает сервер) — в `docs/crm-zagruzka-urokov.md` |
| R03 | уроки, практики | Ключ шрифта вычисляется в коде, проверяется только в браузере |
| B00, Q01–Q03 | все | Не проверено: браузерный этап, коины, **озвучка (Q02)**, настоящий телефон |

Своих правил про озвучку у валидатора нет, кроме Q02 («не проверено»). Поэтому озвучка разобрана по коду вручную
(раздел 2). Скрипта `scripts/audio-contract-audit.mjs`, о котором говорит документ, в проекте и в пакете IT нет.

## 4. Тексты реплик (редакторские замечания, не ошибки LMS)

- **Апостроф не ASCII.** В уроке 1 HTML 106 узбекских реплик с `‘` (например, `lessons/html/01-struktura-dokumenta.jsx:6879, 6915, 6929`).
  Урок собран до правила от 03.11.2026. На звук это не влияет: движок перед отправкой меняет `‘ ’ ʻ ʼ` на `'`.
  В остальных 214 файлах таких нет.
- **Кириллица в узбекских репликах** — 0.
- **Символы `% / × = < >` в репликах** — 2 находки (`lessons/html/01-struktura-dokumenta.jsx:7036`, «Перетащи `<html>`…»).
  Обе ложные: `spokenHtml` перед озвучкой превращает `<html>` в слова. Исключены.
- **Латиница в русских репликах** (имена тегов и свойств) — нарочно, по правилу курса «теги по-английски».

## 5. Не проверено

- Как реплики звучат на самом деле: произношение, ударения, паузы, совпадение с анимацией.
- Ответы сервиса `/api/tts` и выбор голоса по каталогу. Читает ли сервис `k`.
- Настройка «Формат завершения» в CRM (взята из нашей памятки).
- Прохождение в браузере LMS и на настоящем телефоне. Зависание C2a в браузере не воспроизводилось.
- Тексты, которые собираются в коде на лету: по шаблонам их нет (все реплики — готовые строки), но склейки проверены выборочно.

## 6. Вопросы к IT

1. Читает ли `/api/tts` параметр `k` (ключ `ttsKey` из пропсов LMS)? Если нет, уроки могут перестать его слать.
2. Нужно ли для существующих уроков согласованное исключение на legacy-озвучку? Документ требует для нового контента
   подготовленную (`LESSON_AUDIO`), а заказчик 14.11.2026 выбрал способ «как в Dars001».

## Что можно поправить (решает заказчик)

- **C3.** Показывать текст реплики, только когда звука нет: сервис не ответил, звук выключен или браузер не дал автозапуск.
  Флаг `failed` в движке уже есть. Со звуком облака не будет — решение 26.10.2026 не нарушается.
- **A5.** Проверка длины реплики в сборке: реплика с маркером не длиннее 950 знаков.
- **A6.** Прогревать только реплики текущего экрана, без следующего, если важна цена синтеза.
- **C2a.** В страховку `est + 4000` добавить проверку, что `currentTime` не растёт. Тогда застрявший поток закроет реплику сам.

## Приложение: все файлы

Строк текста — все строки на трёх языках в файле (реплики и подписи). «Самая длинная» — с маркером языка, без тега эмоции.
У тестов речи нет.

| Файл | Тип | SHA-256 | Валидатор (ошибки / предупр. / не проверено) | Строк текста uz / ru / en | Самая длинная, знаков с маркером, uz / ru / en | Всего знаков uz / ru / en |
|---|---|---|---|---|---|---|
| `lessons/ai/01-chto-i-zachem.jsx` | урок | `5a39b5f4b2765a49f9134941ac69e0bbe6170dbd94b625d3d4b1b9119ab519c0` | OGOH (0 / 2 / 4) | 369 / 369 / 368 | 318 / 273 / 266 | 24733 / 23557 / 24485 |
| `lessons/ai/01t1-chto-i-zachem.jsx` | тест (savol) | `6898a21ff624ed6f552479e327ab1c01e604de864ab3fbd05113acdc7703a452` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/01t2-chto-i-zachem.jsx` | тест (savol) | `b6e74496d60f4272111a2ad7d3dbc2a38534baf54ff271a251a085ddd8c218d6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/01t3-chto-i-zachem.jsx` | тест (savol) | `bdbca9d756e8903a5877b48932ce37fd8db3bb8d184d54fa246dfdd6138aecca` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/01t4-chto-i-zachem.jsx` | тест (savol) | `d5f90898aea31791fd228cc2f2c2dde9694af36b6f7a8feee6c67b031210967d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/01t5-chto-i-zachem.jsx` | тест (savol) | `cf33eb57367735482281d3724441465bf34d40c066009021f588443bbc99ccb4` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/02-dlya-kogo.jsx` | урок | `f696fcac7a6f14e9332495412052cf49685949c7a393999f97cfd386bda76d3b` | OGOH (0 / 2 / 4) | 369 / 369 / 368 | 256 / 234 / 236 | 24955 / 23268 / 24405 |
| `lessons/ai/02t1-dlya-kogo.jsx` | тест (savol) | `1f68e07fe94efecb207a994982c5d16b97ee47377e338750f8941c9528fe401a` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/02t2-dlya-kogo.jsx` | тест (savol) | `08db456e35ef4c127a06aaa1bf8e26f38552438b7e7a8fd0a96bc92a9b8880f7` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/02t3-dlya-kogo.jsx` | тест (savol) | `ebbd86f62cdd1af34cf085b3e660c8ab0a8da124ccd21091eeac0877ddb21866` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/02t4-dlya-kogo.jsx` | тест (savol) | `e4871fb63093744e8e4aea82df90774b382a83129b077e14b26b660ccb2d6c31` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/02t5-dlya-kogo.jsx` | тест (savol) | `978e0a51858f936e803efb8a62926c1612f6c1ecc29ab56f24645f346c7b6c3b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/03-chto-na-sajte.jsx` | урок | `dc39d97e5d927c529a28aa3a8594013a161b8eae3f263ffc4b18db705bd9a40a` | OGOH (0 / 2 / 4) | 395 / 395 / 394 | 281 / 205 / 229 | 26436 / 24801 / 26135 |
| `lessons/ai/03t1-chto-na-sajte.jsx` | тест (savol) | `9d1058e2afd085354c08868e3c58a09bf2a248873e38a7f7809e8d9232c77474` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/03t2-chto-na-sajte.jsx` | тест (savol) | `e7993278f3ebf3a47dab58d9b9d350c27f8200a888cd8ccfac76e74168644cda` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/03t3-chto-na-sajte.jsx` | тест (savol) | `579bdd2a38a25f8f4e9be093f5d9b7de2c98a78cf8e6f3ce15551df2bb1a620b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/03t4-chto-na-sajte.jsx` | тест (savol) | `42a61acd8d3aebf7d1881d6786c8e9b5e216243fc5c8a28af57bbba6a07817bb` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/03t5-chto-na-sajte.jsx` | тест (savol) | `4dcfd4cd057e900d632981dd08b39d95c4eaa9d1593d63607516659d8a733541` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/04-kak-vyglyadit.jsx` | урок | `a8516b9f98b8860de98fa2bb0313cf3b433f8f544c2ba1ffa0b29ded9e9b8861` | OGOH (0 / 2 / 4) | 398 / 398 / 397 | 292 / 215 / 251 | 24906 / 24031 / 24757 |
| `lessons/ai/04t1-kak-vyglyadit.jsx` | тест (savol) | `b31c96faa78f97c76e2ff6c7304ac616d8ffcfcea3ff81330696881a850e7959` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/04t2-kak-vyglyadit.jsx` | тест (savol) | `3a4d9243959d07052b6e3c1b574931bef4d450a36c245debfa7a6eac4dcde7f7` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/04t3-kak-vyglyadit.jsx` | тест (savol) | `32426596548e47c5a3a9763eecd812ca19da22c330cd53d40fbd71b552795393` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/04t4-kak-vyglyadit.jsx` | тест (savol) | `64f5f74f368178bdbb88f729495146f64f66017cbde54c9170b90225428153c8` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/04t5-kak-vyglyadit.jsx` | тест (savol) | `be61c97833369ccc9b06ef9b7d01687dee0150a9fe331d1ccfbeca8a2bc1961b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/05-kak-vedet-sebya.jsx` | урок | `2fb6b1d4c1ef04977a8f27cf2dc945180c7b793cac1098f8d95d49214cd1e58c` | OGOH (0 / 2 / 4) | 425 / 425 / 424 | 301 / 260 / 286 | 29872 / 29386 / 30183 |
| `lessons/ai/05t1-kak-vedet-sebya.jsx` | тест (savol) | `8b53082f428d4fc9f83bdc8aaa1ba5cfac4ff1e7de6856501ff0c2ac50e61b09` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/05t2-kak-vedet-sebya.jsx` | тест (savol) | `25d99d15a3eaff0c64b8e0de9d7c2dc513cec907e06393755b3dddb64b3ba6c5` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/05t3-kak-vedet-sebya.jsx` | тест (savol) | `703f5b10042981a1449363228c8e6157542863a4dd4b4090d5177dfcb86a52c1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/05t4-kak-vedet-sebya.jsx` | тест (savol) | `5c64e76f2045155539a6d5225e05c9f75477afa691806c45635ff67841b75eba` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/05t5-kak-vedet-sebya.jsx` | тест (savol) | `5e0ac880af68c735cf6ad9e2bc7b773f19d6b5468c00554260e1b4925cb6b3c8` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/06-tochnye-trebovaniya.jsx` | урок | `2c37cb3d2bee91a038a7b6e754ac2dbe2ea5f57367922a3397c0db1b257a3f72` | OGOH (0 / 2 / 4) | 435 / 435 / 434 | 291 / 254 / 268 | 28740 / 27514 / 28796 |
| `lessons/ai/06t1-tochnye-trebovaniya.jsx` | тест (savol) | `f92a1f7cbd2e7c0eb2e41f9c02e17bacb39f8f3eb2770bbfb45947f38488a9f6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/06t2-tochnye-trebovaniya.jsx` | тест (savol) | `792246cef32a8146b5f9300be28e5133618ffb5f68e6ea36e27c7ba66f9142f3` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/06t3-tochnye-trebovaniya.jsx` | тест (savol) | `cabb27d46a4dca5588ba381429f876f6cd2e36ea03ccbd190ec8f4ae83ae8dbb` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/06t4-tochnye-trebovaniya.jsx` | тест (savol) | `6b123c8e28fe7641c8adc215e660e31ded5e435a6dadb60f10ae9c8e15478013` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/06t5-tochnye-trebovaniya.jsx` | тест (savol) | `ac14b455414bb815a32e3176a5762e532854c44b60767685a2d8f9f390088bba` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/07-uluchshit-rezultat.jsx` | урок | `bcbb18000a033d19f73bedadbe276114fbdc3522af64ba088fb4fe6e3a0bb661` | OGOH (0 / 2 / 4) | 419 / 419 / 418 | 299 / 263 / 279 | 27488 / 25817 / 27697 |
| `lessons/ai/07t1-uluchshit-rezultat.jsx` | тест (savol) | `08b527676558a824acd41959f8858476420fefeade48ee3f3f5bc96529c95680` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/07t2-uluchshit-rezultat.jsx` | тест (savol) | `7d4e14aa438acd97b8f0ef58d30ecd6a923767715b7cb9950a9a1fcf05000985` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/07t3-uluchshit-rezultat.jsx` | тест (savol) | `fe8f70fc84795b347dce5a6c3c083effb726ba8e4c9d0bdcf834d75214b43dc8` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/07t4-uluchshit-rezultat.jsx` | тест (savol) | `290862b95facc88fa4865d91e51592c7938d4d912ca9844eebec1ea9f0dd6ee0` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/07t5-uluchshit-rezultat.jsx` | тест (savol) | `5fe64338189e7f3e3c1a6de632e4ee256e276fba559cab082df3493229fbb051` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/ai/08-final-proekt.jsx` | урок | `e6d71b6c7bf4c71f9a3b98ed6338b55cce76deb7e82bdf7132646b8d7b97f445` | OGOH (0 / 2 / 4) | 334 / 334 / 333 | 333 / 254 / 283 | 21867 / 20746 / 21723 |
| `lessons/bootstrap/01-vvedenie.jsx` | урок | `8288be19d206e6dd77ca6e9e7ff0663bc5c10b551042be5558cbe45f49347660` | OGOH (0 / 2 / 4) | 220 / 220 / 219 | 353 / 321 / 351 | 16649 / 15804 / 16553 |
| `lessons/css/01-chto-takoe-css.jsx` | урок | `b7236c521aea66fa106f2f9a9af0991e8812e83c4f753730b441dbc5b91b5c6e` | OGOH (0 / 2 / 4) | 314 / 314 / 313 | 399 / 347 / 373 | 22940 / 21716 / 22658 |
| `lessons/css/01p-chto-takoe-css.jsx` | практика | `a156137df4c7006e62fb6e63041774bc2943afbd844a252ee55c6ad54e1ea762` | OGOH (0 / 2 / 4) | 321 / 321 / 320 | 276 / 241 / 256 | 17483 / 16739 / 17587 |
| `lessons/css/01t1-chto-takoe-css.jsx` | тест (savol) | `93c16e99d8ccbf867adbe5b2805f8cfcd4ea2dc47d46d9ef6290dec7fe8a111d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/01t2-chto-takoe-css.jsx` | тест (savol) | `3d7e4ac5cb8df1eb10f83f24cd360f6718a3ed1ffd40f0c7b810feea47883ece` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/01t3-chto-takoe-css.jsx` | тест (savol) | `614ce290318c48edffd3645d3119d6d35b9a2beef9a248af8a3324e7af4e0d84` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/01t4-chto-takoe-css.jsx` | тест (savol) | `2be1bd91e5935b2dee12e07bf8d17159b1ff973a90eb2ac2ab85f5779ff48b5b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/01t5-chto-takoe-css.jsx` | тест (savol) | `64dd6a43574f14dc7d2cce790dbb720ca80c907b0e9cdfb54cbf02ef4008fe3e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/02-selektory.jsx` | урок | `be3fe639f938ca5f9150eed4d75a65902ccb9be887ffe79ded999e38b13794d4` | OGOH (0 / 2 / 4) | 301 / 301 / 300 | 384 / 350 / 393 | 22129 / 20529 / 22070 |
| `lessons/css/02p-selektory.jsx` | практика | `9f2acf3c179347629d7d3cc5a2e91abd4d18e386a231c1921e7f071627a363eb` | OGOH (0 / 2 / 4) | 330 / 330 / 329 | 296 / 262 / 314 | 18746 / 17739 / 18851 |
| `lessons/css/02t1-selektory.jsx` | тест (savol) | `dcef050f9554fe098555366195c2bbef5fec08a57352a312a831b5f84d84b6b4` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/02t2-selektory.jsx` | тест (savol) | `da6a7bafdb82e6cfe6a92296a53e1e5007a9e3e83388653c6ecd3fcd45fa233b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/02t3-selektory.jsx` | тест (savol) | `130d519fa3a7c276cf49a92912ce4c62c27607f7e56162db0490e825e82c174c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/02t4-selektory.jsx` | тест (savol) | `66b1c4c1949dabbe5949434d3f2e7c1c471bbb2b60b2accfd143f7e30f27facf` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/02t5-selektory.jsx` | тест (savol) | `491e328a5deb635a86985d666acef33dc7ea0bbfa398e24b5e1e391bab4708a1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/03-cveta.jsx` | урок | `aec4fab0c06ccaaee3e9189937c6595a3b255c11168292248eccdf5b7d89dbba` | OGOH (0 / 2 / 4) | 297 / 297 / 296 | 320 / 303 / 326 | 20483 / 19885 / 20747 |
| `lessons/css/03p-cveta.jsx` | практика | `93a4e2e35c6ddb9254a3f6b5db2a3061c968ff5952f1367046efd9e74748489e` | OGOH (0 / 2 / 4) | 326 / 326 / 325 | 283 / 268 / 291 | 18394 / 17673 / 18633 |
| `lessons/css/03t1-cveta.jsx` | тест (savol) | `f952e8f2d3507935b9c1d2cd53ba57246a08a65a4e6bed12727b9b889da49609` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/03t2-cveta.jsx` | тест (savol) | `03bde777629cbad1b8e445ebcc5071cb414b367e0bcb37a5addc232cdf847f9b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/03t3-cveta.jsx` | тест (savol) | `ca6eeeba3d3d3af3e3ca48434f9399f37ecf1c773757320cf3fd118018ab6939` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/03t4-cveta.jsx` | тест (savol) | `564cf47aa01fe4381e8e202a22959908b3f62eae26ddcef4d00c2b376e78a984` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/03t5-cveta.jsx` | тест (savol) | `efd586d817e8165f847636090319329a79158e752a15303d560a4382e21478d1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/04-fon.jsx` | урок | `dea2b826f1784f9e2294dd6a4b006dab94adbbdfc52ee0302076bdd771e08ffd` | OGOH (0 / 2 / 4) | 302 / 302 / 301 | 307 / 285 / 322 | 21438 / 20639 / 22271 |
| `lessons/css/04p-fon.jsx` | практика | `2b386c335cc667f7f0a45ef7e1efae57dbf9b1ec54e4df901b37976dac2d5886` | OGOH (0 / 2 / 4) | 328 / 328 / 327 | 280 / 266 / 298 | 18707 / 17889 / 19244 |
| `lessons/css/04t1-fon.jsx` | тест (savol) | `cd32d670d66b9df7efdf636db578757c396aaf11e1611ac4ca45b54210027b6d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/04t2-fon.jsx` | тест (savol) | `0795ad13947132b5b07014f490ae02fe13317fcf0f191030187db897a29578c6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/04t3-fon.jsx` | тест (savol) | `79b499b696bc54cde214c16274556b60da013028ecbc71acdce82363a1406f82` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/04t4-fon.jsx` | тест (savol) | `77347eb7037eb8ebc071aba71d93c9e4fe49c64753dea5d374e76b2bd7d41c96` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/04t5-fon.jsx` | тест (savol) | `1dccc073ed06c06540902d2c8765020daf05b9727669fc82fd40073597c48f9b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/05-tekst-i-shrifty.jsx` | урок | `66a2ddef2b721a36b209fb4e28d8592ae468bf69dee4a22de43b3f43682a1319` | OGOH (0 / 2 / 4) | 293 / 293 / 292 | 325 / 279 / 317 | 20118 / 19272 / 20222 |
| `lessons/css/05p-tekst-i-shrifty.jsx` | практика | `3af584e5a24186f6e7f4cd4cebd7db09c4296fab6913c906981b660bc50eeedd` | OGOH (0 / 2 / 4) | 332 / 332 / 331 | 293 / 251 / 266 | 18543 / 17701 / 18519 |
| `lessons/css/05t1-tekst-i-shrifty.jsx` | тест (savol) | `709babefa43a04edd3954a78f1a4db05e0c1380df97f23b6b9d298fe721adf24` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/05t2-tekst-i-shrifty.jsx` | тест (savol) | `c0d4831b8149f09ee80e9f357d17a031a24af2e22cead5df4dd6cbe75857886b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/05t3-tekst-i-shrifty.jsx` | тест (savol) | `bbcc27d7b5b426144dc397e7ba7319b2d6692bc9e92ec3c0bbcf5e29b473d70e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/05t4-tekst-i-shrifty.jsx` | тест (savol) | `5000ee91e7a772539c1432ab69d4cba54a10fed0d2ea8390821182d8f7e3ff92` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/05t5-tekst-i-shrifty.jsx` | тест (savol) | `8b0c1a58047466926a973bd43181aa95439c62b97dd51415be60865226a4be08` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/06-razmery.jsx` | урок | `8cbae81b3b0368ec99a85ae5564549aa6c26322136ba13588c00ebe55c0ab7d1` | OGOH (0 / 2 / 4) | 292 / 292 / 291 | 284 / 268 / 290 | 19843 / 19198 / 20474 |
| `lessons/css/06p-razmery.jsx` | практика | `ba66cf310cb2a75613c24e3d38340e8686e92161269beded22c6b809cd5b04dd` | OGOH (0 / 2 / 4) | 324 / 324 / 323 | 286 / 243 / 283 | 18117 / 17252 / 18111 |
| `lessons/css/06t1-razmery.jsx` | тест (savol) | `a84faa545c16be274908877fcc0dce760a4afb855f54edbb05a99b23580be094` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/06t2-razmery.jsx` | тест (savol) | `0e11acdb58f809d67e92db27053f6b02edefa7c246f7963888b195ac3ca290ee` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/06t3-razmery.jsx` | тест (savol) | `9c6d06b80e2dbe398c23bf550d2a171c68bbffa7b2c5e3bc77790e0d0ac198a0` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/06t4-razmery.jsx` | тест (savol) | `e9f28dd67518b2c5168cd4e9addc0ef3c408187e6c0f7cddfa7be5a74f19fc98` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/06t5-razmery.jsx` | тест (savol) | `abaae55a6b9dd09b20f9c1e7c861584b144250404264c5b1d40fba76bf6dadc6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/07-box-model.jsx` | урок | `05701b23a048d064368f63d9e7e66049eaea96b4269e68c7be525cfb09e2ef4c` | OGOH (0 / 2 / 4) | 290 / 290 / 289 | 297 / 247 / 287 | 21069 / 20107 / 21205 |
| `lessons/css/07p-box-model.jsx` | практика | `db7a9f886d69ead5646978af9819534e830a3e7c7f7ac569dc0b6cc89cfb1cd2` | OGOH (0 / 2 / 4) | 331 / 331 / 330 | 303 / 275 / 351 | 18822 / 17979 / 19073 |
| `lessons/css/07t1-box-model.jsx` | тест (savol) | `3b4eda3dcb4f6e4bdc13a517033445659fbd79dc798dd2c99b58d80f1bb11554` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/07t2-box-model.jsx` | тест (savol) | `47426a0a7b2687f69fc63688ecb55e97dd6b515d5bc6ac5e9e1225d26a67ba92` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/07t3-box-model.jsx` | тест (savol) | `d4312bd78d612442ae155b1f9b446bfb8f5609f661243974adb1a3a7371ab435` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/07t4-box-model.jsx` | тест (savol) | `8f3b78cff7a3201b289f2f94e916f179c2f34f2adc3e37cfd43441dab942144d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/07t5-box-model.jsx` | тест (savol) | `54a095c77977a111179a4d4800224a61844d1d9381fde2a5abc320796f5a4cae` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/08-kartochki.jsx` | урок | `b16ee94404d6d8dc734f195780b6ed363a58be6591764f30e2999c0b5b3105bb` | OGOH (0 / 2 / 4) | 297 / 297 / 296 | 291 / 254 / 290 | 20796 / 19752 / 20822 |
| `lessons/css/08p-kartochki.jsx` | практика | `ef3022e82d9786d6ff56c26135dbb1da2ee0d936659c24ca08d1e936024807ef` | OGOH (0 / 2 / 4) | 333 / 333 / 332 | 317 / 279 / 305 | 19480 / 18402 / 19499 |
| `lessons/css/08t1-kartochki.jsx` | тест (savol) | `bb5f6c69d17729f1152c311a401829ef8aecfc74d42eec414347fde936c1de88` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/08t2-kartochki.jsx` | тест (savol) | `a9c86ec05e99f633c906f27baf55db4bef48e6ac57733cbb33738e687499c048` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/08t3-kartochki.jsx` | тест (savol) | `a0d322ca55732caa303d58375a2ca01f3a9014b27b2d96887c4e15edfbb88bf4` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/08t4-kartochki.jsx` | тест (savol) | `1c08800d7c41973dd4896f563407ef27499509d266b8a813d5486ab93203fba1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/08t5-kartochki.jsx` | тест (savol) | `16a5a4c398076c0bf4d6e060f780072a109c528280248b4cfa182679fecf7428` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/09-display.jsx` | урок | `6409d0891424dc65db7d650437b0d84fce5e8053edb1b2b282bf61a59554708a` | OGOH (0 / 2 / 4) | 306 / 306 / 305 | 332 / 319 / 323 | 21519 / 20666 / 21800 |
| `lessons/css/09p-display.jsx` | практика | `3854d3775c4ad6affe9dfd031bb80e9adbda58c5c81d8aff058b26255e2a70d7` | OGOH (0 / 2 / 4) | 337 / 337 / 336 | 303 / 275 / 292 | 19238 / 18289 / 19282 |
| `lessons/css/09t1-display.jsx` | тест (savol) | `7502db1e897bd47197dfaf9c885af1b7aa01a3addb60fcfd7343868bc363ca4c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/09t2-display.jsx` | тест (savol) | `35db4476057e6df26eed7db31d5c5ea74f5f54f7e76589ab43a26f7cd8f774ea` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/09t3-display.jsx` | тест (savol) | `8e590f126168ccf6fc62a26aece66f5562deb908c1caa30161d86e9861ac011a` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/09t4-display.jsx` | тест (savol) | `948d70336e460eb61c29ef693a947b30fc6310fff24765c95b47a2bf5c51fddf` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/09t5-display.jsx` | тест (savol) | `dfece951431afcaf12719446029d6cc7c13f952618d389841c1a3400d2839354` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/10-flexbox-osi.jsx` | урок | `64c431460b48e81f3a69b6b6bbd238186678c1734338d52501418c7614eb517b` | OGOH (0 / 2 / 4) | 305 / 305 / 304 | 316 / 280 / 312 | 20942 / 20053 / 20981 |
| `lessons/css/10p-flexbox-osi.jsx` | практика | `4948b9e6afb014c80b7e2f6fd6c354adbab279c340a380b921b900631d94c5c1` | OGOH (0 / 2 / 4) | 339 / 339 / 338 | 314 / 282 / 307 | 18960 / 18103 / 19018 |
| `lessons/css/10t1-flexbox-osi.jsx` | тест (savol) | `f03a628c174771712822f429e02d99c6ae4fbd6b4c3a5977dfd3bc3adcba66cd` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/10t2-flexbox-osi.jsx` | тест (savol) | `ba51375291d14024036cd6b7ea78a4a4b5ee23cab878264987cb76b11b86e65d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/10t3-flexbox-osi.jsx` | тест (savol) | `0c1211fb0f200b1992619ec7c7e5522d81a8f00e96a32bed7714b7c73df7d136` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/10t4-flexbox-osi.jsx` | тест (savol) | `e810beb5c77684874b6999ce69cf50e455e67e078caaacadd6a6931054741b42` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/10t5-flexbox-osi.jsx` | тест (savol) | `ef5ccffafb0c99478cc55e57aa42fc5635a2e06dcc3f171c41b2947357547a36` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/11-flexbox-vyravnivanie.jsx` | урок | `01a3a927158b90ead0f7d30745b2c313567a71165d85095de3d4865d7b76c327` | OGOH (0 / 2 / 4) | 317 / 317 / 316 | 339 / 304 / 321 | 21804 / 21154 / 22003 |
| `lessons/css/11p-flexbox-vyravnivanie.jsx` | практика | `eb92a717793bf36f1452b3e7b259aee5f6d8cfa7aebf21b2513af3e6607cb29a` | OGOH (0 / 2 / 4) | 330 / 330 / 329 | 316 / 274 / 284 | 18776 / 17876 / 18964 |
| `lessons/css/11t1-flexbox-vyravnivanie.jsx` | тест (savol) | `47dde81c68e6d832589931348a6f33a1c7200e89a3edd4c78bd57fa584ae2de1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/11t2-flexbox-vyravnivanie.jsx` | тест (savol) | `fb9b07143826b80a97923362e405e2298a3e0defaa63e183639931065638fb83` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/11t3-flexbox-vyravnivanie.jsx` | тест (savol) | `09d69c5c22ed8a37cfcf63b1744651865afddfc7b3328212cdf8a3a47152efbe` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/11t4-flexbox-vyravnivanie.jsx` | тест (savol) | `e6904f9a6b8e1ce062c00b32ea730b83e5efbd04679e80f583736c49e434f313` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/11t5-flexbox-vyravnivanie.jsx` | тест (savol) | `e7fee4be3c45aced7f3de6d00e92e94c5395c89a67ce8156c7c5a62b3b6d45eb` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/12-pozicionirovanie.jsx` | урок | `4e85c4b7f765299f75d63830b2b8c94743d103b2681ced0e377bc8c78d17d5e2` | OGOH (0 / 2 / 4) | 318 / 318 / 317 | 347 / 285 / 339 | 22537 / 21964 / 23187 |
| `lessons/css/12p-pozicionirovanie.jsx` | практика | `61f5ad4d898a7dfeb2393bf7018de195d941b6421159a565fe19d67393b6282a` | OGOH (0 / 2 / 4) | 336 / 336 / 335 | 312 / 275 / 295 | 19383 / 18540 / 19703 |
| `lessons/css/12t1-pozicionirovanie.jsx` | тест (savol) | `43dd44de9449e9aa145adc74fcd259e1f1f56fc46312d8d061d55dbbbc398dd4` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/12t2-pozicionirovanie.jsx` | тест (savol) | `5f96bde95f037c62b50b73f220bfba73c6861c506f79d029b0bc6efa89f21ad2` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/12t3-pozicionirovanie.jsx` | тест (savol) | `f816db5d327c94750625768306418cd841dbbb95caa94024e9cb3a0bb225fb6c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/12t4-pozicionirovanie.jsx` | тест (savol) | `b7ec3f21a83823559ea277e04ef8265f14c681a94b6e49734fb8757cf3a6a15d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/12t5-pozicionirovanie.jsx` | тест (savol) | `5d309726a6734fb7ed65e2df690a9184df0600ce061da98a958457ebf767aa7f` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/13-hover-transform.jsx` | урок | `cf914d3bc6a862d25cb816f6122c04dae2d5bcba081377ede859ec67d221d01a` | OGOH (0 / 2 / 4) | 304 / 304 / 303 | 312 / 246 / 292 | 20704 / 20000 / 20865 |
| `lessons/css/13p-hover-transform.jsx` | практика | `7a142108c9778268c86b92c12078de95b8ff22efc0309795f4f6c971f813e7b8` | OGOH (0 / 2 / 4) | 329 / 329 / 328 | 337 / 300 / 316 | 19555 / 18507 / 19322 |
| `lessons/css/13t1-hover-transform.jsx` | тест (savol) | `4120800cf76a6ac9083ae484338a1a06b3d5b29dee95aaf5b23ac48812f84979` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/13t2-hover-transform.jsx` | тест (savol) | `b47e94c0536af32500b3a1cac2141d798d4b277e71e368fc3229e7c63fbb876c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/13t3-hover-transform.jsx` | тест (savol) | `bc57958f323ef8616ddc8d5f80cc589e0a5d7eb8becfae25c66fcacb646317b5` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/13t4-hover-transform.jsx` | тест (savol) | `fbc47689fc8d00bd6e432a9037389549086ad6907d2d6261ccffb200f91231ed` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/13t5-hover-transform.jsx` | тест (savol) | `8b170e4faa99211a39305f7d2be6f8d1def15cfe6179f2b6d493a913c352f477` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/14-transition.jsx` | урок | `ca2324ad7f4471cfb884fd45452f24d06517b46fcc8c7cf782c8bab788a76ade` | OGOH (0 / 2 / 4) | 314 / 314 / 313 | 310 / 270 / 306 | 21910 / 21257 / 22241 |
| `lessons/css/14p-transition.jsx` | практика | `46d799a8ca3f7361f6cb92d03ddbb7922e20eda6bda69d0a5395d33b3b92a6a1` | OGOH (0 / 2 / 4) | 333 / 333 / 332 | 295 / 251 / 274 | 19548 / 18732 / 19765 |
| `lessons/css/14t1-transition.jsx` | тест (savol) | `ea8768a9ff59a22d1ab17d4b491da33e81929755655969dd0ab626831723207c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/14t2-transition.jsx` | тест (savol) | `0e4410db6e4caf89ce95a7f31cef94437130c098c3b7407d9481569b4fa10200` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/14t3-transition.jsx` | тест (savol) | `8d2255aa78d1f03d9dd04b6c32cb5f3c047da22259f26be40179fbb803d7a735` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/14t4-transition.jsx` | тест (savol) | `6d23c3873c7fe6ed688cc2ca735da66af9ac576cb3585c4fd78a3706617e9e61` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/14t5-transition.jsx` | тест (savol) | `5c38559c151a2e1ad1a193ea16c317deffb7c457460a3abfc6bea85dab6c2829` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/15-animacii.jsx` | урок | `9440ec491fb2f7fb939b05382a8c8ddf616480a5489ed3e698e584c51ee40cce` | OGOH (0 / 2 / 4) | 317 / 317 / 316 | 303 / 276 / 328 | 22017 / 21254 / 22382 |
| `lessons/css/15p-animacii.jsx` | практика | `5fcafc664ef4c06506af60ad3ea1e6e380e08b4632394cbef6d8e07932c0cd29` | OGOH (0 / 2 / 4) | 332 / 332 / 331 | 336 / 270 / 324 | 19357 / 18525 / 19559 |
| `lessons/css/15t1-animacii.jsx` | тест (savol) | `d5fe8e750e702fb2a7c187f3aadbadddc2960a85b8587f594d02e68020469b0d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/15t2-animacii.jsx` | тест (savol) | `b9f9169f10cd84046ed0f56a31e90f30c8d0b7f882b8bf0f5a5ea4000e5fb2b6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/15t3-animacii.jsx` | тест (savol) | `9e50cde4e493f1f108de66da637128a13ae11beeb53289e7d74ed8344ba32ad1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/15t4-animacii.jsx` | тест (savol) | `c5310dc13b55ba1054bf8957af279c2854fabaf24558c1151e598f1d28049cbe` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/15t5-animacii.jsx` | тест (savol) | `f330223dcdbf6f0d7b5a1ab2ba3fc0a4f5fbd5c25a86dbd8e3e69fd2add1844e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/16-adaptivnost.jsx` | урок | `f25be475badef670fdba94006c72ecfc680542e35d0ab33efb958a1bc8342d81` | OGOH (0 / 2 / 4) | 315 / 315 / 314 | 311 / 277 / 325 | 21573 / 21035 / 22196 |
| `lessons/css/16p-adaptivnost.jsx` | практика | `331ee57fc1beb254ca70a878d3960eca3b2360abe4e87fbae6eaaa4f5faa93cf` | OGOH (0 / 2 / 4) | 340 / 340 / 339 | 297 / 307 / 310 | 19969 / 19261 / 20074 |
| `lessons/css/16t1-adaptivnost.jsx` | тест (savol) | `9a57615b1aa2253b111e1ce05ad08cfc9532785c48d5b858ee5a45d3790615bc` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/16t2-adaptivnost.jsx` | тест (savol) | `6bdba4e4920ddde72fbea481e48d3c99a36e69e7e3af129524145ca506b9ecb6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/16t3-adaptivnost.jsx` | тест (savol) | `035693dc9444751fe3fa165b9dc1f6eb9f27fa1403940c69c3e005e611337c9b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/16t4-adaptivnost.jsx` | тест (savol) | `760334553b402664d7b2d05ca844f81c70117cfa8a8cd36e4197f61d97b9da2f` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/16t5-adaptivnost.jsx` | тест (savol) | `02fe7cb3e28bfc2cc4d694919c424d674c86d7ed7d10172f1ecfc097b193eb00` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/css/17-final-proekt.jsx` | урок | `005b33cc276789c1b153e5d7b6fc2abbd8d76e06530506c282d9d4d3f7e74dd2` | OGOH (0 / 2 / 4) | 330 / 330 / 329 | 290 / 263 / 261 | 21840 / 21227 / 22250 |
| `lessons/html/01-struktura-dokumenta.jsx` | урок | `86534695bb9db4bf2bbd57b39adce75d2b93dd937f015c92d3a5f2887141af11` | OGOH (0 / 2 / 4) | 438 / 438 / 437 | 224 / 191 / 182 | 36515 / 31680 / 32450 |
| `lessons/html/01p-struktura-dokumenta.jsx` | практика | `87ee82d91411848877a4356dcbbf5cb535fb3856a6c7a56de11ef546a937b5ee` | OGOH (0 / 2 / 4) | 189 / 189 / 188 | 308 / 265 / 299 | 12025 / 11626 / 11836 |
| `lessons/html/01t1-struktura-dokumenta.jsx` | тест (savol) | `8b66708ed524dbe4e5a9ed025af232c203f50ec4f817af0839023fb940a78349` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/01t2-struktura-dokumenta.jsx` | тест (savol) | `f884da753f466e67a2d4b9091c2ec52854f7047e271c31172c6719f9503300ed` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/01t3-struktura-dokumenta.jsx` | тест (savol) | `ad86131c12e08c270b46e5d87ca61d6053e869762a4bf73c0ab813ae05a09055` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/01t4-struktura-dokumenta.jsx` | тест (savol) | `2a1b9b253ddf1036ac47afbb8614a212417be24937ff925401709d6aba945fe7` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/01t5-struktura-dokumenta.jsx` | тест (savol) | `3406772a83566759ee5924e08c71cf3bddf36b5b7d59919b4fc857fdbbb12381` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/02-zagolovki-i-tekst.jsx` | урок | `77b844d0883f3cb80c3877ed6d2c95d9c2741534f023bef93c60a863d7f7072d` | OGOH (0 / 2 / 4) | 296 / 296 / 295 | 325 / 300 / 320 | 19436 / 17990 / 18653 |
| `lessons/html/02p-zagolovki-i-tekst.jsx` | практика | `b2ce144bc8b6c9bcd33f00203bf297ca8cc227398387a5a44e0835b49cd2d922` | OGOH (0 / 2 / 4) | 208 / 208 / 207 | 356 / 305 / 369 | 13403 / 12724 / 13180 |
| `lessons/html/02t1-zagolovki-i-tekst.jsx` | тест (savol) | `22c60fa4dc3c6d9e8d264d883e9bdd5c70653407cdf15a5c8a25c6fa2be458ef` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/02t2-zagolovki-i-tekst.jsx` | тест (savol) | `f1e6c192ae160d6ccf5f2409d68188e7ef61198eb734077161920341fe2b656c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/02t3-zagolovki-i-tekst.jsx` | тест (savol) | `4f5ad7fae48088b966cd64f5b7cba8fae1b3cc09c094e4490a05651114740da9` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/02t4-zagolovki-i-tekst.jsx` | тест (savol) | `ec8ce7c9fd1eb1121a7a77dd16761f674d401ba6a54d55223fec8f6fc4df927a` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/02t5-zagolovki-i-tekst.jsx` | тест (savol) | `abb773445c881c95fb41a058b7245d2ac2087936f7b67914b5ef9d9ef92e2b0b` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/03-spiski.jsx` | урок | `49c46f9a9f75e674f951e19ca5184d0c667b9f7aaa8c9b839677439937a92859` | OGOH (0 / 2 / 4) | 282 / 282 / 281 | 353 / 282 / 331 | 18887 / 17190 / 17872 |
| `lessons/html/03p-spiski.jsx` | практика | `1791dc38e5b79f0d8682abc6312a71e18860d54c19d0cdd48053889297d4ee5b` | OGOH (0 / 2 / 4) | 212 / 212 / 211 | 335 / 303 / 311 | 13100 / 12472 / 12871 |
| `lessons/html/03t1-spiski.jsx` | тест (savol) | `087f7fdb848db0ad6f2c0e1c70c58f562e87100f0d12c632c2288a2e2e505510` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/03t2-spiski.jsx` | тест (savol) | `b681847de31e6f88edc0aa075714e7d5e7b12bd84194e6aed7eb76a58724f4fe` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/03t3-spiski.jsx` | тест (savol) | `a36b5c76763f300c493042da58953c5694eeea91f7a71329bb360518856a6186` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/03t4-spiski.jsx` | тест (savol) | `916adb32e0f0f6c86680141eb4610c4720b71a4403947f7df84192867db2fce7` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/03t5-spiski.jsx` | тест (savol) | `e1caf1fa3eaec9f9931543417f5bfa22564a939ca9f9378a22d7910b4ca1b2a3` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/04-ssylki-i-atributy.jsx` | урок | `152934192c6ccc2d04ea044e537a0b6f49763816f597f5abf95003e49fc4c03c` | OGOH (0 / 2 / 4) | 360 / 360 / 359 | 397 / 325 / 369 | 24683 / 22866 / 24135 |
| `lessons/html/04p-ssylki-i-atributy.jsx` | практика | `4632631fdad3a60aa64e4399f061be0600155daa841c40f41608442e0d74b3ba` | OGOH (0 / 2 / 4) | 203 / 203 / 202 | 281 / 234 / 264 | 13207 / 12577 / 12960 |
| `lessons/html/04t1-ssylki-i-atributy.jsx` | тест (savol) | `131790e66cae6fb9473c4588b92a45c23ce23a68c396b2d1f2b950d6b65e08ef` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/04t2-ssylki-i-atributy.jsx` | тест (savol) | `f186a90ab528ea15d30679f43005258c748b6e3046a5d3d928318e25b7a56522` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/04t3-ssylki-i-atributy.jsx` | тест (savol) | `914b4a9fd39814721632c3a39585ed39cfb7ee4077c03912c7b92e75977c3dc9` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/04t4-ssylki-i-atributy.jsx` | тест (savol) | `8dbe983446d8de12f4aa47fdc2e5f8314962b9eddf7da53941aae3ff8184893e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/04t5-ssylki-i-atributy.jsx` | тест (savol) | `f0784d90704bdf09b3c1e1931325056969c530229a837b5e8e460b41ec5b6ac2` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/05-izobrazheniya.jsx` | урок | `0e7b1a6e9e3e062df46c3d9b503ec4c6efa1fbfcd46ffe1c08d7c92b1fabab32` | OGOH (0 / 2 / 4) | 356 / 356 / 355 | 429 / 383 / 425 | 27141 / 25751 / 27452 |
| `lessons/html/05p-izobrazheniya.jsx` | практика | `ed82d06a9a0a94fc35cbae4afa7537eaf7752b651f9cc90b308f9f53f89ad6b1` | OGOH (0 / 2 / 4) | 208 / 208 / 207 | 274 / 238 / 272 | 13392 / 12844 / 13503 |
| `lessons/html/05t1-izobrazheniya.jsx` | тест (savol) | `bfc4dc94df551deec4ff1c119b0a0b1b652fe1550ccb09afde3473e74c601e34` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/05t2-izobrazheniya.jsx` | тест (savol) | `1aa4a15df49ab23c99c4d32f9b1d50e50fee7076e7ee37d7141df28e55af056e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/05t3-izobrazheniya.jsx` | тест (savol) | `6b535eeb027f6febde6ec0230af257f78c96be65b23631760366b668b5bb3a5f` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/05t4-izobrazheniya.jsx` | тест (savol) | `3df1374fc2b931fa36f0f1b3ad01055f0519150e2a192870e0c6c009d09128ff` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/05t5-izobrazheniya.jsx` | тест (savol) | `f0dfb33082407a69d40f5876827bd5074e222e1ec3e254a68f677bc0f176e12e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/06-formy-vvod.jsx` | урок | `9a44d571c98abdd44fed01b8a4d56bb1d3b134ac49b9c98e6cc7eaa96c6644da` | OGOH (0 / 2 / 4) | 289 / 289 / 288 | 391 / 331 / 391 | 22083 / 20522 / 22114 |
| `lessons/html/06p-formy-vvod.jsx` | практика | `b88a882865cda7f8c12384761602bb8df667c9513e7b099dfab87f1e99b11ad1` | OGOH (0 / 2 / 4) | 215 / 215 / 214 | 291 / 247 / 268 | 14395 / 13518 / 14285 |
| `lessons/html/06t1-formy-vvod.jsx` | тест (savol) | `005e815813a20ec6f0e21c48ad630cee3bf9b1a405e7b8c9ddb436790313cd5e` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/06t2-formy-vvod.jsx` | тест (savol) | `9810b143ad19b7d2e6067f68b0cf578ad717aaa197c02556152e732a1469bc68` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/06t3-formy-vvod.jsx` | тест (savol) | `c77003f2a86c43e9d5e788c2b37c1d40e1855eb57333e0b200b2a4825a2026ca` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/06t4-formy-vvod.jsx` | тест (savol) | `e8e07f2a0f27106f879fef0b5f9619779f2ec0f9a475e305be161a198548c0e6` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/06t5-formy-vvod.jsx` | тест (savol) | `4b95ee9a84531b119f6416c146f103daaba7c962b2cf6ae319a32ec056ba7afc` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/07-formy-vybor.jsx` | урок | `5aa2bc0b0f60cd52a5a7af42fd3c2cd3e5f78f40dce4f5c045de6dab2cfc5c13` | OGOH (0 / 2 / 4) | 284 / 284 / 283 | 408 / 351 / 407 | 20990 / 19477 / 20516 |
| `lessons/html/07p-formy-vybor.jsx` | практика | `9232902c882425effdeb1dff75cd3fd160c94eaa8440bf0fe237fcfe8fe1d468` | OGOH (0 / 2 / 4) | 241 / 241 / 240 | 293 / 273 / 279 | 15280 / 14709 / 15249 |
| `lessons/html/07t1-formy-vybor.jsx` | тест (savol) | `7d40465d1b79edd1d268413f0366d2fbdee0ae1e97ffe4a1f7a7d5ccc7c807cd` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/07t2-formy-vybor.jsx` | тест (savol) | `bd3e4197f389a855c1ba911951ec530022af9c57002ac23fcdf0f6684c46f5a7` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/07t3-formy-vybor.jsx` | тест (savol) | `ed3603c3c6d7a913d8a224ad841e7852069c5c8a8719af381d4140c9626d9ad1` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/07t4-formy-vybor.jsx` | тест (savol) | `d8b8ccf9803d246c94dda74a22f4ee222f10346c72304781a5fe33e6a4b95d0a` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/07t5-formy-vybor.jsx` | тест (savol) | `ff49cf3fa929af19d3f97e231fc44baaf19e1b9d9c07063f096310a79ce91f1d` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/08-struktura-sajta.jsx` | урок | `25d5c8c6ff0da4ac7790dd63b7b7554e0cc15e29f8af7ebc6932822e46039404` | OGOH (0 / 2 / 4) | 290 / 290 / 289 | 350 / 300 / 373 | 20664 / 19062 / 20819 |
| `lessons/html/08p-struktura-sajta.jsx` | практика | `d2ac6c37813dd464bcb195349e360556ad0dbb0432659abbfeafcecc6ddde5ae` | OGOH (0 / 2 / 4) | 223 / 223 / 222 | 302 / 264 / 279 | 14549 / 13803 / 14577 |
| `lessons/html/08t1-struktura-sajta.jsx` | тест (savol) | `2a709ee59880a32cbfb9a11014f45b7dd6ed7e6ea1c4f096ca2a08964a51c382` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/08t2-struktura-sajta.jsx` | тест (savol) | `ad3b0285b00f0efff043f74789a5ae73f2e79e76e4161b135257a35faf2c9c54` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/08t3-struktura-sajta.jsx` | тест (savol) | `32e488fe0ddb2415be2bfe4d48d128946ab19176cac21db35297cfebc752f130` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/08t4-struktura-sajta.jsx` | тест (savol) | `de3875124a9542266b9d0df83496173f13ca4b481771c94e8f62bb89b63b224c` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/08t5-struktura-sajta.jsx` | тест (savol) | `b65499dcdca46b2abe1b4f13710504dfda021e6fae1ea96c32eaf673598d3311` | OGOH (0 / 1 / 4) | нет речи | — | — |
| `lessons/html/09-final-proekt.jsx` | урок | `c62e5eca88e3a2f33c50e6b4577338ea3ef59e9edd06d6ba3a7eec94c93292a0` | OGOH (0 / 2 / 4) | 252 / 252 / 251 | 323 / 281 / 310 | 16652 / 15480 / 16513 |
| `lessons/html/09p-final-proekt.jsx` | практика | `323a80b6cea85332f8488490fb2c9ac2ccac49af221c441b863fbb59f3ff2cc5` | OGOH (0 / 2 / 4) | 271 / 271 / 270 | 251 / 238 / 252 | 18395 / 17519 / 18916 |
