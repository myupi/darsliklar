// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Списки» — урок 3 курса HTML, проба 2 («Гайд по игре»)
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node .claude/skills/novyy-urok/scripts/sobrat.mjs
//   tools/spiski2/spiski2.src.jsx lessons/test/05-spiski-2.jsx
// Правится исходник tools/spiski2/ (spiski2.src.jsx, ls-own.css), а не этот файл.
// =============================================================================
// =============================================================================
// КУРС «HTML» — КАНОН УРОКОВ v1 · дети 8–10 лет · UZ / RU / EN
//
// Всё, что стоит выше пометки «УРОК», — общий канон курса. Он одинаков во всех
// уроках и копируется ДОСЛОВНО. Внутри урока канон не правится: нужна правка —
// она вносится в canon/html/canon-v1.jsx и разносится по всем урокам курса.
// Проверка совпадения: node tools/check-canon.mjs.
//
// ИЗ ЧЕГО СОБРАН (по «Брифу для ИИ: структура, дизайн и функции детского урока»):
//   · основа — канон Курса 0 «Компьютерная грамотность»: токены, система
//     движения героя, язык, озвучка, гейты, похвала, каркас экрана, иконки,
//     подсказки, лесенка подсказок, коуч-марк, базовый CSS, корень урока,
//     библиотека механик и типовые экраны;
//   · озвучка — родной движок Курса 0 (разделы 4 и 5 целиком): сервис озвучки
//     по адресу ttsApiBase, как в уроках Курса 0 и 1-го класса (заказчик,
//     12.10.2026; раньше здесь стоял переходник на @lesson/runtime из
//     «Кибербеза»). Без ttsApiBase урок говорит голосом браузера, а если нет
//     и его — печатает реплики текстом;
//   · герой — Коди, робот Junior IT Akademiya (раздел 2). Система движения —
//     дословно Курса 0;
//   · цвет интерфейса — #FF4F28 (заказчик, 12.10.2026) вместо голубого Курса 0.
//     Заменены токены ui / blue и голубые rgba(30,136,229,…) в стилях канона,
//     тёмные оттенки (uiDk, blueDk, hint) доведены до контраста 4.5:1;
//     всё остальное в стилях — дословно.
//
// СКЛЕЙКА. Относительно Курса 0 изменено ровно одно место, оно помечено
// «СКЛЕЙКА»: прогресс живёт в памяти до конца урока, localStorage не
// используется (бриф, «Контракт с платформой»).
// Не перенесено из Курса 0: кино «карты модуля» (рисунок Курса 0) и пустой
// заголовок «песочницы-редактора» без кода.
//
// КОНТРАКТ УРОКА
//   props: { studentName, lang, ttsApiBase, voiceGender, onFinished }
//   · ttsApiBase — база сервиса озвучки:
//     GET {ttsApiBase}/api/tts?text=…&g=f&lesson_id=…&lesson_name=… отдаёт
//     (кодирование — как у эталона математики: пробел %20, скобки маркера как есть)
//     звук, HEAD по тому же адресу заранее синтезирует фразу (прогрев).
//     lesson_id и lesson_name берутся из META урока (название — на языке
//     ученика); student_uuid LMS уроку не передаёт
//   · маркер языка в начале реплики: [O'zbekcha tallaffuz] /
//     [Русское произношение] / [English pronunciation]
//   · дев-пропсы startAt (открыть урок на экране N) и onExit (кнопка выхода
//     на витрине) платформа не передаёт
//   · все тексты — объекты { uz, ru, en }, переводятся внутри компонентов
//   · каждая реплика уходит в сервис с маркером языка в начале строки
//   · имя ученика — только в видимом тексте, в озвучку не попадает
//   · onFinished(payload) — РОВНО один раз; после финиша урок рисует только фон
// =============================================================================

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useLayoutEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. ДИЗАЙН-ТОКЕНЫ
// Палитра совпадает с Кибербезом: ребёнок переходит из Курса 0 в Модуль 1 и не
// должен почувствовать, что попал в другой продукт. Герои у курсов разные, но
// цвет, типографика и ритм — общие, и именно они держат ощущение одной линейки.
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg: '#F6F4EF',
  paper: '#FFFFFF',
  ink: '#0E0E10',
  ink2: '#5A5A60',
  ink3: '#A7A6A2',
  accent: '#FF4F28',        // основной акцент курса
  accentSoft: '#FFE8E1',
  accentDk: '#D63B16',
  // ЦВЕТ ИНТЕРФЕЙСА — голубой (заказчик, 27.09.2026: «qizil xuddi xato
  // rangdek ko‘rinyapti»). Им красятся кнопки, полоса прогресса, подсветка,
  // рамки выбора и рубашки карточек — всё, что в CSS. Оранжевый accent
  // остался только в рисунках: голос называет их по цвету («to‘q sariq
  // papka»), и перекрашивать рисунки значило бы врать голосом.
  // КУРС HTML: интерфейс — #FF4F28 (заказчик, 12.10.2026), а не голубой.
  ui: '#FF4F28',
  uiSoft: '#FFE8E1',
  uiDk: '#B94127',
  blue: '#EF6A4A',          // спокойный вспомогательный
  blueSoft: '#FFEDE6',
  blueDk: '#B94127',
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  wrong: '#E0543F',
  wrongSoft: '#FFE3DF',
  hint: '#8D5E00',          // подсказка — отдельный канал, НЕ «ошибка»
  hintSoft: '#FFF6E0',
  // Условный редактор (песочница M9). Серые тона намеренно тусклее палитры
  // урока: панель инструментов — фон, а не герой экрана.
  uiBar: '#ECEAE5',
  uiEdge: '#D8D4CC',
  shadowBase: '58, 53, 48'  // тени задаются через rgba(${T.shadowBase}, a)
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ПЕРСОНАЖ — КОДИ, робот Junior IT Akademiya, герой курса «HTML»
//
// Образ по листу заказчика (вид спереди, сзади, сбоку): кремовая округлая
// голова-шлем из матового винила, тёмный стеклянный экран-лицо в медной рамке,
// на экране светятся пиксельные глаза и рот, по бокам медные уши-вставки.
// Тёмно-синий вязаный свитер с надписью JUNIOR IT · AKADEMIYA, кремовые
// руки-варежки и короткие ноги — так на листе; в уроках с v4 видна только
// голова, а тёмно-синий цвет свитера остался у кружка вокруг неё.
//
// РИСУНОК v4 (17.10.2026, заказчик): ОСТАЛАСЬ ТОЛЬКО ГОЛОВА В КРУГЕ. Тело,
// руки и ноги убраны, чтобы место занимал контент, а не робот. Голова v3
// (широкий шлем, медная рамка экрана почти во весь шлем, глаза-точки, рот-
// дуга, уши-вставки вровень с силуэтом) стоит в белом кружке. Пока Коди
// говорит, вокруг кружка бегут хаотичные оранжевые волны, как у Алисы и Siri
// (KodiWaves в hero-tail). Ученик ничего не делает — лицо само меняет
// выражение (useKodiMood). Место: на телефоне — в шапке у подсказки, на
// планшете и компьютере — справа снизу над нижней панелью (build-canon.mjs,
// swapKodiHead).
// Тот же кружок с головой — и в шапке экрана, когда урок ставит Stage voiceTop.
// Прежний рисунок с телом (v3) — в истории гита.
//
// РИСУЕТСЯ КОДОМ, как робот Курса 0: урок автономен, поза меняется параметром,
// цвета лежат здесь. Позы — та же система канона, но у головы в круге они
// меняют только лицо: форму и размер глаз, взгляд, веки, рот, румянец и цвет
// свечения экрана. Голова не качается и не прыгает: эмоцию показывает лицо.
//
// ЖИЗНЬ ЛИЦА — собственный слой Коди (KODI_CSS) поверх системы движения:
//   · взгляд — глаза иногда переводятся в сторону и возвращаются;
//   · моргание — глаза сжимаются по вертикали, как пиксели дисплея;
//   · рот меняет форму вместе с состоянием: улыбка, радость, «о», ровный рот
//     в грусти, кривая усмешка, когда Коди думает;
//   · речь — рот «говорит», полоски в ушах пульсируют;
//   · стекло — по экрану изредка пробегает блик.
// Слой подчиняется паузе урока и настройке «меньше движения».
//
// ОШИБКА. Герой один, поэтому на неверный ответ ребёнка он показывает 'think' —
// «давай посмотрим вместе». Поза 'sorry' — только когда промахнулся сам Коди.
// ─────────────────────────────────────────────────────────────────────────────
const BOT = {
  head:      '#F3EFE6',   // кремовый матовый винил
  headMid:   '#E7E1D4',
  headDk:    '#CBC2AF',   // теневая сторона
  edge:      '#B9AE99',
  rim:       '#C8742F',   // медь: рамка экрана и уши
  rimLt:     '#F4B57C',
  rimDk:     '#8C4A1E',
  visor:     '#0A0F12',   // стекло экрана по краям
  visorMid:  '#18242B',   // стекло экрана в центре
  sweater:   '#24324F',   // тёмно-синий свитер
  sweaterLt: '#33466D',
  sweaterDk: '#182238',
  shoe:      '#2C3D62',   // кеды — тот же синий, чуть светлее свитера
  shoeDk:    '#1A2541',
  sole:      '#EDE7DB',   // подошва — кремовая, как варежки
  label:     '#FF4F28',   // плашка AKADEMIYA — тот же оранжевый, что интерфейс курса
  blush:     '#FF8FB0',
  shadow:    '#1C2433'
};

// ─────────────────────────────────────────────────────────────────────────────
// СИСТЕМА ДВИЖЕНИЯ (моушн-лист заказчика, 2026-08-25)
//
// Раньше герой умел одно: несколько бесконечных покачиваний, одинаковых во всех
// состояниях. Разница между «объясняю» и «радуюсь» держалась только на форме
// глаз. Заказчик выдала полноценный моушн-лист, и он устроен принципиально
// иначе — каждое состояние это ТРИ вещи сразу:
//
//   ПОЗА    — куда встали тело, голова, руки, глаза и веки. Меняется через
//             transition, поэтому переход между состояниями плавный.
//   ТАКТ    — что повторяется, пока состояние держится: подскок, оседание,
//             дрожь, взмах. Это @keyframes на ВЛОЖЕННОЙ группе, чтобы такт не
//             затирал позу и наоборот.
//   ТАЙМИНГ — своя длительность и своя кривая. Радость 280 мс с перелётом,
//             грусть 900 мс без перелёта вовсе, злость 150 мс и жёстко.
//
// Почему слои вложены, а не совмещены. Одна и та же группа не может нести и
// transition позы, и бесконечную анимацию такта: анимация побеждает и поза
// перестаёт работать. Поэтому у тела, головы и рук по два узла — pose и beat.
//
// Правило трёх слоёв: первичное движение (корпус), вторичное с задержкой
// 90–140 мс (руки, голова) и фоновое (парение, свечение). Именно сдвиг
// вторичного слоя и читается как «живой», а не амплитуда.
//
// ЧЕГО ЗДЕСЬ НЕТ. В листе есть «злость» и «страх». В Курс 0 они не берутся:
// мастер-ТЗ (раздел 2.9) запрещает пугающее и обвиняющее, а герой не имеет
// права сердиться на ребёнка. Грусть используется РОВНО ОДИН раз — когда
// ошибается сам робот (пролил кипяток в пятнадцатом уроке), и никогда в ответ
// на действие ребёнка.
// ─────────────────────────────────────────────────────────────────────────────

// Нейтральная поза. Каждое состояние переопределяет только то, что меняет.
const POSE0 = {
  bodyX: 0, bodyY: 0, bodyRot: 0, bodySX: 1, bodySY: 1,
  headX: 0, headY: 0, headRot: 0,
  armLX: 0, armLY: 0, armLR: 0, armRX: 0, armRY: 0, armRR: 0,
  eyeSX: 1, eyeSY: 1, eyeX: 0, eyeY: 0,
  lidY: 0, lidRotL: 0, lidRotR: 0,
  blush: 0, glow: 0.55, shadowS: 1, shadowO: 0.16
};
const withPose = (o) => Object.assign({}, POSE0, o);

// Единицы измерения переменных позы: без них CSS не поймёт число.
const POSE_UNIT = {
  bodyX: 'px', bodyY: 'px', bodyRot: 'deg', headX: 'px', headY: 'px', headRot: 'deg',
  armLX: 'px', armLY: 'px', armLR: 'deg', armRX: 'px', armRY: 'px', armRR: 'deg',
  eyeX: 'px', eyeY: 'px', lidY: 'px', lidRotL: 'deg', lidRotR: 'deg'
};

// СОСТОЯНИЯ. Имена — по ситуации урока, а не по эмоции: экран говорит «покажи
// „смотри сюда“», а не «покажи интерес». Так экран не обязан помнить, какой
// эмоцией это выражается.
// АКЦЕНТ ГЕРОЯ — ЧЕТЫРЕ ЦВЕТА НА ВЕСЬ КУРС, И КАЖДЫЙ ЧТО-ТО ЗНАЧИТ.
//
// Заказчик: «робот меняет цвет каждые 3–4 секунды и при смене текста; так
// делать не нужно — цвет должен зависеть от эмоции». Раньше свой акцент был у
// каждой из тринадцати поз, а поза меняется на каждой реплике: объяснил синим,
// показал зелёным, разобрал салатовым. Мигание читалось как сбой, а не как
// чувство.
//
// Теперь цвет один на всю спокойную речь, и он меняется ТОЛЬКО когда меняется
// состояние героя. Движение при этом у каждой позы своё — жизнь держится на
// нём, а не на цвете.
const BOT_CALM = '#1466FF';    // объясняет, показывает, разбирает, думает, здоровается, прощается
const BOT_GLAD = '#FFC53D';    // улыбается, хвалит, ликует
const BOT_WOW  = '#00C2D6';    // удивился — единственный «ого!» в сцене
const BOT_DIM  = '#8A93A6';    // огорчился сам · выключен

const POSE_SET = {
  // Спокойный рассказ. Базовое состояние листа.
  explain: {
    eyes: 'round', loop: 'loop-bob', dur: 320, loopMs: 2600, accent: BOT_CALM,
    ease: 'cubic-bezier(.175,.885,.32,1.275)',
    pose: withPose({ bodyY: -4, armLR: 6, armRR: -6, glow: 0.7 })
  },
  // «Смотри сюда»: корпус подаётся вперёд, рука показывает.
  point: {
    eyes: 'round', loop: 'loop-lean', dur: 380, loopMs: 3200, accent: BOT_CALM,
    ease: 'cubic-bezier(.34,1.3,.64,1)',
    pose: withPose({ bodyRot: -4, headRot: -12, headX: -4, armRR: -112, armRX: -44,
      armLR: 6, eyeSX: 1.05, eyeSY: 1.05, eyeX: 4, glow: 0.75 })
  },
  // Разбор «почему так»: тихое раскрытие, самое спокойное состояние листа.
  rule: {
    eyes: 'round', loop: 'loop-open', dur: 900, loopMs: 4400, accent: BOT_CALM,
    ease: 'cubic-bezier(.4,0,.2,1)',
    pose: withPose({ bodyY: -2, armLR: 22, armLX: -4, armRR: -22, armRX: 4,
      eyeSY: 0.95, lidY: 6, blush: 0.35, glow: 0.7 })
  },
  // «Разберёмся вместе»: качание и постукивание рукой.
  think: {
    eyes: 'round', loop: 'loop-ponder', dur: 700, loopMs: 3600, accent: BOT_CALM,
    ease: 'cubic-bezier(.4,0,.2,1)',
    pose: withPose({ headRot: 10, headX: 6, armRR: 112, armRX: 34, armRY: 10, armLR: 6,
      eyeY: -5, eyeX: -6, lidY: 14, eyeSY: 0.85, glow: 0.5 })
  },
  // «Ого!»: мгновенное расширение, зрачки кольцами.
  wonder: {
    eyes: 'ring', loop: 'loop-pop', dur: 220, loopMs: 2200, accent: BOT_WOW,
    ease: 'cubic-bezier(.16,1,.3,1)',
    pose: withPose({ bodyY: -14, bodySX: 0.96, bodySY: 1.06, armLR: 26, armRR: -26,
      armLX: -6, armRX: 6, eyeSX: 1.12, eyeSY: 1.12, glow: 0.95 })
  },
  // «Получается»: двойной прыжок, глаза-дуги.
  smile: {
    eyes: 'arc', loop: 'loop-hop', dur: 280, loopMs: 2400, accent: BOT_GLAD,
    ease: 'cubic-bezier(.175,.885,.32,1.275)', noBlink: true,
    pose: withPose({ bodyY: -8, armLR: -118, armLX: -27, armRR: 118, armRX: 27, glow: 0.8 })
  },
  // Похвала: пик листа — прыжок, глаза-звёзды, искры со сдвигом 140 мс.
  cheer: {
    eyes: 'star', loop: 'loop-cheer', dur: 300, loopMs: 2600, accent: BOT_GLAD,
    ease: 'cubic-bezier(.175,.885,.32,1.4)', noBlink: true,
    pose: withPose({ bodyY: -16, bodySX: 0.96, bodySY: 1.06, armLR: 152, armLY: -6,
      armRR: -152, armRY: -6, glow: 1 })
  },
  // Финал урока: то же ликование. Отдельное имя нужно экранам, а не роботу.
  celebrate: {
    eyes: 'star', loop: 'loop-cheer', dur: 300, loopMs: 2600, accent: BOT_GLAD,
    ease: 'cubic-bezier(.175,.885,.32,1.4)', noBlink: true,
    pose: withPose({ bodyY: -16, bodySX: 0.96, bodySY: 1.06, armLR: 152, armLY: -6,
      armRR: -152, armRY: -6, glow: 1 })
  },
  // Приветствие: рука выносится по дуге и машет три раза за цикл.
  hello: {
    eyes: 'round', loop: 'loop-wave', dur: 420, loopMs: 2700, accent: BOT_CALM,
    ease: 'cubic-bezier(.34,1.56,.64,1)',
    pose: withPose({ bodyRot: -2, armRR: -158, armRY: -4, armLR: 6, eyeSY: 0.95, glow: 0.85 })
  },
  // Прощание: то же движение, но как уход — ускоряющаяся кривая и дрейф.
  bye: {
    eyes: 'round', loop: 'loop-bye', dur: 520, loopMs: 3400, accent: BOT_CALM,
    ease: 'cubic-bezier(.3,0,1,1)',
    pose: withPose({ bodyRot: 4, bodyY: -6, headRot: 8, headX: 6, armRR: -150, armRX: -6,
      armRY: -2, armLR: 10, eyeX: 6, eyeSY: 0.88, lidY: 8, glow: 0.5 })
  },
  // Любопытство: крен на 24°, руки отстают на 90 мс — это и есть follow-through.
  curious: {
    eyes: 'round', loop: 'loop-peer', dur: 460, loopMs: 3000, accent: BOT_CALM,
    ease: 'cubic-bezier(.34,1.2,.64,1)',
    pose: withPose({ bodyRot: -24, bodyY: 6, headRot: -10, headX: -6, armLR: 34, armRR: 40,
      armLY: 14, armRY: 18, eyeSX: 1.1, eyeSY: 1.1, eyeX: 6, eyeY: 2, glow: 0.9 })
  },
  // Смущение: отведённый взгляд и румянец с задержкой 80 мс.
  shy: {
    eyes: 'round', loop: 'loop-fidget', dur: 800, loopMs: 3000, accent: BOT_CALM,
    ease: 'cubic-bezier(.4,0,.2,1)',
    pose: withPose({ bodyRot: -3, headRot: -14, headX: -8, armLR: -96, armLX: -37, armLY: -7,
      armRR: 96, armRX: 37, armRY: -7, eyeX: -8, eyeSY: 0.8, lidY: 12, blush: 1, glow: 0.6 })
  },
  // ВЫКЛЮЧЕН. Нужна ровно один раз за курс — в первом уроке, до того как
  // ребёнок включит свет. Веки опущены полностью, свечение погашено в ноль,
  // корпус осел: робот не спит, он именно НЕ РАБОТАЕТ. Это и есть первый кадр
  // курса, и говорить в нём некому — реплики начинаются после щелчка.
  sleep: {
    eyes: 'round', loop: 'loop-sag', dur: 900, loopMs: 5200, accent: BOT_DIM,
    ease: 'cubic-bezier(.65,0,.35,1)',
    pose: withPose({ bodyY: 12, bodySX: 1.04, bodySY: 0.96, headY: 12, headRot: 8,
      armLR: 10, armRR: -10, armLY: 10, armRY: 10,
      lidY: 62, eyeSY: 0.9, glow: 0, shadowS: 1.06, shadowO: 0.2 })
  },
  // ОШИБСЯ САМ РОБОТ. Единственное «тяжёлое» состояние в курсе, и оно НИКОГДА
  // не показывается в ответ на действие ребёнка — только когда промахнулся
  // герой: пролил кипяток, перепутал шаги, оформил через край.
  sorry: {
    eyes: 'round', loop: 'loop-sag', dur: 900, loopMs: 4200, accent: BOT_DIM,
    ease: 'cubic-bezier(.65,0,.35,1)',
    pose: withPose({ bodyY: 10, bodySX: 1.03, bodySY: 0.97, headY: 6, armLR: 8, armRR: -8,
      armLY: 10, armRY: 10, eyeSY: 0.8, eyeY: 4, lidY: 16, lidRotL: -14, lidRotR: 14,
      glow: 0.3, shadowS: 1.06, shadowO: 0.2 })
  }
};

// Имена поз. Значение совпадает с ключом: POSES нужен, чтобы экраны не писали
// строки руками и опечатка ловилась сразу, а не превращалась в пустого робота.
const POSES = {
  hello:     'hello',      // машет — приветствие
  explain:   'explain',    // спокойно рассказывает
  point:     'point',      // подался вперёд, рука показывает — «смотри сюда»
  think:     'think',      // качается, постукивает — «разберёмся»
  wonder:    'wonder',     // выстрел вверх, глаза-кольца — «ого, что это?»
  smile:     'smile',      // двойной прыжок, глаза-дуги — «получается»
  cheer:     'cheer',      // прыжок, звёзды, искры — похвала
  rule:      'rule',       // тихое раскрытие — разбор «почему так»
  sorry:     'sorry',      // осел, веки вниз — ошибся САМ РОБОТ
  sleep:     'sleep',      // выключен: веки закрыты, свечения нет
  curious:   'curious',    // крен набок — «что там такое»
  shy:       'shy',        // отвернулся, румянец
  celebrate: 'celebrate',  // финал урока
  bye:       'bye'         // уходит и машет
};

// Голос один — женский. Причин две, обе практические:
//   · в системах для русского почти всегда стоит ровно один голос, и он женский
//     (macOS — Милена). Просить мужской означает взять её же и «понизить»
//     питчем, а это слышно как искажение, а не как другой голос;
//   · ребёнку 8–10 лет женский голос разборчивее на длинной дистанции.
const VOICE = { bot: 'f' };
// Героя зовут Коди (заказчик, 12.10.2026). Имя звучит в первом уроке курса,
// на экране оно не подписывается.
const BOT_NAME = { uz: 'Kodi', ru: 'Коди', en: 'Kodi' };

// Свечение лица Коди. Состояния системы движения несут свои акценты
// (BOT_CALM, BOT_GLAD …); у Коди экран светится по-своему, поэтому акцент
// состояния переводится в цвет его дисплея.
const KODI_GLOW = {
  [BOT_CALM]: '#58F4F2',   // спокойно — яркая бирюза, как на листе лица заказчика
  [BOT_GLAD]: '#FFD24A',   // радость — жёлтый
  [BOT_WOW]:  '#7FEFFF',   // «ого» — светло-голубой
  [BOT_DIM]:  '#7E8A99'    // грусть, выключен — серый
};

// ─────────────────────────────────────────────────────────────────────────────
// КОДИ v4 — ТОЛЬКО ГОЛОВА В КРУГЕ (заказчик, 17.10.2026)
//
// «Пусть у Коди остаётся только голова, все эмоции показывает лицо. Голову —
// внутрь кружка, а вокруг кружка, пока он говорит, — волны, как у Алисы и
// Siri, всегда хаотичные. Больше места — контенту, а не роботу».
//   · тела, рук и ног больше нет: строка героя в уроке стала ниже вдвое;
//   · эмоция — только лицо: глаза (точки, дуги, звёзды, кольца), веки, рот,
//     румянец и цвет свечения экрана берутся из той же системы поз канона;
//     голова в круге не качается и не прыгает;
//   · кружок — белый (заказчик, 17.10.2026: «фон головы — белый»); голова
//     занимает 90%;
//   · волны голоса — три полупрозрачных оранжевых контура за кружком, цвет
//     интерфейса курса (заказчик: «волны — оранжевые, как основной цвет»). Пока
//     звучит голос, их форма, размах и вращение меняются случайно, «по
//     слогам» (KodiWaves); замолчал — волны прячутся за кружок;
//   · не стоит без дела (заказчик: «не как АФК»): если ученик ничего не
//     делает, а Коди молчит, лицо само меняет выражение — улыбается,
//     задумывается, оглядывается, удивляется, а потом задрёмывает (useKodiMood).
//     Голоса при этом нет.
// ─────────────────────────────────────────────────────────────────────────────

// ЖИЗНЬ ЛИЦА — собственный слой Коди поверх системы поз канона.
// Классы состояний (eyes-*, loop-*, is-talking, no-blink) ставит RobotSVG,
// поэтому слой знает, что сейчас чувствует герой, не спрашивая экран.
// Все циклы медленнее 3 Гц; пауза урока и «меньше движения» их останавливают.
const KODI_CSS = `
.kodi-av { position: relative; display: block; width: 100%; aspect-ratio: 1 / 1; }
.kodi-disc { position: absolute; inset: 0; border-radius: 50%; overflow: hidden;
  background: radial-gradient(circle at 50% 28%, #FFFFFF 0%, #FFFFFF 58%, #F3F0EA 100%);
  box-shadow: inset 0 0 0 1.5px rgba(28,36,51,.08), 0 8px 18px -10px rgba(28,36,51,.45); }
.kodi-disc > .bot { position: absolute; inset: 0; display: block; width: 100%; height: 100%; overflow: visible; }
/* Волны голоса: за кружком, шире его на треть с каждой стороны. */
.kodi-waves { position: absolute; left: -30%; top: -30%; width: 160%; height: 160%;
  overflow: visible; pointer-events: none; }
.kodi-wave { opacity: .34; }
.kodi-wave-2 { opacity: .42; }
.kodi-wave-3 { opacity: .5; }
/* Тонкое оранжевое кольцо — пока звучит голос, и при «меньше движения»
   оно одно показывает, что Коди говорит. */
.kodi-ring { fill: none; stroke: #FF4F28; stroke-width: 2.2; opacity: 0; transition: opacity .3s ease; }
.kodi-av.is-talking .kodi-ring { opacity: .7; }

.kodi .kodi-gaze { animation: kodiGaze 7.2s cubic-bezier(.3,0,.2,1) infinite; }
@keyframes kodiGaze {
  0%, 34% { transform: translate(0, 0); }
  37%, 52% { transform: translate(-5px, 1px); }
  55%, 70% { transform: translate(4px, -1px); }
  73%, 100% { transform: translate(0, 0); }
}
.kodi.loop-sag .kodi-gaze, .kodi.loop-lean .kodi-gaze { animation: none; }
.kodi .kodi-blink { transform-origin: 50% 50%; animation: kodiBlink 5.4s linear infinite; }
@keyframes kodiBlink {
  0%, 94% { transform: scaleY(1); }
  95.6% { transform: scaleY(.08); }
  97.4%, 100% { transform: scaleY(1); }
}
.kodi.no-blink .kodi-blink { animation: none; }

.kodi .kodi-m { opacity: 0; transition: opacity .2s ease; }
.kodi .kodi-m-smile { opacity: 1; }
.kodi.eyes-arc .kodi-m-smile, .kodi.eyes-star .kodi-m-smile, .kodi.eyes-ring .kodi-m-smile,
.kodi.loop-sag .kodi-m-smile, .kodi.loop-ponder .kodi-m-smile { opacity: 0; }
.kodi.eyes-arc .kodi-m-open, .kodi.eyes-star .kodi-m-open { opacity: 1; }
.kodi.eyes-ring .kodi-m-o { opacity: 1; }
.kodi.loop-sag .kodi-m-flat { opacity: 1; }
.kodi.loop-ponder .kodi-m-side { opacity: 1; }
.kodi .kodi-mouth { transform-origin: 50% 35%; filter: drop-shadow(0 0 3px var(--accent)); }
.kodi.is-talking .kodi-mouth { animation: kodiTalk .48s ease-in-out infinite; }
@keyframes kodiTalk {
  0%, 100% { transform: scale(1, 1); }
  25% { transform: scale(.93, 1.55); }
  50% { transform: scale(1.04, .82); }
  75% { transform: scale(.97, 1.3); }
}

.kodi .kodi-ear { opacity: .22; transition: opacity .3s ease; }
.kodi.is-talking .kodi-ear { animation: kodiEar .9s ease-in-out infinite; }
@keyframes kodiEar { 0%, 100% { opacity: .3; } 50% { opacity: .95; } }

.kodi .kodi-glare { animation: kodiGlare 6.8s ease-in-out infinite; }
@keyframes kodiGlare {
  0%, 68% { transform: translateX(-80px); }
  88%, 100% { transform: translateX(200px); }
}

.speaker-av .kodi-av { transition: transform .22s cubic-bezier(.34,1.56,.64,1); }
.speaker-av:active .kodi-av { transform: scale(.93); }

@media (prefers-reduced-motion: reduce) {
  .kodi .kodi-gaze, .kodi .kodi-blink, .kodi .kodi-glare,
  .kodi.is-talking .kodi-mouth, .kodi.is-talking .kodi-ear { animation: none !important; }
  .kodi .kodi-glare { display: none; }
}
`;

// Градиенты и обтравка объявляются внутри каждого экземпляра, поэтому им нужны
// разные имена: на экране бывает два Коди сразу (в строке героя и в шапке).
let _botUid = 0;

// ВОЛНЫ ГОЛОСА — как у Алисы и Siri, всегда хаотичные. Три оранжевых контура вокруг
// кружка: радиус каждого — сумма трёх синусоид с разным числом горбов. Пока
// звучит голос, через случайные 90–320 мс («слог») меняются громкость, вес и
// число горбов синусоид и направление их бега; слои ещё и вращаются с разной
// скоростью — рисунок не повторяется. Замолчал — волны плавно уходят за кружок
// и цикл засыпает. Атрибуты пишутся прямо в узлы, React кадры не
// перерисовывает. «Меньше движения» — волн нет, о голосе говорит кольцо.
const kodiCalm = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// amp — множитель размаха: у маленького кружка в шапке телефона волны крупнее,
// иначе их не разглядеть.
function KodiWaves({ on, amp = 1 }) {
  const ref = useRef(null);
  const onRef = useRef(on);
  onRef.current = on;
  const ampRef = useRef(amp);
  ampRef.current = amp;
  const kick = useRef(() => {});
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    const R = 50, N = 36, TAU = Math.PI * 2;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const layers = Array.prototype.slice.call(svg.querySelectorAll('.kodi-wave')).map((p, i) => ({
      p, rot: rnd(0, TAU), spin: rnd(-0.6, 0.6), gain: [1, 0.86, 0.94][i] || 0.8,
      comps: [0, 1, 2].map(() => ({ k: 2 + Math.floor(rnd(0, 5)), ph: rnd(0, TAU),
        sp: rnd(0.8, 2.6) * (Math.random() < 0.5 ? -1 : 1), a: 0, at: rnd(0.3, 1) }))
    }));
    const f1 = (v) => v.toFixed(1);
    const draw = (l, amp) => {
      const pts = [];
      for (let j = 0; j < N; j += 1) {
        const t = (j / N) * TAU;
        let sum = 0, w = 0;
        l.comps.forEach((c) => { sum += c.a * Math.sin(c.k * t + c.ph); w += c.a; });
        const f = w > 0.001 ? 0.5 + 0.5 * (sum / w) : 0.5;
        const r = R - 1 + amp * (0.15 + 0.85 * f);
        pts.push([r * Math.cos(t + l.rot), r * Math.sin(t + l.rot)]);
      }
      let d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
      for (let j = 0; j < N; j += 1) {
        const p0 = pts[(j + N - 1) % N], p1 = pts[j], p2 = pts[(j + 1) % N], p3 = pts[(j + 2) % N];
        d += 'C' + f1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f1(p1[1] + (p2[1] - p0[1]) / 6) + ' '
          + f1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
      }
      l.p.setAttribute('d', d + 'Z');
    };
    let energy = 0, target = 0, nextAt = 0, last = 0, raf = 0;
    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const talking = !!onRef.current;
      if (now >= nextAt) {
        target = talking ? rnd(0.3, 1) : 0;
        nextAt = now + rnd(90, 320);
        layers.forEach((l) => l.comps.forEach((c) => {
          c.at = rnd(0.15, 1);
          if (Math.random() < 0.3) c.k = 2 + Math.floor(rnd(0, 5));
          if (Math.random() < 0.2) c.sp = -c.sp;
        }));
      }
      energy += (target - energy) * (1 - Math.exp(-dt / (target > energy ? 0.07 : 0.22)));
      // Кружок спрятан (голос в шапке, клавиатура) — считаем, но не рисуем.
      const shown = svg.getClientRects().length > 0;
      layers.forEach((l) => {
        l.rot += l.spin * dt * (0.4 + 1.6 * energy);
        l.comps.forEach((c) => { c.ph += c.sp * dt * (0.6 + 2.4 * energy); c.a += (c.at - c.a) * (1 - Math.exp(-dt / 0.16)); });
        if (shown) draw(l, 26 * ampRef.current * energy * l.gain);
      });
      if (!talking && energy < 0.004) { raf = 0; last = 0; layers.forEach((l) => draw(l, 0)); return; }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && !kodiCalm()) { last = 0; raf = requestAnimationFrame(tick); } };
    kick.current = start;
    layers.forEach((l) => draw(l, 0));
    start();
    return () => { cancelAnimationFrame(raf); raf = 0; kick.current = () => {}; };
  }, []);
  useEffect(() => { if (on) kick.current(); }, [on]);
  return (
    <svg ref={ref} className="kodi-waves" viewBox="-80 -80 160 160" aria-hidden="true" focusable="false">
      <path className="kodi-wave kodi-wave-1" fill="#FFB08F" />
      <path className="kodi-wave kodi-wave-2" fill="#FF8A65" />
      <path className="kodi-wave kodi-wave-3" fill="#FF4F28" />
      <circle className="kodi-ring" cx="0" cy="0" r="51.5" />
    </svg>
  );
}

// ЖИВОЙ, КОГДА УЧЕНИК НИЧЕГО НЕ ДЕЛАЕТ (заказчик, 17.10.2026): «пусть не стоит
// как АФК — проявляет эмоции, но не говорит, это показывает лицо». Через 5 с
// без касаний, пока Коди молчит, лицо само меняет выражение: подержал 2–3 с —
// вернулся к обычному — через 1,5–3 с следующее (не то же, что было). Через
// 30 с без касаний Коди задрёмывает (веки опускаются), а касание его будит —
// на миг «ого!». Любое касание, клавиша или ввод сразу возвращает лицо реплики.
// Отсчёт касаний общий на урок; позы — те же, что у реплик, но только лицо.
const KODI_IDLE_MS = 5000;
const KODI_SLEEPY_MS = 30000;
const KODI_MOODS = [
  { pose: 'smile', w: 3 },
  { pose: 'curious', w: 3 },
  { pose: 'explain', vars: { eyeX: -9, eyeY: 1 }, w: 3 },     // оглядывается влево
  { pose: 'explain', vars: { eyeX: 9, eyeY: -3 }, w: 3 },     // и вправо-вверх
  { pose: 'think', w: 2 },
  { pose: 'wonder', w: 1 },
  { pose: 'shy', w: 1 }
];
// Дрёма — глаза полуприкрыты, но видны (веко на 22 закрывало их целиком).
const KODI_DROWSY = { pose: 'rule', vars: { lidY: 10, eyeSY: 0.72, glow: 0.45 }, sleepy: true };
const KODI_WAKE = { pose: 'wonder' };
const _kodiAct = { t: Date.now(), subs: new Set(), on: false };
function kodiActInit() {
  if (_kodiAct.on || typeof window === 'undefined') return;
  _kodiAct.on = true;
  const f = () => { _kodiAct.t = Date.now(); _kodiAct.subs.forEach((g) => g()); };
  ['pointerdown', 'keydown', 'input', 'wheel'].forEach((e) => window.addEventListener(e, f, true));
}
function useKodiMood(talking) {
  const [mood, setMood] = useState(null);
  useEffect(() => {
    kodiActInit();
    if (talking) { setMood(null); return undefined; }
    const quietFrom = Date.now();
    let t = null;
    let last = -1;
    let cur = null;
    const show = (m) => { cur = m; setMood(m); };
    const pickMood = () => {
      const total = KODI_MOODS.reduce((a, m, i) => a + (i === last ? 0 : m.w), 0);
      let r = Math.random() * total;
      for (let i = 0; i < KODI_MOODS.length; i += 1) {
        if (i === last) continue;
        r -= KODI_MOODS[i].w;
        if (r <= 0) { last = i; return KODI_MOODS[i]; }
      }
      last = 0;
      return KODI_MOODS[0];
    };
    const tick = () => {
      const idle = Date.now() - Math.max(_kodiAct.t, quietFrom);
      if (idle < KODI_IDLE_MS) { show(null); t = setTimeout(tick, KODI_IDLE_MS - idle + 50); return; }
      if (idle >= KODI_SLEEPY_MS) { show(KODI_DROWSY); t = setTimeout(tick, 3000); return; }
      if (cur) { show(null); t = setTimeout(tick, 1500 + Math.random() * 1500); return; }
      show(pickMood());
      t = setTimeout(tick, 2200 + Math.random() * 1200);
    };
    const wake = () => {
      clearTimeout(t);
      if (cur && cur.sleepy) { show(KODI_WAKE); t = setTimeout(tick, 900); return; }
      show(null);
      t = setTimeout(tick, KODI_IDLE_MS + 50);
    };
    _kodiAct.subs.add(wake);
    t = setTimeout(tick, KODI_IDLE_MS + 50);
    return () => { clearTimeout(t); _kodiAct.subs.delete(wake); };
  }, [talking]);
  return talking ? null : mood;
}

// ─────────────────────────────────────────────────────────────────────────────
// КОДИ. Имя компонента RobotSVG оставлено каноническим: его зовут
// PersonaBubble, голос в шапке, прощание и типовые экраны.
//
// Рисунок головы — тот же, что у Коди v3 (шлем 204 × 153, медная рамка, экран-
// лицо, уши-вставки; ось x = 210, центр шлема y = 100.5). Рамка головы —
// квадрат 227 вокруг центра шлема: шлем занимает 90% кружка.
// Позы канона двигают здесь только лицо: взгляд и размер глаз (eyeX/eyeY/
// eyeSX/eyeSY), веки, румянец, свечение и его цвет, форму глаз и рта.
// Корпус, руки и голова больше не двигаются — их нет.
//
// Внутри рисунка нет атрибутов transform у групп и фигур с масштабом или
// отражением: канон ставит узлам героя transform-box: fill-box.
// ─────────────────────────────────────────────────────────────────────────────
const LID_LIFT = 12;

function RobotSVG({ pose = 'explain', className, talking, waveAmp }) {
  const audio = useAudio();
  const isTalking = talking !== undefined ? !!talking : !!(audio && audio.playing);
  // Ученик ничего не делает — лицо живёт само (useKodiMood), без голоса.
  const mood = useKodiMood(isTalking);
  const key = mood ? mood.pose : (POSE_SET[pose] ? pose : 'explain');
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  const P = Object.assign({}, S.pose, mood && mood.vars);
  // Веки Коди висят на 12 выше глаз, чтобы их край не срезал свечение глаз в
  // покое; опущенное веко проходит на те же 12 дальше — выражение не меняется.
  if (P.lidY > 0) P.lidY += LID_LIFT;
  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': KODI_GLOW[S.accent] || S.accent };
  Object.keys(P).forEach((k) => { vars['--' + k] = P[k] + (POSE_UNIT[k] || ''); });

  const cls = ['bot', 'kodi', 'eyes-' + S.eyes, S.loop];
  if (S.noBlink) cls.push('no-blink');
  if (isTalking) cls.push('is-talking');

  const u = (id) => `url(#${uid}${id})`;

  // Рот: все формы на месте, видна одна — её выбирает KODI_CSS по состоянию.
  const MOUTH = (
    <g className="kodi-mouth">
      <path className="kodi-m kodi-m-smile" d="M183 128 Q210 147 237 128" fill="none"
        stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-open" d="M190 127 L230 127 Q230 151 210 151 Q190 151 190 127 Z" fill="var(--accent)" />
      <ellipse className="kodi-m kodi-m-o" cx="210" cy="139" rx="6.5" ry="8" fill="none"
        stroke="var(--accent)" strokeWidth="4.5" />
      <path className="kodi-m kodi-m-flat" d="M196 139 L224 139" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <path className="kodi-m kodi-m-side" d="M195 141 Q214 143 227 130" fill="none"
        stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );

  // УХО — медная вставка в боку шлема: тёмная прорезь и полоска-индикатор речи.
  const Ear = ({ x, side }) => (
    <>
      <rect x={x} y="78" width="16" height="62" rx="8" fill={u('c')} />
      <rect x={x + (side === 'l' ? 7.5 : 3.5)} y="88" width="5" height="42" rx="2.5" fill={u('cup')} />
      <rect className="kodi-ear" x={x + (side === 'l' ? 8.5 : 4.5)} y="92" width="3" height="34" rx="1.5" fill="none"
        stroke="var(--accent)" strokeWidth="2.5" />
    </>
  );

  return (
    <span className={'kodi-av' + (isTalking ? ' is-talking' : '') + (className ? ' ' + className : '')} style={vars}>
      <style>{KODI_CSS}</style>
      <KodiWaves on={isTalking} amp={waveAmp || 1} />
      <span className="kodi-disc">
        <svg className={cls.join(' ')} viewBox="96.5 -13 227 227" aria-hidden="true" focusable="false">
          <defs>
            {/* шлем: матовый винил — основа, блик сверху слева, тень снизу справа */}
            <linearGradient id={uid + 'h'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCFAF6" />
              <stop offset="55%" stopColor={BOT.head} />
              <stop offset="100%" stopColor={BOT.headMid} />
            </linearGradient>
            <radialGradient id={uid + 'hl'} cx="28%" cy="14%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={uid + 'hs'} cx="78%" cy="100%" r="75%">
              <stop offset="0%" stopColor={BOT.headDk} stopOpacity=".95" />
              <stop offset="100%" stopColor={BOT.headDk} stopOpacity="0" />
            </radialGradient>
            {/* медь: светлый верх, тёмный пояс, отражение внизу — так читается металл */}
            <linearGradient id={uid + 'c'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BOT.rimLt} />
              <stop offset="38%" stopColor={BOT.rim} />
              <stop offset="72%" stopColor={BOT.rimDk} />
              <stop offset="100%" stopColor={BOT.rim} />
            </linearGradient>
            {/* стекло экрана: светлее в центре, к краям уходит в черноту */}
            <radialGradient id={uid + 's'} cx="210" cy="104" r="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={BOT.visorMid} />
              <stop offset="100%" stopColor={BOT.visor} />
            </radialGradient>
            {/* строки дисплея: тонкие, чтобы не гасить яркость глаз */}
            <pattern id={uid + 'px'} width="3" height="3" patternUnits="userSpaceOnUse">
              <path d="M0 0.5 H3" stroke="#000" strokeWidth=".7" opacity=".2" />
            </pattern>
            {/* прорезь уха: тёплая тёмная медь, а не чёрная дыра */}
            <radialGradient id={uid + 'cup'} cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#6B4328" />
              <stop offset="100%" stopColor="#2E1C11" />
            </radialGradient>
            <clipPath id={uid + 'v'}><rect x="132" y="53" width="156" height="107" rx="27" /></clipPath>
            <clipPath id={uid + 'hc'}><rect x="108" y="24" width="204" height="153" rx="62" /></clipPath>
          </defs>

          {/* шлем — широкий и приземистый */}
          <rect x="108" y="24" width="204" height="153" rx="62" fill={u('h')} />
          <g clipPath={u('hc')}>
            <rect x="108" y="24" width="204" height="153" fill={u('hs')} />
            <rect x="108" y="24" width="204" height="153" fill={u('hl')} />
            {/* уши — вставки в боках шлема, край по силуэту */}
            <Ear x={104} side="l" />
            <Ear x={300} side="r" />
          </g>
          <rect x="108" y="24" width="204" height="153" rx="62" fill="none"
            stroke={BOT.edge} strokeWidth="1.4" opacity=".55" />

          {/* медная рамка экрана — почти во весь шлем; фаска и блик по кромке */}
          <rect x="123" y="44" width="174" height="125" rx="35" fill={u('c')} />
          <rect x="127.5" y="48.5" width="165" height="116" rx="31" fill="none"
            stroke={BOT.rimDk} strokeWidth="2" opacity=".55" />
          <path d="M150 45 Q210 38 270 45" fill="none" stroke="#FFE2C6" strokeWidth="3"
            strokeLinecap="round" opacity=".6" />

          {/* экран-лицо */}
          <rect x="132" y="53" width="156" height="107" rx="27" fill={u('s')} />
          <g clipPath={u('v')}>
            <ellipse className="bot-blush" cx="152" cy="140" rx="12" ry="6" fill={BOT.blush} />
            <ellipse className="bot-blush" cx="268" cy="140" rx="12" ry="6" fill={BOT.blush} />
            <g className="bot-pose-eyes">
              <g className="kodi-gaze">
                <g className="kodi-blink">
                  <circle className="bot-glow" cx="172" cy="104" r="17" fill="var(--accent)" />
                  <circle className="bot-glow" cx="248" cy="104" r="17" fill="var(--accent)" />
                  {/* глаза — круглые светящиеся точки, как на листе лица */}
                  <circle className="pupil" cx="172" cy="104" r="12.5" fill="var(--accent)" />
                  <circle className="pupil" cx="248" cy="104" r="12.5" fill="var(--accent)" />
                  {/* кольца — удивление */}
                  <circle className="ring" cx="172" cy="104" r="11" fill="none"
                    stroke="var(--accent)" strokeWidth="4.5" />
                  <circle className="ring" cx="248" cy="104" r="11" fill="none"
                    stroke="var(--accent)" strokeWidth="4.5" />
                  {/* звёзды — восторг: пятиконечные, как на листе лица */}
                  <path className="star" fill="var(--accent)"
                    strokeLinejoin="round" stroke="var(--accent)" strokeWidth="2" d="M172.0 90.5 L175.6 100.0 L185.8 100.5 L177.9 106.9 L180.5 116.7 L172.0 111.2 L163.5 116.7 L166.1 106.9 L158.2 100.5 L168.4 100.0 Z" />
                  <path className="star" fill="var(--accent)"
                    strokeLinejoin="round" stroke="var(--accent)" strokeWidth="2" d="M248.0 90.5 L251.6 100.0 L261.8 100.5 L253.9 106.9 L256.5 116.7 L248.0 111.2 L239.5 116.7 L242.1 106.9 L234.2 100.5 L244.4 100.0 Z" />
                  {/* дуги — улыбка глазами */}
                  <path className="arc" d="M160 110 Q172 94 184 110" fill="none"
                    stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
                  <path className="arc" d="M236 110 Q248 94 260 110" fill="none"
                    stroke="var(--accent)" strokeWidth="5.5" strokeLinecap="round" />
                </g>
              </g>
            </g>
            {MOUTH}
            {/* веки — того же стекла, что экран: в покое их не видно */}
            <rect className="bot-lid bot-lid-l" x="132" y="-12" width="80" height="90" fill={u('s')} />
            <rect className="bot-lid bot-lid-r" x="208" y="-12" width="80" height="90" fill={u('s')} />
            {/* пиксели дисплея и стекло: отражение сверху, блик, пробегающее сияние */}
            <rect x="132" y="53" width="156" height="107" fill={u('px')} />
            <path d="M140 62 Q154 54 188 54 L156 104 Q138 96 140 62 Z" fill="#fff" opacity=".07" />
            <ellipse cx="210" cy="54" rx="66" ry="8" fill="#fff" opacity=".06" />
            <rect x="143" y="58" width="26" height="5" rx="2.5" fill="#fff" opacity=".2" />
            <g className="kodi-glare">
              <path d="M150 40 L176 40 L146 180 L120 180 Z" fill="#fff" opacity=".1" />
            </g>
          </g>
          <rect x="132" y="53" width="156" height="107" rx="27" fill="none"
            stroke="#000" strokeWidth="3" opacity=".35" />
        </svg>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ЯЗЫК — ТРИ ЯЗЫКА
// pick() принимает { uz, ru, en } | строку | готовый React-элемент.
//
// ЖЕЛЕЗНОЕ ПРАВИЛО API (перенесено из Кибербеза дословно, там оно оплачено
// падением прода): любой видимый пропс любого компонента канона принимает
// объект языков и переводится ВНУТРИ компонента. Никогда не требуйте от урока
// звать pick() перед передачей — достаточно один раз забыть, и React падает с
// ошибкой #31 «object with keys {uz, ru, en}», унося весь экран.
//
// Запасной язык — ru: если строку ещё не перевели, ребёнок увидит русскую, а не
// пустое место. Это осознанно: пустой экран хуже непереведённого.
// ─────────────────────────────────────────────────────────────────────────────
const LANGS = ['uz', 'ru', 'en'];
const LangCtx = createContext('ru');
const useLang = () => useContext(LangCtx);
const usePick = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node == null) return '';
    if (typeof node === 'string' || React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return node[lang];
    return node.ru !== undefined ? node.ru : (node.en !== undefined ? node.en : '');
  }, [lang]);
};
const LangProvider = LangCtx.Provider;
// Отдельный контекст для СМЕНЫ языка: держать функцию в том же контексте, что и
// значение, нельзя — тогда любая смена языка меняет ссылку и перерисовывает
// всё дерево дважды.
const LangSetCtx = createContext(() => {});
const LangSetProvider = LangSetCtx.Provider;
const useSetLang = () => useContext(LangSetCtx);

// ─────────────────────────────────────────────────────────────────────────────
// 4. ВРЕМЯ И ТЕКСТ ДЛЯ ОЗВУЧКИ
// ─────────────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Сколько «молчать», если TTS недоступен: ~75 мс на символ, от 1.8 до 14 с.
const estimateMs = (text) => Math.max(1800, Math.min(14000, String(text || '').length * 75));

// Разметка, которая нужна глазам, но не нужна голосу.
const sanitizeForTts = (text) =>
  String(text || '')
    .replace(/\*\*/g, '')
    .replace(/[«»"“”]/g, '')
    .replace(/\s*→\s*/g, ', ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

// Сервер выбирает язык по маркеру в начале строки.
const LANG_MARK = {
  uz: "[O'zbekcha tallaffuz] ",   // КУРС HTML: так, как требует сервис озвучки
  ru: '[Русское произношение] ',
  en: '[English pronunciation] '
};
// КУРС HTML: ЭМОЦИИ ГОЛОСА — тег подачи ElevenLabs (v3/v4) по смыслу реплики.
// Решение детерминированное: одна и та же реплика всегда получает один и тот
// же тег — прогрев и озвучка совпадают. Правила — по началу фразы:
//   ошибся сам Коди → [embarrassed]; большая победа → [very excited] [laughs];
//   «ого» → [gasps] [amazed]; похвала → [excited] (+ [laughs] или [chuckles]
//   у двух похвал из трёх); «почти», подсказка → [reassuring]; привет →
//   [cheerful]; прощание → [warmly]; вопрос → [curious]; с «!» → [upbeat];
//   остальное (рассказ, объяснение) → [friendly].
const TTS_EMOTION = true;
const EMO_W = (words) => new RegExp('^(?:' + words.join('|') + ')(?=[\\s!,.?…:;]|$)', 'i');
const EMO = {
  oops: { ru: /^(?:ой|упс)(?=[\s!,.]|$)|кажется, я /i, uz: /o‘xshayman|adashdim|chalkashtirdim/i, en: /^(?:oops|uh-oh)(?=[\s!,.]|$)|i think i (?:put|mixed|made)/i },
  big: { ru: EMO_W(['ура', 'это было мощно', 'вот это да']), uz: EMO_W(['ura', 'bu kuchli', 'qoyil']), en: EMO_W(['hooray', 'that was epic', 'look at that']) },
  wow: { ru: EMO_W(['ого', 'ух ты', 'вот оно']), uz: /^(?:voy,|ajab|mana u!)/i, en: EMO_W(['whoa', 'there it is']) },
  win: { ru: EMO_W(['есть', 'огонь', 'супер', 'вау', 'класс', 'бомба', 'чётко', 'четко', 'точно', 'в точку', 'получилось', 'отлично', 'круто', 'красота', 'идеально', 'готово', 'собрано', 'спасибо', 'дожали', 'верно', 'да', 'нашлось', 'сработало', 'правильно', 'вот так', 'работает']),
    uz: EMO_W(['ana', 'zo‘r', 'zo‘r-ku', 'super', 'voy', 'klass', 'bomba', 'aniq', 'aynan nishonga', 'aynan', 'chiqdi', 'mukammal', 'ajoyib', 'tayyor', 'yig‘ildi', 'rahmat', 'barakalla', 'ofarin', 'to‘g‘ri', 'ha', 'topildi', 'ishladi', 'ishlayapti']),
    en: EMO_W(['yes', 'awesome', 'super', 'wow', 'cool', 'boom', 'spot on', 'nailed it', 'perfect', 'great', 'built', 'thanks', 'got it', 'done', 'right', 'nice', 'found it', 'it works', 'correct']) },
  soft: { ru: EMO_W(['почти', 'ничего', 'смотри:', 'хорошая попытка', 'уже близко', 'не страшно']), uz: EMO_W(['deyarli', 'hechqisi', 'qarang:', 'yaxshi urinish', 'yaqin qoldi']),
    en: EMO_W(['almost', 'no worries', 'look:', 'good try', "you're close", 'so close']) },
  hello: { ru: EMO_W(['привет']), uz: EMO_W(['salom']), en: EMO_W(['hi', 'hello']) },
  bye: { ru: /до встречи|до скорого/i, uz: /ko‘rishguncha|xayr/i, en: /see you|goodbye/i }
};
const emoHash = (s) => { let h = 0; for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
const emoTag = (text, lang) => {
  const s = String(text || '').trim();
  const L = EMO.win[lang] ? lang : 'ru';
  const is = (k) => EMO[k][L].test(s);
  if (is('oops')) return '[embarrassed] ';
  if (is('big')) return '[very excited] [laughs] ';
  if (is('wow')) return '[gasps] [amazed] ';
  if (is('win')) { const r = emoHash(s) % 3; return '[excited] ' + (r === 0 ? '[laughs] ' : r === 1 ? '[chuckles] ' : ''); }
  if (is('soft')) return '[reassuring] ';
  if (is('hello')) return '[cheerful] ';
  if (is('bye')) return '[warmly] ';
  if (/\?$/.test(s)) return '[curious] ';
  if (/!$/.test(s)) return '[upbeat] ';
  return '[friendly] ';
};
const markLang = (text, lang) => {
  const s = String(text || '');
  if (!s) return s;
  return (LANG_MARK[lang] || LANG_MARK.ru) + (TTS_EMOTION ? emoTag(s, lang) : '') + s;
};

// КУРС HTML: голос от LMS (пропс voiceGender, как у эталона математики).
let LMS_VOICE = null;
let _ttsFirstLogged = false;   // диагностика: первый запрос к сервису — в консоль
const setLmsVoice = (g) => { LMS_VOICE = g === 'm' || g === 'f' ? g : null; };
// КУРС HTML: адрес — ровно как у эталона математики (пробел — %20, скобки
// маркера — как есть) + lesson_id и lesson_name из META урока.
const ttsEnc = (s) => encodeURIComponent(String(s)).replace(/%5B/g, '[').replace(/%5D/g, ']');
const buildTtsUrl = (base, text, gender, lang) => {
  if (!base) return '';
  const g = (LMS_VOICE || gender) === 'm' ? 'm' : 'f';
  let url = base.replace(/\/+$/, '') + '/api/tts?text=' + ttsEnc(String(text).slice(0, 1000)) + '&g=' + g;
  const meta = typeof META !== 'undefined' && META ? META : null;
  if (meta && meta.lessonId) {
    url += '&lesson_id=' + encodeURIComponent(meta.lessonId);
    const t = meta.lessonTitle || {};
    const name = t[lang] || t.ru || '';
    if (name) url += '&lesson_name=' + encodeURIComponent(name);
  }
  return url;
};

// ── РЕЗЕРВНЫЙ ГОЛОС БРАУЗЕРА ────────────────────────────────────────────────
// Канон запрещает speechSynthesis как ОСНОВНУЮ озвучку, и это правильно: тембр
// пляшет от устройства к устройству и не даёт держать голоса Симки и Нолика.
// Здесь он работает только как резерв — включается, когда HTTP-TTS не отдал
// звук. Для audio-led урока тишина хуже машинного голоса.
const localVoiceOk = () =>
  typeof window !== 'undefined' && !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function';

// В Windows обычно стоят два русских голоса — Irina и Pavel. Раздаём их Симке и
// Нолику: разные голоса читаются ребёнком куда лучше, чем один голос, сдвинутый
// по высоте. API пол не сообщает, поэтому опознаём по имени.
// Имена голосов система выдаёт на языке интерфейса: в русской macOS это
// «Милена», а не «Milena». Латинского списка не хватало — голос не опознавался
// как женский, own становился false, и питч уезжал на 1.25 (писклявость).
// Поэтому оба алфавита.
const VOICE_F = /irina|milena|katja|elena|alena|anna|tatyana|zira|hoda|samantha|female|милена|ирина|алёна|алена|анна|татьяна|катя|елена|яна|ялда/i;
const VOICE_M = /pavel|dmitr|yuri|maxim|david|mark|daniel|male|павел|дмитрий|юрий|максим|артём|артем/i;

const pickLocalVoice = (lang, gender) => {
  if (!localVoiceOk()) return null;
  const all = window.speechSynthesis.getVoices() || [];
  if (!all.length) return null;
  const norm = (v) => String(v.lang || '').toLowerCase().replace('_', '-');
  // Узбекского голоса в системах почти никогда нет. Турецкая фонетика к
  // узбекской латинице ближе всего — читает заметно вернее английской.
  const order = lang === 'uz' ? ['uz', 'tr', 'az', 'en'] : lang === 'en' ? ['en'] : ['ru'];
  let pool = [];
  for (let i = 0; i < order.length && !pool.length; i += 1) {
    pool = all.filter((v) => norm(v).startsWith(order[i]));
  }
  if (!pool.length) pool = all;
  const want = gender === 'm' ? VOICE_M : VOICE_F;
  const foreign = gender === 'm' ? VOICE_F : VOICE_M;
  const named = pool.find((v) => want.test(v.name || ''));
  if (named) return named;
  // имя ничего не подсказало — берём любой, кроме заведомо «чужого» голоса
  return pool.find((v) => !foreign.test(v.name || '')) || pool[0];
};

// ССЫЛКА НА ТЕКУЩУЮ ФРАЗУ. Держим её ЖИВОЙ намеренно.
// Давняя ошибка Chrome: если объект SpeechSynthesisUtterance попадает под
// сборщик мусора раньше, чем договорит, речь обрывается или не начинается
// вовсе — молча, без события error. Поймано ровно так: один и тот же код то
// звучал, то нет, и начинал работать стабильно, как только на объект держали
// ссылку из отладчика. Переменная модульная, а не локальная в функции, именно
// поэтому: локальная умирает вместе с вызовом.
let _utter = null;
let _keepAlive = null;

// «ПИНАЛКА» ДВИЖКА РЕЧИ. Chrome останавливает синтез сам, молча и без события
// error: speak() принят, onstart приходит, а звук глохнет через доли секунды.
// Поймано сравнением двух сборок: одна и та же фраза звучала целиком ровно
// тогда, когда рядом крутился таймер, читавший состояние движка, и молчала без
// него. Поэтому таймер теперь штатный: пока идёт речь, каждые 250 мс дёргаем
// resume(). На неприостановленном движке resume() безвреден.
// Таймер обязан останавливаться сам — иначе он переживёт урок.
function keepSpeechAlive(synth) {
  if (_keepAlive) clearInterval(_keepAlive);
  _keepAlive = setInterval(() => {
    if (!synth.speaking && !synth.pending) { clearInterval(_keepAlive); _keepAlive = null; return; }
    try { synth.resume(); } catch (e) { /* no-op */ }
  }, 250);
}
function stopSpeechKeepAlive() {
  if (_keepAlive) { clearInterval(_keepAlive); _keepAlive = null; }
}

// Возвращает true, если синтез принял фразу. onDone зовётся по окончании.
const speakLocal = (text, gender, lang, onDone) => {
  if (!localVoiceOk()) return false;
  try {
    const synth = window.speechSynthesis;
    // Отменяем, ТОЛЬКО если очередь занята. Безусловный cancel() на пустой
    // очереди в Chrome иногда гасит фразу, поставленную следом.
    if (synth.speaking || synth.pending) synth.cancel();
    // РАЗБУДИТЬ СИНТЕЗ. Chrome умеет оставлять движок в подвешенном состоянии
    // после загрузки страницы: speak() принимается, событий не приходит, звука
    // нет. Поймано на первой реплике урока — она молчала, а та же самая фраза
    // по кнопке «послушать ещё раз» звучала, потому что перед ней шёл cancel().
    // resume() на неприостановленном движке безвреден.
    try { synth.resume(); } catch (e) { /* no-op */ }
    const u = new window.SpeechSynthesisUtterance(text);
    const v = pickLocalVoice(lang, gender);
    if (v) u.voice = v;
    u.lang = v ? v.lang : (lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU');
    // Достался голос нужного пола — правим высоту чуть-чуть, только под возраст
    // героев. Достался один на двоих — разводим их тембром сильнее.
    // Питч правим ЧУТЬ-ЧУТЬ и только под возраст героя. Прежние 0.75 и 1.25
    // ставились, чтобы развести двух персонажей одним системным голосом; герой
    // теперь один, разводить некого, а сильный сдвиг слышен как дефект записи.
    const own = !!v && (gender === 'm' ? VOICE_M : VOICE_F).test(v.name || '');
    u.pitch = own ? (gender === 'm' ? 1 : 1.08) : (gender === 'm' ? 0.9 : 1.12);
    // Медленнее обычного: ребёнок слушает объяснение, а не подкаст.
    u.rate = 0.94;
    u.onend = () => { stopSpeechKeepAlive(); _utter = null; onDone(); };
    u.onerror = () => { stopSpeechKeepAlive(); _utter = null; onDone(); };
    _utter = u;              // см. комментарий выше — без этого речь пропадает
    synth.speak(u);
    keepSpeechAlive(synth);
    return true;
  } catch (e) { return false; }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. ОЗВУЧКА — useAudioEngine
// Один <audio> на урок. speak() всегда резолвится: если TTS упал или звука нет —
// ждём estimateMs и идём дальше. Урок никогда не встаёт из-за звука.
//
// ТУМБЛЕРА ЗВУКА НЕТ — решение модуля: урок audio-led, ребёнок не должен иметь
// возможности его выключить. Взамен работает флаг failed: если голоса фактически
// нет, экран обязан показать текст.
// ─────────────────────────────────────────────────────────────────────────────
const AudioCtx = createContext(null);
const useAudio = () => useContext(AudioCtx);
const AudioProvider = AudioCtx.Provider;

// 0,06 с тишины, 8 кГц, моно, 16 бит. Нужна ровно для разблокировки звука.
// Пустой data-чанк здесь не годится: часть браузеров считает такой файл битым и
// play() падает — тогда разблокировка молча не срабатывает.
const SILENT_WAV = 'data:audio/wav;base64,UklGRuQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YcADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

function useAudioEngine(ttsApiBase, lang) {
  // ТУМБЛЕР ЗВУКА (заказчик, 2026-08-20). Раньше его не было намеренно: урок
  // ведётся голосом, и выключать голос значило ломать урок. Теперь кнопка есть,
  // но выключение НЕ оставляет ребёнка ни с чем — при выключенном звуке реплики
  // печатаются текстом (см. failed/muted в PersonaBubble).
  const [muted, setMuted] = useState(false);
  const on = !muted;
  const [playing, setPlaying] = useState(false);
  // failed=true, когда голоса фактически НЕТ: не задан ttsApiBase, сервер не
  // ответил или браузер заблокировал автозапуск. Экран, который прячет текст
  // ради озвучки, обязан по этому флагу текст показать.
  // failed = «голоса фактически нет», по этому флагу экран показывает текст.
  // Пустой ttsApiBase больше НЕ означает немой урок: есть резерв в браузере.
  const [failed, setFailed] = useState(!ttsApiBase);   // КУРС HTML: с сервисом — сначала проба звука
  // Было ли касание страницы. Браузер не отдаёт речь до первого жеста, поэтому
  // до него реплика показывается ТЕКСТОМ, а после — произносится.
  const [gestured, setGestured] = useState(false);
  const elRef = useRef(null);
  const onRef = useRef(true);
  const resolvers = useRef([]);   // «досрочно закрыть» все ждущие speak()
  const timers = useRef([]);
  const warmed = useRef(new Set());   // адреса фраз, уже заказанных сервису (см. warm)
  // КУРС HTML: диагностика — пришёл ли адрес сервиса озвучки.
  useEffect(() => {
    try { console.info('[TTS] ttsApiBase: ' + (ttsApiBase ? ttsApiBase : '(не передан — урок говорит голосом браузера)')); } catch (e) { /* no-op */ }
  }, [ttsApiBase]);

  useEffect(() => { if (!gestured && !ttsApiBase) setFailed(true); }, [ttsApiBase, gestured]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Список системных голосов приезжает асинхронно: первый getVoices() часто
  // пуст. Прогреваем заранее, чтобы к первой реплике резерв был готов.
  useEffect(() => {
    if (!localVoiceOk()) return undefined;
    const synth = window.speechSynthesis;
    const warm = () => { try { synth.getVoices(); } catch (e) { /* no-op */ } };
    warm();
    if (synth.addEventListener) {
      synth.addEventListener('voiceschanged', warm);
      return () => synth.removeEventListener('voiceschanged', warm);
    }
    return undefined;
  }, []);

  const el = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!elRef.current) { const a = new Audio(); a.preload = 'auto'; a.crossOrigin = 'anonymous'; elRef.current = a; }
    return elRef.current;
  }, []);

  // ─── РАЗБЛОКИРОВКА ЗВУКА ──────────────────────────────────────────────────
  // Браузер не даёт проиграть звук до первого жеста: Chrome — когда у домена
  // низкий Media Engagement Index, iOS Safari — ВСЕГДА. А урок начинает говорить
  // сам, на экране INTRO. Лечится одним касанием: ВНУТРИ обработчика жеста
  // проигрываем короткую тишину на ТОМ ЖЕ <audio>, которым потом говорит урок.
  // Разрешение браузер выдаёт элементу, а не документу, — поэтому играть тишину
  // на новом Audio() бесполезно, и поэтому же elRef переиспользуется на весь урок.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  // Чем продолжить после «стоп»: функция, переигрывающая текущую фразу.
  const resumeRef = useRef(null);
  // ЧЕМ ОЗВУЧИТЬ ПОСЛЕ ВКЛЮЧЕНИЯ ЗВУКА. Держим фразу, которая идёт прямо
  // сейчас: при выключении звука урок продолжается молча (иначе ребёнок
  // застрянет — «Дальше» ждёт конца реплики), а при включении её надо
  // подхватить, а не оставить тишину до следующего экрана.
  const unmuteRef = useRef(null);
  // ПЕРВАЯ РЕПЛИКА ЖДЁТ КАСАНИЯ (решение заказчика). Браузер не отдаёт речь до
  // первого жеста, поэтому реплику нельзя просто «проиграть молча и забыть» —
  // так первая фраза урока не звучала НИКОГДА, её только показывали текстом.
  // Здесь лежит обещание произнести её, как только касание случится.
  const gestureWait = useRef(null);
  // «Повторить» — переиграть реплику, которая сейчас на экране. Движок не знает
  // её текста, поэтому просто поднимает счётчик, а переозвучивает тот, кто
  // репликой владеет (PersonaBubble). Урок при этом НЕ едет вперёд.
  const [replayNonce, setReplayNonce] = useState(0);
  const replay = useCallback(() => setReplayNonce((n) => n + 1), []);
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      setSoundOff(next);
      if (next) {
        // ВЫКЛЮЧИЛИ. Глушим немедленно — кнопка обязана срабатывать сразу, а
        // не в конце фразы. Ход урока при этом НЕ останавливается: реплика
        // «проживается» молча и экран идёт дальше, иначе выключенный звук
        // запирал бы ребёнка на странице.
        try { if (localVoiceOk()) { stopSpeechKeepAlive(); window.speechSynthesis.cancel(); } } catch (e) { /* no-op */ }
        try { if (elRef.current) elRef.current.pause(); } catch (e) { /* no-op */ }
      } else {
        // ВКЛЮЧИЛИ. Подхватываем фразу, которая идёт прямо сейчас, — иначе
        // после включения звук возвращался только со следующего экрана, и
        // ребёнок оставался в тишине. Это и был баг «включил, а голоса нет».
        // Дорожка сервиса просто продолжается с того места, где её приглушили.
        // Проверяем readyState, а не наличие src: пустой src браузер разрешает
        // в адрес самой страницы, и play() на нём падает NotSupportedError.
        const a = elRef.current;
        if (a && a.readyState > 0 && a.paused && !a.ended) {
          try { const pr = a.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (e) { /* no-op */ }
        }
        const fn = unmuteRef.current;
        if (fn) { try { fn(); } catch (e) { /* no-op */ } }
      }
      return next;
    });
  }, []);
  const toggle = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const a = elRef.current;
    try {
      if (next) { if (a) a.pause(); setPlaying(false); }
      else if (a && a.readyState > 0 && !a.ended) {
        const p = a.play();
        if (p && p.then) p.then(() => setPlaying(true)).catch(() => {});
        else setPlaying(true);
      }
    } catch (e) { /* no-op */ }
    if (localVoiceOk()) {
      try {
        if (next) {
          // СТОП. Обрываем речь целиком, а не ставим на паузу: пауза в Chrome
          // не гарантирована. Фразу запомнили — при продолжении произнесём
          // заново (см. runLocal).
          stopSpeechKeepAlive();
          window.speechSynthesis.cancel();
        } else if (resumeRef.current) {
          const fn = resumeRef.current;
          resumeRef.current = null;
          fn();
        }
      } catch (e) { /* no-op */ }
    }
  }, []);

  const unlocked = useRef(false);
  const unlock = useCallback(() => {
    if (unlocked.current) return;
    unlocked.current = true;
    resumeSfx();
    const a = el();
    // Если дорожка уже занята репликой — не трогаем: подмена src оборвала бы
    // Симку на полуслове. Сам факт жеста браузеру уже зачтён.
    if (!a || (a.src && !a.paused)) return;
    try {
      a.src = SILENT_WAV;
      const p = a.play();
      // Не вышло — снимаем флаг, чтобы следующее касание попробовало снова.
      if (p && p.catch) p.catch(() => { unlocked.current = false; });
    } catch (e) { unlocked.current = false; }
  }, [el]);

  // ПЕРВОЕ КАСАНИЕ ГДЕ УГОДНО разблокирует звук и поднимает флаг: отдельного
  // входного экрана с кнопкой «включить звук» больше нет (заказчик снял его как
  // лишний). Пока касания не было, реплика показывается ТЕКСТОМ — ребёнок не
  // остаётся ни с чем; после касания она произносится.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const h = () => {
      setGestured(true);
      unlock();
      // Реплика, ждавшая касания, начинает звучать прямо сейчас.
      const fn = gestureWait.current;
      if (fn) { try { fn(); } catch (e) { /* no-op */ } }
    };
    const opt = { once: true, capture: true };
    window.addEventListener('pointerdown', h, opt);
    window.addEventListener('keydown', h, opt);
    return () => {
      window.removeEventListener('pointerdown', h, { capture: true });
      window.removeEventListener('keydown', h, { capture: true });
    };
  }, [unlock]);

  const flush = useCallback(() => {
    const list = resolvers.current;
    resolvers.current = [];
    list.forEach((fn) => { try { fn(); } catch (e) { /* no-op */ } });
  }, []);

  const stop = useCallback(() => {
    const a = elRef.current;
    if (a) { try { a.onended = null; a.onerror = null; a.pause(); } catch (e) { /* no-op */ } }
    // резервный голос обрывается вместе с основным, иначе он договаривает
    // реплику уже на следующем экране
    if (localVoiceOk()) { try { stopSpeechKeepAlive(); window.speechSynthesis.cancel(); } catch (e) { /* no-op */ } }
    setPlaying(false);
    flush();
  }, [flush]);

  // ЖЁСТКИЙ ОБРЫВ для перезапуска экрана. Отличие от stop(): ждущие speak() не
  // резольвятся, а выбрасываются. stop() их закрывает, и урок думает, что
  // реплика договорена, — экран уехал бы вперёд вместо перезапуска.
  const abort = useCallback(() => {
    const a = elRef.current;
    if (a) { try { a.onended = null; a.onerror = null; a.pause(); } catch (e) { /* no-op */ } }
    if (localVoiceOk()) { try { stopSpeechKeepAlive(); window.speechSynthesis.cancel(); } catch (e) { /* no-op */ } }
    timers.current.forEach(clearTimeout); timers.current = [];
    resolvers.current = [];
    pausedRef.current = false; setPaused(false); setPlaying(false);
  }, []);

  // gestured и muted держим в ref: speak() пересоздавать из-за них нельзя, а
  // читать из замыкания — значит читать устаревшее значение. Именно поэтому
  // кнопка «без звука» не работала: speak() создавался один раз и навсегда
  // запоминал on = true, поэтому продолжал говорить при каждом нажатии.
  const gesturedRef = useRef(false);
  gesturedRef.current = gestured;
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  const speak = useCallback((text, gender) => {
    const clean = sanitizeForTts(text);
    if (!clean) return Promise.resolve();
    const est = estimateMs(clean);
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        // НА ПАУЗЕ РЕПЛИКА НЕ ЗАКРЫВАЕТСЯ. Иначе урок уедет вперёд сам: реплику
        // закрывает не только onended, но и страховочные таймеры, а они тикают
        // и на паузе. Откладываем до снятия.
        if (pausedRef.current) { timers.current.push(setTimeout(finish, 300)); return; }
        done = true;
        unmuteRef.current = null;
        resolvers.current = resolvers.current.filter((f) => f !== finish);
        setPlaying(false);
        resolve();
      };
      resolvers.current.push(finish);
      const waitThen = (ms) => { timers.current.push(setTimeout(finish, ms)); };

      let localSpoke = false;
      let localStarted = false;      // одна реплика — один запуск резерва

      // ПАУЗА ДЛЯ БРАУЗЕРНОГО ГОЛОСА.
      // Штатный speechSynthesis.pause() в Chrome ненадёжен: он то не
      // срабатывает, то оставляет движок в состоянии, из которого речь больше
      // не идёт. Поэтому «стоп» = отменить фразу, а «продолжить» = произнести
      // её заново с начала. Для ребёнка это ровно то, чего он ждёт: нажал
      // стоп — стало тихо, нажал продолжить — снова слышно.
      //
      // ОБРЫВ КНОПКОЙ — НЕ КОНЕЦ РЕПЛИКИ. Раньше здесь была дыра, из-за которой
      // «стоп» и «без звука» оба выглядели сломанными:
      //   · cancel() гасил речь, браузер присылал end,
      //   · end закрывал реплику как СКАЗАННУЮ,
      //   · урок ехал дальше, а «продолжить» и «включить звук» возвращали тишину
      //     до следующего экрана.
      // Теперь конец речи разбирается по причине. Оборвал ребёнок — реплика
      // остаётся незакрытой, а способ её вернуть кладётся в resumeRef (стоп) или
      // unmuteRef (звук). Договорил голос — реплика закрывается как обычно.
      let stopGuard = null;
      const runLocal = () => {
        if (done || localSpoke) return;
        if (pausedRef.current) { resumeRef.current = runLocal; return; }
        resumeRef.current = null;
        if (stopGuard) { clearTimeout(stopGuard); stopGuard = null; }
        speakLocal(clean, gender, lang, onLocalEnd);
      };
      const onLocalEnd = () => {
        if (done) return;
        if (mutedRef.current || pausedRef.current) {
          setPlaying(false);
          const again = () => { localSpoke = false; setFailed(false); runLocal(); };
          if (mutedRef.current) {
            unmuteRef.current = () => { unmuteRef.current = null; again(); };
            // Со включённым тумблером урок не запирается: если звук так и не
            // вернули, реплика «проживается» и экран идёт дальше.
            stopGuard = setTimeout(finish, est);
            timers.current.push(stopGuard);
          }
          // На паузе страховки НЕТ намеренно: пауза обязана держать урок на
          // месте, пока ребёнок сам не нажмёт «продолжить».
          if (pausedRef.current) resumeRef.current = () => { resumeRef.current = null; again(); };
          return;
        }
        localSpoke = true; setPlaying(false); finish();
      };

      const tryLocal = () => {
        if (done) return false;
        // Резерв уже ведёт эту реплику — это успех, а не отказ.
        if (localStarted) return true;
        if (!localVoiceOk()) return false;
        localStarted = true;
        runLocal();
        const ok = true;
        if (!ok) return false;
        setPlaying(true);
        setFailed(false);
        // Синтез умеет принять фразу и промолчать. Проверяем по факту речи, а
        // не по возврату speak() — иначе экран замрёт без звука и без текста.
        timers.current.push(setTimeout(() => {
          if (done || localSpoke) return;
          const s = window.speechSynthesis;
          if (!s.speaking && !s.pending) { setFailed(true); waitThen(est); }
        }, 900));
        return true;
      };

      // АДРЕСА СЕРВИСА НЕТ — ГОВОРИМ ГОЛОСОМ БРАУЗЕРА, а не молчим.
      // Раньше здесь стоял мгновенный отказ, и урок без ttsApiBase шёл немым:
      // ребёнку 8 лет приходилось читать все реплики самому, чего этот курс
      // как раз избегает. Браузерный синтез — не идеал по тембру, но у нас
      // герой и есть робот, так что машинный голос попадает в образ.
      // Побочно это закрывает требование мастер-ТЗ (раздел 12) о полной
      // автономности: озвученный урок перестаёт зависеть от внешнего сервиса.
      // Если сервис задан, приоритет по-прежнему у него — он звучит лучше.
      // Звук выключен тумблером — молчим, но реплику всё равно «проживаем»,
      // чтобы урок шёл дальше. Текст при этом виден, а саму фразу запоминаем:
      // если ребёнок включит звук посреди неё, мы её тут же озвучим.
      if (mutedRef.current) {
        setFailed(true);
        unmuteRef.current = () => {
          if (done) return;
          unmuteRef.current = null;
          setFailed(false);
          if (localVoiceOk()) {
            speakLocal(clean, gender, lang, () => { setPlaying(false); finish(); });
            setPlaying(true);
          }
        };
        waitThen(est);
        return;
      }
      // Вся настоящая выдача звука. Вынесена в функцию, чтобы её мог позвать
      // и обычный путь, и отложенный запуск после первого касания.
      const play = () => {
        if (!ttsApiBase || !onRef.current) {
          if (tryLocal()) return;
          setFailed(true); waitThen(est); return;
        }
        const a = el();
        if (!a) { setFailed(true); waitThen(est); return; }
        // Сервис озвучки бывает нестабилен и отдаёт 500 на исправный запрос.
        // Поэтому одна повторная попытка через 400 мс, и только потом сдаёмся.
        let attempt = 0;
        let pending = false;
        const onFail = () => {
          if (done || pending) return;
          if (localStarted) return;
          // Без резерва флаг поднимаем СРАЗУ: экран не должен несколько секунд
          // стоять пустым, пока мы втихую пробуем ещё раз.
          if (!localVoiceOk()) setFailed(true);
          if (attempt < 2) {
            pending = true;
            timers.current.push(setTimeout(() => { pending = false; tryPlay(); }, 400));
            return;
          }
          // КУРС HTML: диагностика — сервис не отдал звук, переходим на резерв.
          try {
            console.warn('[TTS] сервис не отдал звук (ошибка ' + (a.error ? a.error.code : '—') + '): ' + a.src
              + ' — ' + (localVoiceOk() ? 'включаю голос браузера' : 'показываю текст'));
          } catch (e) { /* no-op */ }
          if (tryLocal()) return;
          setFailed(true);
          waitThen(est);
        };
        const tryPlay = () => {
          // НА ПАУЗЕ НОВАЯ РЕПЛИКА НЕ СТАРТУЕТ. Без этой проверки пауза, нажатая
          // на стыке реплик, не срабатывает: дорожку останавливает toggle(), а
          // через мгновение следующая реплика зовёт play() и снова её запускает.
          if (pausedRef.current) { timers.current.push(setTimeout(tryPlay, 250)); return; }
          attempt += 1;
          try {
            a.onended = null; a.onerror = null; a.pause();
            // r= обходит кэш неудачного ответа
            const url = buildTtsUrl(ttsApiBase, markLang(clean, lang), gender || 'f', lang);
            warmed.current.add(url);   // прогреву эту фразу заказывать уже не нужно
            a.src = url + (attempt > 1 ? '&r=' + attempt : '');
            // КУРС HTML: диагностика — первый запрос к сервису виден в консоли.
            if (!_ttsFirstLogged) { _ttsFirstLogged = true; try { console.info('[TTS] запрос к сервису: ' + a.src); } catch (e) { /* no-op */ } }
            a.onended = finish;
            a.onerror = onFail;
            const p = a.play();
            if (p && p.then) {
              p.then(() => {
                setPlaying(true);
                // play() может «разрешиться», а звука не быть — так ведёт себя
                // переиспользуемый <audio>, когда сервер отдал не-аудио (500 с
                // HTML-телом): ни reject, ни события error не приходит. Поэтому
                // верим не обещанию, а прогрессу дорожки.
                timers.current.push(setTimeout(() => {
                  if (done) return;
                  const silent = !!a.error || a.networkState === 3;   // КУРС HTML: только настоящая ошибка
                  if (!silent) { setFailed(false); return; }
                  try { a.pause(); } catch (e) { /* no-op */ }
                  if (!tryLocal()) setFailed(true);
                }, 900));
                // страховка: если поток умер молча — не висим вечно.
                // На паузе дорожка ТОЖЕ paused — без проверки страховка приняла
                // бы паузу за мёртвый поток и закрыла реплику.
                timers.current.push(setTimeout(() => {
                  if (pausedRef.current) return;
                  if (a.paused || !a.duration) finish();
                }, est + 4000));
              }).catch(onFail);          // сюда попадает и блокировка автозапуска
            } else {
              setPlaying(true);
              waitThen(est + 4000);
            }
          } catch (e) { onFail(); }
        };
        tryPlay();
      };
      // КАСАНИЯ ЕЩЁ НЕ БЫЛО. Браузер речь не отдаст, поэтому реплику показываем
      // текстом и ЗАПОМИНАЕМ. Первое же касание — по герою, по заданию, по
      // любому месту экрана — произносит её с начала. Раньше здесь стояло
      // простое ожидание, и самая первая фраза урока не звучала вообще:
      // ребёнок молча смотрел на текст, а голос включался только со второй.
      // Страховочный таймер остаётся: если касания так и нет, реплика
      // «проживается» и урок идёт дальше, а не запирается.
      const waitGesture = () => {
        setFailed(true);
        const guard = setTimeout(finish, est);
        timers.current.push(guard);
        gestureWait.current = () => {
          gestureWait.current = null;
          if (done) return;
          clearTimeout(guard);
          setFailed(false);
          play();
        };
      };
      if (!gesturedRef.current) {
        // КУРС HTML: сначала тихая проба автозапуска — как в эталоне математики.
        // Проба — на отдельном элементе: общую дорожку экран при открытии
        // останавливает (stop), и пауза оборвала бы пробу. Запретом считается
        // только отказ браузера (NotAllowedError), а не обрыв.
        const a0 = ttsApiBase && onRef.current && typeof Audio !== 'undefined' ? new Audio() : null;
        if (!a0) { waitGesture(); return; }
        let settled = false;
        const allowed = () => {
          if (settled) return;
          settled = true;
          gesturedRef.current = true;
          unlocked.current = true;
          setGestured(true);
          setFailed(false);
          if (!done) play();
        };
        const blocked = () => { if (settled) return; settled = true; if (!done) waitGesture(); };
        try {
          a0.src = SILENT_WAV;
          const pr = a0.play();
          if (pr && pr.then) {
            pr.then(allowed, (err) => (err && err.name === 'NotAllowedError' ? blocked() : allowed()));
            timers.current.push(setTimeout(blocked, 1500));
          } else allowed();
        } catch (e) { blocked(); }
        return;
      }
      play();
    });
  }, [ttsApiBase, lang, el]);

  // ПРОГРЕВ РЕПЛИК. Сервис озвучки синтезирует фразу при первом запросе и
  // кладёт в кэш: новая фраза отвечает за 2–6 с, уже синтезированная — за
  // ~0,3 с (замер 24.09.2026). Заказчик слышал паузу между нажатием карточки и
  // голосом ровно на тех карточках, чьи фразы ещё ни разу не звучали. Поэтому
  // экран при открытии заранее просит сервис синтезировать свои реплики, и к
  // нажатию ребёнка звук уже готов.
  // Запрос HEAD: сервер синтезирует и кэширует фразу (проверено: после HEAD
  // GET отвечает за 0,3 с), а тело со звуком не качается — телефон ребёнка не
  // платит трафиком за фразы, которые так и не прозвучат. no-cors: ответ читать
  // не нужно, а заголовков CORS у сервиса нет. Не больше двух запросов разом,
  // чтобы не забить канал реплике, которая звучит сейчас. Новый экран
  // вытесняет недосланный хвост прошлого — если те фразы всё же понадобятся,
  // их закажет сам speak(). Без ttsApiBase говорит браузер, греть нечего.
  // warmed объявлен выше, рядом с timers: его пополняет и сам speak().
  const warmQ = useRef([]);
  const warmBusy = useRef(0);
  const warm = useCallback((texts) => {
    if (!ttsApiBase || typeof fetch !== 'function') return;
    warmQ.current.forEach((u) => warmed.current.delete(u));
    warmQ.current = [];
    (texts || []).forEach((t) => {
      const clean = sanitizeForTts(t);
      if (!clean) return;
      const u = buildTtsUrl(ttsApiBase, markLang(clean, lang), 'f', lang);
      if (u && !warmed.current.has(u)) { warmed.current.add(u); warmQ.current.push(u); }
    });
    const pump = () => {
      while (warmBusy.current < 2 && warmQ.current.length) {
        const u = warmQ.current.shift();
        warmBusy.current += 1;
        const next = () => { warmBusy.current -= 1; pump(); };
        const fail = () => { warmed.current.delete(u); next(); };
        try { fetch(u, { method: 'HEAD', mode: 'no-cors' }).then(next, fail); } catch (e) { fail(); }
      }
    };
    pump();
  }, [ttsApiBase, lang]);

  useEffect(() => () => stop(), [stop]);
  return { speak, stop, abort, unlock, toggle, toggleMute, replay, warm, paused, replayNonce, on, muted, gestured, playing, failed };
}

// Реплики экрана для прогрева: всё, что герой произносит, лежит в данных
// экрана под ключами say / why / done / hint / hints / lines на любой глубине.
// Подписи (text, ask, eyebrow) только печатаются — их не греем.
const SPOKEN_KEYS = { say: 1, why: 1, done: 1, hint: 1, hints: 1, lines: 1 };
function spokenOf(node, lang, out, spoken) {
  const acc = out || [];
  if (!node || typeof node !== 'object' || React.isValidElement(node)) return acc;
  if (Array.isArray(node)) { node.forEach((x) => spokenOf(x, lang, acc, spoken)); return acc; }
  if (spoken && (node.uz !== undefined || node.ru !== undefined)) {
    const s = node[lang] !== undefined ? node[lang] : node.ru;
    if (typeof s === 'string') acc.push(s);
    return acc;
  }
  Object.keys(node).forEach((k) => spokenOf(node[k], lang, acc, spoken || !!SPOKEN_KEYS[k]));
  return acc;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SFX — WebAudio, без файлов. Второй аргумент = включён ли звук.
// Звука провала здесь нет и быть не должно (мастер-ТЗ, раздел 2.9). Самый
// «отрицательный» тон — 'soft': низкий, короткий, без резкости. Он не сообщает
// «ты ошибся», он сообщает «этот вариант не подошёл».
// ─────────────────────────────────────────────────────────────────────────────
let _ctx = null;
// Глобальный выключатель звука. Нужен именно глобальный: короткие звуки
// правильного и неверного ответа зовутся из компонентов, у которых нет доступа
// к движку озвучки, и при выключенном звуке они всё равно пикали.
let _soundOff = false;
const setSoundOff = (v) => { _soundOff = !!v; };
// WebAudio-контекст создаётся «приостановленным», пока не было жеста, —
// разбудить его надо в том же касании, что и озвучку, иначе первые щелчки глухие.
function resumeSfx() {
  try { if (_ctx && _ctx.state === 'suspended') _ctx.resume(); } catch (e) { /* no-op */ }
}
let _clapBuf = null;
function sfx(kind, enabled) {
  if (_soundOff || enabled === false || typeof window === 'undefined') return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    _ctx = _ctx || new AC();
    const ctx = _ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime;
    const beep = (freq, dur, when, wave, gain) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = wave || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0 + when);
      g.gain.exponentialRampToValueAtTime(gain || 0.09, t0 + when + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + when + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0 + when); o.stop(t0 + when + dur + 0.03);
    };
    // ВЕРНО — восходящая терция, короткая и светлая.
    if (kind === 'ok') { beep(659, 0.10, 0); beep(880, 0.13, 0.09); beep(1175, 0.16, 0.19, 'sine', 0.06); }
    // НЕ ПОДОШЛО — две мягкие нисходящие ноты. Намеренно НЕ резкий «error»:
    // ошибка в этом курсе означает «попробуй ещё», а не «ты не смог».
    else if (kind === 'soft') { beep(392, 0.14, 0, 'sine', 0.07); beep(330, 0.17, 0.10, 'sine', 0.06); }
    else if (kind === 'tap') beep(760, 0.045, 0, 'triangle', 0.045);
    else if (kind === 'type') beep(1180, 0.028, 0, 'triangle', 0.028);   // удар по клавише
    else if (kind === 'pop') beep(600, 0.06, 0, 'triangle', 0.055);
    else if (kind === 'hint') { beep(520, 0.09, 0, 'sine', 0.05); beep(700, 0.12, 0.08, 'sine', 0.045); }
    else if (kind === 'win') { beep(660, 0.11, 0); beep(880, 0.11, 0.1); beep(1100, 0.2, 0.2); }
    else if (kind === 'blip') beep(1046, 0.05, 0, 'triangle', 0.032);
    // МАШИНА ОБЕСТОЧИЛАСЬ — три ноты вниз, последняя длинная и тихая. Звук
    // урока про питание: ребёнок слышит, что что-то ПРОПАЛО, а не ошибся.
    else if (kind === 'off') { beep(494, 0.10, 0, 'sine', 0.06); beep(370, 0.12, 0.08, 'sine', 0.05); beep(247, 0.30, 0.17, 'sine', 0.045); }
    // МАШИНА ПРОСЫПАЕТСЯ — ровный подъём: питание пошло по цепочке.
    else if (kind === 'boot') { beep(330, 0.10, 0, 'sine', 0.05); beep(440, 0.12, 0.09, 'sine', 0.05); beep(587, 0.22, 0.19, 'sine', 0.05); }
    // КУРС HTML: АПЛОДИСМЕНТЫ — хлопки зала вразнобой и аккорд «победы».
    else if (kind === 'cheer') {
      const sr = ctx.sampleRate;
      if (!_clapBuf || _clapBuf.sampleRate !== sr) {
        _clapBuf = ctx.createBuffer(1, Math.floor(sr * 0.05), sr);
        const d = _clapBuf.getChannelData(0);
        for (let k = 0; k < d.length; k += 1) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / d.length, 3);
      }
      const N = 28;
      for (let k = 0; k < N; k += 1) {
        const when = (k / N) * 1.3 + Math.random() * 0.07;
        const env = Math.sin(Math.PI * Math.min(1, (when + 0.1) / 1.5));
        const src = ctx.createBufferSource(); src.buffer = _clapBuf;
        src.playbackRate.value = 0.8 + Math.random() * 0.45;
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1000 + Math.random() * 1000; bp.Q.value = 0.8;
        const g = ctx.createGain(); g.gain.value = 0.08 + 0.16 * env;
        src.connect(bp); bp.connect(g); g.connect(ctx.destination);
        src.start(t0 + when);
      }
      beep(784, 0.12, 0, 'triangle', 0.05); beep(988, 0.12, 0.1, 'triangle', 0.05); beep(1319, 0.3, 0.2, 'sine', 0.05);
    }
  } catch (e) { /* no-op */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// КУРС HTML: ПРАЗДНИК ПОХВАЛЫ — хлопушки и аплодисменты (см. build-canon.mjs).
const _celebSubs = new Set();
let _celebLast = 0;
function celebrate() {
  const now = Date.now();
  if (now - _celebLast < 2500) return;
  _celebLast = now;
  sfx('cheer', true);
  _celebSubs.forEach((f) => { try { f(); } catch (e) { /* no-op */ } });
}
const CELEB_COLORS = ['#FF4F28', '#FFB703', '#1171A0', '#6F57AB', '#227882', '#97368A', '#2F6FB0', '#F4A261'];
const CELEB_BITS = (() => {
  const out = [];
  const r = (k, m) => { const x = Math.sin(k * 12.9898 + m * 78.233) * 43758.5453; return x - Math.floor(x); };
  for (let k = 0; k < 40; k += 1) {
    const side = k % 2;
    out.push({ side, c: CELEB_COLORS[k % CELEB_COLORS.length], shape: k % 3,
      dx: (side ? -1 : 1) * Math.round(40 + r(k, 1) * 220), dy: -Math.round(240 + r(k, 2) * 300),
      rot: Math.round(r(k, 3) * 720 - 360), delay: +(r(k, 4) * 0.18).toFixed(2), dur: +(1.3 + r(k, 5) * 0.6).toFixed(2) });
  }
  return out;
})();
const CELEB_CSS = `
.celeb { position: fixed; inset: 0; z-index: 70; pointer-events: none; overflow: hidden; }
.celeb-pop { position: absolute; bottom: 18px; width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent;
  border-bottom: 46px solid #FFB703; filter: drop-shadow(0 2px 0 rgba(58,53,48,.15)); animation: celebPop 1.1s ease-out both; }
.celeb-pop::after { content: ''; position: absolute; left: -9px; top: 14px; width: 18px; height: 6px; background: #FF4F28; border-radius: 2px; }
.celeb-pop.is-l { left: 22px; transform-origin: 50% 100%; --rz: 32deg; }
.celeb-pop.is-r { right: 22px; transform-origin: 50% 100%; --rz: -32deg; }
@keyframes celebPop { 0% { transform: rotate(var(--rz)) scale(.4); opacity: 0; } 15% { transform: rotate(var(--rz)) scale(1.15); opacity: 1; }
  30% { transform: rotate(var(--rz)) scale(1); } 80% { opacity: 1; } 100% { transform: rotate(var(--rz)) scale(.9); opacity: 0; } }
.celeb-bit { position: absolute; bottom: 60px; width: 9px; height: 14px; background: var(--c); border-radius: 2px; opacity: 0;
  animation: celebFly var(--dur) cubic-bezier(.2,.7,.4,1) both; }
.celeb-bit.is-l { left: 36px; }
.celeb-bit.is-r { right: 36px; }
.celeb-bit.sh-1 { width: 10px; height: 10px; border-radius: 50%; }
.celeb-bit.sh-2 { width: 6px; height: 16px; border-radius: 3px; }
@keyframes celebFly {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  45% { transform: translate(calc(var(--dx) * .8), var(--dy)) rotate(calc(var(--rot) * .5)); opacity: 1; }
  100% { transform: translate(var(--dx), calc(var(--dy) + 360px)) rotate(var(--rot)); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .celeb { display: none; } }
`;
function CelebrateLayer() {
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    let t = null;
    const f = () => { setBurst((v) => v + 1); clearTimeout(t); t = setTimeout(() => setBurst(0), 2200); };
    _celebSubs.add(f);
    return () => { _celebSubs.delete(f); clearTimeout(t); };
  }, []);
  if (!burst) return null;
  return (
    <div className="celeb" key={burst} aria-hidden="true">
      <style>{CELEB_CSS}</style>
      <span className="celeb-pop is-l" />
      <span className="celeb-pop is-r" />
      {CELEB_BITS.map((b, k) => (
        <i key={k} className={'celeb-bit is-' + (b.side ? 'r' : 'l') + ' sh-' + b.shape}
          style={{ '--c': b.c, '--dx': b.dx + 'px', '--dy': b.dy + 'px', '--rot': b.rot + 'deg', '--dur': b.dur + 's', animationDelay: b.delay + 's' }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ЖУРНАЛ ОТВЕТОВ, ПАМЯТЬ ЭКРАНОВ И СОХРАНЁННЫЙ ПРОГРЕСС
//
// log()   — один ответ на экран, перезапись по screenId (возврат «Назад» не
//           плодит дубли). Зовём ТОЛЬКО там, где ребёнок действительно отвечал:
//           экраны-производство (свободная печать на APPLY) в журнал не пишем —
//           иначе в аналитике они выглядят как правильные ответы.
// store   — чтобы экран, на который вернулись, показал уже решённое состояние.
//
// ПРОГРЕСС ПЕРЕЖИВАЕТ ЗАКРЫТИЕ ВКЛАДКИ. Это отличие Курса 0 от Кибербеза, и оно
// требование приёмки (критерий №11: «выйти на середине урока и вернуться»).
// Пишем в localStorage, но осторожно:
//   · ключ включает id урока — уроки не затирают друг друга;
//   · при недоступном хранилище (приватный режим, iframe без доступа) всё молча
//     деградирует до памяти в рамках сессии, урок не падает;
//   · по onFinished запись стирается — второй заход начинается с чистого листа.
// ─────────────────────────────────────────────────────────────────────────────
const LogCtx = createContext(() => {});
const StoreCtx = createContext({ get: () => {}, set: () => {} });
const PageCtx = createContext({ restart: () => {} });
const PageProvider = PageCtx.Provider;
const usePage = () => useContext(PageCtx);
const useLog = () => useContext(LogCtx);
const useStore = () => useContext(StoreCtx);
const LogProvider = LogCtx.Provider;
const StoreProvider = StoreCtx.Provider;

// Хранилище может быть недоступно — тогда ВСЕ операции превращаются в no-op, и
// урок работает как раньше, просто без сохранения. Проверяем записью, а не
// наличием объекта: в Safari в приватном режиме localStorage существует, но
// setItem кидает QuotaExceededError.
// СКЛЕЙКА: прогресс живёт в памяти до конца урока (бриф, «Контракт с
// платформой»): localStorage уроку не нужен. Без хранилища все операции
// useProgress становятся пустыми — так же, как в приватном режиме браузера.
const safeStorage = null;

// ВЕРСИЯ СОХРАНЁННОГО ПРОГРЕССА.
// Поднимать ОБЯЗАТЕЛЬНО каждый раз, когда меняется набор экранов или формат
// того, что экран кладёт в стор.
//
// Зачем. Прогресс переживает закрытие вкладки, то есть запись может быть
// сделана вчерашней сборкой урока. Если с тех пор экран стал хранить другое,
// новая сборка прочитает чужую структуру и упадёт. Так и случилось: третий
// экран раньше хранил { picked: 0 }, а после переделки под стандарт GSX стал
// ждать { seen: [] } — и урок падал на .length у несуществующего массива,
// начиная с третьей страницы. Белый экран получил бы каждый ребёнок, кто не
// добил урок до обновления.
//
// Несовпадение версии — не ошибка, а штатная ситуация: просто начинаем урок
// сначала и стираем чужую запись.
const PROGRESS_VERSION = 7; // 7: перед туром по кнопкам встало знакомство с роботом

function useProgress(lessonId) {
  const key = 'kurs0:' + lessonId;
  const read = useCallback(() => {
    if (!safeStorage) return null;
    try {
      const raw = safeStorage.getItem(key);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (!v || typeof v.i !== 'number') return null;
      if (v.v !== PROGRESS_VERSION) { safeStorage.removeItem(key); return null; }
      return v;
    } catch (e) { return null; }
  }, [key]);
  const write = useCallback((i, box) => {
    if (!safeStorage) return;
    try { safeStorage.setItem(key, JSON.stringify({ i, box, v: PROGRESS_VERSION })); } catch (e) { /* no-op */ }
  }, [key]);
  const clear = useCallback(() => {
    if (!safeStorage) return;
    try { safeStorage.removeItem(key); } catch (e) { /* no-op */ }
  }, [key]);
  return { read, write, clear };
}

function useAnswerLog() {
  const rows = useRef([]);
  const log = useCallback((row) => {
    const i = rows.current.findIndex((r) => r.screenId === row.screenId);
    const next = Object.assign({}, row, { ts: Date.now() });
    if (i >= 0) rows.current[i] = next; else rows.current.push(next);
    return next;
  }, []);
  return [rows, log];
}

// Память экранов. onChange зовётся после каждой записи — корень по нему
// сохраняет прогресс. Стор намеренно плоский: ключ строкой, значение — что
// угодно сериализуемое. Несериализуемое (функции, DOM-узлы) сюда не кладём.
function useScreenStore(onChange) {
  const box = useRef({});
  const cb = useRef(onChange);
  cb.current = onChange;
  return useMemo(() => ({
    get: (k) => box.current[k],
    set: (k, v) => {
      box.current[k] = v;
      if (cb.current) cb.current(box.current);
    },
    hydrate: (obj) => { if (obj && typeof obj === 'object') box.current = Object.assign({}, obj); },
    raw: () => box.current
  }), []);
}

// Payload для onFinished. Скоринга нет — поля-заглушки нужны раннеру платформы.
function buildPayload({ meta, studentName, lang, startedAt, answers, extra }) {
  return Object.assign({
    lessonId: meta.lessonId,
    lessonTitle: meta.lessonTitle[lang] || meta.lessonTitle.ru,
    module: meta.module,
    student: studentName || null,
    lang,
    durationSec: Math.round((Date.now() - startedAt) / 1000),
    answers,
    totalQuestions: null,
    correctAnswers: null,
    scorePercent: null,
    finalScore: 0,
    finalTotal: 0,
    passed: null
  }, extra || {});
}
// ─────────────────────────────────────────────────────────────────────────────
// 8. РЕЧЬ ПЕРСОНАЖА
// PersonaBubble сам озвучивает свой текст и, когда договорил, зовёт onSpoken.
// nonce нужен, чтобы одна и та же фраза, сказанная повторно, переозвучилась.
// ─────────────────────────────────────────────────────────────────────────────
// quiet — герой на экране есть, а голоса нет вовсе: ни реплики, ни кнопки
// повтора. За весь курс это ровно один кадр — выключенный робот в тёмном зале
// первого урока. Везде остальное отсутствие текста означает «репликами ведёт
// useNarration», и кнопка повтора там обязана остаться.
// ГЕРОЙ СЕЙЧАС ГОВОРИТ? Флаг держит сам пузырь: он один знает, когда реплика
// началась и когда договорена — и в случае с живым голосом, и когда голоса нет
// и фразу «проживают» по времени. Экран по этому флагу показывает, что ждёт.
let _sayN = 0;
const _saySubs = new Set();
const markSay = (d) => {
  _sayN = Math.max(0, _sayN + d);
  _saySubs.forEach((f) => f(_sayN));
};
function useSayBusy() {
  const [n, setN] = useState(_sayN);
  useEffect(() => {
    _saySubs.add(setN);
    // Догоняем текущее значение: эффекты идут снизу вверх, и пузырь успевает
    // начать реплику РАНЬШЕ, чем сцена подпишется. Без этой строки самая
    // первая фраза экрана проходила бы мимо — экран не показывал, что ждёт.
    setN(_sayN);
    return () => { _saySubs.delete(setN); };
  }, []);
  return n > 0;
}

function PersonaBubble({ who = 'bot', pose, text, onSpoken, nonce, quiet }) {
  const pick = usePick();
  const audio = useAudio();
  const lang = useLang();
  const line = pick(text);
  const seen = useRef('');
  const spoken = useRef('');
  const key = String(nonce || 0) + '|' + line;
  const [again, setAgain] = useState(0);

  // Реплику НЕ печатаем на экране, пока звучит голос: урок ведётся голосом, и
  // ребёнок должен смотреть на сцену, а не читать за Симкой. Это же делает урок
  // проходимым для того, кто ещё плохо читает — а в 8 лет это норма.
  // Флаг failed умеет мигнуть: он поднимается сразу на отказе и снимается через
  // ~900 мс, если дорожка всё-таки пошла. В ряду «персонаж + облако» это не
  // просто мигание текста, а скачок ширины всего флекса — персонаж прыгает на
  // каждой реплике. Поэтому текст защёлкиваем: показали его для этой реплики —
  // держим до следующей.
  const failed = !!(audio && audio.failed);
  const [textFor, setTextFor] = useState(null);
  useEffect(() => { if (failed) setTextFor(key); }, [failed, key]);
  const silent = textFor !== key;

  // Повтор приходит из двух мест: кнопка у самого пузыря (again) и кнопка
  // «Повторить» в шапке. Складываем — сторожу ниже важно только то, что
  // счётчик изменился.
  const bump = again + ((audio && audio.replayNonce) || 0);

  useEffect(() => {
    if (!line) return undefined;
    // Повтор по просьбе ребёнка обязан пройти сквозь этот сторож.
    if (!bump && seen.current === key) return undefined;
    seen.current = key;
    let dead = false;
    let held = true;
    markSay(1);
    const release = () => { if (held) { held = false; markSay(-1); } };
    (async () => {
      if (audio) await audio.speak(line, VOICE[who] || 'm');
      else await sleep(estimateMs(line));
      if (dead) { release(); return; }
      await sleep(400);
      // Проверку dead после паузы снимать НЕЛЬЗЯ. audio.stop() резолвит разом
      // ВСЕ ждущие speak(), поэтому без неё нажатие «послушать ещё раз»
      // дорезольвит прерванную реплику и урок уедет на экран вперёд.
      if (dead) { release(); return; }
      if (spoken.current === key) return;
      spoken.current = key;
      release();
      if (onSpoken) onSpoken();
    })();
    return () => { dead = true; release(); };
  }, [key, lang, bump]); // eslint-disable-line react-hooks/exhaustive-deps

  const replay = () => {
    sfx('tap', audio && audio.on);
    if (audio) audio.stop();
    // Своего текста у пузыря нет — значит, экран ведёт useNarration, и реплики
    // принадлежат ему. Поднимаем общий счётчик повтора: рассказ перезапустится
    // с первой фразы, а вместе с ним и анимация, которую он ведёт. Без этой
    // ветки кнопка на экранах теории и демонстрации не делала ничего.
    if (!line) { if (audio && audio.replay) audio.replay(); return; }
    setAgain((n) => n + 1);
  };

  const speaking = !!(audio && audio.playing);

  return (
    <div className={'speaker speaker-' + who + (silent ? ' speaker-silent' : '')} key={key}>
      {/* Робот рисуется кодом — внешних картинок в уроке нет. По нажатию
          повторяет реплику: ребёнку естественнее ткнуть в героя, чем искать
          кнопку, поэтому персонаж и кнопка делают одно и то же. */}
      <span className="speaker-av" onClick={silent && !quiet ? replay : undefined}>
        <RobotSVG pose={pose} talking={speaking} />
      </span>
      {quiet ? null : silent ? (
        <>
          {/* КУРС HTML: речь показывают волны вокруг кружка с головой Коди —
              отдельного кружка с полосками больше нет. */}
          {/* реплика убрана с экрана, но экранному диктору она по-прежнему нужна.
              Отдельным узлом, а не внутри кнопки: aria-label кнопки перебил бы её. */}
          <span className="sv-sr">{line}</span>
        </>
      ) : (
        <div className="speaker-bubble">{line}</div>
      )}
    </div>
  );
}

// Статичная реплика: <Stage speaker={persona('bot', 'rule', C.s4.say)} />
const persona = (who, poseKey, text) => ({ who, pose: POSES[poseKey], text });

// ─────────────────────────────────────────────────────────────────────────────
// 9. ЗАКАДРОВЫЙ РАССКАЗ, ВЕДУЩИЙ АНИМАЦИЮ — useNarration
//
// Приём взят из эталонного урока Dars01 и здесь обязателен. Экран THEORY и DEMO
// показывают не всё сразу, а по шагам, и шаг должен меняться РОВНО тогда, когда
// голос дошёл до этого места. Жёсткие задержки (setTimeout(1200) и т.п.) для
// этого не годятся принципиально: одна и та же мысль на узбекском длиннее
// русской на 15–20%, а на английском короче. С таймерами картинка на UZ уезжает
// вперёд голоса, на EN отстаёт. Поэтому шаг двигает сам голос.
//
// step  — индекс реплики, которая ЗВУЧИТ СЕЙЧАС (-1 = ещё не начали)
// done  — рассказ договорён целиком; по нему открывается «Дальше»
// ─────────────────────────────────────────────────────────────────────────────
function useNarration(lines, opts) {
  const { who = 'bot', onDone } = opts || {};
  const audio = useAudio();
  const pick = usePick();
  const lang = useLang();

  // Резолвим тексты один раз за язык. Ключ по содержимому, а не по ссылке на
  // массив: экраны собирают lines инлайном, и по ссылке рассказ перезапускался
  // бы на каждом ре-рендере (тот же баг, что чинили в Dars01 через JSON.stringify).
  const list = useMemo(() => (lines || []).map((l) => pick(l)).filter(Boolean), [lines, pick]);
  const key = list.join('|');
  const bump = (audio && audio.replayNonce) || 0;

  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!list.length) { setStep(-1); setDone(true); return undefined; }
    let dead = false;
    setStep(-1);
    setDone(false);
    (async () => {
      for (let i = 0; i < list.length; i += 1) {
        if (dead) return;
        setStep(i);
        if (audio) await audio.speak(list[i], VOICE[who] || 'm');
        else await sleep(estimateMs(list[i]));
        if (dead) return;
        // Пауза между мыслями. Без неё реплики слипаются в поток, и ребёнок не
        // успевает перевести взгляд на то, что подсветилось.
        await sleep(300);
        if (dead) return;
      }
      setDone(true);
      if (doneRef.current) doneRef.current();
    })();
    return () => { dead = true; };
  }, [key, lang, bump]); // eslint-disable-line react-hooks/exhaustive-deps

  return { step, done, total: list.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. ГЕЙТЫ — когда можно отвечать и когда можно идти дальше
// Оба взяты из Dars01: там они оплачены наблюдением за детьми.
//
// useCanAnswer  — пока наставница объясняет задание, кнопки ответов не живые.
//                 Иначе ребёнок тыкает наугад, не дослушав, и лесенка подсказок
//                 расходуется впустую.
// useAdvanceGate — «Дальше» открывается не по факту верного ответа, а когда
//                 договорён РАЗБОР. Разбор «почему так» — обязательный элемент
//                 мастер-ТЗ (раздел 2.5), и он бесполезен, если ребёнок уже ушёл.
//
// У обоих есть предохранитель по времени: урок не имеет права запереть ребёнка
// навсегда, если озвучка умерла молча.
// ─────────────────────────────────────────────────────────────────────────────
const ANSWER_SAFETY_MS = 9000;
const ADVANCE_SAFETY_MS = 20000;

// ХОД ЗА ХОДОМ, А НЕ ОЧЕРЕДЬЮ.
//
// Заказчик (критично): «нажал на кнопку → робот полностью озвучил → только
// после окончания озвучки доступна следующая кнопка. Пока робот говорит,
// остальные кнопки недоступны». Раньше предохранитель срабатывал ОДИН РАЗ
// через девять секунд после появления экрана и дальше держал кнопки открытыми
// навсегда: ребёнок успевал нажать 1 → 2 → 3 → 4, а герой проговаривал первую
// и последнюю, потеряв середину.
//
// Теперь предохранитель ПЕРЕЗАПУСКАЕТСЯ на каждую новую реплику. Пока герой
// говорит, экран заперт; договорил — открылся. Предохранитель остаётся ровно
// для одного случая: озвучка умерла молча, и без него урок запер бы ребёнка
// навсегда.
function useCanAnswer(ready) {
  const audio = useAudio();
  const busy = ready !== undefined ? !ready : !!(audio && audio.playing);
  const [safety, setSafety] = useState(false);
  useEffect(() => {
    if (!busy) { setSafety(false); return undefined; }
    const id = setTimeout(() => setSafety(true), ANSWER_SAFETY_MS);
    return () => clearTimeout(id);
  }, [busy]);
  return !busy || safety;
}

function useAdvanceGate(solved, spoken) {
  const [safety, setSafety] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const id = setTimeout(() => setSafety(true), ADVANCE_SAFETY_MS);
    return () => clearTimeout(id);
  }, [solved]);
  if (!solved) return false;
  return !!spoken || safety;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. ПОХВАЛА И ПОДБАДРИВАНИЕ
// Счётчики модульные, а не по-экранные: ротация не сбрасывается между экранами,
// и ребёнок за урок не слышит одну похвалу дважды подряд (приём из Dars01).
// Подбадривание НИКОГДА не выдаёт ответ — оно называет способ.
// ─────────────────────────────────────────────────────────────────────────────
const PRAISE = {
  uz: ['Voy, zo‘r!', 'Ana! Chiqdi!', 'Super!', 'Qoyil!', 'Ura!', 'Zo‘r-ku!'],
  ru: ['Вау, классно!', 'Есть! Получилось!', 'Супер!', 'Огонь!', 'Ура!', 'Вот это да!'],
  en: ['Wow, awesome!', 'Yes! You did it!', 'Super!', 'Brilliant!', 'Hooray!', 'Amazing!']
};
// Слов «нет», «неправильно», «ошибка» здесь нет и быть не может: ошибка в этом
// курсе означает «попробуй ещё», а не «ты не смог» (требование заказчика).
const ENCOURAGE = {
  uz: ['Yana bir bor urinib ko‘ring.', 'Diqqat bilan qarang.', 'Yaqin qoldingiz. Shoshilmang.'],
  ru: ['Попробуй ещё раз.', 'Посмотри внимательно.', 'Уже близко. Не спеши.'],
  en: ['Try once more.', 'Take a closer look.', 'You are close. No rush.']
};
let _praiseIdx = 0;
let _encIdx = 0;

// Возвращаем реплику СРАЗУ НА ТРЁХ ЯЗЫКАХ, а не строку текущего.
// Причина: похвала попадает в очередь озвучки как обычный объект { uz, ru, en },
// и если положить туда одну строку текущего языка, то после переключения языка
// ребёнок услышит застрявшую фразу с прошлого. Индекс ротации при этом один на
// все языки — иначе счётчик убегал бы втрое быстрее.
const pickAll = (bank, idx) => {
  const out = {};
  LANGS.forEach((l) => { const a = bank[l] || bank.ru; out[l] = a[idx % a.length]; });
  return out;
};
const nextPraiseL = () => { const p = pickAll(PRAISE, _praiseIdx); _praiseIdx += 1; return p; };
const nextEncourageL = () => { const p = pickAll(ENCOURAGE, _encIdx); _encIdx += 1; return p; };

// Склеить две многоязычные реплики в одну, по языкам. Нужно, чтобы похвала и
// разбор звучали одной фразой, а не двумя запросами к сервису озвучки подряд.
const joinL = (a, b) => {
  const out = {};
  const one = (node, l) => {
    if (node == null) return '';
    if (typeof node === 'string') return node;
    return node[l] !== undefined ? node[l] : (node.ru || '');
  };
  LANGS.forEach((l) => { out[l] = [one(a, l), one(b, l)].filter(Boolean).join(' '); });
  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. КАРКАС ЭКРАНА
// ─────────────────────────────────────────────────────────────────────────────
// hideSpeaker — герой в шапке НЕ показывается, но реплика всё равно звучит.
// Нужно финальному экрану: там герой один и крупный по центру, а второй,
// маленький, сверху только мешал бы прощанию.
const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint, voiceTop }) => {
  const pick = usePick();
  // ПОКА ГЕРОЙ ГОВОРИТ, ЭКРАН ЖДЁТ — И ЭТО ВИДНО.
  //
  // Кнопки на это время заперты (требование заказчика: нажал → дослушал →
  // только потом следующая). Но просто серая кнопка читается как поломка,
  // особенно у ребёнка, который привык, что телефон отзывается всегда.
  // Поэтому на время реплики страница получает класс: заблокированные карточки
  // выглядят отдыхающими, а не сломанными, и рядом с заданием видно, что
  // сейчас говорит герой.
  const speaking = useSayBusy();
  // Экран объявляет своё задание — кнопка «Подсказка» повторит его вслух.
  // Держим в модульной переменной, а не в состоянии: кнопка читает его в
  // момент нажатия, и лишние перерисовки экрану ни к чему.
  useEffect(() => { _hintText = hint || null; return () => { _hintText = null; }; }, [hint]);
  // КУРС HTML: подсказка при бездействии — см. useIdleCoach.
  const idle = useIdleCoach(!!nav, speaking);
  return (
    <div className={'stage' + (heroFixed ? ' stage-hero-fixed' : '') + (hideSpeaker ? ' stage-bare' : '') + (voiceTop ? ' stage-voicetop' : '')
      + (speaking ? ' is-speaking' : '') + (idle ? ' is-idle is-idle-' + idle : '')}>
      <div className="stage-header">
        <div className="limit">
          <div className="progress-track">
            <div className="progress-bar" style={{ width: ((screen + 1) / total) * 100 + '%' }} />
          </div>
          <div className="chrome">
            <div className="eyebrow"><span className="dot" />{pick(eyebrow)}</div>
            {/* ПАНЕЛЬ УПРАВЛЕНИЯ. Все служебные кнопки живут в одном ряду,
                одного размера и в одном месте на КАЖДОЙ странице — этого прямо
                требовал заказчик. Порядок слева направо: язык, звук, повтор,
                номер страницы. Он не меняется нигде. */}
            <div className="chrome-side">
              <ExitBtn />
              {speaker && !hideSpeaker ? <VoiceDot pose={speaker.pose} /> : null}
              {nav && <HintChromeBtn />}
              {nav && <PauseBtn done={done} />}
              <div className="mono counter">{String(screen + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      </div>
      {speaker && (
        <div className="speaker-wrap"><div className="limit"><PersonaBubble {...speaker} /></div></div>
      )}
      <div className={'stage-content' + (speaker ? ' has-speaker' : '')}>
        <div className="limit stack stagger">{children}</div>
      </div>
      {nav && <div className="stage-nav"><div className="limit navrow">{nav}</div></div>}
      {overlay}
    </div>
  );
};



// ОЗВУЧКА — ОДНА КНОПКА, ТРИ РОЛИ (эталон PauseBtn из «Кибербеза»).
// Говорит → «Пауза»; на паузе → «Продолжить»; страница отработала → «Повторить»
// (перезапуск страницы с первой реплики). Раньше в шапке было четыре кнопки
// звука — ребёнок не различал похожие значки и жал «обновить» вместо паузы.
//
// Признак конца страницы приходит от экрана (done — то же условие, что
// открывает «Дальше»), а не угадывается по тишине: между репликами пауза
// дольше секунды, и кнопка успевала бы стать «Повторить» посреди рассказа.
// КУРС HTML: Коди в шапке, рядом с подсказкой. На телефоне он живёт здесь
// всегда (заказчик, 17.10.2026: «на телефоне — возле кнопки подсказки»), на
// ноутбуке спрятан — там Коди справа снизу. Тот же кружок с головой: лицо
// держит эмоцию реплики, вокруг бегут волны, пока звучит голос.
const VoiceDot = ({ pose }) => {
  const audio = useAudio();
  return (
    <span className="ctl-voice kodi-dot" aria-hidden="true">
      <RobotSVG pose={pose || 'explain'} talking={!!(audio && audio.playing)} waveAmp={1.6} />
    </span>
  );
};

const PauseBtn = ({ done }) => {
  const pick = usePick();
  const audio = useAudio();
  const page = usePage();
  if (!audio || !audio.toggle) return null;
  const playing = !!audio.playing;
  const paused = !!audio.paused;
  const replayMode = !!done && !playing && !paused;
  const label = pick(replayMode ? { uz: 'Takrorlash', ru: 'Повторить', en: 'Play again' }
    : paused ? { uz: 'Davom etish', ru: 'Продолжить', en: 'Resume' }
      : { uz: 'Pauza', ru: 'Пауза', en: 'Pause' });
  return (
    <button type="button" className={'ctl-btn' + (paused ? ' is-paused' : '') + (replayMode ? ' is-replay' : '')}
      onClick={() => {
        sfx('tap', audio.on);
        // На паузе кнопка всегда снимает паузу и никогда не переигрывает.
        if (replayMode) { page.restart(); return; }
        audio.toggle();
      }} title={label} aria-label={label}>
      {replayMode ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 11.5a8 8 0 1 1-2.5-5.8" /><path d="M20 4v5h-5" />
        </svg>
      ) : paused ? (
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      ) : (
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="7" y="5.5" width="3.6" height="13" rx="1.6" fill="currentColor" />
          <rect x="13.4" y="5.5" width="3.6" height="13" rx="1.6" fill="currentColor" />
        </svg>
      )}
    </button>
  );
};


// ВЫХОД К СПИСКУ. Появляется, только если урок открыт витриной: на платформе
// он один и закрывается сам. Стоит первым в ряду — уйти важнее, чем поменять
// язык, и рука ищет выход слева.
const ExitBtn = () => {
  const pick = usePick();
  const audio = useAudio();
  const page = usePage();
  if (!page || !page.exit) return null;
  const label = pick({ uz: 'Darslar ro‘yxati', ru: 'К списку уроков', en: 'Back to lessons' });
  return (
    <button type="button" className="ctl-btn is-exit"
      onClick={() => { sfx('tap', audio && audio.on); page.exit(); }} title={label} aria-label={label}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H6M11.5 5.5L5 12l6.5 6.5" />
      </svg>
    </button>
  );
};

// НАЗАД — свободно, без потери прогресса (мастер-ТЗ, раздел 12 «Навигация»).
const BackBtn = ({ onPrev }) => {
  const pick = usePick();
  const audio = useAudio();
  if (!onPrev) return <span />;
  return (
    <button className="btn-ghost" onClick={() => { sfx('tap', audio && audio.on); onPrev(); }}>
      {pick({ uz: 'Orqaga', ru: 'Назад', en: 'Back' })}
    </button>
  );
};

// ВПЕРЁД — только после выполнения задания (мастер-ТЗ, раздел 12).
// force=true — кнопка живёт даже во время озвучки. Нужно только режиму ведения,
// где ребёнок обязан нажать именно её. Везде остальном force НЕ ставить.
const NextBtn = ({ disabled, onClick, label, id, force }) => {
  const pick = usePick();
  const audio = useAudio();
  const busy = !!(audio && audio.playing);
  const [ring, setRing] = useState(0);
  const ringTimer = useRef(null);
  useEffect(() => () => clearTimeout(ringTimer.current), []);
  const off = disabled || (!force && busy);
  return (
    <button
      id={id}
      // Открывшаяся кнопка не просто становится нажимаемой — она наливается
      // цветом и пульсирует. Ребёнок 8 лет не сканирует экран в поисках того,
      // что изменилось; кнопка должна позвать сама (приём из Dars01).
      className={'btn-accent' + (!off ? ' btn-ready' : '')}
      data-ring={ring || undefined}
      disabled={off}
      onClick={() => {
        sfx('tap', audio && audio.on);
        setRing((n) => n + 1);
        clearTimeout(ringTimer.current);
        ringTimer.current = setTimeout(() => setRing(0), 460);
        if (onClick) onClick();
      }}
      style={{ marginLeft: 'auto' }}
    >
      {pick(label || { uz: 'Davom etish', ru: 'Дальше', en: 'Next' })}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. МЕЛКИЕ КОМПОНЕНТЫ
// ─────────────────────────────────────────────────────────────────────────────

// Одна строка без переноса: карточки ответов держат одинаковую высоту.
// Шрифт сжимается шагами по 0.25px, пока строка не влезет; дальше — многоточие.
// Наблюдаем РОДИТЕЛЯ, а не саму строку: его ширина от размера шрифта внутри не
// зависит, поэтому обратной связи и зацикливания нет. Плюс document.fonts.ready —
// до подмены веб-шрифта метрики другие, и первый расчёт врёт.
function FitLine({ children, max = 15, min = 11 }) {
  const ref = useRef(null);
  const lastW = useRef(-1);
  const text = String(children ?? '');
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      let size = max;
      el.style.fontSize = size + 'px';
      let guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > min && guard++ < 60) {
        size -= 0.25;
        el.style.fontSize = size + 'px';
      }
    };
    const measure = (force) => {
      const w = el.clientWidth;
      if (!force && w === lastW.current) return;
      lastW.current = w;
      fit();
    };
    measure(true);
    if (typeof window === 'undefined') return undefined;
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure(false));
      ro.observe(el.parentElement || el);
    }
    let t = null;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => measure(true), 160); };
    window.addEventListener('resize', onResize);
    let dead = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!dead) measure(true); });
    }
    return () => {
      dead = true;
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [text, max, min]);
  return <span ref={ref} className="fit-line">{children}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ИКОНКИ. ЭМОДЗИ В УРОКАХ ЗАПРЕЩЕНЫ — ни ✓, ни ★, ни 🎮. Причины: эмодзи
// рисуются шрифтом системы (на Windows, Android и iOS выглядят по-разному и
// ломают единый стиль), не принимают цвет из токенов и читаются скринридером
// как отдельное слово. Любая иконка — только отсюда.
// Стиль: линия 2.1px, currentColor, viewBox 24.
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
  power: { d: 'M12 4v8M6.8 7a7.5 7.5 0 1 0 10.4 0' },
  check:    { d: 'M4.5 12.6l5 5 10-11.2' },
  cross:    { d: 'M6.5 6.5l11 11M17.5 6.5l-11 11' },
  star:     { d: 'M12 3.6l2.7 5.7 6.2.8-4.5 4.3 1.1 6.1-5.5-3-5.5 3 1.1-6.1L3.1 10.1l6.2-.8z', solid: true },
  bulb:     { d: 'M9.2 17.4h5.6M10 20.4h4M12 3.4a5.6 5.6 0 0 1 3.4 10.1c-.6.5-1 1.1-1 1.9H9.6c0-.8-.4-1.4-1-1.9A5.6 5.6 0 0 1 12 3.4z' },
  cursor:   { d: 'M9 4.6v14.8M6.6 4.6h4.8M6.6 19.4h4.8M15.4 8.4h4M15.4 15.6h4' },
  save:     { d: 'M5.4 4.6h10.2l3 3v11.8H5.4zM8.4 4.6v5h6v-5M8.4 19.4v-5h7.2v5' },
  undo:     { d: 'M4.6 11.4h10a4.6 4.6 0 0 1 0 9.2h-4M4.6 11.4l4-4M4.6 11.4l4 4' },
  textSize: { d: 'M3.4 18.6l4.8-12 4.8 12M5.2 14.6h6M15.4 18.6l3.2-7.6 3.2 7.6M16.6 15.8h4.4' },
  bold:     { d: 'M7.4 4.8h5.4a3.6 3.6 0 0 1 0 7.2H7.4zM7.4 12h6.2a3.6 3.6 0 0 1 0 7.2H7.4z' },
  // ПАЛИТРА ХУДОЖНИКА — «изменить цвет текста» (выбор заказчика из шести
  // вариантов). Единственная многоцветная иконка урока, и это осознанно:
  // смысл кнопки — сам цвет, поэтому краски на палитре цветные даже в
  // одноцветном наборе. Ведро с краской, стоявшее раньше, ребёнок 8 лет со
  // словами «покрасить текст» не связывал.
  //
  // Краски КРУПНЫЕ (r=1.8, а не 1.5) и разнесены шире: на 20 px в полке
  // мелкие точки сливались в пятно.
  paint: { parts: [
    { d: 'M12 3.6c4.6 0 8.4 3.4 8.4 7.6 0 2.4-2 3.4-3.4 3.4h-1.6c-1.2 0-2 .9-2 1.9 0 .5.2.9.5 1.3.3.4.5.8.5 1.3 0 1-.9 1.8-2 1.8-4.6 0-8.4-3.8-8.4-8.6S7.4 3.6 12 3.6z' },
    { d: 'M7.9 9.4a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z', fill: '#FF4F28' },
    { d: 'M12.6 7.4a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z', fill: '#F0C24A' },
    { d: 'M16.6 10.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z', fill: '#2B7FD4' },
    { d: 'M7.4 14.6a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z', fill: '#1F7A4D' }
  ] },
  doc:      { d: 'M6.4 3.6h7.2l4 4v12.8H6.4zM13.6 3.6v4h4M9.2 12.4h5.6M9.2 15.8h5.6' },
  phone:    { d: 'M7.6 2.8h8.8v18.4H7.6zM10.8 5.4h2.4M10.6 18.6h2.8' },
  screen:   { d: 'M3.4 5.4h17.2v10.4H3.4zM9 19.4h6M12 15.8v3.6' },
  browser:  { d: 'M3.4 5.4h17.2v13.2H3.4zM3.4 9h17.2M6 7.2h.02M8.4 7.2h.02M10.8 7.2h.02' },
  keyboard: { d: 'M3.4 7.4h17.2v9.2H3.4zM6.4 10.2h.02M9.4 10.2h.02M12.4 10.2h.02M15.4 10.2h.02M17.8 10.2h.02M8 13.6h8' },
  arrowR:   { d: 'M5 12h13.6M13 5.6L19.4 12 13 18.4' },
  // Значки тура по кнопкам (урок 1) — те же, что в туре «Кибер-щита».
  arrowL:   { d: 'M19 12H5.4M11 5.6L4.6 12l6.4 6.4' },
  gauge:    { d: 'M3.4 15.4a8.6 8.6 0 0 1 17.2 0M12 15.4l4.4-4.4' },
  hash:     { d: 'M8.4 4.4L6.8 19.6M16.4 4.4l-1.6 15.2M4.6 9h15.2M3.8 15h15.2' },
  pause:    { d: 'M9.2 5.4v13.2M14.8 5.4v13.2' },
  align:    { d: 'M4.4 6.4h15.2M7.4 11h9.2M4.4 15.6h15.2M7.4 20.2h9.2' },
  check2:   { d: 'M4.5 12.6l5 5 10-11.2' },
  arrowDn:  { d: 'M12 5v13.6M5.6 12L12 18.4 18.4 12' },
  // Стрелки перестановки, глаз для «показать на секунду» и список — значки,
  // появившиеся вместе с новыми механиками карты.
  up:       { d: 'M12 19V5.4M5.6 12L12 5.6 18.4 12' },
  down:     { d: 'M12 5v13.6M5.6 12L12 18.4 18.4 12' },
  eye:      { d: 'M2.6 12s3.6-6.2 9.4-6.2S21.4 12 21.4 12s-3.6 6.2-9.4 6.2S2.6 12 2.6 12z M12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z' },
  list:     { d: 'M9 6.6h11M9 12h11M9 17.4h11M4.6 6.6h.02M4.6 12h.02M4.6 17.4h.02' },
  listN:    { d: 'M9.4 6.6h10.6M9.4 12h10.6M9.4 17.4h10.6M4 5.2h1.4v3.2M3.6 10.6h2.2l-2.2 2.6h2.2M3.6 15.8h2.2v1.4H4.6v1.4h1.2' },
  role:     { d: 'M4.4 5.4h15.2v4.2H4.4zM4.4 13.2h9.6v1.8H4.4zM4.4 18h9.6v1.8H4.4z' },
  // Части компьютера и вещи со стола — набор для уроков модуля «Первые шаги».
  mouse:    { d: 'M12 3.4a5.6 5.6 0 0 1 5.6 5.6v6a5.6 5.6 0 0 1-11.2 0v-6A5.6 5.6 0 0 1 12 3.4zM12 6.6v3.4' },
  pc:       { d: 'M6.4 3.4h11.2v17.2H6.4zM9.4 6.6h5.2M9.4 9.6h5.2M9.6 17.4h.02M12.4 17.4h2.2' },
  cup:      { d: 'M5.4 7.4h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16.4 9.4h1.8a2.6 2.6 0 0 1 0 5.2h-1.8M7.4 4.2v-.02M11 4.2v-.02M14.6 4.2v-.02' },
  book:     { d: 'M4.4 4.6h6.2a2.6 2.6 0 0 1 1.4 2.4v12a2.2 2.2 0 0 0-1.4-1H4.4zM19.6 4.6h-6.2A2.6 2.6 0 0 0 12 7v12a2.2 2.2 0 0 1 1.4-1h6.2z' },
  plug:     { d: 'M9 3.4v5M15 3.4v5M6.4 8.4h11.2v3a5.6 5.6 0 0 1-5.6 5.6 5.6 5.6 0 0 1-5.6-5.6zM12 17v3.6' },
  chair:    { d: 'M7.4 3.4h9.2v8H7.4zM6 11.4h12M12 11.4v5M8 20.6l4-4 4 4' },
  // Нота и картинка — типы файлов. Нужны с урока 9 и дальше везде, где
  // встречаются звук и изображение: телефон вместо звука ребёнок читает как
  // «позвонить», а глаз вместо картинки — как «посмотреть».
  note:     { d: 'M9.4 17.6V5.4l8.2-1.8v11.6M9.4 8.6l8.2-1.8M9.4 17.6a2.4 2.4 0 1 1-2.4-2.4 2.4 2.4 0 0 1 2.4 2.4zM17.6 15.2a2.4 2.4 0 1 1-2.4-2.4 2.4 2.4 0 0 1 2.4 2.4z' },
  pic:      { d: 'M3.6 5.4h16.8v13.2H3.6zM3.6 15.4l4.6-4.6 3.6 3.6 3-3 5.6 5.4M15.4 9a1.2 1.2 0 1 0 0-.02z' },
  eye2:     { d: 'M2.6 12s3.6-6.2 9.4-6.2S21.4 12 21.4 12s-3.6 6.2-9.4 6.2S2.6 12 2.6 12zM12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z' }
};

// Значок может быть однолинейным (d) или составным (parts) — второй нужен
// там, где смысл кнопки в цвете и одноцветной линией его не передать.
const Icon = ({ name, size = 24, className }) => {
  const ic = ICONS[name];
  if (!ic) return null;
  const common = {
    className: 'ic' + (className ? ' ' + className : ''),
    width: size, height: size, viewBox: '0 0 24 24',
    'aria-hidden': 'true', focusable: 'false'
  };
  if (ic.parts) {
    return (
      <svg {...common} strokeLinecap="round" strokeLinejoin="round">
        {ic.parts.map((p, i) => (
          <path key={i} d={p.d}
            fill={p.fill || 'none'}
            stroke={p.fill ? 'none' : 'currentColor'}
            strokeWidth={p.fill ? 0 : 2.1} />
        ))}
      </svg>
    );
  }
  return (
    <svg {...common}
      fill={ic.solid ? 'currentColor' : 'none'} stroke={ic.solid ? 'none' : 'currentColor'}
      strokeWidth={ic.solid ? 0 : 2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d={ic.d} />
    </svg>
  );
};

// Подсказка / разбор. Отдельный визуальный канал: жёлтый hint, а НЕ красный.
// Мастер-ТЗ, раздел 2.9: красных крестов и сигналов провала в уроке нет.
const Note = ({ kind = 'hint', label, children }) => {
  const pick = usePick();
  return (
    <div className={'note note-' + kind}>
      {label && <span className="note-lbl">{pick(label)}</span>}
      <div className="note-body">{pick(children)}</div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// ПОДСКАЗКА — единый компонент для всех заданий и всех уроков.
//
// Требования заказчика, каждое продиктовано наблюдением:
//   · компактная кнопка «Подсказка», а не крупная фраза во всю ширину;
//   · содержимое открывается ПОВЕРХ экрана карточкой, а не дописывается снизу:
//     дописанный снизу текст удлинял страницу и рождал прокрутку, которой в
//     уроке быть не должно;
//   · закрывается нажатием в любое место — ребёнку не надо искать крестик;
//   · многоразовая: закрыл, вернулся к заданию, снова нажал — снова открылась;
//   · пошаговая: не сделан первый шаг — объясняем первый; сделан — на следующем
//     обращении объясняем второй;
//   · если ребёнок застрял и ничего не делает ~18 секунд, кнопка начинает мягко
//     мигать. Именно мягко: это приглашение, а не тревога.
//
// Каждая ступень озвучивается героем — подсказка обязана звучать, а не только
// читаться: урок рассчитан на тех, кто ещё плохо читает.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// СВЕТОДИОДНАЯ ПОДСКАЗКА — «где нажать», если ребёнок задумался
//
// Требование заказчика: если ученик думает дольше семи секунд, нужные коробки
// должны замигать светодиодом в рамке. Смысл не в украшении, а в снятии
// тупика: в 8 лет ребёнок нередко понимает задание, но не находит глазами, ГДЕ
// его выполнять. Мигание отвечает ровно на этот вопрос и не выдаёт ответ —
// оно показывает МЕСТО, а не решение. Поэтому его можно ставить и на задания
// с вариантами: подсвечиваются ВСЕ невыбранные, а не правильный.
//
// Семь секунд отсчитываются с момента, когда ход перешёл к ребёнку, и
// сбрасываются любым его касанием. Пока говорит герой, отсчёт не идёт: ребёнок
// не «думает», он слушает.
//
// Частота 0.87 Гц — втрое ниже порога 3 Гц из WCAG 2.3.1, при котором мигание
// становится небезопасным.
// ─────────────────────────────────────────────────────────────────────────────
const LED_MS = 7000;

// ─────────────────────────────────────────────────────────────────────────────
// ПОСТОЯННАЯ КНОПКА «ПОДСКАЗКА» (требование заказчика: она должна быть на
// каждом экране каждого урока, а не появляться в отдельных заданиях).
//
// Кнопка делает ровно две вещи, и обе — про «что мне сейчас делать»:
//   · повторяет вслух задание этого экрана;
//   · немедленно зажигает те же светодиоды, что сами загораются через семь
//     секунд раздумья, — то есть показывает МЕСТО действия, но не ответ.
//
// Шина модульная, а не контекстная: useIdleLed зовут сами экраны, а кнопка
// живёт внутри Stage — контекст из Stage до экрана не достаёт.
let _hintText = null;
let _hintN = 0;
const _hintSubs = new Set();
const pulseHint = () => { _hintN += 1; _hintSubs.forEach((f) => f(_hintN)); };
function useHintPulse() {
  const [n, setN] = useState(_hintN);
  useEffect(() => { _hintSubs.add(setN); return () => { _hintSubs.delete(setN); }; }, []);
  return n;
}

function useIdleLed(active, progress, ms) {
  const [on, setOn] = useState(false);
  const [beat, setBeat] = useState(0);
  const pulse = useHintPulse();
  const seen = useRef(pulse);

  useEffect(() => {
    if (!active) { setOn(false); return undefined; }
    // Нажали «Подсказку» — светодиоды загораются сразу, без семи секунд.
    if (pulse !== seen.current) { seen.current = pulse; setOn(true); return undefined; }
    setOn(false);
    const id = setTimeout(() => setOn(true), ms || LED_MS);
    return () => clearTimeout(id);
  }, [active, beat, progress, ms, pulse]);

  // Любое касание страницы — признак, что ребёнок действует, а не завис.
  useEffect(() => {
    if (typeof window === 'undefined' || !active) return undefined;
    const h = () => setBeat((n) => n + 1);
    window.addEventListener('pointerdown', h);
    return () => window.removeEventListener('pointerdown', h);
  }, [active]);

  return on;
}

// Накладка внутри коробки: пульсирующая рамка и светодиод в углу.
// Рисуется отдельным элементом, а не тенью самой коробки: у коробок разные
// собственные тени, и подмена тени ломала бы их вид.
const Led = ({ on }) => (on ? <span className="led" aria-hidden="true"><i /></span> : null);

// КУРС HTML: ПОДСКАЗКА ПРИ БЕЗДЕЙСТВИИ (заказчик, 15.10.2026). Ребёнок молчит
// и ничего не трогает, пока герой не говорит, — экран показывает, куда нажать.
// Уровень 1 (8 с): подпрыгивает открытая «Дальше», а если она закрыта —
// качается лампочка подсказки и загораются светодиоды на месте действия.
// Уровень 2 (20 с): к той же кнопке приходит рука-указатель.
// Сброс — по любому касанию, клавише или вводу. Отсчёт идёт без перерисовок:
// состояние меняется только при смене уровня, иначе каждая буква в редакторе
// перерисовывала бы весь экран.
const IDLE_COACH_MS = [8000, 20000];
function useIdleCoach(active, speaking) {
  const [lv, setLv] = useState(0);
  const lvRef = useRef(0);
  useEffect(() => {
    const set = (v) => { if (lvRef.current !== v) { lvRef.current = v; setLv(v); } };
    if (!active || speaking || typeof window === 'undefined') { set(0); return undefined; }
    let t1 = null;
    let t2 = null;
    const arm = () => {
      clearTimeout(t1); clearTimeout(t2); set(0);
      t1 = setTimeout(() => {
        set(1);
        // «Дальше» закрыта — значит, дело на экране: светодиоды на месте действия.
        if (!document.querySelector('.stage-nav .btn-ready')) pulseHint();
      }, IDLE_COACH_MS[0]);
      t2 = setTimeout(() => set(2), IDLE_COACH_MS[1]);
    };
    arm();
    const evs = ['pointerdown', 'keydown', 'input', 'wheel'];
    evs.forEach((e) => window.addEventListener(e, arm, true));
    return () => { clearTimeout(t1); clearTimeout(t2); evs.forEach((e) => window.removeEventListener(e, arm, true)); };
  }, [active, speaking]);
  return lv;
}

const HINT_BTN = { uz: 'Maslahat', ru: 'Подсказка', en: 'Hint' };

// Кнопка подсказки в шапке: есть на каждом экране, работает всегда.
const HintChromeBtn = () => {
  const pick = usePick();
  const audio = useAudio();
  const label = pick(HINT_BTN);
  const tap = () => {
    sfx('hint', audio && audio.on);
    // Задание этого экрана — вслух. Если экран его не объявил, повторяем
    // последнюю реплику героя: она и есть объяснение, что делать.
    const line = _hintText ? pick(_hintText) : null;
    if (line && audio && audio.speak) { audio.stop(); audio.speak(line, VOICE.bot || 'm'); }
    else if (audio && audio.replay) audio.replay();
    pulseHint();
  };
  return (
    <button type="button" className="ctl-btn ctl-hint" onClick={tap} title={label} aria-label={label}>
      <Icon name="bulb" size={18} />
    </button>
  );
};
const HINT_CLOSE = { uz: 'Yopish uchun bosing', ru: 'Нажми, чтобы закрыть', en: 'Tap to close' };
const IDLE_MS = 18000;

function HintButton({ steps, step, onOpen, disabled }) {
  const pick = usePick();
  const audio = useAudio();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  // Отсчёт бездействия перезапускается любым действием ребёнка на странице.
  const beat = useRef(0);

  useEffect(() => {
    if (disabled) { setNudge(false); return undefined; }
    setNudge(false);
    const id = setTimeout(() => setNudge(true), IDLE_MS);
    return () => clearTimeout(id);
  }, [disabled, step, beat.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Любое касание страницы считается активностью и снимает мигание.
  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return undefined;
    const h = () => { beat.current += 1; setNudge(false); };
    window.addEventListener('pointerdown', h);
    return () => window.removeEventListener('pointerdown', h);
  }, [disabled]);

  if (disabled || !steps || !steps.length) return null;
  const idx = Math.min(step, steps.length - 1);

  return (
    <>
      <button type="button" className={'hint-b' + (nudge ? ' is-nudge' : '')}
        onClick={(e) => {
          e.stopPropagation();
          sfx('hint', audio && audio.on);
          setNudge(false);
          setOpen(true);
          if (onOpen) onOpen(idx);
        }}>
        <Icon name="bulb" size={17} />
        {pick(HINT_BTN)}
      </button>

      {open && (
        // Карточка перекрывает экран целиком и закрывается нажатием куда угодно.
        <div className="hint-veil" onClick={() => setOpen(false)}>
          <div className="hint-card" role="dialog" aria-live="polite" onClick={(e) => e.stopPropagation()}>
            <div className="hint-card-top">
              <span className="hint-card-ic"><Icon name="bulb" size={18} /></span>
              <span className="hint-card-n mono">{idx + 1} / {steps.length}</span>
            </div>
            <p className="hint-card-txt">{pick(steps[idx])}</p>
            <button type="button" className="hint-card-close" onClick={() => setOpen(false)}>
              {pick(HINT_CLOSE)}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. ЛЕСЕНКА ПОДСКАЗОК — главный компонент проверки понимания
//
// Мастер-ТЗ, раздел 10, требует ровно такого поведения, и оно ОТЛИЧАЕТСЯ от
// модели «веди-до-верного» из Кибербеза. Разница принципиальная:
//
//   Кибербез: неверный вариант ГАСНЕТ насовсем, наставница объясняет, почему
//             он не подошёл. Выбор сужается сам собой.
//   Курс 0:   все варианты остаются живыми, а после каждой ошибки появляется
//             подсказка, которая сужает ПОИСК, а не список. Ребёнок каждый раз
//             решает заново — просто со всё большим знанием.
//
// Почему так, а не проще. Гашение вариантов на вопросе из трёх ответов
// превращает вторую попытку в выбор из двух, а третью — в единственный
// оставшийся. То есть задание проходится перебором, и ТЗ прямо это запрещает
// (раздел 2.9: «заданий, где угадать наугад быстрее, чем понять»). Лесенка
// подсказок ведёт к пониманию, а не к исключению.
//
// Уровни (раздел 10 мастер-ТЗ):
//   1 — Направление: куда смотреть, но выбор не сужает
//   2 — Сужение:     отсекает часть вариантов
//   3 — Почти ответ: последнее действие всё равно делает ребёнок
//
// Ребёнок не может застрять: после третьей подсказки задание проходится в любом
// случае — подсказка практически называет ответ. Штрафов за попытки нет,
// количество попыток не ограничено.
// ─────────────────────────────────────────────────────────────────────────────
const HINT_LABEL = [
  { uz: 'Yo‘nalish', ru: 'Направление', en: 'Where to look' },
  { uz: 'Toraytiramiz', ru: 'Сужаем', en: 'Narrowing down' },
  { uz: 'Deyarli javob', ru: 'Почти ответ', en: 'Almost there' }
];
const WHY_LABEL = { uz: 'Nega shunday', ru: 'Почему так', en: 'Why' };

function HintLadder({ options, correct, hints, why, onResolved, onSay, stored, canAnswer = true, columns }) {
  const pick = usePick();
  const audio = useAudio();
  const [level, setLevel] = useState(stored ? stored.level : 0);   // сколько подсказок открыто
  const [done, setDone] = useState(stored ? stored.done : false);
  const [shaking, setShaking] = useState(null);
  const firstTry = useRef(stored ? stored.firstTry : null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  // Задумался дольше семи секунд — загораются все ещё не отвергнутые варианты.
  // Подсвечены ВСЕ сразу, поэтому подсказка показывает, что вообще надо
  // нажать, и не приближает ответ ни на шаг.
  const led = useIdleLed(canAnswer && !done, String(level) + ':' + String(attempts.current));

  // Подсказка появляется под заданием и НЕ перекрывает его — ребёнок должен
  // видеть варианты и подсказку одновременно, иначе подсказку невозможно
  // применить. Автоскролл к ней — с задержкой, чтобы анимация успела встать.
  const hintRef = useRef(null);
  useEffect(() => {
    if (!level || done) return undefined;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = hintRef.current;
      if (!el || !el.scrollIntoView) return;
      const reduce = typeof window !== 'undefined' && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }));
    return () => cancelAnimationFrame(raf);
  }, [level, done]);

  const tap = (i) => {
    if (done || shaking !== null || !canAnswer) return;
    const right = i === correct;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;

    if (right) {
      setDone(true);
      sfx('ok', audio && audio.on);
      if (onResolved) {
        onResolved({ correct: true, firstTry: firstTry.current, attempts: attempts.current, level, done: true, index: i });
      }
      // Похвала и разбор идут голосом Симки одной фразой, а «Дальше» ждёт,
      // пока она договорит (useAdvanceGate). Разбор — обязательный элемент ТЗ.
      if (onSay) onSay(joinL(nextPraiseL(), why), 'cheer', true);
      return;
    }

    // Ошибка. Ни красного креста, ни звука провала — только мягкое покачивание
    // и следующая ступень подсказки (мастер-ТЗ, раздел 11).
    setShaking(i);
    sfx('soft', audio && audio.on);
    const nextLevel = Math.min(3, level + 1);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShaking(null);
      setLevel(nextLevel);
      sfx('hint', audio && audio.on);
      const h = hints && hints[nextLevel - 1];
      // Подбадривание + сама подсказка. Подбадривание НИКОГДА не выдаёт ответ —
      // оно называет способ, а ответ приближает только ступень лесенки.
      if (onSay) onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'think', false);
    })();
  };

  return (
    <>
      <div className={'opts' + (done ? ' answered' : '') + (columns ? ' opts-grid' : '')}>
        {options.map((o, i) => {
          const isOk = done && i === correct;
          const isFaded = done && i !== correct;
          const isBad = shaking === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => tap(i)}
              disabled={done || !canAnswer}
              className={'opt' + (isFaded ? ' opt-dead' : '') + (isOk ? ' opt-ok fx-ok' : '') + (isBad ? ' opt-wrong fx-no' : '')
                + (led && !done ? ' is-led' : '')}
            >
              <span className="opt-mark">
                {isOk ? <Icon name="check" size={16} /> : String.fromCharCode(65 + i)}
              </span>
              {o.node ? <span className="opt-node">{o.node}</span> : <FitLine>{pick(o.text)}</FitLine>}
              <Led on={led && !done} />
            </button>
          );
        })}
      </div>

      {/* НА ЭКРАНЕ ВСЕГДА ОДНА ПОДСКАЗКА — самая свежая.
          Раньше показывались все открытые ступени сразу: при трёх ошибках
          подряд под заданием вырастал столбик из трёх карточек, страница
          удлинялась и появлялась прокрутка. Ребёнку при этом нужна ровно одна —
          последняя; предыдущие он уже прочитал и применил.
          Номер ступени остался, чтобы было видно движение: 2 из 3. */}
      {!done && level > 0 && (
        <div className="ladder" ref={hintRef}>
          <div className="note note-hint" key={level}>
            <span className="note-lbl">
              <Icon name="bulb" size={13} />
              {pick(HINT_LABEL[level - 1])}
              <span className="note-step mono">{level}/{hints ? hints.length : 3}</span>
            </span>
            <div className="note-body">{pick(hints[level - 1])}</div>
          </div>
        </div>
      )}

      {/* Разбор «почему так» — после верного ответа, всегда. */}
      {done && why && (
        <div className="note note-ok">
          <span className="note-lbl">{pick(WHY_LABEL)}</span>
          <div className="note-body">{pick(why)}</div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. КЛИК-ВЫБОР БЕЗ ОЦЕНКИ — для CURIOSITY и LIFE
// Ошибиться здесь нельзя, и это говорится ребёнку вслух. Экран нужен, чтобы
// ребёнок сделал догадку ДО объяснения: предсказание включает мышление лучше,
// чем чтение готового ответа (механика M11 из каталога).
// ─────────────────────────────────────────────────────────────────────────────
function Guess({ options, onPicked, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [picked, setPicked] = useState(stored ? stored.picked : null);

  const tap = (i) => {
    if (picked !== null || !canAnswer) return;
    setPicked(i);
    sfx('pop', audio && audio.on);
    if (onPicked) onPicked(i, options[i]);
  };

  return (
    <div className={'opts' + (picked !== null ? ' answered' : '')}>
      {options.map((o, i) => (
        <button key={i} type="button" onClick={() => tap(i)} disabled={picked !== null || !canAnswer}
          className={'opt' + (picked === i ? ' opt-picked' : '') + (picked !== null && picked !== i ? ' opt-dead' : '')}>
          <span className="opt-mark">{String.fromCharCode(65 + i)}</span>
          {o.node ? <span className="opt-node">{o.node}</span> : <FitLine>{pick(o.text)}</FitLine>}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. COACH-MARK — подсветка настоящего элемента интерфейса (режим ведения).
// Прорезает «дырку» по CSS-селектору и сама расставляет карточку над/под целью.
// Используется на экране GUIDED: провалиться там невозможно по требованию ТЗ,
// поэтому стрелка показывает ровно то место, куда нажимать.
// ─────────────────────────────────────────────────────────────────────────────
const HOLE_PAD = 8, CARD_GAP = 14, EDGE = 12;

function useRect(selector, nonce) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!selector || typeof window === 'undefined') { setRect(null); return undefined; }
    let dead = false;
    const read = () => {
      if (dead) return;
      const el = document.querySelector(selector);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect((p) => (p && p.top === r.top && p.left === r.left && p.width === r.width && p.height === r.height)
        ? p : { top: r.top, left: r.left, width: r.width, height: r.height });
    };
    read();
    // Цель может ещё анимироваться (fade-up 280 мс) — перечитываем несколько раз.
    const timers = [50, 200, 500, 900].map((ms) => setTimeout(read, ms));
    window.addEventListener('resize', read);
    window.addEventListener('scroll', read, true);
    let ro = null;
    const el = document.querySelector(selector);
    if (el && typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(read); ro.observe(el); }
    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', read);
      window.removeEventListener('scroll', read, true);
      if (ro) ro.disconnect();
    };
  }, [selector, nonce]);
  return rect;
}

function CoachMark({ selector, title, text, icon, tappable, onTap, nonce }) {
  const pick = usePick();
  const rect = useRect(selector, nonce);
  const cardRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !rect) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const cw = card.offsetWidth, ch = card.offsetHeight;
    const below = rect.top + rect.height + CARD_GAP;
    const above = rect.top - CARD_GAP - ch;
    let top;
    if (below + ch <= vh - EDGE) top = below;
    else if (above >= EDGE) top = above;
    else top = Math.max(EDGE, Math.min(vh - EDGE - ch, rect.top + rect.height / 2 - ch / 2));
    let left = rect.left + rect.width / 2 - cw / 2;
    left = Math.max(EDGE, Math.min(vw - EDGE - cw, left));
    setPos((p) => (p && p.top === top && p.left === left) ? p : { top, left });
  }, [rect, title, text]);

  if (!rect) return null;
  const hole = {
    top: rect.top - HOLE_PAD, left: rect.left - HOLE_PAD,
    width: rect.width + HOLE_PAD * 2, height: rect.height + HOLE_PAD * 2
  };
  return (
    <>
      <div className="coach-hole" style={hole} />
      <div className="coach-block" style={{ left: 0, top: 0, width: '100%', height: Math.max(0, hole.top) }} />
      <div className="coach-block" style={{ left: 0, top: hole.top + hole.height, width: '100%', bottom: 0 }} />
      <div className="coach-block" style={{ left: 0, top: hole.top, width: Math.max(0, hole.left), height: hole.height }} />
      <div className="coach-block" style={{ left: hole.left + hole.width, top: hole.top, right: 0, height: hole.height }} />
      <div className={'coach-ring' + (tappable ? ' is-tappable' : '')} style={hole} onClick={tappable && onTap ? onTap : undefined} />
      <div className="coach-card" ref={cardRef} role="dialog" aria-live="polite" key={nonce}
        style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}>
        <div className="coach-title">{icon && <Icon name={icon} size={19} />}{pick(title)}</div>
        <p className="coach-text">{pick(text)}</p>
      </div>
    </>
  );
}

// ============================================================================
// 20. БАЗОВЫЙ CSS КАНОНА
// Копируется в каждый урок Курса 0 как есть. CSS урока дописывается ОТДЕЛЬНОЙ
// строкой и склеивается в <Shell css={LESSON_CSS}> — так канон и урок не
// перемешиваются и правки одного не задевают другой.
//
// Размеры считаются от ширины И высоты окна через clamp(), без точек перелома.
// Исключение — один крупный ярус для планшета и компьютера: ребёнок за
// монитором сидит в 60–70 см от экрана против 25–30 см с планшетом, поэтому
// физический размер букв обязан быть больше.
//
// Обязательный минимум по мастер-ТЗ (раздел 11): кликабельная зона не меньше
// 44×44 px, основной текст не меньше 18 px, контраст не ниже 4.5:1.
// ============================================================================
const CSS_BASE = `
.lesson-root *, .lesson-root *::before, .lesson-root *::after { box-sizing: border-box; }

/* ПАУЗА ЗАМОРАЖИВАЕТ КАДР. Голос встаёт сам (дорожка на паузе), а CSS-анимации
   шли бы дальше: ребёнок нажал паузу, а сцена продолжает собираться.
   animation-play-state замирает на текущем кадре и с него же продолжает. */
.lesson-root.is-paused *, .lesson-root.is-paused *::before, .lesson-root.is-paused *::after {
  animation-play-state: paused !important; }
.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; }

.lesson-root {
  --pad: clamp(14px, 3.6vw, 48px);
  --limit: 960px;
  --gap-stack: clamp(10px, 1.6dvh, 18px);
  --gap-dlg: clamp(10px, 2.2vw, 20px);
  /* ШИРИНА персонажа. Кадры бывают 2:3 и 1:1, поэтому размер задаём по ширине
     и не ставим max-height — иначе object-fit добавит поля внутрь рамки и
     облако перестанет стоять по центру. */
  /* ГЕРОЙ. Размер задаём ТОЛЬКО по ширине и никогда не режем по высоте —
     иначе поднятая рука или искры уходят за край области.
     ШИРИНА ЗАДАЁТ РАМКУ, А НЕ РОБОТА. Рамка (360×490) намеренно шире самого
     робота: в движении он выходит за свои габариты на полсотни единиц вверх и
     на сорок вбок, и при тесной рамке это обрезалось краем кадра. Поэтому все
     три яруса пересчитаны с коэффициентом 1.165 — робот на экране остался
     прежнего размера, выросло только пустое поле вокруг него. */
  /* КУРС HTML: Коди v4 — диаметр кружка с головой (волны выходят за него). */
  --av: clamp(54px, min(16vw, 9dvh), 70px);
  --bar-y: clamp(6px, 1.2dvh, 11px);
  --ctl: clamp(36px, 5.4vw, 42px);          /* единый размер служебных кнопок */
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: ${T.ink}; background: ${T.bg}; height: var(--vvh, 100dvh); overflow: hidden;
  -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;
}
@media (min-width: 1440px) { .lesson-root { --limit: 1060px; } }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.stage { display: flex; flex-direction: column; height: var(--vvh, 100dvh); }
.limit { width: 100%; max-width: var(--limit); margin: 0 auto; }

/* ── ШАПКА ────────────────────────────────────────────────── */
.stage-header { flex: 0 0 auto; padding-inline: var(--pad);
  padding-top: var(--bar-y); padding-bottom: calc(var(--bar-y) * .6);
  background: ${T.bg}; position: sticky; top: 0; z-index: 20; }
/* ЕДИНАЯ ПАНЕЛЬ УПРАВЛЕНИЯ. Все служебные кнопки — одного размера, одной формы
   и в одном месте на каждой странице. Это прямое требование заказчика к
   дизайн-системе: ребёнок не должен искать кнопку заново на каждом экране. */
.chrome-side { display: flex; align-items: center; gap: clamp(4px, 1.2vw, 9px); flex: 0 0 auto; }
.ctl-btn { width: var(--ctl); height: var(--ctl); border: none; border-radius: 50%; cursor: pointer;
  flex: 0 0 auto; display: grid; place-items: center; background: ${T.paper}; color: ${T.ink2};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 6px 14px -10px rgba(${T.shadowBase},0.55);
  transition: transform .14s ease-out, box-shadow .2s, color .2s, background .2s; }
.ctl-btn:hover { color: ${T.uiDk}; }
.ctl-btn:active { transform: scale(.92); }
.ctl-btn:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.ctl-btn.is-off { color: ${T.ink3}; background: rgba(${T.shadowBase},0.07); box-shadow: none; }
/* Подсказка — единственная кнопка в ряду, которая ПОМОГАЕТ, а не управляет.
   Поэтому она жёлтая: ребёнок находит её взглядом, не читая подписей. */
.ctl-hint { color: ${T.hint}; background: ${T.hintSoft}; }
.ctl-hint:hover { color: ${T.hint}; }
.ctl-btn.is-replay { color: ${T.blueDk}; }
/* Выход к списку — только в витрине. Приглушён намеренно: он служебный и не
   должен спорить со звуком и повтором. */
.ctl-btn.is-exit { background: rgba(${T.shadowBase},0.07); box-shadow: none; color: ${T.ink2}; }
.ctl-btn.is-exit:hover { color: ${T.uiDk}; }
.ctl-btn.is-paused { background: ${T.ui}; color: #fff;
  box-shadow: 0 2px 0 ${T.uiDk}, 0 8px 18px -8px rgba(255,79,40,.36); }

/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА. Три буквы в ряд: понятнее списка и не требует чтения. */
.lang-sw { display: flex; align-items: center; gap: 2px; padding: 2px; border-radius: 99px;
  background: rgba(${T.shadowBase},0.07); flex: 0 0 auto; }
.lang-b { min-width: 26px; height: calc(var(--ctl) - 8px); padding: 0 5px; border: none; border-radius: 99px;
  background: transparent; color: ${T.ink3}; font: inherit; font-size: 11.5px; font-weight: 800;
  letter-spacing: .03em; cursor: pointer; transition: background .2s, color .2s; }
.lang-b:hover { color: ${T.ink2}; }
.lang-b.is-on { background: ${T.paper}; color: ${T.uiDk};
  box-shadow: 0 1px 0 rgba(${T.shadowBase},0.1); }
.lang-b:focus-visible { outline: 2px solid ${T.ui}; outline-offset: 1px; }
.navrow { display: flex; gap: 12px; align-items: center; position: relative; }
/* ДВЕ КНОПКИ ВНИЗУ — ОДНОГО РАЗМЕРА (заказчик, 27.09.2026: «tugma hajmi 2 xil
   bo‘lib qolgan»). У обеих одна основа flex — одна ширина, и обе тянутся на
   высоту ряда — одна высота. Подпись НЕ режется многоточием (аудит
   адаптивности 28.09: на телефоне 320 px выходило «Darsni yakunl…»): длинная
   переносится на вторую строку, и тогда выше становятся ОБЕ кнопки. Кнопка без
   пары («Darsni yakunlash», «Yordam beraman!») берёт ширину по своей подписи. */
.navrow > .btn-ghost, .navrow > .btn-accent { flex: 0 1 clamp(132px, 46%, 240px); min-width: 0;
  align-self: stretch; white-space: normal; line-height: 1.15; text-align: center;
  padding-inline: clamp(10px, 2.4vw, 22px); font-size: clamp(15px, 4.2vw, 18px); }
.navrow > span:empty + .btn-accent, .navrow > .btn-accent:only-child {
  flex: 0 1 auto; min-width: min(100%, clamp(132px, 46%, 240px)); }
.progress-track { height: 6px; border-radius: 99px; background: rgba(${T.shadowBase}, 0.10); overflow: hidden; }
.progress-bar { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.ui}, #FF8A65);
  box-shadow: 0 0 14px rgba(255,79,40,.33); transition: width .3s cubic-bezier(.4,0,.2,1); }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-top: 9px; gap: 8px; }
/* Подпись фазы НИКОГДА не переносится на вторую строку: перенос растит шапку и
   сдвигает всё содержимое вниз. На узком экране она просто укорачивается
   многоточием — панель управления важнее, её кнопки нажимают, а подпись
   только сообщает, где ты. */
.eyebrow { display: flex; align-items: center; gap: 7px; min-width: 0; flex: 0 1 auto;
  font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.eyebrow .dot { flex: 0 0 auto; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.ui}; box-shadow: 0 0 0 4px rgba(255,79,40,.1); }
/* Строка задания по центру. Ставится там, где под ней ОДИН предмет по центру —
   лист, приглашение, карточка: иначе подпись висит слева от того, к чему она
   относится. Правило жило в приватном CSS тринадцатого урока, а класс ставили
   все уроки, и в остальных он молча не работал. */
.hook-ask { text-align: center; color: ${T.ink2}; }

.counter { font-size: 12.5px; font-weight: 700; color: ${T.ink3}; flex: 0 0 auto; white-space: nowrap; }

/* ── ПЕРСОНАЖ И ОБЛАКО ────────────────────────────────────── */
.speaker-wrap { flex: 0 0 auto; padding-inline: var(--pad);
  padding-top: clamp(4px, 1.1dvh, 12px); padding-bottom: clamp(4px, 0.9dvh, 10px);
  background: ${T.bg}; z-index: 15; }
/* Герой слева, облако справа. align-items:center держит облако по центру
   персонажа — и когда выше персонаж, и когда выше текст. */
.speaker { display: flex; align-items: center; gap: var(--gap-dlg); animation: sayIn .34s cubic-bezier(.2,.8,.3,1) both; }
/* Высота зоны персонажа постоянна, поэтому карточка под ней не прыгает при
   смене позы. 1.368 — пропорция рамки героя (380×520). */
.stage-hero-fixed .speaker { min-height: var(--av); }
.speaker-bot { flex-direction: row; }
@keyframes sayIn { from { opacity:0; transform: translateY(-12px) scale(.96);} to { opacity:1; transform:none; } }
/* Влёт, затем бесконечное тихое покачивание — кадр никогда не мёртвый. */
.speaker-av { display: block; width: var(--av); flex: 0 0 auto; align-self: center; cursor: pointer;
  filter: drop-shadow(0 12px 20px rgba(${T.shadowBase},0.22));
  animation: avIn .4s cubic-bezier(.34,1.4,.5,1) both; }
/* СТРАХОВКА ОТ ОБРЕЗАНИЯ. Рамка посчитана по крайним точкам движения, но
   overflow: visible гарантирует, что даже промах в расчёте не обрежет робота
   краем кадра: SVG по умолчанию режет всё, что вышло за viewBox. */
.speaker-av .bot { display: block; width: 100%; height: auto; overflow: visible; }
@keyframes avIn { from { opacity:0; transform: translateY(10px) scale(.9);} to { opacity:1; transform:none; } }
@keyframes idleFloat { 0%, 100% { translate: 0 0; rotate: -0.7deg; } 50% { translate: 0 -5px; rotate: 0.7deg; } }

/* ── ЖИЗНЬ РОБОТА · моушн-лист ────────────────────────────────
   Порт моушн-листа заказчика (2026-08-25). Каждое состояние это ТРИ вещи:
   поза (transition), такт (@keyframes) и свой тайминг.

   ПОЧЕМУ СЛОИ ВЛОЖЕНЫ. Одна группа не может нести и transition позы, и
   бесконечную анимацию такта: анимация побеждает, и переход между
   состояниями становится мгновенным. Поэтому у тела, головы и рук по два
   узла — bot-pose-* и bot-beat-*.

   ПРАВИЛО ТРЁХ СЛОЁВ. Первичное движение (корпус), вторичное с задержкой
   90–140 мс (руки, голова, глаза) и фоновое (парение, свечение, тень).
   Живым героя делает именно СДВИГ вторичного слоя, а не амплитуда.

   Все такты медленнее 3 Гц — порога, за которым мигание опасно (WCAG 2.3.1).
   Самый быстрый здесь — дрожь 130 мс, и она не мигание, а смещение на 2 px.
   ────────────────────────────────────────────────────────────── */

/* Точка отсчёта для всех transform внутри робота. Без fill-box проценты
   считались бы от системы координат SVG, а не от самой фигуры. */
.bot g, .bot path, .bot rect, .bot ellipse, .bot circle { transform-box: fill-box; }

/* ── ФОНОВЫЙ СЛОЙ: парение и тень ── */
.bot-float { transform-origin: 50% 100%; animation: botFloat 4200ms ease-in-out infinite; }
@keyframes botFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
.bot-shadow { transform-origin: 50% 50%;
  transform: scale(var(--shadowS), var(--shadowS)); opacity: var(--shadowO);
  animation: botShadow 4200ms ease-in-out infinite;
  transition: transform var(--dur) var(--ease) 50ms, opacity var(--dur) ease 50ms; }
@keyframes botShadow {
  0%, 100% { transform: scale(var(--shadowS), var(--shadowS)); }
  50% { transform: scale(calc(var(--shadowS) * .9), calc(var(--shadowS) * .84)); }
}

/* ── ПОЗЫ: то, что переходит плавно ── */
.bot-pose-body { transform-origin: 50% 100%;
  transform: translate(var(--bodyX), var(--bodyY)) rotate(var(--bodyRot)) scale(var(--bodySX), var(--bodySY));
  transition: transform var(--dur) var(--ease); }
.bot-beat-body { transform-origin: 50% 100%; }
/* Голова отстаёт на 40 мс, руки на 90 мс — это и есть вторичный слой. */
.bot-pose-head { transform-origin: 50% 100%;
  transform: translate(var(--headX), var(--headY)) rotate(var(--headRot));
  transition: transform calc(var(--dur) * 1.12) var(--ease) 40ms; }
.bot-beat-head { transform-origin: 50% 100%; }
.bot-pose-arm-l, .bot-pose-arm-r { transition: transform calc(var(--dur) * 1.2) var(--ease) 90ms; }
.bot-pose-arm-l { transform-origin: 50% 7%; transform: translate(var(--armLX), var(--armLY)) rotate(var(--armLR)); }
.bot-pose-arm-r { transform-origin: 50% 7%; transform: translate(var(--armRX), var(--armRY)) rotate(var(--armRR)); }
.bot-beat-arm-l, .bot-beat-arm-r { transform-origin: 50% 7%; }
.bot-pose-eyes { transform-origin: 50% 50%;
  transform: translate(var(--eyeX), var(--eyeY)) scale(var(--eyeSX), var(--eyeSY));
  transition: transform calc(var(--dur) * 1.05) var(--ease) 30ms; }

/* ВЕКИ. Наклон внешних углов и есть выражение: вниз — тяжело, вверх — сердито.
   Курс использует только первое, и только когда ошибся сам робот. */
.bot-lid { transition: transform calc(var(--dur) * .92) var(--ease) 25ms; }
.bot-lid-l { transform-origin: 50% 50%; transform: translateY(var(--lidY)) rotate(var(--lidRotL)); }
.bot-lid-r { transform-origin: 50% 50%; transform: translateY(var(--lidY)) rotate(var(--lidRotR)); }

/* МОРГАНИЕ раз в 5.4 с — 0.18 Гц. В позах с глазами-дугами и звёздами моргать
   нечем, там оно снимается классом. */
.bot-blink { transform-origin: 50% 0%; transform: scaleY(0);
  animation: botBlink 5400ms linear infinite; }
.bot.no-blink .bot-blink { animation: none; }
@keyframes botBlink {
  0%, 95% { transform: scaleY(0); }
  96.2%, 97.6% { transform: scaleY(1); }
  99%, 100% { transform: scaleY(0); }
}

/* СВЕЧЕНИЕ. Единственный источник «жизни» на белом корпусе, поэтому оно
   настоящее размытие, а не нарисованный кружок. */
.bot-glow { filter: blur(11px); opacity: var(--glow);
  animation: botGlowBreath 3400ms ease-in-out infinite;
  transition: opacity calc(var(--dur) * 1.4) ease; }
@keyframes botGlowBreath { 0%, 100% { opacity: calc(var(--glow) * .78); } 50% { opacity: var(--glow); } }
/* Пока идёт речь, шов на корпусе пульсирует чаще: у робота нет рта, и шов
   работает честным индикатором «я сейчас говорю». */
.bot.is-talking .bot-seam { animation: botSeamTalk 900ms ease-in-out infinite; }
@keyframes botSeamTalk { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
.bot-blush { opacity: var(--blush); transition: opacity calc(var(--dur) * 1.6) ease 80ms; }

/* ── РЕЖИМЫ ГЛАЗ ── */
.bot .ring, .bot .star, .bot .arc { opacity: 0; }
.bot .pupil, .bot .ring, .bot .star, .bot .arc { transition: opacity 170ms ease; }
.bot.eyes-ring .pupil { opacity: 0; } .bot.eyes-ring .ring { opacity: 1; }
.bot.eyes-star .pupil { opacity: 0; } .bot.eyes-star .star { opacity: 1; }
.bot.eyes-arc  .pupil { opacity: 0; } .bot.eyes-arc  .arc  { opacity: 1; }
.bot .spark { opacity: 0; transform-origin: 50% 50%; }

/* ── ТАКТЫ ПО СОСТОЯНИЯМ ── */
.bot.loop-bob    .bot-beat-body { animation: botBob var(--loop) ease-in-out infinite; }
.bot.loop-sag    .bot-beat-body { animation: botSag var(--loop) cubic-bezier(.65,0,.35,1) infinite; }
.bot.loop-pop    .bot-beat-body { animation: botPopIn var(--loop) cubic-bezier(.16,1,.3,1) infinite; }
.bot.loop-hop    .bot-beat-body { animation: botHop var(--loop) cubic-bezier(.34,1.4,.64,1) infinite; }
.bot.loop-lean   .bot-beat-body { animation: botLean var(--loop) cubic-bezier(.4,0,.2,1) infinite; }
.bot.loop-ponder .bot-beat-body { animation: botPonder var(--loop) ease-in-out infinite; }
.bot.loop-ponder .bot-beat-arm-r { animation: botTap var(--loop) ease-in-out infinite; }
.bot.loop-fidget .bot-beat-arm-l { animation: botFidget var(--loop) ease-in-out infinite; }
.bot.loop-fidget .bot-beat-arm-r { animation: botFidget var(--loop) ease-in-out infinite reverse; }
.bot.loop-cheer  .bot-beat-body { animation: botCheer var(--loop) cubic-bezier(.34,1.5,.64,1) infinite; }
.bot.loop-cheer  .spark { animation: botSparkle var(--loop) ease-out infinite; }
.bot.loop-wave   .bot-beat-arm-r { animation: botWave calc(var(--loop) / 3) cubic-bezier(.45,0,.55,1) infinite; }
.bot.loop-wave   .bot-beat-body { animation: botBob var(--loop) ease-in-out infinite; }
.bot.loop-bye    .bot-beat-arm-r { animation: botWaveSoft calc(var(--loop) / 2) cubic-bezier(.4,0,.2,1) infinite; }
.bot.loop-bye    .bot-beat-body { animation: botDrift var(--loop) cubic-bezier(.3,0,1,1) infinite; }
.bot.loop-peer   .bot-beat-body { animation: botPeer var(--loop) cubic-bezier(.34,1.2,.64,1) infinite; }
.bot.loop-open   .bot-beat-body { animation: botBreathe var(--loop) ease-in-out infinite; }
.bot.loop-open   .bot-beat-arm-l { animation: botOpenL var(--loop) ease-in-out infinite; }
.bot.loop-open   .bot-beat-arm-r { animation: botOpenR var(--loop) ease-in-out infinite; }

@keyframes botBob { 0%, 100% { transform: translateY(0) scaleY(1); } 45% { transform: translateY(-7px) scaleY(1.02); } }
@keyframes botSag { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(6px) scaleY(.982); } }
/* Приседание в антиципацию, вылет с растяжением, посадка со сжатием.
   Объём при этом сохраняется — squash and stretch. */
@keyframes botPopIn {
  0% { transform: translateY(0) scale(1, 1); }
  7% { transform: translateY(3px) scale(1.05, .95); }
  16% { transform: translateY(-13px) scale(.95, 1.07); }
  30% { transform: translateY(0) scale(1.03, .98); }
  42%, 100% { transform: translateY(0) scale(1, 1); }
}
@keyframes botHop {
  0% { transform: translateY(0) scale(1, 1); }
  9% { transform: translateY(4px) scale(1.06, .93); }
  25% { transform: translateY(-20px) scale(.94, 1.08); }
  41% { transform: translateY(0) scale(1.06, .94); }
  53% { transform: translateY(-11px) scale(.98, 1.04); }
  67% { transform: translateY(0) scale(1.03, .97); }
  80%, 100% { transform: translateY(0) scale(1, 1); }
}
@keyframes botLean { 0%, 100% { transform: translateX(0) rotate(0); } 50% { transform: translateX(7px) rotate(-3deg); } }
@keyframes botPonder { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-3.5deg); } }
@keyframes botTap { 0%, 100% { transform: rotate(0); } 18% { transform: rotate(-8deg); }
  36% { transform: rotate(0); } 54% { transform: rotate(-8deg); } 72% { transform: rotate(0); } }
@keyframes botFidget { 0%, 100% { transform: translate(0, 0); }
  30% { transform: translate(-3px, 2px); } 60% { transform: translate(2px, -1px); } }
@keyframes botCheer {
  0% { transform: translateY(0) scale(1, 1); }
  10% { transform: translateY(5px) scale(1.08, .91); }
  28% { transform: translateY(-26px) scale(.92, 1.11); }
  46% { transform: translateY(0) scale(1.08, .93); }
  60% { transform: translateY(-13px) scale(.98, 1.04); }
  74% { transform: translateY(0) scale(1.03, .98); }
  86%, 100% { transform: translateY(0) scale(1, 1); }
}
/* Три взмаха за цикл: меньше выглядит вяло, больше — навязчиво. */
@keyframes botWave { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(18deg); }
  50% { transform: rotate(-5deg); } 75% { transform: rotate(15deg); } }
@keyframes botWaveSoft { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(12deg); }
  62% { transform: rotate(-4deg); } }
@keyframes botDrift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(11px, -9px); } }
@keyframes botPeer { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(9px) rotate(-4deg); } }
@keyframes botBreathe { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.018, 1.022); } }
@keyframes botOpenL { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(7deg); } }
@keyframes botOpenR { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
@keyframes botSparkle {
  0%, 72% { opacity: 0; transform: scale(.4); }
  12% { opacity: 1; transform: scale(1); }
  40% { opacity: 0; transform: scale(.55); }
  100% { opacity: 0; transform: scale(.4); }
}
.speaker-bubble { background: ${T.paper}; border-radius: 18px;
  padding: clamp(9px, 1.7vw, 14px) clamp(11px, 2vw, 16px);
  font-size: clamp(15px, 2.3vw, 18px); line-height: 1.4; font-weight: 500;
  flex: 1 1 auto; min-width: 0; align-self: center; max-height: min(22dvh, 190px); overflow-y: auto;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5); }
.speaker-bot .speaker-bubble { border-bottom-left-radius: 6px;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 3px 0 0 ${T.ui}; }

/* «Послушать ещё раз». Живёт вместо облака, когда реплику ведёт голос: экран
   в это время чистый, ребёнок смотрит на сцену, а не читает за роботом.
   Это НЕ тумблер звука — она только переигрывает. */
.speaker-voice { width: var(--ctl); height: var(--ctl); flex: 0 0 auto; border: none; border-radius: 50%; cursor: default;
  display: grid; place-items: center; background: ${T.paper}; color: ${T.ui};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 10px 20px -12px rgba(${T.shadowBase},0.55);
  transition: transform .14s ease-out, box-shadow .2s; }
.speaker-voice:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.sv-bars { display: flex; align-items: center; gap: 3px; height: 20px; }
.sv-bars i { width: 3px; height: 6px; border-radius: 2px; background: currentColor; }
/* Полоски пляшут, только пока реально идёт звук — иначе кнопка врёт о состоянии. */
.speaker-voice.is-on .sv-bars i { animation: svBar .9s ease-in-out infinite; }
.speaker-voice.is-on .sv-bars i:nth-child(2) { animation-delay: .12s; }
.speaker-voice.is-on .sv-bars i:nth-child(3) { animation-delay: .24s; }
.speaker-voice.is-on .sv-bars i:nth-child(4) { animation-delay: .36s; }
.speaker-voice.is-on .sv-bars i:nth-child(5) { animation-delay: .48s; }
@keyframes svBar { 0%,100% { height: 6px; } 50% { height: 19px; } }
/* Реплика убрана с экрана, но экранному диктору она по-прежнему нужна. */
.sv-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* Экран, где герой один и крупный: строка с маленьким героем спрятана, но
   ЖИВА — иначе оборвалась бы озвучка, которую она ведёт. */
.stage-bare .speaker-wrap { position: absolute; width: 1px; height: 1px; padding: 0; margin: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* ── ЭКРАН ЖДЁТ, ПОКА ГЕРОЙ ГОВОРИТ ─────────────────────────
   Кнопки на это время заперты — так требует заказчик: нажал, дослушал, и
   только потом доступна следующая. Но серая мёртвая кнопка читается как
   поломка, особенно у ребёнка, который привык, что телефон отзывается всегда.
   Поэтому заблокированное на время реплики выглядит ОТДЫХАЮЩИМ: чуть тише,
   без тени, без подсветки — и возвращается к жизни, как только герой замолчал.
   Переход медленный в обе стороны, чтобы это читалось как дыхание экрана. */
.stage.is-speaking .stage-content button:disabled,
.stage.is-speaking .stage-content label { opacity: .62; filter: saturate(.75); }
.stage.is-speaking .stage-content button:disabled { box-shadow: none; }
.stage-content button:disabled, .stage-content label {
  transition: opacity .45s ease-out, filter .45s ease-out, box-shadow .3s; }
/* Решённое и правильное не гасим: галочка и зелёная рамка должны оставаться
   яркими — это награда, а не отключённый элемент. */
.stage.is-speaking .stage-content .is-ok,
.stage.is-speaking .stage-content .is-done,
.stage.is-speaking .stage-content .is-on { opacity: 1; filter: none; }

/* ── КОНТЕНТ ──────────────────────────────────────────────── */
/* ПРОКРУТКИ НЕТ. Заказчик: «Скролл в уроке не должен появляться» — ни на одной
   странице, ни на одном размере экрана. Поэтому область контента НЕ скроллится
   вовсе: overflow: hidden. Если содержимое не влезает, оно обязано ужаться
   (см. .stack и эластичные блоки), а не уехать под кнопки. */
.stage-content { flex: 1 1 auto; min-height: 0; overflow: hidden;
  display: flex; flex-direction: column; align-items: center;
  padding-inline: var(--pad); padding-bottom: 6px; }
/* Распорки сверху и снизу распределяют свободную высоту. Верхняя чуть меньше
   нижней — содержимое стоит на волосок выше геометрического центра, так оно
   читается как «сцена», а не как надпись посреди пустого поля.
   Потолок верхней распорки поднят: при прежних 84 px на невысоких сценах
   (крючок, миссия) вся лишняя высота уходила ВНИЗ, и под композицией зияла
   пустая треть экрана, а сама сцена жалась к шапке. */
.stage-content::before { content: ''; flex: 1 1 0; max-height: clamp(4px, 30dvh, 260px); }
.stage-content::after { content: ''; flex: 1.15 1 0; }
.stage-content.has-speaker::before { max-height: clamp(2px, 26dvh, 230px); }
/* Стопке разрешено сжиматься, но сжимаются в ней только те блоки, которые
   помечены как эластичные. Текст, кнопки и карточки держат свой размер. */
.stack { flex: 0 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; gap: var(--gap-stack); }
.stack > * { flex-shrink: 0; min-height: 0; }
/* ИСКЛЮЧЕНИЕ. Крупный интерактивный блок экрана (песочница, рамка открытки)
   сжиматься ОБЯЗАН. Без этого на окне 1280x720 редактор занимал 541 px при
   доступных 352 px: клавиатура целиком уходила под нижний край, и ребёнок
   физически не мог печатать. Текст, кнопки и карточки по-прежнему держат
   свой размер — сжимается только то, что переживёт уменьшение. */
.stack > .ed-wrap, .stack > .work-pair, .stack > .result-card,
.stack > .why, .stack > .steps, .stack > .inv, .stack > .crt,
.stack > .dz, .stack > .box { flex: 0 1 auto; min-height: 0; }
.stage-nav { flex: 0 0 auto; padding-inline: var(--pad);
  padding-top: calc(var(--bar-y) * .8); padding-bottom: var(--bar-y); background: ${T.bg};
  box-shadow: 0 -10px 24px -12px rgba(${T.shadowBase}, 0.22); }

/* ── ТИПОГРАФИКА ──────────────────────────────────────────── */
.h1 { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(19px, 3.4vw, 27px);
  line-height: 1.24; font-weight: 600; letter-spacing: -0.01em; }
.lead { font-size: clamp(18px, 2.5vw, 19px); line-height: 1.55; color: ${T.ink2}; }
.ask { font-size: clamp(16px, 2.4vw, 19px); line-height: 1.35; font-weight: 700; }
/* Вспомогательная строка под заданием: мельче и тише основного вопроса. */
.hint-line { font-size: clamp(14px, 1.9vw, 16px); color: ${T.ink2}; font-weight: 600; }

/* ── КНОПКИ ───────────────────────────────────────────────── */
.opt, .chip-btn, .btn-accent, .btn-ghost { transition: transform .14s ease-out, box-shadow .2s, background .2s; }
.btn-ghost:active:not(:disabled), .opt:active:not(:disabled) { transform: scale(.96); transition: transform .1s ease-out; }

.btn-accent, .btn-ghost { font: inherit; font-weight: 700; border-radius: 14px; cursor: pointer;
  border: none; padding: 13px 26px; font-size: 16px; min-height: 50px; }
.btn-accent { position: relative; z-index: 0; background: ${T.paper}; color: ${T.uiDk};
  transition: transform .18s ease-out, box-shadow .2s, background .25s, color .25s;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), 0 10px 22px -12px rgba(255,79,40,.36), inset 0 0 0 2px ${T.uiSoft}; }
.btn-accent::after { content: ''; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
  background: ${T.ui}; opacity: 0; }
.btn-accent[data-ring]::after { animation: ringOut .46s cubic-bezier(.2,.7,.3,1) both; }
@keyframes ringOut { from { transform: scale(1); opacity: .38; } to { transform: scaleX(1.34) scaleY(1.5); opacity: 0; } }
.btn-accent:hover:not(:disabled) { transform: translateY(-2px);
  box-shadow: 0 4px 0 rgba(${T.shadowBase},0.08), 0 16px 30px -14px rgba(255,79,40,.45), inset 0 0 0 2px ${T.ui}; }
.btn-accent:active:not(:disabled) { transform: translateY(0); }
.btn-accent:disabled { opacity: .38; cursor: not-allowed; transform: none;
  box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.12); color: ${T.ink3}; }
/* ОТКРЫВШАЯСЯ КНОПКА ЗОВЁТ САМА. Ребёнок 8 лет не сканирует экран в поисках
   того, что изменилось: разблокировка обязана быть событием, а не отсутствием
   серого. Поэтому кнопка наливается цветом и дышит. */
.btn-accent.btn-ready { background: ${T.ui}; color: #fff;
  box-shadow: 0 3px 0 ${T.uiDk}, 0 14px 26px -12px rgba(255,79,40,.45);
  animation: readyPulse 1.8s ease-in-out infinite; }
.btn-accent.btn-ready:hover { background: ${T.uiDk}; }
@keyframes readyPulse { 0%,100% { box-shadow: 0 3px 0 ${T.uiDk}, 0 14px 26px -12px rgba(255,79,40,.45); }
  50% { box-shadow: 0 3px 0 ${T.uiDk}, 0 14px 26px -12px rgba(255,79,40,.45), 0 0 0 8px rgba(255,79,40,.08); } }
.btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.14); }
.btn-accent:focus-visible, .btn-ghost:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }

.bigbtn { align-self: center; width: 100%; max-width: 360px; padding: 15px 18px; border: none; border-radius: 18px;
  background: ${T.ui}; color: #fff; font: inherit; font-size: clamp(16px, 3vw, 18px); font-weight: 800;
  cursor: pointer; min-height: 52px;
  box-shadow: 0 5px 0 ${T.uiDk}, 0 16px 28px -14px rgba(255,79,40,.45); }
.bigbtn:active { transform: translateY(2px); box-shadow: 0 3px 0 ${T.uiDk}; }
.bigbtn-ghost { background: ${T.paper}; color: ${T.uiDk};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), inset 0 0 0 2.5px ${T.uiSoft}; }
.bigbtn-ghost:active { box-shadow: inset 0 0 0 2.5px ${T.ui}; }
.bigbtn:focus-visible { outline: 3px solid ${T.uiDk}; outline-offset: 3px; }

/* ── ВАРИАНТЫ ОТВЕТА ──────────────────────────────────────── */
.ic { display: block; flex-shrink: 0; }
.fit-line { display: block; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.opts { display: flex; flex-direction: column; gap: 10px; }
.opts .opt { width: 100%; align-self: stretch; }
/* Вариант-картинка (мини-лист) шире и выше: сравнивать надо изображение,
   а не строку, поэтому карточка перестаёт быть строкой. */
.opts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr)); }
.opt { position: relative; overflow: hidden;
  display: flex; align-items: center; gap: 14px; text-align: left; width: 100%; padding: 0 18px;
  border: 2px solid transparent; border-radius: 15px; background: ${T.paper};
  font: inherit; font-size: 16px; line-height: 1.4;
  font-weight: 600; color: ${T.ink}; cursor: pointer; min-height: 60px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(80,65,45,.07);
  transition: border-color .25s, box-shadow .25s, background .3s, color .3s, transform .18s; }
/* Блик пробегает по ряду с отставанием — ряд читается как живой, а не как
   список. Гаснет, как только на вопрос ответили. */
.opt::after { content: ''; position: absolute; top: 0; bottom: 0; width: 130px; pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255,79,40,.07), transparent);
  transform: translateX(-160px); animation: optSweep 3s ease-in-out infinite; }
.opt:nth-child(2)::after { animation-delay: .35s; }
.opt:nth-child(3)::after { animation-delay: .7s; }
.opt:nth-child(4)::after { animation-delay: 1.05s; }
@keyframes optSweep { 0%, 60% { transform: translateX(-160px); } 100% { transform: translateX(830px); } }
.opt:hover:not(:disabled) { border-color: ${T.ui}; box-shadow: 0 8px 20px rgba(255,79,40,.1); transform: translateY(-2px); }
.opt:hover:not(:disabled) .opt-mark { background: ${T.ui}; color: #fff; }
.opt:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.opt-mark { width: 30px; height: 30px; flex-shrink: 0; border-radius: 9px; background: #F1F1F3;
  display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800;
  color: ${T.ink3}; transition: background .25s, color .25s, border-radius .25s; }
.opt-node { flex: 1; min-width: 0; display: flex; justify-content: center; padding: 12px 0; }
/* Неверный: ряд вздрагивает и обводка розовеет — но текст не краснеет и креста
   нет. Ошибка у нас разбирается голосом Симки, а не отчитывается цветом. */
.opt-wrong { animation: shake .4s; border-color: #E0A0A0; }
/* Погасший: цветом, а не прозрачностью — вариант должен остаться читаемым,
   ребёнок возвращается к нему глазами, пока Симка разбирает. */
.opt-dead { background: #F0ECE6; color: #B4B0AA; box-shadow: none; cursor: default; }
.opt-dead .opt-mark { background: #E4E0DA; color: #B4B0AA; border-radius: 50%; }
.opt-ok { background: #EAF7EE; border-color: #3E8E5A; animation: okPop .38s; }
.opt-ok .opt-mark { background: #34A853; color: #fff; border-radius: 50%; }
.opt-picked { background: ${T.blueSoft}; border-color: ${T.blue}; animation: okPop .38s; }
.opt-picked .opt-mark { background: ${T.blue}; color: #fff; border-radius: 50%; }
.answered .opt { cursor: default; }
.answered .opt::after { animation: none; opacity: 0; }
.answered .opt:hover { transform: none; border-color: transparent; box-shadow: 0 2px 8px rgba(80,65,45,.07); }
.answered .opt-ok:hover { border-color: #3E8E5A; }
.answered .opt-picked:hover { border-color: ${T.blue}; }
@keyframes shake { 0%,100% { transform: translateX(0);} 25% { transform: translateX(-7px);} 75% { transform: translateX(7px);} }
@keyframes okPop { 0% { transform: scale(1);} 45% { transform: scale(1.05);} 100% { transform: scale(1.02);} }

/* ── ОТКЛИК НА ВЕРНО И НА «НЕ ПОДОШЛО» ────────────────────────
   Заказчик просил добавить эффекты на оба исхода по всему уроку. Правило
   курса при этом не меняется: неверный ответ — НЕ провал. Поэтому «не
   подошло» получает мягкое покачивание и тёплую подсветку, а не красный
   крест; звук на нём тоже мягкий, нисходящий, без резкости (см. sfx 'soft').

   Оба эффекта — ОДИН класс на любую коробку урока, чтобы отклик был
   одинаковым и на вариантах ответа, и на кнопках инструментов, и на
   украшениях. Разный отклик в разных заданиях ребёнок читает как разные
   правила игры. */
.fx-ok { position: relative; animation: okPop .38s; }
.fx-ok::after { content: ''; position: absolute; inset: -3px; border-radius: inherit;
  pointer-events: none; border: 2px solid ${T.success}; opacity: 0;
  animation: okRing .62s cubic-bezier(.2,.8,.3,1) 1; }
@keyframes okRing {
  0% { transform: scale(.92); opacity: .9; }
  100% { transform: scale(1.16); opacity: 0; }
}
.fx-no { animation: shake .4s; }
.fx-no::after { content: ''; position: absolute; inset: 0; border-radius: inherit;
  pointer-events: none; background: ${T.hintSoft}; opacity: 0;
  animation: noFlash .5s ease-out 1; }
@keyframes noFlash { 0% { opacity: .8; } 100% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .fx-ok::after, .fx-no::after { animation: none !important; opacity: 0 !important; }
  .fx-no { animation: none !important; }
}

/* ── ПОДСКАЗКА И РАЗБОР ───────────────────────────────────── */
/* Жёлтый канал, не красный. Это НЕ «ошибка» — это помощь. */
.note { border-radius: 16px; padding: 14px 16px; animation: noteIn .25s ease-out both; }
.note-hint { background: ${T.hintSoft}; box-shadow: inset 3px 0 0 ${T.hint}; }
.note-ok { background: ${T.successSoft}; box-shadow: inset 3px 0 0 ${T.success}; }
.note-lbl { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .09em; margin-bottom: 5px; }
.note-hint .note-lbl { color: ${T.hint}; }
.note-ok .note-lbl { color: ${T.success}; }
.note-body { font-size: clamp(18px, 2.4vw, 19px); line-height: 1.5; }
@keyframes noteIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform:none; } }
/* ЛЕСЕНКА. Показываем все открытые ступени, а не только последнюю: вторая
   подсказка опирается на первую и без неё читается как отдельная фраза.
   Прошлые ступени приглушены — свежая всегда читается первой. */
.ladder { display: flex; flex-direction: column; gap: 8px; }
.ladder .note-old { opacity: .62; }
.ladder .note-old .note-body { font-size: clamp(16px, 2.1vw, 17px); }

/* ── COACH-MARK (режим ведения) ───────────────────────────── */
.coach-block { position: fixed; background: rgba(14,14,16,0.62); z-index: 60; }
.coach-hole { position: fixed; border-radius: 16px; z-index: 61; pointer-events: none; }
.coach-ring { position: fixed; border-radius: 16px; z-index: 62; pointer-events: none;
  box-shadow: 0 0 0 3px ${T.ui}, 0 0 0 9px rgba(255,79,40,.18); animation: ringPulse 1.6s ease-in-out infinite; }
.coach-ring.is-tappable { pointer-events: auto; cursor: pointer; }
@keyframes ringPulse { 0%,100% { box-shadow: 0 0 0 3px ${T.ui}, 0 0 0 9px rgba(255,79,40,.18);}
  50% { box-shadow: 0 0 0 3px ${T.ui}, 0 0 0 14px rgba(255,79,40,.07);} }
.coach-card { position: fixed; z-index: 63; max-width: min(340px, calc(100vw - 24px));
  background: ${T.paper}; border-radius: 18px; padding: 14px 16px;
  box-shadow: 0 18px 40px -14px rgba(${T.shadowBase},0.7); animation: fadeUp .3s cubic-bezier(.2,.8,.3,1) both; }
.coach-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; margin-bottom: 5px; color: ${T.uiDk}; }
.coach-text { font-size: 16px; line-height: 1.5; color: ${T.ink2}; }

/* ── ПОЯВЛЕНИЯ ────────────────────────────────────────────── */
.fade-up { animation: fadeUp .25s cubic-bezier(.2,.7,.3,1) both; }
@keyframes fadeUp { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform:none; } }
.stagger > * { animation: fadeUp .25s cubic-bezier(.2,.7,.3,1) both; }
.stagger > *:nth-child(1) { animation-delay: 0s; }    .stagger > *:nth-child(2) { animation-delay: .05s; }
.stagger > *:nth-child(3) { animation-delay: .10s; }  .stagger > *:nth-child(4) { animation-delay: .15s; }
.stagger > *:nth-child(5) { animation-delay: .20s; }  .stagger > *:nth-child(6) { animation-delay: .25s; }

/* Очень узкий экран: подпись фазы уходит совсем. Кнопки управления и счётчик
   нужнее — по ним ребёнок действует, а фазу он и так слышит от героя. */
@media (max-width: 440px) {
  .eyebrow { display: none; }
}

/* ── КЛАВИАТУРА ТЕЛЕФОНА ПОДНЯТА ──────────────────────────────
   Видимой высоты осталось меньше половины. Герой сворачивается: пока ребёнок
   печатает, важнее видеть лист и то, что на нём получается. Реплика при этом
   продолжает звучать — сворачивается картинка, а не голос. */
.is-kbd .speaker-av { display: none; }
.is-kbd .speaker-bubble { max-height: 18dvh; font-size: 15px; }
.is-kbd .stage-nav { padding-block: 4px; }
.is-kbd .btn-accent, .is-kbd .btn-ghost { min-height: 44px; padding: 8px 16px; }

/* Низкое окно (маленький ноутбук, планшет в альбомной): панели и кнопки
   поджимаются, чтобы всё помещалось без прокрутки. */
@media (max-height: 620px) {
  .lesson-root { --gap-stack: clamp(7px, 1.3dvh, 12px); --av: clamp(48px, min(15vw, 9dvh), 60px); }
  .btn-accent, .btn-ghost { min-height: 46px; padding: 10px 20px; }
  .opt { min-height: 50px; }
  .bigbtn { padding: 11px 16px; min-height: 46px; }
  .speaker-bubble { max-height: 26dvh; }
}

/* ── КРУПНЫЙ ЯРУС: планшет и компьютер ────────────────────────
   Базовые clamp'ы кончаются на планшетных потолках и выше не растут. На
   мониторе это давало ту же физическую высоту букв, что и на планшете, хотя
   ребёнок сидит вдвое дальше. Растут dvh-составляющие и потолки; vw-множители
   остаются базовыми, иначе на узком и высоком окне размеры наоборот падают.
   Высоты повторяющихся строк НЕ растут: прибавка множится на число карточек и
   уносит содержимое под кнопку «Дальше». */
@media (min-width: 760px) and (min-height: 700px) {
  .lesson-root {
    --pad: clamp(28px, 3.6vw, 76px);
    --gap-stack: clamp(11px, 1.7dvh, 20px);
    --gap-dlg: clamp(18px, 2.4vw, 32px);
    /* КУРС HTML: кружок Коди v4 на крупном ярусе. */
    --av: clamp(72px, min(9vw, 10.5dvh), 108px);
    --av-lg: clamp(157px, min(37.2vw, 26dvh), 354px);
    --bar-y: clamp(8px, 1.5dvh, 15px);
  }
  .progress-track { height: clamp(6px, .9dvh, 10px); }
  .eyebrow { font-size: clamp(12px, 1.8vw, 15px); }
  .counter { font-size: clamp(13px, 1.9vw, 16px); }
  .dot { width: 9px; height: 9px; }
  .pause-btn { width: clamp(44px, 5vw, 50px); height: clamp(44px, 5vw, 50px); }
  .speaker-voice { width: clamp(56px, 6vw, 66px); height: clamp(56px, 6vw, 66px); }
  .h1 { font-size: clamp(30px, 4.2vw, 44px); }
  .lead { font-size: clamp(19px, 2.4vw, 24px); }
  .ask { font-size: clamp(20px, 2.5vw, 25px); }
  .speaker-bubble { font-size: clamp(19px, 2.5vw, 24px); border-radius: 24px;
    padding: clamp(15px, 1.9vw, 22px) clamp(19px, 2.6vw, 28px); }
  .btn-accent, .btn-ghost { font-size: clamp(16px, 2.3vw, 21px); border-radius: 18px;
    min-height: clamp(52px, 6.6dvh, 62px); padding: clamp(11px, 1.3dvh, 15px) clamp(26px, 3.4vw, 40px); }
  .bigbtn { font-size: clamp(18px, 2.5vw, 24px); max-width: 480px; border-radius: 22px;
    padding: clamp(15px, 1.6dvh, 20px) 22px; }
  .opt { font-size: clamp(16px, 2.3vw, 21px); gap: 16px;
    padding: 0 clamp(16px, 2.2vw, 24px); border-radius: 19px; }
  .opt-mark { width: clamp(32px, 3.8vw, 40px); height: clamp(32px, 3.8vw, 40px);
    border-radius: 12px; font-size: clamp(14px, 1.9vw, 18px); }
  .note { padding: clamp(14px, 1.9vw, 20px) clamp(16px, 2.4vw, 26px); border-radius: 20px; }
  .note-lbl { font-size: clamp(12px, 1.6vw, 15px); }
  .note-body { font-size: clamp(19px, 2.2vw, 22px); }
  .coach-card { max-width: min(440px, calc(100vw - 40px));
    padding: clamp(14px, 2vw, 22px) clamp(16px, 2.5vw, 28px); }
  .coach-title { font-size: clamp(16px, 2.2vw, 21px); }
  .coach-text { font-size: clamp(16px, 2.1vw, 20px); }
}

/* Мигание не чаще 3 раз в секунду (мастер-ТЗ, доступность) — все анимации
   урока это соблюдают: самая быстрая повторяется раз в 0.9 с. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  /* Кнопка перестаёт пульсировать, но обязана остаться заметной. */
  .btn-accent.btn-ready { background: ${T.ui}; color: #fff; }
  /* РОБОТ ЗАМИРАЕТ В ПОЗЕ, А НЕ В СТОЙКЕ СМИРНО. Такты и парение снимаются,
     позы остаются: радость должна читаться радостью и без движения.
     Переходы делаем мгновенными — «спокойный режим» из моушн-листа. */
  .bot { --dur: 1ms !important; }
  .bot-float, .bot-shadow, .bot-blink, .bot-glow, .spark,
  .bot-beat-body, .bot-beat-head, .bot-beat-arm-l, .bot-beat-arm-r {
    animation: none !important; }
  /* Моргание замирает ОТКРЫТЫМ глазом, а не закрытым. */
  .bot-blink { transform: scaleY(0) !important; }
  .bot-glow { opacity: var(--glow) !important; }
  .bot-confetti > * { transform: none !important; opacity: 1 !important; }
}

/* ══════════════════════════════════════════════════════════════
   ПОДСКАЗКА — единый компонент для всех уроков
   Кнопка компактная и стоит В РЯДУ НАВИГАЦИИ, а не растянута во всю ширину.
   Содержимое открывается карточкой ПОВЕРХ экрана: дописанное снизу удлиняло
   страницу и рождало прокрутку, которой в уроке быть не должно.
   ══════════════════════════════════════════════════════════════ */
.hint-b { display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto;
  min-height: 44px; padding: 0 clamp(12px, 2.2vw, 18px); border: none; border-radius: 14px;
  background: ${T.paper}; color: ${T.hint}; font: inherit; font-size: clamp(14px, 2vw, 16px);
  font-weight: 800; cursor: pointer; margin-left: auto;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 2px ${T.hintSoft};
  transition: color .2s, box-shadow .2s, background .3s; }
.hint-b:hover { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 2px ${T.hint}; }
.hint-b:focus-visible { outline: 3px solid ${T.hint}; outline-offset: 3px; }
/* Ребёнок застрял и ничего не делает ~18 секунд — кнопка мягко мигает.
   Именно мягко: приглашение, а не тревога. Цикл 1.6 с, это заметно ниже
   порога 3 Гц из требований доступности. */
.hint-b.is-nudge { animation: hintNudge 1.6s ease-in-out infinite; }
@keyframes hintNudge {
  0%, 100% { background: ${T.paper}; color: ${T.hint}; }
  50% { background: ${T.hint}; color: #fff; }
}
/* Кнопка «Дальше» стоит после подсказки, поэтому auto-отступ снимаем. */
.navrow .hint-b + .btn-accent { margin-left: 0; }

.hint-veil { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center;
  padding: var(--pad); background: rgba(14,14,16,0.55);
  animation: veilIn .18s ease-out both; }
@keyframes veilIn { from { opacity: 0; } to { opacity: 1; } }
.hint-card { width: 100%; max-width: 420px; padding: clamp(18px, 3vw, 26px);
  border-radius: 20px; background: ${T.paper}; text-align: left;
  box-shadow: 0 24px 50px -18px rgba(${T.shadowBase},0.75);
  animation: hintPop .26s cubic-bezier(.34,1.4,.5,1) both; }
@keyframes hintPop { from { opacity: 0; transform: translateY(14px) scale(.95); } to { opacity: 1; transform: none; } }
.hint-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.hint-card-ic { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px;
  background: ${T.hintSoft}; color: ${T.hint}; }
.hint-card-n { font-size: 12.5px; font-weight: 800; color: ${T.ink3}; }
.hint-card-txt { font-size: clamp(16px, 2.3vw, 19px); line-height: 1.5; color: ${T.ink}; font-weight: 600; }
.hint-card-close { margin-top: 16px; width: 100%; min-height: 44px; border: none; border-radius: 13px;
  background: ${T.bg}; color: ${T.ink2}; font: inherit; font-size: 15px; font-weight: 700; cursor: pointer; }
.hint-card-close:hover { background: ${T.hintSoft}; color: ${T.hint}; }

/* Мягкая второстепенная кнопка — «Показать ещё раз» и подобные. */
.btn-soft { align-self: center; display: inline-flex; align-items: center; gap: 8px;
  min-height: 46px; padding: 0 clamp(16px, 2.6vw, 24px); border: none; border-radius: 14px;
  background: ${T.paper}; color: ${T.blueDk}; font: inherit; font-size: clamp(15px, 2vw, 17px);
  font-weight: 700; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 2px ${T.blueSoft};
  transition: box-shadow .2s, transform .14s; }
.btn-soft:hover { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 2px ${T.blue}; }
.btn-soft:active { transform: scale(.96); }
.btn-soft:focus-visible { outline: 3px solid ${T.blue}; outline-offset: 3px; }

/* ── СВЕТОДИОДНАЯ ПОДСКАЗКА «ГДЕ НАЖАТЬ» ──────────────────────
   Загорается, если ребёнок задумался дольше семи секунд. Показывает МЕСТО, а
   не ответ, поэтому подсвечиваются все ещё не тронутые коробки сразу.
   Частота 0.87 Гц — втрое ниже небезопасного порога 3 Гц (WCAG 2.3.1). */
.is-led { position: relative; }
.led { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 3;
  animation: ledFrame 1.15s ease-in-out infinite; }
@keyframes ledFrame {
  0%, 100% { box-shadow: inset 0 0 0 2px rgba(255,79,40,.16); }
  50% { box-shadow: inset 0 0 0 3px ${T.ui}, 0 0 18px -4px rgba(255,79,40,.45); }
}
.led > i { position: absolute; top: 8px; right: 8px; width: 9px; height: 9px; border-radius: 50%;
  background: ${T.ui}; animation: ledDot 1.15s ease-in-out infinite; }
@keyframes ledDot {
  0%, 100% { opacity: .3; box-shadow: 0 0 0 0 rgba(255,79,40,0); }
  50% { opacity: 1; box-shadow: 0 0 10px 2px rgba(255,79,40,.55); }
}
@media (prefers-reduced-motion: reduce) {
  /* Мигание убрано, НО подсветка остаётся: она несёт смысл «нажми сюда»,
     и без неё ребёнок с включённой настройкой остался бы без подсказки. */
  .led { animation: none !important; box-shadow: inset 0 0 0 3px ${T.ui} !important; }
  .led > i { animation: none !important; opacity: 1 !important; }
}

@media (prefers-reduced-motion: reduce) {
  .hint-b.is-nudge { animation: none !important; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 3px ${T.hint} !important; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// 17. КОРЕНЬ УРОКА — useLessonRoot
// Держит номер экрана, журнал, стор, озвучку, сохранённый прогресс и финиш.
//
//   const R = useLessonRoot({ meta: META, total: SCREENS.length, ... });
//   return <R.Shell css={LESSON_CSS}>{R.done ? <DoneScreen/> : screens[R.i]}</R.Shell>;
// ─────────────────────────────────────────────────────────────────────────────
// startAt — только для отладки и приёмки: открыть урок сразу на нужном экране,
// не проходя его целиком. В продакшене платформа его не передаёт.
// onExit — необязательный. На платформе его нет и быть не должно: урок там
// открыт один и закрывается сам. Он нужен витрине, где уроков несколько и надо
// вернуться к списку. Кнопка при этом живёт В ШАПКЕ УРОКА, а не в полосе над
// ним: полоса отняла бы у урока высоту, а все его размеры считаются от высоты
// окна — и экран переставал укладываться без остатка.
function useLessonRoot({ meta, total, studentName, lang: rawLang, ttsApiBase, onFinished, extraPayload, startAt, onExit }) {
  // ЯЗЫК ЗАДАЁТ ПЛАТФОРМА (решение заказчика 2026-09-24, как в «Кибербезе»).
  // Переключателя в уроке нет: ребёнок случайно жал «EN», реплика обрывалась,
  // и урок оставался на чужом языке. Код нормализуем: платформа может прислать
  // 'UZ' или 'uz-UZ'.
  const normLang = (l) => { const s = String(l || '').toLowerCase().slice(0, 2); return LANGS.indexOf(s) >= 0 ? s : 'ru'; };
  const [lang, setLangRaw] = useState(() => normLang(rawLang));
  useEffect(() => { setLangRaw(normLang(rawLang)); }, [rawLang]); // eslint-disable-line react-hooks/exhaustive-deps
  const progress = useProgress(meta.lessonId);

  // ВОССТАНОВЛЕНИЕ ПРОГРЕССА. Читаем один раз при монтировании: если ребёнок
  // закрыл вкладку на середине, он вернётся на тот же экран с теми же ответами
  // (критерий приёмки №11). startAt важнее сохранённого прогресса — иначе
  // отладочный вход на экран N молча уезжал бы туда, где ребёнок был вчера.
  const restored = useRef(null);
  if (restored.current === null) restored.current = progress.read();

  const [i, setI] = useState(() => {
    const dev = Number(startAt);
    const from = Number.isFinite(dev) && startAt !== undefined && startAt !== null
      ? dev
      : (restored.current ? restored.current.i : 0);
    return Math.max(0, Math.min(total - 1, from || 0));
  });
  const [done, setDone] = useState(false);
  const audio = useAudioEngine(ttsApiBase, lang);
  const startedAt = useRef(Date.now());
  const [rows, log] = useAnswerLog();
  const finished = useRef(false);

  // Стор пишет прогресс на каждое изменение. Номер экрана берём из ref, а не из
  // замыкания: колбэк живёт внутри useScreenStore и не пересоздаётся.
  const iRef = useRef(i);
  iRef.current = i;
  const store = useScreenStore((box) => progress.write(iRef.current, box));
  if (restored.current && restored.current.box && !store.get('__hydrated')) {
    store.hydrate(Object.assign({}, restored.current.box, { __hydrated: true }));
  }

  // Номер экрана берём из ref, а не из замыкания: запись прогресса — побочный
  // эффект, и внутри апдейтера setState ей не место (React вызывает апдейтер
  // дважды в StrictMode, и в localStorage уходила бы двойная запись).
  const go = useCallback((step) => {
    audio.stop();
    const nextI = Math.max(0, Math.min(total - 1, iRef.current + step));
    setI(nextI);
    progress.write(nextI, store.raw());
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [audio, total, progress, store]);
  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    audio.stop();
    const payload = buildPayload({
      meta, studentName, lang,
      startedAt: startedAt.current,
      answers: rows.current,
      extra: typeof extraPayload === 'function' ? extraPayload(store) : extraPayload
    });
    // Урок пройден — сохранённый прогресс больше не нужен: следующий заход
    // должен начаться сначала, а не с последнего экрана.
    progress.clear();
    setDone(true);
    if (typeof onFinished === 'function') onFinished(payload);
  }, [audio, meta, studentName, lang, rows, store, onFinished, extraPayload, progress]);

  // ПЕРЕЗАПУСК ЭКРАНА. Пересобираем его заново (runN входит в key), а перед этим
  // глушим озвучку жёстким обрывом и стираем память экрана. Порядок важен:
  // сначала abort (иначе ждущая реплика закроется и уведёт урок вперёд), потом
  // чистка памяти, и только потом смена key.
  const [runN, setRunN] = useState(0);
  const restart = useCallback(() => {
    if (audio && audio.abort) audio.abort();
    const id = SCREENS[iRef.current] && SCREENS[iRef.current].id;
    (SCREEN_RESET[id] || []).forEach((k) => store.set(k, undefined));
    setRunN((v) => v + 1);
  }, [audio, store]);
  const page = useMemo(() => ({ restart, exit: onExit }), [restart, onExit]);

  // Shell ОБЯЗАН иметь стабильную идентичность. Если собирать его через
  // useCallback с [audio] в зависимостях, любое изменение audio.playing даёт
  // новый тип компонента — React размонтирует и смонтирует ВСЁ дерево урока
  // заново: анимации рестартуют с нуля, состояние экрана теряется, озвучка
  // начинается сначала. Поэтому идентичность фиксируем через useMemo([]), а
  // живые значения читаем из ref — при обычном ре-рендере он уже обновлён.
  // Смена языка обрывает текущую реплику: договаривать её на прежнем языке
  // бессмысленно, а экран уже перерисован. Реплика начнётся заново.
  const setLang = useCallback((l) => {
    if (LANGS.indexOf(l) < 0) return;
    if (audio && audio.abort) audio.abort();
    setLangRaw(l);
    setRunN((v) => v + 1);
  }, [audio]);

  // ═══ ВЫСОТА ПОД СИСТЕМНОЙ КЛАВИАТУРОЙ ═══════════════════════════════════
  //
  // 90% студентов проходят урок с телефона, и ввод идёт через системную
  // клавиатуру — так решил заказчик, экранную убрали намеренно. Но единица
  // dvh клавиатуру НЕ учитывает: страница остаётся во всю высоту экрана, а
  // нижняя её половина просто уходит под клавиатуру вместе с листом, кнопкой
  // «Дальше» и подсказкой. Ребёнок печатает вслепую и не видит, что написал.
  //
  // visualViewport знает настоящую видимую высоту. Отдаём её в --vvh, и весь
  // урок ужимается в то, что реально видно. Заодно поднимаем флаг is-kbd:
  // по нему герой в шапке сворачивается, освобождая место заданию.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const vv = window.visualViewport;
    const root = () => document.documentElement;
    const apply = () => {
      const h = vv ? vv.height : window.innerHeight;
      const full = window.innerHeight || h;
      root().style.setProperty('--vvh', Math.round(h) + 'px');
      // Клавиатура считается поднятой, если видимая высота заметно меньше
      // полной. Порог 120 px: мелкие колебания панелей браузера флагом не
      // считаются, иначе он дёргался бы при каждой прокрутке.
      root().classList.toggle('is-kbd', full - h > 120);
    };
    apply();
    if (vv) {
      vv.addEventListener('resize', apply);
      vv.addEventListener('scroll', apply);
    }
    window.addEventListener('orientationchange', apply);
    return () => {
      if (vv) { vv.removeEventListener('resize', apply); vv.removeEventListener('scroll', apply); }
      window.removeEventListener('orientationchange', apply);
      root().style.removeProperty('--vvh');
      root().classList.remove('is-kbd');
    };
  }, []);

  const liveRef = useRef(null);
  liveRef.current = { lang, setLang, audio, log, store, page };
  const Shell = useMemo(() => function LessonShell({ children, css }) {
    const v = liveRef.current;
    return (
      <LangProvider value={v.lang}>
        <AudioProvider value={v.audio}>
          <LogProvider value={v.log}>
            <StoreProvider value={v.store}>
              <LangSetProvider value={v.setLang}>
              <PageProvider value={v.page}>
                <div className={'lesson-root' + (v.audio && v.audio.paused ? ' is-paused' : '')}>
                  <style>{CSS_BASE + (css || '')}</style>
                  {children}
                  <CelebrateLayer />
                </div>
              </PageProvider>
              </LangSetProvider>
            </StoreProvider>
          </LogProvider>
        </AudioProvider>
      </LangProvider>
    );
  }, []);

  // Имя для подписей: пустое имя не должно превращаться в пустую строку.
  const displayName = studentName
    || (lang === 'uz' ? "O'quvchi" : lang === 'en' ? 'Student' : 'Ученик');

  return { i, lang, setLang, audio, store, log, next, prev, go, finish, done, displayName, Shell, runN };
}

// =============================================================================
// ========================  К А Н О Н  ·  М Е Х А Н И К И  ====================
// =============================================================================
// Голос экрана, награда и два задания, которые нужны любому уроку курса:
// «найди на панели» и «соедини пары». Всё, что здесь лежит, не знает ничего
// про конкретный урок и переносится в следующий без единой правки.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// ГОЛОС ЭКРАНА — useVoice
// Экран объявляет сценарий репликами, а по ходу может добавить реакцию: похвалу,
// подсказку, разбор. Реплики идут строго по очереди, следующая начинается, когда
// предыдущая договорена.
//
// done — весь сценарий (включая добавленные реакции) договорён. По нему
// открывается «Дальше»: разбор «почему так» бесполезен, если ребёнок уже ушёл.
// ─────────────────────────────────────────────────────────────────────────────
// Стор переживает перезагрузку и может содержать запись другой сборки урока.
// Версия прогресса такие записи отбрасывает, но экраны всё равно читают стор
// оборонительно: одна повреждённая запись не должна ронять урок.
const seenOf = (v) => (v && Array.isArray(v.seen) ? v.seen : []);

function useVoice(initial) {
  const [list, setList] = useState(() => initial || []);
  const [i, setI] = useState(0);
  const [spokenN, setSpokenN] = useState(-1);
  // Счётчик подмен. Нужен, чтобы пузырь перезапустил озвучку, даже если индекс
  // реплики не изменился: подменили содержимое — nonce другой.
  const [cut, setCut] = useState(0);
  const iRef = useRef(0); iRef.current = i;
  const spokenRef = useRef(-1); spokenRef.current = spokenN;

  const cur = list[Math.min(i, Math.max(0, list.length - 1))] || {};
  const speaker = {
    who: cur.who || 'bot',
    pose: POSES[cur.pose] || POSES.explain,
    text: cur.text,
    nonce: String(i) + '.' + cut,
    onSpoken: () => {
      setSpokenN(i);
      setI((v) => (v + 1 < list.length ? v + 1 : v));
    }
  };

  // ОЧЕРЕДЬ СТРОГО ПОСЛЕДОВАТЕЛЬНАЯ, НИ ОДНА ФРАЗА НЕ ТЕРЯЕТСЯ.
  //
  // Раньше say() сам двигал указатель на добавленную фразу. Если две реплики
  // ставились почти одновременно — объяснение элемента и следом итог экрана —
  // указатель прыгал сразу на последнюю, и объяснение молча выбрасывалось.
  //
  // Теперь say() ТОЛЬКО дописывает в конец. Двигает указатель либо onSpoken
  // (когда предыдущая фраза договорена), либо эффект ниже — если очередь
  // пополнилась в момент, когда всё уже было сказано.
  const say = useCallback((text, pose, who) => {
    setList((l) => l.concat([{ text, pose: pose || 'rule', who: who || 'bot' }]));
  }, []);

  // ПРЕРЫВАЮЩАЯ РЕПЛИКА — реакция на действие ребёнка.
  //
  // Заказчик: «нажимаю три кнопки за две секунды, и даже если последняя верная,
  // приходится ждать, пока герой прокомментирует все мои действия». Так и было:
  // каждое нажатие дописывало реплику в конец, и очередь копила комментарии к
  // действиям, которые ребёнок давно проскочил.
  //
  // Теперь реакция ВЫТЕСНЯЕТ всё несказанное, включая ту фразу, что звучит
  // прямо сейчас. Герой всегда говорит о ПОСЛЕДНЕМ действии, а не отрабатывает
  // накопившийся долг. Для итогов экрана по-прежнему say(): их место в конце
  // очереди, и вытеснять они ничего не должны.
  const sayNow = useCallback((text, pose, who) => {
    const item = { text, pose: pose || 'point', who: who || 'bot' };
    // КУРС HTML: похвала героя — с хлопушками и аплодисментами.
    if (pose === 'cheer' || pose === 'celebrate') celebrate();
    const i0 = iRef.current;
    // ГЕРОЯ НЕ ПЕРЕБИВАЮТ НА ПОЛУСЛОВЕ.
    //
    // Заказчик: «пока герой не договорит предложение, его слова перебивать
    // нельзя». Раньше реакция вытесняла и ту фразу, что звучала прямо сейчас,
    // и она обрывалась посреди слова.
    //
    // Теперь вытесняется только ХВОСТ очереди. Если фраза ещё звучит, новая
    // реакция встаёт сразу за ней и прозвучит, как только та договорит. Если
    // герой уже молчит, реакция занимает его место немедленно.
    //
    // Оба требования заказчика при этом выполняются разом: слова не рвутся, и
    // долг из комментариев к давно пройденным действиям не копится — в очереди
    // никогда не больше одной ждущей реакции.
    const busy = spokenRef.current < i0;
    setList((l) => l.slice(0, busy ? i0 + 1 : i0).concat([item]));
    if (!busy) {
      // Место освободилось — подменяем текущую. Счётчик подмен двигаем, иначе
      // пузырь не заметит, что содержимое стало другим.
      setCut((n) => n + 1);
      // Отметку «сказано» откатываем: без этого новая реплика наследовала бы
      // статус той, что стояла на её месте, очередь считала бы её договорённой
      // и тут же перескакивала на следующую.
      setSpokenN((n) => Math.min(n, i0 - 1));
    }
  }, []);

  useEffect(() => {
    if (i < list.length - 1 && spokenN >= i) setI(i + 1);
  }, [list.length, i, spokenN]);

  const done = spokenN >= list.length - 1;
  return [speaker, say, done, sayNow];
}

// ─────────────────────────────────────────────────────────────────────────────
// МИНИ-ЛИСТ — картинка листа с курсором для вариантов ответа.
// ─────────────────────────────────────────────────────────────────────────────

const Trophy = () => (
  <div className="trophy">
    <svg viewBox="0 0 120 130" aria-hidden="true">
      <g className="tr-rays">
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
          <line key={a} x1="60" y1="50" x2={60 + 54 * Math.cos(a * Math.PI / 180)}
            y2={50 + 54 * Math.sin(a * Math.PI / 180)} stroke={T.accentSoft} strokeWidth="6" strokeLinecap="round" />
        ))}
      </g>
      <path d="M34 20h52v22a26 26 0 0 1-52 0z" fill="#F0C24A" stroke="#C9932A" strokeWidth="3" />
      <path d="M34 26H22a12 12 0 0 0 12 12" fill="none" stroke="#C9932A" strokeWidth="4" strokeLinecap="round" />
      <path d="M86 26h12a12 12 0 0 1-12 12" fill="none" stroke="#C9932A" strokeWidth="4" strokeLinecap="round" />
      <rect x="52" y="68" width="16" height="18" rx="3" fill="#C9932A" />
      <rect x="36" y="86" width="48" height="12" rx="4" fill="#C9932A" />
      <rect x="28" y="98" width="64" height="14" rx="5" fill="#A87A1E" />
      <path d="M52 34l4 8 9 1-6.5 6 1.6 9-8.1-4.4-8.1 4.4 1.6-9-6.5-6 9-1z" fill="#FFF3CF" opacity=".9" />
    </svg>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ОБЩИЙ ДОКУМЕНТ — приглашение, которое ребёнок строит с 6-го экрана.
// Живёт в сторе: экраны 6, 8, 9, 11, 12 и 13 — это ОДНА работа, разбитая на
// уровни, а не шесть отдельных упражнений.
// ─────────────────────────────────────────────────────────────────────────────

const useTouch = () => {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(pointer: coarse)');
    const apply = () => setTouch(mq.matches);
    apply();
    if (mq.addEventListener) { mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply); }
    return undefined;
  }, []);
  return touch;
};

// ═════════════════════════════════════════════════════════════════════════════
//                                Э К Р А Н Ы
// ═════════════════════════════════════════════════════════════════════════════

// ── 1. HOOK ─────────────────────────────────────────────────────────────────
// ЗАВЯЗКА. Валли нашёл старый компьютер и зовёт посмотреть, на что тот способен.
// Ребёнок нажимает на экран — машина показывает готовое приглашение. Обещание
// честное: ровно это он соберёт сам к концу урока.

// ─────────────────────────────────────────────────────────────────────────────
// 18. ГОРЯЧИЕ ТОЧКИ (M7) — «найди эту кнопку на панели»
// Ребёнок ищет НЕ подписанную кнопку, а по назначению: «чем сохраняют работу».
// Поэтому подписи инструментов на время задания сняты — иначе это чтение, а не
// узнавание. Лесенка подсказок общая с остальными заданиями.
// ─────────────────────────────────────────────────────────────────────────────
function Hotspots({ targets, onAllFound, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [found, setFound] = useState(stored ? stored.found : []);
  const [level, setLevel] = useState(stored ? stored.level : 0);
  const [shake, setShake] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const cur = targets[found.length];
  const allDone = found.length >= targets.length;

  const tap = (id) => {
    if (allDone || shake || !canAnswer) return;
    attempts.current += 1;
    if (cur && id === cur.id) {
      const nf = found.concat([id]);
      setFound(nf);
      setLevel(0);                       // новая цель — лесенка начинается заново
      sfx('ok', audio && audio.on);
      if (nf.length >= targets.length) {
        if (onAllFound) onAllFound({ attempts: attempts.current });
        if (onSay) onSay(joinL(nextPraiseL(), cur.ok), 'cheer', true);
      } else if (onSay) {
        onSay(cur.ok, 'point', false);
      }
      return;
    }
    setShake(id);
    sfx('soft', audio && audio.on);
    const nextLevel = Math.min(3, level + 1);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      setLevel(nextLevel);
      sfx('hint', audio && audio.on);
      const h = cur && cur.hints && cur.hints[nextLevel - 1];
      if (onSay) onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'point', false);
    })();
  };

  return (
    <div className="hs">
      <div className="hs-ask">
        {allDone
          ? <span className="hs-ask-done"><Icon name="check" size={18} />{pick({ uz: 'Hammasi topildi', ru: 'Все найдены', en: 'All found' })}</span>
          : <><span className="hs-ask-n mono">{found.length + 1}/{targets.length}</span>{pick(cur.ask)}</>}
      </div>
      <div className="hs-bar">
        {TOOLS.map((tl) => {
          const isFound = found.indexOf(tl.id) >= 0;
          const isShake = shake === tl.id;
          return (
            <button key={tl.id} type="button"
              className={'hs-tool' + (isFound ? ' is-found' : '') + (isShake ? ' is-shake' : '')}
              disabled={isFound || allDone || !canAnswer}
              onClick={() => tap(tl.id)}
              aria-label={pick(tl.label)}
            >
              <Icon name={tl.icon} size={22} />
              {isFound && <span className="hs-tick"><Icon name="check" size={13} /></span>}
            </button>
          );
        })}
      </div>
      {!allDone && level > 0 && (
        <div className="ladder">
          {(cur.hints || []).slice(0, level).map((h, i) => (
            <div key={i} className={'note note-hint' + (i === level - 1 ? ' note-fresh' : ' note-old')}>
              <span className="note-lbl"><Icon name="bulb" size={13} />{pick(HINT_LABEL[i])}</span>
              <div className="note-body">{pick(h)}</div>
            </div>
          ))}
        </div>
      )}
      {allDone && (
        <div className="hs-legend">
          {targets.map((t) => {
            const tl = TOOLS.find((x) => x.id === t.id);
            return (
              <div className="hs-leg-row" key={t.id}>
                <span className="hs-leg-ic"><Icon name={tl.icon} size={17} /></span>
                <span className="hs-leg-txt">{pick(tl.label)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 19. СОЕДИНЕНИЕ ПАР — «что делает эта кнопка»
//
// ПЕРЕДЕЛАНО ПО ЗАМЕЧАНИЮ. Раньше это был один сплошной блок из шести
// одинаковых прямоугольников: ребёнок не понимал, что слева, что справа и в
// каком порядке действовать. Теперь две ЯВНО РАЗНЫЕ колонки со своими
// заголовками:
//   слева  — крупные кнопки-инструменты, только значок, без подписи работы;
//   справа — варианты ответа словами.
// Разный вид не украшение: слева «предмет», справа «утверждение о нём», и
// спутать их нельзя.
//
// Порядок жёсткий: сначала кнопка, потом её работа. Пока кнопка не выбрана,
// правая колонка приглушена и не нажимается — иначе ребёнок тыкает наугад.
//
// ГЛАВНОЕ: назначение кнопки НЕ называется до выбора. Об этом заботится
// экран (onPickLeft), здесь только механика.
// ─────────────────────────────────────────────────────────────────────────────
function PairMatch({ left, right, onSolved, onSay, onPickLeft, stored, canAnswer = true, labels }) {
  const pick = usePick();
  const audio = useAudio();
  const [tied, setTied] = useState(stored && Array.isArray(stored.tied) ? stored.tied : []);
  const [pickedL, setPickedL] = useState(null);
  const [shake, setShake] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const isTied = (id) => tied.indexOf(id) >= 0;
  const allDone = tied.length >= left.length;

  // Задумался дольше семи секунд — загорается то, что надо нажать СЕЙЧАС:
  // сначала кнопки слева, а когда кнопка выбрана — строки справа. Подсвечены
  // все свободные сразу, поэтому подсказка показывает место, а не ответ.
  const led = useIdleLed(canAnswer && !allDone, tied.length + (pickedL ? 0.5 : 0));

  const tapRight = (rid) => {
    if (!pickedL || !canAnswer) return;
    attempts.current += 1;
    if (rid === pickedL) {
      const nt = tied.concat([rid]);
      setTied(nt);
      setPickedL(null);
      sfx('ok', audio && audio.on);
      const pair = left.find((l) => l.id === rid);
      // Разбор — ПОСЛЕ верного выбора. До него работу кнопки не называем.
      if (onSay && pair) onSay(pair.ok, 'rule');
      if (nt.length >= left.length && onSolved) onSolved({ attempts: attempts.current });
      return;
    }
    setShake(rid);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      setPickedL(null);
      if (onSay) { const h = (left.find((l) => l.id === pickedL) || {}).hint; onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'think'); }
    })();
  };

  return (
    <div className="pm">
      <div className="pm-col pm-col-tools">
        <span className="pm-head">{pick((labels && labels.left) || { uz: 'Tugma', ru: 'Кнопка', en: 'Button' })}</span>
        {left.map((l) => (
          <button key={l.id} type="button"
            className={'pm-tool' + (isTied(l.id) ? ' is-tied fx-ok' : '') + (pickedL === l.id ? ' is-picked' : '')
              + (led && !pickedL && !isTied(l.id) ? ' is-led' : '')}
            disabled={isTied(l.id) || !canAnswer}
            onClick={() => {
              sfx('tap', audio && audio.on);
              setPickedL(l.id);
              if (onPickLeft) onPickLeft(l);
            }}>
            <span className="pm-tool-ic"><Icon name={l.icon} size={26} /></span>
            {isTied(l.id) && <span className="pm-tick"><Icon name="check" size={14} /></span>}
            <Led on={led && !pickedL && !isTied(l.id)} />
          </button>
        ))}
      </div>

      <div className={'pm-col pm-col-jobs' + (pickedL ? ' is-live' : '')}>
        <span className="pm-head">{pick((labels && labels.right) || { uz: 'Uning ishi', ru: 'Её работа', en: 'Its job' })}</span>
        {right.map((r) => (
          <button key={r.id} type="button"
            className={'pm-job' + (isTied(r.id) ? ' is-tied fx-ok' : '') + (shake === r.id ? ' is-shake fx-no' : '')
              + (led && pickedL && !isTied(r.id) ? ' is-led' : '')}
            disabled={isTied(r.id) || !pickedL || !canAnswer}
            onClick={() => tapRight(r.id)}>
            <FitLine>{pick(r.text)}</FitLine>
            {isTied(r.id) && <span className="pm-tick pm-tick-job"><Icon name="check" size={13} /></span>}
            <Led on={led && !!pickedL && !isTied(r.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//                      Э К Р А Н Ы,  О Б Щ И Е  Д Л Я  В С Е Х  У Р О К О В
//
// Формула GSX ставит четыре экрана в КАЖДЫЙ урок курса: миссия, «зачем это
// нужно», достижение и прощание. Отличаются они только текстами и картинками,
// а поведение у них одно и то же — счётчик открытого, реплика на каждое
// нажатие, светодиод после семи секунд, итог в конце.
//
// Поэтому они живут здесь, а не в уроке. Урок передаёт тексты и, если надо,
// рисунок карточки. Скопировать их в новый урок — значит завести вторую копию
// логики, которую придётся чинить дважды.
// ═════════════════════════════════════════════════════════════════════════════

// ── ПОКАЗ КАРТОЧЕК ГОЛОСОМ ─────────────────────────────────────────────────
// Заказчик, 27.09.2026: «nuqtalar yonishini, raqamlarni, yozuvni olib tashla —
// faqat kartochkalar bilan Lumi qolsin. Bola bosishi shart emas, o‘zi ketma-ket
// ochib ko‘rsatsin». Поэтому на экранах-знакомствах (миссия, «зачем это
// нужно») нет мигающих точек, номеров, заголовка, строки задания и счётчика —
// только Луми и карточки.
//
// Как идёт показ. Все карточки сначала закрыты рубашкой со знаком вопроса.
// Луми говорит вступление, потом по очереди: карточка переворачивается и
// светится, пока звучит её реплика. В конце итог — и открывается «Дальше».
// Шаг двигает голос, а не таймер: вся очередь реплик ставится сразу, а какая
// карточка открыта, берётся из того, какая реплика звучит сейчас. На
// узбекском фразы длиннее — карточки просто ждут голос.
//
// После показа открытую карточку можно нажать — Луми повторит её реплику
// (правило «пройденную карточку можно нажать ещё раз»). Во время показа
// нажатие ничего не делает, но карточки не серые: экран не «сломан», он
// рассказывает. Вернулись «Назад» — показ идёт заново, но «Дальше» открыт
// сразу. Озвучка умерла молча — одна реплика висит дольше 25 с — открываются
// все карточки и «Дальше»: урок не имеет права запереть ребёнка. Считаем от
// КАЖДОЙ реплики, а не от входа на экран: длинный узбекский показ из шести
// фраз идёт дольше минуты, и общий таймер открыл бы карточки раньше голоса.
const TOUR_SAFETY_MS = 25000;

function useCardTour({ id, intro, lines, done }) {
  const store = useStore();
  const audio = useAudio();
  const n = lines.length;
  const [speaker, , spoken, sayNow] = useVoice([{ text: intro, pose: 'explain' }]
    .concat(lines.map((t) => ({ text: t, pose: 'point' })))
    .concat(done ? [{ text: done, pose: 'cheer' }] : []));
  const [upTo, setUpTo] = useState(-1);
  const [ended, setEnded] = useState(false);
  const [passed, setPassed] = useState(() => {
    const v = store.get(id);
    return !!(v && (v.done || seenOf(v).length >= n));
  });
  const now = lines.indexOf(speaker.text);

  useEffect(() => {
    if (now >= 0) setUpTo((v) => Math.max(v, now));
    if (done && speaker.text === done) setUpTo(n - 1);
  }, [speaker.text, speaker.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  const over = useRef(false);
  const finish = () => {
    if (over.current) return;
    over.current = true;
    setUpTo(n - 1);
    setEnded(true);
    setPassed(true);
    store.set(id, { done: true, seen: lines.map((_, i) => i) });
  };
  // Очередь впервые договорена целиком — показ окончен.
  useEffect(() => { if (spoken && !ended) finish(); }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (ended) return undefined;
    const t = setTimeout(finish, TOUR_SAFETY_MS);
    return () => clearTimeout(t);
  }, [speaker.nonce, ended]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (i) => {
    if (!ended || !spoken || i > upTo) return;
    sfx('tap', audio && audio.on);
    sayNow(lines[i], 'point');
  };

  return { speaker, spoken, ended, passed, upTo, now, tap };
}

// Сетка карточек показа. face(карточка, индекс, открыта) рисует лицо.
function TourCards({ tour, cards, face, label }) {
  const pick = usePick();
  return (
    <div className={'tour tour-n' + cards.length}>
      {cards.map((k, i) => {
        const open = i <= tour.upTo;
        const lit = i === tour.now && !tour.spoken;
        return (
          <button key={k.id || i} type="button"
            className={'tour-card' + (open ? ' is-open' : ' is-shut') + (lit ? ' is-reading' : '')}
            onClick={() => tour.tap(i)} aria-label={open && label ? pick(label(k)) : undefined}>
            <span className="tour-face">{face(k, i, open)}</span>
            {open ? null : <span className="tour-back" aria-hidden="true"><i>?</i></span>}
          </button>
        );
      })}
    </div>
  );
}

// ── МИССИЯ. Шаги урока — карточками, Луми открывает их сам. ─────────────────
// c = { eyebrow, say, steps: [{icon, text, say}], done }
function MissionScreen({ p, c, id = 's2' }) {
  const pick = usePick();
  const tour = useCardTour({ id, intro: c.say, lines: c.steps.map((st) => st.say), done: c.done });
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={tour.speaker}
      done={tour.ended && tour.spoken}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!tour.passed} onClick={p.next} /></>}>
      <TourCards tour={tour} cards={c.steps} label={(st) => st.text}
        face={(st) => (
          <>
            <span className="tour-ic"><Icon name={st.icon} size={30} /></span>
            <span className="tour-t">{pick(st.text)}</span>
          </>
        )} />
    </Stage>
  );
}

// ── ЗАЧЕМ ЭТО НУЖНО. Карточки-примеры, Луми открывает их сам. ──────────────
// c = { eyebrow, say, items: [{id, text, why}], done }
// art — как нарисовать карточку: (id, живая ли) => элемент. Рисунок у каждого
// урока свой, поведение — общее. Открытая карточка «оживает».
// above — что показать НАД карточками. Нужно, когда примеры разбирают общий
// предмет: на экране «что не так» это само испорченное объявление.
function WhyScreen({ p, c, id = 's3', art, above }) {
  const pick = usePick();
  const tour = useCardTour({ id, intro: c.say, lines: c.items.map((it) => it.why), done: c.done });
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={tour.speaker}
      done={tour.ended && tour.spoken}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!tour.passed} onClick={p.next} /></>}>
      {above}
      <TourCards tour={tour} cards={c.items} label={(it) => it.text}
        face={(it, i, open) => (
          <>
            {art ? art(it.id, open) : null}
            <span className="tour-t">{pick(it.text)}</span>
          </>
        )} />
    </Stage>
  );
}

// ── ДОСТИЖЕНИЕ. Кубок и список того, что ребёнок реально сделал. ───────────
// c = { eyebrow, title, say, skills: [...], btn }
function AchievementScreen({ p, c }) {
  const pick = usePick();
  const [speaker, , done] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={done}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!done} onClick={p.next} label={c.btn} /></>}>
      <div className="outro">
        <Trophy />
        <h2 className="h1 hook-ask">{pick(c.title)}</h2>
        {/* Каждый шаг, который ребёнок реально сделал, — с галочкой. Список
            повторяет обещание из миссии: обещали → сделали. */}
        <div className="skills">
          {c.skills.map((sk, i) => (
            <div className="skill-row" key={i} style={{ animationDelay: (0.25 + i * 0.12) + 's' }}>
              <span className="skill-tick"><Icon name="check" size={14} /></span>
              {pick(sk)}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// ── ПРОЩАНИЕ. Один крупный герой по центру, машет. ─────────────────────────
// Урок закрывается платформой автоматически, поэтому здесь одна фраза и
// кнопка. Текста на экране нет намеренно: на финальную реплику у платформы
// есть буквально пара секунд.
// c = { eyebrow, say, btn }
function ByeScreen({ p, c }) {
  // Прощание, а не приветствие: в моушн-листе это разные состояния. Уход
  // строится на ускоряющейся кривой и дрейфе, вход — на тормозящей. Выход
  // всегда короче входа.
  const pick = usePick();
  const audio = useAudio();
  const [speaker, , done] = useVoice([{ text: c.say, pose: 'bye' }]);
  // Карточка следующего урока берётся с карты модуля (UI-07): без голоса
  // экран был пустым — один робот, и непонятно, что дальше.
  const n = typeof LESSON_N === 'number' ? LESSON_N : 0;
  const next = n > 0 && n < MAP_N ? MAP_L[n] : null;
  const failed = !!(audio && audio.failed);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={done} hideSpeaker
      nav={<NextBtn disabled={!done} onClick={p.finish} label={c.btn} />}>
      {/* Маленький герой в шапке спрятан: два робота на одном экране спорят за
          внимание, а прощание должно быть про одного. Реплика печатается под
          ним, только если голоса нет. */}
      <div className="bye">
        <div className="bye-bot"><RobotSVG pose="bye" /></div>
        {failed ? <p className="bye-say">{pick(c.say)}</p> : null}
        {next ? (
          <div className="bye-next" style={{ color: next[0] === MAP_N ? MAP_GOLD : MAP_BLOCKS[next[1]].hex }}>
            <span className="bye-next-ic">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={MAP_ICON[next[2]]} /></svg>
            </span>
            <span className="bye-next-t">
              <span>{pick(ML('Keyingi dars \u2014 ' + next[0], 'Следующий урок \u2014 ' + next[0], 'Next lesson \u2014 ' + next[0]))}</span>
              <b>{pick(next[5])}</b>
            </span>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//                      Н О В Ы Е   М Е Х А Н И К И
//
// Правило курса: рамка урока повторяется, задания — нет. Механика, ведущая в
// одном уроке, не может быть ведущей в соседнем. Всё, что здесь лежит, писалось
// под конкретный урок, но не знает про него ничего — и поэтому переезжает
// дальше по карте механик.
// ═════════════════════════════════════════════════════════════════════════════

// ── ВСПЫШКА — «успей прочитать» ────────────────────────────────────────────
//
// Крючок «провал-опыт»: ребёнок сам не справляется и на себе понимает, зачем
// правило. Содержимое показывается на секунду и гаснет, дальше вопрос по нему.
// Первый раз ответить невозможно, второй — легко, и разницу ребёнок объясняет
// себе сам, без единого слова от героя.
//
// ЧЕГО ЗДЕСЬ НЕТ И ПОЧЕМУ. Нет отсчёта, нет полоски времени, нет счёта очков.
// Мастер-ТЗ (раздел 2.9) прямо запрещает давление временем: у детей 8–10 лет
// оно даёт тревогу, а не азарт. Показ запускает сам ребёнок, повторить можно
// сколько угодно раз, а неверный ответ ничем не наказывается — герой на нём
// говорит «я тоже не успел».
const GLANCE_MS = 1200;

function Glance({ children, label, onShown, disabled }) {
  const pick = usePick();
  const audio = useAudio();
  const [lit, setLit] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = () => {
    if (lit || disabled) return;
    sfx('pop', audio && audio.on);
    setLit(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLit(false);
      if (onShown) onShown();
    }, GLANCE_MS);
  };

  return (
    <div className="glance">
      <div className={'glance-box' + (lit ? ' is-lit' : '')}>
        <div className="glance-in" aria-hidden={!lit}>{children}</div>
        {!lit && <span className="glance-veil" aria-hidden="true" />}
      </div>
      <button type="button" className="btn-soft glance-btn" onClick={flash} disabled={lit || disabled}>
        <Icon name="eye" size={17} />{pick(label)}
      </button>
    </div>
  );
}

// ── ДА / НЕТ — быстрая сортировка утверждений ──────────────────────────────
//
// Проверка понимания без выбора из вариантов: по каждой карточке ребёнок
// решает отдельно. Ошибка ничего не гасит и не отнимает — карточка просто
// возвращается, а герой называет способ подумать. Разбор идёт после КАЖДОЙ
// карточки, а не общим списком в конце: к концу ребёнок уже не помнит, о чём
// была вторая.
//
// items = [{ id, text, yes: true|false, why }]
function YesNo({ items, labels, onSolved, onSay, onAsk, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [done, setDone] = useState(() => (stored && Array.isArray(stored.done) ? stored.done : []));
  const [shake, setShake] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const isDone = (id) => done.indexOf(id) >= 0;
  const rest = items.filter((it) => !isDone(it.id));
  const cur = rest[0];
  const all = !cur;
  const led = useIdleLed(canAnswer && !all, done.length);
  // Утверждение ЗВУЧИТ: ребёнок, который плохо читает, иначе отвечает наугад.
  // Экран ставит его в очередь (say), поэтому оно идёт после похвалы.
  const curId = cur ? cur.id : null;
  useEffect(() => { if (cur && onAsk) onAsk(cur); }, [curId]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (yes) => {
    if (!cur || !canAnswer || shake) return;
    attempts.current += 1;
    if (yes === cur.yes) {
      const n = done.concat([cur.id]);
      setDone(n);
      sfx('ok', audio && audio.on);
      if (onSay) onSay(joinL(nextPraiseL(), cur.why), 'cheer');
      if (n.length >= items.length && onSolved) onSolved({ attempts: attempts.current, done: n });
      return;
    }
    setShake(yes ? 'yes' : 'no');
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      if (onSay) { const h = cur && cur.hint; onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'think'); }
    })();
  };

  return (
    <div className="yn">
      <div className="yn-card" key={cur ? cur.id : 'all'}>
        {cur ? (
          <>
            {cur.node ? <span className="yn-node">{cur.node}</span> : null}
            <FitLine max={20} min={13}>{pick(cur.text)}</FitLine>
          </>
        ) : <span className="yn-all"><Icon name="check" size={20} />{pick(labels.all)}</span>}
      </div>
      <div className="yn-count mono">{done.length} / {items.length}</div>
      <div className="yn-btns">
        <button type="button" disabled={all || !canAnswer}
          className={'yn-b yn-yes' + (shake === 'yes' ? ' fx-no' : '') + (led ? ' is-led' : '')}
          onClick={() => answer(true)}>
          <Icon name="check" size={18} />{pick(labels.yes)}
          <Led on={led && !all} />
        </button>
        <button type="button" disabled={all || !canAnswer}
          className={'yn-b yn-no' + (shake === 'no' ? ' fx-no' : '') + (led ? ' is-led' : '')}
          onClick={() => answer(false)}>
          <Icon name="cross" size={18} />{pick(labels.no)}
          <Led on={led && !all} />
        </button>
      </div>
    </div>
  );
}

// ── ПЕРЕСТАНОВКА — собрать по порядку ──────────────────────────────────────
//
// ДВА СПОСОБА ПЕРЕСТАВИТЬ, И ОБА НАСТОЯЩИЕ.
//
// Перетаскивание нагляднее: строка едет за пальцем, соседи расступаются. Но
// на него нельзя опираться в одиночку — палец у ребёнка соскальзывает, а на
// компьютере без мыши перетаскивание вообще недоступно. Поэтому у каждой
// строки есть ещё и две стрелки: нажал — строка поднялась на позицию. Это не
// «упрощённый режим», а полноценный второй путь, и он же делает задание
// проходимым с клавиатуры.
//
// Строки одной высоты намеренно: по ней считается, куда попадёт перетаскиваемая
// строка. Разной высоты пришлось бы мерить каждую, а на телефоне это заметно
// дёргает список.
function Reorder({ items, value, onChange, canAnswer = true, solved, onTap }) {
  const pick = usePick();
  const audio = useAudio();
  const [drag, setDrag] = useState(null);      // { id, from, dy, to }
  const boxRef = useRef(null);
  const rowH = useRef(56);

  const order = value;
  const at = (i) => items.find((x) => x.id === order[i]);

  const move = (from, to) => {
    if (to < 0 || to >= order.length || from === to) return;
    const n = order.slice();
    n.splice(to, 0, n.splice(from, 1)[0]);
    sfx('tap', audio && audio.on);
    onChange(n);
  };

  const onDown = (e, from) => {
    if (!canAnswer || solved) return;
    const row = e.currentTarget.closest('.ro-row');
    if (row) rowH.current = row.getBoundingClientRect().height + 8;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
    setDrag({ id: order[from], from, dy: 0, to: from, y0: e.clientY });
  };
  const onMove = (e) => {
    if (!drag) return;
    const dy = e.clientY - drag.y0;
    const to = Math.max(0, Math.min(order.length - 1, drag.from + Math.round(dy / rowH.current)));
    if (to !== drag.to || dy !== drag.dy) setDrag(Object.assign({}, drag, { dy, to }));
  };
  const onUp = () => {
    if (!drag) return;
    const { from, to } = drag;
    setDrag(null);
    if (from !== to) move(from, to);
  };

  return (
    <div className="ro" ref={boxRef}>
      {order.map((id, i) => {
        const it = at(i);
        if (!it) return null;
        const isDrag = drag && drag.from === i;
        // Соседи расступаются: строка, через которую тащат, съезжает на её место.
        let shift = 0;
        if (drag && !isDrag) {
          if (drag.from < i && i <= drag.to) shift = -1;
          else if (drag.to <= i && i < drag.from) shift = 1;
        }
        return (
          <div key={id}
            className={'ro-row' + (isDrag ? ' is-drag' : '') + (solved ? ' is-ok' : '')}
            style={{
              transform: isDrag ? 'translateY(' + drag.dy + 'px)' : (shift ? 'translateY(' + (shift * rowH.current) + 'px)' : undefined),
              zIndex: isDrag ? 3 : 1
            }}>
            <span className="ro-n mono">{i + 1}</span>
            {/* Значок и голос по нажатию: шаг узнаётся, даже если ребёнок не читает. */}
            {it.icon ? <span className="ro-ic" aria-hidden="true"><Icon name={it.icon} size={20} /></span> : null}
            <span className={'ro-t' + (onTap ? ' is-tap' : '')} onClick={onTap ? () => onTap(it) : undefined}>
              <FitLine max={17} min={12}>{pick(it.text)}</FitLine></span>
            <span className="ro-ctl">
              <button type="button" className="ro-arrow" disabled={i === 0 || !canAnswer || solved}
                onClick={() => move(i, i - 1)} aria-label={pick(RO_UP)}>
                <Icon name="up" size={16} />
              </button>
              <button type="button" className="ro-arrow" disabled={i === order.length - 1 || !canAnswer || solved}
                onClick={() => move(i, i + 1)} aria-label={pick(RO_DOWN)}>
                <Icon name="down" size={16} />
              </button>
            </span>
            <span className="ro-grip" aria-hidden="true"
              onPointerDown={(e) => onDown(e, i)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}>
              <i /><i /><i />
            </span>
          </div>
        );
      })}
    </div>
  );
}
const RO_UP = { uz: 'Yuqoriga', ru: 'Выше', en: 'Move up' };
const RO_DOWN = { uz: 'Pastga', ru: 'Ниже', en: 'Move down' };

// ── ПЕРЕТАСКИВАНИЕ В ГНЁЗДА — «разложи по местам» ──────────────────────────
//
// Одна из самых частых механик курса: собрать компьютер из деталей, разложить
// файлы по типам, поставить картинку в документ. Поэтому она в каноне, а не в
// уроке.
//
// ДВА СПОСОБА ПОЛОЖИТЬ, И ОБА НАСТОЯЩИЕ — как в перестановке. Перетаскивание
// нагляднее, но опираться на него одно нельзя: палец у ребёнка соскальзывает, а
// на компьютере без мыши перетаскивания нет вовсе. Поэтому работает и простое
// нажатие: ткнул в деталь — она поднялась, ткнул в гнездо — легла. Это не
// «упрощённый режим», а второй полноценный путь, и он же делает задание
// проходимым с клавиатуры.
//
// ЛИШНИЕ ПРЕДМЕТЫ. У части предметов гнезда нет вовсе, и это не подвох, а суть:
// ребёнок должен отличать нужное от ненужного, а не раскладывать всё подряд.
// Попытка положить лишнее не наказывается — предмет возвращается в лоток, а
// герой объясняет, почему эта вещь тут не нужна.
//
// items = [{ id, text, icon, zone }]   zone: id гнезда или null для лишнего
// zones = [{ id, text, icon, why }]
function DropZones({ items, zones, labels, onSolved, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [put, setPut] = useState(() => (stored && stored.put) || {});   // zoneId -> itemId
  const [held, setHeld] = useState(null);                              // поднятый предмет
  const [bad, setBad] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const placedIds = Object.keys(put).map((z) => put[z]);
  const inTray = items.filter((it) => placedIds.indexOf(it.id) < 0);
  const need = zones.length;
  const all = Object.keys(put).length >= need;
  // Пока предмет не поднят — мигают предметы, после — свободные гнёзда.
  const led = useIdleLed(canAnswer && !all, Object.keys(put).length + (held ? 0.5 : 0));

  // ПОСТАВЛЕННУЮ ЧАСТЬ МОЖНО ПОСЛУШАТЬ ЕЩЁ РАЗ (заказчик, 24.09.2026): нажал
  // на заполненное гнездо — герой повторяет, почему часть стоит здесь. Ради
  // повтора возвращаться «Назад» ребёнок не должен. Попыткой это не считается.
  const replay = (z) => {
    if (!canAnswer || !z.why) return;
    sfx('tap', audio && audio.on);
    if (onSay) onSay(z.why, 'rule');
  };

  const drop = (zoneId) => {
    if (!held || !canAnswer || all) return;
    const it = items.find((x) => x.id === held);
    attempts.current += 1;
    if (it && it.zone === zoneId && !put[zoneId]) {
      const n = Object.assign({}, put); n[zoneId] = it.id;
      setPut(n); setHeld(null);
      sfx('ok', audio && audio.on);
      const z = zones.find((x) => x.id === zoneId);
      if (onSay && z && z.why) onSay(z.why, 'rule');
      if (Object.keys(n).length >= need && onSolved) onSolved({ put: n, attempts: attempts.current });
      return;
    }
    // Не подошло. Предмет возвращается в лоток, герой называет причину:
    // для лишнего — что он тут не нужен, для чужого гнезда — подсказку.
    setBad(zoneId);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setBad(null); setHeld(null);
      if (onSay) onSay(it && it.zone === null && it.why ? it.why : nextEncourageL(), 'think');
    })();
  };

  return (
    <div className="dz">
      <div className="dz-zones">
        {zones.map((z) => {
          const has = put[z.id];
          const it = has ? items.find((x) => x.id === has) : null;
          const open = !has && !!held;
          return (
            <button key={z.id} type="button"
              className={'dz-zone' + (has ? ' is-full fx-ok' : '') + (open ? ' is-open' : '')
                + (bad === z.id ? ' fx-no' : '') + (led && open ? ' is-led' : '')}
              disabled={!canAnswer || (!has && all)}
              onClick={() => (has ? replay(z) : drop(z.id))}>
              {it ? (
                <>
                  <span className="dz-ic"><Icon name={it.icon} size={26} /></span>
                  <span className="dz-t">{pick(it.text)}</span>
                  <span className="dz-tick"><Icon name="check" size={13} /></span>
                </>
              ) : (
                <>
                  <span className="dz-ghost" aria-hidden="true"><Icon name={z.icon} size={26} /></span>
                  <span className="dz-t dz-hint">{pick(z.text)}</span>
                </>
              )}
              <Led on={led && open} />
            </button>
          );
        })}
      </div>

      <div className="dz-tray">
        <span className="dz-tray-h">{pick(all ? labels.done : (held ? labels.toZone : labels.pick))}</span>
        <div className="dz-items">
          {inTray.map((it) => (
            <button key={it.id} type="button"
              className={'dz-item' + (held === it.id ? ' is-held' : '') + (led && !held ? ' is-led' : '')}
              disabled={!canAnswer || all}
              onClick={() => { sfx('tap', audio && audio.on); setHeld(held === it.id ? null : it.id); }}>
              <span className="dz-ic"><Icon name={it.icon} size={24} /></span>
              <span className="dz-t">{pick(it.text)}</span>
              <Led on={led && !held} />
            </button>
          ))}
          {!inTray.length && <span className="dz-empty">{pick(labels.empty)}</span>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ЭКРАН КОМПЬЮТЕРА — монитор в кадре.
//
// Зачем он в каноне. Экран компьютера появляется в уроках про включение, про
// окна, про сохранение и про рисование. у машины есть экран, и на нём что-то происходит. Рамка монитора — единственное, что для этого нужно нарисовать.
//
// Экран «прогревается» при появлении: короткая вспышка и полосы развёртки. Это
// не украшение — именно так ребёнок понимает, что машина СТАРАЯ и её только что
// включили, а значит, дальше он увидит, на что она способна.
// ─────────────────────────────────────────────────────────────────────────────
const OldComputer = ({ children, live }) => (
  <div className={'crt' + (live ? ' is-live' : '')}>
    <div className="crt-frame">
      <div className="crt-screen">
        <span className="crt-scan" aria-hidden="true" />
        {children}
      </div>
      {/* Подбородок с индикатором питания — деталь, по которой монитор
          опознаётся быстрее всего. */}
      <div className="crt-chin" aria-hidden="true"><span className="crt-led" /></div>
    </div>
    {/* Ножка и подставка. Без них рамка читается как планшет, а не как
        компьютер, который Валли выкопал. */}
    <div className="crt-neck" aria-hidden="true" />
    <div className="crt-base" aria-hidden="true" />
  </div>
);


// =============================================================================
// ======  К А Н О Н  ·  Б И Б Л И О Т Е К А   З А Д А Н И Й  (часть 2)  =======
// =============================================================================
// Восемь механик, которых не хватало канону, чтобы двадцать пять уроков не
// превратились в двадцать пять одинаковых. Каждая из них лесенкой ложится на
// уже принятые правила курса, и ни одна их не нарушает:
//
//   · ВРЕМЕНИ НЕТ. Ни отсчёта, ни полоски, ни «успей за десять секунд»
//     (мастер-ТЗ, раздел 2.9). У детей 8–10 лет давление временем даёт
//     тревогу, а не азарт. Единственная «секунда» в курсе — Glance, и её
//     запускает сам ребёнок, сколько угодно раз.
//   · ОЧКОВ НЕТ. Ни баллов, ни рейтинга, ни «ты потерял жизнь». Ошибка
//     ничего не отнимает: карточка качается, звучит подбадривание, которое
//     называет СПОСОБ подумать, а не ответ.
//   · КРАСНОГО НЕТ. Ошибка показывается движением, а не цветом. Канал
//     подсказки — свой, охристый (T.hint), и путать его с ошибкой нельзя.
//   · ТЕЛЕФОН ГЛАВНЕЕ. 90% студентов проходят урок с телефона. Поэтому
//     перетаскивания нигде нет в одиночку: у каждой механики есть путь
//     «ткнул — ткнул», и он не «упрощённый режим», а основной.
//   · ГОВОРИТ ГЕРОЙ. Любая механика отдаёт свои реплики наружу через onSay,
//     а не печатает их сама: озвучка обязательна, и текст на экране — только
//     дубль голоса для тех, у кого звук выключен.
//
// ЧТО ЗДЕСЬ ЛЕЖИТ:
//   Quiz         серия вопросов с разбором — основа пяти квизов курса
//   FlashCards   карточки-перевёртыши: слово с одной стороны, смысл с другой
//   MemoryPairs  «найди пару» — игра памяти без времени и без очков
//   DualPath     два пути одного действия: на компьютере и на телефоне
//   TapSort      разложить много карточек по корзинам, тапами
//   OddOneOut    несколько коротких раундов «найди лишнее» на одном экране
//   Compare      шторка «было — стало»
//   Reflection   последний вопрос без правильного ответа
// =============================================================================

// Общий разбор набора: сколько уже закрыто. Читает стор оборонительно — как и
// seenOf выше: повреждённая запись прошлой сборки не должна ронять урок.
const doneOf = (v) => (v && Array.isArray(v.done) ? v.done : []);

// Перемешивание БЕЗ Math.random. Три причины, и все практические:
//   1) при перезагрузке страницы доска обязана остаться прежней, иначе
//      ребёнок, вернувшийся на экран, видит другую игру и теряет найденное;
//   2) проверка геометрии на стенде должна быть повторяемой — случайная
//      раскладка даёт то влезающий, то не влезающий ряд;
//   3) методисту нужно видеть ровно то же, что увидит ребёнок.
// Ключ считается из строки (id набора), поэтому разные наборы лежат по-разному,
// а один и тот же — всегда одинаково.
const seedShuffle = (arr, key) => {
  let h = 2166136261;
  const s = String(key || '');
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// КВИЗ — серия вопросов с разбором
//
// Основа пяти контрольных уроков курса (6, 12, 18, 24, 30), но годится и на
// один проверочный экран внутри обычного урока.
//
// ЧЕМ ОТЛИЧАЕТСЯ ОТ HintLadder. Лесенка — это ОДИН вопрос, на котором ребёнку
// помогают тремя ступенями подсказки: она учит. Квиз — это МНОГО вопросов
// подряд, и он проверяет. Поэтому здесь нет лесенки, зато есть разбор после
// каждого ответа и общий счётчик пройденного.
//
// ПОЧЕМУ НЕТ «НЕПРАВИЛЬНО». Неверный вариант не гаснет и не перечёркивается:
// он качается и остаётся доступным. Ребёнок отвечает снова столько раз,
// сколько нужно, и уходит с экрана, ЗНАЯ верный ответ, — а не с отметкой о
// провале. Первая попытка при этом честно запоминается в firstTry, и платформа
// видит настоящую картину.
//
// questions = [{ id, ask, node?, options: [{ text } | { node }], correct, why, level? }]
// labels    = { of, next, done }        // «из», подпись кнопки, итог
// ─────────────────────────────────────────────────────────────────────────────
function Quiz({ questions, labels, onDone, onSay, onAsk, stored, canAnswer = true, columns }) {
  const pick = usePick();
  const audio = useAudio();
  const [at, setAt] = useState(() => {
    const d = doneOf(stored);
    return Math.min(d.length, Math.max(0, questions.length - 1));
  });
  const [done, setDone] = useState(() => doneOf(stored));
  const [shake, setShake] = useState(null);
  const [open, setOpen] = useState(false);       // ответ засчитан, ждём «Дальше»
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const firstTry = useRef(stored ? stored.firstTry || 0 : 0);
  const tries = useRef(0);
  const alive = useRef(true);
  const asked = useRef(null);
  useEffect(() => () => { alive.current = false; }, []);

  const q = questions[at];
  const all = done.length >= questions.length;
  const led = useIdleLed(canAnswer && !open && !all, at + ':' + done.length);

  // Вопрос ПРОИЗНОСИТСЯ. Квиз без голоса — это чтение с экрана, а половина
  // восьмилетних читает медленнее, чем слушает. Реплика уходит наружу, чтобы
  // экран поставил её в ту же очередь, что и остальные: два голоса разом
  // недопустимы.
  useEffect(() => {
    if (!q || all || asked.current === q.id) return;
    asked.current = q.id;
    if (onAsk) onAsk(q, at);
  }, [q && q.id, all]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (i) => {
    if (!q || !canAnswer || open || shake !== null) return;
    attempts.current += 1;
    tries.current += 1;
    if (i === q.correct) {
      if (tries.current === 1) firstTry.current += 1;
      setOpen(true);
      sfx('ok', audio && audio.on);
      if (onSay) onSay(joinL(nextPraiseL(), q.why), 'rule');
      return;
    }
    setShake(i);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      if (onSay) { const h = q.hints && q.hints[i]; onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'think'); }
    })();
  };

  const forward = () => {
    const n = done.concat([q.id]);
    setDone(n);
    setOpen(false);
    tries.current = 0;
    if (n.length >= questions.length) {
      if (onDone) onDone({ done: n, attempts: attempts.current, firstTry: firstTry.current });
      return;
    }
    setAt(n.length);
  };

  if (all) {
    return (
      <div className="qz qz-end">
        <span className="qz-all"><Icon name="check" size={22} />{pick(labels.done)}</span>
      </div>
    );
  }

  return (
    <div className="qz">
      <div className="qz-top">
        <span className="qz-n mono">{done.length + 1} {pick(labels.of)} {questions.length}</span>
        {/* Бусины вместо полоски: полоска читается как время, а времени в
            курсе нет. Бусины считают сделанное, а не оставшееся. */}
        <span className="qz-beads" aria-hidden="true">
          {questions.map((x, i) => (
            <i key={x.id} className={'qz-bead' + (i < done.length ? ' is-on' : '') + (i === done.length ? ' is-now' : '')} />
          ))}
        </span>
      </div>

      <div className="qz-card" key={q.id}>
        {q.node ? <div className="qz-node">{q.node}</div> : null}
        <FitLine max={20} min={14}>{pick(q.ask)}</FitLine>
      </div>

      <div className={'qz-opts' + (columns ? ' qz-cols' : '')}>
        {q.options.map((o, i) => (
          <button key={i} type="button"
            className={'qz-o' + (shake === i ? ' fx-no' : '')
              + (open && i === q.correct ? ' is-ok' : '')
              + (led ? ' is-led' : '')}
            disabled={!canAnswer || open}
            onClick={() => answer(i)}>
            {o.node ? <span className="qz-o-node">{o.node}</span> : null}
            {o.text ? <span className="qz-o-t">{pick(o.text)}</span> : null}
            {open && i === q.correct ? <span className="qz-o-tick"><Icon name="check" size={13} /></span> : null}
            <Led on={led && !open} />
          </button>
        ))}
      </div>

      {/* Кнопка появляется только после верного ответа: она и есть согласие
          ребёнка «разбор дослушан, идём дальше». */}
      {open ? (
        <button type="button" className="btn-soft qz-go" onClick={forward}>
          {pick(labels.next)}<Icon name="arrowR" size={16} />
        </button>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// КАРТОЧКИ-ПЕРЕВЁРТЫШИ
//
// Для уроков, где надо познакомить с НАБОРОМ понятий и ни одно из них не
// сложнее остальных: части окна, виды файлов, кнопки браузера. Лицевая сторона
// — что ребёнок видит на экране, оборотная — что это значит.
//
// ПОЧЕМУ ПЕРЕВОРОТ, А НЕ РАСКРЫТИЕ СПИСКОМ. Список из шести определений
// читается как параграф учебника и пролистывается. Переворот требует
// действия на каждой карточке, и это ровно то действие, которое ребёнок
// потом совершит в жизни: посмотрел на значок — вспомнил, что он делает.
//
// ПЕРЕВЁРНУТАЯ КАРТОЧКА НЕ ЗАКРЫВАЕТСЯ САМА. Ребёнок должен иметь возможность
// сравнить две открытые карточки; автозакрытие через секунду превращает
// задание в игру на память, а это отдельная механика (MemoryPairs).
//
// cards  = [{ id, front, back, icon?, node?, backNode?, say? }]
// labels = { all }
// ─────────────────────────────────────────────────────────────────────────────
// Колонок столько, чтобы ряды были РОВНЫМИ: 4 карточки — 2×2, 6 — 3×2, 3 — в
// строку. auto-fit на широком экране ставил четыре карточки как 3 + 1.
function fcCols(n) { return n === 3 || (n % 3 === 0 && n > 4) ? 3 : 2; }

function FlashCards({ cards, labels, onAllSeen, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [seen, setSeen] = useState(() => seenOf(stored));
  const [up, setUp] = useState(() => seenOf(stored));
  const fired = useRef(seenOf(stored).length >= cards.length);
  const all = seen.length >= cards.length;
  const led = useIdleLed(canAnswer && !all, seen.length);

  const flip = (c) => {
    if (!canAnswer) return;
    const isUp = up.indexOf(c.id) >= 0;
    setUp(isUp ? up.filter((x) => x !== c.id) : up.concat([c.id]));
    if (isUp) return;
    sfx('pop', audio && audio.on);
    if (c.say && onSay) onSay(c.say, 'rule');
    if (seen.indexOf(c.id) >= 0) return;
    const n = seen.concat([c.id]);
    setSeen(n);
    if (n.length >= cards.length && !fired.current && onAllSeen) {
      fired.current = true;
      onAllSeen({ seen: n });
    }
  };

  return (
    <div className="fc">
      <div className="fc-grid" style={{ "--fc-cols": fcCols(cards.length) }}>
        {cards.map((c) => {
          const isUp = up.indexOf(c.id) >= 0;
          const was = seen.indexOf(c.id) >= 0;
          return (
            <button key={c.id} type="button"
              className={'fc-card' + (isUp ? ' is-up' : '') + (was ? ' is-seen' : '')
                + (led && !was ? ' is-led' : '')}
              disabled={!canAnswer} onClick={() => flip(c)}
              aria-pressed={isUp}>
              <span className="fc-in">
                <span className="fc-face fc-front">
                  {c.node ? c.node : (c.icon ? <Icon name={c.icon} size={30} /> : null)}
                  <span className="fc-t">{pick(c.front)}</span>
                </span>
                <span className="fc-face fc-back">
                  {c.backNode ? c.backNode : null}
                  <span className="fc-b">{pick(c.back)}</span>
                </span>
              </span>
              {was ? <span className="fc-tick"><Icon name="check" size={12} /></span> : null}
              <Led on={led && !was} />
            </button>
          );
        })}
      </div>
      <p className={'fc-count mono' + (all ? ' is-all' : '')}>
        {all ? pick(labels.all) : seen.length + ' / ' + cards.length}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// НАЙДИ ПАРУ — игра памяти
//
// Единственная чистая ИГРА в курсе, и она заслужила место: повторение без
// скуки. Парой связывается не «слово — слово», а «значок — его работа» или
// «файл — чем открыть», поэтому даже угаданная пара чему-то учит: разбор
// звучит на каждом совпадении.
//
// ЧЕГО ЗДЕСЬ НЕТ. Нет счёта ходов, нет таблицы рекордов, нет «ты проиграл».
// Игра заканчивается ровно одним способом — все пары найдены. Считать ходы
// значит вернуть очки, которых в курсе нет.
//
// ПОЧЕМУ ДОСКА НЕ ПЕРЕМЕШИВАЕТСЯ СЛУЧАЙНО — см. seedShuffle выше.
//
// pairs  = [{ id, a: { text?, icon?, node? }, b: { ... }, why }]
// labels = { all, left }      // итог и подпись счётчика оставшихся пар
// ─────────────────────────────────────────────────────────────────────────────
function MemoryPairs({ pairs, labels, onSolved, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const deck = useMemo(() => {
    const cards = [];
    pairs.forEach((p) => {
      cards.push({ key: p.id + ':a', pair: p.id, face: p.a });
      cards.push({ key: p.id + ':b', pair: p.id, face: p.b });
    });
    return seedShuffle(cards, pairs.map((p) => p.id).join('|'));
  }, [pairs]);

  const [found, setFound] = useState(() => doneOf(stored));
  const [open, setOpen] = useState([]);          // ключи двух открытых карт
  const [miss, setMiss] = useState([]);          // ключи неверной пары — качаются
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const busy = useRef(false);
  const alive = useRef(true);
  const fired = useRef(doneOf(stored).length >= pairs.length);
  useEffect(() => () => { alive.current = false; }, []);

  const all = found.length >= pairs.length;
  const led = useIdleLed(canAnswer && !all, found.length + ':' + open.length);

  const tap = (c) => {
    if (!canAnswer || busy.current || all) return;
    if (found.indexOf(c.pair) >= 0 || open.indexOf(c.key) >= 0) return;
    if (open.length >= 2) return;
    const n = open.concat([c.key]);
    setOpen(n);
    sfx('tap', audio && audio.on);
    if (n.length < 2) return;

    attempts.current += 1;
    const a = deck.find((x) => x.key === n[0]);
    const b = deck.find((x) => x.key === n[1]);
    if (a.pair === b.pair) {
      const f = found.concat([a.pair]);
      busy.current = true;
      (async () => {
        await sleep(260);
        if (!alive.current) return;
        setFound(f);
        setOpen([]);
        busy.current = false;
        sfx('ok', audio && audio.on);
        const p = pairs.find((x) => x.id === a.pair);
        if (onSay) onSay(joinL(nextPraiseL(), p && p.why), 'rule');
        if (f.length >= pairs.length && !fired.current && onSolved) {
          fired.current = true;
          onSolved({ done: f, attempts: attempts.current });
        }
      })();
      return;
    }
    // Не пара. Карты остаются открытыми почти секунду — ребёнку нужно
    // успеть их запомнить, в этом вся игра. Меньше 800 мс — и запомнить
    // не успевает даже взрослый.
    busy.current = true;
    setMiss(n);
    (async () => {
      await sleep(820);
      if (!alive.current) return;
      setMiss([]);
      setOpen([]);
      busy.current = false;
    })();
  };

  return (
    <div className="mp">
      <div className="mp-grid">
        {deck.map((c) => {
          const isFound = found.indexOf(c.pair) >= 0;
          const isOpen = isFound || open.indexOf(c.key) >= 0;
          return (
            <button key={c.key} type="button"
              className={'mp-card' + (isOpen ? ' is-up' : '') + (isFound ? ' is-found' : '')
                + (miss.indexOf(c.key) >= 0 ? ' fx-no' : '') + (led && !isOpen ? ' is-led' : '')}
              disabled={!canAnswer || isFound} onClick={() => tap(c)}>
              <span className="mp-in">
                <span className="mp-face mp-back" aria-hidden={isOpen}>
                  <Icon name="star" size={20} />
                </span>
                <span className="mp-face mp-front" aria-hidden={!isOpen}>
                  {c.face.node ? c.face.node : (c.face.icon ? <Icon name={c.face.icon} size={24} /> : null)}
                  {c.face.text ? <span className="mp-t">{pick(c.face.text)}</span> : null}
                </span>
              </span>
              <Led on={led && !isOpen} />
            </button>
          );
        })}
      </div>
      <p className={'mp-count mono' + (all ? ' is-all' : '')}>
        {all ? pick(labels.all) : (pairs.length - found.length) + ' ' + pick(labels.left)}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ДВА ПУТИ — на компьютере и на телефоне
//
// Прямое следствие решения заказчицы 23.09.2026: девяносто процентов
// студентов проходят курс с телефона, и «щёлкни правой кнопкой мыши» для них
// не инструкция, а тупик. Но и компьютер из курса не убрать — урок про него.
//
// Поэтому КАЖДОЕ действие, которое на двух устройствах делается по-разному,
// показывается парой, и ребёнок обязан открыть обе вкладки. Не «выбери своё
// устройство», а именно обе: ребёнок с телефона всё равно сядет за компьютер
// в школе, и наоборот.
//
// ПЕРВОЙ ОТКРЫВАЕТСЯ СВОЯ. Определяем по указателю (useTouch): пришёл с
// телефона — сверху телефонный путь. Это не подмена содержания, а порядок
// чтения: своё сначала, чужое следом.
//
// pc / phone = { steps: [{ icon?, text }], say?, node? }
// labels     = { pc, phone, both }
// ─────────────────────────────────────────────────────────────────────────────
function DualPath({ pc, phone, labels, onBothSeen, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const touch = useTouch();
  const [tab, setTab] = useState(() => (seenOf(stored)[0] || (touch ? 'phone' : 'pc')));
  const [seen, setSeen] = useState(() => {
    const s = seenOf(stored);
    return s.length ? s : [touch ? 'phone' : 'pc'];
  });
  const fired = useRef(seenOf(stored).length >= 2);
  const said = useRef({});
  const both = seen.length >= 2;

  // Вкладка, открытая при первом показе, тоже считается увиденной и тоже
  // озвучивается — иначе ребёнок слышит объяснение только второго пути.
  useEffect(() => {
    const cur = tab === 'pc' ? pc : phone;
    if (said.current[tab] || !cur || !cur.say || !onSay) return;
    said.current[tab] = true;
    onSay(cur.say, 'rule');
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (which, auto) => {
    if (!canAnswer || which === tab) return;
    setTab(which);
    if (!auto) sfx('tap', audio && audio.on);
    if (seen.indexOf(which) >= 0) return;
    const n = seen.concat([which]);
    setSeen(n);
    if (n.length >= 2 && !fired.current && onBothSeen) {
      fired.current = true;
      onBothSeen({ seen: n });
    }
  };

  // Заказчик, 27.09.2026: во «Двух путях» ребёнок ничего не нажимает. Луми
  // договорил про первый путь — и сам открывает второй. canAnswer здесь и
  // есть «Луми договорил»: экран отдаёт его после реплики. Повторно не
  // переключаем: вкладку, про которую уже сказано, ребёнок откроет сам.
  useEffect(() => {
    if (!canAnswer) return undefined;
    const other = tab === 'pc' ? 'phone' : 'pc';
    if (!said.current[tab] || said.current[other]) return undefined;
    const t = setTimeout(() => go(other, true), 600);
    return () => clearTimeout(t);
  }, [canAnswer, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const cur = tab === 'pc' ? pc : phone;
  return (
    <div className="dp">
      <div className="dp-tabs" role="tablist">
        {[['pc', labels.pc, 'pc'], ['phone', labels.phone, 'phone']].map(([k, lab, ico]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k}
            className={'dp-tab' + (tab === k ? ' is-on' : '') + (seen.indexOf(k) >= 0 ? ' is-seen' : '')}
            onClick={() => go(k)}>
            <Icon name={ico} size={17} />{pick(lab)}
            {seen.indexOf(k) >= 0 ? <span className="dp-tick"><Icon name="check" size={11} /></span> : null}
          </button>
        ))}
      </div>
      <div className="dp-body" key={tab}>
        {cur.node ? <div className="dp-node">{cur.node}</div> : null}
        <ol className="dp-steps">
          {(cur.steps || []).map((s, i) => (
            <li key={i} className="dp-step">
              {s.icon ? <Icon name={s.icon} size={17} /> : null}
              <span className="dp-t">{pick(s.text)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// РАЗЛОЖИ ПО КОРЗИНАМ — тапами
//
// Отличие от DropZones: там одно гнездо ждёт ровно один предмет (собрать
// компьютер), здесь в корзину ложится СКОЛЬКО УГОДНО карточек — это
// классификация: файлы по типу, вещи по месту, клавиши по работе.
//
// ПЕРЕТАСКИВАНИЯ НЕТ ВООБЩЕ. Не «есть ещё и тапы», а только тапы: ткнул в
// карточку — ткнул в корзину. На телефоне перетаскивание через пол-экрана
// срывается у каждого второго ребёнка, а двумя касаниями попадают все.
// Отмена — повторный тап по взятой карточке.
//
// items  = [{ id, text, icon?, node?, bin }]
// bins   = [{ id, text, icon?, why }]
// labels = { pick, toBin, all }
// ─────────────────────────────────────────────────────────────────────────────
function TapSort({ items, bins, labels, onSolved, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [put, setPut] = useState(() => (stored && stored.put && typeof stored.put === 'object' ? stored.put : {}));
  const [held, setHeld] = useState(null);
  const [shake, setShake] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  const fired = useRef(false);
  useEffect(() => () => { alive.current = false; }, []);

  const rest = items.filter((it) => !put[it.id]);
  const all = rest.length === 0;
  const led = useIdleLed(canAnswer && !all, Object.keys(put).length + ':' + (held || ''));

  useEffect(() => {
    if (!all || fired.current || !onSolved) return;
    fired.current = true;
    onSolved({ put, attempts: attempts.current });
  }, [all]); // eslint-disable-line react-hooks/exhaustive-deps

  const take = (it) => {
    if (!canAnswer || all) return;
    sfx('tap', audio && audio.on);
    setHeld(held === it.id ? null : it.id);
  };

  const drop = (bin) => {
    if (!canAnswer || !held) return;
    const it = items.find((x) => x.id === held);
    attempts.current += 1;
    if (it.bin === bin.id) {
      setPut(Object.assign({}, put, { [it.id]: bin.id }));
      setHeld(null);
      sfx('ok', audio && audio.on);
      if (onSay) onSay(joinL(nextPraiseL(), bin.why), 'rule');
      return;
    }
    setShake(bin.id);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      if (onSay) { const h = it.hint; onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'think'); }
    })();
  };

  return (
    <div className="ts">
      <p className="ts-ask">{pick(all ? labels.all : (held ? labels.toBin : labels.pick))}</p>
      <div className="ts-items">
        {rest.map((it) => (
          <button key={it.id} type="button"
            className={'ts-item' + (held === it.id ? ' is-held' : '') + (led && !held ? ' is-led' : '')}
            disabled={!canAnswer} onClick={() => take(it)}>
            {it.node ? it.node : (it.icon ? <Icon name={it.icon} size={19} /> : null)}
            <span className="ts-t">{pick(it.text)}</span>
            <Led on={led && !held} />
          </button>
        ))}
        {all ? <span className="ts-empty"><Icon name="check" size={18} /></span> : null}
      </div>
      <div className="ts-bins">
        {bins.map((b) => {
          const mine = items.filter((it) => put[it.id] === b.id);
          return (
            <button key={b.id} type="button"
              className={'ts-bin' + (shake === b.id ? ' fx-no' : '') + (held ? ' is-open' : '')
                + (led && held ? ' is-led' : '')}
              disabled={!canAnswer || !held} onClick={() => drop(b)}>
              <span className="ts-bin-h">
                {b.icon ? <Icon name={b.icon} size={17} /> : null}
                <span className="ts-bin-t">{pick(b.text)}</span>
              </span>
              <span className="ts-bin-in">
                {mine.map((it) => (
                  <span key={it.id} className="ts-chip">
                    {it.icon ? <Icon name={it.icon} size={13} /> : null}{pick(it.text)}
                  </span>
                ))}
              </span>
              <Led on={led && !!held} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// НАЙДИ ЛИШНЕЕ — несколько коротких раундов на одном экране
//
// Обобщение экрана s8 урока 14, где это было написано внутри урока. Механика
// нужна везде, где важно отличить нужное от лишнего: лишняя строка в
// объявлении, лишний файл в папке, лишнее слово в поисковом запросе.
//
// ТРИ РАУНДА, А НЕ ОДИН. Один раунд — это вопрос на удачу: из трёх вариантов
// угадывают с первого раза почти все. Три коротких раунда подряд показывают
// ребёнку ПРАВИЛО, а не ответ, потому что лишнее в них лишнее по одной и той
// же причине. Больше пяти раундов — уже утомительно.
//
// rounds = [{ id, title?, items: [{ id, text?, node? }], odd, why }]
// labels = { all }
// ─────────────────────────────────────────────────────────────────────────────
function OddOneOut({ rounds, labels, onSolved, onSay, onAsk, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [done, setDone] = useState(() => doneOf(stored));
  const [shake, setShake] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  const fired = useRef(doneOf(stored).length >= rounds.length);
  useEffect(() => () => { alive.current = false; }, []);

  const at = Math.min(done.length, rounds.length - 1);
  const all = done.length >= rounds.length;
  const led = useIdleLed(canAnswer && !all, done.length);
  // Вопрос ряда звучит: заголовок над клавишами читать умеют не все.
  useEffect(() => { if (!all && onAsk && rounds[at]) onAsk(rounds[at]); }, [at, all]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (r, it) => {
    if (!canAnswer || all || shake) return;
    attempts.current += 1;
    if (it.id === r.odd) {
      const n = done.concat([r.id]);
      setDone(n);
      sfx('ok', audio && audio.on);
      if (onSay) onSay(joinL(nextPraiseL(), r.why), 'rule');
      if (n.length >= rounds.length && !fired.current && onSolved) {
        fired.current = true;
        onSolved({ done: n, attempts: attempts.current });
      }
      return;
    }
    setShake(it.id);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      if (onSay) { const h = it.hint || r.hint; onSay(h ? joinL(nextEncourageL(), h) : nextEncourageL(), 'think'); }
    })();
  };

  return (
    <div className="ooo">
      <span className="ooo-beads" aria-hidden="true">
        {rounds.map((r, i) => (
          <i key={r.id} className={'ooo-bead' + (i < done.length ? ' is-on' : '') + (i === done.length ? ' is-now' : '')} />
        ))}
      </span>
      {all ? (
        <span className="ooo-all"><Icon name="check" size={20} />{pick(labels.all)}</span>
      ) : (
        <div className="ooo-round" key={rounds[at].id}>
          {rounds[at].title ? <p className="ooo-title">{pick(rounds[at].title)}</p> : null}
          <div className="ooo-items">
            {rounds[at].items.map((it) => (
              <button key={it.id} type="button"
                className={'ooo-item' + (shake === it.id ? ' fx-no' : '') + (led ? ' is-led' : '')}
                disabled={!canAnswer} onClick={() => tap(rounds[at], it)}>
                {it.node ? it.node : null}
                {it.text ? <span className="ooo-t">{pick(it.text)}</span> : null}
                <Led on={led} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ШТОРКА «БЫЛО — СТАЛО»
//
// Показать разницу, а не рассказать о ней. Две картинки лежат одна на другой,
// ребёнок водит ручкой и сам решает, где граница. Работает там, где разница
// не в словах: оформленный текст против неоформленного, прибранный рабочий
// стол против заваленного, крупный плакат против мелкого.
//
// ПОЧЕМУ ИМЕННО ШТОРКА. Две картинки рядом ребёнок сравнивает по очереди и
// разницу в мелочах не ловит. Шторка ставит их в одно и то же место экрана, и
// изменение становится движением — а движение восьмилетний замечает всегда.
//
// СЧИТАЕТСЯ УВИДЕННЫМ, когда ручка побывала и слева, и справа: иначе можно
// сдвинуть на пиксель и пойти дальше. Порог мягкий (треть ширины), придираться
// к точности здесь не за что.
//
// before / after = { node, label }
// labels         = { both }
// ─────────────────────────────────────────────────────────────────────────────
function Compare({ before, after, labels, onSeen, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  // Шторка начинается НЕ посередине. Посередине видно половину одного
  // документа и половину другого — и если у них разная вёрстка, строки не
  // совпадают и читается это не как сравнение, а как поломка. Поэтому
  // сначала показываем почти целиком «было», а «стало» выглядывает краем:
  // ребёнок видит один целый документ и понимает, что за ним есть второй.
  // 78, а не 90, чтобы подпись справа оставалась видна.
  const [x, setX] = useState(78);
  const [edges, setEdges] = useState(() => seenOf(stored));
  const boxRef = useRef(null);
  const fired = useRef(seenOf(stored).length >= 2);
  const both = edges.length >= 2;
  const led = useIdleLed(canAnswer && !both, edges.length);

  const mark = (v) => {
    const side = v < 34 ? 'l' : (v > 66 ? 'r' : null);
    if (!side || edges.indexOf(side) >= 0) return;
    const n = edges.concat([side]);
    setEdges(n);
    sfx('pop', audio && audio.on);
    if (n.length >= 2 && !fired.current && onSeen) {
      fired.current = true;
      onSeen({ seen: n });
    }
  };

  const move = (clientX) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const v = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setX(v);
    mark(v);
  };

  const onDown = (e) => {
    if (!canAnswer) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e.clientX);
  };
  const onMove = (e) => {
    if (!canAnswer || !e.currentTarget.hasPointerCapture || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    move(e.clientX);
  };
  // Клавиатура — полноценный второй путь, как стрелки у Reorder.
  const onKey = (e) => {
    if (!canAnswer) return;
    if (e.key === 'ArrowLeft') { const v = Math.max(0, x - 8); setX(v); mark(v); }
    if (e.key === 'ArrowRight') { const v = Math.min(100, x + 8); setX(v); mark(v); }
  };

  return (
    <div className="cmp">
      <div className="cmp-box" ref={boxRef}
        onPointerDown={onDown} onPointerMove={onMove}>
        <div className="cmp-layer cmp-after">{after.node}</div>
        <div className="cmp-layer cmp-before" style={{ clipPath: 'inset(0 ' + (100 - x) + '% 0 0)' }}>
          {before.node}
        </div>
        <span className="cmp-lab cmp-lab-l" style={{ opacity: x > 18 ? 1 : 0 }}>{pick(before.label)}</span>
        <span className="cmp-lab cmp-lab-r" style={{ opacity: x < 82 ? 1 : 0 }}>{pick(after.label)}</span>
        <div className={'cmp-bar' + (led ? ' is-led' : '')} style={{ left: x + '%' }}>
          <button type="button" className="cmp-grip" disabled={!canAnswer}
            onKeyDown={onKey} aria-label={pick(before.label) + ' / ' + pick(after.label)}>
            <Icon name="arrowR" size={14} />
          </button>
        </div>
      </div>
      {both ? <p className="cmp-both">{pick(labels.both)}</p> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// РЕФЛЕКСИЯ — вопрос без правильного ответа
//
// Ставится между «получилось» и кубком. Ребёнок выбирает, что из урока
// пригодится ему самому, а герой отвечает на КАЖДЫЙ выбор по-своему. Ни один
// вариант не помечается верным: помеченный верным превращает рефлексию в ещё
// одну проверку, и ребёнок начинает угадывать ожидаемое.
//
// ОТВЕТ МОЖНО ПОМЕНЯТЬ. Передумал — нажал другой, герой ответит заново. Это и
// есть разница между мнением и оценкой.
//
// options = [{ id, text, icon?, reply }]
// ─────────────────────────────────────────────────────────────────────────────
function Reflection({ options, onPicked, onSay, stored, canAnswer = true }) {
  const pick = usePick();
  const audio = useAudio();
  const [at, setAt] = useState(() => (stored && stored.pick) || null);
  const led = useIdleLed(canAnswer && !at, at || '');

  const tap = (o) => {
    if (!canAnswer) return;
    setAt(o.id);
    sfx('pop', audio && audio.on);
    if (onSay) onSay(o.reply, 'smile');
    if (onPicked) onPicked({ pick: o.id });
  };

  return (
    <div className="rf">
      {options.map((o) => (
        <button key={o.id} type="button"
          className={'rf-o' + (at === o.id ? ' is-on' : '') + (led ? ' is-led' : '')}
          disabled={!canAnswer} onClick={() => tap(o)} aria-pressed={at === o.id}>
          {o.icon ? <Icon name={o.icon} size={24} /> : null}
          <span className="rf-t">{pick(o.text)}</span>
          <Led on={led} />
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// ===============  К А Н О Н  ·  П Р А В К И   В Ё Р С Т К И  =================
// =============================================================================
// Правки по UI-ревью (2026-09-24, komp-gramotnost/REVIEW-UI.md). Блок идёт
// ПОСЛЕДНИМ в стилях урока и поэтому перекрывает и каркас, и CSS урока.
// Одинаковый во всех уроках; источник — komp-gramotnost/_canon/ui-canon.jsx.
// =============================================================================
const CANON_UI_CSS = `
/* КУРС HTML: ПОДСКАЗКА ПРИ БЕЗДЕЙСТВИИ (useIdleCoach). Зовёт ровно одна
   кнопка: открытая «Дальше», а если она закрыта — лампочка подсказки. */
.stage.is-idle:not(:has(.stage-nav .btn-ready)) .ctl-hint { position: relative;
  animation: idleHint 1.5s ease-in-out infinite; }
@keyframes idleHint {
  0%, 100% { transform: none; box-shadow: 0 0 0 0 rgba(192,138,18,.5); }
  20% { transform: scale(1.14) rotate(-10deg); }
  40% { transform: scale(1.14) rotate(8deg); }
  60% { transform: none; box-shadow: 0 0 0 12px rgba(192,138,18,0); } }
.stage.is-idle .stage-nav .btn-ready { animation: idleNext 1.3s ease-in-out infinite; }
@keyframes idleNext {
  0%, 100% { transform: none; box-shadow: 0 3px 0 ${T.uiDk}, 0 0 0 0 rgba(255,79,40,.45); }
  30% { transform: translateY(-6px); }
  55% { transform: none; box-shadow: 0 3px 0 ${T.uiDk}, 0 0 0 12px rgba(255,79,40,0); } }
/* Рука-указатель (уровень 2): под лампочкой пальцем вверх, над «Дальше» —
   пальцем вниз. Рисунок — иконка pointer (Lucide, ISC). */
.stage.is-idle-2:not(:has(.stage-nav .btn-ready)) .ctl-hint::after,
.stage.is-idle-2 .stage-nav .btn-ready::before {
  content: ''; position: absolute; z-index: 30; width: 38px; height: 38px; pointer-events: none;
  background: no-repeat center / contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff' stroke='%23292524' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15V4a2 2 0 0 1 4 0v5.5V9a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0z'/%3E%3Cpath d='M11 9.5V13M15 10v3M19 11v2'/%3E%3C/svg%3E");
  filter: drop-shadow(0 4px 6px rgba(${T.shadowBase},.35)); }
.stage.is-idle-2:not(:has(.stage-nav .btn-ready)) .ctl-hint::after {
  top: calc(100% + 2px); left: 50%; margin-left: -12px; animation: idleHandUp .9s ease-in-out infinite; }
.stage.is-idle-2 .stage-nav .btn-ready::before {
  bottom: calc(100% + 4px); left: 50%; margin-left: -14px; animation: idleHandDown .9s ease-in-out infinite; }
@keyframes idleHandUp { 0%, 100% { transform: translateY(6px); } 50% { transform: translateY(0); } }
@keyframes idleHandDown { 0%, 100% { transform: rotate(180deg) translateY(6px); } 50% { transform: rotate(180deg) translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .stage.is-idle .ctl-hint, .stage.is-idle .stage-nav .btn-ready,
  .stage.is-idle-2 .ctl-hint::after, .stage.is-idle-2 .stage-nav .btn-ready::before { animation: none; } }

/* КУРС HTML: Коди в шапке вместо строки героя (Stage voiceTop) — только на
   телефоне: узкий экран или телефон лёжа. На ноутбуке строка героя на месте,
   в шапке его нет. Строка прячется, но не размонтируется: пузырь ведёт озвучку. */
.stage-voicetop .ctl-voice { display: none; }
.kodi-dot { width: var(--ctl); height: var(--ctl); flex: 0 0 auto; place-items: center; }
.kodi-dot .kodi-av { width: 100%; }
/* Волны у маленького кружка в шапке скромнее — не наезжают на полосу прогресса. */
.kodi-dot .kodi-waves { transform: scale(.8); }
@media (max-width: 719px), (orientation: landscape) and (max-height: 500px) {
  .stage-voicetop .ctl-voice { display: grid; }
  .stage-voicetop .speaker-wrap { position: absolute; width: 1px; height: 1px; padding: 0; margin: 0;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .stage-voicetop .stage-content { grid-column: 1 / -1; }
}
/* КУРС HTML: невысокий ноутбук (окно 700–860 px) — кружок Коди чуть меньше
   крупного яруса: на окне 720 px ~72 px. На ноутбуке Коди всегда на месте. */
@media (min-width: 760px) and (min-height: 700px) and (max-height: 860px) {
  .lesson-root { --av: clamp(68px, min(9vw, 10dvh), 96px); }
}

/* КУРС HTML: МЕСТО КОДИ (заказчик, 17.10.2026) — телефон: в шапке у подсказки;
   планшет и компьютер: справа снизу, крупнее. */
.chrome-side { margin-left: auto; }
.ctl-voice { display: none; }
@media (max-width: 759px) {
  .ctl-voice { display: grid; }
  /* Вокруг кружка — место для волн: они не прячутся под кнопку подсказки.
     Волны здесь крупнее (waveAmp у VoiceDot) и плотнее — кружок маленький. */
  .kodi-dot { position: relative; z-index: 1; width: clamp(46px, 13vw, 52px); height: clamp(46px, 13vw, 52px);
    margin-inline: 14px 18px; }
  .kodi-dot .kodi-waves { transform: none; }
  .kodi-dot .kodi-wave { opacity: .5; }
  .kodi-dot .kodi-wave-2 { opacity: .62; }
  .kodi-dot .kodi-wave-3 { opacity: .8; }
  .speaker-av { display: none; }
  .stage:not(:has(.speaker-bubble)) > .speaker-wrap { position: absolute; width: 1px; height: 1px; padding: 0; margin: 0;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .speaker-bot .speaker-bubble { border-radius: 18px 6px 18px 18px;
    box-shadow: 0 2px 0 rgba(58,53,48,0.05), 0 12px 26px -16px rgba(58,53,48,0.5), inset -3px 0 0 #FF4F28; }
}
@media (min-width: 760px) and (min-height: 501px) {
  .lesson-root { --av: clamp(84px, min(10vw, 13dvh), 128px); }
  .stage-content { order: 2; }
  .speaker-wrap { order: 3; position: relative; padding-top: 0; padding-bottom: clamp(8px, 1.2dvh, 14px); background: transparent; }
  .stage-nav { order: 4; }
  .speaker, .stage-hero-fixed .speaker { flex-direction: row-reverse; min-height: 0; animation: none; }
  /* Без анимации влёта: строка героя пересоздаётся на каждой реплике, и
     кружок в углу «выпрыгивал» бы заново (а в части браузеров застревал
     полупрозрачным на первом кадре). Коди в углу просто стоит. */
  .speaker-av { position: absolute; z-index: 30; right: clamp(16px, 1.8vw, 32px); bottom: calc(var(--av) * .12 + 4px);
    animation: none; }
  .speaker-bot .speaker-bubble { flex: 0 1 auto; margin-right: calc(var(--av) + clamp(16px, 2vw, 30px));
    max-width: min(640px, 72%); max-height: min(20dvh, 180px); border-radius: 24px 24px 8px 24px;
    box-shadow: 0 2px 0 rgba(58,53,48,0.05), 0 16px 34px -16px rgba(58,53,48,0.55), inset 0 -3px 0 #FF4F28; }
  .stage:has(> .speaker-wrap):not(:has(.speaker-bubble)) .stage-content { padding-bottom: calc(var(--av) + 10px); }
  .stage-content.has-speaker::before { max-height: clamp(4px, 30dvh, 260px); }
}
/* Широкий экран: справа от колонки содержания хватает поля — Коди стоит в
   нём и ничего не закрывает, запас снизу не нужен; облако — к правому краю
   колонки, рядом с Коди. */
@media (min-width: 1200px) and (min-height: 501px) {
  .stage:has(> .speaker-wrap):not(:has(.speaker-bubble)) .stage-content { padding-bottom: 6px; }
  .speaker-bot .speaker-bubble { margin-right: 0; }
}

/* UI-09: служебные кнопки не меньше 44 px — меньше палец ребёнка промахивается. */
.lesson-root { --ctl: clamp(44px, 5.4vw, 48px); }

/* UI-10, UI-11: ряды карточек «зачем» и «итог» ровные при любом числе.
   4 — сеткой 2×2, 3 и 6 — по три в ряд. auto-fit давал 2 + одинокую третью. */
.why, .rf { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 500px; width: 100%; align-self: center; }
.why:has(> :nth-child(3):last-child), .rf:has(> :nth-child(3):last-child),
.why:has(> :nth-child(6)), .rf:has(> :nth-child(6)) { grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 640px; }

/* UI-13: карточки сортировки — сеткой по две, а не потоком (давал 3 + 1). */
.ts-items { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 460px;
  width: 100%; margin-inline: auto; justify-content: stretch; }
.ts-items:has(> :nth-child(5)) { grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 600px; }
.ts-item { min-height: 48px; justify-content: center; }

/* UI-17: стрелки перестановки — полноценные цели 44 × 44, рядом, а не столбиком. */
.ro-ctl { flex-direction: row; gap: 4px; }
.ro-arrow { width: 44px; height: 44px; border-radius: 12px; }
.ro-grip { width: 32px; }
/* UI-18: длинный шаг переносится в две строки одним кеглем на весь список,
   а не режется многоточием и не сжимается сильнее соседей. */
.ro-t .fit-line { white-space: normal !important; font-size: clamp(14px, 2vw, 17px) !important;
  line-height: 1.2; text-overflow: clip; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

/* Строка шага растёт по тексту: при фиксированной высоте длинный шаг на узком
   экране обрезался. Перетаскивание берёт высоту строки со страницы. */
.ro-row { height: auto; min-height: clamp(48px, 7.6dvh, 60px); padding-block: 4px; }

/* «Найди пары»: 6 карточек — 3 + 3, 8 — 4 + 4 (было 4 + 2); подписи от 13 px. */
.mp-grid:has(> :nth-child(6):last-child) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.mp-t { font-size: clamp(13px, 1.4vw, 15px); }

/* UI-21: одно место для части — по центру, а не в левой половине сетки. */
.dz-zones:has(> :only-child) > * { grid-column: 1 / -1; justify-self: center; width: min(100%, 280px); }

/* UI-20: подписи карточек не мельче 13 px. */
.why-t { font-size: clamp(13px, min(1.9vw, 2dvh), 17px); }
.fc-t { font-size: clamp(13px, 1.8vw, 15px); }
.fc-b { font-size: clamp(13px, 1.7vw, 14px); }
.dz-t { font-size: clamp(13px, 1.7vw, 14px); }
.ts-t { font-size: clamp(13px, 1.8vw, 15px); }
.rf-t { font-size: clamp(13px, 1.8vw, 15px); }
.cmp-lab { font-size: 13px; }
.ts-bin-t { font-size: clamp(13px, 1.7vw, 15px); }
.skill-row { font-size: clamp(13px, 1.8vw, 16px); }
.dz-tray-h, .ask-n { font-size: 13px; }
.fc-count { font-size: clamp(13px, 1.7vw, 14px); }

/* UI-22: текст подсказок и счётчик — ink2 (контраст ~6.5:1), ink3 только для декора. */
.dz-hint, .counter { color: ${T.ink2}; }

/* UI-32: буквы-метки вариантов контрастнее, а не серые плашки. */
.opt-mark { background: ${T.blueSoft}; color: ${T.blueDk}; }

/* UI-07: прощание — подпись под роботом (только если голоса нет) и карточка
   следующего урока из карты модуля. */
.bye { flex-direction: column; gap: clamp(10px, 2dvh, 18px); }
.bye-say { max-width: 460px; text-align: center; font-size: clamp(16px, 2.3vw, 19px); font-weight: 600;
  line-height: 1.4; color: ${T.ink}; }
.bye-next { display: flex; align-items: center; gap: 12px; padding: 12px 18px 12px 12px; border-radius: 18px;
  background: #171340; color: #EDF2FF; max-width: 420px;
  box-shadow: 0 12px 26px -16px rgba(${T.shadowBase}, 0.7); }
.bye-next-ic { flex: 0 0 auto; width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center;
  background: #12102C; border: 2.5px solid currentColor; }
.bye-next-t { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.bye-next-t span { font-size: 13px; font-weight: 700; color: #A3B1DC; }
.bye-next-t b { font-size: clamp(15px, 2.2vw, 18px); font-weight: 800; line-height: 1.25; color: #EDF2FF; }

/* ══════════════════════════════════════════════════════════════
   UI-01: ТЕЛЕФОН ЛЁЖА. Высоты не хватает, чтобы поставить героя НАД сценой:
   герой с облаком уходят колонкой влево, сцена — справа. Страховка —
   прокрутка сцены: лучше прокрутить, чем не увидеть Enter или лоток с частями.
   ══════════════════════════════════════════════════════════════ */
@media (orientation: landscape) and (max-height: 500px) {
  .lesson-root { --av: clamp(40px, 11dvh, 52px); --gap-stack: 8px; --bar-y: 5px; }
  .stage { display: grid; grid-template-columns: minmax(170px, 30%) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto; }
  .stage-header { grid-column: 1 / -1; grid-row: 1; }
  .speaker-wrap { grid-column: 1; grid-row: 2; min-height: 0; overflow-y: auto;
    display: flex; align-items: center; padding-right: 0; }
  .speaker-wrap > .limit { width: 100%; }
  .speaker, .stage-hero-fixed .speaker { flex-direction: column; align-items: flex-start; gap: 6px; min-height: 0; }
  .speaker-bubble { max-height: none; overflow: visible; font-size: 14px; align-self: stretch; }
  .stage-content { grid-column: 2; grid-row: 2; overflow-y: auto; padding-top: 6px; }
  .stage-content:not(.has-speaker), .stage-bare .stage-content { grid-column: 1 / -1; }
  .stage-content::before, .stage-content::after,
  .stage-content.has-speaker::before { max-height: 10px; }
  .stage-nav { grid-column: 1 / -1; grid-row: 3; }
  .btn-accent, .btn-ghost { min-height: 44px; padding: 8px 18px; }
  .mmap { min-height: 180px; }
  /* Прощание: робот и карточка следующего урока в ряд, а не столбиком. */
  .bye { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .bye-bot { width: clamp(76px, 26dvh, 110px); }
  .bye-say { flex: 1 1 100%; font-size: 15px; }
}
`;

// Оформление экранов, которые есть в КАЖДОМ уроке по формуле GSX: миссия,
// «зачем это нужно», соединение пар, кубок достижения, прощание. Урок
// дописывает своё в LESSON_CSS и канон не трогает.
//
// Сюда же — общий блок отключения анимаций. Селекторы, которых в конкретном
// уроке нет, просто ни на что не действуют, а забыть этот блок в новом уроке
// значит отдать ребёнку с настройкой «меньше движения» мигающий экран.
const CANON_SCREEN_CSS_BASE = `
/* ══════════════════════════════════════════════════════════════
   МИССИЯ — четыре шага сеткой 2×2
   В одну строку они были мелкими и не читались на телефоне.
   ══════════════════════════════════════════════════════════════ */
.mission-title { text-align: center; }
/* Подзаголовок — часть композиции, а не отдельная строка сбоку: он стоит по
   центру прямо под заголовком, и счётчик идёт в одну строку с ним. */
.mission-sub { display: flex; align-items: center; justify-content: center; gap: 8px;
  text-align: center; margin-top: -4px; }
.steps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(7px, 1.4vw, 12px); width: 100%; max-width: 440px; align-self: center; }
.step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px;
  min-height: clamp(84px, 13dvh, 118px); padding: clamp(9px, 1.8vw, 14px) 8px;
  border: 2px solid transparent; border-radius: 16px; background: ${T.paper};
  font: inherit; text-align: center; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 22px -20px rgba(${T.shadowBase},0.5);
  transition: border-color .25s, transform .18s, background .3s; }
.step:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-3px); }
.step:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
/* Цифры крупные и заметные — раньше они были мелкими и терялись. */
.step-n { width: 30px; height: 30px; border-radius: 50%; background: ${T.uiSoft}; color: ${T.uiDk};
  display: grid; place-items: center; font-size: 16px; font-weight: 800; }
.step-ic { color: ${T.uiDk}; display: grid; place-items: center; }
.step-t { font-size: clamp(13px, 1.9vw, 16px); font-weight: 700; color: ${T.ink}; line-height: 1.2; }
/* ТРИ ШАГА — СТРОКАМИ, А НЕ СЕТКОЙ 2×2.
   Три коробки в двухколоночной сетке дают ряд из двух и одинокую третью —
   выглядит как недоделанное. Три правила естественнее читаются списком:
   значок слева, подпись справа. Заодно подписи перестают переноситься на
   узком экране, где в сетке им не хватало ширины. */
.steps-3 { grid-template-columns: 1fr; max-width: 420px; }
.steps-3 .step { flex-direction: row; justify-content: flex-start; text-align: left;
  gap: clamp(10px, 2vw, 14px); min-height: clamp(54px, 8.6dvh, 70px);
  padding: 8px clamp(12px, 2.2vw, 16px); }
.steps-3 .step-t { flex: 1 1 auto; min-width: 0; }
.steps-3 .step-ic { flex: 0 0 auto; }

.step.is-done { background: ${T.successSoft}; border-color: ${T.success}; cursor: pointer; animation: okPop .38s; }
.step.is-done .step-n { background: ${T.success}; color: #fff; }
.step.is-done .step-ic, .step.is-done .step-t { color: ${T.success}; }
.step-tick { position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; border-radius: 50%;
  background: ${T.success}; color: #fff; display: grid; place-items: center; }

/* ══════════════════════════════════════════════════════════════
   ЗАЧЕМ ЭТО НУЖНО — три примера, каждый оживает по нажатию
   ══════════════════════════════════════════════════════════════ */
.why { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: clamp(7px, 1.4vw, 12px); align-items: stretch; }
.why-card { display: flex; flex-direction: column; align-items: center; gap: clamp(3px, .8dvh, 5px);
  padding: clamp(5px, min(1.8vw, 1.4dvh), 14px) clamp(6px, 2vw, 10px);
  border: 2px solid transparent; border-radius: 16px;
  background: ${T.paper}; font: inherit; cursor: pointer; text-align: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 22px -20px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s, background .3s; }
.why-card:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-3px); }
.why-card:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.why-card.is-open { background: ${T.uiSoft}; border-color: ${T.ui}; cursor: pointer; }
/* Картинка карточки считает размер и от высоты окна: на низком телефоне три
   карточки со стороной 120 px переставали помещаться в поле сцены. */
.why-art { display: block; width: 100%; height: auto;
  max-width: clamp(64px, min(120px, 13dvh), 120px); }
.why-t { font-size: clamp(11px, min(1.9vw, 2dvh), 17px); font-weight: 800; color: ${T.ink}; }
.why-why { font-size: clamp(13px, 1.7vw, 15px); line-height: 1.35; color: ${T.ink2}; font-weight: 500;
  animation: fadeUp .25s cubic-bezier(.2,.7,.3,1) both; }
/* Пример оживает только после нажатия — до этого картинка спокойная. */
.why-art .wa-a, .why-art .wa-b, .why-art .wa-c, .why-art .wa-d { transform-box: fill-box; transform-origin: center; }
.why-art.is-live .wa-a { animation: waPop .45s cubic-bezier(.34,1.5,.5,1) both; }
.why-art.is-live .wa-b { animation: waPop .45s cubic-bezier(.34,1.5,.5,1) .1s both; }
.why-art.is-live .wa-c { animation: waPop .45s cubic-bezier(.34,1.5,.5,1) .2s both; }
.why-art.is-live .wa-d { animation: waPop .5s cubic-bezier(.34,1.6,.5,1) .3s both, invFloat 3s ease-in-out 1s infinite; }
@keyframes waPop { 0% { opacity: 0; transform: scale(.5); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: none; } }

/* ══════════════════════════════════════════════════════════════
   ПОКАЗ КАРТОЧЕК ГОЛОСОМ (миссия, «зачем это нужно»)
   Закрытая карточка — голубая рубашка со знаком вопроса. Открытая —
   рисунок и название. Та, о которой Луми говорит сейчас, светится
   голубой рамкой и чуть приподнята. Ни точек, ни номеров, ни строки
   задания (заказчик, 27.09.2026).
   Четыре — 2×2. Три — на узком телефоне строками (рисунок слева, название
   справа), на широком — одним рядом из трёх. Рубашка лежит поверх лица той
   же высоты: карточка не меняет размер, когда открывается.
   ══════════════════════════════════════════════════════════════ */
.tour { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(8px, 1.8vw, 14px); width: 100%; max-width: 480px; align-self: center; }
.tour-n3 { grid-template-columns: 1fr; max-width: 420px; }
.tour-card { position: relative; display: block; padding: 0; border: 2px solid transparent;
  border-radius: 18px; background: ${T.paper}; font: inherit; color: ${T.ink}; cursor: default;
  text-align: center; min-width: 0;
  box-shadow: 0 3px 0 rgba(${T.shadowBase},0.06), 0 6px 18px rgba(${T.shadowBase},0.06);
  transition: border-color .25s, box-shadow .25s, transform .25s, background .25s; }
.tour-card.is-open { cursor: pointer; }
.tour-card:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.tour-face { display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: clamp(4px, 1dvh, 8px); min-height: clamp(84px, 16dvh, 150px); padding: clamp(8px, 1.6dvh, 14px) 8px; }
.tour-face .why-art { width: 100%; max-width: clamp(60px, min(130px, 15dvh), 130px); flex: 0 0 auto; }
.tour-ic { display: grid; place-items: center; flex: 0 0 auto; width: clamp(46px, 8dvh, 62px);
  aspect-ratio: 1; border-radius: 50%; background: ${T.uiSoft}; color: ${T.uiDk}; }
.tour-t { font-size: clamp(14px, 1.9vw, 17px); font-weight: 800; line-height: 1.2; color: ${T.ink};
  overflow-wrap: anywhere; }
.tour-n3 .tour-face { flex-direction: row; justify-content: flex-start; text-align: left;
  gap: 14px; min-height: clamp(70px, 14dvh, 112px); padding: 8px 14px; }
.tour-n3 .tour-face .why-art { width: clamp(60px, 14dvh, 104px); max-width: none; }
@media (min-width: 540px) {
  .tour-n3, .tour-n6 { grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 640px; }
  .tour-n3 .tour-face { flex-direction: column; justify-content: center; text-align: center;
    min-height: clamp(96px, 20dvh, 180px); padding: clamp(8px, 1.6dvh, 14px) 8px; }
  .tour-n3 .tour-face .why-art { width: 100%; max-width: clamp(60px, min(130px, 15dvh), 130px); }
}
@media (min-width: 900px) and (min-height: 640px) { .tour { max-width: 560px; } .tour-n3, .tour-n6 { max-width: 720px; } }
.tour-card.is-shut .tour-face { visibility: hidden; }
/* Рубашка курса HTML: тёплая бумага в точку (как пиксели экрана Коди), белый
   значок «?» и метка </> в углу. Оранжевый здесь только в знаке вопроса: цветом
   светится карточка, которую читают сейчас. Значок дышит — карточка ждёт, а не
   выключена; у соседних карточек дыхание идёт со сдвигом. */
.tour-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px; overflow: hidden;
  background:
    radial-gradient(rgba(${T.shadowBase},.13) 1.3px, transparent 1.9px) 0 0 / 14px 14px,
    linear-gradient(160deg, #FDFCFA 0%, #F1EEE8 100%);
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},.08); }
.tour-back::after { content: '</>'; position: absolute; right: 10px; bottom: 8px;
  font: 800 12px/1 'JetBrains Mono', ui-monospace, monospace; color: ${T.ink3}; }
.tour-back i { display: grid; place-items: center; width: clamp(38px, 7.5dvh, 52px); aspect-ratio: 1;
  border-radius: 50%; background: ${T.paper}; color: ${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 8px 18px -10px rgba(${T.shadowBase},.45),
    inset 0 0 0 2px rgba(255,79,40,.14);
  animation: backBreath 2.8s ease-in-out infinite; }
.tour-card:nth-child(2) .tour-back i { animation-delay: .45s; }
.tour-card:nth-child(3) .tour-back i { animation-delay: .9s; }
.tour-card:nth-child(4) .tour-back i { animation-delay: 1.35s; }
@keyframes backBreath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
@media (prefers-reduced-motion: reduce) { .tour-back i { animation: none; } }
.tour-card.is-open .tour-face { animation: tourFlip .5s cubic-bezier(.34,1.3,.64,1) both; }
@keyframes tourFlip { 0% { opacity: 0; transform: perspective(500px) rotateY(80deg) scale(.9); }
  100% { opacity: 1; transform: none; } }
.tour-card.is-reading { border-color: ${T.ui}; background: ${T.uiSoft}; transform: translateY(-3px);
  box-shadow: 0 0 0 4px rgba(255,79,40,.12), 0 10px 22px rgba(${T.shadowBase},0.12); }
.tour-card.is-reading .tour-ic { background: ${T.paper}; }
/* Замок речи гасит кнопки на время реплики — эти карточки не гасим: пока
   Луми говорит, они и есть то, на что надо смотреть. */
.stage.is-speaking .stage-content .tour-card { opacity: 1; filter: none; }
/* Телефон лёжа: рисунок и название одной строкой, сетка та же. */
@media (orientation: landscape) and (max-height: 500px) {
  .tour { max-width: 560px; gap: 8px; }
  .tour-n3, .tour-n6 { max-width: 640px; }
  .tour-face, .tour-n3 .tour-face { flex-direction: row; justify-content: flex-start; text-align: left;
    gap: 10px; min-height: clamp(52px, 17dvh, 74px); padding: 6px 10px; }
  .tour-face .why-art, .tour-n3 .tour-face .why-art { width: clamp(36px, 14dvh, 58px); max-width: none; }
  .tour-ic { width: clamp(36px, 12dvh, 48px); }
}
@media (prefers-reduced-motion: reduce) {
  .tour-card, .tour-card.is-reading { transition: none; transform: none; }
  .tour-card.is-open .tour-face { animation: none; }
}

.note-step { margin-left: auto; font-size: 11px; font-weight: 800; opacity: .7; }
.note-lbl { justify-content: flex-start; }
.ask-n { padding: 2px 8px; border-radius: 99px; background: ${T.uiSoft}; color: ${T.uiDk};
  font-size: 12.5px; font-weight: 800; }
.zone-legend { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; min-height: 26px; }
.zone-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 99px;
  background: ${T.successSoft}; color: ${T.success}; font-size: clamp(13px, 1.7vw, 15px); font-weight: 700;
  animation: fadeUp .25s cubic-bezier(.2,.7,.3,1) both; }

/* ══════════════════════════════════════════════════════════════
   СОЕДИНЕНИЕ ПАР — «что делает эта кнопка»
   Две ЯВНО РАЗНЫЕ колонки вместо прежнего сплошного блока из шести одинаковых
   прямоугольников. Слева предмет — крупная кнопка-инструмент, только значок.
   Справа утверждение о нём — словами. Разный вид не украшение: спутать
   «кнопку» и «её работу» теперь нельзя.
   ══════════════════════════════════════════════════════════════ */
/* ОДНА ВЫСОТА СТРОКИ НА ОБЕ КОЛОНКИ. Раньше квадраты слева были 58–76 px, а
   строки справа 50–60 px: ряды разъезжались, и пара «кнопка ↔ её работа»
   переставала читаться как пара — заказчик отметил это как некрасивое.
   Теперь высоту задаёт одна переменная, и строки стоят ровно друг напротив
   друга на любом экране. */
/* Высота строки считается и от ВЫСОТЫ окна тоже. Четыре пары на низком
   ноутбуке (720 px) при чисто ширинных clamp'ах не помещались и вылезали за
   поле сцены — особенно после того, как герой стал крупнее. */
.pm { --pm-row: clamp(44px, min(11.5vw, 8.4dvh), 68px);
  display: grid; grid-template-columns: auto 1fr; gap: clamp(8px, min(2.4vw, 1.8dvh), 22px);
  align-items: start; width: 100%; }
.pm-col { display: flex; flex-direction: column; gap: clamp(5px, min(1.4vw, 1.1dvh), 11px); min-width: 0; }
.pm-head { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em;
  color: ${T.ink3}; padding-left: 2px; }

/* Кнопка-инструмент. Крупная, квадратная, без подписи: подпись назвала бы
   ответ, а его ребёнок должен вспомнить сам. */
.pm-tool { position: relative; width: var(--pm-row); height: var(--pm-row);
  display: grid; place-items: center; border: 2px solid transparent; border-radius: 16px;
  background: ${T.paper}; color: ${T.ink2}; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 10px 20px -18px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s, background .25s, color .2s; }
.pm-tool:hover:not(:disabled) { color: ${T.uiDk}; transform: translateY(-2px); }
.pm-tool:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
/* Выбранная кнопка — единственный «горящий» элемент слева, поэтому что делать
   дальше, очевидно без слов. */
.pm-tool.is-picked { border-color: ${T.ui}; background: ${T.uiSoft}; color: ${T.uiDk};
  box-shadow: 0 0 0 4px rgba(255,79,40,.09); }
.pm-tool.is-tied { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success};
  cursor: default; animation: okPop .38s; }

/* Вариант ответа. Строка, а не квадрат: это утверждение, а не предмет. */
.pm-job { position: relative; display: flex; align-items: center; gap: 10px; width: 100%;
  height: var(--pm-row); min-height: var(--pm-row); padding: 0 clamp(12px, 2.2vw, 18px);
  border: 2px solid transparent; border-radius: 14px; background: ${T.paper};
  font: inherit; font-size: clamp(14px, 2vw, 17px); font-weight: 700; color: ${T.ink};
  text-align: left; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 22px -20px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s, background .25s, opacity .25s; }
.pm-job:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-2px); }
.pm-job:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
/* Пока кнопка слева не выбрана, отвечать нечему — колонка приглушена и глуха.
   Порядок «сначала кнопка, потом работа» держится интерфейсом, а не памятью. */
.pm-job:disabled:not(.is-tied) { opacity: .4; cursor: default; }
.pm-col-jobs.is-live .pm-job:not(.is-tied) { opacity: 1; }
.pm-job.is-tied { background: ${T.successSoft}; border-color: ${T.success}; color: ${T.success};
  cursor: default; animation: okPop .38s; }
.pm-job.is-shake { animation: shake .4s; border-color: #E0A0A0; }
.pm-tick { position: absolute; top: -5px; right: -5px; width: 22px; height: 22px; border-radius: 50%;
  background: ${T.success}; color: #fff; display: grid; place-items: center; }
.pm-tick-job { position: static; margin-left: auto; width: 20px; height: 20px; }

/* ══════════════════════════════════════════════════════════════
   ДОСТИЖЕНИЕ — кубок и список сделанного
   ══════════════════════════════════════════════════════════════ */
.outro { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6dvh, 16px);
  width: 100%; min-height: 0; }
.trophy { width: clamp(62px, 15dvh, 130px); flex: 0 0 auto; }
.trophy svg { display: block; width: 100%; height: auto;
  filter: drop-shadow(0 12px 22px rgba(255,79,40,.2));
  animation: trophyIn .6s cubic-bezier(.34,1.55,.5,1) both; }
@keyframes trophyIn { 0% { opacity: 0; transform: translateY(-24px) scale(.5) rotate(-8deg); }
  70% { opacity: 1; transform: translateY(0) scale(1.08) rotate(3deg); }
  100% { opacity: 1; transform: none; } }
.tr-rays { transform-box: view-box; transform-origin: 60px 50px;
  animation: trRays 1s ease-out .2s both, trSpin 26s linear 1.2s infinite; }
@keyframes trRays { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: scale(1); } }
@keyframes trSpin { to { transform: rotate(360deg); } }
.skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));
  gap: clamp(3px, .6dvh, 5px); width: 100%; max-width: 470px; min-height: 0; }
.skill-row { display: flex; align-items: center; gap: 8px; border-radius: 12px;
  padding: clamp(4px, .9dvh, 8px) clamp(8px, 2vw, 12px);
  background: ${T.successSoft}; color: ${T.success}; font-weight: 700;
  font-size: clamp(11px, min(1.8vw, 1.9dvh), 16px);
  animation: fadeUp .3s cubic-bezier(.2,.7,.3,1) both; }
.skill-tick { display: grid; place-items: center; flex: 0 0 auto;
  width: clamp(15px, 2.6dvh, 20px); height: clamp(15px, 2.6dvh, 20px);
  border-radius: 50%; background: ${T.success}; color: #fff; }

/* ══════════════════════════════════════════════════════════════
   ПРОЩАНИЕ — только машущий герой, без текста
   ══════════════════════════════════════════════════════════════ */
.bye { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 0; }
/* Крупный план на прощании. Те же 1.165 к рамке, что и в шапке: робот
   прежнего размера, поле вокруг больше — на прощании он дрейфует вверх-вправо
   и при тесной рамке срезался краем. */
.bye-bot { width: clamp(112px, 22dvh, 192px); }
.bye-bot .bot { display: block; width: 100%; height: auto; overflow: visible;
  filter: drop-shadow(0 14px 24px rgba(58,53,48,0.22));
  animation: avIn .5s cubic-bezier(.34,1.4,.5,1) both; }

@media (prefers-reduced-motion: reduce) {
  .inv, .inv-title, .inv-line, .inv-art, .inv-rule { transition: none !important; }
  .bl, .dc-flame, .dc-fw, .dc-cf,
  .why-art.is-live .wa-a, .why-art.is-live .wa-b, .why-art.is-live .wa-c, .why-art.is-live .wa-d {
    animation: none !important; opacity: 1 !important; transform: none !important; }
  .ed-caret, .ms-caret { animation: none !important; opacity: 1 !important; }
  .trophy svg, .tr-rays, .skill-row, .result-card, .zone-tag { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

// Оформление новых механик карты: вспышка, да/нет и перестановка. Живёт в
// каноне вместе с ними — механика и её вид переезжают в следующий урок парой.
const CANON_MECH_CSS = `
/* ══════════════════════════════════════════════════════════════
   ВСПЫШКА — «успей прочитать»
   Содержимое видно секунду. Погашенное состояние — не пустота, а закрытая
   заслонка: ребёнок должен понимать, что там что-то есть, и захотеть открыть.
   ══════════════════════════════════════════════════════════════ */
.glance { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2dvh, 18px);
  width: 100%; min-height: 0; }
.glance-box { position: relative; width: 100%; max-width: 420px; min-height: 0;
  border-radius: 18px; overflow: hidden; }
.glance-in { transition: opacity .12s linear, filter .12s linear; }
.glance-box:not(.is-lit) .glance-in { opacity: 0; filter: blur(6px); }
.glance-veil { position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: repeating-linear-gradient(135deg, ${T.uiBar} 0 12px, ${T.bg} 12px 24px);
  box-shadow: inset 0 0 0 2px ${T.uiEdge}; }
.glance-btn { align-self: center; }

/* ══════════════════════════════════════════════════════════════
   ДА / НЕТ — по одному утверждению за раз
   Карточка одна: два-три утверждения рядом ребёнок 8 лет читает вперемешку и
   отвечает не на то. Счётчик показывает, что конец близко.
   ══════════════════════════════════════════════════════════════ */
.yn { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2dvh, 18px);
  width: 100%; max-width: 480px; align-self: center; min-height: 0; }
.yn-card { display: flex; align-items: center; justify-content: center; text-align: center;
  width: 100%; min-height: clamp(84px, 15dvh, 130px); padding: clamp(14px, 2.6vw, 24px);
  border-radius: 18px; background: ${T.paper}; font-size: clamp(16px, 2.6vw, 20px); font-weight: 700;
  line-height: 1.35; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 14px 28px -20px rgba(${T.shadowBase},0.55);
  animation: ynIn .32s cubic-bezier(.2,.8,.3,1) both; }
@keyframes ynIn { from { opacity: 0; transform: translateY(10px) scale(.97); } to { opacity: 1; transform: none; } }
.yn-all { display: flex; align-items: center; gap: 10px; color: ${T.success}; }
.yn-count { font-size: 13px; font-weight: 700; color: ${T.ink3}; }
.yn-btns { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(8px, 1.8vw, 14px); width: 100%; }
.yn-b { position: relative; display: flex; align-items: center; justify-content: center; gap: 9px;
  min-height: clamp(48px, 8dvh, 60px); border: 2px solid transparent; border-radius: 15px;
  font: inherit; font-size: clamp(15px, 2.2vw, 18px); font-weight: 800; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06);
  transition: transform .16s, border-color .2s, background .2s; }
.yn-b:active:not(:disabled) { transform: scale(.97); }
.yn-b:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.yn-b:disabled { opacity: .45; cursor: default; }
.yn-yes { background: ${T.successSoft}; color: ${T.success}; }
.yn-yes:hover:not(:disabled) { border-color: ${T.success}; }
.yn-no { background: ${T.uiBar}; color: ${T.ink2}; }
.yn-no:hover:not(:disabled) { border-color: ${T.ink3}; }

/* ══════════════════════════════════════════════════════════════
   ПЕРЕСТАНОВКА — собрать по порядку
   Строки одной высоты: по ней считается, куда попадёт перетаскиваемая строка.
   Ручка справа — единственное место, за которое тянут; по остальной строке
   можно спокойно попадать пальцем, ничего не сдвинув.
   ══════════════════════════════════════════════════════════════ */
.ro { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 460px;
  align-self: center; min-height: 0; touch-action: pan-y; }
.ro-row { position: relative; display: flex; align-items: center; gap: clamp(8px, 1.6vw, 12px);
  height: clamp(48px, 7.6dvh, 60px); padding: 0 6px 0 clamp(10px, 2vw, 14px);
  border-radius: 14px; background: ${T.paper};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 20px -18px rgba(${T.shadowBase},0.5);
  transition: transform .18s cubic-bezier(.2,.8,.3,1), box-shadow .2s, background .25s; }
.ro-row.is-drag { transition: none; box-shadow: 0 8px 0 rgba(${T.shadowBase},0.06), 0 20px 34px -16px rgba(${T.shadowBase},0.6);
  background: ${T.uiSoft}; }
.ro-row.is-ok { background: ${T.successSoft}; }
.ro-n { flex: 0 0 auto; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
  background: ${T.uiSoft}; color: ${T.uiDk}; font-size: 13px; font-weight: 800; }
.ro-row.is-ok .ro-n { background: ${T.success}; color: #fff; }
.ro-ic { flex: 0 0 auto; display: grid; place-items: center; color: ${T.uiDk}; }
.ro-t.is-tap { cursor: pointer; }
.ro-t { flex: 1 1 auto; min-width: 0; font-size: clamp(14px, 2vw, 17px); font-weight: 700; color: ${T.ink}; }
.ro-ctl { display: flex; flex-direction: column; gap: 2px; flex: 0 0 auto; }
.ro-arrow { width: 34px; height: 22px; border: none; border-radius: 7px; cursor: pointer;
  display: grid; place-items: center; background: ${T.uiBar}; color: ${T.ink2};
  transition: background .2s, color .2s; }
.ro-arrow:hover:not(:disabled) { background: ${T.uiSoft}; color: ${T.uiDk}; }
.ro-arrow:disabled { opacity: .3; cursor: default; }
.ro-arrow:focus-visible { outline: 2px solid ${T.ui}; outline-offset: 2px; }
/* Ручка. 44 px по ширине — нижняя граница по мастер-ТЗ для касания. */
.ro-grip { flex: 0 0 auto; width: 44px; height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px; cursor: grab; touch-action: none; }
.ro-grip:active { cursor: grabbing; }
.ro-grip i { display: block; width: 18px; height: 2.5px; border-radius: 2px; background: ${T.uiEdge}; }
.ro-row.is-drag .ro-grip i { background: ${T.ui}; }

@media (prefers-reduced-motion: reduce) {
  .glance-in { transition: none !important; }
  .yn-card, .ro-row { animation: none !important; transition: none !important; }
}
`;

// Канонное оформление одной строкой: экраны формулы плюс механики.

// Оформление перетаскивания в гнёзда. Живёт в каноне вместе с механикой.
const CANON_DZ_CSS = `
/* ══════════════════════════════════════════════════════════════
   ПЕРЕТАСКИВАНИЕ В ГНЁЗДА
   Сверху пустые гнёзда с призрачным силуэтом, снизу лоток с предметами.
   Порядок держится интерфейсом: пока предмет не поднят, гнёзда не зовут;
   поднял — свободные гнёзда подсвечиваются, и промахнуться некуда.
   ══════════════════════════════════════════════════════════════ */
.dz { display: flex; flex-direction: column; gap: clamp(8px, 1.6dvh, 16px);
  width: 100%; max-width: 480px; align-self: center; min-height: 0; }

.dz-zones { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(7px, 1.5vw, 12px); }
/* Высоты считаются и от высоты окна тоже. На уровне с лишними вещами в лотке
   шесть предметов вместо четырёх, они встают в два ряда, и на невысоком
   ноутбуке экран переставал укладываться. Теперь и гнёзда, и предметы
   ужимаются вместе с окном. */
.dz-zone { position: relative; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 4px; min-height: clamp(54px, 8.6dvh, 92px);
  padding: 8px 6px; border-radius: 16px; border: 2px dashed ${T.uiEdge};
  background: rgba(255,255,255,.4); font: inherit; text-align: center; cursor: default;
  transition: border-color .2s, background .25s, transform .16s; }
/* Свободное гнездо зовёт, ТОЛЬКО когда в руке что-то есть. Иначе ребёнок
   тычет в пустые рамки и не понимает, почему ничего не происходит. */
.dz-zone.is-open { cursor: pointer; border-color: ${T.ui}; background: ${T.uiSoft}; }
.dz-zone.is-open:hover { transform: translateY(-2px); }
.dz-zone:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.dz-zone.is-full { border-style: solid; border-color: ${T.success};
  background: ${T.successSoft}; cursor: pointer; }
.dz-ghost { color: ${T.ink3}; opacity: .45; }
.dz-ic { color: ${T.uiDk}; display: grid; place-items: center; }
.dz-zone.is-full .dz-ic { color: ${T.success}; }
.dz-t { font-size: clamp(11px, 1.7vw, 13.5px); font-weight: 700; color: ${T.ink}; line-height: 1.2; }
.dz-hint { color: ${T.ink3}; font-weight: 600; }
.dz-tick { position: absolute; top: -6px; right: -6px; width: 21px; height: 21px; border-radius: 50%;
  background: ${T.success}; color: #fff; display: grid; place-items: center; }

/* ЛОТОК. Отделён подписью, которая меняется по ходу: «выбери» → «положи» →
   «готово». Это единственная инструкция, которая нужна на экране. */
.dz-tray { display: flex; flex-direction: column; gap: clamp(5px, 1dvh, 8px);
  padding: clamp(7px, 1.4dvh, 13px) clamp(9px, 1.8vw, 14px);
  border-radius: 16px; background: ${T.uiBar}; min-height: 0; }
.dz-tray-h { font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase;
  color: ${T.ink2}; text-align: center; }
.dz-items { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px, 1.4vw, 10px); }
.dz-item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px;
  width: clamp(64px, 15.5vw, 92px); min-height: clamp(46px, 6.8dvh, 74px); padding: 5px 5px;
  border: 2px solid transparent; border-radius: 14px; background: ${T.paper};
  font: inherit; cursor: pointer; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05);
  transition: border-color .2s, transform .16s, background .25s; }
.dz-item:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-2px); }
.dz-item:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
/* Поднятый предмет — единственный «горящий» в лотке, поэтому что сейчас в
   руке, видно без слов. */
.dz-item.is-held { border-color: ${T.ui}; background: ${T.uiSoft};
  box-shadow: 0 0 0 4px rgba(255,79,40,.09); transform: translateY(-3px); }
.dz-item.is-held .dz-ic { color: ${T.uiDk}; }
.dz-empty { font-size: 13.5px; font-weight: 700; color: ${T.success}; padding: 6px 0; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ЭКРАН КОМПЬЮТЕРА. Один монитор на весь курс: он появляется в уроках про
// включение, окна, сохранение и рисование. Пропорцию 4:3 держим в одном месте,
// иначе «почему первый и второй компьютер разного размера» вернётся снова.
// ─────────────────────────────────────────────────────────────────────────────
const CANON_CRT_CSS = `
/* ══════════════════════════════════════════════════════════════
   ЭКРАН КОМПЬЮТЕРА — монитор в кадре

   РАЗМЕР ЭКРАНА ПОСТОЯННЫЙ И НЕ ЗАВИСИТ ОТ СОДЕРЖИМОГО. Сначала рамка
   подстраивалась под приглашение, и монитор буквально вырастал в момент, когда
   скучное приглашение становилось праздничным: заказчик отметил, что до и
   после это два разных компьютера. У настоящего монитора диагональ не
   меняется, поэтому теперь размер задаёт стекло — ширина от высоты экрана,
   высота от пропорции 4:3, — а содержимое просто живёт внутри.

   Ширину считаем как min(доступная, высота × 4/3): так на телефоне монитор
   ограничен шириной колонки, а на невысоком ноутбуке — высотой окна, и
   пропорция не ломается ни там, ни там.
   ══════════════════════════════════════════════════════════════ */
.crt { display: flex; flex-direction: column; align-items: center; width: 100%;
  min-height: 0; align-self: center; }
.crt-frame { display: flex; flex-direction: column; min-height: 0;
  padding: clamp(9px, 1.7vw, 15px) clamp(9px, 1.7vw, 15px) 0;
  border-radius: clamp(12px, 2vw, 18px);
  background: linear-gradient(168deg, #DCD6CA, #BDB6A8);
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), 0 22px 36px -24px rgba(${T.shadowBase},0.62),
    inset 0 1px 0 rgba(255,255,255,.65); }
/* СТЕКЛО. Пропорция 4:3 — та самая, по которой старый монитор и опознаётся. */
.crt-screen { position: relative; overflow: hidden; flex: 0 0 auto;
  /* ПРОЦЕНТОВ ЗДЕСЬ БЫТЬ НЕ ДОЛЖНО. Рамка сжимается по содержимому, поэтому
     width:100% у стекла считался от того, что внутри, — и монитор
     послушно менял размер вместе с ним. Все три ограничения абсолютные:
     потолок в пикселях, ширина окна и высота окна. Ни одно не зависит от
     того, что лежит внутри. */
  /* 33dvh, а не 34: после того как герой стал крупнее, на низком окне
     (720 px) монитор переставал помещаться в поле сцены на четыре пикселя. */
  width: min(400px, 84vw, calc(33dvh * 4 / 3));
  aspect-ratio: 4 / 3; height: auto;
  display: flex; flex-direction: column; justify-content: center;
  border-radius: clamp(5px, 1vw, 9px); background: #2A2621;
  padding: clamp(8px, 1.5vw, 13px);
  box-shadow: inset 0 0 26px rgba(0,0,0,.6); }
/* Полосы развёртки — примета старого монитора. Почти прозрачные: читаемость
   текста важнее приметы. */
.crt-scan { position: absolute; inset: 0; pointer-events: none; z-index: 2; border-radius: inherit;
  background: repeating-linear-gradient(180deg, rgba(0,0,0,.032) 0 1px, rgba(0,0,0,0) 1px 5px); }
/* ПОДБОРОДОК под стеклом — у монитора он всегда шире остальных полей. */
.crt-chin { display: flex; align-items: center; justify-content: center; flex: 0 0 auto;
  height: clamp(16px, 2.6vw, 24px); }
.crt-led { width: 6px; height: 6px; border-radius: 50%; background: ${T.success};
  box-shadow: 0 0 7px ${T.success}; animation: crtLed 2.4s ease-in-out infinite; }
@keyframes crtLed { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
/* НОЖКА И ПОДСТАВКА. Без них рамка читается как планшет. */
.crt-neck { width: clamp(26px, 5vw, 40px); height: clamp(10px, 1.8vw, 16px); flex: 0 0 auto;
  background: linear-gradient(180deg, #CBC4B6, #B0A99B); }
.crt-base { width: clamp(90px, 20vw, 150px); height: clamp(7px, 1.3vw, 11px); flex: 0 0 auto;
  border-radius: 0 0 8px 8px;
  background: linear-gradient(180deg, #C3BCAE, #A49D8F);
  box-shadow: 0 9px 16px -11px rgba(${T.shadowBase},0.75); }
/* ПРОГРЕВ. Экран вспыхивает один раз при появлении — так видно, что машину
   только что включили. Дальше остаётся ровное свечение. */
.crt.is-live .crt-screen { animation: crtWarm 1.1s ease-out both; }
@keyframes crtWarm {
  0% { filter: brightness(2.6) contrast(.4); opacity: .2; }
  22% { filter: brightness(1.5) contrast(.9); opacity: 1; }
  40% { filter: brightness(.85); }
  100% { filter: brightness(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .crt.is-live .crt-screen { animation: none; }
  .crt-led { animation: none; opacity: 1; }
}
`;


/* ══════════════════════════════════════════════════════════════════════════
   Б И Б Л И О Т Е К А   З А Д А Н И Й  (canon/07-library.jsx)

   Оформление восьми механик второй части канона плюс запоздалая починка
   первой: классы .hs-* механики Hotspots не были написаны НИКОГДА, и всё это
   время компонент отрисовывался голым списком кнопок. Нашлось при разборе
   канона 23.09.2026.

   Общие правила этого блока те же, что у всего курса: красного нет, времени
   нет, очков нет; всё, что нажимается, не меньше 44 px по короткой стороне;
   ряды карточек считаны на 360x640, потому что именно оттуда приходит
   большинство студентов.
   ══════════════════════════════════════════════════════════════════════════ */
const CANON_LIB_CSS = `
/* ── НАЙДИ НА ПАНЕЛИ (Hotspots) ──────────────────────────────────────────── */
.hs { display: flex; flex-direction: column; gap: clamp(8px, 1.6dvh, 14px); align-items: center; width: 100%; }
.hs-ask { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;
  font-size: clamp(15px, 2.2vw, 18px); font-weight: 700; color: ${T.ink}; text-align: center; }
.hs-ask-n { font-size: .78em; color: ${T.ui}; background: ${T.uiSoft};
  padding: 2px 8px; border-radius: 999px; }
.hs-ask-done { color: ${T.success}; display: inline-flex; align-items: center; gap: 6px; }
.hs-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px, 1.4vw, 10px);
  padding: clamp(6px, 1.2vh, 10px); border-radius: 16px; background: ${T.uiBar};
  border: 1px solid ${T.uiEdge}; max-width: 520px; width: 100%; }
.hs-tool { position: relative; display: grid; place-items: center; width: 52px; height: 48px;
  border-radius: 12px; border: 2px solid transparent; background: ${T.paper}; color: ${T.ink};
  cursor: pointer; font: inherit;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 20px -18px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s, background .3s; }
.hs-tool:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-2px); }
.hs-tool:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.hs-tool.is-found { background: ${T.successSoft}; border-color: ${T.success}; cursor: default; }
.hs-tick { position: absolute; right: -4px; top: -4px; width: 17px; height: 17px; border-radius: 50%;
  background: ${T.success}; color: #fff; display: grid; place-items: center; }
.hs-legend { display: flex; flex-direction: column; gap: 5px; width: 100%; max-width: 420px; }
.hs-leg-row { display: flex; align-items: center; gap: 9px; padding: 5px 9px; border-radius: 11px;
  background: ${T.successSoft}; animation: fadeUp .25s cubic-bezier(.2,.7,.3,1) both; }
.hs-leg-ic { display: grid; place-items: center; width: 27px; height: 27px; border-radius: 8px;
  background: ${T.paper}; color: ${T.ink}; flex: 0 0 auto; }
.hs-leg-txt { font-size: clamp(12px, 1.7vw, 15px); font-weight: 600; color: ${T.ink2}; }

/* ── КВИЗ ────────────────────────────────────────────────────────────────── */
.qz { display: flex; flex-direction: column; gap: clamp(7px, 1.5dvh, 13px); width: 100%;
  align-items: center; min-height: 0; }
.qz-top { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
.qz-n { font-size: clamp(12px, 1.6vw, 14px); font-weight: 700; color: ${T.ink2};
  background: ${T.paper}; border: 1px solid ${T.uiEdge}; padding: 2px 9px; border-radius: 999px; }
/* Бусины, а не полоска: полоска читается как утекающее время, а времени в
   курсе нет. Бусины показывают сделанное. */
.qz-beads { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; max-width: 290px; }
.qz-bead { width: 7px; height: 7px; border-radius: 50%; background: ${T.uiEdge}; }
.qz-bead.is-on { background: ${T.success}; }
.qz-bead.is-now { background: ${T.ui}; box-shadow: 0 0 0 3px ${T.uiSoft}; }
.qz-card { display: flex; flex-direction: column; align-items: center; gap: 9px; width: 100%;
  max-width: 560px; padding: clamp(10px, 2vh, 18px) clamp(12px, 3vw, 22px);
  border-radius: 18px; background: ${T.paper}; text-align: center; font-weight: 700; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 16px 30px -26px rgba(${T.shadowBase},0.6);
  animation: fadeUp .3s cubic-bezier(.2,.7,.3,1) both; }
.qz-node { display: grid; place-items: center; width: 100%; }
.qz-opts { display: flex; flex-direction: column; gap: clamp(6px, 1.2vh, 10px); width: 100%; max-width: 560px; }
.qz-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); }
.qz-o { position: relative; display: flex; align-items: center; justify-content: center; gap: 9px;
  min-height: 46px; padding: 9px 14px; border-radius: 14px; border: 2px solid transparent;
  background: ${T.paper}; font: inherit; font-weight: 700; color: ${T.ink}; cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 22px -20px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s, background .3s; }
.qz-o:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-2px); }
.qz-o:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
/* Верный вариант подсвечивается ЗЕЛЁНЫМ, неверные не гаснут и не краснеют:
   ошибка в этом курсе показывается движением, а не цветом. */
.qz-o.is-ok { background: ${T.successSoft}; border-color: ${T.success}; }
.qz-o-t { font-size: clamp(13px, 1.9vw, 16px); }
.qz-o-node { display: grid; place-items: center; }
.qz-o-tick { position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  width: 19px; height: 19px; border-radius: 50%; background: ${T.success}; color: #fff;
  display: grid; place-items: center; }
.qz-go { margin-top: 2px; }
.qz-end { justify-content: center; }
.qz-all { display: inline-flex; align-items: center; gap: 9px; font-size: clamp(15px, 2.2vw, 19px);
  font-weight: 800; color: ${T.success}; }

/* ── КАРТОЧКИ-ПЕРЕВЁРТЫШИ ────────────────────────────────────────────────── */
.fc { display: flex; flex-direction: column; gap: clamp(7px, 1.4dvh, 12px); width: 100%; align-items: center; }
.fc-grid { display: grid; width: 100%; max-width: calc(var(--fc-cols, 2) * 200px);
  grid-template-columns: repeat(var(--fc-cols, 2), minmax(0, 1fr));
  gap: clamp(7px, 1.5vw, 12px); }
.fc-card { position: relative; min-height: clamp(92px, 14dvh, 134px); border: none; padding: 0;
  background: transparent; font: inherit; cursor: pointer; perspective: 800px; }
.fc-card:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 4px; border-radius: 16px; }
.fc-in { position: absolute; inset: 0; transform-style: preserve-3d;
  transition: transform .42s cubic-bezier(.3,.8,.35,1); }
.fc-card.is-up .fc-in { transform: rotateY(180deg); }
.fc-face { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px; padding: 9px;
  border-radius: 16px; backface-visibility: hidden; -webkit-backface-visibility: hidden;
  border: 2px solid transparent; text-align: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 24px -20px rgba(${T.shadowBase},0.5); }
.fc-front { background: ${T.paper}; color: ${T.ink}; }
.fc-card.is-seen .fc-front { border-color: ${T.success}; }
.fc-back { background: ${T.blueSoft}; color: ${T.ink}; transform: rotateY(180deg); }
.fc-t { font-size: clamp(12px, 1.8vw, 15px); font-weight: 800; line-height: 1.2; }
.fc-b { font-size: clamp(11px, 1.7vw, 14px); font-weight: 600; line-height: 1.3; color: ${T.ink2}; }
.fc-tick { position: absolute; right: -3px; top: -3px; z-index: 2; width: 18px; height: 18px;
  border-radius: 50%; background: ${T.success}; color: #fff; display: grid; place-items: center; }
.fc-count { font-size: clamp(12px, 1.7vw, 14px); font-weight: 700; color: ${T.ink2}; }
.fc-count.is-all { color: ${T.success}; }

/* ── НАЙДИ ПАРУ ──────────────────────────────────────────────────────────── */
.mp { display: flex; flex-direction: column; gap: clamp(7px, 1.4dvh, 12px); width: 100%; align-items: center; }
.mp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(5px, 1.2vw, 10px);
  width: 100%; max-width: 480px; }
.mp-card { position: relative; min-height: clamp(58px, 9dvh, 92px); border: none; padding: 0;
  background: transparent; font: inherit; cursor: pointer; perspective: 700px; }
.mp-card:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; border-radius: 13px; }
.mp-in { position: absolute; inset: 0; transform-style: preserve-3d;
  transition: transform .34s cubic-bezier(.3,.8,.35,1); }
.mp-card.is-up .mp-in { transform: rotateY(180deg); }
.mp-face { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px; padding: 5px; border-radius: 13px;
  backface-visibility: hidden; -webkit-backface-visibility: hidden; border: 2px solid transparent;
  text-align: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 20px -18px rgba(${T.shadowBase},0.5); }
.mp-back { background: ${T.blueSoft}; color: ${T.blue}; }
.mp-front { background: ${T.paper}; color: ${T.ink}; transform: rotateY(180deg); }
.mp-card.is-found .mp-front { background: ${T.successSoft}; border-color: ${T.success}; }
.mp-t { font-size: clamp(9px, 1.4vw, 12px); font-weight: 700; line-height: 1.15; }
.mp-count { font-size: clamp(12px, 1.7vw, 14px); font-weight: 700; color: ${T.ink2}; }
.mp-count.is-all { color: ${T.success}; }
@media (min-width: 620px) { .mp-grid { grid-template-columns: repeat(6, 1fr); max-width: 620px; } }

/* ── ДВА ПУТИ ────────────────────────────────────────────────────────────── */
.dp { display: flex; flex-direction: column; gap: clamp(7px, 1.4dvh, 12px); width: 100%;
  max-width: 520px; align-self: center; }
.dp-tabs { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 6px; padding: 4px;
  border-radius: 15px; background: ${T.uiBar}; border: 1px solid ${T.uiEdge}; }
.dp-tab { position: relative; display: flex; align-items: center; justify-content: center; gap: 7px;
  min-width: 0; flex-wrap: wrap; text-align: center; line-height: 1.15;
  min-height: 44px; padding: 7px 10px; border-radius: 11px; border: 2px solid transparent;
  background: transparent; font: inherit; font-weight: 800; font-size: clamp(12px, 1.8vw, 15px);
  color: ${T.ink2}; cursor: pointer; transition: background .2s, color .2s, border-color .2s; }
.dp-tab.is-on { background: ${T.paper}; color: ${T.ink}; border-color: ${T.ui};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05); }
.dp-tab:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.dp-tick { display: grid; place-items: center; width: 15px; height: 15px; border-radius: 50%;
  background: ${T.success}; color: #fff; flex: 0 0 auto; }
.dp-body { display: flex; flex-direction: column; gap: 8px; padding: clamp(10px, 2vh, 16px);
  border-radius: 16px; background: ${T.paper};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 14px 28px -24px rgba(${T.shadowBase},0.6);
  animation: fadeUp .26s cubic-bezier(.2,.7,.3,1) both; }
.dp-node { display: grid; place-items: center; }
.dp-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.dp-step { display: flex; align-items: center; gap: 9px; text-align: left; }
.dp-n { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%;
  background: ${T.uiSoft}; color: ${T.uiDk}; font-size: 12px; font-weight: 800; flex: 0 0 auto; }
.dp-t { font-size: clamp(13px, 1.9vw, 16px); font-weight: 600; color: ${T.ink}; line-height: 1.3; }
.stage.is-speaking .stage-content .dp-tab { opacity: 1; filter: none; }
.dp-both { text-align: center; font-size: clamp(12px, 1.7vw, 15px); font-weight: 700;
  color: ${T.success}; }

/* ── РАЗЛОЖИ ПО КОРЗИНАМ ─────────────────────────────────────────────────── */
.ts { display: flex; flex-direction: column; gap: clamp(7px, 1.4dvh, 12px); width: 100%; align-items: center; }
.ts-ask { text-align: center; font-size: clamp(13px, 1.9vw, 16px); font-weight: 700; color: ${T.ink2}; }
.ts-items { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; min-height: 46px;
  width: 100%; max-width: 560px; }
.ts-item { position: relative; display: inline-flex; align-items: center; gap: 6px; min-height: 42px;
  padding: 7px 12px; border-radius: 12px; border: 2px solid transparent; background: ${T.paper};
  font: inherit; font-weight: 700; font-size: clamp(12px, 1.7vw, 15px); color: ${T.ink}; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 20px -18px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s; }
.ts-item.is-held { border-color: ${T.ui}; transform: translateY(-3px) scale(1.03); }
.ts-item:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.ts-empty { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px;
  background: ${T.successSoft}; color: ${T.success}; }
.ts-bins { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
  gap: clamp(6px, 1.4vw, 10px); width: 100%; max-width: 560px; }
.ts-bin { position: relative; display: flex; flex-direction: column; gap: 5px; min-height: 74px;
  padding: 9px; border-radius: 15px; border: 2px dashed ${T.uiEdge}; background: rgba(255,255,255,.55);
  font: inherit; cursor: default; text-align: left; transition: border-color .2s, background .25s; }
.ts-bin.is-open { cursor: pointer; border-color: ${T.ui}; background: ${T.paper}; }
.ts-bin:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.ts-bin-h { display: flex; align-items: center; gap: 6px; color: ${T.ink}; }
.ts-bin-t { font-size: clamp(12px, 1.7vw, 15px); font-weight: 800; }
.ts-bin-in { display: flex; flex-wrap: wrap; gap: 4px; }
.ts-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px;
  background: ${T.successSoft}; color: ${T.success}; font-size: clamp(10px, 1.5vw, 13px); font-weight: 700;
  animation: fadeUp .22s cubic-bezier(.2,.7,.3,1) both; }

/* ── НАЙДИ ЛИШНЕЕ ────────────────────────────────────────────────────────── */
.ooo { display: flex; flex-direction: column; gap: clamp(8px, 1.6dvh, 14px); width: 100%; align-items: center; }
.ooo-beads { display: flex; gap: 6px; }
.ooo-bead { width: 9px; height: 9px; border-radius: 50%; background: ${T.uiEdge}; }
.ooo-bead.is-on { background: ${T.success}; }
.ooo-bead.is-now { background: ${T.ui}; box-shadow: 0 0 0 3px ${T.uiSoft}; }
.ooo-round { display: flex; flex-direction: column; gap: clamp(7px, 1.4dvh, 12px); width: 100%;
  align-items: center; animation: fadeUp .28s cubic-bezier(.2,.7,.3,1) both; }
.ooo-title { text-align: center; font-size: clamp(13px, 1.9vw, 16px); font-weight: 700; color: ${T.ink2}; }
.ooo-items { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1.4vw, 11px);
  width: 100%; max-width: 560px; }
.ooo-item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: clamp(7px, 1.5vh, 13px) 7px; border-radius: 15px; border: 2px solid transparent;
  background: ${T.paper}; font: inherit; cursor: pointer; text-align: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 24px -20px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s; }
.ooo-item:hover:not(:disabled) { border-color: ${T.ui}; transform: translateY(-3px); }
.ooo-item:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.ooo-t { font-size: clamp(11px, 1.7vw, 15px); font-weight: 700; color: ${T.ink}; line-height: 1.2; }
.ooo-all { display: inline-flex; align-items: center; gap: 9px; font-size: clamp(15px, 2.2vw, 19px);
  font-weight: 800; color: ${T.success}; }

/* ── ШТОРКА «БЫЛО — СТАЛО» ───────────────────────────────────────────────── */
.cmp { display: flex; flex-direction: column; gap: 8px; width: 100%; align-items: center; }
.cmp-box { position: relative; width: 100%; max-width: 520px; border-radius: 18px; overflow: hidden;
  background: ${T.paper}; touch-action: none; cursor: ew-resize; user-select: none;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 16px 30px -26px rgba(${T.shadowBase},0.6); }
/* Высота задаётся слоем «после»: он в потоке, «до» лежит поверх абсолютом.
   Оба слоя обязаны быть одного размера, иначе шторка поедет. */
.cmp-layer { display: grid; place-items: center; padding: clamp(10px, 2vh, 18px); }
.cmp-before { position: absolute; inset: 0; }
.cmp-lab { position: absolute; bottom: 7px; padding: 3px 9px; border-radius: 999px;
  background: rgba(255,255,255,.88); font-size: clamp(10px, 1.5vw, 13px); font-weight: 800;
  color: ${T.ink2}; transition: opacity .2s; pointer-events: none; }
.cmp-lab-l { left: 8px; }
.cmp-lab-r { right: 8px; }
.cmp-bar { position: absolute; top: 0; bottom: 0; width: 3px; margin-left: -1.5px;
  background: ${T.ui}; }
.cmp-grip { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 46px; height: 46px; border-radius: 50%; border: 2px solid ${T.ui};
  background: ${T.paper}; color: ${T.ui}; display: grid; place-items: center; cursor: ew-resize;
  box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.8); }
.cmp-grip:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.cmp-both { text-align: center; font-size: clamp(12px, 1.7vw, 15px); font-weight: 700; color: ${T.success}; }

/* ── РЕФЛЕКСИЯ ───────────────────────────────────────────────────────────── */
.rf { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: clamp(7px, 1.5vw, 12px); width: 100%; max-width: 560px; align-self: center; }
.rf-o { position: relative; display: flex; flex-direction: column; align-items: center; gap: 7px;
  min-height: 76px; padding: clamp(9px, 1.8vh, 15px) 9px; border-radius: 16px;
  border: 2px solid transparent; background: ${T.paper}; font: inherit; cursor: pointer;
  color: ${T.ink}; text-align: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 24px -20px rgba(${T.shadowBase},0.5);
  transition: border-color .2s, transform .16s, background .3s; }
.rf-o:hover:not(:disabled) { border-color: ${T.blue}; transform: translateY(-3px); }
.rf-o:focus-visible { outline: 3px solid ${T.blue}; outline-offset: 3px; }
/* Выбранный вариант помечается СИНИМ, а не зелёным: зелёный в этом курсе
   значит «верно», а у мнения верного варианта нет. */
.rf-o.is-on { background: ${T.blueSoft}; border-color: ${T.blue}; }
.rf-t { font-size: clamp(12px, 1.8vw, 15px); font-weight: 700; line-height: 1.25; }

/* ── ТЕЛЕФОН С ОТКРЫТОЙ КЛАВИАТУРОЙ ──────────────────────────────────────── */
.is-kbd .fc-card { min-height: 74px; }
.is-kbd .mp-card { min-height: 50px; }
.is-kbd .qz-card { padding-block: 7px; }
.is-kbd .dp-body { padding: 8px; }

@media (prefers-reduced-motion: reduce) {
  .fc-in, .mp-in { transition: none; }
  .qz-card, .dp-body, .ooo-round, .hs-leg-row, .ts-chip { animation: none; }
}
`;

// Канонное оформление одной строкой: экраны формулы, механики, гнёзда, монитор
// и библиотека заданий второй части.
const CANON_SCREEN_CSS = CANON_SCREEN_CSS_BASE + CANON_MECH_CSS + CANON_DZ_CSS + CANON_CRT_CSS + CANON_LIB_CSS;
// ==============================  У Р О К  =====================================
// =============================================================================
// ===== УРОК 3 · «Списки» · модуль 1 «Основы разметки» · ТЕСТОВАЯ ВЕРСИЯ 2 ====
//
// ЗАМЫСЕЛ. Коди пишет гайд по игре «Пиксельный остров». Игроки жалуются: в
// гайде ничего не найти, шаги перепутаны, разделы «уехали». Ученик — редактор
// гайда: каждое задание закрывает чью-то жалобу. Сценарий:
// docs/scenarij-03-spiski-v2.md.
//
// ДУГА. Крючок (третий шаг в абзаце → список с номерами) → план → ul и li:
// пункт ↔ строка кода (показ) → собрать li (повтор) → разрезать пункт по
// запятым (сам) → прогноз «переносы не делают пунктов» → ol: пара ul→ol
// (показ) → вставить шаг, номера пересчитываются (повтор) → ul или ol с
// экспериментом «перемешай» (сам) → место для </ul> → набрать </ol> →
// детектив по жалобам → строка li целиком → свой раздел → сохранить → итог.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · СИСТЕМА СЛОВ: ul — список с точками, ol — список с номерами, li — пункт,
//     «закрыть список» — </ul> или </ol>.
//   · ПРЕВЬЮ ЧЕСТНОЕ: номера ol ставит браузер; h2 и p внутри незакрытого
//     списка рисуются со сдвигом и без точки; li вне списка — с точкой, но
//     без отступа; переносы строк без li склеиваются в одну строку.
//   · ТЕГИ ВСЛУХ: ul, ol, li — словами (spokenList поверх spokenHtml урока 2).
//   · ЖАЛОБЫ ИГРОКОВ — печатные карточки (имя и строка), суть озвучивает Коди.
//   · ЛЕСЕНКА: направить → сузить → опора; после решения на третьей ступени
//     на экране 4 — ещё одна строка с новым словом (followUp).
//   · АРТЕФАКТ: свой раздел гайда (тема, вид списка, пункты, готовый HTML).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you».
// =============================================================================

const META = {
  lessonId: 'html-03-spiski',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '3-dars. Ro‘yxatlar',
    ru: 'Урок 3. Списки',
    en: 'Lesson 3. Lists'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
// Подстановка в трёхъязычную строку; значение — строка или объект языков.
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      const sv = v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : String(v);
      s = s.split('{' + k + '}').join(sv);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Tuzilma tekshiruvi', 'Проверка структуры', 'Structure check'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  save: L3('Bo‘limni saqlash', 'Сохранить раздел', 'Save the section'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  here: L3('shu yerga', 'сюда', 'here'),
  shuffled: L3('aralashtirildi', 'перемешали', 'shuffled'),
  complaint: L3('Shikoyat', 'Жалоба', 'Complaint')
};

// Игроки — авторы жалоб (печатные карточки, не новые герои).
const PL = {
  sardor: L3('Sardor', 'Сардор', 'Sardor'),
  madina: L3('Madina', 'Мадина', 'Madina'),
  aziz: L3('Aziz', 'Азиз', 'Aziz')
};

// Данные гайда на языке ученика.
const G = {
  title: L3('Piksel orol', 'Пиксельный остров', 'Pixel Island'),
  bridgeH: L3('Daryodan qanday o‘tiladi', 'Как перейти реку', 'How to cross the river'),
  steps: [L3('Daraxt kesing', 'Сруби дерево', 'Chop a tree'), L3('Taxta yasang', 'Сделай доски', 'Make planks'),
    L3('Ko‘prik quring', 'Построй мост', 'Build a bridge'), L3('Daryodan o‘ting', 'Перейди реку', 'Cross the river')],
  tie: L3('Taxtalarni arqon bilan bog‘lang', 'Скрепи доски верёвкой', 'Tie the planks with rope'),
  caveH: L3('G‘orga nima olish kerak', 'Что взять в пещеру', 'What to take to the cave'),
  cave: [L3('Kirka', 'Кирка', 'Pickaxe'), L3('Mash’al', 'Факел', 'Torch'), L3('Non', 'Хлеб', 'Bread')],
  rope: L3('Arqon', 'Верёвка', 'Rope'),
  map: L3('Xarita', 'Карта', 'Map'),
  whoH: L3('Orolda kim yashaydi', 'Кто живёт на острове', 'Who lives on the island'),
  animals: [L3('tulki', 'лис', 'fox'), L3('qisqichbaqa', 'краб', 'crab'), L3('boyqush', 'сова', 'owl'), L3('ajdar', 'дракон', 'dragon')],
  beastsH: L3('Orol hayvonlari', 'Звери острова', 'Island animals'),
  beastsP: L3('Orolda tulkilar va boyqushlar yashaydi.', 'На острове живут лисы и совы.', 'Foxes and owls live on the island.'),
  tipsH: L3('Maslahatlar', 'Советы', 'Tips'),
  topH: L3('Hafta turniridagi o‘rinlar', 'Места в турнире недели', 'Places in this week’s tournament')
};
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const low = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики героя звучат; подписи и жалобы игроков печатаются.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Qo‘llanma', 'Гайд', 'The guide'),
    msg: L3('Uchinchi navbatda nima qilinadi? Adashib, daryoga yiqildim.', 'Что делать третьим? Я запутался и упал в реку.', 'What do I do third? I got confused and fell into the river.'),
    cast: [
      { pose: 'hello', text: L3('Salom! Bu Kodi. Men «Piksel orol» o‘yini bo‘yicha qo‘llanma yozyapman.', 'Привет! Это Коди. Я пишу гайд по игре «Пиксельный остров».', 'Hi! It’s Kodi. I’m writing a guide to the game Pixel Island.') },
      { pose: 'curious', text: L3('Lekin o‘yinchilar shikoyat qilyapti: qo‘llanmada hech narsa topib bo‘lmaydi. Mana, Sardor yozibdi.', 'Но игроки жалуются: в гайде ничего не найти. Вот, Сардор пишет.', 'But players complain they can’t find anything in it. Look, Sardor wrote.') },
      { pose: 'point', text: L3('Abzatsdan uchinchi navbatda nima qilishni toping va bosing.', 'Найди в абзаце, что делать третьим, и нажми.', 'Find in the paragraph what to do third, and tap it.') }
    ],
    para: {
      pre: L3('Daryodan o‘tish uchun avval ', 'Чтобы перейти реку, сначала ', 'To cross the river, first '),
      sep: [L3(', keyin ', ', потом ', ', then '), L3(', shundan so‘ng ', ', после этого ', ', after that '), L3(' va faqat shunda ', ' и только тогда ', ', and only then ')],
      end: L3('.', '.', '.')
    },
    ask: L3('Uchinchi qadamni bosing', 'Нажми третий шаг', 'Tap the third step'),
    askDone: L3('Raqamli ro‘yxatda uchinchi qadam darrov ko‘rinadi', 'В списке с номерами третий шаг виден сразу', 'In a numbered list, the third step is easy to see'),
    hints: [
      L3('Abzats boshidan qadamlarni tartib bilan sanang.', 'Считай шаги по порядку с начала абзаца.', 'Count the steps in order from the start.'),
      L3('Birinchisi — daraxt, ikkinchisi — taxta.', 'Первый — дерево, второй — доски.', 'The first is the tree, the second is the planks.'),
      L3('Taxtadan keyingi qadamni bosing.', 'Нажми шаг, который идёт после досок.', 'Tap the step that comes after the planks.')
    ],
    ok: L3('To‘g‘ri, uchinchisi — ko‘prik qurish. Lekin diqqat bilan o‘qishga to‘g‘ri keldi. Qarang, raqamli ro‘yxatda hammasi darrov ko‘rinadi.',
      'Верно, третий — построить мост. Но пришлось вчитываться. Смотри: в списке с номерами всё видно сразу.',
      'Right, the third is to build a bridge. But you had to read carefully. Look: in a numbered list, it’s all clear at once.')
  },

  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Bugun qo‘llanmani tartibga keltiramiz. Uch qadam.', 'Сегодня наведём порядок в гайде. Три шага.', 'Today we’ll put the guide in order. Three steps.'),
    steps: [
      { icon: 'list', text: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list'),
        say: L3('Avval nuqtali ro‘yxat: tartib muhim bo‘lmagan narsalar uchun.', 'Сначала список с точками — для вещей, где порядок не важен.', 'First a bulleted list, for things where order doesn’t matter.') },
      { icon: 'listN', text: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
        say: L3('Keyin raqamli ro‘yxat: tartib bilan bajariladigan qadamlar uchun.', 'Потом список с номерами — для шагов по порядку.', 'Then a numbered list, for steps in order.') },
      { icon: 'browser', text: L3('O‘z bo‘limingiz', 'Свой раздел гайда', 'Your own guide section'),
        say: L3('Oxirida qo‘llanmaga o‘z bo‘limingizni yozasiz.', 'А в конце ты напишешь свой раздел гайда.', 'And at the end you’ll write your own guide section.') }
    ],
    done: L3('Boshladik!', 'Поехали!', 'Let’s go!')
  },

  s3: {
    eyebrow: L3('Nuqtali ro‘yxat', 'Список с точками', 'Bulleted list'),
    cast: [
      { pose: 'point', text: L3('Mana «G‘orga nima olish kerak» bo‘limi. Sahifadagi bandlarni bosing va qaysi kod qatori ularni yasashini kuzating.',
        'Вот раздел «Что взять в пещеру». Нажимай пункты на странице и смотри, какая строка кода их делает.',
        'Here’s the section What to take to the cave. Tap the items on the page and watch which line of code makes each one.') }
    ],
    each: L3('Bu bandni <li> qatori yasaydi. Bitta li — nuqtali bitta band.', 'Этот пункт делает строка <li>. Один li — один пункт с точкой.', 'An <li> line makes this item. One li is one bulleted item.'),
    done: L3('Uchta li — uchta band. <ul> esa butun ro‘yxat qutisi: nuqtalarni u qo‘yadi.', 'Три li — три пункта. А <ul> — коробка всего списка: она ставит точки.', 'Three li tags, three items. And <ul> is the box for the whole list: it adds the bullets.'),
    ask: L3('Sahifadagi har bir bandni bosing', 'Нажми каждый пункт на странице', 'Tap each item on the page')
  },

  s4: {
    eyebrow: L3('Yangi band', 'Новый пункт', 'New item'),
    msg: L3('Arqonsiz g‘ordan chiqib bo‘lmaydi! Uni qo‘shing.', 'Без верёвки из пещеры не вылезти! Добавьте её.', 'You can’t climb out of the cave without a rope! Add it.'),
    say: L3('Madina haq. Yangi qatorni yig‘ing: bo‘laklarni tartib bilan bosing.', 'Мадина права. Собери новую строку: нажимай детали по порядку.', 'Madina is right. Build the new line: tap the pieces in order.'),
    ask: L3('Yangi band qatorini yig‘ing', 'Собери строку нового пункта', 'Build the line for the new item'),
    err: {
      ul: L3('<ul> — butun ro‘yxat qutisi, u allaqachon bor. Bandga li kerak.', '<ul> — коробка всего списка, она уже есть. Пункту нужен li.', '<ul> is the box for the whole list, and it’s already there. An item needs li.'),
      order: L3('Avval ochuvchi teg, o‘rtada matn, oxirida yopuvchi teg.', 'Сначала открывающий тег, в середине текст, в конце закрывающий.', 'Opening tag first, text in the middle, closing tag last.')
    },
    hints: [
      L3('Yangi qator qo‘shni qatorlarga o‘xshash bo‘ladi.', 'Новая строка будет такой же, как соседние.', 'The new line looks like the ones next to it.'),
      L3('Qator band tegi bilan boshlanadi.', 'Строка начинается с тега пункта.', 'The line starts with the item tag.'),
      L3('Keyingi bo‘lak — {x}.', 'Следующая деталь — {x}.', 'The next piece is {x}.')
    ],
    praise: L3('Voy! Yangi band darhol nuqtasini oldi!', 'Вау! Новый пункт сразу получил точку!', 'Wow! The new item got its bullet right away!'),
    more: L3('Yana bittasi — xarita bilan. Endi o‘zingiz.', 'Ещё одна строка — с картой. Теперь сам.', 'One more line, with a map. Now on your own.'),
    why: L3('Band shunday yoziladi: <li>, matn, </li>.', 'Пункт пишется так: <li>, текст, </li>.', 'An item is written like this: <li>, text, </li>.')
  },

  s5: {
    eyebrow: L3('Bandni qirqing', 'Разрежь пункт', 'Cut the item'),
    say: L3('Bu yerda hamma hayvonlar bitta bandga tushib qolgan. Uni vergullardan qirqing — har bir hayvon o‘z li siga aylanadi.',
      'Здесь все звери попали в один пункт. Разрежь его на запятых — каждый зверь станет своим li.',
      'Here all the animals ended up in one item. Cut it at the commas, and each animal becomes its own li.'),
    ask: L3('Banddagi vergullarni bosing', 'Нажимай запятые в пункте', 'Tap the commas in the item'),
    word: L3('Hayvonlar orasidan qirqing — vergulda.', 'Режь между зверями — на запятой.', 'Cut between the animals, at a comma.'),
    done: L3('To‘rtta hayvon — to‘rtta li. Har bir band — bitta narsa.', 'Четыре зверя — четыре li. Каждый пункт — одна вещь.', 'Four animals, four li tags. Each item is one thing.')
  },

  s6: {
    eyebrow: L3('Oldindan ayting', 'Угадай', 'Guess'),
    say: L3('Hayvonlarni har birini yangi qatorga yozaman, li siz. Sizningcha, brauzer nimani ko‘rsatadi?',
      'А если просто написать каждого зверя с новой строки, без li? Как думаешь, что покажет браузер?',
      'What if I just write each animal on a new line, with no li? What do you think the browser will show?'),
    ask: L3('Brauzer nimani ko‘rsatadi?', 'Что покажет браузер?', 'What will the browser show?'),
    opts: {
      dots: L3('Nuqtali ustun', 'Столбик с точками', 'A column with bullets'),
      col: L3('Nuqtasiz ustun', 'Столбик без точек', 'A column with no bullets'),
      line: L3('Hammasi bitta qatorda', 'Всё в одну строку', 'All on one line')
    },
    right: L3('Aynan! Koddagi qator ko‘chishlarini brauzer birlashtiradi. Bandlarni faqat li yasaydi.', 'Точно! Переносы строк в коде браузер склеивает. Пункты делает только li.', 'Exactly! The browser joins line breaks in the code. Only li makes items.'),
    miss: L3('Qarang: brauzer hammasini bitta qatorga yopishtirdi. Koddagi ko‘chishlar band yasamaydi — ularni li yasaydi.', 'Смотри: браузер склеил всё в одну строку. Переносы в коде не делают пунктов — их делает li.', 'Look: the browser glued everything into one line. Line breaks in the code don’t make items; li does.'),
    wrap: L3('Endi har birini ul ichida li ga o‘raymiz — bandlar qaytdi.', 'А теперь обернём каждого в li внутри ul — и пункты вернулись.', 'Now we wrap each one in li inside ul, and the items are back.')
  },

  s7: {
    eyebrow: L3('Raqamli ro‘yxat', 'Список с номерами', 'Numbered list'),
    cast: [
      { pose: 'explain', text: L3('Ko‘prik qadamlarini nuqtali ro‘yxat qilib yozdim. Lekin bu yerda tartib muhim. Qadamlar uchun <ol> — raqamli ro‘yxat bor.',
        'Я записал шаги про мост списком с точками. Но тут важен порядок. Для шагов есть <ol> — список с номерами.',
        'I wrote the bridge steps as a bulleted list. But order matters here. For steps there’s <ol>, a numbered list.') },
      { pose: 'point', text: L3('Ikkala ul tegini bosing — ular ol ga aylanadi.', 'Нажми на оба тега ul — они станут ol.', 'Tap both ul tags, and they’ll become ol.') }
    ],
    ask: L3('Ikkala ul tegini ol ga almashtiring', 'Поменяй оба тега ul на ol', 'Change both ul tags to ol'),
    rule: L3('Teglar jufti mos', 'Пара тегов совпадает', 'The tag pair matches'),
    openFirst: L3('Raqamlar paydo bo‘ldi! Ro‘yxat ko‘rinishini ochuvchi teg belgilaydi. Endi yopuvchisini almashtiring — juft mos bo‘lishi kerak.',
      'Номера появились! Вид списка задаёт открывающий тег. Теперь поменяй закрывающий — пара должна совпадать.',
      'Numbers appeared! The opening tag sets the kind of list. Now change the closing one: the pair must match.'),
    closeFirst: L3('Yopuvchi o‘zgardi, nuqtalar esa qoldi: ro‘yxat ko‘rinishini ochuvchi teg belgilaydi. Uni ham almashtiring.',
      'Закрывающий поменялся, а точки остались: вид списка задаёт открывающий тег. Поменяй и его.',
      'The closing tag changed, but the bullets stayed: the opening tag sets the kind of list. Change it too.'),
    done: L3('<ol> va </ol> jufti — qadamlar raqamli. Raqamlarni brauzer o‘zi qo‘yadi.', 'Пара <ol> и </ol> — и шаги с номерами. Номера браузер ставит сам.', 'An <ol> and </ol> pair, and the steps are numbered. The browser adds the numbers itself.')
  },

  s8: {
    eyebrow: L3('Yangi qadam', 'Новый шаг', 'New step'),
    msg: L3('Ko‘prik qurdim — qulab tushdi! Taxtalar hech narsa bilan bog‘lanmagan-ku.', 'Построил мост — он развалился! Доски же ничем не скреплены.', 'I built the bridge and it fell apart! The planks aren’t tied together.'),
    say: L3('Yangi qadam kerak: «Taxtalarni arqon bilan bog‘lang». Ro‘yxatda u turishi kerak bo‘lgan joyni bosing.',
      'Нужен новый шаг: «Скрепи доски верёвкой». Нажми место в списке, где он должен стоять.',
      'We need a new step: Tie the planks with rope. Tap the place in the list where it belongs.'),
    ask: L3('Yangi qadam uchun joyni bosing', 'Нажми место для нового шага', 'Tap the place for the new step'),
    early: L3('Bu yerda hali taxta yo‘q — bog‘laydigan narsa yo‘q.', 'Здесь досок ещё нет — скреплять нечего.', 'There are no planks here yet, nothing to tie.'),
    late: L3('Bu yerda ko‘prik allaqachon qurilgan — bog‘lash kech.', 'Здесь мост уже построен — скреплять поздно.', 'The bridge is already built here, it’s too late to tie.'),
    hints: [
      L3('Bog‘lash uchun avval nima bo‘lishi kerak?', 'Что должно появиться, чтобы было что скреплять?', 'What has to exist before you can tie it?'),
      L3('Taxta 2-qadamda paydo bo‘ladi, ko‘prik — 3-qadamda.', 'Доски появляются на шаге 2, мост — на шаге 3.', 'The planks appear at step 2, the bridge at step 3.'),
      L3('«Taxta yasang» va «Ko‘prik quring» orasidagi joyni bosing.', 'Нажми место между «Сделай доски» и «Построй мост».', 'Tap the place between Make planks and Build a bridge.')
    ],
    ok: L3('Yangi qadam uchinchi bo‘ldi, ko‘prik esa to‘rtinchi. Raqamlarni brauzer o‘zi qayta sanadi — biz ularga tegmadik.',
      'Новый шаг встал третьим, а мост стал четвёртым. Номера браузер пересчитал сам — мы их не трогали.',
      'The new step became third, and the bridge became fourth. The browser renumbered everything itself; we didn’t touch the numbers.')
  },

  s9: {
    eyebrow: L3('ul yoki ol?', 'ul или ol?', 'ul or ol?'),
    say: L3('Qo‘llanmaning yangi bo‘limlari. Har biri uchun ro‘yxat tanlang. Ikkilansangiz — bandlar aralashib ketganini tasavvur qiling.',
      'Новые разделы гайда. Для каждого выбери список. Сомневаешься — представь, что пункты перемешались.',
      'New guide sections. Pick a list for each one. Not sure? Imagine the items got shuffled.'),
    rounds: [
      { want: 'ol', title: L3('Iksir qanday tayyorlanadi', 'Как сварить зелье', 'How to brew a potion'),
        items: [L3('Suv quying', 'Налей воду', 'Pour water'), L3('O‘t tashlang', 'Брось траву', 'Add herbs'), L3('Aralashtiring', 'Помешай', 'Stir')] },
      { want: 'ul', title: L3('Sandiqda nima bor', 'Что лежит в сундуке', 'What’s in the chest'),
        items: [L3('Tangalar', 'Монеты', 'Coins'), L3('Kalit', 'Ключ', 'Key'), L3('Olma', 'Яблоко', 'Apple')] },
      { want: 'ol', title: L3('Hafta turniridagi o‘rinlar', 'Места в турнире недели', 'Places in this week’s tournament'),
        items: [L3('Madina', 'Мадина', 'Madina'), L3('Sardor', 'Сардор', 'Sardor'), L3('Aziz', 'Азиз', 'Aziz')] },
      { want: 'ul', title: L3('Ajdar ranglari', 'Цвета дракона', 'Dragon colours'),
        items: [L3('Qizil', 'Красный', 'Red'), L3('Yashil', 'Зелёный', 'Green'), L3('Oltin', 'Золотой', 'Gold')] }
    ],
    ask: L3('ul yoki ol? Tartib muhimmi?', 'ul или ol? Важен ли порядок?', 'ul or ol? Does order matter?'),
    okOl: L3('To‘g‘ri, ol: bandlarni aralashtirsangiz, hech narsa chiqmaydi.', 'Верно, ol: перемешай пункты — и ничего не выйдет.', 'Right, ol: shuffle the items and nothing works.'),
    okUl: L3('To‘g‘ri, ul: istalgan tartibda ma’no bir xil.', 'Верно, ul: в любом порядке смысл тот же.', 'Right, ul: in any order, the meaning is the same.'),
    missOl: L3('Qarang, aralashtirdik — ma’no buzildi. Tartib muhim, demak ol.', 'Смотри, перемешали — и смысл сломался. Порядок важен, значит ol.', 'Look, we shuffled them and the meaning broke. Order matters, so ol.'),
    missUl: L3('Qarang, aralashtirdik — hech narsa o‘zgarmadi. Tartib muhim emas, demak ul.', 'Смотри, перемешали — ничего не изменилось. Порядок не важен, значит ul.', 'Look, we shuffled them and nothing changed. Order doesn’t matter, so ul.'),
    done: L3('To‘rttasi ham to‘g‘ri! Tartib muhim — ol. Muhim emas — ul.', 'Все четыре верно! Порядок важен — ol. Не важен — ul.', 'All four right! Order matters: ol. It doesn’t: ul.')
  },

  s10: {
    eyebrow: L3('Ro‘yxat oxiri', 'Конец списка', 'End of the list'),
    msg: L3('Nega «Orol hayvonlari» bo‘limi o‘ngga surilib ketdi?', 'Почему раздел «Звери острова» уехал вправо?', 'Why did the Island animals section slide to the right?'),
    say: L3('Ro‘yxatni tugatishni unutibman — pastdagi hammasi unga tushib qoldi. Ro‘yxat tugashi kerak bo‘lgan joyni bosing.',
      'Я забыл закончить список — и всё, что ниже, попало в него. Нажми место, где список должен закончиться.',
      'I forgot to end the list, so everything below fell into it. Tap the place where the list should end.'),
    ask: L3('</ul> turishi kerak bo‘lgan joyni bosing', 'Нажми место, где должен стоять </ul>', 'Tap the place where </ul> should go'),
    inside: L3('Bu yerda ro‘yxat hali davom etadi: pastda yana li bor.', 'Здесь список ещё идёт: ниже есть пункт li.', 'The list still goes on here: there’s another li below.'),
    late: L3('Bu yerda «Orol hayvonlari» allaqachon ro‘yxat ichida. Oldinroq tugating.', 'Здесь «Звери острова» уже внутри списка. Закончи раньше.', 'Here Island animals is already inside the list. End it earlier.'),
    hints: [
      L3('li bandlari qayerda tugaydi?', 'Где кончаются пункты li?', 'Where do the li items end?'),
      L3('Oxirgi band — «Mash’al».', 'Последний пункт — «Факел».', 'The last item is Torch.'),
      L3('«Mash’al» qatoridan keyingi joyni bosing.', 'Нажми место сразу после строки «Факел».', 'Tap the place right after the Torch line.')
    ],
    ok: L3('Ro‘yxat tugadi — «Orol hayvonlari» joyiga qaytdi. Har bir ro‘yxat oxirgi li dan keyin yopiladi.',
      'Список закончился — «Звери острова» вернулись на место. Каждый список закрывается после последнего li.',
      'The list ended, and Island animals is back in place. Every list is closed after its last li.')
  },

  s11: {
    eyebrow: L3('Ro‘yxatni yoping', 'Закрой список', 'Close the list'),
    say: L3('Ko‘prik qadamlarida ham oxiri yo‘q. Ro‘yxatni o‘zingiz yoping: tegni tugmalar bilan tering.',
      'В шагах про мост тоже нет конца. Закрой список сам: набери тег кнопками.',
      'The bridge steps have no end either. Close the list yourself: type the tag with the buttons.'),
    ask: L3('Bo‘sh qatorga ro‘yxatni yopuvchi tegni tering', 'Набери в пустой строке закрывающий тег списка', 'Type the list’s closing tag in the empty line'),
    typeMsg: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Это открывающий тег. В закрывающем есть косая черта.', 'That’s an opening tag. A closing tag has a slash.'),
      needLt: L3('Teg burchakdan boshlanadi.', 'Тег начинается с уголка.', 'A tag starts with an angle bracket.'),
      needGt: L3('Tegni burchak bilan yoping.', 'Закрой тег уголком.', 'Close the tag with an angle bracket.'),
      wrongName: L3('Bu boshqa ro‘yxatni yopadi. Bu ro‘yxat ol bilan ochilgan.', 'Это закрывает другой список. Этот открыт тегом ol.', 'That closes another kind of list. This one was opened with ol.'),
      generic: L3('ol ni yopuvchi tegni tering.', 'Набери закрывающий тег для ol.', 'Type the closing tag for ol.')
    },
    praise: L3('Ro‘yxat yopildi — «Maslahatlar» bo‘limi yana o‘z joyida.', 'Список закрыт — раздел «Советы» снова на своём месте.', 'The list is closed, and the Tips section is back in place.'),
    hintSay: L3('ol ni yopuvchi teg: qiya chiziq va ol nomi.', 'Закрывающий тег для ol: косая черта и имя ol.', 'The closing tag for ol: a slash and the name ol.')
  },

  s12: {
    eyebrow: L3('Shikoyatlar', 'Жалобы игроков', 'Player complaints'),
    say: L3('O‘yinchilar uchta shikoyat yuborishdi. Har birida bitta kod qatori boshqacha turibdi. Uni toping va bosing.',
      'Игроки прислали три жалобы. В каждой одна строка кода стоит не так. Найди её и нажми.',
      'Players sent three complaints. In each, one line of code is not right. Find it and tap it.'),
    ask: L3('Boshqacha turgan qatorni bosing', 'Нажми строку, которая стоит не так', 'Tap the line that is not right'),
    cases: [
      { from: 'sardor', msg: L3('«Non» bandi qiyshiq turibdi, chekinishsiz.', 'Пункт «Хлеб» стоит криво, без отступа.', 'The Bread item is crooked, with no indent.'),
        hints: [L3('Non bilan li qayerda turibdi — ul ichidami?', 'Где стоит li с хлебом — внутри ul?', 'Where is the li with bread: inside ul?'),
          L3('</ul> dan keyin nima turganiga qarang.', 'Посмотри, что идёт после </ul>.', 'Look at what comes after </ul>.'),
          L3('<li>Non</li> qatorini bosing.', 'Нажми строку <li>Хлеб</li>.', 'Tap the <li>Bread</li> line.')],
        why: L3('Har bir li ul yoki ol ichida yashaydi.', 'Каждый li живёт внутри ul или ol.', 'Every li lives inside ul or ol.') },
      { from: 'aziz', msg: L3('Nega raqamlar ikki marta: «1. 1.»?', 'Почему номера двойные: «1. 1.»?', 'Why are the numbers doubled: 1. 1.?'),
        hints: [L3('Ikkinchi raqam qayerdan paydo bo‘ldi?', 'Откуда взялся второй номер?', 'Where did the second number come from?'),
          L3('ol da raqamni brauzer qo‘yadi. Bu yerda ularni qo‘lda ham yozishgan.', 'В ol номера ставит браузер. А тут их ещё и написали руками.', 'In ol the browser adds the numbers. Here someone also typed them by hand.'),
          L3('Ichida raqam yozilgan istalgan li qatorini bosing.', 'Нажми любую строку li, где внутри написана цифра.', 'Tap any li line with a digit inside.')],
        why: L3('ol da raqamlarni yozmaymiz — brauzer ularni o‘zi qo‘yadi.', 'В ol номера не пишем — браузер ставит их сам.', 'In ol we don’t type numbers: the browser adds them itself.') },
      { from: 'madina', msg: L3('Iksir qadamlari raqamsiz — tartibni adashtirib yubordim!', 'Шаги зелья без номеров — я перепутала порядок!', 'The potion steps have no numbers, and I mixed up the order!'),
        hints: [L3('Qadamlar uchun qanday ro‘yxat kerak?', 'Какой список нужен для шагов?', 'Which list do steps need?'),
          L3('Ro‘yxatni ochuvchi tegga qarang.', 'Посмотри на тег, который открывает список.', 'Look at the tag that opens the list.'),
          L3('<ul> qatorini bosing.', 'Нажми строку <ul>.', 'Tap the <ul> line.')],
        why: L3('Qadamlar — tartib muhim, demak ol.', 'Это шаги — порядок важен, значит ol.', 'These are steps: order matters, so ol.') }
    ],
    other: L3('Bu qator joyida. Qidirishda davom eting.', 'Эта строка в порядке. Ищи дальше.', 'This line is fine. Keep looking.'),
    done: L3('Uchala shikoyat yopildi! O‘yinchilar xursand.', 'Все три жалобы закрыты! Игроки довольны.', 'All three complaints are closed! The players are happy.')
  },

  s13: {
    eyebrow: L3('Qatorni yozing', 'Напиши строку', 'Write the line'),
    msg: L3('Men uchinchi o‘rinni oldim! Meni ham yozib qo‘ying, iltimos.', 'Я занял третье место! Допишите меня, пожалуйста.', 'I got third place! Please add me.'),
    say: L3('Azizni o‘zingiz yozing. Qatorni to‘liq tering: ochuvchi teg, ism, yopuvchi teg.', 'Азиза впиши сам. Напиши строку целиком: открывающий тег, имя, закрывающий тег.', 'Add Aziz yourself. Write the whole line: opening tag, name, closing tag.'),
    ask: L3('Aziz uchun <li> qatorini yozing', 'Напиши строку <li> для Азиза', 'Write the <li> line for Aziz'),
    msgs: {
      noOpen: L3('Ochuvchi <li> tegidan boshlang.', 'Начни с открывающего тега <li>.', 'Start with the opening tag <li>.'),
      noText: L3('Teglar orasiga ismni yozing.', 'Между тегами напиши имя.', 'Write the name between the tags.'),
      noClose: L3('Bandni </li> tegi bilan yoping.', 'Закрой пункт тегом </li>.', 'Close the item with </li>.'),
      needSlash: L3('Yopuvchi tegda qiya chiziq kerak.', 'В закрывающем теге нужна косая черта.', 'The closing tag needs a slash.'),
      wrongTag: L3('Band li tegi bilan yoziladi.', 'Пункт пишется тегом li.', 'An item is written with the li tag.')
    },
    hints: [
      L3('Yuqoridagi qatorlarga qarang — sizniki ham xuddi shunday.', 'Посмотри на строки выше — твоя такая же.', 'Look at the lines above: yours is the same.'),
      L3('Qator: <li>, keyin ism, keyin </li>.', 'Строка: <li>, потом имя, потом </li>.', 'The line: <li>, then the name, then </li>.'),
      L3('Shunday yozing: <li>Aziz</li>.', 'Напиши так: <li>Азиз</li>.', 'Write it like this: <li>Aziz</li>.')
    ],
    praise: L3('Qator to‘liq yozildi — Aziz ro‘yxatda uchinchi.', 'Строка написана целиком — Азиз в списке третьим.', 'The whole line is written: Aziz is third on the list.')
  },

  s14: {
    eyebrow: L3('Mening bo‘limim', 'Мой раздел', 'My section'),
    say: L3('Endi qo‘llanmadagi o‘z bo‘limingiz. Mavzu tanlang, keyin ro‘yxat turini va bandlarni yozing.',
      'Теперь твой раздел гайда. Выбери тему, потом вид списка и напиши пункты.',
      'Now your own guide section. Pick a topic, then the kind of list, and write the items.'),
    topics: [
      { id: 'inv', want: 'ul', label: L3('Mening inventarim', 'Мой инвентарь', 'My inventory'), ex: L3('Masalan: qilich', 'Например: меч', 'For example: sword') },
      { id: 'craft', want: 'ol', label: L3('Mash’al qanday yasaladi', 'Как сделать факел', 'How to make a torch'), ex: L3('Masalan: tayoq toping', 'Например: найди палку', 'For example: find a stick') },
      { id: 'top', want: 'ol', label: L3('Mening top-3 o‘yinlarim', 'Мой топ-3 игр', 'My top 3 games'), ex: L3('Birinchi o‘rindagi o‘yin', 'Игра на первом месте', 'The game in first place') },
      { id: 'pets', want: 'ul', label: L3('O‘yindagi uy hayvonlarim', 'Мои питомцы в игре', 'My pets in the game'), ex: L3('Masalan: mushuk', 'Например: кот', 'For example: cat') }
    ],
    askTopic: L3('Mavzu tanlang', 'Выбери тему', 'Pick a topic'),
    askList: L3('Bu mavzu uchun ul yoki ol?', 'Для этой темы — ul или ol?', 'For this topic: ul or ol?'),
    askItems: L3('«+ li» ni bosing va bandni yozing — uchta kerak', 'Нажми «+ li» и напиши пункт — нужно три', 'Tap “+ li” and write an item, three in all'),
    hintItems: L3('li tugmasini bosing va bandni yozing. Uchta band kerak.', 'Нажми кнопку li и напиши пункт. Нужно три пункта.', 'Tap the li button and write an item. You need three items.'),
    okList: L3('To‘g‘ri tanlov! Endi bandlarni li tugmasi bilan qo‘shing.', 'Верный выбор! Теперь добавляй пункты кнопкой li.', 'Good choice! Now add items with the li button.'),
    missOl: L3('Bandlarni aralashtirib ko‘ring: ma’no buziladi. Demak tartib muhim.', 'Представь, что пункты перемешались: смысл ломается. Значит, порядок важен.', 'Imagine the items shuffled: the meaning breaks. So order matters.'),
    missUl: L3('Bandlarni aralashtirib ko‘ring: hech narsa o‘zgarmaydi. Tartib muhim emas.', 'Представь, что пункты перемешались: ничего не меняется. Порядок не важен.', 'Imagine the items shuffled: nothing changes. Order doesn’t matter.'),
    noTags: L3('Bu yerga faqat so‘zlar, teglar allaqachon bor.', 'Здесь только слова — теги уже стоят.', 'Only words here; the tags are already there.'),
    done: L3('Bo‘lim tayyor: ro‘yxat turi ma’noga mos, bandlar o‘zingizniki.', 'Раздел готов: вид списка по смыслу, а пункты — твои.', 'The section is ready: the list fits the meaning, and the items are yours.')
  },

  s15: {
    eyebrow: L3('Mening bo‘limim', 'Мой раздел', 'My section'),
    say: L3('Mana qo‘llanmadagi bo‘limingiz va uning kodi. Uni saqlang.', 'Вот твой раздел гайда и его код. Сохрани его.', 'Here’s your guide section and its code. Save it.'),
    saved: L3('Ura, saqlandi! O‘yinchilar bo‘limingizdan xursand bo‘ladi!', 'Ура, сохранено! Игроки будут в восторге от твоего раздела!', 'Hooray, saved! The players will love your section!'),
    ask: L3('Bo‘limni saqlang', 'Сохрани раздел', 'Save the section')
  },

  s16: {
    eyebrow: L3('Yakun', 'Итог', 'Wrap-up'),
    say: L3('Bugun qo‘llanma tushunarli bo‘ldi: nuqtali va raqamli ro‘yxatlar. Keyingi darsda havolalar qilamiz — qo‘llanma bo‘limlari bir-biriga bog‘lanadi. Ko‘rishguncha!',
      'Сегодня гайд стал понятным: списки с точками и с номерами. На следующем уроке сделаем ссылки — разделы гайда свяжутся между собой. Пока!',
      'Today the guide became clear: bulleted and numbered lists. Next lesson we’ll make links, so the guide’s sections connect to each other. Bye!'),
    skills: [
      L3('ul — nuqtali ro‘yxat: tartib muhim emas', 'ul — список с точками: порядок не важен', 'ul is a bulleted list: order doesn’t matter'),
      L3('ol — raqamli ro‘yxat: raqamlarni brauzer qo‘yadi', 'ol — список с номерами: номера ставит браузер', 'ol is a numbered list: the browser adds the numbers'),
      L3('li — bitta band, doim ul yoki ol ichida', 'li — один пункт, всегда внутри ul или ol', 'li is one item, always inside ul or ol'),
      L3('Ro‘yxat oxirgi li dan keyin yopiladi', 'Список закрывается после последнего li', 'A list is closed after its last li')
    ],
    next: L3('Havolalar va atributlar', 'Ссылки и атрибуты', 'Links and attributes'),
    btn: L3('Darsni yakunlash', 'Завершить урок', 'Finish the lesson')
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГИ ВСЛУХ — SpokenTags (как в уроке 1, словарь дополнен тегами урока)
// На экране тег пишется точно (h1, </p>), а сервис озвучки прочёл бы латиницу
// посреди узбекской или русской фразы как попало. Перед отправкой в озвучку
// теги и знаки разметки заменяются понятными словами.
// ─────────────────────────────────────────────────────────────────────────────
// Названия тегов вслух — по-английски во всех языках (заказчик, 17.10.2026:
// «body, а не бади»): сервис читает их как английские слова. Остальные слова
// (закрывающий тег, уголок, косая черта) — на языке урока.
const TAG_SAY = {
  ru: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six',
    p: 'P', b: 'B', i: 'I',
    close: 'закрывающий тег', lt: 'уголок', gt: 'закрывающий уголок', slash: 'косая черта' },
  uz: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six',
    p: 'P', b: 'B', i: 'I',
    close: 'yopuvchi teg', lt: 'ochuvchi burchak', gt: 'yopuvchi burchak', slash: 'qiya chiziq' },
  en: { html: 'H T M L', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    h1: 'H one', h2: 'H two', h3: 'H three', h4: 'H four', h5: 'H five', h6: 'H six',
    p: 'P', b: 'B', i: 'I',
    close: 'closing tag', lt: 'less-than sign', gt: 'greater-than sign', slash: 'slash' }
};
function spokenHtml(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const word = (t) => m[String(t).toLowerCase()] || t;
  let s = String(text || '');
  s = s.replace(/<!DOCTYPE\s+html>/gi, m.doctype + ' ' + m.html);
  s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => ' ' + m.close + ' ' + word(t) + ' ');
  s = s.replace(/<\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => ' ' + word(t) + ' ');
  s = s.replace(/\b(html|HTML|head|title|body|DOCTYPE|h[1-6])\b/g, (w) => word(w));
  // Одиночные латинские p, b, i — это имена тегов: в тексте урока других нет.
  s = s.replace(/(^|[\s(«“"])([pbi])(?=[\s,.!?:;)»”"]|$)/g, (all, pre, t) => pre + word(t));
  s = s.replace(/</g, ' ' + m.lt + ' ').replace(/>/g, ' ' + m.gt + ' ').replace(/\s\/\s/g, ' ' + m.slash + ' ');
  return s.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}

// Реплики героя в данных экрана — для прогрева озвучки. Собираем только
// реплики (ключи из SPOKEN и всё под ними); подписи, цели и примеры
// печатаются и сервису не нужны. Шаблоны с {подстановкой} не греем.
const SPOKEN = { say: 1, cast: 1, found1: 1, found2: 1, say2: 1, other: 1, hints: 1, hints1: 1, hints2: 1,
  done: 1, praise: 1, wrong: 1, more: 1, why: 1, err: 1, built: 1, typeSay: 1, typeMsg: 1, typeHints: 1, tell: 1,
  ok: 1, ok1: 1, rightPred: 1, wrongPred: 1, wrapSay: 1, wrapped: 1, fixed: 1, addSay: 1, added: 1, empty: 1,
  noTags: 1, quizSay: 1, quizWrong: 1, found: 1, fixWrong: 1, onLevel: 1, onText: 1, onAdd: 1, onReset: 1,
  onBefore: 1, almost: 1, saved: 1, pickFirst: 1, wrongSpot: 1, steps: 1, tasks: 1, okLv: 1 };
const NOT_SPOKEN_IN = { steps: { icon: 1, text: 1 }, cast: { pose: 1, step: 1 }, tasks: { ask: 1 } };
function heroLines(node, lang, out, on, parent) {
  const acc = out || [];
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((x) => heroLines(x, lang, acc, on, parent)); return acc; }
  if (node.uz !== undefined || node.ru !== undefined) {
    if (!on) return acc;
    const s = node[lang] !== undefined ? node[lang] : node.ru;
    if (typeof s === 'string' && s.indexOf('{') < 0) acc.push(s);
    return acc;
  }
  Object.keys(node).forEach((k) => {
    const skip = parent && NOT_SPOKEN_IN[parent] && NOT_SPOKEN_IN[parent][k];
    if (skip) return;
    heroLines(node[k], lang, acc, on || !!SPOKEN[k], SPOKEN[k] ? k : parent);
  });
  return acc;
}

function SpokenTags({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenHtml(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЦВЕТА ТЕГОВ. Теги урока 1 — те же, что были (графит, фиолетовый, ягодный,
// стальной голубой). Новые: заголовки h1–h6 — один индиго на все уровни
// (уровень читается цифрой и размером, а не цветом), абзац p — морская
// волна, выделение b и i — пурпур. Все тона одной светлоты (OKLCH L≈0.5),
// контраст на белом — от 5:1. Оранжевый — интерфейс, жёлтый — подсказка,
// зелёный — «верно»: ни один тег ими не окрашен.
// ─────────────────────────────────────────────────────────────────────────────
const TAGC = { html: '#586A83', head: '#6F57AB', title: '#9F4471', body: '#1171A0',
  h: '#4F46C8', p: '#227882', em: '#97368A' };
const isHead = (t) => /^h[1-6]$/.test(String(t || ''));
const tagColor = (t) => (isHead(t) ? TAGC.h : (t === 'b' || t === 'i') ? TAGC.em : (TAGC[t] || T.ink2));
const lvlOf = (t) => (isHead(t) ? Number(String(t).slice(1)) : 0);

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ СТРАНИЦЫ. Страница — список блоков внутри body:
//   { id, tag: 'h1'…'h6' | 'p' | null, parts: [{ k: 't' | 'b' | 'i', v }] }
// tag null — голый текст прямо в body (так выглядит «стена текста»).
// parts — текст блока; b и i выделяют свои куски.
// ─────────────────────────────────────────────────────────────────────────────
const txt = (v) => ({ k: 't', v: String(v == null ? '' : v) });
const blk = (id, tag, parts) => ({ id, tag, parts: typeof parts === 'string' ? [txt(parts)] : parts });
const plain = (b) => b.parts.map((x) => x.v).join('');

// Предложения блока: границы — после . ! ? и перед пробелом.
const sentencesOf = (s) => (String(s || '').match(/[^.!?…]+(?:[.!?…]+|$)/g) || []).map((x) => x.trim()).filter(Boolean);

// Готовая разметка — для артефакта и экрана «Моя страница».
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inlineHtml = (parts) => parts.map((x) => (x.k === 'b' || x.k === 'i'
  ? '<' + x.k + '>' + escHtml(x.v) + '</' + x.k + '>' : escHtml(x.v))).join('');
const buildHtml = (title, blocks) => [
  '<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(title) + '</title>', '  </head>', '  <body>'
].concat(blocks.map((b) => '    ' + (b.tag ? '<' + b.tag + '>' + inlineHtml(b.parts) + '</' + b.tag + '>' : inlineHtml(b.parts))))
  .concat(['  </body>', '</html>']).join('\n');

// Осмысленный текст: хотя бы две буквы и без разметки.
const hasLetters = (s) => (String(s || '').match(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ‘’]/g) || []).length >= 2;
const hasTags = (s) => /[<>]/.test(String(s || ''));
const normTag = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// СЛОВА И ВЫДЕЛЕНИЕ. Предложение режется на слова, пробелы и знаки; выделение
// b или i — диапазон слов [a, b] (индексы токенов). Точка, запятая и кавычки
// в выделение не попадают сами — ученик выбирает слова.
// ─────────────────────────────────────────────────────────────────────────────
const PUNCT = /^[.,!?;«»"“”()…]$/;
const toTokens = (s) => (String(s || '').match(/[^\s.,!?;«»"“”()…]+|\s+|[.,!?;«»"“”()…]/g) || [])
  .map((v) => ({ v, w: !/^\s+$/.test(v) && !PUNCT.test(v) }));
const fragOf = (toks, a, b) => toks.slice(a, b + 1).map((t) => t.v).join('');
function findRange(toks, frag) {
  const f = String(frag || '').trim();
  for (let a = 0; a < toks.length; a += 1) {
    if (!toks[a].w) continue;
    for (let b = a; b < toks.length; b += 1) {
      if (!toks[b].w) continue;
      const s = fragOf(toks, a, b);
      if (s === f) return [a, b];
      if (s.length > f.length) break;
    }
  }
  return null;
}
// Текст + отметки → parts блока.
function partsFrom(toks, marks) {
  const out = [];
  toks.forEach((t, i) => {
    const m = (marks || []).find((x) => i >= x.a && i <= x.b);
    const k = m ? m.tag : 't';
    const id = m ? 'm' + m.a : 't';
    const last = out[out.length - 1];
    if (last && last.k === k && last._id === id) last.v += t.v;
    else out.push({ k, v: t.v, _id: id });
  });
  return out.map((x) => ({ k: x.k, v: x.v }));
}
// Выбор диапазона касаниями: первое слово → последнее; ещё касание — заново.
function useWordSel() {
  const [sel, setSel] = useState(null);
  const tap = useCallback((i) => {
    setSel((s) => {
      if (!s) return { a: i, b: i };
      if (s.a === s.b) {
        if (s.a === i) return null;
        return { a: Math.min(s.a, i), b: Math.max(s.a, i) };
      }
      return { a: i, b: i };
    });
  }, []);
  return [sel, tap, setSel];
}

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГ, ТОКЕН И КОД
// ─────────────────────────────────────────────────────────────────────────────
function Tag({ tag, close, doctype, big }) {
  if (doctype) return <span className="tk-doc">{'<!DOCTYPE html>'}</span>;
  return (
    <span className={'tk-tag' + (big ? ' is-big' : '')} style={{ '--c': tagColor(tag) }}>
      <span className="tk-br">{'<'}</span>
      {close ? <span className="tk-sl">/</span> : null}
      <span className="tk-nm">{tag}</span>
      <span className="tk-br">{'>'}</span>
    </span>
  );
}

// Один токен строки кода. zone(z, t) → { tap, cls, disabled, led, style }.
function Tok({ t, zone, onZone, regZone }) {
  const st = zone && t.z ? zone(t.z, t) : null;
  let inner;
  if (t.k === 'node') inner = t.node;
  else if (t.k === 'text') inner = <span className={'tk-tx' + (t.dim ? ' is-dim' : '')}>{t.v === '' ? ' ' : t.v}</span>;
  else if (t.k === 'doctype') inner = <Tag doctype />;
  else inner = <Tag tag={t.tag} close={t.k === 'close'} />;
  const ref = regZone && t.z ? (el) => regZone(t.z, el) : undefined;
  if (st && st.tap) {
    return (
      <button type="button" ref={ref} className={'tk tk-btn' + (st.cls ? ' ' + st.cls : '')} style={st.style}
        disabled={!!st.disabled} onClick={(e) => { if (onZone) onZone(t.z, e.currentTarget, t); }}>
        {inner}
        <Led on={!!st.led} />
      </button>
    );
  }
  return <span ref={ref} className={'tk' + (st && st.cls ? ' ' + st.cls : '')} style={st ? st.style : undefined}>{inner}</span>;
}

// Строки документа. frame: 'full' — весь документ, 'hb' — head и body без
// DOCTYPE и html (экономит три строки на телефоне), 'body' — только body,
// 'none' — одни блоки. collapse(b) — свернуть текст блока до «…».
function srcLines(blocks, opts) {
  const o = opts || {};
  const frame = o.frame || 'body';
  const L = [];
  const full = frame === 'full';
  const base = full ? 2 : (frame === 'body' || frame === 'hb') ? 1 : 0;
  if (full) {
    L.push({ key: 'doctype', d: 0, toks: [{ k: 'doctype', z: 'doctype' }] });
    L.push({ key: 'html-o', d: 0, toks: [{ k: 'open', tag: 'html', z: 'html:o' }] });
  }
  if (full || frame === 'hb') {
    const h = full ? 1 : 0;
    L.push({ key: 'head-o', d: h, toks: [{ k: 'open', tag: 'head', z: 'head:o' }] });
    L.push({ key: 'title', d: h + 1, tag: 'title', toks: [{ k: 'open', tag: 'title', z: 'title:o' },
      { k: 'text', v: o.title || '', z: 'title:t', slot: 'title' }, { k: 'close', tag: 'title', z: 'title:c' }] });
    L.push({ key: 'head-c', d: h, toks: [{ k: 'close', tag: 'head', z: 'head:c' }] });
  }
  if (frame !== 'none') L.push({ key: 'body-o', d: base - 1, toks: [{ k: 'open', tag: 'body', z: 'body:o' }] });
  blocks.forEach((b) => {
    const toks = [];
    if (b.tag) toks.push({ k: 'open', tag: b.tag, z: b.id + ':o' });
    if (o.collapse && o.collapse(b)) toks.push({ k: 'text', v: '…', z: b.id + ':0', dim: true });
    else {
      b.parts.forEach((x, j) => {
        if (x.k === 'b' || x.k === 'i') {
          toks.push({ k: 'open', tag: x.k, z: b.id + ':' + j + ':o' });
          toks.push({ k: 'text', v: x.v, z: b.id + ':' + j });
          toks.push({ k: 'close', tag: x.k, z: b.id + ':' + j + ':c' });
        } else toks.push({ k: 'text', v: x.v, z: b.id + ':' + j });
      });
    }
    if (b.tag) toks.push({ k: 'close', tag: b.tag, z: b.id + ':c' });
    L.push({ key: 'b-' + b.id, id: b.id, d: base, tag: b.tag, toks });
  });
  if (frame !== 'none') L.push({ key: 'body-c', d: base - 1, toks: [{ k: 'close', tag: 'body', z: 'body:c' }] });
  if (full) L.push({ key: 'html-c', d: 0, toks: [{ k: 'close', tag: 'html', z: 'html:c' }] });
  return L;
}

// Вид кода. Строка с длинным текстом переносится с висячим отступом —
// абзац читается целиком и на узком телефоне.
function Src({ lines, zone, onZone, regZone, lineProps, className, numbers = true }) {
  return (
    <div className={'src' + (className ? ' ' + className : '')} translate="no">
      {lines.map((ln, i) => {
        const ex = lineProps ? (lineProps(ln, i) || {}) : {};
        const body = (
          <>
            {numbers ? <span className="src-n mono" aria-hidden="true">{i + 1}</span> : null}
            <span className="src-code">
              {ex.content || ln.toks.map((t, j) => <Tok key={j} t={t} zone={zone} onZone={onZone} regZone={regZone} />)}
            </span>
            {ex.after || null}
          </>
        );
        const cls = 'src-line' + (ln.id ? ' is-block' : '') + (ex.cls ? ' ' + ex.cls : '');
        const style = { '--d': ln.d, '--c': ln.tag ? tagColor(ln.tag) : 'transparent' };
        if (ex.onTap) {
          return (
            <button type="button" key={ln.key} className={cls + ' src-tap'} style={style} disabled={!!ex.disabled}
              ref={ex.reg} onClick={(e) => ex.onTap(e.currentTarget)}>
              {body}
              <Led on={!!ex.led} />
            </button>
          );
        }
        return <div key={ln.key} ref={ex.reg} className={cls} style={style}>{body}</div>;
      })}
    </div>
  );
}

// Текст, который «печатается» по буквам. При «меньше движения» — сразу целиком.
function TypeText({ text, speed = 42 }) {
  const s = String(text || '');
  const [n, setN] = useState(() => (reduceMotion() ? s.length : 0));
  useEffect(() => {
    if (reduceMotion()) { setN(s.length); return undefined; }
    setN(0);
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= s.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [s, speed]);
  return <>{s.slice(0, n)}{n < s.length ? <span className="tt-caret" aria-hidden="true" /> : null}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА В БРАУЗЕРЕ — HTML без CSS, как его рисует браузер по умолчанию.
// flash { id, n } — блок, который только что изменился; hl — подсвеченные id;
// fresh — блоки, которые только что появились (въезжают).
// ─────────────────────────────────────────────────────────────────────────────
const inlineParts = (parts) => parts.map((x, i) => (x.k === 'b' ? <b key={i}>{x.v}</b>
  : x.k === 'i' ? <i key={i}>{x.v}</i> : <React.Fragment key={i}>{x.v}</React.Fragment>));

function Page({ blocks, flash, hl, fresh, regBlock, renderBlock }) {
  return (
    <div className="pg">
      {blocks.map((b) => {
        const f = flash && flash.id === b.id;
        const cls = 'pg-b ' + (b.tag ? 'pg-' + b.tag : 'pg-raw') + (f ? ' is-flash' : '')
          + (hl && hl.indexOf(b.id) >= 0 ? ' is-hl' : '') + (fresh && fresh.indexOf(b.id) >= 0 ? ' is-new' : '');
        return (
          <div key={b.id + (f ? ':' + flash.n : '')} ref={regBlock ? (el) => regBlock(b.id, el) : undefined}
            className={cls} style={{ '--c': b.tag ? tagColor(b.tag) : T.ink3 }}>
            {renderBlock ? renderBlock(b) : inlineParts(b.parts)}
          </div>
        );
      })}
    </div>
  );
}

// МИНИ-БРАУЗЕР (как в уроке 1): вкладка и страница. hl: 'title' — вкладка,
// 'body' — страница, 'both' — обе (когда важно показать, что меняется не то).
function MiniBrowser({ title, page, hl, tabRef, pageRef, flashTab, flashPage, pins, compact, typed, cls }) {
  const pick = usePick();
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  const hlc = hl === 'both' ? ' mb-hl-title mb-hl-body' : hl ? ' mb-hl-' + hl : '';
  return (
    <div className={'mb' + hlc + (compact ? ' mb-compact' : '') + (cls ? ' ' + cls : '')}>
      <div className="mb-top">
        <span ref={tabRef} key={'tab' + (flashTab || 0)} className={'mb-tab' + (flashTab ? ' is-flash' : '')}>
          <span className="mb-fav" aria-hidden="true" />
          <span className={'mb-tab-t' + (t ? '' : ' is-file')}>{t ? (typed ? <TypeText text={t} /> : t) : 'index.html'}</span>
          <span className="mb-x" aria-hidden="true" />
          {pins && pins.tab ? <span className="mb-pin mb-pin-tab">{pick(pins.tab)}</span> : null}
        </span>
        {/* Окно как Chrome в Windows: «+» новой вкладки и кнопки окна справа. */}
        <span className="mb-new" aria-hidden="true" />
        <span className="mb-win" aria-hidden="true"><i className="mb-w-min" /><i className="mb-w-max" /><i className="mb-w-x" /></span>
      </div>
      <div ref={pageRef} key={'pg' + (flashPage || 0)} className={'mb-page' + (flashPage ? ' is-flash' : '')}>
        <div className="mb-doc">{page}</div>
        {pins && pins.page ? <span className="mb-pin mb-pin-page">{pick(pins.page)}</span> : null}
      </div>
    </div>
  );
}

// ПРОВОД — линия от места в коде к тому, что оно меняет в браузере.
function Wire({ wrapRef, from, to, color, on, nonce }) {
  const [g, setG] = useState(null);
  useLayoutEffect(() => {
    if (!on) { setG(null); return undefined; }
    let dead = false;
    const calc = () => {
      if (dead) return;
      const w = wrapRef.current, a = from(), b = to();
      if (!w || !a || !b) { setG(null); return; }
      const W = w.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
      if (!A.width || !B.width) { setG(null); return; }
      const ax = A.left + A.width / 2 - W.left, ay = A.top + A.height / 2 - W.top;
      const bx = B.left + B.width / 2 - W.left, by = B.top + B.height / 2 - W.top;
      const horiz = Math.abs(bx - ax) > Math.abs(by - ay) * 1.2;
      let p1, p2, c1, c2;
      if (horiz) {
        p1 = [ax < bx ? A.right - W.left : A.left - W.left, ay];
        p2 = [ax < bx ? B.left - W.left : B.right - W.left, by];
        const mx = (p1[0] + p2[0]) / 2;
        c1 = [mx, p1[1]]; c2 = [mx, p2[1]];
      } else {
        p1 = [ax, ay > by ? A.top - W.top : A.bottom - W.top];
        p2 = [bx, ay > by ? B.bottom - W.top : B.top - W.top];
        const my = (p1[1] + p2[1]) / 2;
        c1 = [p1[0], my]; c2 = [p2[0], my];
      }
      const r = (n) => Math.round(n * 10) / 10;
      setG({ d: `M${r(p1[0])} ${r(p1[1])} C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`,
        s: p1, e: p2, w: W.width, h: W.height });
    };
    calc();
    const timers = [80, 300, 700].map((ms) => setTimeout(calc, ms));
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && wrapRef.current) { ro = new ResizeObserver(calc); ro.observe(wrapRef.current); }
    window.addEventListener('resize', calc);
    return () => { dead = true; timers.forEach(clearTimeout); if (ro) ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [on, nonce]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!g) return null;
  return (
    <svg className="wire" width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true" style={{ '--c': color }}>
      <path key={'p' + nonce} className="wire-path" d={g.d} pathLength="100" />
      <circle key={'s' + nonce} className="wire-dot" cx={g.s[0]} cy={g.s[1]} r="4" />
      <circle key={'e' + nonce} className="wire-dot wire-end" cx={g.e[0]} cy={g.e[1]} r="5.5" />
    </svg>
  );
}

// РУКА-ПОДСКАЗКА: новая механика сначала показывается движением.
function DemoHand({ wrapRef, targets, run }) {
  const audio = useAudio();
  const pausedRef = useRef(false);
  pausedRef.current = !!(audio && audio.paused);
  const [pos, setPos] = useState(null);
  const [tap, setTap] = useState(false);
  useEffect(() => {
    if (!run) { setPos(null); return undefined; }
    let dead = false;
    let i = 0;
    const place = () => {
      const w = wrapRef.current;
      const el = targets[i % targets.length] && targets[i % targets.length]();
      if (!w || !el) return;
      const W = w.getBoundingClientRect(), R = el.getBoundingClientRect();
      setPos({ x: R.left + R.width / 2 - W.left, y: R.top + R.height / 2 - W.top });
    };
    const tapT = [];
    const pressLater = () => { tapT.push(setTimeout(() => { if (!dead) setTap(true); }, 560)); };
    const first = setTimeout(() => { if (!dead) { place(); pressLater(); } }, 400);
    const id = setInterval(() => {
      if (dead || pausedRef.current) return;
      i += 1;
      if (i >= targets.length * 2) { clearInterval(id); setPos(null); return; }
      setTap(false);
      place();
      pressLater();
    }, 1500);
    return () => { dead = true; clearTimeout(first); tapT.forEach(clearTimeout); clearInterval(id); };
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!pos || !run) return null;
  return (
    <span className={'demo-hand' + (tap ? ' is-tap' : '')} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }} aria-hidden="true">
      <span className="dh-ring" />
      <svg viewBox="0 0 40 48" width="34" height="41">
        <path d="M14 6a4 4 0 0 1 8 0v15a4 4 0 0 1 7 1 4 4 0 0 1 7 2v10c0 7-5 12-13 12h-3c-5 0-8-2-11-6l-6-9a3.6 3.6 0 0 1 5.6-4.4L14 30z"
          fill="#fff" stroke={T.ink} strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// ЛЕСЕНКА В МЕХАНИКАХ УРОКА: направление → сужение → почти ответ.
function useLadder(init) {
  const ref = useRef(init || 0);
  const [level, setLevel] = useState(init || 0);
  const bump = useCallback(() => { ref.current = Math.min(3, ref.current + 1); setLevel(ref.current); return ref.current; }, []);
  const reset = useCallback(() => { ref.current = 0; setLevel(0); }, []);
  return { level, bump, reset, ref };
}
function LadderNote({ level, text, cls }) {
  const pick = usePick();
  if (!level || !text) return null;
  return (
    <div className={'note note-hint note-one' + (cls ? ' ' + cls : '')} key={level + ':' + pick(text)} aria-live="polite">
      <span className="note-lbl">
        <Icon name="bulb" size={13} />
        {pick(HINT_LABEL[level - 1])}
        <span className="note-step mono">{level}/3</span>
      </span>
      <div className="note-body">{pick(text)}</div>
    </div>
  );
}

// Переключатель из двух-трёх положений: «Код / Результат», «Было / Стало».
function SegToggle({ value, options, onChange, label }) {
  const pick = usePick();
  const audio = useAudio();
  return (
    <div className="seg2" role="radiogroup" aria-label={label ? pick(label) : undefined}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v}
          className={'seg2-b' + (value === o.v ? ' is-on' : '')}
          onClick={() => { sfx('tap', audio && audio.on); onChange(o.v); }}>
          {pick(o.label)}
        </button>
      ))}
    </div>
  );
}

// Поле прямо в строке кода. Кегль 16 px — иначе iOS увеличивает страницу.
function InlineInput({ value, onChange, placeholder, label, max = 40, inputRef, onEnter, cls, onFocus }) {
  const pick = usePick();
  return (
    <input ref={inputRef} className={'tk-input' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      size={Math.max(4, Math.min(28, String(value || '').length + 1))}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onFocus={onFocus} onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (onEnter) onEnter(); else e.currentTarget.blur(); } }} />
  );
}

// Рабочая область «браузер + код»: в колонку на телефоне, в ряд на компьютере.
// view ('code' | 'result') на телефоне оставляет одну половину — переключает
// SegToggle над ней; на компьютере видны обе.
const Work = React.forwardRef(function Work({ browser, code, wire, extra, cls, view }, ref) {
  return (
    <div className={'work' + (view ? ' work-v work-v-' + view : '') + (cls ? ' ' + cls : '')} ref={ref}>
      {browser ? <div className="work-b">{browser}</div> : null}
      <div className="work-c">{code}</div>
      {wire || null}
      {extra || null}
    </div>
  );
});

// Хранилище экрана: прочитать при монтировании, записать и в стор, и в состояние.
function useRec(id) {
  const store = useStore();
  const [rec, setRec] = useState(() => store.get(id) || null);
  const put = useCallback((v) => { store.set(id, v); setRec(v); }, [id, store]);
  return [rec, put, store];
}

// Ровно один раз за жизнь экрана: защёлка для реплик «впервые».
function useOnce() {
  const seen = useRef({});
  return useCallback((k) => { if (seen.current[k]) return false; seen.current[k] = true; return true; }, []);
}

// Тряска элемента после неверного ответа.
function useShake() {
  const [shake, setShake] = useState(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const wobble = useCallback((k) => { setShake(k); setTimeout(() => { if (alive.current) setShake(null); }, 420); }, []);
  return [shake, wobble, alive];
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОВЕРКА СТРУКТУРЫ — список правил; ошибка называется правилом, а не
// «сломанной страницей».
// ─────────────────────────────────────────────────────────────────────────────
function Inspector({ rules }) {
  const pick = usePick();
  const firstOpen = rules.findIndex((r) => !r.ok);
  return (
    <div className={'insp' + (firstOpen < 0 ? ' insp-all' : '')} aria-live="polite">
      <span className="insp-h"><Icon name="listN" size={14} />{pick(UI.inspector)}</span>
      {rules.map((r, i) => (
        <span key={r.id} className={'insp-r' + (r.ok ? ' is-ok' : '') + (i === firstOpen ? ' is-now' : '')}>
          <span className="insp-ic">{r.ok ? <Icon name="check" size={13} /> : null}</span>
          {pick(r.text)}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// НАБОР ТЕГА С КЛАВИШАМИ. Поле в строке кода + кнопки символов для телефона.
// check() сравнивает с want и называет, чего не хватает.
// ─────────────────────────────────────────────────────────────────────────────
function useTagTyping({ max = 16 } = {}) {
  const [val, setVal] = useState('');
  const inputRef = useRef(null);
  const insert = (ch) => {
    const el = inputRef.current;
    const a = el && typeof el.selectionStart === 'number' ? el.selectionStart : val.length;
    const b = el && typeof el.selectionEnd === 'number' ? el.selectionEnd : val.length;
    const nv = (val.slice(0, a) + ch + val.slice(b)).slice(0, max);
    setVal(nv);
    sfx('type', true);
    requestAnimationFrame(() => { if (el) { el.focus(); const pos = Math.min(nv.length, a + ch.length); el.setSelectionRange(pos, pos); } });
  };
  const backspace = () => {
    const el = inputRef.current;
    const a = el && typeof el.selectionStart === 'number' ? el.selectionStart : val.length;
    const b = el && typeof el.selectionEnd === 'number' ? el.selectionEnd : val.length;
    const cut = a === b ? Math.max(0, a - 1) : a;
    const nv = val.slice(0, cut) + val.slice(b);
    setVal(nv);
    sfx('tap', true);
    requestAnimationFrame(() => { if (el) { el.focus(); el.setSelectionRange(cut, cut); } });
  };
  const prefill = (s) => {
    setVal(s);
    requestAnimationFrame(() => { const el = inputRef.current; if (el) { el.focus(); el.setSelectionRange(s.length, s.length); } });
  };
  return { val, setVal: (v) => setVal(String(v).slice(0, max)), inputRef, insert, backspace, prefill };
}
// Что не так с набранным закрывающим тегом. null — всё верно.
function tagTypingIssue(typed, tag, msgs) {
  const n = normTag(typed);
  if (n === '</' + tag + '>') return null;
  if (n === '<' + tag + '>') return msgs.needSlash;
  if (n.charAt(0) !== '<') return msgs.needLt;
  if (n.charAt(n.length - 1) !== '>') return msgs.needGt;
  if (n.indexOf('</') === 0) return fillL(msgs.wrongName, { tag });
  return msgs.generic;
}
function KeyRow({ keys, ty, canTap, onCheck, ready, label }) {
  const pick = usePick();
  return (
    <div className="keys" translate="no">
      {keys.map((k) => (
        <button key={k} type="button" className="key-b mono" disabled={!canTap} onClick={() => ty.insert(k)}>{k}</button>
      ))}
      <button type="button" className="key-b" disabled={!canTap || !ty.val} onClick={ty.backspace}
        aria-label={pick(UI.erase)}><Icon name="undo" size={17} /></button>
      <button type="button" className={'key-b key-go' + (ready ? ' is-ready' : '')} disabled={!canTap}
        onClick={onCheck}>{pick(label || UI.check)}</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// СТРОКА СЛОВ — абзац в коде, где каждое слово можно нажать. Показывает
// выбранный диапазон и уже поставленные теги b/i прямо в коде.
// ─────────────────────────────────────────────────────────────────────────────
function WordLine({ toks, marks, sel, onWord, canTap, led, hlRange, refFirst }) {
  const markAt = (i) => (marks || []).find((m) => i >= m.a && i <= m.b);
  return (
    <span className="wl">
      {toks.map((t, i) => {
        const m = markAt(i);
        const open = m && m.a === i ? <Tag tag={m.tag} /> : null;
        const close = m && m.b === i ? <Tag tag={m.tag} close /> : null;
        const inSel = sel && i >= sel.a && i <= sel.b;
        const inHl = hlRange && i >= hlRange[0] && i <= hlRange[1];
        const cls = (inSel ? ' is-sel' : '') + (m ? ' is-mark is-' + m.tag : '') + (inHl ? ' is-hlr' : '')
          + (sel && i === sel.a ? ' is-a' : '') + (sel && i === sel.b ? ' is-b' : '');
        if (!t.w) return <React.Fragment key={i}>{open}<span className={'wl-sp' + cls}>{t.v}</span>{close}</React.Fragment>;
        return (
          <React.Fragment key={i}>
            {open}
            <button type="button" ref={refFirst && refFirst.at === i ? refFirst.set : undefined}
              className={'wl-w' + cls + (led ? ' is-led' : '')} disabled={!canTap} onClick={() => onWord(i)}>{t.v}</button>
            {close}
          </React.Fragment>
        );
      })}
    </span>
  );
}

// Кнопки уровня заголовка h1…h6.
function LevelRow({ levels, value, onPick, canTap, seen, led, refFor }) {
  return (
    <div className="lvl-row" translate="no">
      {levels.map((n) => (
        <button key={n} type="button" ref={refFor ? (el) => refFor(n, el) : undefined}
          className={'lvl-b' + (value === n ? ' is-on' : '') + (seen && seen.indexOf(n) >= 0 ? ' is-seen' : '') + (led ? ' is-led' : '')}
          disabled={!canTap} onClick={() => onPick(n)} aria-pressed={value === n}>
          <span className="mono">h{n}</span>
          {seen && seen.indexOf(n) >= 0 ? <Icon name="check" size={11} /> : null}
          <Led on={!!led && !(seen && seen.indexOf(n) >= 0)} />
        </button>
      ))}
    </div>
  );
}

// Карточка цели с номером раунда.
function GoalCard({ goal, n, total, done, doneText }) {
  const pick = usePick();
  if (done) {
    return (
      <div className="goal is-done">
        <span className="goal-ic"><Icon name="check" size={18} /></span>
        <span className="goal-t"><b>{pick(doneText)}</b></span>
      </div>
    );
  }
  return (
    <div className="goal" key={pick(goal)}>
      <span className="goal-ic"><Icon name="eye" size={18} /></span>
      <span className="goal-t"><span className="goal-l">{pick(UI.goal)}</span><b>{pick(goal)}</b></span>
      {total > 1 ? <span className="goal-n mono">{n}/{total}</span> : null}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2 ДЛЯ СПИСКОВ
// ═════════════════════════════════════════════════════════════════════════════
// Цвет списков — один на семейство (как h1–h6 в уроке 2): ul, ol и li — стальной
// синий той же светлоты. Зелёный тегам не даём — он значит «верно».
TAGC.ul = '#2F6FB0'; TAGC.ol = '#2F6FB0'; TAGC.li = '#2F6FB0';
// Теги вслух — по-английски во всех языках (заказчик, 17.10.2026).
Object.assign(TAG_SAY.ru, { ul: 'U L', ol: 'O L', li: 'L I' });
Object.assign(TAG_SAY.uz, { ul: 'U L', ol: 'O L', li: 'L I' });
Object.assign(TAG_SAY.en, { ul: 'U L', ol: 'O L', li: 'L I' });
// Ключи реплик урока 3, которых нет в уроке 2 (для прогрева озвучки).
Object.assign(SPOKEN, { each: 1, early: 1, late: 1, openFirst: 1, closeFirst: 1, right: 1, miss: 1, wrap: 1, okOl: 1, okUl: 1,
  missOl: 1, missUl: 1, inside: 1, okList: 1, hintSay: 1, msgs: 1, word: 1, cases: 1 });
Object.assign(NOT_SPOKEN_IN, { cases: { msg: 1, from: 1 } });
// Озвучка: теги и голые имена ul, ol, li — словами, затем общий разбор урока 2.
function spokenList(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const s = String(text || '')
    .replace(/<\s*\/\s*(ul|ol|li)\s*>/gi, (a, t) => ' ' + m.close + ' ' + m[t.toLowerCase()] + ' ')
    .replace(/<\s*(ul|ol|li)\s*>/gi, (a, t) => ' ' + m[t.toLowerCase()] + ' ')
    .replace(/(^|[^A-Za-zА-Яа-яЁё])(ul|ol|li)(?=[^A-Za-zА-Яа-яЁё]|$)/g, (a, pre, t) => pre + m[t]);
  return spokenHtml(s, lang);
}
function SpokenList({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenList(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ СТРАНИЦЫ СО СПИСКАМИ. Узлы:
//   { kind: 'h2' | 'p', id, v | node }       — блок;
//   { kind: 'raw', id, v }                   — текст без тега (строка кода);
//   { kind: 'list', id, tag, items, tail?, noClose?, openTag?, closeTag? }
//        items: [{ id, v | node, noClose? }]; tail — узлы, попавшие внутрь
//        незакрытого списка (рисуются со сдвигом, без точки);
//   { kind: 'li', id, v }                    — пункт вне списка.
// ─────────────────────────────────────────────────────────────────────────────
const li = (id, v, more) => Object.assign({ id, v: String(v == null ? '' : v) }, more || {});
function lsLines(nodes) {
  const L = [];
  const block = (n, d) => {
    if (n.kind === 'raw') { L.push({ key: n.id, id: n.id, d, toks: [{ k: 'text', v: n.v, z: n.id }] }); return; }
    if (n.kind === 'li') {
      L.push({ key: n.id, id: n.id, d, tag: 'li', stray: true,
        toks: [{ k: 'open', tag: 'li', z: n.id + ':o' }, { k: 'text', v: n.v, z: n.id + ':t' }, { k: 'close', tag: 'li', z: n.id + ':c' }] });
      return;
    }
    if (n.kind === 'list') {
      const ot = n.openTag || n.tag, ct = n.closeTag || n.tag;
      L.push({ key: n.id + '-o', id: n.id + ':o', d, tag: ot, toks: [{ k: 'open', tag: ot, z: n.id + ':o' }] });
      n.items.forEach((it) => {
        // bare — строка, которую ученик собирает сам: без готовых тегов li.
        if (it.bare) { L.push({ key: it.id, id: it.id, d: d + 1, toks: [{ k: 'node', node: it.node, z: it.id + ':t' }], li: it }); return; }
        const toks = [{ k: 'open', tag: 'li', z: it.id + ':o' }];
        toks.push(it.node ? { k: 'node', node: it.node, z: it.id + ':t' } : { k: 'text', v: it.v, z: it.id + ':t' });
        if (!it.noClose) toks.push({ k: 'close', tag: 'li', z: it.id + ':c' });
        L.push({ key: it.id, id: it.id, d: d + 1, tag: 'li', toks, li: it });
      });
      (n.tail || []).forEach((t) => block(t, d));
      if (!n.noClose) L.push({ key: n.id + '-c', id: n.id + ':c', d, tag: ct, toks: [{ k: 'close', tag: ct, z: n.id + ':c' }], fresh: n.freshClose });
      return;
    }
    if (n.kind === 'line') { L.push({ key: n.id, id: n.id, d, gap: true, toks: [{ k: 'node', node: n.node, z: n.id }] }); return; }
    const toks = [{ k: 'open', tag: n.kind, z: n.id + ':o' }];
    toks.push(n.node ? { k: 'node', node: n.node, z: n.id + ':t' } : { k: 'text', v: n.v, z: n.id + ':t' });
    toks.push({ k: 'close', tag: n.kind, z: n.id + ':c' });
    L.push({ key: n.id, id: n.id, d, tag: n.kind, toks });
  };
  nodes.forEach((n) => block(n, 0));
  return L;
}
// Места между строками кода: «сюда» после строки с id из afterIds.
function withSlots(lines, afterIds) {
  const out = [];
  lines.forEach((ln) => {
    out.push(ln);
    if (afterIds.indexOf(ln.id) >= 0) out.push({ key: 'slot-' + ln.id, id: 'slot:' + ln.id, d: ln.li ? ln.d : ln.d + 1, slot: true, after: ln.id, toks: [] });
  });
  return out;
}

// Страница: настоящие ul/ol — точки и номера рисует сам браузер.
function LsPage({ nodes, hl, fresh, flash, onItem, ledIds, canTap }) {
  const has = (arr, id) => !!arr && arr.indexOf(id) >= 0;
  const cls = (id) => (has(hl, id) ? ' is-hl' : '') + (has(fresh, id) ? ' is-new' : '') + (has(flash, id) ? ' is-flash' : '');
  const block = (n) => {
    if (n.kind === 'raw') return null;
    if (n.kind === 'li') return <div key={n.id} className={'ls-stray' + cls(n.id)}>{n.v}</div>;
    if (n.kind === 'list') {
      const Tg = (n.openTag || n.tag) === 'ol' ? 'ol' : 'ul';
      return (
        <Tg key={n.id + Tg} className={'ls-list ls-' + Tg + cls(n.id)}>
          {n.items.map((it) => (
            <li key={it.id} className={'ls-li' + cls(it.id)}>
              {onItem ? (
                <button type="button" className="ls-li-b" disabled={!canTap} onClick={() => onItem(it.id)}>
                  {it.v}<Led on={has(ledIds, it.id)} />
                </button>
              ) : (it.v || ' ')}
            </li>
          ))}
          {n.tail && n.tail.length ? <li className="ls-tail">{n.tail.map(block)}</li> : null}
        </Tg>
      );
    }
    if (n.kind === 'line') return null;
    const Tg = n.kind === 'h2' ? 'h2' : n.kind === 'h1' ? 'h1' : 'p';
    return <Tg key={n.id} className={'ls-' + Tg + cls(n.id)}>{n.v}</Tg>;
  };
  // Строки без тегов браузер склеивает в один текст.
  const out = [];
  let raw = [];
  const flush = () => { if (raw.length) { out.push(<p key={'raw' + out.length} className="ls-raw">{raw.join(' ')}</p>); raw = []; } };
  nodes.forEach((n) => { if (n.kind === 'raw') raw.push(n.v); else { flush(); out.push(block(n)); } });
  flush();
  return <div className="pg ls-pg">{out}</div>;
}

// Жалоба игрока — печатная карточка.
// done — жалоба закрыта: галочка, как отметка продвижения миссии.
function Msg({ from, text, done }) {
  const pick = usePick();
  const name = pick(PL[from]);
  return (
    <div className={'ls-msg' + (done ? ' is-done' : '')} aria-live="polite">
      <span className="ls-ava" aria-hidden="true">{name.charAt(0)}</span>
      <span className="ls-msg-b"><b>{name}</b> {pick(text)}</span>
      {done ? <span className="ls-msg-ok"><Icon name="check" size={14} /></span> : null}
    </div>
  );
}
// Строка задания: подсказка встаёт на её место.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
const stepHint = (hints, misses) => (misses > 0 && hints ? hints[Math.min(hints.length, misses) - 1] : null);
const okText = (s) => hasLetters(s) && !hasTags(s);
const listHtml = (title, tag, items) => buildHtml(title, [blk('h1', 'h1', title)])
  .replace('  </body>', '    <' + tag + '>\n' + items.map((x) => '      <li>' + escHtml(x) + '</li>').join('\n') + '\n    </' + tag + '>\n  </body>');
function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const own = store.get('s14');
  if (!own || !own.done) return null;
  return { type: 'html-page', topic: own.topic, title: own.title, list: own.list, items: own.items, html: listHtml(own.title, own.list, own.items) };
}
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const stepsOf = (pick) => G.steps.map((x, i) => li('st' + i, pick(x)));
const caveOf = (pick, n) => G.cave.slice(0, n).map((x, i) => li('cv' + i, pick(x)));

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. HOOK. Третий шаг в абзаце — потом тот же гайд списком с номерами.
function S1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const done = !!rec;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.ok, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [misses, setMisses] = useState(0);
  const [shake, wobble] = useShake();
  const tries = useRef(0);
  const led = useIdleLed(canTap && !done, misses);
  const tap = (i) => {
    if (!canTap || done) return;
    tries.current += 1;
    if (i === 2) {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's1', type: 'find', correct: true, firstTry: misses === 0, attempts: tries.current });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(i);
    sayNow(stepHint(c.hints, n), 'think');
  };
  const steps = stepsOf(pick);
  const P = c.para;
  const page = done ? (
    <LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.bridgeH) }, { kind: 'list', id: 'L', tag: 'ol', items: steps }]} hl={['st2']} fresh={['L']} />
  ) : (
    <div className="pg ls-pg">
      <p className="ls-para">
        {pick(P.pre)}
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <button type="button" className={'ls-phr' + (shake === i ? ' fx-no' : '')} disabled={!canTap} onClick={() => tap(i)}>
              {low(s.v)}{i === 0 ? <Led on={led} /> : null}
            </button>
            {i < 3 ? pick(P.sep[i]) : pick(P.end)}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="sardor" text={c.msg} done={done} />
      <Ask text={done ? c.askDone : c.ask} hint={done ? null : stepHint(c.hints, misses)} />
      <div className="ls-hook"><MiniBrowser title={pick(G.title)} page={page} cls="mb-tall" /></div>
    </Stage>
  );
}

// ── 2. MISSION.
const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;

// ── 3. SHOW. Пункт на странице ↔ строка li в коде.
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const [seen, setSeen] = useState(() => (rec ? ['cv0', 'cv1', 'cv2'] : []));
  const done = seen.length >= 3;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [cur, setCur] = useState(null);
  const led = useIdleLed(canTap && !done, seen.length);
  const items = caveOf(pick, 3);
  const nodes = [{ kind: 'h2', id: 'h', v: pick(G.caveH) }, { kind: 'list', id: 'L', tag: 'ul', items }];
  const tap = (id) => {
    if (!canTap) return;
    sfx('tap', true);
    setCur(id);
    const next = seen.indexOf(id) >= 0 ? seen : seen.concat(id);
    setSeen(next);
    if (next.length >= 3 && !done) { put({ done: true }); sayNow(c.done, 'cheer'); } else if (seen.length === 0) sayNow(c.each, 'point');
  };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} n={seen.length + '/3'} />
      <Work
        browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} onItem={tap} canTap={canTap} hl={cur ? [cur] : null}
          ledIds={led ? items.filter((x) => seen.indexOf(x.id) < 0).map((x) => x.id) : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src"
          lineProps={(ln) => (ln.id === cur ? { cls: 'is-cur' } : ln.li && seen.indexOf(ln.id) >= 0 ? { cls: 'is-seen' }
            : done && (ln.id === 'L:o' || ln.id === 'L:c') ? { cls: 'is-box' } : null)} />} />
    </Stage>
  );
}

// ── 4. LEVEL-1. Собрать строку <li>Верёвка</li> из деталей.
const PIECES = ['c', 't', 'u', 'o'];
const NEED = ['o', 't', 'c'];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!rec;
  const [round, setRound] = useState(solved ? 1 : 0);
  const [placed, setPlaced] = useState(solved ? NEED : []);
  const [extra, setExtra] = useState(solved && rec.extra);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.why : c.say, pose: solved ? 'rule' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), first = useRef(null);
  const led = useIdleLed(canTap && !solved, round * 10 + placed.length);
  const word = pick(round === 0 ? G.rope : G.map);
  const label = (k) => (k === 'o' ? '<li>' : k === 'c' ? '</li>' : k === 'u' ? '<ul>' : word);
  const tapPiece = (k) => {
    if (!canTap || solved || placed.indexOf(k) >= 0) return;
    tries.current += 1;
    const want = NEED[placed.length];
    if (k === want) {
      sfx('pop', true);
      const np = placed.concat(k);
      setPlaced(np); setMsg(null);
      if (np.length < 3) return;
      // Строка готова. После подробной помощи — ещё одна строка с новым словом.
      if (round === 0 && misses >= 3) {
        if (first.current === null) first.current = false;
        sayNow(joinL(c.praise, c.more), 'cheer');
        setTimeout(() => { setRound(1); setPlaced([]); setMisses(0); setExtra(true); }, reduceMotion() ? 600 : 1500);
        return;
      }
      put({ done: true, extra: round === 1 });
      log({ screenId: 's4', type: 'build-li', correct: true, firstTry: round === 0 && misses === 0, attempts: tries.current,
        followUp: round === 1 ? misses === 0 : null });
      sayNow(joinL(c.praise, c.why), 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(k);
    const m = k === 'u' ? c.err.ul : n >= 3 ? fillL(c.hints[2], { x: label(want) }) : n === 2 ? c.hints[1] : c.err.order;
    setMsg(m); sayNow(m, 'think');
  };
  const items = caveOf(pick, 3);
  const built = placed.length >= 3;
  const ropeItems = round === 1 ? [li('rp', pick(G.rope))] : [];
  const pageItems = items.concat(ropeItems, built ? [li('nw', word)] : []);
  const buildNode = (
    <span className="ls-build">
      {[0, 1, 2].map((i) => {
        const k = placed[i];
        if (!k) return <span key={i} className={'ls-ph' + (i === placed.length ? ' is-next' : '')} aria-hidden="true" />;
        return k === 't' ? <span key={i} className="tk-tx ls-in">{word}</span> : <span key={i} className="ls-in"><Tag tag="li" close={k === 'c'} /></span>;
      })}
    </span>
  );
  const codeItems = items.concat(ropeItems, [li('nw', '', { node: built ? null : buildNode, v: built ? word : '', bare: !built })]);
  const nodes = [{ kind: 'list', id: 'L', tag: 'ul', items: codeItems }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      {round === 0 ? <Msg from="madina" text={c.msg} done={placed.length >= 3} /> : null}
      <Ask text={c.ask} hint={solved ? null : msg} n={extra ? '2/2' : null} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.caveH) }, { kind: 'list', id: 'L', tag: 'ul', items: pageItems }]} fresh={built ? ['nw'] : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src" lineProps={(ln) => (ln.id === 'nw' ? { cls: built ? 'is-new' : 'is-cur' } : null)} />} />
      {!solved ? (
        <div className="ls-pieces" translate="no">
          {PIECES.map((k) => (
            <button key={k + round} type="button" disabled={!canTap || placed.indexOf(k) >= 0}
              className={'ls-piece' + (placed.indexOf(k) >= 0 ? ' is-used' : '') + (shake === k ? ' fx-no' : '')} onClick={() => tapPiece(k)}>
              {k === 't' ? <span className="tk-tx">{word}</span> : <Tag tag={k === 'u' ? 'ul' : 'li'} close={k === 'c'} />}
              <Led on={led && k === NEED[placed.length]} />
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// ── 5. LEVEL-2. Разрезать пункт на запятых: каждый зверь — свой li.
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const [cuts, setCuts] = useState(() => (rec ? [0, 1, 2] : []));
  const done = cuts.length >= 3;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [msg, setMsg] = useState(null);
  const tries = useRef(0), misses = useRef(0);
  const [lastCut, setLastCut] = useState(null);
  const led = useIdleLed(canTap && !done, cuts.length);
  const animals = G.animals.map((x) => pick(x));
  const cut = (i) => {
    if (!canTap || done || cuts.indexOf(i) >= 0) return;
    tries.current += 1;
    sfx('pop', true);
    const nc = cuts.concat(i).sort();
    setCuts(nc); setMsg(null); setLastCut(i);
    if (nc.length >= 3) {
      put({ done: true });
      log({ screenId: 's5', type: 'cut', correct: true, firstTry: misses.current === 0, attempts: tries.current });
      sayNow(c.done, 'cheer');
    }
  };
  const tapWord = () => { if (!canTap || done) return; misses.current += 1; sfx('soft', true); setMsg(c.word); sayNow(c.word, 'think'); };
  // Пункты по разрезам: зверь i начинает новый пункт, если перед ним разрез.
  const segs = [];
  animals.forEach((a, i) => { if (i === 0 || cuts.indexOf(i - 1) >= 0) segs.push([a]); else segs[segs.length - 1].push(a); });
  const items = segs.map((s, i) => li('a' + i, cap(s.join(', '))));
  const nodes = [{ kind: 'list', id: 'L', tag: 'ul', items }];
  const freshId = lastCut !== null ? 'a' + (segs.findIndex((s, k) => k > 0 && animals.indexOf(s[0]) === lastCut + 1)) : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={done ? null : msg} n={cuts.length + '/3'} />
      <div className="ls-strip" translate="no">
        {animals.map((a, i) => (
          <React.Fragment key={i}>
            <button type="button" className="ls-word" disabled={!canTap || done} onClick={tapWord}>{i === 0 ? cap(a) : a}</button>
            {i < 3 ? (
              cuts.indexOf(i) >= 0 ? <span className="ls-cut" aria-hidden="true" /> : (
                <button type="button" className="ls-comma" disabled={!canTap} onClick={() => cut(i)} aria-label=",">
                  ,<Led on={led} />
                </button>
              )
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.whoH) }].concat(nodes)} fresh={freshId ? [freshId] : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src" lineProps={(ln) => (ln.id === freshId ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 6. PREDICT. Строки без li браузер склеивает в одну.
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const [ans, setAns] = useState(rec ? rec.ans : null);
  const [wrapped, setWrapped] = useState(!!rec);
  const done = !!rec;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.wrap : c.say, pose: done ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done && wrapped, spoken);
  const [shown, setShown] = useState(!!rec);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const led = useIdleLed(canTap && !ans, 0);
  const pickAns = (k) => {
    if (!canTap || ans) return;
    const right = k === 'line';
    setAns(k); setShown(true);
    sfx(right ? 'ok' : 'soft', true);
    put({ ans: k });
    log({ screenId: 's6', type: 'predict', correct: right, firstTry: right, attempts: 1 });
    sayNow(joinL(right ? c.right : c.miss, c.wrap), right ? 'cheer' : 'explain');
    setTimeout(() => { if (alive.current) setWrapped(true); }, reduceMotion() ? 800 : 3200);
  };
  const animals = G.animals.map((x) => cap(pick(x)));
  const rawNodes = animals.map((a, i) => ({ kind: 'raw', id: 'r' + i, v: a }));
  const listNodes = [{ kind: 'list', id: 'L', tag: 'ul', items: animals.map((a, i) => li('r' + i, a)) }];
  const nodes = wrapped ? listNodes : rawNodes;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <Work
        browser={<MiniBrowser title={pick(G.title)} page={shown ? <LsPage nodes={[{ kind: 'h2', id: 'h', v: pick(G.whoH) }].concat(nodes)} fresh={wrapped ? ['L'] : ['h']} /> : (
          <div className="pg ls-pg"><h2 className="ls-h2">{pick(G.whoH)}</h2><p className="ls-q mono">?</p></div>)} />}
        code={<Src lines={lsLines([{ kind: 'h2', id: 'h', v: pick(G.whoH) }].concat(nodes))} className="ls-src"
          lineProps={(ln) => (wrapped && ln.li ? { cls: 'is-new' } : null)} />} />
      <div className="ls-opts" role="group">
        {['dots', 'col', 'line'].map((k) => (
          <button key={k} type="button" disabled={!canTap || !!ans}
            className={'ls-opt' + (ans === k ? (k === 'line' ? ' is-ok' : ' is-off') : '') + (ans && ans !== k && k === 'line' ? ' is-real' : '')}
            onClick={() => pickAns(k)}>
            <span className={'ls-art is-' + k} aria-hidden="true"><i /><i /><i /></span>
            <span>{pick(c.opts[k])}</span>
            <Led on={led} />
          </button>
        ))}
      </div>
    </Stage>
  );
}

// ── 7. SHOW. Пара ul → ol: вид списка задаёт открывающий тег.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const [open, setOpen] = useState(rec ? 'ol' : 'ul');
  const [close, setClose] = useState(rec ? 'ol' : 'ul');
  const done = open === 'ol' && close === 'ol';
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (open === 'ol' ? 1 : 0) + (close === 'ol' ? 2 : 0));
  const flip = (which) => {
    if (!canTap || done) return;
    sfx('tap', true);
    const no = which === 'o' ? 'ol' : open, nc = which === 'c' ? 'ol' : close;
    if (which === 'o') setOpen('ol'); else setClose('ol');
    if (no === 'ol' && nc === 'ol') { put({ done: true }); sayNow(c.done, 'cheer'); return; }
    sayNow(which === 'o' ? c.openFirst : c.closeFirst, 'explain');
  };
  const steps = stepsOf(pick);
  const nodes = [{ kind: 'h2', id: 'h', v: pick(G.bridgeH) }, { kind: 'list', id: 'L', tag: open, openTag: open, closeTag: close, items: steps }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Inspector rules={[{ id: 'pair', ok: open === close, text: c.rule }]} />
      <Ask text={c.ask} n={(open === 'ol' ? 1 : 0) + (close === 'ol' ? 1 : 0) + '/2'} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src"
          zone={(z) => (z === 'L:o' && open === 'ul' ? { tap: true, disabled: !canTap, led, cls: 'ls-flip' }
            : z === 'L:c' && close === 'ul' ? { tap: true, disabled: !canTap, led, cls: 'ls-flip' } : null)}
          onZone={(z) => flip(z === 'L:o' ? 'o' : 'c')} />} />
    </Stage>
  );
}

// ── 8. LEVEL-3. Вставить шаг в нужное место — номера пересчитает браузер.
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!rec;
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, misses);
  const steps = stepsOf(pick);
  const items = solved ? steps.slice(0, 2).concat([li('tie', pick(G.tie))], steps.slice(2)) : steps;
  const nodes = [{ kind: 'list', id: 'L', tag: 'ol', items }];
  // Три места: рано (после дерева), верно (после досок), поздно (после моста).
  const slotIds = ['st0', 'st1', 'st2'];
  const place = (after) => {
    if (!canTap || solved) return;
    tries.current += 1;
    if (after === 'st1') {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's8', type: 'insert', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(after);
    const early = after === 'st0';
    const m = n >= 2 ? stepHint(c.hints, n - 1) : (early ? c.early : c.late);
    setMsg(early ? c.early : c.late);
    sayNow(n >= 2 ? joinL(early ? c.early : c.late, m) : m, 'think');
  };
  const shownHint = solved ? null : (misses >= 2 ? stepHint(c.hints, misses - 1) : msg);
  const lines = solved ? lsLines(nodes) : withSlots(lsLines(nodes), slotIds);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="aziz" text={c.msg} done={solved} />
      <Ask text={c.ask} hint={shownHint} />
      {!solved ? <div className="ls-card-new mono" translate="no"><Tag tag="li" />{pick(G.tie)}<Tag tag="li" close /></div> : null}
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes}
        fresh={solved ? ['tie'] : null} flash={solved ? ['st2', 'st3'] : null} />} />}
        code={<Src lines={lines} className="ls-src" numbers={solved}
          lineProps={(ln) => (ln.slot ? {
            onTap: () => place(ln.after), disabled: !canTap, led: led && misses >= 3 && ln.after === 'st1',
            cls: 'ls-slot' + (shake === ln.after ? ' fx-no' : ''), content: <span className="ls-slot-l">{pick(UI.here)}</span>
          } : ln.id === 'tie' ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 9. LEVEL-4. ul или ol: промах — пункты перемешиваются на глазах.
const SHUF = [2, 0, 1];
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!rec;
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const R = c.rounds[r];
  const [got, setGot] = useState(solved);
  const [tried, setTried] = useState([]);
  const [shuf, setShuf] = useState(false);
  const [msg, setMsg] = useState(null);
  const [shake, wobble, alive] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !got, r * 10 + tried.length);
  const choose = (t) => {
    if (!canTap || got || tried.indexOf(t) >= 0) return;
    tries.current += 1;
    if (t === R.want) {
      sfx('ok', true); setGot(true); setMsg(null); setShuf(false);
      const ok = t === 'ol' ? c.okOl : c.okUl;
      if (r === c.rounds.length - 1) {
        put({ done: true });
        log({ screenId: 's9', type: 'choose-list', correct: true, firstTry: misses.current === 0, attempts: tries.current });
        sayNow(joinL(ok, c.done), 'cheer');
        return;
      }
      sayNow(ok, 'smile');
      setTimeout(() => { if (!alive.current) return; setR((v) => v + 1); setGot(false); setTried([]); }, reduceMotion() ? 900 : 1800);
      return;
    }
    misses.current += 1;
    sfx('soft', true); wobble(t);
    setTried((x) => x.concat(t)); setShuf(true);
    const m = R.want === 'ol' ? c.missOl : c.missUl;
    setMsg(m); sayNow(m, 'think');
  };
  const order = shuf && !got ? SHUF : [0, 1, 2];
  const Tg = got ? R.want : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} hint={got ? null : msg} n={(r + 1) + '/' + c.rounds.length} />
      <div className="ls-card" key={r}>
        <b className="ls-card-t">{pick(R.title)}</b>
        {Tg ? React.createElement(Tg, { className: 'ls-card-l ls-' + Tg }, R.items.map((x, i) => <li key={i}>{pick(x)}</li>)) : (
          <div className={'ls-card-l is-plain' + (shuf ? ' is-shuf' : '')}>
            {order.map((k) => <div key={k + (shuf ? 's' : '')} className="ls-card-i">{pick(R.items[k])}</div>)}
            {shuf ? <span className="ls-shuf-l">{pick(UI.shuffled)}</span> : null}
          </div>
        )}
      </div>
      <div className="ls-pick" translate="no">
        {['ul', 'ol'].map((t) => {
          const off = tried.indexOf(t) >= 0;
          return (
            <button key={t} type="button" disabled={!canTap || got || off} style={{ '--c': TAGC[t] }}
              className={'ls-pick-b mono' + (got && t === R.want ? ' is-on' : '') + (off ? ' is-off' : '') + (shake === t ? ' fx-no' : '')}
              onClick={() => choose(t)}>
              <span className={'ls-ic ls-ic-' + t} aria-hidden="true"><i /><i /><i /></span>{'<' + t + '>'}
              <Led on={!got && !off && (tried.length > 0 || led)} />
            </button>
          );
        })}
      </div>
    </Stage>
  );
}

// ── 10. CHECK-1. Где кончается список: нажать место для </ul>.
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!rec;
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, misses);
  const items = caveOf(pick, 2);
  const tail = [{ kind: 'h2', id: 'bh', v: pick(G.beastsH) }, { kind: 'p', id: 'bp', v: pick(G.beastsP) }];
  const head = { kind: 'h2', id: 'h', v: pick(G.caveH) };
  const nodes = solved ? [head, { kind: 'list', id: 'L', tag: 'ul', items, freshClose: true }].concat(tail)
    : [head, { kind: 'list', id: 'L', tag: 'ul', items, tail, noClose: true }];
  const place = (after) => {
    if (!canTap || solved) return;
    tries.current += 1;
    if (after === 'cv1') {
      sfx('ok', true); put({ done: true });
      log({ screenId: 's10', type: 'close-place', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(after);
    const inside = after === 'cv0';
    const base = inside ? c.inside : c.late;
    setMsg(base);
    const h = n >= 2 ? stepHint(c.hints, n - 1) : null;
    sayNow(h ? joinL(base, h) : base, 'think');
  };
  const shownHint = solved ? null : (misses >= 2 ? stepHint(c.hints, misses - 1) : msg);
  const lines = solved ? lsLines(nodes) : withSlots(lsLines(nodes), ['cv0', 'cv1', 'bh']);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="madina" text={c.msg} done={solved} />
      <Ask text={c.ask} hint={shownHint} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} fresh={solved ? ['bh', 'bp'] : null} />} />}
        code={<Src lines={lines} className="ls-src" numbers={solved}
          lineProps={(ln) => (ln.slot ? {
            onTap: () => place(ln.after), disabled: !canTap, led: led && misses >= 3 && ln.after === 'cv1',
            cls: 'ls-slot' + (shake === ln.after ? ' fx-no' : ''), content: <span className="ls-slot-l">{pick(UI.here)}</span>
          } : ln.fresh ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 11. LEVEL-5. Набрать </ol>: раздел «Советы» выходит из списка.
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!rec;
  const ty = useTagTyping({ max: 8 });
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.praise : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !solved && !ty.val, 0);
  const win = () => {
    sfx('win', true); setMsg(null); put({ done: true });
    log({ screenId: 's11', type: 'type-close', correct: true, firstTry: misses.current === 0, attempts: tries.current + 1 });
    sayNow(c.praise, 'cheer');
  };
  useEffect(() => { if (!solved && normTag(ty.val) === '</ol>') win(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const issue = tagTypingIssue(ty.val, 'ol', c.typeMsg);
    if (!issue) { win(); return; }
    misses.current += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
  };
  const steps = stepsOf(pick).slice(0, 3);
  const tips = { kind: 'h2', id: 'tp', v: pick(G.tipsH) };
  const input = (
    <span className={'ls-inp' + (led ? ' is-led' : '')}>
      <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check}
        placeholder={L3('</…>', '</…>', '</…>')} label={c.ask} max={8} cls="tk-input-tag" /><Led on={led} />
    </span>
  );
  const codeNodes = solved ? [{ kind: 'list', id: 'L', tag: 'ol', items: steps }, tips]
    : [{ kind: 'list', id: 'L', tag: 'ol', items: steps, noClose: true }, { kind: 'line', id: 'gap', node: input }, tips];
  const pageNodes = solved ? [{ kind: 'list', id: 'L', tag: 'ol', items: steps }, tips]
    : [{ kind: 'list', id: 'L', tag: 'ol', items: steps, tail: [tips] }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.hintSay} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="ls-typing" browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={pageNodes} fresh={solved ? ['tp'] : null} />} />}
        code={<Src lines={lsLines(codeNodes)} className="ls-src" lineProps={(ln) => (ln.gap ? { cls: 'is-gap' } : null)} />} />
      {!solved ? <KeyRow keys={['<', '/', 'o', 'u', 'l', '>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 12. CHECK-2. Жалобы игроков: найти строку, которая стоит не так.
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!rec;
  const [k, setK] = useState(solved ? 2 : 0);
  const [fixed, setFixed] = useState(solved);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble, alive] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !fixed && misses >= 3, k * 10 + misses);
  const cave = caveOf(pick, 3);
  const steps = stepsOf(pick).slice(0, 3);
  const potion = C.s9.rounds[0].items.map((x, i) => li('po' + i, pick(x)));
  const CASES = [
    { bad: [{ kind: 'list', id: 'L', tag: 'ul', items: cave.slice(0, 2) }, { kind: 'li', id: 'cv2', v: cave[2].v }],
      good: [{ kind: 'list', id: 'L', tag: 'ul', items: cave }], hit: (id) => id === 'cv2', fix: 'cv2' },
    { bad: [{ kind: 'list', id: 'L', tag: 'ol', items: steps.map((x, i) => li(x.id, (i + 1) + '. ' + x.v)) }],
      good: [{ kind: 'list', id: 'L', tag: 'ol', items: steps }], hit: (id) => /^st/.test(id), fix: 'L' },
    { bad: [{ kind: 'list', id: 'L', tag: 'ul', items: potion }], good: [{ kind: 'list', id: 'L', tag: 'ol', items: potion }],
      hit: (id) => id === 'L:o' || id === 'L:c', fix: 'L:o' }
  ];
  const cs = CASES[k];
  const cc = c.cases[k];
  const tapLine = (ln) => {
    if (!canTap || fixed) return;
    stat.current.tries += 1;
    if (cs.hit(ln.id)) {
      sfx('ok', true); setFixed(true); setMsg(null);
      if (k === 2) {
        put({ done: true });
        log({ screenId: 's12', type: 'detective', correct: true, firstTry: stat.current.misses === 0, attempts: stat.current.tries, hints: stat.current.misses });
        sayNow(joinL(cc.why, c.done), 'cheer');
        return;
      }
      sayNow(cc.why, 'smile');
      setTimeout(() => { if (!alive.current) return; setK((v) => v + 1); setFixed(false); setMisses(0); }, reduceMotion() ? 1200 : 2400);
      return;
    }
    stat.current.misses += 1;
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(ln.id);
    const h = stepHint(cc.hints, n);
    setMsg(h);
    sayNow(joinL(c.other, h), 'think');
  };
  const nodes = fixed ? cs.good : cs.bad;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="ls-case">
        <span className="ls-case-n mono">{pick(UI.complaint)} {k + 1}/3</span>
        <Msg from={cc.from} text={cc.msg} done={fixed} />
      </div>
      <Ask text={solved ? c.done : c.ask} hint={fixed ? null : msg} />
      <Work browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} flash={fixed ? ['L', 'cv2'] : null} />} />}
        code={<Src lines={lsLines(nodes)} className="ls-src"
          lineProps={(ln) => (fixed ? (ln.id === cs.fix || (cs.fix === 'L' && ln.li) ? { cls: 'is-new' } : null)
            : { onTap: () => tapLine(ln), disabled: !canTap, led: led && cs.hit(ln.id), cls: (shake === ln.id ? 'fx-no' : '') + (ln.stray ? ' is-stray' : '') })} />} />
    </Stage>
  );
}

// ── 13. TRANSFER. Написать строку <li>Азиз</li> целиком.
// Разбор строки: пробелы у уголков и регистр не важны.
const normLine = (s) => String(s || '').trim().replace(/<\s*\/\s*/g, '</').replace(/<\s+/g, '<').replace(/\s+>/g, '>');
function liIssue(raw, msgs) {
  const s = normLine(raw);
  const m = s.match(/^<li>(.*)<\/li>$/i);
  if (m && okText(m[1].trim())) return null;
  if (!/^<li>/i.test(s)) return /^<\/?[a-z]+>/i.test(s) && !/^<\/?li>/i.test(s) ? msgs.wrongTag : msgs.noOpen;
  const rest = s.slice(4);
  const textPart = rest.split('<')[0];
  if (!okText(textPart.trim())) return msgs.noText;
  const tail = rest.slice(textPart.length);
  if (!tail) return msgs.noClose;
  if (/^<li>/i.test(tail)) return msgs.needSlash;
  if (/^<\/[a-z]*>?$/i.test(tail) && !/^<\/li>$/i.test(tail)) return /^<\/li/i.test(tail) ? msgs.noClose : msgs.wrongTag;
  return msgs.noClose;
}
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const solved = !!rec;
  const ty = useTagTyping({ max: 30 });
  const [msg, setMsg] = useState(null);
  const [misses, setMisses] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.praise : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved && !ty.val, 0);
  const win = (text) => {
    sfx('win', true); setMsg(null); put({ done: true, v: text });
    log({ screenId: 's13', type: 'write-li', correct: true, firstTry: misses === 0, attempts: tries.current + 1, hints: misses });
    sayNow(c.praise, 'cheer');
  };
  useEffect(() => {
    if (solved) return;
    const m = normLine(ty.val).match(/^<li>(.*)<\/li>$/i);
    if (m && okText(m[1].trim())) win(m[1].trim());
  }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const issue = liIssue(ty.val, c.msgs);
    if (!issue) return;
    const n = misses + 1;
    setMisses(n); sfx('soft', true);
    const h = n >= 2 ? stepHint(c.hints, n - 1) : null;
    setMsg(h ? joinL(issue, h) : issue);
    sayNow(h ? joinL(issue, h) : issue, 'think');
  };
  // Превью растёт по мере набора: после <li> на странице появляется пункт.
  const s = normLine(ty.val);
  const live = solved ? rec.v : (/^<li>/i.test(s) ? s.slice(4).split('<')[0] : '');
  const top = C.s9.rounds[2].items.map((x, i) => li('tp' + i, pick(x)));
  const input = (
    <span className={'ls-inp ls-inp-wide' + (led ? ' is-led' : '')}>
      <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check}
        placeholder={L3('<li>…</li>', '<li>…</li>', '<li>…</li>')} label={c.ask} max={30} cls="tk-input-tag" /><Led on={led} />
    </span>
  );
  const codeNodes = [{ kind: 'h2', id: 'h', v: pick(G.topH) }, { kind: 'list', id: 'L', tag: 'ol',
    items: top.slice(0, 2), tail: solved ? [] : [{ kind: 'line', id: 'gap', node: input }] }];
  if (solved) codeNodes[1].items = top.slice(0, 2).concat([li('me', rec.v)]);
  const pageNodes = [{ kind: 'h2', id: 'h', v: pick(G.topH) }, { kind: 'list', id: 'L', tag: 'ol',
    items: top.slice(0, 2).concat(live ? [li('me', live)] : []) }];
  // Строка ввода стоит внутри ol — с отступом пункта.
  const lines = lsLines(codeNodes).map((ln) => (ln.gap ? Object.assign({}, ln, { d: 1 }) : ln));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Msg from="aziz" text={c.msg} done={solved} />
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="ls-typing" browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={pageNodes} fresh={live ? ['me'] : null} />} />}
        code={<Src lines={lines} className="ls-src" lineProps={(ln) => (ln.gap ? { cls: 'is-gap' } : ln.id === 'me' ? { cls: 'is-new' } : null)} />} />
      {!solved ? <KeyRow keys={['<', '/', 'l', 'i', '>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 14. RESULT. Свой раздел гайда: тема → ul или ol → «+ li» и три пункта.
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const [rec, put] = useRec('s14');
  const [topic, setTopic] = useState(rec ? rec.topic : null);
  const [list, setList] = useState(rec ? rec.list : null);
  const [items, setItems] = useState(rec ? rec.items : []);
  const [tried, setTried] = useState([]);
  const [msg, setMsg] = useState(null);
  const done = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const T0 = c.topics.find((t) => t.id === topic);
  const phase = !topic ? 'topic' : !list ? 'list' : done ? 'done' : 'items';
  const filled = items.filter(okText).length;
  const led = useIdleLed(canTap && !done, phase === 'items' ? 10 + items.length : phase === 'list' ? 1 : 0);
  const tries = useRef(0);
  const chooseList = (t) => {
    if (!canTap || list || tried.indexOf(t) >= 0) return;
    tries.current += 1;
    if (t === T0.want) { sfx('ok', true); setList(t); setMsg(null); sayNow(c.okList, 'smile'); return; }
    sfx('soft', true); setTried((x) => x.concat(t));
    const m = T0.want === 'ol' ? c.missOl : c.missUl;
    setMsg(m); sayNow(m, 'think');
  };
  const addLi = () => { if (!canTap || items.length >= 5) return; sfx('pop', true); setItems((xs) => xs.concat('')); };
  useEffect(() => {
    if (phase !== 'items' || filled < 3 || items.some(hasTags)) return undefined;
    const t = setTimeout(() => {
      const title = pick(T0.label);
      const own = items.filter(okText).map((x) => x.trim());
      put({ done: true, topic, list, items: own, title });
      log({ screenId: 's14', type: 'project', correct: true, firstTry: tries.current === 1, attempts: tries.current });
      sfx('win', true); sayNow(c.done, 'cheer');
    }, 1000);
    return () => clearTimeout(t);
  }, [items, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const setAt = (i, v) => setItems((xs) => xs.map((x, j) => (j === i ? v : x)));
  const title = T0 ? pick(T0.label) : '';
  const tag = list || 'ul';
  const pageNodes = T0 ? [{ kind: 'h2', id: 'h', v: title }].concat(list ? [{ kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, okText(x) ? x : '')) }] : []) : [];
  const codeNodes = T0 ? [{ kind: 'h2', id: 'h', v: title }].concat(list ? [{ kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, x, {
    node: phase === 'items' ? <span className="ls-inp"><InlineInput value={x} onChange={(v) => setAt(i, v)} label={c.askItems} max={30} placeholder={i === 0 ? T0.ex : L3('…', '…', '…')} /></span> : null })) }] : []) : [];
  const askText = phase === 'topic' ? c.askTopic : phase === 'list' ? c.askList : phase === 'items' ? c.askItems : c.done;
  const hintVoice = phase === 'items' ? c.hintItems : askText;
  const tagMsg = phase === 'items' && items.some(hasTags) ? c.noTags : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintVoice} nav={navOf(p, canGo)}>
      <Ask text={askText} hint={phase === 'list' ? msg : tagMsg} n={phase === 'items' ? Math.min(filled, 3) + '/3' : null} />
      {phase === 'topic' ? (
        <div className="ls-topics">
          {c.topics.map((t) => (
            <button key={t.id} type="button" className="ls-topic" disabled={!canTap} onClick={() => { sfx('tap', true); setTopic(t.id); }}>
              {pick(t.label)}<Led on={led} />
            </button>
          ))}
        </div>
      ) : (
        <>
          <Work cls="ls-typing" browser={<MiniBrowser title={pick(G.title)} page={<LsPage nodes={pageNodes} />} />}
            code={<Src lines={lsLines(codeNodes)} className="ls-src" />} />
          {phase === 'list' ? (
            <div className="ls-pick" translate="no">
              {['ul', 'ol'].map((t) => (
                <button key={t} type="button" disabled={!canTap || tried.indexOf(t) >= 0} style={{ '--c': TAGC[t] }}
                  className={'ls-pick-b mono' + (tried.indexOf(t) >= 0 ? ' is-off' : '')} onClick={() => chooseList(t)}>
                  <span className={'ls-ic ls-ic-' + t} aria-hidden="true"><i /><i /><i /></span>{'<' + t + '>'}
                  <Led on={led && (tried.length ? t === T0.want : true)} />
                </button>
              ))}
            </div>
          ) : null}
          {phase === 'items' ? (
            <div className="ls-add" translate="no">
              <button type="button" className={'ls-add-b' + (led && filled >= items.length ? ' is-led' : '')} disabled={!canTap || items.length >= 5}
                onClick={addLi}>{'+ li'}<Led on={led && filled >= items.length} /></button>
            </div>
          ) : null}
        </>
      )}
    </Stage>
  );
}

// ── 15. ACHIEVEMENT. Свой раздел и его код — сохранить.
function S15({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s15;
  const [rec, put] = useRec('s15');
  const saved = !!(rec && rec.saved);
  const own = store.get('s14');
  const title = own ? own.title : pick(G.caveH);
  const tag = own ? own.list : 'ul';
  const items = own ? own.items : G.cave.map((x) => pick(x));
  const [speaker, , spoken, sayNow] = useVoice([{ text: saved ? c.saved : c.say, pose: saved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(saved, spoken);
  const [view, setView] = useState('result');
  const led = useIdleLed(canTap && !saved, 0);
  const save = () => {
    if (!canTap || saved) return;
    sfx('win', true);
    store.set('artifact', { type: 'html-page', topic: own ? own.topic : null, title, list: tag, items, html: listHtml(title, tag, items) });
    put({ saved: true });
    sayNow(c.saved, 'cheer');
  };
  const nodes = [{ kind: 'h2', id: 'h', v: title }, { kind: 'list', id: 'L', tag, items: items.map((x, i) => li('i' + i, x)) }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="site-top">
        <span className="site-author">{pick(UI.author)}: <b>{p.name}</b></span>
        <div className="only-narrow">
          <SegToggle value={view} onChange={setView} options={[{ v: 'result', label: UI.result }, { v: 'code', label: UI.code }]} />
        </div>
      </div>
      <div className={'site view-' + view}>
        <div className="site-b"><MiniBrowser title={pick(G.title)} page={<LsPage nodes={nodes} />} cls="mb-site" /></div>
        <div className="site-c"><Src lines={lsLines(nodes)} className="src-site ls-src" /></div>
      </div>
      {saved ? (
        <div className="saved-stamp fx-ok"><Icon name="check" size={18} />{pick(UI.saved)}</div>
      ) : (
        <button type="button" className={'bigbtn' + (led ? ' is-led' : '')} disabled={!canTap} onClick={save}>
          <span className="bigbtn-in"><Icon name="save" size={20} />{pick(UI.save)}</span>
          <Led on={led} />
        </button>
      )}
    </Stage>
  );
}

// ── 16. PREVIEW. Итог и мостик к уроку о ссылках.
function S16({ p }) {
  const pick = usePick();
  const c = C.s16;
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'bye' }]);
  const canGo = useAdvanceGate(true, spoken);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.say}
      nav={<NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} />}>
      <div className="recap">
        <div className="ls-recap" aria-hidden="true" translate="no">
          <ul className="ls-list ls-ul"><li>ul</li><li>li</li></ul>
          <ol className="ls-list ls-ol"><li>ol</li><li>li</li></ol>
        </div>
        <div className="skills">
          {c.skills.map((sk, i) => (
            <div className="skill-row" key={i} style={{ animationDelay: (0.2 + i * 0.12) + 's' }}>
              <span className="skill-tick"><Icon name="check" size={14} /></span>
              {pick(sk)}
            </div>
          ))}
        </div>
        <div className="bye-next next-card">
          <span className="bye-next-ic"><Icon name="browser" size={26} /></span>
          <span className="bye-next-t">
            <span>{pick(UI.nextLesson)}</span>
            <b>{pick(c.next)}</b>
          </span>
          <span className="next-tags mono" translate="no">a · href</span>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'PREDICT', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's9', code: 'LEVEL-4', Comp: S9 },
  { id: 's10', code: 'CHECK-1', Comp: S10 }, { id: 's11', code: 'LEVEL-5', Comp: S11 }, { id: 's12', code: 'CHECK-2', Comp: S12 },
  { id: 's13', code: 'TRANSFER', Comp: S13 }, { id: 's14', code: 'RESULT', Comp: S14 }, { id: 's15', code: 'ACHIEVEMENT', Comp: S15 },
  { id: 's16', code: 'PREVIEW', Comp: S16 }
];
// «Повторить» стирает только этот экран; свой раздел (s14) и сохранённую
// страницу (artifact) повтор других экранов не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], s15: ['s15'] };

export default function HtmlLesson03v2({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store) })
  });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenList(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenList>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenList>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА: стили урока 2 (код, браузер, клавиши, проверка …) + свои (ls-…).
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
.lesson-root { --ind: 1.2em; --gut: 2.3em; --cv-fs: clamp(12px, 3.3vw, 15px); }

/* ══ КОД ═══════════════════════════════════════════════════════════
   Светлая панель: цвета тегов подобраны тёмными, чтобы читались на белом
   (контраст от 4.9:1). Слева — номера строк и цветные скобки вложенности. */
.cv { position: relative; width: 100%; min-width: 0; text-align: left;
  font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: var(--cv-fs); line-height: 1.5;
  background: ${T.paper}; color: ${T.ink}; border-radius: 14px; padding: 6px 8px 6px 0;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5),
    inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); }
.cv-line { position: relative; display: flex; align-items: center; min-height: 1.5em; width: 100%;
  padding-left: calc(var(--gut) + var(--d) * var(--ind)); padding-right: 4px; white-space: nowrap;
  border-radius: 6px; transition: opacity .3s, background .3s; }
.cv-line:has(.tk-btn) { min-height: 30px; }
.cv-n { position: absolute; left: 0; width: 1.9em; text-align: right; color: ${T.ink3}; font-size: .78em; }
.cv-bar { position: absolute; top: 0; bottom: 0; width: 3px; border-radius: 2px; background: var(--c); opacity: .5;
  left: calc(var(--gut) - .55em + var(--lv) * var(--ind)); }
.cv-bar.is-first { top: 50%; } .cv-bar.is-last { bottom: 50%; } .cv-bar.is-first.is-last { display: none; }
.cv-code { display: flex; align-items: center; flex-wrap: nowrap; min-width: 0; flex: 1 1 auto; gap: 0; }
.cv-line.is-out { opacity: .32; }
.cv-line.is-in { background: color-mix(in srgb, var(--hc) 8%, transparent); }
.cv-note { margin-left: 10px; font: 700 11px/1 'Manrope', sans-serif; color: ${T.ink3}; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .05em; }
.cv-line.is-new { animation: lineIn .55s cubic-bezier(.34,1.3,.5,1) both; }
@keyframes lineIn { from { transform: translateX(-12px); background: rgba(255,79,40,.13); } to { transform: none; } }
.cv-reveal .cv-line { animation: lineIn .45s cubic-bezier(.34,1.3,.5,1) both; }
.cv-reveal .cv-line:nth-child(2) { animation-delay: .07s; } .cv-reveal .cv-line:nth-child(3) { animation-delay: .14s; }
.cv-reveal .cv-line:nth-child(4) { animation-delay: .21s; } .cv-reveal .cv-line:nth-child(5) { animation-delay: .28s; }
.cv-reveal .cv-line:nth-child(6) { animation-delay: .35s; } .cv-reveal .cv-line:nth-child(7) { animation-delay: .42s; }
.cv-reveal .cv-line:nth-child(8) { animation-delay: .49s; } .cv-reveal .cv-line:nth-child(9) { animation-delay: .56s; }

.tk { display: inline-flex; align-items: center; min-width: 0; border-radius: 6px; }
.tk-tag { color: var(--c); font-weight: 700; white-space: nowrap; }
.tk-br { opacity: .72; }
.tk-sl { display: inline-block; border-radius: 4px; }
.tk-doc { color: ${T.ink2}; }
.tk-text { color: ${T.ink}; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
  font-family: 'Manrope', sans-serif; font-size: 1.02em; padding: 0 2px; border-radius: 5px; }
.tk-slot { color: ${T.ink3}; }
.tk.is-changed .tk-text, .tk-btn.is-changed .tk-text { background: ${T.hintSoft}; }
.tk.is-pair { background: color-mix(in srgb, var(--c) 15%, #fff); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 45%, #fff); }
.cv-line.is-title-pair { background: color-mix(in srgb, ${'#9F4471'} 7%, transparent); }

/* Нажимаемый участок кода: подчёркнут цветом интерфейса — «сюда можно нажать». */
.tk-btn { position: relative; font: inherit; color: inherit; border: none; cursor: pointer; margin: 1px 1px;
  padding: 3px 5px; min-height: 26px; border-radius: 8px; background: rgba(255,79,40,.04);
  box-shadow: inset 0 -2px 0 rgba(255,79,40,.25);
  transition: background .2s, box-shadow .2s, transform .12s; }
.tk-btn:hover:not(:disabled) { background: ${T.uiSoft}; }
.tk-btn:active:not(:disabled) { transform: scale(.95); }
.tk-btn:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 1px; }
.tk-btn.is-sel { background: color-mix(in srgb, var(--c) 18%, #fff); box-shadow: 0 0 0 2.5px var(--c); }
.tk-btn:disabled { cursor: default; }
/* Светодиод «нажми сюда» на коротком теге — в углу над токеном, не на тексте. */
.tk-btn .led > i { top: -3px; right: -3px; width: 7px; height: 7px; }
.chip-opt .led > i, .pool-chip .led > i, .nest-piece .led > i { top: 4px; right: 4px; width: 7px; height: 7px; }

/* Поле прямо в строке кода. 16 px — меньше нельзя: iOS увеличит страницу. */
.tk-input { flex: 1 1 0; min-width: 4.5ch; width: 100%; font: 600 16px/1.25 'Manrope', sans-serif; color: ${T.ink};
  border: none; border-radius: 7px 7px 3px 3px; padding: 3px 7px; margin: 2px 2px; outline: none;
  background: ${T.uiSoft}; box-shadow: inset 0 -2px 0 ${T.ui}; }
.tk-input:focus { background: #fff; box-shadow: inset 0 0 0 2px ${T.ui}; }
.tk-input::placeholder { color: ${T.ink3}; font-weight: 500; }
.tk-input-tag { font-family: 'JetBrains Mono', ui-monospace, monospace; flex: 0 1 12ch; }
.tk-input.is-led-in { animation: ledFrame 1.15s ease-in-out infinite; }

.tt-caret { display: inline-block; width: 2px; height: 1em; margin-left: 1px; vertical-align: -.14em;
  background: currentColor; animation: ttBlink .8s steps(2) infinite; }
@keyframes ttBlink { 50% { opacity: 0; } }

/* ══ МИНИ-БРАУЗЕР ════════════════════════════════════════════════
   Рамка — интерфейс урока; страница внутри — HTML без CSS, как его рисует
   браузер по умолчанию: шрифт с засечками, 16 px, чёрный на белом. */
.mb { position: relative; width: 100%; background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 14px 30px -18px rgba(${T.shadowBase},0.6),
    inset 0 0 0 1.5px rgba(${T.shadowBase},0.10);
  transition: box-shadow .3s; }
.mb-top { position: relative; display: flex; align-items: flex-end; gap: 8px; height: clamp(30px, 4.6dvh, 40px);
  padding: 0 10px; background: ${T.uiBar}; transition: background .3s, box-shadow .3s; }
/* ВИД CHROME В WINDOWS (заказчик, 15.10.2026): вкладка от левого края с
   крестиком, за ней «+», справа кнопки окна «— ▢ ✕» (у macOS — три точки
   слева). Значки нарисованы линиями CSS, без картинок. */
.mb-x { position: relative; width: 14px; height: 14px; flex: 0 0 auto; margin-left: 2px; border-radius: 50%; color: ${T.ink3}; }
.mb-x::before, .mb-x::after, .mb-new::before, .mb-new::after, .mb-w-x::before, .mb-w-x::after {
  content: ''; position: absolute; left: 50%; top: 50%; height: 1.5px; border-radius: 1px; background: currentColor; }
.mb-x::before, .mb-x::after { width: 8px; margin: -0.75px 0 0 -4px; }
.mb-x::before, .mb-w-x::before { transform: rotate(45deg); }
.mb-x::after, .mb-w-x::after { transform: rotate(-45deg); }
.mb-new { position: relative; align-self: center; width: 20px; height: 20px; flex: 0 0 auto; color: ${T.ink2}; }
.mb-new::before, .mb-new::after { width: 10px; margin: -0.75px 0 0 -5px; }
.mb-new::after { transform: rotate(90deg); }
.mb-win { display: flex; align-self: stretch; margin: 0 -10px 0 auto; flex: 0 0 auto; color: ${T.ink2}; }
.mb-label + .mb-new + .mb-win { margin-left: 4px; }
.mb-win i { position: relative; width: 26px; }
.mb-w-min::before { content: ''; position: absolute; left: 50%; top: 50%; width: 9px; height: 1.5px; margin-left: -4.5px; background: currentColor; }
.mb-w-max::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px 0 0 -4px;
  border: 1.5px solid currentColor; border-radius: 1px; box-sizing: border-box; }
.mb-w-x::before, .mb-w-x::after { width: 11px; margin: -0.75px 0 0 -5.5px; }
@media (max-width: 380px) { .mb-win i { width: 22px; } .mb-new { width: 16px; } }
.mb-tab { position: relative; display: flex; align-items: center; gap: 6px; max-width: 64%; min-width: 0; height: 78%;
  padding: 0 12px; background: #fff; border-radius: 10px 10px 0 0;
  font: 700 clamp(12px, 3.2vw, 14px)/1 'Manrope', sans-serif; color: ${T.ink}; transition: box-shadow .3s; }
.mb-fav { width: 12px; height: 12px; border-radius: 3px; background: ${T.ui}; flex: 0 0 auto; }
.mb-tab-t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.mb-tab-t.is-file { color: ${T.ink3}; font-weight: 600; font-style: italic; }
.mb-page { position: relative; min-height: clamp(52px, 10dvh, 150px); padding: 8px 10px; background: #fff; transition: box-shadow .3s, background .3s; }
.mb-doc { font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.25; color: #000;
  word-break: break-word; text-align: left; }
.mb-compact .mb-page { min-height: clamp(40px, 7dvh, 96px); }
.mb-tab.is-flash { animation: tabFlash 1s ease-out; }
.mb-page.is-flash { animation: pageFlash 1s ease-out; }
@keyframes tabFlash { 0% { background: #fff; } 25% { background: #FEEBF3; } 100% { background: #fff; } }
@keyframes pageFlash { 0% { background: #fff; } 25% { background: #E4F4FF; } 100% { background: #fff; } }
.mb-hl-html { box-shadow: 0 0 0 3px #586A83, 0 14px 30px -18px rgba(${T.shadowBase},0.6); }
.mb-hl-head .mb-top { background: #F2EFFF; box-shadow: inset 0 0 0 2.5px #6F57AB; }
.mb-hl-title .mb-tab { box-shadow: inset 0 0 0 2.5px #9F4471; }
.mb-hl-body .mb-page { box-shadow: inset 0 0 0 2.5px #1171A0; background: #EEF7FF; }
.mb-pin { position: absolute; z-index: 2; padding: 4px 8px; border-radius: 99px; background: ${T.ink}; color: #fff;
  font: 800 10.5px/1 'Manrope', sans-serif; letter-spacing: .05em; text-transform: uppercase; white-space: nowrap;
  font-style: normal; }
.mb-pin-tab { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.mb-pin-page { right: 8px; bottom: 8px; background: rgba(14,14,16,.78); }
.mb-info { position: absolute; z-index: 2; left: 10px; top: calc(clamp(30px, 4.6dvh, 40px) + 8px); display: flex; align-items: center;
  gap: 6px; padding: 5px 9px; border-radius: 9px; background: #F2EFFF; color: #6F57AB;
  font: 800 12px/1.2 'Manrope', sans-serif; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},.6); }

/* ══ РАБОЧАЯ ОБЛАСТЬ: браузер + код ═══════════════════════════════ */
.work { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(8px, 1.4dvh, 14px); width: 100%; }
@media (min-width: 720px) { .work { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: center; gap: 22px; } }
.wire { position: absolute; left: 0; top: 0; z-index: 6; pointer-events: none; overflow: visible; }
.wire-path { fill: none; stroke: var(--c); stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 100;
  stroke-dashoffset: 100; animation: wireDraw .7s ease-out forwards, wireRest .8s ease 1.8s forwards; }
.wire-dot { fill: var(--c); }
.wire-end { animation: wireEnd .7s ease-out; transform-box: fill-box; transform-origin: center; }
@keyframes wireDraw { to { stroke-dashoffset: 0; } }
@keyframes wireRest { to { opacity: .35; } }
@keyframes wireEnd { 0% { transform: scale(.2); } 60% { transform: scale(1.5); } 100% { transform: scale(1); } }

/* ══ РУКА-ПОДСКАЗКА ════════════════════════════════════════════ */
.demo-hand { position: absolute; left: 0; top: 0; z-index: 30; margin: -4px 0 0 -16px; pointer-events: none;
  transition: transform .7s cubic-bezier(.4,0,.2,1); filter: drop-shadow(0 4px 6px rgba(0,0,0,.25)); }
.demo-hand svg { display: block; transition: transform .18s; transform-origin: 40% 10%; }
.demo-hand.is-tap svg { transform: scale(.86) translateY(3px); }
.dh-ring { position: absolute; left: 16px; top: 4px; }
.demo-hand.is-tap .dh-ring::after { content: ''; position: absolute; left: -17px; top: -17px; width: 34px; height: 34px;
  border-radius: 50%; border: 3px solid ${T.ui}; animation: dhRing .6s ease-out both; }
@keyframes dhRing { from { transform: scale(.3); } to { transform: scale(1.3); border-color: rgba(255,79,40,.0); } }

/* ══ ОБЩЕЕ ═════════════════════════════════════════════════════ */
.note-one { padding: 9px 13px; }
.note-one .note-body { font-size: clamp(15px, 2vw, 18px); line-height: 1.35; }
.note-one .note-lbl { margin-bottom: 3px; }
.only-narrow { display: flex; justify-content: center; }
@media (min-width: 720px) { .only-narrow { display: none !important; } }
.seg2 { display: inline-flex; align-self: center; padding: 3px; border-radius: 99px; background: rgba(${T.shadowBase},0.08); }
.seg2-b { min-height: 38px; padding: 0 16px; border: none; border-radius: 99px; background: transparent; cursor: pointer;
  font: 700 14px 'Manrope', sans-serif; color: ${T.ink2}; transition: background .2s, color .2s; }
.seg2-b.is-on { background: ${T.paper}; color: ${T.uiDk}; box-shadow: 0 1px 4px rgba(${T.shadowBase},0.18); }
.seg2-b:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.key-b { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-width: 46px; min-height: 44px; padding: 0 12px; border: none; border-radius: 12px; cursor: pointer;
  background: ${T.paper}; color: ${T.ink}; font: 800 20px/1 'JetBrains Mono', ui-monospace, monospace;
  box-shadow: 0 2px 6px rgba(80,65,45,.1), inset 0 0 0 2px ${T.uiSoft}; transition: transform .12s; }
.key-b:active:not(:disabled) { transform: scale(.94); }
.key-b:disabled { opacity: .5; cursor: default; }
.key-go { font: 800 15px/1 'Manrope', sans-serif; padding: 0 18px; color: ${T.uiDk}; }
.key-go.is-ready { background: ${T.ui}; color: #fff; box-shadow: 0 3px 0 ${T.uiDk}; }

/* ══ 1. КРЮЧОК ═════════════════════════════════════════════════ */
.hook { position: relative; width: 100%; max-width: 520px; align-self: center; border-radius: 16px; cursor: default; }
.hook .mb { pointer-events: none; }
.hook.is-live { cursor: pointer; animation: hookBob 2.6s ease-in-out infinite; }
.hook.is-live .mb { box-shadow: 0 0 0 3px ${T.uiSoft}, 0 18px 34px -16px rgba(255,79,40,.33); }
@keyframes hookBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.hook-play { position: absolute; left: 50%; top: 62%; transform: translate(-50%, -50%); width: 58px; height: 58px;
  border-radius: 50%; display: grid; place-items: center; background: ${T.ui}; color: #fff;
  box-shadow: 0 4px 0 ${T.uiDk}, 0 14px 26px -10px rgba(255,79,40,.45); }
.hook .mb-page { min-height: clamp(70px, 16dvh, 190px); }
.hook .mb-doc { font-size: 18px; }
.hook:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 4px; }

/* ══ 3. ЧТО ТАКОЕ ТЕГ ══════════════════════════════════════════ */
.s3 { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 1.8dvh, 16px); width: 100%; }
.s3 .mb { max-width: 420px; }
.tp { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; }
.tp-line { display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch; gap: 6px; padding: 10px;
  background: ${T.paper}; border-radius: 18px; font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: clamp(17px, 4.6vw, 26px); box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5); }
.tp-part { position: relative; display: inline-flex; align-items: center; min-height: 50px; padding: 6px 10px;
  border: none; border-radius: 12px; background: ${T.bg}; font: inherit; color: ${T.ink};
  transition: background .3s, box-shadow .3s, transform .2s, opacity .3s; }
button.tp-part { cursor: pointer; }
button.tp-part:hover:not(:disabled) { background: ${T.uiSoft}; }
.tp-content { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: .82em; }
.tp-part.is-lit { background: #E4F4FF; box-shadow: 0 0 0 3px #1171A0; transform: translateY(-3px); }
.tp-part.is-slash .tk-sl { background: ${T.hint}; color: #fff; padding: 0 2px; }
.tp-part.is-found { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}; }
.tp-line.is-ghost .tp-open, .tp-line.is-ghost .tp-close { opacity: .3; }
.tp-labels { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.tp-lbl { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 99px;
  background: rgba(${T.shadowBase},0.07); color: ${T.ink2}; font: 700 12.5px/1.1 'Manrope', sans-serif; }
.tp-lbl b { font-size: 11px; }
.tp-lbl.is-on { background: ${T.uiSoft}; color: ${T.uiDk}; box-shadow: inset 0 0 0 1.5px ${T.ui}; }
.tp-lbl.is-done { background: ${T.successSoft}; color: ${T.success}; }

/* ══ 4. СТРУКТУРА ══════════════════════════════════════════════ */
.s4 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 10px; align-items: center; width: 100%; }
.nb { width: 100%; }
.nb-wait { min-height: 96px; border-radius: 14px; border: 2px dashed rgba(${T.shadowBase},0.14); }
.nb-box { position: relative; border-radius: 14px; padding: 24px 8px 8px; transform-origin: top center;
  background: color-mix(in srgb, var(--c) 8%, #fff); box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c) 50%, #fff);
  animation: boxIn .55s cubic-bezier(.34,1.4,.5,1) both; transition: box-shadow .25s, transform .2s; }
@keyframes boxIn { from { transform: scale(.55); } to { transform: none; } }
.nb-in { display: flex; flex-direction: column; gap: 8px; }
.nb-head, .nb-body { min-height: 50px; }
.nb-lbl { position: absolute; top: 5px; left: 9px; display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 800; color: var(--c); }
.nb-sub { display: block; margin-top: 2px; font: 600 11.5px/1.2 'Manrope', sans-serif; color: ${T.ink2}; }
.nb-box.is-tap { cursor: pointer; }
.nb-box.is-tap:hover { transform: translateY(-1px); }
.nb-box.is-sel { box-shadow: inset 0 0 0 3px var(--c), 0 0 0 4px color-mix(in srgb, var(--c) 22%, transparent); }
.nb-box:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.cv-s4 { align-self: center; }
@media (max-width: 560px) { .cv-s4 .cv-note { display: none; } .cv-s4 { --gut: 1.9em; } }

/* ══ 5–6. ВЫБОР И СВОЁ ПРИВЕТСТВИЕ ════════════════════════════ */
.choice-row, .word-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.chip-opt, .word-b { position: relative; min-height: 44px; padding: 0 16px; border: none; border-radius: 14px; cursor: pointer;
  background: ${T.paper}; color: ${T.ink}; font: 700 15px/1.15 'Manrope', sans-serif;
  box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2px ${T.uiSoft}; transition: box-shadow .2s, transform .12s; }
.chip-opt:hover:not(:disabled), .word-b:hover:not(:disabled) { box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2px ${T.ui}; }
.chip-opt:active:not(:disabled), .word-b:active:not(:disabled) { transform: scale(.95); }
.chip-opt.is-on { background: #FEEBF3; box-shadow: inset 0 0 0 2.5px #9F4471; }
/* Три варианта названия — одной строкой из трёх колонок: в два ряда они
   выталкивали третий вариант за нижний край телефона. */
.choice-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; max-width: 560px; align-self: center; }
.choice-row .chip-opt { padding: 4px 8px; font-size: 14px; }
@media (max-height: 700px) {
  /* Без голоса реплика печатается в облаке. Облако невысокое, длинная
     реплика листается внутри него — иначе задание уехало бы под кнопки.
     (Размер Коди здесь больше не уменьшается: с 17.10.2026 он — кружок с
     головой, и канон уже держит его маленьким.) */
  .lesson-root .speaker-bubble { max-height: 92px; font-size: 15px; line-height: 1.35; }
  .own-line { display: none; }
  .nest .nest-tray-h { display: none; }
  .nest .nest-slot { min-height: 40px; }
  .nest .nest-inner .nest-slot { min-height: 36px; }
  .nest .nest-piece { min-height: 44px; }
}
/* Невысокий телефон: в проверке видно только правило, над которым работаем;
   выполненные правила возвращаются, когда структура готова целиком. */
@media (max-width: 719px) and (max-height: 760px) {
  .insp .insp-h { display: none; }
  .insp:not(.insp-all) .insp-r.is-ok { display: none; }
  /* Подсказка на экране — строка задания уступает ей место. */
  .ask-sub { display: none; }
  .cv.cv-build .cv-line { min-height: 21px; }
  .cv.cv-build .cv-slot { min-height: 17px; }
  .pool .nest-tray-h { display: none; }
  .pool-chips .pool-chip { min-height: 34px; padding: 0 7px; font-size: 12px; }
  .pool .pool-chips { gap: 5px; }
  .lesson-root .s12 { gap: 7px; }
  .lesson-root .s12.is-fill .mb-page { min-height: 30px; padding-block: 5px; }
  .word-row .word-b { min-height: 36px; padding: 0 10px; font-size: 13.5px; }
}
.word-row { gap: 6px; }
.word-b { min-height: 40px; padding: 0 12px; font-size: 14.5px; }
.word-erase { display: inline-flex; align-items: center; color: ${T.ink2}; }
.word-ok { color: ${T.uiDk}; }
.word-ok.is-ready { background: ${T.ui}; color: #fff; box-shadow: 0 3px 0 ${T.uiDk}; }
.chip-opt:disabled, .word-b:disabled { cursor: default; }

/* ══ 7. ЦЕЛЬ ════════════════════════════════════════════════════ */
.goal { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 14px; background: ${T.paper};
  box-shadow: inset 3px 0 0 ${T.ui}, 0 2px 8px rgba(80,65,45,.07); animation: noteIn .25s ease-out both; text-align: left; }
.goal-ic { flex: 0 0 auto; width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center;
  background: ${T.uiSoft}; color: ${T.uiDk}; }
.goal-t { display: flex; flex-direction: column; min-width: 0; }
.goal-l { font: 800 11px/1.2 'Manrope', sans-serif; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
.goal-t b { font-size: clamp(14.5px, 2.2vw, 18px); line-height: 1.3; }
.goal-n { margin-left: auto; flex: 0 0 auto; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
.goal.is-done { box-shadow: inset 3px 0 0 ${T.success}, 0 2px 8px rgba(80,65,45,.07); }
.goal.is-done .goal-ic { background: ${T.successSoft}; color: ${T.success}; }
@media (max-width: 719px) {
  .goal { padding: 7px 11px; gap: 8px; }
  .goal-ic { display: none; }
  .goal-t { display: block; }
  .goal-l { display: inline; margin-right: 6px; }
  .goal-t b { font-size: 15px; }
}

/* Пока видна подсказка, у браузера остаётся полоска вкладки: после неверной
   попытки страница не менялась, а подсказке нужно место на телефоне. */
@media (max-width: 719px) {
  .work.has-note .work-b .mb { display: none; }
  .note-wide { display: none; }
}
@media (min-width: 720px) { .note-narrow { display: none; } }

/* ══ 8. СБОРКА ══════════════════════════════════════════════════ */
.nest { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; width: 100%; }
@media (min-width: 720px) { .nest { grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); align-items: center; gap: 22px; } }
.nest-html { border-radius: 16px; padding: 6px 10px; text-align: left;
  background: color-mix(in srgb, var(--c) 6%, #fff); box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c) 45%, #fff); }
.nest-tag { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: var(--cv-fs); padding: 2px 0; }
.nest-in { display: flex; flex-direction: column; gap: 8px; padding: 4px 0 4px 14px; }
.nest-slot { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
  min-height: 46px; border-radius: 12px; border: 2px dashed rgba(${T.shadowBase},0.26); background: rgba(255,255,255,.75);
  font: 700 14px 'Manrope', sans-serif; color: ${T.ink3}; cursor: pointer; transition: border-color .2s, background .2s; }
.nest-slot.is-open { border-color: ${T.ui}; color: ${T.uiDk}; background: ${T.uiSoft}; }
.nest-plus { font-size: 20px; line-height: 1; }
.nest-block { position: relative; border-radius: 12px; padding: 3px 8px; animation: boxIn .45s cubic-bezier(.34,1.4,.5,1) both;
  background: color-mix(in srgb, var(--c) 9%, #fff); box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c) 52%, #fff); }
.nest-inner { padding: 3px 0 3px 14px; min-width: 0; }
.nest-inner .nest-slot { min-height: 40px; }
.nest-title { display: flex; align-items: center; min-width: 0; padding: 5px 8px; border-radius: 9px;
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: var(--cv-fs);
  background: color-mix(in srgb, var(--c) 12%, #fff); }
.nest-txt { min-width: 0; padding: 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font: 600 1em 'Manrope', sans-serif; font-size: calc(var(--cv-fs) * 1.02); color: ${T.ink}; }
.nest-dots { color: ${T.ink3}; padding: 0 2px; }
.nest-body.is-target { cursor: pointer; box-shadow: inset 0 0 0 2px var(--c), 0 0 0 4px rgba(255,79,40,.14); }
.nest-tray { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.nest-tray-h { font: 800 11.5px/1 'Manrope', sans-serif; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
.nest-pieces { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.nest-piece, .nest-ghost { position: relative; display: inline-flex; align-items: center; min-height: 48px; padding: 0 12px;
  border: none; border-radius: 14px; background: ${T.paper}; font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: var(--cv-fs); color: ${T.ink};
  box-shadow: 0 2px 8px rgba(80,65,45,.1), inset 0 0 0 2px color-mix(in srgb, var(--c) 40%, #fff); }
.nest-piece { cursor: grab; touch-action: none; transition: transform .15s, box-shadow .2s; }
.nest-piece.is-sel { transform: translateY(-3px); box-shadow: 0 0 0 3px var(--c), 0 10px 20px -10px var(--c); }
.nest-ghost { position: fixed; z-index: 90; pointer-events: none; transform: translate(-50%, -70%) rotate(-3deg);
  box-shadow: 0 16px 30px -12px rgba(${T.shadowBase},.7), inset 0 0 0 2px var(--c); }
.nest-code { min-width: 0; }
@media (max-width: 719px) {
  .nest.is-done.view-code .nest-scheme { display: none; }
  .nest.is-done.view-scheme .nest-code { display: none; }
}

/* ══ 9. ПАРЫ ════════════════════════════════════════════════════ */
.pairs-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.pair-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 99px;
  font: 700 12.5px/1 'JetBrains Mono', ui-monospace, monospace; color: var(--c);
  background: color-mix(in srgb, var(--c) 8%, #fff); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 40%, #fff); }
/* Найденная пара — мягкая плашка в цвет тега, а не сплошная тёмная заливка. */
.pair-chip.is-done { background: color-mix(in srgb, var(--c) 14%, #fff); color: var(--c);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 60%, #fff); }
.pairs { position: relative; width: 100%; }

/* ══ 10. ПОЧИНКА ════════════════════════════════════════════════ */
.insp { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 5px 6px; }
.insp-h { display: inline-flex; align-items: center; gap: 5px; width: 100%; justify-content: center;
  font: 800 11px/1 'Manrope', sans-serif; letter-spacing: .07em; text-transform: uppercase; color: ${T.ink2}; }
.insp-r { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px 4px 5px; border-radius: 99px;
  background: ${T.paper}; color: ${T.ink2}; font: 700 12.5px/1.15 'Manrope', sans-serif;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.12); transition: background .3s, color .3s; }
.insp-ic { width: 18px; height: 18px; flex: 0 0 auto; border-radius: 50%; display: grid; place-items: center;
  box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.25); }
.insp-r.is-ok { color: ${T.success}; }
.insp-r.is-ok .insp-ic { background: ${T.success}; color: #fff; box-shadow: none; }
.insp-r.is-now { background: ${T.hintSoft}; color: #7A5600; box-shadow: inset 0 0 0 1.5px ${T.hint}; }
.cv-tap { border: none; background: transparent; font: inherit; color: inherit; text-align: left; cursor: pointer; min-height: 28px; }
.cv-tap:hover:not(:disabled) { background: ${T.uiSoft}; }
.cv-tap:focus-visible { outline: 3px solid ${T.ui}; outline-offset: -2px; }
.cv-tap:disabled { cursor: default; }
.cv-fix .cv-line.is-sel { background: #FEEBF3; box-shadow: inset 3px 0 0 #9F4471; }
.cv-fix.is-picking .cv-line.is-drop { box-shadow: inset 0 -2px 0 rgba(255,79,40,.29); }
.cv-line.is-typing { background: ${T.uiSoft}; min-height: 34px; }
.keys { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }

/* ══ 11. ПЕСОЧНИЦА ═════════════════════════════════════════════ */
.sand-b { position: relative; }
.sand-was { position: absolute; z-index: 3; top: 6px; right: 8px; padding: 4px 9px; border-radius: 99px;
  background: ${T.ink}; color: #fff; font: 800 11px/1 'Manrope', sans-serif; letter-spacing: .05em; text-transform: uppercase; }
.sand-tools { display: flex; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 8px; }
.sand-tools .btn-soft { padding: 0 14px; white-space: nowrap; }
.sand-tools .seg2-b { padding: 0 13px; }

/* ══ 12. САМ ════════════════════════════════════════════════════ */
.s12 { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.cv-slot { display: inline-flex; align-items: center; width: 100%; min-height: 22px; padding-left: 8px; border-radius: 7px;
  border: 1.5px dashed rgba(${T.shadowBase},0.26); color: ${T.ink3}; font-size: 11px; }
.cv-line.is-next .cv-slot { border-color: ${T.ui}; background: ${T.uiSoft}; color: ${T.uiDk}; }
.cv-line.is-bad { background: ${T.hintSoft}; box-shadow: inset 3px 0 0 ${T.hint}; }
.cv-build .cv-line { min-height: 26px; }
.chip-txt { font-family: 'Manrope', sans-serif; font-weight: 600; color: ${T.ink2}; font-size: .95em; padding: 0 2px; }
.pool { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.pool-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.pool-chip { position: relative; display: inline-flex; align-items: center; min-height: 40px; padding: 0 10px; border: none;
  border-radius: 12px; background: ${T.paper}; color: ${T.ink}; cursor: pointer;
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: var(--cv-fs);
  box-shadow: 0 2px 6px rgba(80,65,45,.1), inset 0 0 0 2px color-mix(in srgb, var(--c) 35%, #fff); transition: transform .12s; }
.pool-chip:active:not(:disabled) { transform: scale(.95); }
.s12-go { align-self: center; }

/* ══ 13. МОЙ САЙТ ═══════════════════════════════════════════════ */
.site-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
.site-author { font-size: 14px; color: ${T.ink2}; }
.site { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; width: 100%; }
@media (min-width: 720px) { .site { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; } }
@media (max-width: 719px) {
  .site.view-result .site-c { display: none; }
  .site.view-code .site-b { display: none; }
}
.site .mb-page { min-height: clamp(70px, 14dvh, 180px); }
.bigbtn { position: relative; }
.bigbtn-in { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
.saved-stamp { align-self: center; display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 99px;
  background: ${T.successSoft}; color: ${T.success}; font-weight: 800; font-size: 16px; }

/* ══ 14. ИТОГ ═══════════════════════════════════════════════════ */
.recap { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 1.6dvh, 16px); width: 100%; }
.recap-tree { width: min(100%, 300px); }
/* Широкий экран: схема страницы и список умений — рядом, карточка следующего
   урока под ними. В столбик итог не влезал в невысокий ноутбук (1280×720). */
@media (min-width: 900px) {
  .recap { flex-flow: row wrap; justify-content: center; column-gap: clamp(16px, 2.4vw, 32px); }
  .recap .skills { flex: 0 1 480px; }
  .recap .bye-next { flex-basis: 100%; }
}
.rt { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 22px 8px 8px; border-radius: 12px;
  background: color-mix(in srgb, var(--c) 8%, #fff); box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c) 50%, #fff); }
.rt-title, .rt-body { padding: 0; min-height: 26px; }
.rt-l { position: absolute; top: 4px; left: 9px; font-size: 12px; font-weight: 800; color: var(--c); }
.rt-title .rt-l, .rt-body .rt-l { top: 50%; transform: translateY(-50%); }
/* Карточка следующего урока — светлая, как остальные карточки урока:
   тёмная плашка канона была самым тёмным пятном экрана. */
.bye-next.next-card { width: 100%; max-width: 420px; align-self: center; background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 0 0 0 1.5px ${T.uiSoft}; }
.next-card .bye-next-ic { background: ${T.uiSoft}; color: ${T.uiDk}; border: none; }
.next-card .bye-next-t span { color: ${T.ink2}; }
.next-card .bye-next-t b { color: ${T.ink}; }
.next-tags { margin-left: auto; padding-left: 8px; color: ${T.uiDk}; font-size: 14px; font-weight: 700; }

/* ══ ВЫСОТА И ШИРИНА ════════════════════════════════════════════ */
@media (max-height: 700px) {
  .lesson-root { --cv-fs: clamp(11.5px, 3.2vw, 13.5px); }
  .cv { line-height: 1.42; }
  .cv-line:has(.tk-btn) { min-height: 27px; }
  .tk-btn { min-height: 24px; padding: 2px 4px; }
  .mb-page { min-height: 40px; }
  .hook .mb-page { min-height: 64px; }
  .tp-part { min-height: 44px; }
}
@media (min-width: 760px) and (min-height: 700px) {
  .lesson-root { --cv-fs: clamp(14px, 1.45vw, 17px); }
  .mb-top { height: 42px; }
  .mb-tab { font-size: 15px; }
  .mb-doc { font-size: 18px; }
  .tp-line { font-size: 28px; }
  .chip-opt { min-height: 50px; font-size: 17px; }
  .word-b { min-height: 46px; font-size: 16px; }
  .insp-r { font-size: 14px; }
}

/* Совсем маленький телефон (320×568 и ниже): герой и код компактнее, чтобы
   плотные экраны — проверка, починка, песочница — укладывались без прокрутки. */
@media (max-height: 600px) {
  .lesson-root { --cv-fs: 11px; }
  .lesson-root .cv { line-height: 1.32; padding-block: 4px; }
  .lesson-root .cv-line:has(.tk-btn) { min-height: 24px; }
  .lesson-root .tk-btn { min-height: 22px; padding: 1px 4px; }
  .lesson-root .tk-input { font-size: 16px; padding-block: 1px; }
  .lesson-root .mb-top { height: 28px; }
  .lesson-root .mb-page { min-height: 30px; padding: 5px 8px; }
  .lesson-root .mb-doc { font-size: 15px; }
  .lesson-root .goal { padding: 5px 10px; }
  .lesson-root .goal-ic { width: 26px; height: 26px; }
  .lesson-root .ask { font-size: 15px; }
  .lesson-root .word-row .word-b { min-height: 32px; }
  .lesson-root .key-b { min-height: 40px; }
  .lesson-root .insp-r { padding-block: 2px; font-size: 11.5px; }
  .lesson-root .cv.cv-build .cv-line { min-height: 18px; }
  .lesson-root .work { gap: 6px; }
}

/* ══ КЛАВИАТУРА ТЕЛЕФОНА ОТКРЫТА ══════════════════════════════════
   Видимой высоты остаётся около половины экрана. Пока ребёнок печатает, на
   экране только то, что нужно для набора: код с полем, браузер с результатом
   и кнопка проверки. Полоса героя и кнопки «Назад / Дальше» на это время
   уходят (голос продолжает звучать), строки кода становятся плотнее.
   Отправить можно клавишей Enter или кнопкой «Проверить» / «Готово». */
.is-kbd .speaker-wrap { display: none; }
.is-kbd .stage-nav { display: none; }
.is-kbd .stage-content::before, .is-kbd .stage-content::after { max-height: 4px; }
.is-kbd .cv { line-height: 1.28; padding-block: 3px; }
.is-kbd .cv-line { min-height: 0; }
.is-kbd .cv-line.is-typing { min-height: 30px; }
.is-kbd .ask, .is-kbd .own-line, .is-kbd .insp, .is-kbd .choice-row, .is-kbd .sand-tools { display: none; }
.is-kbd .word-row .word-b:not(.word-ok) { display: none; }
.is-kbd .mb-top { height: 26px; }
.is-kbd .mb-page { min-height: 28px; padding: 4px 8px; }
.is-kbd .mb-doc { font-size: 15px; }
.is-kbd .work { gap: 6px; }
.is-kbd .note-one { padding: 5px 10px; }
.is-kbd .note-one .note-lbl { display: none; }
.is-kbd .demo-hand { display: none; }
.is-kbd .stage-content { padding-bottom: 2px; }

/* Меньше движения: смысл остаётся, движение уходит. */
@media (prefers-reduced-motion: reduce) {
  .demo-hand { transition: none; }
  .wire-path { stroke-dashoffset: 0 !important; animation: none !important; opacity: .7; }
  .hook.is-live, .nb-box, .nest-block, .cv-line.is-new, .cv-reveal .cv-line, .tk-input.is-led-in { animation: none !important; }
  .tt-caret { animation: none !important; }
}

/* ═════════════════════════════════════════════════════════════════
   УРОК 2. Ниже — только то, чего не было в уроке 1.
   ═════════════════════════════════════════════════════════════════ */

/* ══ КОД С ПЕРЕНОСОМ СТРОК ══════════════════════════════════════════
   Строка с длинным абзацем переносится с висячим отступом; слева у блока —
   тонкая полоска цвета его тега. Токены — строчные, чтобы текст тёк. */
.src { position: relative; width: 100%; min-width: 0; text-align: left;
  font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: var(--cv-fs); line-height: 1.55;
  background: ${T.paper}; color: ${T.ink}; border-radius: 14px; padding: 6px 8px 6px 0;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5),
    inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); }
.src-line { position: relative; display: block; width: 100%; min-height: 1.55em; border-radius: 6px;
  padding: 1px 4px 1px calc(var(--gut) + var(--d) * var(--ind)); transition: background .3s, opacity .3s; }
.src-line.is-block::before { content: ''; position: absolute; top: 4px; bottom: 4px; width: 3px; border-radius: 2px;
  left: calc(var(--gut) - .55em + var(--d) * var(--ind)); background: var(--c); opacity: .5; }
.src-n { position: absolute; left: 0; top: 1px; width: 1.9em; text-align: right; color: ${T.ink3}; font-size: .78em; line-height: 2; }
.src-code { display: inline; }
.src .tk { display: inline; border-radius: 6px; }
.src .tk-btn { display: inline-flex; vertical-align: middle; max-width: 100%; white-space: normal; text-align: left; }
.tk-tx { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 1.02em; color: ${T.ink};
  white-space: normal; overflow-wrap: anywhere; padding: 0 2px; }
.tk-tx.is-dim { color: ${T.ink3}; font-weight: 500; }
.tk.is-changed .tk-tx, .tk-btn.is-changed .tk-tx { background: ${T.hintSoft}; border-radius: 5px; }
.src-tap { border: none; background: transparent; font: inherit; color: inherit; text-align: left; cursor: pointer; }
.src-tap:hover:not(:disabled) { background: ${T.uiSoft}; }
.src-tap:focus-visible { outline: 3px solid ${T.ui}; outline-offset: -2px; }
.src-tap:disabled { cursor: default; }
.src-line.is-hl { background: color-mix(in srgb, ${TAGC.h} 10%, transparent); }
.src .tk-input { display: inline-block; vertical-align: middle; width: auto; max-width: calc(100% - 6.5em); flex: none; }
.src-one { padding: 10px 12px; font-size: calc(var(--cv-fs) * 1.12); }
.src-one .src-line { padding-left: 4px; }
.src-one .src-line.is-block::before { display: none; }

/* ══ СТРАНИЦА В БРАУЗЕРЕ ═════════════════════════════════════════
   Размеры заголовков — как у браузера по умолчанию (2, 1.5, 1.17, 1, .83,
   .67 em, все жирные). Отступы вдвое меньше настоящих — иначе страница не
   помещается в окно телефона. b — жирный, i — курсив. */
.pg { display: flow-root; }
.pg-b { position: relative; border-radius: 5px; transition: background .4s; }
.pg-h1, .pg-h2, .pg-h3, .pg-h4, .pg-h5, .pg-h6 { font-weight: bold; line-height: 1.18; }
.pg-h1 { font-size: 2em; margin: .335em 0; }
.pg-h2 { font-size: 1.5em; margin: .415em 0; }
.pg-h3 { font-size: 1.17em; margin: .5em 0; }
.pg-h4 { font-size: 1em; margin: .665em 0; }
.pg-h5 { font-size: .83em; margin: .835em 0; }
.pg-h6 { font-size: .67em; margin: 1.165em 0; }
.pg-p { margin: .5em 0; }
.pg-raw { margin: 0; }
.pg > .pg-b:first-child { margin-top: 0; }
.pg > .pg-b:last-child { margin-bottom: 0; }
.pg-b.is-flash { animation: pgFlash 1.2s ease-out; }
@keyframes pgFlash { 0% { background: color-mix(in srgb, var(--c) 24%, #fff); } 100% { background: transparent; } }
.pg-b.is-new { animation: pgIn .6s cubic-bezier(.34,1.3,.5,1) both; transform-origin: left center; }
@keyframes pgIn { from { opacity: 0; transform: translateY(-8px) scale(.97); } to { opacity: 1; transform: none; } }
.pg > .pg-b.is-new:nth-child(2) { animation-delay: .08s; } .pg > .pg-b.is-new:nth-child(3) { animation-delay: .16s; }
.pg > .pg-b.is-new:nth-child(4) { animation-delay: .24s; } .pg > .pg-b.is-new:nth-child(5) { animation-delay: .32s; }
.pg > .pg-b.is-new:nth-child(6) { animation-delay: .4s; } .pg > .pg-b.is-new:nth-child(7) { animation-delay: .48s; }
.pg > .pg-b.is-new:nth-child(8) { animation-delay: .56s; }
.pg-b.is-hl { background: color-mix(in srgb, var(--c) 12%, #fff); }
.pg-wait { display: grid; place-items: center; min-height: 54px; font: 800 34px/1 'Manrope', sans-serif; color: ${T.ink3}; }
.mb-doc { font-size: 15px; }
@media (min-width: 760px) and (min-height: 700px) { .mb-doc { font-size: 17px; } }

/* ══ 1. КРЮЧОК ══════════════════════════════════════════════════ */
.hook2 { width: 100%; max-width: 640px; align-self: center; }
.mb-tall .mb-page { min-height: clamp(110px, 26dvh, 300px); }
/* ПРЕДЛОЖЕНИЕ-КНОПКА (15.10.2026). Раньше предложение выделялось только
   наведением мыши — на телефоне границ не было видно вовсе, а свечение при
   бездействии (7 %) терялось. Теперь каждое предложение — своя плашка с
   подчёркиванием: видно, где оно кончается и что на него можно нажать.
   Соседние плашки чередуют оттенок, чтобы граница читалась и без пробела. */
.wall-txt { line-height: 1.62; }
.snt { cursor: pointer; border-radius: 5px; padding: 1px 3px; margin: 0 1px;
  background: rgba(${T.shadowBase},.055); box-shadow: inset 0 -2px 0 rgba(255,79,40,.3);
  transition: background .2s, box-shadow .2s;
  -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.wall-txt .snt:nth-of-type(even) { background: rgba(255,79,40,.07); }
.snt:hover, .snt:active { background: ${T.uiSoft}; box-shadow: inset 0 -2px 0 ${T.ui}; }
.snt:focus-visible { outline: 2px solid ${T.ui}; outline-offset: 1px; }
.snt[aria-disabled="true"] { cursor: default; }
.snt.is-led, .wall-txt .snt.is-led { background: rgba(255,79,40,.15); box-shadow: inset 0 -2px 0 ${T.ui};
  animation: sntLed 1.6s ease-in-out infinite; }
@keyframes sntLed { 0%, 100% { background: rgba(255,79,40,.1); } 50% { background: rgba(255,79,40,.24); } }
.snt.is-hit, .wall-txt .snt.is-hit { background: ${T.successSoft}; box-shadow: inset 0 -2px 0 ${T.success}; animation: none; }
.snt.is-tip, .wall-txt .snt.is-tip { background: ${T.hintSoft}; box-shadow: inset 0 -2px 0 ${T.hint}; animation: none; }
.snt.fx-no, .wall-txt .snt.fx-no { background: #FFD9CF; animation: none; }
@media (prefers-reduced-motion: reduce) { .snt.is-led { animation: none; } }
.hook2.is-clear .pg-h1 .snt, .hook2.is-clear .pg-h2 .snt, .hook2.is-clear .pg-h3 .snt { padding: 0 2px; }

/* ══ 4. СБОРКА СТРОКИ ═══════════════════════════════════════════ */
.build-line { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px; vertical-align: middle; padding: 2px 0; }
.bslot { display: inline-flex; align-items: center; justify-content: center; min-width: 46px; min-height: 32px; padding: 0 6px;
  border: 1.5px dashed rgba(${T.shadowBase},0.28); border-radius: 9px; color: ${T.ink3};
  font: 700 11px 'Manrope', sans-serif; background: rgba(255,255,255,.7); }
.bslot.is-next { border-color: ${T.ui}; background: ${T.uiSoft}; color: ${T.uiDk}; }
.bslot.is-full { border: none; cursor: pointer; background: ${T.paper}; font: inherit;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.16), 0 2px 6px rgba(80,65,45,.08); animation: boxIn .35s cubic-bezier(.34,1.4,.5,1) both; }
.bslot.is-fixed { cursor: default; box-shadow: inset 0 0 0 1.5px ${T.success}; }
.build-line.fx-no .bslot { background: #FFF1EC; }
.src-s4 .tk-tx.is-dim { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* ══ 5. ШЕСТЬ УРОВНЕЙ ═══════════════════════════════════════════ */
.s5 { position: relative; display: flex; flex-direction: column; gap: clamp(8px, 1.4dvh, 14px); width: 100%; }
.s5-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 10px; align-items: start; }
.s5-left { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.s5 .mb-page { min-height: clamp(92px, 17dvh, 180px); }
.lvl-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(44px, 1fr)); gap: 6px; width: 100%; max-width: 560px; align-self: center; }
.lvl-b { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 3px; min-height: 44px;
  border: none; border-radius: 12px; cursor: pointer; background: ${T.paper}; color: ${TAGC.h};
  font: 800 15px/1 'JetBrains Mono', ui-monospace, monospace;
  box-shadow: 0 2px 6px rgba(80,65,45,.08), inset 0 0 0 2px color-mix(in srgb, ${TAGC.h} 18%, #fff);
  transition: background .2s, color .2s, transform .12s; }
.lvl-b:active:not(:disabled) { transform: scale(.94); }
.lvl-b.is-seen { box-shadow: 0 2px 6px rgba(80,65,45,.08), inset 0 0 0 2px color-mix(in srgb, ${TAGC.h} 45%, #fff); }
.lvl-b.is-on { background: ${TAGC.h}; color: #fff; box-shadow: 0 3px 0 color-mix(in srgb, ${TAGC.h} 70%, #000); }
.lvl-b:disabled { cursor: default; }
.lvl-b .led > i { top: 4px; right: 4px; width: 7px; height: 7px; }
.lad { display: flex; flex-direction: column; gap: 3px; padding: 8px; border-radius: 14px; background: ${T.paper};
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); }
.lad-h { font: 800 11px/1.2 'Manrope', sans-serif; letter-spacing: .07em; text-transform: uppercase; color: ${T.ink2}; margin-bottom: 2px; }
.lad-r { display: flex; align-items: center; gap: 6px; padding: 3px 6px 3px calc(6px + var(--n) * 7px); border-radius: 8px;
  font: 600 12px/1.2 'Manrope', sans-serif; color: ${T.ink3}; transition: background .25s, color .25s, box-shadow .25s; }
.lad-r.is-seen { color: ${T.ink2}; }
.lad-r.is-on { background: color-mix(in srgb, ${TAGC.h} 12%, #fff); color: ${T.ink}; box-shadow: inset 3px 0 0 ${TAGC.h}; }
.lad-tag { flex: 0 0 auto; min-width: 1.9em; font-size: 11px; font-weight: 800; color: ${TAGC.h}; }

/* ══ ЛЕСЕНКА ЗАГОЛОВКОВ (экраны 6–8) ═══════════════════════════════
   Ступенька = уровень: каждая следующая строка сдвинута вправо, полоска
   слева светлеет с уровнем. Цвет тега — синий заголовков. */
.stairs { display: flex; flex-direction: column; gap: 5px; }
.st-r { position: relative; display: flex; align-items: center; gap: 8px; min-height: 40px;
  margin-left: calc(var(--n) * clamp(18px, 6vw, 30px)); padding: 4px 12px 4px 6px; border: none; border-radius: 11px;
  background: #fff; text-align: left; font: inherit; color: ${T.ink};
  box-shadow: 0 1px 0 rgba(${T.shadowBase},0.05), inset 0 0 0 1.5px rgba(${T.shadowBase},0.10);
  transition: background .25s, box-shadow .25s, transform .15s; }
.st-tap { cursor: pointer; }
.st-tap:active:not(:disabled) { transform: scale(.98); }
.st-tap:disabled { cursor: default; }
.st-step { flex: 0 0 auto; align-self: stretch; width: 6px; border-radius: 3px; background: ${TAGC.h}; }
.st-n1 .st-step { opacity: .62; } .st-n2 .st-step { opacity: .34; }
.st-tag { flex: 0 0 auto; min-width: 2.1em; font-size: 14px; font-weight: 800; color: ${TAGC.h}; }
.st-tag.is-hidden { color: ${T.ink3}; }
.st-t { min-width: 0; font: 700 15px/1.2 'Manrope', sans-serif; }
.st-r.is-hl { background: color-mix(in srgb, ${TAGC.h} 11%, #fff); box-shadow: inset 0 0 0 2px color-mix(in srgb, ${TAGC.h} 45%, #fff); }
.st-r.is-q { background: color-mix(in srgb, ${TAGC.h} 8%, #fff); box-shadow: inset 0 0 0 2.5px ${TAGC.h}; }
.st-r.is-ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.success} 45%, #fff); }
.st-r.is-ok .st-tag { color: ${TAGC.h}; }
.stairs.is-compact { gap: 3px; }
.stairs.is-compact .st-r { min-height: 30px; padding-block: 2px; }
.stairs.is-compact .st-t { font-size: 13.5px; }

/* Подсказка на месте строки задания: экран не растёт от плашки. */
.ask.ask-hint { padding: 6px 12px; border-radius: 12px; background: ${T.hintSoft}; color: ${T.hint}; font-size: clamp(14.5px, 2vw, 17px); }

/* ══ 6. ЛЕСЕНКА + КОД ═══════════════════════════════════════════ */
.s6 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; width: 100%; }
@media (min-width: 720px) { .s6 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; gap: 20px; } }
.s6-map, .s6-code, .s7b-plan, .s7b-code { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.src-s6 .src-line.is-p { opacity: .55; min-height: 0; line-height: 1.3; font-size: .9em; }
.src-s6 .src-line.is-hl { background: ${T.successSoft}; }

/* ══ 7. КАКАЯ ЦИФРА? ════════════════════════════════════════════ */
.s7q { width: 100%; max-width: 520px; align-self: center; animation: s7qIn .35s ease-out both; }
@keyframes s7qIn { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
.s7q-n { display: inline-block; padding: 2px 8px; margin-right: 4px; border-radius: 99px; background: ${T.uiSoft};
  color: ${T.uiDk}; font-size: 12.5px; vertical-align: 2px; }
.s7q-lv, .s7b-lv { max-width: 420px; }
.lvl-b.is-off { opacity: .35; }
.lvl-b.is-tip { box-shadow: 0 0 0 3px ${T.hint}; }

/* ══ 8. РАССТАВЬ САМ ════════════════════════════════════════════ */
/* Готово: на телефоне — только страница (строки кода уже не нужны и не
   влезали), на компьютере — страница и код рядом. */
@media (max-width: 719px) { .s7b.is-done .s7b-code { display: none; } }
.s7b { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; width: 100%; }
@media (min-width: 720px) { .s7b { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; gap: 20px; } }
.arch { display: flex; flex-direction: column; gap: 5px; }
.arch-r { position: relative; display: flex; align-items: center; gap: 8px; width: 100%; min-height: 42px; padding: 4px 10px;
  border: none; border-radius: 11px; background: ${T.paper}; text-align: left; cursor: pointer; font: inherit; color: inherit;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.12); transition: box-shadow .2s, background .2s; }
.arch-r:disabled { cursor: default; }
.arch-r.is-sel { box-shadow: inset 0 0 0 2.5px ${TAGC.h}, 0 6px 14px -8px ${TAGC.h}; }
.arch-r.is-ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.success} 40%, #fff); }
.arch-tag { flex: 0 0 auto; min-width: 3.4em; font: 800 var(--cv-fs)/1 'JetBrains Mono', ui-monospace, monospace; color: var(--c); }
.arch-tag.is-empty { color: ${T.ink3}; }
.arch-t { min-width: 0; flex: 1 1 auto; font: 700 14.5px/1.2 'Manrope', sans-serif; color: ${T.ink}; }
.arch-ok { flex: 0 0 auto; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%;
  background: ${T.success}; color: #fff; }
.arch-p { display: none; }

/* ══ ПЕРЕКЛЮЧЕНИЕ «КОД / РЕЗУЛЬТАТ» НА ТЕЛЕФОНЕ ════════════════════ */
@media (max-width: 719px) {
  .work-v-code .work-b { display: none; }
  .work-v-result .work-c { display: none; }
}
.only-narrow { position: relative; }
.fresh-dot { position: absolute; top: 2px; right: calc(50% - 86px); width: 9px; height: 9px; border-radius: 50%;
  background: ${T.ui}; box-shadow: 0 0 0 3px ${T.uiSoft}; }

/* ══ 8. ПРОГНОЗ ═════════════════════════════════════════════════ */
.guess-row { display: flex; flex-wrap: wrap; align-items: stretch; justify-content: center; gap: 8px; }
.guess-b { position: relative; display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 8px 14px;
  border: none; border-radius: 14px; cursor: pointer; background: ${T.paper}; color: ${T.ink};
  font: 700 14.5px/1.2 'Manrope', sans-serif; box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2px ${T.uiSoft};
  transition: box-shadow .2s, transform .12s; }
.guess-b:active:not(:disabled) { transform: scale(.96); }
.guess-b.is-on { background: ${T.uiSoft}; box-shadow: inset 0 0 0 2.5px ${T.ui}; }
.guess-art { display: inline-flex; flex-direction: column; gap: 4px; width: 34px; flex: 0 0 auto; }
.guess-art i { display: block; height: 4px; border-radius: 2px; background: ${T.ink3}; width: 70%; }
.guess-art.is-one i { width: 100%; }
.guess-art i.is-half { width: 55%; }
.guess-row .key-go { min-height: 52px; gap: 6px; }
.cmp-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.cmp-chip { padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink};
  font: 600 13px/1.2 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14); }
.cmp-chip.is-ok, .cmp-chip.is-real { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
.src-tap.is-wrap::after { content: '+ <p>'; margin-left: 8px; padding: 1px 6px; border-radius: 6px; font-size: .82em; font-weight: 700;
  color: ${TAGC.p}; background: color-mix(in srgb, ${TAGC.p} 10%, #fff); white-space: nowrap; }

/* ══ 9. РАЗЛОЖИ ПО АБЗАЦАМ ═══════════════════════════════════════
   Абзац-коробка под заголовком: в неё нажимают после предложения. Пока
   предложение выбрано, коробки зовут (пунктир), страница справа живая. */
.s9b { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; width: 100%; }
@media (min-width: 720px) { .s9b { grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); align-items: start; gap: 20px; } }
/* Телефон: живая страница видна всё время; когда всё разложено — только она. */
@media (max-width: 719px) { .s9b.is-done .s9b-code { display: none; } .s9b-page .mb-page { max-height: 150px; overflow-y: auto; } }
.s9b-code { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.pbox { position: relative; display: flex; flex-direction: column; gap: 4px; width: 100%; padding: 8px 10px; border: none;
  border-radius: 14px; background: ${T.paper}; text-align: left; font: 500 14px/1.35 'Manrope', sans-serif; color: ${T.ink};
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.12); cursor: pointer; transition: box-shadow .2s, background .2s; }
.pbox:disabled { cursor: default; }
.pbox.is-target { box-shadow: inset 0 0 0 2px ${TAGC.p}; background: color-mix(in srgb, ${TAGC.p} 6%, #fff); }
.pbox-h { display: flex; align-items: center; gap: 4px; font-weight: 800; }
.pbox-ht { font-size: 15px; }
.pbox-p { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding-left: 12px; }
.pbox-s { padding: 2px 6px; border-radius: 6px; background: color-mix(in srgb, ${TAGC.p} 10%, #fff); }
.pbox-slot { min-width: 64px; padding: 2px 8px; border-radius: 6px; border: 1.5px dashed rgba(${T.shadowBase},0.25); color: ${T.ink3}; text-align: center; }
.pbox.is-target .pbox-slot { border-color: ${TAGC.p}; color: ${TAGC.p}; }
.s9b-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; width: 100%; max-width: 560px; align-self: center; }
.s9b-chip { position: relative; padding: 8px 12px; border: none; border-radius: 12px; background: #fff; cursor: pointer;
  font: 700 14px/1.25 'Manrope', sans-serif; color: ${T.ink}; text-align: left;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 1.5px rgba(${T.shadowBase},0.14); transition: box-shadow .2s, transform .12s; }
.s9b-chip:active:not(:disabled) { transform: scale(.97); }
.s9b-chip.is-sel { box-shadow: inset 0 0 0 2.5px ${T.ui}, 0 6px 14px -8px ${T.ui}; }
/* Новая задача: на телефоне страница — когда афиша готова; строки с верным
   тегом зеленеют. */
@media (max-width: 719px) { .work-s16.is-done .work-c { display: none; } }
.tr-r.is-ok { background: ${T.successSoft}; }
/* Поле с подсказкой-образцом шире своего текста: образец виден целиком. */
.tk-input.is-wide { min-width: min(13em, 100%); }
/* Свой проект: строка, которую правят сейчас, — в рамке; пустые — образцом. */
.prj-r.is-now { border-radius: 10px; background: color-mix(in srgb, ${T.ui} 6%, #fff); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.ui} 35%, #fff); }
.prj-ph { color: ${T.ink3}; font-style: italic; }
/* Телефон: страница проекта — окошко с прокруткой (видна её нижняя часть,
   где идёт работа), строки кода плотнее, рамки body не нужны. */
@media (max-width: 719px) {
  .work-prj .mb-prj .mb-page { max-height: 150px; min-height: 0; }
  .work-prj .prj-body { display: none; }
  .work-prj .prj-r { min-height: 30px; padding-block: 1px; }
}
@media (max-width: 719px) and (max-height: 700px) { .work-prj .mb-prj .mb-page { max-height: 120px; } }

/* ══ СЛОВА И ВЫДЕЛЕНИЕ ══════════════════════════════════════════ */
.wl, .wl-line { display: inline; }
.wl-w { display: inline-block; margin: 1px 0; padding: 2px 3px; border: none; border-radius: 6px; cursor: pointer;
  background: transparent; color: ${T.ink}; font: 600 1.02em/1.3 'Manrope', sans-serif;
  box-shadow: inset 0 -2px 0 rgba(255,79,40,.22); transition: background .15s, box-shadow .15s; }
.wl-w:hover:not(:disabled) { background: ${T.uiSoft}; }
.wl-w:disabled { cursor: default; box-shadow: none; }
.wl-w.is-led { box-shadow: inset 0 -2px 0 ${T.ui}; }
.wl-w.is-sel { background: ${T.uiSoft}; box-shadow: inset 0 0 0 2px ${T.ui}; }
.wl-w.is-sel.is-a { border-top-right-radius: 2px; border-bottom-right-radius: 2px; }
.wl-w.is-mark.is-b, .wl-sp.is-mark.is-b { font-weight: 800; }
.wl-w.is-mark.is-i, .wl-sp.is-mark.is-i { font-style: italic; }
.wl-w.is-mark, .wl-sp.is-mark { background: color-mix(in srgb, ${TAGC.em} 9%, #fff); }
.wl-w.is-hlr, .wl-sp.is-hlr { background: ${T.hintSoft}; }
.wl-sp { font: 600 1.02em/1.3 'Manrope', sans-serif; white-space: pre-wrap; }
.mark-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.mark-b { position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 16px; border: none;
  border-radius: 14px; cursor: pointer; background: ${T.paper}; color: ${T.ink}; font: 600 15px/1 'Manrope', sans-serif;
  box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2px color-mix(in srgb, ${TAGC.em} 18%, #fff); transition: transform .12s, box-shadow .2s; }
.mark-b:active:not(:disabled) { transform: scale(.95); }
.mark-b.is-ready { box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2.5px ${TAGC.em}; }
.mark-b .tk-tag { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; }
.mark-b b, .mark-b i { font-family: 'Times New Roman', Times, serif; font-size: 17px; }
.mark-b:disabled { opacity: .55; cursor: default; }
.src-words { line-height: 1.9; }

/* ══ 11. СРАВНЕНИЕ И ВОПРОС ═════════════════════════════════════ */
.cmp-card { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 12px; background: ${T.paper};
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 13px; opacity: .5; transition: opacity .3s;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.1); }
.cmp-card.is-seen { opacity: 1; }
.cmp-arrow { color: ${T.ink3}; }
.cmp-s { font-family: 'Times New Roman', Times, serif; font-size: 17px; color: #000; }
.cmp-q { color: ${T.ink3}; font-weight: 800; }
.quiz-col { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 560px; align-self: center; }
.quiz-b { position: relative; min-height: 46px; padding: 8px 14px; border: none; border-radius: 14px; cursor: pointer; text-align: left;
  background: ${T.paper}; color: ${T.ink}; font: 700 14.5px/1.3 'Manrope', sans-serif;
  box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2px ${T.uiSoft}; transition: box-shadow .2s, transform .12s; }
.quiz-b:hover:not(:disabled) { box-shadow: 0 2px 8px rgba(80,65,45,.08), inset 0 0 0 2px ${T.ui}; }
.quiz-b.is-wrong { background: ${T.hintSoft}; }
.quiz-b .led > i { top: 6px; right: 6px; width: 7px; height: 7px; }

/* ══ 13. ДЕТЕКТИВ ═══════════════════════════════════════════════ */
.case-top { display: flex; align-items: center; gap: 8px; width: 100%; }
.case-top .goal { flex: 1 1 auto; min-width: 0; }
.case-n { flex: 0 0 auto; padding: 6px 10px; border-radius: 99px; background: ${T.paper}; font-size: 12px; font-weight: 800; color: ${T.ink2};
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.1); }
.gap-b { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 24px; vertical-align: middle;
  padding: 0; border: none; border-radius: 6px; cursor: pointer; background: transparent; color: ${T.ui}; font-size: 12px; }
.gap-b:hover:not(:disabled), .gap-b.is-led { background: ${T.uiSoft}; }
.src-s13.is-ok { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), inset 0 0 0 2px ${T.success}; }
.case-done { display: flex; flex-direction: column; align-items: center; gap: 6px; }

/* ══ 14. ПЕСОЧНИЦА ══════════════════════════════════════════════ */
.tag-cycle { position: relative; display: inline-flex; align-items: center; padding: 2px 4px; border: none; border-radius: 7px; cursor: pointer;
  background: color-mix(in srgb, ${TAGC.h} 7%, #fff); font: inherit; box-shadow: inset 0 -2px 0 rgba(255,79,40,.3); vertical-align: middle; }
.tag-cycle:hover:not(:disabled) { background: ${T.uiSoft}; }
.tag-cycle:active:not(:disabled) { transform: scale(.94); }
.tag-cycle .led > i { top: -3px; right: -3px; width: 7px; height: 7px; }
.add-b { min-height: 40px; padding: 0 12px; }
.lesson-root .sand-tools { flex-wrap: wrap; }
@media (max-width: 719px) { .sand-reset-t { display: none; } }
.src-sand .src-line { padding-top: 2px; padding-bottom: 2px; }

/* ══ 15. ПРОЕКТ ═════════════════════════════════════════════════ */
.topic-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; max-width: 480px; align-self: center; }
.topic-b { min-height: 58px; font-size: 16px; }
.prj { padding: 6px 8px; }
.prj-r { position: relative; display: flex; align-items: center; gap: 4px; min-height: 36px; padding: 2px 2px 2px 14px; border-radius: 9px;
  transition: background .25s; }
.prj-r::before { content: ''; position: absolute; left: 4px; top: 6px; bottom: 6px; width: 3px; border-radius: 2px; background: var(--c); opacity: .5; }
.prj-r .tk-input { flex: 1 1 auto; min-width: 0; width: 100%; max-width: none; }
.prj-r.is-bad { background: ${T.hintSoft}; }
.prj-r.is-marking { flex-wrap: wrap; background: ${T.uiSoft}; }
.prj-words { flex: 1 1 100%; order: 2; padding: 2px 0 4px; line-height: 1.9; }
.prj-r.is-marking > .tk:last-of-type { order: 3; }
.prj-body { padding: 1px 4px; }
.prj-rows { display: flex; flex-direction: column; gap: 3px; padding-left: 10px; max-height: 40dvh; overflow-y: auto; }
.prj-mark { position: relative; flex: 0 0 auto; display: inline-flex; align-items: center; gap: 2px; min-width: 38px; min-height: 32px; padding: 0 6px;
  border: none; border-radius: 9px; cursor: pointer; background: ${T.paper}; color: ${TAGC.em};
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${TAGC.em} 40%, #fff); font: 16px/1 'Times New Roman', serif; }
.prj-mark.is-led { animation: ledFrame 1.15s ease-in-out infinite; }
.prj-x { flex: 0 0 auto; width: 30px; height: 32px; border: none; border-radius: 8px; cursor: pointer; background: transparent;
  color: ${T.ink3}; font: 400 22px/1 'Manrope', sans-serif; }
.prj-x:hover:not(:disabled) { background: rgba(${T.shadowBase},0.06); color: ${T.ink}; }
.prj-tools { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; }
.mb-prj .mb-page { min-height: clamp(90px, 20dvh, 240px); }

/* ══ 16. АФИША ══════════════════════════════════════════════════ */
.tr { padding: 6px; }
.tr-r { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 6px;
  padding: 5px 6px; border-radius: 10px; transition: background .25s; }
.tr-r + .tr-r { box-shadow: 0 -1px 0 rgba(${T.shadowBase},0.06); }
.tr-r.is-bad { background: ${T.hintSoft}; }
.tr-tag { min-width: 3.3em; font: 800 var(--cv-fs)/1 'JetBrains Mono', ui-monospace, monospace; color: var(--c); }
.tr-t { min-width: 0; font: 600 14px/1.3 'Manrope', sans-serif; color: ${T.ink}; }
.tr-seg { display: inline-flex; gap: 3px; }
.tr-b { position: relative; min-width: 36px; min-height: 36px; padding: 0 4px; border: none; border-radius: 9px; cursor: pointer;
  background: ${T.bg}; color: ${T.ink2}; font: 800 12px/1 'JetBrains Mono', ui-monospace, monospace; transition: background .2s, color .2s; }
.tr-b.is-on { background: var(--c); color: #fff; }
.tr-b.is-led { box-shadow: inset 0 0 0 1.5px ${T.ui}; }

/* ══ 17–18 ══════════════════════════════════════════════════════ */
.mb-site .mb-page { min-height: clamp(90px, 20dvh, 240px); }
.recap-ol { display: flex; flex-direction: column; gap: 7px; width: min(100%, 300px); padding: 12px; border-radius: 14px; background: ${T.paper};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5); }
.ro-r { display: flex; align-items: center; gap: 8px; padding-left: calc(var(--n) * 16px); animation: pgIn .5s cubic-bezier(.34,1.3,.5,1) both; }
.ro-r span { flex: 0 0 1.8em; font-size: 11px; font-weight: 800; color: var(--c); }
.ro-r i { display: block; height: 10px; border-radius: 5px; background: var(--c); opacity: .75; }
.ro-r.is-p i { height: 6px; opacity: .28; }
.ro-r.w90 i { width: 90%; } .ro-r.w80 i { width: 80%; } .ro-r.w70 i { width: 70%; } .ro-r.w60 i { width: 60%; } .ro-r.w50 i { width: 50%; }

/* ══ ВЫСОТА: невысокий телефон ══════════════════════════════════ */
@media (max-height: 700px) {
  .mb-doc { font-size: 14px; }
  .lad-r { padding-block: 2px; font-size: 11.5px; }
  .lvl-b { min-height: 40px; }
  .arch-r { min-height: 36px; }
  .arch-p { display: none; }
  .tr-b { min-width: 32px; min-height: 32px; }
  .mark-b { min-height: 42px; }
  .guess-b { min-height: 46px; }
  .prj-rows { max-height: 34dvh; }
}
@media (max-width: 719px) and (max-height: 760px) {
  .lesson-root .s5 .mb-page { min-height: 70px; }
  .lesson-root .mb-tall .mb-page { min-height: 90px; }
}
@media (max-width: 400px) {
  .s5-grid { grid-template-columns: minmax(0, 1fr) minmax(0, .9fr); gap: 6px; }
  .lad-t { font-size: 11px; }
  .tr-r { grid-template-columns: auto minmax(0, 1fr); }
  .tr-seg { grid-column: 1 / -1; justify-content: flex-end; }
}

/* ══ КЛАВИАТУРА ТЕЛЕФОНА ОТКРЫТА ═════════════════════════════════ */
.is-kbd .mark-row, .is-kbd .guess-row, .is-kbd .lvl-row, .is-kbd .cmp-row, .is-kbd .insp, .is-kbd .only-narrow { display: none; }
.is-kbd .prj-rows { max-height: 30dvh; }
.is-kbd .work-v-code .work-b { display: none; }

/* Меньше движения: смысл остаётся, движение уходит. */
@media (prefers-reduced-motion: reduce) {
  .pg-b.is-new, .pg-b.is-flash, .bslot.is-full, .ro-r, .prj-mark.is-led { animation: none !important; }
}

/* Экран 3: браузер виден и при подсказке — ошибка «правлю h1 ради вкладки»
   объясняется подсветкой вкладки и страницы сразу. Подсказка — под кодом. */
@media (max-width: 719px) and (max-height: 760px) {
  .work-s3 .mb-page { min-height: 0; padding-block: 4px; }
  .work-s3 .mb-doc { font-size: 12px; }
  .src-s3 .src-line { min-height: 0; line-height: 1.38; }
}

/* Экран 4: стена текста — фон для нового заголовка, читать её не нужно.
   В браузере — три строки, в коде — одна. */
.work-s4 .pg-raw { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; color: #444; }
@media (max-width: 719px) {
  .work-s4 .pg-raw { -webkit-line-clamp: 2; }
  .src-s4 .tk-tx.is-dim { -webkit-line-clamp: 1; }
}
@media (max-height: 700px) {
  .bslot { min-height: 28px; }
  .src-s4 .src-line { min-height: 0; line-height: 1.4; }
  .work-s4 .mb-top { height: 28px; }
}
/* Экраны 6–8 на невысоком телефоне: лесенка и свёрнутые абзацы плотнее. */
@media (max-height: 700px) {
  .s6, .s7b { gap: 4px; }
  .s6-map, .s6-code, .s7b-plan, .s7b-code { gap: 3px; }
  .st-r { min-height: 32px; padding-block: 2px; }
  .stairs.is-compact { gap: 2px; }
  .stairs.is-compact .st-r { min-height: 24px; }
  .arch { gap: 4px; }
  .arch-r { min-height: 34px; padding-block: 2px; }
  .ask.ask-hint { padding: 4px 10px; font-size: 14px; line-height: 1.3; }
  .src-s6 .src-line { min-height: 0; line-height: 1.35; }
  .src-s6 .src-line.is-p { line-height: 1.05; font-size: .8em; }
}
/* Экран 8: два варианта прогноза — в два столбца, «Запустить» — под ними. */
.guess-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; max-width: 520px; align-self: center; }
.guess-row .guess-b { padding: 6px 10px; gap: 8px; font-size: 14px; }
.guess-row .key-go { grid-column: 1 / -1; justify-self: center; min-height: 46px; }
/* Экран 16: строки выбираются касанием, как у архитектора. */
.tr-r { grid-template-columns: auto minmax(0, 1fr); }
.tr-r.is-tap { cursor: pointer; }
.tr-r.is-tap:hover { background: ${T.uiSoft}; }
.tr-r.is-sel { box-shadow: inset 0 0 0 2.5px ${T.ui}; background: #fff; }
.tr-r .led > i { top: 6px; right: 6px; width: 7px; height: 7px; }
@media (max-width: 400px) { .tr-r { grid-template-columns: auto minmax(0, 1fr); } }
/* Экраны 9–10 на невысоком телефоне: на UZ и EN предложения длиннее. */
@media (max-width: 719px) and (max-height: 700px) {
  .work-s10 .mb-doc { font-size: 13px; }
  .work-s10 .mb-page { min-height: 0; padding-block: 5px; }
  .src-s10 { line-height: 1.42; }
  .src-s10 .src-line { min-height: 0; }
  .work-s10 .mb-top { height: 28px; }
}
@media (max-width: 719px) and (max-height: 700px) {
  .insp:not(.insp-all) .insp-r:not(.is-now) { display: none; }
}
/* Клавиатура открыта: кнопки символов и браузер плотнее. */
.is-kbd .key-b { min-height: 36px; }
.is-kbd .mb-doc { font-size: 13px; }
.is-kbd .pg-p { margin: .2em 0; }
.is-kbd .src { line-height: 1.32; }
.is-kbd .src-line { min-height: 0; }
.is-kbd .lesson-root .work { gap: 4px; }
.is-kbd .keys { gap: 4px; }
.is-kbd .work-s10 .mb-page { padding-block: 3px; }
/* Экран 10: пока печатают, страница не меняется — при клавиатуре её убираем. */
.is-kbd .work-s10 .work-b { display: none; }
/* Компьютер: подписи схем и механик крупнее — на широком экране мелкий
   кегль терялся рядом с кодом и браузером. */
@media (min-width: 760px) and (min-height: 700px) {
  .lad { padding: 12px; gap: 5px; }
  .lad-h { font-size: 12.5px; }
  .lad-r { font-size: 15px; padding-block: 6px; padding-left: calc(8px + var(--n) * 12px); }
  .lad-tag { font-size: 13px; }
  .st-r { min-height: 46px; }
  .st-t { font-size: 17px; }
  .st-tag { font-size: 15px; }
  .arch-t { font-size: 17px; }
  .tr-t { font-size: 17px; }
  .lvl-b { min-height: 50px; font-size: 17px; }
  .mark-b, .quiz-b, .guess-b { font-size: 16.5px; }
  .cmp-card, .cmp-chip { font-size: 15px; }
  .wl-w, .wl-sp { font-size: 1.08em; }
}
/* Совсем маленький телефон (320×568 и ниже). */
@media (max-height: 600px) {
  .recap-ol { display: none; }
  .mb-site .mb-page, .mb-prj .mb-page { min-height: 54px; }
  .lad { padding: 5px; gap: 1px; }
  .lad-r { padding-block: 1px; font-size: 10.5px; }
  .lad-h { display: none; }
  .s5 .mb-page { min-height: 48px; }
  .lvl-b { min-height: 36px; font-size: 13px; }
  .pg-wait { min-height: 36px; font-size: 26px; }
  .guess-row .guess-b { min-height: 40px; padding: 4px 8px; font-size: 13px; }
  .guess-row .key-go { min-height: 40px; }
  .work-s10 .mb-doc { font-size: 12.5px; }
  .src-sand .tk-input { padding-block: 1px; }
  .add-b { min-height: 34px; }
  .lesson-root .sand-tools .seg2-b { min-height: 34px; }
  .mark-b, .quiz-b { min-height: 38px; }
  .tr-r { padding-block: 3px; }
}
@media (max-height: 600px) {
  .lesson-root { --cv-fs: 10.5px; }
  .lesson-root .mb-top { height: 24px; }
  .s5-grid { gap: 5px; }
  .s5 .src-one { padding: 4px 8px; }
  .s5 .pg-p { margin: .2em 0; }
  .lesson-root .bigbtn { min-height: 46px; padding-top: 6px; padding-bottom: 6px; }
  .mb-site .mb-page { min-height: 40px; }
  .lesson-root .key-b { min-height: 36px; }
  .work-s10 .mb-page { padding-block: 3px; }
  .lesson-root .sand-tools { flex-wrap: nowrap; gap: 4px; }
  .lesson-root .sand-tools .add-b { padding: 0 7px; }
  .lesson-root .sand-tools .seg2-b { padding: 0 8px; font-size: 13px; }
  .lesson-root .sand-tools .btn-soft { padding: 0 8px; }
  .src-sand .src-line { padding-top: 0; padding-bottom: 0; }
}
@media (max-height: 600px) and (max-width: 380px) { .site-author { display: none; } }
/* Страница ученика бывает любой длины: как в настоящем браузере, длинная
   страница прокручивается внутри окна, а не раздвигает экран урока. */
.mb-site .mb-page, .mb-prj .mb-page { max-height: 44dvh; overflow-y: auto; overscroll-behavior: contain; }
@media (max-width: 719px) { .mb-site .mb-page, .mb-prj .mb-page { max-height: 34dvh; } }
.src-site { max-height: 34dvh; overflow-y: auto; overscroll-behavior: contain; }
@media (max-width: 719px) { .src-site { max-height: 40dvh; } }
/* Проект: режим выделения — закрывающий тег после слов, кнопки в один ряд. */
.prj-r.is-marking .prj-close { order: 3; }
.prj-tools .mark-row.is-compact { flex-wrap: nowrap; gap: 6px; }
.mark-row.is-compact .mark-b { padding: 0 12px; min-height: 42px; }
.prj-tools:has(.mark-row) { flex-wrap: nowrap; }
/* ══ УРОК 3 · СПИСКИ · ПРОБА 2 (свои стили, префикс ls-) ══════════
   Списки в браузере — как по умолчанию: отступ слева, точки у ul, номера
   у ol (их рисует сам браузер). Отступы вдвое меньше настоящих. */
.ls-pg h1, .ls-pg h2 { font-weight: bold; line-height: 1.18; border-radius: 5px; }
.ls-pg h1 { font-size: 1.6em; margin: .3em 0; }
.ls-pg h2 { font-size: 1.25em; margin: .35em 0; }
.ls-pg p { margin: .35em 0; }
.ls-pg > :first-child { margin-top: 0; }
.ls-pg > :last-child { margin-bottom: 0; }
.ls-list { margin: .3em 0; padding-left: 1.6em; border-radius: 6px; transition: background .3s; }
.ls-ul { list-style: disc; }
.ls-ol { list-style: decimal; }
.ls-li { border-radius: 5px; padding: 0 3px; transition: background .3s; }
.ls-li::marker { color: #000; font-weight: 700; }
/* Узлы, попавшие внутрь незакрытого списка: со сдвигом и без точки. */
.ls-tail { list-style: none; }
.ls-tail > h2, .ls-tail > p { margin: .3em 0; }
/* li вне списка: точка есть, отступа списка нет. */
.ls-stray { display: list-item; list-style: disc inside; margin: .05em 0 0; border-radius: 5px; }
.ls-raw { margin: .35em 0; }
.ls-q { margin: .2em 0; font-size: 1.6em; color: ${T.ink3}; }
.ls-pg .is-hl { background: color-mix(in srgb, ${TAGC.ol} 14%, #fff); box-shadow: 0 0 0 2px color-mix(in srgb, ${TAGC.ol} 40%, transparent); }
.ls-pg .is-new { animation: pgIn .6s cubic-bezier(.34,1.3,.5,1) both; transform-origin: left center; }
.ls-pg .is-flash { animation: lsFlash 1.2s ease-out; }
@keyframes lsFlash { 0% { background: color-mix(in srgb, ${TAGC.ol} 20%, #fff); } 100% { background: transparent; } }
/* Пункт-кнопка на странице (экран 3). */
.ls-li-b { position: relative; padding: 1px 6px; margin: 1px 0; border: none; border-radius: 6px; background: transparent;
  font: inherit; color: inherit; text-align: left; cursor: pointer; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${TAGC.ol} 35%, transparent); }
.ls-li-b:hover:not(:disabled) { background: ${T.uiSoft}; }
.ls-li-b:disabled { cursor: default; }
.ls-li.is-hl .ls-li-b { box-shadow: inset 0 0 0 2px ${TAGC.ol}; }

/* Код: текущая строка, просмотренная, новая, места «сюда». */
.ls-src .src-line.is-cur { background: color-mix(in srgb, ${TAGC.ol} 12%, transparent); }
.ls-src .src-line.is-seen .src-n { color: ${T.success}; font-weight: 700; }
.ls-src .src-line.is-box { background: color-mix(in srgb, ${TAGC.ol} 8%, transparent); }
.ls-src .src-line.is-new { animation: lsLine 1.2s ease-out; }
@keyframes lsLine { 0% { background: color-mix(in srgb, ${TAGC.ol} 26%, transparent); } 100% { background: transparent; } }
.ls-src .src-line.is-gap { min-height: 2.1em; }
.ls-src .src-line.ls-slot { min-height: 0; padding-top: 0; padding-bottom: 0; line-height: 1.2; border-radius: 6px; }
.ls-slot-l { display: inline-flex; align-items: center; gap: 6px; width: 100%; padding: 1px 8px; border-radius: 6px;
  border: 1.5px dashed color-mix(in srgb, ${T.ui} 45%, transparent); color: ${T.uiDk}; font: 700 11px/1.35 'Manrope', sans-serif; letter-spacing: .02em; }
.ls-slot:hover:not(:disabled) .ls-slot-l { background: ${T.uiSoft}; }
.src .tk-btn.ls-flip { padding: 1px 3px; box-shadow: inset 0 0 0 1.5px ${T.ui}; background: ${T.uiSoft}; }
.src .tk-btn.ls-flip:hover:not(:disabled) { background: #fff; }
.ls-inp { position: relative; display: inline-flex; align-items: center; vertical-align: middle; max-width: calc(100% - 6.5em); }
.ls-inp .tk-input { max-width: 100%; }
.ls-inp-wide { max-width: 100%; min-width: 12ch; }
.ls-inp-wide .tk-input { flex: 1 1 auto; width: 100%; }
.ls-inp.is-led .tk-input { animation: ledFrame 1.15s ease-in-out infinite; }

/* Жалоба игрока. */
.ls-msg { display: flex; align-items: flex-start; gap: 8px; width: 100%; max-width: 560px; margin: 0 auto; padding: 6px 10px;
  border-radius: 14px 14px 14px 4px; background: #fff; text-align: left; font-size: 14px; line-height: 1.3;
  box-shadow: 0 1px 0 rgba(${T.shadowBase},0.06), inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); }
.ls-ava { flex: 0 0 auto; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;
  background: ${T.ink}; color: #fff; font: 800 12px/1 'Manrope', sans-serif; }
.ls-msg-b { color: ${T.ink2}; }
.ls-msg-b b { color: ${T.ink}; margin-right: 2px; }

/* Экран 1: абзац с шагами-кнопками. */
.ls-hook { width: 100%; max-width: 600px; margin: 0 auto; }
.ls-para { margin: 0; line-height: 1.75; }
.ls-phr { position: relative; padding: 1px 5px; margin: 0 1px; border: none; border-radius: 6px; font: inherit; color: inherit; cursor: pointer;
  background: color-mix(in srgb, ${T.ui} 8%, #fff); box-shadow: inset 0 -2px 0 color-mix(in srgb, ${T.ui} 35%, transparent); }
.ls-phr:hover:not(:disabled) { background: ${T.uiSoft}; }
.ls-phr:disabled { cursor: default; }

/* Экран 4: детали строки. */
.ls-pieces { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.ls-piece { position: relative; min-height: 46px; padding: 6px 14px; border: none; border-radius: 12px; background: #fff; cursor: pointer;
  font: 600 16px/1 'JetBrains Mono', ui-monospace, monospace; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), inset 0 0 0 1.5px rgba(${T.shadowBase},0.12);
  transition: opacity .25s, transform .15s; }
.ls-piece:active:not(:disabled) { transform: scale(.95); }
.ls-piece.is-used { opacity: .25; }
.ls-piece:disabled { cursor: default; }
.ls-build { display: inline-flex; align-items: center; gap: 3px; vertical-align: middle; }
.ls-ph { display: inline-block; width: 2.2em; height: 1.2em; border-radius: 5px; border: 1.5px dashed rgba(${T.shadowBase},0.3); }
.ls-ph.is-next { border-color: ${T.ui}; background: ${T.uiSoft}; }
.ls-in { animation: pgIn .4s cubic-bezier(.34,1.3,.5,1) both; }

/* Экран 5: пункт с запятыми-кнопками. */
.ls-strip { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; padding: 8px 10px; border-radius: 14px;
  background: #fff; font-family: 'Times New Roman', Times, serif; font-size: 18px; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.1); }
.ls-word { padding: 2px 4px; border: none; background: transparent; font: inherit; color: ${T.ink}; cursor: pointer; border-radius: 6px; }
.ls-word:disabled { cursor: default; }
.ls-comma { position: relative; min-width: 34px; min-height: 38px; padding: 0 8px; border: none; border-radius: 10px; cursor: pointer;
  background: ${T.uiSoft}; color: ${T.uiDk}; font: 800 22px/1 'Times New Roman', serif; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.ui} 45%, transparent); }
.ls-comma:disabled { cursor: default; }
.ls-cut { display: inline-block; width: 3px; height: 30px; margin: 0 6px; border-radius: 2px; background: ${TAGC.ol}; animation: pgIn .4s ease-out both; }

/* Экран 6: варианты прогноза с маленькими рисунками. */
.ls-opts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; width: 100%; max-width: 560px; margin: 0 auto; }
.ls-opt { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; min-height: 84px; padding: 8px 6px;
  border: none; border-radius: 14px; background: #fff; color: ${T.ink}; font: 700 13px/1.2 'Manrope', sans-serif; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), inset 0 0 0 1.5px rgba(${T.shadowBase},0.12); transition: opacity .25s; }
.ls-opt:disabled { cursor: default; }
.ls-opt.is-ok { box-shadow: inset 0 0 0 2.5px ${T.success}; color: ${T.success}; }
.ls-opt.is-off { opacity: .45; }
.ls-opt.is-real { box-shadow: inset 0 0 0 2.5px ${T.success}; }
.ls-art { display: flex; flex-direction: column; gap: 4px; width: 56px; height: 30px; justify-content: center; }
.ls-art i { position: relative; display: block; height: 4px; border-radius: 2px; background: ${T.ink3}; }
.ls-art.is-dots i { margin-left: 10px; }
.ls-art.is-dots i::before { content: ''; position: absolute; left: -9px; top: -1px; width: 6px; height: 6px; border-radius: 50%; background: ${T.ink2}; }
.ls-art.is-line { flex-direction: row; align-items: center; gap: 3px; }
.ls-art.is-line i { flex: 1; }

/* Экран 8: карточка нового шага. */
.ls-card-new { display: inline-flex; align-self: center; align-items: center; gap: 4px; margin: 0 auto; padding: 4px 12px; border-radius: 10px;
  background: #fff; font-size: 14px; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.ui} 45%, transparent); animation: lsBob 2.6s ease-in-out infinite; }
.ls-card-new .tk-tag { font-size: .9em; }
@keyframes lsBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

/* Экран 9: карточка раздела и выбор ul / ol. */
.ls-card { position: relative; width: 100%; max-width: 420px; margin: 0 auto; padding: 12px 16px; border-radius: 16px; background: #fff;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5);
  font-family: 'Times New Roman', Times, serif; font-size: 18px; text-align: left; animation: pgIn .5s cubic-bezier(.34,1.3,.5,1) both; }
.ls-card-t { display: block; font-size: 1.12em; margin-bottom: 4px; }
.ls-card-l { margin: 0; padding-left: 1.5em; }
.ls-card-i { line-height: 1.3; }
.ls-card-l.is-shuf .ls-card-i { animation: lsShuf .5s cubic-bezier(.34,1.3,.5,1) both; }
.ls-card-l.is-shuf .ls-card-i:nth-child(2) { animation-delay: .08s; }
.ls-card-l.is-shuf .ls-card-i:nth-child(3) { animation-delay: .16s; }
@keyframes lsShuf { 0% { transform: translateY(-14px); opacity: 0; } 100% { transform: none; opacity: 1; } }
.ls-shuf-l { position: absolute; right: 12px; top: 12px; padding: 2px 8px; border-radius: 99px; background: ${T.hintSoft}; color: ${T.hint};
  font: 700 11px/1.4 'Manrope', sans-serif; }
.ls-pick { display: flex; justify-content: center; gap: 12px; }
.ls-pick-b { position: relative; display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 8px 18px;
  border: none; border-radius: 14px; background: #fff; color: var(--c); font-size: 20px; font-weight: 800; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), inset 0 0 0 2px color-mix(in srgb, var(--c) 45%, transparent); transition: transform .15s, opacity .25s; }
.ls-pick-b:active:not(:disabled) { transform: scale(.95); }
.ls-pick-b:disabled { cursor: default; }
.ls-pick-b.is-on { background: var(--c); color: #fff; box-shadow: none; }
.ls-pick-b.is-off { opacity: .35; }
.ls-ic { display: inline-flex; flex-direction: column; gap: 3px; }
.ls-ic i { position: relative; display: block; width: 18px; height: 3px; margin-left: 7px; border-radius: 2px; background: currentColor; opacity: .55; }
.ls-ic i::before { position: absolute; left: -8px; top: 50%; transform: translateY(-50%); }
.ls-ic-ul i::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
.ls-ic-ol { counter-reset: lsic; }
.ls-ic-ol i::before { counter-increment: lsic; content: counter(lsic); font-size: 8px; line-height: 1; font-weight: 800; }

/* Экран 12: номер жалобы. */
.ls-case { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; }
.ls-case-n { padding: 2px 8px; border-radius: 99px; background: ${T.uiSoft}; color: ${T.uiDk}; font-size: 12px; }

/* Экран 14: темы и кнопка «+ li». */
.ls-topics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; max-width: 520px; margin: 0 auto; }
.ls-topic { position: relative; min-height: 64px; padding: 10px 12px; border: none; border-radius: 16px; background: #fff; color: ${T.ink};
  font-size: 16px; font-weight: 700; line-height: 1.25; cursor: pointer;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), inset 0 0 0 2px rgba(${T.shadowBase},0.1); }
.ls-topic:active:not(:disabled) { transform: scale(.97); }
.ls-add { display: flex; justify-content: center; }
.ls-add-b { position: relative; min-height: 46px; padding: 8px 22px; border: none; border-radius: 14px; background: ${T.ui}; color: #fff;
  font: 800 18px/1 'JetBrains Mono', ui-monospace, monospace; cursor: pointer; box-shadow: 0 4px 0 ${T.uiDk}; }
.ls-add-b:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 ${T.uiDk}; }
.ls-add-b:disabled { opacity: .5; cursor: default; }

/* Экран 16: значок списков. */
.ls-recap { display: flex; justify-content: center; gap: 14px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 15px; font-weight: 700; }
.ls-recap .ls-list { margin: 0; padding: 6px 12px 6px 30px; background: #fff; border-radius: 12px; color: ${TAGC.ol};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); }

/* Открытая клавиатура (экраны 11, 13, 14): браузер прячется, строка кода,
   поле и кнопки символов остаются над клавиатурой. */
.is-kbd .ls-typing .work-b { display: none; }
.is-kbd .ls-msg { display: none; }

/* Телефон. */
@media (max-width: 719px) {
  .ls-pick-b { min-height: 46px; font-size: 18px; padding: 6px 14px; }
  .ls-card { padding: 10px 14px; font-size: 16.5px; }
  .ls-strip { font-size: 16.5px; padding: 6px 8px; }
  .ls-topic { min-height: 56px; font-size: 15px; }
  .ls-msg { font-size: 13px; padding: 5px 9px; }
  .ls-opt { min-height: 74px; font-size: 12.5px; }
}
@media (max-height: 700px) {
  .ls-pick-b, .ls-piece, .ls-add-b { min-height: 42px; }
}
@media (prefers-reduced-motion: reduce) {
  .ls-pg .is-new, .ls-pg .is-flash, .ls-src .src-line.is-new, .ls-card, .ls-card-new, .ls-in, .ls-cut,
  .ls-card-l.is-shuf .ls-card-i { animation: none; }
}

/* Жалоба закрыта: галочка и спокойная рамка. */
.ls-msg { position: relative; transition: box-shadow .3s; }
.ls-msg.is-done { box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.success} 45%, transparent); }
.ls-msg-ok { flex: 0 0 auto; align-self: center; width: 22px; height: 22px; margin-left: auto; border-radius: 50%; display: grid; place-items: center;
  background: ${T.success}; color: #fff; animation: pgIn .4s cubic-bezier(.34,1.3,.5,1) both; }
@media (prefers-reduced-motion: reduce) { .ls-msg-ok { animation: none; } }
`;
