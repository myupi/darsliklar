# Реализация урока (шаг Г)

JSX — формат реализации. Тема урока может быть HTML, CSS или другой; механики урока HTML (код + мини-браузер) — частный случай.

## Контракт платформы (нарушать нельзя)

| Пункт | Правило |
|---|---|
| Файл | Один файл = один урок, `export default` корневой компонент |
| Пропсы | `{ studentName, lang, ttsApiBase, voiceGender, onFinished }`. Дев-пропсы `startAt`, `onExit` платформа не передаёт, но корень их принимает |
| Импорты | Только `react` (одна строка в каноне). Никаких `@lesson/runtime`, framer-motion, lucide, картинок, шрифтов |
| Язык | `lang`: `uz \| ru \| en`, иное — откат на `ru` (делает `useLessonRoot`) |
| Имя | `studentName` — только в видимом тексте («Автор: …»), никогда в озвучке |
| Голос | Первая строка корня — `setLmsVoice(voiceGender)` |
| Озвучка | Движок канона по `ttsApiBase`; маркер языка ставит движок; `lesson_id` и `lesson_name` — из `META` |
| Прогресс | `store` в памяти до конца урока, localStorage не используется |
| Журнал | `log({ screenId, type, correct, firstTry, attempts, … })` — одна строка на экран, только где ученик отвечал. Дополнительные поля разрешены (`hints`, `followUp`) |
| Финиш | `p.finish()` на последнем экране; `onFinished` ровно один раз (защиту даёт `useLessonRoot`) |
| Payload | Без оценки: заглушки `totalQuestions: null` … `passed: null` даёт канон; артефакт — через `extraPayload` |

## Где файл и как подключить

- **Урок:** `lessons/<курс>/<NN>-<slug>.jsx`, `NN` и `slug` — из `_course.js`. Строка в плане уже есть, и урок становится «готов» сам, как только появится файл.
- **Практика:** `lessons/<курс>/<NN>p-<slug>.jsx`. У курса `practice: true`, своё название — `practiceTitle` в строке урока.
- **Тестовый урок:** `lessons/test/<NN>-<slug>.jsx` и строка в `lessons/test/_course.js` (`{ n, slug, title, topics }`). Канон сверху всё равно ставится, `check-canon` тест не проверяет.
- **Сценарий:** `docs/scenarij-<NN>-<slug>.md`.
- **`META`:**
  - `lessonId: '<курс>-<NN>-<slug>'` (практика: `<курс>-<NN>p-<…>`);
  - `module` — как у соседних уроков (`html-m1-osnovy`): в `_course.js` модулей нет, новый модуль появляется только по решению заказчика;
  - `lessonTitle` на трёх языках.
- **Артефакт** (`extraPayload`):
  - одна страница — `{ type: 'html-page', title, …, html }`;
  - несколько связанных страниц (уроки ссылок, финальный проект) — `{ type: 'html-site', pages: [{ name, title, html }] }`.

  Поля урока можно добавлять (тема, вид списка), журнал канона их принимает. Состав артефакта описать в шапке урока.
- **Иконки карточек плана** (`MissionScreen`) — только из `ICONS` канона. Нужной нет (например, «ссылка») — взять близкую: `arrowR`, `browser`, `doc`, `pic`, `keyboard`. Новая иконка — это правка канона через сборку, только если без неё никак.

## Сборка файла

Канон (~6 500 строк) и помощники урока 2 (~700 строк) не перепечатываются руками. Пишешь только исходник урока, файл собирает скрипт:

```bash
node .claude/skills/novyy-urok/scripts/sobrat.mjs <исходник.jsx> lessons/html/<NN>-<slug>.jsx
```

Исходник держать в папке временных файлов (scratchpad) или рядом с проектом, но не в `lessons/`. Метки исходника:

```jsx
// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок N — «Название»
// Дети 11–14. Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК N · «Название» · модуль … =====
// ЗАМЫСЕЛ. …  ДУГА. …  ОСОБЫЕ ПРАВИЛА УРОКА · …  ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you».
// =============================================================================
const META = { … };
const L3 = (uz, ru, en) => ({ uz, ru, en });
const fillL = …;            // как в уроке 2 (поддерживает объект языков в подстановке)
const UI = { … };           // подписи интерфейса, нужны помощникам: inspector, check, erase, goal, save, saved, author, code, result, nextLesson
const C = { s1: { … }, … }; // все тексты урока
/*@L2_HELPERS@*/            // помощники курса HTML из урока 2
// расширения помощников для новых тегов (см. ниже), свои механики, экраны S1…Sn
const SCREENS = [ … ];
const SCREEN_RESET = { … };
export default function HtmlLessonNN(…) { … }
const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:urok-own.css@*/
`;
```

После сборки файл — обычный цельный урок, правки можно вносить прямо в него. Если исходник сохранён, правь исходник и пересобирай, чтобы версии не разошлись.

**Порядок слоёв** (бриф, «Архитектура файла»):
1. Канон, пометка «УРОК», шапка.
2. `META`.
3. `C` / `UI`.
4. Помощники курса.
5. `SPOKEN` / `NOT_SPOKEN_IN`.
6. Экраны.
7. `SCREENS` / `SCREEN_RESET`.
8. Корень.
9. `LESSON_CSS`.

## API канона (шпаргалка)

| Что | Как |
|---|---|
| Язык | `const pick = usePick(); pick(L3(...))`. Любой видимый текст — через `pick`: объект `{uz,ru,en}` в JSX роняет React (#31) |
| Голос экрана | `const [speaker, say, spoken, sayNow] = useVoice([{ text, pose }, …])`. `spoken` — очередь договорена. `sayNow(text, pose)` — реакция, вытесняет очередь |
| Гейты | `const canTap = useCanAnswer(spoken)` — ответы живы, когда Коди договорил (предохранитель 9 с). `const canGo = useAdvanceGate(solved, spoken)` — «Дальше» после разбора (20 с) |
| Подсказка места | `const led = useIdleLed(active, progressKey)` → `<Led on={led} />` на нужной кнопке; `progressKey` меняется при каждом шаге |
| Звук | `sfx('ok' \| 'soft' \| 'tap' \| 'pop' \| 'type' \| 'win' \| 'hint', true)` |
| Похвала | `nextPraiseL()`, `nextEncourageL()`, `joinL(a, b)` — склеить две реплики |
| Память | `const store = useStore(); store.get(k) / store.set(k, v)`; удобнее `const [rec, put] = useRec('sN')` из помощников |
| Журнал | `const log = useLog(); log({ screenId: 'sN', type, correct, firstTry, attempts })` |
| Экран | `<Stage eyebrow screen total speaker done hint nav voiceTop overlay hideSpeaker>`. `done` — экран отработал (пауза → «Повторить»); `hint` — что повторит лампочка (без символов) |
| Навигация | `nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}`; на последнем `onClick={p.finish}` и `label` |
| План урока | `const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />`, `C.s2 = { eyebrow, say, steps: [{ icon, text, say }], done }` |
| Корень | `useLessonRoot({ meta, total, studentName, lang, ttsApiBase, onFinished, startAt, onExit, extraPayload })` → `{ i, lang, audio, store, log, next, prev, go, finish, done, displayName, Shell, runN }` |
| Иконки | `<Icon name size />`: `check bulb undo save doc eye list listN browser textSize align bold star cup book pic note keyboard phone screen pc arrowR arrowL …` (список — `ICONS` в каноне) |
| Позы | `hello explain point think wonder smile cheer rule sorry sleep curious shy celebrate bye` |
| Механики канона | `HintLadder`, `Guess`, `Hotspots`, `PairMatch`, `YesNo`, `Reorder`, `DropZones`, `TapSort`, `OddOneOut`, `Quiz`, `FlashCards`, `MemoryPairs`, `Compare`, `Reflection`, `CoachMark`, `TourCards`. Контракт: `stored`, `canAnswer`, `onSay`, `onSolved` / `onResolved` |

## Помощники курса HTML (из урока 2, `/*@L2_HELPERS@*/`)

| Помощник | Назначение |
|---|---|
| `TAG_SAY`, `spokenHtml(text, lang)`, `SpokenTags` | Теги в озвучке словами. Обернуть экраны в `<SpokenTags>` (или своё расширение) |
| `SPOKEN`, `NOT_SPOKEN_IN`, `heroLines(C[id], lang)` | Какие ключи `C` — реплики (для прогрева озвучки). Шаблоны с `{x}` не прогреваются |
| `TAGC`, `tagColor(t)` | Цвета тегов |
| `txt`, `blk(id, tag, parts)`, `plain`, `escHtml`, `buildHtml(title, blocks)` | Модель блоков страницы и готовый HTML для артефакта |
| `hasLetters`, `hasTags`, `normTag`, `reduceMotion` | Проверки ввода; «меньше движения» |
| `toTokens`, `findRange`, `partsFrom`, `useWordSel`, `WordLine` | Слова-кнопки и выделение диапазона |
| `Tag`, `Tok`, `srcLines(blocks, { frame, title })`, `Src({ lines, zone, onZone, lineProps, className })` | Код. `lineProps(ln)` → `{ onTap, disabled, led, cls }` делает строку кнопкой; `zone(z)` → `{ tap, disabled, led, cls }` делает кнопкой токен |
| `Page({ blocks, flash, hl, fresh })`, `MiniBrowser({ title, page, hl, compact, cls })` | Страница и окно браузера |
| `Work({ browser, code, cls })` | Браузер + код: колонка на телефоне, ряд на ноутбуке |
| `Wire`, `DemoHand` | «Провод» код → результат; рука-демонстрация |
| `useLadder`, `LadderNote` | Ступени подсказки |
| `SegToggle` | Переключатель (только «подсмотреть код» на итоговой странице, не в заданиях) |
| `InlineInput({ value, onChange, placeholder, label, max, inputRef, onEnter, cls })` | Поле прямо в строке кода (16 px) |
| `useRec(id)`, `useOnce()`, `useShake()` → `[shake, wobble, alive]` | Память экрана, защёлка, тряска |
| `Inspector({ rules: [{ id, ok, text }] })` | Панель правил структуры |
| `useTagTyping`, `tagTypingIssue(typed, tag, msgs)`, `KeyRow({ keys, ty, canTap, onCheck, ready })` | Набор тега кнопками; `msgs = { needSlash, needLt, needGt, wrongName, generic }` |
| `LevelRow`, `GoalCard` | Кнопки уровня, карточка цели раунда |

Свою механику писать, только если ни канон, ни помощники не подходят. Тогда — по тому же контракту и с той же лесенкой.

## Бумажный набор эталона — урока 1 (`tools/kollazh/`)

Урок 1 «Бумажная страница» собирается тем же `sobrat.mjs`. Его бумажный набор — общий для курса: новый урок **подключает** файлы набора из `tools/kollazh/` через `/*@FILE:../kollazh/…@*/`, а не копирует их (подробно — `etalon-bumazhnaya.md`, раздел 7).

| Что нужно | Где в эталоне |
|---|---|
| Вырезка с рваным краем, фактурой и тенью; влёт, штамп, тряска, подсветка | `Cut` (`kollazh-kit.jsx`), классы `kz-a-*` (`kollazh.css`) |
| Лист с декором и параллаксом | `Sheet`, `useParallax` (в `kollazh-screens.jsx`) |
| Строка задания — бумажная полоска со счётчиком и ступенью подсказки | `KzAsk`, `useKzLadder`, `hintAt` |
| Теги-полоски на скотче, теги в коде | `KzLabel`, `TagK`, `T_`, `W_` |
| Код из бумажных полосок; поле в строке; места для перетаскивания; ▲▼ | `KzCode` (`lines[].place`, `lines[].move`, `lines[].after`) |
| Бумажный браузер «Chrome в Windows» с подсветкой вкладки и окна | `PaperBrowser` (`tabHl`, `pageHl`, `stamp`) |
| Перетаскивание с пунктирным следом, приподнятой копией, возвратом; запасное «нажми, потом место» | `useKzDrag`, `KzGhost`; экраны 5, 11, 13, 14 |
| Рука показывает новую механику | `KzHand`; экран 5 |
| Перелёт вырезки к месту результата | `kzFly`; экраны 1, 6 |
| Перестановка полоски как бумажки (▲▼) | экран 13 (`kz-slide-up`, `kz-slide-under`) |
| Переход между экранами «разбор и сборка» | `useKzTransition` (`kollazh-trans.jsx`) в корне урока |
| Шорох бумаги во время движения | `usePaperSound` (`kollazh-paper.jsx`), запись — `kollazh-paper-data.jsx` |
| Подсветка за речью: подсвечено то, о чём реплика | `speaker.text === c.<ключ>` в экране; длинную фразу — несколькими ключами (`magic` / `magicWin`, `order1…3`) |
| Вопрос каждого раунда голосом | экран 8 (`askOf`, `sayNow` при смене раунда) |
| Честная поломка и починка | экран 14 (текст до конца файла во вкладке без `</title>`) |

Решения именно урока 1 — `PaperMan`, `Frame`, `ManBox`, `PageBits`, `PageCollage`, `useMine`, `makeArtifact`: брать, только если подходят теме. Объёмные фигуры anatomy и механики прежнего урока 1 «Робот Пиксель» (`tools/robot/`, теперь тестовый 13) в новый урок не переносятся.

## Экран — каркас

```jsx
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!rec;                                 // «Назад» показывает решённое
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.why : c.say, pose: solved ? 'rule' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, misses);
  const answer = (x) => {
    if (!canTap || solved) return;
    tries.current += 1;
    if (x === c.want) {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's7', type: 'choose', correct: true, firstTry: misses === 0, attempts: tries.current });
      sayNow(joinL(c.ok, c.why), 'cheer');
      return;
    }
    const n = misses + 1; setMisses(n); sfx('soft', true);
    const m = c.hints[Math.min(n, 3) - 1];               // ступень растёт с промахами
    setMsg(m); sayNow(m, 'think');
  };
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className={'ask hook-ask' + (msg && !solved ? ' ask-hint' : '')}>{pick(msg && !solved ? msg : c.ask)}</p>
      {/* механика: Work + MiniBrowser + Src или своя; кнопки — disabled={!canTap}, <Led on={led} /> на месте действия */}
    </Stage>
  );
}
```

Корень — как в уроке 2:
- `setLmsVoice`;
- `useLessonRoot` с `extraPayload: (store) => ({ artifact: makeArtifact(store) })`;
- прогрев `R.audio.warm(heroLines(C[cur.id]) + heroLines(C[next]))` через ту же функцию произношения, что и в обёртке;
- `<R.Shell css={LESSON_CSS + CANON_UI_CSS}><SpokenTags>…<Comp key={cur.id + ':' + R.runN} p={p} />`.

**Имена `SCREENS` и `SCREEN_RESET` обязательны.** Канон (`useLessonRoot`, «Повторить») обращается к ним как к глобальным константам модуля: другое имя ломает повтор экрана.

`SCREEN_RESET[id]` перечисляет ключи `store`, которые стирает «Повторить» этого экрана. Работу ученика, которая нужна дальше (свой проект, `artifact`), туда не включать.

## Новые теги и понятия

Для тегов, которых нет в уроках 1–2:
- **Цвет:** `TAGC.<тег> = '#…'` — та же светлота, что у остальных; не оранжевый, не жёлтый, не зелёный.
- **Произношение на трёх языках:**
  ```js
  // названия тегов вслух — по-английски во всех языках
  Object.assign(TAG_SAY.ru, { ul: 'U L' });
  Object.assign(TAG_SAY.uz, { ul: 'U L' });
  Object.assign(TAG_SAY.en, { ul: 'U L' });
  ```
  `spokenHtml` читает только теги в угловых скобках и слова из своего списка. Голые имена новых тегов («ul», «href») надо заменить своей функцией-обёрткой и своим `SpokenX`-провайдером (по образцу `SpokenTags`). Её же использовать при прогреве.
- **Новые ключи реплик в `C`** добавить в `SPOKEN`: `Object.assign(SPOKEN, { myKey: 1 })`. Иначе они не прогреются. Подписи внутри реплик-объектов исключить через `NOT_SPOKEN_IN`.
- **Атрибуты** (`href`, `src`, `alt`) в модели строк кода — отдельный токен со своим цветом. Превью показывает результат честно: ссылка подчёркнута и синяя, картинка без `src` — пустая рамка с текстом `alt`.

## Ловушки, которые уже ломали уроки

Полный список — бриф, «Запреты и ошибки». Чаще всего:
- **Объект `{uz,ru,en}` прямо в JSX** — падение React #31.
- **`opacity: 0` на появлении экрана** — белый экран.
- **Классы без префикса урока** (`opts`, `keys`, `pending`, `cmp`) пересекаются с каноном.
- **Склейка или правка по строке без уникального якоря** — часть файла задваивается. Проверять, что якорь один.
- **Номера строк из прошлой сессии устарели** — искать по якорю.
- **Заполненное заранее поле** засчитывает шаг без участия ученика: только `placeholder`.
- **Строка, которую ученик собирает или пишет сам, не содержит готовых частей ответа.** Пример: в строке «собери `<li>…</li>`» уже стояли `<li>` и `</li>` (заказчик: «и так есть li, почему снова просит»). Пустая строка показывает только гнёзда, теги появляются, когда ученик их ставит. Проверять глазами: видно ли на экране то, что просят сделать.
- **Таймер, который продолжает раунд, пока Коди ещё говорит,** обрывает реплику. Ждать `spoken` (флаг `pending` + эффект на `spoken`).
- **Голос после каждого промежуточного шага** запирает касания.
- **`MarkBtns` урока 2 ссылается на `C.s11.look`** — сборщик его вырезает. Не возвращать без своих данных.
- **В Python и sed неразрывный пробел ` `** записывается в файл символом, а не escape-последовательностью. Учитывать при заменах.
- **Перед браузером — проверка неопределённых имён** (Vite их не ловит):
  ```bash
  npx --yes eslint@8 --no-eslintrc --no-inline-config --parser-options=ecmaVersion:2022,sourceType:module,ecmaFeatures:{jsx:true} --rule '{"no-undef":"error"}' --env browser,es2022 <урок.jsx>
  ```
  Ошибки выше пометки «УРОК» (в каноне) не относятся к уроку.
