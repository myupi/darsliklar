// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Заголовки и текст: турнир Пикселя» — урок 2 курса HTML, вариант 10
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node tools/zagolovki-turnir/turnir.build.mjs → lessons/test/10-zagolovki-i-tekst-turnir-pixel.jsx
// Правится исходник tools/zagolovki-turnir/ (turnir.src.jsx, tr-own.css), а не этот файл.
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
// ===== УРОК 2 · «Заголовки и текст» · модуль 1 «Основы разметки» · ТЕСТ (вариант 10) =====
//
// ЗАМЫСЕЛ. Продолжение урока 1 с роботом Пикселем: у Пикселя есть страница игры
// «Битва знаний», теперь он готовит турнир. На странице весь текст одинаковый —
// игроки теряются. Ученик превращает сплошной текст в понятную страницу:
// главный заголовок, разделы, подразделы, абзацы, ключевые слова, мысли. В финале
// Пиксель показывает страницу ученика игрокам.
// Описание: docs/urok-10-zagolovki-turnir-pixel-opisanie.md.
//
// ДУГА (14). Игроки запутались → h1 → title или h1 → p → h2 → h3 → шесть уровней →
// редактор перепутал уровни → b → i → что изменится → почини строку → твой турнир →
// страница готова.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Работа внутри body: код и мини-браузер строятся из одной модели блоков
//     { id, tag, parts } (помощники урока 2); сохраняемый HTML — buildHtml (с
//     экранированием) из той же модели.
//   · Заголовки — отдельными строками внутри body, без вложения h2 в h1.
//   · Превью честное: строки без тегов склеиваются, Enter в коде абзаца не создаёт,
//     незакрытый <b> захватывает текст ниже.
//   · Учёт: на каждый экран — ряд журнала { done, correct, firstTry, attempts, hints,
//     helped, strongHelp, stages }; раунды и дополнительные примеры (ключ + 'x')
//     хранятся отдельно в store 'st:<экран>' — «Повторить» их не стирает.
//   · После сильной помощи (третья ступень подсказки) — короткий новый пример.
//   · Прогресс живёт в памяти до конца урока; после перезагрузки урок начинается заново.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================

const META = {
  lessonId: 'test-html-zagolovki-turnir-pixel',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'Sarlavhalar va matn: Piksel turniri',
    ru: 'Заголовки и текст: турнир Пикселя',
    en: 'Headings and text: Pixel’s tournament'
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
  inspector: L3('Tuzilma qoidasi', 'Правило структуры', 'Structure rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  now: L3('Hozir', 'Сейчас', 'Now'),
  want: L3('Kerakli ko‘rinish', 'Как надо', 'How it should be'),
  tab: L3('Yorliqda', 'На вкладке', 'On the tab'),
  page: L3('Sahifada', 'На странице', 'On the page'),
  nextQ: L3('Keyingi savol', 'Следующий вопрос', 'Next question'),
  nextLine: L3('Keyingi qator', 'Следующая строка', 'Next line'),
  extra: L3('Yangi misol', 'Новый пример', 'New example'),
  step: L3('Qadam', 'Шаг', 'Step'),
  bold: L3('qalin', 'жирный', 'bold'),
  italic: L3('kursiv', 'курсив', 'italic'),
  here: L3('shu yerga', 'сюда', 'here'),
  noChange: L3('O‘zgarmadi', 'Без изменений', 'No change'),
  pixel: L3('Robot Piksel o‘yin sahifasini ko‘rsatyapti', 'Робот Пиксель показывает страницу игры', 'Robot Pixel shows the game page'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  author: L3('Muallif', 'Автор', 'Author'),
  thoughtPre: L3('Piksel o‘yladi:', 'Пиксель подумал:', 'Pixel thought:'),
  edit: L3('O‘zgartirish', 'Изменить', 'Edit'),
  self: L3('maslahatsiz', 'без подсказок', 'no hints'),
  helped: L3('maslahat bilan', 'с подсказкой', 'with hints'),
  levelN: L3('{n}-daraja', 'Уровень {n}', 'Level {n}'),
  roles: {
    whole: L3('butun sahifa nomi', 'название всей страницы', 'name of the whole page'),
    section: L3('bo‘lim nomi', 'название раздела', 'section name'),
    sub: L3('kichik bo‘lim nomi', 'название подраздела', 'subsection name')
  },
  tourn: L3('Turnir!', 'Турнир!', 'Tournament!'),
  kodi: L3('Kodi', 'Коди', 'Kodi')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА ИГРЫ ПИКСЕЛЯ — на языке ученика.
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  name: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  welcome: L3('O‘yinga xush kelibsiz!', 'Добро пожаловать в игру!', 'Welcome to the game!'),
  rules: L3('O‘yin qoidalari', 'Правила игры', 'Game rules'),
  rulesP: L3('Savolni o‘qing va javobni tanlang.', 'Читай вопрос и выбирай ответ.', 'Read the question and pick an answer.'),
  round: L3('Birinchi raund', 'Первый раунд', 'Round one'),
  roundP: L3('Raund mavzusi — hayvonlar.', 'Тема раунда — животные.', 'The round topic is animals.'),
  roundB: L3('hayvonlar', 'животные', 'animals'),
  thoughtP: L3('Piksel o‘yladi: Kim g‘olib bo‘larkin?', 'Пиксель подумал: Интересно, кто победит?', 'Pixel thought: I wonder who will win?'),
  thoughtI: L3('Kim g‘olib bo‘larkin?', 'Интересно, кто победит?', 'I wonder who will win?'),
  news: L3('Turnir yangiliklari', 'Новости турнира', 'Tournament news'),
  newsP: L3('Turnir shanba kuni boshlanadi.', 'Турнир начнётся в субботу.', 'The tournament starts on Saturday.'),
  newsB: L3('Turnir shanba kuni', 'Турнир начнётся', 'The tournament starts'),
  prizes: L3('Sovrinlar', 'Призы', 'Prizes'),
  prizesP: L3('G‘olibga — kubok.', 'Победителю — кубок.', 'The winner gets a cup.'),
  round2: L3('Ikkinchi raund', 'Второй раунд', 'Round two'),
  round2P: L3('Ikkinchi raund mavzusi — koinot.', 'Тема второго раунда — космос.', 'The second round topic is space.'),
  winP: L3('G‘olib kubok oladi.', 'Победитель получит кубок.', 'The winner will get a cup.'),
  winB: L3('kubok', 'кубок', 'cup'),
  timeP: L3('Javobga o‘n soniya beriladi.', 'На ответ — десять секунд.', 'You get ten seconds to answer.'),
  timeB: L3('o‘n soniya', 'десять секунд', 'ten seconds'),
  whisperP: L3('Piksel pichirladi: Albatta uddalayman!', 'Пиксель шепнул: Я точно справлюсь!', 'Pixel whispered: I can totally do this!'),
  whisperI: L3('Albatta uddalayman!', 'Я точно справлюсь!', 'I can totally do this!'),
  kodiP: L3('Kodi o‘yladi: Qiziq bo‘ladi!', 'Коди подумал: Будет весело!', 'Kodi thought: This will be fun!'),
  kodiI: L3('Qiziq bo‘ladi!', 'Будет весело!', 'This will be fun!'),
  birdsP: L3('Raund mavzusi — hayvonlar va qushlar.', 'Тема раунда — животные и птицы.', 'The round topic is animals and birds.'),
  finalP: L3('Final — yakshanba kuni kechqurun.', 'Финал — в воскресенье вечером.', 'The final is on Sunday evening.'),
  finalB: L3('yakshanba', 'воскресенье', 'Sunday'),
  hurrayP: L3('Kodi aytdi: Ura, turnir!', 'Коди сказал: Ура, турнир!', 'Kodi said: Hooray, a tournament!'),
  hurrayI: L3('Ura, turnir!', 'Ура, турнир!', 'Hooray, a tournament!')
};
// Шесть уровней большого турнира (экран 7): текст заголовка и смысл уровня.
const EX6 = [
  { t: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'), m: L3('butun o‘yin', 'вся игра', 'the whole game') },
  { t: L3('Turnirlar', 'Турниры', 'Tournaments'), m: L3('bo‘lim: barcha turnirlar', 'раздел: все турниры', 'section: all tournaments') },
  { t: L3('Kuzgi turnir', 'Осенний турнир', 'Autumn tournament'), m: L3('turnirlardan biri', 'один из турниров', 'one of the tournaments') },
  { t: L3('Birinchi raund', 'Первый раунд', 'Round one'), m: L3('kuzgi turnirning qismi', 'часть осеннего турнира', 'part of the autumn tournament') },
  { t: L3('Hayvonlar haqida savollar', 'Вопросы о животных', 'Questions about animals'), m: L3('birinchi raundning qismi', 'часть первого раунда', 'part of round one') },
  { t: L3('O‘rgimchaklar', 'Пауки', 'Spiders'), m: L3('eng kichik qism: o‘rgimchaklar haqida', 'самая маленькая часть: о пауках', 'the smallest part: about spiders') }
];

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики Коди звучат (короткие, начинаются с живого слова);
// подписи печатаются. Символов «+ / =» в репликах нет.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Turnir', 'Турнир', 'Tournament'),
    cast: [
      { pose: 'hello', text: L3('Piksel turnirga tayyorlanyapti! Lekin o‘yinchilar uning sahifasida adashib qolishyapti: nom qayerda, qoidalar qayerda? Keling, ularga yordam beramiz.',
        'Пиксель готовит турнир! Но игроки теряются на его странице: где название, где правила? Давай поможем им разобраться.',
        'Pixel is getting ready for a tournament! But players get lost on his page: where’s the name, where are the rules? Let’s help them out.') },
      { pose: 'point', text: L3('«Kerakli ko‘rinish»ni bosing va solishtiring.', 'Переключи на «Как надо» и сравни.', 'Switch to “How it should be” and compare.') }
    ],
    heads: L3('Qarang: nom va bo‘limlar sarlavhaga aylandi — ular darhol ko‘rinadi.', 'Смотри: название и разделы стали заголовками — их видно сразу.', 'Look: the name and the sections became headings, so you spot them at once.'),
    paras: L3('Matn xatboshilarga bo‘lingan — o‘qish oson.', 'Текст разбит на абзацы — читать легко.', 'The text is split into paragraphs, so it’s easy to read.'),
    marks: L3('Muhim so‘z qalin, Pikselning fikri esa qiya yozilgan.', 'Важное слово жирное, а мысль Пикселя — наклонная.', 'The key word is bold, and Pixel’s thought is slanted.'),
    done: L3('Ana! Bugun sahifani xuddi shunday qilishni o‘rganamiz.', 'Вот! Сегодня научимся делать страницу такой же.', 'There! Today we’ll learn to make a page just like this.'),
    ask: L3('«Kerakli ko‘rinish»ga o‘ting', 'Переключи на «Как надо»', 'Switch to “How it should be”'),
    askDone: L3('Ikkala ko‘rinishni solishtirish mumkin', 'Оба вида можно сравнивать', 'You can compare both views')
  },

  s2: {
    eyebrow: L3('Bosh sarlavha', 'Главный заголовок', 'Main heading'),
    cast: [
      { pose: 'point', text: L3('Nomni boshqa matndan ajratamiz. Uning oldiga ochuvchi <h1> tegini qo‘yaman.',
        'Отделим название от остального текста. Перед ним ставлю открывающий тег <h1>.',
        'Let’s set the name apart from the rest. I put the opening <h1> tag before it.') },
      { pose: 'explain', text: L3('Oxiriga esa yopuvchi teg. Qarang: sahifada nom katta va qalin bo‘ldi.',
        'А в конце — закрывающий тег. Смотри: на странице название стало крупным и жирным.',
        'And the closing tag at the end. Look: the name on the page got big and bold.') },
      { pose: 'rule', text: L3('<h1> — sahifaning bosh sarlavhasi, inglizcha heading so‘zidan. Odatda u sahifada bitta bo‘ladi.',
        '<h1> — главный заголовок страницы, от английского heading. Обычно он на странице один.',
        '<h1> is the main heading of the page, from the word heading. A page usually has just one.') },
      { pose: 'point', text: L3('Endi o‘z sarlavhangizni yozing — masalan, turniringiz nomini.',
        'Теперь напиши свой заголовок — например, название своего турнира.',
        'Now write your own heading, for example your tournament’s name.') }
    ],
    ask: L3('<h1> ichiga o‘z sarlavhangizni yozing', 'Напиши свой заголовок внутри <h1>', 'Write your own heading inside <h1>'),
    same: L3('Bu Pikselning nomi. O‘zingiznikini yozing.', 'Это название Пикселя. Напиши своё.', 'That’s Pixel’s name. Write your own.'),
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no brackets.'),
    done: L3('Zo‘r-ku! Sarlavhangiz sahifadagi eng katta yozuv.', 'Огонь! Твой заголовок — самая крупная надпись на странице.', 'Awesome! Your heading is the biggest text on the page.'),
    askDone: L3('Sarlavhani istalgan payt o‘zgartirish mumkin', 'Заголовок можно менять и дальше', 'You can keep editing the heading')
  },

  s3: {
    eyebrow: L3('Yorliqmi yoki sahifami?', 'Вкладка или страница?', 'Tab or page?'),
    say: L3('Eslang: title — brauzer yorlig‘idagi nom. <h1> esa sahifaning o‘zida. Qani, tekshiramiz.',
      'Вспомни: title — название на вкладке браузера. А <h1> — на самой странице. Давай проверим.',
      'Remember: title is the name on the browser tab. And <h1> is on the page itself. Let’s test it.'),
    rounds: {
      t: {
        q: L3('Kodi title ichidagi matnni almashtiradi. Yozuv qayerda o‘zgaradi?', 'Коди меняет текст внутри title. Где изменится надпись?', 'Kodi changes the text inside title. Where will the text change?'),
        newText: L3('Piksel turniri', 'Турнир Пикселя', 'Pixel’s Tournament'),
        right: L3('Aniq! title — yorliqdagi nom, sahifa o‘zgarmadi.', 'Чётко! title — это название на вкладке, а страница не изменилась.', 'Spot on! title is the name on the tab, and the page didn’t change.'),
        wrong: L3('Qarang: yorliq o‘zgardi, sahifa esa yo‘q. title — yorliqdagi nom.', 'Смотри: изменилась вкладка, а страница — нет. title — это название на вкладке.', 'Look: the tab changed, but the page didn’t. title is the name on the tab.')
      },
      h: {
        q: L3('Endi Kodi <h1> ichidagi matnni almashtiradi. Yozuv qayerda o‘zgaradi?', 'Теперь Коди меняет текст внутри <h1>. Где изменится надпись?', 'Now Kodi changes the text inside <h1>. Where will the text change?'),
        newText: L3('Turnir boshlandi!', 'Турнир начинается!', 'The tournament begins!'),
        right: L3('Ana! <h1> — sahifadagi sarlavha, yorliq esa o‘sha-o‘sha.', 'Есть! <h1> — заголовок на странице, а вкладка осталась прежней.', 'Yes! <h1> is the heading on the page, and the tab stayed the same.'),
        wrong: L3('Qarang: sahifadagi sarlavha o‘zgardi, yorliq esa yo‘q. <h1> sahifaning o‘zida yashaydi.', 'Смотри: изменился заголовок на странице, а вкладка — нет. <h1> живёт на самой странице.', 'Look: the heading on the page changed, but the tab didn’t. <h1> lives on the page itself.')
      }
    },
    done: L3('Ikkala holat tekshirildi: title — yorliqda, <h1> — sahifada.', 'Оба случая проверены: title — на вкладке, <h1> — на странице.', 'Both cases checked: title is on the tab, <h1> is on the page.'),
    askDone: L3('title — yorliqda, h1 — sahifada', 'title — на вкладке, h1 — на странице', 'title is on the tab, h1 is on the page')
  },

  s4: {
    eyebrow: L3('Xatboshilar', 'Абзацы', 'Paragraphs'),
    cast: [
      { pose: 'point', text: L3('Bu <p> tegi — xatboshi. U matn bo‘lagini o‘rab turadi.', 'Это тег <p> — абзац. Он обнимает кусок текста.', 'This is the <p> tag: a paragraph. It wraps a piece of text.') },
      { pose: 'explain', text: L3('Hozir bitta xatboshida ikki fikr bor: salomlashish va qoidalar.', 'Сейчас в одном абзаце две мысли: приветствие и правила.', 'Right now one paragraph holds two thoughts: the greeting and the rules.') },
      { pose: 'point', text: L3('Ularni ikki xatboshiga ajrating. Qaysi usul ishlaydi?', 'Раздели их на два абзаца. Какой способ сработает?', 'Split them into two paragraphs. Which way will work?') }
    ],
    ask: L3('Salomlashish va qoidalarni ikki xatboshiga ajrating', 'Раздели приветствие и правила на два абзаца', 'Split the greeting and the rules into two paragraphs'),
    opts: {
      enter: L3('Fikrlar orasida Enter bosish', 'Нажать Enter между фразами', 'Press Enter between the sentences'),
      tags: L3('</p> bilan yopib, yangi <p> ochish', 'Закрыть </p> и открыть новый <p>', 'Close with </p> and open a new <p>')
    },
    enterWhy: L3('Kodda qator ko‘chdi, sahifada esa o‘sha bitta xatboshi. Brauzer Enterni ko‘rmaydi — yangi xatboshiga o‘z <p> tegi kerak.',
      'В коде строка перенеслась, а на странице всё тот же один абзац. Браузер не видит Enter — новому абзацу нужен свой <p>.',
      'The code line wrapped, but the page still shows one paragraph. The browser ignores Enter: a new paragraph needs its own <p>.'),
    hints: [
      L3('Sahifaga qarang: matn ikkiga bo‘lindimi?', 'Посмотри на страницу: текст разделился?', 'Look at the page: did the text split?'),
      L3('Har bir xatboshi o‘z <p> va </p> teglari ichida turadi.', 'Каждый абзац стоит в своих <p> и </p>.', 'Each paragraph sits inside its own <p> and </p>.'),
      L3('Yopib, yangi xatboshi ochadigan usulni tanlang.', 'Выбери способ, где абзац закрывается и открывается новый.', 'Choose the way where one paragraph closes and a new one opens.')
    ],
    done: L3('Klass! Endi ikki xatboshi, ular orasida bo‘sh joy bor.', 'Класс! Теперь два абзаца, а между ними — отступ.', 'Cool! Now there are two paragraphs with space between them.'),
    askDone: L3('Har bir fikr — o‘z <p> ichida', 'Каждая мысль — в своём <p>', 'Each thought is in its own <p>')
  },

  s5: {
    eyebrow: L3('Bo‘lim', 'Раздел', 'Section'),
    cast: [
      { pose: 'point', text: L3('Bu <h2> — bo‘lim sarlavhasi. Bu yerda bo‘lim — «O‘yin qoidalari».', 'Это <h2> — заголовок раздела. Здесь раздел — «Правила игры».', 'This is <h2>: a section heading. Here the section is Game rules.') },
      { pose: 'explain', text: L3('Bosh sarlavha bitta, bo‘limlar esa bir nechta bo‘lishi mumkin.', 'Главный заголовок один, а разделов может быть несколько.', 'There’s one main heading, but there can be several sections.') },
      { pose: 'point', text: L3('Yangi bo‘lim qo‘shamiz: «Turnir yangiliklari». Uning sarlavhasiga teg tanlang.', 'Добавим раздел «Новости турнира». Выбери тег для его заголовка.', 'Let’s add a Tournament news section. Choose a tag for its heading.') }
    ],
    ask: L3('«{x}» sarlavhasi uchun teg tanlang', 'Выбери тег для заголовка «{x}»', 'Choose a tag for the “{x}” heading'),
    wrong: {
      h1: L3('Bosh sarlavha allaqachon bor — «Bilimlar jangi». Bu esa alohida bo‘lim, xuddi qoidalar kabi.', 'Главный заголовок уже есть — «Битва знаний». А это отдельный раздел, как «Правила».', 'There’s already a main heading: Battle of Knowledge. This is a separate section, like the rules.'),
      p: L3('<p> — oddiy matn uchun. Bu esa bo‘lim nomi.', '<p> — для обычного текста. А это название раздела.', '<p> is for plain text. This is a section name.')
    },
    hints: [
      L3('Bu sarlavha nimani nomlaydi: butun sahifanimi yoki bo‘limnimi?', 'Что называет этот заголовок: всю страницу или раздел?', 'What does this heading name: the whole page or a section?'),
      L3('Bo‘lim sarlavhasi «O‘yin qoidalari» bilan bir xil tegda.', 'У заголовка раздела тот же тег, что у «Правил игры».', 'A section heading uses the same tag as Game rules.'),
      L3('<h2> ni bosing.', 'Нажми <h2>.', 'Tap <h2>.')
    ],
    done: L3('Super! Endi sahifada ikki bo‘lim bor.', 'Супер! Теперь на странице два раздела.', 'Super! Now the page has two sections.'),
    extraSay: L3('Yana bir misol: «Sovrinlar» bo‘limi. Teg tanlang.', 'Ещё пример: раздел «Призы». Выбери тег.', 'One more: a Prizes section. Choose a tag.'),
    extraDone: L3('Aniq! Bo‘lim — <h2>.', 'Чётко! Раздел — это <h2>.', 'Spot on! A section is <h2>.'),
    askDone: L3('Bo‘lim sarlavhasi — h2', 'Заголовок раздела — h2', 'A section heading is h2')
  },

  s6: {
    eyebrow: L3('Kichik bo‘lim', 'Подраздел', 'Subsection'),
    cast: [
      { pose: 'point', text: L3('<h3> — kichik bo‘lim sarlavhasi: bo‘lim ichidagi qism.', '<h3> — заголовок подраздела: часть внутри раздела.', '<h3> is a subsection heading: a part inside a section.') },
      { pose: 'explain', text: L3('«Birinchi raund» — qoidalarning bir qismi. Uni o‘zi nomlaydigan matn oldiga qo‘ying.', '«Первый раунд» — часть правил. Поставь его перед текстом, который он называет.', 'Round one is part of the rules. Put it before the text it names.') },
      { pose: 'point', text: L3('Kodda qatorni bosing — sarlavha shu qator oldiga qo‘yiladi.', 'Нажми строку кода — заголовок встанет перед ней.', 'Tap a code line: the heading will go right before it.') }
    ],
    ask: L3('<h3> qaysi qator oldida turadi? Qatorni bosing', 'Перед какой строкой встанет <h3>? Нажми строку', 'Which line does <h3> go before? Tap that line'),
    wrong: {
      top: L3('Kichik bo‘lim bo‘lim ichida yashaydi — «O‘yin qoidalari» sarlavhasidan keyin.', 'Подраздел живёт внутри раздела — после заголовка «Правила игры».', 'A subsection lives inside a section, after the Game rules heading.'),
      general: L3('Bu xatboshi — umumiy qoidalar. «Birinchi raund» raund haqidagi matn oldida turadi.', 'Этот абзац — общие правила игры. «Первый раунд» стоит перед текстом про раунд.', 'This paragraph is the general rules. Round one goes before the text about the round.'),
      after: L3('Sarlavha o‘zi nomlaydigan matndan oldin turadi, keyin emas.', 'Заголовок стоит перед текстом, который называет, а не после.', 'A heading goes before the text it names, not after.'),
      news: L3('Bu boshqa bo‘lim — yangiliklar. Raund esa qoidalarning qismi.', 'Это уже другой раздел — новости. А раунд — часть правил.', 'That’s another section: news. The round is part of the rules.')
    },
    hints: [
      L3('Raund haqida qaysi xatboshi gapiradi?', 'Какой абзац рассказывает про раунд?', 'Which paragraph talks about the round?'),
      L3('Kichik bo‘lim sarlavhasi bo‘lim ichida, o‘z matni oldida turadi.', 'Заголовок подраздела стоит внутри раздела, перед своим текстом.', 'A subsection heading sits inside the section, before its text.'),
      L3('Raund mavzusi yozilgan qatorni bosing.', 'Нажми строку о теме раунда.', 'Tap the line about the round topic.')
    ],
    done: L3('Ana! «Birinchi raund» qoidalar ichida, o‘z matni oldida.', 'Есть! «Первый раунд» внутри правил, перед своим текстом.', 'Yes! Round one sits inside the rules, before its text.'),
    extraSay: L3('Yana bir misol: «Ikkinchi raund». Uni o‘z matni oldiga qo‘ying.', 'Ещё пример: «Второй раунд». Поставь его перед его текстом.', 'One more: Round two. Put it before its own text.'),
    extraWrong: L3('«Ikkinchi raund» o‘z matni — koinot haqidagi qator oldida turadi.', '«Второй раунд» стоит перед своим текстом — строкой про космос.', 'Round two goes before its own text: the line about space.'),
    extraDone: L3('Aniq! Kichik bo‘lim — o‘z matni oldida.', 'Чётко! Подраздел — перед своим текстом.', 'Spot on! A subsection goes before its text.'),
    askDone: L3('Kichik bo‘lim — h3, o‘z matni oldida', 'Подраздел — h3, перед своим текстом', 'A subsection is h3, before its text')
  },

  s7: {
    eyebrow: L3('Olti daraja', 'Шесть уровней', 'Six levels'),
    say: L3('Sarlavha darajalari oltita: h1 dan h6 gacha. Har bir keyingisi oldingisining qismi. Har bir qatorni bosing.',
      'Уровней заголовков шесть: от h1 до h6. Каждый следующий — часть предыдущего. Нажми каждую строку.',
      'There are six heading levels, from h1 to h6. Each next one is part of the one before. Tap every line.'),
    tell: [
      L3('h1 — butun o‘yin nomi.', 'h1 — название всей игры.', 'h1 is the name of the whole game.'),
      L3('h2 — bo‘lim: barcha turnirlar.', 'h2 — раздел: все турниры.', 'h2 is a section: all tournaments.'),
      L3('h3 — turnirlardan biri, kuzgisi.', 'h3 — один из турниров, осенний.', 'h3 is one of the tournaments, the autumn one.'),
      L3('h4 — kuzgi turnirning qismi: birinchi raund.', 'h4 — часть осеннего турнира: первый раунд.', 'h4 is part of the autumn tournament: round one.'),
      L3('h5 — birinchi raundning qismi: hayvonlar haqida savollar.', 'h5 — часть первого раунда: вопросы о животных.', 'h5 is part of round one: questions about animals.'),
      L3('h6 — eng kichik qism: o‘rgimchaklar haqida.', 'h6 — самая маленькая часть: о пауках.', 'h6 is the smallest part: about spiders.')
    ],
    all: L3('Hamma olti daraja har bir sahifada shart emas — keraklisini olamiz. Endi savol.',
      'Все шесть уровней нужны не на каждой странице — берём столько, сколько нужно. Теперь вопрос.',
      'Not every page needs all six levels: we use as many as we need. Now a question.'),
    askTap: L3('Har bir sarlavha qatorini bosing', 'Нажми каждую строку заголовка', 'Tap every heading line'),
    q: L3('«Birinchi raund» (h4) ichida yangi kichik bo‘lim paydo bo‘ldi: «Koinot haqida savollar». Uning tegi qaysi?',
      'Внутри «Первого раунда» (h4) появился подраздел «Вопросы о космосе». Какой у него тег?',
      'Inside Round one (h4) there’s a new subsection: Questions about space. Which tag does it get?'),
    qShort: L3('«Koinot haqida savollar» uchun teg', 'Тег для «Вопросов о космосе»', 'A tag for “Questions about space”'),
    qWrong: {
      h3: L3('h3 — kuzgi turnir darajasi, bu yuqoriroq.', 'h3 — это уровень осеннего турнира, он выше.', 'h3 is the autumn tournament level; that’s higher.'),
      h4: L3('h4 — «Birinchi raund»ning o‘zi. Uning qismi bir pog‘ona pastroq.', 'h4 — уровень самого «Первого раунда». Его часть — на ступеньку ниже.', 'h4 is Round one itself. A part of it goes one step lower.')
    },
    hints: [
      L3('«Birinchi raund» qaysi darajada?', 'На каком уровне «Первый раунд»?', 'Which level is Round one on?'),
      L3('Ichidagi qism har doim bir daraja pastroq: raqam bittaga katta.', 'Часть внутри — всегда на уровень ниже: цифра на один больше.', 'A part inside is always one level lower: the number is one bigger.'),
      L3('h4 dan keyin h5 keladi. h5 ni bosing.', 'После h4 идёт h5. Нажми h5.', 'After h4 comes h5. Tap h5.')
    ],
    right: L3('Aynan nishonga! Raund ichidagi qism — h5.', 'В точку! Часть внутри раунда — h5.', 'Nailed it! A part inside the round is h5.'),
    extraQ: L3('«Koinot haqida savollar» (h5) ichida — «Sayyoralar». Qaysi teg?', 'Внутри «Вопросов о космосе» (h5) — подраздел «Планеты». Какой тег?', 'Inside Questions about space (h5) there’s Planets. Which tag?'),
    extraShort: L3('«Sayyoralar» uchun teg', 'Тег для «Планет»', 'A tag for “Planets”'),
    extraWrong: L3('Ichidagi qism bir daraja pastroq: h5 dan keyin h6.', 'Часть внутри — на уровень ниже: после h5 идёт h6.', 'A part inside is one level lower: after h5 comes h6.'),
    done: L3('Zo‘r! Olti daraja — bu ma’no zinapoyasi, shunchaki harf o‘lchami emas.', 'Отлично! Шесть уровней — это лесенка смысла, а не просто размер букв.', 'Great! The six levels are a ladder of meaning, not just letter size.'),
    askDone: L3('Ichidagi qism — bir daraja pastroq', 'Часть внутри — на уровень ниже', 'A part inside is one level lower')
  },

  s8: {
    eyebrow: L3('Darajalar aralashdi', 'Редактор перепутал уровни', 'Mixed-up levels'),
    say: L3('Muharrir darajalarni aralashtirib yubordi. Har bir sarlavha yonida uning roli yozilgan. Mos darajani tanlang.',
      'Редактор перепутал уровни. Рядом с каждым заголовком написана его роль. Выбери подходящий уровень.',
      'The editor mixed up the levels. Each heading has its role next to it. Choose the right level.'),
    ask: L3('«{x}» uchun darajani tanlang', 'Выбери уровень для «{x}»', 'Choose a level for “{x}”'),
    wrong: {
      whole: L3('Bu butun sahifa nomi — eng muhim sarlavha.', 'Это название всей страницы — самый главный заголовок.', 'This is the name of the whole page: the most important heading.'),
      section: L3('Bu bo‘lim nomi: bosh sarlavhadan bir pog‘ona past.', 'Это название раздела: на ступеньку ниже главного.', 'This is a section name: one step below the main heading.'),
      sub: L3('Bu kichik bo‘lim nomi: bo‘limdan bir pog‘ona past.', 'Это название подраздела: на ступеньку ниже раздела.', 'This is a subsection name: one step below a section.'),
      same: L3('Muharrir aynan shuni qo‘ygan edi. Qator rolini qarang.', 'Так и поставил редактор. Посмотри на роль строки.', 'That’s what the editor put. Look at the line’s role.')
    },
    hints: [
      L3('Qator yonidagi rolni o‘qing.', 'Прочитай роль рядом со строкой.', 'Read the role next to the line.'),
      L3('Butun sahifa — h1, bo‘lim — h2, kichik bo‘lim — h3.', 'Вся страница — h1, раздел — h2, подраздел — h3.', 'The whole page is h1, a section is h2, a subsection is h3.'),
      L3('Bu qator uchun {lv} ni bosing.', 'Для этой строки нажми {lv}.', 'For this line, tap {lv}.')
    ],
    okStep: L3('Aniq!', 'Чётко!', 'Spot on!'),
    done: L3('Qoyil, chiqdi! Endi har bir sarlavha o‘z darajasida.', 'Вот это да, получилось! Теперь каждый заголовок на своём уровне.', 'Look at that, it works! Every heading is on its own level now.'),
    extraSay: L3('Yana bitta qator: «Ikkinchi raund» — kichik bo‘lim. Darajani tanlang.', 'Ещё одна строка: «Второй раунд» — подраздел. Выбери уровень.', 'One more line: Round two is a subsection. Choose a level.'),
    askDone: L3('Har bir sarlavha o‘z darajasida', 'Каждый заголовок на своём уровне', 'Every heading is on its level')
  },

  s9: {
    eyebrow: L3('Muhim so‘z', 'Ключевое слово', 'Key word'),
    cast: [
      { pose: 'point', text: L3('Muhim so‘z ko‘zga tashlanishi uchun uni <b> tegi bilan o‘raymiz.', 'Чтобы слово бросалось в глаза, его обнимает тег <b>.', 'To make a word stand out, we wrap it in the <b> tag.') },
      { pose: 'explain', text: L3('Qarang: «hayvonlar» so‘zi qalin bo‘ldi.', 'Смотри: слово «животные» стало жирным.', 'Look: the word animals became bold.') },
      { pose: 'point', text: L3('Endi siz: ikkinchi gapda g‘olib nima olishini qalin qiling.', 'Теперь ты: во второй фразе сделай жирным, что получит победитель.', 'Your turn: in the second sentence, make bold what the winner gets.') }
    ],
    goal: L3('G‘olib nima olishini qalin qiling', 'Сделай жирным, что получит победитель', 'Make bold what the winner gets'),
    goalX: L3('Javobga qancha vaqt berilishini qalin qiling', 'Сделай жирным, сколько времени на ответ', 'Make bold how much time you get'),
    askSel: L3('Kerakli so‘zlarni bosing, keyin <b> ni', 'Нажми нужные слова, потом <b>', 'Tap the words you need, then <b>'),
    askTag: L3('Endi <b> ni bosing', 'Теперь нажми <b>', 'Now tap <b>'),
    wrongSel: L3('Bu so‘zlar emas. G‘olib nima oladi?', 'Не те слова. Что получит победитель?', 'Not those words. What does the winner get?'),
    wrongSelX: L3('Bu so‘zlar emas. Javobga qancha vaqt beriladi?', 'Не те слова. Сколько времени на ответ?', 'Not those words. How much time do you get?'),
    noSel: L3('Avval so‘zni bosing.', 'Сначала нажми слово.', 'Tap a word first.'),
    hints: [
      L3('Gapni o‘qing: g‘olib nima oladi?', 'Прочитай фразу: что получит победитель?', 'Read the sentence: what does the winner get?'),
      L3('Muhim so‘z — gapdagi eng asosiy narsa: sovrin.', 'Ключевое слово — самое главное во фразе: приз.', 'The key word is the most important thing here: the prize.'),
      L3('«{f}» so‘zini bosing, keyin <b> ni.', 'Нажми слово «{f}», потом <b>.', 'Tap the word “{f}”, then <b>.')
    ],
    done: L3('Ana! Endi sovrin darhol ko‘zga tashlanadi.', 'Есть! Теперь приз сразу бросается в глаза.', 'Yes! Now the prize catches the eye right away.'),
    extraSay: L3('Yana bir misol: vaqtni qalin qiling.', 'Ещё пример: выдели время на ответ.', 'One more: make the answer time bold.'),
    extraDone: L3('Zo‘r! Ikki so‘z ham bitta <b> ichida.', 'Отлично! Два слова — внутри одного <b>.', 'Great! Both words sit inside one <b>.'),
    askDone: L3('Muhim so‘z — <b> ichida', 'Ключевое слово — внутри <b>', 'The key word is inside <b>')
  },

  s10: {
    eyebrow: L3('Pikselning fikri', 'Мысль Пикселя', 'Pixel’s thought'),
    cast: [
      { pose: 'point', text: L3('<i> tegi matnni qiya qiladi — bu kursiv. Fikrlarni ko‘pincha shunday yozishadi.', 'Тег <i> делает текст наклонным — это курсив. Так часто пишут мысли.', 'The <i> tag slants the text: that’s italics. Thoughts are often written this way.') },
      { pose: 'explain', text: L3('Qarang: Pikselning fikri qiya bo‘ldi.', 'Смотри: мысль Пикселя стала наклонной.', 'Look: Pixel’s thought is now slanted.') },
      { pose: 'point', text: L3('Endi Pikselning boshqa fikrini belgilang va tegni tanlang.', 'Теперь выдели другую мысль Пикселя и выбери тег.', 'Now select Pixel’s other thought and choose the tag.') }
    ],
    goal: L3('Pikselning fikrini kursiv qiling', 'Сделай мысль Пикселя курсивом', 'Put Pixel’s thought in italics'),
    goalX: L3('Kodining fikrini kursiv qiling', 'Сделай мысль Коди курсивом', 'Put Kodi’s thought in italics'),
    askSel: L3('Fikrning birinchi va oxirgi so‘zini bosing', 'Нажми первое и последнее слово мысли', 'Tap the first and last word of the thought'),
    askTag: L3('Endi tegni tanlang', 'Теперь выбери тег', 'Now choose a tag'),
    wrongSel: L3('Fikr — ikki nuqtadan keyingi so‘zlar, oxirigacha.', 'Мысль — это слова после двоеточия, до конца фразы.', 'The thought is the words after the colon, to the end.'),
    wrongTag: L3('<b> so‘zni qalin qiladi. Fikr uchun qiya yozuv kerak — <i>.', '<b> делает слова жирными. Мысли нужен наклонный текст — <i>.', '<b> makes words bold. A thought needs slanted text: <i>.'),
    noSel: L3('Avval so‘zlarni belgilang.', 'Сначала выдели слова.', 'Select the words first.'),
    hints: [
      L3('Piksel nima deb pichirladi?', 'Что шепнул Пиксель?', 'What did Pixel whisper?'),
      L3('Fikr ikki nuqtadan keyin boshlanadi va gap oxirigacha boradi.', 'Мысль начинается после двоеточия и идёт до конца фразы.', 'The thought starts after the colon and runs to the end.'),
      L3('«{a}» va «{b}» so‘zlarini bosing, keyin <i> ni.', 'Нажми «{a}» и «{b}», потом <i>.', 'Tap “{a}” and “{b}”, then <i>.')
    ],
    done: L3('Super! Pikselning fikri endi qiya — darhol fikr ekani ko‘rinadi.', 'Супер! Мысль Пикселя теперь наклонная — сразу видно, что это мысль.', 'Super! Pixel’s thought is slanted now, so it reads as a thought.'),
    extraSay: L3('Yana bir misol: Kodining fikri.', 'Ещё пример: мысль Коди.', 'One more: Kodi’s thought.'),
    extraDone: L3('Klass! Fikr — <i> ichida.', 'Класс! Мысль — внутри <i>.', 'Cool! The thought is inside <i>.'),
    askDone: L3('Fikr — <i> ichida', 'Мысль — внутри <i>', 'The thought is inside <i>')
  },

  s11: {
    eyebrow: L3('Nima o‘zgaradi?', 'Что изменится?', 'What will change?'),
    say: L3('Endi oldindan aytamiz. Avval javob bering — keyin Kodi o‘zgarishni kiritadi.', 'Теперь предскажем. Сначала ответь — потом Коди внесёт изменение.', 'Now let’s predict. Answer first, then Kodi makes the change.'),
    rounds: {
      p: {
        q: L3('Kodi ikkinchi <p> ni qo‘shadi. Yangi matn qayerda chiqadi?', 'Коди добавит второй <p>. Где появится новый текст?', 'Kodi adds a second <p>. Where will the new text appear?'),
        opts: {
          a: L3('Alohida, birinchi xatboshi ostida', 'Отдельно, под первым абзацем', 'Separately, under the first paragraph'),
          b: L3('O‘sha qatorda, birinchi xatboshidan keyin', 'В той же строке, сразу после первого', 'On the same line, right after the first')
        },
        answer: 'a',
        why: L3('Har bir <p> — alohida xatboshi, u yangi qatordan boshlanadi.', 'Каждый <p> — отдельный абзац, он начинается с новой строки.', 'Each <p> is a separate paragraph, starting on a new line.')
      },
      h: {
        q: L3('Kodi «Turnir yangiliklari»dagi <h2> ni <h3> ga almashtiradi. Nima bo‘ladi?', 'Коди заменит <h2> у «Новостей турнира» на <h3>. Что будет?', 'Kodi changes the <h2> on Tournament news to <h3>. What happens?'),
        opts: {
          a: L3('Joyida qoladi, lekin kichik bo‘lim bo‘ladi — kichikroq', 'Останется на месте, но станет подразделом — мельче', 'Stays in place but becomes a subsection, smaller'),
          b: L3('Yuqoriga, qoidalar yoniga ko‘chadi', 'Переедет выше, к «Правилам»', 'Moves up next to the rules'),
          c: L3('Hech narsa o‘zgarmaydi', 'Ничего не изменится', 'Nothing changes')
        },
        answer: 'a',
        why: L3('Teg sarlavhaning darajasini o‘zgartiradi, joyini emas: endi bu qoidalar ichidagi kichik bo‘lim.', 'Тег меняет уровень заголовка, а не его место: теперь это подраздел внутри «Правил».', 'The tag changes the heading’s level, not its place: now it’s a subsection of the rules.')
      },
      m: {
        q: L3('Kodi so‘zlarni <b> va </b> orasiga oladi. Qaysi so‘zlar qalin bo‘ladi?', 'Коди возьмёт слова в <b> и </b>. Какие слова станут жирными?', 'Kodi puts words between <b> and </b>. Which words become bold?'),
        opts: {
          a: L3('Faqat birinchi so‘z', 'Только первое слово', 'Only the first word'),
          b: L3('<b> va </b> orasidagi hamma so‘zlar', 'Все слова между <b> и </b>', 'All the words between <b> and </b>'),
          c: L3('Butun xatboshi', 'Весь абзац', 'The whole paragraph')
        },
        answer: 'b',
        why: L3('<b> ochilgan joydan </b> gacha bo‘lgan hamma narsa qalin bo‘ladi.', 'Жирным становится всё от <b> до </b>.', 'Everything from <b> to </b> becomes bold.')
      }
    },
    look: L3('Qarang:', 'Смотри:', 'Look:'),
    done: L3('Uchala bashorat tekshirildi! Kod va sahifa qanday bog‘langani endi ko‘rinib turibdi.', 'Все три прогноза проверены! Теперь видно, как код связан со страницей.', 'All three predictions checked! Now you can see how code and page connect.'),
    askDone: L3('Kod sahifani qanday o‘zgartirishi ko‘rindi', 'Видно, как код меняет страницу', 'You can see how code changes the page')
  },

  s12: {
    eyebrow: L3('Qatorni tuzating', 'Почини строку', 'Fix the line'),
    say: L3('Bu qatorlarda teglar joyidan siljib ketgan. Ularni birma-bir tuzatamiz.', 'В этих строках теги съехали. Починим их по одной.', 'The tags in these lines slipped. Let’s fix them one by one.'),
    goals: {
      edge: L3('Faqat «{t}» qalin bo‘lsin', 'Жирным должно быть только «{t}»', 'Only “{t}” should be bold'),
      nest: L3('Teglar tartib bilan yopilsin, fikr to‘liq kursiv', 'Теги закрываются по порядку, вся мысль — курсивом', 'Tags close in order, the whole thought in italics'),
      pair: L3('Yopuvchi teg ochuvchisiga mos kelsin', 'Закрывающий тег должен совпадать с открывающим', 'The closing tag must match the opening one')
    },
    tasks: {
      edge: L3('</b> qaysi so‘zdan keyin turishi kerak? O‘sha so‘zni bosing', 'После какого слова должен стоять </b>? Нажми это слово', 'Which word should </b> follow? Tap that word'),
      nest: L3('</i> uchun joyni bosing', 'Нажми место, где должен стоять </i>', 'Tap the place where </i> belongs'),
      pair: L3('Jufti mos kelmagan tegni bosing', 'Нажми тег, который не подходит к паре', 'Tap the tag that doesn’t match its pair'),
      pair2: L3('Uni qaysi teg bilan almashtiramiz?', 'На какой тег его заменить?', 'Which tag should replace it?')
    },
    intro: {
      edge: L3('Qarang: qalin bo‘lib ortiqcha so‘zlar ham ketgan. </b> ni to‘g‘ri so‘zdan keyin qo‘ying.', 'Смотри: жирными стали лишние слова. Поставь </b> после нужного слова.', 'Look: extra words went bold. Put </b> after the right word.'),
      nest: L3('Bu yerda </i> xatboshidan tashqarida qolgan. Oxirgi ochilgan teg birinchi yopiladi. Brauzer ba’zan o‘zi tuzatadi, lekin kod tartibli bo‘lishi kerak.', 'Здесь </i> оказался снаружи абзаца. Последний открытый тег закрывается первым. Браузер иногда исправляет сам, но код должен быть в порядке.', 'Here </i> ended up outside the paragraph. The last tag opened closes first. The browser sometimes fixes it, but the code should be tidy.'),
      pair: L3('Iya, keyingi xatboshi ham qalin bo‘lib ketdi! Bitta teg o‘z jufti bilan yopilmagan.', 'Ой, жирным стал и следующий абзац! Один тег закрыт не своей парой.', 'Oops, the next paragraph went bold too! One tag is closed by the wrong pair.')
    },
    edgeNow: L3('Hozir qalin: «{f}». Kerak faqat «{t}».', 'Сейчас жирное: «{f}». Нужно только «{t}».', 'Bold now: “{f}”. Only “{t}” should be.'),
    edgeBefore: L3('</b> <b> dan oldin turolmaydi: avval ochamiz, keyin yopamiz.', '</b> не может стоять раньше <b>: сначала открываем, потом закрываем.', '</b> can’t come before <b>: open first, then close.'),
    nestPart: L3('Endi fikrning faqat bir qismi qiya. Butun fikr kursiv bo‘lsin.', 'Теперь наклонная только часть мысли. Нужна вся мысль.', 'Now only part of the thought is slanted. The whole thought should be.'),
    nestOut: L3('U avval ham shu yerda edi — </p> dan keyin. Teg xatboshi ichida ochildi, ichida yopiladi.', 'Здесь он и стоял — после </p>. Тег открылся внутри абзаца — внутри и закрывается.', 'That’s where it was: after </p>. The tag opened inside the paragraph, so it closes inside.'),
    pairFine: L3('Bu teg joyida. <b> nima bilan yopilganiga qarang.', 'Этот тег в порядке. Посмотри, чем закрыт <b>.', 'This tag is fine. Look at what closes <b>.'),
    pairFineI: L3('Bu teg joyida. <i> nima bilan yopilganiga qarang.', 'Этот тег в порядке. Посмотри, чем закрыт <i>.', 'This tag is fine. Look at what closes <i>.'),
    pairSame: L3('Shunday edi — u ochuvchiga mos emas.', 'Так и было — он не подходит к открывающему.', 'That’s how it was: it doesn’t match the opening tag.'),
    pairP: L3('</p> xatboshini yopadi. Ochilgan teg o‘z nomi bilan yopiladi.', '</p> закрывает абзац. Открытый тег закрывается своим именем.', '</p> closes the paragraph. An opened tag closes with its own name.'),
    hints: {
      edge: [
        L3('Sahifaga qarang: qaysi so‘zlar ortiqcha qalin?', 'Посмотри на страницу: какие слова жирные зря?', 'Look at the page: which words are bold for no reason?'),
        L3('</b> qalin bo‘lishi kerak bo‘lgan oxirgi so‘zdan keyin turadi.', '</b> стоит сразу после последнего жирного слова.', '</b> goes right after the last word that should be bold.'),
        L3('«{t}» so‘zini bosing.', 'Нажми слово «{t}».', 'Tap the word “{t}”.')
      ],
      nest: [
        L3('Qaysi teg oxirgi ochildi: xatboshimi yoki kursivmi?', 'Какой тег открылся последним: абзац или курсив?', 'Which tag opened last: the paragraph or the italics?'),
        L3('Teskari tartib: avval </i>, keyin </p>.', 'Обратный порядок: сначала </i>, потом </p>.', 'Reverse order: first </i>, then </p>.'),
        L3('</p> oldidagi joyni bosing.', 'Нажми место прямо перед </p>.', 'Tap the spot right before </p>.')
      ],
      pair: [
        L3('Sahifaga qarang: qalinlik qayerda tugamayapti?', 'Посмотри на страницу: где жирный не заканчивается?', 'Look at the page: where doesn’t the bold end?'),
        L3('Har bir ochuvchi teg o‘z nomi bilan yopiladi.', 'Каждый открывающий тег закрывается своим именем.', 'Each opening tag closes with its own name.'),
        L3('Belgilangan tegni bosing va {w} ni tanlang.', 'Нажми отмеченный тег и выбери {w}.', 'Tap the marked tag and choose {w}.')
      ]
    },
    ok: {
      edge: L3('Aniq! Endi faqat kerakli so‘z qalin.', 'Чётко! Теперь жирное только нужное слово.', 'Spot on! Only the right word is bold now.'),
      nest: L3('Ana! Kursiv xatboshi ichida ochildi va ichida yopildi.', 'Есть! Курсив открылся внутри абзаца и внутри закрылся.', 'Yes! The italics opened inside the paragraph and closed inside it.'),
      pair: L3('Zo‘r-ku! Juftlar mos keldi — ortiqcha qalinlik yo‘qoldi.', 'Огонь! Пары совпали — лишний жирный пропал.', 'Awesome! The pairs match, and the extra bold is gone.')
    },
    extraSay: L3('Yana bir misol — xuddi shu qoida.', 'Ещё пример — на то же правило.', 'One more example, same rule.'),
    done: L3('Barcha qatorlar tuzatildi! Teglar juft va tartib bilan yopiladi.', 'Все строки починены! Теги парные и закрываются по порядку.', 'All lines fixed! Tags are paired and close in order.'),
    askDone: L3('Teglar juft va tartibli', 'Теги парные и по порядку', 'Tags are paired and in order')
  },

  s13: {
    eyebrow: L3('Sizning turniringiz', 'Твой турнир', 'Your tournament'),
    say: L3('Endi o‘z turniringiz sahifasini yasang. Har qadamda avval tegni tanlang, keyin matn yozing.',
      'Теперь сделай страницу своего турнира. На каждом шаге сначала выбери тег, потом напиши текст.',
      'Now build your own tournament page. On each step, first choose a tag, then write the text.'),
    steps: {
      h1: { role: L3('Turnir nomi', 'Название турнира', 'Tournament name'), ph: L3('Masalan: Kuzgi jang', 'Например: Осенняя битва', 'For example: Autumn Battle') },
      h2: { role: L3('Bo‘lim', 'Раздел', 'Section'), ph: L3('Masalan: Qoidalar', 'Например: Правила', 'For example: Rules') },
      p1: { role: L3('Bo‘lim xatboshisi', 'Абзац раздела', 'Section paragraph'), ph: L3('Masalan: Har jamoada uch o‘yinchi.', 'Например: В каждой команде три игрока.', 'For example: Each team has three players.') },
      h3: { role: L3('Kichik bo‘lim', 'Подраздел', 'Subsection'), ph: L3('Masalan: Birinchi raund', 'Например: Первый раунд', 'For example: Round one') },
      p2: { role: L3('Kichik bo‘lim xatboshisi', 'Абзац подраздела', 'Subsection paragraph'), ph: L3('Masalan: Mavzu — sport.', 'Например: Тема — спорт.', 'For example: The topic is sports.') },
      b: { role: L3('Muhim so‘z', 'Ключевое слово', 'Key word') },
      i: { role: L3('Pikselning fikri', 'Мысль Пикселя', 'Pixel’s thought'), ph: L3('Masalan: Kim yutarkin?', 'Например: Кто же победит?', 'For example: Who will win?') }
    },
    askTag: L3('{r}: tegni tanlang', '{r}: выбери тег', '{r}: choose a tag'),
    askText: L3('{r}: matnni yozing', '{r}: напиши текст', '{r}: write the text'),
    askB: L3('Xatboshidagi bitta so‘zni bosing, keyin tegni tanlang', 'Нажми одно слово в абзаце, потом выбери тег', 'Tap one word in a paragraph, then choose a tag'),
    askBTag: L3('Endi «{w}» uchun tegni tanlang', 'Теперь выбери тег для «{w}»', 'Now choose a tag for “{w}”'),
    askI2: L3('Endi fikr uchun tegni tanlang', 'Теперь выбери тег для мысли', 'Now choose a tag for the thought'),
    wrong: {
      h1: L3('Turnir nomi — butun sahifa nomi. Unga bosh sarlavha kerak.', 'Название турнира — название всей страницы. Ему нужен главный заголовок.', 'The tournament name names the whole page. It needs the main heading.'),
      h2: L3('Bu bo‘lim nomi — bosh sarlavhadan bir pog‘ona past.', 'Это название раздела — на ступеньку ниже главного.', 'This is a section name, one step below the main heading.'),
      h3: L3('Bu kichik bo‘lim — bo‘lim ichidagi qism.', 'Это подраздел — часть внутри раздела.', 'This is a subsection: a part inside a section.'),
      p: L3('Bu oddiy matn — unga sarlavha emas, xatboshi kerak.', 'Это обычный текст — ему нужен абзац, а не заголовок.', 'This is plain text: it needs a paragraph, not a heading.'),
      b: L3('Muhim so‘zni qalin qilamiz, kursiv esa fikrlar uchun.', 'Ключевое слово делаем жирным, а курсив — для мыслей.', 'A key word goes bold; italics are for thoughts.'),
      i: L3('Fikrni qiya yozamiz, qalin esa muhim so‘zlar uchun.', 'Мысль пишем наклонно, а жирный — для ключевых слов.', 'A thought is slanted; bold is for key words.'),
      h1taken: L3('Bosh sarlavha allaqachon bor — sahifada u bitta.', 'Главный заголовок уже есть — на странице он один.', 'There’s already a main heading: a page has one.')
    },
    hints: [
      L3('Bu qator nima: nommi yoki oddiy matnmi?', 'Что это за строка: название или обычный текст?', 'What is this line: a name or plain text?'),
      L3('Butun sahifa — h1, bo‘lim — h2, kichik bo‘lim — h3, matn — p. Muhim so‘z — b, fikr — i.', 'Вся страница — h1, раздел — h2, подраздел — h3, текст — p. Ключевое слово — b, мысль — i.', 'Whole page h1, section h2, subsection h3, text p. Key word b, thought i.'),
      L3('{t} ni bosing.', 'Нажми {t}.', 'Tap {t}.')
    ],
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no brackets.'),
    lost: L3('Muhim so‘z matndan yo‘qoldi — so‘zni yana bosing.', 'Ключевое слово пропало из текста — нажми слово ещё раз.', 'The key word left the text: tap a word again.'),
    done: L3('Bu kuchli bo‘ldi! Sahifa tayyor — har bir qism o‘z joyida.', 'Это было мощно! Страница готова — каждая часть на своём месте.', 'That was epic! The page is ready, every part in its place.'),
    askDone: L3('Matnlarni o‘zgartirish mumkin — sahifa yangilanadi', 'Тексты можно менять — страница обновится', 'You can still edit the texts: the page updates')
  },

  s14: {
    eyebrow: L3('Sahifa tayyor', 'Страница готова', 'Page ready'),
    saySelf: L3('Piksel sahifangizni o‘yinchilarga ko‘rsatyapti! Hammasi maslahatsiz chiqdi — xuddi haqiqiy veb-dasturchi kabi!',
      'Пиксель уже показывает твою страницу игрокам! Всё получилось без подсказок — как у настоящего веб-программиста!',
      'Pixel is already showing your page to the players! It all worked without hints, like a real web developer!'),
    sayHelp: L3('Piksel sahifangizni o‘yinchilarga ko‘rsatyapti! Ba’zi joylarda maslahatlar yordam berdi — bu yaxshi, endi hammasi tushunarli.',
      'Пиксель уже показывает твою страницу игрокам! Кое-где помогли подсказки — и это нормально: теперь всё понятно.',
      'Pixel is already showing your page to the players! Hints helped in a few places, and that’s fine: now it all makes sense.'),
    ach: {
      heads: L3('Sarlavhalar h1, h2, h3', 'Заголовки h1, h2, h3', 'Headings h1, h2, h3'),
      levels: L3('Olti daraja h1–h6', 'Шесть уровней h1–h6', 'Six levels h1–h6'),
      title: L3('title va h1 farqi', 'Разница title и h1', 'title vs h1'),
      p: L3('Xatboshilar p', 'Абзацы p', 'Paragraphs p'),
      marks: L3('Qalin b va kursiv i', 'Жирный b и курсив i', 'Bold b and italic i'),
      fix: L3('Bashorat va tuzatish', 'Прогноз и починка строк', 'Predicting and fixing'),
      own: L3('O‘z turnir sahifangiz', 'Своя страница турнира', 'Your own tournament page')
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
Object.assign(SPOKEN, { heads: 1, paras: 1, marks: 1, right: 1, enterWhy: 1, tell: 1, all: 1, q: 1, qWrong: 1, extraQ: 1,
  extraWrong: 1, extraSay: 1, extraDone: 1, wrongSel: 1, wrongSelX: 1, wrongTag: 1, noSel: 1, intro: 1, edgeBefore: 1, nestPart: 1,
  nestOut: 1, pairFine: 1, pairFineI: 1, pairSame: 1, pairP: 1, okStep: 1, noTags: 1, same: 1, lost: 1, saySelf: 1, sayHelp: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { newText: 1, opts: 1, answer: 1 } });

const PIX = {"svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg fg-robot fg-bust\" viewBox=\"0 0 420 430\" role=\"img\" aria-label=\"Робот Pixel на подставке: корпус с экраном, руки, ноги, голова с антенной.\"><path class=\"iso-halo\" d=\"M53.7 338.6L54.1 336.7L55.2 334.9L57 333.3L144.9 268.1L147.3 266.6L150.2 265.4L153.5 264.6L157.1 264L160.9 263.9L164.6 264L168.2 264.6L171.5 265.5L358.2 328.5L361.1 329.7L363.5 331.1L365.2 332.8L366.3 334.6L366.7 336.4L366.7 358.5L366.3 360.4L365.2 362.2L363.4 363.8L275.4 429L273.1 430.5L270.1 431.6L266.8 432.5L263.2 433.1L259.5 433.2L255.8 433L252.2 432.5L248.9 431.6L62.2 368.6L59.3 367.4L56.9 366L55.1 364.3L54.1 362.5L53.7 360.6Z\"/><g data-paint=\"base\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M53.7 338.6L54.1 336.7L55.2 334.9L57 333.3L144.9 268.1L147.3 266.6L150.2 265.4L153.5 264.6L157.1 264L160.9 263.9L164.6 264L168.2 264.6L171.5 265.5L358.2 328.5L361.1 329.7L363.5 331.1L365.2 332.8L366.3 334.6L366.7 336.4L366.7 358.5L366.3 360.4L365.2 362.2L363.4 363.8L275.4 429L273.1 430.5L270.1 431.6L266.8 432.5L263.2 433.1L259.5 433.2L255.8 433L252.2 432.5L248.9 431.6L62.2 368.6L59.3 367.4L56.9 366L55.1 364.3L54.1 362.5L53.7 360.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M366.7 358.5L366.3 360.4L366.3 338.3L366.7 336.4ZM366.3 360.4L365.2 362.2L365.2 340.1L366.3 338.3ZM365.2 362.2L363.4 363.8L363.4 341.7L365.2 340.1ZM363.4 363.8L275.4 429L275.4 406.9L363.4 341.7ZM275.4 429L273.1 430.5L273.1 408.4L275.4 406.9ZM273.1 430.5L270.1 431.6L270.1 409.6L273.1 408.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M270.1 431.6L266.8 432.5L266.8 410.4L270.1 409.6ZM266.8 432.5L263.2 433.1L263.2 411L266.8 410.4ZM263.2 433.1L259.5 433.2L259.5 411.1L263.2 411Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M259.5 433.2L255.8 433L255.8 411L259.5 411.1ZM255.8 433L252.2 432.5L252.2 410.4L255.8 411ZM252.2 432.5L248.9 431.6L248.9 409.5L252.2 410.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M248.9 431.6L62.2 368.6L62.2 346.5L248.9 409.5ZM62.2 368.6L59.3 367.4L59.3 345.3L62.2 346.5ZM59.3 367.4L56.9 366L56.9 343.9L59.3 345.3ZM56.9 366L55.1 364.3L55.1 342.2L56.9 343.9ZM55.1 364.3L54.1 362.5L54.1 340.4L55.1 342.2ZM54.1 362.5L53.7 360.6L53.7 338.6L54.1 340.4Z\"/><path class=\"iso-top\" d=\"M358.2 328.5L361.1 329.7L363.5 331.1L365.2 332.8L366.3 334.6L366.7 336.4L366.3 338.3L365.2 340.1L363.4 341.7L275.4 406.9L273.1 408.4L270.1 409.6L266.8 410.4L263.2 411L259.5 411.1L255.8 411L252.2 410.4L248.9 409.5L62.2 346.5L59.3 345.3L56.9 343.9L55.1 342.2L54.1 340.4L53.7 338.6L54.1 336.7L55.2 334.9L57 333.3L144.9 268.1L147.3 266.6L150.2 265.4L153.5 264.6L157.1 264L160.9 263.9L164.6 264L168.2 264.6L171.5 265.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M366.7 336.4L366.3 338.3L365.2 340.1L363.4 341.7L275.4 406.9L273.1 408.4L270.1 409.6L266.8 410.4L263.2 411L259.5 411.1L255.8 411L252.2 410.4L248.9 409.5L62.2 346.5L59.3 345.3L56.9 343.9L55.1 342.2L54.1 340.4L53.7 338.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M366.7 336.4L363.4 338L362.4 339.5L360.8 341L273.1 406L271 407.3L268.5 408.3L265.7 409.1L262.7 409.5L259.5 409.7L256.4 409.5L253.3 409L250.4 408.2L63.9 345.3L61.4 344.3L59.4 343.1L57.9 341.7L57 340.1L53.7 338.6\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M366.7 349.3L366.3 351.2L365.2 353L363.4 354.6L275.4 419.8L273.1 421.3L270.1 422.4L266.8 423.3L263.2 423.9L259.5 424L255.8 423.8L252.2 423.3L248.9 422.4L62.2 359.4L59.3 358.2L56.9 356.8L55.1 355.1L54.1 353.3L53.7 351.4\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M53.7 338.6L54.1 336.7L55.2 334.9L57 333.3L144.9 268.1L147.3 266.6L150.2 265.4L153.5 264.6L157.1 264L160.9 263.9L164.6 264L168.2 264.6L171.5 265.5L358.2 328.5L361.1 329.7L363.5 331.1L365.2 332.8L366.3 334.6L366.7 336.4M366.7 358.5L366.3 360.4L365.2 362.2L363.4 363.8L275.4 429L273.1 430.5L270.1 431.6L266.8 432.5L263.2 433.1L259.5 433.2L255.8 433L252.2 432.5L248.9 431.6L62.2 368.6L59.3 367.4L56.9 366L55.1 364.3L54.1 362.5L53.7 360.6M366.7 336.4L366.7 358.5M53.7 338.6L53.7 360.6\"/></g></g><g data-paint=\"base2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M70.7 333L70.8 332.7L71.1 332.5L159 267.3L159.4 267.1L159.9 266.9L160.4 266.9L160.9 266.8L161.5 266.9L162 267L348.7 330L349.1 330.2L349.4 330.4L349.6 330.7L349.6 331L349.6 336.5L349.5 336.7L349.3 337L261.4 402.2L261 402.4L260.5 402.5L260 402.6L259.4 402.6L258.9 402.6L258.4 402.5L71.7 339.5L71.2 339.3L70.9 339.1L70.8 338.8L70.7 338.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M349.6 336.5L349.5 336.7L349.5 331.2L349.6 331ZM349.5 336.7L349.3 337L349.3 331.5L349.5 331.2ZM349.3 337L261.4 402.2L261.4 396.7L349.3 331.5ZM261.4 402.2L261 402.4L261 396.9L261.4 396.7ZM261 402.4L260.5 402.5L260.5 397L261 396.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M260.5 402.5L260 402.6L260 397.1L260.5 397ZM260 402.6L259.4 402.6L259.4 397.1L260 397.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M259.4 402.6L258.9 402.6L258.9 397.1L259.4 397.1ZM258.9 402.6L258.4 402.5L258.4 396.9L258.9 397.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M258.4 402.5L71.7 339.5L71.7 334L258.4 396.9ZM71.7 339.5L71.2 339.3L71.2 333.8L71.7 334ZM71.2 339.3L70.9 339.1L70.9 333.5L71.2 333.8ZM70.9 339.1L70.8 338.8L70.8 333.3L70.9 333.5ZM70.8 338.8L70.7 338.5L70.7 333L70.8 333.3Z\"/><path class=\"iso-top\" d=\"M348.7 330L349.1 330.2L349.4 330.4L349.6 330.7L349.6 331L349.5 331.2L349.3 331.5L261.4 396.7L261 396.9L260.5 397L260 397.1L259.4 397.1L258.9 397.1L258.4 396.9L71.7 334L71.2 333.8L70.9 333.5L70.8 333.3L70.7 333L70.8 332.7L71.1 332.5L159 267.3L159.4 267.1L159.9 266.9L160.4 266.9L160.9 266.8L161.5 266.9L162 267Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M349.6 331L349.5 331.2L349.3 331.5L261.4 396.7L261 396.9L260.5 397L260 397.1L259.4 397.1L258.9 397.1L258.4 396.9L71.7 334L71.2 333.8L70.9 333.5L70.8 333.3L70.7 333\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M349.6 331L348.3 331L348.2 331.2L260.3 396.3L260.1 396.4L260 396.4L259.8 396.5L259.5 396.5L259.3 396.5L259 396.4L72.4 333.5L72.2 333.4L72.1 333.3L72 333.2L70.7 333\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M70.7 333L70.8 332.7L71.1 332.5L159 267.3L159.4 267.1L159.9 266.9L160.4 266.9L160.9 266.8L161.5 266.9L162 267L348.7 330L349.1 330.2L349.4 330.4L349.6 330.7L349.6 331M349.6 336.5L349.5 336.7L349.3 337L261.4 402.2L261 402.4L260.5 402.5L260 402.6L259.4 402.6L258.9 402.6L258.4 402.5L71.7 339.5L71.2 339.3L70.9 339.1L70.8 338.8L70.7 338.5M349.6 331L349.6 336.5M70.7 333L70.7 338.5\"/></g></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"159.6\" cy=\"270.5\" r=\"0.9\"/><circle cx=\"353.4\" cy=\"335.8\" r=\"0.9\"/><circle cx=\"66.9\" cy=\"339.2\" r=\"0.9\"/><circle cx=\"260.7\" cy=\"404.5\" r=\"0.9\"/></g><g data-sel=\"plate\"><g data-paint=\"plate\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M101.9 364.7L102.1 364.3L102.8 364.1L103.6 364.2L207.5 399.2L207.9 399.6L207.9 413.4L207.8 413.8L207.1 414L206.3 413.9L102.4 378.9L101.9 378.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M207.9 413.4L207.8 413.8L207.8 400L207.9 399.6ZM207.8 413.8L207.1 414L207.1 400.2L207.8 400Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M207.1 414L206.3 413.9L206.3 400.1L207.1 400.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M206.3 413.9L102.4 378.9L102.4 365.1L206.3 400.1ZM102.4 378.9L101.9 378.5L101.9 364.7L102.4 365.1Z\"/><path class=\"iso-top\" d=\"M207.5 399.2L207.9 399.6L207.8 400L207.8 400L207.1 400.2L206.3 400.1L102.4 365.1L101.9 364.7L102.1 364.3L102.1 364.3L102.8 364.1L103.6 364.2Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M207.8 400L207.8 400M101.9 364.7L102.1 364.3L102.1 364.3L102.8 364.1L103.6 364.2L207.5 399.2L207.9 399.6M207.9 413.4L207.8 413.8M207.8 413.8L207.1 414L206.3 413.9L102.4 378.9L101.9 378.5M207.9 399.6L207.9 413.4M207.8 400L207.8 413.8M207.8 400L207.8 413.8M101.9 364.7L101.9 378.5\"/></g></g></g><text dy=\"1.56\" data-t=\"plate\" data-fit=\"52\" data-cls=\"plate\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.762 0.594 0 1.84 154.336 389.577)\" font-size=\"4.6\" text-anchor=\"middle\">ROBOT PIXEL</text><g class=\"rb-body\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M147.1 321.9L147.5 320.3L148.9 318.8L175.1 299.4L177.3 298.2L180.3 297.4L183.5 297.1L186.8 297.3L189.8 298L211 305.1L213.4 306.2L215 307.7L215.6 309.3L215.6 318.5L215.2 320.2L213.8 321.7L187.7 341.1L185.4 342.3L182.5 343.1L179.3 343.4L176 343.2L172.9 342.5L151.8 335.4L149.4 334.2L147.8 332.8L147.1 331.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M215.6 318.5L215.2 320.2L215.2 311L215.6 309.3ZM215.2 320.2L213.8 321.7L213.8 312.5L215.2 311ZM213.8 321.7L187.7 341.1L187.7 331.9L213.8 312.5ZM187.7 341.1L185.4 342.3L185.4 333.1L187.7 331.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M185.4 342.3L182.5 343.1L182.5 333.9L185.4 333.1ZM182.5 343.1L179.3 343.4L179.3 334.2L182.5 333.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M179.3 343.4L176 343.2L176 334L179.3 334.2ZM176 343.2L172.9 342.5L172.9 333.3L176 334Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M172.9 342.5L151.8 335.4L151.8 326.2L172.9 333.3ZM151.8 335.4L149.4 334.2L149.4 325L151.8 326.2ZM149.4 334.2L147.8 332.8L147.8 323.6L149.4 325ZM147.8 332.8L147.1 331.1L147.1 321.9L147.8 323.6Z\"/><path class=\"iso-top\" d=\"M211 305.1L213.4 306.2L215 307.7L215.6 309.3L215.2 311L213.8 312.5L187.7 331.9L185.4 333.1L182.5 333.9L179.3 334.2L176 334L172.9 333.3L151.8 326.2L149.4 325L147.8 323.6L147.1 321.9L147.5 320.3L148.9 318.8L175.1 299.4L177.3 298.2L180.3 297.4L183.5 297.1L186.8 297.3L189.8 298Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M215.6 309.3L215.2 311L213.8 312.5L187.7 331.9L185.4 333.1L182.5 333.9L179.3 334.2L176 334L172.9 333.3L151.8 326.2L149.4 325L147.8 323.6L147.1 321.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M215.6 309.3L213.6 310.7L212.4 312.1L186.4 331.3L184.4 332.4L181.9 333.1L179.2 333.3L176.4 333.2L173.8 332.5L152.9 325.5L150.7 324.5L149.4 323.3L147.1 321.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M147.1 321.9L147.5 320.3L148.9 318.8L175.1 299.4L177.3 298.2L180.3 297.4L183.5 297.1L186.8 297.3L189.8 298L211 305.1L213.4 306.2L215 307.7L215.6 309.3M215.6 318.5L215.2 320.2L213.8 321.7L187.7 341.1L185.4 342.3L182.5 343.1L179.3 343.4L176 343.2L172.9 342.5L151.8 335.4L149.4 334.2L147.8 332.8L147.1 331.1M215.6 309.3L215.6 318.5M147.1 321.9L147.1 331.1\"/></g></g><g data-paint=\"limb2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M172.1 248.1L172.2 246.8L172.9 245.5L174.1 244.3L175.8 243.4L177.9 242.6L180.3 242L182.8 241.8L185.4 241.8L188 242.2L190.3 242.8L192.3 243.6L193.9 244.7L194.9 245.9L195.4 247.1L195.4 313.4L195.3 314.7L194.7 316L193.4 317.1L191.8 318.1L189.7 318.9L187.3 319.4L184.7 319.7L182.1 319.6L179.5 319.3L177.2 318.7L175.2 317.9L173.7 316.8L172.6 315.6L172.1 314.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M193.4 317.1L191.8 318.1L191.8 251.9L193.4 250.9ZM191.8 318.1L189.7 318.9L189.7 252.7L191.8 251.9ZM195.4 313.4L195.3 314.7L195.3 248.5L195.4 247.1ZM195.3 314.7L194.7 316L194.7 249.7L195.3 248.5ZM194.7 316L193.4 317.1L193.4 250.9L194.7 249.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M189.7 318.9L187.3 319.4L187.3 253.2L189.7 252.7ZM187.3 319.4L184.7 319.7L184.7 253.4L187.3 253.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M184.7 319.7L182.1 319.6L182.1 253.4L184.7 253.4ZM182.1 319.6L179.5 319.3L179.5 253.1L182.1 253.4ZM179.5 319.3L177.2 318.7L177.2 252.5L179.5 253.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M177.2 318.7L175.2 317.9L175.2 251.6L177.2 252.5ZM175.2 317.9L173.7 316.8L173.7 250.6L175.2 251.6ZM173.7 316.8L172.6 315.6L172.6 249.4L173.7 250.6ZM172.6 315.6L172.1 314.3L172.1 248.1L172.6 249.4Z\"/><path class=\"iso-top\" d=\"M193.4 250.9L191.8 251.9L189.7 252.7L187.3 253.2L184.7 253.4L182.1 253.4L179.5 253.1L177.2 252.5L175.2 251.6L173.7 250.6L172.6 249.4L172.1 248.1L172.2 246.8L172.9 245.5L174.1 244.3L175.8 243.4L177.9 242.6L180.3 242L182.8 241.8L185.4 241.8L188 242.2L190.3 242.8L192.3 243.6L193.9 244.7L194.9 245.9L195.4 247.1L195.3 248.5L194.7 249.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M195.4 247.1L195.3 248.5L194.7 249.7L193.4 250.9L191.8 251.9L189.7 252.7L187.3 253.2L184.7 253.4L182.1 253.4L179.5 253.1L177.2 252.5L175.2 251.6L173.7 250.6L172.6 249.4L172.1 248.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M172.1 248.1L172.2 246.8L172.9 245.5L174.1 244.3L175.8 243.4L177.9 242.6L180.3 242L182.8 241.8L185.4 241.8L188 242.2L190.3 242.8L192.3 243.6L193.9 244.7L194.9 245.9L195.4 247.1M195.4 313.4L195.3 314.7L194.7 316L193.4 317.1L191.8 318.1L189.7 318.9L187.3 319.4L184.7 319.7L182.1 319.6L179.5 319.3L177.2 318.7L175.2 317.9L173.7 316.8L172.6 315.6L172.1 314.3M172.1 248.1L172.1 314.3M195.4 247.1L195.4 313.4\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M167.7 274L167.8 272.2L168.7 270.5L170.4 268.9L172.7 267.5L175.6 266.4L178.9 265.7L182.5 265.3L186.1 265.4L189.6 265.8L192.8 266.7L195.5 267.9L197.7 269.3L199.2 271L199.9 272.7L199.9 283.8L199.7 285.6L198.8 287.3L197.1 288.9L194.8 290.3L191.9 291.4L188.6 292.1L185 292.5L181.4 292.4L177.9 292L174.7 291.1L172 289.9L169.8 288.5L168.4 286.8L167.7 285.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M197.1 288.9L194.8 290.3L194.8 279.3L197.1 277.9ZM194.8 290.3L191.9 291.4L191.9 280.4L194.8 279.3ZM199.9 283.8L199.7 285.6L199.7 274.5L199.9 272.7ZM199.7 285.6L198.8 287.3L198.8 276.3L199.7 274.5ZM198.8 287.3L197.1 288.9L197.1 277.9L198.8 276.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M191.9 291.4L188.6 292.1L188.6 281.1L191.9 280.4ZM188.6 292.1L185 292.5L185 281.4L188.6 281.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M185 292.5L181.4 292.4L181.4 281.4L185 281.4ZM181.4 292.4L177.9 292L177.9 280.9L181.4 281.4ZM177.9 292L174.7 291.1L174.7 280.1L177.9 280.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M174.7 291.1L172 289.9L172 278.9L174.7 280.1ZM172 289.9L169.8 288.5L169.8 277.5L172 278.9ZM169.8 288.5L168.4 286.8L168.4 275.8L169.8 277.5ZM168.4 286.8L167.7 285.1L167.7 274L168.4 275.8Z\"/><path class=\"iso-top\" d=\"M197.1 277.9L194.8 279.3L191.9 280.4L188.6 281.1L185 281.4L181.4 281.4L177.9 280.9L174.7 280.1L172 278.9L169.8 277.5L168.4 275.8L167.7 274L167.8 272.2L168.7 270.5L170.4 268.9L172.7 267.5L175.6 266.4L178.9 265.7L182.5 265.3L186.1 265.4L189.6 265.8L192.8 266.7L195.5 267.9L197.7 269.3L199.2 271L199.9 272.7L199.7 274.5L198.8 276.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M199.9 272.7L199.7 274.5L198.8 276.3L197.1 277.9L194.8 279.3L191.9 280.4L188.6 281.1L185 281.4L181.4 281.4L177.9 280.9L174.7 280.1L172 278.9L169.8 277.5L168.4 275.8L167.7 274\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M167.7 274L167.8 272.2L168.7 270.5L170.4 268.9L172.7 267.5L175.6 266.4L178.9 265.7L182.5 265.3L186.1 265.4L189.6 265.8L192.8 266.7L195.5 267.9L197.7 269.3L199.2 271L199.9 272.7M199.9 283.8L199.7 285.6L198.8 287.3L197.1 288.9L194.8 290.3L191.9 291.4L188.6 292.1L185 292.5L181.4 292.4L177.9 292L174.7 291.1L172 289.9L169.8 288.5L168.4 286.8L167.7 285.1M167.7 274L167.7 285.1M199.9 272.7L199.9 283.8\"/></g></g><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M200 339.8L200.4 338.1L201.8 336.6L227.9 317.2L230.2 316L233.1 315.2L236.4 314.9L239.7 315.1L242.7 315.8L263.8 322.9L266.3 324.1L267.9 325.5L268.5 327.1L268.5 336.3L268.1 338L266.7 339.5L240.5 358.9L238.3 360.1L235.4 360.9L232.1 361.2L228.8 361L225.8 360.3L204.7 353.2L202.2 352.1L200.6 350.6L200 349Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M268.5 336.3L268.1 338L268.1 328.8L268.5 327.1ZM268.1 338L266.7 339.5L266.7 330.3L268.1 328.8ZM266.7 339.5L240.5 358.9L240.5 349.7L266.7 330.3ZM240.5 358.9L238.3 360.1L238.3 350.9L240.5 349.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M238.3 360.1L235.4 360.9L235.4 351.7L238.3 350.9ZM235.4 360.9L232.1 361.2L232.1 352L235.4 351.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M232.1 361.2L228.8 361L228.8 351.8L232.1 352ZM228.8 361L225.8 360.3L225.8 351.1L228.8 351.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M225.8 360.3L204.7 353.2L204.7 344L225.8 351.1ZM204.7 353.2L202.2 352.1L202.2 342.8L204.7 344ZM202.2 352.1L200.6 350.6L200.6 341.4L202.2 342.8ZM200.6 350.6L200 349L200 339.8L200.6 341.4Z\"/><path class=\"iso-top\" d=\"M263.8 322.9L266.3 324.1L267.9 325.5L268.5 327.1L268.1 328.8L266.7 330.3L240.5 349.7L238.3 350.9L235.4 351.7L232.1 352L228.8 351.8L225.8 351.1L204.7 344L202.2 342.8L200.6 341.4L200 339.8L200.4 338.1L201.8 336.6L227.9 317.2L230.2 316L233.1 315.2L236.4 314.9L239.7 315.1L242.7 315.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M268.5 327.1L268.1 328.8L266.7 330.3L240.5 349.7L238.3 350.9L235.4 351.7L232.1 352L228.8 351.8L225.8 351.1L204.7 344L202.2 342.8L200.6 341.4L200 339.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M268.5 327.1L266.5 328.6L265.2 329.9L239.2 349.1L237.2 350.2L234.8 350.9L232 351.2L229.3 351L226.6 350.4L205.7 343.3L203.6 342.3L202.2 341.1L200 339.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M200 339.8L200.4 338.1L201.8 336.6L227.9 317.2L230.2 316L233.1 315.2L236.4 314.9L239.7 315.1L242.7 315.8L263.8 322.9L266.3 324.1L267.9 325.5L268.5 327.1M268.5 336.3L268.1 338L266.7 339.5L240.5 358.9L238.3 360.1L235.4 360.9L232.1 361.2L228.8 361L225.8 360.3L204.7 353.2L202.2 352.1L200.6 350.6L200 349M268.5 327.1L268.5 336.3M200 339.8L200 349\"/></g></g><g data-paint=\"limb2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M225 265.9L225 264.6L225.7 263.3L226.9 262.2L228.6 261.2L230.7 260.4L233.1 259.9L235.7 259.6L238.3 259.7L240.8 260L243.1 260.6L245.1 261.4L246.7 262.5L247.8 263.7L248.3 265L248.3 331.2L248.2 332.5L247.5 333.8L246.3 335L244.6 336L242.5 336.7L240.1 337.3L237.5 337.5L234.9 337.5L232.4 337.1L230.1 336.5L228.1 335.7L226.5 334.6L225.5 333.4L225 332.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M246.3 335L244.6 336L244.6 269.7L246.3 268.7ZM244.6 336L242.5 336.7L242.5 270.5L244.6 269.7ZM248.3 331.2L248.2 332.5L248.2 266.3L248.3 265ZM248.2 332.5L247.5 333.8L247.5 267.5L248.2 266.3ZM247.5 333.8L246.3 335L246.3 268.7L247.5 267.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M242.5 336.7L240.1 337.3L240.1 271L242.5 270.5ZM240.1 337.3L237.5 337.5L237.5 271.3L240.1 271Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M237.5 337.5L234.9 337.5L234.9 271.2L237.5 271.3ZM234.9 337.5L232.4 337.1L232.4 270.9L234.9 271.2ZM232.4 337.1L230.1 336.5L230.1 270.3L232.4 270.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M230.1 336.5L228.1 335.7L228.1 269.4L230.1 270.3ZM228.1 335.7L226.5 334.6L226.5 268.4L228.1 269.4ZM226.5 334.6L225.5 333.4L225.5 267.2L226.5 268.4ZM225.5 333.4L225 332.2L225 265.9L225.5 267.2Z\"/><path class=\"iso-top\" d=\"M246.3 268.7L244.6 269.7L242.5 270.5L240.1 271L237.5 271.3L234.9 271.2L232.4 270.9L230.1 270.3L228.1 269.4L226.5 268.4L225.5 267.2L225 265.9L225 264.6L225.7 263.3L226.9 262.2L228.6 261.2L230.7 260.4L233.1 259.9L235.7 259.6L238.3 259.7L240.8 260L243.1 260.6L245.1 261.4L246.7 262.5L247.8 263.7L248.3 265L248.2 266.3L247.5 267.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M248.3 265L248.2 266.3L247.5 267.5L246.3 268.7L244.6 269.7L242.5 270.5L240.1 271L237.5 271.3L234.9 271.2L232.4 270.9L230.1 270.3L228.1 269.4L226.5 268.4L225.5 267.2L225 265.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M225 265.9L225 264.6L225.7 263.3L226.9 262.2L228.6 261.2L230.7 260.4L233.1 259.9L235.7 259.6L238.3 259.7L240.8 260L243.1 260.6L245.1 261.4L246.7 262.5L247.8 263.7L248.3 265M248.3 331.2L248.2 332.5L247.5 333.8L246.3 335L244.6 336L242.5 336.7L240.1 337.3L237.5 337.5L234.9 337.5L232.4 337.1L230.1 336.5L228.1 335.7L226.5 334.6L225.5 333.4L225 332.2M225 265.9L225 332.2M248.3 265L248.3 331.2\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M220.5 291.8L220.6 290L221.5 288.3L223.2 286.7L225.6 285.3L228.5 284.2L231.8 283.5L235.3 283.2L238.9 283.2L242.4 283.7L245.6 284.5L248.4 285.7L250.6 287.1L252 288.8L252.7 290.6L252.7 301.6L252.6 303.4L251.7 305.2L250 306.8L247.7 308.1L244.8 309.2L241.4 310L237.9 310.3L234.3 310.2L230.8 309.8L227.6 308.9L224.8 307.8L222.7 306.3L221.2 304.7L220.5 302.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M250 306.8L247.7 308.1L247.7 297.1L250 295.7ZM247.7 308.1L244.8 309.2L244.8 298.2L247.7 297.1ZM252.7 301.6L252.6 303.4L252.6 292.4L252.7 290.6ZM252.6 303.4L251.7 305.2L251.7 294.1L252.6 292.4ZM251.7 305.2L250 306.8L250 295.7L251.7 294.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M244.8 309.2L241.4 310L241.4 298.9L244.8 298.2ZM241.4 310L237.9 310.3L237.9 299.3L241.4 298.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M237.9 310.3L234.3 310.2L234.3 299.2L237.9 299.3ZM234.3 310.2L230.8 309.8L230.8 298.7L234.3 299.2ZM230.8 309.8L227.6 308.9L227.6 297.9L230.8 298.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M227.6 308.9L224.8 307.8L224.8 296.7L227.6 297.9ZM224.8 307.8L222.7 306.3L222.7 295.3L224.8 296.7ZM222.7 306.3L221.2 304.7L221.2 293.6L222.7 295.3ZM221.2 304.7L220.5 302.9L220.5 291.8L221.2 293.6Z\"/><path class=\"iso-top\" d=\"M250 295.7L247.7 297.1L244.8 298.2L241.4 298.9L237.9 299.3L234.3 299.2L230.8 298.7L227.6 297.9L224.8 296.7L222.7 295.3L221.2 293.6L220.5 291.8L220.6 290L221.5 288.3L223.2 286.7L225.6 285.3L228.5 284.2L231.8 283.5L235.3 283.2L238.9 283.2L242.4 283.7L245.6 284.5L248.4 285.7L250.6 287.1L252 288.8L252.7 290.6L252.6 292.4L251.7 294.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M252.7 290.6L252.6 292.4L251.7 294.1L250 295.7L247.7 297.1L244.8 298.2L241.4 298.9L237.9 299.3L234.3 299.2L230.8 298.7L227.6 297.9L224.8 296.7L222.7 295.3L221.2 293.6L220.5 291.8\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M220.5 291.8L220.6 290L221.5 288.3L223.2 286.7L225.6 285.3L228.5 284.2L231.8 283.5L235.3 283.2L238.9 283.2L242.4 283.7L245.6 284.5L248.4 285.7L250.6 287.1L252 288.8L252.7 290.6M252.7 301.6L252.6 303.4L251.7 305.2L250 306.8L247.7 308.1L244.8 309.2L241.4 310L237.9 310.3L234.3 310.2L230.8 309.8L227.6 308.9L224.8 307.8L222.7 306.3L221.2 304.7L220.5 302.9M220.5 291.8L220.5 302.9M252.7 290.6L252.7 301.6\"/></g></g><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M153.9 236.3L154.4 234.3L156.1 232.5L172.7 220.2L175.4 218.7L178.9 217.8L182.8 217.4L186.8 217.6L190.4 218.5L260.9 242.2L263.8 243.6L265.7 245.3L266.5 247.3L266.5 262L266 264L264.3 265.8L247.7 278.1L245 279.6L241.5 280.6L237.5 280.9L233.6 280.7L230 279.9L159.5 256.1L156.6 254.7L154.7 253L153.9 251Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M266.5 262L266 264L266 249.3L266.5 247.3ZM266 264L264.3 265.8L264.3 251.1L266 249.3ZM264.3 265.8L247.7 278.1L247.7 263.4L264.3 251.1ZM247.7 278.1L245 279.6L245 264.9L247.7 263.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M245 279.6L241.5 280.6L241.5 265.8L245 264.9ZM241.5 280.6L237.5 280.9L237.5 266.2L241.5 265.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M237.5 280.9L233.6 280.7L233.6 266L237.5 266.2ZM233.6 280.7L230 279.9L230 265.1L233.6 266Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M230 279.9L159.5 256.1L159.5 241.4L230 265.1ZM159.5 256.1L156.6 254.7L156.6 240L159.5 241.4ZM156.6 254.7L154.7 253L154.7 238.3L156.6 240ZM154.7 253L153.9 251L153.9 236.3L154.7 238.3Z\"/><path class=\"iso-top\" d=\"M260.9 242.2L263.8 243.6L265.7 245.3L266.5 247.3L266 249.3L264.3 251.1L247.7 263.4L245 264.9L241.5 265.8L237.5 266.2L233.6 266L230 265.1L159.5 241.4L156.6 240L154.7 238.3L153.9 236.3L154.4 234.3L156.1 232.5L172.7 220.2L175.4 218.7L178.9 217.8L182.8 217.4L186.8 217.6L190.4 218.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M266.5 247.3L266 249.3L264.3 251.1L247.7 263.4L245 264.9L241.5 265.8L237.5 266.2L233.6 266L230 265.1L159.5 241.4L156.6 240L154.7 238.3L153.9 236.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M266.5 247.3L264.4 249L262.8 250.7L246.3 262.9L243.9 264.2L240.9 265L237.5 265.4L234.1 265.2L230.8 264.4L160.6 240.7L157.9 239.5L156.2 238L153.9 236.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M153.9 236.3L154.4 234.3L156.1 232.5L172.7 220.2L175.4 218.7L178.9 217.8L182.8 217.4L186.8 217.6L190.4 218.5L260.9 242.2L263.8 243.6L265.7 245.3L266.5 247.3M266.5 262L266 264L264.3 265.8L247.7 278.1L245 279.6L241.5 280.6L237.5 280.9L233.6 280.7L230 279.9L159.5 256.1L156.6 254.7L154.7 253L153.9 251M266.5 247.3L266.5 262M153.9 236.3L153.9 251\"/></g></g><g class=\"rb-arm-l\"><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M130.2 188L130.7 186.4L132.1 184.9L136.8 181.4L139.1 180.2L142 179.3L145.2 179L148.5 179.2L151.6 179.9L155.1 181.1L157.5 182.3L159.1 183.7L159.8 185.3L159.8 207.4L159.4 209.1L157.9 210.6L153.2 214.1L150.9 215.3L148 216.1L144.8 216.4L141.5 216.2L138.4 215.5L134.9 214.4L132.5 213.2L130.9 211.8L130.2 210.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M153.2 192L150.9 193.2L150.9 215.3L153.2 214.1ZM150.9 193.2L148 194L148 216.1L150.9 215.3ZM148 194L144.8 194.4L144.8 216.4L148 216.1ZM159.8 185.3L159.4 187L159.4 209.1L159.8 207.4ZM159.4 187L157.9 188.5L157.9 210.6L159.4 209.1ZM157.9 188.5L153.2 192L153.2 214.1L157.9 210.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M144.8 194.4L141.5 194.2L141.5 216.2L144.8 216.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M141.5 194.2L138.4 193.5L138.4 215.5L141.5 216.2ZM138.4 193.5L134.9 192.3L134.9 214.4L138.4 215.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M134.9 192.3L132.5 191.1L132.5 213.2L134.9 214.4ZM132.5 191.1L130.9 189.7L130.9 211.8L132.5 213.2Z\"/><path class=\"iso-top\" d=\"M130.9 189.7L130.2 188L130.2 210.1L130.9 211.8ZM153.2 192L150.9 193.2L148 194L144.8 194.4L141.5 194.2L138.4 193.5L134.9 192.3L132.5 191.1L130.9 189.7L130.2 188L130.7 186.4L132.1 184.9L136.8 181.4L139.1 180.2L142 179.3L145.2 179L148.5 179.2L151.6 179.9L155.1 181.1L157.5 182.3L159.1 183.7L159.8 185.3L159.4 187L157.9 188.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M153.2 192L150.9 193.2M150.9 193.2L148 194M148 194L144.8 194.4M144.8 194.4L141.5 194.2M141.5 194.2L138.4 193.5M138.4 193.5L134.9 192.3M134.9 192.3L132.5 191.1M132.5 191.1L130.9 189.7M130.9 189.7L130.2 188M159.8 185.3L159.4 187M159.4 187L157.9 188.5M157.9 188.5L153.2 192\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M130.2 188L130.7 186.4L132.1 184.9L136.8 181.4L139.1 180.2L142 179.3L145.2 179L148.5 179.2L151.6 179.9L155.1 181.1L157.5 182.3L159.1 183.7L159.8 185.3L159.8 207.4L159.4 209.1L157.9 210.6L153.2 214.1L150.9 215.3L148 216.1L144.8 216.4L141.5 216.2L138.4 215.5L134.9 214.4L132.5 213.2L130.9 211.8L130.2 210.1Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M133.5 179.2L133.6 178.5L134 177.8L134.4 177.1L135.1 176.4L135.9 175.8L136.9 175.3L138 174.8L139.2 174.4L140.5 174L141.9 173.8L143.4 173.7L144.8 173.6L146.3 173.6L147.7 173.8L149.1 174L150.5 174.3L151.7 174.7L152.9 175.1L153.9 175.7L154.7 176.3L155.4 176.9L156 177.6L156.3 178.3L156.5 179.1L156.5 186.4L156.4 187.2L156.2 187.9L155.8 188.6L155.3 189.3L154.5 189.9L153.6 190.5L152.6 191L151.4 191.5L150.1 191.8L148.8 192.1L147.4 192.3L145.9 192.4L144.4 192.4L143 192.3L141.6 192.2L140.2 191.9L138.9 191.6L137.7 191.1L136.6 190.6L135.7 190.1L134.9 189.4L134.3 188.8L133.9 188.1L133.6 187.3L133.5 186.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M156.5 186.7L156.2 187.8L155.6 188.9L154.5 189.9L153.1 190.8L151.3 191.5L149.3 192L147.2 192.3L145 192.4L145 185.1L147.2 185L149.3 184.6L151.3 184.1L153.1 183.4L154.5 182.5L155.6 181.6L156.2 180.5L156.5 179.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M145 192.4L142.7 192.3L140.6 192L140.6 184.6L142.7 185L145 185.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M140.6 192L138.6 191.5L136.9 190.7L136.9 183.4L138.6 184.1L140.6 184.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M136.9 190.7L135.4 189.9L134.4 188.9L133.7 187.8L133.7 180.4L134.4 181.5L135.4 182.5L136.9 183.4Z\"/><path class=\"iso-top\" d=\"M154.5 182.5L153.1 183.4L151.3 184.1L149.3 184.6L147.2 185L145 185.1L142.7 185L140.6 184.6L138.6 184.1L136.9 183.4L135.4 182.5L134.4 181.5L133.7 180.4L133.5 179.3L133.8 178.2L134.4 177.1L135.5 176.1L136.9 175.3L138.7 174.5L140.7 174L142.8 173.7L145.1 173.6L147.3 173.7L149.4 174L151.4 174.6L153.2 175.3L154.6 176.2L155.6 177.2L156.3 178.2L156.5 179.4L156.2 180.5L155.6 181.6L154.5 182.5L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3L145 179.3ZM133.7 187.8L133.5 186.7L133.5 179.3L133.7 180.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M156.5 179.3L156.4 180.1L156.1 180.8L155.7 181.4L155.1 182.1L154.3 182.7L153.4 183.3L152.3 183.8L151.2 184.2L149.9 184.5L148.5 184.8L147.2 185L145.7 185.1L144.3 185.1L142.9 185L141.5 184.8L140.1 184.5L138.9 184.2L137.7 183.8L136.6 183.3L135.7 182.7L134.9 182.1L134.3 181.4L133.9 180.8L133.6 180.1L133.5 179.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M133.5 179.2L133.6 178.5L134 177.8L134.4 177.1L135.1 176.4L135.9 175.8L136.9 175.3L138 174.8L139.2 174.4L140.5 174L141.9 173.8L143.4 173.7L144.8 173.6L146.3 173.6L147.7 173.8L149.1 174L150.5 174.3L151.7 174.7L152.9 175.1L153.9 175.7L154.7 176.3L155.4 176.9L156 177.6L156.3 178.3L156.5 179.1L156.5 186.4L156.4 187.2L156.2 187.9L155.8 188.6L155.3 189.3L154.5 189.9L153.6 190.5L152.6 191L151.4 191.5L150.1 191.8L148.8 192.1L147.4 192.3L145.9 192.4L144.4 192.4L143 192.3L141.6 192.2L140.2 191.9L138.9 191.6L137.7 191.1L136.6 190.6L135.7 190.1L134.9 189.4L134.3 188.8L133.9 188.1L133.6 187.3L133.5 186.6Z\"/></g></g><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M131.5 133L131.8 132.1L132.6 131.2L139.8 125.9L141.1 125.1L142.9 124.7L144.8 124.5L146.8 124.6L148.6 125L155.7 127.4L157.1 128.1L158.1 128.9L158.5 129.9L158.5 181.4L158.2 182.4L157.4 183.3L150.2 188.6L148.9 189.4L147.1 189.8L145.2 190L143.2 189.9L141.4 189.5L134.3 187.1L132.9 186.4L131.9 185.6L131.5 184.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M150.2 137.1L148.9 137.8L148.9 189.4L150.2 188.6ZM148.9 137.8L147.1 138.3L147.1 189.8L148.9 189.4ZM147.1 138.3L145.2 138.5L145.2 190L147.1 189.8ZM158.5 129.9L158.2 130.9L158.2 182.4L158.5 181.4ZM158.2 130.9L157.4 131.8L157.4 183.3L158.2 182.4ZM157.4 131.8L150.2 137.1L150.2 188.6L157.4 183.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M145.2 138.5L143.2 138.4L143.2 189.9L145.2 190Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M143.2 138.4L141.4 138L141.4 189.5L143.2 189.9ZM141.4 138L134.3 135.6L134.3 187.1L141.4 189.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M134.3 135.6L132.9 134.9L132.9 186.4L134.3 187.1ZM132.9 134.9L131.9 134L131.9 185.6L132.9 186.4Z\"/><path class=\"iso-top\" d=\"M131.9 134L131.5 133L131.5 184.6L131.9 185.6ZM150.2 137.1L148.9 137.8L147.1 138.3L145.2 138.5L143.2 138.4L141.4 138L134.3 135.6L132.9 134.9L131.9 134L131.5 133L131.8 132.1L132.6 131.2L139.8 125.9L141.1 125.1L142.9 124.7L144.8 124.5L146.8 124.6L148.6 125L155.7 127.4L157.1 128.1L158.1 128.9L158.5 129.9L158.2 130.9L157.4 131.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M150.2 137.1L148.9 137.8M148.9 137.8L147.1 138.3M147.1 138.3L145.2 138.5M145.2 138.5L143.2 138.4M143.2 138.4L141.4 138M141.4 138L134.3 135.6M134.3 135.6L132.9 134.9M132.9 134.9L131.9 134M131.9 134L131.5 133M158.5 129.9L158.2 130.9M158.2 130.9L157.4 131.8M157.4 131.8L150.2 137.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M131.5 133L131.8 132.1L132.6 131.2L139.8 125.9L141.1 125.1L142.9 124.7L144.8 124.5L146.8 124.6L148.6 125L155.7 127.4L157.1 128.1L158.1 128.9L158.5 129.9L158.5 181.4L158.2 182.4L157.4 183.3L150.2 188.6L148.9 189.4L147.1 189.8L145.2 190L143.2 189.9L141.4 189.5L134.3 187.1L132.9 186.4L131.9 185.6L131.5 184.6Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M125.1 126.4L125.1 125.1L125.3 123.9L125.6 122.8L126.1 121.7L126.7 120.7L127.4 119.9L128.1 119.2L144.8 106.8L145.7 106.2L146.6 105.8L147.7 105.4L148.8 105.2L150 105.2L151.2 105.3L152.4 105.5L153.6 105.9L154.9 106.4L156.1 107.1L157.3 107.9L158.4 108.7L159.5 109.7L160.5 110.8L161.4 112L162.3 113.2L163 114.5L163.6 115.8L164.1 117.2L164.5 118.5L164.8 119.9L164.9 121.2L164.9 122.5L164.8 123.8L164.5 124.9L164.1 126L163.6 127L163 127.9L162.3 128.7L161.4 129.4L144.8 141.7L143.9 142.3L142.9 142.7L141.8 142.9L140.6 143L139.4 143L138.2 142.8L137 142.5L135.8 142.1L134.5 141.5L133.3 140.8L132.2 140L131 139L130 138L129 136.8L128.1 135.6L127.4 134.4L126.7 133.1L126.1 131.7L125.6 130.4L125.3 129L125.1 127.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M163 114.5L164.1 116.9L164.7 119.4L164.9 121.9L164.7 124.2L164.1 126.2L163 128L161.5 129.3L144.9 141.7L146.4 140.3L147.4 138.6L148.1 136.5L148.3 134.2L148.1 131.8L147.4 129.3L146.4 126.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M161.5 112.1L163 114.5L146.4 126.8L144.9 124.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M159.8 110L161.5 112.1L144.9 124.5L143.1 122.4ZM125.1 126.4L125.3 124.1L125.9 122L127 120.3L128.5 118.9L130.2 118L132.2 117.6L134.4 117.6L136.7 118.1L139 119.1L141.1 120.6L143.1 122.4L144.9 124.5L146.4 126.8L147.4 129.3L148.1 131.8L148.3 134.2L148.1 136.5L147.4 138.6L146.4 140.3L144.9 141.7L143.1 142.6L141.1 143L139 143L136.7 142.4L134.4 141.4L132.2 140L130.2 138.2L128.5 136.1L127 133.8L125.9 131.3L125.3 128.8L125.1 126.4L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3L136.7 130.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M155.6 106.8L157.8 108.2L159.8 110L143.1 122.4L141.1 120.6L139 119.1Z\"/><path class=\"iso-top\" d=\"M145.1 106.6L146.9 105.7L148.9 105.2L151.1 105.3L153.3 105.8L155.6 106.8L139 119.1L136.7 118.1L134.4 117.6L132.2 117.6L130.2 118L128.5 118.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M128.3 119L129.2 118.5L130.2 118L131.2 117.7L132.3 117.6L133.5 117.5L134.7 117.6L135.9 117.9L137.1 118.3L138.3 118.8L139.5 119.5L140.7 120.2L141.8 121.1L142.9 122.1L143.9 123.1L144.8 124.3L145.6 125.5L146.3 126.8L147 128.1L147.5 129.4L147.9 130.7L148.1 132.1L148.3 133.4L148.3 134.6L148.2 135.9L148 137L147.6 138.1L147.1 139.2L146.5 140.1L145.8 140.9L145 141.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M125.1 126.4L125.1 125.1L125.3 123.9L125.6 122.8L126.1 121.7L126.7 120.7L127.4 119.9L128.1 119.2L144.8 106.8L145.7 106.2L146.6 105.8L147.7 105.4L148.8 105.2L150 105.2L151.2 105.3L152.4 105.5L153.6 105.9L154.9 106.4L156.1 107.1L157.3 107.9L158.4 108.7L159.5 109.7L160.5 110.8L161.4 112L162.3 113.2L163 114.5L163.6 115.8L164.1 117.2L164.5 118.5L164.8 119.9L164.9 121.2L164.9 122.5L164.8 123.8L164.5 124.9L164.1 126L163.6 127L163 127.9L162.3 128.7L161.4 129.4L144.8 141.7L143.9 142.3L142.9 142.7L141.8 142.9L140.6 143L139.4 143L138.2 142.8L137 142.5L135.8 142.1L134.5 141.5L133.3 140.8L132.2 140L131 139L130 138L129 136.8L128.1 135.6L127.4 134.4L126.7 133.1L126.1 131.7L125.6 130.4L125.3 129L125.1 127.7Z\"/></g></g></g><g data-paint=\"shell\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M140.9 127.2L141.6 125.6L143.1 124.1L171.6 103L173.8 101.7L176.6 100.8L179.7 100.3L183.1 100.2L186.3 100.5L189.3 101.3L273.9 129.8L276.4 130.9L278.2 132.3L279.2 133.9L279.4 135.5L279.4 245.9L278.8 247.6L277.3 249.1L248.8 270.2L246.6 271.4L243.8 272.4L240.6 272.9L237.3 273L234.1 272.7L231.1 271.9L146.5 243.4L144 242.3L142.2 240.9L141.1 239.3L140.9 237.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M279.4 245.9L278.8 247.6L278.8 137.1L279.4 135.5ZM278.8 247.6L277.3 249.1L277.3 138.6L278.8 137.1ZM277.3 249.1L248.8 270.2L248.8 159.8L277.3 138.6ZM248.8 270.2L246.6 271.4L246.6 161L248.8 159.8ZM246.6 271.4L243.8 272.4L243.8 161.9L246.6 161Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M243.8 272.4L240.6 272.9L240.6 162.5L243.8 161.9ZM240.6 272.9L237.3 273L237.3 162.6L240.6 162.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M237.3 273L234.1 272.7L234.1 162.2L237.3 162.6ZM234.1 272.7L231.1 271.9L231.1 161.5L234.1 162.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M231.1 271.9L146.5 243.4L146.5 133L231.1 161.5ZM146.5 243.4L144 242.3L144 131.9L146.5 133ZM144 242.3L142.2 240.9L142.2 130.5L144 131.9ZM142.2 240.9L141.1 239.3L141.1 128.9L142.2 130.5ZM141.1 239.3L140.9 237.7L140.9 127.2L141.1 128.9Z\"/><path class=\"iso-top\" d=\"M273.9 129.8L276.4 130.9L278.2 132.3L279.2 133.9L279.4 135.5L278.8 137.1L277.3 138.6L248.8 159.8L246.6 161L243.8 161.9L240.6 162.5L237.3 162.6L234.1 162.2L231.1 161.5L146.5 133L144 131.9L142.2 130.5L141.1 128.9L140.9 127.2L141.6 125.6L143.1 124.1L171.6 103L173.8 101.7L176.6 100.8L179.7 100.3L183.1 100.2L186.3 100.5L189.3 101.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M279.4 135.5L278.8 137.1L277.3 138.6L248.8 159.8L246.6 161L243.8 161.9L240.6 162.5L237.3 162.6L234.1 162.2L231.1 161.5L146.5 133L144 131.9L142.2 130.5L141.1 128.9L140.9 127.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M279.4 135.5L276 136.7L274.7 137.9L246.4 158.9L244.6 159.9L242.5 160.6L240.1 161L237.5 161.1L235 160.8L232.6 160.2L148.3 131.8L146.3 130.9L144.9 129.8L144 128.6L140.9 127.2\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M279.4 231.2L278.8 232.8L277.3 234.3L248.8 255.5L246.6 256.7L243.8 257.6L240.6 258.2L237.3 258.3L234.1 257.9L231.1 257.2L146.5 228.7L144 227.6L142.2 226.2L141.1 224.6L140.9 222.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M140.9 127.2L141.6 125.6L143.1 124.1L171.6 103L173.8 101.7L176.6 100.8L179.7 100.3L183.1 100.2L186.3 100.5L189.3 101.3L273.9 129.8L276.4 130.9L278.2 132.3L279.2 133.9L279.4 135.5M279.4 245.9L278.8 247.6L277.3 249.1L248.8 270.2L246.6 271.4L243.8 272.4L240.6 272.9L237.3 273L234.1 272.7L231.1 271.9L146.5 243.4L144 242.3L142.2 240.9L141.1 239.3L140.9 237.7M279.4 135.5L279.4 245.9M140.9 127.2L140.9 237.7\"/></g></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M273.7 181.8L252.3 197.6\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M273.7 174.4L252.3 190.3\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M273.7 167L252.3 182.9\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M273.7 159.7L252.3 175.5\"/><g data-hit=\"screen\" data-sel=\"screen\"><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M143.1 145L143.4 144.4L144.4 144L145.5 143.9L146.7 144.1L230.9 172.5L231.7 172.9L231.9 173.5L231.9 247.1L231.5 247.7L230.6 248.1L229.4 248.2L228.3 248L144.1 219.6L143.3 219.2L143.1 218.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M231.9 247.1L231.5 247.7L231.5 174.1L231.9 173.5ZM231.5 247.7L230.6 248.1L230.6 174.5L231.5 174.1ZM143.4 144.4L143.4 144.4L143.4 218L143.4 218Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M230.6 248.1L229.4 248.2L229.4 174.6L230.6 174.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M229.4 248.2L228.3 248L228.3 174.4L229.4 174.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M228.3 248L144.1 219.6L144.1 146L228.3 174.4ZM144.1 219.6L143.3 219.2L143.3 145.6L144.1 146ZM143.3 219.2L143.1 218.6L143.1 145L143.3 145.6Z\"/><path class=\"iso-top\" d=\"M230.9 172.5L231.7 172.9L231.9 173.5L231.5 174.1L231.5 174.1L230.6 174.5L229.4 174.6L228.3 174.4L144.1 146L143.3 145.6L143.1 145L143.4 144.4L143.4 144.4L144.4 144L145.5 143.9L146.7 144.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M231.9 173.5L231.5 174.1M231.5 174.1L230.6 174.5L229.4 174.6L228.3 174.4L144.1 146L143.3 145.6L143.1 145M143.4 144.4L143.4 144.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M231.9 173.5L231.5 174.1M231.5 174.1L230.2 174.1L229.5 174.2L228.7 174L144.6 145.7L144 145.4L143.1 145M143.4 144.4L143.4 144.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M231.5 174.1L231.5 174.1M143.1 145L143.4 144.4M143.4 144.4L144.4 144L145.5 143.9L146.7 144.1L230.9 172.5L231.7 172.9L231.9 173.5M231.9 247.1L231.5 247.7M231.5 247.7L230.6 248.1L229.4 248.2L228.3 248L144.1 219.6L143.3 219.2L143.1 218.6M143.4 218L143.4 218M231.9 173.5L231.9 247.1M231.5 174.1L231.5 247.7M231.5 174.1L231.5 247.7M143.1 145L143.1 218.6M143.4 144.4L143.4 218M143.4 144.4L143.4 218\"/></g></g><g class=\"rb-screen\"><g data-paint=\"screen\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M147.7 154.4L147.8 154.2L148.2 154.1L148.6 154.1L149 154.1L223.4 179.2L223.6 179.4L223.7 179.6L223.7 240.3L223.6 240.5L223.3 240.7L222.8 240.7L222.4 240.6L148.1 215.6L147.8 215.4L147.7 215.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M223.7 240.3L223.6 240.5L223.6 179.8L223.7 179.6ZM223.6 240.5L223.6 240.5L223.6 179.8L223.6 179.8ZM223.6 240.5L223.3 240.7L223.3 179.9L223.6 179.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M223.3 240.7L222.8 240.7L222.8 180L223.3 179.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M222.8 240.7L222.4 240.6L222.4 179.9L222.8 180Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M222.4 240.6L148.1 215.6L148.1 154.8L222.4 179.9ZM148.1 215.6L147.8 215.4L147.8 154.7L148.1 154.8ZM147.8 215.4L147.7 215.2L147.7 154.4L147.8 154.7Z\"/><path class=\"iso-top\" d=\"M223.4 179.2L223.6 179.4L223.7 179.6L223.6 179.8L223.6 179.8L223.3 179.9L222.8 180L222.4 179.9L148.1 154.8L147.8 154.7L147.7 154.4L147.8 154.2L147.8 154.2L148.2 154.1L148.6 154.1L149 154.1Z\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M147.7 154.4L147.8 154.2L147.8 154.2L148.2 154.1L148.6 154.1L149 154.1L223.4 179.2L223.6 179.4L223.7 179.6M223.7 240.3L223.6 240.5L223.6 240.5L223.3 240.7L222.8 240.7L222.4 240.6L148.1 215.6L147.8 215.4L147.7 215.2M223.7 179.6L223.7 240.3M147.7 154.4L147.7 215.2\"/></g></g></g><text dy=\"1.77\" data-t=\"scr1\" data-fit=\"38\" data-cls=\"scr1\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.762 0.594 0 1.84 185.232 179.328)\" font-size=\"5.2\" text-anchor=\"middle\"></text><text dy=\"1.29\" data-t=\"scr2\" data-fit=\"38\" data-cls=\"scr2\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.762 0.594 0 1.84 185.232 196.811)\" font-size=\"3.8\" text-anchor=\"middle\"></text><g class=\"rb-ans\"><g data-paint=\"ans1\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M155 200.8L155 200.7L155.3 200.6L155.6 200.6L181.4 209.3L181.5 209.4L181.5 220.5L181.5 220.6L181.2 220.7L180.9 220.7L155.2 212L155 211.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M181.5 220.5L181.5 220.6L181.5 209.6L181.5 209.4ZM181.5 220.6L181.2 220.7L181.2 209.7L181.5 209.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M181.2 220.7L180.9 220.7L180.9 209.7L181.2 209.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M180.9 220.7L155.2 212L155.2 201L180.9 209.7ZM155.2 212L155 211.9L155 200.8L155.2 201Z\"/><path class=\"iso-top\" d=\"M181.4 209.3L181.5 209.4L181.5 209.6L181.5 209.6L181.2 209.7L180.9 209.7L155.2 201L155 200.8L155 200.7L155 200.7L155.3 200.6L155.6 200.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M181.5 209.6L181.5 209.6M155 200.8L155 200.7L155 200.7L155.3 200.6L155.6 200.6L181.4 209.3L181.5 209.4M181.5 220.5L181.5 220.6M181.5 220.6L181.2 220.7L180.9 220.7L155.2 212L155 211.9M181.5 209.4L181.5 220.5M181.5 209.6L181.5 220.6M181.5 209.6L181.5 220.6M155 200.8L155 211.9\"/></g></g><g data-paint=\"ans2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M188.5 212.1L188.5 212L188.8 211.9L189.1 211.9L214.8 220.6L215 220.7L215 231.8L214.9 231.9L214.7 232L214.4 232L188.6 223.3L188.5 223.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M215 231.8L214.9 231.9L214.9 220.9L215 220.7ZM214.9 231.9L214.7 232L214.7 221L214.9 220.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M214.7 232L214.4 232L214.4 220.9L214.7 221Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M214.4 232L188.6 223.3L188.6 212.3L214.4 220.9ZM188.6 223.3L188.5 223.2L188.5 212.1L188.6 212.3Z\"/><path class=\"iso-top\" d=\"M214.8 220.6L215 220.7L214.9 220.9L214.9 220.9L214.7 221L214.4 220.9L188.6 212.3L188.5 212.1L188.5 212L188.5 212L188.8 211.9L189.1 211.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M214.9 220.9L214.9 220.9M188.5 212.1L188.5 212L188.5 212L188.8 211.9L189.1 211.9L214.8 220.6L215 220.7M215 231.8L214.9 231.9M214.9 231.9L214.7 232L214.4 232L188.6 223.3L188.5 223.2M215 220.7L215 231.8M214.9 220.9L214.9 231.9M214.9 220.9L214.9 231.9M188.5 212.1L188.5 223.2\"/></g></g></g><text dy=\"1.16\" data-cls=\"ans\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.762 0.594 0 1.84 168.02 210.842)\" font-size=\"3.4\" text-anchor=\"middle\">A</text><text dy=\"1.16\" data-cls=\"ans\" class=\"iso-face-text\" data-tone=\"hi\" transform=\"matrix(1.762 0.594 0 1.84 201.493 222.131)\" font-size=\"3.4\" text-anchor=\"middle\">B</text><g class=\"rb-caret\"><path class=\"iso-line\" data-tone=\"hi\" d=\"M214.3 210.3L214.3 202\"/></g></g><g data-paint=\"btn1\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M162.6 232.3L162.9 231.8L163.8 231.5L164.9 231.4L165.9 231.5L174.7 234.5L175.4 234.9L175.6 235.5L175.6 245.6L175.3 246.1L174.4 246.5L173.4 246.6L172.3 246.4L163.5 243.4L162.8 243L162.6 242.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M175.6 245.6L175.3 246.1L175.3 236L175.6 235.5ZM175.3 246.1L174.4 246.5L174.4 236.3L175.3 236Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M174.4 246.5L173.4 246.6L173.4 236.4L174.4 236.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M173.4 246.6L172.3 246.4L172.3 236.3L173.4 236.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M172.3 246.4L163.5 243.4L163.5 233.3L172.3 236.3ZM163.5 243.4L162.8 243L162.8 232.9L163.5 233.3ZM162.8 243L162.6 242.5L162.6 232.3L162.8 232.9Z\"/><path class=\"iso-top\" d=\"M174.7 234.5L175.4 234.9L175.6 235.5L175.3 236L175.3 236L174.4 236.3L173.4 236.4L172.3 236.3L163.5 233.3L162.8 232.9L162.6 232.3L162.9 231.8L162.9 231.8L163.8 231.5L164.9 231.4L165.9 231.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M175.6 235.5L175.3 236M175.3 236L174.4 236.3L173.4 236.4L172.3 236.3L163.5 233.3L162.8 232.9L162.6 232.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M175.6 235.5L175.3 236M175.3 236L174.2 236.1L173.4 236.1L172.6 236L163.9 233.1L163.4 232.7L162.6 232.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M175.3 236L175.3 236M162.6 232.3L162.9 231.8L162.9 231.8L163.8 231.5L164.9 231.4L165.9 231.5L174.7 234.5L175.4 234.9L175.6 235.5M175.6 245.6L175.3 246.1M175.3 246.1L174.4 246.5L173.4 246.6L172.3 246.4L163.5 243.4L162.8 243L162.6 242.5M175.6 235.5L175.6 245.6M175.3 236L175.3 246.1M175.3 236L175.3 246.1M162.6 232.3L162.6 242.5\"/></g></g><g data-paint=\"btn2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M180.2 238.3L180.6 237.8L181.4 237.4L182.5 237.3L183.5 237.5L192.3 240.4L193 240.9L193.3 241.4L193.3 251.5L192.9 252L192.1 252.4L191 252.5L189.9 252.3L181.1 249.4L180.4 248.9L180.2 248.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M193.3 251.5L192.9 252L192.9 241.9L193.3 241.4ZM192.9 252L192.1 252.4L192.1 242.3L192.9 241.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M192.1 252.4L191 252.5L191 242.4L192.1 242.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M191 252.5L189.9 252.3L189.9 242.2L191 242.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M189.9 252.3L181.1 249.4L181.1 239.2L189.9 242.2ZM181.1 249.4L180.4 248.9L180.4 238.8L181.1 239.2ZM180.4 248.9L180.2 248.4L180.2 238.3L180.4 238.8Z\"/><path class=\"iso-top\" d=\"M192.3 240.4L193 240.9L193.3 241.4L192.9 241.9L192.9 241.9L192.1 242.3L191 242.4L189.9 242.2L181.1 239.2L180.4 238.8L180.2 238.3L180.6 237.8L180.6 237.8L181.4 237.4L182.5 237.3L183.5 237.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M193.3 241.4L192.9 241.9M192.9 241.9L192.1 242.3L191 242.4L189.9 242.2L181.1 239.2L180.4 238.8L180.2 238.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M193.3 241.4L192.9 241.9M192.9 241.9L191.8 242L191 242.1L190.2 241.9L181.6 239L181 238.7L180.2 238.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M192.9 241.9L192.9 241.9M180.2 238.3L180.6 237.8L180.6 237.8L181.4 237.4L182.5 237.3L183.5 237.5L192.3 240.4L193 240.9L193.3 241.4M193.3 251.5L192.9 252M192.9 252L192.1 252.4L191 252.5L189.9 252.3L181.1 249.4L180.4 248.9L180.2 248.4M193.3 241.4L193.3 251.5M192.9 241.9L192.9 252M192.9 241.9L192.9 252M180.2 238.3L180.2 248.4\"/></g></g><g data-paint=\"btn3\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M197.8 244.2L198.2 243.7L199 243.3L200.1 243.2L201.1 243.4L209.9 246.4L210.7 246.8L210.9 247.3L210.9 257.5L210.5 258L209.7 258.3L208.6 258.4L207.6 258.3L198.8 255.3L198 254.9L197.8 254.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M210.9 257.5L210.5 258L210.5 247.9L210.9 247.3ZM210.5 258L209.7 258.3L209.7 248.2L210.5 247.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M209.7 258.3L208.6 258.4L208.6 248.3L209.7 248.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M208.6 258.4L207.6 258.3L207.6 248.1L208.6 248.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M207.6 258.3L198.8 255.3L198.8 245.2L207.6 248.1ZM198.8 255.3L198 254.9L198 244.8L198.8 245.2ZM198 254.9L197.8 254.3L197.8 244.2L198 244.8Z\"/><path class=\"iso-top\" d=\"M209.9 246.4L210.7 246.8L210.9 247.3L210.5 247.9L210.5 247.9L209.7 248.2L208.6 248.3L207.6 248.1L198.8 245.2L198 244.8L197.8 244.2L198.2 243.7L198.2 243.7L199 243.3L200.1 243.2L201.1 243.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M210.9 247.3L210.5 247.9M210.5 247.9L209.7 248.2L208.6 248.3L207.6 248.1L198.8 245.2L198 244.8L197.8 244.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M210.9 247.3L210.5 247.9M210.5 247.9L209.4 247.9L208.6 248L207.8 247.9L199.2 244.9L198.6 244.6L197.8 244.2\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M210.5 247.9L210.5 247.9M197.8 244.2L198.2 243.7L198.2 243.7L199 243.3L200.1 243.2L201.1 243.4L209.9 246.4L210.7 246.8L210.9 247.3M210.9 257.5L210.5 258M210.5 258L209.7 258.3L208.6 258.4L207.6 258.3L198.8 255.3L198 254.9L197.8 254.3M210.9 247.3L210.9 257.5M210.5 247.9L210.5 258M210.5 247.9L210.5 258M197.8 244.2L197.8 254.3\"/></g></g><g class=\"rb-arm-r\"><g class=\"rb-af rb-af-0\"><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M260.6 232L261 230.4L262.4 228.9L267.2 225.3L269.4 224.1L272.4 223.3L275.6 223L278.9 223.2L281.9 223.9L285.5 225.1L287.9 226.2L289.5 227.7L290.1 229.3L290.1 251.4L289.7 253L288.3 254.5L283.6 258.1L281.3 259.3L278.4 260.1L275.1 260.4L271.8 260.2L268.8 259.5L265.3 258.3L262.9 257.2L261.2 255.7L260.6 254.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M283.6 236L281.3 237.2L281.3 259.3L283.6 258.1ZM281.3 237.2L278.4 238L278.4 260.1L281.3 259.3ZM278.4 238L275.1 238.3L275.1 260.4L278.4 260.1ZM290.1 229.3L289.7 231L289.7 253L290.1 251.4ZM289.7 231L288.3 232.5L288.3 254.5L289.7 253ZM288.3 232.5L283.6 236L283.6 258.1L288.3 254.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M275.1 238.3L271.8 238.1L271.8 260.2L275.1 260.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M271.8 238.1L268.8 237.4L268.8 259.5L271.8 260.2ZM268.8 237.4L265.3 236.2L265.3 258.3L268.8 259.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M265.3 236.2L262.9 235.1L262.9 257.2L265.3 258.3ZM262.9 235.1L261.2 233.6L261.2 255.7L262.9 257.2Z\"/><path class=\"iso-top\" d=\"M261.2 233.6L260.6 232L260.6 254.1L261.2 255.7ZM283.6 236L281.3 237.2L278.4 238L275.1 238.3L271.8 238.1L268.8 237.4L265.3 236.2L262.9 235.1L261.2 233.6L260.6 232L261 230.4L262.4 228.9L267.2 225.3L269.4 224.1L272.4 223.3L275.6 223L278.9 223.2L281.9 223.9L285.5 225.1L287.9 226.2L289.5 227.7L290.1 229.3L289.7 231L288.3 232.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M283.6 236L281.3 237.2M281.3 237.2L278.4 238M278.4 238L275.1 238.3M275.1 238.3L271.8 238.1M271.8 238.1L268.8 237.4M268.8 237.4L265.3 236.2M265.3 236.2L262.9 235.1M262.9 235.1L261.2 233.6M261.2 233.6L260.6 232M290.1 229.3L289.7 231M289.7 231L288.3 232.5M288.3 232.5L283.6 236\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M260.6 232L261 230.4L262.4 228.9L267.2 225.3L269.4 224.1L272.4 223.3L275.6 223L278.9 223.2L281.9 223.9L285.5 225.1L287.9 226.2L289.5 227.7L290.1 229.3L290.1 251.4L289.7 253L288.3 254.5L283.6 258.1L281.3 259.3L278.4 260.1L275.1 260.4L271.8 260.2L268.8 259.5L265.3 258.3L262.9 257.2L261.2 255.7L260.6 254.1Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M263.9 223.2L264 222.5L264.3 221.8L264.8 221.1L265.5 220.4L266.3 219.8L267.3 219.2L268.4 218.8L269.6 218.3L270.9 218L272.3 217.8L273.7 217.6L275.2 217.6L276.7 217.6L278.1 217.7L279.5 217.9L280.8 218.3L282.1 218.6L283.2 219.1L284.2 219.7L285.1 220.2L285.8 220.9L286.3 221.6L286.7 222.3L286.8 223L286.8 230.4L286.8 231.1L286.6 231.9L286.2 232.6L285.6 233.2L284.9 233.9L284 234.5L282.9 235L281.8 235.4L280.5 235.8L279.2 236.1L277.7 236.3L276.3 236.4L274.8 236.4L273.4 236.3L271.9 236.1L270.6 235.9L269.3 235.5L268.1 235.1L267 234.6L266.1 234L265.3 233.4L264.7 232.7L264.2 232L264 231.3L263.9 230.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M286.8 230.7L286.6 231.8L286 232.9L284.9 233.9L283.4 234.7L281.7 235.4L279.7 236L277.6 236.3L275.3 236.4L275.3 229L277.6 228.9L279.7 228.6L281.7 228.1L283.4 227.4L284.9 226.5L286 225.5L286.6 224.4L286.8 223.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M275.3 236.4L273.1 236.3L270.9 236L270.9 228.6L273.1 228.9L275.3 229Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M270.9 236L269 235.4L267.2 234.7L267.2 227.3L269 228.1L270.9 228.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M267.2 234.7L265.8 233.8L264.8 232.8L264.1 231.8L264.1 224.4L264.8 225.5L265.8 226.5L267.2 227.3Z\"/><path class=\"iso-top\" d=\"M284.9 226.5L283.4 227.4L281.7 228.1L279.7 228.6L277.6 228.9L275.3 229L273.1 228.9L270.9 228.6L269 228.1L267.2 227.3L265.8 226.5L264.8 225.5L264.1 224.4L263.9 223.3L264.1 222.2L264.8 221.1L265.9 220.1L267.3 219.2L269 218.5L271 218L273.2 217.7L275.4 217.6L277.7 217.7L279.8 218L281.8 218.5L283.5 219.3L284.9 220.1L286 221.1L286.6 222.2L286.8 223.3L286.6 224.4L286 225.5L284.9 226.5L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3L275.4 223.3ZM264.1 231.8L263.9 230.6L263.9 223.3L264.1 224.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M286.8 223.3L286.8 224L286.5 224.7L286 225.4L285.4 226.1L284.7 226.7L283.7 227.2L282.7 227.7L281.5 228.1L280.3 228.5L278.9 228.8L277.5 228.9L276.1 229L274.7 229L273.2 228.9L271.8 228.8L270.5 228.5L269.2 228.1L268.1 227.7L267 227.2L266.1 226.7L265.3 226.1L264.7 225.4L264.3 224.7L264 224L263.9 223.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M263.9 223.2L264 222.5L264.3 221.8L264.8 221.1L265.5 220.4L266.3 219.8L267.3 219.2L268.4 218.8L269.6 218.3L270.9 218L272.3 217.8L273.7 217.6L275.2 217.6L276.7 217.6L278.1 217.7L279.5 217.9L280.8 218.3L282.1 218.6L283.2 219.1L284.2 219.7L285.1 220.2L285.8 220.9L286.3 221.6L286.7 222.3L286.8 223L286.8 230.4L286.8 231.1L286.6 231.9L286.2 232.6L285.6 233.2L284.9 233.9L284 234.5L282.9 235L281.8 235.4L280.5 235.8L279.2 236.1L277.7 236.3L276.3 236.4L274.8 236.4L273.4 236.3L271.9 236.1L270.6 235.9L269.3 235.5L268.1 235.1L267 234.6L266.1 234L265.3 233.4L264.7 232.7L264.2 232L264 231.3L263.9 230.6Z\"/></g></g><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M261.9 177L262.2 176L263 175.1L270.1 169.8L271.5 169.1L273.2 168.6L275.2 168.4L277.2 168.6L279 169L286 171.4L287.5 172L288.4 172.9L288.8 173.9L288.8 225.4L288.6 226.4L287.7 227.3L280.6 232.6L279.3 233.3L277.5 233.8L275.6 234L273.6 233.9L271.8 233.5L264.7 231.1L263.3 230.4L262.3 229.5L261.9 228.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M280.6 181.1L279.3 181.8L279.3 233.3L280.6 232.6ZM279.3 181.8L277.5 182.3L277.5 233.8L279.3 233.3ZM277.5 182.3L275.6 182.5L275.6 234L277.5 233.8ZM288.8 173.9L288.6 174.9L288.6 226.4L288.8 225.4ZM288.6 174.9L287.7 175.8L287.7 227.3L288.6 226.4ZM287.7 175.8L280.6 181.1L280.6 232.6L287.7 227.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M275.6 182.5L273.6 182.3L273.6 233.9L275.6 234Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M273.6 182.3L271.8 181.9L271.8 233.5L273.6 233.9ZM271.8 181.9L264.7 179.5L264.7 231.1L271.8 233.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M264.7 179.5L263.3 178.9L263.3 230.4L264.7 231.1ZM263.3 178.9L262.3 178L262.3 229.5L263.3 230.4Z\"/><path class=\"iso-top\" d=\"M262.3 178L261.9 177L261.9 228.5L262.3 229.5ZM280.6 181.1L279.3 181.8L277.5 182.3L275.6 182.5L273.6 182.3L271.8 181.9L264.7 179.5L263.3 178.9L262.3 178L261.9 177L262.2 176L263 175.1L270.1 169.8L271.5 169.1L273.2 168.6L275.2 168.4L277.2 168.6L279 169L286 171.4L287.5 172L288.4 172.9L288.8 173.9L288.6 174.9L287.7 175.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M280.6 181.1L279.3 181.8M279.3 181.8L277.5 182.3M277.5 182.3L275.6 182.5M275.6 182.5L273.6 182.3M273.6 182.3L271.8 181.9M271.8 181.9L264.7 179.5M264.7 179.5L263.3 178.9M263.3 178.9L262.3 178M262.3 178L261.9 177M288.8 173.9L288.6 174.9M288.6 174.9L287.7 175.8M287.7 175.8L280.6 181.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M261.9 177L262.2 176L263 175.1L270.1 169.8L271.5 169.1L273.2 168.6L275.2 168.4L277.2 168.6L279 169L286 171.4L287.5 172L288.4 172.9L288.8 173.9L288.8 225.4L288.6 226.4L287.7 227.3L280.6 232.6L279.3 233.3L277.5 233.8L275.6 234L273.6 233.9L271.8 233.5L264.7 231.1L263.3 230.4L262.3 229.5L261.9 228.5Z\"/></g></g></g><g class=\"rb-af rb-af-1\"><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M291.8 238.8L292.3 237.8L293.8 236.6L298.5 233.1L300.8 231.6L303.5 230.1L306.5 228.7L309.5 227.5L312.1 226.6L315.2 225.8L317.2 225.4L318.5 225.5L318.9 226L329.5 248.7L328.9 249.6L327.4 250.9L322.7 254.4L320.5 255.9L317.7 257.4L314.7 258.8L311.7 260L309.1 260.8L306 261.6L304 262.1L302.7 262L302.3 261.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M312.1 231.7L309.9 233.2L320.5 255.9L322.7 254.4ZM318.9 226L318.3 226.9L328.9 249.6L329.5 248.7ZM318.3 226.9L316.9 228.2L327.4 250.9L328.9 249.6ZM316.9 228.2L312.1 231.7L322.7 254.4L327.4 250.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M309.9 233.2L307.1 234.7L317.7 257.4L320.5 255.9ZM307.1 234.7L304.1 236.1L314.7 258.8L317.7 257.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M304.1 236.1L301.2 237.3L311.7 260L314.7 258.8ZM301.2 237.3L298.5 238.1L309.1 260.8L311.7 260ZM298.5 238.1L295.5 239L306 261.6L309.1 260.8ZM295.5 239L293.4 239.4L304 262.1L306 261.6ZM293.4 239.4L292.1 239.3L302.7 262L304 262.1ZM292.1 239.3L291.8 238.8L302.3 261.5L302.7 262Z\"/><path class=\"iso-top\" d=\"M312.1 231.7L309.9 233.2L307.1 234.7L304.1 236.1L301.2 237.3L298.5 238.1L295.5 239L293.4 239.4L292.1 239.3L291.8 238.8L292.3 237.8L293.8 236.6L298.5 233.1L300.8 231.6L303.5 230.1L306.5 228.7L309.5 227.5L312.1 226.6L315.2 225.8L317.2 225.4L318.5 225.5L318.9 226L318.3 226.9L316.9 228.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M312.1 231.7L309.9 233.2M309.9 233.2L307.1 234.7M307.1 234.7L304.1 236.1M304.1 236.1L301.2 237.3M301.2 237.3L298.5 238.1M298.5 238.1L295.5 239M295.5 239L293.4 239.4M293.4 239.4L292.1 239.3M292.1 239.3L291.8 238.8M318.9 226L318.3 226.9M318.3 226.9L316.9 228.2M316.9 228.2L312.1 231.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M291.8 238.8L292.3 237.8L293.8 236.6L298.5 233.1L300.8 231.6L303.5 230.1L306.5 228.7L309.5 227.5L312.1 226.6L315.2 225.8L317.2 225.4L318.5 225.5L318.9 226L329.5 248.7L328.9 249.6L327.4 250.9L322.7 254.4L320.5 255.9L317.7 257.4L314.7 258.8L311.7 260L309.1 260.8L306 261.6L304 262.1L302.7 262L302.3 261.5Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M291.4 229.6L291.4 229.2L291.6 228.9L292 228.4L292.5 227.9L293.2 227.3L294 226.7L294.9 226.1L296 225.4L297.2 224.7L298.4 224.1L299.7 223.4L301 222.8L302.3 222.2L303.7 221.6L305 221.1L306.2 220.7L307.4 220.3L308.5 220L309.4 219.8L310.3 219.6L311 219.6L311.6 219.6L312 219.7L312.2 219.9L315.7 227.5L315.8 227.8L315.6 228.1L315.4 228.6L314.9 229.1L314.3 229.6L313.6 230.2L312.7 230.8L311.7 231.5L310.5 232.1L309.4 232.8L308.1 233.5L306.8 234.1L305.4 234.7L304.1 235.3L302.8 235.8L301.5 236.3L300.3 236.7L299.2 237.1L298.1 237.3L297.2 237.5L296.5 237.6L295.8 237.6L295.3 237.5L295 237.4L294.9 237.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M315.7 227.5L315.7 227.9L315.4 228.5L314.7 229.3L313.6 230.2L312.1 231.2L308.6 223.6L310 222.6L311.1 221.7L311.9 221L312.2 220.4L312.2 219.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M312.1 231.2L310.5 232.2L308.6 233.2L306.6 234.2L303.1 226.6L305.1 225.6L307 224.6L308.6 223.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M306.6 234.2L304.6 235.1L302.5 235.9L300.6 236.6L298.9 237.1L297.4 237.5L296.2 237.6L295.4 237.6L295 237.3L291.4 229.7L291.9 230L292.7 230L293.9 229.9L295.4 229.6L297.1 229.1L299 228.4L301 227.6L303.1 226.6Z\"/><path class=\"iso-top\" d=\"M310 222.6L308.6 223.6L307 224.6L305.1 225.6L303.1 226.6L301 227.6L299 228.4L297.1 229.1L295.4 229.6L293.9 229.9L292.7 230L291.9 230L291.4 229.7L291.4 229.3L291.7 228.7L292.5 227.9L293.6 227L295 226L296.6 225L298.5 224L300.5 223L302.6 222.1L304.6 221.3L306.5 220.6L308.2 220.1L309.7 219.7L310.9 219.6L311.7 219.6L312.2 219.9L312.2 220.4L311.9 221L311.1 221.7L310 222.6L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8L301.8 224.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M312.2 220L312.2 220.3L312.1 220.6L311.8 221L311.4 221.5L310.8 222.1L310 222.6L309.1 223.3L308.2 223.9L307.1 224.5L305.9 225.2L304.7 225.9L303.4 226.5L302.1 227.1L300.8 227.7L299.5 228.2L298.2 228.7L297 229.1L295.9 229.4L294.8 229.7L293.9 229.9L293.1 230L292.5 230.1L292 230L291.6 229.9L291.4 229.7\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M291.4 229.6L291.4 229.2L291.6 228.9L292 228.4L292.5 227.9L293.2 227.3L294 226.7L294.9 226.1L296 225.4L297.2 224.7L298.4 224.1L299.7 223.4L301 222.8L302.3 222.2L303.7 221.6L305 221.1L306.2 220.7L307.4 220.3L308.5 220L309.4 219.8L310.3 219.6L311 219.6L311.6 219.6L312 219.7L312.2 219.9L315.7 227.5L315.8 227.8L315.6 228.1L315.4 228.6L314.9 229.1L314.3 229.6L313.6 230.2L312.7 230.8L311.7 231.5L310.5 232.1L309.4 232.8L308.1 233.5L306.8 234.1L305.4 234.7L304.1 235.3L302.8 235.8L301.5 236.3L300.3 236.7L299.2 237.1L298.1 237.3L297.2 237.5L296.5 237.6L295.8 237.6L295.3 237.5L295 237.4L294.9 237.1Z\"/></g></g><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M266.5 181.6L266.8 181.1L267.7 180.3L274.8 175L276.2 174.2L277.8 173.3L279.6 172.4L281.4 171.7L283 171.2L289.1 169.6L290.3 169.3L291.1 169.3L291.3 169.7L316 222.6L315.6 223.2L314.8 223.9L307.6 229.2L306.3 230.1L304.7 231L302.9 231.9L301.1 232.6L299.5 233.1L293.4 234.7L292.1 234.9L291.4 234.9L291.1 234.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M283 176.3L281.6 177.1L306.3 230.1L307.6 229.2ZM291.3 169.7L291 170.2L315.6 223.2L316 222.6ZM291 170.2L290.1 171L314.8 223.9L315.6 223.2ZM290.1 171L283 176.3L307.6 229.2L314.8 223.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M281.6 177.1L280 178.1L304.7 231L306.3 230.1ZM280 178.1L278.2 178.9L302.9 231.9L304.7 231Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M278.2 178.9L276.4 179.6L301.1 232.6L302.9 231.9ZM276.4 179.6L274.8 180.1L299.5 233.1L301.1 232.6ZM274.8 180.1L268.7 181.8L293.4 234.7L299.5 233.1ZM268.7 181.8L267.5 182L292.1 234.9L293.4 234.7ZM267.5 182L266.7 182L291.4 234.9L292.1 234.9ZM266.7 182L266.5 181.6L291.1 234.6L291.4 234.9Z\"/><path class=\"iso-top\" d=\"M283 176.3L281.6 177.1L280 178.1L278.2 178.9L276.4 179.6L274.8 180.1L268.7 181.8L267.5 182L266.7 182L266.5 181.6L266.8 181.1L267.7 180.3L274.8 175L276.2 174.2L277.8 173.3L279.6 172.4L281.4 171.7L283 171.2L289.1 169.6L290.3 169.3L291.1 169.3L291.3 169.7L291 170.2L290.1 171Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M283 176.3L281.6 177.1M281.6 177.1L280 178.1M280 178.1L278.2 178.9M278.2 178.9L276.4 179.6M276.4 179.6L274.8 180.1M274.8 180.1L268.7 181.8M268.7 181.8L267.5 182M267.5 182L266.7 182M266.7 182L266.5 181.6M291.3 169.7L291 170.2M291 170.2L290.1 171M290.1 171L283 176.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M266.5 181.6L266.8 181.1L267.7 180.3L274.8 175L276.2 174.2L277.8 173.3L279.6 172.4L281.4 171.7L283 171.2L289.1 169.6L290.3 169.3L291.1 169.3L291.3 169.7L316 222.6L315.6 223.2L314.8 223.9L307.6 229.2L306.3 230.1L304.7 231L302.9 231.9L301.1 232.6L299.5 233.1L293.4 234.7L292.1 234.9L291.4 234.9L291.1 234.6Z\"/></g></g></g><g class=\"rb-af rb-af-2\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M271.7 183.5L271.9 182.8L272.6 181.7L276.1 176.5L277.1 175.2L278.3 173.7L279.7 172.3L281.1 171L282.3 170L289.4 164.7L290.4 164.1L291 163.9L333.8 204.1L334 204.3L333.7 205.1L333.1 206.1L329.6 211.3L328.6 212.6L327.3 214.1L326 215.5L324.6 216.8L323.4 217.8L316.2 223.1L315.3 223.8L314.6 223.9L271.9 183.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M271.7 183.5L271.9 183.8L314.6 223.9L314.4 223.7ZM325 210.2L323.8 211.2L322.4 212.5L321.1 213.9L319.8 215.4L318.8 216.7L315.3 221.9L314.7 223L314.4 223.7L314.6 223.9L315.3 223.8L316.2 223.1L323.4 217.8L324.6 216.8L326 215.5L327.3 214.1L328.6 212.6L329.6 211.3L333.1 206.1L333.7 205.1L334 204.3L333.8 204.1L333.1 204.2L332.2 204.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M271.9 182.8L271.7 183.5L314.4 223.7L314.7 223ZM291 163.9L290.4 164.1L333.1 204.2L333.8 204.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M277.1 175.2L276.1 176.5L318.8 216.7L319.8 215.4ZM276.1 176.5L272.6 181.7L315.3 221.9L318.8 216.7ZM272.6 181.7L271.9 182.8L314.7 223L315.3 221.9ZM290.4 164.1L289.4 164.7L332.2 204.9L333.1 204.2ZM289.4 164.7L282.3 170L325 210.2L332.2 204.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M282.3 170L281.1 171L323.8 211.2L325 210.2ZM281.1 171L279.7 172.3L322.4 212.5L323.8 211.2ZM279.7 172.3L278.3 173.7L321.1 213.9L322.4 212.5ZM278.3 173.7L277.1 175.2L319.8 215.4L321.1 213.9Z\"/><path class=\"iso-top\" d=\"\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M325 210.2L323.8 211.2M323.8 211.2L322.4 212.5M322.4 212.5L321.1 213.9M321.1 213.9L319.8 215.4M319.8 215.4L318.8 216.7M318.8 216.7L315.3 221.9M315.3 221.9L314.7 223M314.7 223L314.4 223.7M314.4 223.7L314.6 223.9M333.8 204.1L333.1 204.2M333.1 204.2L332.2 204.9M332.2 204.9L325 210.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M271.7 183.5L271.9 182.8L272.6 181.7L276.1 176.5L277.1 175.2L278.3 173.7L279.7 172.3L281.1 171L282.3 170L289.4 164.7L290.4 164.1L291 163.9L333.8 204.1L334 204.3L333.7 205.1L333.1 206.1L329.6 211.3L328.6 212.6L327.3 214.1L326 215.5L324.6 216.8L323.4 217.8L316.2 223.1L315.3 223.8L314.6 223.9L271.9 183.8Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M313.2 219L313.3 218.6L313.5 218L313.8 217.3L314.3 216.5L314.9 215.7L315.6 214.7L316.3 213.7L317.2 212.6L318.1 211.6L319.1 210.5L320.1 209.4L321.1 208.4L322.1 207.4L323.1 206.4L324.1 205.6L325 204.8L325.9 204.1L326.7 203.6L327.4 203.2L328 202.9L328.4 202.7L328.8 202.7L329 202.8L335.1 208.5L335.2 208.8L335.2 209.2L335 209.7L334.8 210.3L334.3 211.1L333.8 211.9L333.2 212.8L332.4 213.8L331.6 214.8L330.7 215.9L329.8 217L328.8 218.1L327.8 219.1L326.8 220.1L325.7 221.1L324.8 222L323.8 222.8L322.9 223.6L322.1 224.2L321.3 224.7L320.7 225L320.2 225.2L319.8 225.3L319.5 225.3L313.4 219.5L313.2 219.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L327.2 216.9L332 209.9L333.2 209.1L334.1 208.6L334.8 208.4L335.1 208.6L335.2 209L335 209.8L334.5 210.8L333.7 212.1L332.6 213.6L331.4 215.2L329.9 216.8L328.4 218.5L326.9 220.1L325.3 221.5L323.8 222.8L322.5 223.9L321.3 224.7L320.4 225.2L319.7 225.3L319.3 225.2L319.3 224.7L319.5 223.9L320 222.9L320.8 221.6L321.9 220.2L323.1 218.6L324.6 216.9L326.1 215.3L327.6 213.7L329.2 212.2L330.7 210.9L332 209.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M319.5 223.9L319.3 224.7L319.3 225.2L313.2 219.4L313.2 219L313.4 218.2ZM335.1 208.6L334.8 208.4L334.1 208.6L328 202.8L328.7 202.7L329 202.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M321.9 220.2L320.8 221.6L320 222.9L319.5 223.9L313.4 218.2L313.9 217.2L314.7 215.9L315.8 214.4ZM334.1 208.6L333.2 209.1L332 209.9L325.9 204.1L327.1 203.3L328 202.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M332 209.9L330.7 210.9L329.2 212.2L327.6 213.7L326.1 215.3L324.6 216.9L323.1 218.6L321.9 220.2L315.8 214.4L317 212.8L318.4 211.2L320 209.5L321.5 208L323.1 206.5L324.6 205.2L325.9 204.1Z\"/><path class=\"iso-top\" d=\"\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M335.1 208.5L334.9 208.4L334.5 208.4L334 208.6L333.5 208.9L332.8 209.3L332 209.9L331.2 210.5L330.3 211.3L329.3 212.1L328.3 213L327.3 214L326.3 215L325.3 216.1L324.4 217.1L323.5 218.2L322.6 219.2L321.8 220.2L321.1 221.2L320.5 222.1L320.1 222.9L319.7 223.6L319.4 224.2L319.3 224.6L319.3 225L319.4 225.2\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M313.2 219L313.3 218.6L313.5 218L313.8 217.3L314.3 216.5L314.9 215.7L315.6 214.7L316.3 213.7L317.2 212.6L318.1 211.6L319.1 210.5L320.1 209.4L321.1 208.4L322.1 207.4L323.1 206.4L324.1 205.6L325 204.8L325.9 204.1L326.7 203.6L327.4 203.2L328 202.9L328.4 202.7L328.8 202.7L329 202.8L335.1 208.5L335.2 208.8L335.2 209.2L335 209.7L334.8 210.3L334.3 211.1L333.8 211.9L333.2 212.8L332.4 213.8L331.6 214.8L330.7 215.9L329.8 217L328.8 218.1L327.8 219.1L326.8 220.1L325.7 221.1L324.8 222L323.8 222.8L322.9 223.6L322.1 224.2L321.3 224.7L320.7 225L320.2 225.2L319.8 225.3L319.5 225.3L313.4 219.5L313.2 219.4Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M316.6 227.3L317 226.1L318 224.3L319.8 221.7L321.5 219.5L323.5 217.1L325.8 214.7L328.1 212.5L330.2 210.9L334.9 207.3L336.5 206.3L337.6 206L355.9 223.2L356.2 223.7L355.8 224.8L354.8 226.6L353 229.2L351.3 231.4L349.3 233.9L347 236.3L344.7 238.4L342.6 240.1L337.9 243.6L336.3 244.7L335.2 245L316.9 227.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M316.6 227.3L316.9 227.8L335.2 245L334.9 244.5ZM348.5 228.1L346.4 229.7L344.1 231.9L341.8 234.3L339.8 236.7L338.1 239L336.4 241.6L335.3 243.3L334.9 244.5L335.2 245L336.3 244.7L337.9 243.6L342.6 240.1L344.7 238.4L347 236.3L349.3 233.9L351.3 231.4L353 229.2L354.8 226.6L355.8 224.8L356.2 223.7L355.9 223.2L354.8 223.5L353.2 224.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M317 226.1L316.6 227.3L334.9 244.5L335.3 243.3ZM337.6 206L336.5 206.3L354.8 223.5L355.9 223.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M321.5 219.5L319.8 221.7L338.1 239L339.8 236.7ZM319.8 221.7L318 224.3L336.4 241.6L338.1 239ZM318 224.3L317 226.1L335.3 243.3L336.4 241.6ZM336.5 206.3L334.9 207.3L353.2 224.5L354.8 223.5ZM334.9 207.3L330.2 210.9L348.5 228.1L353.2 224.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M330.2 210.9L328.1 212.5L346.4 229.7L348.5 228.1ZM328.1 212.5L325.8 214.7L344.1 231.9L346.4 229.7ZM325.8 214.7L323.5 217.1L341.8 234.3L344.1 231.9ZM323.5 217.1L321.5 219.5L339.8 236.7L341.8 234.3Z\"/><path class=\"iso-top\" d=\"\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M348.5 228.1L346.4 229.7M346.4 229.7L344.1 231.9M344.1 231.9L341.8 234.3M341.8 234.3L339.8 236.7M339.8 236.7L338.1 239M338.1 239L336.4 241.6M336.4 241.6L335.3 243.3M335.3 243.3L334.9 244.5M334.9 244.5L335.2 245M355.9 223.2L354.8 223.5M354.8 223.5L353.2 224.5M353.2 224.5L348.5 228.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M316.6 227.3L317 226.1L318 224.3L319.8 221.7L321.5 219.5L323.5 217.1L325.8 214.7L328.1 212.5L330.2 210.9L334.9 207.3L336.5 206.3L337.6 206L355.9 223.2L356.2 223.7L355.8 224.8L354.8 226.6L353 229.2L351.3 231.4L349.3 233.9L347 236.3L344.7 238.4L342.6 240.1L337.9 243.6L336.3 244.7L335.2 245L316.9 227.8Z\"/></g></g></g><g class=\"rb-af rb-af-3\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M275 171.3L275 169.5L275.4 167.5L276.1 165.7L277 164.1L278.1 163L285.2 157.7L286.3 157.2L287.4 157.3L336.5 169.4L337.4 170L338 171.2L338.4 172.8L339 180.4L338.9 182.3L338.6 184.2L337.9 186L336.9 187.6L335.9 188.7L328.7 194L327.6 194.5L326.6 194.4L277.4 182.4L276.5 181.7L275.9 180.5L275.6 178.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M275.9 180.5L276.5 181.7L325.7 193.8L325 192.6ZM276.5 181.7L277.4 182.4L326.6 194.4L325.7 193.8ZM327.2 175.1L326.1 176.2L325.2 177.7L324.5 179.6L324.1 181.5L324.1 183.4L324.7 191L325 192.6L325.7 193.8L326.6 194.4L327.6 194.5L328.7 194L335.9 188.7L336.9 187.6L337.9 186L338.6 184.2L338.9 182.3L339 180.4L338.4 172.8L338 171.2L337.4 170L336.5 169.4L335.5 169.3L334.3 169.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M275 171.3L275.6 178.9L324.7 191L324.1 183.4ZM275.6 178.9L275.9 180.5L325 192.6L324.7 191Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M275 169.5L275 171.3L324.1 183.4L324.1 181.5ZM287.4 157.3L286.3 157.2L335.5 169.3L336.5 169.4Z\"/><path class=\"iso-top\" d=\"M278.1 163L277 164.1L326.1 176.2L327.2 175.1ZM277 164.1L276.1 165.7L325.2 177.7L326.1 176.2ZM276.1 165.7L275.4 167.5L324.5 179.6L325.2 177.7ZM275.4 167.5L275 169.5L324.1 181.5L324.5 179.6ZM286.3 157.2L285.2 157.7L334.3 169.8L335.5 169.3ZM285.2 157.7L278.1 163L327.2 175.1L334.3 169.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M327.2 175.1L326.1 176.2M326.1 176.2L325.2 177.7M325.2 177.7L324.5 179.6M324.5 179.6L324.1 181.5M324.1 181.5L324.1 183.4M324.1 183.4L324.7 191M324.7 191L325 192.6M325 192.6L325.7 193.8M325.7 193.8L326.6 194.4M336.5 169.4L335.5 169.3M335.5 169.3L334.3 169.8M334.3 169.8L327.2 175.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M275 171.3L275 169.5L275.4 167.5L276.1 165.7L277 164.1L278.1 163L285.2 157.7L286.3 157.2L287.4 157.3L336.5 169.4L337.4 170L338 171.2L338.4 172.8L339 180.4L338.9 182.3L338.6 184.2L337.9 186L336.9 187.6L335.9 188.7L328.7 194L327.6 194.5L326.6 194.4L277.4 182.4L276.5 181.7L275.9 180.5L275.6 178.9Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M321.6 184.1L321.6 182.7L321.8 181.3L322.1 179.8L322.5 178.4L323 177L323.5 175.7L324.2 174.5L324.8 173.4L325.6 172.4L326.4 171.5L327.2 170.9L328 170.3L328.8 170L329.7 169.8L330.4 169.8L337.5 171.6L338.2 171.8L338.9 172.1L339.5 172.7L340.1 173.4L340.6 174.3L341 175.3L341.2 176.4L341.4 177.7L341.5 179L341.5 180.4L341.4 181.8L341.1 183.3L340.8 184.7L340.3 186.1L339.8 187.4L339.2 188.7L338.6 189.9L337.9 190.9L337.1 191.8L336.3 192.6L335.5 193.2L334.6 193.7L333.8 193.9L333 194L332.2 193.9L325.2 192.2L324.5 191.9L323.8 191.4L323.2 190.8L322.7 190L322.3 189L322 187.9L321.7 186.7L321.6 185.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M329.4 191.1L330.2 192.4L331.1 193.3L332.2 193.9L325.1 192.1L324.1 191.6L323.1 190.6L322.4 189.3ZM335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L335 182.8L334.2 172.6L335.5 171.8L336.7 171.5L337.9 171.7L339 172.2L339.9 173.2L340.7 174.5L341.2 176.1L341.5 178L341.5 180.1L341.3 182.3L340.8 184.5L340.2 186.6L339.3 188.6L338.3 190.3L337.1 191.8L335.9 192.9L334.6 193.7L333.4 194L332.2 193.9L331.1 193.3L330.2 192.4L329.4 191.1L328.9 189.4L328.6 187.5L328.6 185.4L328.8 183.3L329.2 181.1L329.9 178.9L330.8 176.9L331.8 175.2L333 173.7L334.2 172.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M328.9 189.4L329.4 191.1L322.4 189.3L321.9 187.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M328.6 187.5L328.9 189.4L321.9 187.7L321.6 185.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M328.8 183.3L328.6 185.4L328.6 187.5L321.6 185.8L321.6 183.7L321.8 181.5ZM337.9 171.7L336.7 171.5L329.7 169.8L330.9 169.9Z\"/><path class=\"iso-top\" d=\"M336.7 171.5L335.5 171.8L334.2 172.6L333 173.7L331.8 175.2L330.8 176.9L329.9 178.9L329.2 181.1L328.8 183.3L321.8 181.5L322.2 179.3L322.9 177.2L323.8 175.2L324.8 173.5L326 172L327.2 170.9L328.5 170.1L329.7 169.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M337.8 171.6L337 171.5L336.2 171.6L335.4 171.9L334.6 172.3L333.8 172.9L333 173.7L332.3 174.5L331.6 175.6L330.9 176.7L330.3 177.9L329.8 179.3L329.4 180.6L329 182L328.8 183.4L328.6 184.8L328.6 186.2L328.6 187.5L328.8 188.8L329 189.9L329.4 190.9L329.8 191.8L330.3 192.6L330.9 193.2L331.6 193.6L332.3 193.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M321.6 184.1L321.6 182.7L321.8 181.3L322.1 179.8L322.5 178.4L323 177L323.5 175.7L324.2 174.5L324.8 173.4L325.6 172.4L326.4 171.5L327.2 170.9L328 170.3L328.8 170L329.7 169.8L330.4 169.8L337.5 171.6L338.2 171.8L338.9 172.1L339.5 172.7L340.1 173.4L340.6 174.3L341 175.3L341.2 176.4L341.4 177.7L341.5 179L341.5 180.4L341.4 181.8L341.1 183.3L340.8 184.7L340.3 186.1L339.8 187.4L339.2 188.7L338.6 189.9L337.9 190.9L337.1 191.8L336.3 192.6L335.5 193.2L334.6 193.7L333.8 193.9L333 194L332.2 193.9L325.2 192.2L324.5 191.9L323.8 191.4L323.2 190.8L322.7 190L322.3 189L322 187.9L321.7 186.7L321.6 185.5Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M326.6 187L326.6 183.9L327.3 180.7L328.4 177.6L329.9 175L331.7 173.2L336.5 169.7L338.4 168.8L340.1 168.9L361.2 174.1L362.7 175.2L363.7 177.2L364.3 179.9L364.6 183.7L364.5 186.8L363.9 190L362.7 193.1L361.2 195.7L359.4 197.5L354.6 201L352.8 201.9L351 201.8L329.9 196.6L328.5 195.5L327.4 193.5L326.9 190.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M327.4 193.5L328.5 195.5L349.5 200.7L348.5 198.7ZM328.5 195.5L329.9 196.6L351 201.8L349.5 200.7ZM352.8 178.4L351 180.2L349.5 182.8L348.3 185.8L347.7 189.1L347.6 192.2L347.9 196L348.5 198.7L349.5 200.7L351 201.8L352.8 201.9L354.6 201L359.4 197.5L361.2 195.7L362.7 193.1L363.9 190L364.5 186.8L364.6 183.7L364.3 179.9L363.7 177.2L362.7 175.2L361.2 174.1L359.4 174L357.6 174.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M326.6 187L326.9 190.8L347.9 196L347.6 192.2ZM326.9 190.8L327.4 193.5L348.5 198.7L347.9 196Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M326.6 183.9L326.6 187L347.6 192.2L347.7 189.1ZM340.1 168.9L338.4 168.8L359.4 174L361.2 174.1Z\"/><path class=\"iso-top\" d=\"M331.7 173.2L329.9 175L351 180.2L352.8 178.4ZM329.9 175L328.4 177.6L349.5 182.8L351 180.2ZM328.4 177.6L327.3 180.7L348.3 185.8L349.5 182.8ZM327.3 180.7L326.6 183.9L347.7 189.1L348.3 185.8ZM338.4 168.8L336.5 169.7L357.6 174.9L359.4 174ZM336.5 169.7L331.7 173.2L352.8 178.4L357.6 174.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M352.8 178.4L351 180.2M351 180.2L349.5 182.8M349.5 182.8L348.3 185.8M348.3 185.8L347.7 189.1M347.7 189.1L347.6 192.2M347.6 192.2L347.9 196M347.9 196L348.5 198.7M348.5 198.7L349.5 200.7M349.5 200.7L351 201.8M361.2 174.1L359.4 174M359.4 174L357.6 174.9M357.6 174.9L352.8 178.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M326.6 187L326.6 183.9L327.3 180.7L328.4 177.6L329.9 175L331.7 173.2L336.5 169.7L338.4 168.8L340.1 168.9L361.2 174.1L362.7 175.2L363.7 177.2L364.3 179.9L364.6 183.7L364.5 186.8L363.9 190L362.7 193.1L361.2 195.7L359.4 197.5L354.6 201L352.8 201.9L351 201.8L329.9 196.6L328.5 195.5L327.4 193.5L326.9 190.8Z\"/></g></g></g><g class=\"rb-af rb-af-4\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M270.9 163.6L271 161.8L271.6 160.3L272.5 159.2L279.7 153.9L280.9 153.4L321.3 137.5L322.7 137.5L324.2 138.2L325.5 139.3L326.7 140.9L330.7 148.3L331.5 150.1L331.8 152.1L331.7 153.9L331.1 155.4L330.2 156.5L323 161.8L321.8 162.3L281.4 178.2L280 178.2L278.5 177.6L277.1 176.4L276 174.8L272 167.4L271.2 165.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M277.1 176.4L278.5 177.6L318.9 161.6L317.6 160.5ZM278.5 177.6L280 178.2L320.4 162.3L318.9 161.6ZM280 178.2L281.4 178.2L321.8 162.3L320.4 162.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M312.9 143.3L312 144.4L311.4 145.9L311.3 147.7L311.6 149.6L312.4 151.5L316.4 158.9L317.6 160.5L318.9 161.6L320.4 162.3L321.8 162.3L323 161.8L330.2 156.5L331.1 155.4L331.7 153.9L331.8 152.1L331.5 150.1L330.7 148.3L326.7 140.9L325.5 139.3L324.2 138.2L322.7 137.5L321.3 137.5L320.1 138Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M272 167.4L276 174.8L316.4 158.9L312.4 151.5ZM276 174.8L277.1 176.4L317.6 160.5L316.4 158.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M271.2 165.6L272 167.4L312.4 151.5L311.6 149.6Z\"/><path class=\"iso-top\" d=\"M272.5 159.2L271.6 160.3L312 144.4L312.9 143.3ZM271.6 160.3L271 161.8L311.4 145.9L312 144.4ZM271 161.8L270.9 163.6L311.3 147.7L311.4 145.9ZM270.9 163.6L271.2 165.6L311.6 149.6L311.3 147.7ZM280.9 153.4L279.7 153.9L320.1 138L321.3 137.5ZM279.7 153.9L272.5 159.2L312.9 143.3L320.1 138Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M312.9 143.3L312 144.4M312 144.4L311.4 145.9M311.4 145.9L311.3 147.7M311.3 147.7L311.6 149.6M311.6 149.6L312.4 151.5M312.4 151.5L316.4 158.9M316.4 158.9L317.6 160.5M317.6 160.5L318.9 161.6M318.9 161.6L320.4 162.3M320.4 162.3L321.8 162.3M321.3 137.5L320.1 138M320.1 138L312.9 143.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M270.9 163.6L271 161.8L271.6 160.3L272.5 159.2L279.7 153.9L280.9 153.4L321.3 137.5L322.7 137.5L324.2 138.2L325.5 139.3L326.7 140.9L330.7 148.3L331.5 150.1L331.8 152.1L331.7 153.9L331.1 155.4L330.2 156.5L323 161.8L321.8 162.3L281.4 178.2L280 178.2L278.5 177.6L277.1 176.4L276 174.8L272 167.4L271.2 165.6Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M310.2 148.5L310.3 147.2L310.5 145.9L310.8 144.7L311.2 143.6L311.8 142.6L312.4 141.7L313.2 141L314.1 140.5L319.8 138.2L320.8 137.9L321.8 137.7L322.8 137.7L323.9 137.9L325 138.3L326.1 138.8L327.1 139.5L328.1 140.4L329 141.3L329.9 142.5L330.7 143.7L331.3 145L331.9 146.3L332.3 147.7L332.7 149.1L332.8 150.6L332.9 151.9L332.8 153.3L332.5 154.5L332.1 155.7L331.6 156.7L331 157.6L330.3 158.4L329.5 159L328.6 159.5L322.8 161.7L321.8 162L320.8 162.1L319.7 162L318.7 161.7L317.6 161.3L316.5 160.6L315.5 159.9L314.5 158.9L313.6 157.9L312.8 156.7L312.1 155.5L311.5 154.1L311 152.7L310.6 151.3L310.3 149.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M320.6 157L322.1 158.2L323.8 159.2L325.4 159.7L327 159.8L328.5 159.5L322.8 161.7L321.3 162.1L319.6 162L318 161.4L316.4 160.5L314.8 159.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M319.2 155.4L320.6 157L314.8 159.2L313.4 157.6ZM324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L324.4 148.7L319 138.8L320.3 138L321.9 137.7L323.5 137.8L325.1 138.3L326.7 139.2L328.3 140.5L329.7 142.1L330.9 144L331.8 146L332.5 148.2L332.8 150.3L332.8 152.4L332.5 154.4L331.9 156.1L331 157.6L329.9 158.7L328.5 159.5L327 159.8L325.4 159.7L323.8 159.2L322.1 158.2L320.6 157L319.2 155.4L318 153.5L317.1 151.5L316.4 149.3L316.1 147.2L316 145.1L316.3 143.1L316.9 141.3L317.8 139.9L319 138.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M318 153.5L319.2 155.4L313.4 157.6L312.2 155.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M316.4 149.3L317.1 151.5L318 153.5L312.2 155.8L311.3 153.7L310.6 151.6Z\"/><path class=\"iso-top\" d=\"M320.3 138L319 138.8L317.8 139.9L316.9 141.3L316.3 143.1L316 145.1L316.1 147.2L316.4 149.3L310.6 151.6L310.3 149.4L310.3 147.3L310.6 145.4L311.2 143.6L312.1 142.2L313.2 141L314.6 140.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M320.2 138.1L319.3 138.5L318.5 139.1L317.8 139.9L317.2 140.8L316.7 141.8L316.4 142.9L316.1 144.2L316 145.5L316 146.8L316.2 148.2L316.5 149.6L316.9 150.9L317.4 152.3L318.1 153.6L318.8 154.8L319.6 155.9L320.5 156.9L321.5 157.8L322.5 158.5L323.6 159.1L324.6 159.5L325.7 159.7L326.7 159.8L327.7 159.7L328.6 159.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M310.2 148.5L310.3 147.2L310.5 145.9L310.8 144.7L311.2 143.6L311.8 142.6L312.4 141.7L313.2 141L314.1 140.5L319.8 138.2L320.8 137.9L321.8 137.7L322.8 137.7L323.9 137.9L325 138.3L326.1 138.8L327.1 139.5L328.1 140.4L329 141.3L329.9 142.5L330.7 143.7L331.3 145L331.9 146.3L332.3 147.7L332.7 149.1L332.8 150.6L332.9 151.9L332.8 153.3L332.5 154.5L332.1 155.7L331.6 156.7L331 157.6L330.3 158.4L329.5 159L328.6 159.5L322.8 161.7L321.8 162L320.8 162.1L319.7 162L318.7 161.7L317.6 161.3L316.5 160.6L315.5 159.9L314.5 158.9L313.6 157.9L312.8 156.7L312.1 155.5L311.5 154.1L311 152.7L310.6 151.3L310.3 149.9Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M313.3 146.8L313.5 143.8L314.4 141.2L316 139.4L320.8 135.9L322.8 135L340.2 128.2L342.5 128.2L345 129.3L347.2 131.3L349.1 133.9L351.1 137.6L352.4 140.7L352.9 143.9L352.7 146.9L351.8 149.4L350.2 151.3L345.4 154.8L343.4 155.7L326 162.5L323.7 162.4L321.2 161.4L319 159.4L317.1 156.8L315.1 153.1L313.8 150Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M319 159.4L321.2 161.4L338.6 154.5L336.3 152.6ZM321.2 161.4L323.7 162.4L341 155.6L338.6 154.5ZM323.7 162.4L326 162.5L343.4 155.7L341 155.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M333.3 132.6L331.7 134.4L330.8 136.9L330.6 140L331.2 143.2L332.4 146.2L334.4 149.9L336.3 152.6L338.6 154.5L341 155.6L343.4 155.7L345.4 154.8L350.2 151.3L351.8 149.4L352.7 146.9L352.9 143.9L352.4 140.7L351.1 137.6L349.1 133.9L347.2 131.3L345 129.3L342.5 128.2L340.2 128.2L338.1 129.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M315.1 153.1L317.1 156.8L334.4 149.9L332.4 146.2ZM317.1 156.8L319 159.4L336.3 152.6L334.4 149.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M313.8 150L315.1 153.1L332.4 146.2L331.2 143.2Z\"/><path class=\"iso-top\" d=\"M316 139.4L314.4 141.2L331.7 134.4L333.3 132.6ZM314.4 141.2L313.5 143.8L330.8 136.9L331.7 134.4ZM313.5 143.8L313.3 146.8L330.6 140L330.8 136.9ZM313.3 146.8L313.8 150L331.2 143.2L330.6 140ZM322.8 135L320.8 135.9L338.1 129.1L340.2 128.2ZM320.8 135.9L316 139.4L333.3 132.6L338.1 129.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M333.3 132.6L331.7 134.4M331.7 134.4L330.8 136.9M330.8 136.9L330.6 140M330.6 140L331.2 143.2M331.2 143.2L332.4 146.2M332.4 146.2L334.4 149.9M334.4 149.9L336.3 152.6M336.3 152.6L338.6 154.5M338.6 154.5L341 155.6M341 155.6L343.4 155.7M340.2 128.2L338.1 129.1M338.1 129.1L333.3 132.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M313.3 146.8L313.5 143.8L314.4 141.2L316 139.4L320.8 135.9L322.8 135L340.2 128.2L342.5 128.2L345 129.3L347.2 131.3L349.1 133.9L351.1 137.6L352.4 140.7L352.9 143.9L352.7 146.9L351.8 149.4L350.2 151.3L345.4 154.8L343.4 155.7L326 162.5L323.7 162.4L321.2 161.4L319 159.4L317.1 156.8L315.1 153.1L313.8 150Z\"/></g></g></g><g class=\"rb-af rb-af-5\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M269.2 161.1L269.6 159.7L270.6 158.6L277.7 153.3L312.6 128.6L313.9 128.1L315.4 128.1L317 128.6L318.5 129.7L319.9 131.2L324.9 138.1L325.8 139.8L326.4 141.6L326.4 143.3L325.9 144.8L325 145.9L317.9 151.1L283 175.8L281.7 176.4L280.2 176.4L278.6 175.8L277 174.8L275.7 173.3L270.7 166.4L269.8 164.7L269.2 162.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M277 174.8L278.6 175.8L313.5 151.2L311.9 150.1ZM278.6 175.8L280.2 176.4L315.1 151.7L313.5 151.2ZM280.2 176.4L281.7 176.4L316.6 151.7L315.1 151.7ZM281.7 176.4L283 175.8L317.9 151.1L316.6 151.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M305.4 133.9L304.5 135L304.1 136.5L304.1 138.2L304.6 140L305.6 141.7L310.6 148.6L311.9 150.1L313.5 151.2L315.1 151.7L316.6 151.7L317.9 151.1L325 145.9L325.9 144.8L326.4 143.3L326.4 141.6L325.8 139.8L324.9 138.1L319.9 131.2L318.5 129.7L317 128.6L315.4 128.1L313.9 128.1L312.6 128.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M270.7 166.4L275.7 173.3L310.6 148.6L305.6 141.7ZM275.7 173.3L277 174.8L311.9 150.1L310.6 148.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M269.8 164.7L270.7 166.4L305.6 141.7L304.6 140Z\"/><path class=\"iso-top\" d=\"M270.6 158.6L269.6 159.7L304.5 135L305.4 133.9ZM269.6 159.7L269.2 161.1L304.1 136.5L304.5 135ZM269.2 161.1L269.2 162.9L304.1 138.2L304.1 136.5ZM269.2 162.9L269.8 164.7L304.6 140L304.1 138.2ZM277.7 153.3L270.6 158.6L305.4 133.9L312.6 128.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M305.4 133.9L304.5 135M304.5 135L304.1 136.5M304.1 136.5L304.1 138.2M304.1 138.2L304.6 140M304.6 140L305.6 141.7M305.6 141.7L310.6 148.6M310.6 148.6L311.9 150.1M311.9 150.1L313.5 151.2M313.5 151.2L315.1 151.7M315.1 151.7L316.6 151.7M316.6 151.7L317.9 151.1M312.6 128.6L305.4 133.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M269.2 161.1L269.6 159.7L270.6 158.6L277.7 153.3L312.6 128.6L313.9 128.1L315.4 128.1L317 128.6L318.5 129.7L319.9 131.2L324.9 138.1L325.8 139.8L326.4 141.6L326.4 143.3L325.9 144.8L325 145.9L317.9 151.1L283 175.8L281.7 176.4L280.2 176.4L278.6 175.8L277 174.8L275.7 173.3L270.7 166.4L269.8 164.7L269.2 162.9Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M303.4 138.3L303.5 137L303.7 135.9L304.1 134.8L304.6 133.9L305.3 133L306 132.4L311 128.8L311.9 128.3L312.8 127.9L313.9 127.7L315 127.7L316.2 127.8L317.4 128.1L318.5 128.6L319.7 129.2L320.9 130L322 130.9L323 132L323.9 133.1L324.8 134.3L325.5 135.6L326.1 136.9L326.5 138.2L326.8 139.5L327 140.9L327 142.1L326.9 143.3L326.6 144.4L326.1 145.5L325.6 146.3L324.9 147.1L324 147.7L319 151.2L318.1 151.7L317.1 152L316 152.1L314.9 152L313.7 151.8L312.5 151.4L311.3 150.9L310.2 150.2L309 149.3L308 148.4L307 147.3L306.1 146.1L305.3 144.9L304.7 143.6L304.2 142.2L303.8 140.9L303.5 139.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M314.4 146.1L316.1 147.2L317.9 148.1L319.8 148.5L321.5 148.5L323.1 148.2L324.5 147.4L319.5 151L318.1 151.7L316.5 152.1L314.8 152L313 151.6L311.1 150.8L309.4 149.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M312.7 144.6L314.4 146.1L309.4 149.6L307.8 148.1ZM317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L317.7 138.1L311 128.8L312.4 128.1L314 127.7L315.7 127.8L317.5 128.2L319.3 129L321.1 130.2L322.7 131.7L324.1 133.4L325.3 135.3L326.2 137.3L326.8 139.3L327 141.3L326.9 143.2L326.4 144.9L325.6 146.3L324.5 147.4L323.1 148.2L321.5 148.5L319.8 148.5L317.9 148.1L316.1 147.2L314.4 146.1L312.7 144.6L311.3 142.9L310.1 141L309.2 139L308.7 136.9L308.4 134.9L308.6 133L309.1 131.4L309.9 129.9L311 128.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M311.3 142.9L312.7 144.6L307.8 148.1L306.3 146.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M309.2 139L310.1 141L311.3 142.9L306.3 146.4L305.1 144.5L304.2 142.5Z\"/><path class=\"iso-top\" d=\"M311 128.8L309.9 129.9L309.1 131.4L308.6 133L308.4 134.9L308.7 136.9L309.2 139L304.2 142.5L303.7 140.4L303.4 138.4L303.6 136.6L304.1 134.9L304.9 133.5L306 132.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M311.1 128.8L310.3 129.4L309.7 130.2L309.2 131.1L308.8 132.1L308.5 133.3L308.4 134.5L308.5 135.7L308.7 137L309 138.3L309.5 139.6L310.1 140.9L310.8 142.1L311.6 143.3L312.6 144.4L313.6 145.4L314.6 146.3L315.8 147L316.9 147.7L318.1 148.1L319.3 148.4L320.4 148.6L321.5 148.5L322.5 148.4L323.5 148L324.4 147.5\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M303.4 138.3L303.5 137L303.7 135.9L304.1 134.8L304.6 133.9L305.3 133L306 132.4L311 128.8L311.9 128.3L312.8 127.9L313.9 127.7L315 127.7L316.2 127.8L317.4 128.1L318.5 128.6L319.7 129.2L320.9 130L322 130.9L323 132L323.9 133.1L324.8 134.3L325.5 135.6L326.1 136.9L326.5 138.2L326.8 139.5L327 140.9L327 142.1L326.9 143.3L326.6 144.4L326.1 145.5L325.6 146.3L324.9 147.1L324 147.7L319 151.2L318.1 151.7L317.1 152L316 152.1L314.9 152L313.7 151.8L312.5 151.4L311.3 150.9L310.2 150.2L309 149.3L308 148.4L307 147.3L306.1 146.1L305.3 144.9L304.7 143.6L304.2 142.2L303.8 140.9L303.5 139.6Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M305.6 133.8L306.3 131.3L307.9 129.6L312.6 126L327.6 115.5L329.7 114.5L332.3 114.5L335 115.5L337.5 117.2L339.7 119.7L342.2 123.1L343.9 126L344.8 129L344.8 131.9L344.1 134.3L342.5 136.1L337.8 139.6L322.8 150.2L320.7 151.2L318.1 151.2L315.4 150.2L312.9 148.5L310.7 146L308.2 142.6L306.5 139.7L305.6 136.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M312.9 148.5L315.4 150.2L330.4 139.7L327.8 137.9ZM315.4 150.2L318.1 151.2L333.1 140.6L330.4 139.7ZM318.1 151.2L320.7 151.2L335.6 140.6L333.1 140.6ZM320.7 151.2L322.8 150.2L337.8 139.6L335.6 140.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M322.8 119L321.3 120.8L320.5 123.2L320.6 126.1L321.5 129.1L323.1 132L325.6 135.4L327.8 137.9L330.4 139.7L333.1 140.6L335.6 140.6L337.8 139.6L342.5 136.1L344.1 134.3L344.8 131.9L344.8 129L343.9 126L342.2 123.1L339.7 119.7L337.5 117.2L335 115.5L332.3 114.5L329.7 114.5L327.6 115.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M308.2 142.6L310.7 146L325.6 135.4L323.1 132ZM310.7 146L312.9 148.5L327.8 137.9L325.6 135.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M306.5 139.7L308.2 142.6L323.1 132L321.5 129.1Z\"/><path class=\"iso-top\" d=\"M307.9 129.6L306.3 131.3L321.3 120.8L322.8 119ZM306.3 131.3L305.6 133.8L320.5 123.2L321.3 120.8ZM305.6 133.8L305.6 136.7L320.6 126.1L320.5 123.2ZM305.6 136.7L306.5 139.7L321.5 129.1L320.6 126.1ZM312.6 126L307.9 129.6L322.8 119L327.6 115.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M322.8 119L321.3 120.8M321.3 120.8L320.5 123.2M320.5 123.2L320.6 126.1M320.6 126.1L321.5 129.1M321.5 129.1L323.1 132M323.1 132L325.6 135.4M325.6 135.4L327.8 137.9M327.8 137.9L330.4 139.7M330.4 139.7L333.1 140.6M333.1 140.6L335.6 140.6M335.6 140.6L337.8 139.6M327.6 115.5L322.8 119\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M305.6 133.8L306.3 131.3L307.9 129.6L312.6 126L327.6 115.5L329.7 114.5L332.3 114.5L335 115.5L337.5 117.2L339.7 119.7L342.2 123.1L343.9 126L344.8 129L344.8 131.9L344.1 134.3L342.5 136.1L337.8 139.6L322.8 150.2L320.7 151.2L318.1 151.2L315.4 150.2L312.9 148.5L310.7 146L308.2 142.6L306.5 139.7L305.6 136.7Z\"/></g></g></g><g class=\"rb-af rb-af-6\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M267.4 160.8L267.7 159.4L268.6 158.4L296.9 125.7L304.1 120.4L305.4 119.8L307 119.7L308.7 120.2L310.4 121.1L312 122.4L317.7 128.6L318.9 130.1L319.6 131.8L319.8 133.4L319.4 134.8L318.5 135.8L290.2 168.5L283.1 173.8L281.8 174.4L280.1 174.4L278.4 174L276.7 173.1L275.2 171.8L269.4 165.6L268.2 164.1L267.5 162.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M276.7 173.1L278.4 174L306.7 141.3L305 140.4ZM278.4 174L280.1 174.4L308.4 141.8L306.7 141.3ZM280.1 174.4L281.8 174.4L310 141.7L308.4 141.8ZM281.8 174.4L283.1 173.8L311.4 141.1L310 141.7ZM283.1 173.8L290.2 168.5L318.5 135.8L311.4 141.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M269.4 165.6L275.2 171.8L303.5 139.1L297.7 133ZM275.2 171.8L276.7 173.1L305 140.4L303.5 139.1ZM296.9 125.7L296 126.7L295.7 128.1L295.8 129.7L296.5 131.4L297.7 133L303.5 139.1L305 140.4L306.7 141.3L308.4 141.8L310 141.7L311.4 141.1L318.5 135.8L319.4 134.8L319.8 133.4L319.6 131.8L318.9 130.1L317.7 128.6L312 122.4L310.4 121.1L308.7 120.2L307 119.7L305.4 119.8L304.1 120.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M268.2 164.1L269.4 165.6L297.7 133L296.5 131.4Z\"/><path class=\"iso-top\" d=\"M268.6 158.4L267.7 159.4L296 126.7L296.9 125.7ZM267.7 159.4L267.4 160.8L295.7 128.1L296 126.7ZM267.4 160.8L267.5 162.4L295.8 129.7L295.7 128.1ZM267.5 162.4L268.2 164.1L296.5 131.4L295.8 129.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M296.9 125.7L296 126.7M296 126.7L295.7 128.1M295.7 128.1L295.8 129.7M295.8 129.7L296.5 131.4M296.5 131.4L297.7 133M297.7 133L303.5 139.1M303.5 139.1L305 140.4M305 140.4L306.7 141.3M306.7 141.3L308.4 141.8M308.4 141.8L310 141.7M310 141.7L311.4 141.1M311.4 141.1L318.5 135.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M267.4 160.8L267.7 159.4L268.6 158.4L296.9 125.7L304.1 120.4L305.4 119.8L307 119.7L308.7 120.2L310.4 121.1L312 122.4L317.7 128.6L318.9 130.1L319.6 131.8L319.8 133.4L319.4 134.8L318.5 135.8L290.2 168.5L283.1 173.8L281.8 174.4L280.1 174.4L278.4 174L276.7 173.1L275.2 171.8L269.4 165.6L268.2 164.1L267.5 162.4Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M295.6 129.3L295.7 128.2L296.1 127.2L296.5 126.2L297.1 125.4L301.2 120.8L301.9 120.1L302.8 119.6L303.8 119.2L304.9 118.9L306.1 118.8L307.3 118.9L308.6 119.1L309.9 119.5L311.2 120L312.4 120.7L313.7 121.5L314.8 122.4L315.9 123.4L316.9 124.5L317.7 125.6L318.4 126.8L319 128.1L319.4 129.3L319.7 130.5L319.8 131.7L319.8 132.8L319.5 133.9L319.1 134.8L318.6 135.7L314.6 140.4L313.9 141.1L313.1 141.7L312.1 142.2L311.1 142.5L309.9 142.7L308.7 142.7L307.5 142.5L306.2 142.2L304.9 141.8L303.6 141.2L302.4 140.4L301.2 139.6L300 138.6L299 137.6L298.1 136.5L297.3 135.3L296.7 134.1L296.2 132.8L295.8 131.6L295.6 130.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M306.8 136L308.7 137L310.7 137.7L312.6 138L314.5 137.9L316.1 137.5L317.5 136.7L318.6 135.7L314.6 140.3L313.5 141.4L312.1 142.2L310.4 142.6L308.6 142.7L306.7 142.3L304.7 141.7L302.7 140.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M305 134.7L306.8 136L302.7 140.7L300.9 139.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M303.3 133.2L305 134.7L300.9 139.4L299.3 137.8ZM309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L309.7 128.4L301.9 120.1L303.3 119.3L305 118.9L306.8 118.9L308.8 119.2L310.7 119.8L312.7 120.8L314.5 122.1L316.1 123.7L317.5 125.4L318.6 127.2L319.4 129.1L319.8 130.9L319.8 132.7L319.4 134.3L318.6 135.7L317.5 136.7L316.1 137.5L314.5 137.9L312.6 138L310.7 137.7L308.7 137L306.8 136L305 134.7L303.3 133.2L301.9 131.5L300.8 129.6L300.1 127.7L299.7 125.9L299.7 124.1L300.1 122.5L300.8 121.2L301.9 120.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M300.8 129.6L301.9 131.5L303.3 133.2L299.3 137.8L297.9 136.1L296.8 134.3Z\"/><path class=\"iso-top\" d=\"M300.8 121.2L300.1 122.5L299.7 124.1L299.7 125.9L300.1 127.7L300.8 129.6L296.8 134.3L296 132.4L295.6 130.6L295.6 128.8L296 127.2L296.8 125.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M301.1 120.9L300.5 121.7L300 122.6L299.8 123.6L299.6 124.7L299.7 125.8L299.9 127L300.2 128.2L300.7 129.4L301.4 130.6L302.1 131.8L303 132.9L304 133.9L305.1 134.8L306.3 135.7L307.5 136.4L308.7 137L310 137.5L311.3 137.8L312.5 138L313.7 138L314.8 137.9L315.9 137.6L316.8 137.2L317.7 136.6L318.4 135.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M295.6 129.3L295.7 128.2L296.1 127.2L296.5 126.2L297.1 125.4L301.2 120.8L301.9 120.1L302.8 119.6L303.8 119.2L304.9 118.9L306.1 118.8L307.3 118.9L308.6 119.1L309.9 119.5L311.2 120L312.4 120.7L313.7 121.5L314.8 122.4L315.9 123.4L316.9 124.5L317.7 125.6L318.4 126.8L319 128.1L319.4 129.3L319.7 130.5L319.8 131.7L319.8 132.8L319.5 133.9L319.1 134.8L318.6 135.7L314.6 140.4L313.9 141.1L313.1 141.7L312.1 142.2L311.1 142.5L309.9 142.7L308.7 142.7L307.5 142.5L306.2 142.2L304.9 141.8L303.6 141.2L302.4 140.4L301.2 139.6L300 138.6L299 137.6L298.1 136.5L297.3 135.3L296.7 134.1L296.2 132.8L295.8 131.6L295.6 130.4Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M296.6 125L297.2 122.7L298.7 120.9L310.8 106.9L315.6 103.4L317.8 102.4L320.4 102.3L323.4 103L326.2 104.5L328.7 106.7L331.6 109.8L333.6 112.4L334.7 115.2L335 117.9L334.4 120.2L332.9 121.9L320.8 135.9L316 139.4L313.8 140.4L311.1 140.6L308.2 139.8L305.4 138.3L302.9 136.1L300 133L298 130.4L296.9 127.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M305.4 138.3L308.2 139.8L320.4 125.8L317.5 124.3ZM308.2 139.8L311.1 140.6L323.3 126.6L320.4 125.8ZM311.1 140.6L313.8 140.4L325.9 126.4L323.3 126.6ZM313.8 140.4L316 139.4L328.1 125.4L325.9 126.4ZM316 139.4L320.8 135.9L332.9 121.9L328.1 125.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M300 133L302.9 136.1L315 122.1L312.1 119ZM302.9 136.1L305.4 138.3L317.5 124.3L315 122.1ZM310.8 106.9L309.3 108.7L308.7 111L309 113.7L310.2 116.4L312.1 119L315 122.1L317.5 124.3L320.4 125.8L323.3 126.6L325.9 126.4L328.1 125.4L332.9 121.9L334.4 120.2L335 117.9L334.7 115.2L333.6 112.4L331.6 109.8L328.7 106.7L326.2 104.5L323.4 103L320.4 102.3L317.8 102.4L315.6 103.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M298 130.4L300 133L312.1 119L310.2 116.4Z\"/><path class=\"iso-top\" d=\"M298.7 120.9L297.2 122.7L309.3 108.7L310.8 106.9ZM297.2 122.7L296.6 125L308.7 111L309.3 108.7ZM296.6 125L296.9 127.7L309 113.7L308.7 111ZM296.9 127.7L298 130.4L310.2 116.4L309 113.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M310.8 106.9L309.3 108.7M309.3 108.7L308.7 111M308.7 111L309 113.7M309 113.7L310.2 116.4M310.2 116.4L312.1 119M312.1 119L315 122.1M315 122.1L317.5 124.3M317.5 124.3L320.4 125.8M320.4 125.8L323.3 126.6M323.3 126.6L325.9 126.4M325.9 126.4L328.1 125.4M328.1 125.4L332.9 121.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M296.6 125L297.2 122.7L298.7 120.9L310.8 106.9L315.6 103.4L317.8 102.4L320.4 102.3L323.4 103L326.2 104.5L328.7 106.7L331.6 109.8L333.6 112.4L334.7 115.2L335 117.9L334.4 120.2L332.9 121.9L320.8 135.9L316 139.4L313.8 140.4L311.1 140.6L308.2 139.8L305.4 138.3L302.9 136.1L300 133L298 130.4L296.9 127.7Z\"/></g></g></g><g class=\"rb-af rb-af-7\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M265.6 160.8L265.9 159.5L286.8 119.8L287.6 118.8L294.8 113.5L296.1 112.9L297.8 112.7L299.6 113L301.5 113.7L303.1 114.8L309.5 120.1L310.8 121.4L311.7 122.9L311.9 124.4L311.6 125.7L290.8 165.4L289.9 166.4L282.8 171.6L281.4 172.3L279.8 172.4L277.9 172.2L276.1 171.4L274.4 170.3L268 165.1L266.7 163.7L265.9 162.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M276.1 171.4L277.9 172.2L298.8 132.5L296.9 131.8ZM277.9 172.2L279.8 172.4L300.6 132.8L298.8 132.5ZM279.8 172.4L281.4 172.3L302.3 132.6L300.6 132.8ZM281.4 172.3L282.8 171.6L303.6 132L302.3 132.6ZM282.8 171.6L289.9 166.4L310.7 126.7L303.6 132ZM289.9 166.4L290.8 165.4L311.6 125.7L310.7 126.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M268 165.1L274.4 170.3L295.3 130.7L288.9 125.4ZM274.4 170.3L276.1 171.4L296.9 131.8L295.3 130.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M266.7 163.7L268 165.1L288.9 125.4L287.6 124.1ZM287.6 118.8L286.8 119.8L286.5 121.1L286.7 122.6L287.6 124.1L288.9 125.4L295.3 130.7L296.9 131.8L298.8 132.5L300.6 132.8L302.3 132.6L303.6 132L310.7 126.7L311.6 125.7L311.9 124.4L311.7 122.9L310.8 121.4L309.5 120.1L303.1 114.8L301.5 113.7L299.6 113L297.8 112.7L296.1 112.9L294.8 113.5Z\"/><path class=\"iso-top\" d=\"M265.9 159.5L265.6 160.8L286.5 121.1L286.8 119.8ZM265.6 160.8L265.9 162.3L286.7 122.6L286.5 121.1ZM265.9 162.3L266.7 163.7L287.6 124.1L286.7 122.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M286.8 119.8L286.5 121.1M286.5 121.1L286.7 122.6M286.7 122.6L287.6 124.1M287.6 124.1L288.9 125.4M288.9 125.4L295.3 130.7M295.3 130.7L296.9 131.8M296.9 131.8L298.8 132.5M298.8 132.5L300.6 132.8M300.6 132.8L302.3 132.6M302.3 132.6L303.6 132M303.6 132L310.7 126.7M310.7 126.7L311.6 125.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M265.6 160.8L265.9 159.5L286.8 119.8L287.6 118.8L294.8 113.5L296.1 112.9L297.8 112.7L299.6 113L301.5 113.7L303.1 114.8L309.5 120.1L310.8 121.4L311.7 122.9L311.9 124.4L311.6 125.7L290.8 165.4L289.9 166.4L282.8 171.6L281.4 172.3L279.8 172.4L277.9 172.2L276.1 171.4L274.4 170.3L268 165.1L266.7 163.7L265.9 162.3Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M287 122.7L287 121.7L287.3 120.8L287.7 119.9L290.7 114.2L291.3 113.5L292.1 112.8L293 112.3L294 111.8L295.1 111.5L296.3 111.4L297.6 111.4L299 111.5L300.3 111.8L301.7 112.2L303.1 112.7L304.4 113.3L305.6 114.1L306.8 114.9L307.9 115.9L308.9 116.9L309.7 117.9L310.4 119L310.9 120.1L311.2 121.2L311.4 122.2L311.4 123.3L311.2 124.3L310.9 125.2L307.9 130.8L307.4 131.7L306.7 132.4L305.9 133L304.9 133.5L303.9 133.8L302.7 134.1L301.4 134.1L300.1 134.1L298.8 133.9L297.4 133.6L296 133.1L294.7 132.5L293.4 131.8L292.1 131L291 130.1L290 129.1L289.1 128.1L288.3 127.1L287.8 126L287.3 124.9L287 123.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M298.1 127L300.1 127.8L302.2 128.3L304.3 128.5L306.2 128.3L307.9 127.8L309.3 127L310.4 126L311.1 124.7L308.1 130.3L307.4 131.6L306.3 132.7L304.9 133.5L303.2 134L301.3 134.1L299.3 134L297.2 133.5L295.1 132.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M296.1 126L298.1 127L295.1 132.7L293.1 131.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M294.3 124.7L296.1 126L293.1 131.6L291.3 130.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M291.5 121.6L292.7 123.2L294.3 124.7L291.3 130.3L289.7 128.9L288.5 127.3ZM300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L300.7 119.9L292.1 112.8L293.5 112L295.2 111.5L297.1 111.4L299.1 111.5L301.2 112L303.3 112.8L305.3 113.9L307.1 115.2L308.7 116.6L309.9 118.2L310.8 119.9L311.3 121.6L311.4 123.2L311.1 124.7L310.4 126L309.3 127L307.9 127.8L306.2 128.3L304.3 128.5L302.2 128.3L300.1 127.8L298.1 127L296.1 126L294.3 124.7L292.7 123.2L291.5 121.6L290.6 119.9L290.1 118.3L290 116.7L290.3 115.2L291 113.9L292.1 112.8Z\"/><path class=\"iso-top\" d=\"M290.3 115.2L290 116.7L290.1 118.3L290.6 119.9L291.5 121.6L288.5 127.3L287.6 125.6L287.1 123.9L287 122.3L287.3 120.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M290.5 114.6L290.2 115.5L290 116.4L289.9 117.4L290.1 118.5L290.4 119.5L290.9 120.6L291.5 121.7L292.3 122.7L293.2 123.7L294.2 124.6L295.3 125.5L296.5 126.3L297.8 126.9L299.1 127.5L300.5 127.9L301.8 128.2L303.2 128.4L304.5 128.5L305.7 128.4L306.8 128.2L307.9 127.8L308.8 127.3L309.7 126.8L310.3 126.1L310.8 125.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M287 122.7L287 121.7L287.3 120.8L287.7 119.9L290.7 114.2L291.3 113.5L292.1 112.8L293 112.3L294 111.8L295.1 111.5L296.3 111.4L297.6 111.4L299 111.5L300.3 111.8L301.7 112.2L303.1 112.7L304.4 113.3L305.6 114.1L306.8 114.9L307.9 115.9L308.9 116.9L309.7 117.9L310.4 119L310.9 120.1L311.2 121.2L311.4 122.2L311.4 123.3L311.2 124.3L310.9 125.2L307.9 130.8L307.4 131.7L306.7 132.4L305.9 133L304.9 133.5L303.9 133.8L302.7 134.1L301.4 134.1L300.1 134.1L298.8 133.9L297.4 133.6L296 133.1L294.7 132.5L293.4 131.8L292.1 131L291 130.1L290 129.1L289.1 128.1L288.3 127.1L287.8 126L287.3 124.9L287 123.8Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M286.8 117.6L287.3 115.5L296.2 98.5L297.7 96.8L302.4 93.3L304.6 92.2L307.4 91.9L310.5 92.4L313.6 93.6L316.3 95.4L319.5 98.1L321.7 100.3L323.1 102.8L323.5 105.2L323 107.4L314.1 124.4L312.6 126.1L307.9 129.6L305.7 130.6L302.9 130.9L299.8 130.4L296.7 129.2L294 127.4L290.8 124.8L288.6 122.5L287.2 120.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M296.7 129.2L299.8 130.4L308.7 113.4L305.7 112.2ZM299.8 130.4L302.9 130.9L311.8 113.9L308.7 113.4ZM302.9 130.9L305.7 130.6L314.6 113.6L311.8 113.9ZM305.7 130.6L307.9 129.6L316.8 112.6L314.6 113.6ZM307.9 129.6L312.6 126.1L321.6 109.1L316.8 112.6ZM312.6 126.1L314.1 124.4L323 107.4L321.6 109.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M290.8 124.8L294 127.4L302.9 110.4L299.7 107.8ZM294 127.4L296.7 129.2L305.7 112.2L302.9 110.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M288.6 122.5L290.8 124.8L299.7 107.8L297.5 105.5ZM297.7 96.8L296.2 98.5L295.7 100.6L296.1 103.1L297.5 105.5L299.7 107.8L302.9 110.4L305.7 112.2L308.7 113.4L311.8 113.9L314.6 113.6L316.8 112.6L321.6 109.1L323 107.4L323.5 105.2L323.1 102.8L321.7 100.3L319.5 98.1L316.3 95.4L313.6 93.6L310.5 92.4L307.4 91.9L304.6 92.2L302.4 93.3Z\"/><path class=\"iso-top\" d=\"M287.3 115.5L286.8 117.6L295.7 100.6L296.2 98.5ZM286.8 117.6L287.2 120.1L296.1 103.1L295.7 100.6ZM287.2 120.1L288.6 122.5L297.5 105.5L296.1 103.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M296.2 98.5L295.7 100.6M295.7 100.6L296.1 103.1M296.1 103.1L297.5 105.5M297.5 105.5L299.7 107.8M299.7 107.8L302.9 110.4M302.9 110.4L305.7 112.2M305.7 112.2L308.7 113.4M308.7 113.4L311.8 113.9M311.8 113.9L314.6 113.6M314.6 113.6L316.8 112.6M316.8 112.6L321.6 109.1M321.6 109.1L323 107.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M286.8 117.6L287.3 115.5L296.2 98.5L297.7 96.8L302.4 93.3L304.6 92.2L307.4 91.9L310.5 92.4L313.6 93.6L316.3 95.4L319.5 98.1L321.7 100.3L323.1 102.8L323.5 105.2L323 107.4L314.1 124.4L312.6 126.1L307.9 129.6L305.7 130.6L302.9 130.9L299.8 130.4L296.7 129.2L294 127.4L290.8 124.8L288.6 122.5L287.2 120.1Z\"/></g></g></g><g class=\"rb-af rb-af-8\"><g data-paint=\"limb\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M264 161.1L264.3 160L277 114.5L277.9 113.5L285 108.2L286.4 107.6L288.1 107.3L290 107.4L291.9 107.9L293.7 108.7L300.5 112.9L301.9 114L302.8 115.3L303.2 116.6L302.9 117.8L290.1 163.2L289.3 164.2L282.1 169.5L280.8 170.2L279.1 170.4L277.1 170.3L275.2 169.8L273.5 169L266.7 164.8L265.3 163.7L264.3 162.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M275.2 169.8L277.1 170.3L289.9 124.9L288 124.4ZM277.1 170.3L279.1 170.4L291.8 125L289.9 124.9ZM279.1 170.4L280.8 170.2L293.6 124.7L291.8 125ZM280.8 170.2L282.1 169.5L294.9 124L293.6 124.7ZM282.1 169.5L289.3 164.2L302 118.7L294.9 124ZM289.3 164.2L290.1 163.2L302.9 117.8L302 118.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M266.7 164.8L273.5 169L286.2 123.5L279.4 119.3ZM273.5 169L275.2 169.8L288 124.4L286.2 123.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M265.3 163.7L266.7 164.8L279.4 119.3L278 118.2ZM277.9 113.5L277 114.5L276.8 115.7L277.1 117L278 118.2L279.4 119.3L286.2 123.5L288 124.4L289.9 124.9L291.8 125L293.6 124.7L294.9 124L302 118.7L302.9 117.8L303.2 116.6L302.8 115.3L301.9 114L300.5 112.9L293.7 108.7L291.9 107.9L290 107.4L288.1 107.3L286.4 107.6L285 108.2Z\"/><path class=\"iso-top\" d=\"M264.3 160L264 161.1L276.8 115.7L277 114.5ZM264 161.1L264.3 162.4L277.1 117L276.8 115.7ZM264.3 162.4L265.3 163.7L278 118.2L277.1 117Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M277 114.5L276.8 115.7M276.8 115.7L277.1 117M277.1 117L278 118.2M278 118.2L279.4 119.3M279.4 119.3L286.2 123.5M286.2 123.5L288 124.4M288 124.4L289.9 124.9M289.9 124.9L291.8 125M291.8 125L293.6 124.7M293.6 124.7L294.9 124M294.9 124L302 118.7M302 118.7L302.9 117.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M264 161.1L264.3 160L277 114.5L277.9 113.5L285 108.2L286.4 107.6L288.1 107.3L290 107.4L291.9 107.9L293.7 108.7L300.5 112.9L301.9 114L302.8 115.3L303.2 116.6L302.9 117.8L290.1 163.2L289.3 164.2L282.1 169.5L280.8 170.2L279.1 170.4L277.1 170.3L275.2 169.8L273.5 169L266.7 164.8L265.3 163.7L264.3 162.4Z\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M277.8 117.7L277.9 116.8L278.1 115.9L279.9 109.4L280.4 108.6L280.9 107.9L281.7 107.2L282.6 106.6L283.6 106.2L284.8 105.8L286 105.6L287.3 105.5L288.7 105.5L290.2 105.6L291.6 105.9L293 106.2L294.4 106.7L295.7 107.3L297 107.9L298.1 108.7L299.2 109.5L300.1 110.4L300.8 111.3L301.4 112.2L301.8 113.2L302 114.1L302.1 115L301.9 115.9L300.1 122.4L299.8 123.3L299.3 124L298.6 124.7L297.8 125.3L296.8 125.9L295.7 126.3L294.5 126.5L293.3 126.7L291.9 126.8L290.5 126.7L289 126.5L287.6 126.2L286.2 125.8L284.8 125.3L283.5 124.7L282.3 123.9L281.2 123.2L280.3 122.3L279.5 121.4L278.8 120.5L278.3 119.6L278 118.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M288.5 119.4L290.6 120L292.8 120.3L294.9 120.2L296.9 119.9L298.6 119.4L300.1 118.6L301.1 117.5L301.8 116.3L300 122.8L299.3 124L298.2 125L296.8 125.9L295.1 126.4L293.1 126.7L291 126.7L288.8 126.5L286.6 125.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M286.4 118.7L288.5 119.4L286.6 125.9L284.5 125.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M284.5 117.6L286.4 118.7L284.5 125.1L282.6 124.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M281.4 115.1L282.8 116.4L284.5 117.6L282.6 124.1L281 122.9L279.6 121.6ZM290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L290.9 112.9L281.7 107.2L283.1 106.4L284.8 105.8L286.8 105.5L288.9 105.5L291.1 105.8L293.3 106.3L295.4 107.1L297.3 108.1L299 109.3L300.3 110.7L301.3 112.1L301.9 113.5L302.1 115L301.8 116.3L301.1 117.5L300.1 118.6L298.6 119.4L296.9 119.9L294.9 120.2L292.8 120.3L290.6 120L288.5 119.4L286.4 118.7L284.5 117.6L282.8 116.4L281.4 115.1L280.4 113.7L279.8 112.2L279.7 110.8L279.9 109.5L280.6 108.2L281.7 107.2Z\"/><path class=\"iso-top\" d=\"M279.9 109.5L279.7 110.8L279.8 112.2L280.4 113.7L281.4 115.1L279.6 121.6L278.6 120.2L278 118.7L277.8 117.3L278.1 116Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M279.8 109.8L279.7 110.6L279.7 111.5L279.9 112.5L280.3 113.4L280.8 114.3L281.5 115.2L282.4 116.1L283.4 116.9L284.5 117.6L285.7 118.3L287 118.9L288.3 119.4L289.7 119.8L291.1 120.1L292.5 120.2L293.9 120.3L295.2 120.2L296.5 120L297.6 119.7L298.7 119.3L299.6 118.8L300.5 118.2L301.1 117.6L301.6 116.8L301.9 116\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M277.8 117.7L277.9 116.8L278.1 115.9L279.9 109.4L280.4 108.6L280.9 107.9L281.7 107.2L282.6 106.6L283.6 106.2L284.8 105.8L286 105.6L287.3 105.5L288.7 105.5L290.2 105.6L291.6 105.9L293 106.2L294.4 106.7L295.7 107.3L297 107.9L298.1 108.7L299.2 109.5L300.1 110.4L300.8 111.3L301.4 112.2L301.8 113.2L302 114.1L302.1 115L301.9 115.9L300.1 122.4L299.8 123.3L299.3 124L298.6 124.7L297.8 125.3L296.8 125.9L295.7 126.3L294.5 126.5L293.3 126.7L291.9 126.8L290.5 126.7L289 126.5L287.6 126.2L286.2 125.8L284.8 125.3L283.5 124.7L282.3 123.9L281.2 123.2L280.3 122.3L279.5 121.4L278.8 120.5L278.3 119.6L278 118.6Z\"/></g></g><g data-paint=\"hand\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M276.4 111.9L276.9 110L282.3 90.5L283.8 88.9L288.5 85.3L290.8 84.2L293.6 83.7L296.8 83.9L300 84.8L303 86.2L306.4 88.3L308.7 90.1L310.2 92.2L310.8 94.3L310.4 96.3L304.9 115.8L303.5 117.4L298.7 120.9L296.5 122L293.6 122.5L290.4 122.3L287.2 121.5L284.3 120.1L280.9 118L278.5 116.2L277 114.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M287.2 121.5L290.4 122.3L295.9 102.9L292.6 102ZM290.4 122.3L293.6 122.5L299.1 103L295.9 102.9ZM293.6 122.5L296.5 122L301.9 102.6L299.1 103ZM296.5 122L298.7 120.9L304.2 101.5L301.9 102.6ZM298.7 120.9L303.5 117.4L308.9 97.9L304.2 101.5ZM303.5 117.4L304.9 115.8L310.4 96.3L308.9 97.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M280.9 118L284.3 120.1L289.7 100.6L286.3 98.5ZM284.3 120.1L287.2 121.5L292.6 102L289.7 100.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M278.5 116.2L280.9 118L286.3 98.5L284 96.7ZM283.8 88.9L282.3 90.5L281.9 92.4L282.5 94.6L284 96.7L286.3 98.5L289.7 100.6L292.6 102L295.9 102.9L299.1 103L301.9 102.6L304.2 101.5L308.9 97.9L310.4 96.3L310.8 94.3L310.2 92.2L308.7 90.1L306.4 88.3L303 86.2L300 84.8L296.8 83.9L293.6 83.7L290.8 84.2L288.5 85.3Z\"/><path class=\"iso-top\" d=\"M276.9 110L276.4 111.9L281.9 92.4L282.3 90.5ZM276.4 111.9L277 114.1L282.5 94.6L281.9 92.4ZM277 114.1L278.5 116.2L284 96.7L282.5 94.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M282.3 90.5L281.9 92.4M281.9 92.4L282.5 94.6M282.5 94.6L284 96.7M284 96.7L286.3 98.5M286.3 98.5L289.7 100.6M289.7 100.6L292.6 102M292.6 102L295.9 102.9M295.9 102.9L299.1 103M299.1 103L301.9 102.6M301.9 102.6L304.2 101.5M304.2 101.5L308.9 97.9M308.9 97.9L310.4 96.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M276.4 111.9L276.9 110L282.3 90.5L283.8 88.9L288.5 85.3L290.8 84.2L293.6 83.7L296.8 83.9L300 84.8L303 86.2L306.4 88.3L308.7 90.1L310.2 92.2L310.8 94.3L310.4 96.3L304.9 115.8L303.5 117.4L298.7 120.9L296.5 122L293.6 122.5L290.4 122.3L287.2 121.5L284.3 120.1L280.9 118L278.5 116.2L277 114.1Z\"/></g></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M255.4 170.3L255.5 169.1L255.7 167.9L256 166.7L256.5 165.7L257 164.7L257.7 163.9L258.5 163.1L275.1 150.8L276 150.2L277 149.7L278.1 149.4L279.2 149.2L280.3 149.2L281.5 149.3L282.8 149.5L284 149.9L285.2 150.4L286.4 151.1L287.6 151.8L288.8 152.7L289.9 153.7L290.9 154.8L291.8 156L292.6 157.2L293.4 158.5L294 159.8L294.5 161.2L294.9 162.5L295.2 163.9L295.3 165.2L295.3 166.5L295.2 167.7L294.9 168.9L294.5 170L294 171L293.4 171.9L292.6 172.7L291.8 173.4L275.2 185.7L274.2 186.2L273.2 186.6L272.1 186.9L271 187L269.8 187L268.6 186.8L267.4 186.5L266.1 186.1L264.9 185.5L263.7 184.8L262.5 183.9L261.4 183L260.4 181.9L259.4 180.8L258.5 179.6L257.7 178.4L257 177L256.5 175.7L256 174.3L255.7 173L255.5 171.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M293.4 158.4L294.4 160.9L295.1 163.4L295.3 165.8L295.1 168.1L294.4 170.2L293.4 171.9L291.9 173.3L275.3 185.6L276.7 184.3L277.8 182.5L278.5 180.5L278.7 178.2L278.5 175.7L277.8 173.2L276.7 170.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M291.9 156.1L293.4 158.4L276.7 170.8L275.3 168.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M290.1 154L291.9 156.1L275.3 168.4L273.5 166.3ZM255.4 170.3L255.6 168L256.3 166L257.4 164.2L258.8 162.9L260.6 162L262.6 161.5L264.8 161.6L267.1 162.1L269.3 163.1L271.5 164.5L273.5 166.3L275.3 168.4L276.7 170.8L277.8 173.2L278.5 175.7L278.7 178.2L278.5 180.5L277.8 182.5L276.7 184.3L275.3 185.6L273.5 186.5L271.5 187L269.3 186.9L267.1 186.4L264.8 185.4L262.6 184L260.6 182.2L258.8 180.1L257.4 177.7L256.3 175.3L255.6 172.8L255.4 170.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3L267.1 174.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M286 150.8L288.1 152.2L290.1 154L273.5 166.3L271.5 164.5L269.3 163.1Z\"/><path class=\"iso-top\" d=\"M275.5 150.6L277.2 149.6L279.2 149.2L281.4 149.2L283.7 149.8L286 150.8L269.3 163.1L267.1 162.1L264.8 161.6L262.6 161.5L260.6 162L258.8 162.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M258.7 163L259.6 162.4L260.6 162L261.6 161.7L262.7 161.5L263.9 161.5L265.1 161.6L266.3 161.9L267.5 162.3L268.7 162.8L269.9 163.4L271 164.2L272.2 165.1L273.2 166L274.2 167.1L275.1 168.3L276 169.5L276.7 170.7L277.3 172L277.8 173.4L278.2 174.7L278.5 176L278.7 177.3L278.7 178.6L278.6 179.8L278.3 181L278 182.1L277.5 183.1L276.9 184L276.2 184.8L275.4 185.5\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M255.4 170.3L255.5 169.1L255.7 167.9L256 166.7L256.5 165.7L257 164.7L257.7 163.9L258.5 163.1L275.1 150.8L276 150.2L277 149.7L278.1 149.4L279.2 149.2L280.3 149.2L281.5 149.3L282.8 149.5L284 149.9L285.2 150.4L286.4 151.1L287.6 151.8L288.8 152.7L289.9 153.7L290.9 154.8L291.8 156L292.6 157.2L293.4 158.5L294 159.8L294.5 161.2L294.9 162.5L295.2 163.9L295.3 165.2L295.3 166.5L295.2 167.7L294.9 168.9L294.5 170L294 171L293.4 171.9L292.6 172.7L291.8 173.4L275.2 185.7L274.2 186.2L273.2 186.6L272.1 186.9L271 187L269.8 187L268.6 186.8L267.4 186.5L266.1 186.1L264.9 185.5L263.7 184.8L262.5 183.9L261.4 183L260.4 181.9L259.4 180.8L258.5 179.6L257.7 178.4L257 177L256.5 175.7L256 174.3L255.7 173L255.5 171.6Z\"/></g></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M194.3 121L194.4 119.2L195.3 117.5L197 115.9L199.3 114.5L202.1 113.5L205.4 112.7L208.9 112.4L212.5 112.5L215.9 112.9L219.1 113.7L221.8 114.9L223.9 116.3L225.4 118L226.1 119.7L226.1 130.7L226 132.5L225.1 134.3L223.4 135.8L221.1 137.2L218.2 138.3L215 139L211.5 139.3L207.9 139.3L204.4 138.8L201.3 138L198.6 136.8L196.4 135.4L195 133.8L194.3 132Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M223.4 135.8L221.1 137.2L221.1 126.2L223.4 124.8ZM221.1 137.2L218.2 138.3L218.2 127.2L221.1 126.2ZM226.1 130.7L226 132.5L226 121.5L226.1 119.7ZM226 132.5L225.1 134.3L225.1 123.2L226 121.5ZM225.1 134.3L223.4 135.8L223.4 124.8L225.1 123.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M218.2 138.3L215 139L215 127.9L218.2 127.2ZM215 139L211.5 139.3L211.5 128.3L215 127.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M211.5 139.3L207.9 139.3L207.9 128.2L211.5 128.3ZM207.9 139.3L204.4 138.8L204.4 127.8L207.9 128.2ZM204.4 138.8L201.3 138L201.3 126.9L204.4 127.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M201.3 138L198.6 136.8L198.6 125.8L201.3 126.9ZM198.6 136.8L196.4 135.4L196.4 124.4L198.6 125.8ZM196.4 135.4L195 133.8L195 122.7L196.4 124.4ZM195 133.8L194.3 132L194.3 121L195 122.7Z\"/><path class=\"iso-top\" d=\"M223.4 124.8L221.1 126.2L218.2 127.2L215 127.9L211.5 128.3L207.9 128.2L204.4 127.8L201.3 126.9L198.6 125.8L196.4 124.4L195 122.7L194.3 121L194.4 119.2L195.3 117.5L197 115.9L199.3 114.5L202.1 113.5L205.4 112.7L208.9 112.4L212.5 112.5L215.9 112.9L219.1 113.7L221.8 114.9L223.9 116.3L225.4 118L226.1 119.7L226 121.5L225.1 123.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M226.1 119.7L226 121.5L225.1 123.2L223.4 124.8L221.1 126.2L218.2 127.2L215 127.9L211.5 128.3L207.9 128.2L204.4 127.8L201.3 126.9L198.6 125.8L196.4 124.4L195 122.7L194.3 121\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M194.3 121L194.4 119.2L195.3 117.5L197 115.9L199.3 114.5L202.1 113.5L205.4 112.7L208.9 112.4L212.5 112.5L215.9 112.9L219.1 113.7L221.8 114.9L223.9 116.3L225.4 118L226.1 119.7M226.1 130.7L226 132.5L225.1 134.3L223.4 135.8L221.1 137.2L218.2 138.3L215 139L211.5 139.3L207.9 139.3L204.4 138.8L201.3 138L198.6 136.8L196.4 135.4L195 133.8L194.3 132M194.3 121L194.3 132M226.1 119.7L226.1 130.7\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M153.7 68.9L154.2 68.2L167.5 58.3L168.7 57.8L170.2 57.6L171.6 57.9L172 58L173 58.6L173.3 59.3L173.3 85.1L172.8 85.8L159.5 95.7L158.3 96.2L156.8 96.4L155.4 96.1L155 96L154 95.4L153.7 94.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M173.3 85.1L172.8 85.8L172.8 60.1L173.3 59.3ZM172.8 85.8L159.5 95.7L159.5 69.9L172.8 60.1ZM159.5 95.7L158.3 96.2L158.3 70.4L159.5 69.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M158.3 96.2L156.8 96.4L156.8 70.6L158.3 70.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M156.8 96.4L155.4 96.1L155.4 70.3L156.8 70.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M155.4 96.1L155 96L155 70.2L155.4 70.3ZM155 96L154 95.4L154 69.6L155 70.2ZM154 95.4L153.7 94.6L153.7 68.9L154 69.6Z\"/><path class=\"iso-top\" d=\"M172 58L173 58.6L173.3 59.3L172.8 60.1L159.5 69.9L158.3 70.4L156.8 70.6L155.4 70.3L155 70.2L154 69.6L153.7 68.9L154.2 68.2L167.5 58.3L168.7 57.8L170.2 57.6L171.6 57.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M173.3 59.3L172.8 60.1L159.5 69.9L158.3 70.4L156.8 70.6L155.4 70.3L155 70.2L154 69.6L153.7 68.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M173.3 59.3L172 59.9L158.9 69.7L158 70.1L156.9 70.2L155.7 70L155.6 69.9L154.8 69.4L153.7 68.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M153.7 68.9L154.2 68.2L167.5 58.3L168.7 57.8L170.2 57.6L171.6 57.9L172 58L173 58.6L173.3 59.3M173.3 85.1L172.8 85.8L159.5 95.7L158.3 96.2L156.8 96.4L155.4 96.1L155 96L154 95.4L153.7 94.6M173.3 59.3L173.3 85.1M153.7 68.9L153.7 94.6\"/></g></g><g data-paint=\"head\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M152.6 56.3L152.7 54.4L153.7 52.5L155.4 50.8L176.8 35L179.3 33.5L182.4 32.4L185.8 31.6L189.6 31.3L193.4 31.3L197.1 31.8L200.4 32.7L260.3 52.9L263.2 54.1L265.5 55.7L267.1 57.4L267.8 59.3L267.8 121.8L267.7 123.7L266.7 125.6L264.9 127.3L243.5 143.1L241.1 144.6L238 145.7L234.5 146.5L230.8 146.8L227 146.8L223.3 146.3L219.9 145.4L160 125.2L157.1 124L154.9 122.5L153.3 120.7L152.6 118.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M267.8 121.8L267.7 123.7L267.7 61.2L267.8 59.3ZM267.7 123.7L266.7 125.6L266.7 63L267.7 61.2ZM266.7 125.6L264.9 127.3L264.9 64.7L266.7 63ZM264.9 127.3L243.5 143.1L243.5 80.6L264.9 64.7ZM243.5 143.1L241.1 144.6L241.1 82L243.5 80.6ZM241.1 144.6L238 145.7L238 83.1L241.1 82Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M238 145.7L234.5 146.5L234.5 83.9L238 83.1ZM234.5 146.5L230.8 146.8L230.8 84.3L234.5 83.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M230.8 146.8L227 146.8L227 84.2L230.8 84.3ZM227 146.8L223.3 146.3L223.3 83.7L227 84.2ZM223.3 146.3L219.9 145.4L219.9 82.8L223.3 83.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M219.9 145.4L160 125.2L160 62.6L219.9 82.8ZM160 125.2L157.1 124L157.1 61.4L160 62.6ZM157.1 124L154.9 122.5L154.9 59.9L157.1 61.4ZM154.9 122.5L153.3 120.7L153.3 58.1L154.9 59.9ZM153.3 120.7L152.6 118.8L152.6 56.3L153.3 58.1Z\"/><path class=\"iso-top\" d=\"M260.3 52.9L263.2 54.1L265.5 55.7L267.1 57.4L267.8 59.3L267.7 61.2L266.7 63L264.9 64.7L243.5 80.6L241.1 82L238 83.1L234.5 83.9L230.8 84.3L227 84.2L223.3 83.7L219.9 82.8L160 62.6L157.1 61.4L154.9 59.9L153.3 58.1L152.6 56.3L152.7 54.4L153.7 52.5L155.4 50.8L176.8 35L179.3 33.5L182.4 32.4L185.8 31.6L189.6 31.3L193.4 31.3L197.1 31.8L200.4 32.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M267.8 59.3L267.7 61.2L266.7 63L264.9 64.7L243.5 80.6L241.1 82L238 83.1L234.5 83.9L230.8 84.3L227 84.2L223.3 83.7L219.9 82.8L160 62.6L157.1 61.4L154.9 59.9L153.3 58.1L152.6 56.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M267.8 59.3L264.3 60.9L263.5 62.4L262 63.8L240.8 79.5L238.7 80.8L236.3 81.7L233.5 82.3L230.5 82.6L227.5 82.5L224.5 82.1L221.7 81.4L162.1 61.3L159.6 60.2L157.8 59L156.6 57.6L152.6 56.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M152.6 56.3L152.7 54.4L153.7 52.5L155.4 50.8L176.8 35L179.3 33.5L182.4 32.4L185.8 31.6L189.6 31.3L193.4 31.3L197.1 31.8L200.4 32.7L260.3 52.9L263.2 54.1L265.5 55.7L267.1 57.4L267.8 59.3M267.8 121.8L267.7 123.7L266.7 125.6L264.9 127.3L243.5 143.1L241.1 144.6L238 145.7L234.5 146.5L230.8 146.8L227 146.8L223.3 146.3L219.9 145.4L160 125.2L157.1 124L154.9 122.5L153.3 120.7L152.6 118.8M267.8 59.3L267.8 121.8M152.6 56.3L152.6 118.8\"/></g></g><g data-paint=\"face\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M153.5 71.4L153.5 71.1L153.8 70.8L154.3 70.5L154.9 70.4L155.5 70.4L156.2 70.5L223.8 93.4L224.3 93.6L224.5 93.9L224.5 138.1L224.5 138.4L224.3 138.7L223.8 138.9L223.2 139.1L222.5 139.1L221.9 138.9L154.3 116.1L153.8 115.9L153.5 115.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M224.5 138.1L224.5 138.4L224.5 94.2L224.5 93.9ZM224.5 138.4L224.3 138.7L224.3 94.5L224.5 94.2ZM224.3 138.7L223.8 138.9L223.8 94.8L224.3 94.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M223.8 138.9L223.2 139.1L223.2 94.9L223.8 94.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M223.2 139.1L222.5 139.1L222.5 94.9L223.2 94.9ZM222.5 139.1L221.9 138.9L221.9 94.8L222.5 94.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M221.9 138.9L154.3 116.1L154.3 71.9L221.9 94.8ZM154.3 116.1L153.8 115.9L153.8 71.7L154.3 71.9ZM153.8 115.9L153.5 115.6L153.5 71.4L153.8 71.7Z\"/><path class=\"iso-top\" d=\"M223.8 93.4L224.3 93.6L224.5 93.9L224.5 94.2L224.3 94.5L224.3 94.5L223.8 94.8L223.2 94.9L222.5 94.9L221.9 94.8L154.3 71.9L153.8 71.7L153.5 71.4L153.5 71.1L153.8 70.8L153.8 70.8L154.3 70.5L154.9 70.4L155.5 70.4L156.2 70.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M224.5 93.9L224.5 94.2L224.3 94.5M224.3 94.5L223.8 94.8L223.2 94.9L222.5 94.9L221.9 94.8L154.3 71.9L153.8 71.7L153.5 71.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M224.5 93.9L223.7 94.1L224.3 94.5M224.3 94.5L223.3 94.4L223 94.5L222.7 94.5L222.3 94.4L154.8 71.6L154.5 71.5L153.5 71.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M224.3 94.5L224.3 94.5M153.5 71.4L153.5 71.1L153.8 70.8L153.8 70.8L154.3 70.5L154.9 70.4L155.5 70.4L156.2 70.5L223.8 93.4L224.3 93.6L224.5 93.9M224.5 138.1L224.5 138.4L224.3 138.7M224.3 138.7L223.8 138.9L223.2 139.1L222.5 139.1L221.9 138.9L154.3 116.1L153.8 115.9L153.5 115.6M224.5 93.9L224.5 138.1M224.3 94.5L224.3 138.7M224.3 94.5L224.3 138.7M153.5 71.4L153.5 115.6\"/></g></g><g class=\"rb-eye rb-eye-l\" style=\"transform-origin:173.1px 96.7px\"><g data-paint=\"eye\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M166.2 88.1L166.2 87.9L166.3 87.7L166.6 87.6L167 87.5L167.4 87.5L167.8 87.6L178.4 91.1L178.7 91.3L178.8 91.5L178.8 106.2L178.8 106.4L178.7 106.6L178.4 106.7L178 106.8L177.6 106.8L177.2 106.7L166.6 103.2L166.3 103L166.2 102.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M178.8 106.2L178.8 106.4L178.8 91.7L178.8 91.5ZM178.8 106.4L178.7 106.6L178.7 91.9L178.8 91.7ZM178.7 106.6L178.4 106.7L178.4 92L178.7 91.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M178.4 106.7L178 106.8L178 92.1L178.4 92Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M178 106.8L177.6 106.8L177.6 92.1L178 92.1ZM177.6 106.8L177.2 106.7L177.2 92L177.6 92.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M177.2 106.7L166.6 103.2L166.6 88.4L177.2 92ZM166.6 103.2L166.3 103L166.3 88.3L166.6 88.4ZM166.3 103L166.2 102.8L166.2 88.1L166.3 88.3Z\"/><path class=\"iso-top\" d=\"M178.4 91.1L178.7 91.3L178.8 91.5L178.8 91.7L178.7 91.9L178.7 91.9L178.4 92L178 92.1L177.6 92.1L177.2 92L166.6 88.4L166.3 88.3L166.2 88.1L166.2 87.9L166.3 87.7L166.3 87.7L166.6 87.6L167 87.5L167.4 87.5L167.8 87.6Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M178.7 91.9L178.7 91.9M166.2 88.1L166.2 87.9L166.3 87.7L166.3 87.7L166.6 87.6L167 87.5L167.4 87.5L167.8 87.6L178.4 91.1L178.7 91.3L178.8 91.5M178.8 106.2L178.8 106.4L178.7 106.6M178.7 106.6L178.4 106.7L178 106.8L177.6 106.8L177.2 106.7L166.6 103.2L166.3 103L166.2 102.8M178.8 91.5L178.8 106.2M178.7 91.9L178.7 106.6M178.7 91.9L178.7 106.6M166.2 88.1L166.2 102.8\"/></g></g></g><g class=\"rb-eye rb-eye-r\" style=\"transform-origin:203.1px 106.8px\"><g data-paint=\"eye\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M196.1 98.2L196.1 98L196.3 97.8L196.6 97.7L197 97.6L197.4 97.6L197.8 97.7L208.3 101.2L208.6 101.4L208.8 101.6L208.8 116.3L208.8 116.5L208.6 116.7L208.3 116.8L208 116.9L207.5 116.9L207.2 116.8L196.6 113.3L196.3 113.1L196.1 112.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M208.8 116.3L208.8 116.5L208.8 101.8L208.8 101.6ZM208.8 116.5L208.6 116.7L208.6 102L208.8 101.8ZM208.6 116.7L208.3 116.8L208.3 102.1L208.6 102Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M208.3 116.8L208 116.9L208 102.2L208.3 102.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M208 116.9L207.5 116.9L207.5 102.2L208 102.2ZM207.5 116.9L207.2 116.8L207.2 102.1L207.5 102.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M207.2 116.8L196.6 113.3L196.6 98.5L207.2 102.1ZM196.6 113.3L196.3 113.1L196.3 98.4L196.6 98.5ZM196.3 113.1L196.1 112.9L196.1 98.2L196.3 98.4Z\"/><path class=\"iso-top\" d=\"M208.3 101.2L208.6 101.4L208.8 101.6L208.8 101.8L208.6 102L208.6 102L208.3 102.1L208 102.2L207.5 102.2L207.2 102.1L196.6 98.5L196.3 98.4L196.1 98.2L196.1 98L196.3 97.8L196.3 97.8L196.6 97.7L197 97.6L197.4 97.6L197.8 97.7Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M208.6 102L208.6 102M196.1 98.2L196.1 98L196.3 97.8L196.3 97.8L196.6 97.7L197 97.6L197.4 97.6L197.8 97.7L208.3 101.2L208.6 101.4L208.8 101.6M208.8 116.3L208.8 116.5L208.6 116.7M208.6 116.7L208.3 116.8L208 116.9L207.5 116.9L207.2 116.8L196.6 113.3L196.3 113.1L196.1 112.9M208.8 101.6L208.8 116.3M208.6 102L208.6 116.7M208.6 102L208.6 116.7M196.1 98.2L196.1 112.9\"/></g></g></g><g data-paint=\"mouth\"><path class=\"iso-line\" data-tone=\"hi\" d=\"M177.5 113.8L198.7 121\"/></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M247.1 100.4L247.6 99.6L260.9 89.8L262 89.3L263.6 89.1L265 89.4L265.4 89.5L266.4 90.1L266.7 90.8L266.7 116.6L266.2 117.3L252.9 127.2L251.7 127.7L250.2 127.8L248.7 127.6L248.4 127.5L247.4 126.9L247.1 126.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M266.7 116.6L266.2 117.3L266.2 91.6L266.7 90.8ZM266.2 117.3L252.9 127.2L252.9 101.4L266.2 91.6ZM252.9 127.2L251.7 127.7L251.7 101.9L252.9 101.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M251.7 127.7L250.2 127.8L250.2 102.1L251.7 101.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M250.2 127.8L248.7 127.6L248.7 101.8L250.2 102.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M248.7 127.6L248.4 127.5L248.4 101.7L248.7 101.8ZM248.4 127.5L247.4 126.9L247.4 101.1L248.4 101.7ZM247.4 126.9L247.1 126.1L247.1 100.4L247.4 101.1Z\"/><path class=\"iso-top\" d=\"M265.4 89.5L266.4 90.1L266.7 90.8L266.2 91.6L252.9 101.4L251.7 101.9L250.2 102.1L248.7 101.8L248.4 101.7L247.4 101.1L247.1 100.4L247.6 99.6L260.9 89.8L262 89.3L263.6 89.1L265 89.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M266.7 90.8L266.2 91.6L252.9 101.4L251.7 101.9L250.2 102.1L248.7 101.8L248.4 101.7L247.4 101.1L247.1 100.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M266.7 90.8L265.4 91.4L252.2 101.1L251.3 101.5L250.2 101.7L249.1 101.4L248.9 101.4L248.1 100.9L247.1 100.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M247.1 100.4L247.6 99.6L260.9 89.8L262 89.3L263.6 89.1L265 89.4L265.4 89.5L266.4 90.1L266.7 90.8M266.7 116.6L266.2 117.3L252.9 127.2L251.7 127.7L250.2 127.8L248.7 127.6L248.4 127.5L247.4 126.9L247.1 126.1M266.7 90.8L266.7 116.6M247.1 100.4L247.1 126.1\"/></g></g><g data-paint=\"frame\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M209.4 30.5L209.4 29.9L209.9 29.4L210.8 28.9L212 28.7L213.2 28.7L214.3 28.9L215.2 29.4L215.7 29.9L215.7 55.7L215.7 56.3L215.2 56.9L214.3 57.3L213.2 57.6L211.9 57.6L210.8 57.3L209.9 56.9L209.4 56.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M215.2 56.9L214.3 57.3L214.3 31.6L215.2 31.1ZM215.7 55.7L215.7 56.3L215.7 30.6L215.7 29.9ZM215.7 56.3L215.2 56.9L215.2 31.1L215.7 30.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M214.3 57.3L213.2 57.6L213.2 31.8L214.3 31.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M213.2 57.6L211.9 57.6L211.9 31.8L213.2 31.8ZM211.9 57.6L210.8 57.3L210.8 31.6L211.9 31.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M210.8 57.3L209.9 56.9L209.9 31.1L210.8 31.6ZM209.9 56.9L209.4 56.3L209.4 30.5L209.9 31.1Z\"/><path class=\"iso-top\" d=\"M215.2 31.1L214.3 31.6L213.2 31.8L211.9 31.8L210.8 31.6L209.9 31.1L209.4 30.5L209.4 29.9L209.9 29.4L210.8 28.9L212 28.7L213.2 28.7L214.3 28.9L215.2 29.4L215.7 29.9L215.7 30.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M215.7 29.9L215.7 30.6L215.2 31.1L214.3 31.6L213.2 31.8L211.9 31.8L210.8 31.6L209.9 31.1L209.4 30.5\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M209.4 30.5L209.4 29.9L209.9 29.4L210.8 28.9L212 28.7L213.2 28.7L214.3 28.9L215.2 29.4L215.7 29.9M215.7 55.7L215.7 56.3L215.2 56.9L214.3 57.3L213.2 57.6L211.9 57.6L210.8 57.3L209.9 56.9L209.4 56.3M209.4 30.5L209.4 56.3M215.7 29.9L215.7 55.7\"/></g></g><g class=\"rb-ant\"><g data-paint=\"ant\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M205.3 17.5L205.6 16.4L206.6 15.3L208.1 14.5L210.1 14L212.3 13.8L214.6 13.9L216.6 14.4L218.3 15.1L219.4 16.1L219.8 17.2L219.8 30.1L219.5 31.2L218.6 32.3L217 33.1L215 33.6L212.8 33.9L210.6 33.7L208.5 33.2L206.9 32.5L205.8 31.5L205.3 30.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M218.6 32.3L217 33.1L217 20.2L218.6 19.4ZM219.8 30.1L219.5 31.2L219.5 18.4L219.8 17.2ZM219.5 31.2L218.6 32.3L218.6 19.4L219.5 18.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M217 33.1L215 33.6L215 20.8L217 20.2ZM215 33.6L212.8 33.9L212.8 21L215 20.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M212.8 33.9L210.6 33.7L210.6 20.8L212.8 21ZM210.6 33.7L208.5 33.2L208.5 20.4L210.6 20.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M208.5 33.2L206.9 32.5L206.9 19.6L208.5 20.4ZM206.9 32.5L205.8 31.5L205.8 18.6L206.9 19.6ZM205.8 31.5L205.3 30.4L205.3 17.5L205.8 18.6Z\"/><path class=\"iso-top\" d=\"M218.6 19.4L217 20.2L215 20.8L212.8 21L210.6 20.8L208.5 20.4L206.9 19.6L205.8 18.6L205.3 17.5L205.6 16.4L206.6 15.3L208.1 14.5L210.1 14L212.3 13.8L214.6 13.9L216.6 14.4L218.3 15.1L219.4 16.1L219.8 17.2L219.5 18.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M219.8 17.2L219.5 18.4L218.6 19.4L217 20.2L215 20.8L212.8 21L210.6 20.8L208.5 20.4L206.9 19.6L205.8 18.6L205.3 17.5\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M205.3 17.5L205.6 16.4L206.6 15.3L208.1 14.5L210.1 14L212.3 13.8L214.6 13.9L216.6 14.4L218.3 15.1L219.4 16.1L219.8 17.2M219.8 30.1L219.5 31.2L218.6 32.3L217 33.1L215 33.6L212.8 33.9L210.6 33.7L208.5 33.2L206.9 32.5L205.8 31.5L205.3 30.4M205.3 17.5L205.3 30.4M219.8 17.2L219.8 30.1\"/></g></g></g></g></svg>","ar":0.9767};

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ: текст → части блока; склейка строк без тегов (как браузер).
// ─────────────────────────────────────────────────────────────────────────────
function markParts(text, frag, tag) {
  const i = frag ? text.indexOf(frag) : -1;
  if (i < 0) return [txt(text)];
  return [txt(text.slice(0, i)), { k: tag, v: frag }, txt(text.slice(i + frag.length))].filter((x) => x.v !== '');
}
const pb = (pick, id, tag, key) => blk(id, tag, pick(PAGE[key]));
function glue(lines) {
  const out = [];
  lines.forEach((b) => {
    const last = out[out.length - 1];
    if (!b.tag && last && !last.tag) out[out.length - 1] = { id: last.id, tag: null, parts: last.parts.concat([txt(' ')], b.parts) };
    else out.push(b);
  });
  return out;
}
const okText = (s) => hasLetters(s) && !hasTags(s);
const nonEmpty = (parts) => parts.filter((x) => x.v !== '');
// Полная страница Пикселя (крючок, «как надо»).
function demoPage(pick) {
  return [pb(pick, 'name', 'h1', 'name'), pb(pick, 'welcome', 'p', 'welcome'), pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'),
    pb(pick, 'round', 'h3', 'round'), blk('roundP', 'p', markParts(pick(PAGE.roundP), pick(PAGE.roundB), 'b')),
    blk('thoughtP', 'p', markParts(pick(PAGE.thoughtP), pick(PAGE.thoughtI), 'i')), pb(pick, 'news', 'h2', 'news'), pb(pick, 'newsP', 'p', 'newsP')];
}
// Та же страница «стеной»: всё одним текстом.
const lumpPage = (pick) => [blk('lump', null, demoPage(pick).map(plain).join(' '))];

// ─────────────────────────────────────────────────────────────────────────────
// УЧЁТ. Статистика экрана в store 'st:<id>' (не стирается «Повторить»):
//   rounds — обязательные раунды; stages[k] = { misses, hint, done };
//   дополнительный пример раунда k — stages[k + 'x'].
// Ряд журнала: done — всё выполнено; correct — каждый раунд решён без промахов и
// без третьей ступени подсказки, либо после неё дополнительный пример решён
// без промахов; firstTry — без промахов и подсказок; helped / strongHelp.
// ─────────────────────────────────────────────────────────────────────────────
function statRow(id, s) {
  const st = s.stages || {};
  const rounds = s.rounds || [];
  const one = (k) => st[k] || { misses: 0, hint: 0, done: false };
  const clean = (g, maxHint) => !!(g && g.done && g.misses === 0 && (g.hint || 0) < maxHint);
  const roundOk = (k) => one(k).done && (clean(one(k), 3) || clean(st[k + 'x'], 2));
  const done = rounds.every((k) => one(k).done && (!st[k + 'x'] || st[k + 'x'].done));
  const keys = Object.keys(st);
  const hints = keys.reduce((n, k) => n + (st[k].hint || 0), 0);
  return {
    screenId: id, type: s.type, done, correct: done && rounds.every(roundOk),
    firstTry: done && rounds.every((k) => one(k).misses === 0 && !one(k).hint),
    attempts: rounds.reduce((n, k) => n + one(k).misses + (one(k).done ? 1 : 0), 0),
    hints, helped: hints > 0, strongHelp: keys.some((k) => (st[k].hint || 0) >= 3), stages: st
  };
}
function useStat(id, type, rounds) {
  const store = useStore();
  const log = useLog();
  return useMemo(() => {
    const write = (fn) => {
      const cur = store.get('st:' + id);
      const s = cur ? JSON.parse(JSON.stringify(cur)) : { stages: {} };
      s.type = type; s.rounds = rounds;
      fn(s);
      store.set('st:' + id, s);
      log(statRow(id, s));
      return s;
    };
    const g = (s, k) => s.stages[k] || (s.stages[k] = { misses: 0, hint: 0, done: false });
    return {
      miss: (k) => write((s) => { g(s, k).misses += 1; }),
      hint: (k, lv) => write((s) => { const x = g(s, k); x.hint = Math.max(x.hint || 0, lv); }),
      pass: (k) => write((s) => { g(s, k).done = true; }),
      touch: () => write(() => {}),
      get: () => store.get('st:' + id) || null
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
}
// Итог экрана для достижений: 'self' — без промахов и сильной помощи; 'help' — сделано с помощью.
function screenResult(store, id) {
  const s = store.get('st:' + id);
  if (!s) return null;
  const r = statRow(id, s);
  if (!r.done) return null;
  return r.correct && !r.strongHelp && !r.helped ? 'self' : 'help';
}

// ЛЕСЕНКА ПОДСКАЗОК: направить → принцип → конкретное действие. Ступень растёт
// от промаха (miss) и от кнопки «Подсказка» в шапке. Ступень пишется в учёт.
function useHelp(stat, stageKey, active) {
  const [lv, setLv] = useState(0);
  const r = useRef(0);
  const keyRef = useRef(stageKey); keyRef.current = stageKey;
  const actRef = useRef(active); actRef.current = active;
  const [btnN, setBtnN] = useState(0);
  const bump = useCallback(() => {
    r.current = Math.min(3, r.current + 1);
    setLv(r.current);
    stat.hint(keyRef.current, r.current);
    return r.current;
  }, [stat]);
  const reset = useCallback(() => { r.current = 0; setLv(0); }, []);
  const pulse = useHintPulse();
  const seen = useRef(pulse);
  useEffect(() => {
    if (pulse === seen.current) return;
    seen.current = pulse;
    if (actRef.current) { bump(); setBtnN((n) => n + 1); }
  }, [pulse, bump]);
  return { lv, bump, reset, ref: r, btnN };
}
const hintAt = (hints, lv, vars) => (hints && lv > 0 ? fillL(hints[Math.min(lv, hints.length) - 1], vars || {}) : null);
const nextHint = (hints, lv, vars) => (hints ? fillL(hints[Math.min(lv, hints.length - 1)], vars || {}) : null);

// Достижение-группа: 'self' / 'help' / null.
function groupResult(store, ids) {
  const rs = ids.map((id) => screenResult(store, id));
  if (rs.some((x) => !x)) return null;
  return rs.every((x) => x === 'self') ? 'self' : 'help';
}
const ACH = [['heads', ['s2', 's5', 's6', 's8']], ['levels', ['s7']], ['title', ['s3']], ['p', ['s4']], ['marks', ['s9', 's10']], ['fix', ['s11', 's12']], ['own', ['s13']]];
function achievements(store) {
  const out = {};
  ACH.forEach(([k, ids]) => { const r = groupResult(store, ids); if (r) out[k] = r; });
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// СВОЯ СТРАНИЦА (экран 13) → блоки, HTML, артефакт. Одна функция для превью,
// для экрана у Пикселя и для onFinished.
// ─────────────────────────────────────────────────────────────────────────────
const OWN_ORDER = ['h1', 'h2', 'p1', 'h3', 'p2', 'b', 'i'];
const OWN_TAG = { h1: 'h1', h2: 'h2', p1: 'p', h3: 'h3', p2: 'p', b: 'b', i: 'i' };
function ownBlocks(own, pick, opts) {
  const o = own || {};
  const tags = o.tags || {}, texts = o.texts || {};
  const o2 = opts || {};
  const out = [];
  ['h1', 'h2', 'p1', 'h3', 'p2'].forEach((id) => {
    if (!tags[id]) return;
    const t = String(texts[id] || '').trim();
    if (!t && !o2.keepEmpty) return;
    let parts = [txt(t)];
    if (o.bold && o.bold.line === id && t) parts = markParts(t, o.bold.word, 'b');
    out.push(blk(id, tags[id], parts));
  });
  const th = String(texts.i || '').trim();
  if (th || o2.keepEmpty) {
    const pre = pick(UI.thoughtPre) + ' ';
    out.push(blk('i', 'p', [txt(pre), tags.i === 'i' && th ? { k: 'i', v: th } : txt(th)]));
  }
  return out.map((b) => Object.assign({}, b, { parts: nonEmpty(b.parts) }));
}
function ownTitle(own, pick) {
  const t = own && own.texts && String(own.texts.h1 || '').trim();
  return t || pick(PAGE.name);
}
function makeArtifact(store) {
  const own = store.get('s13');
  if (!own || !own.done) return null;
  const pick = (n) => (n && typeof n === 'object' ? (n[own.lang] !== undefined ? n[own.lang] : n.ru) : n);
  const blocks = ownBlocks(own, pick);
  const title = ownTitle(own, pick);
  return { type: 'html-page', title, blocks, html: buildHtml(title, blocks) };
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧАСТИ ИНТЕРФЕЙСА
// ─────────────────────────────────────────────────────────────────────────────
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask tr-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
// Без голоса строка героя на «тесных» экранах телефона спрятана (voiceTop) —
// тогда реплика Коди печатается здесь, под заданием. Текст всегда доступен.
// Прочитанная реплика через несколько секунд сворачивается в одну строку (экран
// не растёт), нажатие разворачивает её снова.
function SayLine({ speaker, skip }) {
  const pick = usePick();
  const audio = useAudio();
  const line = speaker && speaker.text ? pick(speaker.text) : '';
  const [fold, setFold] = useState(false);
  useEffect(() => {
    setFold(false);
    if (!line) return undefined;
    const t = setTimeout(() => setFold(true), Math.max(7000, estimateMs(line) + 4000));
    return () => clearTimeout(t);
  }, [line, speaker && speaker.nonce]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!(audio && audio.failed) || !line) return null;
  if (skip && pick(skip) === line) return null;   // тот же текст уже в строке задания
  return (
    <button type="button" className={'tr-say only-narrow' + (fold ? ' is-fold' : '')} aria-live="polite" aria-expanded={!fold} onClick={() => setFold((f) => !f)}>
      <span className="tr-say-k">{pick(UI.kodi)}:</span> {line}
    </button>
  );
}
// Робот Пиксель (фигура из урока 07): texts — надписи на его экране.
function Pix({ texts, cls }) {
  const pick = usePick();
  const ref = useRef(null);
  const html = useMemo(() => ({ __html: PIX.svg }), []);
  const key = JSON.stringify(texts || {});
  useLayoutEffect(() => {
    const t = texts || {};
    if (!ref.current) return;
    ref.current.querySelectorAll('[data-t]').forEach((n) => {
      const k = n.getAttribute('data-t');
      if (t[k] === undefined) return;
      n.textContent = t[k];
      const fit = Number(n.getAttribute('data-fit'));
      n.removeAttribute('textLength');
      n.removeAttribute('lengthAdjust');
      if (fit && t[k] && n.getComputedTextLength && n.getComputedTextLength() > fit) {
        n.setAttribute('textLength', String(fit));
        n.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={ref} className={'tr-fig iso fig-robot rb-html rb-css rb-js' + (cls ? ' ' + cls : '')} data-theme="light"
    style={{ '--ar': PIX.ar }} role="img" aria-label={pick(UI.pixel)} dangerouslySetInnerHTML={html} />;
}
// Кнопки тегов: неверная гаснет; после двух промахов светится верная (glow).
function TagPick({ tags, onPick, canTap, off, glow, led }) {
  return (
    <div className="tr-tags" role="group" translate="no">
      {tags.map((t) => {
        const dead = !!off && off.indexOf(t) >= 0;
        return (
          <button key={t} type="button" className={'tr-tag' + (dead ? ' is-off' : '') + (glow === t ? ' is-glow' : '')}
            disabled={!canTap || dead} onClick={() => onPick(t)}>
            <Tag tag={t} /><Led on={!!led && !dead} />
          </button>
        );
      })}
    </div>
  );
}
// Варианты ответа (прогноз): после ответа выбранный помечен, верный подсвечен.
function Opts({ opts, order, onPick, canTap, picked, answer, led }) {
  const pick = usePick();
  return (
    <div className="tr-opts" role="group">
      {/* После ответа остаются только выбранный и верный варианты — экран не растёт. */}
      {order.filter((k) => !picked || k === picked || k === answer).map((k) => (
        <button key={k} type="button" disabled={!canTap || !!picked}
          className={'tr-opt' + (picked === k ? (k === answer ? ' is-ok' : ' is-no') : '') + (picked && picked !== k && k === answer ? ' is-real' : '')}
          onClick={() => onPick(k)}>
          <span>{pick(opts[k])}</span><Led on={!!led && !picked} />
        </button>
      ))}
    </div>
  );
}
// Подсветка частей кода по зонам (z): токен с зоной из списка получает is-hl.
const zoneHl = (list) => (z) => (list && list.indexOf(z) >= 0 ? { cls: 'is-hl' } : null);
// Автозасчёт текста: через 1 с после последней правки, если текст годится.
function useAutoAccept(value, ok, onAccept) {
  const cb = useRef(onAccept);
  cb.current = onAccept;
  useEffect(() => {
    if (!ok) return undefined;
    const t = setTimeout(() => cb.current(value), 1000);
    return () => clearTimeout(t);
  }, [value, ok]);
}
// Защёлка: стало true — дальше всегда true (конец вступления не «отменяется»
// следующими репликами Коди).
function useLatch(cond) {
  const [v, setV] = useState(!!cond);
  useEffect(() => { if (cond && !v) setV(true); }, [cond, v]);
  return v || !!cond;
}
// Один раз за жизнь экрана выполнить при условии.
function useWhen(cond, fn) {
  const done = useRef(false);
  const f = useRef(fn); f.current = fn;
  useEffect(() => { if (cond && !done.current) { done.current = true; f.current(); } }, [cond]);
}

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. ИГРОКИ ЗАПУТАЛИСЬ. «Сейчас» (сплошной текст) ↔ «Как надо»; Коди по ходу
// речи подсвечивает заголовки, абзацы и выделения.
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const stat = useStat('s1', 'explore', ['view']);
  const [rec, put] = useRec('s1');
  const [view, setView] = useState(rec ? 'want' : 'now');
  const [told, setTold] = useState(!!rec);
  const [speaker, say, spoken] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const solved = !!rec || (told && spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !told, 0);
  useWhen(told && spoken && !rec, () => { put({ done: true }); stat.pass('view'); });
  const change = (v) => {
    setView(v);
    if (v === 'want' && !told) {
      setTold(true);
      say(c.heads, 'point'); say(c.paras, 'explain'); say(c.marks, 'point'); say(c.done, 'cheer');
    }
  };
  const now = speaker.text;
  const hl = view !== 'want' ? null : now === c.heads ? ['name', 'rules', 'round', 'news'] : now === c.paras ? ['welcome', 'rulesP', 'newsP']
    : now === c.marks ? ['roundP', 'thoughtP'] : null;
  const blocks = view === 'want' ? demoPage(pick) : lumpPage(pick);
  const ask = solved ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} />
      <div className="tr-hook">
        <Pix texts={{ scr1: pick(PAGE.name), scr2: pick(UI.tourn) }} cls="tr-fig-sm" />
        <div className={'tr-seg' + (led ? ' is-led' : '')}>
          <SegToggle value={view} onChange={(v) => { if (canTap || v === 'now') change(v); }}
            options={[{ v: 'now', label: UI.now }, { v: 'want', label: UI.want }]} />
          <Led on={led} />
        </div>
      </div>
      <MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page key={view} blocks={blocks} hl={hl} fresh={view === 'want' ? blocks.map((b) => b.id) : null} />} />
    </Stage>
  );
}

// ── 2. ИМЯ НА СТРАНИЦЕ. Коди показывает пару <h1> (подсветка тега и результата
// синхронно с речью), потом ученик пишет свой заголовок.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const stat = useStat('s2', 'write', ['write']);
  const [rec, put] = useRec('s2');
  const [head, setHead] = useState(rec ? rec.head : pick(PAGE.name));
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const solved = !!rec;
  const canGo = useAdvanceGate(solved, spoken);
  const now = speaker.text;
  const writing = useLatch(solved || spoken);
  const led = useIdleLed(canTap && writing && !solved, head.length);
  const sample = pick(PAGE.name);
  const changed = head.trim().toLowerCase() !== sample.toLowerCase();
  const good = okText(head) && changed;
  useAutoAccept(head, good && !solved && writing, (v) => {
    put({ head: v.trim() }); setMsg(null); stat.pass('write'); sfx('ok', true); sayNow(c.done, 'cheer');
  });
  // После «Готово» правки продолжают сохраняться.
  useEffect(() => { if (solved && good && rec && rec.head !== head.trim()) put({ head: head.trim() }); }, [head]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!writing || solved) return undefined;
    if (hasTags(head)) { setMsg(c.noTags); return undefined; }
    if (okText(head) && !changed) { const t = setTimeout(() => setMsg(c.same), 2500); return () => clearTimeout(t); }
    setMsg(null);
    return undefined;
  }, [head, writing, solved]); // eslint-disable-line react-hooks/exhaustive-deps
  const zone = writing ? null : now === c.cast[0].text ? ['name:o'] : now === c.cast[1].text ? ['name:c'] : null;
  const pageHl = !writing && (now === c.cast[1].text || now === c.cast[2].text) ? ['name'] : null;
  const lineHl = !writing && now === c.cast[2].text;
  const blocks = [blk('name', 'h1', writing ? head : sample), blk('welcome', null, pick(PAGE.welcome))];
  const lines = srcLines(blocks, { frame: 'body' }).map((ln) => {
    if (ln.id !== 'name' || !writing) return ln;
    return Object.assign({}, ln, { toks: [ln.toks[0], { k: 'node', node: (
      <InlineInput value={head} onChange={setHead} max={40} label={c.ask} cls={led ? 'is-led-in' : ''} />
    ) }, ln.toks[ln.toks.length - 1]] });
  });
  const ask = solved ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={glue(blocks)} hl={pageHl} />} />}
        code={<Src lines={lines} className="tr-src" zone={zoneHl(zone)}
          lineProps={(ln) => (ln.id === 'name' ? { cls: 'tr-in' + (lineHl || writing ? ' is-hl' : '') } : null)} />} />
    </Stage>
  );
}

// ── 3. ВКЛАДКА ИЛИ СТРАНИЦА? Прогноз: меняется title → где? меняется h1 → где?
const S3_ROUNDS = [{ id: 't', answer: 'tab' }, { id: 'h', answer: 'page' }];
function S3({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s3;
  const stat = useStat('s3', 'predict', ['t', 'h']);
  const [rec, put] = useRec('s3');
  const startH1 = (store.get('s2') && store.get('s2').head) || pick(PAGE.name);
  const [ri, setRi] = useState(rec ? 2 : 0);
  const [picked, setPicked] = useState(rec ? rec.picked : {});
  const [title, setTitle] = useState(rec ? pick(c.rounds.t.newText) : pick(PAGE.name));
  const [h1, setH1] = useState(rec ? pick(c.rounds.h.newText) : startH1);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const done = ri >= 2;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' },
    ...(done ? [] : [{ text: c.rounds.t.q, pose: 'curious' }])]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const R = S3_ROUNDS[Math.min(ri, 1)];
  const cr = c.rounds[R.id];
  const answered = !!picked[R.id];
  const led = useIdleLed(canTap && !done && !answered, ri);
  const choose = (k) => {
    if (!canTap || answered || done) return;
    const right = k === R.answer;
    setPicked((x) => Object.assign({}, x, { [R.id]: k }));
    if (!right) stat.miss(R.id);
    stat.pass(R.id);
    sfx(right ? 'ok' : 'soft', true);
    if (R.id === 't') { setTitle(pick(cr.newText)); setFlash((f) => ({ tab: f.tab + 1, page: f.page })); }
    else { setH1(pick(cr.newText)); setFlash((f) => ({ tab: f.tab, page: f.page + 1 })); }
    sayNow(right ? cr.right : cr.wrong, right ? 'smile' : 'explain');
  };
  const next = () => {
    if (!canTap) return;
    sfx('tap', true);
    if (ri === 0) { setRi(1); sayNow(c.rounds.h.q, 'curious'); }
    else { setRi(2); put({ picked }); sayNow(c.done, 'cheer'); }
  };
  const blocks = [blk('h1', 'h1', h1), blk('welcome', null, pick(PAGE.welcome))];
  const lines = srcLines(blocks, { frame: 'hb', title });
  const target = done ? null : R.id === 't' ? 'title' : 'b-h1';
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : cr.q} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} />
      <Ask text={done ? c.askDone : cr.q} n={done ? null : (ri + 1) + '/2'} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={title} flashTab={flash.tab} flashPage={flash.page} cls="tr-mb"
          hl={!done && answered ? (R.id === 't' ? 'title' : 'body') : null} page={<Page blocks={glue(blocks)} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => (ln.key === target ? { cls: 'is-hl' } : null)} />} />
      {!done ? (
        <>
          {!answered ? <Opts opts={{ tab: UI.tab, page: UI.page }} order={['tab', 'page']} onPick={choose} canTap={canTap} picked={picked[R.id]} answer={R.answer} led={led} /> : (
            <div className={'tr-verdict' + (picked[R.id] === R.answer ? ' is-ok' : ' is-no')}>
              <span className="tr-verdict-ic"><Icon name={picked[R.id] === R.answer ? 'check' : 'bulb'} size={16} /></span>
              <span className="tr-verdict-t">{pick(R.answer === 'tab' ? UI.tab : UI.page)}</span>
              <button type="button" className="btn-accent tr-next-b" disabled={!canTap} onClick={next}>
                {pick(ri === 0 ? UI.nextQ : UI.done)}<Icon name="arrowR" size={16} /></button>
            </div>
          )}
        </>
      ) : null}
    </Stage>
  );
}

// ── 4. ТЕКСТУ НУЖНЫ АБЗАЦЫ. Один <p> с двумя мыслями → как разделить: Enter или
// </p> + <p>. Enter честно ничего не меняет на странице.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const stat = useStat('s4', 'choice', ['split']);
  const [rec, put] = useRec('s4');
  const [state, setState] = useState(rec ? 'split' : 'one');   // one · enter · split
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [pin, setPin] = useState(null);
  const done = state === 'split';
  const help = useHelp(stat, 'split', !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, off.length);
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!pin) return undefined; const t = setTimeout(() => setPin(null), 2200); return () => clearTimeout(t); }, [pin]);
  const choose = (k) => {
    if (!canTap || done) return;
    if (k === 'enter') {
      sfx('soft', true); stat.miss('split'); help.bump();
      setState('enter'); setOff(['enter']); setPin(UI.noChange); setMsg(c.enterWhy); sayNow(c.enterWhy, 'explain');
      return;
    }
    sfx('pop', true); setState('split'); setMsg(null); put({ done: true }); stat.pass('split');
    sayNow(c.done, 'cheer');
  };
  const now = speaker.text;
  const intro = !useLatch(!!rec || spoken);
  const welcome = pick(PAGE.welcome), rules = pick(PAGE.rulesP);
  const blocks = done
    ? [pb(pick, 'name', 'h1', 'name'), blk('w', 'p', welcome), blk('r', 'p', rules)]
    : [pb(pick, 'name', 'h1', 'name'), blk('w', 'p', welcome + ' ' + rules)];
  let lines = srcLines(blocks, { frame: 'body' });
  if (state === 'enter') {
    // Перенос строки внутри абзаца: в коде две строки, абзац всё ещё один.
    lines = lines.flatMap((ln) => (ln.id !== 'w' ? [ln] : [
      Object.assign({}, ln, { key: 'w1', toks: [ln.toks[0], { k: 'text', v: welcome, z: 'w:0' }] }),
      { key: 'w2', d: ln.d, toks: [{ k: 'text', v: rules, z: 'w:1' }, ln.toks[ln.toks.length - 1]], cls: 'tr-enter' }
    ]));
  }
  const zone = intro && now === c.cast[0].text ? ['w:o', 'w:c'] : null;
  const pageHl = intro && (now === c.cast[0].text || now === c.cast[1].text) ? ['w'] : done ? null : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={done ? c.askDone : c.ask} hint={done ? null : msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" pins={pin ? { page: pin } : null}
          page={<Page blocks={blocks} hl={pageHl} fresh={done ? ['r'] : null} />} />}
        code={<Src lines={lines} className="tr-src" zone={zoneHl(zone)}
          lineProps={(ln) => (ln.cls ? { cls: ln.cls } : ln.id === 'r' ? { cls: 'tr-in' } : null)} />} />
      {!done ? (
        <div className="tr-opts" role="group">
          {['enter', 'tags'].map((k) => (
            <button key={k} type="button" disabled={!canTap || off.indexOf(k) >= 0}
              className={'tr-opt' + (off.indexOf(k) >= 0 ? ' is-off' : '') + (help.lv >= 3 && k === 'tags' ? ' is-glow' : '')}
              onClick={() => choose(k)}>
              <span className="tr-opt-ic mono" aria-hidden="true">{k === 'enter' ? '↵' : '</p><p>'}</span>
              <span>{pick(c.opts[k])}</span><Led on={led && off.indexOf(k) < 0} />
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// ── 5. РАЗДЕЛ «ПРАВИЛА». Показ h2; ученик выбирает тег для «Новостей турнира».
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const stat = useStat('s5', 'choose-tag', ['news']);
  const [rec, put] = useRec('s5');
  const [stage, setStage] = useState(rec ? 'done' : 'news');   // news · newsx · done
  const [tagNews, setTagNews] = useState(rec ? 'h2' : null);
  const [tagPrize, setTagPrize] = useState(rec && rec.extra ? 'h2' : null);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const done = stage === 'done';
  const help = useHelp(stat, stage === 'newsx' ? 'newsx' : 'news', !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, off.length + (stage === 'newsx' ? 5 : 0));
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const key = stage === 'newsx' ? 'newsx' : 'news';
  const choose = (t) => {
    if (!canTap || done) return;
    if (t !== 'h2') {
      sfx('soft', true); wobble(key); stat.miss(key);
      const lv = help.bump();
      setOff((o) => o.concat(t));
      const why = c.wrong[t];
      const h = lv >= 3 ? joinL(why, c.hints[2]) : why;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('ok', true); stat.pass(key); setMsg(null); setOff([]);
    if (stage === 'news') {
      setTagNews('h2');
      if (help.ref.current >= 3) { help.reset(); setStage('newsx'); sayNow(joinL(c.done, c.extraSay), 'smile'); return; }
      setStage('done'); put({ done: true }); sayNow(c.done, 'cheer');
    } else {
      setTagPrize('h2'); setStage('done'); put({ done: true, extra: true }); sayNow(c.extraDone, 'cheer');
    }
  };
  const now = speaker.text;
  const intro = !useLatch(!!rec || spoken);
  const extraOn = stage === 'newsx' || !!tagPrize;
  const showNew = !intro;
  const base = [pb(pick, 'name', 'h1', 'name'), pb(pick, 'welcome', 'p', 'welcome'), pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP')];
  const more = showNew ? [blk('news', tagNews, pick(PAGE.news)), pb(pick, 'newsP', 'p', 'newsP')] : [];
  const more2 = extraOn ? [blk('prizes', tagPrize, pick(PAGE.prizes)), pb(pick, 'prizesP', 'p', 'prizesP')] : [];
  const blocks = base.concat(more, more2);
  const lines = srcLines(blocks, { frame: 'body', collapse: (b) => b.id === 'welcome' || b.id === 'rulesP' }).map((ln) => {
    if ((ln.id === 'news' && !tagNews) || (ln.id === 'prizes' && !tagPrize)) {
      return Object.assign({}, ln, { tag: 'h1', toks: [{ k: 'node', node: <span className="tr-slot-tag mono">h?</span> }, ln.toks[ln.toks.length - 1]] });
    }
    return ln;
  });
  const curId = stage === 'newsx' ? 'prizes' : 'news';
  const rulesHl = intro && (now === c.cast[0].text) ? ['rules'] : null;
  const ask = done ? c.askDone : fillL(c.ask, { x: stage === 'newsx' ? PAGE.prizes : PAGE.news });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={done ? null : msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={glue(blocks)} hl={rulesHl || (done ? null : [curId])} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => (ln.id === 'rules' && rulesHl ? { cls: 'is-hl' }
          : ln.id === curId && !done ? { cls: 'is-hl' + (shake === key ? ' tr-shake' : '') } : (ln.id === 'news' || ln.id === 'prizes') ? { cls: 'tr-in' } : null)} />} />
      {!done && showNew ? <TagPick tags={['h1', 'h2', 'p']} onPick={choose} canTap={canTap} off={off} glow={off.length >= 2 || help.lv >= 3 ? 'h2' : null} led={led} /> : null}
    </Stage>
  );
}

// ── 6. ВНУТРИ РАЗДЕЛА. h3 «Первый раунд» — нажать место перед подходящим абзацем.
const S6_LINES = ['name', 'welcome', 'rules', 'rulesP', 'roundP', 'news', 'newsP'];
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const stat = useStat('s6', 'place', ['place']);
  const [rec, put] = useRec('s6');
  const [stage, setStage] = useState(rec ? 'done' : 'place');   // place · placex · done
  const [placed, setPlaced] = useState(rec ? { round: true, round2: !!rec.extra } : {});
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const done = stage === 'done';
  const key = stage === 'placex' ? 'placex' : 'place';
  const help = useHelp(stat, key, !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, help.lv + (stage === 'placex' ? 9 : 0));
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const extraOn = stage === 'placex' || !!placed.round2;
  // Строки страницы (без h3); в доп. примере — абзац про второй раунд.
  const order = S6_LINES.slice();
  if (extraOn) order.splice(order.indexOf('roundP') + 1, 0, 'round2P');
  const want = stage === 'placex' ? 'round2P' : 'roundP';   // h3 ставится перед этой строкой
  const why = (before) => {
    if (stage === 'placex') return c.extraWrong;
    const i = order.indexOf(before);
    if (before === null || i > order.indexOf('news')) return c.wrong.news;
    if (i <= order.indexOf('rules')) return c.wrong.top;
    if (before === 'rulesP') return c.wrong.general;
    return c.wrong.after;
  };
  const tapSlot = (before) => {
    if (!canTap || done) return;
    if (before !== want) {
      sfx('soft', true); stat.miss(key); setShake(before); setTimeout(() => setShake(null), 420);
      const lv = help.bump();
      const h = lv >= 3 ? joinL(why(before), c.hints[2]) : why(before);
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('pop', true); stat.pass(key); setMsg(null);
    if (stage === 'place') {
      setPlaced({ round: true });
      if (help.ref.current >= 3) { help.reset(); setStage('placex'); sayNow(joinL(nextPraiseL(), c.extraSay), 'smile'); return; }
      setStage('done'); put({ done: true }); sayNow(c.done, 'cheer');
    } else {
      setPlaced({ round: true, round2: true }); setStage('done'); put({ done: true, extra: true }); sayNow(c.extraDone, 'cheer');
    }
  };
  const textOf = { name: ['h1', 'name'], welcome: ['p', 'welcome'], rules: ['h2', 'rules'], rulesP: ['p', 'rulesP'], roundP: ['p', 'roundP'],
    round2P: ['p', 'round2P'], news: ['h2', 'news'], newsP: ['p', 'newsP'] };
  const blocks = [];
  order.forEach((id) => {
    if (id === 'roundP' && placed.round) blocks.push(pb(pick, 'round', 'h3', 'round'));
    if (id === 'round2P' && placed.round2) blocks.push(pb(pick, 'round2', 'h3', 'round2'));
    blocks.push(pb(pick, id, textOf[id][0], textOf[id][1]));
  });
  const introDone = useLatch(spoken || !!rec);
  const tapOn = !done && introDone;
  let lines = srcLines(blocks, { frame: 'body', collapse: (b) => b.id === 'welcome' || b.id === 'newsP' || (extraOn && b.id === 'rulesP') });
  // В дополнительном примере строки до «Первого раунда» свёрнуты в одно «…» — на телефоне код помещается.
  if (stage === 'placex') {
    const at = lines.findIndex((ln) => ln.id === 'round');
    lines = [lines[0], { key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }].concat(lines.slice(at));
  }
  const chip = stage === 'placex' ? PAGE.round2 : PAGE.round;
  const intro = !introDone;
  const rulesHl = intro && speaker.text === c.cast[1].text ? ['rules', 'rulesP', 'roundP'] : null;
  const markLine = help.lv >= 3 ? want : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={done ? c.askDone : c.ask} hint={done ? null : msg} />
      {!done ? <div className="tr-chip-row" translate="no"><span className="tr-chip"><Tag tag="h3" /><span className="tk-tx">{pick(chip)}</span><Tag tag="h3" close /></span></div> : null}
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={glue(blocks)} hl={rulesHl}
          fresh={placed.round ? [placed.round2 ? 'round2' : 'round'] : null} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => {
          // Нажатая строка — «поставь заголовок перед ней». Первая строка (h1) не годится.
          if (tapOn && ln.id && order.indexOf(ln.id) > 0) {
            return { onTap: () => tapSlot(ln.id), disabled: !canTap, led: ln.id === markLine,
              cls: 'tr-pickline' + (shake === ln.id ? ' tr-shake' : '') + (ln.id === markLine ? ' is-hl' : '') };
          }
          if (rulesHl && rulesHl.indexOf(ln.id) >= 0) return { cls: 'is-hl' };
          if (ln.id === 'round' || ln.id === 'round2') return { cls: 'tr-in is-new' };
          return null;
        }} />} />
    </Stage>
  );
}

// ── 7. ШЕСТЬ УРОВНЕЙ. Большой турнир: нажать каждую строку h1…h6, потом вопрос.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const stat = useStat('s7', 'levels', ['q']);
  const [rec, put] = useRec('s7');
  const [seen, setSeen] = useState(rec ? [0, 1, 2, 3, 4, 5] : []);
  const [cur, setCur] = useState(null);
  const [stage, setStage] = useState(rec ? 'done' : 'explore');   // explore · q · qx · done
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const done = stage === 'done';
  const key = stage === 'qx' ? 'qx' : 'q';
  const help = useHelp(stat, key, stage === 'q' || stage === 'qx');
  const [speaker, say, spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, seen.length * 10 + off.length);
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const tapLine = (i) => {
    if (!canTap || stage !== 'explore') return;
    sfx('tap', true);
    setCur(i);
    const ns = seen.indexOf(i) >= 0 ? seen : seen.concat(i);
    setSeen(ns);
    if (ns.length >= 6) { sayNow(c.tell[i], 'point'); say(c.all, 'explain'); say(c.q, 'curious'); setStage('q'); }
    else sayNow(c.tell[i], 'point');
  };
  const qOpts = stage === 'qx' ? ['h4', 'h5', 'h6'] : ['h3', 'h4', 'h5'];
  const want = stage === 'qx' ? 'h6' : 'h5';
  const answer = (t) => {
    if (!canTap || done) return;
    if (t !== want) {
      sfx('soft', true); stat.miss(key);
      const lv = help.bump();
      setOff((o) => o.concat(t));
      const why = stage === 'qx' ? c.extraWrong : c.qWrong[t];
      const h = lv >= 3 ? joinL(why, stage === 'qx' ? null : c.hints[2]) : why;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('ok', true); stat.pass(key); setMsg(null); setOff([]);
    if (stage === 'q' && help.ref.current >= 3) { help.reset(); setStage('qx'); sayNow(joinL(c.right, c.extraQ), 'smile'); return; }
    setStage('done'); put({ done: true }); sayNow(joinL(c.right, c.done), 'cheer');
  };
  const blocks = EX6.map((x, i) => blk('l' + (i + 1), 'h' + (i + 1), pick(x.t)));
  const lines = srcLines(blocks, { frame: 'body' });
  const ask = done ? c.askDone : stage === 'explore' ? c.askTap : stage === 'qx' ? c.extraShort : c.qShort;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : stage === 'explore' ? c.askTap : msg || nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={done ? null : msg} n={stage === 'explore' ? seen.length + '/6' : null} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(EX6[0].t)} cls="tr-mb" page={<Page blocks={blocks} hl={cur != null ? ['l' + (cur + 1)] : null} />} />}
        code={<Src lines={lines} className="tr-src tr-src-lv" lineProps={(ln) => {
          if (!ln.id) return null;
          const i = Number(ln.id.slice(1)) - 1;
          return {
            onTap: () => tapLine(i), disabled: !canTap || stage !== 'explore', led: led && stage === 'explore' && seen.indexOf(i) < 0 && i === Math.min(...[0, 1, 2, 3, 4, 5].filter((k) => seen.indexOf(k) < 0)),
            cls: 'tr-lv tr-lv-' + (i + 1) + (cur === i ? ' is-hl' : '') + (seen.indexOf(i) >= 0 ? ' is-seen' : ''),
            after: seen.indexOf(i) >= 0 ? <span className="tr-mean">{pick(EX6[i].m)}</span> : null
          };
        }} />} />
      {stage === 'q' || stage === 'qx' ? (
        <TagPick tags={qOpts} onPick={answer} canTap={canTap} off={off} glow={off.length >= 2 || help.lv >= 3 ? want : null} led={led} />
      ) : null}
    </Stage>
  );
}

// ── 8. РЕДАКТОР ПЕРЕПУТАЛ УРОВНИ. Роль у каждой строки → назначить уровень.
const S8_ROWS = [
  { id: 'name', key: 'name', role: 'whole', bad: 3, want: 1 },
  { id: 'rules', key: 'rules', role: 'section', bad: 1, want: 2 },
  { id: 'round', key: 'round', role: 'sub', bad: 2, want: 3 }
];
const S8_EXTRA = { id: 'round2', key: 'round2', role: 'sub', bad: 1, want: 3 };
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const stat = useStat('s8', 'assign', ['name', 'rules', 'round']);
  const [rec, put] = useRec('s8');
  const [lv, setLv] = useState(rec ? { name: 1, rules: 2, round: 3, round2: rec.extra ? 3 : undefined } : {});
  const [extraOn, setExtraOn] = useState(!!(rec && rec.extra));
  const [sel, setSel] = useState(null);
  const [miss, setMiss] = useState({});
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const rows = extraOn ? S8_ROWS.concat(S8_EXTRA) : S8_ROWS;
  const open = rows.filter((r) => lv[r.id] !== r.want);
  const done = !!rec || (open.length === 0 && (!extraOn || lv.round2 === 3));
  const cur = sel && open.find((r) => r.id === sel) ? sel : (open[0] ? open[0].id : null);
  const row = rows.find((r) => r.id === cur);
  const stageKey = cur === 'round2' ? 'roundx' : cur || 'name';
  const help = useHelp(stat, stageKey, !done);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec ? c.done : c.say, pose: rec ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, open.length * 10 + (miss[cur] || 0));
  useEffect(() => { if (help.btnN && row) setMsg(hintAt(c.hints, help.lv, { lv: 'h' + row.want })); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (t) => {
    if (!canTap || done || !row) return;
    const n = Number(t.slice(1));
    if (n !== row.want) {
      sfx('soft', true); stat.miss(stageKey); setShake(row.id); setTimeout(() => setShake(null), 420);
      setMiss((m) => Object.assign({}, m, { [row.id]: (m[row.id] || 0) + 1 }));
      const l = help.bump();
      const why = n === (lv[row.id] || row.bad) ? c.wrong.same : c.wrong[row.role];
      const h = l >= 3 ? joinL(why, fillL(c.hints[2], { lv: 'h' + row.want })) : why;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('ok', true); stat.pass(stageKey); setMsg(null);
    const strong = help.ref.current >= 3;
    help.reset(); setSel(null);
    const nl = Object.assign({}, lv, { [row.id]: n });
    setLv(nl);
    const left = rows.filter((r) => nl[r.id] !== r.want);
    if (row.id === 'round2') { put({ done: true, extra: true }); sayNow(c.done, 'cheer'); return; }
    if (strong && !extraOn) { setExtraOn(true); sayNow(joinL(c.okStep, c.extraSay), 'smile'); return; }
    if (!left.length || (left.length === 1 && left[0].id === 'round2')) {
      if (extraOn && nl.round2 !== 3) { sayNow(joinL(c.okStep, c.extraSay), 'smile'); return; }
      put({ done: true }); sayNow(c.done, 'cheer');
    } else sayNow(c.okStep, 'smile');
  };
  // Только заголовки: роли и уровни видны без лишних строк (телефон).
  const blocks = rows.map((r) => blk(r.id, 'h' + (lv[r.id] || r.bad), pick(PAGE[r.key])));
  const lines = srcLines(blocks, { frame: 'body' });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv, { lv: row ? 'h' + row.want : 'h1' })} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={done ? c.askDone : fillL(c.ask, { x: row ? PAGE[row.key] : '' })} hint={done ? null : msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} hl={cur && !done ? [cur] : null} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => {
          const r = rows.find((x) => x.id === ln.id);
          if (!r) return null;
          const ok = lv[r.id] === r.want;
          return {
            onTap: () => { if (canTap && !done && !ok) { sfx('tap', true); setSel(r.id); setMsg(null); help.reset(); } },
            disabled: !canTap || done || ok,
            cls: 'tr-roleline' + (r.id === cur && !done ? ' is-hl' : '') + (ok ? ' tr-fixed' : '') + (shake === r.id ? ' tr-shake' : ''),
            after: <span className={'tr-role' + (ok ? ' is-ok' : '')}>{pick(UI.roles[r.role])}</span>
          };
        }} />} />
      {!done ? <TagPick tags={['h1', 'h2', 'h3']} onPick={choose} canTap={canTap} glow={row && ((miss[row.id] || 0) >= 2 || help.lv >= 3) ? 'h' + row.want : null} led={led} /> : null}
    </Stage>
  );
}

// ── 9–10. ВЫДЕЛЕНИЕ СЛОВ: показ на одной фразе, потом своя фраза (WordLine).
// conf: { id, demo: { key, frag, tag }, task: { key, frag, goal, wrongSel }, extra: {...}, tags, punct }
function MarkScreen({ p, c, conf }) {
  const pick = usePick();
  const stat = useStat(conf.id, 'mark', ['mark']);
  const [rec, put] = useRec(conf.id);
  const [stage, setStage] = useState(rec ? 'done' : 'mark');   // mark · markx · done
  const [marked, setMarked] = useState(rec ? { task: true, extra: !!rec.extra } : {});
  const [sel, tapWord, setSel] = useWordSel();
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(null);
  const done = stage === 'done';
  const key = stage === 'markx' ? 'markx' : 'mark';
  const help = useHelp(stat, key, !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (sel ? 1 : 0) + help.lv * 3 + (stage === 'markx' ? 20 : 0));
  const T = stage === 'markx' ? conf.extra : conf.task;
  const toks = useMemo(() => toTokens(pick(PAGE[T.key])), [T.key, pick]); // eslint-disable-line react-hooks/exhaustive-deps
  const frag = pick(PAGE[T.frag]);
  const fragWords = frag.replace(/[!?.…]+$/, '');
  const target = findRange(toks, fragWords);
  const words = target ? toks.slice(target[0], target[1] + 1).filter((t) => t.w).map((t) => t.v) : [];
  const vars = { f: fragWords, a: words[0] || '', b: words[words.length - 1] || '' };
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv, vars)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const writeMiss = (h) => { sfx('soft', true); stat.miss(key); const lv = help.bump(); const hh = lv >= 3 ? fillL(c.hints[2], vars) : h; setMsg(hh); sayNow(hh, 'think'); };
  const onTag = (t) => {
    if (!canTap || done) return;
    if (!sel) { sfx('soft', true); setMsg(c.noSel); return; }
    const okSel = target && sel.a === target[0] && sel.b === target[1];
    if (!okSel) { setSel(null); writeMiss(stage === 'markx' ? (c.wrongSelX || c.wrongSel) : c.wrongSel); return; }
    if (t !== conf.tag) { writeMiss(c.wrongTag); return; }
    sfx('ok', true); stat.pass(key); setSel(null); setMsg(null);
    const which = stage === 'markx' ? 'extra' : 'task';
    setMarked((m) => Object.assign({}, m, { [which]: true }));
    setFlash({ id: which === 'extra' ? 'x' : 't', n: Date.now() });
    if (stage === 'mark' && help.ref.current >= 3) { help.reset(); setStage('markx'); sayNow(joinL(c.done, c.extraSay), 'smile'); return; }
    setStage('done'); put({ done: true, extra: stage === 'markx' }); sayNow(stage === 'markx' ? c.extraDone : c.done, 'cheer');
  };
  const now = speaker.text;
  const intro = !useLatch(!!rec || spoken);
  const demoOn = !intro || now !== c.cast[0].text;   // тег появляется на второй реплике
  const markOf = (key2, frag2, on) => blk(key2, 'p', on ? markParts(pick(PAGE[key2]), pick(PAGE[frag2]).replace(conf.punct ? /$/ : /[!?.…]+$/, ''), conf.tag) : pick(PAGE[key2]));
  const blocks = [blk('d', 'p', demoOn ? markParts(pick(PAGE[conf.demo.key]), pick(PAGE[conf.demo.frag]), conf.tag) : pick(PAGE[conf.demo.key]))];
  if (!intro) blocks.push(Object.assign(markOf(conf.task.key, conf.task.frag, marked.task), { id: 't' }));
  if (stage === 'markx' || marked.extra) blocks.push(Object.assign(markOf(conf.extra.key, conf.extra.frag, marked.extra), { id: 'x' }));
  const editId = done ? null : stage === 'markx' ? 'x' : 't';
  const hl = intro && now === c.cast[1].text ? ['d'] : editId ? [editId] : null;
  const lines = srcLines(blocks, { frame: 'body' });
  // Знаки в конце мысли (!, ?) входят в выделение вместе с последним словом.
  const withPunct = (s) => {
    if (!s || !conf.punct) return s;
    let b = s.b;
    while (toks[b + 1] && /^[!?.…]+$/.test(toks[b + 1].v)) b += 1;
    return { a: s.a, b };
  };
  const goal = stage === 'markx' ? c.goalX : c.goal;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv, vars)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      {done ? <GoalCard done doneText={c.askDone} /> : !intro ? <GoalCard goal={goal} n={stage === 'markx' ? 2 : 1} total={stage === 'markx' ? 2 : 1} /> : null}
      {!done && !intro ? <Ask text={sel ? c.askTag : c.askSel} hint={msg} /> : null}
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} hl={hl} flash={flash} />} />}
        code={<Src lines={lines} className="tr-src" zone={zoneHl(intro && now === c.cast[1].text ? ['d:1:o', 'd:1:c'] : null)}
          lineProps={(ln) => (ln.id === editId && !intro ? {
            cls: 'is-hl',
            content: <><Tag tag="p" /><WordLine toks={toks} marks={[]} sel={withPunct(sel)} onWord={(i) => { if (canTap) { sfx('tap', true); setMsg(null); tapWord(i); } }}
              canTap={canTap} led={led && !sel} hlRange={help.lv >= 3 ? target : null} /><Tag tag="p" close /></>
          } : (ln.id === 'd' && intro && now === c.cast[1].text ? { cls: 'is-hl' } : null))} />} />
      {!done && !intro ? <TagPick tags={conf.tags} onPick={(t) => onTag(t)} canTap={canTap} led={led && !!sel} /> : null}
    </Stage>
  );
}
// Выбор: при заданном conf.punct выделение мысли включает её знак в конце.
const S9_CONF = { id: 's9', tag: 'b', tags: ['b'], punct: false,
  demo: { key: 'roundP', frag: 'roundB' }, task: { key: 'winP', frag: 'winB' }, extra: { key: 'timeP', frag: 'timeB' } };
const S10_CONF = { id: 's10', tag: 'i', tags: ['b', 'i'], punct: true,
  demo: { key: 'thoughtP', frag: 'thoughtI' }, task: { key: 'whisperP', frag: 'whisperI' }, extra: { key: 'kodiP', frag: 'kodiI' } };
const S9 = ({ p }) => <MarkScreen p={p} c={C.s9} conf={S9_CONF} />;
const S10 = ({ p }) => <MarkScreen p={p} c={C.s10} conf={S10_CONF} />;

// ── 11. ЧТО ИЗМЕНИТСЯ? Три прогноза: сначала ответ, потом изменение и объяснение.
const S11_ORDER = ['p', 'h', 'm'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const stat = useStat('s11', 'predict', S11_ORDER);
  const [rec, put] = useRec('s11');
  const [ri, setRi] = useState(rec ? 3 : 0);
  const [picked, setPicked] = useState(rec ? rec.picked : {});
  const done = ri >= 3;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.rounds.p.q, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const id = S11_ORDER[Math.min(ri, 2)];
  const R = c.rounds[id];
  const answered = !!picked[id];
  const led = useIdleLed(canTap && !done && !answered, ri);
  const choose = (k) => {
    if (!canTap || answered || done) return;
    const right = k === R.answer;
    setPicked((x) => Object.assign({}, x, { [id]: k }));
    if (!right) stat.miss(id);
    stat.pass(id);
    sfx(right ? 'ok' : 'soft', true);
    sayNow(joinL(right ? nextPraiseL() : c.look, R.why), right ? 'smile' : 'explain');
  };
  const next = () => {
    if (!canTap) return;
    sfx('tap', true);
    if (ri < 2) { setRi(ri + 1); sayNow(c.rounds[S11_ORDER[ri + 1]].q, 'curious'); }
    else { setRi(3); put({ picked }); sayNow(c.done, 'cheer'); }
  };
  // Состояние кода и страницы раунда: до ответа — изменение видно только в коде
  // (пунктиром), после — и на странице.
  const after = answered;
  let blocks = [], codeBlocks = [], ghost = null;
  if (id === 'p') {
    const base = [pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP')];
    codeBlocks = base.concat(pb(pick, 'timeP', 'p', 'timeP')); ghost = after ? null : 'timeP';
    blocks = after ? codeBlocks : base;
  } else if (id === 'h') {
    const mk = (lvl) => [pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'), pb(pick, 'news', lvl, 'news'), pb(pick, 'newsP', 'p', 'newsP')];
    codeBlocks = mk('h3'); ghost = after ? null : 'news';
    blocks = after ? mk('h3') : mk('h2');
  } else {
    const plainB = [pb(pick, 'news', 'h2', 'news'), pb(pick, 'newsP', 'p', 'newsP')];
    const boldB = [pb(pick, 'news', 'h2', 'news'), blk('newsP', 'p', markParts(pick(PAGE.newsP), pick(PAGE.newsB), 'b'))];
    codeBlocks = boldB; ghost = after ? null : 'newsP';
    blocks = after ? boldB : plainB;
  }
  const order = id === 'h' ? ['a', 'b', 'c'] : id === 'p' ? ['a', 'b'] : ['a', 'b', 'c'];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : R.q} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} />
      <Ask text={done ? c.askDone : R.q} n={done ? null : (ri + 1) + '/3'} />
      {!done ? (
        <Work cls="tr-work"
          browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} flash={after ? { id: id === 'p' ? 'timeP' : id === 'h' ? 'news' : 'newsP', n: 1 } : null} />} />}
          code={<Src lines={srcLines(codeBlocks, { frame: 'none' })} className="tr-src" lineProps={(ln) => (ln.id === ghost ? { cls: 'tr-ghost' } : ln.id === (id === 'p' ? 'timeP' : id === 'h' ? 'news' : 'newsP') ? { cls: 'is-hl' } : null)} />} />
      ) : (
        <Work cls="tr-work" browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={[pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'), pb(pick, 'timeP', 'p', 'timeP'),
          pb(pick, 'news', 'h3', 'news'), blk('newsP', 'p', markParts(pick(PAGE.newsP), pick(PAGE.newsB), 'b'))]} />} />}
          code={<Src lines={srcLines([pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'), pb(pick, 'timeP', 'p', 'timeP'),
            pb(pick, 'news', 'h3', 'news'), blk('newsP', 'p', markParts(pick(PAGE.newsP), pick(PAGE.newsB), 'b'))], { frame: 'body' })} className="tr-src" />} />
      )}
      {!done ? (
        <>
          {!answered ? <Opts opts={R.opts} order={order} onPick={choose} canTap={canTap} picked={picked[id]} answer={R.answer} led={led} /> : (
            // После ответа — одна строка: верный ответ и кнопка дальше (экран не растёт).
            <div className={'tr-verdict' + (picked[id] === R.answer ? ' is-ok' : ' is-no')}>
              <span className="tr-verdict-ic"><Icon name={picked[id] === R.answer ? 'check' : 'bulb'} size={16} /></span>
              <span className="tr-verdict-t">{pick(R.opts[R.answer])}</span>
              <button type="button" className="btn-accent tr-next-b" disabled={!canTap} onClick={next}>
                {pick(ri < 2 ? UI.nextQ : UI.done)}<Icon name="arrowR" size={16} /></button>
            </div>
          )}
        </>
      ) : null}
    </Stage>
  );
}

// ── 12. ПОЧИНИ СТРОКУ. Три поломки: граница выделения, порядок закрытия, пара тегов.
// У каждой — основной пример и дополнительный (после сильной помощи).
const S12_ROUNDS = [
  { id: 'edge', kind: 'edge', key: 'birdsP', open: 'roundB', want: 'roundB', bad: 'birdsP', x: { key: 'finalP', open: 'finalB', want: 'finalB' } },
  { id: 'nest', kind: 'nest', key: 'thoughtP', frag: 'thoughtI', tag: 'i', x: { key: 'hurrayP', frag: 'hurrayI', tag: 'i' } },
  { id: 'pair', kind: 'pair', key: 'winP', frag: 'winB', tag: 'b', wrongClose: 'i', next: 'newsP', x: { key: 'kodiP', frag: 'kodiI', tag: 'i', wrongClose: 'b', next: 'newsP' } }
];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const stat = useStat('s12', 'fix', ['edge', 'nest', 'pair']);
  const [rec, put] = useRec('s12');
  const [ri, setRi] = useState(rec ? 3 : 0);
  const [isX, setIsX] = useState(false);
  const [edgeEnd, setEdgeEnd] = useState(null);      // индекс токена, после которого стоит </b>
  const [nestAt, setNestAt] = useState('out');       // место </i>: 'out' (после </p>), 'end' (перед </p>) или индекс слова
  const [pairPick, setPairPick] = useState(false);   // найден тег без пары
  const [fixed, setFixed] = useState(false);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const done = ri >= 3;
  const R = S12_ROUNDS[Math.min(ri, 2)];
  const D = isX ? Object.assign({}, R, R.x) : R;
  const key = R.id + (isX ? 'x' : '');
  const help = useHelp(stat, key, !done && !fixed);
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.intro.edge, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done && !fixed, ri * 10 + help.lv + (isX ? 5 : 0));
  const text = pick(PAGE[D.key]);
  const toks = useMemo(() => toTokens(text), [text]);
  const wIdx = (s) => { const r = findRange(toks, s); return r ? r : null; };
  // Граница: открывающий <b> — перед словом open; конец по умолчанию — последнее слово фразы.
  const openR = R.kind === 'edge' ? wIdx(pick(PAGE[D.open])) : null;
  const wantR = R.kind === 'edge' ? wIdx(pick(PAGE[D.want])) : null;
  const lastWord = (() => { for (let i = toks.length - 1; i >= 0; i -= 1) if (toks[i].w) return i; return 0; })();
  const curEnd = edgeEnd == null ? lastWord : edgeEnd;
  // Порядок: слова мысли.
  const fragR = R.kind !== 'edge' ? wIdx(pick(PAGE[D.frag]).replace(/[!?.…]+$/, '')) : null;
  let fragEnd = fragR ? fragR[1] : 0;
  while (toks[fragEnd + 1] && /^[!?.…]+$/.test(toks[fragEnd + 1].v)) fragEnd += 1;
  const vars = R.kind === 'edge' ? { t: pick(PAGE[D.want]) } : R.kind === 'pair' ? { w: '</' + D.tag + '>' } : {};
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints[R.kind], help.lv, vars)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const startRound = (i, x) => {
    setEdgeEnd(null); setNestAt('out'); setPairPick(false); setFixed(false); setMsg(null); help.reset();
    if (x) { setIsX(true); return; }
    setIsX(false); setRi(i);
  };
  const missWith = (why) => {
    sfx('soft', true); stat.miss(key);
    const lv = help.bump();
    const h = lv >= 3 ? joinL(why, fillL(c.hints[R.kind][2], vars)) : why;
    setMsg(h); sayNow(h, 'think');
  };
  const win = () => {
    sfx('ok', true); stat.pass(key); setFixed(true); setMsg(null);
    const strong = help.ref.current >= 3;
    if (!isX && strong) { sayNow(joinL(c.ok[R.kind], c.extraSay), 'smile'); setTimeout(() => startRound(ri, true), reduceMotion() ? 0 : 1200); return; }
    if (ri >= 2) { setRi(3); put({ done: true }); sayNow(joinL(c.ok[R.kind], c.done), 'cheer'); return; }
    sayNow(joinL(c.ok[R.kind], c.intro[S12_ROUNDS[ri + 1].kind]), 'smile');
    setTimeout(() => startRound(ri + 1, false), reduceMotion() ? 0 : 900);
  };
  // ── действия
  const tapEdge = (i) => {
    if (!canTap || fixed) return;
    if (i < openR[0]) { missWith(c.edgeBefore); return; }
    setEdgeEnd(i);
    if (i === wantR[1]) { win(); return; }
    missWith(fillL(c.edgeNow, { f: toks.slice(openR[0], i + 1).map((t) => t.v).join(''), t: pick(PAGE[D.want]) }));
  };
  const tapNest = (at) => {
    if (!canTap || fixed) return;
    setNestAt(at);
    if (at === 'end') { win(); return; }
    missWith(at === 'out' ? c.nestOut : c.nestPart);
  };
  const tapPairTag = (which) => {
    if (!canTap || fixed) return;
    if (which === 'close') { sfx('tap', true); setPairPick(true); setMsg(null); return; }
    missWith(D.tag === 'i' ? c.pairFineI : c.pairFine);
  };
  const pickPair = (t) => {
    if (!canTap || fixed) return;
    const want = D.tag;
    if (t === want) { setPairPick(false); win(); return; }
    missWith(t === 'p' ? c.pairP : c.pairSame);
  };
  // ── модель строки для кода и страницы
  let blocks = [], line = null;
  if (R.kind === 'edge') {
    const end = fixed ? wantR[1] : curEnd;
    const marks = [{ a: openR[0], b: end, tag: 'b' }];
    blocks = [blk('l', 'p', partsFrom(toks, marks))];
    line = (
      <span className="tr-fixline"><Tag tag="p" />
        {toks.map((t, i) => {
          const inB = i >= openR[0] && i <= end;
          const open = i === openR[0] ? <Tag tag="b" /> : null;
          const close = i === end ? <Tag tag="b" close /> : null;
          if (!t.w) return <React.Fragment key={i}>{open}<span className="wl-sp">{t.v}</span>{close}</React.Fragment>;
          return (
            <React.Fragment key={i}>{open}
              <button type="button" className={'wl-w' + (inB ? ' is-mark is-b' : '') + (help.lv >= 3 && i === wantR[1] ? ' is-hlr' : '') + (led && !fixed ? ' is-led' : '')}
                disabled={!canTap || fixed} onClick={() => tapEdge(i)}>{t.v}</button>{close}
            </React.Fragment>
          );
        })}
        <Tag tag="p" close /></span>
    );
  } else if (R.kind === 'nest') {
    const a = fragR ? fragR[0] : 0;
    const iEnd = fixed || nestAt === 'end' || nestAt === 'out' ? fragEnd : nestAt;
    blocks = [blk('l', 'p', partsFrom(toks, [{ a, b: iEnd, tag: 'i' }]))];
    const slot = (at, label) => (
      <button key={'s' + at} type="button" className={'tr-ins' + (nestAt === at ? ' is-here' : '') + (help.lv >= 3 && at === 'end' ? ' is-glow' : '')}
        disabled={!canTap || fixed} onClick={() => tapNest(at)} aria-label={label}>{nestAt === at ? <Tag tag="i" close /> : <span className="tr-ins-dot" aria-hidden="true">▾</span>}</button>
    );
    line = (
      <span className="tr-fixline"><Tag tag="p" />
        {toks.map((t, i) => (
          <React.Fragment key={i}>
            {i === a ? <Tag tag="i" /> : null}
            <span className={t.w ? 'tr-w' + (i >= a && i <= iEnd ? ' is-i' : '') : 'wl-sp'}>{t.v}</span>
            {i >= a && fragR && i < fragR[1] && t.w ? slot(i, String(i)) : null}
          </React.Fragment>
        ))}
        {slot('end', 'end')}<Tag tag="p" close />{slot('out', 'out')}
      </span>
    );
  } else {
    const frag = pick(PAGE[D.frag]).replace(/[!?.…]+$/, '');
    const r = wIdx(frag);
    const nextText = pick(PAGE[D.next]);
    if (fixed) blocks = [blk('l', 'p', partsFrom(toks, [{ a: r[0], b: r[1], tag: D.tag }])), blk('n', 'p', nextText)];
    else {
      // Честно: тег без своей пары не закрыт — выделение идёт до конца страницы.
      const parts = partsFrom(toks, [{ a: r[0], b: toks.length - 1, tag: D.tag }]);
      blocks = [blk('l', 'p', parts), blk('n', 'p', [{ k: D.tag, v: nextText }])];
    }
    const btnTag = (tg, close, which) => (
      <button type="button" className={'tr-tagbtn' + (which === 'close' && (pairPick || help.lv >= 3) ? ' is-glow' : '')} disabled={!canTap || fixed} onClick={() => tapPairTag(which)}>
        <Tag tag={tg} close={close} />
      </button>
    );
    line = (
      <span className="tr-fixline">
        {btnTag('p', false, 'p1')}
        {toks.map((t, i) => (
          <React.Fragment key={i}>
            {i === r[0] ? btnTag(D.tag, false, 'open') : null}
            <span className={t.w ? 'tr-w' : 'wl-sp'}>{t.v}</span>
            {i === r[1] ? (fixed ? <Tag tag={D.tag} close /> : btnTag(D.wrongClose, true, 'close')) : null}
          </React.Fragment>
        ))}
        {btnTag('p', true, 'p2')}
      </span>
    );
  }
  const codeLines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }, { key: 'l', id: 'l', d: 1, tag: 'p', toks: [{ k: 'node', node: line }] }]
    .concat(R.kind === 'pair' ? srcLines([blk('n', 'p', pick(PAGE[D.next]))], { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1 })) : [])
    .concat([{ key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const goal = R.kind === 'edge' ? fillL(c.goals.edge, { t: pick(PAGE[D.want]) }) : c.goals[R.kind];
  const task = R.kind === 'pair' && pairPick ? c.tasks.pair2 : c.tasks[R.kind];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints[R.kind], help.lv, vars)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      {done ? <GoalCard done doneText={c.askDone} /> : <GoalCard goal={goal} n={ri + 1} total={3} />}
      {!done ? <Ask text={task} hint={msg} /> : null}
      {!done ? (
        <Work cls="tr-work"
          browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} flash={fixed ? { id: 'l', n: ri * 2 + (isX ? 1 : 0) } : null} />} />}
          code={<Src lines={codeLines} className="tr-src" lineProps={(ln) => (ln.id === 'l' ? { cls: 'is-hl' + (fixed ? ' tr-fixed' : '') + (shake ? ' tr-shake' : '') } : null)} />} />
      ) : (
        <Work cls="tr-work" browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={[
          blk('a', 'p', markParts(pick(PAGE.birdsP), pick(PAGE.roundB), 'b')), blk('b', 'p', markParts(pick(PAGE.thoughtP), pick(PAGE.thoughtI), 'i')),
          blk('c', 'p', markParts(pick(PAGE.winP), pick(PAGE.winB), 'b')), pb(pick, 'n', 'p', 'newsP')]} />} />}
          code={<Src lines={srcLines([blk('a', 'p', markParts(pick(PAGE.birdsP), pick(PAGE.roundB), 'b')), blk('b', 'p', markParts(pick(PAGE.thoughtP), pick(PAGE.thoughtI), 'i')),
            blk('c', 'p', markParts(pick(PAGE.winP), pick(PAGE.winB), 'b'))], { frame: 'body' })} className="tr-src" />} />
      )}
      {!done && R.kind === 'pair' && pairPick && !fixed ? (
        <TagPick tags={['b', 'i', 'p'].map((x) => x)} onPick={(t) => pickPair(t)} canTap={canTap} glow={help.lv >= 3 ? D.tag : null} />
      ) : null}
    </Stage>
  );
}

// ── 13. ТВОЙ ТУРНИР. Семь шагов со счётчиком: тег → текст; ключевое слово; мысль.
function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const lang = useLang();
  const c = C.s13;
  const stat = useStat('s13', 'own-page', OWN_ORDER);
  const [rec, put] = useRec('s13');
  const [own, setOwn] = useState(() => rec || { tags: {}, texts: {}, acc: {}, bold: null, done: false });
  const [selWord, setSelWord] = useState(null);   // { line, at }
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [off, setOff] = useState([]);
  const [shake, setShake] = useState(null);
  const ownRef = useRef(own); ownRef.current = own;
  const save = (nx) => { const v = Object.assign({}, nx, { lang }); ownRef.current = v; setOwn(v); put(v); };
  // Шаг выполнен — по живому состоянию (правки после «Готово» учитываются).
  const tx = (id) => String(own.texts[id] || '');
  const stepOk = (id) => {
    if (id === 'b') return !!(own.bold && tx(own.bold.line).indexOf(own.bold.word) >= 0 && okText(own.bold.word));
    if (id === 'i') return own.tags.i === 'i' && okText(tx('i')) && !!own.acc.i;
    return own.tags[id] === OWN_TAG[id] && okText(tx(id)) && !!own.acc[id];
  };
  const curIdx = OWN_ORDER.findIndex((id) => !stepOk(id));
  const cur = curIdx < 0 ? null : OWN_ORDER[curIdx];
  const complete = curIdx < 0;
  const help = useHelp(stat, cur || 'h1', !complete);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec && rec.done ? c.done : c.say, pose: rec && rec.done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(complete && own.done, spoken);
  const phase = !cur ? 'done' : cur === 'b' ? (selWord ? 'btag' : 'bword') : cur === 'i' ? (okText(tx('i')) && own.acc.i ? 'itag' : 'itext')
    : own.tags[cur] === OWN_TAG[cur] ? 'text' : 'tag';
  const led = useIdleLed(canTap && !complete, (curIdx + 1) * 10 + (phase === 'text' ? 1 : 0));
  useEffect(() => { setOff([]); help.reset(); setMsg(null); }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps
  const wantTag = cur ? OWN_TAG[cur] : null;
  const vars = { t: wantTag || '' };
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv, vars)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  useWhen(complete && !own.done, () => { save(Object.assign({}, ownRef.current, { done: true })); sfx('win', true); sayNow(c.done, 'cheer'); });
  const inputRefs = useRef({});
  const focusLater = (id) => requestAnimationFrame(() => { const el = inputRefs.current[id]; if (el && el.focus) el.focus(); });
  const missWith = (why) => {
    sfx('soft', true); stat.miss(cur); setShake(cur); setTimeout(() => setShake(null), 420);
    const lv = help.bump();
    const h = lv >= 3 ? joinL(why, fillL(c.hints[2], vars)) : why;
    setMsg(h); sayNow(h, 'think');
  };
  const chooseTag = (t) => {
    if (!canTap || !cur) return;
    const n = ownRef.current;
    if (cur === 'b' || cur === 'i') {
      if (cur === 'b' && !selWord) return;
      if (t !== wantTag) { setOff((o) => o.concat(t)); missWith(c.wrong[wantTag]); return; }
      sfx('ok', true); setMsg(null);
      if (cur === 'b') { save(Object.assign({}, n, { bold: { line: selWord.line, word: selWord.word } })); setSelWord(null); }
      else save(Object.assign({}, n, { tags: Object.assign({}, n.tags, { i: 'i' }) }));
      stat.pass(cur);
      return;
    }
    if (t !== wantTag) {
      setOff((o) => o.concat(t));
      missWith(t === 'h1' && cur !== 'h1' ? c.wrong.h1taken : c.wrong[wantTag === 'p' ? 'p' : wantTag]);
      return;
    }
    sfx('pop', true); setMsg(null);
    save(Object.assign({}, n, { tags: Object.assign({}, n.tags, { [cur]: t }) }));
    focusLater(cur);
  };
  const setText = (id, v) => {
    const n = ownRef.current;
    const acc = Object.assign({}, n.acc);
    if (!okText(v)) acc[id] = false;
    save(Object.assign({}, n, { texts: Object.assign({}, n.texts, { [id]: v }), acc }));
    if (hasTags(v)) setMsg(c.noTags); else if (msg === c.noTags) setMsg(null);
  };
  // Автозасчёт текста текущего шага: через 1 с после правки.
  const curText = cur && cur !== 'b' ? tx(cur) : '';
  useAutoAccept(curText + '|' + cur, !!cur && cur !== 'b' && okText(curText) && !own.acc[cur] && (cur === 'i' || own.tags[cur] === OWN_TAG[cur]), () => {
    const n = ownRef.current;
    save(Object.assign({}, n, { acc: Object.assign({}, n.acc, { [cur]: true }) }));
    sfx('ok', true);
    if (cur !== 'i') stat.pass(cur);
    setEditing(null);
  });
  const tapWord = (line, at, word) => {
    if (!canTap || cur !== 'b') return;
    sfx('tap', true); setMsg(null);
    setSelWord({ line, at, word });
  };
  // ── код: строки по мере выбора тегов; текущая строка — поле ввода.
  const lineFor = (id) => {
    const t = own.tags[id];
    const isCur = id === cur;
    const isEdit = isCur || editing === id;
    if (!t) {
      if (!isCur) return null;
      return { key: id, id, d: 1, tag: 'h1', toks: [{ k: 'node', node: <span className="tr-slot-tag mono">?</span> }, { k: 'node', node: <span className="tr-role-ph">{pick(c.steps[id].role)}</span> }] };
    }
    const text = tx(id);
    let content;
    if (cur === 'b' && (id === 'p1' || id === 'p2')) {
      const tk = toTokens(text);
      content = <WordLine toks={tk} marks={[]} sel={selWord && selWord.line === id ? { a: selWord.at, b: selWord.at } : null}
        onWord={(i) => tapWord(id, i, tk[i].v)} canTap={canTap} led={led && !selWord} />;
    } else if (isEdit) {
      content = <InlineInput value={text} onChange={(v) => setText(id, v)} placeholder={c.steps[id].ph} max={id[0] === 'p' ? 110 : 50}
        label={c.steps[id].role} inputRef={{ set current(el) { inputRefs.current[id] = el; }, get current() { return inputRefs.current[id]; } }}
        onEnter={() => setEditing(null)} cls={(isCur && led && phase === 'text' ? 'is-led-in' : '') + (shake === id ? ' tr-shake' : '')} />;
    } else {
      const parts = own.bold && own.bold.line === id ? markParts(text, own.bold.word, 'b') : [txt(text)];
      content = parts.map((x, j) => (x.k === 'b' ? <React.Fragment key={j}><Tag tag="b" /><span className="tk-tx">{x.v}</span><Tag tag="b" close /></React.Fragment>
        : <span key={j} className="tk-tx">{x.v}</span>));
      return { key: id, id, d: 1, tag: t, edit: id, toks: [{ k: 'open', tag: t }, { k: 'node', node: content }, { k: 'close', tag: t }] };
    }
    return { key: id, id, d: 1, tag: t, toks: [{ k: 'open', tag: t }, { k: 'node', node: content }, { k: 'close', tag: t }] };
  };
  const thoughtLine = () => {
    if (curIdx >= 0 && curIdx < 6) return null;
    const isEdit = cur === 'i' || editing === 'i';
    const th = tx('i');
    const inner = isEdit && phase !== 'itag'
      ? <InlineInput value={th} onChange={(v) => setText('i', v)} placeholder={c.steps.i.ph} max={60} label={c.steps.i.role}
        inputRef={{ set current(el) { inputRefs.current.i = el; }, get current() { return inputRefs.current.i; } }}
        onEnter={() => setEditing(null)} cls={(led && phase === 'itext' ? 'is-led-in' : '') + (shake === 'i' ? ' tr-shake' : '')} />
      : own.tags.i === 'i'
        ? <><Tag tag="i" /><span className="tk-tx">{th}</span><Tag tag="i" close /></>
        : <span className="tk-tx tr-pending">{th}</span>;
    const still = !(isEdit && phase !== 'itag') && own.tags.i === 'i';
    return { key: 'i', id: 'i', d: 1, tag: 'p', edit: still ? 'i' : null, toks: [{ k: 'open', tag: 'p' }, { k: 'text', v: pick(UI.thoughtPre) + ' ' }, { k: 'node', node: inner }, { k: 'close', tag: 'p' }] };
  };
  const lines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }]
    .concat(['h1', 'h2', 'p1', 'h3', 'p2'].map(lineFor).filter(Boolean), [thoughtLine()].filter(Boolean),
      [{ key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const blocks = ownBlocks(own, pick);
  const title = ownTitle(own, pick);
  const role = cur ? c.steps[cur].role : null;
  const ask = complete ? c.askDone : phase === 'tag' ? fillL(c.askTag, { r: role }) : phase === 'text' ? fillL(c.askText, { r: role })
    : phase === 'bword' ? c.askB : phase === 'btag' ? fillL(c.askBTag, { w: selWord.word }) : phase === 'itext' ? fillL(c.askText, { r: role }) : c.askI2;
  const pickTags = phase === 'tag' ? (cur === 'h1' ? ['h1', 'h2', 'h3', 'p'] : ['h1', 'h2', 'h3', 'p']) : phase === 'btag' || phase === 'itag' ? ['b', 'i'] : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={complete ? c.askDone : msg || nextHint(c.hints, help.lv, vars)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={complete ? null : msg} n={complete ? null : pick(UI.step) + ' ' + (curIdx + 1) + '/7'} />
      <Work cls="tr-work tr-work-own"
        browser={<MiniBrowser title={title} cls="tr-mb" page={blocks.length ? <Page blocks={blocks} hl={cur && own.tags[cur] ? [cur] : null} /> : <div className="pg-wait">…</div>} />}
        code={<div className="tr-code">
          <Src lines={lines} className="tr-src tr-src-own" lineProps={(ln) => {
            if (ln.edit) {
              // Готовая строка — в одну строку (весь текст виден в браузере); карандаш — править.
              return { cls: 'tr-static', after: (
                <button type="button" className="tr-edit" onClick={() => { setEditing(ln.edit); focusLater(ln.edit); }} aria-label={pick(UI.edit)} disabled={!canTap}>
                  <Icon name="undo" size={13} /></button>
              ) };
            }
            return ln.id && (ln.id === cur || (cur === 'b' && (ln.id === 'p1' || ln.id === 'p2')))
              ? { cls: 'is-hl tr-typing' } : ln.id && ln.id === editing ? { cls: 'tr-typing' } : null;
          }} />
          {pickTags ? <TagPick tags={pickTags} onPick={chooseTag} canTap={canTap} off={off} glow={off.length >= 2 || help.lv >= 3 ? wantTag : null} led={led && phase !== 'text'} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 14. СТРАНИЦА ГОТОВА. Пиксель показывает страницу ученика; что получилось.
function S14({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s14;
  const own = store.get('s13');
  const ach = achievements(store);
  const allSelf = ACH.every(([k]) => ach[k] === 'self');
  const [speaker, , spoken] = useVoice([{ text: allSelf ? c.saySelf : c.sayHelp, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const blocks = own ? ownBlocks(own, pick) : demoPage(pick);
  const title = own ? ownTitle(own, pick) : pick(PAGE.name);
  const sub = blocks.find((b) => b.tag === 'h2');
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <SayLine speaker={speaker} />
      <div className="tr-fin">
        <div className="tr-fin-show">
          <Pix texts={{ scr1: title, scr2: sub ? plain(sub) : pick(UI.tourn) }} cls="tr-fig-fin" />
          <MiniBrowser title={title} cls="tr-mb tr-mb-fin" page={<Page blocks={blocks} />} />
        </div>
        <div className="tr-fin-side">
          {Object.keys(ach).length ? (
            <>
              <div className="ach tr-ach" aria-label={pick(UI.done)}>
                {ACH.filter(([k]) => ach[k]).map(([k]) => (
                  <span key={k} className={'ach-i' + (ach[k] === 'self' ? ' is-self' : '')}
                    aria-label={pick(c.ach[k]) + ' · ' + pick(ach[k] === 'self' ? UI.self : UI.helped)}>
                    <span className="ach-m"><Icon name={ach[k] === 'self' ? 'star' : 'check'} size={12} /></span>
                    {pick(c.ach[k])}
                  </span>
                ))}
              </div>
              <div className="tr-ach-legend">
                {ACH.some(([k]) => ach[k] === 'self') ? <span><span className="ach-m is-self"><Icon name="star" size={10} /></span>{pick(UI.self)}</span> : null}
                {ACH.some(([k]) => ach[k] === 'help') ? <span><span className="ach-m"><Icon name="check" size={10} /></span>{pick(UI.helped)}</span> : null}
              </div>
            </>
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
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'PREDICT', Comp: S3 },
  { id: 's4', code: 'SHOW', Comp: S4 }, { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-1', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 's8', code: 'LEVEL-2', Comp: S8 }, { id: 's9', code: 'SHOW', Comp: S9 },
  { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'PREDICT', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 },
  { id: 's13', code: 'RESULT', Comp: S13 }, { id: 's14', code: 'PREVIEW', Comp: S14 }
];
// «Повторить» стирает только решённое состояние экрана; учёт ('st:…') остаётся —
// сведения о подсказках и промахах не теряются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'] };

export default function HtmlZagolovkiTurnirPixel({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store), achievements: achievements(store) })
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
// CSS УРОКА: стили урока 2 (код, браузер, клавиши …) + кит anatomy + свои (tr-…).
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
.fig-robot.rb-css [data-paint="base"] { --anatomy-paper: #24345E; --anatomy-top: #66718e; --anatomy-shade-3: #3e4c71; --anatomy-shade-2: #24345E; --anatomy-shade-1: #202f55; --anatomy-shade-0: #1d2a4b; --anatomy-hi: #9ca4b7; --anatomy-mid: #77819b; --anatomy-lo: #5d6988; --anatomy-faint: #475478; --anatomy-dot: #a7aebf; }
.fig-robot.rb-css [data-paint="base2"] { --anatomy-paper: #2F4473; --anatomy-top: #6d7c9d; --anatomy-shade-3: #485a84; --anatomy-shade-2: #2F4473; --anatomy-shade-1: #2a3d68; --anatomy-shade-0: #26365c; --anatomy-hi: #a1abc0; --anatomy-mid: #7e8ba8; --anatomy-lo: #657597; --anatomy-faint: #506289; --anatomy-dot: #acb4c7; }
.fig-robot.rb-css [data-paint="plate"] { --anatomy-paper: #F4EBD9; --anatomy-top: #f7f1e4; --anatomy-shade-3: #f5edde; --anatomy-shade-2: #F4EBD9; --anatomy-shade-1: #dcd4c3; --anatomy-shade-0: #c3bcae; --anatomy-hi: #6e6a62; --anatomy-mid: #979287; --anatomy-lo: #b5aea1; --anatomy-faint: #cdc5b6; --anatomy-dot: #625e57; }
.fig-robot.rb-css [data-paint="limb"] { --anatomy-paper: #8C98AD; --anatomy-top: #afb7c6; --anatomy-shade-3: #9aa4b7; --anatomy-shade-2: #8C98AD; --anatomy-shade-1: #7e899c; --anatomy-shade-0: #707a8a; --anatomy-hi: #3f444e; --anatomy-mid: #575e6b; --anatomy-lo: #687080; --anatomy-faint: #768091; --anatomy-dot: #383d45; }
.fig-robot.rb-css [data-paint="limb2"] { --anatomy-paper: #A9B3C4; --anatomy-top: #c3cad6; --anatomy-shade-3: #b3bccb; --anatomy-shade-2: #A9B3C4; --anatomy-shade-1: #98a1b0; --anatomy-shade-0: #878f9d; --anatomy-hi: #4c5158; --anatomy-mid: #696f7a; --anatomy-lo: #7d8491; --anatomy-faint: #8e96a5; --anatomy-dot: #44484e; }
.fig-robot.rb-css [data-paint="frame"] { --anatomy-paper: #C9824A; --anatomy-top: #d9a880; --anatomy-shade-3: #cf9160; --anatomy-shade-2: #C9824A; --anatomy-shade-1: #b57543; --anatomy-shade-0: #a1683b; --anatomy-hi: #5a3b21; --anatomy-mid: #7d512e; --anatomy-lo: #956037; --anatomy-faint: #a96d3e; --anatomy-dot: #50341e; }
.fig-robot.rb-css [data-paint="shell"] { --anatomy-paper: #FF7A45; --anatomy-top: #ffa27d; --anatomy-shade-3: #ff8a5b; --anatomy-shade-2: #FF7A45; --anatomy-shade-1: #e66e3e; --anatomy-shade-0: #cc6237; --anatomy-hi: #73371f; --anatomy-mid: #9e4c2b; --anatomy-lo: #bd5a33; --anatomy-faint: #d6663a; --anatomy-dot: #66311c; }
.fig-robot.rb-css [data-paint="head"] { --anatomy-paper: #F4EBD9; --anatomy-top: #f7f1e4; --anatomy-shade-3: #f5edde; --anatomy-shade-2: #F4EBD9; --anatomy-shade-1: #dcd4c3; --anatomy-shade-0: #c3bcae; --anatomy-hi: #6e6a62; --anatomy-mid: #979287; --anatomy-lo: #b5aea1; --anatomy-faint: #cdc5b6; --anatomy-dot: #625e57; }
.fig-robot.rb-css [data-paint="hand"] { --anatomy-paper: #F4EBD9; --anatomy-top: #f7f1e4; --anatomy-shade-3: #f5edde; --anatomy-shade-2: #F4EBD9; --anatomy-shade-1: #dcd4c3; --anatomy-shade-0: #c3bcae; --anatomy-hi: #6e6a62; --anatomy-mid: #979287; --anatomy-lo: #b5aea1; --anatomy-faint: #cdc5b6; --anatomy-dot: #625e57; }
.fig-robot.rb-css [data-paint="face"] { --anatomy-paper: #1E2B4A; --anatomy-top: #626b80; --anatomy-shade-3: #394460; --anatomy-shade-2: #1E2B4A; --anatomy-shade-1: #1b2743; --anatomy-shade-0: #18223b; --anatomy-hi: #9aa0ae; --anatomy-mid: #747c8f; --anatomy-lo: #596279; --anatomy-faint: #424d67; --anatomy-dot: #a5aab7; }
.fig-robot.rb-css [data-paint="eye"] { --anatomy-paper: #5EEAD4; --anatomy-top: #8ef0e1; --anatomy-shade-3: #71edd9; --anatomy-shade-2: #5EEAD4; --anatomy-shade-1: #55d3bf; --anatomy-shade-0: #4bbbaa; --anatomy-hi: #2a695f; --anatomy-mid: #3a9183; --anatomy-lo: #46ad9d; --anatomy-faint: #4fc5b2; --anatomy-dot: #265e55; }
.fig-robot.rb-css [data-paint="mouth"] { --anatomy-paper: #5EEAD4; --anatomy-top: #8ef0e1; --anatomy-shade-3: #71edd9; --anatomy-shade-2: #5EEAD4; --anatomy-shade-1: #55d3bf; --anatomy-shade-0: #4bbbaa; --anatomy-hi: #5EEAD4; --anatomy-mid: #3a9183; --anatomy-lo: #46ad9d; --anatomy-faint: #4fc5b2; --anatomy-dot: #265e55; }
.fig-robot.rb-css [data-paint="screen"] { --anatomy-paper: #10213F; --anatomy-top: #586479; --anatomy-shade-3: #2d3c56; --anatomy-shade-2: #10213F; --anatomy-shade-1: #0e1e39; --anatomy-shade-0: #0d1a32; --anatomy-hi: #939ba9; --anatomy-mid: #6b7588; --anatomy-lo: #4e5b71; --anatomy-faint: #36455e; --anatomy-dot: #9fa6b2; }
.fig-robot.rb-css [data-paint="ans1"] { --anatomy-paper: #FFB703; --anatomy-top: #ffcd4f; --anatomy-shade-3: #ffc021; --anatomy-shade-2: #FFB703; --anatomy-shade-1: #e6a503; --anatomy-shade-0: #cc9202; --anatomy-hi: #735201; --anatomy-mid: #9e7102; --anatomy-lo: #bd8702; --anatomy-faint: #d69a03; --anatomy-dot: #664901; }
.fig-robot.rb-css [data-paint="ans2"] { --anatomy-paper: #4CC9F0; --anatomy-top: #82d9f5; --anatomy-shade-3: #61cff2; --anatomy-shade-2: #4CC9F0; --anatomy-shade-1: #44b5d8; --anatomy-shade-0: #3da1c0; --anatomy-hi: #225a6c; --anatomy-mid: #2f7d95; --anatomy-lo: #3895b2; --anatomy-faint: #40a9ca; --anatomy-dot: #1e5060; }
.fig-robot.rb-css [data-paint="btn1"] { --anatomy-paper: #4CC9F0; --anatomy-top: #82d9f5; --anatomy-shade-3: #61cff2; --anatomy-shade-2: #4CC9F0; --anatomy-shade-1: #44b5d8; --anatomy-shade-0: #3da1c0; --anatomy-hi: #225a6c; --anatomy-mid: #2f7d95; --anatomy-lo: #3895b2; --anatomy-faint: #40a9ca; --anatomy-dot: #1e5060; }
.fig-robot.rb-css [data-paint="btn2"] { --anatomy-paper: #FFD166; --anatomy-top: #ffdf94; --anatomy-shade-3: #ffd778; --anatomy-shade-2: #FFD166; --anatomy-shade-1: #e6bc5c; --anatomy-shade-0: #cca752; --anatomy-hi: #735e2e; --anatomy-mid: #9e823f; --anatomy-lo: #bd9b4b; --anatomy-faint: #d6b056; --anatomy-dot: #665429; }
.fig-robot.rb-css [data-paint="btn3"] { --anatomy-paper: #B388FF; --anatomy-top: #caacff; --anatomy-shade-3: #bc96ff; --anatomy-shade-2: #B388FF; --anatomy-shade-1: #a17ae6; --anatomy-shade-0: #8f6dcc; --anatomy-hi: #513d73; --anatomy-mid: #6f549e; --anatomy-lo: #8465bd; --anatomy-faint: #9672d6; --anatomy-dot: #483666; }
.fig-robot.rb-css [data-paint="ant"] { --anatomy-paper: #FFB703; --anatomy-top: #ffcd4f; --anatomy-shade-3: #ffc021; --anatomy-shade-2: #FFB703; --anatomy-shade-1: #e6a503; --anatomy-shade-0: #cc9202; --anatomy-hi: #735201; --anatomy-mid: #9e7102; --anatomy-lo: #bd8702; --anatomy-faint: #d69a03; --anatomy-dot: #664901; }
.fig-robot .rb-af { visibility: hidden; }
.fig-robot .rb-af-0 { visibility: visible; }
@keyframes rbAf0 { 0% { visibility: visible; } 33.846% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-0 { animation: rbAf0 3250ms step-end infinite; }
@keyframes rbAf1 { 0% { visibility: hidden; } 33.846% { visibility: visible; } 36.308% { visibility: hidden; } 97.231% { visibility: visible; } 100% { visibility: visible; } }
.fig-robot.rb-js .rb-af-1 { animation: rbAf1 3250ms step-end infinite; }
@keyframes rbAf2 { 0% { visibility: hidden; } 36.308% { visibility: visible; } 38.769% { visibility: hidden; } 94.462% { visibility: visible; } 97.231% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-2 { animation: rbAf2 3250ms step-end infinite; }
@keyframes rbAf3 { 0% { visibility: hidden; } 38.769% { visibility: visible; } 41.231% { visibility: hidden; } 91.692% { visibility: visible; } 94.462% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-3 { animation: rbAf3 3250ms step-end infinite; }
@keyframes rbAf4 { 0% { visibility: hidden; } 41.231% { visibility: visible; } 43.692% { visibility: hidden; } 57.692% { visibility: visible; } 59.692% { visibility: hidden; } 73.692% { visibility: visible; } 75.692% { visibility: hidden; } 89.692% { visibility: visible; } 91.692% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-4 { animation: rbAf4 3250ms step-end infinite; }
@keyframes rbAf5 { 0% { visibility: hidden; } 43.692% { visibility: visible; } 45.692% { visibility: hidden; } 55.692% { visibility: visible; } 57.692% { visibility: hidden; } 59.692% { visibility: visible; } 61.692% { visibility: hidden; } 71.692% { visibility: visible; } 73.692% { visibility: hidden; } 75.692% { visibility: visible; } 77.692% { visibility: hidden; } 87.692% { visibility: visible; } 89.692% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-5 { animation: rbAf5 3250ms step-end infinite; }
@keyframes rbAf6 { 0% { visibility: hidden; } 45.692% { visibility: visible; } 47.692% { visibility: hidden; } 53.692% { visibility: visible; } 55.692% { visibility: hidden; } 61.692% { visibility: visible; } 63.692% { visibility: hidden; } 69.692% { visibility: visible; } 71.692% { visibility: hidden; } 77.692% { visibility: visible; } 79.692% { visibility: hidden; } 85.692% { visibility: visible; } 87.692% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-6 { animation: rbAf6 3250ms step-end infinite; }
@keyframes rbAf7 { 0% { visibility: hidden; } 47.692% { visibility: visible; } 49.692% { visibility: hidden; } 51.692% { visibility: visible; } 53.692% { visibility: hidden; } 63.692% { visibility: visible; } 65.692% { visibility: hidden; } 67.692% { visibility: visible; } 69.692% { visibility: hidden; } 79.692% { visibility: visible; } 81.692% { visibility: hidden; } 83.692% { visibility: visible; } 85.692% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-7 { animation: rbAf7 3250ms step-end infinite; }
@keyframes rbAf8 { 0% { visibility: hidden; } 49.692% { visibility: visible; } 51.692% { visibility: hidden; } 65.692% { visibility: visible; } 67.692% { visibility: hidden; } 81.692% { visibility: visible; } 83.692% { visibility: hidden; } 100% { visibility: hidden; } }
.fig-robot.rb-js .rb-af-8 { animation: rbAf8 3250ms step-end infinite; }
/* ══ ТУРНИР ПИКСЕЛЯ — свои стили (префикс tr-) ═════════════════════════ */

/* Робот Пиксель (фигура урока 07): контейнер и слои «вид · движение». */
.tr-fig { position: relative; width: min(100%, calc(var(--fh, 30dvh) * var(--ar, 1))); aspect-ratio: var(--ar, 1); margin: 0 auto; flex: 0 0 auto;
  border-radius: 18px; overflow: hidden; background: radial-gradient(120% 90% at 50% 18%, #ffffff 0%, #f3f4f7 70%, #eceef3 100%);
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px rgba(${T.shadowBase},0.06); }
.tr-fig > svg { width: 100%; height: 100%; display: block; padding: 4px; box-sizing: border-box; }
.tr-fig.iso[data-theme="light"] { --anatomy-paper: #fbfbfa; --anatomy-lit: ${T.ink}; }
.fig-robot.rb-css [data-cls="scr1"] { fill: #FFD166; font-weight: 700; }
.fig-robot.rb-css [data-cls="scr2"] { fill: #FFFFFF; }
.fig-robot.rb-css [data-cls="ans"] { fill: #10213F; font-weight: 700; }
.fig-robot.rb-css [data-cls="plate"] { fill: #24345E; font-weight: 800; }
.fig-robot [data-cls="scr1"], .fig-robot [data-cls="scr2"] { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; letter-spacing: 0; }
.fig-robot .rb-eye, .fig-robot .rb-ant { transform-box: view-box; }
.fig-robot.rb-js.rb-html .rb-body { animation: rbBob 2.6s ease-in-out infinite; }
.fig-robot.rb-js .rb-eye { animation: rbBlink 3.8s ease-in-out infinite; }
.fig-robot.rb-js .rb-ant { animation: rbAnt 1.5s ease-in-out infinite; }
.fig-robot.rb-js .rb-caret { animation: rbCaret 1s steps(1, end) infinite; }
.fig-robot.rb-js .rb-ans { animation: rbAns 2.2s ease-in-out infinite; }
@keyframes rbBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
@keyframes rbBlink { 0%, 90%, 100% { transform: scaleY(1); } 94% { transform: scaleY(.12); } }
@keyframes rbAnt { 0%, 100% { filter: drop-shadow(0 0 0 rgba(255,183,3,0)); } 50% { filter: drop-shadow(0 0 6px rgba(255,183,3,.95)); } }
@keyframes rbCaret { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
@keyframes rbAns { 0%, 100% { opacity: 1; } 50% { opacity: .62; } }

/* Крючок: Пиксель и переключатель «Сейчас / Как надо». */
.tr-hook { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; }
.tr-fig-sm { --fh: min(19dvh, 170px); margin: 0; }
.tr-seg { position: relative; border-radius: 14px; }
.tr-seg .seg2 { min-width: 0; }
.tr-mb .mb-page { max-height: 38dvh; overflow-y: auto; scrollbar-width: thin; }

/* Реплика Коди текстом, когда голоса нет (телефон, экраны voiceTop). */
.tr-say { display: block; width: 100%; margin: 0; padding: 6px 12px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.ink};
  font: 600 13.5px/1.35 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.1); text-align: left; cursor: pointer; }
.tr-say.is-fold { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${T.ink2}; }
.tr-say-k { color: ${T.uiDk}; font-weight: 800; }

/* Рабочая область. */
.tr-work .work-b { min-width: 0; }
.tr-src .tk.is-hl { background: color-mix(in srgb, ${T.ui} 16%, #fff); box-shadow: 0 0 0 2px color-mix(in srgb, ${T.ui} 55%, transparent); }
.tr-src .src-line.tr-in .tk-tag { animation: trTagIn .5s cubic-bezier(.34,1.45,.5,1) both; }
@keyframes trTagIn { 0% { opacity: 0; transform: scale(.4); } 100% { opacity: 1; transform: none; } }
.tr-src .src-line.tr-fixed { background: color-mix(in srgb, ${T.success} 10%, transparent); }
.tr-src .src-line.tr-typing { background: color-mix(in srgb, ${T.ui} 6%, transparent); }
.tr-src .src-line.tr-enter { color: ${T.ink2}; }
.tr-src .src-line.tr-ghost { outline: 2px dashed color-mix(in srgb, ${T.ui} 60%, transparent); outline-offset: -2px; background: color-mix(in srgb, ${T.ui} 5%, transparent); }
.tr-src .tk-input { font-size: 16px; }
.tr-shake { animation: shake .4s; }
.tr-slot-tag { display: inline-flex; align-items: center; padding: 0 6px; margin-right: 6px; border-radius: 6px; border: 1.5px dashed ${TAGC.h};
  color: ${TAGC.h}; font-weight: 800; line-height: 1.35; }
.tr-role-ph { color: ${T.ink3}; font-style: italic; font-weight: 600; }

/* Кнопки тегов и варианты ответа. */
.tr-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.tr-tag { position: relative; display: inline-flex; align-items: center; justify-content: center; min-width: 64px; min-height: 46px; padding: 6px 14px;
  border: none; border-radius: 12px; background: #fff; cursor: pointer; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 16px;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.16), 0 3px 0 rgba(${T.shadowBase},0.08); transition: opacity .25s, transform .08s; }
.tr-tag:active:not(:disabled) { transform: scale(.95); }
.tr-tag.is-off { opacity: .35; }
.tr-tag.is-glow { box-shadow: inset 0 0 0 2.5px ${T.success}, 0 0 0 4px color-mix(in srgb, ${T.success} 20%, transparent); }
.tr-tag:disabled:not(.is-off) { opacity: .6; cursor: default; }
.tr-opts { display: flex; flex-direction: column; gap: 8px; width: 100%; }
@media (min-width: 720px) { .tr-opts { flex-direction: row; flex-wrap: wrap; justify-content: center; } .tr-opt { flex: 1 1 200px; max-width: 360px; } }
.tr-opt { position: relative; display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 8px 14px; border: none; border-radius: 14px;
  background: #fff; color: ${T.ink}; cursor: pointer; text-align: left; font: 700 15px/1.3 'Manrope', sans-serif;
  box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14), 0 3px 0 rgba(${T.shadowBase},0.07); }
.tr-opt:disabled { cursor: default; opacity: 1; }
.tr-opt:disabled:not(.is-ok):not(.is-no):not(.is-real):not(.is-off) { opacity: .6; }
.tr-opt.is-ok { box-shadow: inset 0 0 0 2.5px ${T.success}; background: ${T.successSoft}; }
.tr-opt.is-no { box-shadow: inset 0 0 0 2px ${T.hint}; background: ${T.hintSoft}; }
.tr-opt.is-real { box-shadow: inset 0 0 0 2.5px ${T.success}; }
.tr-opt.is-off { opacity: .4; }
.tr-opt.is-glow { box-shadow: inset 0 0 0 2.5px ${T.success}, 0 0 0 4px color-mix(in srgb, ${T.success} 20%, transparent); }
.tr-opt-ic { flex: 0 0 auto; min-width: 2.2em; padding: 2px 6px; border-radius: 8px; background: ${T.uiSoft}; color: ${T.uiDk}; font-size: 13px; text-align: center; }
.tr-next { display: flex; justify-content: center; }
.tr-verdict { display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 10px; border-radius: 14px; background: #fff; width: 100%;
  box-shadow: inset 0 0 0 2px ${T.success}; animation: zgUpTr .3s ease both; }
.tr-verdict.is-no { box-shadow: inset 0 0 0 2px ${T.hint}; background: ${T.hintSoft}; }
.tr-verdict-ic { flex: 0 0 auto; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: ${T.success}; color: #fff; }
.tr-verdict.is-no .tr-verdict-ic { background: ${T.hint}; }
.tr-verdict-t { flex: 1 1 auto; min-width: 0; font: 700 14px/1.3 'Manrope', sans-serif; color: ${T.ink}; }
.tr-verdict .tr-next-b { flex: 0 0 auto; min-height: 42px; padding: 8px 14px; font-size: 14px; }
@keyframes zgUpTr { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: none; } }
.tr-next-b { gap: 8px; }

/* Заголовок-деталь для вставки (экран 6) и места между строками. */
.tr-chip-row { display: flex; justify-content: center; }
.tr-chip { display: inline-flex; align-items: center; gap: 2px; padding: 6px 12px; border-radius: 12px; background: #fff; font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: calc(var(--cv-fs) * 1.05); box-shadow: inset 0 0 0 2px ${TAGC.h}, 0 6px 16px -10px ${TAGC.h}; animation: trFloat 2.4s ease-in-out infinite; }
@keyframes trFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.tr-src .src-line.tr-slot { min-height: 1.6em; color: ${T.uiDk}; font: 800 12.5px/1.6 'Manrope', sans-serif; letter-spacing: .02em;
  background: repeating-linear-gradient(90deg, color-mix(in srgb, ${T.ui} 22%, transparent) 0 6px, transparent 6px 11px) left 50% / 100% 2px no-repeat;
  animation: trSlotIn .4s ease both; }
.tr-src .src-line.tr-slot .src-code { background: ${T.paper}; padding: 0 6px; border-radius: 6px; }
.tr-src .src-line.tr-slot .src-n { visibility: hidden; }
@keyframes trSlotIn { 0% { opacity: 0; transform: translateX(-6px); } 100% { opacity: 1; transform: none; } }

/* Строка-кнопка «поставь заголовок перед ней» (экран 6). */
.tr-src .src-line.tr-pickline { box-shadow: inset 0 -1.5px 0 color-mix(in srgb, ${T.ui} 25%, transparent); }

/* Шесть уровней: смысл уровня рядом со строкой. */
.tr-mean { display: inline-block; margin-left: 8px; padding: 1px 8px; border-radius: 99px; background: color-mix(in srgb, ${TAGC.h} 10%, #fff);
  color: ${TAGC.h}; font: 700 11.5px/1.5 'Manrope', sans-serif; vertical-align: middle; }
.tr-src-lv .src-line.is-seen .src-n { color: ${TAGC.h}; }

/* Роли строк (экран 8). */
.tr-role { display: inline-block; margin-left: 6px; padding: 0 7px; font-size: 10.5px !important; border-radius: 99px; background: ${T.hintSoft}; color: #7A5600;
  font: 700 11.5px/1.5 'Manrope', sans-serif; vertical-align: middle; }
.tr-role.is-ok { background: ${T.successSoft}; color: ${T.success}; }

/* Починка строк (экран 12). */
.tr-fixline { display: inline; line-height: 2; }
.tr-w.is-i { font-style: italic; }
.tr-ins { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 26px; margin: 0 1px; padding: 0 3px; vertical-align: middle;
  border: none; border-radius: 7px; background: color-mix(in srgb, ${T.ui} 10%, #fff); color: ${T.uiDk}; cursor: pointer; font-size: 11px; }
.tr-ins.is-here { background: #fff; box-shadow: inset 0 0 0 1.5px ${TAGC.em}; }
.tr-ins.is-glow { box-shadow: inset 0 0 0 2px ${T.success}; }
.tr-ins:disabled { cursor: default; }
.tr-tagbtn { display: inline-flex; padding: 2px 3px; margin: 0 1px; border: none; border-radius: 7px; background: transparent; cursor: pointer; vertical-align: middle;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, ${T.ui} 30%, transparent); }
.tr-tagbtn.is-glow { box-shadow: inset 0 0 0 2px ${T.ui}; background: ${T.uiSoft}; }
.tr-tagbtn:disabled { cursor: default; box-shadow: none; }

/* Своя страница (экран 13). */
.tr-code { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.tr-edit { display: inline-grid; place-items: center; width: 26px; height: 26px; margin-left: 6px; vertical-align: middle; border: none; border-radius: 8px;
  background: ${T.uiSoft}; color: ${T.uiDk}; cursor: pointer; }
.tr-pending { color: ${T.ink2}; }
.tr-src-own .tk-input { max-width: calc(100% - 4.5em); }
.tr-src-own .src-line.tr-static { display: flex; align-items: center; }
.tr-src-own .src-line.tr-static .src-code { flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tr-src-own .src-line.tr-static .src-code, .tr-src-own .src-line.tr-static .src-code * { white-space: nowrap !important; }
.tr-src-own .src-line.tr-static .tr-edit { flex: 0 0 auto; width: 24px; height: 22px; margin-left: 4px; }

/* Финал. */
.tr-fin { display: grid; gap: 12px; width: 100%; }
.tr-fin-show { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 10px; align-items: center; }
.tr-fig-fin { --fh: min(24dvh, 260px); }
.tr-mb-fin .mb-page { max-height: 24dvh; }
.tr-fin-side { display: flex; flex-direction: column; gap: 10px; align-items: center; }
@media (min-width: 900px) { .tr-fin { grid-template-columns: minmax(0, 1.25fr) minmax(0, .75fr); align-items: center; } .tr-fig-fin { --fh: min(44dvh, 380px); } .tr-mb-fin .mb-page { max-height: 44dvh; } }
.ach { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.ach-i { display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px 4px 5px; border-radius: 99px; background: #fff; color: ${T.ink};
  font: 700 12.5px 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14); }
.ach-m { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: ${T.ink3}; color: #fff; }
.ach-i.is-self { box-shadow: inset 0 0 0 1.5px ${T.success}; }
.ach-i.is-self .ach-m { background: ${T.success}; }
.tr-ach { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; width: 100%; max-width: 520px; }
.tr-ach .ach-i { min-width: 0; font-size: 12px; line-height: 1.25; padding: 5px 8px 5px 5px; }
.tr-ach-legend { display: flex; gap: 14px; justify-content: center; color: ${T.ink2}; font: 600 12px/1.4 'Manrope', sans-serif; }
.tr-ach-legend > span { display: inline-flex; align-items: center; gap: 5px; }
.tr-ach-legend .ach-m { width: 16px; height: 16px; }
.ach-m.is-self { background: ${T.success}; }
.bye-next.next-card { width: 100%; max-width: 420px; align-self: center; background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 0 0 0 1.5px ${T.uiSoft}; }
.next-card .bye-next-ic { background: ${T.uiSoft}; color: ${T.uiDk}; border: none; }
.next-card .bye-next-t span { color: ${T.ink2}; }
.next-card .bye-next-t b { color: ${T.ink}; }
.next-tags { margin-left: auto; padding-left: 8px; color: ${T.uiDk}; font-size: 14px; font-weight: 700; white-space: nowrap; }

/* Телефон: компактнее браузер и подсказки. */
@media (max-width: 719px) {
  .tr-work .mb-page { max-height: 24dvh; overflow-y: auto; }
  .tr-work-own .mb-page { max-height: 20dvh; }
  .tr-opt { min-height: 44px; padding: 7px 12px; font-size: 14.5px; }
}
@media (max-height: 700px) {
  .tr-fig-sm { --fh: min(16dvh, 130px); }
  .tr-work .mb-page { max-height: 18dvh; }
  .tr-work .mb-top { height: 28px; }
  .tr-work-own .mb-page { max-height: 14dvh; }
  .tr-fig-fin { --fh: min(19dvh, 200px); }
  .tr-mb-fin .mb-page { max-height: 17dvh; }
  .tr-fin { gap: 8px; }
}
/* Открытая клавиатура: остаются задание и строка ввода. */
.is-kbd .tr-work .work-b, .is-kbd .tr-chip-row, .is-kbd .goal { display: none; }
.is-kbd .stage .ask.tr-ask { display: block; font-size: 14px; line-height: 1.3; }
.is-kbd .tr-src .src-line:not(.tr-typing):not(.is-hl) { display: none; }

@media (prefers-reduced-motion: reduce) {
  .fig-robot *, .fig-robot.rb-js.rb-html .rb-body { animation: none !important; transition: none !important; }
  .tr-src .src-line.tr-in .tk-tag, .tr-chip, .tr-src .src-line.tr-slot, .tr-shake { animation: none; }
}
`;
