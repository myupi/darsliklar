// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «HTML: загляни внутрь страницы — эксперимент»
// Урок 1 курса HTML заново: объёмная модель документа (навык anatomy) рядом с
// мини-браузером и настоящим кодом. 8 этапов, 11–14 лет.
// Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
//
// Пропсы: { studentName, lang, ttsApiBase, voiceGender, onFinished } — весь список.
// ФАЙЛ СОБРАН: node tools/anatomy/zaglyani.build.mjs. Правится
// tools/anatomy/zaglyani.src.jsx и zaglyani.figures.mjs, а не этот файл.
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
// руки-варежки и короткие ноги.
//
// РИСУНОК v3 (15.10.2026) — по референсам заказчика (модельный лист, 13 поз,
// лист лица, «разобранный» Коди); размеры сняты с картинок по пикселям.
//   · шлем широкий и приземистый, медная рамка экрана почти во весь шлем;
//   · глаза — круглые светящиеся точки, рот — тонкая дуга; в радости рот-
//     полукруг, в восторге — пятиконечные звёзды;
//   · уши — медные вставки в боках шлема вровень с силуэтом (на референсе они
//     торчат — там же это отмечено как ошибка; заказчик просил без выпирания);
//   · шеи нет: голова стоит прямо на вороте свитера (заказчик, 15.10.2026);
//     свитер с округлыми плечами — рукав растёт из плеча; крупные варежки;
//   · ноги-столбики с зазором и массивные тёмно-синие кеды с кремовой подошвой.
// Углы рук в «rule» и «wonder» шире общей системы поз (KODI_POSE) — как на
// референсе.
//
// РИСУЕТСЯ КОДОМ, как робот Курса 0: урок автономен, поза меняется параметром,
// цвета лежат здесь. Система движения (позы, такты, тайминги) — та же, что у
// робота Курса 0, дословно: CSS канона двигает героя по классам узлов, а не по
// рисунку. Каждый подвижный узел — пара pose + beat.
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

// ЖИЗНЬ ЛИЦА — собственный слой Коди поверх системы движения канона.
// Классы состояний (eyes-*, loop-*, is-talking, no-blink) ставит RobotSVG,
// поэтому слой знает, что сейчас чувствует герой, не спрашивая экран.
// Все циклы медленнее 3 Гц; пауза урока и «меньше движения» их останавливают.
const KODI_CSS = `
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

/* ОПОРА НА НОГИ. Система движения канона наклоняет корпус целиком, вокруг
   нижней точки фигуры: робот Курса 0 парит, и крен в 24° («любопытство»)
   читается у него как наклон. Коди стоит на ногах — тот же крен валит его
   набок вместе с ногами, будто он падает. Поэтому у Коди наклон позы
   (--bodyRot) берёт только верх — свитер, голову и руки — и идёт от пояса,
   а ноги стоят. Сдвиги и сжатия позы (прыжок, оседание) по-прежнему двигают
   героя целиком. Крен смягчён: от пояса тот же угол выглядел бы поклоном. */
.bot.kodi .bot-pose-body {
  transform: translate(var(--bodyX), var(--bodyY)) scale(var(--bodySX), var(--bodySY)); }
.bot.kodi .kodi-torso { transform-box: view-box; transform-origin: 210px 288px;
  transform: rotate(calc(var(--bodyRot) * .55));
  transition: transform var(--dur) var(--ease); }

/* ПЛЕЧО — ТОЧКА ВРАЩЕНИЯ РУКИ. Канон задаёт её процентами рамки фигуры
   (50% 7%). У группы такта, вложенной в уже повёрнутую руку, браузер считает
   эти проценты не от плеча: в «привет» рука махала вокруг кисти, а плечо
   ездило. Поэтому у Коди точка вращения обеих групп руки — центр плечевого
   шарнира в координатах рисунка. */
.bot.kodi .bot-pose-arm-l, .bot.kodi .bot-beat-arm-l { transform-box: view-box; transform-origin: 127px 222px; }
.bot.kodi .bot-pose-arm-r, .bot.kodi .bot-beat-arm-r { transform-box: view-box; transform-origin: 293px 222px; }
/* Сдвиги рук в позах канона (armLX/armRX до 44 px) подбирались под
   прежнюю точку вращения и уводили плечо на грудь — в «point» рука росла из
   середины свитера. У Коди рука вращается ровно вокруг плеча, поэтому из позы
   берётся только поворот: кисти и так приходят куда нужно (к подбородку в
   «думаю», вместе под лицом в «улыбке», крест-накрест в «смущении»). */
.bot.kodi .bot-pose-arm-l { transform: rotate(var(--armLR)); }
.bot.kodi .bot-pose-arm-r { transform: rotate(var(--armRR)); }

.speaker-av .kodi { transition: transform .22s cubic-bezier(.34,1.56,.64,1); }
.speaker-av:active .kodi { transform: scale(.93, .9); }

@media (prefers-reduced-motion: reduce) {
  .kodi .kodi-gaze, .kodi .kodi-blink, .kodi .kodi-glare,
  .kodi.is-talking .kodi-mouth, .kodi.is-talking .kodi-ear { animation: none !important; }
  .kodi .kodi-glare { display: none; }
}
`;

// Градиенты и обтравка объявляются внутри каждого экземпляра, поэтому им нужны
// разные имена: на экране бывает два героя сразу (маленький в шапке и крупный
// на прощании), и одинаковые id склеили бы их.
let _botUid = 0;

// ─────────────────────────────────────────────────────────────────────────────
// КОДИ. Имя компонента RobotSVG оставлено каноническим: его зовут
// PersonaBubble, прощание и типовые экраны, и замена героя не трогает их код.
//
// Рамка та же, что у робота Курса 0 (viewBox 20 -70 380 520): её поля посчитаны
// по крайним точкам движения, и Коди укладывается в те же габариты.
//
// ПРОПОРЦИИ (v3, по референсам заказчика 15.10.2026: модельный лист и
// «разобранный» Коди, размеры сняты с картинок по пикселям). Рост от макушки до
// подошвы 366: шлем 204 × 153 (~42% роста, широкий и приземистый), шея, свитер
// 98 (подол y 284), ноги-столбики 51 с зазором 12, кеды 74 × 37. Медная рамка экрана — почти во весь шлем. Уши — вставки вровень
// с силуэтом (на референсе они торчат, это отмечено там же как ошибка).
// Ось симметрии x = 210; пояс (ось наклона торса) y = 288; плечевые шарниры
// (127, 222) и (293, 222) — точки вращения рук в KODI_CSS.
//
// Внутри рисунка нет атрибутов transform у групп и фигур с масштабом или
// отражением: канон ставит узлам героя transform-box: fill-box, и такие
// трансформации считались бы от края фигуры. Поэтому правая рука и правая нога
// не зеркалятся атрибутом, а получают отражённые координаты (mirror ниже).
//
// РУКА — ТРУБА ОТ ПЛЕЧА. Рука нарисована строго вертикально, плечевой шарнир —
// круг наверху: при любом повороте (до ±158° в позах) рукав остаётся рукавом.
// ─────────────────────────────────────────────────────────────────────────────

// Углы рук, которые у Коди отличаются от общей системы поз: на референсах
// «объясняю правило» и «ого!» руки разведены заметно шире.
const LID_LIFT = 12;
const KODI_POSE = {
  rule: { armLR: 46, armRR: -46 },
  wonder: { armLR: 52, armRR: -52 }
};

function RobotSVG({ pose = 'explain', className, talking }) {
  const key = POSE_SET[pose] ? pose : 'explain';
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  const P = Object.assign({}, S.pose, KODI_POSE[key] || {});
  // Веки Коди висят на 12 выше глаз, чтобы их край не срезал свечение глаз в
  // покое; опущенное веко проходит на те же 12 дальше — выражение не меняется.
  if (P.lidY > 0) P.lidY += LID_LIFT;
  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': KODI_GLOW[S.accent] || S.accent };
  Object.keys(P).forEach((k) => { vars['--' + k] = P[k] + (POSE_UNIT[k] || ''); });

  const cls = ['bot', 'kodi', 'eyes-' + S.eyes, S.loop];
  if (S.noBlink) cls.push('no-blink');
  if (talking) cls.push('is-talking');
  if (className) cls.push(className);

  const u = (id) => `url(#${uid}${id})`;
  const Spark = ({ x, y, s, d }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="spark" style={d ? { animationDelay: d + 'ms' } : undefined}
        fill="var(--accent)"
        d="M0 -25 C3 -8 8 -3 25 0 C8 3 3 8 0 25 C-3 8 -8 3 -25 0 C-8 -3 -3 -8 0 -25 Z" />
    </g>
  );

  // Отражение через ось x = 210: правая половина — те же фигуры, что левая.
  const MX = 420;
  const mx = (x) => +(MX - x).toFixed(2);
  const mirrorPath = (d) => {
    let cmd = '';
    let i = 0;
    return d.replace(/[A-Za-z]|-?\d*\.?\d+/g, (t) => {
      if (/[A-Za-z]/.test(t)) { cmd = t.toUpperCase(); i = 0; return t; }
      const flip = cmd === 'H' || (cmd !== 'V' && i % 2 === 0);
      i += 1;
      return flip ? String(mx(parseFloat(t))) : t;
    });
  };

  // Рука: шарнир, рукав-труба с вязаной манжетой, крупная варежка с большим
  // пальцем к телу.
  const ARM_L = {
    cap: [127, 222, 17],
    sleeve: 'M110 222 C110 212 118 205 127 205 C136 205 144 212 144 222 L144 274 C144 282 136 287 127 287 C118 287 110 282 110 274 Z',
    shade: 'M138 210 C142 214 144 218 144 224 L144 272 C144 278 141 283 136 285',
    cuff: { x: 108, y: 268, w: 38, h: 15 },
    hand: [127, 298, 21, 23],
    thumb: [146, 290, 8, 11],
    seam: 'M111 292 Q125 300 139 293',
    shine: [118, 291, 6, 8]
  };
  const ARM_R = {
    cap: [mx(ARM_L.cap[0]), ARM_L.cap[1], ARM_L.cap[2]],
    sleeve: mirrorPath(ARM_L.sleeve),
    shade: mirrorPath(ARM_L.shade),
    cuff: { x: mx(ARM_L.cuff.x) - ARM_L.cuff.w, y: ARM_L.cuff.y, w: ARM_L.cuff.w, h: ARM_L.cuff.h },
    hand: [mx(ARM_L.hand[0]), ARM_L.hand[1], ARM_L.hand[2], ARM_L.hand[3]],
    thumb: [mx(ARM_L.thumb[0]), ARM_L.thumb[1], ARM_L.thumb[2], ARM_L.thumb[3]],
    seam: mirrorPath(ARM_L.seam),
    shine: [mx(ARM_L.shine[0]), ARM_L.shine[1], ARM_L.shine[2], ARM_L.shine[3]]
  };
  const Arm = ({ side }) => {
    const a = side === 'l' ? ARM_L : ARM_R;
    return (
      <>
        <circle cx={a.cap[0]} cy={a.cap[1]} r={a.cap[2]} fill={u('w')} />
        <path d={a.sleeve} fill={u('w')} />
        <path d={a.sleeve} fill={u('sl')} />
        <path d={a.shade} fill="none" stroke={BOT.sweaterDk} strokeWidth="3" strokeLinecap="round" opacity=".5" />
        <rect x={a.cuff.x} y={a.cuff.y} width={a.cuff.w} height={a.cuff.h} rx="7" fill={BOT.sweaterDk} />
        <rect x={a.cuff.x} y={a.cuff.y} width={a.cuff.w} height={a.cuff.h} rx="7" fill={u('rib')} />
        <ellipse cx={a.thumb[0]} cy={a.thumb[1]} rx={a.thumb[2]} ry={a.thumb[3]} fill={u('k')} />
        <ellipse cx={a.hand[0]} cy={a.hand[1]} rx={a.hand[2]} ry={a.hand[3]} fill={u('k')} />
        <path d={a.seam} fill="none" stroke={BOT.headDk} strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
        <ellipse cx={a.shine[0]} cy={a.shine[1]} rx={a.shine[2]} ry={a.shine[3]} fill="#fff" opacity=".55" />
      </>
    );
  };

  // Нога: толстая кремовая голень-столбик и массивный кед: синий верх,
  // кремовая подошва, две полоски шнуровки, блик на носке.
  const LEG_L = {
    shin: { x: 152, y: 276, w: 51, h: 86 },
    shoe: 'M136 384 C134 366 147 350 169 350 C191 350 207 364 206 384 Z',
    sole: { x: 133, y: 380, w: 74, h: 11 },
    lace1: 'M152 361 Q169 356 188 361',
    lace2: 'M147 369 Q169 363 194 369',
    toe: [150, 374, 7, 4]
  };
  const LEG_R = {
    shin: { x: mx(LEG_L.shin.x) - LEG_L.shin.w, y: LEG_L.shin.y, w: LEG_L.shin.w, h: LEG_L.shin.h },
    shoe: mirrorPath(LEG_L.shoe),
    sole: { x: mx(LEG_L.sole.x) - LEG_L.sole.w, y: LEG_L.sole.y, w: LEG_L.sole.w, h: LEG_L.sole.h },
    lace1: mirrorPath(LEG_L.lace1),
    lace2: mirrorPath(LEG_L.lace2),
    toe: [mx(LEG_L.toe[0]), LEG_L.toe[1], LEG_L.toe[2], LEG_L.toe[3]]
  };
  const Leg = ({ side }) => {
    const g = side === 'l' ? LEG_L : LEG_R;
    return (
      <>
        <rect x={g.shin.x} y={g.shin.y} width={g.shin.w} height={g.shin.h} rx="20" fill={u('l')} />
        <rect x={g.sole.x} y={g.sole.y} width={g.sole.w} height={g.sole.h} rx="7" fill={BOT.sole} />
        <rect x={g.sole.x} y={g.sole.y} width={g.sole.w} height={g.sole.h} rx="7" fill="none"
          stroke={BOT.headDk} strokeWidth="1.5" opacity=".6" />
        <path d={g.shoe} fill={u('sh2')} />
        <path d={g.lace1} fill="none" stroke={BOT.sole} strokeWidth="3" strokeLinecap="round" />
        <path d={g.lace2} fill="none" stroke={BOT.sole} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx={g.toe[0]} cy={g.toe[1]} rx={g.toe[2]} ry={g.toe[3]} fill="#fff" opacity=".22" />
      </>
    );
  };

  // Рот: все формы на месте, видна одна — её выбирает KODI_CSS по состоянию.
  // Формы — по листу лица: тонкая дуга, полукруг радости, «о», ровная черта,
  // кривая усмешка.
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

  // УХО — медная вставка в боку шлема, а не наушник. Вставка лежит в обтравке
  // шлема: внешний край идёт ровно по силуэту, ухо не выпирает. Внутри — тёмная
  // прорезь и полоска-индикатор речи.
  const Ear = ({ x, side }) => (
    <>
      <rect x={x} y="78" width="16" height="62" rx="8" fill={u('c')} />
      <rect x={x + (side === 'l' ? 7.5 : 3.5)} y="88" width="5" height="42" rx="2.5" fill={u('cup')} />
      <rect className="kodi-ear" x={x + (side === 'l' ? 8.5 : 4.5)} y="92" width="3" height="34" rx="1.5" fill="none"
        stroke="var(--accent)" strokeWidth="2.5" />
    </>
  );

  return (
    <svg className={cls.join(' ')} style={vars} viewBox="20 -70 380 520"
      aria-hidden="true" focusable="false">
      <style>{KODI_CSS}</style>
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
        {/* свитер: объём сверху вниз, цилиндр рукава слева направо, вязаная резинка */}
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.sweaterLt} />
          <stop offset="100%" stopColor={BOT.sweaterDk} />
        </linearGradient>
        <linearGradient id={uid + 'ws'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity=".3" />
          <stop offset="20%" stopColor="#000" stopOpacity="0" />
          <stop offset="78%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".34" />
        </linearGradient>
        <linearGradient id={uid + 'sl'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity=".14" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <pattern id={uid + 'rib'} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M3 0 V6" stroke={BOT.sweaterLt} strokeWidth="1.6" opacity=".7" />
        </pattern>
        {/* кремовые варежки и голени: скругление светом слева */}
        <linearGradient id={uid + 'k'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCFAF6" />
          <stop offset="60%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        <linearGradient id={uid + 'l'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F9F6F0" />
          <stop offset="55%" stopColor={BOT.headMid} />
          <stop offset="100%" stopColor={BOT.headDk} />
        </linearGradient>
        {/* кеды: свет сверху, тень к подошве */}
        <linearGradient id={uid + 'sh2'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.shoe} />
          <stop offset="100%" stopColor={BOT.shoeDk} />
        </linearGradient>
        {/* прорезь уха: тёплая тёмная медь, а не чёрная дыра */}
        <radialGradient id={uid + 'cup'} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#6B4328" />
          <stop offset="100%" stopColor="#2E1C11" />
        </radialGradient>
        <radialGradient id={uid + 'sh'}>
          <stop offset="0%" stopColor={BOT.shadow} stopOpacity="1" />
          <stop offset="100%" stopColor={BOT.shadow} stopOpacity="0" />
        </radialGradient>
        <clipPath id={uid + 'v'}><rect x="132" y="53" width="156" height="107" rx="27" /></clipPath>
        <clipPath id={uid + 'hc'}><rect x="108" y="24" width="204" height="153" rx="62" /></clipPath>
      </defs>

      {/* Мягкая контактная тень: размытый край вместо плоского овала. */}
      <ellipse className="bot-shadow" cx="210" cy="403" rx="100" ry="15" fill={u('sh')} />

      <g className="bot-float">
        <g className="bot-pose-body">
          <g className="bot-beat-body">

            {/* ноги стоят; наклон позы берёт только торс */}
            <Leg side="l" />
            <Leg side="r" />

            {/* Всё, что выше ног, наклоняется от пояса (см. «ОПОРА НА НОГИ» в KODI_CSS). */}
            <g className="kodi-torso">

            {/* свитер: округлые плечи от ворота к рукавам — рукав растёт из плеча, а не
                торчит сбоку. Шеи нет (заказчик, 15.10.2026): верх свитера и ворот уходят
                под шлем, голова стоит прямо на вороте и при наклоне не даёт просвета. */}
            <path d="M112 240 C112 204 158 170 210 170 C262 170 308 204 308 240 C308 250 291 254 284 262 L284 272
                     C284 280 278 284 269 284 L151 284 C142 284 136 280 136 272 L136 262 C129 254 112 250 112 240 Z" fill={u('w')} />
            <path d="M112 240 C112 204 158 170 210 170 C262 170 308 204 308 240 C308 250 291 254 284 262 L284 272
                     C284 280 278 284 269 284 L151 284 C142 284 136 280 136 272 L136 262 C129 254 112 250 112 240 Z" fill={u('ws')} />
            <rect x="137" y="271" width="146" height="13" rx="6.5" fill={BOT.sweaterDk} />
            <rect x="137" y="271" width="146" height="13" rx="6.5" fill={u('rib')} />
            <rect x="176" y="170" width="68" height="16" rx="8" fill={BOT.sweaterDk} />
            <rect x="176" y="170" width="68" height="16" rx="8" fill={u('rib')} />
            <text x="210" y="234" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="17" fill="#F4F1EA" letterSpacing=".5">JUNIOR IT</text>
            <rect x="166" y="240" width="88" height="18" rx="3" fill={BOT.label} />
            <rect x="166" y="240" width="88" height="6" rx="3" fill="#fff" opacity=".14" />
            <text x="210" y="253.5" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif"
              fontWeight="800" fontSize="12" fill="#fff" letterSpacing="1">AKADEMIYA</text>

            {/* голова */}
            <g className="bot-pose-head">
              <g className="bot-beat-head">
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
              </g>
            </g>

            {/* Искры восторга со сдвигом 140 мс. */}
            <g>
              <Spark x={84} y={60} s={0.5} />
              <Spark x={338} y={40} s={0.42} d={140} />
              <Spark x={112} y={0} s={0.34} d={280} />
              <Spark x={334} y={186} s={0.3} d={420} />
              <Spark x={82} y={200} s={0.38} d={560} />
            </g>

            {/* Руки отстают от тела на 90 мс — это и читается как живое. */}
            <g className="bot-pose-arm-l"><g className="bot-beat-arm-l"><Arm side="l" /></g></g>
            <g className="bot-pose-arm-r"><g className="bot-beat-arm-r"><Arm side="r" /></g></g>

            </g>
          </g>
        </g>
      </g>
    </svg>
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
const markLang = (text, lang) => {
  const s = String(text || '');
  if (!s) return s;
  return (LANG_MARK[lang] || LANG_MARK.ru) + s;
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
  } catch (e) { /* no-op */ }
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
          {/* Полоски — только индикатор «робот говорит». Кнопкой повтора они
              больше не являются: управление озвучкой одно, в шапке. */}
          <span className={'speaker-voice' + (speaking ? ' is-on' : '')} aria-hidden="true">
            <span className="sv-bars"><i /><i /><i /><i /><i /></span>
          </span>
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
  uz: ['To‘g‘ri!', 'Barakalla!', 'Ajoyib!', 'Ofarin!'],
  ru: ['Правильно!', 'Молодец!', 'Отлично!', 'Точно!'],
  en: ['Correct!', 'Well done!', 'Nice!', 'Exactly!']
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
              {voiceTop ? <VoiceDot /> : null}
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
// КУРС HTML: кружок голоса в шапке (Stage voiceTop) — на экранах, где герою
// не хватает места. Оживает, пока звучит голос.
const VoiceDot = () => {
  const audio = useAudio();
  return (
    <span className={'speaker-voice ctl-voice' + (audio && audio.playing ? ' is-on' : '')} aria-hidden="true">
      <span className="sv-bars"><i /><i /><i /><i /><i /></span>
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
  --av: clamp(66px, min(22vw, 13dvh), 138px);
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
.stage-hero-fixed .speaker { min-height: calc(var(--av) * 1.368); }
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
  .lesson-root { --gap-stack: clamp(7px, 1.3dvh, 12px); --av: clamp(74px, min(23.4vw, 14.5dvh), 126px); }
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
    /* Те же 1.165 к рамке: сам робот прежнего размера, поле вокруг больше. */
    --av: clamp(124px, min(29vw, 19.9dvh), 275px);
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

/* КУРС HTML: голос в шапке вместо героя (Stage voiceTop) — только на телефоне:
   узкий экран или телефон лёжа. На ноутбуке Коди на месте, кружка нет.
   Герой прячется, но не размонтируется: пузырь ведёт озвучку. */
.stage-voicetop .ctl-voice { display: none; }
@media (max-width: 719px), (orientation: landscape) and (max-height: 500px) {
  .stage-voicetop .ctl-voice { display: grid; }
  .stage-voicetop .speaker-wrap { position: absolute; width: 1px; height: 1px; padding: 0; margin: 0;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .stage-voicetop .stage-content { grid-column: 1 / -1; }
}
/* КУРС HTML: невысокий ноутбук (окно 700–860 px). Крупный ярус ставит герою
   до 20dvh — на окне 720 px робот выходит ~200 px, выше реплики, и тесные
   экраны вылезают за низ. Здесь робот плавно уменьшается вместе с высотой
   окна (на 860 px размер тот же, что у крупного яруса, на 720 — ~97 px),
   а не прячется: на ноутбуке Коди всегда на месте. */
@media (min-width: 760px) and (min-height: 700px) and (max-height: 860px) {
  .lesson-root { --av: clamp(90px, min(29vw, calc(52.9dvh - 284px)), 275px); }
}
/* Пока звучит голос, вокруг кружка мягко расходится кольцо. */
.ctl-voice.is-on { animation: ctlVoiceRing 1.6s ease-out infinite; }
@keyframes ctlVoiceRing { 0% { box-shadow: 0 0 0 0 rgba(255,79,40,.32); } 100% { box-shadow: 0 0 0 10px rgba(255,79,40,0); } }
@media (prefers-reduced-motion: reduce) { .ctl-voice.is-on { animation: none; } }

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
  .lesson-root { --av: clamp(46px, 13dvh, 62px); --gap-stack: 8px; --bar-y: 5px; }
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
// ===== ТЕСТОВЫЙ УРОК · «HTML: загляни внутрь страницы — эксперимент» =========
//
// ЗАЧЕМ. Проверить, помогает ли объёмная модель документа (навык anatomy)
// ученику 11–14 лет понять, из чего состоит HTML-страница, самому выполнить
// задания и захотеть продолжить. Основа — урок 1 курса (Коди, цвета тегов,
// мини-браузер, код с цветными скобками, озвучка, подсказки), канон курса не
// тронут; урок лежит в разделе тестовых.
//
// МОДЕЛЬ. Открываемая коробка: html — внешняя коробка с крышкой; внутри два
// отделения — head (сведения о странице; в нём карточка title) и body (то,
// что видно на странице; в нём лист с текстом). Передняя стенка отделения —
// его закрывающая граница: так показан закрывающий тег. Модель показывает
// только вложенность; рядом всегда обычный мини-браузер и настоящий код.
//
// ВОСЕМЬ ЭТАПОВ: 1 «Это будет твоя страница» → 2 «Загляни внутрь» →
// 3 «Предскажи изменение» → 4 «Собери документ» → 5 «Помоги Коди
// разобраться» → 6 «Твоя лаборатория» → 7 «Теперь самостоятельно» →
// 8 «Моя первая страница».
//
// ЖУРНАЛ (log канона, строка на screenId): первая попытка, число попыток,
// глубина подсказок (hints), была ли подробная помощь (helped) и результат
// нового примера после неё (followUp). Этап 7 пишет по строке на задачу.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you». Файл собирается скриптом
// tools/anatomy/zaglyani.build.mjs; правится этот исходник и фигура
// tools/anatomy/zaglyani.figures.mjs.
// =============================================================================

const META = {
  lessonId: 'test-html-zaglyani-vnutr',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'HTML: sahifa ichiga qarang — tajriba',
    ru: 'HTML: загляни внутрь страницы — эксперимент',
    en: 'HTML: look inside a page — experiment'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    out[l] = s;
  });
  return out;
};

const SAMPLE = {
  title: L3('Mening saytim', 'Мой первый сайт', 'My first site'),
  text: L3('Salom! Bu mening sahifam.', 'Привет! Это моя страница.', 'Hello! This is my page.')
};

const UI = {
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  page: L3('Sahifa', 'Страница', 'Page'),
  model: L3('Model', 'Модель', 'Model'),
  browser: L3('Brauzer', 'Браузер', 'Browser'),
  inspector: L3('Tuzilma tekshiruvi', 'Проверка структуры', 'Structure check'),
  headInfo: L3('Sahifa haqida ma’lumot — sahifada ko‘rinmaydi', 'Сведения о странице — на странице не видны', 'Information about the page — not shown on the page'),
  reset: L3('Namunani qaytarish', 'Вернуть пример', 'Restore the example'),
  open: L3('Ichiga qarash', 'Заглянуть внутрь', 'Look inside'),
  intoHtml: L3('html ichiga', 'внутрь html', 'into html'),
  intoHead: L3('head ichiga', 'внутрь head', 'into head'),
  intoBody: L3('body ichiga', 'внутрь body', 'into body'),
  pieces: L3('Qismlar', 'Детали', 'Pieces'),
  places: L3('Qayerga?', 'Куда?', 'Where?'),
  pickPiece: L3('Avval qismni tanlang', 'Сначала выбери деталь', 'Choose a piece first'),
  hint: L3('Maslahat', 'Подсказка', 'Hint'),
  ready: L3('Sahifa tayyor', 'Страница готова', 'The page is ready'),
  saveNote: L3('U darsni tugatganingizda saqlanadi.', 'Она сохранится, когда ты завершишь урок.', 'It will be saved when you finish the lesson.'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  step: L3('Vazifa', 'Задача', 'Task'),
  again: L3('Yana bir misol', 'Ещё один пример', 'One more example'),
  piece: {
    head: '<head>…</head>',
    body: '<body>…</body>',
    title: '<title>…</title>'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплики Коди звучат; подписи (eyebrow, ask, hint1, hint2, btn …)
// печатаются. Реплики короткие: понятное действие не ждёт длинной речи.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // ── 1. ЭТО БУДЕТ ТВОЯ СТРАНИЦА ────────────────────────────────────────────
  s1: {
    eyebrow: L3('Sizning sahifangiz', 'Твоя страница', 'Your page'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men Kodiman. Mana oddiy sahifa: yorliqda nomi, sahifada salom.',
        'Привет! Я Коди. Вот простая страница: на вкладке название, на странице приветствие.',
        'Hi! I am Kodi. Here is a simple page: a name on the tab and a greeting on the page.') },
      { pose: 'curious', text: L3('O‘zingiznikini yasashni xohlaysizmi? Avval ichiga qaraymiz va nima nimaga javob berishini bilamiz.',
        'Хочешь сделать свою? Сначала заглянем внутрь и узнаем, что за что отвечает.',
        'Want to make your own? First let us look inside and find out what does what.') }
    ],
    opened: L3('Mana sahifa ichi: katta quti html, ichida head va body bo‘limlari.',
      'Вот что внутри страницы: большая коробка html, а в ней отделения head и body.',
      'This is what is inside the page: a big html box with the head and body sections in it.'),
    ask: L3('Hujjat ichiga qarang', 'Загляни внутрь документа', 'Look inside the document'),
    askDone: L3('Ichi ochildi — keyingi qadamda har bir qismni ko‘ramiz', 'Документ открыт — дальше разберём каждую часть', 'The document is open: next we explore each part')
  },

  // ── 2. ЗАГЛЯНИ ВНУТРЬ ─────────────────────────────────────────────────────
  s2: {
    eyebrow: L3('Ichiga qarang', 'Загляни внутрь', 'Look inside'),
    say: L3('Har bir qismni bosing: modelda, kodda yoki pastdagi tugmada.',
      'Нажимай на части: в модели, в коде или на кнопках внизу.',
      'Tap the parts: in the model, in the code or on the buttons below.'),
    parts: {
      html: L3('html — tashqi quti. U hujjatning barcha qismlarini birlashtiradi: ichida head va body.',
        'html — внешняя коробка. Она объединяет все части документа: внутри неё head и body.',
        'html is the outer box. It holds all parts of the document together: head and body are inside it.'),
      head: L3('head — sahifa haqidagi ma’lumot bo‘limi. Bu ma’lumot sahifaning o‘zida ko‘rinmaydi.',
        'head — отделение сведений о странице. Сами эти сведения на странице не видны.',
        'head is the section with information about the page. That information is not shown on the page itself.'),
      title: L3('title head ichida turadi. Uning matni — brauzer yorlig‘idagi nom.',
        'title лежит внутри head. Его текст — это название на вкладке браузера.',
        'title sits inside head. Its text is the name on the browser tab.'),
      body: L3('body — mazmun bo‘limi. Undagi hamma narsa sahifada ko‘rinadi.',
        'body — отделение содержимого. Всё, что лежит в нём, видно на странице.',
        'body is the content section. Everything in it shows on the page.')
    },
    done: L3('Tushunarli: html ichida head va body, title esa head ichida. Istagan qismni yana bosishingiz mumkin.',
      'Итак: внутри html — head и body, а title — внутри head. Можно нажимать части ещё раз.',
      'So: head and body are inside html, and title is inside head. You can tap the parts again.'),
    ask: L3('html, head, title va body ni oching', 'Открой html, head, title и body', 'Open html, head, title and body')
  },

  // ── 3. ПРЕДСКАЖИ ИЗМЕНЕНИЕ ────────────────────────────────────────────────
  s3: {
    eyebrow: L3('Oldindan ayting', 'Предскажи', 'Predict'),
    rounds: {
      title: { part: 'title', want: 'tab', text: L3('Kosmos', 'Космос', 'Space'), extra: L3('Futbol', 'Футбол', 'Football'),
        say: L3('Men title ichidagi matnni o‘zgartiraman. Yangi nom qayerda paydo bo‘ladi?',
          'Я изменю текст внутри title. Где появится новое название?',
          'I will change the text inside title. Where will the new name appear?') },
      body: { part: 'body', want: 'page', text: L3('Bugun men HTML o‘rganyapman', 'Сегодня я учу HTML', 'Today I am learning HTML'), extra: L3('Men futbolni yaxshi ko‘raman', 'Я люблю футбол', 'I love football'),
        say: L3('Endi body ichidagi matnni o‘zgartiraman. U qayerda paydo bo‘ladi?',
          'Теперь изменю текст внутри body. Где он появится?',
          'Now I will change the text inside body. Where will it appear?') }
    },
    okTab: L3('To‘g‘ri! title yorliqni o‘zgartirdi, sahifa o‘sha-o‘sha qoldi.', 'Верно! title изменил вкладку, а страница осталась прежней.', 'Right! title changed the tab, and the page stayed the same.'),
    okPage: L3('To‘g‘ri! body ichidagi matn sahifada paydo bo‘ldi, yorliq o‘zgarmadi.', 'Верно! Текст из body появился на странице, а вкладка не изменилась.', 'Right! The text from body appeared on the page, and the tab did not change.'),
    missTab: L3('Qarang: title dagi matn yorliqqa tushdi, sahifa o‘zgarmadi. title — yorliq nomi. Yana bir misol bilan tekshiring.',
      'Смотри: текст из title попал на вкладку, а страница не изменилась. title — это название вкладки. Проверь себя ещё на одном примере.',
      'Look: the text from title went to the tab, and the page did not change. title is the tab name. Check yourself with one more example.'),
    missPage: L3('Qarang: body dagi matn sahifada paydo bo‘ldi. body — sahifada ko‘rinadigan narsa. Yana bir misol bilan tekshiring.',
      'Смотри: текст из body появился на странице. body — это то, что видно на странице. Проверь себя ещё на одном примере.',
      'Look: the text from body appeared on the page. body is what you see on the page. Check yourself with one more example.'),
    done: L3('Endi bilasiz: title — yorliq uchun, body — sahifa uchun.', 'Теперь ты знаешь: title — для вкладки, body — для страницы.', 'Now you know: title is for the tab, body is for the page.'),
    askTitle: L3('title ichida «{t}» bo‘ladi. Yangi nom qayerda paydo bo‘ladi?', 'В title будет «{t}». Где появится новое название?', 'title will say “{t}”. Where will the new name appear?'),
    askBody: L3('body ichida «{t}» bo‘ladi. Bu matn qayerda paydo bo‘ladi?', 'В body будет «{t}». Где появится этот текст?', 'body will say “{t}”. Where will this text appear?')
  },

  // ── 4. СОБЕРИ ДОКУМЕНТ ────────────────────────────────────────────────────
  s4: {
    eyebrow: L3('Hujjatni yig‘ing', 'Собери документ', 'Build the document'),
    say: L3('Qismlar tarqalib ketdi. Qismni tanlang, keyin uning joyini tanlang. Qismni sudrab olib borish ham mumkin.',
      'Части рассыпались. Выбери деталь, потом выбери место. Деталь можно и перетащить.',
      'The parts fell apart. Choose a piece, then choose its place. You can also drag a piece.'),
    ok: {
      head: L3('head html ichida. Kodda uning ikki qatori paydo bo‘ldi.', 'head внутри html. В коде появились его строки.', 'head is inside html. Its lines appeared in the code.'),
      body: L3('body ham html ichida. Endi u head dan keyin turibdi.', 'body тоже внутри html. В коде он стоит после head.', 'body is inside html too. In the code it comes after head.'),
      title: L3('title head ichida — kodda ham, modelda ham.', 'title внутри head — и в модели, и в коде.', 'title is inside head, in the model and in the code.')
    },
    titleHtml: L3('title — sahifa haqidagi ma’lumot. U to‘g‘ridan-to‘g‘ri html ga emas, head bo‘limiga qo‘yiladi.', 'title — сведения о странице. Его кладут не прямо в html, а в отделение head.', 'title is information about the page. It goes into the head section, not straight into html.'),
    titleBody: L3('body dagi hamma narsa sahifada ko‘rinadi. title esa yorliq nomi — uning joyi head da.', 'Всё, что в body, видно на странице. А title — название вкладки, его место в head.', 'Everything in body shows on the page. title is the tab name: its place is in head.'),
    nested: L3('head va body — ikki alohida bo‘lim. Ikkalasi ham to‘g‘ridan-to‘g‘ri html ichida turadi.', 'head и body — два отдельных отделения. Оба лежат прямо внутри html.', 'head and body are two separate sections. Both sit right inside html.'),
    noPlace: L3('Bu joy hali yo‘q: avval kerakli bo‘limni qo‘ying.', 'Этого места пока нет: сначала поставь нужное отделение.', 'That place does not exist yet: place the section first.'),
    done: L3('Tuzilma yig‘ildi! Qarang: bo‘limlar qutiga qanday joylashgan bo‘lsa, kod qatorlari ham shunday joylashgan.',
      'Структура собрана! Посмотри: как отделения вложены в коробку, так и строки вложены в код.',
      'The structure is built! Look: the lines in the code are nested just like the sections in the box.'),
    ask: L3('Qismni tanlang, keyin joyini', 'Выбери деталь, потом место', 'Choose a piece, then its place'),
    askDone: L3('Yig‘ildi: model va kodni solishtiring', 'Собрано: сравни модель и код', 'Built: compare the model and the code'),
    askPlace: L3('Endi joyni tanlang', 'Теперь выбери место', 'Now choose the place')
  },

  // ── 5. ПОМОГИ КОДИ РАЗОБРАТЬСЯ ────────────────────────────────────────────
  s5: {
    eyebrow: L3('Kodiga yordam', 'Помоги Коди', 'Help Kodi'),
    say: L3('Men hujjatni shoshib yozdim va nimanidir chalkashtirdim. Tekshiruv paneli qaysi qoida bajarilmaganini ko‘rsatadi.',
      'Я собирал документ в спешке и кое-что перепутал. Панель проверки показывает, какое правило не выполнено.',
      'I built the document in a hurry and mixed something up. The check panel shows which rule is not met.'),
    rules: {
      inHtml: L3('Hamma narsa html ichida', 'Всё лежит внутри html', 'Everything is inside html'),
      titleHead: L3('title — head ichida', 'title — внутри head', 'title is inside head'),
      bodyClosed: L3('body yopilgan', 'body закрыт', 'body is closed'),
      headClosed: L3('head yopilgan', 'head закрыт', 'head is closed')
    },
    move: L3('title ni head ga o‘tkazing: title ni bosing, keyin head ni', 'Перенеси title в head: нажми title, потом head', 'Move title into head: tap title, then head'),
    moveTarget: L3('Endi title qayerga borishi kerak?', 'Теперь — куда должен попасть title?', 'Now, where should title go?'),
    moveOk: L3('title head da. Ikkinchi qoida bajarildi.', 'title в head. Второе правило выполнено.', 'title is in head. The second rule is met.'),
    moveBody: L3('title body da edi — sahifada ko‘rinadigan joyda. Uni head ga o‘tkazamiz.', 'title уже был в body, где всё видно на странице. Его место — head.', 'title was already in body, where everything shows on the page. Its place is head.'),
    moveHtml: L3('To‘g‘ridan-to‘g‘ri html ga emas: title ni head bo‘limiga qo‘yamiz.', 'Не прямо в html: title кладут в отделение head.', 'Not straight into html: title goes into the head section.'),
    pickTitle: L3('Avval title ni tanlang.', 'Сначала выбери title.', 'Choose title first.'),
    type: L3('Endi body yopilmagan: oldingi devori yo‘q. Bo‘sh qatorga body ning yopuvchi tegini yozing.',
      'Теперь видно: у body нет передней стенки — он не закрыт. Допиши закрывающий тег body в пустую строку.',
      'Now you can see that body has no front wall: it is not closed. Type the closing body tag in the empty line.'),
    typeAsk: L3('Bo‘sh qatorga body ning yopuvchi tegini yozing', 'Допиши закрывающий тег body в пустую строку', 'Type the closing body tag in the empty line'),
    typeAskHead: L3('Bo‘sh qatorga head ning yopuvchi tegini yozing', 'Допиши закрывающий тег head в пустую строку', 'Type the closing head tag in the empty line'),
    typeHead: L3('Yana bitta: bu hujjatda head yopilmagan. Yopuvchi tegini yozing.', 'Ещё один: в этом документе не закрыт head. Допиши его закрывающий тег.', 'One more: in this document head is not closed. Type its closing tag.'),
    typeOk: L3('body yopildi! Yopuvchi teg qism qayerda tugashini ko‘rsatadi.', 'body закрыт! Закрывающий тег показывает, где часть заканчивается.', 'body is closed! A closing tag shows where a part ends.'),
    typeOkHead: L3('head ham yopildi. html, head, title va body da yopuvchi teglar bor.', 'head тоже закрыт. У html, head, title и body есть закрывающие теги.', 'head is closed too. html, head, title and body all have closing tags.'),
    noSlash: L3('Bu ochuvchi teg. Yopuvchida «<» dan keyin qiya chiziq turadi.', 'Это открывающий тег. В закрывающем сразу после «<» стоит косая черта.', 'That is an opening tag. In a closing tag a slash comes right after “<”.'),
    wrongName: L3('Chiziq bor, endi teg nomi kerakli bo‘lsin: {tag}.', 'Черта есть, теперь нужно правильное имя тега: {tag}.', 'The slash is there; now the tag name must be right: {tag}.'),
    noGt: L3('Tegni «>» burchagi bilan yoping.', 'Закрой тег уголком «>».', 'Close the tag with “>”.'),
    ask: L3('Panel bo‘yicha xatoni tuzating', 'Исправь то, что показывает панель', 'Fix what the panel shows')
  },

  // ── 6. ТВОЯ ЛАБОРАТОРИЯ ───────────────────────────────────────────────────
  s6: {
    eyebrow: L3('Laboratoriya', 'Лаборатория', 'Lab'),
    say: L3('Bu yerda xohlagancha tajriba qiling. title va body ichidagi matnni o‘zgartiring.',
      'Здесь экспериментируй сколько хочешь. Меняй текст внутри title и внутри body.',
      'Experiment here as much as you like. Change the text inside title and inside body.'),
    sawTitle: L3('Yorliq o‘zgardi — buni title qildi.', 'Вкладка изменилась — это сделал title.', 'The tab changed: title did that.'),
    sawBody: L3('Sahifa o‘zgardi — buni body qildi.', 'Страница изменилась — это сделал body.', 'The page changed: body did that.'),
    done: L3('Ajoyib tajriba! Kod, model va natija bir xil o‘zgaradi.', 'Отличный эксперимент! Код, модель и результат меняются вместе.', 'Great experiment! The code, the model and the result change together.'),
    ask: L3('title va body ichidagi matnni o‘zgartiring', 'Измени текст внутри title и внутри body', 'Change the text inside title and inside body')
  },

  // ── 7. ТЕПЕРЬ САМОСТОЯТЕЛЬНО ──────────────────────────────────────────────
  s7: {
    eyebrow: L3('Mustaqil', 'Самостоятельно', 'On your own'),
    say: L3('Endi o‘zingiz. To‘rtta qisqa vazifa. Maslahat kerak bo‘lsa — chiroqchani bosing.',
      'Теперь сам. Четыре короткие задачи. Если нужна подсказка — нажми лампочку.',
      'Now on your own. Four short tasks. If you need a hint, tap the light bulb.'),
    tasks: {
      goal: {
        ask: L3('Maqsad: yorliqda «Mening mushugim» bo‘lsin. Koddagi qaysi joyni o‘zgartirasiz? Shu joyni bosing.', 'Цель: на вкладке — «Мой кот». Какое место в коде изменить? Нажми на него.', 'Goal: the tab says “My cat”. Which place in the code do you change? Tap it.'),
        askB: L3('Maqsad: sahifada «Mushugim uxlayapti» bo‘lsin. Qaysi joyni o‘zgartirasiz?', 'Цель: на странице — «Мой кот спит». Какое место изменить?', 'Goal: the page says “My cat is sleeping”. Which place do you change?'),
        hint1: L3('Yorliq nomini qaysi teg beradi?', 'Какой тег задаёт название вкладки?', 'Which tag sets the tab name?'),
        hint2: L3('title teglari orasidagi matnni bosing.', 'Нажми на текст между тегами title.', 'Tap the text between the title tags.'),
        hint1B: L3('Sahifada nima ko‘rinadi?', 'Что видно на странице?', 'What shows on the page?'),
        hint2B: L3('body ichidagi matnni bosing.', 'Нажми на текст внутри body.', 'Tap the text inside body.'),
        tag: L3('Bu teg — u qism chegarasini belgilaydi. Teg emas, matn o‘zgaradi.', 'Это тег — он отмечает границу части. Менять нужно текст, а не тег.', 'That is a tag: it marks where a part begins or ends. We change the text, not the tag.'),
        otherText: L3('Bu matn boshqa joyda ko‘rinadi. Maqsadga qarang.', 'Этот текст виден в другом месте. Посмотри на цель.', 'This text shows somewhere else. Look at the goal.'),
        ok: L3('Ha, shu joy.', 'Да, это место.', 'Yes, that place.')
      },
      where: {
        ask: L3('Yangi title kartochkasi. Uni qaysi bo‘limga qo‘yasiz?', 'Новая карточка title. В какое отделение её положить?', 'A new title card. Which section does it go in?'),
        askB: L3('Sahifa matni bo‘lgan varaq. Uni qayerga qo‘yasiz?', 'Лист с текстом страницы. Куда его положить?', 'A sheet with the page text. Where does it go?'),
        hint1: L3('title sahifada emas, yorliqda ko‘rinadi.', 'title виден не на странице, а на вкладке.', 'title shows on the tab, not on the page.'),
        hint2: L3('Sahifa haqidagi ma’lumot bo‘limi — head.', 'Отделение сведений о странице — head.', 'The section with page information is head.'),
        hint1B: L3('Bu matn sahifada ko‘rinishi kerak.', 'Этот текст должен быть виден на странице.', 'This text has to show on the page.'),
        hint2B: L3('Sahifada ko‘rinadigan hamma narsa body da.', 'Всё, что видно на странице, — в body.', 'Everything shown on the page is in body.'),
        ok: L3('To‘g‘ri bo‘lim.', 'Верное отделение.', 'The right section.')
      },
      build: {
        ask: L3('Asosiy tuzilmani tartib bilan yig‘ing: qatorlarni yuqoridan pastga bosing.', 'Собери основную структуру: нажимай строки по порядку, сверху вниз.', 'Build the main structure: tap the lines in order, from top to bottom.'),
        askB: L3('Faqat head qismini yig‘ing.', 'Собери только часть head.', 'Build just the head part.'),
        hint1: L3('Avval tashqi quti ochiladi, oxirida yopiladi.', 'Внешняя коробка открывается первой и закрывается последней.', 'The outer box opens first and closes last.'),
        hint2: L3('html ichida avval head (ochiladi va yopiladi), keyin body.', 'Внутри html сначала head (открыть и закрыть), потом body.', 'Inside html: first head (open and close), then body.'),
        ok: L3('Tuzilma to‘g‘ri.', 'Структура верная.', 'The structure is right.')
      },
      close: {
        ask: L3('body ni qaysi teg yopadi?', 'Какой тег закрывает body?', 'Which tag closes body?'),
        askB: L3('head ni qaysi teg yopadi?', 'Какой тег закрывает head?', 'Which tag closes head?'),
        hint1: L3('Yopuvchi tegda qiya chiziq bor.', 'В закрывающем теге есть косая черта.', 'A closing tag has a slash.'),
        hint2: L3('Qiya chiziq va o‘sha nom: body.', 'Косая черта и то же имя: body.', 'A slash and the same name: body.'),
        hint2B: L3('Qiya chiziq va o‘sha nom: head.', 'Косая черта и то же имя: head.', 'A slash and the same name: head.'),
        ok: L3('Ha, yopuvchi teg.', 'Да, это закрывающий тег.', 'Yes, that is the closing tag.')
      }
    },
    labels: {
      goal: L3('Maqsad bo‘yicha joy', 'Место изменения по цели', 'Place to change for a goal'),
      where: L3('title qayerda', 'Где лежит title', 'Where title lives'),
      build: L3('Asosiy tuzilma', 'Основная структура', 'Main structure'),
      close: L3('Ochuvchi va yopuvchi teg', 'Открывающий и закрывающий тег', 'Opening and closing tag')
    },
    selfNote: L3('★ — maslahatsiz', '★ — без подсказок', '★ — without hints'),
    again: L3('Yaxshi! Endi shunga o‘xshash misolni o‘zingiz bajaring.', 'Хорошо! Теперь похожий пример — сам.', 'Good! Now a similar example on your own.'),
    done: L3('To‘rttala vazifa bajarildi! Siz hujjat tuzilishini tushunasiz.', 'Все четыре задачи решены! Ты разбираешься в структуре документа.', 'All four tasks are done! You understand the document structure.'),
    ask: L3('Mustaqil vazifalar', 'Самостоятельные задачи', 'Tasks on your own')
  },

  // ── 8. МОЯ ПЕРВАЯ СТРАНИЦА ────────────────────────────────────────────────
  s8: {
    eyebrow: L3('Birinchi sahifam', 'Моя первая страница', 'My first page'),
    say: L3('Endi o‘z sahifangiz. O‘z nomingizni va matningizni yozing.', 'Теперь твоя страница. Напиши своё название и свой текст.', 'Now your own page. Write your own name and your own text.'),
    askWrite: L3('Nom va matn yozing', 'Напиши название и текст', 'Write a name and a text'),
    showTitle: L3('Kodda ko‘rsating: yorliq nomi qayerdan keldi?', 'Покажи в коде: откуда взялось название вкладки?', 'Show in the code: where did the tab name come from?'),
    showBody: L3('Sahifa matni-chi? Uni kodda ko‘rsating.', 'А текст страницы? Покажи его в коде.', 'And the page text? Show it in the code.'),
    foundTitle: L3('Siz title ni topdingiz va yorliq nomini o‘zgartirdingiz.', 'Ты нашёл title и изменил название вкладки.', 'You found title and changed the tab name.'),
    foundBody: L3('Sahifa matni body ichida — buni ham o‘zingiz yozdingiz.', 'А текст страницы лежит внутри body — его ты тоже написал сам.', 'And the page text is inside body: you wrote that yourself too.'),
    notTitle: L3('Bu yorliqqa emas. Yorliq nomi qaysi teg ichida?', 'Это не для вкладки. Внутри какого тега название вкладки?', 'That is not for the tab. Which tag holds the tab name?'),
    notBody: L3('Sahifada ko‘rinadigan matnni toping.', 'Найди текст, который виден на странице.', 'Find the text that shows on the page.'),
    bye: L3('Birinchi sahifangiz tayyor. Keyingi darsda unga sarlavha va xatboshilar qo‘shamiz!', 'Твоя первая страница готова. На следующем уроке добавим на неё заголовки и абзацы!', 'Your first page is ready. Next lesson we add headings and paragraphs to it!'),
    next: L3('Sarlavhalar va xatboshilar', 'Заголовки и абзацы', 'Headings and paragraphs'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
    ask: L3('O‘z sahifangizni yarating', 'Сделай свою страницу', 'Make your page')
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГИ ВСЛУХ — SpokenTags
// На экране тег пишется точно (title, </body>), а сервис озвучки прочёл бы
// латиницу посреди узбекской или русской фразы как попало. Поэтому перед
// отправкой в озвучку теги и знаки разметки заменяются понятными словами.
// Обёртка ставится вокруг экрана внутри Shell и подменяет только speak():
// пауза, повтор и флаги идут из канона как есть.
// ─────────────────────────────────────────────────────────────────────────────
const TAG_SAY = {
  ru: { html: 'эйч-ти-эм-эль', head: 'хэд', title: 'тайтл', body: 'бади', doctype: 'доктайп',
    close: 'закрывающий тег', lt: 'уголок', gt: 'закрывающий уголок', slash: 'косая черта' },
  uz: { html: 'eych-ti-em-el', head: 'xed', title: 'taytl', body: 'badi', doctype: 'doktayp',
    close: 'yopuvchi teg', lt: 'ochuvchi burchak', gt: 'yopuvchi burchak', slash: 'qiya chiziq' },
  en: { html: 'H T M L', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    close: 'closing tag', lt: 'less-than sign', gt: 'greater-than sign', slash: 'slash' }
};
function spokenHtml(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const word = (t) => m[String(t).toLowerCase()] || t;
  let s = String(text || '');
  s = s.replace(/<!DOCTYPE\s+html>/gi, m.doctype + ' ' + m.html);
  s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => m.close + ' ' + word(t));
  s = s.replace(/<\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => word(t));
  s = s.replace(/\b(html|HTML|head|title|body|DOCTYPE)\b/g, (w) => word(w));
  s = s.replace(/</g, ' ' + m.lt + ' ').replace(/>/g, ' ' + m.gt + ' ').replace(/\s\/\s/g, ' ' + m.slash + ' ');
  return s.replace(/\s+/g, ' ').trim();
}
// Реплики героя в данных экрана — для прогрева озвучки. spokenOf канона знает
// только ключи Курса 0 (say, why, hints …), а у реплик урока ключи свои
// (cast, praise, wrong, typeMsg …). Поэтому берём всё, кроме подписей,
// которые только печатаются, и шаблонов с подстановкой {tag}.
const PRINTED = { eyebrow: 1, ask: 1, ask2: 1, ask3: 1, askDone: 1, askFill: 1, opts: 1, words: 1,
  rounds: 1, rules: 1, skills: 1, next: 1, btn: 1, exTitle: 1, exText: 1, demo: 1, practice: 1,
  title: 1, sel: 1, icon: 1, id: 1, pose: 1, show: 1, step: 1 };
function heroLines(node, lang, out, parent) {
  const acc = out || [];
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((x) => heroLines(x, lang, acc, parent)); return acc; }
  if (node.uz !== undefined || node.ru !== undefined) {
    const s = node[lang] !== undefined ? node[lang] : node.ru;
    if (typeof s === 'string' && s.indexOf('{') < 0) acc.push(s);
    return acc;
  }
  Object.keys(node).forEach((k) => {
    if (PRINTED[k] || (k === 'text' && parent === 'steps')) return;
    heroLines(node[k], lang, acc, k);
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
// ЦВЕТА ТЕГОВ. Один тег — один цвет во всём уроке: в коде, на контейнерах, на
// вкладке и странице мини-браузера. Красного нет: он в курсе читается ошибкой.
// Тона тёмные: текст тега читается на белом с контрастом от 4.9:1.
// ─────────────────────────────────────────────────────────────────────────────
// Палитра тегов разведена с цветами-сигналами урока: оранжевый — интерфейс,
// жёлтый — подсказка, зелёный — «верно». Поэтому теги — графит, фиолетовый,
// ягодный и стальной голубой: ни один не читается как кнопка или как оценка.
// Все четыре — одной светлоты и насыщенности (OKLCH L≈0.52): ни один тег не
// темнее и не ярче соседних, контраст каждого на белом — от 5.4:1.
const TAGC = { html: '#586A83', head: '#6F57AB', title: '#9F4471', body: '#1171A0' };
const DEPTH = { html: 0, head: 1, body: 1, title: 2 };

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ ДОКУМЕНТА. Документ — список строк по id. Вложенность (отступ и
// цветные скобки слева) считается по фактическому порядку строк, а не задаётся
// руками: если строка стоит не на месте, отступ это честно показывает.
// ─────────────────────────────────────────────────────────────────────────────
const FULL_DOC = ['doctype', 'html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
const OPENS = { 'html-o': 'html', 'head-o': 'head', 'body-o': 'body' };
const CLOSES = { 'html-c': 'html', 'head-c': 'head', 'body-c': 'body' };
const LINE_TOKS = {
  doctype: () => [{ k: 'doctype', z: 'doctype' }],
  'html-o': () => [{ k: 'open', tag: 'html', z: 'html-o' }],
  'head-o': () => [{ k: 'open', tag: 'head', z: 'head-o' }],
  title: (v) => [{ k: 'open', tag: 'title', z: 'title-o' }, { k: 'text', v: v.title, z: 'title-text', slot: 'title' },
    { k: 'close', tag: 'title', z: 'title-c' }],
  'head-c': () => [{ k: 'close', tag: 'head', z: 'head-c' }],
  'body-o': () => [{ k: 'open', tag: 'body', z: 'body-o' }],
  text: (v) => [{ k: 'text', v: v.text, z: 'body-text', slot: 'text' }],
  'body-c': () => [{ k: 'close', tag: 'body', z: 'body-c' }],
  'html-c': () => [{ k: 'close', tag: 'html', z: 'html-c' }]
};

function buildLines(order, v) {
  const stack = [];
  return order.map((id, n) => {
    if (!id || !LINE_TOKS[id]) return { id: 'gap' + n, key: 'gap' + n, d: stack.length, reg: stack.slice(), toks: [], empty: true };
    let d = stack.length;
    let reg;
    if (OPENS[id]) { reg = stack.concat([OPENS[id]]); stack.push(OPENS[id]); }
    else if (CLOSES[id]) {
      const k = stack.lastIndexOf(CLOSES[id]);
      if (k >= 0) { reg = stack.slice(0, k + 1); d = k; stack.splice(k); } else reg = stack.slice();
    } else if (id === 'title') reg = stack.concat(['title']);
    else reg = stack.slice();
    if (id === 'doctype') { d = 0; reg = []; }
    return { id, key: id, d, reg, toks: LINE_TOKS[id](v || {}) };
  });
}

// Готовая разметка — для артефакта и экрана «Мой первый сайт».
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const buildHtml = (title, text) => [
  '<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(title) + '</title>', '  </head>',
  '  <body>', '    ' + escHtml(text), '  </body>', '</html>'
].join('\n');

// Осмысленный текст: хотя бы две буквы и без разметки.
const hasLetters = (s) => (String(s || '').match(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ‘’]/g) || []).length >= 2;
const hasTags = (s) => /[<>]/.test(String(s || ''));

const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГ И СТРОКИ КОДА
// ─────────────────────────────────────────────────────────────────────────────
function Tag({ tag, close, doctype, big }) {
  if (doctype) return <span className="tk-doc">{'<!DOCTYPE html>'}</span>;
  return (
    <span className={'tk-tag' + (big ? ' is-big' : '')} style={{ '--c': TAGC[tag] || T.ink2 }}>
      <span className="tk-br">{'<'}</span>
      {close ? <span className="tk-sl">/</span> : null}
      <span className="tk-nm">{tag}</span>
      <span className="tk-br">{'>'}</span>
    </span>
  );
}

// Один токен строки. zone(z, tok) → { tap, cls, disabled, led } решает экран.
function Token({ t, zone, onZone, regZone, renderText }) {
  const st = zone ? zone(t.z, t) : null;
  const inner = t.k === 'text'
    ? (renderText ? renderText(t) : <span className="tk-text">{t.v ? t.v : ' '}</span>)
    : <Tag tag={t.tag} close={t.k === 'close'} doctype={t.k === 'doctype'} />;
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

// Строки кода. Цветные скобки слева — контейнеры, в которые строка вложена;
// barsFor ограничивает, какие из них рисовать (на «Найди пару» скобка
// появляется только у найденной пары). hl — контейнер, который подсвечен.
function CodeLines({ lines, hl, barsFor, zone, onZone, regZone, renderText, lineProps, className, numbers = true }) {
  return (
    <div className={'cv' + (className ? ' ' + className : '')} translate="no">
      {lines.map((ln, i) => {
        const inHl = !hl || ln.reg.indexOf(hl) >= 0;
        const conts = ln.reg.filter((r) => r !== 'title' && (!barsFor || barsFor.indexOf(r) >= 0));
        const extra = lineProps ? (lineProps(ln, i) || {}) : {};
        const body = (
          <>
            {numbers ? <span className="cv-n mono" aria-hidden="true">{i + 1}</span> : null}
            {conts.map((r) => (
              <span key={r} aria-hidden="true"
                className={'cv-bar' + (ln.id === r + '-o' ? ' is-first' : '') + (ln.id === r + '-c' ? ' is-last' : '')}
                style={{ '--c': TAGC[r], '--lv': DEPTH[r] }} />
            ))}
            <span className="cv-code">
              {ln.empty ? (extra.empty || <span className="cv-empty" />) : ln.toks.map((t, j) => (
                <Token key={j} t={t} zone={zone} onZone={onZone} regZone={regZone} renderText={renderText} />
              ))}
            </span>
            {extra.after || null}
          </>
        );
        const cls = 'cv-line' + (hl ? (inHl ? ' is-in' : ' is-out') : '') + (extra.cls ? ' ' + extra.cls : '')
          + (ln.reg.indexOf('title') >= 0 && barsFor && barsFor.indexOf('title') >= 0 ? ' is-title-pair' : '');
        const style = { '--d': ln.d, '--hc': hl ? TAGC[hl] : 'transparent' };
        if (extra.onTap) {
          return (
            <button type="button" key={ln.key} className={cls + ' cv-tap'} style={style} disabled={!!extra.disabled}
              onClick={(e) => extra.onTap(e.currentTarget)}>
              {body}
              <Led on={!!extra.led} />
            </button>
          );
        }
        return <div key={ln.key} className={cls} style={style}>{body}</div>;
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
// МИНИ-БРАУЗЕР — главный инструмент урока. Вкладка и страница; страница
// показывает HTML без оформления — так, как его рисует браузер по умолчанию.
// hl подсвечивает часть цветом тега: html — всё окно, head — полоску вкладки и
// «сведения о странице», title — вкладку, body — страницу.
// ─────────────────────────────────────────────────────────────────────────────
function MiniBrowser({ title, page, hl, tabRef, pageRef, flashTab, flashPage, pins, info, compact, typed }) {
  const pick = usePick();
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'mb' + (hl ? ' mb-hl-' + hl : '') + (compact ? ' mb-compact' : '')}>
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
      {hl === 'head' && info ? <div className="mb-info"><Icon name="doc" size={15} />{pick(info)}</div> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОВОД — линия от места в коде к тому, что оно меняет в браузере. Рисуется
// поверх рабочей области; точки берутся из настоящих элементов, поэтому провод
// верен и в колонку (телефон), и в ряд (компьютер).
// ─────────────────────────────────────────────────────────────────────────────
function Wire({ wrapRef, from, to, color, on, nonce }) {
  const [g, setG] = useState(null);
  useLayoutEffect(() => {
    if (!on) { setG(null); return undefined; }
    let dead = false;
    const calc = () => {
      if (dead) return;
      const w = wrapRef.current, a = from(), b = to();
      if (!w || !a || !b) return;
      const W = w.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
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

// ─────────────────────────────────────────────────────────────────────────────
// РУКА-ПОДСКАЗКА. Новая механика сначала показывается движением: рука дважды
// проходит путь «нажми сюда → потом сюда» и уходит. Исчезает от первого касания
// ребёнка. На паузе стоит на месте.
// ─────────────────────────────────────────────────────────────────────────────

function InlineInput({ value, onChange, placeholder, label, max = 40, inputRef, onEnter, cls }) {
  const pick = usePick();
  return (
    <input ref={inputRef} className={'tk-input' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      size={Math.max(4, Math.min(28, String(value || '').length + 1))}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (onEnter) onEnter(); else e.currentTarget.blur(); } }} />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ФИГУРА (навык anatomy): модель документа. SVG посчитан при сборке.
// ═════════════════════════════════════════════════════════════════════════════
const FIG = {"svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg fg-doc\" viewBox=\"0 0 560 420\" role=\"img\" aria-label=\"Модель HTML-документа: коробка html, внутри два отделения — head с карточкой title и body с листом страницы.\"><path class=\"iso-halo\" d=\"M24.5 215.8L24.8 213.4L26 211L27.9 208.8L128 119.2L130.7 117.3L134 115.7L137.8 114.4L142 113.7L146.3 113.3L150.7 113.5L155 114.2L158.9 115.2L524.9 243.1L528.4 244.6L531.3 246.5L533.5 248.6L534.9 251L535.5 253.4L535.5 268.3L535.2 270.8L534 273.2L532.1 275.4L432 364.9L429.3 366.9L426 368.5L422.2 369.7L418 370.5L413.7 370.8L409.3 370.6L405 370L401.1 368.9L35.1 241L31.6 239.5L28.7 237.7L26.5 235.5L25.1 233.2L24.5 230.7Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M24.5 215.8L24.8 213.4L26 211L27.9 208.8L128 119.2L130.7 117.3L134 115.7L137.8 114.4L142 113.7L146.3 113.3L150.7 113.5L155 114.2L158.9 115.2L524.9 243.1L528.4 244.6L531.3 246.5L533.5 248.6L534.9 251L535.5 253.4L535.5 268.3L535.2 270.8L534 273.2L532.1 275.4L432 364.9L429.3 366.9L426 368.5L422.2 369.7L418 370.5L413.7 370.8L409.3 370.6L405 370L401.1 368.9L35.1 241L31.6 239.5L28.7 237.7L26.5 235.5L25.1 233.2L24.5 230.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M535.5 268.3L535.2 270.8L535.2 255.9L535.5 253.4ZM535.2 270.8L534 273.2L534 258.2L535.2 255.9ZM534 273.2L532.1 275.4L532.1 260.5L534 258.2ZM532.1 275.4L432 364.9L432 350L532.1 260.5ZM432 364.9L429.3 366.9L429.3 351.9L432 350ZM429.3 366.9L426 368.5L426 353.6L429.3 351.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M426 368.5L422.2 369.7L422.2 354.8L426 353.6ZM422.2 369.7L418 370.5L418 355.6L422.2 354.8ZM418 370.5L413.7 370.8L413.7 355.9L418 355.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M413.7 370.8L409.3 370.6L409.3 355.7L413.7 355.9ZM409.3 370.6L405 370L405 355.1L409.3 355.7ZM405 370L401.1 368.9L401.1 354L405 355.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M401.1 368.9L35.1 241L35.1 226.1L401.1 354ZM35.1 241L31.6 239.5L31.6 224.6L35.1 226.1ZM31.6 239.5L28.7 237.7L28.7 222.7L31.6 224.6ZM28.7 237.7L26.5 235.5L26.5 220.6L28.7 222.7ZM26.5 235.5L25.1 233.2L25.1 218.3L26.5 220.6ZM25.1 233.2L24.5 230.7L24.5 215.8L25.1 218.3Z\"/><path class=\"iso-top\" d=\"M524.9 243.1L528.4 244.6L531.3 246.5L533.5 248.6L534.9 251L535.5 253.4L535.2 255.9L534 258.2L532.1 260.5L432 350L429.3 351.9L426 353.6L422.2 354.8L418 355.6L413.7 355.9L409.3 355.7L405 355.1L401.1 354L35.1 226.1L31.6 224.6L28.7 222.7L26.5 220.6L25.1 218.3L24.5 215.8L24.8 213.4L26 211L27.9 208.8L128 119.2L130.7 117.3L134 115.7L137.8 114.4L142 113.7L146.3 113.3L150.7 113.5L155 114.2L158.9 115.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M535.5 253.4L535.2 255.9L534 258.2L532.1 260.5L432 350L429.3 351.9L426 353.6L422.2 354.8L418 355.6L413.7 355.9L409.3 355.7L405 355.1L401.1 354L35.1 226.1L31.6 224.6L28.7 222.7L26.5 220.6L25.1 218.3L24.5 215.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M535.5 253.4L532.5 255.6L531.5 257.7L529.7 259.7L429.8 349.1L427.4 350.9L424.5 352.3L421.1 353.4L417.4 354.1L413.6 354.4L409.7 354.2L406 353.7L402.4 352.7L36.6 224.9L33.4 223.5L30.9 221.9L28.9 220L27.7 217.9L24.5 215.8\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M535.5 260.9L535.2 263.3L534 265.7L532.1 267.9L432 357.4L429.3 359.4L426 361L422.2 362.2L418 363L413.7 363.4L409.3 363.2L405 362.5L401.1 361.4L35.1 233.6L31.6 232.1L28.7 230.2L26.5 228.1L25.1 225.7L24.5 223.3\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M24.5 215.8L24.8 213.4L26 211L27.9 208.8L128 119.2L130.7 117.3L134 115.7L137.8 114.4L142 113.7L146.3 113.3L150.7 113.5L155 114.2L158.9 115.2L524.9 243.1L528.4 244.6L531.3 246.5L533.5 248.6L534.9 251L535.5 253.4M535.5 268.3L535.2 270.8L534 273.2L532.1 275.4L432 364.9L429.3 366.9L426 368.5L422.2 369.7L418 370.5L413.7 370.8L409.3 370.6L405 370L401.1 368.9L35.1 241L31.6 239.5L28.7 237.7L26.5 235.5L25.1 233.2L24.5 230.7M535.5 253.4L535.5 268.3M24.5 215.8L24.5 230.7\"/></g><g data-part=\"case\" data-hit=\"html\" data-sel=\"html\" data-tag=\"html\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M41.4 206L42.2 203.5L44.1 201.1L134.6 120.1L137.6 118L141.4 116.5L145.8 115.6L150.5 115.3L155.1 115.8L159.4 116.9L510.2 239.4L513.8 241.1L516.5 243.2L518.2 245.7L518.6 248.3L518.6 255.7L517.8 258.3L515.9 260.7L425.4 341.7L422.4 343.8L418.6 345.3L414.2 346.2L409.5 346.5L404.9 346L400.6 344.9L49.8 222.4L46.2 220.7L43.5 218.6L41.8 216.1L41.4 213.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M518.6 255.7L517.8 258.3L517.8 250.9L518.6 248.3ZM517.8 258.3L515.9 260.7L515.9 253.3L517.8 250.9ZM515.9 260.7L425.4 341.7L425.4 334.3L515.9 253.3ZM425.4 341.7L422.4 343.8L422.4 336.3L425.4 334.3ZM422.4 343.8L418.6 345.3L418.6 337.8L422.4 336.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M418.6 345.3L414.2 346.2L414.2 338.7L418.6 337.8ZM414.2 346.2L409.5 346.5L409.5 339L414.2 338.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M409.5 346.5L404.9 346L404.9 338.6L409.5 339ZM404.9 346L400.6 344.9L400.6 337.5L404.9 338.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M400.6 344.9L49.8 222.4L49.8 214.9L400.6 337.5ZM49.8 222.4L46.2 220.7L46.2 213.3L49.8 214.9ZM46.2 220.7L43.5 218.6L43.5 211.1L46.2 213.3ZM43.5 218.6L41.8 216.1L41.8 208.7L43.5 211.1ZM41.8 216.1L41.4 213.5L41.4 206L41.8 208.7Z\"/><path class=\"iso-top\" d=\"M510.2 239.4L513.8 241.1L516.5 243.2L518.2 245.7L518.6 248.3L517.8 250.9L515.9 253.3L425.4 334.3L422.4 336.3L418.6 337.8L414.2 338.7L409.5 339L404.9 338.6L400.6 337.5L49.8 214.9L46.2 213.3L43.5 211.1L41.8 208.7L41.4 206L42.2 203.5L44.1 201.1L134.6 120.1L137.6 118L141.4 116.5L145.8 115.6L150.5 115.3L155.1 115.8L159.4 116.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M518.6 248.3L517.8 250.9L515.9 253.3L425.4 334.3L422.4 336.3L418.6 337.8L414.2 338.7L409.5 339L404.9 338.6L400.6 337.5L49.8 214.9L46.2 213.3L43.5 211.1L41.8 208.7L41.4 206\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M518.6 248.3L516.1 250.6L514.3 252.8L423.9 333.7L421.1 335.6L417.7 336.9L413.8 337.8L409.5 338L405.4 337.6L401.4 336.6L50.9 214.1L47.5 212.6L45.1 210.6L43.6 208.4L41.4 206\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M41.4 206L42.2 203.5L44.1 201.1L134.6 120.1L137.6 118L141.4 116.5L145.8 115.6L150.5 115.3L155.1 115.8L159.4 116.9L510.2 239.4L513.8 241.1L516.5 243.2L518.2 245.7L518.6 248.3M518.6 255.7L517.8 258.3L515.9 260.7L425.4 341.7L422.4 343.8L418.6 345.3L414.2 346.2L409.5 346.5L404.9 346L400.6 344.9L49.8 222.4L46.2 220.7L43.5 218.6L41.8 216.1L41.4 213.5M518.6 248.3L518.6 255.7M41.4 206L41.4 213.5\"/></g><path class=\"fg-tint\" data-tag=\"html\" d=\"M505.4 243.7L507.2 244.5L508.6 245.6L509.4 246.8L509.6 248.1L509.2 249.4L508.3 250.6L417.7 331.6L416.2 332.6L414.3 333.4L412.1 333.9L409.8 334L407.5 333.8L405.3 333.2L54.6 210.7L52.8 209.8L51.4 208.8L50.6 207.5L50.4 206.2L50.8 204.9L51.7 203.7L142.3 122.7L143.8 121.7L145.7 120.9L147.9 120.5L150.2 120.4L152.5 120.6L154.7 121.1Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M141.2 100.6L141.8 98.7L144.6 97.6L148 97.9L521.6 228.5L523.6 230.1L523.6 245L523 246.9L520.2 248L516.8 247.7L143.2 117.1L141.2 115.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M523.6 245L523 246.9L523 232L523.6 230.1ZM523 246.9L520.2 248L520.2 233.1L523 232Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M520.2 248L516.8 247.7L516.8 232.8L520.2 233.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M516.8 247.7L143.2 117.1L143.2 102.2L516.8 232.8ZM143.2 117.1L141.2 115.6L141.2 100.6L143.2 102.2Z\"/><path class=\"iso-top\" d=\"M521.6 228.5L523.6 230.1L523 232L523 232L520.2 233.1L516.8 232.8L143.2 102.2L141.2 100.6L141.8 98.7L141.8 98.7L144.6 97.6L148 97.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M523.6 230.1L523 232M523 232L520.2 233.1L516.8 232.8L143.2 102.2L141.2 100.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M523.6 230.1L523 232M523 232L520 232.6L517.2 232.3L143.8 101.8L141.2 100.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M523 232L523 232M141.2 100.6L141.8 98.7L141.8 98.7L144.6 97.6L148 97.9L521.6 228.5L523.6 230.1M523.6 245L523 246.9M523 246.9L520.2 248L516.8 247.7L143.2 117.1L141.2 115.6M523.6 230.1L523.6 245M523 232L523 246.9M523 232L523 246.9M141.2 100.6L141.2 115.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M36.4 194.4L37 192.6L141.8 98.7L144.6 97.6L148 97.9L150 99.5L150 114.4L149.4 116.3L44.6 210.1L41.8 211.2L38.4 210.9L36.4 209.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M150 114.4L149.4 116.3L149.4 101.4L150 99.5ZM149.4 116.3L44.6 210.1L44.6 195.2L149.4 101.4ZM44.6 210.1L41.8 211.2L41.8 196.3L44.6 195.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M41.8 211.2L38.4 210.9L38.4 196L41.8 196.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M38.4 210.9L36.4 209.4L36.4 194.4L38.4 196Z\"/><path class=\"iso-top\" d=\"M148 97.9L150 99.5L149.4 101.4L44.6 195.2L41.8 196.3L38.4 196L38.4 196L36.4 194.4L37 192.6L141.8 98.7L144.6 97.6L148 97.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M150 99.5L149.4 101.4L44.6 195.2L41.8 196.3L38.4 196M38.4 196L36.4 194.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M150 99.5L148.6 101.2L43.9 194.9L41.6 195.8L38.4 196M38.4 196L36.4 194.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M38.4 196L38.4 196M36.4 194.4L37 192.6L141.8 98.7L144.6 97.6L148 97.9L148 97.9L150 99.5M150 114.4L149.4 116.3L44.6 210.1L41.8 211.2L38.4 210.9M38.4 210.9L36.4 209.4M150 99.5L150 114.4M38.4 196L38.4 210.9M38.4 196L38.4 210.9M36.4 194.4L36.4 209.4\"/></g></g><g data-part=\"slots\"><path class=\"fg-slot\" data-slot=\"head\" d=\"M285.2 172.5L287.9 173.8L289.7 175.5L290.5 177.4L290.2 179.3L288.8 181.1L210.2 251.5L207.9 253L204.9 254L201.4 254.4L197.9 254.3L194.7 253.5L68.9 209.5L66.2 208.2L64.4 206.6L63.6 204.6L63.9 202.7L65.3 200.9L143.9 130.5L146.2 129L149.3 128L152.7 127.6L156.2 127.8L159.4 128.5Z\"/><path class=\"fg-slot\" data-slot=\"body\" d=\"M491.1 244.4L493.8 245.7L495.6 247.4L496.4 249.3L496.1 251.3L494.7 253.1L416.1 323.4L413.8 324.9L410.7 325.9L407.3 326.4L403.8 326.2L400.6 325.4L225.2 264.2L222.6 262.9L220.7 261.2L219.9 259.3L220.3 257.3L221.6 255.5L300.2 185.1L302.6 183.7L305.6 182.6L309 182.2L312.5 182.4L315.7 183.1Z\"/></g><g data-part=\"head\" data-hit=\"head\" data-shake=\"head\" data-sel=\"head\" data-tag=\"head\"><g data-move=\"head\"><path class=\"iso-halo fg-tray-halo\" d=\"M63.6 202.7L63.8 201.5L64.3 200.3L65.3 199.2L143.9 128.8L145.3 127.9L146.9 127.1L148.8 126.4L150.9 126.1L153.1 125.9L155.3 126L157.4 126.3L159.4 126.8L285.2 170.8L287 171.6L288.4 172.5L289.5 173.6L290.2 174.7L290.5 175.9L290.5 177.8L290.4 179L289.8 180.2L288.8 181.3L210.2 251.7L208.8 252.7L207.2 253.5L205.3 254.1L203.2 254.5L201 254.6L198.8 254.6L196.7 254.2L194.7 253.7L68.9 209.7L67.1 209L65.7 208L64.6 207L63.9 205.8L63.6 204.6Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M63.6 201.9L63.9 199.9L65.3 198.1L143.9 127.7L146.2 126.2L149.3 125.2L152.7 124.8L156.2 125L159.4 125.7L285.2 169.7L287.9 171L289.7 172.7L290.5 174.6L290.5 177.6L290.2 179.5L288.8 181.3L210.2 251.7L207.9 253.2L204.9 254.2L201.4 254.6L197.9 254.5L194.7 253.7L68.9 209.7L66.2 208.4L64.4 206.7L63.6 204.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M290.5 177.6L290.2 179.5L290.2 176.5L290.5 174.6ZM290.2 179.5L288.8 181.3L288.8 178.4L290.2 176.5ZM288.8 181.3L210.2 251.7L210.2 248.7L288.8 178.4ZM210.2 251.7L207.9 253.2L207.9 250.2L210.2 248.7ZM207.9 253.2L204.9 254.2L204.9 251.2L207.9 250.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M204.9 254.2L201.4 254.6L201.4 251.6L204.9 251.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M201.4 254.6L197.9 254.5L197.9 251.5L201.4 251.6ZM197.9 254.5L194.7 253.7L194.7 250.7L197.9 251.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M194.7 253.7L68.9 209.7L68.9 206.7L194.7 250.7ZM68.9 209.7L66.2 208.4L66.2 205.5L68.9 206.7ZM66.2 208.4L64.4 206.7L64.4 203.8L66.2 205.5ZM64.4 206.7L63.6 204.8L63.6 201.9L64.4 203.8Z\"/><path class=\"iso-top\" d=\"M285.2 169.7L287.9 171L289.7 172.7L290.5 174.6L290.2 176.5L288.8 178.4L210.2 248.7L207.9 250.2L204.9 251.2L201.4 251.6L197.9 251.5L194.7 250.7L68.9 206.7L66.2 205.5L64.4 203.8L63.6 201.9L63.9 199.9L65.3 198.1L143.9 127.7L146.2 126.2L149.3 125.2L152.7 124.8L156.2 125L159.4 125.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M290.5 174.6L290.2 176.5L288.8 178.4L210.2 248.7L207.9 250.2L204.9 251.2L201.4 251.6L197.9 251.5L194.7 250.7L68.9 206.7L66.2 205.5L64.4 203.8L63.6 201.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M290.5 174.6L289.3 176.4L288 178.1L209.5 248.4L207.3 249.8L204.5 250.7L201.4 251.1L198.2 251L195.1 250.3L69.4 206.3L66.9 205.1L65.3 203.6L63.6 201.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M63.6 201.9L63.9 199.9L65.3 198.1L143.9 127.7L146.2 126.2L149.3 125.2L152.7 124.8L156.2 125L159.4 125.7L285.2 169.7L287.9 171L289.7 172.7L290.5 174.6M290.5 177.6L290.2 179.5L288.8 181.3L210.2 251.7L207.9 253.2L204.9 254.2L201.4 254.6L197.9 254.5L194.7 253.7L68.9 209.7L66.2 208.4L64.4 206.7L63.6 204.8M290.5 174.6L290.5 177.6M63.6 201.9L63.6 204.8\"/></g><path class=\"fg-tint\" data-tag=\"head\" d=\"M282.4 172.2L284 173.1L285 174.3L285 175.6L284.2 176.8L205.6 247.1L204.1 248L202 248.6L199.7 248.6L197.6 248.1L71.8 204.2L70.1 203.3L69.2 202.1L69.1 200.9L69.9 199.7L148.5 129.3L150.1 128.4L152.2 127.9L154.4 127.8L156.6 128.3Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M147.9 94.3L148.2 93.3L148.7 92.9L150.1 92.3L151.8 92.5L292.9 141.8L293.9 142.6L293.9 176.1L293.6 177.1L293.1 177.5L291.7 178.1L290 177.9L148.9 128.6L147.9 127.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M293.9 176.1L293.6 177.1L293.6 143.5L293.9 142.6ZM293.6 177.1L293.1 177.5L293.1 144L293.6 143.5ZM293.1 177.5L291.7 178.1L291.7 144.5L293.1 144Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M291.7 178.1L290 177.9L290 144.4L291.7 144.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M290 177.9L148.9 128.6L148.9 95.1L290 144.4ZM148.9 128.6L147.9 127.8L147.9 94.3L148.9 95.1Z\"/><path class=\"iso-top\" d=\"M292.9 141.8L293.9 142.6L293.6 143.5L293.1 144L291.7 144.5L290 144.4L148.9 95.1L147.9 94.3L148.2 93.3L148.7 92.9L150.1 92.3L151.8 92.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M293.9 142.6L293.6 143.5L293.1 144L291.7 144.5L290 144.4L148.9 95.1L147.9 94.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M293.9 142.6L292.7 143.3L292.4 143.6L291.5 144L290.3 143.9L149.6 94.7L147.9 94.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M147.9 94.3L148.2 93.3L148.7 92.9L150.1 92.3L151.8 92.5L292.9 141.8L293.9 142.6M293.9 176.1L293.6 177.1L293.1 177.5L291.7 178.1L290 177.9L148.9 128.6L147.9 127.8M293.9 142.6L293.9 176.1M147.9 94.3L147.9 127.8\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M60.3 172.7L60.6 171.8L148.7 92.9L150.1 92.3L151.8 92.5L152.6 92.8L153.6 93.6L153.6 127.1L153.3 128L65.1 206.9L63.7 207.5L62 207.3L61.3 207.1L60.3 206.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M153.6 127.1L153.3 128L153.3 94.5L153.6 93.6ZM153.3 128L65.1 206.9L65.1 173.4L153.3 94.5ZM65.1 206.9L63.7 207.5L63.7 173.9L65.1 173.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M63.7 207.5L62 207.3L62 173.8L63.7 173.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M62 207.3L61.3 207.1L61.3 173.5L62 173.8ZM61.3 207.1L60.3 206.3L60.3 172.7L61.3 173.5Z\"/><path class=\"iso-top\" d=\"M152.6 92.8L153.6 93.6L153.3 94.5L65.1 173.4L63.7 173.9L62 173.8L61.3 173.5L60.3 172.7L60.6 171.8L148.7 92.9L150.1 92.3L151.8 92.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M153.6 93.6L153.3 94.5L65.1 173.4L63.7 173.9L62 173.8L61.3 173.5L60.3 172.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M153.6 93.6L152.4 94.3L64.5 173L63.5 173.5L62.4 173.3L61.9 173.1L60.3 172.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M60.3 172.7L60.6 171.8L148.7 92.9L150.1 92.3L151.8 92.5L152.6 92.8L153.6 93.6M153.6 127.1L153.3 128L65.1 206.9L63.7 207.5L62 207.3L61.3 207.1L60.3 206.3M153.6 93.6L153.6 127.1M60.3 172.7L60.3 206.3\"/></g><g data-sel=\"head\" data-tag=\"head\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M160.2 74.9L160.4 74.3L160.6 74.1L161.5 73.8L162.5 73.9L225 95.7L225.6 96.2L225.6 118.6L225.4 119.1L225.2 119.3L224.3 119.7L223.3 119.6L160.8 97.7L160.2 97.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M225.6 118.6L225.4 119.1L225.4 96.8L225.6 96.2ZM225.4 119.1L225.2 119.3L225.2 97L225.4 96.8ZM225.2 119.3L224.3 119.7L224.3 97.3L225.2 97Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M224.3 119.7L223.3 119.6L223.3 97.2L224.3 97.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M223.3 119.6L160.8 97.7L160.8 75.4L223.3 97.2ZM160.8 97.7L160.2 97.3L160.2 74.9L160.8 75.4Z\"/><path class=\"iso-top\" d=\"M225 95.7L225.6 96.2L225.4 96.8L225.2 97L224.3 97.3L223.3 97.2L160.8 75.4L160.2 74.9L160.4 74.3L160.6 74.1L161.5 73.8L162.5 73.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M160.2 74.9L160.4 74.3L160.6 74.1L161.5 73.8L162.5 73.9L225 95.7L225.6 96.2M225.6 118.6L225.4 119.1L225.2 119.3L224.3 119.7L223.3 119.6L160.8 97.7L160.2 97.3M225.6 96.2L225.6 118.6M160.2 74.9L160.2 97.3\"/></g></g><text dy=\"1.84\" data-tag=\"head\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 192.066 95.232)\" font-size=\"5.4\" text-anchor=\"middle\">&lt;head&gt;</text><g data-part=\"title-card\" data-hit=\"title\"><g data-move=\"title-card\"><g data-sel=\"title\" data-tag=\"title\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M142.3 88.4L142.5 87.8L143.5 87L144.3 86.7L145.3 86.7L261.2 127.2L261.8 127.7L261.8 185.5L261.6 186.1L260.7 186.9L259.9 187.2L258.8 187.1L142.9 146.6L142.3 146.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M261.8 185.5L261.6 186.1L261.6 128.3L261.8 127.7ZM261.6 186.1L260.7 186.9L260.7 129.1L261.6 128.3ZM260.7 186.9L259.9 187.2L259.9 129.5L260.7 129.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M259.9 187.2L258.8 187.1L258.8 129.4L259.9 129.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M258.8 187.1L142.9 146.6L142.9 88.9L258.8 129.4ZM142.9 146.6L142.3 146.2L142.3 88.4L142.9 88.9Z\"/><path class=\"iso-top\" d=\"M261.2 127.2L261.8 127.7L261.6 128.3L260.7 129.1L259.9 129.5L258.8 129.4L142.9 88.9L142.3 88.4L142.5 87.8L143.5 87L144.3 86.7L145.3 86.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M261.8 127.7L261.6 128.3L260.7 129.1L259.9 129.5L258.8 129.4L142.9 88.9L142.3 88.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M261.8 127.7L261 128.2L260.2 128.9L259.7 129.1L259.1 129L143.4 88.6L142.3 88.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M142.3 88.4L142.5 87.8L143.5 87L144.3 86.7L145.3 86.7L261.2 127.2L261.8 127.7M261.8 185.5L261.6 186.1L260.7 186.9L259.9 187.2L258.8 187.1L142.9 146.6L142.3 146.2M261.8 127.7L261.8 185.5M142.3 88.4L142.3 146.2\"/></g></g><text dy=\"1.36\" data-tag=\"title\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 147.512 98.864)\" font-size=\"4\" text-anchor=\"start\">title</text><text data-font=\"sans\" data-fit=\"54.0\" dy=\"2.18\" data-t=\"title\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 200.886 132.236)\" font-size=\"6.4\" text-anchor=\"middle\"></text></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M200.6 221.8L200.9 220.8L289 141.9L290.4 141.4L292.1 141.5L292.9 141.8L293.9 142.6L293.9 176.1L293.6 177.1L205.4 255.9L204 256.5L202.3 256.3L201.6 256.1L200.6 255.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M293.9 176.1L293.6 177.1L293.6 143.5L293.9 142.6ZM293.6 177.1L205.4 255.9L205.4 222.4L293.6 143.5ZM205.4 255.9L204 256.5L204 223L205.4 222.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M204 256.5L202.3 256.3L202.3 222.8L204 223Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M202.3 256.3L201.6 256.1L201.6 222.5L202.3 222.8ZM201.6 256.1L200.6 255.3L200.6 221.8L201.6 222.5Z\"/><path class=\"iso-top\" d=\"M292.9 141.8L293.9 142.6L293.6 143.5L205.4 222.4L204 223L202.3 222.8L201.6 222.5L200.6 221.8L200.9 220.8L289 141.9L290.4 141.4L292.1 141.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M293.9 142.6L293.6 143.5L205.4 222.4L204 223L202.3 222.8L201.6 222.5L200.6 221.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M293.9 142.6L292.7 143.3L204.8 222.1L203.8 222.5L202.6 222.3L202.2 222.2L200.6 221.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M200.6 221.8L200.9 220.8L289 141.9L290.4 141.4L292.1 141.5L292.9 141.8L293.9 142.6M293.9 176.1L293.6 177.1L205.4 255.9L204 256.5L202.3 256.3L201.6 256.1L200.6 255.3M293.9 142.6L293.9 176.1M200.6 221.8L200.6 255.3\"/></g><g data-part=\"head-close\" data-sel=\"head-close\" data-tag=\"head\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M60.3 172.7L60.6 171.8L61 171.4L62.4 170.8L64.1 171L205.2 220.2L206.2 221L206.2 254.6L205.9 255.5L205.4 255.9L204 256.5L202.3 256.3L61.3 207.1L60.3 206.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M206.2 254.6L205.9 255.5L205.9 222L206.2 221ZM205.9 255.5L205.4 255.9L205.4 222.4L205.9 222ZM205.4 255.9L204 256.5L204 223L205.4 222.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M204 256.5L202.3 256.3L202.3 222.8L204 223Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M202.3 256.3L61.3 207.1L61.3 173.5L202.3 222.8ZM61.3 207.1L60.3 206.3L60.3 172.7L61.3 173.5Z\"/><path class=\"iso-top\" d=\"M205.2 220.2L206.2 221L205.9 222L205.4 222.4L204 223L202.3 222.8L61.3 173.5L60.3 172.7L60.6 171.8L61 171.4L62.4 170.8L64.1 171Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M206.2 221L205.9 222L205.4 222.4L204 223L202.3 222.8L61.3 173.5L60.3 172.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M206.2 221L205.1 221.8L204.8 222.1L203.8 222.5L202.6 222.3L61.9 173.1L60.3 172.7\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M60.3 172.7L60.6 171.8L61 171.4L62.4 170.8L64.1 171L205.2 220.2L206.2 221M206.2 254.6L205.9 255.5L205.4 255.9L204 256.5L202.3 256.3L61.3 207.1L60.3 206.3M206.2 221L206.2 254.6M60.3 172.7L60.3 206.3\"/></g></g></g></g><g data-part=\"body\" data-hit=\"body\" data-shake=\"body\" data-sel=\"body\" data-tag=\"body\"><g data-move=\"body\"><path class=\"iso-halo fg-tray-halo\" d=\"M219.9 257.3L220.1 256.1L220.7 254.9L221.6 253.8L300.2 183.5L301.6 182.5L303.3 181.7L305.2 181.1L307.2 180.7L309.4 180.5L311.6 180.6L313.8 180.9L315.7 181.5L491.1 242.7L492.9 243.5L494.3 244.4L495.4 245.5L496.1 246.7L496.4 247.9L496.4 249.7L496.2 251L495.7 252.2L494.7 253.3L416.1 323.6L414.7 324.6L413.1 325.4L411.2 326L409.1 326.4L406.9 326.6L404.7 326.5L402.6 326.2L400.6 325.6L225.2 264.3L223.5 263.6L222 262.7L220.9 261.6L220.2 260.4L219.9 259.2Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M219.9 256.5L220.3 254.5L221.6 252.7L300.2 182.3L302.6 180.9L305.6 179.9L309 179.4L312.5 179.6L315.7 180.3L491.1 241.6L493.8 242.9L495.6 244.6L496.4 246.5L496.4 249.5L496.1 251.5L494.7 253.3L416.1 323.6L413.8 325.1L410.7 326.1L407.3 326.6L403.8 326.4L400.6 325.6L225.2 264.3L222.6 263.1L220.7 261.4L219.9 259.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M496.4 249.5L496.1 251.5L496.1 248.5L496.4 246.5ZM496.1 251.5L494.7 253.3L494.7 250.3L496.1 248.5ZM494.7 253.3L416.1 323.6L416.1 320.6L494.7 250.3ZM416.1 323.6L413.8 325.1L413.8 322.1L416.1 320.6ZM413.8 325.1L410.7 326.1L410.7 323.1L413.8 322.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M410.7 326.1L407.3 326.6L407.3 323.6L410.7 323.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M407.3 326.6L403.8 326.4L403.8 323.4L407.3 323.6ZM403.8 326.4L400.6 325.6L400.6 322.6L403.8 323.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M400.6 325.6L225.2 264.3L225.2 261.4L400.6 322.6ZM225.2 264.3L222.6 263.1L222.6 260.1L225.2 261.4ZM222.6 263.1L220.7 261.4L220.7 258.4L222.6 260.1ZM220.7 261.4L219.9 259.5L219.9 256.5L220.7 258.4Z\"/><path class=\"iso-top\" d=\"M491.1 241.6L493.8 242.9L495.6 244.6L496.4 246.5L496.1 248.5L494.7 250.3L416.1 320.6L413.8 322.1L410.7 323.1L407.3 323.6L403.8 323.4L400.6 322.6L225.2 261.4L222.6 260.1L220.7 258.4L219.9 256.5L220.3 254.5L221.6 252.7L300.2 182.3L302.6 180.9L305.6 179.9L309 179.4L312.5 179.6L315.7 180.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M496.4 246.5L496.1 248.5L494.7 250.3L416.1 320.6L413.8 322.1L410.7 323.1L407.3 323.6L403.8 323.4L400.6 322.6L225.2 261.4L222.6 260.1L220.7 258.4L219.9 256.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M496.4 246.5L495.2 248.4L493.9 250.1L415.3 320.3L413.2 321.7L410.4 322.7L407.3 323.1L404 322.9L401 322.2L225.7 261L223.2 259.7L221.6 258.2L219.9 256.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M219.9 256.5L220.3 254.5L221.6 252.7L300.2 182.3L302.6 180.9L305.6 179.9L309 179.4L312.5 179.6L315.7 180.3L491.1 241.6L493.8 242.9L495.6 244.6L496.4 246.5M496.4 249.5L496.1 251.5L494.7 253.3L416.1 323.6L413.8 325.1L410.7 326.1L407.3 326.6L403.8 326.4L400.6 325.6L225.2 264.3L222.6 263.1L220.7 261.4L219.9 259.5M496.4 246.5L496.4 249.5M219.9 256.5L219.9 259.5\"/></g><path class=\"fg-tint\" data-tag=\"body\" d=\"M488.2 244.2L489.9 245.1L490.8 246.2L490.9 247.5L490.1 248.7L411.5 319L409.9 320L407.8 320.5L405.6 320.5L403.4 320.1L228.1 258.8L226.4 257.9L225.5 256.8L225.4 255.5L226.2 254.3L304.8 183.9L306.4 183L308.5 182.5L310.7 182.5L312.9 182.9Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M304.2 148.9L304.5 147.9L305 147.5L306.4 147L308.1 147.1L498.7 213.7L499.7 214.5L499.7 248.1L499.4 249L499 249.4L497.6 250L495.9 249.8L305.2 183.2L304.2 182.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M499.7 248.1L499.4 249L499.4 215.5L499.7 214.5ZM499.4 249L499 249.4L499 215.9L499.4 215.5ZM499 249.4L497.6 250L497.6 216.4L499 215.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M497.6 250L495.9 249.8L495.9 216.3L497.6 216.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M495.9 249.8L305.2 183.2L305.2 149.7L495.9 216.3ZM305.2 183.2L304.2 182.4L304.2 148.9L305.2 149.7Z\"/><path class=\"iso-top\" d=\"M498.7 213.7L499.7 214.5L499.4 215.5L499 215.9L497.6 216.4L495.9 216.3L305.2 149.7L304.2 148.9L304.5 147.9L305 147.5L306.4 147L308.1 147.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M499.7 214.5L499.4 215.5L499 215.9L497.6 216.4L495.9 216.3L305.2 149.7L304.2 148.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M499.7 214.5L498.6 215.3L498.3 215.5L497.4 216L496.2 215.8L305.9 149.3L304.2 148.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M304.2 148.9L304.5 147.9L305 147.5L306.4 147L308.1 147.1L498.7 213.7L499.7 214.5M499.7 248.1L499.4 249L499 249.4L497.6 250L495.9 249.8L305.2 183.2L304.2 182.4M499.7 214.5L499.7 248.1M304.2 148.9L304.2 182.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M216.6 227.4L216.9 226.4L305 147.5L306.4 147L308.1 147.1L308.9 147.4L309.9 148.2L309.9 181.7L309.6 182.7L221.4 261.5L220 262.1L218.3 261.9L217.6 261.7L216.6 260.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M309.9 181.7L309.6 182.7L309.6 149.1L309.9 148.2ZM309.6 182.7L221.4 261.5L221.4 228L309.6 149.1ZM221.4 261.5L220 262.1L220 228.6L221.4 228Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M220 262.1L218.3 261.9L218.3 228.4L220 228.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M218.3 261.9L217.6 261.7L217.6 228.1L218.3 228.4ZM217.6 261.7L216.6 260.9L216.6 227.4L217.6 228.1Z\"/><path class=\"iso-top\" d=\"M308.9 147.4L309.9 148.2L309.6 149.1L221.4 228L220 228.6L218.3 228.4L217.6 228.1L216.6 227.4L216.9 226.4L305 147.5L306.4 147L308.1 147.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M309.9 148.2L309.6 149.1L221.4 228L220 228.6L218.3 228.4L217.6 228.1L216.6 227.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M309.9 148.2L308.7 148.9L220.8 227.7L219.8 228.1L218.7 227.9L218.2 227.8L216.6 227.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M216.6 227.4L216.9 226.4L305 147.5L306.4 147L308.1 147.1L308.9 147.4L309.9 148.2M309.9 181.7L309.6 182.7L221.4 261.5L220 262.1L218.3 261.9L217.6 261.7L216.6 260.9M309.9 148.2L309.9 181.7M216.6 227.4L216.6 260.9\"/></g><g data-sel=\"body\" data-tag=\"body\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M316.5 129.5L316.7 128.9L316.9 128.7L317.8 128.4L318.8 128.5L381.3 150.3L381.9 150.8L381.9 173.2L381.7 173.7L381.5 174L380.7 174.3L379.6 174.2L317.1 152.3L316.5 151.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M381.9 173.2L381.7 173.7L381.7 151.4L381.9 150.8ZM381.7 173.7L381.5 174L381.5 151.6L381.7 151.4ZM381.5 174L380.7 174.3L380.7 151.9L381.5 151.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M380.7 174.3L379.6 174.2L379.6 151.8L380.7 151.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M379.6 174.2L317.1 152.3L317.1 130L379.6 151.8ZM317.1 152.3L316.5 151.9L316.5 129.5L317.1 130Z\"/><path class=\"iso-top\" d=\"M381.3 150.3L381.9 150.8L381.7 151.4L381.5 151.6L380.7 151.9L379.6 151.8L317.1 130L316.5 129.5L316.7 128.9L316.9 128.7L317.8 128.4L318.8 128.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M316.5 129.5L316.7 128.9L316.9 128.7L317.8 128.4L318.8 128.5L381.3 150.3L381.9 150.8M381.9 173.2L381.7 173.7L381.5 174L380.7 174.3L379.6 174.2L317.1 152.3L316.5 151.9M381.9 150.8L381.9 173.2M316.5 129.5L316.5 151.9\"/></g></g><text dy=\"1.84\" data-tag=\"body\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 348.377 149.851)\" font-size=\"5.4\" text-anchor=\"middle\">&lt;body&gt;</text><g data-part=\"page-card\" data-hit=\"page\"><g data-move=\"page-card\"><g data-sel=\"page\" data-tag=\"body\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M298.6 139.3L298.8 138.7L299.8 137.9L300.6 137.5L301.6 137.6L467.1 195.5L467.7 195.9L467.7 257.4L467.5 258L466.6 258.8L465.7 259.2L464.7 259.1L299.2 201.3L298.6 200.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M467.7 257.4L467.5 258L467.5 196.5L467.7 195.9ZM467.5 258L466.6 258.8L466.6 197.3L467.5 196.5ZM466.6 258.8L465.7 259.2L465.7 197.7L466.6 197.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M465.7 259.2L464.7 259.1L464.7 197.6L465.7 197.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M464.7 259.1L299.2 201.3L299.2 139.8L464.7 197.6ZM299.2 201.3L298.6 200.8L298.6 139.3L299.2 139.8Z\"/><path class=\"iso-top\" d=\"M467.1 195.5L467.7 195.9L467.5 196.5L466.6 197.3L465.7 197.7L464.7 197.6L299.2 139.8L298.6 139.3L298.8 138.7L299.8 137.9L300.6 137.5L301.6 137.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M467.7 195.9L467.5 196.5L466.6 197.3L465.7 197.7L464.7 197.6L299.2 139.8L298.6 139.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M467.7 195.9L466.9 196.4L466.1 197.1L465.6 197.3L464.9 197.2L299.7 139.5L298.6 139.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M298.6 139.3L298.8 138.7L299.8 137.9L300.6 137.5L301.6 137.6L467.1 195.5L467.7 195.9M467.7 257.4L467.5 258L466.6 258.8L465.7 259.2L464.7 259.1L299.2 201.3L298.6 200.8M467.7 195.9L467.7 257.4M298.6 139.3L298.6 200.8\"/></g></g><text dy=\"1.36\" data-tag=\"body\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 303.823 149.756)\" font-size=\"4\" text-anchor=\"start\"></text><text data-font=\"sans\" data-fit=\"80.0\" dy=\"1.97\" data-t=\"page1\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 381.978 188.358)\" font-size=\"5.8\" text-anchor=\"middle\"></text><text data-font=\"sans\" data-fit=\"80.0\" dy=\"1.97\" data-t=\"page2\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 381.978 201.887)\" font-size=\"5.8\" text-anchor=\"middle\"></text></g></g><g data-part=\"title-stray\" data-hit=\"title\"><g data-move=\"title-stray\"><g data-sel=\"title\" data-tag=\"title\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M282.5 188.2L282.6 187.6L283.6 186.8L284.4 186.4L285.4 186.5L416.6 232.4L417.2 232.8L417.2 281.3L417 281.8L416.1 282.7L415.2 283L414.2 282.9L283.1 237.1L282.5 236.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M417.2 281.3L417 281.8L417 233.4L417.2 232.8ZM417 281.8L416.1 282.7L416.1 234.2L417 233.4ZM416.1 282.7L415.2 283L415.2 234.6L416.1 234.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M415.2 283L414.2 282.9L414.2 234.5L415.2 234.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M414.2 282.9L283.1 237.1L283.1 188.7L414.2 234.5ZM283.1 237.1L282.5 236.6L282.5 188.2L283.1 188.7Z\"/><path class=\"iso-top\" d=\"M416.6 232.4L417.2 232.8L417 233.4L416.1 234.2L415.2 234.6L414.2 234.5L283.1 188.7L282.5 188.2L282.6 187.6L283.6 186.8L284.4 186.4L285.4 186.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M417.2 232.8L417 233.4L416.1 234.2L415.2 234.6L414.2 234.5L283.1 188.7L282.5 188.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M417.2 232.8L416.4 233.3L415.6 234L415.1 234.2L414.4 234.1L283.5 188.4L282.5 188.2\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M282.5 188.2L282.6 187.6L283.6 186.8L284.4 186.4L285.4 186.5L416.6 232.4L417.2 232.8M417.2 281.3L417 281.8L416.1 282.7L415.2 283L414.2 282.9L283.1 237.1L282.5 236.6M417.2 232.8L417.2 281.3M282.5 188.2L282.5 236.6\"/></g></g><text dy=\"1.36\" data-tag=\"title\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 287.627 198.641)\" font-size=\"4\" text-anchor=\"start\">title</text><text data-font=\"sans\" data-fit=\"62.0\" dy=\"2.18\" data-t=\"title\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 348.626 230.951)\" font-size=\"6.4\" text-anchor=\"middle\"></text></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M406.4 293.7L406.7 292.7L494.9 213.9L496.3 213.3L498 213.5L498.7 213.7L499.7 214.5L499.7 248.1L499.4 249L411.3 327.9L409.9 328.4L408.2 328.3L407.4 328L406.4 327.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M499.7 248.1L499.4 249L499.4 215.5L499.7 214.5ZM499.4 249L411.3 327.9L411.3 294.3L499.4 215.5ZM411.3 327.9L409.9 328.4L409.9 294.9L411.3 294.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M409.9 328.4L408.2 328.3L408.2 294.7L409.9 294.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M408.2 328.3L407.4 328L407.4 294.5L408.2 294.7ZM407.4 328L406.4 327.2L406.4 293.7L407.4 294.5Z\"/><path class=\"iso-top\" d=\"M498.7 213.7L499.7 214.5L499.4 215.5L411.3 294.3L409.9 294.9L408.2 294.7L407.4 294.5L406.4 293.7L406.7 292.7L494.9 213.9L496.3 213.3L498 213.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M499.7 214.5L499.4 215.5L411.3 294.3L409.9 294.9L408.2 294.7L407.4 294.5L406.4 293.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M499.7 214.5L498.6 215.3L410.6 294L409.7 294.4L408.5 294.3L408.1 294.1L406.4 293.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M406.4 293.7L406.7 292.7L494.9 213.9L496.3 213.3L498 213.5L498.7 213.7L499.7 214.5M499.7 248.1L499.4 249L411.3 327.9L409.9 328.4L408.2 328.3L407.4 328L406.4 327.2M499.7 214.5L499.7 248.1M406.4 293.7L406.4 327.2\"/></g><g data-part=\"body-close\" data-sel=\"body-close\" data-tag=\"body\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M216.6 227.4L216.9 226.4L217.3 226L218.7 225.4L220.4 225.6L411.1 292.2L412.1 293L412.1 326.5L411.8 327.5L411.3 327.9L409.9 328.4L408.2 328.3L217.6 261.7L216.6 260.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M412.1 326.5L411.8 327.5L411.8 293.9L412.1 293ZM411.8 327.5L411.3 327.9L411.3 294.3L411.8 293.9ZM411.3 327.9L409.9 328.4L409.9 294.9L411.3 294.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M409.9 328.4L408.2 328.3L408.2 294.7L409.9 294.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M408.2 328.3L217.6 261.7L217.6 228.1L408.2 294.7ZM217.6 261.7L216.6 260.9L216.6 227.4L217.6 228.1Z\"/><path class=\"iso-top\" d=\"M411.1 292.2L412.1 293L411.8 293.9L411.3 294.3L409.9 294.9L408.2 294.7L217.6 228.1L216.6 227.4L216.9 226.4L217.3 226L218.7 225.4L220.4 225.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M412.1 293L411.8 293.9L411.3 294.3L409.9 294.9L408.2 294.7L217.6 228.1L216.6 227.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M412.1 293L410.9 293.7L410.6 294L409.7 294.4L408.5 294.3L218.2 227.8L216.6 227.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M216.6 227.4L216.9 226.4L217.3 226L218.7 225.4L220.4 225.6L411.1 292.2L412.1 293M412.1 326.5L411.8 327.5L411.3 327.9L409.9 328.4L408.2 328.3L217.6 261.7L216.6 260.9M412.1 293L412.1 326.5M216.6 227.4L216.6 260.9\"/></g></g></g></g><g data-part=\"case-near\" data-hit=\"html\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M410 325L410.6 323.1L515.4 229.3L518.2 228.2L521.6 228.5L523.6 230.1L523.6 245L523 246.9L418.2 340.7L415.4 341.8L412 341.5L410 339.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M523.6 245L523 246.9L523 232L523.6 230.1ZM523 246.9L418.2 340.7L418.2 325.8L523 232ZM418.2 340.7L415.4 341.8L415.4 326.9L418.2 325.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M415.4 341.8L412 341.5L412 326.6L415.4 326.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M412 341.5L410 339.9L410 325L412 326.6Z\"/><path class=\"iso-top\" d=\"M521.6 228.5L523.6 230.1L523 232L418.2 325.8L415.4 326.9L412 326.6L412 326.6L410 325L410.6 323.1L515.4 229.3L518.2 228.2L521.6 228.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M523.6 230.1L523 232L418.2 325.8L415.4 326.9L412 326.6M412 326.6L410 325\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M523.6 230.1L522.2 231.8L417.6 325.4L415.2 326.4L412 326.6M412 326.6L410 325\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M412 326.6L412 326.6M410 325L410.6 323.1L515.4 229.3L518.2 228.2L521.6 228.5L521.6 228.5L523.6 230.1M523.6 245L523 246.9L418.2 340.7L415.4 341.8L412 341.5M412 341.5L410 339.9M523.6 230.1L523.6 245M412 326.6L412 341.5M412 326.6L412 341.5M410 325L410 339.9\"/></g></g><g data-part=\"html-close\" data-hit=\"html\" data-sel=\"html-close\" data-tag=\"html\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M36.4 194.4L37 192.6L39.8 191.4L43.2 191.8L416.8 322.3L418.8 323.9L418.8 338.8L418.2 340.7L415.4 341.8L412 341.5L38.4 210.9L36.4 209.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M418.8 338.8L418.2 340.7L418.2 325.8L418.8 323.9ZM418.2 340.7L415.4 341.8L415.4 326.9L418.2 325.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M415.4 341.8L412 341.5L412 326.6L415.4 326.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M412 341.5L38.4 210.9L38.4 196L412 326.6ZM38.4 210.9L36.4 209.4L36.4 194.4L38.4 196Z\"/><path class=\"iso-top\" d=\"M416.8 322.3L418.8 323.9L418.2 325.8L418.2 325.8L415.4 326.9L412 326.6L38.4 196L36.4 194.4L37 192.6L37 192.6L39.8 191.4L43.2 191.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M418.8 323.9L418.2 325.8M418.2 325.8L415.4 326.9L412 326.6L38.4 196L36.4 194.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M418.8 323.9L418.2 325.8M418.2 325.8L415.2 326.3L412.4 326L39.2 195.6L36.4 194.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M418.2 325.8L418.2 325.8M36.4 194.4L37 192.6L37 192.6L39.8 191.4L43.2 191.8L416.8 322.3L418.8 323.9M418.8 338.8L418.2 340.7M418.2 340.7L415.4 341.8L412 341.5L38.4 210.9L36.4 209.4M418.8 323.9L418.8 338.8M418.2 325.8L418.2 340.7M418.2 325.8L418.2 340.7M36.4 194.4L36.4 209.4\"/></g><g data-sel=\"html\" data-tag=\"html\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M53.1 200.1L53.2 199.7L53.7 199.5L54.4 199.6L129.1 225.7L129.5 226L129.5 242L129.4 242.4L128.9 242.6L128.2 242.6L53.5 216.4L53.1 216.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M129.5 242L129.4 242.4L129.4 226.4L129.5 226ZM129.4 242.4L128.9 242.6L128.9 226.6L129.4 226.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M128.9 242.6L128.2 242.6L128.2 226.5L128.9 226.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M128.2 242.6L53.5 216.4L53.5 200.4L128.2 226.5ZM53.5 216.4L53.1 216.1L53.1 200.1L53.5 200.4Z\"/><path class=\"iso-top\" d=\"M129.1 225.7L129.5 226L129.4 226.4L129.4 226.4L128.9 226.6L128.2 226.5L53.5 200.4L53.1 200.1L53.2 199.7L53.2 199.7L53.7 199.5L54.4 199.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M129.4 226.4L129.4 226.4M53.1 200.1L53.2 199.7L53.2 199.7L53.7 199.5L54.4 199.6L129.1 225.7L129.5 226M129.5 242L129.4 242.4M129.4 242.4L128.9 242.6L128.2 242.6L53.5 216.4L53.1 216.1M129.5 226L129.5 242M129.4 226.4L129.4 242.4M129.4 226.4L129.4 242.4M53.1 200.1L53.1 216.1\"/></g></g><text dy=\"1.90\" data-tag=\"html\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 0 1.863 90.818 221.482)\" font-size=\"5.6\" text-anchor=\"middle\">&lt;html&gt;</text></g><g data-part=\"lid\" data-hit=\"lid\"><g data-move=\"lid\"><path class=\"iso-halo fg-lid-halo\" d=\"M41.4 189.9L41.6 188L42.5 186.1L44.1 184.3L134.6 103.3L136.8 101.7L139.4 100.4L142.5 99.4L145.8 98.8L149.3 98.6L152.9 98.7L156.3 99.2L159.4 100.1L510.2 222.6L513 223.8L515.3 225.3L517 227L518.2 228.9L518.6 230.9L518.6 232.7L518.4 234.7L517.5 236.6L515.9 238.4L425.4 319.4L423.2 320.9L420.6 322.2L417.5 323.2L414.2 323.8L410.7 324.1L407.1 324L403.7 323.4L400.6 322.6L49.8 200L47 198.8L44.7 197.3L43 195.6L41.8 193.7L41.4 191.8Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M39.1 150.1L40 147.2L42.2 144.5L132.7 63.5L136.1 61.2L140.4 59.5L145.3 58.5L150.6 58.2L155.8 58.7L160.6 59.9L511.4 182.4L515.4 184.3L518.5 186.7L520.3 189.5L520.9 192.4L520.9 233.4L520 236.3L517.8 239L427.3 320L423.9 322.3L419.6 324L414.7 325.1L409.4 325.3L404.2 324.9L399.4 323.6L48.6 201.1L44.6 199.2L41.5 196.8L39.7 194L39.1 191.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M520.9 233.4L520 236.3L520 195.3L520.9 192.4ZM520 236.3L517.8 239L517.8 198L520 195.3ZM517.8 239L427.3 320L427.3 279L517.8 198ZM427.3 320L423.9 322.3L423.9 281.3L427.3 279ZM423.9 322.3L419.6 324L419.6 283L423.9 281.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M419.6 324L414.7 325.1L414.7 284.1L419.6 283ZM414.7 325.1L409.4 325.3L409.4 284.4L414.7 284.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M409.4 325.3L404.2 324.9L404.2 283.9L409.4 284.4ZM404.2 324.9L399.4 323.6L399.4 282.6L404.2 283.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M399.4 323.6L48.6 201.1L48.6 160.1L399.4 282.6ZM48.6 201.1L44.6 199.2L44.6 158.2L48.6 160.1ZM44.6 199.2L41.5 196.8L41.5 155.8L44.6 158.2ZM41.5 196.8L39.7 194L39.7 153L41.5 155.8ZM39.7 194L39.1 191.1L39.1 150.1L39.7 153Z\"/><path class=\"iso-top\" d=\"M511.4 182.4L515.4 184.3L518.5 186.7L520.3 189.5L520.9 192.4L520 195.3L517.8 198L427.3 279L423.9 281.3L419.6 283L414.7 284.1L409.4 284.4L404.2 283.9L399.4 282.6L48.6 160.1L44.6 158.2L41.5 155.8L39.7 153L39.1 150.1L40 147.2L42.2 144.5L132.7 63.5L136.1 61.2L140.4 59.5L145.3 58.5L150.6 58.2L155.8 58.7L160.6 59.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M520.9 192.4L520 195.3L517.8 198L427.3 279L423.9 281.3L419.6 283L414.7 284.1L409.4 284.4L404.2 283.9L399.4 282.6L48.6 160.1L44.6 158.2L41.5 155.8L39.7 153L39.1 150.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M520.9 192.4L517 194.8L515 197.2L424.7 278L421.8 280L418.1 281.5L414 282.4L409.5 282.6L405.1 282.2L400.9 281.1L50.5 158.7L46.9 157L44.3 155L42.7 152.6L39.1 150.1\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M520.9 226L520 228.9L517.8 231.6L427.3 312.6L423.9 314.9L419.6 316.6L414.7 317.6L409.4 317.9L404.2 317.4L399.4 316.2L48.6 193.6L44.6 191.7L41.5 189.3L39.7 186.6L39.1 183.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M39.1 150.1L40 147.2L42.2 144.5L132.7 63.5L136.1 61.2L140.4 59.5L145.3 58.5L150.6 58.2L155.8 58.7L160.6 59.9L511.4 182.4L515.4 184.3L518.5 186.7L520.3 189.5L520.9 192.4M520.9 233.4L520 236.3L517.8 239L427.3 320L423.9 322.3L419.6 324L414.7 325.1L409.4 325.3L404.2 324.9L399.4 323.6L48.6 201.1L44.6 199.2L41.5 196.8L39.7 194L39.1 191.1M520.9 192.4L520.9 233.4M39.1 150.1L39.1 191.1\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M500.6 192L410.1 273L59.4 150.5L149.9 69.5Z\"/><text dy=\"5.44\" data-tag=\"html\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 -1.191 1.066 280 171.261)\" font-size=\"16\" text-anchor=\"middle\">&lt;html&gt;</text><text dy=\"2.04\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.906 0.666 -1.191 1.066 258.559 190.448)\" font-size=\"6\" text-anchor=\"middle\">index.html</text></g></g></svg>","ar":1.3333,"axes":{"lid":[0,-1.8635],"head":[0,-1.8635],"body":[0,-1.8635],"title-card":[0,-1.8635],"title-stray":[0,-1.8635],"page-card":[0,-1.8635]},"open":{"lid":70,"drop":34}};

const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const tagWord = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const useShake = () => {
  const [shake, setShake] = useState(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const wobble = useCallback((k) => { setShake(k); setTimeout(() => { if (alive.current) setShake(null); }, 420); }, []);
  return [shake, wobble, alive];
};
function useRec(id) {
  const store = useStore();
  const [rec, setRec] = useState(() => store.get(id) || null);
  const put = useCallback((v) => { store.set(id, v); setRec(v); }, [id, store]);
  return [rec, put, store];
}
function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const lab = store.get('lab');
  if (!lab) return null;
  return { type: 'html-page', title: lab.title, text: lab.text, html: buildHtml(lab.title, lab.text) };
}
// Текст листа body — в две строки (на модели лист узкий).
function twoLines(s) {
  const w = String(s || '').trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return [w.join(' '), ''];
  let best = 1, diff = 1e9;
  for (let i = 1; i < w.length; i += 1) {
    const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
    if (d < diff) { diff = d; best = i; }
  }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}
const docTexts = (title, text) => { const [a, b] = twoLines(text); return { title, page1: a, page2: b }; };

// Фигура. Экран задаёт состояние, фигура только рисует:
//   texts · parts { ключ: on|ghost|off } · lit [ключи] · move { ключ: величина } ·
//   led [ключи] · shake { k, n } · onPick(ключ) · pickable [ключи].
function Fig({ texts, parts, lit, move, led, shake, onPick, pickable, cls, label }) {
  const F = FIG;
  const pick = usePick();
  const ref = useRef(null);
  const html = useMemo(() => ({ __html: F.svg }), [F]);
  const pos = useRef(null);
  const want = useRef(move || {});
  want.current = move || {};
  const raf = useRef(0);
  const q = (sel) => (ref.current ? ref.current.querySelectorAll(sel) : []);
  const place = () => {
    Object.keys(pos.current).forEach((k) => {
      const ax = F.axes[k];
      if (!ax) return;
      const v = pos.current[k];
      q('[data-move="' + k + '"]').forEach((g) => g.setAttribute('transform', 'translate(' + (ax[0] * v).toFixed(2) + ' ' + (ax[1] * v).toFixed(2) + ')'));
    });
  };
  useLayoutEffect(() => {
    pos.current = Object.assign({}, move || {});
    place();
    return () => cancelAnimationFrame(raf.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const moveKey = JSON.stringify(move || {});
  useEffect(() => {
    if (!pos.current) return undefined;
    const calm = reduceMotion();
    let last = 0;
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      let moving = false;
      Object.keys(want.current).forEach((k) => {
        const w = want.current[k];
        const v = pos.current[k] === undefined ? w : pos.current[k];
        const nv = calm ? w : v + (w - v) * (1 - Math.exp(-dt / 0.18));
        pos.current[k] = Math.abs(w - nv) < 0.05 ? w : nv;
        if (pos.current[k] !== w) moving = true;
      });
      place();
      raf.current = moving ? requestAnimationFrame(tick) : 0;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [moveKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const textKey = JSON.stringify(texts || {});
  useLayoutEffect(() => {
    const t = texts || {};
    q('[data-t]').forEach((n) => {
      const k = n.getAttribute('data-t');
      if (t[k] === undefined) return;
      n.textContent = t[k];
      // Длинный текст сжимается до ширины карточки, а не вылезает за неё.
      const fit = Number(n.getAttribute('data-fit'));
      n.removeAttribute('textLength');
      n.removeAttribute('lengthAdjust');
      if (fit && t[k] && n.getComputedTextLength && n.getComputedTextLength() > fit) {
        n.setAttribute('textLength', String(fit));
        n.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
  }, [textKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const partKey = JSON.stringify(parts || {});
  useLayoutEffect(() => {
    const ps = parts || {};
    q('[data-part]').forEach((g) => {
      const st = ps[g.getAttribute('data-part')];
      if (st && st !== 'on') g.setAttribute('data-state', st); else g.removeAttribute('data-state');
    });
  }, [partKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const litKey = (lit || []).join(',');
  useLayoutEffect(() => {
    const on = lit || [];
    q('[data-sel]').forEach((g) => {
      const yes = on.indexOf(g.getAttribute('data-sel')) >= 0;
      g.classList.toggle('is-lit', yes);
      const solid = g.querySelector(':scope > .iso-solid');
      if (solid) { if (yes) solid.setAttribute('data-lit', ''); else solid.removeAttribute('data-lit'); }
    });
  }, [litKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const ledKey = (led || []).join(',') + '|' + (pickable || []).join(',') + '|' + !!onPick;
  useLayoutEffect(() => {
    q('[data-hit]').forEach((g) => {
      const k = g.getAttribute('data-hit');
      g.classList.toggle('is-led', (led || []).indexOf(k) >= 0);
      g.classList.toggle('is-pick', !!onPick && (!pickable || pickable.indexOf(k) >= 0));
    });
  }, [ledKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shake || !shake.k) return undefined;
    const els = q('[data-shake="' + shake.k + '"]');
    els.forEach((g) => { g.classList.remove('fx-shake'); void g.getBoundingClientRect(); g.classList.add('fx-shake'); });
    const t = setTimeout(() => els.forEach((g) => g.classList.remove('fx-shake')), 520);
    return () => clearTimeout(t);
  }, [shake && shake.n]); // eslint-disable-line react-hooks/exhaustive-deps

  const click = (e) => {
    if (!onPick) return;
    const g = e.target.closest && e.target.closest('[data-hit]');
    if (!g) return;
    const k = g.getAttribute('data-hit');
    if (pickable && pickable.indexOf(k) < 0) return;
    onPick(k);
  };
  return <div ref={ref} className={'fig iso' + (cls ? ' ' + cls : '')} data-theme="light" style={{ '--ar': F.ar }} role="img"
    aria-label={label ? pick(label) : undefined} onClick={click} dangerouslySetInnerHTML={html} />;
}

// Состояние модели по умолчанию: коробка открыта, всё на месте.
const OPEN_PARTS = { lid: 'off', slots: 'off', 'title-stray': 'off' };
const LID_UP = () => FIG.open.lid;
const DROP = () => FIG.open.drop;

// Кнопки частей: имя тега + цвет + форма. Для клавиатуры и для тех, кому
// неудобно попадать в модель.
function PartChips({ items, onPick, sel, seen, disabled, led, cls }) {
  return (
    <div className={'chips' + (cls ? ' ' + cls : '')} translate="no">
      {items.map((k) => (
        <button key={k} type="button" disabled={disabled} onClick={() => onPick(k)} style={{ '--c': TAGC[k] || T.ink2 }}
          className={'chip mono' + (sel === k ? ' is-sel' : '') + (seen && seen.indexOf(k) >= 0 ? ' is-seen' : '')}>
          <span className="chip-mark" aria-hidden="true">{seen && seen.indexOf(k) >= 0 ? <Icon name="check" size={12} /> : null}</span>
          {k}
          <Led on={!!led && led.indexOf(k) >= 0} />
        </button>
      ))}
    </div>
  );
}

// Строка задания: при затруднении на её место встаёт подсказка.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}

// =============================================================================
// 1. ЭТО БУДЕТ ТВОЯ СТРАНИЦА — готовая страница и закрытая модель.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const opened = !!(rec && rec.open);
  const [speaker, , spoken, sayNow] = useVoice(opened ? [{ text: c.opened, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(opened, spoken);
  const led = useIdleLed(canTap && !opened, 0);
  const [stage, setStage] = useState(opened ? 3 : 0);   // 0 закрыт · 1 крышка · 2 отделения · 3 title
  useEffect(() => {
    if (!opened || stage >= 3) return undefined;
    const t = setTimeout(() => setStage((s) => s + 1), reduceMotion() ? 0 : 520);
    return () => clearTimeout(t);
  }, [opened, stage]);
  const open = () => {
    if (opened || !canTap) return;
    sfx('pop', true);
    put({ open: true });
    setStage(1);
    sayNow(c.opened, 'wonder');
  };
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={opened ? c.askDone : c.ask} />
      <div className="duo">
        <MiniBrowser title={t} page={x} />
        <Fig texts={docTexts(t, x)} onPick={opened ? null : open} led={led ? ['lid'] : []}
          parts={{ lid: stage >= 2 ? 'off' : 'on', slots: 'off', 'title-stray': 'off', head: stage >= 2 ? 'on' : 'off', body: stage >= 2 ? 'on' : 'off', 'title-card': stage >= 3 ? 'on' : 'off' }}
          move={{ lid: stage >= 1 ? LID_UP() : 0, head: stage >= 2 ? 0 : DROP(), body: stage >= 2 ? 0 : DROP(), 'title-card': stage >= 3 ? 0 : DROP() }}
          cls={'fig-s1' + (stage === 1 ? ' is-lifting' : '')} label={c.ask} />
      </div>
      {!opened ? (
        <button type="button" className={'bigbtn' + (led ? ' is-led' : '')} disabled={!canTap} onClick={open}>
          <span className="bigbtn-in"><Icon name="eye" size={20} />{pick(UI.open)}</span>
          <Led on={led} />
        </button>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 2. ЗАГЛЯНИ ВНУТРЬ — исследование: часть ↔ код ↔ браузер.
// =============================================================================
const PARTS4 = ['html', 'head', 'title', 'body'];
const LINE_PART = { doctype: null, 'html-o': 'html', 'html-c': 'html', 'head-o': 'head', 'head-c': 'head', title: 'title', 'body-o': 'body', text: 'body', 'body-c': 'body' };
const HIT_PART = { html: 'html', lid: 'html', head: 'head', body: 'body', title: 'title', page: 'body' };
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const [seen, setSeen] = useState(() => (rec && rec.seen) || []);
  const done = PARTS4.every((k) => seen.indexOf(k) >= 0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const [cur, setCur] = useState(null);
  const led = useIdleLed(canTap && !done, seen.length);
  const choose = (k) => {
    if (!canTap || !k) return;
    sfx('tap', true);
    setCur(k);
    const next = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(next);
    if (!done && PARTS4.every((x) => next.indexOf(x) >= 0)) { put({ seen: next }); sayNow(joinL(c.parts[k], c.done), 'cheer'); }
    else sayNow(c.parts[k], k === 'title' ? 'point' : 'explain');
  };
  const t = pick(SAMPLE.title), x = pick(SAMPLE.text);
  const lit = cur === 'html' ? ['html', 'html-close'] : cur === 'head' ? ['head', 'head-close'] : cur === 'body' ? ['body', 'body-close', 'page'] : cur === 'title' ? ['title'] : [];
  const left = PARTS4.filter((k) => seen.indexOf(k) < 0);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} n={seen.length + '/4'} />
      <div className="ex">
        <Fig texts={docTexts(t, x)} parts={OPEN_PARTS} lit={lit} onPick={(h) => choose(HIT_PART[h])}
          move={{ lid: LID_UP(), head: cur === 'head' ? 5 : 0, body: cur === 'body' ? 5 : 0, 'title-card': cur === 'title' ? 7 : 0 }}
          led={led ? left.map((k) => (k === 'html' ? 'html' : k)) : []} label={c.ask} />
        <div className="ex-side">
          <MiniBrowser title={t} page={x} compact hl={cur === 'title' ? 'title' : cur === 'body' ? 'body' : cur === 'html' ? 'html' : null} />
          {cur === 'head' ? <p className="note-line"><Icon name="doc" size={15} />{pick(UI.headInfo)}</p> : null}
          <CodeLines lines={buildLines(FULL_DOC, { title: t, text: x })} hl={cur} className="cv-ex"
            lineProps={(ln) => (LINE_PART[ln.id] ? { onTap: () => choose(LINE_PART[ln.id]), disabled: !canTap } : null)} />
        </div>
      </div>
      <PartChips items={PARTS4} onPick={choose} sel={cur} seen={seen} disabled={!canTap} led={led ? left : null} />
    </Stage>
  );
}

// =============================================================================
// 3. ПРЕДСКАЖИ ИЗМЕНЕНИЕ — сначала ответ, потом изменение и «провод».
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  // Очередь раундов: title, body; промах добавляет такой же раунд с новым текстом.
  const [queue, setQueue] = useState(() => (solved ? [] : [{ k: 'title', v: 'text' }, { k: 'body', v: 'text' }]));
  const [doneRounds, setDoneRounds] = useState(0);
  const round = queue[0] || null;
  const R = round ? c.rounds[round.k] : null;
  const [vals, setVals] = useState(() => (solved && rec.vals) || { title: pick(SAMPLE.title), text: pick(SAMPLE.text) });
  const [answered, setAnswered] = useState(null);           // 'tab' | 'page' после ответа
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const [wire, setWire] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.rounds.title.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stats = useRef({ title: { tries: 0, miss: 0, extra: null }, body: { tries: 0, miss: 0, extra: null } });
  const wrapRef = useRef(null);
  const tabRef = useRef(null), pageRef = useRef(null);
  const zones = useRef({});
  const regZone = (z, el) => { zones.current[z] = el; };
  const newText = round ? pick(round.v === 'extra' ? R.extra : R.text) : '';

  const answer = (where) => {
    if (!canTap || !round || answered) return;
    const k = round.k;
    const st = stats.current[k];
    st.tries += 1;
    const right = where === R.want;
    setAnswered(where);
    setVals((v) => (k === 'title' ? Object.assign({}, v, { title: newText }) : Object.assign({}, v, { text: newText })));
    setFlash((f) => (R.want === 'tab' ? { tab: f.tab + 1, page: f.page } : { tab: f.tab, page: f.page + 1 }));
    setWire((n) => n + 1);
    if (round.v === 'extra') st.extra = right;
    if (right) {
      sfx('ok', true);
      sayNow(R.want === 'tab' ? c.okTab : c.okPage, 'smile');
    } else {
      st.miss += 1;
      sfx('soft', true);
      sayNow(R.want === 'tab' ? c.missTab : c.missPage, 'rule');
    }
    setTimeout(() => {
      setQueue((q) => {
        const rest = q.slice(1);
        if (!right && round.v !== 'extra') rest.unshift({ k, v: 'extra' });
        if (!rest.length) finish();
        else setTimeout(() => sayNow(c.rounds[rest[0].k].say, 'curious'), 50);
        return rest;
      });
      setDoneRounds((n) => n + 1);
      setAnswered(null);
    }, reduceMotion() ? 1400 : 2600);
  };
  const finish = () => {
    const s = stats.current;
    ['title', 'body'].forEach((k) => log({ screenId: 's3.' + k, type: 'predict', correct: true, firstTry: s[k].miss === 0,
      attempts: s[k].tries, hints: 0, helped: s[k].miss > 0, followUp: s[k].extra }));
    log({ screenId: 's3', type: 'predict', correct: true, firstTry: s.title.miss + s.body.miss === 0, attempts: s.title.tries + s.body.tries });
    put({ done: true, vals });
    setTimeout(() => sayNow(c.done, 'cheer'), 2400);
  };
  const askText = round ? fillL(round.k === 'title' ? c.askTitle : c.askBody, { t: newText }) : c.done;
  const hlLine = round && !answered ? round.k : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={round ? (doneRounds + 1) + '/' + (doneRounds + queue.length) : null} />
      <div className="pr3" ref={wrapRef}>
        <MiniBrowser title={vals.title} page={vals.text} tabRef={tabRef} pageRef={pageRef} flashTab={flash.tab} flashPage={flash.page} typed={!!answered} />
        <CodeLines lines={buildLines(FULL_DOC, vals)} hl={hlLine} regZone={regZone} className="cv-pr" />
        <Fig texts={docTexts(vals.title, vals.text)} parts={OPEN_PARTS} move={{ lid: LID_UP() }} cls="fig-mini"
          lit={answered && round ? (round.k === 'title' ? ['title'] : ['page']) : []} />
        <Wire wrapRef={wrapRef} on={!!answered} nonce={wire} color={round && round.k === 'title' ? TAGC.title : TAGC.body}
          from={() => zones.current[round && round.k === 'title' ? 'title-text' : 'body-text']}
          to={() => (round && R.want === 'tab' ? tabRef.current : pageRef.current)} />
      </div>
      {round ? (
        <div className="where" role="group">
          {['tab', 'page'].map((w) => (
            <button key={w} type="button" disabled={!canTap || !!answered}
              className={'where-b' + (answered === w ? (w === R.want ? ' is-ok' : ' is-miss') : '') + (answered && w === R.want && answered !== w ? ' is-real' : '')}
              onClick={() => answer(w)}>
              <span className={'where-ic where-' + w} aria-hidden="true" />
              {pick(w === 'tab' ? UI.tab : UI.page)}
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 4. СОБЕРИ ДОКУМЕНТ — деталь → место (или перетаскивание).
// =============================================================================
const PIECES = ['head', 'body', 'title'];
function docOf(placed, vals) {
  const has = (k) => placed.indexOf(k) >= 0;
  const order = ['doctype', 'html-o'];
  if (has('head')) { order.push('head-o'); if (has('title')) order.push('title'); order.push('head-c'); }
  if (has('body')) order.push('body-o', 'text', 'body-c');
  order.push('html-c');
  return buildLines(order, vals);
}
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [placed, setPlaced] = useState(solved ? PIECES.slice() : []);
  const placedRef = useRef(placed);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [newest, setNewest] = useState(null);
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [chipShake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !solved, placed.length * 10 + (sel ? 1 : 0));
  const vals = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };
  const has = (k) => placed.indexOf(k) >= 0;

  const placeIt = (piece, place) => {
    if (!canTap || !piece || has(piece)) return;
    if (!place) return;
    tries.current += 1;
    const cur = placedRef.current;
    const ok = (piece === 'head' || piece === 'body') ? place === 'html' : place === 'head';
    let why = null;
    if (!ok) {
      if (piece === 'title') why = place === 'html' ? c.titleHtml : place === 'body' ? c.titleBody : c.noPlace;
      else why = c.nested;
      if ((place === 'head' || place === 'body') && cur.indexOf(place) < 0) why = c.noPlace;
    }
    if (ok) {
      const next = cur.concat(piece);
      placedRef.current = next;
      setPlaced(next); setSel(null); setMsg(null); setNewest(piece);
      sfx('ok', true);
      if (next.length === PIECES.length) {
        put({ done: true });
        log({ screenId: 's4', type: 'assemble', correct: true, firstTry: misses.current === 0, attempts: tries.current, hints: 0 });
        sayNow(joinL(c.ok[piece], c.done), 'cheer');
      } else sayNow(c.ok[piece], 'smile');
      return;
    }
    misses.current += 1;
    sfx('soft', true);
    wobble(piece);
    setShake((s) => ({ k: place === 'html' ? 'body' : place, n: s.n + 1 }));
    setMsg(why);
    sayNow(why, 'think');
  };
  const pickPlace = (place) => { if (!sel) { setMsg(UI.pickPiece); return; } placeIt(sel, place); };
  const hitToPlace = (h) => ({ html: 'html', lid: 'html', head: 'head', body: 'body', title: 'head', page: 'body' }[h] || null);

  // Перетаскивание — дополнительный способ: деталь тянется за пальцем, место
  // определяется по тому, что под ним при отпускании.
  const drag = useRef(null);
  const [ghost, setGhost] = useState(null);
  const onDown = (e, piece) => {
    if (!canTap || has(piece)) return;
    drag.current = { piece, x: e.clientX, y: e.clientY, moved: false };
  };
  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) { d.moved = true; setSel(d.piece); }
      if (d.moved) setGhost({ piece: d.piece, x: e.clientX, y: e.clientY });
    };
    const up = (e) => {
      const d = drag.current;
      drag.current = null;
      if (!d || !d.moved) return;
      setGhost(null);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hit = el && el.closest && el.closest('[data-hit],[data-place]');
      if (!hit) return;
      const place = hit.getAttribute('data-place') || hitToPlace(hit.getAttribute('data-hit'));
      placeIt(d.piece, place);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  });

  const placesNow = ['html'].concat(has('head') ? ['head'] : []).concat(has('body') ? ['body'] : []);
  const ledPieces = led && !sel ? PIECES.filter((k) => !has(k)) : [];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={sel ? c.askPlace : c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.askDone : sel ? c.askPlace : c.ask} hint={solved ? null : msg} n={placed.length + '/3'} />
      <div className="ex">
        <Fig texts={docTexts(vals.title, vals.text)} onPick={(h) => pickPlace(hitToPlace(h))} pickable={sel ? ['html', 'head', 'body', 'title', 'page'] : []}
          parts={{ lid: 'off', 'title-stray': 'off', slots: placed.length < 2 ? 'on' : 'off', head: has('head') ? 'on' : 'off', body: has('body') ? 'on' : 'off', 'title-card': has('title') ? 'on' : 'off' }}
          move={{ lid: LID_UP(), head: has('head') ? 0 : DROP(), body: has('body') ? 0 : DROP(), 'title-card': has('title') ? 0 : DROP() }}
          lit={newest === 'head' ? ['head'] : newest === 'body' ? ['body'] : newest === 'title' ? ['title'] : []}
          shake={shake} led={led && sel ? placesNow : []} label={c.ask} />
        <CodeLines lines={docOf(placed, vals)} className="cv-ex"
          lineProps={(ln) => ({ cls: LINE_PART[ln.id] === newest ? 'is-new' : '' })} />
      </div>
      {!solved ? (
        <div className="build-row">
          <div className="pieces" role="group" aria-label={pick(UI.pieces)}>
            {PIECES.filter((k) => !has(k)).map((k) => (
              <button key={k} type="button" disabled={!canTap} style={{ '--c': TAGC[k] }}
                className={'piece mono' + (sel === k ? ' is-sel' : '') + (chipShake === k ? ' fx-no' : '')}
                onPointerDown={(e) => onDown(e, k)} onClick={() => { setSel(sel === k ? null : k); setMsg(null); }}
                aria-pressed={sel === k}>
                {UI.piece[k]}
                <Led on={ledPieces.indexOf(k) >= 0} />
              </button>
            ))}
          </div>
          <div className={'places' + (sel ? ' is-on' : '')} role="group" aria-label={pick(UI.places)}>
            {['html', 'head', 'body'].map((pl) => (
              <button key={pl} type="button" data-place={pl} disabled={!canTap || !sel || (pl !== 'html' && !has(pl))}
                className="place mono" style={{ '--c': TAGC[pl] }} onClick={() => pickPlace(pl)}>
                {pick(pl === 'html' ? UI.intoHtml : pl === 'head' ? UI.intoHead : UI.intoBody)}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {ghost ? <div className="drag-ghost mono" style={{ left: ghost.x, top: ghost.y, '--c': TAGC[ghost.piece] }}>{UI.piece[ghost.piece]}</div> : null}
    </Stage>
  );
}

// =============================================================================
// 5. ПОМОГИ КОДИ РАЗОБРАТЬСЯ — панель проверки структуры и две починки.
// =============================================================================
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
const DOC5_BAD = ['doctype', 'html-o', 'head-o', 'head-c', 'body-o', 'title', 'text', 'html-c'];
const DOC5_GAP = ['doctype', 'html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', null, 'html-c'];
const DOC5_HEAD = ['doctype', 'html-o', 'head-o', 'title', null, 'body-o', 'text', 'body-c', 'html-c'];
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  // phase: move → type → (typeHead, если пришлось сильно помогать) → done
  const [phase, setPhase] = useState(solved ? 'done' : 'move');
  const [picked, setPicked] = useState(false);
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.typeOk : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const st = useRef({ moveTries: 0, typeTries: 0, typeMiss: 0, headExtra: null });
  const led = useIdleLed(canTap && !solved, (phase === 'move' ? (picked ? 1 : 0) : 5) + st.current.typeMiss * 10);
  const vals = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };
  const tag = phase === 'typeHead' ? 'head' : 'body';

  const target = (place) => {
    if (!canTap || phase !== 'move') return;
    if (!picked) { if (place === 'title') { setPicked(true); setMsg(c.moveTarget); sfx('tap', true); } else setMsg(c.pickTitle); return; }
    st.current.moveTries += 1;
    if (place === 'head') {
      sfx('ok', true);
      setPicked(false); setMsg(null);
      setPhase('type');
      sayNow(joinL(c.moveOk, c.type), 'smile');
      return;
    }
    if (place === 'title') return;
    sfx('soft', true);
    const m = place === 'body' ? c.moveBody : c.moveHtml;
    setMsg(m);
    setShake((s) => ({ k: place === 'html' ? 'body' : place, n: s.n + 1 }));
    sayNow(m, 'think');
  };
  const hitMap = { 'title': 'title', head: 'head', body: 'body', html: 'html', lid: 'html', page: 'body' };
  const lineTap = (id) => target({ title: 'title', 'head-o': 'head', 'head-c': 'head', 'body-o': 'body', text: 'body', 'html-o': 'html', 'html-c': 'html' }[id] || null);

  useEffect(() => {
    if (phase !== 'type' && phase !== 'typeHead') return undefined;
    const w = tagWord(val);
    const want = '</' + tag + '>';
    if (w === want) {
      sfx('win', true);
      setMsg(null);
      if (phase === 'typeHead') st.current.headExtra = true;
      if (phase === 'type' && st.current.typeMiss >= 2) {
        // Пришлось сильно помогать — ещё одна такая же починка с другим тегом.
        sayNow(joinL(c.typeOk, c.typeHead), 'smile');
        setTimeout(() => { setVal(''); setPhase('typeHead'); }, 900);
        return undefined;
      }
      setPhase('done');
      put({ done: true });
      const s = st.current;
      log({ screenId: 's5.move', type: 'fix-move', correct: true, firstTry: s.moveTries === 1, attempts: s.moveTries, hints: 0 });
      log({ screenId: 's5.close', type: 'fix-close', correct: true, firstTry: s.typeMiss === 0, attempts: s.typeTries + 1,
        hints: s.typeMiss, helped: s.typeMiss >= 2, followUp: s.headExtra });
      sayNow(phase === 'typeHead' ? c.typeOkHead : c.typeOk, 'cheer');
      return undefined;
    }
    if (!w) { setMsg(null); return undefined; }
    const t = setTimeout(() => {
      let m = null;
      if (w === '<' + tag + '>' || w === tag + '>' || w === '<' + tag) m = c.noSlash;
      else if (/^<\/[a-z]+>$/.test(w)) m = fillL(c.wrongName, { tag: '</' + tag + '>' });
      else if (w === '</' + tag) m = c.noGt;
      if (m) { st.current.typeTries += 1; st.current.typeMiss += 1; setMsg(m); sayNow(m, 'think'); }
    }, 1300);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps

  const moved = phase !== 'move';
  const bodyClosed = phase === 'done' || phase === 'typeHead';
  const headClosed = phase !== 'typeHead';
  const rules = [
    { id: 'in', ok: true, text: c.rules.inHtml },
    { id: 'th', ok: moved, text: c.rules.titleHead },
    { id: 'bc', ok: bodyClosed, text: c.rules.bodyClosed }
  ].concat(phase === 'typeHead' ? [{ id: 'hc', ok: false, text: c.rules.headClosed }] : []);
  const lines = buildLines(phase === 'move' ? DOC5_BAD : phase === 'type' ? DOC5_GAP : phase === 'typeHead' ? DOC5_HEAD : FULL_DOC, vals);
  const askText = phase === 'move' ? (picked ? c.moveTarget : c.move) : phase === 'type' ? c.typeAsk : phase === 'typeHead' ? c.typeAskHead : c.typeOk;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Inspector rules={rules} />
      <Ask text={askText} hint={msg} />
      <div className="ex ex-s5">
        <Fig texts={docTexts(vals.title, vals.text)} onPick={phase === 'move' ? (h) => target(hitMap[h]) : null}
          parts={{ lid: 'off', slots: 'off', 'title-stray': moved ? 'off' : 'on', 'title-card': moved ? 'on' : 'off', 'body-close': bodyClosed ? 'on' : 'ghost', 'head-close': headClosed ? 'on' : 'ghost' }}
          move={{ lid: LID_UP(), 'title-card': moved ? 0 : DROP(), 'title-stray': picked ? 8 : 0 }}
          lit={picked ? ['title'] : phase === 'type' ? ['body'] : phase === 'typeHead' ? ['head'] : []}
          shake={shake} led={led && phase === 'move' ? (picked ? ['head'] : ['title']) : []} label={askText} />
        <CodeLines lines={lines} className="cv-ex"
          lineProps={(ln, i) => {
            // При открытой клавиатуре дальние от пустой строки строки уходят (.is-ctx).
            const ctx = (phase === 'type' && i < 5) || (phase === 'typeHead' && (i < 2 || i > 5)) ? 'is-ctx' : '';
            if (ln.empty) {
              return { cls: 'is-gap', empty: (
                <span className={'gap-in' + (led ? ' is-led' : '')}>
                  <InlineInput value={val} onChange={setVal} placeholder={L3('</…>', '</…>', '</…>')} label={askText} max={10} cls="tk-input-tag" />
                  <Led on={led} />
                </span>) };
            }
            if (phase === 'move' && LINE_PART[ln.id]) return { onTap: () => lineTap(ln.id), disabled: !canTap, cls: ln.id === 'title' && picked ? 'is-picked' : '' };
            return ctx ? { cls: ctx } : null;
          }} />
      </div>
    </Stage>
  );
}

// =============================================================================
// 6. ТВОЯ ЛАБОРАТОРИЯ — модель, код и браузер меняются вместе.
// =============================================================================
function LabCode({ title, text, onTitle, onText, labelT, labelB }) {
  // Поля ввода прямо в строках title и body настоящего кода.
  return (
    <CodeLines lines={buildLines(FULL_DOC, { title, text })} className="cv-ex cv-lab"
      renderText={(t) => (t.z === 'title-text'
        ? <InlineInput value={title} onChange={onTitle} label={labelT} max={40} placeholder={SAMPLE.title} />
        : <InlineInput value={text} onChange={onText} label={labelB} max={60} placeholder={SAMPLE.text} />)} />
  );
}
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put, store] = useRec('s6');
  const solved = !!(rec && rec.done);
  const lab0 = store.get('lab');
  const [title, setTitle] = useState(lab0 ? lab0.title : pick(SAMPLE.title));
  const [text, setText] = useState(lab0 ? lab0.text : pick(SAMPLE.text));
  const [view, setView] = useState('browser');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canGo = useAdvanceGate(solved, spoken);
  const seen = useRef({ title: !!solved, text: !!solved });
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const said = useRef({ title: false, text: false });
  const led = useIdleLed(!solved, 0);
  // Голос — не на каждую букву: одна реплика после паузы в наборе, по разу на поле.
  useEffect(() => {
    const t = setTimeout(() => {
      const okT = hasLetters(title) && !hasTags(title) && title.trim() !== pick(SAMPLE.title);
      const okB = hasLetters(text) && !hasTags(text) && text.trim() !== pick(SAMPLE.text);
      if (okT && !said.current.title) { said.current.title = true; seen.current.title = true; if (!solved) sayNow(c.sawTitle, 'point'); }
      if (okB && !said.current.text) { said.current.text = true; seen.current.text = true; if (!solved) sayNow(c.sawBody, 'point'); }
      if (hasLetters(title) && hasLetters(text) && !hasTags(title + text)) store.set('lab', { title: title.trim(), text: text.trim() });
      if (!solved && seen.current.title && seen.current.text) { put({ done: true }); sayNow(c.done, 'cheer'); }
    }, 1200);
    return () => clearTimeout(t);
  }, [title, text]); // eslint-disable-line react-hooks/exhaustive-deps
  const onTitle = (v) => { setTitle(v); setFlash((f) => ({ tab: f.tab + 1, page: f.page })); };
  const onText = (v) => { setText(v); setFlash((f) => ({ tab: f.tab, page: f.page + 1 })); };
  const reset = () => { setTitle(pick(SAMPLE.title)); setText(pick(SAMPLE.text)); };
  const clean = (s) => (hasTags(s) ? '' : s);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <div className="lab">
        <div className="lab-views">
          <div className="lab-toggle" role="tablist">
            {['browser', 'model'].map((v) => (
              <button key={v} type="button" role="tab" aria-selected={view === v} className={'seg' + (view === v ? ' is-on' : '')} onClick={() => setView(v)}>
                {pick(v === 'browser' ? UI.browser : UI.model)}
              </button>
            ))}
          </div>
          <div className={'lab-b' + (view === 'browser' ? ' is-shown' : '')}>
            <MiniBrowser title={clean(title)} page={clean(text)} flashTab={flash.tab} flashPage={flash.page} />
          </div>
          <div className={'lab-m' + (view === 'model' ? ' is-shown' : '')}>
            <Fig texts={docTexts(clean(title), clean(text))} parts={OPEN_PARTS} move={{ lid: LID_UP() }} cls="fig-lab" />
          </div>
        </div>
        <div className={'lab-c' + (led ? ' is-led' : '')}>
          <LabCode title={title} text={text} onTitle={onTitle} onText={onText} labelT={c.ask} labelB={c.ask} />
          <button type="button" className="btn-ghost lab-reset" onClick={reset}><Icon name="undo" size={16} />{pick(UI.reset)}</button>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// 7. ТЕПЕРЬ САМОСТОЯТЕЛЬНО — четыре задачи, меньше поддержки.
// В первой попытке ответ не подсвечивается и рука не показывает путь.
// Подсказка — по лампочке или после затруднения: 1 — направление, 2 — подробно
// (тогда же загорается место). После подробной помощи — похожий пример.
// =============================================================================
const TASKS7 = ['goal', 'where', 'build', 'close'];
const BUILD7 = ['html-o', 'head-o', 'head-c', 'body-o', 'body-c', 'html-c'];
const BUILD7B = ['head-o', 'title', 'head-c'];
const POOL7 = ['body-o', 'html-c', 'head-o', 'body-c', 'html-o', 'head-c'];
const POOL7B = ['head-c', 'title', 'head-o'];
const BUILD_RULE = {
  'html-o': L3('Tashqi quti birinchi ochiladi: <html>.', 'Внешняя коробка открывается первой: <html>.', 'The outer box opens first: <html>.'),
  'head-o': L3('html ichida avval head ochiladi.', 'Внутри html сначала открывается head.', 'Inside html, head opens first.'),
  'head-c': L3('head ni yopish kerak, body boshlanishidan oldin.', 'head нужно закрыть до того, как начнётся body.', 'head must close before body starts.'),
  'body-o': L3('Endi body ochiladi.', 'Теперь открывается body.', 'Now body opens.'),
  'body-c': L3('body ni yopamiz.', 'Закрываем body.', 'We close body.'),
  'html-c': L3('Oxirida tashqi quti yopiladi: </html>.', 'Последней закрывается внешняя коробка: </html>.', 'Last, the outer box closes: </html>.'),
  title: L3('head ichida title turadi.', 'Внутри head стоит title.', 'title sits inside head.')
};
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [ti, setTi] = useState(solved ? 4 : 0);
  const [variant, setVariant] = useState('A');         // A — основная задача, B — похожая после помощи
  const [hintLv, setHintLv] = useState(0);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(false);
  const [built, setBuilt] = useState([]);
  const builtRef = useRef([]);
  const [chipShake, wobble] = useShake();
  const [shake, setShake] = useState({ k: null, n: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({});
  const task = TASKS7[ti];
  const T7 = task ? c.tasks[task] : null;
  const B = variant === 'B';
  const S = (k) => stat.current[k] || (stat.current[k] = { tries: 0, misses: 0, hints: 0, followUp: null });

  // Подсказка по запросу: лампочка в шапке поднимает ступень подсказки.
  const pulse = useHintPulse();
  const pulse0 = useRef(pulse);
  useEffect(() => {
    if (pulse === pulse0.current || !task || okNow) return;
    pulse0.current = pulse;
    setHintLv((h) => Math.min(2, h + 1));
    S(task).hints += 1;
  }, [pulse]); // eslint-disable-line react-hooks/exhaustive-deps

  const hintText = !T7 ? null : hintLv === 0 ? null : hintLv === 1 ? (B && T7.hint1B ? T7.hint1B : T7.hint1) : (B && T7.hint2B ? T7.hint2B : T7.hint2);
  const vals = { title: pick(SAMPLE.title), text: pick(SAMPLE.text) };

  const nextTask = () => {
    setOkNow(false); setMsg(null); setHintLv(0); setMisses(0); setBuilt([]); builtRef.current = [];
    if (ti + 1 >= TASKS7.length) {
      put({ done: true });
      sayNow(c.done, 'celebrate');
      setTi(4);
      return;
    }
    setVariant('A');
    setTi(ti + 1);
    sayNow(c.tasks[TASKS7[ti + 1]].ask, 'explain');
  };
  const success = () => {
    const s = S(task);
    if (B) s.followUp = s.followMiss ? false : true;
    sfx('ok', true);
    setOkNow(true); setMsg(null);
    const helped = s.hints >= 2 || s.misses >= 2;
    if (!B) {
      log({ screenId: 's7.' + task, type: 'independent', correct: true, firstTry: s.misses === 0 && s.hints === 0,
        attempts: s.tries, hints: s.hints, helped, independent: s.misses === 0 && s.hints === 0 });
    } else {
      const row = { screenId: 's7.' + task, type: 'independent', correct: true, firstTry: false, attempts: s.tries, hints: s.hints, helped: true, independent: false, followUp: s.followUp };
      log(row);
    }
    if (!B && helped) {
      // Решено с подробной помощью — похожий пример с другим содержимым, без подсказок сначала.
      sayNow(joinL(T7.ok, c.again), 'smile');
      setTimeout(() => { setOkNow(false); setVariant('B'); setHintLv(0); setMisses(0); setBuilt([]); builtRef.current = []; }, 1600);
      return;
    }
    sayNow(T7.ok, 'smile');
    setTimeout(nextTask, 1500);
  };
  const miss = (m, shakeKey) => {
    const s = S(task);
    s.misses += 1;
    if (B) s.followMiss = true;
    sfx('soft', true);
    setMisses((n) => n + 1);
    setHintLv((h) => Math.min(2, Math.max(h, misses + 1)));
    setMsg(m);
    if (shakeKey) setShake((x) => ({ k: shakeKey, n: x.n + 1 }));
    sayNow(m, 'think');
  };

  // Задача 1: выбрать место в коде по цели.
  const goalTap = (z) => {
    if (!canTap || okNow) return;
    S(task).tries += 1;
    const want = B ? 'body-text' : 'title-text';
    if (z === want) { success(); return; }
    if (z === 'title-text' || z === 'body-text') miss(T7.otherText); else miss(T7.tag);
  };
  // Задача 2: куда положить карточку.
  const whereTap = (place) => {
    if (!canTap || okNow || !place) return;
    S(task).tries += 1;
    const want = B ? 'body' : 'head';
    if (place === want) { success(); return; }
    miss(B ? T7.hint1B : (place === 'body' ? C.s4.titleBody : C.s4.titleHtml), place === 'html' ? 'body' : place);
  };
  // Задача 3: собрать структуру по порядку.
  const order = B ? BUILD7B : BUILD7;
  const pool = (B ? POOL7B : POOL7).filter((id) => builtRef.current.indexOf(id) < 0);
  const buildTap = (id) => {
    if (!canTap || okNow) return;
    S(task).tries += 1;
    const k = builtRef.current.length;
    if (order[k] === id) {
      const next = builtRef.current.concat(id);
      builtRef.current = next;
      setBuilt(next);
      sfx('tap', true);
      if (next.length === order.length) success();
      return;
    }
    wobble(id);
    miss(BUILD_RULE[order[k]]);
  };
  // Задача 4: открывающий или закрывающий.
  const closeOpts = B ? ['</head>', '<head>', '</body>'] : ['<body>', '</head>', '</body>'];
  const closeTap = (o) => {
    if (!canTap || okNow) return;
    S(task).tries += 1;
    const want = B ? '</head>' : '</body>';
    if (o === want) { success(); return; }
    wobble(o);
    miss(o.indexOf('/') < 0 ? C.s5.noSlash : fillL(C.s5.wrongName, { tag: want }));
  };

  const ask = !T7 ? c.done : (B ? T7.askB : T7.ask);
  const showLed = hintLv >= 2;                 // место загорается только после подробной подсказки
  const goalVals = okNow && task === 'goal' ? (B ? Object.assign({}, vals, { text: pick(L3('Mushugim uxlayapti', 'Мой кот спит', 'My cat is sleeping')) }) : Object.assign({}, vals, { title: pick(L3('Mening mushugim', 'Мой кот', 'My cat')) })) : vals;
  const buildLinesNow = buildLines(B ? ['doctype', 'html-o'].concat(built).concat(['body-o', 'text', 'body-c', 'html-c']) : ['doctype'].concat(built), vals);
  const builtHas = (id) => built.indexOf(id) >= 0;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintText || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg && !okNow ? msg : (hintText && !okNow ? hintText : null)}
        n={task ? (ti + 1) + '/4' + (B ? ' · ' + pick(UI.again).toLowerCase() : '') : null} />
      {task === 'goal' ? (
        <div className="work pr">
          <MiniBrowser title={goalVals.title} page={goalVals.text} flashTab={okNow && !B ? 1 : 0} flashPage={okNow && B ? 1 : 0} />
          <CodeLines lines={buildLines(FULL_DOC, goalVals)} className="cv-pr"
            zone={(z, t) => (z ? { tap: true, disabled: !canTap || okNow, led: showLed && z === (B ? 'body-text' : 'title-text') } : null)}
            onZone={(z) => goalTap(z)} />
        </div>
      ) : null}
      {task === 'where' ? (
        <>
          <div className="card-float" translate="no">
            <span className="card-f mono" style={{ '--c': B ? TAGC.body : TAGC.title }}>{B ? pick(SAMPLE.text) : '<title>' + pick(SAMPLE.title) + '</title>'}</span>
          </div>
          <Fig texts={docTexts(vals.title, vals.text)} onPick={(h) => whereTap({ html: 'html', lid: 'html', head: 'head', body: 'body', page: 'body' }[h])}
            pickable={['html', 'head', 'body', 'page']}
            parts={{ lid: 'off', slots: 'off', 'title-stray': 'off', 'title-card': okNow && !B ? 'on' : 'off', 'page-card': B && !okNow ? 'off' : 'on' }}
            move={{ lid: LID_UP() }} shake={shake} led={showLed ? [B ? 'body' : 'head'] : []}
            lit={okNow ? [B ? 'page' : 'title'] : []} label={ask} />
          <PartChips items={['html', 'head', 'body']} onPick={whereTap} disabled={!canTap || okNow} led={showLed ? [B ? 'body' : 'head'] : null} />
        </>
      ) : null}
      {task === 'build' ? (
        <>
          <div className="ex">
            <Fig texts={docTexts(vals.title, vals.text)}
              parts={B
                ? { lid: 'off', slots: 'off', 'title-stray': 'off', 'head-close': builtHas('head-c') ? 'on' : 'ghost', 'title-card': builtHas('title') ? 'on' : 'off', head: builtHas('head-o') ? 'on' : 'ghost' }
                : { lid: 'off', 'title-stray': 'off', 'title-card': 'off', 'page-card': 'off', case: builtHas('html-o') ? 'on' : 'ghost', 'case-near': builtHas('html-o') ? 'on' : 'ghost',
                  'html-close': builtHas('html-c') ? 'on' : 'ghost', slots: builtHas('html-o') && !builtHas('body-o') ? 'on' : 'off',
                  head: builtHas('head-o') ? 'on' : 'off', 'head-close': builtHas('head-c') ? 'on' : 'ghost',
                  body: builtHas('body-o') ? 'on' : 'off', 'body-close': builtHas('body-c') ? 'on' : 'ghost' }}
              move={{ lid: LID_UP(), head: builtHas('head-o') || B ? 0 : DROP(), body: builtHas('body-o') ? 0 : DROP(), 'title-card': builtHas('title') ? 0 : DROP() }} label={ask} />
            <CodeLines lines={buildLinesNow} className="cv-ex" />
          </div>
          {pool.length ? (
            <div className="pool" translate="no">
              {pool.map((id) => {
                const ln = buildLines([id], vals)[0];
                return (
                  <button key={id} type="button" disabled={!canTap || okNow} className={'pool-chip' + (chipShake === id ? ' fx-no' : '')} onClick={() => buildTap(id)}>
                    {ln.toks.map((t, j) => (t.k === 'text' ? <span key={j} className="tk-text">{t.v}</span> : <Tag key={j} tag={t.tag} close={t.k === 'close'} />))}
                    <Led on={showLed && id === order[built.length]} />
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      ) : null}
      {task === 'close' ? (
        <>
          <CodeLines lines={buildLines(FULL_DOC, vals)} className="cv-pr" hl={B ? 'head' : 'body'} />
          <div className="jaws" translate="no">
            {closeOpts.map((o) => (
              <button key={o} type="button" disabled={!canTap || okNow} className={'opt-tag mono' + (chipShake === o ? ' fx-no' : '') + (okNow && o === (B ? '</head>' : '</body>') ? ' is-on' : '')}
                onClick={() => closeTap(o)}>
                {o}<Led on={showLed && o === (B ? '</head>' : '</body>')} />
              </button>
            ))}
          </div>
        </>
      ) : null}
      {!task ? (
        <div className="ticks">
          {TASKS7.map((k) => {
            const s = stat.current[k] || {};
            const self = !s.misses && !s.hints;
            return <span key={k} className="tick is-on"><span className="tick-m"><Icon name="check" size={13} /></span>{pick(c.labels[k])}{self ? ' ★' : ''}</span>;
          })}
          <span className="tick-note">{pick(c.selfNote)}</span>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// 8. МОЯ ПЕРВАЯ СТРАНИЦА — своё название и текст, показать в коде, итог.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const lab = store.get('lab');
  const changed = (s, smp) => s && s !== pick(smp);
  const [title, setTitle] = useState(rec ? rec.title : (lab && changed(lab.title, SAMPLE.title) ? lab.title : ''));
  const [text, setText] = useState(rec ? rec.text : (lab && changed(lab.text, SAMPLE.text) ? lab.text : ''));
  const [phase, setPhase] = useState(rec && rec.done ? 'done' : 'write');   // write → showTitle → showBody → done
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec && rec.done ? c.bye : c.say, pose: rec && rec.done ? 'bye' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(phase === 'done', spoken);
  const tries = useRef({ t: 0, b: 0 });
  const led = useIdleLed(canTap && phase !== 'done', phase === 'write' ? 0 : phase === 'showTitle' ? 1 : 2);
  const okT = hasLetters(title) && !hasTags(title);
  const okB = hasLetters(text) && !hasTags(text);
  useEffect(() => {
    if (phase !== 'write' || !okT || !okB) return undefined;
    const t = setTimeout(() => { setPhase('showTitle'); sayNow(c.showTitle, 'point'); }, 1500);
    return () => clearTimeout(t);
  }, [title, text, phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const tapZone = (z) => {
    if (!canTap) return;
    if (phase === 'showTitle') {
      tries.current.t += 1;
      if (z === 'title-text' || z === 'title-o' || z === 'title-c') {
        sfx('ok', true); setMsg(null);
        log({ screenId: 's8.title', type: 'explain-source', correct: true, firstTry: tries.current.t === 1, attempts: tries.current.t });
        setPhase('showBody'); sayNow(joinL(c.foundTitle, c.showBody), 'cheer');
      } else { sfx('soft', true); setMsg(c.notTitle); sayNow(c.notTitle, 'think'); }
      return;
    }
    if (phase === 'showBody') {
      tries.current.b += 1;
      if (z === 'body-text') {
        sfx('win', true); setMsg(null);
        log({ screenId: 's8.body', type: 'explain-source', correct: true, firstTry: tries.current.b === 1, attempts: tries.current.b });
        const art = { type: 'html-page', title: title.trim(), text: text.trim(), html: buildHtml(title.trim(), text.trim()) };
        store.set('artifact', art);
        put({ done: true, title: title.trim(), text: text.trim() });
        setPhase('done'); sayNow(joinL(c.foundBody, c.bye), 'celebrate');
      } else { sfx('soft', true); setMsg(c.notBody); sayNow(c.notBody, 'think'); }
    }
  };
  const writing = phase === 'write';
  const askText = phase === 'write' ? c.askWrite : phase === 'showTitle' ? c.showTitle : phase === 'showBody' ? c.showBody : c.bye;
  const shownT = okT ? title : '', shownB = okB ? text : '';
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <Ask text={askText} hint={msg} />
      <div className="work pr">
        <MiniBrowser title={shownT} page={shownB} hl={phase === 'showBody' || phase === 'done' ? null : null} />
        {writing ? (
          <div className={'lab-c' + (led ? ' is-led' : '')}>
            <LabCode title={title} text={text} onTitle={setTitle} onText={setText} labelT={c.askWrite} labelB={c.askWrite} />
          </div>
        ) : (
          <CodeLines lines={buildLines(FULL_DOC, { title: shownT, text: shownB })} className="cv-pr"
            zone={(z) => (z && phase !== 'done' ? { tap: true, disabled: !canTap, led: led && z === (phase === 'showTitle' ? 'title-text' : 'body-text') } : z && phase === 'done' && (z === 'title-text' || z === 'body-text') ? { cls: 'is-found' } : null)}
            onZone={(z) => tapZone(z)} />
        )}
      </div>
      {phase === 'done' ? (
        <div className="final">
          <Fig texts={docTexts(shownT, shownB)} parts={OPEN_PARTS} move={{ lid: LID_UP() }} lit={['title', 'page']} cls="fig-mini" />
          <div className="final-side">
            <div className="ready-stamp"><Icon name="check" size={18} />{pick(UI.ready)}</div>
            <p className="final-note">{pick(UI.saveNote)}</p>
            <div className="bye-next next-card">
              <span className="bye-next-ic"><Icon name="doc" size={24} /></span>
              <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(c.next)}</b></span>
              <span className="next-tags mono" translate="no">h1 · p</span>
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK',    Comp: S1 },
  { id: 's2', code: 'SHOW',    Comp: S2 },
  { id: 's3', code: 'CHECK-1', Comp: S3 },
  { id: 's4', code: 'LEVEL-1', Comp: S4 },
  { id: 's5', code: 'CHECK-2', Comp: S5 },
  { id: 's6', code: 'LEVEL-2', Comp: S6 },
  { id: 's7', code: 'RESULT',  Comp: S7 },
  { id: 's8', code: 'ACHIEVEMENT', Comp: S8 }
];
// «Повторить» стирает только этот экран; работу из лаборатории (lab) и
// готовую страницу (artifact) не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'] };

export default function HtmlZaglyaniVnutr({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
.lesson-root { --ind: 1.1em; --gut: 2.2em; --cv-fs: clamp(11.5px, 3.1vw, 14px); --fig-h: min(40dvh, 420px); }
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
.cv-empty { display: inline-block; min-width: 4ch; }

/* ══ МОДЕЛЬ ДОКУМЕНТА (навык anatomy) ═══════════════════════════════ */
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
.iso-figure{margin:32px 0 36px}
.iso-plate{position:relative;padding:52px 24px;border-radius:0;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:18px 20px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
.iso-legend{display:grid;gap:8px;margin-top:12px;color:var(--anatomy-muted);font-size:13px;line-height:1.55}
.iso-keys{display:flex;flex-wrap:wrap;gap:6px 18px}
.iso-key{display:inline-flex;align-items:center;gap:7px}
.iso-swatch{width:16px;height:10px;flex:none;overflow:visible}
.iso-swatch path{fill:none;stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso-swatch[data-mark="raised"] path,.iso-swatch[data-mark="flat"] path{stroke:var(--anatomy-mid)}
.iso-swatch[data-mark="lit"] path{stroke:var(--anatomy-lit)}
.iso-swatch[data-mark="dim"] path{stroke:var(--anatomy-lo)}
.iso-swatch[data-mark="dotted"] path{stroke-dasharray:.01 3;stroke-width:1.4}
.iso-swatch[data-mark="dashed"] path{stroke-dasharray:3 2.5}
.iso-swatch[data-mark="red"] path{stroke:var(--anatomy-red)}
.iso-swatch[data-mark="green"] path{stroke:var(--anatomy-green)}
.iso-swatch[data-mark="blue"] path{stroke:var(--anatomy-blue)}
.iso-swatch-crease{stroke:var(--anatomy-lo)!important}
@media (max-width:560px){.iso-plate{padding:48px 12px 70px}.iso-plate-corner[data-corner="hint"]{bottom:18px}}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse]{animation:none}}
.fig { position: relative; width: 100%; height: auto; aspect-ratio: var(--ar, 1.33); max-height: var(--fig-h); min-height: 110px;
  flex: 0 1 auto; display: flex; justify-content: center; border-radius: 18px; background: #fbfbfa; overflow: hidden;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 14px 30px -18px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px rgba(${T.shadowBase},0.06);
  -webkit-tap-highlight-color: transparent; }
.fig > svg { width: 100%; height: 100%; padding: 4px; box-sizing: border-box; }
.fig.iso[data-theme="light"] { --anatomy-paper: #fbfbfa; --anatomy-lit: ${T.ink}; }
.fig [data-state="ghost"] { opacity: .16; }
.fig [data-state="off"] { opacity: 0; pointer-events: none; }
.fig [data-part] { transition: opacity .45s ease; }
.fig .is-pick { cursor: pointer; }
.fig .is-led { animation: figLed 1.3s ease-in-out infinite; }
@keyframes figLed { 0%, 100% { filter: drop-shadow(0 0 0 rgba(255,79,40,0)); } 50% { filter: drop-shadow(0 0 5px rgba(255,79,40,.95)); } }
.fig .fx-shake { animation: figShake .46s ease; }
@keyframes figShake { 0%, 100% { transform: none; } 20% { transform: translateX(-4px); } 45% { transform: translateX(4px); } 70% { transform: translateX(-2px); } }
/* Материалы: коробка html — графитовая, head — фиолетовая, body — голубая
   (цвета тегов курса, разбавленные до светлого), карточки — белая бумага. */
.fig [data-part="case"], .fig [data-part="case-near"], .fig [data-part="html-close"], .fig [data-part="lid"] {
  --anatomy-top: #f3f5f8; --anatomy-shade-0: #d0d6de; --anatomy-shade-1: #dbe0e7; --anatomy-shade-2: #e5e9ee; --anatomy-shade-3: #eef0f3; }
.fig [data-part="head"] { --anatomy-top: #f6f3fc; --anatomy-shade-0: #d6cdec; --anatomy-shade-1: #e0d9f1; --anatomy-shade-2: #e9e4f6; --anatomy-shade-3: #f1eefa; }
.fig [data-part="body"] { --anatomy-top: #eff7fb; --anatomy-shade-0: #cbdfeb; --anatomy-shade-1: #d6e7f1; --anatomy-shade-2: #e1eef5; --anatomy-shade-3: #ebf4f9; }
.fig [data-part="title-card"], .fig [data-part="page-card"], .fig [data-part="title-stray"] {
  --anatomy-top: #fff; --anatomy-shade-0: #dededb; --anatomy-shade-1: #e7e7e4; --anatomy-shade-2: #efefec; --anatomy-shade-3: #f6f6f3; }
.fig .fg-tint { opacity: .12; transition: opacity .3s; }
.fig .fg-tint[data-tag="html"] { fill: #586A83; } .fig .fg-tint[data-tag="head"] { fill: #6F57AB; } .fig .fg-tint[data-tag="body"] { fill: #1171A0; }
.fig .is-lit > .fg-tint, .fig .is-lit .fg-tint { opacity: .3; }
.fig text[data-tag="html"] { fill: #586A83; } .fig text[data-tag="head"] { fill: #6F57AB; }
.fig text[data-tag="body"] { fill: #1171A0; } .fig text[data-tag="title"] { fill: #9F4471; }
.fig text[data-font="sans"] { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; font-weight: 700; letter-spacing: 0; fill: #1d1d1f; }
.fig .fg-slot { fill: rgba(88,106,131,.06); stroke: #8a95a5; stroke-width: .9; stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; }
/* Подсветка части — цветом её тега (обводка + светлая заливка). */
.fig [data-tag="html"] .iso-solid[data-lit] > .iso-edge, .fig [data-sel="html"].is-lit .iso-edge { stroke: #586A83; }
.fig [data-tag="head"].is-lit > .iso-solid > .iso-edge, .fig [data-tag="head"] .is-lit > .iso-solid > .iso-edge { stroke: #6F57AB; }
.fig [data-tag="body"].is-lit > .iso-solid > .iso-edge, .fig [data-tag="body"] .is-lit > .iso-solid > .iso-edge { stroke: #1171A0; }
.fig [data-tag="title"].is-lit > .iso-solid > .iso-edge { stroke: #9F4471; }
.fig .is-lit > .iso-solid > .iso-edge { stroke-width: 1.6; }
.fig .is-lit > .iso-solid > .iso-top { fill: #fff; }
.fig-s1.is-lifting [data-part="lid"] { opacity: .5; }

/* ══ РАСКЛАДКИ ══════════════════════════════════════════════════════ */
.duo, .ex { display: flex; flex-direction: column; gap: var(--gap-stack); width: 100%; min-height: 0; }
.stack > .duo, .stack > .ex, .stack > .work, .stack > .fig, .stack > .lab, .stack > .final { flex: 0 1 auto; min-height: 0; }
.ex-side { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.cv-ex, .cv-pr { --cv-fs: clamp(11px, 2.9vw, 13.5px); }
.fig-mini { --fig-h: min(22dvh, 220px); }
.ex-side { position: relative; }
/* Плашка head ложится поверх страницы браузера: раскладка не прыгает. */
.note-line { position: absolute; z-index: 3; left: 8px; right: 8px; top: calc(clamp(30px, 4.6dvh, 40px) + 6px); display: flex; align-items: center; gap: 6px;
  margin: 0; padding: 6px 10px; border-radius: 10px; background: #F2EFFF; color: #4E3D86; font: 700 13px 'Manrope', sans-serif;
  box-shadow: inset 0 0 0 1.5px #6F57AB, 0 8px 18px -10px rgba(0,0,0,.35); }
.bigbtn-in { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
@media (max-width: 899px) {
  .ex > .fig { min-height: 150px; }
  .cv-ex, .cv-pr { --cv-fs: 11.5px; }
  .cv-ex .cv-line, .cv-pr .cv-line { min-height: 1.38em; }
  .ex-side .mb-page { min-height: 46px; padding: 6px 10px; }
  .ex-side .mb-doc { font-size: 15px; }
}
@media (min-width: 900px) {
  .duo { flex-direction: row; align-items: center; }
  .duo > * { flex: 1 1 50%; }
  /* Модель берёт высоту ряда (её задаёт код), а не свою: иначе на невысоком
     ноутбуке ряд переполнялся по центру и наезжал на задание и кнопки. */
  .ex { flex-direction: row; align-items: stretch; }
  .ex > .fig { flex: 1 1 54%; height: auto; max-height: none; aspect-ratio: auto; min-height: 0; }
  .ex > .cv, .ex > .ex-side { align-self: center; }
  .cv-ex .cv-line, .cv-ex .cv-tap { min-height: 22px; }
  .ex-side .mb-page { min-height: 38px; padding-block: 6px; }
  .duo > .fig { --fig-h: min(36dvh, 330px); }
  .ex > .cv, .ex > .ex-side { flex: 1 1 46%; }
  .cv-ex, .cv-pr { --cv-fs: clamp(13px, 1.2vw, 15px); }
}

/* Кнопки частей: имя тега, цветная полоса и галочка — не только цвет. */
.chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.chips { flex-wrap: nowrap; }
.chip { position: relative; display: inline-flex; align-items: center; gap: 5px; min-height: 44px; padding: 6px 10px 6px 7px; flex: 0 1 auto; min-width: 0; border: none; border-radius: 12px;
  background: #fff; color: var(--c); font: 700 14px 'JetBrains Mono', ui-monospace, monospace; cursor: pointer;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 35%, #fff), inset 4px 0 0 var(--c), 0 2px 0 rgba(${T.shadowBase},0.08); }
.chip-mark { display: grid; place-items: center; width: 16px; height: 16px; flex: none; border-radius: 6px; background: color-mix(in srgb, var(--c) 12%, #fff); color: #fff; }
.chip.is-seen .chip-mark { background: ${T.success}; }
.chip.is-sel { background: color-mix(in srgb, var(--c) 12%, #fff); box-shadow: inset 0 0 0 2.5px var(--c), 0 2px 0 rgba(${T.shadowBase},0.08); }
.chip:disabled { cursor: default; }
.ask-n { display: inline-block; min-width: 2.4em; padding: 1px 7px; border-radius: 8px; background: ${T.uiSoft}; color: ${T.uiDk};
  font-size: .78em; font-weight: 700; text-align: center; vertical-align: 2px; }

/* 3. Предсказание: браузер, код и модель. На телефоне — в колонку,
   на ноутбуке — в один ряд (рядом с Коди по высоте влезает только ряд). */
.pr3 { position: relative; display: flex; flex-direction: column; gap: var(--gap-stack); width: 100%; min-height: 0; }
.stack > .pr3 { flex: 0 1 auto; min-height: 0; }
@media (min-width: 900px) {
  .pr3 { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.15fr) minmax(0, .95fr); align-items: center; gap: 16px; }
  .pr3 > .fig-mini { --fig-h: min(30dvh, 260px); }
  .cv-pr .cv-line { min-height: 22px; }
}
/* 3. Предсказание — кнопки */
.where { display: flex; gap: 10px; justify-content: center; }
.where-b { display: inline-flex; align-items: center; gap: 8px; min-width: 132px; min-height: 52px; padding: 8px 16px; border: none; border-radius: 14px;
  background: #fff; color: ${T.ink}; font: 800 16px 'Manrope', sans-serif; cursor: pointer;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14), 0 3px 0 rgba(${T.shadowBase},0.12); }
.where-b:disabled { cursor: default; }
.where-b.is-ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
.where-b.is-miss { opacity: .55; }
.where-b.is-real { box-shadow: inset 0 0 0 2px ${T.success}; }
.where-ic { width: 22px; height: 16px; border-radius: 3px; box-shadow: inset 0 0 0 1.6px currentColor; position: relative; }
.where-tab::before { content: ''; position: absolute; left: 2px; top: 2px; width: 9px; height: 3px; border-radius: 1px; background: currentColor; }
.where-page::before { content: ''; position: absolute; left: 3px; right: 3px; top: 6px; height: 1.6px; background: currentColor; box-shadow: 0 3px 0 currentColor; }

/* 4. Сборка */
.build-row { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.pieces, .places { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.piece { position: relative; min-height: 46px; padding: 6px 12px; border: none; border-radius: 12px; background: #fff; color: var(--c); cursor: grab;
  font: 700 14px 'JetBrains Mono', ui-monospace, monospace; touch-action: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 40%, #fff), inset 0 -4px 0 color-mix(in srgb, var(--c) 18%, #fff), 0 3px 0 rgba(${T.shadowBase},0.1); }
.piece.is-sel { transform: translateY(-4px); box-shadow: inset 0 0 0 2.5px var(--c), 0 10px 18px -8px rgba(${T.shadowBase},0.45); }
.place { min-height: 40px; padding: 6px 12px; border: none; border-radius: 11px; background: transparent; color: var(--c); cursor: pointer;
  font: 700 13px 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px currentColor; opacity: .45; transition: opacity .2s, background .2s; }
.places.is-on .place:not(:disabled) { opacity: 1; background: #fff; }
.place:disabled { cursor: default; opacity: .25; }
.drag-ghost { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -120%); padding: 6px 12px; border-radius: 12px; background: #fff;
  color: var(--c); font: 700 14px 'JetBrains Mono', monospace; box-shadow: inset 0 0 0 2px var(--c), 0 12px 24px -10px rgba(0,0,0,.4); }

/* 5. Починка */
.cv-line.is-picked { background: #FCEAF2; box-shadow: inset 0 0 0 2px #9F4471; }
.gap-in { position: relative; display: inline-flex; flex: 1 1 auto; }

/* 6. Лаборатория: на телефоне — браузер или модель (переключатель), под ними
   код с полями; на компьютере — три панели. */
.lab { display: flex; flex-direction: column; gap: var(--gap-stack); width: 100%; min-height: 0; }
.lab-views { display: flex; flex-direction: column; gap: 6px; min-height: 0; }
.lab-toggle { display: flex; align-self: center; padding: 3px; border-radius: 12px; background: rgba(${T.shadowBase},0.07); }
.seg { min-height: 36px; padding: 4px 16px; border: none; border-radius: 9px; background: transparent; color: ${T.ink2}; font: 700 14px 'Manrope', sans-serif; cursor: pointer; }
.seg.is-on { background: #fff; color: ${T.ink}; box-shadow: 0 1px 3px rgba(0,0,0,.12); }
.lab-b, .lab-m { display: none; }
.lab-b.is-shown, .lab-m.is-shown { display: block; }
.fig-lab { --fig-h: min(30dvh, 300px); }
.lab-c { position: relative; display: flex; flex-direction: column; gap: 6px; }
.lab-reset { align-self: center; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 6px 14px; }
.cv-lab .tk-input { min-width: 6ch; }
@media (min-width: 900px) {
  .lab { display: grid; grid-template-columns: 1fr 1fr; align-items: center; }
  .lab-toggle { display: none; }
  .lab-b, .lab-m { display: block; }
  .fig-lab { --fig-h: min(30dvh, 300px); }
}

/* 7. Самостоятельно */
.card-float { display: flex; justify-content: center; }
.card-f { padding: 8px 14px; border-radius: 12px; background: #fff; color: var(--c); font: 700 14px 'JetBrains Mono', monospace;
  box-shadow: inset 0 0 0 2px var(--c), 0 10px 20px -12px rgba(0,0,0,.4); transform: rotate(-1.5deg); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pool { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.pool-chip { position: relative; display: inline-flex; align-items: center; min-height: 42px; padding: 4px 12px; border: none; border-radius: 11px;
  background: #fff; cursor: pointer; font: 600 var(--cv-fs) 'JetBrains Mono', ui-monospace, monospace;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.12), 0 2px 0 rgba(${T.shadowBase},0.12); }
.pool-chip:disabled { cursor: default; }
.jaws { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.opt-tag { position: relative; min-width: 104px; min-height: 52px; padding: 6px 14px; border: none; border-radius: 14px; background: #fff; cursor: pointer;
  color: ${T.ink}; font: 700 18px 'JetBrains Mono', monospace; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14), 0 3px 0 rgba(${T.shadowBase},0.12); }
.opt-tag.is-on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
.opt-tag:disabled { cursor: default; }
.ticks { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 8px; }
.tick { display: inline-flex; align-items: center; gap: 6px; min-height: 34px; padding: 4px 12px 4px 6px; border-radius: 12px; background: ${T.paper};
  color: ${T.ink}; font: 700 14px 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px ${T.success}; }
.tick-note { width: 100%; text-align: center; color: ${T.ink3}; font: 600 12px 'Manrope', sans-serif; }
.tick-m { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 7px; background: ${T.success}; color: #fff; }

/* 8. Итог */
.tk.is-found { background: #E8F6EE; box-shadow: inset 0 0 0 1.5px ${T.success}; }
.final { display: flex; flex-direction: column; gap: var(--gap-stack); align-items: stretch; }
.final-side { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.ready-stamp { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 14px; background: ${T.successSoft}; color: ${T.success}; font: 800 16px 'Manrope', sans-serif; }
.final-note { margin: 0; color: ${T.ink2}; font: 600 13px 'Manrope', sans-serif; text-align: center; }
.bye-next.next-card { width: 100%; max-width: 420px; align-self: center; background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 0 0 0 1.5px ${T.uiSoft}; }
.next-card .bye-next-ic { background: ${T.uiSoft}; color: ${T.uiDk}; border: none; }
.next-card .bye-next-t span { color: ${T.ink2}; }
.next-card .bye-next-t b { color: ${T.ink}; }
.next-tags { margin-left: auto; padding-left: 8px; color: ${T.uiDk}; font-size: 14px; font-weight: 700; }
@media (min-width: 900px) { .final { flex-direction: row; align-items: center; } .final > * { flex: 1 1 50%; } }

/* Низкие экраны и открытая клавиатура: модель уступает место заданию. */
@media (max-height: 700px) {
  .lesson-root { --fig-h: min(30dvh, 300px); }
  .ex > .fig { min-height: 132px; }
  .cv-ex .cv-line, .cv-ex .cv-tap { min-height: 1.3em; }
  .ex-side .mb-page { min-height: 38px; }
  .fig-mini { --fig-h: 16dvh; }
}
.is-kbd .fig, .is-kbd .fig-lab { --fig-h: 18dvh; }
.is-kbd .fig-mini { display: none; }
/* Клавиатура открыта: видно активное поле и результат. Строки кода без полей,
   переключатель, модель и «Вернуть пример» на время ввода уходят. */
.is-kbd .lab-toggle, .is-kbd .lab-m, .is-kbd .lab-reset { display: none !important; }
.is-kbd .lab-b { display: block !important; }
.is-kbd .cv-lab .cv-line:not(:has(input)) { display: none; }
.is-kbd .mb-top { height: 28px; }
.is-kbd .mb-page { min-height: 34px; padding: 4px 10px; }
.is-kbd .ex-s5 > .fig { display: none; }
.is-kbd .insp-h, .is-kbd .insp-r:not(.is-now) { display: none; }
.is-kbd .cv-ex { --cv-fs: 11px; padding-block: 3px; }
.is-kbd .cv-ex .cv-line { min-height: 1.22em; }
.is-kbd .ask { font-size: 15px; }
.is-kbd .cv-line.is-ctx { display: none; }
@media (prefers-reduced-motion: reduce) {
  .fig .is-led, .fig .fx-shake { animation: none; }
  .fig [data-part] { transition: none; }
}
`;
