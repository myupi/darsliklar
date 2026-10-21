// =============================================================================
// ТЕСТОВЫЕ УРОКИ · Урок 1 курса HTML, вариант «Бумажная страница» — структура документа
// Дети 11–14. Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
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
const VOICE = { bot: 'm' };   // КУРС HTML: мужской голос (заказчик, 19.10.2026)
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
      comps: [0, 1, 2].map(() => {
        const sp = rnd(0.8, 2.6) * (Math.random() < 0.5 ? -1 : 1);
        return { k: 2 + Math.floor(rnd(0, 5)), ph: rnd(0, TAU), sp, v: sp, a: 0, at: rnd(0.3, 1), swap: false };
      })
    }));
    const f1 = (v) => v.toFixed(1);
    const draw = (l, amp) => {
      const pts = [];
      for (let j = 0; j < N; j += 1) {
        const t = (j / N) * TAU;
        let sum = 0, w = 0;
        l.comps.forEach((c) => { sum += c.a * Math.sin(c.k * t + c.ph); w += c.a; });
        const f = 0.5 + 0.5 * (sum / Math.max(w, 0.5));   // без деления на почти ноль, когда гармоники гаснут
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
    // ПЛАВНОСТЬ (заказчик, 17.10.2026: «волны как будто дёргаются»). Рывки
    // давали три вещи: цель размаха менялась каждые 0,1–0,3 с и догонялась за
    // 0,07 с; число горбов (k) у гармоники менялось мгновенно; направление бега
    // разворачивалось на месте. Теперь размах идёт через два сглаживания, k
    // меняется только у затухшей гармоники (swap: гаснет — меняется —
    // разгорается), скорость бега (v) плавно догоняет новую (sp).
    let energy = 0, ease = 0, target = 0, nextAt = 0, last = 0, raf = 0;
    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const talking = !!onRef.current;
      if (now >= nextAt) {
        target = talking ? rnd(0.45, 1) : 0;
        nextAt = now + rnd(260, 560);
        layers.forEach((l) => l.comps.forEach((c) => {
          if (!c.swap) c.at = rnd(0.25, 1);
          if (!c.swap && Math.random() < 0.18) { c.swap = true; c.at = 0; }
          if (Math.random() < 0.15) c.sp = -c.sp;
        }));
      }
      const follow = (x, to, tau) => x + (to - x) * (1 - Math.exp(-dt / tau));
      ease = follow(ease, target, target > ease ? 0.18 : 0.32);
      energy = follow(energy, ease, 0.12);
      // Кружок спрятан (голос в шапке, клавиатура) — считаем, но не рисуем.
      const shown = svg.getClientRects().length > 0;
      layers.forEach((l) => {
        l.rot += l.spin * dt * (0.4 + 1.6 * energy);
        l.comps.forEach((c) => {
          c.v = follow(c.v, c.sp, 0.7);
          c.ph += c.v * dt * (0.6 + 2.4 * energy);
          c.a = follow(c.a, c.at, 0.35);
          if (c.swap && c.a < 0.03) { c.k = 2 + Math.floor(rnd(0, 5)); c.swap = false; c.at = rnd(0.25, 1); }
        });
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
const sanitizeForTts = (text, lang) =>
  String(text || '')
    .replace(/\*\*/g, '')
    .replace(/[«»"“”]/g, '')
    .replace(/\s*→\s*/g, ', ')
    // КУРС HTML: в узбекском тире — остановка (точка), иначе голос не делает паузы.
    .replace(/\s*—\s*/g, lang === 'uz' ? '. ' : ', ')
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
// Узбекский (правка текстов урока 1, 17.10.2026): финал «Tabriklayman!» —
// большая победа; спокойные начала разбора ошибки «Yana bir qarang:» и
// «E’tibor bering:» — [reassuring], как «Qarang:» и «Hechqisi yo‘q».
const TTS_EMOTION = true;
const EMO_W = (words) => new RegExp('^(?:' + words.join('|') + ')(?=[\\s!,.?…:;]|$)', 'i');
const EMO = {
  oops: { ru: /^(?:ой|упс)(?=[\s!,.]|$)|кажется, я /i, uz: /o‘xshayman|adashdim|chalkashtirdim/i, en: /^(?:oops|uh-oh)(?=[\s!,.]|$)|i think i (?:put|mixed|made)/i },
  big: { ru: EMO_W(['ура', 'это было мощно', 'вот это да']), uz: EMO_W(['ura', 'bu kuchli', 'qoyil', 'tabriklayman']), en: EMO_W(['hooray', 'that was epic', 'look at that']) },
  wow: { ru: EMO_W(['ого', 'ух ты', 'вот оно']), uz: /^(?:voy,|ajab|mana u!)/i, en: EMO_W(['whoa', 'there it is']) },
  win: { ru: EMO_W(['есть', 'огонь', 'супер', 'вау', 'класс', 'бомба', 'чётко', 'четко', 'точно', 'в точку', 'получилось', 'отлично', 'круто', 'красота', 'идеально', 'готово', 'собрано', 'спасибо', 'дожали', 'верно', 'да', 'нашлось', 'сработало', 'правильно', 'вот так', 'работает']),
    uz: EMO_W(['ana', 'zo‘r', 'zo‘r-ku', 'super', 'voy', 'klass', 'bomba', 'aniq', 'aynan nishonga', 'aynan', 'chiqdi', 'mukammal', 'ajoyib', 'tayyor', 'yig‘ildi', 'rahmat', 'barakalla', 'ofarin', 'to‘g‘ri', 'ha', 'topildi', 'ishladi', 'ishlayapti']),
    en: EMO_W(['yes', 'awesome', 'super', 'wow', 'cool', 'boom', 'spot on', 'nailed it', 'perfect', 'great', 'built', 'thanks', 'got it', 'done', 'right', 'nice', 'found it', 'it works', 'correct']) },
  soft: { ru: EMO_W(['почти', 'ничего', 'смотри:', 'хорошая попытка', 'уже близко', 'не страшно']), uz: EMO_W(['deyarli', 'hechqisi', 'qarang:', 'yana bir qarang:', 'e’tibor bering:', 'yaxshi urinish', 'yaqin qoldi']),
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
// КУРС HTML: УЗБЕКСКИЙ ГОЛОС (заказчик, 19.10.2026: «с озвучкой проблемы»). Как в
// уроках с хорошей узбекской озвучкой (11-класс, 1-класс): обычный апостроф в oʻ, gʻ
// и tutuq belgisi — ‘ ’ ʻ ʼ уходят в сервис как '. Теги эмоций остаются (заказчик).
// Текст на экране не меняется; прогрев и реплика идут одной строкой.
const ttsApos = (s, lang) => (lang === 'uz' ? s.replace(/[‘’ʻʼ]/g, "'") : s);
const markLang = (text, lang) => {
  const s = ttsApos(String(text || ''), lang);
  if (!s) return s;
  return (LANG_MARK[lang] || LANG_MARK.ru) + (TTS_EMOTION ? emoTag(String(text || ''), lang) : '') + s;
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
  // Мужской голос во всех уроках курса (заказчик, 19.10.2026: «голос пацана»);
  // voiceGender от LMS голос курса не меняет.
  const g = 'm';
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
    const clean = sanitizeForTts(text, lang);
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
      const clean = sanitizeForTts(t, lang);
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
// КУРС HTML: КОНФЕТТИ (заказчик, 17.10.2026: «хлопушки очень некрасивые —
// переделай полностью»). Без нарисованных конусов: из нижних углов экрана
// вылетают конфетти — дугой вверх и к середине, тормозят в воздухе и плавно
// падают, кружась и переворачиваясь. Четыре вложенных слоя на кусочек: по X
// (полёт с торможением), по Y (вверх — потом падение с ускорением), лёгкое
// покачивание и сам кусочек, который вертится в 3D. Всё — CSS, кусочки
// посчитаны заранее (одинаковые при каждом показе), касаний слой не ловит.
const CELEB_COLORS = ['#FF4F28', '#FFB703', '#4CC9F0', '#7C5CFF', '#2EC4B6', '#FF7AA2', '#FFD166', '#06D6A0'];
const CELEB_SHAPES = [[8, 13, 2], [9, 9, 2], [8, 8, 50], [5, 18, 3], [10, 6, 2]];
const CELEB_BITS = (() => {
  const out = [];
  const r = (k, m) => { const x = Math.sin(k * 12.9898 + m * 78.233) * 43758.5453; return x - Math.floor(x); };
  for (let k = 0; k < 64; k += 1) {
    const side = k % 2;
    const sh = CELEB_SHAPES[Math.floor(r(k, 7) * CELEB_SHAPES.length)];
    out.push({ side, c: CELEB_COLORS[Math.floor(r(k, 6) * CELEB_COLORS.length)], w: sh[0], h: sh[1], br: sh[2],
      x: (side ? -1 : 1) * Math.round(14 + r(k, 1) * 62),          // vw: насколько залетит к середине
      up: -Math.round(46 + r(k, 2) * 38),                           // vh: высота дуги
      d: +(2.3 + r(k, 3) * 1.1).toFixed(2), delay: +(r(k, 4) * 0.28).toFixed(2),
      spin: +(0.7 + r(k, 5) * 0.9).toFixed(2), rz: Math.round(r(k, 8) * 360), sway: +(0.7 + r(k, 9) * 0.6).toFixed(2) });
  }
  return out;
})();
const CELEB_CSS = `
.celeb { position: fixed; inset: 0; z-index: 70; pointer-events: none; overflow: hidden; perspective: 600px; }
.cf { position: absolute; bottom: 4vh; will-change: transform, opacity;
  animation: cfX var(--d) cubic-bezier(.1,.62,.28,1) var(--dl) both, cfFade var(--d) linear var(--dl) both; }
.cf.is-l { left: -10px; }
.cf.is-r { right: -10px; }
.cf-y { animation: cfY var(--d) linear var(--dl) both; }
.cf-s { animation: cfSway var(--sw) ease-in-out var(--dl) infinite alternate; }
.cf-p { display: block; width: var(--w); height: var(--h); border-radius: var(--br); background: var(--c);
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.12); transform-style: preserve-3d;
  animation: cfFlip var(--sp) linear var(--dl) infinite; }
@keyframes cfX { from { transform: translateX(0); } to { transform: translateX(var(--x)); } }
@keyframes cfY {
  0% { transform: translateY(0); animation-timing-function: cubic-bezier(.18,.82,.4,1); }
  30% { transform: translateY(var(--up)); animation-timing-function: cubic-bezier(.55,0,.9,.55); }
  100% { transform: translateY(12vh); } }
@keyframes cfSway { from { transform: translateX(-7px) rotate(-8deg); } to { transform: translateX(7px) rotate(8deg); } }
@keyframes cfFlip { from { transform: rotateZ(var(--rz)) rotateX(0) rotateY(0); }
  to { transform: rotateZ(calc(var(--rz) + 360deg)) rotateX(720deg) rotateY(360deg); } }
@keyframes cfFade { 0%, 82% { opacity: 1; } 100% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .celeb { display: none; } }
`;
function CelebrateLayer() {
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    let t = null;
    const f = () => { setBurst((v) => v + 1); clearTimeout(t); t = setTimeout(() => setBurst(0), 3900); };
    _celebSubs.add(f);
    return () => { _celebSubs.delete(f); clearTimeout(t); };
  }, []);
  if (!burst) return null;
  return (
    <div className="celeb" key={burst} aria-hidden="true">
      <style>{CELEB_CSS}</style>
      {CELEB_BITS.map((b, k) => (
        <i key={k} className={'cf is-' + (b.side ? 'r' : 'l')}
          style={{ '--x': b.x + 'vw', '--up': b.up + 'vh', '--d': b.d + 's', '--dl': b.delay + 's' }}>
          <i className="cf-y" style={{ display: 'block' }}>
            <i className="cf-s" style={{ display: 'block', '--sw': b.sway + 's' }}>
              <i className="cf-p" style={{ '--w': b.w + 'px', '--h': b.h + 'px', '--br': b.br + (b.br === 50 ? '%' : 'px'), '--c': b.c, '--sp': b.spin + 's', '--rz': b.rz + 'deg' }} />
            </i>
          </i>
        </i>
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
      // КУРС HTML: узбекскому — пауза после реплики длиннее (заказчик, 19.10.2026).
      await sleep(lang === 'uz' ? 800 : 400);
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
  // КУРС HTML (заказчик, 19.10.2026: «на узбекском кнопки включаются до того,
  // как Коди заговорит»). Предохранитель считает только ТИШИНУ: пока голос
  // звучит или урок на паузе, отсчёт стоит, каждая новая реплика начинает его
  // заново. Раньше 9 с шли на всю очередь реплик сразу, и длинные узбекские
  // фразы (плюс время, пока сервис их озвучивает) открывали кнопки посреди
  // рассказа. Если озвучка умерла молча, через 9 с тишины кнопки откроются.
  const playing = !!(audio && audio.playing);
  const paused = !!(audio && audio.paused);
  const [safety, setSafety] = useState(false);
  useEffect(() => {
    if (!busy) { setSafety(false); return undefined; }
    if (playing || paused) { setSafety(false); return undefined; }
    const id = setTimeout(() => setSafety(true), ANSWER_SAFETY_MS);
    return () => clearTimeout(id);
  }, [busy, playing, paused]);
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
// ===== УРОК 1 (тест) · «Бумажная страница» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ. Стилистика ролика html.mp4 (заказчик, 20.10.2026): бумажный коллаж —
// вырезки из цветной бумаги с рваным краем и фактурой, мягкая тень слой на слой,
// движение вырезками по столу со ступенчатостью stop-motion и параллаксом. На
// листе живёт бумажный человечек; любая страница устроена так же: рамка (html),
// голова, где страница помнит своё имя (head, внутри title), и тело — всё, что
// видно в окне (body). Ученик собирает человечка-страницу, а в конце — свою.
//
// ДУГА. s1 крючок · s2 план · тройки «объяснение → сам делаешь → закрепление»:
// тег и html (s3–s5), head и title (s6–s8), body (s9–s11), весь документ
// (s12–s14) · s15 вывод. Сценарий — docs/scenarij-12-struktura-kollazh.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Цвета частей — как в ролике: html коралл, head горчица, body бирюза;
//     теги — полоски на скотче: уголки коралловые, имя чернилами.
//   · head — «голова» человечка (метафора ролика), а не «паспорт» урока 1.
//   · Конфетти только в финале: похвалы экранов — поза smile.
//   · Честный браузер: текст без ярлыков — в окно, вкладка index.html; без
//     </title> всё, что дальше, уходит во вкладку.
//
// СИСТЕМА СЛОВ. Тег — слово в угловых скобках, подсказка браузеру (не «бирка»: в узбекском «yorliq» — это вкладка); html — рамка всей страницы; head —
// голова: то, что страница знает о себе; title — имя страницы на вкладке;
// body — тело: всё, что видно в окне.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'test-12-struktura-kollazh',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '1-dars (qog‘oz). HTML hujjat tuzilishi',
    ru: 'Урок 1 (бумажный). Структура HTML-документа',
    en: 'Lesson 1 (paper). HTML document structure'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Qoida', 'Правило', 'Rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Katta sarlavha va xatboshilar qo‘shamiz', 'Добавим большой заголовок и абзацы', 'We add a big heading and paragraphs'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  read: L3('Brauzerdek o‘qish', 'Читать как браузер', 'Read like a browser'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  pic: L3('rasm', 'картинка', 'picture'),
  pageText: L3('sahifa matni', 'текст страницы', 'page text'),
  slot: L3('joy', 'место', 'place'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  again: L3('yangi misol', 'новый пример', 'new example'),
  hintN: L3('Maslahat', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  swap: L3('Ikki qatorni bosing — ular joy almashadi.', 'Нажми две полоски — они поменяются местами.', 'Tap two strips: they swap places.'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения. Звучат: say, top, bottom,
// done, ok, msgs, hints …; печатаются: eyebrow, ask, cards.title, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Qog‘oz sahifa', 'Бумажная страница', 'A paper page'),
    say: L3('Salom! Men Kodiman. Bu qog‘oz odamcha. Uni bosing, sizga bir sirni ko‘rsataman.',
      'Привет! Я Коди. Это бумажный человечек. Нажми на него — покажу секрет.',
      'Hi! I’m Kodi. This is a paper buddy. Tap him, and I’ll show you a secret.'),
    // Две реплики подряд: пока звучит первая, подсвечена вкладка, пока вторая — окно.
    magic: L3('Voy, qarang! Brauzerning tepasidagi yorliqda sahifa nomi paydo bo‘ldi.',
      'Ого! Смотри: наверху, на вкладке браузера, появилось название страницы.',
      'Whoa! Look at the top: the page name appeared on the browser tab.'),
    magicWin: L3('Oynada esa tanadagi hamma narsa ko‘rinyapti.',
      'А в окне теперь всё, что было в теле.',
      'And everything from the body is now in the window.'),
    done: L3('Bugun sahifa qanday qismlardan iboratligini bilib olasiz va o‘z sahifangizni yig‘asiz!',
      'Сегодня ты узнаешь, из каких частей состоит страница, и соберёшь свою!',
      'Today you’ll learn what parts a page has and build your own!'),
    ask: L3('Qog‘oz odamchani bosing', 'Нажми на бумажного человечка', 'Tap the paper buddy'),
    askDone: L3('Sahifa nomi yorliqda, mazmuni esa oynada ko‘rinadi',
      'Название страницы — на вкладке, содержимое — в окне',
      'The page name is on the tab, the content is in the window')
  },
  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Mana bugungi dars rejasi. Unda to‘rtta qadam bor.', 'Вот план урока. В нём четыре шага.', 'Here’s the plan for today. It has four steps.'),
    cards: [
      { title: L3('html tegi', 'Тег html', 'The html tag'),
        say: L3('Avval teg nima ekanini bilib olamiz va html tegi bilan tanishamiz.',
      'Сначала узнаем, что такое тег, и познакомимся с тегом html.',
      'First, we’ll find out what a tag is and meet the html tag.') },
      { title: L3('Sahifa nomi', 'Название страницы', 'The page name'),
        say: L3('Keyin sahifa nomini yozasiz. U brauzer yorlig‘ida ko‘rinadi.',
      'Потом ты напишешь название страницы. Оно появится на вкладке браузера.',
      'Then you’ll write the page name. It will show on the browser tab.') },
      { title: L3('Oynadagi matn', 'Текст в окне', 'Text in the window'),
        say: L3('Uchinchi qadamda brauzer oynasida ko‘rinadigan matnni yozasiz.',
      'Третий шаг — текст, который видно в окне браузера.',
      'Step three: the text you see in the browser window.') },
      { title: L3('O‘z sahifangiz', 'Своя страница', 'Your own page'),
        say: L3('Oxirida esa o‘z sahifangizni to‘liq yig‘asiz!', 'А в конце ты соберёшь свою страницу целиком!', 'And at the end, you’ll build your whole page!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  s3: {
    eyebrow: L3('Teg nima?', 'Что такое тег', 'What is a tag'),
    say: L3('Brauzer sahifa qismlarini teglar orqali taniydi.', 'Браузер узнаёт части страницы по тегам.', 'The browser finds the parts of a page by their tags.'),
    // Пока звучит определение тега, оба тега на рамке подсвечены.
    sayTag: L3('Teg burchakli qavslar ichidagi so‘z. U sahifa qismi qayerda boshlanib, qayerda tugashini ko‘rsatadi.',
      'Тег — это слово в угловых скобках. Он показывает, где часть страницы начинается и где заканчивается.',
      'A tag is a word in angle brackets. It shows where a part of the page starts and where it ends.'),
    sayAsk: L3('Ramkadagi tepa tegni bosing.', 'Нажми верхний тег на рамке.', 'Tap the top tag on the frame.'),
    top: L3('Bu ochuvchi html tegi. HTML hujjat shu tegdan boshlanadi.',
      'Это открывающий тег html. С него начинается HTML-документ.',
      'This is the opening html tag. The HTML document starts here.'),
    bottomAsk: L3('Endi pastki tegni bosing.', 'Теперь нажми нижний тег.', 'Now tap the bottom tag.'),
    bottom: L3('Bu esa yopuvchi html tegi. So‘z o‘sha, faqat oldida qiya chiziq bor. Hujjat shu yerda tugaydi.',
      'А это закрывающий тег html. Слово то же, но перед ним косая черта. Здесь документ заканчивается.',
      'And this is the closing html tag. Same word, but with a slash before it. The document ends here.'),
    done: L3('Butun sahifa shu ikki teg orasida joylashadi. Ramkani tushunarli bo‘lishi uchun chizdik, brauzerda u ko‘rinmaydi.',
      'Вся страница находится между этими двумя тегами. Рамку мы нарисовали для наглядности: в браузере её не видно.',
      'The whole page goes between these two tags. We drew the frame to help you see it. The browser doesn’t show it.'),
    ask: L3('Ramkadagi teglarni bosing', 'Нажми теги на рамке', 'Tap the tags on the frame')
  },
  s4: {
    eyebrow: L3('Ramkani yoping', 'Закрой рамку', 'Close the frame'),
    say: L3('Ramkaning pastki cheti yo‘q, ya’ni hujjat yopilmagan. Bo‘sh qatorga yopuvchi html tegini yozing.',
      'У рамки нет нижнего края: документ не закрыт. Напиши в пустую строку закрывающий тег html.',
      'The frame has no bottom edge: the document isn’t closed. Type the closing html tag in the empty line.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda html so‘zidan oldin qiya chiziq turadi.',
      'Это открывающий тег. В закрывающем перед словом html стоит косая черта.',
      'That’s the opening tag. The closing tag has a slash before html.'),
      needLt: L3('Teg burchakli qavs bilan boshlanadi: «<». Uni boshiga qo‘shing.',
      'Тег начинается с угловой скобки «<». Добавь её в начало.',
      'A tag starts with the angle bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida burchakli qavs turadi: «>». Uni oxiriga qo‘shing.',
      'В конце тега нужна угловая скобка «>». Добавь её в конец.',
      'A tag ends with the angle bracket “>”. Add it at the end.'),
      wrongName: L3('Teg ichida boshqa so‘z yozilgan. Bu yerda html kerak.',
      'Внутри тега другое слово. Здесь нужен html.',
      'There’s a different word inside the tag. Here you need html.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.',
      'Косая черта «/» стоит сразу после первой угловой скобки.',
      'The slash “/” goes right after the first angle bracket.')
    },
    hints: [L3('Ramkaning tepasidagi tegga qarang.', 'Посмотри на верхний тег на рамке.', 'Look at the top tag on the frame.'),
      L3('Yopuvchi teg o‘sha so‘z, faqat qiya chiziq bilan.', 'Закрывающий тег — то же слово, но с косой чертой.', 'The closing tag is the same word with a slash.'),
      L3('Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin html va oxirida yana burchakli qavs.',
      'Начни с угловой скобки, потом поставь косую черту. Дальше html и в конце снова угловая скобка.',
      'Start with the angle bracket, then add the slash. Then html, and another angle bracket at the end.')],
    ok: L3('Ramka yopildi: endi butun hujjat ikki html tegi orasida!',
      'Рамка закрылась: весь документ теперь между двумя тегами html!',
      'The frame is closed: the whole document is now between the two html tags!'),
    ask: L3('Bo‘sh qatorga yopuvchi html tegini yozing', 'Напиши закрывающий тег html в пустую строку', 'Type the closing html tag in the empty line')
  },
  s5: {
    eyebrow: L3('Teglar joyida', 'Теги по местам', 'Tags in place'),
    say: L3('Yangi varaq. Ramkaga ikkita teg kerak: biri tepaga, biri pastga. Uchta tegdan bittasi ortiqcha.',
      'Новый лист. Рамке нужны два тега: один сверху, другой снизу. Один тег из трёх лишний.',
      'A new sheet. The frame needs two tags: one at the top and one at the bottom. One of the three tags is extra.'),
    top: L3('Hujjat tepada boshlanadi. Bu yerga qiya chiziqsiz ochuvchi teg kerak.',
      'Сверху документ начинается. Здесь нужен открывающий тег, без косой черты.',
      'The document starts at the top. It needs the opening tag, without a slash.'),
    bottom: L3('Hujjat pastda tugaydi. Bu yerga qiya chiziqli yopuvchi teg kerak.',
      'Снизу документ заканчивается. Здесь нужен закрывающий тег, с косой чертой.',
      'The document ends at the bottom. It needs the closing tag, with a slash.'),
    back: L3('Bu chiziq teskari tomonga qiyshaygan. Yopuvchi tegda u o‘ngga qiyshaygan bo‘ladi: «/».',
      'Эта черта наклонена не в ту сторону. В закрывающем теге она наклонена вправо: «/».',
      'This slash leans the wrong way. In a closing tag it leans right: “/”.'),
    pickFirst: L3('Avval tegni tanlang.', 'Сначала выбери тег.', 'Pick a tag first.'),
    hints: [L3('Qaysi teg hujjatni ochadi, qaysi biri yopadi?', 'Какой тег открывает документ, а какой закрывает?', 'Which tag opens the document, and which one closes it?'),
      L3('Tepaga qiya chiziqsiz teg, pastga qiya chiziqli teg qo‘yiladi.',
      'Сверху — тег без косой черты. Снизу — тег с косой чертой.',
      'Top: the tag without a slash. Bottom: the tag with a slash.'),
      L3('<html> tegini tepadagi joyga torting.', 'Перетащи <html> на верхнее место.', 'Drag <html> to the top place.')],
    ok: L3('Ikkala teg joyida. Teskari chiziqli teg ortiqcha ekan!',
      'Оба тега на месте. Лишним оказался тег с обратной чертой!',
      'Both tags are in place. The one with the backslash was extra!'),
    ask: L3('Tegni joyiga torting', 'Перетащи тег на место', 'Drag a tag into place'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the place')
  },
  s6: {
    eyebrow: L3('head va title', 'head и title', 'head and title'),
    say: L3('Odamchaning boshi head qismiga o‘xshaydi. Unda sahifa haqidagi ma’lumot saqlanadi. Brauzer oynasida u ko‘rinmaydi. Odamchaning boshini bosing!',
      'Голова человечка — как часть head. В ней хранятся сведения о странице. В окне браузера их не видно. Нажми на голову человечка!',
      'The buddy’s head is like the head part. It holds information about the page. You don’t see it in the browser window. Tap the buddy’s head!'),
    opened: L3('Ichida title kartochkasi bor. Unda sahifa nomi yozilgan. Kartochkani bosing!',
      'Внутри — карточка title. На ней название страницы. Нажми на карточку!',
      'Inside is the title card. It has the page name on it. Tap the card!'),
    flew: L3('Mana, sahifa nomi brauzer yorlig‘ida ko‘rindi!', 'Название страницы появилось на вкладке браузера!', 'There: the page name is on the browser tab!'),
    done: L3('Sahifa nomi title ichiga yoziladi. title esa head ichida joylashadi.',
      'Название страницы пишут внутри title. А title стоит внутри head.',
      'The page name goes inside title. And title sits inside head.'),
    ask: L3('Odamchaning boshini bosing', 'Нажми на голову человечка', 'Tap the buddy’s head'),
    askCard: L3('title kartochkasini bosing', 'Нажми на карточку title', 'Tap the title card')
  },
  s7: {
    eyebrow: L3('Yorliqdagi nom', 'Название на вкладке', 'The name on the tab'),
    say: L3('Sahifangizga nom o‘ylab toping. Uni title ichiga yozing va brauzer yorlig‘iga qarang.',
      'Придумай название своей страницы. Напиши его внутри title и посмотри на вкладку.',
      'Think of a name for your page. Type it inside title and watch the tab.'),
    ok: L3('Siz yozgan nom yorliqda paydo bo‘ldi!', 'Твоё название уже на вкладке!', 'Your page name is on the tab now!'),
    hints: [L3('Sahifa nomini qaysi teg belgilaydi?', 'Какой тег задаёт название страницы?', 'Which tag sets the page name?'),
      L3('Sahifa nomi title ichiga yoziladi.', 'Название страницы пишут внутри title.', 'The page name goes inside title.'),
      L3('title tegi ichidagi bo‘sh joyni bosing va nom yozing.',
      'Нажми на пустое место внутри title и напиши название.',
      'Tap the empty space inside title and type a name.')],
    ask: L3('title ichiga sahifa nomini yozing', 'Напиши название внутри title', 'Type a page name inside title')
  },
  s8: {
    eyebrow: L3('Yorliqmi yoki oyna?', 'Вкладка или окно?', 'Tab or window?'),
    say: L3('Hozir sahifaga yangi kod qatorlari tushadi. Har bir so‘zni brauzer qayerda ko‘rsatishini o‘ylab ko‘ring.',
      'Сейчас на страницу лягут новые строки кода. Подумай, где браузер покажет каждое слово.',
      'New lines of code are coming. Think about where the browser will show each word.'),
    rounds: [
      { kind: 'title', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'tab' },
      { kind: 'raw', word: L3('Kosmos', 'Космос', 'Space'), extra: L3('Musiqa', 'Музыка', 'Music'), want: 'win' },
      { kind: 'title', word: L3('Final juma kuni!', 'Финал в пятницу!', 'The final is on Friday!'), extra: L3('Bugun konsert!', 'Сегодня концерт!', 'Concert today!'), want: 'tab' }
    ],
    ok: {
      title: L3('title ichidagi matnni brauzer yorliqda ko‘rsatadi. To‘g‘ri topdingiz.',
      'Текст внутри title браузер показывает на вкладке. Всё верно.',
      'The browser shows text inside title on the tab. You got it.'),
      raw: L3('Tegsiz so‘zni brauzer oynada ko‘rsatadi. Yorliqda esa hozircha fayl nomi turibdi. To‘g‘ri topdingiz.',
      'Слово без тегов браузер показывает в окне. А на вкладке пока имя файла. Всё верно.',
      'The browser shows a word without tags in the window. The tab still shows the file name. You got it.')
    },
    miss: {
      title: L3('Qarang: title ichidagi matn yorliqqa chiqdi, uzun gap bo‘lsa ham. Yana bir misol.',
      'Смотри: текст из title попал на вкладку, даже длинная фраза. Давай ещё пример.',
      'Look: the text from title went to the tab, even a long phrase. Let’s try another one.'),
      raw: L3('Qarang: so‘zda teg yo‘q, shuning uchun brauzer uni oynada ko‘rsatdi. Yana bir misol.',
      'Смотри: у слова нет тегов, поэтому браузер показал его в окне. Давай ещё пример.',
      'Look: the word has no tags, so the browser showed it in the window. Let’s try another one.')
    },
    askTitle: L3('title ichida «{w}». U qayerda paydo bo‘ladi?', 'В title — «{w}». Где оно появится?', 'title says “{w}”. Where will it show up?'),
    askRaw: L3('Tegsiz «{w}». U qayerda paydo bo‘ladi?', '«{w}» без тегов. Где оно появится?', '“{w}” with no tags. Where will it show up?'),
    done: L3('Esda tuting: title ichidagi matn yorliqda, tegsiz matn esa oynada ko‘rinadi.',
      'Запомни: текст из title — на вкладке, а текст без тегов — в окне.',
      'Remember: text in title shows on the tab, and text without tags shows in the window.')
  },
  s9: {
    eyebrow: L3('body qismi', 'Часть body', 'The body part'),
    say: L3('Odamchaning tanasi body qismiga o‘xshaydi. Brauzer oynasida ko‘rinadigan hamma narsa body ichida bo‘ladi. Odamchaning tanasini bosing!',
      'Тело человечка — как часть body. В body находится всё, что видно в окне браузера. Нажми на тело человечка!',
      'The buddy’s body is like the body part. Everything you see in the browser window is inside body. Tap the buddy’s body!'),
    out: L3('Matn, rasm va tugma oynada paydo bo‘ldi. Bularning hammasi body ichida yozilgan.',
      'Текст, картинка и кнопка появились в окне. Всё это записано внутри body.',
      'The text, the picture and the button appeared in the window. They’re all written inside body.'),
    done: L3('body ichida sahifaning oynada ko‘rinadigan hamma mazmuni bo‘ladi.',
      'В body — всё содержимое страницы, которое видно в окне.',
      'body holds all the page content you see in the window.'),
    ask: L3('Odamchaning tanasini bosing', 'Нажми на тело человечка', 'Tap the buddy’s body')
  },
  s10: {
    eyebrow: L3('Oynadagi salom', 'Привет в окне', 'Hello in the window'),
    say: L3('body ichiga mehmonlar uchun salomlashuv yozing. U darhol oynada paydo bo‘ladi.',
      'Напиши приветствие для гостей внутри body. Оно сразу появится в окне.',
      'Type a greeting for your visitors inside body. It will appear in the window right away.'),
    ok: L3('Siz yozgan matn oynada ko‘rinyapti!', 'Твой текст уже виден в окне!', 'Your text is showing in the window!'),
    hints: [L3('Oynada ko‘rinadigan matn qaysi teg ichiga yoziladi?', 'В каком теге пишут текст, который видно в окне?', 'Which tag holds the text you see in the window?'),
      L3('Oynadagi matn body ichiga yoziladi.', 'Текст для окна пишут внутри body.', 'Text for the window goes inside body.'),
      L3('body ichidagi bo‘sh joyni bosing va matn yozing.', 'Нажми на пустое место внутри body и напиши текст.', 'Tap the empty space inside body and type your text.')],
    ask: L3('body ichiga salom yozing', 'Напиши приветствие внутри body', 'Type a greeting inside body')
  },
  s11: {
    eyebrow: L3('Qirqimlarni joylang', 'Разложи вырезки', 'Sort the cut-outs'),
    say: L3('Har bir qirqim qayerga tegishli: head ichigami yoki body ichigami? Ularni joyiga torting.',
      'Куда положить каждую вырезку: в head или в body? Перетащи их по местам.',
      'Where does each cut-out go: into head or into body? Drag them into place.'),
    items: [
      { id: 'name', want: 'head', why: L3('Bu title tegidagi sahifa nomi. U oynada emas, yorliqda ko‘rinadi. Shuning uchun u head ichida bo‘ladi.',
      'Это название страницы в теге title. Его видно на вкладке, а не в окне. Поэтому оно в head.',
      'This is the page name in a title tag. It shows on the tab, not in the window. So it goes in head.') },
      { id: 'hello', want: 'body', why: L3('Bu matn oynada ko‘rinishi kerak. Demak, uning joyi body ichida.',
      'Этот текст должен быть виден в окне. Значит, его место в body.',
      'This text should be visible in the window. So it belongs in body.') },
      { id: 'pic', want: 'body', why: L3('Rasm oynada ko‘rinadi. Demak, u body ichida.', 'Картинку видно в окне. Значит, она в body.', 'You see the picture in the window. So it goes in body.') },
      { id: 'btn', want: 'body', why: L3('Tugmani oynada bosamiz. Demak, u body ichida.', 'Кнопку нажимают в окне. Значит, она в body.', 'You press the button in the window. So it goes in body.') }
    ],
    ok: L3('Hammasi joyida: sahifa nomi head ichida, oynada ko‘rinadigan hamma narsa body ichida!',
      'Всё на местах: название в head, а всё, что видно в окне, в body!',
      'Everything’s in place: the page name in head, everything visible in body!'),
    pickFirst: L3('Avval qirqimni tanlang.', 'Сначала выбери вырезку.', 'Pick a cut-out first.'),
    hints: [L3('Bu narsa brauzer oynasida ko‘rinadimi?', 'Эту вещь видно в окне браузера?', 'Can you see this in the browser window?'),
      L3('Oynada ko‘rinadigan hamma narsa body ichida. Sahifa nomi head ichida.',
      'Всё, что видно в окне, находится в body. Название страницы — в head.',
      'Everything you see in the window goes in body. The page name goes in head.'),
      L3('Yonib turgan qirqimni yonib turgan joyga torting.', 'Перетащи светящуюся вырезку в светящееся место.', 'Drag the glowing cut-out to the glowing place.')],
    ask: L3('Qirqimni head yoki body ichiga torting', 'Перетащи вырезку в head или в body', 'Drag a cut-out into head or body'),
    askPlace: L3('Endi head yoki body ni bosing', 'Теперь нажми head или body', 'Now tap head or body')
  },
  s12: {
    eyebrow: L3('Yuqoridan pastga', 'Сверху вниз', 'Top to bottom'),
    say: L3('Brauzer kodni yuqoridan pastga o‘qiydi va sahifani bo‘lakma-bo‘lak yig‘adi. Tugmani bosing va kuzating.',
      'Браузер читает код сверху вниз и по кусочкам собирает страницу. Нажми кнопку и посмотри.',
      'The browser reads code from top to bottom and builds the page piece by piece. Press the button and watch.'),
    doctype: L3('Birinchi qator <!DOCTYPE html>. U brauzerga bu HTML hujjat ekanini bildiradi.',
      'Первая строка — <!DOCTYPE html>. Она сообщает браузеру, что это HTML-документ.',
      'The first line is <!DOCTYPE html>. It tells the browser this is an HTML document.'),
    // Порядок — тремя репликами: каждая подсвечивает свои строки кода и блок коллажа.
    order1: L3('Tartib shunday: avval birinchi qator.', 'Порядок такой: сначала первая строка.', 'Here’s the order: the first line comes first.'),
    order2: L3('Keyin html keladi.', 'Потом html.', 'Then comes html.'),
    order3: L3('Uning ichida head va body joylashadi.', 'А внутри него — head и body.', 'And inside it are head and body.'),
    askDone: L3('Tartib: birinchi qator, keyin html, uning ichida head va body',
      'Порядок: первая строка, потом html, а внутри него head и body',
      'The order: the first line, then html, and inside it head and body'),
    ask: L3('«Brauzerdek o‘qish» tugmasini bosing', 'Нажми «Читать как браузер»', 'Tap “Read like a browser”')
  },
  s13: {
    eyebrow: L3('Karkasni yig‘ing', 'Собери каркас', 'Build the frame'),
    say: L3('Endi o‘z sahifangiz karkasini yig‘ing. Birinchi qator joyida turibdi. Qolgan qatorlarni tartib bilan joylashtiring.',
      'Теперь собери каркас своей страницы. Первая строка уже стоит. Расставь остальные полоски по порядку.',
      'Now build the skeleton of your page. The first line is already there. Put the other strips in order.'),
    rules: {
      html: L3('html birinchi ochiladi va oxirida yopiladi: butun sahifa uning ichida.',
      'html открывается первым и закрывается последним: внутри него вся страница.',
      'html opens first and closes last: the whole page is inside it.'),
      pair: L3('Yopuvchi teg o‘zining ochuvchi tegidan keyin turishi kerak.',
      'Закрывающий тег должен стоять после своего открывающего.',
      'A closing tag must come after its opening tag.'),
      order: L3('Avval head qismi, undan keyin body qismi keladi.', 'Сначала идёт head, потом body.', 'Put head before body.'),
      headClose: L3('body boshlanishidan oldin head yopilishi kerak.', 'head нужно закрыть до того, как начнётся body.', 'Close head before body starts.'),
      title: L3('title head ichida turishi kerak.', 'title должен стоять внутри head.', 'title must be inside head.'),
      text: L3('Sahifa matni body ichida turishi kerak.', 'Текст страницы должен стоять внутри body.', 'The page text must be inside body.')
    },
    hints: [L3('Qaysi teg birinchi ochilib, oxirida yopiladi?', 'Какой тег открывается первым и закрывается последним?', 'Which tag opens first and closes last?'),
      L3('html ichida avval title bilan head, keyin matn bilan body keladi.',
      'Внутри html сначала head с title, потом body с текстом.',
      'Inside html: first head with title, then body with the text.'),
      L3('Belgilangan ikki qatorning o‘rnini almashtiring.', 'Поменяй местами две отмеченные полоски.', 'Swap the two marked strips.')],
    ok: L3('Karkas to‘g‘ri yig‘ildi: sahifa nomi head ichida, matn body ichida!',
      'Каркас собран правильно: название — в head, текст — в body!',
      'The skeleton is right: the page name is in head, the text is in body!'),
    ask: L3('Qatorlarni tartib bilan qo‘ying', 'Расставь полоски по порядку', 'Put the strips in order')
  },
  s14: {
    eyebrow: L3('Matn yorliqqa tushib qoldi', 'Текст попал на вкладку', 'Text on the tab'),
    say: L3('Sahifa matni yorliqdagi sahifa nomiga qo‘shilib ketdi, oyna esa bo‘sh. Qaysi yopuvchi teg yetishmayapti?',
      'Текст страницы попал в название на вкладке, а окно пустое. Какого закрывающего тега не хватает?',
      'The page text ended up in the page name on the tab, and the window is empty. Which closing tag is missing?'),
    opts: ['</title>', '<title>', '</head>'],
    why: {
      '<title>': L3('Bu ochuvchi teg. title allaqachon ochilgan, endi uni yopish kerak.',
      'Это открывающий тег. title уже открыт, теперь его нужно закрыть.',
      'That’s an opening tag. title is already open. Now it needs to be closed.'),
      '</head>': L3('head keyinroq yopiladi. Avval sahifa nomi tugashi kerak, shuning uchun title tegini yoping.',
      'head закроется позже. Сначала должно закончиться название — закрой title.',
      'head closes later. First the page name has to end, so close title.')
    },
    ok: L3('Yopuvchi title tegi hammasini tuzatdi: sahifa nomi yorliqda, matn esa oynada!',
      'Закрывающий тег title всё исправил: название на вкладке, текст в окне!',
      'The closing title tag fixed it: the page name is on the tab, the text is in the window!'),
    ask: L3('Yetishmayotgan tegni bo‘sh joyga torting', 'Перетащи недостающий тег в пустое место', 'Drag the missing tag into the empty place')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang, bu sizning sahifangiz!', 'Посмотри, это твоя страница!', 'Look, this is your page!'), k: null },
      { text: L3('html sahifaning hamma qismlarini o‘z ichiga oladi. Uning ichida head va body bor.',
      'html объединяет все части страницы. Внутри него — head и body.',
      'html holds all the parts of the page. Inside it are head and body.'), k: 'html' },
      { text: L3('head ichida sahifa haqidagi ma’lumot turadi. U oynada ko‘rinmaydi.',
      'В head — сведения о странице. В окне их не видно.',
      'head holds information about the page. You don’t see it in the window.'), k: 'head' },
      { text: L3('head ichidagi title sahifa nomini belgilaydi. Brauzer uni yorliqda ko‘rsatadi.',
      'title внутри head задаёт название страницы. Браузер показывает его на вкладке.',
      'title inside head sets the page name. The browser shows it on the tab.'), k: 'title' },
      { text: L3('body ichida oynada ko‘rinadigan hamma narsa bor: matn, rasm, tugmalar.',
      'В body — всё, что видно в окне: текст, картинки, кнопки.',
      'body holds everything you see in the window: text, pictures, buttons.'), k: 'body' },
      { text: L3('Tabriklayman! Birinchi HTML sahifangiz tayyor. Undagi nom ham, matn ham sizniki!',
      'Ура! Твоя первая HTML-страница готова. В ней твоё название и твой текст!',
      'Hooray! Your first HTML page is ready. The name and the text are yours!'), k: null }
    ],
    roles: {
      html: L3('html — hamma qismlarni o‘z ichiga oladi', 'html — объединяет все части страницы', 'html — holds all the parts of the page'),
      head: L3('head — sahifa haqida ma’lumot', 'head — сведения о странице', 'head — information about the page'),
      title: L3('title — yorliqdagi sahifa nomi', 'title — название на вкладке', 'title — the page name on the tab'),
      body: L3('body — oynada ko‘rinadigan hamma narsa', 'body — всё, что видно в окне', 'body — everything you see in the window')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
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
// Ширина поля — по тексту (или подсказке-примеру), высота — по переносам.
// Ширину меряем холстом тем же шрифтом, что у поля; дальше её ограничивает
// строка (max-width: 100%, flex-shrink), и тогда текст переносится.
let _growCtx = null;
function fitGrow(el) {
  if (!el) return;
  const cs = getComputedStyle(el);
  if (!_growCtx) _growCtx = document.createElement('canvas').getContext('2d');
  if (_growCtx) {
    _growCtx.font = cs.font || (cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily);
    const txt = el.value || el.placeholder || '';
    const w = Math.ceil(_growCtx.measureText(txt).width) + parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0) + 8;
    el.style.width = w + 'px';
  }
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
function InlineInput({ value, onChange, placeholder, label, max = 40, inputRef, onEnter, cls, onFocus }) {
  // РАСТЁТ ПО ТЕКСТУ (заказчик, 17.10.2026): сначала в ширину — поле ровно по
  // тексту и расширяется по мере набора; упёрлось в край строки — текст
  // переносится внутри поля, и тогда оно растёт в высоту. Видно всё написанное.
  // Поле — textarea; Enter строку не переносит, а работает, как раньше.
  const pick = usePick();
  const ref = useRef(null);
  const setRef = (el) => { ref.current = el; if (inputRef) inputRef.current = el; };
  const fit = () => fitGrow(ref.current);
  useLayoutEffect(fit, [value]);
  useEffect(() => {
    const host = ref.current && ref.current.parentElement;
    if (typeof ResizeObserver === 'undefined' || !host) {
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
    const ro = new ResizeObserver(() => fit());
    ro.observe(host);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <textarea ref={setRef} rows={1} className={'tk-input tk-grow' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onFocus={onFocus} onChange={(e) => onChange(e.target.value.replace(/\r?\n/g, ' '))}
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

// Знак в кавычках («<», «/», “>”) нужен глазам: в реплике он уже назван словами
// («угловая скобка», «косая черта»). В озвучку он не идёт — иначе сервис читает
// сырой символ, а «<» превращается в «уголок» не в том падеже.
const KZ_QUOTED_SIGN = /[\s:—–-]*[«“"]\s*[<>\/\\]\s*[»”"]/g;
const spokenHtmlL2 = spokenHtml;
// eslint-disable-next-line no-func-assign
spokenHtml = (text, lang) => spokenHtmlL2(String(text || '').replace(KZ_QUOTED_SIGN, ''), lang);

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { magic: 1, magicWin: 1, sayTag: 1, order1: 1, order2: 1, order3: 1, sayAsk: 1, top: 1, bottom: 1, bottomAsk: 1, msgs: 1, opened: 1, flew: 1, out: 1, doctype: 1, back: 1, cards: 1, items: 1 });
Object.assign(NOT_SPOKEN_IN, { cards: { title: 1 }, items: { id: 1, want: 1 } });

// Сгенерировано tools/kollazh/paper-data.mjs из assets/paper.mp3 — не править руками.
const PAPER_MP3 = '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';

// Шорох бумаги: звучит, пока бумажная вырезка движется (ступенчатые анимации
// kz… и полёт частей), и стихает, как только движение кончилось. Бесконечные
// движения (дрожь, взмах руки, огонёк) не шуршат. Выключенный звук урока
// (_soundOff канона) и «меньше движения» — тишина.
const PAPER_ANIMS = { kzDrop: 1, kzRise: 1, kzLeft: 1, kzRight: 1, kzPop: 1, kzStamp: 1, kzOut: 1, kzOutL: 1, kzShake: 1, kzScatter: 1, kzAsmIn: 1, kzSlideUp: 1, kzSlideUnder: 1 };
// Громкость шороха: фон, тише голоса и звуков ответа (заказчик: 0.11; было 0.55, потом 0.22).
const PAPER_VOL = 0.11;
const PAPER_PROPS = { translate: 1, scale: 1, rotate: 1, transform: 1 };
const _pp = { ctx: null, buf: null, src: null, gain: null, live: new Map(), stopT: 0, pruneT: 0 };

function paperCtx() {
  if (_pp.ctx) return _pp.ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  _pp.ctx = new AC();
  _pp.ctx.onstatechange = () => { if (_pp.ctx.state === 'running' && _pp.live.size) paperOn(); };
  try {
    const bin = atob(PAPER_MP3);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    _pp.ctx.decodeAudioData(bytes.buffer, (b) => { _pp.buf = b; if (_pp.live.size) paperOn(); }, () => {});
  } catch (e) { /* без звука */ }
  return _pp.ctx;
}

function paperOn() {
  clearTimeout(_pp.stopT);
  if (_soundOff || _pp.src) return;
  const ctx = paperCtx();
  if (!ctx || !_pp.buf) return;
  // Звук ещё не разрешён (урок открыт без касания) — шорох начнётся, как только
  // браузер его пустит (onstatechange), если движение ещё идёт.
  if (ctx.state !== 'running') { ctx.resume().catch(() => {}); return; }
  const src = ctx.createBufferSource(), g = ctx.createGain(), t = ctx.currentTime;
  src.buffer = _pp.buf;
  src.loop = true;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(PAPER_VOL, t + 0.03);
  src.connect(g); g.connect(ctx.destination);
  src.start(t, Math.random() * Math.max(0, _pp.buf.duration - 1));   // каждый раз — другой кусок шороха
  _pp.src = src; _pp.gain = g;
}

function paperOff() {
  const src = _pp.src, g = _pp.gain;
  _pp.src = null; _pp.gain = null;
  if (!src) return;
  const t = _pp.ctx.currentTime;
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  src.stop(t + 0.1);
}

// Движение кончилось: короткая выдержка, чтобы соседние вырезки с задержкой
// (лесенка влёта) шуршали одним звуком, а не щёлкали.
function paperCheck() {
  const now = Date.now();
  _pp.live.forEach((t0, k) => { if (!k.el.isConnected || now - t0 > 2500) _pp.live.delete(k); });
  clearTimeout(_pp.stopT);
  if (!_pp.live.size) _pp.stopT = setTimeout(() => { if (!_pp.live.size) paperOff(); }, 160);
}

function usePaperSound() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    paperCtx();   // сразу: пока собирается первая сцена, звук успеет раскодироваться
    const wake = () => { if (_pp.ctx && _pp.ctx.state !== 'running') _pp.ctx.resume().catch(() => {}); };
    const keys = new Map();   // элемент + имя движения → ключ в _pp.live
    const keyOf = (el, name) => {
      let m = keys.get(el);
      if (!m) { m = {}; keys.set(el, m); }
      return m[name] || (m[name] = { el, name });
    };
    const start = (el, name) => { _pp.live.set(keyOf(el, name), Date.now()); paperOn(); };
    const end = (el, name) => { _pp.live.delete(keyOf(el, name)); paperCheck(); };
    const onAnimStart = (e) => {
      if (!PAPER_ANIMS[e.animationName]) return;
      if (getComputedStyle(e.target).animationIterationCount.indexOf('infinite') >= 0) return;
      start(e.target, e.animationName);
    };
    const onAnimEnd = (e) => { if (PAPER_ANIMS[e.animationName]) end(e.target, e.animationName); };
    const isCut = (e) => PAPER_PROPS[e.propertyName] && e.target.classList && e.target.classList.contains('kz-cut');
    const onTrStart = (e) => { if (isCut(e)) start(e.target, 'tr:' + e.propertyName); };
    const onTrEnd = (e) => { if (isCut(e)) end(e.target, 'tr:' + e.propertyName); };
    // Вырезка исчезла посреди движения (смена экрана) — событий конца не будет.
    _pp.pruneT = setInterval(() => { if (_pp.live.size) paperCheck(); }, 300);
    const ev = [['animationstart', onAnimStart], ['animationend', onAnimEnd], ['animationcancel', onAnimEnd],
      ['transitionrun', onTrStart], ['transitionend', onTrEnd], ['transitioncancel', onTrEnd], ['pointerdown', wake], ['keydown', wake]];
    ev.forEach(([n, f]) => document.addEventListener(n, f, true));
    return () => {
      ev.forEach(([n, f]) => document.removeEventListener(n, f, true));
      clearInterval(_pp.pruneT); clearTimeout(_pp.stopT);
      _pp.live.clear(); paperOff();
    };
  }, []);
}

// =============================================================================
// БУМАЖНЫЙ НАБОР. Вырезка (Cut): внешний слой — движение и тень, внутренний —
// бумага с рваным краем (clip-path) и фактурой. Рваный край считается один раз
// по зерну (seed): одна и та же вырезка всегда одинаковая.
// =============================================================================
const KZ = { kraft: '#D8C4A1', paper: '#EFE7D6', face: '#F2D7BC', cream: '#FBF6EA', coral: '#E0643F', mustard: '#F0B13F', teal: '#2A8C7E', ink: '#1F2A44' };
const kzRnd = (seed) => { let s = (Math.abs(seed) * 7919 + 104729) % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };
const TORN = {};
// Рваный прямоугольник: зубцы по четырём сторонам; amp — глубина зубца в % по
// короткой стороне, asp — ширина/высота вырезки (чтобы зубцы были одинаковыми).
function torn(seed, n, amp, asp) {
  const k = seed + ':' + n + ':' + amp + ':' + asp;
  if (TORN[k]) return TORN[k];
  const r = kzRnd(seed);
  const a = asp || 1;
  const ay = a >= 1 ? amp : amp * a, ax = a >= 1 ? amp / a : amp;
  const f = (v) => v.toFixed(2) + '%';
  const nx = Math.max(4, Math.round(n * Math.max(1, a))), ny = Math.max(4, Math.round(n / Math.min(1, a)));
  const p = [];
  for (let i = 0; i < nx; i += 1) p.push(f((i / nx) * 100) + ' ' + f(r() * ay));
  for (let i = 0; i < ny; i += 1) p.push(f(100 - r() * ax) + ' ' + f((i / ny) * 100));
  for (let i = 0; i < nx; i += 1) p.push(f(100 - (i / nx) * 100) + ' ' + f(100 - r() * ay));
  for (let i = 0; i < ny; i += 1) p.push(f(r() * ax) + ' ' + f(100 - (i / ny) * 100));
  TORN[k] = 'polygon(' + p.join(', ') + ')';
  return TORN[k];
}
// Рваный круг (голова, круг в углу листа).
function tornRound(seed, n, amp) {
  const k = 'o' + seed + ':' + n + ':' + amp;
  if (TORN[k]) return TORN[k];
  const r = kzRnd(seed);
  const p = [];
  for (let i = 0; i < n; i += 1) {
    const t = (i / n) * Math.PI * 2;
    const rad = 50 - r() * amp;
    p.push((50 + Math.cos(t) * rad).toFixed(2) + '% ' + (50 + Math.sin(t) * rad).toFixed(2) + '%');
  }
  TORN[k] = 'polygon(' + p.join(', ') + ')';
  return TORN[k];
}
const TRI = 'polygon(4% 2%, 30% 12%, 62% 22%, 98% 38%, 70% 58%, 44% 76%, 14% 98%, 9% 62%, 6% 30%)';

function Cut({ c, seed = 1, n = 10, amp = 3, asp = 1, round, clip, x, y, w, h, r = 0, anim, dl, cls, hl, hlc, boil, onClick, label, children, style, dp }) {
  const st = Object.assign({}, x !== undefined ? { left: x + '%', top: y + '%', width: w + '%', height: h + '%' } : {},
    { '--r': r + 'deg', '--dl': (dl || 0) + 's', '--bd': ((seed % 7) * 0.17).toFixed(2) + 's' }, hlc ? { '--hl': hlc } : {}, dp ? { '--dp': dp } : {}, style || {});
  const cp = clip || (round ? tornRound(seed, n * 3, amp) : torn(seed, n, amp, asp));
  const tap = !!onClick;
  return (
    <span className={'kz-cut' + (anim ? ' kz-a-' + anim : '') + (hl ? ' is-hl' : '') + (boil ? ' kz-boil' : '') + (tap ? ' is-tap' : '') + (cls ? ' ' + cls : '')}
      style={st} onClick={onClick} role={tap ? 'button' : undefined} tabIndex={tap ? 0 : undefined} aria-label={label}
      onKeyDown={tap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}>
      <span className="kz-cut-in" style={{ background: c, clipPath: cp, WebkitClipPath: cp }}>{children}</span>
    </span>
  );
}

// Лист на крафтовом столе + вырезки по углам (скотч, треугольник, круг) —
// они сдвигаются за пальцем на разную глубину (параллакс).
function Sheet({ children, cls }) {
  const cp = torn(5, 30, 1.1, 1.6);
  return (
    <div className={'kz-sheet' + (cls ? ' ' + cls : '')}>
      <div className="kz-sheet-wrap"><div className="kz-sheet-in" style={{ clipPath: cp, WebkitClipPath: cp }} /></div>
      <Cut c={KZ.mustard} seed={11} n={8} amp={10} asp={5} r={-32} cls="kz-deco kz-deco-tape" dp={9} />
      <Cut c={KZ.coral} clip={TRI} r={8} cls="kz-deco kz-deco-tri" dp={12} />
      <Cut c={KZ.teal} round seed={13} n={8} amp={5} cls="kz-deco kz-deco-dot" dp={7} />
      <div className="kz-sheet-body">{children}</div>
    </div>
  );
}

// Строка задания — бумажная полоска; ступень подсказки встаёт на её место.
function KzAsk({ text, hint, n }) {
  const pick = usePick();
  return (
    <div className="kz-ask-wrap">
      <p className={'kz-ask' + (hint ? ' is-hint' : '')} aria-live="polite">
        {n ? <span className="kz-ask-n">{n}</span> : null}{pick(hint || text)}
      </p>
    </div>
  );
}

// Тег: коралловые уголки и черта, имя чернилами.
function TagK({ t, close }) {
  return <span className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span>{close ? <span className="kz-tk-b">/</span> : null}<span className="kz-tk-n">{t}</span><span className="kz-tk-b">{'>'}</span></span>;
}
const tagText = (t, close) => '<' + (close ? '/' : '') + t + '>';

// Бирка на скотче.
function KzLabel({ t, close, raw, cls, style, onClick, led, on, hl, flow, anim, dl, disabled }) {
  const inner = (
    <>
      <span className="kz-label-tape" aria-hidden="true" />
      <span className="kz-label-paper">{raw ? <span translate="no">{raw}</span> : <TagK t={t} close={close} />}</span>
      <Led on={!!led} />
    </>
  );
  const c = 'kz-label' + (flow ? ' kz-flow' : '') + (onClick ? ' is-tap' : '') + (led ? ' is-led' : '') + (on ? ' is-on' : '') + (hl ? ' is-hl' : '') + (anim ? ' kz-a-' + anim : '') + (cls ? ' ' + cls : '');
  const st = Object.assign({ '--dl': (dl || 0) + 's' }, style || {});
  if (onClick) return <button type="button" className={c} style={Object.assign({ border: 'none', background: 'none', padding: 0 }, st)} onClick={onClick} disabled={disabled}>{inner}</button>;
  return <span className={c} style={st}>{inner}</span>;
}

// Код — бумажные полоски. Строка: { k, d, parts: [узлы], cls, onTap, led, disabled }.
// Строка: { k, d, parts, cls, onTap, led, disabled, place, move }.
// move — бумажные кнопки ▲ ▼ справа от строки: { up, down } (обработчики или null),
// { hide: true } — пустое место той же ширины, чтобы строки не прыгали.
function KzCode({ lines, cls }) {
  const pick = usePick();
  return (
    <div className={'kz-code' + (cls ? ' ' + cls : '')} translate="no">
      {lines.map((ln, i) => {
        const st = Object.assign({ '--d': ln.d || 0, '--r': ((i % 2 ? 1 : -1) * (0.25 + (i % 3) * 0.12)).toFixed(2) + 'deg' }, ln.style || {});
        const c = 'kz-line' + (ln.cls ? ' ' + ln.cls : '');
        const body = ln.onTap ? (
          <button key={ln.move ? 'b' : (ln.k || i)} type="button" className={c + ' kz-tap'} style={st} disabled={!!ln.disabled} onClick={ln.onTap} data-place={ln.place}>
            {React.Children.toArray(ln.parts)}<Led on={!!ln.led} />
          </button>
        ) : <div key={ln.move ? 'b' : (ln.k || i)} className={c} style={st} data-place={ln.place}>{React.Children.toArray(ln.parts)}<Led on={!!ln.led} /></div>;
        if (!ln.move) return body;
        const mv = ln.move;
        return (
          <div key={ln.k || i} className="kz-line-row">
            {body}
            <span className={'kz-move' + (mv.hide ? ' is-hide' : '')}>
              {['up', 'down'].map((d) => (
                <button key={d} type="button" className={'kz-move-b is-' + d} disabled={mv.hide || !mv[d] || !!ln.disabled}
                  onClick={mv[d] || undefined} aria-label={pick(d === 'up' ? UI.up : UI.down)} tabIndex={mv.hide ? -1 : undefined}>
                  <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1.2 6.8 6 2 10.8 6.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
const T_ = (t, close) => <TagK t={t} close={close} />;
const W_ = (s) => <span className="kz-txt">{s}</span>;

// БУМАЖНЫЙ ЧЕЛОВЕЧЕК. Части по порядку сборки: тело, голова, руки, ноги, лицо.
// build — сколько частей уже на листе (каждая влетает своим движением).
// out — части разлетаются (превращение в страницу).
const MAN_PARTS = ['body', 'head', 'armL', 'armR', 'legL', 'legR', 'face'];
function PaperMan({ build = 7, out, headOpen, hl, onHead, onBody, onTitle, titleText, titleGone, anim = true, wave }) {
  const has = (k) => MAN_PARTS.indexOf(k) < build;
  const A = (a, d) => (out ? { anim: 'out', dl: d * 0.07 } : anim ? { anim: a, dl: d } : {});
  return (
    <div className="kz-man">
      {has('legL') ? <Cut c={KZ.ink} seed={41} n={4} amp={9} asp={0.3} x={38} y={64} w={7.5} h={27} r={-2} {...A('rise', 0.1)} /> : null}
      {has('legR') ? <Cut c={KZ.ink} seed={42} n={4} amp={9} asp={0.3} x={54.5} y={64} w={7.5} h={27} r={2} {...A('rise', 0.2)} /> : null}
      {has('armL') ? <Cut c={KZ.ink} seed={43} n={5} amp={12} asp={5} x={4} y={37} w={26} h={5.5} r={22} cls={wave ? 'kz-wave-l' : ''} {...A('left', 0)} /> : null}
      {has('armR') ? <Cut c={KZ.ink} seed={44} n={5} amp={12} asp={5} x={70} y={37} w={26} h={5.5} r={-22} cls={wave ? 'kz-wave-r' : ''} {...A('right', 0.08)} /> : null}
      {has('body') ? (
        <Cut c={KZ.teal} seed={45} n={9} amp={3} asp={1.15} x={27} y={29} w={46} h={38} r={-1} {...A('drop', 0)} boil hl={hl === 'body'} hlc={KZ.teal}
          onClick={onBody} label="body" />
      ) : null}
      {titleText && !titleGone ? (
        <Cut c="var(--kz-piece)" seed={46} n={6} amp={8} asp={3} x={24} y={10} w={52} h={12} r={-3} cls="kz-man-title" anim="pop" onClick={onTitle} label="title">
          <span className="kz-man-title-t">{titleText}</span>
        </Cut>
      ) : null}
      {has('head') ? (
        <Cut c={KZ.face} round seed={47} n={9} amp={4} x={31} y={0} w={38} h={33} {...A('drop', 0.18)} boil hl={hl === 'head'} hlc={KZ.mustard}
          onClick={onHead} label="head" style={{ translate: headOpen ? '0 -38%' : '0 0', transition: 'translate .42s steps(5, end)' }}>
          {has('face') ? (
            <span className={'kz-face' + (out ? '' : anim ? ' kz-a-pop' : '')} style={{ '--dl': '0.55s' }} aria-hidden="true">
              <i className="kz-eye" style={{ left: '33%' }} /><i className="kz-eye" style={{ left: '60%' }} /><i className="kz-smile" />
            </span>
          ) : null}
        </Cut>
      ) : null}
    </div>
  );
}

// Рамка html — четыре коралловые полоски; любую можно убрать (s4).
function Frame({ sides, anim, hl }) {
  const S = sides || { top: 1, right: 1, bottom: 1, left: 1 };
  return (
    <>
      {S.top ? <Cut c={KZ.coral} seed={51} n={12} amp={22} asp={22} x={0} y={0} w={100} h={4.2} r={-0.4} anim={anim ? 'drop' : null} hl={hl} /> : null}
      {S.right ? <Cut c={KZ.coral} seed={52} n={12} amp={22} asp={0.045} x={95.6} y={0} w={4.4} h={100} r={0.3} anim={anim ? 'right' : null} dl={0.1} hl={hl} /> : null}
      {S.bottom ? <Cut c={KZ.coral} seed={53} n={12} amp={22} asp={22} x={0} y={95.8} w={100} h={4.2} r={0.4} anim={anim === 'all' ? 'rise' : S.bottom === 'new' ? 'left' : null} dl={0.2} hl={hl} /> : null}
      {S.left ? <Cut c={KZ.coral} seed={54} n={12} amp={22} asp={0.045} x={0} y={0} w={4.4} h={100} r={-0.3} anim={anim ? 'left' : null} dl={0.15} hl={hl} /> : null}
    </>
  );
}

// Сцена «человечек в рамке»: рамка по краю, человечек внутри.
function ManBox({ frame, frameSides, frameAnim, frameHl, labels, man, cls, children }) {
  return (
    <div className={'kz-stagebox' + (cls ? ' ' + cls : '')}>
      {frame ? <Frame sides={frameSides} anim={frameAnim} hl={frameHl} /> : null}
      <div className="kz-manbox">{man}</div>
      {labels}
      {children}
    </div>
  );
}

// БУМАЖНЫЙ БРАУЗЕР — узнаваемый Chrome в Windows, только из бумаги: тёмная
// полоса вкладок (вкладка с значком, именем и крестиком, «+»), кнопки окна
// «– □ ×», полоса со стрелками и адресной строкой, под ней страница.
function PaperBrowser({ title, children, tabHl, pageHl, stamp, short, cls, tabRef, pageRef }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'kz-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar">
        <span ref={tabRef} key={'tab' + (stamp || 0)} className={'kz-br-tab' + (tabHl ? ' is-hl' : '') + (stamp ? ' kz-a-stamp' : '')}>
          <i className="kz-br-fav" aria-hidden="true" />
          <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
          <i className="kz-br-x" aria-hidden="true" />
        </span>
        <span className="kz-br-plus" aria-hidden="true" />
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows" aria-hidden="true"><i className="kz-ar-l" /><i className="kz-ar-r" /></span>
        <span className="kz-br-url"><i className="kz-br-lock" aria-hidden="true" /><span>index.html</span></span>
      </div>
      <div className="kz-br-body">
        <Cut c={KZ.cream} seed={32} n={16} amp={1.1} asp={1.6} cls="kz-br-paper" />
        <div ref={pageRef} className="kz-br-page">{children}</div>
      </div>
    </div>
  );
}
// Содержимое страницы — бумажные вырезки: строки текста, картинка, кнопка.
function PageBits({ text, bits, anim }) {
  const pick = usePick();
  return (
    <div className="kz-bits">
      {text ? <div className={'kz-br-text' + (anim ? ' kz-a-drop' : '')}>{text}</div> : null}
      {bits ? (
        <div className="kz-bits-row">
          <span className="kz-bit-lines">
            {[0, 1, 2].map((i) => <Cut key={i} c={KZ.ink} seed={60 + i} n={6} amp={14} asp={9} cls="kz-bit-line" anim={anim ? 'left' : null} dl={0.1 * i} style={{ width: (88 - i * 18) + '%' }} />)}
          </span>
          <Cut c={KZ.teal} seed={64} n={6} amp={5} cls="kz-bit-pic" anim={anim ? 'pop' : null} dl={0.35}>
            <span className="kz-pic-sun" /><span className="kz-pic-mnt" />
          </Cut>
          <Cut c={KZ.coral} seed={65} n={5} amp={8} asp={3} cls="kz-bit-btn" anim={anim ? 'rise' : null} dl={0.5}><span>{pick(UI.play)}</span></Cut>
        </div>
      ) : null}
    </div>
  );
}

// Мини-страница в разрезе (как финальный кадр ролика): рамка html, голова head
// с title, тело body с текстом — с бирками.
function PageCollage({ title, text, show, hl, anim }) {
  const S = show || { doc: 1, html: 1, head: 1, title: 1, body: 1, text: 1 };
  const pick = usePick();
  const H = (k) => (Array.isArray(hl) ? hl.indexOf(k) >= 0 : hl === k);   // подсветка: одна часть или несколько
  return (
    <div className="kz-collage">
      {S.doc ? <KzLabel raw="<!DOCTYPE html>" cls={'kz-col-doc' + (H('doc') ? ' is-on' : '')} anim={anim ? 'drop' : null} /> : null}
      {S.html ? (
        <Cut c={KZ.coral} seed={71} n={14} amp={1.8} asp={1.3} cls="kz-col-html" anim={anim ? 'drop' : null} hl={H('html')} hlc={KZ.coral}>
          <span className="kz-col-in">
            {S.head ? (
              <Cut c={KZ.mustard} seed={72} n={12} amp={4} asp={4} cls="kz-col-head" anim={anim ? 'left' : null} hl={H('head') || H('title')} hlc={KZ.mustard}>
                {S.title ? <span className={'kz-col-title' + (anim ? ' kz-a-pop' : '')}><TagK t="title" />{title || pick(UI.mySite)}<TagK t="title" close /></span> : null}
              </Cut>
            ) : null}
            {S.body ? (
              <Cut c={KZ.teal} seed={73} n={12} amp={3} asp={1.8} cls="kz-col-body" anim={anim ? 'rise' : null} hl={H('body')} hlc={KZ.teal}>
                {S.text ? <span className={'kz-col-text' + (anim ? ' kz-a-pop' : '')}>{text}</span> : null}
              </Cut>
            ) : null}
          </span>
        </Cut>
      ) : null}
      {S.html ? <KzLabel t="html" cls="kz-col-lbl kz-col-lbl-html" /> : null}
      {S.html && S.head ? <KzLabel t="head" cls="kz-col-lbl kz-col-lbl-head" /> : null}
      {S.html && S.body ? <KzLabel t="body" cls="kz-col-lbl kz-col-lbl-body" /> : null}
    </div>
  );
}

// ЛЕСЕНКА ПОДСКАЗОК: ступень поднимает лампочка в шапке или затруднение.
function useKzLadder(active) {
  const [lv, setLv] = useState(0);
  const asked = useRef(0);
  const pulse = useHintPulse();
  const p0 = useRef(pulse);
  const act = useRef(active);
  act.current = active;
  useEffect(() => {
    if (pulse === p0.current) return;
    p0.current = pulse;
    if (!act.current) return;
    asked.current += 1;
    setLv((l) => Math.min(3, l + 1));
  }, [pulse]);
  const bump = useCallback(() => setLv((l) => Math.min(3, l + 1)), []);
  const reset = useCallback(() => { setLv(0); asked.current = 0; }, []);
  return { lv, bump, reset, asked };
}
const hintAt = (lv, hints) => (lv > 0 && hints && hints[lv - 1] ? hints[lv - 1] : null);
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;

// ПЕРЕТАСКИВАНИЕ: деталь тянется за пальцем; место — [data-place] под пальцем
// при отпускании. Короткое касание остаётся нажатием («выбери, потом место»).
// ПЕРЕТАСКИВАНИЕ вырезок: взятая вырезка на столе становится пунктирным
// следом (is-lifted), за пальцем летит её бумажная копия — приподнятая (тень
// больше), чуть наклоняется по ходу движения; место под ней подсвечивается.
// Не туда или мимо (onDrop вернул false или места нет) — копия ступенчато
// возвращается на своё место. Нажатие без сдвига остаётся обычным касанием.
function useKzDrag(onDrop) {
  const drag = useRef(null);
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;
  const [ghost, setGhost] = useState(null);
  const [hover, setHover] = useState(null);
  const backT = useRef(0);
  const start = (e, payload, label) => {
    if (e.button > 0) return;
    const el = e.currentTarget;
    drag.current = { payload, label, x: e.clientX, y: e.clientY, lx: e.clientX, rot: 0, moved: false, el, touch: e.pointerType === 'touch' };
  };
  useEffect(() => {
    const placeAt1 = (x, y) => { const el = document.elementFromPoint(x, y); const z = el && el.closest && el.closest('[data-place]'); return z ? z.getAttribute('data-place') : null; };
    // Копия летит выше пальца (на телефоне — заметно выше), и ученик целится ею:
    // место ищется сначала под центром копии, потом под пальцем.
    const placeAt = (x, y, touch) => placeAt1(x, y - (touch ? 40 : 14)) || placeAt1(x, y);
    const lift = (d, on) => { if (d && d.el && d.el.classList) d.el.classList.toggle('is-lifted', on); };
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 7) { d.moved = true; lift(d, true); clearTimeout(backT.current); }
      if (!d.moved) return;
      // Наклон по ходу движения, ступеньками по 3° — как бумажка в пальцах.
      d.rot = Math.max(-14, Math.min(14, d.rot * 0.7 + (e.clientX - d.lx) * 0.9));
      d.lx = e.clientX;
      setGhost({ label: d.label, x: e.clientX, y: e.clientY, rot: Math.round(d.rot / 3) * 3, touch: d.touch });
      setHover(placeAt(e.clientX, e.clientY, d.touch));
    };
    const up = (e) => {
      const d = drag.current;
      drag.current = null;
      setHover(null);
      if (!d || !d.moved) { setGhost(null); return; }
      const where = placeAt(e.clientX, e.clientY, d.touch);
      const res = where ? dropRef.current(d.payload, where, document.elementFromPoint(e.clientX, e.clientY)) : false;
      if (res !== false || !d.el || !d.el.isConnected || reduceMotion()) { setGhost(null); lift(d, false); return; }
      const r = d.el.getBoundingClientRect();
      setGhost({ label: d.label, x: r.left + r.width / 2, y: r.top + r.height / 2, rot: 0, back: true, touch: false });
      clearTimeout(backT.current);
      backT.current = setTimeout(() => { setGhost(null); lift(d, false); }, 300);
    };
    const cancel = () => { lift(drag.current, false); drag.current = null; setGhost(null); setHover(null); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => { clearTimeout(backT.current); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
  }, []);
  return { start, ghost, hover, active: !!ghost && !ghost.back };
}
function KzGhost({ ghost }) {
  if (!ghost) return null;
  return (
    <div className={'kz-ghost' + (ghost.back ? ' is-back' : '') + (ghost.touch ? ' is-touch' : '')} aria-hidden="true"
      style={{ left: ghost.x, top: ghost.y, '--gr': (ghost.rot || 0) + 'deg' }}>
      <span className="kz-ghost-in" translate="no">{ghost.label}</span>
    </div>
  );
}

// ПЕРЕЛЁТ вырезки к месту (stop-motion): ступенчато, с уменьшением до размера
// цели; в конце гаснет. Возвращает false, если лететь нечему.
function kzFly(el, to, ms) {
  if (!el || !to) return false;
  const d = ((ms || 780) / 1000).toFixed(2);
  const a = el.getBoundingClientRect(), b = to.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const k = Math.max(0.15, Math.min(b.width / a.width, b.height / a.height, 1.2));
  el.style.animation = 'none';
  el.style.zIndex = '60';
  el.style.transition = 'translate ' + d + 's steps(9, end), scale ' + d + 's steps(9, end), opacity .16s linear ' + (d - 0.1).toFixed(2) + 's';
  el.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
  el.style.scale = k.toFixed(3);
  el.style.opacity = '0';
  return true;
}

// РУКА-ПОКАЗ (по образцу DemoHand эталона, только бумажная): рука нажимает
// первую цель и, не отпуская, ведёт её копию ко второй — так показывается
// перетаскивание. Повторяет дважды, исчезает от первого касания ученика, на
// паузе стоит. Позиции — внутри листа (.kz-sheet-body).
function KzHand({ targets, run, label }) {
  const audio = useAudio();
  const pausedRef = useRef(false);
  pausedRef.current = !!(audio && audio.paused);
  const [pos, setPos] = useState(null);
  const [tap, setTap] = useState(false);
  const [carry, setCarry] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!run || gone) return undefined;
    const off = () => setGone(true);
    window.addEventListener('pointerdown', off, true);
    return () => window.removeEventListener('pointerdown', off, true);
  }, [run, gone]);
  useEffect(() => {
    if (!run || gone) { setPos(null); return undefined; }
    let dead = false;
    const tm = [];
    const at = (i) => {
      const el = targets[i] && targets[i]();
      const w = el && el.closest('.kz-sheet-body');
      if (!w) return null;
      const W = w.getBoundingClientRect(), R = el.getBoundingClientRect();
      return { x: R.left + R.width / 2 - W.left, y: R.top + R.height / 2 - W.top };
    };
    const later = (ms, f) => { tm.push(setTimeout(() => { if (!dead) f(); }, ms)); };
    let loop = 0;
    const cycle = () => {
      if (dead) return;
      if (pausedRef.current) { later(400, cycle); return; }
      if (loop >= 2) { setPos(null); return; }
      loop += 1;
      const a = at(0);
      if (!a) { later(400, cycle); return; }
      setTap(false); setCarry(false); setPos(a);
      if (reduceMotion()) return;
      // Взятая вырезка на столе — пунктирный след, как при настоящем перетаскивании.
      const src = () => targets[0] && targets[0]();
      const lift = (on) => { const el = src(); if (el && el.classList) el.classList.toggle('is-lifted', on); };
      later(800, () => { setTap(true); setCarry(true); lift(true); });
      later(1150, () => { const b = at(1); if (b) setPos(b); });
      later(2500, () => { setTap(false); setCarry(false); lift(false); });
      later(3300, cycle);
    };
    later(500, cycle);
    return () => {
      dead = true; tm.forEach(clearTimeout);
      const el = targets[0] && targets[0]();
      if (el && el.classList) el.classList.remove('is-lifted');
    };
  }, [run, gone]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!pos || !run || gone) return null;
  return (
    <span className="kz-hand-layer" aria-hidden="true">
    <span className={'kz-hand' + (tap ? ' is-tap' : '') + (carry ? ' is-carry' : '')} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      {carry && label ? <span className="kz-hand-ghost" translate="no">{label}</span> : null}
      <span className="kz-hand-ring" />
      <svg viewBox="0 0 40 48" width="38" height="46">
        <path d="M14 6a4 4 0 0 1 8 0v15a4 4 0 0 1 7 1 4 4 0 0 1 7 2v10c0 7-5 12-13 12h-3c-5 0-8-2-11-6l-6-9a3.6 3.6 0 0 1 5.6-4.4L14 30z"
          fill="#FBF6EA" stroke={KZ.ink} strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
    </span>
    </span>
  );
}

// Текст ученика (или образец) — сквозной для экранов 7–15.
const okText = (s) => hasLetters(s) && !hasTags(s);
const useMine = () => {
  const store = useStore();
  const pick = usePick();
  return { title: store.get('myTitle') || pick(UI.mySite), text: store.get('myText') || pick(UI.hello) };
};
function makeArtifact(store) {
  const t = store.get('myTitle'), x = store.get('myText');
  if (!t && !x) return null;
  return { type: 'html-page', title: t || '', text: x || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(t || '') + '</title>', '  </head>', '  <body>', '    ' + escHtml(x || ''), '  </body>', '</html>'].join('\n') };
}

// ПЕРЕХОД МЕЖДУ ЭКРАНАМИ «РАЗБОР И СБОРКА». По «Дальше» / «Назад» снимается
// неподвижная копия вырезок текущего листа; вырезки копии ступенчато (stop-motion)
// разлетаются от центра листа наружу с поворотом. Новый экран уже на месте
// (голос, кнопки, проверки работают как обычно), но ждёт, пока старое разлетится;
// потом его вырезки слетаются на свои места. Вырезки, у которых есть свой влёт
// (kz-a-drop и т. п.), влетают своим движением. При «меньше движения» — смена без
// анимации. Шорох бумаги включается сам (kzScatter, kzAsmIn — в PAPER_ANIMS).
const KZ_PIECES = '.kz-ask-wrap, .kz-br, .kz-line, .kz-scrap, .kz-btn, .kz-card, .kz-zone, .kz-label, .kz-slot, '
  + '.kz-stagebox > .kz-cut, .kz-manbox .kz-cut, .kz-collage, .kz-role, .kz-next, .kz-msg, .keys, .kz-tray > *';
const KZ_OUT_MS = 520;     // разлёт
const KZ_WAIT_MS = 300;    // новый экран ждёт, пока старое разлетается
const _kzT = { busy: 0, pending: false };

// Только верхние вырезки: деталь внутри другой детали летит вместе с ней.
const kzTop = (nodes) => {
  const all = Array.prototype.slice.call(nodes);
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
};
const kzRand = (a, b) => a + Math.random() * (b - a);

function kzSnapshotOut() {
  const sheet = kzLiveSheet();
  const stage = document.querySelector('.stage');
  if (!sheet || !stage) return false;
  const r = sheet.getBoundingClientRect();
  const clone = sheet.cloneNode(true);
  // Лист, скотч и вырезки по углам одинаковы на всех экранах — разлетается только содержимое.
  clone.querySelectorAll('.kz-sheet-wrap, .kz-deco').forEach((e) => e.remove());
  // Набранный текст в полях копии (значение textarea не копируется само).
  const src = sheet.querySelectorAll('textarea'), dst = clone.querySelectorAll('textarea');
  dst.forEach((t, i) => { if (src[i]) t.value = src[i].value; });
  const layer = document.createElement('div');
  layer.className = 'kz-snap';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  clone.style.width = '100%';
  clone.style.height = '100%';
  layer.appendChild(clone);
  // Не в саму панель экрана: она пересоздаётся при смене экрана и унесла бы снимок.
  (stage.parentNode || document.body).appendChild(layer);
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const reach = Math.max(window.innerWidth, window.innerHeight) * 0.75;
  kzTop(clone.querySelectorAll(KZ_PIECES)).forEach((el, i) => {
    const b = el.getBoundingClientRect();
    let dx = b.left + b.width / 2 - cx, dy = b.top + b.height / 2 - cy;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    // Наружу от центра, чуть вверх (как вырезки, сметённые со стола), со своим разбросом.
    el.style.setProperty('--ox', ((dx + kzRand(-0.25, 0.25)) * reach).toFixed(0) + 'px');
    el.style.setProperty('--oy', ((dy - 0.35 + kzRand(-0.2, 0.2)) * reach).toFixed(0) + 'px');
    el.style.setProperty('--or', kzRand(-38, 38).toFixed(0) + 'deg');
    el.style.setProperty('--od', ((i % 7) * 0.025).toFixed(3) + 's');
    el.classList.add('kz-out-go');
  });
  setTimeout(() => { if (layer.parentNode) layer.parentNode.removeChild(layer); }, KZ_OUT_MS + 260);
  return true;
}

// Настоящий лист экрана — не копия в снимке (React ставит новый экран после слоя снимка).
const kzLiveSheet = () => Array.prototype.slice.call(document.querySelectorAll('.kz-sheet')).find((x) => !x.closest('.kz-snap')) || null;

function kzAssembleIn() {
  const sheet = kzLiveSheet();
  if (!sheet) return;
  // Лист не проявляется заново: бумага остаётся на столе, меняются только вырезки.
  // Встроенным стилем и навсегда: снятый позже запрет перезапустил бы проявление (вспышка).
  sheet.style.animation = 'none';
  sheet.classList.add('kz-asm-wait');   // скрыт, свои влёты на паузе
  setTimeout(() => {
    const H = window.innerHeight, W = window.innerWidth;
    let n = 0;
    kzTop(sheet.querySelectorAll(KZ_PIECES)).forEach((el) => {
      const cs = getComputedStyle(el);
      // Свой влёт есть — пусть летит им (снимается с паузы вместе со всеми).
      if (cs.animationName !== 'none' && cs.animationIterationCount.indexOf('infinite') < 0) return;
      const fromLeft = n % 2 === 0;
      el.style.setProperty('--ix', ((fromLeft ? -1 : 1) * kzRand(0.25, 0.55) * W).toFixed(0) + 'px');
      el.style.setProperty('--iy', (kzRand(-0.55, -0.2) * H).toFixed(0) + 'px');
      el.style.setProperty('--ir', kzRand(-30, 30).toFixed(0) + 'deg');
      const dl = Math.min(0.3, n * 0.035);
      n += 1;
      el.style.animation = 'kzAsmIn .56s steps(1, end) ' + dl.toFixed(3) + 's both';
      // Снять, когда сел: иначе встроенная анимация перебьёт будущие (тряску, огонёк).
      setTimeout(() => { el.style.animation = ''; }, (0.56 + dl) * 1000 + 80);
    });
    sheet.classList.remove('kz-asm-wait');
  }, KZ_WAIT_MS);
}

// Обёртка навигации: снимок старого листа → смена экрана → сборка нового.
function useKzTransition(screenKey) {
  const go = useCallback((fn) => {
    if (!fn) return fn;
    return () => {
      const now = Date.now();
      if (now - _kzT.busy < KZ_WAIT_MS + 120) return;   // двойное нажатие не пролистывает экран
      _kzT.busy = now;
      if (!reduceMotion() && kzSnapshotOut()) _kzT.pending = true;
      fn();
    };
  }, []);
  useLayoutEffect(() => {
    if (!_kzT.pending) return;
    _kzT.pending = false;
    kzAssembleIn();
  }, [screenKey]);
  return go;
}

// =============================================================================
// S1. КРЮЧОК — бумажный человечек собирается из вырезок; нажали — его части
// разлетаются и садятся бумажной веб-страницей.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  // man — человечек на листе · fly — за ним сел браузер, голова летит на вкладку,
  // тело — в окно, руки и ноги разлетаются · page — бумажная страница
  const [phase, setPhase] = useState(solved ? 'page' : 'man');
  const [fresh, setFresh] = useState(false);   // превратили сейчас — страница влетает, а не стоит готовой
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && phase === 'man', 0);
  const sceneRef = useRef(null);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const later = (ms, f) => tm.current.push(setTimeout(f, ms));
  const fly = (el, to) => kzFly(el, to, 780);
  const turn = () => {
    if (!canTap || phase !== 'man') return;
    sfx('pop', true);
    setFresh(true);
    if (reduceMotion()) { put({ done: true }); setPhase('page'); sayNow(c.magic, 'wonder'); say(c.magicWin, 'point'); say(c.done, 'smile'); return; }
    setPhase('fly');
    // Браузер сначала садится (≈0,7 с), потом части летят к своим местам.
    later(720, () => {
      const sc = sceneRef.current;
      if (!sc) return;
      sfx('tap', true);
      fly(sc.querySelector('.kz-s1-man [aria-label="head"]'), sc.querySelector('.kz-br-tab'));
      fly(sc.querySelector('.kz-s1-man [aria-label="body"]'), sc.querySelector('.kz-br-body'));
    });
    later(1600, () => { put({ done: true }); setPhase('page'); sfx('ok', true); sayNow(c.magic, 'wonder'); say(c.magicWin, 'point'); say(c.done, 'smile'); });
  };
  // Подсветка идёт за речью: «на вкладке…» — вкладка, «а в окне…» — окно.
  const hlTab = phase === 'page' && speaker.text === c.magic;
  const hlWin = phase === 'page' && speaker.text === c.magicWin;
  const askText = phase === 'man' ? c.ask : c.askDone;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} />
        <div ref={sceneRef} className={'kz-scene kz-s1' + (phase === 'fly' ? ' kz-scatter' : '')}>
          {phase !== 'man' ? (
            <div className={'kz-col kz-s1-page' + (phase === 'fly' ? ' kz-a-drop' : '')}>
              <PaperBrowser title={phase === 'page' ? pick(UI.mySite) : ''} stamp={phase === 'page' && fresh ? 1 : 0} tabHl={hlTab} pageHl={hlWin}>
                {phase === 'page' ? <PageBits text={pick(UI.hello)} bits anim={fresh} /> : null}
              </PaperBrowser>
            </div>
          ) : null}
          {phase !== 'page' ? (
            <div className="kz-stagebox kz-s1-man">
              <div className="kz-manbox kz-manbox-free"><PaperMan onHead={turn} onBody={turn} hl={led ? 'body' : null} /></div>
            </div>
          ) : null}
        </div>
        {phase === 'man' ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S2. ПЛАН — четыре бумажные карточки открываются сами, по очереди: каждая
// переворачивается, когда Коди начинает о ней рассказывать. Открытую можно
// нажать — Коди повторит.
// =============================================================================
const CARD_C = [KZ.coral, KZ.mustard, KZ.teal, 'var(--kz-piece)'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }].concat(c.cards.map((k) => ({ text: k.say, pose: 'point' })), [{ text: c.done, pose: 'smile' }]));
  const [open, setOpen] = useState(solved ? 4 : 0);   // сколько карточек уже открыто
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const reach = (n) => {
    if (n <= open) return;
    setOpen(n);
    sfx('pop', true);
    if (n === 4) put({ done: true });
  };
  // Карточка открывается вместе с началом своей реплики.
  useEffect(() => {
    const i = c.cards.findIndex((k) => k.say === speaker.text);
    reach(i >= 0 ? i + 1 : speaker.text === c.done ? 4 : 0);
  }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  // Очередь реплик кончилась раньше (пропуск, тишина) — план открыт целиком.
  useEffect(() => { if (spoken) reach(4); }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const again = (i) => { if (canTap && i < open) sayNow(c.cards[i].say, 'point'); };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} n={open + '/4'} />
        <div className="kz-plan">
          {c.cards.map((card, i) => {
            const on = i < open;
            const now = on && speaker.text === card.say;
            return (
              <button key={i} type="button" className={'kz-card' + (on ? ' is-open' : '')} disabled={!on || !canTap} onClick={() => again(i)}
                aria-label={on ? pick(card.title) : String(i + 1)} style={{ '--dl': (i * 0.12) + 's' }}>
                <Cut c={on ? CARD_C[i] : 'var(--kz-piece)'} seed={80 + i} n={9} amp={3} asp={1.6} cls="kz-card-cut kz-a-drop" r={i % 2 ? 1.2 : -1.4} dl={i * 0.12}
                  hl={now} hlc={KZ.ink}>
                  <span className="kz-card-face" key={on ? 'o' : 'c'}>
                    {on ? <span className="kz-a-stamp">{pick(card.title)}</span> : <span className="kz-card-n">{i + 1}</span>}
                  </span>
                </Cut>
              </button>
            );
          })}
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S3. БИРКА ДЛЯ БРАУЗЕРА — человечек в рамке html; две бирки: открывающий и
// закрывающий тег. Ученик нажимает бирки по очереди (светится «нажми сюда»).
// =============================================================================
function S3({ p }) {
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.sayTag, pose: 'explain' }, { text: c.sayAsk, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved, n);
  const tagHl = speaker.text === c.sayTag;   // «Тег — это слово в угловых скобках…» — оба тега светятся
  const tapTop = () => { if (!canTap || n !== 0) return; sfx('tap', true); setN(1); sayNow(c.top, 'point'); say(c.bottomAsk, 'point'); };
  const tapBot = () => { if (!canTap || n !== 1) return; sfx('ok', true); setN(2); put({ done: true }); sayNow(c.bottom, 'explain'); say(c.done, 'smile'); };
  const asking = speaker.text === c.sayAsk || speaker.text === c.bottomAsk;
  const askText = solved || n === 2 ? c.done : n === 0 ? c.sayAsk : c.bottomAsk;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={solved ? null : n + '/2'} />
        <div className="kz-scene">
          <ManBox frame frameAnim={!solved} frameHl={speaker.text === c.say} man={<PaperMan anim={!solved} />}
            labels={<>
              <KzLabel t="html" cls="kz-frame-lbl-top" onClick={tapTop} disabled={!canTap || n !== 0} on={n >= 1} hl={tagHl} led={n === 0 && (led || asking) && canTap} />
              <KzLabel t="html" close cls="kz-frame-lbl-bot" onClick={tapBot} disabled={!canTap || n !== 1} on={n >= 2} hl={tagHl} led={n === 1 && (led || asking) && canTap} />
            </>} />
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S4. ЗАКРОЙ РАМКУ — у рамки нет нижнего края; ученик набирает </html>
// кнопками или с клавиатуры. Верно — край въезжает, бирка приклеивается.
// =============================================================================
function S4({ p }) {
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  // Пока Коди говорит «нет нижнего края» (и когда ученик медлит), пустое место
  // края на рамке и пустая строка в коде мигают вместе: это одно и то же место.
  const blink = !okNow && (speaker.text === c.say || led);
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const issue = tagTypingIssue(ty.val, 'html', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's4', type: 'write-closing', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const hint = hintAt(lad.lv, c.hints);
  const lines = [
    { k: 'o', d: 0, parts: [T_('html')] },
    { k: 'm', d: 1, parts: [<span key="m" className="kz-dim">…</span>] },
    { k: 'c', d: 0, cls: okNow ? 'is-new' : 'is-gap', parts: okNow ? [T_('html', true)] : [
      <span key="g" className={'kz-gap' + (blink ? ' kz-gap-led' : '')}>
        <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={12} cls="kz-tag-in" />
      </span>] }
  ];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hint)} />
        <div className="kz-scene is-tight">
          <ManBox frame frameSides={{ top: 1, right: 1, left: 1, bottom: okNow ? 'new' : 0 }} man={<PaperMan anim={false} />}
            labels={<>
              <KzLabel t="html" cls="kz-frame-lbl-top" on={lad.lv >= 1 && !okNow} />
              {okNow ? <KzLabel t="html" close cls="kz-frame-lbl-bot" anim="stamp" />
                : <span className={'kz-frame-miss' + (blink ? ' is-blink' : '')} aria-hidden="true"><span className="kz-frame-miss-q">?</span></span>}
            </>} />
          <div className="kz-col"><KzCode lines={lines} /></div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'html', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 4} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S5. БИРКИ ПО МЕСТАМ — новый лист: рамка без бирок; три бирки, одна лишняя.
// Нажать бирку, потом место (или перетащить).
// =============================================================================
const S5_TAGS = [{ id: 'o', raw: '<html>' }, { id: 'b', raw: '<\\html>' }, { id: 'c', raw: '</html>' }];
function S5({ p }) {
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? { top: 'o', bot: 'c' } : { top: null, bot: null });
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = !!(slots.top && slots.bot);
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, (slots.top ? 1 : 0) + (slots.bot ? 1 : 0) + (sel ? 10 : 0));
  const place = (id, where) => {
    if (!canTap || done || !id || !where || slots[where]) return false;
    st.current.tries += 1;
    const want = where === 'top' ? 'o' : 'c';
    if (id !== want) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      const m = id === 'b' ? c.back : where === 'top' ? c.top : c.bottom;
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = Object.assign({}, slots, { [where]: id });
    setSlots(ns); setSel(null); setMsg(null);
    if (ns.top && ns.bot) {
      put({ done: true });
      log({ screenId: 's5', type: 'place-tags', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const trayRef = useRef(null);
  const sceneRef = useRef(null);
  const pickSlot = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const hint = hintAt(lad.lv, c.hints);
  const nextWant = !slots.top ? 'o' : 'c';
  const lit = lad.lv >= 3;
  const raw = (id) => S5_TAGS.find((t) => t.id === id).raw;
  const slotBtn = (where, cls) => (
    <button type="button" data-place={where} className={'kz-slot ' + cls + (dnd.hover === where ? ' is-hover' : '') + (slots[where] ? ' is-full' : '')}
      disabled={!canTap || !!slots[where]} onClick={() => pickSlot(where)}>
      {slots[where] ? <KzLabel raw={raw(slots[where])} flow anim="stamp" /> : <span className="kz-slot-dash" />}
      <Led on={!slots[where] && ((led && !!sel) || (lit && (where === 'top') === (nextWant === 'o')))} />
    </button>
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : ((slots.top ? 1 : 0) + (slots.bot ? 1 : 0)) + '/2'} />
        <div ref={sceneRef} className={'kz-scene is-tight' + (dnd.active || sel ? ' is-dragging' : '')}>
          <ManBox frame frameAnim={!solved} man={<PaperMan anim={!solved} />} cls="kz-s5-box"
            labels={<>{slotBtn('top', 'kz-slot-top')}{slotBtn('bot', 'kz-slot-bot')}</>} />
        </div>
        <div ref={trayRef} className="kz-tray">
          {S5_TAGS.map((t) => {
            const used = slots.top === t.id || slots.bot === t.id;
            if (used) return null;
            return (
              <button key={t.id} type="button" disabled={!canTap || done} data-id={t.id}
                className={'kz-scrap kz-scrap-tag' + (sel === t.id ? ' is-sel' : '') + (shake === t.id ? ' kz-a-shake' : '') + (lit && t.id === nextWant ? ' is-led' : '')}
                style={{ '--r': (t.id === 'b' ? 2 : t.id === 'o' ? -2 : 1) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, t.id, t.raw); }}
                onClick={() => { setSel(sel === t.id ? null : t.id); setMsg(null); sfx('tap', true); }}>
                <span translate="no">{t.raw}</span><Led on={led && !sel && !done} />
              </button>
            );
          })}
        </div>
        {/* Новая механика сначала показывается рукой: взять <html> и отнести наверх. */}
        <KzHand label="<html>" run={canTap && !done && !sel && !dnd.active && !slots.top && !slots.bot}
          targets={[() => trayRef.current && trayRef.current.querySelector('[data-id="o"]'), () => sceneRef.current && sceneRef.current.querySelector('.kz-slot-top')]} />
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S6. ГОЛОВА СТРАНИЦЫ — нажать голову: она приподнимается, внутри карточка
// title; нажать карточку — она улетает на вкладку бумажного браузера.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [step, setStep] = useState(solved ? 2 : 0);
  const [stamp, setStamp] = useState(0);
  const [flying, setFlying] = useState(false);   // карточка title летит на вкладку
  const sceneRef = useRef(null);
  const tm = useRef(0);
  useEffect(() => () => clearTimeout(tm.current), []);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && step < 2, step);
  const openHead = () => { if (!canTap || step !== 0) return; sfx('pop', true); setStep(1); sayNow(c.opened, 'point'); };
  const flyTitle = () => {
    if (!canTap || step !== 1 || flying) return;
    sfx('tap', true);
    const land = () => { setFlying(false); setStep(2); setStamp((s) => s + 1); sfx('ok', true); put({ done: true }); sayNow(c.flew, 'wonder'); say(c.done, 'smile'); };
    const sc = sceneRef.current;
    const went = !reduceMotion() && sc && kzFly(sc.querySelector('.kz-man [aria-label="title"]'), sc.querySelector('.kz-br-tab'), 760);
    if (!went) { land(); return; }
    setFlying(true);
    tm.current = setTimeout(land, 800);
  };
  const title = pick(UI.mySite);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={step === 0 ? c.ask : step === 1 ? c.askCard : c.done} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={step === 0 ? c.ask : step === 1 ? c.askCard : c.done} n={solved ? null : step + '/2'} />
        <div ref={sceneRef} className={'kz-scene' + (flying ? ' is-flying' : '')}>
          <ManBox man={<PaperMan anim={false} headOpen={step === 1} hl={step === 0 && led ? 'head' : null}
            onHead={openHead} titleText={step === 1 ? title : null} onTitle={flyTitle} />} cls="kz-s6-box" />
          <div className="kz-col">
            <PaperBrowser title={step >= 2 ? title : ''} stamp={stamp} tabHl={step >= 2 && speaker.text === c.flew}>
              <PageBits text={pick(UI.hello)} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: step >= 1 ? 'is-hl' : '', parts: [T_('head')] },
              { k: 't', d: 1, cls: step >= 2 ? 'is-new' : '', parts: step >= 2 ? [T_('title'), W_(title), T_('title', true)] : [<span key="d" className="kz-dim">…</span>] },
              { k: 'hc', d: 0, cls: step >= 1 ? 'is-hl' : '', parts: [T_('head', true)] }
            ]} />
          </div>
        </div>
        {step === 1 ? <div className="kz-row" style={flying ? { visibility: 'hidden' } : null}><button type="button" className="kz-btn is-ghost" disabled={!canTap} onClick={flyTitle}>title<Led on={led} /></button></div> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S7. ИМЯ НА ВКЛАДКЕ — поле внутри title; вкладка меняется по ходу набора,
// засчитывается после паузы.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get('myTitle') || '');
  const [stamp, setStamp] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const led = useIdleLed(canTap && !solved && !val.trim(), 0);
  const committed = useRef(store.get('myTitle') || '');
  useEffect(() => {
    if (!okText(val) || val.trim() === committed.current) return undefined;
    const t = setTimeout(() => {
      committed.current = val.trim();
      store.set('myTitle', val.trim());
      setStamp((s) => s + 1); sfx('ok', true);
      if (!solved) {
        put({ done: true });
        log({ screenId: 's7', type: 'write-title', correct: true, hints: lad.asked.current, depth: lad.lv });
        sayNow(c.ok, 'smile');
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = okText(val) ? val : committed.current;
  const hint = hasTags(val) ? UI.noTags : hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} hint={hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={shown} stamp={stamp} tabHl={!solved} short>
              <PageBits text={pick(UI.hello)} />
            </PaperBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('head')] },
              { k: 't', d: 1, cls: 'is-hl', parts: [T_('title'),
                <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={setVal} placeholder={L3('Masalan: Futbol', 'Например: Футбол', 'For example: Football')} label={c.ask} max={30} /></span>,
                T_('title', true)] },
              { k: 'hc', d: 0, parts: [T_('head', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S8. ВКЛАДКА ИЛИ ОКНО? — прогноз, потом правда браузера. Ловушки в обе
// стороны: слово без бирок падает в окно, длинная фраза в title — на вкладку.
// Промах — дополнительный раунд того же типа с другим словом.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const mine = useMine();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [{ i: 0 }, { i: 1 }, { i: 2 }]));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [view, setView] = useState({ tab: mine.title, win: mine.text, stamp: 0 });
  // Вопрос раунда — вслух: и первый (после вступления), и каждый следующий.
  // В речь слово идёт без конечного «!», чтобы не было «пятницу!. Где…».
  const askOf = (rd) => {
    const R0 = c.rounds[rd.i];
    const w = rd.extra ? R0.extra : R0.word;
    const wv = {}; Object.keys(w).forEach((l) => { wv[l] = String(w[l]).replace(/[!?.]+$/, ''); });
    return fillL(R0.kind === 'title' ? c.askTitle : c.askRaw, { w: wv });
  };
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: askOf({ i: 0 }), pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const R = round ? c.rounds[round.i] : null;
  const word = R ? pick(round.extra ? R.extra : R.word) : '';
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const answer = (where) => {
    if (!canTap || !round || ans) return;
    const right = where === R.want;
    setAns(where);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    // Правда браузера: title — на вкладку, текст без бирок — в окно.
    setView((v) => (R.kind === 'title' ? { tab: word, win: v.win, stamp: v.stamp + 1 } : { tab: '', win: word + ' ' + v.win, stamp: v.stamp + 1 }));
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.unshift({ i: round.i, extra: true });
    const line = right ? c.ok[R.kind] : c.miss[R.kind];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's8.r' + (ii + 1), type: 'predict', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
      });
      put({ done: true });
      setQueue([]);
      sayNow(joinL(line, c.done), 'smile');
      return;
    }
    sayNow(line, right ? 'smile' : 'rule');
    setPending(rest);
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => {
      setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null);
      setView({ tab: mine.title, win: mine.text, stamp: 0 });
      sayNow(askOf(pending[0]), 'curious');
    }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const askText = !round ? c.done : fillL(R.kind === 'title' ? c.askTitle : c.askRaw, { w: word });
  const slip = R ? (R.kind === 'title' ? [T_('title'), W_(word), T_('title', true)] : [W_(word)]) : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={askText} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            {slip ? <div className="kz-slip-wrap" key={'s' + doneN}><KzCode lines={[{ k: 'n', d: 0, cls: 'kz-slip kz-a-drop', parts: slip }]} /></div> : null}
            <PaperBrowser title={view.tab} stamp={view.stamp} short tabHl={!!ans && R && R.kind === 'title'} pageHl={!!ans && R && R.kind === 'raw'}>
              <div className="kz-br-text" key={'w' + view.stamp}>{view.win}</div>
            </PaperBrowser>
          </div>
        </div>
        {round ? (
          <div className="kz-pick">
            {['tab', 'win'].map((w) => (
              <button key={w} type="button" disabled={!canTap || !!ans}
                className={'kz-btn ' + (ans === w ? (w === R.want ? 'is-ok' : 'is-off') : ans && w === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(w)}>
                {pick(w === 'tab' ? UI.tab : UI.win)}<Led on={led && !ans} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S9. ТЕЛО СТРАНИЦЫ — нажать тело человечка: текст, картинка и кнопка
// выезжают в окно бумажного браузера.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const mine = useMine();
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [out, setOut] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !out, 0);
  const tap = () => { if (!canTap || out) return; sfx('pop', true); setOut(true); put({ done: true }); sayNow(c.out, 'wonder'); say(c.done, 'smile'); };
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={out ? c.done : c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={out ? c.done : c.ask} />
        <div className="kz-scene">
          <ManBox man={<PaperMan anim={false} hl={!out && led ? 'body' : out ? 'body' : null} onBody={tap} />} cls="kz-s6-box" />
          <div className="kz-col">
            <PaperBrowser title={mine.title} pageHl={out}>
              {out ? <PageBits text={pick(UI.hello)} bits anim={!solved} /> : null}
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, cls: out ? 'is-hl' : '', parts: [T_('body')] },
              { k: 'x', d: 1, cls: out ? 'is-new' : '', parts: out ? [W_(pick(UI.hello)), <span key="p" className="kz-dim">{' + ' + pick(UI.pic) + ' + ' + pick(UI.play)}</span>] : [<span key="d" className="kz-dim">…</span>] },
              { k: 'bc', d: 0, cls: out ? 'is-hl' : '', parts: [T_('body', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S10. ПРИВЕТ В ОКНЕ — поле внутри body; окно меняется по ходу набора.
// =============================================================================
function S10({ p }) {
  const log = useLog();
  const store = useStore();
  const c = C.s10;
  const mine = useMine();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get('myText') || '');
  const [flash, setFlash] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const led = useIdleLed(canTap && !solved && !val.trim(), 0);
  const committed = useRef(store.get('myText') || '');
  useEffect(() => {
    if (!okText(val) || val.trim() === committed.current) return undefined;
    const t = setTimeout(() => {
      committed.current = val.trim();
      store.set('myText', val.trim());
      setFlash((f) => f + 1); sfx('ok', true);
      if (!solved) {
        put({ done: true });
        log({ screenId: 's10', type: 'write-body', correct: true, hints: lad.asked.current, depth: lad.lv });
        sayNow(c.ok, 'smile');
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = okText(val) ? val : committed.current;
  const hint = hasTags(val) ? UI.noTags : hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} hint={hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PaperBrowser title={mine.title} short pageHl={!solved}>
              <div className={'kz-br-text' + (flash ? ' kz-a-stamp' : '')} key={'f' + flash}>{shown}</div>
            </PaperBrowser>
            <KzCode lines={[
              { k: 'b', d: 0, parts: [T_('body')] },
              { k: 'x', d: 1, cls: 'is-hl', parts: [<span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={setVal} placeholder={L3('Masalan: Salom!', 'Например: Привет!', 'For example: Hello!')} label={c.ask} max={60} /></span>] },
              { k: 'bc', d: 0, parts: [T_('body', true)] }
            ]} />
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S11. РАЗЛОЖИ ВЫРЕЗКИ — имя страницы, привет, картинка, кнопка: в голову или
// в тело. Нажать вырезку, потом место (или перетащить).
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const mine = useMine();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [placed, setPlaced] = useState(solved ? { name: 'head', hello: 'body', pic: 'body', btn: 'body' } : {});
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const doneN = Object.keys(placed).length;
  const done = doneN === 4;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, doneN * 10 + (sel ? 1 : 0));
  const label = (id) => (id === 'name' ? mine.title : id === 'hello' ? pick(UI.hello) : id === 'pic' ? pick(UI.pic) : pick(UI.play));
  // Имя страницы показано в теге title — по нему видно, что ему место в голове.
  const face = (id) => (id === 'name'
    ? <span className="kz-scrap-code" translate="no"><TagK t="title" />{mine.title}<TagK t="title" close /></span>
    : id === 'pic' ? <span className="kz-scrap-pic"><span className="kz-mini-pic" aria-hidden="true" />{label(id)}</span> : label(id));
  const ghostText = (id) => (id === 'name' ? '<title>' + mine.title + '</title>' : label(id));
  const place = (id, where) => {
    if (!canTap || done || !id || !where || placed[id]) return false;
    const it = c.items.find((x) => x.id === id);
    st.current.tries += 1;
    if (it.want !== where) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(it.why); sayNow(it.why, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const np = Object.assign({}, placed, { [id]: where });
    setPlaced(np); setSel(null); setMsg(null);
    if (Object.keys(np).length === 4) {
      put({ done: true });
      log({ screenId: 's11', type: 'sort', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const pickZone = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const hint = hintAt(lad.lv, c.hints);
  const nextId = c.items.map((x) => x.id).find((id) => !placed[id]);
  const nextWant = nextId ? c.items.find((x) => x.id === nextId).want : null;
  const lit = lad.lv >= 3;
  const zone = (where) => (
    <button type="button" data-place={where} className={'kz-zone' + (dnd.hover === where ? ' is-hover' : '') + ((led && sel) || (lit && where === nextWant && sel === nextId) ? ' is-led' : '')}
      disabled={!canTap || done} onClick={() => pickZone(where)}>
      <Cut c={where === 'head' ? KZ.mustard : KZ.teal} seed={where === 'head' ? 91 : 92} n={10} amp={3} asp={1.6} cls="kz-zone-cut" />
      <span className="kz-zone-in">
        <KzLabel t={where} flow />
        <span className="kz-zone-items">{Object.keys(placed).filter((k) => placed[k] === where).map((k, j) => (
          // Разложенная вырезка — та же бумажка, что в лотке: рваный край, тень, свой наклон.
          <span key={k} className="kz-zone-item kz-a-stamp" style={{ '--r': ['-2deg', '1.6deg', '-1.2deg', '2.2deg'][j % 4] }}>
            <span className="kz-zone-item-in">{k === 'pic' ? face(k) : k === 'name' ? face(k) : label(k)}</span>
          </span>))}</span>
      </span>
    </button>
  );
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : doneN + '/4'} />
        <div className="kz-zones">{zone('head')}{zone('body')}</div>
        <div className="kz-tray">
          {c.items.map((it, i) => {
            if (placed[it.id]) return null;
            return (
              <button key={it.id} type="button" disabled={!canTap || done}
                className={'kz-scrap' + (sel === it.id ? ' is-sel' : '') + (shake === it.id ? ' kz-a-shake' : '') + (lit && it.id === nextId && sel !== it.id ? ' is-led' : '')}
                style={{ '--r': ((i % 2 ? 1 : -1) * (1 + i * 0.4)) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, it.id, ghostText(it.id)); }}
                onClick={() => { setSel(sel === it.id ? null : it.id); setMsg(null); sfx('tap', true); }}>
                {face(it.id)}
                <Led on={led && !sel && !done && it.id === nextId} />
              </button>
            );
          })}
        </div>
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S12. СВЕРХУ ВНИЗ — «Читать как браузер»: строки кода подсвечиваются по
// очереди, и страница собирается вырезками: первая строка, рамка, голова с
// именем, тело с текстом.
// =============================================================================
const READ12 = ['doc', 'html', 'head', 'title', 'headc', 'body', 'text', 'bodyc', 'htmlc'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const mine = useMine();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ12.length : -1);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && read < 0, 0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const run = () => {
    if (!canTap || read >= 0) return;
    const step = reduceMotion() ? 120 : 620;
    READ12.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, step * i)));
    timers.current.push(setTimeout(() => { setRead(READ12.length); put({ done: true }); sayNow(c.doctype, 'explain'); ORDER.forEach((x) => say(x.text, x.pose)); }, step * READ12.length + 200));
  };
  const at = (k) => read >= READ12.indexOf(k);
  // Пока Коди называет порядок — свои строки кода и блоки коллажа подсвечены.
  const sayK = spoken ? null : speaker.text === c.order1 ? 'doc' : speaker.text === c.order2 ? 'html' : speaker.text === c.order3 ? 'inner' : null;
  const SAY_LINES = { doc: { doc: 'doc' }, html: { html: 'html', htmlc: 'html' },
    inner: { head: 'head', title: 'head', headc: 'head', body: 'body', text: 'body', bodyc: 'body' } };
  const cur = read >= 0 && read < READ12.length ? READ12[read] : null;
  const lines = [
    { k: 'doc', d: 0, parts: [<span key="d" className="kz-tag"><span className="kz-tk-b">{'<!'}</span><span className="kz-tk-n">DOCTYPE html</span><span className="kz-tk-b">{'>'}</span></span>] },
    { k: 'html', d: 0, parts: [T_('html')] },
    { k: 'head', d: 1, parts: [T_('head')] },
    { k: 'title', d: 2, parts: [T_('title'), W_(mine.title), T_('title', true)] },
    { k: 'headc', d: 1, parts: [T_('head', true)] },
    { k: 'body', d: 1, parts: [T_('body')] },
    { k: 'text', d: 2, parts: [W_(mine.text)] },
    { k: 'bodyc', d: 1, parts: [T_('body', true)] },
    { k: 'htmlc', d: 0, parts: [T_('html', true)] }
  ].map((ln) => {
    const part = sayK && SAY_LINES[sayK][ln.k];
    const PART = { doc: 'doc', html: 'html', htmlc: 'html', head: 'head', title: 'head', headc: 'head', body: 'body', text: 'body', bodyc: 'body' };
    return Object.assign(ln, { cls: cur === ln.k ? 'is-read is-say-' + PART[ln.k] : part ? 'is-say is-say-' + part : '' });
  });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene kz-s12">
          <div className="kz-col kz-col-code"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col">
            <PageCollage title={mine.title} text={mine.text} anim={!solved} hl={cur === 'doc' ? 'doc' : sayK === 'inner' ? ['head', 'body'] : sayK}
              show={{ doc: at('doc'), html: at('html'), head: at('head'), title: at('title'), body: at('body'), text: at('text') }} />
          </div>
        </div>
        {read < 0 ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={run}>{pick(UI.read)}<Led on={led} /></button></div> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S13. СОБЕРИ КАРКАС — 8 бумажных полосок; нажатие ставит полоску на текущее
// место, перетаскивание — на любое; две полоски на местах меняются.
// «Проверить» — когда все места заняты; первое нарушенное правило — голосом.
// =============================================================================
const SLOTS13 = ['html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
const TRAY13 = ['body-c', 'title', 'html-o', 'text', 'head-c', 'html-c', 'body-o', 'head-o'];
function check13(slots) {
  const at = (id) => slots.indexOf(id);
  if (slots[0] !== 'html-o' || slots[7] !== 'html-c') return { rule: 'html', mark: ['html-o', 'html-c'].filter((x) => at(x) >= 0) };
  if (at('head-c') < at('head-o') || at('body-c') < at('body-o')) return { rule: 'pair', mark: at('head-c') < at('head-o') ? ['head-o', 'head-c'] : ['body-o', 'body-c'] };
  if (at('body-o') < at('head-o')) return { rule: 'order', mark: ['head-o', 'body-o'] };
  if (at('head-c') > at('body-o')) return { rule: 'headClose', mark: ['head-c', 'body-o'] };
  if (!(at('title') > at('head-o') && at('title') < at('head-c'))) return { rule: 'title', mark: ['title'] };
  if (!(at('text') > at('body-o') && at('text') < at('body-c'))) return { rule: 'text', mark: ['text'] };
  return null;
}
const DEPTH13 = (slots, k) => {
  let d = 0;
  for (let i = 0; i < k; i += 1) { const id = slots[i]; if (id === 'html-o' || id === 'head-o' || id === 'body-o') d += 1; if (id === 'html-c' || id === 'head-c' || id === 'body-c') d -= 1; }
  const id = slots[k];
  if (id === 'html-c' || id === 'head-c' || id === 'body-c') d -= 1;
  return Math.max(0, d) + 0;
};
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const mine = useMine();
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? SLOTS13.slice() : Array(8).fill(null));
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(null);
  const [res, setRes] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const lad = useKzLadder(!solved);
  const st = useRef({ checks: 0 });
  const full = slots.every(Boolean);
  const tray = TRAY13.filter((id) => slots.indexOf(id) < 0);
  const led = useIdleLed(canTap && !solved && !full, slots.filter(Boolean).length);
  const partsOf = (id) => ({
    'html-o': [T_('html')], 'html-c': [T_('html', true)], 'head-o': [T_('head')], 'head-c': [T_('head', true)],
    'body-o': [T_('body')], 'body-c': [T_('body', true)], title: [T_('title'), W_(mine.title), T_('title', true)], text: [W_(mine.text)]
  }[id]);
  const labelOf = (id) => ({ 'html-o': '<html>', 'html-c': '</html>', 'head-o': '<head>', 'head-c': '</head>', 'body-o': '<body>', 'body-c': '</body>', title: '<title>…</title>', text: mine.text }[id]);
  const putPiece = (id) => {
    if (!canTap || solved) return;
    const s = slots.slice();
    const at = s[cur] === null ? cur : s.indexOf(null);
    if (at < 0) return;
    s[at] = id;
    setSlots(s); setRes(null);
    const ne = s.indexOf(null);
    setCur(ne >= 0 ? ne : at);
    sfx('tap', true);
  };
  const tapSlot = (i) => {
    if (!canTap || solved) return;
    if (!slots[i]) { setCur(i); setHeld(null); return; }
    if (held === null) { setHeld(i); return; }
    if (held === i) { setHeld(null); return; }
    const s = slots.slice(); const t = s[held]; s[held] = s[i]; s[i] = t;
    setSlots(s); setRes(null); setHeld(null); sfx('tap', true);
  };
  const check = () => {
    if (!canTap || !full || solved) return;
    st.current.checks += 1;
    const r = check13(slots);
    if (!r) {
      sfx('win', true); setRes(null); put({ done: true });
      log({ screenId: 's13', type: 'build-flat', correct: true, firstTry: st.current.checks === 1 && lad.asked.current === 0, attempts: st.current.checks, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setRes(r); sayNow(c.rules[r.rule], 'think');
    if (st.current.checks >= 2) lad.bump();
  };
  // ▲ ▼ у поставленной полоски: на строку вверх или вниз (меняется местами с соседней,
  // в том числе с пустой). Как бумажки на столе: нажатая полоска приподнимается и
  // ступенчато проезжает над соседней, соседняя уезжает под ней на освободившееся место.
  const [moved, setMoved] = useState(null);   // { to, from, dy } — dy: откуда приехала полоска
  const mvT = useRef(0);
  const hostRef = useRef(null);
  useEffect(() => () => clearTimeout(mvT.current), []);
  const move = (k, dir) => {
    if (!canTap || solved) return;
    const j = k + dir;
    if (j < 0 || j > 7) return;
    const rows = hostRef.current ? hostRef.current.querySelectorAll('.kz-line-row') : [];
    const a = rows[k + 1], z = rows[j + 1];   // [0] — строка DOCTYPE
    const dy = a && z ? a.getBoundingClientRect().top - z.getBoundingClientRect().top : 0;
    const s2 = slots.slice(); const t = s2[j]; s2[j] = s2[k]; s2[k] = t;
    setSlots(s2); setRes(null); setHeld(null);
    const ne = s2.indexOf(null);
    setCur(ne >= 0 ? ne : j);
    sfx('tap', true);
    setMoved(reduceMotion() ? null : { to: j, from: k, dy, n: Date.now() });
    clearTimeout(mvT.current); mvT.current = setTimeout(() => setMoved(null), 560);
  };
  const dnd = useKzDrag((payload, where) => {
    if (!canTap || solved || where === null) return;
    const k = Number(where);
    const s2 = slots.slice();
    if (payload.from === 'tray') s2[k] = payload.id;
    else if (payload.from === 'slot' && payload.k !== k) { const t2 = s2[payload.k]; s2[payload.k] = s2[k]; s2[k] = t2; }
    else return;
    setSlots(s2); setRes(null); setHeld(null);
    const ne = s2.indexOf(null);
    setCur(ne >= 0 ? ne : k);
    sfx('tap', true);
  });
  const hint = hintAt(lad.lv, c.hints);
  const lines = [{ k: 'doc', d: 0, cls: 'kz-fixed', move: { hide: true }, parts: [<span key="d" className="kz-tag"><span className="kz-tk-b">{'<!'}</span><span className="kz-tk-n">DOCTYPE html</span><span className="kz-tk-b">{'>'}</span></span>] }]
    .concat(slots.map((id, k) => {
      const marked = res && id && res.mark.indexOf(id) >= 0;
      return {
        // Новый ключ на каждый сдвиг — анимация перестановки перезапускается и при быстрых нажатиях.
        k: 's' + k + (moved && (moved.to === k || moved.from === k) ? ':' + moved.n : ''), d: id ? DEPTH13(slots, k) : 0,
        cls: (!id && cur === k && !solved ? 'is-cur' : '') + (held === k ? ' is-sel' : '') + (marked ? ' is-mark' : '') + (moved && moved.to === k ? ' kz-slide-up' : moved && moved.from === k && slots[k] ? ' kz-slide-under' : ''),
        style: moved && (moved.to === k || moved.from === k) ? { '--dy': (moved.to === k ? moved.dy : -moved.dy).toFixed(1) + 'px' } : null,
        move: solved || !id ? { hide: true } : { up: k > 0 ? () => move(k, -1) : null, down: k < 7 ? () => move(k, 1) : null },
        onTap: solved ? null : () => tapSlot(k), disabled: !canTap, led: (led && !id && cur === k) || (lad.lv >= 3 && marked),
        parts: id ? partsOf(id) : [<span key="e" className="kz-dash" aria-label={'slot ' + (k + 2)} />]
      };
    }));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (res ? c.rules[res.rule] : hint)} n={solved ? null : slots.filter(Boolean).length + '/8'} />
        <div className="kz-build">
          <div ref={hostRef} className="kz-code-host" onPointerDown={(e) => {
            if (!canTap || solved) return;
            if (e.target.closest && e.target.closest('.kz-move')) return;   // ▲ ▼ — не перетаскивание
            const ln = e.target.closest && e.target.closest('.kz-line');
            if (!ln) return;
            const row = ln.closest('.kz-line-row') || ln;
            const k = [...row.parentNode.children].indexOf(row) - 1;
            if (k >= 0 && slots[k]) dnd.start(e, { from: 'slot', k }, labelOf(slots[k]));
          }}>
            <KzCode lines={lines.map((ln, i) => (i === 0 ? ln : Object.assign(ln, { place: String(i - 1) })))} cls="kz-code-sm kz-code-build" />
          </div>
          <div className="kz-build-side">
            {tray.length && !solved ? (
              <div className="kz-pool">
                {tray.map((id, i) => (
                  <button key={id} type="button" disabled={!canTap} className="kz-scrap" style={{ '--r': ((i % 2 ? 1 : -1) * 1.5) + 'deg' }}
                    onPointerDown={(e) => { e.stopPropagation(); if (canTap) dnd.start(e, { from: 'tray', id }, labelOf(id)); }}
                    onClick={() => putPiece(id)}>
                    <span translate="no">{labelOf(id)}</span>
                  </button>
                ))}
              </div>
            ) : null}
            {full && !solved ? <button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={check}><Icon name="check" size={17} />{pick(UI.check)}</button> : null}
            {slots.some(Boolean) && !solved ? <p className="kz-msg">{pick(UI.swap)}</p> : null}
          </div>
        </div>
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S14. ВКЛАДКА СЪЕЛА СТРАНИЦУ — без </title> браузер отдаёт вкладке всё, что
// идёт дальше. Ученик выбирает бирку, которой не хватает.
// =============================================================================
function S14({ p }) {
  const log = useLog();
  const c = C.s14;
  const mine = useMine();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === '</title>') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'fix-closing', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'smile');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  // Тег можно отнести пальцем в пустое место строки title или просто нажать.
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const eaten = mine.title + ' </head> <body> ' + mine.text + ' </body> </html>';
  const glow = off.length >= 2 ? '</title>' : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} />
        <div className="kz-scene kz-s14">
          <div className="kz-col">
            <PaperBrowser title={okNow ? mine.title : eaten} stamp={okNow ? 1 : 0} tabHl={!okNow} pageHl={okNow}>
              {okNow ? <div className="kz-br-text kz-a-drop">{mine.text}</div> : null}
            </PaperBrowser>
          </div>
          <div className="kz-col">
            <KzCode lines={[
              { k: 'h', d: 0, parts: [T_('head')] },
              { k: 't', d: 1, cls: okNow ? 'is-new' : 'is-hl', parts: [T_('title'), W_(mine.title), okNow ? <span key="c" className="kz-a-stamp">{T_('title', true)}</span> : <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />] },
              { k: 'hc', d: 0, parts: [T_('head', true)] },
              { k: 'b', d: 0, parts: [T_('body')] },
              { k: 'x', d: 1, parts: [W_(mine.text)] },
              { k: 'bc', d: 0, parts: [T_('body', true)] }
            ]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {c.opts.map((o, i) => (
              <button key={o} type="button" disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, o); }}
                className={'kz-scrap kz-scrap-tag' + (off.indexOf(o) >= 0 ? ' is-used' : '') + (glow === o ? ' is-led' : '')} style={{ '--r': ((i - 1) * 2) + 'deg' }}>
                <span translate="no">{o}</span><Led on={led && off.indexOf(o) < 0} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S15. ВЫВОД — своя бумажная страница ученика собирается вырезками; роли
// html, head, title, body загораются, пока Коди их называет. Единственный
// праздник урока.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet>
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <PageCollage title={mine.title} text={mine.text} anim hl={curK} />
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['html', 'head', 'title', 'body'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'html' ? KZ.coral : k === 'body' ? KZ.teal : KZ.mustard }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 },
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'CHECK-1', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'PREDICT', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; имя и текст ученика (myTitle, myText) остаются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'] };

// Параллакс слоёв: палец или мышь сдвигают вырезки по углам листа на разную
// глубину. Значения — ступеньками (как кадры stop-motion), без лишних перерисовок.
function useParallax() {
  useEffect(() => {
    if (typeof window === 'undefined' || reduceMotion()) return undefined;
    const root = document.documentElement;
    let last = '';
    const onMove = (e) => {
      const x = Math.round(((e.clientX / window.innerWidth) * 2 - 1) * 4) / 4;
      const y = Math.round(((e.clientY / window.innerHeight) * 2 - 1) * 4) / 4;
      const k = x + ',' + y;
      if (k === last) return;
      last = k;
      root.style.setProperty('--kzx', String(x));
      root.style.setProperty('--kzy', String(y));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}

export default function HtmlKollazh({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store) })
  });
  useParallax();
  usePaperSound();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  // Переход «разбор и сборка» — на «Дальше» и «Назад».
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next), prev: R.i > 0 ? go(R.prev) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

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
/* Поле растёт по тексту: перенос внутри, высота — по содержимому (InlineInput). */
.tk-grow { display: block; resize: none; overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere;
  word-break: normal; min-height: 0; align-self: center; flex: 0 1 auto; width: auto; max-width: 100%; }
/* В строке кода теги не сжимаются — сжимается (и переносит текст) только поле. */
.cv-code > .tk:has(.tk-tag) { flex-shrink: 0; }
.cv-code > .tk:has(.tk-grow) { flex: 0 1 auto; min-width: 4.5ch; }
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
/* ── БУМАЖНЫЙ КОЛЛАЖ (тестовый урок 12, по ролику html.mp4) ─────────────────
   Стол — фон курса (как в остальных уроках, заказчик 20.10.2026; раньше был
   крафт #D8C4A1), лист — кремовая бумага с рваным краем, вырезки — цветная
   бумага с фактурой и мягкой тенью на нижний слой. Движение ступенчатое,
   как stop-motion: keyframes по кадрам и steps(1, end). Префикс kz-. */
/* Цвет бумажек: теги, строки кода, карточки, страница в браузере, вырезки в лотке
   (заказчик, 20.10.2026: пробуем горчицу; было #FBF6EA). Меняется здесь одним числом. */
:root { --kz-piece: #F0B13F; }
.stage .stage-header, .stage .stage-nav { background: transparent; }
.stage .stage-content { overflow: visible; }
.stage-content::before, .stage-content::after { display: none; }
.stage-content > .limit { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
.stage-content > .limit > .kz-sheet { flex: 1 1 auto; }

/* Фактура бумаги: мелкое зерно + мягкие пятна (одна картинка на всё). */
.kz-cut-in::after, .kz-sheet-in::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: multiply; opacity: .55;
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .27  0 0 0 0 .16  0 0 0 .28 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .4  0 0 0 0 .3  0 0 0 0 .18  0 0 0 .16 0'/></filter><rect width='100%' height='100%' filter='url(%23m)'/></svg>");
}

/* Вырезка: внешний слой — движение (transform) и тень, внутренний — бумага
   с рваным краем (clip-path) и лёгкая «дрожь» stop-motion (translate). */
.kz-cut { position: absolute; display: block; rotate: var(--r, 0deg);
  filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .32)) drop-shadow(0 5px 7px rgba(74, 48, 18, .14)); }
.kz-cut.kz-flow { position: relative; }
.kz-cut-in { position: absolute; inset: 0; display: block; overflow: hidden; }
.kz-cut.is-hl { filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px var(--hl, #E0643F)) drop-shadow(0 4px 6px rgba(74, 48, 18, .2)); }
.kz-cut.is-tap { cursor: pointer; }
.kz-boil > .kz-cut-in { animation: kzBoil 1.26s steps(1, end) infinite; animation-delay: var(--bd, 0s); }

/* Лист и стол */
.kz-sheet { position: relative; flex: 1 1 auto; min-height: 0; width: 100%; display: flex; }
.kz-sheet-in { position: absolute; inset: 0; background: #FBF6EA; }   /* лист (заказчик, 20.10.2026; было #EFE7D6) */
.kz-sheet-wrap { position: absolute; inset: 0; filter: drop-shadow(0 2px 2px rgba(74, 48, 18, .28)) drop-shadow(0 10px 14px rgba(74, 48, 18, .16)); }
.kz-sheet-body { position: relative; z-index: 1; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(8px, 1.6dvh, 14px);
  padding: clamp(12px, 2.4dvh, 22px) clamp(12px, 2.4vw, 26px); }
.kz-deco { position: absolute; z-index: 2; pointer-events: none;
  translate: calc(var(--kzx, 0) * var(--dp, 6) * 1px) calc(var(--kzy, 0) * var(--dp, 6) * 1px); }
.kz-deco-tape { left: -14px; top: 4px; width: clamp(54px, 9vw, 110px); height: clamp(14px, 2.2vw, 22px); }
.kz-deco-tri { right: -14px; top: 6px; width: clamp(26px, 4vw, 46px); height: clamp(30px, 4.6vw, 52px); }
.kz-deco-dot { left: -16px; bottom: 10px; width: clamp(30px, 4.6vw, 56px); height: clamp(30px, 4.6vw, 56px); }
.kz-par { translate: calc(var(--kzx, 0) * var(--dp, 3) * 1px) calc(var(--kzy, 0) * var(--dp, 3) * 1px); }

/* Ступенчатые движения (≈12 кадров в секунду). */
.kz-a-drop { animation: kzDrop .66s steps(1, end) both; animation-delay: var(--dl, 0s); }
.kz-a-rise { animation: kzRise .66s steps(1, end) both; animation-delay: var(--dl, 0s); }
.kz-a-left { animation: kzLeft .66s steps(1, end) both; animation-delay: var(--dl, 0s); }
.kz-a-right { animation: kzRight .66s steps(1, end) both; animation-delay: var(--dl, 0s); }
.kz-a-pop { animation: kzPop .5s steps(1, end) both; animation-delay: var(--dl, 0s); }
.kz-a-stamp { animation: kzStamp .5s steps(1, end) both; animation-delay: var(--dl, 0s); }
.kz-a-out { animation: kzOut .58s steps(1, end) both; animation-delay: var(--dl, 0s); pointer-events: none; }
.kz-a-shake { animation: kzShake .5s steps(1, end) both; }
@keyframes kzDrop {
  0% { transform: translate(0, -160%) rotate(-16deg); } 13% { transform: translate(0, -112%) rotate(-11deg); }
  26% { transform: translate(0, -66%) rotate(-7deg); } 39% { transform: translate(0, -28%) rotate(-3deg); }
  52% { transform: translate(0, 5%) rotate(2deg); } 65% { transform: translate(0, -4%) rotate(-1.2deg); }
  78% { transform: translate(0, 1.5%) rotate(.6deg); } 100% { transform: none; } }
@keyframes kzRise {
  0% { transform: translate(0, 170%) rotate(10deg); } 15% { transform: translate(0, 110%) rotate(7deg); }
  30% { transform: translate(0, 58%) rotate(4deg); } 45% { transform: translate(0, 18%) rotate(1deg); }
  60% { transform: translate(0, -6%) rotate(-1.5deg); } 75% { transform: translate(0, 2%) rotate(.5deg); } 100% { transform: none; } }
@keyframes kzLeft {
  0% { transform: translate(-260%, -10%) rotate(-24deg); } 15% { transform: translate(-170%, -6%) rotate(-16deg); }
  30% { transform: translate(-90%, -3%) rotate(-9deg); } 45% { transform: translate(-30%, 0) rotate(-3deg); }
  60% { transform: translate(6%, 0) rotate(2deg); } 75% { transform: translate(-2%, 0) rotate(-.5deg); } 100% { transform: none; } }
@keyframes kzRight {
  0% { transform: translate(260%, -10%) rotate(24deg); } 15% { transform: translate(170%, -6%) rotate(16deg); }
  30% { transform: translate(90%, -3%) rotate(9deg); } 45% { transform: translate(30%, 0) rotate(3deg); }
  60% { transform: translate(-6%, 0) rotate(-2deg); } 75% { transform: translate(2%, 0) rotate(.5deg); } 100% { transform: none; } }
@keyframes kzPop {
  0% { transform: scale(0) rotate(-20deg); } 20% { transform: scale(.55) rotate(-9deg); } 40% { transform: scale(1.14) rotate(4deg); }
  60% { transform: scale(.95) rotate(-2deg); } 80% { transform: scale(1.03) rotate(.5deg); } 100% { transform: none; } }
@keyframes kzStamp {
  0% { transform: scale(1.5) rotate(-8deg); opacity: .2; } 25% { transform: scale(1.18) rotate(-4deg); opacity: 1; }
  50% { transform: scale(.94) rotate(2deg); } 75% { transform: scale(1.02) rotate(-.5deg); } 100% { transform: none; } }
@keyframes kzOut {
  0% { transform: none; } 20% { transform: translate(4%, -16%) rotate(6deg); } 40% { transform: translate(14%, -60%) rotate(14deg); }
  60% { transform: translate(26%, -120%) rotate(24deg); } 80% { transform: translate(38%, -190%) rotate(34deg); opacity: .6; }
  100% { transform: translate(50%, -260%) rotate(44deg); opacity: 0; } }
@keyframes kzShake { 0% { transform: none; } 20% { transform: translateX(-6px) rotate(-2deg); } 40% { transform: translateX(5px) rotate(2deg); }
  60% { transform: translateX(-3px) rotate(-1deg); } 80% { transform: translateX(2px); } 100% { transform: none; } }
@keyframes kzBoil { 0% { translate: 0 0; } 33% { translate: .6px -.5px; } 66% { translate: -.5px .4px; } 100% { translate: 0 0; } }
@keyframes kzLed { 0%, 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 7px rgba(255, 79, 40, .95)); } }

/* Строка задания — бумажная полоска. */
.kz-ask { position: relative; align-self: center; max-width: 100%; margin: 0; padding: 7px 16px 8px; background: #FBF6EA; color: #1F2A44;
  font: 700 clamp(15px, 2.1dvh, 18px)/1.3 'Manrope', sans-serif; text-align: center; rotate: -.6deg;
  clip-path: polygon(0 6%, 4% 0, 30% 5%, 61% 0, 96% 4%, 100% 0, 99% 52%, 100% 100%, 70% 95%, 38% 100%, 3% 96%, 0 100%, 1% 48%);
  filter: drop-shadow(0 2px 2px rgba(74, 48, 18, .22)); }
.kz-ask-n { display: inline-block; margin-right: 8px; padding: 0 7px; border-radius: 6px; background: #1F2A44; color: #FBF6EA; font: 700 12px/20px 'JetBrains Mono', monospace; vertical-align: 2px; }
.kz-ask.is-hint { background: #FFF1C9; color: #5B4300; }
.kz-ask-wrap { display: flex; justify-content: center; filter: drop-shadow(0 2px 2px rgba(74, 48, 18, .2)); }

/* Бирка-тег на скотче */
.kz-label { position: absolute; display: inline-flex; z-index: 4; }
.kz-label.kz-flow { position: relative; }
.kz-label-paper { position: relative; display: inline-block; padding: 4px 12px 5px; background: var(--kz-piece); color: #1F2A44;
  font: 700 clamp(16px, 2.9dvh, 24px)/1.2 'JetBrains Mono', ui-monospace, monospace; white-space: nowrap;
  clip-path: polygon(0 8%, 12% 0, 40% 6%, 70% 0, 100% 7%, 97% 50%, 100% 94%, 64% 100%, 30% 93%, 0 100%, 3% 46%);
  filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .3)); }
.kz-label-tape { position: absolute; left: -9px; top: -8px; width: 32px; height: 14px; background: rgba(238, 222, 176, .78); rotate: -28deg; z-index: 1;
  clip-path: polygon(0 10%, 8% 0, 16% 12%, 92% 0, 100% 20%, 93% 50%, 100% 85%, 90% 100%, 10% 90%, 0 100%, 6% 55%); }
.kz-label.is-tap { cursor: pointer; }
.kz-label.is-on .kz-label-paper { background: #FFF1C9; }
.kz-label.is-led .kz-label-paper { animation: kzLed 1.2s ease-in-out infinite; }
.kz-tk-b { color: #E0643F; }
.kz-tk-n { color: #1F2A44; }

/* Код — бумажные полоски */
.kz-code { position: relative; display: flex; flex-direction: column; gap: 5px; min-width: 0; font: 600 clamp(14px, 1.9dvh, 17px)/1.35 'JetBrains Mono', ui-monospace, monospace; }
.kz-line { position: relative; display: flex; align-items: center; flex-wrap: wrap; gap: 2px; min-height: 30px; padding: 4px 12px 4px calc(12px + var(--d, 0) * 1.4em);
  background: var(--kz-piece); color: #1F2A44; rotate: var(--r, 0deg);
  clip-path: polygon(0 10%, 2% 0, 35% 6%, 68% 0, 99% 8%, 100% 45%, 99% 100%, 66% 94%, 33% 100%, 1% 93%, 0 55%);
  filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .26)); }
.kz-line.is-read { background: #FFE4D8; }
.kz-line.is-hl { background: #FFF1C9; }
.kz-line.is-new { animation: kzDrop .6s steps(1, end) both; }
.kz-line.is-mark { background: #FFF1C9; }
.kz-line.is-gap { background: #F5EDDC; }
.kz-line .kz-txt { font-family: 'Manrope', sans-serif; font-weight: 700; color: #1F2A44; }
.kz-line .kz-dim { color: #8C8476; font-family: 'Manrope', sans-serif; font-weight: 600; }
.kz-line.kz-tap { cursor: pointer; border: none; text-align: left; width: 100%; font: inherit; }
.kz-line.is-sel { background: #FFE4D8; }
.kz-line.is-cur { background: #FFF6DE; }
.kz-line .led { position: absolute; }
.kz-dash { flex: 1 1 auto; height: 14px; border: 1.5px dashed rgba(31, 42, 68, .25); border-radius: 4px; }

/* Поле ввода внутри полоски */
.kz-line .tk-input { min-width: 4em; padding: 1px 6px; border: none; border-bottom: 2px dashed #E0643F; background: #fff8ec; border-radius: 4px; color: #1F2A44;
  font: 700 16px 'Manrope', sans-serif; outline: none; resize: none; line-height: 1.3; }
.kz-line .tk-input.kz-tag-in { font-family: 'JetBrains Mono', monospace; }
.kz-line .tk-input:focus { background: #fff; border-bottom-color: #1F2A44; }
.kz-gap-led .tk-input { animation: kzLed 1.2s ease-in-out infinite; }

/* Бумажный браузер — Chrome в Windows из бумаги */
.kz-br { position: relative; width: 100%; aspect-ratio: 16 / 10.5; min-height: 0; flex: none; align-self: center;
  max-width: min(100%, calc(var(--brh, 34dvh) * 1.52)); display: flex; flex-direction: column; padding: 0 2.2% 2.4%; }
.kz-br.is-short { aspect-ratio: 16 / 7.4; max-width: min(100%, calc(var(--brh, 24dvh) * 2.16)); }
.kz-cut.kz-br-frame { inset: 0; }
.kz-br-bar { position: relative; z-index: 2; flex: 0 0 auto; height: clamp(26px, 4dvh, 36px); display: flex; align-items: flex-end; gap: 6px; padding-left: 2%; }
.kz-br-tab { position: relative; display: flex; align-items: center; gap: 7px; max-width: 62%; height: 80%; padding: 0 12px 0 10px; background: #E6DCC6;
  font: 700 clamp(11.5px, 1.7dvh, 14px)/1 'Manrope', sans-serif; color: #1F2A44;
  clip-path: polygon(0 100%, 3% 30%, 7% 6%, 13% 0, 87% 0, 93% 6%, 97% 30%, 100% 100%); }
.kz-br-tab.is-hl { background: #F0B13F; box-shadow: 0 0 0 2px #FBF6EA, 0 0 10px 2px rgba(240, 177, 63, .9); }
.kz-br-fav { flex: none; width: 11px; height: 11px; border-radius: 3px; background: #E0643F; rotate: -6deg; }
.kz-br-tab-t { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kz-br-tab-t.is-file { color: #7E7666; font-style: italic; font-weight: 600; }
.kz-br-x { flex: none; position: relative; width: 9px; height: 9px; opacity: .55; }
.kz-br-x::before, .kz-br-x::after { content: ''; position: absolute; left: 4px; top: -1px; width: 1.6px; height: 11px; background: #1F2A44; rotate: 45deg; }
.kz-br-x::after { rotate: -45deg; }
.kz-br-plus { position: relative; flex: none; align-self: center; width: 14px; height: 14px; margin-top: 4px; opacity: .8; }
.kz-br-plus::before, .kz-br-plus::after { content: ''; position: absolute; left: 6px; top: 1px; width: 2px; height: 12px; background: #E6DCC6; }
.kz-br-plus::after { rotate: 90deg; }
.kz-br-win { margin-left: auto; align-self: center; display: flex; gap: clamp(10px, 1.6vw, 16px); padding-right: 3%; margin-top: 2px; }
.kz-br-win i { position: relative; display: block; width: 11px; height: 11px; opacity: .85; }
.kz-w-min::before { content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 1.8px; background: #E6DCC6; }
.kz-w-max { border: 1.8px solid #E6DCC6; border-radius: 1px; width: 10px !important; height: 10px !important; }
.kz-w-close::before, .kz-w-close::after { content: ''; position: absolute; left: 5px; top: -1px; width: 1.8px; height: 13px; background: #E6DCC6; rotate: 45deg; }
.kz-w-close::after { rotate: -45deg; }
.kz-br-tool { position: relative; z-index: 2; flex: 0 0 auto; height: clamp(22px, 3.4dvh, 30px); display: flex; align-items: center; gap: 8px; padding: 0 2.5%; }
.kz-cut.kz-br-tool-bg { inset: 0; }
.kz-br-arrows { position: relative; display: flex; gap: 10px; padding-left: 2px; }
.kz-br-arrows i { position: relative; width: 8px; height: 8px; border-left: 2px solid #1F2A44; border-bottom: 2px solid #1F2A44; opacity: .6; }
.kz-ar-l { rotate: 45deg; }
.kz-ar-r { rotate: -135deg; opacity: .3 !important; }
.kz-br-url { position: relative; flex: 1 1 auto; min-width: 0; height: 70%; display: flex; align-items: center; gap: 6px; padding: 0 10px; background: #FBF6EA; border-radius: 999px;
  font: 600 clamp(10px, 1.45dvh, 12.5px)/1 'Manrope', sans-serif; color: #5F584B; overflow: hidden; white-space: nowrap; }
.kz-br-lock { flex: none; width: 8px; height: 8px; border-radius: 2px; background: #2A8C7E; }
.kz-br-body { position: relative; z-index: 1; flex: 1 1 auto; min-height: 0; }
.kz-cut.kz-br-paper { inset: 0; }
.kz-br-page { position: absolute; inset: 9% 5% 8% 5%; z-index: 2; overflow: hidden;
  font: 600 clamp(13px, 2dvh, 18px)/1.35 'Times New Roman', Times, serif; color: #1F2A44; }
.kz-br.is-hl-page .kz-cut.kz-br-paper { filter: drop-shadow(0 0 4px #2A8C7E) drop-shadow(0 4px 6px rgba(74, 48, 18, .2)); }
.kz-br.is-hl-page .kz-br-page { outline: 3px solid #2A8C7E; outline-offset: 4px; border-radius: 4px; }
.kz-br-text { position: relative; overflow-wrap: anywhere; }
@media (max-width: 759px) {
  .kz-br-win { gap: 9px; }
  .kz-br-win i { width: 9px; height: 9px; }
  .kz-br-arrows { display: none; }
}

/* Кнопки на бумаге */
.kz-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; padding: 8px 20px; border: none; cursor: pointer;
  background: #1F2A44; color: #FBF6EA; font: 800 16px 'Manrope', sans-serif; rotate: -.8deg;
  clip-path: polygon(0 8%, 6% 0, 50% 5%, 95% 0, 100% 10%, 98% 55%, 100% 92%, 94% 100%, 48% 95%, 5% 100%, 0 90%, 2% 45%);
  filter: drop-shadow(0 2px 2px rgba(74, 48, 18, .3)); }
.kz-btn:disabled { opacity: .45; cursor: default; }
.kz-btn.is-coral { background: #E0643F; }
.kz-btn.is-teal { background: #2A8C7E; }
.kz-btn.is-ghost { background: #FBF6EA; color: #1F2A44; }
.kz-btn.is-sel { background: #F0B13F; color: #1F2A44; }
.kz-btn.is-ok { background: #2A8C7E; color: #fff; }
.kz-btn.is-off { opacity: .35; }
.kz-btn.is-led { animation: kzLed 1.2s ease-in-out infinite; }
.kz-btn .led { top: 2px; right: 2px; }
.kz-row { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; }

/* Сцена: место для человечка, рамки и браузера */
.kz-scene { position: relative; flex: 1 1 auto; min-height: 0; display: flex; gap: clamp(10px, 2vw, 26px); align-items: center; justify-content: center; }
.kz-stagebox { position: relative; height: 100%; max-height: 100%; min-height: 0; aspect-ratio: 1 / 1.08; }
.kz-col { display: flex; flex-direction: column; gap: 10px; min-width: 0; flex: 1 1 0; max-width: 560px; }
@media (max-width: 759px) {
  .kz-scene { flex-direction: column; align-items: stretch; gap: 8px; }
  .kz-scene > .kz-stagebox { align-self: center; height: auto; width: min(62vw, 30dvh); }
  .kz-scene.is-tight > .kz-stagebox { width: min(46vw, 22dvh); }
  .kz-col { max-width: none; flex: 0 0 auto; }
}

/* Человечек */
.kz-man { position: absolute; inset: 0; }
.kz-man .kz-cut.kz-face-dot { border-radius: 50%; }
.kz-man-title { z-index: 1; }
.kz-frame-lbl-top { left: -2%; top: -4%; }
.kz-frame-lbl-bot { right: -2%; bottom: -5%; }

/* План — бумажные карточки */
.kz-plan { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2dvh, 18px); width: min(100%, 640px); align-self: center; margin: auto 0; }
.kz-card { position: relative; min-height: clamp(84px, 15dvh, 140px); border: none; background: none; padding: 0; cursor: pointer; }
.kz-card-face { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px 12px; text-align: center;
  font: 800 clamp(14px, 2dvh, 17px)/1.25 'Manrope', sans-serif; color: #1F2A44; }
.kz-card-face .kz-card-n { font: 800 clamp(24px, 4dvh, 36px)/1 'Unbounded', 'Manrope', sans-serif; color: rgba(31, 42, 68, .75); }
.kz-card.is-open .kz-card-face { color: #1F2A44; }

/* Прогноз: две карточки выбора */
.kz-pick { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: min(100%, 520px); align-self: center; }
.kz-pick .kz-btn { width: 100%; min-height: 54px; }

/* Сортировка вырезок */
.kz-tray { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.kz-scrap { position: relative; border: none; padding: 7px 14px; background: var(--kz-piece); color: #1F2A44; cursor: grab; touch-action: none;
  font: 800 15px 'Manrope', sans-serif; rotate: var(--r, 0deg);
  clip-path: polygon(0 10%, 8% 0, 50% 6%, 92% 0, 100% 12%, 97% 52%, 100% 90%, 90% 100%, 50% 94%, 8% 100%, 0 88%, 3% 50%);
  filter: drop-shadow(0 2px 2px rgba(74, 48, 18, .3)); }
.kz-scrap.is-sel { background: #FFE4D8; translate: 0 -3px; }
.kz-scrap.is-used { opacity: .25; cursor: default; }
.kz-scrap.is-led { animation: kzLed 1.2s ease-in-out infinite; }
.kz-scrap-pic { display: inline-flex; align-items: center; gap: 6px; }
.kz-zones { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
.kz-zone { position: relative; min-height: clamp(110px, 24dvh, 230px); border: none; padding: 0; background: none; cursor: pointer; }
.kz-zone-in { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 6px; padding: 8px; }
.kz-zone.is-hover .kz-cut, .kz-zone.is-led .kz-cut { filter: drop-shadow(0 0 6px rgba(255, 79, 40, .9)); }
.kz-zone-items { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }

/* Сборка каркаса */
.kz-build { display: flex; gap: 14px; align-items: flex-start; width: 100%; min-height: 0; }
.kz-build > .kz-code { flex: 1 1 58%; }
.kz-build-side { flex: 1 1 42%; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.kz-pool { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.kz-pool .kz-scrap { font-family: 'JetBrains Mono', monospace; font-size: 14px; }
@media (max-width: 759px) {
  .kz-build { flex-direction: column-reverse; gap: 8px; }
  .kz-build > .kz-code, .kz-build-side { flex: 0 0 auto; width: 100%; }
  .kz-line { min-height: 26px; padding-top: 2px; padding-bottom: 2px; }
  .kz-code { gap: 3px; font-size: 13.5px; }
}
/* Копия вырезки за пальцем: приподнята над столом (тень длиннее и мягче),
   чуть крупнее и наклоняется по ходу движения. На телефоне — выше пальца. */
.kz-ghost { position: fixed; z-index: 200; pointer-events: none; transform: translate(-50%, -85%) rotate(var(--gr, 0deg)) scale(1.1);
  filter: drop-shadow(0 3px 2px rgba(74, 48, 18, .25)) drop-shadow(0 16px 14px rgba(74, 48, 18, .3)); transition: transform .12s steps(2, end); }
.kz-ghost.is-touch { transform: translate(-50%, -150%) rotate(var(--gr, 0deg)) scale(1.1); }
.kz-ghost-in { display: block; padding: 7px 16px; background: var(--kz-piece); color: #1F2A44; white-space: nowrap;
  font: 800 clamp(15px, 2.4dvh, 19px)/1.2 'JetBrains Mono', ui-monospace, monospace;
  clip-path: polygon(0 10%, 8% 0, 50% 6%, 92% 0, 100% 12%, 97% 52%, 100% 90%, 90% 100%, 50% 94%, 8% 100%, 0 88%, 3% 50%); }
/* Не туда — копия ступенчато возвращается на стол. */
.kz-ghost.is-back { transform: translate(-50%, -50%) rotate(0deg) scale(1); filter: drop-shadow(0 2px 2px rgba(74, 48, 18, .3));
  transition: left .28s steps(4, end), top .28s steps(4, end), transform .28s steps(4, end), filter .28s steps(4, end); }
/* Взятая вырезка — пунктирный след на столе. */
.kz-scrap.is-lifted { background: transparent; color: transparent; filter: none; outline: 2px dashed rgba(31, 42, 68, .35); outline-offset: -3px; }
.kz-scrap.is-lifted .led { display: none; }
/* Пока тег в руке — свободные места на рамке зовут. */
.kz-scene.is-dragging .kz-slot:not(.is-full) .kz-slot-dash { border-color: #E0643F; animation: kzSlotCall 1s steps(1, end) infinite; }
.kz-slot.is-hover .kz-slot-dash { scale: 1.12; border-style: solid; }
@keyframes kzSlotCall { 0%, 100% { background: rgba(251, 246, 234, .7); } 50% { background: #FFE4D8; } }

/* Рука-показ (бумажная), движется ступеньками, как вырезка. */
.kz-hand { position: absolute; left: 0; top: 0; z-index: 40; margin: -4px 0 0 -16px; pointer-events: none;
  transition: transform 1s steps(10, end); filter: drop-shadow(0 2px 1px rgba(74, 48, 18, .3)) drop-shadow(0 8px 8px rgba(74, 48, 18, .22)); }
.kz-hand svg { position: relative; display: block; rotate: -8deg; transition: transform .18s steps(2, end); transform-origin: 40% 10%; }
.kz-hand.is-tap svg { transform: scale(.86) translateY(3px); }
.kz-hand-ring { position: absolute; left: 16px; top: 4px; }
.kz-hand.is-tap .kz-hand-ring::after { content: ''; position: absolute; left: -18px; top: -18px; width: 36px; height: 36px;
  border-radius: 50%; border: 3px solid #E0643F; animation: kzRing .5s steps(5, end) both; }
@keyframes kzRing { from { transform: scale(.3); } to { transform: scale(1.3); border-color: rgba(224, 100, 63, 0); } }
/* Копия тега — прямо под пальцем: палец лежит на ней, как когда несёшь вырезку. */
.kz-hand-ghost { position: absolute; left: 16px; top: 4px; translate: -50% -55%; padding: 5px 13px; background: var(--kz-piece); color: #1F2A44; white-space: nowrap;
  font: 800 clamp(16px, 2.8dvh, 22px)/1.2 'JetBrains Mono', ui-monospace, monospace; rotate: -4deg;
  clip-path: polygon(0 10%, 8% 0, 50% 6%, 92% 0, 100% 12%, 97% 52%, 100% 90%, 90% 100%, 50% 94%, 8% 100%, 0 88%, 3% 50%); }

/* S4: на месте нижнего края — пунктирный след и «?»; мигает вместе с пустой строкой кода. */
.kz-frame-miss { position: absolute; left: 0; right: 0; bottom: 0; height: 4.2%; min-height: 9px; z-index: 3;
  border: 2.5px dashed #E0643F; border-radius: 2px; background: repeating-linear-gradient(-45deg, rgba(224, 100, 63, .2) 0 6px, transparent 6px 12px); }
.kz-frame-miss-q { position: absolute; left: 50%; top: 50%; translate: -50% -50%; padding: 1px 10px 2px; background: #E0643F; color: #FBF6EA;
  font: 800 clamp(14px, 2.4dvh, 20px)/1.2 'Manrope', sans-serif;
  clip-path: polygon(0 10%, 10% 0, 50% 8%, 90% 0, 100% 14%, 96% 52%, 100% 88%, 88% 100%, 50% 92%, 10% 100%, 0 86%, 4% 50%); }
.kz-frame-miss.is-blink, .kz-frame-miss.is-blink .kz-frame-miss-q { animation: kzMiss 1s steps(1, end) infinite; }
@keyframes kzMiss { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
.kz-s6-box { z-index: 2; }
.kz-scene.is-flying .kz-s6-box { z-index: 30; }

/* Итог: роли */
.kz-roles { display: grid; gap: 7px; }
.kz-role { display: flex; align-items: center; gap: 10px; padding: 7px 12px; background: #FBF6EA; font: 700 14.5px 'Manrope', sans-serif; color: #1F2A44;
  clip-path: polygon(0 8%, 5% 0, 60% 6%, 98% 0, 100% 50%, 98% 100%, 40% 94%, 2% 100%, 0 50%); transition: background .2s; }
.kz-role i { flex: none; width: 14px; height: 14px; border-radius: 3px; background: var(--c); }
.kz-role.is-on { background: #FFF1C9; }
.kz-next { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: #1F2A44; color: #FBF6EA; font: 700 14px 'Manrope', sans-serif;
  clip-path: polygon(0 6%, 4% 0, 96% 5%, 100% 0, 99% 50%, 100% 100%, 50% 95%, 0 100%, 1% 50%); }
.kz-next b { color: #F0B13F; }
.kz-msg { margin: 0; text-align: center; font: 700 14px 'Manrope', sans-serif; color: #5B4300; }

/* Облако Коди — бумажная полоска */
.speaker-bot .speaker-bubble { background: #FBF6EA; }

@media (prefers-reduced-motion: reduce) {
  .kz-cut, .kz-cut-in, .kz-line, .kz-label-paper, .kz-btn, .kz-scrap, .kz-a-drop, .kz-a-rise, .kz-a-left, .kz-a-right, .kz-a-pop, .kz-a-stamp, .kz-a-shake { animation: none !important; }
  .kz-a-out { animation: none !important; opacity: 0; }
  .kz-deco, .kz-par { translate: none !important; }
}

/* ── Части набора ─────────────────────────────────────────────────────────── */
.kz-tag { white-space: nowrap; }
.kz-manbox { position: absolute; inset: 9% 15% 7% 15%; }
.kz-manbox-free { inset: 0; }
.kz-s1 .kz-stagebox { height: min(100%, 62dvh); }
.kz-s1-page { max-width: 640px; width: 100%; }
.kz-face { position: absolute; inset: 0; display: block; }
.kz-eye { position: absolute; top: 40%; width: 9%; height: 10%; border-radius: 50%; background: #1F2A44; display: block; }
.kz-smile { position: absolute; left: 41%; top: 60%; width: 20%; height: 9%; background: #E0643F; display: block;
  clip-path: polygon(0 0, 100% 0, 88% 60%, 50% 100%, 12% 60%); }
.kz-man-title-t { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font: 800 clamp(11px, 1.8dvh, 15px) 'Manrope', sans-serif; color: #1F2A44; white-space: nowrap; }
.kz-wave-l { animation: kzWaveL 1.6s steps(1, end) infinite; transform-origin: 100% 50%; }
.kz-wave-r { animation: kzWaveR 1.6s steps(1, end) infinite; transform-origin: 0% 50%; }
@keyframes kzWaveR { 0%, 100% { transform: none; } 25% { transform: rotate(-22deg); } 50% { transform: rotate(-8deg); } 75% { transform: rotate(-26deg); } }
@keyframes kzWaveL { 0%, 100% { transform: none; } 50% { transform: rotate(6deg); } }

/* Рамка вокруг человечка и места для бирок (s5) */
.kz-slot { position: absolute; z-index: 5; display: grid; place-items: center; min-width: 128px; min-height: 42px; padding: 0; border: none; background: none; cursor: pointer; }
.kz-slot-top { left: -2%; top: -5%; }
.kz-slot-bot { right: -2%; bottom: -6%; }
.kz-slot-dash { display: block; width: 124px; height: 38px; border: 2px dashed rgba(31, 42, 68, .45); border-radius: 4px; background: rgba(251, 246, 234, .7); rotate: -2deg; }
.kz-slot.is-hover .kz-slot-dash { border-color: #E0643F; background: #FFE4D8; }
.kz-slot.is-full { cursor: default; }
.kz-slot .led { top: -2px; right: -2px; }

/* Браузер: содержимое */
.kz-bits { display: flex; flex-direction: column; gap: 8px; height: 100%; }
.kz-bits-row { display: flex; gap: 8px; align-items: flex-start; flex: 1 1 auto; min-height: 0; }
.kz-bit-lines { flex: 1 1 auto; display: flex; flex-direction: column; gap: 7px; padding-top: 4px; }
.kz-cut.kz-bit-line { position: relative; height: clamp(5px, .9dvh, 8px); }
.kz-cut.kz-bit-pic { position: relative; flex: 0 0 34%; aspect-ratio: 4 / 3; }
.kz-pic-sun { position: absolute; right: 16%; top: 16%; width: 18%; aspect-ratio: 1; border-radius: 50%; background: #F0B13F; }
.kz-pic-mnt { position: absolute; left: 10%; right: 10%; bottom: 8%; height: 55%; background: #1F2A44; clip-path: polygon(0 100%, 34% 18%, 52% 60%, 70% 30%, 100% 100%); }
.kz-cut.kz-bit-btn { position: relative; align-self: flex-end; width: 26%; aspect-ratio: 3 / 1; }
.kz-bit-btn span { position: absolute; inset: 0; display: grid; place-items: center; font: 800 clamp(10px, 1.6dvh, 13px) 'Manrope', sans-serif; color: #fff; }
.kz-mini-pic { display: inline-block; width: 20px; height: 15px; background: #2A8C7E; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); position: relative;
  background-image: linear-gradient(135deg, transparent 55%, #1F2A44 55%); }

/* Мини-страница в разрезе */
.kz-collage { position: relative; width: 100%; aspect-ratio: 1.25 / 1; max-height: 100%; }
.kz-col-doc { left: 0; top: 0; }
.kz-cut.kz-col-html { left: 2%; right: 2%; top: 16%; bottom: 0; }
.kz-col-in { position: absolute; inset: 9% 5% 6% 5%; display: flex; flex-direction: column; gap: 6%; }
.kz-cut.kz-col-head { position: relative; flex: 0 0 26%; }
.kz-cut.kz-col-body { position: relative; flex: 1 1 auto; }
.kz-col-title { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 2px; padding: 0 6px;
  font: 700 clamp(11px, 1.7dvh, 14px) 'JetBrains Mono', monospace; color: #1F2A44; }
.kz-col-title .kz-tag { background: rgba(251, 246, 234, .7); padding: 1px 3px; }
.kz-col-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 8px 12px; text-align: center;
  font: 800 clamp(13px, 2.1dvh, 19px)/1.25 'Manrope', sans-serif; color: #FBF6EA; overflow-wrap: anywhere; }
.kz-col-lbl { z-index: 6; }
.kz-col-lbl-html { right: 4%; top: 16%; translate: 0 -50%; }
.kz-col-lbl-head { left: 7%; top: 23.6%; translate: 0 -50%; }
.kz-col-lbl-body { left: 7%; top: 46.1%; translate: 0 -50%; }

/* План: карточка — вырезка во всю кнопку */
.kz-cut.kz-card-cut { inset: 0; }
.kz-card-face { position: absolute; inset: 0; }
.kz-card .led { top: 4px; right: 4px; }

/* Зоны сортировки */
.kz-cut.kz-zone-cut { inset: 0; }
.kz-zone .kz-label { z-index: 2; }

/* Сборка */
.kz-code-host { flex: 1 1 58%; min-width: 0; }
.kz-code-sm { font-size: clamp(13px, 1.75dvh, 15.5px); }
.kz-code-sm .kz-line { min-height: 27px; }
.kz-line.kz-fixed { opacity: .85; }
.kz-dash-sm { flex: 0 0 64px; }
.kz-slip-wrap { align-self: center; min-width: 60%; }
.kz-line.kz-slip { justify-content: center; font-size: 1.1em; }
.kz-scene-col { flex-direction: column; }
.kz-s12 .kz-col-code { flex: 0 1 44%; }
.kz-s15-side { gap: 12px; }
.kz-s15-man { position: relative; width: clamp(90px, 18dvh, 160px); aspect-ratio: 1 / 1.08; align-self: center; }

@media (max-width: 759px) {
  .kz-s12 .kz-col-code { flex: 0 0 auto; }
  .kz-s12 .kz-collage { width: min(100%, 300px); align-self: center; }
  .kz-s15 .kz-collage { width: min(100%, 300px); align-self: center; }

  .kz-zones { gap: 8px; }
  .kz-slot { min-width: 100px; }
  .kz-slot-dash { width: 98px; height: 32px; }
}
.kz-scene-col > .kz-col { width: min(100%, 600px); flex: 0 1 auto; }
.kz-s15-left { position: relative; }
.kz-s15-man { position: absolute; right: -1%; bottom: -3%; width: 21%; aspect-ratio: 1 / 1.08; z-index: 7; }
@media (max-width: 759px) {
  .kz-br { max-width: min(100%, calc(var(--brh, 24dvh) * 1.52)); }
  .kz-br.is-short { max-width: min(100%, calc(var(--brh, 19dvh) * 2.16)); }
  .kz-s15-man { display: block; width: 23%; }
  .kz-zone { min-height: clamp(96px, 18dvh, 160px); }
}
/* Браузер над кодом — ниже, чтобы код помещался */
.kz-col > .kz-br:not(.is-short) { --brh: 28dvh; }
.kz-scene-col { justify-content: flex-start; }
.kz-s9 .kz-br, .kz-s6-col .kz-br { --brh: 26dvh; }
@media (max-width: 759px) {
  .kz-col > .kz-br:not(.is-short) { --brh: 20dvh; }
}
.kz-build > .kz-code-host { flex: 1 1 58%; }
@media (max-width: 759px) {
  .kz-build > .kz-code-host { flex: 0 0 auto; width: 100%; }
  .kz-s12 { gap: 6px; }
  .kz-s12 .kz-code { gap: 2px; font-size: 12.5px; }
  .kz-s12 .kz-line { min-height: 21px; padding-top: 1px; padding-bottom: 1px; }
  .kz-s12 .kz-collage { width: min(100%, 230px); }
}
/* Длинное имя на вкладке не распирает браузер и лист: вкладка сжимается, текст — с многоточием. */
.kz-br, .kz-br-bar, .kz-br-tab, .kz-br-tab-t, .kz-br-tool, .kz-br-url, .kz-scene, .kz-sheet-body { min-width: 0; }
.kz-br-bar { overflow: hidden; }
.kz-br-tab { flex: 0 1 auto; }
/* Крючок и итог: браузер крупно */
.kz-s1-page .kz-br { --brh: 50dvh; }
@media (max-width: 759px) { .kz-s1-page .kz-br { --brh: 34dvh; } }
.kz-col.kz-s1-page > .kz-br:not(.is-short) { --brh: 50dvh; }
@media (max-width: 759px) { .kz-col.kz-s1-page > .kz-br:not(.is-short) { --brh: 34dvh; } }
/* Хук: человечек поверх места, где садится браузер; голова и тело летят к
   вкладке и окну, руки и ноги разлетаются. */
.kz-s1 { position: relative; }
.kz-s1 .kz-s1-man { position: absolute; left: 50%; top: 50%; translate: -50% -50%; z-index: 6; height: min(100%, 62dvh); }
.kz-scatter .kz-s1-man .kz-cut:not([aria-label]) { animation: kzOut .58s steps(1, end) both; animation-delay: .72s; }
.kz-scatter .kz-s1-man .kz-cut:not([aria-label]):nth-child(2n) { animation-name: kzOutL; }
@keyframes kzOutL {
  0% { transform: none; } 20% { transform: translate(-4%, -16%) rotate(-6deg); } 40% { transform: translate(-14%, -60%) rotate(-14deg); }
  60% { transform: translate(-26%, -120%) rotate(-24deg); } 80% { transform: translate(-38%, -190%) rotate(-34deg); opacity: .6; }
  100% { transform: translate(-50%, -260%) rotate(-44deg); opacity: 0; } }
@media (max-width: 759px) { .kz-s1 .kz-s1-man { height: min(100%, 44dvh); } }
/* План: карточки открываются сами — пока Коди рассказывает, они не нажимаются,
   но и не бледнеют. */
.kz-card:disabled, .stage.is-speaking .stage-content .kz-card:disabled { opacity: 1; cursor: default; filter: none; }
@media (prefers-reduced-motion: reduce) {
  .kz-hand, .kz-hand svg, .kz-ghost { transition: none; }
  .kz-frame-miss.is-blink, .kz-frame-miss.is-blink .kz-frame-miss-q, .kz-scene.is-dragging .kz-slot .kz-slot-dash { animation: none; }
}
/* Теги-вырезки в лотке — того же размера и шрифта, что теги на рамке. */
.kz-scrap.kz-scrap-tag { padding: 8px 16px; font: 800 clamp(16px, 2.8dvh, 22px)/1.2 'JetBrains Mono', ui-monospace, monospace; }
/* S5: нижнее место на рамке выступает вниз — лоток чуть отступает от него. */
@media (max-width: 759px) { .kz-scene.is-tight + .kz-tray { margin-top: 12px; } }

/* s11: имя страницы в теге title на вырезке. */
.kz-scrap-code { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 700; white-space: nowrap; }
.kz-scrap-code .kz-tag { font-weight: 700; }
/* s14: пустое место в строке title — сюда кладут тег. */
.kz-dash.kz-drop { flex: 0 0 auto; width: clamp(78px, 9em, 120px); height: 1.6em; border: 2px dashed rgba(224, 100, 63, .7); border-radius: 4px; background: rgba(251, 246, 234, .6); }
.kz-dash.kz-drop.is-call { animation: kzSlotCall 1s steps(1, end) infinite; }
.kz-dash.kz-drop.is-hover { border-style: solid; background: #FFE4D8; scale: 1.08; }
@media (prefers-reduced-motion: reduce) { .kz-dash.kz-drop.is-call { animation: none; } }

/* Коллаж страницы (s12, s15): бирки компактные, у каждой своё место —
   DOCTYPE над рамкой, html — на верхнем крае рамки справа, head и body — на
   верхнем крае своих блоков (геометрия: рамка с 16 %, голова 23,6–40 %, тело с 46 %). */
.kz-collage .kz-label-paper { font-size: clamp(11px, 1.8dvh, 15px); padding: 2px 8px 3px; }
.kz-collage .kz-label-tape { left: -7px; top: -6px; width: 22px; height: 10px; }
/* s15 на ноутбуке: коллаж крупнее (по высоте листа), подписи ролей читаемее. */
@media (min-width: 760px) {
  .kz-s15 .kz-s15-left { flex: 1.35 1 0; max-width: 700px; }
  .kz-s15 .kz-collage { width: min(100%, calc((100dvh - 290px) * 1.25)); align-self: center; }
  .kz-s15 .kz-s15-side { max-width: 480px; gap: 14px; }
  .kz-s15 .kz-role { font-size: clamp(14.5px, 2.2dvh, 18px); padding: 9px 14px; }
  .kz-s15 .kz-next { font-size: clamp(14px, 2.1dvh, 17px); padding: 11px 16px; }
}
/* Ноутбук: код и вырезки крупнее — места на листе много, а 14 px читались мелко. */
@media (min-width: 760px) {
  .kz-code { font-size: clamp(15px, 2.3dvh, 20px); }
  .kz-line { min-height: 34px; }
  .kz-code-sm { font-size: clamp(14px, 2.05dvh, 18px); }
  .kz-scrap, .kz-pool .kz-scrap { font-size: clamp(15px, 2.3dvh, 19px); }
}
@media (max-width: 759px) {
  /* s14: пустое место — в той же строке, что «<title>имя», без переноса. */
  .kz-dash.kz-drop { width: 60px; height: 1.35em; }
}

/* Ноутбук: рамка с бирками ниже высоты сцены — верхняя бирка не залезает на
   строку задания, нижняя не свисает за край листа. */
@media (min-width: 760px) {
  .kz-scene:not(.kz-s1) > .kz-stagebox { height: calc(100% - 48px); }
}
@media (min-width: 760px) {
  /* s4–s5: снизу рамки ещё и место для тега — чуть больше воздуха. */
  .kz-scene.is-tight > .kz-stagebox { height: calc(100% - 64px); }
}

/* Слой руки: кисть может свисать за край листа, но не раздувает экран
   (overflow: clip не добавляет прокрутку; запас видимости — clip-margin). */
.kz-hand-layer { position: absolute; inset: 0; z-index: 40; pointer-events: none; overflow: clip; overflow-clip-margin: 90px; }
@media (min-width: 760px) {
  /* s11: зоны головы и тела выше — на ноутбуке под ними было пусто. */
  .kz-zone { min-height: clamp(150px, 36dvh, 340px); }
}
/* Канон поднимает содержимое экрана снизу (fadeUp, 10 px). Лист занимает всю
   высоту, и в начале подъёма он на миг вылезал за край (переполнение 4 px).
   Для листа — появление без сдвига: бумага и так влетает своими анимациями. */
.stagger > .kz-sheet, .stage-content > .limit > .kz-sheet { animation-name: kzSheetIn; }
@keyframes kzSheetIn { from { opacity: 0; } to { opacity: 1; } }
/* s11: имя в теге внутри зоны не шире зоны — переносится между тегом и словом. */
.kz-zone-items .kz-scrap-code { display: inline-flex; flex-wrap: wrap; justify-content: center; white-space: normal; font-size: 12.5px; }

/* Тег на скотче подсвечен — о нём сейчас говорит Коди (s3: определение тега).
   Тег — кнопка, а пока Коди говорит, канон гасит кнопки (opacity .62); подсвеченный
   тег не гаснет: о нём и идёт речь. Чуть крупнее, коралловое свечение. */
.kz-label.is-hl, .stage.is-speaking .stage-content .kz-label.is-hl, .stage .stage-content button.kz-label.is-hl:disabled {
  opacity: 1; scale: 1.14; z-index: 8;
  filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 6px #E0643F) drop-shadow(0 0 12px rgba(224, 100, 63, .8)); }
.kz-label.is-hl .kz-label-paper { background: #FFE4D8; }

/* s12: строки, о которых сейчас говорит Коди, — цветом своей части (html — коралл,
   head — горчица, body — бирюза) и свечением. */
.kz-line.is-say { background: var(--sb, #FFE4D8); filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 6px var(--sc, #E0643F)); z-index: 1; }
.kz-line.is-say-doc, .kz-line.is-say-html { --sb: #FFE1D6; --sc: #E0643F; }
.kz-line.is-say-head { --sb: #FCE9B8; --sc: #F0B13F; }
.kz-line.is-say-body { --sb: #D2EDE7; --sc: #2A8C7E; }

/* ПЕРЕХОД «РАЗБОР И СБОРКА» (kollazh-trans.jsx).
   Снимок старого листа: свои анимации копии выключены, вырезки ступенчато
   разлетаются наружу с поворотом и гаснут. */
.kz-snap { position: fixed; z-index: 60; pointer-events: none; }
.kz-snap, .kz-snap * { animation: none !important; transition: none !important; }
.kz-snap .kz-out-go { animation: kzScatter .52s steps(1, end) var(--od, 0s) both !important; }
@keyframes kzScatter {
  0% { transform: none; opacity: 1; }
  14% { transform: translate(calc(var(--ox) * .03), calc(var(--oy) * .03 - 8px)) rotate(calc(var(--or) * .12)); }
  28% { transform: translate(calc(var(--ox) * .12), calc(var(--oy) * .12)) rotate(calc(var(--or) * .3)); }
  42% { transform: translate(calc(var(--ox) * .26), calc(var(--oy) * .26)) rotate(calc(var(--or) * .5)); }
  57% { transform: translate(calc(var(--ox) * .45), calc(var(--oy) * .45)) rotate(calc(var(--or) * .68)); }
  71% { transform: translate(calc(var(--ox) * .66), calc(var(--oy) * .66)) rotate(calc(var(--or) * .84)); opacity: .9; }
  85% { transform: translate(calc(var(--ox) * .86), calc(var(--oy) * .86)) rotate(var(--or)); opacity: .55; }
  100% { transform: translate(var(--ox), var(--oy)) rotate(var(--or)); opacity: 0; } }
/* Новый экран ждёт, пока старое разлетается: содержимое листа скрыто, свои влёты на паузе. */
.kz-asm-wait > .kz-sheet-body { visibility: hidden; }
.kz-asm-wait > .kz-sheet-body * { animation-play-state: paused !important; }
/* Сборка: вырезка слетается сверху сбоку ступеньками, с лёгким перелётом. */
@keyframes kzAsmIn {
  0% { transform: translate(var(--ix), var(--iy)) rotate(var(--ir)); opacity: 0; }
  12% { transform: translate(calc(var(--ix) * .7), calc(var(--iy) * .7)) rotate(calc(var(--ir) * .7)); opacity: 1; }
  28% { transform: translate(calc(var(--ix) * .4), calc(var(--iy) * .4)) rotate(calc(var(--ir) * .4)); }
  44% { transform: translate(calc(var(--ix) * .16), calc(var(--iy) * .16)) rotate(calc(var(--ir) * .16)); }
  60% { transform: translate(calc(var(--ix) * -.03), calc(var(--iy) * -.02 + 4px)) rotate(calc(var(--ir) * -.08)); }
  78% { transform: translate(calc(var(--ix) * .01), -2px) rotate(calc(var(--ir) * .03)); }
  100% { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .kz-snap { display: none; } }
/* s11: зоны head (горчица) и body (бирюза). Бирки зон и разложенные вырезки —
   светлые: горчичные сливались с горчичной зоной head. Зоны — большие цветные
   поля, пока Коди говорит, они не бледнеют (канон гасит кнопки до .62). */
.kz-zone .kz-label-paper { background: #FBF6EA; }
.stage.is-speaking .stage-content .kz-zone:disabled, .stage .stage-content .kz-zone:disabled { opacity: 1; filter: none; }

/* s11: вырезка, положенная в зону, — бумажка: рваный край (как в лотке), мягкая
   тень на зону, свой небольшой наклон. Светлая, чтобы читалась на горчице и бирюзе. */
.kz-zone-item { display: inline-flex; max-width: 100%; rotate: var(--r, 0deg);
  filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .35)) drop-shadow(0 4px 5px rgba(74, 48, 18, .18)); }
.kz-zone-item-in { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 6px 12px 7px; background: #FBF6EA; color: #1F2A44;
  font: 800 clamp(12.5px, 1.9dvh, 16px)/1.2 'Manrope', sans-serif;
  clip-path: polygon(0 10%, 8% 0, 50% 6%, 92% 0, 100% 12%, 97% 52%, 100% 90%, 90% 100%, 50% 94%, 8% 100%, 0 88%, 3% 50%); }
.kz-zone-item-in .kz-scrap-code { font-size: clamp(11.5px, 1.75dvh, 15px); }
/* Зона растёт под разложенные вырезки (на телефоне они идут столбиком) —
   содержимое в потоке, цветная бумага зоны тянется за ним. */
.kz-zone-in { position: relative; inset: auto; min-height: 100%; }

/* s12: строки кода горчичные, поэтому светлая подсветка делала строку цвета листа —
   она будто пропадала. Подсвеченная строка (её читает браузер или о ней говорит
   Коди) — тёмная, со светлым текстом и полосой цвета своей части слева:
   html — коралл, head — горчица, body — бирюза. */
.kz-line.is-read, .kz-line.is-say { background: linear-gradient(90deg, var(--sc, #E0643F) 0 14px, #1F2A44 14px); color: #FBF6EA; filter: none; }
.kz-line.is-read .kz-tk-n, .kz-line.is-say .kz-tk-n, .kz-line.is-read .kz-txt, .kz-line.is-say .kz-txt { color: #FBF6EA; }
.kz-line.is-read .kz-tk-b, .kz-line.is-say .kz-tk-b { color: #FF8A65; }
/* Коллаж страницы (s12, s15): бирки светлые — горчичные сливались с горчичной головой. */
.kz-collage .kz-label-paper { background: #FBF6EA; }

/* s13: бумажные кнопки ▲ ▼ у правого края поставленной полоски (внутри жёлтой
   полоски — поверх её края; текст строки под них не заезжает). */
.kz-line-row { position: relative; display: flex; min-width: 0; }
.kz-line-row > .kz-line { flex: 1 1 auto; min-width: 0; padding-right: 74px; }
.kz-move { position: absolute; right: 7px; top: 50%; translate: 0 -50%; z-index: 3; display: flex; gap: 4px; }
.kz-move.is-hide { visibility: hidden; }
.kz-move-b { width: 30px; height: 24px; border: none; padding: 0; display: grid; place-items: center; cursor: pointer;
  background: #FBF6EA; color: #1F2A44;
  clip-path: polygon(0 10%, 12% 0, 50% 6%, 88% 0, 100% 12%, 96% 52%, 100% 90%, 88% 100%, 50% 94%, 12% 100%, 0 88%, 4% 50%);
  filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .3)); }
.kz-move-b.is-down svg { rotate: 180deg; }
.kz-move-b:active:not(:disabled) { translate: 0 1px; background: #FFE4D8; }
.kz-move-b:disabled { opacity: .3; cursor: default; }
@media (max-width: 759px) { .kz-move-b { width: 27px; height: 22px; } .kz-line-row > .kz-line { padding-right: 66px; } .kz-move { right: 5px; gap: 3px; } }
/* Перестановка, как бумажки: полоска приподнята (крупнее, длинная тень, наклон)
   и ступенчато проезжает над соседней; соседняя уезжает под ней. --dy — откуда. */
.kz-line.kz-slide-up { position: relative; z-index: 4; animation: kzSlideUp .5s steps(1, end) both; }
.kz-line.kz-slide-under { position: relative; z-index: 1; animation: kzSlideUnder .5s steps(1, end) both; }
@keyframes kzSlideUp {
  0% { transform: translateY(var(--dy)); filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .26)); }
  14% { transform: translateY(calc(var(--dy) - 3px)) scale(1.05) rotate(-1.4deg); filter: drop-shadow(0 8px 8px rgba(74, 48, 18, .35)); }
  30% { transform: translateY(calc(var(--dy) * .72 - 3px)) scale(1.06) rotate(-1.8deg); filter: drop-shadow(0 10px 10px rgba(74, 48, 18, .35)); }
  46% { transform: translateY(calc(var(--dy) * .42 - 2px)) scale(1.06) rotate(-1.2deg); filter: drop-shadow(0 10px 10px rgba(74, 48, 18, .35)); }
  62% { transform: translateY(calc(var(--dy) * .15 - 2px)) scale(1.05) rotate(-.6deg); filter: drop-shadow(0 8px 8px rgba(74, 48, 18, .3)); }
  80% { transform: translateY(1px) scale(1.01); filter: drop-shadow(0 3px 3px rgba(74, 48, 18, .28)); }
  100% { transform: none; filter: drop-shadow(0 1.5px 1px rgba(74, 48, 18, .26)); } }
@keyframes kzSlideUnder {
  0% { transform: translateY(var(--dy)); }
  20% { transform: translateY(calc(var(--dy) * .85)) scale(.98); }
  40% { transform: translateY(calc(var(--dy) * .55)) scale(.98); }
  60% { transform: translateY(calc(var(--dy) * .25)) scale(.99); }
  80% { transform: translateY(calc(var(--dy) * .05)); }
  100% { transform: none; } }
@media (prefers-reduced-motion: reduce) { .kz-line.kz-slide-up, .kz-line.kz-slide-under { animation: none; } }
`;
