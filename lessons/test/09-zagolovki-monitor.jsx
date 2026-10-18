// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Заголовки и текст: монитор турнира» — урок 2 курса HTML, проба
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node tools/zagolovki/zagolovki.build.mjs → lessons/test/09-zagolovki-monitor.jsx
// Правится исходник tools/zagolovki/ (zagolovki.src.jsx, zg-own.css, monitor.figures.mjs).
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
// ===== УРОК 2 · «Заголовки и текст» · модуль 1 «Основы разметки» · ТЕСТ =====
//
// ЗАМЫСЕЛ. В школьном зале турнир «Битва знаний» (игра из урока 1 с роботом
// Пикселем). Правила показывают на большом мониторе, но Коди вставил текст, и он
// слипся в комок — из зала ничего не прочитать. Ученик — веб-программист турнира:
// делает страницу читаемой — главный заголовок, разделы, абзацы, важные слова —
// и в конце добавляет на монитор свой раздел.
// Сценарий: docs/scenarij-09-zagolovki-monitor.md.
//
// ДУГА. Крючок (монитор: комок → порядок) → план → эксперимент «Enter в коде» →
// h1 → шесть уровней → разделы и подразделы по плану → закрыть </h2> → абзацы p →
// жирный b и курсив i → детектив: страница финала → строка заголовка целиком →
// свой раздел → финал на мониторе зала.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · МОНИТОР — фигура навыка anatomy (monitor.figures.mjs). Корпус нарисован при
//     сборке, экран — живой мини-браузер урока 2, развёрнутый 2D-матрицей по трём
//     углам стекла. На телефоне в рабочих экранах монитор без подставки (крупнее).
//   · ПРЕВЬЮ ЧЕСТНОЕ: строки без тегов склеиваются в одну; незакрытый заголовок или
//     <b> захватывает текст ниже; переносы строк в коде браузер не видит.
//   · ЦВЕТА ТЕГОВ — из урока 2 (h — индиго, p — морская волна, b/i — пурпур).
//   · ОЗВУЧКА: теги по-английски во всех языках (H one, P, B, I) — spokenHtml урока 2.
//   · АРТЕФАКТ: страница турнира с разделом ученика.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================

const META = {
  lessonId: 'test-html-zagolovki-monitor',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'Sarlavhalar va matn: turnir monitori',
    ru: 'Заголовки и текст: монитор турнира',
    en: 'Headings and text: the tournament monitor'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
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
  inspector: L3('Tekshiruv qoidalari', 'Правила проверки', 'Check rules'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  edit: L3('Matnni o‘zgartirish', 'Изменить текст', 'Edit the text'),
  monitor: L3('Monitor: ekranda brauzer va sahifa', 'Монитор: на экране браузер со страницей', 'A monitor showing a browser with a page'),
  updated: L3('Yangilandi', 'Обновлено', 'Updated'),
  noChange: L3('O‘zgarmadi', 'Без изменений', 'No change'),
  bold: L3('qalin', 'жирный', 'bold'),
  italic: L3('kursiv', 'курсив', 'italic'),
  plan: L3('Turnir rejasi', 'План турнира', 'Tournament plan'),
  conds: L3('Tayyor bo‘ladi, agar:', 'Готово, когда есть:', 'Done when you have:'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  power: L3('Monitorni yoqish', 'Включить монитор', 'Turn on the monitor')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА ТУРНИРА — на языке ученика. Строки коротки: на телефоне строка кода
// с тегами помещается в ширину экрана.
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  name: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  rules: L3('Qoidalar', 'Правила', 'Rules'),
  r1: L3('O‘yinda o‘nta savol bor.', 'В игре десять вопросов.', 'The game has ten questions.'),
  r2: L3('Javobga o‘ttiz soniya beriladi.', 'На ответ — тридцать секунд.', 'You get thirty seconds to answer.'),
  hints: L3('Maslahatlar', 'Подсказки', 'Hints'),
  hp: L3('Butun o‘yinga bitta maslahat.', 'Одна подсказка на всю игру.', 'One hint for the whole game.'),
  prizes: L3('Sovrinlar', 'Призы', 'Prizes'),
  zp: L3('Sovrin — «Koinot sirlari» kitobi.', 'Приз — книга «Тайны космоса».', 'The prize: the book “Secrets of Space”.'),
  // Выделения экрана «Важные слова»: b в r2, i в zp.
  fragB: L3('o‘ttiz soniya', 'тридцать секунд', 'thirty seconds'),
  fragI: L3('Koinot sirlari', 'Тайны космоса', 'Secrets of Space'),
  // Раздел «Финал» (экран «Новый раздел»): заголовок пишет ученик, абзац готов.
  final: L3('Final', 'Финал', 'Final'),
  finalP: L3('Final juma kuni aktlar zalida.', 'Финал — в пятницу в актовом зале.', 'The final is on Friday in the main hall.')
};
const P_IDS = ['name', 'rules', 'r1', 'r2', 'hints', 'hp', 'prizes', 'zp'];
const HEAD_LV = { name: 1, rules: 2, hints: 3, prizes: 2 };
const TEXT_IDS = ['r1', 'r2', 'hp', 'zp'];

// Страница финала для второго монитора — с тремя поломками (экран «Проверка»).
const FIN = {
  title: L3('Final', 'Финал', 'The Final'),
  teams: L3('Jamoalar', 'Команды', 'Teams'),
  teamsP: L3('Finalda «Boyqushlar» va «Raketalar».', 'В финале — «Совы» и «Ракеты».', 'The Owls and the Rockets play.'),
  when: L3('Qachon', 'Когда', 'When'),
  whenPre: L3('Boshlanish ', 'Начало в ', 'Starts on '),
  whenB: L3('jumada', 'пятницу', 'Friday'),
  whenPost: L3(', soat to‘rtda.', ' в четыре часа.', ' at four.'),
  free: L3('Muxlislar uchun kirish bepul.', 'Для болельщиков вход свободный.', 'Entry is free for fans.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики героя звучат; подписи печатаются.
// Реплика Коди — 1–2 коротких предложения, начинается с живого слова (эмоция
// голоса). Похвала — эмоция и что получилось (pohvala.md).
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Turnir', 'Турнир', 'The tournament'),
    cast: [
      { pose: 'hello', text: L3('Salom! Bugun maktab zalida «Bilimlar jangi» turniri. Qoidalarni katta monitorda ko‘rsatamiz.',
        'Привет! Сегодня в школьном зале турнир «Битва знаний». Правила покажем на большом мониторе.',
        'Hi! Today the school hall hosts the Battle of Knowledge tournament. We’ll show the rules on the big monitor.') },
      { pose: 'point', text: L3('Monitorni yoqing.', 'Включи монитор.', 'Turn the monitor on.') }
    ],
    ask: L3('Monitorni yoqing', 'Включи монитор', 'Turn the monitor on'),
    lump: L3('Iya! Men qoidalarni joylab qo‘ydim, ular esa bitta bo‘lakka yopishib qolibdi. Zaldan buni hech kim o‘qiy olmaydi.',
      'Ой! Я вставил правила, а они слиплись в один комок. Из зала такое никто не прочитает.',
      'Oops! I pasted the rules, and they stuck together in one lump. Nobody in the hall can read that.'),
    askFix: L3('«Tartibga keltirish»ni bosing', 'Нажми «Навести порядок»', 'Tap “Tidy up”'),
    fixBtn: L3('Tartibga keltirish', 'Навести порядок', 'Tidy up'),
    done: L3('Voy! Nom oxirgi qatordan ham ko‘rinadi, bo‘limlar bir qarashda topiladi. Dars oxirida buni o‘zingiz qila olasiz.',
      'Ого! Название видно даже с последнего ряда, разделы находятся с одного взгляда. К концу урока у тебя получится так же.',
      'Whoa! The name is visible even from the back row, and the sections are found at a glance. By the end of the lesson, you’ll do this yourself.'),
    askDone: L3('Sahifa tartibga keldi', 'Страница в порядке', 'The page is tidy')
  },

  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Sahifani zal uchun tayyorlaymiz. Mana reja.', 'Готовим страницу для зала. Вот план.', 'Let’s get the page ready for the hall. Here’s the plan.'),
    steps: [
      { icon: 'textSize', text: L3('Zaldan ko‘rinadigan katta nom', 'Огромное название — видно из зала', 'A huge name you can see from the hall'),
        say: L3('Avval nomni shunday kattalashtiramizki, uni oxirgi qatordan ham o‘qish mumkin bo‘lsin.', 'Сначала сделаем название таким крупным, чтобы его читали с последнего ряда.', 'First we’ll make the name big enough to read from the back row.') },
      { icon: 'listN', text: L3('Bo‘limlar va kichik bo‘limlar', 'Разделы и подразделы', 'Sections and subsections'),
        say: L3('Keyin qoidalarni bo‘limlarga ajratamiz — kerakli joy bir qarashda topiladi.', 'Потом разложим правила по разделам — нужное найдётся с одного взгляда.', 'Then we’ll split the rules into sections, so anything can be found at a glance.') },
      { icon: 'doc', text: L3('Matn — bo‘lak-bo‘lak', 'Текст — по кусочкам', 'Text in neat pieces'),
        say: L3('Matnni alohida bo‘laklarga bo‘lamiz, shunda u yopishib qolmaydi.', 'Разделим текст на отдельные кусочки, чтобы он не слипался.', 'We’ll cut the text into separate pieces so it doesn’t stick together.') },
      { icon: 'bold', text: L3('Muhim so‘zlar ko‘zga tashlanadi', 'Важные слова — заметнее', 'Important words stand out'),
        say: L3('Eng muhim so‘zlarni ajratib ko‘rsatamiz.', 'Выделим самые важные слова.', 'We’ll make the most important words stand out.') },
      { icon: 'screen', text: L3('Monitorda o‘z bo‘limingiz', 'Свой раздел на мониторе', 'Your own section on the monitor'),
        say: L3('Oxirida monitorga o‘z bo‘limingizni qo‘shasiz.', 'А в конце добавишь на монитор свой раздел.', 'And at the end you’ll add your own section to the monitor.') }
    ],
    done: L3('Boshladik!', 'Поехали!', 'Let’s go!')
  },

  s3: {
    eyebrow: L3('Tajriba', 'Эксперимент', 'Experiment'),
    say: L3('Kodda har bir qator alohida, monitorda esa — bitta bo‘lak. Balki qatorlarga joy torlik qilayotgandir? Enter tugmasini bosib, ularni suring.',
      'В коде каждая строка отдельно, а на мониторе комок. Может, строкам тесно? Нажми Enter и раздвинь их.',
      'In the code every line is separate, but the monitor shows a lump. Maybe the lines are too cramped? Press Enter to spread them out.'),
    ask: L3('Enter tugmasini bosing — qatorlarni suring', 'Нажми Enter — раздвинь строки', 'Press Enter to spread the lines'),
    same: L3('Qarang: kodda qatorlar ajraldi, monitorda esa hech narsa o‘zgarmadi. Brauzer qator ko‘chishini ko‘rmaydi va matnni yopishtiradi. Qayerda sarlavha, qayerda oddiy matn ekanini unga teglar aytadi.',
      'Смотри: в коде строки разошлись, а на мониторе ничего не изменилось. Браузер не видит переносов строк и склеивает текст. Где заголовок, а где обычный текст, ему говорят теги.',
      'Look: the lines in the code moved apart, but nothing changed on the monitor. The browser ignores line breaks and glues the text together. Tags tell it where a heading is and where plain text is.'),
    askDone: L3('Brauzer qator ko‘chishini ko‘rmaydi', 'Браузер не видит переносов строк', 'The browser ignores line breaks')
  },

  s4: {
    eyebrow: L3('Bosh sarlavha', 'Главный заголовок', 'Main heading'),
    say: L3('Nomdan boshlaymiz. Kodda o‘yin nomi yozilgan qatorni bosing.', 'Начнём с названия. Нажми в коде строку с названием игры.', 'Let’s start with the name. Tap the line with the game’s name in the code.'),
    ask: L3('Kodda «{n}» qatorini bosing', 'Нажми в коде строку «{n}»', 'Tap the “{n}” line in the code'),
    miss: L3('Bu qoidalar matni. O‘yin nomi — birinchi qatorda.', 'Это текст правил. Название игры — в первой строке.', 'That’s rules text. The game’s name is the first line.'),
    done: L3('Zo‘r! Bu <h1> tegi — bosh sarlavha, inglizcha heading so‘zidan. Brauzer uni eng katta qilib ko‘rsatadi va sahifada u bitta bo‘ladi.',
      'Есть! Это тег <h1> — главный заголовок, от английского heading. Браузер рисует его самым крупным, и на странице он один.',
      'Yes! That’s the <h1> tag: the main heading, from the word heading. The browser shows it the biggest, and a page has only one.'),
    askDone: L3('Nom — bosh sarlavha h1', 'Название — главный заголовок h1', 'The name is the main heading, h1')
  },

  s5: {
    eyebrow: L3('Sarlavha darajalari', 'Уровни заголовков', 'Heading levels'),
    say: L3('Sarlavha raqami birdan oltigacha bo‘ladi. «Qoidalar» uchun har bir raqamni sinab ko‘ring.',
      'Цифра у заголовка бывает от одного до шести. Попробуй каждую цифру у «Правил».',
      'A heading’s number goes from one to six. Try every number on Rules.'),
    ask: L3('«Qoidalar» uchun h1 dan h6 gacha sinab ko‘ring', 'Попробуй у «Правил» все цифры от h1 до h6', 'Try every number from h1 to h6 on “Rules”'),
    done: L3('Tushunarli! Raqam — muhimlik darajasi: bir — eng asosiysi, olti — eng kichigi. Darajani o‘lchamiga qarab emas, ma’nosiga qarab tanlaymiz.',
      'Ясно! Цифра — это уровень важности: один — самый главный, шесть — самый мелкий. Уровень выбирают по смыслу, а не по размеру.',
      'Got it! The number is the level of importance: one is the main one, six is the smallest. We choose the level by meaning, not by size.'),
    askDone: L3('Raqam — muhimlik darajasi', 'Цифра — уровень важности', 'The number is the level of importance')
  },

  s6: {
    eyebrow: L3('Bo‘limlar', 'Разделы и подразделы', 'Sections'),
    say: L3('Mana turnir rejasi. Bo‘limlar nom ostida turadi, kichik bo‘lim esa bo‘lim ichida. Har bir sarlavhaga daraja tanlang.',
      'Вот план турнира. Разделы стоят под названием, а подраздел — внутри раздела. Выбери уровень каждому заголовку.',
      'Here’s the tournament plan. Sections sit under the name, and a subsection sits inside a section. Choose a level for each heading.'),
    ask: L3('«{x}» uchun darajani tanlang', 'Выбери уровень для «{x}»', 'Choose a level for “{x}”'),
    wrong: {
      h1: L3('h1 allaqachon bor — bu o‘yin nomi. Bosh sarlavha sahifada bitta.', 'h1 уже есть — это название игры. Главный заголовок на странице один.', 'There’s already an h1: the game’s name. A page has only one main heading.'),
      sec: L3('Bu bo‘lim, u to‘g‘ridan-to‘g‘ri nom ostida turadi. Rejaga qarang.', 'Это раздел, он стоит прямо под названием. Посмотри на план.', 'This is a section: it sits right under the name. Look at the plan.'),
      sub: L3('Bu «Qoidalar» ichidagi kichik bo‘lim. U bir pog‘ona pastroq.', 'Это подраздел внутри «Правил». Он на ступеньку ниже.', 'This is a subsection inside Rules. It’s one step lower.'),
      deep: L3('Bunchalik mayda kerak emas: rejada atigi uch pog‘ona bor.', 'Так мелко не нужно: в плане всего три ступеньки.', 'No need to go that small: the plan has only three steps.')
    },
    hints: [
      L3('Rejaga qarang: bu sarlavha qaysi pog‘onada?', 'Посмотри на план: на какой ступеньке этот заголовок?', 'Look at the plan: which step is this heading on?'),
      L3('Nom — h1, bo‘limlar — h2, ularning ichidagi qismlar — h3.', 'Название — h1, разделы — h2, их части — h3.', 'The name is h1, sections are h2, their parts are h3.'),
      L3('Bu sarlavha uchun {lv} ni bosing.', 'Для этого заголовка нажми {lv}.', 'For this heading, tap {lv}.')
    ],
    done: L3('Qoyil, chiqdi! Endi sahifa rejasi aniq: bo‘limlar — h2, kichik bo‘lim — h3.',
      'Вот это да, получилось! Теперь план страницы как на ладони: разделы — h2, подраздел — h3.',
      'Look at that, it works! The page plan is crystal clear now: sections are h2, the subsection is h3.'),
    askDone: L3('Bo‘limlar — h2, kichik bo‘lim — h3', 'Разделы — h2, подраздел — h3', 'Sections are h2, the subsection is h3')
  },

  s7: {
    eyebrow: L3('Yopuvchi teg', 'Закрывающий тег', 'Closing tag'),
    say: L3('Iya, men «Sovrinlar» sarlavhasini yopishni unutibman! Undan keyingi hamma narsa ham ulkan bo‘lib ketdi. Yopuvchi tegni yozing.',
      'Ой, я забыл закрыть заголовок «Призы»! И всё, что после него, тоже стало огромным. Набери закрывающий тег.',
      'Oops, I forgot to close the Prizes heading! Everything after it got huge too. Type the closing tag.'),
    ask: L3('«{x}» dan keyin </h2> ni yozing', 'Набери </h2> после «{x}»', 'Type </h2> after “{x}”'),
    msgs: {
      needSlash: L3('Deyarli! Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Почти! Это открывающий тег. В закрывающем есть косая черта.', 'Almost! That’s an opening tag. A closing tag has a slash.'),
      needLt: L3('Teg burchakli qavs bilan boshlanadi.', 'Тег начинается с уголка.', 'A tag starts with a bracket.'),
      needGt: L3('Oxirida burchakli qavs yetishmayapti.', 'В конце не хватает уголка.', 'The bracket at the end is missing.'),
      wrongName: L3('Nomi ochuvchi teg bilan bir xil bo‘lsin: {tag}.', 'Имя должно совпадать с открывающим: {tag}.', 'The name must match the opening tag: {tag}.'),
      generic: L3('Yopuvchi teg shunday yig‘iladi: burchak, qiya chiziq, nom, burchak.', 'Закрывающий тег собирается так: уголок, косая черта, имя, уголок.', 'A closing tag goes: bracket, slash, name, bracket.')
    },
    hints: [
      L3('Brauzerga sarlavha qayerda tugashini ayting.', 'Скажи браузеру, где заголовок кончается.', 'Tell the browser where the heading ends.'),
      L3('Yopuvchi teg ochuvchiga o‘xshaydi, faqat qiya chiziq bilan.', 'Закрывающий тег — как открывающий, только с косой чертой.', 'A closing tag looks like the opening one, plus a slash.'),
      L3('Yozing: </h2>', 'Набери: </h2>', 'Type: </h2>')
    ],
    done: L3('Zo‘r-ku! Sarlavha yopildi — matn yana oddiy bo‘ldi.', 'Огонь! Заголовок закрыт — текст снова обычный.', 'Awesome! The heading is closed and the text is normal again.'),
    askDone: L3('Sarlavha yopildi', 'Заголовок закрыт', 'The heading is closed')
  },

  s8: {
    eyebrow: L3('Xatboshilar', 'Абзацы', 'Paragraphs'),
    say: L3('«Qoidalar» ostidagi ikki gap bitta qatorga yopishib qoldi. Kodda birinchi gapni bosing.',
      'Две фразы под «Правилами» слиплись в одну строку. Нажми в коде первую фразу.',
      'Two sentences under Rules stuck together on one line. Tap the first sentence in the code.'),
    ask1: L3('Kodda birinchi gapni bosing', 'Нажми в коде первую фразу', 'Tap the first sentence in the code'),
    ask2: L3('Endi ikkinchi gapni bosing', 'Теперь нажми вторую фразу', 'Now tap the second sentence'),
    first: L3('Ana! Bu <p> tegi — xatboshi, bitta fikr haqidagi matn bo‘lagi. Endi ikkinchi gapni bosing.',
      'Есть! Это тег <p> — абзац, кусок текста об одном. Теперь нажми вторую фразу.',
      'Yes! That’s the <p> tag: a paragraph, a piece of text about one thing. Now tap the second sentence.'),
    done: L3('Klass! Har bir gap — o‘z xatboshisida. Qolgan matnni men ham <p> ga o‘rab qo‘ydim.',
      'Класс! У каждой фразы свой абзац. Остальной текст я тоже обернул в <p>.',
      'Cool! Each sentence has its own paragraph. I wrapped the rest of the text in <p> too.'),
    askDone: L3('Har bir matn bo‘lagi — o‘z p ichida', 'Каждый кусок текста — в своём p', 'Every piece of text is in its own p')
  },

  s9: {
    eyebrow: L3('Muhim so‘zlar', 'Важные слова', 'Important words'),
    say: L3('Eng muhimini ajratamiz. Kerakli so‘zlarni bosing, keyin tegni tanlang.', 'Выделим самое важное. Нажми нужные слова, потом выбери тег.', 'Let’s highlight what matters most. Tap the words, then choose a tag.'),
    goals: {
      b: L3('Qalin qiling: «{f}»', 'Сделай жирным: «{f}»', 'Make bold: “{f}”'),
      i: L3('Kitob nomini kursiv qiling', 'Название книги — курсивом', 'Put the book title in italics')
    },
    askSel: L3('Birinchi va oxirgi so‘zni bosing', 'Нажми первое и последнее слово', 'Tap the first and the last word'),
    askTag: L3('Endi tegni tanlang', 'Теперь выбери тег', 'Now choose a tag'),
    wrongSel: L3('Deyarli! Faqat «{f}» so‘zlarini belgilang.', 'Почти! Выдели только «{f}».', 'Almost! Select only “{f}”.'),
    wrongTag: {
      b: L3('Bu kursiv bo‘ladi. Qalin uchun — <b>.', 'Это будет курсив. Для жирного — <b>.', 'That would be italics. For bold, use <b>.'),
      i: L3('Bu qalin bo‘ladi. Kursiv uchun — <i>.', 'Это будет жирный. Для курсива — <i>.', 'That would be bold. For italics, use <i>.')
    },
    noSel: L3('Avval so‘zlarni belgilang.', 'Сначала выдели слова.', 'Select the words first.'),
    hints3: L3('Belgilangan so‘zlarni bosing.', 'Нажми отмеченные слова.', 'Tap the marked words.'),
    okB: L3('Klass! <b> tegi so‘zlarni qalin qiladi. Endi kitob nomi.', 'Класс! Тег <b> делает слова жирными. Теперь название книги.', 'Cool! The <b> tag makes words bold. Now the book title.'),
    done: L3('Super! <i> tegi matnni qiya qiladi — bu kursiv. Muhim narsa endi darhol ko‘rinadi.',
      'Супер! Тег <i> делает текст наклонным — это курсив. Важное теперь видно сразу.',
      'Super! The <i> tag slants the text: that’s italics. The important stuff stands out now.'),
    askDone: L3('Qalin — b, kursiv — i', 'Жирный — b, курсив — i', 'Bold is b, italics is i')
  },

  s10: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3('Men sport zalidagi ikkinchi monitor uchun final sahifasini yasadim. Unda uchta buzilish yashiringan. Buzilgan qatorni bosing.',
      'Я сделал страницу финала для второго монитора, в спортзале. В ней спрятались три поломки. Нажми строку с поломкой.',
      'I made the final’s page for the second monitor, in the gym. Three bugs are hiding in it. Tap a line with a bug.'),
    ask: L3('Buzilgan qatorni bosing', 'Нажми строку с поломкой', 'Tap a line with a bug'),
    askFix: L3('Qanday tuzatamiz?', 'Как исправить?', 'How do we fix it?'),
    rules: {
      one: L3('Bosh sarlavha h1 — bitta', 'Главный заголовок h1 — один', 'Only one main heading h1'),
      closed: L3('Ochilgan teg yopilgan', 'Открытый тег закрыт', 'Every opened tag is closed'),
      para: L3('Oddiy matn — p ichida', 'Обычный текст — в абзаце p', 'Plain text goes in a paragraph p')
    },
    bugs: {
      one: {
        found: L3('Topildi! Bu ikkinchi h1, bosh sarlavha esa bitta bo‘lishi kerak.', 'Есть! Это второй h1, а главный заголовок должен быть один.', 'Got it! That’s a second h1, but there must be only one main heading.'),
        bad: L3('«Jamoalar» — bo‘lim sarlavhasi, oddiy matn emas.', '«Команды» — заголовок раздела, а не обычный текст.', 'Teams is a section heading, not plain text.')
      },
      closed: {
        found: L3('Ana! <b> ochilgan, lekin yopilmagan — shuning uchun pastdagi hamma narsa qalin.', 'Вот! <b> открыт, но не закрыт — поэтому всё ниже жирное.', 'There! <b> is opened but never closed, so everything below is bold.'),
        bad: L3('Unda butun sahifa qalin bo‘lib qoladi. Faqat bitta so‘z qalin bo‘lishi kerak.', 'Тогда жирной останется вся страница. Жирным должно быть одно слово.', 'Then the whole page stays bold. Only one word should be bold.')
      },
      para: {
        found: L3('Topildi! Bu oddiy gap, lekin u sarlavhaga o‘ralgan — shuning uchun ulkan.', 'Нашлась! Это обычная фраза, но она в заголовке — вот и огромная.', 'Found it! It’s a plain sentence wrapped in a heading, so it’s huge.'),
        bad: L3('h3 ham sarlavha. Oddiy gap xatboshida yashaydi.', 'h3 — тоже заголовок. Обычная фраза живёт в абзаце.', 'h3 is a heading too. A plain sentence lives in a paragraph.')
      }
    },
    fixes: {
      one: [{ id: 'h2', ok: true, label: L3('h2 qilish', 'Сделать h2', 'Make it h2') }, { id: 'p', label: L3('p qilish', 'Сделать p', 'Make it p') }],
      closed: [{ id: 'end', label: L3('</b> eng oxirida', '</b> в самом конце', '</b> at the very end') }, { id: 'after', ok: true, label: L3('</b> so‘zdan keyin', '</b> после слова', '</b> after the word') }],
      para: [{ id: 'h3', label: L3('h3 qilish', 'Сделать h3', 'Make it h3') }, { id: 'p', ok: true, label: L3('p qilish', 'Сделать p', 'Make it p') }]
    },
    fixed: L3('Aniq! Qoida bajarildi.', 'Чётко! Правило выполнено.', 'Spot on! The rule is met.'),
    fine: L3('Bu qator joyida. Qoidalarga qarang: qaysi biri bajarilmagan?', 'Эта строка в порядке. Посмотри на правила: какое не выполнено?', 'This line is fine. Look at the rules: which one isn’t met?'),
    hints: [
      L3('Monitorga qarang: qayer g‘alati ko‘rinadi?', 'Посмотри на монитор: что выглядит странно?', 'Look at the monitor: what looks odd?'),
      L3('Ro‘yxatdagi birinchi bajarilmagan qoidani o‘qing.', 'Прочитай первое невыполненное правило в списке.', 'Read the first rule in the list that isn’t met.'),
      L3('Belgilangan qatorni bosing.', 'Нажми отмеченную строку.', 'Tap the marked line.')
    ],
    done: L3('Uchala buzilish tuzatildi! Xuddi haqiqiy veb-dasturchi kabi!', 'Все три поломки исправлены! Уже как настоящий веб-программист!', 'All three bugs fixed! Like a real web developer!'),
    askDone: L3('Sahifa qoidalarga mos', 'Страница по правилам', 'The page follows the rules')
  },

  s11: {
    eyebrow: L3('Yangi bo‘lim', 'Новый раздел', 'New section'),
    say: L3('Tashkilotchilar asosiy monitorga «Final» bo‘limini qo‘shishni so‘rashdi. Matni tayyor. Bo‘lim sarlavhasi qatorini to‘liq yozing.',
      'Организаторы просят добавить на главный монитор раздел «Финал». Текст уже есть. Напиши строку заголовка раздела целиком.',
      'The organisers want a Final section on the main monitor. The text is ready. Write the whole heading line for the section.'),
    ask: L3('«{f}» bo‘limi sarlavhasini yozing — «{x}» kabi', 'Напиши заголовок раздела «{f}» — как у «{x}»', 'Write the heading of the “{f}” section, like “{x}”'),
    msgs: {
      empty: L3('Avval qatorni yozing.', 'Сначала напиши строку.', 'Write the line first.'),
      noTag: L3('Brauzer buni oddiy matn deb ko‘radi. Sarlavhaga teg kerak.', 'Браузер видит просто текст. Заголовку нужен тег.', 'The browser sees plain text. A heading needs a tag.'),
      h1: L3('h1 allaqachon bor — bu o‘yin nomi. Bo‘lim bir pog‘ona pastroq.', 'h1 уже есть — это название игры. Раздел на ступеньку ниже.', 'There’s already an h1: the game’s name. A section is one step lower.'),
      deep: L3('Bu kichik bo‘lim darajasi. «Final» esa «Sovrinlar» kabi bo‘lim.', 'Это уровень подраздела. А «Финал» — раздел, как «Призы».', 'That’s a subsection level. Final is a section, like Prizes.'),
      p: L3('<p> — xatboshi uchun. Bo‘lim nomiga sarlavha kerak.', '<p> — для абзаца. Названию раздела нужен заголовок.', '<p> is for paragraphs. A section name needs a heading.'),
      other: L3('Bu teg sarlavha emas. «Sovrinlar» qanday yozilganiga qarang.', 'Это не тег заголовка. Посмотри, как записаны «Призы».', 'That isn’t a heading tag. Look at how Prizes is written.'),
      noText: L3('Teglar orasiga bo‘lim nomini yozing.', 'Между тегами напиши название раздела.', 'Write the section name between the tags.'),
      noClose: L3('Deyarli! Oxirida yopuvchi teg yetishmayapti.', 'Почти! В конце не хватает закрывающего тега.', 'Almost! The closing tag is missing at the end.'),
      noSlash: L3('Yopuvchi tegda qiya chiziq bo‘lishi kerak.', 'В закрывающем теге нужна косая черта.', 'The closing tag needs a slash.'),
      mismatch: L3('Yopuvchi teg ochuvchisi bilan bir xil bo‘lishi kerak.', 'Закрывающий тег должен совпадать с открывающим.', 'The closing tag must match the opening one.')
    },
    hints: [
      L3('«Sovrinlar» qanday yozilganiga qarang.', 'Посмотри, как записаны «Призы».', 'Look at how Prizes is written.'),
      L3('Bo‘lim — h2. Ochuvchi teg, nom, yopuvchi teg.', 'Раздел — h2. Открывающий тег, название, закрывающий тег.', 'A section is h2: opening tag, name, closing tag.'),
      L3('Yozing: <h2>Final</h2>', 'Напиши: <h2>Финал</h2>', 'Type: <h2>Final</h2>')
    ],
    ph: L3('qatorni shu yerga yozing', 'пиши строку здесь', 'type the line here'),
    done: L3('Ishlayapti! Qarang, qanday chiroyli — yangi bo‘lim monitorda.', 'Работает! Смотри, как красиво — новый раздел уже на мониторе.', 'It works! Look how cool: the new section is on the monitor.'),
    askDone: L3('Yangi bo‘lim monitorda', 'Новый раздел на мониторе', 'The new section is on the monitor')
  },

  s12: {
    eyebrow: L3('O‘z bo‘limingiz', 'Свой раздел', 'Your section'),
    say: L3('Tashkilotchilar monitordan sizga joy berishdi! O‘yinchilar uchun o‘z bo‘limingizni yozing: maslahat, tabrik yoki qiziq fakt.',
      'Организаторы дали тебе место на мониторе! Напиши свой раздел для игроков: совет, приветствие или интересный факт.',
      'The organisers gave you space on the monitor! Write your own section for the players: a tip, a greeting or a fun fact.'),
    conds: {
      head: L3('Bo‘lim sarlavhasi', 'Заголовок раздела', 'A section heading'),
      text: L3('Xatboshi matni', 'Текст абзаца', 'A paragraph of text'),
      bold: L3('Bitta so‘z qalin', 'Одно слово жирным', 'One word in bold')
    },
    askHead: L3('<h2> ichiga bo‘lim nomini yozing', 'Напиши название раздела внутри <h2>', 'Write the section name inside <h2>'),
    askText: L3('<p> ichiga matn yozing', 'Напиши текст внутри <p>', 'Write the text inside <p>'),
    askBold: L3('Xatboshingizdagi muhim so‘zni bosing', 'Нажми важное слово в своём абзаце', 'Tap an important word in your paragraph'),
    phHead: L3('Masalan: Jamoaga maslahat', 'Например: Совет команде', 'For example: A tip for teams'),
    phText: L3('Masalan: Javobdan oldin maslahatlashing.', 'Например: Перед ответом посоветуйтесь.', 'For example: Talk it over before you answer.'),
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no brackets.'),
    short: L3('Biroz ko‘proq yozing — kamida ikki so‘z.', 'Напиши чуть больше — хотя бы два слова.', 'Write a bit more: at least two words.'),
    empty: L3('Bu yerga bo‘lim nomini yozing.', 'Напиши здесь название раздела.', 'Write the section name here.'),
    done: L3('Bu kuchli bo‘ldi! Bo‘limingiz zal monitorida — o‘yinchilar uni o‘qiydi.', 'Это было мощно! Твой раздел на мониторе зала — игроки его прочитают.', 'That was epic! Your section is on the hall monitor, and the players will read it.'),
    askDone: L3('Bo‘limingiz monitorda', 'Твой раздел на мониторе', 'Your section is on the monitor')
  },

  s13: {
    eyebrow: L3('Zal monitorida', 'На мониторе зала', 'On the hall monitor'),
    say: L3('Turnir boshlanmoqda! Sahifa zal monitorida: katta nom, bo‘limlar, xatboshilar va sizning bo‘limingiz. Xuddi haqiqiy veb-dasturchi kabi!',
      'Турнир начинается! Страница на мониторе зала: огромное название, разделы, абзацы и твой раздел. Уже как настоящий веб-программист!',
      'The tournament is starting! The page is on the hall monitor: a huge name, sections, paragraphs and your own section. Like a real web developer!'),
    ach: {
      levels: { self: L3('Sarlavha darajalarini maslahatsiz tanladingiz', 'Уровни заголовков — выбраны без подсказок', 'Chose heading levels on your own'),
        help: L3('Sarlavha darajalarini tanladingiz', 'Уровни заголовков — выбраны', 'Chose heading levels') },
      close: { self: L3('</h2> ni yozdingiz', 'Закрывающий </h2> — написан', 'Wrote the closing </h2>'),
        help: L3('</h2> ni maslahat bilan yozdingiz', 'Закрывающий </h2> — написан с подсказкой', 'Wrote </h2> with a hint') },
      fix: { self: L3('Uchta buzilishni maslahatsiz tuzatdingiz', 'Три поломки — исправлены без подсказок', 'Fixed three bugs on your own'),
        help: L3('Uchta buzilishni tuzatdingiz', 'Три поломки — исправлены', 'Fixed three bugs') },
      write: { self: L3('Sarlavha qatorini to‘liq yozdingiz', 'Строка заголовка — написана целиком', 'Wrote a whole heading line'),
        help: L3('Sarlavha qatorini maslahat bilan yozdingiz', 'Строка заголовка — написана с подсказкой', 'Wrote a heading line with a hint') },
      own: { self: L3('Monitorga o‘z bo‘limingizni qo‘shdingiz', 'Свой раздел — на мониторе', 'Added your own section to the monitor'),
        help: L3('Monitorga o‘z bo‘limingizni qo‘shdingiz', 'Свой раздел — на мониторе', 'Added your own section to the monitor') }
    },
    next: L3('Ro‘yxatlar: punktlar va raqamlar', 'Списки: пункты и номера', 'Lists: bullets and numbers'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
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

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2
// ═════════════════════════════════════════════════════════════════════════════
Object.assign(SPOKEN, { cast: 1, lump: 1, same: 1, miss: 1, first: 1, msgs: 1, wrong: 1, bugs: 1, fine: 1, fixed: 1,
  wrongSel: 1, wrongTag: 1, noSel: 1, hints3: 1, okB: 1, short: 1, noTags: 1, empty: 1 });
Object.assign(NOT_SPOKEN_IN, { bugs: { fixes: 1 } });

const MON = {"svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg fg-monitor\" viewBox=\"0 0 520 420\" role=\"img\" aria-label=\"Монитор на подставке. На экране — браузер со страницей.\"><path class=\"iso-halo\" d=\"M172.8 379.3L172.9 377.7L174.3 376.1L182.8 369.3L185.3 367.8L188.9 366.5L193.4 365.4L198.6 364.5L204.4 364L210.5 363.7L216.7 363.7L222.8 364.1L335.8 373.6L341.5 374.2L346.6 375.1L350.9 376.3L354.2 377.6L356.5 379.1L357.6 380.7L357.6 392.2L357.5 393.8L356.1 395.4L347.6 402.2L345.1 403.7L341.5 405L337 406.1L331.8 407L326 407.6L319.9 407.8L313.7 407.8L307.6 407.5L194.6 398L188.9 397.3L183.8 396.4L179.5 395.2L176.2 393.9L173.9 392.4L172.8 390.8Z\"/><g data-paint=\"base\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M170.4 385.9L170.9 384.7L172 383.6L180.6 376.8L182.2 375.7L184.4 374.7L187.1 373.8L190.2 373L193.7 372.2L197.5 371.7L201.6 371.2L205.9 370.9L210.3 370.7L214.8 370.7L219.2 370.8L223.5 371.1L336.5 380.6L340.7 381.1L344.6 381.6L348.1 382.3L351.3 383.1L354.1 384L356.3 385L358.1 386.1L359.3 387.2L360 388.3L360 389.5L360 393.3L359.5 394.4L358.4 395.6L349.8 402.4L348.2 403.5L346 404.5L343.3 405.4L340.2 406.2L336.7 406.9L332.9 407.5L328.8 408L324.5 408.3L320.1 408.5L315.6 408.5L311.2 408.3L306.9 408.1L193.9 398.5L189.7 398.1L185.9 397.6L182.3 396.9L179.1 396.1L176.3 395.2L174.1 394.2L172.3 393.1L171.1 392L170.4 390.9L170.4 389.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M360 393.3L359.5 394.4L359.5 390.6L360 389.5ZM359.5 394.4L358.4 395.6L358.4 391.7L359.5 390.6ZM358.4 395.6L349.8 402.4L349.8 398.6L358.4 391.7ZM349.8 402.4L348.2 403.5L348.2 399.6L349.8 398.6ZM348.2 403.5L346 404.5L346 400.6L348.2 399.6ZM346 404.5L343.3 405.4L343.3 401.6L346 400.6ZM343.3 405.4L340.2 406.2L340.2 402.4L343.3 401.6ZM340.2 406.2L336.7 406.9L336.7 403.1L340.2 402.4ZM336.7 406.9L332.9 407.5L332.9 403.7L336.7 403.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M332.9 407.5L328.8 408L328.8 404.2L332.9 403.7ZM328.8 408L324.5 408.3L324.5 404.5L328.8 404.2ZM324.5 408.3L320.1 408.5L320.1 404.6L324.5 404.5ZM320.1 408.5L315.6 408.5L315.6 404.6L320.1 404.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M315.6 408.5L311.2 408.3L311.2 404.5L315.6 404.6ZM311.2 408.3L306.9 408.1L306.9 404.2L311.2 404.5ZM306.9 408.1L193.9 398.5L193.9 394.7L306.9 404.2ZM193.9 398.5L189.7 398.1L189.7 394.3L193.9 394.7ZM189.7 398.1L185.9 397.6L185.9 393.7L189.7 394.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M185.9 397.6L182.3 396.9L182.3 393L185.9 393.7ZM182.3 396.9L179.1 396.1L179.1 392.2L182.3 393ZM179.1 396.1L176.3 395.2L176.3 391.3L179.1 392.2ZM176.3 395.2L174.1 394.2L174.1 390.3L176.3 391.3ZM174.1 394.2L172.3 393.1L172.3 389.3L174.1 390.3ZM172.3 393.1L171.1 392L171.1 388.2L172.3 389.3ZM171.1 392L170.4 390.9L170.4 387L171.1 388.2ZM170.4 390.9L170.4 389.7L170.4 385.9L170.4 387Z\"/><path class=\"iso-top\" d=\"M336.5 380.6L340.7 381.1L344.6 381.6L348.1 382.3L351.3 383.1L354.1 384L356.3 385L358.1 386.1L359.3 387.2L360 388.3L360 389.5L359.5 390.6L358.4 391.7L349.8 398.6L348.2 399.6L346 400.6L343.3 401.6L340.2 402.4L336.7 403.1L332.9 403.7L328.8 404.2L324.5 404.5L320.1 404.6L315.6 404.6L311.2 404.5L306.9 404.2L193.9 394.7L189.7 394.3L185.9 393.7L182.3 393L179.1 392.2L176.3 391.3L174.1 390.3L172.3 389.3L171.1 388.2L170.4 387L170.4 385.9L170.9 384.7L172 383.6L180.6 376.8L182.2 375.7L184.4 374.7L187.1 373.8L190.2 373L193.7 372.2L197.5 371.7L201.6 371.2L205.9 370.9L210.3 370.7L214.8 370.7L219.2 370.8L223.5 371.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M360 389.5L359.5 390.6L358.4 391.7L349.8 398.6L348.2 399.6L346 400.6L343.3 401.6L340.2 402.4L336.7 403.1L332.9 403.7L328.8 404.2L324.5 404.5L320.1 404.6L315.6 404.6L311.2 404.5L306.9 404.2L193.9 394.7L189.7 394.3L185.9 393.7L182.3 393L179.1 392.2L176.3 391.3L174.1 390.3L172.3 389.3L171.1 388.2L170.4 387L170.4 385.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M360 389.5L358.3 390.6L357.3 391.7L348.7 398.5L347.1 399.5L345 400.5L342.4 401.4L339.4 402.2L336.1 402.9L332.4 403.4L328.4 403.9L324.3 404.2L320 404.3L315.7 404.3L311.4 404.2L307.2 403.9L194.3 394.4L190.3 394L186.5 393.5L183.1 392.8L180 392L177.3 391.2L175.1 390.2L173.4 389.2L172.2 388.1L171.6 387L170.4 385.9\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M170.4 385.9L170.9 384.7L172 383.6L180.6 376.8L182.2 375.7L184.4 374.7L187.1 373.8L190.2 373L193.7 372.2L197.5 371.7L201.6 371.2L205.9 370.9L210.3 370.7L214.8 370.7L219.2 370.8L223.5 371.1L336.5 380.6L340.7 381.1L344.6 381.6L348.1 382.3L351.3 383.1L354.1 384L356.3 385L358.1 386.1L359.3 387.2L360 388.3L360 389.5M360 393.3L359.5 394.4L358.4 395.6L349.8 402.4L348.2 403.5L346 404.5L343.3 405.4L340.2 406.2L336.7 406.9L332.9 407.5L328.8 408L324.5 408.3L320.1 408.5L315.6 408.5L311.2 408.3L306.9 408.1L193.9 398.5L189.7 398.1L185.9 397.6L182.3 396.9L179.1 396.1L176.3 395.2L174.1 394.2L172.3 393.1L171.1 392L170.4 390.9L170.4 389.7M360 389.5L360 393.3M170.4 385.9L170.4 389.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M172.8 378.3L173.2 377.2L174.3 376.1L182.8 369.3L184.4 368.3L186.4 367.4L188.9 366.5L191.8 365.8L195 365.1L198.6 364.5L202.4 364.1L206.4 363.8L210.5 363.7L214.6 363.7L218.8 363.8L222.8 364.1L335.8 373.6L339.6 374L343.3 374.5L346.6 375.1L349.5 375.9L352.1 376.7L354.2 377.6L355.9 378.6L357 379.7L357.6 380.7L357.6 381.8L357.6 389.4L357.2 390.5L356.1 391.5L347.6 398.4L346 399.4L344 400.3L341.5 401.2L338.6 401.9L335.4 402.6L331.8 403.1L328 403.6L324 403.9L319.9 404L315.8 404L311.7 403.9L307.6 403.6L194.6 394.1L190.8 393.7L187.1 393.2L183.8 392.6L180.9 391.8L178.3 391L176.2 390.1L174.5 389.1L173.4 388L172.8 387L172.8 385.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M357.6 389.4L357.2 390.5L357.2 382.9L357.6 381.8ZM357.2 390.5L356.1 391.5L356.1 383.9L357.2 382.9ZM356.1 391.5L347.6 398.4L347.6 390.7L356.1 383.9ZM347.6 398.4L346 399.4L346 391.7L347.6 390.7ZM346 399.4L344 400.3L344 392.7L346 391.7ZM344 400.3L341.5 401.2L341.5 393.5L344 392.7ZM341.5 401.2L338.6 401.9L338.6 394.3L341.5 393.5ZM338.6 401.9L335.4 402.6L335.4 394.9L338.6 394.3ZM335.4 402.6L331.8 403.1L331.8 395.5L335.4 394.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M331.8 403.1L328 403.6L328 395.9L331.8 395.5ZM328 403.6L324 403.9L324 396.2L328 395.9ZM324 403.9L319.9 404L319.9 396.4L324 396.2ZM319.9 404L315.8 404L315.8 396.4L319.9 396.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M315.8 404L311.7 403.9L311.7 396.3L315.8 396.4ZM311.7 403.9L307.6 403.6L307.6 396L311.7 396.3ZM307.6 403.6L194.6 394.1L194.6 386.5L307.6 396ZM194.6 394.1L190.8 393.7L190.8 386.1L194.6 386.5ZM190.8 393.7L187.1 393.2L187.1 385.6L190.8 386.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M187.1 393.2L183.8 392.6L183.8 384.9L187.1 385.6ZM183.8 392.6L180.9 391.8L180.9 384.2L183.8 384.9ZM180.9 391.8L178.3 391L178.3 383.3L180.9 384.2ZM178.3 391L176.2 390.1L176.2 382.4L178.3 383.3ZM176.2 390.1L174.5 389.1L174.5 381.4L176.2 382.4ZM174.5 389.1L173.4 388L173.4 380.4L174.5 381.4ZM173.4 388L172.8 387L172.8 379.3L173.4 380.4ZM172.8 387L172.8 385.9L172.8 378.3L172.8 379.3Z\"/><path class=\"iso-top\" d=\"M335.8 373.6L339.6 374L343.3 374.5L346.6 375.1L349.5 375.9L352.1 376.7L354.2 377.6L355.9 378.6L357 379.7L357.6 380.7L357.6 381.8L357.2 382.9L356.1 383.9L347.6 390.7L346 391.7L344 392.7L341.5 393.5L338.6 394.3L335.4 394.9L331.8 395.5L328 395.9L324 396.2L319.9 396.4L315.8 396.4L311.7 396.3L307.6 396L194.6 386.5L190.8 386.1L187.1 385.6L183.8 384.9L180.9 384.2L178.3 383.3L176.2 382.4L174.5 381.4L173.4 380.4L172.8 379.3L172.8 378.3L173.2 377.2L174.3 376.1L182.8 369.3L184.4 368.3L186.4 367.4L188.9 366.5L191.8 365.8L195 365.1L198.6 364.5L202.4 364.1L206.4 363.8L210.5 363.7L214.6 363.7L218.8 363.8L222.8 364.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M357.6 381.8L357.2 382.9L356.1 383.9L347.6 390.7L346 391.7L344 392.7L341.5 393.5L338.6 394.3L335.4 394.9L331.8 395.5L328 395.9L324 396.2L319.9 396.4L315.8 396.4L311.7 396.3L307.6 396L194.6 386.5L190.8 386.1L187.1 385.6L183.8 384.9L180.9 384.2L178.3 383.3L176.2 382.4L174.5 381.4L173.4 380.4L172.8 379.3L172.8 378.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M357.6 381.8L354.4 382.7L353.5 383.7L345 390.5L343.5 391.4L341.7 392.3L339.4 393L336.8 393.7L333.8 394.4L330.6 394.9L327.1 395.2L323.4 395.5L319.7 395.6L315.9 395.7L312.2 395.5L308.4 395.3L195.6 385.8L192 385.4L188.7 385L185.6 384.4L182.9 383.7L180.6 382.9L178.6 382.1L177.2 381.2L176.1 380.2L175.6 379.3L172.8 378.3\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M357.6 386.4L357.2 387.4L356.1 388.5L347.6 395.3L346 396.3L344 397.2L341.5 398.1L338.6 398.9L335.4 399.5L331.8 400.1L328 400.5L324 400.8L319.9 401L315.8 401L311.7 400.8L307.6 400.6L194.6 391.1L190.8 390.7L187.1 390.2L183.8 389.5L180.9 388.8L178.3 387.9L176.2 387L174.5 386L173.4 385L172.8 383.9L172.8 382.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M172.8 378.3L173.2 377.2L174.3 376.1L182.8 369.3L184.4 368.3L186.4 367.4L188.9 366.5L191.8 365.8L195 365.1L198.6 364.5L202.4 364.1L206.4 363.8L210.5 363.7L214.6 363.7L218.8 363.8L222.8 364.1L335.8 373.6L339.6 374L343.3 374.5L346.6 375.1L349.5 375.9L352.1 376.7L354.2 377.6L355.9 378.6L357 379.7L357.6 380.7L357.6 381.8M357.6 389.4L357.2 390.5L356.1 391.5L347.6 398.4L346 399.4L344 400.3L341.5 401.2L338.6 401.9L335.4 402.6L331.8 403.1L328 403.6L324 403.9L319.9 404L315.8 404L311.7 403.9L307.6 403.6L194.6 394.1L190.8 393.7L187.1 393.2L183.8 392.6L180.9 391.8L178.3 391L176.2 390.1L174.5 389.1L173.4 388L172.8 387L172.8 385.9M357.6 381.8L357.6 389.4M172.8 378.3L172.8 385.9\"/></g><path class=\"iso-line\" data-tone=\"faint\" d=\"M332.1 376.5L334.5 376.7L336.8 377.1L338.9 377.5L340.7 377.9L342.3 378.5L343.6 379L344.7 379.6L345.4 380.3L345.7 381L345.8 381.6L345.5 382.3L344.8 382.9L336.3 389.8L335.3 390.4L334 391L332.5 391.5L330.7 392L328.6 392.4L326.4 392.8L324 393L321.5 393.2L319 393.3L316.4 393.3L313.8 393.2L311.3 393.1L198.3 383.6L195.9 383.3L193.6 383L191.5 382.6L189.7 382.1L188.1 381.6L186.8 381L185.7 380.4L185 379.7L184.7 379.1L184.6 378.4L184.9 377.7L185.6 377.1L194.1 370.3L195.1 369.6L196.4 369.1L197.9 368.5L199.7 368L201.8 367.6L204 367.3L206.4 367L208.9 366.8L211.4 366.7L214 366.7L216.6 366.8L219.1 367Z\"/><path class=\"mon-hole\" d=\"M280.6 372.7L281.7 372.8L282.7 373L283.5 373.2L284.1 373.5L284.5 373.7L284.7 374L284.7 374.3L284.5 374.6L284.5 374.6L284 374.9L283.3 375.2L282.5 375.4L281.5 375.5L280.4 375.6L279.3 375.7L278.1 375.7L277 375.6L265.7 374.7L264.6 374.6L263.6 374.4L262.8 374.2L262.2 373.9L261.8 373.6L261.6 373.3L261.6 373L261.9 372.7L261.9 372.7L262.3 372.5L263 372.2L263.8 372L264.8 371.8L265.9 371.7L267 371.7L268.2 371.7L269.3 371.7Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M280.6 372.7L281.7 372.8L282.7 373L283.5 373.2L284.1 373.5L284.5 373.7L284.7 374L284.7 374.3L284.5 374.6L284.5 374.6L284 374.9L283.3 375.2L282.5 375.4L281.5 375.5L280.4 375.6L279.3 375.7L278.1 375.7L277 375.6L265.7 374.7L264.6 374.6L263.6 374.4L262.8 374.2L262.2 373.9L261.8 373.6L261.6 373.3L261.6 373L261.9 372.7L261.9 372.7L262.3 372.5L263 372.2L263.8 372L264.8 371.8L265.9 371.7L267 371.7L268.2 371.7L269.3 371.7Z\"/></g><g data-paint=\"neck\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M244.4 370.7L245 370L246.8 368.5L248.2 367.8L250.2 367.2L252.7 366.7L255.7 366.4L258.8 366.4L261.8 366.5L288.2 368.7L291 369.1L293.3 369.6L295.1 370.3L296.1 371L296.4 371.8L296.4 376.4L295.8 377.2L294 378.7L292.6 379.4L290.6 380L288.1 380.5L285.1 380.7L282.1 380.8L279 380.6L252.6 378.4L249.8 378.1L247.5 377.6L245.7 376.9L244.7 376.1L244.4 375.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M296.4 376.4L295.8 377.2L295.8 372.6L296.4 371.8ZM295.8 377.2L294 378.7L294 374.1L295.8 372.6ZM294 378.7L292.6 379.4L292.6 374.8L294 374.1ZM292.6 379.4L290.6 380L290.6 375.4L292.6 374.8ZM290.6 380L288.1 380.5L288.1 375.9L290.6 375.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M288.1 380.5L285.1 380.7L285.1 376.1L288.1 375.9ZM285.1 380.7L282.1 380.8L282.1 376.2L285.1 376.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M282.1 380.8L279 380.6L279 376.1L282.1 376.2ZM279 380.6L252.6 378.4L252.6 373.8L279 376.1ZM252.6 378.4L249.8 378.1L249.8 373.5L252.6 373.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M249.8 378.1L247.5 377.6L247.5 373L249.8 373.5ZM247.5 377.6L245.7 376.9L245.7 372.3L247.5 373ZM245.7 376.9L244.7 376.1L244.7 371.5L245.7 372.3ZM244.7 376.1L244.4 375.3L244.4 370.7L244.7 371.5Z\"/><path class=\"iso-top\" d=\"M288.2 368.7L291 369.1L293.3 369.6L295.1 370.3L296.1 371L296.4 371.8L295.8 372.6L294 374.1L292.6 374.8L290.6 375.4L288.1 375.9L285.1 376.1L282.1 376.2L279 376.1L252.6 373.8L249.8 373.5L247.5 373L245.7 372.3L244.7 371.5L244.4 370.7L245 370L246.8 368.5L248.2 367.8L250.2 367.2L252.7 366.7L255.7 366.4L258.8 366.4L261.8 366.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M296.4 371.8L295.8 372.6L294 374.1L292.6 374.8L290.6 375.4L288.1 375.9L285.1 376.1L282.1 376.2L279 376.1L252.6 373.8L249.8 373.5L247.5 373L245.7 372.3L244.7 371.5L244.4 370.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M296.4 371.8L294.7 372.5L292.9 374L291.6 374.6L289.8 375.2L287.5 375.6L284.9 375.8L282.1 375.9L279.3 375.8L253.1 373.5L250.5 373.2L248.4 372.8L246.8 372.2L245.8 371.5L244.4 370.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M244.4 370.7L245 370L246.8 368.5L248.2 367.8L250.2 367.2L252.7 366.7L255.7 366.4L258.8 366.4L261.8 366.5L288.2 368.7L291 369.1L293.3 369.6L295.1 370.3L296.1 371L296.4 371.8M296.4 376.4L295.8 377.2L294 378.7L292.6 379.4L290.6 380L288.1 380.5L285.1 380.7L282.1 380.8L279 380.6L252.6 378.4L249.8 378.1L247.5 377.6L245.7 376.9L244.7 376.1L244.4 375.3M296.4 371.8L296.4 376.4M244.4 370.7L244.4 375.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M250.4 236.9L250.6 236.5L252.5 235.1L253.2 234.7L254.2 234.4L255.4 234.2L256.9 234L258.4 234L260 234.1L286.3 236.3L287.7 236.5L288.9 236.7L289.8 237L290.3 237.4L290.4 237.8L290.4 371.7L290.2 372.1L288.3 373.6L287.7 374L286.6 374.3L285.4 374.5L283.9 374.6L282.4 374.7L280.8 374.6L254.5 372.4L253.1 372.2L251.9 371.9L251 371.6L250.5 371.2L250.4 370.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M290.4 371.7L290.2 372.1L290.2 238.2L290.4 237.8ZM290.2 372.1L288.3 373.6L288.3 239.7L290.2 238.2ZM288.3 373.6L287.7 374L287.7 240L288.3 239.7ZM287.7 374L286.6 374.3L286.6 240.4L287.7 240ZM286.6 374.3L285.4 374.5L285.4 240.6L286.6 240.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M285.4 374.5L283.9 374.6L283.9 240.7L285.4 240.6ZM283.9 374.6L282.4 374.7L282.4 240.7L283.9 240.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M282.4 374.7L280.8 374.6L280.8 240.7L282.4 240.7ZM280.8 374.6L254.5 372.4L254.5 238.5L280.8 240.7ZM254.5 372.4L253.1 372.2L253.1 238.3L254.5 238.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M253.1 372.2L251.9 371.9L251.9 238L253.1 238.3ZM251.9 371.9L251 371.6L251 237.7L251.9 238ZM251 371.6L250.5 371.2L250.5 237.3L251 237.7ZM250.5 371.2L250.4 370.8L250.4 236.9L250.5 237.3Z\"/><path class=\"iso-top\" d=\"M286.3 236.3L287.7 236.5L288.9 236.7L289.8 237L290.3 237.4L290.4 237.8L290.2 238.2L288.3 239.7L287.7 240L286.6 240.4L285.4 240.6L283.9 240.7L282.4 240.7L280.8 240.7L254.5 238.5L253.1 238.3L251.9 238L251 237.7L250.5 237.3L250.4 236.9L250.6 236.5L252.5 235.1L253.2 234.7L254.2 234.4L255.4 234.2L256.9 234L258.4 234L260 234.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M290.4 237.8L290.2 238.2L288.3 239.7L287.7 240L286.6 240.4L285.4 240.6L283.9 240.7L282.4 240.7L280.8 240.7L254.5 238.5L253.1 238.3L251.9 238L251 237.7L250.5 237.3L250.4 236.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M290.4 237.8L288.6 238.1L286.9 239.5L286.3 239.8L285.6 240L284.7 240.2L283.6 240.3L282.4 240.3L281.2 240.3L255.1 238.1L253.9 237.9L253.1 237.7L252.4 237.5L252 237.2L250.4 236.9\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M290.8 357.1L290.8 250\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M250.4 236.9L250.6 236.5L252.5 235.1L253.2 234.7L254.2 234.4L255.4 234.2L256.9 234L258.4 234L260 234.1L286.3 236.3L287.7 236.5L288.9 236.7L289.8 237L290.3 237.4L290.4 237.8M290.4 371.7L290.2 372.1L288.3 373.6L287.7 374L286.6 374.3L285.4 374.5L283.9 374.6L282.4 374.7L280.8 374.6L254.5 372.4L253.1 372.2L251.9 371.9L251 371.6L250.5 371.2L250.4 370.8M290.4 237.8L290.4 371.7M250.4 236.9L250.4 370.8\"/></g><path class=\"mon-slot\" d=\"M262 347L273.3 347.9L273.3 302L262 301.1Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M238.5 223.5L238.8 223.1L240.6 221.7L241.3 221.3L242.3 221L243.6 220.8L245 220.6L246.6 220.6L248.1 220.7L293.3 224.5L294.7 224.7L295.9 224.9L296.8 225.3L297.3 225.6L297.4 226L297.4 249L297.1 249.4L295.3 250.8L294.6 251.2L293.6 251.5L292.3 251.7L290.9 251.9L289.3 251.9L287.8 251.8L242.6 248L241.2 247.9L240 247.6L239.1 247.3L238.6 246.9L238.5 246.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M297.4 249L297.1 249.4L297.1 226.4L297.4 226ZM297.1 249.4L295.3 250.8L295.3 227.9L297.1 226.4ZM295.3 250.8L294.6 251.2L294.6 228.2L295.3 227.9ZM294.6 251.2L293.6 251.5L293.6 228.6L294.6 228.2ZM293.6 251.5L292.3 251.7L292.3 228.8L293.6 228.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M292.3 251.7L290.9 251.9L290.9 228.9L292.3 228.8ZM290.9 251.9L289.3 251.9L289.3 228.9L290.9 228.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M289.3 251.9L287.8 251.8L287.8 228.9L289.3 228.9ZM287.8 251.8L242.6 248L242.6 225.1L287.8 228.9ZM242.6 248L241.2 247.9L241.2 224.9L242.6 225.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M241.2 247.9L240 247.6L240 224.6L241.2 224.9ZM240 247.6L239.1 247.3L239.1 224.3L240 224.6ZM239.1 247.3L238.6 246.9L238.6 223.9L239.1 224.3ZM238.6 246.9L238.5 246.5L238.5 223.5L238.6 223.9Z\"/><path class=\"iso-top\" d=\"M293.3 224.5L294.7 224.7L295.9 224.9L296.8 225.3L297.3 225.6L297.4 226L297.1 226.4L295.3 227.9L294.6 228.2L293.6 228.6L292.3 228.8L290.9 228.9L289.3 228.9L287.8 228.9L242.6 225.1L241.2 224.9L240 224.6L239.1 224.3L238.6 223.9L238.5 223.5L238.8 223.1L240.6 221.7L241.3 221.3L242.3 221L243.6 220.8L245 220.6L246.6 220.6L248.1 220.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M297.4 226L297.1 226.4L295.3 227.9L294.6 228.2L293.6 228.6L292.3 228.8L290.9 228.9L289.3 228.9L287.8 228.9L242.6 225.1L241.2 224.9L240 224.6L239.1 224.3L238.6 223.9L238.5 223.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M297.4 226L295.2 226.3L293.5 227.7L293 228L292.3 228.2L291.4 228.3L290.5 228.4L289.4 228.4L288.3 228.4L243.3 224.6L242.3 224.5L241.5 224.3L240.9 224.1L240.6 223.8L238.5 223.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M238.5 223.5L238.8 223.1L240.6 221.7L241.3 221.3L242.3 221L243.6 220.8L245 220.6L246.6 220.6L248.1 220.7L293.3 224.5L294.7 224.7L295.9 224.9L296.8 225.3L297.3 225.6L297.4 226M297.4 249L297.1 249.4L295.3 250.8L294.6 251.2L293.6 251.5L292.3 251.7L290.9 251.9L289.3 251.9L287.8 251.8L242.6 248L241.2 247.9L240 247.6L239.1 247.3L238.6 246.9L238.5 246.5M297.4 226L297.4 249M238.5 223.5L238.5 246.5\"/></g><g class=\"iso-dots\" data-tone=\"lo\"><circle cx=\"241.7\" cy=\"236.5\" r=\"0.5\"/><circle cx=\"288.7\" cy=\"240.4\" r=\"0.5\"/></g></g><g data-paint=\"shell\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M143 57.6L143.4 57.1L144 56.6L144.9 56.1L146.3 55.7L148 55.4L149.9 55.2L152 55.2L154 55.3L380.1 74.3L381.9 74.5L383.5 74.9L384.7 75.3L385.4 75.8L385.5 76.4L385.5 263.9L385.1 264.4L384.5 264.9L383.6 265.4L382.3 265.8L380.6 266.1L378.6 266.2L376.6 266.3L374.5 266.2L148.5 247.2L146.6 246.9L145.1 246.6L143.9 246.2L143.2 245.7L143 245.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M385.5 263.9L385.1 264.4L385.1 76.9L385.5 76.4ZM385.1 264.4L384.5 264.9L384.5 77.4L385.1 76.9ZM384.5 264.9L383.6 265.4L383.6 77.9L384.5 77.4ZM383.6 265.4L382.3 265.8L382.3 78.3L383.6 77.9ZM382.3 265.8L380.6 266.1L380.6 78.6L382.3 78.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M380.6 266.1L378.6 266.2L378.6 78.8L380.6 78.6ZM378.6 266.2L376.6 266.3L376.6 78.8L378.6 78.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M376.6 266.3L374.5 266.2L374.5 78.7L376.6 78.8ZM374.5 266.2L148.5 247.2L148.5 59.7L374.5 78.7ZM148.5 247.2L146.6 246.9L146.6 59.5L148.5 59.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M146.6 246.9L145.1 246.6L145.1 59.1L146.6 59.5ZM145.1 246.6L143.9 246.2L143.9 58.7L145.1 59.1ZM143.9 246.2L143.2 245.7L143.2 58.2L143.9 58.7ZM143.2 245.7L143 245.1L143 57.6L143.2 58.2Z\"/><path class=\"iso-top\" d=\"M380.1 74.3L381.9 74.5L383.5 74.9L384.7 75.3L385.4 75.8L385.5 76.4L385.1 76.9L384.5 77.4L383.6 77.9L382.3 78.3L380.6 78.6L378.6 78.8L376.6 78.8L374.5 78.7L148.5 59.7L146.6 59.5L145.1 59.1L143.9 58.7L143.2 58.2L143 57.6L143.4 57.1L144 56.6L144.9 56.1L146.3 55.7L148 55.4L149.9 55.2L152 55.2L154 55.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M385.5 76.4L385.1 76.9L384.5 77.4L383.6 77.9L382.3 78.3L380.6 78.6L378.6 78.8L376.6 78.8L374.5 78.7L148.5 59.7L146.6 59.5L145.1 59.1L143.9 58.7L143.2 58.2L143 57.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M385.5 76.4L381.3 76.6L380.9 77L380.3 77.3L379.6 77.5L378.8 77.7L377.8 77.8L376.8 77.8L375.5 77.7L150 58.7L148.8 58.6L148 58.4L147.4 58.2L147.1 58L143 57.6\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M385.5 168.2L385.1 168.7L384.5 169.2L383.6 169.7L382.3 170.1L380.6 170.4L378.6 170.6L376.6 170.6L374.5 170.5L148.5 151.5L146.6 151.3L145.1 150.9L143.9 150.5L143.2 150L143 149.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M143 57.6L143.4 57.1L144 56.6L144.9 56.1L146.3 55.7L148 55.4L149.9 55.2L152 55.2L154 55.3L380.1 74.3L381.9 74.5L383.5 74.9L384.7 75.3L385.4 75.8L385.5 76.4M385.5 263.9L385.1 264.4L384.5 264.9L383.6 265.4L382.3 265.8L380.6 266.1L378.6 266.2L376.6 266.3L374.5 266.2L148.5 247.2L146.6 246.9L145.1 246.6L143.9 246.2L143.2 245.7L143 245.1M385.5 76.4L385.5 263.9M143 57.6L143 245.1\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M386.4 206L383.3 208.5M386.4 196.4L383.3 198.9M386.4 186.9L383.3 189.3M386.4 177.3L383.3 179.8M386.4 167.8L383.3 170.2\"/><g data-hit=\"monitor\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M56.3 11.5L56.6 11.2L57.1 10.9L58 10.7L59 10.5L60.2 10.4L61.5 10.3L62.8 10.4L460.3 43.8L461.4 44L462.4 44.2L463.1 44.5L463.6 44.8L463.7 45.1L463.7 320.6L463.4 320.9L462.9 321.2L462 321.5L461 321.7L459.8 321.8L458.5 321.8L457.2 321.7L59.7 288.3L58.6 288.2L57.6 288L56.9 287.7L56.4 287.4L56.3 287Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M463.7 320.6L463.4 320.9L463.4 45.4L463.7 45.1ZM463.4 320.9L462.9 321.2L462.9 45.7L463.4 45.4ZM462.9 321.2L462 321.5L462 46L462.9 45.7ZM462 321.5L461 321.7L461 46.2L462 46Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M461 321.7L459.8 321.8L459.8 46.3L461 46.2ZM459.8 321.8L458.5 321.8L458.5 46.3L459.8 46.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M458.5 321.8L457.2 321.7L457.2 46.3L458.5 46.3ZM457.2 321.7L59.7 288.3L59.7 12.8L457.2 46.3ZM59.7 288.3L58.6 288.2L58.6 12.7L59.7 12.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M58.6 288.2L57.6 288L57.6 12.5L58.6 12.7ZM57.6 288L56.9 287.7L56.9 12.2L57.6 12.5ZM56.9 287.7L56.4 287.4L56.4 11.9L56.9 12.2ZM56.4 287.4L56.3 287L56.3 11.5L56.4 11.9Z\"/><path class=\"iso-top\" d=\"M460.3 43.8L461.4 44L462.4 44.2L463.1 44.5L463.6 44.8L463.7 45.1L463.4 45.4L463.4 45.4L462.9 45.7L462 46L461 46.2L459.8 46.3L458.5 46.3L457.2 46.3L59.7 12.8L58.6 12.7L57.6 12.5L56.9 12.2L56.4 11.9L56.3 11.5L56.6 11.2L56.6 11.2L57.1 10.9L58 10.7L59 10.5L60.2 10.4L61.5 10.3L62.8 10.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M463.7 45.1L463.4 45.4M463.4 45.4L462.9 45.7L462 46L461 46.2L459.8 46.3L458.5 46.3L457.2 46.3L59.7 12.8L58.6 12.7L57.6 12.5L56.9 12.2L56.4 11.9L56.3 11.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M463.7 45.1L463.4 45.4M463.4 45.4L460.9 45.4L460.4 45.5L459.9 45.6L459.3 45.7L458.6 45.7L457.8 45.7L60.6 12.3L59.9 12.2L59.4 12.1L59 11.9L58.8 11.8L56.3 11.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M463.4 45.4L463.4 45.4M56.3 11.5L56.6 11.2L56.6 11.2L57.1 10.9L58 10.7L59 10.5L60.2 10.4L61.5 10.3L62.8 10.4L460.3 43.8L461.4 44L462.4 44.2L463.1 44.5L463.6 44.8L463.7 45.1M463.7 320.6L463.4 320.9M463.4 320.9L462.9 321.2L462 321.5L461 321.7L459.8 321.8L458.5 321.8L457.2 321.7L59.7 288.3L58.6 288.2L57.6 288L56.9 287.7L56.4 287.4L56.3 287M463.7 45.1L463.7 320.6M463.4 45.4L463.4 320.9M463.4 45.4L463.4 320.9M56.3 11.5L56.3 287\"/></g></g></g><path class=\"mon-bezel\" d=\"M65.2 267.9L451.7 300.4L451.7 56.1L65.2 23.6Z\"/><g data-part=\"glass\"><path class=\"mon-glass\" d=\"M68.2 265.1L448.7 297.1L448.7 58.9L68.2 26.9Z\"/><path class=\"mon-glare\" d=\"M105.9 30.1L200.1 38L87 266.7L68.2 265.1L68.2 223Z\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M68.2 265.1L448.7 297.1L448.7 58.9L68.2 26.9Z\"/><circle class=\"mon-cam\" cx=\"258.46\" cy=\"36.06\" r=\"1.5\"/><g class=\"iso-dots\" data-tone=\"lo\"><circle cx=\"258.5\" cy=\"36.1\" r=\"0.35\"/></g><text dy=\"1.43\" class=\"iso-face-text\" data-tone=\"lo\" transform=\"matrix(1.884 0.158 0 1.913 258.458 293.947)\" font-size=\"4.2\" text-anchor=\"middle\">JUNIOR IT</text><g data-part=\"led\"><circle class=\"mon-led\" cx=\"431.75\" cy=\"308.52\" r=\"1.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M391.6 315.1L392.2 314.7L392.8 314.5L393.7 314.5L398.9 314.9L399.6 315.1L399.7 315.3L399.7 318.4L399.1 318.8L398.5 319L397.6 319L392.3 318.6L391.6 318.4L391.6 318.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M399.7 318.4L399.1 318.8L399.1 315.8L399.7 315.3ZM399.1 318.8L398.5 319L398.5 316L399.1 315.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M398.5 319L397.6 319L397.6 316L398.5 316Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M397.6 319L392.3 318.6L392.3 315.5L397.6 316Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M392.3 318.6L391.6 318.4L391.6 315.4L392.3 315.5ZM391.6 318.4L391.6 318.2L391.6 315.1L391.6 315.4Z\"/><path class=\"iso-top\" d=\"M398.9 314.9L399.6 315.1L399.7 315.3L399.1 315.8L398.5 316L397.6 316L392.3 315.5L391.6 315.4L391.6 315.1L392.2 314.7L392.8 314.5L393.7 314.5Z\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M391.6 315.1L392.2 314.7L392.8 314.5L393.7 314.5L398.9 314.9L399.6 315.1L399.7 315.3M399.7 318.4L399.1 318.8L398.5 319L397.6 319L392.3 318.6L391.6 318.4L391.6 318.2M399.7 315.3L399.7 318.4M391.6 315.1L391.6 318.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M404.7 316.3L405.3 315.8L405.9 315.6L406.8 315.6L412.1 316L412.8 316.2L412.9 316.4L412.9 319.5L412.3 320L411.7 320.1L410.8 320.1L405.5 319.7L404.8 319.6L404.7 319.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M412.9 319.5L412.3 320L412.3 316.9L412.9 316.4ZM412.3 320L411.7 320.1L411.7 317.1L412.3 316.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M411.7 320.1L410.8 320.1L410.8 317.1L411.7 317.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M410.8 320.1L405.5 319.7L405.5 316.6L410.8 317.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M405.5 319.7L404.8 319.6L404.8 316.5L405.5 316.6ZM404.8 319.6L404.7 319.3L404.7 316.3L404.8 316.5Z\"/><path class=\"iso-top\" d=\"M412.1 316L412.8 316.2L412.9 316.4L412.3 316.9L411.7 317.1L410.8 317.1L405.5 316.6L404.8 316.5L404.7 316.3L405.3 315.8L405.9 315.6L406.8 315.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M404.7 316.3L405.3 315.8L405.9 315.6L406.8 315.6L412.1 316L412.8 316.2L412.9 316.4M412.9 319.5L412.3 320L411.7 320.1L410.8 320.1L405.5 319.7L404.8 319.6L404.7 319.3M412.9 316.4L412.9 319.5M404.7 316.3L404.7 319.3\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M417.9 317.4L418.5 316.9L419.1 316.7L420 316.7L425.3 317.1L426 317.3L426.1 317.5L426.1 320.6L425.5 321.1L424.9 321.2L424 321.3L418.7 320.8L418 320.7L417.9 320.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M426.1 320.6L425.5 321.1L425.5 318L426.1 317.5ZM425.5 321.1L424.9 321.2L424.9 318.2L425.5 318Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M424.9 321.2L424 321.3L424 318.2L424.9 318.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M424 321.3L418.7 320.8L418.7 317.8L424 318.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M418.7 320.8L418 320.7L418 317.6L418.7 317.8ZM418 320.7L417.9 320.4L417.9 317.4L418 317.6Z\"/><path class=\"iso-top\" d=\"M425.3 317.1L426 317.3L426.1 317.5L425.5 318L424.9 318.2L424 318.2L418.7 317.8L418 317.6L417.9 317.4L418.5 316.9L419.1 316.7L420 316.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M417.9 317.4L418.5 316.9L419.1 316.7L420 316.7L425.3 317.1L426 317.3L426.1 317.5M426.1 320.6L425.5 321.1L424.9 321.2L424 321.3L418.7 320.8L418 320.7L417.9 320.4M426.1 317.5L426.1 320.6M417.9 317.4L417.9 320.4\"/></g></svg>","w":520,"h":420,"ar":1.2381,"crop":[51.03,6,417.93,327.91],"full":[49.03,4,421.93,413.94],"screen":{"tl":[68.22,26.94],"tr":[448.72,58.94],"bl":[68.22,265.12],"aspect":1.6225}};
const MON_VB = MON.full;

// Текст → части блока; frag (если есть) обёрнут тегом tag.
function markParts(text, frag, tag) {
  const i = frag ? text.indexOf(frag) : -1;
  if (i < 0) return [txt(text)];
  return [txt(text.slice(0, i)), { k: tag, v: frag }, txt(text.slice(i + frag.length))].filter((x) => x.v !== '');
}

// Строки страницы турнира. o.heads — уровень заголовка по id (0 — строка без тегов),
// o.paras — какие строки текста в <p>, o.marks — выделения b / i.
function docLines(pick, o) {
  const opt = o || {};
  const heads = Object.assign({}, HEAD_LV, opt.heads || {});
  const paras = opt.paras || TEXT_IDS;
  return P_IDS.map((id) => {
    const text = pick(PAGE[id]);
    if (HEAD_LV[id] !== undefined) return blk(id, heads[id] ? 'h' + heads[id] : null, text);
    let parts = [txt(text)];
    if (opt.marks && id === 'r2') parts = markParts(text, pick(PAGE.fragB), 'b');
    if (opt.marks && id === 'zp') parts = markParts(text, pick(PAGE.fragI), 'i');
    return blk(id, paras.indexOf(id) >= 0 ? 'p' : null, parts);
  });
}

// Браузер склеивает соседние строки без тегов в одну (переносы — просто пробел).
function glue(lines) {
  const out = [];
  lines.forEach((b) => {
    const last = out[out.length - 1];
    if (!b.tag && last && !last.tag) out[out.length - 1] = { id: last.id, ids: (last.ids || [last.id]).concat(b.id), tag: null, parts: last.parts.concat([txt(' ')], b.parts) };
    else out.push(b);
  });
  return out;
}

// Раздел «Финал» и свой раздел ученика — для экранов после «Нового раздела».
function finalBlocks(pick, store) {
  const s11 = store.get('s11');
  return [blk('fh', 'h2', s11 && s11.text ? s11.text : pick(PAGE.final)), blk('fp', 'p', pick(PAGE.finalP))];
}
function ownBlocks(store) {
  const own = store.get('s12');
  if (!own || !own.done) return [];
  return [blk('oh', 'h2', own.head), blk('op', 'p', markParts(own.text, own.bold, 'b'))];
}
function fullPage(pick, store) {
  return docLines(pick, { marks: true }).concat(finalBlocks(pick, store), ownBlocks(store));
}
// Артефакт урока для payload: страница турнира с разделом ученика (кладёт экран 12).
function makeArtifact(store) {
  const own = store.get('s12');
  if (!own || !own.done || !own.blocks) return null;
  return { type: 'html-page', title: own.title, blocks: own.blocks, html: buildHtml(own.title, own.blocks), mine: { head: own.head, text: own.text, bold: own.bold } };
}
const putAch = (store, k, v) => {
  const a = Object.assign({}, store.get('ach') || {});
  if (!a[k]) { a[k] = v; store.set('ach', a); }
};

// Узкий экран (телефон): в рабочих экранах монитор показывается без подставки.
function useNarrow() {
  const q = '(max-width: 719px)';
  const get = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(q).matches;
  const [n, setN] = useState(get);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const m = window.matchMedia(q);
    const h = () => setN(m.matches);
    if (m.addEventListener) m.addEventListener('change', h); else m.addListener(h);
    return () => { if (m.removeEventListener) m.removeEventListener('change', h); else m.removeListener(h); };
  }, []);
  return n;
}

// ─────────────────────────────────────────────────────────────────────────────
// МОНИТОР. Корпус — SVG фигуры (MON), экран — мини-браузер урока 2 поверх SVG,
// развёрнутый матрицей по трём углам стекла (tl, tr, bl в координатах рисунка).
// Ширина слоя — ширина стекла в пикселях (в пределах 240–420), поэтому текст на
// экране всегда своего размера и чёткий; вид — тот же, что у браузера урока.
//   on — включён ли; crop — без подставки; focusKey — сменился → экран
//   прокручивается к блоку focus; badge — надпись на экране («Обновлено»).
// ─────────────────────────────────────────────────────────────────────────────
function Monitor({ title, blocks, on = true, crop, flash, hl, fresh, focus, focusKey, tour, led, onTap, tapLabel, badge, cls, renderBlock }) {
  const pick = usePick();
  const wrapRef = useRef(null);
  const scrRef = useRef(null);
  const pageRef = useRef(null);
  const els = useRef({});
  const vb = crop ? MON.crop : MON_VB;
  const svg = useMemo(() => ({ __html: MON.svg.replace(/viewBox="[^"]*"/, 'viewBox="' + vb.join(' ') + '"') }), [crop]); // eslint-disable-line react-hooks/exhaustive-deps
  const [boot, setBoot] = useState(false);
  const wasOn = useRef(on);
  useEffect(() => {
    if (on && !wasOn.current && !reduceMotion()) {
      setBoot(true);
      const t = setTimeout(() => setBoot(false), 1300);
      wasOn.current = on;
      return () => clearTimeout(t);
    }
    wasOn.current = on;
    return undefined;
  }, [on]);
  useLayoutEffect(() => {
    const wrap = wrapRef.current, scr = scrRef.current;
    if (!wrap || !scr) return undefined;
    const S = MON.screen;
    const calc = () => {
      const W = wrap.clientWidth;
      if (!W) return;
      const s = W / vb[2];
      const P = (q) => [(q[0] - vb[0]) * s, (q[1] - vb[1]) * s];
      const a = P(S.tl), b = P(S.tr), c = P(S.bl);
      const sw = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const w0 = Math.max(240, Math.min(420, sw));
      const h0 = w0 / S.aspect;
      scr.style.width = w0.toFixed(1) + 'px';
      scr.style.height = h0.toFixed(1) + 'px';
      scr.style.transform = 'matrix(' + [(b[0] - a[0]) / w0, (b[1] - a[1]) / w0, (c[0] - a[0]) / h0, (c[1] - a[1]) / h0, a[0], a[1]]
        .map((v) => v.toFixed(5)).join(',') + ')';
    };
    calc();
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(calc); ro.observe(wrap); }
    window.addEventListener('resize', calc);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [crop]); // eslint-disable-line react-hooks/exhaustive-deps
  // Прокрутка экрана к блоку, который сейчас в работе.
  useEffect(() => {
    const t = setTimeout(() => {
      // Строка, склеенная с соседними, ищется по общему блоку.
      const host = (blocks || []).find((b) => b.id === focus || (b.ids && b.ids.indexOf(focus) >= 0));
      const pg = pageRef.current, el = host && els.current[host.id];
      if (!pg || !el) return;
      const top = el.offsetTop, bot = top + el.offsetHeight, st = pg.scrollTop, ch = pg.clientHeight;
      let to = null;
      if (bot - top > ch) { if (top < st || top > st + ch - 30) to = top - 6; }   // высокий блок: виден его верх — не трогаем
      else if (top < st) to = top - 6;
      else if (bot > st + ch) to = Math.min(top - 6, bot - ch + 10);
      if (to !== null) pg.scrollTo({ top: Math.max(0, to), behavior: reduceMotion() ? 'auto' : 'smooth' });
    }, 80);
    return () => clearTimeout(t);
  }, [focusKey]); // eslint-disable-line react-hooks/exhaustive-deps
  // Обзор страницы: экран медленно прокручивается вниз и возвращается наверх.
  useEffect(() => {
    if (!tour || reduceMotion()) return undefined;
    const pg = pageRef.current;
    if (!pg) return undefined;
    const t1 = setTimeout(() => pg.scrollTo({ top: pg.scrollHeight, behavior: 'smooth' }), 1400);
    const t2 = setTimeout(() => pg.scrollTo({ top: 0, behavior: 'smooth' }), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [tour]);
  const reg = useCallback((id, el) => { if (el) els.current[id] = el; }, []);
  const tap = onTap ? () => onTap() : undefined;
  return (
    <div ref={wrapRef} className={'zg-mon iso' + (on ? ' is-on' : '') + (boot ? ' is-boot' : '') + (crop ? ' is-crop' : '') + (onTap ? ' is-tap' : '') + (led ? ' is-led' : '') + (cls ? ' ' + cls : '')}
      data-theme="light" style={{ '--ar': (vb[2] / vb[3]).toFixed(4) }}
      role={onTap ? 'button' : 'img'} tabIndex={onTap ? 0 : undefined} aria-label={pick(onTap && tapLabel ? tapLabel : UI.monitor)}
      onClick={tap} onKeyDown={onTap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } } : undefined}>
      <div className="zg-mon-svg" dangerouslySetInnerHTML={svg} />
      <div ref={scrRef} className="zg-scr" aria-hidden={on ? undefined : 'true'}>
        <div className="zg-scr-in">
          <MiniBrowser title={title} pageRef={pageRef} cls="zg-mb"
            page={<Page blocks={blocks || []} flash={flash} hl={hl} fresh={fresh} regBlock={reg} renderBlock={renderBlock} />} />
          {badge ? <span className="zg-badge" key={badge.n}>{pick(badge.text)}</span> : null}
        </div>
      </div>
    </div>
  );
}

// Строка задания; подсказка встаёт на её место.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask zg-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const hintOf = (hints, lv, vars) => (lv > 0 && hints[lv - 1] ? fillL(hints[lv - 1], vars || {}) : null);

// Слот уровня заголовка: «h?» пунктиром, пока уровень не выбран.
function HSlot({ on, led }) {
  return <span className={'zg-slot mono' + (on ? ' is-on' : '')}>h?{led ? <Led on /> : null}</span>;
}
// Список условий «готово» — в стиле проверки структуры урока 2.
function Conds({ title, items }) {
  const pick = usePick();
  const firstOpen = items.findIndex((r) => !r.ok);
  return (
    <div className={'insp zg-conds' + (firstOpen < 0 ? ' insp-all' : '')} aria-live="polite">
      <span className="insp-h"><Icon name="listN" size={14} />{pick(title)}</span>
      {items.map((r, i) => (
        <span key={r.id} className={'insp-r' + (r.ok ? ' is-ok' : '') + (i === firstOpen ? ' is-now' : '')}>
          <span className="insp-ic">{r.ok ? <Icon name="check" size={13} /> : null}</span>
          {pick(r.text)}
        </span>
      ))}
    </div>
  );
}

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. HOOK. Монитор в зале: включить → комок текста → «Навести порядок».
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const [phase, setPhase] = useState(rec ? 'done' : 'off');   // off · lump · done
  const [speaker, say, spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(phase === 'done', spoken);
  const led = useIdleLed(canTap && phase !== 'done', phase === 'lump' ? 1 : 0);
  const [fresh, setFresh] = useState(null);
  const powerOn = () => {
    if (!canTap || phase !== 'off') return;
    sfx('pop', true);
    setPhase('lump');
    sayNow(c.lump, 'sorry');
  };
  const tidy = () => {
    if (!canTap || phase !== 'lump') return;
    sfx('win', true);
    setPhase('done'); put({ done: true });
    setFresh(P_IDS.slice());
    sayNow(c.done, 'wonder');
  };
  const blocks = phase === 'done' ? docLines(pick, { marks: true }) : glue(docLines(pick, { heads: { name: 0, rules: 0, hints: 0, prizes: 0 }, paras: [] }));
  const ask = phase === 'off' ? c.ask : phase === 'lump' ? c.askFix : c.askDone;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} />
      <div className="zg-hall">
        <Monitor title={pick(PAGE.name)} blocks={blocks} on={phase !== 'off'} fresh={fresh} tour={fresh ? 1 : 0} cls="zg-mon-hero"
          onTap={phase === 'off' ? powerOn : undefined} tapLabel={UI.power} led={led && phase === 'off'} />
      </div>
      <div className="zg-acts">
        {phase === 'off' ? (
          <button type="button" className="btn-accent zg-act" disabled={!canTap} onClick={powerOn}>
            <Icon name="power" size={18} />{pick(UI.power)}<Led on={led} />
          </button>
        ) : phase === 'lump' ? (
          <button type="button" className="btn-accent zg-act" disabled={!canTap} onClick={tidy}>
            <Icon name="textSize" size={18} />{pick(c.fixBtn)}<Led on={led} />
          </button>
        ) : null}
      </div>
    </Stage>
  );
}

// ── 2. MISSION. План урока карточками (канон).
const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;

// ── 3. ЭКСПЕРИМЕНТ «Enter в коде»: строки раздвинулись — на мониторе тот же комок.
const S3_GAPS = ['rules', 'hints', 'prizes'];
function S3({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const [gaps, setGaps] = useState(rec ? 1 : 0);
  const done = !!rec;
  const [badge, setBadge] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.same : c.say, pose: done ? 'rule' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const press = () => {
    if (!canTap) return;
    sfx('type', true);
    const g = Math.min(2, gaps + 1);
    setGaps(g);
    setBadge((b) => ({ text: UI.noChange, n: (b ? b.n : 0) + 1 }));
    if (!done) { put({ done: true }); sayNow(c.same, 'rule'); }
  };
  const raw = docLines(pick, { heads: { name: 0, rules: 0, hints: 0, prizes: 0 }, paras: [] });
  const lines = srcLines(raw, { frame: 'body' });
  const withGaps = [];
  lines.forEach((ln) => {
    if (gaps && S3_GAPS.indexOf(ln.id) >= 0) for (let k = 0; k < gaps; k += 1) withGaps.push({ key: 'gap-' + ln.id + k, d: 1, toks: [], gap: true });
    withGaps.push(ln);
  });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={done ? c.askDone : c.ask} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} badge={badge} />}
        code={<div className="zg-code zg-code-enter">
          <Src lines={withGaps} className="zg-src" lineProps={(ln) => (ln.gap ? { cls: 'zg-gap' } : null)} />
          <button type="button" className={'zg-enter' + (led ? ' is-led' : '')} disabled={!canTap} onClick={press}>
            <span className="zg-enter-k mono">Enter</span><span className="zg-enter-a" aria-hidden="true">↵</span><Led on={led} />
          </button>
        </div>} />
    </Stage>
  );
}

// ── 4. ГЛАВНЫЙ ЗАГОЛОВОК. Нажать строку названия — она становится h1.
function S4({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const done = !!rec;
  const [flash, setFlash] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'rule' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const tap = (id) => {
    if (!canTap || done) return;
    if (id !== 'name') { sfx('soft', true); wobble(id); sayNow(c.miss, 'think'); return; }
    sfx('pop', true);
    put({ done: true });
    setFlash({ id: 'name', n: 1 });
    sayNow(c.done, 'cheer');
  };
  const raw = docLines(pick, { heads: { name: done ? 1 : 0, rules: 0, hints: 0, prizes: 0 }, paras: [] });
  const ask = done ? c.askDone : fillL(c.ask, { n: PAGE.name });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus="name" focusKey={done ? 'n1' : 'n0'} />}
        code={<Src lines={srcLines(raw, { frame: 'body' })} className="zg-src"
          lineProps={(ln) => (ln.id ? {
            onTap: () => tap(ln.id), disabled: !canTap || done, led: led && ln.id === 'name',
            cls: (ln.id === 'name' && done ? 'zg-in' : '') + (shake === ln.id ? ' zg-shake' : '')
          } : null)} />} />
    </Stage>
  );
}

// ── 5. ШЕСТЬ УРОВНЕЙ. Цифра у «Правил» — размер на мониторе меняется сразу.
const LEVELS = [1, 2, 3, 4, 5, 6];
function S5({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const [lv, setLv] = useState(2);
  const [seen, setSeen] = useState(rec ? LEVELS.slice() : [2]);
  const done = !!rec;
  const [flash, setFlash] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'rule' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, seen.length);
  const pickLv = (n) => {
    if (!canTap) return;
    sfx('tap', true);
    setLv(n);
    setFlash((f) => ({ id: 'rules', n: (f ? f.n : 0) + 1 }));
    const ns = seen.indexOf(n) >= 0 ? seen : seen.concat(n);
    setSeen(ns);
    if (ns.length >= 6 && !done) { put({ done: true }); sayNow(c.done, 'rule'); }
  };
  const raw = docLines(pick, { heads: { rules: lv, hints: 0, prizes: 0 }, paras: [] });
  const shown = raw.slice(0, 3);   // название, «Правила» и текст под ними — остальное свёрнуто
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={done ? c.askDone : c.ask} n={done ? null : seen.length + '/6'} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus="rules" focusKey={'r' + lv} hl={['rules']} />}
        code={<div className="zg-code">
          <Src lines={(() => { const L = srcLines(shown, { frame: 'body' }); return L.slice(0, -1).concat([{ key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }], L.slice(-1)); })()} className="zg-src"
            lineProps={(ln) => (ln.id === 'rules' ? { cls: 'is-hl' } : null)} />
          <LevelRow levels={LEVELS} value={lv} onPick={pickLv} canTap={canTap} seen={seen} led={led} />
        </div>} />
    </Stage>
  );
}

// ── 6. РАЗДЕЛЫ И ПОДРАЗДЕЛЫ. Уровни трёх заголовков — по плану турнира.
const S6_ORDER = ['rules', 'hints', 'prizes'];
function PlanCard({ cur, set }) {
  const pick = usePick();
  const row = (id, d) => (
    <span key={id} className={'zg-plan-r d' + d + (cur === id ? ' is-cur' : '') + (set[id] ? ' is-set' : '')} style={{ '--d': d }}>
      <span className="zg-plan-t">{pick(PAGE[id])}</span>
      {set[id] || id === 'name' ? <span className="zg-plan-h mono">h{id === 'name' ? 1 : set[id]}</span> : null}
    </span>
  );
  return (
    <div className="zg-plan" aria-label={pick(UI.plan)}>
      <span className="zg-plan-l">{pick(UI.plan)}</span>
      {row('name', 0)}{row('rules', 1)}{row('hints', 2)}{row('prizes', 1)}
    </div>
  );
}
function S6({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const [set, setSet] = useState(rec ? { rules: 2, hints: 3, prizes: 2 } : {});
  const cur = S6_ORDER.find((id) => !set[id]) || null;
  const done = !cur;
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [miss, setMiss] = useState(0);
  const [flash, setFlash] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec ? c.done : c.say, pose: rec ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, S6_ORDER.indexOf(cur));
  const pickLv = (n) => {
    if (!canTap || !cur) return;
    const want = HEAD_LV[cur];
    if (n === want) {
      sfx('ok', true);
      const ns = Object.assign({}, set, { [cur]: n });
      setSet(ns); setMsg(null); ladder.reset();
      setFlash({ id: cur, n: Date.now() });
      if (!S6_ORDER.find((id) => !ns[id])) {
        put({ done: true });
        putAch(store, 'levels', miss ? 'help' : 'self');
        sayNow(c.done, 'cheer');
      }
      return;
    }
    sfx('soft', true); wobble(cur);
    setMiss((m) => m + 1);
    const lvN = ladder.bump();
    const why = n === 1 ? c.wrong.h1 : n > 3 ? c.wrong.deep : want === 2 ? c.wrong.sec : c.wrong.sub;
    const h = lvN >= 3 ? fillL(c.hints[2], { lv: 'h' + want }) : why;
    setMsg(h);
    sayNow(h, 'think');
  };
  const heads = { rules: set.rules || 0, hints: set.hints || 0, prizes: set.prizes || 0 };
  const raw = docLines(pick, { heads, paras: [] });
  const lines = srcLines(raw.filter((b) => b.id !== 'r2'), { frame: 'body', collapse: (b) => TEXT_IDS.indexOf(b.id) >= 0 }).map((ln) => {
    if (S6_ORDER.indexOf(ln.id) >= 0 && !set[ln.id]) {
      return Object.assign({}, ln, { tag: 'h1', toks: [{ k: 'node', node: <HSlot on={ln.id === cur} led={led && ln.id === cur} />, z: ln.id + ':o' },
        { k: 'text', v: pick(PAGE[ln.id]), z: ln.id + ':t' }] });
    }
    return ln;
  });
  const ask = done ? c.askDone : fillL(c.ask, { x: PAGE[cur] });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus={cur || 'prizes'} focusKey={cur || 'end'} />}
        code={<div className="zg-code">
          <div className="zg-s6">
            <PlanCard cur={cur} set={Object.assign({ name: 1 }, set)} />
            <Src lines={lines} numbers={false} className="zg-src zg-src-nonum" lineProps={(ln) => (ln.id === cur ? { cls: 'is-hl' + (shake === cur ? ' zg-shake' : '') } : null)} />
          </div>
          {!done ? <LevelRow levels={[1, 2, 3, 4]} value={null} onPick={pickLv} canTap={canTap} led={led} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 7. ЗАКРОЙ ЗАГОЛОВОК. Без </h2> «Призы» захватывают текст ниже.
function S7({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const done = !!rec;
  const ty = useTagTyping({ max: 8 });
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, ty.val.length);
  const check = () => {
    if (!canTap || done) return;
    const issue = tagTypingIssue(ty.val, 'h2', c.msgs);
    if (!issue) {
      sfx('ok', true); put({ done: true }); setMsg(null);
      putAch(store, 'close', ladder.ref.current ? 'help' : 'self');
      sayNow(c.done, 'cheer');
      return;
    }
    sfx('soft', true); wobble('in');
    const lv = ladder.bump();
    const h = lv >= 3 ? c.hints[2] : (normTag(ty.val) ? issue : c.hints[lv - 1]);
    setMsg(h);
    sayNow(h, 'think');
  };
  const raw = docLines(pick, { paras: [] });
  // Честное превью: незакрытый h2 забирает текст после себя.
  const shownBlocks = done ? glue(raw) : glue(raw.slice(0, 6)).concat([blk('prizes', 'h2', pick(PAGE.prizes) + ' ' + pick(PAGE.zp))]);
  const lines = srcLines(raw, { frame: 'body', collapse: (b) => b.id !== 'zp' && TEXT_IDS.indexOf(b.id) >= 0 }).map((ln) => {
    if (ln.id !== 'prizes') return ln;
    const toks = ln.toks.slice(0, 2);
    return Object.assign({}, ln, { toks: done ? ln.toks : toks.concat([{ k: 'node', node: (
      <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} placeholder={L3('</…>', '</…>', '</…>')} max={8}
        label={c.hints[2]} onEnter={check} cls={'tk-input-tag zg-in-tag' + (led ? ' is-led-in' : '') + (shake === 'in' ? ' zg-shake' : '')} />
    ) }]) });
  });
  const ask = done ? c.askDone : fillL(c.ask, { x: PAGE.prizes });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={shownBlocks} focus="prizes" focusKey={done ? 'f1' : 'f0'} hl={done ? null : ['prizes']}
          flash={done ? { id: 'prizes', n: 1 } : null} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id === 'prizes' && !done ? { cls: 'is-hl zg-typing' } : null)} />
          {!done ? <KeyRow keys={['<', '/', '>']} ty={ty} canTap={canTap} onCheck={check} ready={normTag(ty.val).length >= 4} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 8. АБЗАЦЫ. Две фразы «Правил» слиплись — каждую в свой <p>.
const S8_IDS = ['r1', 'r2'];
function S8({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const [wrapped, setWrapped] = useState(rec ? S8_IDS.slice() : []);
  const done = !!rec;
  const [flash, setFlash] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const next = S8_IDS.find((id) => wrapped.indexOf(id) < 0) || null;
  const led = useIdleLed(canTap && !done, wrapped.length);
  const tap = (id) => {
    if (!canTap || done || wrapped.indexOf(id) >= 0) return;
    sfx('pop', true);
    const nw = wrapped.concat(id);
    setWrapped(nw);
    setFlash({ id, n: Date.now() });
    if (nw.length >= 2) { put({ done: true }); sayNow(c.done, 'cheer'); } else sayNow(c.first, 'rule');
  };
  const raw = docLines(pick, { paras: done ? TEXT_IDS : wrapped });
  const lines = srcLines(raw, { frame: 'body', collapse: (b) => !done && (b.id === 'hp' || b.id === 'zp') });
  const ask = done ? c.askDone : wrapped.length ? c.ask2 : c.ask1;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} n={done ? null : wrapped.length + '/2'} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus="r1" focusKey={'w' + wrapped.length} hl={done ? null : ['r1', 'r2']} />}
        code={<Src lines={lines} className="zg-src" lineProps={(ln) => (S8_IDS.indexOf(ln.id) >= 0 && !done ? {
          onTap: () => tap(ln.id), disabled: !canTap || wrapped.indexOf(ln.id) >= 0, led: led && ln.id === next,
          cls: wrapped.indexOf(ln.id) >= 0 ? 'zg-in' : 'zg-loose'
        } : (done && TEXT_IDS.indexOf(ln.id) >= 0 && S8_IDS.indexOf(ln.id) < 0 ? { cls: 'zg-in' } : null))} />} />
    </Stage>
  );
}

// ── 9. ВАЖНЫЕ СЛОВА. Выбрать слова касаниями и поставить <b>, потом <i>.
function MarkRow({ onPick, canTap, ready, led }) {
  const pick = usePick();
  return (
    <div className="zg-marks" translate="no">
      <button type="button" className={'zg-mark' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={() => onPick('b')}>
        <Tag tag="b" /><b>{pick(UI.bold)}</b><Led on={!!led} />
      </button>
      <button type="button" className={'zg-mark' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={() => onPick('i')}>
        <Tag tag="i" /><i>{pick(UI.italic)}</i><Led on={!!led} />
      </button>
    </div>
  );
}
function S9({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const [round, setRound] = useState(rec ? 2 : 0);   // 0 — b, 1 — i, 2 — готово
  const done = round >= 2;
  const [sel, tapWord, setSel] = useWordSel();
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (sel ? 1 : 0) + round * 2);
  const tag = round === 0 ? 'b' : 'i';
  const id = round === 0 ? 'r2' : 'zp';
  const frag = pick(round === 0 ? PAGE.fragB : PAGE.fragI);
  const toks = useMemo(() => toTokens(pick(PAGE[id])), [id, pick]); // eslint-disable-line react-hooks/exhaustive-deps
  const target = findRange(toks, frag);
  const onWord = (i) => { if (!canTap || done) return; sfx('tap', true); setMsg(null); tapWord(i); };
  const onTag = (t) => {
    if (!canTap || done) return;
    if (!sel) { sfx('soft', true); setMsg(c.noSel); return; }
    const okSel = target && sel.a === target[0] && sel.b === target[1];
    if (!okSel) {
      sfx('soft', true);
      const lv = ladder.bump();
      const h = lv >= 3 ? c.hints3 : fillL(c.wrongSel, { f: frag });
      setMsg(h); setSel(null); sayNow(h, 'think');
      return;
    }
    if (t !== tag) { sfx('soft', true); ladder.bump(); setMsg(c.wrongTag[tag]); sayNow(c.wrongTag[tag], 'think'); return; }
    sfx('ok', true);
    setFlash({ id, n: Date.now() });
    setSel(null); setMsg(null); ladder.reset();
    if (round === 0) { setRound(1); sayNow(c.okB, 'smile'); } else { setRound(2); put({ done: true }); sayNow(c.done, 'cheer'); }
  };
  const marks = { r2: round > 0, zp: round > 1 };
  const raw = docLines(pick, { marks: false }).map((b) => {
    if (b.id === 'r2' && marks.r2) return blk('r2', 'p', markParts(pick(PAGE.r2), pick(PAGE.fragB), 'b'));
    if (b.id === 'zp' && marks.zp) return blk('zp', 'p', markParts(pick(PAGE.zp), pick(PAGE.fragI), 'i'));
    return b;
  });
  // Только два раздела, где выделяем: «Правила» и «Призы» — остальное не мешает.
  const lines = srcLines(raw.filter((b) => ['rules', 'r1', 'r2', 'prizes', 'zp'].indexOf(b.id) >= 0), { frame: 'none', collapse: (b) => b.id === 'r1' })
    .map((ln) => Object.assign({}, ln, { d: 0 }));
  lines.splice(3, 0, { key: 'gap', d: 0, toks: [{ k: 'text', v: '…', dim: true }] });
  const goal = round === 0 ? fillL(c.goals.b, { f: frag }) : c.goals.i;
  const ask = done ? c.askDone : msg || (sel ? c.askTag : c.askSel);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      {!done ? <GoalCard goal={goal} n={round + 1} total={2} /> : <GoalCard done doneText={c.askDone} />}
      {!done ? <Ask text={sel ? c.askTag : c.askSel} hint={msg} /> : null}
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus={id} focusKey={'m' + round} hl={done ? null : [id]} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id === id && !done ? {
            cls: 'is-hl',
            content: <><Tag tag="p" /><WordLine toks={toks} marks={[]} sel={sel} onWord={onWord} canTap={canTap} led={led && !sel}
              hlRange={ladder.level >= 3 ? target : null} /><Tag tag="p" close /></>
          } : null)} />
          {!done ? <MarkRow onPick={onTag} canTap={canTap} ready={!!sel} led={led && !!sel} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 10. ПРОВЕРКА. Страница финала: три поломки — найти строку и выбрать исправление.
const BUGS = ['one', 'closed', 'para'];
const BUG_LINE = { one: 'f2', closed: 'f5', para: 'f6' };
function finLines(pick, fixed) {
  const whenParts = fixed.closed
    ? [txt(pick(FIN.whenPre)), { k: 'b', v: pick(FIN.whenB) }, txt(pick(FIN.whenPost))]
    : [txt(pick(FIN.whenPre)), { k: 'b', v: pick(FIN.whenB) + pick(FIN.whenPost) }];
  return [
    blk('f1', 'h1', pick(FIN.title)),
    blk('f2', fixed.one ? 'h2' : 'h1', pick(FIN.teams)),
    blk('f3', 'p', pick(FIN.teamsP)),
    blk('f4', 'h2', pick(FIN.when)),
    blk('f5', 'p', whenParts),
    blk('f6', fixed.para ? 'p' : 'h2', pick(FIN.free))
  ];
}
function S10({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const [fixed, setFixed] = useState(rec ? { one: true, closed: true, para: true } : {});
  const [found, setFound] = useState(null);
  const done = BUGS.every((k) => fixed[k]);
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [helped, setHelped] = useState(false);
  const [flash, setFlash] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, Object.keys(fixed).length * 2 + (found ? 1 : 0));
  const openBug = BUGS.find((k) => !fixed[k]);
  const tapLine = (lineId) => {
    if (!canTap || done) return;
    const bug = BUGS.find((k) => BUG_LINE[k] === lineId && !fixed[k]);
    if (!bug) {
      sfx('soft', true); wobble(lineId); setHelped(true);
      const lv = ladder.bump();
      const h = lv >= 2 ? c.hints[lv - 1] : c.fine;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('tap', true); setFound(bug); setMsg(null);
    sayNow(c.bugs[bug].found, 'point');
  };
  const fix = (f) => {
    if (!canTap || !found) return;
    if (!f.ok) { sfx('soft', true); setHelped(true); setMsg(c.bugs[found].bad); sayNow(c.bugs[found].bad, 'think'); return; }
    sfx('ok', true);
    const nf = Object.assign({}, fixed, { [found]: true });
    setFixed(nf); setFlash({ id: BUG_LINE[found], n: Date.now() });
    setFound(null); setMsg(null); ladder.reset();
    if (BUGS.every((k) => nf[k])) {
      put({ done: true });
      putAch(store, 'fix', helped ? 'help' : 'self');
      sayNow(c.done, 'cheer');
    } else sayNow(c.fixed, 'smile');
  };
  const raw = finLines(pick, fixed);
  // Честное превью: незакрытый <b> делает жирным всё ниже по странице.
  const shownBlocks = fixed.closed ? raw : raw.map((b, i) => (i > 4 ? Object.assign({}, b, { parts: b.parts.map((x) => ({ k: 'b', v: x.v })) }) : b));
  const lines = srcLines(raw, { frame: 'body' }).map((ln) => {
    if (ln.id !== 'f5' || fixed.closed) return ln;
    const t = ln.toks;   // open p, pre, open b, text, close b, close p → без close b
    return Object.assign({}, ln, { toks: t.filter((x) => !(x.k === 'close' && x.tag === 'b')) });
  });
  const markLine = ladder.level >= 3 && openBug ? BUG_LINE[openBug] : null;
  // Найденная поломка — её правило первым: на телефоне видно именно его.
  const rules = (found ? [found].concat(BUGS.filter((k) => k !== found)) : BUGS).map((k) => ({ id: k, ok: !!fixed[k], text: c.rules[k] }));
  const ask = done ? c.askDone : found ? c.askFix : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <div className="zg-insp"><Inspector rules={rules} /></div>
      {!done ? <Ask text={ask} hint={msg} /> : null}
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(FIN.title)} blocks={shownBlocks} flash={flash} focus={found ? BUG_LINE[found] : 'f2'} focusKey={(found || '') + Object.keys(fixed).join('')}
          hl={found ? [BUG_LINE[found]] : null} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id ? {
            onTap: () => tapLine(ln.id), disabled: !canTap || done || !!found,
            led: (led && !found && ln.id === markLine) || (ln.id === markLine),
            cls: (found && BUG_LINE[found] === ln.id ? 'is-hl' : '') + (shake === ln.id ? ' zg-shake' : '')
              + (BUGS.some((k) => fixed[k] && BUG_LINE[k] === ln.id) ? ' zg-fixed' : '')
          } : null)} />
          {found ? (
            <div className="zg-fixes" role="group">
              {c.fixes[found].map((f) => (
                <button key={f.id} type="button" className="zg-fix" disabled={!canTap} onClick={() => fix(f)}>
                  <span translate="no">{pick(f.label)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>} />
    </Stage>
  );
}

// ── 11. НОВЫЙ РАЗДЕЛ. Строка заголовка целиком: <h2>Финал</h2>.
// Разбор набранной строки — честно, как браузер: тег, текст, закрыт ли.
function parseLine(raw) {
  const s = String(raw || '').trim();
  const m = s.match(/^<\s*([a-z0-9]+)\s*>([\s\S]*)$/i);
  if (!m) return { tag: null, text: s };
  const tag = m[1].toLowerCase();
  const c = m[2].match(/^([\s\S]*?)<\s*(\/?)\s*([a-z0-9]*)\s*>\s*$/i);
  if (c) return { tag, text: c[1].trim(), close: true, slash: !!c[2], closeTag: c[3].toLowerCase() };
  return { tag, text: m[2].replace(/<[^>]*$/, '').trim(), close: false };
}
function lineIssue(raw, msgs) {
  const s = String(raw || '').trim();
  if (!s) return msgs.empty;
  const r = parseLine(s);
  if (!r.tag) return msgs.noTag;
  if (r.tag === 'h1') return msgs.h1;
  if (/^h[3-6]$/.test(r.tag)) return msgs.deep;
  if (r.tag === 'p') return msgs.p;
  if (r.tag !== 'h2') return msgs.other;
  if (!hasLetters(r.text)) return msgs.noText;
  if (!r.close) return msgs.noClose;
  if (!r.slash) return msgs.noSlash;
  if (r.closeTag !== 'h2') return msgs.mismatch;
  return null;
}
function liveBlock(raw) {
  const r = parseLine(raw);
  if (!String(raw || '').trim()) return null;
  if (r.tag && /^(h[1-6]|p)$/.test(r.tag)) return blk('fh', r.tag, r.text || '​');
  return blk('fh', null, r.tag ? r.text : String(raw).trim());
}
function S11({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const done = !!(rec && rec.done);
  const ty = useTagTyping({ max: 40 });
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, ty.val.length);
  const check = () => {
    if (!canTap || done) return;
    const issue = lineIssue(ty.val, c.msgs);
    if (!issue) {
      const r = parseLine(ty.val);
      sfx('ok', true); setMsg(null);
      put({ done: true, text: r.text, line: ty.val.trim() });
      putAch(store, 'write', ladder.ref.current ? 'help' : 'self');
      sayNow(c.done, 'cheer');
      return;
    }
    sfx('soft', true); wobble('in');
    const lv = ladder.bump();
    const h = lv >= 3 ? c.hints[2] : issue;
    setMsg(h); sayNow(h, 'think');
  };
  const base = docLines(pick, { marks: true });
  const nb = done ? blk('fh', 'h2', rec.text) : liveBlock(ty.val);
  const monBlocks = base.concat(nb ? [nb] : [], [blk('fp', 'p', pick(PAGE.finalP))]);
  const codeBase = srcLines(base, { frame: 'none', collapse: (b) => b.id !== 'prizes' && b.id !== 'zp' })
    .filter((ln) => ['prizes', 'zp'].indexOf(ln.id) >= 0).map((ln) => Object.assign({}, ln, { d: 1 }));
  const fp = srcLines([blk('fp', 'p', pick(PAGE.finalP))], { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1 }));
  const typeLine = done ? srcLines([blk('fh', 'h2', rec.text)], { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1, cls: 'zg-in' }))
    : [{ key: 'type', id: 'type', d: 1, toks: [{ k: 'node', node: (
      <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} placeholder={c.ph} max={40}
        label={c.ph} onEnter={check} cls={'tk-input-tag zg-in-line' + (led ? ' is-led-in' : '') + (shake === 'in' ? ' zg-shake' : '')} />
    ) }] }];
  const lines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }, { key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }]
    .concat(codeBase, typeLine, fp, [{ key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const ask = done ? c.askDone : fillL(c.ask, { f: PAGE.final, x: PAGE.prizes });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={monBlocks} focus="fp" focusKey={done ? 'd' : 't' + (nb ? nb.tag : '')}
          flash={done ? { id: 'fh', n: 1 } : null} hl={done ? null : ['fh']} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id === 'type' ? { cls: 'is-hl zg-typing' } : ln.id === 'prizes' ? { cls: 'zg-keep' } : ln.cls ? { cls: ln.cls } : null)} />
          {!done ? <KeyRow keys={['<', '/', '>']} ty={ty} canTap={canTap} onCheck={check} ready={/<\s*\/\s*h2\s*>\s*$/i.test(ty.val)} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 12. СВОЙ РАЗДЕЛ. Заголовок h2, абзац p, одно слово — <b>.
const okWords = (s) => String(s || '').trim().split(/\s+/).filter((w) => /[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ]/.test(w)).length;
function S12({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const [head, setHead] = useState(rec ? rec.head : '');
  const [text, setText] = useState(rec ? rec.text : '');
  const [phase, setPhase] = useState(rec && rec.done ? 'done' : 'head');   // head · text · bold · done
  const [boldAt, setBoldAt] = useState(rec && rec.done ? rec.boldAt : null);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const headRef = useRef(null), textRef = useRef(null);
  const toks = useMemo(() => toTokens(text), [text]);
  const headOk = hasLetters(head) && !hasTags(head);
  const textOk = okWords(text) >= 2 && !hasTags(text);
  const done = phase === 'done' && headOk && textOk;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, phase === 'head' ? head.length : phase === 'text' ? text.length + 100 : 999);
  // Раздел ученика — в хранилище и в артефакт (и после правки заголовка).
  const save = (h, i) => {
    const word = toks[i].v;
    const blocks = fullPage(pick, store).filter((b) => b.id !== 'oh' && b.id !== 'op')
      .concat([blk('oh', 'h2', h.trim()), blk('op', 'p', partsFrom(toks, [{ a: i, b: i, tag: 'b' }]))]);
    const title = pick(PAGE.name);
    put({ done: true, head: h.trim(), text: text.trim(), bold: word, boldAt: i, title, blocks });
    store.set('artifact', { type: 'html-page', title, blocks, html: buildHtml(title, blocks), mine: { head: h.trim(), text: text.trim(), bold: word } });
  };
  useEffect(() => { if (phase === 'done' && headOk && boldAt != null && toks[boldAt]) save(head, boldAt); }, [head]); // eslint-disable-line react-hooks/exhaustive-deps
  const commit = () => {
    if (!canTap) return;
    if (phase === 'head') {
      if (!headOk) { sfx('soft', true); wobble('head'); const h = hasTags(head) ? c.noTags : c.empty; setMsg(h); sayNow(h, 'think'); return; }
      sfx('ok', true); setMsg(null); setPhase('text');
      requestAnimationFrame(() => { if (textRef.current) textRef.current.focus(); });
      return;
    }
    if (phase === 'text') {
      if (!textOk) { sfx('soft', true); wobble('text'); const h = hasTags(text) ? c.noTags : c.short; setMsg(h); sayNow(h, 'think'); return; }
      sfx('ok', true); setMsg(null); setPhase('bold'); setBoldAt(null);
      if (textRef.current) textRef.current.blur();
    }
  };
  const onWord = (i) => {
    if (!canTap) return;
    if (!headOk) { sfx('soft', true); wobble('head'); const h = hasTags(head) ? c.noTags : c.empty; setMsg(h); sayNow(h, 'think'); return; }
    sfx('pop', true);
    setBoldAt(i);
    save(head, i);
    if (phase !== 'done') { setPhase('done'); setMsg(null); putAch(store, 'own', 'self'); sayNow(c.done, 'cheer'); }
  };
  const editText = () => { if (!canTap) return; sfx('tap', true); setPhase('text'); setBoldAt(null); requestAnimationFrame(() => { if (textRef.current) textRef.current.focus(); }); };
  const ownParts = boldAt != null && toks[boldAt] ? partsFrom(toks, [{ a: boldAt, b: boldAt, tag: 'b' }]) : [txt(text)];
  const monBlocks = docLines(pick, { marks: true }).concat(finalBlocks(pick, store),
    head.trim() ? [blk('oh', 'h2', head.trim())] : [], text.trim() ? [blk('op', 'p', ownParts)] : []);
  const headLine = { key: 'oh', id: 'oh', d: 1, tag: 'h2', toks: [{ k: 'open', tag: 'h2' }, { k: 'node', node: (
    <InlineInput value={head} onChange={setHead} inputRef={headRef} placeholder={c.phHead} max={40}
      label={c.conds.head} onEnter={commit} onFocus={() => { if (phase === 'text' && !textOk) setPhase('head'); }}
      cls={(led && phase === 'head' ? 'is-led-in' : '') + (shake === 'head' ? ' zg-shake' : '')} />
  ) }, { k: 'close', tag: 'h2' }] };
  const textNode = phase === 'bold' || phase === 'done'
    ? <><WordLine toks={toks} marks={boldAt != null ? [{ a: boldAt, b: boldAt, tag: 'b' }] : []} sel={null} onWord={onWord} canTap={canTap} led={led && phase === 'bold'} />
      <button type="button" className="zg-edit" onClick={editText} disabled={!canTap} aria-label={pick(UI.edit)}><Icon name="undo" size={14} /></button></>
    : (
      <InlineInput value={text} onChange={setText} inputRef={textRef} placeholder={c.phText} max={90}
        label={c.conds.text} onEnter={commit} onFocus={() => { if (phase === 'head' && headOk) setPhase('text'); }}
        cls={(led && phase === 'text' ? 'is-led-in' : '') + (shake === 'text' ? ' zg-shake' : '')} />
    );
  const textLine = { key: 'op', id: 'op', d: 1, tag: 'p', toks: [{ k: 'open', tag: 'p' }, { k: 'node', node: textNode }, { k: 'close', tag: 'p' }] };
  const lines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }, { key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }]
    .concat(srcLines(finalBlocks(pick, store), { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1 })),
      [headLine, textLine, { key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const conds = [{ id: 'head', ok: headOk && phase !== 'head', text: c.conds.head }, { id: 'text', ok: textOk && (phase === 'bold' || phase === 'done'), text: c.conds.text },
    { id: 'bold', ok: phase === 'done' && boldAt != null, text: c.conds.bold }];
  const ask = done ? c.askDone : phase === 'head' ? c.askHead : phase === 'text' ? c.askText : c.askBold;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <div className="zg-insp"><Conds title={UI.conds} items={conds} /></div>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={monBlocks} focus={text.trim() ? 'op' : 'oh'} focusKey={phase + ':' + (head ? 1 : 0) + (text ? 1 : 0)} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => ((ln.id === 'oh' && phase === 'head') || (ln.id === 'op' && phase !== 'head' && !done) ? { cls: 'is-hl zg-typing' } : null)} />
          {phase === 'head' || phase === 'text' ? (
            <div className="zg-go">
              <button type="button" className={'key-b key-go' + ((phase === 'head' ? headOk : textOk) ? ' is-ready' : '')} disabled={!canTap} onClick={commit}>
                <Icon name="check" size={16} />{pick(UI.ready)}
              </button>
            </div>
          ) : null}
        </div>} />
    </Stage>
  );
}

// ── 13. ФИНАЛ. Страница на мониторе зала, что получилось, следующий урок.
function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s13;
  const ach = store.get('ach') || {};
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const blocks = fullPage(pick, store);
  const own = ownBlocks(store).length ? 'oh' : 'fh';
  const list = ['levels', 'close', 'fix', 'write', 'own'].filter((k) => ach[k]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <div className="zg-fin">
        <div className="zg-fin-mon">
          <Monitor title={pick(PAGE.name)} blocks={blocks} focus={own} focusKey="fin" hl={ownBlocks(store).length ? ['oh', 'op'] : null} cls="zg-mon-hero" />
        </div>
        <div className="zg-fin-side">
          {list.length ? (
            <div className="ach" aria-label={pick(UI.done)}>
              {list.map((k) => (
                <span key={k} className={'ach-i' + (ach[k] === 'self' ? ' is-self' : '')}><span className="ach-m"><Icon name={ach[k] === 'self' ? 'star' : 'check'} size={12} /></span>{pick(c.ach[k][ach[k] === 'self' ? 'self' : 'help'])}</span>
              ))}
            </div>
          ) : null}
          <div className="bye-next next-card">
            <span className="bye-next-ic"><Icon name="list" size={22} /></span>
            <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(c.next)}</b></span>
            <span className="next-tags mono" translate="no">ul · ol · li</span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 }, { id: 's3', code: 'PREDICT', Comp: S3 },
  { id: 's4', code: 'SHOW', Comp: S4 }, { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-1', Comp: S6 },
  { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's9', code: 'LEVEL-4', Comp: S9 },
  { id: 's10', code: 'CHECK', Comp: S10 }, { id: 's11', code: 'TRANSFER', Comp: S11 }, { id: 's12', code: 'RESULT', Comp: S12 },
  { id: 's13', code: 'ACHIEVEMENT', Comp: S13 }
];
// «Повторить» стирает только этот экран; свой раздел (s12), артефакт и
// достижения (ach) повтор других экранов не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'] };

export default function HtmlZagolovkiMonitor({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: store.get('artifact') || makeArtifact(store), achievements: store.get('ach') || {} })
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
// CSS УРОКА: стили урока 2 (код, браузер, клавиши …) + кит anatomy + свои (zg-…).
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
.zg-mon [data-paint="shell"] { --anatomy-paper: #2C313C; --anatomy-top: #52565f; --anatomy-shade-3: #3d414c; --anatomy-shade-2: #2C313C; --anatomy-shade-1: #272b35; --anatomy-shade-0: #21252e; --anatomy-hi: #96989e; --anatomy-mid: #6b6f77; --anatomy-lo: #5a5e67; --anatomy-faint: #454a53; --anatomy-dot: #a0a2a7; }
.zg-mon [data-paint="neck"] { --anatomy-paper: #3A404D; --anatomy-top: #5d626d; --anatomy-shade-3: #4a4f5b; --anatomy-shade-2: #3A404D; --anatomy-shade-1: #333844; --anatomy-shade-0: #2c313b; --anatomy-hi: #9da0a6; --anatomy-mid: #757982; --anatomy-lo: #656a74; --anatomy-faint: #525762; --anatomy-dot: #a6a9af; }
.zg-mon [data-paint="base"] { --anatomy-paper: #353B47; --anatomy-top: #595e68; --anatomy-shade-3: #454b56; --anatomy-shade-2: #353B47; --anatomy-shade-1: #2f343e; --anatomy-shade-0: #282d36; --anatomy-hi: #9a9da3; --anatomy-mid: #72767e; --anatomy-lo: #61666f; --anatomy-faint: #4d535d; --anatomy-dot: #a4a7ac; }
/* ══ МОНИТОР (навык anatomy) ══════════════════════════════════════════
   Корпус — SVG фигуры; экран — мини-браузер, развёрнутый матрицей по стеклу.
   --zg-mh — сколько монитор может занять по высоте; ширина — по пропорции. */
.zg-mon { position: relative; width: min(100%, calc(var(--zg-mh, 40dvh) * var(--ar, 1.24))); aspect-ratio: var(--ar, 1.24);
  margin: 0 auto; flex: 0 0 auto; -webkit-tap-highlight-color: transparent; background: transparent; }
.zg-mon-svg, .zg-mon-svg > svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.zg-mon-svg > svg { overflow: hidden; }   /* кадр без подставки обрезает рисунок по viewBox */
.zg-mon .mon-glass { fill: #10141b; transition: fill .6s; }
.zg-mon.is-on .mon-glass { fill: #fff; }
.zg-mon .mon-glare { fill: #fff; opacity: .07; }
.zg-mon.is-on .mon-glare { opacity: 0; }
.zg-mon .mon-bezel { fill: #12161c; }
.zg-mon .mon-hole, .zg-mon .mon-slot { fill: #0e1116; opacity: .7; }
.zg-mon .mon-cam { fill: #07090c; }
.zg-mon .mon-led { fill: #5d6573; transition: fill .4s; }
.zg-mon.is-on .mon-led { fill: #36d17a; filter: drop-shadow(0 0 2.5px #36d17a); }
.zg-mon .iso-halo { opacity: .5; }
.zg-mon.is-tap { cursor: pointer; }
.zg-mon.is-tap:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 4px; border-radius: 14px; }
.zg-mon.is-led .zg-mon-svg { animation: zgMonLed 1.3s ease-in-out infinite; }
@keyframes zgMonLed { 0%, 100% { filter: drop-shadow(0 0 0 rgba(255,79,40,0)); } 50% { filter: drop-shadow(0 0 7px rgba(255,79,40,.85)); } }

/* Экран: слой в плоскости стекла. */
.zg-scr { position: absolute; left: 0; top: 0; transform-origin: 0 0; overflow: hidden; }
.zg-scr-in { position: relative; width: 100%; height: 100%; opacity: 0; transition: opacity .35s ease; transform-origin: 50% 50%; }
.zg-mon.is-on .zg-scr-in { opacity: 1; }
.zg-mon:not(.is-on) .zg-scr { pointer-events: none; }
.zg-mon.is-boot .zg-scr-in { animation: zgBoot 1.15s cubic-bezier(.2,.8,.3,1) both; }
@keyframes zgBoot {
  0% { opacity: 0; transform: scaleY(.015); filter: brightness(4); }
  28% { opacity: 1; transform: scaleY(.015); filter: brightness(4); }
  55% { transform: scaleY(1); filter: brightness(1.7); }
  100% { transform: none; filter: none; }
}
.zg-mb.mb { height: 100%; display: flex; flex-direction: column; border-radius: 0; box-shadow: none; }
.zg-mb .mb-top { height: 24px; flex: 0 0 auto; gap: 6px; padding: 0 8px; }
.zg-mb .mb-tab { font-size: 11.5px; height: 80%; padding: 0 8px; }
.zg-mb .mb-win i { width: 20px; }
.zg-mb .mb-page { flex: 1 1 auto; min-height: 0 !important; padding: 6px 12px 8px; overflow-y: auto; overscroll-behavior: contain;
  scrollbar-width: thin; scrollbar-color: rgba(0,0,0,.22) transparent; }
.zg-mb .mb-page::-webkit-scrollbar { width: 4px; }
.zg-mb .mb-page::-webkit-scrollbar-thumb { background: rgba(0,0,0,.22); border-radius: 4px; }
.zg-mb .mb-doc { font-size: 14px; line-height: 1.25; }
.zg-badge { position: absolute; right: 8px; bottom: 8px; z-index: 2; padding: 3px 10px; border-radius: 99px;
  background: rgba(14,14,16,.8); color: #fff; font: 700 11px/1.4 'Manrope', sans-serif; pointer-events: none;
  animation: zgBadge 1.8s ease both; }
@keyframes zgBadge { 0% { opacity: 0; transform: translateY(4px); } 12%, 75% { opacity: 1; transform: none; } 100% { opacity: 0; } }

/* Раскладки: крючок и финал — монитор целиком; рабочие экраны — монитор + код. */
.zg-hall { display: flex; justify-content: center; width: 100%; }
.zg-mon-hero { --zg-mh: min(46dvh, 440px); }
@media (min-width: 720px) { .zg-mon-hero { --zg-mh: min(40dvh, 420px); } }
.zg-acts { display: flex; justify-content: center; min-height: 52px; }
.zg-act { position: relative; gap: 8px; }
.zg-work { --zg-mh: min(29dvh, 300px); }
.zg-work .work-b { display: flex; justify-content: center; min-width: 0; }
.zg-work-sm { --zg-mh: min(25dvh, 260px); }
@media (min-width: 720px) {
  .zg-work { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); --zg-mh: min(46dvh, 440px); }
  .zg-work-sm { --zg-mh: min(40dvh, 400px); }
}
.zg-code { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.zg-src .src-line.zg-gap .src-code::after { content: '↵'; color: ${T.ink3}; opacity: .55; margin-left: 2px; }
.zg-src .src-line.zg-in .tk-tag { animation: zgTagIn .55s cubic-bezier(.34,1.45,.5,1) both; }
@keyframes zgTagIn { 0% { opacity: 0; transform: scale(.4); } 100% { opacity: 1; transform: none; } }
.zg-src .src-line.zg-loose .tk-tx { text-decoration: underline dashed color-mix(in srgb, ${TAGC.p} 70%, transparent); text-underline-offset: 3px; }
.zg-src .src-line.zg-fixed { background: color-mix(in srgb, ${T.success} 10%, transparent); }
.zg-src .src-line.zg-typing { background: color-mix(in srgb, ${T.ui} 6%, transparent); }
.zg-src .tk-input { font-size: 16px; }
.zg-src .tk-input.zg-in-tag { min-width: 6ch; }
.zg-code .keys { gap: 5px; }

/* Клавиша Enter (эксперимент): в правом нижнем углу кода — строки короткие. */
.zg-code-enter { position: relative; }
.zg-code-enter .zg-enter { position: absolute; right: 10px; bottom: 10px; }
.zg-src .src-line.zg-gap { min-height: .9em; }
.zg-enter { position: relative; align-self: center; display: inline-flex; align-items: center; gap: 12px; min-height: 50px; padding: 8px 26px;
  border-radius: 12px; border: none; background: #fff; color: ${T.ink}; cursor: pointer; font: 800 17px/1 'Manrope', sans-serif;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.18), 0 4px 0 rgba(${T.shadowBase},0.22); transition: transform .08s, box-shadow .08s; }
.zg-enter:active:not(:disabled) { transform: translateY(3px); box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.18), 0 1px 0 rgba(${T.shadowBase},0.22); }
.zg-enter:disabled { opacity: .55; cursor: default; }
.zg-enter-a { font-size: 22px; color: ${T.uiDk}; }

/* Слот уровня заголовка. */
.zg-slot { position: relative; display: inline-flex; align-items: center; padding: 0 6px; margin-right: 4px; border-radius: 6px;
  border: 1.5px dashed ${TAGC.h}; color: ${TAGC.h}; font-weight: 800; line-height: 1.35; }
.zg-slot.is-on { background: color-mix(in srgb, ${TAGC.h} 12%, #fff); }

/* План турнира: рядом с кодом. */
.zg-s6 { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 8px; align-items: start; }
.zg-src-nonum { --gut: .95em; --ind: .9em; }
.zg-plan { display: flex; flex-direction: column; gap: 1px; padding: 7px 12px 8px; border-radius: 14px; background: ${T.paper};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); }
.zg-plan-l { font: 800 10.5px/1.4 'Manrope', sans-serif; letter-spacing: .08em; text-transform: uppercase; color: ${T.ink2}; }
.zg-plan-r { position: relative; display: flex; align-items: center; gap: 8px; padding-left: calc(var(--d) * 20px);
  font: 700 14px/1.4 'Manrope', sans-serif; color: ${T.ink}; }
.zg-plan-r.d1::before, .zg-plan-r.d2::before { content: '└'; position: absolute; left: calc(var(--d) * 20px - 14px);
  color: ${T.ink3}; font-weight: 400; }
.zg-plan-r.is-cur .zg-plan-t { color: ${TAGC.h}; text-decoration: underline 2px; text-underline-offset: 3px; }
.zg-plan-h { padding: 0 6px; border-radius: 6px; background: color-mix(in srgb, ${TAGC.h} 12%, #fff); color: ${TAGC.h}; font-size: 12px; font-weight: 800; }

/* Кнопки b / i. */
.zg-marks { display: flex; justify-content: center; gap: 8px; }
.zg-mark { position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: 46px; padding: 6px 16px; border-radius: 12px;
  border: none; background: #fff; color: ${T.ink}; cursor: pointer; font: 600 15px/1 'Manrope', sans-serif;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.16); }
.zg-mark .tk-tag { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; }
.zg-mark.is-ready { box-shadow: inset 0 0 0 2px ${TAGC.em}; }
.zg-mark:disabled { opacity: .55; cursor: default; }

/* Исправления (проверка). */
@media (max-width: 719px) {
  .zg-insp .insp-h { display: none; }
  .zg-insp .insp-r { font-size: 12.5px; padding: 3px 9px 3px 4px; }
}
.zg-fixes { display: flex; flex-wrap: nowrap; justify-content: center; gap: 8px; animation: zgUp .3s ease both; }
.zg-fix { flex: 0 1 auto; min-height: 46px; padding: 8px 14px; border-radius: 12px; border: none; background: #fff; color: ${T.ink}; cursor: pointer;
  font: 700 15px/1.2 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px ${T.ui}, 0 3px 0 ${T.uiSoft}; }
.zg-fix:disabled { opacity: .55; cursor: default; }
@keyframes zgUp { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: none; } }

/* Ввод. */
.zg-shake { animation: shake .4s; }
.zg-src .tk-input.zg-in-line { max-width: 100%; }
.zg-go { display: flex; justify-content: center; }
.zg-go .key-go { min-height: 44px; gap: 6px; }
.zg-edit { display: inline-grid; place-items: center; width: 28px; height: 28px; margin-left: 6px; vertical-align: middle; border-radius: 8px;
  border: none; background: ${T.uiSoft}; color: ${T.uiDk}; cursor: pointer; }

/* Финал. */
.zg-fin { display: grid; gap: 12px; width: 100%; }
.zg-fin-side { display: flex; flex-direction: column; gap: 10px; align-items: center; }
@media (min-width: 900px) { .zg-fin { grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); align-items: center; } }
.zg-fin .zg-mon-hero { --zg-mh: min(42dvh, 430px); }
.ach { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.ach-i { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px 5px 6px; border-radius: 99px; background: #fff; color: ${T.ink};
  font: 700 13px 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14); }
.ach-m { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: ${T.ink3}; color: #fff; }
.ach-i.is-self { box-shadow: inset 0 0 0 1.5px ${T.success}; }
.ach-i.is-self .ach-m { background: ${T.success}; }
.bye-next.next-card { width: 100%; max-width: 420px; align-self: center; background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 0 0 0 1.5px ${T.uiSoft}; }
.next-card .bye-next-ic { background: ${T.uiSoft}; color: ${T.uiDk}; border: none; }
.next-card .bye-next-t span { color: ${T.ink2}; }
.next-card .bye-next-t b { color: ${T.ink}; }
.next-tags { margin-left: auto; padding-left: 8px; color: ${T.uiDk}; font-size: 14px; font-weight: 700; white-space: nowrap; }

/* Низкие экраны: монитор уступает место коду. */
@media (max-height: 700px) {
  .zg-work { --zg-mh: min(25dvh, 240px); }
  .zg-work-sm { --zg-mh: min(21dvh, 210px); }
  .zg-mon-hero { --zg-mh: min(40dvh, 360px); }
}
/* Открытая клавиатура: остаются задание, строка ввода и клавиши. */
.is-kbd .zg-work .work-b, .is-kbd .zg-plan, .is-kbd .zg-conds, .is-kbd .goal { display: none; }
.is-kbd .stage .ask.zg-ask { display: block; font-size: 14px; line-height: 1.3; }
.is-kbd .zg-src .src-line:not(.zg-typing):not(.is-hl):not(.zg-keep) { display: none; }

@media (prefers-reduced-motion: reduce) {
  .zg-mon.is-boot .zg-scr-in, .zg-src .src-line.zg-in .tk-tag, .zg-badge, .zg-fixes, .zg-mon.is-led .zg-mon-svg { animation: none; }
  .zg-scr-in, .zg-mon .mon-glass { transition: none; }
}
`;
